import type { CourseSection } from '../../types'

export const section51: CourseSection = {
  id: "integrator-final",
  index: 51,
  title: "Observabilidad, gobernanza y UX del copiloto",
  shortTitle: "Obs y UX copiloto",
  tagline: "Auditable AI Operations Copilot con system card y dashboard; CF-5 congela artefactos e interfaces",
  estimatedHours: 20,
  level: "Master",
  phase: 3,
  icon: "Crown",
  accentColor: "bg-gradient-to-br from-amber-500 to-red-600",
  jobRelevance:
    "En equipos de plataforma y producto, observabilidad, gobernanza y ux del copiloto conecta decisiones técnicas con evidencia operativa. La práctica entrega dashboard redactado, SLO, audit trail y mecanismo de corrección o apelación y se promueve solo cuando se puede reconstruir qué respondió, qué citó, qué tool llamó, quién aprobó y cómo revertir.",
  learningOutcomes: [
    { text: "Traza prompts, retrieval y tools" },
    { text: "Mide tokens/costo/latency con redacción" },
    { text: "Registra modelo/prompt/dataset" },
    { text: "Controla cambios, acceso y auditoría" },
    { text: "Opera SLO, feedback y drift" },
    { text: "Responde incidentes y postmortems" },
    { text: "Muestra incertidumbre, citas y confirmaciones" },
    { text: "Diseña a11y, corrección y contestabilidad" },
  ],
  theory: [
    {
      heading: "Ruta de S51: Observabilidad, gobernanza y UX del copiloto",
      paragraphs: [
        "**Diccionario de la sección** (léelo antes de T1). **Trace:** correlación prompt/retrieval/tool/respuesta con versiones. **Redacción:** PII fuera de logs exportables. **Tokens/costo/latency:** SLI del copiloto. **Registro de artefactos:** modelo, prompt, dataset versionados. **Audit trail:** quién aprobó qué. **Drift/feedback:** señales de desalineación. **Postmortem blameless:** aprendizaje sin culpas. **Contestabilidad:** corrección y apelación del usuario. **CF-5:** congela interfaces y artefactos para integración final. **a11y:** accesibilidad (WCAG) del UI del copiloto.",
        "Esta sección parte de S50 (evals/red team) y opera el **copiloto en producción controlada**: traces, registry, SLO/incidentes y UX contestable. El caso `CASO-MOQ-051` (Moquegua sintético) es sintético y puede ejecutarse sin credenciales ni servicios externos.",
        "Producto incremental: **Auditable AI Operations Copilot** y freeze **CF-5**. Entrada: trace id, versiones de prompt/modelo/dataset, evidencia, feedback y política. Salida: dashboard **redactado**, SLO con owner, audit trail append-only y mecanismo de corrección/apelación. Error: PII en sink o release sin pin de versiones.",
        "Orden: T1 traces/redacción → T2 registry/auditoría → T3 SLO/incidentes → T4 UX contestable y a11y. Teoría medible, iDo con helpers, weDo con **DEFECT** de ops/UX por ejercicio. Id legacy `integrator-final` cierra N4; V3 es observabilidad+gobernanza+UX del copiloto (no capstone genérico). Stack: **stdlib** sin telemetría real de PII.",
      ],
      code: {
        language: 'python',
        title: "s51_map_contract.py",
        code: `def section_contract():
    return {
        "case": "CASO-MOQ-051",
        "gates": ["reconstructable_trace", "redacted_exports", "slo_and_rollback", "contestability"],
        "cf5_freeze": True,
        "raw_pii_in_logs_ok": False,
    }

c = section_contract()
print("case", c["case"])
print("cf5_freeze", c["cf5_freeze"])
print("raw_pii_in_logs_ok", c["raw_pii_in_logs_ok"])
`,
        output: `case CASO-MOQ-051
cf5_freeze True
raw_pii_in_logs_ok False`,
      },
      callout: {
        type: "info",
        title: "Gate de promoción",
        content: "CP-N4-C + CF-5 · copiloto observable y contestable: se puede reconstruir qué respondió, qué citó, qué tool llamó, quién aprobó y cómo revertir. Si falta evidencia, no se promociona.",
      },
    },
    {
      heading: "traces de prompts/retrieval/tools",
      subtopicId: "S51-T1-A",
      paragraphs: [
        "Un **trace** correlaciona **prompt template**, **retrieval**, **tool calls** y **respuesta** con **versiones** (prompt/modelo/índice). Sin correlación no hay auditoría: no se puede reconstruir «qué se citó y qué tool se llamó». **Redacta PII/secrets antes** de exportar a backends de observabilidad; raw logs con datos personales son incidente, no «detalle de ops».",
        "Contrato de reconstrucción. Entrada: prompt_ver, cites y tool. Salida: triple reconstruible (`p3`, `[c1]`, `get_case`). Error: exportar raw PII, omitir tool call o perder version pin. Criterio: CF-5 exige auditar cada decisión del copiloto Moquegua sintético sin secretos en el sink.",
        "Aplicación a `CASO-MOQ-051-T1A`: `trace_spans` fija el mínimo de evidencia (prompt, cites, tool). Sin secretos en logs; redaction es parte del contrato, no un filtro opcional.",
      ],
      code: {
        language: 'python',
        title: "traces_prompts_retrieval_tools.py",
        code: `def trace_spans(prompt_ver: str, cites: list, tool: str) -> tuple:
    return prompt_ver, cites, tool

p, cites, tool = trace_spans("p3", ["c1"], "get_case")
print(p)
print(cites)
print(tool)`,
        output: `p3
['c1']
get_case`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Evidencia mínima de S51-T1-A: trace reconstruible sin PII. Si falta, responde `REDACT_AND_QUARANTINE_TRACE`; si no alcanza para decidir, `RESTORE_TRACE_CONTEXT`.",
      },
    },
    {
      heading: "tokens, costo, latency y redacción",
      subtopicId: "S51-T1-B",
      paragraphs: [
        "**Tokens, costo y latencia** se miden **por etapa** (prompt build, retrieval, generation, tools) y por **percentil** (p50/p95), no solo media. **Redacción** aplica a atributos, eventos, payloads y mensajes de error: un stack trace con email o token es PII en el sink. Dashboard de CF-5 exige prueba de redacción, no solo charts bonitos.",
        "Contrato operativo. Entrada: trace id, versiones de prompt/modelo/dataset, evidencia, feedback y política. Salida de este subtema: dashboard por etapa con prueba de redacción. Error: PII en trace, versión desconocida, drift o acción irreversible activa incidente y rollback. Criterio de éxito: se puede reconstruir qué respondió, qué citó, qué tool llamó, quién aprobó y cómo revertir.",
        "Aplicación de `tokens, costo, latency y redacción` al caso peruano sintético `CASO-MOQ-051`: operación sintética de un copiloto para una entidad ficticia en Moquegua. La evidencia esperada es dashboard por etapa con prueba de redacción. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "tokens_cost_latency_redaction.py",
        code: `def redact_email(s: str) -> str:
    if "@" in s:
        user, _ = s.split("@", 1)
        return user[:3] + "@[redacted]"
    return s

def cost_metrics(tokens: int, cost: float, latency_ms: int) -> dict:
    return {"tokens": tokens, "cost": cost, "latency_ms": latency_ms}

print(redact_email("ana@example.pe"))
print(cost_metrics(1200, 0.01, 900))
print("no_raw_pii", True)`,
        output: `ana@[redacted]
{'tokens': 1200, 'cost': 0.01, 'latency_ms': 900}
no_raw_pii True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Antes de promover S51-T1-B, audita dashboard por etapa con prueba de redacción. Un breach activa `ALERT_COST_LATENCY` y una ausencia activa `FIX_REDACTION_PIPELINE`.",
      },
    },
    {
      heading: "registro de modelo/prompt/dataset",
      subtopicId: "S51-T2-A",
      paragraphs: [
        "El **registry** identifica **modelo, prompt, dataset, índice y evaluador** con IDs inmutables; un **release** apunta a un **bundle versionado** (system card + eval digest), no a «latest». Responder en producción sin pin de versiones es drift silencioso: no se puede rollback ni reproducir el fallo del postmortem.",
        "Contrato operativo. Entrada: trace id, versiones de prompt/modelo/dataset, evidencia, feedback y política. Salida de este subtema: respuesta enlazada a bundle versionado. Error: PII en trace, versión desconocida, drift o acción irreversible activa incidente y rollback. Criterio de éxito: se puede reconstruir qué respondió, qué citó, qué tool llamó, quién aprobó y cómo revertir.",
        "Aplicación de `registro de modelo/prompt/dataset` al caso peruano sintético `CASO-MOQ-051`: operación sintética de un copiloto para una entidad ficticia en Moquegua. La evidencia esperada es respuesta enlazada a bundle versionado. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "registry_model_prompt_dataset.py",
        code: `def release_bundle(items: dict) -> list:
    return sorted(items.items())

print(release_bundle({"dataset": "eval-v4", "model": "m-2", "prompt": "p3"}))
print("immutable", True)
print("system_card_link", True)`,
        output: `[('dataset', 'eval-v4'), ('model', 'm-2'), ('prompt', 'p3')]
immutable True
system_card_link True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "La revisión de S51-T2-A conserva respuesta enlazada a bundle versionado; no conviertas `FREEZE_RELEASE_BUNDLE` ni `REGISTER_MISSING_VERSION` en éxito silencioso.",
      },
    },
    {
      heading: "cambio, acceso, retención y auditoría",
      subtopicId: "S51-T2-B",
      paragraphs: [
        "**Change control** registra autor, aprobador y riesgo residual antes de promover un bundle; **acceso y retención** son mínimos (need-to-know + TTL). El **audit log** es **append-only** para eventos de decisión, pero también se **depura** según política legal (retención ≠ eternidad de PII). Sin ambos, no hay gobernanza operable.",
        "Contrato operativo. Entrada: trace id, versiones de prompt/modelo/dataset, evidencia, feedback y política. Salida de este subtema: cambio y acceso auditables. Error: PII en trace, versión desconocida, drift o acción irreversible activa incidente y rollback. Criterio de éxito: se puede reconstruir qué respondió, qué citó, qué tool llamó, quién aprobó y cómo revertir.",
        "Aplicación de `cambio, acceso, retención y auditoría` al caso peruano sintético `CASO-MOQ-051`: operación sintética de un copiloto para una entidad ficticia en Moquegua. La evidencia esperada es cambio y acceso auditables. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "change_access_retention_audit.py",
        code: `def change_policy(retention_days: int) -> dict:
    return {"change": "rfc+approve", "retention_days": retention_days}

print(change_policy(180))
print("who_changed", "required")
print("cf5", "freeze_interfaces")`,
        output: `{'change': 'rfc+approve', 'retention_days': 180}
who_changed required
cf5 freeze_interfaces`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Contrato S51-T2-B: demuestra cambio y acceso auditables. Falla cerrada con `REJECT_UNGOVERNED_CHANGE` y deriva incertidumbre mediante `REQUEST_INDEPENDENT_APPROVAL`.",
      },
    },
    {
      heading: "SLO, feedback y drift",
      subtopicId: "S51-T3-A",
      paragraphs: [
        "El **SLO** del copiloto combina **disponibilidad**, **calidad** (eval score / abstain rate) y **latencia** con error budget. El **feedback** de usuarios es señal **sesgada** (quien se queja no es la población); **drift** exige slices, baseline y **dueño** antes de actuar — no reentrenar por un spike de thumbs-down.",
        "Contrato operativo. Entrada: trace id, versiones de prompt/modelo/dataset, evidencia, feedback y política. Salida de este subtema: alerta accionable con owner/runbook. Error: PII en trace, versión desconocida, drift o acción irreversible activa incidente y rollback. Criterio de éxito: se puede reconstruir qué respondió, qué citó, qué tool llamó, quién aprobó y cómo revertir.",
        "Aplicación de `SLO, feedback y drift` al caso peruano sintético `CASO-MOQ-051`: operación sintética de un copiloto para una entidad ficticia en Moquegua. La evidencia esperada es alerta accionable con owner/runbook. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "slo_feedback_drift.py",
        code: `def slo_avail(rate: float) -> dict:
    return {"availability": rate}

print(slo_avail(0.995))
print("drift_ok", True)
print("feedback", "thumbs+labels")`,
        output: `{'availability': 0.995}
drift_ok True
feedback thumbs+labels`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Para S51-T3-A, el artefacto comprobable es alerta accionable con owner/runbook. Sin él corresponde `OPEN_COPILOT_INCIDENT` o, si faltan datos, `TRIAGE_DRIFT_SLICE`.",
      },
    },
    {
      heading: "incidents, rollback y postmortem",
      subtopicId: "S51-T3-B",
      paragraphs: [
        "Un **incidente** de IA **contiene** (congela release), **revierte** al baseline y **comunica** alcance a stakeholders; el **postmortem sin culpa** identifica condiciones sistémicas (holdout tocado, redaction rota, tool allowlist) y acciones con fecha/dueño. Un simulacro sin evidencia no cuenta como readiness.",
        "Contrato operativo. Entrada: trace id, versiones de prompt/modelo/dataset, evidencia, feedback y política. Salida de este subtema: simulacro de rollback y acciones verificadas. Error: PII en trace, versión desconocida, drift o acción irreversible activa incidente y rollback. Criterio de éxito: se puede reconstruir qué respondió, qué citó, qué tool llamó, quién aprobó y cómo revertir.",
        "Aplicación de `incidents, rollback y postmortem` al caso peruano sintético `CASO-MOQ-051`: operación sintética de un copiloto para una entidad ficticia en Moquegua. La evidencia esperada es simulacro de rollback y acciones verificadas. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "incidents_rollback_postmortem.py",
        code: `def incident(sev: str, rollback_to: str) -> dict:
    return {"sev": sev, "rollback_to": rollback_to}

print(incident("P1", "m-1"))
print("page", True)
print("timeline", "required")`,
        output: `{'sev': 'P1', 'rollback_to': 'm-1'}
page True
timeline required`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Promoción de S51-T3-B: prueba simulacro de rollback y acciones verificadas y registra por separado `ROLLBACK_AND_CONTAIN` (breach) y `CONVENE_INCIDENT_REVIEW` (missing).",
      },
    },
    {
      heading: "incertidumbre, citas y confirmaciones",
      subtopicId: "S51-T4-A",
      paragraphs: [
        "La **UX** del copiloto muestra **incertidumbre**, **citas** y **alcance** del claim; una **confirmación** resume el efecto antes de una acción irreversible y permite **corregir el dato fuente**. Ocultar «no sé» o auto-ejecutar tools de escritura es dark pattern, no productividad.",
        "Contrato operativo. Entrada: trace id, versiones de prompt/modelo/dataset, evidencia, feedback y política. Salida de este subtema: usuario entiende evidencia y confirma acción. Error: PII en trace, versión desconocida, drift o acción irreversible activa incidente y rollback. Criterio de éxito: se puede reconstruir qué respondió, qué citó, qué tool llamó, quién aprobó y cómo revertir.",
        "Aplicación de `incertidumbre, citas y confirmaciones` al caso peruano sintético `CASO-MOQ-051`: operación sintética de un copiloto para una entidad ficticia en Moquegua. La evidencia esperada es usuario entiende evidencia y confirma acción. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "uncertainty_cites_confirm.py",
        code: `def ux_evidence(show_cites: bool) -> dict:
    return {"uncertainty": "low/med/high", "cites": show_cites}

print(ux_evidence(True))
print("show_cites", True)
print("confirm", "before_side_effects")`,
        output: `{'uncertainty': 'low/med/high', 'cites': True}
show_cites True
confirm before_side_effects`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "El dueño de S51-T4-A acepta solo usuario entiende evidencia y confirma acción; una violación produce `BLOCK_UNCONFIRMED_ACTION` y un registro incompleto produce `ASK_USER_TO_CONFIRM`.",
      },
    },
    {
      heading: "accesibilidad, corrección y contestabilidad",
      subtopicId: "S51-T4-B",
      paragraphs: [
        "**Accesibilidad** (WCAG): teclado, lector de pantalla, contraste y lenguaje claro no son opcionales en un copiloto de operaciones. **Contestabilidad** explica cómo revisar, apelar y obtener respuesta humana sin dark patterns (urgencia falsa, opt-out escondido). CF-5 exige flujo demostrable, no solo un banner de disclaimer.",
        "Contrato operativo. Entrada: trace id, versiones de prompt/modelo/dataset, evidencia, feedback y política. Salida de este subtema: flujo WCAG y apelación completables. Error: PII en trace, versión desconocida, drift o acción irreversible activa incidente y rollback. Criterio de éxito: se puede reconstruir qué respondió, qué citó, qué tool llamó, quién aprobó y cómo revertir.",
        "Aplicación de `accesibilidad, corrección y contestabilidad` al caso peruano sintético `CASO-MOQ-051`: operación sintética de un copiloto para una entidad ficticia en Moquegua. La evidencia esperada es flujo WCAG y apelación completables. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "a11y_correction_contestability.py",
        code: `def a11y_flags(contrast: str, keyboard: bool) -> dict:
    return {"contrast": contrast, "keyboard": keyboard}

print(a11y_flags("AA", True))
print({"edit": True, "contest": True})
print("human_rights", "contestability")`,
        output: `{'contrast': 'AA', 'keyboard': True}
{'edit': True, 'contest': True}
human_rights contestability`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Cierre de S51-T4-B: conserva flujo WCAG y apelación completables, la evidencia de `FAIL_ACCESSIBILITY_GATE` y la ruta humana `ROUTE_CONTESTATION`.",
      },
    },
  ],
  iDo: {
    intro: "Te muestro 8 demos de S51 (Observabilidad, gobernanza y UX del copiloto) alineadas a CP-N4-C (cierre) + CF-5 + Level-4 regression.",
    steps: [
      {
        demoId: "S51-T1-A-DEMO",
        subtopicId: "S51-T1-A",
        environment: "local-python",
        description: "Demo: traces de prompts/retrieval/tools",
        code: {
          language: 'python',
          title: "demo_traces_prompts_retrieval_tools.py",
          code: `def spans() -> list:
    return ["prompt", "retrieve", "tool"]

print("trace_id", "t-1")
print("spans", spans())
print("audit", True)`,
          output: `trace_id t-1
spans ['prompt', 'retrieve', 'tool']
audit True`,
        },
        why: "Hace observable `traces de prompts/retrieval/tools` con un caso local pequeño y deja como evidencia trace reconstruible sin PII; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S51-T1-B-DEMO",
        subtopicId: "S51-T1-B",
        environment: "local-python",
        description: "Demo: tokens, costo, latency y redacción",
        code: {
          language: 'python',
          title: "demo_tokens_cost_latency_redaction.py",
          code: `def tokens_ok(n: int) -> int:
    return n

print("tokens", tokens_ok(1200))
print("redaction", True)
print("latency_ms", 900)`,
          output: `tokens 1200
redaction True
latency_ms 900`,
        },
        why: "Hace observable `tokens, costo, latency y redacción` con un caso local pequeño y deja como evidencia dashboard por etapa con prueba de redacción; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S51-T2-A-DEMO",
        subtopicId: "S51-T2-A",
        environment: "local-python",
        description: "Demo: registro de modelo/prompt/dataset",
        code: {
          language: 'python',
          title: "demo_registry_model_prompt_dataset.py",
          code: `def pin_model(ver: str) -> dict:
    return {"model": ver}

print("registry", True)
print("versions", pin_model("m-2"))
print("pin", True)`,
          output: `registry True
versions {'model': 'm-2'}
pin True`,
        },
        why: "Hace observable `registro de modelo/prompt/dataset` con un caso local pequeño y deja como evidencia respuesta enlazada a bundle versionado; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S51-T2-B-DEMO",
        subtopicId: "S51-T2-B",
        environment: "local-python",
        description: "Demo: cambio, acceso, retención y auditoría",
        code: {
          language: 'python',
          title: "demo_change_access_retention_audit.py",
          code: `def retention_days(d: int) -> int:
    return d

print("access_log", True)
print("retention", retention_days(180))
print("change_control", True)`,
          output: `access_log True
retention 180
change_control True`,
        },
        why: "Hace observable `cambio, acceso, retención y auditoría` con un caso local pequeño y deja como evidencia cambio y acceso auditables; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S51-T3-A-DEMO",
        subtopicId: "S51-T3-A",
        environment: "local-python",
        description: "Demo: SLO, feedback y drift",
        code: {
          language: 'python',
          title: "demo_slo_feedback_drift.py",
          code: `def drift_watch(active: bool) -> bool:
    return active

print("slo", True)
print("drift_watch", drift_watch(True))
print("feedback_loop", True)`,
          output: `slo True
drift_watch True
feedback_loop True`,
        },
        why: "Hace observable `SLO, feedback y drift` con un caso local pequeño y deja como evidencia alerta accionable con owner/runbook; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S51-T3-B-DEMO",
        subtopicId: "S51-T3-B",
        environment: "local-python",
        description: "Demo: incidents, rollback y postmortem",
        code: {
          language: 'python',
          title: "demo_incidents_rollback_postmortem.py",
          code: `def rollback_to(ver: str) -> str:
    return ver

print("rollback", rollback_to("m-1"))
print("postmortem", True)
print("action_items", True)`,
          output: `rollback m-1
postmortem True
action_items True`,
        },
        why: "Hace observable `incidents, rollback y postmortem` con un caso local pequeño y deja como evidencia simulacro de rollback y acciones verificadas; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S51-T4-A-DEMO",
        subtopicId: "S51-T4-A",
        environment: "local-python",
        description: "Demo: incertidumbre, citas y confirmaciones",
        code: {
          language: 'python',
          title: "demo_uncertainty_cites_confirm.py",
          code: `def confirm_gate(side_effects: bool) -> bool:
    return side_effects

print("uncertainty", True)
print("cites", True)
print("confirm_gate", confirm_gate(True))`,
          output: `uncertainty True
cites True
confirm_gate True`,
        },
        why: "Hace observable `incertidumbre, citas y confirmaciones` con un caso local pequeño y deja como evidencia usuario entiende evidencia y confirma acción; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S51-T4-B-DEMO",
        subtopicId: "S51-T4-B",
        environment: "local-python",
        description: "Demo: accesibilidad, corrección y contestabilidad",
        code: {
          language: 'python',
          title: "demo_a11y_correction_contestability.py",
          code: `def contestable(edit: bool, contest: bool) -> bool:
    return edit and contest

print("a11y", True)
print("correction", True)
print("contest", contestable(True, True))`,
          output: `a11y True
correction True
contest True`,
        },
        why: "Hace observable `accesibilidad, corrección y contestabilidad` con un caso local pequeño y deja como evidencia flujo WCAG y apelación completables; el demo modela el contrato, no un servicio externo.",
      },
    ],
  },
  weDo: {
    intro: "S51 · Laboratorio Auditable AI Operations Copilot y CF-5: 24 retos locales. E1 repara una operación de dominio, E2 separa valid/invalid/missing y E3 demuestra recuperación fail-closed con ocho fixtures peruanos sintéticos distintos.",
    steps: [
      {
        id: "S51-T1-A-E1",
        subtopicId: "S51-T1-A",
        kind: "guided",
        instruction: "S51-T1-A-E1 · Calcula el contrato de `traces de prompts/retrieval/tools` sobre `CASO-MOQ-051-1A`. La entrada es el dict completo del starter; la operación debe demostrar trace completo, bundle versionado y cero PII. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S51-T1-A PASS`; la misma operación sobre el fixture adverso debe activar `REDACT_AND_QUARANTINE_TRACE` en E2.",
        hint: "Relaciona los campos `trace_id`, `spans`, `versions`, `pii_in_trace` con la regla explicada en S51-T1-A.",
        hints: [
          "Relaciona los campos `trace_id`, `spans`, `versions`, `pii_in_trace` con la regla explicada en S51-T1-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva trace reconstruible sin PII; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta pii_in_trace", "fixture adverso: trace completo, bundle versionado y cero PII", "CASO-MOQ-051-1A es sintético"],
        tests: "El fixture `CASO-MOQ-051-1A` satisface un predicado de dominio real; imprime `S51-T1-A PASS` y el assert booleano pasa.",
        feedback: "S51-T1-A-E1: explica qué campo cambió la decisión, por qué el adverso activa REDACT_AND_QUARANTINE_TRACE y por qué faltar pii_in_trace exige RESTORE_TRACE_CONTEXT.",
        starterCode: {
          language: 'python',
          title: "s51-t1-a-e1.py",
          code: `# CASO-LIM-051 · trace contract gate
# DEFECT: invierte meets_contract: falla si hay trace_id o si pii_in_trace
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-MOQ-051-1A", **{"trace_id":"tr-moq-51","spans":{"prompt","retrieval","tool","answer"},"versions":{"prompt":"p3","model":"m2","index":"i4"},"pii_in_trace":False}}
meets_contract = not record["trace_id"] or record["pii_in_trace"]
status = "PASS" if meets_contract else "REDACT_AND_QUARANTINE_TRACE"
print("S51-T1-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s51-t1-a-e1.py",
          code: `record = {"case_id": "CASO-MOQ-051-1A", **{"trace_id":"tr-moq-51","spans":{"prompt","retrieval","tool","answer"},"versions":{"prompt":"p3","model":"m2","index":"i4"},"pii_in_trace":False}}
meets_contract = record["trace_id"].startswith("tr-") and {"prompt","retrieval","tool","answer"} <= record["spans"] and all(record["versions"].values()) and not record["pii_in_trace"]
status = "PASS" if meets_contract else "REDACT_AND_QUARANTINE_TRACE"
print("S51-T1-A", status)
assert meets_contract is True` ,
          output: `S51-T1-A PASS` ,
        },
      },
      {
        id: "S51-T1-A-E2",
        subtopicId: "S51-T1-A",
        kind: "independent",
        instruction: "S51-T1-A-E2 · Modela tres rutas de `traces de prompts/retrieval/tools`: fixture válido, fixture adverso y registro sin `pii_in_trace`. Entrada: dict con case_id, trace_id, spans, versions, pii_in_trace. Salidas exactas: `PASS`, `REDACT_AND_QUARANTINE_TRACE`, `MISSING:pii_in_trace`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a pii_in_trace debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a pii_in_trace debe ocurrir antes de esa rama.",
          "Después aplica la regla de S51-T1-A: trace completo, bundle versionado y cero PII. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta pii_in_trace", "fixture adverso: trace completo, bundle versionado y cero PII", "CASO-MOQ-051-1A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `pii_in_trace` ausente y produce exactamente `PASS REDACT_AND_QUARANTINE_TRACE MISSING:pii_in_trace`.",
        feedback: "S51-T1-A-E2: explica qué campo cambió la decisión, por qué el adverso activa REDACT_AND_QUARANTINE_TRACE y por qué faltar pii_in_trace exige RESTORE_TRACE_CONTEXT.",
        starterCode: {
          language: 'python',
          title: "s51-t1-a-e2.py",
          code: `# CASO-LIM-051 · assess trace completeness
# DEFECT: PASS con traza vacía/PII; no exige spans+versions
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "trace_id", "spans", "versions", "pii_in_trace"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if not record["trace_id"] or record["pii_in_trace"] else "REDACT_AND_QUARANTINE_TRACE"

valid = {"case_id": "CASO-MOQ-051-1A", **{"trace_id":"tr-moq-51","spans":{"prompt","retrieval","tool","answer"},"versions":{"prompt":"p3","model":"m2","index":"i4"},"pii_in_trace":False}}
invalid = {"case_id": "CASO-MOQ-051-1A", **{"trace_id":"","spans":{"answer"},"versions":{"prompt":"","model":"latest"},"pii_in_trace":True}}
incomplete = {**valid}
incomplete.pop("pii_in_trace")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s51-t1-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "trace_id", "spans", "versions", "pii_in_trace"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["trace_id"].startswith("tr-") and {"prompt","retrieval","tool","answer"} <= record["spans"] and all(record["versions"].values()) and not record["pii_in_trace"] else "REDACT_AND_QUARANTINE_TRACE"

valid = {"case_id": "CASO-MOQ-051-1A", **{"trace_id":"tr-moq-51","spans":{"prompt","retrieval","tool","answer"},"versions":{"prompt":"p3","model":"m2","index":"i4"},"pii_in_trace":False}}
invalid = {"case_id": "CASO-MOQ-051-1A", **{"trace_id":"","spans":{"answer"},"versions":{"prompt":"","model":"latest"},"pii_in_trace":True}}
incomplete = {**valid}
incomplete.pop("pii_in_trace")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REDACT_AND_QUARANTINE_TRACE MISSING:pii_in_trace` ,
        },
      },
      {
        id: "S51-T1-A-E3",
        subtopicId: "S51-T1-A",
        kind: "transfer",
        instruction: "S51-T1-A-E3 · Simula fallo cerrado para `traces de prompts/retrieval/tools` con tres fixtures distintos. `CASO-MOQ-051-1A` debe continuar, el adverso debe devolver `REDACT_AND_QUARANTINE_TRACE` y la ausencia de `pii_in_trace` debe devolver `RESTORE_TRACE_CONTEXT`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `RESTORE_TRACE_CONTEXT` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `RESTORE_TRACE_CONTEXT` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró trace completo, bundle versionado y cero PII; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta pii_in_trace", "fixture adverso: trace completo, bundle versionado y cero PII", "CASO-MOQ-051-1A es sintético"],
        tests: "Fixtures `CASO-MOQ-051-1A`, adverso y sin `pii_in_trace` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S51-T1-A-E3: explica qué campo cambió la decisión, por qué el adverso activa REDACT_AND_QUARANTINE_TRACE y por qué faltar pii_in_trace exige RESTORE_TRACE_CONTEXT.",
        starterCode: {
          language: 'python',
          title: "s51-t1-a-e3.py",
          code: `# CASO-LIM-051 · decide restore vs continue
# DEFECT: missing→CONTINUE y PASS invertido; no RESTORE_TRACE_CONTEXT
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "trace_id", "spans", "versions", "pii_in_trace"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if not record["trace_id"] or record["pii_in_trace"] else "REDACT_AND_QUARANTINE_TRACE"

valid = {"case_id": "CASO-MOQ-051-1A", **{"trace_id":"tr-moq-51","spans":{"prompt","retrieval","tool","answer"},"versions":{"prompt":"p3","model":"m2","index":"i4"},"pii_in_trace":False}}
invalid = {"case_id": "CASO-MOQ-051-1A", **{"trace_id":"","spans":{"answer"},"versions":{"prompt":"","model":"latest"},"pii_in_trace":True}}
uncertain = {**valid}
uncertain.pop("pii_in_trace")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s51-t1-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "trace_id", "spans", "versions", "pii_in_trace"}
    missing = sorted(required - record.keys())
    if missing:
        return "RESTORE_TRACE_CONTEXT"
    return "CONTINUE" if record["trace_id"].startswith("tr-") and {"prompt","retrieval","tool","answer"} <= record["spans"] and all(record["versions"].values()) and not record["pii_in_trace"] else "REDACT_AND_QUARANTINE_TRACE"

valid = {"case_id": "CASO-MOQ-051-1A", **{"trace_id":"tr-moq-51","spans":{"prompt","retrieval","tool","answer"},"versions":{"prompt":"p3","model":"m2","index":"i4"},"pii_in_trace":False}}
invalid = {"case_id": "CASO-MOQ-051-1A", **{"trace_id":"","spans":{"answer"},"versions":{"prompt":"","model":"latest"},"pii_in_trace":True}}
uncertain = {**valid}
uncertain.pop("pii_in_trace")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REDACT_AND_QUARANTINE_TRACE", "RESTORE_TRACE_CONTEXT"]` ,
          output: `CONTINUE REDACT_AND_QUARANTINE_TRACE RESTORE_TRACE_CONTEXT` ,
        },
      },
      {
        id: "S51-T1-B-E1",
        subtopicId: "S51-T1-B",
        kind: "guided",
        instruction: "S51-T1-B-E1 · Compara el contrato de `tokens, costo, latency y redacción` sobre `CASO-MOQ-051-1B`. La entrada es el dict completo del starter; la operación debe demostrar tokens cuadran, p95 bajo SLO y campos redactados. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S51-T1-B PASS`; la misma operación sobre el fixture adverso debe activar `ALERT_COST_LATENCY` en E2.",
        hint: "Relaciona los campos `prompt_tokens`, `retrieval_tokens`, `answer_tokens`, `total_tokens`, `p95_ms`, `slo_ms`, `redacted_fields` con la regla explicada en S51-T1-B.",
        hints: [
          "Relaciona los campos `prompt_tokens`, `retrieval_tokens`, `answer_tokens`, `total_tokens`, `p95_ms`, `slo_ms`, `redacted_fields` con la regla explicada en S51-T1-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva dashboard por etapa con prueba de redacción; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta redacted_fields", "fixture adverso: tokens cuadran, p95 bajo SLO y campos redactados", "CASO-MOQ-051-1B es sintético"],
        tests: "El fixture `CASO-MOQ-051-1B` satisface un predicado de dominio real; imprime `S51-T1-B PASS` y el assert booleano pasa.",
        feedback: "S51-T1-B-E1: explica qué campo cambió la decisión, por qué el adverso activa ALERT_COST_LATENCY y por qué faltar redacted_fields exige FIX_REDACTION_PIPELINE.",
        starterCode: {
          language: 'python',
          title: "s51-t1-b-e1.py",
          code: `# CASO-LIM-051 · cost/latency SLO
# DEFECT: PASS si total_tokens==0 o p95>slo (invertido)
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-MOQ-051-1B", **{"prompt_tokens":800,"retrieval_tokens":400,"answer_tokens":300,"total_tokens":1500,"p95_ms":900,"slo_ms":1200,"redacted_fields":4}}
meets_contract = record["total_tokens"] == 0 or record["p95_ms"] > record["slo_ms"]
status = "PASS" if meets_contract else "ALERT_COST_LATENCY"
print("S51-T1-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s51-t1-b-e1.py",
          code: `record = {"case_id": "CASO-MOQ-051-1B", **{"prompt_tokens":800,"retrieval_tokens":400,"answer_tokens":300,"total_tokens":1500,"p95_ms":900,"slo_ms":1200,"redacted_fields":4}}
meets_contract = record["prompt_tokens"] + record["retrieval_tokens"] + record["answer_tokens"] == record["total_tokens"] and record["p95_ms"] <= record["slo_ms"] and record["redacted_fields"] >= 1
status = "PASS" if meets_contract else "ALERT_COST_LATENCY"
print("S51-T1-B", status)
assert meets_contract is True` ,
          output: `S51-T1-B PASS` ,
        },
      },
      {
        id: "S51-T1-B-E2",
        subtopicId: "S51-T1-B",
        kind: "independent",
        instruction: "S51-T1-B-E2 · Verifica tres rutas de `tokens, costo, latency y redacción`: fixture válido, fixture adverso y registro sin `redacted_fields`. Entrada: dict con case_id, prompt_tokens, retrieval_tokens, answer_tokens, total_tokens, p95_ms, slo_ms, redacted_fields. Salidas exactas: `PASS`, `ALERT_COST_LATENCY`, `MISSING:redacted_fields`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a redacted_fields debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a redacted_fields debe ocurrir antes de esa rama.",
          "Después aplica la regla de S51-T1-B: tokens cuadran, p95 bajo SLO y campos redactados. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta redacted_fields", "fixture adverso: tokens cuadran, p95 bajo SLO y campos redactados", "CASO-MOQ-051-1B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `redacted_fields` ausente y produce exactamente `PASS ALERT_COST_LATENCY MISSING:redacted_fields`.",
        feedback: "S51-T1-B-E2: explica qué campo cambió la decisión, por qué el adverso activa ALERT_COST_LATENCY y por qué faltar redacted_fields exige FIX_REDACTION_PIPELINE.",
        starterCode: {
          language: 'python',
          title: "s51-t1-b-e2.py",
          code: `# CASO-LIM-051 · assess token sum + redaction
# DEFECT: no valida suma tokens ni redacted_fields>=1
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "prompt_tokens", "retrieval_tokens", "answer_tokens", "total_tokens", "p95_ms", "slo_ms", "redacted_fields"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["total_tokens"] == 0 or record["p95_ms"] > record["slo_ms"] else "ALERT_COST_LATENCY"

valid = {"case_id": "CASO-MOQ-051-1B", **{"prompt_tokens":800,"retrieval_tokens":400,"answer_tokens":300,"total_tokens":1500,"p95_ms":900,"slo_ms":1200,"redacted_fields":4}}
invalid = {"case_id": "CASO-MOQ-051-1B", **{"prompt_tokens":800,"retrieval_tokens":400,"answer_tokens":300,"total_tokens":900,"p95_ms":5000,"slo_ms":1200,"redacted_fields":0}}
incomplete = {**valid}
incomplete.pop("redacted_fields")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s51-t1-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "prompt_tokens", "retrieval_tokens", "answer_tokens", "total_tokens", "p95_ms", "slo_ms", "redacted_fields"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["prompt_tokens"] + record["retrieval_tokens"] + record["answer_tokens"] == record["total_tokens"] and record["p95_ms"] <= record["slo_ms"] and record["redacted_fields"] >= 1 else "ALERT_COST_LATENCY"

valid = {"case_id": "CASO-MOQ-051-1B", **{"prompt_tokens":800,"retrieval_tokens":400,"answer_tokens":300,"total_tokens":1500,"p95_ms":900,"slo_ms":1200,"redacted_fields":4}}
invalid = {"case_id": "CASO-MOQ-051-1B", **{"prompt_tokens":800,"retrieval_tokens":400,"answer_tokens":300,"total_tokens":900,"p95_ms":5000,"slo_ms":1200,"redacted_fields":0}}
incomplete = {**valid}
incomplete.pop("redacted_fields")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS ALERT_COST_LATENCY MISSING:redacted_fields` ,
        },
      },
      {
        id: "S51-T1-B-E3",
        subtopicId: "S51-T1-B",
        kind: "transfer",
        instruction: "S51-T1-B-E3 · Extiende fallo cerrado para `tokens, costo, latency y redacción` con tres fixtures distintos. `CASO-MOQ-051-1B` debe continuar, el adverso debe devolver `ALERT_COST_LATENCY` y la ausencia de `redacted_fields` debe devolver `FIX_REDACTION_PIPELINE`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `FIX_REDACTION_PIPELINE` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `FIX_REDACTION_PIPELINE` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró tokens cuadran, p95 bajo SLO y campos redactados; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta redacted_fields", "fixture adverso: tokens cuadran, p95 bajo SLO y campos redactados", "CASO-MOQ-051-1B es sintético"],
        tests: "Fixtures `CASO-MOQ-051-1B`, adverso y sin `redacted_fields` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S51-T1-B-E3: explica qué campo cambió la decisión, por qué el adverso activa ALERT_COST_LATENCY y por qué faltar redacted_fields exige FIX_REDACTION_PIPELINE.",
        starterCode: {
          language: 'python',
          title: "s51-t1-b-e3.py",
          code: `# CASO-LIM-051 · decide fix redaction
# DEFECT: missing→CONTINUE; no FIX_REDACTION_PIPELINE
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "prompt_tokens", "retrieval_tokens", "answer_tokens", "total_tokens", "p95_ms", "slo_ms", "redacted_fields"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["total_tokens"] == 0 or record["p95_ms"] > record["slo_ms"] else "ALERT_COST_LATENCY"

valid = {"case_id": "CASO-MOQ-051-1B", **{"prompt_tokens":800,"retrieval_tokens":400,"answer_tokens":300,"total_tokens":1500,"p95_ms":900,"slo_ms":1200,"redacted_fields":4}}
invalid = {"case_id": "CASO-MOQ-051-1B", **{"prompt_tokens":800,"retrieval_tokens":400,"answer_tokens":300,"total_tokens":900,"p95_ms":5000,"slo_ms":1200,"redacted_fields":0}}
uncertain = {**valid}
uncertain.pop("redacted_fields")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s51-t1-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "prompt_tokens", "retrieval_tokens", "answer_tokens", "total_tokens", "p95_ms", "slo_ms", "redacted_fields"}
    missing = sorted(required - record.keys())
    if missing:
        return "FIX_REDACTION_PIPELINE"
    return "CONTINUE" if record["prompt_tokens"] + record["retrieval_tokens"] + record["answer_tokens"] == record["total_tokens"] and record["p95_ms"] <= record["slo_ms"] and record["redacted_fields"] >= 1 else "ALERT_COST_LATENCY"

valid = {"case_id": "CASO-MOQ-051-1B", **{"prompt_tokens":800,"retrieval_tokens":400,"answer_tokens":300,"total_tokens":1500,"p95_ms":900,"slo_ms":1200,"redacted_fields":4}}
invalid = {"case_id": "CASO-MOQ-051-1B", **{"prompt_tokens":800,"retrieval_tokens":400,"answer_tokens":300,"total_tokens":900,"p95_ms":5000,"slo_ms":1200,"redacted_fields":0}}
uncertain = {**valid}
uncertain.pop("redacted_fields")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "ALERT_COST_LATENCY", "FIX_REDACTION_PIPELINE"]` ,
          output: `CONTINUE ALERT_COST_LATENCY FIX_REDACTION_PIPELINE` ,
        },
      },
      {
        id: "S51-T2-A-E1",
        subtopicId: "S51-T2-A",
        kind: "guided",
        instruction: "S51-T2-A-E1 · Filtra el contrato de `registro de modelo/prompt/dataset` sobre `CASO-MOQ-051-2A`. La entrada es el dict completo del starter; la operación debe demostrar seis versiones explícitas y bundle inmutable. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S51-T2-A PASS`; la misma operación sobre el fixture adverso debe activar `FREEZE_RELEASE_BUNDLE` en E2.",
        hint: "Relaciona los campos `release`, `model`, `prompt`, `dataset`, `index`, `evaluator`, `immutable` con la regla explicada en S51-T2-A.",
        hints: [
          "Relaciona los campos `release`, `model`, `prompt`, `dataset`, `index`, `evaluator`, `immutable` con la regla explicada en S51-T2-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva respuesta enlazada a bundle versionado; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta immutable", "fixture adverso: seis versiones explícitas y bundle inmutable", "CASO-MOQ-051-2A es sintético"],
        tests: "El fixture `CASO-MOQ-051-2A` satisface un predicado de dominio real; imprime `S51-T2-A PASS` y el assert booleano pasa.",
        feedback: "S51-T2-A-E1: explica qué campo cambió la decisión, por qué el adverso activa FREEZE_RELEASE_BUNDLE y por qué faltar immutable exige REGISTER_MISSING_VERSION.",
        starterCode: {
          language: 'python',
          title: "s51-t2-a-e1.py",
          code: `# CASO-LIM-051 · immutable release bundle
# DEFECT: PASS si not immutable o latest (gate invertido)
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-MOQ-051-2A", **{"release":"copilot-7","model":"m2","prompt":"p3","dataset":"d5","index":"i4","evaluator":"e2","immutable":True}}
meets_contract = not record["immutable"] or any(record[k] == "latest" for k in ("model","prompt","dataset","index"))
status = "PASS" if meets_contract else "FREEZE_RELEASE_BUNDLE"
print("S51-T2-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s51-t2-a-e1.py",
          code: `record = {"case_id": "CASO-MOQ-051-2A", **{"release":"copilot-7","model":"m2","prompt":"p3","dataset":"d5","index":"i4","evaluator":"e2","immutable":True}}
meets_contract = all(record[k] for k in ("release","model","prompt","dataset","index","evaluator")) and record["immutable"]
status = "PASS" if meets_contract else "FREEZE_RELEASE_BUNDLE"
print("S51-T2-A", status)
assert meets_contract is True` ,
          output: `S51-T2-A PASS` ,
        },
      },
      {
        id: "S51-T2-A-E2",
        subtopicId: "S51-T2-A",
        kind: "independent",
        instruction: "S51-T2-A-E2 · Clasifica tres rutas de `registro de modelo/prompt/dataset`: fixture válido, fixture adverso y registro sin `immutable`. Entrada: dict con case_id, release, model, prompt, dataset, index, evaluator, immutable. Salidas exactas: `PASS`, `FREEZE_RELEASE_BUNDLE`, `MISSING:immutable`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a immutable debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a immutable debe ocurrir antes de esa rama.",
          "Después aplica la regla de S51-T2-A: seis versiones explícitas y bundle inmutable. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta immutable", "fixture adverso: seis versiones explícitas y bundle inmutable", "CASO-MOQ-051-2A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `immutable` ausente y produce exactamente `PASS FREEZE_RELEASE_BUNDLE MISSING:immutable`.",
        feedback: "S51-T2-A-E2: explica qué campo cambió la decisión, por qué el adverso activa FREEZE_RELEASE_BUNDLE y por qué faltar immutable exige REGISTER_MISSING_VERSION.",
        starterCode: {
          language: 'python',
          title: "s51-t2-a-e2.py",
          code: `# CASO-LIM-051 · assess freeze bundle
# DEFECT: PASS con latest/mutable
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "release", "model", "prompt", "dataset", "index", "evaluator", "immutable"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if not record["immutable"] or any(record[k] == "latest" for k in ("model","prompt","dataset","index")) else "FREEZE_RELEASE_BUNDLE"

valid = {"case_id": "CASO-MOQ-051-2A", **{"release":"copilot-7","model":"m2","prompt":"p3","dataset":"d5","index":"i4","evaluator":"e2","immutable":True}}
invalid = {"case_id": "CASO-MOQ-051-2A", **{"release":"latest","model":"latest","prompt":"","dataset":"latest","index":"latest","evaluator":"","immutable":False}}
incomplete = {**valid}
incomplete.pop("immutable")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s51-t2-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "release", "model", "prompt", "dataset", "index", "evaluator", "immutable"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if all(record[k] for k in ("release","model","prompt","dataset","index","evaluator")) and record["immutable"] else "FREEZE_RELEASE_BUNDLE"

valid = {"case_id": "CASO-MOQ-051-2A", **{"release":"copilot-7","model":"m2","prompt":"p3","dataset":"d5","index":"i4","evaluator":"e2","immutable":True}}
invalid = {"case_id": "CASO-MOQ-051-2A", **{"release":"latest","model":"latest","prompt":"","dataset":"latest","index":"latest","evaluator":"","immutable":False}}
incomplete = {**valid}
incomplete.pop("immutable")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS FREEZE_RELEASE_BUNDLE MISSING:immutable` ,
        },
      },
      {
        id: "S51-T2-A-E3",
        subtopicId: "S51-T2-A",
        kind: "transfer",
        instruction: "S51-T2-A-E3 · Defiende fallo cerrado para `registro de modelo/prompt/dataset` con tres fixtures distintos. `CASO-MOQ-051-2A` debe continuar, el adverso debe devolver `FREEZE_RELEASE_BUNDLE` y la ausencia de `immutable` debe devolver `REGISTER_MISSING_VERSION`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REGISTER_MISSING_VERSION` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REGISTER_MISSING_VERSION` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró seis versiones explícitas y bundle inmutable; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta immutable", "fixture adverso: seis versiones explícitas y bundle inmutable", "CASO-MOQ-051-2A es sintético"],
        tests: "Fixtures `CASO-MOQ-051-2A`, adverso y sin `immutable` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S51-T2-A-E3: explica qué campo cambió la decisión, por qué el adverso activa FREEZE_RELEASE_BUNDLE y por qué faltar immutable exige REGISTER_MISSING_VERSION.",
        starterCode: {
          language: 'python',
          title: "s51-t2-a-e3.py",
          code: `# CASO-LIM-051 · decide freeze release
# DEFECT: missing→CONTINUE; no FREEZE path correcto
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "release", "model", "prompt", "dataset", "index", "evaluator", "immutable"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if not record["immutable"] or any(record[k] == "latest" for k in ("model","prompt","dataset","index")) else "FREEZE_RELEASE_BUNDLE"

valid = {"case_id": "CASO-MOQ-051-2A", **{"release":"copilot-7","model":"m2","prompt":"p3","dataset":"d5","index":"i4","evaluator":"e2","immutable":True}}
invalid = {"case_id": "CASO-MOQ-051-2A", **{"release":"latest","model":"latest","prompt":"","dataset":"latest","index":"latest","evaluator":"","immutable":False}}
uncertain = {**valid}
uncertain.pop("immutable")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s51-t2-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "release", "model", "prompt", "dataset", "index", "evaluator", "immutable"}
    missing = sorted(required - record.keys())
    if missing:
        return "REGISTER_MISSING_VERSION"
    return "CONTINUE" if all(record[k] for k in ("release","model","prompt","dataset","index","evaluator")) and record["immutable"] else "FREEZE_RELEASE_BUNDLE"

valid = {"case_id": "CASO-MOQ-051-2A", **{"release":"copilot-7","model":"m2","prompt":"p3","dataset":"d5","index":"i4","evaluator":"e2","immutable":True}}
invalid = {"case_id": "CASO-MOQ-051-2A", **{"release":"latest","model":"latest","prompt":"","dataset":"latest","index":"latest","evaluator":"","immutable":False}}
uncertain = {**valid}
uncertain.pop("immutable")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "FREEZE_RELEASE_BUNDLE", "REGISTER_MISSING_VERSION"]` ,
          output: `CONTINUE FREEZE_RELEASE_BUNDLE REGISTER_MISSING_VERSION` ,
        },
      },
      {
        id: "S51-T2-B-E1",
        subtopicId: "S51-T2-B",
        kind: "guided",
        instruction: "S51-T2-B-E1 · Modela el contrato de `cambio, acceso, retención y auditoría` sobre `CASO-MOQ-051-2B`. La entrada es el dict completo del starter; la operación debe demostrar separación de funciones, scope read, retención y audit. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S51-T2-B PASS`; la misma operación sobre el fixture adverso debe activar `REJECT_UNGOVERNED_CHANGE` en E2.",
        hint: "Relaciona los campos `author`, `approver`, `risk`, `access_scope`, `retention_days`, `audit_append_only` con la regla explicada en S51-T2-B.",
        hints: [
          "Relaciona los campos `author`, `approver`, `risk`, `access_scope`, `retention_days`, `audit_append_only` con la regla explicada en S51-T2-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva cambio y acceso auditables; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta audit_append_only", "fixture adverso: separación de funciones, scope read, retención y audit", "CASO-MOQ-051-2B es sintético"],
        tests: "El fixture `CASO-MOQ-051-2B` satisface un predicado de dominio real; imprime `S51-T2-B PASS` y el assert booleano pasa.",
        feedback: "S51-T2-B-E1: explica qué campo cambió la decisión, por qué el adverso activa REJECT_UNGOVERNED_CHANGE y por qué faltar audit_append_only exige REQUEST_INDEPENDENT_APPROVAL.",
        starterCode: {
          language: 'python',
          title: "s51-t2-b-e1.py",
          code: `# CASO-LIM-051 · dual control release
# DEFECT: contrato invertido author≠approver / audit_append_only
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-MOQ-051-2B", **{"author":"dev-a","approver":"owner-b","risk":"medium","access_scope":"ops-read","retention_days":30,"audit_append_only":True}}
meets_contract = record["author"] == record["approver"] or record["access_scope"].endswith("admin")
status = "PASS" if meets_contract else "REJECT_UNGOVERNED_CHANGE"
print("S51-T2-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s51-t2-b-e1.py",
          code: `record = {"case_id": "CASO-MOQ-051-2B", **{"author":"dev-a","approver":"owner-b","risk":"medium","access_scope":"ops-read","retention_days":30,"audit_append_only":True}}
meets_contract = record["author"] != record["approver"] and record["risk"] in {"low","medium","high"} and record["access_scope"].endswith("-read") and record["retention_days"] <= 30 and record["audit_append_only"]
status = "PASS" if meets_contract else "REJECT_UNGOVERNED_CHANGE"
print("S51-T2-B", status)
assert meets_contract is True` ,
          output: `S51-T2-B PASS` ,
        },
      },
      {
        id: "S51-T2-B-E2",
        subtopicId: "S51-T2-B",
        kind: "independent",
        instruction: "S51-T2-B-E2 · Audita tres rutas de `cambio, acceso, retención y auditoría`: fixture válido, fixture adverso y registro sin `audit_append_only`. Entrada: dict con case_id, author, approver, risk, access_scope, retention_days, audit_append_only. Salidas exactas: `PASS`, `REJECT_UNGOVERNED_CHANGE`, `MISSING:audit_append_only`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a audit_append_only debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a audit_append_only debe ocurrir antes de esa rama.",
          "Después aplica la regla de S51-T2-B: separación de funciones, scope read, retención y audit. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta audit_append_only", "fixture adverso: separación de funciones, scope read, retención y audit", "CASO-MOQ-051-2B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `audit_append_only` ausente y produce exactamente `PASS REJECT_UNGOVERNED_CHANGE MISSING:audit_append_only`.",
        feedback: "S51-T2-B-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_UNGOVERNED_CHANGE y por qué faltar audit_append_only exige REQUEST_INDEPENDENT_APPROVAL.",
        starterCode: {
          language: 'python',
          title: "s51-t2-b-e2.py",
          code: `# CASO-LIM-051 · assess change control
# DEFECT: PASS sin dual control / retention / audit append-only
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "author", "approver", "risk", "access_scope", "retention_days", "audit_append_only"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["author"] == record["approver"] or record["access_scope"].endswith("admin") else "REJECT_UNGOVERNED_CHANGE"

valid = {"case_id": "CASO-MOQ-051-2B", **{"author":"dev-a","approver":"owner-b","risk":"medium","access_scope":"ops-read","retention_days":30,"audit_append_only":True}}
invalid = {"case_id": "CASO-MOQ-051-2B", **{"author":"dev-a","approver":"dev-a","risk":"unknown","access_scope":"global-admin","retention_days":3650,"audit_append_only":False}}
incomplete = {**valid}
incomplete.pop("audit_append_only")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s51-t2-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "author", "approver", "risk", "access_scope", "retention_days", "audit_append_only"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["author"] != record["approver"] and record["risk"] in {"low","medium","high"} and record["access_scope"].endswith("-read") and record["retention_days"] <= 30 and record["audit_append_only"] else "REJECT_UNGOVERNED_CHANGE"

valid = {"case_id": "CASO-MOQ-051-2B", **{"author":"dev-a","approver":"owner-b","risk":"medium","access_scope":"ops-read","retention_days":30,"audit_append_only":True}}
invalid = {"case_id": "CASO-MOQ-051-2B", **{"author":"dev-a","approver":"dev-a","risk":"unknown","access_scope":"global-admin","retention_days":3650,"audit_append_only":False}}
incomplete = {**valid}
incomplete.pop("audit_append_only")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REJECT_UNGOVERNED_CHANGE MISSING:audit_append_only` ,
        },
      },
      {
        id: "S51-T2-B-E3",
        subtopicId: "S51-T2-B",
        kind: "transfer",
        instruction: "S51-T2-B-E3 · Recupera fallo cerrado para `cambio, acceso, retención y auditoría` con tres fixtures distintos. `CASO-MOQ-051-2B` debe continuar, el adverso debe devolver `REJECT_UNGOVERNED_CHANGE` y la ausencia de `audit_append_only` debe devolver `REQUEST_INDEPENDENT_APPROVAL`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_INDEPENDENT_APPROVAL` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_INDEPENDENT_APPROVAL` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró separación de funciones, scope read, retención y audit; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta audit_append_only", "fixture adverso: separación de funciones, scope read, retención y audit", "CASO-MOQ-051-2B es sintético"],
        tests: "Fixtures `CASO-MOQ-051-2B`, adverso y sin `audit_append_only` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S51-T2-B-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_UNGOVERNED_CHANGE y por qué faltar audit_append_only exige REQUEST_INDEPENDENT_APPROVAL.",
        starterCode: {
          language: 'python',
          title: "s51-t2-b-e3.py",
          code: `# CASO-LIM-051 · decide restore change control
# DEFECT: missing→CONTINUE; no ruta de dual-control
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "author", "approver", "risk", "access_scope", "retention_days", "audit_append_only"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["author"] == record["approver"] or record["access_scope"].endswith("admin") else "REJECT_UNGOVERNED_CHANGE"

valid = {"case_id": "CASO-MOQ-051-2B", **{"author":"dev-a","approver":"owner-b","risk":"medium","access_scope":"ops-read","retention_days":30,"audit_append_only":True}}
invalid = {"case_id": "CASO-MOQ-051-2B", **{"author":"dev-a","approver":"dev-a","risk":"unknown","access_scope":"global-admin","retention_days":3650,"audit_append_only":False}}
uncertain = {**valid}
uncertain.pop("audit_append_only")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s51-t2-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "author", "approver", "risk", "access_scope", "retention_days", "audit_append_only"}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_INDEPENDENT_APPROVAL"
    return "CONTINUE" if record["author"] != record["approver"] and record["risk"] in {"low","medium","high"} and record["access_scope"].endswith("-read") and record["retention_days"] <= 30 and record["audit_append_only"] else "REJECT_UNGOVERNED_CHANGE"

valid = {"case_id": "CASO-MOQ-051-2B", **{"author":"dev-a","approver":"owner-b","risk":"medium","access_scope":"ops-read","retention_days":30,"audit_append_only":True}}
invalid = {"case_id": "CASO-MOQ-051-2B", **{"author":"dev-a","approver":"dev-a","risk":"unknown","access_scope":"global-admin","retention_days":3650,"audit_append_only":False}}
uncertain = {**valid}
uncertain.pop("audit_append_only")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_UNGOVERNED_CHANGE", "REQUEST_INDEPENDENT_APPROVAL"]` ,
          output: `CONTINUE REJECT_UNGOVERNED_CHANGE REQUEST_INDEPENDENT_APPROVAL` ,
        },
      },
      {
        id: "S51-T3-A-E1",
        subtopicId: "S51-T3-A",
        kind: "guided",
        instruction: "S51-T3-A-E1 · Verifica el contrato de `SLO, feedback y drift` sobre `CASO-MOQ-051-3A`. La entrada es el dict completo del starter; la operación debe demostrar availability/faithfulness/drift bajo SLO con owner. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S51-T3-A PASS`; la misma operación sobre el fixture adverso debe activar `OPEN_COPILOT_INCIDENT` en E2.",
        hint: "Relaciona los campos `availability`, `availability_slo`, `faithfulness`, `faithfulness_slo`, `drift`, `max_drift`, `owner` con la regla explicada en S51-T3-A.",
        hints: [
          "Relaciona los campos `availability`, `availability_slo`, `faithfulness`, `faithfulness_slo`, `drift`, `max_drift`, `owner` con la regla explicada en S51-T3-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva alerta accionable con owner/runbook; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta owner", "fixture adverso: availability/faithfulness/drift bajo SLO con owner", "CASO-MOQ-051-3A es sintético"],
        tests: "El fixture `CASO-MOQ-051-3A` satisface un predicado de dominio real; imprime `S51-T3-A PASS` y el assert booleano pasa.",
        feedback: "S51-T3-A-E1: explica qué campo cambió la decisión, por qué el adverso activa OPEN_COPILOT_INCIDENT y por qué faltar owner exige TRIAGE_DRIFT_SLICE.",
        starterCode: {
          language: 'python',
          title: "s51-t3-a-e1.py",
          code: `# CASO-LIM-051 · reliability SLOs copiloto
# DEFECT: gate availability/faithfulness/drift invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-MOQ-051-3A", **{"availability":0.999,"availability_slo":0.995,"faithfulness":0.93,"faithfulness_slo":0.9,"drift":0.04,"max_drift":0.08,"owner":"ai-oncall"}}
meets_contract = record["availability"] < record["availability_slo"] or record["drift"] > record["max_drift"]
status = "PASS" if meets_contract else "OPEN_COPILOT_INCIDENT"
print("S51-T3-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s51-t3-a-e1.py",
          code: `record = {"case_id": "CASO-MOQ-051-3A", **{"availability":0.999,"availability_slo":0.995,"faithfulness":0.93,"faithfulness_slo":0.9,"drift":0.04,"max_drift":0.08,"owner":"ai-oncall"}}
meets_contract = record["availability"] >= record["availability_slo"] and record["faithfulness"] >= record["faithfulness_slo"] and record["drift"] <= record["max_drift"] and bool(record["owner"])
status = "PASS" if meets_contract else "OPEN_COPILOT_INCIDENT"
print("S51-T3-A", status)
assert meets_contract is True` ,
          output: `S51-T3-A PASS` ,
        },
      },
      {
        id: "S51-T3-A-E2",
        subtopicId: "S51-T3-A",
        kind: "independent",
        instruction: "S51-T3-A-E2 · Decide tres rutas de `SLO, feedback y drift`: fixture válido, fixture adverso y registro sin `owner`. Entrada: dict con case_id, availability, availability_slo, faithfulness, faithfulness_slo, drift, max_drift, owner. Salidas exactas: `PASS`, `OPEN_COPILOT_INCIDENT`, `MISSING:owner`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a owner debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a owner debe ocurrir antes de esa rama.",
          "Después aplica la regla de S51-T3-A: availability/faithfulness/drift bajo SLO con owner. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta owner", "fixture adverso: availability/faithfulness/drift bajo SLO con owner", "CASO-MOQ-051-3A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `owner` ausente y produce exactamente `PASS OPEN_COPILOT_INCIDENT MISSING:owner`.",
        feedback: "S51-T3-A-E2: explica qué campo cambió la decisión, por qué el adverso activa OPEN_COPILOT_INCIDENT y por qué faltar owner exige TRIAGE_DRIFT_SLICE.",
        starterCode: {
          language: 'python',
          title: "s51-t3-a-e2.py",
          code: `# CASO-LIM-051 · assess SLO fidelity
# DEFECT: PASS sin owner o con drift/availability fuera de SLO
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "availability", "availability_slo", "faithfulness", "faithfulness_slo", "drift", "max_drift", "owner"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["availability"] < record["availability_slo"] or record["drift"] > record["max_drift"] else "OPEN_COPILOT_INCIDENT"

valid = {"case_id": "CASO-MOQ-051-3A", **{"availability":0.999,"availability_slo":0.995,"faithfulness":0.93,"faithfulness_slo":0.9,"drift":0.04,"max_drift":0.08,"owner":"ai-oncall"}}
invalid = {"case_id": "CASO-MOQ-051-3A", **{"availability":0.8,"availability_slo":0.995,"faithfulness":0.4,"faithfulness_slo":0.9,"drift":0.3,"max_drift":0.08,"owner":""}}
incomplete = {**valid}
incomplete.pop("owner")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s51-t3-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "availability", "availability_slo", "faithfulness", "faithfulness_slo", "drift", "max_drift", "owner"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["availability"] >= record["availability_slo"] and record["faithfulness"] >= record["faithfulness_slo"] and record["drift"] <= record["max_drift"] and bool(record["owner"]) else "OPEN_COPILOT_INCIDENT"

valid = {"case_id": "CASO-MOQ-051-3A", **{"availability":0.999,"availability_slo":0.995,"faithfulness":0.93,"faithfulness_slo":0.9,"drift":0.04,"max_drift":0.08,"owner":"ai-oncall"}}
invalid = {"case_id": "CASO-MOQ-051-3A", **{"availability":0.8,"availability_slo":0.995,"faithfulness":0.4,"faithfulness_slo":0.9,"drift":0.3,"max_drift":0.08,"owner":""}}
incomplete = {**valid}
incomplete.pop("owner")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS OPEN_COPILOT_INCIDENT MISSING:owner` ,
        },
      },
      {
        id: "S51-T3-A-E3",
        subtopicId: "S51-T3-A",
        kind: "transfer",
        instruction: "S51-T3-A-E3 · Contrasta fallo cerrado para `SLO, feedback y drift` con tres fixtures distintos. `CASO-MOQ-051-3A` debe continuar, el adverso debe devolver `OPEN_COPILOT_INCIDENT` y la ausencia de `owner` debe devolver `TRIAGE_DRIFT_SLICE`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `TRIAGE_DRIFT_SLICE` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `TRIAGE_DRIFT_SLICE` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró availability/faithfulness/drift bajo SLO con owner; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta owner", "fixture adverso: availability/faithfulness/drift bajo SLO con owner", "CASO-MOQ-051-3A es sintético"],
        tests: "Fixtures `CASO-MOQ-051-3A`, adverso y sin `owner` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S51-T3-A-E3: explica qué campo cambió la decisión, por qué el adverso activa OPEN_COPILOT_INCIDENT y por qué faltar owner exige TRIAGE_DRIFT_SLICE.",
        starterCode: {
          language: 'python',
          title: "s51-t3-a-e3.py",
          code: `# CASO-LIM-051 · decide restore observability owner
# DEFECT: missing→CONTINUE; no acción de SLO
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "availability", "availability_slo", "faithfulness", "faithfulness_slo", "drift", "max_drift", "owner"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["availability"] < record["availability_slo"] or record["drift"] > record["max_drift"] else "OPEN_COPILOT_INCIDENT"

valid = {"case_id": "CASO-MOQ-051-3A", **{"availability":0.999,"availability_slo":0.995,"faithfulness":0.93,"faithfulness_slo":0.9,"drift":0.04,"max_drift":0.08,"owner":"ai-oncall"}}
invalid = {"case_id": "CASO-MOQ-051-3A", **{"availability":0.8,"availability_slo":0.995,"faithfulness":0.4,"faithfulness_slo":0.9,"drift":0.3,"max_drift":0.08,"owner":""}}
uncertain = {**valid}
uncertain.pop("owner")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s51-t3-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "availability", "availability_slo", "faithfulness", "faithfulness_slo", "drift", "max_drift", "owner"}
    missing = sorted(required - record.keys())
    if missing:
        return "TRIAGE_DRIFT_SLICE"
    return "CONTINUE" if record["availability"] >= record["availability_slo"] and record["faithfulness"] >= record["faithfulness_slo"] and record["drift"] <= record["max_drift"] and bool(record["owner"]) else "OPEN_COPILOT_INCIDENT"

valid = {"case_id": "CASO-MOQ-051-3A", **{"availability":0.999,"availability_slo":0.995,"faithfulness":0.93,"faithfulness_slo":0.9,"drift":0.04,"max_drift":0.08,"owner":"ai-oncall"}}
invalid = {"case_id": "CASO-MOQ-051-3A", **{"availability":0.8,"availability_slo":0.995,"faithfulness":0.4,"faithfulness_slo":0.9,"drift":0.3,"max_drift":0.08,"owner":""}}
uncertain = {**valid}
uncertain.pop("owner")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "OPEN_COPILOT_INCIDENT", "TRIAGE_DRIFT_SLICE"]` ,
          output: `CONTINUE OPEN_COPILOT_INCIDENT TRIAGE_DRIFT_SLICE` ,
        },
      },
      {
        id: "S51-T3-B-E1",
        subtopicId: "S51-T3-B",
        kind: "guided",
        instruction: "S51-T3-B-E1 · Clasifica el contrato de `incidents, rollback y postmortem` sobre `CASO-MOQ-051-3B`. La entrada es el dict completo del starter; la operación debe demostrar contención, last-good, RTO y acciones con dueño. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S51-T3-B PASS`; la misma operación sobre el fixture adverso debe activar `ROLLBACK_AND_CONTAIN` en E2.",
        hint: "Relaciona los campos `contained`, `rolled_back_to`, `rollback_minutes`, `rto_minutes`, `postmortem_actions`, `owners_assigned` con la regla explicada en S51-T3-B.",
        hints: [
          "Relaciona los campos `contained`, `rolled_back_to`, `rollback_minutes`, `rto_minutes`, `postmortem_actions`, `owners_assigned` con la regla explicada en S51-T3-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva simulacro de rollback y acciones verificadas; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta owners_assigned", "fixture adverso: contención, last-good, RTO y acciones con dueño", "CASO-MOQ-051-3B es sintético"],
        tests: "El fixture `CASO-MOQ-051-3B` satisface un predicado de dominio real; imprime `S51-T3-B PASS` y el assert booleano pasa.",
        feedback: "S51-T3-B-E1: explica qué campo cambió la decisión, por qué el adverso activa ROLLBACK_AND_CONTAIN y por qué faltar owners_assigned exige CONVENE_INCIDENT_REVIEW.",
        starterCode: {
          language: 'python',
          title: "s51-t3-b-e1.py",
          code: `# CASO-LIM-051 · incident rollback gate
# DEFECT: contrato contained/rollback/postmortem invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-MOQ-051-3B", **{"contained":True,"rolled_back_to":"copilot-6","rollback_minutes":7,"rto_minutes":10,"postmortem_actions":4,"owners_assigned":True}}
meets_contract = not record["contained"] or record["rollback_minutes"] > record["rto_minutes"]
status = "PASS" if meets_contract else "ROLLBACK_AND_CONTAIN"
print("S51-T3-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s51-t3-b-e1.py",
          code: `record = {"case_id": "CASO-MOQ-051-3B", **{"contained":True,"rolled_back_to":"copilot-6","rollback_minutes":7,"rto_minutes":10,"postmortem_actions":4,"owners_assigned":True}}
meets_contract = record["contained"] and record["rolled_back_to"].startswith("copilot-") and record["rollback_minutes"] <= record["rto_minutes"] and record["postmortem_actions"] >= 1 and record["owners_assigned"]
status = "PASS" if meets_contract else "ROLLBACK_AND_CONTAIN"
print("S51-T3-B", status)
assert meets_contract is True` ,
          output: `S51-T3-B PASS` ,
        },
      },
      {
        id: "S51-T3-B-E2",
        subtopicId: "S51-T3-B",
        kind: "independent",
        instruction: "S51-T3-B-E2 · Calcula tres rutas de `incidents, rollback y postmortem`: fixture válido, fixture adverso y registro sin `owners_assigned`. Entrada: dict con case_id, contained, rolled_back_to, rollback_minutes, rto_minutes, postmortem_actions, owners_assigned. Salidas exactas: `PASS`, `ROLLBACK_AND_CONTAIN`, `MISSING:owners_assigned`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a owners_assigned debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a owners_assigned debe ocurrir antes de esa rama.",
          "Después aplica la regla de S51-T3-B: contención, last-good, RTO y acciones con dueño. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta owners_assigned", "fixture adverso: contención, last-good, RTO y acciones con dueño", "CASO-MOQ-051-3B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `owners_assigned` ausente y produce exactamente `PASS ROLLBACK_AND_CONTAIN MISSING:owners_assigned`.",
        feedback: "S51-T3-B-E2: explica qué campo cambió la decisión, por qué el adverso activa ROLLBACK_AND_CONTAIN y por qué faltar owners_assigned exige CONVENE_INCIDENT_REVIEW.",
        starterCode: {
          language: 'python',
          title: "s51-t3-b-e2.py",
          code: `# CASO-LIM-051 · assess incident response
# DEFECT: PASS sin rollback dentro de RTO o postmortem
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "contained", "rolled_back_to", "rollback_minutes", "rto_minutes", "postmortem_actions", "owners_assigned"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if not record["contained"] or record["rollback_minutes"] > record["rto_minutes"] else "ROLLBACK_AND_CONTAIN"

valid = {"case_id": "CASO-MOQ-051-3B", **{"contained":True,"rolled_back_to":"copilot-6","rollback_minutes":7,"rto_minutes":10,"postmortem_actions":4,"owners_assigned":True}}
invalid = {"case_id": "CASO-MOQ-051-3B", **{"contained":False,"rolled_back_to":"","rollback_minutes":90,"rto_minutes":10,"postmortem_actions":0,"owners_assigned":False}}
incomplete = {**valid}
incomplete.pop("owners_assigned")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s51-t3-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "contained", "rolled_back_to", "rollback_minutes", "rto_minutes", "postmortem_actions", "owners_assigned"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["contained"] and record["rolled_back_to"].startswith("copilot-") and record["rollback_minutes"] <= record["rto_minutes"] and record["postmortem_actions"] >= 1 and record["owners_assigned"] else "ROLLBACK_AND_CONTAIN"

valid = {"case_id": "CASO-MOQ-051-3B", **{"contained":True,"rolled_back_to":"copilot-6","rollback_minutes":7,"rto_minutes":10,"postmortem_actions":4,"owners_assigned":True}}
invalid = {"case_id": "CASO-MOQ-051-3B", **{"contained":False,"rolled_back_to":"","rollback_minutes":90,"rto_minutes":10,"postmortem_actions":0,"owners_assigned":False}}
incomplete = {**valid}
incomplete.pop("owners_assigned")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS ROLLBACK_AND_CONTAIN MISSING:owners_assigned` ,
        },
      },
      {
        id: "S51-T3-B-E3",
        subtopicId: "S51-T3-B",
        kind: "transfer",
        instruction: "S51-T3-B-E3 · Instrumenta fallo cerrado para `incidents, rollback y postmortem` con tres fixtures distintos. `CASO-MOQ-051-3B` debe continuar, el adverso debe devolver `ROLLBACK_AND_CONTAIN` y la ausencia de `owners_assigned` debe devolver `CONVENE_INCIDENT_REVIEW`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `CONVENE_INCIDENT_REVIEW` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `CONVENE_INCIDENT_REVIEW` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró contención, last-good, RTO y acciones con dueño; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta owners_assigned", "fixture adverso: contención, last-good, RTO y acciones con dueño", "CASO-MOQ-051-3B es sintético"],
        tests: "Fixtures `CASO-MOQ-051-3B`, adverso y sin `owners_assigned` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S51-T3-B-E3: explica qué campo cambió la decisión, por qué el adverso activa ROLLBACK_AND_CONTAIN y por qué faltar owners_assigned exige CONVENE_INCIDENT_REVIEW.",
        starterCode: {
          language: 'python',
          title: "s51-t3-b-e3.py",
          code: `# CASO-LIM-051 · decide restore incident evidence
# DEFECT: missing→CONTINUE; no acción de IR
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "contained", "rolled_back_to", "rollback_minutes", "rto_minutes", "postmortem_actions", "owners_assigned"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if not record["contained"] or record["rollback_minutes"] > record["rto_minutes"] else "ROLLBACK_AND_CONTAIN"

valid = {"case_id": "CASO-MOQ-051-3B", **{"contained":True,"rolled_back_to":"copilot-6","rollback_minutes":7,"rto_minutes":10,"postmortem_actions":4,"owners_assigned":True}}
invalid = {"case_id": "CASO-MOQ-051-3B", **{"contained":False,"rolled_back_to":"","rollback_minutes":90,"rto_minutes":10,"postmortem_actions":0,"owners_assigned":False}}
uncertain = {**valid}
uncertain.pop("owners_assigned")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s51-t3-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "contained", "rolled_back_to", "rollback_minutes", "rto_minutes", "postmortem_actions", "owners_assigned"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONVENE_INCIDENT_REVIEW"
    return "CONTINUE" if record["contained"] and record["rolled_back_to"].startswith("copilot-") and record["rollback_minutes"] <= record["rto_minutes"] and record["postmortem_actions"] >= 1 and record["owners_assigned"] else "ROLLBACK_AND_CONTAIN"

valid = {"case_id": "CASO-MOQ-051-3B", **{"contained":True,"rolled_back_to":"copilot-6","rollback_minutes":7,"rto_minutes":10,"postmortem_actions":4,"owners_assigned":True}}
invalid = {"case_id": "CASO-MOQ-051-3B", **{"contained":False,"rolled_back_to":"","rollback_minutes":90,"rto_minutes":10,"postmortem_actions":0,"owners_assigned":False}}
uncertain = {**valid}
uncertain.pop("owners_assigned")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "ROLLBACK_AND_CONTAIN", "CONVENE_INCIDENT_REVIEW"]` ,
          output: `CONTINUE ROLLBACK_AND_CONTAIN CONVENE_INCIDENT_REVIEW` ,
        },
      },
      {
        id: "S51-T4-A-E1",
        subtopicId: "S51-T4-A",
        kind: "guided",
        instruction: "S51-T4-A-E1 · Audita el contrato de `incertidumbre, citas y confirmaciones` sobre `CASO-MOQ-051-4A`. La entrada es el dict completo del starter; la operación debe demostrar incertidumbre/citas visibles y efecto confirmado. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S51-T4-A PASS`; la misma operación sobre el fixture adverso debe activar `BLOCK_UNCONFIRMED_ACTION` en E2.",
        hint: "Relaciona los campos `uncertainty_shown`, `citations_resolve`, `effect_summary`, `confirmation_required`, `confirmed` con la regla explicada en S51-T4-A.",
        hints: [
          "Relaciona los campos `uncertainty_shown`, `citations_resolve`, `effect_summary`, `confirmation_required`, `confirmed` con la regla explicada en S51-T4-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva usuario entiende evidencia y confirma acción; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta confirmed", "fixture adverso: incertidumbre/citas visibles y efecto confirmado", "CASO-MOQ-051-4A es sintético"],
        tests: "El fixture `CASO-MOQ-051-4A` satisface un predicado de dominio real; imprime `S51-T4-A PASS` y el assert booleano pasa.",
        feedback: "S51-T4-A-E1: explica qué campo cambió la decisión, por qué el adverso activa BLOCK_UNCONFIRMED_ACTION y por qué faltar confirmed exige ASK_USER_TO_CONFIRM.",
        starterCode: {
          language: 'python',
          title: "s51-t4-a-e1.py",
          code: `# CASO-LIM-051 · contestable answer UX
# DEFECT: uncertainty/citations/confirmation invertidos
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-MOQ-051-4A", **{"uncertainty_shown":True,"citations_resolve":True,"effect_summary":"prepara borrador","confirmation_required":True,"confirmed":True}}
meets_contract = not record["uncertainty_shown"] or not record["citations_resolve"] or not record["confirmed"]
status = "PASS" if meets_contract else "BLOCK_UNCONFIRMED_ACTION"
print("S51-T4-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s51-t4-a-e1.py",
          code: `record = {"case_id": "CASO-MOQ-051-4A", **{"uncertainty_shown":True,"citations_resolve":True,"effect_summary":"prepara borrador","confirmation_required":True,"confirmed":True}}
meets_contract = record["uncertainty_shown"] and record["citations_resolve"] and bool(record["effect_summary"]) and (not record["confirmation_required"] or record["confirmed"])
status = "PASS" if meets_contract else "BLOCK_UNCONFIRMED_ACTION"
print("S51-T4-A", status)
assert meets_contract is True` ,
          output: `S51-T4-A PASS` ,
        },
      },
      {
        id: "S51-T4-A-E2",
        subtopicId: "S51-T4-A",
        kind: "independent",
        instruction: "S51-T4-A-E2 · Compara tres rutas de `incertidumbre, citas y confirmaciones`: fixture válido, fixture adverso y registro sin `confirmed`. Entrada: dict con case_id, uncertainty_shown, citations_resolve, effect_summary, confirmation_required, confirmed. Salidas exactas: `PASS`, `BLOCK_UNCONFIRMED_ACTION`, `MISSING:confirmed`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a confirmed debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a confirmed debe ocurrir antes de esa rama.",
          "Después aplica la regla de S51-T4-A: incertidumbre/citas visibles y efecto confirmado. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta confirmed", "fixture adverso: incertidumbre/citas visibles y efecto confirmado", "CASO-MOQ-051-4A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `confirmed` ausente y produce exactamente `PASS BLOCK_UNCONFIRMED_ACTION MISSING:confirmed`.",
        feedback: "S51-T4-A-E2: explica qué campo cambió la decisión, por qué el adverso activa BLOCK_UNCONFIRMED_ACTION y por qué faltar confirmed exige ASK_USER_TO_CONFIRM.",
        starterCode: {
          language: 'python',
          title: "s51-t4-a-e2.py",
          code: `# CASO-LIM-051 · assess contestability fields
# DEFECT: PASS sin uncertainty/citations/confirmación humana
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "uncertainty_shown", "citations_resolve", "effect_summary", "confirmation_required", "confirmed"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if not record["uncertainty_shown"] or not record["citations_resolve"] or not record["confirmed"] else "BLOCK_UNCONFIRMED_ACTION"

valid = {"case_id": "CASO-MOQ-051-4A", **{"uncertainty_shown":True,"citations_resolve":True,"effect_summary":"prepara borrador","confirmation_required":True,"confirmed":True}}
invalid = {"case_id": "CASO-MOQ-051-4A", **{"uncertainty_shown":False,"citations_resolve":False,"effect_summary":"","confirmation_required":True,"confirmed":False}}
incomplete = {**valid}
incomplete.pop("confirmed")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s51-t4-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "uncertainty_shown", "citations_resolve", "effect_summary", "confirmation_required", "confirmed"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["uncertainty_shown"] and record["citations_resolve"] and bool(record["effect_summary"]) and (not record["confirmation_required"] or record["confirmed"]) else "BLOCK_UNCONFIRMED_ACTION"

valid = {"case_id": "CASO-MOQ-051-4A", **{"uncertainty_shown":True,"citations_resolve":True,"effect_summary":"prepara borrador","confirmation_required":True,"confirmed":True}}
invalid = {"case_id": "CASO-MOQ-051-4A", **{"uncertainty_shown":False,"citations_resolve":False,"effect_summary":"","confirmation_required":True,"confirmed":False}}
incomplete = {**valid}
incomplete.pop("confirmed")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS BLOCK_UNCONFIRMED_ACTION MISSING:confirmed` ,
        },
      },
      {
        id: "S51-T4-A-E3",
        subtopicId: "S51-T4-A",
        kind: "transfer",
        instruction: "S51-T4-A-E3 · Aísla fallo cerrado para `incertidumbre, citas y confirmaciones` con tres fixtures distintos. `CASO-MOQ-051-4A` debe continuar, el adverso debe devolver `BLOCK_UNCONFIRMED_ACTION` y la ausencia de `confirmed` debe devolver `ASK_USER_TO_CONFIRM`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `ASK_USER_TO_CONFIRM` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `ASK_USER_TO_CONFIRM` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró incertidumbre/citas visibles y efecto confirmado; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta confirmed", "fixture adverso: incertidumbre/citas visibles y efecto confirmado", "CASO-MOQ-051-4A es sintético"],
        tests: "Fixtures `CASO-MOQ-051-4A`, adverso y sin `confirmed` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S51-T4-A-E3: explica qué campo cambió la decisión, por qué el adverso activa BLOCK_UNCONFIRMED_ACTION y por qué faltar confirmed exige ASK_USER_TO_CONFIRM.",
        starterCode: {
          language: 'python',
          title: "s51-t4-a-e3.py",
          code: `# CASO-LIM-051 · decide restore contestability
# DEFECT: missing→CONTINUE; no bloqueo UX
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "uncertainty_shown", "citations_resolve", "effect_summary", "confirmation_required", "confirmed"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if not record["uncertainty_shown"] or not record["citations_resolve"] or not record["confirmed"] else "BLOCK_UNCONFIRMED_ACTION"

valid = {"case_id": "CASO-MOQ-051-4A", **{"uncertainty_shown":True,"citations_resolve":True,"effect_summary":"prepara borrador","confirmation_required":True,"confirmed":True}}
invalid = {"case_id": "CASO-MOQ-051-4A", **{"uncertainty_shown":False,"citations_resolve":False,"effect_summary":"","confirmation_required":True,"confirmed":False}}
uncertain = {**valid}
uncertain.pop("confirmed")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s51-t4-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "uncertainty_shown", "citations_resolve", "effect_summary", "confirmation_required", "confirmed"}
    missing = sorted(required - record.keys())
    if missing:
        return "ASK_USER_TO_CONFIRM"
    return "CONTINUE" if record["uncertainty_shown"] and record["citations_resolve"] and bool(record["effect_summary"]) and (not record["confirmation_required"] or record["confirmed"]) else "BLOCK_UNCONFIRMED_ACTION"

valid = {"case_id": "CASO-MOQ-051-4A", **{"uncertainty_shown":True,"citations_resolve":True,"effect_summary":"prepara borrador","confirmation_required":True,"confirmed":True}}
invalid = {"case_id": "CASO-MOQ-051-4A", **{"uncertainty_shown":False,"citations_resolve":False,"effect_summary":"","confirmation_required":True,"confirmed":False}}
uncertain = {**valid}
uncertain.pop("confirmed")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "BLOCK_UNCONFIRMED_ACTION", "ASK_USER_TO_CONFIRM"]` ,
          output: `CONTINUE BLOCK_UNCONFIRMED_ACTION ASK_USER_TO_CONFIRM` ,
        },
      },
      {
        id: "S51-T4-B-E1",
        subtopicId: "S51-T4-B",
        kind: "guided",
        instruction: "S51-T4-B-E1 · Decide el contrato de `accesibilidad, corrección y contestabilidad` sobre `CASO-MOQ-051-4B`. La entrada es el dict completo del starter; la operación debe demostrar teclado/lector/contraste y corrección/apelación. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S51-T4-B PASS`; la misma operación sobre el fixture adverso debe activar `FAIL_ACCESSIBILITY_GATE` en E2.",
        hint: "Relaciona los campos `keyboard_complete`, `screen_reader_labels`, `contrast_ratio`, `min_contrast`, `correction_available`, `appeal_to_human` con la regla explicada en S51-T4-B.",
        hints: [
          "Relaciona los campos `keyboard_complete`, `screen_reader_labels`, `contrast_ratio`, `min_contrast`, `correction_available`, `appeal_to_human` con la regla explicada en S51-T4-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva flujo WCAG y apelación completables; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta appeal_to_human", "fixture adverso: teclado/lector/contraste y corrección/apelación", "CASO-MOQ-051-4B es sintético"],
        tests: "El fixture `CASO-MOQ-051-4B` satisface un predicado de dominio real; imprime `S51-T4-B PASS` y el assert booleano pasa.",
        feedback: "S51-T4-B-E1: explica qué campo cambió la decisión, por qué el adverso activa FAIL_ACCESSIBILITY_GATE y por qué faltar appeal_to_human exige ROUTE_CONTESTATION.",
        starterCode: {
          language: 'python',
          title: "s51-t4-b-e1.py",
          code: `# CASO-LIM-051 · a11y + appeal gate
# DEFECT: keyboard/contrast/appeal invertidos
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-MOQ-051-4B", **{"keyboard_complete":True,"screen_reader_labels":True,"contrast_ratio":5.1,"min_contrast":4.5,"correction_available":True,"appeal_to_human":True}}
meets_contract = not record["keyboard_complete"] or record["contrast_ratio"] < record["min_contrast"] or not record["appeal_to_human"]
status = "PASS" if meets_contract else "FAIL_ACCESSIBILITY_GATE"
print("S51-T4-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s51-t4-b-e1.py",
          code: `record = {"case_id": "CASO-MOQ-051-4B", **{"keyboard_complete":True,"screen_reader_labels":True,"contrast_ratio":5.1,"min_contrast":4.5,"correction_available":True,"appeal_to_human":True}}
meets_contract = record["keyboard_complete"] and record["screen_reader_labels"] and record["contrast_ratio"] >= record["min_contrast"] and record["correction_available"] and record["appeal_to_human"]
status = "PASS" if meets_contract else "FAIL_ACCESSIBILITY_GATE"
print("S51-T4-B", status)
assert meets_contract is True` ,
          output: `S51-T4-B PASS` ,
        },
      },
      {
        id: "S51-T4-B-E2",
        subtopicId: "S51-T4-B",
        kind: "independent",
        instruction: "S51-T4-B-E2 · Filtra tres rutas de `accesibilidad, corrección y contestabilidad`: fixture válido, fixture adverso y registro sin `appeal_to_human`. Entrada: dict con case_id, keyboard_complete, screen_reader_labels, contrast_ratio, min_contrast, correction_available, appeal_to_human. Salidas exactas: `PASS`, `FAIL_ACCESSIBILITY_GATE`, `MISSING:appeal_to_human`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a appeal_to_human debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a appeal_to_human debe ocurrir antes de esa rama.",
          "Después aplica la regla de S51-T4-B: teclado/lector/contraste y corrección/apelación. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta appeal_to_human", "fixture adverso: teclado/lector/contraste y corrección/apelación", "CASO-MOQ-051-4B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `appeal_to_human` ausente y produce exactamente `PASS FAIL_ACCESSIBILITY_GATE MISSING:appeal_to_human`.",
        feedback: "S51-T4-B-E2: explica qué campo cambió la decisión, por qué el adverso activa FAIL_ACCESSIBILITY_GATE y por qué faltar appeal_to_human exige ROUTE_CONTESTATION.",
        starterCode: {
          language: 'python',
          title: "s51-t4-b-e2.py",
          code: `# CASO-LIM-051 · assess a11y completeness
# DEFECT: PASS sin screen reader/contrast/appeal
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "keyboard_complete", "screen_reader_labels", "contrast_ratio", "min_contrast", "correction_available", "appeal_to_human"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if not record["keyboard_complete"] or record["contrast_ratio"] < record["min_contrast"] or not record["appeal_to_human"] else "FAIL_ACCESSIBILITY_GATE"

valid = {"case_id": "CASO-MOQ-051-4B", **{"keyboard_complete":True,"screen_reader_labels":True,"contrast_ratio":5.1,"min_contrast":4.5,"correction_available":True,"appeal_to_human":True}}
invalid = {"case_id": "CASO-MOQ-051-4B", **{"keyboard_complete":False,"screen_reader_labels":False,"contrast_ratio":2.1,"min_contrast":4.5,"correction_available":False,"appeal_to_human":False}}
incomplete = {**valid}
incomplete.pop("appeal_to_human")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s51-t4-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "keyboard_complete", "screen_reader_labels", "contrast_ratio", "min_contrast", "correction_available", "appeal_to_human"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["keyboard_complete"] and record["screen_reader_labels"] and record["contrast_ratio"] >= record["min_contrast"] and record["correction_available"] and record["appeal_to_human"] else "FAIL_ACCESSIBILITY_GATE"

valid = {"case_id": "CASO-MOQ-051-4B", **{"keyboard_complete":True,"screen_reader_labels":True,"contrast_ratio":5.1,"min_contrast":4.5,"correction_available":True,"appeal_to_human":True}}
invalid = {"case_id": "CASO-MOQ-051-4B", **{"keyboard_complete":False,"screen_reader_labels":False,"contrast_ratio":2.1,"min_contrast":4.5,"correction_available":False,"appeal_to_human":False}}
incomplete = {**valid}
incomplete.pop("appeal_to_human")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS FAIL_ACCESSIBILITY_GATE MISSING:appeal_to_human` ,
        },
      },
      {
        id: "S51-T4-B-E3",
        subtopicId: "S51-T4-B",
        kind: "transfer",
        instruction: "S51-T4-B-E3 · Demuestra fallo cerrado para `accesibilidad, corrección y contestabilidad` con tres fixtures distintos. `CASO-MOQ-051-4B` debe continuar, el adverso debe devolver `FAIL_ACCESSIBILITY_GATE` y la ausencia de `appeal_to_human` debe devolver `ROUTE_CONTESTATION`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `ROUTE_CONTESTATION` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `ROUTE_CONTESTATION` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró teclado/lector/contraste y corrección/apelación; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta appeal_to_human", "fixture adverso: teclado/lector/contraste y corrección/apelación", "CASO-MOQ-051-4B es sintético"],
        tests: "Fixtures `CASO-MOQ-051-4B`, adverso y sin `appeal_to_human` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S51-T4-B-E3: explica qué campo cambió la decisión, por qué el adverso activa FAIL_ACCESSIBILITY_GATE y por qué faltar appeal_to_human exige ROUTE_CONTESTATION.",
        starterCode: {
          language: 'python',
          title: "s51-t4-b-e3.py",
          code: `# CASO-LIM-051 · decide restore a11y evidence
# DEFECT: missing→CONTINUE; no hold de accesibilidad
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "keyboard_complete", "screen_reader_labels", "contrast_ratio", "min_contrast", "correction_available", "appeal_to_human"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if not record["keyboard_complete"] or record["contrast_ratio"] < record["min_contrast"] or not record["appeal_to_human"] else "FAIL_ACCESSIBILITY_GATE"

valid = {"case_id": "CASO-MOQ-051-4B", **{"keyboard_complete":True,"screen_reader_labels":True,"contrast_ratio":5.1,"min_contrast":4.5,"correction_available":True,"appeal_to_human":True}}
invalid = {"case_id": "CASO-MOQ-051-4B", **{"keyboard_complete":False,"screen_reader_labels":False,"contrast_ratio":2.1,"min_contrast":4.5,"correction_available":False,"appeal_to_human":False}}
uncertain = {**valid}
uncertain.pop("appeal_to_human")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s51-t4-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "keyboard_complete", "screen_reader_labels", "contrast_ratio", "min_contrast", "correction_available", "appeal_to_human"}
    missing = sorted(required - record.keys())
    if missing:
        return "ROUTE_CONTESTATION"
    return "CONTINUE" if record["keyboard_complete"] and record["screen_reader_labels"] and record["contrast_ratio"] >= record["min_contrast"] and record["correction_available"] and record["appeal_to_human"] else "FAIL_ACCESSIBILITY_GATE"

valid = {"case_id": "CASO-MOQ-051-4B", **{"keyboard_complete":True,"screen_reader_labels":True,"contrast_ratio":5.1,"min_contrast":4.5,"correction_available":True,"appeal_to_human":True}}
invalid = {"case_id": "CASO-MOQ-051-4B", **{"keyboard_complete":False,"screen_reader_labels":False,"contrast_ratio":2.1,"min_contrast":4.5,"correction_available":False,"appeal_to_human":False}}
uncertain = {**valid}
uncertain.pop("appeal_to_human")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "FAIL_ACCESSIBILITY_GATE", "ROUTE_CONTESTATION"]` ,
          output: `CONTINUE FAIL_ACCESSIBILITY_GATE ROUTE_CONTESTATION` ,
        },
      },
    ],
  },
  youDo: {
    title: "[FINAL] Observabilidad, gobernanza y UX del copiloto (CP-N4-C (cierre) + CF-5 + Level-4 regression)",
    context: "Auditable AI Operations Copilot y CF-5. Trabaja sobre operación sintética de un copiloto para una entidad ficticia en Moquegua. Entrada: trace id, versiones de prompt/modelo/dataset, evidencia, feedback y política. Salida: dashboard redactado, SLO, audit trail y mecanismo de corrección o apelación. El gate se bloquea ante: PII en trace, versión desconocida, drift o acción irreversible activa incidente y rollback.",
    objectives: [
      "Convertir trace id, versiones de prompt/modelo/dataset, evidencia, feedback y política en dashboard redactado, SLO, audit trail y mecanismo de corrección o apelación.",
      "Demostrar el gate: se puede reconstruir qué respondió, qué citó, qué tool llamó, quién aprobó y cómo revertir.",
      "Probar el fallo: PII en trace, versión desconocida, drift o acción irreversible activa incidente y rollback.",
      "Entregar evidencia reproducible, redactada, sin PII real, secretos ni servicios externos obligatorios.",
    ],
    requirements: [
      "Usa exclusivamente fixtures sintéticos identificados por `CASO-MOQ-051`.",
      "Incluye traces de prompt/retrieval/tool con redacción.",
      "Incluye registry y change log de versiones.",
      "Incluye SLO/drift/feedback/incidente/postmortem.",
      "Incluye UX accesible con incertidumbre, citas, confirmación y contestabilidad.",
      "Automatiza un caso normal, uno de breach (`ROLLBACK_COPILOT`) y uno incierto (`ESCALATE_TO_OWNER`).",
      "Incluye comandos locales reproducibles, dependencias fijadas y salida esperada.",
      "Registra riesgo residual, responsable, criterio de rollback y limitaciones conocidas.",
    ],
    starterCode: `CASE_ID = "CASO-MOQ-051"
REQUIRED = ['traces_de_prompt_retrieval_tool_con_redaccion', 'registry_y_change_log_de_versiones', 'slo_drift_feedback_incidente_postmortem', 'ux_accesible_con_incertidumbre_citas_confirmacion_y_contestabili']
evidence = {
    "traces_de_prompt_retrieval_tool_con_redaccion": False,
    "registry_y_change_log_de_versiones": False,
    "slo_drift_feedback_incidente_postmortem": False,
    "ux_accesible_con_incertidumbre_citas_confirmacion_y_contestabili": False
}

def readiness(bundle: dict[str, bool]) -> tuple[str, list[str]]:
    missing = [name for name in REQUIRED if bundle.get(name) is not True]
    return ("READY", []) if not missing else ("BLOCKED", missing)

status, missing = readiness(evidence)
print(CASE_ID, status)
print("missing", ",".join(missing))
assert status in {"READY", "BLOCKED"}
`,
    portfolioNote: "Evidencia de CP-N4-C + CF-5 · copiloto observable y contestable: muestra baseline, decisión, pruebas, resultado medido, rollback y riesgo residual. El checklist inicia en BLOCKED por diseño; conviértelo en READY enlazando artefactos reales del proyecto, no cambiando asserts.",
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
        question: "¿Qué evidencia permite aprobar `traces de prompts/retrieval/tools` en CASO-MOQ-051?",
        options: ["un print sin assert ni versión", "una captura de pantalla sin fuente", "trace reconstruible sin PII", "datos personales reales para que parezca auténtico"],
        correctIndex: 2,
        explanation: "La teoría exige trace reconstruible sin PII; evidencia decorativa o PII no satisface el contrato.",
      },
      {
        question: "Si ocurre la condición de error de S51, ¿qué respuesta preserva seguridad y auditabilidad?",
        options: ["emitir ROLLBACK_COPILOT y conservar evidencia", "continuar y ocultar el warning", "inventar evidencia faltante", "borrar el trace para reducir ruido"],
        correctIndex: 0,
        explanation: "El contrato falla cerrado con ROLLBACK_COPILOT; no convierte incertidumbre o breach en éxito.",
      },
      {
        question: "¿Cuál resultado demuestra el gate `CP-N4-C + CF-5 · copiloto observable y contestable`?",
        options: ["el archivo S51 existe, aunque no pruebe el gate", "se puede reconstruir qué respondió, qué citó, qué tool llamó, quién aprobó y cómo revertir", "el README afirma que funciona", "se usó la herramienta más nueva"],
        correctIndex: 1,
        explanation: "El gate es conductual y medible: se puede reconstruir qué respondió, qué citó, qué tool llamó, quién aprobó y cómo revertir.",
      },
      {
        question: "¿Qué tratamiento de `CASO-MOQ-051` respeta el alcance del curso?",
        options: ["reemplazarlo por datos reales sin consentimiento", "subir secretos para facilitar la demo", "inferir fraude o parentesco desde ER", "mantenerlo sintético, mínimo, trazable y sujeto a revisión humana"],
        correctIndex: 3,
        explanation: "Los casos son sintéticos; ER solo propone correspondencia de entidad y no prueba fraude, parentesco ni riesgo.",
      },
      {
        question: "Un trace de copiloto con spans completos pero `pii_in_trace=True`, ¿qué acción es correcta en S51?",
        options: ["Promover a producción porque los spans están completos", "Borrar el audit log para ocultar el PII", "REDACT_AND_QUARANTINE_TRACE y bloquear promoción hasta re-redacción", "Inferir fraude del usuario a partir del prompt"],
        correctIndex: 2,
        explanation:
          "PII en traza invalida el contrato de observabilidad: se redacte y se cuarentena; no se promueve ni se usa la traza como prueba de culpabilidad.",
      },

    ],
  },
  resources: {
    docs: [
      {
        label: "OpenTelemetry",
        url: "https://opentelemetry.io/docs/",
        note: "Traces, metrics y logs correlacionados",
      },
      {
        label: "OpenTelemetry — Semantic conventions",
        url: "https://opentelemetry.io/docs/specs/semconv/",
        note: "Atributos estándar de spans",
      },
      {
        label: "W3C WCAG 2.2",
        url: "https://www.w3.org/TR/WCAG22/",
        note: "Accesibilidad verificable",
      },
      {
        label: "NIST AI RMF",
        url: "https://www.nist.gov/itl/ai-risk-management-framework",
        note: "Gobernanza y operación de riesgo",
      },
      {
        label: "Google Model Cards",
        url: "https://modelcards.withgoogle.com/about",
        note: "System/model cards del copiloto",
      },
      {
        label: "SRE — Service Level Objectives",
        url: "https://sre.google/sre-book/service-level-objectives/",
        note: "SLO y error budget",
      },
      {
        label: "SRE — Postmortem Culture",
        url: "https://sre.google/sre-book/postmortem-culture/",
        note: "Postmortems sin culpa",
      },
      {
        label: "MLflow Model Registry",
        url: "https://mlflow.org/docs/latest/model-registry.html",
        note: "Versionado de modelos y stages",
      },
    ],
    books: [
      { label: "Site Reliability Engineering", note: "Incidentes, postmortems y SLO" },
      { label: "Inclusive Design / a11y practice", note: "Contestabilidad y UX" },
    ],
    courses: [
      { label: "Coursera — observability / SRE tracks", url: "https://www.coursera.org/courses?query=observability", note: "Observabilidad y ops" },
      { label: "MIT 6.100L", url: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/", note: "Contratos verificables" },
      { label: "Harvard CS50P", url: "https://cs50.harvard.edu/python/", note: "Tests y proyectos reproducibles" },
      { label: "deeplearning.ai — production LLM courses", url: "https://www.deeplearning.ai/", note: "Ops de sistemas LLM" },
    ],
  },
}
