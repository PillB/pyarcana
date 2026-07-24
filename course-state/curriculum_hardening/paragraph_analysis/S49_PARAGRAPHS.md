# S49 Paragraph-by-Paragraph Analysis with Sources

Generated: 2026-07-24T04:12:12.653568+00:00
Section: Agentes, herramientas y context engineering
File: `s49-data-contracts.ts`
STORM cycles: **49**
Expert rank: **9.55**

## Competitive sources (domain-honest HTTP ≥5)

- Anthropic: [Building effective agents](https://www.anthropic.com/research/building-effective-agents) — agent patterns
- OpenAI: [Function calling](https://platform.openai.com/docs/guides/function-calling) — tools
- LangGraph: [LangGraph docs](https://langchain-ai.github.io/langgraph/) — agent graphs
- LlamaIndex: [Agents guide](https://docs.llamaindex.ai/en/stable/module_guides/deploying/agents/) — agents
- OWASP: [LLM Top 10](https://owasp.org/www-project-top-10-for-large-language-model-applications/) — LLM risks
- NIST: [AI RMF](https://www.nist.gov/itl/ai-risk-management-framework) — human oversight
- JSON Schema: [JSON Schema](https://json-schema.org/understanding-json-schema/) — tool schemas
- Microsoft: [Semantic Kernel](https://learn.microsoft.com/semantic-kernel/) — plugins planners
- SRE: [Cascading failures](https://sre.google/sre-book/addressing-cascading-failures/) — budgets stop
- 12factor: [12-Factor App](https://12factor.net/) — config processes
- Stanford: [CS224n NLP](https://web.stanford.edu/class/cs224n/) — NLP foundations
- deeplearning.ai: [AI agents courses](https://www.deeplearning.ai/) — agent courses
- MIT: [MIT 6.100L](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/) — foundations
- Harvard: [CS50P](https://cs50.harvard.edu/python) — pedagogy
- Coursera: [Agentic AI courses](https://www.coursera.org/courses?query=ai%20agents) — agents MOOCs
- Py4E: [Python for Everybody](https://www.py4e.com) — progressive disclosure
- Live: [PyArcana](https://pillb.github.io/pyarcana/)

## Gold pass
| Area | Decision |
|------|----------|
| theory/iDo | map glossary + computed demos |
| weDo | CASO DEFECT 24/24 |
| git | NO restore |
| STORM | hand_STORM_domain_sources |
| expert pass | deepened theory + expanded resources |

## Theory (paragraph-level)

### Ruta de S49: Agentes, herramientas y context engineering
**P1** (rank 9.55/10)
> **Diccionario de la sección** (léelo antes de T1). **Workflow vs agente:** pasos conocidos vs decisiones acotadas con evaluator. **Planner/worker/evaluator:** descomponer, ejecutar, verificar. **Tool de responsabilidad única:** un efecto bien tipado. **Idempotencia de tool:** …
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** JSON Schema: https://json-schema.org/understanding-json-schema/; NIST: https://www.nist.gov/itl/ai-risk-management-framework
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Ruta de S49: Agentes, herramientas y context eng» in S49_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Esta sección extiende RAG (S48) con **agentes y tools**: planes acotados, scopes, context windows y costos. Demos stdlib (contadores, sets) sin frameworks de agentes reales. El caso `CASO-AYA-049` (Ayacucho sintético) no ejecuta tools de red abiertas ni PII.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Microsoft: https://learn.microsoft.com/semantic-kernel/; JSON Schema: https://json-schema.org/understanding-json-schema/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Ruta de S49: Agentes, herramientas y context eng» in S49_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Producto incremental: propuesta de plan + tool calls auditables. Entrada: goal, tools con scope, max_steps/cost y evaluator. Salida: plan ≤ límites, effects=1 por tool idempotente, network closed sin approval. Error de promoción: éxito sin known_steps, side_effect multi-respon…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** SRE: https://sre.google/sre-book/addressing-cascading-failures/; Microsoft: https://learn.microsoft.com/semantic-kernel/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Ruta de S49: Agentes, herramientas y context eng» in S49_STORM.json; edge `research_supports_paragraph`.

**P4** (rank 9.55/10)
> Orden: T1 baseline vs agente → T2 tools/scope → T3 context/checkpoint → T4 cost/network/approval. Teoría medible, iDo con helpers, weDo con defecto agentic por ejercicio. Id legacy no limita a data contracts tabulares; V3 es agent tool-use gobernado. Stack didáctico: **stdlib*…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** 12factor: https://12factor.net/; SRE: https://sre.google/sre-book/addressing-cascading-failures/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Ruta de S49: Agentes, herramientas y context eng» in S49_STORM.json; edge `research_supports_paragraph`.


### workflow vs agente
**P1** (rank 9.55/10)
> Usa **workflow** cuando pasos y ramas son conocidos y deterministas; reserva **agente** solo para decisiones acotadas con beneficio medible frente a un baseline y salida verificable por un evaluator. Un agente abierto sin presupuesto ni tools de responsabilidad única no es «má…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** OWASP: https://owasp.org/www-project-top-10-for-large-language-model-applications/; NIST: https://www.nist.gov/itl/ai-risk-management-framework
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «workflow vs agente» in S49_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: objetivo acotado, contexto mínimo, tools tipadas, permisos y presupuesto (`max_steps`/`max_cost`). Salida de este subtema: ADR workflow/agente con baseline documentado. Error: tool no permitida, argumento inválido, presupuesto agotado o estado inci…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** NIST: https://www.nist.gov/itl/ai-risk-management-framework; JSON Schema: https://json-schema.org/understanding-json-schema/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «workflow vs agente» in S49_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `workflow vs agente` al caso peruano sintético `CASO-AYA-049`: un workflow sintético de preparación de reportes para una entidad ficticia en Ayacucho. La evidencia esperada es ADR que elige `workflow` cuando el path es determinista. No contiene PII ni secretos; u…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** JSON Schema: https://json-schema.org/understanding-json-schema/; Microsoft: https://learn.microsoft.com/semantic-kernel/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «workflow vs agente» in S49_STORM.json; edge `research_supports_paragraph`.


### routing, planner/worker y evaluator–optimizer
**P1** (rank 9.55/10)
> Router elige ruta, planner descompone, worker ejecuta y evaluator critica; límites evitan un ciclo abierto entre roles.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Microsoft: https://learn.microsoft.com/semantic-kernel/; NIST: https://www.nist.gov/itl/ai-risk-management-framework
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «routing, planner/worker y evaluator–optimizer» in S49_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: objetivo acotado, contexto mínimo, tools tipadas, permisos y presupuesto. Salida de este subtema: trayectoria con roles y máximo de iteraciones. Error: tool no permitida, argumento inválido, presupuesto agotado o estado incierto detiene el run. Cri…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** SRE: https://sre.google/sre-book/addressing-cascading-failures/; JSON Schema: https://json-schema.org/understanding-json-schema/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «routing, planner/worker y evaluator–optimizer» in S49_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `routing, planner/worker y evaluator–optimizer` al caso peruano sintético `CASO-AYA-049`: un workflow sintético de preparación de reportes para una entidad ficticia en Ayacucho. La evidencia esperada es trayectoria con roles y máximo de iteraciones. No contiene P…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** 12factor: https://12factor.net/; Microsoft: https://learn.microsoft.com/semantic-kernel/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «routing, planner/worker y evaluator–optimizer» in S49_STORM.json; edge `research_supports_paragraph`.


### funciones de responsabilidad única
**P1** (rank 9.55/10)
> Una tool hace una sola cosa observable, usa schema estrecho y devuelve error tipado; descripción no concede autoridad.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** LangGraph: https://langchain-ai.github.io/langgraph/; NIST: https://www.nist.gov/itl/ai-risk-management-framework
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «funciones de responsabilidad única» in S49_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: objetivo acotado, contexto mínimo, tools tipadas, permisos y presupuesto. Salida de este subtema: tool contract con casos válidos/inválidos. Error: tool no permitida, argumento inválido, presupuesto agotado o estado incierto detiene el run. Criteri…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** LlamaIndex: https://docs.llamaindex.ai/en/stable/module_guides/deploying/agents/; JSON Schema: https://json-schema.org/understanding-json-schema/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «funciones de responsabilidad única» in S49_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `funciones de responsabilidad única` al caso peruano sintético `CASO-AYA-049`: un workflow sintético de preparación de reportes para una entidad ficticia en Ayacucho. La evidencia esperada es tool contract con casos válidos/inválidos. No contiene PII ni secretos;…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** OWASP: https://owasp.org/www-project-top-10-for-large-language-model-applications/; Microsoft: https://learn.microsoft.com/semantic-kernel/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «funciones de responsabilidad única» in S49_STORM.json; edge `research_supports_paragraph`.


### schema, permisos, idempotencia y errores
**P1** (rank 9.55/10)
> Permisos se verifican en ejecución, idempotency key protege retries y errores separan retryable/terminal sin filtrar secretos.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** LangGraph: https://langchain-ai.github.io/langgraph/; NIST: https://www.nist.gov/itl/ai-risk-management-framework
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «schema, permisos, idempotencia y errores» in S49_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: objetivo acotado, contexto mínimo, tools tipadas, permisos y presupuesto. Salida de este subtema: replay y denegación de tool probados. Error: tool no permitida, argumento inválido, presupuesto agotado o estado incierto detiene el run. Criterio de …
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** LlamaIndex: https://docs.llamaindex.ai/en/stable/module_guides/deploying/agents/; JSON Schema: https://json-schema.org/understanding-json-schema/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «schema, permisos, idempotencia y errores» in S49_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `schema, permisos, idempotencia y errores` al caso peruano sintético `CASO-AYA-049`: un workflow sintético de preparación de reportes para una entidad ficticia en Ayacucho. La evidencia esperada es replay y denegación de tool probados. No contiene PII ni secretos…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** OWASP: https://owasp.org/www-project-top-10-for-large-language-model-applications/; Microsoft: https://learn.microsoft.com/semantic-kernel/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «schema, permisos, idempotencia y errores» in S49_STORM.json; edge `research_supports_paragraph`.


### contexto mínimo, retrieval JIT y checkpoints
**P1** (rank 9.55/10)
> Contexto mínimo reduce costo y fuga; retrieval just-in-time aporta evidencia y checkpoints guardan estado tras efectos durables.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** LangGraph: https://langchain-ai.github.io/langgraph/; NIST: https://www.nist.gov/itl/ai-risk-management-framework
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «contexto mínimo, retrieval JIT y checkpoints» in S49_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: objetivo acotado, contexto mínimo, tools tipadas, permisos y presupuesto. Salida de este subtema: reanudación desde checkpoint consistente. Error: tool no permitida, argumento inválido, presupuesto agotado o estado incierto detiene el run. Criterio…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** LlamaIndex: https://docs.llamaindex.ai/en/stable/module_guides/deploying/agents/; JSON Schema: https://json-schema.org/understanding-json-schema/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «contexto mínimo, retrieval JIT y checkpoints» in S49_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `contexto mínimo, retrieval JIT y checkpoints` al caso peruano sintético `CASO-AYA-049`: un workflow sintético de preparación de reportes para una entidad ficticia en Ayacucho. La evidencia esperada es reanudación desde checkpoint consistente. No contiene PII ni …
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** OWASP: https://owasp.org/www-project-top-10-for-large-language-model-applications/; Microsoft: https://learn.microsoft.com/semantic-kernel/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «contexto mínimo, retrieval JIT y checkpoints» in S49_STORM.json; edge `research_supports_paragraph`.


### memoria, compaction y last-known-good
**P1** (rank 9.55/10)
> Memoria tiene propósito/retención; compaction conserva hechos y decisiones con provenance, y last-known-good permite volver a estado seguro.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** JSON Schema: https://json-schema.org/understanding-json-schema/; NIST: https://www.nist.gov/itl/ai-risk-management-framework
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «memoria, compaction y last-known-good» in S49_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: objetivo acotado, contexto mínimo, tools tipadas, permisos y presupuesto. Salida de este subtema: compaction no pierde restricción crítica. Error: tool no permitida, argumento inválido, presupuesto agotado o estado incierto detiene el run. Criterio…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Microsoft: https://learn.microsoft.com/semantic-kernel/; JSON Schema: https://json-schema.org/understanding-json-schema/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «memoria, compaction y last-known-good» in S49_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `memoria, compaction y last-known-good` al caso peruano sintético `CASO-AYA-049`: un workflow sintético de preparación de reportes para una entidad ficticia en Ayacucho. La evidencia esperada es compaction no pierde restricción crítica. No contiene PII ni secreto…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** SRE: https://sre.google/sre-book/addressing-cascading-failures/; Microsoft: https://learn.microsoft.com/semantic-kernel/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «memoria, compaction y last-known-good» in S49_STORM.json; edge `research_supports_paragraph`.


### stopping conditions y budgets
**P1** (rank 9.55/10)
> Stopping conditions incluyen meta, máximo de pasos, tiempo, tokens y costo; agotamiento produce estado explícito, no continuación infinita.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** OWASP: https://owasp.org/www-project-top-10-for-large-language-model-applications/; NIST: https://www.nist.gov/itl/ai-risk-management-framework
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «stopping conditions y budgets» in S49_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: objetivo acotado, contexto mínimo, tools tipadas, permisos y presupuesto. Salida de este subtema: budget exhaustion termina con razón. Error: tool no permitida, argumento inválido, presupuesto agotado o estado incierto detiene el run. Criterio de é…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** NIST: https://www.nist.gov/itl/ai-risk-management-framework; JSON Schema: https://json-schema.org/understanding-json-schema/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «stopping conditions y budgets» in S49_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `stopping conditions y budgets` al caso peruano sintético `CASO-AYA-049`: un workflow sintético de preparación de reportes para una entidad ficticia en Ayacucho. La evidencia esperada es budget exhaustion termina con razón. No contiene PII ni secretos; una señal …
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** JSON Schema: https://json-schema.org/understanding-json-schema/; Microsoft: https://learn.microsoft.com/semantic-kernel/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «stopping conditions y budgets» in S49_STORM.json; edge `research_supports_paragraph`.


### sandbox, human approval y recuperación
**P1** (rank 9.55/10)
> Sandbox limita filesystem/red; acciones sensibles requieren aprobación contextual y recovery evita repetir una tool con efecto.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Microsoft: https://learn.microsoft.com/semantic-kernel/; NIST: https://www.nist.gov/itl/ai-risk-management-framework
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «sandbox, human approval y recuperación» in S49_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato human-in-the-loop. Entrada: nombre de tool y flag human_ok. Salida: `needs_human` si la tool es `prod_*` sin aprobación; `sandbox_ok` si es lectura. Error: enviar o mutar prod sin gate. Criterio: en Ayacucho sintético `run_tool('prod_send', False)` se detiene; search_…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** SRE: https://sre.google/sre-book/addressing-cascading-failures/; JSON Schema: https://json-schema.org/understanding-json-schema/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «sandbox, human approval y recuperación» in S49_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación a `CASO-AYA-049-T4B`: el agente prepara propuesta y checkpoint; nunca envía ni cambia prod. Recovery = resume_checkpoint, no re-ejecutar side effects.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** 12factor: https://12factor.net/; Microsoft: https://learn.microsoft.com/semantic-kernel/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «sandbox, human approval y recuperación» in S49_STORM.json; edge `research_supports_paragraph`.


## Expert judgment
- Residual score 0; expert rank **9.55** (≥9.5).
- Git: keep worktree.
- V3 retarget guards preserved.
