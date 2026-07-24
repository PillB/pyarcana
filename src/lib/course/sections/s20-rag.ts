import type { CourseSection } from '../../types'

export const section20: CourseSection = {
 id: "rag",
 index: 20,
 title: "Automatización robusta de Excel",
 shortTitle: "Excel factory",
 tagline: "adaptador que lee los formatos sintéticos del VP, produce un workbook de resultados sin dañar la plantilla y deja manifest de cambios",
 estimatedHours: 18,
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
 { text: "Garantizar backups, idempotencia y tests estructurales" }
 ],
 theory: [
 {
 heading: "De “RAG en producción” a Excel factory (mapa)",
 paragraphs: [
 "En V3, **S20 no es RAG de embeddings en producción**. El id `rag` se conserva; el camino es la **automatización robusta de Excel** (openpyxl) como reporting factory: hojas, tablas, fórmulas vs valores, estilos, conciliación, validación estructural, batch e idempotencia.",
 "Hilo: workbook sintético `cpn2b_factory.xlsx` con hojas Entrada/Datos/Salida, regiones Lima/Cusco y montos PEN. Una corrida debe ser reejecutable sin corromper plantillas ni inventar filas. Nunca PII real en celdas.",
 "Orden: **T1 Modelo de libro** (sheets, celdas, tablas, named ranges; fórmulas vs cache) → **T2 Presentación** (estilos, charts Excel, fechas/locales, protección) → **T3 Calidad** (conciliación, pivots, validación, preservación) → **T4 Operación** (batch, corruptos/locks, backups, idempotencia, tests estructurales). Prerrequisitos S17–S19.",
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
 "Un libro es un grafo de **hojas + celdas + tablas + named ranges**. Nombra hojas de forma estable (`Entrada`, `Datos`, `Salida`); evita “Hoja1” en el entregable. Las tablas y rangos con nombre anclan fórmulas y lecturas programáticas.",
 "Contrato: crear workbook, set title, escribir encabezados, append filas, listar `sheetnames`. El gate verifica presencia de hojas requeridas y encabezado `region` antes de cualquier KPI.",
 "Caso: `ws.title='Entrada'`, A1=`region`; segunda hoja `Salida`. Conteos de filas de datos (sin header) alimentan la conciliación con el dashboard S19 (mismos n).",
 ],
 code: {
 language: 'python',
 title: "sheets_cells.py",
 code: `def s20_th_1():
    from openpyxl import Workbook

    wb = Workbook()
    ws = wb.active
    ws.title = "Entrada"
    ws["A1"] = "region"
    ws["B1"] = "monto"
    ws["A2"] = "Lima"
    ws["B2"] = 28.0
    wb.create_sheet("Salida")
    print(wb.sheetnames)
    print(ws["A2"].value, ws["B2"].value)

s20_th_1()`,
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
 "Las **fórmulas** viven en la celda; los **valores cacheados** son lo que Excel/openpyxl puede leer sin motor de cálculo completo. No asumas que `data_only=True` rellena fórmulas recién escritas en el mismo proceso sin Excel.",
 "Contrato didáctico: separa “escribir fórmula” de “assert de valor de negocio”. Para asserts de KPI en CI del curso, escribe **valores materializados** o documenta dependencia de motor. Nunca “el número está bien porque la fórmula se ve bien”.",
 "Caso: celda `=SUM(B2:B10)` vs valor 120 precalculado en Python. El factory de CP-N2-B prefiere materializar métricas ya validadas en pandas y copiar el número al Excel de salida.",
 ],
 code: {
 language: 'python',
 title: "formulas.py",
 code: `def s20_th_2():
    from openpyxl import Workbook

    wb = Workbook()
    ws = wb.active
    ws["A1"] = 10
    ws["A2"] = 5
    ws["A3"] = "=A1+A2"
    print("formula", ws["A3"].value)
    # cálculo python equivalente
    print("python_sum", ws["A1"].value + ws["A2"].value)

s20_th_2()`,
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
 "Estilos (fuentes, fills, borders), charts embebidos y plantillas reutilizables dan pinta ejecutiva — pero el **contrato de datos** manda sobre el formato. No rompas encabezados al embellecer.",
 "Contrato: estilos solo en rangos de presentación; datos crudos en hoja Entrada sin merges que impidan `iter_rows`. Charts Excel son opcionales si el PNG de S19 ya cubre el insight.",
 "Caso sintético: plantilla con logo placeholder y tabla de KPIs; el script rellena filas sin tocar la fila 1 de encabezados fijos. Diff estructural del xlsx debe ser predecible.",
 ],
 code: {
 language: 'python',
 title: "styles.py",
 code: `def s20_th_3():
    from openpyxl import Workbook
    from openpyxl.styles import Font, PatternFill

    wb = Workbook()
    ws = wb.active
    ws["A1"] = "KPI"
    ws["A1"].font = Font(bold=True, color="FFFFFF")
    ws["A1"].fill = PatternFill("solid", fgColor="1F4E79")
    ws["B1"] = 28.0
    print(ws["A1"].font.bold, ws["B1"].value)

s20_th_3()`,
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
 "Fechas y locales: serializa fechas ISO o datetime timezone-aware documentado; no dependas del locale del SO del alumno para parsear “03/04/24”. Celdas combinadas y protección de hoja son trampas de lectura automatizada.",
 "Contrato: evita merges en rangos de datos; si la plantilla legacy los trae, lee el valor de la celda ancla y documenta. Protección: el script debe fallar claro si no puede escribir, no silenciar.",
 "Caso: corte `2024-06-30` en celda de metadata; región en columna A sin merge. El data note del factory repite el corte — alineado a S18.",
 ],
 code: {
 language: 'python',
 title: "dates_merge.py",
 code: `def s20_th_4():
    from openpyxl import Workbook
    from datetime import date

    wb = Workbook()
    ws = wb.active
    ws["A1"] = date(2024, 6, 30)
    ws.merge_cells("B1:C1")
    ws["B1"] = "Lima-Arequipa"
    print(ws["A1"].value.isoformat())
    print("merge", ws.merged_cells.ranges)
    print("C1_is_none", ws["C1"].value)

s20_th_4()`,
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
 "**Conciliación**: totales del Excel de salida deben cuadrar con los del dataframe fuente (suma de montos, n de filas). Pivots en Excel son para el usuario final; el script puede materializar el pivot ya calculado en pandas (S17).",
 "Contrato: `assert abs(sum_xlsx - sum_df) < tol` y `n_xlsx == n_df`. Si no cuadra, **fail-closed**: no emitas el paquete a S21. Documenta tolerancia de redondeo (2 decimales PEN).",
 "Caso: df montos 10+20+30 vs hoja Salida; pivot región→suma. El gate imprime `reconcile True` solo si ambos lados coinciden.",
 ],
 code: {
 language: 'python',
 title: "reconcile.py",
 code: `def s20_th_5():
    import pandas as pd

    det = pd.DataFrame({"region": ["Lima", "Lima", "Cusco"], "monto": [10.0, 5.0, 7.0]})
    tot_portada = 22.0
    tot_det = float(det["monto"].sum())
    pivot = det.groupby("region", as_index=False)["monto"].sum()
    print(pivot.to_dict(orient="list"))
    print("ok", abs(tot_det - tot_portada) < 0.01)

s20_th_5()`,
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
 "Reglas de validación (listas, enteros, custom) y **preservación de estructura**: no borres hojas de catálogo; no renombres `Entrada` en caliente sin migrar referencias. Validar antes de escribir lote.",
 "Contrato: conjunto de sheetnames requeridas ⊆ sheetnames reales; encabezados exactos; tipos coercibles. Ante fila inválida, cuarentena de fila o abort del batch según política documentada — sin PII en logs.",
 "Caso: need `{'Datos','Salida'}`; si falta `Salida`, `structural_ok` es False y no se genera el zip del reporting package.",
 ],
 code: {
 language: 'python',
 title: "structure.py",
 code: `def s20_th_6():
    expected = ["region", "monto", "n"]
    headers = ["region", "monto", "n"]
    print("structure_ok", headers == expected)
    # validación de dominio
    regiones = {"Lima", "Arequipa", "Cusco"}
    row = {"region": "Lima", "monto": 10.0}
    print("domain_ok", row["region"] in regiones)

s20_th_6()`,
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
 "Batch de muchos xlsx: itera paths, captura corruptos (BadZipFile), respeta locks de archivo ajenos (no crashear el pipeline entero). Un archivo malo se aísla; el resto continúa con resumen de errores.",
 "Contrato operativo: contadores `ok` / `skip_corrupt` / `skip_locked`; log de paths sintéticos. Timeout y tamaño máximo por archivo evitan DoS accidental en carpetas grandes.",
 "Caso didáctico: lista de 3 paths, uno corrupto → ok=2, skip_corrupt=1. El summary JSON alimenta el audit del factory.",
 ],
 code: {
 language: 'python',
 title: "batch.py",
 code: `def s20_th_7():
    files = ["a.xlsx", "b.xlsx", "c.xlsx"]
    status = {}
    for f in files:
     if f.startswith("b"):
     status[f] = "corrupt"
     else:
     status[f] = "ok"
    print(status)
    print("ok_count", sum(v == "ok" for v in status.values()))

s20_th_7()`,
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
 "**Backups e idempotencia**: antes de sobrescribir, copia a `backup/` o escribe a path versionado. Misma entrada + misma versión de script → mismos hashes de hojas de datos (orden canónico).",
 "Contrato: digest de filas ordenadas; `structural_ok(sheetnames, need)`; re-ejecutar dos veces no duplica filas. Prueba estructural en CI del curso sin abrir Excel GUI.",
 "Caso: `dig(rows)` estable; segunda corrida con misma key de corrida no agrega filas fantasma. Cierra el tramo Excel hacia documentos S21.",
 ],
 code: {
 language: 'python',
 title: "manifest.py",
 code: `def s20_th_8():
    import json
    import hashlib

    payload = b"region,monto\\nLima,10\\n"
    manifest = {
     "input_sha1_8": hashlib.sha1(payload).hexdigest()[:8],
     "sheets": ["Entrada", "Salida"],
     "reconcile_ok": True,
     "backup": "out/prev_results.xlsx.bak",
     "idempotent": True,
    }
    print(json.dumps(manifest, ensure_ascii=False))

s20_th_8()`,
 output: `{"input_sha1_8": "651f3b6b", "sheets": ["Entrada", "Salida"], "reconcile_ok": true, "backup": "out/prev_results.xlsx.bak", "idempotent": true}`,
 },
 callout: {
 type: "success",
 title: "Manifest obligatorio",
 content:
 "Sin manifest, el incremento excel factory de CP-N2-B no cierra.",
 },
 }
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
 code: `def s20_ido_1():
    from openpyxl import Workbook

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
    print("A2", ws["A2"].value)

s20_ido_1()`,
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
 code: `def s20_ido_2():
    from openpyxl import Workbook

    wb = Workbook()
    ws = wb.active
    ws["B1"] = 10
    ws["B2"] = 15
    ws["B3"] = "=B1+B2"
    formula = ws["B3"].value
    py_val = ws["B1"].value + ws["B2"].value
    print("es_formula", isinstance(formula, str) and formula.startswith("="))
    print("python_value", py_val)
    print("no_evaluado_por_openpyxl", formula != py_val)

s20_ido_2()`,
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
 code: `def s20_ido_3():
    from openpyxl import Workbook
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
    print(ws["B2"].value)

s20_ido_3()`,
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
 code: `def s20_ido_4():
    from openpyxl import Workbook
    from datetime import date

    wb = Workbook()
    ws = wb.active
    ws["A1"] = date(2024, 6, 30)
    ws.merge_cells("B1:D1")
    ws["B1"] = "Cobertura: Lima|Arequipa|Cusco"
    print(ws["A1"].value.isoformat())
    print("anchor", ws["B1"].value)
    print("non_anchor_D1", ws["D1"].value)

s20_ido_4()`,
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
 code: `def s20_ido_5():
    import pandas as pd

    det = pd.DataFrame({
     "region": ["Lima", "Lima", "Arequipa", "Cusco"],
     "monto": [10.0, 12.0, 8.0, 5.5],
    })
    portada = 35.5
    pivot = det.groupby("region")["monto"].sum().to_dict()
    print(pivot)
    print("reconcile", abs(det["monto"].sum() - portada) < 0.01)

s20_ido_5()`,
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
 code: `def s20_ido_6():
    expected = ["region", "monto", "n"]
    got = ["region", "monto", "n"]
    allowed = {"Lima", "Arequipa", "Cusco"}
    rows = [{"region": "Lima", "monto": 1.0, "n": 1}, {"region": "Piura", "monto": 1.0, "n": 1}]
    print("headers_ok", got == expected)
    bad = [r for r in rows if r["region"] not in allowed]
    print("bad_regions", [r["region"] for r in bad])
    print("abort", len(bad) > 0)

s20_ido_6()`,
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
 code: `def s20_ido_7():
    batch = [
     ("ok1.xlsx", "ok"),
     ("bad.xlsx", "corrupt"),
     ("lock.xlsx", "locked"),
     ("ok2.xlsx", "ok"),
    ]
    manifest = {}
    for name, st in batch:
     manifest[name] = st
    print(manifest)
    print({k: sum(1 for v in manifest.values() if v == k) for k in ("ok", "corrupt", "locked")})

s20_ido_7()`,
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
 }
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
 "E1 (guiado) — Concepto: crear hoja y celda de encabezado. Fixture `S20-T1-A-E1` / datos sintéticos: wb = Workbook(); ws = wb.active. Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `['Entrada'] | region`.",
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
 code: `# CASO-LIM-020 · sheet title + A1
# DEFECT: no renombra hoja; A1 vacío
from openpyxl import Workbook
wb = Workbook()
ws = wb.active
print(wb.sheetnames)
print(ws["A1"].value)
print('ok', True)`,
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
 "E2 (independiente) — Concepto: append de filas de datos. Fixture `S20-T1-A-E2` / datos sintéticos: wb = Workbook(); ws = wb.active. Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `2`.",
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
 code: `# CASO-LIM-020 · append rows
# DEFECT: no append header/data; max_row wrong
from openpyxl import Workbook
wb = Workbook()
ws = wb.active
print(ws.max_row)
print('ok', True)`,
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
 "E3 (transferencia) — Concepto: múltiples sheetnames estables. Fixture `S20-T1-A-E3` / datos sintéticos: wb = Workbook(); wb.active.title = \"Datos\". Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `['Datos', 'Salida']`.",
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
 code: `# CASO-LIM-020 · create_sheet
# DEFECT: no create_sheet Salida
from openpyxl import Workbook
wb = Workbook()
wb.active.title = "Datos"
print(wb.sheetnames)
print('ok', True)`,
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
 "E1 (guiado) — Concepto: escribir fórmula en celda. Fixture `S20-T1-B-E1` / datos sintéticos: wb = Workbook(); ws = wb.active. Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `True`.",
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
 code: `# CASO-LIM-020 · formula string
# DEFECT: valor numérico no fórmula
from openpyxl import Workbook
wb = Workbook()
ws = wb.active
ws["A3"] = 0
print(str(ws["A3"].value).startswith("="))
print('ok', True)`,
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
 "E2 (independiente) — Concepto: materializar valor vs fórmula. Fixture `S20-T1-B-E2` / datos sintéticos: wb = Workbook(); ws = wb.active. Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `7`.",
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
 code: `# CASO-LIM-020 · cell values sum
# DEFECT: no asigna A1/A2
from openpyxl import Workbook
wb = Workbook()
ws = wb.active
print((ws["A1"].value or 0) + (ws["A2"].value or 0))
print('ok', True)`,
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
 "E3 (transferencia) — Concepto: detectar celda con prefijo =. Fixture `S20-T1-B-E3` / datos sintéticos: def es_formula(v):; return isinstance(v, str) and v.startswith(\"=\"). Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `True | False`.",
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
 code: `# CASO-LIM-020 · es_formula
# DEFECT: siempre True
def es_formula(v):
 return True
print(es_formula("=A1"))
print(es_formula(3))
print('ok', True)`,
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
 "E1 (guiado) — Concepto: aplicar estilo de fuente a header. Fixture `S20-T2-A-E1` / datos sintéticos: wb = Workbook(); ws = wb.active. Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `True`.",
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
 code: `# CASO-LIM-020 · bold font
# DEFECT: no aplica Font bold
from openpyxl import Workbook
from openpyxl.styles import Font
wb = Workbook()
ws = wb.active
ws["A1"] = "KPI"
print(bool(ws["A1"].font and ws["A1"].font.bold))
print('ok', True)`,
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
 "E2 (independiente) — Concepto: freeze_panes o dimensión de print. Fixture `S20-T2-A-E2` / datos sintéticos: wb = Workbook(); ws = wb.active. Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `True`.",
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
 code: `# CASO-LIM-020 · fill
# DEFECT: sin PatternFill
from openpyxl import Workbook
from openpyxl.styles import PatternFill
wb = Workbook()
ws = wb.active
print(ws["A1"].fill.fgColor is not None)
print('ok', True)`,
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
 "E3 (transferencia) — Concepto: plantilla con hoja fija de catálogo. Fixture `S20-T2-A-E3` / datos sintéticos: def header_style(ws, coord):; c = ws[coord]. Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `True`.",
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
 code: `# CASO-LIM-020 · header_style
# DEFECT: no set bold
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill

def header_style(ws, coord):
 c = ws[coord]
 c.fill = PatternFill("solid", fgColor="1F4E79")

wb = Workbook()
ws = wb.active
ws["A1"] = "H"
header_style(ws, "A1")
print(ws["A1"].font.bold)
print('ok', True)`,
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
 "E1 (guiado) — Concepto: fecha ISO en celda de metadata. Fixture `S20-T2-B-E1` / datos sintéticos: wb = Workbook(); ws = wb.active. Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `2024-01-15`.",
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
 code: `# CASO-LIM-020 · date isoformat
# DEFECT: string no date
from openpyxl import Workbook
from datetime import date
wb = Workbook()
ws = wb.active
ws["A1"] = "2024-01-15"
print(getattr(ws["A1"].value, "isoformat", lambda: ws["A1"].value)())
print('ok', True)`,
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
 "E2 (independiente) — Concepto: evitar merge en rango de datos. Fixture `S20-T2-B-E2` / datos sintéticos: wb = Workbook(); ws = wb.active. Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `None`.",
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
 code: `# CASO-LIM-020 · merge value
# DEFECT: merge sin valor en B1
from openpyxl import Workbook
wb = Workbook()
ws = wb.active
ws.merge_cells("B1:C1")
print(ws["C1"].value)
print('ok', True)`,
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
 "E3 (transferencia) — Concepto: protección / flag writable. Fixture `S20-T2-B-E3` / datos sintéticos: wb = Workbook(); ws = wb.active. Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `2`.",
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
 code: `# CASO-LIM-020 · merged ranges count
# DEFECT: un solo merge
from openpyxl import Workbook
wb = Workbook()
ws = wb.active
ws.merge_cells("A1:B1")
print(len(ws.merged_cells.ranges))
print('ok', True)`,
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
 "E1 (guiado) — Concepto: suma reconciliada df vs hoja. Fixture `S20-T3-A-E1` / datos sintéticos: det = 10 + 5; portada = 15. Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `True`.",
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
 code: `# CASO-LIM-020 · reconcile tol
# DEFECT: det != portada; abs check fail
det = 10 + 5
portada = 16
print(abs(det - portada) < 0.01)
print('ok', True)`,
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
 "E2 (independiente) — Concepto: conteo n filas de datos. Fixture `S20-T3-A-E2` / datos sintéticos: df = pd.DataFrame({\"region\": [\"Lima\", \"Lima\", \"Cusco\"], \"monto\": [10.0, 5.0, 7.0]}); print(df.groupby(\"region\")[\"monto\"]. Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `{'Cusco': 7.0, 'Lima': 15.0}`.",
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
 code: `# CASO-LIM-020 · groupby sum
# DEFECT: mean no sum
import pandas as pd
df = pd.DataFrame({"region": ["Lima", "Lima", "Cusco"], "monto": [10.0, 5.0, 7.0]})
print(df.groupby("region")["monto"].mean().to_dict())
print('ok', True)`,
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
 "E3 (transferencia) — Concepto: pivot materializado región→suma. Fixture `S20-T3-A-E3` / datos sintéticos: def reconcile(det_sum, portada, tol=0.01):; return abs(det_sum - portada) < tol. Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `True | False`.",
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
 code: `# CASO-LIM-020 · reconcile fn
# DEFECT: tol=0 exact
def reconcile(det_sum, portada, tol=0.0):
 return abs(det_sum - portada) < tol
print(reconcile(22.0, 22.005))
print(reconcile(22.0, 23.0))
print('ok', True)`,
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
 "E1 (guiado) — Concepto: validar encabezados requeridos. Fixture `S20-T3-B-E1` / datos sintéticos: expected = [\"region\", \"monto\"]; got = [\"region\", \"monto\"]. Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `True`.",
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
 code: `# CASO-LIM-020 · schema equality
# DEFECT: got missing monto
expected = ["region", "monto"]
got = ["region"]
print(expected == got)
print('ok', True)`,
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
 "E2 (independiente) — Concepto: structural_ok de sheetnames. Fixture `S20-T3-B-E2` / datos sintéticos: allowed = {\"Lima\", \"Cusco\"}; regs = [\"Lima\", \"Piura\"]. Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `['Piura']`.",
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
 code: `# CASO-LIM-020 · allowlist regions
# DEFECT: no filtra; imprime all
allowed = {"Lima", "Cusco"}
regs = ["Lima", "Piura"]
print(regs)
print('ok', True)`,
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
 "E3 (transferencia) — Concepto: preservar hoja de catálogo. Fixture `S20-T3-B-E3` / datos sintéticos: def validate_rows(rows, allowed):; return [r[\"region\"] for r in rows if r[\"region\"] not in allowed]. Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `['Ica']`.",
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
 code: `# CASO-LIM-020 · validate_rows
# DEFECT: devuelve allowed no violators
def validate_rows(rows, allowed):
 return [r["region"] for r in rows if r["region"] in allowed]
print(validate_rows([{"region": "Lima"}, {"region": "Ica"}], {"Lima", "Cusco"}))
print('ok', True)`,
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
 "E1 (guiado) — Concepto: contadores batch ok/skip. Fixture `S20-T4-A-E1` / datos sintéticos: st = [\"ok\", \"corrupt\", \"ok\"]; print(sum(x == \"ok\" for x in st)). Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `2`.",
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
 code: `# CASO-LIM-020 · count ok status
# DEFECT: cuenta corrupt
st = ["ok", "corrupt", "ok"]
print(sum(x == "corrupt" for x in st))
print('ok', True)`,
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
 "E2 (independiente) — Concepto: aislar archivo corrupto. Fixture `S20-T4-A-E2` / datos sintéticos: name = \"report.lock\"; print(\"locked\" if name.endswith(\".lock\") or \"lock\" in name else \"ok\"). Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `locked`.",
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
 code: `# CASO-LIM-020 · lock file
# DEFECT: siempre ok
name = "report.lock"
print("ok")
# Contrato: corrige el DEFECT; salida = solutionCode
# Datos sintéticos únicamente
print('ok', True)`,
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
 "E3 (transferencia) — Concepto: resumen JSON de corrida batch. Fixture `S20-T4-A-E3` / datos sintéticos: files = {\"a\": \"ok\", \"b\": \"corrupt\"}; print(dict(Counter(files.values()))). Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `{'ok': 1, 'corrupt': 1}`.",
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
 code: `# CASO-LIM-020 · Counter statuses
# DEFECT: imprime keys not counts
from collections import Counter
files = {"a": "ok", "b": "corrupt"}
print(list(files.values()))
print('ok', True)`,
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
 "E1 (guiado) — Concepto: backup path versionado. Fixture `S20-T4-B-E1` / datos sintéticos: print({\"backup\": \"out/prev.bak\", \"idempotent\": True}). Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `{'backup': 'out/prev.bak', 'idempotent': True}`.",
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
 code: `# CASO-LIM-020 · backup dict
# DEFECT: idempotent False
print({"backup": "out/prev.bak", "idempotent": False})
print('ok', True)`,
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
 "E2 (independiente) — Concepto: digest canónico de filas. Fixture `S20-T4-B-E2` / datos sintéticos: def dig(rows):; s = \"\\\\n\".join(f\"{a},{b}\" for a, b in sorted(rows)). Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `True`.",
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
 code: `# CASO-LIM-020 · dig order-invariant
# DEFECT: no sort rows
import hashlib

def dig(rows):
 s = "\n".join(f"{a},{b}" for a, b in rows)
 return hashlib.sha1(s.encode()).hexdigest()
print(dig([("Lima", 1), ("Cusco", 2)]) == dig([("Cusco", 2), ("Lima", 1)]))
print('ok', True)`,
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
 "E3 (transferencia) — Concepto: structural_ok need ⊆ sheets. Fixture `S20-T4-B-E3` / datos sintéticos: def structural_ok(sheetnames, need):; return set(sheetnames) >= set(need). Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `True`.",
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
 code: `# CASO-LIM-020 · structural_ok
# DEFECT: exact equality not subset
def structural_ok(sheetnames, need):
 return set(sheetnames) == set(need)
print(structural_ok(["Entrada", "Salida", "Log"], ["Entrada", "Salida"]))
print('ok', True)`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `def structural_ok(sheetnames, need):
 return set(sheetnames) >= set(need)
print(structural_ok(["Entrada", "Salida", "Log"], ["Entrada", "Salida"]))`,
 output: `True`,
 },
 }
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

# Contrato: plantilla → salida + manifest
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
 { criterion: "Documentación en español profesional", weight: "10%" }
 ],
 },
 selfCheck: {
 questions: [
 {
 question: "openpyxl sin Excel instalado evalúa fórmulas automáticamente:",
 options: ["Siempre sí", "Solo en Linux", "Solo named ranges", "No; suele devolver la fórmula o cache si existe"],
 correctIndex: 3,
 explanation:
 "No hay motor Excel en openpyxl por defecto; calcula en Python o usa data_only con cache previo.",
 },
 {
 question: "Al escribir en celdas combinadas debes:",
 options: ["Escribir en cualquier celda del merge", "Escribir en la celda ancla (top-left)", "Desmerge siempre", "Usar solo CSV"],
 correctIndex: 1,
 explanation:
 "El valor vive en la celda ancla del rango combinado.",
 },
 {
 question: "Un manifest del excel factory debe permitir auditar:",
 options: ["Solo el color de fuente", "La contraseña del VP", "Estados de batch, conciliación y backups", "Embeddings"],
 correctIndex: 2,
 explanation:
 "Auditoría operativa del lote y de la conciliación.",
 },
 {
 question: "Idempotencia significa:",
 options: ["Misma entrada → mismo resultado lógico", "Correr dos veces cambia totales al azar", "Borrar la plantilla", "Ignorar headers"],
 correctIndex: 0,
 explanation:
 "Re-ejecutar no debe corromper ni duplicar efectos no controlados.",
 },

{
 question: "Al materializar un Excel de salida del reporting factory, la suma de montos en la hoja no cuadra con el DataFrame fuente. ¿Cuál es la política correcta?",
 options: ["Enviar el xlsx igual y aclarar la diferencia solo si el cliente pregunta", "Borrar la hoja de Entrada para que no se note la discrepancia", "Cambiar el total del DataFrame para que coincida con Excel sin audit trail", "Fail-closed: no emitir el paquete hasta reconciliar n y totales (con tolerancia de redondeo documentada)"],
 correctIndex: 3,
 explanation:
 "La conciliación es un quality gate del factory. Sin cuadrar totales/n, no se emite el paquete hacia S21.",
}

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
 label: "openpyxl tutorial",
 url: "https://openpyxl.readthedocs.io/en/stable/tutorial.html",
 note: "Inicio rápido sheets/celdas",
 },
 {
 label: "openpyxl styles",
 url: "https://openpyxl.readthedocs.io/en/stable/styles.html",
 note: "fuentes, fills, borders",
 },
 {
 label: "openpyxl charts",
 url: "https://openpyxl.readthedocs.io/en/stable/charts/introduction.html",
 note: "charts embebidos opcionales",
 },
 {
 label: "Office Open XML overview",
 url: "https://learn.microsoft.com/en-us/office/open-xml/open-xml-sdk",
 note: "Contexto de formato xlsx",
 },
 {
 label: "ECMA-376 OOXML",
 url: "https://www.ecma-international.org/publications-and-standards/standards/ecma-376/",
 note: "estándar del contenedor xlsx",
 },
 {
 label: "Python pathlib",
 url: "https://docs.python.org/3/library/pathlib.html",
 note: "paths de plantilla y backup",
 },
 ],
 books: [
 {
 label: "Automate the Boring Stuff (Excel chapters)",
 note: "Automatización práctica",
 },
 {
 label: "Python for Excel (Zumstein)",
 note: "Patrones profesionales openpyxl/xlwings",
 },
 ],
 courses: [
 {
 label: "Coursera — Python for Everybody",
 url: "https://www.coursera.org/specializations/python",
 note: "fundamentos de archivos/datos",
 },
 {
 label: "MIT 6.100L",
 url: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/",
 note: "lógica y estructuras",
 },
 {
 label: "Harvard CS50P",
 url: "https://cs50.harvard.edu/python/",
 note: "práctica Python",
 },
 {
 label: "PyArcana live",
 url: "https://pillb.github.io/pyarcana/",
 note: "curso desplegado; V3 S20 Excel factory",
 },
 {
 label: "Awesome Python Learning",
 url: "https://github.com/skupriienko/Awesome-Python-Learning",
 note: "mapa de recursos",
 },
 {
 label: "Real Python — openpyxl",
 url: "https://realpython.com/openpyxl-excel-spreadsheets-python/",
 note: "guía práctica de workbooks",
 },
 {
 label: "deeplearning.ai — Data Engineering (concepts)",
 url: "https://www.deeplearning.ai/specializations/data-engineering",
 note: "pipelines de entrega; adaptar a Excel local",
 },
 ],
 },
}
