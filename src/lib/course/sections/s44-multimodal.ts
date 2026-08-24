import type { CourseSection } from '../../types'

export const section44: CourseSection = {
  id: "multimodal",
  index: 44,
  title: "CI/CD y seguridad de la cadena de suministro",
  shortTitle: "CI/CD supply chain",
  tagline: "pipeline que bloquea dependencia insegura o test crítico, publica artefacto verificable y demuestra rollback",
  estimatedHours: 9,
  level: "Producción gobernada",
  phase: 3,
  icon: "GitBranch",
  accentColor: "bg-gradient-to-br from-amber-500 to-red-600",
  jobRelevance:
    "En equipos de plataforma y producto en Perú y LatAm, CI/CD y seguridad de la cadena de suministro es lo que separa un deploy «que funcionó anoche» de un release defendible ante auditoría. Aquí aprendes a entregar un artefacto verificable (digest o hash del binario, SBOM o inventario de componentes, provenance o trazabilidad de quién construyó qué), con aprobación independiente y rollback demostrado en staging dentro del RTO (objetivo de tiempo de recuperación). Cuando un lead de ops en Piura pregunta «¿podemos promover?», tu respuesta es «mismo digest testeado, attestation válida, canary bajo umbral o rollback ensayado», no «el README dice OK».",
  learningOutcomes: [
    { text: "Diseñar una matriz CI (lint → types → tests) sobre runtimes soportados y fallar cerrado si un check crítico queda rojo." },
    { text: "Tratar caches como optimización y artifacts (con digest/retención) como evidencia verificable del build." },
    { text: "Aplicar least privilege, pin de actions por SHA completo y secret scanning antes de publicar." },
    { text: "Producir SBOM + provenance enlazados al mismo digest y rechazar attestation divergente." },
    { text: "Promover entre environments solo con aprobación independiente y sin rebuild del artefacto testeado." },
    { text: "Ejecutar canary con umbral de error y demostrar rollback al digest previo dentro del RTO." },
    { text: "Exigir branch protection, reviews/checks y release notes operables (cambio, riesgo, migración, rollback)." },
    { text: "Clasificar fallos críticos con bloqueo, logs redactados, dueño y evidencia retenida (no continue-on-error silencioso)." },
  ],
  theory: [
    {
            heading: "¿De dónde salió exactamente lo que está corriendo en producción?",
      paragraphs: [
        "Es una pregunta razonable y, en la mayoría de los equipos, nadie sabe responderla con precisión. Se sabe qué repositorio, más o menos qué commit, probablemente qué versión de las dependencias. «Más o menos» y «probablemente» son suficientes hasta el día en que una librería resulta comprometida y hay que decir, con nombre y fecha, qué se construyó con ella.",
        "Piensa en la etiqueta de un alimento envasado. No dice solo «galletas»: dice qué lleva, quién lo hizo, en qué planta y en qué fecha. Eso no mejora el sabor — sirve para que, si aparece un problema con un ingrediente, se pueda retirar exactamente lo afectado en lugar de vaciar el supermercado. Un **SBOM** (*Software Bill of Materials*) es esa etiqueta: el inventario de todo lo que entró en tu artefacto.",
        "La etiqueta sola no basta si cualquiera puede reimprimirla. Por eso el artefacto se identifica por **digest** —una huella criptográfica del contenido, no una etiqueta como `latest` que alguien puede reapuntar mañana— y por eso las dependencias se fijan por SHA inmutable en lugar de por rango de versión. Y por eso existe la **provenance**: un registro firmado de quién construyó qué, con qué entradas y en qué máquina.",
        "El otro lado de la cadena es el permiso. Un workflow de integración continua suele tener acceso a más de lo que necesita, y ese exceso es lo que convierte un script comprometido en un incidente. El principio es aburrido y funciona: cada paso recibe el permiso mínimo para hacer su trabajo, y nada más.",
        "La pregunta que atraviesa la sección es de auditoría: **¿puedo demostrar, sin confiar en mi memoria, de dónde salió esto?** Y su corolario práctico — si algo sale mal, ¿puedo volver atrás sin rehacer el camino a mano? Modelas los contratos con la biblioteca estándar sobre `CASO-PIU-044`, un repositorio sintético de operaciones en Piura, sin registro remoto obligatorio ni secretos reales.",
      ],
      callout: {
        type: "info",
        title: "Gate de promoción",
        content: "Promociona solo con asserts locales en verde, digest verificable y evidencia retenida. Si falta evidencia o un check crítico falla, el gate se queda en bloqueo.",
      },
    },
    {
      heading: "Contrato de la sección (referencia)",
      optional: true,
      paragraphs: [
        "Bloque de referencia. Reúne el entregable, el orden de los subtemas y los criterios de promoción.",
        "**Producto incremental.** Un pipeline con controles de cadena de suministro que un auditor podría re-ejecutar. Recibes un commit revisado, dependencias fijadas por lockfile y un workflow con permisos mínimos. Entregas un artefacto identificado por digest, su SBOM, su provenance y evidencia de promoción y rollback. El gate bloquea si un test crítico está rojo, si un secreto aparece en logs, si una dependencia insegura no está fijada o si falta la attestation.",
        "**Orden de los subtemas.** T1 arma las matrices de verificación. T2 pasa a permisos, secretos y SBOM. T3 cubre entornos, canary y rollback. T4 cierra con protección de ramas y fallos auditables.",
      ],
      code: {
        language: 'python',
        title: "s44_map_contract.py",
        code: `def section_contract():
    return {
        "case": "CASO-PIU-044",
        "gates": ["critical_tests_green", "sbom_provenance", "approval_then_rollback_demo"],
        "supply_chain_cicd": True,
        "unpinned_vuln_dep_ok": False,
    }

c = section_contract()
print("case", c["case"])
print("supply_chain_cicd", c["supply_chain_cicd"])
print("unpinned_vuln_dep_ok", c["unpinned_vuln_dep_ok"])
`,
        output: `case CASO-PIU-044
supply_chain_cicd True
unpinned_vuln_dep_ok False`,
      },
    },
    {
      heading: "lint/types/tests y matrices",
      figure: {
        id: "S44-permission-scope",
        caption:
          "Un tag como v4 se puede mover; el SHA no. Esa es toda la diferencia entre un pin y una esperanza.",
        alt:
          "Tres guardas sobre el permiso del workflow, el del job de release y el pin de la action.",
      },
      subtopicId: "S44-T1-A",
      paragraphs: [
        "Un pipeline de supply chain no empieza publicando: empieza **certificando el código**. CI ejecuta checks **rápidos antes de costosos** (lint → types → tests) para fallar barato. La **matriz** solo cubre runtimes/OS que el equipo realmente soporta (p. ej. Python 3.11 y 3.12), no una combinatoria infinita que gasta minutos y oculta la señal. Un test verde sin logs ni artifact no es gate: es un semáforo sin evidencia. El dict del lab mapea claves de un workflow real (`on`, `permissions`, `matrix`, `steps`).",
        "Contrato de CI rápido. Entrada: commit con lockfile y lista de runtimes soportados. Salida: `lint`, `types` y `tests` en **AND** sobre exactamente la matriz soportada. Error de gate: un check rojo o una versión fuera de matriz → `FAIL_CI_GATE`. Incertidumbre: falta el campo `supported` → `REVIEW_MATRIX`. Este subtema no publica artefactos; solo certifica que el código es apto para los pasos costosos de supply chain.",
        "En `CASO-PIU-044-1A` el repo de ops de Piura declara la matriz `{'3.11','3.12'}` y los pasos `lint/typecheck/test`. El PR solo avanza si los tres checks pasan y la matriz ejecutada coincide con la soportada. Si falta `supported`, no se asume “todo OK”: se deriva a revisión de matriz. Sin secretos reales ni PII; la evidencia son los logs retenidos del job.",
      ],
      code: {
        language: 'python',
        title: "lint_types_tests_matrix.py",
        code: `# Superficie real de un workflow GHA modelada en dict (stdlib).
# Equivale a:
#   on: [pull_request, push]
#   permissions: { contents: read }
#   strategy.matrix.python: [3.11, 3.12]
#   steps: lint → typecheck → test  (barato → caro)
def ci_plan(py_versions, steps, fail_fast=True):
    return {
        "on": ["pull_request", "push"],
        "permissions": {"contents": "read"},
        "strategy": {"matrix": {"python": list(py_versions)}, "fail-fast": fail_fast},
        "steps": list(steps),
    }

p = ci_plan(["3.11", "3.12"], ["lint", "typecheck", "test"])
print("matrix", p["strategy"]["matrix"]["python"])
print("steps", p["steps"])
print("permissions", p["permissions"])`,
        output: `matrix ['3.11', '3.12']
steps ['lint', 'typecheck', 'test']
permissions {'contents': 'read'}`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content: "Evidencia mínima de S44-T1-A: Lint, types y tests en AND sobre la matriz soportada. Un check rojo o una versión fuera de matriz → `FAIL_CI_GATE`; sin `supported` → `REVIEW_MATRIX`.",
      },
    },
    {
      heading: "caches, artifacts y condiciones",
      figure: {
        id: "S44-supply-chain",
        caption:
          "Rápidos antes que costosos, y el token con contents: read hasta el job que realmente publica.",
        alt:
          "Cinco etapas de lint a publicar, con la frontera del permiso de escritura tras los tests.",
      },
      subtopicId: "S44-T1-B",
      paragraphs: [
        "La **caché** acelera las instalaciones (pip/npm), pero **no es fuente de verdad**: un `cache hit` no prueba que el build sea reproducible. El **artifact** (wheel, SBOM, logs) lleva digest y retención porque es la evidencia que otro job o auditor puede re-descargar. Las **condiciones** del workflow (`if:`, filtros de branch/tag/fork) deben cubrir los caminos de release; un tag de prod sin los mismos gates que `main` es un atajo peligroso.",
        "Contrato de evidencia de build. Entrada: clave de cache ligada al lockfile, flag de que un cache miss aún produce resultado correcto, digest del artifact y política de retención, más cobertura de condiciones en tags. Salida: cache opcional + artifact verificable (`sha256:…`, retención ≥ 7 días) + condiciones completas. Breach: cache global sin lock, digest `latest`, retención 0 o tags sin gates → `DISCARD_PIPELINE_RESULT`. Incertidumbre: falta `conditions_cover_tags` → `INSPECT_WORKFLOW_CONDITION`.",
        "En `CASO-PIU-044-1B` el equipo de Piura usa `cache_key` prefijado con `lock-` (derivado del hash del lockfile). Si la cache falla, el job sigue y produce el wheel con digest; solo entonces se adjunta el artifact. Publicar un artifact sin digest o omitir gates en tags de release se trata como resultado no confiable.",
      ],
      code: {
        language: 'python',
        title: "caches_artifacts_conditions.py",
        code: `def cache_key(lock_hash: str) -> str:
    """Clave ligada al lockfile: la cache no es fuente de verdad."""
    return f"lock-{lock_hash[:8]}"

def publish_if(success: bool, digest: str, retention_days: int) -> dict:
    """Solo publica artifact verificable si el job tuvo éxito."""
    ok = success and digest.startswith("sha256:") and retention_days >= 7
    return {
        "cache_key": cache_key("abcdef12deadbeef"),
        "artifacts": [{"name": "wheel", "digest": digest}] if ok else [],
        "if": "on_success" if success else "skip",
        "publishable": ok,
    }

r = publish_if(True, "sha256:def", 14)
print("cache_key", r["cache_key"])
print("artifacts", r["artifacts"])
print("publishable", r["publishable"])`,
        output: `cache_key lock-abcdef12
artifacts [{'name': 'wheel', 'digest': 'sha256:def'}]
publishable True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content: "Antes de promover S44-T1-B, La caché acelera; el artifact con digest y retención es la evidencia. Tags de release sin los mismos gates que `main` → `DISCARD_PIPELINE_RESULT`.",
      },
    },
    {
      heading: "permisos mínimos, pinning y secret scanning",
      subtopicId: "S44-T2-A",
      paragraphs: [
        "El token del workflow es un **atacante en potencia** si tiene write amplio. Least privilege empieza en `permissions:` (p. ej. `contents: read`) y solo eleva en jobs que publican. Las **actions** de terceros se pinnan por **SHA completo de commit** (40 hex), no por tag flotante `v4` ni stub corto: el tag se puede mover; el SHA no. **Secret scanning** (gitleaks u equivalente) bloquea si hay hits en el diff o en logs. Lee el esqueleto YAML de abajo: es la superficie real de GitHub Actions modelada aquí con stdlib.",
        "Contrato de endurecimiento del workflow. Entrada: mapa de permisos del token, referencia de action, conteo de secret hits y flag de dependency review. Salida: los permisos declarados **a nivel de workflow** ⊆ {read, none}, action pinned por SHA de 40 hex, `secret_hits == 0` y review de deps. El alcance importa: la regla acota el permiso **por defecto** que hereda todo job, no prohíbe que un job de release declare `contents: write` para sí mismo. Esa es justamente la forma de least privilege que se busca — el techo bajo por defecto, la excepción explícita y acotada al job que la necesita. Breach (write amplio, pin ausente, secreto en logs) → `REVOKE_AND_ROTATE`. Incertidumbre: falta `dependency_review` → `SECURITY_APPROVAL`.",
        "En `CASO-PIU-044-2A` el workflow de Piura usa `contents: read` y `actions/checkout@` + SHA de 40 hex (p. ej. `b4ffde65…`). Si un job de release necesita `write`, se declara solo en ese job — no a nivel de workflow. Un tag `@v4` o un stub corto no cuenta como pin. Un `secret_hits > 0` obliga a rotar credenciales antes de reintentar el pipeline; no se “limpia el log” a mano para pasar el scan.",
      ],
      code: {
        language: 'python',
        title: "min_perms_pin_secret_scan.py",
        code: `# Esqueleto GHA (YAML como string) — pin por SHA completo, least privilege
MINI_WORKFLOW = """
name: piura-ops-ci
on: [pull_request]
permissions:
  contents: read
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11
      - name: secret-scan
        run: echo gitleaks-stub-ok
"""

def workflow_security(yaml_text: str) -> dict:
    pin_ok = False
    for line in yaml_text.splitlines():
        if "uses:" in line and "@" in line:
            ref = line.split("@")[-1].strip()
            pin_ok = len(ref) == 40 and all(
                c in "0123456789abcdef" for c in ref.lower()
            )
    # bloque permissions: antes de jobs — sin write amplio
    perms_block = yaml_text.split("permissions:")[-1].split("jobs:")[0]
    min_perms = "contents: read" in perms_block and "write" not in perms_block
    secret_scan = "secret-scan" in yaml_text or "gitleaks" in yaml_text
    return {"min_perms": min_perms, "pinned": pin_ok, "secret_scan": secret_scan}

s = workflow_security(MINI_WORKFLOW)
print("min_perms", s["min_perms"])
print("pinned", s["pinned"])
print("secret_scan", s["secret_scan"])`,
        output: `min_perms True
pinned True
secret_scan True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content: "La revisión de S44-T2-A conserva que Permisos ⊆ {read, none}, pin por SHA de 40 hex y cero secret hits. Write amplio, tag flotante o secreto en logs → `REVOKE_AND_ROTATE`.",
      },
    },
    {
      heading: "SBOM, provenance y attestations",
      subtopicId: "S44-T2-B",
      paragraphs: [
        "El **SBOM** (SPDX/CycloneDX) enumera componentes y versiones del artefacto. La **provenance** (estilo SLSA) enlaza fuente → build → subject digest: quién construyó qué y con qué inputs. Una **attestation** firmada permite verificar esa cadena; no “garantiza calidad” por sí sola, pero sí impide promover un binario huérfano de evidencia. Publicar sin attestation o con SBOM de otro build rompe la cadena de suministro.",
        "Contrato de integridad. Entrada: digest del artefacto y digests referenciados por SBOM/provenance, más flag de attestation válida. Salida: `provenance_ok` solo si artifact, SBOM y subject de provenance son el **mismo** digest y la attestation es válida. Error: digests divergentes o attestation inválida → `REJECT_ATTESTATION`. Incertidumbre: falta `attestation_valid` → `REBUILD_PROVENANCE`.",
        "En `CASO-PIU-044-2B` el build de Piura genera un SBOM con 3 paquetes sintéticos y provenance GHA apuntando a `sha256:aaa`. Si el wheel promovido lleva otro digest, el gate rechaza aunque el README diga “OK”. Anti-patrón frecuente: copiar el SBOM del build anterior “porque casi es el mismo” — rompe la cadena. Evidencia SLSA-style: digests iguales y medibles, no confianza por narrativa.",
      ],
      code: {
        language: 'python',
        title: "sbom_provenance_attest.py",
        code: `def sbom_summary(components: list, fmt="spdx") -> dict:
    return {"sbom": fmt, "pkgs": len(components), "prov": "gha"}

def provenance_ok(artifact_digest: str, sbom_digest: str, subject: str) -> bool:
    return bool(artifact_digest) and len({artifact_digest, sbom_digest, subject}) == 1

s = sbom_summary(["pkg-a", "pkg-b", "pkg-c"])
d = "sha256:aaa"
print("sbom", s["sbom"])
print("pkgs", s["pkgs"])
print("prov_ok", provenance_ok(d, d, d))`,
        output: `sbom spdx
pkgs 3
prov_ok True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content: "Contrato S44-T2-B: Si los digests de artifact, SBOM y provenance divergen o falta la attestation, el gate rechaza el promote (`REJECT_ATTESTATION`).",
      },
    },
    {
      heading: "environments y approvals",
      subtopicId: "S44-T3-A",
      paragraphs: [
        "Los **environments** (dev → staging → prod) separan secretos, políticas y aprobadores. Producción no se alimenta de un rebuild improvisado: se mueve el **mismo digest** que pasó los tests en staging. La **aprobación** es independiente del autor del PR; sin `approved_by` no hay promote. Rebuild al promover es el anti-patrón clásico de supply chain: lo que se testeó deja de ser lo desplegado y la provenance queda huérfana.",
        "Contrato de promoción. Entrada: environment origen/destino, aprobador, digest testeado y digest promovido. Salida: promote solo si `source=staging`, `target=production`, hay aprobador y `tested_digest == promoted_digest` (mismo subject). Breach (sin aprobación, digests distintos o promote desde `dev`) → `DENY_PROMOTION`. Incertidumbre: falta `promoted_digest` → `REQUEST_RELEASE_APPROVAL` (revisión humana, no inventar digest).",
        "En `CASO-PIU-044-3A` staging del servicio de jobs de Piura aprobó `sha256:abc`. Production solo se mueve si `approved_by` (p. ej. `release-owner`) está presente y el digest promovido es exactamente ese. Un rebuild “para estar seguros” que produce `sha256:new` sin re-tests ni nueva attestation es `DENY_PROMOTION`: no hay atajo de confianza.",
      ],
      code: {
        language: 'python',
        title: "envs_approvals.py",
        code: `def env_gate(envs: list, approvers: list) -> dict:
    return {
        "envs": envs,
        "prod_approvers": approvers,
        "protection": "prod" in envs and len(approvers) >= 1,
    }

def promote_same_digest(tested: str, promoted: str, approved_by: str) -> bool:
    return bool(approved_by) and tested == promoted and tested.startswith("sha256:")

g = env_gate(["dev", "staging", "prod"], ["lead"])
print("envs", g["envs"])
print("prod_approvers", g["prod_approvers"])
print("same_digest", promote_same_digest("sha256:abc", "sha256:abc", "lead"))`,
        output: `envs ['dev', 'staging', 'prod']
prod_approvers ['lead']
same_digest True`,
      },
      callout: {
        type: "warning",
        title: "Anti-patrón: rebuild al promover",
        content: "Para S44-T3-A, Sin aprobador independiente o con digests distintos entre staging y prod, el gate deniega el promote (`DENY_PROMOTION`). Nunca reconstruyas al promover.",
      },
    },
    {
      heading: "migrations, canary/blue-green y rollback",
      subtopicId: "S44-T3-B",
      paragraphs: [
        "Antes de enviar tráfico, las **migraciones** deben ser compatibles (expand-first / no breaking). El **canary** envía un porcentaje de tráfico (p. ej. 10%) y mide la tasa de error contra un umbral. Si el canary está sano, se puede ampliar; si supera el umbral, se hace **rollback** al digest previo. El rollback no es “intentar de nuevo”: es restaurar código/config (y datos si aplica) **dentro del RTO** y dejar evidencia del tiempo de reversión.",
        "Contrato dual de canary. Camino sano (PASS en lab): migración compatible, `canary_error_rate ≤ max_error_rate`, rollback previamente probado y `rollback_seconds ≤ rto_seconds`. Camino de incidente (demo de teoría): error_rate sobre umbral → fase `prev_version` y decisión `rollback`. Breach en weDo (canary roto o rollback no listo) → `ROLLBACK_RELEASE`. Incertidumbre: falta `rto_seconds` → `PAUSE_CANARY`.",
        "En `CASO-PIU-044-3B` el servicio de Piura canariza al 10%. Si la tasa de error se mantiene bajo 1%, el release continúa y se documenta que el rollback de ensayo tomó ≤ RTO. Si en el lab simulamos 8% de error (sobre umbral 5%), el demo devuelve `prev_version` + `rollback` — no se inventa un “hold” saludable.",
      ],
      code: {
        language: 'python',
        title: "migrations_canary_rollback.py",
        code: `def canary_action(error_rate: float, threshold: float = 0.05, traffic_pct: int = 10) -> tuple:
    if error_rate > threshold:
        return "prev_version", traffic_pct, "rollback"
    return "canary", traffic_pct, "hold"

# Lab: canary al 10% supera umbral → rollback al digest previo
phase, pct, decision = canary_action(0.08, threshold=0.05, traffic_pct=10)
print(phase)
print(pct)
print(decision)`,
        output: `prev_version
10
rollback`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content: "Promoción de S44-T3-B: Canary sano bajo umbral → hold; error sobre umbral → rollback al digest previo dentro del RTO. Sin RTO medible → `PAUSE_CANARY`.",
      },
    },
    {
      heading: "branch/review policy y release notes",
      subtopicId: "S44-T4-A",
      paragraphs: [
        "La **branch protection** de `main` exige reviews y checks verdes antes del merge: es el primer control humano y automatizado de la cadena de suministro (antes incluso del publish). Las **release notes** no son marketing; son un contrato operativo para quien despliega de madrugada: qué cambió, riesgo residual, pasos de migración y cómo revertir. Un tag de release sin notes completas deja al on-call sin mapa y convierte el rollback en improvisación.",
        "Contrato de release trazable. Entrada: branch protegida, número de reviews requeridas, checks obligatorios y conjunto de campos en release notes. Salida: `protected_branch`, `required_reviews ≥ 1`, checks activos y notes ⊇ {change, risk, migration, rollback}. Breach (merge sin protección o notes incompletas) → `BLOCK_UNREVIEWED_RELEASE`. Incertidumbre: falta el mapa `release_notes` → `COMPLETE_RELEASE_NOTES`.",
        "En `CASO-PIU-044-4A` el equipo de Piura protege `main` con 2 reviews y checks de CI. Las notes del release del API de jobs listan cambio, riesgo, migración y rollback con lenguaje operable (“revertir al digest previo en ≤120 s”). Merge directo a `main` sin protección, o notes solo con el campo `change`, se bloquean: no hay release “rápido” sin trazabilidad.",
      ],
      code: {
        language: 'python',
        title: "branch_review_release_notes.py",
        code: `def branch_policy(reviews: int, signed: bool) -> dict:
    return {"reviews": reviews, "signed_commits": signed}

def notes_operable(notes: set) -> bool:
    return {"change", "risk", "migration", "rollback"} <= notes

pol = branch_policy(2, True)
print(pol)
print("notes_ok", notes_operable({"change", "risk", "migration", "rollback"}))
print("branch", "main_protected")`,
        output: `{'reviews': 2, 'signed_commits': True}
notes_ok True
branch main_protected`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content: "El dueño de S44-T4-A acepta que Branch protection + reviews + notes operables (cambio, riesgo, migración, rollback). Merge sin protección o notes incompletas → `BLOCK_UNREVIEWED_RELEASE`.",
      },
    },
    {
      heading: "failure handling y evidencia auditable",
      subtopicId: "S44-T4-B",
      paragraphs: [
        "Cuando un check crítico falla, el pipeline **bloquea** el release: no usa `continue-on-error` como aprobación silenciosa ni “amarillo que se ignora”. La evidencia se conserva: logs **redactados** (sin secretos ni tokens), artifact del job, clasificación del fallo, **dueño** del incidente y decisión registrada. Un fallo sin dueño ni evidencia es un incidente que se olvida hasta el siguiente outage — y rompe la promesa de CP-N4-B.",
        "Contrato de fallo cerrado. Entrada: flag de fallo crítico, si el pipeline quedó bloqueado, logs redactados, owner y retención de evidencia. Salida: ante crítico, `pipeline_blocked` y evidencia auditable completa. Breach (crítico sin bloqueo, logs sin redactar o sin owner/evidencia) → `STOP_SILENT_FAILURE`. Incertidumbre: falta `evidence_retained` → `ASSIGN_INCIDENT_OWNER` (no reintentar a ciegas).",
        "En `CASO-PIU-044-4B` un test de integración crítico del servicio de jobs de Piura falla a las 02:10: el workflow marca `block_release`, retiene log+artifact, asigna owner `release` y no reabre el tag de release. Inventar evidencia, borrar el trace “para reducir ruido” o re-lanzar con `continue-on-error: true` viola el contrato de auditabilidad.",
      ],
      code: {
        language: 'python',
        title: "failure_handling_audit_evidence.py",
        code: `def on_critical_fail(kind: str) -> tuple:
    evidence = ["log", "artifact"]
    action = "block_release" if kind == "critical" else "warn"
    return action, evidence, True

action, evidence, audit = on_critical_fail("critical")
print(action)
print(evidence)
print("audit", audit)`,
        output: `block_release
['log', 'artifact']
audit True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content: "Cierre de S44-T4-B: Fallo crítico bloquea el release y deja evidencia auditable (logs redactados, dueño, artifact). Breach silencioso → `STOP_SILENT_FAILURE`; falta de dueño o evidencia → `ASSIGN_INCIDENT_OWNER`.",
      },
    },
  ],
  iDo: {
    intro: "Ocho demos locales de CI/CD y cadena de suministro: cómo un pipeline decide certificar, firmar evidencia, promover el mismo digest y revertir un canary — sin registry remoto.",
    steps: [
      {
        demoId: "S44-T1-A-DEMO",
        subtopicId: "S44-T1-A",
        environment: "local-python",
        description: "Demo: lint/types/tests y matrices.",
        preamble:
          "Antes de gastar minutos en SBOM o publish, el repo de ops de Piura (CASO-PIU-044) debe **certificar el código**. En esta demo tres checks verdes y la matriz `{3.11, 3.12}` coinciden con lo soportado. No escribas aún: predice si `gates_green` devuelve `True` y por qué un solo check rojo o Python 3.10 fuera de matriz tumbaría el gate. Observa las tres líneas: `ok`, `n 3` y `matrix_ok`.",
        code: {
          language: 'python',
          title: "demo_lint_types_tests_matrix.py",
          code: `def gates_green(results: dict, matrix: set, supported: set) -> bool:
    checks = all(results.get(k) for k in ("lint", "types", "tests"))
    return checks and matrix == supported

ok = gates_green(
    {"lint": True, "types": True, "tests": True},
    {"3.11", "3.12"},
    {"3.11", "3.12"},
)
print(ok)
print("n", 3)
print("matrix_ok", ok)`,
          output: `True
n 3
matrix_ok True`,
        },
        why: "Lint → types → tests en AND es barato antes de lo costoso (SBOM, publish). La matriz solo cubre runtimes que el equipo realmente soporta; un semáforo verde sin igualdad matriz==soportada miente. Sin secretos ni registry: solo el predicado de certificación. En We Do el starter usa OR débil en lugar de AND + igualdad de conjuntos.",
        retrospective:
          "Si puedes explicar por qué tres checks en OR no son un gate de CI sin mirar el código, ya tienes el hábito de certificar antes de publicar. El error clásico es «tests pasaron, el resto es opcional». En We Do repararás el predicado y el fallo cerrado con `FAIL_CI_GATE` / `REVIEW_MATRIX`.",
      },
      {
        demoId: "S44-T1-B-DEMO",
        subtopicId: "S44-T1-B",
        environment: "local-python",
        description: "Demo: caches, artifacts y condiciones.",
        preamble:
          "En CASO-PIU-044 la caché acelera el job, pero **no prueba** que el build sea reproducible. En esta demo la clave empieza por `lock-` (hash del lockfile) y el artifact `sha256:def` con 14 días de retención es publicable — el mismo prefijo del lab We Do. No escribas: predice `cache_key True`, `artifact True` y la condición `main_and_tags`. Observa por qué un digest `latest` o retención 0 no contarían como evidencia.",
        code: {
          language: 'python',
          title: "demo_caches_artifacts_conditions.py",
          code: `def cache_key(lock_hash: str) -> str:
    return f"lock-{lock_hash[:8]}"

def artifact_ok(digest: str, retention_days: int) -> bool:
    return digest.startswith("sha256:") and retention_days >= 7

key = cache_key("abcdef12deadbeef")
print("cache_key", key.startswith("lock-"))
print("artifact", artifact_ok("sha256:def", 14))
print("condition", "main_and_tags")`,
          output: `cache_key True
artifact True
condition main_and_tags`,
        },
        why: "La cache es optimización ligada al lockfile (`lock-`); el artifact con digest y retención es lo que un auditor re-descarga. Tags de release sin los mismos gates que main se descartan (`DISCARD_PIPELINE_RESULT`). En We Do el starter invierte `cache_miss_passes` y las condiciones de tags.",
        retrospective:
          "Cache acelera; el artifact con digest y retención es lo que un auditor re-descarga. El error clásico es tratar un cache hit como «build OK» o publicar `latest` con retención 0. Pregunta: si el miss de cache aún produce el wheel, ¿por qué eso es señal de robustez y no de fallo? We Do: predicado `lock-` + sha256 + retención ≥7 + tags cubiertos.",
      },
      {
        demoId: "S44-T2-A-DEMO",
        subtopicId: "S44-T2-A",
        environment: "local-python",
        description: "Demo: permisos mínimos, pinning y secret scanning.",
        preamble:
          "El token del workflow de Piura es un **atacante en potencia** si tiene write amplio. En esta demo hay 1 hit de secreto (debe bloquear), permisos least y un checkout pinneado con SHA de 40 hex. No escribas: predice `gitleaks block`, `perms least` y `pin True`. Observa que un `@v4` no pasaría `is_full_sha_pin`.",
        code: {
          language: 'python',
          title: "demo_min_perms_pin_secret_scan.py",
          code: `def secret_scan_policy(found: int) -> str:
    return "block" if found > 0 else "pass"

def is_full_sha_pin(action_ref: str) -> bool:
    ref = action_ref.split("@")[-1] if "@" in action_ref else ""
    return len(ref) == 40 and all(c in "0123456789abcdef" for c in ref.lower())

sha = "b4ffde65f46336ab88eb53be808477a3936bae11"
print("gitleaks", secret_scan_policy(1))
print("perms", "least")
print("pin", is_full_sha_pin(f"actions/checkout@{sha}"))`,
          output: `gitleaks block
perms least
pin True`,
        },
        why: "Pin inmutable = 40 hex; los tags se mueven y no cierran supply chain de actions. `secret_hits > 0` obliga a rotar, no a «limpiar el log». `contents: read` es el default defendible. En We Do el starter aprueba write o secret hits y debes calcular el pin del string `action_ref`.",
        retrospective:
          "Least privilege + pin SHA + cero secretos en logs es el suelo de hardening. El error clásico es pin por tag flotante `@v4` o «limpiar el log» en lugar de rotar. Pregunta: si `secret_hits == 1`, ¿qué haces antes de reintentar el pipeline? We Do: calcular el pin del string `action_ref`, no de un booleano mágico.",
      },
      {
        demoId: "S44-T2-B-DEMO",
        subtopicId: "S44-T2-B",
        environment: "local-python",
        description: "Demo: SBOM, provenance y attestations.",
        preamble:
          "Una attestation no «garantiza calidad»: impide promover un binario **huérfano de evidencia**. En esta demo artifact, SBOM y subject de provenance comparten `sha256:abc`. No escribas: predice `attest True` y por qué un SBOM del build de ayer con otro digest fallaría. Observa las tres salidas.",
        code: {
          language: 'python',
          title: "demo_sbom_provenance_attest.py",
          code: `def provenance_ok(digest: str, sbom_digest: str, subject: str) -> bool:
    return bool(digest) and len({digest, sbom_digest, subject}) == 1

d = "sha256:abc"
print("attest", provenance_ok(d, d, d))
print("verifiable", True)
print("spdx", True)`,
          output: `attest True
verifiable True
spdx True`,
        },
        why: "La longitud del set de digests == 1 es el contrato medible: artifact, SBOM y subject de provenance deben ser el mismo subject. Divergencia → `REJECT_ATTESTATION`. Sin `attestation_valid` no se inventa un verde: se reconstruye provenance (`REBUILD_PROVENANCE`). En We Do el starter exige len > 1 (invertido a propósito).",
        retrospective:
          "Mismo subject en artifact, SBOM y provenance: esa es la cadena. El error clásico es reutilizar el SBOM de ayer «porque casi es el mismo». Pregunta: si el wheel es `sha256:aaa` y el SBOM apunta a `bbb`, ¿qué dice el gate aunque el README diga OK? We Do: alinear digests + `attestation_valid`.",
      },
      {
        demoId: "S44-T3-A-DEMO",
        subtopicId: "S44-T3-A",
        environment: "local-python",
        description: "Demo: environments y approvals.",
        preamble:
          "Producción en Piura no se alimenta de un rebuild improvisado: se mueve el **mismo digest** que pasó staging. En esta demo staging→prod con `sha256:abc` y aprobador `lead` es OK; el rebuild a `sha256:new` se niega. No escribas: predice `next prod`, `ok True` y `rebuild_denied False`. Observa la igualdad tested==promoted.",
        code: {
          language: 'python',
          title: "demo_envs_approvals.py",
          code: `def next_env(current: str) -> str:
    order = ["dev", "staging", "prod"]
    i = order.index(current)
    return order[min(i + 1, len(order) - 1)]

def promote_ok(source: str, target: str, tested: str, promoted: str, approved_by: str) -> bool:
    return (
        source == "staging"
        and target == "prod"
        and bool(approved_by)
        and tested == promoted
        and tested.startswith("sha256:")
    )

# Camino sano: mismo digest + aprobación
print("next", next_env("staging"))
print("ok", promote_ok("staging", "prod", "sha256:abc", "sha256:abc", "lead"))
# Anti-patrón: rebuild al promover (digest distinto)
print("rebuild_denied", promote_ok("staging", "prod", "sha256:abc", "sha256:new", "lead"))`,
          output: `next prod
ok True
rebuild_denied False`,
        },
        why: "Source staging, target prod, `approved_by` truthy, digests iguales y prefijo sha256 cierran el promote. Rebuild al promover produce otro digest, huérfana la provenance y el gate niega el promote. En We Do el starter marca PASS sin approval o con digests distintos.",
        retrospective:
          "Mismo digest + aprobación independiente = promote defendible. El error clásico es «reconstruir para estar seguros». Pregunta: si tested es `sha256:abc` y promoted `sha256:new` con el mismo lead, ¿qué imprime el predicado y por qué no es un atajo de confianza? We Do: `DENY_PROMOTION` y `REQUEST_RELEASE_APPROVAL`.",
      },
      {
        demoId: "S44-T3-B-DEMO",
        subtopicId: "S44-T3-B",
        environment: "local-python",
        description: "Demo: migrations, canary/blue-green y rollback.",
        preamble:
          "El canary de Piura al 10% **mide** error contra umbral y tiene rollback ensayado dentro del RTO. En esta demo migración compatible, 0.4% de error bajo 1% → hold; 8% sobre 5% → rollback. No escribas: predice las tres líneas de salida. Observa que rollback_s 75 ≤ rto 120 en el camino fallido aún devuelve `rollback` (no «hold»).",
        code: {
          language: 'python',
          title: "demo_migrations_canary_rollback.py",
          code: `def migrate_mode(compatible: bool) -> str:
    return "expand_first" if compatible else "blocked"

def canary_decision(error_rate: float, max_rate: float, rto: int, rollback_s: int) -> str:
    if error_rate > max_rate:
        return "rollback" if rollback_s <= rto else "rollback_missed_rto"
    return "hold_healthy"

print("migration", migrate_mode(True))
print("healthy", canary_decision(0.004, 0.01, 120, 75))
print("failed", canary_decision(0.08, 0.05, 120, 75))`,
          output: `migration expand_first
healthy hold_healthy
failed rollback`,
        },
        why: "Contrato dual: PASS cuando canary sano (error ≤ umbral + rollback listo ≤ RTO) vs. incidente (error sobre umbral → rollback). Sin `rto_seconds` no se mide el ensayo. En We Do el starter marca PASS si error alto o rollback no tested.",
        retrospective:
          "Canary sano = hold; canary roto = rollback al digest previo dentro del RTO. El error clásico es ampliar tráfico con error alto «para ver si se estabiliza». Pregunta: con 8% de error y rollback 75 s ≤ RTO 120, ¿por qué la decisión es `rollback` y no hold? We Do: `ROLLBACK_RELEASE` y `PAUSE_CANARY`.",
      },
      {
        demoId: "S44-T4-A-DEMO",
        subtopicId: "S44-T4-A",
        environment: "local-python",
        description: "Demo: branch/review policy y release notes.",
        preamble:
          "Las release notes de Piura no son marketing: son el mapa del on-call a las 02:00. En esta demo 2 reviews y el set {change, risk, migration, rollback} dejan el release listo. No escribas: predice `reviews 2`, `release_notes True` y `conventional True`. Observa por qué un set solo con `change` fallaría.",
        code: {
          language: 'python',
          title: "demo_branch_review_release_notes.py",
          code: `def release_ready(reviews: int, notes: set) -> bool:
    required = {"change", "risk", "migration", "rollback"}
    return reviews >= 1 and required <= notes

print("reviews", 2)
print("release_notes", release_ready(2, {"change", "risk", "migration", "rollback"}))
print("conventional", True)`,
          output: `reviews 2
release_notes True
conventional True`,
        },
        why: "Branch protection + ≥1 review + checks + notes ⊇ {change, risk, migration, rollback} son el contrato medible del release. Merge sin protección o notes solo con `change` → `BLOCK_UNREVIEWED_RELEASE`. En We Do el starter marca PASS sin protección o con reviews==0.",
        retrospective:
          "Review humano + notes operables = primer control de supply chain antes del publish. El error clásico es un tag con un párrafo de «mejoras» sin riesgo ni rollback. Pregunta: ¿qué falta si el set solo tiene `change`? We Do: `BLOCK_UNREVIEWED_RELEASE` y `COMPLETE_RELEASE_NOTES`.",
      },
      {
        demoId: "S44-T4-B-DEMO",
        subtopicId: "S44-T4-B",
        environment: "local-python",
        description: "Demo: failure handling y evidencia auditable.",
        preamble:
          "Cuando un test crítico del servicio de jobs de Piura falla a las 02:10, el pipeline **bloquea** el release y retiene evidencia: no usa continue-on-error como aprobación silenciosa. En esta demo critical True → `on_fail block`, 2 piezas de evidencia y audit trail. No escribas: predice las tres líneas. Observa que warn no es el camino de un fallo crítico.",
        code: {
          language: 'python',
          title: "demo_failure_handling_audit_evidence.py",
          code: `def fail_policy(critical: bool, evidence: list) -> tuple:
    return ("block" if critical else "continue", len(evidence), True)

on_fail, n, audit = fail_policy(True, ["log", "artifact"])
print("on_fail", on_fail)
print("evidence_n", n)
print("audit_trail", audit)`,
          output: `on_fail block
evidence_n 2
audit_trail True`,
        },
        why: "Critical + `pipeline_blocked` + logs_redacted + owner + evidence_retained son el AND del fallo auditable y defendible. Breach silencioso (crítico sin bloqueo) → `STOP_SILENT_FAILURE`; sin evidencia → `ASSIGN_INCIDENT_OWNER`. En We Do el starter marca PASS si critical y **no** blocked.",
        retrospective:
          "Fallo crítico = block + dueño + evidencia redactada. El error clásico es re-lanzar con continue-on-error como aprobación silenciosa. Pregunta: si el test crítico falla a las 02:10, ¿qué tres piezas de evidencia retienes antes de reabrir el tag? We Do: `STOP_SILENT_FAILURE` y `ASSIGN_INCIDENT_OWNER`.",
      },
    ],
  },
  weDo: {
    intro: "Laboratorio de pipeline CI/CD con supply-chain gates: 24 retos (E1 repara, E2 clasifica valid/invalid/missing, E3 decide fail-closed). Ocho case_ids sintéticos de Piura (`CASO-PIU-044-1A`…`4B`); cada tríada reutiliza el mismo fixture de dominio con predicados invertidos a propósito.",
    steps: [
      {
        id: "S44-T1-A-E1",
        subtopicId: "S44-T1-A",
        kind: "guided",
        title: "Tres checks en AND y matriz exacta",
        preamble:
          "- **Contexto:** en CASO-PIU-044-1A el PR de ops de Piura solo avanza si lint, types y tests pasan **todos** y la matriz ejecutada es la soportada.\n- **Meta:** corregir el predicado (AND de los tres checks + `matrix == supported`).\n- **Éxito:** una línea `S44-T1-A PASS`.\n- **Límites:** no mutes el fixture; no uses OR; el DEFECT está en la expresión, no en los datos.",
        instruction:
          "S44-T1-A-E1 · Salida: debe devolver el PASS del contrato. 1. Abre el starter: `meets_contract` usa `lint or types or tests` (DEFECT).\n2. Cámbialo a `all(...)` de lint/types/tests **y** `matrix == supported`.\n3. Conserva el print de status.\n4. Debe imprimir `S44-T1-A PASS`.",
        hint: "Recuerda el AND de lint/types/tests más la igualdad matriz == soportada.",
        hints: [
          "Relaciona los campos `lint`, `types`, `tests`, `matrix`, `supported` con la regla explicada en S44-T1-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva lint/types/tests y matriz soportada en verde; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta supported", "fixture adverso: tres gates y matriz exactamente soportada", "CASO-PIU-044-1A es sintético"],
        tests: "El fixture `CASO-PIU-044-1A` satisface un predicado de dominio real; imprime `S44-T1-A PASS` y el assert booleano pasa.",
        feedback:
          "Con los tres checks en True y matriz idéntica, solo el AND + igualdad devuelve PASS. El OR aprueba un typecheck rojo si lint pasó: el gate de CI deja de ser fail-closed.",
        retrospective:
          "Certificar en AND barato → caro es el primer eslabón de supply chain. El error clásico es OR parcial o ignorar una versión fuera de matriz. Siguiente (E2): enrutar válido, adverso y sin `supported`.",
        starterCode: {
          language: 'python',
          title: "s44-t1-a-e1.py",
          code: `# CASO-PIU-044 · CI lint/types/tests matrix
# DEFECT: PASS con OR débil (lint|types|tests) en vez de AND
record = {"case_id": "CASO-PIU-044-1A", **{"lint":True,"types":True,"tests":True,"matrix":{"3.11","3.12"},"supported":{"3.11","3.12"}}}
# DEFECT: lint/types/tests deben pasar todos, no OR parcial
meets_contract = record["lint"] or record["types"] or record["tests"]
status = "PASS" if meets_contract else "FAIL_CI_GATE"
print("S44-T1-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s44-t1-a-e1.py",
          code: `record = {"case_id": "CASO-PIU-044-1A", **{"lint":True,"types":True,"tests":True,"matrix":{"3.11","3.12"},"supported":{"3.11","3.12"}}}
meets_contract = all(record[k] for k in ("lint","types","tests")) and record["matrix"] == record["supported"]
status = "PASS" if meets_contract else "FAIL_CI_GATE"
print("S44-T1-A", status)
assert meets_contract is True` ,
          output: `S44-T1-A PASS` ,
        },
      },
      {
        id: "S44-T1-A-E2",
        subtopicId: "S44-T1-A",
        kind: "independent",
        title: "Tres rutas del gate de CI",
        preamble:
          "- **Contexto:** el job de Piura no inventa una matriz cuando falta `supported`: primero valida campos, luego mide contenido.\n- **Meta:** implementar `assess` que separe válido, adverso (types False + 3.10) y sin `supported`.\n- **Éxito:** `PASS FAIL_CI_GATE MISSING:supported`.\n- **Límites:** calcula `missing` antes de leer `supported`; no rellenes la matriz; datos sintéticos CASO-PIU-044-1A.",
        instruction:
          "S44-T1-A-E2 · 1. Revisa el starter: PASS si OR de lint/types/tests (DEFECT).\n2. Corrige a AND + matrix==supported.\n3. Conserva la rama MISSING por campos ausentes.\n4. Imprime las tres salidas en orden.",
        hint: "Primero se calcula `missing`; ningún acceso a supported debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a supported debe ocurrir antes de esa rama.",
          "Después aplica la regla de S44-T1-A: tres gates y matriz exactamente soportada. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta supported", "fixture adverso: tres gates y matriz exactamente soportada", "CASO-PIU-044-1A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `supported` ausente y produce exactamente `PASS FAIL_CI_GATE MISSING:supported`.",
        feedback:
          "Schema (MISSING) se evalúa antes que breach (FAIL_CI_GATE). Acceder a `supported` cuando falta tumba el flujo; el adverso falla por types False y 3.10 fuera de matriz, no por schema.",
        retrospective:
          "Primero schema, después contenido: un `KeyError` por leer `supported` ausente no es «CI roja», es un bug del assessor. El error clásico es mezclar «falta el campo» con «types False y 3.10 fuera de matriz». Pregunta: si el adverso tuviera los tres checks verdes pero matriz `{3.10}`, ¿qué código devuelves y por qué no es MISSING? Luego (E3): CONTINUE / FAIL_CI_GATE / REVIEW_MATRIX.",
        starterCode: {
          language: 'python',
          title: "s44-t1-a-e2.py",
          code: `# CASO-PIU-044 · assess FAIL_CI_GATE
# DEFECT: PASS si solo uno de lint/types/tests
def assess(record: dict) -> str:
    required = {"case_id", "lint", "types", "tests", "matrix", "supported"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["lint"] or record["types"] or record["tests"] else "FAIL_CI_GATE"

valid = {"case_id": "CASO-PIU-044-1A", **{"lint":True,"types":True,"tests":True,"matrix":{"3.11","3.12"},"supported":{"3.11","3.12"}}}
invalid = {"case_id": "CASO-PIU-044-1A", **{"lint":True,"types":False,"tests":True,"matrix":{"3.10","3.12"},"supported":{"3.11","3.12"}}}
incomplete = {**valid}
incomplete.pop("supported")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s44-t1-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "lint", "types", "tests", "matrix", "supported"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if all(record[k] for k in ("lint","types","tests")) and record["matrix"] == record["supported"] else "FAIL_CI_GATE"

valid = {"case_id": "CASO-PIU-044-1A", **{"lint":True,"types":True,"tests":True,"matrix":{"3.11","3.12"},"supported":{"3.11","3.12"}}}
invalid = {"case_id": "CASO-PIU-044-1A", **{"lint":True,"types":False,"tests":True,"matrix":{"3.10","3.12"},"supported":{"3.11","3.12"}}}
incomplete = {**valid}
incomplete.pop("supported")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS FAIL_CI_GATE MISSING:supported` ,
        },
      },
      {
        id: "S44-T1-A-E3",
        subtopicId: "S44-T1-A",
        kind: "transfer",
        title: "Fail-closed: REVIEW_MATRIX o FAIL_CI_GATE",
        preamble:
          "- **Contexto:** en plataforma de Piura no se asume «todo OK» si falta la matriz soportada: se deriva a revisión humana.\n- **Meta:** decidir CONTINUE / FAIL_CI_GATE / REVIEW_MATRIX.\n- **Éxito:** `CONTINUE FAIL_CI_GATE REVIEW_MATRIX`.\n- **Límites:** missing → REVIEW_MATRIX (no CONTINUE); no inventes `supported`; breach de checks cierra con FAIL_CI_GATE.",
        instruction:
          "S44-T1-A-E3 · Salida: debe devolver el PASS del contrato. 1. Lee el DEFECT: missing devuelve CONTINUE y pred usa OR.\n2. En `decide`, missing → `REVIEW_MATRIX`.\n3. Completos: CONTINUE solo si AND + matrix==supported; si no → FAIL_CI_GATE.\n4. Imprime las tres decisiones en orden.",
        hint: "Missing ≠ breach: enruta la ausencia de `supported` a `REVIEW_MATRIX` antes de mirar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REVIEW_MATRIX` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró tres gates y matriz exactamente soportada; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta supported", "fixture adverso: tres gates y matriz exactamente soportada", "CASO-PIU-044-1A es sintético"],
        tests: "Fixtures `CASO-PIU-044-1A`, adverso y sin `supported` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "REVIEW_MATRIX pide evidencia de matriz; FAIL_CI_GATE cierra el breach; CONTINUE solo con CI certificada. Tratar «falta supported» como éxito silencioso es el anti-patrón de este E3.",
        retrospective:
          "En plataforma no se inventa la matriz soportada: se pide dueño y se detiene el promote del PR. El error clásico es tratar `REVIEW_MATRIX` como «casi PASS» y rellenar `{3.11, 3.12}` en silencio. Pregunta: si el adverso y el missing llegaran el mismo día, ¿qué código cierras primero y por qué no rellenas `supported`? Ese hábito se reutiliza en You Do al declarar runtimes reales del portfolio.",
        starterCode: {
          language: 'python',
          title: "s44-t1-a-e3.py",
          code: `# CASO-PIU-044 · decide FAIL_CI_GATE
# DEFECT: missing→CONTINUE; pred OR invertido
def decide(record: dict) -> str:
    required = {"case_id", "lint", "types", "tests", "matrix", "supported"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["lint"] or record["types"] or record["tests"] else "FAIL_CI_GATE"

valid = {"case_id": "CASO-PIU-044-1A", **{"lint":True,"types":True,"tests":True,"matrix":{"3.11","3.12"},"supported":{"3.11","3.12"}}}
invalid = {"case_id": "CASO-PIU-044-1A", **{"lint":True,"types":False,"tests":True,"matrix":{"3.10","3.12"},"supported":{"3.11","3.12"}}}
uncertain = {**valid}
uncertain.pop("supported")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s44-t1-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "lint", "types", "tests", "matrix", "supported"}
    missing = sorted(required - record.keys())
    if missing:
        return "REVIEW_MATRIX"
    return "CONTINUE" if all(record[k] for k in ("lint","types","tests")) and record["matrix"] == record["supported"] else "FAIL_CI_GATE"

valid = {"case_id": "CASO-PIU-044-1A", **{"lint":True,"types":True,"tests":True,"matrix":{"3.11","3.12"},"supported":{"3.11","3.12"}}}
invalid = {"case_id": "CASO-PIU-044-1A", **{"lint":True,"types":False,"tests":True,"matrix":{"3.10","3.12"},"supported":{"3.11","3.12"}}}
uncertain = {**valid}
uncertain.pop("supported")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "FAIL_CI_GATE", "REVIEW_MATRIX"]` ,
          output: `CONTINUE FAIL_CI_GATE REVIEW_MATRIX` ,
        },
      },
      {
        id: "S44-T1-B-E1",
        subtopicId: "S44-T1-B",
        kind: "guided",
        title: "Artifact verificable, no solo cache",
        preamble:
          "- **Contexto:** en CASO-PIU-044-1B el wheel de Piura solo se adjunta si el miss de cache aún produce resultado y el digest es verificable.\n- **Meta:** corregir el predicado (prefijo `lock-`, miss pasa, sha256, retención ≥7, tags cubiertos).\n- **Éxito:** `S44-T1-B PASS`.\n- **Límites:** no mutes el fixture; no publiques con digest `latest`; DEFECT en la expresión booleana.",
        instruction:
          "S44-T1-B-E1 · Salida: debe devolver el PASS del contrato. 1. El starter marca PASS con `not cache_miss_passes or not conditions_cover_tags` (DEFECT).\n2. Reemplaza por AND de startswith lock-, miss True, sha256, retention ≥7, conditions True.\n3. Conserva el print.\n4. Debe imprimir `S44-T1-B PASS`.",
        hint: "Clave de caché con prefijo lock-, artifact sha256 y tags cubiertos: todo en AND.",
        hints: [
          "Relaciona los campos `cache_key`, `cache_miss_passes`, `artifact_digest`, `retention_days`, `conditions_cover_tags` con la regla explicada en S44-T1-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva esto: un cache miss sigue produciendo resultado correcto y el artifact es verificable. Revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta conditions_cover_tags", "fixture adverso: cache opcional, artifact con digest y condiciones completas", "CASO-PIU-044-1B es sintético"],
        tests: "El fixture `CASO-PIU-044-1B` satisface un predicado de dominio real; imprime `S44-T1-B PASS` y el assert booleano pasa.",
        feedback:
          "Un cache miss que sigue produciendo el wheel es señal de robustez, no de fallo. Invertir esa flag convierte el happy path en DISCARD_PIPELINE_RESULT y el adverso de E2 «parece» válido.",
        retrospective:
          "Evidencia = digest + retención + condiciones de release, no velocidad de install. El error clásico es confiar en cache global sin lock. Siguiente: tres rutas con DISCARD y MISSING de conditions.",
        starterCode: {
          language: 'python',
          title: "s44-t1-b-e1.py",
          code: `# CASO-PIU-044 · cache keys + artifact conditions
# DEFECT: PASS si cache_miss no pasa o conditions incompletas
record = {"case_id": "CASO-PIU-044-1B", **{"cache_key":"lock-abc","cache_miss_passes":True,"artifact_digest":"sha256:def","retention_days":14,"conditions_cover_tags":True}}
# DEFECT: cache miss no debe marcar pass; conditions deben cubrir tags
meets_contract = not record["cache_miss_passes"] or not record["conditions_cover_tags"]
status = "PASS" if meets_contract else "DISCARD_PIPELINE_RESULT"
print("S44-T1-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s44-t1-b-e1.py",
          code: `record = {"case_id": "CASO-PIU-044-1B", **{"cache_key":"lock-abc","cache_miss_passes":True,"artifact_digest":"sha256:def","retention_days":14,"conditions_cover_tags":True}}
meets_contract = record["cache_key"].startswith("lock-") and record["cache_miss_passes"] and record["artifact_digest"].startswith("sha256:") and record["retention_days"] >= 7 and record["conditions_cover_tags"]
status = "PASS" if meets_contract else "DISCARD_PIPELINE_RESULT"
print("S44-T1-B", status)
assert meets_contract is True` ,
          output: `S44-T1-B PASS` ,
        },
      },
      {
        id: "S44-T1-B-E2",
        subtopicId: "S44-T1-B",
        kind: "independent",
        title: "Tres rutas de evidencia de build",
        preamble:
          "- **Contexto:** el pipeline de Piura descarta un job si la cache es global, el digest es `latest` o los tags no tienen gates.\n- **Meta:** `assess` con PASS / DISCARD_PIPELINE_RESULT / MISSING:conditions_cover_tags.\n- **Éxito:** exactamente esas tres cadenas en una línea.\n- **Límites:** missing antes de leer conditions; no inventes cobertura de tags; fixture sintético.",
        instruction:
          "S44-T1-B-E2 · Salida: debe devolver el PASS del contrato. 1. Starter: PASS con pred invertido (DEFECT).\n2. Aplica el contrato completo de T1-B sobre datos completos.\n3. Conserva MISSING por schema.\n4. Imprime `PASS DISCARD_PIPELINE_RESULT MISSING:conditions_cover_tags`.",
        hint: "Primero se calcula `missing`; ningún acceso a conditions_cover_tags debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a conditions_cover_tags debe ocurrir antes de esa rama.",
          "Después aplica la regla de S44-T1-B: cache opcional, artifact con digest y condiciones completas. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta conditions_cover_tags", "fixture adverso: cache opcional, artifact con digest y condiciones completas", "CASO-PIU-044-1B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `conditions_cover_tags` ausente y produce exactamente `PASS DISCARD_PIPELINE_RESULT MISSING:conditions_cover_tags`.",
        feedback:
          "El adverso falla por contenido (global/latest/retención 0), no por schema. Mezclar «falta el campo» con «el campo está mal» es el error que este assess separa.",
        retrospective:
          "Schema y breach no se mezclan: falta `conditions_cover_tags` no es lo mismo que tags en False con cache `global` y digest `latest`. El error clásico es devolver DISCARD cuando falta el campo o inventar `True` para «cerrar el job». Pregunta: ¿qué evidencia mínima retiene el artifact si el cache miss pasó? Luego: CONTINUE vs. INSPECT_WORKFLOW_CONDITION.",
        starterCode: {
          language: 'python',
          title: "s44-t1-b-e2.py",
          code: `# CASO-PIU-044 · assess DISCARD_PIPELINE_RESULT
# DEFECT: PASS sin cache_miss_passes o tags
def assess(record: dict) -> str:
    required = {"case_id", "cache_key", "cache_miss_passes", "artifact_digest", "retention_days", "conditions_cover_tags"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if not record["cache_miss_passes"] or not record["conditions_cover_tags"] else "DISCARD_PIPELINE_RESULT"

valid = {"case_id": "CASO-PIU-044-1B", **{"cache_key":"lock-abc","cache_miss_passes":True,"artifact_digest":"sha256:def","retention_days":14,"conditions_cover_tags":True}}
invalid = {"case_id": "CASO-PIU-044-1B", **{"cache_key":"global","cache_miss_passes":False,"artifact_digest":"latest","retention_days":0,"conditions_cover_tags":False}}
incomplete = {**valid}
incomplete.pop("conditions_cover_tags")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s44-t1-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "cache_key", "cache_miss_passes", "artifact_digest", "retention_days", "conditions_cover_tags"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["cache_key"].startswith("lock-") and record["cache_miss_passes"] and record["artifact_digest"].startswith("sha256:") and record["retention_days"] >= 7 and record["conditions_cover_tags"] else "DISCARD_PIPELINE_RESULT"

valid = {"case_id": "CASO-PIU-044-1B", **{"cache_key":"lock-abc","cache_miss_passes":True,"artifact_digest":"sha256:def","retention_days":14,"conditions_cover_tags":True}}
invalid = {"case_id": "CASO-PIU-044-1B", **{"cache_key":"global","cache_miss_passes":False,"artifact_digest":"latest","retention_days":0,"conditions_cover_tags":False}}
incomplete = {**valid}
incomplete.pop("conditions_cover_tags")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS DISCARD_PIPELINE_RESULT MISSING:conditions_cover_tags` ,
        },
      },
      {
        id: "S44-T1-B-E3",
        subtopicId: "S44-T1-B",
        kind: "transfer",
        title: "Fail-closed: inspeccionar condiciones del workflow",
        preamble:
          "- **Contexto:** si no sabes si los tags de release de Piura comparten gates con main, **pausas a revisar el workflow**, no inventas True.\n- **Meta:** decide CONTINUE / DISCARD_PIPELINE_RESULT / INSPECT_WORKFLOW_CONDITION.\n- **Éxito:** `CONTINUE DISCARD_PIPELINE_RESULT INSPECT_WORKFLOW_CONDITION`.\n- **Límites:** missing ≠ breach; no rellenes conditions; no publiques digest huérfano.",
        instruction:
          "S44-T1-B-E3 · Salida: debe devolver el PASS del contrato. 1. DEFECT: missing → CONTINUE; pred invertido.\n2. missing → INSPECT_WORKFLOW_CONDITION.\n3. Completos: CONTINUE solo con contrato T1-B; si no → DISCARD.\n4. Imprime en orden valid, invalid, uncertain.",
        hint: "Missing ≠ breach: enruta la ausencia de `conditions_cover_tags` a `INSPECT_WORKFLOW_CONDITION` primero.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `INSPECT_WORKFLOW_CONDITION` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró cache opcional, artifact con digest y condiciones completas; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta conditions_cover_tags", "fixture adverso: cache opcional, artifact con digest y condiciones completas", "CASO-PIU-044-1B es sintético"],
        tests: "Fixtures `CASO-PIU-044-1B`, adverso y sin `conditions_cover_tags` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "INSPECT_* reabre el workflow; DISCARD_* tira el resultado; CONTINUE solo con artifact defendible. Un tag de prod sin gates es peor que un job lento: rompe el contrato de release.",
        retrospective:
          "Sin saber si los tags de release comparten gates con main, no se publica: se inspecciona el workflow. El error clásico es rellenar `conditions_cover_tags=True` porque «siempre lo cubrimos en main». Pregunta: ¿por qué un tag de prod sin gates es peor que un job lento? Lleva esa respuesta al You Do al documentar condiciones de release.",
        starterCode: {
          language: 'python',
          title: "s44-t1-b-e3.py",
          code: `# CASO-PIU-044 · decide DISCARD_PIPELINE_RESULT
# DEFECT: missing→CONTINUE; pred invertido
def decide(record: dict) -> str:
    required = {"case_id", "cache_key", "cache_miss_passes", "artifact_digest", "retention_days", "conditions_cover_tags"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if not record["cache_miss_passes"] or not record["conditions_cover_tags"] else "DISCARD_PIPELINE_RESULT"

valid = {"case_id": "CASO-PIU-044-1B", **{"cache_key":"lock-abc","cache_miss_passes":True,"artifact_digest":"sha256:def","retention_days":14,"conditions_cover_tags":True}}
invalid = {"case_id": "CASO-PIU-044-1B", **{"cache_key":"global","cache_miss_passes":False,"artifact_digest":"latest","retention_days":0,"conditions_cover_tags":False}}
uncertain = {**valid}
uncertain.pop("conditions_cover_tags")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s44-t1-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "cache_key", "cache_miss_passes", "artifact_digest", "retention_days", "conditions_cover_tags"}
    missing = sorted(required - record.keys())
    if missing:
        return "INSPECT_WORKFLOW_CONDITION"
    return "CONTINUE" if record["cache_key"].startswith("lock-") and record["cache_miss_passes"] and record["artifact_digest"].startswith("sha256:") and record["retention_days"] >= 7 and record["conditions_cover_tags"] else "DISCARD_PIPELINE_RESULT"

valid = {"case_id": "CASO-PIU-044-1B", **{"cache_key":"lock-abc","cache_miss_passes":True,"artifact_digest":"sha256:def","retention_days":14,"conditions_cover_tags":True}}
invalid = {"case_id": "CASO-PIU-044-1B", **{"cache_key":"global","cache_miss_passes":False,"artifact_digest":"latest","retention_days":0,"conditions_cover_tags":False}}
uncertain = {**valid}
uncertain.pop("conditions_cover_tags")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "DISCARD_PIPELINE_RESULT", "INSPECT_WORKFLOW_CONDITION"]` ,
          output: `CONTINUE DISCARD_PIPELINE_RESULT INSPECT_WORKFLOW_CONDITION` ,
        },
      },
      {
        id: "S44-T2-A-E1",
        subtopicId: "S44-T2-A",
        kind: "guided",
        title: "Pin SHA y least privilege",
        preamble:
          "- **Contexto:** en CASO-PIU-044-2A el workflow de Piura usa `contents: read` y checkout con SHA real de 40 hex.\n- **Meta:** implementar least privilege + `full_sha_pin` + secret_hits==0 + dependency_review.\n- **Éxito:** `S44-T2-A PASS`.\n- **Límites:** no mutes el PIN; no aceptes `@v4`; no cambies el assert; sin secretos reales.",
        instruction:
          "S44-T2-A-E1 · Salida: debe devolver el PASS del contrato. 1. Starter: PASS si write o secret_hits>0 (DEFECT invertido).\n2. Extrae el ref tras `@` y valida len 40 hex.\n3. AND con permisos ⊆ {read, none}, secret_hits==0 y dependency_review.\n4. Imprime `S44-T2-A PASS`.",
        hint: "Valida permisos ⊆ {read, none}, `action_ref` con SHA de 40 hex tras `@`, secret_hits==0 y dependency_review.",
        hints: [
          "Extrae el ref después de `@` en `action_ref` y comprueba len==40 y hex.",
          "El fixture válido usa `actions/checkout@` + SHA real; un tag `@v4` o stub corto no cuenta como pinned.",
        ],
        edgeCases: ["falta dependency_review", "action_ref con tag flotante o write amplio", "CASO-PIU-044-2A es sintético"],
        tests: "El fixture `CASO-PIU-044-2A` con SHA de 40 hex y least privilege imprime `S44-T2-A PASS`.",
        feedback:
          "El pin se **calcula** del string, no se asume. Un predicado que premia write o secret hits revoca la confianza del token: el adverso de E2 debe activar REVOKE_AND_ROTATE.",
        retrospective:
          "SHA inmutable cierra supply chain de actions; write amplio y secretos en logs obligan a rotar. El error clásico es confiar en un tag `@v4` o un stub corto. Pregunta: ¿qué compruebas del ref tras `@` además de la longitud? Siguiente: clasificar tag flotante como breach de contenido.",
        starterCode: {
          language: 'python',
          title: "s44-t2-a-e1.py",
          code: `# CASO-PIU-044 · least privilege + full SHA pin
# DEFECT: PASS si permissions write o secret_hits>0 (ignora pin real)
PIN = "b4ffde65f46336ab88eb53be808477a3936bae11"
record = {
    "case_id": "CASO-PIU-044-2A",
    "token_permissions": {"contents": "read"},
    "action_ref": f"actions/checkout@{PIN}",
    "secret_hits": 0,
    "dependency_review": True,
}
# DEFECT: no valida SHA ni least privilege real
meets_contract = "write" in record["token_permissions"].values() or record["secret_hits"] > 0
status = "PASS" if meets_contract else "REVOKE_AND_ROTATE"
print("S44-T2-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s44-t2-a-e1.py",
          code: `PIN = "b4ffde65f46336ab88eb53be808477a3936bae11"
record = {
    "case_id": "CASO-PIU-044-2A",
    "token_permissions": {"contents": "read"},
    "action_ref": f"actions/checkout@{PIN}",
    "secret_hits": 0,
    "dependency_review": True,
}

def full_sha_pin(action_ref: str) -> bool:
    ref = action_ref.split("@")[-1] if "@" in action_ref else ""
    return len(ref) == 40 and all(c in "0123456789abcdef" for c in ref.lower())

meets_contract = (
    set(record["token_permissions"].values()) <= {"read", "none"}
    and full_sha_pin(record["action_ref"])
    and record["secret_hits"] == 0
    and record["dependency_review"]
)
status = "PASS" if meets_contract else "REVOKE_AND_ROTATE"
print("S44-T2-A", status)
assert meets_contract is True` ,
          output: `S44-T2-A PASS` ,
        },
      },
      {
        id: "S44-T2-A-E2",
        subtopicId: "S44-T2-A",
        kind: "independent",
        title: "Tres rutas de endurecimiento del workflow",
        preamble:
          "- **Contexto:** un job de release en Piura con `packages: write` y checkout@v4 no es «casi pinneado»: es breach.\n- **Meta:** assess PASS / REVOKE_AND_ROTATE / MISSING:dependency_review.\n- **Éxito:** `PASS REVOKE_AND_ROTATE MISSING:dependency_review`.\n- **Límites:** missing antes del dominio; pin calculado; no inventes dependency_review.",
        instruction:
          "S44-T2-A-E2 · 1. Starter aprueba write/secret (DEFECT).\n2. Reutiliza full_sha_pin y least privilege.\n3. Conserva MISSING.\n4. Imprime las tres salidas.",
        hint: "Primero `missing`; luego least privilege + full_sha_pin(action_ref) + secret_hits==0 + dependency_review.",
        hints: [
          "El inválido usa `@v4` (tag flotante) y write: debe fallar por contenido, no por schema.",
          "No uses un booleano `actions_pinned`; el pin se **calcula** del string action_ref.",
        ],
        edgeCases: ["falta dependency_review", "tag @v4 no es pin", "CASO-PIU-044-2A es sintético"],
        tests: "Salidas exactas: `PASS REVOKE_AND_ROTATE MISSING:dependency_review`.",
        feedback:
          "Schema (falta review) ≠ breach (write/tag/secret). Marcar PASS si «hay un action_ref» sin validar el SHA es el error que este assess corrige.",
        retrospective:
          "Un `@v4` no es «casi pinneado»: el tag se mueve y el SHA no. Falta `dependency_review` es schema; write + secret hits + tag es breach de contenido. El error clásico es marcar PASS si el string `action_ref` «existe». Pregunta: ¿qué extraes después de `@` y cuántos caracteres hex exige el gate? Luego: SECURITY_APPROVAL en incertidumbre.",
        starterCode: {
          language: 'python',
          title: "s44-t2-a-e2.py",
          code: `# CASO-PIU-044 · assess REVOKE_AND_ROTATE
# DEFECT: PASS con write o secret; no valida SHA de action_ref
PIN = "b4ffde65f46336ab88eb53be808477a3936bae11"
def assess(record: dict) -> str:
    required = {"case_id", "token_permissions", "action_ref", "secret_hits", "dependency_review"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if "write" in record["token_permissions"].values() or record["secret_hits"] > 0 else "REVOKE_AND_ROTATE"

valid = {
    "case_id": "CASO-PIU-044-2A",
    "token_permissions": {"contents": "read"},
    "action_ref": f"actions/checkout@{PIN}",
    "secret_hits": 0,
    "dependency_review": True,
}
invalid = {
    "case_id": "CASO-PIU-044-2A",
    "token_permissions": {"contents": "write", "packages": "write"},
    "action_ref": "actions/checkout@v4",
    "secret_hits": 1,
    "dependency_review": False,
}
incomplete = {**valid}
incomplete.pop("dependency_review")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s44-t2-a-e2.py",
          code: `PIN = "b4ffde65f46336ab88eb53be808477a3936bae11"

def full_sha_pin(action_ref: str) -> bool:
    ref = action_ref.split("@")[-1] if "@" in action_ref else ""
    return len(ref) == 40 and all(c in "0123456789abcdef" for c in ref.lower())

def assess(record: dict) -> str:
    required = {"case_id", "token_permissions", "action_ref", "secret_hits", "dependency_review"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    ok = (
        set(record["token_permissions"].values()) <= {"read", "none"}
        and full_sha_pin(record["action_ref"])
        and record["secret_hits"] == 0
        and record["dependency_review"]
    )
    return "PASS" if ok else "REVOKE_AND_ROTATE"

valid = {
    "case_id": "CASO-PIU-044-2A",
    "token_permissions": {"contents": "read"},
    "action_ref": f"actions/checkout@{PIN}",
    "secret_hits": 0,
    "dependency_review": True,
}
invalid = {
    "case_id": "CASO-PIU-044-2A",
    "token_permissions": {"contents": "write", "packages": "write"},
    "action_ref": "actions/checkout@v4",
    "secret_hits": 1,
    "dependency_review": False,
}
incomplete = {**valid}
incomplete.pop("dependency_review")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REVOKE_AND_ROTATE MISSING:dependency_review` ,
        },
      },
      {
        id: "S44-T2-A-E3",
        subtopicId: "S44-T2-A",
        kind: "transfer",
        title: "Fail-closed: rotar o pedir SECURITY_APPROVAL",
        preamble:
          "- **Contexto:** sin dependency_review el lead de ops en Piura no inventa un True: pide **aprobación de seguridad**.\n- **Meta:** decide CONTINUE / REVOKE_AND_ROTATE / SECURITY_APPROVAL.\n- **Éxito:** `CONTINUE REVOKE_AND_ROTATE SECURITY_APPROVAL`.\n- **Límites:** missing ≠ CONTINUE; no apruebes tag flotante; sin secretos reales.",
        instruction:
          "S44-T2-A-E3 · Salida: debe devolver el PASS del contrato. 1. DEFECT: missing→CONTINUE; pred premia write/secret.\n2. missing → SECURITY_APPROVAL.\n3. Completos: CONTINUE solo con contrato T2-A; si no → REVOKE_AND_ROTATE.\n4. Imprime en orden.",
        hint: "Missing ≠ breach: enruta la ausencia de `dependency_review` a `SECURITY_APPROVAL` antes del contenido.",
        hints: [
          "Reutiliza full_sha_pin sobre action_ref; solo least privilege + pin + cero secrets + review devuelve CONTINUE.",
          "El adverso con `@v4` demuestra por qué el tag no es pin inmutable.",
        ],
        edgeCases: ["falta dependency_review", "tag @v4 no es pin", "CASO-PIU-044-2A es sintético"],
        tests: "Salidas exactas: `CONTINUE REVOKE_AND_ROTATE SECURITY_APPROVAL`.",
        feedback:
          "REVOKE_* implica rotación de credenciales; SECURITY_APPROVAL es incertidumbre, no breach silencioso. Un `@v4` no se «promueve» a pin con un comentario en el YAML.",
        retrospective:
          "Sin dependency_review el lead no inventa un True: pide aprobación de seguridad y detiene el publish. El error clásico es «promover» `@v4` a pin con un comentario en el YAML. Pregunta: si hay write amplio **y** falta review, ¿qué código aplica primero y por qué no es CONTINUE? Ese criterio alimenta el workflow pinneado del You Do.",
        starterCode: {
          language: 'python',
          title: "s44-t2-a-e3.py",
          code: `# CASO-PIU-044 · decide REVOKE_AND_ROTATE
# DEFECT: missing→CONTINUE; pred invertido (no valida SHA)
PIN = "b4ffde65f46336ab88eb53be808477a3936bae11"
def decide(record: dict) -> str:
    required = {"case_id", "token_permissions", "action_ref", "secret_hits", "dependency_review"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if "write" in record["token_permissions"].values() or record["secret_hits"] > 0 else "REVOKE_AND_ROTATE"

valid = {
    "case_id": "CASO-PIU-044-2A",
    "token_permissions": {"contents": "read"},
    "action_ref": f"actions/checkout@{PIN}",
    "secret_hits": 0,
    "dependency_review": True,
}
invalid = {
    "case_id": "CASO-PIU-044-2A",
    "token_permissions": {"contents": "write", "packages": "write"},
    "action_ref": "actions/checkout@v4",
    "secret_hits": 1,
    "dependency_review": False,
}
uncertain = {**valid}
uncertain.pop("dependency_review")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s44-t2-a-e3.py",
          code: `PIN = "b4ffde65f46336ab88eb53be808477a3936bae11"

def full_sha_pin(action_ref: str) -> bool:
    ref = action_ref.split("@")[-1] if "@" in action_ref else ""
    return len(ref) == 40 and all(c in "0123456789abcdef" for c in ref.lower())

def decide(record: dict) -> str:
    required = {"case_id", "token_permissions", "action_ref", "secret_hits", "dependency_review"}
    missing = sorted(required - record.keys())
    if missing:
        return "SECURITY_APPROVAL"
    ok = (
        set(record["token_permissions"].values()) <= {"read", "none"}
        and full_sha_pin(record["action_ref"])
        and record["secret_hits"] == 0
        and record["dependency_review"]
    )
    return "CONTINUE" if ok else "REVOKE_AND_ROTATE"

valid = {
    "case_id": "CASO-PIU-044-2A",
    "token_permissions": {"contents": "read"},
    "action_ref": f"actions/checkout@{PIN}",
    "secret_hits": 0,
    "dependency_review": True,
}
invalid = {
    "case_id": "CASO-PIU-044-2A",
    "token_permissions": {"contents": "write", "packages": "write"},
    "action_ref": "actions/checkout@v4",
    "secret_hits": 1,
    "dependency_review": False,
}
uncertain = {**valid}
uncertain.pop("dependency_review")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REVOKE_AND_ROTATE", "SECURITY_APPROVAL"]` ,
          output: `CONTINUE REVOKE_AND_ROTATE SECURITY_APPROVAL` ,
        },
      },
      {
        id: "S44-T2-B-E1",
        subtopicId: "S44-T2-B",
        kind: "guided",
        title: "Un solo digest en la cadena",
        preamble:
          "- **Contexto:** en CASO-PIU-044-2B el wheel de Piura, su SBOM y el subject de provenance deben ser el **mismo** digest.\n- **Meta:** corregir a len(set)==1 y attestation_valid.\n- **Éxito:** `S44-T2-B PASS`.\n- **Límites:** no mutes digests del fixture; no copies SBOM de otro build; DEFECT en la comparación.",
        instruction:
          "S44-T2-B-E1 · Salida: debe devolver el PASS del contrato. 1. Starter: PASS si len({...}) > 1 (DEFECT).\n2. Cámbialo a == 1 **y** attestation_valid.\n3. Conserva print/status.\n4. Debe imprimir `S44-T2-B PASS`.",
        hint: "Los tres digests deben coincidir y la attestation debe ser válida.",
        hints: [
          "Relaciona los campos `artifact_digest`, `sbom_digest`, `provenance_subject`, `attestation_valid` con la regla explicada en S44-T2-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva SBOM y provenance que coinciden con el digest. Revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta attestation_valid", "fixture adverso: SBOM y provenance enlazados al mismo digest", "CASO-PIU-044-2B es sintético"],
        tests: "El fixture `CASO-PIU-044-2B` satisface un predicado de dominio real; imprime `S44-T2-B PASS` y el assert booleano pasa.",
        feedback:
          "Tres digests distintos no son «casi alineados»: la attestation miente. Con len==1 y attestation True el happy path es PASS; el adverso de E2 activa REJECT_ATTESTATION.",
        retrospective:
          "Integridad medible por igualdad de digests, no por narrativa del README. El error clásico es creer que tres digests «parecidos» son suficientes. Pregunta: ¿por qué `attestation_valid` no basta si el set de digests tiene más de un elemento? Siguiente: valid / divergente / sin flag de attestation.",
        starterCode: {
          language: 'python',
          title: "s44-t2-b-e1.py",
          code: `# CASO-PIU-044 · SBOM/provenance digest match
# DEFECT: PASS si digests no coinciden entre sí
record = {"case_id": "CASO-PIU-044-2B", **{"artifact_digest":"sha256:aaa","sbom_digest":"sha256:aaa","provenance_subject":"sha256:aaa","attestation_valid":True}}
# DEFECT: digests de artifact/SBOM/provenance deben alinearse
meets_contract = len({record["artifact_digest"],record["sbom_digest"],record["provenance_subject"]}) > 1
status = "PASS" if meets_contract else "REJECT_ATTESTATION"
print("S44-T2-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s44-t2-b-e1.py",
          code: `record = {"case_id": "CASO-PIU-044-2B", **{"artifact_digest":"sha256:aaa","sbom_digest":"sha256:aaa","provenance_subject":"sha256:aaa","attestation_valid":True}}
meets_contract = len({record["artifact_digest"],record["sbom_digest"],record["provenance_subject"]}) == 1 and record["attestation_valid"]
status = "PASS" if meets_contract else "REJECT_ATTESTATION"
print("S44-T2-B", status)
assert meets_contract is True` ,
          output: `S44-T2-B PASS` ,
        },
      },
      {
        id: "S44-T2-B-E2",
        subtopicId: "S44-T2-B",
        kind: "independent",
        title: "Tres rutas de attestation",
        preamble:
          "- **Contexto:** el auditor de supply chain en Piura rechaza digests divergentes aunque el README diga OK.\n- **Meta:** assess PASS / REJECT_ATTESTATION / MISSING:attestation_valid.\n- **Éxito:** `PASS REJECT_ATTESTATION MISSING:attestation_valid`.\n- **Límites:** missing antes de leer attestation_valid; no inventes True; sintético.",
        instruction:
          "S44-T2-B-E2 · 1. Starter: PASS con digests divergentes (DEFECT).\n2. Corrige a len==1 y attestation_valid.\n3. Conserva MISSING.\n4. Imprime las tres salidas.",
        hint: "Primero se calcula `missing`; ningún acceso a attestation_valid debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a attestation_valid debe ocurrir antes de esa rama.",
          "Después aplica la regla de S44-T2-B: SBOM y provenance enlazados al mismo digest. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta attestation_valid", "fixture adverso: SBOM y provenance enlazados al mismo digest", "CASO-PIU-044-2B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `attestation_valid` ausente y produce exactamente `PASS REJECT_ATTESTATION MISSING:attestation_valid`.",
        feedback:
          "Falta el flag de attestation → schema; digests distintos → breach. Devolver PASS si «hay algún digest» no cierra la cadena de suministro.",
        retrospective:
          "Cadena íntegra solo con un subject compartido y attestation True. El error clásico es devolver PASS si «hay algún digest» aunque el set tenga tres valores. Pregunta: en el adverso con aaa/bbb/ccc, ¿qué campo miras primero después del schema? Luego: REBUILD_PROVENANCE.",
        starterCode: {
          language: 'python',
          title: "s44-t2-b-e2.py",
          code: `# CASO-PIU-044 · assess REJECT_ATTESTATION
# DEFECT: PASS con digests divergentes
def assess(record: dict) -> str:
    required = {"case_id", "artifact_digest", "sbom_digest", "provenance_subject", "attestation_valid"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if len({record["artifact_digest"],record["sbom_digest"],record["provenance_subject"]}) > 1 else "REJECT_ATTESTATION"

valid = {"case_id": "CASO-PIU-044-2B", **{"artifact_digest":"sha256:aaa","sbom_digest":"sha256:aaa","provenance_subject":"sha256:aaa","attestation_valid":True}}
invalid = {"case_id": "CASO-PIU-044-2B", **{"artifact_digest":"sha256:aaa","sbom_digest":"sha256:bbb","provenance_subject":"sha256:ccc","attestation_valid":False}}
incomplete = {**valid}
incomplete.pop("attestation_valid")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s44-t2-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "artifact_digest", "sbom_digest", "provenance_subject", "attestation_valid"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if len({record["artifact_digest"],record["sbom_digest"],record["provenance_subject"]}) == 1 and record["attestation_valid"] else "REJECT_ATTESTATION"

valid = {"case_id": "CASO-PIU-044-2B", **{"artifact_digest":"sha256:aaa","sbom_digest":"sha256:aaa","provenance_subject":"sha256:aaa","attestation_valid":True}}
invalid = {"case_id": "CASO-PIU-044-2B", **{"artifact_digest":"sha256:aaa","sbom_digest":"sha256:bbb","provenance_subject":"sha256:ccc","attestation_valid":False}}
incomplete = {**valid}
incomplete.pop("attestation_valid")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REJECT_ATTESTATION MISSING:attestation_valid` ,
        },
      },
      {
        id: "S44-T2-B-E3",
        subtopicId: "S44-T2-B",
        kind: "transfer",
        title: "Fail-closed: rebuild de provenance",
        preamble:
          "- **Contexto:** sin saber si la attestation es válida, Piura **reconstruye provenance**, no inventa un check verde.\n- **Meta:** decide CONTINUE / REJECT_ATTESTATION / REBUILD_PROVENANCE.\n- **Éxito:** `CONTINUE REJECT_ATTESTATION REBUILD_PROVENANCE`.\n- **Límites:** missing ≠ CONTINUE; no rellenes attestation_valid; no promuevas digest huérfano.",
        instruction:
          "S44-T2-B-E3 · Salida: debe devolver el PASS del contrato. 1. DEFECT: missing→CONTINUE; pred len>1.\n2. missing → REBUILD_PROVENANCE.\n3. Completos: CONTINUE solo si digests alineados + attestation; si no → REJECT.\n4. Imprime en orden.",
        hint: "Missing ≠ breach: enruta la ausencia de `attestation_valid` a `REBUILD_PROVENANCE` primero.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REBUILD_PROVENANCE` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró SBOM y provenance enlazados al mismo digest; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta attestation_valid", "fixture adverso: SBOM y provenance enlazados al mismo digest", "CASO-PIU-044-2B es sintético"],
        tests: "Fixtures `CASO-PIU-044-2B`, adverso y sin `attestation_valid` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "REJECT cierra la cadena rota; REBUILD pide rehacer evidencia. Copiar el SBOM del release anterior rompe CP-N4-B aunque el código «casi no cambió».",
        retrospective:
          "Sin saber si la attestation es válida, Piura reconstruye provenance: no inventa un check verde ni copia el SBOM del release anterior. El error clásico es CONTINUE cuando falta el flag. Pregunta: ¿por qué copiar el SBOM del release anterior rompe CP-N4-B aunque el código «casi no cambió»?",
        starterCode: {
          language: 'python',
          title: "s44-t2-b-e3.py",
          code: `# CASO-PIU-044 · decide REJECT_ATTESTATION
# DEFECT: missing→CONTINUE; pred invertido
def decide(record: dict) -> str:
    required = {"case_id", "artifact_digest", "sbom_digest", "provenance_subject", "attestation_valid"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if len({record["artifact_digest"],record["sbom_digest"],record["provenance_subject"]}) > 1 else "REJECT_ATTESTATION"

valid = {"case_id": "CASO-PIU-044-2B", **{"artifact_digest":"sha256:aaa","sbom_digest":"sha256:aaa","provenance_subject":"sha256:aaa","attestation_valid":True}}
invalid = {"case_id": "CASO-PIU-044-2B", **{"artifact_digest":"sha256:aaa","sbom_digest":"sha256:bbb","provenance_subject":"sha256:ccc","attestation_valid":False}}
uncertain = {**valid}
uncertain.pop("attestation_valid")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s44-t2-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "artifact_digest", "sbom_digest", "provenance_subject", "attestation_valid"}
    missing = sorted(required - record.keys())
    if missing:
        return "REBUILD_PROVENANCE"
    return "CONTINUE" if len({record["artifact_digest"],record["sbom_digest"],record["provenance_subject"]}) == 1 and record["attestation_valid"] else "REJECT_ATTESTATION"

valid = {"case_id": "CASO-PIU-044-2B", **{"artifact_digest":"sha256:aaa","sbom_digest":"sha256:aaa","provenance_subject":"sha256:aaa","attestation_valid":True}}
invalid = {"case_id": "CASO-PIU-044-2B", **{"artifact_digest":"sha256:aaa","sbom_digest":"sha256:bbb","provenance_subject":"sha256:ccc","attestation_valid":False}}
uncertain = {**valid}
uncertain.pop("attestation_valid")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_ATTESTATION", "REBUILD_PROVENANCE"]` ,
          output: `CONTINUE REJECT_ATTESTATION REBUILD_PROVENANCE` ,
        },
      },
      {
        id: "S44-T3-A-E1",
        subtopicId: "S44-T3-A",
        kind: "guided",
        title: "Mismo digest y aprobación independiente",
        preamble:
          "- **Contexto:** en CASO-PIU-044-3A staging aprobó `sha256:abc`; production solo se mueve con `release-owner` y el **mismo** digest.\n- **Meta:** corregir a staging→production + approved_by + digests idénticos.\n- **Éxito:** `S44-T3-A PASS`.\n- **Límites:** no mutes digests; no promuevas desde dev; DEFECT en el predicado.",
        instruction:
          "S44-T3-A-E1 · Salida: debe devolver el PASS del contrato. 1. Starter: PASS con not approved_by o digests != (DEFECT).\n2. Exige source staging, target production, bool(approved_by), tested==promoted.\n3. Conserva print.\n4. `S44-T3-A PASS`.",
        hint: "Staging → production, aprobador presente y digests idénticos (sin rebuild).",
        hints: [
          "Relaciona los campos `source_env`, `target_env`, `approved_by`, `tested_digest`, `promoted_digest` con la regla explicada en S44-T3-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva promoción sin rebuild y con aprobación; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta promoted_digest", "fixture adverso: el mismo digest probado y la aprobación independiente", "CASO-PIU-044-3A es sintético"],
        tests: "El fixture `CASO-PIU-044-3A` satisface un predicado de dominio real; imprime `S44-T3-A PASS` y el assert booleano pasa.",
        feedback:
          "Invertir el predicado hace que el happy path (aprobado y digests iguales) falle. Rebuild a otro digest con el mismo aprobador sigue siendo DENY en E2.",
        retrospective:
          "Promote mueve el subject testeado, no un binario nuevo. El error clásico es PASS sin `approved_by` o con digests distintos «porque el lead confía». Pregunta: ¿por qué staging→production importa y no basta un promote desde dev con el mismo digest? Siguiente: tres rutas con dev/sin approval/digest new.",
        starterCode: {
          language: 'python',
          title: "s44-t3-a-e1.py",
          code: `# CASO-PIU-044 · env promotion approvals
# DEFECT: PASS sin approved_by o digests distintos
record = {"case_id": "CASO-PIU-044-3A", **{"source_env":"staging","target_env":"production","approved_by":"release-owner","tested_digest":"sha256:abc","promoted_digest":"sha256:abc"}}
# DEFECT: promoción exige aprobación y mismo digest testeado
meets_contract = not record["approved_by"] or record["tested_digest"] != record["promoted_digest"]
status = "PASS" if meets_contract else "DENY_PROMOTION"
print("S44-T3-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s44-t3-a-e1.py",
          code: `record = {"case_id": "CASO-PIU-044-3A", **{"source_env":"staging","target_env":"production","approved_by":"release-owner","tested_digest":"sha256:abc","promoted_digest":"sha256:abc"}}
meets_contract = record["source_env"] == "staging" and record["target_env"] == "production" and bool(record["approved_by"]) and record["tested_digest"] == record["promoted_digest"]
status = "PASS" if meets_contract else "DENY_PROMOTION"
print("S44-T3-A", status)
assert meets_contract is True` ,
          output: `S44-T3-A PASS` ,
        },
      },
      {
        id: "S44-T3-A-E2",
        subtopicId: "S44-T3-A",
        kind: "independent",
        title: "Tres rutas de promoción",
        preamble:
          "- **Contexto:** el lead de ops en Piura pregunta «¿podemos promover?»: la respuesta es digests y aprobador, no el README.\n- **Meta:** assess PASS / DENY_PROMOTION / MISSING:promoted_digest.\n- **Éxito:** `PASS DENY_PROMOTION MISSING:promoted_digest`.\n- **Límites:** missing antes de leer promoted_digest; no inventes digest; sintético.",
        instruction:
          "S44-T3-A-E2 · 1. Starter: PASS con pred invertido (DEFECT).\n2. Aplica contrato T3-A completo.\n3. Conserva MISSING.\n4. Imprime las tres salidas.",
        hint: "Primero se calcula `missing`; ningún acceso a promoted_digest debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a promoted_digest debe ocurrir antes de esa rama.",
          "Después aplica la regla de S44-T3-A: el mismo digest probado y la aprobación independiente. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta promoted_digest", "fixture adverso: el mismo digest probado y la aprobación independiente", "CASO-PIU-044-3A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `promoted_digest` ausente y produce exactamente `PASS DENY_PROMOTION MISSING:promoted_digest`.",
        feedback:
          "Promover desde dev o con digest distinto es breach de contenido. Inventar promoted_digest para «cerrar el ticket» rompe el gate de release.",
        retrospective:
          "El gate de promote no es un warning de README: es igualdad de digests y aprobador independiente. El error clásico es inventar `promoted_digest` para cerrar el ticket. Pregunta: ¿qué le muestras al lead de Piura en 30 segundos además del aprobador? Luego: REQUEST_RELEASE_APPROVAL.",
        starterCode: {
          language: 'python',
          title: "s44-t3-a-e2.py",
          code: `# CASO-PIU-044 · assess DENY_PROMOTION
# DEFECT: PASS sin approval o digest mismatch
def assess(record: dict) -> str:
    required = {"case_id", "source_env", "target_env", "approved_by", "tested_digest", "promoted_digest"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if not record["approved_by"] or record["tested_digest"] != record["promoted_digest"] else "DENY_PROMOTION"

valid = {"case_id": "CASO-PIU-044-3A", **{"source_env":"staging","target_env":"production","approved_by":"release-owner","tested_digest":"sha256:abc","promoted_digest":"sha256:abc"}}
invalid = {"case_id": "CASO-PIU-044-3A", **{"source_env":"dev","target_env":"production","approved_by":"","tested_digest":"sha256:abc","promoted_digest":"sha256:new"}}
incomplete = {**valid}
incomplete.pop("promoted_digest")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s44-t3-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "source_env", "target_env", "approved_by", "tested_digest", "promoted_digest"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["source_env"] == "staging" and record["target_env"] == "production" and bool(record["approved_by"]) and record["tested_digest"] == record["promoted_digest"] else "DENY_PROMOTION"

valid = {"case_id": "CASO-PIU-044-3A", **{"source_env":"staging","target_env":"production","approved_by":"release-owner","tested_digest":"sha256:abc","promoted_digest":"sha256:abc"}}
invalid = {"case_id": "CASO-PIU-044-3A", **{"source_env":"dev","target_env":"production","approved_by":"","tested_digest":"sha256:abc","promoted_digest":"sha256:new"}}
incomplete = {**valid}
incomplete.pop("promoted_digest")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS DENY_PROMOTION MISSING:promoted_digest` ,
        },
      },
      {
        id: "S44-T3-A-E3",
        subtopicId: "S44-T3-A",
        kind: "transfer",
        title: "Fail-closed: pedir aprobación de release",
        preamble:
          "- **Contexto:** sin `promoted_digest` no se inventa uno: se **solicita aprobación de release** y se detiene el promote.\n- **Meta:** decide CONTINUE / DENY_PROMOTION / REQUEST_RELEASE_APPROVAL.\n- **Éxito:** `CONTINUE DENY_PROMOTION REQUEST_RELEASE_APPROVAL`.\n- **Límites:** missing ≠ CONTINUE; no rellenes digest; no rebuild al promover.",
        instruction:
          "S44-T3-A-E3 · Salida: debe devolver el PASS del contrato. 1. DEFECT: missing→CONTINUE; pred invertido.\n2. missing → REQUEST_RELEASE_APPROVAL.\n3. Completos: CONTINUE solo con contrato T3-A; si no → DENY.\n4. Imprime en orden.",
        hint: "Missing ≠ breach: enruta la ausencia de `promoted_digest` a `REQUEST_RELEASE_APPROVAL` primero.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_RELEASE_APPROVAL` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró el mismo digest probado y la aprobación independiente; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta promoted_digest", "fixture adverso: el mismo digest probado y la aprobación independiente", "CASO-PIU-044-3A es sintético"],
        tests: "Fixtures `CASO-PIU-044-3A`, adverso y sin `promoted_digest` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "REQUEST_* es incertidumbre humana; DENY_* cierra el anti-patrón de rebuild. Al lead de Piura le das digests iguales y aprobador, no un párrafo del README.",
        retrospective:
          "Sin `promoted_digest` no se inventa uno: se solicita aprobación de release y se detiene el promote. El error clásico es CONTINUE «mientras llega el digest». Pregunta: ¿qué evidencia le das al lead de Piura en 30 segundos para decir «sí, mismo digest»? Eso cierra el gate de promoción del You Do.",
        starterCode: {
          language: 'python',
          title: "s44-t3-a-e3.py",
          code: `# CASO-PIU-044 · decide DENY_PROMOTION
# DEFECT: missing→CONTINUE; pred invertido
def decide(record: dict) -> str:
    required = {"case_id", "source_env", "target_env", "approved_by", "tested_digest", "promoted_digest"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if not record["approved_by"] or record["tested_digest"] != record["promoted_digest"] else "DENY_PROMOTION"

valid = {"case_id": "CASO-PIU-044-3A", **{"source_env":"staging","target_env":"production","approved_by":"release-owner","tested_digest":"sha256:abc","promoted_digest":"sha256:abc"}}
invalid = {"case_id": "CASO-PIU-044-3A", **{"source_env":"dev","target_env":"production","approved_by":"","tested_digest":"sha256:abc","promoted_digest":"sha256:new"}}
uncertain = {**valid}
uncertain.pop("promoted_digest")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s44-t3-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "source_env", "target_env", "approved_by", "tested_digest", "promoted_digest"}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_RELEASE_APPROVAL"
    return "CONTINUE" if record["source_env"] == "staging" and record["target_env"] == "production" and bool(record["approved_by"]) and record["tested_digest"] == record["promoted_digest"] else "DENY_PROMOTION"

valid = {"case_id": "CASO-PIU-044-3A", **{"source_env":"staging","target_env":"production","approved_by":"release-owner","tested_digest":"sha256:abc","promoted_digest":"sha256:abc"}}
invalid = {"case_id": "CASO-PIU-044-3A", **{"source_env":"dev","target_env":"production","approved_by":"","tested_digest":"sha256:abc","promoted_digest":"sha256:new"}}
uncertain = {**valid}
uncertain.pop("promoted_digest")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "DENY_PROMOTION", "REQUEST_RELEASE_APPROVAL"]` ,
          output: `CONTINUE DENY_PROMOTION REQUEST_RELEASE_APPROVAL` ,
        },
      },
      {
        id: "S44-T3-B-E1",
        subtopicId: "S44-T3-B",
        kind: "guided",
        title: "Canary bajo umbral y rollback en RTO",
        preamble:
          "- **Contexto:** en CASO-PIU-044-3B el servicio de jobs de Piura canariza con 0.4% de error (umbral 1%) y rollback ensayado en 75 s (RTO 120).\n- **Meta:** migración compatible + error ≤ umbral + rollback_tested + segundos ≤ RTO.\n- **Éxito:** `S44-T3-B PASS`.\n- **Límites:** no mutes tasas; no ignores RTO; DEFECT en el predicado.",
        instruction:
          "S44-T3-B-E1 · Salida: debe devolver el PASS del contrato. 1. Starter: PASS con error alto o sin rollback (DEFECT).\n2. Invierte a AND del camino sano completo.\n3. Conserva print.\n4. `S44-T3-B PASS`.",
        hint: "Error rate ≤ umbral, rollback ensayado y segundos de rollback ≤ RTO.",
        hints: [
          "Relaciona los campos `migration_compatible`, `canary_error_rate`, `max_error_rate`, `rollback_tested`, `rollback_seconds`, `rto_seconds` con la regla explicada en S44-T3-B.",
          "El predicado correcto debe ser verdadero porque el fixture tiene canary sano bajo umbral y rollback ensayado dentro del RTO; revisa dirección de comparación y negaciones.",
        ],
        edgeCases: ["falta rto_seconds", "fixture adverso: migración compatible, canary bajo umbral y rollback dentro de RTO", "CASO-PIU-044-3B es sintético"],
        tests: "El fixture `CASO-PIU-044-3B` satisface un predicado de dominio real; imprime `S44-T3-B PASS` y el assert booleano pasa.",
        feedback:
          "El happy path tiene error bajo y rollback listo: si tu pred premia lo opuesto, el PASS real se convierte en ROLLBACK_RELEASE y el adverso de E2 «parece» sano.",
        retrospective:
          "Umbral medible + ensayo de rollback ≤ RTO son el contrato dual del canary. El error clásico es ampliar tráfico con error alto «para ver si se estabiliza». Pregunta: con 0.4% de error y rollback 75 s ≤ RTO 120, ¿por qué PASS no es lo mismo que «hold a ciegas»? Siguiente: adverso con 8% error y 500 s de rollback.",
        starterCode: {
          language: 'python',
          title: "s44-t3-b-e1.py",
          code: `# CASO-PIU-044 · canary error + rollback
# DEFECT: PASS si error_rate>max o rollback no tested
record = {"case_id": "CASO-PIU-044-3B", **{"migration_compatible":True,"canary_error_rate":0.004,"max_error_rate":0.01,"rollback_tested":True,"rollback_seconds":75,"rto_seconds":120}}
# DEFECT: canary sobre umbral o rollback no probado bloquea
meets_contract = record["canary_error_rate"] > record["max_error_rate"] or not record["rollback_tested"]
status = "PASS" if meets_contract else "ROLLBACK_RELEASE"
print("S44-T3-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s44-t3-b-e1.py",
          code: `record = {"case_id": "CASO-PIU-044-3B", **{"migration_compatible":True,"canary_error_rate":0.004,"max_error_rate":0.01,"rollback_tested":True,"rollback_seconds":75,"rto_seconds":120}}
meets_contract = record["migration_compatible"] and record["canary_error_rate"] <= record["max_error_rate"] and record["rollback_tested"] and record["rollback_seconds"] <= record["rto_seconds"]
status = "PASS" if meets_contract else "ROLLBACK_RELEASE"
print("S44-T3-B", status)
assert meets_contract is True` ,
          output: `S44-T3-B PASS` ,
        },
      },
      {
        id: "S44-T3-B-E2",
        subtopicId: "S44-T3-B",
        kind: "independent",
        title: "Tres rutas de canary y rollback",
        preamble:
          "- **Contexto:** un canary de Piura al 8% de error con rollback no ensayado no se «hold»: se clasifica como release a revertir.\n- **Meta:** assess PASS / ROLLBACK_RELEASE / MISSING:rto_seconds.\n- **Éxito:** `PASS ROLLBACK_RELEASE MISSING:rto_seconds`.\n- **Límites:** missing antes de rto_seconds; no inventes RTO; sintético.",
        instruction:
          "S44-T3-B-E2 · 1. Starter: PASS con pred invertido (DEFECT).\n2. Aplica contrato T3-B completo.\n3. Conserva MISSING.\n4. Imprime las tres salidas.",
        hint: "Primero se calcula `missing`; ningún acceso a rto_seconds debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a rto_seconds debe ocurrir antes de esa rama.",
          "Después aplica la regla de S44-T3-B: migración compatible, canary bajo umbral y rollback dentro de RTO. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta rto_seconds", "fixture adverso: migración compatible, canary bajo umbral y rollback dentro de RTO", "CASO-PIU-044-3B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `rto_seconds` ausente y produce exactamente `PASS ROLLBACK_RELEASE MISSING:rto_seconds`.",
        feedback:
          "Breach de canary/rollback ≠ falta de RTO (schema). Ampliar tráfico sin RTO medible es el error que este assess separa del incidente real.",
        retrospective:
          "Breach de canary/rollback no es falta de RTO: el adverso con 8% error y rollback no ensayado es incidente; sin `rto_seconds` es schema. El error clásico es ampliar tráfico sin RTO medible. Pregunta: si error está bajo umbral pero `rollback_seconds` es 500 y RTO 120, ¿PASS o ROLLBACK? Luego: PAUSE_CANARY.",
        starterCode: {
          language: 'python',
          title: "s44-t3-b-e2.py",
          code: `# CASO-PIU-044 · assess ROLLBACK_RELEASE
# DEFECT: PASS con canary roto o sin rollback
def assess(record: dict) -> str:
    required = {"case_id", "migration_compatible", "canary_error_rate", "max_error_rate", "rollback_tested", "rollback_seconds", "rto_seconds"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["canary_error_rate"] > record["max_error_rate"] or not record["rollback_tested"] else "ROLLBACK_RELEASE"

valid = {"case_id": "CASO-PIU-044-3B", **{"migration_compatible":True,"canary_error_rate":0.004,"max_error_rate":0.01,"rollback_tested":True,"rollback_seconds":75,"rto_seconds":120}}
invalid = {"case_id": "CASO-PIU-044-3B", **{"migration_compatible":False,"canary_error_rate":0.08,"max_error_rate":0.01,"rollback_tested":False,"rollback_seconds":500,"rto_seconds":120}}
incomplete = {**valid}
incomplete.pop("rto_seconds")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s44-t3-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "migration_compatible", "canary_error_rate", "max_error_rate", "rollback_tested", "rollback_seconds", "rto_seconds"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["migration_compatible"] and record["canary_error_rate"] <= record["max_error_rate"] and record["rollback_tested"] and record["rollback_seconds"] <= record["rto_seconds"] else "ROLLBACK_RELEASE"

valid = {"case_id": "CASO-PIU-044-3B", **{"migration_compatible":True,"canary_error_rate":0.004,"max_error_rate":0.01,"rollback_tested":True,"rollback_seconds":75,"rto_seconds":120}}
invalid = {"case_id": "CASO-PIU-044-3B", **{"migration_compatible":False,"canary_error_rate":0.08,"max_error_rate":0.01,"rollback_tested":False,"rollback_seconds":500,"rto_seconds":120}}
incomplete = {**valid}
incomplete.pop("rto_seconds")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS ROLLBACK_RELEASE MISSING:rto_seconds` ,
        },
      },
      {
        id: "S44-T3-B-E3",
        subtopicId: "S44-T3-B",
        kind: "transfer",
        title: "Fail-closed: pausar canary sin RTO",
        preamble:
          "- **Contexto:** sin `rto_seconds` no sabes si el ensayo de rollback de Piura fue a tiempo: **pausas el canary**, no continúas el release.\n- **Meta:** decide CONTINUE / ROLLBACK_RELEASE / PAUSE_CANARY.\n- **Éxito:** `CONTINUE ROLLBACK_RELEASE PAUSE_CANARY`.\n- **Límites:** missing ≠ CONTINUE; no inventes RTO; no ignores error alto.",
        instruction:
          "S44-T3-B-E3 · Salida: debe devolver el PASS del contrato. 1. DEFECT: missing→CONTINUE; pred invertido.\n2. missing → PAUSE_CANARY.\n3. Completos: CONTINUE solo con contrato sano; si no → ROLLBACK_RELEASE.\n4. Imprime en orden.",
        hint: "Missing ≠ breach: enruta la ausencia de `rto_seconds` a `PAUSE_CANARY` primero.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `PAUSE_CANARY` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró migración compatible, canary bajo umbral y rollback dentro de RTO; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta rto_seconds", "fixture adverso: migración compatible, canary bajo umbral y rollback dentro de RTO", "CASO-PIU-044-3B es sintético"],
        tests: "Fixtures `CASO-PIU-044-3B`, adverso y sin `rto_seconds` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "PAUSE_* es incertidumbre operativa; ROLLBACK_* es incidente medible. En el portfolio de CP-N4-B demuestras log de canary y ensayo de rollback, no un hold a ciegas.",
        retrospective:
          "Sin `rto_seconds` no sabes si el ensayo de rollback fue a tiempo: pausas el canary. El error clásico es CONTINUE «porque el error aún no superó el umbral». Pregunta: ¿qué log mínimo demuestras en el portfolio de canary/rollback de CP-N4-B?",
        starterCode: {
          language: 'python',
          title: "s44-t3-b-e3.py",
          code: `# CASO-PIU-044 · decide ROLLBACK_RELEASE
# DEFECT: missing→CONTINUE; pred invertido
def decide(record: dict) -> str:
    required = {"case_id", "migration_compatible", "canary_error_rate", "max_error_rate", "rollback_tested", "rollback_seconds", "rto_seconds"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["canary_error_rate"] > record["max_error_rate"] or not record["rollback_tested"] else "ROLLBACK_RELEASE"

valid = {"case_id": "CASO-PIU-044-3B", **{"migration_compatible":True,"canary_error_rate":0.004,"max_error_rate":0.01,"rollback_tested":True,"rollback_seconds":75,"rto_seconds":120}}
invalid = {"case_id": "CASO-PIU-044-3B", **{"migration_compatible":False,"canary_error_rate":0.08,"max_error_rate":0.01,"rollback_tested":False,"rollback_seconds":500,"rto_seconds":120}}
uncertain = {**valid}
uncertain.pop("rto_seconds")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s44-t3-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "migration_compatible", "canary_error_rate", "max_error_rate", "rollback_tested", "rollback_seconds", "rto_seconds"}
    missing = sorted(required - record.keys())
    if missing:
        return "PAUSE_CANARY"
    return "CONTINUE" if record["migration_compatible"] and record["canary_error_rate"] <= record["max_error_rate"] and record["rollback_tested"] and record["rollback_seconds"] <= record["rto_seconds"] else "ROLLBACK_RELEASE"

valid = {"case_id": "CASO-PIU-044-3B", **{"migration_compatible":True,"canary_error_rate":0.004,"max_error_rate":0.01,"rollback_tested":True,"rollback_seconds":75,"rto_seconds":120}}
invalid = {"case_id": "CASO-PIU-044-3B", **{"migration_compatible":False,"canary_error_rate":0.08,"max_error_rate":0.01,"rollback_tested":False,"rollback_seconds":500,"rto_seconds":120}}
uncertain = {**valid}
uncertain.pop("rto_seconds")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "ROLLBACK_RELEASE", "PAUSE_CANARY"]` ,
          output: `CONTINUE ROLLBACK_RELEASE PAUSE_CANARY` ,
        },
      },
      {
        id: "S44-T4-A-E1",
        subtopicId: "S44-T4-A",
        kind: "guided",
        title: "Branch protegida y notes operables",
        preamble:
          "- **Contexto:** en CASO-PIU-044-4A main de Piura exige 2 reviews, checks de CI y notes con cambio, riesgo, migración y rollback.\n- **Meta:** protected_branch + reviews ≥1 + required_checks + set de notes completo.\n- **Éxito:** `S44-T4-A PASS`.\n- **Límites:** no mutes el set de notes; no aceptes notes solo con `change`; DEFECT en el pred.",
        instruction:
          "S44-T4-A-E1 · Salida: debe devolver el PASS del contrato. 1. Starter: PASS sin protección o reviews==0 (DEFECT).\n2. Exige protected True, reviews ≥1, checks True, notes ⊇ {change, risk, migration, rollback}.\n3. Conserva print.\n4. `S44-T4-A PASS`.",
        hint: "Branch protegida, ≥1 review, checks activos y notes con change/risk/migration/rollback.",
        hints: [
          "Relaciona los campos `protected_branch`, `required_reviews`, `required_checks`, `release_notes` con la regla explicada en S44-T4-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva release trazable a review y changelog; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta release_notes", "fixture adverso: branch protegida, review/checks y notas operables", "CASO-PIU-044-4A es sintético"],
        tests: "El fixture `CASO-PIU-044-4A` satisface un predicado de dominio real; imprime `S44-T4-A PASS` y el assert booleano pasa.",
        feedback:
          "El happy path tiene branch protegida y notes completas: si tu pred premia lo opuesto, el PASS real se vuelve BLOCK_UNREVIEWED_RELEASE. El adverso de E2 (sin protección, notes solo con `change`) debe fallar aunque el dict «se vea de release».",
        retrospective:
          "Trazabilidad de release = protección + reviews + notes operables. El error clásico es merge directo a main «porque el CI ya pasó». Pregunta: ¿por qué `required_checks` no basta sin el set de notes? Siguiente: adverso sin protección y notes solo con change.",
        starterCode: {
          language: 'python',
          title: "s44-t4-a-e1.py",
          code: `# CASO-PIU-044 · branch protection + reviews
# DEFECT: PASS sin protected_branch o reviews==0
record = {"case_id": "CASO-PIU-044-4A", **{"protected_branch":True,"required_reviews":2,"required_checks":True,"release_notes":{"change","risk","migration","rollback"}}}
# DEFECT: branch protection con reviews requeridas
meets_contract = not record["protected_branch"] or record["required_reviews"] == 0
status = "PASS" if meets_contract else "BLOCK_UNREVIEWED_RELEASE"
print("S44-T4-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s44-t4-a-e1.py",
          code: `record = {"case_id": "CASO-PIU-044-4A", **{"protected_branch":True,"required_reviews":2,"required_checks":True,"release_notes":{"change","risk","migration","rollback"}}}
meets_contract = record["protected_branch"] and record["required_reviews"] >= 1 and record["required_checks"] and {"change","risk","migration","rollback"} <= record["release_notes"]
status = "PASS" if meets_contract else "BLOCK_UNREVIEWED_RELEASE"
print("S44-T4-A", status)
assert meets_contract is True` ,
          output: `S44-T4-A PASS` ,
        },
      },
      {
        id: "S44-T4-A-E2",
        subtopicId: "S44-T4-A",
        kind: "independent",
        title: "Tres rutas de release trazable",
        preamble:
          "- **Contexto:** merge directo a main sin protección o notes incompletas deja al on-call de Piura sin mapa.\n- **Meta:** assess PASS / BLOCK_UNREVIEWED_RELEASE / MISSING:release_notes.\n- **Éxito:** `PASS BLOCK_UNREVIEWED_RELEASE MISSING:release_notes`.\n- **Límites:** missing antes de release_notes; no inventes el set; sintético.",
        instruction:
          "S44-T4-A-E2 · 1. Starter: PASS con pred invertido (DEFECT).\n2. Aplica contrato T4-A completo.\n3. Conserva MISSING.\n4. Imprime las tres salidas.",
        hint: "Primero se calcula `missing`; ningún acceso a release_notes debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a release_notes debe ocurrir antes de esa rama.",
          "Después aplica la regla de S44-T4-A: branch protegida, review/checks y notas operables. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta release_notes", "fixture adverso: branch protegida, review/checks y notas operables", "CASO-PIU-044-4A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `release_notes` ausente y produce exactamente `PASS BLOCK_UNREVIEWED_RELEASE MISSING:release_notes`.",
        feedback:
          "Notes solo con `change` son breach de contenido, no «casi completas». El on-call a las 02:00 necesita risk, migration y rollback.",
        retrospective:
          "El on-call a las 02:00 necesita risk, migration y rollback — no un párrafo de «mejoras». El error clásico es inventar el set en el assessor cuando falta el mapa. Pregunta: si falta `release_notes` del todo, ¿qué código devuelves antes de mirar reviews? Luego: COMPLETE_RELEASE_NOTES.",
        starterCode: {
          language: 'python',
          title: "s44-t4-a-e2.py",
          code: `# CASO-PIU-044 · assess BLOCK_UNREVIEWED_RELEASE
# DEFECT: PASS sin protección o sin reviews
def assess(record: dict) -> str:
    required = {"case_id", "protected_branch", "required_reviews", "required_checks", "release_notes"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if not record["protected_branch"] or record["required_reviews"] == 0 else "BLOCK_UNREVIEWED_RELEASE"

valid = {"case_id": "CASO-PIU-044-4A", **{"protected_branch":True,"required_reviews":2,"required_checks":True,"release_notes":{"change","risk","migration","rollback"}}}
invalid = {"case_id": "CASO-PIU-044-4A", **{"protected_branch":False,"required_reviews":0,"required_checks":False,"release_notes":{"change"}}}
incomplete = {**valid}
incomplete.pop("release_notes")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s44-t4-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "protected_branch", "required_reviews", "required_checks", "release_notes"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["protected_branch"] and record["required_reviews"] >= 1 and record["required_checks"] and {"change","risk","migration","rollback"} <= record["release_notes"] else "BLOCK_UNREVIEWED_RELEASE"

valid = {"case_id": "CASO-PIU-044-4A", **{"protected_branch":True,"required_reviews":2,"required_checks":True,"release_notes":{"change","risk","migration","rollback"}}}
invalid = {"case_id": "CASO-PIU-044-4A", **{"protected_branch":False,"required_reviews":0,"required_checks":False,"release_notes":{"change"}}}
incomplete = {**valid}
incomplete.pop("release_notes")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS BLOCK_UNREVIEWED_RELEASE MISSING:release_notes` ,
        },
      },
      {
        id: "S44-T4-A-E3",
        subtopicId: "S44-T4-A",
        kind: "transfer",
        title: "Fail-closed: completar release notes",
        preamble:
          "- **Contexto:** sin el mapa `release_notes` no se inventa un set: se exige **completar notes** antes de liberar.\n- **Meta:** decide CONTINUE / BLOCK_UNREVIEWED_RELEASE / COMPLETE_RELEASE_NOTES.\n- **Éxito:** `CONTINUE BLOCK_UNREVIEWED_RELEASE COMPLETE_RELEASE_NOTES`.\n- **Límites:** missing ≠ CONTINUE; no rellenes notes; no merges sin protección.",
        instruction:
          "S44-T4-A-E3 · Salida: debe devolver el PASS del contrato. 1. DEFECT: missing→CONTINUE; pred invertido.\n2. missing → COMPLETE_RELEASE_NOTES.\n3. Completos: CONTINUE solo con contrato T4-A; si no → BLOCK.\n4. Imprime en orden.",
        hint: "Missing ≠ breach: enruta la ausencia de `release_notes` a `COMPLETE_RELEASE_NOTES` primero.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `COMPLETE_RELEASE_NOTES` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró branch protegida, review/checks y notas operables; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta release_notes", "fixture adverso: branch protegida, review/checks y notas operables", "CASO-PIU-044-4A es sintético"],
        tests: "Fixtures `CASO-PIU-044-4A`, adverso y sin `release_notes` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "COMPLETE_* pide evidencia operativa; BLOCK_* cierra merge inseguro. La frase de rollback en las notes es lo que el on-call ejecuta a las 02:00.",
        retrospective:
          "Sin el mapa `release_notes` no se inventa un set: se exige completar notes antes de liberar. El error clásico es CONTINUE «mientras el PM escribe el changelog». Pregunta: ¿qué frase de rollback escribiste en las notes que el on-call pueda ejecutar a las 02:00?",
        starterCode: {
          language: 'python',
          title: "s44-t4-a-e3.py",
          code: `# CASO-PIU-044 · decide BLOCK_UNREVIEWED_RELEASE
# DEFECT: missing→CONTINUE; pred invertido
def decide(record: dict) -> str:
    required = {"case_id", "protected_branch", "required_reviews", "required_checks", "release_notes"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if not record["protected_branch"] or record["required_reviews"] == 0 else "BLOCK_UNREVIEWED_RELEASE"

valid = {"case_id": "CASO-PIU-044-4A", **{"protected_branch":True,"required_reviews":2,"required_checks":True,"release_notes":{"change","risk","migration","rollback"}}}
invalid = {"case_id": "CASO-PIU-044-4A", **{"protected_branch":False,"required_reviews":0,"required_checks":False,"release_notes":{"change"}}}
uncertain = {**valid}
uncertain.pop("release_notes")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s44-t4-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "protected_branch", "required_reviews", "required_checks", "release_notes"}
    missing = sorted(required - record.keys())
    if missing:
        return "COMPLETE_RELEASE_NOTES"
    return "CONTINUE" if record["protected_branch"] and record["required_reviews"] >= 1 and record["required_checks"] and {"change","risk","migration","rollback"} <= record["release_notes"] else "BLOCK_UNREVIEWED_RELEASE"

valid = {"case_id": "CASO-PIU-044-4A", **{"protected_branch":True,"required_reviews":2,"required_checks":True,"release_notes":{"change","risk","migration","rollback"}}}
invalid = {"case_id": "CASO-PIU-044-4A", **{"protected_branch":False,"required_reviews":0,"required_checks":False,"release_notes":{"change"}}}
uncertain = {**valid}
uncertain.pop("release_notes")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "BLOCK_UNREVIEWED_RELEASE", "COMPLETE_RELEASE_NOTES"]` ,
          output: `CONTINUE BLOCK_UNREVIEWED_RELEASE COMPLETE_RELEASE_NOTES` ,
        },
      },
      {
        id: "S44-T4-B-E1",
        subtopicId: "S44-T4-B",
        kind: "guided",
        title: "Fallo crítico bloquea con evidencia",
        preamble:
          "- **Contexto:** en CASO-PIU-044-4B un test de integración crítico falla: el workflow marca block, retiene log+artifact, owner `release` y logs redactados.\n- **Meta:** critical + blocked + redacted + owner truthy + evidence_retained.\n- **Éxito:** `S44-T4-B PASS`.\n- **Límites:** no mutes el fixture; no borres el trace; DEFECT en el pred.",
        instruction:
          "S44-T4-B-E1 · Salida: debe devolver el PASS del contrato. 1. Starter: PASS si critical y not pipeline_blocked (DEFECT).\n2. Exige AND de blocked, redacted, owner, evidence.\n3. Conserva print.\n4. `S44-T4-B PASS`.",
        hint: "Crítico + pipeline bloqueado + logs redactados + owner + evidencia retenida.",
        hints: [
          "Relaciona los campos `critical_failure`, `pipeline_blocked`, `logs_redacted`, `owner`, `evidence_retained` con la regla explicada en S44-T4-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva esto: un fallo crítico bloquea el pipeline y deja evidencia auditable. Revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta evidence_retained", "fixture adverso: fallo crítico bloquea con logs redactados y dueño", "CASO-PIU-044-4B es sintético"],
        tests: "El fixture `CASO-PIU-044-4B` satisface un predicado de dominio real; imprime `S44-T4-B PASS` y el assert booleano pasa.",
        feedback:
          "Un crítico sin bloqueo es el anti-patrón de aprobación silenciosa. Con el pred correcto el happy path (blocked + evidencia) es PASS; el adverso de E2 activa STOP_SILENT_FAILURE.",
        retrospective:
          "Auditabilidad = dueño + logs redactados + artifact retenido, no solo «el job falló». El error clásico es PASS si critical y el pipeline sigue verde (continue-on-error). Pregunta: ¿por qué `logs_redacted` importa tanto como `pipeline_blocked`? Siguiente: adverso sin bloqueo, sin redaction, owner vacío.",
        starterCode: {
          language: 'python',
          title: "s44-t4-b-e1.py",
          code: `# CASO-PIU-044 · critical failure blocks pipeline
# DEFECT: PASS si critical_failure y pipeline no blocked
record = {"case_id": "CASO-PIU-044-4B", **{"critical_failure":True,"pipeline_blocked":True,"logs_redacted":True,"owner":"release","evidence_retained":True}}
# DEFECT: fallo crítico debe bloquear el pipeline
meets_contract = record["critical_failure"] and not record["pipeline_blocked"]
status = "PASS" if meets_contract else "STOP_SILENT_FAILURE"
print("S44-T4-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s44-t4-b-e1.py",
          code: `record = {"case_id": "CASO-PIU-044-4B", **{"critical_failure":True,"pipeline_blocked":True,"logs_redacted":True,"owner":"release","evidence_retained":True}}
meets_contract = record["critical_failure"] and record["pipeline_blocked"] and record["logs_redacted"] and bool(record["owner"]) and record["evidence_retained"]
status = "PASS" if meets_contract else "STOP_SILENT_FAILURE"
print("S44-T4-B", status)
assert meets_contract is True` ,
          output: `S44-T4-B PASS` ,
        },
      },
      {
        id: "S44-T4-B-E2",
        subtopicId: "S44-T4-B",
        kind: "independent",
        title: "Tres rutas de fallo auditable",
        preamble:
          "- **Contexto:** un fallo sin dueño ni evidencia en Piura es un incidente que se olvida hasta el siguiente outage.\n- **Meta:** assess PASS / STOP_SILENT_FAILURE / MISSING:evidence_retained.\n- **Éxito:** `PASS STOP_SILENT_FAILURE MISSING:evidence_retained`.\n- **Límites:** missing antes de evidence_retained; no inventes owner; sintético.",
        instruction:
          "S44-T4-B-E2 · 1. Starter: PASS con critical y not blocked (DEFECT).\n2. Aplica contrato T4-B completo.\n3. Conserva MISSING.\n4. Imprime las tres salidas.",
        hint: "Primero se calcula `missing`; ningún acceso a evidence_retained debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a evidence_retained debe ocurrir antes de esa rama.",
          "Después aplica la regla de S44-T4-B: fallo crítico bloquea con logs redactados y dueño. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta evidence_retained", "fixture adverso: fallo crítico bloquea con logs redactados y dueño", "CASO-PIU-044-4B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `evidence_retained` ausente y produce exactamente `PASS STOP_SILENT_FAILURE MISSING:evidence_retained`.",
        feedback:
          "Breach silencioso (sin bloqueo/redaction/owner) ≠ falta del flag de evidencia (schema). No inventes owner para «cerrar el ticket» del incidente.",
        retrospective:
          "Breach silencioso (sin bloqueo/redaction/owner) no es lo mismo que falta del flag `evidence_retained`. El error clásico es inventar owner para «cerrar el ticket» del incidente. Pregunta: en el adverso con `pipeline_blocked=False` y owner vacío, ¿qué código devuelves y por qué no es MISSING? Luego: ASSIGN_INCIDENT_OWNER.",
        starterCode: {
          language: 'python',
          title: "s44-t4-b-e2.py",
          code: `# CASO-PIU-044 · assess STOP_SILENT_FAILURE
# DEFECT: PASS con fallo crítico sin bloqueo
def assess(record: dict) -> str:
    required = {"case_id", "critical_failure", "pipeline_blocked", "logs_redacted", "owner", "evidence_retained"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["critical_failure"] and not record["pipeline_blocked"] else "STOP_SILENT_FAILURE"

valid = {"case_id": "CASO-PIU-044-4B", **{"critical_failure":True,"pipeline_blocked":True,"logs_redacted":True,"owner":"release","evidence_retained":True}}
invalid = {"case_id": "CASO-PIU-044-4B", **{"critical_failure":True,"pipeline_blocked":False,"logs_redacted":False,"owner":"","evidence_retained":False}}
incomplete = {**valid}
incomplete.pop("evidence_retained")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s44-t4-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "critical_failure", "pipeline_blocked", "logs_redacted", "owner", "evidence_retained"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["critical_failure"] and record["pipeline_blocked"] and record["logs_redacted"] and bool(record["owner"]) and record["evidence_retained"] else "STOP_SILENT_FAILURE"

valid = {"case_id": "CASO-PIU-044-4B", **{"critical_failure":True,"pipeline_blocked":True,"logs_redacted":True,"owner":"release","evidence_retained":True}}
invalid = {"case_id": "CASO-PIU-044-4B", **{"critical_failure":True,"pipeline_blocked":False,"logs_redacted":False,"owner":"","evidence_retained":False}}
incomplete = {**valid}
incomplete.pop("evidence_retained")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS STOP_SILENT_FAILURE MISSING:evidence_retained` ,
        },
      },
      {
        id: "S44-T4-B-E3",
        subtopicId: "S44-T4-B",
        kind: "transfer",
        title: "Fail-closed: asignar dueño del incidente",
        preamble:
          "- **Contexto:** sin `evidence_retained` no se reintenta a ciegas: se **asigna dueño de incidente** y se retiene el rastro.\n- **Meta:** decide CONTINUE / STOP_SILENT_FAILURE / ASSIGN_INCIDENT_OWNER.\n- **Éxito:** `CONTINUE STOP_SILENT_FAILURE ASSIGN_INCIDENT_OWNER`.\n- **Límites:** missing ≠ CONTINUE; no inventes evidencia; no continue-on-error.",
        instruction:
          "S44-T4-B-E3 · Salida: debe devolver el PASS del contrato. 1. DEFECT: missing→CONTINUE; pred de crítico sin bloqueo.\n2. missing → ASSIGN_INCIDENT_OWNER.\n3. Completos: CONTINUE solo con contrato T4-B; si no → STOP_SILENT_FAILURE.\n4. Imprime en orden.",
        hint: "Missing ≠ breach: enruta la ausencia de `evidence_retained` a `ASSIGN_INCIDENT_OWNER` primero.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `ASSIGN_INCIDENT_OWNER` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró fallo crítico bloquea con logs redactados y dueño; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta evidence_retained", "fixture adverso: fallo crítico bloquea con logs redactados y dueño", "CASO-PIU-044-4B es sintético"],
        tests: "Fixtures `CASO-PIU-044-4B`, adverso y sin `evidence_retained` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "ASSIGN_* es incertidumbre de ownership; STOP_* cierra el silencioso. En You Do/CP-N4-B demuestras dueño y artifact retenido, no un reintento a ciegas.",
        retrospective:
          "Sin `evidence_retained` no se reintenta a ciegas: se asigna dueño de incidente y se retiene el rastro. El error clásico es CONTINUE o continue-on-error cuando falta evidencia. Pregunta de You Do: ¿qué owner y qué artifact retienes cuando el test crítico de tu portfolio falla?",
        starterCode: {
          language: 'python',
          title: "s44-t4-b-e3.py",
          code: `# CASO-PIU-044 · decide STOP_SILENT_FAILURE
# DEFECT: missing→CONTINUE; pred invertido
def decide(record: dict) -> str:
    required = {"case_id", "critical_failure", "pipeline_blocked", "logs_redacted", "owner", "evidence_retained"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["critical_failure"] and not record["pipeline_blocked"] else "STOP_SILENT_FAILURE"

valid = {"case_id": "CASO-PIU-044-4B", **{"critical_failure":True,"pipeline_blocked":True,"logs_redacted":True,"owner":"release","evidence_retained":True}}
invalid = {"case_id": "CASO-PIU-044-4B", **{"critical_failure":True,"pipeline_blocked":False,"logs_redacted":False,"owner":"","evidence_retained":False}}
uncertain = {**valid}
uncertain.pop("evidence_retained")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s44-t4-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "critical_failure", "pipeline_blocked", "logs_redacted", "owner", "evidence_retained"}
    missing = sorted(required - record.keys())
    if missing:
        return "ASSIGN_INCIDENT_OWNER"
    return "CONTINUE" if record["critical_failure"] and record["pipeline_blocked"] and record["logs_redacted"] and bool(record["owner"]) and record["evidence_retained"] else "STOP_SILENT_FAILURE"

valid = {"case_id": "CASO-PIU-044-4B", **{"critical_failure":True,"pipeline_blocked":True,"logs_redacted":True,"owner":"release","evidence_retained":True}}
invalid = {"case_id": "CASO-PIU-044-4B", **{"critical_failure":True,"pipeline_blocked":False,"logs_redacted":False,"owner":"","evidence_retained":False}}
uncertain = {**valid}
uncertain.pop("evidence_retained")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "STOP_SILENT_FAILURE", "ASSIGN_INCIDENT_OWNER"]` ,
          output: `CONTINUE STOP_SILENT_FAILURE ASSIGN_INCIDENT_OWNER` ,
        },
      },
    ],
  },
  youDo: {
    title: "CI/CD y seguridad de la cadena de suministro",
    context: "Pipeline CI/CD con supply-chain gates. Trabaja sobre un repositorio ficticio de servicio de operaciones en Piura. Entrada: commit revisado, dependencias fijadas y workflow con permisos mínimos. Salida: artefacto identificado por digest, SBOM, provenance y evidencia de promoción o rollback. El gate bloquea la publicación si hay test crítico rojo, secreto en logs, dependencia insegura sin pin o attestation ausente. El checklist del starter inicia en BLOCKED hasta que enlaces archivos reales de evidencia.",
    objectives: [
      "Convertir commit revisado, dependencias fijadas y workflow con permisos mínimos en artefacto identificado por digest, SBOM, provenance y evidencia de promoción o rollback.",
      "Demostrar el gate: el pipeline reproduce el artefacto, exige aprobación y demuestra rollback en staging.",
      "Probar el fallo: test crítico rojo, secreto en logs, dependencia insegura sin pin o attestation ausente bloquean publicar.",
      "Entregar evidencia reproducible, redactada, sin PII real, secretos ni servicios externos obligatorios.",
    ],
    requirements: [
      "Usa exclusivamente fixtures sintéticos identificados por `CASO-PIU-044`.",
      "Incluye matriz lint/types/tests con artifacts.",
      "Incluye workflow con pinning por SHA completo y permisos mínimos.",
      "Incluye SBOM/provenance ligados al digest.",
      "Incluye canary de prueba y rollback auditado dentro del RTO.",
      "Automatiza un caso normal (PASS/CONTINUE), uno de breach (código de gate del subtema, p. ej. FAIL_CI_GATE o REJECT_ATTESTATION) y uno incierto (revisión humana, p. ej. REQUEST_RELEASE_APPROVAL).",
      "Incluye comandos locales reproducibles, dependencias fijadas y salida esperada.",
      "Registra riesgo residual, responsable, criterio de rollback y limitaciones conocidas.",
    ],
    starterCode: `CASE_ID = "CASO-PIU-044"
# Mini-layout de portfolio (crea estos paths reales en tu repo de evidencia)
ARTIFACTS = {
    "workflow": ".github/workflows/ci-supply-chain.yml",
    "sbom": "dist/sbom.spdx.json",
    "provenance": "dist/provenance.json",
    "canary_log": "ops/canary-rollback.md",
}

def full_sha_pin(action_ref: str) -> bool:
    ref = action_ref.split("@")[-1] if "@" in action_ref else ""
    return len(ref) == 40 and all(c in "0123456789abcdef" for c in ref.lower())

def ci_matrix_ok(results: dict, matrix: set, supported: set) -> bool:
    return all(results.get(k) for k in ("lint", "types", "tests")) and matrix == supported

def supply_chain_ok(artifact: str, sbom: str, subject: str, attestation_valid: bool) -> bool:
    return attestation_valid and bool(artifact) and len({artifact, sbom, subject}) == 1

def promote_ok(tested: str, promoted: str, approved_by: str) -> bool:
    return bool(approved_by) and tested == promoted and tested.startswith("sha256:")

def canary_ok(error_rate: float, max_rate: float, rollback_s: int, rto: int) -> bool:
    return error_rate <= max_rate and rollback_s <= rto

def portfolio_ready(flags: dict[str, bool]) -> tuple[str, list[str]]:
    required = [
        "matriz_lint_types_tests_con_artifacts",
        "workflow_con_pinning_y_permisos_minimos",
        "sbom_provenance_ligados_al_digest",
        "canary_de_prueba_y_rollback_auditado",
    ]
    missing = [k for k in required if flags.get(k) is not True]
    return ("READY", []) if not missing else ("BLOCKED", missing)

def gate_case(kind: str) -> str:
    # normal | breach | uncertain — no inventes PASS sin evidencia de archivo
    if kind == "normal":
        return "CONTINUE"
    if kind == "breach":
        return "REJECT_ATTESTATION"  # o FAIL_CI_GATE / ROLLBACK_RELEASE según el fallo
    return "REQUEST_RELEASE_APPROVAL"

# --- Lab sintético (sustituye por lecturas de ARTIFACTS en el portfolio) ---
pin_ok = full_sha_pin(
    "actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11"
)
ci_ok = ci_matrix_ok(
    {"lint": True, "types": True, "tests": True},
    {"3.11", "3.12"},
    {"3.11", "3.12"},
)
sc_ok = supply_chain_ok("sha256:aaa", "sha256:aaa", "sha256:aaa", True)
promo_ok = promote_ok("sha256:aaa", "sha256:aaa", "release-owner")
can_ok = canary_ok(0.004, 0.01, 75, 120)

# Arranca BLOCKED hasta que enlaces artefactos reales (no fuerces True sin archivo)
evidence = {
    "matriz_lint_types_tests_con_artifacts": False,
    "workflow_con_pinning_y_permisos_minimos": False,
    "sbom_provenance_ligados_al_digest": False,
    "canary_de_prueba_y_rollback_auditado": False,
}
status, missing = portfolio_ready(evidence)
print(CASE_ID, status)
print("missing", ",".join(missing))
print("lab_gates", pin_ok and ci_ok and sc_ok and promo_ok and can_ok)
print("normal", gate_case("normal"))
print("breach", gate_case("breach"))
print("uncertain", gate_case("uncertain"))
assert status in {"READY", "BLOCKED"}
`,
    portfolioNote: "Evidencia de CP-N4-B · cadena de suministro verificable: muestra baseline, decisión, pruebas, resultado medido, rollback y riesgo residual. El checklist inicia en BLOCKED por diseño; conviértelo en READY enlazando artefactos reales (workflow con pin SHA, SBOM/provenance, log de canary/rollback), no cambiando asserts a True sin archivo. Defensa oral: muéstrame el digest testeado == promovido en 30 segundos.",
    retrospective:
      "Antes de marcar listo: (1) ¿qué invariante demuestras (mismo digest, pin SHA de 40 hex, o canary ≤ umbral con rollback ≤ RTO)? (2) ¿qué harías distinto con registry y secretos reales vs. CASO-PIU-044 sintético (sin subir tokens)? (3) Escribe en el README una frase de impacto medible (antes: promote sin attestation / después: gate fail-closed + rollback ensayado) que puedas defender en 30 segundos ante un lead de ops en Piura.",
    rubric: [
      { criterion: "Corrección técnica del contrato y gate.", weight: "25%" },
      { criterion: "Pruebas normal/breach/uncertain y recuperación.", weight: "20%" },
      { criterion: "Seguridad, privacidad y least privilege.", weight: "15%" },
      { criterion: "Reproducibilidad, lineage y evidencia.", weight: "15%" },
      { criterion: "Operación: SLO, observabilidad y rollback.", weight: "15%" },
      { criterion: "Comunicación de trade-offs y límites.", weight: "10%" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "En S44, ¿qué cuenta como pin profesional de una action de GitHub?",
        options: ["usar el tag flotante `@v4` porque “siempre es la última”", "un stub de 7 caracteres después de `@`", "dejar el tag y confiar en branch protection", "el SHA completo de commit (40 hex) inmutable en `uses:`"],
        correctIndex: 3,
        explanation: "El pin inmutable es el SHA completo de 40 hex; los tags se pueden mover y no cierran el control de supply chain.",
      },
      {
        question: "Si un test crítico falla o falta attestation, ¿qué respuesta preserva seguridad y auditabilidad?",
        options: ["continuar y ocultar el warning", "bloquear el release (p. ej. FAIL_CI_GATE / REJECT_ATTESTATION) y conservar evidencia", "inventar evidencia faltante", "borrar el trace para reducir ruido"],
        correctIndex: 1,
        explanation: "S44 falla cerrado con códigos de breach por subtema y retiene logs/artifacts; la incertidumbre va a revisión humana, no a éxito silencioso.",
      },
      {
        question: "¿Cuál resultado demuestra el gate `CP-N4-B · cadena de suministro verificable`?",
        options: ["el archivo S44 existe, aunque no pruebe el gate", "el README afirma que funciona", "el pipeline reproduce el artefacto, exige aprobación y demuestra rollback en staging", "se usó la herramienta más nueva"],
        correctIndex: 2,
        explanation: "El gate es conductual y medible: el pipeline reproduce el artefacto, exige aprobación y demuestra rollback en staging.",
      },
      {
        question: "¿Qué tratamiento de `CASO-PIU-044` respeta el alcance del curso y la cadena de suministro?",
        options: ["mantenerlo sintético, sin secretos reales ni registry obligatorio, y sujeto a gates fail-closed", "reemplazarlo por credenciales de producción para que el workflow “sea real”", "subir tokens al repositorio para facilitar la demo de secret scanning", "omitir SBOM y provenance si el README del release dice OK"],
        correctIndex: 0,
        explanation: "El laboratorio es sintético a propósito: practicas los controles (pin, SBOM, aprobación, rollback) sin PII ni secretos reales; omitir evidencia de supply chain no aprueba el gate.",
      },
      {
        question: "Antes de promover a staging, el digest del artefacto testeado y el promovido deben…",
        options: ["diferir para probar hotfixes en caliente", "omitirse si el README dice OK", "regenerarse sin re-ejecutar tests", "coincidir (mismo subject de provenance/SBOM)"],
        correctIndex: 3,
        explanation: "Supply chain exige que lo testeado sea exactamente lo promovido: digests alineados y aprobación registrada.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "GitHub Actions security hardening",
        url: "https://docs.github.com/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions",
        note: "Permisos, pinning y secrets",
      },
      {
        label: "GitHub Environments for deployment",
        url: "https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment",
        note: "Approvals y environments",
      },
      {
        label: "Branch protection rules",
        url: "https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches",
        note: "Review + checks obligatorios",
      },
      {
        label: "SLSA",
        url: "https://slsa.dev/spec/",
        note: "Provenance y niveles de integridad",
      },
      {
        label: "CycloneDX",
        url: "https://cyclonedx.org/docs/",
        note: "SBOM estándar",
      },
      {
        label: "SPDX",
        url: "https://spdx.dev/",
        note: "SBOM alternativo / interoperable",
      },
      {
        label: "Sigstore / cosign",
        url: "https://docs.sigstore.dev/",
        note: "Firmas y attestations de artefactos",
      },
      {
        label: "in-toto",
        url: "https://in-toto.io/",
        note: "Integridad de cadena de suministro",
      },
      {
        label: "NIST SSDF",
        url: "https://csrc.nist.gov/Projects/ssdf",
        note: "Secure software development framework",
      },
      {
        label: "pip secure installs",
        url: "https://pip.pypa.io/en/stable/topics/secure-installs/",
        note: "Pinning y hash checking",
      },
    ],
    books: [
      { label: "Accelerate (Forsgren et al.)", note: "CI/CD y delivery performance" },
      { label: "Site Reliability Engineering", note: "Canary, rollback y evidencia" },
    ],
    courses: [
      { label: "Coursera DevOps / CI-CD", url: "https://www.coursera.org/courses?query=devops%20cicd", note: "Pipelines y supply chain intro" },
      { label: "MIT 6.100L", url: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/", note: "Contratos verificables" },
      { label: "Harvard CS50P", url: "https://cs50.harvard.edu/python/", note: "Tests y proyectos reproducibles" },
      { label: "Py4E", url: "https://www.py4e.com", note: "Stdlib-first progressive disclosure" },
      { label: "SRE release engineering", url: "https://sre.google/sre-book/release-engineering/", note: "Release y canary conceptual" },
    ],
  },
}
