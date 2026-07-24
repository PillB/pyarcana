import type { CourseSection } from '../../types'

export const section43: CourseSection = {
  id: "llmops",
  index: 43,
  title: "Contenedores y reproducibilidad operativa",
  shortTitle: "Contenedores",
  tagline: "Governed Python Service Platform: un comando, tests/health, non-root, config y recuperación documentadas",
  estimatedHours: 20,
  level: "Master",
  phase: 3,
  icon: "BarChart3",
  accentColor: "bg-gradient-to-br from-amber-500 to-red-600",
  jobRelevance:
    "En equipos de plataforma y producto, **contenedores y reproducibilidad operativa** empaquetan el control plane (S41–S42) en un servicio que se levanta con un comando: imagen mínima, non-root, health/readiness y shutdown limpio. Se promueve solo cuando el build es repetible en entorno nuevo, no hay secretos horneados y los límites de recursos/CVE críticos están bajo control. Id legacy `llmops` se conserva; el path V3 es contenedores/ops, no pipelines de fine-tuning LLM.",
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
      heading: "Ruta de S43: Contenedores y reproducibilidad operativa",
      paragraphs: [
        "**Diccionario de la sección** (léelo antes de T1). **Layer cache:** ordenar deps antes de app para no invalidar en cada commit. **Non-root:** proceso con UID sin privilegios. **Secret injection:** secretos en runtime, nunca horneados en la imagen. **Health/readiness:** el proceso responde solo cuando puede servir. **Compose:** API/worker/DB/cache locales con deps ordenadas. **Multi-stage:** build tools fuera de la imagen final. **Resource limits:** CPU/memoria acotados. **SBOM/scan:** inventario y CVEs antes de promover.",
        "Esta sección empaqueta el servicio seguro de S42 en **contenedores reproducibles** sin cluster real: contratos al estilo Dockerfile/Compose (referencia Docker; progressive disclosure con dicts y checks stdlib). El caso `CASO-TRU-043` (plataforma ficticia en Trujillo) es sintético: sin secretos reales ni registro remoto obligatorio.",
        "Producto incremental: Governed Python Service Platform. Entrada: código fijado, lock de deps, config no secreta y secretos inyectados en runtime. Salida: layers cacheables, non-root, health/readiness, compose API/worker/DB/cache y runbook de recovery. Error de promoción: root UID, secret horneado, health falso o migración no reversible.",
        "Orden: T1 Dockerfile/non-root → T2 config/secrets/signals → T3 compose y migraciones → T4 locks, multi-stage, scan y límites. Teoría medible, iDo que calcula el contrato, weDo E1/E2/E3 con un defecto ops por ejercicio. Id legacy `llmops` no implica LLMOps de modelos; V3 es reproducibilidad del servicio en contenedor. Stack didáctico: **stdlib** modelando contratos Docker/Compose sin cluster real.",
      ],
      code: {
        language: 'python',
        title: "s43_map_contract.py",
        code: `def section_contract():
    return {
        "case": "CASO-TRU-043",
        "gates": ["repeatable_build", "non_root", "no_baked_secrets", "resource_limits"],
        "llmops_finetune_topic": False,
        "root_uid_ok": False,
    }

c = section_contract()
print("case", c["case"])
print("llmops_finetune_topic", c["llmops_finetune_topic"])
print("root_uid_ok", c["root_uid_ok"])
`,
        output: `case CASO-TRU-043
llmops_finetune_topic False
root_uid_ok False`,
      },
      callout: {
        type: "info",
        title: "Gate de promoción",
        content: "CP-N4-A · servicio reproducible en contenedores: build repetible, usuario no root, límites de recursos y shutdown limpio pasan en entorno nuevo. Si falta evidencia, no se promociona.",
      },
    },
    {
      heading: "Dockerfile, layers y cache",
      subtopicId: "S43-T1-A",
      paragraphs: [
        "Ordena layers de **estable a cambiante**: base y dependencias primero, código de aplicación después. Así el cache de build acelera commits de app sin re-resolver pip en cada push. Un cache «mágico» que depende de estado oculto del host rompe la reproducibilidad entre máquinas.",
        "Contrato de cache. Entrada: secuencia de layers `base→deps→app→cmd` y lock de dependencias. Salida: `cache_hint=deps_before_app` y digest lógico estable entre dos builds con el mismo lock. Error: copiar el source antes del lock (invalida cache en cada commit) o hornear secretos en una layer. Criterio: en el lab de Trujillo sintético, un cambio solo de app no re-resuelve pip si deps no cambió.",
        "Aplicación a `CASO-TRU-043-T1A`: `layer_order` valida deps antes de app. Sin secretos en el Dockerfile; el secret se inyecta en runtime (T2-A). Evidencia: dos builds con el mismo lock producen el mismo digest lógico de deps.",
      ],
      code: {
        language: 'python',
        title: "dockerfile_layers_cache.py",
        code: `def layer_order(steps: list) -> tuple:
    # deps before app maximizes cache hits when only source changes
    hint = "deps_before_app" if steps.index("deps") < steps.index("app") else "reorder"
    return steps, hint, True

layers, hint, ok = layer_order(["base", "deps", "app", "cmd"])
print("layers", layers)
print("cache_hint", hint)
print("dockerfile", ok)`,
        output: `layers ['base', 'deps', 'app', 'cmd']
cache_hint deps_before_app
dockerfile True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Evidencia mínima de S43-T1-A: dos builds producen el mismo digest lógico. Si falta, responde `REORDER_DOCKERFILE`; si no alcanza para decidir, `INSPECT_CACHE_INVALIDATION`.",
      },
    },
    {
      heading: "bases, usuarios no root y tamaño",
      subtopicId: "S43-T1-B",
      paragraphs: [
        "Una base mínima reduce superficie, pero debe seguir parchable; fija versión/digest y ejecuta con UID sin privilegios, filesystem y capabilities mínimos.",
        "Contrato operativo. Entrada: código fijado, locks, configuración no secreta y secretos inyectados en runtime. Salida de este subtema: proceso non-root verificado. Error: imagen mutable, proceso root, health check falso o migración no reversible bloquea release. Criterio de éxito: build repetible, usuario no root, límites de recursos y shutdown limpio pasan en entorno nuevo.",
        "Aplicación de `bases, usuarios no root y tamaño` al caso peruano sintético `CASO-TRU-043`: API, worker, base y cache locales de una plataforma ficticia en Trujillo. La evidencia esperada es proceso non-root verificado. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "bases_nonroot_size.py",
        code: `def nonroot_user(user: str, uid: int) -> dict:
    return {"user": user, "nonroot": uid >= 1000, "uid": uid}

u = nonroot_user("appuser", 10001)
print("user", u["user"])
print("nonroot", u["nonroot"])
print("uid", u["uid"])`,
        output: `user appuser
nonroot True
uid 10001`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Antes de promover S43-T1-B, audita proceso non-root verificado. Un breach activa `REBUILD_NONROOT` y una ausencia activa `SELECT_PATCHABLE_BASE`.",
      },
    },
    {
      heading: "config, secrets y volumes",
      subtopicId: "S43-T2-A",
      paragraphs: [
        "Config no secreta puede declararse; secretos se inyectan, rotan y no se hornean. Volumes distinguen estado durable de datos descartables.",
        "Contrato operativo. Entrada: código fijado, locks, configuración no secreta y secretos inyectados en runtime. Salida de este subtema: imagen e inspección sin secreto. Error: imagen mutable, proceso root, health check falso o migración no reversible bloquea release. Criterio de éxito: build repetible, usuario no root, límites de recursos y shutdown limpio pasan en entorno nuevo.",
        "Aplicación de `config, secrets y volumes` al caso peruano sintético `CASO-TRU-043`: API, worker, base y cache locales de una plataforma ficticia en Trujillo. La evidencia esperada es imagen e inspección sin secreto. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "config_secrets_volumes.py",
        code: `def runtime_config(env: str, secret_ref: str, volume: str) -> dict:
    # secrets are references only — never baked values
    return {"env": env, "secret_ref": secret_ref, "volume": volume}

cfg = runtime_config("prod", "\${SECRET}", "/data")
print("env", cfg["env"])
print("secret_ref", cfg["secret_ref"])
print("volume", cfg["volume"])`,
        output: `env prod
secret_ref \${SECRET}
volume /data`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "La revisión de S43-T2-A conserva imagen e inspección sin secreto; no conviertas `REMOVE_BAKED_SECRET` ni `CLASSIFY_VOLUME` en éxito silencioso.",
      },
    },
    {
      heading: "networking, health checks y signals",
      subtopicId: "S43-T2-B",
      paragraphs: [
        "Redes limitan quién habla con quién; readiness expresa capacidad de servir, liveness bloqueo, y SIGTERM drena trabajo antes de salir.",
        "Contrato operativo. Entrada: código fijado, locks, configuración no secreta y secretos inyectados en runtime. Salida de este subtema: health checks y shutdown ensayados. Error: imagen mutable, proceso root, health check falso o migración no reversible bloquea release. Criterio de éxito: build repetible, usuario no root, límites de recursos y shutdown limpio pasan en entorno nuevo.",
        "Aplicación de `networking, health checks y signals` al caso peruano sintético `CASO-TRU-043`: API, worker, base y cache locales de una plataforma ficticia en Trujillo. La evidencia esperada es health checks y shutdown ensayados. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "net_health_signals.py",
        code: `def health_endpoints(paths: list) -> list:
    return sorted(paths)

print(health_endpoints(["/readyz", "/healthz"]))
print("signals", ["SIGTERM", "SIGINT"])
print("net", "private")`,
        output: `['/healthz', '/readyz']
signals ['SIGTERM', 'SIGINT']
net private`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Contrato S43-T2-B: demuestra health checks y shutdown ensayados. Falla cerrada con `DRAIN_AND_ISOLATE` y deriva incertidumbre mediante `DIAGNOSE_HEALTH_SIGNAL`.",
      },
    },
    {
      heading: "API/worker/DB/cache",
      subtopicId: "S43-T3-A",
      paragraphs: [
        "Compose hace explícitos API, worker, DB y cache con redes y health dependencies; `depends_on` no reemplaza retries de aplicación.",
        "Contrato operativo. Entrada: código fijado, locks, configuración no secreta y secretos inyectados en runtime. Salida de este subtema: stack sano desde entorno limpio. Error: imagen mutable, proceso root, health check falso o migración no reversible bloquea release. Criterio de éxito: build repetible, usuario no root, límites de recursos y shutdown limpio pasan en entorno nuevo.",
        "Aplicación de `API/worker/DB/cache` al caso peruano sintético `CASO-TRU-043`: API, worker, base y cache locales de una plataforma ficticia en Trujillo. La evidencia esperada es stack sano desde entorno limpio. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "api_worker_db_cache.py",
        code: `def stack_ok(services: list) -> dict:
    return {
        "services": services,
        "has_worker": "worker" in services,
        "cache": "redis_like" if "cache" in services else "none",
    }

s = stack_ok(["api", "worker", "db", "cache"])
print("services", s["services"])
print("has_worker", s["has_worker"])
print("cache", s["cache"])`,
        output: `services ['api', 'worker', 'db', 'cache']
has_worker True
cache redis_like`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Para S43-T3-A, el artefacto comprobable es stack sano desde entorno limpio. Sin él corresponde `STOP_UNHEALTHY_STACK` o, si faltan datos, `WAIT_FOR_DEPENDENCY`.",
      },
    },
    {
      heading: "dependencias, migrations y datos efímeros",
      subtopicId: "S43-T3-B",
      paragraphs: [
        "Migraciones son jobs controlados con compatibilidad expand/contract; datos efímeros se recrean y los durables tienen backup/restore.",
        "Contrato operativo. Entrada: código fijado, locks, configuración no secreta y secretos inyectados en runtime. Salida de este subtema: migración y rollback de prueba. Error: imagen mutable, proceso root, health check falso o migración no reversible bloquea release. Criterio de éxito: build repetible, usuario no root, límites de recursos y shutdown limpio pasan en entorno nuevo.",
        "Aplicación de `dependencias, migrations y datos efímeros` al caso peruano sintético `CASO-TRU-043`: API, worker, base y cache locales de una plataforma ficticia en Trujillo. La evidencia esperada es migración y rollback de prueba. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "deps_migrations_ephemeral.py",
        code: `def boot_order(steps: list) -> bool:
    return steps.index("migrate") < steps.index("api")

print("migrate_before_api", boot_order(["deps", "migrate", "api"]))
print("ephemeral", ["tmp", "cache"])
print("deps_lock", True)`,
        output: `migrate_before_api True
ephemeral ['tmp', 'cache']
deps_lock True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Promoción de S43-T3-B: prueba migración y rollback de prueba y registra por separado `ROLL_BACK_MIGRATION` (breach) y `RUN_RESTORE_DRILL` (missing).",
      },
    },
    {
      heading: "locks y multi-stage builds",
      subtopicId: "S43-T4-A",
      paragraphs: [
        "Locks fijan resolución completa y multi-stage separa toolchain de runtime; el artefacto final contiene solo lo necesario.",
        "Contrato operativo. Entrada: código fijado, locks, configuración no secreta y secretos inyectados en runtime. Salida de este subtema: lock verificado e imagen runtime reducida. Error: imagen mutable, proceso root, health check falso o migración no reversible bloquea release. Criterio de éxito: build repetible, usuario no root, límites de recursos y shutdown limpio pasan en entorno nuevo.",
        "Aplicación de `locks y multi-stage builds` al caso peruano sintético `CASO-TRU-043`: API, worker, base y cache locales de una plataforma ficticia en Trujillo. La evidencia esperada es lock verificado e imagen runtime reducida. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "locks_multistage.py",
        code: `def multistage_plan(has_lock: bool) -> dict:
    return {
        "multistage": ["builder", "runtime"],
        "locks": ["requirements.txt"] if has_lock else [],
        "reproducible": has_lock,
    }

p = multistage_plan(True)
print("multistage", p["multistage"])
print("locks", p["locks"])
print("reproducible", p["reproducible"])`,
        output: `multistage ['builder', 'runtime']
locks ['requirements.txt']
reproducible True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "El dueño de S43-T4-A acepta solo lock verificado e imagen runtime reducida; una violación produce `BLOCK_UNPINNED_BUILD` y un registro incompleto produce `REGENERATE_LOCK`.",
      },
    },
    {
      heading: "scanning, resource limits y debugging",
      subtopicId: "S43-T4-B",
      paragraphs: [
        "Scanning alimenta una política, límites evitan noisy neighbors y debugging usa logs/metrics controlados, nunca un shell root permanente.",
        "Contrato operativo. Entrada: código fijado, locks, configuración no secreta y secretos inyectados en runtime. Salida de este subtema: vulnerabilidad crítica y OOM simulados bloquean. Error: imagen mutable, proceso root, health check falso o migración no reversible bloquea release. Criterio de éxito: build repetible, usuario no root, límites de recursos y shutdown limpio pasan en entorno nuevo.",
        "Aplicación de `scanning, resource limits y debugging` al caso peruano sintético `CASO-TRU-043`: API, worker, base y cache locales de una plataforma ficticia en Trujillo. La evidencia esperada es vulnerabilidad crítica y OOM simulados bloquean. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "scan_limits_debug.py",
        code: `def scan_gate(critical: int, limits: dict) -> dict:
    return {
        "limits": limits,
        "scan_clean": critical == 0,
        "debug": "ephemeral_shell",
    }

g = scan_gate(0, {"cpu": "1", "mem": "512Mi"})
print("limits", g["limits"])
print("scan_clean", g["scan_clean"])
print("debug", g["debug"])`,
        output: `limits {'cpu': '1', 'mem': '512Mi'}
scan_clean True
debug ephemeral_shell`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Cierre de S43-T4-B: conserva vulnerabilidad crítica y OOM simulados bloquean, la evidencia de `QUARANTINE_IMAGE` y la ruta humana `TRIAGE_SCAN_FINDING`.",
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
          code: `def dockerfile_steps(steps: list) -> tuple:
    pip_before = steps.index("deps") < steps.index("app")
    return pip_before, len(steps), "stable_layers_first" if pip_before else "reorder"

ok, n, cache = dockerfile_steps(["base", "deps", "app", "user", "cmd"])
print("pip_before_app", ok)
print("n_steps", n)
print("cache", cache)`,
          output: `pip_before_app True
n_steps 5
cache stable_layers_first`,
        },
        why: "Hace observable `Dockerfile, layers y cache` con un caso local pequeño y deja como evidencia dos builds producen el mismo digest lógico; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S43-T1-B-DEMO",
        subtopicId: "S43-T1-B",
        environment: "local-python",
        description: "Demo: bases, usuarios no root y tamaño",
        code: {
          language: 'python',
          title: "demo_bases_nonroot_size.py",
          code: `def choose_base(size_mb: int) -> tuple:
    base = "slim" if size_mb <= 80 else "full"
    smaller = "distroless" if size_mb <= 50 else base
    return smaller, size_mb, base

smaller, mb, base = choose_base(40)
print("smaller", smaller)
print("mb", mb)
print("base", base)`,
          output: `smaller distroless
mb 40
base slim`,
        },
        why: "Hace observable `bases, usuarios no root y tamaño` con un caso local pequeño y deja como evidencia proceso non-root verificado; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S43-T2-A-DEMO",
        subtopicId: "S43-T2-A",
        environment: "local-python",
        description: "Demo: config, secrets y volumes",
        code: {
          language: 'python',
          title: "demo_config_secrets_volumes.py",
          code: `def image_has_secret(layers: list) -> bool:
    return any("SECRET=" in layer for layer in layers)

print("no_hardcoded", not image_has_secret(["ENV=prod", "CMD=api"]))
print("mount", "readonly_config")
print("ok", True)`,
          output: `no_hardcoded True
mount readonly_config
ok True`,
        },
        why: "Hace observable `config, secrets y volumes` con un caso local pequeño y deja como evidencia imagen e inspección sin secreto; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S43-T2-B-DEMO",
        subtopicId: "S43-T2-B",
        environment: "local-python",
        description: "Demo: networking, health checks y signals",
        code: {
          language: 'python',
          title: "demo_net_health_signals.py",
          code: `def health_status(ready: bool, live: bool) -> int:
    if not live:
        return 503
    return 200 if ready else 503

print(health_status(True, True))
print(health_status(False, True))
print("graceful", True)`,
          output: `200
503
graceful True`,
        },
        why: "Hace observable `networking, health checks y signals` con un caso local pequeño y deja como evidencia health checks y shutdown ensayados; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S43-T3-A-DEMO",
        subtopicId: "S43-T3-A",
        environment: "local-python",
        description: "Demo: API/worker/DB/cache",
        code: {
          language: 'python',
          title: "demo_api_worker_db_cache.py",
          code: `def service_deps(name: str) -> list:
    shared = ["db", "cache"]
    return shared if name in ("api", "worker") else []

print("api_deps", service_deps("api"))
print("worker_deps", service_deps("worker"))
print("split", True)`,
          output: `api_deps ['db', 'cache']
worker_deps ['db', 'cache']
split True`,
        },
        why: "Hace observable `API/worker/DB/cache` con un caso local pequeño y deja como evidencia stack sano desde entorno limpio; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S43-T3-B-DEMO",
        subtopicId: "S43-T3-B",
        environment: "local-python",
        description: "Demo: dependencias, migrations y datos efímeros",
        code: {
          language: 'python',
          title: "demo_deps_migrations_ephemeral.py",
          code: `def migrate_strategy(reversible: bool) -> str:
    return "expand_contract" if reversible else "blocked"

print("migrations", migrate_strategy(True))
print("data", "ephemeral_ok")
print("order", "migrate_first")`,
          output: `migrations expand_contract
data ephemeral_ok
order migrate_first`,
        },
        why: "Hace observable `dependencias, migrations y datos efímeros` con un caso local pequeño y deja como evidencia migración y rollback de prueba; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S43-T4-A-DEMO",
        subtopicId: "S43-T4-A",
        environment: "local-python",
        description: "Demo: locks y multi-stage builds",
        code: {
          language: 'python',
          title: "demo_locks_multistage.py",
          code: `def stages(has_compiler: bool, lock_pinned: bool) -> dict:
    return {
        "builder_has_compilers": has_compiler,
        "runtime_slim": not has_compiler or True,
        "lock": "pinned" if lock_pinned else "floating",
    }

s = stages(True, True)
print("builder_has_compilers", s["builder_has_compilers"])
print("runtime_slim", s["runtime_slim"])
print("lock", s["lock"])`,
          output: `builder_has_compilers True
runtime_slim True
lock pinned`,
        },
        why: "Hace observable `locks y multi-stage builds` con un caso local pequeño y deja como evidencia lock verificado e imagen runtime reducida; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S43-T4-B-DEMO",
        subtopicId: "S43-T4-B",
        environment: "local-python",
        description: "Demo: scanning, resource limits y debugging",
        code: {
          language: 'python',
          title: "demo_scan_limits_debug.py",
          code: `def block_deploy(critical_findings: int) -> bool:
    return critical_findings > 0

print("block_deploy", block_deploy(0))
print("mem", "512Mi")
print("scan", "ci_gate")`,
          output: `block_deploy False
mem 512Mi
scan ci_gate`,
        },
        why: "Hace observable `scanning, resource limits y debugging` con un caso local pequeño y deja como evidencia vulnerabilidad crítica y OOM simulados bloquean; el demo modela el contrato, no un servicio externo.",
      },
    ],
  },
  weDo: {
    intro: "S43 · Laboratorio Governed Python Service Platform reproducible: 24 retos locales. E1 repara una operación de dominio, E2 separa valid/invalid/missing y E3 demuestra recuperación fail-closed con ocho fixtures peruanos sintéticos distintos.",
    steps: [
      {
        id: "S43-T1-A-E1",
        subtopicId: "S43-T1-A",
        kind: "guided",
        instruction: "S43-T1-A-E1 · Calcula el contrato de `Dockerfile, layers y cache` sobre `CASO-TRU-043-1A`. La entrada es el dict completo del starter; la operación debe demostrar layer de dependencias reutilizable y digest estable. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S43-T1-A PASS`; la misma operación sobre el fixture adverso debe activar `REORDER_DOCKERFILE` en E2.",
        hint: "Relaciona los campos `lock_copied_before_source`, `dependency_layer_reused`, `source_change_rebuilds`, `digest_stable` con la regla explicada en S43-T1-A.",
        hints: [
          "Relaciona los campos `lock_copied_before_source`, `dependency_layer_reused`, `source_change_rebuilds`, `digest_stable` con la regla explicada en S43-T1-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva dos builds producen el mismo digest lógico; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta digest_stable", "fixture adverso: layer de dependencias reutilizable y digest estable", "CASO-TRU-043-1A es sintético"],
        tests: "El fixture `CASO-TRU-043-1A` satisface un predicado de dominio real; imprime `S43-T1-A PASS` y el assert booleano pasa.",
        feedback: "S43-T1-A-E1: explica qué campo cambió la decisión, por qué el adverso activa REORDER_DOCKERFILE y por qué faltar digest_stable exige INSPECT_CACHE_INVALIDATION.",
        starterCode: {
          language: 'python',
          title: "s43-t1-a-e1.py",
          code: `# CASO-LIM-043 · Dockerfile layer cache order
# DEFECT: PASS si no reusa capa deps y rebuilds>3 (invertido)
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-TRU-043-1A", **{"lock_copied_before_source":True,"dependency_layer_reused":True,"source_change_rebuilds":1,"digest_stable":True}}
# DEFECT: cache de deps debe reutilizarse; rebuilds de source no deben re-resolver deps
meets_contract = not record["dependency_layer_reused"] and record["source_change_rebuilds"] > 3
status = "PASS" if meets_contract else "REORDER_DOCKERFILE"
print("S43-T1-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s43-t1-a-e1.py",
          code: `record = {"case_id": "CASO-TRU-043-1A", **{"lock_copied_before_source":True,"dependency_layer_reused":True,"source_change_rebuilds":1,"digest_stable":True}}
meets_contract = record["lock_copied_before_source"] and record["dependency_layer_reused"] and record["source_change_rebuilds"] == 1 and record["digest_stable"]
status = "PASS" if meets_contract else "REORDER_DOCKERFILE"
print("S43-T1-A", status)
assert meets_contract is True` ,
          output: `S43-T1-A PASS` ,
        },
      },
      {
        id: "S43-T1-A-E2",
        subtopicId: "S43-T1-A",
        kind: "independent",
        instruction: "S43-T1-A-E2 · Modela tres rutas de `Dockerfile, layers y cache`: fixture válido, fixture adverso y registro sin `digest_stable`. Entrada: dict con case_id, lock_copied_before_source, dependency_layer_reused, source_change_rebuilds, digest_stable. Salidas exactas: `PASS`, `REORDER_DOCKERFILE`, `MISSING:digest_stable`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a digest_stable debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a digest_stable debe ocurrir antes de esa rama.",
          "Después aplica la regla de S43-T1-A: layer de dependencias reutilizable y digest estable. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta digest_stable", "fixture adverso: layer de dependencias reutilizable y digest estable", "CASO-TRU-043-1A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `digest_stable` ausente y produce exactamente `PASS REORDER_DOCKERFILE MISSING:digest_stable`.",
        feedback: "S43-T1-A-E2: explica qué campo cambió la decisión, por qué el adverso activa REORDER_DOCKERFILE y por qué faltar digest_stable exige INSPECT_CACHE_INVALIDATION.",
        starterCode: {
          language: 'python',
          title: "s43-t1-a-e2.py",
          code: `# CASO-LIM-043 · assess REORDER_DOCKERFILE
# DEFECT: PASS sin dependency_layer_reused
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "lock_copied_before_source", "dependency_layer_reused", "source_change_rebuilds", "digest_stable"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if not record["dependency_layer_reused"] and record["source_change_rebuilds"] > 3 else "REORDER_DOCKERFILE"

valid = {"case_id": "CASO-TRU-043-1A", **{"lock_copied_before_source":True,"dependency_layer_reused":True,"source_change_rebuilds":1,"digest_stable":True}}
invalid = {"case_id": "CASO-TRU-043-1A", **{"lock_copied_before_source":False,"dependency_layer_reused":False,"source_change_rebuilds":6,"digest_stable":False}}
incomplete = {**valid}
incomplete.pop("digest_stable")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s43-t1-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "lock_copied_before_source", "dependency_layer_reused", "source_change_rebuilds", "digest_stable"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["lock_copied_before_source"] and record["dependency_layer_reused"] and record["source_change_rebuilds"] == 1 and record["digest_stable"] else "REORDER_DOCKERFILE"

valid = {"case_id": "CASO-TRU-043-1A", **{"lock_copied_before_source":True,"dependency_layer_reused":True,"source_change_rebuilds":1,"digest_stable":True}}
invalid = {"case_id": "CASO-TRU-043-1A", **{"lock_copied_before_source":False,"dependency_layer_reused":False,"source_change_rebuilds":6,"digest_stable":False}}
incomplete = {**valid}
incomplete.pop("digest_stable")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REORDER_DOCKERFILE MISSING:digest_stable` ,
        },
      },
      {
        id: "S43-T1-A-E3",
        subtopicId: "S43-T1-A",
        kind: "transfer",
        instruction: "S43-T1-A-E3 · Simula fallo cerrado para `Dockerfile, layers y cache` con tres fixtures distintos. `CASO-TRU-043-1A` debe continuar, el adverso debe devolver `REORDER_DOCKERFILE` y la ausencia de `digest_stable` debe devolver `INSPECT_CACHE_INVALIDATION`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `INSPECT_CACHE_INVALIDATION` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `INSPECT_CACHE_INVALIDATION` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró layer de dependencias reutilizable y digest estable; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta digest_stable", "fixture adverso: layer de dependencias reutilizable y digest estable", "CASO-TRU-043-1A es sintético"],
        tests: "Fixtures `CASO-TRU-043-1A`, adverso y sin `digest_stable` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S43-T1-A-E3: explica qué campo cambió la decisión, por qué el adverso activa REORDER_DOCKERFILE y por qué faltar digest_stable exige INSPECT_CACHE_INVALIDATION.",
        starterCode: {
          language: 'python',
          title: "s43-t1-a-e3.py",
          code: `# CASO-LIM-043 · decide REORDER_DOCKERFILE
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "lock_copied_before_source", "dependency_layer_reused", "source_change_rebuilds", "digest_stable"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if not record["dependency_layer_reused"] and record["source_change_rebuilds"] > 3 else "REORDER_DOCKERFILE"

valid = {"case_id": "CASO-TRU-043-1A", **{"lock_copied_before_source":True,"dependency_layer_reused":True,"source_change_rebuilds":1,"digest_stable":True}}
invalid = {"case_id": "CASO-TRU-043-1A", **{"lock_copied_before_source":False,"dependency_layer_reused":False,"source_change_rebuilds":6,"digest_stable":False}}
uncertain = {**valid}
uncertain.pop("digest_stable")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s43-t1-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "lock_copied_before_source", "dependency_layer_reused", "source_change_rebuilds", "digest_stable"}
    missing = sorted(required - record.keys())
    if missing:
        return "INSPECT_CACHE_INVALIDATION"
    return "CONTINUE" if record["lock_copied_before_source"] and record["dependency_layer_reused"] and record["source_change_rebuilds"] == 1 and record["digest_stable"] else "REORDER_DOCKERFILE"

valid = {"case_id": "CASO-TRU-043-1A", **{"lock_copied_before_source":True,"dependency_layer_reused":True,"source_change_rebuilds":1,"digest_stable":True}}
invalid = {"case_id": "CASO-TRU-043-1A", **{"lock_copied_before_source":False,"dependency_layer_reused":False,"source_change_rebuilds":6,"digest_stable":False}}
uncertain = {**valid}
uncertain.pop("digest_stable")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REORDER_DOCKERFILE", "INSPECT_CACHE_INVALIDATION"]` ,
          output: `CONTINUE REORDER_DOCKERFILE INSPECT_CACHE_INVALIDATION` ,
        },
      },
      {
        id: "S43-T1-B-E1",
        subtopicId: "S43-T1-B",
        kind: "guided",
        instruction: "S43-T1-B-E1 · Compara el contrato de `bases, usuarios no root y tamaño` sobre `CASO-TRU-043-1B`. La entrada es el dict completo del starter; la operación debe demostrar base fijada, UID non-root, cero capabilities y tamaño límite. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S43-T1-B PASS`; la misma operación sobre el fixture adverso debe activar `REBUILD_NONROOT` en E2.",
        hint: "Relaciona los campos `base_pinned`, `uid`, `capabilities`, `runtime_mb`, `max_mb` con la regla explicada en S43-T1-B.",
        hints: [
          "Relaciona los campos `base_pinned`, `uid`, `capabilities`, `runtime_mb`, `max_mb` con la regla explicada en S43-T1-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva proceso non-root verificado; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta max_mb", "fixture adverso: base fijada, UID non-root, cero capabilities y tamaño límite", "CASO-TRU-043-1B es sintético"],
        tests: "El fixture `CASO-TRU-043-1B` satisface un predicado de dominio real; imprime `S43-T1-B PASS` y el assert booleano pasa.",
        feedback: "S43-T1-B-E1: explica qué campo cambió la decisión, por qué el adverso activa REBUILD_NONROOT y por qué faltar max_mb exige SELECT_PATCHABLE_BASE.",
        starterCode: {
          language: 'python',
          title: "s43-t1-b-e1.py",
          code: `# CASO-LIM-043 · non-root base + size
# DEFECT: PASS si uid==0 o capabilities no vacías
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-TRU-043-1B", **{"base_pinned":True,"uid":10001,"capabilities":set(),"runtime_mb":118,"max_mb":150}}
# DEFECT: root o capabilities extra bloquean non-root
meets_contract = record["uid"] == 0 or bool(record["capabilities"])
status = "PASS" if meets_contract else "REBUILD_NONROOT"
print("S43-T1-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s43-t1-b-e1.py",
          code: `record = {"case_id": "CASO-TRU-043-1B", **{"base_pinned":True,"uid":10001,"capabilities":set(),"runtime_mb":118,"max_mb":150}}
meets_contract = record["base_pinned"] and record["uid"] != 0 and not record["capabilities"] and record["runtime_mb"] <= record["max_mb"]
status = "PASS" if meets_contract else "REBUILD_NONROOT"
print("S43-T1-B", status)
assert meets_contract is True` ,
          output: `S43-T1-B PASS` ,
        },
      },
      {
        id: "S43-T1-B-E2",
        subtopicId: "S43-T1-B",
        kind: "independent",
        instruction: "S43-T1-B-E2 · Verifica tres rutas de `bases, usuarios no root y tamaño`: fixture válido, fixture adverso y registro sin `max_mb`. Entrada: dict con case_id, base_pinned, uid, capabilities, runtime_mb, max_mb. Salidas exactas: `PASS`, `REBUILD_NONROOT`, `MISSING:max_mb`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a max_mb debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a max_mb debe ocurrir antes de esa rama.",
          "Después aplica la regla de S43-T1-B: base fijada, UID non-root, cero capabilities y tamaño límite. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta max_mb", "fixture adverso: base fijada, UID non-root, cero capabilities y tamaño límite", "CASO-TRU-043-1B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `max_mb` ausente y produce exactamente `PASS REBUILD_NONROOT MISSING:max_mb`.",
        feedback: "S43-T1-B-E2: explica qué campo cambió la decisión, por qué el adverso activa REBUILD_NONROOT y por qué faltar max_mb exige SELECT_PATCHABLE_BASE.",
        starterCode: {
          language: 'python',
          title: "s43-t1-b-e2.py",
          code: `# CASO-LIM-043 · assess REBUILD_NONROOT
# DEFECT: PASS con root o caps extra
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "base_pinned", "uid", "capabilities", "runtime_mb", "max_mb"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["uid"] == 0 or bool(record["capabilities"]) else "REBUILD_NONROOT"

valid = {"case_id": "CASO-TRU-043-1B", **{"base_pinned":True,"uid":10001,"capabilities":set(),"runtime_mb":118,"max_mb":150}}
invalid = {"case_id": "CASO-TRU-043-1B", **{"base_pinned":False,"uid":0,"capabilities":{"SYS_ADMIN"},"runtime_mb":490,"max_mb":150}}
incomplete = {**valid}
incomplete.pop("max_mb")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s43-t1-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "base_pinned", "uid", "capabilities", "runtime_mb", "max_mb"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["base_pinned"] and record["uid"] != 0 and not record["capabilities"] and record["runtime_mb"] <= record["max_mb"] else "REBUILD_NONROOT"

valid = {"case_id": "CASO-TRU-043-1B", **{"base_pinned":True,"uid":10001,"capabilities":set(),"runtime_mb":118,"max_mb":150}}
invalid = {"case_id": "CASO-TRU-043-1B", **{"base_pinned":False,"uid":0,"capabilities":{"SYS_ADMIN"},"runtime_mb":490,"max_mb":150}}
incomplete = {**valid}
incomplete.pop("max_mb")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REBUILD_NONROOT MISSING:max_mb` ,
        },
      },
      {
        id: "S43-T1-B-E3",
        subtopicId: "S43-T1-B",
        kind: "transfer",
        instruction: "S43-T1-B-E3 · Extiende fallo cerrado para `bases, usuarios no root y tamaño` con tres fixtures distintos. `CASO-TRU-043-1B` debe continuar, el adverso debe devolver `REBUILD_NONROOT` y la ausencia de `max_mb` debe devolver `SELECT_PATCHABLE_BASE`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `SELECT_PATCHABLE_BASE` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `SELECT_PATCHABLE_BASE` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró base fijada, UID non-root, cero capabilities y tamaño límite; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta max_mb", "fixture adverso: base fijada, UID non-root, cero capabilities y tamaño límite", "CASO-TRU-043-1B es sintético"],
        tests: "Fixtures `CASO-TRU-043-1B`, adverso y sin `max_mb` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S43-T1-B-E3: explica qué campo cambió la decisión, por qué el adverso activa REBUILD_NONROOT y por qué faltar max_mb exige SELECT_PATCHABLE_BASE.",
        starterCode: {
          language: 'python',
          title: "s43-t1-b-e3.py",
          code: `# CASO-LIM-043 · decide REBUILD_NONROOT
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "base_pinned", "uid", "capabilities", "runtime_mb", "max_mb"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["uid"] == 0 or bool(record["capabilities"]) else "REBUILD_NONROOT"

valid = {"case_id": "CASO-TRU-043-1B", **{"base_pinned":True,"uid":10001,"capabilities":set(),"runtime_mb":118,"max_mb":150}}
invalid = {"case_id": "CASO-TRU-043-1B", **{"base_pinned":False,"uid":0,"capabilities":{"SYS_ADMIN"},"runtime_mb":490,"max_mb":150}}
uncertain = {**valid}
uncertain.pop("max_mb")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s43-t1-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "base_pinned", "uid", "capabilities", "runtime_mb", "max_mb"}
    missing = sorted(required - record.keys())
    if missing:
        return "SELECT_PATCHABLE_BASE"
    return "CONTINUE" if record["base_pinned"] and record["uid"] != 0 and not record["capabilities"] and record["runtime_mb"] <= record["max_mb"] else "REBUILD_NONROOT"

valid = {"case_id": "CASO-TRU-043-1B", **{"base_pinned":True,"uid":10001,"capabilities":set(),"runtime_mb":118,"max_mb":150}}
invalid = {"case_id": "CASO-TRU-043-1B", **{"base_pinned":False,"uid":0,"capabilities":{"SYS_ADMIN"},"runtime_mb":490,"max_mb":150}}
uncertain = {**valid}
uncertain.pop("max_mb")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REBUILD_NONROOT", "SELECT_PATCHABLE_BASE"]` ,
          output: `CONTINUE REBUILD_NONROOT SELECT_PATCHABLE_BASE` ,
        },
      },
      {
        id: "S43-T2-A-E1",
        subtopicId: "S43-T2-A",
        kind: "guided",
        instruction: "S43-T2-A-E1 · Filtra el contrato de `config, secrets y volumes` sobre `CASO-TRU-043-2A`. La entrada es el dict completo del starter; la operación debe demostrar secretos runtime y estado durable/efímero separado. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S43-T2-A PASS`; la misma operación sobre el fixture adverso debe activar `REMOVE_BAKED_SECRET` en E2.",
        hint: "Relaciona los campos `secret_baked`, `runtime_secret`, `config_declared`, `durable_volumes`, `ephemeral_volumes` con la regla explicada en S43-T2-A.",
        hints: [
          "Relaciona los campos `secret_baked`, `runtime_secret`, `config_declared`, `durable_volumes`, `ephemeral_volumes` con la regla explicada en S43-T2-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva imagen e inspección sin secreto; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta ephemeral_volumes", "fixture adverso: secretos runtime y estado durable/efímero separado", "CASO-TRU-043-2A es sintético"],
        tests: "El fixture `CASO-TRU-043-2A` satisface un predicado de dominio real; imprime `S43-T2-A PASS` y el assert booleano pasa.",
        feedback: "S43-T2-A-E1: explica qué campo cambió la decisión, por qué el adverso activa REMOVE_BAKED_SECRET y por qué faltar ephemeral_volumes exige CLASSIFY_VOLUME.",
        starterCode: {
          language: 'python',
          title: "s43-t2-a-e1.py",
          code: `# CASO-LIM-043 · secrets not baked + durable volumes
# DEFECT: PASS si secret_baked o db en ephemeral
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-TRU-043-2A", **{"secret_baked":False,"runtime_secret":True,"config_declared":True,"durable_volumes":{"db"},"ephemeral_volumes":{"cache"}}}
# DEFECT: secret horneado o volumen de DB efímero mal clasificado
meets_contract = record["secret_baked"] or "db" in record["ephemeral_volumes"]
status = "PASS" if meets_contract else "REMOVE_BAKED_SECRET"
print("S43-T2-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s43-t2-a-e1.py",
          code: `record = {"case_id": "CASO-TRU-043-2A", **{"secret_baked":False,"runtime_secret":True,"config_declared":True,"durable_volumes":{"db"},"ephemeral_volumes":{"cache"}}}
meets_contract = not record["secret_baked"] and record["runtime_secret"] and record["config_declared"] and "db" in record["durable_volumes"] and "cache" in record["ephemeral_volumes"]
status = "PASS" if meets_contract else "REMOVE_BAKED_SECRET"
print("S43-T2-A", status)
assert meets_contract is True` ,
          output: `S43-T2-A PASS` ,
        },
      },
      {
        id: "S43-T2-A-E2",
        subtopicId: "S43-T2-A",
        kind: "independent",
        instruction: "S43-T2-A-E2 · Clasifica tres rutas de `config, secrets y volumes`: fixture válido, fixture adverso y registro sin `ephemeral_volumes`. Entrada: dict con case_id, secret_baked, runtime_secret, config_declared, durable_volumes, ephemeral_volumes. Salidas exactas: `PASS`, `REMOVE_BAKED_SECRET`, `MISSING:ephemeral_volumes`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a ephemeral_volumes debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a ephemeral_volumes debe ocurrir antes de esa rama.",
          "Después aplica la regla de S43-T2-A: secretos runtime y estado durable/efímero separado. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta ephemeral_volumes", "fixture adverso: secretos runtime y estado durable/efímero separado", "CASO-TRU-043-2A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `ephemeral_volumes` ausente y produce exactamente `PASS REMOVE_BAKED_SECRET MISSING:ephemeral_volumes`.",
        feedback: "S43-T2-A-E2: explica qué campo cambió la decisión, por qué el adverso activa REMOVE_BAKED_SECRET y por qué faltar ephemeral_volumes exige CLASSIFY_VOLUME.",
        starterCode: {
          language: 'python',
          title: "s43-t2-a-e2.py",
          code: `# CASO-LIM-043 · assess REMOVE_BAKED_SECRET
# DEFECT: PASS con secret en imagen o DB efímera
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "secret_baked", "runtime_secret", "config_declared", "durable_volumes", "ephemeral_volumes"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["secret_baked"] or "db" in record["ephemeral_volumes"] else "REMOVE_BAKED_SECRET"

valid = {"case_id": "CASO-TRU-043-2A", **{"secret_baked":False,"runtime_secret":True,"config_declared":True,"durable_volumes":{"db"},"ephemeral_volumes":{"cache"}}}
invalid = {"case_id": "CASO-TRU-043-2A", **{"secret_baked":True,"runtime_secret":False,"config_declared":False,"durable_volumes":set(),"ephemeral_volumes":{"db"}}}
incomplete = {**valid}
incomplete.pop("ephemeral_volumes")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s43-t2-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "secret_baked", "runtime_secret", "config_declared", "durable_volumes", "ephemeral_volumes"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if not record["secret_baked"] and record["runtime_secret"] and record["config_declared"] and "db" in record["durable_volumes"] and "cache" in record["ephemeral_volumes"] else "REMOVE_BAKED_SECRET"

valid = {"case_id": "CASO-TRU-043-2A", **{"secret_baked":False,"runtime_secret":True,"config_declared":True,"durable_volumes":{"db"},"ephemeral_volumes":{"cache"}}}
invalid = {"case_id": "CASO-TRU-043-2A", **{"secret_baked":True,"runtime_secret":False,"config_declared":False,"durable_volumes":set(),"ephemeral_volumes":{"db"}}}
incomplete = {**valid}
incomplete.pop("ephemeral_volumes")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REMOVE_BAKED_SECRET MISSING:ephemeral_volumes` ,
        },
      },
      {
        id: "S43-T2-A-E3",
        subtopicId: "S43-T2-A",
        kind: "transfer",
        instruction: "S43-T2-A-E3 · Defiende fallo cerrado para `config, secrets y volumes` con tres fixtures distintos. `CASO-TRU-043-2A` debe continuar, el adverso debe devolver `REMOVE_BAKED_SECRET` y la ausencia de `ephemeral_volumes` debe devolver `CLASSIFY_VOLUME`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `CLASSIFY_VOLUME` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `CLASSIFY_VOLUME` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró secretos runtime y estado durable/efímero separado; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta ephemeral_volumes", "fixture adverso: secretos runtime y estado durable/efímero separado", "CASO-TRU-043-2A es sintético"],
        tests: "Fixtures `CASO-TRU-043-2A`, adverso y sin `ephemeral_volumes` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S43-T2-A-E3: explica qué campo cambió la decisión, por qué el adverso activa REMOVE_BAKED_SECRET y por qué faltar ephemeral_volumes exige CLASSIFY_VOLUME.",
        starterCode: {
          language: 'python',
          title: "s43-t2-a-e3.py",
          code: `# CASO-LIM-043 · decide REMOVE_BAKED_SECRET
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "secret_baked", "runtime_secret", "config_declared", "durable_volumes", "ephemeral_volumes"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["secret_baked"] or "db" in record["ephemeral_volumes"] else "REMOVE_BAKED_SECRET"

valid = {"case_id": "CASO-TRU-043-2A", **{"secret_baked":False,"runtime_secret":True,"config_declared":True,"durable_volumes":{"db"},"ephemeral_volumes":{"cache"}}}
invalid = {"case_id": "CASO-TRU-043-2A", **{"secret_baked":True,"runtime_secret":False,"config_declared":False,"durable_volumes":set(),"ephemeral_volumes":{"db"}}}
uncertain = {**valid}
uncertain.pop("ephemeral_volumes")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s43-t2-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "secret_baked", "runtime_secret", "config_declared", "durable_volumes", "ephemeral_volumes"}
    missing = sorted(required - record.keys())
    if missing:
        return "CLASSIFY_VOLUME"
    return "CONTINUE" if not record["secret_baked"] and record["runtime_secret"] and record["config_declared"] and "db" in record["durable_volumes"] and "cache" in record["ephemeral_volumes"] else "REMOVE_BAKED_SECRET"

valid = {"case_id": "CASO-TRU-043-2A", **{"secret_baked":False,"runtime_secret":True,"config_declared":True,"durable_volumes":{"db"},"ephemeral_volumes":{"cache"}}}
invalid = {"case_id": "CASO-TRU-043-2A", **{"secret_baked":True,"runtime_secret":False,"config_declared":False,"durable_volumes":set(),"ephemeral_volumes":{"db"}}}
uncertain = {**valid}
uncertain.pop("ephemeral_volumes")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REMOVE_BAKED_SECRET", "CLASSIFY_VOLUME"]` ,
          output: `CONTINUE REMOVE_BAKED_SECRET CLASSIFY_VOLUME` ,
        },
      },
      {
        id: "S43-T2-B-E1",
        subtopicId: "S43-T2-B",
        kind: "guided",
        instruction: "S43-T2-B-E1 · Modela el contrato de `networking, health checks y signals` sobre `CASO-TRU-043-2B`. La entrada es el dict completo del starter; la operación debe demostrar network privada, health semántico y drain de SIGTERM. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S43-T2-B PASS`; la misma operación sobre el fixture adverso debe activar `DRAIN_AND_ISOLATE` en E2.",
        hint: "Relaciona los campos `private_network`, `readiness_db`, `liveness_loop`, `sigterm_drains`, `grace_seconds` con la regla explicada en S43-T2-B.",
        hints: [
          "Relaciona los campos `private_network`, `readiness_db`, `liveness_loop`, `sigterm_drains`, `grace_seconds` con la regla explicada en S43-T2-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva health checks y shutdown ensayados; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta grace_seconds", "fixture adverso: network privada, health semántico y drain de SIGTERM", "CASO-TRU-043-2B es sintético"],
        tests: "El fixture `CASO-TRU-043-2B` satisface un predicado de dominio real; imprime `S43-T2-B PASS` y el assert booleano pasa.",
        feedback: "S43-T2-B-E1: explica qué campo cambió la decisión, por qué el adverso activa DRAIN_AND_ISOLATE y por qué faltar grace_seconds exige DIAGNOSE_HEALTH_SIGNAL.",
        starterCode: {
          language: 'python',
          title: "s43-t2-b-e1.py",
          code: `# CASO-LIM-043 · readiness + SIGTERM drain
# DEFECT: PASS si falta readiness_db o no drena
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-TRU-043-2B", **{"private_network":True,"readiness_db":True,"liveness_loop":True,"sigterm_drains":True,"grace_seconds":30}}
# DEFECT: readiness y drain en SIGTERM son obligatorios
meets_contract = not record["readiness_db"] or not record["sigterm_drains"]
status = "PASS" if meets_contract else "DRAIN_AND_ISOLATE"
print("S43-T2-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s43-t2-b-e1.py",
          code: `record = {"case_id": "CASO-TRU-043-2B", **{"private_network":True,"readiness_db":True,"liveness_loop":True,"sigterm_drains":True,"grace_seconds":30}}
meets_contract = record["private_network"] and record["readiness_db"] and record["liveness_loop"] and record["sigterm_drains"] and record["grace_seconds"] >= 20
status = "PASS" if meets_contract else "DRAIN_AND_ISOLATE"
print("S43-T2-B", status)
assert meets_contract is True` ,
          output: `S43-T2-B PASS` ,
        },
      },
      {
        id: "S43-T2-B-E2",
        subtopicId: "S43-T2-B",
        kind: "independent",
        instruction: "S43-T2-B-E2 · Audita tres rutas de `networking, health checks y signals`: fixture válido, fixture adverso y registro sin `grace_seconds`. Entrada: dict con case_id, private_network, readiness_db, liveness_loop, sigterm_drains, grace_seconds. Salidas exactas: `PASS`, `DRAIN_AND_ISOLATE`, `MISSING:grace_seconds`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a grace_seconds debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a grace_seconds debe ocurrir antes de esa rama.",
          "Después aplica la regla de S43-T2-B: network privada, health semántico y drain de SIGTERM. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta grace_seconds", "fixture adverso: network privada, health semántico y drain de SIGTERM", "CASO-TRU-043-2B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `grace_seconds` ausente y produce exactamente `PASS DRAIN_AND_ISOLATE MISSING:grace_seconds`.",
        feedback: "S43-T2-B-E2: explica qué campo cambió la decisión, por qué el adverso activa DRAIN_AND_ISOLATE y por qué faltar grace_seconds exige DIAGNOSE_HEALTH_SIGNAL.",
        starterCode: {
          language: 'python',
          title: "s43-t2-b-e2.py",
          code: `# CASO-LIM-043 · assess DRAIN_AND_ISOLATE
# DEFECT: PASS sin readiness o sin sigterm_drains
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "private_network", "readiness_db", "liveness_loop", "sigterm_drains", "grace_seconds"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if not record["readiness_db"] or not record["sigterm_drains"] else "DRAIN_AND_ISOLATE"

valid = {"case_id": "CASO-TRU-043-2B", **{"private_network":True,"readiness_db":True,"liveness_loop":True,"sigterm_drains":True,"grace_seconds":30}}
invalid = {"case_id": "CASO-TRU-043-2B", **{"private_network":False,"readiness_db":False,"liveness_loop":True,"sigterm_drains":False,"grace_seconds":0}}
incomplete = {**valid}
incomplete.pop("grace_seconds")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s43-t2-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "private_network", "readiness_db", "liveness_loop", "sigterm_drains", "grace_seconds"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["private_network"] and record["readiness_db"] and record["liveness_loop"] and record["sigterm_drains"] and record["grace_seconds"] >= 20 else "DRAIN_AND_ISOLATE"

valid = {"case_id": "CASO-TRU-043-2B", **{"private_network":True,"readiness_db":True,"liveness_loop":True,"sigterm_drains":True,"grace_seconds":30}}
invalid = {"case_id": "CASO-TRU-043-2B", **{"private_network":False,"readiness_db":False,"liveness_loop":True,"sigterm_drains":False,"grace_seconds":0}}
incomplete = {**valid}
incomplete.pop("grace_seconds")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS DRAIN_AND_ISOLATE MISSING:grace_seconds` ,
        },
      },
      {
        id: "S43-T2-B-E3",
        subtopicId: "S43-T2-B",
        kind: "transfer",
        instruction: "S43-T2-B-E3 · Recupera fallo cerrado para `networking, health checks y signals` con tres fixtures distintos. `CASO-TRU-043-2B` debe continuar, el adverso debe devolver `DRAIN_AND_ISOLATE` y la ausencia de `grace_seconds` debe devolver `DIAGNOSE_HEALTH_SIGNAL`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `DIAGNOSE_HEALTH_SIGNAL` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `DIAGNOSE_HEALTH_SIGNAL` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró network privada, health semántico y drain de SIGTERM; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta grace_seconds", "fixture adverso: network privada, health semántico y drain de SIGTERM", "CASO-TRU-043-2B es sintético"],
        tests: "Fixtures `CASO-TRU-043-2B`, adverso y sin `grace_seconds` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S43-T2-B-E3: explica qué campo cambió la decisión, por qué el adverso activa DRAIN_AND_ISOLATE y por qué faltar grace_seconds exige DIAGNOSE_HEALTH_SIGNAL.",
        starterCode: {
          language: 'python',
          title: "s43-t2-b-e3.py",
          code: `# CASO-LIM-043 · decide DRAIN_AND_ISOLATE
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "private_network", "readiness_db", "liveness_loop", "sigterm_drains", "grace_seconds"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if not record["readiness_db"] or not record["sigterm_drains"] else "DRAIN_AND_ISOLATE"

valid = {"case_id": "CASO-TRU-043-2B", **{"private_network":True,"readiness_db":True,"liveness_loop":True,"sigterm_drains":True,"grace_seconds":30}}
invalid = {"case_id": "CASO-TRU-043-2B", **{"private_network":False,"readiness_db":False,"liveness_loop":True,"sigterm_drains":False,"grace_seconds":0}}
uncertain = {**valid}
uncertain.pop("grace_seconds")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s43-t2-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "private_network", "readiness_db", "liveness_loop", "sigterm_drains", "grace_seconds"}
    missing = sorted(required - record.keys())
    if missing:
        return "DIAGNOSE_HEALTH_SIGNAL"
    return "CONTINUE" if record["private_network"] and record["readiness_db"] and record["liveness_loop"] and record["sigterm_drains"] and record["grace_seconds"] >= 20 else "DRAIN_AND_ISOLATE"

valid = {"case_id": "CASO-TRU-043-2B", **{"private_network":True,"readiness_db":True,"liveness_loop":True,"sigterm_drains":True,"grace_seconds":30}}
invalid = {"case_id": "CASO-TRU-043-2B", **{"private_network":False,"readiness_db":False,"liveness_loop":True,"sigterm_drains":False,"grace_seconds":0}}
uncertain = {**valid}
uncertain.pop("grace_seconds")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "DRAIN_AND_ISOLATE", "DIAGNOSE_HEALTH_SIGNAL"]` ,
          output: `CONTINUE DRAIN_AND_ISOLATE DIAGNOSE_HEALTH_SIGNAL` ,
        },
      },
      {
        id: "S43-T3-A-E1",
        subtopicId: "S43-T3-A",
        kind: "guided",
        instruction: "S43-T3-A-E1 · Verifica el contrato de `API/worker/DB/cache` sobre `CASO-TRU-043-3A`. La entrada es el dict completo del starter; la operación debe demostrar cuatro servicios sanos, retries y redes segmentadas. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S43-T3-A PASS`; la misma operación sobre el fixture adverso debe activar `STOP_UNHEALTHY_STACK` en E2.",
        hint: "Relaciona los campos `services`, `healthy`, `api_retries_db`, `networks` con la regla explicada en S43-T3-A.",
        hints: [
          "Relaciona los campos `services`, `healthy`, `api_retries_db`, `networks` con la regla explicada en S43-T3-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva stack sano desde entorno limpio; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta networks", "fixture adverso: cuatro servicios sanos, retries y redes segmentadas", "CASO-TRU-043-3A es sintético"],
        tests: "El fixture `CASO-TRU-043-3A` satisface un predicado de dominio real; imprime `S43-T3-A PASS` y el assert booleano pasa.",
        feedback: "S43-T3-A-E1: explica qué campo cambió la decisión, por qué el adverso activa STOP_UNHEALTHY_STACK y por qué faltar networks exige WAIT_FOR_DEPENDENCY.",
        starterCode: {
          language: 'python',
          title: "s43-t3-a-e1.py",
          code: `# CASO-LIM-043 · compose stack health
# DEFECT: PASS si healthy≠services y sin retries a DB
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-TRU-043-3A", **{"services":{"api","worker","db","cache"},"healthy":{"api","worker","db","cache"},"api_retries_db":True,"networks":{"front","back"}}}
# DEFECT: stack unhealthy sin retries controlados
meets_contract = record["healthy"] != record["services"] and not record["api_retries_db"]
status = "PASS" if meets_contract else "STOP_UNHEALTHY_STACK"
print("S43-T3-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s43-t3-a-e1.py",
          code: `record = {"case_id": "CASO-TRU-043-3A", **{"services":{"api","worker","db","cache"},"healthy":{"api","worker","db","cache"},"api_retries_db":True,"networks":{"front","back"}}}
meets_contract = {"api","worker","db","cache"} <= record["services"] and record["healthy"] == record["services"] and record["api_retries_db"] and {"front","back"} <= record["networks"]
status = "PASS" if meets_contract else "STOP_UNHEALTHY_STACK"
print("S43-T3-A", status)
assert meets_contract is True` ,
          output: `S43-T3-A PASS` ,
        },
      },
      {
        id: "S43-T3-A-E2",
        subtopicId: "S43-T3-A",
        kind: "independent",
        instruction: "S43-T3-A-E2 · Decide tres rutas de `API/worker/DB/cache`: fixture válido, fixture adverso y registro sin `networks`. Entrada: dict con case_id, services, healthy, api_retries_db, networks. Salidas exactas: `PASS`, `STOP_UNHEALTHY_STACK`, `MISSING:networks`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a networks debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a networks debe ocurrir antes de esa rama.",
          "Después aplica la regla de S43-T3-A: cuatro servicios sanos, retries y redes segmentadas. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta networks", "fixture adverso: cuatro servicios sanos, retries y redes segmentadas", "CASO-TRU-043-3A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `networks` ausente y produce exactamente `PASS STOP_UNHEALTHY_STACK MISSING:networks`.",
        feedback: "S43-T3-A-E2: explica qué campo cambió la decisión, por qué el adverso activa STOP_UNHEALTHY_STACK y por qué faltar networks exige WAIT_FOR_DEPENDENCY.",
        starterCode: {
          language: 'python',
          title: "s43-t3-a-e2.py",
          code: `# CASO-LIM-043 · assess STOP_UNHEALTHY_STACK
# DEFECT: PASS con servicios no healthy
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "services", "healthy", "api_retries_db", "networks"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["healthy"] != record["services"] and not record["api_retries_db"] else "STOP_UNHEALTHY_STACK"

valid = {"case_id": "CASO-TRU-043-3A", **{"services":{"api","worker","db","cache"},"healthy":{"api","worker","db","cache"},"api_retries_db":True,"networks":{"front","back"}}}
invalid = {"case_id": "CASO-TRU-043-3A", **{"services":{"api","worker","db","cache"},"healthy":{"db"},"api_retries_db":False,"networks":{"default"}}}
incomplete = {**valid}
incomplete.pop("networks")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s43-t3-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "services", "healthy", "api_retries_db", "networks"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if {"api","worker","db","cache"} <= record["services"] and record["healthy"] == record["services"] and record["api_retries_db"] and {"front","back"} <= record["networks"] else "STOP_UNHEALTHY_STACK"

valid = {"case_id": "CASO-TRU-043-3A", **{"services":{"api","worker","db","cache"},"healthy":{"api","worker","db","cache"},"api_retries_db":True,"networks":{"front","back"}}}
invalid = {"case_id": "CASO-TRU-043-3A", **{"services":{"api","worker","db","cache"},"healthy":{"db"},"api_retries_db":False,"networks":{"default"}}}
incomplete = {**valid}
incomplete.pop("networks")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS STOP_UNHEALTHY_STACK MISSING:networks` ,
        },
      },
      {
        id: "S43-T3-A-E3",
        subtopicId: "S43-T3-A",
        kind: "transfer",
        instruction: "S43-T3-A-E3 · Contrasta fallo cerrado para `API/worker/DB/cache` con tres fixtures distintos. `CASO-TRU-043-3A` debe continuar, el adverso debe devolver `STOP_UNHEALTHY_STACK` y la ausencia de `networks` debe devolver `WAIT_FOR_DEPENDENCY`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `WAIT_FOR_DEPENDENCY` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `WAIT_FOR_DEPENDENCY` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró cuatro servicios sanos, retries y redes segmentadas; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta networks", "fixture adverso: cuatro servicios sanos, retries y redes segmentadas", "CASO-TRU-043-3A es sintético"],
        tests: "Fixtures `CASO-TRU-043-3A`, adverso y sin `networks` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S43-T3-A-E3: explica qué campo cambió la decisión, por qué el adverso activa STOP_UNHEALTHY_STACK y por qué faltar networks exige WAIT_FOR_DEPENDENCY.",
        starterCode: {
          language: 'python',
          title: "s43-t3-a-e3.py",
          code: `# CASO-LIM-043 · decide STOP_UNHEALTHY_STACK
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "services", "healthy", "api_retries_db", "networks"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["healthy"] != record["services"] and not record["api_retries_db"] else "STOP_UNHEALTHY_STACK"

valid = {"case_id": "CASO-TRU-043-3A", **{"services":{"api","worker","db","cache"},"healthy":{"api","worker","db","cache"},"api_retries_db":True,"networks":{"front","back"}}}
invalid = {"case_id": "CASO-TRU-043-3A", **{"services":{"api","worker","db","cache"},"healthy":{"db"},"api_retries_db":False,"networks":{"default"}}}
uncertain = {**valid}
uncertain.pop("networks")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s43-t3-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "services", "healthy", "api_retries_db", "networks"}
    missing = sorted(required - record.keys())
    if missing:
        return "WAIT_FOR_DEPENDENCY"
    return "CONTINUE" if {"api","worker","db","cache"} <= record["services"] and record["healthy"] == record["services"] and record["api_retries_db"] and {"front","back"} <= record["networks"] else "STOP_UNHEALTHY_STACK"

valid = {"case_id": "CASO-TRU-043-3A", **{"services":{"api","worker","db","cache"},"healthy":{"api","worker","db","cache"},"api_retries_db":True,"networks":{"front","back"}}}
invalid = {"case_id": "CASO-TRU-043-3A", **{"services":{"api","worker","db","cache"},"healthy":{"db"},"api_retries_db":False,"networks":{"default"}}}
uncertain = {**valid}
uncertain.pop("networks")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "STOP_UNHEALTHY_STACK", "WAIT_FOR_DEPENDENCY"]` ,
          output: `CONTINUE STOP_UNHEALTHY_STACK WAIT_FOR_DEPENDENCY` ,
        },
      },
      {
        id: "S43-T3-B-E1",
        subtopicId: "S43-T3-B",
        kind: "guided",
        instruction: "S43-T3-B-E1 · Clasifica el contrato de `dependencias, migrations y datos efímeros` sobre `CASO-TRU-043-3B`. La entrada es el dict completo del starter; la operación debe demostrar expand compatible, efímero recreable y restore aprobado. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S43-T3-B PASS`; la misma operación sobre el fixture adverso debe activar `ROLL_BACK_MIGRATION` en E2.",
        hint: "Relaciona los campos `migration`, `old_code_compatible`, `ephemeral_reset`, `backup_restored` con la regla explicada en S43-T3-B.",
        hints: [
          "Relaciona los campos `migration`, `old_code_compatible`, `ephemeral_reset`, `backup_restored` con la regla explicada en S43-T3-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva migración y rollback de prueba; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta backup_restored", "fixture adverso: expand compatible, efímero recreable y restore aprobado", "CASO-TRU-043-3B es sintético"],
        tests: "El fixture `CASO-TRU-043-3B` satisface un predicado de dominio real; imprime `S43-T3-B PASS` y el assert booleano pasa.",
        feedback: "S43-T3-B-E1: explica qué campo cambió la decisión, por qué el adverso activa ROLL_BACK_MIGRATION y por qué faltar backup_restored exige RUN_RESTORE_DRILL.",
        starterCode: {
          language: 'python',
          title: "s43-t3-b-e1.py",
          code: `# CASO-LIM-043 · expand/contract migrations
# DEFECT: PASS si migration contract sin compat
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-TRU-043-3B", **{"migration":"expand","old_code_compatible":True,"ephemeral_reset":True,"backup_restored":True}}
# DEFECT: migración contract requiere compat con código viejo o rollback
meets_contract = record["migration"] == "contract" and not record["old_code_compatible"]
status = "PASS" if meets_contract else "ROLL_BACK_MIGRATION"
print("S43-T3-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s43-t3-b-e1.py",
          code: `record = {"case_id": "CASO-TRU-043-3B", **{"migration":"expand","old_code_compatible":True,"ephemeral_reset":True,"backup_restored":True}}
meets_contract = record["migration"] == "expand" and record["old_code_compatible"] and record["ephemeral_reset"] and record["backup_restored"]
status = "PASS" if meets_contract else "ROLL_BACK_MIGRATION"
print("S43-T3-B", status)
assert meets_contract is True` ,
          output: `S43-T3-B PASS` ,
        },
      },
      {
        id: "S43-T3-B-E2",
        subtopicId: "S43-T3-B",
        kind: "independent",
        instruction: "S43-T3-B-E2 · Calcula tres rutas de `dependencias, migrations y datos efímeros`: fixture válido, fixture adverso y registro sin `backup_restored`. Entrada: dict con case_id, migration, old_code_compatible, ephemeral_reset, backup_restored. Salidas exactas: `PASS`, `ROLL_BACK_MIGRATION`, `MISSING:backup_restored`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a backup_restored debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a backup_restored debe ocurrir antes de esa rama.",
          "Después aplica la regla de S43-T3-B: expand compatible, efímero recreable y restore aprobado. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta backup_restored", "fixture adverso: expand compatible, efímero recreable y restore aprobado", "CASO-TRU-043-3B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `backup_restored` ausente y produce exactamente `PASS ROLL_BACK_MIGRATION MISSING:backup_restored`.",
        feedback: "S43-T3-B-E2: explica qué campo cambió la decisión, por qué el adverso activa ROLL_BACK_MIGRATION y por qué faltar backup_restored exige RUN_RESTORE_DRILL.",
        starterCode: {
          language: 'python',
          title: "s43-t3-b-e2.py",
          code: `# CASO-LIM-043 · assess ROLL_BACK_MIGRATION
# DEFECT: PASS con migrate contract y old_code incompatible
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "migration", "old_code_compatible", "ephemeral_reset", "backup_restored"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["migration"] == "contract" and not record["old_code_compatible"] else "ROLL_BACK_MIGRATION"

valid = {"case_id": "CASO-TRU-043-3B", **{"migration":"expand","old_code_compatible":True,"ephemeral_reset":True,"backup_restored":True}}
invalid = {"case_id": "CASO-TRU-043-3B", **{"migration":"contract","old_code_compatible":False,"ephemeral_reset":False,"backup_restored":False}}
incomplete = {**valid}
incomplete.pop("backup_restored")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s43-t3-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "migration", "old_code_compatible", "ephemeral_reset", "backup_restored"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["migration"] == "expand" and record["old_code_compatible"] and record["ephemeral_reset"] and record["backup_restored"] else "ROLL_BACK_MIGRATION"

valid = {"case_id": "CASO-TRU-043-3B", **{"migration":"expand","old_code_compatible":True,"ephemeral_reset":True,"backup_restored":True}}
invalid = {"case_id": "CASO-TRU-043-3B", **{"migration":"contract","old_code_compatible":False,"ephemeral_reset":False,"backup_restored":False}}
incomplete = {**valid}
incomplete.pop("backup_restored")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS ROLL_BACK_MIGRATION MISSING:backup_restored` ,
        },
      },
      {
        id: "S43-T3-B-E3",
        subtopicId: "S43-T3-B",
        kind: "transfer",
        instruction: "S43-T3-B-E3 · Instrumenta fallo cerrado para `dependencias, migrations y datos efímeros` con tres fixtures distintos. `CASO-TRU-043-3B` debe continuar, el adverso debe devolver `ROLL_BACK_MIGRATION` y la ausencia de `backup_restored` debe devolver `RUN_RESTORE_DRILL`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `RUN_RESTORE_DRILL` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `RUN_RESTORE_DRILL` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró expand compatible, efímero recreable y restore aprobado; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta backup_restored", "fixture adverso: expand compatible, efímero recreable y restore aprobado", "CASO-TRU-043-3B es sintético"],
        tests: "Fixtures `CASO-TRU-043-3B`, adverso y sin `backup_restored` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S43-T3-B-E3: explica qué campo cambió la decisión, por qué el adverso activa ROLL_BACK_MIGRATION y por qué faltar backup_restored exige RUN_RESTORE_DRILL.",
        starterCode: {
          language: 'python',
          title: "s43-t3-b-e3.py",
          code: `# CASO-LIM-043 · decide ROLL_BACK_MIGRATION
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "migration", "old_code_compatible", "ephemeral_reset", "backup_restored"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["migration"] == "contract" and not record["old_code_compatible"] else "ROLL_BACK_MIGRATION"

valid = {"case_id": "CASO-TRU-043-3B", **{"migration":"expand","old_code_compatible":True,"ephemeral_reset":True,"backup_restored":True}}
invalid = {"case_id": "CASO-TRU-043-3B", **{"migration":"contract","old_code_compatible":False,"ephemeral_reset":False,"backup_restored":False}}
uncertain = {**valid}
uncertain.pop("backup_restored")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s43-t3-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "migration", "old_code_compatible", "ephemeral_reset", "backup_restored"}
    missing = sorted(required - record.keys())
    if missing:
        return "RUN_RESTORE_DRILL"
    return "CONTINUE" if record["migration"] == "expand" and record["old_code_compatible"] and record["ephemeral_reset"] and record["backup_restored"] else "ROLL_BACK_MIGRATION"

valid = {"case_id": "CASO-TRU-043-3B", **{"migration":"expand","old_code_compatible":True,"ephemeral_reset":True,"backup_restored":True}}
invalid = {"case_id": "CASO-TRU-043-3B", **{"migration":"contract","old_code_compatible":False,"ephemeral_reset":False,"backup_restored":False}}
uncertain = {**valid}
uncertain.pop("backup_restored")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "ROLL_BACK_MIGRATION", "RUN_RESTORE_DRILL"]` ,
          output: `CONTINUE ROLL_BACK_MIGRATION RUN_RESTORE_DRILL` ,
        },
      },
      {
        id: "S43-T4-A-E1",
        subtopicId: "S43-T4-A",
        kind: "guided",
        instruction: "S43-T4-A-E1 · Audita el contrato de `locks y multi-stage builds` sobre `CASO-TRU-043-4A`. La entrada es el dict completo del starter; la operación debe demostrar lock con hash y runtime sin toolchain. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S43-T4-A PASS`; la misma operación sobre el fixture adverso debe activar `BLOCK_UNPINNED_BUILD` en E2.",
        hint: "Relaciona los campos `lock_hash`, `stages`, `compiler_in_runtime`, `runtime_deps_locked` con la regla explicada en S43-T4-A.",
        hints: [
          "Relaciona los campos `lock_hash`, `stages`, `compiler_in_runtime`, `runtime_deps_locked` con la regla explicada en S43-T4-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva lock verificado e imagen runtime reducida; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta runtime_deps_locked", "fixture adverso: lock con hash y runtime sin toolchain", "CASO-TRU-043-4A es sintético"],
        tests: "El fixture `CASO-TRU-043-4A` satisface un predicado de dominio real; imprime `S43-T4-A PASS` y el assert booleano pasa.",
        feedback: "S43-T4-A-E1: explica qué campo cambió la decisión, por qué el adverso activa BLOCK_UNPINNED_BUILD y por qué faltar runtime_deps_locked exige REGENERATE_LOCK.",
        starterCode: {
          language: 'python',
          title: "s43-t4-a-e1.py",
          code: `# CASO-LIM-043 · locks + multi-stage
# DEFECT: PASS si runtime_deps no locked o compiler en runtime
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-TRU-043-4A", **{"lock_hash":"sha256:abc","stages":{"builder","runtime"},"compiler_in_runtime":False,"runtime_deps_locked":True}}
# DEFECT: runtime debe ir locked y sin compiler de build
meets_contract = not record["runtime_deps_locked"] or record["compiler_in_runtime"]
status = "PASS" if meets_contract else "BLOCK_UNPINNED_BUILD"
print("S43-T4-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s43-t4-a-e1.py",
          code: `record = {"case_id": "CASO-TRU-043-4A", **{"lock_hash":"sha256:abc","stages":{"builder","runtime"},"compiler_in_runtime":False,"runtime_deps_locked":True}}
meets_contract = record["lock_hash"].startswith("sha256:") and {"builder","runtime"} <= record["stages"] and not record["compiler_in_runtime"] and record["runtime_deps_locked"]
status = "PASS" if meets_contract else "BLOCK_UNPINNED_BUILD"
print("S43-T4-A", status)
assert meets_contract is True` ,
          output: `S43-T4-A PASS` ,
        },
      },
      {
        id: "S43-T4-A-E2",
        subtopicId: "S43-T4-A",
        kind: "independent",
        instruction: "S43-T4-A-E2 · Compara tres rutas de `locks y multi-stage builds`: fixture válido, fixture adverso y registro sin `runtime_deps_locked`. Entrada: dict con case_id, lock_hash, stages, compiler_in_runtime, runtime_deps_locked. Salidas exactas: `PASS`, `BLOCK_UNPINNED_BUILD`, `MISSING:runtime_deps_locked`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a runtime_deps_locked debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a runtime_deps_locked debe ocurrir antes de esa rama.",
          "Después aplica la regla de S43-T4-A: lock con hash y runtime sin toolchain. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta runtime_deps_locked", "fixture adverso: lock con hash y runtime sin toolchain", "CASO-TRU-043-4A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `runtime_deps_locked` ausente y produce exactamente `PASS BLOCK_UNPINNED_BUILD MISSING:runtime_deps_locked`.",
        feedback: "S43-T4-A-E2: explica qué campo cambió la decisión, por qué el adverso activa BLOCK_UNPINNED_BUILD y por qué faltar runtime_deps_locked exige REGENERATE_LOCK.",
        starterCode: {
          language: 'python',
          title: "s43-t4-a-e2.py",
          code: `# CASO-LIM-043 · assess BLOCK_UNPINNED_BUILD
# DEFECT: PASS sin lock o con compiler en runtime
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "lock_hash", "stages", "compiler_in_runtime", "runtime_deps_locked"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if not record["runtime_deps_locked"] or record["compiler_in_runtime"] else "BLOCK_UNPINNED_BUILD"

valid = {"case_id": "CASO-TRU-043-4A", **{"lock_hash":"sha256:abc","stages":{"builder","runtime"},"compiler_in_runtime":False,"runtime_deps_locked":True}}
invalid = {"case_id": "CASO-TRU-043-4A", **{"lock_hash":"latest","stages":{"runtime"},"compiler_in_runtime":True,"runtime_deps_locked":False}}
incomplete = {**valid}
incomplete.pop("runtime_deps_locked")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s43-t4-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "lock_hash", "stages", "compiler_in_runtime", "runtime_deps_locked"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["lock_hash"].startswith("sha256:") and {"builder","runtime"} <= record["stages"] and not record["compiler_in_runtime"] and record["runtime_deps_locked"] else "BLOCK_UNPINNED_BUILD"

valid = {"case_id": "CASO-TRU-043-4A", **{"lock_hash":"sha256:abc","stages":{"builder","runtime"},"compiler_in_runtime":False,"runtime_deps_locked":True}}
invalid = {"case_id": "CASO-TRU-043-4A", **{"lock_hash":"latest","stages":{"runtime"},"compiler_in_runtime":True,"runtime_deps_locked":False}}
incomplete = {**valid}
incomplete.pop("runtime_deps_locked")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS BLOCK_UNPINNED_BUILD MISSING:runtime_deps_locked` ,
        },
      },
      {
        id: "S43-T4-A-E3",
        subtopicId: "S43-T4-A",
        kind: "transfer",
        instruction: "S43-T4-A-E3 · Aísla fallo cerrado para `locks y multi-stage builds` con tres fixtures distintos. `CASO-TRU-043-4A` debe continuar, el adverso debe devolver `BLOCK_UNPINNED_BUILD` y la ausencia de `runtime_deps_locked` debe devolver `REGENERATE_LOCK`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REGENERATE_LOCK` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REGENERATE_LOCK` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró lock con hash y runtime sin toolchain; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta runtime_deps_locked", "fixture adverso: lock con hash y runtime sin toolchain", "CASO-TRU-043-4A es sintético"],
        tests: "Fixtures `CASO-TRU-043-4A`, adverso y sin `runtime_deps_locked` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S43-T4-A-E3: explica qué campo cambió la decisión, por qué el adverso activa BLOCK_UNPINNED_BUILD y por qué faltar runtime_deps_locked exige REGENERATE_LOCK.",
        starterCode: {
          language: 'python',
          title: "s43-t4-a-e3.py",
          code: `# CASO-LIM-043 · decide BLOCK_UNPINNED_BUILD
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "lock_hash", "stages", "compiler_in_runtime", "runtime_deps_locked"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if not record["runtime_deps_locked"] or record["compiler_in_runtime"] else "BLOCK_UNPINNED_BUILD"

valid = {"case_id": "CASO-TRU-043-4A", **{"lock_hash":"sha256:abc","stages":{"builder","runtime"},"compiler_in_runtime":False,"runtime_deps_locked":True}}
invalid = {"case_id": "CASO-TRU-043-4A", **{"lock_hash":"latest","stages":{"runtime"},"compiler_in_runtime":True,"runtime_deps_locked":False}}
uncertain = {**valid}
uncertain.pop("runtime_deps_locked")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s43-t4-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "lock_hash", "stages", "compiler_in_runtime", "runtime_deps_locked"}
    missing = sorted(required - record.keys())
    if missing:
        return "REGENERATE_LOCK"
    return "CONTINUE" if record["lock_hash"].startswith("sha256:") and {"builder","runtime"} <= record["stages"] and not record["compiler_in_runtime"] and record["runtime_deps_locked"] else "BLOCK_UNPINNED_BUILD"

valid = {"case_id": "CASO-TRU-043-4A", **{"lock_hash":"sha256:abc","stages":{"builder","runtime"},"compiler_in_runtime":False,"runtime_deps_locked":True}}
invalid = {"case_id": "CASO-TRU-043-4A", **{"lock_hash":"latest","stages":{"runtime"},"compiler_in_runtime":True,"runtime_deps_locked":False}}
uncertain = {**valid}
uncertain.pop("runtime_deps_locked")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "BLOCK_UNPINNED_BUILD", "REGENERATE_LOCK"]` ,
          output: `CONTINUE BLOCK_UNPINNED_BUILD REGENERATE_LOCK` ,
        },
      },
      {
        id: "S43-T4-B-E1",
        subtopicId: "S43-T4-B",
        kind: "guided",
        instruction: "S43-T4-B-E1 · Decide el contrato de `scanning, resource limits y debugging` sobre `CASO-TRU-043-4B`. La entrada es el dict completo del starter; la operación debe demostrar scan limpio, límites definidos y debugging sin shell root. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S43-T4-B PASS`; la misma operación sobre el fixture adverso debe activar `QUARANTINE_IMAGE` en E2.",
        hint: "Relaciona los campos `critical_cves`, `memory_limit_mb`, `cpu_limit`, `debug_shell`, `logs_redacted` con la regla explicada en S43-T4-B.",
        hints: [
          "Relaciona los campos `critical_cves`, `memory_limit_mb`, `cpu_limit`, `debug_shell`, `logs_redacted` con la regla explicada en S43-T4-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva vulnerabilidad crítica y OOM simulados bloquean; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta logs_redacted", "fixture adverso: scan limpio, límites definidos y debugging sin shell root", "CASO-TRU-043-4B es sintético"],
        tests: "El fixture `CASO-TRU-043-4B` satisface un predicado de dominio real; imprime `S43-T4-B PASS` y el assert booleano pasa.",
        feedback: "S43-T4-B-E1: explica qué campo cambió la decisión, por qué el adverso activa QUARANTINE_IMAGE y por qué faltar logs_redacted exige TRIAGE_SCAN_FINDING.",
        starterCode: {
          language: 'python',
          title: "s43-t4-b-e1.py",
          code: `# CASO-LIM-043 · CVE scan + debug shell + logs
# DEFECT: PASS si critical_cves>0 o debug_shell o logs sin redact
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-TRU-043-4B", **{"critical_cves":0,"memory_limit_mb":512,"cpu_limit":1.0,"debug_shell":False,"logs_redacted":True}}
# DEFECT: CVE críticos, shell de debug o logs con PII → quarantine
meets_contract = record["critical_cves"] > 0 or record["debug_shell"] or not record["logs_redacted"]
status = "PASS" if meets_contract else "QUARANTINE_IMAGE"
print("S43-T4-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s43-t4-b-e1.py",
          code: `record = {"case_id": "CASO-TRU-043-4B", **{"critical_cves":0,"memory_limit_mb":512,"cpu_limit":1.0,"debug_shell":False,"logs_redacted":True}}
meets_contract = record["critical_cves"] == 0 and record["memory_limit_mb"] <= 512 and record["cpu_limit"] <= 1.0 and not record["debug_shell"] and record["logs_redacted"]
status = "PASS" if meets_contract else "QUARANTINE_IMAGE"
print("S43-T4-B", status)
assert meets_contract is True` ,
          output: `S43-T4-B PASS` ,
        },
      },
      {
        id: "S43-T4-B-E2",
        subtopicId: "S43-T4-B",
        kind: "independent",
        instruction: "S43-T4-B-E2 · Filtra tres rutas de `scanning, resource limits y debugging`: fixture válido, fixture adverso y registro sin `logs_redacted`. Entrada: dict con case_id, critical_cves, memory_limit_mb, cpu_limit, debug_shell, logs_redacted. Salidas exactas: `PASS`, `QUARANTINE_IMAGE`, `MISSING:logs_redacted`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a logs_redacted debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a logs_redacted debe ocurrir antes de esa rama.",
          "Después aplica la regla de S43-T4-B: scan limpio, límites definidos y debugging sin shell root. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta logs_redacted", "fixture adverso: scan limpio, límites definidos y debugging sin shell root", "CASO-TRU-043-4B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `logs_redacted` ausente y produce exactamente `PASS QUARANTINE_IMAGE MISSING:logs_redacted`.",
        feedback: "S43-T4-B-E2: explica qué campo cambió la decisión, por qué el adverso activa QUARANTINE_IMAGE y por qué faltar logs_redacted exige TRIAGE_SCAN_FINDING.",
        starterCode: {
          language: 'python',
          title: "s43-t4-b-e2.py",
          code: `# CASO-LIM-043 · assess QUARANTINE_IMAGE
# DEFECT: PASS con CVEs/debug shell/logs crudos
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "critical_cves", "memory_limit_mb", "cpu_limit", "debug_shell", "logs_redacted"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["critical_cves"] > 0 or record["debug_shell"] or not record["logs_redacted"] else "QUARANTINE_IMAGE"

valid = {"case_id": "CASO-TRU-043-4B", **{"critical_cves":0,"memory_limit_mb":512,"cpu_limit":1.0,"debug_shell":False,"logs_redacted":True}}
invalid = {"case_id": "CASO-TRU-043-4B", **{"critical_cves":3,"memory_limit_mb":0,"cpu_limit":0.0,"debug_shell":True,"logs_redacted":False}}
incomplete = {**valid}
incomplete.pop("logs_redacted")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s43-t4-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "critical_cves", "memory_limit_mb", "cpu_limit", "debug_shell", "logs_redacted"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["critical_cves"] == 0 and record["memory_limit_mb"] <= 512 and record["cpu_limit"] <= 1.0 and not record["debug_shell"] and record["logs_redacted"] else "QUARANTINE_IMAGE"

valid = {"case_id": "CASO-TRU-043-4B", **{"critical_cves":0,"memory_limit_mb":512,"cpu_limit":1.0,"debug_shell":False,"logs_redacted":True}}
invalid = {"case_id": "CASO-TRU-043-4B", **{"critical_cves":3,"memory_limit_mb":0,"cpu_limit":0.0,"debug_shell":True,"logs_redacted":False}}
incomplete = {**valid}
incomplete.pop("logs_redacted")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS QUARANTINE_IMAGE MISSING:logs_redacted` ,
        },
      },
      {
        id: "S43-T4-B-E3",
        subtopicId: "S43-T4-B",
        kind: "transfer",
        instruction: "S43-T4-B-E3 · Demuestra fallo cerrado para `scanning, resource limits y debugging` con tres fixtures distintos. `CASO-TRU-043-4B` debe continuar, el adverso debe devolver `QUARANTINE_IMAGE` y la ausencia de `logs_redacted` debe devolver `TRIAGE_SCAN_FINDING`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `TRIAGE_SCAN_FINDING` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `TRIAGE_SCAN_FINDING` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró scan limpio, límites definidos y debugging sin shell root; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta logs_redacted", "fixture adverso: scan limpio, límites definidos y debugging sin shell root", "CASO-TRU-043-4B es sintético"],
        tests: "Fixtures `CASO-TRU-043-4B`, adverso y sin `logs_redacted` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S43-T4-B-E3: explica qué campo cambió la decisión, por qué el adverso activa QUARANTINE_IMAGE y por qué faltar logs_redacted exige TRIAGE_SCAN_FINDING.",
        starterCode: {
          language: 'python',
          title: "s43-t4-b-e3.py",
          code: `# CASO-LIM-043 · decide QUARANTINE_IMAGE
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "critical_cves", "memory_limit_mb", "cpu_limit", "debug_shell", "logs_redacted"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["critical_cves"] > 0 or record["debug_shell"] or not record["logs_redacted"] else "QUARANTINE_IMAGE"

valid = {"case_id": "CASO-TRU-043-4B", **{"critical_cves":0,"memory_limit_mb":512,"cpu_limit":1.0,"debug_shell":False,"logs_redacted":True}}
invalid = {"case_id": "CASO-TRU-043-4B", **{"critical_cves":3,"memory_limit_mb":0,"cpu_limit":0.0,"debug_shell":True,"logs_redacted":False}}
uncertain = {**valid}
uncertain.pop("logs_redacted")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s43-t4-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "critical_cves", "memory_limit_mb", "cpu_limit", "debug_shell", "logs_redacted"}
    missing = sorted(required - record.keys())
    if missing:
        return "TRIAGE_SCAN_FINDING"
    return "CONTINUE" if record["critical_cves"] == 0 and record["memory_limit_mb"] <= 512 and record["cpu_limit"] <= 1.0 and not record["debug_shell"] and record["logs_redacted"] else "QUARANTINE_IMAGE"

valid = {"case_id": "CASO-TRU-043-4B", **{"critical_cves":0,"memory_limit_mb":512,"cpu_limit":1.0,"debug_shell":False,"logs_redacted":True}}
invalid = {"case_id": "CASO-TRU-043-4B", **{"critical_cves":3,"memory_limit_mb":0,"cpu_limit":0.0,"debug_shell":True,"logs_redacted":False}}
uncertain = {**valid}
uncertain.pop("logs_redacted")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "QUARANTINE_IMAGE", "TRIAGE_SCAN_FINDING"]` ,
          output: `CONTINUE QUARANTINE_IMAGE TRIAGE_SCAN_FINDING` ,
        },
      },
    ],
  },
  youDo: {
    title: "[FINAL] Contenedores y reproducibilidad operativa (CP-N4-A (cierre))",
    context: "Governed Python Service Platform reproducible. Trabaja sobre API, worker, base y cache locales de una plataforma ficticia en Trujillo. Entrada: código fijado, locks, configuración no secreta y secretos inyectados en runtime. Salida: imágenes mínimas, servicios sanos y recuperación documentada con un comando. El gate se bloquea ante: imagen mutable, proceso root, health check falso o migración no reversible bloquea release.",
    objectives: [
      "Convertir código fijado, locks, configuración no secreta y secretos inyectados en runtime en imágenes mínimas, servicios sanos y recuperación documentada con un comando.",
      "Demostrar el gate: build repetible, usuario no root, límites de recursos y shutdown limpio pasan en entorno nuevo.",
      "Probar el fallo: imagen mutable, proceso root, health check falso o migración no reversible bloquea release.",
      "Entregar evidencia reproducible, redactada, sin PII real, secretos ni servicios externos obligatorios.",
    ],
    requirements: [
      "Usa exclusivamente fixtures sintéticos identificados por `CASO-TRU-043`.",
      "Incluye Dockerfile multi-stage fijado.",
      "Incluye Compose con API/worker/DB/cache y health checks.",
      "Incluye config/secrets/volumes documentados.",
      "Incluye runbook de migración, señales, límites y recuperación.",
      "Automatiza un caso normal, uno de breach (`BLOCK_IMAGE`) y uno incierto (`QUARANTINE_BUILD`).",
      "Incluye comandos locales reproducibles, dependencias fijadas y salida esperada.",
      "Registra riesgo residual, responsable, criterio de rollback y limitaciones conocidas.",
    ],
    starterCode: `CASE_ID = "CASO-TRU-043"
REQUIRED = ['dockerfile_multi_stage_fijado', 'compose_con_api_worker_db_cache_y_health_checks', 'config_secrets_volumes_documentados', 'runbook_de_migracion_senales_limites_y_recuperacion']
evidence = {
    "dockerfile_multi_stage_fijado": False,
    "compose_con_api_worker_db_cache_y_health_checks": False,
    "config_secrets_volumes_documentados": False,
    "runbook_de_migracion_senales_limites_y_recuperacion": False
}

def readiness(bundle: dict[str, bool]) -> tuple[str, list[str]]:
    missing = [name for name in REQUIRED if bundle.get(name) is not True]
    return ("READY", []) if not missing else ("BLOCKED", missing)

status, missing = readiness(evidence)
print(CASE_ID, status)
print("missing", ",".join(missing))
assert status in {"READY", "BLOCKED"}
`,
    portfolioNote: "Evidencia de CP-N4-A · servicio reproducible en contenedores: muestra baseline, decisión, pruebas, resultado medido, rollback y riesgo residual. El checklist inicia en BLOCKED por diseño; conviértelo en READY enlazando artefactos reales del proyecto, no cambiando asserts.",
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
        question: "¿Qué evidencia permite aprobar `Dockerfile, layers y cache` en CASO-TRU-043?",
        options: ["un print sin assert ni versión", "una captura de pantalla sin fuente", "dos builds producen el mismo digest lógico", "datos personales reales para que parezca auténtico"],
        correctIndex: 2,
        explanation: "La teoría exige dos builds producen el mismo digest lógico; evidencia decorativa o PII no satisface el contrato.",
      },
      {
        question: "Si ocurre la condición de error de S43, ¿qué respuesta preserva seguridad y auditabilidad?",
        options: ["emitir BLOCK_IMAGE y conservar evidencia", "continuar y ocultar el warning", "inventar evidencia faltante", "borrar el trace para reducir ruido"],
        correctIndex: 0,
        explanation: "El contrato falla cerrado con BLOCK_IMAGE; no convierte incertidumbre o breach en éxito.",
      },
      {
        question: "¿Cuál resultado demuestra el gate `CP-N4-A · servicio reproducible en contenedores`?",
        options: ["el archivo S43 existe, aunque no pruebe el gate", "build repetible, usuario no root, límites de recursos y shutdown limpio pasan en entorno nuevo", "el README afirma que funciona", "se usó la herramienta más nueva"],
        correctIndex: 1,
        explanation: "El gate es conductual y medible: build repetible, usuario no root, límites de recursos y shutdown limpio pasan en entorno nuevo.",
      },
      {
        question: "¿Qué tratamiento de `CASO-TRU-043` respeta el alcance del curso?",
        options: ["reemplazarlo por datos reales sin consentimiento", "subir secretos para facilitar la demo", "inferir fraude o parentesco desde ER", "mantenerlo sintético, mínimo, trazable y sujeto a revisión humana"],
        correctIndex: 3,
        explanation: "Los casos son sintéticos; ER solo propone correspondencia de entidad y no prueba fraude, parentesco ni riesgo.",
      },
      {
        question: "Un Dockerfile que copia el source antes del lock de dependencias…",
        options: ["maximiza cache: solo app cambia y deps no se re-resuelven", "es obligatorio para non-root", "invalida cache de deps en cada commit de código (reorder a deps_before_app)", "garantiza el mismo digest aunque el lock cambie"],
        correctIndex: 2,
        explanation: "Layers deben ir de estable a cambiante: deps/lock antes de app; copiar source primero rompe el cache de dependencias.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "Dockerfile reference",
        url: "https://docs.docker.com/reference/dockerfile/",
        note: "Layers, usuarios y builds",
      },
      {
        label: "Docker multi-stage builds",
        url: "https://docs.docker.com/build/building/multi-stage/",
        note: "Builder vs runtime",
      },
      {
        label: "Docker best practices",
        url: "https://docs.docker.com/build/building/best-practices/",
        note: "Cache, non-root y tamaño",
      },
      {
        label: "Docker Compose Specification",
        url: "https://docs.docker.com/compose/compose-file/",
        note: "Servicios, networks, health y volumes",
      },
      {
        label: "OCI Image Specification",
        url: "https://github.com/opencontainers/image-spec",
        note: "Formato y contenido de imágenes",
      },
      {
        label: "OWASP Docker Security Cheat Sheet",
        url: "https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html",
        note: "Hardening de contenedores",
      },
      {
        label: "NIST SP 800-190 App Container Security",
        url: "https://csrc.nist.gov/publications/detail/sp/800-190/final",
        note: "Amenazas y controles de contenedores",
      },
      {
        label: "Twelve-Factor App",
        url: "https://12factor.net/",
        note: "Config, logs y procesos desechables",
      },
      {
        label: "Trivy (image scanning)",
        url: "https://github.com/aquasecurity/trivy",
        note: "Scan de CVEs en imágenes",
      },
      {
        label: "Python signal handling",
        url: "https://docs.python.org/3/library/signal.html",
        note: "Shutdown limpio (SIGTERM)",
      },
    ],
    books: [
      { label: "Container Security (Rice)", note: "Non-root, supply chain y runtime" },
      { label: "Site Reliability Engineering", note: "Health, capacity y cambio seguro" },
    ],
    courses: [
      { label: "Coursera Docker courses", url: "https://www.coursera.org/courses?query=docker", note: "Contenedores y orquestación intro" },
      { label: "MIT 6.100L", url: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/", note: "Contratos verificables" },
      { label: "Harvard CS50P", url: "https://cs50.harvard.edu/python/", note: "Tests y proyectos reproducibles" },
      { label: "Py4E", url: "https://www.py4e.com", note: "Stdlib-first progressive disclosure" },
      { label: "Kubernetes probes (conceptual transfer)", url: "https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#container-probes", note: "Health/readiness analogy" },
    ],
  },
}
