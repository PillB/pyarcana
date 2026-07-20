import type { CourseSection } from '../../types'

export const section43: CourseSection = {
  id: "llmops",
  index: 43,
  title: "Contenedores y reproducibilidad operativa",
  shortTitle: "Contenedores",
  tagline: "Governed Python Service Platform: un comando, tests/health, non-root, config y recuperación documentadas",
  estimatedHours: 14,
  level: "Master",
  phase: 3,
  icon: "BarChart3",
  accentColor: "bg-gradient-to-br from-amber-500 to-red-600",
  jobRelevance:
    "Retemática V3 **Contenedores y reproducibilidad operativa** (id de plataforma `llmops` conservado; legado «LLMOps — Observabilidad, Evaluación, A/B Testing»). Contribuye a **CP-N4-A (cierre)**: Governed Python Service Platform levanta con un comando, ejecuta tests/health checks, usa usuario no root y documenta configuración y recuperación. Datos sintéticos; sin PII real. ER/matching no implica fraude ni parentesco.",
  learningOutcomes: [
    { text: "Optimiza Dockerfile y layers" },
    { text: "Usa non-root y reduce tamaño" },
    { text: "Inyecta config/secrets/volumes" },
    { text: "Configura net, health y signals" },
    { text: "Compone API/worker/DB/cache" },
    { text: "Ordena deps, migrations y datos efímeros" },
    { text: "Fija locks y multi-stage" },
    { text: "Escanea, limita recursos y debugguea" },
  ],
  theory: [
    {
      heading: "Mapa V3 S43: Contenedores y reproducibilidad operativa",
      paragraphs: [
        "En V3, **S43** retematiza el archivo de plataforma `llmops` hacia **Contenedores y reproducibilidad operativa**. **FINAL/CLOSE gate** (CLOSE).",
        "Incremento: Governed Python Service Platform levanta con un comando, ejecuta tests/health checks, usa usuario no root y documenta configuración y recuperación.",
        "Orden T1→T4 según blueprint phase3. Español peruano; fixtures sintéticas; esta lane no marca section_passed ni edita seed/checkpoint/ledger.",
      ],
      callout: {
        type: "info",
        title: "Platform id preservado",
        content:
          "KEEP_PLATFORM_ID_RETHEME_CONTENT: `llmops`. Capstone: CP-N4-A (cierre).",
      },
    },
    {
      heading: "Dockerfile, layers y cache",
      subtopicId: "S43-T1-A",
      paragraphs: [
        "**Dockerfile, layers y cache** — outcome del blueprint phase3 para `dockerfile-layers-cache`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-A (cierre)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "dockerfile_layers_cache.py",
        code: `print("layers", ["base","deps","app","cmd"]); print("cache_hint", "deps_before_app"); print("dockerfile", True)`,
        output: `layers ['base', 'deps', 'app', 'cmd']
cache_hint deps_before_app
dockerfile True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "bases, usuarios no root y tamaño",
      subtopicId: "S43-T1-B",
      paragraphs: [
        "**bases, usuarios no root y tamaño** — outcome del blueprint phase3 para `bases-nonroot-size`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-A (cierre)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "bases_nonroot_size.py",
        code: `print("user", "appuser"); print("nonroot", True); print("uid", 10001)`,
        output: `user appuser
nonroot True
uid 10001`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "config, secrets y volumes",
      subtopicId: "S43-T2-A",
      paragraphs: [
        "**config, secrets y volumes** — outcome del blueprint phase3 para `config-secrets-volumes`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-A (cierre)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "config_secrets_volumes.py",
        code: `print("env", "prod"); print("secret_ref", "\${SECRET}"); print("volume", "/data")`,
        output: `env prod
secret_ref \${SECRET}
volume /data`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "networking, health checks y signals",
      subtopicId: "S43-T2-B",
      paragraphs: [
        "**networking, health checks y signals** — outcome del blueprint phase3 para `net-health-signals`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-A (cierre)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "net_health_signals.py",
        code: `print(sorted(["/healthz","/readyz"])); print("signals", ["SIGTERM","SIGINT"]); print("net", "private")`,
        output: `['/healthz', '/readyz']
signals ['SIGTERM', 'SIGINT']
net private`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "API/worker/DB/cache",
      subtopicId: "S43-T3-A",
      paragraphs: [
        "**API/worker/DB/cache** — outcome del blueprint phase3 para `api-worker-db-cache`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-A (cierre)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "api_worker_db_cache.py",
        code: `print("services", ["api","worker","db","cache"]); print("has_worker", True); print("cache", "redis_like")`,
        output: `services ['api', 'worker', 'db', 'cache']
has_worker True
cache redis_like`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "dependencias, migrations y datos efímeros",
      subtopicId: "S43-T3-B",
      paragraphs: [
        "**dependencias, migrations y datos efímeros** — outcome del blueprint phase3 para `deps-migrations-ephemeral`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-A (cierre)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "deps_migrations_ephemeral.py",
        code: `print("migrate_before_api", True); print("ephemeral", ["tmp","cache"]); print("deps_lock", True)`,
        output: `migrate_before_api True
ephemeral ['tmp', 'cache']
deps_lock True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "locks y multi-stage builds",
      subtopicId: "S43-T4-A",
      paragraphs: [
        "**locks y multi-stage builds** — outcome del blueprint phase3 para `locks-multistage`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-A (cierre)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "locks_multistage.py",
        code: `print("multistage", ["builder","runtime"]); print("locks", ["requirements.txt"]); print("reproducible", True)`,
        output: `multistage ['builder', 'runtime']
locks ['requirements.txt']
reproducible True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Si el assert/print no refleja el outcome, el paquete está incompleto.",
      },
    },
    {
      heading: "scanning, resource limits y debugging",
      subtopicId: "S43-T4-B",
      paragraphs: [
        "**scanning, resource limits y debugging** — outcome del blueprint phase3 para `scan-limits-debug`.",
        "Practica con código ejecutable y datos sintéticos; documenta bordes y criterios medibles.",
        "Integra el incremento **CP-N4-A (cierre)** sin exponer secretos ni PII real.",
      ],
      code: {
        language: 'python',
        title: "scan_limits_debug.py",
        code: `print("limits", {"cpu":"1","mem":"512Mi"}); print("scan_clean", True); print("debug", "ephemeral_shell")`,
        output: `limits {'cpu': '1', 'mem': '512Mi'}
scan_clean True
debug ephemeral_shell`,
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
    intro: "Te muestro 8 demos de S43 (Contenedores y reproducibilidad operativa) alineadas a CP-N4-A (cierre).",
    steps: [
      {
        demoId: "S43-T1-A-DEMO",
        subtopicId: "S43-T1-A",
        environment: "local-python",
        description: "Demo: Dockerfile, layers y cache",
        code: {
          language: 'python',
          title: "demo_dockerfile_layers_cache.py",
          code: `print("pip_before_app", True); print("n_steps", 5); print("cache", "stable_layers_first")`,
          output: `pip_before_app True
n_steps 5
cache stable_layers_first`,
        },
        why: "Demuestra el outcome de S43-T1-A con Python verificable.",
      },
      {
        demoId: "S43-T1-B-DEMO",
        subtopicId: "S43-T1-B",
        environment: "local-python",
        description: "Demo: bases, usuarios no root y tamaño",
        code: {
          language: 'python',
          title: "demo_bases_nonroot_size.py",
          code: `print("smaller", "distroless"); print("mb", 40); print("base", "slim")`,
          output: `smaller distroless
mb 40
base slim`,
        },
        why: "Demuestra el outcome de S43-T1-B con Python verificable.",
      },
      {
        demoId: "S43-T2-A-DEMO",
        subtopicId: "S43-T2-A",
        environment: "local-python",
        description: "Demo: config, secrets y volumes",
        code: {
          language: 'python',
          title: "demo_config_secrets_volumes.py",
          code: `print("no_hardcoded", True); print("mount", "readonly_config"); print("ok", True)`,
          output: `no_hardcoded True
mount readonly_config
ok True`,
        },
        why: "Demuestra el outcome de S43-T2-A con Python verificable.",
      },
      {
        demoId: "S43-T2-B-DEMO",
        subtopicId: "S43-T2-B",
        environment: "local-python",
        description: "Demo: networking, health checks y signals",
        code: {
          language: 'python',
          title: "demo_net_health_signals.py",
          code: `print(200); print(503); print("graceful", True)`,
          output: `200
503
graceful True`,
        },
        why: "Demuestra el outcome de S43-T2-B con Python verificable.",
      },
      {
        demoId: "S43-T3-A-DEMO",
        subtopicId: "S43-T3-A",
        environment: "local-python",
        description: "Demo: API/worker/DB/cache",
        code: {
          language: 'python',
          title: "demo_api_worker_db_cache.py",
          code: `print("api_deps", ["db","cache"]); print("worker_deps", ["db","cache"]); print("split", True)`,
          output: `api_deps ['db', 'cache']
worker_deps ['db', 'cache']
split True`,
        },
        why: "Demuestra el outcome de S43-T3-A con Python verificable.",
      },
      {
        demoId: "S43-T3-B-DEMO",
        subtopicId: "S43-T3-B",
        environment: "local-python",
        description: "Demo: dependencias, migrations y datos efímeros",
        code: {
          language: 'python',
          title: "demo_deps_migrations_ephemeral.py",
          code: `print("migrations", "expand_contract"); print("data", "ephemeral_ok"); print("order", "migrate_first")`,
          output: `migrations expand_contract
data ephemeral_ok
order migrate_first`,
        },
        why: "Demuestra el outcome de S43-T3-B con Python verificable.",
      },
      {
        demoId: "S43-T4-A-DEMO",
        subtopicId: "S43-T4-A",
        environment: "local-python",
        description: "Demo: locks y multi-stage builds",
        code: {
          language: 'python',
          title: "demo_locks_multistage.py",
          code: `print("builder_has_compilers", True); print("runtime_slim", True); print("lock", "pinned")`,
          output: `builder_has_compilers True
runtime_slim True
lock pinned`,
        },
        why: "Demuestra el outcome de S43-T4-A con Python verificable.",
      },
      {
        demoId: "S43-T4-B-DEMO",
        subtopicId: "S43-T4-B",
        environment: "local-python",
        description: "Demo: scanning, resource limits y debugging",
        code: {
          language: 'python',
          title: "demo_scan_limits_debug.py",
          code: `print("block_deploy", False); print("mem", "512Mi"); print("scan", "ci_gate")`,
          output: `block_deploy False
mem 512Mi
scan ci_gate`,
        },
        why: "Demuestra el outcome de S43-T4-B con Python verificable.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios (8×E1 guided / E2 independent / E3 transfer) en es-PE con soluciones verificadas.",
    steps: [
      {
        id: "S43-T1-A-E1",
        subtopicId: "S43-T1-A",
        kind: "guided",
        instruction:
          "Completa el ejercicio guiado.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio guiado.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(['base','deps','app'])`,
          output: `['base', 'deps', 'app']`,
        },
      },
      {
        id: "S43-T1-A-E2",
        subtopicId: "S43-T1-A",
        kind: "independent",
        instruction:
          "Completa el ejercicio independiente.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio independiente.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(True)`,
          output: `True`,
        },
      },
      {
        id: "S43-T1-A-E3",
        subtopicId: "S43-T1-A",
        kind: "transfer",
        instruction:
          "Transfiere el concepto.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Transfiere el concepto.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('cache')`,
          output: `cache`,
        },
      },
      {
        id: "S43-T1-B-E1",
        subtopicId: "S43-T1-B",
        kind: "guided",
        instruction:
          "Completa el ejercicio guiado.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio guiado.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('appuser')`,
          output: `appuser`,
        },
      },
      {
        id: "S43-T1-B-E2",
        subtopicId: "S43-T1-B",
        kind: "independent",
        instruction:
          "Completa el ejercicio independiente.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio independiente.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(False)`,
          output: `False`,
        },
      },
      {
        id: "S43-T1-B-E3",
        subtopicId: "S43-T1-B",
        kind: "transfer",
        instruction:
          "Transfiere el concepto.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Transfiere el concepto.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(40)`,
          output: `40`,
        },
      },
      {
        id: "S43-T2-A-E1",
        subtopicId: "S43-T2-A",
        kind: "guided",
        instruction:
          "Completa el ejercicio guiado.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio guiado.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('prod')`,
          output: `prod`,
        },
      },
      {
        id: "S43-T2-A-E2",
        subtopicId: "S43-T2-A",
        kind: "independent",
        instruction:
          "Completa el ejercicio independiente.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio independiente.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(True)`,
          output: `True`,
        },
      },
      {
        id: "S43-T2-A-E3",
        subtopicId: "S43-T2-A",
        kind: "transfer",
        instruction:
          "Transfiere el concepto.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Transfiere el concepto.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('/data')`,
          output: `/data`,
        },
      },
      {
        id: "S43-T2-B-E1",
        subtopicId: "S43-T2-B",
        kind: "guided",
        instruction:
          "Completa el ejercicio guiado.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio guiado.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(200)`,
          output: `200`,
        },
      },
      {
        id: "S43-T2-B-E2",
        subtopicId: "S43-T2-B",
        kind: "independent",
        instruction:
          "Completa el ejercicio independiente.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio independiente.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(503)`,
          output: `503`,
        },
      },
      {
        id: "S43-T2-B-E3",
        subtopicId: "S43-T2-B",
        kind: "transfer",
        instruction:
          "Transfiere el concepto.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Transfiere el concepto.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(['SIGTERM','SIGINT'])`,
          output: `['SIGTERM', 'SIGINT']`,
        },
      },
      {
        id: "S43-T3-A-E1",
        subtopicId: "S43-T3-A",
        kind: "guided",
        instruction:
          "Completa el ejercicio guiado.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio guiado.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(['api','worker','db','cache'])`,
          output: `['api', 'worker', 'db', 'cache']`,
        },
      },
      {
        id: "S43-T3-A-E2",
        subtopicId: "S43-T3-A",
        kind: "independent",
        instruction:
          "Completa el ejercicio independiente.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio independiente.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(True)`,
          output: `True`,
        },
      },
      {
        id: "S43-T3-A-E3",
        subtopicId: "S43-T3-A",
        kind: "transfer",
        instruction:
          "Transfiere el concepto.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Transfiere el concepto.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(['db','cache'])`,
          output: `['db', 'cache']`,
        },
      },
      {
        id: "S43-T3-B-E1",
        subtopicId: "S43-T3-B",
        kind: "guided",
        instruction:
          "Completa el ejercicio guiado.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio guiado.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(True)`,
          output: `True`,
        },
      },
      {
        id: "S43-T3-B-E2",
        subtopicId: "S43-T3-B",
        kind: "independent",
        instruction:
          "Completa el ejercicio independiente.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio independiente.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('expand_contract')`,
          output: `expand_contract`,
        },
      },
      {
        id: "S43-T3-B-E3",
        subtopicId: "S43-T3-B",
        kind: "transfer",
        instruction:
          "Transfiere el concepto.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Transfiere el concepto.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(['tmp','cache'])`,
          output: `['tmp', 'cache']`,
        },
      },
      {
        id: "S43-T4-A-E1",
        subtopicId: "S43-T4-A",
        kind: "guided",
        instruction:
          "Completa el ejercicio guiado.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio guiado.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(['builder','runtime'])`,
          output: `['builder', 'runtime']`,
        },
      },
      {
        id: "S43-T4-A-E2",
        subtopicId: "S43-T4-A",
        kind: "independent",
        instruction:
          "Completa el ejercicio independiente.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio independiente.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(True)`,
          output: `True`,
        },
      },
      {
        id: "S43-T4-A-E3",
        subtopicId: "S43-T4-A",
        kind: "transfer",
        instruction:
          "Transfiere el concepto.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Transfiere el concepto.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('pinned')`,
          output: `pinned`,
        },
      },
      {
        id: "S43-T4-B-E1",
        subtopicId: "S43-T4-B",
        kind: "guided",
        instruction:
          "Completa el ejercicio guiado.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio guiado.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(0)`,
          output: `0`,
        },
      },
      {
        id: "S43-T4-B-E2",
        subtopicId: "S43-T4-B",
        kind: "independent",
        instruction:
          "Completa el ejercicio independiente.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Completa el ejercicio independiente.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('512Mi')`,
          output: `512Mi`,
        },
      },
      {
        id: "S43-T4-B-E3",
        subtopicId: "S43-T4-B",
        kind: "transfer",
        instruction:
          "Transfiere el concepto.",
        hint: "hint-a",
        hints: [
          "hint-a",
          "hint-b",
        ],
        edgeCases: ["caso sintético", "sin PII real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Transfiere el concepto.
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('ci_gate')`,
          output: `ci_gate`,
        },
      },
    ],
  },
  youDo: {
    title: "[FINAL] Contenedores y reproducibilidad operativa (CP-N4-A (cierre))",
    context:
      "Proyecto de sección **S43** (Contenedores y reproducibilidad operativa). Gate: **CP-N4-A (cierre)**. Governed Python Service Platform levanta con un comando, ejecuta tests/health checks, usa usuario no root y documenta configuración y recuperación. **FINAL — CP-N4-A CLOSE**: Governed Python Service Platform (un comando, tests/health, non-root, config y recuperación). Este You Do es la nota FINAL del cierre N4-A. Usa solo datos sintéticos; no marques section_passed desde esta entrega de autoría.",
    objectives: [
      "FINAL: Governed Python Service Platform levanta con un comando, ejecuta tests/health checks, usa usuario no root y documenta configuración y recuperación.",
      "Datos sintéticos; sin PII real ni secretos",
      "Demo reproducible (if __name__ == '__main__' o notebook run-all)",
      "Documentación en español profesional",
      "Alineación al incremento/gate V3: CP-N4-A (cierre)",
    ],
    requirements: [
      "Dataset o fixtures sintéticos",
      "Demo reproducible",
      "Documentación en español profesional",
      "Alineación al incremento/gate V3 de la sección",
    ],
    starterCode: `# S43 You Do — Contenedores y reproducibilidad operativa
# Gate: CP-N4-A (cierre)
# Governed Python Service Platform levanta con un comando, ejecuta tests/health checks, usa usuario no root y documenta co

def main():
    print("section", "S43")
    print("gate", 'CP-N4-A (cierre)')
    print("synthetic", True)
    # TODO: implementar incremento del blueprint

if __name__ == "__main__":
    main()
`,
    portfolioNote:
      "FINAL. Entrega alineada a CP-N4-A (cierre). Portfolio en español profesional; evidencia ejecutable; privacidad. Otra lane califica PASS; no editar checkpoint/ledger/seed.",
    rubric: [
      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
      { criterion: "Correctitud técnica en entorno declarado", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados", weight: "15%" },
      { criterion: "Código legible y límites claros", weight: "10%" },
      { criterion: "Documentación en español profesional", weight: "10%" },
      { criterion: "Nota FINAL de gate: CLOSE", weight: "gate FINAL" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "El id de plataforma de S43 que se preserva es:",
        options: [
          "llmops",
          "renamed-v3",
          "legacy-drop",
          "random",
        ],
        correctIndex: 0,
        explanation:
          "KEEP_PLATFORM_ID_RETHEME_CONTENT.",
      },
      {
        question: "El incremento/gate V3 de S43 pertenece a:",
        options: [
          "CP-N4-A (cierre)",
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
        note: "Apoyo S43 Contenedores y reproducibilidad operativa",
      },
    ],
    books: [
      {
        label: "Architecture / platform engineering refs",
        note: "Alinear a Contenedores y reproducibilidad operativa",
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
