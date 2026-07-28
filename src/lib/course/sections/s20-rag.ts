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
    "En finanzas, operaciones y reporting en Perú, **Excel sigue siendo el contrato de entrega**: el VP (vicepresidencia o área de negocio) abre un `.xlsx`, no un notebook. Un analista o data engineer que automatiza plantillas con **openpyxl** — sin dañar el master, con totales que cuadran y un **manifest** (JSON de auditoría de la corrida) — es quien cierra el mes a tiempo en bancos, cajas y retailers. Aquí construyes ese **excel factory**: lees plantillas sintéticas, escribes el workbook de resultados, concilias y dejas rastro auditable, sin PII real. El incremento alimenta el paquete de reporting de CP-N2-B y el empaquetado de S21.",
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
        "Esta sección es **automatización robusta de Excel** con openpyxl: un reporting factory que manipula hojas, celdas, fórmulas vs. valores, estilos, conciliación, validación estructural, batch e idempotencia. El objetivo no es “hacer un xlsx bonito”, sino entregar un artefacto auditable que un VP de finanzas u operaciones pueda abrir mañana sin sorpresas.",
        "**Diccionario de la sección** (léelo una vez; el resto lo usa). **Plantilla master** (plantilla maestra): xlsx de referencia que no se sobrescribe. **Celda ancla:** esquina superior izquierda de un merge (ahí vive el valor). **Valor materializado:** número ya calculado en Python y escrito a la celda (no dependes de Excel para evaluarlo). **Conciliación:** comparar totales/n del Excel de salida vs. el DataFrame fuente. **Fail-closed:** si la conciliación falla, no emites el paquete. **Manifest** (manifiesto): JSON con estados de batch, `reconcile_ok`, backup (respaldo) y hashes. **Idempotencia:** misma entrada + misma versión de script → mismo resultado lógico (sin filas fantasma). **Cuarentena:** aislar un archivo corrupto sin tumbar el lote.",
        "Hilo del caso: workbook (libro de Excel) sintético `cpn2b_factory.xlsx` con hojas canónicas **Entrada** (datos crudos) y **Salida** (KPIs materializados); opcionalmente **Datos** como staging intermedio. Regiones Lima/Cusco/Arequipa y montos PEN. Una corrida debe ser reejecutable sin corromper plantillas ni inventar filas. Nunca PII real en celdas.",
        "Orden de aprendizaje: **T1 Modelo de libro** (sheets, celdas, encabezados; fórmulas vs. valores materializados) → **T2 Presentación** (estilos, plantillas copy→save, fechas ISO, merges) → **T3 Calidad** (conciliación, pivots lógicos, validación, preservación) → **T4 Operación** (batch, corruptos/locks, backups, idempotencia, tests estructurales). Prerrequisitos S17–S19. Cierra hacia el paquete de reportes de S21 y el gate (control de calidad) CP-N2-B.",
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
        "Un libro de Excel es un grafo de **hojas + celdas + encabezados**. Nombra hojas de forma estable (`Entrada`, `Datos`, `Salida`); evita “Hoja1” en el entregable. Los encabezados de la fila 1 anclan lecturas programáticas (`iter_rows`) y la conciliación posterior. Si el negocio habla de “tablas” o “named ranges”, en este tramo usamos el equivalente práctico: headers fijos + sheetnames contractuales — el mismo contrato que un schema de API, solo que el “endpoint” es un archivo que el VP abre en Excel.",
        "Contrato operativo: crear workbook, set `title`, escribir encabezados, `append` filas, listar `sheetnames`. El control de calidad del factory verifica presencia de hojas requeridas y el encabezado `region` antes de cualquier KPI. Si falta una hoja, abortas con mensaje claro al manifest — no improvisas un sheet vacío en silencio. Esa disciplina es lo que separa un script de laboratorio de un factory que sobrevive al cierre de mes.",
        "Caso sintético Lima: `ws.title='Entrada'`, A1=`region`, B1=`monto`; segunda hoja `Salida`. Los conteos de filas de datos (sin header) alimentan la conciliación con el dashboard de S19 (mismos n). En un banco o equipo de operaciones peruano, el primer bug típico es renombrar “Entrada” a “Input_v2” y romper tres scripts ajenos. Cuando la pestaña *Hago yo* te muestre `sheetnames`, fíjate que el orden y los nombres son parte del contrato, no decoración.",
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
      heading: "Fórmulas vs. valores materializados",
      subtopicId: "S20-T1-B",
      paragraphs: [
        "Las **fórmulas** viven en la celda como texto (`=SUM(B2:B10)`); los **valores cacheados** son lo que Excel dejó calculado la última vez que abrió el archivo. openpyxl no incluye un motor de Excel: no “resuelve” una fórmula recién escrita solo porque la leas con `data_only=True` en el mismo proceso. Esa bandera lee el cache guardado, no ejecuta el motor. En CI (integración continua) Linux no hay Excel: si tu assert depende de un cache ajeno, el pipeline se vuelve no determinista y el “pasa en mi laptop” regresa.",
        "Contrato didáctico: separa “escribir fórmula para el humano en Excel” de “assert de valor de negocio en el factory”. Para asserts de KPI en el curso y en producción headless, escribe **valores materializados** (calculados en pandas/Python) o documenta la dependencia del motor. Nunca digas “el número está bien porque la fórmula se ve bien”: el auditor del factory mira el número materializado, no la estética de la fórmula.",
        "Caso: celda `=SUM(B2:B10)` vs. valor 120 precalculado en Python. El factory de CP-N2-B prefiere materializar métricas ya validadas en pandas y copiar el número a la hoja `Salida` — así S21 recibe un artefacto que no necesita reabrirse en Excel para auditar. Si el VP insiste en ver la fórmula en una celda de presentación, puedes dejarla; pero el gate de calidad del curso y del CI se apoya en el valor Python.",
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
        "Estilos (fuentes, fills, borders) y plantillas reutilizables dan pinta ejecutiva — pero el **contrato de datos** manda sobre el formato. No rompas encabezados al embellecer. Los charts embebidos de Excel son opcionales si el PNG de S19 ya cubre el insight; en este tramo priorizamos estilos + **plantilla intocable** (el master es el contrato visual del VP, no un borrador).",
        "Contrato de plantilla: **copia** el master a un path de salida (`shutil.copy`), abre con `load_workbook`, escribe solo rangos de datos, y `wb.save(out)`. Nunca escribas sobre el master sin backup. Estilos solo en rangos de presentación; datos crudos en `Entrada` sin merges que impidan `iter_rows`. Si guardas in-place sobre el master, la siguiente corrida arranca con datos de ayer mezclados con los de hoy.",
        "Caso sintético: plantilla con fila 1 de encabezados fijos y color corporativo `1F4E79`; el script rellena filas de detalle y deja el master intacto. El diff estructural del xlsx de salida debe ser predecible entre corridas. En la pestaña *Hago yo* verás el patrón completo copy→load→write→save; en *Hacemos juntos* T2-A-E3 lo repites tú.",
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
        "Fechas y locales: serializa fechas **ISO** (`YYYY-MM-DD`) o `datetime` documentado; no dependas del locale del SO del alumno para parsear “03/04/24” (¿marzo o abril?). Las celdas combinadas (**merges**) son trampas de lectura automatizada: el valor vive en la **celda ancla** (top-left del rango); las demás del merge leen `None`. Si el script necesita escribir y la hoja está bloqueada por el SO o por otro usuario, falla con mensaje claro al manifest — no silencies el error.",
        "Contrato: evita merges en rangos de datos; si la plantilla legacy los trae, lee el valor de la celda ancla y documenta. En este tramo practicamos fechas ISO + merges; la política de “fallar claro” se reutiliza en T4 con locks y corruptos. Un merge de presentación en la portada está bien; un merge sobre filas de detalle rompe el factory.",
        "Caso: corte `2024-06-30` en celda de metadata; región en columna A sin merge. El data note del factory repite el corte — alineado a S18. Si alguien mergea A2:A100 “para que se vea lindo”, `iter_rows` y la conciliación se vuelven frágiles y el VP no entiende por qué “desaparecieron” montos en la columna C.",
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
        "**Conciliación**: los totales del Excel de salida deben cuadrar con los del DataFrame fuente (suma de montos, n de filas). Es el control de calidad que protege la credibilidad del reporting: sin él, un total de portada “optimista” puede viajar a gerencia. Los pivots en Excel son para el usuario final; el script puede **materializar el pivot** ya calculado en pandas (`groupby`) y pegarlo en `Salida`. Así el VP ve la tabla y el factory tiene un número auditable.",
        "Contrato: `assert abs(sum_xlsx - sum_df) < tol` y `n_xlsx == n_df`. Si no cuadra, **fail-closed** (no emitas el paquete a S21). Documenta tolerancia de redondeo (típico: 0.01 para 2 decimales PEN). Un total “casi igual” sin tolerancia documentada es una discusión de fin de mes, no un gate de calidad. El resultado de la conciliación vive en el manifest (`reconcile_ok`), no solo en un print de consola.",
        "Caso: df montos 10+5+7 vs. portada 22.0; pivot región→suma (`Lima` 15, `Cusco` 7). El gate imprime `reconcile True` solo si ambos lados coinciden. En operaciones peruanas, este control evita enviar a gerencia un Excel con portada inflada y detalle incompleto — el error típico de “sumé a mano en la portada y olvidé una región”.",
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
        "Caso sintético: el contrato exige `need = {'Entrada','Salida'}`. Si falta `Salida`, `structural_ok` es False y **no** se genera el zip del reporting package hacia S21. Región “Piura” fuera de allowlist → abort con lista de violators en el manifest, no un email vago. En un equipo de operaciones en Arequipa, este fail-fast evita rehacer el paquete a las 23:00 porque alguien renombró una hoja “para que se entienda mejor”.",
      ],
      code: {
        language: 'python',
        title: "structure.py",
        code: `def s20_th_6():
    expected = ["region", "monto", "n"]
    headers = ["region", "monto", "n"]
    print("structure_ok", headers == expected)
    # validación de dominio (allowlist)
    regiones = {"Lima", "Arequipa", "Cusco"}
    row = {"region": "Piura", "monto": 10.0}
    print("domain_ok", row["region"] in regiones)

s20_th_6()`,
        output: `structure_ok True
domain_ok False`,
      },
      callout: {
        type: "tip",
        title: "Fail-fast en headers y dominios",
        content:
          "Si el header no coincide o una región sale de la allowlist (`domain_ok False`), aborta con mensaje claro al manifest. No “arregles” silenciosamente el orden de columnas ni inventes regiones.",
      },
    },
    {
      heading: "Batch, archivos corruptos y locks",
      subtopicId: "S20-T4-A",
      paragraphs: [
        "Batch de muchos xlsx: itera paths, captura corruptos (`BadZipFile` — un xlsx es un zip; si el contenedor está roto, openpyxl no puede abrirlo), respeta locks de archivo ajenos (no crashear el pipeline entero). Un archivo malo se aísla; el resto continúa con resumen de errores.",
        "Contrato operativo: contadores `ok` / `skip_corrupt` / `skip_locked`; log de paths sintéticos. Timeout y tamaño máximo por archivo evitan un DoS accidental (denegación de servicio por carpeta enorme o archivo de 2 GB). El summary JSON alimenta el audit del factory.",
        "Caso didáctico: tres paths → `ok=1`, `corrupt=1`, `locked=1`. En una carpeta compartida de finanzas, el archivo “abierto por el contador” (lock) no debe tumbar el lote de la noche: se marca `locked`, se registra el path sintético y el resto del batch sigue. El corrupt se mueve a cuarentena con su nombre en el log; el auditor mira primero el `ok_count` del summary.",
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
        "Caso: `dig(rows)` ordena filas antes de hashear; la segunda corrida con la misma entrada y la misma versión de script no agrega filas fantasma ni cambia `input_sha1_8`. Si re-ejecutar duplica el detalle, el factory no es de confianza para cierre de mes. Cierra el tramo Excel hacia documentos y empaquetado de S21 con un manifest que el revisor de CP-N2-B pueda abrir en 30 segundos.",
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
    intro: "Te demuestro el excel factory de punta a punta. Verás sheets canónicos Entrada/Salida, fórmulas vs. valores materializados en Python y plantilla intocable (copy→load→save). Luego fechas y merges, conciliación fail-closed, batch con BadZipFile/locks y manifest de auditoría. Observa el patrón; en *Hacemos juntos* lo repites a pedazos; en *Tú haces* lo ensamblas.",
    steps: [
      {
        demoId: "S20-T1-A-DEMO",
        subtopicId: "S20-T1-A",
        environment: "local-python",
        description: "Crear sheets canónicos Entrada/Salida y escribir celdas con openpyxl",
        preamble:
          "El excel factory del VP exige nombres de hoja estables: `Entrada` para el detalle y `Salida` para los KPIs. En esta demo creas ambos, escribes filas sintéticas Lima/Cusco y materializas `n_filas` en `Salida`. No escribas aún; predice `sheetnames`, el entero `n` y el valor de A2 antes de mirar la salida. Si dejas la hoja como `Sheet`, tres scripts ajenos rompen en el cierre de mes.",
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
        why:
          "Los headers de la fila 1 anclan `iter_rows` y la conciliación posterior. `n_filas = max_row - 1` es el mismo conteo que usará el gate con el dashboard de S19. Mapa de hojas estable (`Entrada`/`Salida`) es el primer contrato del adaptador: sin nombres canónicos, el resto del factory no sabe dónde leer ni materializar. Nunca improvises un sheet vacío en silencio si falta `Salida`. En *Hacemos juntos* T1-A practicarás renombrar, append de filas y crear el par canónico.",
        retrospective:
          "Si puedes explicar por qué `['Entrada', 'Salida']` es un contrato y no decoración, ya tienes el hábito de sheetnames canónicos. El error clásico es renombrar a “Input_v2” y romper el factory. En *Hacemos juntos* practicarás renombrar A1, append de filas y crear el par Entrada/Salida.",
      },
      {
        demoId: "S20-T1-B-DEMO",
        subtopicId: "S20-T1-B",
        environment: "local-python",
        description: "Distinguir fórmula almacenada vs. suma calculada en Python",
        preamble:
          "En CI Linux no hay motor Excel: openpyxl no “resuelve” `=B1+B2` solo porque lo leas. En esta demo ves la fórmula como texto, el valor materializado en Python (25) y la desigualdad deliberada entre ambos. No escribas aún; predice las tres líneas de salida. El auditor del factory mira el número materializado, no la estética de la fórmula.",
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
        why:
          "`data_only=True` lee cache guardado, no ejecuta el motor. Para asserts de KPI en el curso y en producción headless, escribe valores Python en `Salida`. Puedes dejar la fórmula en celdas de presentación para el VP, pero el gate no depende de ella. El factory prefiere valores Python auditables: la fórmula es para el humano en Excel; el assert de CI mira el número materializado.",
        retrospective:
          "Fórmula = contrato visual para el humano en Excel; valor Python = contrato auditable del factory. El error clásico es “la fórmula se ve bien, el número está bien” en CI sin motor. Pregunta: ¿qué imprimiría `data_only` sobre una fórmula recién escrita sin cache? *Hacemos juntos*: escribir el string `=…`, materializar sumas y detectar celdas con prefijo `=`.",
      },
      {
        demoId: "S20-T2-A-DEMO",
        subtopicId: "S20-T2-A",
        environment: "local-python",
        description: "Copiar plantilla master, load_workbook, estilizar y guardar en path de salida",
        preamble:
          "El master `cpn2b_factory.xlsx` es el contrato visual del VP: no se sobrescribe. En esta demo se copia a `out/results.xlsx`, se estiliza el header corporativo y se escribe Lima 28.0 solo en la copia. Observa las dos líneas de salida: nombre de archivo, master intacto y bold del header. Predice qué pasaría si `save` apuntara al master: la siguiente corrida arrancaría con datos de ayer.",
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
        why:
          "El flujo es `shutil.copy` → `load_workbook(out)` → escribir rangos de datos → `wb.save(out)`. Estilos solo en presentación; datos crudos sin merges que impidan `iter_rows`. El bool `master.exists()` es evidencia mínima de plantilla intocable para el manifest. Copy → load → write → save deja el master intacto y materializa el estilo en la salida.",
        retrospective:
          "Copy → load → write → save es el esqueleto del excel factory: el master del VP no es borrador de trabajo. El error clásico es `save` in-place y mezclar datos de ayer con los de hoy. Pregunta: ¿qué evidencia mínima prueba plantilla intocable? *Hacemos juntos*: bold, fill corporativo `1F4E79` y el flujo completo en directorio temporal.",
      },
      {
        demoId: "S20-T2-B-DEMO",
        subtopicId: "S20-T2-B",
        environment: "local-python",
        description: "Escribir fecha ISO y respetar celda combinada (ancla)",
        preamble:
          "Las fechas ambiguas por locale rompen pipelines entre laptops; aquí se usa `date(2024, 6, 30)` e `isoformat()`. Además un merge de presentación: el valor vive solo en la celda ancla B1; D1 lee `None`. Observa las tres líneas antes de copiar el patrón. Un merge sobre filas de detalle (no solo portada) rompe `iter_rows` y la conciliación.",
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
        why:
          "Serializa ISO o `datetime` documentado; merges solo en presentación; lee y escribe siempre en la celda ancla (top-left). Fechas ISO y merges con lectura en ancla: así no rompes el layout del VP ni lees `None` donde creías ver un valor. No silencies errores de archivo bloqueado (se reutiliza en T4).",
        retrospective:
          "ISO evita “¿marzo o abril?” entre laptops; ancla = top-left del merge. El error clásico es leer C1/D1 y creer que el valor “desapareció”. Pregunta: ¿dónde escribes si el merge es B1:D1? *Hacemos juntos*: fecha en metadata, valor de no-ancla y conteo de rangos merged.",
      },
      {
        demoId: "S20-T3-A-DEMO",
        subtopicId: "S20-T3-A",
        environment: "local-python",
        description: "Conciliar total de portada con detalle y pivot por región",
        preamble:
          "Un total de portada que no cuadra con el detalle es el error típico de cierre de mes. Aquí el detalle Lima/Lima/Arequipa/Cusco suma 35.5 y el pivot materializa sumas por región. Observa el dict del pivot y el booleano `reconcile True`. Sin este control, el paquete viaja a S21 con números “optimistas”.",
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
        why:
          "`abs(sum_det - portada) < tol` con tol típica 0.01 PEN es el assert de credibilidad. El pivot en Excel es para el humano; el factory pega el groupby ya calculado. Conciliación es el control de calidad del workbook: totales y n deben cuadrar antes de emitir el paquete. El resultado vive también en el manifest (`reconcile_ok`).",
        retrospective:
          "Conciliar n y montos es el quality gate del workbook: sin él, la portada “optimista” viaja a gerencia. El error clásico es sumar a mano la portada y olvidar una región. Pregunta: ¿dónde vive `reconcile_ok` además del print? *Hacemos juntos*: corregir portada desde celdas, groupby sum y función `reconcile` con tolerancia.",
      },
      {
        demoId: "S20-T3-B-DEMO",
        subtopicId: "S20-T3-B",
        environment: "local-python",
        description: "Validar headers y dominio de región antes de escribir salida",
        preamble:
          "Headers exactos y dominios de región son el schema del workbook del VP. En esta demo los headers coinciden, pero Piura e Ica no están en la allowlist Lima/Cusco/Arequipa: se listan violators y se aborta. Observa las tres líneas. Un `structural_ok False` debe ir al manifest, no solo a un print fugaz.",
        code: {
          language: 'python',
          title: "demo_validate.py",
          code: `def s20_ido_6():
    expected = ["region", "monto", "n"]
    got = ["region", "monto", "n"]
    allowed = {"Lima", "Cusco", "Arequipa"}
    rows = [
        {"region": "Piura", "monto": 1.0, "n": 1},
        {"region": "Ica", "monto": 1.0, "n": 1},
    ]
    print("headers_ok", got == expected)
    bad = [r for r in rows if r["region"] not in allowed]
    print("bad_regions", [r["region"] for r in bad])
    print("abort", len(bad) > 0)

s20_ido_6()`,
          output: `headers_ok True
bad_regions ['Piura', 'Ica']
abort True`,
        },
        why:
          "Fail-fast en headers y dominios evita rehacer el paquete a medianoche. No “arregles” en silencio el orden de columnas ni inventes regiones. La lista de violators es evidencia auditable. Fail fast preserva la estructura contractual del VP antes de materializar `Salida`.",
        retrospective:
          "Primero headers, luego dominio, luego escritura. El error clásico es “arreglar” en silencio el orden de columnas o inventar regiones para no abortar. Pregunta: ¿qué debe ir al manifest si `abort` es True? *Hacemos juntos*: completar header en hoja, filtrar violators y función `validate_rows`.",
      },
      {
        demoId: "S20-T4-A-DEMO",
        subtopicId: "S20-T4-A",
        environment: "local-python",
        description: "Batch con try/except: BadZipFile (corrupt) y PermissionError (lock)",
        preamble:
          "En una carpeta compartida de finanzas, un xlsx corrupto o bloqueado no debe tumbar el batch nocturno. Esta demo clasifica ok/corrupt/locked y resume conteos: 2 ok, 1 corrupt, 1 locked. Observa el dict por path y el summary. El auditor mira primero `ok_count`; el corrupt va a cuarentena con su nombre en el log.",
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
        why:
          "`BadZipFile` aparece porque xlsx es un zip; `PermissionError` señala lock. El lote continúa: un corrupto o un archivo en uso no tumba el batch. Contadores alimentan el summary JSON del factory; corruptos y locks quedan nombrados en el log de cuarentena.",
        retrospective:
          "Aislar fallos, no abortar todo el lote: un corrupt o lock no tumba la noche del cierre. El error clásico es dejar que una excepción sin capturar mate el proceso. Pregunta: ¿qué mira primero el auditor en el summary? *Hacemos juntos*: `ok_count`, `classify` con try/except y Counter del summary.",
      },
      {
        demoId: "S20-T4-B-DEMO",
        subtopicId: "S20-T4-B",
        environment: "local-python",
        description: "Escritura idempotente con backup lógico y tests estructurales",
        preamble:
          "El manifest es la evidencia de la corrida: hash de entrada, sheets, flag de idempotencia, backup y tests estructurales. Aquí dos corridas lógicas con filas en distinto orden producen el mismo payload canónico (`idempotent: true`). Observa el JSON. Sin este artefacto, el revisor de CP-N2-B no cierra el excel factory hacia S21.",
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
        why:
          "Orden canónico de filas antes de hashear; backup path versionado; tests `has_header` / `n_data` sin abrir Excel GUI. Idempotencia + backup + tests estructurales + manifest cierran el excel factory listo para CP-N2-B. El JSON es obligatorio en el checklist de entrega.",
        retrospective:
          "Idempotencia + backup + tests + manifest cierran el factory hacia S21. El error clásico es hashear filas sin orden canónico y creer que “cambió el negocio” en un re-run. Pregunta: ¿qué flag del JSON defiende que el master no se tocó? *Hacemos juntos*: armar el dict mínimo, dig orden-invariante y `structural_ok` como superset.",
      }
    ],
  },
  weDo: {
    intro: "24 ejercicios en cascada guiado → independiente → transferencia. Cada uno completa un eslabón del factory: hojas y headers (T1-A), fórmulas vs. materialización (T1-B), estilos y plantilla copy→save (T2-A), fechas/merges (T2-B). Siguen conciliación y pivots (T3-A), validación estructural (T3-B), batch con excepciones (T4-A) y backup/idempotencia/manifest (T4-B). Cuando termines, *Tú haces* une todos los eslabones sin dañar el master.",
    steps: [
      {
        id: "S20-T1-A-E1",
        subtopicId: "S20-T1-A",
        kind: "guided",
        title: "Renombrar hoja a Entrada y anclar header",
        preamble:
          "- **Contexto:** sin hoja `Entrada` y sin header `region` en A1, el factory no sabe dónde leer el detalle del VP.\n- **Meta:** renombrar la hoja activa y escribir el encabezado contractual.\n- **Éxito:** dos líneas exactas: `['Entrada']` y `region`.\n- **Límites:** no crees aún `Salida`; no uses nombres con espacios; imprime solo sheetnames y A1.",
        instruction:
          "1. Revisa el starter: imprime la hoja default y A1 vacío (bug).\n2. Asigna `ws.title = \"Entrada\"`.\n3. Escribe `ws[\"A1\"] = \"region\"`.\n4. Imprime `wb.sheetnames` y luego `ws[\"A1\"].value`.",
        hint: "ws.title = \"Entrada\" y ws[\"A1\"] = \"region\".",
        hints: [
          "ws.title = \"Entrada\" y ws[\"A1\"] = \"region\".",
          "from openpyxl import Workbook; imprime sheetnames y A1.",
        ],
        edgeCases: ["nombre con espacios"],
        tests: "salida coincide con solution output",
        feedback:
          "Si ves `['Sheet']` (o similar), te faltó renombrar a `Entrada`. Si A1 es `None`, falta el header `region`: sin él el factory no ancla lecturas ni conciliación.",
        retrospective:
          "Nombre de hoja + header de fila 1 son el “schema” del xlsx: sin `Entrada` y `region`, el factory no ancla lecturas ni conciliación. El error clásico es confiar en “la primera columna” sin nombre. Pregunta: si A1 sigue `None`, ¿qué falla después al contar filas? Siguiente (E2): append de header + fila y medir `max_row`.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# sheet title + A1
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
        title: "Append de header y fila; medir max_row",
        preamble:
          "- **Contexto:** el gate de conciliación necesita saber cuántas filas de detalle hay; `max_row` es el primer contador del sheet.\n- **Meta:** cargar header + una fila con `append` y reportar `max_row`.\n- **Éxito:** un solo entero `2` (header + Lima 10.0).\n- **Límites:** no borres el header; no imprimas texto extra; no uses `iter_rows` todavía.",
        instruction:
          "1. Abre el starter: imprime `max_row` sin filas útiles.\n2. Haz `ws.append([\"region\", \"monto\"])`.\n3. Haz `ws.append([\"Lima\", 10.0])`.\n4. Imprime solo `ws.max_row`.",
        hint: "ws.append dos veces; max_row cuenta header + datos.",
        hints: [
          "ws.append([\"region\", \"monto\"]) y luego la fila [\"Lima\", 10.0].",
          "max_row incluye la fila de encabezado.",
        ],
        edgeCases: ["filas vacías"],
        tests: "salida coincide con solution output",
        feedback:
          "Si max_row es 1, solo existe la hoja con un append (o ninguna fila útil). Necesitas header + 1 fila de datos → max_row 2. Ese n alimenta la conciliación del factory.",
        retrospective:
          "`max_row` incluye la fila de encabezado: datos de negocio = `max_row - 1`. Ese `n` reaparece en `Salida` y en el manifest. El error clásico es imprimir 1 y creer que “no hay filas” cuando solo falta el append de datos. Pregunta: con header + 3 regiones, ¿qué imprime `max_row`? Luego (E3) fijarás el par canónico `Entrada`/`Salida`.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Ejercicio S20-T1-A-E2 · append rows
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
        title: "Sheetnames canónicos Entrada y Salida",
        preamble:
          "- **Contexto:** el contrato mínimo del factory es `Entrada` + `Salida`; el resto del pipeline busca esos nombres, no “Hoja1”.\n- **Meta:** renombrar la activa y crear la segunda hoja contractual.\n- **Éxito:** una línea `['Entrada', 'Salida']`.\n- **Límites:** no renombres a Input/Output; no dupliques nombres; imprime solo `sheetnames`.",
        instruction:
          "1. Lee el starter: solo existe la hoja default.\n2. Renombra `wb.active.title = \"Entrada\"`.\n3. Crea `wb.create_sheet(\"Salida\")`.\n4. Imprime `wb.sheetnames`.",
        hint: "create_sheet(\"Salida\") después de renombrar active.",
        hints: [
          "Renombra la hoja activa primero.",
          "Luego crea la segunda hoja contractual.",
        ],
        edgeCases: ["duplicar nombre"],
        tests: "salida coincide con solution output",
        feedback:
          "El orden típico es `['Entrada', 'Salida']` si creas `Salida` después del rename. Sin esos nombres el auditor no encuentra el detalle ni los KPIs — y un script ajeno del cierre de mes rompe en silencio.",
        retrospective:
          "El orden típico nace de “renombrar primero, crear después”. Pregunta de cierre: ¿qué rompe un script si alguien deja `Sheet` y crea `Salida`? Puente a T1-B: fórmulas vs. valores materializados en esas hojas.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# create_sheet
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
        title: "Escribir fórmula como string en A3",
        preamble:
          "- **Contexto:** a veces el VP quiere ver `=A1+A2` en la celda; el factory debe escribirla como texto, no como resultado.\n- **Meta:** almacenar una fórmula real (string con prefijo `=`) y detectarla.\n- **Éxito:** un booleano `True` (A3 empieza con `=`).\n- **Límites:** no asignes el número 0 ni la suma; no uses `data_only`.",
        instruction:
          "1. Abre el starter: A3 es `0` y el print da False.\n2. Reemplaza por `ws[\"A3\"] = \"=A1+A2\"`.\n3. Imprime `str(ws[\"A3\"].value).startswith(\"=\")`.\n4. No calcules el resultado en la celda.",
        hint: "ws[\"A3\"] = \"=A1+A2\"; luego str(...).startswith(\"=\").",
        hints: [
          "Asigna el string de fórmula, no un número.",
          "startswith(\"=\") debe ser True.",
        ],
        edgeCases: ["valor cacheado"],
        tests: "salida coincide con solution output",
        feedback:
          "Si imprimiste False, A3 sigue siendo numérico o vacío: la fórmula debe ser el string `=A1+A2`, no el resultado 0. El VP ve la fórmula; el CI no la evalúa.",
        retrospective:
          "La fórmula vive como string con prefijo `=`; el número 0 en la celda no es “fórmula vacía”. El VP puede ver `=A1+A2`; el CI no la evalúa. Pregunta: si lees A3 con openpyxl, ¿obtienes 15 o el texto de la fórmula? Siguiente (E2): materializar la suma en Python sin depender de Excel.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# formula string
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
        title: "Materializar suma de celdas en Python",
        preamble:
          "- **Contexto:** el assert de KPI del factory se apoya en números ya calculados en Python, no en cache de Excel.\n- **Meta:** asignar A1=3, A2=4 y materializar la suma leyendo `.value`.\n- **Éxito:** un entero `7`.\n- **Límites:** no uses `data_only`; no escribas fórmula en esta tarea; imprime solo el número.",
        instruction:
          "1. El starter suma celdas vacías con `or 0` → sale 0.\n2. Asigna enteros a A1 y A2.\n3. Imprime `ws[\"A1\"].value + ws[\"A2\"].value`.\n4. No abras el archivo con `data_only=True`.",
        hint: "Suma ws[\"A1\"].value + ws[\"A2\"].value tras asignar.",
        hints: [
          "No uses data_only aquí.",
          "Asigna enteros y súmalos en Python.",
        ],
        edgeCases: ["None en celdas"],
        tests: "salida coincide con solution output",
        feedback:
          "Si sale 0, no asignaste A1=3 y A2=4 antes de sumar. Materializar es leer `.value` numéricos en Python, no `data_only`: en CI no hay motor Excel.",
        retrospective:
          "Materializar = calcular en Python y (en el factory) volcar el número a `Salida`. El error clásico es creer que openpyxl “ya sumó” la fórmula. Pregunta: ¿por qué `data_only=True` no resuelve esto en CI Linux? Luego (E3) un predicado `es_formula` reutilizable.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# cell values sum
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
        title: "Predicado es_formula por tipo y prefijo",
        preamble:
          "- **Contexto:** antes de confiar en un KPI, el factory distingue celdas-fórmula de celdas-número.\n- **Meta:** implementar `es_formula(v)` con tipo + prefijo `=`.\n- **Éxito:** dos líneas: `True` para `\"=A1\"` y `False` para `3`.\n- **Límites:** no devuelvas siempre True; no trates un int como fórmula aunque “parezca suma”.",
        instruction:
          "1. Lee el DEFECT: `return True` siempre.\n2. Devuelve `isinstance(v, str) and v.startswith(\"=\")`.\n3. Imprime el resultado para `\"=A1\"` y para `3`.\n4. No normalices espacios en este ejercicio.",
        hint: "Revisa tipo string y prefijo `=` (un int nunca es fórmula).",
        hints: [
          "Revisa tipo string y prefijo `=` (un int nunca es fórmula).",
          "Dos prints: uno por cada entrada; los números no son fórmulas.",
        ],
        edgeCases: ["espacios antes de ="],
        tests: "salida coincide con solution output",
        feedback:
          "Si ambos son True, tu predicado no distingue tipos: un número nunca es fórmula. Si el segundo es True, te falta `isinstance(v, str)`. Sin este check el factory confunde presentación con KPI.",
        retrospective:
          "Un número nunca es fórmula. Pregunta de cierre: ¿qué harías con `\" =A1\"` (espacio antes)? Puente a T2-A: estilos y plantilla intocable, donde el valor de negocio sigue siendo el número materializado.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# es_formula
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
        title: "Header en negrita con Font bold",
        preamble:
          "- **Contexto:** el header de la plantilla del VP se lee en negrita; el estilo vive en la celda, no en el workbook.\n- **Meta:** escribir “KPI” en A1 y aplicar `Font(bold=True)`.\n- **Éxito:** un booleano `True` (`ws[\"A1\"].font.bold`).\n- **Límites:** no cambies el texto a otro valor; no apliques fill aún.",
        instruction:
          "1. El starter imprime bold falso/None.\n2. Tras escribir “KPI”, asigna `ws[\"A1\"].font = Font(bold=True)`.\n3. Imprime `ws[\"A1\"].font.bold`.\n4. No reasignes A1 después del font.",
        hint: "from openpyxl.styles import Font; ws[\"A1\"].font = Font(bold=True).",
        hints: [
          "Font(bold=True).",
          "Asigna el font a la celda después de escribir el texto.",
        ],
        edgeCases: ["estilo None"],
        tests: "salida coincide con solution output",
        feedback:
          "Si es False/None, no asignaste `Font(bold=True)` a la celda después de escribir KPI. El estilo vive en la celda, no en el workbook: el VP reconoce el header ejecutivo por negrita.",
        retrospective:
          "El estilo se adjunta a la celda **después** del valor; el workbook no tiene un “bold global”. El error clásico es reasignar A1 y perder el `Font`. Pregunta: si `font.bold` es None, ¿qué faltó? Siguiente (E2): color corporativo `1F4E79` con PatternFill — el fill por defecto no basta.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# bold font
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
        title: "Fill corporativo 1F4E79 en el header",
        preamble:
          "- **Contexto:** el azul `1F4E79` es el color de encabezado de la plantilla; el fill por defecto de openpyxl no lo trae.\n- **Meta:** aplicar `PatternFill(\"solid\", fgColor=\"1F4E79\")` y validar el RGB.\n- **Éxito:** un booleano `True` (rgb termina en `1F4E79`).\n- **Límites:** no basta `fgColor is not None`; no uses theme color genérico.",
        instruction:
          "1. El starter lee el fill default y falla el endswith.\n2. Asigna el PatternFill solid con fgColor corporativo.\n3. Lee `ws[\"A1\"].fill.fgColor.rgb`.\n4. Imprime la comparación con endswith `\"1F4E79\"`.",
        hint: "Aplica PatternFill solid con el color corporativo y valida el RGB.",
        hints: [
          "from openpyxl.styles import PatternFill.",
          "Comprueba que el rgb termine en el color de plantilla del master.",
        ],
        edgeCases: ["color theme vs. rgb", "fill por defecto sin RGB corporativo"],
        tests: "salida coincide con solution output",
        feedback:
          "El fill por defecto a menudo tiene fgColor no nulo: no basta `is not None`. Debes aplicar el PatternFill `1F4E79` y comprobar el RGB — el color es parte del contrato visual del master.",
        retrospective:
          "Validar el RGB evita “se ve azul en mi laptop” sin contrato con el master. El fill default a menudo no es None: `is not None` no es un gate. Pregunta: ¿por qué theme color genérico falla el endswith? Luego (E3) plantilla intocable: copiar master, escribir en la copia, dejar master vivo.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Ejercicio S20-T2-A-E2 · fill corporativo
# Pista: aplica PatternFill solid 1F4E79 y valida el RGB (el fill por defecto NO basta)
from openpyxl import Workbook
from openpyxl.styles import PatternFill
wb = Workbook()
ws = wb.active
rgb = getattr(ws["A1"].fill.fgColor, "rgb", None)
print(rgb is not None and str(rgb).endswith("1F4E79"))`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from openpyxl import Workbook
from openpyxl.styles import PatternFill
wb = Workbook()
ws = wb.active
ws["A1"].fill = PatternFill("solid", fgColor="1F4E79")
rgb = ws["A1"].fill.fgColor.rgb
print(rgb is not None and str(rgb).endswith("1F4E79"))`,
          output: `True`,
        },
      },
      {
        id: "S20-T2-A-E3",
        subtopicId: "S20-T2-A",
        kind: "transfer",
        title: "Plantilla intocable: copy, load, save",
        preamble:
          "- **Contexto:** el master del factory no se toca; todo el trabajo va a `out/results.xlsx`.\n- **Meta:** copiar master, abrir la **copia**, escribir A2=`Lima`, guardar y probar que el master sigue existiendo.\n- **Éxito:** dos líneas: `results.xlsx` y `True`.\n- **Límites:** nunca `save` sobre el master; no omitas `shutil.copy`; no inventes otro path de salida.",
        instruction:
          "1. El starter intenta `load_workbook(out)` sin copiar → `no_output` / False.\n2. Tras crear `out`, haz `shutil.copy(master, out)`.\n3. `load_workbook(out)`, escribe A2=`\"Lima\"`, `wb.save(out)`.\n4. Imprime `out.name` y `master.exists() and A2 == \"Lima\"`.",
        hint: "Copia el master, abre la copia, escribe y guarda solo en out.",
        hints: [
          "Copia master → out antes de load_workbook.",
          "Nunca sobrescribas el master in-place; imprime out.name y la prueba master+A2.",
        ],
        edgeCases: ["guardar sobre el master", "out sin mkdir", "copiar sin escribir A2"],
        tests: "salida coincide con solution output",
        feedback:
          "Si la segunda línea es False, no copiaste, no escribiste A2=`Lima`, o dañaste el master. Si ves `no_output`, load falló porque out no existe. El master es el contrato del VP, no un borrador.",
        retrospective:
          "Copy → load → write → save deja el master intacto y materializa solo en `out/`. Este es el esqueleto del *Tú haces*: sin `shutil.copy`, el contrato visual del VP se corrompe en la primera corrida. Pregunta: ¿qué imprime el starter si out no existe? Puente a T2-B: fechas ISO y merges sin romper el layout de la plantilla.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Ejercicio S20-T2-A-E3 · template copy→load→save
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
        title: "Fecha de corte como date ISO",
        preamble:
          "- **Contexto:** el data note del factory repite el corte de mes en metadata; un string no es un `date`.\n- **Meta:** escribir `date(2024, 1, 15)` y serializar con `isoformat()`.\n- **Éxito:** una línea `2024-01-15`.\n- **Límites:** no dejes el string en A1; no uses locale del SO.",
        instruction:
          "1. El starter asigna el string y no garantiza `isoformat` real.\n2. Asigna `date(2024, 1, 15)` a A1.\n3. Imprime `ws[\"A1\"].value.isoformat()`.\n4. No formatees a mano con f-string.",
        hint: "from datetime import date; ws[\"A1\"] = date(2024, 1, 15).",
        hints: [
          "No uses un string; usa date real.",
          "value.isoformat() produce YYYY-MM-DD.",
        ],
        edgeCases: ["datetime vs. date"],
        tests: "salida coincide con solution output",
        feedback:
          "Si no hay `isoformat` de verdad, A1 sigue siendo str u otro tipo: asigna `date(2024, 1, 15)`, no el string `'2024-01-15'`. ISO evita ambigüedad de locale entre laptops del equipo.",
        retrospective:
          "`date` + `isoformat` = contrato portable del corte de mes en metadata. El error clásico es dejar un string que “se ve” ISO pero no es un objeto fecha. Pregunta: ¿qué pasa si el locale del SO parsea `03/04/24` distinto? Siguiente (E2): el valor del merge no vive en la celda no-ancla.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# date isoformat
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
        title: "Leer celda no-ancla de un merge",
        preamble:
          "- **Contexto:** automatizar merges sin mapear la ancla lee `None` donde el VP “ve” un valor.\n- **Meta:** mergear B1:C1, escribir en la ancla B1 e imprimir C1.\n- **Éxito:** una línea `None` (C1 no-ancla).\n- **Límites:** no escribas el valor en C1; no unmerges; el valor de negocio va en B1.",
        instruction:
          "1. Ya hay `merge_cells(\"B1:C1\")`.\n2. Escribe `ws[\"B1\"] = \"x\"`.\n3. Imprime `ws[\"C1\"].value` (debe ser None).\n4. No uses C1 como fuente de verdad.",
        hint: "El valor vive en B1; C1 del merge queda None.",
        hints: [
          "Escribe en la ancla (top-left del merge).",
          "Imprime el valor de la celda no-ancla.",
        ],
        edgeCases: ["escribir en no ancla"],
        tests: "salida coincide con solution output",
        feedback:
          "C1 (no ancla) debe ser None aunque B1 tenga valor: el valor del merge vive solo en la esquina top-left. Si lees no-ancla, el pipeline “pierde” montos.",
        retrospective:
          "Ancla = esquina superior izquierda del merge. Si lees no-ancla, el pipeline “pierde” montos aunque el VP “vea” un valor en pantalla. El error clásico es automatizar C1/D1 sin mapear B1. Pregunta: ¿escribir en C1 actualiza el merge visible? Luego (E3) contar cuántos bloques merged hay activos.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# merge value
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
        title: "Contar bloques merged activos",
        preamble:
          "- **Contexto:** antes de leer detalle, conviene saber cuántos merges de presentación hay; un merge sobre datos rompe el factory.\n- **Meta:** crear dos merges e imprimir cuántos rangos activos hay.\n- **Éxito:** un entero `2`.\n- **Límites:** no unmerges; no cuentes celdas sueltas, solo bloques.",
        instruction:
          "1. Ya existe merge A1:B1.\n2. Añade `ws.merge_cells(\"C1:D1\")`.\n3. Imprime `len(ws.merged_cells.ranges)`.\n4. Si sale 1, falta el segundo bloque.",
        hint: "ws.merge_cells dos veces; luego len(ws.merged_cells.ranges).",
        hints: [
          "Dos llamadas a merge_cells.",
          "No unmerges; solo cuenta rangos activos.",
        ],
        edgeCases: ["unmerge"],
        tests: "salida coincide con solution output",
        feedback:
          "Si sale 1, te faltó el segundo merge (C1:D1). `len(merged_cells.ranges)` cuenta bloques activos, no celdas sueltas. El factory inventaría este check antes de `iter_rows` en rangos de datos.",
        retrospective:
          "`len(ranges)` cuenta bloques, no celdas del merge. Pregunta: ¿qué pasa si alguien mergea A2:A100 “para que se vea lindo”? Puente a T3-A: conciliar totales y pivots lógicos.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# merged ranges count
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
        title: "Corregir portada para conciliar con detalle",
        preamble:
          "- **Contexto:** la portada del Excel (B1) no puede “inventar” un total distinto del detalle B2+B3.\n- **Meta:** materializar la suma del detalle, alinear B1 y chequear tolerancia 0.01.\n- **Éxito:** un booleano `True`.\n- **Límites:** no cambies B2/B3 para “hacer cuadrar”; corrige la portada; no uses tol=0.",
        instruction:
          "1. El starter deja B1=16 → print False.\n2. Calcula `det = B2 + B3` (15).\n3. Escribe B1=15 (o 15.0).\n4. Imprime `abs(det - portada) < 0.01`.",
        hint: "Lee `.value` de las celdas; corrige B1 a 15 para que cuadre con 10+5.",
        hints: [
          "det = ws[\"B2\"].value + ws[\"B3\"].value; ws[\"B1\"] = 15.",
          "print(abs(det - ws[\"B1\"].value) < 0.01).",
        ],
        edgeCases: ["floats 0.1+0.2", "None en celda"],
        tests: "salida coincide con solution output",
        feedback:
          "Si es False, B1 sigue en 16 (portada incorrecta) o no leíste los `.value` de B2/B3. El detalle 10+5 exige portada 15 con tol 0.01. Fail-closed: no emitas el paquete al VP si no cuadra.",
        retrospective:
          "El detalle manda; la portada se alinea o se falla. Fail-closed = no emitir paquete si no cuadra. El error clásico es bajar B2/B3 “para que cuadre” en vez de corregir la portada. Pregunta: con tol 0.01, ¿16 vs. 15 pasa? Siguiente (E2): pivot lógico con groupby sum.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# reconcile tol desde celdas
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
        title: "Pivot lógico: groupby sum por región",
        preamble:
          "- **Contexto:** el factory materializa el pivot en pandas y lo pega en `Salida`; no es un promedio de montos.\n- **Meta:** sumar montos por región con `groupby`.\n- **Éxito:** `{'Cusco': 7.0, 'Lima': 15.0}`.\n- **Límites:** no uses `mean`; no reordenes a mano el dict (el orden de groupby es el canónico del output).",
        instruction:
          "1. El starter imprime promedios (mean) — bug.\n2. Cambia a `.sum().to_dict()`.\n3. Imprime el dict resultante.\n4. Verifica mentalmente: Lima 10+5=15, Cusco 7.",
        hint: "groupby(...).sum().to_dict() — no mean.",
        hints: [
          "Usa sum, no mean.",
          "to_dict() sobre la Series resultante.",
        ],
        edgeCases: ["NaN monto"],
        tests: "salida coincide con solution output",
        feedback:
          "Si ves promedios (p. ej. 7.5 en Lima), usaste mean en vez de sum. El pivot lógico del factory materializa sumas por región: Lima 10+5=15 y Cusco 7 — el auditor no acepta un “KPI razonable” por error.",
        retrospective:
          "Mean vs. sum es el bug silencioso del “KPI que se ve razonable”. El pivot del factory es suma por región, no promedio. Pregunta: ¿qué número incorrecto vería el VP en Lima si dejas mean? Luego (E3) empaquetar la regla en `reconcile(det, portada, tol)`.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Ejercicio S20-T3-A-E2 · groupby sum
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
        title: "Función reconcile con tolerancia 0.01",
        preamble:
          "- **Contexto:** en PEN a 2 decimales, “casi igual” necesita tolerancia documentada (0.01), no igualdad bit a bit.\n- **Meta:** completar `reconcile` con `tol=0.01` por defecto.\n- **Éxito:** dos líneas: `True` (22.0 vs. 22.005) y `False` (22.0 vs. 23.0).\n- **Límites:** no dejes `tol=0.0`; no uses `<=` con semántica distinta sin documentar.",
        instruction:
          "1. El starter tiene `tol=0.0` y falla el primer caso.\n2. Cambia el default a `0.01`.\n3. Mantén `abs(det_sum - portada) < tol`.\n4. Imprime los dos pares del enunciado.",
        hint: "Default de tolerancia documentada en PEN (2 decimales), no igualdad bit a bit.",
        hints: [
          "Default de tolerancia documentada en PEN (2 decimales), no igualdad bit a bit.",
          "Dos prints con los pares del enunciado; no dejes tol=0 por defecto.",
        ],
        edgeCases: ["tol 0"],
        tests: "salida coincide con solution output",
        feedback:
          "Si el primer print es False, tu tol por defecto es demasiado estricta (0). En PEN a 2 decimales, 22.005 pasa con 0.01 y 23.0 no: el gate fail-closed del factory depende de esa regla.",
        retrospective:
          "Tol documentada evita discusiones de fin de mes. Pregunta: ¿por qué 22.005 pasa y 23.0 no? Puente a T3-B: validar headers y dominios **antes** de materializar.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# reconcile fn
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
        title: "Completar headers region y monto",
        preamble:
          "- **Contexto:** si falta el header `monto`, el lote no debe escribirse: el schema del VP está roto.\n- **Meta:** completar B1 y validar igualdad exacta de listas de headers.\n- **Éxito:** un booleano `True`.\n- **Límites:** no reordenes columnas; no ignores `None` en B1; comparación sensible al orden.",
        instruction:
          "1. Solo A1=`region` está escrito.\n2. Asigna B1=`\"monto\"`.\n3. Arma `got` con A1 y B1.\n4. Imprime `expected == got`.",
        hint: "ws[\"B1\"] = \"monto\"; lee los `.value` de A1 y B1 en orden.",
        hints: [
          "got = [ws[\"A1\"].value, ws[\"B1\"].value].",
          "Comparación de listas es sensible al orden.",
        ],
        edgeCases: ["orden distinto", "None en header"],
        tests: "salida coincide con solution output",
        feedback:
          "Si es False, falta B1=`monto` o leíste mal A1/B1. Headers incompletos deben fallar antes de escribir el lote: el schema del VP no se “arregla” en silencio a las 23:00.",
        retrospective:
          "Headers incompletos fallan antes de materializar `Salida`: el schema del VP no se improvisa a las 23:00. El error clásico es ignorar `None` en B1 y seguir el lote. Pregunta: si `expected` y `got` difieren en orden, ¿es `True`? Siguiente (E2): allowlist de regiones leídas desde la hoja.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# schema equality desde hoja
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
        title: "Listar regiones fuera de la allowlist",
        preamble:
          "- **Contexto:** el factory aborta con la lista de violators, no con un bool silencioso que el auditor no puede auditar.\n- **Meta:** leer A2/A3 y devolver solo regiones no permitidas.\n- **Éxito:** `['Piura']` (Lima está permitida).\n- **Límites:** no imprimas todas las regiones; no inviertas el predicado hacia las válidas.",
        instruction:
          "1. El starter hace `print(regs)` sin filtrar.\n2. Filtra con `r not in allowed`.\n3. Imprime la lista de violators.\n4. Case-sensitive: no normalices a lower en este ejercicio.",
        hint: "Lee `.value` de A2 y A3; filtra con `r not in allowed`.",
        hints: [
          "regs = [ws[\"A2\"].value, ws[\"A3\"].value].",
          "Filtra las que no están en allowed.",
        ],
        edgeCases: ["case sensitivity", "celda vacía"],
        tests: "salida coincide con solution output",
        feedback:
          "Si imprimiste `['Lima', 'Piura']`, no filtraste. Si imprimiste `['Lima']`, invertiste el predicado (allowed vs. violators). El factory aborta con la lista de violators, no con un bool silencioso: el auditor necesita nombres.",
        retrospective:
          "Violators nombrados = evidencia auditable; un bool silencioso no le sirve al auditor. El error clásico es imprimir todas las regiones o invertir el predicado hacia las válidas. Pregunta: ¿debe salir Lima en la lista? Luego (E3) la misma regla en función reutilizable sobre filas dict.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Ejercicio S20-T3-B-E2 · allowlist regions desde hoja
# Pista: lee A2/A3 y filtra las que NO están en allowed
from openpyxl import Workbook
wb = Workbook()
ws = wb.active
ws["A2"] = "Lima"
ws["A3"] = "Piura"
allowed = {"Lima", "Cusco"}
regs = [ws["A2"].value, ws["A3"].value]
print(regs)`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from openpyxl import Workbook
wb = Workbook()
ws = wb.active
ws["A2"] = "Lima"
ws["A3"] = "Piura"
allowed = {"Lima", "Cusco"}
regs = [ws["A2"].value, ws["A3"].value]
print([r for r in regs if r not in allowed])`,
          output: `['Piura']`,
        },
      },
      {
        id: "S20-T3-B-E3",
        subtopicId: "S20-T3-B",
        kind: "transfer",
        title: "Validar filas y devolver violators",
        preamble:
          "- **Contexto:** la validación de dominio se reutiliza en batch y en el manifest; debe devolver **quién** falló.\n- **Meta:** corregir el predicado para listar regiones fuera de `allowed`.\n- **Éxito:** `['Ica']` con fixture Lima+Ica y allowlist Lima/Cusco/Arequipa.\n- **Límites:** no devuelvas las válidas; no mutes `rows`.",
        instruction:
          "1. El starter filtra `in allowed` (invierte violators).\n2. Cambia a `not in allowed`.\n3. Imprime el resultado de la llamada dada.\n4. No hardcodees `['Ica']`.",
        hint: "Devuelve regiones **fuera** de allowed, no las válidas.",
        hints: [
          "Devuelve regiones **fuera** de allowed, no las válidas.",
          "print el resultado de la llamada dada; no hardcodees la lista.",
        ],
        edgeCases: ["rows vacías"],
        tests: "salida coincide con solution output",
        feedback:
          "Si devuelves `['Lima']`, invertiste el predicado: quieres violators (`not in allowed`), no las regiones válidas. Ica debe salir; Lima no. Si la lista no está vacía, el manifest debe registrar abort.",
        retrospective:
          "`in` vs. `not in` es el typo que manda Ica a gerencia. Pregunta: ¿qué va al manifest si la lista no está vacía? Puente a T4-A: batch con corruptos y locks.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Ejercicio S20-T3-B-E3 · validate_rows
# Pista: devuelve violators (fuera de allowed), no las válidas
def validate_rows(rows, allowed):
    return [r["region"] for r in rows if r["region"] in allowed]
print(validate_rows([{"region": "Lima"}, {"region": "Ica"}], {"Lima", "Cusco", "Arequipa"}))`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `def validate_rows(rows, allowed):
    return [r["region"] for r in rows if r["region"] not in allowed]
print(validate_rows([{"region": "Lima"}, {"region": "Ica"}], {"Lima", "Cusco", "Arequipa"}))`,
          output: `['Ica']`,
        },
      },
      {
        id: "S20-T4-A-E1",
        subtopicId: "S20-T4-A",
        kind: "guided",
        title: "ok_count del batch para el summary",
        preamble:
          "- **Contexto:** el summary del factory reporta cuántos archivos quedaron `ok`; ese número es lo primero que mira el auditor.\n- **Meta:** contar estados `\"ok\"` en el mapa de clasificación.\n- **Éxito:** un entero `2` (a y c ok; b corrupt).\n- **Límites:** no cuentes corrupt ni keys; itera `status.values()`.",
        instruction:
          "1. El BUG del starter suma `v == \"corrupt\"`.\n2. Cambia a `v == \"ok\"`.\n3. Imprime el `sum(...)`.\n4. No hardcodees 2.",
        hint: "sum(v == \"ok\" for v in status.values()) — no cuentes corrupt.",
        hints: [
          "Itera values del dict de estados, no keys.",
          "ok_count alimenta el summary JSON del factory.",
        ],
        edgeCases: ["typos status", "estado vacío"],
        tests: "salida coincide con solution output",
        feedback:
          "Si sale 1, contaste `corrupt` o iteraste mal las keys. El `ok_count` es el campo que el auditor mira primero en el summary del batch nocturno — no el número de fallos.",
        retrospective:
          "Contador correcto = evidencia de lote sano. El error clásico es sumar el estado “llamativo” (corrupt) en vez de `ok`. Pregunta: con 3 ok y 1 locked, ¿qué debe imprimir el summary de ok? Siguiente (E2): implementar `classify` real con excepciones.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# ok_count del batch
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
        title: "classify: ok, corrupt o locked",
        preamble:
          "- **Contexto:** cada path del batch se clasifica sin tumbar el proceso: éxito, zip roto o archivo en uso.\n- **Meta:** capturar `BadZipFile` → corrupt y `PermissionError` → locked.\n- **Éxito:** una línea `locked` para `in_use.xlsx`.\n- **Límites:** no devuelvas siempre `ok`; no tragues `Exception` genérica silenciando bugs ajenos.",
        instruction:
          "1. El starter llama `opener` sin try y siempre retorna ok (o crashea).\n2. Envuelve en try/except BadZipFile y PermissionError.\n3. Imprime `classify(\"in_use.xlsx\", fake_open)`.\n4. Success path retorna `\"ok\"`.",
        hint: "try/except BadZipFile → corrupt; PermissionError → locked; success → ok.",
        hints: [
          "from zipfile import BadZipFile.",
          "Captura las excepciones del opener; no devuelvas siempre ok.",
        ],
        edgeCases: ["excepciones no contempladas"],
        tests: "salida coincide con solution output",
        feedback:
          "`in_use.xlsx` dispara `PermissionError` → debe ser `locked`, no `ok`. Un archivo abierto por el contador no tumba el lote: se aísla y se reintenta con otra política que un corrupt.",
        retrospective:
          "Lock ≠ corrupt: políticas de reintento distintas (esperar al contador vs. cuarentena del archivo). El error clásico es devolver siempre `ok` o tragar `Exception` genérica y silenciar el lote. Pregunta: ¿qué devolverías con `BadZipFile`? Luego (E3) agregar conteos con Counter para el manifest.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# classify exceptions
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
        title: "Summary del batch con Counter",
        preamble:
          "- **Contexto:** el manifest no quiere la lista cruda de estados; quiere conteos por categoría.\n- **Meta:** construir `dict(Counter(files.values()))` del mapa dado.\n- **Éxito:** `{'ok': 2, 'corrupt': 1, 'locked': 1}`.\n- **Límites:** no cuentes keys de archivo; no omitas locked.",
        instruction:
          "1. El starter imprime `list(files.values())`.\n2. Usa `Counter` sobre esos values.\n3. Convierte a `dict` e imprime.\n4. Verifica ok=2, corrupt=1, locked=1.",
        hint: "Cuenta ocurrencias de cada estado; no listes solo values.",
        hints: [
          "Counter sobre values del mapa, no sobre keys de archivo.",
          "El auditor quiere conteos por estado, no la lista cruda.",
        ],
        edgeCases: ["estado desconocido", "mapa vacío"],
        tests: "salida coincide con solution output",
        feedback:
          "Debes ver conteos por estado (ok/corrupt/locked), no la lista cruda. Si falta locked o ok=1, el Counter no recibió el mapa completo. Ese summary es lo que el revisor de CP-N2-B abre en 30 segundos.",
        retrospective:
          "Counter del summary es lo que el revisor de CP-N2-B abre en 30 segundos: conteos por categoría, no la lista cruda de paths. Pregunta: si omites locked, ¿qué historia falsa cuentas del lote? Puente a T4-B: backup, idempotencia y manifest con hash.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Counter statuses del summary
# Pista: cuenta ocurrencias de cada estado; no listes solo values
from collections import Counter
files = {"a.xlsx": "ok", "b.xlsx": "corrupt", "c.xlsx": "locked", "d.xlsx": "ok"}
print(list(files.values()))`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from collections import Counter
files = {"a.xlsx": "ok", "b.xlsx": "corrupt", "c.xlsx": "locked", "d.xlsx": "ok"}
print(dict(Counter(files.values())))`,
          output: `{'ok': 2, 'corrupt': 1, 'locked': 1}`,
        },
      },
      {
        id: "S20-T4-B-E1",
        subtopicId: "S20-T4-B",
        kind: "guided",
        title: "Manifest mínimo con input_sha1_8",
        preamble:
          "- **Contexto:** sin `sheets`, `reconcile_ok`, `input_sha1_8` e `idempotent=True`, el auditor no cierra el incremento.\n- **Meta:** completar el dict de manifest con hash real del payload sintético.\n- **Éxito:** el dict canónico con `input_sha1_8` = `651f3b6b`.\n- **Límites:** no hardcodees el hash si no lo calculas; no dejes `idempotent=False`; no metas paths con secretos.",
        instruction:
          "1. El starter tiene hash falso e idempotent False.\n2. Añade sheets Entrada/Salida y reconcile_ok True.\n3. Calcula `hashlib.sha1(payload).hexdigest()[:8]`.\n4. Pon `idempotent=True` e imprime el dict.",
        hint: "hashlib.sha1(payload).hexdigest()[:8]; no hardcodees el hash si no lo calculas.",
        hints: [
          "Calcula input_sha1_8 con hashlib sobre el payload.",
          "idempotent=True declara reejecución segura; sheets canónicos Entrada/Salida.",
        ],
        edgeCases: ["path absoluto con secretos", "hash de payload distinto", "idempotent False"],
        tests: "salida coincide con solution output",
        feedback:
          "Si falta `input_sha1_8` o `idempotent` es False, el auditor no cierra el incremento. Si el hash no es `651f3b6b`, hasheaste otro payload o truncaste mal. El manifest es la evidencia de la corrida hacia S21.",
        retrospective:
          "Hash truncado a 8 hex identifica la entrada sin volcar datos. El error clásico es dejar `idempotent=False` o `00000000` “para que compile”. Pregunta: ¿por qué el manifest exige `sheets` y `reconcile_ok` además del hash? Siguiente (E2): dig de filas orden-invariante para re-runs.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# manifest mínimo con hash
# Pista: calcula input_sha1_8; sheets canónicos; idempotent True
import hashlib
payload = b"region,monto\\nLima,10\\n"
manifest = {
    "backup": "out/prev.bak",
    "idempotent": False,
    "input_sha1_8": "00000000",
}
print(manifest)`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import hashlib
payload = b"region,monto\\nLima,10\\n"
manifest = {
    "sheets": ["Entrada", "Salida"],
    "reconcile_ok": True,
    "backup": "out/prev.bak",
    "idempotent": True,
    "input_sha1_8": hashlib.sha1(payload).hexdigest()[:8],
}
print(manifest)`,
          output: `{'sheets': ['Entrada', 'Salida'], 'reconcile_ok': True, 'backup': 'out/prev.bak', 'idempotent': True, 'input_sha1_8': '651f3b6b'}`,
        },
      },
      {
        id: "S20-T4-B-E2",
        subtopicId: "S20-T4-B",
        kind: "independent",
        title: "Digest orden-invariante de filas",
        preamble:
          "- **Contexto:** si el orden de filas en el sheet cambia, el hash no debe cambiar: es el mismo multiconjunto de negocio.\n- **Meta:** ordenar filas antes de hashear en `dig(rows)`.\n- **Éxito:** un booleano `True` comparando lista original vs. invertida.\n- **Límites:** no uses el orden de entrada tal cual; no mutes la lista del caller de forma frágil (sorted en el join basta).",
        instruction:
          "1. El starter hashea sin `sorted` → comparación False.\n2. Cambia a `for a, b in sorted(rows)`.\n3. Imprime la igualdad de dig de ambas listas.\n4. No hardcodees True.",
        hint: "sorted(rows) antes de join; hashlib.sha1.",
        hints: [
          "Ordena las filas antes de unir y hashear.",
          "Compara dig de la lista original con la invertida.",
        ],
        edgeCases: ["floats formatting"],
        tests: "salida coincide con solution output",
        feedback:
          "Sin `sorted(rows)`, el orden de entrada cambia el hash y la re-ejecución deja de ser idempotente. Ordena antes de hashear. Las dos listas deben ser el mismo multiconjunto de filas (solo cambia el orden): si no, el factory “cambia” el artefacto sin cambiar el negocio.",
        retrospective:
          "Orden canónico = idempotencia lógica. Sin él, re-ejecutar “cambia” el artefacto y el factory pierde confianza en el cierre de mes. El error clásico es hashear el orden de lectura del sheet. Pregunta: ¿Lima/Cusco vs. Cusco/Lima debe cambiar el dig? Luego (E3) `structural_ok` con superset de sheets.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Ejercicio S20-T4-B-E2 · dig order-invariant
# Pista: ordena rows antes de hashear (mismas filas, distinto orden)
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
        title: "structural_ok: need es subconjunto",
        preamble:
          "- **Contexto:** una hoja extra `Log` o `Catálogo` no invalida el contrato mínimo Entrada/Salida.\n- **Meta:** devolver True si `sheetnames` es superset de `need`.\n- **Éxito:** un booleano `True` con need Entrada/Salida y sheets que incluyen Log.\n- **Límites:** no exijas igualdad exacta de conjuntos; no ignores mayúsculas en este ejercicio.",
        instruction:
          "1. El starter usa `==` y falla con Log extra.\n2. Cambia a `set(sheetnames) >= set(need)`.\n3. Imprime el resultado de la llamada dada.\n4. No borres Log del fixture.",
        hint: "Superset (>=), no igualdad exacta de conjuntos.",
        hints: [
          "need debe ser subconjunto de sheetnames.",
          "Log extra no debe invalidar el check.",
        ],
        edgeCases: ["case"],
        tests: "salida coincide con solution output",
        feedback:
          "Si usas `==`, una hoja extra (Log) falla el check indebidamente. Usa superset (`>=`): `need ⊆ sheetnames`. Si falta `Salida`, el contrato mínimo se rompe y el auditor no cierra.",
        retrospective:
          "Superset permitido = contrato mínimo, no camisa de fuerza. Pregunta de cierre: ¿qué debe pasar si falta `Salida`? En *Tú haces* unirás copy→materializar→reconcile→manifest con este mismo rigor.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# structural_ok
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
      "El VP de operaciones en Lima entrega plantillas sintéticas y espera un workbook de resultados auditable. Tu adaptador (excel factory de CP-N2-B) debe copiar la plantilla master sin dañarla, materializar KPIs en `Salida`, conciliar totales con tolerancia documentada (0.01 PEN) y dejar un **manifest** JSON de la corrida. Si la conciliación falla, **fail-closed**: no emitas el paquete hacia S21. Este *Tú haces* ensambla lo que practicaste en pedazos en *Hacemos juntos*.",
    objectives: [
      "Copiar plantilla master → path de salida (load_workbook / save)",
      "Leer/escribir sheets canónicos Entrada/Salida con openpyxl",
      "Calcular en Python valores de salida (materializados, no fórmulas de CI)",
      "Conciliar totales y n con tolerancia documentada",
      "Batch con manejo de corrupt/lock (BadZipFile / PermissionError o cuarentena)",
      "Backup + idempotencia + tests estructurales + manifest.json",
    ],
    requirements: [
      "No modificar plantilla master in-place (solo la copia en out/)",
      "Manifest JSON con sheets, reconcile_ok, backup, input_sha1_8, master_intact",
      "Solo datos sintéticos — sin PII real en celdas ni paths",
      "Headers validados antes de materializar Salida",
      "Etiquetas de hojas de presentación en español profesional (es-PE)",
      "Checklist de entrega: results.xlsx + manifest.json + master intacto + reconcile_ok True",
    ],
    starterCode: `from openpyxl import Workbook, load_workbook
from pathlib import Path
import json
import shutil
import hashlib
import tempfile

# Portfolio excel factory CP-N2-B (Lima sintético).
# El esqueleto ya crea el master, lo copia a out/ y valida headers.
# Completa los tres huecos: materialize_salida, reconcile y escritura del manifest.
# Meta de corrida exitosa: master intacto (hash), reconcile_ok True, manifest.json en disco.

def headers_ok(ws, expected):
    got = [ws.cell(1, c).value for c in range(1, len(expected) + 1)]
    return got == expected

def dig_rows(rows):
    """Digest orden-invariante de filas (misma idea que el We Do de idempotencia)."""
    s = "\\n".join(f"{a},{b}" for a, b in sorted(rows))
    return hashlib.sha1(s.encode()).hexdigest()[:8]

def materialize_salida(wb, det_sum, n_rows):
    """Escribe totales materializados en hoja Salida (números Python, no fórmulas)."""
    if "Salida" not in wb.sheetnames:
        wb.create_sheet("Salida")
    sal = wb["Salida"]
    sal["A1"] = "total_monto"
    sal["B1"] = None  # COMPLETAR: escribe det_sum (float)
    sal["A2"] = "n_filas"
    sal["B2"] = None  # COMPLETAR: escribe n_rows (int)
    return sal

def reconcile(det_sum, portada, n_det, n_xlsx, tol=0.01):
    """Fail-closed: True solo si montos (con tol) y n cuadran."""
    # COMPLETAR: return abs(det_sum - portada) < tol and n_det == n_xlsx
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
    master_sha_before = hashlib.sha1(master.read_bytes()).hexdigest()[:8]

    out = Path(tmp) / "out" / "results.xlsx"
    out.parent.mkdir(parents=True)
    bak = Path(tmp) / "out" / "results.prev.xlsx.bak"

    # 1) Copia master → out (nunca escribas el master in-place)
    shutil.copy(master, out)
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

    det_sum = sum(m for _, m in rows)  # 15.0
    n_rows = len(rows)  # 2

    # 2) Materializar Salida
    sal = materialize_salida(wb, det_sum, n_rows)
    wb.save(out)

    # 3) Conciliación fail-closed
    portada = sal["B1"].value if sal["B1"].value is not None else -1.0
    n_xlsx = sal["B2"].value if sal["B2"].value is not None else -1
    ok = reconcile(det_sum, float(portada), n_rows, int(n_xlsx))

    # 4) Evidencia de master intacto + digest de filas (idempotencia lógica)
    master_sha_after = hashlib.sha1(master.read_bytes()).hexdigest()[:8]
    master_intact = master_sha_before == master_sha_after
    dig_a = dig_rows(rows)
    dig_b = dig_rows(list(reversed(rows)))  # mismo multiconjunto, otro orden

    # 5) Manifest de auditoría (persístelo en disco)
    payload = ("region,monto\\n" + "\\n".join(f"{a},{b}" for a, b in rows)).encode()
    manifest = {
        "sheets": list(wb.sheetnames),
        "reconcile_ok": ok,
        "backup": bak.name,
        "input_sha1_8": hashlib.sha1(payload).hexdigest()[:8],
        "idempotent": dig_a == dig_b,
        "master_intact": master_intact,
        "master_sha1_8": master_sha_after,
    }
    man_path = Path(tmp) / "out" / "manifest.json"
    # COMPLETAR: escribe el JSON
    # man_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")

    print("out", out.name)
    print("master_intact", master_intact)
    print("reconcile_ok", ok)
    print("manifest_keys", sorted(manifest.keys()))
    print("manifest_written", man_path.exists())
`,
    portfolioNote:
      "Checklist de entrega: (1) results.xlsx con Entrada + Salida materializada, (2) manifest.json con reconcile_ok y input_sha1_8, (3) master de plantilla intacto, (4) nota de re-run idempotente. Salida de consola esperada en corrida exitosa: `master_intact True`, `reconcile_ok True`, `manifest_written True`. Enlaza al dashboard de S19 y al paquete de reportes de S21.",
    rubric: [
      { criterion: "Plantilla intacta + workbook de salida + manifest completo", weight: "25%" },
      { criterion: "Correctitud técnica (openpyxl + conciliación + batch)", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados (corrupt, lock, re-run)", weight: "15%" },
      { criterion: "Código legible y límites claros", weight: "10%" },
      { criterion: "Documentación en español profesional", weight: "10%" }
    ],
    retrospective:
      "Antes de marcar listo: (1) ¿puedes demostrar con el manifest que el master no cambió de hash y que `reconcile_ok` es True? (2) ¿qué harías distinto con un xlsx real bloqueado por el contador o corrupto en la carpeta compartida? (3) Escribe en el README una frase de impacto medible (antes: plantilla editada a mano / después: results.xlsx + manifest re-ejecutable) que puedas defender en 30 segundos ante el revisor de CP-N2-B y el puente a S21.",
  },
  selfCheck: {
    questions: [
      {
        question: "openpyxl sin Excel instalado evalúa fórmulas automáticamente:",
        options: ["Siempre sí", "Solo en Linux", "Solo named ranges", "No; suele devolver la fórmula o cache si existe"],
        correctIndex: 3,
        explanation:
          "openpyxl no trae motor Excel: una fórmula recién escrita se lee como texto (`=A1+A2`). `data_only=True` solo devuelve cache si Excel ya calculó el archivo. En CI headless materializa el número en Python.",
      },
      {
        question: "Al escribir en celdas combinadas debes:",
        options: ["Escribir en cualquier celda del merge", "Escribir en la celda ancla (top-left)", "Desmerge siempre", "Usar solo CSV"],
        correctIndex: 1,
        explanation:
          "El valor vive en la celda ancla (esquina superior izquierda). Las demás celdas del merge leen `None` y escribir ahí no actualiza el valor visible del rango.",
      },
      {
        question: "Un manifest del excel factory debe permitir auditar:",
        options: ["Solo el color de fuente", "La contraseña del VP", "Estados de batch, conciliación y backups", "El nombre del archivo temporal del SO"],
        correctIndex: 2,
        explanation:
          "El manifest es la evidencia de la corrida: estados ok/corrupt/locked, `reconcile_ok`, path de backup y hashes. Colores o nombres de temp del SO no cierran una auditoría.",
      },
      {
        question: "Idempotencia significa:",
        options: ["Misma entrada → mismo resultado lógico", "Correr dos veces cambia totales al azar", "Borrar la plantilla", "Ignorar headers"],
        correctIndex: 0,
        explanation:
          "Misma entrada + misma versión de script → mismo resultado lógico. Re-ejecutar no debe duplicar filas ni corromper la plantilla master.",
      },
      {
        question: "Al materializar un Excel de salida del reporting factory, la suma de montos en la hoja no cuadra con el DataFrame fuente. ¿Cuál es la política correcta?",
        options: ["Enviar el xlsx igual y aclarar la diferencia solo si el cliente pregunta", "Borrar la hoja de Entrada para que no se note la discrepancia", "Cambiar el total del DataFrame para que coincida con Excel sin audit trail", "Fail-closed: no emitir el paquete hasta reconciliar n y totales (con tolerancia de redondeo documentada)"],
        correctIndex: 3,
        explanation:
          "La conciliación es un quality gate del factory: `abs(sum_xlsx - sum_df) < tol` y `n` iguales. Sin cuadrar, **fail-closed** — no se emite el paquete hacia S21 ni se “arregla” el DataFrame a escondidas.",
      },
      {
        question: "Para no dañar la plantilla master, el patrón correcto es:",
        options: ["Abrir el master y guardar in-place cada corrida", "Copiar el master a un path de salida, load_workbook de la copia y save solo ahí", "Borrar el master al terminar para evitar confusiones", "Renombrar el master a .bak y trabajar sobre el original"],
        correctIndex: 1,
        explanation:
          "Patrón canónico: `shutil.copy(master, out)` → `load_workbook(out)` → escribir → `wb.save(out)`. El master queda intacto para la siguiente corrida y para el VP.",
      },
      {
        question: "En un batch, un xlsx con contenedor roto suele disparar:",
        options: ["KeyError de pandas", "UnicodeDecodeError de csv", "BadZipFile (u error de zip al abrir)", "Timeout de red HTTP"],
        correctIndex: 2,
        explanation:
          "Un `.xlsx` es un zip; contenedor dañado → `BadZipFile`. Se clasifica como corrupt, se cuarentena y el resto del lote continúa con contadores auditables.",
      },
      {
        question: "structural_ok(sheetnames, need) debe devolver True cuando:",
        options: ["need es subconjunto de sheetnames (superset permitido)", "sheetnames es exactamente igual a need (sin hojas extra)", "Al menos una hoja de need existe", "El workbook tiene más de 10 hojas"],
        correctIndex: 0,
        explanation:
          "`need ⊆ sheetnames` (superset permitido): hojas extra (`Log`, `Catálogo`) no invalidan el contrato mínimo de Entrada/Salida.",
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
