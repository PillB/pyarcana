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
    "En equipos de plataforma y producto, enterprise relationship & operations intelligence platform: capstone final conecta decisiones técnicas con evidencia operativa. La práctica entrega producto reproducible, demo, evidencia técnica y defensa de trade-offs y se promueve solo cuando 52/52, 12/12 capstones, CP-FINAL y regresión completa pasan sin compensar CP-N4-C.",
  learningOutcomes: [
    { text: "Revalida stakeholders y métricas de CF-1" },
    { text: "Actualiza constraints, riesgos y no-go" },
    { text: "Integra contexts vía APIs y eventos" },
    { text: "Ensambla datos/modelos/RPA/RAG/HITL" },
    { text: "Ejecuta tests, evals y red team" },
    { text: "Demuestra SLO, backup y disaster exercise" },
    { text: "Prepara demo y narrativa de CV" },
    { text: "Publica artefactos y defiende técnicamente" },
  ],
  theory: [
    {
      heading: "Ruta de S52: Enterprise Relationship & Operations Intelligence Platform: capstone final",
      paragraphs: [
        "**Diccionario de la sección** (léelo antes de T1). **CP-FINAL:** capstone de integración del currículo completo. **CF-1 revalidación:** stakeholders, jobs y métricas actualizados. **No-go:** decisión de no desplegar si riesgo o evidencia faltan. **Bounded contexts:** fronteras intake/ER/grafo/triage/RAG/HITL. **Regresión S1–S52:** smoke de contratos y demos. **Disaster exercise:** backup/rollback probados. **System/model/data cards:** límites y ownership. **Demo reproducible:** un comando + fixtures sintéticos. **Defensa técnica:** trade-offs y contribución personal en el portafolio. **Promoción máster:** 52/52 + 12/12 + CP-FINAL + regresión sin P0/P1; **no compensa** CP-N4-C.",
        "Esta sección es el **senior-master close**: integra S01–S51 en la **Enterprise Relationship & Operations Intelligence Platform**. El caso `CASO-PER-052` (plataforma nacional sintética multi-región) corre sin credenciales, sin PII real y sin auto-etiquetar fraude. Graduación exige 52/52 + 12/12 + CP-FINAL + regresión — **sin compensar** CP-N4-C.",
        "Producto incremental: plataforma final defendible. Entrada: artefactos congelados S1–S51, contratos, riesgos, no-go y benchmark. Salida: producto reproducible, demo, cards, evidencia de drill y defensa de trade-offs/contribución personal. Error: P0/P1 abierto, dependencia no reproducible o claim ético violado.",
        "Orden: T1 revalidación CF-1/no-go → T2 bounded contexts → T3 evals/red team/SLO/disaster → T4 demo/CV/defensa. Teoría medible, iDo con helpers, weDo con **DEFECT** de integración. Id legacy `career-strategy` se reinterpreta: carrera = **portfolio técnico defendible**, no solo soft skills. Stack: **stdlib** + artefactos del curso.",
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
        title: "Gate de promoción",
        content: "CP-FINAL · plataforma integral defendible: 52/52, 12/12 capstones, CP-FINAL y regresión completa pasan sin compensar CP-N4-C. Si falta evidencia, no se promociona.",
      },
    },
    {
      heading: "stakeholders, jobs y success metrics de CF-1",
      subtopicId: "S52-T1-A",
      paragraphs: [
        "Revalida **stakeholders**, **jobs** y **success metrics** de CF-1 antes del capstone final: lo que importaba en S01 puede haber cambiado. **Registra el delta** (quién se fue, qué métrica se retiró) y evita optimizar una necesidad ya inválida. Sin matriz viva stakeholder/job/métrica, el portfolio defiende un producto fantasma.",
        "Contrato operativo. Entrada: artefactos congelados S1–S51, contratos, riesgos, no-go decisions y benchmark. Salida de este subtema: matriz stakeholder/job/métrica con evidencia. Error: P0/P1, PII, dependencia no reproducible, rollback no probado o afirmación sin evidencia bloquea graduación. Criterio de éxito: 52/52, 12/12 capstones, CP-FINAL y regresión completa pasan sin compensar CP-N4-C.",
        "Aplicación de `stakeholders, jobs y success metrics de CF-1` al caso peruano sintético `CASO-PER-052`: la Enterprise Relationship & Operations Intelligence Platform con datos totalmente sintéticos de varias regiones del Perú. La evidencia esperada es matriz stakeholder/job/métrica con evidencia. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "stakeholders_jobs_success_cf1.py",
        code: `def cf1_matrix(stakeholders, jobs, metrics):
    return list(stakeholders), list(jobs), list(metrics)

s, j, m = cf1_matrix(["ops", "compliance", "data"], ["intake", "er", "report"], ["ttr", "precision_review"])
print(s)
print(j)
print(m)`,
        output: `['ops', 'compliance', 'data']
['intake', 'er', 'report']
['ttr', 'precision_review']`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Evidencia mínima de S52-T1-A: matriz stakeholder/job/métrica con evidencia. Si falta, responde `REOPEN_CF1`; si no alcanza para decidir, `INTERVIEW_STAKEHOLDER`.",
      },
    },
    {
      heading: "cambios, constraints, riesgos y no-go",
      subtopicId: "S52-T1-B",
      paragraphs: [
        "**Constraints, riesgos y no-go** tienen **dueño y umbral** escritos: presupuesto, latencia, PII, auto-etiquetado de fraude. Alcance que compromete privacidad o elimina revisión humana se **rechaza** (DECLARE_NO_GO), no se «gestiona con un disclaimer». Matching/ER/scores son evidencia — **nunca** prueba de fraude, parentesco o colusión.",
        "Contrato no-go. Entrada: lista de prohibiciones. Salida: `real_pii` y `auto_fraud_label` siempre bloqueados; `match_is_fraud` es False. Error: promover con PII real o auto-etiquetar fraude. Criterio: CP-FINAL no se aprueba si el no-go se viola; ethics fail-closed en toda la plataforma.",
        "Aplicación a `CASO-PER-052-T1B`: constraints budget/latency y change_log firmado. Matching/ER/scores alimentan revisión humana; **no** son veredicto legal ni prueba de parentesco/colusión.",
      ],
      code: {
        language: 'python',
        title: "changes_constraints_risks_nogo.py",
        code: `def nogo_list() -> list:
    return ["real_pii", "auto_fraud_label"]

def match_is_fraud_claim() -> bool:
    return False  # ER/score ≠ fraude

print("nogo", nogo_list())
print("constraints", ["budget", "latency"])
print("change_log", True)
print("match_is_fraud", match_is_fraud_claim())`,
        output: `nogo ['real_pii', 'auto_fraud_label']
constraints ['budget', 'latency']
change_log True
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
      heading: "bounded contexts, APIs y eventos",
      subtopicId: "S52-T2-A",
      paragraphs: [
        "**Bounded contexts** (intake, ER, relationship, triage, reporting, copilot) se integran por **APIs y eventos versionados**; **contratos y ownership** evitan una base compartida como acoplamiento oculto. Contract tests end-to-end fallan el release si un productor rompe el schema — no se «arregla en el consumidor» a escondidas.",
        "Contrato operativo. Entrada: artefactos congelados S1–S51, contratos, riesgos, no-go decisions y benchmark. Salida de este subtema: contract tests end-to-end. Error: P0/P1, PII, dependencia no reproducible, rollback no probado o afirmación sin evidencia bloquea graduación. Criterio de éxito: 52/52, 12/12 capstones, CP-FINAL y regresión completa pasan sin compensar CP-N4-C.",
        "Aplicación de `bounded contexts, APIs y eventos` al caso peruano sintético `CASO-PER-052`: la Enterprise Relationship & Operations Intelligence Platform con datos totalmente sintéticos de varias regiones del Perú. La evidencia esperada es contract tests end-to-end. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "bounded_apis_events.py",
        code: `def contexts() -> list:
    return ["intake", "er", "relationship", "triage", "reporting", "copilot"]

print(contexts())
print(["POST /jobs", "GET /jobs/{id}"])
print(["job.finished", "case.updated"])`,
        output: `['intake', 'er', 'relationship', 'triage', 'reporting', 'copilot']
['POST /jobs', 'GET /jobs/{id}']
['job.finished', 'case.updated']`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "La revisión de S52-T2-A conserva contract tests end-to-end; no conviertas `STOP_INTEGRATION_RELEASE` ni `MAP_BOUNDED_CONTEXTS` en éxito silencioso.",
      },
    },
    {
      heading: "datos, modelos, RPA, RAG y human workflow",
      subtopicId: "S52-T2-B",
      paragraphs: [
        "**Datos, modelos, RPA y RAG** apoyan un **human workflow**, no lo sustituyen: ER **propone** identidad, triage **prioriza**, el copiloto **cita** evidencia. **Ninguna señal prueba fraude o parentesco**; auto_fraud permanece False. Decisión sensible sin humano en el loop es no-go de graduación.",
        "Contrato operativo. Entrada: artefactos congelados S1–S51, contratos, riesgos, no-go decisions y benchmark. Salida de este subtema: decisión sensible conserva revisión humana. Error: P0/P1, PII, dependencia no reproducible, rollback no probado o afirmación sin evidencia bloquea graduación. Criterio de éxito: 52/52, 12/12 capstones, CP-FINAL y regresión completa pasan sin compensar CP-N4-C.",
        "Aplicación de `datos, modelos, RPA, RAG y human workflow` al caso peruano sintético `CASO-PER-052`: la Enterprise Relationship & Operations Intelligence Platform con datos totalmente sintéticos de varias regiones del Perú. La evidencia esperada es decisión sensible conserva revisión humana. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "data_models_rpa_rag_human.py",
        code: `def stack_layers() -> list:
    return sorted(["data", "hitl", "models", "rag", "rpa"])

print(stack_layers())
print("human_in_loop", True)
print("no_dark_patterns", True)`,
        output: `['data', 'hitl', 'models', 'rag', 'rpa']
human_in_loop True
no_dark_patterns True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Contrato S52-T2-B: demuestra decisión sensible conserva revisión humana. Falla cerrada con `BLOCK_AUTOMATED_RISK_DECISION` y deriva incertidumbre mediante `REQUEST_HUMAN_REVIEW`.",
      },
    },
    {
      heading: "tests/evals/red team y performance",
      subtopicId: "S52-T3-A",
      paragraphs: [
        "**Tests, evals, red team y performance** cubren rutas normales y degradadas (tool caída, retrieval vacío, injection). Cada hallazgo **P0/P1** deja un **regression test permanente** — no se cierra el ticket sin suite. Compensar CP-N4-C con demo bonita no es graduación.",
        "Contrato operativo. Entrada: artefactos congelados S1–S51, contratos, riesgos, no-go decisions y benchmark. Salida de este subtema: matriz de verificación sin P0/P1. Error: P0/P1, PII, dependencia no reproducible, rollback no probado o afirmación sin evidencia bloquea graduación. Criterio de éxito: 52/52, 12/12 capstones, CP-FINAL y regresión completa pasan sin compensar CP-N4-C.",
        "Aplicación de `tests/evals/red team y performance` al caso peruano sintético `CASO-PER-052`: la Enterprise Relationship & Operations Intelligence Platform con datos totalmente sintéticos de varias regiones del Perú. La evidencia esperada es matriz de verificación sin P0/P1. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "tests_evals_redteam_perf.py",
        code: `def verification_ok(p0: int, p1: int) -> bool:
    return p0 == 0 and p1 == 0

print(verification_ok(0, 0))
print(sorted(["evals", "perf", "redteam", "unit"]))
print("p0_p1", "zero")`,
        output: `True
['evals', 'perf', 'redteam', 'unit']
p0_p1 zero`,
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
        "**SLO, backup, rollback y disaster exercise** se demuestran con **reloj y evidencia** (RPO/RTO medidos, restore verificado). Un runbook no ejercitado **no reduce riesgo**. El capstone exige drill documentado, no un markdown de intenciones.",
        "Contrato operativo. Entrada: artefactos congelados S1–S51, contratos, riesgos, no-go decisions y benchmark. Salida de este subtema: RPO/RTO y restauración demostrados. Error: P0/P1, PII, dependencia no reproducible, rollback no probado o afirmación sin evidencia bloquea graduación. Criterio de éxito: 52/52, 12/12 capstones, CP-FINAL y regresión completa pasan sin compensar CP-N4-C.",
        "Aplicación de `SLO, backup, rollback y disaster exercise` al caso peruano sintético `CASO-PER-052`: la Enterprise Relationship & Operations Intelligence Platform con datos totalmente sintéticos de varias regiones del Perú. La evidencia esperada es RPO/RTO y restauración demostrados. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "slo_backup_rollback_disaster.py",
        code: `def resilience(slo: float, backup: str) -> dict:
    return {"slo": slo, "backup": backup, "disaster": "tabletop_ok"}

print(resilience(0.995, "daily"))
print("drill", "tabletop_ok")
print("rto", "documented")`,
        output: `{'slo': 0.995, 'backup': 'daily', 'disaster': 'tabletop_ok'}
drill tabletop_ok
rto documented`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Promoción de S52-T3-B: prueba RPO/RTO y restauración demostrados y registra por separado `NO_GO_RESILIENCE` (breach) y `RUN_DISASTER_EXERCISE` (missing).",
      },
    },
    {
      heading: "demo y narrativa CV",
      subtopicId: "S52-T4-A",
      paragraphs: [
        "La **demo** narra **problema → baseline → decisión → métrica → límite** en minutos, reproducible sin conocimiento tribal. El **CV/portfolio** distingue **contribución personal** de trabajo de equipo o plantillas previas; inflar ownership es anti-patrón de carrera y de ética profesional.",
        "Contrato operativo. Entrada: artefactos congelados S1–S51, contratos, riesgos, no-go decisions y benchmark. Salida de este subtema: demo reproducible con antes/después. Error: P0/P1, PII, dependencia no reproducible, rollback no probado o afirmación sin evidencia bloquea graduación. Criterio de éxito: 52/52, 12/12 capstones, CP-FINAL y regresión completa pasan sin compensar CP-N4-C.",
        "Aplicación de `demo y narrativa CV` al caso peruano sintético `CASO-PER-052`: la Enterprise Relationship & Operations Intelligence Platform con datos totalmente sintéticos de varias regiones del Perú. La evidencia esperada es demo reproducible con antes/después. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "demo_cv_narrative.py",
        code: `def demo_plan(minutes: int, bullets: int) -> dict:
    return {"script": f"{minutes}min", "cv_bullets": bullets}

print(demo_plan(10, 3))
print("narrative", "impact+metrics")
print("repro", True)`,
        output: `{'script': '10min', 'cv_bullets': 3}
narrative impact+metrics
repro True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "El dueño de S52-T4-A acepta solo demo reproducible con antes/después; una violación produce `REJECT_UNSUPPORTED_PORTFOLIO_CLAIM` y un registro incompleto produce `RECORD_PERSONAL_CONTRIBUTION`.",
      },
    },
    {
      heading: "arquitectura, READMEs, cards, licencia, video y defensa",
      subtopicId: "S52-T4-B",
      paragraphs: [
        "**Arquitectura (C4), README, ADR/model cards, licencia, video y defensa oral** permiten a un revisor **ejecutar y cuestionar** el sistema sin conocimiento tribal. Falta de licencia o de evidencia de no-go es bloqueo de publicación — el senior master gate exige paquete defendible, no solo código que corre en la laptop del autor.",
        "Contrato operativo. Entrada: artefactos congelados S1–S51, contratos, riesgos, no-go decisions y benchmark. Salida de este subtema: evidence bundle completo y verificable. Error: P0/P1, PII, dependencia no reproducible, rollback no probado o afirmación sin evidencia bloquea graduación. Criterio de éxito: 52/52, 12/12 capstones, CP-FINAL y regresión completa pasan sin compensar CP-N4-C.",
        "Aplicación de `arquitectura, READMEs, cards, licencia, video y defensa` al caso peruano sintético `CASO-PER-052`: la Enterprise Relationship & Operations Intelligence Platform con datos totalmente sintéticos de varias regiones del Perú. La evidencia esperada es evidence bundle completo y verificable. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "arch_readme_cards_license_video_defense.py",
        code: `def evidence_bundle() -> list:
    return ["architecture.md", "README", "system_card", "LICENSE", "demo_video", "defense_notes"]

bundle = evidence_bundle()
print(bundle)
print("n", len(bundle))
print("cp_final", "independent_of_cpn4c")`,
        output: `['architecture.md', 'README', 'system_card', 'LICENSE', 'demo_video', 'defense_notes']
n 6
cp_final independent_of_cpn4c`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Cierre de S52-T4-B: conserva evidence bundle completo y verificable, la evidencia de `BLOCK_INCOMPLETE_EVIDENCE_BUNDLE` y la ruta humana `SCHEDULE_TECHNICAL_DEFENSE`.",
      },
    },
  ],
  iDo: {
    intro: "Te muestro 8 demos de S52 (Enterprise Relationship & Operations Intelligence Platform: capstone final) alineadas a CP-FINAL exclusivamente.",
    steps: [
      {
        demoId: "S52-T1-A-DEMO",
        subtopicId: "S52-T1-A",
        environment: "local-python",
        description: "Demo: stakeholders, jobs y success metrics de CF-1",
        code: {
          language: 'python',
          title: "demo_stakeholders_jobs_success_cf1.py",
          code: `def metrics() -> list:
    return ["ttr", "precision_review"]

print("cf1_revalidated", True)
print("metrics", metrics())
print("synthetic", True)`,
          output: `cf1_revalidated True
metrics ['ttr', 'precision_review']
synthetic True`,
        },
        why: "Hace observable `stakeholders, jobs y success metrics de CF-1` con un caso local pequeño y deja como evidencia matriz stakeholder/job/métrica con evidencia; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S52-T1-B-DEMO",
        subtopicId: "S52-T1-B",
        environment: "local-python",
        description: "Demo: cambios, constraints, riesgos y no-go",
        code: {
          language: 'python',
          title: "demo_changes_constraints_risks_nogo.py",
          code: `def nogo() -> list:
    return ["real_pii", "auto_fraud_label"]

print("nogo", nogo())
print("risk_register", True)
print("update", True)`,
          output: `nogo ['real_pii', 'auto_fraud_label']
risk_register True
update True`,
        },
        why: "Hace observable `cambios, constraints, riesgos y no-go` con un caso local pequeño y deja como evidencia registro de riesgos y no-go firmado; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S52-T2-A-DEMO",
        subtopicId: "S52-T2-A",
        environment: "local-python",
        description: "Demo: bounded contexts, APIs y eventos",
        code: {
          language: 'python',
          title: "demo_bounded_apis_events.py",
          code: `def bounded_ok() -> bool:
    return True

print("contracts", True)
print("events", True)
print("bounded", bounded_ok())`,
          output: `contracts True
events True
bounded True`,
        },
        why: "Hace observable `bounded contexts, APIs y eventos` con un caso local pequeño y deja como evidencia contract tests end-to-end; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S52-T2-B-DEMO",
        subtopicId: "S52-T2-B",
        environment: "local-python",
        description: "Demo: datos, modelos, RPA, RAG y human workflow",
        code: {
          language: 'python',
          title: "demo_data_models_rpa_rag_human.py",
          code: `def rag_mode() -> str:
    return "cited"

print("assemble", True)
print("rpa", "vp_flows")
print("rag", rag_mode())`,
          output: `assemble True
rpa vp_flows
rag cited`,
        },
        why: "Hace observable `datos, modelos, RPA, RAG y human workflow` con un caso local pequeño y deja como evidencia decisión sensible conserva revisión humana; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S52-T3-A-DEMO",
        subtopicId: "S52-T3-A",
        environment: "local-python",
        description: "Demo: tests/evals/red team y performance",
        code: {
          language: 'python',
          title: "demo_tests_evals_redteam_perf.py",
          code: `def p0_p1_clear(p0: int, p1: int) -> bool:
    return p0 + p1 == 0

print("tests", p0_p1_clear(0, 0))
print("redteam", True)
print("perf_budget", True)`,
          output: `tests True
redteam True
perf_budget True`,
        },
        why: "Hace observable `tests/evals/red team y performance` con un caso local pequeño y deja como evidencia matriz de verificación sin P0/P1; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S52-T3-B-DEMO",
        subtopicId: "S52-T3-B",
        environment: "local-python",
        description: "Demo: SLO, backup, rollback y disaster exercise",
        code: {
          language: 'python',
          title: "demo_slo_backup_rollback_disaster.py",
          code: `def disaster_ok(tabletop: bool) -> bool:
    return tabletop

print("backup", True)
print("rollback", True)
print("disaster_exercise", disaster_ok(True))`,
          output: `backup True
rollback True
disaster_exercise True`,
        },
        why: "Hace observable `SLO, backup, rollback y disaster exercise` con un caso local pequeño y deja como evidencia RPO/RTO y restauración demostrados; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S52-T4-A-DEMO",
        subtopicId: "S52-T4-A",
        environment: "local-python",
        description: "Demo: demo y narrativa CV",
        code: {
          language: 'python',
          title: "demo_demo_cv_narrative.py",
          code: `def metrics_first() -> bool:
    return True

print("demo_ok", True)
print("cv", True)
print("metrics_first", metrics_first())`,
          output: `demo_ok True
cv True
metrics_first True`,
        },
        why: "Hace observable `demo y narrativa CV` con un caso local pequeño y deja como evidencia demo reproducible con antes/después; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S52-T4-B-DEMO",
        subtopicId: "S52-T4-B",
        environment: "local-python",
        description: "Demo: arquitectura, READMEs, cards, licencia, video y defensa",
        code: {
          language: 'python',
          title: "demo_arch_readme_cards_license_video_defense.py",
          code: `def artifact_count() -> int:
    return 6

print("artifacts", artifact_count())
print("license", True)
print("defense", True)`,
          output: `artifacts 6
license True
defense True`,
        },
        why: "Hace observable `arquitectura, READMEs, cards, licencia, video y defensa` con un caso local pequeño y deja como evidencia evidence bundle completo y verificable; el demo modela el contrato, no un servicio externo.",
      },
    ],
  },
  weDo: {
    intro: "S52 · Laboratorio Enterprise Relationship & Operations Intelligence Platform final: 24 retos locales. E1 repara una operación de dominio, E2 separa valid/invalid/missing y E3 demuestra recuperación fail-closed con ocho fixtures peruanos sintéticos distintos.",
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
        edgeCases: ["falta baseline_frozen", "fixture adverso: stakeholders/jobs/métricas y baseline revalidados", "CASO-PER-052-1A es sintético"],
        tests: "El fixture `CASO-PER-052-1A` satisface un predicado de dominio real; imprime `S52-T1-A PASS` y el assert booleano pasa.",
        feedback: "S52-T1-A-E1: explica qué campo cambió la decisión, por qué el adverso activa REOPEN_CF1 y por qué faltar baseline_frozen exige INTERVIEW_STAKEHOLDER.",
        starterCode: {
          language: 'python',
          title: "s52-t1-a-e1.py",
          code: `# CASO-LIM-052 · CF-1 stakeholders/jobs
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
        edgeCases: ["falta baseline_frozen", "fixture adverso: stakeholders/jobs/métricas y baseline revalidados", "CASO-PER-052-1A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `baseline_frozen` ausente y produce exactamente `PASS REOPEN_CF1 MISSING:baseline_frozen`.",
        feedback: "S52-T1-A-E2: explica qué campo cambió la decisión, por qué el adverso activa REOPEN_CF1 y por qué faltar baseline_frozen exige INTERVIEW_STAKEHOLDER.",
        starterCode: {
          language: 'python',
          title: "s52-t1-a-e2.py",
          code: `# CASO-LIM-052 · assess CF-1 completeness
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
        edgeCases: ["falta baseline_frozen", "fixture adverso: stakeholders/jobs/métricas y baseline revalidados", "CASO-PER-052-1A es sintético"],
        tests: "Fixtures `CASO-PER-052-1A`, adverso y sin `baseline_frozen` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S52-T1-A-E3: explica qué campo cambió la decisión, por qué el adverso activa REOPEN_CF1 y por qué faltar baseline_frozen exige INTERVIEW_STAKEHOLDER.",
        starterCode: {
          language: 'python',
          title: "s52-t1-a-e3.py",
          code: `# CASO-LIM-052 · decide reopen CF-1
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
        edgeCases: ["falta residual_risk_accepted", "fixture adverso: constraints, riesgos con owner y no-go explícitos", "CASO-PER-052-1B es sintético"],
        tests: "El fixture `CASO-PER-052-1B` satisface un predicado de dominio real; imprime `S52-T1-B PASS` y el assert booleano pasa.",
        feedback: "S52-T1-B-E1: explica qué campo cambió la decisión, por qué el adverso activa DECLARE_NO_GO y por qué faltar residual_risk_accepted exige INDEPENDENT_RISK_REVIEW.",
        starterCode: {
          language: 'python',
          title: "s52-t1-b-e1.py",
          code: `# CASO-LIM-052 · risk/no-go constraints
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
        edgeCases: ["falta residual_risk_accepted", "fixture adverso: constraints, riesgos con owner y no-go explícitos", "CASO-PER-052-1B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `residual_risk_accepted` ausente y produce exactamente `PASS DECLARE_NO_GO MISSING:residual_risk_accepted`.",
        feedback: "S52-T1-B-E2: explica qué campo cambió la decisión, por qué el adverso activa DECLARE_NO_GO y por qué faltar residual_risk_accepted exige INDEPENDENT_RISK_REVIEW.",
        starterCode: {
          language: 'python',
          title: "s52-t1-b-e2.py",
          code: `# CASO-LIM-052 · assess risk register
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
        edgeCases: ["falta residual_risk_accepted", "fixture adverso: constraints, riesgos con owner y no-go explícitos", "CASO-PER-052-1B es sintético"],
        tests: "Fixtures `CASO-PER-052-1B`, adverso y sin `residual_risk_accepted` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S52-T1-B-E3: explica qué campo cambió la decisión, por qué el adverso activa DECLARE_NO_GO y por qué faltar residual_risk_accepted exige INDEPENDENT_RISK_REVIEW.",
        starterCode: {
          language: 'python',
          title: "s52-t1-b-e3.py",
          code: `# CASO-LIM-052 · decide restore risk evidence
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
        instruction: "S52-T2-A-E1 · Filtra el contrato de `bounded contexts, APIs y eventos` sobre `CASO-PER-052-2A`. La entrada es el dict completo del starter; la operación debe demostrar cinco contexts, contratos versionados y sin DB compartida. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S52-T2-A PASS`; la misma operación sobre el fixture adverso debe activar `STOP_INTEGRATION_RELEASE` en E2.",
        hint: "Relaciona los campos `contexts`, `apis_versioned`, `events_versioned`, `shared_database`, `contract_tests` con la regla explicada en S52-T2-A.",
        hints: [
          "Relaciona los campos `contexts`, `apis_versioned`, `events_versioned`, `shared_database`, `contract_tests` con la regla explicada en S52-T2-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva contract tests end-to-end; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta contract_tests", "fixture adverso: cinco contexts, contratos versionados y sin DB compartida", "CASO-PER-052-2A es sintético"],
        tests: "El fixture `CASO-PER-052-2A` satisface un predicado de dominio real; imprime `S52-T2-A PASS` y el assert booleano pasa.",
        feedback: "S52-T2-A-E1: explica qué campo cambió la decisión, por qué el adverso activa STOP_INTEGRATION_RELEASE y por qué faltar contract_tests exige MAP_BOUNDED_CONTEXTS.",
        starterCode: {
          language: 'python',
          title: "s52-t2-a-e1.py",
          code: `# CASO-LIM-052 · multi-context architecture
# DEFECT: contexts/versionado/shared_db invertidos
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-PER-052-2A", **{"contexts":{"intake","er","triage","reporting","copilot"},"apis_versioned":True,"events_versioned":True,"shared_database":False,"contract_tests":12}}
meets_contract = record["shared_database"] or not record["apis_versioned"]
status = "PASS" if meets_contract else "STOP_INTEGRATION_RELEASE"
print("S52-T2-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s52-t2-a-e1.py",
          code: `record = {"case_id": "CASO-PER-052-2A", **{"contexts":{"intake","er","triage","reporting","copilot"},"apis_versioned":True,"events_versioned":True,"shared_database":False,"contract_tests":12}}
meets_contract = {"intake","er","triage","reporting","copilot"} <= record["contexts"] and record["apis_versioned"] and record["events_versioned"] and not record["shared_database"] and record["contract_tests"] >= 10
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
          "Después aplica la regla de S52-T2-A: cinco contexts, contratos versionados y sin DB compartida. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta contract_tests", "fixture adverso: cinco contexts, contratos versionados y sin DB compartida", "CASO-PER-052-2A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `contract_tests` ausente y produce exactamente `PASS STOP_INTEGRATION_RELEASE MISSING:contract_tests`.",
        feedback: "S52-T2-A-E2: explica qué campo cambió la decisión, por qué el adverso activa STOP_INTEGRATION_RELEASE y por qué faltar contract_tests exige MAP_BOUNDED_CONTEXTS.",
        starterCode: {
          language: 'python',
          title: "s52-t2-a-e2.py",
          code: `# CASO-LIM-052 · assess architecture contracts
# DEFECT: PASS con shared_database o sin contract_tests
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "contexts", "apis_versioned", "events_versioned", "shared_database", "contract_tests"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["shared_database"] or not record["apis_versioned"] else "STOP_INTEGRATION_RELEASE"

valid = {"case_id": "CASO-PER-052-2A", **{"contexts":{"intake","er","triage","reporting","copilot"},"apis_versioned":True,"events_versioned":True,"shared_database":False,"contract_tests":12}}
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
    return "PASS" if {"intake","er","triage","reporting","copilot"} <= record["contexts"] and record["apis_versioned"] and record["events_versioned"] and not record["shared_database"] and record["contract_tests"] >= 10 else "STOP_INTEGRATION_RELEASE"

valid = {"case_id": "CASO-PER-052-2A", **{"contexts":{"intake","er","triage","reporting","copilot"},"apis_versioned":True,"events_versioned":True,"shared_database":False,"contract_tests":12}}
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
          "Para datos completos reutiliza la regla que demostró cinco contexts, contratos versionados y sin DB compartida; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta contract_tests", "fixture adverso: cinco contexts, contratos versionados y sin DB compartida", "CASO-PER-052-2A es sintético"],
        tests: "Fixtures `CASO-PER-052-2A`, adverso y sin `contract_tests` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S52-T2-A-E3: explica qué campo cambió la decisión, por qué el adverso activa STOP_INTEGRATION_RELEASE y por qué faltar contract_tests exige MAP_BOUNDED_CONTEXTS.",
        starterCode: {
          language: 'python',
          title: "s52-t2-a-e3.py",
          code: `# CASO-LIM-052 · decide restore arch evidence
# DEFECT: missing→CONTINUE
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "contexts", "apis_versioned", "events_versioned", "shared_database", "contract_tests"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["shared_database"] or not record["apis_versioned"] else "STOP_INTEGRATION_RELEASE"

valid = {"case_id": "CASO-PER-052-2A", **{"contexts":{"intake","er","triage","reporting","copilot"},"apis_versioned":True,"events_versioned":True,"shared_database":False,"contract_tests":12}}
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
    return "CONTINUE" if {"intake","er","triage","reporting","copilot"} <= record["contexts"] and record["apis_versioned"] and record["events_versioned"] and not record["shared_database"] and record["contract_tests"] >= 10 else "STOP_INTEGRATION_RELEASE"

valid = {"case_id": "CASO-PER-052-2A", **{"contexts":{"intake","er","triage","reporting","copilot"},"apis_versioned":True,"events_versioned":True,"shared_database":False,"contract_tests":12}}
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
        instruction: "S52-T2-B-E1 · Modela el contrato de `datos, modelos, RPA, RAG y human workflow` sobre `CASO-PER-052-2B`. La entrada es el dict completo del starter; la operación debe demostrar ER/triage/RPA/RAG apoyan y persona decide. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S52-T2-B PASS`; la misma operación sobre el fixture adverso debe activar `BLOCK_AUTOMATED_RISK_DECISION` en E2.",
        hint: "Relaciona los campos `er_proposes_match`, `triage_prioritizes`, `rpa_prepares_draft`, `rag_cites`, `human_decides`, `infers_fraud` con la regla explicada en S52-T2-B.",
        hints: [
          "Relaciona los campos `er_proposes_match`, `triage_prioritizes`, `rpa_prepares_draft`, `rag_cites`, `human_decides`, `infers_fraud` con la regla explicada en S52-T2-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva decisión sensible conserva revisión humana; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta infers_fraud", "fixture adverso: ER/triage/RPA/RAG apoyan y persona decide", "CASO-PER-052-2B es sintético"],
        tests: "El fixture `CASO-PER-052-2B` satisface un predicado de dominio real; imprime `S52-T2-B PASS` y el assert booleano pasa.",
        feedback: "S52-T2-B-E1: explica qué campo cambió la decisión, por qué el adverso activa BLOCK_AUTOMATED_RISK_DECISION y por qué faltar infers_fraud exige REQUEST_HUMAN_REVIEW.",
        starterCode: {
          language: 'python',
          title: "s52-t2-b-e1.py",
          code: `# CASO-LIM-052 · human-decides AI chain
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
        edgeCases: ["falta infers_fraud", "fixture adverso: ER/triage/RPA/RAG apoyan y persona decide", "CASO-PER-052-2B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `infers_fraud` ausente y produce exactamente `PASS BLOCK_AUTOMATED_RISK_DECISION MISSING:infers_fraud`.",
        feedback: "S52-T2-B-E2: explica qué campo cambió la decisión, por qué el adverso activa BLOCK_AUTOMATED_RISK_DECISION y por qué faltar infers_fraud exige REQUEST_HUMAN_REVIEW.",
        starterCode: {
          language: 'python',
          title: "s52-t2-b-e2.py",
          code: `# CASO-LIM-052 · assess propose-not-decide
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
          "Para datos completos reutiliza la regla que demostró ER/triage/RPA/RAG apoyan y persona decide; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta infers_fraud", "fixture adverso: ER/triage/RPA/RAG apoyan y persona decide", "CASO-PER-052-2B es sintético"],
        tests: "Fixtures `CASO-PER-052-2B`, adverso y sin `infers_fraud` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S52-T2-B-E3: explica qué campo cambió la decisión, por qué el adverso activa BLOCK_AUTOMATED_RISK_DECISION y por qué faltar infers_fraud exige REQUEST_HUMAN_REVIEW.",
        starterCode: {
          language: 'python',
          title: "s52-t2-b-e3.py",
          code: `# CASO-LIM-052 · decide restore AI limits
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
        edgeCases: ["falta open_p1", "fixture adverso: seis capas de verificación y cero P0/P1", "CASO-PER-052-3A es sintético"],
        tests: "El fixture `CASO-PER-052-3A` satisface un predicado de dominio real; imprime `S52-T3-A PASS` y el assert booleano pasa.",
        feedback: "S52-T3-A-E1: explica qué campo cambió la decisión, por qué el adverso activa BLOCK_FINAL_ON_P0_P1 y por qué faltar open_p1 exige FIX_AND_RERUN_REGRESSION.",
        starterCode: {
          language: 'python',
          title: "s52-t3-a-e1.py",
          code: `# CASO-LIM-052 · test pyramid + red team
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
        edgeCases: ["falta open_p1", "fixture adverso: seis capas de verificación y cero P0/P1", "CASO-PER-052-3A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `open_p1` ausente y produce exactamente `PASS BLOCK_FINAL_ON_P0_P1 MISSING:open_p1`.",
        feedback: "S52-T3-A-E2: explica qué campo cambió la decisión, por qué el adverso activa BLOCK_FINAL_ON_P0_P1 y por qué faltar open_p1 exige FIX_AND_RERUN_REGRESSION.",
        starterCode: {
          language: 'python',
          title: "s52-t3-a-e2.py",
          code: `# CASO-LIM-052 · assess quality gates open P0/P1
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
        edgeCases: ["falta open_p1", "fixture adverso: seis capas de verificación y cero P0/P1", "CASO-PER-052-3A es sintético"],
        tests: "Fixtures `CASO-PER-052-3A`, adverso y sin `open_p1` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S52-T3-A-E3: explica qué campo cambió la decisión, por qué el adverso activa BLOCK_FINAL_ON_P0_P1 y por qué faltar open_p1 exige FIX_AND_RERUN_REGRESSION.",
        starterCode: {
          language: 'python',
          title: "s52-t3-a-e3.py",
          code: `# CASO-LIM-052 · decide restore quality evidence
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
        edgeCases: ["falta disaster_exercise", "fixture adverso: SLO/RPO/RTO y disaster drill aprobados", "CASO-PER-052-3B es sintético"],
        tests: "El fixture `CASO-PER-052-3B` satisface un predicado de dominio real; imprime `S52-T3-B PASS` y el assert booleano pasa.",
        feedback: "S52-T3-B-E1: explica qué campo cambió la decisión, por qué el adverso activa NO_GO_RESILIENCE y por qué faltar disaster_exercise exige RUN_DISASTER_EXERCISE.",
        starterCode: {
          language: 'python',
          title: "s52-t3-b-e1.py",
          code: `# CASO-LIM-052 · availability/RPO/RTO gate
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
        edgeCases: ["falta disaster_exercise", "fixture adverso: SLO/RPO/RTO y disaster drill aprobados", "CASO-PER-052-3B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `disaster_exercise` ausente y produce exactamente `PASS NO_GO_RESILIENCE MISSING:disaster_exercise`.",
        feedback: "S52-T3-B-E2: explica qué campo cambió la decisión, por qué el adverso activa NO_GO_RESILIENCE y por qué faltar disaster_exercise exige RUN_DISASTER_EXERCISE.",
        starterCode: {
          language: 'python',
          title: "s52-t3-b-e2.py",
          code: `# CASO-LIM-052 · assess DR evidence
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
        edgeCases: ["falta disaster_exercise", "fixture adverso: SLO/RPO/RTO y disaster drill aprobados", "CASO-PER-052-3B es sintético"],
        tests: "Fixtures `CASO-PER-052-3B`, adverso y sin `disaster_exercise` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S52-T3-B-E3: explica qué campo cambió la decisión, por qué el adverso activa NO_GO_RESILIENCE y por qué faltar disaster_exercise exige RUN_DISASTER_EXERCISE.",
        starterCode: {
          language: 'python',
          title: "s52-t3-b-e3.py",
          code: `# CASO-LIM-052 · decide restore DR evidence
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
        instruction: "S52-T4-A-E1 · Audita el contrato de `demo y narrativa CV` sobre `CASO-PER-052-4A`. La entrada es el dict completo del starter; la operación debe demostrar mejora vs baseline sintético y narrativa atribuible. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S52-T4-A PASS`; la misma operación sobre el fixture adverso debe activar `REJECT_UNSUPPORTED_PORTFOLIO_CLAIM` en E2.",
        hint: "Relaciona los campos `baseline_ttr_min`, `result_ttr_min`, `benchmark_synthetic`, `demo_minutes`, `cv_claims_sourced`, `personal_contribution` con la regla explicada en S52-T4-A.",
        hints: [
          "Relaciona los campos `baseline_ttr_min`, `result_ttr_min`, `benchmark_synthetic`, `demo_minutes`, `cv_claims_sourced`, `personal_contribution` con la regla explicada en S52-T4-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva demo reproducible con antes/después; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta personal_contribution", "fixture adverso: mejora vs baseline sintético y narrativa atribuible", "CASO-PER-052-4A es sintético"],
        tests: "El fixture `CASO-PER-052-4A` satisface un predicado de dominio real; imprime `S52-T4-A PASS` y el assert booleano pasa.",
        feedback: "S52-T4-A-E1: explica qué campo cambió la decisión, por qué el adverso activa REJECT_UNSUPPORTED_PORTFOLIO_CLAIM y por qué faltar personal_contribution exige RECORD_PERSONAL_CONTRIBUTION.",
        starterCode: {
          language: 'python',
          title: "s52-t4-a-e1.py",
          code: `# CASO-LIM-052 · portfolio TTR claim
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
        instruction: "S52-T4-A-E2 · Compara tres rutas de `demo y narrativa CV`: fixture válido, fixture adverso y registro sin `personal_contribution`. Entrada: dict con case_id, baseline_ttr_min, result_ttr_min, benchmark_synthetic, demo_minutes, cv_claims_sourced, personal_contribution. Salidas exactas: `PASS`, `REJECT_UNSUPPORTED_PORTFOLIO_CLAIM`, `MISSING:personal_contribution`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a personal_contribution debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a personal_contribution debe ocurrir antes de esa rama.",
          "Después aplica la regla de S52-T4-A: mejora vs baseline sintético y narrativa atribuible. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta personal_contribution", "fixture adverso: mejora vs baseline sintético y narrativa atribuible", "CASO-PER-052-4A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `personal_contribution` ausente y produce exactamente `PASS REJECT_UNSUPPORTED_PORTFOLIO_CLAIM MISSING:personal_contribution`.",
        feedback: "S52-T4-A-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_UNSUPPORTED_PORTFOLIO_CLAIM y por qué faltar personal_contribution exige RECORD_PERSONAL_CONTRIBUTION.",
        starterCode: {
          language: 'python',
          title: "s52-t4-a-e2.py",
          code: `# CASO-LIM-052 · assess portfolio honesty
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
        instruction: "S52-T4-A-E3 · Aísla fallo cerrado para `demo y narrativa CV` con tres fixtures distintos. `CASO-PER-052-4A` debe continuar, el adverso debe devolver `REJECT_UNSUPPORTED_PORTFOLIO_CLAIM` y la ausencia de `personal_contribution` debe devolver `RECORD_PERSONAL_CONTRIBUTION`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `RECORD_PERSONAL_CONTRIBUTION` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `RECORD_PERSONAL_CONTRIBUTION` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró mejora vs baseline sintético y narrativa atribuible; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta personal_contribution", "fixture adverso: mejora vs baseline sintético y narrativa atribuible", "CASO-PER-052-4A es sintético"],
        tests: "Fixtures `CASO-PER-052-4A`, adverso y sin `personal_contribution` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S52-T4-A-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_UNSUPPORTED_PORTFOLIO_CLAIM y por qué faltar personal_contribution exige RECORD_PERSONAL_CONTRIBUTION.",
        starterCode: {
          language: 'python',
          title: "s52-t4-a-e3.py",
          code: `# CASO-LIM-052 · decide record contribution
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
        edgeCases: ["falta cpn4c_independent", "fixture adverso: ocho artefactos, ejecución, trade-offs y rúbrica independiente", "CASO-PER-052-4B es sintético"],
        tests: "El fixture `CASO-PER-052-4B` satisface un predicado de dominio real; imprime `S52-T4-B PASS` y el assert booleano pasa.",
        feedback: "S52-T4-B-E1: explica qué campo cambió la decisión, por qué el adverso activa BLOCK_INCOMPLETE_EVIDENCE_BUNDLE y por qué faltar cpn4c_independent exige SCHEDULE_TECHNICAL_DEFENSE.",
        starterCode: {
          language: 'python',
          title: "s52-t4-b-e1.py",
          code: `# CASO-LIM-052 · evidence bundle CP-FINAL
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
        edgeCases: ["falta cpn4c_independent", "fixture adverso: ocho artefactos, ejecución, trade-offs y rúbrica independiente", "CASO-PER-052-4B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `cpn4c_independent` ausente y produce exactamente `PASS BLOCK_INCOMPLETE_EVIDENCE_BUNDLE MISSING:cpn4c_independent`.",
        feedback: "S52-T4-B-E2: explica qué campo cambió la decisión, por qué el adverso activa BLOCK_INCOMPLETE_EVIDENCE_BUNDLE y por qué faltar cpn4c_independent exige SCHEDULE_TECHNICAL_DEFENSE.",
        starterCode: {
          language: 'python',
          title: "s52-t4-b-e2.py",
          code: `# CASO-LIM-052 · assess final evidence set
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
        edgeCases: ["falta cpn4c_independent", "fixture adverso: ocho artefactos, ejecución, trade-offs y rúbrica independiente", "CASO-PER-052-4B es sintético"],
        tests: "Fixtures `CASO-PER-052-4B`, adverso y sin `cpn4c_independent` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S52-T4-B-E3: explica qué campo cambió la decisión, por qué el adverso activa BLOCK_INCOMPLETE_EVIDENCE_BUNDLE y por qué faltar cpn4c_independent exige SCHEDULE_TECHNICAL_DEFENSE.",
        starterCode: {
          language: 'python',
          title: "s52-t4-b-e3.py",
          code: `# CASO-LIM-052 · decide schedule defense
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
    title: "[FINAL] Enterprise Relationship & Operations Intelligence Platform: capstone final (CP-FINAL exclusivamente)",
    context: "Enterprise Relationship & Operations Intelligence Platform final. Trabaja sobre la Enterprise Relationship & Operations Intelligence Platform con datos totalmente sintéticos de varias regiones del Perú. Entrada: artefactos congelados S1–S51, contratos, riesgos, no-go decisions y benchmark. Salida: producto reproducible, demo, evidencia técnica y defensa de trade-offs. El gate se bloquea ante: P0/P1, PII, dependencia no reproducible, rollback no probado o afirmación sin evidencia bloquea graduación.",
    objectives: [
      "Convertir artefactos congelados S1–S51, contratos, riesgos, no-go decisions y benchmark en producto reproducible, demo, evidencia técnica y defensa de trade-offs.",
      "Demostrar el gate: 52/52, 12/12 capstones, CP-FINAL y regresión completa pasan sin compensar CP-N4-C.",
      "Probar el fallo: P0/P1, PII, dependencia no reproducible, rollback no probado o afirmación sin evidencia bloquea graduación.",
      "Entregar evidencia reproducible, redactada, sin PII real, secretos ni servicios externos obligatorios.",
    ],
    requirements: [
      "Usa exclusivamente fixtures sintéticos identificados por `CASO-PER-052`.",
      "Incluye arquitectura integrada con APIs/eventos/human workflow.",
      "Incluye tests/evals/red team/performance y benchmark antes/después.",
      "Incluye SLO, backup, rollback y disaster exercise.",
      "Incluye README, ADRs, cards, licencia, demo y defensa con contribución personal.",
      "Automatiza un caso normal, uno de breach (`NO_GO_RELEASE`) y uno incierto (`INDEPENDENT_REVIEW`).",
      "Incluye comandos locales reproducibles, dependencias fijadas y salida esperada.",
      "Registra riesgo residual, responsable, criterio de rollback y limitaciones conocidas.",
    ],
    starterCode: `CASE_ID = "CASO-PER-052"
REQUIRED = ['arquitectura_integrada_con_apis_eventos_human_workflow', 'tests_evals_red_team_performance_y_benchmark_antes_despues', 'slo_backup_rollback_y_disaster_exercise', 'readme_adrs_cards_licencia_demo_y_defensa_con_contribucion_perso']
evidence = {
    "arquitectura_integrada_con_apis_eventos_human_workflow": False,
    "tests_evals_red_team_performance_y_benchmark_antes_despues": False,
    "slo_backup_rollback_y_disaster_exercise": False,
    "readme_adrs_cards_licencia_demo_y_defensa_con_contribucion_perso": False
}

def readiness(bundle: dict[str, bool]) -> tuple[str, list[str]]:
    missing = [name for name in REQUIRED if bundle.get(name) is not True]
    return ("READY", []) if not missing else ("BLOCKED", missing)

status, missing = readiness(evidence)
print(CASE_ID, status)
print("missing", ",".join(missing))
assert status in {"READY", "BLOCKED"}
`,
    portfolioNote: "Evidencia de CP-FINAL · plataforma integral defendible: muestra baseline, decisión, pruebas, resultado medido, rollback y riesgo residual. El checklist inicia en BLOCKED por diseño; conviértelo en READY enlazando artefactos reales del proyecto, no cambiando asserts.",
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
        question: "¿Qué evidencia permite aprobar `stakeholders, jobs y success metrics de CF-1` en CASO-PER-052?",
        options: ["un print sin assert ni versión", "una captura de pantalla sin fuente", "datos personales reales para que parezca auténtico", "matriz stakeholder/job/métrica con evidencia"],
        correctIndex: 3,
        explanation: "La teoría exige matriz stakeholder/job/métrica con evidencia; evidencia decorativa o PII no satisface el contrato.",
      },
      {
        question: "Si ocurre la condición de error de S52, ¿qué respuesta preserva seguridad y auditabilidad?",
        options: ["continuar y ocultar el warning", "emitir NO_GO_RELEASE y conservar evidencia", "inventar evidencia faltante", "borrar el trace para reducir ruido"],
        correctIndex: 1,
        explanation: "El contrato falla cerrado con NO_GO_RELEASE; no convierte incertidumbre o breach en éxito.",
      },
      {
        question: "¿Cuál resultado demuestra el gate `CP-FINAL · plataforma integral defendible`?",
        options: ["el archivo S52 existe, aunque no pruebe el gate", "el README afirma que funciona", "52/52, 12/12 capstones, CP-FINAL y regresión completa pasan sin compensar CP-N4-C", "se usó la herramienta más nueva"],
        correctIndex: 2,
        explanation: "El gate es conductual y medible: 52/52, 12/12 capstones, CP-FINAL y regresión completa pasan sin compensar CP-N4-C.",
      },
      {
        question: "¿Qué tratamiento de `CASO-PER-052` respeta el alcance del curso?",
        options: ["mantenerlo sintético, mínimo, trazable y sujeto a revisión humana", "reemplazarlo por datos reales sin consentimiento", "subir secretos para facilitar la demo", "inferir fraude o parentesco desde ER"],
        correctIndex: 0,
        explanation: "Los casos son sintéticos; ER solo propone correspondencia de entidad y no prueba fraude, parentesco ni riesgo.",
      },
      {
        question: "En el capstone CP-FINAL, un claim de mejora de TTR sin baseline congelado ni contribución personal documentada, ¿qué corresponde?",
        options: ["Aprobar el portfolio porque el demo duró menos de 10 minutos", "Publicar el DNI de stakeholders para “auditar”", "Omitir model card y LICENSE si el video es convincente", "REJECT_UNSUPPORTED_PORTFOLIO_CLAIM o REOPEN hasta evidencia reproducible y contribución personal"],
        correctIndex: 3,
        explanation:
          "CF/CP-FINAL exige baseline, claims sourced, contribución personal y bundle de evidencia; sin eso se rechaza o se reabre, no se aprueba por teatro de demo.",
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
        note: "Defensa visual de arquitectura",
      },
      {
        label: "Architecture Decision Records",
        url: "https://adr.github.io/",
        note: "ADRs y decisiones defendibles",
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
        note: "Licencia abierta del portfolio",
      },
      {
        label: "SRE — Disaster Recovery",
        url: "https://sre.google/sre-book/disaster-recovery/",
        note: "RPO/RTO y drills",
      },
      {
        label: "learning_roadmap_52_V3 (repo)",
        url: "https://github.com/PillB/pyarcana",
        note: "CP-FINAL y regresión total S1–S52",
      },
    ],
    books: [
      { label: "Designing Data-Intensive Applications", note: "Arquitectura defendible" },
      { label: "Site Reliability Engineering", note: "SLO, backup y disaster drills" },
    ],
    courses: [
      { label: "Stanford system design / portfolio practice", url: "https://web.stanford.edu/", note: "Defensa de trade-offs" },
      { label: "MIT 6.100L", url: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/", note: "Contratos verificables" },
      { label: "Harvard CS50P", url: "https://cs50.harvard.edu/python/", note: "Tests y proyectos reproducibles" },
      { label: "Coursera — system design / portfolio", url: "https://www.coursera.org/courses?query=system%20design", note: "Narrativa y trade-offs" },
    ],
  },
}
