import type { CourseSection } from '../../types'

export const section21: CourseSection = {
  id: "fastapi",
  index: 21,
  title: "Documentos, plantillas y reportes trazables",
  shortTitle: "Reportes trazables",
  tagline: "Accessible Insights Dashboard & Reporting Factory genera dashboard, DOCX/PDF y workbook desde una corrida, con números reconciliados y revisión visual",
  estimatedHours: 14,
  level: "Competente",
  phase: 1,
  icon: "Server",
  accentColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
  jobRelevance:
    "Cerrar **CP-N2-B** exige un **Reporting Factory** que una dashboard, Excel y documentos con números reconciliados y provenance. Esta sección (id `fastapi` conservado) retematiza a V3 **Documentos, plantillas y reportes trazables** con Jinja, estructura ejecutiva y cola de aprobación.",
  learningOutcomes: [
    { text: "Separar datos y presentación con Jinja" },
    { text: "Renderizar condiciones/tablas con formato seguro" },
    { text: "Generar estructuras tipo DOCX/PDF con secciones" },
    { text: "Distinguir PDF digital de imagen/OCR" },
    { text: "Estructurar informe ejecutivo con método y hallazgos" },
    { text: "Embeber gráficos/tablas con fuentes y limitaciones" },
    { text: "Revisar redacción, a11y y consistencia numérica" },
    { text: "Documentar provenance y flujo de aprobación" },
  ],
  theory: [
    {
      heading: "De “FastAPI backend” a Reporting Factory (mapa y cierre CP-N2-B)",
      paragraphs: [
        "En V3, **S21 no es el path principal de FastAPI/OpenAPI**. Aquí **cierras CP-N2-B**: plantillas Jinja, reportes con secciones, consistencia numérica con dashboard/Excel y **provenance + aprobación**.",
        "Una sola corrida produce artefactos alineados (mismos n y métricas que S18–S20).",
        "Orden: **T1 Plantillas** → **T2 Documentos** → **T3 Narrativa** → **T4 Calidad y gobernanza**.",
      ],
      callout: {
        type: "info",
        title: "Contenido reubicado conceptualmente",
        content:
          "Material legado de FastAPI de este archivo **no es el camino V3 en S21**. Target: reportes trazables y cierre CP-N2-B.",
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
      heading: "estilos y secciones (DOCX/PDF conceptual)",
      subtopicId: "S21-T2-A",
      paragraphs: [
        "Un informe trazable tiene secciones fijas: portada, resumen, método, hallazgos, anexos. Los estilos (Heading 1/2) habilitan TOC y a11y.",
        "En este curso modelamos el documento como estructura de bloques renderizada a texto/Markdown/HTML; la migración a python-docx es directa.",
        "Misma jerarquía en PDF digital facilita extracción posterior.",
      ],
      code: {
        language: 'python',
        title: "sections.py",
        code: `doc = {
    "title": "Informe de insights sintético",
    "sections": [
        {"h": 1, "name": "Resumen ejecutivo"},
        {"h": 2, "name": "Método"},
        {"h": 2, "name": "Hallazgos"},
        {"h": 1, "name": "Anexos"},
    ],
}
print([ (s["h"], s["name"]) for s in doc["sections"] ])
print("h1_count", sum(1 for s in doc["sections"] if s["h"] == 1))`,
        output: `[(1, 'Resumen ejecutivo'), (2, 'Método'), (2, 'Hallazgos'), (1, 'Anexos')]
h1_count 2`,
      },
      callout: {
        type: "tip",
        title: "Outline primero",
        content:
          "Congela el outline antes de redactar párrafos largos.",
      },
    },
    {
      heading: "PDF digital vs imagen/OCR",
      subtopicId: "S21-T2-B",
      paragraphs: [
        "Un **PDF digital** contiene texto seleccionable; un **PDF escaneado** es imagen y requiere OCR con errores típicos.",
        "Clasifica antes de extraer: si no hay texto o el ratio de caracteres es bajo, marca `needs_ocr`.",
        "En el factory, prefiere generar PDF digital desde HTML/LaTeX/reportlab en lugar de escanear.",
      ],
      code: {
        language: 'python',
        title: "pdf_class.py",
        code: `def classify_pdf(text_layer_chars: int, pages: int) -> str:
    density = text_layer_chars / max(pages, 1)
    if density < 20:
        return "image_or_scan_needs_ocr"
    return "digital_text"
print(classify_pdf(5000, 3))
print(classify_pdf(10, 3))`,
        output: `digital_text
image_or_scan_needs_ocr`,
      },
      callout: {
        type: "info",
        title: "OCR no es verdad absoluta",
        content:
          "Todo número OCR-eado debe reconciliarse con la fuente tabular cuando exista.",
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
        description: "Generar outline de secciones estilo DOCX/PDF",
        code: {
          language: 'python',
          title: "demo_sections.py",
          code: `def render_outline(sections):
    lines = []
    for s in sections:
        pad = "  " * (s["h"] - 1)
        lines.append(f"{pad}H{s['h']} {s['name']}")
    return "\\n".join(lines)

sections = [
    {"h": 1, "name": "Resumen ejecutivo"},
    {"h": 1, "name": "Método"},
    {"h": 2, "name": "Datos y filtros"},
    {"h": 1, "name": "Hallazgos"},
]
print(render_outline(sections))
print("sections", len(sections))`,
          output: `H1 Resumen ejecutivo
H1 Método
  H2 Datos y filtros
H1 Hallazgos
sections 4`,
        },
        why: "El outline fija la estructura del paquete documental.",
      },
      {
        demoId: "S21-T2-B-DEMO",
        subtopicId: "S21-T2-B",
        environment: "local-python",
        description: "Clasificar PDF digital vs posible escaneo por densidad de texto",
        code: {
          language: 'python',
          title: "demo_pdf_class.py",
          code: `def classify(chars, pages):
    dens = chars / max(pages, 1)
    return ("digital", dens) if dens >= 20 else ("needs_ocr", dens)

print(classify(9000, 4))
print(classify(15, 4))`,
          output: `('digital', 2250.0)
('needs_ocr', 3.75)`,
        },
        why: "Clasificar antes de extraer evita basar KPIs en OCR ruidoso.",
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
          "Define sections con Resumen h1 y Método h1; imprime nombres.",
        hint: "lista de dicts.",
        hints: [
          "lista de dicts.",
          "print list comprehension.",
        ],
        edgeCases: ["h inválido"],
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
          code: `sections = [{"h": 1, "name": "Resumen"}, {"h": 1, "name": "Método"}]
print([s["name"] for s in sections])`,
          output: `['Resumen', 'Método']`,
        },
      },
      {
        id: "S21-T2-A-E2",
        subtopicId: "S21-T2-A",
        kind: "independent",
        instruction:
          "Cuenta cuántos H1 hay en sections con h 1 y 2 mixtos.",
        hint: "sum.",
        hints: [
          "sum.",
          "print int.",
        ],
        edgeCases: ["h string"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `sections=[{'h':1},{'h':2},{'h':1}]
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `sections = [{"h": 1}, {"h": 2}, {"h": 1}]
print(sum(1 for s in sections if s["h"] == 1))`,
          output: `2`,
        },
      },
      {
        id: "S21-T2-A-E3",
        subtopicId: "S21-T2-A",
        kind: "transfer",
        instruction:
          "render_outline devuelve líneas indentadas; prueba un H1 y un H2.",
        hint: "pad por h-1.",
        hints: [
          "pad por h-1.",
          "print.",
        ],
        edgeCases: ["h=0"],
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
          code: `def render_outline(sections):
    return "\\n".join("  " * (s["h"] - 1) + s["name"] for s in sections)
print(render_outline([{"h": 1, "name": "A"}, {"h": 2, "name": "B"}]))`,
          output: `A
  B`,
        },
      },
      {
        id: "S21-T2-B-E1",
        subtopicId: "S21-T2-B",
        kind: "guided",
        instruction:
          "Si chars/pages < 20 print needs_ocr else digital; caso 10 chars 2 pages.",
        hint: "densidad.",
        hints: [
          "densidad.",
          "print.",
        ],
        edgeCases: ["pages 0"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `chars, pages = 10, 2
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `chars, pages = 10, 2
dens = chars / pages
print("needs_ocr" if dens < 20 else "digital")`,
          output: `needs_ocr`,
        },
      },
      {
        id: "S21-T2-B-E2",
        subtopicId: "S21-T2-B",
        kind: "independent",
        instruction:
          "classify(chars,pages) retorna digital o needs_ocr; prueba (100,1).",
        hint: "Función.",
        hints: [
          "Función.",
          "print.",
        ],
        edgeCases: ["umbral distinto"],
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
          code: `def classify(chars, pages):
    return "digital" if chars / max(pages, 1) >= 20 else "needs_ocr"
print(classify(100, 1))`,
          output: `digital`,
        },
      },
      {
        id: "S21-T2-B-E3",
        subtopicId: "S21-T2-B",
        kind: "transfer",
        instruction:
          "Dado texto extraído '', marca needs_ocr True; imprime dict flags.",
        hint: "bool(text).",
        hints: [
          "bool(text).",
          "print.",
        ],
        edgeCases: ["solo espacios"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `text = ''
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `text = ""
print({"needs_ocr": not bool(text.strip()), "n_chars": len(text)})`,
          output: `{'needs_ocr': True, 'n_chars': 0}`,
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
      "Outline de informe ejecutivo",
      "Paridad de métricas entre artefactos",
      "A11y y formato consistente",
      "Provenance + pending_review",
    ],
    requirements: [
      "Sin PII real ni secretos",
      "Hallazgos con id y evidencia",
      "Missing ≠ 0",
      "Checksum/paridad documentada",
      "es-PE en narrativa",
    ],
    starterCode: `from jinja2 import Template
import json, hashlib

context = {
    "run_id": "cpn2b-01",
    "median_Lima": 28.0,
    "n_Lima": 40,
    "limits": ["solo web"],
}
# TODO: render informe + provenance
print(Template("Run {{ run_id }} Lima={{ median_Lima }}").render(**context))
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
        options: [
          "Para mezclar SQL en el HTML",
          "Para reutilizar presentación y auditar métricas en Python",
          "Para evitar control de versiones",
          "Para ocultar n",
        ],
        correctIndex: 1,
        explanation:
          "La lógica y métricas viven en Python; la plantilla presenta.",
      },
      {
        question: "Un PDF con casi sin caracteres en capa de texto suele requerir:",
        options: [
          "Ignorar el archivo",
          "OCR / tratamiento de imagen",
          "Solo openpyxl",
          "Borrar limitaciones",
        ],
        correctIndex: 1,
        explanation:
          "Baja densidad de texto sugiere escaneo/imagen.",
      },
      {
        question: "Paridad en el Reporting Factory significa:",
        options: [
          "Mismos colores",
          "Mismas métricas clave en dashboard, Excel y documento",
          "Mismo número de páginas",
          "Mismo reviewer",
        ],
        correctIndex: 1,
        explanation:
          "Números reconciliados entre artefactos.",
      },
      {
        question: "El cierre de contenido de CP-N2-B incluye:",
        options: [
          "Solo un print",
          "Provenance, checklist visual y hallazgos trazables",
          "Subir secretos al repo",
          "Marcar section_passed desde esta lane",
        ],
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
