import type { CourseSection } from '../../types'

export const section21: CourseSection = {
 id: "fastapi",
 index: 21,
 title: "Documentos, plantillas y reportes trazables",
 shortTitle: "Reportes trazables",
 tagline: "Una corrida genera dashboard, DOCX/PDF y workbook con números reconciliados, provenance y revisión visual",
 estimatedHours: 18,
 level: "Práctica independiente",
 phase: 1,
 icon: "FileStack",
 accentColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
 jobRelevance:
 "En analytics y operaciones en Perú, el comité no acepta un Excel «bonito» si el DOCX dice otro número. Aquí aprendes a construir un factory de reportes que une dashboard, Excel y documentos reales con métricas reconciliadas, provenance (trazabilidad de origen) y aprobación humana. Es lo que separa un informe que pasa auditoría de uno que se desmorona en la primera pregunta.",
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
  heading: "El Excel dice 28.0 y el informe dice 30, «porque redondeé»",
 paragraphs: [
   "El comité no firma, y hace bien. No es un problema de decimales: es que dos artefactos que deberían venir de la misma corrida se contradicen, y nadie sabe cuál creer. Esta sección resuelve eso construyendo los documentos desde una única fuente de datos, de modo que discrepar sea imposible en vez de improbable.",
   "La idea central es separar los datos de su presentación. Se arma un **contexto** —un diccionario con los números ya calculados y versionado— y la plantilla solo lo coloca en su sitio. La plantilla no calcula y no decide: si empieza a hacerlo, vuelves a tener dos fuentes de verdad con distinta aritmética. Con el redondeo hace falta una distinción fina, porque más abajo usarás `'%.2f'|format(...)` dentro de Jinja y parecería una excepción. No lo es: ese filtro **formatea para mostrar**, no altera el valor que Python calculó ni el que viaja al Excel de S20. La aritmética —incluido cualquier `round()` que cambie un total— ocurre una sola vez en Python; la plantilla solo decide cuántos decimales se ven.",
   "Esa separación resuelve además un problema de seguridad que es fácil pasar por alto. Si el texto de un campo entra directo en la plantilla, un valor con caracteres especiales puede romper el documento o alterar su estructura. La plantilla escapa lo que inserta, por la misma razón por la que una consulta a base de datos usa parámetros en vez de pegar texto.",
   "Hay un detalle pequeño con consecuencias grandes: **falta no es cero**. Una celda sin dato se escribe con un guion largo, no con un `0`, porque un cero se suma y se promedia mientras que un guion obliga a preguntar. El mismo glifo sirve como marca de redacción cuando un dato existe pero no debe mostrarse.",
   "La pregunta que atraviesa la sección es de trazabilidad: **¿puedo señalar de qué corrida salió cada número de este informe?** Los artefactos deben compartir los mismos totales y tamaños de muestra que el EDA y el libro de Excel anteriores, y ninguno se publica sin una revisión visual del resultado.",
 ],
 callout: {
 type: "info",
 title: "Dependencias del lab",
 content:
 "En tu venv: `pip install jinja2 python-docx reportlab pypdf pymupdf pillow`. No uses PII real. Trabaja en un directorio de lab limpio: los demos crean `informe.docx` / `informe.pdf` / PNG locales. La revisión de cierre exige los archivos, el texto extraído, una vista renderizada y sus hashes; un dict en memoria no sustituye esos artefactos. En canvas ReportLab con Helvetica por defecto, los demos usan ASCII (`sintetico`) a propósito; en DOCX y Markdown del lab escribe **sintético** con tilde.",
 },
},
{
 heading: "Contrato de la sección (referencia)",
 optional: true,
 paragraphs: [
   "Bloque de referencia. Orden de los subtemas y dependencias.",
   "**Orden de los subtemas.** T1 trata las plantillas: Jinja, separación entre datos y presentación, y tablas seguras. T2 pasa a los documentos: DOCX real, y la diferencia entre un PDF digital y uno que es una imagen escaneada. T3 cubre la narrativa: resumen, método, hallazgos y límites. T4 cierra con la trazabilidad y la revisión previa a publicar.",
   "**Dependencias del laboratorio.** En tu entorno virtual: `jinja2`, `python-docx`, `reportlab`, `pypdf`, `pymupdf` y `pillow`. Trabaja en un directorio limpio: las demostraciones crean archivos locales. Sin datos personales reales.",
 ],
},
{
 heading: "Jinja y separación datos/presentación",
 figure: {
   id: "S21-render-pipeline",
   caption:
     "El filtro de formato decide cuántos decimales se ven; no altera el valor que viaja al Excel.",
   alt:
     "Cuatro capas apiladas: datos, cálculo en Python, plantilla Jinja y documento final.",
 },
 subtopicId: "S21-T1-A",
 paragraphs: [
 "Jinja separa **datos** (dict de contexto en Python) de **presentación** (`{{ var }}`, `{% for %}`). Calcula métricas **antes** del render: la plantilla no es el lugar de joins pesados ni de reglas de negocio opacas. Un solo `context` versionado (run_id, métricas, límites) alimenta DOCX, PDF y, más adelante, el correo de aprobación en S22. Si cada canal inventa su propio formato de KPI, la paridad muere en el primer redondeo.",
 "Contrato operativo: `Template(...).render(**ctx)`. Cuidado con un detalle que muerde: `Template(...)` a secas **no** escapa HTML. El autoescape hay que pedirlo, con `Environment(autoescape=select_autoescape(['html']))`, y renderizar desde ese entorno. Sin eso, un nombre que contenga `<script>` entra tal cual en la página. Nunca marques input de usuario con `mark_safe` sin sanitizar. En texto plano (Markdown, cuerpo de DOCX vía plantilla) define política de caracteres. En un factory serio, configura `StrictUndefined` para que falte una variable a gritos en lugar de dejar un hueco vacío en el informe. Los KPI llegan ya redondeados (1–2 decimales PEN) desde Python: no “se redondean a ojo” en la plantilla ni en el Word del autor. El revisor debe poder re-renderizar el mismo context y obtener la misma cadena.",
 "Caso CASO-LIM-021: portada `CASO-LIM-021 · {{ region }} (n={{ n }})` → `CASO-LIM-021 · Lima (n=40)`; KPI `{{ m }} PEN (n={{ n }})` → `28 PEN (n=40)`. Una función `render_kpi(ctx)` centraliza el template fijo región/mediana/n y evita que cada autor del informe invente su propio formato. Así el dashboard S19 y el Excel S20 hablan el mismo idioma numérico — y el DOCX de esta sección no se desvía.",
 ],
 code: {
 language: 'python',
 title: "jinja_basic.py",
 code: `def s21_th_1():
    from jinja2 import Environment, Template, select_autoescape

    tmpl = Template("Región {{ region }}: mediana {{ median }} PEN (n={{ n }})")
    print(tmpl.render(region="Lima", median=28.0, n=40))
    # HTML del dashboard/email: autoescape evita inyección de markup en el context
    env = Environment(autoescape=select_autoescape(enabled_extensions=("html",)))
    html_t = env.from_string("KPI: {{ label }}")
    print(html_t.render(label="<b>28</b>"))

s21_th_1()`,
 output: `Región Lima: mediana 28.0 PEN (n=40)
KPI: &lt;b&gt;28&lt;/b&gt;`,
 },
 callout: {
 type: "tip",
 title: "Context dict único y autoescape",
 content:
 "Pasa un context versionado (run_id, métricas, límites) a todas las plantillas del factory. En HTML, activa autoescape en el Environment: el demo de arriba convierte `<b>28</b>` en entidades (`&lt;b&gt;…`), no en markup. Nunca uses `mark_safe` sobre input de usuario sin sanitizar. En este lab de texto plano (Markdown/DOCX) no hace falta desactivar el escape; cuando empaquetes HTML del dashboard, deja autoescape encendido.",
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
    from jinja2 import Environment

    # trim/lstrip evitan que la indentación del fuente se cuele en la tabla
    env = Environment(trim_blocks=True, lstrip_blocks=True)
    tmpl = env.from_string(
        "{% for r in rows %}- {{ r.region }}: {{ '%.2f'|format(r.median) }} PEN\\n{% endfor %}"
    )
    rows = [{"region": "Lima", "median": 28.0}, {"region": "Madrid", "median": 22.5}]
    print(tmpl.render(rows=rows), end="")

s21_th_2()`,
 output: `- Lima: 28.00 PEN
- Madrid: 22.50 PEN
`,
 },
 callout: {
 type: "warning",
 title: "Cero vs. missing",
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
 "Caso sintético CASO-LIM-021: headings contados al reabrir (p. ej. Resumen como Heading 1). El mismo `n=40` debe aparecer en resumen y en el data note — paridad con S18/S20. Si el outline (esquema jerárquico de secciones) no está congelado, cada revisor reescribe la estructura y se rompe la reconciliación del paquete CP-N2-B.",
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
 "Caso: PDF imagen-only con texto dibujado en un PNG sintético → pypdf no recupera capa de texto → `needs_ocr`. El paquete documenta el modo (digital vs. OCR pendiente); no finge un PDF nativo. Más adelante (S24) profundizarás OCR; aquí aprendes a **abstenerte con honestidad**.",
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
 "Caso CASO-LIM-021: hallazgo H1 “Lima > Madrid en mediana” con evidencia Tabla1 y `decision=None`; resumen con `n=40` y 28 PEN. Si el texto dice “Lima lidera” sin tabla ni n, es eslogan, no hallazgo auditable. Si el hallazgo ya trae “recomendamos subir precios”, has mezclado decisión de negocio en el paquete de evidencia.",
 ],
 code: {
 language: 'python',
 title: "exec_struct.py",
 code: `def s21_th_5():
    report = {
     "resumen": ["Ticket mediano Lima 28 PEN en muestra web (n=40)"],
     "metodo": {"fuente": "sintético", "filtros": ["canal=web"], "corte": "2024-06-30"},
     "hallazgos": [{"id": "H1", "texto": "Lima > Madrid en mediana", "evidencia": "Tabla1"}],
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
 "Inserta figuras del dashboard (S19) y tablas del Excel (S20) con **caption alineado** en fuente, corte y n. Lista limitaciones al final de hallazgos, no escondidas solo en anexo. Reconcilia el checksum (suma de verificación) de métricas clave entre artefactos: si el PNG dice mediana 28 y el DOCX dice 30, el control de consistencia falla.",
 "Contrato: caption dict + pie con campo Fuente visible; unidades PEN a 1 decimal en todo el paquete. Tres artefactos (png, xlsx, docx) comparten `run_id` y `n=40`. El memo de limitaciones repite cobertura (p. ej. web-only) donde el lector la vea.",
 "Caso sintético: bundle (paquete) con `metrics`, `limits` y caption `Fig.1 … | Fuente: sintético | n_Lima=40`. Paridad `dash == xlsx == doc` es el corazón del cierre CP-N2-B: un solo número, tres superficies.",
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
 "Redacción en español profesional (**es-PE**): el cuerpo ejecutivo habla al comité, no a un repositorio de GitHub. Evita anglicismos que el gremio no reconoce (“outperform”, “drive insights”); deja términos técnicos (KPI, SLA, a11y, provenance, factory) donde el oficio los espera, glosándolos la primera vez si el lector no es técnico. Accesibilidad: headings reales, alt de figuras con n y unidad, tablas con encabezados, contraste en HTML cuando el dashboard se empaqueta.",
 "Contrato de consistencia: **un mismo número se ve igual en los tres canales** — dashboard, Excel e informe. Ojo con lo que fija la regla y lo que no: no dice que todo el paquete use la misma cantidad de decimales, porque las tablas de detalle usan 2 y los resúmenes ejecutivos 1. Dice que la cifra de detalle de Lima se imprime con 2 decimales *en los tres sitios*, y la del resumen con 1 *en los tres sitios*. La precisión la fija el contexto; lo que nunca varía es el canal. Si un canal imprime `28.0` y otro `28`, el revisor ve “dos números” aunque sean iguales. Centraliza con `fmt_pen` / `format_metric` para no divergir entre Jinja y Excel. Un glosario breve en anexo basta si introduces siglas nuevas en el paquete.",
 "Caso CASO-LIM-021: “mediana de ticket en Lima” no “median ticket Lima region outperform”. Alt de figura menciona n y unidad (`Barras mediana por región, n por barra en tooltip`); headings del DOCX son estilos de Word, no solo tamaño de fuente. Checklist mínima (`has_h1` + al menos un alt con longitud útil > 10; lista vacía no pasa) evita publicar un paquete ilegible para lectores con tecnología asistiva — y es la misma barra que usa el I Do de este subtema.",
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
 "T4-A dejó el texto y los decimales consistentes; el cierre del factory es **gobernanza**: ¿quién generó qué, con qué datos, y quién miró el paquete? Registra **provenance**: run_id, huella de datos, hashes de artefactos, checklist visual. Cola de aprobación: borrador → revisión visual → aprobado/rechazado con comentarios. Sin checklist visual completa (dashboard, xlsx, doc), **no hay cierre CP-N2-B**. El paquete en `pending_review` es la entrada limpia al flujo de email/aprobación de S22 — no marques `approved` desde el script del factory.",
 "Contrato: `ready(checklist)` es True solo si dashboard, xlsx y doc están True (`all`, no `any`). En el lab usamos un recorte corto de sha1 (8 hex) como id didáctico; en producción prefiere **SHA-256** del artefacto completo (el recorte de 8 hex es débil ante colisiones). Actor y timestamp van en el log de aprobación (preludio de S22).",
 "Caso CASO-LIM-021: checklist incompleta → `ready` False; completa → True. El manifiesto JSON fija run_id, huella, lista de artefactos y `approval.status = pending_review` hasta que un humano revise. Un print de “ok” o un dict solo en memoria no sustituye ese manifiesto ni los archivos en disco.",
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
 intro: "I Do — observa el Reporting Factory en ocho demos (una por subtema). El recorrido: Jinja con context único → tablas con missing honesto → DOCX real reabierto → PDF digital + PNG → narrativa H→evidencia → paridad dash/xlsx/doc → fmt_pen y a11y mínima → provenance + checklist visual. No copies a ciegas: nota qué se calcula, qué se persiste a disco y qué se deja en `pending_review`. En We Do practicarás cada pieza; en You Do las unes en una sola corrida CP-N2-B.",
 steps: [
 {
 demoId: "S21-T1-A-DEMO",
 subtopicId: "S21-T1-A",
 environment: "local-python",
 description: "Separar datos de plantilla Jinja con context único",
 preamble:
 "Antes de exportar DOCX o PDF, el factory necesita un **solo** dict de contexto. En esta demo ves `run_id`, región Lima, mediana 28.0 PEN, n=40 y el límite “solo web” alimentando una plantilla Jinja. No escribas aún; predice la cadena completa y fíjate en que **nada** de la métrica se calcula dentro del template: solo se presenta. Si cada canal inventa su propio formato, la paridad con el Excel de S20 muere en el primer redondeo.",
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
 why: "El context versionado es el contrato del factory: `Template.render(**context)` reutiliza los mismos campos en portada, KPI y, más adelante, el correo de aprobación (S22). No hardcodees la línea final en un f-string fuera de Jinja si el objetivo es separar datos y presentación. Las métricas llegan ya calculadas desde Python; la plantilla solo presenta. En We Do corregirás portada incompleta y centralizarás `render_kpi`.",
 retrospective:
 "Si puedes explicar por qué el template no debe recalcular la mediana, ya tienes el hábito de separar datos y presentación. El error clásico es armar el string a mano y “olvidar” el n. En We Do T1-A practicarás portada, KPI multi-var y una función reutilizable.",
 },
 {
 demoId: "S21-T1-B-DEMO",
 subtopicId: "S21-T1-B",
 environment: "local-python",
 description: "Render condicional seguro de tabla con missing como em-dash",
 preamble:
 "En un informe de operaciones, un “0.00” en reclamos se lee como “no hubo reclamos”, no como “no medimos”. Esta demo renderiza filas con Jinja: Lima 28.0 y Madrid sin mediana. Observa la rama `is not none` y el glifo `—`. No escribas aún; predice las dos líneas. Si confundes missing con cero, el Excel y el DOCX mienten de forma distinta y la paridad se rompe en silencio.",
 code: {
 language: 'python',
 title: "demo_cond_table.py",
 code: `def s21_ido_2():
    from jinja2 import Environment

    env = Environment(trim_blocks=True, lstrip_blocks=True)
    tmpl = env.from_string(
        "{% for r in rows %}{{ r.region }}: {{ r.median if r.median is not none else '—' }}\\n{% endfor %}"
    )
    rows = [
     {"region": "Lima", "median": 28.0},
     {"region": "Madrid", "median": None}
    ]
    print(tmpl.render(rows=rows), end="")

s21_ido_2()`,
 output: `Lima: 28.0
Madrid: —
`,
 },
 why: "Missing es una decisión de reporting, no un detalle cosmético: el caption o data note debe decir por qué la celda está vacía (cobertura, corte, canal). No uses 0 “para no romper la tabla”: distorsiona totales y engaña al comité. El em-dash es el contrato visual del lab y debe reconciliar con el workbook de S20.",
 retrospective:
 "Missing se declara; no se inventa. El em-dash es el contrato visual del lab y debe cuadrar con el workbook. Si puedes decir por qué “0.00” engaña al comité sin mirar el código, ya tienes el hábito. Pregunta: ¿qué total se distorsiona si Madrid sin dato entra como 0? We Do: celda missing, formato `.2f` y bucle de filas.",
 },
 {
 demoId: "S21-T2-A-DEMO",
 subtopicId: "S21-T2-A",
 environment: "local-python",
 description: "Crear, guardar y reabrir un DOCX con estilos reales",
 preamble:
 "T1 te dio un context limpio; T2 lo baja a **disco**. Un DOCX trazable usa estilos Heading reales, se guarda y se **reabre** para extraer texto y estilos. En esta demo creas `reporte.docx`, verificas la firma ZIP (`PK`) y lees el heading “Resumen ejecutivo”. No escribas aún; predice `suffix`, booleano PK y la lista de headings. “Se veía bien en la sesión del autor” no es evidencia ante un revisor sin tu Word abierto.",
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
 why: "Reabrir prueba el paquete OOXML real: `style.name` debe empezar por Heading; la negrita sola no es outline auditable. Un dict en memoria no sustituye el archivo en disco ni la firma PK. El factory no “exporta una vez y reza”: guarda, reabre y verifica texto y estilos antes de empaquetar.",
 retrospective:
 "Evidencia = archivo reabierto, no el objeto en RAM. “Se veía bien en mi Word” no es audit. Pregunta: si `style.name` es `Normal` con negrita, ¿pasa la prueba de outline? We Do: outline con Resumen/n=40, conteo de Heading 1 y tabla con missing honesto.",
 },
 {
 demoId: "S21-T2-B-DEMO",
 subtopicId: "S21-T2-B",
 environment: "local-python",
 description: "Generar PDF, extraer texto y renderizar una página PNG",
 preamble:
 "Un PDF digital tiene texto seleccionable; un escaneo es imagen. En esta demo generas `reporte.pdf` con ReportLab, extraes con pypdf y renderizas la primera página a PNG con PyMuPDF. Observa tres checks: firma `%PDF`, presencia de “H1” en el texto extraído y tamaño del PNG. No escribas aún; predice los booleanos. Ninguna de las tres pruebas sustituye sola la reconciliación tabular — pero juntas cierran el artefacto.",
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
 why: "Extracción = capa digital; PNG = legibilidad visual; el hash del PDF entra al provenance (T4-B). Un PNG legible no prueba por sí solo que el PDF sea digital: hace falta `extract_text`. Si la capa queda vacía, el contrato es `needs_ocr`, no inventar texto. En We Do practicarás n=40 en capa, render PNG y caso imagen-only.",
 retrospective:
 "Un PNG legible no prueba por sí solo que el PDF sea digital: hace falta extracción. Si la capa queda vacía, el contrato es `needs_ocr`, no inventar texto. Pregunta: ¿qué evidencia llevarías al manifiesto si solo tienes un PNG bonito? We Do: n=40 en capa, render PNG y caso imagen-only.",
 },
 {
 demoId: "S21-T3-A-DEMO",
 subtopicId: "S21-T3-A",
 environment: "local-python",
 description: "Estructurar informe en resumen, método y hallazgos con ids",
 preamble:
 "Con DOCX/PDF reales, falta la **voz ejecutiva** sin contaminar el método con opinión. Esta demo empaqueta resumen con n=40, método (fuente y filtros) y un hallazgo H1 que apunta a Tabla1 con `decision=None`. Observa que el claim (afirmación) “Lima > Madrid” no trae recomendación de precios. No escribas aún; predice las tres líneas de salida. Sin id de evidencia, el párrafo es eslogan, no paquete de aprobación.",
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
     {"id": "H1", "claim": "Lima > Madrid en mediana", "evidencia": "Tabla1", "decision": None}
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
 why: "Ids de hallazgo habilitan revisión selectiva del paquete. `decision=None` deja la acción de negocio a la cola humana (S22): hallazgo ≠ decisión (eco de S18). Sin evidencia nombrada, el claim no entra al paquete de aprobación por elocuente que suene. El resumen debe llevar `n=` y unidad PEN para reconciliar con el EDA.",
 retrospective:
 "Hallazgo = claim + evidencia; decisión = humano en la cola (S22). Sin id de evidencia, el párrafo es eslogan. Pregunta: ¿“recomendamos subir precios” es hallazgo o decisión? We Do: dict H1, resumen con n=/PEN y `pack_report` de tres claves.",
 },
 {
 demoId: "S21-T3-B-DEMO",
 subtopicId: "S21-T3-B",
 environment: "local-python",
 description: "Embeber métricas con fuentes/límites y check de paridad",
 preamble:
 "El corazón de CP-N2-B es **paridad**: dashboard, Excel y documento con la misma mediana Lima 28.0. Esta demo compara tres dicts, adjunta límites (cobertura web, n Madrid bajo) y empaqueta `parity` + `fuente`. Observa que `parity` es un booleano de igualdad de estructuras de métricas, no un “se ve similar”. No escribas aún; predice el bundle. Si el PNG dice 28 y el DOCX 30, el factory ya falló antes de hablar de diseño.",
 code: {
 language: 'python',
 title: "demo_parity.py",
 code: `def s21_ido_6():
    dash = {"median_Lima": 28.0}
    xlsx = {"median_Lima": 28.0}
    doc = {"median_Lima": 28.0}
    limits = ["cobertura web", "n Madrid bajo"]
    parity = dash == xlsx == doc
    bundle = {"parity": parity, "limits": limits, "fuente": "sintético"}
    print(bundle)

s21_ido_6()`,
 output: `{'parity': True, 'limits': ['cobertura web', 'n Madrid bajo'], 'fuente': 'sintético'}`,
 },
 why: "Paridad es el gate de cierre del factory: un solo número, tres superficies. Los límites de cobertura deben ser visibles al lector, no solo en un anexo escondido. Sin `fuente` y sin `limits`, el revisor no puede interpretar el n ni la muestra web-only del CASO-LIM-021.",
 retrospective:
 "Un solo número, tres superficies: si el PNG dice 28 y el DOCX 30, el factory ya falló antes de hablar de diseño. Paridad no es “se ve similar”. Pregunta: ¿basta alinear dash y xlsx si el doc diverge? We Do: alinear dash/doc + “solo web”, captions con Fuente, y `check_parity` a tres vías.",
 },
 {
 demoId: "S21-T4-A-DEMO",
 subtopicId: "S21-T4-A",
 environment: "local-python",
 description: "Normalizar decimales y validar presencia de headings/alt",
 preamble:
 "Antes de mandar a revisión, el factory unifica **cómo se escribe** el número y si el paquete es mínimamente accesible. Esta demo formatea 28.04 y 28.0 a `28.0 PEN`, verifica un solo string decimal y un alt de figura con longitud útil. Observa que `a11y_min` exige H1 **y** alts no vacíos con más de 10 caracteres. No escribas aún; predice las tres líneas. Si un canal imprime `28` y otro `28.0`, el revisor ve dos métricas aunque sean iguales.",
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
    alts = checks["alts"]
    a11y_ok = checks["has_h1"] and len(alts) > 0 and all(len(a) > 10 for a in alts)
    print(checks["decimals"])
    print("decimal_ok", len(set(checks["decimals"])) == 1)
    print("a11y_min", a11y_ok)

s21_ido_7()`,
 output: `['28.0 PEN', '28.0 PEN']
decimal_ok True
a11y_min True`,
 },
 why: "Centralizar `fmt_pen` evita divergencia tipográfica entre Jinja, Excel y documento. La checklist a11y mínima (H1 + alts útiles) no es WCAG completa, pero bloquea paquetes ilegibles o sin alternativa de figura. `has_h1` solo no basta: `all([])` es True en Python y haría pasar una lista vacía de alts.",
 retrospective:
 "Una función de formato + gate a11y = consistencia tipográfica y mínima inclusión. `has_h1` solo no basta: una lista vacía de alts aprueba por el truco de `all([])`. Pregunta: ¿por qué `28` y `28.0` se leen como dos métricas? We Do: round a 1 decimal, `fmt_pen` con unidad y `a11y_min` robusto.",
 },
 {
 demoId: "S21-T4-B-DEMO",
 subtopicId: "S21-T4-B",
 environment: "local-python",
 description: "Registrar provenance y estado de cola de aprobación",
 preamble:
 "El cierre del factory es **gobernanza**: quién generó qué, con qué datos, y quién miró el paquete. Esta demo emite un manifiesto con run_id, recorte sha1 de lab, lista de artefactos, checklist visual completa y `approval.status = pending_review`. Observa también `ready_for_review` con `all(...)` sobre la checklist. No escribas aún; predice el JSON y el booleano. Un print de “ok” o un dict solo en memoria no sustituye el manifiesto ni los archivos en disco — y **nunca** marques `approved` desde el factory (eso es S22 humano).",
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
 why: "Provenance + checklist visual cierran CP-N2-B: el revisor sabe qué corrida, con qué huella y qué miró. En producción preferir SHA-256 del artefacto completo; el recorte de 8 hex es id didáctico del lab. El estado honesto de cierre de contenido es `pending_review`, no `approved` hardcodeado en el script del factory.",
 retrospective:
 "`pending_review` es el estado honesto de cierre de contenido: el script no se autoaprueba. Un print “ok” no sustituye manifiesto ni archivos en disco. Pregunta: ¿quién pone `approved` y en qué sección del currículum? We Do: completar manifiesto, huella corta y `ready` con `all()` no `any()`.",
 },
 ]
 },
 weDo: {
 intro: "We Do — practica el mini-factory en piezas (T1→T4). Cada **starter** (código de partida) es un **scaffold** (andamiaje) incompleto o incorrecto a propósito: completa lo pendiente del código de partida, ejecuta y solo entonces compara con la solución. T1 fija context y missing; T2 exige archivos reales reabiertos; T3 estructura narrativa y paridad; T4 cierra con a11y y provenance. El You Do orquesta `build_docx` / `build_pdf` / `extract_and_render` / `manifest` en una corrida. No saltes a portfolio sin haber fallado y corregido al menos un DOCX y un PDF en T2.",
 steps: [
 {
 id: "S21-T1-A-E1",
 subtopicId: "S21-T1-A",
 kind: "guided",
 title: "Portada Jinja con región y n",
 preamble:
 "- **Contexto:** en CASO-LIM-021 la portada del paquete debe decir región y tamaño muestral, no solo un título bonito.\n- **Meta:** renderizar con Jinja `CASO-LIM-021 · {{ region }} (n={{ n }})` desde el context.\n- **Éxito:** imprime exactamente `CASO-LIM-021 · Lima (n=40)`.\n- **Límites:** no armes la línea con f-string fuera de Jinja; no hardcodees “Lima (n=40)” en el `print`.",
 instruction:
 "1. Revisa el starter: imprime solo el prefijo sin n.\n2. Crea un `Template` con `{{ region }}` y `{{ n }}`.\n3. Llama `.render(region=\"Lima\", n=40)`.\n4. Imprime solo el texto renderizado (sin comillas extra).",
 hint: "Crea un Template y llama .render(region=..., n=...).",
 hints: [
 "Crea un Template y llama .render(region=..., n=...).",
 "No armes el string con f-string fuera de Jinja: el ejercicio entrena separación datos/plantilla.",
 ],
 edgeCases: ["n omitido con Template por defecto → hueco vacío (en producción usa StrictUndefined para fallar en voz alta)"],
 tests: "el print es exactamente CASO-LIM-021 · Lima (n=40)",
 feedback:
 "Si ves solo el prefijo o n vacío, el Template no recibe `region`/`n` en `.render()`. En un factory serio, `StrictUndefined` grita variables ausentes en lugar de dejar huecos silenciosos en la portada del comité.",
 retrospective:
 "Portada = identity del caso + n visible. Sin n, el revisor no reconcilia con el EDA ni con el Excel de S20. El error clásico es imprimir un f-string “bonito” fuera de Jinja y creer que ya hay plantilla. Pregunta: si la portada dice solo “CASO-LIM-021 · Lima”, ¿qué falta para auditar la muestra? Siguiente (E2): un KPI con mediana y n en la misma plantilla.",
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
 title: "KPI Jinja con mediana y n",
 preamble:
 "- **Contexto:** el comité compara el KPI del DOCX con el ticket mediano del workbook; sin n no hay reconciliación.\n- **Meta:** renderizar `{{ m }} PEN (n={{ n }})` con m=28 y n=40.\n- **Éxito:** imprime exactamente `28 PEN (n=40)`.\n- **Límites:** no omitas la unidad PEN ni el prefijo `n=`; no inventes otro formato de KPI.",
 instruction:
 "1. Abre el starter: el Template solo tiene `{{ m }} PEN`.\n2. Extiende la plantilla para incluir `(n={{ n }})`.\n3. Pasa `m=28` y `n=40` en `.render(...)`.\n4. Imprime solo la cadena resultante.",
 hint: "Dos variables en el mismo Template.",
 hints: [
 "Dos variables en el mismo Template.",
 "Incluye la unidad PEN y el prefijo n=.",
 ],
 edgeCases: ["tipos str vs. int"],
 tests: "el print es 28 PEN (n=40)",
 feedback:
 "Si falta «(n=40)», la plantilla no declara `{{ n }}` o no lo pasas en render. Sin n el comité no reconcilia el KPI del DOCX con el Excel de S20.",
 retrospective:
 "Dos variables en un template es el mínimo de un KPI auditable (valor + tamaño). Pregunta de cierre: ¿qué falla si el DOCX dice 28 PEN y el Excel n=32? Luego (E3) encapsularás el formato en `render_kpi`.",
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
 title: "Función render_kpi con context dict",
 preamble:
 "- **Contexto:** cada autor del informe no debe inventar su propio string de KPI; el factory centraliza el formato.\n- **Meta:** implementar `render_kpi(ctx)` que use región, mediana y n del dict.\n- **Éxito:** `Madrid: 22.5 PEN (n=18)` (muestra regional distinta; no es fallo de paridad del paquete Lima).\n- **Límites:** no hardcodees Madrid fuera del dict; no omitas n en la plantilla.",
 instruction:
 "1. Lee el TODO: la plantilla del starter no declara `{{ n }}`.\n2. Completa el Template dentro de `render_kpi` con región, mediana y n.\n3. Pasa el dict completo con `**ctx`.\n4. Imprime el resultado de la prueba Madrid / 22.5 / 18.",
 hint: "Template dentro de la función o reutilizado; pasa el dict completo al render.",
 hints: [
 "Template dentro de la función o reutilizado; pasa el dict completo al render.",
 "Incluye n en la plantilla: sin n el KPI no es auditable.",
 ],
 edgeCases: ["key error"],
 tests: "el print es Madrid: 22.5 PEN (n=18)",
 feedback:
 "Centraliza el template en la función: cada autor del informe no inventa su propio formato de KPI. El n=18 es otra muestra (Madrid), no un desfase del paquete Lima n=40.",
 retrospective:
 "Centralizar el template evita que cada autor invente su string de KPI. Ese n=18 es **otro context** (Madrid), no un bug de paridad del paquete Lima n=40. Pregunta: si hardcodeas “Madrid” fuera del dict, ¿qué pasa al reutilizar la función en Lima? Puente a T1-B: cuando el valor falta, no inventes 0 — usa em-dash.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# Lab CASO-LIM-021 — render_kpi reutilizable
# TODO: la plantilla debe incluir n={{ n }}
from jinja2 import Template

def render_kpi(ctx):
 return Template("{{ region }}: {{ median }} PEN").render(**ctx)
print(render_kpi({"region": "Madrid", "median": 22.5, "n": 18}))`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `from jinja2 import Template

def render_kpi(ctx):
 return Template("{{ region }}: {{ median }} PEN (n={{ n }})").render(**ctx)
print(render_kpi({"region": "Madrid", "median": 22.5, "n": 18}))`,
 output: `Madrid: 22.5 PEN (n=18)`,
 },
 },
 {
 id: "S21-T1-B-E1",
 subtopicId: "S21-T1-B",
 kind: "guided",
 title: "Missing como em-dash (no cero)",
 preamble:
 "- **Contexto:** en CASO-LIM-021, un KPI sin medición no puede aparecer como 0.00 en la tabla del informe.\n- **Meta:** mapear `median = None` a la celda `—` (em dash Unicode).\n- **Éxito:** imprime exactamente el carácter `—`.\n- **Límites:** no imprimas `None`, `0` ni la cadena `\"None\"`.",
 instruction:
 "1. Revisa el starter: hace `print(median)` con `median = None`.\n2. Escribe un condicional: si es `None` → `\"—\"`, si no → el valor.\n3. Imprime solo el resultado de la celda.\n4. No inventes un cero “para rellenar”.",
 hint: "Usa un condicional: si median is None → '—'.",
 hints: [
 "Usa un condicional: si median is None → '—'.",
 "Imprime solo el resultado de la celda.",
 ],
 edgeCases: ["NaN float"],
 tests: "el print es exactamente el em dash —",
 feedback:
 "Si imprimes 0 o None, el comité creerá que la mediana es cero. Missing se declara, no se inventa: protege totales y la paridad con el Excel.",
 retrospective:
 "El comité lee 0 como hecho medido, no como “no medimos”. Missing honesto protege totales, promedios y la paridad con el Excel. El error clásico es rellenar con cero “para no romper la tabla”. Pregunta: ¿imprimir `\"None\"` como texto es mejor o igual de malo? Siguiente (E2): formatear un número real a dos decimales sin redondeo a ojo en Word.",
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
 title: "Formato a dos decimales (.2f)",
 preamble:
 "- **Contexto:** las tablas de detalle del factory usan 2 decimales explícitos; el redondeo “a ojo” en el Word del autor rompe paridad.\n- **Meta:** formatear `x = 28.456` a exactamente dos decimales en Python.\n- **Éxito:** imprime `28.46`.\n- **Límites:** no redondees mentalmente y hardcodees el string; no uses locale con coma.",
 instruction:
 "1. El starter imprime `x` crudo.\n2. Usa f-string con `:.2f` (o formato equivalente).\n3. Imprime solo el valor formateado.\n4. Verifica mentalmente: 28.456 → 28.46, no 28.45 ni 28.5.",
 hint: "f-string con :.2f o formato equivalente.",
 hints: [
 "f-string con :.2f o formato equivalente.",
 "Compara tu salida con el test del ejercicio (dos decimales).",
 ],
 edgeCases: ["locale comma"],
 tests: "el print es 28.46",
 feedback:
 "Si ves `28.456` crudo o `28.5`, no usaste formato a 2 decimales. El redondeo “a ojo” en Word del autor rompe paridad con el workbook; el rastro debe ser auditable en código.",
 retrospective:
 "Formatear en Python (o con filtro Jinja explícito) deja un rastro que el revisor puede re-ejecutar. Aquí el detalle pide 2 decimales; en resúmenes ejecutivos a menudo usarás 1 decimal PEN (T4). Pregunta: ¿por qué hardcodear `\"28.46\"` falla el espíritu del drill aunque el print pase? Luego (E3): emitir filas con bucle Jinja.",
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
 title: "Bucle Jinja de filas region:v",
 preamble:
 "- **Contexto:** el factory serializa filas del context a líneas o celdas; un string único con pipes no es tabla.\n- **Meta:** con un Template Jinja, emitir una línea `region:v` por fila.\n- **Éxito:** dos líneas — `Lima:1` y `Madrid:2` (sin espacios extra).\n- **Límites:** no unir regiones con `|`; no hardcodees las dos líneas fuera del bucle.",
 instruction:
 "1. Reemplaza el template `\"static\"` por un `{% for r in rows %}…{% endfor %}`.\n2. Dentro del bucle: `{{ r.region }}:{{ r.v }}` y salto de línea.\n3. Pasa la lista de dicts en `.render(rows=...)`.\n4. Usa `print(..., end=\"\")` si el template ya trae `\\n` final.",
 hint: "Usa {% for r in rows %} … {% endfor %} con region y v.",
 hints: [
 "Usa {% for r in rows %} … {% endfor %} con region y v.",
 "Termina cada fila con salto de línea; evita unir con |.",
 ],
 edgeCases: ["rows vacías"],
 tests: "dos líneas: Lima:1 y Madrid:2",
 feedback:
 "Cada fila del context debe producir su propia línea; un pipe entre regiones no es tabla serializable ni reabre como celdas en el workbook.",
 retrospective:
 "Una fila del context = una línea (o celda) de salida. Un string único con `|` no se reabre como tabla en el workbook. Pregunta: si `rows` crece a 10 regiones, ¿tu solución escala sin editar el template a mano? Puente a T2-A: materializar el mismo contrato en un DOCX real con headings y celdas.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# Lab CASO-LIM-021 — jinja for de filas
# TODO: itera rows y emite region:v por línea
from jinja2 import Template
tmpl = Template("static")
print(tmpl.render(rows=[{"region": "Lima", "v": 1}, {"region": "Madrid", "v": 2}]), end="")`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `from jinja2 import Template
tmpl = Template("{% for r in rows %}{{ r.region }}:{{ r.v }}\\n{% endfor %}")
print(tmpl.render(rows=[{"region": "Lima", "v": 1}, {"region": "Madrid", "v": 2}]), end="")`,
 output: `Lima:1
Madrid:2`,
 },
 },
 {
 id: "S21-T2-A-E1",
 subtopicId: "S21-T2-A",
 kind: "guided",
 title: "DOCX con Resumen y n=40 reabierto",
 preamble:
 "- **Contexto:** el paquete CP-N2-B exige un DOCX en disco con sección Resumen y el n de la muestra.\n- **Meta:** crear, guardar y reabrir un Document con headings reales y párrafo `n=40`.\n- **Éxito:** dos líneas `True True` (existe+PK; contiene Resumen y n=40).\n- **Límites:** no dejes el texto solo en un dict; no uses solo `add_paragraph` para fingir el heading Resumen.",
 instruction:
 "1. Revisa el starter: solo un párrafo genérico, sin “Resumen” ni n=40.\n2. Agrega heading de título y heading “Resumen” (nivel 1).\n3. Agrega un párrafo que incluya `n=40`; guarda y reabre.\n4. Imprime los dos pares de booleanos del scaffold (no inventes otro formato de salida).",
 hint: "Usa Document(), add_heading(), add_paragraph(), save() y vuelve a abrir la ruta.",
 hints: [
 "La firma de un DOCX comienza con bytes PK porque es un paquete ZIP.",
 "Extrae p.text de los párrafos no vacíos del documento reabierto.",
 ],
 edgeCases: ["ruta no escribible", "documento sin párrafos"],
 tests: "dos líneas True True: archivo+PK, luego Resumen y n=40 en texto reabierto",
 feedback:
 "Si el segundo True falla, el heading Resumen o el párrafo n=40 no están en el archivo guardado (no en un dict en memoria). El revisor del comité solo ve el disco.",
 retrospective:
 "El segundo `True True` solo es posible si el archivo guardado trae “Resumen” y `n=40`. Outline primero, prosa después; un dict en memoria no cierra CP-N2-B. Pregunta: ¿por qué basta `add_paragraph(\"Resumen\")` para engañarte en pantalla pero no al revisor? Siguiente (E2): contar estilos Heading al reabrir.",
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
 title: "Contar Heading 1 al reabrir el DOCX",
 preamble:
 "- **Contexto:** el revisor audita `style.name`, no el tamaño de fuente que “se veía como título”.\n- **Meta:** crear headings reales Resumen(1), Método(2), Anexos(1); guardar, reabrir y reportar estilos.\n- **Éxito:** primera línea `2`; segunda `['Heading 1', 'Heading 2', 'Heading 1']`.\n- **Límites:** no uses `add_paragraph` + negrita; la evidencia debe venir del archivo reabierto.",
 instruction:
 "1. El bucle del starter llama `add_paragraph` (bug).\n2. Cámbialo a `add_heading(text, level)` con el level del tuple.\n3. Guarda, reabre y construye la lista de `style.name` de párrafos con texto.\n4. Imprime el conteo de `\"Heading 1\"` y la lista completa.",
 hint: "Cada párrafo reabierto expone style.name.",
 hints: [
 "Filtra exactamente Heading 1 y conserva también la jerarquía completa.",
 "La evidencia debe provenir del archivo guardado, no del input original.",
 ],
 edgeCases: ["heading sin texto", "estilo Normal"],
 tests: "conteo 2 y lista ['Heading 1', 'Heading 2', 'Heading 1']",
 feedback:
 "Si el conteo de Heading 1 es 0, el bucle sigue usando `add_paragraph`. Al reabrir, `style.name` debe ser `Heading 1`/`Heading 2`: el outline real habilita a11y y navegación del revisor.",
 retrospective:
 "Heading real = outline navegable y a11y; negrita visual = maquillaje. La evidencia sale del archivo reabierto, no del input del bucle. Pregunta: ¿cuántos Heading 1 esperas con Resumen y Anexos a nivel 1 y Método a nivel 2? Luego (E3): tabla de métricas con Reclamos como `—`, no 0.",
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
 title: "Tabla DOCX con Reclamos como —",
 preamble:
 "- **Contexto:** en auditoría del CASO-LIM-021, un 0 en reclamos se interpreta como “no hubo”, no como “no medimos”.\n- **Meta:** tabla métrica/valor con Ticket mediano=28.0 y Reclamos=`—`; verificar al reabrir.\n- **Éxito:** `['Ticket mediano', '28.0']` y `['Reclamos', '—'] True`.\n- **Límites:** no uses `\"0\"` para rellenar; la lectura debe salir del DOCX reabierto.",
 instruction:
 "1. Corrige la lista `metrics`: Reclamos debe ser em-dash.\n2. Conserva encabezados Métrica/Valor y el bucle de filas.\n3. Guarda, reabre y lee `rows[1]` y `rows[2]`.\n4. Imprime la fila 2 y el booleano `valor != \"0\"`.",
 hint: "Usa add_table(rows=1, cols=2), agrega filas y lee cell.text del documento reabierto.",
 hints: [
 "La tabla debe contener columnas métrica y valor.",
 "Representa el dato faltante como em dash, no como 0.",
 ],
 edgeCases: ["missing", "tabla vacía"],
 tests: "filas reabiertas: Ticket mediano/28.0 y Reclamos/— con booleano True",
 feedback:
 "Reclamos=0 en la celda es un error de reporting: el revisor debe leer — al reabrir el DOCX, o el comité creerá que no hubo reclamos.",
 retrospective:
 "Missing en celda de Word es el mismo contrato que en Jinja. Pregunta: ¿qué decisión falsa toma el comité si lee 0? Puente a T2-B: PDF digital con capa de texto extraíble.",
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
 title: "PDF digital con n=40 extraíble",
 preamble:
 "- **Contexto:** el revisor del factory extrae texto del PDF; si n no está en la capa digital, el artefacto no es auditable.\n- **Meta:** generar PDF con ReportLab que incluya n=40 y verificar firma + extracción.\n- **Éxito:** dos líneas `True` (firma `%PDF` y `\"n=40\" in text`).\n- **Límites:** no declares “digital” sin extraer; no hardcodees los booleanos a True.",
 instruction:
 "1. El starter dibuja “Resumen sintetico” sin n.\n2. Incluye `n=40` en el `drawString` **antes** de `save()`.\n3. Extrae con `PdfReader` y normaliza `or \"\"`.\n4. Imprime los dos booleanos del scaffold.",
 hint: "Canvas.drawString()+save(); luego PdfReader(path).pages[0].extract_text().",
 hints: [
 "Comprueba primero los bytes %PDF.",
 "No declares digital sin extraer texto del archivo.",
 ],
 edgeCases: ["PDF corrupto", "capa de texto vacía"],
 tests: "dos líneas True: firma %PDF y n=40 en extract_text",
 feedback:
 "drawString crea capa de texto; si n=40 no aparece en extract_text, el canvas no lo escribió antes de save(). Sin n en capa, el revisor no audita el paquete.",
 retrospective:
 "`drawString` escribe la capa digital **antes** de `save()`; no se “arregla” después con un print True inventado. Sin n en el extract, el revisor no audita el paquete. Pregunta: ¿por qué hardcodear `print(True)` falla el espíritu aunque “pase” visualmente? Siguiente (E2): render de página a PNG con tamaño > 0.",
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
 title: "Render de página PDF a PNG",
 preamble:
 "- **Contexto:** la checklist visual del cierre CP-N2-B exige ver el informe, no solo confiar en el path.\n- **Meta:** generar PDF, renderizar página 0 a PNG con fitz y verificar tamaños.\n- **Éxito:** `True True` (PDF y PNG con `st_size > 0`).\n- **Límites:** no imprimas True si el PNG no existe; no verifiques solo el nombre del archivo.",
 instruction:
 "1. Tras `save()` del PDF, abre con `fitz.open(pdf)`.\n2. En la página 0, `get_pixmap().save(png)`.\n3. Compara tamaños positivos de ambos paths.\n4. Imprime los dos booleanos en una línea.",
 hint: "Abre con fitz.open(path), usa get_pixmap() y save().",
 hints: [
 "Cierra o conserva el documento mientras accedes a la página.",
 "Verifica tamaño positivo, no solo el nombre del archivo.",
 ],
 edgeCases: ["PDF sin páginas", "ruta PNG no escribible"],
 tests: "True True: PDF y PNG con st_size > 0",
 feedback:
 "Si el segundo booleano es False, nunca creaste el PNG o no verificaste `st_size > 0`. La checklist visual del cierre CP-N2-B exige ver el informe, no solo confiar en que el path “suena bien”.",
 retrospective:
 "Extracción y render son pruebas distintas: una mira capa digital, la otra legibilidad. Ambas deben ser archivos reales en disco. Pregunta: ¿un PDF con `st_size > 0` y un PNG de 0 bytes cierra la checklist visual? Luego (E3): PDF solo-imagen y abstención `needs_ocr`.",
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
 title: "PDF imagen-only y needs_ocr",
 preamble:
 "- **Contexto:** un “PDF” que solo incrusta un PNG con texto dibujado no es capa digital; inventar lectura es fraude de reporting.\n- **Meta:** insertar imagen (sin `drawString`), extraer con pypdf y marcar `needs_ocr` si la capa está vacía.\n- **Éxito:** `True True` y `{'needs_ocr': True, 'n_chars': 0}`.\n- **Límites:** no agregues `drawString` “para que pase”; no inventes el texto de n=17 en el extract.",
 instruction:
 "1. Conserva el pipeline PNG → `drawImage` (sin texto vectorial).\n2. Extrae y normaliza `extract_text() or \"\"`.\n3. Imprime si es PDF válido y si **n=17 NO** está en el texto.\n4. Calcula `needs_ocr` con `not bool(text.strip())` y `n_chars=len(text)`.",
 hint: "Pillow dibuja el PNG; reportlab.drawImage lo inserta como imagen; la extracción vacía activa abstención.",
 hints: [
 "No agregues texto con drawString al PDF: eso crearía capa digital.",
 "Normaliza extract_text() or '' antes de strip().",
 ],
 edgeCases: ["OCR no instalado", "extracción devuelve None"],
 tests: "True True y dict needs_ocr=True con n_chars=0",
 feedback:
 "Si `needs_ocr` queda False, o inventaste texto o agregaste `drawString`. Un PNG con “n=17” dibujado no es capa digital: abstente; no finjas PDF nativo ante el comité.",
 retrospective:
 "Abstenerse con honestidad es el contrato; OCR llega en S24. Pregunta: ¿qué daño hace inventar “n=17” desde el PNG? Puente a T3-A: narrativa con H→evidencia y `decision=None`.",
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
 title: "Hallazgo H1 con evidencia y decision=None",
 preamble:
 "- **Contexto:** el comité de Lima aprueba evidencia, no eslóganes de pricing embebidos en el factory.\n- **Meta:** completar el dict del hallazgo con id, claim, evidencia Tabla1 y `decision=None`.\n- **Éxito:** imprime `H1 Tabla1 True` (id, evidencia, decision es None).\n- **Límites:** no dejes una acción de negocio en `decision`; no omitas el id.",
 instruction:
 "1. El starter trae claim y una decisión de negocio (bug).\n2. Agrega `\"id\": \"H1\"` y `\"evidencia\": \"Tabla1\"`.\n3. Pon `decision` en `None`.\n4. Imprime id, evidencia y el booleano `decision is None` (no el claim).",
 hint: "El hallazgo lleva id, claim, evidencia y decision; la decisión de negocio se deja en None hasta revisión humana.",
 hints: [
 "Completa las claves faltantes del dict (id, claim, evidencia, decision).",
 "Imprime id, evidencia y si decision es None — no imprimas el claim en la línea de control.",
 ],
 edgeCases: ["id duplicado", "decision con texto de acción"],
 tests: "print H1 Tabla1 True",
 feedback:
 "Sin id de evidencia el hallazgo no es auditable; decision=None recuerda que hallazgo ≠ decisión de negocio. Un claim sin Tabla1 es eslogan ante el comité.",
 retrospective:
 "Sin Tabla1, H1 no entra al paquete de aprobación. `decision=None` es honestidad de proceso, no timidez: el factory no aprueba pricing. Pregunta: si dejas `decision=\"subir precios\"`, ¿qué riesgo corre el comité al leer el DOCX? Siguiente (E2): el resumen debe llevar `n=` y `PEN`.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# Lab CASO-LIM-021 — hallazgo H→evidencia
# TODO: completa id, evidencia Tabla1 y decision=None; no dejes una decisión de negocio
h = {
 "claim": "Lima > Madrid en mediana",
 "decision": "subir precios",
}
print(h.get("id"), h.get("evidencia"))`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `h = {
 "id": "H1",
 "claim": "Lima > Madrid en mediana",
 "evidencia": "Tabla1",
 "decision": None,
}
print(h["id"], h["evidencia"], h["decision"] is None)`,
 output: `H1 Tabla1 True`,
 },
 },
 {
 id: "S21-T3-A-E2",
 subtopicId: "S21-T3-A",
 kind: "independent",
 title: "Resumen con n= y unidad PEN",
 preamble:
 "- **Contexto:** un resumen sin tamaño muestral ni unidad no se reconcilia con el workbook ni el dashboard.\n- **Meta:** corregir el string y validar presencia de `n=` y `PEN`.\n- **Éxito:** imprime `True`.\n- **Límites:** no basta el número 28 suelto; no uses “pen” en minúsculas si el test busca `PEN`.",
 instruction:
 "1. Reemplaza `s = \"mediana 28\"` por un resumen que incluya unidad y n.\n2. Valida con `\"n=\" in s and \"PEN\" in s`.\n3. Imprime un solo booleano.\n4. Ejemplo válido del lab: mencionar mediana, PEN y n=40.",
 hint: "Usa el operador in dos veces (n= y PEN) con and.",
 hints: [
 "Ambas subcadenas deben aparecer: n= y PEN.",
 "No basta con el número 28 sin unidad ni n.",
 ],
 edgeCases: ["n sin =", "pen minúscula"],
 tests: "print True cuando el resumen incluye n= y PEN",
 feedback:
 "Un resumen sin n= o sin PEN es eslogan: el revisor no puede reconciliar tamaño de muestra ni unidad con el EDA/S20.",
 retrospective:
 "Eslogan ≠ resumen auditable. El revisor busca `n=` y unidad en un vistazo para reconciliar con EDA/S20. Pregunta: ¿por qué `\"mediana 28 pen\"` con p minúscula puede fallar el test aunque “se entienda”? Luego (E3): empaquetar resumen, método y hallazgos en un solo dict.",
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
 title: "pack_report con tres claves",
 preamble:
 "- **Contexto:** sin clave `metodo`, el paquete mezcla opinión con procedimiento y el revisor no separa evidencia de sesgo.\n- **Meta:** implementar `pack_report` que devuelva resumen, metodo y hallazgos.\n- **Éxito:** `['hallazgos', 'metodo', 'resumen']` (claves ordenadas).\n- **Límites:** no omitas `metodo`; no agregues claves de decisión de negocio aquí.",
 instruction:
 "1. El return del starter solo tiene resumen y hallazgos.\n2. Incluye `\"metodo\": metodo` en el dict.\n3. Imprime `sorted(...keys())` del resultado de la llamada de prueba.\n4. No alteres los argumentos de la firma.",
 hint: "Devuelve un dict con las tres claves; usa sorted(...keys()).",
 hints: [
 "Devuelve un dict con las tres claves.",
 "print(sorted(pack_report(...).keys())).",
 ],
 edgeCases: ["tipos"],
 tests: "claves ordenadas: hallazgos, metodo, resumen",
 feedback:
 "Si en las claves ordenadas no aparece `metodo`, el return del starter sigue incompleto. Sin método, el revisor no separa procedimiento de opinión en el paquete.",
 retrospective:
 "Tres claves = contrato de narrativa ejecutiva (resumen / método / hallazgos). Método documentado protege de “insights” opacos. Pregunta: ¿dónde meterías una recomendación de precios si no va en el hallazgo? Puente a T3-B: paridad numérica entre dash y doc más limitaciones visibles.",
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
 title: "Paridad dash/doc y límite solo web",
 preamble:
 "- **Contexto:** el paquete del comité debe reconciliar métricas y declarar cobertura web-only donde el lector la vea.\n- **Meta:** alinear `median_Lima` en dash y doc e incluir `\"solo web\"` en limits.\n- **Éxito:** `True True` (paridad y limitación presentes).\n- **Límites:** no dejes 27.0 “porque redondeaste a mano”; no uses limits vacía.",
 instruction:
 "1. Corrige `doc[\"median_Lima\"]` a 28.0.\n2. Pon `limits = [\"solo web\"]`.\n3. Imprime `dash == doc` y `\"solo web\" in limits`.\n4. No inventes otras claves de métrica.",
 hint: "Compara dash == doc y verifica \"solo web\" in limits.",
 hints: [
 "Ambos dicts deben llevar median_Lima=28.0.",
 "La lista limits debe incluir el string exacto \"solo web\".",
 ],
 edgeCases: ["float vs. int", "limits vacía"],
 tests: "print True True (paridad y limitación presentes)",
 feedback:
 "Si el primer booleano es False, `doc[\"median_Lima\"]` sigue en 27.0 (redondeo a mano). Si el segundo falla, `limits` no incluye el string exacto `\"solo web\"`: el lector no ve la cobertura.",
 retrospective:
 "Paridad y límites viajan juntos: números reconciliados sin cobertura visible aún engañan al comité sobre la muestra web-only. Pregunta: ¿qué malinterpreta el lector si ve 28.0 sin “solo web”? Siguiente (E2): caption de figura con campo Fuente visible.",
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
 title: "Caption con campo Fuente visible",
 preamble:
 "- **Contexto:** un pie de figura sin Fuente impide reconciliar el PNG del dashboard con el dataset del factory.\n- **Meta:** construir un caption CASO-LIM-021 que declare Fuente y n de Lima.\n- **Éxito:** imprime `True` cuando `\"Fuente\" in cap`.\n- **Límites:** no uses solo `n=40` sin nombrar Fuente; no inventes otro n de muestra.",
 instruction:
 "1. El starter tiene `Fig1 | n=40` sin Fuente.\n2. Amplía el string con un segmento `| Fuente: sintético |` (o equivalente legible).\n3. Conserva n=40 de la muestra Lima.\n4. Imprime el booleano de presencia de `\"Fuente\"`.",
 hint: "Incluye un segmento | Fuente: … y el n de la muestra Lima.",
 hints: [
 "El pie debe nombrar la Fuente de forma legible (no solo n).",
 "Verifica con el operador in sobre la palabra Fuente.",
 ],
 edgeCases: ["fuente minúscula"],
 tests: "print True cuando el caption declara Fuente",
 feedback:
 "Un pie sin «Fuente» impide reconciliar la figura con el dataset del factory. Usa n=40 (muestra Lima del lab), no un n inventado.",
 retrospective:
 "Caption = puente visual al dataset. Sin `Fuente`, el PNG es decoración y no se reconcilia con el factory. Pregunta: ¿basta poner solo `n=40` sin nombrar la fuente? Luego (E3): checksum a tres artefactos con `a == b == c`.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# Lab CASO-LIM-021 — caption con Fuente
# TODO: el caption debe declarar Fuente de forma visible (y n=40)
cap = "Fig1 | n=40"
print("Fuente" in cap)`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `cap = "Fig1 | Fuente: sintético | n=40"
print("Fuente" in cap)`,
 output: `True`,
 },
 },
 {
 id: "S21-T3-B-E3",
 subtopicId: "S21-T3-B",
 kind: "transfer",
 title: "check_parity en tres artefactos",
 preamble:
 "- **Contexto:** comparar solo dashboard y Excel deja pasar un DOCX divergente; el cierre exige tres vías.\n- **Meta:** implementar `check_parity(a, b, c)` como `a == b == c`.\n- **Éxito:** dos líneas — `True` luego `False`.\n- **Límites:** no uses solo `a == b`; no ignores el tercer argumento.",
 instruction:
 "1. El starter hace `return a == b` (bug).\n2. Cambia a igualdad encadenada de a, b y c.\n3. Conserva los dos prints de prueba (alineado y divergente).\n4. No mutes los dicts de entrada.",
 hint: "La igualdad debe involucrar los tres argumentos, no solo los dos primeros.",
 hints: [
 "La igualdad debe involucrar los **tres** argumentos, no solo los dos primeros.",
 "Conserva los dos prints de prueba (caso alineado y caso divergente).",
 ],
 edgeCases: ["keys extra"],
 tests: "dos líneas: True luego False",
 feedback:
 "Si el segundo print sale True con doc divergente, tu función sigue en `a == b`. El cierre CP-N2-B exige tres vías (dash, xlsx, doc).",
 retrospective:
 "Tres superficies, un número. Comparar solo dos deja “salvarse” al artefacto omitido. Pregunta: en un fallo real, ¿qué artefacto conviene listar primero en el reporte de discrepancia? Puente a T4-A: misma precisión decimal y a11y mínima.",
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
 title: "Precisión a 1 decimal PEN",
 preamble:
 "- **Contexto:** el contrato del lab unifica métricas PEN a 1 decimal en dashboard, Excel e informe.\n- **Meta:** redondear `vals = [28.04, 28.0]` a 1 decimal.\n- **Éxito:** imprime `[28.0, 28.0]`.\n- **Límites:** no uses `round(..., 0)`; no hardcodees la lista de salida.",
 instruction:
 "1. El starter hace `round(v, 0)` (bug).\n2. Cambia a `round(v, 1)` en la comprehension.\n3. Imprime la lista resultante.\n4. Verifica que ambos elementos sean 28.0.",
 hint: "list comprehension con round(v, 1).",
 hints: [
 "list comprehension con round(v, 1).",
 "No uses round a 0 decimales.",
 ],
 edgeCases: ["banker's rounding"],
 tests: "print [28.0, 28.0]",
 feedback:
 "Si imprimes `[28.0, 28.0]` con `round(v, 0)` “de casualidad” en este fixture, el bug sigue ahí: el contrato del lab es **1** decimal, no 0. Cambia el segundo argumento de `round`.",
 retrospective:
 "0 decimales “aplana” y rompe el contrato de 1 decimal PEN del factory en dash, Excel e informe. Pregunta: ¿qué pasa con 28.04 si redondeas a 0 decimales en un lote real? Siguiente (E2): encapsular redondeo + unidad en `fmt_pen`.",
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
 title: "fmt_pen con unidad PEN",
 preamble:
 "- **Contexto:** si Jinja y Excel inventan el sufijo por separado, un canal escribe “PEN” y otro “soles” o nada.\n- **Meta:** implementar `fmt_pen(x)` a 1 decimal con sufijo ` PEN`.\n- **Éxito:** imprime `28.0 PEN` para 28.04.\n- **Límites:** no omitas la unidad; no redondees a 0 decimales.",
 instruction:
 "1. El return del starter solo formatea el número.\n2. Agrega el literal ` PEN` al f-string.\n3. Conserva `round(float(x), 1)`.\n4. Imprime `fmt_pen(28.04)`.",
 hint: "f-string con round(float(x), 1) y sufijo PEN.",
 hints: [
 "f-string con round(float(x), 1) y sufijo PEN.",
 "La unidad evita divergencias entre plantillas.",
 ],
 edgeCases: ["None"],
 tests: "print 28.0 PEN",
 feedback:
 "Si ves solo `28.0` sin unidad, el f-string no concatena ` PEN`. Sin formatter central, Jinja y Excel inventan “soles”, “PEN” o nada y el comité ve tres idiomas.",
 retrospective:
 "Formatter central = paridad tipográfica entre canales. El error clásico es formatear el número en un sitio y la unidad en otro. Pregunta: ¿qué imprime `fmt_pen(28.04)` si redondeas a 0 decimales y omites la unidad? Luego (E3): gate a11y que no se engañe con `all([])`.",
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
 title: "a11y_min con H1 y alts útiles",
 preamble:
 "- **Contexto:** publicar un paquete sin alternativas de figura falla a lectores con tecnología asistiva — y al checklist del lab.\n- **Meta:** `a11y_min(has_h1, alts)` exige H1, lista no vacía y todos los alt con más de 10 caracteres.\n- **Éxito:** tres líneas — `True`, `False`, `False`.\n- **Límites:** no devuelvas solo `has_h1`; recuerda que `all([])` es True en Python.",
 instruction:
 "1. El starter retorna solo `has_h1`.\n2. Combina `bool(has_h1)`, `len(alts) > 0` y `all(len(a) > 10 for a in alts)`.\n3. Conserva los tres prints de prueba (válido, corto, vacío).\n4. No borres el caso de lista vacía: es el truco del edge case.",
 hint: "Combina tres condiciones: H1, lista no vacía, y longitud útil en cada alt.",
 hints: [
 "Combina tres condiciones: H1, lista no vacía, y longitud útil en **cada** alt.",
 "El caso de lista vacía debe fallar: no confíes solo en `all(...)` sobre una lista sin elementos.",
 ],
 edgeCases: ["alts vacía debe ser False: all([]) es True y no basta"],
 tests: "tres líneas: True, False, False",
 feedback:
 "has_h1 solo no basta. Un alt de 5 caracteres no describe n ni unidad; una lista vacía tampoco (all([]) es True y haría pasar el gate por error).",
 retrospective:
 "`all([])` aprueba por vacío; por eso exiges `len(alts) > 0` además de la longitud de cada alt. `has_h1` solo no es a11y. Pregunta: ¿qué imprime el tercer print si olvidas el check de lista vacía? Puente a T4-B: provenance, huella y `ready` con `all()` sobre la checklist visual.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# Lab CASO-LIM-021 — a11y_min H1 + alts no vacíos
# TODO: exige al menos un alt y longitud útil en cada uno; no solo has_h1
def a11y_min(has_h1, alts):
 return has_h1
print(a11y_min(True, ["descripción larga de figura"]))
print(a11y_min(True, ["corto"]))
print(a11y_min(True, []))`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `def a11y_min(has_h1, alts):
 return bool(has_h1) and len(alts) > 0 and all(len(a) > 10 for a in alts)
print(a11y_min(True, ["descripción larga de figura"]))
print(a11y_min(True, ["corto"]))
print(a11y_min(True, []))`,
 output: `True
False
False`,
 },
 },
 {
 id: "S21-T4-B-E1",
 subtopicId: "S21-T4-B",
 kind: "guided",
 title: "Manifiesto pending_review (no approved)",
 preamble:
 "- **Contexto:** el factory prepara el paquete; la aprobación humana es S22. Marcar `approved` en código es fraude de proceso.\n- **Meta:** completar run_id, data_sha1_8 y `approval.status = pending_review`.\n- **Éxito:** imprime `cpn2b-01 pending_review`.\n- **Límites:** no hardcodees `approved`; no omitas run_id.",
 instruction:
 "1. El starter tiene status `approved` y no trae run_id/huella.\n2. Agrega `\"run_id\": \"cpn2b-01\"` y `\"data_sha1_8\": \"385fcd67\"`.\n3. Cambia status a `\"pending_review\"`.\n4. Imprime run_id y status desde el dict (una línea, espacio entre ambos).",
 hint: "El manifiesto une identidad de corrida, huella corta de lab y cola de aprobación; no marques approved en código.",
 hints: [
 "Rellena run_id, data_sha1_8 y el status anidado bajo approval.",
 "Lee run_id y status desde el dict al imprimir — no un string suelto \"approved\".",
 ],
 edgeCases: ["typo status"],
 tests: "print cpn2b-01 pending_review",
 feedback:
 "No hardcodees «approved»: el cierre de contenido deja pending_review hasta revisión humana (S22). Un manifiesto sin run_id no es provenance auditable.",
 retrospective:
 "Manifiesto sin `run_id` no es provenance. `pending_review` deja la puerta abierta a comentarios del revisor humano (S22); `approved` en código es fraude de proceso. Pregunta: ¿qué falta en un dict que solo tiene `artifacts` y status? Siguiente (E2): calcular la huella corta del payload de lab.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# Lab CASO-LIM-021 — manifiesto de provenance
# TODO: completa run_id, huella corta y approval.status=pending_review
prov = {
 "artifacts": ["informe.docx", "informe.pdf"],
 "approval": {"status": "approved"},
}
print(prov["approval"]["status"])`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `prov = {
 "run_id": "cpn2b-01",
 "data_sha1_8": "385fcd67",
 "artifacts": ["informe.docx", "informe.pdf"],
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
 title: "Huella corta sha1[:8] de lab",
 preamble:
 "- **Contexto:** el manifiesto necesita un id de payload; en el lab usamos 8 hex de sha1 como didáctica.\n- **Meta:** calcular sha1 de `b\"synthetic\"` y mostrar solo los primeros 8 hex.\n- **Éxito:** imprime `385fcd67`.\n- **Límites:** no imprimas el digest completo; no uses otro payload.",
 instruction:
 "1. El starter imprime `hexdigest()` entero.\n2. Aplica el slice `[:8]` al resultado.\n3. Conserva `hashlib.sha1(b\"synthetic\")`.\n4. Imprime solo la cadena de 8 caracteres.",
 hint: "hashlib.sha1(...).hexdigest()[:8].",
 hints: [
 "Aplica un slice de 8 caracteres al hexdigest.",
 "No imprimes el digest completo.",
 ],
 edgeCases: ["encoding"],
 tests: "print 385fcd67",
 feedback:
 "Si imprimes 40 caracteres hex, falta el slice `[:8]`. Conserva el payload `b\"synthetic\"`: otro input produce otra huella y no cuadrará con el manifiesto del lab (`385fcd67`).",
 retrospective:
 "Recorte de 8 hex = id didáctico (débil ante colisiones). En producción firmas el artefacto completo con SHA-256, no un string de juguete. Pregunta: ¿por qué el manifiesto necesita huella además de `run_id`? Luego (E3): `ready` exige **todos** los artefactos, no “alguno”.",
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
 title: "ready con all sobre la checklist",
 preamble:
 "- **Contexto:** un solo artefacto “ok” no cierra CP-N2-B; faltan dashboard, xlsx y doc.\n- **Meta:** implementar `ready(checklist)` como `all(checklist.values())`.\n- **Éxito:** dos líneas — `True` luego `False`.\n- **Límites:** no uses `any()`; un artefacto fallido bloquea el cierre.",
 instruction:
 "1. El starter retorna `any(...)` (bug).\n2. Cámbialo a `all(checklist.values())`.\n3. Conserva los dos prints (checklist completa e incompleta).\n4. No rellenes a mano los booleanos de salida.",
 hint: "Un solo artefacto en verde no debe bastar para cerrar el paquete.",
 hints: [
 "Un solo artefacto en verde no debe bastar para cerrar el paquete.",
 "Piensa en el opuesto de “¿hay alguno listo?”: “¿están listos todos?”.",
 ],
 edgeCases: ["keys faltantes"],
 tests: "dos líneas: True luego False",
 feedback:
 "any() aprueba con un solo artefacto listo; el factory exige all() (dashboard + xlsx + doc) antes de mandar a S22.",
 retrospective:
 "`any()` aprueba con un solo verde; el factory exige el paquete completo. Pregunta de cierre: ¿qué checklist dejarías en False a propósito para detener un envío a S22? El You Do une DOCX, PDF, PNG y manifiesto en una corrida.",
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
 "En un comité de analytics en Lima te piden el **paquete único** de CASO-LIM-021: no tres exportaciones sueltas, sino una corrida que una EDA (S18), dashboard (S19) y Excel (S20) en un **factory de reportes trazables**. El entregable cierra **CP-N2-B**: DOCX y PDF con los mismos números (mediana Lima 28.0 PEN, n=40, cobertura solo web), captions con Fuente, missing como `—`, provenance y cola `pending_review`. Datos sintéticos únicamente; sin PII. El siguiente paso del currículum (S22) envía y aprueba; aquí dejas el paquete listo para revisión humana.",
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
        {"id": "H1", "texto": "Lima > Madrid en mediana", "evidencia": "Tabla1", "decision": None},
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
 "Paquete final CP-N2-B: dashboard + xlsx + informe (DOCX/PDF/PNG) con provenance y checklist visual; listo para revisión humana antes del flujo de email/aprobación en S22. No marques el paquete como aprobado desde el código del factory. Antes de marcar listo, responde las tres preguntas de la retrospective.",
 retrospective:
 "Antes de marcar listo: (1) ¿qué invariante de paridad demuestras con un print o assert (median_Lima y n_Lima iguales en context, DOCX reabierto y PDF extraído)? (2) ¿por qué el manifiesto deja `pending_review` y no `approved`, y qué revisaría un humano en la checklist visual? (3) Escribe en el README una frase de impacto medible (antes: tres exportaciones divergentes / después: un run_id y un número) que puedas defender en 30 segundos ante un comité de operaciones en Lima. Datos solo sintéticos; sin PII.",
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
 question: "En la narrativa del informe, un hallazgo H1 con evidencia Tabla1 debe llevar decision=None. ¿Por qué?",
 options: ["Porque hallazgo ≠ decisión de negocio hasta revisión humana", "Porque el Excel de S20 no admite decisiones", "Porque Jinja no puede renderizar strings de decisión", "Porque el PDF digital prohíbe recomendaciones"],
 correctIndex: 0,
 explanation:
 "La evidencia se empaqueta con id y mapa H→tabla; la decisión de negocio la toma un humano en la cola de aprobación (S22), no el factory.",
 },
 {
 question: "Si la mediana de Madrid no está disponible, ¿cómo debe representarse en el informe?",
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
 {
 question: "La checklist mínima de a11y del lab (has_h1 + alts) debe fallar cuando la lista de alts está vacía. ¿Por qué no basta con all(len(a) > 10 for a in alts)?",
 options: ["Porque Jinja no admite listas vacías", "Porque all([]) es True en Python y aprobaría un paquete sin alternativas", "Porque ReportLab exige al menos dos alts", "Porque SHA-256 no firma listas vacías"],
 correctIndex: 1,
 explanation:
 "En Python, all([]) es True. El contrato mínimo exige H1, al menos un alt y longitud útil en cada uno; una lista vacía no describe ninguna figura.",
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
