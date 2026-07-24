import type { CourseSection } from '../../types'

export const section21: CourseSection = {
 id: "fastapi",
 index: 21,
 title: "Documentos, plantillas y reportes trazables",
 shortTitle: "Reportes trazables",
 tagline: "Una corrida genera dashboard, DOCX/PDF y workbook con números reconciliados, provenance y revisión visual",
 estimatedHours: 18,
 level: "Competente",
 phase: 1,
 icon: "FileStack",
 accentColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
 jobRelevance:
 "En analytics y operaciones en Perú, el comité no acepta un Excel “bonito” si el DOCX dice otro número. Cerrar **CP-N2-B** exige un factory de reportes que una dashboard, Excel y documentos reales con métricas reconciliadas, provenance y aprobación humana.",
 learningOutcomes: [
 { text: "Separar un context versionado de la presentación Jinja y reutilizar el mismo dict en varios artefactos" },
 { text: "Renderizar condiciones y tablas con missing como — (nunca 0 inventado) y formato decimal explícito" },
 { text: "Generar DOCX con estilos Heading reales, guardar, reabrir y extraer texto/estilos auditables" },
 { text: "Generar PDF digital, extraer capa de texto, renderizar PNG y marcar needs_ocr sin inventar lectura" },
 { text: "Empaquetar resumen, método y hallazgos H→evidencia (hallazgo ≠ decisión de negocio)" },
 { text: "Alinear captions, fuentes y limitaciones con paridad de métricas entre dashboard, Excel y documento" },
 { text: "Centralizar fmt_pen / precisión decimal y checklist mínima de a11y (H1 + alts útiles)" },
 { text: "Emitir manifiesto de provenance (run_id, huellas, checklist visual) en estado pending_review" }
 ],
 theory: [
 {
 heading: "Reporting Factory y cierre CP-N2-B",
 paragraphs: [
 "Imagina la reunión de operaciones en Lima: el Excel de S20 muestra ticket mediano **28.0 PEN (n=40)** y el DOCX del analista dice **30 PEN** “porque redondeó a mano”. El comité no firma. En analytics y operaciones en Perú, **cerrar CP-N2-B** no es “exportar bonito”: es un **Reporting Factory** que une plantillas Jinja, documentos DOCX/PDF locales, narrativa ejecutiva, paridad numérica con el dashboard (S19) y el Excel (S20), provenance y cola de aprobación humana. Las APIs HTTP se tratan más adelante; aquí el entregable son **archivos locales verificables**.",
 "Una sola corrida produce artefactos alineados: mismos *n* y métricas clave que el EDA de S18 y el factory de S20. Usamos solo datos sintéticos Lima/Cusco (sin PII) y no publicamos el informe sin checklist visual. El hilo del lab es **CASO-LIM-021**: ticket mediano 28 PEN, n=40, cobertura web-only. Si en un artefacto aparece n=32 y en otro n=40, el factory ya falló el criterio de paridad antes de hablar de diseño.",
 "Orden pedagógico (no saltes adelante): **T1 Plantillas** (Jinja, separación datos/presentación, tablas seguras) → **T2 Documentos** (DOCX real; PDF digital vs imagen/OCR) → **T3 Narrativa** (resumen, método, hallazgos, figuras/tablas, limitaciones) → **T4 Gobernanza** (redacción y a11y, provenance, aprobación). En cada subtema: teoría → demo I Do → tres We Do (guiada, independiente, transferencia). Ritmo sugerido (~18 h): sesiones 1–2 en T1; 3–5 en T2 (artefactos reales); 6–7 en T3; 8 en T4 + You Do + self-check. El You Do une las piezas; no es un atajo para saltarte T2.",
 "**Diccionario de la sección** (consúltalo al dudar): **context** = dict versionado que alimenta todas las plantillas; **missing ≠ 0** = celda `—` cuando no hay dato; **PDF digital** = texto seleccionable (pypdf extrae); **needs_ocr** = extracción vacía sin inventar texto; **paridad** = mismas métricas clave en dashboard, Excel y documento; **provenance** = run_id + huellas + checklist visual antes de `pending_review`. **Qué no es el foco:** montar APIs HTTP, autenticación ni despliegue en la nube — solo el paquete de reportes locales del cierre CP-N2-B.",
 ],
 callout: {
 type: "info",
 title: "Dependencias del lab",
 content:
 "En tu venv: `pip install jinja2 python-docx reportlab pypdf pymupdf pillow`. No uses PII real. Trabaja en un directorio de lab limpio: los demos crean `informe.docx` / `informe.pdf` / PNG locales. La revisión de cierre exige los archivos, el texto extraído, una vista renderizada y sus hashes; un dict en memoria no sustituye esos artefactos. En canvas ReportLab con Helvetica por defecto, los demos usan ASCII (`sintetico`) a propósito; en DOCX y Markdown del lab escribe **sintético** con tilde.",
 },
 },
 {
 heading: "Jinja y separación datos/presentación",
 subtopicId: "S21-T1-A",
 paragraphs: [
 "Jinja separa **datos** (dict de contexto en Python) de **presentación** (`{{ var }}`, `{% for %}`). Calcula métricas **antes** del render: la plantilla no es el lugar de joins pesados ni de reglas de negocio opacas. Un solo `context` versionado (run_id, métricas, límites) alimenta DOCX, PDF y, más adelante, el correo de aprobación en S22. Si cada canal inventa su propio formato de KPI, la paridad muere en el primer redondeo.",
 "Contrato operativo: `Template(...).render(**ctx)`. En HTML confía en autoescape; nunca marques input de usuario con `mark_safe` sin sanitizar. En texto plano (Markdown, cuerpo de DOCX vía plantilla) define política de caracteres. Los KPI llegan ya redondeados (1–2 decimales PEN) desde Python: no “se redondean a ojo” en la plantilla ni en el Word del autor. El revisor debe poder re-renderizar el mismo context y obtener la misma cadena.",
 "Caso CASO-LIM-021: portada `CASO-LIM-021 · {{ region }} (n={{ n }})` → `CASO-LIM-021 · Lima (n=40)`; KPI `{{ m }} PEN (n={{ n }})` → `28 PEN (n=40)`. Una función `render_kpi(ctx)` centraliza el template fijo región/mediana/n y evita que cada autor del informe invente su propio formato. Así el dashboard S19 y el Excel S20 hablan el mismo idioma numérico — y el DOCX de esta sección no se desvía.",
 ],
 code: {
 language: 'python',
 title: "jinja_basic.py",
 code: `def s21_th_1():
    from jinja2 import Template

    tmpl = Template("Región {{ region }}: mediana {{ median }} PEN (n={{ n }})")
    print(tmpl.render(region="Lima", median=28.0, n=40))

s21_th_1()`,
 output: `Región Lima: mediana 28.0 PEN (n=40)`,
 },
 callout: {
 type: "tip",
 title: "Context dict único y autoescape",
 content:
 "Pasa un context versionado (run_id, metricas, limites) a todas las plantillas del factory. En HTML, confía en autoescape: un valor `\"<b>x</b>\"` se renderiza escapado (`&lt;b&gt;…`), no como markup. Nunca uses `mark_safe` sobre input de usuario sin sanitizar; en este lab de texto plano no hace falta desactivar el escape.",
 },
 },
 {
 heading: "Condiciones, tablas y formato seguro",
 subtopicId: "S21-T1-B",
 paragraphs: [
 "`{% if %}` y `{% for %}` construyen tablas y bloques condicionales. Formatea números en Python o con filtros Jinja explícitos (`'%.2f'|format(...)`). Cuando un valor falta, la celda muestra **—** y documenta missing: **no inventes ceros** que alteren sumas, promedios o la paridad con el Excel de S20. En un comité peruano de operaciones, un “0.00” en reclamos se lee como “no hubo reclamos”, no como “no medimos reclamos”.",
 "Contrato anti-inyección: no marques strings de usuario como safe en HTML. Listas de filas sintéticas se renderizan a líneas `region:value` o filas Markdown/HTML con escape. El missing explícito es una **decisión de reporting**, no un detalle cosmético: el caption o el data note debe decir por qué la celda está vacía (cobertura, corte, canal).",
 "Caso CASO-LIM-021: `median is None` → `—`; `28.456` → `28.46` a 2 decimales en tablas de detalle; en resúmenes ejecutivos a menudo 1 decimal PEN (coherente con T4). La tabla del informe debe reconciliar región/value con el workbook. Si Lima aparece con 28.0 en Excel y 0.0 en el DOCX “porque no había dato”, el comité toma una decisión falsa — y el factory de reportes es el culpable.",
 ],
 code: {
 language: 'python',
 title: "jinja_table.py",
 code: `def s21_th_2():
    from jinja2 import Template

    tmpl = Template(
     """{% for r in rows %}- {{ r.region }}: {{ '%.2f'|format(r.median) }} PEN
    {% endfor %}"""
    )
    rows = [{"region": "Lima", "median": 28.0}, {"region": "Cusco", "median": 22.5}]
    print(tmpl.render(rows=rows))

s21_th_2()`,
 output: `- Lima: 28.00 PEN
- Cusco: 22.50 PEN
`,
 },
 callout: {
 type: "warning",
 title: "Cero vs missing",
 content:
 "Imprimir 0.00 cuando no hay datos es un error de reporting grave: distorsiona totales y engaña al comité.",
 },
 },
 {
 heading: "DOCX real: estilos, guardado y extracción",
 subtopicId: "S21-T2-A",
 paragraphs: [
 "T1 te dio un context limpio; T2 lo materializa en **artefactos de disco**. Un **DOCX** trazable tiene secciones fijas (portada, resumen, método, hallazgos, anexos) y estilos reales (Heading 1/2), no solo negrita visual. El `.docx` es un ZIP de XML: la auditoría verifica firma ZIP (`PK`), headings extraídos y tamaño. “Se veía bien en Word del autor” no es evidencia auditable ante un revisor que no tiene tu sesión abierta.",
 "Contrato: crear `informe.docx` con título, heading Resumen, párrafo `n=40`; **guardar, reabrir**, demostrar extracción de texto/estilos. En producción muchos equipos usan plantillas con Jinja dentro del DOCX (`docxtpl`); aquí aprendes el contrato con `python-docx` imperativo — los mismos principios de paridad y estilos aplican a ambos enfoques. El factory no “exporta una vez y reza”: reabre y prueba.",
 "Caso sintético CASO-LIM-021: headings contados al reabrir (p. ej. Resumen como Heading 1). El mismo `n=40` debe aparecer en resumen y en el data note — paridad con S18/S20. Si el outline no está congelado, cada revisor reescribe la estructura y se rompe la reconciliación del paquete CP-N2-B.",
 ],
 code: {
 language: 'python',
 title: "docx_real.py",
 code: `def s21_th_3():
    from pathlib import Path
    from docx import Document

    path = Path("informe.docx")
    doc = Document()
    doc.add_heading("Informe sintético", level=0)
    doc.add_heading("Resumen ejecutivo", level=1)
    doc.add_paragraph("Ticket mediano: 28.0 PEN (n=40).")
    doc.save(path)

    opened = Document(path)
    text = "\\n".join(p.text for p in opened.paragraphs if p.text)
    print(path.exists(), path.read_bytes()[:2] == b"PK")
    print("Resumen ejecutivo" in text, "n=40" in text)

s21_th_3()`,
 output: `True True
True True`,
 },
 callout: {
 type: "tip",
 title: "Outline primero",
 content:
 "Congela el outline (estilos Heading reales) antes de redactar párrafos largos. La negrita sola no es un heading.",
 },
 },
 {
 heading: "PDF digital real: generación, extracción y render",
 subtopicId: "S21-T2-B",
 paragraphs: [
 "Un **PDF digital** tiene texto seleccionable (pypdf extrae); un **PDF escaneado** es imagen y puede requerir OCR con tasa de error. Si la extracción queda vacía, el contrato devuelve `needs_ocr` — **no inventa texto**. El render a PNG (PyMuPDF) prueba legibilidad visual; la extracción prueba la capa digital. Ninguna sustituye la reconciliación tabular.",
 "Contrato: generar PDF local con `n=40`, extraer texto, firmar PDF (`%PDF`); render primera página a PNG y verificar existencia de ambos artefactos. El hash del PDF entra al provenance del paquete.",
 "Caso: PDF imagen-only con texto dibujado en un PNG sintético → pypdf no recupera capa de texto → `needs_ocr`. El paquete documenta el modo (digital vs OCR pendiente); no finge un PDF nativo. Más adelante (S24) profundizarás OCR; aquí aprendes a **abstenerte con honestidad**.",
 ],
 code: {
 language: 'python',
 title: "pdf_real.py",
 code: `def s21_th_4():
    from pathlib import Path
    import fitz
    from pypdf import PdfReader
    from reportlab.pdfgen import canvas

    pdf = Path("informe.pdf")
    c = canvas.Canvas(str(pdf))
    c.drawString(72, 760, "Resumen sintetico: n=40")
    c.save()
    text = "".join(page.extract_text() or "" for page in PdfReader(pdf).pages)
    page = fitz.open(pdf)[0]
    png = Path("informe-p1.png")
    page.get_pixmap(matrix=fitz.Matrix(1, 1)).save(png)
    print(pdf.read_bytes()[:4] == b"%PDF", "n=40" in text)
    print(png.exists(), png.stat().st_size > 0)

s21_th_4()`,
 output: `True True
True True`,
 },
 callout: {
 type: "info",
 title: "OCR no es verdad absoluta",
 content:
 "El render confirma legibilidad; la extracción confirma la capa digital. Ninguna sustituye la reconciliación con la fuente tabular.",
 },
 },
 {
 heading: "Resumen ejecutivo, método y hallazgos",
 subtopicId: "S21-T3-A",
 paragraphs: [
 "Con T2 ya tienes DOCX/PDF reales; T3 les da **voz ejecutiva** sin contaminar el método con opinión. La narrativa separa **resumen ejecutivo**, **método** y **hallazgos**. Cada hallazgo tiene id (H1…) y mapa a evidencia (Tabla1, Fig.1). No mezcles método con opinión; **hallazgo ≠ decisión** (eco de S18): `decision=None` hasta que un humano decida en la cola de aprobación. El comité debe poder ir de la frase al número en el Excel o dashboard en un clic mental.",
 "Contrato: `pack_report(resumen, metodo, hallazgos)` devuelve dict con 3 claves; el resumen debe incluir `n=` (y, en la práctica del lab, unidad PEN) o falla validación. H1 referencia `Tabla1` de forma explícita. Sin id de evidencia, el hallazgo no entra al paquete de aprobación — da igual lo elocuente que suene el párrafo.",
 "Caso CASO-LIM-021: hallazgo H1 “Lima > Cusco en mediana” con evidencia Tabla1 y `decision=None`; resumen con `n=40` y 28 PEN. Si el texto dice “Lima lidera” sin tabla ni n, es eslogan, no hallazgo auditable. Si el hallazgo ya trae “recomendamos subir precios”, has mezclado decisión de negocio en el paquete de evidencia.",
 ],
 code: {
 language: 'python',
 title: "exec_struct.py",
 code: `def s21_th_5():
    report = {
     "resumen": ["Ticket mediano Lima 28 PEN en muestra web (n=40)"],
     "metodo": {"fuente": "sintético", "filtros": ["canal=web"], "corte": "2024-06-30"},
     "hallazgos": [{"id": "H1", "texto": "Lima > Cusco en mediana", "evidencia": "Tabla1"}],
    }
    print(report["resumen"][0])
    print(report["hallazgos"][0]["evidencia"])

s21_th_5()`,
 output: `Ticket mediano Lima 28 PEN en muestra web (n=40)
Tabla1`,
 },
 callout: {
 type: "success",
 title: "Trazabilidad H→evidencia",
 content:
 "Sin id de evidencia, el hallazgo no entra al paquete de aprobación.",
 },
 },
 {
 heading: "Gráficos, tablas, fuentes y limitaciones",
 subtopicId: "S21-T3-B",
 paragraphs: [
 "Inserta figuras del dashboard (S19) y tablas del Excel (S20) con **caption alineado** en fuente, corte y n. Lista limitaciones al final de hallazgos, no escondidas solo en anexo. Reconcilia checksum de métricas clave entre artefactos: si el PNG dice mediana 28 y el DOCX dice 30, el control de consistencia falla.",
 "Contrato: caption dict + pie con campo Fuente visible; unidades PEN a 1 decimal en todo el paquete. Tres artefactos (png, xlsx, docx) comparten `run_id` y `n=40`. El memo de limitaciones repite cobertura (p. ej. web-only) donde el lector la vea.",
 "Caso sintético: bundle con `metrics`, `limits` y caption `Fig.1 … | Fuente: sintético | n_Lima=40`. Paridad `dash == xlsx == doc` es el corazón del cierre CP-N2-B: un solo número, tres superficies.",
 ],
 code: {
 language: 'python',
 title: "embed_limits.py",
 code: `def s21_th_6():
    metrics = {"median_Lima": 28.0, "n_Lima": 40}
    caption = "Fig.1 Ticket mediano | Fuente: sintético | n_Lima=40"
    assert "40" in caption
    bundle = {"fig": "fig1.png", "table": "tabla1", "metrics": metrics, "limits": ["solo web"]}
    print(bundle["metrics"])
    print(bundle["limits"])

s21_th_6()`,
 output: `{'median_Lima': 28.0, 'n_Lima': 40}
['solo web']`,
 },
 callout: {
 type: "warning",
 title: "Números divergentes",
 content:
 "Si el DOCX dice 28 y el Excel 27.5, el factory falla el criterio de cierre: no hay paridad de métricas.",
 },
 },
 {
 heading: "Redacción, accesibilidad y consistencia",
 subtopicId: "S21-T4-A",
 paragraphs: [
 "Redacción en español profesional (**es-PE**): el cuerpo ejecutivo habla al comité, no a un repositorio de GitHub. Evita anglicismos innecesarios (“outperform”, “drive insights”); deja términos técnicos (KPI, SLA, a11y, provenance) donde el gremio los espera, glosándolos la primera vez si el lector no es técnico. Accesibilidad: headings reales, alt de figuras con n y unidad, tablas con encabezados, contraste en HTML cuando el dashboard se empaqueta.",
 "Contrato de consistencia: **misma precisión decimal** (p. ej. 1 decimal PEN) en dashboard, Excel e informe. Si un canal imprime `28.0` y otro `28`, el revisor ve “dos números” aunque sean iguales. Centraliza con `fmt_pen` / `format_metric` para no divergir entre Jinja y Excel. Un glosario breve en anexo basta si introduces siglas nuevas en el paquete.",
 "Caso CASO-LIM-021: “mediana de ticket en Lima” no “median ticket Lima region outperform”. Alt de figura menciona n y unidad (`Barras mediana por región, n por barra en tooltip`); headings del DOCX son estilos de Word, no solo tamaño de fuente. Checklist mínimo (`has_h1` + alts con longitud útil > 10) evita publicar un paquete ilegible para lectores con tecnología asistiva — y es la misma barra que usa el I Do de este subtema.",
 ],
 code: {
 language: 'python',
 title: "consistency.py",
 code: `def s21_th_7():
    vals = [28.04, 28.0, 28]
    precision = 1
    norm = [round(float(v), precision) for v in vals]
    print(norm)
    print("consistente", len(set(norm)) == 1)

s21_th_7()`,
 output: `[28.0, 28.0, 28.0]
consistente True`,
 },
 callout: {
 type: "tip",
 title: "Una función format_metric",
 content:
 "Centraliza redondeo y unidades para no divergir entre Jinja y Excel.",
 },
 },
 {
 heading: "Render visual, provenance y aprobación",
 subtopicId: "S21-T4-B",
 paragraphs: [
 "T4-A dejó el texto y los decimales consistentes; el cierre del factory es **gobernanza**: ¿quién generó qué, con qué datos, y quién miró el paquete? Registra **provenance**: run_id, huella de datos, hashes de artefactos, checklist visual. Cola de aprobación: borrador → revisión visual → aprobado/rechazado con comentarios. Sin checklist visual completo (dashboard, xlsx, doc), **no hay cierre CP-N2-B**. El paquete en `pending_review` es la entrada limpia al flujo de email/aprobación de S22 — no marques `approved` desde el script del factory.",
 "Contrato: `ready(checklist)` es True solo si dashboard, xlsx y doc están True (`all`, no `any`). En el lab usamos un recorte corto de sha1 (8 hex) como id didáctico; en producción prefiere **SHA-256** del artefacto completo (el recorte de 8 hex es débil ante colisiones). Actor y timestamp van en el log de aprobación (preludio de S22).",
 "Caso CASO-LIM-021: checklist incompleto → `ready` False; completo → True. El manifiesto JSON fija run_id, huella, lista de artefactos y `approval.status = pending_review` hasta que un humano revise. Un print de “ok” o un dict solo en memoria no sustituye ese manifiesto ni los archivos en disco.",
 ],
 code: {
 language: 'python',
 title: "provenance.py",
 code: `def s21_th_8():
    import hashlib, json

    artifacts = {"dashboard": "ok", "xlsx": "ok", "doc": "ok"}
    prov = {
     "run_id": "cpn2b-20240630-01",
     "ts": "2024-06-30T12:00:00Z",
     "data_sha1_8": hashlib.sha1(b"synthetic").hexdigest()[:8],
     "artifacts": artifacts,
     "approval": {"status": "pending_review", "reviewer": None},
    }
    print(json.dumps(prov, ensure_ascii=False))

s21_th_8()`,
 output: `{"run_id": "cpn2b-20240630-01", "ts": "2024-06-30T12:00:00Z", "data_sha1_8": "385fcd67", "artifacts": {"dashboard": "ok", "xlsx": "ok", "doc": "ok"}, "approval": {"status": "pending_review", "reviewer": null}}`,
 },
 callout: {
 type: "success",
 title: "Criterio de cierre del paquete",
 content:
 "Sin provenance y sin revisión visual registrada, el paquete CP-N2-B no se considera cerrado: faltan evidencias auditables del factory. En producción usa SHA-256 del artefacto completo; el recorte sha1[:8] es solo id de lab.",
 },
 }
 ],
 iDo: {
 intro: "I Do — observa el Reporting Factory en ocho demos (una por subtema): Jinja con context único → tablas con missing honesto → DOCX real reabierto → PDF digital + PNG → narrativa H→evidencia → paridad dash/xlsx/doc → fmt_pen y a11y mínima → provenance + checklist visual. No copies a ciegas: nota qué se calcula, qué se persiste a disco y qué se deja en pending_review. En We Do practicarás cada pieza; en You Do las unes en una sola corrida CP-N2-B.",
 steps: [
 {
 demoId: "S21-T1-A-DEMO",
 subtopicId: "S21-T1-A",
 environment: "local-python",
 description: "Separar datos de plantilla Jinja con context único",
 code: {
 language: 'python',
 title: "demo_jinja.py",
 code: `def s21_ido_1():
    from jinja2 import Template

    context = {
     "run_id": "r1",
     "region": "Lima",
     "median": 28.0,
     "n": 40,
     "limit": "solo web",
    }
    tmpl = Template(
     "Run {{ run_id }} — {{ region }}: {{ median }} PEN (n={{ n }}). Límite: {{ limit }}."
    )
    print(tmpl.render(**context))

s21_ido_1()`,
 output: `Run r1 — Lima: 28.0 PEN (n=40). Límite: solo web.`,
 },
 why: "Un context versionado alimenta todos los renders del factory.",
 },
 {
 demoId: "S21-T1-B-DEMO",
 subtopicId: "S21-T1-B",
 environment: "local-python",
 description: "Render condicional seguro de tabla con missing como em-dash",
 code: {
 language: 'python',
 title: "demo_cond_table.py",
 code: `def s21_ido_2():
    from jinja2 import Template

    tmpl = Template(
     """{% for r in rows %}{{ r.region }}: {{ r.median if r.median is not none else '—' }}
    {% endfor %}"""
    )
    rows = [
     {"region": "Lima", "median": 28.0},
     {"region": "Cusco", "median": None}
    ]
    print(tmpl.render(rows=rows))

s21_ido_2()`,
 output: `Lima: 28.0
Cusco: —
`,
 },
 why: "Missing explícito evita ceros inventados en el informe.",
 },
 {
 demoId: "S21-T2-A-DEMO",
 subtopicId: "S21-T2-A",
 environment: "local-python",
 description: "Crear, guardar y reabrir un DOCX con estilos reales",
 code: {
 language: 'python',
 title: "demo_docx_artifact.py",
 code: `def s21_ido_3():
    from pathlib import Path
    from docx import Document

    path = Path("reporte.docx")
    doc = Document()
    doc.add_heading("Resumen ejecutivo", 1)
    doc.add_paragraph("Fuente: sintética; n=40")
    doc.save(path)
    reopened = Document(path)
    headings = [p.text for p in reopened.paragraphs if p.style.name.startswith("Heading")]
    print(path.suffix, path.read_bytes()[:2] == b"PK")
    print(headings)

s21_ido_3()`,
 output: `.docx True
['Resumen ejecutivo']`,
 },
 why: "Guardar y reabrir verifica el paquete OOXML y sus estilos, no una simulación.",
 },
 {
 demoId: "S21-T2-B-DEMO",
 subtopicId: "S21-T2-B",
 environment: "local-python",
 description: "Generar PDF, extraer texto y renderizar una página PNG",
 code: {
 language: 'python',
 title: "demo_pdf_artifact.py",
 code: `def s21_ido_4():
    from pathlib import Path
    import fitz
    from pypdf import PdfReader
    from reportlab.pdfgen import canvas

    pdf = Path("reporte.pdf")
    c = canvas.Canvas(str(pdf))
    c.drawString(72, 760, "Hallazgo H1; n=40")
    c.save()
    text = PdfReader(pdf).pages[0].extract_text() or ""
    png = Path("reporte-p1.png")
    fitz.open(pdf)[0].get_pixmap().save(png)
    print("H1" in text, pdf.read_bytes()[:4] == b"%PDF")
    print(png.stat().st_size > 0)

s21_ido_4()`,
 output: `True True
True`,
 },
 why: "El contrato conserva PDF, texto extraído y render visual como evidencia separada.",
 },
 {
 demoId: "S21-T3-A-DEMO",
 subtopicId: "S21-T3-A",
 environment: "local-python",
 description: "Estructurar informe en resumen, método y hallazgos con ids",
 code: {
 language: 'python',
 title: "demo_exec.py",
 code: `def s21_ido_5():
    informe = {
     "resumen": [
     "En muestra web sintética, Lima tiene ticket mediano 28 PEN (n=40).",
     ],
     "metodo": {
     "fuente": "dataset sintético S18",
     "filtros": ["monto>0", "canal=web"],
     },
     "hallazgos": [
     {"id": "H1", "claim": "Lima > Cusco en mediana", "evidencia": "Tabla1", "decision": None}
     ],
    }
    print(informe["resumen"][0])
    print(informe["hallazgos"][0]["id"], informe["hallazgos"][0]["evidencia"])
    print("decision_none", informe["hallazgos"][0]["decision"] is None)

s21_ido_5()`,
 output: `En muestra web sintética, Lima tiene ticket mediano 28 PEN (n=40).
H1 Tabla1
decision_none True`,
 },
 why: "Ids de hallazgo habilitan revisión y aprobación selectiva.",
 },
 {
 demoId: "S21-T3-B-DEMO",
 subtopicId: "S21-T3-B",
 environment: "local-python",
 description: "Embeber métricas con fuentes/límites y check de paridad",
 code: {
 language: 'python',
 title: "demo_parity.py",
 code: `def s21_ido_6():
    dash = {"median_Lima": 28.0}
    xlsx = {"median_Lima": 28.0}
    doc = {"median_Lima": 28.0}
    limits = ["cobertura web", "n Cusco bajo"]
    parity = dash == xlsx == doc
    bundle = {"parity": parity, "limits": limits, "fuente": "sintético"}
    print(bundle)

s21_ido_6()`,
 output: `{'parity': True, 'limits': ['cobertura web', 'n Cusco bajo'], 'fuente': 'sintético'}`,
 },
 why: "Paridad entre dashboard, Excel y documento es el corazón del cierre.",
 },
 {
 demoId: "S21-T4-A-DEMO",
 subtopicId: "S21-T4-A",
 environment: "local-python",
 description: "Normalizar decimales y validar presencia de headings/alt",
 code: {
 language: 'python',
 title: "demo_a11y_copy.py",
 code: `def s21_ido_7():
    def fmt_pen(x):
        return f"{round(float(x), 1)} PEN"

    checks = {
        "decimals": [fmt_pen(28.04), fmt_pen(28.0)],
        "has_h1": True,
        "alts": ["Barras mediana por región, n por barra en tooltip"],
    }
    print(checks["decimals"])
    print("decimal_ok", len(set(checks["decimals"])) == 1)
    print("a11y_min", checks["has_h1"] and all(len(a) > 10 for a in checks["alts"]))

s21_ido_7()`,
 output: `['28.0 PEN', '28.0 PEN']
decimal_ok True
a11y_min True`,
 },
 why: "Consistencia tipográfica y a11y mínima antes de mandar a revisión.",
 },
 {
 demoId: "S21-T4-B-DEMO",
 subtopicId: "S21-T4-B",
 environment: "local-python",
 description: "Registrar provenance y estado de cola de aprobación",
 code: {
 language: 'python',
 title: "demo_prov.py",
 code: `def s21_ido_8():
    import hashlib, json

    prov = {
     "run_id": "cpn2b-close-01",
     "data_sha1_8": hashlib.sha1(b"rows-synthetic").hexdigest()[:8],
     "artifacts": ["dashboard.html", "results.xlsx", "informe.md"],
     "visual_checklist": {"dashboard": True, "xlsx": True, "doc": True},
     "approval": {"status": "pending_review"},
    }
    print(json.dumps(prov, ensure_ascii=False))
    print("ready_for_review", all(prov["visual_checklist"].values()))

s21_ido_8()`,
 output: `{"run_id": "cpn2b-close-01", "data_sha1_8": "f2b0d009", "artifacts": ["dashboard.html", "results.xlsx", "informe.md"], "visual_checklist": {"dashboard": true, "xlsx": true, "doc": true}, "approval": {"status": "pending_review"}}
ready_for_review True`,
 },
 why: "Provenance + checklist visual cierran el Reporting Factory CP-N2-B.",
 }
 ],
 },
 weDo: {
 intro: "We Do — practica el mini-factory en piezas (T1→T4). Cada starter es un scaffold incompleto o incorrecto a propósito: completa el TODO, ejecuta y solo entonces compara con la solución. T1 fija context y missing; T2 exige archivos reales reabiertos; T3 estructura narrativa y paridad; T4 cierra con a11y y provenance. El You Do orquesta build_docx / build_pdf / extract_and_render / manifest en una corrida: no saltes a portfolio sin haber fallado y corregido al menos un DOCX y un PDF en T2.",
 steps: [
 {
 id: "S21-T1-A-E1",
 subtopicId: "S21-T1-A",
 kind: "guided",
 instruction:
 "E1 (guiado) — Concepto: portada Jinja del factory con context. Renderiza la plantilla `CASO-LIM-021 · {{ region }} (n={{ n }})` con region=\"Lima\" y n=40. Imprime solo el texto renderizado (sin comillas extra). El valor de región y n deben salir del context, no de un print hardcodeado.",
 hint: "Crea un Template y llama .render(region=..., n=...).",
 hints: [
 "Crea un Template y llama .render(region=..., n=...).",
 "No armes el string con f-string fuera de Jinja: el ejercicio entrena separación datos/plantilla.",
 ],
 edgeCases: ["n omitido en render → vacío en el hueco"],
 tests: "el print es exactamente CASO-LIM-021 · Lima (n=40)",
 feedback: "Si ves solo el prefijo o n vacío, el Template no está recibiendo region/n en .render().",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# Lab CASO-LIM-021 — portada Jinja del factory
# TODO: Template con {{ region }} y {{ n }}; no hardcodees la línea final
from jinja2 import Template
print("CASO-LIM-021 · Lima")`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `from jinja2 import Template
print(Template("CASO-LIM-021 · {{ region }} (n={{ n }})").render(region="Lima", n=40))`,
 output: `CASO-LIM-021 · Lima (n=40)`,
 },
 },
 {
 id: "S21-T1-A-E2",
 subtopicId: "S21-T1-A",
 kind: "independent",
 instruction:
 "E2 (independiente) — Concepto: template de KPI con mediana y n. Renderiza con Jinja la forma `{{ m }} PEN (n={{ n }})` usando m=28 y n=40. Imprime solo la cadena resultante.",
 hint: "Dos variables en el mismo Template.",
 hints: [
 "Dos variables en el mismo Template.",
 "Incluye la unidad PEN y el prefijo n=.",
 ],
 edgeCases: ["tipos str vs int"],
 tests: "el print es 28 PEN (n=40)",
 feedback: "Si falta «(n=40)», la plantilla no declara {{ n }} o no lo pasas en render.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# Lab CASO-LIM-021 — KPI multi-var
# TODO: incluye n={{ n }} en la plantilla
from jinja2 import Template
print(Template("{{ m }} PEN").render(m=28, n=40))`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `from jinja2 import Template
print(Template("{{ m }} PEN (n={{ n }})").render(m=28, n=40))`,
 output: `28 PEN (n=40)`,
 },
 },
 {
 id: "S21-T1-A-E3",
 subtopicId: "S21-T1-A",
 kind: "transfer",
 instruction:
 "E3 (transferencia) — Concepto: función reutilizable `render_kpi(ctx)`. Implementa una función que reciba un dict con region, median y n, y devuelva el string `{{ region }}: {{ median }} PEN (n={{ n }})` renderizado. Prueba con Cusco, 22.5 y n=32 (muestra distinta de Lima a propósito). Imprime el resultado.",
 hint: "Template dentro de la función o reutilizado; usa **ctx en render.",
 hints: [
 "Template dentro de la función o reutilizado; usa **ctx en render.",
 "No olvides n en la plantilla.",
 ],
 edgeCases: ["key error"],
 tests: "el print es Cusco: 22.5 PEN (n=32)",
 feedback: "Centraliza el template en la función: cada autor del informe no inventa su propio formato de KPI.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# Lab CASO-LIM-021 — render_kpi reutilizable
# TODO: la plantilla debe incluir n={{ n }}
from jinja2 import Template

def render_kpi(ctx):
 return Template("{{ region }}: {{ median }} PEN").render(**ctx)
print(render_kpi({"region": "Cusco", "median": 22.5, "n": 32}))`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `from jinja2 import Template

def render_kpi(ctx):
 return Template("{{ region }}: {{ median }} PEN (n={{ n }})").render(**ctx)
print(render_kpi({"region": "Cusco", "median": 22.5, "n": 32}))`,
 output: `Cusco: 22.5 PEN (n=32)`,
 },
 },
 {
 id: "S21-T1-B-E1",
 subtopicId: "S21-T1-B",
 kind: "guided",
 instruction:
 "E1 (guiado) — Concepto: missing → em-dash. Dado `median = None`, imprime `—` (em dash Unicode) en lugar de None o 0. No inventes un cero que distorsione totales.",
 hint: "Usa un condicional: si median is None → '—'.",
 hints: [
 "Usa un condicional: si median is None → '—'.",
 "Imprime solo el resultado de la celda.",
 ],
 edgeCases: ["NaN float"],
 tests: "el print es exactamente el em dash —",
 feedback: "Si imprimes 0 o None, el comité creerá que la mediana es cero. Missing se declara, no se inventa.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# Lab CASO-LIM-021 — missing como em-dash
# TODO: no imprimas None ni 0 cuando falta el dato
median = None
print(median)`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `median = None
print("—" if median is None else median)`,
 output: `—`,
 },
 },
 {
 id: "S21-T1-B-E2",
 subtopicId: "S21-T1-B",
 kind: "independent",
 instruction:
 "E2 (independiente) — Concepto: formato a 2 decimales. Dado `x = 28.456`, imprime el valor con exactamente dos decimales (redondeo de formato, no a ojo en el Word).",
 hint: "f-string con :.2f o formato equivalente.",
 hints: [
 "f-string con :.2f o formato equivalente.",
 "La salida esperada es 28.46.",
 ],
 edgeCases: ["locale comma"],
 tests: "el print es 28.46",
 feedback: "Formatea en Python (o con filtro Jinja explícito), no redondees «a ojo» en la plantilla.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# Lab CASO-LIM-021 — formato .2f
# TODO: formatea a dos decimales
x = 28.456
print(x)`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `x = 28.456
print(f"{x:.2f}")`,
 output: `28.46`,
 },
 },
 {
 id: "S21-T1-B-E3",
 subtopicId: "S21-T1-B",
 kind: "transfer",
 instruction:
 "E3 (transferencia) — Concepto: bucle Jinja de filas. Con un Template, itera `rows` y emite una línea `region:v` por fila (sin espacios extra). Datos: Lima→1, Cusco→2. Imprime el bloque completo (dos líneas, no unidas por |).",
 hint: "Usa {% for r in rows %} … {% endfor %} con region y v.",
 hints: [
 "Usa {% for r in rows %} … {% endfor %} con region y v.",
 "Termina cada fila con salto de línea; evita unir con |.",
 ],
 edgeCases: ["rows vacías"],
 tests: "dos líneas: Lima:1 y Cusco:2",
 feedback: "Cada fila del context debe producir su propia línea; un pipe entre regiones no es tabla serializable.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# Lab CASO-LIM-021 — jinja for de filas
# TODO: itera rows y emite region:v por línea
from jinja2 import Template
tmpl = Template("static")
print(tmpl.render(rows=[{"region": "Lima", "v": 1}, {"region": "Cusco", "v": 2}]), end="")`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `from jinja2 import Template
tmpl = Template("{% for r in rows %}{{ r.region }}:{{ r.v }}\\n{% endfor %}")
print(tmpl.render(rows=[{"region": "Lima", "v": 1}, {"region": "Cusco", "v": 2}]), end="")`,
 output: `Lima:1
Cusco:2`,
 },
 },
 {
 id: "S21-T2-A-E1",
 subtopicId: "S21-T2-A",
 kind: "guided",
 instruction:
 "E1 (guiado) — Concepto: DOCX con heading y n=. Crea un Document, agrega heading de título, heading Resumen y un párrafo con n=40; guarda, reabre y verifica. Salida esperada (dos líneas): primera `True True` (existe + firma PK); segunda `True True` (contiene Resumen y n=40).",
 hint: "Usa Document(), add_heading(), add_paragraph(), save() y vuelve a abrir la ruta.",
 hints: [
 "La firma de un DOCX comienza con bytes PK porque es un paquete ZIP.",
 "Extrae p.text de los párrafos no vacíos del documento reabierto.",
 ],
 edgeCases: ["ruta no escribible", "documento sin párrafos"],
 tests: "dos líneas True True: archivo+PK, luego Resumen y n=40 en texto reabierto",
 feedback: "Si el segundo True falla, el heading Resumen o el párrafo n=40 no están en el archivo guardado (no en un dict en memoria).",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# Lab CASO-LIM-021 — docx con Resumen y n=
# TODO: usa add_heading para Resumen e incluye n=40 en un párrafo
from pathlib import Path
from docx import Document

path = Path("informe.docx")
doc = Document()
doc.add_paragraph("Informe sintético")
doc.save(path)
opened = Document(path)
text = " | ".join(p.text for p in opened.paragraphs if p.text)
print(path.exists(), path.read_bytes()[:2] == b"PK")
print("Resumen" in text, "n=40" in text)`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `from pathlib import Path
from docx import Document

path = Path("informe.docx")
doc = Document()
doc.add_heading("Informe sintético", 0)
doc.add_heading("Resumen", 1)
doc.add_paragraph("Muestra reconciliada: n=40")
doc.save(path)
opened = Document(path)
text = " | ".join(p.text for p in opened.paragraphs if p.text)
print(path.exists(), path.read_bytes()[:2] == b"PK")
print("Resumen" in text, "n=40" in text)`,
 output: `True True
True True`,
 },
 },
 {
 id: "S21-T2-A-E2",
 subtopicId: "S21-T2-A",
 kind: "independent",
 instruction:
 "E2 (independiente) — Concepto: conteo de estilos Heading. Con levels = Resumen(1), Método(2), Anexos(1), crea headings reales, guarda y reabre. Imprime el conteo de Heading 1 y la lista de style.name de los párrafos con texto.",
 hint: "Cada párrafo reabierto expone style.name.",
 hints: [
 "Filtra exactamente Heading 1 y conserva también la jerarquía completa.",
 "La evidencia debe provenir del archivo guardado, no del input original.",
 ],
 edgeCases: ["heading sin texto", "estilo Normal"],
 tests: "conteo 2 y lista ['Heading 1', 'Heading 2', 'Heading 1']",
 feedback: "add_paragraph con negrita no es Heading: al reabrir, style.name debe ser Heading 1/2.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# Lab CASO-LIM-021 — estilos Heading reales
# TODO: usa add_heading(text, level), no solo add_paragraph
from docx import Document

levels = [("Resumen", 1), ("Método", 2), ("Anexos", 1)]
doc = Document()
for text, level in levels:
 doc.add_paragraph(text)
doc.save("estructura.docx")
opened = Document("estructura.docx")
styles = [p.style.name for p in opened.paragraphs if p.text]
print(styles.count("Heading 1"))
print(styles)`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `from docx import Document

levels = [("Resumen", 1), ("Método", 2), ("Anexos", 1)]
doc = Document()
for text, level in levels:
 doc.add_heading(text, level)
doc.save("estructura.docx")
opened = Document("estructura.docx")
styles = [p.style.name for p in opened.paragraphs if p.text]
print(styles.count("Heading 1"))
print(styles)`,
 output: `2
['Heading 1', 'Heading 2', 'Heading 1']`,
 },
 },
 {
 id: "S21-T2-A-E3",
 subtopicId: "S21-T2-A",
 kind: "transfer",
 instruction:
 "E3 (transferencia) — Concepto: tabla DOCX con missing como —. Construye una tabla métrica/valor con Ticket mediano=28.0 y Reclamos=— (no 0). Guarda, reabre e imprime la fila 1 de datos y la fila 2 junto con un booleano que confirme que el valor no es \"0\".",
 hint: "Usa add_table(rows=1, cols=2), agrega filas y lee cell.text del documento reabierto.",
 hints: [
 "La tabla debe contener columnas métrica y valor.",
 "Representa el dato faltante como em dash, no como 0.",
 ],
 edgeCases: ["missing", "tabla vacía"],
 tests: "filas reabiertas: Ticket mediano/28.0 y Reclamos/— con booleano True",
 feedback: "Reclamos=0 en la celda es un error de reporting: el revisor debe leer — al reabrir el DOCX.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# Lab CASO-LIM-021 — tabla con missing honesto
# TODO: Reclamos debe ser — (em dash), no 0
from docx import Document

metrics = [("Ticket mediano", "28.0"), ("Reclamos", "0")]
doc = Document()
doc.add_heading("Auditoría", 1)
table = doc.add_table(rows=1, cols=2)
table.rows[0].cells[0].text = "Métrica"
table.rows[0].cells[1].text = "Valor"
for name, value in metrics:
 cells = table.add_row().cells
 cells[0].text, cells[1].text = name, value
doc.save("auditoria.docx")
opened = Document("auditoria.docx")
rows = [[c.text for c in row.cells] for row in opened.tables[0].rows]
print(rows[1])
print(rows[2], rows[2][1] != "0")`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `from docx import Document

metrics = [("Ticket mediano", "28.0"), ("Reclamos", "—")]
doc = Document()
doc.add_heading("Auditoría", 1)
table = doc.add_table(rows=1, cols=2)
table.rows[0].cells[0].text = "Métrica"
table.rows[0].cells[1].text = "Valor"
for name, value in metrics:
 cells = table.add_row().cells
 cells[0].text, cells[1].text = name, value
doc.save("auditoria.docx")
opened = Document("auditoria.docx")
rows = [[c.text for c in row.cells] for row in opened.tables[0].rows]
print(rows[1])
print(rows[2], rows[2][1] != "0")`,
 output: `['Ticket mediano', '28.0']
['Reclamos', '—'] True`,
 },
 },
 {
 id: "S21-T2-B-E1",
 subtopicId: "S21-T2-B",
 kind: "guided",
 instruction:
 "E1 (guiado) — Concepto: PDF digital con texto extraíble. Genera un PDF con ReportLab que incluya n=40 en el canvas; verifica firma %PDF y que pypdf extraiga el texto con n=40. Imprime dos booleanos (uno por línea).",
 hint: "Canvas.drawString()+save(); luego PdfReader(path).pages[0].extract_text().",
 hints: [
 "Comprueba primero los bytes %PDF.",
 "No declares digital sin extraer texto del archivo.",
 ],
 edgeCases: ["PDF corrupto", "capa de texto vacía"],
 tests: "dos líneas True: firma %PDF y n=40 en extract_text",
 feedback: "drawString crea capa de texto; si n=40 no aparece en extract_text, el canvas no lo escribió antes de save().",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# Lab CASO-LIM-021 — PDF con capa de texto
# TODO: incluye n=40 en el drawString
from pathlib import Path
from pypdf import PdfReader
from reportlab.pdfgen import canvas

path = Path("digital.pdf")
c = canvas.Canvas(str(path))
c.drawString(72, 760, "Resumen sintetico")
c.save()
text = PdfReader(path).pages[0].extract_text() or ""
print(path.read_bytes()[:4] == b"%PDF")
print("n=40" in text)`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `from pathlib import Path
from pypdf import PdfReader
from reportlab.pdfgen import canvas

path = Path("digital.pdf")
c = canvas.Canvas(str(path))
c.drawString(72, 760, "Resumen sintetico n=40")
c.save()
text = PdfReader(path).pages[0].extract_text() or ""
print(path.read_bytes()[:4] == b"%PDF")
print("n=40" in text)`,
 output: `True
True`,
 },
 },
 {
 id: "S21-T2-B-E2",
 subtopicId: "S21-T2-B",
 kind: "independent",
 instruction:
 "E2 (independiente) — Concepto: render de página a PNG. Genera un PDF, renderiza la primera página a PNG con PyMuPDF (fitz) y verifica que ambos archivos tienen tamaño positivo. Imprime los dos booleanos en una línea.",
 hint: "Abre con fitz.open(path), usa get_pixmap() y save().",
 hints: [
 "Cierra o conserva el documento mientras accedes a la página.",
 "Verifica tamaño positivo, no solo el nombre del archivo.",
 ],
 edgeCases: ["PDF sin páginas", "ruta PNG no escribible"],
 tests: "True True: PDF y PNG con st_size > 0",
 feedback: "La extracción prueba la capa digital; el PNG prueba legibilidad visual. Ambas evidencias son archivos reales.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# Lab CASO-LIM-021 — PDF a PNG
# TODO: renderiza la página 0 a png con fitz
from pathlib import Path
from reportlab.pdfgen import canvas

pdf, png = Path("render.pdf"), Path("render-p1.png")
c = canvas.Canvas(str(pdf))
c.drawString(72, 760, "Hallazgo H1")
c.save()
print(pdf.stat().st_size > 0, png.exists())`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `from pathlib import Path
import fitz
from reportlab.pdfgen import canvas

pdf, png = Path("render.pdf"), Path("render-p1.png")
c = canvas.Canvas(str(pdf))
c.drawString(72, 760, "Hallazgo H1")
c.save()
document = fitz.open(pdf)
document[0].get_pixmap().save(png)
print(pdf.stat().st_size > 0, png.stat().st_size > 0)`,
 output: `True True`,
 },
 },
 {
 id: "S21-T2-B-E3",
 subtopicId: "S21-T2-B",
 kind: "transfer",
 instruction:
 "E3 (transferencia) — Concepto: PDF imagen-only → needs_ocr. Dibuja texto en un PNG, insértalo como imagen en un PDF (sin drawString de texto), extrae con pypdf. Imprime si es PDF válido y si n=17 NO está en la capa de texto; luego un dict con needs_ocr y n_chars.",
 hint: "Pillow dibuja el PNG; reportlab.drawImage lo inserta como imagen; la extracción vacía activa abstención.",
 hints: [
 "No agregues texto con drawString al PDF: eso crearía capa digital.",
 "Normaliza extract_text() or '' antes de strip().",
 ],
 edgeCases: ["OCR no instalado", "extracción devuelve None"],
 tests: "True True y dict needs_ocr=True con n_chars=0",
 feedback: "Si needs_ocr queda False, o inventaste texto o usaste drawString. Abstente: no finjas PDF digital.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# Lab CASO-LIM-021 — scan needs_ocr
# TODO: needs_ocr debe ser True cuando no hay capa de texto
from pathlib import Path
from PIL import Image, ImageDraw
from pypdf import PdfReader
from reportlab.pdfgen import canvas

png, pdf = Path("scan.png"), Path("scan.pdf")
image = Image.new("RGB", (500, 120), "white")
ImageDraw.Draw(image).text((20, 40), "Documento sintetico n=17", fill="black")
image.save(png)
c = canvas.Canvas(str(pdf), pagesize=(500, 120))
c.drawImage(str(png), 0, 0, width=500, height=120)
c.save()
text = PdfReader(pdf).pages[0].extract_text() or ""
print(pdf.read_bytes()[:4] == b"%PDF", "n=17" in text)
print({"needs_ocr": False, "n_chars": len(text)})`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `from pathlib import Path
from PIL import Image, ImageDraw
from pypdf import PdfReader
from reportlab.pdfgen import canvas

png, pdf = Path("scan.png"), Path("scan.pdf")
image = Image.new("RGB", (500, 120), "white")
ImageDraw.Draw(image).text((20, 40), "Documento sintetico n=17", fill="black")
image.save(png)
c = canvas.Canvas(str(pdf), pagesize=(500, 120))
c.drawImage(str(png), 0, 0, width=500, height=120)
c.save()
text = PdfReader(pdf).pages[0].extract_text() or ""
print(pdf.read_bytes()[:4] == b"%PDF", "n=17" not in text)
print({"needs_ocr": not bool(text.strip()), "n_chars": len(text)})`,
 output: `True True
{'needs_ocr': True, 'n_chars': 0}`,
 },
 },
 {
 id: "S21-T3-A-E1",
 subtopicId: "S21-T3-A",
 kind: "guided",
 instruction:
 "E1 (guiado) — Concepto: hallazgo H→evidencia (y hallazgo ≠ decisión). Construye un dict con id H1, evidencia Tabla1 y decision=None. Imprime id, evidencia y un booleano que confirme que decision es None (una sola línea, espacios entre valores).",
 hint: "Incluye decision: None; print id, evidencia y (decision is None).",
 hints: [
 "Dict con id, evidencia y decision.",
 "print(h['id'], h['evidencia'], h['decision'] is None).",
 ],
 edgeCases: ["id duplicado", "decision con texto de acción"],
 tests: "print H1 Tabla1 True",
 feedback: "Sin id de evidencia el hallazgo no es auditable; decision=None recuerda que hallazgo ≠ decisión de negocio.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# Lab CASO-LIM-021 — hallazgo H→evidencia
# TODO: imprime id, evidencia y (decision is None)
h = {"id": "H1", "evidencia": "Tabla1", "decision": None}
print(h["evidencia"])`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `h = {"id": "H1", "evidencia": "Tabla1", "decision": None}
print(h["id"], h["evidencia"], h["decision"] is None)`,
 output: `H1 Tabla1 True`,
 },
 },
 {
 id: "S21-T3-A-E2",
 subtopicId: "S21-T3-A",
 kind: "independent",
 instruction:
 "E2 (independiente) — Concepto: validar resumen ejecutivo auditable. Un resumen de CASO-LIM-021 es válido solo si menciona el marcador `n=` (tamaño muestral) y la unidad `PEN` (métrica de ticket). Dado el string del starter, corrígelo e imprime un solo booleano: True si cumple ambas condiciones.",
 hint: "Usa el operador in dos veces (n= y PEN) con and.",
 hints: [
 "Ambas subcadenas deben aparecer: n= y PEN.",
 "No basta con el número 28 sin unidad ni n.",
 ],
 edgeCases: ["n sin =", "pen minúscula"],
 tests: "print True cuando el resumen incluye n= y PEN",
 feedback: "Un resumen sin n= o sin PEN es eslogan: el revisor no puede reconciliar tamaño de muestra ni unidad con el EDA/S20.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# Lab CASO-LIM-021 — resumen auditable (n= + PEN)
# TODO: el resumen debe incluir n= y PEN; valida ambas
s = "mediana 28"
print("n=" in s)`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `s = "mediana 28 PEN n=40"
print("n=" in s and "PEN" in s)`,
 output: `True`,
 },
 },
 {
 id: "S21-T3-A-E3",
 subtopicId: "S21-T3-A",
 kind: "transfer",
 instruction:
 "E3 (transferencia) — Concepto: pack_report con tres claves. Implementa `pack_report(resumen, metodo, hallazgos)` que devuelva un dict con exactamente las claves resumen, metodo y hallazgos. Imprime las claves ordenadas.",
 hint: "Devuelve un dict con las tres claves; usa sorted(...keys()).",
 hints: [
 "Devuelve un dict con las tres claves.",
 "print(sorted(pack_report(...).keys())).",
 ],
 edgeCases: ["tipos"],
 tests: "claves ordenadas: hallazgos, metodo, resumen",
 feedback: "Si falta metodo, el paquete no separa método de opinión: la estructura de tres claves es el contrato.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# Lab CASO-LIM-021 — pack_report
# TODO: incluye la clave metodo en el dict
def pack_report(resumen, metodo, hallazgos):
 return {"resumen": resumen, "hallazgos": hallazgos}
print(sorted(pack_report(["a"], {}, []).keys()))`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `def pack_report(resumen, metodo, hallazgos):
 return {"resumen": resumen, "metodo": metodo, "hallazgos": hallazgos}
print(sorted(pack_report(["a"], {}, []).keys()))`,
 output: `['hallazgos', 'metodo', 'resumen']`,
 },
 },
 {
 id: "S21-T3-B-E1",
 subtopicId: "S21-T3-B",
 kind: "guided",
 instruction:
 "E1 (guiado) — Concepto: paridad dash↔doc y limitaciones visibles. Arma un paquete con `dash`, `doc` (misma mediana Lima 28.0) y `limits=[\"solo web\"]`. Imprime dos booleanos en una línea: paridad de métricas y presencia de la limitación web-only.",
 hint: "Compara dash == doc y verifica \"solo web\" in limits.",
 hints: [
 "Ambos dicts deben llevar median_Lima=28.0.",
 "La lista limits debe incluir el string exacto \"solo web\".",
 ],
 edgeCases: ["float vs int", "limits vacía"],
 tests: "print True True (paridad y limitación presentes)",
 feedback: "Paridad sin límites es incompleta: el lector debe ver «solo web» junto a las métricas reconciliadas.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# Lab CASO-LIM-021 — paridad dash/doc + limits
# TODO: alinea median_Lima y declara limits web-only
package = {
 "dash": {"median_Lima": 28.0},
 "doc": {"median_Lima": 27.0},
 "limits": [],
}
print(package["dash"] == package["doc"], "solo web" in package["limits"])`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `package = {
 "dash": {"median_Lima": 28.0},
 "doc": {"median_Lima": 28.0},
 "limits": ["solo web"],
}
print(package["dash"] == package["doc"], "solo web" in package["limits"])`,
 output: `True True`,
 },
 },
 {
 id: "S21-T3-B-E2",
 subtopicId: "S21-T3-B",
 kind: "independent",
 instruction:
 "E2 (independiente) — Concepto: caption con campo Fuente visible. Construye un caption de figura que incluya la palabra Fuente (más n). Imprime True si \"Fuente\" aparece en el caption.",
 hint: "Incluye un segmento | Fuente: … en el string.",
 hints: [
 "Incluye un segmento | Fuente: … en el string.",
 "Verifica con el operador in.",
 ],
 edgeCases: ["fuente minúscula"],
 tests: "print True cuando el caption declara Fuente",
 feedback: "Un pie sin «Fuente» impide reconciliar la figura con el dataset del factory.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# Lab CASO-LIM-021 — caption con Fuente
# TODO: el caption debe declarar Fuente de forma visible
cap = "Fig1 | n=10"
print("Fuente" in cap)`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `cap = "Fig1 | Fuente: sintético | n=10"
print("Fuente" in cap)`,
 output: `True`,
 },
 },
 {
 id: "S21-T3-B-E3",
 subtopicId: "S21-T3-B",
 kind: "transfer",
 instruction:
 "E3 (transferencia) — Concepto: checksum de métricas entre tres artefactos. Implementa `check_parity(a, b, c)` que sea True solo si a == b == c. Imprime el resultado para un caso alineado y uno divergente (dos líneas).",
 hint: "return a == b == c.",
 hints: [
 "return a == b == c.",
 "Dos prints: caso True y caso False.",
 ],
 edgeCases: ["keys extra"],
 tests: "dos líneas: True luego False",
 feedback: "Comparar solo a==b deja pasar un DOCX divergente: el cierre exige a==b==c (dash, xlsx, doc).",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# Lab CASO-LIM-021 — check_parity tres vías
# TODO: compara a, b y c (no solo a==b)
def check_parity(a, b, c):
 return a == b
print(check_parity({"x": 1}, {"x": 1}, {"x": 1}))
print(check_parity({"x": 1}, {"x": 1}, {"x": 2}))`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `def check_parity(a, b, c):
 return a == b == c
print(check_parity({"x": 1}, {"x": 1}, {"x": 1}))
print(check_parity({"x": 1}, {"x": 1}, {"x": 2}))`,
 output: `True
False`,
 },
 },
 {
 id: "S21-T4-A-E1",
 subtopicId: "S21-T4-A",
 kind: "guided",
 instruction:
 "E1 (guiado) — Concepto: precisión a 1 decimal en métricas PEN. Dada la lista vals = [28.04, 28.0], imprime la lista redondeada a 1 decimal para unificar precisión en dashboard, Excel e informe.",
 hint: "list comprehension con round(v, 1).",
 hints: [
 "list comprehension con round(v, 1).",
 "No uses round a 0 decimales.",
 ],
 edgeCases: ["banker's rounding"],
 tests: "print [28.0, 28.0]",
 feedback: "Si redondeas a 0 decimales, 28.04 y 28.0 divergen del contrato de 1 decimal PEN del factory.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# Lab CASO-LIM-021 — precisión 1 decimal
# TODO: redondea a 1 decimal, no a 0
vals = [28.04, 28.0]
print([round(v, 0) for v in vals])`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `vals = [28.04, 28.0]
print([round(v, 1) for v in vals])`,
 output: `[28.0, 28.0]`,
 },
 },
 {
 id: "S21-T4-A-E2",
 subtopicId: "S21-T4-A",
 kind: "independent",
 instruction:
 "E2 (independiente) — Concepto: formateo centralizado `fmt_pen` con unidad. Implementa `fmt_pen(x)` que devuelva el valor a 1 decimal seguido de ` PEN`. Prueba con 28.04 e imprime el string.",
 hint: "f-string con round(float(x), 1) y sufijo PEN.",
 hints: [
 "f-string con round(float(x), 1) y sufijo PEN.",
 "La unidad evita divergencias entre plantillas.",
 ],
 edgeCases: ["None"],
 tests: "print 28.0 PEN",
 feedback: "Sin unidad en el formatter, Jinja y Excel inventan sufijos distintos; centraliza fmt_pen.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# Lab CASO-LIM-021 — fmt_pen centralizado
# TODO: incluye la unidad PEN en el string
def fmt_pen(x):
 return f"{round(float(x), 1)}"
print(fmt_pen(28.04))`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `def fmt_pen(x):
 return f"{round(float(x), 1)} PEN"
print(fmt_pen(28.04))`,
 output: `28.0 PEN`,
 },
 },
 {
 id: "S21-T4-A-E3",
 subtopicId: "S21-T4-A",
 kind: "transfer",
 instruction:
 "E3 (transferencia) — Concepto: checklist mínima a11y (H1 + alt con longitud). Implementa `a11y_min(has_h1, alts)` que sea True solo si hay H1 y todos los alt tienen más de 10 caracteres. Imprime el resultado para un caso válido y uno con alt corto.",
 hint: "has_h1 and all(len(a) > 10 for a in alts).",
 hints: [
 "has_h1 and all(len(a) > 10 for a in alts).",
 "Dos prints: True y False.",
 ],
 edgeCases: ["alts vacía"],
 tests: "dos líneas: True luego False",
 feedback: "has_h1 solo no basta: un alt de 5 caracteres no describe n ni unidad para tecnología asistiva.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# Lab CASO-LIM-021 — a11y_min H1 + alts
# TODO: exige longitud útil en cada alt, no solo has_h1
def a11y_min(has_h1, alts):
 return has_h1
print(a11y_min(True, ["descripcion larga de figura"]))
print(a11y_min(True, ["corto"]))`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `def a11y_min(has_h1, alts):
 return has_h1 and all(len(a) > 10 for a in alts)
print(a11y_min(True, ["descripcion larga de figura"]))
print(a11y_min(True, ["corto"]))`,
 output: `True
False`,
 },
 },
 {
 id: "S21-T4-B-E1",
 subtopicId: "S21-T4-B",
 kind: "guided",
 instruction:
 "E1 (guiado) — Concepto: manifiesto de provenance. Construye un dict con run_id, data_sha1_8 y approval.status. Imprime run_id y el status de aprobación en una línea (espacio entre ambos).",
 hint: "Incluye run_id, huella corta y approval anidado.",
 hints: [
 "Incluye run_id, huella corta y approval anidado.",
 "print(prov['run_id'], prov['approval']['status']).",
 ],
 edgeCases: ["typo status"],
 tests: "print cpn2b-01 pending_review",
 feedback: "No hardcodees «approved»: el cierre de contenido deja pending_review hasta revisión humana (S22).",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# Lab CASO-LIM-021 — manifiesto de provenance
# TODO: imprime run_id y status (no hardcodees approved)
prov = {
 "run_id": "cpn2b-01",
 "data_sha1_8": "385fcd67",
 "approval": {"status": "pending_review"},
}
print("approved")`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `prov = {
 "run_id": "cpn2b-01",
 "data_sha1_8": "385fcd67",
 "approval": {"status": "pending_review"},
}
print(prov["run_id"], prov["approval"]["status"])`,
 output: `cpn2b-01 pending_review`,
 },
 },
 {
 id: "S21-T4-B-E2",
 subtopicId: "S21-T4-B",
 kind: "independent",
 instruction:
 "E2 (independiente) — Concepto: huella corta de payload (lab). Calcula sha1 de b\"synthetic\" y muestra solo los primeros 8 hex. (En producción preferirás SHA-256 del artefacto completo; aquí el recorte es id didáctico.)",
 hint: "hashlib.sha1(...).hexdigest()[:8].",
 hints: [
 "hashlib.sha1(...).hexdigest()[:8].",
 "No imprimes el digest completo.",
 ],
 edgeCases: ["encoding"],
 tests: "print 385fcd67",
 feedback: "El recorte de 8 hex es id de lab; en producción firma el artefacto completo con SHA-256.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# Lab CASO-LIM-021 — huella corta de lab
# TODO: imprime solo los primeros 8 hex del sha1
import hashlib
print(hashlib.sha1(b"synthetic").hexdigest())`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `import hashlib
print(hashlib.sha1(b"synthetic").hexdigest()[:8])`,
 output: `385fcd67`,
 },
 },
 {
 id: "S21-T4-B-E3",
 subtopicId: "S21-T4-B",
 kind: "transfer",
 instruction:
 "E3 (transferencia) — Concepto: ready(checklist) del paquete. Implementa `ready(checklist)` que sea True solo si todos los valores del dict son True (dashboard, xlsx, doc). Imprime el resultado para checklist completa e incompleta.",
 hint: "all(checklist.values()).",
 hints: [
 "all(checklist.values()).",
 "No uses any(): un artefacto fallido bloquea el cierre.",
 ],
 edgeCases: ["keys faltantes"],
 tests: "dos líneas: True luego False",
 feedback: "any() aprueba con un solo artefacto listo; el factory exige all() (dashboard + xlsx + doc).",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# Lab CASO-LIM-021 — ready checklist
# TODO: exige all(), no any()
def ready(checklist):
 return any(checklist.values())
print(ready({"dashboard": True, "xlsx": True, "doc": True}))
print(ready({"dashboard": True, "xlsx": False, "doc": True}))`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `def ready(checklist):
 return all(checklist.values())
print(ready({"dashboard": True, "xlsx": True, "doc": True}))
print(ready({"dashboard": True, "xlsx": False, "doc": True}))`,
 output: `True
False`,
 },
 }
 ],
 },
 youDo: {
 title: "Reporting Factory — cierre CP-N2-B",
 context:
 "En un comité de analytics en Lima te piden el **paquete único** de CASO-LIM-021: no tres exports sueltos, sino una corrida que una EDA (S18), dashboard (S19) y Excel (S20) en un **factory de reportes trazables**. El entregable cierra **CP-N2-B**: DOCX y PDF con los mismos números (mediana Lima 28.0 PEN, n=40, cobertura solo web), captions con Fuente, missing como —, provenance y cola `pending_review`. Datos sintéticos únicamente; sin PII. El siguiente paso del currículum (S22) envía/aprueba — aquí dejas el paquete listo para revisión humana.",
 objectives: [
 "Un solo context Jinja (run_id, métricas, limits) reutilizado en todos los artefactos",
 "DOCX con Heading reales + PDF digital; reabrir, extraer y renderizar PNG",
 "Paridad de median_Lima y n_Lima entre context, DOCX y PDF",
 "fmt_pen / precisión 1 decimal y checklist a11y mínima en el paquete",
 "Manifiesto JSON: run_id, huella, artefacts, visual_checklist, approval=pending_review",
 ],
 requirements: [
 "Sin PII real ni secretos en el repo ni en los artefactos",
 "Hallazgos con id y evidencia (H1→Tabla1); decision=None hasta revisión de negocio",
 "Missing ≠ 0 (usa — en tablas si un KPI no aplica)",
 "Paridad documentada: mismos n y mediana en DOCX, PDF y context; PNG con tamaño > 0",
 "Narrativa ejecutiva en español profesional (es-PE)",
 "Manifiesto con run_id, data_sha1_8 (lab), lista/hashes de artefactos y approval.status",
 "No marques approved: el estado de cierre de contenido es pending_review",
 ],
 starterCode: `from pathlib import Path
from jinja2 import Template
from docx import Document
from pypdf import PdfReader
from reportlab.pdfgen import canvas
import fitz, hashlib, json

context = {
    "run_id": "cpn2b-01",
    "median_Lima": 28.0,
    "n_Lima": 40,
    "limits": ["solo web"],
    "hallazgos": [
        {"id": "H1", "texto": "Lima > Cusco en mediana", "evidencia": "Tabla1", "decision": None},
    ],
}

# Mini-factory CP-N2-B — implementa cada función y reutiliza el mismo context.
# Criterios de aceptación (el revisor los ejecutará mentalmente o con scripts):
# 1) build_docx(ctx) → Path: estilos Heading (Resumen), incluye median_Lima y n_Lima;
#    al reabrir, el texto extraído contiene esos valores (no solo el Document en memoria).
# 2) build_pdf(ctx) → Path digital: pypdf extrae n=40 (o n_Lima) de la capa de texto.
# 3) extract_and_render(pdf) → (texto, Path png) con png.stat().st_size > 0.
# 4) manifest(artifacts) → dict JSON-serializable con run_id, data_sha1_8,
#    artefacts (rutas o hashes), visual_checklist {dashboard,xlsx,doc} y
#    approval.status == "pending_review" (nunca "approved" hardcodeado).
# 5) Paridad: median_Lima y n_Lima del DOCX/PDF coinciden con context.
# 6) Opcional pero recomendado: un Template Jinja para la línea de KPI a partir del context.
# S22 no aprueba sin checklist visual True en dashboard/xlsx/doc.

def build_docx(ctx: dict) -> Path:
    """Crea informe.docx con estilos Heading reales y métricas del context."""
    # COMPLETAR: Document → add_heading("Resumen", 1) → párrafo con mediana y n → save
    raise NotImplementedError("build_docx: DOCX con Heading + métricas del context")

def build_pdf(ctx: dict) -> Path:
    """Crea informe.pdf digital (texto seleccionable) con n y mediana."""
    # COMPLETAR: canvas.drawString con n_Lima; firma %PDF
    raise NotImplementedError("build_pdf: ReportLab + capa de texto con n")

def extract_and_render(pdf: Path):
    """Devuelve (texto_extraido, png_path) con PNG de tamaño > 0."""
    # COMPLETAR: PdfReader extract + fitz pixmap → PNG
    raise NotImplementedError("extract_and_render: texto + PNG")

def manifest(artifacts: dict) -> dict:
    """Manifiesto de provenance listo para cola pending_review."""
    # COMPLETAR: run_id, data_sha1_8, checklist, approval
    raise NotImplementedError("manifest: provenance + pending_review")

# Orquestación de una corrida (descomenta cuando las funciones pasen):
# docx_path = build_docx(context)
# pdf_path = build_pdf(context)
# text, png_path = extract_and_render(pdf_path)
# pack = manifest({"docx": str(docx_path), "pdf": str(pdf_path), "png": str(png_path)})
# assert pack["approval"]["status"] == "pending_review"
# print(json.dumps(pack, indent=2, ensure_ascii=False))
`,
 portfolioNote:
 "Paquete final CP-N2-B: dashboard + xlsx + informe (DOCX/PDF/PNG) con provenance y checklist visual; listo para revisión humana antes del flujo de email/aprobación en S22. No marques el paquete como aprobado desde el código del factory.",
 rubric: [
 { criterion: "Artefactos DOCX/PDF reales, reabiertos, con paridad de métricas y provenance", weight: "25%" },
 { criterion: "Correctitud técnica en entorno declarado (venv + deps del lab)", weight: "20%" },
 { criterion: "Privacidad / sin PII real / sin secretos", weight: "20%" },
 { criterion: "Pruebas o casos de borde documentados (missing, needs_ocr, parity fail)", weight: "15%" },
 { criterion: "Código legible y límites claros (context único, fmt centralizado)", weight: "10%" },
 { criterion: "Documentación en español profesional (es-PE)", weight: "10%" }
 ],
 },
 selfCheck: {
 questions: [
 {
 question: "¿Por qué separar datos y plantilla Jinja?",
 options: ["Para reutilizar presentación y auditar métricas en Python", "Para mezclar SQL en el HTML", "Para evitar control de versiones", "Para ocultar n"],
 correctIndex: 0,
 explanation:
 "La lógica y métricas viven en Python; la plantilla presenta. Así auditas números una sola vez y reutilizas el mismo context en DOCX, PDF y otros canales.",
 },
 {
 question: "Un PDF con casi sin caracteres en capa de texto suele requerir:",
 options: ["Ignorar el archivo", "Solo openpyxl", "OCR / tratamiento de imagen", "Borrar limitaciones"],
 correctIndex: 2,
 explanation:
 "Baja densidad de texto sugiere escaneo/imagen. El contrato marca needs_ocr; no inventa extracción.",
 },
 {
 question: "Paridad en el Reporting Factory significa:",
 options: ["Mismos colores", "Mismo número de páginas", "Mismo reviewer", "Mismas métricas clave en dashboard, Excel y documento"],
 correctIndex: 3,
 explanation:
 "Números reconciliados entre artefactos: el comité no debe ver 28 en Excel y 30 en el DOCX.",
 },
 {
 question: "El cierre de contenido de CP-N2-B incluye:",
 options: ["Solo un print de éxito", "Provenance, checklist visual y hallazgos trazables", "Subir secretos al repo", "Omitir el PDF si el DOCX se ve bien"],
 correctIndex: 1,
 explanation:
 "El factory cierra con artefactos verificables: provenance, revisión visual y hallazgos con evidencia. Un print no sustituye el paquete.",
 },
 {
 question: "El PDF del informe se generó dibujando texto dentro de una imagen; pypdf no extrae capa de texto. ¿Qué debe devolver el contrato de trazabilidad?",
 options: ["Marcar needs_ocr (o equivalente) y no fingir PDF digital nativo", "Inventar el texto del resumen a partir del título del archivo", "Aprobar el paquete igual porque el PNG se ve legible en pantalla", "Convertir el PDF a DOCX sin avisar en el provenance"],
 correctIndex: 0,
 explanation:
 "PDF imagen-only no es texto seleccionable. El contrato documenta needs_ocr; no inventa extracción ni oculta el modo en provenance.",
 },
 {
 question: "Si la mediana de Cusco no está disponible, ¿cómo debe representarse en el informe?",
 options: ["0.00 para no romper la tabla", "El promedio de Lima", "— (em dash) y documentar missing", "null sin mención en el caption"],
 correctIndex: 2,
 explanation:
 "Missing ≠ 0. Imprimir 0.00 distorsiona sumas y engaña al comité; usa — y declara la ausencia.",
 },
 {
 question: "¿Qué distingue un heading real en un DOCX trazable?",
 options: ["Solo negrita y tamaño 16", "Un comentario HTML en el XML", "El nombre del archivo empieza con Informe", "Estilo Heading 1/2 de Word, verificable al reabrir"],
 correctIndex: 3,
 explanation:
 "La auditoría reabre el DOCX y lee style.name (Heading 1, …). La negrita visual sola no es un outline auditable.",
 },
 ],
 },
 resources: {
 docs: [
 {
 label: "Jinja2 documentation",
 url: "https://jinja.palletsprojects.com/",
 note: "Templates y sandbox",
 },
 {
 label: "Jinja template designer docs",
 url: "https://jinja.palletsprojects.com/en/stable/templates/",
 note: "Sintaxis, filters, autoescape",
 },
 {
 label: "python-docx documentation",
 url: "https://python-docx.readthedocs.io/",
 note: "DOCX real: estilos y extracción",
 },
 {
 label: "ReportLab user guide",
 url: "https://www.reportlab.com/docs/reportlab-userguide.pdf",
 note: "PDF digital programático (referencia)",
 },
 {
 label: "pypdf docs",
 url: "https://pypdf.readthedocs.io/",
 note: "extracción de texto PDF digital",
 },
 {
 label: "WCAG standards",
 url: "https://www.w3.org/WAI/standards-guidelines/wcag/",
 note: "Accesibilidad de contenidos",
 },
 {
 label: "hashlib — provenance hashes",
 url: "https://docs.python.org/3/library/hashlib.html",
 note: "hashes de artefactos del factory",
 },
 {
 label: "json — run manifest",
 url: "https://docs.python.org/3/library/json.html",
 note: "manifest de corrida y approval",
 },
 ],
 books: [
 {
 label: "Docs for Developers",
 note: "Estructura y claridad de documentos técnicos",
 },
 {
 label: "The Data Warehouse Toolkit (Kimball) — select chapters",
 note: "Narrativa de métricas y linaje (conceptual)",
 },
 ],
 courses: [
 {
 label: "Real Python — Jinja templating",
 url: "https://realpython.com/primer-on-jinja-templating/",
 note: "plantillas Jinja en Python (práctico)",
 },
 {
 label: "python-docx — working with documents",
 url: "https://python-docx.readthedocs.io/en/latest/user/documents.html",
 note: "crear y reabrir DOCX con estilos",
 },
 {
 label: "ReportLab user guide (PDF)",
 url: "https://www.reportlab.com/docs/reportlab-userguide.pdf",
 note: "canvas y PDF digital programático",
 },
 {
 label: "PyArcana live",
 url: "https://pillb.github.io/pyarcana/",
 note: "curso en vivo — sección de reportes trazables",
 },
 {
 label: "deeplearning.ai — Data Engineering (concepts)",
 url: "https://www.deeplearning.ai/specializations/data-engineering",
 note: "pipelines de entrega; adaptar a docs locales",
 },
 {
 label: "WCAG overview (W3C)",
 url: "https://www.w3.org/WAI/standards-guidelines/wcag/",
 note: "criterios de accesibilidad para informes",
 },
 {
 label: "MIT 6.100L",
 url: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/",
 note: "estructuras y lógica (refuerzo general)",
 },
 ],
 },
}
