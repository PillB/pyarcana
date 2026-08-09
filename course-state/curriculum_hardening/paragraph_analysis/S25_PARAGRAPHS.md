# S25 Paragraph-by-Paragraph Analysis with Sources

Generated: 2026-07-24T04:27:49.332+00:00
Section: Endpoints de IA, Hugging Face y prompting evaluado
File: `s25-streamlit-dashboards.ts`
STORM cycles: **25**
Expert rank: **9.55**

## Competitive sources (domain-honest HTTP ≥5)

- Hugging Face: [Pipeline tutorial](https://huggingface.co/docs/transformers/pipeline_tutorial) — pipelines
- Hugging Face: [Model cards](https://huggingface.co/docs/hub/model-cards) — cards
- Hugging Face: [Inference Endpoints](https://huggingface.co/docs/inference-endpoints/index) — endpoints
- Hugging Face: [Learn](https://huggingface.co/learn) — course
- OWASP: [LLM Top 10](https://genai.owasp.org/llm-top-10/) — threats
- OWASP: [Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html) — injection
- JSON Schema: [Getting started](https://json-schema.org/learn/getting-started-step-by-step) — schema
- OpenAI: [Structured outputs](https://platform.openai.com/docs/guides/structured-outputs) — structured
- deeplearning.ai: [LLM courses](https://www.deeplearning.ai/) — prompting evals
- MIT: [6.100L](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/) — foundations
- Harvard: [CS50P](https://cs50.harvard.edu/python/) — tests
- NIST: [AI RMF](https://www.nist.gov/itl/ai-risk-management-framework) — risk
- Py4E: [Python for Everybody](https://www.py4e.com) — progressive
- Live: [PyArcana](https://pillb.github.io/pyarcana/) — course

## Gold pass
| Area | Decision |
|------|----------|
| theory/iDo | domain contracts |
| weDo | CASO DEFECT |
| git | NO restore |
| STORM | hand_STORM_domain_sources |
| expert pass | deepen + expand resources |

## Theory (paragraph-level)

### IA asistida evaluada para CP-N2-C
**P1** (rank 9.55/10)
> Aquí construyes **AI assist** evaluado: elegir **regla / modelo especializado / LLM**, operar un adapter **HTTP local** o **Hugging Face** con el **mismo contrato**, exigir **JS…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Hugging Face: https://huggingface.co/docs/transformers/pipeline_tutorial; Hugging Face: https://huggingface.co/docs/hub/model-cards
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «IA asistida evaluada para CP-N2-C» in S25_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Toda salida del generador debe traer **evidencia** (campos fuente, ids) y pasar **schema + golden**. No se acepta narrativa libre sin anclaje. Contrato operativo: entrada texto/…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Hugging Face: https://huggingface.co/docs/hub/model-cards; Hugging Face: https://huggingface.co/docs/inference-endpoints/index
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «IA asistida evaluada para CP-N2-C» in S25_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Orden: **T1 Selección** → **T2 Inferencia** → **T3 Prompting** → **T4 Evals/seguridad**. Caso sintético PE: desk Lima mockea Hugging Face/local endpoint; golden set mide exact m…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Hugging Face: https://huggingface.co/docs/inference-endpoints/index; Hugging Face: https://huggingface.co/learn
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «IA asistida evaluada para CP-N2-C» in S25_STORM.json; edge `research_supports_paragraph`.

### regla vs modelo especializado vs LLM
**P1** (rank 9.55/10)
> **Reglas** (regex, umbrales) son baratas y auditables. **Modelos especializados** (clasificador fine-tuned) para categorías estables. **LLM** para narrativa y extracción flexibl…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Hugging Face: https://huggingface.co/learn; OWASP: https://genai.owasp.org/llm-top-10/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «regla vs modelo especializado vs LLM» in S25_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Árbol de decisión: ¿determinista? → regla; ¿label set fijo y volumen? → especializado; ¿lenguaje abierto con control? → LLM + validación. Contrato operativo: entrada texto/conte…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** OWASP: https://genai.owasp.org/llm-top-10/; OWASP: https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «regla vs modelo especializado vs LLM» in S25_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Clasificar “posible fraude” con LLM autónomo **está prohibido** en este curso: solo señales para humano. Caso sintético PE: desk Lima mockea Hugging Face/local endpoint; golden …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** OWASP: https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html; JSON Schema: https://json-schema.org/learn/getting-started-step-by-step
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «regla vs modelo especializado vs LLM» in S25_STORM.json; edge `research_supports_paragraph`.

### model cards, licencias y local/cloud
**P1** (rank 9.55/10)
> Lee la **model card**: intended use, limitations, bias. Revisa **licencia** (comercial vs research). El AI assist de CP-N2-C solo aporta borradores anclados a evidencia: el huma…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** JSON Schema: https://json-schema.org/learn/getting-started-step-by-step; OpenAI: https://platform.openai.com/docs/guides/structured-outputs
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «model cards, licencias y local/cloud» in S25_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> **Local** si hay PII/sintéticos sensibles, datos de cliente o costo debe ser predecible; **cloud** solo con DPA, minimización y modelo permitido por licencia/intended use. El mi…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** OpenAI: https://platform.openai.com/docs/guides/structured-outputs; deeplearning.ai: https://www.deeplearning.ai/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «model cards, licencias y local/cloud» in S25_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Registra la **decisión local/cloud** en metadata del run (`deploy_choice`, license, model card hash). Caso PE: desk Lima mockea HF/local; golden mide exact match y field F1 **si…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** deeplearning.ai: https://www.deeplearning.ai/; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «model cards, licencias y local/cloud» in S25_STORM.json; edge `research_supports_paragraph`.

### Hugging Face pipelines/endpoints
**P1** (rank 9.55/10)
> `pipeline('text-classification')` o Inference API son el **mismo contrato de salida** en prod. En el curso **mockeamos** el pipeline para ejecutar sin bajar pesos: el mock debe …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Hugging Face pipelines/endpoints» in S25_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato estable: input text → `{label, score}` o JSON schema; **log** `model_id` + versión en cada run. `schema_fail` o injection en el payload → `human_review` (fail-closed). …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; NIST: https://www.nist.gov/itl/ai-risk-management-framework
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Hugging Face pipelines/endpoints» in S25_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Timeouts y errores de red se resuelven en T2-B (fallback/circuit). Caso PE: desk Lima mockea HF/local; golden mide exact match y field F1 sin auto-etiquetar fraude. Fixture `CAS…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** NIST: https://www.nist.gov/itl/ai-risk-management-framework; Py4E: https://www.py4e.com
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Hugging Face pipelines/endpoints» in S25_STORM.json; edge `research_supports_paragraph`.

### batching, timeout, cache, costo y fallback
**P1** (rank 9.55/10)
> **Batch** reduce overhead de red; **timeout** evita colgar el flow del VP; **cache** por hash de `input+model` evita re-facturar el mismo ticket. El AI assist sigue siendo borra…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Py4E: https://www.py4e.com; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «batching, timeout, cache, costo y fallback» in S25_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Estima **costo** (tokens o requests) por run y por día. **Fallback**: regla determinista o `human_review` si el endpoint cae — no “inventar” JSON de éxito. Circuit breaker simpl…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Live: https://pillb.github.io/pyarcana/; Hugging Face: https://huggingface.co/docs/transformers/pipeline_tutorial
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «batching, timeout, cache, costo y fallback» in S25_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Caso PE: desk Lima mockea HF/local; si `fail=True` en el lab → `fallback rules_or_human`. Golden y schema siguen siendo gate de promote; sin auto-fraude.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Hugging Face: https://huggingface.co/docs/transformers/pipeline_tutorial; Hugging Face: https://huggingface.co/docs/hub/model-cards
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «batching, timeout, cache, costo y fallback» in S25_STORM.json; edge `research_supports_paragraph`.

### objetivo, contexto, restricciones, ejemplos y salida estructurada
**P1** (rank 9.55/10)
> Prompt útil: **Objetivo** + **Contexto** + **Restricciones** + **Ejemplos** + **Schema JSON**. Sin schema, la narrativa libre no entra al informe del VP. El AI assist solo propo…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Hugging Face: https://huggingface.co/docs/hub/model-cards; Hugging Face: https://huggingface.co/docs/inference-endpoints/index
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «objetivo, contexto, restricciones, ejemplos y sa» in S25_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Pide **solo** campos necesarios. **Prohíbe inventar** números no presentes en el contexto (hallazgo sin `n`/`mediana` → `schema_fail`). Contrato: JSON + `model_id`; injection en…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Hugging Face: https://huggingface.co/docs/inference-endpoints/index; Hugging Face: https://huggingface.co/learn
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «objetivo, contexto, restricciones, ejemplos y sa» in S25_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Valida con `json.loads` + keys required; si falla, descarta aunque el texto “se vea bien”. Caso PE: golden exact match / field F1 sin auto-etiquetar fraude.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Hugging Face: https://huggingface.co/learn; OWASP: https://genai.owasp.org/llm-top-10/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «objetivo, contexto, restricciones, ejemplos y sa» in S25_STORM.json; edge `research_supports_paragraph`.

### thinking/tools/checkpoints controlados
**P1** (rank 9.55/10)
> Modos tipo **thinking** o **tools** (function calling) aumentan **costo** y **superficie de ataque**. No los actives “porque sí”: cada tool es un privilegio. El AI assist sigue …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** OWASP: https://genai.owasp.org/llm-top-10/; OWASP: https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «thinking/tools/checkpoints controlados» in S25_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Usa **checkpoints** auditables: `plan → tool → validar → narrar`. Si un tool no está en allowlist, **stop** (`tool_denied`) — no shell libre en el sandbox del curso.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** OWASP: https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html; JSON Schema: https://json-schema.org/learn/getting-started-step-by-step
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «thinking/tools/checkpoints controlados» in S25_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Allowlist didáctica: `calc_sum`, `lookup_metric`. Caso PE: `shell_rm` se deniega. Golden y schema siguen midiendo anclaje sin auto-fraude.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** JSON Schema: https://json-schema.org/learn/getting-started-step-by-step; OpenAI: https://platform.openai.com/docs/guides/structured-outputs
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «thinking/tools/checkpoints controlados» in S25_STORM.json; edge `research_supports_paragraph`.

### golden set, schema y revisión humana
**P1** (rank 9.55/10)
> Evalúa el asistente contra **golden** (input → JSON esperado). Métricas: **exact match**, **field F1**, tasa de `schema_fail`. Sin eval vs baseline, el “demo que suena bien” no …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** OpenAI: https://platform.openai.com/docs/guides/structured-outputs; deeplearning.ai: https://www.deeplearning.ai/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «golden set, schema y revisión humana» in S25_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Salidas borderline → **human review** obligatoria antes del informe final. `schema_fail` o injection → fail-closed a cola HITL. Fixture `CASO-LIM-025` sin PII real.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** deeplearning.ai: https://www.deeplearning.ai/; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «golden set, schema y revisión humana» in S25_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Baseline: **reglas**; el LLM debe ganar en utilidad **sin** perder anclaje (cites/campos). Caso PE: golden exact/F1 sin auto-etiquetar fraude.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «golden set, schema y revisión humana» in S25_STORM.json; edge `research_supports_paragraph`.

### prompt injection, exfiltración, sesgo y minimización
**P1** (rank 9.55/10)
> **Injection**: el documento no confiable (OCR, email) puede intentar dar órdenes. Delimítalo como **datos**, separa system/user, deshabilita tools por defecto y **nunca** eleves…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; NIST: https://www.nist.gov/itl/ai-risk-management-framework
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «prompt injection, exfiltración, sesgo y minimiza» in S25_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Un regex es solo **telemetría**: encoding e instrucciones indirectas lo evaden. Control real: privilegio mínimo, allowlists, aprobación humana, logs. **Exfil**: cero secretos en…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** NIST: https://www.nist.gov/itl/ai-risk-management-framework; Py4E: https://www.py4e.com
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «prompt injection, exfiltración, sesgo y minimiza» in S25_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Matching o scoring **no** es veredicto de fraude. Caso PE: golden sin auto-fraude; `auto_fraud_label=False` en el path del AI assist.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Py4E: https://www.py4e.com; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «prompt injection, exfiltración, sesgo y minimiza» in S25_STORM.json; edge `research_supports_paragraph`.

