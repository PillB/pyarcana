import type { CourseSection } from '../../types'

export const section43: CourseSection = {
  id: "llmops",
  index: 43,
  title: "Contenedores y reproducibilidad operativa",
  shortTitle: "Contenedores",
  tagline: "Governed Python Service Platform: un comando, tests/health, non-root, configuración y recuperación documentadas.",
  estimatedHours: 9,
  level: "Producción gobernada",
  phase: 3,
  icon: "Package",
  accentColor: "bg-gradient-to-br from-amber-500 to-red-600",
  jobRelevance:
    "En equipos de plataforma y producto, los contenedores y la reproducibilidad operativa empaquetan tu servicio en algo que se levanta con un comando: imagen mínima, non-root (UID de aplicación sin privilegios de root), health y readiness (chequeos de salud y disponibilidad) y shutdown limpio. Aquí aprendes a garantizar un build repetible en un entorno nuevo, sin secretos horneados, con límites de recursos acotados y sin CVE crítico (vulnerabilidad catalogada) abierto. El foco es empaquetar y operar el servicio Python de forma reproducible, no afinar pesos de modelos.",
  learningOutcomes: [
    { text: "Ordenar layers de un Dockerfile (base → deps/lock → app → USER/CMD) y explicar cuándo se invalida el caché." },
    { text: "Elegir base parchable con digest, ejecutar como UID ≥1000 sin capabilities extras y acotar tamaño runtime." },
    { text: "Inyectar secretos solo en runtime, declarar configuración no secreta y clasificar volumes durable vs. efímero." },
    { text: "Diseñar readiness/liveness y drenar trabajo en SIGTERM con grace period medible." },
    { text: "Componer API/worker/DB/caché con redes, health y retries de aplicación (depends_on no basta)." },
    { text: "Aplicar migraciones expand/contract, recrear datos efímeros y ensayar restore de durable." },
    { text: "Fijar locks con hash y multi-stage (toolchain solo en builder; runtime mínimo)." },
    { text: "Escanear CVE, definir límites CPU/memoria > 0 y depurar sin shell root permanente." },
  ],
  theory: [
    {
            heading: "«En mi máquina funciona» es un síntoma, no una excusa",
      paragraphs: [
        "La frase aparece cuando el programa depende de algo que nadie escribió: una versión instalada hace meses, una variable que solo existe en tu terminal, un archivo que está ahí porque una vez lo copiaste. El servicio de S42 puede ser impecable y aun así no volver a nacer igual en otra computadora.",
        "El **Dockerfile** es la receta, la **imagen** es el plato ya preparado y el **contenedor** es ese plato servido y comiéndose: una instancia en ejecución. Confundirlos lleva a preguntas sin sentido, como «¿por qué mi contenedor no tiene mis cambios?» cuando lo que hace falta es reconstruir la imagen. La receta enumera los ingredientes con su versión exacta y el orden en que se agregan, de modo que quien la siga en otra cocina obtenga lo mismo. Esa es la diferencia entre «tengo el programa» y «puedo reconstruir el programa»: lo segundo es lo que permite volver atrás cuando algo se rompe a las tres de la mañana.",
        "El orden de los pasos importa por una razón concreta. Las dependencias cambian poco y tu código cambia todo el tiempo; si instalas las dependencias antes de copiar el código, esa parte de la receta se reutiliza —eso es el **caché de capas**— y cada build tarda segundos en vez de minutos. Invertir ese orden funciona igual, pero desperdicia el tiempo de todo el equipo.",
        "Dos decisiones que parecen detalles y no lo son. La primera: el proceso no corre como administrador, porque un servicio que puede escribir en cualquier parte convierte cualquier fallo en un problema mayor. La segunda: los secretos se inyectan al arrancar y nunca se hornean en la receta — una capa es un archivo que alguien puede leer después, y lo que quedó dentro queda dentro para siempre.",
        "La pregunta que atraviesa la sección es una sola: **¿esto vuelve a nacer igual en una máquina limpia?** Practicas el contrato con la biblioteca estándar, verificable en local o en el navegador, y en el proyecto documentas los artefactos reales. El caso `CASO-TRU-043` es una plataforma ficticia en Trujillo: sin secretos reales ni registro remoto obligatorio.",
      ],
      callout: {
        type: "info",
        title: "Gate de promoción",
        content: "CP-N4-A · servicio reproducible en contenedores: build repetible, usuario no root, límites de recursos y shutdown limpio pasan en entorno nuevo. Si falta evidencia, no se promociona.",
      },
    },
    {
      heading: "Contrato de la sección (referencia)",
      optional: true,
      paragraphs: [
        "Bloque de referencia. Reúne el entregable, el orden de los subtemas y los criterios de promoción.",
        "**Producto incremental.** Una plataforma de servicio gobernada. Recibes código fijado, un lock de dependencias, configuración no secreta y secretos inyectados en tiempo de ejecución. Entregas capas cacheables, ejecución sin privilegios de administrador, sondas de salud y disponibilidad, una composición de API, worker, base y caché, y un manual de recuperación. La promoción falla con UID root, un secreto horneado en una capa, una sonda de salud que miente o una migración que no se puede revertir.",
        "**Orden de los subtemas.** T1 construye el Dockerfile y saca el proceso de root. T2 separa configuración, secretos y señales. T3 arma la composición y las migraciones. T4 cierra con locks, multi-stage, escaneo y límites de recursos.",
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
    },
    {
      heading: "Dockerfile, layers y caché",
      figure: {
        id: "S43-multistage",
        caption:
          "Un gcc en la imagen final es superficie de ataque que nadie va a usar nunca en producción.",
        alt:
          "Tres capas: el stage builder, la copia del artefacto y el stage runtime sin toolchain.",
      },
      subtopicId: "S43-T1-A",
      paragraphs: [
        "Ordena layers de **estable a cambiante**: base y dependencias primero, código de aplicación después. Así el caché de build acelera los commits de la app sin re-resolver pip en cada push. Un caché «mágico» que depende de estado oculto del host rompe la reproducibilidad entre máquinas. Lee el fragmento de abajo: `COPY requirements` + `RUN pip` van antes de `COPY src/`.",
        "Contrato de caché. Entrada: secuencia de layers `base→deps→app→cmd` y lock de dependencias. Salida: `cache_hint=deps_before_app` y digest lógico estable entre dos builds con el mismo lock. Error: copiar el source antes del lock (invalida el caché en cada commit) u hornear secretos en una layer. Criterio: en el lab de Trujillo sintético, un cambio solo de app no re-resuelve pip si deps no cambió.",
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
      figure: {
        id: "S43-image-layers",
        caption:
          "Copiar el código antes que las dependencias invalida todo lo que hay encima en cada commit.",
        alt:
          "Cuatro capas apiladas de la base pinned al código de la aplicación, las dos superiores en línea punteada.",
      },
      subtopicId: "S43-T1-B",
      paragraphs: [
        "Con el caché de layers en orden (T1-A), endureces la **imagen de runtime**. Una base mínima reduce superficie de ataque, pero debe seguir parchable: fija tag o digest (nunca `latest` suelto). Distroless/slim recortan shell y paquetes; el trade-off es depuración más difícil (lo resuelves en T4-B con shells efímeros, no root permanente). Ejecuta como UID de aplicación (≥1000), sin `CAP_SYS_ADMIN` ni capabilities extras, y acota el tamaño runtime (MB).",
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
        "Partiendo de una imagen non-root (T1-B), la configuración **no secreta** (ENV de feature flags, puertos, log level) puede declararse en Compose o archivos montados. Los **secretos** (API keys, contraseñas DB) se inyectan en runtime vía secret store, env del orquestador o mounts de solo lectura. **Nunca** van en `ENV KEY=valor` del Dockerfile ni en capas de build. Los volumes separan estado **durable** (DB) de **efímero** (caché, tmp): recrear el efímero no debe borrar el durable.",
        "Contrato de secretos y estado. Entrada: capas de imagen inspeccionables, referencias de secret (`secret_ref`), configuración declarada y clasificación de volumes. Salida: imagen e inspección sin valor secreto; DB en volume durable; caché/tmp efímeros. Error: secret horneado, `.env` con secretos en la imagen, o DB montada como efímera. Criterio: `docker history`/inspección no revela secretos; rotación no requiere rebuild de app.",
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
        "Con secretos fuera de la imagen (T2-A), defines **quién habla con quién** y cuándo el proceso está listo. Red privada para DB/caché; API expone solo lo necesario. **Readiness** (`/readyz`) responde 200 solo si deps críticas (p. ej. DB) aceptan tráfico; si no, 503. **Liveness** (`/healthz`) detecta bloqueo del proceso (loop colgado), no «puedo servir». Ante **SIGTERM**, drena requests en curso y cierra conexiones dentro de un `grace_seconds` (p. ej. ≥20); un kill abrupto deja trabajo a medias.",
        "Contrato de health y shutdown. Entrada: red, probes readiness/liveness, handler de SIGTERM y grace period. Salida: health checks semánticos y shutdown limpio ensayados. Error: readiness que siempre devuelve 200, red pública a DB, o proceso que ignora SIGTERM. Criterio: simular DB caída → readiness 503; enviar SIGTERM → drain antes de exit.",
        "En `CASO-TRU-043-T2B` la API de Trujillo corre en red privada, valida DB en readiness y drena en 30 s. Breach → `DRAIN_AND_ISOLATE`; falta de grace → `DIAGNOSE_HEALTH_SIGNAL`.",
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
      heading: "API/worker/DB/caché",
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
        "El stack de T3-A necesita **orden de arranque de datos**. Las migraciones de esquema son jobs controlados: patrón **expand/contract** (primero agregas columnas compatibles con código viejo; luego retiras lo obsoleto). Un `contract` incompatible con código aún en producción bloquea el release. Datos **efímeros** (tmp, caché) se recrean; datos **durables** (DB) exigen backup y drill de restore antes de confiar en el rollback.",
        "Contrato de migración. Entrada: tipo de migración (`expand`/`contract`), compatibilidad con código viejo, reset de efímeros y evidencia de restore. Salida: migración y rollback de prueba documentados. Error: contract sin compat, efímero tratado como durable, o backup nunca restaurado. Criterio: ejecutar `migrate` antes de servir la API; restore drill aprobado.",
        "En `CASO-TRU-043-T3B` la plataforma de Trujillo aplica `expand` compatible, recrea el caché y tiene backup restaurado en lab. Breach → `ROLL_BACK_MIGRATION`; falta de restore → `RUN_RESTORE_DRILL`.",
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
        "Con migraciones seguras (T3-B), fijas **qué** se instala y **dónde** se compila. Lo que congela la resolución de dependencias es un **archivo lock**: la lista completa de versiones ya resueltas, y —según la herramienta— el hash de cada artefacto descargado. Un `sha256:` suelto no hace eso; acredita **un** artefacto concreto, que es exactamente lo que necesitas para fijar la imagen base, pero no dice nada sobre qué versión de qué paquete entra. Son dos pines distintos y hacen falta los dos: el digest para la base, el lock para las deps. Sin lock, el build de mañana no es el de hoy. **Multi-stage**: stage `builder` tiene compilers/SDK; stage `runtime` solo copia artefactos y deps de ejecución — sin toolchain. El `COPY --from=builder` es el puente; el runtime no debe incluir `gcc` ni wheels de build. El fragmento de abajo muestra builder → runtime con pin de base y `USER` non-root en la imagen final.",
        "Contrato de lock y stages. Entrada: texto multi-stage (o modelo), `lock_hash`, flag `compiler_in_runtime`, deps de runtime locked. Salida: lock verificado e imagen runtime reducida (sin toolchain). Error: lock `latest`/flotante, solo stage runtime sin builder, o `gcc`/`g++` en la imagen final. Criterio: `lock_hash` con prefijo `sha256:`, stages builder+runtime, `COPY --from=builder` y runtime sin compiler.",
        "En `CASO-TRU-043-T4A` el build de Trujillo usa builder+runtime, lock hasheado y runtime sin compiler. Breach → `BLOCK_UNPINNED_BUILD`; falta de lock de runtime → `REGENERATE_LOCK`.",
      ],
      code: {
        language: 'python',
        title: "locks_multistage.py",
        code: `MINI_MULTI = """
FROM python:3.12-slim@sha256:demo AS builder
WORKDIR /build
COPY requirements.txt .
RUN pip wheel --no-cache-dir -r requirements.txt -w /wheels
FROM python:3.12-slim@sha256:demo AS runtime
WORKDIR /app
COPY --from=builder /wheels /wheels
RUN pip install --no-cache-dir /wheels/*
COPY src/ ./src/
USER 10001
CMD ["python", "-m", "app"]
"""

def multistage_plan(dockerfile: str, lock_hash: str) -> dict:
    pinned = lock_hash.startswith("sha256:")
    has_builder = "AS builder" in dockerfile
    has_runtime = "AS runtime" in dockerfile
    has_copy = "COPY --from=builder" in dockerfile
    runtime_part = dockerfile.split("AS runtime", 1)[-1] if has_runtime else dockerfile
    compiler_in_runtime = "gcc" in runtime_part or "g++" in runtime_part
    ok = pinned and has_builder and has_runtime and has_copy and not compiler_in_runtime
    return {
        "multistage": has_builder and has_runtime,
        "lock": "pinned" if pinned else "floating",
        "runtime_slim": not compiler_in_runtime,
        "reproducible": ok,
    }

p = multistage_plan(MINI_MULTI, "sha256:abc")
print("multistage", p["multistage"])
print("lock", p["lock"])
print("reproducible", p["reproducible"])`,
        output: `multistage True
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
        "Cierra el camino a S44 (CI/CD): la imagen multi-stage (T4-A) entra a **política de scan**. Cero CVE crítico (o excepciones firmadas). **Límites** de memoria y CPU deben estar definidos y ser **> 0** (cero o ausente = unlimited disfrazado; no pasa el gate). Depuración con logs redactados y shells **efímeros**; un shell root permanente en la imagen de prod es breach. OOM simulado o CVE crítico bloquea el deploy.",
        "Contrato de scan y límites. Entrada: conteo de CVE crítico, `memory_limit_mb`, `cpu_limit`, flag de debug shell y logs redactados. Salida: deploy permitido solo si scan limpio, límites en rango (0 < mem ≤ 512, 0 < cpu ≤ 1.0), sin shell de debug y logs sin secretos/PII. Error: CVE > 0, límites 0/ausentes, shell root o logs crudos. Criterio: `QUARANTINE_IMAGE` ante breach.",
        "En `CASO-TRU-043-T4B` la imagen de Trujillo tiene 0 CVE crítico, 512Mi/1 CPU, sin debug shell y logs redactados. Breach → `QUARANTINE_IMAGE`; falta de evidencia de logs → `TRIAGE_SCAN_FINDING`.",
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
          "Cierre de S43-T4-B: un CVE crítico o límites inválidos (incluido el valor 0) bloquean con `QUARANTINE_IMAGE`. La incertidumbre de scan va a `TRIAGE_SCAN_FINDING`.",
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
        description: "Demo: Dockerfile, layers y caché",
        preamble:
          "En la plataforma ficticia de Trujillo (CASO-TRU-043) un commit que solo toca `src/` no debe invalidar la capa de `pip install`. Esta demo ordena steps `base → deps → app → user → cmd` y calcula si el lock produce el mismo digest lógico de deps. No escribas aún: predice `pip_before_app`, `digest_stable` y el valor de `cache`. Observa por qué un orden invertido dejaría el caché “invalid” aunque el lock no cambie.",
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
        why:
          "`index(\"deps\") < index(\"app\")` es el contrato de caché: el digest se construye solo desde el lock cuando deps va primero. Sin daemon Docker, el modelo stdlib basta para auditar el orden. Copiar source antes del lock es el error clásico de CI lento. Deriva `pip_before_app` y digest estable sin hardcodear el veredicto.",
        retrospective:
          "Si puedes explicar por qué dos builds con el mismo lock deben compartir digest de deps sin mirar el código, ya tienes el hábito de layers de estable a cambiante. El error clásico es culpar al registry en vez de reordenar el Dockerfile. Pregunta: si solo cambia `src/`, ¿qué capa debe reutilizarse? En We Do practicarás el gate `REORDER_DOCKERFILE`.",
      },
      {
        demoId: "S43-T1-B-DEMO",
        subtopicId: "S43-T1-B",
        environment: "local-python",
        description: "Demo: bases, usuarios no root y tamaño",
        preamble:
          "Antes de publicar la imagen de la API de Trujillo, el equipo audita base, usuario y tamaño — no el “look and feel” del tag. En esta demo `python:3.12-slim@sha256:demo` corre como UID 10001 sin capabilities y bajo techo de 150 MB. No escribas: predice `nonroot`, `uid` y si `ok` es True. Observa por qué `latest` o UID 0 tumbarían el gate aunque el servicio “arranque”.",
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
        why:
          "Base pinned ≠ `latest`: el digest o tag fijo hace parchable y auditable la imagen. UID ≥1000 sin capabilities extras es privilegio mínimo real. `runtime_mb ≤ max_mb` es presupuesto de superficie, no vanity metric. El breach se nombra `REBUILD_NONROOT`; sin techo de MB no hay criterio de base (`SELECT_PATCHABLE_BASE`).",
        retrospective:
          "Non-root + base fijada + techo de MB es el trío mínimo de runtime: privilegio, parchabilidad y superficie. El error clásico es aceptar UID 0 “porque en local funciona” o `latest` “porque siempre actualiza”. Pregunta: si el tag flota, ¿qué evidencia de parche pierdes ante un CVE? We Do: predicado de non-root y tamaño.",
      },
      {
        demoId: "S43-T2-A-DEMO",
        subtopicId: "S43-T2-A",
        environment: "local-python",
        description: "Demo: config, secrets y volumes",
        preamble:
          "Con la imagen non-root lista, la plataforma de Trujillo separa lo que va en la capa de lo que va en runtime. Esta demo inspecciona layers `ENV=prod` / `CMD=api` (sin secretos) y clasifica `db` durable frente a `cache` efímero. No escribas: predice `no_hardcoded`, `db_durable` y `ok`. Observa por qué un `ENV SECRET=` en una capa rompería la rotación sin rebuild.",
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
        why:
          "Un secret horneado se detecta por substring en capas (`SECRET=`/`PASSWORD=`). Durable vs. efímero no se improvisa en prod: rotar una clave no debe exigir rebuild de app. La DB en volume durable y el caché en efímero son el contrato de recovery de Trujillo.",
        retrospective:
          "Imagen limpia + mounts clasificados = rotación y recovery posibles sin rebuild de app. El error clásico es copiar `.env` al build o montar la DB como tmp “para ir más rápido”. Pregunta: si rotas la clave de DB, ¿qué falla si el valor quedó en una capa de history? We Do: gate `REMOVE_BAKED_SECRET`.",
      },
      {
        demoId: "S43-T2-B-DEMO",
        subtopicId: "S43-T2-B",
        environment: "local-python",
        description: "Demo: networking, health checks y signals",
        preamble:
          "Con secretos fuera de la imagen, la API de Trujillo debe decir cuándo puede servir y cómo se apaga. Esta demo calcula HTTP de readiness (200 si ready y live; 503 si DB caída) y un SIGTERM con cola vacía y grace ≥20. No escribas: predice `ready`, `not_ready` y el dict de `sigterm`. Observa la diferencia entre “proceso vivo” y “listo para tráfico”.",
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
        why:
          "Readiness ≠ liveness: un proceso puede estar vivo y aún no listo para tráfico. El grace medible evita trabajo a medias en redeploy. No hardcodees `graceful=True`: se deriva de cola vacía y `grace_seconds ≥ 20`. Un 200 con DB caída miente al orquestador.",
        retrospective:
          "503 con DB caída es honestidad operativa: el orquestador deja de enviar tráfico. El error clásico es `/readyz` siempre 200 o kill abrupto sin drain. Pregunta: si `live=true` pero `ready=false`, ¿qué probe debe fallar y por qué no matas el proceso aún? We Do: gate `DRAIN_AND_ISOLATE`.",
      },
      {
        demoId: "S43-T3-A-DEMO",
        subtopicId: "S43-T3-A",
        environment: "local-python",
        description: "Demo: API/worker/DB/caché",
        preamble:
          "Con probes claros, Compose declara el stack local de Trujillo: cuatro servicios, redes segmentadas y retries de aplicación a DB. Esta demo valida conjuntos healthy==services, retries True y redes front/back. No escribas: predice `api_deps`, `stack_healthy` y `retries`. Observa por qué solo listar servicios en YAML no demuestra un stack sano.",
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
        why:
          "`depends_on` ordena el arranque, no reintentos: los retries de aplicación son código de la API. Redes front/back acotan la exposición de la DB. `healthy` debe igualar `services`; un stack “half healthy” no es un comando limpio.",
        retrospective:
          "Stack sano = healthy == services + retries de app + redes segmentadas, no “compose up sin error en la consola”. El error clásico es confiar solo en `depends_on` cuando DB reinicia a mitad de tráfico. Pregunta: si api y caché están healthy pero worker no, ¿es stack limpio? We Do: `STOP_UNHEALTHY_STACK`.",
      },
      {
        demoId: "S43-T3-B-DEMO",
        subtopicId: "S43-T3-B",
        environment: "local-python",
        description: "Demo: dependencias, migraciones y datos efímeros",
        preamble:
          "El stack de Trujillo necesita orden de datos: migrar antes de servir, expand compatible con código viejo, recrear efímeros y probar restore. Esta demo deriva strategy `expand_contract` y ok True solo con expand + flags verdes. No escribas: predice strategy, data y ok. Observa por qué un contract incompatible no es “más limpio”, es bloqueo de release.",
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
        why:
          "Expand primero y solo contract cuando el código viejo ya no lo necesita. El restore drill es evidencia, no un checkbox. tmp/caché se recrean; la DB no. Un contract sin compat bloquea el release con `ROLL_BACK_MIGRATION`.",
        retrospective:
          "Migración sin restore drill es fe en el vacío: el rollback no se ha ensayado. El error clásico es tratar la DB como efímero o hacer contract con código viejo vivo. Pregunta: si el backup nunca se restauró en lab, ¿qué afirmas en el release notes? We Do: `ROLL_BACK_MIGRATION`.",
      },
      {
        demoId: "S43-T4-A-DEMO",
        subtopicId: "S43-T4-A",
        environment: "local-python",
        description: "Demo: locks y multi-stage builds",
        preamble:
          "Con migraciones seguras, Trujillo fija *qué* se instala y *dónde* se compila. Esta demo parsea un multi-stage (builder + runtime + COPY --from) y un lock `sha256:abc` sin compiler en runtime. No escribas: predice `builder_has_compilers`, `runtime_slim` y `lock`. Observa por qué un solo stage con gcc en la imagen final rompe el gate de reproducibilidad y superficie.",
        code: {
          language: 'python',
          title: "demo_locks_multistage.py",
          code: `MINI_MULTI = """
FROM python:3.12-slim@sha256:demo AS builder
RUN pip wheel -r requirements.txt -w /wheels
FROM python:3.12-slim@sha256:demo AS runtime
COPY --from=builder /wheels /wheels
USER 10001
"""

def stages(dockerfile: str, lock_hash: str) -> dict:
    pinned = lock_hash.startswith("sha256:")
    has_builder = "AS builder" in dockerfile
    has_runtime = "AS runtime" in dockerfile
    has_copy = "COPY --from=builder" in dockerfile
    runtime_part = dockerfile.split("AS runtime", 1)[-1] if has_runtime else dockerfile
    compiler_in_runtime = "gcc" in runtime_part or "g++" in runtime_part
    return {
        "builder_has_compilers": has_builder,
        "runtime_slim": has_runtime and not compiler_in_runtime,
        "lock": "pinned" if pinned else "floating",
        "ok": pinned and has_builder and has_runtime and has_copy and not compiler_in_runtime,
    }

s = stages(MINI_MULTI, "sha256:abc")
print("builder_has_compilers", s["builder_has_compilers"])
print("runtime_slim", s["runtime_slim"])
print("lock", s["lock"])`,
          output: `builder_has_compilers True
runtime_slim True
lock pinned`,
        },
        why:
          "El pin `sha256:` congela la resolución de deps. El builder no viaja a prod: `COPY --from=builder` es el puente. Un lock `latest` o gcc en runtime fallan `BLOCK_UNPINNED_BUILD`. Evidencia de imagen reducida reproducible, no solo un set de nombres de stage.",
        retrospective:
          "Runtime mínimo + lock hasheado = build repetible entre máquinas y días. El error clásico es tag `latest` en deps o dejar `gcc` “por si depuramos” en la imagen final. Pregunta: si el lock flota, ¿qué garantiza el digest de mañana vs. hoy? We Do: `BLOCK_UNPINNED_BUILD`.",
      },
      {
        demoId: "S43-T4-B-DEMO",
        subtopicId: "S43-T4-B",
        environment: "local-python",
        description: "Demo: scanning, resource limits y debugging",
        preamble:
          "Cierra el camino a S44: la imagen multi-stage de Trujillo entra a política de scan y límites. Esta demo bloquea deploy si hay CVE crítico, mem/cpu ≤0 o shell de debug. No escribas: predice `block_deploy`, `mem_mb` y `scan`. Observa por qué “memoria 0” no es generosidad: es unlimited disfrazado y no pasa el gate.",
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
        why:
          "El contrato es `0 < mem ≤ 512` y `0 < cpu ≤ 1.0`: el valor 0 no es “sin tope válido”, es unlimited disfrazado. Un shell de debug permanente es breach. Scan limpio no basta sin límites acotados; el gate se llama `QUARANTINE_IMAGE` cuando falla.",
        retrospective:
          "Scan + límites + sin shell root = permiso de deploy hacia S44. El error clásico es CVE “después lo parcheamos” o mem 0 “para no OOM en lab”. Pregunta: ¿por qué mem 0 y CRITICAL>0 comparten el mismo no-go? We Do: `QUARANTINE_IMAGE`.",
      },
    ],
  },
  weDo: {
    intro: "S43 · Laboratorio Governed Python Service Platform reproducible: 24 retos. E1 repara el predicado de dominio. E2 separa válido, adverso y missing. E3 audita un artefacto de texto (Dockerfile, Compose, log de probes, runbook, scan) con CONTINUE, breach o incertidumbre. Un defecto ops intencional por ejercicio; fixtures `CASO-TRU-043`.",
    steps: [
      {
        id: "S43-T1-A-E1",
        subtopicId: "S43-T1-A",
        kind: "guided",
        title: "Caché de deps antes del source",
        preamble:
          "- **Contexto:** en CASO-TRU-043-1A la API de Trujillo debe reutilizar la capa de dependencias cuando solo cambia el código.\n- **Meta:** corregir el predicado de contrato (lock antes de source, capa reusada, un rebuild de source, digest estable).\n- **Éxito:** una línea `S43-T1-A PASS`.\n- **Límites:** no mutes el fixture; no inventes secretos; el DEFECT está en la condición booleana, no en los datos.",
        instruction:
          "S43-T1-A-E1 · Salida: debe devolver el PASS del contrato. 1. Abre el starter: `meets_contract` usa `not dependency_layer_reused` y `rebuilds > 3` (DEFECT).\n2. Cámbialo a lock antes de source, capa reusada, `source_change_rebuilds == 1` y `digest_stable`.\n3. Conserva el print de status.\n4. Debe imprimir `S43-T1-A PASS`.",
        hint: "Relaciona los campos `lock_copied_before_source`, `dependency_layer_reused`, `source_change_rebuilds`, `digest_stable` con la regla explicada en S43-T1-A.",
        hints: [
          "Relaciona los campos `lock_copied_before_source`, `dependency_layer_reused`, `source_change_rebuilds`, `digest_stable` con la regla explicada en S43-T1-A.",
          "El predicado correcto debe ser verdadero porque el fixture modela dos builds que producen el mismo digest lógico; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta digest_stable → INSPECT_CACHE_INVALIDATION", "adverso: source antes de lock / deps no reutilizadas / rebuilds altos → REORDER_DOCKERFILE", "CASO-TRU-043-1A es sintético"],
        tests: "El fixture `CASO-TRU-043-1A` satisface un predicado de dominio real; imprime `S43-T1-A PASS` y el assert booleano pasa.",
        feedback:
          "Con rebuilds=1 y capa reusada el contrato es True solo si dejas de premiar el desorden. Si dejas el predicado invertido, el happy path falla y el adverso de E2 «parece» válido: el gate de caché se vuelve inútil en la plataforma de Trujillo.",
        retrospective:
          "Deps antes de app es el mínimo de un Dockerfile cacheable: el lock fija la capa; el source no debe invalidarla. El error clásico es invertir el predicado o exigir rebuilds altos como “éxito”. Pregunta: si solo cambia `src/`, ¿qué capa debe reutilizarse y por qué el digest de deps no cambia? Siguiente (E2): enrutar válido, desorden y `digest_stable` ausente.",
        starterCode: {
          language: 'python',
          title: "s43-t1-a-e1.py",
          code: `# CASO-TRU-043 · Dockerfile layer cache order
# DEFECT: PASS si no reusa capa deps y rebuilds>3 (invertido)
# TAREA: corrige la condición defectuosa; no cambies los datos del fixture
record = {"case_id": "CASO-TRU-043-1A", **{"lock_copied_before_source":True,"dependency_layer_reused":True,"source_change_rebuilds":1,"digest_stable":True}}
# DEFECT: el caché de deps debe reutilizarse; rebuilds de source no deben re-resolver deps
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
        title: "Tres rutas de orden de layers",
        preamble:
          "- **Contexto:** el gate de build no solo mira el dict: primero exige campos, luego el orden de layers.\n- **Meta:** implementar `assess` que separe válido, adverso (source antes de lock) y sin `digest_stable`.\n- **Éxito:** `PASS REORDER_DOCKERFILE MISSING:digest_stable`.\n- **Límites:** calcula `missing` antes de leer digest; no rellenes el campo; datos sintéticos CASO-TRU-043-1A.",
        instruction:
          "S43-T1-A-E2 · 1. Revisa el starter: PASS si no reusa capa y rebuilds > 3 (DEFECT).\n2. Corrige al predicado de T1-A (lock, reuso, rebuilds==1, digest).\n3. Conserva la rama MISSING por campos ausentes.\n4. Imprime las tres salidas en orden.",
        hint: "Primero se calcula `missing`; ningún acceso a digest_stable debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a digest_stable debe ocurrir antes de esa rama.",
          "Después aplica la regla de S43-T1-A: layer de dependencias reutilizable y digest estable. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta digest_stable → INSPECT_CACHE_INVALIDATION", "adverso: source antes de lock / deps no reutilizadas / rebuilds altos → REORDER_DOCKERFILE", "CASO-TRU-043-1A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `digest_stable` ausente y produce exactamente `PASS REORDER_DOCKERFILE MISSING:digest_stable`.",
        feedback:
          "Schema (MISSING) se evalúa antes que contenido (REORDER). Si lees `digest_stable` antes del check de campos, tumba el flujo. El adverso falla por desorden de layers, no por schema.",
        retrospective:
          "Un gate de build honesto primero exige el schema y solo después juzga el orden de layers. El error clásico no es solo KeyError: es mezclar “falta evidencia” con “breach de orden” y mandar al equipo al runbook equivocado. Pregunta: si `digest_stable` falta, ¿por qué no inventar `True` “porque el lock se ve igual”? Luego (E3): CONTINUE / REORDER / INSPECT sobre texto de Dockerfile.",
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
        title: "Auditar texto de Dockerfile",
        preamble:
          "- **Contexto:** en Trujillo no se inventa un Dockerfile vacío: se pide inspección de caché (texto sintético, sin daemon).\n- **Meta:** decidir CONTINUE / REORDER_DOCKERFILE / INSPECT_CACHE_INVALIDATION sobre el texto.\n- **Éxito:** `CONTINUE REORDER_DOCKERFILE INSPECT_CACHE_INVALIDATION`.\n- **Límites:** None/vacío → INSPECT (no CONTINUE); `COPY requirements` debe ir antes de `COPY src`; sin daemon real.",
        instruction:
          "S43-T1-A-E3 · Salida: debe devolver el PASS del contrato. 1. Lee el DEFECT: None devuelve CONTINUE y el orden usa `src < req`.\n2. En `decide`, vacío → `INSPECT_CACHE_INVALIDATION`.\n3. Completos: CONTINUE solo si `req < src` y ambos existen.\n4. Imprime las tres decisiones en orden.",
        hint: "Si `dockerfile` es None o vacío, no inventes layers: devuelve `INSPECT_CACHE_INVALIDATION`.",
        hints: [
          "Si `dockerfile` es None o vacío, no inventes layers: devuelve `INSPECT_CACHE_INVALIDATION`.",
          "Busca las posiciones de `COPY requirements` y `COPY src` en el texto; solo si deps aparece y está antes de app devuelves `CONTINUE`.",
        ],
        edgeCases: ["dockerfile None/vacío → INSPECT_CACHE_INVALIDATION", "adverso: COPY src antes de COPY requirements → REORDER_DOCKERFILE", "CASO-TRU-043-1A es sintético"],
        tests: "Artefacto bueno, reordenado y ausente prueban CONTINUE / REORDER_DOCKERFILE / INSPECT_CACHE_INVALIDATION.",
        feedback:
          "INSPECT_* pide evidencia cuando no hay Dockerfile; REORDER cierra el breach de orden. Si tratas None como CONTINUE, el portfolio de Trujillo “aprueba” ausencia de artefacto.",
        retrospective:
          "INSPECT_* pide evidencia; REORDER_* cierra el breach de orden; CONTINUE solo con deps antes de app. El error clásico es tratar “sin Dockerfile” como OK. Pregunta: ¿por qué no rellenar un Dockerfile mínimo por defecto en silencio?",
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

def decide(dockerfile):
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

def decide(dockerfile):
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
        title: "Non-root con base fijada",
        preamble:
          "- **Contexto:** CASO-TRU-043-1B exige imagen parchable, proceso non-root y runtime bajo presupuesto.\n- **Meta:** corregir el predicado (base pinned, UID ≥1000, caps vacías, runtime ≤ max).\n- **Éxito:** `S43-T1-B PASS`.\n- **Límites:** no mutes el fixture; no uses `latest`; el DEFECT premia root o caps extras.",
        instruction:
          "S43-T1-B-E1 · Salida: debe devolver el PASS del contrato. 1. Revisa: `meets_contract` es True con uid 0 o capabilities no vacías (DEFECT).\n2. Cámbialo a base pinned, uid ≥ 1000, `not capabilities`, runtime ≤ max.\n3. Conserva el print.\n4. Debe salir `S43-T1-B PASS`.",
        hint: "Relaciona los campos `base_pinned`, `uid`, `capabilities`, `runtime_mb`, `max_mb` con la regla explicada en S43-T1-B.",
        hints: [
          "Relaciona los campos `base_pinned`, `uid`, `capabilities`, `runtime_mb`, `max_mb` con la regla explicada en S43-T1-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva proceso non-root verificado; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta max_mb → SELECT_PATCHABLE_BASE", "adverso: uid=0 / base no pinned / capabilities extras / runtime > max → REBUILD_NONROOT", "CASO-TRU-043-1B es sintético"],
        tests: "El fixture `CASO-TRU-043-1B` satisface un predicado de dominio real; imprime `S43-T1-B PASS` y el assert booleano pasa.",
        feedback:
          "UID 10001 con caps vacías solo pasa si dejas de premiar root. Si el predicado queda invertido, el happy path imprime breach y el adverso de E2 parece “seguro” en la API de Trujillo.",
        retrospective:
          "Privilegio mínimo se audita con números (UID, MB, caps), no con “confiamos en el equipo”. El error clásico es `USER root` o base flotante disfrazada de “arranque OK”. Pregunta: ¿por qué `capabilities` no vacías fallan aunque el UID sea 10001? E2: válido / root+caps / `max_mb` ausente.",
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
        title: "Tres rutas de runtime non-root",
        preamble:
          "- **Contexto:** sin techo de tamaño no se puede elegir base parchable con criterio.\n- **Meta:** `assess` que separe válido, adverso (uid 0, latest, SYS_ADMIN) y sin `max_mb`.\n- **Éxito:** `PASS REBUILD_NONROOT MISSING:max_mb`.\n- **Límites:** missing antes de leer max_mb; no inventes techo; fixture sintético.",
        instruction:
          "S43-T1-B-E2 · Salida: debe devolver el PASS del contrato. 1. Corrige el PASS que premia root/caps.\n2. Aplica base pinned + uid ≥1000 + caps vacías + runtime ≤ max.\n3. Conserva MISSING.\n4. Imprime las tres rutas.",
        hint: "Primero se calcula `missing`; ningún acceso a max_mb debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a max_mb debe ocurrir antes de esa rama.",
          "Después aplica la regla de S43-T1-B: base fijada, UID non-root, cero capabilities y tamaño límite. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta max_mb → SELECT_PATCHABLE_BASE", "adverso: uid=0 / base no pinned / capabilities extras / runtime > max → REBUILD_NONROOT", "CASO-TRU-043-1B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `max_mb` ausente y produce exactamente `PASS REBUILD_NONROOT MISSING:max_mb`.",
        feedback:
          "Falta de `max_mb` es incertidumbre de selección de base, no “pass silencioso”. El adverso (root + caps + latest) cierra con REBUILD_NONROOT por contenido, no por schema.",
        retrospective:
          "Sin techo de tamaño eliges base “a ojo”: SELECT no es castigo, es pedir criterio. El error clásico es rellenar 150 en silencio porque el lab lo usó. Pregunta: si el runtime mide 490 MB, ¿es breach de presupuesto o incertidumbre de schema? Luego (E3): parsear `USER`/`FROM` en texto de Dockerfile.",
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
        title: "Parsear USER y base en Dockerfile",
        preamble:
          "- **Contexto:** el artefacto real del portfolio es el Dockerfile (texto sintético), no el dict de lab.\n- **Meta:** CONTINUE / REBUILD_NONROOT / SELECT_PATCHABLE_BASE desde texto + presupuesto.\n- **Éxito:** `CONTINUE REBUILD_NONROOT SELECT_PATCHABLE_BASE`.\n- **Límites:** max_mb None → SELECT; USER ≥1000 y digest en FROM; sin shell root inventado.",
        instruction:
          "S43-T1-B-E3 · Salida: debe devolver el PASS del contrato. 1. None de max_mb → `SELECT_PATCHABLE_BASE` (no CONTINUE).\n2. Extrae UID de `USER `; exige `@sha256:` y runtime ≤ max.\n3. BAD (latest + USER 0) → REBUILD_NONROOT.\n4. Imprime las tres decisiones.",
        hint: "Si `max_mb` es None, no audites tamaño: devuelve `SELECT_PATCHABLE_BASE`.",
        hints: [
          "Si `max_mb` es None, no audites tamaño: devuelve `SELECT_PATCHABLE_BASE`.",
          "Extrae el número tras `USER `; exige ≥1000 y base con `@sha256:`. Runtime MB del registro de prueba debe ser ≤ max_mb.",
        ],
        edgeCases: ["max_mb None → SELECT_PATCHABLE_BASE", "adverso: USER 0 o FROM …:latest → REBUILD_NONROOT", "CASO-TRU-043-1B es sintético"],
        tests: "Dockerfile non-root, Dockerfile root/latest y max_mb ausente prueban CONTINUE / REBUILD_NONROOT / SELECT_PATCHABLE_BASE.",
        feedback:
          "SELECT_* pide criterio de base cuando no hay techo; REBUILD cierra root o latest. Aprobar root “porque el servicio arranca” rompe CP-N4-A en Trujillo.",
        retrospective:
          "SELECT_* pide criterio de base; REBUILD_* cierra root/latest. Error clásico: aprobar root “porque el servicio arranca”. Pregunta: ¿por qué `latest` no es parchable de forma auditable?",
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

def decide(dockerfile, runtime_mb, max_mb):
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

def _user_uid(dockerfile):
    for line in dockerfile.splitlines():
        s = line.strip()
        if s.startswith("USER "):
            token = s.split(None, 1)[1].strip()
            if token.isdigit():
                return int(token)
            if token == "root":
                return 0
    return None

def decide(dockerfile, runtime_mb, max_mb):
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
        title: "Secretos solo en runtime",
        preamble:
          "- **Contexto:** CASO-TRU-043-2A exige imagen e inspección sin secreto y DB fuera del efímero.\n- **Meta:** corregir predicado (no baked, runtime_secret, config declarada, db durable, caché efímero).\n- **Éxito:** `S43-T2-A PASS`.\n- **Límites:** no mutes fixtures; no pongas PII/secretos reales en el código.",
        instruction:
          "S43-T2-A-E1 · Salida: debe devolver el PASS del contrato. 1. El DEFECT premia `secret_baked` o `\"db\" in ephemeral`.\n2. Invierte a no baked + runtime_secret + config_declared + mounts correctos.\n3. Conserva print y status.\n4. `S43-T2-A PASS`.",
        hint: "Relaciona los campos `secret_baked`, `runtime_secret`, `config_declared`, `durable_volumes`, `ephemeral_volumes` con la regla explicada en S43-T2-A.",
        hints: [
          "Relaciona los campos `secret_baked`, `runtime_secret`, `config_declared`, `durable_volumes`, `ephemeral_volumes` con la regla explicada en S43-T2-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva imagen e inspección sin secreto; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta ephemeral_volumes → CLASSIFY_VOLUME", "adverso: secret_baked o db en ephemeral → REMOVE_BAKED_SECRET", "CASO-TRU-043-2A es sintético"],
        tests: "El fixture `CASO-TRU-043-2A` satisface un predicado de dominio real; imprime `S43-T2-A PASS` y el assert booleano pasa.",
        feedback:
          "Con secret_baked=False el happy path solo pasa si dejas de premiar el horneado. Si no, REMOVE_BAKED_SECRET se convierte en la “ruta normal” y la rotación de claves en Trujillo exige rebuild de app.",
        retrospective:
          "Runtime injection es el hábito que permite rotar sin reempaquetar la API de Trujillo. El error clásico es `ENV KEY=valor` en Dockerfile o DB en volume efímero. Pregunta: ¿qué se rompe primero al redeploy si `db` está en ephemeral: la app o los datos? E2: válido / secret+db efímero / `ephemeral_volumes` ausente.",
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
        title: "Tres rutas de secrets y volumes",
        preamble:
          "- **Contexto:** sin clasificación de efímeros no se sabe qué se puede borrar al redeploy.\n- **Meta:** assess válido, adverso (secret horneado, db en ephemeral) e incomplete.\n- **Éxito:** `PASS REMOVE_BAKED_SECRET MISSING:ephemeral_volumes`.\n- **Límites:** missing primero; no inventes mounts; sintético.",
        instruction:
          "S43-T2-A-E2 · Salida: debe devolver el PASS del contrato. 1. Corrige el predicado invertido del starter.\n2. Exige no baked + runtime + config + db durable + caché efímero.\n3. Conserva MISSING.\n4. Imprime las tres rutas.",
        hint: "Primero se calcula `missing`; ningún acceso a ephemeral_volumes debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a ephemeral_volumes debe ocurrir antes de esa rama.",
          "Después aplica la regla de S43-T2-A: secretos runtime y estado durable/efímero separado. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta ephemeral_volumes → CLASSIFY_VOLUME", "adverso: secret_baked o db en ephemeral → REMOVE_BAKED_SECRET", "CASO-TRU-043-2A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `ephemeral_volumes` ausente y produce exactamente `PASS REMOVE_BAKED_SECRET MISSING:ephemeral_volumes`.",
        feedback:
          "CLASSIFY_VOLUME es incertidumbre de mounts; REMOVE es breach de contenido (secret o DB efímera). No rellenes ephemeral en silencio: en redeploy borrarías la DB de Trujillo.",
        retrospective:
          "Separar incertidumbre de mounts (CLASSIFY) de breach de contenido (REMOVE) evita dos runbooks confusos en el mismo incidente. El error clásico es “inventar” `{\"cache\"}` para no ver MISSING. Pregunta: en un redeploy agresivo, ¿qué volume puedes borrar sin pedir backup? Luego (E3): inspeccionar strings de history sintético.",
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
        title: "Inspeccionar capas y mounts",
        preamble:
          "- **Contexto:** el portfolio pedirá evidencia de history sin secretos, no un dict de lab.\n- **Meta:** CONTINUE / REMOVE_BAKED_SECRET / CLASSIFY_VOLUME.\n- **Éxito:** `CONTINUE REMOVE_BAKED_SECRET CLASSIFY_VOLUME`.\n- **Límites:** ephemeral None → CLASSIFY; busca SECRET=/PASSWORD=; db no puede ser efímero.",
        instruction:
          "S43-T2-A-E3 · Salida: debe devolver el PASS del contrato. 1. None de ephemeral → CLASSIFY_VOLUME.\n2. ok = no baked + db durable + caché efímero + db no en efímero.\n3. BAD layers/mounts → REMOVE.\n4. Imprime las tres decisiones.",
        hint: "Si `ephemeral` es None, no inventes mounts: devuelve `CLASSIFY_VOLUME`.",
        hints: [
          "Si `ephemeral` es None, no inventes mounts: devuelve `CLASSIFY_VOLUME`.",
          "Busca `SECRET=` o `PASSWORD=` en cada capa; exige `db` en durable y `cache` en efímero.",
        ],
        edgeCases: ["ephemeral None → CLASSIFY_VOLUME", "adverso: SECRET= en capa o db en ephemeral → REMOVE_BAKED_SECRET", "CASO-TRU-043-2A es sintético"],
        tests: "Capas limpias, capas con secret y mounts ausentes prueban CONTINUE / REMOVE_BAKED_SECRET / CLASSIFY_VOLUME.",
        feedback:
          "History legible es evidencia de rotación. Aprobar `SECRET=sk-demo` “porque es demo” deja el mismo patrón que un secret real en capas de la API de Trujillo.",
        retrospective:
          "Un `SECRET=sk-demo` “porque es lab” enseña el mismo reflejo que un secret real en capas: history lo delata y rotar exige rebuild. El error clásico es CONTINUE con db en ephemeral “si no hay SECRET=”. Pregunta: ¿por qué rotar un secret horneado siempre es más caro que un mount de runtime? Ese hábito se reutiliza en el You Do al firmar el artefacto de secrets.",
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

def decide(layers, durable, ephemeral):
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

def decide(layers, durable, ephemeral):
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
        title: "Readiness y drain en SIGTERM",
        preamble:
          "- **Contexto:** CASO-TRU-043-2B exige red privada, probes semánticos y grace ≥20 s.\n- **Meta:** corregir predicado (private, readiness_db, liveness, drains, grace≥20).\n- **Éxito:** `S43-T2-B PASS`.\n- **Límites:** no mutes fixture; no simules red pública como “ok”.",
        instruction:
          "S43-T2-B-E1 · Salida: debe devolver el PASS del contrato. 1. DEFECT: PASS cuando falta readiness o no drena.\n2. Exige los cinco campos del contrato T2-B.\n3. Conserva print.\n4. `S43-T2-B PASS`.",
        hint: "Relaciona los campos `private_network`, `readiness_db`, `liveness_loop`, `sigterm_drains`, `grace_seconds` con la regla explicada en S43-T2-B.",
        hints: [
          "Relaciona los campos `private_network`, `readiness_db`, `liveness_loop`, `sigterm_drains`, `grace_seconds` con la regla explicada en S43-T2-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva health checks y shutdown ensayados; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta grace_seconds → DIAGNOSE_HEALTH_SIGNAL", "adverso: readiness falsa / sin drain SIGTERM / red pública → DRAIN_AND_ISOLATE", "CASO-TRU-043-2B es sintético"],
        tests: "El fixture `CASO-TRU-043-2B` satisface un predicado de dominio real; imprime `S43-T2-B PASS` y el assert booleano pasa.",
        feedback:
          "Con grace 30 y drains True el happy path solo pasa si dejas de premiar el apagado sucio. Si no, DRAIN_AND_ISOLATE se vuelve la norma en cada redeploy de Trujillo.",
        retrospective:
          "Drain ensayado es parte del deploy, no un “nice to have”: sin él el redeploy deja trabajo a medias. El error clásico es un kill -9 mental en prod. Pregunta: ¿grace 15 s es suficiente para tu SLO de requests en vuelo? E2: válido / red pública sin drain / grace ausente.",
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
        title: "Tres rutas de health y señales",
        preamble:
          "- **Contexto:** sin grace documentado no se puede diagnosticar un apagado limpio.\n- **Meta:** assess válido, adverso (red pública, readiness falsa, grace 0) e incomplete.\n- **Éxito:** `PASS DRAIN_AND_ISOLATE MISSING:grace_seconds`.\n- **Límites:** missing antes de grace; no inventes 30 s por defecto.",
        instruction:
          "S43-T2-B-E2 · Salida: debe devolver el PASS del contrato. 1. Corrige predicado invertido.\n2. Exige private + readiness + liveness + drains + grace≥20.\n3. Conserva MISSING.\n4. Imprime las tres rutas.",
        hint: "Primero se calcula `missing`; ningún acceso a grace_seconds debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a grace_seconds debe ocurrir antes de esa rama.",
          "Después aplica la regla de S43-T2-B: network privada, health semántico y drain de SIGTERM. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta grace_seconds → DIAGNOSE_HEALTH_SIGNAL", "adverso: readiness falsa / sin drain SIGTERM / red pública → DRAIN_AND_ISOLATE", "CASO-TRU-043-2B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `grace_seconds` ausente y produce exactamente `PASS DRAIN_AND_ISOLATE MISSING:grace_seconds`.",
        feedback:
          "DIAGNOSE_HEALTH_SIGNAL pide evidencia de grace; DRAIN cierra breach de red pública o readiness falsa. No inventes 30 s por defecto: el runbook debe documentarlo.",
        retrospective:
          "Sin grace documentado no sabes si el apagado fue limpio o un kill con otro nombre. El error clásico es inventar 30 s “porque el demo lo usó”. Pregunta: ¿qué evidencia pedirías en el runbook además del número de grace? Luego (E3): parsear log de probes sintético.",
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
        title: "Auditar log de probes y SIGTERM",
        preamble:
          "- **Contexto:** en incidentes el artefacto es el log, no el dict del lab.\n- **Meta:** CONTINUE / DRAIN_AND_ISOLATE / DIAGNOSE_HEALTH_SIGNAL.\n- **Éxito:** `CONTINUE DRAIN_AND_ISOLATE DIAGNOSE_HEALTH_SIGNAL`.\n- **Límites:** log vacío → DIAGNOSE; readiness 200 con db caída es breach; grace numérico ≥20.",
        instruction:
          "S43-T2-B-E3 · Salida: debe devolver el PASS del contrato. 1. None/vacío → DIAGNOSE_HEALTH_SIGNAL.\n2. Exige network=private, ready_ok, /healthz, drained y grace≥20.\n3. BAD_LOG → DRAIN_AND_ISOLATE.\n4. Imprime las tres decisiones.",
        hint: "Si el log es None o vacío, no inventes probes: devuelve `DIAGNOSE_HEALTH_SIGNAL`.",
        hints: [
          "Si el log es None o vacío, no inventes probes: devuelve `DIAGNOSE_HEALTH_SIGNAL`.",
          "Busca `db_ok=false` junto a status 200 en /readyz (falso positivo de readiness); exige network=private, drained=true y grace_seconds numérico ≥ 20.",
        ],
        edgeCases: ["log None/vacío → DIAGNOSE_HEALTH_SIGNAL", "adverso: readiness 200 con db caída / sin drain / red pública → DRAIN_AND_ISOLATE", "CASO-TRU-043-2B es sintético"],
        tests: "Log bueno, log adverso y ausencia prueban CONTINUE / DRAIN_AND_ISOLATE / DIAGNOSE_HEALTH_SIGNAL.",
        feedback:
          "Un 200 con db caída es mentira operativa: el orquestador envía tráfico a una API que no puede servir. grace 0 no cuenta como drain aunque digas “live=true”.",
        retrospective:
          "Un 200 con `db_ok=false` es mentira operativa: el orquestador llena de tráfico una API ciega. El error clásico es confiar en `live=true` como ready o en grace 0 como “drain simbólico”. Pregunta: ¿por qué grace 0 no cuenta aunque `drained=true` esté hardcodeado en el log? Ese criterio viaja al You Do al documentar SIGTERM.",
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

def decide(probe_log):
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

def _grace_seconds(log):
    for part in log.split():
        if part.startswith("grace_seconds="):
            try:
                return int(part.split("=", 1)[1])
            except ValueError:
                return 0
    return 0

def decide(probe_log):
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
        title: "Stack sano con retries de app",
        preamble:
          "- **Contexto:** CASO-TRU-043-3A exige api/worker/db/caché healthy, retries a DB y redes front/back.\n- **Meta:** corregir predicado de stack.\n- **Éxito:** `S43-T3-A PASS`.\n- **Límites:** no mutes sets del fixture; no sustituyas retries por depends_on en la cabeza del learner.",
        instruction:
          "S43-T3-A-E1 · Salida: debe devolver el PASS del contrato. 1. DEFECT: PASS cuando el stack está roto.\n2. Exige REQUIRED ⊆ services, healthy==services, api_retries_db, front/back ⊆ networks.\n3. Conserva print.\n4. `S43-T3-A PASS`.",
        hint: "Relaciona los campos `services`, `healthy`, `api_retries_db`, `networks` con la regla explicada en S43-T3-A.",
        hints: [
          "Relaciona los campos `services`, `healthy`, `api_retries_db`, `networks` con la regla explicada en S43-T3-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva stack sano desde entorno limpio; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta networks → WAIT_FOR_DEPENDENCY", "adverso: healthy≠services / sin retries / red única → STOP_UNHEALTHY_STACK", "CASO-TRU-043-3A es sintético"],
        tests: "El fixture `CASO-TRU-043-3A` satisface un predicado de dominio real; imprime `S43-T3-A PASS` y el assert booleano pasa.",
        feedback:
          "Con los cuatro servicios healthy el happy path solo pasa si dejas de premiar el stack roto. Si no, STOP_UNHEALTHY_STACK se vuelve el “éxito” del print y el comando limpio de Trujillo miente.",
        retrospective:
          "Retries de aplicación son código de la API (backoff), no magia de Compose ni `restart_policy` del orquestador. El error clásico es healthy solo en db y declarar el stack “OK”. Pregunta: ¿qué token en el YAML demuestra retries de app y no solo orden de arranque? E2: válido / half healthy / networks ausente.",
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
        title: "Tres rutas de stack Compose",
        preamble:
          "- **Contexto:** sin mapa de redes no se espera a dependencias con criterio.\n- **Meta:** assess válido, adverso (solo db healthy, sin retries, red default) e incomplete.\n- **Éxito:** `PASS STOP_UNHEALTHY_STACK MISSING:networks`.\n- **Límites:** missing primero; no inventes front/back.",
        instruction:
          "S43-T3-A-E2 · Salida: debe devolver el PASS del contrato. 1. Corrige predicado invertido.\n2. Aplica regla de cuatro servicios + retries + redes.\n3. Conserva MISSING.\n4. Imprime las tres rutas.",
        hint: "Primero se calcula `missing`; ningún acceso a networks debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a networks debe ocurrir antes de esa rama.",
          "Después aplica la regla de S43-T3-A: cuatro servicios sanos, retries y redes segmentadas. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta networks → WAIT_FOR_DEPENDENCY", "adverso: healthy≠services / sin retries / red única → STOP_UNHEALTHY_STACK", "CASO-TRU-043-3A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `networks` ausente y produce exactamente `PASS STOP_UNHEALTHY_STACK MISSING:networks`.",
        feedback:
          "WAIT_FOR_DEPENDENCY es incertidumbre de topología (sin mapa de redes no sabes a quién esperar). STOP cierra stack half-healthy o sin retries. No inventes `front`/`back`: el compose debe declararlas o el “un comando limpio” de Trujillo es teatro.",
        retrospective:
          "Schema de redes antes de contenido evita perseguir un worker “unhealthy” cuando en realidad no sabes la topología. El error clásico es rellenar redes default y aprobar. Pregunta: si solo existe la red `default`, ¿qué exposición de DB no puedes acotar? Luego (E3): auditar texto de compose.yaml.",
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
        title: "Auditar texto de compose.yaml",
        preamble:
          "- **Contexto:** el artefacto del portfolio es el YAML (texto sintético), no el set de Python.\n- **Meta:** CONTINUE / STOP_UNHEALTHY_STACK / WAIT_FOR_DEPENDENCY.\n- **Éxito:** `CONTINUE STOP_UNHEALTHY_STACK WAIT_FOR_DEPENDENCY`.\n- **Límites:** compose vacío → WAIT; retries de app (`DB_MAX_ATTEMPTS` o `retries`), no solo depends_on.",
        instruction:
          "S43-T3-A-E3 · Salida: debe devolver el PASS del contrato. 1. None/vacío → WAIT_FOR_DEPENDENCY.\n2. Exige api/worker/db/caché + front/back + token de retries de app.\n3. BAD_COMPOSE → STOP.\n4. Imprime las tres decisiones.",
        hint: "Si `compose` es None o vacío, no inventes servicios: devuelve `WAIT_FOR_DEPENDENCY`.",
        hints: [
          "Si `compose` es None o vacío, no inventes servicios: devuelve `WAIT_FOR_DEPENDENCY`.",
          "Exige los cuatro servicios, redes front/back y un token de retries de **aplicación** (`DB_MAX_ATTEMPTS` o `retries`). Un restart_policy del orquestador no sustituye reintentos de la app a DB.",
        ],
        edgeCases: ["compose None/vacío → WAIT_FOR_DEPENDENCY", "adverso: falta worker o redes front/back o DB_MAX_ATTEMPTS → STOP_UNHEALTHY_STACK", "CASO-TRU-043-3A es sintético"],
        tests: "Compose bueno, incompleto y ausente prueban CONTINUE / STOP_UNHEALTHY_STACK / WAIT_FOR_DEPENDENCY.",
        feedback:
          "depends_on no sustituye backoff de la app. Aprobar YAML con solo api deja worker/DB/caché fuera del “un comando limpio” de CP-N4-A.",
        retrospective:
          "El YAML del portfolio es el artefacto auditado, no el set de Python del lab: `DB_MAX_ATTEMPTS` debe verse en el texto. El error clásico es confiar en `depends_on` o en `restart_policy` del orquestador como si reintentaran la conexión a DB. Pregunta: ¿por qué un stack con solo `api:` y red `default` no es un comando limpio de CP-N4-A?",
        starterCode: {
          language: 'python',
          title: "s43-t3-a-e3.py",
          code: `# CASO-TRU-043 · audit compose.yaml text (stack + app retries)
# DEFECT: None→CONTINUE; YAML incompleto se aprueba
# TAREA: corrige la condición defectuosa; no cambies los datos del fixture
GOOD_COMPOSE = """
services:
  api:
    networks: [front, back]
    depends_on: [db, cache]
    environment:
      DB_MAX_ATTEMPTS: "5"
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
BAD_COMPOSE = """
services:
  api: {}
  db: {}
networks:
  default: {}
"""

def decide(compose):
    if compose is None or not str(compose).strip():
        return "CONTINUE"
    # DEFECT: aprueba aunque falten worker, redes o retries de app
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
    networks: [front, back]
    depends_on: [db, cache]
    environment:
      DB_MAX_ATTEMPTS: "5"
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
BAD_COMPOSE = """
services:
  api: {}
  db: {}
networks:
  default: {}
"""

def decide(compose):
    if compose is None or not str(compose).strip():
        return "WAIT_FOR_DEPENDENCY"
    text = compose
    required_svcs = all(f"{name}:" in text for name in ("api", "worker", "db", "cache"))
    nets = "front:" in text and "back:" in text
    # Retries de aplicación (no solo depends_on ni restart_policy del orquestador)
    app_retries = "DB_MAX_ATTEMPTS" in text or "retries" in text.lower()
    ok = required_svcs and nets and app_retries
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
        title: "Expand compatible y restore",
        preamble:
          "- **Contexto:** CASO-TRU-043-3B exige expand, compat con código viejo, reset de efímeros y backup restaurado.\n- **Meta:** corregir predicado de migración.\n- **Éxito:** `S43-T3-B PASS`.\n- **Límites:** no mutes fixture; no marques restore True sin entender el drill.",
        instruction:
          "S43-T3-B-E1 · Salida: debe devolver el PASS del contrato. 1. DEFECT premia contract incompatible.\n2. Exige expand + old_ok + ephemeral_reset + backup_restored.\n3. Conserva print.\n4. `S43-T3-B PASS`.",
        hint: "Relaciona los campos `migration`, `old_code_compatible`, `ephemeral_reset`, `backup_restored` con la regla explicada en S43-T3-B.",
        hints: [
          "Relaciona los campos `migration`, `old_code_compatible`, `ephemeral_reset`, `backup_restored` con la regla explicada en S43-T3-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva migración y rollback de prueba; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta backup_restored → RUN_RESTORE_DRILL", "adverso: contract sin compat / sin restore / efímero mal clasificado → ROLL_BACK_MIGRATION", "CASO-TRU-043-3B es sintético"],
        tests: "El fixture `CASO-TRU-043-3B` satisface un predicado de dominio real; imprime `S43-T3-B PASS` y el assert booleano pasa.",
        feedback:
          "Con expand y restore True el happy path solo pasa si dejas de premiar el contract peligroso. Si no, ROLL_BACK_MIGRATION se imprime como “éxito” del status y el release de Trujillo avanza a ciegas.",
        retrospective:
          "Expand/contract es disciplina de compat con código en producción, no jerga de DBA. El error clásico es borrar columnas con código viejo vivo o marcar restore True sin drill. Pregunta: ¿qué pasa si `migration==\"contract\"` y `old_code_compatible` es False en un rolling deploy? E2: válido / contract malo / `backup_restored` ausente.",
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
        title: "Tres rutas de migración y restore",
        preamble:
          "- **Contexto:** sin flag de restore no se puede aprobar el drill de recuperación.\n- **Meta:** assess válido, adverso (contract, sin compat, sin reset, sin restore) e incomplete.\n- **Éxito:** `PASS ROLL_BACK_MIGRATION MISSING:backup_restored`.\n- **Límites:** missing primero; no inventes PASS de restore.",
        instruction:
          "S43-T3-B-E2 · Salida: debe devolver el PASS del contrato. 1. Corrige predicado invertido.\n2. Aplica expand + flags verdes.\n3. Conserva MISSING.\n4. Imprime las tres rutas.",
        hint: "Primero se calcula `missing`; ningún acceso a backup_restored debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a backup_restored debe ocurrir antes de esa rama.",
          "Después aplica la regla de S43-T3-B: expand compatible, efímero recreable y restore aprobado. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta backup_restored → RUN_RESTORE_DRILL", "adverso: contract sin compat / sin restore / efímero mal clasificado → ROLL_BACK_MIGRATION", "CASO-TRU-043-3B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `backup_restored` ausente y produce exactamente `PASS ROLL_BACK_MIGRATION MISSING:backup_restored`.",
        feedback:
          "RUN_RESTORE_DRILL es incertidumbre: sin flag no apruebas recuperación. ROLL_BACK cierra contract sin compat o sin reset de efímeros. No inventes PASS de restore: el drill debe ejecutarse y documentarse en el runbook de Trujillo.",
        retrospective:
          "Un release con restore “asumido” no es reproducible: no hay evidencia de recovery. El error clásico es leer `backup_restored` antes del check de schema y tumbar el assess. Pregunta: si el adverso trae `ephemeral_reset=False`, ¿qué datos estás a punto de tratar como desechables? Luego (E3): auditar runbook de texto.",
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
        title: "Auditar runbook de migración",
        preamble:
          "- **Contexto:** el portfolio pide runbook legible, no un bool en Python.\n- **Meta:** CONTINUE / ROLL_BACK_MIGRATION / RUN_RESTORE_DRILL.\n- **Éxito:** `CONTINUE ROLL_BACK_MIGRATION RUN_RESTORE_DRILL`.\n- **Límites:** runbook vacío → RUN_RESTORE_DRILL; rechaza ephemeral: db y restore SKIPPED.",
        instruction:
          "S43-T3-B-E3 · Salida: debe devolver el PASS del contrato. 1. None/vacío → RUN_RESTORE_DRILL.\n2. Exige strategy expand, old_code_compatible yes, restore PASS, sin ephemeral: db.\n3. BAD_RB → ROLL_BACK.\n4. Imprime las tres decisiones.",
        hint: "Si el runbook es None o vacío, no inventes restore: devuelve `RUN_RESTORE_DRILL`.",
        hints: [
          "Si el runbook es None o vacío, no inventes restore: devuelve `RUN_RESTORE_DRILL`.",
          "Exige strategy expand, old_code_compatible yes, backup_restore_drill PASS; rechaza ephemeral: db o contract sin compat.",
        ],
        edgeCases: ["runbook None/vacío → RUN_RESTORE_DRILL", "adverso: contract sin compat / restore SKIPPED / db efímero → ROLL_BACK_MIGRATION", "CASO-TRU-043-3B es sintético"],
        tests: "Runbook bueno, runbook adverso y ausencia prueban CONTINUE / ROLL_BACK_MIGRATION / RUN_RESTORE_DRILL.",
        feedback:
          "Un restore SKIPPED no es “después lo vemos”: es no-go. DB en ephemeral rompe el rollback y el recovery de la plataforma de Trujillo.",
        retrospective:
          "Un restore SKIPPED no es deuda menor: es no-go de promoción. El error clásico es aprobar contract sin compat o `ephemeral: db` “porque el compose es de lab”. Pregunta: ¿por qué db en ephemeral rompe el rollback aunque el strategy diga expand? Ese criterio se defiende en el You Do del runbook.",
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

def decide(runbook):
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

def decide(runbook):
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
        title: "Lock hasheado y runtime slim",
        preamble:
          "- **Contexto:** CASO-TRU-043-4A exige lock `sha256:…`, stages builder+runtime, sin compiler en runtime y deps locked.\n- **Meta:** corregir predicado multi-stage.\n- **Éxito:** `S43-T4-A PASS`.\n- **Límites:** no mutes fixture; no aceptes lock `latest` como pin.",
        instruction:
          "S43-T4-A-E1 · Salida: debe devolver el PASS del contrato. 1. DEFECT premia unlock o compiler en runtime.\n2. Exige startswith sha256, stages ⊇ {builder,runtime}, not compiler, runtime_deps_locked.\n3. Conserva print.\n4. `S43-T4-A PASS`.",
        hint: "Relaciona los campos `lock_hash`, `stages`, `runtime_deps_locked`, `compiler_in_runtime` con la regla explicada en S43-T4-A.",
        hints: [
          "Relaciona los campos `lock_hash`, `stages`, `runtime_deps_locked`, `compiler_in_runtime` con la regla explicada en S43-T4-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva lock verificado e imagen runtime reducida; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta runtime_deps_locked → REGENERATE_LOCK", "adverso: lock flotante / compiler en runtime / sin builder → BLOCK_UNPINNED_BUILD", "CASO-TRU-043-4A es sintético"],
        tests: "El fixture `CASO-TRU-043-4A` satisface un predicado de dominio real; imprime `S43-T4-A PASS` y el assert booleano pasa.",
        feedback:
          "Con lock sha256 y runtime sin compiler el happy path solo pasa si dejas de premiar el build flotante. Si no, BLOCK_UNPINNED_BUILD se imprime como “PASS” y la supply chain de Trujillo no es reproducible.",
        retrospective:
          "Pin + multi-stage es disciplina de supply chain local: el builder no viaja a prod. El error clásico es gcc en la imagen final “por si depuramos”. Pregunta: ¿qué viaja a prod si solo hay stage runtime con `apt install gcc`? E2: válido / latest+compiler / `runtime_deps_locked` ausente.",
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
        title: "Tres rutas de lock multi-stage",
        preamble:
          "- **Contexto:** sin flag de deps locked no se regenera el lock con criterio.\n- **Meta:** assess válido, adverso (latest, solo runtime, compiler) e incomplete.\n- **Éxito:** `PASS BLOCK_UNPINNED_BUILD MISSING:runtime_deps_locked`.\n- **Límites:** missing primero; no inventes sha256.",
        instruction:
          "S43-T4-A-E2 · Salida: debe devolver el PASS del contrato. 1. Corrige predicado invertido.\n2. Aplica regla de pin + stages + no compiler + locked.\n3. Conserva MISSING.\n4. Imprime las tres rutas.",
        hint: "Primero se calcula `missing`; ningún acceso a runtime_deps_locked debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a runtime_deps_locked debe ocurrir antes de esa rama.",
          "Después aplica la regla de S43-T4-A: lock con hash y runtime sin toolchain. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta runtime_deps_locked → REGENERATE_LOCK", "adverso: lock flotante / compiler en runtime / sin builder → BLOCK_UNPINNED_BUILD", "CASO-TRU-043-4A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `runtime_deps_locked` ausente y produce exactamente `PASS BLOCK_UNPINNED_BUILD MISSING:runtime_deps_locked`.",
        feedback:
          "REGENERATE_LOCK es incertidumbre de pin: sin `runtime_deps_locked` no inventes `sha256:`. BLOCK cierra latest, un solo stage o compiler en runtime. En Trujillo un build flotante hoy no es el de mañana aunque el Dockerfile “se vea igual”.",
        retrospective:
          "Regenerar el lock con evidencia es distinto de bloquear un breach de toolchain en la imagen final. El error clásico es hardcodear `sha256:abc` del demo. Pregunta: si solo existe stage `runtime` con gcc, ¿qué superficie y qué reproducibilidad pierdes? Luego (E3): parsear multi-stage real en texto.",
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
        title: "Auditar multi-stage y lock",
        preamble:
          "- **Contexto:** el Dockerfile del portfolio es el artefacto auditado en CI (texto sintético, sin daemon).\n- **Meta:** CONTINUE / BLOCK_UNPINNED_BUILD / REGENERATE_LOCK.\n- **Éxito:** `CONTINUE BLOCK_UNPINNED_BUILD REGENERATE_LOCK`.\n- **Límites:** lock None → REGENERATE; busca gcc solo en el tramo runtime; exige COPY --from=builder.",
        instruction:
          "S43-T4-A-E3 · Salida: debe devolver el PASS del contrato. 1. lock_hash None → REGENERATE_LOCK.\n2. ok = pin sha256 + builder + runtime + COPY --from + sin gcc/g++ en runtime.\n3. BAD_DF + latest → BLOCK.\n4. Imprime las tres decisiones.",
        hint: "Si `lock_hash` es None, no inventes pin: devuelve `REGENERATE_LOCK`.",
        hints: [
          "Si `lock_hash` es None, no inventes pin: devuelve `REGENERATE_LOCK`.",
          "Localiza el tramo tras `AS runtime` y verifica que no contenga gcc/g++; exige AS builder, AS runtime y COPY --from=builder.",
        ],
        edgeCases: ["lock_hash None → REGENERATE_LOCK", "adverso: lock latest / gcc en runtime / sin builder → BLOCK_UNPINNED_BUILD", "CASO-TRU-043-4A es sintético"],
        tests: "Dockerfile multi-stage limpio, Dockerfile con compiler en runtime y lock ausente prueban CONTINUE / BLOCK_UNPINNED_BUILD / REGENERATE_LOCK.",
        feedback:
          "Toolchain en runtime infla superficie y rompe slim. Un solo stage “para ir más rápido” deja gcc en la imagen final que promociona Trujillo.",
        retrospective:
          "`COPY --from=builder` es el puente: el toolchain se queda en el stage de build. El error clásico es un solo stage “para ir más rápido” o lock `latest` disfrazado de pin. Pregunta: ¿por qué un tag flotante no es auditable entre dos builds del mismo día?",
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

def decide(dockerfile, lock_hash):
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

def decide(dockerfile, lock_hash):
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
        title: "Scan limpio y límites > 0",
        preamble:
          "- **Contexto:** CASO-TRU-043-4B exige 0 CVE crítico, 0<mem≤512, 0<cpu≤1.0, sin debug shell y logs redactados.\n- **Meta:** corregir el gate invertido de deploy.\n- **Éxito:** `S43-T4-B PASS`.\n- **Límites:** no mutes fixture; límite 0 no es válido; sin secretos/PII en logs de demo.",
        instruction:
          "S43-T4-B-E1 · Salida: debe devolver el PASS del contrato. 1. DEFECT: `meets_contract` es True en estados de quarantine.\n2. Cámbialo a CVE==0 y límites estrictamente positivos en rango + not debug_shell + logs_redacted.\n3. Conserva print.\n4. `S43-T4-B PASS`.",
        hint: "Relaciona los campos `critical_cves`, `memory_limit_mb`, `cpu_limit`, `debug_shell`, `logs_redacted` con la regla explicada en S43-T4-B.",
        hints: [
          "Relaciona los campos `critical_cves`, `memory_limit_mb`, `cpu_limit`, `debug_shell`, `logs_redacted` con la regla explicada en S43-T4-B.",
          "El predicado correcto exige CVE==0, límites > 0 en rango, sin debug shell y logs redactados. Un límite 0 no es «sin tope válido».",
        ],
        edgeCases: ["falta logs_redacted → TRIAGE_SCAN_FINDING", "adverso: CVE crítico / límites 0 / debug shell / logs crudos → QUARANTINE_IMAGE", "CASO-TRU-043-4B es sintético"],
        tests: "El fixture `CASO-TRU-043-4B` satisface un predicado de dominio real; imprime `S43-T4-B PASS` y el assert booleano pasa.",
        feedback:
          "Con CVE 0 y 512/1.0 el happy path solo pasa si dejas de premiar el mal estado. Si no, QUARANTINE_IMAGE se imprime como si fuera PASS y el gate de promoción de Trujillo se vacía.",
        retrospective:
          "Límite 0 es unlimited disfrazado: no hay presupuesto que auditar. El error clásico es shell root “solo para debug” en la imagen de prod. Pregunta: ¿por qué un CVE crítico y mem 0 comparten el mismo no-go de deploy? E2: válido / CVE+límites 0 / `logs_redacted` ausente.",
        starterCode: {
          language: 'python',
          title: "s43-t4-b-e1.py",
          code: `# CASO-TRU-043 · CVE scan + debug shell + logs + límites > 0
# DEFECT: PASS si CVE>0, límite 0, debug shell o logs sin redact
# TAREA: corrige la condición defectuosa; no cambies los datos del fixture
record = {"case_id": "CASO-TRU-043-4B", **{"critical_cves":0,"memory_limit_mb":512,"cpu_limit":1.0,"debug_shell":False,"logs_redacted":True}}
# DEFECT: invierte el gate (aprueba estados que deben quarantine)
meets_contract = (
    record["critical_cves"] > 0
    or record["memory_limit_mb"] == 0
    or record["cpu_limit"] == 0
    or record["debug_shell"]
    or not record["logs_redacted"]
)
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
        title: "Tres rutas de scan y límites",
        preamble:
          "- **Contexto:** sin evidencia de logs redactados no se tria un finding de scan con ética.\n- **Meta:** assess válido, adverso (3 CVE, mem/cpu 0, shell, logs crudos) e incomplete.\n- **Éxito:** `PASS QUARANTINE_IMAGE MISSING:logs_redacted`.\n- **Límites:** missing primero; no inventes CRITICAL: 0.",
        instruction:
          "S43-T4-B-E2 · Salida: debe devolver el PASS del contrato. 1. Corrige el bad_ok invertido del starter.\n2. Aplica CVE==0 + límites en rango + not shell + logs_redacted.\n3. Conserva MISSING.\n4. Imprime las tres rutas.",
        hint: "Primero se calcula `missing`; ningún acceso a logs_redacted debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a logs_redacted debe ocurrir antes de esa rama.",
          "Después aplica la regla de S43-T4-B: 0 CVE crítico, 0 < mem ≤ 512, 0 < cpu ≤ 1.0, sin debug shell y logs redactados. El fixture adverso (incl. límites 0) debe fallar por contenido.",
        ],
        edgeCases: ["falta logs_redacted → TRIAGE_SCAN_FINDING", "adverso: CVE crítico / límites 0 / debug shell / logs crudos → QUARANTINE_IMAGE", "CASO-TRU-043-4B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `logs_redacted` ausente y produce exactamente `PASS QUARANTINE_IMAGE MISSING:logs_redacted`.",
        feedback:
          "TRIAGE_SCAN_FINDING es incertidumbre de logs; QUARANTINE es breach de CVE, límite 0 o shell. No inventes CRITICAL: 0: el reporte debe medirlo.",
        retrospective:
          "Sin evidencia de logs redactados no trias un finding sin filtrar secretos/PII. El error clásico es inventar `logs_redacted=True` para pasar el assess. Pregunta: si el adverso trae mem=0 y 3 CVE, ¿por qué un solo código de breach basta? Luego (E3): parsear reporte de scan en texto.",
        starterCode: {
          language: 'python',
          title: "s43-t4-b-e2.py",
          code: `# CASO-TRU-043 · assess QUARANTINE_IMAGE
# DEFECT: PASS con CVE, límites 0, debug shell o logs crudos
# TAREA: corrige la condición defectuosa; no cambies los datos del fixture
def assess(record: dict) -> str:
    required = {"case_id", "critical_cves", "memory_limit_mb", "cpu_limit", "debug_shell", "logs_redacted"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    # DEFECT: aprueba estados que deben quarantine (incl. límites 0)
    bad_ok = (
        record["critical_cves"] > 0
        or record["memory_limit_mb"] == 0
        or record["cpu_limit"] == 0
        or record["debug_shell"]
        or not record["logs_redacted"]
    )
    return "PASS" if bad_ok else "QUARANTINE_IMAGE"

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
        title: "Auditar reporte de scan y límites",
        preamble:
          "- **Contexto:** el gate de promoción en Trujillo lee un reporte de CI, no un dict de lab.\n- **Meta:** CONTINUE / QUARANTINE_IMAGE / TRIAGE_SCAN_FINDING.\n- **Éxito:** `CONTINUE QUARANTINE_IMAGE TRIAGE_SCAN_FINDING`.\n- **Límites:** reporte vacío → TRIAGE; parsea números; límite 0 no es “sin tope válido”.",
        instruction:
          "S43-T4-B-E3 · Salida: debe devolver el PASS del contrato. 1. None/vacío → TRIAGE_SCAN_FINDING.\n2. Parsea CRITICAL, memory_limit_mb, cpu_limit; exige 0 CVE, límites en rango, debug false, logs true.\n3. BAD_SCAN → QUARANTINE.\n4. Imprime las tres decisiones.",
        hint: "Si el reporte es None o vacío, no inventes hallazgos: devuelve `TRIAGE_SCAN_FINDING`.",
        hints: [
          "Si el reporte es None o vacío, no inventes hallazgos: devuelve `TRIAGE_SCAN_FINDING`.",
          "Parsea CRITICAL, memory_limit_mb y cpu_limit como números; exige CRITICAL==0, límites estrictamente positivos en rango, debug_shell false y logs_redacted true.",
        ],
        edgeCases: ["reporte None/vacío → TRIAGE_SCAN_FINDING", "adverso: CVE crítico / límites 0 / debug shell / logs crudos → QUARANTINE_IMAGE", "CASO-TRU-043-4B es sintético"],
        tests: "Reporte bueno, reporte adverso y ausencia prueban CONTINUE / QUARANTINE_IMAGE / TRIAGE_SCAN_FINDING.",
        feedback:
          "Cuarentena es la respuesta correcta a CVE crítico o shell root. CONTINUE con CRITICAL: 3 rompe el puente a S44: el pipeline promocionaría basura.",
        retrospective:
          "El reporte de CI es el artefacto que S44 leerá: parsear números, no confiar en el “look” del texto. El error clásico es CONTINUE con CRITICAL: 3 o mem 0 “para no OOM en lab”. Pregunta: ¿por qué mem 0 y un CVE crítico fallan el mismo gate de deploy?",
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

def decide(scan_report):
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

def _field(report, key):
    for line in report.splitlines():
        line = line.strip()
        if line.startswith(key + ":"):
            return line.split(":", 1)[1].strip()
    return None

def decide(scan_report):
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
    context: "Governed Python Service Platform reproducible. Trabaja sobre API, worker, base y caché locales de una plataforma ficticia en Trujillo. Entrada: código fijado, locks, configuración no secreta y secretos inyectados en runtime. Salida: imágenes mínimas, servicios sanos y recuperación documentada con un comando. El gate se bloquea si hay imagen mutable, proceso root, health check falso o migración no reversible.",
    objectives: [
      "Convertir código fijado, locks, configuración no secreta y secretos inyectados en runtime en imágenes mínimas, servicios sanos y recuperación documentada con un comando.",
      "Demostrar el gate: build repetible, usuario no root, límites de recursos y shutdown limpio pasan en entorno nuevo.",
      "Probar el fallo: imagen mutable, proceso root, health check falso o migración no reversible.",
      "Entregar evidencia reproducible, redactada, sin PII real, secretos ni servicios externos obligatorios.",
    ],
    requirements: [
      "Usa exclusivamente fixtures sintéticos identificados por `CASO-TRU-043`.",
      "Incluye Dockerfile multi-stage fijado (base → deps → app → USER ≥1000 → CMD; digest o tag no latest).",
      "Incluye Compose con API/worker/DB/caché, health checks y redes segmentadas.",
      "Incluye configuración, secretos y volumes documentados (secretos solo runtime; DB durable; caché efímero).",
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

def readiness(bundle):
    missing = [name for name in REQUIRED if bundle.get(name) is not True]
    return ("READY", []) if not missing else ("BLOCKED", missing)

def gate_case(kind):
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
    portfolioNote: "Evidencia de CP-N4-A · servicio reproducible en contenedores: muestra baseline, decisión, pruebas, resultado medido, rollback y riesgo residual. La checklist inicia en BLOCKED por diseño; conviértela en READY enlazando artefactos reales (Dockerfile, compose.yaml, runbook), no cambiando asserts a True sin archivo. READY exige esos tres artefactos firmados, no booleans mágicos.",
    rubric: [
      { criterion: "Corrección técnica del contrato y gate.", weight: "25%" },
      { criterion: "Pruebas normal/breach/uncertain y recuperación.", weight: "20%" },
      { criterion: "Seguridad, privacidad y least privilege.", weight: "15%" },
      { criterion: "Reproducibilidad, lineage y evidencia.", weight: "15%" },
      { criterion: "Operación: SLO, observabilidad y rollback.", weight: "15%" },
      { criterion: "Comunicación de trade-offs y límites.", weight: "10%" },
    ],
    retrospective:
      "Antes de marcar listo: (1) ¿qué evidencia demuestra build repetible + non-root + límites > 0 + shutdown limpio en entorno nuevo? (2) ¿qué harías distinto con secretos reales vs. sintéticos (inyección runtime, nunca capas)? (3) Escribe en el README una frase de impacto medible (p. ej. “rebuild de app sin re-resolver deps; restore drill PASS”) defendible en 30 segundos ante un lead de plataforma. Residual: sin cluster k8s, el Compose local no prueba autoscaling — documenta el límite.",
  },
  selfCheck: {
    questions: [
      {
        question: "¿Qué evidencia permite aprobar `Dockerfile, layers y caché` en CASO-TRU-043?",
        options: ["un print sin assert ni versión", "una captura de pantalla sin fuente", "dos builds con el mismo lock producen el mismo digest lógico de deps", "datos personales reales para que parezca auténtico"],
        correctIndex: 2,
        explanation: "La teoría exige que dos builds con el mismo lock produzcan el mismo digest lógico de deps; evidencia decorativa o PII no satisface el contrato.",
      },
      {
        question: "Si el health check no prueba readiness real o el proceso corre como root, ¿qué respuesta preserva seguridad y auditabilidad?",
        options: ["emitir el código de breach del subtema (p. ej. `REBUILD_NONROOT` o `DRAIN_AND_ISOLATE`) y conservar evidencia", "continuar y ocultar el warning", "inventar evidencia faltante", "borrar el trace para reducir ruido"],
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
        options: ["maximiza el caché: solo app cambia y deps no se re-resuelven", "es obligatorio para non-root", "invalida el caché de deps en cada commit de código (reorder a deps_before_app)", "garantiza el mismo digest aunque el lock cambie"],
        correctIndex: 2,
        explanation: "Layers deben ir de estable a cambiante: deps/lock antes de app; copiar source primero rompe el caché de dependencias.",
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
        note: "Builder vs. runtime",
      },
      {
        label: "Docker best practices",
        url: "https://docs.docker.com/build/building/best-practices/",
        note: "Caché, non-root y tamaño",
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
        note: "Scan de CVE en imágenes",
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
