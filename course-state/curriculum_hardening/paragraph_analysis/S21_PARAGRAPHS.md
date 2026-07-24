# S21 Paragraph-by-Paragraph Analysis with Sources

Generated: 2026-07-24T05:24:31.000+00:00
Section: Documentos, plantillas y reportes trazables
File: `s21-fastapi.ts`
STORM cycles: **21**
Expert rank: **9.55**

## Competitive sources (domain-honest HTTP ≥5)

- Jinja: [docs](https://jinja.palletsprojects.com/) — templates sandbox
- Jinja: [templates](https://jinja.palletsprojects.com/en/stable/templates/) — syntax autoescape
- python-docx: [docs](https://python-docx.readthedocs.io/) — DOCX real
- ReportLab: [userguide](https://www.reportlab.com/docs/reportlab-userguide.pdf) — PDF digital
- pypdf: [docs](https://pypdf.readthedocs.io/) — PDF extract
- W3C: [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/) — a11y
- Python: [hashlib](https://docs.python.org/3/library/hashlib.html) — artifact hashes
- Python: [json](https://docs.python.org/3/library/json.html) — run manifest
- Coursera: [Python for Everybody](https://www.coursera.org/specializations/python) — foundations
- MIT: [6.100L](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/) — structures
- Harvard: [CS50P](https://cs50.harvard.edu/python/) — practice
- Live: [PyArcana](https://pillb.github.io/pyarcana/) — course
- deeplearning.ai: [Data Engineering](https://www.deeplearning.ai/specializations/data-engineering) — delivery pipelines
- GitHub: [Awesome Python Learning](https://github.com/skupriienko/Awesome-Python-Learning) — map
- Real Python: [Jinja primer](https://realpython.com/primer-on-jinja-templating/) — templating
- GitHub: [python-for-everybody-resources](https://github.com/sersavn/python-for-everybody-resources) — exercises
- Python: [pathlib](https://docs.python.org/3/library/pathlib.html) — artifact paths
- W3C: [alt text](https://www.w3.org/WAI/tutorials/images/) — text alternatives
- GitHub: [https-deeplearning-ai](https://github.com/https-deeplearning-ai) — org
- OpenStax: [Technical Writing concepts](https://openstax.org/) — narrative structure
- Python: [tempfile](https://docs.python.org/3/library/tempfile.html) — safe outputs

## Gold pass
| Area | Decision |
|------|----------|
| theory | strip workbench + domain depth |
| weDo | CASO DEFECT |
| git | NO restore |
| STORM | hand_STORM_domain_sources |

## Theory (paragraph-level)

### Reporting Factory y cierre CP-N2-B
**P1** (rank 9.55/10)
> En V3, **S21 no es el path FastAPI de APIs HTTP** (reubicado). El id `fastapi` se conserva; aquí **cierras CP-N2-B**: plantillas Jinja, documentos DOCX/PDF loca…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Jinja: https://jinja.palletsprojects.com/; Jinja: https://jinja.palletsprojects.com/en/stable/templates/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Reporting Factory y cierre CP-N2-B» in S21_STORM.json.

**P2** (rank 9.55/10)
> Una sola corrida produce artefactos alineados: mismos n y métricas clave que el EDA S18 y el factory S20. Datos sintéticos Lima/Cusco; sin PII; sin publicar el …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Jinja: https://jinja.palletsprojects.com/en/stable/templates/; python-docx: https://python-docx.readthedocs.io/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Reporting Factory y cierre CP-N2-B» in S21_STORM.json.

**P3** (rank 9.55/10)
> Orden: **T1 Plantillas** (Jinja, separación datos/presentación, tablas seguras) → **T2 Documentos** (DOCX real, PDF digital vs imagen/OCR) → **T3 Narrativa** (r…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** python-docx: https://python-docx.readthedocs.io/; ReportLab: https://www.reportlab.com/docs/reportlab-userguide.pdf
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Reporting Factory y cierre CP-N2-B» in S21_STORM.json.

### Jinja y separación datos/presentación
**P1** (rank 9.55/10)
> Jinja separa **datos** (dict de contexto en Python) de **presentación** (`{{ var }}`, `{% for %}`). Calcula métricas **antes** del render; la plantilla no es el…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** ReportLab: https://www.reportlab.com/docs/reportlab-userguide.pdf; pypdf: https://pypdf.readthedocs.io/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Jinja y separación datos/presentación» in S21_STORM.json.

**P2** (rank 9.55/10)
> Contrato: `Template(...).render(**ctx)`; autoescape en HTML; en texto plano define política de caracteres. Nunca `mark_safe` de input de usuario sin sanitizar. …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** pypdf: https://pypdf.readthedocs.io/; W3C: https://www.w3.org/WAI/standards-guidelines/wcag/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Jinja y separación datos/presentación» in S21_STORM.json.

**P3** (rank 9.55/10)
> Caso: `Hola {{ nombre }}` → `Hola Ana`; KPI `{{ m }} PEN (n={{ n }})` → `28 PEN (n=40)`. Función `render_kpi(ctx)` centraliza el template fijo region/median/n.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** W3C: https://www.w3.org/WAI/standards-guidelines/wcag/; Python: https://docs.python.org/3/library/hashlib.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Jinja y separación datos/presentación» in S21_STORM.json.

### condiciones, tablas y formato seguro
**P1** (rank 9.55/10)
> `{% if %}` / `{% for %}` construyen tablas. Formatea números en Python o con filtros explícitos; celdas vacías muestran “—” y documentan missing — **no inventes…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/hashlib.html; Python: https://docs.python.org/3/library/json.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «condiciones, tablas y formato seguro» in S21_STORM.json.

**P2** (rank 9.55/10)
> Contrato anti-inyección: no marques strings de usuario como safe en HTML. Listas de filas sintéticas se renderizan a líneas `region:value` o filas Markdown/HTML…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/json.html; Coursera: https://www.coursera.org/specializations/python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «condiciones, tablas y formato seguro» in S21_STORM.json.

**P3** (rank 9.55/10)
> Caso: `median is None` → `—`; `28.456` → `28.46` a 2 decimales. La tabla del informe debe reconciliar con el Excel de S20 (mismos region/value).
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Coursera: https://www.coursera.org/specializations/python; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «condiciones, tablas y formato seguro» in S21_STORM.json.

### DOCX real: estilos, guardado y extracción
**P1** (rank 9.55/10)
> Un **DOCX** trazable tiene secciones fijas (portada, resumen, método, hallazgos, anexos) y estilos reales (Heading 1/2), no solo negrita visual. El `.docx` es u…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «DOCX real: estilos, guardado y extracción» in S21_STORM.json.

**P2** (rank 9.55/10)
> Contrato: crear `informe.docx` con título, heading Resumen, párrafo `n=40`; guardar, reabrir, demostrar extracción de texto/estilos. No confíes en “se veía bien…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «DOCX real: estilos, guardado y extracción» in S21_STORM.json.

**P3** (rank 9.55/10)
> Caso sintético: dos H1 y un H2 contados al reabrir. El mismo `n=40` debe aparecer en resumen y en el data note — paridad con S18/S20.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Live: https://pillb.github.io/pyarcana/; deeplearning.ai: https://www.deeplearning.ai/specializations/data-engineering
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «DOCX real: estilos, guardado y extracción» in S21_STORM.json.

### PDF digital real: generación, extracción y render
**P1** (rank 9.55/10)
> Un **PDF digital** tiene texto seleccionable (pypdf extrae); un **PDF escaneado** es imagen y puede requerir OCR con error rate. Si la extracción queda vacía, e…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** deeplearning.ai: https://www.deeplearning.ai/specializations/data-engineering; GitHub: https://github.com/skupriienko/Awesome-Python-Learning
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «PDF digital real: generación, extracción y rende» in S21_STORM.json.

**P2** (rank 9.55/10)
> Contrato: generar PDF local con `n=40`, extraer texto, firmar PDF; render primera página a PNG (PyMuPDF) y verificar existencia de ambos artefactos. Hash del PD…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** GitHub: https://github.com/skupriienko/Awesome-Python-Learning; Real Python: https://realpython.com/primer-on-jinja-templating/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «PDF digital real: generación, extracción y rende» in S21_STORM.json.

**P3** (rank 9.55/10)
> Caso: PDF imagen-only con texto dibujado en PNG sintético → pypdf no recupera la capa de texto → `needs_ocr`. El paquete documenta el modo, no finge digital nat…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Real Python: https://realpython.com/primer-on-jinja-templating/; GitHub: https://github.com/sersavn/python-for-everybody-resources
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «PDF digital real: generación, extracción y rende» in S21_STORM.json.

### resumen ejecutivo, método y hallazgos
**P1** (rank 9.55/10)
> La narrativa separa **resumen ejecutivo**, **método** y **hallazgos**. Cada hallazgo tiene id (H1…) y mapa a evidencia (Tabla 2, Fig 1). No mezcles método con o…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** GitHub: https://github.com/sersavn/python-for-everybody-resources; Python: https://docs.python.org/3/library/pathlib.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «resumen ejecutivo, método y hallazgos» in S21_STORM.json.

**P2** (rank 9.55/10)
> Contrato: `pack_report(resumen, metodo, hallazgos)` devuelve dict con 3 claves; el resumen debe incluir `n=` o falla validación. H1 referencia `Tabla1` explícit…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/pathlib.html; W3C: https://www.w3.org/WAI/tutorials/images/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «resumen ejecutivo, método y hallazgos» in S21_STORM.json.

**P3** (rank 9.55/10)
> Caso: hallazgo H1 con evidencia Tabla1; `resumen` con `n=40`. El comité puede auditar de la frase al número en el Excel/dashboard.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** W3C: https://www.w3.org/WAI/tutorials/images/; GitHub: https://github.com/https-deeplearning-ai
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «resumen ejecutivo, método y hallazgos» in S21_STORM.json.

### gráficos, tablas, fuentes y limitaciones
**P1** (rank 9.55/10)
> Inserta figuras del dashboard (S19) y tablas del Excel (S20) con **caption idéntico** en fuente/corte/n. Lista limitaciones al final de hallazgos, no escondidas…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** GitHub: https://github.com/https-deeplearning-ai; OpenStax: https://openstax.org/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «gráficos, tablas, fuentes y limitaciones» in S21_STORM.json.

**P2** (rank 9.55/10)
> Contrato: caption dict + pie; si el PNG dice mediana 28 y el DOCX dice 30, el gate de consistencia falla. Unidades PEN alineadas a 1 decimal en todo el paquete.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** OpenStax: https://openstax.org/; Python: https://docs.python.org/3/library/tempfile.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «gráficos, tablas, fuentes y limitaciones» in S21_STORM.json.

**P3** (rank 9.55/10)
> Caso sintético: tres artefactos (png, xlsx, docx) comparten `run_id` y `n=40`. El memo de limitaciones repite cobertura web-only.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/tempfile.html; Jinja: https://jinja.palletsprojects.com/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «gráficos, tablas, fuentes y limitaciones» in S21_STORM.json.

### redacción, accesibilidad y consistencia
**P1** (rank 9.55/10)
> Redacción en español profesional (es-PE): evita anglicismos innecesarios en el cuerpo ejecutivo; deja términos técnicos (KPI, SLA) donde el comité los espera. A…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Jinja: https://jinja.palletsprojects.com/; Jinja: https://jinja.palletsprojects.com/en/stable/templates/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «redacción, accesibilidad y consistencia» in S21_STORM.json.

**P2** (rank 9.55/10)
> Contrato de consistencia: misma precisión decimal (p. ej. 1 decimal PEN) en dashboard, Excel e informe. Glosario breve si introduces siglas nuevas en el paquete…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** Jinja: https://jinja.palletsprojects.com/en/stable/templates/; python-docx: https://python-docx.readthedocs.io/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «redacción, accesibilidad y consistencia» in S21_STORM.json.

**P3** (rank 9.55/10)
> Caso: “mediana de ticket en Lima” no “median ticket Lima region outperform”. Alt de figura menciona n y unidad; headings del DOCX son estilos, no solo tamaño de…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** python-docx: https://python-docx.readthedocs.io/; ReportLab: https://www.reportlab.com/docs/reportlab-userguide.pdf
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «redacción, accesibilidad y consistencia» in S21_STORM.json.

### render visual, provenance y aprobación
**P1** (rank 9.55/10)
> Registra **provenance**: run_id, sha de datos, versiones de script, hashes de artefactos. Cola de aprobación: borrador → revisión visual → aprobado/rechazado co…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** ReportLab: https://www.reportlab.com/docs/reportlab-userguide.pdf; pypdf: https://pypdf.readthedocs.io/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «render visual, provenance y aprobación» in S21_STORM.json.

**P2** (rank 9.55/10)
> Contrato: `ready(checklist)` es True solo si dashboard, xlsx y doc están True. Hash sha1 de payload sintético (8 hex) en el manifiesto. Actor y timestamp en el …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** pypdf: https://pypdf.readthedocs.io/; W3C: https://www.w3.org/WAI/standards-guidelines/wcag/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «render visual, provenance y aprobación» in S21_STORM.json.

**P3** (rank 9.55/10)
> Caso: checklist incompleto → False; completo → True. El paquete aprobado es la entrada limpia al flujo de email/identidad de S22 (inicio CP-N2-C).
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no workbench boilerplate.
- **Sources:** W3C: https://www.w3.org/WAI/standards-guidelines/wcag/; Python: https://docs.python.org/3/library/hashlib.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «render visual, provenance y aprobación» in S21_STORM.json.

