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
  icon: "Package",
  accentColor: "bg-gradient-to-br from-amber-500 to-red-600",
  jobRelevance:
    "En equipos de plataforma y producto, **contenedores y reproducibilidad operativa** empaquetan el servicio de S41–S42 en algo que se levanta con un comando: imagen mínima, non-root, health/readiness y shutdown limpio. Se promociona solo cuando el build es repetible en un entorno nuevo, no hay secretos horneados y los límites de recursos y CVE críticos están bajo control. Esta sección no cubre pipelines de fine-tuning de modelos: el foco es empaquetar y operar el servicio Python de forma reproducible.",
  learningOutcomes: [
    { text: "Ordenar layers de un Dockerfile (base → deps/lock → app → USER/CMD) y explicar cuándo se invalida el cache" },
    { text: "Elegir base parchable con digest, ejecutar como UID ≥1000 sin capabilities extras y acotar tamaño runtime" },
    { text: "Inyectar secretos solo en runtime, declarar config no secreta y clasificar volumes durable vs efímero" },
    { text: "Diseñar readiness/liveness y drenar trabajo en SIGTERM con grace period medible" },
    { text: "Componer API/worker/DB/cache con redes, health y retries de aplicación (depends_on no basta)" },
    { text: "Aplicar migraciones expand/contract, recrear datos efímeros y ensayar restore de durable" },
    { text: "Fijar locks con hash y multi-stage (toolchain solo en builder; runtime mínimo)" },
    { text: "Escanear CVEs, definir límites CPU/memoria > 0 y depurar sin shell root permanente" },
  ],
  theory: [
    {
      heading: "Ruta de S43: Contenedores y reproducibilidad operativa",
      paragraphs: [
        "**Mapa de ideas (luego T1 las aterriza con un Dockerfile real).** **Layer cache:** deps/lock antes de app para no invalidar en cada commit. **Non-root:** UID ≥1000 sin capabilities extras. **Secret injection:** solo en runtime, nunca en capas. **Health/readiness:** el proceso solo se declara listo cuando puede servir. **Compose:** API/worker/DB/cache con redes y health. **Multi-stage:** toolchain fuera de la imagen final. **Resource limits:** CPU/memoria acotados y > 0. **SBOM/scan:** inventario y CVEs antes de promover. En S44 conectarás estos gates al pipeline CI/CD.",
        "Esta sección empaqueta el servicio seguro de S42 en **contenedores reproducibles** sin exigir un cluster: aprendes los contratos de Dockerfile y Compose (referencia Docker oficial) y los verificas primero con modelos en Python/stdlib que puedes correr en el navegador o en local. El caso `CASO-TRU-043` (plataforma ficticia en Trujillo) es sintético: sin secretos reales ni registro remoto obligatorio.",
        "Producto incremental: Governed Python Service Platform. Entrada: código fijado, lock de deps, config no secreta y secretos inyectados en runtime. Salida: layers cacheables, non-root, health/readiness, compose API/worker/DB/cache y runbook de recovery. Error de promoción: root UID, secret horneado, health falso o migración no reversible.",
        "Orden de aprendizaje: T1 Dockerfile y non-root → T2 config, secretos y señales → T3 Compose y migraciones → T4 locks, multi-stage, scan y límites. En cada bloque verás el contrato, una demo que lo calcula y ejercicios que fallan cerrado si el build no es reproducible. Stack de práctica: **stdlib** para modelar el contrato; en el youDo documentas los artefactos reales (Dockerfile/Compose) listos para un entorno con Docker.",
      ],
      code: {
        language: 'python',
        title: "s43_map_contract.py",
        code: `def section_contract():
    return {
        "case": "CASO-TRU-043",
        "gates": ["repeatable_build", "non_root", "no_baked_secrets", "resource_limits"],
        "topic": "containers_reproducibility",
        "root_uid_ok": False,
    }

c = section_contract()
print("case", c["case"])
print("topic", c["topic"])
print("root_uid_ok", c["root_uid_ok"])
`,
        output: `case CASO-TRU-043
topic containers_reproducibility
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
        "Ordena layers de **estable a cambiante**: base y dependencias primero, código de aplicación después. Así el cache de build acelera commits de app sin re-resolver pip en cada push. Un cache «mágico» que depende de estado oculto del host rompe la reproducibilidad entre máquinas. Lee el fragmento de abajo: `COPY requirements` + `RUN pip` van antes de `COPY src/`.",
        "Contrato de cache. Entrada: secuencia de layers `base→deps→app→cmd` y lock de dependencias. Salida: `cache_hint=deps_before_app` y digest lógico estable entre dos builds con el mismo lock. Error: copiar el source antes del lock (invalida cache en cada commit) o hornear secretos en una layer. Criterio: en el lab de Trujillo sintético, un cambio solo de app no re-resuelve pip si deps no cambió.",
        "Aplicación a `CASO-TRU-043-T1A`: modelas el Dockerfile de la API de la plataforma ficticia. Sin secretos en capas; el secret se inyecta en runtime (T2-A). Evidencia: dos builds con el mismo lock producen el mismo digest lógico de deps. Si el orden falla, `REORDER_DOCKERFILE`.",
      ],
      code: {
        language: 'python',
        title: "dockerfile_layers_cache.py",
        code: `MINI_DOCKERFILE = """
FROM python:3.12-slim@sha256:demo
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY src/ ./src/
USER 10001
CMD ["python", "-m", "app"]
"""

def layer_order(steps: list, lock_hash: str) -> dict:
    # deps before app maximizes cache hits when only source changes
    deps_before = steps.index("deps") < steps.index("app")
    digest_a = f"deps:{lock_hash}"
    digest_b = f"deps:{lock_hash}"  # same lock → same logical deps digest
    return {
        "steps": steps,
        "cache_hint": "deps_before_app" if deps_before else "reorder",
        "digest_stable": digest_a == digest_b and deps_before,
        "has_user": "USER 10001" in MINI_DOCKERFILE,
    }

r = layer_order(["base", "deps", "app", "cmd"], "sha256:lock1")
print("cache_hint", r["cache_hint"])
print("digest_stable", r["digest_stable"])
print("has_user", r["has_user"])`,
        output: `cache_hint deps_before_app
digest_stable True
has_user True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Evidencia mínima de S43-T1-A: dos builds con el mismo lock producen el mismo digest lógico de deps. Si el orden falla, `REORDER_DOCKERFILE`; si falta evidencia, `INSPECT_CACHE_INVALIDATION`.",
      },
    },
    {
      heading: "Bases, usuarios no root y tamaño",
      subtopicId: "S43-T1-B",
      paragraphs: [
        "Con el cache de layers en orden (T1-A), endureces la **imagen de runtime**. Una base mínima reduce superficie de ataque, pero debe seguir parchable: fija tag o digest (nunca `latest` suelto). Distroless/slim recortan shell y paquetes; el trade-off es depuración más difícil (lo resuelves en T4-B con shells efímeros, no root permanente). Ejecuta como UID de aplicación (≥1000), sin `CAP_SYS_ADMIN` ni capabilities extras, y acota el tamaño runtime (MB).",
        "Contrato de base y usuario. Entrada: tag o digest de base, UID planificado (≥1000), conjunto de capabilities y techo de tamaño runtime. Salida: imagen con base fijada, proceso non-root y runtime bajo presupuesto de MB. Error de promoción: UID 0, capabilities extras, base mutable o imagen inflada sin justificación. Criterio local: `USER`/`uid` y tamaño se auditan antes de publicar.",
        "En `CASO-TRU-043-T1B` (API de la plataforma ficticia en Trujillo) eliges `python:3.12-slim` (o distroless en runtime multi-stage) con digest, creas `appuser` 10001 y verificas non-root. El riesgo a documentar es superficie de ataque y privilegio, no identidad de personas. Sin evidencia de UID/base → `SELECT_PATCHABLE_BASE`; breach → `REBUILD_NONROOT`.",
      ],
      code: {
        language: 'python',
        title: "bases_nonroot_size.py",
        code: `def audit_runtime(base: str, uid: int, caps: set, runtime_mb: int, max_mb: int) -> dict:
    nonroot = uid >= 1000
    slim_ok = runtime_mb <= max_mb
    pinned = base != "latest" and not base.endswith(":latest")
    ok = pinned and nonroot and not caps and slim_ok
    return {"base": base, "uid": uid, "nonroot": nonroot, "ok": ok}

r = audit_runtime("python:3.12-slim@sha256:demo", 10001, set(), 118, 150)
print("nonroot", r["nonroot"])
print("uid", r["uid"])
print("ok", r["ok"])`,
        output: `nonroot True
uid 10001
ok True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Antes de promover S43-T1-B, audita proceso non-root (UID ≥1000) y base fijada. Un breach activa `REBUILD_NONROOT` y una ausencia activa `SELECT_PATCHABLE_BASE`.",
      },
    },
    {
      heading: "Config, secrets y volumes",
      subtopicId: "S43-T2-A",
      paragraphs: [
        "Partiendo de una imagen non-root (T1-B), la config **no secreta** (ENV de feature flags, puertos, log level) puede declararse en Compose o archivos montados. Los **secretos** (API keys, contraseñas DB) se inyectan en runtime vía secret store, env del orquestador o mounts de solo lectura; **nunca** van en `ENV KEY=valor` del Dockerfile ni en capas de build. Los volumes separan estado **durable** (DB) de **efímero** (cache, tmp): recrear el efímero no debe borrar el durable.",
        "Contrato de secretos y estado. Entrada: capas de imagen inspeccionables, referencias de secret (`secret_ref`), config declarada y clasificación de volumes. Salida: imagen e inspección sin valor secreto; DB en volume durable; cache/tmp efímeros. Error: secret horneado, `.env` con secretos en la imagen, o DB montada como efímera. Criterio: `docker history`/inspección no revela secretos; rotación no requiere rebuild de app.",
        "En `CASO-TRU-043-T2A` la API de Trujillo usa `runtime_secret=True` y `secret_baked=False`; `db` es durable y `cache` efímero. Breach → `REMOVE_BAKED_SECRET`; si falta clasificación de volumes → `CLASSIFY_VOLUME`.",
      ],
      code: {
        language: 'python',
        title: "config_secrets_volumes.py",
        code: `def inspect_image_layers(layers: list, durable: set, ephemeral: set) -> dict:
    baked = any("SECRET=" in layer or "PASSWORD=" in layer for layer in layers)
    return {
        "secret_baked": baked,
        "runtime_only": not baked,
        "db_durable": "db" in durable,
        "cache_ephemeral": "cache" in ephemeral,
    }

cfg = inspect_image_layers(
    ["ENV=prod", "CMD=api"], {"db"}, {"cache"}
)
print("secret_baked", cfg["secret_baked"])
print("runtime_only", cfg["runtime_only"])
print("db_durable", cfg["db_durable"])`,
        output: `secret_baked False
runtime_only True
db_durable True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "La revisión de S43-T2-A exige imagen e inspección sin secreto. No conviertas `REMOVE_BAKED_SECRET` ni `CLASSIFY_VOLUME` en éxito silencioso.",
      },
    },
    {
      heading: "Networking, health checks y signals",
      subtopicId: "S43-T2-B",
      paragraphs: [
        "Con secretos fuera de la imagen (T2-A), defines **quién habla con quién** y cuándo el proceso está listo. Red privada para DB/cache; API expone solo lo necesario. **Readiness** (`/readyz`) responde 200 solo si deps críticas (p. ej. DB) aceptan tráfico; si no, 503. **Liveness** (`/healthz`) detecta bloqueo del proceso (loop colgado), no «puedo servir». Ante **SIGTERM**, drena requests en curso y cierra conexiones dentro de un `grace_seconds` (p. ej. ≥20); un kill abrupto deja trabajo a medias.",
        "Contrato de health y shutdown. Entrada: red, probes readiness/liveness, handler de SIGTERM y grace period. Salida: health checks semánticos y shutdown limpio ensayados. Error: readiness que siempre devuelve 200, red pública a DB, o proceso que ignora SIGTERM. Criterio: simular DB caída → readiness 503; enviar SIGTERM → drain antes de exit.",
        "En `CASO-TRU-043-T2B` la API de Trujillo corre en red privada, valida DB en readiness y drena en 30s. Breach → `DRAIN_AND_ISOLATE`; falta de grace → `DIAGNOSE_HEALTH_SIGNAL`.",
      ],
      code: {
        language: 'python',
        title: "net_health_signals.py",
        code: `def health_status(ready: bool, live: bool) -> int:
    if not live:
        return 503
    return 200 if ready else 503

def on_sigterm(drains: bool, grace: int) -> dict:
    return {"graceful": drains and grace >= 20, "grace_seconds": grace}

print("ready_ok", health_status(True, True))
print("db_down", health_status(False, True))
print("sigterm", on_sigterm(True, 30))`,
        output: `ready_ok 200
db_down 503
sigterm {'graceful': True, 'grace_seconds': 30}`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Contrato S43-T2-B: demuestra health checks semánticos y shutdown ensayados. Falla cerrada con `DRAIN_AND_ISOLATE`; incertidumbre con `DIAGNOSE_HEALTH_SIGNAL`.",
      },
    },
    {
      heading: "API/worker/DB/cache",
      subtopicId: "S43-T3-A",
      paragraphs: [
        "Con probes y shutdown claros (T2-B), Compose declara el **stack local** de la plataforma: servicios `api`, `worker`, `db`, `cache`, redes (`front`/`back`) y healthchecks por servicio. El fragmento de abajo muestra la forma mínima: cuatro servicios y redes segmentadas. **`depends_on` no reemplaza retries de aplicación**: la API debe reintentar conexión a DB con backoff (`DB_MAX_ATTEMPTS` o equivalente); un simple «arranqué después» no basta si DB reinicia a mitad de tráfico.",
        "Contrato de stack. Entrada: texto Compose (servicios + redes) o modelo equivalente, conjunto healthy y flag de retries de app. Salida: stack sano desde entorno limpio (un comando). Error: servicios declarados pero no healthy, sin retries a DB, o red única sin segmentación. Criterio: healthy == services, redes front/back presentes y token de retries en la API.",
        "En `CASO-TRU-043-T3A` los cuatro servicios de Trujillo están healthy con retries y redes front/back. Breach → `STOP_UNHEALTHY_STACK`; falta de networks o de artefacto Compose → `WAIT_FOR_DEPENDENCY`.",
      ],
      code: {
        language: 'python',
        title: "api_worker_db_cache.py",
        code: `MINI_COMPOSE = """
services:
  api:
    networks: [front, back]
    depends_on: [db, cache]
    # retries de app (no solo depends_on):
    environment: { DB_MAX_ATTEMPTS: "5" }
  worker:
    networks: [back]
  db:
    networks: [back]
  cache:
    networks: [back]
networks:
  front: {}
  back: {}
"""
REQUIRED = {"api", "worker", "db", "cache"}
NETS = {"front", "back"}

def stack_ok(services: set, healthy: set, retries: bool, networks: set) -> dict:
    full = REQUIRED <= services and healthy == services
    ok = full and retries and NETS <= networks
    has_yaml = all(f"{n}:" in MINI_COMPOSE for n in REQUIRED) and "front:" in MINI_COMPOSE
    return {"services": sorted(services), "stack_healthy": ok, "retries": retries, "compose_shape": has_yaml}

s = stack_ok(
    {"api", "worker", "db", "cache"},
    {"api", "worker", "db", "cache"},
    True,
    {"front", "back"},
)
print("services", s["services"])
print("stack_healthy", s["stack_healthy"])
print("compose_shape", s["compose_shape"])`,
        output: `services ['api', 'cache', 'db', 'worker']
stack_healthy True
compose_shape True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Para S43-T3-A, el artefacto comprobable es stack sano desde entorno limpio. Sin él corresponde `STOP_UNHEALTHY_STACK` o, si faltan datos, `WAIT_FOR_DEPENDENCY`.",
      },
    },
    {
      heading: "Dependencias, migraciones y datos efímeros",
      subtopicId: "S43-T3-B",
      paragraphs: [
        "El stack de T3-A necesita **orden de arranque de datos**. Las migraciones de esquema son jobs controlados: patrón **expand/contract** (primero agregas columnas compatibles con código viejo; luego retiras lo obsoleto). Un `contract` incompatible con código aún en producción bloquea el release. Datos **efímeros** (tmp, cache) se recrean; datos **durables** (DB) exigen backup y drill de restore antes de confiar en el rollback.",
        "Contrato de migración. Entrada: tipo de migración (`expand`/`contract`), compatibilidad con código viejo, reset de efímeros y evidencia de restore. Salida: migración y rollback de prueba documentados. Error: contract sin compat, efímero tratado como durable, o backup nunca restaurado. Criterio: migrate antes de servir API; restore drill aprobado.",
        "En `CASO-TRU-043-T3B` la plataforma de Trujillo aplica `expand` compatible, recrea cache y tiene backup restaurado en lab. Breach → `ROLL_BACK_MIGRATION`; falta de restore → `RUN_RESTORE_DRILL`.",
      ],
      code: {
        language: 'python',
        title: "deps_migraciones_efimeros.py",
        code: `def migration_gate(migration: str, old_ok: bool, ephemeral_reset: bool, restored: bool) -> dict:
    ok = migration == "expand" and old_ok and ephemeral_reset and restored
    return {
        "migrate_before_api": True,
        "strategy": "expand_contract" if ok else "blocked",
        "ok": ok,
    }

g = migration_gate("expand", True, True, True)
print("strategy", g["strategy"])
print("ok", g["ok"])
print("ephemeral", ["tmp", "cache"])`,
        output: `strategy expand_contract
ok True
ephemeral ['tmp', 'cache']`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Promoción de S43-T3-B: prueba migración y rollback. Breach → `ROLL_BACK_MIGRATION`; ausencia de restore → `RUN_RESTORE_DRILL`.",
      },
    },
    {
      heading: "Locks y multi-stage builds",
      subtopicId: "S43-T4-A",
      paragraphs: [
        "Con migraciones seguras (T3-B), fijas **qué** se instala y **dónde** se compila. Un lock con hash (`sha256:…`) congela la resolución de deps; sin lock, el build de mañana no es el de hoy. **Multi-stage**: stage `builder` tiene compilers/SDK; stage `runtime` solo copia artefactos y deps de ejecución — sin toolchain. El `COPY --from=builder` es el puente; el runtime no debe incluir `gcc` ni wheels de build.",
        "Contrato de lock y stages. Entrada: `lock_hash`, stages presentes, flag `compiler_in_runtime`, deps de runtime locked. Salida: lock verificado e imagen runtime reducida. Error: lock `latest`/flotante, solo stage runtime sin builder, o compiler en la imagen final. Criterio: `lock_hash` con prefijo `sha256:` y runtime sin toolchain.",
        "En `CASO-TRU-043-T4A` el build de Trujillo usa builder+runtime, lock hasheado y runtime sin compiler. Breach → `BLOCK_UNPINNED_BUILD`; falta de lock de runtime → `REGENERATE_LOCK`.",
      ],
      code: {
        language: 'python',
        title: "locks_multistage.py",
        code: `def multistage_plan(lock_hash: str, stages: set, compiler_in_runtime: bool, runtime_locked: bool) -> dict:
    pinned = lock_hash.startswith("sha256:")
    ok = pinned and {"builder", "runtime"} <= stages and not compiler_in_runtime and runtime_locked
    return {
        "multistage": sorted(stages),
        "lock": "pinned" if pinned else "floating",
        "reproducible": ok,
    }

p = multistage_plan("sha256:abc", {"builder", "runtime"}, False, True)
print("multistage", p["multistage"])
print("lock", p["lock"])
print("reproducible", p["reproducible"])`,
        output: `multistage ['builder', 'runtime']
lock pinned
reproducible True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "El dueño de S43-T4-A acepta solo lock verificado e imagen runtime reducida. Violación → `BLOCK_UNPINNED_BUILD`; registro incompleto → `REGENERATE_LOCK`.",
      },
    },
    {
      heading: "Scanning, resource limits y debugging",
      subtopicId: "S43-T4-B",
      paragraphs: [
        "Cierra el camino a S44 (CI/CD): la imagen multi-stage (T4-A) entra a **política de scan**. Cero CVE críticos (o excepciones firmadas). **Límites** de memoria y CPU deben estar definidos y ser **> 0** (cero o ausente = unlimited disfrazado; no pasa el gate). Depuración con logs redactados y shells **efímeros**; un shell root permanente en la imagen de prod es breach. OOM simulado o CVE crítica bloquean el deploy.",
        "Contrato de scan y límites. Entrada: conteo de CVE críticos, `memory_limit_mb`, `cpu_limit`, flag de debug shell y logs redactados. Salida: deploy permitido solo si scan limpio, límites en rango (0 < mem ≤ 512, 0 < cpu ≤ 1.0), sin shell de debug y logs sin secretos/PII. Error: CVE > 0, límites 0/ausentes, shell root o logs crudos. Criterio: `QUARANTINE_IMAGE` ante breach.",
        "En `CASO-TRU-043-T4B` la imagen de Trujillo tiene 0 CVE críticos, 512Mi/1 CPU, sin debug shell y logs redactados. Breach → `QUARANTINE_IMAGE`; falta de evidencia de logs → `TRIAGE_SCAN_FINDING`.",
      ],
      code: {
        language: 'python',
        title: "scan_limits_debug.py",
        code: `def scan_gate(critical: int, mem_mb: int, cpu: float, debug_shell: bool, logs_redacted: bool) -> dict:
    limits_ok = 0 < mem_mb <= 512 and 0 < cpu <= 1.0
    ok = critical == 0 and limits_ok and not debug_shell and logs_redacted
    return {
        "scan_clean": critical == 0,
        "limits_ok": limits_ok,
        "allow_deploy": ok,
        "debug": "none" if not debug_shell else "root_shell",
    }

g = scan_gate(0, 512, 1.0, False, True)
print("scan_clean", g["scan_clean"])
print("limits_ok", g["limits_ok"])
print("allow_deploy", g["allow_deploy"])`,
        output: `scan_clean True
limits_ok True
allow_deploy True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Cierre de S43-T4-B: CVE críticos o límites inválidos (incl. 0) bloquean con `QUARANTINE_IMAGE`; incertidumbre de scan va a `TRIAGE_SCAN_FINDING`.",
      },
    },
  ],
  iDo: {
    intro: "Ocho demos de S43 calculan el contrato de contenedores (CP-N4-A): cada una deriva evidencia de entradas, no imprime un veredicto hardcodeado.",
    steps: [
      {
        demoId: "S43-T1-A-DEMO",
        subtopicId: "S43-T1-A",
        environment: "local-python",
        description: "Demo: Dockerfile, layers y cache",
        code: {
          language: 'python',
          title: "demo_dockerfile_layers_cache.py",
          code: `def dockerfile_steps(steps: list, lock_hash: str) -> dict:
    pip_before = steps.index("deps") < steps.index("app")
    digest = f"deps:{lock_hash}" if pip_before else "invalid"
    return {
        "pip_before_app": pip_before,
        "n_steps": len(steps),
        "cache": "stable_layers_first" if pip_before else "reorder",
        "digest_stable": pip_before and digest == f"deps:{lock_hash}",
    }

r = dockerfile_steps(["base", "deps", "app", "user", "cmd"], "sha256:lock1")
print("pip_before_app", r["pip_before_app"])
print("digest_stable", r["digest_stable"])
print("cache", r["cache"])`,
          output: `pip_before_app True
digest_stable True
cache stable_layers_first`,
        },
        why: "Deriva `deps_before_app` y digest lógico estable a partir del orden de layers y el lock; evidencia de T1-A sin daemon Docker.",
      },
      {
        demoId: "S43-T1-B-DEMO",
        subtopicId: "S43-T1-B",
        environment: "local-python",
        description: "Demo: bases, usuarios no root y tamaño",
        code: {
          language: 'python',
          title: "demo_bases_nonroot_size.py",
          code: `def audit_runtime(base: str, uid: int, caps: set, runtime_mb: int, max_mb: int) -> dict:
    nonroot = uid >= 1000
    slim_ok = runtime_mb <= max_mb
    pinned = base != "latest" and not base.endswith(":latest")
    ok = pinned and nonroot and not caps and slim_ok
    return {"base": base, "uid": uid, "nonroot": nonroot, "ok": ok}

r = audit_runtime("python:3.12-slim@sha256:demo", 10001, set(), 118, 150)
print("nonroot", r["nonroot"])
print("uid", r["uid"])
print("ok", r["ok"])`,
          output: `nonroot True
uid 10001
ok True`,
        },
        why: "Audita base fijada, UID ≥1000, capabilities vacías y techo de MB: evidencia real de proceso non-root, no solo elección de imagen por tamaño.",
      },
      {
        demoId: "S43-T2-A-DEMO",
        subtopicId: "S43-T2-A",
        environment: "local-python",
        description: "Demo: config, secrets y volumes",
        code: {
          language: 'python',
          title: "demo_config_secrets_volumes.py",
          code: `def audit_secrets(layers: list, durable: set, ephemeral: set) -> dict:
    baked = any("SECRET=" in layer or "PASSWORD=" in layer for layer in layers)
    return {
        "no_hardcoded": not baked,
        "db_durable": "db" in durable,
        "ok": not baked and "db" in durable and "cache" in ephemeral,
    }

r = audit_secrets(["ENV=prod", "CMD=api"], {"db"}, {"cache"})
print("no_hardcoded", r["no_hardcoded"])
print("db_durable", r["db_durable"])
print("ok", r["ok"])`,
          output: `no_hardcoded True
db_durable True
ok True`,
        },
        why: "Inspecciona capas en busca de secretos horneados y clasifica volumes durable/efímero; evidencia de imagen limpia.",
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

def on_sigterm(open_requests: int, grace_seconds: int) -> dict:
    drained = open_requests == 0 and grace_seconds >= 20
    return {"graceful": drained, "grace_seconds": grace_seconds}

print("ready", health_status(True, True))
print("not_ready", health_status(False, True))
print("sigterm", on_sigterm(0, 30))`,
          output: `ready 200
not_ready 503
sigterm {'graceful': True, 'grace_seconds': 30}`,
        },
        why: "Calcula códigos HTTP de readiness y el resultado de drain en SIGTERM a partir de grace y cola; no hardcodea graceful=True.",
      },
      {
        demoId: "S43-T3-A-DEMO",
        subtopicId: "S43-T3-A",
        environment: "local-python",
        description: "Demo: API/worker/DB/cache",
        code: {
          language: 'python',
          title: "demo_api_worker_db_cache.py",
          code: `REQUIRED = {"api", "worker", "db", "cache"}

def stack_health(services: set, healthy: set, retries: bool, networks: set) -> dict:
    ok = REQUIRED <= services and healthy == services and retries and {"front", "back"} <= networks
    return {
        "api_deps": ["db", "cache"] if "api" in services else [],
        "stack_healthy": ok,
        "retries": retries,
    }

r = stack_health(
    {"api", "worker", "db", "cache"},
    {"api", "worker", "db", "cache"},
    True,
    {"front", "back"},
)
print("api_deps", r["api_deps"])
print("stack_healthy", r["stack_healthy"])
print("retries", r["retries"])`,
          output: `api_deps ['db', 'cache']
stack_healthy True
retries True`,
        },
        why: "Valida el conjunto Compose (servicios, healthy, retries, redes front/back); misma forma que el mini-compose de la teoría T3-A.",
      },
      {
        demoId: "S43-T3-B-DEMO",
        subtopicId: "S43-T3-B",
        environment: "local-python",
        description: "Demo: dependencias, migraciones y datos efímeros",
        code: {
          language: 'python',
          title: "demo_deps_migraciones_efimeros.py",
          code: `def migrate_gate(migration: str, old_ok: bool, ephemeral_reset: bool, restored: bool) -> dict:
    ok = migration == "expand" and old_ok and ephemeral_reset and restored
    return {
        "strategy": "expand_contract" if ok else "blocked",
        "data": "ephemeral_ok" if ephemeral_reset else "review",
        "order": "migrate_first",
        "ok": ok,
    }

r = migrate_gate("expand", True, True, True)
print("strategy", r["strategy"])
print("data", r["data"])
print("ok", r["ok"])`,
          output: `strategy expand_contract
data ephemeral_ok
ok True`,
        },
        why: "Deriva estrategia expand/contract y OK de restore desde flags de migración; evidencia de rollback de prueba.",
      },
      {
        demoId: "S43-T4-A-DEMO",
        subtopicId: "S43-T4-A",
        environment: "local-python",
        description: "Demo: locks y multi-stage builds",
        code: {
          language: 'python',
          title: "demo_locks_multistage.py",
          code: `def stages(lock_hash: str, stage_set: set, compiler_in_runtime: bool) -> dict:
    pinned = lock_hash.startswith("sha256:")
    runtime_slim = "runtime" in stage_set and not compiler_in_runtime
    return {
        "builder_has_compilers": "builder" in stage_set,
        "runtime_slim": runtime_slim,
        "lock": "pinned" if pinned else "floating",
        "ok": pinned and runtime_slim and "builder" in stage_set,
    }

s = stages("sha256:abc", {"builder", "runtime"}, False)
print("builder_has_compilers", s["builder_has_compilers"])
print("runtime_slim", s["runtime_slim"])
print("lock", s["lock"])`,
          output: `builder_has_compilers True
runtime_slim True
lock pinned`,
        },
        why: "Comprueba lock hasheado, presencia de builder/runtime y ausencia de compiler en runtime; evidencia de imagen reducida reproducible.",
      },
      {
        demoId: "S43-T4-B-DEMO",
        subtopicId: "S43-T4-B",
        environment: "local-python",
        description: "Demo: scanning, resource limits y debugging",
        code: {
          language: 'python',
          title: "demo_scan_limits_debug.py",
          code: `def deploy_gate(critical: int, mem_mb: int, cpu: float, debug_shell: bool) -> dict:
    limits_ok = 0 < mem_mb <= 512 and 0 < cpu <= 1.0
    block = critical > 0 or not limits_ok or debug_shell
    return {
        "block_deploy": block,
        "mem_mb": mem_mb,
        "scan": "ci_gate" if critical == 0 else "quarantine",
    }

r = deploy_gate(0, 512, 1.0, False)
print("block_deploy", r["block_deploy"])
print("mem_mb", r["mem_mb"])
print("scan", r["scan"])`,
          output: `block_deploy False
mem_mb 512
scan ci_gate`,
        },
        why: "Bloquea deploy si hay CVE críticos, límites ≤0 o shell de debug; evidencia de scan + límites, no solo conteo de CVE.",
      },
    ],
  },
  weDo: {
    intro: "S43 · Laboratorio Governed Python Service Platform reproducible: 24 retos. E1 repara el predicado de dominio, E2 separa válido/adverso/missing y E3 audita un artefacto de texto (Dockerfile, Compose, log de probes, runbook, scan) con CONTINUE | breach | incertidumbre. Un defecto ops intencional por ejercicio; fixtures `CASO-TRU-043`.",
    steps: [
      {
        id: "S43-T1-A-E1",
        subtopicId: "S43-T1-A",
        kind: "guided",
        instruction: "S43-T1-A-E1 · Calcula el contrato de `Dockerfile, layers y cache` sobre `CASO-TRU-043-1A`. La entrada es el dict completo del starter; la operación debe demostrar layer de dependencias reutilizable y digest estable. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S43-T1-A PASS`; la misma operación sobre el fixture adverso debe activar `REORDER_DOCKERFILE` en E2.",
        hint: "Relaciona los campos `lock_copied_before_source`, `dependency_layer_reused`, `source_change_rebuilds`, `digest_stable` con la regla explicada en S43-T1-A.",
        hints: [
          "Relaciona los campos `lock_copied_before_source`, `dependency_layer_reused`, `source_change_rebuilds`, `digest_stable` con la regla explicada en S43-T1-A.",
          "El predicado correcto debe ser verdadero porque el fixture modela dos builds que producen el mismo digest lógico; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta digest_stable → INSPECT_CACHE_INVALIDATION", "adverso: source antes de lock / deps no reutilizadas / rebuilds altos → REORDER_DOCKERFILE", "CASO-TRU-043-1A es sintético"],
        tests: "El fixture `CASO-TRU-043-1A` satisface un predicado de dominio real; imprime `S43-T1-A PASS` y el assert booleano pasa.",
        feedback: "S43-T1-A-E1: explica qué campo cambió la decisión, por qué el adverso activa REORDER_DOCKERFILE y por qué faltar digest_stable exige INSPECT_CACHE_INVALIDATION.",
        starterCode: {
          language: 'python',
          title: "s43-t1-a-e1.py",
          code: `# CASO-TRU-043 · Dockerfile layer cache order
# DEFECT: PASS si no reusa capa deps y rebuilds>3 (invertido)
# TAREA: corrige la condición defectuosa; no cambies los datos del fixture
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
        edgeCases: ["falta digest_stable → INSPECT_CACHE_INVALIDATION", "adverso: source antes de lock / deps no reutilizadas / rebuilds altos → REORDER_DOCKERFILE", "CASO-TRU-043-1A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `digest_stable` ausente y produce exactamente `PASS REORDER_DOCKERFILE MISSING:digest_stable`.",
        feedback: "S43-T1-A-E2: explica qué campo cambió la decisión, por qué el adverso activa REORDER_DOCKERFILE y por qué faltar digest_stable exige INSPECT_CACHE_INVALIDATION.",
        starterCode: {
          language: 'python',
          title: "s43-t1-a-e2.py",
          code: `# CASO-TRU-043 · assess REORDER_DOCKERFILE
# DEFECT: PASS sin dependency_layer_reused
# TAREA: corrige la condición defectuosa; no cambies los datos del fixture
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
        instruction: "S43-T1-A-E3 · Transferencia de artefacto: audita el **texto** de un mini-Dockerfile (stdlib, sin daemon). Orden correcto: `COPY requirements` (lock/deps) **antes** de `COPY src`. Tres entradas: Dockerfile bueno → `CONTINUE`, Dockerfile con source antes de deps → `REORDER_DOCKERFILE`, `None` (sin artefacto) → `INSPECT_CACHE_INVALIDATION`. El starter trata ausencia como CONTINUE y aprueba el orden invertido: corrige ambas ramas. Salida: imprime el valor de meets_contract.",
        hint: "Si `dockerfile` es None o vacío, no inventes layers: devuelve `INSPECT_CACHE_INVALIDATION`.",
        hints: [
          "Si `dockerfile` es None o vacío, no inventes layers: devuelve `INSPECT_CACHE_INVALIDATION`.",
          "Busca las posiciones de `COPY requirements` y `COPY src` en el texto; solo si deps aparece y está antes de app devuelves `CONTINUE`.",
        ],
        edgeCases: ["dockerfile None/vacío → INSPECT_CACHE_INVALIDATION", "adverso: COPY src antes de COPY requirements → REORDER_DOCKERFILE", "CASO-TRU-043-1A es sintético"],
        tests: "Buen Dockerfile, Dockerfile reordenado y ausencia prueban CONTINUE / REORDER_DOCKERFILE / INSPECT_CACHE_INVALIDATION.",
        feedback: "S43-T1-A-E3: explica en qué líneas del texto falló el orden, por qué REORDER_DOCKERFILE y por qué la ausencia exige INSPECT_CACHE_INVALIDATION sin rellenar el Dockerfile.",
        starterCode: {
          language: 'python',
          title: "s43-t1-a-e3.py",
          code: `# CASO-TRU-043 · audit Dockerfile text (layer order)
# DEFECT: None→CONTINUE; orden invertido se aprueba
# TAREA: corrige la condición defectuosa; no cambies los datos del fixture
GOOD_DF = """FROM python:3.12-slim@sha256:demo
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY src/ ./src/
USER 10001
"""
BAD_DF = """FROM python:3.12-slim@sha256:demo
COPY src/ ./src/
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
USER 10001
"""

def decide(dockerfile: str | None) -> str:
    if dockerfile is None or not str(dockerfile).strip():
        return "CONTINUE"
    req = dockerfile.find("COPY requirements")
    src = dockerfile.find("COPY src")
    # DEFECT: aprueba cuando source va primero (orden invertido)
    ok = req != -1 and src != -1 and src < req
    return "CONTINUE" if ok else "REORDER_DOCKERFILE"

results = [decide(item) for item in (GOOD_DF, BAD_DF, None)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s43-t1-a-e3.py",
          code: `GOOD_DF = """FROM python:3.12-slim@sha256:demo
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY src/ ./src/
USER 10001
"""
BAD_DF = """FROM python:3.12-slim@sha256:demo
COPY src/ ./src/
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
USER 10001
"""

def decide(dockerfile: str | None) -> str:
    if dockerfile is None or not str(dockerfile).strip():
        return "INSPECT_CACHE_INVALIDATION"
    req = dockerfile.find("COPY requirements")
    src = dockerfile.find("COPY src")
    ok = req != -1 and src != -1 and req < src
    return "CONTINUE" if ok else "REORDER_DOCKERFILE"

results = [decide(item) for item in (GOOD_DF, BAD_DF, None)]
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
        edgeCases: ["falta max_mb → SELECT_PATCHABLE_BASE", "adverso: uid=0 / base no pinned / capabilities extras / runtime > max → REBUILD_NONROOT", "CASO-TRU-043-1B es sintético"],
        tests: "El fixture `CASO-TRU-043-1B` satisface un predicado de dominio real; imprime `S43-T1-B PASS` y el assert booleano pasa.",
        feedback: "S43-T1-B-E1: explica qué campo cambió la decisión, por qué el adverso activa REBUILD_NONROOT y por qué faltar max_mb exige SELECT_PATCHABLE_BASE.",
        starterCode: {
          language: 'python',
          title: "s43-t1-b-e1.py",
          code: `# CASO-TRU-043 · non-root base + size
# DEFECT: PASS si uid==0 o capabilities no vacías
# TAREA: corrige la condición defectuosa; no cambies los datos del fixture
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
meets_contract = record["base_pinned"] and record["uid"] >= 1000 and not record["capabilities"] and record["runtime_mb"] <= record["max_mb"]
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
        edgeCases: ["falta max_mb → SELECT_PATCHABLE_BASE", "adverso: uid=0 / base no pinned / capabilities extras / runtime > max → REBUILD_NONROOT", "CASO-TRU-043-1B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `max_mb` ausente y produce exactamente `PASS REBUILD_NONROOT MISSING:max_mb`.",
        feedback: "S43-T1-B-E2: explica qué campo cambió la decisión, por qué el adverso activa REBUILD_NONROOT y por qué faltar max_mb exige SELECT_PATCHABLE_BASE.",
        starterCode: {
          language: 'python',
          title: "s43-t1-b-e2.py",
          code: `# CASO-TRU-043 · assess REBUILD_NONROOT
# DEFECT: PASS con root o caps extra
# TAREA: corrige la condición defectuosa; no cambies los datos del fixture
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
    return "PASS" if record["base_pinned"] and record["uid"] >= 1000 and not record["capabilities"] and record["runtime_mb"] <= record["max_mb"] else "REBUILD_NONROOT"

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
        instruction: "S43-T1-B-E3 · Transferencia de artefacto: parsea un mini-Dockerfile y un presupuesto de runtime. Criterio non-root: base con digest (`@sha256:`), `USER` con UID ≥1000, sin `USER 0`/`root`. Tres entradas: fragmento bueno + max_mb → `CONTINUE`, root/`latest` → `REBUILD_NONROOT`, `max_mb is None` → `SELECT_PATCHABLE_BASE`. Corrige missing→CONTINUE y el predicado invertido. Salida: imprime el valor de meets_contract.",
        hint: "Si `max_mb` es None, no audites tamaño: devuelve `SELECT_PATCHABLE_BASE`.",
        hints: [
          "Si `max_mb` es None, no audites tamaño: devuelve `SELECT_PATCHABLE_BASE`.",
          "Extrae el número tras `USER `; exige ≥1000 y base con `@sha256:`. Runtime MB del registro de prueba debe ser ≤ max_mb.",
        ],
        edgeCases: ["max_mb None → SELECT_PATCHABLE_BASE", "adverso: USER 0 o FROM …:latest → REBUILD_NONROOT", "CASO-TRU-043-1B es sintético"],
        tests: "Dockerfile non-root, Dockerfile root/latest y max_mb ausente prueban CONTINUE / REBUILD_NONROOT / SELECT_PATCHABLE_BASE.",
        feedback: "S43-T1-B-E3: explica qué token del Dockerfile (USER/FROM) activó REBUILD_NONROOT y por qué la ausencia de max_mb exige SELECT_PATCHABLE_BASE.",
        starterCode: {
          language: 'python',
          title: "s43-t1-b-e3.py",
          code: `# CASO-TRU-043 · audit USER/base from Dockerfile text
# DEFECT: max_mb None→CONTINUE; root se aprueba
# TAREA: corrige la condición defectuosa; no cambies los datos del fixture
GOOD_DF = """FROM python:3.12-slim@sha256:demo
USER 10001
"""
BAD_DF = """FROM python:3.12-slim:latest
USER 0
"""

def decide(dockerfile: str, runtime_mb: int, max_mb: int | None) -> str:
    if max_mb is None:
        return "CONTINUE"
    # DEFECT: aprueba root / latest
    has_root = "USER 0" in dockerfile or "USER root" in dockerfile
    floating = ":latest" in dockerfile and "@sha256:" not in dockerfile
    return "CONTINUE" if has_root or floating else "REBUILD_NONROOT"

results = [
    decide(GOOD_DF, 118, 150),
    decide(BAD_DF, 490, 150),
    decide(GOOD_DF, 118, None),
]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s43-t1-b-e3.py",
          code: `GOOD_DF = """FROM python:3.12-slim@sha256:demo
USER 10001
"""
BAD_DF = """FROM python:3.12-slim:latest
USER 0
"""

def _user_uid(dockerfile: str) -> int | None:
    for line in dockerfile.splitlines():
        s = line.strip()
        if s.startswith("USER "):
            token = s.split(None, 1)[1].strip()
            if token.isdigit():
                return int(token)
            if token == "root":
                return 0
    return None

def decide(dockerfile: str, runtime_mb: int, max_mb: int | None) -> str:
    if max_mb is None:
        return "SELECT_PATCHABLE_BASE"
    uid = _user_uid(dockerfile)
    pinned = "@sha256:" in dockerfile and not dockerfile.rstrip().endswith(":latest")
    nonroot = uid is not None and uid >= 1000
    slim_ok = runtime_mb <= max_mb
    ok = pinned and nonroot and slim_ok
    return "CONTINUE" if ok else "REBUILD_NONROOT"

results = [
    decide(GOOD_DF, 118, 150),
    decide(BAD_DF, 490, 150),
    decide(GOOD_DF, 118, None),
]
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
        edgeCases: ["falta ephemeral_volumes → CLASSIFY_VOLUME", "adverso: secret_baked o db en ephemeral → REMOVE_BAKED_SECRET", "CASO-TRU-043-2A es sintético"],
        tests: "El fixture `CASO-TRU-043-2A` satisface un predicado de dominio real; imprime `S43-T2-A PASS` y el assert booleano pasa.",
        feedback: "S43-T2-A-E1: explica qué campo cambió la decisión, por qué el adverso activa REMOVE_BAKED_SECRET y por qué faltar ephemeral_volumes exige CLASSIFY_VOLUME.",
        starterCode: {
          language: 'python',
          title: "s43-t2-a-e1.py",
          code: `# CASO-TRU-043 · secrets not baked + durable volumes
# DEFECT: PASS si secret_baked o db en ephemeral
# TAREA: corrige la condición defectuosa; no cambies los datos del fixture
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
        edgeCases: ["falta ephemeral_volumes → CLASSIFY_VOLUME", "adverso: secret_baked o db en ephemeral → REMOVE_BAKED_SECRET", "CASO-TRU-043-2A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `ephemeral_volumes` ausente y produce exactamente `PASS REMOVE_BAKED_SECRET MISSING:ephemeral_volumes`.",
        feedback: "S43-T2-A-E2: explica qué campo cambió la decisión, por qué el adverso activa REMOVE_BAKED_SECRET y por qué faltar ephemeral_volumes exige CLASSIFY_VOLUME.",
        starterCode: {
          language: 'python',
          title: "s43-t2-a-e2.py",
          code: `# CASO-TRU-043 · assess REMOVE_BAKED_SECRET
# DEFECT: PASS con secret en imagen o DB efímera
# TAREA: corrige la condición defectuosa; no cambies los datos del fixture
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
        instruction: "S43-T2-A-E3 · Transferencia de artefacto: inspecciona **historial de capas** (strings de `docker history` sintético) y clasificación de volumes. Sin `SECRET=`/`PASSWORD=` en capas; `db` durable y `cache` efímero. Tres entradas: capas limpias + mounts correctos → `CONTINUE`, capa con secret o DB en efímero → `REMOVE_BAKED_SECRET`, `ephemeral is None` → `CLASSIFY_VOLUME`. El starter trata ausencia como CONTINUE y aprueba capas con secret: corrige ambas ramas. Salida: imprime el valor de meets_contract.",
        hint: "Si `ephemeral` es None, no inventes mounts: devuelve `CLASSIFY_VOLUME`.",
        hints: [
          "Si `ephemeral` es None, no inventes mounts: devuelve `CLASSIFY_VOLUME`.",
          "Busca `SECRET=` o `PASSWORD=` en cada capa; exige `db` en durable y `cache` en ephemeral.",
        ],
        edgeCases: ["ephemeral None → CLASSIFY_VOLUME", "adverso: SECRET= en capa o db en ephemeral → REMOVE_BAKED_SECRET", "CASO-TRU-043-2A es sintético"],
        tests: "Capas limpias, capas con secret y mounts ausentes prueban CONTINUE / REMOVE_BAKED_SECRET / CLASSIFY_VOLUME.",
        feedback: "S43-T2-A-E3: explica qué token de capa o mount activó REMOVE_BAKED_SECRET y por qué la ausencia de ephemeral exige CLASSIFY_VOLUME sin rellenar volúmenes.",
        starterCode: {
          language: 'python',
          title: "s43-t2-a-e3.py",
          code: `# CASO-TRU-043 · audit image layers + volume mounts
# DEFECT: ephemeral None→CONTINUE; capa SECRET= se aprueba
# TAREA: corrige la condición defectuosa; no cambies los datos del fixture
GOOD_LAYERS = ["ENV=prod", "CMD=api"]
BAD_LAYERS = ["ENV SECRET=sk-demo", "CMD=api"]
DURABLE = {"db"}
EPHEMERAL = {"cache"}

def decide(layers: list, durable: set, ephemeral: set | None) -> str:
    if ephemeral is None:
        return "CONTINUE"
    # DEFECT: aprueba aunque haya SECRET= o db en ephemeral
    baked = any("SECRET=" in layer or "PASSWORD=" in layer for layer in layers)
    return "CONTINUE" if baked or "db" in ephemeral else "REMOVE_BAKED_SECRET"

results = [
    decide(GOOD_LAYERS, DURABLE, EPHEMERAL),
    decide(BAD_LAYERS, set(), {"db"}),
    decide(GOOD_LAYERS, DURABLE, None),
]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s43-t2-a-e3.py",
          code: `GOOD_LAYERS = ["ENV=prod", "CMD=api"]
BAD_LAYERS = ["ENV SECRET=sk-demo", "CMD=api"]
DURABLE = {"db"}
EPHEMERAL = {"cache"}

def decide(layers: list, durable: set, ephemeral: set | None) -> str:
    if ephemeral is None:
        return "CLASSIFY_VOLUME"
    baked = any("SECRET=" in layer or "PASSWORD=" in layer for layer in layers)
    ok = (
        not baked
        and "db" in durable
        and "cache" in ephemeral
        and "db" not in ephemeral
    )
    return "CONTINUE" if ok else "REMOVE_BAKED_SECRET"

results = [
    decide(GOOD_LAYERS, DURABLE, EPHEMERAL),
    decide(BAD_LAYERS, set(), {"db"}),
    decide(GOOD_LAYERS, DURABLE, None),
]
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
        edgeCases: ["falta grace_seconds → DIAGNOSE_HEALTH_SIGNAL", "adverso: readiness falsa / sin drain SIGTERM / red pública → DRAIN_AND_ISOLATE", "CASO-TRU-043-2B es sintético"],
        tests: "El fixture `CASO-TRU-043-2B` satisface un predicado de dominio real; imprime `S43-T2-B PASS` y el assert booleano pasa.",
        feedback: "S43-T2-B-E1: explica qué campo cambió la decisión, por qué el adverso activa DRAIN_AND_ISOLATE y por qué faltar grace_seconds exige DIAGNOSE_HEALTH_SIGNAL.",
        starterCode: {
          language: 'python',
          title: "s43-t2-b-e1.py",
          code: `# CASO-TRU-043 · readiness + SIGTERM drain
# DEFECT: PASS si falta readiness_db o no drena
# TAREA: corrige la condición defectuosa; no cambies los datos del fixture
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
        edgeCases: ["falta grace_seconds → DIAGNOSE_HEALTH_SIGNAL", "adverso: readiness falsa / sin drain SIGTERM / red pública → DRAIN_AND_ISOLATE", "CASO-TRU-043-2B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `grace_seconds` ausente y produce exactamente `PASS DRAIN_AND_ISOLATE MISSING:grace_seconds`.",
        feedback: "S43-T2-B-E2: explica qué campo cambió la decisión, por qué el adverso activa DRAIN_AND_ISOLATE y por qué faltar grace_seconds exige DIAGNOSE_HEALTH_SIGNAL.",
        starterCode: {
          language: 'python',
          title: "s43-t2-b-e2.py",
          code: `# CASO-TRU-043 · assess DRAIN_AND_ISOLATE
# DEFECT: PASS sin readiness o sin sigterm_drains
# TAREA: corrige la condición defectuosa; no cambies los datos del fixture
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
        instruction: "S43-T2-B-E3 · Transferencia de artefacto: audita un **log de probes/señales** (texto sintético, stdlib). Criterio: `network=private`, readiness con `db_ok=true` y 200 (nunca 200 si `db_ok=false`), `/healthz` presente, y SIGTERM con `drained=true` y `grace_seconds` ≥ 20. Tres entradas: log bueno → `CONTINUE`, log con readiness falsa / red pública / sin drain → `DRAIN_AND_ISOLATE`, `None` → `DIAGNOSE_HEALTH_SIGNAL`. El starter trata ausencia como CONTINUE y aprueba el log adverso: corrige ambas ramas. Salida: imprime el valor de meets_contract.",
        hint: "Si el log es None o vacío, no inventes probes: devuelve `DIAGNOSE_HEALTH_SIGNAL`.",
        hints: [
          "Si el log es None o vacío, no inventes probes: devuelve `DIAGNOSE_HEALTH_SIGNAL`.",
          "Busca `db_ok=false` junto a status 200 en /readyz (falso positivo de readiness); exige network=private, drained=true y grace_seconds numérico ≥ 20.",
        ],
        edgeCases: ["log None/vacío → DIAGNOSE_HEALTH_SIGNAL", "adverso: readiness 200 con db caída / sin drain / red pública → DRAIN_AND_ISOLATE", "CASO-TRU-043-2B es sintético"],
        tests: "Log bueno, log adverso y ausencia prueban CONTINUE / DRAIN_AND_ISOLATE / DIAGNOSE_HEALTH_SIGNAL.",
        feedback: "S43-T2-B-E3: explica qué línea del log (network, /readyz o SIGTERM) activó DRAIN_AND_ISOLATE y por qué la ausencia exige DIAGNOSE_HEALTH_SIGNAL sin rellenar el log.",
        starterCode: {
          language: 'python',
          title: "s43-t2-b-e3.py",
          code: `# CASO-TRU-043 · audit probe/SIGTERM log text
# DEFECT: None→CONTINUE; log adverso se aprueba
# TAREA: corrige la condición defectuosa; no cambies los datos del fixture
GOOD_LOG = """
network=private
GET /readyz db_ok=true status=200
GET /healthz live=true status=200
signal=SIGTERM open_requests=0 grace_seconds=30 drained=true
"""
BAD_LOG = """
network=public
GET /readyz db_ok=false status=200
GET /healthz live=true status=200
signal=SIGTERM open_requests=12 grace_seconds=0 drained=false
"""

def decide(probe_log: str | None) -> str:
    if probe_log is None or not str(probe_log).strip():
        return "CONTINUE"
    # DEFECT: aprueba readiness falsa o red pública
    false_ready = "db_ok=false" in probe_log and "status=200" in probe_log
    return "CONTINUE" if false_ready or "network=public" in probe_log else "DRAIN_AND_ISOLATE"

results = [decide(item) for item in (GOOD_LOG, BAD_LOG, None)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s43-t2-b-e3.py",
          code: `GOOD_LOG = """
network=private
GET /readyz db_ok=true status=200
GET /healthz live=true status=200
signal=SIGTERM open_requests=0 grace_seconds=30 drained=true
"""
BAD_LOG = """
network=public
GET /readyz db_ok=false status=200
GET /healthz live=true status=200
signal=SIGTERM open_requests=12 grace_seconds=0 drained=false
"""

def _grace_seconds(log: str) -> int:
    for part in log.split():
        if part.startswith("grace_seconds="):
            try:
                return int(part.split("=", 1)[1])
            except ValueError:
                return 0
    return 0

def decide(probe_log: str | None) -> str:
    if probe_log is None or not str(probe_log).strip():
        return "DIAGNOSE_HEALTH_SIGNAL"
    private = "network=private" in probe_log
    false_ready = "db_ok=false" in probe_log and "/readyz" in probe_log and "status=200" in probe_log
    ready_ok = "db_ok=true" in probe_log and "/readyz" in probe_log and not false_ready
    live_ok = "/healthz" in probe_log
    drained = "drained=true" in probe_log and _grace_seconds(probe_log) >= 20
    ok = private and ready_ok and live_ok and drained
    return "CONTINUE" if ok else "DRAIN_AND_ISOLATE"

results = [decide(item) for item in (GOOD_LOG, BAD_LOG, None)]
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
        edgeCases: ["falta networks → WAIT_FOR_DEPENDENCY", "adverso: healthy≠services / sin retries / red única → STOP_UNHEALTHY_STACK", "CASO-TRU-043-3A es sintético"],
        tests: "El fixture `CASO-TRU-043-3A` satisface un predicado de dominio real; imprime `S43-T3-A PASS` y el assert booleano pasa.",
        feedback: "S43-T3-A-E1: explica qué campo cambió la decisión, por qué el adverso activa STOP_UNHEALTHY_STACK y por qué faltar networks exige WAIT_FOR_DEPENDENCY.",
        starterCode: {
          language: 'python',
          title: "s43-t3-a-e1.py",
          code: `# CASO-TRU-043 · compose stack health
# DEFECT: PASS si healthy≠services y sin retries a DB
# TAREA: corrige la condición defectuosa; no cambies los datos del fixture
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
        edgeCases: ["falta networks → WAIT_FOR_DEPENDENCY", "adverso: healthy≠services / sin retries / red única → STOP_UNHEALTHY_STACK", "CASO-TRU-043-3A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `networks` ausente y produce exactamente `PASS STOP_UNHEALTHY_STACK MISSING:networks`.",
        feedback: "S43-T3-A-E2: explica qué campo cambió la decisión, por qué el adverso activa STOP_UNHEALTHY_STACK y por qué faltar networks exige WAIT_FOR_DEPENDENCY.",
        starterCode: {
          language: 'python',
          title: "s43-t3-a-e2.py",
          code: `# CASO-TRU-043 · assess STOP_UNHEALTHY_STACK
# DEFECT: PASS con servicios no healthy
# TAREA: corrige la condición defectuosa; no cambies los datos del fixture
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
        instruction: "S43-T3-A-E3 · Transferencia de artefacto: audita el **texto** de un mini-`compose.yaml` (stdlib). Debe declarar `api`, `worker`, `db`, `cache`, redes `front` y `back`, y la API con retries a DB. Tres entradas: YAML bueno → `CONTINUE`, YAML sin redes/sin worker → `STOP_UNHEALTHY_STACK`, `None` → `WAIT_FOR_DEPENDENCY`. El starter trata ausencia como CONTINUE y aprueba el YAML incompleto: corrige ambas ramas. Salida: imprime el valor de meets_contract.",
        hint: "Si `compose` es None o vacío, no inventes servicios: devuelve `WAIT_FOR_DEPENDENCY`.",
        hints: [
          "Si `compose` es None o vacío, no inventes servicios: devuelve `WAIT_FOR_DEPENDENCY`.",
          "Busca en el texto las claves de servicio y las redes `front`/`back`; exige también un token de retries (p. ej. `max_attempts` o `retries`).",
        ],
        edgeCases: ["compose None/vacío → WAIT_FOR_DEPENDENCY", "adverso: falta worker o redes front/back o retries → STOP_UNHEALTHY_STACK", "CASO-TRU-043-3A es sintético"],
        tests: "Buen compose, compose incompleto y ausencia prueban CONTINUE / STOP_UNHEALTHY_STACK / WAIT_FOR_DEPENDENCY.",
        feedback: "S43-T3-A-E3: explica qué token del YAML falló (servicio, red o retries), por qué STOP_UNHEALTHY_STACK y por qué la ausencia exige WAIT_FOR_DEPENDENCY sin rellenar el archivo.",
        starterCode: {
          language: 'python',
          title: "s43-t3-a-e3.py",
          code: `# CASO-TRU-043 · audit compose.yaml text (stack)
# DEFECT: None→CONTINUE; YAML incompleto se aprueba
# TAREA: corrige la condición defectuosa; no cambies los datos del fixture
GOOD_COMPOSE = """
services:
  api:
    restart: on-failure
    deploy:
      restart_policy:
        max_attempts: 5
  worker: {}
  db: {}
  cache: {}
networks:
  front: {}
  back: {}
"""
BAD_COMPOSE = """
services:
  api: {}
  db: {}
networks:
  default: {}
"""

def decide(compose: str | None) -> str:
    if compose is None or not str(compose).strip():
        return "CONTINUE"
    # DEFECT: aprueba aunque falten worker, redes o retries
    has_api = "api:" in compose
    return "CONTINUE" if has_api else "STOP_UNHEALTHY_STACK"

results = [decide(item) for item in (GOOD_COMPOSE, BAD_COMPOSE, None)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s43-t3-a-e3.py",
          code: `GOOD_COMPOSE = """
services:
  api:
    restart: on-failure
    deploy:
      restart_policy:
        max_attempts: 5
  worker: {}
  db: {}
  cache: {}
networks:
  front: {}
  back: {}
"""
BAD_COMPOSE = """
services:
  api: {}
  db: {}
networks:
  default: {}
"""

def decide(compose: str | None) -> str:
    if compose is None or not str(compose).strip():
        return "WAIT_FOR_DEPENDENCY"
    text = compose
    required_svcs = all(f"{name}:" in text for name in ("api", "worker", "db", "cache"))
    nets = "front:" in text and "back:" in text
    retries = "max_attempts" in text or "retries" in text
    ok = required_svcs and nets and retries
    return "CONTINUE" if ok else "STOP_UNHEALTHY_STACK"

results = [decide(item) for item in (GOOD_COMPOSE, BAD_COMPOSE, None)]
print(*results)
assert results == ["CONTINUE", "STOP_UNHEALTHY_STACK", "WAIT_FOR_DEPENDENCY"]` ,
          output: `CONTINUE STOP_UNHEALTHY_STACK WAIT_FOR_DEPENDENCY` ,
        },
      },
      {
        id: "S43-T3-B-E1",
        subtopicId: "S43-T3-B",
        kind: "guided",
        instruction: "S43-T3-B-E1 · Clasifica el contrato de `dependencias, migraciones y datos efímeros` sobre `CASO-TRU-043-3B`. La entrada es el dict completo del starter; la operación debe demostrar expand compatible, efímero recreable y restore aprobado. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S43-T3-B PASS`; la misma operación sobre el fixture adverso debe activar `ROLL_BACK_MIGRATION` en E2.",
        hint: "Relaciona los campos `migration`, `old_code_compatible`, `ephemeral_reset`, `backup_restored` con la regla explicada en S43-T3-B.",
        hints: [
          "Relaciona los campos `migration`, `old_code_compatible`, `ephemeral_reset`, `backup_restored` con la regla explicada en S43-T3-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva migración y rollback de prueba; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta backup_restored → RUN_RESTORE_DRILL", "adverso: contract sin compat / sin restore / efímero mal clasificado → ROLL_BACK_MIGRATION", "CASO-TRU-043-3B es sintético"],
        tests: "El fixture `CASO-TRU-043-3B` satisface un predicado de dominio real; imprime `S43-T3-B PASS` y el assert booleano pasa.",
        feedback: "S43-T3-B-E1: explica qué campo cambió la decisión, por qué el adverso activa ROLL_BACK_MIGRATION y por qué faltar backup_restored exige RUN_RESTORE_DRILL.",
        starterCode: {
          language: 'python',
          title: "s43-t3-b-e1.py",
          code: `# CASO-TRU-043 · expand/contract migraciones
# DEFECT: PASS si migration contract sin compat
# TAREA: corrige la condición defectuosa; no cambies los datos del fixture
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
        instruction: "S43-T3-B-E2 · Calcula tres rutas de `dependencias, migraciones y datos efímeros`: fixture válido, fixture adverso y registro sin `backup_restored`. Entrada: dict con case_id, migration, old_code_compatible, ephemeral_reset, backup_restored. Salidas exactas: `PASS`, `ROLL_BACK_MIGRATION`, `MISSING:backup_restored`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a backup_restored debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a backup_restored debe ocurrir antes de esa rama.",
          "Después aplica la regla de S43-T3-B: expand compatible, efímero recreable y restore aprobado. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta backup_restored → RUN_RESTORE_DRILL", "adverso: contract sin compat / sin restore / efímero mal clasificado → ROLL_BACK_MIGRATION", "CASO-TRU-043-3B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `backup_restored` ausente y produce exactamente `PASS ROLL_BACK_MIGRATION MISSING:backup_restored`.",
        feedback: "S43-T3-B-E2: explica qué campo cambió la decisión, por qué el adverso activa ROLL_BACK_MIGRATION y por qué faltar backup_restored exige RUN_RESTORE_DRILL.",
        starterCode: {
          language: 'python',
          title: "s43-t3-b-e2.py",
          code: `# CASO-TRU-043 · assess ROLL_BACK_MIGRATION
# DEFECT: PASS con migrate contract y old_code incompatible
# TAREA: corrige la condición defectuosa; no cambies los datos del fixture
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
        instruction: "S43-T3-B-E3 · Transferencia de artefacto: audita un **runbook de migración** (texto sintético). Criterio: `strategy: expand`, `old_code_compatible: yes`, `backup_restore_drill: PASS`, y efímeros sin montar `db` como efímero. Tres entradas: runbook bueno → `CONTINUE`, contract sin compat / restore SKIPPED / db efímero → `ROLL_BACK_MIGRATION`, `None` → `RUN_RESTORE_DRILL`. El starter trata ausencia como CONTINUE y aprueba el runbook adverso: corrige ambas ramas. Salida: imprime el valor de meets_contract.",
        hint: "Si el runbook es None o vacío, no inventes restore: devuelve `RUN_RESTORE_DRILL`.",
        hints: [
          "Si el runbook es None o vacío, no inventes restore: devuelve `RUN_RESTORE_DRILL`.",
          "Exige strategy expand, old_code_compatible yes, backup_restore_drill PASS; rechaza ephemeral: db o contract sin compat.",
        ],
        edgeCases: ["runbook None/vacío → RUN_RESTORE_DRILL", "adverso: contract sin compat / restore SKIPPED / db efímero → ROLL_BACK_MIGRATION", "CASO-TRU-043-3B es sintético"],
        tests: "Runbook bueno, runbook adverso y ausencia prueban CONTINUE / ROLL_BACK_MIGRATION / RUN_RESTORE_DRILL.",
        feedback: "S43-T3-B-E3: explica qué línea del runbook (strategy, compat o restore) activó ROLL_BACK_MIGRATION y por qué la ausencia exige RUN_RESTORE_DRILL sin rellenar el archivo.",
        starterCode: {
          language: 'python',
          title: "s43-t3-b-e3.py",
          code: `# CASO-TRU-043 · audit migration runbook text
# DEFECT: None→CONTINUE; runbook adverso se aprueba
# TAREA: corrige la condición defectuosa; no cambies los datos del fixture
GOOD_RB = """
strategy: expand
old_code_compatible: yes
ephemeral: tmp,cache
backup_restore_drill: PASS
migrate_before_api: true
"""
BAD_RB = """
strategy: contract
old_code_compatible: no
ephemeral: db
backup_restore_drill: SKIPPED
"""

def decide(runbook: str | None) -> str:
    if runbook is None or not str(runbook).strip():
        return "CONTINUE"
    # DEFECT: aprueba contract sin compat o restore SKIPPED
    bad = "strategy: contract" in runbook or "backup_restore_drill: SKIPPED" in runbook
    return "CONTINUE" if bad else "ROLL_BACK_MIGRATION"

results = [decide(item) for item in (GOOD_RB, BAD_RB, None)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s43-t3-b-e3.py",
          code: `GOOD_RB = """
strategy: expand
old_code_compatible: yes
ephemeral: tmp,cache
backup_restore_drill: PASS
migrate_before_api: true
"""
BAD_RB = """
strategy: contract
old_code_compatible: no
ephemeral: db
backup_restore_drill: SKIPPED
"""

def decide(runbook: str | None) -> str:
    if runbook is None or not str(runbook).strip():
        return "RUN_RESTORE_DRILL"
    expand = "strategy: expand" in runbook
    compat = "old_code_compatible: yes" in runbook
    restore = "backup_restore_drill: PASS" in runbook
    db_not_ephemeral = "ephemeral: db" not in runbook
    ok = expand and compat and restore and db_not_ephemeral
    return "CONTINUE" if ok else "ROLL_BACK_MIGRATION"

results = [decide(item) for item in (GOOD_RB, BAD_RB, None)]
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
        edgeCases: ["falta runtime_deps_locked → REGENERATE_LOCK", "adverso: lock flotante / compiler en runtime / sin builder → BLOCK_UNPINNED_BUILD", "CASO-TRU-043-4A es sintético"],
        tests: "El fixture `CASO-TRU-043-4A` satisface un predicado de dominio real; imprime `S43-T4-A PASS` y el assert booleano pasa.",
        feedback: "S43-T4-A-E1: explica qué campo cambió la decisión, por qué el adverso activa BLOCK_UNPINNED_BUILD y por qué faltar runtime_deps_locked exige REGENERATE_LOCK.",
        starterCode: {
          language: 'python',
          title: "s43-t4-a-e1.py",
          code: `# CASO-TRU-043 · locks + multi-stage
# DEFECT: PASS si runtime_deps no locked o compiler en runtime
# TAREA: corrige la condición defectuosa; no cambies los datos del fixture
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
        edgeCases: ["falta runtime_deps_locked → REGENERATE_LOCK", "adverso: lock flotante / compiler en runtime / sin builder → BLOCK_UNPINNED_BUILD", "CASO-TRU-043-4A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `runtime_deps_locked` ausente y produce exactamente `PASS BLOCK_UNPINNED_BUILD MISSING:runtime_deps_locked`.",
        feedback: "S43-T4-A-E2: explica qué campo cambió la decisión, por qué el adverso activa BLOCK_UNPINNED_BUILD y por qué faltar runtime_deps_locked exige REGENERATE_LOCK.",
        starterCode: {
          language: 'python',
          title: "s43-t4-a-e2.py",
          code: `# CASO-TRU-043 · assess BLOCK_UNPINNED_BUILD
# DEFECT: PASS sin lock o con compiler en runtime
# TAREA: corrige la condición defectuosa; no cambies los datos del fixture
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
        instruction: "S43-T4-A-E3 · Transferencia de artefacto: audita un **Dockerfile multi-stage** (texto) y un `lock_hash`. Criterio: stages `AS builder` y `AS runtime`, `COPY --from=builder`, lock con prefijo `sha256:`, y **sin** `gcc`/`g++` en el stage runtime. Tres entradas: bueno + lock pinned → `CONTINUE`, runtime con compiler o lock `latest` → `BLOCK_UNPINNED_BUILD`, `lock_hash is None` → `REGENERATE_LOCK`. El starter trata lock ausente como CONTINUE y aprueba el Dockerfile malo: corrige ambas ramas. Salida: imprime el valor de meets_contract.",
        hint: "Si `lock_hash` es None, no inventes pin: devuelve `REGENERATE_LOCK`.",
        hints: [
          "Si `lock_hash` es None, no inventes pin: devuelve `REGENERATE_LOCK`.",
          "Localiza el tramo tras `AS runtime` y verifica que no contenga gcc/g++; exige AS builder, AS runtime y COPY --from=builder.",
        ],
        edgeCases: ["lock_hash None → REGENERATE_LOCK", "adverso: lock latest / gcc en runtime / sin builder → BLOCK_UNPINNED_BUILD", "CASO-TRU-043-4A es sintético"],
        tests: "Dockerfile multi-stage limpio, Dockerfile con compiler en runtime y lock ausente prueban CONTINUE / BLOCK_UNPINNED_BUILD / REGENERATE_LOCK.",
        feedback: "S43-T4-A-E3: explica qué token del Dockerfile o del lock activó BLOCK_UNPINNED_BUILD y por qué la ausencia de lock exige REGENERATE_LOCK.",
        starterCode: {
          language: 'python',
          title: "s43-t4-a-e3.py",
          code: `# CASO-TRU-043 · audit multi-stage Dockerfile + lock
# DEFECT: lock None→CONTINUE; gcc en runtime se aprueba
# TAREA: corrige la condición defectuosa; no cambies los datos del fixture
GOOD_DF = """
FROM python:3.12-slim@sha256:demo AS builder
RUN pip wheel -r requirements.txt
FROM python:3.12-slim@sha256:demo AS runtime
COPY --from=builder /wheels /wheels
USER 10001
"""
BAD_DF = """
FROM python:3.12-slim:latest AS runtime
RUN apt-get install -y gcc g++
CMD ["python", "-m", "app"]
"""

def decide(dockerfile: str, lock_hash: str | None) -> str:
    if lock_hash is None:
        return "CONTINUE"
    # DEFECT: aprueba runtime con toolchain o sin builder
    has_builder = "AS builder" in dockerfile
    return "CONTINUE" if not has_builder else "BLOCK_UNPINNED_BUILD"

results = [
    decide(GOOD_DF, "sha256:abc"),
    decide(BAD_DF, "latest"),
    decide(GOOD_DF, None),
]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s43-t4-a-e3.py",
          code: `GOOD_DF = """
FROM python:3.12-slim@sha256:demo AS builder
RUN pip wheel -r requirements.txt
FROM python:3.12-slim@sha256:demo AS runtime
COPY --from=builder /wheels /wheels
USER 10001
"""
BAD_DF = """
FROM python:3.12-slim:latest AS runtime
RUN apt-get install -y gcc g++
CMD ["python", "-m", "app"]
"""

def decide(dockerfile: str, lock_hash: str | None) -> str:
    if lock_hash is None:
        return "REGENERATE_LOCK"
    pinned = lock_hash.startswith("sha256:")
    has_builder = "AS builder" in dockerfile
    has_runtime = "AS runtime" in dockerfile
    has_copy_from = "COPY --from=builder" in dockerfile
    runtime_part = dockerfile.split("AS runtime", 1)[-1] if has_runtime else dockerfile
    compiler_in_runtime = "gcc" in runtime_part or "g++" in runtime_part
    ok = pinned and has_builder and has_runtime and has_copy_from and not compiler_in_runtime
    return "CONTINUE" if ok else "BLOCK_UNPINNED_BUILD"

results = [
    decide(GOOD_DF, "sha256:abc"),
    decide(BAD_DF, "latest"),
    decide(GOOD_DF, None),
]
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
          "El predicado correcto debe ser verdadero porque el fixture no tiene CVE críticos, límites > 0 y sin shell de debug; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta logs_redacted → TRIAGE_SCAN_FINDING", "adverso: CVE críticos / límites 0 / debug shell / logs crudos → QUARANTINE_IMAGE", "CASO-TRU-043-4B es sintético"],
        tests: "El fixture `CASO-TRU-043-4B` satisface un predicado de dominio real; imprime `S43-T4-B PASS` y el assert booleano pasa.",
        feedback: "S43-T4-B-E1: explica qué campo cambió la decisión, por qué el adverso activa QUARANTINE_IMAGE y por qué faltar logs_redacted exige TRIAGE_SCAN_FINDING.",
        starterCode: {
          language: 'python',
          title: "s43-t4-b-e1.py",
          code: `# CASO-TRU-043 · CVE scan + debug shell + logs
# DEFECT: PASS si critical_cves>0 o debug_shell o logs sin redact
# TAREA: corrige la condición defectuosa; no cambies los datos del fixture
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
meets_contract = record["critical_cves"] == 0 and 0 < record["memory_limit_mb"] <= 512 and 0 < record["cpu_limit"] <= 1.0 and not record["debug_shell"] and record["logs_redacted"]
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
        edgeCases: ["falta logs_redacted → TRIAGE_SCAN_FINDING", "adverso: CVE críticos / límites 0 / debug shell / logs crudos → QUARANTINE_IMAGE", "CASO-TRU-043-4B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `logs_redacted` ausente y produce exactamente `PASS QUARANTINE_IMAGE MISSING:logs_redacted`.",
        feedback: "S43-T4-B-E2: explica qué campo cambió la decisión, por qué el adverso activa QUARANTINE_IMAGE y por qué faltar logs_redacted exige TRIAGE_SCAN_FINDING.",
        starterCode: {
          language: 'python',
          title: "s43-t4-b-e2.py",
          code: `# CASO-TRU-043 · assess QUARANTINE_IMAGE
# DEFECT: PASS con CVEs/debug shell/logs crudos
# TAREA: corrige la condición defectuosa; no cambies los datos del fixture
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
    return "PASS" if record["critical_cves"] == 0 and 0 < record["memory_limit_mb"] <= 512 and 0 < record["cpu_limit"] <= 1.0 and not record["debug_shell"] and record["logs_redacted"] else "QUARANTINE_IMAGE"

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
        instruction: "S43-T4-B-E3 · Transferencia de artefacto: audita un **reporte de scan + límites** (texto sintético tipo CI). Criterio: `CRITICAL: 0`, `0 < memory_limit_mb ≤ 512`, `0 < cpu_limit ≤ 1.0`, `debug_shell: false`, `logs_redacted: true`. Tres entradas: reporte bueno → `CONTINUE`, CVE>0 / límites 0 / shell root / logs crudos → `QUARANTINE_IMAGE`, `None` → `TRIAGE_SCAN_FINDING`. El starter trata ausencia como CONTINUE y aprueba el reporte adverso: corrige ambas ramas. Límites en 0 no son «sin tope válido». Salida: imprime el valor de meets_contract.",
        hint: "Si el reporte es None o vacío, no inventes hallazgos: devuelve `TRIAGE_SCAN_FINDING`.",
        hints: [
          "Si el reporte es None o vacío, no inventes hallazgos: devuelve `TRIAGE_SCAN_FINDING`.",
          "Parsea CRITICAL, memory_limit_mb y cpu_limit como números; exige CRITICAL==0, límites estrictamente positivos en rango, debug_shell false y logs_redacted true.",
        ],
        edgeCases: ["reporte None/vacío → TRIAGE_SCAN_FINDING", "adverso: CVE críticos / límites 0 / debug shell / logs crudos → QUARANTINE_IMAGE", "CASO-TRU-043-4B es sintético"],
        tests: "Reporte bueno, reporte adverso y ausencia prueban CONTINUE / QUARANTINE_IMAGE / TRIAGE_SCAN_FINDING.",
        feedback: "S43-T4-B-E3: explica qué línea del reporte (CRITICAL, límites o debug_shell) activó QUARANTINE_IMAGE y por qué la ausencia exige TRIAGE_SCAN_FINDING sin rellenar el scan.",
        starterCode: {
          language: 'python',
          title: "s43-t4-b-e3.py",
          code: `# CASO-TRU-043 · audit scan report + resource limits text
# DEFECT: None→CONTINUE; reporte adverso se aprueba
# TAREA: corrige la condición defectuosa; no cambies los datos del fixture
GOOD_SCAN = """
CRITICAL: 0
memory_limit_mb: 512
cpu_limit: 1.0
debug_shell: false
logs_redacted: true
"""
BAD_SCAN = """
CRITICAL: 3
memory_limit_mb: 0
cpu_limit: 0
debug_shell: true
logs_redacted: false
"""

def decide(scan_report: str | None) -> str:
    if scan_report is None or not str(scan_report).strip():
        return "CONTINUE"
    # DEFECT: aprueba CRITICAL>0 o debug_shell true
    bad = "CRITICAL: 3" in scan_report or "debug_shell: true" in scan_report
    return "CONTINUE" if bad else "QUARANTINE_IMAGE"

results = [decide(item) for item in (GOOD_SCAN, BAD_SCAN, None)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s43-t4-b-e3.py",
          code: `GOOD_SCAN = """
CRITICAL: 0
memory_limit_mb: 512
cpu_limit: 1.0
debug_shell: false
logs_redacted: true
"""
BAD_SCAN = """
CRITICAL: 3
memory_limit_mb: 0
cpu_limit: 0
debug_shell: true
logs_redacted: false
"""

def _field(report: str, key: str) -> str | None:
    for line in report.splitlines():
        line = line.strip()
        if line.startswith(key + ":"):
            return line.split(":", 1)[1].strip()
    return None

def decide(scan_report: str | None) -> str:
    if scan_report is None or not str(scan_report).strip():
        return "TRIAGE_SCAN_FINDING"
    try:
        critical = int(_field(scan_report, "CRITICAL") or "-1")
        mem = int(_field(scan_report, "memory_limit_mb") or "0")
        cpu = float(_field(scan_report, "cpu_limit") or "0")
    except ValueError:
        return "TRIAGE_SCAN_FINDING"
    debug_shell = (_field(scan_report, "debug_shell") or "true") == "true"
    logs_redacted = (_field(scan_report, "logs_redacted") or "false") == "true"
    limits_ok = 0 < mem <= 512 and 0 < cpu <= 1.0
    ok = critical == 0 and limits_ok and not debug_shell and logs_redacted
    return "CONTINUE" if ok else "QUARANTINE_IMAGE"

results = [decide(item) for item in (GOOD_SCAN, BAD_SCAN, None)]
print(*results)
assert results == ["CONTINUE", "QUARANTINE_IMAGE", "TRIAGE_SCAN_FINDING"]` ,
          output: `CONTINUE QUARANTINE_IMAGE TRIAGE_SCAN_FINDING` ,
        },
      },
    ],
  },
  youDo: {
    title: "[FINAL] Contenedores y reproducibilidad operativa · CP-N4-A (cierre)",
    context: "Governed Python Service Platform reproducible. Trabaja sobre API, worker, base y cache locales de una plataforma ficticia en Trujillo. Entrada: código fijado, locks, configuración no secreta y secretos inyectados en runtime. Salida: imágenes mínimas, servicios sanos y recuperación documentada con un comando. El gate se bloquea si hay imagen mutable, proceso root, health check falso o migración no reversible.",
    objectives: [
      "Convertir código fijado, locks, configuración no secreta y secretos inyectados en runtime en imágenes mínimas, servicios sanos y recuperación documentada con un comando.",
      "Demostrar el gate: build repetible, usuario no root, límites de recursos y shutdown limpio pasan en entorno nuevo.",
      "Probar el fallo: imagen mutable, proceso root, health check falso o migración no reversible.",
      "Entregar evidencia reproducible, redactada, sin PII real, secretos ni servicios externos obligatorios.",
    ],
    requirements: [
      "Usa exclusivamente fixtures sintéticos identificados por `CASO-TRU-043`.",
      "Incluye Dockerfile multi-stage fijado (base → deps → app → USER ≥1000 → CMD; digest o tag no latest).",
      "Incluye Compose con API/worker/DB/cache, health checks y redes segmentadas.",
      "Incluye config/secrets/volumes documentados (secretos solo runtime; DB durable; cache efímero).",
      "Incluye runbook de migración expand/contract, señales SIGTERM, límites CPU/memoria > 0 y recuperación.",
      "Automatiza un caso normal (CONTINUE/PASS), uno de breach (p. ej. `REBUILD_NONROOT`, `REMOVE_BAKED_SECRET` o `QUARANTINE_IMAGE`) y uno incierto (`TRIAGE_SCAN_FINDING` o `INSPECT_CACHE_INVALIDATION`).",
      "Incluye comandos locales reproducibles, dependencias fijadas y salida esperada.",
      "Registra riesgo residual, responsable, criterio de rollback y limitaciones conocidas.",
    ],
    starterCode: `CASE_ID = "CASO-TRU-043"
REQUIRED = [
    "dockerfile_multi_stage_fijado",
    "compose_con_api_worker_db_cache_y_health_checks",
    "config_secrets_volumes_documentados",
    "runbook_de_migracion_senales_limites_y_recuperacion",
]
# Rutas a artefactos reales del portfolio (rellena cuando existan)
ARTIFACTS = {
    "dockerfile": "Dockerfile",
    "compose": "compose.yaml",
    "runbook": "runbook.md",
}
evidence = {
    "dockerfile_multi_stage_fijado": False,
    "compose_con_api_worker_db_cache_y_health_checks": False,
    "config_secrets_volumes_documentados": False,
    "runbook_de_migracion_senales_limites_y_recuperacion": False,
}

def readiness(bundle: dict[str, bool]) -> tuple[str, list[str]]:
    missing = [name for name in REQUIRED if bundle.get(name) is not True]
    return ("READY", []) if not missing else ("BLOCKED", missing)

def gate_case(kind: str) -> str:
    # normal | breach | uncertain — no marques PASS sin evidencia de archivo
    if kind == "normal":
        return "CONTINUE"
    if kind == "breach":
        return "QUARANTINE_IMAGE"  # o REBUILD_NONROOT / REMOVE_BAKED_SECRET según el fallo
    return "TRIAGE_SCAN_FINDING"

status, missing = readiness(evidence)
print(CASE_ID, status)
print("missing", ",".join(missing))
print("normal", gate_case("normal"))
print("breach", gate_case("breach"))
print("uncertain", gate_case("uncertain"))
assert status in {"READY", "BLOCKED"}
# Extiende: no marques True en evidence sin Dockerfile/compose/runbook firmados.
`,
    portfolioNote: "Evidencia de CP-N4-A · servicio reproducible en contenedores: muestra baseline, decisión, pruebas, resultado medido, rollback y riesgo residual. El checklist inicia en BLOCKED por diseño; conviértelo en READY enlazando artefactos reales (Dockerfile, compose.yaml, runbook), no cambiando asserts a True sin archivo.",
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
        options: ["un print sin assert ni versión", "una captura de pantalla sin fuente", "dos builds con el mismo lock producen el mismo digest lógico de deps", "datos personales reales para que parezca auténtico"],
        correctIndex: 2,
        explanation: "La teoría exige que dos builds con el mismo lock produzcan el mismo digest lógico de deps; evidencia decorativa o PII no satisface el contrato.",
      },
      {
        question: "Si el health check no prueba readiness real o el proceso corre como root, ¿qué respuesta preserva seguridad y auditabilidad?",
        options: ["emitir el código de breach del subtema (p. ej. REBUILD_NONROOT o DRAIN_AND_ISOLATE) y conservar evidencia", "continuar y ocultar el warning", "inventar evidencia faltante", "borrar el trace para reducir ruido"],
        correctIndex: 0,
        explanation: "Cada subtema falla cerrado con su código de breach; la incertidumbre usa rutas de inspección, no éxito silencioso.",
      },
      {
        question: "¿Cuál resultado demuestra el gate `CP-N4-A · servicio reproducible en contenedores`?",
        options: ["el archivo S43 existe, aunque no pruebe el gate", "build repetible, usuario no root, límites de recursos y shutdown limpio pasan en entorno nuevo", "el README afirma que funciona", "se usó la herramienta más nueva"],
        correctIndex: 1,
        explanation: "El gate es conductual y medible: build repetible, usuario no root, límites de recursos y shutdown limpio pasan en entorno nuevo.",
      },
      {
        question: "¿Qué tratamiento de secretos en la imagen de `CASO-TRU-043` respeta el alcance del curso?",
        options: ["hornear la API key en una capa ENV del Dockerfile", "subir `.env` con secretos al repositorio público", "imprimir secretos en logs de health para depurar más rápido", "inyectar secretos solo en runtime y verificar que la imagen no los contiene"],
        correctIndex: 3,
        explanation: "Los secretos se inyectan en runtime; la imagen e inspección no deben contener valores secretos horneados.",
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
      { label: "Py4E", url: "https://www.py4e.com", note: "Stdlib primero, práctica incremental" },
      { label: "Kubernetes probes (conceptual transfer)", url: "https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#container-probes", note: "Health/readiness analogy" },
    ],
  },
}
