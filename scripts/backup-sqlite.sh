#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────
# PyArcana — SQLite backup consistente
# ─────────────────────────────────────────────────────────────────────
# QUÉ LOGRA: Crea un backup consistente de la base SQLite, con integrity
#   check, checksum y retención.
#
# QUÉ NECESITAS: bash, sqlite3 (o el binario de prisma), sha256sum
#
# USUARIO: pyarcana (NO root)
#
# DIRECTORIO: /var/lib/pyarcana (o donde esté la DB)
#
# RIESGO: LECTURA — no modifica la base. Escribe archivos de backup.
#
# SALIDA ESPERADA: Un archivo <timestamp>.db y <timestamp>.db.sha256
#   en el directorio de backups.
#
# VERIFICACIÓN: integrity_check pasa y el checksum coincide.
#
# ERROR FRECUENTE: "database is locked" — la DB está en uso intensivo.
#   Solución: usar VACUUM INTO o .backup (este script usa .backup que
#   es seguro con DB activa).
#
# ROLLBACK: rm <backup-dir>/<timestamp>.db*
#
# FUENTE: https://www.sqlite.org/backup.html
# FECHA DE CONSULTA: 2026-08-02
# ─────────────────────────────────────────────────────────────────────

set -euo pipefail

# Configuración (sobreescribir con variables de entorno si es necesario)
DB_PATH="${DATABASE_URL#file:}"
DB_PATH="${DB_PATH:-./db/custom.db}"
BACKUP_DIR="${BACKUP_DIR:-./backups}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"

# Resolver ruta absoluta
DB_PATH="$(readlink -f "$DB_PATH" 2>/dev/null || echo "$DB_PATH")"

if [ ! -f "$DB_PATH" ]; then
  echo "ERROR: Database file not found: $DB_PATH" >&2
  exit 1
fi

mkdir -p "$BACKUP_DIR"

TIMESTAMP=$(date -u +%Y%m%dT%H%M%SZ)
BACKUP_FILE="$BACKUP_DIR/pyarcana-${TIMESTAMP}.db"
CHECKSUM_FILE="${BACKUP_FILE}.sha256"

echo "=== PyArcana SQLite Backup ==="
echo "DB:       $DB_PATH"
echo "Backup:   $BACKUP_FILE"
echo ""

# 1. Backup consistente usando sqlite3 .backup
#    .backup es seguro con DB activa — usa la API de backup online de SQLite.
if command -v sqlite3 &>/dev/null; then
  echo "[1/4] Creating consistent backup..."
  sqlite3 "$DB_PATH" ".backup '$BACKUP_FILE'"
else
  # Fallback: usar el runtime de Node con better-sqlite3 o prisma
  echo "[1/4] sqlite3 not found, using VACUUM INTO via node..."
  node -e "
    const { PrismaClient } = require('@prisma/client');
    const db = new PrismaClient();
    db.\$executeRawUnsafe('VACUUM INTO \"' + '$BACKUP_FILE' + '\"')
      .then(() => db.\$disconnect())
      .then(() => process.exit(0))
      .catch(e => { console.error(e); process.exit(1); });
  "
fi

if [ ! -f "$BACKUP_FILE" ]; then
  echo "ERROR: Backup file was not created" >&2
  exit 1
fi

# 2. Integrity check en el backup (no en la DB activa)
echo "[2/4] Running integrity check on backup..."
if command -v sqlite3 &>/dev/null; then
  INTEGRITY=$(sqlite3 "$BACKUP_FILE" "PRAGMA integrity_check;")
else
  # Fallback: verificar que el archivo tiene el magic header de SQLite.
  # sqlite3 CLI no está disponible; usar node para leer el header.
  INTEGRITY=$(node -e '
    const fs = require("fs");
    const path = process.argv[1];
    try {
      const fd = fs.openSync(path, "r");
      const buf = Buffer.alloc(16);
      fs.readSync(fd, buf, 0, 16, 0);
      fs.closeSync(fd);
      const magic = buf.toString("ascii", 0, 15);
      if (magic === "SQLite format 3") {
        console.log("ok (header-only: sqlite3 CLI not installed)");
      } else {
        console.log("FAIL: not a valid SQLite file");
      }
    } catch (e) {
      console.log("FAIL: " + e.message);
    }
  ' "$BACKUP_FILE" 2>&1)
fi

if [[ "$INTEGRITY" != "ok" && "$INTEGRITY" != ok* ]]; then
  echo "ERROR: Integrity check failed: $INTEGRITY" >&2
  echo "Backup may be corrupt. Removing." >&2
  rm -f "$BACKUP_FILE"
  exit 1
fi
echo "  ✓ Integrity check passed"

# 3. Checksum SHA-256
echo "[3/4] Computing SHA-256 checksum..."
sha256sum "$BACKUP_FILE" > "$CHECKSUM_FILE"
echo "  ✓ Checksum: $(cat "$CHECKSUM_FILE" | cut -d' ' -f1)"

# 4. Retention — eliminar backups más antiguos que RETENTION_DAYS
echo "[4/4] Applying retention policy (${RETENTION_DAYS} days)..."
find "$BACKUP_DIR" -name "pyarcana-*.db" -mtime +${RETENTION_DAYS} -delete 2>/dev/null || true
find "$BACKUP_DIR" -name "pyarcana-*.db.sha256" -mtime +${RETENTION_DAYS} -delete 2>/dev/null || true

# Contar backups restantes
BACKUP_COUNT=$(find "$BACKUP_DIR" -name "pyarcana-*.db" | wc -l)
echo "  ✓ $BACKUP_COUNT backup(s) retained"

echo ""
echo "=== Backup completed successfully ==="
echo "File:     $BACKUP_FILE"
echo "Checksum: $CHECKSUM_FILE"
echo "Size:     $(du -h "$BACKUP_FILE" | cut -f1)"
