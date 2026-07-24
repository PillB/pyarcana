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
  icon: "FileSpreadsheet",
  accentColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
  jobRelevance:
    "En finanzas, operaciones y reporting en Perú, **Excel sigue siendo el contrato de entrega**. Aquí construyes un **excel factory** con openpyxl: lees plantillas sintéticas del VP (vicepresidencia / área de negocio), escribes un workbook de resultados sin dañar el master, concilias totales y dejas un **manifest** (JSON de auditoría de la corrida) de cambios — sin PII real. Este incremento alimenta el paquete de reporting de CP-N2-B.",
  learningOutcomes: [
    { text: "Manipular sheets, celdas y encabezados estables con openpyxl" },
    { text: "Distinguir fórmulas de valores cacheados y materializar KPIs en Python" },
    { text: "Aplicar estilos de encabezado y copiar plantillas a un path de salida" },
    { text: "Manejar fechas ISO y celdas combinadas (celda ancla) sin romper layouts" },
    { text: "Conciliar totales y materializar pivots lógicos desde pandas" },
    { text: "Preservar estructura, validar headers y filtrar dominios permitidos" },
    { text: "Operar batch aislando corruptos y locks con contadores auditables" },
    { text: "Garantizar backups, idempotencia, tests estructurales y manifest" }
  ],
  theory: [
    {
      heading: "Excel factory: de la plantilla al manifest (mapa)",
      paragraphs: [
        "Esta sección es **automatización robusta de Excel** con openpyxl: un reporting factory que manipula hojas, celdas, fórmulas vs valores, estilos, conciliación, validación estructural, batch e idempotencia. El objetivo no es “hacer un xlsx bonito”, sino entregar un artefacto auditable que un VP de finanzas u operaciones pueda abrir mañana sin sorpresas.",
        "**Diccionario de la sección** (léelo una vez; el resto lo usa). **Plantilla master:** xlsx de referencia que no se sobrescribe. **Celda ancla:** esquina superior izquierda de un merge (ahí vive el valor). **Valor materializado:** número ya calculado en Python y escrito a la celda (no dependes de Excel para evaluarlo). **Conciliación:** comparar totales/n del Excel de salida vs el DataFrame fuente. **Fail-closed:** si la conciliación falla, no emites el paquete. **Manifest:** JSON con estados de batch, `reconcile_ok`, backup e hashes. **Idempotencia:** misma entrada + misma versión de script → mismo resultado lógico (sin filas fantasma). **Cuarentena:** aislar un archivo corrupto sin tumbar el lote.",
        "Hilo del caso: workbook sintético `cpn2b_factory.xlsx` con hojas canónicas **Entrada** (datos crudos) y **Salida** (KPIs materializados); opcionalmente **Datos** como staging intermedio. Regiones Lima/Cusco/Arequipa y montos PEN. Una corrida debe ser reejecutable sin corromper plantillas ni inventar filas. Nunca PII real en celdas.",
        "Orden de aprendizaje: **T1 Modelo de libro** (sheets, celdas, encabezados; fórmulas vs valores materializados) → **T2 Presentación** (estilos, plantillas copy→save, fechas ISO, merges) → **T3 Calidad** (conciliación, pivots lógicos, validación, preservación) → **T4 Operación** (batch, corruptos/locks, backups, idempotencia, tests estructurales). Prerrequisitos S17–S19. Cierra hacia el paquete de reportes de S21 y el gate CP-N2-B.",
      ],
      callout: {
        type: "tip",
        title: "Contrato de la sección",
        content:
          "Salida esperada: workbook de resultados + manifest (estados, conciliación, backup). La plantilla master no se sobrescribe. Datos solo sintéticos. Hojas canónicas: Entrada, Datos, Salida.",
      },
    },
    {
      heading: "Sheets, celdas y encabezados estables",
      subtopicId: "S20-T1-A",
      paragraphs: [
        "Un libro de Excel es un grafo de **hojas + celdas + encabezados**. Nombra hojas de forma estable (`Entrada`, `Datos`, `Salida`); evita “Hoja1” en el entregable. Los encabezados de la fila 1 anclan lecturas programáticas (`iter_rows`) y la conciliación posterior. Si el negocio habla de “tablas” o “named ranges”, en este tramo usamos el equivalente práctico: headers fijos + sheetnames contractuales.",
        "Contrato operativo: crear workbook, set `title`, escribir encabezados, append filas, listar `sheetnames`. El control de calidad del factory verifica presencia de hojas requeridas y el encabezado `region` antes de cualquier KPI. Si falta una hoja, abortas con mensaje claro al manifest — no improvisas un sheet vacío en silencio.",
        "Caso sintético Lima: `ws.title='Entrada'`, A1=`region`, B1=`monto`; segunda hoja `Salida`. Los conteos de filas de datos (sin header) alimentan la conciliación con el dashboard de S19 (mismos n). En un banco u ops team peruano, el primer bug típico es renombrar “Entrada” a “Input_v2” y romper tres scripts ajenos.",
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
          "Prefiere títulos de hoja y headers explícitos a “la segunda columna del primer sheet”. Canon mínimo de la sección: Entrada + Salida (Datos opcional como staging).",
      },
    },
    {
      heading: "Fórmulas vs valores materializados",
      subtopicId: "S20-T1-B",
      paragraphs: [
        "Las **fórmulas** viven en la celda como texto (`=SUM(B2:B10)`); los **valores cacheados** son lo que Excel dejó calculado la última vez que abrió el archivo. openpyxl, sin motor Excel, no “resuelve” una fórmula recién escrita solo porque la leas con `data_only=True` en el mismo proceso. En CI Linux no hay Excel: si tu assert depende de un cache ajeno, el pipeline se vuelve no determinista.",
        "Contrato didáctico: separa “escribir fórmula para el humano en Excel” de “assert de valor de negocio en el factory”. Para asserts de KPI en el curso y en producción headless, escribe **valores materializados** (calculados en pandas/Python) o documenta la dependencia del motor. Nunca digas “el número está bien porque la fórmula se ve bien”.",
        "Caso: celda `=SUM(B2:B10)` vs valor 120 precalculado en Python. El factory de CP-N2-B prefiere materializar métricas ya validadas en pandas y copiar el número al Excel de salida — así S21 recibe un artefacto que no necesita reabrirse en Excel para auditar.",
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
    # cálculo python equivalente (materializado)
    print("python_sum", ws["A1"].value + ws["A2"].value)

s20_th_2()`,
        output: `formula =A1+A2
python_sum 15`,
      },
      callout: {
        type: "warning",
        title: "Sin motor Excel",
        content:
          "En CI Linux no hay Excel: no dependas de valores cacheados no controlados. Materializa en Python y escribe el número.",
      },
    },
    {
      heading: "Estilos, plantillas y copy→save",
      subtopicId: "S20-T2-A",
      paragraphs: [
        "Estilos (fuentes, fills, borders) y plantillas reutilizables dan pinta ejecutiva — pero el **contrato de datos** manda sobre el formato. No rompas encabezados al embellecer. Los charts embebidos de Excel son opcionales si el PNG de S19 ya cubre el insight; en este tramo priorizamos estilos + plantilla intocable.",
        "Contrato de plantilla: **copia** el master a un path de salida (`shutil.copy`), abre con `load_workbook`, escribe solo rangos de datos, y `wb.save(out)`. Nunca escribas sobre el master sin backup. Estilos solo en rangos de presentación; datos crudos en `Entrada` sin merges que impidan `iter_rows`.",
        "Caso sintético: plantilla con fila 1 de encabezados fijos y color corporativo `1F4E79`; el script rellena filas de detalle y deja el master intacto. El diff estructural del xlsx de salida debe ser predecible entre corridas.",
      ],
      code: {
        language: 'python',
        title: "template_copy_save.py",
        code: `def s20_th_3():
    from openpyxl import Workbook, load_workbook
    from openpyxl.styles import Font, PatternFill
    from pathlib import Path
    import shutil
    import tempfile

    with tempfile.TemporaryDirectory() as tmp:
        master = Path(tmp) / "templates" / "cpn2b_factory.xlsx"
        master.parent.mkdir(parents=True)
        wb0 = Workbook()
        ws0 = wb0.active
        ws0.title = "Entrada"
        ws0["A1"] = "region"
        ws0["A1"].font = Font(bold=True, color="FFFFFF")
        ws0["A1"].fill = PatternFill("solid", fgColor="1F4E79")
        wb0.save(master)

        out = Path(tmp) / "out" / "results.xlsx"
        out.parent.mkdir(parents=True)
        shutil.copy(master, out)
        wb = load_workbook(out)
        ws = wb["Entrada"]
        ws["A2"] = "Lima"
        wb.save(out)
        print("saved", out.name)
        print("master_intact", master.exists())
        print("header_bold", wb["Entrada"]["A1"].font.bold)

s20_th_3()`,
        output: `saved results.xlsx
master_intact True
header_bold True`,
      },
      callout: {
        type: "tip",
        title: "Plantilla intocable",
        content:
          "Copia la plantilla a un output path; nunca escribas sobre el master sin backup. El master es el contrato visual del VP.",
      },
    },
    {
      heading: "Fechas ISO, celdas combinadas y lectura segura",
      subtopicId: "S20-T2-B",
      paragraphs: [
        "Fechas y locales: serializa fechas **ISO** (`YYYY-MM-DD`) o `datetime` documentado; no dependas del locale del SO del alumno para parsear “03/04/24” (¿marzo o abril?). Las celdas combinadas (merges) y la protección de hoja son trampas de lectura automatizada: el valor vive en la **celda ancla** (top-left); las demás del rango leen `None`.",
        "Contrato: evita merges en rangos de datos; si la plantilla legacy los trae, lee el valor de la celda ancla y documenta. Protección de hoja: si el script no puede escribir, debe fallar con mensaje claro al manifest — no silenciar. En este tramo practicamos fechas + merges; la política de “fallar claro” se reutiliza en T4.",
        "Caso: corte `2024-06-30` en celda de metadata; región en columna A sin merge. El data note del factory repite el corte — alineado a S18. Si alguien mergea A2:A100 “para que se vea lindo”, `iter_rows` y la conciliación se vuelven frágiles.",
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
        title: "Trampas de merge",
        content:
          "Automatizar sin mapear merges rompe layouts del VP. Escribe y lee en la celda ancla.",
      },
    },
    {
      heading: "Conciliación y pivots lógicos",
      subtopicId: "S20-T3-A",
      paragraphs: [
        "**Conciliación**: los totales del Excel de salida deben cuadrar con los del DataFrame fuente (suma de montos, n de filas). Los pivots en Excel son para el usuario final; el script puede **materializar el pivot** ya calculado en pandas (groupby) y pegarlo en `Salida`. Así el VP ve la tabla y el factory tiene un número auditable.",
        "Contrato: `assert abs(sum_xlsx - sum_df) < tol` y `n_xlsx == n_df`. Si no cuadra, **fail-closed** (no emitas el paquete a S21). Documenta tolerancia de redondeo (típico: 0.01 para 2 decimales PEN). Un total “casi igual” sin tolerancia documentada es una discusión de fin de mes, no un gate de calidad.",
        "Caso: df montos 10+5+7 vs portada 22.0; pivot región→suma. El gate imprime `reconcile True` solo si ambos lados coinciden. En ops peruanas, este control evita enviar a gerencia un Excel con portada “optimista” y detalle incompleto.",
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
          "Si falla la conciliación, no se emite el workbook final. Fail-closed protege la credibilidad del reporting.",
      },
    },
    {
      heading: "Reglas de validación y preservación de estructura",
      subtopicId: "S20-T3-B",
      paragraphs: [
        "Reglas de validación (headers exactos, dominios de región, tipos coercibles) y **preservación de estructura**: no borres hojas de catálogo; no renombres `Entrada` en caliente sin migrar referencias. Validar **antes** de escribir el lote ahorra rehacer el paquete a las 11 pm.",
        "Contrato: conjunto de sheetnames requeridas ⊆ sheetnames reales (`structural_ok`); encabezados exactos; regiones en allowlist. Ante fila inválida, cuarentena de fila o abort del batch según política documentada — sin PII en logs. Un `structural_ok False` debe quedar en el manifest, no solo en un print fugaz.",
        "Caso: need `{'Entrada','Salida'}`; si falta `Salida`, `structural_ok` es False y no se genera el zip del reporting package. Región “Piura” fuera de allowlist → abort con lista de violators.",
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
          "Si el header no coincide, aborta con mensaje claro al manifest. No “arregles” silenciosamente el orden de columnas.",
      },
    },
    {
      heading: "Batch, archivos corruptos y locks",
      subtopicId: "S20-T4-A",
      paragraphs: [
        "Batch de muchos xlsx: itera paths, captura corruptos (`BadZipFile` — un xlsx es un zip; si el contenedor está roto, openpyxl no puede abrirlo), respeta locks de archivo ajenos (no crashear el pipeline entero). Un archivo malo se aísla; el resto continúa con resumen de errores.",
        "Contrato operativo: contadores `ok` / `skip_corrupt` / `skip_locked`; log de paths sintéticos. Timeout y tamaño máximo por archivo evitan un DoS accidental (denegación de servicio por carpeta enorme o archivo de 2 GB). El summary JSON alimenta el audit del factory.",
        "Caso didáctico: tres paths → ok=1, corrupt=1, locked=1. En un share de finanzas, el archivo “abierto por el contador” (lock) no debe tumbar el lote de la noche.",
      ],
      code: {
        language: 'python',
        title: "batch.py",
        code: `def s20_th_7():
    from zipfile import BadZipFile

    def classify(name, opener):
        try:
            opener(name)
            return "ok"
        except BadZipFile:
            return "corrupt"
        except PermissionError:
            return "locked"

    def fake_open(name):
        if name.startswith("b"):
            raise BadZipFile("not a zip")
        if "lock" in name:
            raise PermissionError("locked")
        return True

    files = ["a.xlsx", "b.xlsx", "c_lock.xlsx"]
    status = {f: classify(f, fake_open) for f in files}
    print(status)
    print("ok_count", sum(v == "ok" for v in status.values()))

s20_th_7()`,
        output: `{'a.xlsx': 'ok', 'b.xlsx': 'corrupt', 'c_lock.xlsx': 'locked'}
ok_count 1`,
      },
      callout: {
        type: "info",
        title: "Cuarentena",
        content:
          "Mueve corruptos a /quarantine y deja hash/nombre en el log. El lote sano sigue.",
      },
    },
    {
      heading: "Backups, idempotencia y pruebas estructurales",
      subtopicId: "S20-T4-B",
      paragraphs: [
        "**Backups e idempotencia**: antes de sobrescribir, copia a `backup/` o escribe a path versionado. Misma entrada + misma versión de script → mismos hashes de hojas de datos (orden canónico de filas). Si re-ejecutar duplica filas, el factory no es de confianza.",
        "Contrato: digest de filas ordenadas; `structural_ok(sheetnames, need)`; re-ejecutar dos veces no duplica filas. Prueba estructural en CI del curso sin abrir Excel GUI. El **manifest** cierra el ciclo: sheets, `reconcile_ok`, backup, `input_sha1_8`, flag de idempotencia.",
        "Caso: `dig(rows)` estable; segunda corrida con la misma key de corrida no agrega filas fantasma. Cierra el tramo Excel hacia documentos y empaquetado de S21.",
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
          "Sin manifest, el incremento excel factory de CP-N2-B no cierra. El JSON es la evidencia de la corrida.",
      },
    }
  ],
  iDo: {
    intro: "Te demuestro el excel factory de punta a punta: sheets canónicos Entrada/Salida, fórmulas vs valores materializados en Python, plantilla intocable (copy→load→save), fechas y merges, conciliación fail-closed, batch con BadZipFile/locks, y manifest de auditoría. Observa el patrón; en We Do lo repites a pedazos; en You Do lo ensamblas.",
    steps: [
      {
        demoId: "S20-T1-A-DEMO",
        subtopicId: "S20-T1-A",
        environment: "local-python",
        description: "Crear sheets canónicos Entrada/Salida y escribir celdas con openpyxl",
        code: {
          language: 'python',
          title: "demo_sheets.py",
          code: `def s20_ido_1():
    from openpyxl import Workbook

    wb = Workbook()
    ws = wb.active
    ws.title = "Entrada"
    ws.append(["region", "monto"])
    ws.append(["Lima", 28.0])
    ws.append(["Cusco", 22.5])
    out = wb.create_sheet("Salida")
    out["A1"] = "n_filas"
    out["B1"] = ws.max_row - 1
    print(wb.sheetnames)
    print("n", out["B1"].value)
    print("A2", ws["A2"].value)

s20_ido_1()`,
          output: `['Entrada', 'Salida']
n 2
A2 Lima`,
        },
        why: "Mapa de hojas estable (Entrada/Salida) es el primer contrato del adaptador.",
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
        description: "Copiar plantilla master, load_workbook, estilizar y guardar en path de salida",
        code: {
          language: 'python',
          title: "demo_template_io.py",
          code: `def s20_ido_3():
    from openpyxl import Workbook, load_workbook
    from openpyxl.styles import Font, PatternFill, Alignment
    from pathlib import Path
    import shutil
    import tempfile

    with tempfile.TemporaryDirectory() as tmp:
        master = Path(tmp) / "templates" / "cpn2b_factory.xlsx"
        master.parent.mkdir(parents=True)
        seed = Workbook()
        seed.active.title = "Entrada"
        seed.active["A1"] = "Region"
        seed.active["B1"] = "Monto PEN"
        seed.save(master)

        out = Path(tmp) / "out" / "results.xlsx"
        out.parent.mkdir(parents=True)
        shutil.copy(master, out)
        wb = load_workbook(out)
        ws = wb["Entrada"]
        for col in ("A", "B"):
            c = ws[f"{col}1"]
            c.font = Font(bold=True, color="FFFFFF")
            c.fill = PatternFill("solid", fgColor="1F4E79")
            c.alignment = Alignment(horizontal="center")
        ws["A2"] = "Lima"
        ws["B2"] = 28.0
        wb.save(out)
        print("saved", out.name, "master_intact", master.exists())
        print(ws["A1"].font.bold, ws["B2"].value)

s20_ido_3()`,
          output: `saved results.xlsx master_intact True
True 28.0`,
        },
        why: "Copy → load → write → save deja el master intacto y materializa el estilo en la salida.",
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
    rows = [
        {"region": "Lima", "monto": 1.0, "n": 1},
        {"region": "Piura", "monto": 1.0, "n": 1},
    ]
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
        description: "Batch con try/except: BadZipFile (corrupt) y PermissionError (lock)",
        code: {
          language: 'python',
          title: "demo_batch.py",
          code: `def s20_ido_7():
    from zipfile import BadZipFile

    def classify(name, opener):
        try:
            opener(name)
            return "ok"
        except BadZipFile:
            return "corrupt"
        except PermissionError:
            return "locked"

    def fake_open(name):
        if name == "bad.xlsx":
            raise BadZipFile("broken container")
        if name == "lock.xlsx":
            raise PermissionError("in use")
        return True

    batch = ["ok1.xlsx", "bad.xlsx", "lock.xlsx", "ok2.xlsx"]
    manifest = {name: classify(name, fake_open) for name in batch}
    counts = {k: sum(1 for v in manifest.values() if v == k) for k in ("ok", "corrupt", "locked")}
    print(manifest)
    print(counts)

s20_ido_7()`,
          output: `{'ok1.xlsx': 'ok', 'bad.xlsx': 'corrupt', 'lock.xlsx': 'locked', 'ok2.xlsx': 'ok'}
{'ok': 2, 'corrupt': 1, 'locked': 1}`,
        },
        why: "El lote continúa; corruptos y locks quedan auditados con excepciones reales.",
      },
      {
        demoId: "S20-T4-B-DEMO",
        subtopicId: "S20-T4-B",
        environment: "local-python",
        description: "Escritura idempotente con backup lógico y tests estructurales",
        code: {
          language: 'python',
          title: "demo_idempotent.py",
          code: `import hashlib
import json

def build_output(rows):
    # determinista: orden canónico
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
    intro: "24 ejercicios en cascada guiado → independiente → transferencia. Cada uno completa un eslabón del factory: hojas y headers (T1-A), fórmulas vs materialización (T1-B), estilos y plantilla copy→save (T2-A), fechas/merges (T2-B), conciliación y pivots (T3-A), validación estructural (T3-B), batch con excepciones (T4-A), backup/idempotencia/manifest (T4-B). Cuando termines, el You Do une todos los eslabones sin dañar el master.",
    steps: [
      {
        id: "S20-T1-A-E1",
        subtopicId: "S20-T1-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Crea un workbook, renombra la hoja activa a `Entrada` y escribe `region` en A1. Imprime `sheetnames` y el valor de A1. Salida esperada (dos líneas):\n['Entrada']\nregion",
        hint: "ws.title = \"Entrada\" y ws[\"A1\"] = \"region\".",
        hints: [
          "ws.title = \"Entrada\" y ws[\"A1\"] = \"region\".",
          "from openpyxl import Workbook; imprime sheetnames y A1.",
        ],
        edgeCases: ["nombre con espacios"],
        tests: "salida coincide con solution output",
        feedback: "Si ves Sheet, te faltó renombrar. Si A1 es None, te faltó el encabezado.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-020 · sheet title + A1
# Pista: falta renombrar la hoja y escribir el encabezado en A1
from openpyxl import Workbook
wb = Workbook()
ws = wb.active
print(wb.sheetnames)
print(ws["A1"].value)`,
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
          "E2 (independiente) — Concepto: append de filas de datos. Crea un workbook, haz `append` del header `[\"region\", \"monto\"]` y de una fila `[\"Lima\", 10.0]`. Imprime `ws.max_row` (debe ser 2: header + 1 dato). Salida esperada:\n2",
        hint: "ws.append dos veces; max_row cuenta header + datos.",
        hints: [
          "ws.append([\"region\", \"monto\"]) y luego la fila Lima.",
          "max_row incluye la fila de encabezado.",
        ],
        edgeCases: ["filas vacías"],
        tests: "salida coincide con solution output",
        feedback: "Si max_row es 1, solo existe la hoja vacía o un solo append.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-020 · append rows
# Pista: falta append del header y de la fila de datos
from openpyxl import Workbook
wb = Workbook()
ws = wb.active
print(ws.max_row)`,
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
          "E3 (transferencia) — Concepto: sheetnames canónicos estables. Renombra la hoja activa a `Entrada` y crea una segunda hoja `Salida`. Imprime `wb.sheetnames`. Salida esperada:\n['Entrada', 'Salida']",
        hint: "create_sheet(\"Salida\") después de renombrar active.",
        hints: [
          "wb.active.title = \"Entrada\".",
          "wb.create_sheet(\"Salida\").",
        ],
        edgeCases: ["duplicar nombre"],
        tests: "salida coincide con solution output",
        feedback: "El orden típico es [Entrada, Salida] si creas Salida después del rename.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-020 · create_sheet
# Pista: renombra a Entrada y crea la hoja Salida
from openpyxl import Workbook
wb = Workbook()
print(wb.sheetnames)`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from openpyxl import Workbook
wb = Workbook()
wb.active.title = "Entrada"
wb.create_sheet("Salida")
print(wb.sheetnames)`,
          output: `['Entrada', 'Salida']`,
        },
      },
      {
        id: "S20-T1-B-E1",
        subtopicId: "S20-T1-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Concepto: escribir fórmula en celda. En A3 escribe la fórmula `=A1+A2` (string). Imprime si el valor de A3 empieza con `=`. Salida esperada:\nTrue",
        hint: "ws[\"A3\"] = \"=A1+A2\"; luego str(...).startswith(\"=\").",
        hints: [
          "Asigna el string de fórmula, no un número.",
          "startswith(\"=\") debe ser True.",
        ],
        edgeCases: ["valor cacheado"],
        tests: "salida coincide con solution output",
        feedback: "Si imprimiste False, A3 sigue siendo numérico o vacío.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-020 · formula string
# Pista: A3 debe ser fórmula (string que empieza con =), no un número
from openpyxl import Workbook
wb = Workbook()
ws = wb.active
ws["A3"] = 0
print(str(ws["A3"].value).startswith("="))`,
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
          "E2 (independiente) — Concepto: materializar valor vs fórmula. Asigna A1=3 y A2=4; imprime la suma de los `.value` numéricos (materialización en Python, sin `data_only`). Salida esperada:\n7",
        hint: "Suma ws[\"A1\"].value + ws[\"A2\"].value tras asignar.",
        hints: [
          "No uses data_only aquí.",
          "Asigna enteros y súmalos en Python.",
        ],
        edgeCases: ["None en celdas"],
        tests: "salida coincide con solution output",
        feedback: "Si sale 0, no asignaste A1/A2 antes de sumar.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-020 · cell values sum
# Pista: asigna A1=3 y A2=4 antes de sumar
from openpyxl import Workbook
wb = Workbook()
ws = wb.active
print((ws["A1"].value or 0) + (ws["A2"].value or 0))`,
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
          "E3 (transferencia) — Concepto: detectar celda con prefijo `=`. Completa `es_formula(v)` para devolver True solo si `v` es str y empieza con `=`. Imprime el resultado para `\"=A1\"` y para `3`. Salida esperada (dos líneas):\nTrue\nFalse",
        hint: "isinstance(v, str) and v.startswith(\"=\").",
        hints: [
          "Dos prints: uno por cada entrada.",
          "Los números no son fórmulas.",
        ],
        edgeCases: ["espacios antes de ="],
        tests: "salida coincide con solution output",
        feedback: "Si ambos son True, tu predicado no distingue tipos.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-020 · es_formula
# Pista: no devuelvas siempre True; revisa tipo y prefijo =
def es_formula(v):
    return True
print(es_formula("=A1"))
print(es_formula(3))`,
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
          "E1 (guiado) — Concepto: aplicar estilo de fuente a header. Escribe \"KPI\" en A1 y aplica `Font(bold=True)`. Imprime `ws[\"A1\"].font.bold`. Salida esperada:\nTrue",
        hint: "from openpyxl.styles import Font; ws[\"A1\"].font = Font(bold=True).",
        hints: [
          "Font(bold=True).",
          "Asigna el font a la celda después de escribir el texto.",
        ],
        edgeCases: ["estilo None"],
        tests: "salida coincide con solution output",
        feedback: "Si es False/None, no asignaste Font a la celda.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-020 · bold font
# Pista: aplica Font(bold=True) a A1
from openpyxl import Workbook
from openpyxl.styles import Font
wb = Workbook()
ws = wb.active
ws["A1"] = "KPI"
print(bool(ws["A1"].font and ws["A1"].font.bold))`,
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
          "E2 (independiente) — Concepto: relleno de encabezado con PatternFill. Crea un workbook, aplica `PatternFill(\"solid\", fgColor=\"1F4E79\")` en A1 y muestra si `fgColor` no es None. Salida esperada:\nTrue",
        hint: "ws[\"A1\"].fill = PatternFill(\"solid\", fgColor=\"1F4E79\").",
        hints: [
          "from openpyxl.styles import PatternFill.",
          "print(ws[\"A1\"].fill.fgColor is not None).",
        ],
        edgeCases: ["color theme vs rgb"],
        tests: "salida coincide con solution output",
        feedback: "Sin PatternFill, el fill por defecto puede no exponer fgColor útil.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-020 · fill
# Pista: aplica PatternFill solid color 1F4E79 en A1
from openpyxl import Workbook
from openpyxl.styles import PatternFill
wb = Workbook()
ws = wb.active
print(ws["A1"].fill.fgColor is not None)`,
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
          "E3 (transferencia) — Concepto: plantilla intocable (copy → load → write → save). En un directorio temporal crea un master con hoja `Entrada` y A1=`region`; cópialo a `out/results.xlsx`; abre la **copia** con `load_workbook`, escribe `Lima` en A2, guarda. Imprime dos líneas: el nombre del archivo de salida y un bool True solo si el master sigue existiendo **y** A2 de la copia es `Lima`. Salida esperada:\nresults.xlsx\nTrue",
        hint: "shutil.copy(master, out); wb = load_workbook(out); escribe A2; wb.save(out); nunca sobrescribas master in-place.",
        hints: [
          "Crea master con Workbook + save; luego shutil.copy a out.",
          "load_workbook solo sobre la copia; print(out.name) y master.exists() and A2==\"Lima\".",
        ],
        edgeCases: ["guardar sobre el master", "out sin mkdir", "copiar sin escribir A2"],
        tests: "salida coincide con solution output",
        feedback: "Si la segunda línea es False, no copiaste, no escribiste A2, o dañaste el master. Si ves no_output, load falló porque out no existe.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-020 · template copy→load→save
# Pista: copia el master a out, abre la COPIA, escribe A2=\"Lima\", save(out)
from openpyxl import Workbook, load_workbook
from pathlib import Path
import shutil
import tempfile

with tempfile.TemporaryDirectory() as tmp:
    master = Path(tmp) / "templates" / "cpn2b_factory.xlsx"
    master.parent.mkdir(parents=True)
    seed = Workbook()
    seed.active.title = "Entrada"
    seed.active["A1"] = "region"
    seed.save(master)

    out = Path(tmp) / "out" / "results.xlsx"
    out.parent.mkdir(parents=True)
    # Sin copiar/escribir, la salida no existe: no debe pasar el contrato
    try:
        wb = load_workbook(out)
        print(out.name)
        print(master.exists() and wb["Entrada"]["A2"].value == "Lima")
    except Exception:
        print("no_output")
        print(False)`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from openpyxl import Workbook, load_workbook
from pathlib import Path
import shutil
import tempfile

with tempfile.TemporaryDirectory() as tmp:
    master = Path(tmp) / "templates" / "cpn2b_factory.xlsx"
    master.parent.mkdir(parents=True)
    seed = Workbook()
    seed.active.title = "Entrada"
    seed.active["A1"] = "region"
    seed.save(master)

    out = Path(tmp) / "out" / "results.xlsx"
    out.parent.mkdir(parents=True)
    shutil.copy(master, out)
    wb = load_workbook(out)
    wb["Entrada"]["A2"] = "Lima"
    wb.save(out)
    print(out.name)
    print(master.exists() and wb["Entrada"]["A2"].value == "Lima")`,
          output: `results.xlsx
True`,
        },
      },
      {
        id: "S20-T2-B-E1",
        subtopicId: "S20-T2-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Concepto: fecha ISO en celda de metadata. Escribe `date(2024, 1, 15)` en A1 e imprime `ws[\"A1\"].value.isoformat()`. Salida esperada:\n2024-01-15",
        hint: "from datetime import date; ws[\"A1\"] = date(2024, 1, 15).",
        hints: [
          "No uses un string; usa date real.",
          "value.isoformat() produce YYYY-MM-DD.",
        ],
        edgeCases: ["datetime vs date"],
        tests: "salida coincide con solution output",
        feedback: "Si no hay isoformat, A1 sigue siendo str u otro tipo.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-020 · date isoformat
# Pista: asigna date(2024, 1, 15), no un string
from openpyxl import Workbook
from datetime import date
wb = Workbook()
ws = wb.active
ws["A1"] = "2024-01-15"
print(getattr(ws["A1"].value, "isoformat", lambda: ws["A1"].value)())`,
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
          "E2 (independiente) — Concepto: celda ancla en merge. Haz `merge_cells(\"B1:C1\")`, escribe `\"x\"` en la ancla B1 e imprime el valor de C1 (no ancla). Salida esperada:\nNone",
        hint: "El valor vive en B1; C1 del merge queda None.",
        hints: [
          "ws.merge_cells(\"B1:C1\"); ws[\"B1\"] = \"x\".",
          "print(ws[\"C1\"].value).",
        ],
        edgeCases: ["escribir en no ancla"],
        tests: "salida coincide con solution output",
        feedback: "C1 no ancla debe ser None aunque B1 tenga valor.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-020 · merge value
# Pista: merge B1:C1 y escribe el valor en la ancla B1
from openpyxl import Workbook
wb = Workbook()
ws = wb.active
ws.merge_cells("B1:C1")
print(ws["C1"].value)`,
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
          "E3 (transferencia) — Concepto: contar rangos merged en la hoja. Crea dos merges (`A1:B1` y `C1:D1`) e imprime `len(ws.merged_cells.ranges)` (cuántos bloques combinados hay activos). Salida esperada:\n2",
        hint: "ws.merge_cells dos veces; luego len(ws.merged_cells.ranges).",
        hints: [
          "Dos llamadas a merge_cells.",
          "No unmerges; solo cuenta rangos activos.",
        ],
        edgeCases: ["unmerge"],
        tests: "salida coincide con solution output",
        feedback: "Si sale 1, te faltó el segundo merge.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-020 · merged ranges count
# Pista: crea dos merges (A1:B1 y C1:D1)
from openpyxl import Workbook
wb = Workbook()
ws = wb.active
ws.merge_cells("A1:B1")
print(len(ws.merged_cells.ranges))`,
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
          "E1 (guiado) — Concepto: conciliación con tolerancia desde celdas. En openpyxl, B2=10 y B3=5 son el detalle; B1 es la portada (hoy 16, incorrecta). Materializa `det` sumando B2+B3, corrige B1 a 15 e imprime si `abs(det - portada) < 0.01`. Salida esperada:\nTrue",
        hint: "Lee .value de las celdas; corrige B1 a 15 para que cuadre con 10+5.",
        hints: [
          "det = ws[\"B2\"].value + ws[\"B3\"].value; ws[\"B1\"] = 15.",
          "print(abs(det - ws[\"B1\"].value) < 0.01).",
        ],
        edgeCases: ["floats 0.1+0.2", "None en celda"],
        tests: "salida coincide con solution output",
        feedback: "Si es False, B1 sigue en 16 o no leíste los .value del detalle.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-020 · reconcile tol desde celdas
# Pista: B1 (portada) no cuadra con B2+B3; ajústala a 15
from openpyxl import Workbook
wb = Workbook()
ws = wb.active
ws["B1"] = 16.0
ws["B2"] = 10.0
ws["B3"] = 5.0
det = ws["B2"].value + ws["B3"].value
portada = ws["B1"].value
print(abs(det - portada) < 0.01)`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from openpyxl import Workbook
wb = Workbook()
ws = wb.active
ws["B1"] = 15.0
ws["B2"] = 10.0
ws["B3"] = 5.0
det = ws["B2"].value + ws["B3"].value
portada = ws["B1"].value
print(abs(det - portada) < 0.01)`,
          output: `True`,
        },
      },
      {
        id: "S20-T3-A-E2",
        subtopicId: "S20-T3-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: pivot/groupby suma por región. Con el DataFrame Lima/Lima/Cusco y montos 10, 5, 7, imprime `df.groupby(\"region\")[\"monto\"].sum().to_dict()`. Salida esperada:\n{'Cusco': 7.0, 'Lima': 15.0}",
        hint: "groupby(...).sum().to_dict() — no mean.",
        hints: [
          "Usa sum, no mean.",
          "to_dict() sobre la Series resultante.",
        ],
        edgeCases: ["NaN monto"],
        tests: "salida coincide con solution output",
        feedback: "Si ves promedios (7.5), usaste mean en vez de sum.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-020 · groupby sum
# Pista: el starter usa mean; cambia a sum para el pivot lógico
import pandas as pd
df = pd.DataFrame({"region": ["Lima", "Lima", "Cusco"], "monto": [10.0, 5.0, 7.0]})
print(df.groupby("region")["monto"].mean().to_dict())`,
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
          "E3 (transferencia) — Concepto: función reconcile con tolerancia. Completa `reconcile(det_sum, portada, tol=0.01)` para devolver True si la diferencia absoluta es menor que `tol`. Imprime para (22.0, 22.005) y (22.0, 23.0). Salida esperada (dos líneas):\nTrue\nFalse",
        hint: "return abs(det_sum - portada) < tol con default tol=0.01.",
        hints: [
          "No uses tol=0 por defecto.",
          "Dos prints con los pares del enunciado.",
        ],
        edgeCases: ["tol 0"],
        tests: "salida coincide con solution output",
        feedback: "Si el primer print es False, tu tol por defecto es demasiado estricta (0).",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-020 · reconcile fn
# Pista: tol por defecto debe ser 0.01, no 0.0
def reconcile(det_sum, portada, tol=0.0):
    return abs(det_sum - portada) < tol
print(reconcile(22.0, 22.005))
print(reconcile(22.0, 23.0))`,
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
          "E1 (guiado) — Concepto: validar encabezados requeridos desde la hoja. Crea un workbook con fila 1 incompleta (solo `region` en A1). Completa B1=`monto`, lee `got = [A1, B1]` e imprime si coincide con `expected = [\"region\", \"monto\"]`. Salida esperada:\nTrue",
        hint: "ws[\"B1\"] = \"monto\"; lee los .value de A1 y B1 en orden.",
        hints: [
          "got = [ws[\"A1\"].value, ws[\"B1\"].value].",
          "Comparación de listas es sensible al orden.",
        ],
        edgeCases: ["orden distinto", "None en header"],
        tests: "salida coincide con solution output",
        feedback: "Si es False, falta B1=monto o leíste mal las celdas del header.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-020 · schema equality desde hoja
# Pista: falta el header monto en B1
from openpyxl import Workbook
wb = Workbook()
ws = wb.active
ws["A1"] = "region"
expected = ["region", "monto"]
got = [ws["A1"].value, ws["B1"].value]
print(expected == got)`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from openpyxl import Workbook
wb = Workbook()
ws = wb.active
ws["A1"] = "region"
ws["B1"] = "monto"
expected = ["region", "monto"]
got = [ws["A1"].value, ws["B1"].value]
print(expected == got)`,
          output: `True`,
        },
      },
      {
        id: "S20-T3-B-E2",
        subtopicId: "S20-T3-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: filtrar regiones fuera de allowlist. Con `allowed = {\"Lima\", \"Cusco\"}` y `regs = [\"Lima\", \"Piura\"]`, imprime la lista de regiones no permitidas. Salida esperada:\n['Piura']",
        hint: "[r for r in regs if r not in allowed].",
        hints: [
          "Comprensión de lista con not in.",
          "No imprimas regs completo.",
        ],
        edgeCases: ["case sensitivity"],
        tests: "salida coincide con solution output",
        feedback: "Debes devolver solo las regiones fuera del allowlist.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-020 · allowlist regions
# Pista: filtra las que NO están en allowed
allowed = {"Lima", "Cusco"}
regs = ["Lima", "Piura"]
print(regs)`,
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
          "E3 (transferencia) — Concepto: validate_rows devuelve violators. Completa la función para devolver las regiones de `rows` que no están en `allowed`. Llama con Lima e Ica. Salida esperada:\n['Ica']",
        hint: "return [r[\"region\"] for r in rows if r[\"region\"] not in allowed].",
        hints: [
          "not in allowed (violators), no in allowed.",
          "print el resultado de la llamada dada.",
        ],
        edgeCases: ["rows vacías"],
        tests: "salida coincide con solution output",
        feedback: "Si devuelves ['Lima'], invertiste el predicado (allowed en vez de violators).",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-020 · validate_rows
# Pista: devuelve violators (fuera de allowed), no las válidas
def validate_rows(rows, allowed):
    return [r["region"] for r in rows if r["region"] in allowed]
print(validate_rows([{"region": "Lima"}, {"region": "Ica"}], {"Lima", "Cusco"}))`,
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
          "E1 (guiado) — Concepto: contadores auditables del batch para el summary. Tras clasificar tres paths (`ok` / `corrupt` / `ok`), imprime el `ok_count` que irá al manifest de la corrida (cuántos archivos quedaron en estado `\"ok\"`). Salida esperada:\n2",
        hint: "sum(v == \"ok\" for v in status.values()) — no cuentes corrupt.",
        hints: [
          "Itera values del dict de estados, no keys.",
          "ok_count alimenta el summary JSON del factory.",
        ],
        edgeCases: ["typos status", "estado vacío"],
        tests: "salida coincide con solution output",
        feedback: "Si sale 1, contaste corrupt o iteraste mal. El ok_count es el campo que el auditor mira primero.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-020 · ok_count del batch
# Pista: el summary del factory reporta cuántos quedaron "ok", no "corrupt"
from zipfile import BadZipFile

def classify(name, opener):
    try:
        opener(name)
        return "ok"
    except BadZipFile:
        return "corrupt"
    except PermissionError:
        return "locked"

def fake_open(name):
    if name.startswith("b"):
        raise BadZipFile("broken")
    return True

files = ["a.xlsx", "b.xlsx", "c.xlsx"]
status = {f: classify(f, fake_open) for f in files}
# BUG: cuenta corrupt en vez de ok
print(sum(v == "corrupt" for v in status.values()))`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from zipfile import BadZipFile

def classify(name, opener):
    try:
        opener(name)
        return "ok"
    except BadZipFile:
        return "corrupt"
    except PermissionError:
        return "locked"

def fake_open(name):
    if name.startswith("b"):
        raise BadZipFile("broken")
    return True

files = ["a.xlsx", "b.xlsx", "c.xlsx"]
status = {f: classify(f, fake_open) for f in files}
print(sum(v == "ok" for v in status.values()))`,
          output: `2`,
        },
      },
      {
        id: "S20-T4-A-E2",
        subtopicId: "S20-T4-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: clasificar archivo con try/except real. Completa `classify(name, opener)` para devolver `\"ok\"` si `opener` no lanza, `\"corrupt\"` si lanza `BadZipFile`, y `\"locked\"` si lanza `PermissionError`. Imprime `classify(\"in_use.xlsx\", fake_open)`. Salida esperada:\nlocked",
        hint: "try/except BadZipFile → corrupt; PermissionError → locked; success → ok.",
        hints: [
          "from zipfile import BadZipFile.",
          "El starter siempre devuelve ok; captura las excepciones del opener.",
        ],
        edgeCases: ["excepciones no contempladas"],
        tests: "salida coincide con solution output",
        feedback: "in_use.xlsx dispara PermissionError → debe ser locked, no ok.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-020 · classify exceptions
# Pista: captura BadZipFile y PermissionError; no devuelvas siempre ok
from zipfile import BadZipFile

def classify(name, opener):
    opener(name)
    return "ok"

def fake_open(name):
    if name == "broken.xlsx":
        raise BadZipFile("not a zip")
    if name == "in_use.xlsx":
        raise PermissionError("locked by user")
    return True

print(classify("in_use.xlsx", fake_open))`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from zipfile import BadZipFile

def classify(name, opener):
    try:
        opener(name)
        return "ok"
    except BadZipFile:
        return "corrupt"
    except PermissionError:
        return "locked"

def fake_open(name):
    if name == "broken.xlsx":
        raise BadZipFile("not a zip")
    if name == "in_use.xlsx":
        raise PermissionError("locked by user")
    return True

print(classify("in_use.xlsx", fake_open))`,
          output: `locked`,
        },
      },
      {
        id: "S20-T4-A-E3",
        subtopicId: "S20-T4-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Concepto: resumen de corrida batch con Counter. Dado `files = {\"a\": \"ok\", \"b\": \"corrupt\"}`, imprime `dict(Counter(files.values()))`. Salida esperada:\n{'ok': 1, 'corrupt': 1}",
        hint: "from collections import Counter; dict(Counter(...)).",
        hints: [
          "Counter sobre files.values().",
          "No imprimas solo la lista de valores.",
        ],
        edgeCases: ["estado desconocido"],
        tests: "salida coincide con solution output",
        feedback: "Debes ver conteos por estado, no la lista cruda de values.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-020 · Counter statuses
# Pista: cuenta ocurrencias de cada estado, no listes los values
from collections import Counter
files = {"a": "ok", "b": "corrupt"}
print(list(files.values()))`,
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
          "E1 (guiado) — Concepto: fragmento mínimo de manifest auditable. Completa el dict con `sheets=[\"Entrada\", \"Salida\"]`, `reconcile_ok=True`, `backup=\"out/prev.bak\"` e `idempotent=True` (misma entrada + misma versión de script → mismo resultado). Imprime el dict. Salida esperada:\n{'sheets': ['Entrada', 'Salida'], 'reconcile_ok': True, 'backup': 'out/prev.bak', 'idempotent': True}",
        hint: "Cuatro keys; idempotent y reconcile_ok en True; sheets canónicos.",
        hints: [
          "idempotent=True declara reejecución segura ante el auditor.",
          "Usa paths relativos de backup (sin secretos en el path).",
        ],
        edgeCases: ["path absoluto con secretos", "sheets incompletos"],
        tests: "salida coincide con solution output",
        feedback: "Si falta una key o idempotent es False, el auditor no cierra el incremento del factory.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-020 · manifest mínimo
# Pista: faltan sheets/reconcile_ok y idempotent debe ser True
manifest = {
    "backup": "out/prev.bak",
    "idempotent": False,
}
print(manifest)`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `manifest = {
    "sheets": ["Entrada", "Salida"],
    "reconcile_ok": True,
    "backup": "out/prev.bak",
    "idempotent": True,
}
print(manifest)`,
          output: `{'sheets': ['Entrada', 'Salida'], 'reconcile_ok': True, 'backup': 'out/prev.bak', 'idempotent': True}`,
        },
      },
      {
        id: "S20-T4-B-E2",
        subtopicId: "S20-T4-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: digest canónico de filas (orden-invariante). Completa `dig(rows)` ordenando las filas antes de hashear. Imprime si dig de (Lima,1)+(Cusco,2) es igual al de la lista invertida. Salida esperada:\nTrue",
        hint: "sorted(rows) antes de join; hashlib.sha1.",
        hints: [
          "s = \"\\n\".join(... for a, b in sorted(rows)).",
          "Compara dig(lista) == dig(reversed).",
        ],
        edgeCases: ["floats formatting"],
        tests: "salida coincide con solution output",
        feedback: "Sin sorted, el orden de entrada cambia el hash.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-020 · dig order-invariant
# Pista: ordena rows antes de hashear
import hashlib

def dig(rows):
    s = "\\n".join(f"{a},{b}" for a, b in rows)
    return hashlib.sha1(s.encode()).hexdigest()
print(dig([("Lima", 1), ("Cusco", 2)]) == dig([("Cusco", 2), ("Lima", 1)]))`,
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
          "E3 (transferencia) — Concepto: structural_ok con need ⊆ sheetnames. Completa la función para devolver True si el conjunto de `sheetnames` es superset de `need`. Prueba con hojas Entrada/Salida/Log y need Entrada/Salida. Salida esperada:\nTrue",
        hint: "return set(sheetnames) >= set(need).",
        hints: [
          "Superset (>=), no igualdad exacta.",
          "Log extra no debe invalidar el check.",
        ],
        edgeCases: ["case"],
        tests: "salida coincide con solution output",
        feedback: "Si usas ==, una hoja extra (Log) falla el check indebidamente.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-020 · structural_ok
# Pista: need debe ser subconjunto; no exijas igualdad exacta
def structural_ok(sheetnames, need):
    return set(sheetnames) == set(need)
print(structural_ok(["Entrada", "Salida", "Log"], ["Entrada", "Salida"]))`,
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
      "El VP de operaciones en Lima entrega plantillas sintéticas y espera un workbook de resultados auditable. Tu adaptador (excel factory de CP-N2-B) debe copiar la plantilla master sin dañarla, materializar KPIs en `Salida`, conciliar totales con tolerancia documentada y dejar un **manifest** JSON de la corrida. Si la conciliación falla, fail-closed: no emitas el paquete hacia S21.",
    objectives: [
      "Copiar plantilla master → path de salida (load_workbook / save)",
      "Leer/escribir sheets canónicos Entrada/Salida con openpyxl",
      "Calcular en Python valores de salida (materializados)",
      "Conciliar totales con tolerancia documentada",
      "Batch con manejo de corrupt/lock (excepciones o cuarentena)",
      "Backup + idempotencia + tests estructurales + manifest.json",
    ],
    requirements: [
      "No modificar plantilla master in-place sin backup",
      "Manifest JSON con sheets, estados, reconcile_ok, backup e input_sha1_8",
      "Datos sintéticos only",
      "Headers validados antes de escribir lote",
      "Etiquetas de hojas de presentación en español profesional (es-PE)",
    ],
    starterCode: `from openpyxl import Workbook, load_workbook
from pathlib import Path
import json
import shutil
import hashlib
import tempfile

# Portfolio excel factory CP-N2-B.
# El esqueleto ya crea el master y copia a out.
# Completa: materializar Salida, conciliar, escribir manifest.json
# y demostrar que el master sigue intacto.

def headers_ok(ws, expected):
    got = [ws.cell(1, c).value for c in range(1, len(expected) + 1)]
    return got == expected

def materialize_salida(wb, det_sum, n_rows):
    """Escribe totales materializados en hoja Salida (no fórmulas)."""
    # COMPLETAR: crea Salida si falta; A1/B1 = total_monto; A2/B2 = n_filas
    if "Salida" not in wb.sheetnames:
        wb.create_sheet("Salida")
    sal = wb["Salida"]
    sal["A1"] = "total_monto"
    sal["B1"] = None  # COMPLETAR: det_sum
    sal["A2"] = "n_filas"
    sal["B2"] = None  # COMPLETAR: n_rows
    return sal

def reconcile(det_sum, portada, n_det, n_xlsx, tol=0.01):
    """Fail-closed: True solo si montos y n cuadran."""
    # COMPLETAR: abs(det_sum - portada) < tol and n_det == n_xlsx
    return False

with tempfile.TemporaryDirectory() as tmp:
    master = Path(tmp) / "templates" / "cpn2b_factory.xlsx"
    master.parent.mkdir(parents=True)
    seed = Workbook()
    ws = seed.active
    ws.title = "Entrada"
    ws.append(["region", "monto"])
    ws.append(["Lima", 10.0])
    ws.append(["Cusco", 5.0])
    seed.save(master)

    out = Path(tmp) / "out" / "results.xlsx"
    out.parent.mkdir(parents=True)
    bak = Path(tmp) / "out" / "results.prev.xlsx.bak"

    # 1) Copia master → out (nunca escribas el master in-place)
    shutil.copy(master, out)
    # backup lógico de la salida previa (primera corrida: copia inicial)
    if not bak.exists():
        shutil.copy(out, bak)

    wb = load_workbook(out)
    entrada = wb["Entrada"]
    expected = ["region", "monto"]
    if not headers_ok(entrada, expected):
        raise ValueError("headers invalidos: aborta al manifest")

    rows = []
    for region, monto in entrada.iter_rows(min_row=2, max_col=2, values_only=True):
        if region is None:
            break
        rows.append((region, float(monto)))

    det_sum = sum(m for _, m in rows)
    n_rows = len(rows)

    # 2) Materializar Salida (COMPLETAR body de materialize_salida)
    sal = materialize_salida(wb, det_sum, n_rows)
    wb.save(out)

    # 3) Conciliación (lee lo materializado o usa det_sum como portada esperada)
    portada = sal["B1"].value if sal["B1"].value is not None else -1.0
    n_xlsx = sal["B2"].value if sal["B2"].value is not None else -1
    ok = reconcile(det_sum, float(portada), n_rows, int(n_xlsx))

    # 4) Manifest de auditoría
    payload = ("region,monto\\n" + "\\n".join(f"{a},{b}" for a, b in rows)).encode()
    manifest = {
        "sheets": list(wb.sheetnames),
        "reconcile_ok": ok,
        "backup": bak.name,
        "input_sha1_8": hashlib.sha1(payload).hexdigest()[:8],
        "idempotent": True,  # COMPLETAR: re-ejecutar no debe duplicar filas
        "master_intact": master.exists(),
    }
    man_path = Path(tmp) / "out" / "manifest.json"
    # COMPLETAR: persiste el JSON
    # man_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")

    print("out", out.name)
    print("master_intact", master.exists() and master.stat().st_size > 0)
    print("reconcile_ok", ok)
    print("manifest_keys", sorted(manifest.keys()))
    print("manifest_written", man_path.exists())
`,
    portfolioNote:
      "Entrega workbook de salida + manifest.json; enlaza al dashboard de S19 y al paquete de reportes de S21. El master de plantilla no se sobrescribe.",
    rubric: [
      { criterion: "Plantilla intacta + workbook de salida + manifest completo", weight: "25%" },
      { criterion: "Correctitud técnica (openpyxl + conciliación + batch)", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados (corrupt, lock, re-run)", weight: "15%" },
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
        options: ["Solo el color de fuente", "La contraseña del VP", "Estados de batch, conciliación y backups", "El nombre del archivo temporal del SO"],
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
      },
      {
        question: "Para no dañar la plantilla master, el patrón correcto es:",
        options: ["Abrir el master y guardar in-place cada corrida", "Copiar el master a un path de salida, load_workbook de la copia y save solo ahí", "Borrar el master al terminar para evitar confusiones", "Renombrar el master a .bak y trabajar sobre el original"],
        correctIndex: 1,
        explanation:
          "shutil.copy(master, out) + load_workbook(out) + wb.save(out) deja el master intacto.",
      },
      {
        question: "En un batch, un xlsx con contenedor roto suele disparar:",
        options: ["KeyError de pandas", "BadZipFile (u error de zip al abrir)", "UnicodeDecodeError de csv", "Timeout de red HTTP"],
        correctIndex: 1,
        explanation:
          "Un .xlsx es un zip; contenedor dañado → BadZipFile. Se aísla y el lote continúa.",
      },
      {
        question: "structural_ok(sheetnames, need) debe devolver True cuando:",
        options: ["sheetnames es exactamente igual a need (sin hojas extra)", "need es subconjunto de sheetnames (superset permitido)", "Al menos una hoja de need existe", "El workbook tiene más de 10 hojas"],
        correctIndex: 1,
        explanation:
          "need ⊆ sheetnames: hojas extra (Log, Catálogo) no invalidan el contrato mínimo.",
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
        note: "Inicio rápido: create, load, save",
      },
      {
        label: "openpyxl styles",
        url: "https://openpyxl.readthedocs.io/en/stable/styles.html",
        note: "fuentes, fills, borders",
      },
      {
        label: "openpyxl charts (opcional)",
        url: "https://openpyxl.readthedocs.io/en/stable/charts/introduction.html",
        note: "charts embebidos si el PNG de S19 no basta",
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
        note: "curso desplegado; sección Excel factory",
      },
      {
        label: "Awesome Python Learning",
        url: "https://github.com/skupriienko/Awesome-Python-Learning",
        note: "mapa de recursos",
      },
      {
        label: "Real Python — openpyxl",
        url: "https://realpython.com/openpyxl-excel-spreadsheets-python/",
        note: "guía práctica de workbooks (load/save/estilos)",
      },
      {
        label: "deeplearning.ai — Data Engineering (concepts)",
        url: "https://www.deeplearning.ai/specializations/data-engineering",
        note: "pipelines de entrega; adaptar a Excel local",
      },
    ],
  },
}
