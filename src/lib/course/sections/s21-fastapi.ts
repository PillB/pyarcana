import type { CourseSection } from '../../types'

export const section21: CourseSection = {
  id: "fastapi",
  index: 21,
  title: "Documentos, plantillas y reportes trazables",
  shortTitle: "Reportes trazables",
  tagline: "Accessible Insights Dashboard & Reporting Factory genera dashboard, DOCX/PDF y workbook desde una corrida, con números reconciliados y revisión visual",
  estimatedHours: 19,
  level: "Competente",
  phase: 1,
  icon: "Server",
  accentColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
  jobRelevance:
    "Cerrar **CP-N2-B** exige un **Reporting Factory** que una dashboard, Excel y documentos reales con números reconciliados, provenance y aprobación.",
  learningOutcomes: [
    { text: "Separar datos y presentación con Jinja" },
    { text: "Renderizar condiciones/tablas con formato seguro" },
    { text: "Generar, abrir, extraer y renderizar DOCX/PDF locales" },
    { text: "Distinguir PDF digital de imagen/OCR" },
    { text: "Estructurar informe ejecutivo con método y hallazgos" },
    { text: "Embeber gráficos/tablas con fuentes y limitaciones" },
    { text: "Revisar redacción, a11y y consistencia numérica" },
    { text: "Documentar provenance y flujo de aprobación" },
  ],
  theory: [
    {
      heading: "Reporting Factory y cierre CP-N2-B",
      paragraphs: [
        "Aquí cierras CP-N2-B: plantillas Jinja, documentos DOCX/PDF locales, consistencia numérica con dashboard/Excel y **provenance + aprobación**.",
        "Una sola corrida produce artefactos alineados (mismos n y métricas que S18–S20).",
        "Orden: **T1 Plantillas** → **T2 Documentos** → **T3 Narrativa** → **T4 Calidad y gobernanza**.",
      ],
      callout: {
        type: "info",
        title: "Evidencia operativa",
        content:
          "El gate conserva los archivos DOCX/PDF, el texto extraído, una vista renderizada y sus hashes; un dict no sustituye esos artefactos.",
      },
    },
    {
      heading: "Jinja y separación datos/presentación",
      subtopicId: "S21-T1-A",
      paragraphs: [
        "Jinja permite **plantillas** con `{{ variables }}` y `{% bloques %}`. Los datos se preparan en Python; la plantilla solo presenta.",
        "Nunca pongas lógica de negocio pesada en la plantilla: calcula métricas antes del render.",
        "Autoescape en HTML; en texto plano define políticas de caracteres.",
      ],
      code: {
        language: 'python',
        title: "jinja_basic.py",
        code: `from jinja2 import Template

tmpl = Template("Región {{ region }}: mediana {{ median }} PEN (n={{ n }})")
print(tmpl.render(region="Lima", median=28.0, n=40))`,
        output: `Región Lima: mediana 28.0 PEN (n=40)`,
      },
      callout: {
        type: "tip",
        title: "Context dict único",
        content:
          "Pasa un context versionado (run_id, metricas, limites) a todas las plantillas del factory.",
      },
    },
    {
      heading: "condiciones, tablas y formato seguro",
      subtopicId: "S21-T1-B",
      paragraphs: [
        "`{% if %}` y `{% for %}` construyen tablas. Formatea números con filtros o preformateo en Python (`f\"{x:.2f}\"`) para consistencia.",
        "Evita inyección: no marques strings de usuario como safe en HTML sin sanitizar.",
        "Celdas vacías: muestra “—” y documenta missing, no inventes ceros.",
      ],
      code: {
        language: 'python',
        title: "jinja_table.py",
        code: `from jinja2 import Template

tmpl = Template(
    """{% for r in rows %}- {{ r.region }}: {{ '%.2f'|format(r.median) }} PEN
{% endfor %}"""
)
rows = [{"region": "Lima", "median": 28.0}, {"region": "Cusco", "median": 22.5}]
print(tmpl.render(rows=rows))`,
        output: `- Lima: 28.00 PEN
- Cusco: 22.50 PEN
`,
      },
      callout: {
        type: "warning",
        title: "Cero vs missing",
        content:
          "Imprimir 0.00 cuando no hay datos es un error de reporting grave.",
      },
    },
    {
      heading: "DOCX real: estilos, guardado y extracción",
      subtopicId: "S21-T2-A",
      paragraphs: [
        "Un informe trazable tiene secciones fijas: portada, resumen, método, hallazgos, anexos. Los estilos (Heading 1/2) habilitan TOC y a11y.",
        "Con `python-docx`, `Document()` crea el paquete OOXML, `add_heading` aplica estilos y `save` escribe un `.docx` real. Reabrir el archivo y extraer sus párrafos prueba que el artefacto no es solo una estructura en memoria.",
        "El `.docx` es un ZIP de XML y recursos. El gate verifica firma ZIP, headings, texto extraído y tamaño antes de aprobarlo.",
      ],
      code: {
        language: 'python',
        title: "docx_real.py",
        code: `from pathlib import Path
from docx import Document

path = Path("informe.docx")
doc = Document()
doc.add_heading("Informe sintético", level=0)
doc.add_heading("Resumen ejecutivo", level=1)
doc.add_paragraph("Ticket mediano: 28.0 PEN (n=40).")
doc.save(path)

opened = Document(path)
text = "\n".join(p.text for p in opened.paragraphs if p.text)
print(path.exists(), path.read_bytes()[:2] == b"PK")
print("Resumen ejecutivo" in text, "n=40" in text)`,
        output: `True True
True True`,
      },
      callout: {
        type: "tip",
        title: "Outline primero",
        content:
          "Congela el outline antes de redactar párrafos largos.",
      },
    },
    {
      heading: "PDF digital real: generación, extracción y render",
      subtopicId: "S21-T2-B",
      paragraphs: [
        "Un **PDF digital** contiene texto seleccionable; un **PDF escaneado** es imagen y requiere OCR con errores típicos.",
        "`reportlab` genera un PDF digital, `pypdf` extrae su capa de texto y PyMuPDF (`fitz`) renderiza una página a PNG para la revisión visual. Los tres pasos operan sobre archivos locales reales.",
        "Si la extracción queda vacía, el contrato devuelve `needs_ocr`; no inventa texto. El hash, el PNG y la reconciliación numérica quedan en el manifest.",
      ],
      code: {
        language: 'python',
        title: "pdf_real.py",
        code: `from pathlib import Path
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
print(png.exists(), png.stat().st_size > 0)`,
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
      heading: "resumen ejecutivo, método y hallazgos",
      subtopicId: "S21-T3-A",
      paragraphs: [
        "El **resumen ejecutivo** responde la pregunta de negocio en ≤5 viñetas con n e incertidumbre. **Método** describe datos, filtros y métricas. **Hallazgos** citan tablas/figuras.",
        "No mezcles método con opinión. Cada hallazgo mapea a un id de evidencia (p. ej. H1 → Tabla 2).",
        "Alineado a S18: hallazgo ≠ decisión.",
      ],
      code: {
        language: 'python',
        title: "exec_struct.py",
        code: `report = {
    "resumen": ["Ticket mediano Lima 28 PEN en muestra web (n=40)"],
    "metodo": {"fuente": "sintetico", "filtros": ["canal=web"], "corte": "2024-06-30"},
    "hallazgos": [{"id": "H1", "texto": "Lima > Cusco en mediana", "evidencia": "Tabla2"}],
}
print(report["resumen"][0])
print(report["hallazgos"][0]["evidencia"])`,
        output: `Ticket mediano Lima 28 PEN en muestra web (n=40)
Tabla2`,
      },
      callout: {
        type: "success",
        title: "Trazabilidad H→evidencia",
        content:
          "Sin id de evidencia, el hallazgo no entra al paquete de aprobación.",
      },
    },
    {
      heading: "gráficos, tablas, fuentes y limitaciones",
      subtopicId: "S21-T3-B",
      paragraphs: [
        "Inserta figuras del dashboard (S19) y tablas del Excel (S20) con **caption** idéntico en fuente/corte/n.",
        "Lista de limitaciones al final de hallazgos, no escondida en anexo solo.",
        "Reconciliación: checksum de métricas clave entre artefactos.",
      ],
      code: {
        language: 'python',
        title: "embed_limits.py",
        code: `metrics = {"median_Lima": 28.0, "n_Lima": 40}
caption = "Fig.1 Ticket mediano | Fuente: sintético | n_Lima=40"
assert "40" in caption
bundle = {"fig": "fig1.png", "table": "tabla2", "metrics": metrics, "limits": ["solo web"]}
print(bundle["metrics"])
print(bundle["limits"])`,
        output: `{'median_Lima': 28.0, 'n_Lima': 40}
['solo web']`,
      },
      callout: {
        type: "warning",
        title: "Números divergentes",
        content:
          "Si el DOCX dice 28 y el Excel 27.5, el factory falla el gate de cierre.",
      },
    },
    {
      heading: "redacción, accesibilidad y consistencia",
      subtopicId: "S21-T4-A",
      paragraphs: [
        "Redacción clara en español profesional (es-PE): evita anglicismos innecesarios en el cuerpo ejecutivo.",
        "A11y: headings reales, texto alt de figuras, tablas con encabezados, contraste en HTML.",
        "Consistencia: misma precisión decimal (p. ej. 1 decimal PEN) en todo el paquete.",
      ],
      code: {
        language: 'python',
        title: "consistency.py",
        code: `vals = [28.04, 28.0, 28]
precision = 1
norm = [round(float(v), precision) for v in vals]
print(norm)
print("consistente", len(set(norm)) == 1)`,
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
      heading: "render visual, provenance y aprobación",
      subtopicId: "S21-T4-B",
      paragraphs: [
        "Registra **provenance**: run_id, git/sha de datos, versiones de script, hashes de artefactos.",
        "Cola de **aprobación**: borrador → revisión visual → aprobado/rechazado con comentarios.",
        "El cierre de CP-N2-B exige provenance completo + checklist visual (dashboard, xlsx, doc).",
      ],
      code: {
        language: 'python',
        title: "provenance.py",
        code: `import hashlib, json
from datetime import datetime, timezone

artifacts = {"dashboard": "ok", "xlsx": "ok", "doc": "ok"}
prov = {
    "run_id": "cpn2b-20240630-01",
    "ts": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    "data_sha1_8": hashlib.sha1(b"synthetic").hexdigest()[:8],
    "artifacts": artifacts,
    "approval": {"status": "pending_review", "reviewer": None},
}
print(json.dumps(prov, ensure_ascii=False))`,
        output: `{"run_id": "cpn2b-20240630-01", "ts": "2026-07-20T07:47:08Z", "data_sha1_8": "385fcd67", "artifacts": {"dashboard": "ok", "xlsx": "ok", "doc": "ok"}, "approval": {"status": "pending_review", "reviewer": null}}`,
      },
      callout: {
        type: "success",
        title: "Gate de cierre",
        content:
          "Sin provenance y sin revisión visual registrada, CP-N2-B no se considera cerrado en contenido (el ledger lo confirma otra lane).",
      },
    },
  ],
  iDo: {
    intro: "Te muestro el Reporting Factory: Jinja, secciones, paridad de números, a11y y provenance para cerrar CP-N2-B.",
    steps: [
      {
        demoId: "S21-T1-A-DEMO",
        subtopicId: "S21-T1-A",
        environment: "local-python",
        description: "Separar datos de plantilla Jinja con context único",
        code: {
          language: 'python',
          title: "demo_jinja.py",
          code: `from jinja2 import Template

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
print(tmpl.render(**context))`,
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
          code: `from jinja2 import Template

tmpl = Template(
    """{% for r in rows %}{{ r.region }}: {{ r.median if r.median is not none else '—' }}
{% endfor %}"""
)
rows = [
    {"region": "Lima", "median": 28.0},
    {"region": "Cusco", "median": None},
]
print(tmpl.render(rows=rows))`,
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
          code: `from pathlib import Path
from docx import Document

path = Path("reporte.docx")
doc = Document()
doc.add_heading("Resumen ejecutivo", 1)
doc.add_paragraph("Fuente: sintética; n=40")
doc.save(path)
reopened = Document(path)
headings = [p.text for p in reopened.paragraphs if p.style.name.startswith("Heading")]
print(path.suffix, path.read_bytes()[:2] == b"PK")
print(headings)`,
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
          code: `from pathlib import Path
import fitz
from pypdf import PdfReader
from reportlab.pdfgen import canvas

pdf = Path("reporte.pdf")
c = canvas.Canvas(str(pdf))
c.drawString(72, 760, "Hallazgo H1; n=32")
c.save()
text = PdfReader(pdf).pages[0].extract_text() or ""
png = Path("reporte-p1.png")
fitz.open(pdf)[0].get_pixmap().save(png)
print("H1" in text, pdf.read_bytes()[:4] == b"%PDF")
print(png.stat().st_size > 0)`,
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
          code: `informe = {
    "resumen": [
        "En muestra web sintética, Lima tiene ticket mediano 28 PEN (n=40).",
    ],
    "metodo": {
        "fuente": "dataset sintético S18",
        "filtros": ["monto>0", "canal=web"],
    },
    "hallazgos": [
        {"id": "H1", "claim": "Lima > Cusco en mediana", "evidencia": "Tabla2", "decision": None},
    ],
}
print(informe["resumen"][0])
print(informe["hallazgos"][0]["id"], informe["hallazgos"][0]["evidencia"])
print("decision_none", informe["hallazgos"][0]["decision"] is None)`,
          output: `En muestra web sintética, Lima tiene ticket mediano 28 PEN (n=40).
H1 Tabla2
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
          code: `dash = {"median_Lima": 28.0}
xlsx = {"median_Lima": 28.0}
doc = {"median_Lima": 28.0}
limits = ["cobertura web", "n Cusco bajo"]
parity = dash == xlsx == doc
bundle = {"parity": parity, "limits": limits, "fuente": "sintetico"}
print(bundle)`,
          output: `{'parity': True, 'limits': ['cobertura web', 'n Cusco bajo'], 'fuente': 'sintetico'}`,
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
          code: `def fmt_pen(x):
    return f"{round(float(x), 1)} PEN"

checks = {
    "decimals": [fmt_pen(28.04), fmt_pen(28.0)],
    "has_h1": True,
    "alts": ["Barras mediana por región, n por barra en tooltip"],
}
print(checks["decimals"])
print("decimal_ok", len(set(checks["decimals"])) == 1)
print("a11y_min", checks["has_h1"] and all(len(a) > 10 for a in checks["alts"]))`,
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
          code: `import hashlib, json

prov = {
    "run_id": "cpn2b-close-01",
    "data_sha1_8": hashlib.sha1(b"rows-synthetic").hexdigest()[:8],
    "artifacts": ["dashboard.html", "results.xlsx", "informe.md"],
    "visual_checklist": {"dashboard": True, "xlsx": True, "doc": True},
    "approval": {"status": "pending_review"},
}
print(json.dumps(prov, ensure_ascii=False))
print("ready_for_review", all(prov["visual_checklist"].values()))`,
          output: `{"run_id": "cpn2b-close-01", "data_sha1_8": "f2b0d009", "artifacts": ["dashboard.html", "results.xlsx", "informe.md"], "visual_checklist": {"dashboard": true, "xlsx": true, "doc": true}, "approval": {"status": "pending_review"}}
ready_for_review True`,
        },
        why: "Provenance + checklist visual cierran el Reporting Factory CP-N2-B.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios de plantillas, clasificación PDF, estructura ejecutiva y gobernanza de aprobación.",
    steps: [
      {
        id: "S21-T1-A-E1",
        subtopicId: "S21-T1-A",
        kind: "guided",
        instruction:
          "Renderiza Template('Hola {{ nombre }}') con nombre='Ana' e imprime.",
        hint: "jinja2.Template.render.",
        hints: [
          "jinja2.Template.render.",
          "print.",
        ],
        edgeCases: ["nombre missing → vacío"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `from jinja2 import Template
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `from jinja2 import Template
print(Template("Hola {{ nombre }}").render(nombre="Ana"))`,
          output: `Hola Ana`,
        },
      },
      {
        id: "S21-T1-A-E2",
        subtopicId: "S21-T1-A",
        kind: "independent",
        instruction:
          "Template con median y n; render Lima-like 28 y 40.",
        hint: "Dos variables.",
        hints: [
          "Dos variables.",
          "Incluye PEN.",
        ],
        edgeCases: ["tipos str vs int"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `from jinja2 import Template
# TODO
`,
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
          "Función render_kpi(ctx) usa template fijo region/median/n; prueba con dict.",
        hint: "Template dentro o global.",
        hints: [
          "Template dentro o global.",
          "print resultado.",
        ],
        edgeCases: ["key error"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `from jinja2 import Template
# TODO
`,
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
          "Si median is None imprime '—'; else el número. Prueba None.",
        hint: "condicional python o jinja.",
        hints: [
          "condicional python o jinja.",
          "print.",
        ],
        edgeCases: ["NaN float"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `median = None
# TODO
`,
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
          "Formatea 28.456 a 2 decimales con format en jinja o python; print.",
        hint: "'%.2f' % x o f-string.",
        hints: [
          "'%.2f' % x o f-string.",
          "print 28.46.",
        ],
        edgeCases: ["locale comma"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `x = 28.456
# TODO
`,
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
          "Render lista de rows en líneas 'region:value' con jinja for.",
        hint: "Template for.",
        hints: [
          "Template for.",
          "Dos regiones.",
        ],
        edgeCases: ["rows vacías"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `from jinja2 import Template
# TODO
`,
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
          "Crea `informe.docx` con título, heading Resumen y un párrafo `n=40`; guárdalo, reábrelo y demuestra que es OOXML y conserva ambos textos.",
        hint: "Usa Document(), add_heading(), add_paragraph(), save() y vuelve a abrir la ruta.",
        hints: [
          "La firma de un DOCX comienza con bytes PK porque es un paquete ZIP.",
          "Extrae `p.text` de los párrafos no vacíos del documento reabierto.",
        ],
        edgeCases: ["ruta no escribible", "documento sin párrafos"],
        tests: "el archivo existe, firma PK y texto reabierto contiene Resumen y n=40",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `from pathlib import Path
from docx import Document

path = Path("informe.docx")
# Completa la creación, guardado y reapertura del documento.
`,
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
          "Genera un DOCX con dos Heading 1 y un Heading 2; reábrelo y cuenta los estilos reales sin confiar en una lista auxiliar.",
        hint: "Cada párrafo reabierto expone `style.name`.",
        hints: [
          "Filtra exactamente `Heading 1` y conserva también la jerarquía completa.",
          "La evidencia debe provenir del archivo guardado, no del input original.",
        ],
        edgeCases: ["heading sin texto", "estilo Normal"],
        tests: "el documento reabierto contiene dos Heading 1 y la secuencia 1,2,1",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `from docx import Document

levels = [("Resumen", 1), ("Método", 2), ("Anexos", 1)]
# Completa: guarda estructura.docx, reabre y calcula los estilos.
`,
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
          "Transfiere el patrón: crea `auditoria.docx` con una tabla de dos métricas, reábrela y verifica encabezados, valor `28.0` y que no se convirtió missing en cero.",
        hint: "Usa add_table(rows=1, cols=2), agrega filas y lee `cell.text` del documento reabierto.",
        hints: [
          "La tabla debe contener columnas métrica y valor.",
          "Representa el dato faltante como em dash, no como 0.",
        ],
        edgeCases: ["missing", "tabla vacía"],
        tests: "tabla reabierta preserva Ticket mediano=28.0 y Reclamos=—",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `from docx import Document

metrics = [("Ticket mediano", "28.0"), ("Reclamos", "—")]
# Completa el artefacto y valida sus celdas después de reabrirlo.
`,
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
          "Genera un PDF digital local con `n=40`, extráelo con pypdf y demuestra firma PDF y capa de texto.",
        hint: "Canvas.drawString()+save(); luego PdfReader(path).pages[0].extract_text().",
        hints: [
          "Comprueba primero los bytes `%PDF`.",
          "No declares digital sin extraer texto del archivo.",
        ],
        edgeCases: ["PDF corrupto", "capa de texto vacía"],
        tests: "firma válida y extracción contiene n=40",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `from pathlib import Path
from pypdf import PdfReader
from reportlab.pdfgen import canvas

path = Path("digital.pdf")
# Completa generación y extracción.
`,
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
          "Renderiza la primera página del PDF digital a PNG con PyMuPDF y verifica que ambos artefactos existen y tienen contenido.",
        hint: "Abre con fitz.open(path), usa get_pixmap() y save().",
        hints: [
          "Cierra o conserva el documento mientras accedes a la página.",
          "Verifica tamaño positivo, no solo el nombre del archivo.",
        ],
        edgeCases: ["PDF sin páginas", "ruta PNG no escribible"],
        tests: "PDF y PNG tienen tamaño positivo",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `from pathlib import Path
import fitz
from reportlab.pdfgen import canvas

pdf, png = Path("render.pdf"), Path("render-p1.png")
# Completa generación y render.
`,
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
          "Crea un PDF imagen-only con texto dibujado dentro de un PNG sintético; prueba que pypdf no recupera `n=17` y clasifícalo como `needs_ocr`.",
        hint: "Pillow dibuja el PNG; reportlab.drawImage lo inserta como imagen; la extracción vacía activa abstención.",
        hints: [
          "No agregues texto con drawString al PDF: eso crearía capa digital.",
          "Normaliza `extract_text() or ''` antes de strip().",
        ],
        edgeCases: ["OCR no instalado", "extracción devuelve None"],
        tests: "PDF válido, extracción no contiene n=17 y needs_ocr=True",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `from pathlib import Path
from PIL import Image, ImageDraw
from pypdf import PdfReader
from reportlab.pdfgen import canvas

# Completa la creación del PNG y del PDF imagen-only.
`,
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
          "Crea hallazgo id H1 con evidencia Tabla1 e imprime id.",
        hint: "dict.",
        hints: [
          "dict.",
          "print.",
        ],
        edgeCases: ["id duplicado"],
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
          code: `h = {"id": "H1", "evidencia": "Tabla1"}
print(h["id"])`,
          output: `H1`,
        },
      },
      {
        id: "S21-T3-A-E2",
        subtopicId: "S21-T3-A",
        kind: "independent",
        instruction:
          "Resumen debe incluir 'n='; valida e imprime True/False para un string dado.",
        hint: "in.",
        hints: [
          "in.",
          "caso con n=40.",
        ],
        edgeCases: ["N mayúscula"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `s = 'mediana 28 PEN n=40'
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `s = "mediana 28 PEN n=40"
print("n=" in s)`,
          output: `True`,
        },
      },
      {
        id: "S21-T3-A-E3",
        subtopicId: "S21-T3-A",
        kind: "transfer",
        instruction:
          "pack_report(resumen, metodo, hallazgos) devuelve dict con 3 claves; print keys sorted.",
        hint: "dict function.",
        hints: [
          "dict function.",
          "print.",
        ],
        edgeCases: ["tipos"],
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
          "parity entre dash y doc dicts median_Lima 28; print True.",
        hint: "comparar.",
        hints: [
          "comparar.",
          "print.",
        ],
        edgeCases: ["float vs int"],
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
          code: `dash = {"median_Lima": 28.0}
doc = {"median_Lima": 28.0}
print(dash == doc)`,
          output: `True`,
        },
      },
      {
        id: "S21-T3-B-E2",
        subtopicId: "S21-T3-B",
        kind: "independent",
        instruction:
          "Caption debe contener 'Fuente'; valida.",
        hint: "in.",
        hints: [
          "in.",
          "print bool.",
        ],
        edgeCases: ["fuente minúscula"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `cap = 'Fig1 | Fuente: sintetico | n=10'
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `cap = "Fig1 | Fuente: sintetico | n=10"
print("Fuente" in cap)`,
          output: `True`,
        },
      },
      {
        id: "S21-T3-B-E3",
        subtopicId: "S21-T3-B",
        kind: "transfer",
        instruction:
          "check_parity(a,b,c) True si los tres iguales; prueba fallo y éxito.",
        hint: "a==b==c.",
        hints: [
          "a==b==c.",
          "Dos prints.",
        ],
        edgeCases: ["keys extra"],
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
          "Normaliza [28.04, 28.0] a 1 decimal; print lista.",
        hint: "round.",
        hints: [
          "round.",
          "print.",
        ],
        edgeCases: ["banker's rounding"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `vals=[28.04,28.0]
# TODO
`,
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
          "fmt_pen(28.04) -> '28.0 PEN'; implementa e imprime.",
        hint: "f-string round 1.",
        hints: [
          "f-string round 1.",
          "print.",
        ],
        edgeCases: ["None"],
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
          "a11y_min(has_h1, alts) True si has_h1 y todo alt len>10; prueba.",
        hint: "all().",
        hints: [
          "all().",
          "print.",
        ],
        edgeCases: ["alts vacía"],
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
          "Imprime approval status 'pending_review'.",
        hint: "dict.",
        hints: [
          "dict.",
          "print value.",
        ],
        edgeCases: ["typo status"],
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
          code: `approval = {"status": "pending_review"}
print(approval["status"])`,
          output: `pending_review`,
        },
      },
      {
        id: "S21-T4-B-E2",
        subtopicId: "S21-T4-B",
        kind: "independent",
        instruction:
          "data_sha1_8 de b'synthetic' primeros 8 hex; print.",
        hint: "hashlib.sha1.",
        hints: [
          "hashlib.sha1.",
          "print slice.",
        ],
        edgeCases: ["encoding"],
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
print(hashlib.sha1(b"synthetic").hexdigest()[:8])`,
          output: `385fcd67`,
        },
      },
      {
        id: "S21-T4-B-E3",
        subtopicId: "S21-T4-B",
        kind: "transfer",
        instruction:
          "ready(checklist) True si todos los valores True; prueba dashboard/xlsx/doc.",
        hint: "all(dict.values()).",
        hints: [
          "all(dict.values()).",
          "print.",
        ],
        edgeCases: ["keys faltantes"],
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
          code: `def ready(checklist):
    return all(checklist.values())
print(ready({"dashboard": True, "xlsx": True, "doc": True}))
print(ready({"dashboard": True, "xlsx": False, "doc": True}))`,
          output: `True
False`,
        },
      },
    ],
  },
  youDo: {
    title: "Reporting Factory — cierre CP-N2-B",
    context:
      "Integra EDA (S18), dashboard (S19) y Excel (S20) en un **Accessible Insights Dashboard & Reporting Factory**: una corrida genera documentos/plantillas con números reconciliados, alt text, provenance y cola de aprobación. Cierre de **CP-N2-B**.",
    objectives: [
      "Plantillas Jinja con context único",
      "DOCX y PDF reales, reabiertos y renderizados",
      "Paridad de métricas entre artefactos",
      "A11y y formato consistente",
      "Provenance + pending_review",
    ],
    requirements: [
      "Sin PII real ni secretos",
      "Hallazgos con id y evidencia",
      "Missing ≠ 0",
      "Checksum/paridad documentada para DOCX, PDF, PNG y texto extraído",
      "es-PE en narrativa",
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
}
# Implementa build_docx(), build_pdf(), extract_and_render() y manifest().
# El gate reabre ambos documentos y compara n_Lima/median_Lima con context.
`,
    portfolioNote:
      "Paquete final CP-N2-B: dashboard + xlsx + informe con provenance; listo para revisión de gate (otra lane marca passed).",
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
        question: "¿Por qué separar datos y plantilla Jinja?",
        options: ["Para reutilizar presentación y auditar métricas en Python", "Para mezclar SQL en el HTML", "Para evitar control de versiones", "Para ocultar n"],
        correctIndex: 0,
        explanation:
          "La lógica y métricas viven en Python; la plantilla presenta.",
      },
      {
        question: "Un PDF con casi sin caracteres en capa de texto suele requerir:",
        options: ["Ignorar el archivo", "Solo openpyxl", "OCR / tratamiento de imagen", "Borrar limitaciones"],
        correctIndex: 2,
        explanation:
          "Baja densidad de texto sugiere escaneo/imagen.",
      },
      {
        question: "Paridad en el Reporting Factory significa:",
        options: ["Mismos colores", "Mismo número de páginas", "Mismo reviewer", "Mismas métricas clave en dashboard, Excel y documento"],
        correctIndex: 3,
        explanation:
          "Números reconciliados entre artefactos.",
      },
      {
        question: "El cierre de contenido de CP-N2-B incluye:",
        options: ["Solo un print", "Provenance, checklist visual y hallazgos trazables", "Subir secretos al repo", "Marcar section_passed desde esta lane"],
        correctIndex: 1,
        explanation:
          "Esta lane no marca passed en ledger; sí entrega artefactos con provenance.",
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
        label: "WCAG brief",
        url: "https://www.w3.org/WAI/standards-guidelines/wcag/",
        note: "Accesibilidad de contenidos",
      },
    ],
    books: [
      {
        label: "Docs for Developers",
        note: "Estructura y claridad de documentos técnicos",
      },
      {
        label: "The Data Warehouse Toolkit (kimball) — select chapters",
        note: "Narrativa de métricas y linaje (conceptual)",
      },
    ],
    courses: [
      {
        label: "Jinja primer",
        url: "https://jinja.palletsprojects.com/en/stable/templates/",
        note: "Sintaxis de plantillas",
      },
    ],
  },
}
