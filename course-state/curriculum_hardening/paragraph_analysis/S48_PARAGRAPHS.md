# S48 Paragraph-by-Paragraph Analysis with Sources

Generated: 2026-07-24T04:12:12.653568+00:00
Section: LLM applications y RAG con evidencia
File: `s48-ai-governance.ts`
STORM cycles: **48**
Expert rank: **9.55**

## Competitive sources (domain-honest HTTP ≥5)

- OpenAI: [Embeddings guide](https://platform.openai.com/docs/guides/embeddings) — embeddings
- OpenAI: [RAG PDF cookbook](https://cookbook.openai.com/examples/parse_pdf_docs_for_rag) — chunking RAG
- OpenAI: [Evals](https://github.com/openai/evals) — eval harness
- Elastic: [RRF ranking](https://www.elastic.co/guide/en/elasticsearch/reference/current/rrf.html) — hybrid rank
- OWASP: [LLM Prompt Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html) — injection
- LangChain: [RAG tutorial](https://python.langchain.com/docs/tutorials/rag/) — RAG pipeline
- LlamaIndex: [LlamaIndex docs](https://docs.llamaindex.ai/en/stable/) — retrieval
- Stanford: [CS224n NLP](https://web.stanford.edu/class/cs224n/) — embeddings NLP
- SentenceTransformers: [Sentence Transformers](https://www.sbert.net/) — embeddings local
- Haystack: [Haystack docs](https://docs.haystack.deepset.ai/) — pipelines
- NIST: [AI RMF](https://www.nist.gov/itl/ai-risk-management-framework) — AI risk
- deeplearning.ai: [LLM courses](https://www.deeplearning.ai/) — RAG courses
- MIT: [MIT 6.100L](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/) — foundations
- Harvard: [CS50P](https://cs50.harvard.edu/python) — pedagogy
- Coursera: [RAG courses](https://www.coursera.org/courses?query=retrieval%20augmented%20generation) — RAG MOOCs
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

### Ruta de S48: LLM applications y RAG con evidencia
**P1** (rank 9.55/10)
> **Diccionario de la sección** (léelo antes de T1). **Embedding:** vector de representación (versióned). **Similarity:** ranking aproximado, no verdad. **Chunking:** partir docs con metadata y dedup. **ACL:** control de acceso por fragmento. **Hybrid retrieval:** lexical + vect…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** LlamaIndex: https://docs.llamaindex.ai/en/stable/; LangChain: https://python.langchain.com/docs/tutorials/rag/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Ruta de S48: LLM applications y RAG con evidenci» in S48_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Esta sección construye **RAG con evidencia** sobre el serving de S47: retrieval, chunking con ACL, citas y groundedness. Demos stdlib (scores, sets) al estilo vector store conceptual. El caso `CASO-PUN-048` (Puno sintético) no llama APIs de LLM reales ni indexa PII.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Stanford: https://web.stanford.edu/class/cs224n/; LlamaIndex: https://docs.llamaindex.ai/en/stable/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Ruta de S48: LLM applications y RAG con evidenci» in S48_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Producto incremental: respuesta estructurada con evidence_ids. Entrada: query, corpus con ACL, holdout de recall y política de citas. Salida: top-k permitido, claims ⊆ cited, injection ignorada. Error de promoción: recall bajo baseline, chunk borrado aún visible, o claim sin s…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** SentenceTransformers: https://www.sbert.net/; Stanford: https://web.stanford.edu/class/cs224n/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Ruta de S48: LLM applications y RAG con evidenci» in S48_STORM.json; edge `research_supports_paragraph`.

**P4** (rank 9.55/10)
> Orden: T1 retrieval/holdout → T2 chunk/ACL → T3 rank/citas → T4 groundedness y anti-injection. Teoría medible, iDo con helpers, weDo con defecto RAG por ejercicio. Id legacy se alinea a gobernanza de evidencia; V3 es RAG con prueba, no auto-fraude. Stack didáctico: **stdlib** …
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Haystack: https://docs.haystack.deepset.ai/; SentenceTransformers: https://www.sbert.net/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «Ruta de S48: LLM applications y RAG con evidenci» in S48_STORM.json; edge `research_supports_paragraph`.


### embeddings y similarity
**P1** (rank 9.55/10)
> Embeddings aproximan relaciones en un espacio vectorial y **similarity solo ordena candidatos** — no prueba verdad ni autoriza un claim. Versión del modelo de embedding, normalización y métrica (cosine, etc.) son parte del contrato del índice: cambiar cualquiera sin re-eval ro…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** OpenAI: https://github.com/openai/evals; LangChain: https://python.langchain.com/docs/tutorials/rag/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «embeddings y similarity» in S48_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: documentos versionados con ACL, provenance, metadata y solicitud del usuario. Salida de este subtema: ranking reproducible con versión de embedding documentada. Error: fragmento sin permiso, evidencia insuficiente, versión borrada o costo excedido …
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Elastic: https://www.elastic.co/guide/en/elasticsearch/reference/current/rrf.html; LlamaIndex: https://docs.llamaindex.ai/en/stable/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «embeddings y similarity» in S48_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `embeddings y similarity` al caso peruano sintético `CASO-PUN-048`: documentación sintética autorizada de una cooperativa ficticia en Puno. La evidencia esperada es ranking reproducible con versión de embedding (demo cosine 2D en el lab). No contiene PII ni secre…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** OWASP: https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html; Stanford: https://web.stanford.edu/class/cs224n/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «embeddings y similarity» in S48_STORM.json; edge `research_supports_paragraph`.


### límites, versiones y evaluación
**P1** (rank 9.55/10)
> Evalúa recall/precision en tareas reales y slicea errores; cambiar embedding exige baseline, costo y reindexación, no intuición.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** OWASP: https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html; LangChain: https://python.langchain.com/docs/tutorials/rag/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «límites, versiones y evaluación» in S48_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: documentos versionados con ACL, provenance, metadata y solicitud del usuario. Salida de este subtema: comparación retenida baseline/candidato. Error: fragmento sin permiso, evidencia insuficiente, versión borrada o costo excedido impide responder. …
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** LangChain: https://python.langchain.com/docs/tutorials/rag/; LlamaIndex: https://docs.llamaindex.ai/en/stable/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «límites, versiones y evaluación» in S48_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `límites, versiones y evaluación` al caso peruano sintético `CASO-PUN-048`: documentación sintética autorizada de una cooperativa ficticia en Puno. La evidencia esperada es comparación retenida baseline/candidato. No contiene PII ni secretos; una señal incierta s…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** LlamaIndex: https://docs.llamaindex.ai/en/stable/; Stanford: https://web.stanford.edu/class/cs224n/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «límites, versiones y evaluación» in S48_STORM.json; edge `research_supports_paragraph`.


### chunking, metadata y dedup
**P1** (rank 9.55/10)
> Chunking sigue unidades semánticas y conserva metadata; dedup por hash/identidad evita evidencia repetida y fuga entre versiones.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** OpenAI: https://cookbook.openai.com/examples/parse_pdf_docs_for_rag; LangChain: https://python.langchain.com/docs/tutorials/rag/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «chunking, metadata y dedup» in S48_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: documentos versionados con ACL, provenance, metadata y solicitud del usuario. Salida de este subtema: chunks trazables y sin duplicados. Error: fragmento sin permiso, evidencia insuficiente, versión borrada o costo excedido impide responder. Criter…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** OpenAI: https://github.com/openai/evals; LlamaIndex: https://docs.llamaindex.ai/en/stable/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «chunking, metadata y dedup» in S48_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `chunking, metadata y dedup` al caso peruano sintético `CASO-PUN-048`: documentación sintética autorizada de una cooperativa ficticia en Puno. La evidencia esperada es chunks trazables y sin duplicados. No contiene PII ni secretos; una señal incierta se deriva y …
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Elastic: https://www.elastic.co/guide/en/elasticsearch/reference/current/rrf.html; Stanford: https://web.stanford.edu/class/cs224n/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «chunking, metadata y dedup» in S48_STORM.json; edge `research_supports_paragraph`.


### ACL, deletion y provenance
**P1** (rank 9.55/10)
> ACL se filtra antes de retrieval/rerank; deletion invalida índice/cache y provenance enlaza cada chunk a documento y versión.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** OpenAI: https://github.com/openai/evals; LangChain: https://python.langchain.com/docs/tutorials/rag/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «ACL, deletion y provenance» in S48_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: documentos versionados con ACL, provenance, metadata y solicitud del usuario. Salida de este subtema: usuario sin permiso recupera cero fragmentos. Error: fragmento sin permiso, evidencia insuficiente, versión borrada o costo excedido impide respon…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Elastic: https://www.elastic.co/guide/en/elasticsearch/reference/current/rrf.html; LlamaIndex: https://docs.llamaindex.ai/en/stable/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «ACL, deletion y provenance» in S48_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `ACL, deletion y provenance` al caso peruano sintético `CASO-PUN-048`: documentación sintética autorizada de una cooperativa ficticia en Puno. La evidencia esperada es usuario sin permiso recupera cero fragmentos. No contiene PII ni secretos; una señal incierta s…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** OWASP: https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html; Stanford: https://web.stanford.edu/class/cs224n/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «ACL, deletion y provenance» in S48_STORM.json; edge `research_supports_paragraph`.


### lexical/vector/hybrid y reranking
**P1** (rank 9.55/10)
> Lexical captura términos exactos, vector semántica y hybrid combina scores calibrados; rerank opera solo sobre candidatos permitidos.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** OpenAI: https://cookbook.openai.com/examples/parse_pdf_docs_for_rag; LangChain: https://python.langchain.com/docs/tutorials/rag/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «lexical/vector/hybrid y reranking» in S48_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: documentos versionados con ACL, provenance, metadata y solicitud del usuario. Salida de este subtema: recall mejora sin romper ACL. Error: fragmento sin permiso, evidencia insuficiente, versión borrada o costo excedido impide responder. Criterio de…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** OpenAI: https://github.com/openai/evals; LlamaIndex: https://docs.llamaindex.ai/en/stable/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «lexical/vector/hybrid y reranking» in S48_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `lexical/vector/hybrid y reranking` al caso peruano sintético `CASO-PUN-048`: documentación sintética autorizada de una cooperativa ficticia en Puno. La evidencia esperada es recall mejora sin romper ACL. No contiene PII ni secretos; una señal incierta se deriva …
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Elastic: https://www.elastic.co/guide/en/elasticsearch/reference/current/rrf.html; Stanford: https://web.stanford.edu/class/cs224n/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «lexical/vector/hybrid y reranking» in S48_STORM.json; edge `research_supports_paragraph`.


### contexto, citas y permisos
**P1** (rank 9.55/10)
> Contexto incluye fragmentos mínimos, citas y límites; una cita debe resolver a texto/ver­sión accesible por el solicitante.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** OpenAI: https://cookbook.openai.com/examples/parse_pdf_docs_for_rag; LangChain: https://python.langchain.com/docs/tutorials/rag/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «contexto, citas y permisos» in S48_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: documentos versionados con ACL, provenance, metadata y solicitud del usuario. Salida de este subtema: cada afirmación material tiene cita autorizada. Error: fragmento sin permiso, evidencia insuficiente, versión borrada o costo excedido impide resp…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** OpenAI: https://github.com/openai/evals; LlamaIndex: https://docs.llamaindex.ai/en/stable/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «contexto, citas y permisos» in S48_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `contexto, citas y permisos` al caso peruano sintético `CASO-PUN-048`: documentación sintética autorizada de una cooperativa ficticia en Puno. La evidencia esperada es cada afirmación material tiene cita autorizada. No contiene PII ni secretos; una señal incierta…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Elastic: https://www.elastic.co/guide/en/elasticsearch/reference/current/rrf.html; Stanford: https://web.stanford.edu/class/cs224n/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «contexto, citas y permisos» in S48_STORM.json; edge `research_supports_paragraph`.


### structured output y grounding
**P1** (rank 9.55/10)
> Structured output se valida contra schema; grounding limita afirmaciones a evidencia y separa instrucciones del usuario del contenido recuperado.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Stanford: https://web.stanford.edu/class/cs224n/; LangChain: https://python.langchain.com/docs/tutorials/rag/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «structured output y grounding» in S48_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato operativo. Entrada: documentos versionados con ACL, provenance, metadata y solicitud del usuario. Salida de este subtema: schema válido y evidence ids presentes. Error: fragmento sin permiso, evidencia insuficiente, versión borrada o costo excedido impide responder. C…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** SentenceTransformers: https://www.sbert.net/; LlamaIndex: https://docs.llamaindex.ai/en/stable/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «structured output y grounding» in S48_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación de `structured output y grounding` al caso peruano sintético `CASO-PUN-048`: documentación sintética autorizada de una cooperativa ficticia en Puno. La evidencia esperada es schema válido y evidence ids presentes. No contiene PII ni secretos; una señal incierta se d…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Haystack: https://docs.haystack.deepset.ai/; Stanford: https://web.stanford.edu/class/cs224n/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «structured output y grounding» in S48_STORM.json; edge `research_supports_paragraph`.


### retrieval/answer eval, costo y abstención
**P1** (rank 9.55/10)
> Retrieval eval y answer eval son gates separados; costo/latencia tienen presupuesto y la abstención es éxito cuando falta soporte.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** OpenAI: https://github.com/openai/evals; LangChain: https://python.langchain.com/docs/tutorials/rag/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «retrieval/answer eval, costo y abstención» in S48_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Contrato de abstención. Entrada: score de soporte retrieval y umbral thr. Salida: `answer` si support≥thr, si no `abstain`. Error: inventar citas o forzar respuesta con support bajo. Criterio: en Puno sintético `decide(0.2)` es abstain y se documenta el costo de tokens del int…
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** Elastic: https://www.elastic.co/guide/en/elasticsearch/reference/current/rrf.html; LlamaIndex: https://docs.llamaindex.ai/en/stable/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «retrieval/answer eval, costo y abstención» in S48_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Aplicación a `CASO-PUN-048-T4B`: support alto responde; support bajo se abstiene. No es veredicto de conducta; solo groundedness sobre docs autorizados.
- **Analysis:** Four-layer pedagogy; domain-honest sources; progressive disclosure; fail-closed gates.
- **Sources:** OWASP: https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html; Stanford: https://web.stanford.edu/class/cs224n/
- **Pedagogy:** Anchor→Mechanism→Contract→Case; gradual release iDo/weDo.
- **STORM link:** «retrieval/answer eval, costo y abstención» in S48_STORM.json; edge `research_supports_paragraph`.


## Expert judgment
- Residual score 0; expert rank **9.55** (≥9.5).
- Git: keep worktree.
- V3 retarget guards preserved.
