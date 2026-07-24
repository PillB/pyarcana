# S24 Paragraph-by-Paragraph Analysis with Sources

Generated: 2026-07-24T04:23:51.696+00:00
Section: OCR y Document AI
File: `s24-rpa-advanced.ts`
STORM cycles: **24**
Expert rank: **9.55**

## Competitive sources (domain-honest HTTP ≥5)

- Tesseract: [OCR docs](https://tesseract-ocr.github.io/) — OCR engine
- Pillow: [Handbook](https://pillow.readthedocs.io/) — preprocess
- PyPI: [pytesseract](https://pypi.org/project/pytesseract/) — python bridge
- OpenCV: [Imgproc tutorials](https://docs.opencv.org/4.x/d2/d96/tutorial_py_table_of_contents_imgproc.html) — deskew
- Microsoft: [Document Intelligence](https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/) — Document AI
- Google: [Document AI](https://cloud.google.com/document-ai/docs) — processors
- Coursera: [OCR document](https://www.coursera.org/courses?query=ocr%20document) — MOOC
- MIT: [6.100L](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/) — foundations
- Harvard: [CS50P](https://cs50.harvard.edu/python/) — tests
- deeplearning.ai: [Courses](https://www.deeplearning.ai/) — CV applied
- Py4E: [Python for Everybody](https://www.py4e.com) — progressive
- Live: [PyArcana](https://pillb.github.io/pyarcana/) — course
- NIST: [AI RMF](https://www.nist.gov/itl/ai-risk-management-framework) — risk ethics

## Gold pass
| Area | Decision |
|------|----------|
| theory/iDo | domain contracts + demos |
| weDo | CASO DEFECT |
| git | NO restore (HEAD had TODO, no DEFECT) |
| STORM | hand_STORM_domain_sources |
| expert pass | deepen P1s + expand resources + tsc hole fix |

## Theory (paragraph-level)

### OCR Document AI para intake CP-N2-C
**P1** (rank 9.55/10)
> Aquí construyes el **document intake** de CP-N2-C: imagen sintética → preproceso → adapter OCR (confidence + bbox) → normalización a schema → validación cross-field → golden set…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Tesseract: https://tesseract-ocr.github.io/; Pillow: https://pillow.readthedocs.io/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «OCR Document AI para intake CP-N2-C» in S24_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Todo documento es **sintético** (facturas demo, IDs fake). Conservas **bounding boxes** como evidencia y te **abstienes** si confidence < umbral de campo crítico (p. ej. RUC). C…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Pillow: https://pillow.readthedocs.io/; PyPI: https://pypi.org/project/pytesseract/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «OCR Document AI para intake CP-N2-C» in S24_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Orden: **T1 Imagen** (DPI, deskew, ruido, orientación) → **T2 OCR** (idiomas, layout, KV/tablas) → **T3 Extracción** (schema, validación, cola) → **T4 Evaluación** (golden, priv…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** PyPI: https://pypi.org/project/pytesseract/; OpenCV: https://docs.opencv.org/4.x/d2/d96/tutorial_py_table_of_contents_imgproc.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «OCR Document AI para intake CP-N2-C» in S24_STORM.json; edge `research_supports_paragraph`.

### DPI, deskew, crop y contraste
**P1** (rank 9.55/10)
> **DPI** bajo degrada OCR de tipografía pequeña en facturas sintéticas; el lab eleva a **≥200** (ideal **300** efectivos) antes del motor. **Deskew** corrige inclinación de escan…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** OpenCV: https://docs.opencv.org/4.x/d2/d96/tutorial_py_table_of_contents_imgproc.html; Microsoft: https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «DPI, deskew, crop y contraste» in S24_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Modelamos ops como transformaciones sobre **metadatos** de imagen sintética (`w, h, dpi, skew_deg, contrast`): no necesitas OpenCV instalado para aprender el **contrato** del pi…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Microsoft: https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/; Google: https://cloud.google.com/document-ai/docs
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «DPI, deskew, crop y contraste» in S24_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Pipeline canónico: `load → dpi_check → deskew → crop → contrast → OCR`. Caso PE sintético: foto de boleta a 96 DPI y 1.8° de sesgo; tras preproceso `dpi=200`, `deskew_applied=Tr…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Google: https://cloud.google.com/document-ai/docs; Coursera: https://www.coursera.org/courses?query=ocr%20document
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «DPI, deskew, crop y contraste» in S24_STORM.json; edge `research_supports_paragraph`.

### ruido y orientación
**P1** (rank 9.55/10)
> Ruido (sal/pimienta, compresión JPEG) y **orientación** (0/90/180/270) rompen el layout y pueden dar confidence alta en basura si OCR corre al revés. Detecta orientación por sco…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Coursera: https://www.coursera.org/courses?query=ocr%20document; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «ruido y orientación» in S24_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Simulamos score por rotación y un denoise binario sobre flags 0/1. Si score_orient < 0.5, el intake prefiere manual_orient (humano gira la página) antes de forzar auto con baja …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «ruido y orientación» in S24_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Caso sintético: página con scores {0:0.1, 90:0.05, 180:0.7, 270:0.15} → 180°. Un OCR previo a orientar produce campos RUC permutados; el runbook exige fix_orientation en el pref…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; deeplearning.ai: https://www.deeplearning.ai/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «ruido y orientación» in S24_STORM.json; edge `research_supports_paragraph`.

### idiomas, layout y confidence
**P1** (rank 9.55/10)
> Configura **idiomas** (spa+eng) según el corpus: facturas PE en español con tokens EN de software. El **layout** (bloques, columnas) guía el orden de lectura; no concatenes colu…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** deeplearning.ai: https://www.deeplearning.ai/; Py4E: https://www.py4e.com
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «idiomas, layout y confidence» in S24_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Cada token/campo trae **confidence** 0–1. Umbral de **abstención por campo crítico** (RUC, total): un promedio global esconde el dígito débil. Si RUC conf < 0.85 → review_queue,…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Py4E: https://www.py4e.com; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «idiomas, layout y confidence» in S24_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Contrato del adapter: ocr_page(tokens, lang) → lista {text, conf, bbox, lang}. Low-conf se lista para HITL. FakeOcrAdapter devuelve observaciones fijadas para tests de parsing; …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Live: https://pillb.github.io/pyarcana/; NIST: https://www.nist.gov/itl/ai-risk-management-framework
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «idiomas, layout y confidence» in S24_STORM.json; edge `research_supports_paragraph`.

### texto, tablas y pares clave–valor
**P1** (rank 9.55/10)
> Extrae **texto corrido**, **tablas** (filas/cols) y **KV** (RUC→valor, Total→monto) con bbox de evidencia del **valor**, no solo del label. Heurística KV didáctica: “Clave: valo…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** NIST: https://www.nist.gov/itl/ai-risk-management-framework; Tesseract: https://tesseract-ocr.github.io/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «texto, tablas y pares clave–valor» in S24_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Tablas sintéticas como listas de listas con header en fila 0; n_data_rows = len(table)-1. Ítems de factura demo alimentan validación de suma vs total, siempre con tolerancia mon…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Tesseract: https://tesseract-ocr.github.io/; Pillow: https://pillow.readthedocs.io/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «texto, tablas y pares clave–valor» in S24_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Caso PE: líneas “RUC: 20123456789” y “Total: 150.00” → dict KV; tabla 2 ítems. Evidencia: adjunta bbox del valor RUC al field dict para que el revisor resalte en UI sin re-OCRizar.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Pillow: https://pillow.readthedocs.io/; PyPI: https://pypi.org/project/pytesseract/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «texto, tablas y pares clave–valor» in S24_STORM.json; edge `research_supports_paragraph`.

### schema y normalización
**P1** (rank 9.55/10)
> Un **schema** define campos, tipos y required (ruc str11, total float, fecha date). Normaliza monedas (quita PEN/comas), fechas a ISO y RUC a solo dígitos. Output canónico: {fie…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** PyPI: https://pypi.org/project/pytesseract/; OpenCV: https://docs.opencv.org/4.x/d2/d96/tutorial_py_table_of_contents_imgproc.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «schema y normalización» in S24_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Si tras normalizar RUC no tiene longitud 11, value=None y el validador acumula reason — no rellenes con ceros mágicos. Fechas DD/MM/YYYY de boletas sintéticas pasan a YYYY-MM-DD…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** OpenCV: https://docs.opencv.org/4.x/d2/d96/tutorial_py_table_of_contents_imgproc.html; Microsoft: https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «schema y normalización» in S24_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Versionar schema evita que un deploy cambie el significado de total_incl_igv a mitad de un golden set. Contrato lab: norm_ruc / norm_total / norm_fecha puras, testeables sin I/O…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Microsoft: https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/; Google: https://cloud.google.com/document-ai/docs
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «schema y normalización» in S24_STORM.json; edge `research_supports_paragraph`.

### validación cross-field y cola de revisión
**P1** (rank 9.55/10)
> Cross-field: `abs(sum(líneas) - total) > 0.01` → `needs_review`. RUC None → `reasons.append('ruc_missing')`. Varias reasons se acumulan; el documento no se auto-acepta si la lis…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Google: https://cloud.google.com/document-ai/docs; Coursera: https://www.coursera.org/courses?query=ocr%20document
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «validación cross-field y cola de revisión» in S24_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> La cola de revisión es el **producto**: `status=review`, `reasons[]`, evidencias bbox. **Mismatch ≠ fraude**: imprime política review_not_fraud para entrenar el hábito. Humanos …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Coursera: https://www.coursera.org/courses?query=ocr%20document; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «validación cross-field y cola de revisión» in S24_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Caso sintético: total 10.0 vs líneas 4+5 → needs_review; ruc missing → ['ruc_missing']. El intake batch marca human_queue y sigue con el siguiente doc sin bloquear todo el archivo.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «validación cross-field y cola de revisión» in S24_STORM.json; edge `research_supports_paragraph`.

### golden set sintético, exactitud por campo y cobertura
**P1** (rank 9.55/10)
> Un **golden set** de páginas/campos etiquetados a mano mide exactitud por campo (ruc, total, fecha), no un accuracy global engañoso. Campo crítico tiene SLO propio: caer en RUC …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; deeplearning.ai: https://www.deeplearning.ai/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «golden set sintético, exactitud por campo y cobe» in S24_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Accuracy = correct/n; por campo se compara pred vs true en lista de dicts. coverage_auto = auto/(auto+review) mide cuánto pasa sin HITL — subir cobertura bajando umbral sin medi…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** deeplearning.ai: https://www.deeplearning.ai/; Py4E: https://www.py4e.com
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «golden set sintético, exactitud por campo y cobe» in S24_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Caso PE de lab: 3/4 correctos → 0.75; ruc acc 0.5 en dos filas; auto=7,review=3 → coverage 0.7. Reporta métricas en el paquete de CP-N2-C sin pretender que OCR “valida identidad…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Py4E: https://www.py4e.com; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «golden set sintético, exactitud por campo y cobe» in S24_STORM.json; edge `research_supports_paragraph`.

### privacidad, archivos hostiles y fallback
**P1** (rank 9.55/10)
> Privacidad: solo fixtures sintéticos; no subas PDFs reales de clientes al sandbox. Allowlist mime pdf/png/jpeg; zip u otros → reject. Size cap (p. ej. 5e6 bytes) mitiga zip-bomb…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Live: https://pillb.github.io/pyarcana/; NIST: https://www.nist.gov/itl/ai-risk-management-framework
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «privacidad, archivos hostiles y fallback» in S24_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Archivos hostiles (corrupción, ratio de compresión absurdo) se rechazan o van a cuarentena. Fallback operativo: ocr_fail → human_rescan (re-escaneo o tipeo asistido), no reinten…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** NIST: https://www.nist.gov/itl/ai-risk-management-framework; Tesseract: https://tesseract-ocr.github.io/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «privacidad, archivos hostiles y fallback» in S24_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Contrato de seguridad del intake: fail-closed en mime/size; logs sin PII real; Fake vs Real adapters etiquetados. El revisor ve reasons y bbox, nunca un badge de “fraude detecta…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Tesseract: https://tesseract-ocr.github.io/; Pillow: https://pillow.readthedocs.io/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; iDo/weDo gradual release.
- **STORM link:** «privacidad, archivos hostiles y fallback» in S24_STORM.json; edge `research_supports_paragraph`.

