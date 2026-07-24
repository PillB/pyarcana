import type { CourseSection } from '../../types'

export const section44: CourseSection = {
  id: "multimodal",
  index: 44,
  title: "CI/CD y seguridad de la cadena de suministro",
  shortTitle: "CI/CD supply chain",
  tagline: "pipeline que bloquea dependencia insegura o test crítico, publica artefacto verificable y demuestra rollback",
  estimatedHours: 20,
  level: "Master",
  phase: 3,
  icon: "GitBranch",
  accentColor: "bg-gradient-to-br from-amber-500 to-red-600",
  jobRelevance:
    "En equipos de plataforma y producto en Perú y LatAm, **CI/CD y seguridad de la cadena de suministro** es lo que separa un deploy “que funcionó anoche” de un release **defendible ante auditoría**. El servicio contenedorizado de S43 solo vale en producción si el pipeline entrega un artefacto verificable (digest, SBOM, provenance), exige aprobación independiente y demuestra rollback en staging dentro del RTO. Cuando un lead de ops en Piura (caso sintético `CASO-PIU-044`) pregunta “¿podemos promover?”, la respuesta correcta no es “el README dice OK”: es “mismo digest testeado, attestation válida, canary bajo umbral o rollback ensayado”. En el lab modelamos contratos al estilo GitHub Actions/SLSA con **stdlib** (dicts y predicados), sin registry remoto obligatorio ni secretos reales.",
  learningOutcomes: [
    { text: "Diseñar una matriz CI (lint → types → tests) sobre runtimes soportados y fallar cerrado si un check crítico queda rojo" },
    { text: "Tratar caches como optimización y artifacts (con digest/retención) como evidencia verificable del build" },
    { text: "Aplicar least privilege, pin de actions por SHA completo y secret scanning antes de publicar" },
    { text: "Producir SBOM + provenance enlazados al mismo digest y rechazar attestation divergente" },
    { text: "Promover entre environments solo con aprobación independiente y sin rebuild del artefacto testeado" },
    { text: "Ejecutar canary con umbral de error y demostrar rollback al digest previo dentro del RTO" },
    { text: "Exigir branch protection, reviews/checks y release notes operables (cambio, riesgo, migración, rollback)" },
    { text: "Clasificar fallos críticos con bloqueo, logs redactados, dueño y evidencia retenida (no continue-on-error silencioso)" },
  ],
  theory: [
    {
      heading: "Ruta de S44: CI/CD y seguridad de la cadena de suministro",
      paragraphs: [
        "**Diccionario de la sección** (léelo antes de T1). **CI matrix:** combinaciones soportadas de runtime/OS. **Least privilege:** permisos mínimos del workflow. **Pinning:** deps y actions por digest/SHA inmutable. **SBOM:** inventario de componentes del artefacto. **Provenance/attestation:** quién construyó qué y con qué inputs (SLSA). **Canary/blue-green:** promoción gradual. **Rollback:** volver a digest previo verificado. **Branch protection:** review + checks obligatorios antes de merge.",
        "Esta sección lleva el servicio contenedorizado de S43 a una **cadena de suministro verificable**: CI con lint/types/tests, permisos mínimos, SBOM/provenance y promoción con rollback. Modelamos contratos al estilo GitHub Actions/SLSA con dicts de **stdlib** (sin registry remoto obligatorio). El caso `CASO-PIU-044` es un repositorio sintético de operaciones en Piura: sin secretos reales ni PII. Lo que sigue en S45 (cloud/colas) asume que ya sabes **no promover un digest huérfano** de evidencia.",
        "Producto incremental: un pipeline con supply-chain gates que un auditor podría re-ejecutar. Entrada: commit revisado, dependencias fijadas (lockfile), workflow con least privilege. Salida: artefacto identificado por digest, SBOM, provenance y evidencia de promote/rollback. El gate **bloquea** si hay test crítico rojo, secreto en logs, dependencia insegura sin pin o attestation ausente — y no convierte incertidumbre en éxito silencioso.",
        "Orden de aprendizaje: T1 matrices de check → T2 permisos/secretos y SBOM → T3 environments/canary/rollback → T4 branch protection y fallos auditables. Primero observas el contrato en demos locales (I Do); luego reparas predicados fallidos y clasificas valid/invalid/missing (We Do E1–E3); al final armas el pipeline de portafolio con evidencia de promote/rollback (You Do / CP-N4-B). Stack didáctico: **stdlib** modelando la superficie real de GHA/SLSA sin pedir cuenta de registry.",
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
      callout: {
        type: "info",
        title: "Gate de promoción",
        content: "Nota de orientación: S44-T1-A: caso sintético con asserts locales; si falta, no promociones.",
      },
    },
    {
      heading: "lint/types/tests y matrices",
      subtopicId: "S44-T1-A",
      paragraphs: [
        "Un pipeline de supply chain no empieza publicando: empieza **certificando el código**. CI ejecuta checks **rápidos antes de costosos** (lint → types → tests) para fallar barato. La **matriz** solo cubre runtimes/OS que el equipo realmente soporta (p. ej. Python 3.11 y 3.12), no una combinatoria infinita que gasta minutos y oculta la señal. Un test verde sin logs ni artifact no es gate: es un semáforo sin evidencia. El dict del lab mapea claves de un workflow real (`on`, `permissions`, `matrix`, `steps`).",
        "Contrato de CI rápido. Entrada: commit con lockfile y lista de runtimes soportados. Salida: `lint`, `types` y `tests` en **AND** sobre exactamente la matriz soportada. Error de gate: un check rojo o una versión fuera de matriz → `FAIL_CI_GATE`. Incertidumbre: falta el campo `supported` → `REVIEW_MATRIX`. Este subtema no publica artefactos; solo certifica que el código es apto para los pasos costosos de supply chain.",
        "En `CASO-PIU-044-1A` el repo de ops de Piura declara matriz `{'3.11','3.12'}` y steps `lint/typecheck/test`. El PR solo avanza si los tres checks pasan **y** la matriz ejecutada coincide con la soportada. Si falta `supported`, no se asume “todo OK”: se deriva a revisión de matriz. Sin secretos reales ni PII; la evidencia son logs retenidos del job.",
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
        content:
          "Antes de promover S44-T1-B, verifica el contrato ejecutable y el riesgo residual.",
      },
    },
    {
      heading: "caches, artifacts y condiciones",
      subtopicId: "S44-T1-B",
      paragraphs: [
        "La **cache** acelera installs (pip/npm) pero **no es fuente de verdad**: un cache hit no prueba que el build sea reproducible. El **artifact** (wheel, SBOM, logs) lleva digest y retención porque es la evidencia que otro job o auditor puede re-descargar. Las **condiciones** del workflow (`if:`, filtros de branch/tag/fork) deben cubrir los caminos de release; un tag de prod sin los mismos gates que `main` es un atajo peligroso.",
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
        content:
          "La revisión de S44-T2-A exige salida esperada y fail-closed ante breach.",
      },
    },
    {
      heading: "permisos mínimos, pinning y secret scanning",
      subtopicId: "S44-T2-A",
      paragraphs: [
        "El token del workflow es un **atacante en potencia** si tiene write amplio. Least privilege empieza en `permissions:` (p. ej. `contents: read`) y solo eleva en jobs que publican. Las **actions** de terceros se pinnan por **SHA completo de commit** (40 hex), no por tag flotante `v4` ni stub corto: el tag se puede mover; el SHA no. **Secret scanning** (gitleaks u equivalente) bloquea si hay hits en el diff o en logs. Lee el esqueleto YAML de abajo: es la superficie real de GitHub Actions modelada aquí con stdlib.",
        "Contrato de endurecimiento del workflow. Entrada: mapa de permisos del token, referencia de action, conteo de secret hits y flag de dependency review. Salida: valores de permiso ⊆ {read, none}, action pinned por SHA de 40 hex, `secret_hits == 0` y review de deps. Breach (write amplio, pin ausente, secreto en logs) → `REVOKE_AND_ROTATE`. Incertidumbre: falta `dependency_review` → `SECURITY_APPROVAL`.",
        "En `CASO-PIU-044-2A` el workflow de Piura usa `contents: read` y `actions/checkout@` + SHA de 40 hex (p. ej. `b4ffde65…`). Si un job de release necesita write, se declara solo en ese job — no a nivel de workflow. Un tag `@v4` o un stub corto no cuenta como pin. Un `secret_hits > 0` obliga a rotar credenciales antes de reintentar el pipeline; no se “limpia el log” a mano para pasar el scan.",
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
        content:
          "Contrato S44-T2-B: fixture S44-T2-B; si falta evidencia, no promociones.",
      },
    },
    {
      heading: "SBOM, provenance y attestations",
      subtopicId: "S44-T2-B",
      paragraphs: [
        "El **SBOM** (SPDX/CycloneDX) enumera componentes y versiones del artefacto. La **provenance** (estilo SLSA) enlaza fuente → build → subject digest: quién construyó qué, con qué inputs. Una **attestation** firmada permite verificar esa cadena; no “garantiza calidad” por sí sola, pero sí impide promover un binario huérfano de evidencia. Publicar sin attestation o con SBOM de otro build rompe la cadena de suministro.",
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
        content:
          "Para S44-T3-A: fixture S44-T3-A; si falta evidencia, no promociones.",
      },
    },
    {
      heading: "environments y approvals",
      subtopicId: "S44-T3-A",
      paragraphs: [
        "Los **environments** (dev → staging → prod) separan secretos, políticas y aprobadores. Producción no se alimenta de un rebuild improvisado: se mueve el **mismo digest** que pasó tests en staging. La **aprobación** es independiente del autor del PR; sin `approved_by` no hay promote. Rebuild al promover es el anti-patrón clásico de supply chain: lo que se testeó deja de ser lo desplegado y la provenance queda huérfana.",
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
        content:
          "Promoción de S44-T3-B solo con evidencia reproducible y dueño asignado.",
      },
    },
    {
      heading: "migrations, canary/blue-green y rollback",
      subtopicId: "S44-T3-B",
      paragraphs: [
        "Antes de enviar tráfico, las **migraciones** deben ser compatibles (expand-first / no breaking). El **canary** envía un porcentaje de tráfico (p. ej. 10%) y mide tasa de error contra un umbral. Si el canary está sano, se puede ampliar; si supera el umbral, se hace **rollback** al digest previo. Rollback no es “intentar de nuevo”: es restaurar código/config (y datos si aplica) **dentro del RTO** y dejar evidencia del tiempo de reversión.",
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
        content:
          "El dueño de S44-T4-A responde por rollback y evidencia; sin dueño no hay promote.",
      },
    },
    {
      heading: "branch/review policy y release notes",
      subtopicId: "S44-T4-A",
      paragraphs: [
        "La **branch protection** de `main` exige reviews y checks verdes antes del merge: es el primer control humano+automatizado de la cadena de suministro (antes incluso del publish). Las **release notes** no son marketing; son un contrato operativo para quien despliega de madrugada: qué cambió, riesgo residual, pasos de migración y cómo revertir. Un tag de release sin notes completas deja al on-call sin mapa y convierte el rollback en improvisación.",
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
        content:
          "Cierre de S44-T4-B: documenta residual risk y límites del lab stdlib.",
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
        content:
          "Cierre de S44-T4-B: fallo crítico bloquea y deja evidencia auditable. Breach silencioso → `STOP_SILENT_FAILURE`; falta de dueño/evidencia → `ASSIGN_INCIDENT_OWNER`.",
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
        description: "Demo: lint/types/tests y matrices",
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
        why: "Calcula el AND de lint/types/tests y la igualdad matriz==soportada: evidencia mínima antes de pasos costosos de supply chain.",
      },
      {
        demoId: "S44-T1-B-DEMO",
        subtopicId: "S44-T1-B",
        environment: "local-python",
        description: "Demo: caches, artifacts y condiciones",
        code: {
          language: 'python',
          title: "demo_caches_artifacts_conditions.py",
          code: `def cache_key(lock_hash: str) -> str:
    return f"pip-{lock_hash[:8]}"

def artifact_ok(digest: str, retention_days: int) -> bool:
    return digest.startswith("sha256:") and retention_days >= 7

key = cache_key("abcdef12deadbeef")
print("cache_key", key.startswith("pip-"))
print("artifact", artifact_ok("sha256:def", 14))
print("condition", "main_and_tags")`,
          output: `cache_key True
artifact True
condition main_and_tags`,
        },
        why: "Separa cache (optimización por lockfile) de artifact verificable (digest + retención): la cache no sustituye evidencia.",
      },
      {
        demoId: "S44-T2-A-DEMO",
        subtopicId: "S44-T2-A",
        environment: "local-python",
        description: "Demo: permisos mínimos, pinning y secret scanning",
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
        why: "Muestra secret scanning que bloquea hits y pin por SHA completo de 40 hex — no un tag flotante.",
      },
      {
        demoId: "S44-T2-B-DEMO",
        subtopicId: "S44-T2-B",
        environment: "local-python",
        description: "Demo: SBOM, provenance y attestations",
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
        why: "Exige que artifact, SBOM y subject de provenance compartan el mismo digest antes de confiar en la attestation.",
      },
      {
        demoId: "S44-T3-A-DEMO",
        subtopicId: "S44-T3-A",
        environment: "local-python",
        description: "Demo: environments y approvals",
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
        why: "Staging→prod exige aprobación y el mismo digest testeado; rebuild en promote se niega explícitamente.",
      },
      {
        demoId: "S44-T3-B-DEMO",
        subtopicId: "S44-T3-B",
        environment: "local-python",
        description: "Demo: migrations, canary/blue-green y rollback",
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
        why: "Contrasta canary sano (hold) vs canary sobre umbral (rollback dentro del RTO): ambas rutas del contrato dual.",
      },
      {
        demoId: "S44-T4-A-DEMO",
        subtopicId: "S44-T4-A",
        environment: "local-python",
        description: "Demo: branch/review policy y release notes",
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
        why: "Release listo solo con reviews y notes operables (cambio, riesgo, migración, rollback).",
      },
      {
        demoId: "S44-T4-B-DEMO",
        subtopicId: "S44-T4-B",
        environment: "local-python",
        description: "Demo: failure handling y evidencia auditable",
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
        why: "Fallo crítico → block + evidencia retenida; no continue-on-error silencioso.",
      },
    ],
  },
  weDo: {
    intro: "S44 · Laboratorio de pipeline CI/CD con supply-chain gates: 24 retos (E1 repara, E2 clasifica valid/invalid/missing, E3 decide fail-closed). Ocho case_ids sintéticos de Piura (`CASO-PIU-044-1A`…`4B`); cada tríada reutiliza el mismo fixture de dominio con predicados invertidos a propósito.",
    steps: [
      {
        id: "S44-T1-A-E1",
        subtopicId: "S44-T1-A",
        kind: "guided",
        instruction: "S44-T1-A-E1 · Calcula el contrato de `lint/types/tests y matrices` sobre `CASO-PIU-044-1A`. La entrada es el dict completo del starter; la operación debe demostrar tres gates y matriz exactamente soportada. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S44-T1-A PASS`; la misma operación sobre el fixture adverso debe activar `FAIL_CI_GATE` en E2.",
        hint: "Relaciona los campos `lint`, `types`, `tests`, `matrix`, `supported` con la regla explicada en S44-T1-A.",
        hints: [
          "Relaciona los campos `lint`, `types`, `tests`, `matrix`, `supported` con la regla explicada en S44-T1-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva lint/types/tests y matriz soportada en verde; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta supported", "fixture adverso: tres gates y matriz exactamente soportada", "CASO-PIU-044-1A es sintético"],
        tests: "El fixture `CASO-PIU-044-1A` satisface un predicado de dominio real; imprime `S44-T1-A PASS` y el assert booleano pasa.",
        feedback: "S44-T1-A-E1: explica qué campo cambió la decisión, por qué el adverso activa FAIL_CI_GATE y por qué faltar supported exige REVIEW_MATRIX.",
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
        instruction: "S44-T1-A-E2 · Modela tres rutas de `lint/types/tests y matrices`: fixture válido, fixture adverso y registro sin `supported`. Entrada: dict con case_id, lint, types, tests, matrix, supported. Salidas exactas: `PASS`, `FAIL_CI_GATE`, `MISSING:supported`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a supported debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a supported debe ocurrir antes de esa rama.",
          "Después aplica la regla de S44-T1-A: tres gates y matriz exactamente soportada. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta supported", "fixture adverso: tres gates y matriz exactamente soportada", "CASO-PIU-044-1A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `supported` ausente y produce exactamente `PASS FAIL_CI_GATE MISSING:supported`.",
        feedback: "S44-T1-A-E2: explica qué campo cambió la decisión, por qué el adverso activa FAIL_CI_GATE y por qué faltar supported exige REVIEW_MATRIX.",
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
        instruction: "S44-T1-A-E3 · Simula fallo cerrado para `lint/types/tests y matrices` con tres fixtures distintos. `CASO-PIU-044-1A` debe continuar, el adverso debe devolver `FAIL_CI_GATE` y la ausencia de `supported` debe devolver `REVIEW_MATRIX`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REVIEW_MATRIX` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REVIEW_MATRIX` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró tres gates y matriz exactamente soportada; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta supported", "fixture adverso: tres gates y matriz exactamente soportada", "CASO-PIU-044-1A es sintético"],
        tests: "Fixtures `CASO-PIU-044-1A`, adverso y sin `supported` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S44-T1-A-E3: explica qué campo cambió la decisión, por qué el adverso activa FAIL_CI_GATE y por qué faltar supported exige REVIEW_MATRIX.",
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
        instruction: "S44-T1-B-E1 · Compara el contrato de `caches, artifacts y condiciones` sobre `CASO-PIU-044-1B`. La entrada es el dict completo del starter; la operación debe demostrar cache opcional, artifact con digest y condiciones completas. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S44-T1-B PASS`; la misma operación sobre el fixture adverso debe activar `DISCARD_PIPELINE_RESULT` en E2.",
        hint: "Relaciona los campos `cache_key`, `cache_miss_passes`, `artifact_digest`, `retention_days`, `conditions_cover_tags` con la regla explicada en S44-T1-B.",
        hints: [
          "Relaciona los campos `cache_key`, `cache_miss_passes`, `artifact_digest`, `retention_days`, `conditions_cover_tags` con la regla explicada en S44-T1-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva cache miss conserva resultado y artifact es verificable; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta conditions_cover_tags", "fixture adverso: cache opcional, artifact con digest y condiciones completas", "CASO-PIU-044-1B es sintético"],
        tests: "El fixture `CASO-PIU-044-1B` satisface un predicado de dominio real; imprime `S44-T1-B PASS` y el assert booleano pasa.",
        feedback: "S44-T1-B-E1: explica qué campo cambió la decisión, por qué el adverso activa DISCARD_PIPELINE_RESULT y por qué faltar conditions_cover_tags exige INSPECT_WORKFLOW_CONDITION.",
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
        instruction: "S44-T1-B-E2 · Verifica tres rutas de `caches, artifacts y condiciones`: fixture válido, fixture adverso y registro sin `conditions_cover_tags`. Entrada: dict con case_id, cache_key, cache_miss_passes, artifact_digest, retention_days, conditions_cover_tags. Salidas exactas: `PASS`, `DISCARD_PIPELINE_RESULT`, `MISSING:conditions_cover_tags`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a conditions_cover_tags debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a conditions_cover_tags debe ocurrir antes de esa rama.",
          "Después aplica la regla de S44-T1-B: cache opcional, artifact con digest y condiciones completas. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta conditions_cover_tags", "fixture adverso: cache opcional, artifact con digest y condiciones completas", "CASO-PIU-044-1B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `conditions_cover_tags` ausente y produce exactamente `PASS DISCARD_PIPELINE_RESULT MISSING:conditions_cover_tags`.",
        feedback: "S44-T1-B-E2: explica qué campo cambió la decisión, por qué el adverso activa DISCARD_PIPELINE_RESULT y por qué faltar conditions_cover_tags exige INSPECT_WORKFLOW_CONDITION.",
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
        instruction: "S44-T1-B-E3 · Extiende fallo cerrado para `caches, artifacts y condiciones` con tres fixtures distintos. `CASO-PIU-044-1B` debe continuar, el adverso debe devolver `DISCARD_PIPELINE_RESULT` y la ausencia de `conditions_cover_tags` debe devolver `INSPECT_WORKFLOW_CONDITION`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `INSPECT_WORKFLOW_CONDITION` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `INSPECT_WORKFLOW_CONDITION` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró cache opcional, artifact con digest y condiciones completas; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta conditions_cover_tags", "fixture adverso: cache opcional, artifact con digest y condiciones completas", "CASO-PIU-044-1B es sintético"],
        tests: "Fixtures `CASO-PIU-044-1B`, adverso y sin `conditions_cover_tags` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S44-T1-B-E3: explica qué campo cambió la decisión, por qué el adverso activa DISCARD_PIPELINE_RESULT y por qué faltar conditions_cover_tags exige INSPECT_WORKFLOW_CONDITION.",
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
        instruction: "S44-T2-A-E1 · Endurece el workflow de `CASO-PIU-044-2A`: permisos mínimos, **pin por SHA completo de 40 hex** en `action_ref`, cero secret hits y dependency review. Reemplaza el predicado defectuoso (hoy aprueba write o secretos); no mutes los datos ni el assert. Salida exacta: `S44-T2-A PASS`. El fixture adverso de E2 activará `REVOKE_AND_ROTATE`.",
        hint: "Valida permisos ⊆ {read,none}, `action_ref` con SHA de 40 hex tras `@`, secret_hits==0 y dependency_review.",
        hints: [
          "Extrae el ref después de `@` en `action_ref` y comprueba len==40 y hex.",
          "El fixture válido usa `actions/checkout@` + SHA real; un tag `@v4` o stub corto no cuenta como pinned.",
        ],
        edgeCases: ["falta dependency_review", "action_ref con tag flotante o write amplio", "CASO-PIU-044-2A es sintético"],
        tests: "El fixture `CASO-PIU-044-2A` con SHA de 40 hex y least privilege imprime `S44-T2-A PASS`.",
        feedback: "S44-T2-A-E1: el pin real es el SHA inmutable, no un booleano; write o secret_hits>0 activan REVOKE_AND_ROTATE; sin dependency_review → SECURITY_APPROVAL.",
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
        instruction: "S44-T2-A-E2 · Clasifica tres rutas de endurecimiento: fixture con pin SHA completo y least privilege (`PASS`), adverso con write/`@v4`/secret hit (`REVOKE_AND_ROTATE`), y registro sin `dependency_review` (`MISSING:dependency_review`). Entrada: case_id, token_permissions, action_ref, secret_hits, dependency_review. Conserva la rama missing antes del dominio. Salida: imprime el valor de meets_contract.",
        hint: "Primero `missing`; luego least privilege + full_sha_pin(action_ref) + secret_hits==0 + dependency_review.",
        hints: [
          "El inválido usa `@v4` (tag flotante) y write: debe fallar por contenido, no por schema.",
          "No uses un booleano `actions_pinned`; el pin se **calcula** del string action_ref.",
        ],
        edgeCases: ["falta dependency_review", "tag @v4 no es pin", "CASO-PIU-044-2A es sintético"],
        tests: "Salidas exactas: `PASS REVOKE_AND_ROTATE MISSING:dependency_review`.",
        feedback: "S44-T2-A-E2: diferencia schema (missing) de breach (write, tag flotante, secret); pin = 40 hex.",
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
        instruction: "S44-T2-A-E3 · Decide fail-closed: válido → `CONTINUE`, adverso (write/`@v4`/secret) → `REVOKE_AND_ROTATE`, sin `dependency_review` → `SECURITY_APPROVAL`. No conviertas missing en CONTINUE ni apruebes tag flotante. Salida: imprime el valor de meets_contract.",
        hint: "Una ausencia no es breach: enrútala a `SECURITY_APPROVAL` antes de evaluar contenido.",
        hints: [
          "Reutiliza full_sha_pin sobre action_ref; solo least privilege + pin + cero secrets + review devuelve CONTINUE.",
          "El adverso con `@v4` demuestra por qué el tag no es pin inmutable.",
        ],
        edgeCases: ["falta dependency_review", "tag @v4 no es pin", "CASO-PIU-044-2A es sintético"],
        tests: "Salidas exactas: `CONTINUE REVOKE_AND_ROTATE SECURITY_APPROVAL`.",
        feedback: "S44-T2-A-E3: uncertainty ≠ breach; pin SHA es medible; write o secret obligan a rotar.",
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
        instruction: "S44-T2-B-E1 · Modela el contrato de `SBOM, provenance y attestations` sobre `CASO-PIU-044-2B`. La entrada es el dict completo del starter; la operación debe demostrar SBOM y provenance enlazados al mismo digest. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S44-T2-B PASS`; la misma operación sobre el fixture adverso debe activar `REJECT_ATTESTATION` en E2.",
        hint: "Relaciona los campos `artifact_digest`, `sbom_digest`, `provenance_subject`, `attestation_valid` con la regla explicada en S44-T2-B.",
        hints: [
          "Relaciona los campos `artifact_digest`, `sbom_digest`, `provenance_subject`, `attestation_valid` con la regla explicada en S44-T2-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva SBOM y provenance coinciden con digest; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta attestation_valid", "fixture adverso: SBOM y provenance enlazados al mismo digest", "CASO-PIU-044-2B es sintético"],
        tests: "El fixture `CASO-PIU-044-2B` satisface un predicado de dominio real; imprime `S44-T2-B PASS` y el assert booleano pasa.",
        feedback: "S44-T2-B-E1: explica qué campo cambió la decisión, por qué el adverso activa REJECT_ATTESTATION y por qué faltar attestation_valid exige REBUILD_PROVENANCE.",
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
        instruction: "S44-T2-B-E2 · Audita tres rutas de `SBOM, provenance y attestations`: fixture válido, fixture adverso y registro sin `attestation_valid`. Entrada: dict con case_id, artifact_digest, sbom_digest, provenance_subject, attestation_valid. Salidas exactas: `PASS`, `REJECT_ATTESTATION`, `MISSING:attestation_valid`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a attestation_valid debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a attestation_valid debe ocurrir antes de esa rama.",
          "Después aplica la regla de S44-T2-B: SBOM y provenance enlazados al mismo digest. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta attestation_valid", "fixture adverso: SBOM y provenance enlazados al mismo digest", "CASO-PIU-044-2B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `attestation_valid` ausente y produce exactamente `PASS REJECT_ATTESTATION MISSING:attestation_valid`.",
        feedback: "S44-T2-B-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_ATTESTATION y por qué faltar attestation_valid exige REBUILD_PROVENANCE.",
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
        instruction: "S44-T2-B-E3 · Recupera fallo cerrado para `SBOM, provenance y attestations` con tres fixtures distintos. `CASO-PIU-044-2B` debe continuar, el adverso debe devolver `REJECT_ATTESTATION` y la ausencia de `attestation_valid` debe devolver `REBUILD_PROVENANCE`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REBUILD_PROVENANCE` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REBUILD_PROVENANCE` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró SBOM y provenance enlazados al mismo digest; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta attestation_valid", "fixture adverso: SBOM y provenance enlazados al mismo digest", "CASO-PIU-044-2B es sintético"],
        tests: "Fixtures `CASO-PIU-044-2B`, adverso y sin `attestation_valid` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S44-T2-B-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_ATTESTATION y por qué faltar attestation_valid exige REBUILD_PROVENANCE.",
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
        instruction: "S44-T3-A-E1 · Verifica el contrato de `environments y approvals` sobre `CASO-PIU-044-3A`. La entrada es el dict completo del starter; la operación debe demostrar mismo digest probado y aprobación independiente. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S44-T3-A PASS`; la misma operación sobre el fixture adverso debe activar `DENY_PROMOTION` en E2.",
        hint: "Relaciona los campos `source_env`, `target_env`, `approved_by`, `tested_digest`, `promoted_digest` con la regla explicada en S44-T3-A.",
        hints: [
          "Relaciona los campos `source_env`, `target_env`, `approved_by`, `tested_digest`, `promoted_digest` con la regla explicada en S44-T3-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva promoción sin rebuild y con aprobación; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta promoted_digest", "fixture adverso: mismo digest probado y aprobación independiente", "CASO-PIU-044-3A es sintético"],
        tests: "El fixture `CASO-PIU-044-3A` satisface un predicado de dominio real; imprime `S44-T3-A PASS` y el assert booleano pasa.",
        feedback: "S44-T3-A-E1: explica qué campo cambió la decisión, por qué el adverso activa DENY_PROMOTION y por qué faltar promoted_digest exige REQUEST_RELEASE_APPROVAL.",
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
        instruction: "S44-T3-A-E2 · Decide tres rutas de `environments y approvals`: fixture válido, fixture adverso y registro sin `promoted_digest`. Entrada: dict con case_id, source_env, target_env, approved_by, tested_digest, promoted_digest. Salidas exactas: `PASS`, `DENY_PROMOTION`, `MISSING:promoted_digest`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a promoted_digest debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a promoted_digest debe ocurrir antes de esa rama.",
          "Después aplica la regla de S44-T3-A: mismo digest probado y aprobación independiente. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta promoted_digest", "fixture adverso: mismo digest probado y aprobación independiente", "CASO-PIU-044-3A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `promoted_digest` ausente y produce exactamente `PASS DENY_PROMOTION MISSING:promoted_digest`.",
        feedback: "S44-T3-A-E2: explica qué campo cambió la decisión, por qué el adverso activa DENY_PROMOTION y por qué faltar promoted_digest exige REQUEST_RELEASE_APPROVAL.",
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
        instruction: "S44-T3-A-E3 · Contrasta fallo cerrado para `environments y approvals` con tres fixtures distintos. `CASO-PIU-044-3A` debe continuar, el adverso debe devolver `DENY_PROMOTION` y la ausencia de `promoted_digest` debe devolver `REQUEST_RELEASE_APPROVAL`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_RELEASE_APPROVAL` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_RELEASE_APPROVAL` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró mismo digest probado y aprobación independiente; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta promoted_digest", "fixture adverso: mismo digest probado y aprobación independiente", "CASO-PIU-044-3A es sintético"],
        tests: "Fixtures `CASO-PIU-044-3A`, adverso y sin `promoted_digest` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S44-T3-A-E3: explica qué campo cambió la decisión, por qué el adverso activa DENY_PROMOTION y por qué faltar promoted_digest exige REQUEST_RELEASE_APPROVAL.",
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
        instruction: "S44-T3-B-E1 · Clasifica el contrato de `migrations, canary/blue-green y rollback` sobre `CASO-PIU-044-3B`. La entrada es el dict completo del starter; la operación debe demostrar migración compatible, canary bajo umbral y rollback dentro de RTO. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S44-T3-B PASS`; la misma operación sobre el fixture adverso debe activar `ROLLBACK_RELEASE` en E2.",
        hint: "Relaciona los campos `migration_compatible`, `canary_error_rate`, `max_error_rate`, `rollback_tested`, `rollback_seconds`, `rto_seconds` con la regla explicada en S44-T3-B.",
        hints: [
          "Relaciona los campos `migration_compatible`, `canary_error_rate`, `max_error_rate`, `rollback_tested`, `rollback_seconds`, `rto_seconds` con la regla explicada en S44-T3-B.",
          "El predicado correcto debe ser verdadero porque el fixture tiene canary sano bajo umbral y rollback ensayado dentro del RTO; revisa dirección de comparación y negaciones.",
        ],
        edgeCases: ["falta rto_seconds", "fixture adverso: migración compatible, canary bajo umbral y rollback dentro de RTO", "CASO-PIU-044-3B es sintético"],
        tests: "El fixture `CASO-PIU-044-3B` satisface un predicado de dominio real; imprime `S44-T3-B PASS` y el assert booleano pasa.",
        feedback: "S44-T3-B-E1: explica qué campo cambió la decisión, por qué el adverso activa ROLLBACK_RELEASE y por qué faltar rto_seconds exige PAUSE_CANARY.",
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
        instruction: "S44-T3-B-E2 · Calcula tres rutas de `migrations, canary/blue-green y rollback`: fixture válido, fixture adverso y registro sin `rto_seconds`. Entrada: dict con case_id, migration_compatible, canary_error_rate, max_error_rate, rollback_tested, rollback_seconds, rto_seconds. Salidas exactas: `PASS`, `ROLLBACK_RELEASE`, `MISSING:rto_seconds`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a rto_seconds debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a rto_seconds debe ocurrir antes de esa rama.",
          "Después aplica la regla de S44-T3-B: migración compatible, canary bajo umbral y rollback dentro de RTO. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta rto_seconds", "fixture adverso: migración compatible, canary bajo umbral y rollback dentro de RTO", "CASO-PIU-044-3B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `rto_seconds` ausente y produce exactamente `PASS ROLLBACK_RELEASE MISSING:rto_seconds`.",
        feedback: "S44-T3-B-E2: explica qué campo cambió la decisión, por qué el adverso activa ROLLBACK_RELEASE y por qué faltar rto_seconds exige PAUSE_CANARY.",
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
        instruction: "S44-T3-B-E3 · Instrumenta fallo cerrado para `migrations, canary/blue-green y rollback` con tres fixtures distintos. `CASO-PIU-044-3B` debe continuar, el adverso debe devolver `ROLLBACK_RELEASE` y la ausencia de `rto_seconds` debe devolver `PAUSE_CANARY`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `PAUSE_CANARY` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `PAUSE_CANARY` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró migración compatible, canary bajo umbral y rollback dentro de RTO; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta rto_seconds", "fixture adverso: migración compatible, canary bajo umbral y rollback dentro de RTO", "CASO-PIU-044-3B es sintético"],
        tests: "Fixtures `CASO-PIU-044-3B`, adverso y sin `rto_seconds` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S44-T3-B-E3: explica qué campo cambió la decisión, por qué el adverso activa ROLLBACK_RELEASE y por qué faltar rto_seconds exige PAUSE_CANARY.",
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
        instruction: "S44-T4-A-E1 · Audita el contrato de `branch/review policy y release notes` sobre `CASO-PIU-044-4A`. La entrada es el dict completo del starter; la operación debe demostrar branch protegida, review/checks y notas operables. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S44-T4-A PASS`; la misma operación sobre el fixture adverso debe activar `BLOCK_UNREVIEWED_RELEASE` en E2.",
        hint: "Relaciona los campos `protected_branch`, `required_reviews`, `required_checks`, `release_notes` con la regla explicada en S44-T4-A.",
        hints: [
          "Relaciona los campos `protected_branch`, `required_reviews`, `required_checks`, `release_notes` con la regla explicada en S44-T4-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva release trazable a review y changelog; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta release_notes", "fixture adverso: branch protegida, review/checks y notas operables", "CASO-PIU-044-4A es sintético"],
        tests: "El fixture `CASO-PIU-044-4A` satisface un predicado de dominio real; imprime `S44-T4-A PASS` y el assert booleano pasa.",
        feedback: "S44-T4-A-E1: explica qué campo cambió la decisión, por qué el adverso activa BLOCK_UNREVIEWED_RELEASE y por qué faltar release_notes exige COMPLETE_RELEASE_NOTES.",
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
        instruction: "S44-T4-A-E2 · Compara tres rutas de `branch/review policy y release notes`: fixture válido, fixture adverso y registro sin `release_notes`. Entrada: dict con case_id, protected_branch, required_reviews, required_checks, release_notes. Salidas exactas: `PASS`, `BLOCK_UNREVIEWED_RELEASE`, `MISSING:release_notes`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a release_notes debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a release_notes debe ocurrir antes de esa rama.",
          "Después aplica la regla de S44-T4-A: branch protegida, review/checks y notas operables. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta release_notes", "fixture adverso: branch protegida, review/checks y notas operables", "CASO-PIU-044-4A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `release_notes` ausente y produce exactamente `PASS BLOCK_UNREVIEWED_RELEASE MISSING:release_notes`.",
        feedback: "S44-T4-A-E2: explica qué campo cambió la decisión, por qué el adverso activa BLOCK_UNREVIEWED_RELEASE y por qué faltar release_notes exige COMPLETE_RELEASE_NOTES.",
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
        instruction: "S44-T4-A-E3 · Aísla fallo cerrado para `branch/review policy y release notes` con tres fixtures distintos. `CASO-PIU-044-4A` debe continuar, el adverso debe devolver `BLOCK_UNREVIEWED_RELEASE` y la ausencia de `release_notes` debe devolver `COMPLETE_RELEASE_NOTES`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `COMPLETE_RELEASE_NOTES` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `COMPLETE_RELEASE_NOTES` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró branch protegida, review/checks y notas operables; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta release_notes", "fixture adverso: branch protegida, review/checks y notas operables", "CASO-PIU-044-4A es sintético"],
        tests: "Fixtures `CASO-PIU-044-4A`, adverso y sin `release_notes` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S44-T4-A-E3: explica qué campo cambió la decisión, por qué el adverso activa BLOCK_UNREVIEWED_RELEASE y por qué faltar release_notes exige COMPLETE_RELEASE_NOTES.",
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
        instruction: "S44-T4-B-E1 · Decide el contrato de `failure handling y evidencia auditable` sobre `CASO-PIU-044-4B`. La entrada es el dict completo del starter; la operación debe demostrar fallo crítico bloquea con logs redactados y dueño. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S44-T4-B PASS`; la misma operación sobre el fixture adverso debe activar `STOP_SILENT_FAILURE` en E2.",
        hint: "Relaciona los campos `critical_failure`, `pipeline_blocked`, `logs_redacted`, `owner`, `evidence_retained` con la regla explicada en S44-T4-B.",
        hints: [
          "Relaciona los campos `critical_failure`, `pipeline_blocked`, `logs_redacted`, `owner`, `evidence_retained` con la regla explicada en S44-T4-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva fallo crítico bloquea y deja evidencia auditable; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta evidence_retained", "fixture adverso: fallo crítico bloquea con logs redactados y dueño", "CASO-PIU-044-4B es sintético"],
        tests: "El fixture `CASO-PIU-044-4B` satisface un predicado de dominio real; imprime `S44-T4-B PASS` y el assert booleano pasa.",
        feedback: "S44-T4-B-E1: explica qué campo cambió la decisión, por qué el adverso activa STOP_SILENT_FAILURE y por qué faltar evidence_retained exige ASSIGN_INCIDENT_OWNER.",
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
        instruction: "S44-T4-B-E2 · Filtra tres rutas de `failure handling y evidencia auditable`: fixture válido, fixture adverso y registro sin `evidence_retained`. Entrada: dict con case_id, critical_failure, pipeline_blocked, logs_redacted, owner, evidence_retained. Salidas exactas: `PASS`, `STOP_SILENT_FAILURE`, `MISSING:evidence_retained`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a evidence_retained debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a evidence_retained debe ocurrir antes de esa rama.",
          "Después aplica la regla de S44-T4-B: fallo crítico bloquea con logs redactados y dueño. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta evidence_retained", "fixture adverso: fallo crítico bloquea con logs redactados y dueño", "CASO-PIU-044-4B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `evidence_retained` ausente y produce exactamente `PASS STOP_SILENT_FAILURE MISSING:evidence_retained`.",
        feedback: "S44-T4-B-E2: explica qué campo cambió la decisión, por qué el adverso activa STOP_SILENT_FAILURE y por qué faltar evidence_retained exige ASSIGN_INCIDENT_OWNER.",
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
        instruction: "S44-T4-B-E3 · Demuestra fallo cerrado para `failure handling y evidencia auditable` con tres fixtures distintos. `CASO-PIU-044-4B` debe continuar, el adverso debe devolver `STOP_SILENT_FAILURE` y la ausencia de `evidence_retained` debe devolver `ASSIGN_INCIDENT_OWNER`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `ASSIGN_INCIDENT_OWNER` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `ASSIGN_INCIDENT_OWNER` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró fallo crítico bloquea con logs redactados y dueño; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta evidence_retained", "fixture adverso: fallo crítico bloquea con logs redactados y dueño", "CASO-PIU-044-4B es sintético"],
        tests: "Fixtures `CASO-PIU-044-4B`, adverso y sin `evidence_retained` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S44-T4-B-E3: explica qué campo cambió la decisión, por qué el adverso activa STOP_SILENT_FAILURE y por qué faltar evidence_retained exige ASSIGN_INCIDENT_OWNER.",
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
    context: "Pipeline CI/CD con supply-chain gates. Trabaja sobre un repositorio ficticio de servicio de operaciones en Piura. Entrada: commit revisado, dependencias fijadas y workflow con permisos mínimos. Salida: artefacto identificado por digest, SBOM, provenance y evidencia de promoción o rollback. El gate bloquea la publicación si hay test crítico rojo, secreto en logs, dependencia insegura sin pin o attestation ausente.",
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
    portfolioNote: "Evidencia de CP-N4-B · cadena de suministro verificable: muestra baseline, decisión, pruebas, resultado medido, rollback y riesgo residual. El checklist inicia en BLOCKED por diseño; conviértelo en READY enlazando artefactos reales (workflow con pin SHA, SBOM/provenance, log de canary/rollback), no cambiando asserts a True sin archivo.",
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
        explanation: "El lab es sintético a propósito: practicas gates (pin, SBOM, aprobación, rollback) sin PII ni secretos reales; omitir evidencia de supply chain no aprueba el gate.",
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
