import type { CourseSection } from '../../types'

export const section08: CourseSection = {
  id: "pandas",
  index: 8,
  title: "Archivos, CSV, JSON y contratos de ingesta",
  shortTitle: "Archivos & ETL",
  tagline: "pathlib, CSV/JSON, cuarentena y manifest de ingesta",
  estimatedHours: 18,
  level: "Intermedio",
  phase: 0,
  icon: "FileStack",
  accentColor: "bg-gradient-to-br from-green-500 to-emerald-600",
  jobRelevance:
    "En un onboarding de data en banca, fintech o retail en Perú, tu primer “ETL de verdad” casi nunca es un notebook de gráficos: es **abrir un CSV de clientes y un JSON de transacciones**, no romper tildes ni montos, mandar filas irregulares a **cuarentena con motivo**, hashear el crudo y dejar un **manifest** que un auditor pueda releer. El gate **CP-N1-B** se cierra cuando demuestras eso en **stdlib** (pathlib, csv, json, hashlib, Decimal) con archivos **con forma de negocio** (sintéticos en el curso). Un groupby de demo impresiona menos en entrevista junior que un pipeline fail-closed con reconcile por fuente. El análisis tabular con **pandas** llega más adelante en el nivel de datos; aquí cierras **ingesta confiable**.",
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
      heading: "Mapa de la sección: archivos, CSV/JSON y gate CP-N1-B",
      paragraphs: [
        "**Diccionario de la sección** (léelo antes de T1; no memorices el resto aún). **Path:** ruta con `pathlib.Path` (cross-platform). **Dialect:** delimitador y reglas del CSV (`,` vs `;`). **Cuarentena:** filas o archivos que fallan el contrato, guardados con **motivo** (`reason`) y **raw** intacto. **JSONL:** un objeto JSON por línea (append-friendly). **Provenance:** rastro del input (`path`, `sha256`, `bytes`). **Manifest:** JSON de la corrida con conteos por fuente. **Reconcile:** `n_in == n_clean + n_quarantine` por fuente y en totales. **Fail-closed:** si no cuadra, exit ≠ 0 — no publiques clean a medias. **stdlib only:** pathlib, csv, json, hashlib, shutil, Decimal; el análisis tabular con **pandas** llega en el bloque de datos intermedio.",
        "**De dónde venías y a dónde vas.** En **S07** fijaste texto y Unicode (tildes, encodings, mojibake). Aquí esos bytes **viven en disco**: si `read_text(encoding='utf-8')` falla, cuarentenás el archivo o reintentás con un encoding **documentado**. Integra normalizadores (S05–S07) y el modelo en memoria (S06). En S08 cierras el gate **CP-N1-B**: ingesta **CSV + JSON** con **pathlib**, **cuarentena**, **hashes**, **manifest** y reconciliación — todo en **stdlib**, sin librerías externas de datos. Entorno **local-python**: sintéticos en `data/`; salidas en `out/`. Si el schema no cuadra, cuarentena con motivo — nunca rellenes en silencio.",
        "**Orden y ritmo (~18 h).** **T1 Archivos** (Path/UTF-8 → atomic/newlines) → **T2 CSV** (dialect/cast → cuarentena) → **T3 JSON** (array/JSONL → schema/nulls) → **T4 Provenance** (hash/backup → manifest/reconcile) → You Do CP-N1-B. En cada subtema: teoría, un I Do y tres We Do (E1 guiado → E2 independiente → E3 transferencia). Laboratorio sintético Perú: clientes `C00x` y montos PEN ficticios. Nunca PII real ni inferencia automática de parentesco o fraude.",
      ],
      callout: {
        type: "info",
        title: "Gate CP-N1-B — qué cuenta como cierre",
        content:
          "Al finalizar S08 demuestras un ETL local reproducible: clean + quarantine + manifest reconciliado por fuente, con hash del crudo y exit ≠ 0 si no cuadra. El CLI instalable llega en S10. Solo datos sintéticos; sin PII real ni claims de fraude o parentesco.",
      },
    },
    {
      heading: "pathlib, with, modos y encodings",
      subtopicId: "S08-T1-A",
      paragraphs: [
        "`pathlib.Path` unifica rutas en Windows, macOS y Linux: `Path('data') / 'clients.csv'` evita armar strings con `\\` o `/` a mano. `Path.read_text(encoding='utf-8')` / `write_text` son convenientes; `with path.open(...) as f` da control fino de modo y cierra el handle aunque falle el cuerpo. En CP-N1-B el *porqué* es operativo: **rastro auditable** de cada input y salidas predecibles para el manifest — no “abrir un archivo por curiosidad”.",
        "Modos: `r` lectura, `w` trunca, `a` append, `x` crea exclusivo (falla si ya existe). **Siempre** declara `encoding='utf-8'` en texto: en Windows el locale del SO **no** es un contrato portable. `errors=` (`strict` por defecto, `replace`, `ignore`) es una decisión **documentada** en el README del pipeline, no un default mágico. En este gate usas solo pathlib/csv/json/hashlib/shutil/Decimal — sin librerías externas de datos.",
        "`path.exists()` / `is_file()` evitan abrir a ciegas y ayudan a mensajes de error claros. No asumas el cwd del IDE: ancla rutas al proyecto con `Path(__file__).resolve().parent` o paths relativos **documentados** (`data/`, `out/`). Si `read_text(encoding='utf-8')` lanza `UnicodeDecodeError`, el contrato del gate es fail-closed: cuarentená el **archivo** (o reintentá con un encoding explícito acordado), no “arreglás” tildes a ojo.",
      ],
      code: {
        language: 'python',
        title: "path_utf8.py",
        code: `from pathlib import Path
import tempfile

def demo_path_write(td=None):
    td = Path(td or tempfile.mkdtemp())
    p = td / "intake.txt"
    p.write_text("línea1\\nlínea2\\n", encoding="utf-8")
    return p.exists(), p.read_text(encoding="utf-8").splitlines()

print(demo_path_write())`,
        output: `(True, ['línea1', 'línea2'])`,
      },
      callout: {
        type: "tip",
        title: "UTF-8 explícito",
        content:
          "En Windows el default de texto no siempre es UTF-8. Para intake del gate: encoding='utf-8' siempre; si el export trae BOM de Excel, usá 'utf-8-sig' de forma documentada.",
      },
    },
    {
      heading: "Newlines y escritura atómica",
      subtopicId: "S08-T1-B",
      paragraphs: [
        "CSV en Python: abrí con `newline=''` para que el módulo `csv` controle terminadores y no pelee con la traducción de newlines del runtime. En salidas del pipeline preferí `\\n` (LF) aunque el input haya venido de Excel en Windows. Sin `newline=''`, Windows puede insertar CR dobles y el dialecto se rompe al re-leer el clean.",
        "**Escritura atómica** (contrato único del curso, no hay otro): `tmp = path.with_name(path.name + \".tmp\")` — p. ej. `clean.csv` → `clean.csv.tmp` en el **mismo** directorio que el destino — escribís el contenido completo al tmp y luego `os.replace(tmp, dest)`. Si el proceso muere a medias, el consumidor del clean no ve un archivo truncado a la mitad.",
        "Detectar `\\r\\n` en **bytes** de input documenta provenance (origen Windows vs Unix) en el manifest o en logs. Eso **no** “arregla” el archivo ni reescribe el crudo: solo registra un hecho útil para depurar exports raros. El You Do reutilizará el mismo `write_atomic` para clean, quarantine y manifest.",
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
    tmp = path.with_name(path.name + ".tmp")
    tmp.write_text(text, encoding="utf-8")
    os.replace(tmp, path)

write_atomic(dest, "hola\\n")
print(dest.read_text(encoding="utf-8"), end="")
sample = b"a\\r\\nb\\n"
print("tiene CRLF", b"\\r\\n" in sample)`,
        output: `hola
tiene CRLF True`,
      },
      callout: {
        type: "warning",
        title: "No dejes dest truncado",
        content:
          "Evita open(dest,'w') largos sin temp: un crash mid-write deja basura a consumidores del clean. Contrato del curso: name + '.tmp' + os.replace.",
      },
    },
    {
      heading: "Dialectos, headers y tipos",
      subtopicId: "S08-T2-A",
      paragraphs: [
        "`csv.DictReader` / `DictWriter` trabajan con headers: cada fila sale como dict. **Declará `fieldnames`** al escribir; no confíes en el orden “que se ve” en Excel. El cast de tipos (`int`, `Decimal`) es **explícito**: un fallo va a cuarentena con `{raw, reason}` — nunca un `0` mágico sin traza. El contrato monetario de S02 continúa: `Decimal` desde texto, cuantizado a `0.01`, serializado como **string** (`\"10.50\"`), **nunca** `float` (el binario del float rompe cuadraturas y tests).",
        "Fechas pueden quedarse como **string ISO** (`YYYY-MM-DD`) en N1-B: no hace falta `datetime` todavía si el contrato lo documenta. Lo crítico es el **contrato de columnas** (nombres, tipos, required) versionado en el manifest o en el README del pipeline. Si falta una columna requerida o el cast falla, la fila **no** entra a clean.",
        "Dialectos reales en Latam: `delimiter=';'` es común en exports Excel en español; la coma es el default anglosajón. El BOM de Excel “CSV UTF-8” se quita abriendo con `encoding='utf-8-sig'`. **No** asumas el dialecto: inspeccioná las primeras líneas o el contrato de la fuente y dejá delimiter/encoding **explícitos** en el código de ingesta.",
      ],
      code: {
        language: 'python',
        title: "csv_dict.py",
        code: `import csv, io
from decimal import Decimal, InvalidOperation

def parse_monto_rows(raw, delimiter=","):
    rows = list(csv.DictReader(io.StringIO(raw), delimiter=delimiter))
    out = []
    for r in rows:
        try:
            r["monto"] = str(Decimal(r["monto"]).quantize(Decimal("0.01")))
            out.append(r)
        except (InvalidOperation, KeyError):
            out.append({"raw": dict(r), "reason": "cast_monto"})
    return out

raw_comma = "id,nombre,monto\\nC001,Ana,10.5\\nC002,Luis,20\\n"
raw_semi = "id;nombre;monto\\nC001;Ana;10.5\\n"
print(parse_monto_rows(raw_comma))
print(parse_monto_rows(raw_semi, delimiter=";"))
# Excel "CSV UTF-8" a menudo trae BOM; en disco: open(..., encoding="utf-8-sig")
print("utf-8-sig quita BOM:", "\\ufeffid".encode().decode("utf-8-sig"))`,
        output: `[{'id': 'C001', 'nombre': 'Ana', 'monto': '10.50'}, {'id': 'C002', 'nombre': 'Luis', 'monto': '20.00'}]
[{'id': 'C001', 'nombre': 'Ana', 'monto': '10.50'}]
utf-8-sig quita BOM: id`,
      },
      callout: {
        type: "tip",
        title: "Cast controlado + dialecto Latam",
        content:
          "InvalidOperation en monto → cuarentena con {raw, reason}. Export Excel en Latam suele usar delimiter=';' y a veces BOM: encoding='utf-8-sig'.",
      },
    },
    {
      heading: "Filas irregulares y cuarentena",
      subtopicId: "S08-T2-B",
      paragraphs: [
        "Filas con **más o menos columnas** que el header son irregulares (export cortado, comas de más, fila basura al final). **No** las “arreglés” en silencio ni trunques a medias: mándalas a cuarentena con **motivo** estable (`reason: \"col_count\"`) y conservá el **raw** (lista o string de la fila). Silenciar irregular desalinea columnas y corrompe métricas del gate.",
        "El vocabulario de `reason` debe ser **estable** (`col_count`, `cast_monto`, `schema`) porque alimenta el contador del **manifest** y cualquier dashboard de calidad. No inventes frases largas distintas en cada script: el E3 de contadores y el You Do dependen de un enum corto. Contrato: entrada → transformación documentada → salida medible.",
        "Clean escribe solo filas que pasaron schema + casts + normalización (S05–S07). **Invariante del gate:** cada fila de entrada termina en clean o en quarantine — nunca “desaparece”. Si `n_in` no cuadra con `n_clean + n_quarantine` para esa fuente, el pipeline falla en T4; la cuarentena honesta de T2 es lo que hace posible ese check.",
      ],
      code: {
        language: 'python',
        title: "quarantine_rows.py",
        code: `import csv, io

def quarantine_irregular(text):
    reader = csv.reader(io.StringIO(text))
    header = next(reader)
    clean, quar = [], []
    for row in reader:
        if len(row) != len(header):
            quar.append({"raw": row, "reason": "col_count"})
        else:
            clean.append(dict(zip(header, row)))
    return clean, quar

text = "id,nombre\\nC001,Ana\\nC002,Luis,EXTRA\\nC003\\n"
print(quarantine_irregular(text))`,
        output: `([{'id': 'C001', 'nombre': 'Ana'}], [{'raw': ['C002', 'Luis', 'EXTRA'], 'reason': 'col_count'}, {'raw': ['C003'], 'reason': 'col_count'}])`,
      },
      callout: {
        type: "danger",
        title: "Silenciar irregular = deuda",
        content:
          "La fila extra se pierde o desalinea columnas y corrompe n_in del manifest. Siempre quarantine + reason; nunca “arreglar” a ciegas.",
      },
    },
    {
      heading: "Objetos/arrays y serialización JSON",
      subtopicId: "S08-T3-A",
      paragraphs: [
        "`json.loads` / `dumps` trabajan con strings; `load` / `dump` con archivos. Objects JSON → `dict`; arrays → `list`. **JSONL** (un objeto por línea, terminado en `\\n`) es útil para streams de transacciones: podés append una línea sin reescribir el archivo entero. El demo I Do de T3-A escribe **ambos** formatos. JSON **no** tiene tipo Decimal: serializamos montos como strings (`\"10.00\"`) y al leerlos reconstruimos `Decimal` — **nunca** float.",
        "`ensure_ascii=False` preserva tildes legibles (`José`, `Ñahui`) en logs y en clean; con el default `True` verías `\\u00e9` y el review se vuelve ilegible. `sort_keys=True` ayuda al **determinismo** en manifests (eco de S06): dos corridas con los mismos datos producen el mismo JSON de control.",
        "`datetime` y `Decimal` no son serializables por defecto. Convertí fechas a `isoformat()` (o str ISO) y montos a string **antes** de `dumps`. Si olvidás el paso, capturá `TypeError` y mandá la fila a cuarentena o normalizá el campo — no uses `default=str` como escape silencioso en producción del gate.",
      ],
      code: {
        language: 'python',
        title: "json_ser.py",
        code: `import json
from datetime import date

def dump_rows(data):
    return json.dumps(data, ensure_ascii=False)

data = [{"id": "T1", "día": date(2026, 1, 15).isoformat()}]
print(dump_rows(data))`,
        output: `[{"id": "T1", "día": "2026-01-15"}]`,
      },
      callout: {
        type: "tip",
        title: "JSONL",
        content:
          "Para logs append-friendly de txs: una línea = un json.dumps(row). El demo I Do de T3-A escribe array y JSONL.",
      },
    },
    {
      heading: "Schema, nulls y evolución compatible",
      subtopicId: "S08-T3-B",
      paragraphs: [
        "Validá **required keys** antes de normalizar o castear montos. `null` JSON se convierte en `None` en Python. Distinguí **null explícito** de **clave ausente** cuando la política lo pide (eco S03: missing ≠ empty): `'email' in obj` es `True` aunque el valor sea `None`; si la clave no vino en el JSON, la membresía es `False`. Esa diferencia decide si “borrar email” o “email desconocido”.",
        "Evolución compatible: añadir un campo opcional con **default** (`setdefault('segment', 'standard')`) no rompe productores viejos que aún no envían `segment`. Quitar un required o renombrar una clave **sí** es breaking: versioná el schema en el manifest del run (`schema_version`) o en el contrato de la fuente.",
        "`validate_schema(obj, required)` devuelve `(ok, missing)` para decidir clean vs cuarentena. Si falta `id` o un email requerido, la fila no pasa: fail-closed, **sin inventar** valores “para que el dashboard no se vea vacío”. El You Do aplica el mismo patrón a transacciones (`id`, `client_id`, `monto`).",
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
          "Documentá en el contrato si null borra el valor o significa unknown. En Python: 'email' in obj distingue clave presente (aunque sea None) de clave ausente.",
      },
    },
    {
      heading: "Backups, hashes y provenance",
      subtopicId: "S08-T4-A",
      paragraphs: [
        "`hashlib.sha256` del **contenido del input crudo** fija un fingerprint en el manifest. Si el CSV cambia un solo byte (una coma, un BOM, un `\\r`), el hash cambia: detectás reprocesos, re-ingestas y “¿corrimos sobre el archivo de ayer?”. Hasheá el archivo de **entrada**, **no** el clean: el clean es un producto; el crudo es la evidencia.",
        "Backup: copiá a `input.bak` o a `backups/` con `shutil.copy2` **antes** de cualquier transformación o escritura de salida. No mutes el original in place ni “normalices” el crudo sobre sí mismo: el gate exige provenance del input intacto para rehacer la corrida.",
        "Provenance mínima por fuente: `{path, sha256, bytes}` (y opcionalmente `received_at` ISO). Con el fixture de laboratorio `id\\nC1\\n` el tamaño es **6** bytes y el digest es fijo (`b776a3a3…`); si cambiás el fixture, **recalculá** el hash en demos y tests — no copies un hex de memoria.",
      ],
      code: {
        language: 'python',
        title: "hash_backup.py",
        code: `from pathlib import Path
import hashlib, tempfile, shutil

def provenance_backup(src_name="clients.csv"):
    td = Path(tempfile.mkdtemp())
    src = td / src_name
    src.write_text("id\\nC1\\n", encoding="utf-8")
    bak = td / f"{src_name}.bak"
    shutil.copy2(src, bak)
    dig = hashlib.sha256(src.read_bytes()).hexdigest()
    return {
        "path": src.name,
        "sha256": dig,
        "bytes": src.stat().st_size,
        "bak_ok": bak.read_bytes() == src.read_bytes(),
    }

print(provenance_backup())`,
        output: `{'path': 'clients.csv', 'sha256': 'b776a3a3926835c70a8b32f595320ba866cf1c5c8d9106d2e50f36b5a9548fc9', 'bytes': 6, 'bak_ok': True}`,
      },
      callout: {
        type: "tip",
        title: "Hash del input",
        content:
          "El manifest referencia el hash del archivo crudo, no del clean. Si el clean cambia por una regla nueva, el hash del input debe seguir identificando la misma evidencia.",
      },
    },
    {
      heading: "Reconciliación y manifest de corrida",
      subtopicId: "S08-T4-B",
      paragraphs: [
        "El **manifest** de la corrida es un JSON con `run_id` (opcional), una lista `sources` y totales **derivados**. Cada fuente lleva `name`, `sha256` del crudo y conteos `n_in`, `n_clean`, `n_quarantine` (más `reconcile_ok` calculado). Los totales se **suman** desde las fuentes; no se hardcodean ni se copian de un run anterior “porque se veía bien”.",
        "**Reconciliación en dos niveles**: (1) cada fuente cumple `n_in == n_clean + n_quarantine`; (2) los totales son la suma exacta de esas fuentes. Validar **solo** el agregado puede ocultar un sobrante en CSV compensado por un faltante en JSON (el caso `compensated_bad` de los We Do). Si **cualquier** fuente no cuadra, **falla la corrida** (exit ≠ 0) — no publiques clean a medias.",
        "Evidencia del gate CP-N1-B en tu portfolio: scripts + fixtures sintéticos + manifest de demo + al menos un test de reconcile fallido (exit 1) + README reproducible. Clean y quarantine deben ser **siempre** explicables desde el manifest: un revisor no debería necesitar adivinar dónde fueron las filas.",
      ],
      code: {
        language: 'python',
        title: "manifest.py",
        code: `import json

def build_manifest(sources):
    for s in sources:
        s["reconcile_ok"] = s["n_in"] == s["n_clean"] + s["n_quarantine"]
    return {
        "sources": sources,
        "n_in": sum(s["n_in"] for s in sources),
        "n_clean": sum(s["n_clean"] for s in sources),
        "n_quarantine": sum(s["n_quarantine"] for s in sources),
        "reconcile_ok": all(s["reconcile_ok"] for s in sources),
    }

sources = [
    {"name": "clients.csv", "sha256": "abc", "n_in": 6, "n_clean": 5, "n_quarantine": 1},
    {"name": "transactions.json", "sha256": "def", "n_in": 2, "n_clean": 2, "n_quarantine": 0},
]
print(json.dumps(build_manifest(sources), ensure_ascii=False, sort_keys=True))`,
        output: `{"n_clean": 7, "n_in": 8, "n_quarantine": 1, "reconcile_ok": true, "sources": [{"n_clean": 5, "n_in": 6, "n_quarantine": 1, "name": "clients.csv", "reconcile_ok": true, "sha256": "abc"}, {"n_clean": 2, "n_in": 2, "n_quarantine": 0, "name": "transactions.json", "reconcile_ok": true, "sha256": "def"}]}`,
      },
      callout: {
        type: "success",
        title: "Cierre CP-N1-B",
        content:
          "Si reconcile falla, el pipeline debe terminar con exit non-zero. Clean y quarantine siempre explicables.",
      },
    },
    {
      heading: "Cierre y puente a S09 (excepciones y logs)",
      paragraphs: [
        "En S08 cerraste el **contrato de ingesta local**: Path + UTF-8, escritura atómica, CSV con dialecto/cast, cuarentena con `reason`, JSON/JSONL, schema/nulls, hash del crudo y manifest reconciliado por fuente. El You Do es la evidencia de **CP-N1-B** — no un ejercicio decorativo al final.",
        "En **S09** profundizás **excepciones y logging**: cómo registrar `UnicodeDecodeError`, fallos de cast y reconcile **sin silenciar**, y cómo un log estructurado complementa (no reemplaza) el manifest. Llevá contigo el vocabulario fail-closed: cuarentena con motivo, no relleno mágico, exit ≠ 0 cuando los conteos no cierran.",
        "Checklist mental antes del You Do (si fallás una, volvé al We Do de ese tema): ¿tmp es `name + \".tmp\"`? ¿montos son string Decimal cuantizado? ¿cada fila de entrada está en clean o quarantine? ¿el sha256 es del **input** crudo? ¿cada fuente reconcilia sola (no solo el total)? ¿el run falla si alguna fuente no cuadra?",
      ],
      callout: {
        type: "info",
        title: "S08 → S09",
        content:
          "S09 no cambia el stack de archivos: enseña a observar y fallar con traza cuando el contrato de ingesta se rompe en producción. Tu manifest de CP-N1-B sigue siendo la evidencia de conteos; el log cuenta el *cómo* falló.",
      },
    },
  ],
  iDo: {
    intro: "Ocho demos I Do (T1→T4) en **local-python** (filesystem/temp). Cada una modela una pieza del ETL del gate CP-N1-B: leé el código, anticipá la salida, luego contrastá. Datos sintéticos únicamente — sin PII real.",
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

def write_utf8_demo():
    td = Path(tempfile.mkdtemp())
    p = td / "intake.txt"
    p.write_text("cliente;José\\n", encoding="utf-8")
    return p.exists(), p.read_text(encoding="utf-8")

print(write_utf8_demo())`,
          output: `(True, 'cliente;José\\n')`,
        },
        why: "Sin Path + UTF-8 explícito, el resto del ETL (CSV, JSON, hash) hereda mojibake y rutas frágiles. Esta demo es el primer ladrillo del gate.",
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
print(dest.read_text(encoding="utf-8"), end="")
print("tmp gone", not (td / "clean.csv.tmp").exists())`,
          output: `id,nombre
C001,Ana
tmp gone True`,
        },
        why: "os.replace hace el swap atómico del artefacto de salida. Contrato único del curso: tmp = dest.with_name(dest.name + '.tmp') en el mismo directorio; al terminar no queda basura .tmp.",
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

def load_csv_monto(raw):
    rows = []
    for r in csv.DictReader(io.StringIO(raw)):
        r["monto"] = str(Decimal(r["monto"]).quantize(Decimal("0.01")))
        rows.append(r)
    return rows

raw = "id,nombre,monto,fecha\\nC001,Ana,10.5,2026-01-10\\nC002,Luis,20,2026-01-11\\n"
print(load_csv_monto(raw))`,
          output: `[{'id': 'C001', 'nombre': 'Ana', 'monto': '10.50', 'fecha': '2026-01-10'}, {'id': 'C002', 'nombre': 'Luis', 'monto': '20.00', 'fecha': '2026-01-11'}]`,
        },
        why: "DictReader + Decimal desde texto, quantize a 0.01 y serialización como string: el mismo contrato de dinero de S02, ahora sobre filas CSV reales del pipeline.",
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

def split_clean_quarantine(text):
    reader = csv.reader(io.StringIO(text))
    header = next(reader)
    clean, quar = [], []
    for row in reader:
        if len(row) != len(header):
            quar.append({"raw": ",".join(row), "reason": "col_count"})
        else:
            clean.append(dict(zip(header, row)))
    return clean, quar

text = "id,nombre\\nC001,Ana\\nC002,Luis,EXTRA\\nbadonly\\n"
print(split_clean_quarantine(text))`,
          output: `([{'id': 'C001', 'nombre': 'Ana'}], [{'raw': 'C002,Luis,EXTRA', 'reason': 'col_count'}, {'raw': 'badonly', 'reason': 'col_count'}])`,
        },
        why: "Cuarentena con reason estable (col_count) deja audit trail; clean solo tiene filas sanas. Sin esto, el reconcile de T4 no tiene de dónde sacar n_quarantine.",
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

def write_json_and_jsonl(rows):
    td = Path(tempfile.mkdtemp())
    p = td / "tx.json"
    p.write_text(json.dumps(rows, ensure_ascii=False, indent=2), encoding="utf-8")
    jl = td / "tx.jsonl"
    jl.write_text(
        "\\n".join(json.dumps(r, ensure_ascii=False) for r in rows) + "\\n",
        encoding="utf-8",
    )
    return json.loads(p.read_text(encoding="utf-8")), jl.read_text(encoding="utf-8").splitlines()

rows = [{"id": "T1", "monto": "10.00"}, {"id": "T2", "monto": "5.00"}]
print(write_json_and_jsonl(rows))`,
          output: `([{'id': 'T1', 'monto': '10.00'}, {'id': 'T2', 'monto': '5.00'}], ['{"id": "T1", "monto": "10.00"}', '{"id": "T2", "monto": "5.00"}'])`,
        },
        why: "Array JSON para batch pequeño y relectura completa; JSONL (una línea = un objeto) para append y streaming de txs. Ambos salen del mismo list de dicts — elegís el formato por el caso de uso.",
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
        why: "Required estricto protege el gate; defaults opcionales (setdefault) permiten evolucionar el contrato sin romper productores viejos.",
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

def hash_and_backup(content="id\\nC1\\n"):
    td = Path(tempfile.mkdtemp())
    src = td / "clients.csv"
    src.write_text(content, encoding="utf-8")
    bak = td / "clients.csv.bak"
    shutil.copy2(src, bak)
    dig = hashlib.sha256(src.read_bytes()).hexdigest()
    return dig[:12], bak.exists()

print(hash_and_backup())`,
          output: `('b776a3a39268', True)`,
        },
        why: "Hash + backup del crudo son la provenance mínima del gate: el manifest debe poder decir “corrimos sobre este bytes exactos”.",
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

def write_manifest(sources, run_id="demo-001"):
    for s in sources:
        s["reconcile_ok"] = s["n_in"] == s["n_clean"] + s["n_quarantine"]
    manifest = {
        "run_id": run_id,
        "sources": sources,
        "n_in": sum(s["n_in"] for s in sources),
        "n_clean": sum(s["n_clean"] for s in sources),
        "n_quarantine": sum(s["n_quarantine"] for s in sources),
        "reconcile_ok": all(s["reconcile_ok"] for s in sources),
    }
    td = Path(tempfile.mkdtemp())
    p = td / "manifest.json"
    p.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    return json.loads(p.read_text(encoding="utf-8"))

sources = [
    {"name": "clients.csv", "sha256": "deadbeef", "n_in": 3, "n_clean": 2, "n_quarantine": 1},
    {"name": "transactions.json", "sha256": "cafebabe", "n_in": 2, "n_clean": 2, "n_quarantine": 0},
]
print(write_manifest(sources))`,
          output: `{'run_id': 'demo-001', 'sources': [{'name': 'clients.csv', 'sha256': 'deadbeef', 'n_in': 3, 'n_clean': 2, 'n_quarantine': 1, 'reconcile_ok': True}, {'name': 'transactions.json', 'sha256': 'cafebabe', 'n_in': 2, 'n_clean': 2, 'n_quarantine': 0, 'reconcile_ok': True}], 'n_in': 5, 'n_clean': 4, 'n_quarantine': 1, 'reconcile_ok': True}`,
        },
        why: "El manifest prueba reconciliación por fuente y agregada; ninguna fuente puede esconder pérdidas detrás de otra. Es la pieza final antes de ensamblar el You Do.",
      },
    ],
  },
  weDo: {
    intro: "Andamiaje E1→E2→E3 × 8 (24 ejercicios). Solo stdlib (pathlib, csv, json, hashlib, shutil, Decimal). Fail-closed en reconcile. **Mapa puente al You Do (ensamblaje):** T1-A → `Path`/`read_text` · T1-B → `write_atomic` · T2-A → cast `Decimal` + dialecto · T2-B → split clean/quarantine + `reason` · T3-A → JSON/JSONL · T3-B → `validate_schema` · T4-A → `sha256` + backup · T4-B → manifest + `run` fail-closed. Al terminar T4 deberías reutilizar cada pieza **sin mirar la solución**; el proyecto CP-N1-B solo las conecta en un `run(data_dir, out_dir)`. El E3 de T4-B es el mini-ensamblaje de salida (publicar solo si reconcilia).",
    steps: [
      {
        id: "S08-T1-A-E1",
        subtopicId: "S08-T1-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Path write/exists: en un temp dir, crea `demo.txt` con `write_text('hola', encoding='utf-8')`, imprime `p.exists()`. Pass: `True`. Solo stdlib.",
        hint: "write_text + exists",
        hints: [
          "write_text + exists",
          "encoding utf-8",
        ],
        edgeCases: ["exists"],
        tests: "print True tras write_text",
        feedback: "exists evita abrir a ciegas.",
        starterCode: {
          language: 'python',
          title: "path_exists.py",
          code: `# CASO-LIM-008 · Path write/read
# DEFECT: no escribe; exists siempre False
from pathlib import Path
import tempfile
td = Path(tempfile.mkdtemp())
p = td / 'demo.txt'
print(p.exists())`,
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
          "E2 (independiente) — Escribe tres líneas (`a`, `b`, `c`) con `with path.open('w', encoding='utf-8')`, relee con strip e imprime la lista. Pass: `['a', 'b', 'c']`. Solo stdlib.",
        hint: "with path.open('w', encoding='utf-8')",
        hints: [
          "with path.open('w', encoding='utf-8')",
          "newline natural \\n",
        ],
        edgeCases: ["with read"],
        tests: "print ['a', 'b', 'c']",
        feedback: "with cierra el handle aunque falle el cuerpo.",
        starterCode: {
          language: 'python',
          title: "with_lines.py",
          code: `# CASO-LIM-008 · open lines
# DEFECT: no escribe ni lee líneas
from pathlib import Path
import tempfile
td = Path(tempfile.mkdtemp())
p = td / 'lines.txt'
lines = []
print(lines)`,
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
          "E3 (transferencia) — Escribe bytes no válidos en UTF-8 (`write_bytes`), intenta `read_text(encoding='utf-8')`, captura `UnicodeDecodeError`, imprime el nombre de la excepción y una acción (cuarentenar o reintentar con encoding documentado). Pass: primera línea `UnicodeDecodeError`.",
        hint: "path.write_bytes(b'\\xff\\xfe\\xfa'); try/except UnicodeDecodeError",
        hints: [
          "path.write_bytes(b'\\xff\\xfe\\xfa') — bytes inválidos en utf-8",
          "try/except UnicodeDecodeError; type(e).__name__",
        ],
        edgeCases: ["diagnóstico encoding"],
        tests: "UnicodeDecodeError + acción de cuarentena",
        feedback: "Encoding roto → cuarentena de archivo, no crash silencioso a medias.",
        starterCode: {
          language: 'python',
          title: "diag_decode.py",
          code: `# CASO-LIM-008 · UnicodeDecodeError
# DEFECT: traga bytes como latin-1 sin cuarentena (siempre "funciona")
from pathlib import Path
import tempfile
td = Path(tempfile.mkdtemp())
p = td / 'bad.txt'
p.write_bytes(b'\\xff\\xfe\\xfa')
print(p.read_text(encoding='latin-1')[:10])`,
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
          "E1 (guiado) — Detecta CRLF: con samples `win = b'a\\r\\nb\\r\\n'` y `unix = b'a\\nb\\n'`, imprime si cada uno contiene `b'\\r\\n'` (True luego False). Solo stdlib.",
        hint: "b'\\r\\n' in data",
        hints: [
          "b'\\r\\n' in data",
          "Dos samples win/unix.",
        ],
        edgeCases: ["CRLF"],
        tests: "True\\nFalse",
        feedback: "Detectar newlines documenta origen del archivo.",
        starterCode: {
          language: 'python',
          title: "detect_crlf.py",
          code: `# CASO-LIM-008 · CRLF vs LF
# DEFECT: busca solo \\n (True en ambos) en vez de \\r\\n
win = b'a\\r\\nb\\r\\n'
unix = b'a\\nb\\n'
print(b'\\n' in win)
print(b'\\n' in unix)`,
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
          "E2 (independiente) — Implementá `write_atomic(path, text)` con temp en el mismo dir: `tmp = path.with_name(path.name + '.tmp')` + `os.replace`. Escribí `'ok\\n'` y imprimí el contenido final. Pass: línea `ok`. Solo stdlib.",
        hint: "tmp + os.replace",
        hints: [
          "tmp = path.with_name(path.name + '.tmp')",
          "mismo directorio que dest; os.replace(tmp, path)",
        ],
        edgeCases: ["atomic"],
        tests: "contenido final ok\\n",
        feedback: "Pieza reutilizable del ETL de salida. Contrato tmp: name + '.tmp'.",
        starterCode: {
          language: 'python',
          title: "atomic_impl.py",
          code: `# CASO-LIM-008 · write_atomic
# DEFECT: write directo sin tmp/replace
from pathlib import Path
import os, tempfile

def write_atomic(path, text):
    Path(path).write_text(text, encoding='utf-8')

td = Path(tempfile.mkdtemp())
p = td / 'out.txt'
write_atomic(p, 'FULL')
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
print(p.read_text(encoding='utf-8'), end='')`,
          output: `ok
`,
        },
      },
      {
        id: "S08-T1-B-E3",
        subtopicId: "S08-T1-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Simulá fallo mid-write: escribí dest parcial `'PARCIAL'`, imprimí `mid …`; luego atomic replace a `'COMPLETO'` e imprimí `final …`. Pass: `mid PARCIAL` y `final COMPLETO`.",
        hint: "Primero write no atómico parcial; luego tmp + os.replace",
        hints: [
          "Primero write no atómico parcial; luego write_atomic",
          "tmp = dest.with_name(dest.name + '.tmp')",
        ],
        edgeCases: ["mid-write vs atomic"],
        tests: "mid PARCIAL\\nfinal COMPLETO",
        feedback: "Atomic no arregla el pasado parcial; evita el estado intermedio al consumidor.",
        starterCode: {
          language: 'python',
          title: "midwrite.py",
          code: `# CASO-LIM-008 · partial mid-write
# DEFECT: segundo write directo (no atómico) en vez de tmp+replace
from pathlib import Path
import os, tempfile
td = Path(tempfile.mkdtemp())
dest = td / 'f.txt'
dest.write_text('PARCIAL', encoding='utf-8')
print('mid', dest.read_text(encoding='utf-8'))
dest.write_text('COMPLETO', encoding='utf-8')
print('end', dest.read_text(encoding='utf-8'))`,
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
          "E1 (guiado) — Con `csv.DictReader` sobre un StringIO cuyo header es `id,nombre` e imprime cada fila como dict. Pass: `{'id': 'C001', 'nombre': 'Ana'}`. Solo stdlib.",
        hint: "csv.DictReader",
        hints: [
          "csv.DictReader",
          "io.StringIO",
        ],
        edgeCases: ["header"],
        tests: "print dict C001 Ana",
        feedback: "DictReader mapea columnas por nombre.",
        starterCode: {
          language: 'python',
          title: "dictreader.py",
          code: `# CASO-LIM-008 · DictReader
# DEFECT: split manual rompe comas en campos
import csv, io
raw = 'id,nombre\\nC001,Ana\\n'
for line in raw.strip().split('\\n')[1:]:
    print(line.split(','))`,
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
          "E2 (independiente) — Escribí CSV con `DictWriter` (fieldnames `id,nombre`): `writeheader` + una fila, relee y imprimí `len(rows)` y `rows[0]`. Pass: `1` y el dict de Ana. Solo stdlib.",
        hint: "writeheader + writerow",
        hints: [
          "writeheader + writerow",
          "newline='' si usas open file",
        ],
        edgeCases: ["writer header"],
        tests: "1\\n{'id': 'C001', 'nombre': 'Ana'}",
        feedback: "Writer con header estable es contrato de salida clean.",
        starterCode: {
          language: 'python',
          title: "dictwriter.py",
          code: `# CASO-LIM-008 · DictWriter roundtrip
# DEFECT: no writeheader; n=0
import csv, io
buf = io.StringIO()
w = csv.DictWriter(buf, fieldnames=['id', 'nombre'])
w.writerow({'id': 'C001', 'nombre': 'Ana'})
buf.seek(0)
rows = list(csv.DictReader(buf))
print(len(rows))
print(rows[0] if rows else None)`,
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
          "E3 (transferencia) — Cast de monto: `Decimal` desde texto + quantize a `0.01`; si `InvalidOperation` → `reject … motivo=cast_monto`. Procesá `['10', 'x', '3.5']`. Pass: `ok 10.00` / `reject x motivo=cast_monto` / `ok 3.50`. Sin `float()`.",
        hint: "Decimal(v).quantize(Decimal('0.01')); except InvalidOperation",
        hints: [
          "Decimal(v).quantize(Decimal('0.01')); except InvalidOperation",
          "No uses float ni 0 silencioso.",
        ],
        edgeCases: ["cast fallido"],
        tests: "ok 10.00; reject x motivo=cast_monto; ok 3.50",
        feedback: "Cast fallido alimenta cuarentena con motivo.",
        starterCode: {
          language: 'python',
          title: "cast_reject.py",
          code: `# CASO-LIM-008 · Decimal cast
# DEFECT: float() traga y no rechaza 'x' con motivo cast_monto
from decimal import Decimal, InvalidOperation

vals = ['10', 'x', '3.5']
for v in vals:
    try:
        print('ok', float(v))
    except ValueError:
        print('reject', v)`,
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
          "E1 (guiado) — Detectá fila irregular: `header` len 2, `row = ['C1','Ana','x']` → `len(row) != len(header)` es True. Imprimí el booleano. Pass: `True`.",
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
          code: `# CASO-LIM-008 · irregular columns
# DEFECT: no detecta col_count mismatch
header = ['id', 'nombre']
row = ['C1', 'Ana', 'x']
irregular = False
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
          "E2 (independiente) — Escribí una fila de cuarentena `{raw, reason}` a CSV en temp (`newline=''`, fieldnames `raw,reason`), relee e imprimí `reason`. Pass: `col_count`. Solo stdlib.",
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
          code: `# CASO-LIM-008 · quarantine CSV
# DEFECT: no escribe quarantine
from pathlib import Path
import csv, tempfile
td = Path(tempfile.mkdtemp())
p = td / 'quarantine.csv'
print(p.exists())`,
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
          "E3 (transferencia) — Dada `reasons = ['col_count', 'cast_monto', 'col_count', 'schema']`, imprimí contador sorted: `reason count` por línea. Pass: `cast_monto 1`, `col_count 2`, `schema 1`.",
        hint: "collections.Counter o dict",
        hints: [
          "collections.Counter o dict",
          "sorted items; print(k, v)",
        ],
        edgeCases: ["resumen motivos"],
        tests: "cast_monto 1\\ncol_count 2\\nschema 1",
        feedback: "Resumen de motivos entra al manifest.",
        starterCode: {
          language: 'python',
          title: "reason_summary.py",
          code: `# CASO-LIM-008 · Counter reasons
# DEFECT: no imprime counts
from collections import Counter
reasons = ['col_count', 'cast_monto', 'col_count', 'schema']
for k, v in sorted(Counter(reasons).items()):
    pass`,
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
          "E1 (guiado) — Parseá el string JSON crudo con id C001 usando `json.loads` (sin slices manuales del texto) e imprimí `obj['id']`. Pass: `C001`. Solo stdlib.",
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
          code: `# CASO-LIM-008 · json.loads
# DEFECT: slice manual; no usa loads
import json
raw = '{"id":"C001"}'
print(raw[7:11])`,
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
          "E2 (independiente) — `json.dumps({'nombre': 'José'}, ensure_ascii=False)` e imprimí el string (José legible, no `\\u`). Pass: `{\"nombre\": \"José\"}`. Solo stdlib.",
        hint: "ensure_ascii=False",
        hints: [
          "ensure_ascii=False",
          "print string",
        ],
        edgeCases: ["tildes"],
        tests: "José legible sin \\u",
        feedback: "ensure_ascii=False para logs Latam legibles.",
        starterCode: {
          language: 'python',
          title: "dumps_utf8.py",
          code: `# CASO-LIM-008 · ensure_ascii
# DEFECT: ensure_ascii=True escapea José
import json
s = json.dumps({'nombre': 'José'}, ensure_ascii=True)
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
          "E3 (transferencia) — Intentá `json.dumps` de un dict con `datetime`; capturá `TypeError` e imprimí el nombre de la excepción; luego serializá con `.isoformat()`. Pass: `TypeError` y `{\"ts\": \"2026-01-15T10:00:00\"}`.",
        hint: "datetime no serializable",
        hints: [
          "datetime no serializable",
          "convierte a .isoformat()",
        ],
        edgeCases: ["TypeError datetime"],
        tests: "TypeError\\n{\"ts\": \"2026-01-15T10:00:00\"}",
        feedback: "Serializa tipos no-JSON de forma explícita.",
        starterCode: {
          language: 'python',
          title: "json_datetime.py",
          code: `# CASO-LIM-008 · datetime JSON
# DEFECT: default=str oculta TypeError; no usa isoformat explícito
import json
from datetime import datetime
obj = {'ts': datetime(2026, 1, 15, 10, 0, 0)}
print(json.dumps(obj, default=str))`,
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
          "E1 (guiado) — Implementá `validate_schema(obj, required)`: con `obj={'id':'C1'}` y `required=['id','email']` devolvés `(False, ['email'])` porque falta la clave. Imprimí el tuple. Solo stdlib.",
        hint: "list comprehension missing",
        hints: [
          "list comprehension missing",
          "print ok, missing",
        ],
        edgeCases: ["required"],
        tests: "(False, ['email'])",
        feedback: "Schema mínimo del contrato de ingesta.",
        starterCode: {
          language: 'python',
          title: "schema_required.py",
          code: `# CASO-LIM-008 · validate_schema
# DEFECT: siempre True
def validate_schema(obj, required):
    return True, []
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
          "E2 (independiente) — Null explícito: `obj = {'id':'C1','email': None}`. Imprimí `'email' in obj` y `obj['email']`. Pass: `True` luego `None` (clave presente con valor nulo ≠ clave ausente).",
        hint: "'email' in obj",
        hints: [
          "'email' in obj",
          "None is not missing key",
        ],
        edgeCases: ["null explícito"],
        tests: "True\\nNone",
        feedback: "null JSON llega como None con clave presente.",
        starterCode: {
          language: 'python',
          title: "null_explicit.py",
          code: `# CASO-LIM-008 · None vs missing
# DEFECT: confunde 'email' in obj con truthiness
obj = {'id': 'C1', 'email': None}
print(bool(obj.get('email')))
print(obj.get('email'))`,
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
          "E3 (transferencia) — Añadí campo opcional `segment` con default `'standard'` vía `setdefault` sin pisar si ya existe. Dos objs: sin segment y con `vip`. Pass: `{'id': 'C1', 'segment': 'standard'}` y `{'id': 'C2', 'segment': 'vip'}`.",
        hint: "setdefault",
        hints: [
          "setdefault",
          "No uses assignment ciego que pisa vip",
        ],
        edgeCases: ["evolución compatible"],
        tests: "standard vs vip",
        feedback: "Defaults compatibles no rompen productores viejos.",
        starterCode: {
          language: 'python',
          title: "default_field.py",
          code: `# CASO-LIM-008 · setdefault
# DEFECT: assignment pisa vip
a = {'id': 'C1'}
b = {'id': 'C2', 'segment': 'vip'}
a['segment'] = 'standard'
b['segment'] = 'standard'
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
          "E1 (guiado) — Escribí `b'abc'` a un temp file, calculá `sha256` hex e imprimí los primeros 8 chars y `len(dig)` (64). Pass: `ba7816bf 64`. Solo stdlib.",
        hint: "hashlib.sha256(path.read_bytes()).hexdigest()",
        hints: [
          "hashlib.sha256(path.read_bytes()).hexdigest()",
          "temp file con write_bytes",
        ],
        edgeCases: ["hash file"],
        tests: "ba7816bf 64",
        feedback: "Fingerprint del input para el manifest.",
        starterCode: {
          language: 'python',
          title: "hash_file.py",
          code: `# CASO-LIM-008 · sha256
# DEFECT: usa hash() builtin; len no es 64
from pathlib import Path
import hashlib, tempfile
td = Path(tempfile.mkdtemp())
p = td / 'f.bin'
p.write_bytes(b'abc')
dig = str(hash(p.read_bytes()))
print(dig[:8], len(dig))`,
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
          "E2 (independiente) — En un temp dir escribí `in.csv` con `'a\\n'`, copiá a `in.csv.bak` con `shutil.copy2`, y imprimí si `bak.read_bytes() == src.read_bytes()`. Pass: `True`. Solo stdlib.",
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
          code: `# CASO-LIM-008 · copy2 backup
# DEFECT: no copia; solo chequea exists
from pathlib import Path
import shutil, tempfile
td = Path(tempfile.mkdtemp())
src = td / 'in.csv'
src.write_text('a\\n', encoding='utf-8')
bak = td / 'in.csv.bak'
print(bak.exists())`,
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
          "E3 (transferencia) — Armá dict de provenance `{path, sha256, bytes}` para un temp `clients.csv` con contenido `id\\nC1\\n` (path solo name). Imprimí el dict. Pass: path `clients.csv`, sha256 `b776a3a3…`, `bytes` 6.",
        hint: "stat().st_size",
        hints: [
          "stat().st_size",
          "sha256 completo del crudo",
        ],
        edgeCases: ["provenance dict"],
        tests: "path/sha256/bytes; bytes==6",
        feedback: "Provenance mínima por fuente del gate.",
        starterCode: {
          language: 'python',
          title: "provenance_dict.py",
          code: `# CASO-LIM-008 · provenance dict
# DEFECT: omite sha256 y bytes
from pathlib import Path
import hashlib, tempfile
td = Path(tempfile.mkdtemp())
p = td / 'clients.csv'
p.write_text('id\\nC1\\n', encoding='utf-8')
prov = {'path': p.name}
print(sorted(prov.items()))`,
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
          "E1 (guiado) — Construí un manifest con `run_id` y `sources` (clients.csv + transactions.json): cada fuente con name, sha256, n_in, n_clean, n_quarantine y `reconcile_ok` derivado. Totales con `sum`; no hardcodees. Pass: totales `5 4 1`, ambas fuentes True, manifest True.",
        hint: "Calcula reconcile_ok por fuente antes de sumar",
        hints: [
          "Calcula reconcile_ok por fuente antes de sumar",
          "sources contiene clients.csv y transactions.json.",
        ],
        edgeCases: ["dos fuentes", "totales derivados"],
        tests: "totales 5/4/1; ambas reconcile_ok True; manifest True",
        feedback: "El contrato conserva provenance y conteos por fuente.",
        starterCode: {
          language: 'python',
          title: "manifest_min.py",
          code: `# CASO-LIM-008 · per-source reconcile flag
# DEFECT: always reconcile_ok True; no totales derivados
sources = [
    {'name': 'clients.csv', 'sha256': 'abc', 'n_in': 3, 'n_clean': 2, 'n_quarantine': 1},
    {'name': 'transactions.json', 'sha256': 'def', 'n_in': 2, 'n_clean': 2, 'n_quarantine': 0},
]
for source in sources:
    source['reconcile_ok'] = True
    print(source['name'], source['reconcile_ok'])`,
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
          "E2 (independiente) — Implementá `reconcile_sources(sources)`: exige `n_in == n_clean + n_quarantine` **por cada fuente** y que los totales derivados cuadren. Probalo con un caso good y un `compensated_bad` (agregado 10==9+1 pero fuentes rotas). Pass: `True` luego `False`.",
        hint: "all(s['n_in'] == s['n_clean'] + s['n_quarantine'] for s in sources)",
        hints: [
          "all(s['n_in'] == s['n_clean'] + s['n_quarantine'] for s in sources)",
          "Prueba un caso donde el agregado cuadra pero cada fuente no.",
        ],
        edgeCases: ["errores compensados entre fuentes"],
        tests: "good=True; compensated_bad=False",
        feedback: "La igualdad agregada sola es insuficiente.",
        starterCode: {
          language: 'python',
          title: "reconcile.py",
          code: `# CASO-LIM-008 · reconcile_sources
# DEFECT: siempre True; no valida por fuente
def reconcile_sources(sources):
    n_in = sum(s['n_in'] for s in sources)
    n_clean = sum(s['n_clean'] for s in sources)
    return True, n_in, n_clean, 0
sources = [
    {'n_in': 3, 'n_clean': 2, 'n_quarantine': 1},
    {'n_in': 2, 'n_clean': 2, 'n_quarantine': 0},
]
print(reconcile_sources(sources))`,
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
          "E3 (transferencia · **mini-ensamblaje pre–You Do**) — Implementá `run(sources)` como el núcleo de salida del ETL: publica solo si **todas** las fuentes cumplen `n_in == n_clean + n_quarantine`. Caso good (clients.csv 4=2+2) → `OK` / `exit_code 0`. Caso compensated_bad (clients y transactions rotos) → `ERROR sources=clients.csv,transactions.json` / `exit_code 1`. Fail-closed: no digas OK si alguna fuente no cuadra. Este es el mismo contrato que `run()` del You Do.",
        hint: "Recolectá nombres de fuentes rotas; si la lista no está vacía, ERROR + exit 1",
        hints: [
          "broken = [s['name'] for s in sources if s['n_in'] != s['n_clean'] + s['n_quarantine']]",
          "Reportá todas las fuentes rotas unidas por coma; no publiques OK parcial.",
        ],
        edgeCases: ["fail closed", "compensated multi-source", "bridge You Do"],
        tests: "good OK/0; bad ERROR sources=clients.csv,transactions.json/1",
        feedback: "Fail-closed protege consumidores del clean. En el You Do, este if es el último paso de run() antes de SystemExit.",
        starterCode: {
          language: 'python',
          title: "fail_reconcile.py",
          code: `# CASO-LIM-008 · run exit_code (puente You Do)
# DEFECT: siempre OK aunque n_in no cuadre por fuente
def run(sources):
    print('OK')
    print('exit_code', 0)
    return 0
print(run([{'name': 'a', 'n_in': 2, 'n_clean': 1, 'n_quarantine': 0}]))`,
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
      "Cierras el gate **CP-N1-B**. Los We Do de T1–T4 te dieron las piezas; aquí las **ensamblás** en un ETL **local-python**. **Receta de ensamblaje (orden sugerido):** (1) `sha256_file` + backup del crudo (T4-A); (2) `load_clients_csv` con dialecto, Decimal y cuarentena `{raw, reason}` (T2); (3) `load_transactions_json` con `validate_schema` + Decimal (T3); (4) `write_atomic` de clean y quarantine (T1-B); (5) `build_manifest` con totales derivados y `reconcile_ok` por fuente (T4-B); (6) `run` retorna 0 solo si todo reconcilia — si no, exit 1 (E3 de T4-B). Rutas: `data/clients.csv` + `data/transactions.json` (sintéticos) → `out/clean/`, `out/quarantine/`, `out/manifest.json`. CLI instalable llega en S10. Solo datos sintéticos; sin PII real ni claims de fraude o parentesco.",
    objectives: [
      "Ingesta CSV y JSON con contratos documentados",
      "Validar/normalizar y cuarentenar rejects con motivo estable",
      "Manifest por fuente con hash del crudo, conteos, reconciliación y totales derivados",
      "Pruebas normal / borde / error (incluye reconcile fallido → exit 1)",
      "Fail-closed: no publicar clean si alguna fuente no cuadra",
    ],
    requirements: [
      "Entradas sintéticas clients.csv + transactions.json",
      "Salidas out/clean/, out/quarantine/, out/manifest.json",
      "Integrar normalizadores (S05–S07) y modelo en memoria (S06) donde aplique",
      "README + demo local-python reproducible",
      "Cada fuente cumple n_in == n_clean + n_quarantine o el pipeline termina con exit != 0",
      "Los totales del manifest se derivan de sources; una compensación entre fuentes nunca oculta un error",
      "Montos entran como texto, se convierten con Decimal y se serializan como texto decimal",
      "write_atomic usa tmp = path.with_name(path.name + '.tmp') + os.replace",
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
    # Contrato: corrige el DEFECT del starter (no dejes NotImplemented)
    raise NotImplementedError


def write_atomic(path: Path, text: str) -> None:
    # Contrato: tmp = path.with_name(path.name + ".tmp") en el mismo dir; luego os.replace
    # Corrige el DEFECT del starter (no dejes NotImplemented)
    raise NotImplementedError


def load_clients_csv(path: Path) -> tuple[list[dict], list[dict]]:
    """→ (good_rows, quarantine_rows with reason)."""
    # Contrato: irregular rows + casts → quarantine
    raise NotImplementedError


def load_transactions_json(path: Path) -> tuple[list[dict], list[dict]]:
    # Contrato: schema mínimo id/client_id/monto; Decimal + quantize("0.01")
    raise NotImplementedError


def build_manifest(
    *,
    sources: list[dict[str, Any]],
) -> dict[str, Any]:
    """Deriva totales y reconcile_ok desde cada fuente; no acepta totales agregados."""
    # Contrato: validar name/sha256/conteos; reconcile por fuente; sumar totales
    raise NotImplementedError


def run(data_dir: Path, out_dir: Path) -> int:
    """Retorna exit code 0/1."""
    # Contrato: backup, load, write clean/quar, manifest; fail if not reconcile
    raise NotImplementedError


def main() -> None:
    root = Path(__file__).resolve().parent
    code = run(root / "data", root / "out")
    raise SystemExit(code)


if __name__ == "__main__":
    main()
`,
    portfolioNote:
      "Adjunta: (1) manifest de demo con reconcile_ok por fuente, (2) al menos 1 fila de cuarentena con reason estable, (3) hashes de ambos inputs crudos, (4) un test o corrida de reconciliación fallida (exit 1). Esa carpeta es la evidencia del gate CP-N1-B ante un revisor o entrevista junior de data engineering.",
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
        question: "¿Cuál es la escritura atómica típica en este curso?",
        options: ["open(dest,'w') y escribir directo siempre", "escribir a temp (name + '.tmp') y os.replace al destino", "solo print al stdout", "append eterno al mismo file"],
        correctIndex: 1,
        explanation:
          "temp + replace evita dejar dest truncado si hay crash mid-write. Contrato: path.with_name(path.name + '.tmp').",
      },
      {
        question: "Una fila CSV con columnas de más debe…",
        options: ["Ignorarse en silencio", "Rellenarse con None sin traza", "Ir a cuarentena con motivo (p. ej. col_count)", "Pisar el header"],
        correctIndex: 2,
        explanation:
          "Irregular → quarantine + reason estable; no desalinear en silencio.",
      },
      {
        question: "Reconciliación del manifest por fuente exige…",
        options: ["n_in == n_clean + n_quarantine", "n_clean > n_in", "solo n_quarantine == 0", "hash del clean == hash del input"],
        correctIndex: 0,
        explanation:
          "Toda fila de entrada termina en clean o quarantine (para esa fuente).",
      },
      {
        question: "Si reconcile falla, el pipeline debe…",
        options: ["Publicar clean igual", "Borrar el manifest", "Ignorar la fuente rota y seguir", "Fallar (exit non-zero) / fail-closed"],
        correctIndex: 3,
        explanation:
          "Fail-closed protege a consumidores; el gate exige conteos cuadrados.",
      },
      {
        question: "En el manifest de ingesta, el sha256 debe calcularse sobre…",
        options: ["El archivo clean final", "El archivo de entrada crudo", "Solo el header CSV", "La suma de n_clean"],
        correctIndex: 1,
        explanation:
          "La provenance fija el input; si el crudo cambia, el hash cambia.",
      },
      {
        question: "¿Qué es JSONL en este gate?",
        options: ["Un CSV con comas escapadas como JSON", "Solo arrays indentados con indent=2", "Un objeto JSON por línea (append-friendly)", "Un formato binario de pandas"],
        correctIndex: 2,
        explanation:
          "JSONL: una línea = un json.dumps(row). Útil para streams de transacciones.",
      },
      {
        question: "Para montos en CSV/JSON del gate, ¿qué contrato usás?",
        options: ["Decimal desde texto, quantize 0.01, serializar como string", "float y redondeo con round()", "int de céntimos sin validar", "None silencioso si el cast falla"],
        correctIndex: 0,
        explanation:
          "Continúa el contrato de S02: Decimal, nunca float; fallos de cast → cuarentena.",
      },
      {
        question: "`null` JSON con clave presente vs clave ausente…",
        options: ["Son siempre lo mismo en Python", "null borra la clave automáticamente", "pathlib los unifica", "null → None con clave presente; clave ausente no aparece en el dict"],
        correctIndex: 3,
        explanation:
          "'email' in obj es True si email: null; False si la clave no existe.",
      },
      {
        question: "¿Por qué no alcanza validar solo n_in == n_clean + n_quarantine en el total agregado?",
        options: ["Porque el hash debe coincidir con n_in", "Porque un sobrante en una fuente puede compensar un faltante en otra", "Porque Decimal no soporta sumas", "Porque JSONL no tiene totales"],
        correctIndex: 1,
        explanation:
          "Reconciliación por fuente evita errores compensados entre CSV y JSON.",
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
      {
        label: "os.replace — atomic rename",
        url: "https://docs.python.org/3/library/os.html#os.replace",
        note: "Escritura atómica temp→dest",
      },
      {
        label: "decimal — for money in casts",
        url: "https://docs.python.org/3/library/decimal.html",
        note: "Cast de montos desde CSV",
      },
    ],
    books: [
      {
        label: "Python Cookbook (Beazley/Jones) — files/csv",
        note: "Patrones de archivos; adaptar a cuarentena/manifest del curso.",
      },
      {
        label: "Designing Data-Intensive Applications (Kleppmann) — ch. de storage/batch",
        note: "Ideas de lineage, idempotencia y fail-closed; mapear a CP-N1-B local.",
      },
    ],
    courses: [
      {
        label: "Real Python — Working with files",
        url: "https://realpython.com/working-with-files-in-python/",
        note: "pathlib y contextos; practicar en local-python.",
      },
      {
        label: "MIT 6.100L",
        url: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/",
        note: "Archivos y contratos básicos en Python",
      },
      {
        label: "Harvard CS50P",
        url: "https://cs50.harvard.edu/python/",
        note: "CSV y file I/O",
      },
      {
        label: "Python for Everybody (py4e) — files & data",
        url: "https://www.py4e.com/",
        note: "Lectura de archivos y datos; reforzar stdlib antes de pandas",
      },
    ],
  },
}
