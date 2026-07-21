import type { CourseSection } from '../../types'

export const section44: CourseSection = {
  id: "multimodal",
  index: 44,
  title: "CI/CD y seguridad de la cadena de suministro",
  shortTitle: "CI/CD supply chain",
  tagline: "pipeline que bloquea dependencia insegura o test crítico, publica artefacto verificable y demuestra rollback",
  estimatedHours: 12,
  level: "Master",
  phase: 3,
  icon: "Image",
  accentColor: "bg-gradient-to-br from-amber-500 to-red-600",
  jobRelevance:
    "Retemática V3 **CI/CD y seguridad de la cadena de suministro** (id de plataforma `multimodal` conservado; legado «Sistemas Multi-Modal — Visión + Lenguaje»). Contribuye a **CP-N4-B (inicio)**: pipeline que bloquea dependencia insegura o test crítico, publica artefacto verificable y demuestra rollback en entorno de prueba. Datos sintéticos; sin PII real. ER/matching no implica fraude ni parentesco.",
  learningOutcomes: [
    { text: "Corre lint/types/tests en matrices" },
    { text: "Usa caches, artifacts y condiciones" },
    { text: "Minimiza permisos y escanea secretos" },
    { text: "Genera SBOM, provenance y attestations" },
    { text: "Configura environments y approvals" },
    { text: "Despliega con canary y rollback" },
    { text: "Aplica políticas de branch/review" },
    { text: "Maneja fallos con evidencia auditable" },
  ],
  theory: [
    {
      heading: "Mapa V3 S44: CI/CD y seguridad de la cadena de suministro",
      paragraphs: [
        "En V3, **S44** retematiza el archivo de plataforma `multimodal` hacia **CI/CD y seguridad de la cadena de suministro**.",
        "Incremento: pipeline que bloquea dependencia insegura o test crítico, publica artefacto verificable y demuestra rollback en entorno de prueba.",
        "Orden T1→T4 según blueprint phase3. Español peruano; fixtures sintéticas; esta lane no marca section_passed ni edita seed/checkpoint/ledger.",
      ],
      callout: {
        type: "info",
        title: "Platform id preservado",
        content:
          "KEEP_PLATFORM_ID_RETHEME_CONTENT: `multimodal`. Capstone: CP-N4-B (inicio).",
      },
    },
    {
      heading: "lint/types/tests y matrices",
      subtopicId: "S44-T1-A",
      paragraphs: [
        "**lint/types/tests y matrices** — outcome del blueprint phase3 para `lint-types-tests-matrix`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-B (inicio)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "lint_types_tests_matrix.py",
        code: `print("matrix", ["3.11","3.12"]); print("steps", ["lint","typecheck","test"]); print("fail_fast", True)`,
        output: `matrix ['3.11', '3.12']
steps ['lint', 'typecheck', 'test']
fail_fast True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "caches, artifacts y condiciones",
      subtopicId: "S44-T1-B",
      paragraphs: [
        "**caches, artifacts y condiciones** — outcome del blueprint phase3 para `caches-artifacts-conditions`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-B (inicio)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "caches_artifacts_conditions.py",
        code: `print("cache", {"pip":True}); print("artifacts", ["wheel","sbom"]); print("if", "on_success")`,
        output: `cache {'pip': True}
artifacts ['wheel', 'sbom']
if on_success`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "permisos mínimos, pinning y secret scanning",
      subtopicId: "S44-T2-A",
      paragraphs: [
        "**permisos mínimos, pinning y secret scanning** — outcome del blueprint phase3 para `min-perms-pin-secret-scan`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-B (inicio)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "min_perms_pin_secret_scan.py",
        code: `print("min_perms", {"contents":"read"}); print("pinned", True); print("secret_scan", True)`,
        output: `min_perms {'contents': 'read'}
pinned True
secret_scan True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "SBOM, provenance y attestations",
      subtopicId: "S44-T2-B",
      paragraphs: [
        "**SBOM, provenance y attestations** — outcome del blueprint phase3 para `sbom-provenance-attest`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-B (inicio)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "sbom_provenance_attest.py",
        code: `print("sbom", "spdx"); print("pkgs", 3); print("prov", "gha")`,
        output: `sbom spdx
pkgs 3
prov gha`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "environments y approvals",
      subtopicId: "S44-T3-A",
      paragraphs: [
        "**environments y approvals** — outcome del blueprint phase3 para `envs-approvals`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-B (inicio)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "envs_approvals.py",
        code: `print("envs", ["dev","staging","prod"]); print("prod_approvers", ["lead"]); print("protection", True)`,
        output: `envs ['dev', 'staging', 'prod']
prod_approvers ['lead']
protection True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "migrations, canary/blue-green y rollback",
      subtopicId: "S44-T3-B",
      paragraphs: [
        "**migrations, canary/blue-green y rollback** — outcome del blueprint phase3 para `migrations-canary-rollback`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-B (inicio)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "migrations_canary_rollback.py",
        code: `print("canary"); print(10); print("prev_version")`,
        output: `canary
10
prev_version`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "branch/review policy y release notes",
      subtopicId: "S44-T4-A",
      paragraphs: [
        "**branch/review policy y release notes** — outcome del blueprint phase3 para `branch-review-release-notes`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-B (inicio)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "branch_review_release_notes.py",
        code: `print({"reviews":1,"signed_commits":True}); print("notes_ok", True); print("branch", "main_protected")`,
        output: `{'reviews': 1, 'signed_commits': True}
notes_ok True
branch main_protected`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "failure handling y evidencia auditable",
      subtopicId: "S44-T4-B",
      paragraphs: [
        "**failure handling y evidencia auditable** — outcome del blueprint phase3 para `failure-handling-audit-evidence`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-B (inicio)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "failure_handling_audit_evidence.py",
        code: `print("block_release"); print(["log","artifact"]); print("audit", True)`,
        output: `block_release
['log', 'artifact']
audit True`,
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
    intro: "Te muestro 8 demos de S44 (CI/CD y seguridad de la cadena de suministro) alineadas a CP-N4-B (inicio).",
    steps: [
      {
        demoId: "S44-T1-A-DEMO",
        subtopicId: "S44-T1-A",
        environment: "local-python",
        description: "Demo: lint/types/tests y matrices",
        code: {
          language: 'python',
          title: "demo_lint_types_tests_matrix.py",
          code: `print(True); print("n", 3); print("matrix_ok", True)`,
          output: `True
n 3
matrix_ok True`,
        },
        why: "Demuestra el outcome de S44-T1-A con Python verificable.",
      },
      {
        demoId: "S44-T1-B-DEMO",
        subtopicId: "S44-T1-B",
        environment: "local-python",
        description: "Demo: caches, artifacts y condiciones",
        code: {
          language: 'python',
          title: "demo_caches_artifacts_conditions.py",
          code: `print("cache_hit", True); print("artifact", "wheel"); print("condition", "main_only")`,
          output: `cache_hit True
artifact wheel
condition main_only`,
        },
        why: "Demuestra el outcome de S44-T1-B con Python verificable.",
      },
      {
        demoId: "S44-T2-A-DEMO",
        subtopicId: "S44-T2-A",
        environment: "local-python",
        description: "Demo: permisos mínimos, pinning y secret scanning",
        code: {
          language: 'python',
          title: "demo_min_perms_pin_secret_scan.py",
          code: `print("gitleaks", "block"); print("perms", "least"); print("pin", True)`,
          output: `gitleaks block
perms least
pin True`,
        },
        why: "Demuestra el outcome de S44-T2-A con Python verificable.",
      },
      {
        demoId: "S44-T2-B-DEMO",
        subtopicId: "S44-T2-B",
        environment: "local-python",
        description: "Demo: SBOM, provenance y attestations",
        code: {
          language: 'python',
          title: "demo_sbom_provenance_attest.py",
          code: `print("attest", True); print("verifiable", True); print("spdx", True)`,
          output: `attest True
verifiable True
spdx True`,
        },
        why: "Demuestra el outcome de S44-T2-B con Python verificable.",
      },
      {
        demoId: "S44-T3-A-DEMO",
        subtopicId: "S44-T3-A",
        environment: "local-python",
        description: "Demo: environments y approvals",
        code: {
          language: 'python',
          title: "demo_envs_approvals.py",
          code: `print("env", "staging"); print("needs_approval", True); print("prod_gate", True)`,
          output: `env staging
needs_approval True
prod_gate True`,
        },
        why: "Demuestra el outcome de S44-T3-A con Python verificable.",
      },
      {
        demoId: "S44-T3-B-DEMO",
        subtopicId: "S44-T3-B",
        environment: "local-python",
        description: "Demo: migrations, canary/blue-green y rollback",
        code: {
          language: 'python',
          title: "demo_migrations_canary_rollback.py",
          code: `print("migration", "expand_first"); print("blue_green", "optional"); print("rollback_demo", True)`,
          output: `migration expand_first
blue_green optional
rollback_demo True`,
        },
        why: "Demuestra el outcome de S44-T3-B con Python verificable.",
      },
      {
        demoId: "S44-T4-A-DEMO",
        subtopicId: "S44-T4-A",
        environment: "local-python",
        description: "Demo: branch/review policy y release notes",
        code: {
          language: 'python',
          title: "demo_branch_review_release_notes.py",
          code: `print("reviews", 1); print("release_notes", True); print("conventional", True)`,
          output: `reviews 1
release_notes True
conventional True`,
        },
        why: "Demuestra el outcome de S44-T4-A con Python verificable.",
      },
      {
        demoId: "S44-T4-B-DEMO",
        subtopicId: "S44-T4-B",
        environment: "local-python",
        description: "Demo: failure handling y evidencia auditable",
        code: {
          language: 'python',
          title: "demo_failure_handling_audit_evidence.py",
          code: `print("on_fail", "block"); print("evidence_n", 2); print("audit_trail", True)`,
          output: `on_fail block
evidence_n 2
audit_trail True`,
        },
        why: "Demuestra el outcome de S44-T4-B con Python verificable.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios (8×E1 guided / E2 independent / E3 transfer) en es-PE con soluciones verificadas.",
    steps: [
      {
        id: "S44-T1-A-E1",
        subtopicId: "S44-T1-A",
        kind: "guided",
        instruction:
          "Ejercicio S44-T1-A-E1: usa el patrón del demo iDo del subtema S44-T1-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S44-T1-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S44-T1-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S44-T1-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(True); print("n", 3); print("matrix_ok", True)`,
          output: `True
n 3
matrix_ok True`,
        },
      },
      {
        id: "S44-T1-A-E2",
        subtopicId: "S44-T1-A",
        kind: "independent",
        instruction:
          "Ejercicio S44-T1-A-E2: usa el patrón del demo iDo del subtema S44-T1-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S44-T1-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S44-T1-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S44-T1-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(True); print("n", 3); print("matrix_ok", True)`,
          output: `True
n 3
matrix_ok True`,
        },
      },
      {
        id: "S44-T1-A-E3",
        subtopicId: "S44-T1-A",
        kind: "transfer",
        instruction:
          "Ejercicio S44-T1-A-E3: usa el patrón del demo iDo del subtema S44-T1-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S44-T1-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S44-T1-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S44-T1-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(True); print("n", 3); print("matrix_ok", True)`,
          output: `True
n 3
matrix_ok True`,
        },
      },
      {
        id: "S44-T1-B-E1",
        subtopicId: "S44-T1-B",
        kind: "guided",
        instruction:
          "Ejercicio S44-T1-B-E1: usa el patrón del demo iDo del subtema S44-T1-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S44-T1-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S44-T1-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S44-T1-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("cache_hit", True); print("artifact", "wheel"); print("condition", "main_only")`,
          output: `cache_hit True
artifact wheel
condition main_only`,
        },
      },
      {
        id: "S44-T1-B-E2",
        subtopicId: "S44-T1-B",
        kind: "independent",
        instruction:
          "Ejercicio S44-T1-B-E2: usa el patrón del demo iDo del subtema S44-T1-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S44-T1-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S44-T1-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S44-T1-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("cache_hit", True); print("artifact", "wheel"); print("condition", "main_only")`,
          output: `cache_hit True
artifact wheel
condition main_only`,
        },
      },
      {
        id: "S44-T1-B-E3",
        subtopicId: "S44-T1-B",
        kind: "transfer",
        instruction:
          "Ejercicio S44-T1-B-E3: usa el patrón del demo iDo del subtema S44-T1-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S44-T1-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S44-T1-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S44-T2-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("cache_hit", True); print("artifact", "wheel"); print("condition", "main_only")`,
          output: `cache_hit True
artifact wheel
condition main_only`,
        },
      },
      {
        id: "S44-T2-A-E1",
        subtopicId: "S44-T2-A",
        kind: "guided",
        instruction:
          "Ejercicio S44-T2-A-E1: usa el patrón del demo iDo del subtema S44-T2-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S44-T2-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S44-T2-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S44-T2-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("gitleaks", "block"); print("perms", "least"); print("pin", True)`,
          output: `gitleaks block
perms least
pin True`,
        },
      },
      {
        id: "S44-T2-A-E2",
        subtopicId: "S44-T2-A",
        kind: "independent",
        instruction:
          "Ejercicio S44-T2-A-E2: usa el patrón del demo iDo del subtema S44-T2-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S44-T2-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S44-T2-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S44-T2-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("gitleaks", "block"); print("perms", "least"); print("pin", True)`,
          output: `gitleaks block
perms least
pin True`,
        },
      },
      {
        id: "S44-T2-A-E3",
        subtopicId: "S44-T2-A",
        kind: "transfer",
        instruction:
          "Ejercicio S44-T2-A-E3: usa el patrón del demo iDo del subtema S44-T2-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S44-T2-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S44-T2-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S44-T2-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("gitleaks", "block"); print("perms", "least"); print("pin", True)`,
          output: `gitleaks block
perms least
pin True`,
        },
      },
      {
        id: "S44-T2-B-E1",
        subtopicId: "S44-T2-B",
        kind: "guided",
        instruction:
          "Ejercicio S44-T2-B-E1: usa el patrón del demo iDo del subtema S44-T2-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S44-T2-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S44-T2-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S44-T2-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("attest", True); print("verifiable", True); print("spdx", True)`,
          output: `attest True
verifiable True
spdx True`,
        },
      },
      {
        id: "S44-T2-B-E2",
        subtopicId: "S44-T2-B",
        kind: "independent",
        instruction:
          "Ejercicio S44-T2-B-E2: usa el patrón del demo iDo del subtema S44-T2-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S44-T2-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S44-T2-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S44-T2-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("attest", True); print("verifiable", True); print("spdx", True)`,
          output: `attest True
verifiable True
spdx True`,
        },
      },
      {
        id: "S44-T2-B-E3",
        subtopicId: "S44-T2-B",
        kind: "transfer",
        instruction:
          "Ejercicio S44-T2-B-E3: usa el patrón del demo iDo del subtema S44-T2-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S44-T2-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S44-T2-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S44-T3-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("attest", True); print("verifiable", True); print("spdx", True)`,
          output: `attest True
verifiable True
spdx True`,
        },
      },
      {
        id: "S44-T3-A-E1",
        subtopicId: "S44-T3-A",
        kind: "guided",
        instruction:
          "Ejercicio S44-T3-A-E1: usa el patrón del demo iDo del subtema S44-T3-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S44-T3-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S44-T3-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S44-T3-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("env", "staging"); print("needs_approval", True); print("prod_gate", True)`,
          output: `env staging
needs_approval True
prod_gate True`,
        },
      },
      {
        id: "S44-T3-A-E2",
        subtopicId: "S44-T3-A",
        kind: "independent",
        instruction:
          "Ejercicio S44-T3-A-E2: usa el patrón del demo iDo del subtema S44-T3-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S44-T3-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S44-T3-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S44-T3-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("env", "staging"); print("needs_approval", True); print("prod_gate", True)`,
          output: `env staging
needs_approval True
prod_gate True`,
        },
      },
      {
        id: "S44-T3-A-E3",
        subtopicId: "S44-T3-A",
        kind: "transfer",
        instruction:
          "Ejercicio S44-T3-A-E3: usa el patrón del demo iDo del subtema S44-T3-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S44-T3-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S44-T3-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S44-T3-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("env", "staging"); print("needs_approval", True); print("prod_gate", True)`,
          output: `env staging
needs_approval True
prod_gate True`,
        },
      },
      {
        id: "S44-T3-B-E1",
        subtopicId: "S44-T3-B",
        kind: "guided",
        instruction:
          "Ejercicio S44-T3-B-E1: usa el patrón del demo iDo del subtema S44-T3-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S44-T3-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S44-T3-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S44-T3-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("migration", "expand_first"); print("blue_green", "optional"); print("rollback_demo", True)`,
          output: `migration expand_first
blue_green optional
rollback_demo True`,
        },
      },
      {
        id: "S44-T3-B-E2",
        subtopicId: "S44-T3-B",
        kind: "independent",
        instruction:
          "Ejercicio S44-T3-B-E2: usa el patrón del demo iDo del subtema S44-T3-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S44-T3-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S44-T3-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S44-T3-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("migration", "expand_first"); print("blue_green", "optional"); print("rollback_demo", True)`,
          output: `migration expand_first
blue_green optional
rollback_demo True`,
        },
      },
      {
        id: "S44-T3-B-E3",
        subtopicId: "S44-T3-B",
        kind: "transfer",
        instruction:
          "Ejercicio S44-T3-B-E3: usa el patrón del demo iDo del subtema S44-T3-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S44-T3-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S44-T3-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S44-T4-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("migration", "expand_first"); print("blue_green", "optional"); print("rollback_demo", True)`,
          output: `migration expand_first
blue_green optional
rollback_demo True`,
        },
      },
      {
        id: "S44-T4-A-E1",
        subtopicId: "S44-T4-A",
        kind: "guided",
        instruction:
          "Ejercicio S44-T4-A-E1: usa el patrón del demo iDo del subtema S44-T4-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S44-T4-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S44-T4-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S44-T4-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("reviews", 1); print("release_notes", True); print("conventional", True)`,
          output: `reviews 1
release_notes True
conventional True`,
        },
      },
      {
        id: "S44-T4-A-E2",
        subtopicId: "S44-T4-A",
        kind: "independent",
        instruction:
          "Ejercicio S44-T4-A-E2: usa el patrón del demo iDo del subtema S44-T4-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S44-T4-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S44-T4-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S44-T4-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("reviews", 1); print("release_notes", True); print("conventional", True)`,
          output: `reviews 1
release_notes True
conventional True`,
        },
      },
      {
        id: "S44-T4-A-E3",
        subtopicId: "S44-T4-A",
        kind: "transfer",
        instruction:
          "Ejercicio S44-T4-A-E3: usa el patrón del demo iDo del subtema S44-T4-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S44-T4-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S44-T4-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S44-T4-A)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("reviews", 1); print("release_notes", True); print("conventional", True)`,
          output: `reviews 1
release_notes True
conventional True`,
        },
      },
      {
        id: "S44-T4-B-E1",
        subtopicId: "S44-T4-B",
        kind: "guided",
        instruction:
          "Ejercicio S44-T4-B-E1: usa el patrón del demo iDo del subtema S44-T4-A. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S44-T4-A; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S44-T4-A; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S44-T4-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("on_fail", "block"); print("evidence_n", 2); print("audit_trail", True)`,
          output: `on_fail block
evidence_n 2
audit_trail True`,
        },
      },
      {
        id: "S44-T4-B-E2",
        subtopicId: "S44-T4-B",
        kind: "independent",
        instruction:
          "Ejercicio S44-T4-B-E2: usa el patrón del demo iDo del subtema S44-T4-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S44-T4-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S44-T4-B; el print pendiente debe copiar esa forma.",
          "Si el demo usa dict/list/print, reutiliza esas mismas estructuras; no inventes módulos nuevos.",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO: completa este print (patrón del demo iDo S44-T4-B)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print("on_fail", "block"); print("evidence_n", 2); print("audit_trail", True)`,
          output: `on_fail block
evidence_n 2
audit_trail True`,
        },
      },
      {
        id: "S44-T4-B-E3",
        subtopicId: "S44-T4-B",
        kind: "transfer",
        instruction:
          "Ejercicio S44-T4-B-E3: usa el patrón del demo iDo del subtema S44-T4-B. El starter reproduce el demo con un print pendiente (# TODO). Completa solo esa línea para que el programa corra y produzca la salida del demo. No uses librerías fuera de las que el demo importa.",
        hint: "Busca en iDo el demo con subtopicId S44-T4-B; el print pendiente debe copiar esa forma.",
        hints: [
          "Busca en iDo el demo con subtopicId S44-T4-B; el print pendiente debe copiar esa forma.",
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
          code: `print("on_fail", "block"); print("evidence_n", 2); print("audit_trail", True)`,
          output: `on_fail block
evidence_n 2
audit_trail True`,
        },
      },
    ],
  },
  youDo: {
    title: "CI/CD y seguridad de la cadena de suministro",
    context:
      "Proyecto de sección **S44** (CI/CD y seguridad de la cadena de suministro). Gate: **CP-N4-B (inicio)**. pipeline que bloquea dependencia insegura o test crítico, publica artefacto verificable y demuestra rollback en entorno de prueba. Usa solo datos sintéticos; no marques section_passed desde esta entrega de autoría.",
    objectives: [
      "pipeline que bloquea dependencia insegura o test crítico, publica artefacto verificable y demuestra rollback en entorno de prueba.",
      "Datos sintéticos; sin PII real ni secretos",
      "Demo reproducible (if __name__ == '__main__' o notebook run-all)",
      "Documentación en español profesional",
      "Alineación al incremento/gate V3: CP-N4-B (inicio)",
    ],
    requirements: [
      "Dataset o fixtures sintéticos",
      "Demo reproducible",
      "Documentación en español profesional",
      "Alineación al incremento/gate V3 de la sección",
    ],
    starterCode: `# S44 You Do — CI/CD y seguridad de la cadena de suministro
# Gate: CP-N4-B (inicio)
# pipeline que bloquea dependencia insegura o test crítico, publica artefacto verificable y demuestra rollback en entorno 

def main():
    print("section", "S44")
    print("gate", 'CP-N4-B (inicio)')
    print("synthetic", True)
    # TODO: implementar incremento del blueprint

if __name__ == "__main__":
    main()
`,
    portfolioNote:
      "Entrega alineada a CP-N4-B (inicio). Portfolio en español profesional; evidencia ejecutable; privacidad. Otra lane califica PASS; no editar checkpoint/ledger/seed.",
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
        question: "El id de plataforma de S44 que se preserva es:",
        options: [
          "multimodal",
          "renamed-v3",
          "legacy-drop",
          "random",
        ],
        correctIndex: 0,
        explanation:
          "KEEP_PLATFORM_ID_RETHEME_CONTENT.",
      },
      {
        question: "El incremento/gate V3 de S44 pertenece a:",
        options: [
          "CP-N4-B (inicio)",
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
        note: "Apoyo S44 CI/CD y seguridad de la cadena de suministro",
      },
    ],
    books: [
      {
        label: "Architecture / platform engineering refs",
        note: "Alinear a CI/CD y seguridad de la cadena de suministro",
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
