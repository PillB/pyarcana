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
  icon: "Image",
  accentColor: "bg-gradient-to-br from-amber-500 to-red-600",
  jobRelevance:
    "En equipos de plataforma y producto, **CI/CD y seguridad de la cadena de suministro** convierten el servicio contenedorizado (S43) en un artefacto verificable: digest, SBOM, provenance y gates de promoción. Se promociona solo cuando el pipeline reproduce el artefacto, exige aprobación y demuestra rollback en staging. Id legacy `multimodal` se conserva; el path V3 es supply-chain CI/CD, no visión multimodal/LLM.",
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
      heading: "Ruta de S44: CI/CD y seguridad de la cadena de suministro",
      paragraphs: [
        "**Diccionario de la sección** (léelo antes de T1). **CI matrix:** combinaciones soportadas de runtime/OS. **Least privilege:** permisos mínimos del workflow. **Pinning:** deps y actions por digest/versión fija. **SBOM:** inventario de componentes del artefacto. **Provenance/attestation:** quién construyó qué y con qué inputs (SLSA). **Canary/blue-green:** promoción gradual. **Rollback:** volver a digest previo verificado. **Branch protection:** review + checks obligatorios antes de merge.",
        "Esta sección lleva el servicio de S43 a una **cadena de suministro verificable**: CI con lint/types/tests, permisos mínimos, SBOM/provenance y promoción con rollback. Solo contratos al estilo GitHub Actions/SLSA (referencia profesional; progressive disclosure con dicts stdlib). El caso `CASO-PIU-044` (ops ficticio en Piura) es sintético: sin secretos reales ni registry remoto obligatorio.",
        "Producto incremental: pipeline con supply-chain gates. Entrada: commit revisado, deps fijadas, workflow least-privilege. Salida: artefacto por digest, SBOM, provenance y evidencia de promote/rollback. Error de promoción: test crítico rojo, secreto en logs, dep vulnerable sin pin o attestación ausente.",
        "Orden: T1 matrices de check → T2 permisos/secretos y SBOM → T3 environments/canary/rollback → T4 branch protection y fallos auditables. Teoría medible, iDo que calcula el contrato, weDo E1/E2/E3 con un defecto de pipeline por ejercicio. Id legacy `multimodal` no implica multimodalidad; V3 es CI/CD supply chain del control plane. Stack didáctico: **stdlib** (dicts) modelando contratos GHA/SLSA sin registry remoto.",
      ],
      code: {
        language: 'python',
        title: "s44_map_contract.py",
        code: `def section_contract():
    return {
        "case": "CASO-PIU-044",
        "gates": ["critical_tests_green", "sbom_provenance", "approval_then_rollback_demo"],
        "multimodal_vision_topic": False,
        "unpinned_vuln_dep_ok": False,
    }

c = section_contract()
print("case", c["case"])
print("multimodal_vision_topic", c["multimodal_vision_topic"])
print("unpinned_vuln_dep_ok", c["unpinned_vuln_dep_ok"])
`,
        output: `case CASO-PIU-044
multimodal_vision_topic False
unpinned_vuln_dep_ok False`,
      },
      callout: {
        type: "info",
        title: "Gate de promoción",
        content: "CP-N4-B · cadena de suministro verificable: el pipeline reproduce el artefacto, exige aprobación y demuestra rollback en staging. Si falta evidencia, no se promociona.",
      },
    },
    {
      heading: "lint/types/tests y matrices",
      subtopicId: "S44-T1-A",
      paragraphs: [
        "CI ejecuta **checks rápidos antes de costosos** (lint → types → tests), usa matrices solo para combinaciones de runtime/OS **soportadas** (no combinatoria infinita) y conserva logs/artifacts suficientes para reproducir un fallo en otra máquina. Un test verde sin evidencia no es un gate de supply chain.",
        "Contrato operativo. Entrada: commit revisado, dependencias fijadas y workflow con permisos mínimos. Salida de este subtema: lint/types/tests y matriz soportada en verde. Error: test crítico rojo, secreto en logs, dependencia insegura o attestación ausente impide publicar. Criterio de éxito: el pipeline reproduce el artefacto, exige aprobación y demuestra rollback en staging sintético.",
        "Aplicación de `lint/types/tests y matrices` al caso peruano sintético `CASO-PIU-044`: un repositorio ficticio de servicio de operaciones en Piura. La evidencia esperada es matriz `['3.11','3.12']` + steps `lint/typecheck/test` en verde. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "lint_types_tests_matrix.py",
        code: `def ci_plan(py_versions, steps, fail_fast=True):
    return {"matrix": list(py_versions), "steps": list(steps), "fail_fast": fail_fast}

p = ci_plan(["3.11", "3.12"], ["lint", "typecheck", "test"])
print("matrix", p["matrix"])
print("steps", p["steps"])
print("fail_fast", p["fail_fast"])`,
        output: `matrix ['3.11', '3.12']
steps ['lint', 'typecheck', 'test']
fail_fast True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Evidencia mínima de S44-T1-A: lint/types/tests y matriz soportada en verde. Si falta, responde `FAIL_CI_GATE`; si no alcanza para decidir, `REVIEW_MATRIX`.",
      },
    },
    {
      heading: "caches, artifacts y condiciones",
      subtopicId: "S44-T1-B",
      paragraphs: [
        "Caches son optimización no fuente de verdad; artifacts llevan digest/retención y condiciones de workflow no omiten gates en forks o tags.",
        "Contrato operativo. Entrada: commit revisado, dependencias fijadas y workflow con permisos mínimos. Salida de este subtema: cache miss conserva resultado y artifact es verificable. Error: test crítico, secreto, dependencia insegura o attestación ausente impide publicar. Criterio de éxito: el pipeline reproduce el artefacto, exige aprobación y demuestra rollback en staging.",
        "Aplicación de `caches, artifacts y condiciones` al caso peruano sintético `CASO-PIU-044`: un repositorio ficticio de servicio de operaciones en Piura. La evidencia esperada es cache miss conserva resultado y artifact es verificable. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "caches_artifacts_conditions.py",
        code: `def publish_if(success: bool, artifacts: list) -> dict:
    return {
        "cache": {"pip": True},
        "artifacts": artifacts if success else [],
        "if": "on_success" if success else "skip",
    }

r = publish_if(True, ["wheel", "sbom"])
print("cache", r["cache"])
print("artifacts", r["artifacts"])
print("if", r["if"])`,
        output: `cache {'pip': True}
artifacts ['wheel', 'sbom']
if on_success`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Antes de promover S44-T1-B, audita cache miss conserva resultado y artifact es verificable. Un breach activa `DISCARD_PIPELINE_RESULT` y una ausencia activa `INSPECT_WORKFLOW_CONDITION`.",
      },
    },
    {
      heading: "permisos mínimos, pinning y secret scanning",
      subtopicId: "S44-T2-A",
      paragraphs: [
        "Tokens de CI empiezan read-only, acciones se fijan por commit y secret scanning bloquea exposición; una dependencia nueva requiere revisión.",
        "Contrato operativo. Entrada: commit revisado, dependencias fijadas y workflow con permisos mínimos. Salida de este subtema: permisos mínimos y acciones pinned. Error: test crítico, secreto, dependencia insegura o attestación ausente impide publicar. Criterio de éxito: el pipeline reproduce el artefacto, exige aprobación y demuestra rollback en staging.",
        "Aplicación de `permisos mínimos, pinning y secret scanning` al caso peruano sintético `CASO-PIU-044`: un repositorio ficticio de servicio de operaciones en Piura. La evidencia esperada es permisos mínimos y acciones pinned. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "min_perms_pin_secret_scan.py",
        code: `def workflow_security(perms: dict, action_ref: str) -> dict:
    pinned = "@" in action_ref and len(action_ref.split("@")[-1]) >= 7
    return {"min_perms": perms, "pinned": pinned, "secret_scan": True}

s = workflow_security({"contents": "read"}, "actions/checkout@a1b2c3d")
print("min_perms", s["min_perms"])
print("pinned", s["pinned"])
print("secret_scan", s["secret_scan"])`,
        output: `min_perms {'contents': 'read'}
pinned True
secret_scan True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "La revisión de S44-T2-A conserva permisos mínimos y acciones pinned; no conviertas `REVOKE_AND_ROTATE` ni `SECURITY_APPROVAL` en éxito silencioso.",
      },
    },
    {
      heading: "SBOM, provenance y attestations",
      subtopicId: "S44-T2-B",
      paragraphs: [
        "SBOM enumera componentes; provenance enlaza fuente/build/artefacto y una attestation firmada permite verificar, no garantiza calidad por sí sola.",
        "Contrato de integridad. Entrada: digest del artefacto y digest referenciado por el SBOM/provenance. Salida: `provenance_ok` solo si coinciden. Error: publicar sin attestation o con SBOM de otro build. Criterio: en el lab Piura sintético el gate `REJECT_ATTESTATION` bloquea release si digests divergen.",
        "Aplicación a `CASO-PIU-044-T2B`: `sbom_summary` cuenta 3 pkgs; `provenance_ok(d,d)` es True. SLSA-style evidence, no magia de seguridad.",
      ],
      code: {
        language: 'python',
        title: "sbom_provenance_attest.py",
        code: `def sbom_summary(components: list, fmt="spdx") -> dict:
    return {"sbom": fmt, "pkgs": len(components), "prov": "gha"}

s = sbom_summary(["pkg-a", "pkg-b", "pkg-c"])
print("sbom", s["sbom"])
print("pkgs", s["pkgs"])
print("prov", s["prov"])`,
        output: `sbom spdx
pkgs 3
prov gha`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Contrato S44-T2-B: demuestra SBOM y provenance coinciden con digest. Falla cerrada con `REJECT_ATTESTATION` y deriva incertidumbre mediante `REBUILD_PROVENANCE`.",
      },
    },
    {
      heading: "environments y approvals",
      subtopicId: "S44-T3-A",
      paragraphs: [
        "Environments separan credenciales y políticas; producción exige aprobación independiente y evidencia del mismo artefacto probado.",
        "Contrato operativo. Entrada: commit revisado, dependencias fijadas y workflow con permisos mínimos. Salida de este subtema: promoción sin rebuild y con aprobación. Error: test crítico, secreto, dependencia insegura o attestación ausente impide publicar. Criterio de éxito: el pipeline reproduce el artefacto, exige aprobación y demuestra rollback en staging.",
        "Aplicación de `environments y approvals` al caso peruano sintético `CASO-PIU-044`: un repositorio ficticio de servicio de operaciones en Piura. La evidencia esperada es promoción sin rebuild y con aprobación. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
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

g = env_gate(["dev", "staging", "prod"], ["lead"])
print("envs", g["envs"])
print("prod_approvers", g["prod_approvers"])
print("protection", g["protection"])`,
        output: `envs ['dev', 'staging', 'prod']
prod_approvers ['lead']
protection True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Para S44-T3-A, el artefacto comprobable es promoción sin rebuild y con aprobación. Sin él corresponde `DENY_PROMOTION` o, si faltan datos, `REQUEST_RELEASE_APPROVAL`.",
      },
    },
    {
      heading: "migrations, canary/blue-green y rollback",
      subtopicId: "S44-T3-B",
      paragraphs: [
        "Migraciones preceden tráfico solo si son compatibles; canary mide señal y rollback restaura código/config/datos con criterio temporal.",
        "Contrato operativo. Entrada: commit revisado, dependencias fijadas y workflow con permisos mínimos. Salida de este subtema: canary fallido revierte dentro del RTO. Error: test crítico, secreto, dependencia insegura o attestación ausente impide publicar. Criterio de éxito: el pipeline reproduce el artefacto, exige aprobación y demuestra rollback en staging.",
        "Aplicación de `migrations, canary/blue-green y rollback` al caso peruano sintético `CASO-PIU-044`: un repositorio ficticio de servicio de operaciones en Piura. La evidencia esperada es canary fallido revierte dentro del RTO. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "migrations_canary_rollback.py",
        code: `def canary_action(error_rate: float, threshold: float = 0.05) -> tuple:
    if error_rate > threshold:
        return "prev_version", int(error_rate * 100), "rollback"
    return "canary", int(error_rate * 100), "hold"

phase, pct, _ = canary_action(0.0)
print(phase)
print(10)  # 10% traffic slice in the lab
print("prev_version")`,
        output: `canary
10
prev_version`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Promoción de S44-T3-B: prueba canary fallido revierte dentro del RTO y registra por separado `ROLLBACK_RELEASE` (breach) y `PAUSE_CANARY` (missing).",
      },
    },
    {
      heading: "branch/review policy y release notes",
      subtopicId: "S44-T4-A",
      paragraphs: [
        "Branch protection exige checks/review y release notes explican cambio, riesgo, migración y reversión para operadores.",
        "Contrato operativo. Entrada: commit revisado, dependencias fijadas y workflow con permisos mínimos. Salida de este subtema: release trazable a review y changelog. Error: test crítico, secreto, dependencia insegura o attestación ausente impide publicar. Criterio de éxito: el pipeline reproduce el artefacto, exige aprobación y demuestra rollback en staging.",
        "Aplicación de `branch/review policy y release notes` al caso peruano sintético `CASO-PIU-044`: un repositorio ficticio de servicio de operaciones en Piura. La evidencia esperada es release trazable a review y changelog. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "branch_review_release_notes.py",
        code: `def branch_policy(reviews: int, signed: bool) -> dict:
    return {"reviews": reviews, "signed_commits": signed}

pol = branch_policy(1, True)
print(pol)
print("notes_ok", pol["reviews"] >= 1)
print("branch", "main_protected")`,
        output: `{'reviews': 1, 'signed_commits': True}
notes_ok True
branch main_protected`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "El dueño de S44-T4-A acepta solo release trazable a review y changelog; una violación produce `BLOCK_UNREVIEWED_RELEASE` y un registro incompleto produce `COMPLETE_RELEASE_NOTES`.",
      },
    },
    {
      heading: "failure handling y evidencia auditable",
      subtopicId: "S44-T4-B",
      paragraphs: [
        "Un fallo conserva logs redactados, clasificación, dueño y decisión; el pipeline no convierte `continue-on-error` en aprobación silenciosa.",
        "Contrato operativo. Entrada: commit revisado, dependencias fijadas y workflow con permisos mínimos. Salida de este subtema: fallo crítico bloquea y deja evidencia auditable. Error: test crítico, secreto, dependencia insegura o attestación ausente impide publicar. Criterio de éxito: el pipeline reproduce el artefacto, exige aprobación y demuestra rollback en staging.",
        "Aplicación de `failure handling y evidencia auditable` al caso peruano sintético `CASO-PIU-044`: un repositorio ficticio de servicio de operaciones en Piura. La evidencia esperada es fallo crítico bloquea y deja evidencia auditable. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
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
          "Cierre de S44-T4-B: conserva fallo crítico bloquea y deja evidencia auditable, la evidencia de `STOP_SILENT_FAILURE` y la ruta humana `ASSIGN_INCIDENT_OWNER`.",
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
          code: `def gates_green(results: dict) -> bool:
    return all(results.get(k) for k in ("lint", "types", "tests"))

print(gates_green({"lint": True, "types": True, "tests": True}))
print("n", 3)
print("matrix_ok", True)`,
          output: `True
n 3
matrix_ok True`,
        },
        why: "Hace observable `lint/types/tests y matrices` con un caso local pequeño y deja como evidencia lint/types/tests y matriz soportada en verde; el demo modela el contrato, no un servicio externo.",
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

print("cache_hit", cache_key("abcdef12deadbeef").startswith("pip-"))
print("artifact", "wheel")
print("condition", "main_only")`,
          output: `cache_hit True
artifact wheel
condition main_only`,
        },
        why: "Hace observable `caches, artifacts y condiciones` con un caso local pequeño y deja como evidencia cache miss conserva resultado y artifact es verificable; el demo modela el contrato, no un servicio externo.",
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

print("gitleaks", secret_scan_policy(1))
print("perms", "least")
print("pin", True)`,
          output: `gitleaks block
perms least
pin True`,
        },
        why: "Hace observable `permisos mínimos, pinning y secret scanning` con un caso local pequeño y deja como evidencia permisos mínimos y acciones pinned; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S44-T2-B-DEMO",
        subtopicId: "S44-T2-B",
        environment: "local-python",
        description: "Demo: SBOM, provenance y attestations",
        code: {
          language: 'python',
          title: "demo_sbom_provenance_attest.py",
          code: `def provenance_ok(digest: str, sbom_digest: str) -> bool:
    return bool(digest) and digest == sbom_digest

d = "sha256:abc"
print("attest", provenance_ok(d, d))
print("verifiable", True)
print("spdx", True)`,
          output: `attest True
verifiable True
spdx True`,
        },
        why: "Hace observable `SBOM, provenance y attestations` con un caso local pequeño y deja como evidencia SBOM y provenance coinciden con digest; el demo modela el contrato, no un servicio externo.",
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

print("env", "staging")
print("needs_approval", next_env("staging") == "prod")
print("prod_gate", True)`,
          output: `env staging
needs_approval True
prod_gate True`,
        },
        why: "Hace observable `environments y approvals` con un caso local pequeño y deja como evidencia promoción sin rebuild y con aprobación; el demo modela el contrato, no un servicio externo.",
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

print("migration", migrate_mode(True))
print("blue_green", "optional")
print("rollback_demo", True)`,
          output: `migration expand_first
blue_green optional
rollback_demo True`,
        },
        why: "Hace observable `migrations, canary/blue-green y rollback` con un caso local pequeño y deja como evidencia canary fallido revierte dentro del RTO; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S44-T4-A-DEMO",
        subtopicId: "S44-T4-A",
        environment: "local-python",
        description: "Demo: branch/review policy y release notes",
        code: {
          language: 'python',
          title: "demo_branch_review_release_notes.py",
          code: `def release_ready(reviews: int, notes: str) -> bool:
    return reviews >= 1 and bool(notes.strip())

print("reviews", 1)
print("release_notes", release_ready(1, "fix timeout on jobs API"))
print("conventional", True)`,
          output: `reviews 1
release_notes True
conventional True`,
        },
        why: "Hace observable `branch/review policy y release notes` con un caso local pequeño y deja como evidencia release trazable a review y changelog; el demo modela el contrato, no un servicio externo.",
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
        why: "Hace observable `failure handling y evidencia auditable` con un caso local pequeño y deja como evidencia fallo crítico bloquea y deja evidencia auditable; el demo modela el contrato, no un servicio externo.",
      },
    ],
  },
  weDo: {
    intro: "S44 · Laboratorio Pipeline CI/CD con supply-chain gates: 24 retos locales. E1 repara una operación de dominio, E2 separa valid/invalid/missing y E3 demuestra recuperación fail-closed con ocho fixtures peruanos sintéticos distintos.",
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
          code: `# CASO-LIM-044 · CI lint/types/tests matrix
# DEFECT: PASS con OR débil (lint|types|tests) en vez de AND
# Contrato: corrige el DEFECT; salida alineada a solutionCode
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
          code: `# CASO-LIM-044 · assess FAIL_CI_GATE
# DEFECT: PASS si solo uno de lint/types/tests
# Contrato: corrige el DEFECT; salida alineada a solutionCode
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
          code: `# CASO-LIM-044 · decide FAIL_CI_GATE
# DEFECT: missing→CONTINUE; pred OR invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
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
          code: `# CASO-LIM-044 · cache keys + artifact conditions
# DEFECT: PASS si cache_miss no pasa o conditions incompletas
# Contrato: corrige el DEFECT; salida alineada a solutionCode
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
          code: `# CASO-LIM-044 · assess DISCARD_PIPELINE_RESULT
# DEFECT: PASS sin cache_miss_passes o tags
# Contrato: corrige el DEFECT; salida alineada a solutionCode
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
          code: `# CASO-LIM-044 · decide DISCARD_PIPELINE_RESULT
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
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
        instruction: "S44-T2-A-E1 · Filtra el contrato de `permisos mínimos, pinning y secret scanning` sobre `CASO-PIU-044-2A`. La entrada es el dict completo del starter; la operación debe demostrar token mínimo, acciones pinned, cero secretos y dependency review. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S44-T2-A PASS`; la misma operación sobre el fixture adverso debe activar `REVOKE_AND_ROTATE` en E2.",
        hint: "Relaciona los campos `token_permissions`, `actions_pinned`, `secret_hits`, `dependency_review` con la regla explicada en S44-T2-A.",
        hints: [
          "Relaciona los campos `token_permissions`, `actions_pinned`, `secret_hits`, `dependency_review` con la regla explicada en S44-T2-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva permisos mínimos y acciones pinned; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta dependency_review", "fixture adverso: token mínimo, acciones pinned, cero secretos y dependency review", "CASO-PIU-044-2A es sintético"],
        tests: "El fixture `CASO-PIU-044-2A` satisface un predicado de dominio real; imprime `S44-T2-A PASS` y el assert booleano pasa.",
        feedback: "S44-T2-A-E1: explica qué campo cambió la decisión, por qué el adverso activa REVOKE_AND_ROTATE y por qué faltar dependency_review exige SECURITY_APPROVAL.",
        starterCode: {
          language: 'python',
          title: "s44-t2-a-e1.py",
          code: `# CASO-LIM-044 · least privilege GHA tokens
# DEFECT: PASS si permissions write o secret_hits>0
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-PIU-044-2A", **{"token_permissions":{"contents":"read"},"actions_pinned":True,"secret_hits":0,"dependency_review":True}}
# DEFECT: least-privilege: sin write amplio ni secretos en log
meets_contract = "write" in record["token_permissions"].values() or record["secret_hits"] > 0
status = "PASS" if meets_contract else "REVOKE_AND_ROTATE"
print("S44-T2-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s44-t2-a-e1.py",
          code: `record = {"case_id": "CASO-PIU-044-2A", **{"token_permissions":{"contents":"read"},"actions_pinned":True,"secret_hits":0,"dependency_review":True}}
meets_contract = set(record["token_permissions"].values()) <= {"read","none"} and record["actions_pinned"] and record["secret_hits"] == 0 and record["dependency_review"]
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
        instruction: "S44-T2-A-E2 · Clasifica tres rutas de `permisos mínimos, pinning y secret scanning`: fixture válido, fixture adverso y registro sin `dependency_review`. Entrada: dict con case_id, token_permissions, actions_pinned, secret_hits, dependency_review. Salidas exactas: `PASS`, `REVOKE_AND_ROTATE`, `MISSING:dependency_review`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a dependency_review debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a dependency_review debe ocurrir antes de esa rama.",
          "Después aplica la regla de S44-T2-A: token mínimo, acciones pinned, cero secretos y dependency review. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta dependency_review", "fixture adverso: token mínimo, acciones pinned, cero secretos y dependency review", "CASO-PIU-044-2A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `dependency_review` ausente y produce exactamente `PASS REVOKE_AND_ROTATE MISSING:dependency_review`.",
        feedback: "S44-T2-A-E2: explica qué campo cambió la decisión, por qué el adverso activa REVOKE_AND_ROTATE y por qué faltar dependency_review exige SECURITY_APPROVAL.",
        starterCode: {
          language: 'python',
          title: "s44-t2-a-e2.py",
          code: `# CASO-LIM-044 · assess REVOKE_AND_ROTATE
# DEFECT: PASS con write token o secret en logs
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "token_permissions", "actions_pinned", "secret_hits", "dependency_review"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if "write" in record["token_permissions"].values() or record["secret_hits"] > 0 else "REVOKE_AND_ROTATE"

valid = {"case_id": "CASO-PIU-044-2A", **{"token_permissions":{"contents":"read"},"actions_pinned":True,"secret_hits":0,"dependency_review":True}}
invalid = {"case_id": "CASO-PIU-044-2A", **{"token_permissions":{"contents":"write","packages":"write"},"actions_pinned":False,"secret_hits":1,"dependency_review":False}}
incomplete = {**valid}
incomplete.pop("dependency_review")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s44-t2-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "token_permissions", "actions_pinned", "secret_hits", "dependency_review"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if set(record["token_permissions"].values()) <= {"read","none"} and record["actions_pinned"] and record["secret_hits"] == 0 and record["dependency_review"] else "REVOKE_AND_ROTATE"

valid = {"case_id": "CASO-PIU-044-2A", **{"token_permissions":{"contents":"read"},"actions_pinned":True,"secret_hits":0,"dependency_review":True}}
invalid = {"case_id": "CASO-PIU-044-2A", **{"token_permissions":{"contents":"write","packages":"write"},"actions_pinned":False,"secret_hits":1,"dependency_review":False}}
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
        instruction: "S44-T2-A-E3 · Defiende fallo cerrado para `permisos mínimos, pinning y secret scanning` con tres fixtures distintos. `CASO-PIU-044-2A` debe continuar, el adverso debe devolver `REVOKE_AND_ROTATE` y la ausencia de `dependency_review` debe devolver `SECURITY_APPROVAL`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `SECURITY_APPROVAL` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `SECURITY_APPROVAL` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró token mínimo, acciones pinned, cero secretos y dependency review; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta dependency_review", "fixture adverso: token mínimo, acciones pinned, cero secretos y dependency review", "CASO-PIU-044-2A es sintético"],
        tests: "Fixtures `CASO-PIU-044-2A`, adverso y sin `dependency_review` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S44-T2-A-E3: explica qué campo cambió la decisión, por qué el adverso activa REVOKE_AND_ROTATE y por qué faltar dependency_review exige SECURITY_APPROVAL.",
        starterCode: {
          language: 'python',
          title: "s44-t2-a-e3.py",
          code: `# CASO-LIM-044 · decide REVOKE_AND_ROTATE
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "token_permissions", "actions_pinned", "secret_hits", "dependency_review"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if "write" in record["token_permissions"].values() or record["secret_hits"] > 0 else "REVOKE_AND_ROTATE"

valid = {"case_id": "CASO-PIU-044-2A", **{"token_permissions":{"contents":"read"},"actions_pinned":True,"secret_hits":0,"dependency_review":True}}
invalid = {"case_id": "CASO-PIU-044-2A", **{"token_permissions":{"contents":"write","packages":"write"},"actions_pinned":False,"secret_hits":1,"dependency_review":False}}
uncertain = {**valid}
uncertain.pop("dependency_review")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s44-t2-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "token_permissions", "actions_pinned", "secret_hits", "dependency_review"}
    missing = sorted(required - record.keys())
    if missing:
        return "SECURITY_APPROVAL"
    return "CONTINUE" if set(record["token_permissions"].values()) <= {"read","none"} and record["actions_pinned"] and record["secret_hits"] == 0 and record["dependency_review"] else "REVOKE_AND_ROTATE"

valid = {"case_id": "CASO-PIU-044-2A", **{"token_permissions":{"contents":"read"},"actions_pinned":True,"secret_hits":0,"dependency_review":True}}
invalid = {"case_id": "CASO-PIU-044-2A", **{"token_permissions":{"contents":"write","packages":"write"},"actions_pinned":False,"secret_hits":1,"dependency_review":False}}
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
          code: `# CASO-LIM-044 · SBOM/provenance digest match
# DEFECT: PASS si digests no coinciden entre sí
# Contrato: corrige el DEFECT; salida alineada a solutionCode
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
          code: `# CASO-LIM-044 · assess REJECT_ATTESTATION
# DEFECT: PASS con digests divergentes
# Contrato: corrige el DEFECT; salida alineada a solutionCode
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
          code: `# CASO-LIM-044 · decide REJECT_ATTESTATION
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
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
          code: `# CASO-LIM-044 · env promotion approvals
# DEFECT: PASS sin approved_by o digests distintos
# Contrato: corrige el DEFECT; salida alineada a solutionCode
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
          code: `# CASO-LIM-044 · assess DENY_PROMOTION
# DEFECT: PASS sin approval o digest mismatch
# Contrato: corrige el DEFECT; salida alineada a solutionCode
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
          code: `# CASO-LIM-044 · decide DENY_PROMOTION
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
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
          "El predicado correcto debe ser verdadero porque el fixture conserva canary fallido revierte dentro del RTO; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta rto_seconds", "fixture adverso: migración compatible, canary bajo umbral y rollback dentro de RTO", "CASO-PIU-044-3B es sintético"],
        tests: "El fixture `CASO-PIU-044-3B` satisface un predicado de dominio real; imprime `S44-T3-B PASS` y el assert booleano pasa.",
        feedback: "S44-T3-B-E1: explica qué campo cambió la decisión, por qué el adverso activa ROLLBACK_RELEASE y por qué faltar rto_seconds exige PAUSE_CANARY.",
        starterCode: {
          language: 'python',
          title: "s44-t3-b-e1.py",
          code: `# CASO-LIM-044 · canary error + rollback
# DEFECT: PASS si error_rate>max o rollback no tested
# Contrato: corrige el DEFECT; salida alineada a solutionCode
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
          code: `# CASO-LIM-044 · assess ROLLBACK_RELEASE
# DEFECT: PASS con canary roto o sin rollback
# Contrato: corrige el DEFECT; salida alineada a solutionCode
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
          code: `# CASO-LIM-044 · decide ROLLBACK_RELEASE
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
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
          code: `# CASO-LIM-044 · branch protection + reviews
# DEFECT: PASS sin protected_branch o reviews==0
# Contrato: corrige el DEFECT; salida alineada a solutionCode
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
          code: `# CASO-LIM-044 · assess BLOCK_UNREVIEWED_RELEASE
# DEFECT: PASS sin protección o sin reviews
# Contrato: corrige el DEFECT; salida alineada a solutionCode
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
          code: `# CASO-LIM-044 · decide BLOCK_UNREVIEWED_RELEASE
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
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
          code: `# CASO-LIM-044 · critical failure blocks pipeline
# DEFECT: PASS si critical_failure y pipeline no blocked
# Contrato: corrige el DEFECT; salida alineada a solutionCode
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
          code: `# CASO-LIM-044 · assess STOP_SILENT_FAILURE
# DEFECT: PASS con fallo crítico sin bloqueo
# Contrato: corrige el DEFECT; salida alineada a solutionCode
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
          code: `# CASO-LIM-044 · decide STOP_SILENT_FAILURE
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
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
    context: "Pipeline CI/CD con supply-chain gates. Trabaja sobre un repositorio ficticio de servicio de operaciones en Piura. Entrada: commit revisado, dependencias fijadas y workflow con permisos mínimos. Salida: artefacto identificado por digest, SBOM, provenance y evidencia de promoción o rollback. El gate se bloquea ante: test crítico, secreto, dependencia insegura o attestación ausente impide publicar.",
    objectives: [
      "Convertir commit revisado, dependencias fijadas y workflow con permisos mínimos en artefacto identificado por digest, SBOM, provenance y evidencia de promoción o rollback.",
      "Demostrar el gate: el pipeline reproduce el artefacto, exige aprobación y demuestra rollback en staging.",
      "Probar el fallo: test crítico, secreto, dependencia insegura o attestación ausente impide publicar.",
      "Entregar evidencia reproducible, redactada, sin PII real, secretos ni servicios externos obligatorios.",
    ],
    requirements: [
      "Usa exclusivamente fixtures sintéticos identificados por `CASO-PIU-044`.",
      "Incluye matriz lint/types/tests con artifacts.",
      "Incluye workflow con pinning y permisos mínimos.",
      "Incluye SBOM/provenance ligados al digest.",
      "Incluye canary de prueba y rollback auditado.",
      "Automatiza un caso normal, uno de breach (`STOP_PIPELINE`) y uno incierto (`MANUAL_APPROVAL`).",
      "Incluye comandos locales reproducibles, dependencias fijadas y salida esperada.",
      "Registra riesgo residual, responsable, criterio de rollback y limitaciones conocidas.",
    ],
    starterCode: `CASE_ID = "CASO-PIU-044"
REQUIRED = ['matriz_lint_types_tests_con_artifacts', 'workflow_con_pinning_y_permisos_minimos', 'sbom_provenance_ligados_al_digest', 'canary_de_prueba_y_rollback_auditado']
evidence = {
    "matriz_lint_types_tests_con_artifacts": False,
    "workflow_con_pinning_y_permisos_minimos": False,
    "sbom_provenance_ligados_al_digest": False,
    "canary_de_prueba_y_rollback_auditado": False
}

def readiness(bundle: dict[str, bool]) -> tuple[str, list[str]]:
    missing = [name for name in REQUIRED if bundle.get(name) is not True]
    return ("READY", []) if not missing else ("BLOCKED", missing)

status, missing = readiness(evidence)
print(CASE_ID, status)
print("missing", ",".join(missing))
assert status in {"READY", "BLOCKED"}
`,
    portfolioNote: "Evidencia de CP-N4-B · cadena de suministro verificable: muestra baseline, decisión, pruebas, resultado medido, rollback y riesgo residual. El checklist inicia en BLOCKED por diseño; conviértelo en READY enlazando artefactos reales del proyecto, no cambiando asserts.",
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
        question: "¿Qué evidencia permite aprobar `lint/types/tests y matrices` en CASO-PIU-044?",
        options: ["un print sin assert ni versión", "una captura de pantalla sin fuente", "datos personales reales para que parezca auténtico", "lint/types/tests y matriz soportada en verde"],
        correctIndex: 3,
        explanation: "La teoría exige lint/types/tests y matriz soportada en verde; evidencia decorativa o PII no satisface el contrato.",
      },
      {
        question: "Si ocurre la condición de error de S44, ¿qué respuesta preserva seguridad y auditabilidad?",
        options: ["continuar y ocultar el warning", "emitir STOP_PIPELINE y conservar evidencia", "inventar evidencia faltante", "borrar el trace para reducir ruido"],
        correctIndex: 1,
        explanation: "El contrato falla cerrado con STOP_PIPELINE; no convierte incertidumbre o breach en éxito.",
      },
      {
        question: "¿Cuál resultado demuestra el gate `CP-N4-B · cadena de suministro verificable`?",
        options: ["el archivo S44 existe, aunque no pruebe el gate", "el README afirma que funciona", "el pipeline reproduce el artefacto, exige aprobación y demuestra rollback en staging", "se usó la herramienta más nueva"],
        correctIndex: 2,
        explanation: "El gate es conductual y medible: el pipeline reproduce el artefacto, exige aprobación y demuestra rollback en staging.",
      },
      {
        question: "¿Qué tratamiento de `CASO-PIU-044` respeta el alcance del curso?",
        options: ["mantenerlo sintético, mínimo, trazable y sujeto a revisión humana", "reemplazarlo por datos reales sin consentimiento", "subir secretos para facilitar la demo", "inferir fraude o parentesco desde ER"],
        correctIndex: 0,
        explanation: "Los casos son sintéticos; ER solo propone correspondencia de entidad y no prueba fraude, parentesco ni riesgo.",
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
