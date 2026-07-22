import type { CourseSection } from '../../types'

export const section08: CourseSection = {
  id: "pandas",
  index: 8,
  title: "Archivos, CSV, JSON y contratos de ingesta",
  shortTitle: "Archivos & ETL",
  tagline: "pathlib, CSV/JSON, cuarentena y manifest de ingesta",
  estimatedHours: 19,
  level: "Intermedio",
  phase: 0,
  icon: "FileStack",
  accentColor: "bg-gradient-to-br from-green-500 to-emerald-600",
  jobRelevance:
    "El gate **CP-N1-B** se cierra cuando puedes **ingerir archivos reales de negocio** (aunque sean sintéticos en el curso): CSV de clientes, JSON de transacciones, cuarentena con motivo, hashes, backup y **manifest reconciliado**. En junior data/analytics engineering en Perú esto pesa más que un groupby de demo. Id de plataforma `pandas` se conserva; el contenido V3 es stdlib + contratos de ingesta (pandas EDA se difiere al nivel 2).",
  learningOutcomes: [
    { text: "Abrir archivos con pathlib/Path y with; encoding utf-8 explícito" },
    { text: "Manejar newlines y escritura atómica (temp + replace)" },
    { text: "Leer/escribir CSV con headers y casts controlados" },
    { text: "Enviar filas irregulares a cuarentena con motivo" },
    { text: "Serializar/deserializar JSON (array y JSONL)" },
    { text: "Validar schema mínimo, nulls y defaults compatibles" },
    { text: "Calcular hashes, backup y provenance de inputs" },
    { text: "Emitir manifest con conteos reconciliados in=clean+quarantine" },
  ],
  theory: [
    {
      heading: "De “Pandas EDA” a archivos, CSV/JSON y gate CP-N1-B (mapa)",
      paragraphs: [
        "En V3, **S08 no es el path principal de pandas groupby/merge/EDA**. Ese material se reubica al nivel 2 de data. Aquí cierras el gate **CP-N1-B**: ingesta **CSV + JSON** con **pathlib**, **cuarentena**, **hashes**, **manifest** y reconciliación de conteos — en **stdlib**.",
        "Integra normalizadores (S05–S07) y el modelo en memoria (S06). Entorno declarado **local-python** (filesystem). Datos sintéticos en `data/`; salidas en `out/`.",
        "Orden: **T1 Archivos** → **T2 CSV** → **T3 JSON** → **T4 Provenance y manifest**.",
      ],
      callout: {
        type: "info",
        title: "Gate CP-N1-B",
        content:
          "Al finalizar S08 debes poder demostrar ETL local con clean/quarantine/manifest. CLI instalable se difiere a S10. Sin PII real ni claims de fraude/parentesco.",
      },
    },
    {
      heading: "pathlib, with, modos y encodings",
      subtopicId: "S08-T1-A",
      paragraphs: [
        "`pathlib.Path` unifica rutas. `Path.read_text(encoding='utf-8')` / `write_text` son convenientes; `with path.open(...) as f` da control de modo.",
        "Modos: `r` lectura, `w` trunca, `a` append, `x` crea exclusivo. Siempre declara **`encoding='utf-8'`** en texto. `errors=` (`strict` default, `replace`) debe ser decisión documentada.",
        "`path.exists()` / `is_file()` evitan sorpresas. No asumas el cwd: usa paths relativos al proyecto o `Path(__file__).resolve().parent`.",
      ],
      code: {
        language: 'python',
        title: "path_utf8.py",
        code: `from pathlib import Path
import tempfile, os
td = Path(tempfile.mkdtemp())
p = td / "intake.txt"
p.write_text("línea1\\njosé\\n", encoding="utf-8")
print(p.exists(), p.read_text(encoding="utf-8").splitlines())
with p.open("a", encoding="utf-8") as f:
    f.write("extra\\n")
print(p.read_text(encoding="utf-8"))`,
        output: `True ['línea1', 'josé']
línea1
josé
extra
`,
      },
      callout: {
        type: "tip",
        title: "UTF-8 explícito",
        content:
          "En Windows el default no siempre es UTF-8. Nunca confíes en el locale para intake.",
      },
    },
    {
      heading: "Newlines y escritura atómica",
      subtopicId: "S08-T1-B",
      paragraphs: [
        "CSV en Python: abre con `newline=''` para que el módulo csv controle terminadores. Texto universal: prefiere `\\n` en salidas del pipeline.",
        "**Escritura atómica**: escribe a un archivo temporal en el mismo directorio y luego `os.replace(tmp, dest)`. Si el proceso muere a medias, no dejas el destino truncado.",
        "Detectar `\\r\\n` en inputs ayuda a documentar provenance de origen Windows vs Unix.",
      ],
      code: {
        language: 'python',
        title: "atomic_write.py",
        code: `from pathlib import Path
import os, tempfile
td = Path(tempfile.mkdtemp())
dest = td / "out.txt"

def write_atomic(path: Path, text: str) -> None:
    path = Path(path)
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(text, encoding="utf-8")
    os.replace(tmp, path)

write_atomic(dest, "hola\\n")
print(dest.read_text(encoding="utf-8"))
sample = b"a\\r\\nb\\n"
print("tiene CRLF", b"\\r\\n" in sample)`,
        output: `hola

tiene CRLF True`,
      },
      callout: {
        type: "warning",
        title: "No truncate a medias",
        content:
          "Evita open(dest,'w') largos sin temp si un crash deja basura a consumidores.",
      },
    },
    {
      heading: "Dialectos, headers y tipos",
      subtopicId: "S08-T2-A",
      paragraphs: [
        "`csv.DictReader` / `DictWriter` trabajan con headers. Declara `fieldnames`. Cast de tipos (`int`, `Decimal`) es **explícito** y fallos van a reject/cuarentena — no silencies con 0 mágico sin traza. El contrato monetario iniciado en S02 continúa: `Decimal` desde texto y cuantizado a `0.01`, nunca `float`.",
        "Fechas pueden quedarse como string ISO en N1-B si no hay parser de calendario aún; lo importante es el **contrato de columnas** documentado.",
        "Dialectos (delimitador `;` vs `,`) se configuran; no asumas Excel latam sin mirar el archivo.",
      ],
      code: {
        language: 'python',
        title: "csv_dict.py",
        code: `import csv, io
from decimal import Decimal, InvalidOperation
raw = "id,nombre,monto\\nC001,Ana,10.5\\nC002,Luis,20\\n"
reader = csv.DictReader(io.StringIO(raw))
for row in reader:
    row["monto"] = Decimal(row["monto"]).quantize(Decimal("0.01"))
    print(row)`,
        output: `{'id': 'C001', 'nombre': 'Ana', 'monto': Decimal('10.50')}
{'id': 'C002', 'nombre': 'Luis', 'monto': Decimal('20.00')}`,
      },
      callout: {
        type: "tip",
        title: "Cast controlado",
        content:
          "try/except InvalidOperation por monto → fila a cuarentena con motivo; conserva raw.",
      },
    },
    {
      heading: "Filas irregulares y cuarentena",
      subtopicId: "S08-T2-B",
      paragraphs: [
        "Filas con **más/menos columnas** que el header son irregulares. No las “arregles” en silencio: mándalas a `quarantine.csv` con **motivo** y conserva el raw.",
        "Resumen de motivos (`contador por reason`) alimenta el manifest y el dashboard de calidad.",
        "Good path escribe solo filas que pasaron schema + casts + normalización.",
      ],
      code: {
        language: 'python',
        title: "quarantine_rows.py",
        code: `import csv, io
text = "id,nombre\\nC001,Ana\\nC002,Luis,EXTRA\\nC003\\n"
reader = csv.reader(io.StringIO(text))
header = next(reader)
good, bad = [], []
for row in reader:
    if len(row) != len(header):
        bad.append({"raw": row, "reason": f"cols {len(row)}!={len(header)}"})
    else:
        good.append(dict(zip(header, row)))
print("good", good)
print("bad", bad)`,
        output: `good [{'id': 'C001', 'nombre': 'Ana'}]
bad [{'raw': ['C002', 'Luis', 'EXTRA'], 'reason': 'cols 3!=2'}, {'raw': ['C003'], 'reason': 'cols 1!=2'}]`,
      },
      callout: {
        type: "danger",
        title: "Silenciar irregular = deuda",
        content:
          "La fila extra se pierde o desalinea columnas y corrompe métricas.",
      },
    },
    {
      heading: "Objetos/arrays y serialización JSON",
      subtopicId: "S08-T3-A",
      paragraphs: [
        "`json.loads` / `dumps` y `load` / `dump` sobre archivos. JSON objects → dict; arrays → list. **JSONL** (un objeto por línea) es útil para streams de txs. JSON no tiene tipo Decimal: en este curso serializamos montos exactos como strings (`\"10.00\"`) y al leerlos reconstruimos `Decimal`; nunca los degradamos a float.",
        "`ensure_ascii=False` preserva tildes legibles. `sort_keys=True` ayuda a determinismo en manifests.",
        "`datetime` no es serializable por defecto: convierte a `isoformat()` o str para evitar TypeError.",
      ],
      code: {
        language: 'python',
        title: "json_ser.py",
        code: `import json
from datetime import date
data = [{"id": "T1", "día": date(2026, 1, 15).isoformat()}]
s = json.dumps(data, ensure_ascii=False, sort_keys=True)
print(s)
print(json.loads(s)[0]["id"])`,
        output: `[{"día": "2026-01-15", "id": "T1"}]
T1`,
      },
      callout: {
        type: "tip",
        title: "JSONL",
        content:
          "Para append-friendly logs de txs: una línea = un json.dumps(row).",
      },
    },
    {
      heading: "Schema, nulls y evolución compatible",
      subtopicId: "S08-T3-B",
      paragraphs: [
        "Valida **required keys** antes de normalizar. `null` JSON → `None` en Python. Distingue null explícito de clave ausente si la política lo requiere.",
        "Evolución: añadir campo opcional con **default** no rompe lectores viejos. Quitar required sí es breaking.",
        "`validate_schema(obj, required)` retorna ok/errors para cuarentena.",
      ],
      code: {
        language: 'python',
        title: "schema_nulls.py",
        code: `def validate_schema(obj, required):
    missing = [k for k in required if k not in obj]
    return (len(missing) == 0, missing)

print(validate_schema({"id": "C1", "email": None}, ["id", "email"]))
print(validate_schema({"id": "C1"}, ["id", "email"]))
obj = {"id": "C1"}
obj.setdefault("segment", "default")
print(obj)`,
        output: `(True, [])
(False, ['email'])
{'id': 'C1', 'segment': 'default'}`,
      },
      callout: {
        type: "warning",
        title: "null ≠ missing siempre",
        content:
          "Documenta si null borra valor o significa unknown.",
      },
    },
    {
      heading: "Backups, hashes y provenance",
      subtopicId: "S08-T4-A",
      paragraphs: [
        "`hashlib.sha256` del contenido del input fija un fingerprint en el manifest. Si el CSV cambia, el hash cambia — detectas reprocesos.",
        "Backup: copia `input.bak` o a `backups/` **antes** de transformar. No mutes el original in place.",
        "Provenance mínima: `{path, sha256, bytes, received_at}` por fuente.",
      ],
      code: {
        language: 'python',
        title: "hash_backup.py",
        code: `from pathlib import Path
import hashlib, tempfile, shutil
td = Path(tempfile.mkdtemp())
src = td / "clients.csv"
src.write_text("id,nombre\\nC001,Ana\\n", encoding="utf-8")
h = hashlib.sha256(src.read_bytes()).hexdigest()
bak = td / "clients.csv.bak"
shutil.copy2(src, bak)
print("sha256", h[:16] + "...")
print("bak exists", bak.exists())
print("provenance", {"path": str(src.name), "sha256": h, "bytes": src.stat().st_size})`,
        output: `sha256 206bcfbde4f213a5...
bak exists True
provenance {'path': 'clients.csv', 'sha256': '206bcfbde4f213a5b89c4d88b9a63d7b9c436b3b7c13db84e63445d1574f7eba', 'bytes': 19}`,
      },
      callout: {
        type: "tip",
        title: "Hash del input",
        content:
          "El manifest referencia el hash del archivo crudo, no del clean.",
      },
    },
    {
      heading: "Reconciliación y manifest de corrida",
      subtopicId: "S08-T4-B",
      paragraphs: [
        "Manifest JSON de la corrida: timestamps, versión y una entrada por fuente con `name`, hash y conteos `n_in`, `n_clean`, `n_quarantine`. Los totales de corrida se calculan sumando fuentes; no se escriben a mano.",
        "**Reconciliación en dos niveles**: cada fuente cumple `n_in == n_clean + n_quarantine` y los totales son la suma exacta de las fuentes. Validar solo el agregado puede ocultar un sobrante en CSV compensado por un faltante en JSON. Si cualquier fuente no cuadra, **falla la corrida** — no publiques clean a medias.",
        "Evidencia del gate CP-N1-B: scripts + fixtures + manifest de demo + tests + README.",
      ],
      code: {
        language: 'python',
        title: "manifest.py",
        code: `import json
sources = [
    {"name": "clients.csv", "sha256": "abc", "n_in": 6, "n_clean": 5, "n_quarantine": 1},
    {"name": "transactions.json", "sha256": "def", "n_in": 4, "n_clean": 3, "n_quarantine": 1},
]
for source in sources:
    source["reconcile_ok"] = source["n_in"] == source["n_clean"] + source["n_quarantine"]
manifest = {
    "sources": sources,
    "n_in": sum(s["n_in"] for s in sources),
    "n_clean": sum(s["n_clean"] for s in sources),
    "n_quarantine": sum(s["n_quarantine"] for s in sources),
}
manifest["reconcile_ok"] = all(s["reconcile_ok"] for s in sources)
print("reconcile_ok", manifest["reconcile_ok"])
print([(s["name"], s["reconcile_ok"]) for s in sources])`,
        output: `reconcile_ok True
[('clients.csv', True), ('transactions.json', True)]`,
      },
      callout: {
        type: "success",
        title: "Cierre CP-N1-B",
        content:
          "Si reconcile falla, el pipeline debe exit non-zero. Clean y quarantine siempre explicables.",
      },
    },
  ],
  iDo: {
    intro: "Ocho demos I Do T1→T4 en **local-python** (filesystem/temp). Cierran piezas del ETL gate CP-N1-B. Datos sintéticos únicamente.",
    steps: [
      {
        demoId: "S08-T1-A-DEMO",
        subtopicId: "S08-T1-A",
        environment: "local-python",
        description: "Leer y escribir intake UTF-8 con Path",
        code: {
          language: 'python',
          title: "S08-T1-A-DEMO — path",
          code: `from pathlib import Path
import tempfile
td = Path(tempfile.mkdtemp())
p = td / "intake.txt"
p.write_text("cliente;José Quispe\\n", encoding="utf-8")
text = p.read_text(encoding="utf-8")
print(text.strip())
print("exists", p.exists(), "size", p.stat().st_size)`,
          output: `cliente;José Quispe
exists True size 21`,
        },
        why: "Path + UTF-8 explícito es la base de toda ingesta local del gate.",
      },
      {
        demoId: "S08-T1-B-DEMO",
        subtopicId: "S08-T1-B",
        environment: "local-python",
        description: "write_atomic(path, text)",
        code: {
          language: 'python',
          title: "S08-T1-B-DEMO — atomic",
          code: `from pathlib import Path
import os, tempfile

def write_atomic(path: Path, text: str) -> None:
    path = Path(path)
    tmp = path.with_name(path.name + ".tmp")
    tmp.write_text(text, encoding="utf-8")
    os.replace(tmp, path)

td = Path(tempfile.mkdtemp())
dest = td / "clean.csv"
write_atomic(dest, "id,nombre\\nC001,Ana\\n")
print(dest.read_text(encoding="utf-8"))
print("tmp gone", not (td / "clean.csv.tmp").exists())`,
          output: `id,nombre
C001,Ana

tmp gone True`,
        },
        why: "os.replace hace el swap atómico del artefacto de salida.",
      },
      {
        demoId: "S08-T2-A-DEMO",
        subtopicId: "S08-T2-A",
        environment: "local-python",
        description: "Ingesta CSV con monto Decimal y fecha ISO string",
        code: {
          language: 'python',
          title: "S08-T2-A-DEMO — csv",
          code: `import csv, io
from decimal import Decimal
raw = "id,nombre,monto,fecha\\nC001,Ana,10.5,2026-01-10\\nC002,Luis,20,2026-01-11\\n"
rows = []
for row in csv.DictReader(io.StringIO(raw)):
    row["monto"] = Decimal(row["monto"]).quantize(Decimal("0.01"))
    # fecha queda ISO string (contrato N1-B)
    rows.append(row)
for r in rows:
    print(r["id"], r["monto"], type(r["monto"]).__name__, r["fecha"])`,
          output: `C001 10.50 Decimal 2026-01-10
C002 20.00 Decimal 2026-01-11`,
        },
        why: "DictReader + Decimal desde texto; fecha como string ISO documentado.",
      },
      {
        demoId: "S08-T2-B-DEMO",
        subtopicId: "S08-T2-B",
        environment: "local-python",
        description: "Separar good.csv vs quarantine.csv",
        code: {
          language: 'python',
          title: "S08-T2-B-DEMO — quar",
          code: `import csv, io
from pathlib import Path
import tempfile

text = "id,nombre\\nC001,Ana\\nC002,Luis,EXTRA\\nbadonly\\n"
reader = csv.reader(io.StringIO(text))
header = next(reader)
good, quar = [], []
for row in reader:
    if len(row) != len(header):
        quar.append({"raw": ",".join(row), "reason": "col_count"})
    else:
        good.append(dict(zip(header, row)))
td = Path(tempfile.mkdtemp())
with (td / "good.csv").open("w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=header)
    w.writeheader()
    w.writerows(good)
with (td / "quarantine.csv").open("w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=["raw", "reason"])
    w.writeheader()
    w.writerows(quar)
print("good", good)
print("quarantine", quar)
print((td / "good.csv").read_text(encoding="utf-8"))`,
          output: `good [{'id': 'C001', 'nombre': 'Ana'}]
quarantine [{'raw': 'C002,Luis,EXTRA', 'reason': 'col_count'}, {'raw': 'badonly', 'reason': 'col_count'}]
id,nombre
C001,Ana
`,
        },
        why: "Cuarentena con motivo deja audit trail; good solo tiene filas sanas.",
      },
      {
        demoId: "S08-T3-A-DEMO",
        subtopicId: "S08-T3-A",
        environment: "local-python",
        description: "Exportar results a JSON array + JSONL",
        code: {
          language: 'python',
          title: "S08-T3-A-DEMO — json",
          code: `import json
from pathlib import Path
import tempfile
rows = [{"id": "T1", "monto": "10.00"}, {"id": "T2", "monto": "5.00"}]
td = Path(tempfile.mkdtemp())
(td / "txs.json").write_text(
    json.dumps(rows, ensure_ascii=False, indent=2), encoding="utf-8"
)
with (td / "txs.jsonl").open("w", encoding="utf-8") as f:
    for r in rows:
        f.write(json.dumps(r, ensure_ascii=False) + "\\n")
print((td / "txs.json").read_text(encoding="utf-8"))
print("jsonl lines", (td / "txs.jsonl").read_text(encoding="utf-8").splitlines())`,
          output: `[
  {
    "id": "T1",
    "monto": "10.00"
  },
  {
    "id": "T2",
    "monto": "5.00"
  }
]
jsonl lines ['{"id": "T1", "monto": "10.00"}', '{"id": "T2", "monto": "5.00"}']`,
        },
        why: "Array JSON para batch pequeño; JSONL para append y streaming de txs.",
      },
      {
        demoId: "S08-T3-B-DEMO",
        subtopicId: "S08-T3-B",
        environment: "local-python",
        description: "validate_schema(obj, required) + campo opcional nuevo",
        code: {
          language: 'python',
          title: "S08-T3-B-DEMO — schema",
          code: `def validate_schema(obj, required):
    missing = [k for k in required if k not in obj]
    return len(missing) == 0, missing

required = ["id", "email"]
print(validate_schema({"id": "C1", "email": None}, required))
print(validate_schema({"id": "C1"}, required))
# evolución: campo opcional con default
obj = {"id": "C1", "email": "a@ex.com"}
obj.setdefault("segment", "standard")
print(obj)`,
          output: `(True, [])
(False, ['email'])
{'id': 'C1', 'email': 'a@ex.com', 'segment': 'standard'}`,
        },
        why: "Required estricto + defaults opcionales permiten evolucionar el contrato.",
      },
      {
        demoId: "S08-T4-A-DEMO",
        subtopicId: "S08-T4-A",
        environment: "local-python",
        description: "sha256 de input CSV + backup .bak",
        code: {
          language: 'python',
          title: "S08-T4-A-DEMO — hash",
          code: `from pathlib import Path
import hashlib, shutil, tempfile
td = Path(tempfile.mkdtemp())
src = td / "clients.csv"
src.write_text("id,nombre\\nC001,Ana\\n", encoding="utf-8")
digest = hashlib.sha256(src.read_bytes()).hexdigest()
bak = Path(str(src) + ".bak")
shutil.copy2(src, bak)
print(digest)
print("backup_ok", bak.exists() and bak.read_bytes() == src.read_bytes())`,
          output: `206bcfbde4f213a5b89c4d88b9a63d7b9c436b3b7c13db84e63445d1574f7eba
backup_ok True`,
        },
        why: "Hash + backup del crudo son la provenance mínima del gate.",
      },
      {
        demoId: "S08-T4-B-DEMO",
        subtopicId: "S08-T4-B",
        environment: "local-python",
        description: "manifest.json de una corrida ETL",
        code: {
          language: 'python',
          title: "S08-T4-B-DEMO — manifest",
          code: `import json
from pathlib import Path
import tempfile
sources = [
    {"name": "clients.csv", "sha256": "deadbeef", "n_in": 3, "n_clean": 2, "n_quarantine": 1},
    {"name": "transactions.json", "sha256": "cafebabe", "n_in": 2, "n_clean": 2, "n_quarantine": 0},
]
for source in sources:
    source["reconcile_ok"] = source["n_in"] == source["n_clean"] + source["n_quarantine"]
manifest = {
    "run_id": "demo-001",
    "sources": sources,
    "n_in": sum(s["n_in"] for s in sources),
    "n_clean": sum(s["n_clean"] for s in sources),
    "n_quarantine": sum(s["n_quarantine"] for s in sources),
    "reconcile_ok": all(s["reconcile_ok"] for s in sources),
}
td = Path(tempfile.mkdtemp())
path = td / "manifest.json"
path.write_text(json.dumps(manifest, indent=2, sort_keys=True), encoding="utf-8")
print(path.read_text(encoding="utf-8"))`,
          output: `{
  "n_clean": 4,
  "n_in": 5,
  "n_quarantine": 1,
  "reconcile_ok": true,
  "run_id": "demo-001",
  "sources": [
    {
      "n_clean": 2,
      "n_in": 3,
      "n_quarantine": 1,
      "name": "clients.csv",
      "reconcile_ok": true,
      "sha256": "deadbeef"
    },
    {
      "n_clean": 2,
      "n_in": 2,
      "n_quarantine": 0,
      "name": "transactions.json",
      "reconcile_ok": true,
      "sha256": "cafebabe"
    }
  ]
}`,
        },
        why: "El manifest prueba reconciliación por fuente y agregada; ninguna fuente puede esconder pérdidas detrás de otra.",
      },
    ],
  },
  weDo: {
    intro: "Andamiaje E1→E2→E3 × 8 (24 ejercicios, 2 hints). pathlib/csv/json/hashlib stdlib. Fail closed en reconcile. Sin pandas obligatorio.",
    steps: [
      {
        id: "S08-T1-A-E1",
        subtopicId: "S08-T1-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — En un temp dir, crea `Path` a `demo.txt`, escribe 'hola', comprueba `exists` e imprime True/False.",
        hint: "write_text + exists",
        hints: [
          "write_text + exists",
          "encoding utf-8",
        ],
        edgeCases: ["exists"],
        tests: "True",
        feedback: "exists evita abrir a ciegas.",
        starterCode: {
          language: 'python',
          title: "path_exists.py",
          code: `from pathlib import Path
import tempfile
td = Path(tempfile.mkdtemp())
# TODO`,
        },
        solutionCode: {
          language: 'python',
          title: "path_exists.py",
          code: `from pathlib import Path
import tempfile
td = Path(tempfile.mkdtemp())
p = td / 'demo.txt'
p.write_text('hola', encoding='utf-8')
print(p.exists())`,
          output: `True`,
        },
      },
      {
        id: "S08-T1-A-E2",
        subtopicId: "S08-T1-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — Escribe 3 líneas con with open, luego lee con readlines strip e imprime la lista.",
        hint: "with path.open('w', encoding='utf-8')",
        hints: [
          "with path.open('w', encoding='utf-8')",
          "newline natural \\n",
        ],
        edgeCases: ["with read"],
        tests: "['a','b','c']",
        feedback: "with cierra el handle aunque falle el cuerpo.",
        starterCode: {
          language: 'python',
          title: "with_lines.py",
          code: `from pathlib import Path
import tempfile
td = Path(tempfile.mkdtemp())
p = td / 'lines.txt'
# TODO write 3 lines y leer`,
        },
        solutionCode: {
          language: 'python',
          title: "with_lines.py",
          code: `from pathlib import Path
import tempfile
td = Path(tempfile.mkdtemp())
p = td / 'lines.txt'
with p.open('w', encoding='utf-8') as f:
    f.write('a\\nb\\nc\\n')
with p.open('r', encoding='utf-8') as f:
    lines = [ln.strip() for ln in f]
print(lines)`,
          output: `['a', 'b', 'c']`,
        },
      },
      {
        id: "S08-T1-A-E3",
        subtopicId: "S08-T1-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Simula UnicodeDecodeError leyendo bytes latinos como utf-8 strict si es latin-1 content… Mejor: escribe bytes no-UTF8 y captura UnicodeDecodeError al read_text utf-8. Imprime tipo de error y sugiere encoding o quarantine.",
        hint: "path.write_bytes(b'\\xff\\xfe') o latin1 bytes inválidos en utf-8",
        hints: [
          "path.write_bytes(b'\\xff\\xfe') o latin1 bytes inválidos en utf-8",
          "try/except UnicodeDecodeError",
        ],
        edgeCases: ["diagnóstico encoding"],
        tests: "UnicodeDecodeError",
        feedback: "Encoding roto → cuarentena de archivo, no crash silencioso a medias.",
        starterCode: {
          language: 'python',
          title: "diag_decode.py",
          code: `from pathlib import Path
import tempfile
td = Path(tempfile.mkdtemp())
p = td / 'bad.txt'
# TODO`,
        },
        solutionCode: {
          language: 'python',
          title: "diag_decode.py",
          code: `from pathlib import Path
import tempfile
td = Path(tempfile.mkdtemp())
p = td / 'bad.txt'
p.write_bytes(b'\\xff\\xfe\\xfa')
try:
    p.read_text(encoding='utf-8')
except UnicodeDecodeError as e:
    print(type(e).__name__)
    print('acción: cuarentenar archivo o reintentar con encoding documentado')`,
          output: `UnicodeDecodeError
acción: cuarentenar archivo o reintentar con encoding documentado`,
        },
      },
      {
        id: "S08-T1-B-E1",
        subtopicId: "S08-T1-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Detecta si un `bytes` sample contiene CRLF `\\r\\n`. Imprime True para sample Windows y False para solo `\\n`.",
        hint: "b'\\r\\n' in data",
        hints: [
          "b'\\r\\n' in data",
          "Dos samples.",
        ],
        edgeCases: ["CRLF"],
        tests: "True False",
        feedback: "Detectar newlines documenta origen del archivo.",
        starterCode: {
          language: 'python',
          title: "detect_crlf.py",
          code: `win = b'a\\r\\nb\\r\\n'
unix = b'a\\nb\\n'
# TODO`,
        },
        solutionCode: {
          language: 'python',
          title: "detect_crlf.py",
          code: `win = b'a\\r\\nb\\r\\n'
unix = b'a\\nb\\n'
print(b'\\r\\n' in win)
print(b'\\r\\n' in unix)`,
          output: `True
False`,
        },
      },
      {
        id: "S08-T1-B-E2",
        subtopicId: "S08-T1-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — Implementa `write_atomic` y verifica contenido final.",
        hint: "tmp + os.replace",
        hints: [
          "tmp + os.replace",
          "mismo directorio que dest",
        ],
        edgeCases: ["atomic"],
        tests: "ok",
        feedback: "Pieza reutilizable del ETL de salida.",
        starterCode: {
          language: 'python',
          title: "atomic_impl.py",
          code: `from pathlib import Path
import os, tempfile

def write_atomic(path, text):
    # TODO
    ...
td = Path(tempfile.mkdtemp())
p = td / 'out.txt'
write_atomic(p, 'ok\\n')
print(p.read_text(encoding='utf-8'))`,
        },
        solutionCode: {
          language: 'python',
          title: "atomic_impl.py",
          code: `from pathlib import Path
import os, tempfile

def write_atomic(path, text):
    path = Path(path)
    tmp = path.with_name(path.name + '.tmp')
    tmp.write_text(text, encoding='utf-8')
    os.replace(tmp, path)
td = Path(tempfile.mkdtemp())
p = td / 'out.txt'
write_atomic(p, 'ok\\n')
print(p.read_text(encoding='utf-8'))`,
          output: `ok
`,
        },
      },
      {
        id: "S08-T1-B-E3",
        subtopicId: "S08-T1-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Simula fallo mid-write: escribe dest parcial 'PARCIAL' y muestra que un atomic replace posterior deja 'COMPLETO'. Imprime ambos estados.",
        hint: "Primero write no atómico parcial; luego write_atomic",
        hints: [
          "Primero write no atómico parcial; luego write_atomic",
          "Contrasta riesgos.",
        ],
        edgeCases: ["mid-write vs atomic"],
        tests: "PARCIAL luego COMPLETO",
        feedback: "Atomic no arregla el pasado parcial; evita el estado intermedio al consumidor.",
        starterCode: {
          language: 'python',
          title: "midwrite.py",
          code: `from pathlib import Path
import os, tempfile
td = Path(tempfile.mkdtemp())
dest = td / 'f.txt'
# TODO parcial luego atomic`,
        },
        solutionCode: {
          language: 'python',
          title: "midwrite.py",
          code: `from pathlib import Path
import os, tempfile
td = Path(tempfile.mkdtemp())
dest = td / 'f.txt'
dest.write_text('PARCIAL', encoding='utf-8')
print('mid', dest.read_text(encoding='utf-8'))
tmp = dest.with_name(dest.name + '.tmp')
tmp.write_text('COMPLETO', encoding='utf-8')
os.replace(tmp, dest)
print('final', dest.read_text(encoding='utf-8'))`,
          output: `mid PARCIAL
final COMPLETO`,
        },
      },
      {
        id: "S08-T2-A-E1",
        subtopicId: "S08-T2-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — DictReader sobre StringIO con header id,nombre; imprime filas dict.",
        hint: "csv.DictReader",
        hints: [
          "csv.DictReader",
          "io.StringIO",
        ],
        edgeCases: ["header"],
        tests: "C001 Ana",
        feedback: "DictReader mapea columnas por nombre.",
        starterCode: {
          language: 'python',
          title: "dictreader.py",
          code: `import csv, io
raw = 'id,nombre\\nC001,Ana\\n'
# TODO`,
        },
        solutionCode: {
          language: 'python',
          title: "dictreader.py",
          code: `import csv, io
raw = 'id,nombre\\nC001,Ana\\n'
for row in csv.DictReader(io.StringIO(raw)):
    print(row)`,
          output: `{'id': 'C001', 'nombre': 'Ana'}`,
        },
      },
      {
        id: "S08-T2-A-E2",
        subtopicId: "S08-T2-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — Escribe CSV con DictWriter (header id,nombre) a StringIO o temp y relee contando filas de datos = 1.",
        hint: "writeheader + writerow",
        hints: [
          "writeheader + writerow",
          "newline='' si usas open file",
        ],
        edgeCases: ["writer header"],
        tests: "1 fila",
        feedback: "Writer con header estable es contrato de salida clean.",
        starterCode: {
          language: 'python',
          title: "dictwriter.py",
          code: `import csv, io
buf = io.StringIO()
# TODO write y read
print(n)`,
        },
        solutionCode: {
          language: 'python',
          title: "dictwriter.py",
          code: `import csv, io
buf = io.StringIO()
w = csv.DictWriter(buf, fieldnames=['id', 'nombre'])
w.writeheader()
w.writerow({'id': 'C001', 'nombre': 'Ana'})
buf.seek(0)
rows = list(csv.DictReader(buf))
n = len(rows)
print(n)
print(rows[0])`,
          output: `1
{'id': 'C001', 'nombre': 'Ana'}`,
        },
      },
      {
        id: "S08-T2-A-E3",
        subtopicId: "S08-T2-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Cast de monto: `Decimal` desde texto + quantize a céntimos; si lanza `InvalidOperation` → reject con motivo. Procesa `['10', 'x', '3.5']` e imprime ok/reject.",
        hint: "Decimal(v).quantize(Decimal('0.01')); except InvalidOperation",
        hints: [
          "Decimal(v).quantize(Decimal('0.01')); except InvalidOperation",
          "No uses float ni 0 silencioso.",
        ],
        edgeCases: ["cast fallido"],
        tests: "Contrato exacto: ok 10.00; reject x motivo=cast_monto; ok 3.50; sin float().",
        feedback: "Cast fallido alimenta cuarentena con motivo.",
        starterCode: {
          language: 'python',
          title: "cast_reject.py",
          code: `from decimal import Decimal, InvalidOperation

vals = ['10', 'x', '3.5']
# TODO`,
        },
        solutionCode: {
          language: 'python',
          title: "cast_reject.py",
          code: `from decimal import Decimal, InvalidOperation

vals = ['10', 'x', '3.5']
for v in vals:
    try:
        m = Decimal(v).quantize(Decimal('0.01'))
        print('ok', m)
    except InvalidOperation:
        print('reject', v, 'motivo=cast_monto')`,
          output: `ok 10.00
reject x motivo=cast_monto
ok 3.50`,
        },
      },
      {
        id: "S08-T2-B-E1",
        subtopicId: "S08-T2-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Detecta fila irregular: header len 2, row `['C1','Ana','x']` → irregular True.",
        hint: "len(row) != len(header)",
        hints: [
          "len(row) != len(header)",
          "print bool",
        ],
        edgeCases: ["col count"],
        tests: "True",
        feedback: "Chequeo barato antes de Dict zip.",
        starterCode: {
          language: 'python',
          title: "irregular.py",
          code: `header = ['id', 'nombre']
row = ['C1', 'Ana', 'x']
# TODO
print(irregular)`,
        },
        solutionCode: {
          language: 'python',
          title: "irregular.py",
          code: `header = ['id', 'nombre']
row = ['C1', 'Ana', 'x']
irregular = len(row) != len(header)
print(irregular)`,
          output: `True`,
        },
      },
      {
        id: "S08-T2-B-E2",
        subtopicId: "S08-T2-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — Escribe una fila de cuarentena `{raw, reason}` a CSV en temp y relee imprimiendo reason.",
        hint: "DictWriter fieldnames raw,reason",
        hints: [
          "DictWriter fieldnames raw,reason",
          "newline=''",
        ],
        edgeCases: ["escribir cuarentena"],
        tests: "col_count",
        feedback: "Cuarentena es archivo de primera clase del gate.",
        starterCode: {
          language: 'python',
          title: "write_quar.py",
          code: `from pathlib import Path
import csv, tempfile
td = Path(tempfile.mkdtemp())
# TODO`,
        },
        solutionCode: {
          language: 'python',
          title: "write_quar.py",
          code: `from pathlib import Path
import csv, tempfile
td = Path(tempfile.mkdtemp())
p = td / 'quarantine.csv'
with p.open('w', newline='', encoding='utf-8') as f:
    w = csv.DictWriter(f, fieldnames=['raw', 'reason'])
    w.writeheader()
    w.writerow({'raw': 'C2,Luis,EXTRA', 'reason': 'col_count'})
with p.open(encoding='utf-8') as f:
    rows = list(csv.DictReader(f))
print(rows[0]['reason'])`,
          output: `col_count`,
        },
      },
      {
        id: "S08-T2-B-E3",
        subtopicId: "S08-T2-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Dada lista de reasons, imprime resumen contador sorted por reason.",
        hint: "collections.Counter o dict",
        hints: [
          "collections.Counter o dict",
          "sorted items",
        ],
        edgeCases: ["resumen motivos"],
        tests: "conteos por reason",
        feedback: "Resumen de motivos entra al manifest.",
        starterCode: {
          language: 'python',
          title: "reason_summary.py",
          code: `reasons = ['col_count', 'cast_monto', 'col_count', 'schema']
# TODO resumen`,
        },
        solutionCode: {
          language: 'python',
          title: "reason_summary.py",
          code: `from collections import Counter
reasons = ['col_count', 'cast_monto', 'col_count', 'schema']
for k, v in sorted(Counter(reasons).items()):
    print(k, v)`,
          output: `cast_monto 1
col_count 2
schema 1`,
        },
      },
      {
        id: "S08-T3-A-E1",
        subtopicId: "S08-T3-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — `json.loads` de fixture `'{\"id\":\"C001\"}'` e imprime id.",
        hint: "json.loads",
        hints: [
          "json.loads",
          "dict access",
        ],
        edgeCases: ["loads"],
        tests: "C001",
        feedback: "loads parsea string; load parsea file.",
        starterCode: {
          language: 'python',
          title: "loads_fix.py",
          code: `import json
# TODO
print(obj['id'])`,
        },
        solutionCode: {
          language: 'python',
          title: "loads_fix.py",
          code: `import json
obj = json.loads('{"id":"C001"}')
print(obj['id'])`,
          output: `C001`,
        },
      },
      {
        id: "S08-T3-A-E2",
        subtopicId: "S08-T3-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — `dumps` de `{'nombre':'José'}` con ensure_ascii=False e imprime (debe verse José, no \\u).",
        hint: "ensure_ascii=False",
        hints: [
          "ensure_ascii=False",
          "print string",
        ],
        edgeCases: ["tildes"],
        tests: "José legible",
        feedback: "ensure_ascii=False para logs latam legibles.",
        starterCode: {
          language: 'python',
          title: "dumps_utf8.py",
          code: `import json
# TODO
print(s)`,
        },
        solutionCode: {
          language: 'python',
          title: "dumps_utf8.py",
          code: `import json
s = json.dumps({'nombre': 'José'}, ensure_ascii=False)
print(s)`,
          output: `{"nombre": "José"}`,
        },
      },
      {
        id: "S08-T3-A-E3",
        subtopicId: "S08-T3-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Intenta dumps de dict con datetime y captura TypeError; reintenta con isoformat str.",
        hint: "datetime no serializable",
        hints: [
          "datetime no serializable",
          "convierte a .isoformat()",
        ],
        edgeCases: ["TypeError datetime"],
        tests: "TypeError luego ISO",
        feedback: "Serializa tipos no-JSON de forma explícita.",
        starterCode: {
          language: 'python',
          title: "json_datetime.py",
          code: `import json
from datetime import datetime
obj = {'ts': datetime(2026, 1, 15, 10, 0, 0)}
# TODO`,
        },
        solutionCode: {
          language: 'python',
          title: "json_datetime.py",
          code: `import json
from datetime import datetime
obj = {'ts': datetime(2026, 1, 15, 10, 0, 0)}
try:
    json.dumps(obj)
except TypeError as e:
    print(type(e).__name__)
fixed = {'ts': obj['ts'].isoformat()}
print(json.dumps(fixed))`,
          output: `TypeError
{"ts": "2026-01-15T10:00:00"}`,
        },
      },
      {
        id: "S08-T3-B-E1",
        subtopicId: "S08-T3-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Rechaza missing required: obj sin email con required [id,email] → ok False.",
        hint: "list comprehension missing",
        hints: [
          "list comprehension missing",
          "print ok, missing",
        ],
        edgeCases: ["required"],
        tests: "False, ['email']",
        feedback: "Schema mínimo del contrato de ingesta.",
        starterCode: {
          language: 'python',
          title: "schema_required.py",
          code: `def validate_schema(obj, required):
    # TODO
    ...
print(validate_schema({'id': 'C1'}, ['id', 'email']))`,
        },
        solutionCode: {
          language: 'python',
          title: "schema_required.py",
          code: `def validate_schema(obj, required):
    missing = [k for k in required if k not in obj]
    return len(missing) == 0, missing
print(validate_schema({'id': 'C1'}, ['id', 'email']))`,
          output: `(False, ['email'])`,
        },
      },
      {
        id: "S08-T3-B-E2",
        subtopicId: "S08-T3-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — null explícito: `{'id':'C1','email': None}` tiene clave email (presente) con valor None. Imprime 'in' y valor.",
        hint: "'email' in obj",
        hints: [
          "'email' in obj",
          "None is not missing key",
        ],
        edgeCases: ["null explícito"],
        tests: "True / None",
        feedback: "null JSON llega como None con clave presente.",
        starterCode: {
          language: 'python',
          title: "null_explicit.py",
          code: `obj = {'id': 'C1', 'email': None}
# TODO`,
        },
        solutionCode: {
          language: 'python',
          title: "null_explicit.py",
          code: `obj = {'id': 'C1', 'email': None}
print('email' in obj)
print(obj['email'])`,
          output: `True
None`,
        },
      },
      {
        id: "S08-T3-B-E3",
        subtopicId: "S08-T3-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Añade campo opcional `segment` con default `'standard'` vía setdefault sin pisar si ya existe. Dos objs.",
        hint: "setdefault",
        hints: [
          "setdefault",
          "No uses overwrite ciego",
        ],
        edgeCases: ["evolución compatible"],
        tests: "standard vs vip",
        feedback: "Defaults compatibles no rompen productores viejos.",
        starterCode: {
          language: 'python',
          title: "default_field.py",
          code: `a = {'id': 'C1'}
b = {'id': 'C2', 'segment': 'vip'}
# TODO setdefault ambos
print(a)
print(b)`,
        },
        solutionCode: {
          language: 'python',
          title: "default_field.py",
          code: `a = {'id': 'C1'}
b = {'id': 'C2', 'segment': 'vip'}
a.setdefault('segment', 'standard')
b.setdefault('segment', 'standard')
print(a)
print(b)`,
          output: `{'id': 'C1', 'segment': 'standard'}
{'id': 'C2', 'segment': 'vip'}`,
        },
      },
      {
        id: "S08-T4-A-E1",
        subtopicId: "S08-T4-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Calcula sha256 hex de un archivo temp con contenido conocido e imprime los primeros 8 chars + len digest 64.",
        hint: "hashlib.sha256(path.read_bytes()).hexdigest()",
        hints: [
          "hashlib.sha256(path.read_bytes()).hexdigest()",
          "temp file",
        ],
        edgeCases: ["hash file"],
        tests: "len 64",
        feedback: "Fingerprint del input para el manifest.",
        starterCode: {
          language: 'python',
          title: "hash_file.py",
          code: `from pathlib import Path
import hashlib, tempfile
td = Path(tempfile.mkdtemp())
p = td / 'f.bin'
p.write_bytes(b'abc')
# TODO`,
        },
        solutionCode: {
          language: 'python',
          title: "hash_file.py",
          code: `from pathlib import Path
import hashlib, tempfile
td = Path(tempfile.mkdtemp())
p = td / 'f.bin'
p.write_bytes(b'abc')
dig = hashlib.sha256(p.read_bytes()).hexdigest()
print(dig[:8], len(dig))`,
          output: `ba7816bf 64`,
        },
      },
      {
        id: "S08-T4-A-E2",
        subtopicId: "S08-T4-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — Copia backup con shutil.copy2 y verifica igualdad de bytes.",
        hint: "shutil.copy2",
        hints: [
          "shutil.copy2",
          "read_bytes compare",
        ],
        edgeCases: ["backup"],
        tests: "True",
        feedback: "Backup antes de cualquier mutación del workspace de entrada.",
        starterCode: {
          language: 'python',
          title: "backup_copy.py",
          code: `from pathlib import Path
import shutil, tempfile
td = Path(tempfile.mkdtemp())
src = td / 'in.csv'
src.write_text('a\\n', encoding='utf-8')
# TODO bak`,
        },
        solutionCode: {
          language: 'python',
          title: "backup_copy.py",
          code: `from pathlib import Path
import shutil, tempfile
td = Path(tempfile.mkdtemp())
src = td / 'in.csv'
src.write_text('a\\n', encoding='utf-8')
bak = td / 'in.csv.bak'
shutil.copy2(src, bak)
print(bak.read_bytes() == src.read_bytes())`,
          output: `True`,
        },
      },
      {
        id: "S08-T4-A-E3",
        subtopicId: "S08-T4-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Arma dict de provenance `{path, sha256, bytes}` para un temp file e imprímelo (path solo name).",
        hint: "stat().st_size",
        hints: [
          "stat().st_size",
          "sha256 completo ok",
        ],
        edgeCases: ["provenance dict"],
        tests: "3 keys",
        feedback: "Provenance mínima por fuente del gate.",
        starterCode: {
          language: 'python',
          title: "provenance_dict.py",
          code: `from pathlib import Path
import hashlib, tempfile
td = Path(tempfile.mkdtemp())
p = td / 'clients.csv'
p.write_text('id\\nC1\\n', encoding='utf-8')
# TODO provenance`,
        },
        solutionCode: {
          language: 'python',
          title: "provenance_dict.py",
          code: `from pathlib import Path
import hashlib, tempfile
td = Path(tempfile.mkdtemp())
p = td / 'clients.csv'
p.write_text('id\\nC1\\n', encoding='utf-8')
prov = {
    'path': p.name,
    'sha256': hashlib.sha256(p.read_bytes()).hexdigest(),
    'bytes': p.stat().st_size,
}
print(prov)`,
          output: `{'path': 'clients.csv', 'sha256': 'b776a3a3926835c70a8b32f595320ba866cf1c5c8d9106d2e50f36b5a9548fc9', 'bytes': 6}`,
        },
      },
      {
        id: "S08-T4-B-E1",
        subtopicId: "S08-T4-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Construye un manifest con `run_id` y `sources`: cada fuente incluye name, sha256, n_in, n_clean, n_quarantine y reconcile_ok. Deriva los tres totales con sum; no los hardcodees.",
        hint: "Calcula reconcile_ok por fuente antes de sumar",
        hints: [
          "Calcula reconcile_ok por fuente antes de sumar",
          "sources contiene clients.csv y transactions.json.",
        ],
        edgeCases: ["dos fuentes", "totales derivados"],
        tests: "Contrato exacto: totales 5/4/1; ambas fuentes reconcile_ok=True; manifest reconcile_ok=True.",
        feedback: "El contrato conserva provenance y conteos por fuente.",
        starterCode: {
          language: 'python',
          title: "manifest_min.py",
          code: `sources = [
    {'name': 'clients.csv', 'sha256': 'abc', 'n_in': 3, 'n_clean': 2, 'n_quarantine': 1},
    {'name': 'transactions.json', 'sha256': 'def', 'n_in': 2, 'n_clean': 2, 'n_quarantine': 0},
]
# TODO reconcile por fuente + totales derivados
print(manifest)`,
        },
        solutionCode: {
          language: 'python',
          title: "manifest_min.py",
          code: `sources = [
    {'name': 'clients.csv', 'sha256': 'abc', 'n_in': 3, 'n_clean': 2, 'n_quarantine': 1},
    {'name': 'transactions.json', 'sha256': 'def', 'n_in': 2, 'n_clean': 2, 'n_quarantine': 0},
]
for source in sources:
    source['reconcile_ok'] = source['n_in'] == source['n_clean'] + source['n_quarantine']
manifest = {
    'run_id': 'r1',
    'sources': sources,
    'n_in': sum(s['n_in'] for s in sources),
    'n_clean': sum(s['n_clean'] for s in sources),
    'n_quarantine': sum(s['n_quarantine'] for s in sources),
    'reconcile_ok': all(s['reconcile_ok'] for s in sources),
}
print(manifest['n_in'], manifest['n_clean'], manifest['n_quarantine'])
print([(s['name'], s['reconcile_ok']) for s in sources])
print(manifest['reconcile_ok'])`,
          output: `5 4 1
[('clients.csv', True), ('transactions.json', True)]
True`,
        },
      },
      {
        id: "S08-T4-B-E2",
        subtopicId: "S08-T4-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — Implementa `reconcile_sources(sources)`: exige igualdad por cada fuente y también verifica que los totales derivados cuadren.",
        hint: "all(s['n_in'] == s['n_clean'] + s['n_quarantine'] for s in sources)",
        hints: [
          "all(s['n_in'] == s['n_clean'] + s['n_quarantine'] for s in sources)",
          "Prueba un caso donde el agregado cuadra pero cada fuente no.",
        ],
        edgeCases: ["errores compensados entre fuentes"],
        tests: "Contrato exacto: good=True; compensated_bad=False aunque 10 == 9 + 1.",
        feedback: "La igualdad agregada sola es insuficiente.",
        starterCode: {
          language: 'python',
          title: "reconcile.py",
          code: `def reconcile_sources(sources):
    # TODO
    ...

good = [{'n_in': 5, 'n_clean': 3, 'n_quarantine': 2}]
compensated_bad = [
    {'n_in': 5, 'n_clean': 5, 'n_quarantine': 1},
    {'n_in': 5, 'n_clean': 4, 'n_quarantine': 0},
]
print(reconcile_sources(good))
print(reconcile_sources(compensated_bad))`,
        },
        solutionCode: {
          language: 'python',
          title: "reconcile.py",
          code: `def reconcile_sources(sources):
    per_source = all(
        s['n_in'] == s['n_clean'] + s['n_quarantine']
        for s in sources
    )
    n_in = sum(s['n_in'] for s in sources)
    n_clean = sum(s['n_clean'] for s in sources)
    n_quarantine = sum(s['n_quarantine'] for s in sources)
    return per_source and n_in == n_clean + n_quarantine

good = [{'n_in': 5, 'n_clean': 3, 'n_quarantine': 2}]
compensated_bad = [
    {'n_in': 5, 'n_clean': 5, 'n_quarantine': 1},
    {'n_in': 5, 'n_clean': 4, 'n_quarantine': 0},
]
print(reconcile_sources(good))
print(reconcile_sources(compensated_bad))`,
          output: `True
False`,
        },
      },
      {
        id: "S08-T4-B-E3",
        subtopicId: "S08-T4-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — `run(sources)` publica solo si todas las fuentes reconcilian; el caso compensated_bad debe imprimir la fuente rota y exit_code 1.",
        hint: "No publiques clean si no cuadra",
        hints: [
          "No publiques clean si no cuadra",
          "Reporta los nombres de todas las fuentes rotas.",
        ],
        edgeCases: ["fail closed"],
        tests: "Contrato exacto: good → OK/0; compensated_bad → ERROR sources=clients.csv,transactions.json/1.",
        feedback: "Fail closed protege consumidores del clean.",
        starterCode: {
          language: 'python',
          title: "fail_reconcile.py",
          code: `def run(sources):
    # TODO
    ...

good = [{'name': 'clients.csv', 'n_in': 4, 'n_clean': 2, 'n_quarantine': 2}]
bad = [
    {'name': 'clients.csv', 'n_in': 5, 'n_clean': 5, 'n_quarantine': 1},
    {'name': 'transactions.json', 'n_in': 5, 'n_clean': 4, 'n_quarantine': 0},
]
run(good)
run(bad)`,
        },
        solutionCode: {
          language: 'python',
          title: "fail_reconcile.py",
          code: `def run(sources):
    broken = [
        s['name'] for s in sources
        if s['n_in'] != s['n_clean'] + s['n_quarantine']
    ]
    if broken:
        print('ERROR sources=' + ','.join(broken))
        print('exit_code', 1)
        return 1
    print('OK')
    print('exit_code', 0)
    return 0
good = [{'name': 'clients.csv', 'n_in': 4, 'n_clean': 2, 'n_quarantine': 2}]
bad = [
    {'name': 'clients.csv', 'n_in': 5, 'n_clean': 5, 'n_quarantine': 1},
    {'name': 'transactions.json', 'n_in': 5, 'n_clean': 4, 'n_quarantine': 0},
]
run(good)
run(bad)`,
          output: `OK
exit_code 0
ERROR sources=clients.csv,transactions.json
exit_code 1`,
        },
      },
    ],
  },
  youDo: {
    title: "Client/Transaction ETL Pipeline (cierre CP-N1-B)",
    context:
      "Cierras el gate **CP-N1-B**. Integras normalizadores (S05–S07) y el modelo en memoria (S06) en un ETL **local-python**: `data/clients.csv` + `data/transactions.json` (sintéticos) → `out/clean/`, `out/quarantine/`, `out/manifest.json` con hashes y reconciliación. CLI instalable se difiere a S10. Sin PII real; sin claims de fraude/parentesco.",
    objectives: [
      "Ingesta CSV y JSON con contratos documentados",
      "Validar/normalizar y cuarentenar rejects con motivo",
      "Manifest por fuente con hash, conteos, reconciliación y totales derivados",
      "Pruebas normal / borde / error",
      "Fail closed si reconcile no cuadra",
    ],
    requirements: [
      "Entradas sintéticas clients.csv + transactions.json",
      "Salidas out/clean/, out/quarantine/, out/manifest.json",
      "Integrar normalizadores y modelo en memoria",
      "README + demo local-python reproducible",
      "Cada fuente cumple n_in == n_clean + n_quarantine o el proceso termina con exit != 0",
      "Los totales del manifest se derivan de sources; una compensación entre fuentes nunca oculta un error",
      "Montos entran como texto, se convierten con Decimal y se serializan como texto decimal",
      "Empaquetado CLI diferido a S10",
    ],
    starterCode: `"""etl_cp_n1_b.py — Client/Transaction ETL Pipeline (cierre CP-N1-B / S08)
Ingesta CSV+JSON sintéticos → clean/quarantine/manifest.
stdlib only. Local-python.
"""

from __future__ import annotations

import csv
import hashlib
import json
import os
import shutil
from decimal import Decimal, InvalidOperation
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

# Estructura esperada:
# data/clients.csv
# data/transactions.json
# out/clean/
# out/quarantine/
# out/manifest.json


def sha256_file(path: Path) -> str:
    # TODO
    raise NotImplementedError


def write_atomic(path: Path, text: str) -> None:
    # TODO
    raise NotImplementedError


def load_clients_csv(path: Path) -> tuple[list[dict], list[dict]]:
    """→ (good_rows, quarantine_rows with reason)."""
    # TODO irregular rows + casts
    raise NotImplementedError


def load_transactions_json(path: Path) -> tuple[list[dict], list[dict]]:
    # TODO schema mínimo id, client_id, monto; Decimal desde texto + quantize("0.01")
    raise NotImplementedError


def build_manifest(
    *,
    sources: list[dict[str, Any]],
) -> dict[str, Any]:
    """Deriva totales y reconcile_ok desde cada fuente; no acepta totales agregados."""
    # TODO validar name/sha256/conteos; reconcile por fuente; sumar totales
    raise NotImplementedError


def run(data_dir: Path, out_dir: Path) -> int:
    """Retorna exit code 0/1."""
    # TODO backup, load, write clean/quar, manifest, fail if not reconcile
    raise NotImplementedError


def main() -> None:
    root = Path(__file__).resolve().parent
    code = run(root / "data", root / "out")
    raise SystemExit(code)


if __name__ == "__main__":
    main()
`,
    portfolioNote:
      "Adjunta manifest de demo, 1 fila de cuarentena con motivo, hashes de inputs y un test de reconciliación fallida (exit 1). Esa carpeta es evidencia del gate CP-N1-B.",
    rubric: [
      { criterion: "Ingesta CSV+JSON correcta", weight: "20%" },
      { criterion: "Validación + cuarentena", weight: "20%" },
      { criterion: "Manifest y reconciliación", weight: "20%" },
      { criterion: "Hashes/backups/provenance", weight: "15%" },
      { criterion: "Pruebas normal/borde/error", weight: "15%" },
      { criterion: "README y reproducibilidad local", weight: "10%" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "¿Por qué declarar encoding='utf-8' al abrir texto?",
        options: ["Es más rápido", "Comprime el archivo", "Activa pathlib", "Evita depender del locale del SO (p. ej. Windows)"],
        correctIndex: 3,
        explanation:
          "El default de texto no es portátil; UTF-8 explícito evita mojibake y DecodeError sorpresa.",
      },
      {
        question: "Escritura atómica típica es…",
        options: ["open(dest,'w') y escribir directo siempre", "escribir temp y os.replace al destino", "solo print al stdout", "append eterno al mismo file"],
        correctIndex: 1,
        explanation:
          "temp + replace evita dejar dest truncado si hay crash mid-write.",
      },
      {
        question: "Una fila CSV con columnas de más debe…",
        options: ["Ignorarse en silencio", "Rellenarse con None sin traza", "Ir a cuarentena con motivo", "Pisar el header"],
        correctIndex: 2,
        explanation:
          "Irregular → quarantine + reason; no desalinear en silencio.",
      },
      {
        question: "Reconciliación del manifest exige…",
        options: ["n_in == n_clean + n_quarantine", "n_clean > n_in", "solo n_quarantine == 0", "hash del clean == hash del input"],
        correctIndex: 0,
        explanation:
          "Toda fila de entrada termina en clean o quarantine (para ese stream).",
      },
      {
        question: "Si reconcile falla, el pipeline debe…",
        options: ["Publicar clean igual", "Borrar el manifest", "Convertir a pandas automáticamente", "Fallar (exit non-zero) / fail closed"],
        correctIndex: 3,
        explanation:
          "Fail closed protege a consumidores; el gate exige conteos cuadrados.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "pathlib — Object-oriented filesystem paths",
        url: "https://docs.python.org/3/library/pathlib.html",
        note: "Path, read_text, write_text",
      },
      {
        label: "csv — CSV File Reading and Writing",
        url: "https://docs.python.org/3/library/csv.html",
        note: "DictReader/Writer, newline=''",
      },
      {
        label: "json — JSON encoder and decoder",
        url: "https://docs.python.org/3/library/json.html",
        note: "load/dump, ensure_ascii",
      },
      {
        label: "hashlib — Secure hashes",
        url: "https://docs.python.org/3/library/hashlib.html",
        note: "sha256 de inputs",
      },
    ],
    books: [
      {
        label: "Python Cookbook (Beazley/Jones) — files/csv",
        note: "Patrones de archivos; adaptar a cuarentena/manifest del curso.",
      },
      {
        label: "Data Engineering practices (genérico)",
        note: "Idempotencia, lineage y fail closed — alinear con CP-N1-B.",
      },
    ],
    courses: [
      {
        label: "Real Python — Working with files",
        url: "https://realpython.com/working-with-files-in-python/",
        note: "pathlib y contextos; practicar en local-python.",
      },
    ],
  },
}
