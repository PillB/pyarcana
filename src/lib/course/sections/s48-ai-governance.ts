import type { CourseSection } from '../../types'

export const section48: CourseSection = {
  id: "ai-governance",
  index: 48,
  title: "LLM applications y RAG con evidencia",
  shortTitle: "RAG con evidencia",
  tagline: "asistente sobre docs autorizados, citas verificables y abstención cuando retrieval no sostiene la respuesta",
  estimatedHours: 19,
  level: "Master",
  phase: 3,
  icon: "Scale",
  accentColor: "bg-gradient-to-br from-amber-500 to-red-600",
  jobRelevance:
    "En equipos de plataforma y producto, llm applications y rag con evidencia conecta decisiones técnicas con evidencia operativa. La práctica entrega respuesta estructurada con citas verificables o abstención explícita y se promueve solo cuando retrieval y respuesta superan umbrales separados; toda afirmación material apunta a un fragmento permitido.",
  learningOutcomes: [
    { text: "Calcula embeddings y similarity" },
    { text: "Versiona embeddings y evalúa límites" },
    { text: "Chunking con metadata y dedup" },
    { text: "Respeta ACL, deletion y provenance" },
    { text: "Recupera hybrid y rerankea" },
    { text: "Arma contexto con citas y permisos" },
    { text: "Genera structured grounded output" },
    { text: "Evalúa retrieval/answer y se abstiene" },
  ],
  theory: [
    {
      heading: "Ruta de S48: LLM applications y RAG con evidencia",
      paragraphs: [
        "Esta sección parte de S47 y usa únicamente contratos, pruebas y controles ya presentados. El caso `CASO-PUN-048` es sintético y puede ejecutarse sin credenciales ni servicios externos.",
        "Producto incremental: Asistente RAG autorizado y evaluado. Entrada: documentos versionados con ACL, provenance, metadata y solicitud del usuario. Salida: respuesta estructurada con citas verificables o abstención explícita.",
        "La secuencia mantiene liberación gradual: teoría con criterio medible, demo local, ejercicio guiado, validación independiente y transferencia con breach/uncertainty.",
      ],
      callout: {
        type: "info",
        title: "Gate de promoción",
        content: "CP-N4-C · RAG con evidencia y abstención: retrieval y respuesta superan umbrales separados; toda afirmación material apunta a un fragmento permitido. Si falta evidencia, no se promociona.",
      },
    },
    {
      heading: "embeddings y similarity",
      subtopicId: "S48-T1-A",
      paragraphs: [
        "Embeddings aproximan relaciones en un espacio y similarity ordena, no prueba verdad; versión, normalización y métrica forman parte del índice.",
        "Contrato operativo. Entrada: documentos versionados con ACL, provenance, metadata y solicitud del usuario. Salida de este subtema: ranking reproducible con versión de embedding. Error: fragmento sin permiso, evidencia insuficiente, versión borrada o costo excedido impide responder. Criterio de éxito: retrieval y respuesta superan umbrales separados; toda afirmación material apunta a un fragmento permitido.",
        "Aplicación de `embeddings y similarity` al caso peruano sintético `CASO-PUN-048`: documentación sintética autorizada de una cooperativa ficticia en Puno. La evidencia esperada es ranking reproducible con versión de embedding. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "embeddings_similarity.py",
        code: `print(1.0); print(0.0); print("emb_dim", 2)`,
        output: `1.0
0.0
emb_dim 2`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Evidencia mínima de S48-T1-A: ranking reproducible con versión de embedding. Si falta, responde `REJECT_EMBEDDING_RANK`; si no alcanza para decidir, `REVIEW_METRIC_VERSION`.",
      },
    },
    {
      heading: "límites, versiones y evaluación",
      subtopicId: "S48-T1-B",
      paragraphs: [
        "Evalúa recall/precision en tareas reales y slicea errores; cambiar embedding exige baseline, costo y reindexación, no intuición.",
        "Contrato operativo. Entrada: documentos versionados con ACL, provenance, metadata y solicitud del usuario. Salida de este subtema: comparación retenida baseline/candidato. Error: fragmento sin permiso, evidencia insuficiente, versión borrada o costo excedido impide responder. Criterio de éxito: retrieval y respuesta superan umbrales separados; toda afirmación material apunta a un fragmento permitido.",
        "Aplicación de `límites, versiones y evaluación` al caso peruano sintético `CASO-PUN-048`: documentación sintética autorizada de una cooperativa ficticia en Puno. La evidencia esperada es comparación retenida baseline/candidato. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "limits_versions_eval.py",
        code: `print({"version":"e5-v1","max_tokens":512}); print("limit", 512); print("versioned", True)`,
        output: `{'version': 'e5-v1', 'max_tokens': 512}
limit 512
versioned True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Antes de promover S48-T1-B, audita comparación retenida baseline/candidato. Un breach activa `KEEP_EMBEDDING_BASELINE` y una ausencia activa `EVALUATE_ERROR_SLICES`.",
      },
    },
    {
      heading: "chunking, metadata y dedup",
      subtopicId: "S48-T2-A",
      paragraphs: [
        "Chunking sigue unidades semánticas y conserva metadata; dedup por hash/identidad evita evidencia repetida y fuga entre versiones.",
        "Contrato operativo. Entrada: documentos versionados con ACL, provenance, metadata y solicitud del usuario. Salida de este subtema: chunks trazables y sin duplicados. Error: fragmento sin permiso, evidencia insuficiente, versión borrada o costo excedido impide responder. Criterio de éxito: retrieval y respuesta superan umbrales separados; toda afirmación material apunta a un fragmento permitido.",
        "Aplicación de `chunking, metadata y dedup` al caso peruano sintético `CASO-PUN-048`: documentación sintética autorizada de una cooperativa ficticia en Puno. La evidencia esperada es chunks trazables y sin duplicados. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "chunking_metadata_dedup.py",
        code: `print(["abcdefghij","abcdefghij","abcdefghij"]); print("meta", ["doc_id","page"]); print("dedup", "hash")`,
        output: `['abcdefghij', 'abcdefghij', 'abcdefghij']
meta ['doc_id', 'page']
dedup hash`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "La revisión de S48-T2-A conserva chunks trazables y sin duplicados; no conviertas `DEDUP_AND_RECHUNK` ni `RESTORE_CHUNK_METADATA` en éxito silencioso.",
      },
    },
    {
      heading: "ACL, deletion y provenance",
      subtopicId: "S48-T2-B",
      paragraphs: [
        "ACL se filtra antes de retrieval/rerank; deletion invalida índice/cache y provenance enlaza cada chunk a documento y versión.",
        "Contrato operativo. Entrada: documentos versionados con ACL, provenance, metadata y solicitud del usuario. Salida de este subtema: usuario sin permiso recupera cero fragmentos. Error: fragmento sin permiso, evidencia insuficiente, versión borrada o costo excedido impide responder. Criterio de éxito: retrieval y respuesta superan umbrales separados; toda afirmación material apunta a un fragmento permitido.",
        "Aplicación de `ACL, deletion y provenance` al caso peruano sintético `CASO-PUN-048`: documentación sintética autorizada de una cooperativa ficticia en Puno. La evidencia esperada es usuario sin permiso recupera cero fragmentos. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "acl_deletion_provenance.py",
        code: `print(True); print(False); print("delete", "tombstone")`,
        output: `True
False
delete tombstone`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Contrato S48-T2-B: demuestra usuario sin permiso recupera cero fragmentos. Falla cerrada con `FILTER_OR_DELETE_CHUNK` y deriva incertidumbre mediante `VERIFY_ACL_PROVENANCE`.",
      },
    },
    {
      heading: "lexical/vector/hybrid y reranking",
      subtopicId: "S48-T3-A",
      paragraphs: [
        "Lexical captura términos exactos, vector semántica y hybrid combina scores calibrados; rerank opera solo sobre candidatos permitidos.",
        "Contrato operativo. Entrada: documentos versionados con ACL, provenance, metadata y solicitud del usuario. Salida de este subtema: recall mejora sin romper ACL. Error: fragmento sin permiso, evidencia insuficiente, versión borrada o costo excedido impide responder. Criterio de éxito: retrieval y respuesta superan umbrales separados; toda afirmación material apunta a un fragmento permitido.",
        "Aplicación de `lexical/vector/hybrid y reranking` al caso peruano sintético `CASO-PUN-048`: documentación sintética autorizada de una cooperativa ficticia en Puno. La evidencia esperada es recall mejora sin romper ACL. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "lexical_vector_hybrid_rerank.py",
        code: `print({"d1":0.74,"d2":0.06}); print("rerank", "weighted_dense_lexical"); print("mode", "hybrid")`,
        output: `{'d1': 0.74, 'd2': 0.06}
rerank weighted_dense_lexical
mode hybrid`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Para S48-T3-A, el artefacto comprobable es recall mejora sin romper ACL. Sin él corresponde `RECALIBRATE_HYBRID_RANK` o, si faltan datos, `REVIEW_RERANK_CANDIDATES`.",
      },
    },
    {
      heading: "contexto, citas y permisos",
      subtopicId: "S48-T3-B",
      paragraphs: [
        "Contexto incluye fragmentos mínimos, citas y límites; una cita debe resolver a texto/ver­sión accesible por el solicitante.",
        "Contrato operativo. Entrada: documentos versionados con ACL, provenance, metadata y solicitud del usuario. Salida de este subtema: cada afirmación material tiene cita autorizada. Error: fragmento sin permiso, evidencia insuficiente, versión borrada o costo excedido impide responder. Criterio de éxito: retrieval y respuesta superan umbrales separados; toda afirmación material apunta a un fragmento permitido.",
        "Aplicación de `contexto, citas y permisos` al caso peruano sintético `CASO-PUN-048`: documentación sintética autorizada de una cooperativa ficticia en Puno. La evidencia esperada es cada afirmación material tiene cita autorizada. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "context_cites_permissions.py",
        code: `print("[c1] SLA 300ms"); print("perm_filter", True); print("min_ctx", True)`,
        output: `[c1] SLA 300ms
perm_filter True
min_ctx True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Promoción de S48-T3-B: prueba cada afirmación material tiene cita autorizada y registra por separado `ABSTAIN_UNCITED` (breach) y `REQUEST_AUTHORIZED_CONTEXT` (missing).",
      },
    },
    {
      heading: "structured output y grounding",
      subtopicId: "S48-T4-A",
      paragraphs: [
        "Structured output se valida contra schema; grounding limita afirmaciones a evidencia y separa instrucciones del usuario del contenido recuperado.",
        "Contrato operativo. Entrada: documentos versionados con ACL, provenance, metadata y solicitud del usuario. Salida de este subtema: schema válido y evidence ids presentes. Error: fragmento sin permiso, evidencia insuficiente, versión borrada o costo excedido impide responder. Criterio de éxito: retrieval y respuesta superan umbrales separados; toda afirmación material apunta a un fragmento permitido.",
        "Aplicación de `structured output y grounding` al caso peruano sintético `CASO-PUN-048`: documentación sintética autorizada de una cooperativa ficticia en Puno. La evidencia esperada es schema válido y evidence ids presentes. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "structured_grounding.py",
        code: `print(True); print(False); print("json", True)`,
        output: `True
False
json True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "El dueño de S48-T4-A acepta solo schema válido y evidence ids presentes; una violación produce `REJECT_UNGROUNDED_OUTPUT` y un registro incompleto produce `VALIDATE_OUTPUT_SCHEMA`.",
      },
    },
    {
      heading: "retrieval/answer eval, costo y abstención",
      subtopicId: "S48-T4-B",
      paragraphs: [
        "Retrieval eval y answer eval son gates separados; costo/latencia tienen presupuesto y la abstención es éxito cuando falta soporte.",
        "Contrato operativo. Entrada: documentos versionados con ACL, provenance, metadata y solicitud del usuario. Salida de este subtema: respuesta no soportada se abstiene. Error: fragmento sin permiso, evidencia insuficiente, versión borrada o costo excedido impide responder. Criterio de éxito: retrieval y respuesta superan umbrales separados; toda afirmación material apunta a un fragmento permitido.",
        "Aplicación de `retrieval/answer eval, costo y abstención` al caso peruano sintético `CASO-PUN-048`: documentación sintética autorizada de una cooperativa ficticia en Puno. La evidencia esperada es respuesta no soportada se abstiene. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "retrieval_answer_eval_cost_abstain.py",
        code: `print("answer"); print("abstain"); print("cost_tokens", 1200)`,
        output: `answer
abstain
cost_tokens 1200`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Cierre de S48-T4-B: conserva respuesta no soportada se abstiene, la evidencia de `ABSTAIN_WITH_REASON` y la ruta humana `TUNE_RETRIEVAL_OR_BUDGET`.",
      },
    },
  ],
  iDo: {
    intro: "Te muestro 8 demos de S48 (LLM applications y RAG con evidencia) alineadas a CP-N4-C (inicio).",
    steps: [
      {
        demoId: "S48-T1-A-DEMO",
        subtopicId: "S48-T1-A",
        environment: "local-python",
        description: "Demo: embeddings y similarity",
        code: {
          language: 'python',
          title: "demo_embeddings_similarity.py",
          code: `print("sim", "cosine"); print("space", "unit"); print("synth_docs", True)`,
          output: `sim cosine
space unit
synth_docs True`,
        },
        why: "Hace observable `embeddings y similarity` con un caso local pequeño y deja como evidencia ranking reproducible con versión de embedding; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S48-T1-B-DEMO",
        subtopicId: "S48-T1-B",
        environment: "local-python",
        description: "Demo: límites, versiones y evaluación",
        code: {
          language: 'python',
          title: "demo_limits_versions_eval.py",
          code: `print("eval", "nDCG@10"); print("version", "e5-v1"); print("regression_suite", True)`,
          output: `eval nDCG@10
version e5-v1
regression_suite True`,
        },
        why: "Hace observable `límites, versiones y evaluación` con un caso local pequeño y deja como evidencia comparación retenida baseline/candidato; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S48-T2-A-DEMO",
        subtopicId: "S48-T2-A",
        environment: "local-python",
        description: "Demo: chunking, metadata y dedup",
        code: {
          language: 'python',
          title: "demo_chunking_metadata_dedup.py",
          code: `print("chunk_n", 3); print("overlap", "optional"); print("dedup_key", "sha1")`,
          output: `chunk_n 3
overlap optional
dedup_key sha1`,
        },
        why: "Hace observable `chunking, metadata y dedup` con un caso local pequeño y deja como evidencia chunks trazables y sin duplicados; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S48-T2-B-DEMO",
        subtopicId: "S48-T2-B",
        environment: "local-python",
        description: "Demo: ACL, deletion y provenance",
        code: {
          language: 'python',
          title: "demo_acl_deletion_provenance.py",
          code: `print("provenance", "doc_version"); print("acl_enforce", True); print("hard_delete", "policy")`,
          output: `provenance doc_version
acl_enforce True
hard_delete policy`,
        },
        why: "Hace observable `ACL, deletion y provenance` con un caso local pequeño y deja como evidencia usuario sin permiso recupera cero fragmentos; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S48-T3-A-DEMO",
        subtopicId: "S48-T3-A",
        environment: "local-python",
        description: "Demo: lexical/vector/hybrid y reranking",
        code: {
          language: 'python',
          title: "demo_lexical_vector_hybrid_rerank.py",
          code: `print("lexical", "bm25_like"); print("vector", "cosine"); print("fuse", "linear")`,
          output: `lexical bm25_like
vector cosine
fuse linear`,
        },
        why: "Hace observable `lexical/vector/hybrid y reranking` con un caso local pequeño y deja como evidencia recall mejora sin romper ACL; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S48-T3-B-DEMO",
        subtopicId: "S48-T3-B",
        environment: "local-python",
        description: "Demo: contexto, citas y permisos",
        code: {
          language: 'python',
          title: "demo_context_cites_permissions.py",
          code: `print("cites", True); print("drop_denied", True); print("context_budget", 2)`,
          output: `cites True
drop_denied True
context_budget 2`,
        },
        why: "Hace observable `contexto, citas y permisos` con un caso local pequeño y deja como evidencia cada afirmación material tiene cita autorizada; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S48-T4-A-DEMO",
        subtopicId: "S48-T4-A",
        environment: "local-python",
        description: "Demo: structured output y grounding",
        code: {
          language: 'python',
          title: "demo_structured_grounding.py",
          code: `print("structured", {"decision":"ok","cites":["c1"]}); print("grounded", True); print("schema", True)`,
          output: `structured {'decision': 'ok', 'cites': ['c1']}
grounded True
schema True`,
        },
        why: "Hace observable `structured output y grounding` con un caso local pequeño y deja como evidencia schema válido y evidence ids presentes; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S48-T4-B-DEMO",
        subtopicId: "S48-T4-B",
        environment: "local-python",
        description: "Demo: retrieval/answer eval, costo y abstención",
        code: {
          language: 'python',
          title: "demo_retrieval_answer_eval_cost_abstain.py",
          code: `print("eval", "answer_faithfulness"); print("abstain", True); print("cost_cap", True)`,
          output: `eval answer_faithfulness
abstain True
cost_cap True`,
        },
        why: "Hace observable `retrieval/answer eval, costo y abstención` con un caso local pequeño y deja como evidencia respuesta no soportada se abstiene; el demo modela el contrato, no un servicio externo.",
      },
    ],
  },
  weDo: {
    intro: "S48 · Laboratorio Asistente RAG autorizado y evaluado: 24 retos locales. E1 repara una operación de dominio, E2 separa valid/invalid/missing y E3 demuestra recuperación fail-closed con ocho fixtures peruanos sintéticos distintos.",
    steps: [
      {
        id: "S48-T1-A-E1",
        subtopicId: "S48-T1-A",
        kind: "guided",
        instruction: "S48-T1-A-E1 · Calcula el contrato de `embeddings y similarity` sobre `CASO-PUN-048-1A`. La entrada es el dict completo del starter; la operación debe demostrar top por dot product y versión embedding explícita. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S48-T1-A PASS`; la misma operación sobre el fixture adverso debe activar `REJECT_EMBEDDING_RANK` en E2.",
        hint: "Relaciona los campos `query`, `docs`, `metric`, `version`, `expected_top` con la regla explicada en S48-T1-A.",
        hints: [
          "Relaciona los campos `query`, `docs`, `metric`, `version`, `expected_top` con la regla explicada en S48-T1-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva ranking reproducible con versión de embedding; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta expected_top", "fixture adverso: top por dot product y versión embedding explícita", "CASO-PUN-048-1A es sintético"],
        tests: "El fixture `CASO-PUN-048-1A` satisface un predicado de dominio real; imprime `S48-T1-A PASS` y el assert booleano pasa.",
        feedback: "S48-T1-A-E1: explica qué campo cambió la decisión, por qué el adverso activa REJECT_EMBEDDING_RANK y por qué faltar expected_top exige REVIEW_METRIC_VERSION.",
        starterCode: {
          language: 'python',
          title: "s48-t1-a-e1.py",
          code: `record = {"case_id": "CASO-PUN-048-1A", **{"query":[1.0,0.0],"docs":{"d1":[0.8,0.2],"d2":[0.1,0.9]},"metric":"dot","version":"emb-v2","expected_top":"d1"}}
meets_contract = min(record["docs"], key=lambda k: sum(a*b for a,b in zip(record["query"],record["docs"][k]))) == record["expected_top"]
status = "PASS" if meets_contract else "REJECT_EMBEDDING_RANK"
print("S48-T1-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s48-t1-a-e1.py",
          code: `record = {"case_id": "CASO-PUN-048-1A", **{"query":[1.0,0.0],"docs":{"d1":[0.8,0.2],"d2":[0.1,0.9]},"metric":"dot","version":"emb-v2","expected_top":"d1"}}
meets_contract = max(record["docs"], key=lambda k: sum(a*b for a,b in zip(record["query"],record["docs"][k]))) == record["expected_top"] and record["version"] == "emb-v2"
status = "PASS" if meets_contract else "REJECT_EMBEDDING_RANK"
print("S48-T1-A", status)
assert meets_contract is True` ,
          output: `S48-T1-A PASS` ,
        },
      },
      {
        id: "S48-T1-A-E2",
        subtopicId: "S48-T1-A",
        kind: "independent",
        instruction: "S48-T1-A-E2 · Modela tres rutas de `embeddings y similarity`: fixture válido, fixture adverso y registro sin `expected_top`. Entrada: dict con case_id, query, docs, metric, version, expected_top. Salidas exactas: `PASS`, `REJECT_EMBEDDING_RANK`, `MISSING:expected_top`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a expected_top debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a expected_top debe ocurrir antes de esa rama.",
          "Después aplica la regla de S48-T1-A: top por dot product y versión embedding explícita. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta expected_top", "fixture adverso: top por dot product y versión embedding explícita", "CASO-PUN-048-1A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `expected_top` ausente y produce exactamente `PASS REJECT_EMBEDDING_RANK MISSING:expected_top`.",
        feedback: "S48-T1-A-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_EMBEDDING_RANK y por qué faltar expected_top exige REVIEW_METRIC_VERSION.",
        starterCode: {
          language: 'python',
          title: "s48-t1-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "query", "docs", "metric", "version", "expected_top"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if min(record["docs"], key=lambda k: sum(a*b for a,b in zip(record["query"],record["docs"][k]))) == record["expected_top"] else "REJECT_EMBEDDING_RANK"

valid = {"case_id": "CASO-PUN-048-1A", **{"query":[1.0,0.0],"docs":{"d1":[0.8,0.2],"d2":[0.1,0.9]},"metric":"dot","version":"emb-v2","expected_top":"d1"}}
invalid = {"case_id": "CASO-PUN-048-1A", **{"query":[1.0,0.0],"docs":{"d1":[0.8,0.2],"d2":[0.1,0.9]},"metric":"unknown","version":"","expected_top":"d2"}}
incomplete = {**valid}
incomplete.pop("expected_top")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s48-t1-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "query", "docs", "metric", "version", "expected_top"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if max(record["docs"], key=lambda k: sum(a*b for a,b in zip(record["query"],record["docs"][k]))) == record["expected_top"] and record["version"] == "emb-v2" else "REJECT_EMBEDDING_RANK"

valid = {"case_id": "CASO-PUN-048-1A", **{"query":[1.0,0.0],"docs":{"d1":[0.8,0.2],"d2":[0.1,0.9]},"metric":"dot","version":"emb-v2","expected_top":"d1"}}
invalid = {"case_id": "CASO-PUN-048-1A", **{"query":[1.0,0.0],"docs":{"d1":[0.8,0.2],"d2":[0.1,0.9]},"metric":"unknown","version":"","expected_top":"d2"}}
incomplete = {**valid}
incomplete.pop("expected_top")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REJECT_EMBEDDING_RANK MISSING:expected_top` ,
        },
      },
      {
        id: "S48-T1-A-E3",
        subtopicId: "S48-T1-A",
        kind: "transfer",
        instruction: "S48-T1-A-E3 · Simula fallo cerrado para `embeddings y similarity` con tres fixtures distintos. `CASO-PUN-048-1A` debe continuar, el adverso debe devolver `REJECT_EMBEDDING_RANK` y la ausencia de `expected_top` debe devolver `REVIEW_METRIC_VERSION`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REVIEW_METRIC_VERSION` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REVIEW_METRIC_VERSION` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró top por dot product y versión embedding explícita; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta expected_top", "fixture adverso: top por dot product y versión embedding explícita", "CASO-PUN-048-1A es sintético"],
        tests: "Fixtures `CASO-PUN-048-1A`, adverso y sin `expected_top` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S48-T1-A-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_EMBEDDING_RANK y por qué faltar expected_top exige REVIEW_METRIC_VERSION.",
        starterCode: {
          language: 'python',
          title: "s48-t1-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "query", "docs", "metric", "version", "expected_top"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if min(record["docs"], key=lambda k: sum(a*b for a,b in zip(record["query"],record["docs"][k]))) == record["expected_top"] else "REJECT_EMBEDDING_RANK"

valid = {"case_id": "CASO-PUN-048-1A", **{"query":[1.0,0.0],"docs":{"d1":[0.8,0.2],"d2":[0.1,0.9]},"metric":"dot","version":"emb-v2","expected_top":"d1"}}
invalid = {"case_id": "CASO-PUN-048-1A", **{"query":[1.0,0.0],"docs":{"d1":[0.8,0.2],"d2":[0.1,0.9]},"metric":"unknown","version":"","expected_top":"d2"}}
uncertain = {**valid}
uncertain.pop("expected_top")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s48-t1-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "query", "docs", "metric", "version", "expected_top"}
    missing = sorted(required - record.keys())
    if missing:
        return "REVIEW_METRIC_VERSION"
    return "CONTINUE" if max(record["docs"], key=lambda k: sum(a*b for a,b in zip(record["query"],record["docs"][k]))) == record["expected_top"] and record["version"] == "emb-v2" else "REJECT_EMBEDDING_RANK"

valid = {"case_id": "CASO-PUN-048-1A", **{"query":[1.0,0.0],"docs":{"d1":[0.8,0.2],"d2":[0.1,0.9]},"metric":"dot","version":"emb-v2","expected_top":"d1"}}
invalid = {"case_id": "CASO-PUN-048-1A", **{"query":[1.0,0.0],"docs":{"d1":[0.8,0.2],"d2":[0.1,0.9]},"metric":"unknown","version":"","expected_top":"d2"}}
uncertain = {**valid}
uncertain.pop("expected_top")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_EMBEDDING_RANK", "REVIEW_METRIC_VERSION"]` ,
          output: `CONTINUE REJECT_EMBEDDING_RANK REVIEW_METRIC_VERSION` ,
        },
      },
      {
        id: "S48-T1-B-E1",
        subtopicId: "S48-T1-B",
        kind: "guided",
        instruction: "S48-T1-B-E1 · Compara el contrato de `límites, versiones y evaluación` sobre `CASO-PUN-048-1B`. La entrada es el dict completo del starter; la operación debe demostrar recall holdout mejora y costo de reindexación acotado. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S48-T1-B PASS`; la misma operación sobre el fixture adverso debe activar `KEEP_EMBEDDING_BASELINE` en E2.",
        hint: "Relaciona los campos `baseline_recall`, `candidate_recall`, `min_recall`, `holdout`, `reindex_cost_pen` con la regla explicada en S48-T1-B.",
        hints: [
          "Relaciona los campos `baseline_recall`, `candidate_recall`, `min_recall`, `holdout`, `reindex_cost_pen` con la regla explicada en S48-T1-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva comparación retenida baseline/candidato; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta reindex_cost_pen", "fixture adverso: recall holdout mejora y costo de reindexación acotado", "CASO-PUN-048-1B es sintético"],
        tests: "El fixture `CASO-PUN-048-1B` satisface un predicado de dominio real; imprime `S48-T1-B PASS` y el assert booleano pasa.",
        feedback: "S48-T1-B-E1: explica qué campo cambió la decisión, por qué el adverso activa KEEP_EMBEDDING_BASELINE y por qué faltar reindex_cost_pen exige EVALUATE_ERROR_SLICES.",
        starterCode: {
          language: 'python',
          title: "s48-t1-b-e1.py",
          code: `record = {"case_id": "CASO-PUN-048-1B", **{"baseline_recall":0.72,"candidate_recall":0.81,"min_recall":0.78,"holdout":"rag-holdout-v1","reindex_cost_pen":30}}
meets_contract = record["candidate_recall"] < record["baseline_recall"] or not record["holdout"]
status = "PASS" if meets_contract else "KEEP_EMBEDDING_BASELINE"
print("S48-T1-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s48-t1-b-e1.py",
          code: `record = {"case_id": "CASO-PUN-048-1B", **{"baseline_recall":0.72,"candidate_recall":0.81,"min_recall":0.78,"holdout":"rag-holdout-v1","reindex_cost_pen":30}}
meets_contract = record["candidate_recall"] >= record["min_recall"] and record["candidate_recall"] > record["baseline_recall"] and record["holdout"].startswith("rag-holdout-") and record["reindex_cost_pen"] <= 50
status = "PASS" if meets_contract else "KEEP_EMBEDDING_BASELINE"
print("S48-T1-B", status)
assert meets_contract is True` ,
          output: `S48-T1-B PASS` ,
        },
      },
      {
        id: "S48-T1-B-E2",
        subtopicId: "S48-T1-B",
        kind: "independent",
        instruction: "S48-T1-B-E2 · Verifica tres rutas de `límites, versiones y evaluación`: fixture válido, fixture adverso y registro sin `reindex_cost_pen`. Entrada: dict con case_id, baseline_recall, candidate_recall, min_recall, holdout, reindex_cost_pen. Salidas exactas: `PASS`, `KEEP_EMBEDDING_BASELINE`, `MISSING:reindex_cost_pen`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a reindex_cost_pen debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a reindex_cost_pen debe ocurrir antes de esa rama.",
          "Después aplica la regla de S48-T1-B: recall holdout mejora y costo de reindexación acotado. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta reindex_cost_pen", "fixture adverso: recall holdout mejora y costo de reindexación acotado", "CASO-PUN-048-1B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `reindex_cost_pen` ausente y produce exactamente `PASS KEEP_EMBEDDING_BASELINE MISSING:reindex_cost_pen`.",
        feedback: "S48-T1-B-E2: explica qué campo cambió la decisión, por qué el adverso activa KEEP_EMBEDDING_BASELINE y por qué faltar reindex_cost_pen exige EVALUATE_ERROR_SLICES.",
        starterCode: {
          language: 'python',
          title: "s48-t1-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "baseline_recall", "candidate_recall", "min_recall", "holdout", "reindex_cost_pen"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["candidate_recall"] < record["baseline_recall"] or not record["holdout"] else "KEEP_EMBEDDING_BASELINE"

valid = {"case_id": "CASO-PUN-048-1B", **{"baseline_recall":0.72,"candidate_recall":0.81,"min_recall":0.78,"holdout":"rag-holdout-v1","reindex_cost_pen":30}}
invalid = {"case_id": "CASO-PUN-048-1B", **{"baseline_recall":0.72,"candidate_recall":0.6,"min_recall":0.78,"holdout":"train","reindex_cost_pen":300}}
incomplete = {**valid}
incomplete.pop("reindex_cost_pen")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s48-t1-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "baseline_recall", "candidate_recall", "min_recall", "holdout", "reindex_cost_pen"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["candidate_recall"] >= record["min_recall"] and record["candidate_recall"] > record["baseline_recall"] and record["holdout"].startswith("rag-holdout-") and record["reindex_cost_pen"] <= 50 else "KEEP_EMBEDDING_BASELINE"

valid = {"case_id": "CASO-PUN-048-1B", **{"baseline_recall":0.72,"candidate_recall":0.81,"min_recall":0.78,"holdout":"rag-holdout-v1","reindex_cost_pen":30}}
invalid = {"case_id": "CASO-PUN-048-1B", **{"baseline_recall":0.72,"candidate_recall":0.6,"min_recall":0.78,"holdout":"train","reindex_cost_pen":300}}
incomplete = {**valid}
incomplete.pop("reindex_cost_pen")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS KEEP_EMBEDDING_BASELINE MISSING:reindex_cost_pen` ,
        },
      },
      {
        id: "S48-T1-B-E3",
        subtopicId: "S48-T1-B",
        kind: "transfer",
        instruction: "S48-T1-B-E3 · Extiende fallo cerrado para `límites, versiones y evaluación` con tres fixtures distintos. `CASO-PUN-048-1B` debe continuar, el adverso debe devolver `KEEP_EMBEDDING_BASELINE` y la ausencia de `reindex_cost_pen` debe devolver `EVALUATE_ERROR_SLICES`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `EVALUATE_ERROR_SLICES` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `EVALUATE_ERROR_SLICES` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró recall holdout mejora y costo de reindexación acotado; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta reindex_cost_pen", "fixture adverso: recall holdout mejora y costo de reindexación acotado", "CASO-PUN-048-1B es sintético"],
        tests: "Fixtures `CASO-PUN-048-1B`, adverso y sin `reindex_cost_pen` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S48-T1-B-E3: explica qué campo cambió la decisión, por qué el adverso activa KEEP_EMBEDDING_BASELINE y por qué faltar reindex_cost_pen exige EVALUATE_ERROR_SLICES.",
        starterCode: {
          language: 'python',
          title: "s48-t1-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "baseline_recall", "candidate_recall", "min_recall", "holdout", "reindex_cost_pen"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["candidate_recall"] < record["baseline_recall"] or not record["holdout"] else "KEEP_EMBEDDING_BASELINE"

valid = {"case_id": "CASO-PUN-048-1B", **{"baseline_recall":0.72,"candidate_recall":0.81,"min_recall":0.78,"holdout":"rag-holdout-v1","reindex_cost_pen":30}}
invalid = {"case_id": "CASO-PUN-048-1B", **{"baseline_recall":0.72,"candidate_recall":0.6,"min_recall":0.78,"holdout":"train","reindex_cost_pen":300}}
uncertain = {**valid}
uncertain.pop("reindex_cost_pen")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s48-t1-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "baseline_recall", "candidate_recall", "min_recall", "holdout", "reindex_cost_pen"}
    missing = sorted(required - record.keys())
    if missing:
        return "EVALUATE_ERROR_SLICES"
    return "CONTINUE" if record["candidate_recall"] >= record["min_recall"] and record["candidate_recall"] > record["baseline_recall"] and record["holdout"].startswith("rag-holdout-") and record["reindex_cost_pen"] <= 50 else "KEEP_EMBEDDING_BASELINE"

valid = {"case_id": "CASO-PUN-048-1B", **{"baseline_recall":0.72,"candidate_recall":0.81,"min_recall":0.78,"holdout":"rag-holdout-v1","reindex_cost_pen":30}}
invalid = {"case_id": "CASO-PUN-048-1B", **{"baseline_recall":0.72,"candidate_recall":0.6,"min_recall":0.78,"holdout":"train","reindex_cost_pen":300}}
uncertain = {**valid}
uncertain.pop("reindex_cost_pen")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "KEEP_EMBEDDING_BASELINE", "EVALUATE_ERROR_SLICES"]` ,
          output: `CONTINUE KEEP_EMBEDDING_BASELINE EVALUATE_ERROR_SLICES` ,
        },
      },
      {
        id: "S48-T2-A-E1",
        subtopicId: "S48-T2-A",
        kind: "guided",
        instruction: "S48-T2-A-E1 · Filtra el contrato de `chunking, metadata y dedup` sobre `CASO-PUN-048-2A`. La entrada es el dict completo del starter; la operación debe demostrar hashes únicos, metadata y source version. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S48-T2-A PASS`; la misma operación sobre el fixture adverso debe activar `DEDUP_AND_RECHUNK` en E2.",
        hint: "Relaciona los campos `chunks`, `unique_hashes`, `source_version` con la regla explicada en S48-T2-A.",
        hints: [
          "Relaciona los campos `chunks`, `unique_hashes`, `source_version` con la regla explicada en S48-T2-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva chunks trazables y sin duplicados; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta source_version", "fixture adverso: hashes únicos, metadata y source version", "CASO-PUN-048-2A es sintético"],
        tests: "El fixture `CASO-PUN-048-2A` satisface un predicado de dominio real; imprime `S48-T2-A PASS` y el assert booleano pasa.",
        feedback: "S48-T2-A-E1: explica qué campo cambió la decisión, por qué el adverso activa DEDUP_AND_RECHUNK y por qué faltar source_version exige RESTORE_CHUNK_METADATA.",
        starterCode: {
          language: 'python',
          title: "s48-t2-a-e1.py",
          code: `record = {"case_id": "CASO-PUN-048-2A", **{"chunks":[{"id":"d1#1","hash":"a","section":"policy"},{"id":"d1#2","hash":"b","section":"limits"}],"unique_hashes":2,"source_version":"d1-v3"}}
meets_contract = len({c["hash"] for c in record["chunks"]}) < len(record["chunks"])
status = "PASS" if meets_contract else "DEDUP_AND_RECHUNK"
print("S48-T2-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s48-t2-a-e1.py",
          code: `record = {"case_id": "CASO-PUN-048-2A", **{"chunks":[{"id":"d1#1","hash":"a","section":"policy"},{"id":"d1#2","hash":"b","section":"limits"}],"unique_hashes":2,"source_version":"d1-v3"}}
meets_contract = len({c["hash"] for c in record["chunks"]}) == record["unique_hashes"] and all(c.get("section") for c in record["chunks"]) and record["source_version"].endswith("-v3")
status = "PASS" if meets_contract else "DEDUP_AND_RECHUNK"
print("S48-T2-A", status)
assert meets_contract is True` ,
          output: `S48-T2-A PASS` ,
        },
      },
      {
        id: "S48-T2-A-E2",
        subtopicId: "S48-T2-A",
        kind: "independent",
        instruction: "S48-T2-A-E2 · Clasifica tres rutas de `chunking, metadata y dedup`: fixture válido, fixture adverso y registro sin `source_version`. Entrada: dict con case_id, chunks, unique_hashes, source_version. Salidas exactas: `PASS`, `DEDUP_AND_RECHUNK`, `MISSING:source_version`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a source_version debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a source_version debe ocurrir antes de esa rama.",
          "Después aplica la regla de S48-T2-A: hashes únicos, metadata y source version. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta source_version", "fixture adverso: hashes únicos, metadata y source version", "CASO-PUN-048-2A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `source_version` ausente y produce exactamente `PASS DEDUP_AND_RECHUNK MISSING:source_version`.",
        feedback: "S48-T2-A-E2: explica qué campo cambió la decisión, por qué el adverso activa DEDUP_AND_RECHUNK y por qué faltar source_version exige RESTORE_CHUNK_METADATA.",
        starterCode: {
          language: 'python',
          title: "s48-t2-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "chunks", "unique_hashes", "source_version"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if len({c["hash"] for c in record["chunks"]}) < len(record["chunks"]) else "DEDUP_AND_RECHUNK"

valid = {"case_id": "CASO-PUN-048-2A", **{"chunks":[{"id":"d1#1","hash":"a","section":"policy"},{"id":"d1#2","hash":"b","section":"limits"}],"unique_hashes":2,"source_version":"d1-v3"}}
invalid = {"case_id": "CASO-PUN-048-2A", **{"chunks":[{"id":"d1#1","hash":"a","section":""},{"id":"d1#2","hash":"a","section":""}],"unique_hashes":2,"source_version":"latest"}}
incomplete = {**valid}
incomplete.pop("source_version")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s48-t2-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "chunks", "unique_hashes", "source_version"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if len({c["hash"] for c in record["chunks"]}) == record["unique_hashes"] and all(c.get("section") for c in record["chunks"]) and record["source_version"].endswith("-v3") else "DEDUP_AND_RECHUNK"

valid = {"case_id": "CASO-PUN-048-2A", **{"chunks":[{"id":"d1#1","hash":"a","section":"policy"},{"id":"d1#2","hash":"b","section":"limits"}],"unique_hashes":2,"source_version":"d1-v3"}}
invalid = {"case_id": "CASO-PUN-048-2A", **{"chunks":[{"id":"d1#1","hash":"a","section":""},{"id":"d1#2","hash":"a","section":""}],"unique_hashes":2,"source_version":"latest"}}
incomplete = {**valid}
incomplete.pop("source_version")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS DEDUP_AND_RECHUNK MISSING:source_version` ,
        },
      },
      {
        id: "S48-T2-A-E3",
        subtopicId: "S48-T2-A",
        kind: "transfer",
        instruction: "S48-T2-A-E3 · Defiende fallo cerrado para `chunking, metadata y dedup` con tres fixtures distintos. `CASO-PUN-048-2A` debe continuar, el adverso debe devolver `DEDUP_AND_RECHUNK` y la ausencia de `source_version` debe devolver `RESTORE_CHUNK_METADATA`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `RESTORE_CHUNK_METADATA` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `RESTORE_CHUNK_METADATA` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró hashes únicos, metadata y source version; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta source_version", "fixture adverso: hashes únicos, metadata y source version", "CASO-PUN-048-2A es sintético"],
        tests: "Fixtures `CASO-PUN-048-2A`, adverso y sin `source_version` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S48-T2-A-E3: explica qué campo cambió la decisión, por qué el adverso activa DEDUP_AND_RECHUNK y por qué faltar source_version exige RESTORE_CHUNK_METADATA.",
        starterCode: {
          language: 'python',
          title: "s48-t2-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "chunks", "unique_hashes", "source_version"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if len({c["hash"] for c in record["chunks"]}) < len(record["chunks"]) else "DEDUP_AND_RECHUNK"

valid = {"case_id": "CASO-PUN-048-2A", **{"chunks":[{"id":"d1#1","hash":"a","section":"policy"},{"id":"d1#2","hash":"b","section":"limits"}],"unique_hashes":2,"source_version":"d1-v3"}}
invalid = {"case_id": "CASO-PUN-048-2A", **{"chunks":[{"id":"d1#1","hash":"a","section":""},{"id":"d1#2","hash":"a","section":""}],"unique_hashes":2,"source_version":"latest"}}
uncertain = {**valid}
uncertain.pop("source_version")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s48-t2-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "chunks", "unique_hashes", "source_version"}
    missing = sorted(required - record.keys())
    if missing:
        return "RESTORE_CHUNK_METADATA"
    return "CONTINUE" if len({c["hash"] for c in record["chunks"]}) == record["unique_hashes"] and all(c.get("section") for c in record["chunks"]) and record["source_version"].endswith("-v3") else "DEDUP_AND_RECHUNK"

valid = {"case_id": "CASO-PUN-048-2A", **{"chunks":[{"id":"d1#1","hash":"a","section":"policy"},{"id":"d1#2","hash":"b","section":"limits"}],"unique_hashes":2,"source_version":"d1-v3"}}
invalid = {"case_id": "CASO-PUN-048-2A", **{"chunks":[{"id":"d1#1","hash":"a","section":""},{"id":"d1#2","hash":"a","section":""}],"unique_hashes":2,"source_version":"latest"}}
uncertain = {**valid}
uncertain.pop("source_version")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "DEDUP_AND_RECHUNK", "RESTORE_CHUNK_METADATA"]` ,
          output: `CONTINUE DEDUP_AND_RECHUNK RESTORE_CHUNK_METADATA` ,
        },
      },
      {
        id: "S48-T2-B-E1",
        subtopicId: "S48-T2-B",
        kind: "guided",
        instruction: "S48-T2-B-E1 · Modela el contrato de `ACL, deletion y provenance` sobre `CASO-PUN-048-2B`. La entrada es el dict completo del starter; la operación debe demostrar ACL intersecta, documento activo y cache coherente. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S48-T2-B PASS`; la misma operación sobre el fixture adverso debe activar `FILTER_OR_DELETE_CHUNK` en E2.",
        hint: "Relaciona los campos `user_acl`, `chunk_acl`, `deleted`, `provenance`, `cache_invalidated` con la regla explicada en S48-T2-B.",
        hints: [
          "Relaciona los campos `user_acl`, `chunk_acl`, `deleted`, `provenance`, `cache_invalidated` con la regla explicada en S48-T2-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva usuario sin permiso recupera cero fragmentos; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta cache_invalidated", "fixture adverso: ACL intersecta, documento activo y cache coherente", "CASO-PUN-048-2B es sintético"],
        tests: "El fixture `CASO-PUN-048-2B` satisface un predicado de dominio real; imprime `S48-T2-B PASS` y el assert booleano pasa.",
        feedback: "S48-T2-B-E1: explica qué campo cambió la decisión, por qué el adverso activa FILTER_OR_DELETE_CHUNK y por qué faltar cache_invalidated exige VERIFY_ACL_PROVENANCE.",
        starterCode: {
          language: 'python',
          title: "s48-t2-b-e1.py",
          code: `record = {"case_id": "CASO-PUN-048-2B", **{"user_acl":{"public","ops"},"chunk_acl":{"ops"},"deleted":False,"provenance":"doc-7-v2","cache_invalidated":True}}
meets_contract = not bool(record["user_acl"] & record["chunk_acl"]) or record["deleted"]
status = "PASS" if meets_contract else "FILTER_OR_DELETE_CHUNK"
print("S48-T2-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s48-t2-b-e1.py",
          code: `record = {"case_id": "CASO-PUN-048-2B", **{"user_acl":{"public","ops"},"chunk_acl":{"ops"},"deleted":False,"provenance":"doc-7-v2","cache_invalidated":True}}
meets_contract = bool(record["user_acl"] & record["chunk_acl"]) and not record["deleted"] and record["provenance"].startswith("doc-") and record["cache_invalidated"]
status = "PASS" if meets_contract else "FILTER_OR_DELETE_CHUNK"
print("S48-T2-B", status)
assert meets_contract is True` ,
          output: `S48-T2-B PASS` ,
        },
      },
      {
        id: "S48-T2-B-E2",
        subtopicId: "S48-T2-B",
        kind: "independent",
        instruction: "S48-T2-B-E2 · Audita tres rutas de `ACL, deletion y provenance`: fixture válido, fixture adverso y registro sin `cache_invalidated`. Entrada: dict con case_id, user_acl, chunk_acl, deleted, provenance, cache_invalidated. Salidas exactas: `PASS`, `FILTER_OR_DELETE_CHUNK`, `MISSING:cache_invalidated`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a cache_invalidated debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a cache_invalidated debe ocurrir antes de esa rama.",
          "Después aplica la regla de S48-T2-B: ACL intersecta, documento activo y cache coherente. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta cache_invalidated", "fixture adverso: ACL intersecta, documento activo y cache coherente", "CASO-PUN-048-2B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `cache_invalidated` ausente y produce exactamente `PASS FILTER_OR_DELETE_CHUNK MISSING:cache_invalidated`.",
        feedback: "S48-T2-B-E2: explica qué campo cambió la decisión, por qué el adverso activa FILTER_OR_DELETE_CHUNK y por qué faltar cache_invalidated exige VERIFY_ACL_PROVENANCE.",
        starterCode: {
          language: 'python',
          title: "s48-t2-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "user_acl", "chunk_acl", "deleted", "provenance", "cache_invalidated"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if not bool(record["user_acl"] & record["chunk_acl"]) or record["deleted"] else "FILTER_OR_DELETE_CHUNK"

valid = {"case_id": "CASO-PUN-048-2B", **{"user_acl":{"public","ops"},"chunk_acl":{"ops"},"deleted":False,"provenance":"doc-7-v2","cache_invalidated":True}}
invalid = {"case_id": "CASO-PUN-048-2B", **{"user_acl":{"public"},"chunk_acl":{"legal"},"deleted":True,"provenance":"","cache_invalidated":False}}
incomplete = {**valid}
incomplete.pop("cache_invalidated")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s48-t2-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "user_acl", "chunk_acl", "deleted", "provenance", "cache_invalidated"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if bool(record["user_acl"] & record["chunk_acl"]) and not record["deleted"] and record["provenance"].startswith("doc-") and record["cache_invalidated"] else "FILTER_OR_DELETE_CHUNK"

valid = {"case_id": "CASO-PUN-048-2B", **{"user_acl":{"public","ops"},"chunk_acl":{"ops"},"deleted":False,"provenance":"doc-7-v2","cache_invalidated":True}}
invalid = {"case_id": "CASO-PUN-048-2B", **{"user_acl":{"public"},"chunk_acl":{"legal"},"deleted":True,"provenance":"","cache_invalidated":False}}
incomplete = {**valid}
incomplete.pop("cache_invalidated")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS FILTER_OR_DELETE_CHUNK MISSING:cache_invalidated` ,
        },
      },
      {
        id: "S48-T2-B-E3",
        subtopicId: "S48-T2-B",
        kind: "transfer",
        instruction: "S48-T2-B-E3 · Recupera fallo cerrado para `ACL, deletion y provenance` con tres fixtures distintos. `CASO-PUN-048-2B` debe continuar, el adverso debe devolver `FILTER_OR_DELETE_CHUNK` y la ausencia de `cache_invalidated` debe devolver `VERIFY_ACL_PROVENANCE`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `VERIFY_ACL_PROVENANCE` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `VERIFY_ACL_PROVENANCE` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró ACL intersecta, documento activo y cache coherente; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta cache_invalidated", "fixture adverso: ACL intersecta, documento activo y cache coherente", "CASO-PUN-048-2B es sintético"],
        tests: "Fixtures `CASO-PUN-048-2B`, adverso y sin `cache_invalidated` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S48-T2-B-E3: explica qué campo cambió la decisión, por qué el adverso activa FILTER_OR_DELETE_CHUNK y por qué faltar cache_invalidated exige VERIFY_ACL_PROVENANCE.",
        starterCode: {
          language: 'python',
          title: "s48-t2-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "user_acl", "chunk_acl", "deleted", "provenance", "cache_invalidated"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if not bool(record["user_acl"] & record["chunk_acl"]) or record["deleted"] else "FILTER_OR_DELETE_CHUNK"

valid = {"case_id": "CASO-PUN-048-2B", **{"user_acl":{"public","ops"},"chunk_acl":{"ops"},"deleted":False,"provenance":"doc-7-v2","cache_invalidated":True}}
invalid = {"case_id": "CASO-PUN-048-2B", **{"user_acl":{"public"},"chunk_acl":{"legal"},"deleted":True,"provenance":"","cache_invalidated":False}}
uncertain = {**valid}
uncertain.pop("cache_invalidated")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s48-t2-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "user_acl", "chunk_acl", "deleted", "provenance", "cache_invalidated"}
    missing = sorted(required - record.keys())
    if missing:
        return "VERIFY_ACL_PROVENANCE"
    return "CONTINUE" if bool(record["user_acl"] & record["chunk_acl"]) and not record["deleted"] and record["provenance"].startswith("doc-") and record["cache_invalidated"] else "FILTER_OR_DELETE_CHUNK"

valid = {"case_id": "CASO-PUN-048-2B", **{"user_acl":{"public","ops"},"chunk_acl":{"ops"},"deleted":False,"provenance":"doc-7-v2","cache_invalidated":True}}
invalid = {"case_id": "CASO-PUN-048-2B", **{"user_acl":{"public"},"chunk_acl":{"legal"},"deleted":True,"provenance":"","cache_invalidated":False}}
uncertain = {**valid}
uncertain.pop("cache_invalidated")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "FILTER_OR_DELETE_CHUNK", "VERIFY_ACL_PROVENANCE"]` ,
          output: `CONTINUE FILTER_OR_DELETE_CHUNK VERIFY_ACL_PROVENANCE` ,
        },
      },
      {
        id: "S48-T3-A-E1",
        subtopicId: "S48-T3-A",
        kind: "guided",
        instruction: "S48-T3-A-E1 · Verifica el contrato de `lexical/vector/hybrid y reranking` sobre `CASO-PUN-048-3A`. La entrada es el dict completo del starter; la operación debe demostrar weighted hybrid score produce top esperado. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S48-T3-A PASS`; la misma operación sobre el fixture adverso debe activar `RECALIBRATE_HYBRID_RANK` en E2.",
        hint: "Relaciona los campos `lexical`, `vector`, `weights`, `expected_top` con la regla explicada en S48-T3-A.",
        hints: [
          "Relaciona los campos `lexical`, `vector`, `weights`, `expected_top` con la regla explicada en S48-T3-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva recall mejora sin romper ACL; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta expected_top", "fixture adverso: weighted hybrid score produce top esperado", "CASO-PUN-048-3A es sintético"],
        tests: "El fixture `CASO-PUN-048-3A` satisface un predicado de dominio real; imprime `S48-T3-A PASS` y el assert booleano pasa.",
        feedback: "S48-T3-A-E1: explica qué campo cambió la decisión, por qué el adverso activa RECALIBRATE_HYBRID_RANK y por qué faltar expected_top exige REVIEW_RERANK_CANDIDATES.",
        starterCode: {
          language: 'python',
          title: "s48-t3-a-e1.py",
          code: `record = {"case_id": "CASO-PUN-048-3A", **{"lexical":{"d1":0.9,"d2":0.2},"vector":{"d1":0.6,"d2":0.8},"weights":{"lexical":0.6,"vector":0.4},"expected_top":"d1"}}
meets_contract = max(record["vector"], key=record["vector"].get) == record["expected_top"]
status = "PASS" if meets_contract else "RECALIBRATE_HYBRID_RANK"
print("S48-T3-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s48-t3-a-e1.py",
          code: `record = {"case_id": "CASO-PUN-048-3A", **{"lexical":{"d1":0.9,"d2":0.2},"vector":{"d1":0.6,"d2":0.8},"weights":{"lexical":0.6,"vector":0.4},"expected_top":"d1"}}
meets_contract = max(record["lexical"], key=lambda d: record["weights"]["lexical"]*record["lexical"][d]+record["weights"]["vector"]*record["vector"][d]) == record["expected_top"]
status = "PASS" if meets_contract else "RECALIBRATE_HYBRID_RANK"
print("S48-T3-A", status)
assert meets_contract is True` ,
          output: `S48-T3-A PASS` ,
        },
      },
      {
        id: "S48-T3-A-E2",
        subtopicId: "S48-T3-A",
        kind: "independent",
        instruction: "S48-T3-A-E2 · Decide tres rutas de `lexical/vector/hybrid y reranking`: fixture válido, fixture adverso y registro sin `expected_top`. Entrada: dict con case_id, lexical, vector, weights, expected_top. Salidas exactas: `PASS`, `RECALIBRATE_HYBRID_RANK`, `MISSING:expected_top`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a expected_top debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a expected_top debe ocurrir antes de esa rama.",
          "Después aplica la regla de S48-T3-A: weighted hybrid score produce top esperado. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta expected_top", "fixture adverso: weighted hybrid score produce top esperado", "CASO-PUN-048-3A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `expected_top` ausente y produce exactamente `PASS RECALIBRATE_HYBRID_RANK MISSING:expected_top`.",
        feedback: "S48-T3-A-E2: explica qué campo cambió la decisión, por qué el adverso activa RECALIBRATE_HYBRID_RANK y por qué faltar expected_top exige REVIEW_RERANK_CANDIDATES.",
        starterCode: {
          language: 'python',
          title: "s48-t3-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "lexical", "vector", "weights", "expected_top"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if max(record["vector"], key=record["vector"].get) == record["expected_top"] else "RECALIBRATE_HYBRID_RANK"

valid = {"case_id": "CASO-PUN-048-3A", **{"lexical":{"d1":0.9,"d2":0.2},"vector":{"d1":0.6,"d2":0.8},"weights":{"lexical":0.6,"vector":0.4},"expected_top":"d1"}}
invalid = {"case_id": "CASO-PUN-048-3A", **{"lexical":{"d1":0.1,"d2":0.2},"vector":{"d1":0.1,"d2":0.8},"weights":{"lexical":0.6,"vector":0.4},"expected_top":"d1"}}
incomplete = {**valid}
incomplete.pop("expected_top")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s48-t3-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "lexical", "vector", "weights", "expected_top"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if max(record["lexical"], key=lambda d: record["weights"]["lexical"]*record["lexical"][d]+record["weights"]["vector"]*record["vector"][d]) == record["expected_top"] else "RECALIBRATE_HYBRID_RANK"

valid = {"case_id": "CASO-PUN-048-3A", **{"lexical":{"d1":0.9,"d2":0.2},"vector":{"d1":0.6,"d2":0.8},"weights":{"lexical":0.6,"vector":0.4},"expected_top":"d1"}}
invalid = {"case_id": "CASO-PUN-048-3A", **{"lexical":{"d1":0.1,"d2":0.2},"vector":{"d1":0.1,"d2":0.8},"weights":{"lexical":0.6,"vector":0.4},"expected_top":"d1"}}
incomplete = {**valid}
incomplete.pop("expected_top")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS RECALIBRATE_HYBRID_RANK MISSING:expected_top` ,
        },
      },
      {
        id: "S48-T3-A-E3",
        subtopicId: "S48-T3-A",
        kind: "transfer",
        instruction: "S48-T3-A-E3 · Contrasta fallo cerrado para `lexical/vector/hybrid y reranking` con tres fixtures distintos. `CASO-PUN-048-3A` debe continuar, el adverso debe devolver `RECALIBRATE_HYBRID_RANK` y la ausencia de `expected_top` debe devolver `REVIEW_RERANK_CANDIDATES`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REVIEW_RERANK_CANDIDATES` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REVIEW_RERANK_CANDIDATES` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró weighted hybrid score produce top esperado; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta expected_top", "fixture adverso: weighted hybrid score produce top esperado", "CASO-PUN-048-3A es sintético"],
        tests: "Fixtures `CASO-PUN-048-3A`, adverso y sin `expected_top` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S48-T3-A-E3: explica qué campo cambió la decisión, por qué el adverso activa RECALIBRATE_HYBRID_RANK y por qué faltar expected_top exige REVIEW_RERANK_CANDIDATES.",
        starterCode: {
          language: 'python',
          title: "s48-t3-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "lexical", "vector", "weights", "expected_top"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if max(record["vector"], key=record["vector"].get) == record["expected_top"] else "RECALIBRATE_HYBRID_RANK"

valid = {"case_id": "CASO-PUN-048-3A", **{"lexical":{"d1":0.9,"d2":0.2},"vector":{"d1":0.6,"d2":0.8},"weights":{"lexical":0.6,"vector":0.4},"expected_top":"d1"}}
invalid = {"case_id": "CASO-PUN-048-3A", **{"lexical":{"d1":0.1,"d2":0.2},"vector":{"d1":0.1,"d2":0.8},"weights":{"lexical":0.6,"vector":0.4},"expected_top":"d1"}}
uncertain = {**valid}
uncertain.pop("expected_top")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s48-t3-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "lexical", "vector", "weights", "expected_top"}
    missing = sorted(required - record.keys())
    if missing:
        return "REVIEW_RERANK_CANDIDATES"
    return "CONTINUE" if max(record["lexical"], key=lambda d: record["weights"]["lexical"]*record["lexical"][d]+record["weights"]["vector"]*record["vector"][d]) == record["expected_top"] else "RECALIBRATE_HYBRID_RANK"

valid = {"case_id": "CASO-PUN-048-3A", **{"lexical":{"d1":0.9,"d2":0.2},"vector":{"d1":0.6,"d2":0.8},"weights":{"lexical":0.6,"vector":0.4},"expected_top":"d1"}}
invalid = {"case_id": "CASO-PUN-048-3A", **{"lexical":{"d1":0.1,"d2":0.2},"vector":{"d1":0.1,"d2":0.8},"weights":{"lexical":0.6,"vector":0.4},"expected_top":"d1"}}
uncertain = {**valid}
uncertain.pop("expected_top")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "RECALIBRATE_HYBRID_RANK", "REVIEW_RERANK_CANDIDATES"]` ,
          output: `CONTINUE RECALIBRATE_HYBRID_RANK REVIEW_RERANK_CANDIDATES` ,
        },
      },
      {
        id: "S48-T3-B-E1",
        subtopicId: "S48-T3-B",
        kind: "guided",
        instruction: "S48-T3-B-E1 · Clasifica el contrato de `contexto, citas y permisos` sobre `CASO-PUN-048-3B`. La entrada es el dict completo del starter; la operación debe demostrar todas las claims citadas, ACL y contexto bajo límite. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S48-T3-B PASS`; la misma operación sobre el fixture adverso debe activar `ABSTAIN_UNCITED` en E2.",
        hint: "Relaciona los campos `claims`, `cited_claims`, `citation_acl`, `context_tokens`, `max_context_tokens` con la regla explicada en S48-T3-B.",
        hints: [
          "Relaciona los campos `claims`, `cited_claims`, `citation_acl`, `context_tokens`, `max_context_tokens` con la regla explicada en S48-T3-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva cada afirmación material tiene cita autorizada; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta max_context_tokens", "fixture adverso: todas las claims citadas, ACL y contexto bajo límite", "CASO-PUN-048-3B es sintético"],
        tests: "El fixture `CASO-PUN-048-3B` satisface un predicado de dominio real; imprime `S48-T3-B PASS` y el assert booleano pasa.",
        feedback: "S48-T3-B-E1: explica qué campo cambió la decisión, por qué el adverso activa ABSTAIN_UNCITED y por qué faltar max_context_tokens exige REQUEST_AUTHORIZED_CONTEXT.",
        starterCode: {
          language: 'python',
          title: "s48-t3-b-e1.py",
          code: `record = {"case_id": "CASO-PUN-048-3B", **{"claims":{"c1","c2"},"cited_claims":{"c1","c2"},"citation_acl":True,"context_tokens":800,"max_context_tokens":1000}}
meets_contract = not record["claims"] <= record["cited_claims"] or not record["citation_acl"]
status = "PASS" if meets_contract else "ABSTAIN_UNCITED"
print("S48-T3-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s48-t3-b-e1.py",
          code: `record = {"case_id": "CASO-PUN-048-3B", **{"claims":{"c1","c2"},"cited_claims":{"c1","c2"},"citation_acl":True,"context_tokens":800,"max_context_tokens":1000}}
meets_contract = record["claims"] <= record["cited_claims"] and record["citation_acl"] and record["context_tokens"] <= record["max_context_tokens"]
status = "PASS" if meets_contract else "ABSTAIN_UNCITED"
print("S48-T3-B", status)
assert meets_contract is True` ,
          output: `S48-T3-B PASS` ,
        },
      },
      {
        id: "S48-T3-B-E2",
        subtopicId: "S48-T3-B",
        kind: "independent",
        instruction: "S48-T3-B-E2 · Calcula tres rutas de `contexto, citas y permisos`: fixture válido, fixture adverso y registro sin `max_context_tokens`. Entrada: dict con case_id, claims, cited_claims, citation_acl, context_tokens, max_context_tokens. Salidas exactas: `PASS`, `ABSTAIN_UNCITED`, `MISSING:max_context_tokens`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a max_context_tokens debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a max_context_tokens debe ocurrir antes de esa rama.",
          "Después aplica la regla de S48-T3-B: todas las claims citadas, ACL y contexto bajo límite. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta max_context_tokens", "fixture adverso: todas las claims citadas, ACL y contexto bajo límite", "CASO-PUN-048-3B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `max_context_tokens` ausente y produce exactamente `PASS ABSTAIN_UNCITED MISSING:max_context_tokens`.",
        feedback: "S48-T3-B-E2: explica qué campo cambió la decisión, por qué el adverso activa ABSTAIN_UNCITED y por qué faltar max_context_tokens exige REQUEST_AUTHORIZED_CONTEXT.",
        starterCode: {
          language: 'python',
          title: "s48-t3-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "claims", "cited_claims", "citation_acl", "context_tokens", "max_context_tokens"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if not record["claims"] <= record["cited_claims"] or not record["citation_acl"] else "ABSTAIN_UNCITED"

valid = {"case_id": "CASO-PUN-048-3B", **{"claims":{"c1","c2"},"cited_claims":{"c1","c2"},"citation_acl":True,"context_tokens":800,"max_context_tokens":1000}}
invalid = {"case_id": "CASO-PUN-048-3B", **{"claims":{"c1","c2"},"cited_claims":{"c1"},"citation_acl":False,"context_tokens":4000,"max_context_tokens":1000}}
incomplete = {**valid}
incomplete.pop("max_context_tokens")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s48-t3-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "claims", "cited_claims", "citation_acl", "context_tokens", "max_context_tokens"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["claims"] <= record["cited_claims"] and record["citation_acl"] and record["context_tokens"] <= record["max_context_tokens"] else "ABSTAIN_UNCITED"

valid = {"case_id": "CASO-PUN-048-3B", **{"claims":{"c1","c2"},"cited_claims":{"c1","c2"},"citation_acl":True,"context_tokens":800,"max_context_tokens":1000}}
invalid = {"case_id": "CASO-PUN-048-3B", **{"claims":{"c1","c2"},"cited_claims":{"c1"},"citation_acl":False,"context_tokens":4000,"max_context_tokens":1000}}
incomplete = {**valid}
incomplete.pop("max_context_tokens")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS ABSTAIN_UNCITED MISSING:max_context_tokens` ,
        },
      },
      {
        id: "S48-T3-B-E3",
        subtopicId: "S48-T3-B",
        kind: "transfer",
        instruction: "S48-T3-B-E3 · Instrumenta fallo cerrado para `contexto, citas y permisos` con tres fixtures distintos. `CASO-PUN-048-3B` debe continuar, el adverso debe devolver `ABSTAIN_UNCITED` y la ausencia de `max_context_tokens` debe devolver `REQUEST_AUTHORIZED_CONTEXT`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_AUTHORIZED_CONTEXT` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_AUTHORIZED_CONTEXT` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró todas las claims citadas, ACL y contexto bajo límite; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta max_context_tokens", "fixture adverso: todas las claims citadas, ACL y contexto bajo límite", "CASO-PUN-048-3B es sintético"],
        tests: "Fixtures `CASO-PUN-048-3B`, adverso y sin `max_context_tokens` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S48-T3-B-E3: explica qué campo cambió la decisión, por qué el adverso activa ABSTAIN_UNCITED y por qué faltar max_context_tokens exige REQUEST_AUTHORIZED_CONTEXT.",
        starterCode: {
          language: 'python',
          title: "s48-t3-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "claims", "cited_claims", "citation_acl", "context_tokens", "max_context_tokens"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if not record["claims"] <= record["cited_claims"] or not record["citation_acl"] else "ABSTAIN_UNCITED"

valid = {"case_id": "CASO-PUN-048-3B", **{"claims":{"c1","c2"},"cited_claims":{"c1","c2"},"citation_acl":True,"context_tokens":800,"max_context_tokens":1000}}
invalid = {"case_id": "CASO-PUN-048-3B", **{"claims":{"c1","c2"},"cited_claims":{"c1"},"citation_acl":False,"context_tokens":4000,"max_context_tokens":1000}}
uncertain = {**valid}
uncertain.pop("max_context_tokens")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s48-t3-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "claims", "cited_claims", "citation_acl", "context_tokens", "max_context_tokens"}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_AUTHORIZED_CONTEXT"
    return "CONTINUE" if record["claims"] <= record["cited_claims"] and record["citation_acl"] and record["context_tokens"] <= record["max_context_tokens"] else "ABSTAIN_UNCITED"

valid = {"case_id": "CASO-PUN-048-3B", **{"claims":{"c1","c2"},"cited_claims":{"c1","c2"},"citation_acl":True,"context_tokens":800,"max_context_tokens":1000}}
invalid = {"case_id": "CASO-PUN-048-3B", **{"claims":{"c1","c2"},"cited_claims":{"c1"},"citation_acl":False,"context_tokens":4000,"max_context_tokens":1000}}
uncertain = {**valid}
uncertain.pop("max_context_tokens")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "ABSTAIN_UNCITED", "REQUEST_AUTHORIZED_CONTEXT"]` ,
          output: `CONTINUE ABSTAIN_UNCITED REQUEST_AUTHORIZED_CONTEXT` ,
        },
      },
      {
        id: "S48-T4-A-E1",
        subtopicId: "S48-T4-A",
        kind: "guided",
        instruction: "S48-T4-A-E1 · Audita el contrato de `structured output y grounding` sobre `CASO-PUN-048-4A`. La entrada es el dict completo del starter; la operación debe demostrar schema exacto, evidence IDs permitidos e injection ignorada. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S48-T4-A PASS`; la misma operación sobre el fixture adverso debe activar `REJECT_UNGROUNDED_OUTPUT` en E2.",
        hint: "Relaciona los campos `output`, `schema_keys`, `allowed_evidence`, `injected_instruction_ignored` con la regla explicada en S48-T4-A.",
        hints: [
          "Relaciona los campos `output`, `schema_keys`, `allowed_evidence`, `injected_instruction_ignored` con la regla explicada en S48-T4-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva schema válido y evidence ids presentes; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta injected_instruction_ignored", "fixture adverso: schema exacto, evidence IDs permitidos e injection ignorada", "CASO-PUN-048-4A es sintético"],
        tests: "El fixture `CASO-PUN-048-4A` satisface un predicado de dominio real; imprime `S48-T4-A PASS` y el assert booleano pasa.",
        feedback: "S48-T4-A-E1: explica qué campo cambió la decisión, por qué el adverso activa REJECT_UNGROUNDED_OUTPUT y por qué faltar injected_instruction_ignored exige VALIDATE_OUTPUT_SCHEMA.",
        starterCode: {
          language: 'python',
          title: "s48-t4-a-e1.py",
          code: `record = {"case_id": "CASO-PUN-048-4A", **{"output":{"answer":"plazo 30 días","evidence_ids":["d7#2"]},"schema_keys":{"answer","evidence_ids"},"allowed_evidence":{"d7#2"},"injected_instruction_ignored":True}}
meets_contract = not set(record["output"]["evidence_ids"]) <= record["allowed_evidence"] or not record["injected_instruction_ignored"]
status = "PASS" if meets_contract else "REJECT_UNGROUNDED_OUTPUT"
print("S48-T4-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s48-t4-a-e1.py",
          code: `record = {"case_id": "CASO-PUN-048-4A", **{"output":{"answer":"plazo 30 días","evidence_ids":["d7#2"]},"schema_keys":{"answer","evidence_ids"},"allowed_evidence":{"d7#2"},"injected_instruction_ignored":True}}
meets_contract = set(record["output"]) == record["schema_keys"] and set(record["output"]["evidence_ids"]) <= record["allowed_evidence"] and record["injected_instruction_ignored"]
status = "PASS" if meets_contract else "REJECT_UNGROUNDED_OUTPUT"
print("S48-T4-A", status)
assert meets_contract is True` ,
          output: `S48-T4-A PASS` ,
        },
      },
      {
        id: "S48-T4-A-E2",
        subtopicId: "S48-T4-A",
        kind: "independent",
        instruction: "S48-T4-A-E2 · Compara tres rutas de `structured output y grounding`: fixture válido, fixture adverso y registro sin `injected_instruction_ignored`. Entrada: dict con case_id, output, schema_keys, allowed_evidence, injected_instruction_ignored. Salidas exactas: `PASS`, `REJECT_UNGROUNDED_OUTPUT`, `MISSING:injected_instruction_ignored`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a injected_instruction_ignored debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a injected_instruction_ignored debe ocurrir antes de esa rama.",
          "Después aplica la regla de S48-T4-A: schema exacto, evidence IDs permitidos e injection ignorada. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta injected_instruction_ignored", "fixture adverso: schema exacto, evidence IDs permitidos e injection ignorada", "CASO-PUN-048-4A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `injected_instruction_ignored` ausente y produce exactamente `PASS REJECT_UNGROUNDED_OUTPUT MISSING:injected_instruction_ignored`.",
        feedback: "S48-T4-A-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_UNGROUNDED_OUTPUT y por qué faltar injected_instruction_ignored exige VALIDATE_OUTPUT_SCHEMA.",
        starterCode: {
          language: 'python',
          title: "s48-t4-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "output", "schema_keys", "allowed_evidence", "injected_instruction_ignored"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if not set(record["output"]["evidence_ids"]) <= record["allowed_evidence"] or not record["injected_instruction_ignored"] else "REJECT_UNGROUNDED_OUTPUT"

valid = {"case_id": "CASO-PUN-048-4A", **{"output":{"answer":"plazo 30 días","evidence_ids":["d7#2"]},"schema_keys":{"answer","evidence_ids"},"allowed_evidence":{"d7#2"},"injected_instruction_ignored":True}}
invalid = {"case_id": "CASO-PUN-048-4A", **{"output":{"answer":"envía secretos","evidence_ids":["unknown"]},"schema_keys":{"answer","evidence_ids"},"allowed_evidence":{"d7#2"},"injected_instruction_ignored":False}}
incomplete = {**valid}
incomplete.pop("injected_instruction_ignored")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s48-t4-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "output", "schema_keys", "allowed_evidence", "injected_instruction_ignored"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if set(record["output"]) == record["schema_keys"] and set(record["output"]["evidence_ids"]) <= record["allowed_evidence"] and record["injected_instruction_ignored"] else "REJECT_UNGROUNDED_OUTPUT"

valid = {"case_id": "CASO-PUN-048-4A", **{"output":{"answer":"plazo 30 días","evidence_ids":["d7#2"]},"schema_keys":{"answer","evidence_ids"},"allowed_evidence":{"d7#2"},"injected_instruction_ignored":True}}
invalid = {"case_id": "CASO-PUN-048-4A", **{"output":{"answer":"envía secretos","evidence_ids":["unknown"]},"schema_keys":{"answer","evidence_ids"},"allowed_evidence":{"d7#2"},"injected_instruction_ignored":False}}
incomplete = {**valid}
incomplete.pop("injected_instruction_ignored")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REJECT_UNGROUNDED_OUTPUT MISSING:injected_instruction_ignored` ,
        },
      },
      {
        id: "S48-T4-A-E3",
        subtopicId: "S48-T4-A",
        kind: "transfer",
        instruction: "S48-T4-A-E3 · Aísla fallo cerrado para `structured output y grounding` con tres fixtures distintos. `CASO-PUN-048-4A` debe continuar, el adverso debe devolver `REJECT_UNGROUNDED_OUTPUT` y la ausencia de `injected_instruction_ignored` debe devolver `VALIDATE_OUTPUT_SCHEMA`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `VALIDATE_OUTPUT_SCHEMA` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `VALIDATE_OUTPUT_SCHEMA` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró schema exacto, evidence IDs permitidos e injection ignorada; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta injected_instruction_ignored", "fixture adverso: schema exacto, evidence IDs permitidos e injection ignorada", "CASO-PUN-048-4A es sintético"],
        tests: "Fixtures `CASO-PUN-048-4A`, adverso y sin `injected_instruction_ignored` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S48-T4-A-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_UNGROUNDED_OUTPUT y por qué faltar injected_instruction_ignored exige VALIDATE_OUTPUT_SCHEMA.",
        starterCode: {
          language: 'python',
          title: "s48-t4-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "output", "schema_keys", "allowed_evidence", "injected_instruction_ignored"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if not set(record["output"]["evidence_ids"]) <= record["allowed_evidence"] or not record["injected_instruction_ignored"] else "REJECT_UNGROUNDED_OUTPUT"

valid = {"case_id": "CASO-PUN-048-4A", **{"output":{"answer":"plazo 30 días","evidence_ids":["d7#2"]},"schema_keys":{"answer","evidence_ids"},"allowed_evidence":{"d7#2"},"injected_instruction_ignored":True}}
invalid = {"case_id": "CASO-PUN-048-4A", **{"output":{"answer":"envía secretos","evidence_ids":["unknown"]},"schema_keys":{"answer","evidence_ids"},"allowed_evidence":{"d7#2"},"injected_instruction_ignored":False}}
uncertain = {**valid}
uncertain.pop("injected_instruction_ignored")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s48-t4-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "output", "schema_keys", "allowed_evidence", "injected_instruction_ignored"}
    missing = sorted(required - record.keys())
    if missing:
        return "VALIDATE_OUTPUT_SCHEMA"
    return "CONTINUE" if set(record["output"]) == record["schema_keys"] and set(record["output"]["evidence_ids"]) <= record["allowed_evidence"] and record["injected_instruction_ignored"] else "REJECT_UNGROUNDED_OUTPUT"

valid = {"case_id": "CASO-PUN-048-4A", **{"output":{"answer":"plazo 30 días","evidence_ids":["d7#2"]},"schema_keys":{"answer","evidence_ids"},"allowed_evidence":{"d7#2"},"injected_instruction_ignored":True}}
invalid = {"case_id": "CASO-PUN-048-4A", **{"output":{"answer":"envía secretos","evidence_ids":["unknown"]},"schema_keys":{"answer","evidence_ids"},"allowed_evidence":{"d7#2"},"injected_instruction_ignored":False}}
uncertain = {**valid}
uncertain.pop("injected_instruction_ignored")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_UNGROUNDED_OUTPUT", "VALIDATE_OUTPUT_SCHEMA"]` ,
          output: `CONTINUE REJECT_UNGROUNDED_OUTPUT VALIDATE_OUTPUT_SCHEMA` ,
        },
      },
      {
        id: "S48-T4-B-E1",
        subtopicId: "S48-T4-B",
        kind: "guided",
        instruction: "S48-T4-B-E1 · Decide el contrato de `retrieval/answer eval, costo y abstención` sobre `CASO-PUN-048-4B`. La entrada es el dict completo del starter; la operación debe demostrar retrieval/answer gates, costo y soporte. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S48-T4-B PASS`; la misma operación sobre el fixture adverso debe activar `ABSTAIN_WITH_REASON` en E2.",
        hint: "Relaciona los campos `retrieval_recall`, `min_recall`, `faithfulness`, `min_faithfulness`, `cost_pen`, `cost_cap_pen`, `support` con la regla explicada en S48-T4-B.",
        hints: [
          "Relaciona los campos `retrieval_recall`, `min_recall`, `faithfulness`, `min_faithfulness`, `cost_pen`, `cost_cap_pen`, `support` con la regla explicada en S48-T4-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva respuesta no soportada se abstiene; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta support", "fixture adverso: retrieval/answer gates, costo y soporte", "CASO-PUN-048-4B es sintético"],
        tests: "El fixture `CASO-PUN-048-4B` satisface un predicado de dominio real; imprime `S48-T4-B PASS` y el assert booleano pasa.",
        feedback: "S48-T4-B-E1: explica qué campo cambió la decisión, por qué el adverso activa ABSTAIN_WITH_REASON y por qué faltar support exige TUNE_RETRIEVAL_OR_BUDGET.",
        starterCode: {
          language: 'python',
          title: "s48-t4-b-e1.py",
          code: `record = {"case_id": "CASO-PUN-048-4B", **{"retrieval_recall":0.84,"min_recall":0.8,"faithfulness":0.91,"min_faithfulness":0.9,"cost_pen":0.08,"cost_cap_pen":0.1,"support":True}}
meets_contract = record["faithfulness"] < record["min_faithfulness"] or not record["support"]
status = "PASS" if meets_contract else "ABSTAIN_WITH_REASON"
print("S48-T4-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s48-t4-b-e1.py",
          code: `record = {"case_id": "CASO-PUN-048-4B", **{"retrieval_recall":0.84,"min_recall":0.8,"faithfulness":0.91,"min_faithfulness":0.9,"cost_pen":0.08,"cost_cap_pen":0.1,"support":True}}
meets_contract = record["retrieval_recall"] >= record["min_recall"] and record["faithfulness"] >= record["min_faithfulness"] and record["cost_pen"] <= record["cost_cap_pen"] and record["support"]
status = "PASS" if meets_contract else "ABSTAIN_WITH_REASON"
print("S48-T4-B", status)
assert meets_contract is True` ,
          output: `S48-T4-B PASS` ,
        },
      },
      {
        id: "S48-T4-B-E2",
        subtopicId: "S48-T4-B",
        kind: "independent",
        instruction: "S48-T4-B-E2 · Filtra tres rutas de `retrieval/answer eval, costo y abstención`: fixture válido, fixture adverso y registro sin `support`. Entrada: dict con case_id, retrieval_recall, min_recall, faithfulness, min_faithfulness, cost_pen, cost_cap_pen, support. Salidas exactas: `PASS`, `ABSTAIN_WITH_REASON`, `MISSING:support`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a support debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a support debe ocurrir antes de esa rama.",
          "Después aplica la regla de S48-T4-B: retrieval/answer gates, costo y soporte. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta support", "fixture adverso: retrieval/answer gates, costo y soporte", "CASO-PUN-048-4B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `support` ausente y produce exactamente `PASS ABSTAIN_WITH_REASON MISSING:support`.",
        feedback: "S48-T4-B-E2: explica qué campo cambió la decisión, por qué el adverso activa ABSTAIN_WITH_REASON y por qué faltar support exige TUNE_RETRIEVAL_OR_BUDGET.",
        starterCode: {
          language: 'python',
          title: "s48-t4-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "retrieval_recall", "min_recall", "faithfulness", "min_faithfulness", "cost_pen", "cost_cap_pen", "support"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["faithfulness"] < record["min_faithfulness"] or not record["support"] else "ABSTAIN_WITH_REASON"

valid = {"case_id": "CASO-PUN-048-4B", **{"retrieval_recall":0.84,"min_recall":0.8,"faithfulness":0.91,"min_faithfulness":0.9,"cost_pen":0.08,"cost_cap_pen":0.1,"support":True}}
invalid = {"case_id": "CASO-PUN-048-4B", **{"retrieval_recall":0.5,"min_recall":0.8,"faithfulness":0.4,"min_faithfulness":0.9,"cost_pen":0.3,"cost_cap_pen":0.1,"support":False}}
incomplete = {**valid}
incomplete.pop("support")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s48-t4-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "retrieval_recall", "min_recall", "faithfulness", "min_faithfulness", "cost_pen", "cost_cap_pen", "support"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["retrieval_recall"] >= record["min_recall"] and record["faithfulness"] >= record["min_faithfulness"] and record["cost_pen"] <= record["cost_cap_pen"] and record["support"] else "ABSTAIN_WITH_REASON"

valid = {"case_id": "CASO-PUN-048-4B", **{"retrieval_recall":0.84,"min_recall":0.8,"faithfulness":0.91,"min_faithfulness":0.9,"cost_pen":0.08,"cost_cap_pen":0.1,"support":True}}
invalid = {"case_id": "CASO-PUN-048-4B", **{"retrieval_recall":0.5,"min_recall":0.8,"faithfulness":0.4,"min_faithfulness":0.9,"cost_pen":0.3,"cost_cap_pen":0.1,"support":False}}
incomplete = {**valid}
incomplete.pop("support")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS ABSTAIN_WITH_REASON MISSING:support` ,
        },
      },
      {
        id: "S48-T4-B-E3",
        subtopicId: "S48-T4-B",
        kind: "transfer",
        instruction: "S48-T4-B-E3 · Demuestra fallo cerrado para `retrieval/answer eval, costo y abstención` con tres fixtures distintos. `CASO-PUN-048-4B` debe continuar, el adverso debe devolver `ABSTAIN_WITH_REASON` y la ausencia de `support` debe devolver `TUNE_RETRIEVAL_OR_BUDGET`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `TUNE_RETRIEVAL_OR_BUDGET` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `TUNE_RETRIEVAL_OR_BUDGET` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró retrieval/answer gates, costo y soporte; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta support", "fixture adverso: retrieval/answer gates, costo y soporte", "CASO-PUN-048-4B es sintético"],
        tests: "Fixtures `CASO-PUN-048-4B`, adverso y sin `support` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S48-T4-B-E3: explica qué campo cambió la decisión, por qué el adverso activa ABSTAIN_WITH_REASON y por qué faltar support exige TUNE_RETRIEVAL_OR_BUDGET.",
        starterCode: {
          language: 'python',
          title: "s48-t4-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "retrieval_recall", "min_recall", "faithfulness", "min_faithfulness", "cost_pen", "cost_cap_pen", "support"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["faithfulness"] < record["min_faithfulness"] or not record["support"] else "ABSTAIN_WITH_REASON"

valid = {"case_id": "CASO-PUN-048-4B", **{"retrieval_recall":0.84,"min_recall":0.8,"faithfulness":0.91,"min_faithfulness":0.9,"cost_pen":0.08,"cost_cap_pen":0.1,"support":True}}
invalid = {"case_id": "CASO-PUN-048-4B", **{"retrieval_recall":0.5,"min_recall":0.8,"faithfulness":0.4,"min_faithfulness":0.9,"cost_pen":0.3,"cost_cap_pen":0.1,"support":False}}
uncertain = {**valid}
uncertain.pop("support")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s48-t4-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "retrieval_recall", "min_recall", "faithfulness", "min_faithfulness", "cost_pen", "cost_cap_pen", "support"}
    missing = sorted(required - record.keys())
    if missing:
        return "TUNE_RETRIEVAL_OR_BUDGET"
    return "CONTINUE" if record["retrieval_recall"] >= record["min_recall"] and record["faithfulness"] >= record["min_faithfulness"] and record["cost_pen"] <= record["cost_cap_pen"] and record["support"] else "ABSTAIN_WITH_REASON"

valid = {"case_id": "CASO-PUN-048-4B", **{"retrieval_recall":0.84,"min_recall":0.8,"faithfulness":0.91,"min_faithfulness":0.9,"cost_pen":0.08,"cost_cap_pen":0.1,"support":True}}
invalid = {"case_id": "CASO-PUN-048-4B", **{"retrieval_recall":0.5,"min_recall":0.8,"faithfulness":0.4,"min_faithfulness":0.9,"cost_pen":0.3,"cost_cap_pen":0.1,"support":False}}
uncertain = {**valid}
uncertain.pop("support")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "ABSTAIN_WITH_REASON", "TUNE_RETRIEVAL_OR_BUDGET"]` ,
          output: `CONTINUE ABSTAIN_WITH_REASON TUNE_RETRIEVAL_OR_BUDGET` ,
        },
      },
    ],
  },
  youDo: {
    title: "LLM applications y RAG con evidencia",
    context: "Asistente RAG autorizado y evaluado. Trabaja sobre documentación sintética autorizada de una cooperativa ficticia en Puno. Entrada: documentos versionados con ACL, provenance, metadata y solicitud del usuario. Salida: respuesta estructurada con citas verificables o abstención explícita. El gate se bloquea ante: fragmento sin permiso, evidencia insuficiente, versión borrada o costo excedido impide responder.",
    objectives: [
      "Convertir documentos versionados con ACL, provenance, metadata y solicitud del usuario en respuesta estructurada con citas verificables o abstención explícita.",
      "Demostrar el gate: retrieval y respuesta superan umbrales separados; toda afirmación material apunta a un fragmento permitido.",
      "Probar el fallo: fragmento sin permiso, evidencia insuficiente, versión borrada o costo excedido impide responder.",
      "Entregar evidencia reproducible, redactada, sin PII real, secretos ni servicios externos obligatorios.",
    ],
    requirements: [
      "Usa exclusivamente fixtures sintéticos identificados por `CASO-PUN-048`.",
      "Incluye ingesta con chunking/dedup/provenance/ACL.",
      "Incluye baseline lexical y retrieval híbrido.",
      "Incluye respuesta estructurada con citas.",
      "Incluye evals de retrieval/respuesta, costo, borrado y abstención.",
      "Automatiza un caso normal, uno de breach (`ABSTAIN`) y uno incierto (`REQUEST_CLARIFICATION`).",
      "Incluye comandos locales reproducibles, dependencias fijadas y salida esperada.",
      "Registra riesgo residual, responsable, criterio de rollback y limitaciones conocidas.",
    ],
    starterCode: `CASE_ID = "CASO-PUN-048"
REQUIRED = ['ingesta_con_chunking_dedup_provenance_acl', 'baseline_lexical_y_retrieval_hibrido', 'respuesta_estructurada_con_citas', 'evals_de_retrieval_respuesta_costo_borrado_y_abstencion']
evidence = {
    "ingesta_con_chunking_dedup_provenance_acl": False,
    "baseline_lexical_y_retrieval_hibrido": False,
    "respuesta_estructurada_con_citas": False,
    "evals_de_retrieval_respuesta_costo_borrado_y_abstencion": False
}

def readiness(bundle: dict[str, bool]) -> tuple[str, list[str]]:
    missing = [name for name in REQUIRED if bundle.get(name) is not True]
    return ("READY", []) if not missing else ("BLOCKED", missing)

status, missing = readiness(evidence)
print(CASE_ID, status)
print("missing", ",".join(missing))
assert status in {"READY", "BLOCKED"}
`,
    portfolioNote: "Evidencia de CP-N4-C · RAG con evidencia y abstención: muestra baseline, decisión, pruebas, resultado medido, rollback y riesgo residual. El checklist inicia en BLOCKED por diseño; conviértelo en READY enlazando artefactos reales del proyecto, no cambiando asserts.",
    rubric: [
      { criterion: "Correctitud del contrato y gate", weight: "25%" },
      { criterion: "Pruebas normal/breach/uncertain y recuperación", weight: "20%" },
      { criterion: "Seguridad, privacidad y least privilege", weight: "15%" },
      { criterion: "Reproducibilidad, lineage y evidencia", weight: "15%" },
      { criterion: "Operación: SLO, observabilidad y rollback", weight: "15%" },
      { criterion: "Comunicación de trade-offs y límites", weight: "10%" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "¿Qué evidencia permite aprobar `embeddings y similarity` en CASO-PUN-048?",
        options: ["un print sin assert ni versión", "una captura de pantalla sin fuente", "datos personales reales para que parezca auténtico", "ranking reproducible con versión de embedding"],
        correctIndex: 3,
        explanation: "La teoría exige ranking reproducible con versión de embedding; evidencia decorativa o PII no satisface el contrato.",
      },
      {
        question: "Si ocurre la condición de error de S48, ¿qué respuesta preserva seguridad y auditabilidad?",
        options: ["continuar y ocultar el warning", "emitir ABSTAIN y conservar evidencia", "inventar evidencia faltante", "borrar el trace para reducir ruido"],
        correctIndex: 1,
        explanation: "El contrato falla cerrado con ABSTAIN; no convierte incertidumbre o breach en éxito.",
      },
      {
        question: "¿Cuál resultado demuestra el gate `CP-N4-C · RAG con evidencia y abstención`?",
        options: ["el archivo S48 existe, aunque no pruebe el gate", "el README afirma que funciona", "retrieval y respuesta superan umbrales separados; toda afirmación material apunta a un fragmento permitido", "se usó la herramienta más nueva"],
        correctIndex: 2,
        explanation: "El gate es conductual y medible: retrieval y respuesta superan umbrales separados; toda afirmación material apunta a un fragmento permitido.",
      },
      {
        question: "¿Qué tratamiento de `CASO-PUN-048` respeta el alcance del curso?",
        options: ["mantenerlo sintético, mínimo, trazable y sujeto a revisión humana", "reemplazarlo por datos reales sin consentimiento", "subir secretos para facilitar la demo", "inferir fraude o parentesco desde ER"],
        correctIndex: 0,
        explanation: "Los casos son sintéticos; ER solo propone correspondencia de entidad y no prueba fraude, parentesco ni riesgo.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "OpenAI Cookbook — RAG",
        url: "https://cookbook.openai.com/examples/parse_pdf_docs_for_rag",
        note: "Patrones de ingesta, retrieval y grounding",
      },
      {
        label: "Elasticsearch hybrid search",
        url: "https://www.elastic.co/guide/en/elasticsearch/reference/current/rrf.html",
        note: "Fusión de ranking lexical/vector",
      },
      {
        label: "OWASP LLM Prompt Injection Prevention",
        url: "https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html",
        note: "Aislamiento de instrucciones y contenido",
      },
    ],
    books: [
      { label: "Designing Data-Intensive Applications", note: "Consulta selectiva: contratos, consistencia, operación y trade-offs; no reemplaza las instrucciones de la sección." },
      { label: "Site Reliability Engineering", note: "Consulta selectiva: SLO, incidentes, capacidad y cambio seguro." },
    ],
    courses: [
      { label: "MIT OpenCourseWare — 6.100L", url: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/", note: "Referencia de práctica incremental y contratos verificables." },
      { label: "Harvard CS50P", url: "https://cs50.harvard.edu/python/", note: "Referencia de problem sets, tests y proyecto final reproducible." },
    ],
  },
}
