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
    "En banca, fintech o retail en Perú, tu primer ETL (extract, transform, load) de verdad casi nunca es un notebook de gráficos: es abrir un CSV de clientes y un JSON de transacciones sin romper tildes ni montos, mandar las filas irregulares a cuarentena con motivo, hashear el crudo y dejar un manifest (un JSON con los conteos de la corrida) que un auditor pueda releer. Aquí aprendes a construir ese pipeline fail-closed (que aborta en vez de publicar a medias) con reconciliación por fuente. En una entrevista junior, esa disciplina demuestra que sabes detectar pérdidas en vez de ocultarlas detrás de una salida aparentemente correcta.",
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
            heading: "El archivo que no escribiste tú",
      paragraphs: [
        "En S07 arreglaste el texto que ya tenías en memoria. Ahora ese texto llega dentro de un archivo que preparó otra persona, en otra máquina, con otro programa, y que nadie va a corregir por ti. Un exportado de Excel puede traer punto y coma en vez de coma; puede empezar con tres bytes invisibles que Excel añade y que convierten la primera columna en algo con un nombre raro; puede estar guardado en una codificación antigua que transforma «Muñoz» en «MuÃ±oz». De esas tres, la peligrosa es la última: no falla, solo miente.",
        "Por eso la primera decisión es dónde se detiene el programa. Cuando una fila no cumple lo prometido, hay dos salidas malas y una buena. Descartarla en silencio pierde información. Rellenarla con un valor plausible inventa información. La buena es la **cuarentena**: la fila se aparta a un archivo propio, acompañada del motivo por el que no pasó y de su texto original intacto. Nadie tiene que adivinar después qué se descartó ni por qué.",
        "La cuarentena solo sirve si las cuentas cuadran, y esa es la idea que sostiene la sección entera. Si entraron mil filas, la suma de las limpias más las apartadas tiene que dar mil exactamente. A esa comprobación se le llama **reconciliación**, y cuando no cuadra el programa termina con error en lugar de publicar un resultado a medias. Un resultado a medias es peor que ninguno, porque parece completo.",
        "Falta poder responder de dónde salió todo esto. Cada corrida deja dos rastros. La **procedencia** describe el archivo de entrada: su ruta, su tamaño y su huella digital —un `sha256`, ese número largo que cambia por completo si alguien altera un solo carácter—. El **manifest** es el resumen de la corrida: cuántas filas entraron por cada fuente, cuántas salieron limpias, cuántas quedaron apartadas. Con esos dos archivos, la corrida del martes se puede comparar con la del miércoles sin abrir un solo dato.",
        "Verás dos formas de guardar JSON y conviene distinguirlas desde el principio: un archivo con una lista completa hay que leerlo entero antes de tocar nada, mientras que **JSONL** —un objeto JSON por línea— se puede leer de a poco y se le puede añadir al final sin reescribirlo. Para un registro de cuarentena que crece durante la corrida, la segunda forma es la natural — con una salvedad que verás en T1-B y conviene anticipar. El `write_atomic` de este curso escribe el archivo entero y luego reemplaza el destino, que es lo contrario de añadir una línea. No es un olvido: son dos garantías distintas y eliges una. Añadiendo línea a línea ves el progreso en vivo, pero si el proceso muere a media escritura la última línea queda partida y el archivo deja de ser JSONL válido. Acumulando en memoria y escribiendo una vez al final, el archivo o está completo o no existe. En el lab hacemos lo segundo, porque el lote cabe en memoria; con un lote que no cupiera, el append incremental vuelve a ser la respuesta correcta.",
        "La pregunta que atraviesa la sección es de contabilidad, no de programación: **¿cuántas filas entraron y dónde está cada una ahora?** Todo se hace con la biblioteca estándar —`pathlib`, `csv`, `json`, `hashlib`, `Decimal`—, sin bibliotecas externas de datos. Pandas llega en el bloque intermedio; primero hay que entender qué es lo que pandas te va a estar ahorrando.",
      ],
      callout: {
        type: "info",
        title: "Gate CP-N1-B — qué cuenta como cierre",
        content:
          "Al finalizar esta sección demuestras un ETL local reproducible: clean + quarantine + manifest reconciliado por fuente, con hash del crudo y exit ≠ 0 si no cuadra. El CLI instalable llega en S10 (Módulos & CLI). Solo datos sintéticos; sin PII real ni claims de fraude o parentesco.",
      },
     },
     {
      heading: "Contrato de la sección (referencia)",
      optional: true,
      paragraphs: [
        "Bloque de referencia. Orden de los subtemas, ritmo, vocabulario y criterio de cierre.",
        "**Orden de los subtemas.** T1 trata los archivos: rutas con `pathlib`, UTF-8, escritura atómica y saltos de línea. T2 pasa al CSV: dialecto, conversión de tipos y cuarentena. T3 cubre JSON: lista frente a JSONL, schema y nulos. T4 cierra con procedencia: huella del crudo, copia de respaldo, manifest y reconciliación.",
        "**Ritmo orientativo.** Unas dieciocho horas, dos sesiones por subtema, más el proyecto CP-N1-B y el autochequeo al final.",
        "**Vocabulario que se usa a lo largo de la sección.** *Ruta* (`pathlib.Path`): la dirección de un archivo, escrita de forma que funcione igual en Windows, macOS y Linux. *Dialecto*: las reglas concretas de un CSV, empezando por el separador. *Falla cerrada*: si la reconciliación no cuadra, el programa termina con código distinto de cero y no publica nada.",
        "**Criterio de cierre (CP-N1-B).** Un ETL local reproducible: archivo limpio, archivo de cuarentena y manifest reconciliado por fuente, con la huella del crudo y salida distinta de cero si las cuentas no cuadran. La CLI instalable llega en S10.",
        "**Qué integra.** Los normalizadores de S05 a S07 y el modelo en memoria de S06. Entorno local, datos sintéticos en `data/` y salidas en `out/`.",
        "**Límites.** Solo la biblioteca estándar. Nunca datos personales reales, nunca inferencia automática de parentesco o fraude.",
      ],
      code: {
        language: 'python',
        title: "s08_gate_contract.py",
        code: `def s08_gate_contract():
    return {
        "gate": "CP-N1-B",
        "stack": ["pathlib", "csv", "json", "hashlib", "Decimal"],
        "artifacts": ["clean", "quarantine", "manifest"],
        "reconcile": "n_in == n_clean + n_quarantine",
        "real_pii_ok": False,
    }

c = s08_gate_contract()
print("gate", c["gate"])
print("artifacts", ",".join(c["artifacts"]))
print("reconcile", c["reconcile"])
print("real_pii_ok", c["real_pii_ok"])`,
        output: `gate CP-N1-B
artifacts clean,quarantine,manifest
reconcile n_in == n_clean + n_quarantine
real_pii_ok False`,
      },
     },
     {
      heading: "pathlib, with, modos y encodings",
      subtopicId: "S08-T1-A",
      paragraphs: [
        "`pathlib.Path` unifica rutas en Windows, macOS y Linux: `Path('data') / 'clients.csv'` evita armar strings con `\\` o `/` a mano. `Path.read_text(encoding='utf-8')` / `write_text` son convenientes; `with path.open(...) as f` da control fino de modo y cierra el handle aunque falle el cuerpo. En CP-N1-B el *porqué* es operativo: **rastro auditable** de cada input y salidas predecibles para el manifest — no “abrir un archivo por curiosidad”.",
        "Modos: `r` lectura, `w` trunca, `a` append, `x` crea exclusivo (falla si ya existe). **Siempre** declara `encoding='utf-8'` en texto: en Windows el locale del SO **no** es un contrato portable. `errors=` (`strict` por defecto, `replace`, `ignore`) es una decisión **documentada** en el README del pipeline, no un default mágico. En este gate usas solo la biblioteca estándar —pathlib, csv, json, hashlib, shutil, os y Decimal—, sin librerías externas de datos. `os` está en la lista porque la escritura atómica de T1-B termina en `os.replace`.",
        "`path.exists()` / `is_file()` evitan abrir a ciegas y ayudan a mensajes de error claros. No asumas el cwd del IDE: ancla rutas al proyecto con `Path(__file__).resolve().parent` o paths relativos **documentados** (`data/`, `out/`). Si `read_text(encoding='utf-8')` lanza `UnicodeDecodeError`, el contrato del gate es fail-closed: manda el **archivo** a cuarentena (o reintenta con un encoding explícito acordado), no “arregles” tildes a ojo.",
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
          "En Windows el default de texto no siempre es UTF-8. Para intake del gate: encoding='utf-8' siempre; si el export trae BOM de Excel, usa 'utf-8-sig' de forma documentada.",
      },
    },
    {
      heading: "Newlines y escritura atómica",
      subtopicId: "S08-T1-B",
      paragraphs: [
        "CSV en Python: abre con `newline=''` para que el módulo `csv` controle terminadores y no pelee con la traducción de newlines del runtime. En salidas del pipeline prefiere `\\n` (LF) aunque el input haya venido de Excel en Windows. Sin `newline=''`, Windows puede insertar CR dobles y el dialecto se rompe al releer el clean.",
        "**Escritura atómica** (contrato único del curso, no hay otro): `tmp = path.with_name(path.name + \".tmp\")` — p. ej. `clean.csv` → `clean.csv.tmp` en el **mismo** directorio que el destino — escribes el contenido completo al tmp y luego `os.replace(tmp, dest)`. Si el proceso muere a medias, el consumidor del clean no ve un archivo truncado a la mitad.",
        "Detectar `\\r\\n` en **bytes** de input documenta provenance (origen Windows vs. Unix) en el manifest o en logs. Eso **no** “arregla” el archivo ni reescribe el crudo: solo registra un hecho útil para depurar exports raros. El You Do reutilizará el mismo `write_atomic` para clean, quarantine y manifest.",
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
        "`csv.DictReader` / `DictWriter` trabajan con headers: cada fila sale como dict. **Declara `fieldnames`** al escribir; no confíes en el orden “que se ve” en Excel. El cast de tipos (`int`, `Decimal`) es **explícito**: un fallo va a cuarentena con `{raw, reason}` — nunca un `0` mágico sin traza. El contrato monetario de S02 continúa: `Decimal` desde texto, cuantizado a `0.01`, serializado como **string** (`\"10.50\"`), **nunca** `float` (el binario del float rompe cuadraturas y tests).",
        "Fechas pueden quedarse como **string ISO** (`YYYY-MM-DD`) en N1-B: no hace falta `datetime` todavía si el contrato lo documenta. Lo crítico es el **contrato de columnas** (nombres, tipos, required) versionado en el manifest o en el README del pipeline. Si falta una columna requerida o el cast falla, la fila **no** entra a clean.",
        "Dialectos reales en Latam: `delimiter=';'` es común en exports Excel en español; la coma es el default anglosajón. El BOM de Excel “CSV UTF-8” se quita abriendo con `encoding='utf-8-sig'`. **No** asumas el dialecto: inspecciona las primeras líneas o el contrato de la fuente y deja delimiter/encoding **explícitos** en el código de ingesta.",
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
        "Filas con **más o menos columnas** que el header son irregulares (export cortado, comas de más, fila basura al final). **No** las “arregles” en silencio ni trunques a medias: mándalas a cuarentena con **motivo** estable (`reason: \"col_count\"`) y conserva el **raw** (lista o string de la fila). Silenciar irregular desalinea columnas y corrompe métricas del gate.",
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
        "`json.loads` / `dumps` trabajan con strings; `load` / `dump` con archivos. Objects JSON → `dict`; arrays → `list`. **JSONL** (un objeto por línea, terminado en `\\n`) es útil para streams de transacciones: puedes hacer append de una línea sin reescribir el archivo entero. El demo I Do de T3-A escribe **ambos** formatos. JSON **no** tiene tipo Decimal: serializamos montos como strings (`\"10.00\"`) y al leerlos reconstruimos `Decimal` — **nunca** float.",
        "`ensure_ascii=False` preserva tildes legibles (`José`, `Ñahui`) en logs y en clean; con el default `True` verías `\\u00e9` y el review se vuelve ilegible. `sort_keys=True` ayuda al **determinismo** en manifests (eco de S06): dos corridas con los mismos datos producen el mismo JSON de control.",
        "`datetime` y `Decimal` no son serializables por defecto. Convierte fechas a `isoformat()` (o str ISO) y montos a string **antes** de `dumps`. Si olvidas el paso, captura `TypeError` y manda la fila a cuarentena o normaliza el campo — no uses `default=str` como escape silencioso en producción del gate.",
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
        "**Valida** las **required keys** antes de normalizar o castear montos. `null` en JSON se convierte en `None` en Python. **Distingue** **null explícito** de **clave ausente** cuando la política lo pide (eco de S03: missing ≠ empty): `'email' in obj` es `True` aunque el valor sea `None`; si la clave no vino en el JSON, la membresía es `False`. Esa diferencia decide si “borrar email” o “email desconocido”.",
        "Evolución compatible: añadir un campo opcional con **default** (`setdefault('segment', 'standard')`) no rompe productores viejos que aún no envían `segment`. Quitar un required o renombrar una clave **sí** es breaking: versiona el schema en el manifest del run (`schema_version`) o en el contrato de la fuente.",
        "`validate_schema(obj, required)` devuelve `(ok, missing)` para decidir clean vs. cuarentena. Si falta `id` o un email requerido, la fila no pasa: fail-closed, **sin inventar** valores “para que el dashboard no se vea vacío”. El You Do aplica el mismo patrón a transacciones (`id`, `client_id`, `monto`).",
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
          "Documenta en el contrato si null borra el valor o significa unknown. En Python: 'email' in obj distingue clave presente (aunque sea None) de clave ausente.",
      },
    },
    {
      heading: "Backups, hashes y provenance",
      subtopicId: "S08-T4-A",
      paragraphs: [
        "`hashlib.sha256` del **contenido del input crudo** fija un fingerprint en el manifest. Si el CSV cambia un solo byte (una coma, un BOM, un `\\r`), el hash cambia: detectas reprocesos, re-ingestas y “¿corrimos sobre el archivo de ayer?”. Hashea el archivo de **entrada**, **no** el clean: el clean es un producto; el crudo es la evidencia.",
        "Backup: copia a `input.bak` o a `backups/` con `shutil.copy2` **antes** de cualquier transformación o escritura de salida. No mutes el original in place ni “normalices” el crudo sobre sí mismo: el gate exige provenance del input intacto para rehacer la corrida.",
        "Provenance mínima por fuente: `{path, sha256, bytes}` (y opcionalmente `received_at` ISO). Con el fixture de laboratorio `id\\nC1\\n` el tamaño es **6** bytes y el digest es fijo (`b776a3a3…`); si cambias el fixture, **recalcula** el hash en demos y tests — no copies un hex de memoria.",
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
      figure: {
        id: "S08-reconcile",
        caption:
          "La suma es la única prueba de que ninguna fila se perdió por el camino. Cuando no cuadra, lo que falta no es un número: es una fila que nadie sabe dónde quedó.",
        alt:
          "Mil filas entran por la izquierda y el flujo se divide en dos: 987 pasan el contrato y 13 quedan en cuarentena. Abajo, la igualdad 1000 igual a 987 más 13.",
      },
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
        "En **S09** profundizas **excepciones y logging**: cómo registrar `UnicodeDecodeError`, fallos de cast y reconcile **sin silenciar**, y cómo un log estructurado complementa (no reemplaza) el manifest. Lleva contigo el vocabulario fail-closed: cuarentena con motivo, no relleno mágico, exit ≠ 0 cuando los conteos no cierran.",
        "Checklist mental antes del You Do (si fallas una, vuelve al We Do de ese tema): ¿tmp es `name + \".tmp\"`? ¿montos son string Decimal cuantizado? ¿cada fila de entrada está en clean o quarantine? ¿el sha256 es del **input** crudo? ¿cada fuente reconcilia sola (no solo el total)? ¿el run falla si alguna fuente no cuadra?",
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
    intro: "Ocho demos I Do (T1→T4) en **local-python** (filesystem/temp). Cada una modela una pieza del ETL del gate CP-N1-B: **lee** el código, **anticipa** la salida, luego **contrasta**. Datos sintéticos únicamente — sin PII real.",
    steps: [
      {
        demoId: "S08-T1-A-DEMO",
        subtopicId: "S08-T1-A",
        environment: "local-python",
        description: "Leer y escribir intake UTF-8 con Path",
        preamble:
          "Antes de parsear CSV o JSON, el intake vive en disco. En esta demo creas un archivo sintético con tilde (`José`) usando `Path` y UTF-8 explícito. Observa sin escribir: (1) `write_text(..., encoding='utf-8')` deja bytes legibles; (2) `exists()` confirma que el path es real; (3) `read_text` devuelve el mismo texto. Si omites el encoding, en Windows el locale del SO puede romper tildes. Datos de demo únicamente; no hay PII real.",
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
        why: "Path unifica rutas entre sistemas. `encoding='utf-8'` es el contrato portable del gate: sin él, mojibake y `UnicodeDecodeError` contaminan clean y cuarentena. El resto del ETL (CSV, hash, manifest) hereda este ladrillo — es el primer hábito de ingesta confiable.",
        retrospective:
          "Si puedes explicar por qué `encoding='utf-8'` no es “detalle de estilo” sino contrato de ingesta, ya tienes el hábito del gate. El error clásico es confiar en el default del SO. En We Do T1-A practicarás exists, `with open` y el diagnóstico de `UnicodeDecodeError`.",
      },
      {
        demoId: "S08-T1-B-DEMO",
        subtopicId: "S08-T1-B",
        environment: "local-python",
        description: "write_atomic: tmp + os.replace sin dejar basura",
        preamble:
          "El clean del gate se relee por otros procesos o por ti en la siguiente corrida. Si escribes directo a `clean.csv` y el proceso muere a medias, el consumidor ve basura. Observa la demo: se escribe a `clean.csv.tmp`, luego `os.replace` al destino, y el tmp **desaparece**. Predice la salida (`id,nombre` / `C001,Ana` / `tmp gone True`) antes de contrastar. Contrato único del curso: `path.with_name(path.name + '.tmp')` en el mismo directorio.",
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
        why: "os.replace hace el swap atómico del artefacto de salida. El tmp en el mismo directorio evita renames cross-device. Contrato único del curso: `tmp = dest.with_name(dest.name + '.tmp')`; al terminar no queda basura. Este helper se reutiliza en You Do para clean, quarantine y manifest.",
        retrospective:
          "Temp completo + replace = el destino solo cambia cuando el contenido está listo. No confundas “escribí el string” con “el consumidor ve el estado final”. We Do: detectar CRLF, implementar atomic y simular mid-write.",
      },
      {
        demoId: "S08-T2-A-DEMO",
        subtopicId: "S08-T2-A",
        environment: "local-python",
        description: "Ingesta CSV con monto Decimal y fecha ISO string",
        preamble:
          "El intake de clientes sintéticos trae montos como texto. Observa la demo: `DictReader` arma dicts por header; cada `monto` pasa por `Decimal(...).quantize(Decimal('0.01'))` y se guarda como **string** (`'10.50'`, `'20.00'`). La fecha queda ISO string. No escribas aún: predice la lista de dicts y contrástala. Si usaras `float`, el binario rompería cuadraturas y tests del gate.",
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
        why: "DictReader + Decimal desde texto, quantize a 0.01 y serialización como string: el mismo contrato de dinero de S02, ahora sobre filas CSV. Un cast fallido iría a cuarentena (We Do E3). El dialecto por defecto es coma; el `;` típico en Latam se declara explícito en la teoría del subtema.",
        retrospective:
          "Dinero en texto → Decimal → texto: mismo contrato de S02, ahora sobre filas CSV. No confíes en “parece número”. We Do: DictReader, DictWriter con header y reject por `InvalidOperation`.",
      },
      {
        demoId: "S08-T2-B-DEMO",
        subtopicId: "S08-T2-B",
        environment: "local-python",
        description: "Separar good.csv vs. quarantine.csv",
        preamble:
          "Filas con columnas de más o de menos no se “arreglan” en silencio. Observa: el header fija el largo esperado; `C002,Luis,EXTRA` y `badonly` van a cuarentena con `reason: 'col_count'` y raw conservado; solo `C001,Ana` entra a clean. Predice la tupla `(clean, quar)` antes de mirar la salida. Sin este split, T4 no puede reconciliar `n_in`.",
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
        why: "Cuarentena con `reason` estable (`col_count`) deja audit trail; clean solo tiene filas sanas. El raw intacto permite reprocesar. Sin este split, el reconcile de T4 no tiene de dónde sacar `n_quarantine` por fuente.",
        retrospective:
          "Irregular ≠ “casi bien”: es rechazo con traza. El misconception es truncar o rellenar columnas a ciegas. We Do: booleano col_count, escribir quarantine.csv y resumir motivos.",
      },
      {
        demoId: "S08-T3-A-DEMO",
        subtopicId: "S08-T3-A",
        environment: "local-python",
        description: "Exportar results a JSON array + JSONL",
        preamble:
          "Las transacciones sintéticas salen del mismo `list[dict]`. Observa: `json.dumps(..., ensure_ascii=False, indent=2)` arma un array re-legible; JSONL une un `dumps` por fila con `\\n` (append-friendly). La demo relee el array y las líneas del `.jsonl`. Predice la tupla de retorno antes de contrastar. Montos ya van como string del contrato Decimal.",
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
        why: "Array JSON para batch pequeño y relectura completa; JSONL (una línea = un objeto) para append y streaming de txs. Ambos salen del mismo list de dicts — eliges el formato por el caso de uso. Al escribir a disco, UTF-8 sigue siendo el contrato.",
        retrospective:
          "Formato de salida se elige por caso de uso, no por “cuál es más moderno”. JSONL no es un array roto: es un objeto por línea. We Do: loads, tildes legibles y datetime no serializable.",
      },
      {
        demoId: "S08-T3-B-DEMO",
        subtopicId: "S08-T3-B",
        environment: "local-python",
        description: "validate_schema(obj, required) + campo opcional nuevo",
        preamble:
          "El schema mínimo del gate pide claves presentes, no “truthy”. Observa: `email: None` **pasa** required (la clave existe); falta `email` falla con `['email']`. Luego `setdefault('segment', 'standard')` añade un opcional sin pisar si ya viniera. Predice las tres salidas. Datos sintéticos `C1` / `a@ex.com` — sin PII real.",
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
        why: "Required estricto protege el clean del gate: sin claves mínimas no hay fila válida. Defaults opcionales (`setdefault`) permiten evolucionar el contrato sin romper productores viejos. Null explícito se profundiza en We Do E2.",
        retrospective:
          "Required = presencia de clave; default = evolución compatible. No confundas “falta el campo” con “viene null”. We Do: implementar validate, inspeccionar None y setdefault sin pisar vip.",
      },
      {
        demoId: "S08-T4-A-DEMO",
        subtopicId: "S08-T4-A",
        environment: "local-python",
        description: "sha256 de input CSV + backup `.bak`",
        preamble:
          "El auditor pregunta: “¿sobre qué bytes corriste esta ingesta?”. Observa: se escribe un CSV sintético, se copia a `.bak` con `shutil.copy2`, y se calcula `sha256` de `read_bytes`. La demo imprime 12 hex del digest y `True` si el backup existe. No mutes el crudo después de hashearlo sin registrar un nuevo run. Solo sintéticos.",
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
        why: "El hash es del **input** crudo, no del clean. Backup antes de mutar el workspace. Hash + backup son la provenance mínima del gate: el manifest debe poder decir “corrimos sobre estos bytes exactos”.",
        retrospective:
          "Provenance mínima = path + hash + (en We Do) bytes. El misconception es hashear el clean y decir “es el input”. We Do: sha256 completo, copy2 y dict de provenance.",
      },
      {
        demoId: "S08-T4-B-DEMO",
        subtopicId: "S08-T4-B",
        environment: "local-python",
        description: "manifest.json de una corrida ETL",
        preamble:
          "Esta es la pieza final del gate antes del You Do. Observa: cada fuente trae name, sha256, conteos; se deriva `reconcile_ok` con `n_in == n_clean + n_quarantine`; el manifest suma totales y exige `all(...)`. Predice `n_in=5`, `n_clean=4`, `n_quarantine=1` y `reconcile_ok True`. Ninguna fuente puede esconder pérdidas detrás de otra.",
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
        why: "El manifest prueba reconciliación por fuente y agregada; los totales se **derivan** con `sum`, no se hardcodean. Ninguna fuente puede esconder pérdidas detrás de otra. Es la pieza final antes de ensamblar el You Do (E3 T4-B es el `run()` fail-closed).",
        retrospective:
          "Manifest = evidencia de corrida. Si no cuadra por fuente, no hay “casi OK”. We Do: armar manifest, detectar compensación entre fuentes y publicar solo si todo reconcilia.",
      },
    ],
  },
  weDo: {
    intro: "Andamiaje E1→E2→E3 × 8 (24 ejercicios). Solo stdlib (pathlib, csv, json, hashlib, shutil, Decimal). Fail-closed en reconcile.\n\n**Mapa puente al You Do (ensamblaje):**\n- T1-A → `Path` / `read_text`\n- T1-B → `write_atomic`\n- T2-A → cast `Decimal` + dialecto\n- T2-B → split clean/quarantine + `reason`\n- T3-A → JSON/JSONL\n- T3-B → `validate_schema`\n- T4-A → `sha256` + backup\n- T4-B → manifest + `run` fail-closed\n\nAl terminar T4 deberías reutilizar cada pieza **sin mirar la solución**; el proyecto CP-N1-B solo las conecta en un `run(data_dir, out_dir)`. El E3 de T4-B es el mini-ensamblaje de salida (publicar solo si reconcilia).",
    steps: [
      {
        id: "S08-T1-A-E1",
        subtopicId: "S08-T1-A",
        kind: "guided",
        title: "Crear demo.txt y verificar con exists",
        preamble:
          "- **Contexto:** en el ETL local, antes de leer un intake sintético debes **crearlo** y comprobar que el path existe.\n- **Meta:** practicar `write_text` + `exists` con UTF-8.\n- **Éxito:** imprimes un solo valor: `True`.\n- **Límites:** solo stdlib (`pathlib`, `tempfile`); no uses open a ciegas sin haber escrito.",
        instruction:
          "1. Revisa el starter: se imprime `p.exists()` sin haber escrito nada (siempre False).\n2. Escribe `'hola'` en `demo.txt` con `write_text(..., encoding='utf-8')`.\n3. Imprime solo `p.exists()`.\n4. No agregues texto extra en el `print`.",
        hint: "write_text + exists",
        hints: [
          "write_text + exists",
          "encoding utf-8",
        ],
        edgeCases: ["exists"],
        tests: "print True tras write_text",
        feedback:
          "Un `Path` es solo una ruta: no crea el archivo. `write_text` materializa el contenido; `exists()` confirma el artefacto antes de que el pipeline abra a ciegas. En el gate, este chequeo alimenta mensajes de error claros.",
        retrospective:
          "Crear + verificar es el primer ladrillo de provenance: un `Path` no es un archivo. El error clásico es confiar en que el cwd o el IDE “ya dejaron” el intake. Siguiente (E2): escribir y releer con `with` sin dejar handles abiertos.",
        starterCode: {
          language: 'python',
          title: "path_exists.py",
          code: `# DEFECT: no escribe; exists siempre False
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
        title: "Escribir y releer tres líneas con with",
        preamble:
          "- **Contexto:** el pipeline escribe salidas y relee inputs; un handle sin cerrar es deuda operativa.\n- **Meta:** usar `with path.open` para escribir y leer tres líneas.\n- **Éxito:** imprime `['a', 'b', 'c']`.\n- **Límites:** encoding UTF-8; cierra con `with` (no dejes el archivo abierto a mano).",
        instruction:
          "1. En `lines.txt`, escribe `a`, `b` y `c` (una por línea) con `with p.open('w', encoding='utf-8')`.\n2. Reabre en lectura, aplica `strip` a cada línea y arma la lista.\n3. Imprime solo la lista.\n4. No uses `write_text` aquí: practicas el contexto `with`.",
        hint: "with path.open('w', encoding='utf-8')",
        hints: [
          "with path.open('w', encoding='utf-8')",
          "newline natural \\n",
        ],
        edgeCases: ["with read"],
        tests: "print ['a', 'b', 'c']",
        feedback:
          "`with` garantiza cierre aunque falle el cuerpo — patrón del gate al abrir CSV con `newline=''`. El error típico es olvidar el `\\n` o no hacer `strip` y fallar el assert de la lista limpia.",
        retrospective:
          "Abrir-escribir-cerrar y abrir-leer-cerrar es el ritmo de todo artifact del gate (clean, quarantine, manifest). Luego (E3) verás qué pasa cuando los bytes no son UTF-8 válido.",
        starterCode: {
          language: 'python',
          title: "with_lines.py",
          code: `# DEFECT: no escribe ni lee líneas
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
        subtopicId: "S08-T1-A",
        kind: "transfer",
        title: "Diagnosticar UTF-8 roto y cuarentenar",
        preamble:
          "- **Contexto:** un export sintético llega con bytes que no son UTF-8; el gate no “arregla” tildes a ojo.\n- **Meta:** capturar `UnicodeDecodeError` y nombrar una acción fail-closed.\n- **Éxito:** primera línea `UnicodeDecodeError`; segunda, una acción (cuarentenar o reintentar con encoding documentado).\n- **Límites:** no uses `latin-1` para “hacer que funcione”; no inventes PII real.",
        id: "S08-T1-A-E3",
        instruction:
          "1. El starter lee con `latin-1` y siempre “funciona”: es el defecto.\n2. Intenta `read_text(encoding='utf-8')` dentro de `try`.\n3. En `except UnicodeDecodeError`, imprime `type(e).__name__` y la acción.\n4. No silencies la excepción con otro encoding mágico.",
        hint: "path.write_bytes(b'\\xff\\xfe\\xfa'); try/except UnicodeDecodeError",
        hints: [
          "path.write_bytes(b'\\xff\\xfe\\xfa') — bytes inválidos en utf-8",
          "try/except UnicodeDecodeError; type(e).__name__",
        ],
        edgeCases: ["diagnóstico encoding"],
        tests: "UnicodeDecodeError + acción de cuarentena",
        feedback:
          "Encoding roto es fallo de **archivo**, no de una celda: cuarentena del input o reintento con encoding **documentado** (p. ej. `utf-8-sig` si hay BOM). Tragar con latin-1 oculta mojibake y contamina el hash del crudo.",
        retrospective:
          "Fail-closed en disco: si no puedes leer el contrato UTF-8, no inventes clean. El nombre de la excepción es evidencia. En T1-B el foco pasa a newlines y escritura atómica del artefacto de salida.",
        starterCode: {
          language: 'python',
          title: "diag_decode.py",
          code: `# DEFECT: traga bytes como latin-1 sin cuarentena (siempre "funciona")
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
        subtopicId: "S08-T1-B",
        kind: "guided",
        title: "Detectar CRLF en samples win y unix",
        preamble:
          "- **Contexto:** exports de Excel en Windows suelen traer `\\r\\n`; documentar el origen ayuda al manifest/logs, sin reescribir el crudo.\n- **Meta:** detectar presencia de `b'\\r\\n'` en samples sintéticos.\n- **Éxito:** imprime `True` y luego `False`.\n- **Límites:** solo bytes; no “arregles” el archivo ni conviertas newlines aquí.",
        id: "S08-T1-B-E1",
        instruction:
          "1. El starter usa `b'\\n' in data` (True en win y unix): es el defecto.\n2. Cambia a buscar `b'\\r\\n'`.\n3. Imprime el booleano de `win` y el de `unix`.\n4. No mutes los samples.",
        hint: "b'\\r\\n' in data",
        hints: [
          "b'\\r\\n' in data",
          "Dos samples win/unix.",
        ],
        edgeCases: ["CRLF"],
        tests: "True\\nFalse",
        feedback:
          "`\\n` aparece en ambos mundos; la firma de Windows es el par `\\r\\n`. Detectar no es normalizar: solo registra un hecho de provenance para depurar exports raros.",
        retrospective:
          "Newlines son metadata del origen, no un “error a silenciar”. El misconception es normalizar el crudo en silencio y perder la firma Windows. Autochequeo: ¿por qué `b'\\n' in win` da True y aún así no sirve como detector CRLF? Siguiente (E2): `write_atomic` con el contrato tmp del curso.",
        starterCode: {
          language: 'python',
          title: "detect_crlf.py",
          code: `# DEFECT: busca solo \\n (True en ambos) en vez de \\r\\n
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
        subtopicId: "S08-T1-B",
        kind: "independent",
        title: "Implementar write_atomic con tmp y replace",
        preamble:
          "- **Contexto:** clean, quarantine y manifest del CP-N1-B deben publicarse sin estados a medias.\n- **Meta:** implementar `write_atomic(path, text)` con el contrato del curso.\n- **Éxito:** tras escribir `'ok\\n'`, el contenido final es la línea `ok`.\n- **Límites:** `tmp = path.with_name(path.name + '.tmp')` + `os.replace`; UTF-8; no dejes el tmp.",
        id: "S08-T1-B-E2",
        instruction:
          "1. El starter escribe directo al destino: corrígelo.\n2. Escribe el texto completo al `.tmp` en el mismo directorio.\n3. Haz `os.replace(tmp, path)`.\n4. Escribe `'ok\\n'`, relee e imprime el contenido (sin basura extra).",
        hint: "tmp + os.replace",
        hints: [
          "tmp = path.with_name(path.name + '.tmp')",
          "mismo directorio que dest; os.replace(tmp, path)",
        ],
        edgeCases: ["atomic"],
        tests: "contenido final ok\\n",
        feedback:
          "El tmp debe vivir junto al destino para que `replace` sea atómico en el mismo filesystem. Escribir directo es el anti-patrón: un crash deja el clean truncado a consumidores.",
        retrospective:
          "Esta función es la que reutilizarás en el You Do sin reabrir la solución. Principio: publicar solo el estado final. Luego (E3) contrastarás un mid-write parcial vs. el replace completo.",
        starterCode: {
          language: 'python',
          title: "atomic_impl.py",
          code: `# DEFECT: write directo sin tmp/replace
from pathlib import Path
import os, tempfile

def write_atomic(path, text):
    Path(path).write_text(text, encoding='utf-8')

td = Path(tempfile.mkdtemp())
p = td / 'out.txt'
write_atomic(p, 'ok\\n')
print(p.read_text(encoding='utf-8'), end='')`,
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
        title: "Simular mid-write y cerrar con atomic",
        preamble:
          "- **Contexto:** un consumidor lee `f.txt` mientras el pipeline aún escribe.\n- **Meta:** mostrar estado parcial y luego un replace atómico a estado completo.\n- **Éxito:** `mid PARCIAL` y `final COMPLETO`.\n- **Límites:** el segundo paso debe ser tmp + `os.replace`, no otro `write_text` directo.",
        instruction:
          "1. Deja el primer write de `'PARCIAL'` e imprime `mid …`.\n2. Sustituye el segundo write directo por tmp + `os.replace` a `'COMPLETO'`.\n3. Imprime `final` (no `end`) con el contenido final.\n4. No borres el paso mid: es la evidencia del problema.",
        hint: "Primero write no atómico parcial; luego tmp + os.replace",
        hints: [
          "Primero write no atómico parcial; luego write_atomic",
          "tmp = dest.with_name(dest.name + '.tmp')",
        ],
        edgeCases: ["mid-write vs. atomic"],
        tests: "mid PARCIAL\\nfinal COMPLETO",
        feedback:
          "Atomic no reescribe la historia del parcial: evita que el **siguiente** lector vea un estado intermedio. El label `final` documenta el contrato de salida del gate.",
        retrospective:
          "Mid-write es el enemigo del clean compartido. Si puedes explicar por qué tmp+replace no “arregla” un crash anterior pero sí protege al consumidor, ya internalizaste T1-B. Siguiente tema: CSV con headers y Decimal.",
        starterCode: {
          language: 'python',
          title: "midwrite.py",
          code: `# DEFECT: segundo write directo (no atómico) en vez de tmp+replace
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
        title: "Leer filas CSV con DictReader",
        preamble:
          "- **Contexto:** el clean del gate trabaja por **nombre de columna**, no por posición frágil.\n- **Meta:** usar `csv.DictReader` sobre un StringIO sintético.\n- **Éxito:** imprime `{'id': 'C001', 'nombre': 'Ana'}`.\n- **Límites:** solo stdlib; no hagas `split(',')` manual del cuerpo.",
        instruction:
          "1. El starter parte líneas a mano: rompe si hay comas en campos.\n2. Envuélvelo en `io.StringIO` y recorre con `DictReader`.\n3. Imprime cada fila (dict).\n4. Confirma mentalmente que el header define las claves.",
        hint: "csv.DictReader",
        hints: [
          "csv.DictReader",
          "io.StringIO",
        ],
        edgeCases: ["header"],
        tests: "print dict C001 Ana",
        feedback:
          "`DictReader` usa la primera línea como fieldnames y entrega dicts. El split manual desalinea columnas y es el camino a métricas corruptas del gate.",
        retrospective:
          "Header = contrato de columnas del intake. Siguiente (E2): escribir con `DictWriter` y `writeheader` para que el clean se pueda releer.",
        starterCode: {
          language: 'python',
          title: "dictreader.py",
          code: `# DEFECT: split manual rompe comas en campos
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
        title: "Escribir CSV con writeheader y releer",
        preamble:
          "- **Contexto:** el artefacto clean debe reabrirse con `DictReader` en la siguiente etapa.\n- **Meta:** escribir con `DictWriter` + `writeheader` y verificar relectura.\n- **Éxito:** imprime `1` y luego `{'id': 'C001', 'nombre': 'Ana'}`.\n- **Límites:** declara `fieldnames`; no omitas el header.",
        instruction:
          "1. El starter hace `writerow` sin `writeheader`: el reader no ve columnas.\n2. Añade `writeheader` antes de la fila de Ana.\n3. `seek(0)`, lee con `DictReader`, imprime `len` y `rows[0]`.\n4. No inventes el header a mano en el string; debe salir del `DictWriter`.",
        hint: "writeheader + writerow",
        hints: [
          "writeheader + writerow",
          "En disco real: open(..., newline=''); aquí basta StringIO",
        ],
        edgeCases: ["writer header"],
        tests: "1\\n{'id': 'C001', 'nombre': 'Ana'}",
        feedback:
          "Sin header, `DictReader` interpreta la primera fila de datos como nombres de columna o devuelve vacío según el buffer — el clean deja de ser contrato. `writeheader` es parte del artefacto, no un adorno.",
        retrospective:
          "Salida con header estable = contrato de clean. Luego (E3) el cast de monto decide clean vs. reject con motivo.",
        starterCode: {
          language: 'python',
          title: "dictwriter.py",
          code: `# DEFECT: no writeheader; n=0
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
        title: "Cast Decimal con reject cast_monto",
        preamble:
          "- **Contexto:** montos sintéticos del intake deben cuantizarse a céntimos; un valor basura no entra a clean.\n- **Meta:** `Decimal` + quantize; fallos con motivo estable.\n- **Éxito:** `ok 10.00` / `reject x motivo=cast_monto` / `ok 3.50`.\n- **Límites:** sin `float()`; sin rellenar `0` silencioso.",
        instruction:
          "1. El starter usa `float` y no imprime motivo: corrígelo.\n2. Para cada valor en `['10', 'x', '3.5']`, intenta Decimal quantize `0.01`.\n3. Si `InvalidOperation`, imprime `reject`, valor y `motivo=cast_monto`.\n4. Si ok, imprime `ok` y el monto quantizado.",
        hint: "Decimal(v).quantize(Decimal('0.01')); except InvalidOperation",
        hints: [
          "Decimal(v).quantize(Decimal('0.01')); except InvalidOperation",
          "No uses float ni 0 silencioso.",
        ],
        edgeCases: ["cast fallido"],
        tests: "ok 10.00; reject x motivo=cast_monto; ok 3.50",
        feedback:
          "`float` “traga” o falla sin vocabulario de cuarentena. `InvalidOperation` + `reason` estable alimenta el contador del manifest. El `0` mágico es deuda que rompe reconcile y auditoría.",
        retrospective:
          "Cast fallido = fila a cuarentena con motivo, no métrica inventada. Mismo patrón del You Do en `load_clients_csv`. Siguiente subtema: filas irregulares y archivo de cuarentena.",
        starterCode: {
          language: 'python',
          title: "cast_reject.py",
          code: `# DEFECT: float() traga y no rechaza 'x' con motivo cast_monto
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
        title: "Detectar fila irregular por col_count",
        preamble:
          "- **Contexto:** antes de armar el dict con `zip(header, row)`, el gate valida el largo.\n- **Meta:** detectar mismatch de columnas.\n- **Éxito:** imprime `True` para `row = ['C1','Ana','x']` con header de 2.\n- **Límites:** no uses DictReader aquí; solo el booleano de irregularidad.",
        instruction:
          "1. El starter deja `irregular = False` fijo.\n2. Asigna `irregular = len(row) != len(header)`.\n3. Imprime solo el booleano.\n4. No trunques `row` para “hacerla pasar”.",
        hint: "len(row) != len(header)",
        hints: [
          "len(row) != len(header)",
          "print bool",
        ],
        edgeCases: ["col count"],
        tests: "True",
        feedback:
          "Chequeo barato O(1) evita desalinear columnas con `zip` (que silencia el sobrante). `col_count` es el `reason` canónico de esta falla.",
        retrospective:
          "Contar columnas es el portero de clean: sin este check, `zip` silencia el sobrante y desalinea métricas. El error clásico es truncar la fila “para que pase”. Siguiente (E2): persistir cuarentena en CSV con `raw` y `reason`.",
        starterCode: {
          language: 'python',
          title: "irregular.py",
          code: `# DEFECT: no detecta col_count mismatch
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
        title: "Escribir quarantine.csv con raw y reason",
        preamble:
          "- **Contexto:** la cuarentena no es un print: es un artefacto que el auditor y el manifest cuentan.\n- **Meta:** escribir una fila `{raw, reason}` y releer `reason`.\n- **Éxito:** imprime `col_count`.\n- **Límites:** `newline=''`, fieldnames `raw` y `reason`, encoding UTF-8; solo stdlib.",
        instruction:
          "1. El starter no escribe el CSV: solo imprime `exists`.\n2. Abre `quarantine.csv` con `newline=''` y `DictWriter`.\n3. `writeheader` + una fila de ejemplo (`raw` sintético, `reason='col_count'`).\n4. Relee con `DictReader` e imprime `rows[0]['reason']`.",
        hint: "DictWriter fieldnames `raw, reason`",
        hints: [
          "DictWriter fieldnames `raw, reason`",
          "newline=''",
        ],
        edgeCases: ["escribir cuarentena"],
        tests: "col_count",
        feedback:
          "Cuarentena es salida de primera clase del CP-N1-B, no un log tirado. Sin header y `newline=''`, el archivo se vuelve ilegible o se rompe en Windows.",
        retrospective:
          "`{raw, reason}` es el contrato mínimo de rejects. Luego (E3) agregas contadores por motivo — insumos del manifest.",
        starterCode: {
          language: 'python',
          title: "write_quar.py",
          code: `# DEFECT: no escribe quarantine
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
        title: "Resumir motivos de cuarentena ordenados",
        preamble:
          "- **Contexto:** el manifest y el README de calidad reportan **cuántos** rejects por `reason` estable.\n- **Meta:** contar y listar motivos en orden.\n- **Éxito:** tres líneas `cast_monto 1`, `col_count 2`, `schema 1`.\n- **Límites:** vocabulario corto de reasons; no inventes frases largas distintas por script.",
        instruction:
          "1. El starter importa `Counter` pero no imprime (solo `pass`).\n2. Cuenta cada `reason` y recórrelos en orden lexicográfico.\n3. Imprime `motivo conteo` por línea.\n4. No inventes un orden manual con listas fijas.",
        hint: "collections.Counter o dict de conteos",
        hints: [
          "collections.Counter(reasons) o un dict de conteos",
          "sorted(...items()); print(k, v) por línea",
        ],
        edgeCases: ["resumen motivos"],
        tests: "cast_monto 1\\ncol_count 2\\nschema 1",
        feedback:
          "Reasons estables (`col_count`, `cast_monto`, `schema`) permiten sumar entre corridas. Frases largas distintas en cada script rompen el contador del manifest.",
        retrospective:
          "Resumen de motivos = calidad medible del intake. Si una reason crece, el contrato de la fuente está fallando. Siguiente tema: JSON array/JSONL y schema.",
        starterCode: {
          language: 'python',
          title: "reason_summary.py",
          code: `# DEFECT: no imprime counts
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
        title: "Parsear JSON con loads e id C001",
        preamble:
          "- **Contexto:** `transactions.json` del gate llega como texto; el slice manual es frágil.\n- **Meta:** usar `json.loads` y leer `id`.\n- **Éxito:** imprime `C001`.\n- **Límites:** solo stdlib; no indexar caracteres del string crudo.",
        instruction:
          "1. El starter hace `raw[7:11]`: se rompe al cambiar espacios o comillas.\n2. Sustituye por `json.loads(...)`.\n3. Imprime `obj['id']`.\n4. No uses expresiones regulares sobre el JSON.",
        hint: "json.loads",
        hints: [
          "json.loads",
          "dict access",
        ],
        edgeCases: ["loads"],
        tests: "C001",
        feedback:
          "`loads` parsea **string**; `load` parsea **file**. El slice asume posiciones fijas y falla en el primer cambio de formato del export.",
        retrospective:
          "Parsear con la librería es el único camino auditable. Siguiente (E2): serializar tildes legibles para logs Latam.",
        starterCode: {
          language: 'python',
          title: "loads_fix.py",
          code: `# DEFECT: slice manual; no usa loads
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
        title: "Serializar José legible con ensure_ascii",
        preamble:
          "- **Contexto:** logs y clean del gate se leen en español; escapes `\\u00e9` dificultan la revisión humana.\n- **Meta:** `json.dumps` con tildes legibles.\n- **Éxito:** imprime `{\"nombre\": \"José\"}` sin escapes Unicode.\n- **Límites:** solo stdlib; no reescribas el string a mano.",
        instruction:
          "1. El starter usa `ensure_ascii=True` (default mental).\n2. Cambia a `ensure_ascii=False`.\n3. Imprime el string resultante.\n4. Verifica visualmente que aparece `José`, no `\\u00e9`.",
        hint: "ensure_ascii=False",
        hints: [
          "ensure_ascii=False",
          "print string",
        ],
        edgeCases: ["tildes"],
        tests: "José legible sin \\u",
        feedback:
          "`ensure_ascii=False` deja UTF-8 legible en el texto JSON; el archivo en disco sigue yendo con `encoding='utf-8'`. Útil en onboarding Latam y en demos del portfolio.",
        retrospective:
          "Legibilidad del JSON no pelea con corrección: es decisión de serialización. Luego (E3) verás tipos que **no** son JSON nativos (datetime).",
        starterCode: {
          language: 'python',
          title: "dumps_utf8.py",
          code: `# DEFECT: ensure_ascii=True escapea José
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
        title: "Arreglar datetime no serializable en JSON",
        preamble:
          "- **Contexto:** un timestamp de corrida o de tx no entra solo a `json.dumps`.\n- **Meta:** capturar `TypeError` y serializar con `.isoformat()`.\n- **Éxito:** línea `TypeError` y luego `{\"ts\": \"2026-01-15T10:00:00\"}`.\n- **Límites:** no uses `default=str` en la solución final; conversión explícita.",
        instruction:
          "1. El starter oculta el fallo con `default=str`.\n2. Intenta `json.dumps(obj)` en `try` e imprime el nombre de `TypeError`.\n3. Arma un dict con `ts` en isoformat y haz dumps.\n4. Imprime ambos resultados en ese orden.",
        hint: "datetime no serializable",
        hints: [
          "datetime no serializable",
          "convierte a .isoformat()",
        ],
        edgeCases: ["TypeError datetime"],
        tests: "TypeError\\n{\"ts\": \"2026-01-15T10:00:00\"}",
        feedback:
          "`default=str` es un parche opaco: esconde qué tipos no son JSON. Convertir a ISO es contrato legible y estable para el manifest o campos de tiempo documentados.",
        retrospective:
          "Tipos no-JSON se transforman **antes** de dumps, no con magia del encoder. Siguiente subtema: schema required, null explícito y defaults compatibles.",
        starterCode: {
          language: 'python',
          title: "json_datetime.py",
          code: `# DEFECT: default=str oculta TypeError; no usa isoformat explícito
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
        title: "validate_schema con required y missing",
        preamble:
          "- **Contexto:** cada tx/cliente del gate debe traer un mínimo de claves antes de entrar a clean.\n- **Meta:** implementar `validate_schema(obj, required)`.\n- **Éxito:** imprime `(False, ['email'])` para `{'id':'C1'}` con required `id,email`.\n- **Límites:** no valides truthiness del valor aquí; solo presencia de clave.",
        instruction:
          "1. El starter siempre devuelve `(True, [])`.\n2. Calcula `missing = [k for k in required if k not in obj]`.\n3. Devuelve `(len(missing)==0, missing)`.\n4. Imprime el resultado de la llamada del fixture.",
        hint: "list comprehension missing",
        hints: [
          "list comprehension missing",
          "print ok, missing",
        ],
        edgeCases: ["required"],
        tests: "(False, ['email'])",
        feedback:
          "Schema mínimo del contrato de ingesta: sin claves required no hay clean. Separar “falta clave” de “valor inválido” mantiene reasons estables (`schema` vs. `cast_monto`).",
        retrospective:
          "Listar missing es evidencia accionable, no un booleano opaco. El misconception es devolver solo True/False sin decir *qué* faltó. Siguiente (E2): null JSON con clave presente ≠ clave ausente.",
        starterCode: {
          language: 'python',
          title: "schema_required.py",
          code: `# DEFECT: siempre True
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
        title: "Distinguir null explícito de clave ausente",
        preamble:
          "- **Contexto:** en JSON, `\"email\": null` llega a Python como clave con `None`; no es lo mismo que omitir la clave.\n- **Meta:** inspeccionar presencia y valor sin truthiness.\n- **Éxito:** imprime `True` y luego `None`.\n- **Límites:** no uses `bool(obj.get(...))` como proxy de “existe”.",
        instruction:
          "1. El starter confunde ausencia con falsy.\n2. Imprime `'email' in obj`.\n3. Imprime `obj['email']`.\n4. No borres la clave ni la rellenes.",
        hint: "'email' in obj",
        hints: [
          "'email' in obj",
          "None is not missing key",
        ],
        edgeCases: ["null explícito"],
        tests: "True\\nNone",
        feedback:
          "`null` JSON → `None` con clave presente; required del demo T3-B lo trata como presente. Si tu validación usa truthiness, mandas a cuarentena filas que el contrato acepta como “email desconocido”.",
        retrospective:
          "Presencia ≠ valor útil. Decide en el contrato del pipeline qué hacer con None (default, cuarentena o clean con null). Luego (E3): defaults con setdefault sin pisar valores reales.",
        starterCode: {
          language: 'python',
          title: "null_explicit.py",
          code: `# DEFECT: confunde 'email' in obj con truthiness
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
        subtopicId: "S08-T3-B",
        kind: "transfer",
        title: "Default segment sin pisar vip",
        preamble:
          "- **Contexto:** el contrato crece con un campo opcional `segment`; productores viejos no lo envían.\n- **Meta:** aplicar default `'standard'` sin destruir `'vip'`.\n- **Éxito:** `{'id': 'C1', 'segment': 'standard'}` y `{'id': 'C2', 'segment': 'vip'}`.\n- **Límites:** usa `setdefault`; no asignes a ciegas `obj['segment'] = 'standard'`.",
        id: "S08-T3-B-E3",
        instruction:
          "1. El starter pisa `vip` con assignment.\n2. En ambos dicts llama `setdefault('segment', 'standard')`.\n3. Imprime `a` y `b`.\n4. Verifica que C2 sigue en vip.",
        hint: "setdefault",
        hints: [
          "setdefault",
          "No uses assignment ciego que pisa vip",
        ],
        edgeCases: ["evolución compatible"],
        tests: "standard vs. vip",
        feedback:
          "`setdefault` escribe solo si falta la clave; assignment siempre pisa. Defaults compatibles no rompen productores viejos ni clientes VIP sintéticos del laboratorio.",
        retrospective:
          "Evolucionar schema con defaults es mantenimiento de contrato, no “rellenar por si acaso”. Cierre de T3: schema + null + default. Siguiente: hash, backup y provenance del crudo.",
        starterCode: {
          language: 'python',
          title: "default_field.py",
          code: `# DEFECT: assignment pisa vip
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
        title: "sha256 de archivo y longitud 64",
        preamble:
          "- **Contexto:** el manifest del gate fija el fingerprint del input; debe ser estable entre corridas y máquinas.\n- **Meta:** `hashlib.sha256` sobre bytes del archivo.\n- **Éxito:** imprime `ba7816bf 64` (primeros 8 hex y largo del digest).\n- **Límites:** no uses `hash()` builtin (no es portable ni criptográfico).",
        instruction:
          "1. El starter usa `hash(p.read_bytes())`: incorrecto para provenance.\n2. Calcula `hashlib.sha256(...).hexdigest()`.\n3. Imprime `dig[:8]` y `len(dig)`.\n4. El contenido del temp sigue siendo `b'abc'`.",
        hint: "hashlib.sha256(path.read_bytes()).hexdigest()",
        hints: [
          "hashlib.sha256(path.read_bytes()).hexdigest()",
          "temp file con write_bytes",
        ],
        edgeCases: ["hash file"],
        tests: "ba7816bf 64",
        feedback:
          "`hash()` de Python no es estable entre procesos y no es SHA-256. El digest hex de 64 chars es el fingerprint que va al manifest y al portfolio del gate.",
        retrospective:
          "Mismos bytes → mismo sha256. Si el export cambia una coma, el hash cambia y la corrida es otra. Siguiente (E2): backup byte-idéntico del crudo.",
        starterCode: {
          language: 'python',
          title: "hash_file.py",
          code: `# DEFECT: usa hash() builtin; len no es 64
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
        title: "Backup in.csv con copy2 e igualdad",
        preamble:
          "- **Contexto:** antes de cualquier transformación, el gate preserva el crudo.\n- **Meta:** copiar `in.csv` a `in.csv.bak` y verificar igualdad de bytes.\n- **Éxito:** imprime `True`.\n- **Límites:** `shutil.copy2`; comparar con `read_bytes`, no solo `exists`.",
        instruction:
          "1. El starter solo imprime `bak.exists()` (False).\n2. Tras escribir `in.csv`, haz `shutil.copy2(src, bak)`.\n3. Imprime `bak.read_bytes() == src.read_bytes()`.\n4. No reescribas el bak a mano con otro contenido.",
        hint: "shutil.copy2",
        hints: [
          "shutil.copy2",
          "read_bytes compare",
        ],
        edgeCases: ["backup"],
        tests: "True",
        feedback:
          "`exists` no prueba igualdad. `copy2` preserva metadata útil; la comparación de bytes es la evidencia de que el backup es el crudo, no un archivo vacío.",
        retrospective:
          "Backup es seguro de regresión y de auditoría: si el pipeline falla, aún tienes el input. Luego (E3): empaquetar path, sha256 y bytes en un dict de provenance.",
        starterCode: {
          language: 'python',
          title: "backup_copy.py",
          code: `# DEFECT: no copia; solo chequea exists
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
        subtopicId: "S08-T4-A",
        kind: "transfer",
        title: "Dict de provenance path sha256 bytes",
        preamble:
          "- **Contexto:** cada fuente del manifest carga provenance mínima del crudo.\n- **Meta:** armar `{path, sha256, bytes}` para `clients.csv` sintético.\n- **Éxito:** path `clients.csv`, sha256 completo que empieza en `b776a3a3…`, `bytes` 6.\n- **Límites:** hashea `read_bytes` del archivo; `bytes` vía `stat().st_size` (o len de bytes leídos).",
        id: "S08-T4-A-E3",
        instruction:
          "1. El starter solo pone `path`.\n2. Añade `sha256` hex completo y `bytes` del tamaño.\n3. Imprime el dict (no solo keys parciales).\n4. Contenido del fixture: `id\\nC1\\n` (6 bytes).",
        hint: "stat().st_size",
        hints: [
          "stat().st_size",
          "sha256 completo del crudo",
        ],
        edgeCases: ["provenance dict"],
        tests: "path/sha256/bytes; bytes==6",
        feedback:
          "Provenance por fuente amarra el run a bytes exactos. Omitir hash o tamaño deja un manifest ornamental. El path como `name` (no abs) es portable en demos del curso.",
        retrospective:
          "Si el dict de provenance está completo, el manifest solo tiene que sumar conteos y reconcile. Siguiente: construir manifest multi-fuente y fallar cerrado si no cuadra.",
        starterCode: {
          language: 'python',
          title: "provenance_dict.py",
          code: `# DEFECT: omite sha256 y bytes
from pathlib import Path
import hashlib, tempfile
td = Path(tempfile.mkdtemp())
p = td / 'clients.csv'
p.write_text('id\\nC1\\n', encoding='utf-8')
prov = {'path': p.name}
print(prov)`,
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
        title: "Manifest multi-fuente con totales derivados",
        preamble:
          "- **Contexto:** clients.csv + transactions.json deben aparecer juntos en un solo run_id.\n- **Meta:** derivar `reconcile_ok` y totales con `sum` (sin hardcode).\n- **Éxito:** imprime `5 4 1`, ambas fuentes True, manifest True.\n- **Límites:** no pongas `reconcile_ok = True` a ciegas; calcula la igualdad por fuente.",
        instruction:
          "1. Corrige el loop: `reconcile_ok = n_in == n_clean + n_quarantine`.\n2. Arma el dict manifest con `run_id`, `sources` y totales sumados.\n3. `reconcile_ok` global = `all` por fuente.\n4. Imprime totales, lista (name, ok) y el booleano global.",
        hint: "Calcula reconcile_ok por fuente antes de sumar",
        hints: [
          "Calcula reconcile_ok por fuente antes de sumar",
          "sources contiene clients.csv y transactions.json.",
        ],
        edgeCases: ["dos fuentes", "totales derivados"],
        tests: "totales 5/4/1; ambas reconcile_ok True; manifest True",
        feedback:
          "Hardcodear True es mentir al auditor. Los totales se **derivan** de sources para que una edición de conteos no deje el resumen inconsistente.",
        retrospective:
          "El contrato conserva provenance (sha256) y conteos por fuente. Siguiente (E2): una función que rechaza errores **compensados** entre fuentes.",
        starterCode: {
          language: 'python',
          title: "manifest_min.py",
          code: `# DEFECT: always reconcile_ok True; no totales derivados
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
        subtopicId: "S08-T4-B",
        kind: "independent",
        title: "Reconciliar por fuente sin compensación",
        preamble:
          "- **Contexto:** un sobrante en clients y un faltante en transactions pueden “cuadrar” en el total y mentir.\n- **Meta:** `reconcile_sources` exige igualdad **por cada fuente** y en agregados.\n- **Éxito:** imprime `True` (good) y luego `False` (compensated_bad).\n- **Fixtures:** `good = [{'n_in': 5, 'n_clean': 3, 'n_quarantine': 2}]`; `compensated_bad = [{'n_in': 5, 'n_clean': 5, 'n_quarantine': 1}, {'n_in': 5, 'n_clean': 4, 'n_quarantine': 0}]` (agregado 10=10; cada fuente no cuadra).\n- **Límites:** no baste la suma global; el contrato final devuelve un **solo booleano**.",
        id: "S08-T4-B-E2",
        instruction:
          "1. El starter devuelve siempre True (y el contrato final es un **solo booleano**, no una tupla).\n2. Exige igualdad **por cada fuente** y también en los totales derivados.\n3. Prueba `good` y `compensated_bad` con los fixtures del preamble.\n4. Imprime solo los dos booleanos (`True` luego `False`).",
        hint: "all(...) por fuente, y también n_in == n_clean + n_quarantine en totales",
        hints: [
          "all(s['n_in'] == s['n_clean'] + s['n_quarantine'] for s in sources)",
          "Combina per-source con la igualdad de totales; compensated_bad suma 10=10 pero cada fuente falla.",
        ],
        edgeCases: ["errores compensados entre fuentes"],
        tests: "good=True; compensated_bad=False",
        feedback:
          "La igualdad agregada sola es insuficiente: errores compensados entre CSV y JSON ocultan filas perdidas. El gate exige per-source y totales; el caso compensated_bad es el test de entrevista junior.",
        retrospective:
          "Si puedes explicar compensated_bad sin código (sobrante en una fuente + faltante en otra = total mentiroso), ya defendiste CP-N1-B. El misconception es confiar solo en la suma global. Luego (E3): el mini-`run()` fail-closed — mismo if del You Do.",
        starterCode: {
          language: 'python',
          title: "reconcile.py",
          code: `# DEFECT: siempre True; no valida por fuente
def reconcile_sources(sources):
    return True  # DEFECT: no valida por fuente ni totales

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
        subtopicId: "S08-T4-B",
        kind: "transfer",
        title: "run fail-closed con exit_code 0 o 1",
        preamble:
          "- **Contexto:** el núcleo de salida del ETL publica clean solo si **todas** las fuentes reconcilian.\n- **Meta:** implementar `run(sources)` fail-closed.\n- **Éxito:** good → `OK` / `exit_code 0`; compensated_bad → `ERROR sources=clients.csv,transactions.json` / `exit_code 1`.\n- **Límites:** reporta **todas** las fuentes rotas; no digas OK parcial.",
        id: "S08-T4-B-E3",
        instruction:
          "1. El starter siempre imprime OK.\n2. Arma `broken` con nombres donde no cuadra `n_in`.\n3. Si hay broken: ERROR con join por coma, exit 1.\n4. Si no: OK, exit 0. Ejecuta good y bad en ese orden.",
        hint: "Lista nombres de fuentes donde n_in no cuadra; si hay alguna, ERROR + exit 1.",
        hints: [
          "Lista nombres de fuentes donde `n_in != n_clean + n_quarantine`.",
          "broken = [s['name'] for s in sources if s['n_in'] != s['n_clean'] + s['n_quarantine']]; une con coma.",
        ],
        edgeCases: ["fail closed", "compensated multi-source", "bridge You Do"],
        tests: "good OK/0; bad ERROR sources=clients.csv, transactions.json/1",
        feedback:
          "Fail-closed protege consumidores del clean: un exit 0 mentiroso es peor que un fallo ruidoso. En el You Do, este if es el último paso de `run()` antes de `SystemExit`.",
        retrospective:
          "Publicar solo si reconcilia es el cierre del gate. Reutiliza esta lógica sin mirar la solución al armar clean/quarantine/manifest en disco. Autochequeo: ¿qué imprimirías si solo una de dos fuentes falla?",
        starterCode: {
          language: 'python',
          title: "fail_reconcile.py",
          code: `# DEFECT: siempre OK aunque n_in no cuadre por fuente
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
      "Cierras el gate **CP-N1-B**. Los We Do de T1–T4 te dieron las piezas; aquí las **ensamblas** en un ETL **local-python**.\n\n**Receta de ensamblaje (orden sugerido):**\n\n1. `sha256_file` + backup del crudo (T4-A)\n2. `load_clients_csv` con dialecto, Decimal, `newline=''` y cuarentena `{raw, reason}` (T2)\n3. `load_transactions_json` con `validate_schema` + Decimal (T3)\n4. `write_atomic` de clean y quarantine (T1-B)\n5. `build_manifest` con totales derivados y `reconcile_ok` por fuente (T4-B)\n6. `run` retorna 0 solo si todo reconcilia — si no, exit 1 (E3 de T4-B)\n\n**Éxito de corrida observable:** demo con filas sanas → exit 0 y manifest `reconcile_ok`; demo con fila irregular → exit 0 y `n_quarantine ≥ 1`; demo con conteos rotos (o fuente que no cuadra) → exit 1.\n\nRutas: `data/clients.csv` + `data/transactions.json` (sintéticos) → `out/clean/`, `out/quarantine/`, `out/manifest.json`. El CLI instalable llega en S10 (Módulos & CLI). Solo datos sintéticos; sin PII real ni claims de fraude o parentesco.",
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
      "Al abrir CSV en disco: encoding utf-8 (o utf-8-sig si hay BOM) y newline=''",
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
      "Adjunta:\n\n1. Un manifest de demo con `reconcile_ok` por fuente\n2. Al menos 1 fila de cuarentena con `reason` estable\n3. Los hashes de ambos inputs crudos\n4. Un test o corrida de reconciliación fallida (exit 1)\n\nEsa carpeta es la evidencia del gate CP-N1-B ante un revisor o entrevista junior de data engineering.",
    rubric: [
      { criterion: "Ingesta CSV+JSON correcta", weight: "20%" },
      { criterion: "Validación + cuarentena", weight: "20%" },
      { criterion: "Manifest y reconciliación", weight: "20%" },
      { criterion: "Hashes/backups/provenance", weight: "15%" },
      { criterion: "Pruebas normal/borde/error", weight: "15%" },
      { criterion: "README y reproducibilidad local", weight: "10%" },
    ],
    retrospective:
      "Antes de marcar listo: (1) ¿qué invariante demuestras con el caso exit 1 (reconcile roto) y con al menos una fila en quarantine? (2) ¿qué cambiarías con datos reales vs. sintéticos (PII, encodings, volumen)? (3) En el README, una frase de impacto medible (antes: “CSV a mano / sin traza”; después: “clean+quarantine+manifest con hash”) que puedas defender en 30 segundos ante un revisor junior de data.",
  },
  selfCheck: {
    questions: [
      {
        question: "¿Por qué declarar encoding='utf-8' al abrir texto?",
        options: ["Permite leer cualquier archivo sin que falle la decodificación", "Convierte automáticamente los acentos a su forma sin tilde", "Detecta el encoding real del archivo antes de leerlo", "Evita depender del locale del SO (p. ej. Windows)"],
        correctIndex: 3,
        explanation:
          "El default de texto no es portátil; UTF-8 explícito evita mojibake y `UnicodeDecodeError` inesperados.",
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
        question: "Para montos en CSV/JSON del gate, ¿qué contrato usas?",
        options: ["Decimal desde texto, quantize 0.01, serializar como string", "float con round(x, 2) al escribir, que ya deja dos decimales", "int de céntimos, porque los enteros no pierden precisión", "Decimal en memoria y float al serializar, que es más compacto"],
        correctIndex: 0,
        explanation:
          "Continúa el contrato de S02: Decimal, nunca float; fallos de cast → cuarentena.",
      },
      {
        question: "`null` JSON con clave presente vs. clave ausente…",
        options: ["Ambos llegan como None, así que el contrato no los distingue", "La clave ausente se completa con None al validar el schema", "json.load convierte la clave ausente en una cadena vacía", "null → None con clave presente; clave ausente no aparece en el dict"],
        correctIndex: 3,
        explanation:
          "'email' in obj es True si email: null; False si la clave no existe.",
      },
      {
        question: "¿Por qué no alcanza validar solo n_in == n_clean + n_quarantine en el total agregado?",
        options: ["Porque el total no detecta filas duplicadas dentro de una fuente", "Porque un sobrante en una fuente puede compensar un faltante en otra", "Porque las fuentes pueden tener distinto número de columnas", "Porque la cuarentena puede contener filas de más de una fuente"],
        correctIndex: 1,
        explanation:
          "Reconciliación por fuente evita errores compensados entre CSV y JSON.",
      },
      {
        question: "Al abrir un CSV en disco con el módulo csv, ¿por qué usas newline=''?",
        options: ["Para que las líneas en blanco del final no cuenten como filas", "Para que los saltos de línea dentro de un campo entrecomillado no rompan la fila", "Para que el módulo csv controle los terminadores y evite CR dobles en Windows", "Para que el archivo se escriba con el salto de línea del sistema"],
        correctIndex: 2,
        explanation:
          "newline='' deja el control de líneas al módulo csv; sin eso, Windows puede romper el dialecto al releer el clean.",
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
