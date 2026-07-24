# S50 Paragraph-by-Paragraph Analysis with Sources

Generated: 2026-07-24T04:19:22.134+00:00
Section: Evals, red teaming y fiabilidad de IA
File: `s50-tech-leadership.ts`
STORM cycles: **50**
Expert rank: **9.55**

## Competitive sources (domain-honest HTTP ≥5)

- OpenAI: [Evals design](https://platform.openai.com/docs/guides/evals-design) — eval design
- OpenAI: [Evals harness](https://github.com/openai/evals) — harness
- OWASP: [LLM Top 10](https://genai.owasp.org/llm-top-10/) — threats
- OWASP: [Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html) — injection
- NIST: [AI RMF GenAI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence) — GAI risk
- NVIDIA: [Garak](https://github.com/NVIDIA/garak) — red team probes
- Google: [SRE SLOs](https://sre.google/sre-book/service-level-objectives/) — SLO
- Promptfoo: [Evals & red team](https://www.promptfoo.dev/docs/intro/) — adversarial suite
- deeplearning.ai: [LLM courses](https://www.deeplearning.ai/) — pedagogy
- MIT: [6.100L](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/) — foundations
- Harvard: [CS50P](https://cs50.harvard.edu/python/) — tests
- Coursera: [LLM evaluation](https://www.coursera.org/courses?query=llm%20evaluation) — MOOC
- NIST: [AI RMF](https://www.nist.gov/itl/ai-risk-management-framework) — risk mgmt
- Py4E: [Python for Everybody](https://www.py4e.com) — progressive
- Live: [PyArcana](https://pillb.github.io/pyarcana/) — course

## Gold pass
| Area | Decision |
|------|----------|
| theory/iDo | map glossary + computed demos |
| weDo | CASO DEFECT 24/24 |
| git | NO restore (history thinner / soft residual) |
| STORM | hand_STORM_domain_sources |
| expert pass | deepened theory P1s + expanded resources |

## Theory (paragraph-level)

### Ruta de S50: Evals, red teaming y fiabilidad de IA
**P1** (rank 9.55/10)
> **Diccionario de la sección** (léelo antes de T1). **Task dataset:** tareas y slices versionados (train/dev/holdout). **Rúbrica 0–3:** anclas observables. **Trajectory eval:** n…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** OpenAI: https://platform.openai.com/docs/guides/evals-design; OpenAI: https://github.com/openai/evals
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Ruta de S50: Evals, red teaming y fiabilidad de » in S50_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Esta sección cierra el tramo agentic (S48–S49) con **evals y red team**: suites por slice, jueces con acuerdo, ataques de injection/exfil y fiabilidad operativa (p95, cache ACL,…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** OpenAI: https://github.com/openai/evals; OWASP: https://genai.owasp.org/llm-top-10/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Ruta de S50: Evals, red teaming y fiabilidad de » in S50_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Producto incremental: **scorecard de fiabilidad**. Entrada: tasks/slices versionados, holdout sellado, adversarios y SLOs. Salida: coverage de slices, injection_blocked, abstain…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** OWASP: https://genai.owasp.org/llm-top-10/; OWASP: https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Ruta de S50: Evals, red teaming y fiabilidad de » in S50_STORM.json; edge `research_supports_paragraph`.

**P4** (rank 9.55/10)
> Orden: T1 suite/slices → T2 jueces/order bias → T3 red team injection → T4 abstain/SLO/rollback. Teoría medible, iDo con helpers, weDo con **DEFECT** de eval por ejercicio. Id l…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** OWASP: https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html; NIST: https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Ruta de S50: Evals, red teaming y fiabilidad de » in S50_STORM.json; edge `research_supports_paragraph`.

### task dataset y rubric
**P1** (rank 9.55/10)
> El **task dataset** no es un dump de chats: representa **trabajos reales del copiloto** (citar SLA, recuperar caso, reanudar tras fallo de tool) y **slices versionados** (idioma…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** NIST: https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence; NVIDIA: https://github.com/NVIDIA/garak
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «task dataset y rubric» in S50_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: dataset de tareas versionado, rúbrica, baseline y candidato. Salida de este subtema: dataset versionado y rúbrica calibrada. Error: regresión P0/P1,…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** NVIDIA: https://github.com/NVIDIA/garak; Google: https://sre.google/sre-book/service-level-objectives/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «task dataset y rubric» in S50_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `task dataset y rubric` al caso peruano sintético `CASO-ICA-050`: un copiloto sintético de operaciones para una organización ficticia en Ica. La evidencia esperada…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Google: https://sre.google/sre-book/service-level-objectives/; Promptfoo: https://www.promptfoo.dev/docs/intro/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «task dataset y rubric» in S50_STORM.json; edge `research_supports_paragraph`.

### resultado, proceso, trajectory y recovery
**P1** (rank 9.55/10)
> Evalúa **outcome** (¿cumple la tarea?), **proceso** (¿pasos legítimos?), **trajectory** (secuencia de tool args/resultados) y **recovery** (reanudación tras error). Una respuest…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Promptfoo: https://www.promptfoo.dev/docs/intro/; deeplearning.ai: https://www.deeplearning.ai/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «resultado, proceso, trajectory y recovery» in S50_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: dataset de tareas versionado, rúbrica, baseline y candidato. Salida de este subtema: tool calls y reanudación calificadas. Error: regresión P0/P1, i…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** deeplearning.ai: https://www.deeplearning.ai/; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «resultado, proceso, trajectory y recovery» in S50_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `resultado, proceso, trajectory y recovery` al caso peruano sintético `CASO-ICA-050`: un copiloto sintético de operaciones para una organización ficticia en Ica. L…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «resultado, proceso, trajectory y recovery» in S50_STORM.json; edge `research_supports_paragraph`.

### graders deterministas/humanos/LLM
**P1** (rank 9.55/10)
> **Graders deterministas** cubren contratos (schema, cites presentes, tool en allowlist); **humanos** juzgan matices y severidad; **LLM judges** escalan volumen solo tras **calib…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; Coursera: https://www.coursera.org/courses?query=llm%20evaluation
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «graders deterministas/humanos/LLM» in S50_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: dataset de tareas versionado, rúbrica, baseline y candidato. Salida de este subtema: acuerdo y desacuerdos medidos. Error: regresión P0/P1, injectio…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Coursera: https://www.coursera.org/courses?query=llm%20evaluation; NIST: https://www.nist.gov/itl/ai-risk-management-framework
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «graders deterministas/humanos/LLM» in S50_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `graders deterministas/humanos/LLM` al caso peruano sintético `CASO-ICA-050`: un copiloto sintético de operaciones para una organización ficticia en Ica. La eviden…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** NIST: https://www.nist.gov/itl/ai-risk-management-framework; Py4E: https://www.py4e.com
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «graders deterministas/humanos/LLM» in S50_STORM.json; edge `research_supports_paragraph`.

### calibración, order bias y conjunto retenido
**P1** (rank 9.55/10)
> Calibra judges y rúbricas contra **ejemplos ancla** con score conocido; **alterna el orden** de opciones/respuestas para medir **order bias** (si |rate_AB − rate_BA| supera umbr…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Py4E: https://www.py4e.com; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «calibración, order bias y conjunto retenido» in S50_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: dataset de tareas versionado, rúbrica, baseline y candidato. Salida de este subtema: order bias bajo umbral y holdout intacto. Error: regresión P0/P…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Live: https://pillb.github.io/pyarcana/; OpenAI: https://platform.openai.com/docs/guides/evals-design
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «calibración, order bias y conjunto retenido» in S50_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `calibración, order bias y conjunto retenido` al caso peruano sintético `CASO-ICA-050`: un copiloto sintético de operaciones para una organización ficticia en Ica.…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** OpenAI: https://platform.openai.com/docs/guides/evals-design; OpenAI: https://github.com/openai/evals
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «calibración, order bias y conjunto retenido» in S50_STORM.json; edge `research_supports_paragraph`.

### prompt injection, exfiltración y tool misuse
**P1** (rank 9.55/10)
> **Red team** intenta **prompt injection**, **exfiltración** (secrets/PII en salida o logs) y **tool misuse** (args fuera de allowlist, side-effects). El éxito del control es **c…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** OpenAI: https://github.com/openai/evals; OWASP: https://genai.owasp.org/llm-top-10/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «prompt injection, exfiltración y tool misuse» in S50_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: dataset de tareas versionado, rúbrica, baseline y candidato. Salida de este subtema: ataques críticos bloqueados por policy. Error: regresión P0/P1,…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** OWASP: https://genai.owasp.org/llm-top-10/; OWASP: https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «prompt injection, exfiltración y tool misuse» in S50_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `prompt injection, exfiltración y tool misuse` al caso peruano sintético `CASO-ICA-050`: un copiloto sintético de operaciones para una organización ficticia en Ica…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** OWASP: https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html; NIST: https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «prompt injection, exfiltración y tool misuse» in S50_STORM.json; edge `research_supports_paragraph`.

### indirect injection, data poisoning y least privilege
**P1** (rank 9.55/10)
> **Indirect injection** llega en documentos recuperados o resultados de tools («grant admin», «ignore policy»); **data poisoning** altera el corpus/index con fragmentos hostiles …
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** NIST: https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence; NVIDIA: https://github.com/NVIDIA/garak
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «indirect injection, data poisoning y least privi» in S50_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: dataset de tareas versionado, rúbrica, baseline y candidato. Salida de este subtema: contenido recuperado no eleva permisos. Error: regresión P0/P1,…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** NVIDIA: https://github.com/NVIDIA/garak; Google: https://sre.google/sre-book/service-level-objectives/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «indirect injection, data poisoning y least privi» in S50_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `indirect injection, data poisoning y least privilege` al caso peruano sintético `CASO-ICA-050`: un copiloto sintético de operaciones para una organización fictici…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Google: https://sre.google/sre-book/service-level-objectives/; Promptfoo: https://www.promptfoo.dev/docs/intro/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «indirect injection, data poisoning y least privi» in S50_STORM.json; edge `research_supports_paragraph`.

### hallucination y abstención
**P1** (rank 9.55/10)
> Mide **unsupported claims** y la **calidad de abstención** por slice: un sistema que «siempre contesta» falla el gate de groundedness. Ante evidencia insuficiente se **cita el l…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Promptfoo: https://www.promptfoo.dev/docs/intro/; deeplearning.ai: https://www.deeplearning.ai/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «hallucination y abstención» in S50_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato de groundedness. Entrada: support score y umbral. Salida: `answer` solo si support≥thr; si no `abstain`. Error: inventar claims en holdout o auto-etiquetar fraude. Crit…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** deeplearning.ai: https://www.deeplearning.ai/; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «hallucination y abstención» in S50_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación a `CASO-ICA-050-T4A`: support alto responde con cites; bajo se abstiene. No es veredicto de fraude, parentesco ni intención: solo fiabilidad del copiloto sintético de…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «hallucination y abstención» in S50_STORM.json; edge `research_supports_paragraph`.

### latency/cost/caching, incident response y rollback
**P1** (rank 9.55/10)
> **Latencia/costo/cache** forman el **SLO** operativo (p95, $ por tarea, hit-rate de prefix cache con ACL). **Incident response** congela la versión candidata, preserva **traces …
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; Coursera: https://www.coursera.org/courses?query=llm%20evaluation
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «latency/cost/caching, incident response y rollba» in S50_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: dataset de tareas versionado, rúbrica, baseline y candidato. Salida de este subtema: rollback dentro de RTO con evidencia. Error: regresión P0/P1, i…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Coursera: https://www.coursera.org/courses?query=llm%20evaluation; NIST: https://www.nist.gov/itl/ai-risk-management-framework
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «latency/cost/caching, incident response y rollba» in S50_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `latency/cost/caching, incident response y rollback` al caso peruano sintético `CASO-ICA-050`: un copiloto sintético de operaciones para una organización ficticia …
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** NIST: https://www.nist.gov/itl/ai-risk-management-framework; Py4E: https://www.py4e.com
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «latency/cost/caching, incident response y rollba» in S50_STORM.json; edge `research_supports_paragraph`.

