import type { CourseSection } from '../../types'

export const section20: CourseSection = {
  id: "rag",
  index: 20,
  title: "Automatización robusta de Excel",
  shortTitle: "Excel factory",
  tagline: "adaptador que lee los formatos sintéticos del VP, produce un workbook de resultados sin dañar la plantilla y deja manifest de cambios",
  estimatedHours: 12,
  level: "Competente",
  phase: 1,
  icon: "MessageSquare",
  accentColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
  jobRelevance:
    "En finanzas, operaciones y reporting en Perú, **Excel sigue siendo el contrato de entrega**. Esta sección (id `rag` conservado) retematiza a V3 **Automatización robusta de Excel** para **CP-N2-B (excel factory)** con openpyxl, plantillas, conciliación y manifests — sin PII real.",
  learningOutcomes: [
    { text: "Manipular sheets, celdas, tablas y named ranges" },
    { text: "Distinguir fórmulas de valores cacheados" },
    { text: "Aplicar estilos, charts y plantillas" },
    { text: "Manejar fechas, locales, merged cells y protección" },
    { text: "Conciliar totales y trabajar con pivots lógicos" },
    { text: "Preservar estructura y validaciones" },
    { text: "Operar batch con corruptos y locks" },
    { text: "Garantizar backups, idempotencia y tests estructurales" },
  ],
  theory: [
    {
      heading: "De “RAG en producción” a Excel factory (mapa)",
      paragraphs: [
        "En V3, **S20 no es el path principal de embeddings/vector stores**. Aquí construyes el **excel factory de CP-N2-B**: leer/escribir celdas, no pisar plantillas, conciliar totales y dejar **manifest** de cambios.",
        "Usamos **openpyxl** en memoria/temp. Datos sintéticos de regiones y montos.",
        "Orden: **T1 Modelo de libro** → **T2 Presentación** → **T3 Conciliación** → **T4 Operación robusta**.",
      ],
      callout: {
        type: "info",
        title: "Contenido reubicado conceptualmente",
        content:
          "Material legado de RAG de este archivo **no es el camino V3 en S20**. Target: automatización Excel para CP-N2-B.",
      },
    },
    {
      heading: "sheets, celdas, tablas y named ranges",
      subtopicId: "S20-T1-A",
      paragraphs: [
        "Un workbook tiene **sheets**; las celdas se direccionan por coordenada (`A1`) o índice. Las **tablas** (display name) y **defined names** dan estabilidad frente a inserts de filas.",
        "Lee por nombre de hoja, no por posición frágil si el VP reordena.",
        "Documenta el mapa: hoja → rango → significado.",
      ],
      code: {
        language: 'python',
        title: "sheets_cells.py",
        code: `from openpyxl import Workbook

wb = Workbook()
ws = wb.active
ws.title = "Entrada"
ws["A1"] = "region"
ws["B1"] = "monto"
ws["A2"] = "Lima"
ws["B2"] = 28.0
wb.create_sheet("Salida")
print(wb.sheetnames)
print(ws["A2"].value, ws["B2"].value)`,
        output: `['Entrada', 'Salida']
Lima 28.0`,
      },
      callout: {
        type: "tip",
        title: "Nombres estables",
        content:
          "Prefiere títulos de hoja y headers explícitos a “la segunda columna del primer sheet”.",
      },
    },
    {
      heading: "fórmulas vs valores cacheados",
      subtopicId: "S20-T1-B",
      paragraphs: [
        "openpyxl por defecto no evalúa fórmulas de Excel: lees el **string de fórmula** o un **valor cacheado** si existe en el archivo.",
        "Para pipelines Python, suele ser más seguro **calcular en Python** y escribir valores, o documentar dependencia de Excel para recalcular.",
        "Nunca asumas que `cell.value` numérico implica ausencia de fórmula en origen.",
      ],
      code: {
        language: 'python',
        title: "formulas.py",
        code: `from openpyxl import Workbook

wb = Workbook()
ws = wb.active
ws["A1"] = 10
ws["A2"] = 5
ws["A3"] = "=A1+A2"
print("formula", ws["A3"].value)
# cálculo python equivalente
print("python_sum", ws["A1"].value + ws["A2"].value)`,
        output: `formula =A1+A2
python_sum 15`,
      },
      callout: {
        type: "warning",
        title: "Sin motor Excel",
        content:
          "En CI Linux, no hay Excel: no dependas de valores cacheados no controlados.",
      },
    },
    {
      heading: "estilos, charts y plantillas",
      subtopicId: "S20-T2-A",
      paragraphs: [
        "Las **plantillas** (.xlsx) del VP traen estilos corporativos: no reconstruyas el libro desde cero si puedes rellenar celdas marcadas.",
        "Estilos (Font, PatternFill, Alignment) y charts openpyxl se aplican con cuidado para no romper named styles.",
        "Separa hoja de datos de hoja de presentación.",
      ],
      code: {
        language: 'python',
        title: "styles.py",
        code: `from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill

wb = Workbook()
ws = wb.active
ws["A1"] = "KPI"
ws["A1"].font = Font(bold=True, color="FFFFFF")
ws["A1"].fill = PatternFill("solid", fgColor="1F4E79")
ws["B1"] = 28.0
print(ws["A1"].font.bold, ws["B1"].value)`,
        output: `True 28.0`,
      },
      callout: {
        type: "tip",
        title: "Plantilla intocable",
        content:
          "Copia la plantilla a un output path; nunca escribas sobre el master sin backup.",
      },
    },
    {
      heading: "fechas, locales, celdas combinadas y protección",
      subtopicId: "S20-T2-B",
      paragraphs: [
        "Las **fechas** en Excel son seriales; openpyxl puede devolver `datetime`. Locales de display (dd/mm vs mm/dd) son del cliente Excel, no del valor.",
        "**Merged cells**: escribe en la celda ancla (top-left). Leer celdas no ancla puede devolver None.",
        "Protección de hoja/celda es señal al usuario, no seguridad criptográfica.",
      ],
      code: {
        language: 'python',
        title: "dates_merge.py",
        code: `from openpyxl import Workbook
from datetime import date

wb = Workbook()
ws = wb.active
ws["A1"] = date(2024, 6, 30)
ws.merge_cells("B1:C1")
ws["B1"] = "Lima-Arequipa"
print(ws["A1"].value.isoformat())
print("merge", ws.merged_cells.ranges)
print("C1_is_none", ws["C1"].value)`,
        output: `2024-06-30
merge {<MergedCellRange B1:C1>}
C1_is_none None`,
      },
      callout: {
        type: "warning",
        title: "Merged traps",
        content:
          "Automatizar sin mapear merges rompe layouts del VP.",
      },
    },
    {
      heading: "conciliación y pivots",
      subtopicId: "S20-T3-A",
      paragraphs: [
        "Antes de entregar, **concilia**: suma de detalle = total de portada; conteos por región = n del EDA.",
        "Los pivots de Excel no siempre se refrescan con openpyxl: calcula la tabla pivote en pandas y escríbela como valores.",
        "Tolerancia monetaria (p. ej. 0.01 PEN) debe documentarse.",
      ],
      code: {
        language: 'python',
        title: "reconcile.py",
        code: `import pandas as pd

det = pd.DataFrame({"region": ["Lima", "Lima", "Cusco"], "monto": [10.0, 5.0, 7.0]})
tot_portada = 22.0
tot_det = float(det["monto"].sum())
pivot = det.groupby("region", as_index=False)["monto"].sum()
print(pivot.to_dict(orient="list"))
print("ok", abs(tot_det - tot_portada) < 0.01)`,
        output: `{'region': ['Cusco', 'Lima'], 'monto': [7.0, 15.0]}
ok True`,
      },
      callout: {
        type: "success",
        title: "Gate de conciliación",
        content:
          "Si falla la conciliación, no se emite el workbook final.",
      },
    },
    {
      heading: "reglas de validación y preservación de estructura",
      subtopicId: "S20-T3-B",
      paragraphs: [
        "Data validation (listas, rangos) en plantillas debe **preservarse**. Al escribir, no borres rangos enteros si puedes actualizar celdas puntuales.",
        "Valida headers esperados antes de cargar filas.",
        "Estructura: mismas columnas, orden y tipos contractuales del VP.",
      ],
      code: {
        language: 'python',
        title: "structure.py",
        code: `expected = ["region", "monto", "n"]
headers = ["region", "monto", "n"]
print("structure_ok", headers == expected)
# validación de dominio
regiones = {"Lima", "Arequipa", "Cusco"}
row = {"region": "Lima", "monto": 10.0}
print("domain_ok", row["region"] in regiones)`,
        output: `structure_ok True
domain_ok True`,
      },
      callout: {
        type: "tip",
        title: "Fail fast en headers",
        content:
          "Si el header no coincide, aborta con mensaje claro al manifest.",
      },
    },
    {
      heading: "batch, archivos corruptos y locks",
      subtopicId: "S20-T4-A",
      paragraphs: [
        "Procesa carpetas en batch con try/except por archivo. Corruptos → cuarentena + log; no detengas todo el lote sin política.",
        "Locks (`~$' file`, PermissionError) se reintentan o se reportan.",
        "Manifest lista: ok / corrupt / locked / skipped.",
      ],
      code: {
        language: 'python',
        title: "batch.py",
        code: `files = ["a.xlsx", "b.xlsx", "c.xlsx"]
status = {}
for f in files:
    if f.startswith("b"):
        status[f] = "corrupt"
    else:
        status[f] = "ok"
print(status)
print("ok_count", sum(v == "ok" for v in status.values()))`,
        output: `{'a.xlsx': 'ok', 'b.xlsx': 'corrupt', 'c.xlsx': 'ok'}
ok_count 2`,
      },
      callout: {
        type: "info",
        title: "Cuarentena",
        content:
          "Mueve corruptos a /quarantine y deja hash/nombre en el log.",
      },
    },
    {
      heading: "backups, idempotencia y pruebas estructurales",
      subtopicId: "S20-T4-B",
      paragraphs: [
        "**Backup** del output anterior antes de sobrescribir. **Idempotencia**: re-ejecutar con mismos inputs produce mismo resultado lógico (o versiona outputs).",
        "Tests estructurales: sheetnames, headers, n filas, total conciliado, no fórmulas rotas esperadas.",
        "El manifest JSON es el artefacto de auditoría del excel factory.",
      ],
      code: {
        language: 'python',
        title: "manifest.py",
        code: `import json
import hashlib

payload = b"region,monto\\nLima,10\\n"
manifest = {
    "input_sha1_8": hashlib.sha1(payload).hexdigest()[:8],
    "sheets": ["Entrada", "Salida"],
    "reconcile_ok": True,
    "backup": "out/prev_results.xlsx.bak",
    "idempotent": True,
}
print(json.dumps(manifest, ensure_ascii=False))`,
        output: `{"input_sha1_8": "651f3b6b", "sheets": ["Entrada", "Salida"], "reconcile_ok": true, "backup": "out/prev_results.xlsx.bak", "idempotent": true}`,
      },
      callout: {
        type: "success",
        title: "Manifest obligatorio",
        content:
          "Sin manifest, el incremento excel factory de CP-N2-B no cierra.",
      },
    },
  ],
  iDo: {
    intro: "Te demuestro el excel factory: sheets, fórmulas vs Python, estilos, merges, conciliación, batch y manifest.",
    steps: [
      {
        demoId: "S20-T1-A-DEMO",
        subtopicId: "S20-T1-A",
        environment: "local-python",
        description: "Leer/escribir sheets y celdas con openpyxl en workbook sintético",
        code: {
          language: 'python',
          title: "demo_sheets.py",
          code: `from openpyxl import Workbook

wb = Workbook()
ws = wb.active
ws.title = "Datos"
ws.append(["region", "monto"])
ws.append(["Lima", 28.0])
ws.append(["Cusco", 22.5])
out = wb.create_sheet("Resultados")
out["A1"] = "n_filas"
out["B1"] = ws.max_row - 1
print(wb.sheetnames)
print("n", out["B1"].value)
print("A2", ws["A2"].value)`,
          output: `['Datos', 'Resultados']
n 2
A2 Lima`,
        },
        why: "Mapa de hojas estable es el primer contrato del adaptador.",
      },
      {
        demoId: "S20-T1-B-DEMO",
        subtopicId: "S20-T1-B",
        environment: "local-python",
        description: "Distinguir fórmula almacenada vs suma calculada en Python",
        code: {
          language: 'python',
          title: "demo_formula.py",
          code: `from openpyxl import Workbook

wb = Workbook()
ws = wb.active
ws["B1"] = 10
ws["B2"] = 15
ws["B3"] = "=B1+B2"
formula = ws["B3"].value
py_val = ws["B1"].value + ws["B2"].value
print("es_formula", isinstance(formula, str) and formula.startswith("="))
print("python_value", py_val)
print("no_evaluado_por_openpyxl", formula != py_val)`,
          output: `es_formula True
python_value 25
no_evaluado_por_openpyxl True`,
        },
        why: "El factory prefiere valores Python auditables en hojas de salida.",
      },
      {
        demoId: "S20-T2-A-DEMO",
        subtopicId: "S20-T2-A",
        environment: "local-python",
        description: "Aplicar estilo de encabezado tipo plantilla corporativa",
        code: {
          language: 'python',
          title: "demo_styles.py",
          code: `from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment

wb = Workbook()
ws = wb.active
ws["A1"] = "Region"
ws["B1"] = "Monto PEN"
for col in ("A", "B"):
    c = ws[f"{col}1"]
    c.font = Font(bold=True, color="FFFFFF")
    c.fill = PatternFill("solid", fgColor="1F4E79")
    c.alignment = Alignment(horizontal="center")
ws["A2"] = "Lima"
ws["B2"] = 28.0
print(ws["A1"].font.bold, ws["A1"].fill.fgColor.rgb)
print(ws["B2"].value)`,
          output: `True 001F4E79
28.0`,
        },
        why: "Estilos consistentes sin rehacer la plantilla completa.",
      },
      {
        demoId: "S20-T2-B-DEMO",
        subtopicId: "S20-T2-B",
        environment: "local-python",
        description: "Escribir fecha ISO y respetar celda combinada (ancla)",
        code: {
          language: 'python',
          title: "demo_dates_merge.py",
          code: `from openpyxl import Workbook
from datetime import date

wb = Workbook()
ws = wb.active
ws["A1"] = date(2024, 6, 30)
ws.merge_cells("B1:D1")
ws["B1"] = "Cobertura: Lima|Arequipa|Cusco"
print(ws["A1"].value.isoformat())
print("anchor", ws["B1"].value)
print("non_anchor_D1", ws["D1"].value)`,
          output: `2024-06-30
anchor Cobertura: Lima|Arequipa|Cusco
non_anchor_D1 None`,
        },
        why: "Fechas y merges sin romper el layout del VP.",
      },
      {
        demoId: "S20-T3-A-DEMO",
        subtopicId: "S20-T3-A",
        environment: "local-python",
        description: "Conciliar total de portada con detalle y pivot por región",
        code: {
          language: 'python',
          title: "demo_reconcile.py",
          code: `import pandas as pd

det = pd.DataFrame({
    "region": ["Lima", "Lima", "Arequipa", "Cusco"],
    "monto": [10.0, 12.0, 8.0, 5.5],
})
portada = 35.5
pivot = det.groupby("region")["monto"].sum().to_dict()
print(pivot)
print("reconcile", abs(det["monto"].sum() - portada) < 0.01)`,
          output: `{'Arequipa': 8.0, 'Cusco': 5.5, 'Lima': 22.0}
reconcile True`,
        },
        why: "Conciliación es el control de calidad del workbook de resultados.",
      },
      {
        demoId: "S20-T3-B-DEMO",
        subtopicId: "S20-T3-B",
        environment: "local-python",
        description: "Validar headers y dominio de región antes de escribir salida",
        code: {
          language: 'python',
          title: "demo_validate.py",
          code: `expected = ["region", "monto", "n"]
got = ["region", "monto", "n"]
allowed = {"Lima", "Arequipa", "Cusco"}
rows = [{"region": "Lima", "monto": 1.0, "n": 1}, {"region": "Piura", "monto": 1.0, "n": 1}]
print("headers_ok", got == expected)
bad = [r for r in rows if r["region"] not in allowed]
print("bad_regions", [r["region"] for r in bad])
print("abort", len(bad) > 0)`,
          output: `headers_ok True
bad_regions ['Piura']
abort True`,
        },
        why: "Fail fast preserva la estructura contractual del VP.",
      },
      {
        demoId: "S20-T4-A-DEMO",
        subtopicId: "S20-T4-A",
        environment: "local-python",
        description: "Simular batch con detección de corruptos y locks",
        code: {
          language: 'python',
          title: "demo_batch.py",
          code: `batch = [
    ("ok1.xlsx", "ok"),
    ("bad.xlsx", "corrupt"),
    ("lock.xlsx", "locked"),
    ("ok2.xlsx", "ok"),
]
manifest = {}
for name, st in batch:
    manifest[name] = st
print(manifest)
print({k: sum(1 for v in manifest.values() if v == k) for k in ("ok", "corrupt", "locked")})`,
          output: `{'ok1.xlsx': 'ok', 'bad.xlsx': 'corrupt', 'lock.xlsx': 'locked', 'ok2.xlsx': 'ok'}
{'ok': 2, 'corrupt': 1, 'locked': 1}`,
        },
        why: "El lote continúa; los fallos quedan auditados.",
      },
      {
        demoId: "S20-T4-B-DEMO",
        subtopicId: "S20-T4-B",
        environment: "local-python",
        description: "Escritura idempotente con backup lógico y tests estructurales",
        code: {
          language: 'python',
          title: "demo_idempotent.py",
          code: `import hashlib, json

def build_output(rows):
    # determinista
    lines = ["region,monto"] + [f"{r},{m}" for r, m in sorted(rows)]
    return "\\n".join(lines) + "\\n"

rows = [("Lima", 10), ("Cusco", 5)]
o1 = build_output(rows)
o2 = build_output(list(reversed(rows)))
manifest = {
    "sha1_8": hashlib.sha1(o1.encode()).hexdigest()[:8],
    "idempotent": o1 == o2,
    "backup": "results.prev.xlsx",
    "tests": {"has_header": o1.startswith("region,monto"), "n_data": 2},
}
print(json.dumps(manifest, ensure_ascii=False))`,
          output: `{"sha1_8": "3e819052", "idempotent": true, "backup": "results.prev.xlsx", "tests": {"has_header": true, "n_data": 2}}`,
        },
        why: "Idempotencia + backup + tests cierran el excel factory.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios con openpyxl y pandas para un adaptador robusto de plantillas sintéticas.",
    steps: [
      {
        id: "S20-T1-A-E1",
        subtopicId: "S20-T1-A",
        kind: "guided",
        instruction:
          "Crea Workbook, pon título de hoja 'Entrada' y A1='region'; imprime sheetnames y A1.",
        hint: "ws.title y ws['A1'].",
        hints: [
          "ws.title y ws['A1'].",
          "from openpyxl import Workbook.",
        ],
        edgeCases: ["nombre con espacios"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `from openpyxl import Workbook
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from openpyxl import Workbook
wb = Workbook()
ws = wb.active
ws.title = "Entrada"
ws["A1"] = "region"
print(wb.sheetnames)
print(ws["A1"].value)`,
          output: `['Entrada']
region`,
        },
      },
      {
        id: "S20-T1-A-E2",
        subtopicId: "S20-T1-A",
        kind: "independent",
        instruction:
          "append header y una fila Lima/10.0; imprime max_row.",
        hint: "ws.append.",
        hints: [
          "ws.append.",
          "max_row incluye header.",
        ],
        edgeCases: ["filas vacías"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `from openpyxl import Workbook
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from openpyxl import Workbook
wb = Workbook()
ws = wb.active
ws.append(["region", "monto"])
ws.append(["Lima", 10.0])
print(ws.max_row)`,
          output: `2`,
        },
      },
      {
        id: "S20-T1-A-E3",
        subtopicId: "S20-T1-A",
        kind: "transfer",
        instruction:
          "Crea hojas Datos y Salida; imprime sheetnames ordenados por creación.",
        hint: "create_sheet.",
        hints: [
          "create_sheet.",
          "Renombra active primero.",
        ],
        edgeCases: ["duplicar nombre"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `from openpyxl import Workbook
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from openpyxl import Workbook
wb = Workbook()
wb.active.title = "Datos"
wb.create_sheet("Salida")
print(wb.sheetnames)`,
          output: `['Datos', 'Salida']`,
        },
      },
      {
        id: "S20-T1-B-E1",
        subtopicId: "S20-T1-B",
        kind: "guided",
        instruction:
          "Asigna fórmula =A1+A2 y print si startswith('=').",
        hint: "cell value string.",
        hints: [
          "cell value string.",
          "True esperado.",
        ],
        edgeCases: ["valor cacheado"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `from openpyxl import Workbook
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from openpyxl import Workbook
wb = Workbook()
ws = wb.active
ws["A3"] = "=A1+A2"
print(str(ws["A3"].value).startswith("="))`,
          output: `True`,
        },
      },
      {
        id: "S20-T1-B-E2",
        subtopicId: "S20-T1-B",
        kind: "independent",
        instruction:
          "Con A1=3 A2=4 calcula suma python e imprime 7 sin evaluar fórmula Excel.",
        hint: "Suma .value numéricos.",
        hints: [
          "Suma .value numéricos.",
          "No uses data_only aquí.",
        ],
        edgeCases: ["None en celdas"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `from openpyxl import Workbook
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from openpyxl import Workbook
wb = Workbook()
ws = wb.active
ws["A1"] = 3
ws["A2"] = 4
print(ws["A1"].value + ws["A2"].value)`,
          output: `7`,
        },
      },
      {
        id: "S20-T1-B-E3",
        subtopicId: "S20-T1-B",
        kind: "transfer",
        instruction:
          "Función es_formula(v) True si str y empieza con =; prueba con '=A1' y 3.",
        hint: "isinstance str.",
        hints: [
          "isinstance str.",
          "Dos prints.",
        ],
        edgeCases: ["espacios antes de ="],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `def es_formula(v):
    return isinstance(v, str) and v.startswith("=")
print(es_formula("=A1"))
print(es_formula(3))`,
          output: `True
False`,
        },
      },
      {
        id: "S20-T2-A-E1",
        subtopicId: "S20-T2-A",
        kind: "guided",
        instruction:
          "Pon A1 bold=True e imprime font.bold.",
        hint: "Font(bold=True).",
        hints: [
          "Font(bold=True).",
          "openpyxl.styles.",
        ],
        edgeCases: ["estilo None"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `from openpyxl import Workbook
from openpyxl.styles import Font
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from openpyxl import Workbook
from openpyxl.styles import Font
wb = Workbook()
ws = wb.active
ws["A1"] = "KPI"
ws["A1"].font = Font(bold=True)
print(ws["A1"].font.bold)`,
          output: `True`,
        },
      },
      {
        id: "S20-T2-A-E2",
        subtopicId: "S20-T2-A",
        kind: "independent",
        instruction:
          "Aplica PatternFill solid fgColor 1F4E79 a A1 e imprime que fill no es None.",
        hint: "PatternFill.",
        hints: [
          "PatternFill.",
          "print True.",
        ],
        edgeCases: ["color theme vs rgb"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `from openpyxl import Workbook
from openpyxl.styles import PatternFill
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from openpyxl import Workbook
from openpyxl.styles import PatternFill
wb = Workbook()
ws = wb.active
ws["A1"].fill = PatternFill("solid", fgColor="1F4E79")
print(ws["A1"].fill.fgColor is not None)`,
          output: `True`,
        },
      },
      {
        id: "S20-T2-A-E3",
        subtopicId: "S20-T2-A",
        kind: "transfer",
        instruction:
          "Escribe header_style(ws, cell) bold+fill; aplícalo a A1 y print bold.",
        hint: "Función mutadora.",
        hints: [
          "Función mutadora.",
          "Color corporativo.",
        ],
        edgeCases: ["celda inexistente"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill

def header_style(ws, coord):
    c = ws[coord]
    c.font = Font(bold=True, color="FFFFFF")
    c.fill = PatternFill("solid", fgColor="1F4E79")

wb = Workbook()
ws = wb.active
ws["A1"] = "H"
header_style(ws, "A1")
print(ws["A1"].font.bold)`,
          output: `True`,
        },
      },
      {
        id: "S20-T2-B-E1",
        subtopicId: "S20-T2-B",
        kind: "guided",
        instruction:
          "Escribe date(2024,1,15) en A1 e imprime isoformat.",
        hint: "datetime.date.",
        hints: [
          "datetime.date.",
          "value.isoformat().",
        ],
        edgeCases: ["datetime vs date"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `from openpyxl import Workbook
from datetime import date
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from openpyxl import Workbook
from datetime import date
wb = Workbook()
ws = wb.active
ws["A1"] = date(2024, 1, 15)
print(ws["A1"].value.isoformat())`,
          output: `2024-01-15`,
        },
      },
      {
        id: "S20-T2-B-E2",
        subtopicId: "S20-T2-B",
        kind: "independent",
        instruction:
          "merge B1:C1, valor en B1 'x'; imprime C1 value (None esperado).",
        hint: "merge_cells.",
        hints: [
          "merge_cells.",
          "Leer no ancla.",
        ],
        edgeCases: ["escribir en no ancla"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `from openpyxl import Workbook
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from openpyxl import Workbook
wb = Workbook()
ws = wb.active
ws.merge_cells("B1:C1")
ws["B1"] = "x"
print(ws["C1"].value)`,
          output: `None`,
        },
      },
      {
        id: "S20-T2-B-E3",
        subtopicId: "S20-T2-B",
        kind: "transfer",
        instruction:
          "Cuenta cuántos merge ranges hay tras merge A1:B1 y C1:D1; print int.",
        hint: "len(ws.merged_cells.ranges).",
        hints: [
          "len(ws.merged_cells.ranges).",
          "Dos merges.",
        ],
        edgeCases: ["unmerge"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `from openpyxl import Workbook
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from openpyxl import Workbook
wb = Workbook()
ws = wb.active
ws.merge_cells("A1:B1")
ws.merge_cells("C1:D1")
print(len(ws.merged_cells.ranges))`,
          output: `2`,
        },
      },
      {
        id: "S20-T3-A-E1",
        subtopicId: "S20-T3-A",
        kind: "guided",
        instruction:
          "detalle sum 10+5, portada 15; print reconcile True con tol 0.01.",
        hint: "abs(diff)<0.01.",
        hints: [
          "abs(diff)<0.01.",
          "print bool.",
        ],
        edgeCases: ["floats 0.1+0.2"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `det = 10 + 5
portada = 15
print(abs(det - portada) < 0.01)`,
          output: `True`,
        },
      },
      {
        id: "S20-T3-A-E2",
        subtopicId: "S20-T3-A",
        kind: "independent",
        instruction:
          "Pivot suma por región con pandas; print dict de Lima/Cusco para montos 10,5 y 7.",
        hint: "groupby sum.",
        hints: [
          "groupby sum.",
          "to_dict.",
        ],
        edgeCases: ["NaN monto"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
df = pd.DataFrame({"region": ["Lima", "Lima", "Cusco"], "monto": [10.0, 5.0, 7.0]})
print(df.groupby("region")["monto"].sum().to_dict())`,
          output: `{'Cusco': 7.0, 'Lima': 15.0}`,
        },
      },
      {
        id: "S20-T3-A-E3",
        subtopicId: "S20-T3-A",
        kind: "transfer",
        instruction:
          "reconcile(det_sum, portada, tol=0.01) devuelve bool; prueba 22.0 vs 22.005 y 22.0 vs 23.",
        hint: "abs <= tol o <.",
        hints: [
          "abs <= tol o <.",
          "Dos prints.",
        ],
        edgeCases: ["tol 0"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `def reconcile(det_sum, portada, tol=0.01):
    return abs(det_sum - portada) < tol
print(reconcile(22.0, 22.005))
print(reconcile(22.0, 23.0))`,
          output: `True
False`,
        },
      },
      {
        id: "S20-T3-B-E1",
        subtopicId: "S20-T3-B",
        kind: "guided",
        instruction:
          "headers got vs expected region/monto; print equality.",
        hint: "list compare.",
        hints: [
          "list compare.",
          "True.",
        ],
        edgeCases: ["orden distinto"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `expected=['region','monto']; got=['region','monto']
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `expected = ["region", "monto"]
got = ["region", "monto"]
print(expected == got)`,
          output: `True`,
        },
      },
      {
        id: "S20-T3-B-E2",
        subtopicId: "S20-T3-B",
        kind: "independent",
        instruction:
          "Filtra regiones no permitidas de ['Lima','Piura'] con allowed Lima/Cusco; print bad list.",
        hint: "list comp.",
        hints: [
          "list comp.",
          "print.",
        ],
        edgeCases: ["case sensitivity"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `allowed = {"Lima", "Cusco"}
regs = ["Lima", "Piura"]
print([r for r in regs if r not in allowed])`,
          output: `['Piura']`,
        },
      },
      {
        id: "S20-T3-B-E3",
        subtopicId: "S20-T3-B",
        kind: "transfer",
        instruction:
          "validate_rows(rows, allowed) retorna lista de regiones inválidas; prueba una inválida.",
        hint: "Comprensión.",
        hints: [
          "Comprensión.",
          "print resultado.",
        ],
        edgeCases: ["rows vacías"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `def validate_rows(rows, allowed):
    return [r["region"] for r in rows if r["region"] not in allowed]
print(validate_rows([{"region": "Lima"}, {"region": "Ica"}], {"Lima", "Cusco"}))`,
          output: `['Ica']`,
        },
      },
      {
        id: "S20-T4-A-E1",
        subtopicId: "S20-T4-A",
        kind: "guided",
        instruction:
          "De statuses ok/corrupt/ok cuenta ok; print 2.",
        hint: "sum genexp.",
        hints: [
          "sum genexp.",
          "print.",
        ],
        edgeCases: ["typos status"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `st=['ok','corrupt','ok']
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `st = ["ok", "corrupt", "ok"]
print(sum(x == "ok" for x in st))`,
          output: `2`,
        },
      },
      {
        id: "S20-T4-A-E2",
        subtopicId: "S20-T4-A",
        kind: "independent",
        instruction:
          "Clasifica nombre 'file.xlsx.lock' como locked si endswith .lock o contiene 'lock'; print status.",
        hint: "Regla simple didáctica.",
        hints: [
          "Regla simple didáctica.",
          "print locked.",
        ],
        edgeCases: ["falsos positivos"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `name='report.lock'
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `name = "report.lock"
print("locked" if name.endswith(".lock") or "lock" in name else "ok")`,
          output: `locked`,
        },
      },
      {
        id: "S20-T4-A-E3",
        subtopicId: "S20-T4-A",
        kind: "transfer",
        instruction:
          "batch_status(files_dict) devuelve conteos por estado; input {'a':'ok','b':'corrupt'}.",
        hint: "Counter o dict.",
        hints: [
          "Counter o dict.",
          "print dict.",
        ],
        edgeCases: ["estado desconocido"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `from collections import Counter
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from collections import Counter
files = {"a": "ok", "b": "corrupt"}
print(dict(Counter(files.values())))`,
          output: `{'ok': 1, 'corrupt': 1}`,
        },
      },
      {
        id: "S20-T4-B-E1",
        subtopicId: "S20-T4-B",
        kind: "guided",
        instruction:
          "Imprime manifest con backup path y idempotent True.",
        hint: "dict.",
        hints: [
          "dict.",
          "json opcional.",
        ],
        edgeCases: ["path absoluto con secretos"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print({"backup": "out/prev.bak", "idempotent": True})`,
          output: `{'backup': 'out/prev.bak', 'idempotent': True}`,
        },
      },
      {
        id: "S20-T4-B-E2",
        subtopicId: "S20-T4-B",
        kind: "independent",
        instruction:
          "Muestra que build ordenado es idempotente: same hash para rows en distinto orden.",
        hint: "sorted + sha1.",
        hints: [
          "sorted + sha1.",
          "print True.",
        ],
        edgeCases: ["floats formatting"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import hashlib
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import hashlib

def dig(rows):
    s = "\\n".join(f"{a},{b}" for a, b in sorted(rows))
    return hashlib.sha1(s.encode()).hexdigest()
print(dig([("Lima", 1), ("Cusco", 2)]) == dig([("Cusco", 2), ("Lima", 1)]))`,
          output: `True`,
        },
      },
      {
        id: "S20-T4-B-E3",
        subtopicId: "S20-T4-B",
        kind: "transfer",
        instruction:
          "structural_ok(sheetnames, need) True si need subset de sheetnames; prueba need Entrada/Salida.",
        hint: "set issuperset.",
        hints: [
          "set issuperset.",
          "print.",
        ],
        edgeCases: ["case"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `def structural_ok(sheetnames, need):
    return set(sheetnames) >= set(need)
print(structural_ok(["Entrada", "Salida", "Log"], ["Entrada", "Salida"]))`,
          output: `True`,
        },
      },
    ],
  },
  youDo: {
    title: "Excel factory CP-N2-B",
    context:
      "Implementa un adaptador que lea formatos sintéticos del VP, genere workbook de resultados sin dañar la plantilla master y deje **manifest** de cambios/conciliación (**CP-N2-B excel factory**).",
    objectives: [
      "Leer/escribir sheets con openpyxl",
      "Calcular en Python valores de salida",
      "Conciliar totales con tolerancia",
      "Batch con corrupt/lock handling",
      "Backup + idempotencia + tests estructurales",
    ],
    requirements: [
      "No modificar plantilla master in-place sin backup",
      "Manifest JSON con estados y reconcile_ok",
      "Datos sintéticos only",
      "Headers validados",
      "es-PE en etiquetas de hojas de presentación",
    ],
    starterCode: `from openpyxl import Workbook
import json

# TODO: plantilla → salida + manifest
wb = Workbook()
ws = wb.active
ws.title = "Entrada"
ws.append(["region", "monto"])
ws.append(["Lima", 10.0])
print(wb.sheetnames)
`,
    portfolioNote:
      "Workbook + manifest del factory; se enlaza al dashboard (S19) y al paquete de reportes (S21).",
    rubric: [
      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
      { criterion: "Correctitud técnica en entorno declarado", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados", weight: "15%" },
      { criterion: "Código legible y límites claros", weight: "10%" },
      { criterion: "Documentación en español profesional", weight: "10%" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "openpyxl sin Excel instalado evalúa fórmulas automáticamente:",
        options: [
          "Siempre sí",
          "No; suele devolver la fórmula o cache si existe",
          "Solo en Linux",
          "Solo named ranges",
        ],
        correctIndex: 1,
        explanation:
          "No hay motor Excel en openpyxl por defecto; calcula en Python o usa data_only con cache previo.",
      },
      {
        question: "Al escribir en celdas combinadas debes:",
        options: [
          "Escribir en cualquier celda del merge",
          "Escribir en la celda ancla (top-left)",
          "Desmerge siempre",
          "Usar solo CSV",
        ],
        correctIndex: 1,
        explanation:
          "El valor vive en la celda ancla del rango combinado.",
      },
      {
        question: "Un manifest del excel factory debe permitir auditar:",
        options: [
          "Solo el color de fuente",
          "Estados de batch, conciliación y backups",
          "La contraseña del VP",
          "Embeddings",
        ],
        correctIndex: 1,
        explanation:
          "Auditoría operativa del lote y de la conciliación.",
      },
      {
        question: "Idempotencia significa:",
        options: [
          "Correr dos veces cambia totales al azar",
          "Misma entrada → mismo resultado lógico",
          "Borrar la plantilla",
          "Ignorar headers",
        ],
        correctIndex: 1,
        explanation:
          "Re-ejecutar no debe corromper ni duplicar efectos no controlados.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "openpyxl docs",
        url: "https://openpyxl.readthedocs.io/",
        note: "API de workbooks y estilos",
      },
      {
        label: "Office Open XML overview",
        url: "https://learn.microsoft.com/en-us/office/open-xml/open-xml-sdk",
        note: "Contexto de formato xlsx",
      },
    ],
    books: [
      {
        label: "Automate the Boring Stuff (Excel chapters)",
        note: "Automatización práctica",
      },
      {
        label: "Python for Excel (Zumstein)",
        note: "Patrones profesionales con openpyxl/xlwings",
      },
    ],
    courses: [
      {
        label: "openpyxl tutorial",
        url: "https://openpyxl.readthedocs.io/en/stable/tutorial.html",
        note: "Inicio rápido",
      },
    ],
  },
}
