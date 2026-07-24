import type { CourseSection } from '../../types'

export const section52: CourseSection = {
  id: "career-strategy",
  index: 52,
  title: "Enterprise Relationship & Operations Intelligence Platform: capstone final",
  shortTitle: "Capstone FINAL",
  tagline: "CP-FINAL: integración de 12 capstones, demo reproducible, system card y caso de impacto para CV",
  estimatedHours: 80,
  level: "Master",
  phase: 3,
  icon: "Rocket",
  accentColor: "bg-gradient-to-br from-amber-500 to-red-600",
  jobRelevance:
    "En equipos de plataforma y producto (fintech, retail, gobierno digital en Perú y LatAm), el cierre de carrera se juega con un **portfolio defendible**: demo reproducible, system/model cards, métricas con baseline y límites éticos — no con un CV de soft skills genérico. Esta sección integra tu **Enterprise Relationship & Operations Intelligence Platform** (caso sintético multi-región: Lima, Arequipa, Cusco, Piura) y solo promociona cuando 52/52, 12/12 capstones, CP-FINAL y regresión completa pasan **sin compensar** CP-N4-C. En una entrevista senior te pedirán el trade-off, el reloj del drill y qué aportaste tú.",
  learningOutcomes: [
    { text: "Revalidar CF-1 con matriz viva stakeholder/job/métrica y baseline sintético congelado (evidencia: change_log + fixtures)" },
    { text: "Firmar constraints, riesgos con owner y no-go (real_pii, auto_fraud_label) con umbral y responsable" },
    { text: "Mapear seis bounded contexts (intake, er, relationship, triage, reporting, copilot) con APIs/eventos versionados y contract tests" },
    { text: "Ensamblar datos/modelos/RPA/RAG bajo human workflow (HITL) sin auto-etiquetar fraude ni parentesco" },
    { text: "Ejecutar matriz de verificación (unit/contract/integration/evals/red team/performance) con cero P0/P1 abiertos" },
    { text: "Demostrar SLO, RPO/RTO medidos, backup y disaster exercise con restore verificado" },
    { text: "Preparar demo ≤10 min (problema→baseline→decisión→métrica→límite) y narrativa de CV con contribución personal" },
    { text: "Publicar evidence bundle de 8 artefactos y defender trade-offs sin compensar CP-N4-C" },
  ],
  theory: [
    {
      heading: "Ruta de S52 · Capstone FINAL (plataforma de relación y operaciones)",
      paragraphs: [
        "**Diccionario de la sección** (léelo antes de T1). **CP-FINAL:** capstone de integración del currículo completo. **CF-1 revalidación:** stakeholders, jobs y métricas actualizados. **No-go:** decisión de no desplegar si riesgo o evidencia faltan. **Bounded contexts:** fronteras intake, ER, relationship, triage, reporting, copilot (integradas por API/evento, no por DB compartida). **HITL:** human-in-the-loop — humano decide en riesgos sensibles. **RAG:** retrieval-augmented generation con citas. **RPO/RTO:** Recovery Point/Time Objective (cuánto dato y tiempo puedes perder). **SLO:** Service Level Objective. **ADR:** Architecture Decision Record. **C4:** modelo de arquitectura (contexto→contenedores→componentes→código). **Regresión S1–S52:** smoke de contratos y demos. **Disaster exercise:** backup/rollback probados con reloj. **System/model cards:** límites y ownership. **Demo reproducible:** un comando + fixtures sintéticos. **Defensa técnica:** trade-offs y contribución personal. **Promoción máster:** 52/52 + 12/12 + CP-FINAL + regresión sin P0/P1; **no compensa** CP-N4-C.",
        "Esta sección es el **cierre senior-master**: integra S01–S51 y los **12 capstones** en la **Enterprise Relationship & Operations Intelligence Platform** (producto del CV, no un curso de soft skills). El caso `CASO-PER-052` (plataforma nacional sintética multi-región: Lima, Arequipa, Cusco, Piura — datos inventados) corre sin credenciales, sin PII real y sin auto-etiquetar fraude. Graduación exige 52/52 + 12/12 + CP-FINAL + regresión — **sin compensar** CP-N4-C. Aquí **carrera profesional** significa **portfolio técnico defendible** (demo, métricas, límites y contribución personal).",
        "Producto incremental defendible. **Entrada:** artefactos congelados S1–S51, contratos, riesgos, no-go y benchmark. **Salida:** producto reproducible, demo, cards, evidencia de drill y defensa de trade-offs/contribución personal. **El gate bloquea la graduación** si hay P0/P1 abiertos, PII real, dependencia no reproducible, rollback no probado o afirmación sin evidencia. Cuando ese gate pasa en serio — con reloj, baseline y bundle de 8 — el cierre no es castigo: es **celebración legítima** de un portfolio que un revisor externo puede ejecutar y cuestionar.",
        "Cómo se ensamblan los 12 capstones (grafo de dependencia, no basurero de repos sueltos): fundaciones de datos/ETL/entidad (ER) alimentan **intake + er + relationship**; modelos, evals y RAG alimentan **reporting + copilot** siempre bajo HITL; RPA y operación alimentan **triage** y el paquete de DR; cada CP-N* aporta un artefacto o contrato reutilizable, pero **ningún capstone parcial compensa** un CP-N4-C fallido ni un P0 abierto. El hilo narrativo de defensa es: *CF-1 delta → no-go firmado → mapa de 6 contexts → cadena HITL → matriz de 6 capas → drill RPO/RTO → demo ≤10 min → evidence bundle de 8*.",
        "Orden de ensamblaje (no saltes etapas): **T1** revalida CF-1 y firma no-go → **T2** cablea seis contexts + HITL → **T3** congela verificación y mide DR → **T4** empaqueta demo/CV y el bundle de 8 artefactos. Plan 80 h orientativo: sem. 1–2 CF-1/no-go (~16 h); sem. 3–5 integración contexts/HITL y contract tests (~24 h); sem. 6–7 evals/red team/SLO/drill medido (~16 h); sem. 8–9 demo + evidence bundle + defensa oral (~16–24 h). iDo modela el procedimiento con fixtures; weDo entrena **alfabetización de gate** (qué código emitir ante válido/adverso/ausente); youDo es el **ensamblaje real de 80 h** — APIs, regresión S1–S52, drill y bundle. Stack: **stdlib** + artefactos del curso.",
      ],
      code: {
        language: 'python',
        title: "s52_map_contract.py",
        code: `def section_contract():
    return {
        "case": "CASO-PER-052",
        "gates": ["s52_of_52", "capstones_12_of_12", "cp_final", "regression_s1_s52", "zero_p0_p1"],
        "cp_n4c_cannot_compensate": True,
        "pii_or_secrets_ok": False,
    }

c = section_contract()
print("case", c["case"])
print("cp_n4c_cannot_compensate", c["cp_n4c_cannot_compensate"])
print("pii_or_secrets_ok", c["pii_or_secrets_ok"])
`,
        output: `case CASO-PER-052
cp_n4c_cannot_compensate True
pii_or_secrets_ok False`,
      },
      callout: {
        type: "info",
        title: "Gate de promoción + cierre de carrera",
        content: "CP-FINAL · plataforma integral defendible: 52/52, 12/12 capstones, CP-FINAL y regresión completa pasan sin compensar CP-N4-C. Si falta evidencia, no se promociona. Cuando el gate pasa con evidencia real (baseline, reloj de drill, 8 artefactos, contribución personal), el portfolio es **carrera defendible** — listo para demo de entrevista y defensa de trade-offs.",
      },
    },
    {
      heading: "Stakeholders, jobs y success metrics de CF-1",
      subtopicId: "S52-T1-A",
      paragraphs: [
        "Antes de cablear la plataforma final, **revalida CF-1**: stakeholders, jobs y success metrics pueden haber cambiado desde S01. Registra el **delta** (quién se fue, qué métrica se retiró) en un change_log. Sin matriz viva stakeholder/job/métrica + baseline sintético congelado, el portfolio defiende un producto fantasma y el gate exige `REOPEN_CF1`.",
        "Procedimiento de revalidación: (1) lista stakeholders vivos y jobs actuales; (2) marca métricas retiradas en change_log; (3) congela baseline sintético (`baseline_frozen=True`); (4) si falta dueño o baseline, `INTERVIEW_STAKEHOLDER` / `REOPEN_CF1`. No reutilices la matriz de S01 sin delta: el producto final defiende *esta* versión. Puente a T1-B: con la matriz viva ya puedes firmar constraints y no-go.",
        "En `CASO-PER-052-1A` (ops, relationship, privacy; jobs≥3; ttr + review_precision; baseline_frozen) la matriz es válida. Un fixture solo con stakeholder `ops` y jobs=0 fuerza `REOPEN_CF1`. Datos sintéticos multi-región; ninguna métrica prueba fraude ni parentesco.",
      ],
      code: {
        language: 'python',
        title: "stakeholders_jobs_success_cf1.py",
        code: `def revalidate_cf1(stakeholders: set, jobs: int, metrics: set, baseline_frozen: bool) -> str:
    required_sh = {"ops", "relationship", "privacy"}
    required_m = {"ttr", "review_precision"}
    if required_sh <= stakeholders and jobs >= 3 and required_m <= metrics and baseline_frozen:
        return "PASS"
    return "REOPEN_CF1"

print(revalidate_cf1({"ops", "relationship", "privacy"}, 3, {"ttr", "review_precision"}, True))
print(revalidate_cf1({"ops"}, 0, set(), False))`,
        output: `PASS
REOPEN_CF1`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Evidencia mínima de S52-T1-A: matriz stakeholder/job/métrica con evidencia. Si falta, responde `REOPEN_CF1`; si no alcanza para decidir, `INTERVIEW_STAKEHOLDER`.",
      },
    },
    {
      heading: "Cambios, constraints, riesgos y no-go",
      subtopicId: "S52-T1-B",
      paragraphs: [
        "Con CF-1 vivo (T1-A), fijas **constraints, riesgos y no-go** con **dueño y umbral** escritos: presupuesto, latencia, PII real, auto-etiquetado de fraude. Alcance que compromete privacidad o elimina revisión humana se **rechaza** (`DECLARE_NO_GO`), no se «gestiona con un disclaimer». Matching/ER/scores son evidencia — **nunca** prueba de fraude, parentesco o colusión.",
        "Contrato no-go: `real_pii` y `auto_fraud_label` siempre bloqueados; `match_is_fraud` es False. Cada riesgo en el registro lleva owner; residual_risk_accepted debe ser explícito. Si falta firma o residual, `INDEPENDENT_RISK_REVIEW`. CP-FINAL no se aprueba si el no-go se viola — ethics fail-closed en toda la plataforma.",
        "En `CASO-PER-052-1B` los constraints incluyen synthetic-only + human-review y el no-go bloquea real-pii / auto-risk-decision. Matching/ER/scores alimentan revisión humana; no son veredicto legal. Puente a T2: con no-go firmado ya puedes mapear los seis bounded contexts sin diluir límites éticos.",
      ],
      code: {
        language: 'python',
        title: "changes_constraints_risks_nogo.py",
        code: `def nogo_ok(constraints: set, risks_with_owner: int, no_go: set, residual_ok: bool) -> bool:
    return (
        {"synthetic-only", "human-review"} <= constraints
        and risks_with_owner >= 1
        and {"real-pii", "auto-risk-decision"} <= no_go
        and residual_ok
    )

print("nogo_pass", nogo_ok({"synthetic-only", "human-review"}, 5, {"real-pii", "auto-risk-decision"}, True))
print("match_is_fraud", False)  # ER/score ≠ fraude`,
        output: `nogo_pass True
match_is_fraud False`,
      },
      callout: {
        type: "danger",
        title: "No-go de privacidad",
        content:
          "Antes de promover S52-T1-B, audita registro de riesgos y no-go firmado. Un breach activa `DECLARE_NO_GO` y una ausencia activa `INDEPENDENT_RISK_REVIEW`.",
      },
    },
    {
      heading: "Bounded contexts, APIs y eventos",
      subtopicId: "S52-T2-A",
      paragraphs: [
        "Tras firmar no-go (T1), la plataforma se descompone en **seis bounded contexts**: intake, er, relationship, triage, reporting, copilot. Se integran por **APIs y eventos versionados**; **contratos y ownership** evitan una base compartida como acoplamiento oculto. Contract tests end-to-end fallan el release si un productor rompe el schema — no se «arregla en el consumidor» a escondidas. **Relationship** no es opcional: es el corazón del nombre de la plataforma y del caso multi-región.",
        "Checklist de integración (ensamblaje real, no solo checklist mental): (1) dibuja el mapa de los seis contexts y el dueño de cada uno; (2) versiona OpenAPI y event schemas (`job.finished`, `case.updated` como mínimo); (3) prohíbe `shared_database` entre contexts; (4) exige ≥10 contract tests verdes que fallen si el productor cambia un campo. Flujo típico sintético: intake recibe el caso → er propone identidad → relationship actualiza grafo → triage prioriza → reporting emite métricas → copilot cita con RAG. Si falta mapa o tests, `MAP_BOUNDED_CONTEXTS` / `STOP_INTEGRATION_RELEASE`.",
        "En `CASO-PER-052-2A` el fixture válido trae los seis contexts (incluye relationship), APIs/eventos versionados, shared_database=False y contract_tests≥10. Un monólito `all-in-one` con DB compartida fuerza `STOP_INTEGRATION_RELEASE`. Datos sintéticos multi-región; sin secretos en el repo. Puente a T2-B: con los contexts cableados, la cadena HITL (ER→triage→RPA→RAG→humano) cierra el loop de decisión sensible sin auto-fraude.",
      ],
      code: {
        language: 'python',
        title: "bounded_apis_events.py",
        code: `REQUIRED = {"intake", "er", "relationship", "triage", "reporting", "copilot"}

def contexts_ok(contexts: set, apis_v: bool, events_v: bool, shared_db: bool, n_tests: int) -> bool:
    return REQUIRED <= contexts and apis_v and events_v and not shared_db and n_tests >= 10

print(sorted(REQUIRED))
print("ok", contexts_ok(REQUIRED, True, True, False, 12))
print("events", ["job.finished", "case.updated"])`,
        output: `['copilot', 'er', 'intake', 'relationship', 'reporting', 'triage']
ok True
events ['job.finished', 'case.updated']`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "La revisión de S52-T2-A conserva contract tests end-to-end; no conviertas `STOP_INTEGRATION_RELEASE` ni `MAP_BOUNDED_CONTEXTS` en éxito silencioso.",
      },
    },
    {
      heading: "Datos, modelos, RPA, RAG y human workflow",
      subtopicId: "S52-T2-B",
      paragraphs: [
        "Con los seis contexts cableados (T2-A), **datos, modelos, RPA y RAG** apoyan un **human workflow (HITL)**, no lo sustituyen: ER **propone** identidad, triage **prioriza**, el copiloto **cita** evidencia (RAG). **Ninguna señal prueba fraude o parentesco**; `infers_fraud` permanece False. Decisión sensible sin humano en el loop es no-go de graduación.",
        "Cadena permitida: er_proposes_match → triage_prioritizes → rpa_prepares_draft → rag_cites → **human_decides**. Si `infers_fraud` o se omite humano, `BLOCK_AUTOMATED_RISK_DECISION`. Si falta el flag de fraude explícito (incertidumbre de schema), `REQUEST_HUMAN_REVIEW`. No hay dark patterns de auto-aprobación.",
        "En `CASO-PER-052-2B` el fixture válido propone, prioriza, prepara draft, cita y deja decidir al humano. Un fixture que infiere fraude sin HITL se bloquea. Puente a T3: el stack ya es auditable; ahora la matriz de tests debe congelarlo.",
      ],
      code: {
        language: 'python',
        title: "data_models_rpa_rag_human.py",
        code: `def hitl_chain(er: bool, triage: bool, rpa: bool, rag: bool, human: bool, infers_fraud: bool) -> str:
    if all((er, triage, rpa, rag, human)) and not infers_fraud:
        return "PASS"
    return "BLOCK_AUTOMATED_RISK_DECISION"

print(hitl_chain(True, True, True, True, True, False))
print(hitl_chain(True, True, False, False, False, True))
print("layers", sorted(["data", "hitl", "models", "rag", "rpa"]))`,
        output: `PASS
BLOCK_AUTOMATED_RISK_DECISION
layers ['data', 'hitl', 'models', 'rag', 'rpa']`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Contrato S52-T2-B: demuestra que la decisión sensible conserva revisión humana. Falla cerrada con `BLOCK_AUTOMATED_RISK_DECISION` y deriva incertidumbre mediante `REQUEST_HUMAN_REVIEW`.",
      },
    },
    {
      heading: "Tests, evals, red team y performance",
      subtopicId: "S52-T3-A",
      paragraphs: [
        "Integración lista (T2) no basta: **tests, evals, red team y performance** cubren rutas normales y degradadas (tool caída, retrieval vacío, injection). Seis capas mínimas: unit, contract, integration, evals, red_team, performance. Cada hallazgo **P0/P1** deja un **regression test permanente** — no se cierra el ticket sin suite. Compensar CP-N4-C con demo bonita no es graduación.",
        "Gate de verificación: las seis capas en True y `open_p0 == 0` y `open_p1 == 0`. Breach → `BLOCK_FINAL_ON_P0_P1`. Si falta contador de severidad (schema incompleto) → `FIX_AND_RERUN_REGRESSION`. La regresión S1–S52 es smoke del currículo completo, no un print de “todo ok”.",
        "En `CASO-PER-052-3A` el fixture limpio pasa; uno con open_p0=1 y suites rotas se bloquea. Datos sintéticos; red team no usa PII real. Puente a T3-B: con P0/P1 en cero, toca demostrar resiliencia con reloj.",
      ],
      code: {
        language: 'python',
        title: "tests_evals_redteam_perf.py",
        code: `LAYERS = ("unit", "contract", "integration", "evals", "red_team", "performance")

def verification_ok(suite: dict) -> bool:
    return all(suite.get(k) for k in LAYERS) and suite.get("open_p0", 1) == 0 and suite.get("open_p1", 1) == 0

clean = {k: True for k in LAYERS} | {"open_p0": 0, "open_p1": 0}
dirty = {k: False for k in LAYERS} | {"open_p0": 1, "open_p1": 4, "unit": True}
print(verification_ok(clean), verification_ok(dirty))
print("layers", list(LAYERS))`,
        output: `True False
layers ['unit', 'contract', 'integration', 'evals', 'red_team', 'performance']`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Para S52-T3-A, el artefacto comprobable es matriz de verificación sin P0/P1. Sin él corresponde `BLOCK_FINAL_ON_P0_P1` o, si faltan datos, `FIX_AND_RERUN_REGRESSION`.",
      },
    },
    {
      heading: "SLO, backup, rollback y disaster exercise",
      subtopicId: "S52-T3-B",
      paragraphs: [
        "Con la matriz de tests en verde (T3-A), **SLO, backup, rollback y disaster exercise** se demuestran con **reloj y evidencia**, no con promesas de runbook. Mides: availability ≥ SLO, edad del backup ≤ RPO (horas), tiempo de rollback ≤ RTO (minutos), y **restore verificado** en un drill. Un PDF de procedimientos sin ejercicio **no reduce riesgo** operativo.",
        "Predicado medible: `availability >= slo` y `backup_age_h <= rpo_h` y `rollback_min <= rto_min` y `disaster_exercise` (restore verificado). Breach → `NO_GO_RESILIENCE`. Si falta el flag de drill → `RUN_DISASTER_EXERCISE`. Un tabletop verbal («hablamos de qué haríamos») **sin números** no cuenta para CP-FINAL.",
        "En `CASO-PER-052-3B` (avail 0.999, slo 0.995, backup 3 h ≤ RPO 4 h, rollback 8 min ≤ RTO 15 min, restore ok) pasa. Un fixture con avail 0.7 y rollback 120 min se bloquea con `NO_GO_RESILIENCE`. Puente a T4: con DR medido ya puedes narrar demo (baseline→resultado) y empaquetar el evidence bundle de 8.",
      ],
      code: {
        language: 'python',
        title: "slo_backup_rollback_disaster.py",
        code: `def resilience(availability: float, slo: float, backup_age_h: int, rpo_h: int, rollback_min: int, rto_min: int, restored: bool) -> dict:
    ok = (
        availability >= slo
        and backup_age_h <= rpo_h
        and rollback_min <= rto_min
        and restored
    )
    return {"ok": ok, "rpo_h": rpo_h, "rto_min": rto_min, "restore_verified": restored}

print(resilience(0.999, 0.995, 3, 4, 8, 15, True))
print(resilience(0.7, 0.995, 72, 4, 120, 15, False))`,
        output: `{'ok': True, 'rpo_h': 4, 'rto_min': 15, 'restore_verified': True}
{'ok': False, 'rpo_h': 4, 'rto_min': 15, 'restore_verified': False}`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Promoción de S52-T3-B: prueba RPO/RTO y restauración demostrados y registra por separado `NO_GO_RESILIENCE` (breach) y `RUN_DISASTER_EXERCISE` (missing).",
      },
    },
    {
      heading: "Demo y narrativa de CV",
      subtopicId: "S52-T4-A",
      paragraphs: [
        "Con la plataforma verificada y resiliente (T3), la **demo** narra **problema → baseline → decisión → métrica → límite** en ≤10 minutos, reproducible sin conocimiento tribal. El **CV/portfolio** distingue **contribución personal** de trabajo de equipo o plantillas del curso; inflar ownership es anti-patrón de carrera y de ética profesional. Ejemplo de viñeta defendible: «Problema: TTR de revisión 90 min en cola sintética multi-región → decisión: contract tests + blocking en triage API → resultado: 42 min (baseline congelado) → límite: HITL obligatorio, sin auto-fraude».",
        "Contrato de honestidad: `result_ttr < baseline_ttr`, benchmark sintético, demo ≤10 min, claims con fuente, personal_contribution documentada. Si el claim no se sostiene → `REJECT_UNSUPPORTED_PORTFOLIO_CLAIM`. Si falta contribución personal → `RECORD_PERSONAL_CONTRIBUTION`. Teatro de video sin números no aprueba — ni aunque el video sea bonito.",
        "En `CASO-PER-052-4A` (TTR 90→42 min sintético, 10 min de demo, claims sourced, contribución personal) pasa. Un claim con TTR peor y sin fuentes se rechaza. Puente a T4-B: la narrativa lista se empaqueta en el evidence bundle de 8 artefactos (C4, README, ADR, cards, LICENSE, video, defense_notes).",
      ],
      code: {
        language: 'python',
        title: "demo_cv_narrative.py",
        code: `def demo_script(baseline_ttr: int, result_ttr: int, personal: str, minutes: int = 10) -> dict:
    """Problema → baseline → decisión → métrica → límite (≤10 min)."""
    assert result_ttr < baseline_ttr, "sin mejora no hay claim"
    return {
        "minutes": minutes,
        "before_after": (baseline_ttr, result_ttr),
        "personal_contribution": personal,
        "claims_sourced": True,
        "synthetic_only": True,
    }

plan = demo_script(90, 42, "blocking + contract tests en triage API")
print("demo", plan)
print("cv_ok", plan["claims_sourced"] and bool(plan["personal_contribution"]))`,
        output: `demo {'minutes': 10, 'before_after': (90, 42), 'personal_contribution': 'blocking + contract tests en triage API', 'claims_sourced': True, 'synthetic_only': True}
cv_ok True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "El dueño de S52-T4-A acepta solo demo reproducible con antes/después; una violación produce `REJECT_UNSUPPORTED_PORTFOLIO_CLAIM` y un registro incompleto produce `RECORD_PERSONAL_CONTRIBUTION`.",
      },
    },
    {
      heading: "Arquitectura, READMEs, cards, licencia, video y defensa",
      subtopicId: "S52-T4-B",
      paragraphs: [
        "Cierre del capstone: **ocho artefactos** permiten a un revisor **ejecutar y cuestionar** el sistema sin conocimiento tribal — architecture.md (C4), README, ADR, system_card, model_card, LICENSE, demo_video y defense_notes. Falta de licencia o de evidencia de no-go es bloqueo de publicación. CP-FINAL es independiente de CP-N4-C: no se compensa con demos parciales.",
        "Predicado del bundle: los 8 nombres presentes + comando reproducible + trade-offs defendidos + cpn4c_independent. Incompleto → `BLOCK_INCOMPLETE_EVIDENCE_BUNDLE`. Si falta independencia de CP-N4-C en el registro → `SCHEDULE_TECHNICAL_DEFENSE`. El senior master gate exige paquete defendible, no solo código que corre en la laptop del autor.",
        "En `CASO-PER-052-4B` el set completo de 8 artefactos con reproducible_command y tradeoffs_defended aprueba. Un bundle solo con README se bloquea. **Celebración legítima:** cuando 52/52 + 12/12 + CP-FINAL + regresión pasan en cero P0/P1 — con reloj de drill, baseline y contribución personal — el portfolio es carrera defendible, listo para una defensa oral de 15–20 min ante un revisor que no conoce tu laptop.",
      ],
      code: {
        language: 'python',
        title: "arch_readme_cards_license_video_defense.py",
        code: `def evidence_bundle() -> list:
    return [
        "architecture.md",  # C4
        "README",
        "ADR",
        "system_card",
        "model_card",
        "LICENSE",
        "demo_video",
        "defense_notes",
    ]

bundle = evidence_bundle()
print(bundle)
print("n", len(bundle))
print("cp_final", "independent_of_cpn4c")`,
        output: `['architecture.md', 'README', 'ADR', 'system_card', 'model_card', 'LICENSE', 'demo_video', 'defense_notes']
n 8
cp_final independent_of_cpn4c`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Cierre de S52-T4-B: conserva evidence bundle de **8** artefactos verificables; breach → `BLOCK_INCOMPLETE_EVIDENCE_BUNDLE`; ausencia de independencia CP-N4-C → `SCHEDULE_TECHNICAL_DEFENSE`.",
      },
    },
  ],
  iDo: {
    intro: "Ocho demos de **modelado de procedimiento** (no teatro de `print(True)`): cada una calcula el predicado de CP-FINAL a partir de fixtures sintéticos `CASO-PER-052` — delta CF-1, no-go, seis contexts, cadena HITL, seis capas de tests, RPO/RTO medidos, guion de demo y bundle de 8. Observa el *cómo se decide*; el weDo te pide reparar el mismo contrato cuando llega roto; el youDo ensambla la plataforma real en ~80 h.",
    steps: [
      {
        demoId: "S52-T1-A-DEMO",
        subtopicId: "S52-T1-A",
        environment: "local-python",
        description: "Demo: revalidar CF-1 con matriz stakeholder/job/métrica y baseline congelado",
        code: {
          language: 'python',
          title: "demo_stakeholders_jobs_success_cf1.py",
          code: `def cf1_delta(old_metrics: set, new_metrics: set) -> dict:
    return {"retired": sorted(old_metrics - new_metrics), "added": sorted(new_metrics - old_metrics)}

def revalidate(stakeholders: set, jobs: int, metrics: set, baseline_frozen: bool) -> str:
    ok = {"ops", "relationship", "privacy"} <= stakeholders and jobs >= 3
    ok = ok and {"ttr", "review_precision"} <= metrics and baseline_frozen
    return "PASS" if ok else "REOPEN_CF1"

print("delta", cf1_delta({"ttr", "latency"}, {"ttr", "review_precision"}))
print("valid", revalidate({"ops", "relationship", "privacy"}, 3, {"ttr", "review_precision"}, True))
print("adverse", revalidate({"ops"}, 0, set(), False))`,
          output: `delta {'retired': ['latency'], 'added': ['review_precision']}
valid PASS
adverse REOPEN_CF1`,
        },
        why: "Modela el delta de métricas y el predicado CF-1 (stakeholders + jobs + baseline). En weDo repararás el mismo criterio invertido sobre `CASO-PER-052-1A`.",
      },
      {
        demoId: "S52-T1-B-DEMO",
        subtopicId: "S52-T1-B",
        environment: "local-python",
        description: "Demo: firmar constraints, riesgos con owner y no-go ético",
        code: {
          language: 'python',
          title: "demo_changes_constraints_risks_nogo.py",
          code: `def declare_nogo(constraints: set, risks_with_owner: int, no_go: set, residual_ok: bool) -> str:
    hard = {"real-pii", "auto-risk-decision"}
    if hard <= no_go and {"synthetic-only", "human-review"} <= constraints and risks_with_owner >= 1 and residual_ok:
        return "PASS"
    return "DECLARE_NO_GO"

print(declare_nogo({"synthetic-only", "human-review"}, 5, {"real-pii", "auto-risk-decision"}, True))
print(declare_nogo({"synthetic-only"}, 0, set(), False))
print("match_is_fraud", False)  # ER/score propone; no prueba fraude`,
          output: `PASS
DECLARE_NO_GO
match_is_fraud False`,
        },
        why: "Calcula PASS vs DECLARE_NO_GO a partir de constraints, owners y residual; deja explícito que ER/score ≠ fraude. Prepara E1–E3 de T1-B.",
      },
      {
        demoId: "S52-T2-A-DEMO",
        subtopicId: "S52-T2-A",
        environment: "local-python",
        description: "Demo: seis bounded contexts con contratos versionados y sin DB compartida",
        code: {
          language: 'python',
          title: "demo_bounded_apis_events.py",
          code: `REQUIRED = {"intake", "er", "relationship", "triage", "reporting", "copilot"}

def contract_gate(contexts: set, apis_v: bool, events_v: bool, shared_db: bool, n_tests: int) -> str:
    if REQUIRED <= contexts and apis_v and events_v and not shared_db and n_tests >= 10:
        return "PASS"
    return "STOP_INTEGRATION_RELEASE"

print("contexts", sorted(REQUIRED))
print(contract_gate(REQUIRED, True, True, False, 12))
print(contract_gate({"all-in-one"}, False, False, True, 0))`,
          output: `contexts ['copilot', 'er', 'intake', 'relationship', 'reporting', 'triage']
PASS
STOP_INTEGRATION_RELEASE`,
        },
        why: "Enumera los seis contexts (incluye relationship) y falla el monólito con DB compartida. Alinea iDo con el predicado de weDo T2-A.",
      },
      {
        demoId: "S52-T2-B-DEMO",
        subtopicId: "S52-T2-B",
        environment: "local-python",
        description: "Demo: cadena ER→triage→RPA→RAG con humano que decide",
        code: {
          language: 'python',
          title: "demo_data_models_rpa_rag_human.py",
          code: `def hitl_ok(record: dict) -> str:
    chain = ("er_proposes_match", "triage_prioritizes", "rpa_prepares_draft", "rag_cites", "human_decides")
    if all(record.get(k) for k in chain) and not record.get("infers_fraud"):
        return "PASS"
    return "BLOCK_AUTOMATED_RISK_DECISION"

valid = {"er_proposes_match": True, "triage_prioritizes": True, "rpa_prepares_draft": True, "rag_cites": True, "human_decides": True, "infers_fraud": False}
bad = {**valid, "human_decides": False, "infers_fraud": True}
print(hitl_ok(valid), hitl_ok(bad))
print("rag_mode", "cited")`,
          output: `PASS BLOCK_AUTOMATED_RISK_DECISION
rag_mode cited`,
        },
        why: "Modela la cadena propose-not-decide y bloquea auto-fraude. El weDo T2-B invierte el mismo predicado.",
      },
      {
        demoId: "S52-T3-A-DEMO",
        subtopicId: "S52-T3-A",
        environment: "local-python",
        description: "Demo: matriz de seis capas de verificación con cero P0/P1",
        code: {
          language: 'python',
          title: "demo_tests_evals_redteam_perf.py",
          code: `LAYERS = ("unit", "contract", "integration", "evals", "red_team", "performance")

def gate(suite: dict) -> str:
    if all(suite.get(k) for k in LAYERS) and suite.get("open_p0") == 0 and suite.get("open_p1") == 0:
        return "PASS"
    return "BLOCK_FINAL_ON_P0_P1"

clean = {k: True for k in LAYERS} | {"open_p0": 0, "open_p1": 0}
dirty = {**clean, "red_team": False, "open_p0": 1}
print(gate(clean), gate(dirty))
print("layers", list(LAYERS))`,
          output: `PASS BLOCK_FINAL_ON_P0_P1
layers ['unit', 'contract', 'integration', 'evals', 'red_team', 'performance']`,
        },
        why: "Calcula el gate de calidad desde las capas y contadores P0/P1; no imprime True precomputado.",
      },
      {
        demoId: "S52-T3-B-DEMO",
        subtopicId: "S52-T3-B",
        environment: "local-python",
        description: "Demo: RPO/RTO medidos y restore verificado en disaster drill",
        code: {
          language: 'python',
          title: "demo_slo_backup_rollback_disaster.py",
          code: `def disaster_gate(availability: float, slo: float, backup_age_h: int, rpo_h: int, rollback_min: int, rto_min: int, restored: bool) -> str:
    ok = availability >= slo and backup_age_h <= rpo_h and rollback_min <= rto_min and restored
    return "PASS" if ok else "NO_GO_RESILIENCE"

print(disaster_gate(0.999, 0.995, 3, 4, 8, 15, True))
print(disaster_gate(0.7, 0.995, 72, 4, 120, 15, False))
print("measured", {"rpo_h": 4, "rto_min": 15})`,
          output: `PASS
NO_GO_RESILIENCE
measured {'rpo_h': 4, 'rto_min': 15}`,
        },
        why: "Mide availability/SLO, edad de backup vs RPO y rollback vs RTO con restore verificado — alineado al weDo T3-B.",
      },
      {
        demoId: "S52-T4-A-DEMO",
        subtopicId: "S52-T4-A",
        environment: "local-python",
        description: "Demo: guion de demo ≤10 min con TTR antes/después y contribución personal",
        code: {
          language: 'python',
          title: "demo_demo_cv_narrative.py",
          code: `def demo_script(baseline_ttr: int, result_ttr: int, personal: str) -> dict:
    assert result_ttr < baseline_ttr, "sin mejora no hay claim"
    return {
        "minutes": 10,
        "before_after": (baseline_ttr, result_ttr),
        "personal_contribution": personal,
        "claims_sourced": True,
        "synthetic_only": True,
    }

plan = demo_script(90, 42, "blocking + contract tests en triage API")
print("demo", plan)
print("cv_ok", plan["claims_sourced"] and bool(plan["personal_contribution"]))`,
          output: `demo {'minutes': 10, 'before_after': (90, 42), 'personal_contribution': 'blocking + contract tests en triage API', 'claims_sourced': True, 'synthetic_only': True}
cv_ok True`,
        },
        why: "Construye el guion de portfolio a partir de baseline/result y contribución personal; rechazo implícito si no hay mejora.",
      },
      {
        demoId: "S52-T4-B-DEMO",
        subtopicId: "S52-T4-B",
        environment: "local-python",
        description: "Demo: evidence bundle de 8 artefactos y flag cpn4c_independent",
        code: {
          language: 'python',
          title: "demo_arch_readme_cards_license_video_defense.py",
          code: `REQUIRED = {
    "architecture", "README", "ADR", "system_card",
    "model_card", "LICENSE", "video", "defense",
}

def bundle_ok(artifacts: set, reproducible: bool, tradeoffs: bool, cpn4c_independent: bool) -> str:
    if REQUIRED <= artifacts and reproducible and tradeoffs and cpn4c_independent:
        return "PASS"
    return "BLOCK_INCOMPLETE_EVIDENCE_BUNDLE"

print("n", len(REQUIRED))
print(bundle_ok(REQUIRED, True, True, True))
print(bundle_ok({"README"}, False, False, False))`,
          output: `n 8
PASS
BLOCK_INCOMPLETE_EVIDENCE_BUNDLE`,
        },
        why: "Cuenta y valida los **8** artefactos del CP-FINAL (no 6). Alinea theory/iDo/weDo del evidence bundle.",
      },
    ],
  },
  weDo: {
    intro: "S52 · Laboratorio CP-FINAL (24 retos en tríada E1/E2/E3). **E1** repara un predicado de dominio invertido; **E2** separa válido / adverso / missing; **E3** enruta CONTINUE / breach / incertidumbre con el código de acción del subtema. Fixtures sintéticos multi-región (`CASO-PER-052-*`). Estos drills no sustituyen el build de 80 h: entrenan **alfabetización de gate** — qué emitir cuando CF-1, no-go, contexts, HITL, P0/P1, DR o portfolio fallan. El **youDo** es el ensamblaje real: cablear 6 contexts (con relationship), regresión S1–S52, disaster drill con reloj, demo ≤10 min y evidence bundle de 8. Orden T1→T4; no marques READY si milestones, paths del bundle o contribución personal son teatro.",
    steps: [
      {
        id: "S52-T1-A-E1",
        subtopicId: "S52-T1-A",
        kind: "guided",
        instruction: "S52-T1-A-E1 · Calcula el contrato de `stakeholders, jobs y success metrics de CF-1` sobre `CASO-PER-052-1A`. La entrada es el dict completo del starter; la operación debe demostrar stakeholders/jobs/métricas y baseline revalidados. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S52-T1-A PASS`; la misma operación sobre el fixture adverso debe activar `REOPEN_CF1` en E2.",
        hint: "Relaciona los campos `stakeholders`, `jobs`, `metrics`, `baseline_frozen` con la regla explicada en S52-T1-A.",
        hints: [
          "Relaciona los campos `stakeholders`, `jobs`, `metrics`, `baseline_frozen` con la regla explicada en S52-T1-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva matriz stakeholder/job/métrica con evidencia; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta baseline_frozen", "fixture adverso: solo ops, jobs=0, métricas vacías, baseline no frozen", "CASO-PER-052-1A es sintético"],
        tests: "El fixture `CASO-PER-052-1A` satisface un predicado de dominio real; imprime `S52-T1-A PASS` y el assert booleano pasa.",
        feedback: "S52-T1-A-E1: explica qué campo cambió la decisión, por qué el adverso activa REOPEN_CF1 y por qué faltar baseline_frozen exige INTERVIEW_STAKEHOLDER.",
        starterCode: {
          language: 'python',
          title: "s52-t1-a-e1.py",
          code: `# CASO-PER-052 · CF-1 stakeholders/jobs
# DEFECT: PASS si jobs==0 o baseline no frozen (invertido)
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-PER-052-1A", **{"stakeholders":{"ops","relationship","privacy"},"jobs":3,"metrics":{"ttr","review_precision"},"baseline_frozen":True}}
meets_contract = record["jobs"] == 0 or not record["baseline_frozen"]
status = "PASS" if meets_contract else "REOPEN_CF1"
print("S52-T1-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s52-t1-a-e1.py",
          code: `record = {"case_id": "CASO-PER-052-1A", **{"stakeholders":{"ops","relationship","privacy"},"jobs":3,"metrics":{"ttr","review_precision"},"baseline_frozen":True}}
meets_contract = {"ops","relationship","privacy"} <= record["stakeholders"] and record["jobs"] >= 3 and {"ttr","review_precision"} <= record["metrics"] and record["baseline_frozen"]
status = "PASS" if meets_contract else "REOPEN_CF1"
print("S52-T1-A", status)
assert meets_contract is True` ,
          output: `S52-T1-A PASS` ,
        },
      },
      {
        id: "S52-T1-A-E2",
        subtopicId: "S52-T1-A",
        kind: "independent",
        instruction: "S52-T1-A-E2 · Modela tres rutas de `stakeholders, jobs y success metrics de CF-1`: fixture válido, fixture adverso y registro sin `baseline_frozen`. Entrada: dict con case_id, stakeholders, jobs, metrics, baseline_frozen. Salidas exactas: `PASS`, `REOPEN_CF1`, `MISSING:baseline_frozen`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a baseline_frozen debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a baseline_frozen debe ocurrir antes de esa rama.",
          "Después aplica la regla de S52-T1-A: stakeholders/jobs/métricas y baseline revalidados. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta baseline_frozen", "fixture adverso: solo ops, jobs=0, métricas vacías, baseline no frozen", "CASO-PER-052-1A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `baseline_frozen` ausente y produce exactamente `PASS REOPEN_CF1 MISSING:baseline_frozen`.",
        feedback: "S52-T1-A-E2: explica qué campo cambió la decisión, por qué el adverso activa REOPEN_CF1 y por qué faltar baseline_frozen exige INTERVIEW_STAKEHOLDER.",
        starterCode: {
          language: 'python',
          title: "s52-t1-a-e2.py",
          code: `# CASO-PER-052 · assess CF-1 completeness
# DEFECT: PASS sin stakeholders ops/relationship/privacy
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "stakeholders", "jobs", "metrics", "baseline_frozen"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["jobs"] == 0 or not record["baseline_frozen"] else "REOPEN_CF1"

valid = {"case_id": "CASO-PER-052-1A", **{"stakeholders":{"ops","relationship","privacy"},"jobs":3,"metrics":{"ttr","review_precision"},"baseline_frozen":True}}
invalid = {"case_id": "CASO-PER-052-1A", **{"stakeholders":{"ops"},"jobs":0,"metrics":set(),"baseline_frozen":False}}
incomplete = {**valid}
incomplete.pop("baseline_frozen")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s52-t1-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "stakeholders", "jobs", "metrics", "baseline_frozen"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if {"ops","relationship","privacy"} <= record["stakeholders"] and record["jobs"] >= 3 and {"ttr","review_precision"} <= record["metrics"] and record["baseline_frozen"] else "REOPEN_CF1"

valid = {"case_id": "CASO-PER-052-1A", **{"stakeholders":{"ops","relationship","privacy"},"jobs":3,"metrics":{"ttr","review_precision"},"baseline_frozen":True}}
invalid = {"case_id": "CASO-PER-052-1A", **{"stakeholders":{"ops"},"jobs":0,"metrics":set(),"baseline_frozen":False}}
incomplete = {**valid}
incomplete.pop("baseline_frozen")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REOPEN_CF1 MISSING:baseline_frozen` ,
        },
      },
      {
        id: "S52-T1-A-E3",
        subtopicId: "S52-T1-A",
        kind: "transfer",
        instruction: "S52-T1-A-E3 · Simula fallo cerrado para `stakeholders, jobs y success metrics de CF-1` con tres fixtures distintos. `CASO-PER-052-1A` debe continuar, el adverso debe devolver `REOPEN_CF1` y la ausencia de `baseline_frozen` debe devolver `INTERVIEW_STAKEHOLDER`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `INTERVIEW_STAKEHOLDER` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `INTERVIEW_STAKEHOLDER` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró stakeholders/jobs/métricas y baseline revalidados; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta baseline_frozen", "fixture adverso: solo ops, jobs=0, métricas vacías, baseline no frozen", "CASO-PER-052-1A es sintético"],
        tests: "Fixtures `CASO-PER-052-1A`, adverso y sin `baseline_frozen` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S52-T1-A-E3: explica qué campo cambió la decisión, por qué el adverso activa REOPEN_CF1 y por qué faltar baseline_frozen exige INTERVIEW_STAKEHOLDER.",
        starterCode: {
          language: 'python',
          title: "s52-t1-a-e3.py",
          code: `# CASO-PER-052 · decide reopen CF-1
# DEFECT: missing→CONTINUE; no REOPEN_CF1
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "stakeholders", "jobs", "metrics", "baseline_frozen"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["jobs"] == 0 or not record["baseline_frozen"] else "REOPEN_CF1"

valid = {"case_id": "CASO-PER-052-1A", **{"stakeholders":{"ops","relationship","privacy"},"jobs":3,"metrics":{"ttr","review_precision"},"baseline_frozen":True}}
invalid = {"case_id": "CASO-PER-052-1A", **{"stakeholders":{"ops"},"jobs":0,"metrics":set(),"baseline_frozen":False}}
uncertain = {**valid}
uncertain.pop("baseline_frozen")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s52-t1-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "stakeholders", "jobs", "metrics", "baseline_frozen"}
    missing = sorted(required - record.keys())
    if missing:
        return "INTERVIEW_STAKEHOLDER"
    return "CONTINUE" if {"ops","relationship","privacy"} <= record["stakeholders"] and record["jobs"] >= 3 and {"ttr","review_precision"} <= record["metrics"] and record["baseline_frozen"] else "REOPEN_CF1"

valid = {"case_id": "CASO-PER-052-1A", **{"stakeholders":{"ops","relationship","privacy"},"jobs":3,"metrics":{"ttr","review_precision"},"baseline_frozen":True}}
invalid = {"case_id": "CASO-PER-052-1A", **{"stakeholders":{"ops"},"jobs":0,"metrics":set(),"baseline_frozen":False}}
uncertain = {**valid}
uncertain.pop("baseline_frozen")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REOPEN_CF1", "INTERVIEW_STAKEHOLDER"]` ,
          output: `CONTINUE REOPEN_CF1 INTERVIEW_STAKEHOLDER` ,
        },
      },
      {
        id: "S52-T1-B-E1",
        subtopicId: "S52-T1-B",
        kind: "guided",
        instruction: "S52-T1-B-E1 · Compara el contrato de `cambios, constraints, riesgos y no-go` sobre `CASO-PER-052-1B`. La entrada es el dict completo del starter; la operación debe demostrar constraints, riesgos con owner y no-go explícitos. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S52-T1-B PASS`; la misma operación sobre el fixture adverso debe activar `DECLARE_NO_GO` en E2.",
        hint: "Relaciona los campos `constraints`, `risks_with_owner`, `no_go`, `residual_risk_accepted` con la regla explicada en S52-T1-B.",
        hints: [
          "Relaciona los campos `constraints`, `risks_with_owner`, `no_go`, `residual_risk_accepted` con la regla explicada en S52-T1-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva registro de riesgos y no-go firmado; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta residual_risk_accepted", "fixture adverso: sin constraints ni no-go, risks_with_owner=0, residual no aceptado", "CASO-PER-052-1B es sintético"],
        tests: "El fixture `CASO-PER-052-1B` satisface un predicado de dominio real; imprime `S52-T1-B PASS` y el assert booleano pasa.",
        feedback: "S52-T1-B-E1: explica qué campo cambió la decisión, por qué el adverso activa DECLARE_NO_GO y por qué faltar residual_risk_accepted exige INDEPENDENT_RISK_REVIEW.",
        starterCode: {
          language: 'python',
          title: "s52-t1-b-e1.py",
          code: `# CASO-PER-052 · risk/no-go constraints
# DEFECT: constraints/risks/no_go invertidos
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-PER-052-1B", **{"constraints":{"synthetic-only","human-review"},"risks_with_owner":5,"no_go":{"real-pii","auto-risk-decision"},"residual_risk_accepted":True}}
meets_contract = not record["no_go"] or not record["residual_risk_accepted"]
status = "PASS" if meets_contract else "DECLARE_NO_GO"
print("S52-T1-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s52-t1-b-e1.py",
          code: `record = {"case_id": "CASO-PER-052-1B", **{"constraints":{"synthetic-only","human-review"},"risks_with_owner":5,"no_go":{"real-pii","auto-risk-decision"},"residual_risk_accepted":True}}
meets_contract = {"synthetic-only","human-review"} <= record["constraints"] and record["risks_with_owner"] >= 1 and {"real-pii","auto-risk-decision"} <= record["no_go"] and record["residual_risk_accepted"]
status = "PASS" if meets_contract else "DECLARE_NO_GO"
print("S52-T1-B", status)
assert meets_contract is True` ,
          output: `S52-T1-B PASS` ,
        },
      },
      {
        id: "S52-T1-B-E2",
        subtopicId: "S52-T1-B",
        kind: "independent",
        instruction: "S52-T1-B-E2 · Verifica tres rutas de `cambios, constraints, riesgos y no-go`: fixture válido, fixture adverso y registro sin `residual_risk_accepted`. Entrada: dict con case_id, constraints, risks_with_owner, no_go, residual_risk_accepted. Salidas exactas: `PASS`, `DECLARE_NO_GO`, `MISSING:residual_risk_accepted`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a residual_risk_accepted debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a residual_risk_accepted debe ocurrir antes de esa rama.",
          "Después aplica la regla de S52-T1-B: constraints, riesgos con owner y no-go explícitos. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta residual_risk_accepted", "fixture adverso: sin constraints ni no-go, risks_with_owner=0, residual no aceptado", "CASO-PER-052-1B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `residual_risk_accepted` ausente y produce exactamente `PASS DECLARE_NO_GO MISSING:residual_risk_accepted`.",
        feedback: "S52-T1-B-E2: explica qué campo cambió la decisión, por qué el adverso activa DECLARE_NO_GO y por qué faltar residual_risk_accepted exige INDEPENDENT_RISK_REVIEW.",
        starterCode: {
          language: 'python',
          title: "s52-t1-b-e2.py",
          code: `# CASO-PER-052 · assess risk register
# DEFECT: PASS sin owners en risks o residual no aceptado
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "constraints", "risks_with_owner", "no_go", "residual_risk_accepted"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if not record["no_go"] or not record["residual_risk_accepted"] else "DECLARE_NO_GO"

valid = {"case_id": "CASO-PER-052-1B", **{"constraints":{"synthetic-only","human-review"},"risks_with_owner":5,"no_go":{"real-pii","auto-risk-decision"},"residual_risk_accepted":True}}
invalid = {"case_id": "CASO-PER-052-1B", **{"constraints":set(),"risks_with_owner":0,"no_go":set(),"residual_risk_accepted":False}}
incomplete = {**valid}
incomplete.pop("residual_risk_accepted")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s52-t1-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "constraints", "risks_with_owner", "no_go", "residual_risk_accepted"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if {"synthetic-only","human-review"} <= record["constraints"] and record["risks_with_owner"] >= 1 and {"real-pii","auto-risk-decision"} <= record["no_go"] and record["residual_risk_accepted"] else "DECLARE_NO_GO"

valid = {"case_id": "CASO-PER-052-1B", **{"constraints":{"synthetic-only","human-review"},"risks_with_owner":5,"no_go":{"real-pii","auto-risk-decision"},"residual_risk_accepted":True}}
invalid = {"case_id": "CASO-PER-052-1B", **{"constraints":set(),"risks_with_owner":0,"no_go":set(),"residual_risk_accepted":False}}
incomplete = {**valid}
incomplete.pop("residual_risk_accepted")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS DECLARE_NO_GO MISSING:residual_risk_accepted` ,
        },
      },
      {
        id: "S52-T1-B-E3",
        subtopicId: "S52-T1-B",
        kind: "transfer",
        instruction: "S52-T1-B-E3 · Extiende fallo cerrado para `cambios, constraints, riesgos y no-go` con tres fixtures distintos. `CASO-PER-052-1B` debe continuar, el adverso debe devolver `DECLARE_NO_GO` y la ausencia de `residual_risk_accepted` debe devolver `INDEPENDENT_RISK_REVIEW`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `INDEPENDENT_RISK_REVIEW` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `INDEPENDENT_RISK_REVIEW` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró constraints, riesgos con owner y no-go explícitos; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta residual_risk_accepted", "fixture adverso: sin constraints ni no-go, risks_with_owner=0, residual no aceptado", "CASO-PER-052-1B es sintético"],
        tests: "Fixtures `CASO-PER-052-1B`, adverso y sin `residual_risk_accepted` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S52-T1-B-E3: explica qué campo cambió la decisión, por qué el adverso activa DECLARE_NO_GO y por qué faltar residual_risk_accepted exige INDEPENDENT_RISK_REVIEW.",
        starterCode: {
          language: 'python',
          title: "s52-t1-b-e3.py",
          code: `# CASO-PER-052 · decide restore risk evidence
# DEFECT: missing→CONTINUE; no fix de no-go
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "constraints", "risks_with_owner", "no_go", "residual_risk_accepted"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if not record["no_go"] or not record["residual_risk_accepted"] else "DECLARE_NO_GO"

valid = {"case_id": "CASO-PER-052-1B", **{"constraints":{"synthetic-only","human-review"},"risks_with_owner":5,"no_go":{"real-pii","auto-risk-decision"},"residual_risk_accepted":True}}
invalid = {"case_id": "CASO-PER-052-1B", **{"constraints":set(),"risks_with_owner":0,"no_go":set(),"residual_risk_accepted":False}}
uncertain = {**valid}
uncertain.pop("residual_risk_accepted")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s52-t1-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "constraints", "risks_with_owner", "no_go", "residual_risk_accepted"}
    missing = sorted(required - record.keys())
    if missing:
        return "INDEPENDENT_RISK_REVIEW"
    return "CONTINUE" if {"synthetic-only","human-review"} <= record["constraints"] and record["risks_with_owner"] >= 1 and {"real-pii","auto-risk-decision"} <= record["no_go"] and record["residual_risk_accepted"] else "DECLARE_NO_GO"

valid = {"case_id": "CASO-PER-052-1B", **{"constraints":{"synthetic-only","human-review"},"risks_with_owner":5,"no_go":{"real-pii","auto-risk-decision"},"residual_risk_accepted":True}}
invalid = {"case_id": "CASO-PER-052-1B", **{"constraints":set(),"risks_with_owner":0,"no_go":set(),"residual_risk_accepted":False}}
uncertain = {**valid}
uncertain.pop("residual_risk_accepted")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "DECLARE_NO_GO", "INDEPENDENT_RISK_REVIEW"]` ,
          output: `CONTINUE DECLARE_NO_GO INDEPENDENT_RISK_REVIEW` ,
        },
      },
      {
        id: "S52-T2-A-E1",
        subtopicId: "S52-T2-A",
        kind: "guided",
        instruction: "S52-T2-A-E1 · Filtra el contrato de `bounded contexts, APIs y eventos` sobre `CASO-PER-052-2A`. La entrada es el dict completo del starter; la operación debe demostrar seis contexts (intake, er, relationship, triage, reporting, copilot), contratos versionados y sin DB compartida. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S52-T2-A PASS`; la misma operación sobre el fixture adverso debe activar `STOP_INTEGRATION_RELEASE` en E2.",
        hint: "Relaciona los campos `contexts`, `apis_versioned`, `events_versioned`, `shared_database`, `contract_tests` con la regla explicada en S52-T2-A.",
        hints: [
          "Relaciona los campos `contexts`, `apis_versioned`, `events_versioned`, `shared_database`, `contract_tests` con la regla explicada en S52-T2-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva contract tests end-to-end; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta contract_tests", "fixture adverso: monólito all-in-one, shared_database=True, apis/eventos sin versionar, 0 tests", "CASO-PER-052-2A es sintético"],
        tests: "El fixture `CASO-PER-052-2A` satisface un predicado de dominio real; imprime `S52-T2-A PASS` y el assert booleano pasa.",
        feedback: "S52-T2-A-E1: nombra los seis contexts (incluye relationship), explica por qué shared_database o APIs sin versionar activan STOP_INTEGRATION_RELEASE, y por qué faltar contract_tests exige MAP_BOUNDED_CONTEXTS antes de seguir el ensamblaje.",
        starterCode: {
          language: 'python',
          title: "s52-t2-a-e1.py",
          code: `# CASO-PER-052 · multi-context architecture (intake→er→relationship→triage→reporting→copilot)
# DEFECT: contexts/versionado/shared_db invertidos
# Contrato: corrige el DEFECT; salida alineada a solutionCode
# Ensamblaje real (youDo): versiona OpenAPI + eventos job.finished/case.updated; ≥10 contract tests
record = {"case_id": "CASO-PER-052-2A", **{"contexts":{"intake","er","relationship","triage","reporting","copilot"},"apis_versioned":True,"events_versioned":True,"shared_database":False,"contract_tests":12}}
meets_contract = record["shared_database"] or not record["apis_versioned"]
status = "PASS" if meets_contract else "STOP_INTEGRATION_RELEASE"
print("S52-T2-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s52-t2-a-e1.py",
          code: `record = {"case_id": "CASO-PER-052-2A", **{"contexts":{"intake","er","relationship","triage","reporting","copilot"},"apis_versioned":True,"events_versioned":True,"shared_database":False,"contract_tests":12}}
meets_contract = {"intake","er","relationship","triage","reporting","copilot"} <= record["contexts"] and record["apis_versioned"] and record["events_versioned"] and not record["shared_database"] and record["contract_tests"] >= 10
status = "PASS" if meets_contract else "STOP_INTEGRATION_RELEASE"
print("S52-T2-A", status)
assert meets_contract is True` ,
          output: `S52-T2-A PASS` ,
        },
      },
      {
        id: "S52-T2-A-E2",
        subtopicId: "S52-T2-A",
        kind: "independent",
        instruction: "S52-T2-A-E2 · Clasifica tres rutas de `bounded contexts, APIs y eventos`: fixture válido, fixture adverso y registro sin `contract_tests`. Entrada: dict con case_id, contexts, apis_versioned, events_versioned, shared_database, contract_tests. Salidas exactas: `PASS`, `STOP_INTEGRATION_RELEASE`, `MISSING:contract_tests`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a contract_tests debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a contract_tests debe ocurrir antes de esa rama.",
          "Después aplica la regla de S52-T2-A: seis contexts, contratos versionados y sin DB compartida. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta contract_tests", "fixture adverso: monólito all-in-one, shared_database=True, apis/eventos sin versionar, 0 tests", "CASO-PER-052-2A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `contract_tests` ausente y produce exactamente `PASS STOP_INTEGRATION_RELEASE MISSING:contract_tests`.",
        feedback: "S52-T2-A-E2: explica qué campo cambió la decisión, por qué el adverso activa STOP_INTEGRATION_RELEASE y por qué faltar contract_tests exige MAP_BOUNDED_CONTEXTS.",
        starterCode: {
          language: 'python',
          title: "s52-t2-a-e2.py",
          code: `# CASO-PER-052 · assess architecture contracts
# DEFECT: PASS con shared_database o sin contract_tests
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "contexts", "apis_versioned", "events_versioned", "shared_database", "contract_tests"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["shared_database"] or not record["apis_versioned"] else "STOP_INTEGRATION_RELEASE"

valid = {"case_id": "CASO-PER-052-2A", **{"contexts":{"intake","er","relationship","triage","reporting","copilot"},"apis_versioned":True,"events_versioned":True,"shared_database":False,"contract_tests":12}}
invalid = {"case_id": "CASO-PER-052-2A", **{"contexts":{"all-in-one"},"apis_versioned":False,"events_versioned":False,"shared_database":True,"contract_tests":0}}
incomplete = {**valid}
incomplete.pop("contract_tests")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s52-t2-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "contexts", "apis_versioned", "events_versioned", "shared_database", "contract_tests"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if {"intake","er","relationship","triage","reporting","copilot"} <= record["contexts"] and record["apis_versioned"] and record["events_versioned"] and not record["shared_database"] and record["contract_tests"] >= 10 else "STOP_INTEGRATION_RELEASE"

valid = {"case_id": "CASO-PER-052-2A", **{"contexts":{"intake","er","relationship","triage","reporting","copilot"},"apis_versioned":True,"events_versioned":True,"shared_database":False,"contract_tests":12}}
invalid = {"case_id": "CASO-PER-052-2A", **{"contexts":{"all-in-one"},"apis_versioned":False,"events_versioned":False,"shared_database":True,"contract_tests":0}}
incomplete = {**valid}
incomplete.pop("contract_tests")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS STOP_INTEGRATION_RELEASE MISSING:contract_tests` ,
        },
      },
      {
        id: "S52-T2-A-E3",
        subtopicId: "S52-T2-A",
        kind: "transfer",
        instruction: "S52-T2-A-E3 · Defiende fallo cerrado para `bounded contexts, APIs y eventos` con tres fixtures distintos. `CASO-PER-052-2A` debe continuar, el adverso debe devolver `STOP_INTEGRATION_RELEASE` y la ausencia de `contract_tests` debe devolver `MAP_BOUNDED_CONTEXTS`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `MAP_BOUNDED_CONTEXTS` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `MAP_BOUNDED_CONTEXTS` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró seis contexts, contratos versionados y sin DB compartida; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta contract_tests", "fixture adverso: monólito all-in-one, shared_database=True, apis/eventos sin versionar, 0 tests", "CASO-PER-052-2A es sintético"],
        tests: "Fixtures `CASO-PER-052-2A`, adverso y sin `contract_tests` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S52-T2-A-E3: explica qué campo cambió la decisión, por qué el adverso activa STOP_INTEGRATION_RELEASE y por qué faltar contract_tests exige MAP_BOUNDED_CONTEXTS.",
        starterCode: {
          language: 'python',
          title: "s52-t2-a-e3.py",
          code: `# CASO-PER-052 · decide restore arch evidence
# DEFECT: missing→CONTINUE
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "contexts", "apis_versioned", "events_versioned", "shared_database", "contract_tests"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["shared_database"] or not record["apis_versioned"] else "STOP_INTEGRATION_RELEASE"

valid = {"case_id": "CASO-PER-052-2A", **{"contexts":{"intake","er","relationship","triage","reporting","copilot"},"apis_versioned":True,"events_versioned":True,"shared_database":False,"contract_tests":12}}
invalid = {"case_id": "CASO-PER-052-2A", **{"contexts":{"all-in-one"},"apis_versioned":False,"events_versioned":False,"shared_database":True,"contract_tests":0}}
uncertain = {**valid}
uncertain.pop("contract_tests")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s52-t2-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "contexts", "apis_versioned", "events_versioned", "shared_database", "contract_tests"}
    missing = sorted(required - record.keys())
    if missing:
        return "MAP_BOUNDED_CONTEXTS"
    return "CONTINUE" if {"intake","er","relationship","triage","reporting","copilot"} <= record["contexts"] and record["apis_versioned"] and record["events_versioned"] and not record["shared_database"] and record["contract_tests"] >= 10 else "STOP_INTEGRATION_RELEASE"

valid = {"case_id": "CASO-PER-052-2A", **{"contexts":{"intake","er","relationship","triage","reporting","copilot"},"apis_versioned":True,"events_versioned":True,"shared_database":False,"contract_tests":12}}
invalid = {"case_id": "CASO-PER-052-2A", **{"contexts":{"all-in-one"},"apis_versioned":False,"events_versioned":False,"shared_database":True,"contract_tests":0}}
uncertain = {**valid}
uncertain.pop("contract_tests")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "STOP_INTEGRATION_RELEASE", "MAP_BOUNDED_CONTEXTS"]` ,
          output: `CONTINUE STOP_INTEGRATION_RELEASE MAP_BOUNDED_CONTEXTS` ,
        },
      },
      {
        id: "S52-T2-B-E1",
        subtopicId: "S52-T2-B",
        kind: "guided",
        instruction: "S52-T2-B-E1 · Modela el contrato de `datos, modelos, RPA, RAG y human workflow` sobre `CASO-PER-052-2B`. La entrada es el dict completo del starter; la operación debe demostrar que ER/triage/RPA/RAG apoyan y la persona decide. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S52-T2-B PASS`; la misma operación sobre el fixture adverso debe activar `BLOCK_AUTOMATED_RISK_DECISION` en E2.",
        hint: "Relaciona los campos `er_proposes_match`, `triage_prioritizes`, `rpa_prepares_draft`, `rag_cites`, `human_decides`, `infers_fraud` con la regla explicada en S52-T2-B.",
        hints: [
          "Relaciona los campos `er_proposes_match`, `triage_prioritizes`, `rpa_prepares_draft`, `rag_cites`, `human_decides`, `infers_fraud` con la regla explicada en S52-T2-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva la cadena HITL (proponer → priorizar → draft → citar → humano decide); revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta infers_fraud", "fixture adverso: infers_fraud=True, human_decides=False (auto-riesgo)", "CASO-PER-052-2B es sintético"],
        tests: "El fixture `CASO-PER-052-2B` satisface un predicado de dominio real; imprime `S52-T2-B PASS` y el assert booleano pasa.",
        feedback: "S52-T2-B-E1: explica qué campo cambió la decisión, por qué el adverso activa BLOCK_AUTOMATED_RISK_DECISION y por qué faltar infers_fraud exige REQUEST_HUMAN_REVIEW.",
        starterCode: {
          language: 'python',
          title: "s52-t2-b-e1.py",
          code: `# CASO-PER-052 · human-decides AI chain
# DEFECT: human_decides/infers_fraud invertidos
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-PER-052-2B", **{"er_proposes_match":True,"triage_prioritizes":True,"rpa_prepares_draft":True,"rag_cites":True,"human_decides":True,"infers_fraud":False}}
meets_contract = record["infers_fraud"] or not record["human_decides"]
status = "PASS" if meets_contract else "BLOCK_AUTOMATED_RISK_DECISION"
print("S52-T2-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s52-t2-b-e1.py",
          code: `record = {"case_id": "CASO-PER-052-2B", **{"er_proposes_match":True,"triage_prioritizes":True,"rpa_prepares_draft":True,"rag_cites":True,"human_decides":True,"infers_fraud":False}}
meets_contract = all(record[k] for k in ("er_proposes_match","triage_prioritizes","rpa_prepares_draft","rag_cites","human_decides")) and not record["infers_fraud"]
status = "PASS" if meets_contract else "BLOCK_AUTOMATED_RISK_DECISION"
print("S52-T2-B", status)
assert meets_contract is True` ,
          output: `S52-T2-B PASS` ,
        },
      },
      {
        id: "S52-T2-B-E2",
        subtopicId: "S52-T2-B",
        kind: "independent",
        instruction: "S52-T2-B-E2 · Audita tres rutas de `datos, modelos, RPA, RAG y human workflow`: fixture válido, fixture adverso y registro sin `infers_fraud`. Entrada: dict con case_id, er_proposes_match, triage_prioritizes, rpa_prepares_draft, rag_cites, human_decides, infers_fraud. Salidas exactas: `PASS`, `BLOCK_AUTOMATED_RISK_DECISION`, `MISSING:infers_fraud`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a infers_fraud debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a infers_fraud debe ocurrir antes de esa rama.",
          "Después aplica la regla de S52-T2-B: ER/triage/RPA/RAG apoyan y persona decide. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta infers_fraud", "fixture adverso: infers_fraud=True, human_decides=False (auto-riesgo)", "CASO-PER-052-2B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `infers_fraud` ausente y produce exactamente `PASS BLOCK_AUTOMATED_RISK_DECISION MISSING:infers_fraud`.",
        feedback: "S52-T2-B-E2: explica qué campo cambió la decisión, por qué el adverso activa BLOCK_AUTOMATED_RISK_DECISION y por qué faltar infers_fraud exige REQUEST_HUMAN_REVIEW.",
        starterCode: {
          language: 'python',
          title: "s52-t2-b-e2.py",
          code: `# CASO-PER-052 · assess propose-not-decide
# DEFECT: PASS si infers_fraud o sin human_decides
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "er_proposes_match", "triage_prioritizes", "rpa_prepares_draft", "rag_cites", "human_decides", "infers_fraud"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["infers_fraud"] or not record["human_decides"] else "BLOCK_AUTOMATED_RISK_DECISION"

valid = {"case_id": "CASO-PER-052-2B", **{"er_proposes_match":True,"triage_prioritizes":True,"rpa_prepares_draft":True,"rag_cites":True,"human_decides":True,"infers_fraud":False}}
invalid = {"case_id": "CASO-PER-052-2B", **{"er_proposes_match":True,"triage_prioritizes":True,"rpa_prepares_draft":False,"rag_cites":False,"human_decides":False,"infers_fraud":True}}
incomplete = {**valid}
incomplete.pop("infers_fraud")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s52-t2-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "er_proposes_match", "triage_prioritizes", "rpa_prepares_draft", "rag_cites", "human_decides", "infers_fraud"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if all(record[k] for k in ("er_proposes_match","triage_prioritizes","rpa_prepares_draft","rag_cites","human_decides")) and not record["infers_fraud"] else "BLOCK_AUTOMATED_RISK_DECISION"

valid = {"case_id": "CASO-PER-052-2B", **{"er_proposes_match":True,"triage_prioritizes":True,"rpa_prepares_draft":True,"rag_cites":True,"human_decides":True,"infers_fraud":False}}
invalid = {"case_id": "CASO-PER-052-2B", **{"er_proposes_match":True,"triage_prioritizes":True,"rpa_prepares_draft":False,"rag_cites":False,"human_decides":False,"infers_fraud":True}}
incomplete = {**valid}
incomplete.pop("infers_fraud")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS BLOCK_AUTOMATED_RISK_DECISION MISSING:infers_fraud` ,
        },
      },
      {
        id: "S52-T2-B-E3",
        subtopicId: "S52-T2-B",
        kind: "transfer",
        instruction: "S52-T2-B-E3 · Recupera fallo cerrado para `datos, modelos, RPA, RAG y human workflow` con tres fixtures distintos. `CASO-PER-052-2B` debe continuar, el adverso debe devolver `BLOCK_AUTOMATED_RISK_DECISION` y la ausencia de `infers_fraud` debe devolver `REQUEST_HUMAN_REVIEW`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_HUMAN_REVIEW` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_HUMAN_REVIEW` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró que ER/triage/RPA/RAG apoyan y la persona decide; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta infers_fraud", "fixture adverso: infers_fraud=True, human_decides=False (auto-riesgo)", "CASO-PER-052-2B es sintético"],
        tests: "Fixtures `CASO-PER-052-2B`, adverso y sin `infers_fraud` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S52-T2-B-E3: explica qué campo cambió la decisión, por qué el adverso activa BLOCK_AUTOMATED_RISK_DECISION y por qué faltar infers_fraud exige REQUEST_HUMAN_REVIEW.",
        starterCode: {
          language: 'python',
          title: "s52-t2-b-e3.py",
          code: `# CASO-PER-052 · decide restore AI limits
# DEFECT: missing→CONTINUE; no bloqueo de auto-fraude
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "er_proposes_match", "triage_prioritizes", "rpa_prepares_draft", "rag_cites", "human_decides", "infers_fraud"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["infers_fraud"] or not record["human_decides"] else "BLOCK_AUTOMATED_RISK_DECISION"

valid = {"case_id": "CASO-PER-052-2B", **{"er_proposes_match":True,"triage_prioritizes":True,"rpa_prepares_draft":True,"rag_cites":True,"human_decides":True,"infers_fraud":False}}
invalid = {"case_id": "CASO-PER-052-2B", **{"er_proposes_match":True,"triage_prioritizes":True,"rpa_prepares_draft":False,"rag_cites":False,"human_decides":False,"infers_fraud":True}}
uncertain = {**valid}
uncertain.pop("infers_fraud")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s52-t2-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "er_proposes_match", "triage_prioritizes", "rpa_prepares_draft", "rag_cites", "human_decides", "infers_fraud"}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_HUMAN_REVIEW"
    return "CONTINUE" if all(record[k] for k in ("er_proposes_match","triage_prioritizes","rpa_prepares_draft","rag_cites","human_decides")) and not record["infers_fraud"] else "BLOCK_AUTOMATED_RISK_DECISION"

valid = {"case_id": "CASO-PER-052-2B", **{"er_proposes_match":True,"triage_prioritizes":True,"rpa_prepares_draft":True,"rag_cites":True,"human_decides":True,"infers_fraud":False}}
invalid = {"case_id": "CASO-PER-052-2B", **{"er_proposes_match":True,"triage_prioritizes":True,"rpa_prepares_draft":False,"rag_cites":False,"human_decides":False,"infers_fraud":True}}
uncertain = {**valid}
uncertain.pop("infers_fraud")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "BLOCK_AUTOMATED_RISK_DECISION", "REQUEST_HUMAN_REVIEW"]` ,
          output: `CONTINUE BLOCK_AUTOMATED_RISK_DECISION REQUEST_HUMAN_REVIEW` ,
        },
      },
      {
        id: "S52-T3-A-E1",
        subtopicId: "S52-T3-A",
        kind: "guided",
        instruction: "S52-T3-A-E1 · Verifica el contrato de `tests/evals/red team y performance` sobre `CASO-PER-052-3A`. La entrada es el dict completo del starter; la operación debe demostrar seis capas de verificación y cero P0/P1. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S52-T3-A PASS`; la misma operación sobre el fixture adverso debe activar `BLOCK_FINAL_ON_P0_P1` en E2.",
        hint: "Relaciona los campos `unit`, `contract`, `integration`, `evals`, `red_team`, `performance`, `open_p0`, `open_p1` con la regla explicada en S52-T3-A.",
        hints: [
          "Relaciona los campos `unit`, `contract`, `integration`, `evals`, `red_team`, `performance`, `open_p0`, `open_p1` con la regla explicada en S52-T3-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva matriz de verificación sin P0/P1; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta open_p1", "fixture adverso: open_p0≥1 o capas red_team/contract en False", "CASO-PER-052-3A es sintético"],
        tests: "El fixture `CASO-PER-052-3A` satisface un predicado de dominio real; imprime `S52-T3-A PASS` y el assert booleano pasa.",
        feedback: "S52-T3-A-E1: explica qué campo cambió la decisión, por qué el adverso activa BLOCK_FINAL_ON_P0_P1 y por qué faltar open_p1 exige FIX_AND_RERUN_REGRESSION.",
        starterCode: {
          language: 'python',
          title: "s52-t3-a-e1.py",
          code: `# CASO-PER-052 · test pyramid + red team
# DEFECT: unit/contract/evals/red_team invertidos
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-PER-052-3A", **{"unit":True,"contract":True,"integration":True,"evals":True,"red_team":True,"performance":True,"open_p0":0,"open_p1":0}}
meets_contract = not record["red_team"] or record["open_p0"] > 0 or record["open_p1"] > 0
status = "PASS" if meets_contract else "BLOCK_FINAL_ON_P0_P1"
print("S52-T3-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s52-t3-a-e1.py",
          code: `record = {"case_id": "CASO-PER-052-3A", **{"unit":True,"contract":True,"integration":True,"evals":True,"red_team":True,"performance":True,"open_p0":0,"open_p1":0}}
meets_contract = all(record[k] for k in ("unit","contract","integration","evals","red_team","performance")) and record["open_p0"] == 0 and record["open_p1"] == 0
status = "PASS" if meets_contract else "BLOCK_FINAL_ON_P0_P1"
print("S52-T3-A", status)
assert meets_contract is True` ,
          output: `S52-T3-A PASS` ,
        },
      },
      {
        id: "S52-T3-A-E2",
        subtopicId: "S52-T3-A",
        kind: "independent",
        instruction: "S52-T3-A-E2 · Decide tres rutas de `tests/evals/red team y performance`: fixture válido, fixture adverso y registro sin `open_p1`. Entrada: dict con case_id, unit, contract, integration, evals, red_team, performance, open_p0, open_p1. Salidas exactas: `PASS`, `BLOCK_FINAL_ON_P0_P1`, `MISSING:open_p1`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a open_p1 debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a open_p1 debe ocurrir antes de esa rama.",
          "Después aplica la regla de S52-T3-A: seis capas de verificación y cero P0/P1. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta open_p1", "fixture adverso: open_p0≥1 o capas red_team/contract en False", "CASO-PER-052-3A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `open_p1` ausente y produce exactamente `PASS BLOCK_FINAL_ON_P0_P1 MISSING:open_p1`.",
        feedback: "S52-T3-A-E2: explica qué campo cambió la decisión, por qué el adverso activa BLOCK_FINAL_ON_P0_P1 y por qué faltar open_p1 exige FIX_AND_RERUN_REGRESSION.",
        starterCode: {
          language: 'python',
          title: "s52-t3-a-e2.py",
          code: `# CASO-PER-052 · assess quality gates open P0/P1
# DEFECT: PASS con open_p0/p1 o suites faltantes
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "unit", "contract", "integration", "evals", "red_team", "performance", "open_p0", "open_p1"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if not record["red_team"] or record["open_p0"] > 0 or record["open_p1"] > 0 else "BLOCK_FINAL_ON_P0_P1"

valid = {"case_id": "CASO-PER-052-3A", **{"unit":True,"contract":True,"integration":True,"evals":True,"red_team":True,"performance":True,"open_p0":0,"open_p1":0}}
invalid = {"case_id": "CASO-PER-052-3A", **{"unit":True,"contract":False,"integration":False,"evals":False,"red_team":False,"performance":False,"open_p0":1,"open_p1":4}}
incomplete = {**valid}
incomplete.pop("open_p1")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s52-t3-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "unit", "contract", "integration", "evals", "red_team", "performance", "open_p0", "open_p1"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if all(record[k] for k in ("unit","contract","integration","evals","red_team","performance")) and record["open_p0"] == 0 and record["open_p1"] == 0 else "BLOCK_FINAL_ON_P0_P1"

valid = {"case_id": "CASO-PER-052-3A", **{"unit":True,"contract":True,"integration":True,"evals":True,"red_team":True,"performance":True,"open_p0":0,"open_p1":0}}
invalid = {"case_id": "CASO-PER-052-3A", **{"unit":True,"contract":False,"integration":False,"evals":False,"red_team":False,"performance":False,"open_p0":1,"open_p1":4}}
incomplete = {**valid}
incomplete.pop("open_p1")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS BLOCK_FINAL_ON_P0_P1 MISSING:open_p1` ,
        },
      },
      {
        id: "S52-T3-A-E3",
        subtopicId: "S52-T3-A",
        kind: "transfer",
        instruction: "S52-T3-A-E3 · Contrasta fallo cerrado para `tests/evals/red team y performance` con tres fixtures distintos. `CASO-PER-052-3A` debe continuar, el adverso debe devolver `BLOCK_FINAL_ON_P0_P1` y la ausencia de `open_p1` debe devolver `FIX_AND_RERUN_REGRESSION`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `FIX_AND_RERUN_REGRESSION` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `FIX_AND_RERUN_REGRESSION` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró seis capas de verificación y cero P0/P1; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta open_p1", "fixture adverso: open_p0≥1 o capas red_team/contract en False", "CASO-PER-052-3A es sintético"],
        tests: "Fixtures `CASO-PER-052-3A`, adverso y sin `open_p1` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S52-T3-A-E3: explica qué campo cambió la decisión, por qué el adverso activa BLOCK_FINAL_ON_P0_P1 y por qué faltar open_p1 exige FIX_AND_RERUN_REGRESSION.",
        starterCode: {
          language: 'python',
          title: "s52-t3-a-e3.py",
          code: `# CASO-PER-052 · decide restore quality evidence
# DEFECT: missing→CONTINUE
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "unit", "contract", "integration", "evals", "red_team", "performance", "open_p0", "open_p1"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if not record["red_team"] or record["open_p0"] > 0 or record["open_p1"] > 0 else "BLOCK_FINAL_ON_P0_P1"

valid = {"case_id": "CASO-PER-052-3A", **{"unit":True,"contract":True,"integration":True,"evals":True,"red_team":True,"performance":True,"open_p0":0,"open_p1":0}}
invalid = {"case_id": "CASO-PER-052-3A", **{"unit":True,"contract":False,"integration":False,"evals":False,"red_team":False,"performance":False,"open_p0":1,"open_p1":4}}
uncertain = {**valid}
uncertain.pop("open_p1")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s52-t3-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "unit", "contract", "integration", "evals", "red_team", "performance", "open_p0", "open_p1"}
    missing = sorted(required - record.keys())
    if missing:
        return "FIX_AND_RERUN_REGRESSION"
    return "CONTINUE" if all(record[k] for k in ("unit","contract","integration","evals","red_team","performance")) and record["open_p0"] == 0 and record["open_p1"] == 0 else "BLOCK_FINAL_ON_P0_P1"

valid = {"case_id": "CASO-PER-052-3A", **{"unit":True,"contract":True,"integration":True,"evals":True,"red_team":True,"performance":True,"open_p0":0,"open_p1":0}}
invalid = {"case_id": "CASO-PER-052-3A", **{"unit":True,"contract":False,"integration":False,"evals":False,"red_team":False,"performance":False,"open_p0":1,"open_p1":4}}
uncertain = {**valid}
uncertain.pop("open_p1")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "BLOCK_FINAL_ON_P0_P1", "FIX_AND_RERUN_REGRESSION"]` ,
          output: `CONTINUE BLOCK_FINAL_ON_P0_P1 FIX_AND_RERUN_REGRESSION` ,
        },
      },
      {
        id: "S52-T3-B-E1",
        subtopicId: "S52-T3-B",
        kind: "guided",
        instruction: "S52-T3-B-E1 · Clasifica el contrato de `SLO, backup, rollback y disaster exercise` sobre `CASO-PER-052-3B`. La entrada es el dict completo del starter; la operación debe demostrar SLO/RPO/RTO y disaster drill aprobados. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S52-T3-B PASS`; la misma operación sobre el fixture adverso debe activar `NO_GO_RESILIENCE` en E2.",
        hint: "Relaciona los campos `availability`, `slo`, `backup_age_h`, `rpo_h`, `rollback_min`, `rto_min`, `disaster_exercise` con la regla explicada en S52-T3-B.",
        hints: [
          "Relaciona los campos `availability`, `slo`, `backup_age_h`, `rpo_h`, `rollback_min`, `rto_min`, `disaster_exercise` con la regla explicada en S52-T3-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva RPO/RTO y restauración demostrados; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta disaster_exercise", "fixture adverso: availability bajo SLO, backup_age>RPO, rollback>RTO, restore no verificado", "CASO-PER-052-3B es sintético"],
        tests: "El fixture `CASO-PER-052-3B` satisface un predicado de dominio real; imprime `S52-T3-B PASS` y el assert booleano pasa.",
        feedback: "S52-T3-B-E1: muestra con números del fixture por qué availability/SLO, backup vs RPO y rollback vs RTO + restore pasan; contrasta con el adverso (p. ej. rollback 120 min) que fuerza NO_GO_RESILIENCE; sin flag de drill → RUN_DISASTER_EXERCISE.",
        starterCode: {
          language: 'python',
          title: "s52-t3-b-e1.py",
          code: `# CASO-PER-052 · availability/RPO/RTO gate
# DEFECT: SLO/backup/rollback invertidos
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-PER-052-3B", **{"availability":0.999,"slo":0.995,"backup_age_h":3,"rpo_h":4,"rollback_min":8,"rto_min":15,"disaster_exercise":True}}
meets_contract = record["availability"] < record["slo"] or record["rollback_min"] > record["rto_min"]
status = "PASS" if meets_contract else "NO_GO_RESILIENCE"
print("S52-T3-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s52-t3-b-e1.py",
          code: `record = {"case_id": "CASO-PER-052-3B", **{"availability":0.999,"slo":0.995,"backup_age_h":3,"rpo_h":4,"rollback_min":8,"rto_min":15,"disaster_exercise":True}}
meets_contract = record["availability"] >= record["slo"] and record["backup_age_h"] <= record["rpo_h"] and record["rollback_min"] <= record["rto_min"] and record["disaster_exercise"]
status = "PASS" if meets_contract else "NO_GO_RESILIENCE"
print("S52-T3-B", status)
assert meets_contract is True` ,
          output: `S52-T3-B PASS` ,
        },
      },
      {
        id: "S52-T3-B-E2",
        subtopicId: "S52-T3-B",
        kind: "independent",
        instruction: "S52-T3-B-E2 · Calcula tres rutas de `SLO, backup, rollback y disaster exercise`: fixture válido, fixture adverso y registro sin `disaster_exercise`. Entrada: dict con case_id, availability, slo, backup_age_h, rpo_h, rollback_min, rto_min, disaster_exercise. Salidas exactas: `PASS`, `NO_GO_RESILIENCE`, `MISSING:disaster_exercise`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a disaster_exercise debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a disaster_exercise debe ocurrir antes de esa rama.",
          "Después aplica la regla de S52-T3-B: SLO/RPO/RTO y disaster drill aprobados. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta disaster_exercise", "fixture adverso: availability bajo SLO, backup_age>RPO, rollback>RTO, restore no verificado", "CASO-PER-052-3B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `disaster_exercise` ausente y produce exactamente `PASS NO_GO_RESILIENCE MISSING:disaster_exercise`.",
        feedback: "S52-T3-B-E2: explica qué campo cambió la decisión, por qué el adverso activa NO_GO_RESILIENCE y por qué faltar disaster_exercise exige RUN_DISASTER_EXERCISE.",
        starterCode: {
          language: 'python',
          title: "s52-t3-b-e2.py",
          code: `# CASO-PER-052 · assess DR evidence
# DEFECT: PASS sin disaster_exercise o RTO/RPO rotos
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "availability", "slo", "backup_age_h", "rpo_h", "rollback_min", "rto_min", "disaster_exercise"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["availability"] < record["slo"] or record["rollback_min"] > record["rto_min"] else "NO_GO_RESILIENCE"

valid = {"case_id": "CASO-PER-052-3B", **{"availability":0.999,"slo":0.995,"backup_age_h":3,"rpo_h":4,"rollback_min":8,"rto_min":15,"disaster_exercise":True}}
invalid = {"case_id": "CASO-PER-052-3B", **{"availability":0.7,"slo":0.995,"backup_age_h":72,"rpo_h":4,"rollback_min":120,"rto_min":15,"disaster_exercise":False}}
incomplete = {**valid}
incomplete.pop("disaster_exercise")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s52-t3-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "availability", "slo", "backup_age_h", "rpo_h", "rollback_min", "rto_min", "disaster_exercise"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["availability"] >= record["slo"] and record["backup_age_h"] <= record["rpo_h"] and record["rollback_min"] <= record["rto_min"] and record["disaster_exercise"] else "NO_GO_RESILIENCE"

valid = {"case_id": "CASO-PER-052-3B", **{"availability":0.999,"slo":0.995,"backup_age_h":3,"rpo_h":4,"rollback_min":8,"rto_min":15,"disaster_exercise":True}}
invalid = {"case_id": "CASO-PER-052-3B", **{"availability":0.7,"slo":0.995,"backup_age_h":72,"rpo_h":4,"rollback_min":120,"rto_min":15,"disaster_exercise":False}}
incomplete = {**valid}
incomplete.pop("disaster_exercise")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS NO_GO_RESILIENCE MISSING:disaster_exercise` ,
        },
      },
      {
        id: "S52-T3-B-E3",
        subtopicId: "S52-T3-B",
        kind: "transfer",
        instruction: "S52-T3-B-E3 · Instrumenta fallo cerrado para `SLO, backup, rollback y disaster exercise` con tres fixtures distintos. `CASO-PER-052-3B` debe continuar, el adverso debe devolver `NO_GO_RESILIENCE` y la ausencia de `disaster_exercise` debe devolver `RUN_DISASTER_EXERCISE`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `RUN_DISASTER_EXERCISE` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `RUN_DISASTER_EXERCISE` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró SLO/RPO/RTO y disaster drill aprobados; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta disaster_exercise", "fixture adverso: availability bajo SLO, backup_age>RPO, rollback>RTO, restore no verificado", "CASO-PER-052-3B es sintético"],
        tests: "Fixtures `CASO-PER-052-3B`, adverso y sin `disaster_exercise` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S52-T3-B-E3: explica qué campo cambió la decisión, por qué el adverso activa NO_GO_RESILIENCE y por qué faltar disaster_exercise exige RUN_DISASTER_EXERCISE.",
        starterCode: {
          language: 'python',
          title: "s52-t3-b-e3.py",
          code: `# CASO-PER-052 · decide restore DR evidence
# DEFECT: missing→CONTINUE
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "availability", "slo", "backup_age_h", "rpo_h", "rollback_min", "rto_min", "disaster_exercise"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["availability"] < record["slo"] or record["rollback_min"] > record["rto_min"] else "NO_GO_RESILIENCE"

valid = {"case_id": "CASO-PER-052-3B", **{"availability":0.999,"slo":0.995,"backup_age_h":3,"rpo_h":4,"rollback_min":8,"rto_min":15,"disaster_exercise":True}}
invalid = {"case_id": "CASO-PER-052-3B", **{"availability":0.7,"slo":0.995,"backup_age_h":72,"rpo_h":4,"rollback_min":120,"rto_min":15,"disaster_exercise":False}}
uncertain = {**valid}
uncertain.pop("disaster_exercise")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s52-t3-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "availability", "slo", "backup_age_h", "rpo_h", "rollback_min", "rto_min", "disaster_exercise"}
    missing = sorted(required - record.keys())
    if missing:
        return "RUN_DISASTER_EXERCISE"
    return "CONTINUE" if record["availability"] >= record["slo"] and record["backup_age_h"] <= record["rpo_h"] and record["rollback_min"] <= record["rto_min"] and record["disaster_exercise"] else "NO_GO_RESILIENCE"

valid = {"case_id": "CASO-PER-052-3B", **{"availability":0.999,"slo":0.995,"backup_age_h":3,"rpo_h":4,"rollback_min":8,"rto_min":15,"disaster_exercise":True}}
invalid = {"case_id": "CASO-PER-052-3B", **{"availability":0.7,"slo":0.995,"backup_age_h":72,"rpo_h":4,"rollback_min":120,"rto_min":15,"disaster_exercise":False}}
uncertain = {**valid}
uncertain.pop("disaster_exercise")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "NO_GO_RESILIENCE", "RUN_DISASTER_EXERCISE"]` ,
          output: `CONTINUE NO_GO_RESILIENCE RUN_DISASTER_EXERCISE` ,
        },
      },
      {
        id: "S52-T4-A-E1",
        subtopicId: "S52-T4-A",
        kind: "guided",
        instruction: "S52-T4-A-E1 · Audita el contrato de `demo y narrativa de CV` sobre `CASO-PER-052-4A`. La entrada es el dict completo del starter; la operación debe demostrar mejora vs baseline sintético y narrativa atribuible. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S52-T4-A PASS`; la misma operación sobre el fixture adverso debe activar `REJECT_UNSUPPORTED_PORTFOLIO_CLAIM` en E2.",
        hint: "Relaciona los campos `baseline_ttr_min`, `result_ttr_min`, `benchmark_synthetic`, `demo_minutes`, `cv_claims_sourced`, `personal_contribution` con la regla explicada en S52-T4-A.",
        hints: [
          "Relaciona los campos `baseline_ttr_min`, `result_ttr_min`, `benchmark_synthetic`, `demo_minutes`, `cv_claims_sourced`, `personal_contribution` con la regla explicada en S52-T4-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva demo reproducible con antes/después; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta personal_contribution", "fixture adverso: result_ttr ≥ baseline, claims sin fuente, sin contribución personal", "CASO-PER-052-4A es sintético"],
        tests: "El fixture `CASO-PER-052-4A` satisface un predicado de dominio real; imprime `S52-T4-A PASS` y el assert booleano pasa.",
        feedback: "S52-T4-A-E1: explica qué campo cambió la decisión, por qué el adverso activa REJECT_UNSUPPORTED_PORTFOLIO_CLAIM y por qué faltar personal_contribution exige RECORD_PERSONAL_CONTRIBUTION.",
        starterCode: {
          language: 'python',
          title: "s52-t4-a-e1.py",
          code: `# CASO-PER-052 · portfolio TTR claim
# DEFECT: PASS si TTR no mejora o claims sin fuente
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-PER-052-4A", **{"baseline_ttr_min":90,"result_ttr_min":42,"benchmark_synthetic":True,"demo_minutes":10,"cv_claims_sourced":True,"personal_contribution":True}}
meets_contract = record["result_ttr_min"] >= record["baseline_ttr_min"] or not record["cv_claims_sourced"]
status = "PASS" if meets_contract else "REJECT_UNSUPPORTED_PORTFOLIO_CLAIM"
print("S52-T4-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s52-t4-a-e1.py",
          code: `record = {"case_id": "CASO-PER-052-4A", **{"baseline_ttr_min":90,"result_ttr_min":42,"benchmark_synthetic":True,"demo_minutes":10,"cv_claims_sourced":True,"personal_contribution":True}}
meets_contract = record["result_ttr_min"] < record["baseline_ttr_min"] and record["benchmark_synthetic"] and record["demo_minutes"] <= 10 and record["cv_claims_sourced"] and record["personal_contribution"]
status = "PASS" if meets_contract else "REJECT_UNSUPPORTED_PORTFOLIO_CLAIM"
print("S52-T4-A", status)
assert meets_contract is True` ,
          output: `S52-T4-A PASS` ,
        },
      },
      {
        id: "S52-T4-A-E2",
        subtopicId: "S52-T4-A",
        kind: "independent",
        instruction: "S52-T4-A-E2 · Compara tres rutas de `demo y narrativa de CV`: fixture válido, fixture adverso y registro sin `personal_contribution`. Entrada: dict con case_id, baseline_ttr_min, result_ttr_min, benchmark_synthetic, demo_minutes, cv_claims_sourced, personal_contribution. Salidas exactas: `PASS`, `REJECT_UNSUPPORTED_PORTFOLIO_CLAIM`, `MISSING:personal_contribution`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a personal_contribution debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a personal_contribution debe ocurrir antes de esa rama.",
          "Después aplica la regla de S52-T4-A: mejora vs baseline sintético y narrativa atribuible. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta personal_contribution", "fixture adverso: result_ttr ≥ baseline, claims sin fuente, sin contribución personal", "CASO-PER-052-4A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `personal_contribution` ausente y produce exactamente `PASS REJECT_UNSUPPORTED_PORTFOLIO_CLAIM MISSING:personal_contribution`.",
        feedback: "S52-T4-A-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_UNSUPPORTED_PORTFOLIO_CLAIM y por qué faltar personal_contribution exige RECORD_PERSONAL_CONTRIBUTION.",
        starterCode: {
          language: 'python',
          title: "s52-t4-a-e2.py",
          code: `# CASO-PER-052 · assess portfolio honesty
# DEFECT: PASS con claims no sourced
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "baseline_ttr_min", "result_ttr_min", "benchmark_synthetic", "demo_minutes", "cv_claims_sourced", "personal_contribution"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["result_ttr_min"] >= record["baseline_ttr_min"] or not record["cv_claims_sourced"] else "REJECT_UNSUPPORTED_PORTFOLIO_CLAIM"

valid = {"case_id": "CASO-PER-052-4A", **{"baseline_ttr_min":90,"result_ttr_min":42,"benchmark_synthetic":True,"demo_minutes":10,"cv_claims_sourced":True,"personal_contribution":True}}
invalid = {"case_id": "CASO-PER-052-4A", **{"baseline_ttr_min":90,"result_ttr_min":120,"benchmark_synthetic":False,"demo_minutes":30,"cv_claims_sourced":False,"personal_contribution":False}}
incomplete = {**valid}
incomplete.pop("personal_contribution")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s52-t4-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "baseline_ttr_min", "result_ttr_min", "benchmark_synthetic", "demo_minutes", "cv_claims_sourced", "personal_contribution"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["result_ttr_min"] < record["baseline_ttr_min"] and record["benchmark_synthetic"] and record["demo_minutes"] <= 10 and record["cv_claims_sourced"] and record["personal_contribution"] else "REJECT_UNSUPPORTED_PORTFOLIO_CLAIM"

valid = {"case_id": "CASO-PER-052-4A", **{"baseline_ttr_min":90,"result_ttr_min":42,"benchmark_synthetic":True,"demo_minutes":10,"cv_claims_sourced":True,"personal_contribution":True}}
invalid = {"case_id": "CASO-PER-052-4A", **{"baseline_ttr_min":90,"result_ttr_min":120,"benchmark_synthetic":False,"demo_minutes":30,"cv_claims_sourced":False,"personal_contribution":False}}
incomplete = {**valid}
incomplete.pop("personal_contribution")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REJECT_UNSUPPORTED_PORTFOLIO_CLAIM MISSING:personal_contribution` ,
        },
      },
      {
        id: "S52-T4-A-E3",
        subtopicId: "S52-T4-A",
        kind: "transfer",
        instruction: "S52-T4-A-E3 · Aísla fallo cerrado para `demo y narrativa de CV` con tres fixtures distintos. `CASO-PER-052-4A` debe continuar, el adverso debe devolver `REJECT_UNSUPPORTED_PORTFOLIO_CLAIM` y la ausencia de `personal_contribution` debe devolver `RECORD_PERSONAL_CONTRIBUTION`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `RECORD_PERSONAL_CONTRIBUTION` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `RECORD_PERSONAL_CONTRIBUTION` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró mejora vs baseline sintético y narrativa atribuible; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta personal_contribution", "fixture adverso: result_ttr ≥ baseline, claims sin fuente, sin contribución personal", "CASO-PER-052-4A es sintético"],
        tests: "Fixtures `CASO-PER-052-4A`, adverso y sin `personal_contribution` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S52-T4-A-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_UNSUPPORTED_PORTFOLIO_CLAIM y por qué faltar personal_contribution exige RECORD_PERSONAL_CONTRIBUTION.",
        starterCode: {
          language: 'python',
          title: "s52-t4-a-e3.py",
          code: `# CASO-PER-052 · decide record contribution
# DEFECT: missing→CONTINUE; no RECORD_PERSONAL_CONTRIBUTION
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "baseline_ttr_min", "result_ttr_min", "benchmark_synthetic", "demo_minutes", "cv_claims_sourced", "personal_contribution"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["result_ttr_min"] >= record["baseline_ttr_min"] or not record["cv_claims_sourced"] else "REJECT_UNSUPPORTED_PORTFOLIO_CLAIM"

valid = {"case_id": "CASO-PER-052-4A", **{"baseline_ttr_min":90,"result_ttr_min":42,"benchmark_synthetic":True,"demo_minutes":10,"cv_claims_sourced":True,"personal_contribution":True}}
invalid = {"case_id": "CASO-PER-052-4A", **{"baseline_ttr_min":90,"result_ttr_min":120,"benchmark_synthetic":False,"demo_minutes":30,"cv_claims_sourced":False,"personal_contribution":False}}
uncertain = {**valid}
uncertain.pop("personal_contribution")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s52-t4-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "baseline_ttr_min", "result_ttr_min", "benchmark_synthetic", "demo_minutes", "cv_claims_sourced", "personal_contribution"}
    missing = sorted(required - record.keys())
    if missing:
        return "RECORD_PERSONAL_CONTRIBUTION"
    return "CONTINUE" if record["result_ttr_min"] < record["baseline_ttr_min"] and record["benchmark_synthetic"] and record["demo_minutes"] <= 10 and record["cv_claims_sourced"] and record["personal_contribution"] else "REJECT_UNSUPPORTED_PORTFOLIO_CLAIM"

valid = {"case_id": "CASO-PER-052-4A", **{"baseline_ttr_min":90,"result_ttr_min":42,"benchmark_synthetic":True,"demo_minutes":10,"cv_claims_sourced":True,"personal_contribution":True}}
invalid = {"case_id": "CASO-PER-052-4A", **{"baseline_ttr_min":90,"result_ttr_min":120,"benchmark_synthetic":False,"demo_minutes":30,"cv_claims_sourced":False,"personal_contribution":False}}
uncertain = {**valid}
uncertain.pop("personal_contribution")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_UNSUPPORTED_PORTFOLIO_CLAIM", "RECORD_PERSONAL_CONTRIBUTION"]` ,
          output: `CONTINUE REJECT_UNSUPPORTED_PORTFOLIO_CLAIM RECORD_PERSONAL_CONTRIBUTION` ,
        },
      },
      {
        id: "S52-T4-B-E1",
        subtopicId: "S52-T4-B",
        kind: "guided",
        instruction: "S52-T4-B-E1 · Decide el contrato de `arquitectura, READMEs, cards, licencia, video y defensa` sobre `CASO-PER-052-4B`. La entrada es el dict completo del starter; la operación debe demostrar ocho artefactos, ejecución, trade-offs y rúbrica independiente. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S52-T4-B PASS`; la misma operación sobre el fixture adverso debe activar `BLOCK_INCOMPLETE_EVIDENCE_BUNDLE` en E2.",
        hint: "Relaciona los campos `artifacts`, `reproducible_command`, `tradeoffs_defended`, `cpn4c_independent` con la regla explicada en S52-T4-B.",
        hints: [
          "Relaciona los campos `artifacts`, `reproducible_command`, `tradeoffs_defended`, `cpn4c_independent` con la regla explicada en S52-T4-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva evidence bundle completo y verificable; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta cpn4c_independent", "fixture adverso: solo README, sin comando reproducible ni trade-offs defendidos", "CASO-PER-052-4B es sintético"],
        tests: "El fixture `CASO-PER-052-4B` satisface un predicado de dominio real; imprime `S52-T4-B PASS` y el assert booleano pasa.",
        feedback: "S52-T4-B-E1: explica qué campo cambió la decisión, por qué el adverso activa BLOCK_INCOMPLETE_EVIDENCE_BUNDLE y por qué faltar cpn4c_independent exige SCHEDULE_TECHNICAL_DEFENSE.",
        starterCode: {
          language: 'python',
          title: "s52-t4-b-e1.py",
          code: `# CASO-PER-052 · evidence bundle CP-FINAL
# DEFECT: PASS si artifacts<8 o no independiente
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-PER-052-4B", **{"artifacts":{"architecture","README","ADR","system_card","model_card","LICENSE","video","defense"},"reproducible_command":True,"tradeoffs_defended":True,"cpn4c_independent":True}}
meets_contract = len(record["artifacts"]) < 8 or not record["cpn4c_independent"]
status = "PASS" if meets_contract else "BLOCK_INCOMPLETE_EVIDENCE_BUNDLE"
print("S52-T4-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s52-t4-b-e1.py",
          code: `record = {"case_id": "CASO-PER-052-4B", **{"artifacts":{"architecture","README","ADR","system_card","model_card","LICENSE","video","defense"},"reproducible_command":True,"tradeoffs_defended":True,"cpn4c_independent":True}}
meets_contract = {"architecture","README","ADR","system_card","model_card","LICENSE","video","defense"} <= record["artifacts"] and all(record[k] for k in ("reproducible_command","tradeoffs_defended","cpn4c_independent"))
status = "PASS" if meets_contract else "BLOCK_INCOMPLETE_EVIDENCE_BUNDLE"
print("S52-T4-B", status)
assert meets_contract is True` ,
          output: `S52-T4-B PASS` ,
        },
      },
      {
        id: "S52-T4-B-E2",
        subtopicId: "S52-T4-B",
        kind: "independent",
        instruction: "S52-T4-B-E2 · Filtra tres rutas de `arquitectura, READMEs, cards, licencia, video y defensa`: fixture válido, fixture adverso y registro sin `cpn4c_independent`. Entrada: dict con case_id, artifacts, reproducible_command, tradeoffs_defended, cpn4c_independent. Salidas exactas: `PASS`, `BLOCK_INCOMPLETE_EVIDENCE_BUNDLE`, `MISSING:cpn4c_independent`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a cpn4c_independent debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a cpn4c_independent debe ocurrir antes de esa rama.",
          "Después aplica la regla de S52-T4-B: ocho artefactos, ejecución, trade-offs y rúbrica independiente. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta cpn4c_independent", "fixture adverso: solo README, sin comando reproducible ni trade-offs defendidos", "CASO-PER-052-4B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `cpn4c_independent` ausente y produce exactamente `PASS BLOCK_INCOMPLETE_EVIDENCE_BUNDLE MISSING:cpn4c_independent`.",
        feedback: "S52-T4-B-E2: explica qué campo cambió la decisión, por qué el adverso activa BLOCK_INCOMPLETE_EVIDENCE_BUNDLE y por qué faltar cpn4c_independent exige SCHEDULE_TECHNICAL_DEFENSE.",
        starterCode: {
          language: 'python',
          title: "s52-t4-b-e2.py",
          code: `# CASO-PER-052 · assess final evidence set
# DEFECT: PASS con bundle incompleto
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "artifacts", "reproducible_command", "tradeoffs_defended", "cpn4c_independent"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if len(record["artifacts"]) < 8 or not record["cpn4c_independent"] else "BLOCK_INCOMPLETE_EVIDENCE_BUNDLE"

valid = {"case_id": "CASO-PER-052-4B", **{"artifacts":{"architecture","README","ADR","system_card","model_card","LICENSE","video","defense"},"reproducible_command":True,"tradeoffs_defended":True,"cpn4c_independent":True}}
invalid = {"case_id": "CASO-PER-052-4B", **{"artifacts":{"README"},"reproducible_command":False,"tradeoffs_defended":False,"cpn4c_independent":False}}
incomplete = {**valid}
incomplete.pop("cpn4c_independent")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s52-t4-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "artifacts", "reproducible_command", "tradeoffs_defended", "cpn4c_independent"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if {"architecture","README","ADR","system_card","model_card","LICENSE","video","defense"} <= record["artifacts"] and all(record[k] for k in ("reproducible_command","tradeoffs_defended","cpn4c_independent")) else "BLOCK_INCOMPLETE_EVIDENCE_BUNDLE"

valid = {"case_id": "CASO-PER-052-4B", **{"artifacts":{"architecture","README","ADR","system_card","model_card","LICENSE","video","defense"},"reproducible_command":True,"tradeoffs_defended":True,"cpn4c_independent":True}}
invalid = {"case_id": "CASO-PER-052-4B", **{"artifacts":{"README"},"reproducible_command":False,"tradeoffs_defended":False,"cpn4c_independent":False}}
incomplete = {**valid}
incomplete.pop("cpn4c_independent")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS BLOCK_INCOMPLETE_EVIDENCE_BUNDLE MISSING:cpn4c_independent` ,
        },
      },
      {
        id: "S52-T4-B-E3",
        subtopicId: "S52-T4-B",
        kind: "transfer",
        instruction: "S52-T4-B-E3 · Demuestra fallo cerrado para `arquitectura, READMEs, cards, licencia, video y defensa` con tres fixtures distintos. `CASO-PER-052-4B` debe continuar, el adverso debe devolver `BLOCK_INCOMPLETE_EVIDENCE_BUNDLE` y la ausencia de `cpn4c_independent` debe devolver `SCHEDULE_TECHNICAL_DEFENSE`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `SCHEDULE_TECHNICAL_DEFENSE` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `SCHEDULE_TECHNICAL_DEFENSE` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró ocho artefactos, ejecución, trade-offs y rúbrica independiente; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta cpn4c_independent", "fixture adverso: solo README, sin comando reproducible ni trade-offs defendidos", "CASO-PER-052-4B es sintético"],
        tests: "Fixtures `CASO-PER-052-4B`, adverso y sin `cpn4c_independent` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S52-T4-B-E3: explica qué campo cambió la decisión, por qué el adverso activa BLOCK_INCOMPLETE_EVIDENCE_BUNDLE y por qué faltar cpn4c_independent exige SCHEDULE_TECHNICAL_DEFENSE.",
        starterCode: {
          language: 'python',
          title: "s52-t4-b-e3.py",
          code: `# CASO-PER-052 · decide schedule defense
# DEFECT: missing→CONTINUE; no SCHEDULE_TECHNICAL_DEFENSE
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "artifacts", "reproducible_command", "tradeoffs_defended", "cpn4c_independent"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if len(record["artifacts"]) < 8 or not record["cpn4c_independent"] else "BLOCK_INCOMPLETE_EVIDENCE_BUNDLE"

valid = {"case_id": "CASO-PER-052-4B", **{"artifacts":{"architecture","README","ADR","system_card","model_card","LICENSE","video","defense"},"reproducible_command":True,"tradeoffs_defended":True,"cpn4c_independent":True}}
invalid = {"case_id": "CASO-PER-052-4B", **{"artifacts":{"README"},"reproducible_command":False,"tradeoffs_defended":False,"cpn4c_independent":False}}
uncertain = {**valid}
uncertain.pop("cpn4c_independent")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s52-t4-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "artifacts", "reproducible_command", "tradeoffs_defended", "cpn4c_independent"}
    missing = sorted(required - record.keys())
    if missing:
        return "SCHEDULE_TECHNICAL_DEFENSE"
    return "CONTINUE" if {"architecture","README","ADR","system_card","model_card","LICENSE","video","defense"} <= record["artifacts"] and all(record[k] for k in ("reproducible_command","tradeoffs_defended","cpn4c_independent")) else "BLOCK_INCOMPLETE_EVIDENCE_BUNDLE"

valid = {"case_id": "CASO-PER-052-4B", **{"artifacts":{"architecture","README","ADR","system_card","model_card","LICENSE","video","defense"},"reproducible_command":True,"tradeoffs_defended":True,"cpn4c_independent":True}}
invalid = {"case_id": "CASO-PER-052-4B", **{"artifacts":{"README"},"reproducible_command":False,"tradeoffs_defended":False,"cpn4c_independent":False}}
uncertain = {**valid}
uncertain.pop("cpn4c_independent")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "BLOCK_INCOMPLETE_EVIDENCE_BUNDLE", "SCHEDULE_TECHNICAL_DEFENSE"]` ,
          output: `CONTINUE BLOCK_INCOMPLETE_EVIDENCE_BUNDLE SCHEDULE_TECHNICAL_DEFENSE` ,
        },
      },
    ],
  },
  youDo: {
    title: "CP-FINAL · Enterprise Relationship & Operations Intelligence Platform (portfolio defendible)",
    context: "Capstone final de la Enterprise Relationship & Operations Intelligence Platform. Trabaja con datos totalmente sintéticos de varias regiones del Perú (`CASO-PER-052`). Entrada: artefactos congelados S1–S51, contratos, riesgos, no-go y benchmark. Salida: producto reproducible, demo, evidencia técnica y defensa de trade-offs. El gate **bloquea la graduación** si hay P0/P1 abiertos, PII real, dependencia no reproducible, rollback no probado o afirmación sin evidencia.",
    objectives: [
      "Convertir artefactos S1–S51 y los 12 capstones en una plataforma reproducible con demo, cards y defensa de trade-offs.",
      "Demostrar el gate: 52/52, 12/12 capstones, CP-FINAL y regresión completa pasan sin compensar CP-N4-C.",
      "Probar el fallo: P0/P1 abiertos, PII real, dependencia no reproducible, rollback no probado o afirmación sin evidencia deben bloquear la graduación.",
      "Entregar evidence bundle de 8 artefactos, sin secretos ni servicios externos obligatorios, con contribución personal explícita.",
    ],
    requirements: [
      "Usa exclusivamente fixtures sintéticos identificados por `CASO-PER-052` (sin PII real).",
      "Incluye arquitectura con seis contexts (intake, er, relationship, triage, reporting, copilot) vía APIs/eventos y human workflow.",
      "Incluye tests/evals/red team/performance y benchmark antes/después (TTR u otra métrica con baseline congelado).",
      "Incluye SLO, backup, rollback y disaster exercise con RPO/RTO medidos y restore verificado.",
      "Incluye los 8 artefactos: architecture (C4), README, ADR, system_card, model_card, LICENSE, demo_video, defense_notes.",
      "Automatiza un caso normal (`CONTINUE`/`PASS`), uno de breach (`DECLARE_NO_GO` / `BLOCK_FINAL_ON_P0_P1` / `NO_GO_RESILIENCE` según capa) y uno incierto (`INTERVIEW_STAKEHOLDER` / `INDEPENDENT_RISK_REVIEW` / equivalente del subtema).",
      "Incluye comandos locales reproducibles, dependencias fijadas y salida esperada.",
      "Registra riesgo residual, responsable, criterio de rollback, limitaciones y contribución personal.",
      "Hitos 80 h (orientativo): sem. 1–2 CF-1/no-go; sem. 3–5 contexts+HITL; sem. 6–7 verificación+DR; sem. 8–9 demo+bundle+defensa.",
    ],
    starterCode: `CASE_ID = "CASO-PER-052"
# Checklist de readiness CP-FINAL — inicia BLOCKED a propósito.
# No pases a READY solo volteando booleans: enlaza artefactos reales del repo.
#
# Orden de ensamblaje de 80 h (marca done solo con evidencia en disco):
#   W1–2  CF-1 revalidado + no-go firmado (change_log, risk register)
#   W3–5  6 contexts + HITL (OpenAPI/event schemas; er→triage→rpa→rag→human)
#   W6–7  6 capas de tests + DR medido (RPO/RTO, restore verificado)
#   W8–9  demo ≤10 min + BUNDLE_8 + defensa oral (trade-offs + contribución personal)
# Los 12 capstones previos alimentan este producto; no se «compensan» con CP-N4-C.

REQUIRED = [
    "arquitectura_integrada_con_apis_eventos_human_workflow",
    "tests_evals_red_team_performance_y_benchmark_antes_despues",
    "slo_backup_rollback_y_disaster_exercise",
    "readme_adrs_cards_licencia_demo_y_defensa_con_contribucion_personal",
]

# Ocho artefactos del evidence bundle (alineados a theory/iDo/weDo T4-B)
BUNDLE_8 = [
    "architecture.md",  # C4
    "README",
    "ADR",
    "system_card",
    "model_card",
    "LICENSE",
    "demo_video",
    "defense_notes",
]

# Wiring de integración (rellena con lo que realmente cableaste)
CONTEXTS_6 = {"intake", "er", "relationship", "triage", "reporting", "copilot"}
contexts_wired: set[str] = set()  # debe llegar a CONTEXTS_6
events_declared = []  # p. ej. ["job.finished", "case.updated"]
hitl_chain_ok = False  # er→triage→rpa→rag→human_decides, infers_fraud=False
drill = {
    "availability": None,
    "slo": None,
    "backup_age_h": None,
    "rpo_h": None,
    "rollback_min": None,
    "rto_min": None,
    "restore_verified": False,
}

# Hitos de integración (False hasta path revisable)
milestones = {
    "w1_2_cf1_nogo": False,
    "w3_5_contexts_hitl": False,
    "w6_7_verify_dr": False,
    "w8_9_demo_bundle_defense": False,
}

# Guion de defensa oral (problema → baseline → decisión → métrica → límite)
defense_script = {
    "problem": "",
    "baseline": "",
    "decision": "",
    "metric_before_after": "",
    "limit_ethics": "HITL obligatorio; sin PII real; ER/score ≠ fraude",
}

evidence = {name: False for name in REQUIRED}
# Rellena paths reales cuando existan, p. ej.:
# artifact_paths = {"architecture.md": "docs/c4.md", "README": "README.md", ...}
artifact_paths: dict[str, str] = {}
regression_cmd = "python -m pytest tests/ -q"  # ajusta a tu suite local S1–S52
defense_notes_path = "docs/defense_notes.md"
personal_contribution = ""  # 1–3 frases: qué hiciste tú vs plantillas del curso
baseline_ttr_min = None  # congela baseline sintético antes de claim de mejora
result_ttr_min = None

def readiness(bundle: dict[str, bool]) -> tuple[str, list[str]]:
    missing = [name for name in REQUIRED if bundle.get(name) is not True]
    if len(artifact_paths) < 8 or set(BUNDLE_8) - set(artifact_paths):
        missing.append("evidence_bundle_8_paths")
    if contexts_wired != CONTEXTS_6:
        missing.append("contexts_not_fully_wired")
    if not hitl_chain_ok:
        missing.append("hitl_chain_incomplete")
    if not drill.get("restore_verified"):
        missing.append("disaster_restore_not_verified")
    if not personal_contribution.strip():
        missing.append("personal_contribution")
    if not regression_cmd.strip():
        missing.append("regression_cmd")
    if not all(milestones.values()):
        missing.append("milestones_80h_incomplete")
    if not all(defense_script.get(k) for k in ("problem", "baseline", "decision", "metric_before_after")):
        missing.append("defense_script_incomplete")
    if baseline_ttr_min is None or result_ttr_min is None:
        missing.append("ttr_baseline_or_result_missing")
    elif result_ttr_min >= baseline_ttr_min:
        missing.append("ttr_no_improvement_vs_baseline")
    return ("READY", []) if not missing else ("BLOCKED", missing)

status, missing = readiness(evidence)
print(CASE_ID, status)
print("missing", ",".join(missing))
print("bundle_expected_n", len(BUNDLE_8))
print("contexts_wired_n", len(contexts_wired), "/", len(CONTEXTS_6))
print("milestones_done", sum(milestones.values()), "/", len(milestones))
assert status in {"READY", "BLOCKED"}
`,
    portfolioNote: "Evidencia de CP-FINAL · plataforma integral defendible: baseline TTR (u otra métrica), decisión, pruebas, resultado medido, RPO/RTO, rollback y riesgo residual. El checklist inicia en BLOCKED por diseño; READY exige hitos 80 h, 6 contexts cableados (con relationship), HITL, restore verificado, paths de los 8 artefactos, guion de defensa, regresión S1–S52, mejora vs baseline y contribución personal — no voltear booleans. weDo entrenó los códigos de acción; este youDo es el ensamblaje real del producto de CV.",
    rubric: [
      { criterion: "Correctitud del contrato y gate (52/52 + 12/12 + CP-FINAL + regresión; sin compensar CP-N4-C)", weight: "25%" },
      { criterion: "Pruebas normal/breach/uncertain y recuperación fail-closed", weight: "20%" },
      { criterion: "Seguridad, privacidad y least privilege (sin PII real, sin auto-fraude)", weight: "15%" },
      { criterion: "Reproducibilidad, lineage y evidence bundle de 8 artefactos", weight: "15%" },
      { criterion: "Operación: SLO, observabilidad, RPO/RTO y rollback probado", weight: "15%" },
      { criterion: "Comunicación de trade-offs, límites y contribución personal", weight: "10%" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "¿Qué evidencia permite aprobar la revalidación CF-1 (stakeholders, jobs y métricas) en CASO-PER-052?",
        options: ["un print sin assert ni versión", "una captura de pantalla sin fuente", "datos personales reales para que parezca auténtico", "matriz stakeholder/job/métrica con evidencia y baseline congelado"],
        correctIndex: 3,
        explanation: "S52-T1-A exige matriz viva + baseline_frozen; evidencia decorativa o PII no satisface el contrato (REOPEN_CF1 / INTERVIEW_STAKEHOLDER).",
      },
      {
        question: "Si un release integra contexts con DB compartida y sin contract tests, ¿qué acción del laboratorio preserva el gate?",
        options: ["continuar y ocultar el warning en el README", "STOP_INTEGRATION_RELEASE y conservar evidencia del schema roto", "inventar contract tests en el PR sin correrlos", "borrar el context relationship para simplificar el monólito"],
        correctIndex: 1,
        explanation:
          "S52-T2-A falla cerrado con `STOP_INTEGRATION_RELEASE` cuando faltan los seis contexts versionados o aparece shared_database; no convierte breach en éxito silencioso.",
      },
      {
        question: "¿Cuál resultado demuestra el gate `CP-FINAL · plataforma integral defendible`?",
        options: ["el archivo S52 existe, aunque no pruebe el gate", "el README afirma que funciona", "52/52, 12/12 capstones, CP-FINAL y regresión completa pasan sin compensar CP-N4-C", "se usó la herramienta más nueva"],
        correctIndex: 2,
        explanation: "El gate es conductual y medible: 52/52, 12/12 capstones, CP-FINAL y regresión completa pasan sin compensar CP-N4-C.",
      },
      {
        question: "En CASO-PER-052-3B con availability=0.999, slo=0.995, backup_age_h=3, rpo_h=4, rollback_min=8, rto_min=15 y restore_verified=True, ¿qué corresponde?",
        options: ["PASS/CONTINUE: cumple SLO y RPO/RTO medidos con restore verificado", "NO_GO_RESILIENCE porque el backup tiene 3 horas", "aprobar solo con un tabletop verbal sin reloj", "RUN_DISASTER_EXERCISE aunque el flag de restore ya esté en True"],
        correctIndex: 0,
        explanation:
          "S52-T3-B exige availability ≥ SLO, backup_age_h ≤ rpo_h, rollback_min ≤ rto_min y restore verificado. El fixture cumple; un tabletop sin números no cuenta. Breach → `NO_GO_RESILIENCE`; falta de drill → `RUN_DISASTER_EXERCISE`.",
      },
      {
        question: "En el capstone CP-FINAL, un claim de mejora de TTR sin baseline congelado ni contribución personal documentada, ¿qué corresponde?",
        options: ["Aprobar el portfolio porque el demo duró menos de 10 minutos", "Publicar el DNI de stakeholders para “auditar”", "Omitir model card y LICENSE si el video es convincente", "REJECT_UNSUPPORTED_PORTFOLIO_CLAIM o REOPEN hasta evidencia reproducible y contribución personal"],
        correctIndex: 3,
        explanation:
          "S52-T4-A / weDo exigen baseline sintético, claims sourced y contribución personal; sin eso se emite `REJECT_UNSUPPORTED_PORTFOLIO_CLAIM` (o se reabre), no se aprueba por teatro de demo. El evidence bundle de T4-B sigue exigiendo **8** artefactos (architecture, README, ADR, system/model cards, LICENSE, video, defense).",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "GitHub — About READMEs",
        url: "https://docs.github.com/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes",
        note: "Documentación ejecutable del repositorio",
      },
      {
        label: "C4 model",
        url: "https://c4model.com/",
        note: "Defensa visual de arquitectura (context→containers→components)",
      },
      {
        label: "Architecture Decision Records",
        url: "https://adr.github.io/",
        note: "ADRs y decisiones defendibles en el bundle",
      },
      {
        label: "NIST Secure Software Development Framework",
        url: "https://csrc.nist.gov/Projects/ssdf",
        note: "Verificación y publicación segura",
      },
      {
        label: "12factor App",
        url: "https://12factor.net/",
        note: "Reproducibilidad y config",
      },
      {
        label: "Choose a License",
        url: "https://choosealicense.com/",
        note: "Licencia abierta del portfolio (artefacto obligatorio)",
      },
      {
        label: "SRE — Disaster Recovery",
        url: "https://sre.google/sre-book/disaster-recovery/",
        note: "RPO/RTO medidos y drills (T3-B)",
      },
      {
        label: "learning_roadmap_52_V3 (repo)",
        url: "https://github.com/PillB/pyarcana",
        note: "CP-FINAL y regresión total S1–S52",
      },
    ],
    books: [
      { label: "Designing Data-Intensive Applications", note: "Arquitectura defendible y trade-offs" },
      { label: "Site Reliability Engineering", note: "SLO, backup y disaster drills" },
    ],
    courses: [
      { label: "MIT 6.100L — Introduction to CS and Programming Using Python", url: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/", note: "Contratos verificables y tests" },
      { label: "Harvard CS50P", url: "https://cs50.harvard.edu/python/", note: "Proyectos reproducibles y tests unitarios" },
      { label: "Google SRE Book (gratis) — Reliability & DR", url: "https://sre.google/sre-book/table-of-contents/", note: "Narrativa de operación y RPO/RTO" },
      { label: "Coursera — Software Design and Architecture (UAlberta specializations)", url: "https://www.coursera.org/specializations/software-design-architecture", note: "Trade-offs y diseño de sistemas para defensa oral" },
    ],
  },
}
