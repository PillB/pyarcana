import type { CourseSection } from '../../types'

export const section48: CourseSection = {
  id: "ai-governance",
  index: 48,
  title: "LLM applications y RAG con evidencia",
  shortTitle: "RAG con evidencia",
  tagline: "asistente sobre docs autorizados, citas verificables y abstención cuando retrieval no sostiene la respuesta",
  estimatedHours: 14,
  level: "Master",
  phase: 3,
  icon: "Scale",
  accentColor: "bg-gradient-to-br from-amber-500 to-red-600",
  jobRelevance:
    "Retemática V3 **LLM applications y RAG con evidencia** (id de plataforma `ai-governance` conservado; legado «Gobernanza de IA, Ética y Compliance»). Contribuye a **CP-N4-C (inicio)**: asistente responde sobre documentación autorizada, cita fragmentos verificables y se abstiene cuando retrieval no sostiene la respuesta. Datos sintéticos; sin PII real. ER/matching no implica fraude ni parentesco.",
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
      heading: "Mapa V3 S48: LLM applications y RAG con evidencia",
      paragraphs: [
        "En V3, **S48** retematiza el archivo de plataforma `ai-governance` hacia **LLM applications y RAG con evidencia**.",
        "Incremento: asistente responde sobre documentación autorizada, cita fragmentos verificables y se abstiene cuando retrieval no sostiene la respuesta.",
        "Orden T1→T4 según blueprint phase3. Español peruano; fixtures sintéticas; esta lane no marca section_passed ni edita seed/checkpoint/ledger.",
      ],
      callout: {
        type: "info",
        title: "Platform id preservado",
        content:
          "KEEP_PLATFORM_ID_RETHEME_CONTENT: `ai-governance`. Capstone: CP-N4-C (inicio).",
      },
    },
    {
      heading: "embeddings y similarity",
      subtopicId: "S48-T1-A",
      paragraphs: [
        "**embeddings y similarity** — outcome del blueprint phase3 para `embeddings-similarity`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-C (inicio)** sin exponer secretos ni PII real.",
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
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "límites, versiones y evaluación",
      subtopicId: "S48-T1-B",
      paragraphs: [
        "**límites, versiones y evaluación** — outcome del blueprint phase3 para `limits-versions-eval`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-C (inicio)** sin exponer secretos ni PII real.",
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
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "chunking, metadata y dedup",
      subtopicId: "S48-T2-A",
      paragraphs: [
        "**chunking, metadata y dedup** — outcome del blueprint phase3 para `chunking-metadata-dedup`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-C (inicio)** sin exponer secretos ni PII real.",
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
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "ACL, deletion y provenance",
      subtopicId: "S48-T2-B",
      paragraphs: [
        "**ACL, deletion y provenance** — outcome del blueprint phase3 para `acl-deletion-provenance`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-C (inicio)** sin exponer secretos ni PII real.",
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
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "lexical/vector/hybrid y reranking",
      subtopicId: "S48-T3-A",
      paragraphs: [
        "**lexical/vector/hybrid y reranking** — outcome del blueprint phase3 para `lexical-vector-hybrid-rerank`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-C (inicio)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "lexical_vector_hybrid_rerank.py",
        code: `print({"d1":0.74,"d2":0.06}); print("rerank", "cross_encoder_stub"); print("mode", "hybrid")`,
        output: `{'d1': 0.74, 'd2': 0.06}
rerank cross_encoder_stub
mode hybrid`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "contexto, citas y permisos",
      subtopicId: "S48-T3-B",
      paragraphs: [
        "**contexto, citas y permisos** — outcome del blueprint phase3 para `context-cites-permissions`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-C (inicio)** sin exponer secretos ni PII real.",
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
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "structured output y grounding",
      subtopicId: "S48-T4-A",
      paragraphs: [
        "**structured output y grounding** — outcome del blueprint phase3 para `structured-grounding`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-C (inicio)** sin exponer secretos ni PII real.",
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
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "retrieval/answer eval, costo y abstención",
      subtopicId: "S48-T4-B",
      paragraphs: [
        "**retrieval/answer eval, costo y abstención** — outcome del blueprint phase3 para `retrieval-answer-eval-cost-abstain`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-C (inicio)** sin exponer secretos ni PII real.",
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
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
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
        why: "Demuestra el outcome de S48-T1-A con Python verificable.",
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
        why: "Demuestra el outcome de S48-T1-B con Python verificable.",
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
        why: "Demuestra el outcome de S48-T2-A con Python verificable.",
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
        why: "Demuestra el outcome de S48-T2-B con Python verificable.",
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
        why: "Demuestra el outcome de S48-T3-A con Python verificable.",
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
        why: "Demuestra el outcome de S48-T3-B con Python verificable.",
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
        why: "Demuestra el outcome de S48-T4-A con Python verificable.",
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
        why: "Demuestra el outcome de S48-T4-B con Python verificable.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios (8×E1 guided / E2 independent / E3 transfer) en es-PE con soluciones verificadas.",
    steps: [
      {
        id: "S48-T1-A-E1",
        subtopicId: "S48-T1-A",
        kind: "guided",
        instruction:
          "Ejercicio S48-T1-A-E1: usa el patrón del demo iDo del subtema S48-T1-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S48-T1-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S48-T1-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S48-T1-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("sim", "cosine"); print("space", "unit"); print("synth_docs", True)`,
          output: `sim cosine
space unit
synth_docs True`,
        },
      },
      {
        id: "S48-T1-A-E2",
        subtopicId: "S48-T1-A",
        kind: "independent",
        instruction:
          "Ejercicio S48-T1-A-E2: usa el patrón del demo iDo del subtema S48-T1-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S48-T1-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S48-T1-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S48-T1-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("sim", "cosine"); print("space", "unit"); print("synth_docs", True)`,
          output: `sim cosine
space unit
synth_docs True`,
        },
      },
      {
        id: "S48-T1-A-E3",
        subtopicId: "S48-T1-A",
        kind: "transfer",
        instruction:
          "Ejercicio S48-T1-A-E3: usa el patrón del demo iDo del subtema S48-T1-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S48-T1-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S48-T1-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S48-T1-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("sim", "cosine"); print("space", "unit"); print("synth_docs", True)`,
          output: `sim cosine
space unit
synth_docs True`,
        },
      },
      {
        id: "S48-T1-B-E1",
        subtopicId: "S48-T1-B",
        kind: "guided",
        instruction:
          "Ejercicio S48-T1-B-E1: usa el patrón del demo iDo del subtema S48-T1-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S48-T1-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S48-T1-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S48-T1-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("eval", "nDCG@10"); print("version", "e5-v1"); print("regression_suite", True)`,
          output: `eval nDCG@10
version e5-v1
regression_suite True`,
        },
      },
      {
        id: "S48-T1-B-E2",
        subtopicId: "S48-T1-B",
        kind: "independent",
        instruction:
          "Ejercicio S48-T1-B-E2: usa el patrón del demo iDo del subtema S48-T1-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S48-T1-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S48-T1-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S48-T1-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("eval", "nDCG@10"); print("version", "e5-v1"); print("regression_suite", True)`,
          output: `eval nDCG@10
version e5-v1
regression_suite True`,
        },
      },
      {
        id: "S48-T1-B-E3",
        subtopicId: "S48-T1-B",
        kind: "transfer",
        instruction:
          "Ejercicio S48-T1-B-E3: usa el patrón del demo iDo del subtema S48-T1-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S48-T1-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S48-T1-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S48-T2-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("eval", "nDCG@10"); print("version", "e5-v1"); print("regression_suite", True)`,
          output: `eval nDCG@10
version e5-v1
regression_suite True`,
        },
      },
      {
        id: "S48-T2-A-E1",
        subtopicId: "S48-T2-A",
        kind: "guided",
        instruction:
          "Ejercicio S48-T2-A-E1: usa el patrón del demo iDo del subtema S48-T2-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S48-T2-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S48-T2-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S48-T2-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("chunk_n", 3); print("overlap", "optional"); print("dedup_key", "sha1")`,
          output: `chunk_n 3
overlap optional
dedup_key sha1`,
        },
      },
      {
        id: "S48-T2-A-E2",
        subtopicId: "S48-T2-A",
        kind: "independent",
        instruction:
          "Ejercicio S48-T2-A-E2: usa el patrón del demo iDo del subtema S48-T2-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S48-T2-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S48-T2-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S48-T2-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("chunk_n", 3); print("overlap", "optional"); print("dedup_key", "sha1")`,
          output: `chunk_n 3
overlap optional
dedup_key sha1`,
        },
      },
      {
        id: "S48-T2-A-E3",
        subtopicId: "S48-T2-A",
        kind: "transfer",
        instruction:
          "Ejercicio S48-T2-A-E3: usa el patrón del demo iDo del subtema S48-T2-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S48-T2-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S48-T2-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S48-T2-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("chunk_n", 3); print("overlap", "optional"); print("dedup_key", "sha1")`,
          output: `chunk_n 3
overlap optional
dedup_key sha1`,
        },
      },
      {
        id: "S48-T2-B-E1",
        subtopicId: "S48-T2-B",
        kind: "guided",
        instruction:
          "Ejercicio S48-T2-B-E1: usa el patrón del demo iDo del subtema S48-T2-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S48-T2-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S48-T2-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S48-T2-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("provenance", "doc_version"); print("acl_enforce", True); print("hard_delete", "policy")`,
          output: `provenance doc_version
acl_enforce True
hard_delete policy`,
        },
      },
      {
        id: "S48-T2-B-E2",
        subtopicId: "S48-T2-B",
        kind: "independent",
        instruction:
          "Ejercicio S48-T2-B-E2: usa el patrón del demo iDo del subtema S48-T2-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S48-T2-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S48-T2-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S48-T2-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("provenance", "doc_version"); print("acl_enforce", True); print("hard_delete", "policy")`,
          output: `provenance doc_version
acl_enforce True
hard_delete policy`,
        },
      },
      {
        id: "S48-T2-B-E3",
        subtopicId: "S48-T2-B",
        kind: "transfer",
        instruction:
          "Ejercicio S48-T2-B-E3: usa el patrón del demo iDo del subtema S48-T2-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S48-T2-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S48-T2-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S48-T3-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("provenance", "doc_version"); print("acl_enforce", True); print("hard_delete", "policy")`,
          output: `provenance doc_version
acl_enforce True
hard_delete policy`,
        },
      },
      {
        id: "S48-T3-A-E1",
        subtopicId: "S48-T3-A",
        kind: "guided",
        instruction:
          "Ejercicio S48-T3-A-E1: usa el patrón del demo iDo del subtema S48-T3-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S48-T3-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S48-T3-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S48-T3-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("lexical", "bm25_like"); print("vector", "cosine"); print("fuse", "linear")`,
          output: `lexical bm25_like
vector cosine
fuse linear`,
        },
      },
      {
        id: "S48-T3-A-E2",
        subtopicId: "S48-T3-A",
        kind: "independent",
        instruction:
          "Ejercicio S48-T3-A-E2: usa el patrón del demo iDo del subtema S48-T3-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S48-T3-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S48-T3-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S48-T3-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("lexical", "bm25_like"); print("vector", "cosine"); print("fuse", "linear")`,
          output: `lexical bm25_like
vector cosine
fuse linear`,
        },
      },
      {
        id: "S48-T3-A-E3",
        subtopicId: "S48-T3-A",
        kind: "transfer",
        instruction:
          "Ejercicio S48-T3-A-E3: usa el patrón del demo iDo del subtema S48-T3-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S48-T3-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S48-T3-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S48-T3-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("lexical", "bm25_like"); print("vector", "cosine"); print("fuse", "linear")`,
          output: `lexical bm25_like
vector cosine
fuse linear`,
        },
      },
      {
        id: "S48-T3-B-E1",
        subtopicId: "S48-T3-B",
        kind: "guided",
        instruction:
          "Ejercicio S48-T3-B-E1: usa el patrón del demo iDo del subtema S48-T3-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S48-T3-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S48-T3-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S48-T3-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("cites", True); print("drop_denied", True); print("context_budget", 2)`,
          output: `cites True
drop_denied True
context_budget 2`,
        },
      },
      {
        id: "S48-T3-B-E2",
        subtopicId: "S48-T3-B",
        kind: "independent",
        instruction:
          "Ejercicio S48-T3-B-E2: usa el patrón del demo iDo del subtema S48-T3-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S48-T3-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S48-T3-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S48-T3-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("cites", True); print("drop_denied", True); print("context_budget", 2)`,
          output: `cites True
drop_denied True
context_budget 2`,
        },
      },
      {
        id: "S48-T3-B-E3",
        subtopicId: "S48-T3-B",
        kind: "transfer",
        instruction:
          "Ejercicio S48-T3-B-E3: usa el patrón del demo iDo del subtema S48-T3-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S48-T3-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S48-T3-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S48-T4-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("cites", True); print("drop_denied", True); print("context_budget", 2)`,
          output: `cites True
drop_denied True
context_budget 2`,
        },
      },
      {
        id: "S48-T4-A-E1",
        subtopicId: "S48-T4-A",
        kind: "guided",
        instruction:
          "Ejercicio S48-T4-A-E1: usa el patrón del demo iDo del subtema S48-T4-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S48-T4-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S48-T4-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S48-T4-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("structured", {"decision":"ok","cites":["c1"]}); print("grounded", True); print("schema", True)`,
          output: `structured {'decision': 'ok', 'cites': ['c1']}
grounded True
schema True`,
        },
      },
      {
        id: "S48-T4-A-E2",
        subtopicId: "S48-T4-A",
        kind: "independent",
        instruction:
          "Ejercicio S48-T4-A-E2: usa el patrón del demo iDo del subtema S48-T4-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S48-T4-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S48-T4-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S48-T4-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("structured", {"decision":"ok","cites":["c1"]}); print("grounded", True); print("schema", True)`,
          output: `structured {'decision': 'ok', 'cites': ['c1']}
grounded True
schema True`,
        },
      },
      {
        id: "S48-T4-A-E3",
        subtopicId: "S48-T4-A",
        kind: "transfer",
        instruction:
          "Ejercicio S48-T4-A-E3: usa el patrón del demo iDo del subtema S48-T4-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S48-T4-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S48-T4-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S48-T4-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("structured", {"decision":"ok","cites":["c1"]}); print("grounded", True); print("schema", True)`,
          output: `structured {'decision': 'ok', 'cites': ['c1']}
grounded True
schema True`,
        },
      },
      {
        id: "S48-T4-B-E1",
        subtopicId: "S48-T4-B",
        kind: "guided",
        instruction:
          "Ejercicio S48-T4-B-E1: usa el patrón del demo iDo del subtema S48-T4-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S48-T4-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S48-T4-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S48-T4-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("eval", "answer_faithfulness"); print("abstain", True); print("cost_cap", True)`,
          output: `eval answer_faithfulness
abstain True
cost_cap True`,
        },
      },
      {
        id: "S48-T4-B-E2",
        subtopicId: "S48-T4-B",
        kind: "independent",
        instruction:
          "Ejercicio S48-T4-B-E2: usa el patrón del demo iDo del subtema S48-T4-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S48-T4-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S48-T4-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S48-T4-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("eval", "answer_faithfulness"); print("abstain", True); print("cost_cap", True)`,
          output: `eval answer_faithfulness
abstain True
cost_cap True`,
        },
      },
      {
        id: "S48-T4-B-E3",
        subtopicId: "S48-T4-B",
        kind: "transfer",
        instruction:
          "Ejercicio S48-T4-B-E3: usa el patrón del demo iDo del subtema S48-T4-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S48-T4-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S48-T4-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: escribe el print final como en el demo iDo del mismo subtopicId
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("eval", "answer_faithfulness"); print("abstain", True); print("cost_cap", True)`,
          output: `eval answer_faithfulness
abstain True
cost_cap True`,
        },
      },
    ],
  },
  youDo: {
    title: "LLM applications y RAG con evidencia",
    context:
      "Proyecto de sección **S48** (LLM applications y RAG con evidencia). Gate: **CP-N4-C (inicio)**. asistente responde sobre documentación autorizada, cita fragmentos verificables y se abstiene cuando retrieval no sostiene la respuesta. Usa solo datos sintéticos; no marques section_passed desde esta entrega de autoría.",
    objectives: [
      "asistente responde sobre documentación autorizada, cita fragmentos verificables y se abstiene cuando retrieval no sostiene la respuesta.",
      "Datos sintéticos; sin PII real ni secretos",
      "Demo reproducible (if __name__ == '__main__' o notebook run-all)",
      "Documentación en español profesional",
      "Alineación al incremento/gate V3: CP-N4-C (inicio)",
    ],
    requirements: [
      "Dataset o fixtures sintéticos",
      "Demo reproducible",
      "Documentación en español profesional",
      "Alineación al incremento/gate V3 de la sección",
    ],
    starterCode: `# S48 You Do — LLM applications y RAG con evidencia
# Gate: CP-N4-C (inicio)
# asistente responde sobre documentación autorizada, cita fragmentos verificables y se abstiene cuando retrieval no sostie

def main():
    print("section", "S48")
    print("gate", 'CP-N4-C (inicio)')
    print("synthetic", True)
    # TODO: implementar incremento del blueprint

if __name__ == "__main__":
    main()
`,
    portfolioNote:
      "Entrega alineada a CP-N4-C (inicio). Portfolio en español profesional; evidencia ejecutable; privacidad. Otra lane califica PASS; no editar checkpoint/ledger/seed.",
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
        question: "El id de plataforma de S48 que se preserva es:",
        options: [
          "ai-governance",
          "renamed-v3",
          "legacy-drop",
          "random",
        ],
        correctIndex: 0,
        explanation:
          "KEEP_PLATFORM_ID_RETHEME_CONTENT.",
      },
      {
        question: "El incremento/gate V3 de S48 pertenece a:",
        options: [
          "CP-N4-C (inicio)",
          "CP-N1-A",
          "solo marketing",
          "sin capstone",
        ],
        correctIndex: 0,
        explanation:
          "Blueprint phase3 capstone_notes.",
      },
      {
        question: "Los ejemplos del curso deben usar:",
        options: [
          "PII real de clientes",
          "Datos sintéticos",
          "Secretos de prod",
          "Claves API reales",
        ],
        correctIndex: 1,
        explanation:
          "Synthetic data only.",
      },
      {
        question: "Entity resolution (si aparece) decide:",
        options: [
          "Fraude",
          "Parentesco",
          "Misma entidad cuando aplique",
          "Sentimiento",
        ],
        correctIndex: 2,
        explanation:
          "ER ≠ relación ≠ fraude.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "Python docs",
        url: "https://docs.python.org/3/",
        note: "Referencia stdlib",
      },
      {
        label: "V3 section support",
        url: "https://docs.python.org/3/library/",
        note: "Apoyo S48 LLM applications y RAG con evidencia",
      },
    ],
    books: [
      {
        label: "Architecture / platform engineering refs",
        note: "Alinear a LLM applications y RAG con evidencia",
      },
      {
        label: "Site Reliability / Security basics",
        note: "Operación y privacidad",
      },
    ],
    courses: [
      {
        label: "MDN / cloud / MLOps primers",
        url: "https://developer.mozilla.org/",
        note: "Complemento conceptual",
      },
    ],
  },
}
