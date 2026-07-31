import type { CourseSection } from '../../types'

export const section51: CourseSection = {
  id: "integrator-final",
  index: 51,
  title: "Observabilidad, gobernanza y UX del copiloto",
  shortTitle: "Obs y UX copiloto",
  tagline: "Auditable AI Operations Copilot con system card y dashboard; CF-5 congela artefactos e interfaces",
  estimatedHours: 20,
  level: "Producción gobernada",
  phase: 3,
  icon: "Crown",
  accentColor: "bg-gradient-to-br from-amber-500 to-red-600",
  jobRelevance:
    "En equipos de plataforma y producto (bancos, fintechs y ops digitales en Perú y LatAm), el rol de AI/Platform Engineer no termina al desplegar el copiloto: te piden demostrar qué versión respondió, qué citó, qué tool llamó, quién aprobó el release y cómo hacer rollback. Aquí aprendes a montar un dashboard redactado, SLO con owner, audit trail append-only (que solo se puede agregar, no borrar) y flujos de corrección y apelación. Es lo que convierte un demo en un producto defendible.",
  learningOutcomes: [
    { text: "Construir una traza reconstruible (prompt/retrieval/tool/answer) con `trace_id` y sin PII exportable" },
    { text: "Reconciliar tokens por etapa, validar p95 ≤ SLO y demostrar redacción de atributos sensibles" },
    { text: "Pinear un release inmutable (modelo/prompt/dataset/índice) y rechazar `latest` en producción" },
    { text: "Aplicar dual-control, scope least-privilege, retención acotada y audit append-only" },
    { text: "Evaluar multi-SLI (availability, faithfulness, drift) con owner y error budget antes de reentrenar" },
    { text: "Ejecutar contención → rollback dentro de RTO → post mortem blameless con acciones y dueños" },
    { text: "Diseñar UX con incertidumbre visible, citas resolubles y confirmación antes de side-effects" },
    { text: "Cerrar CF-5 con WCAG AA (teclado, contraste, labels) más corrección y apelación humana" },
  ],
  theory: [
    {
      heading: "Ruta de S51: Observabilidad, gobernanza y UX del copiloto",
      paragraphs: [
        "**Diccionario de la sección** (léelo antes de T1). **Trace:** correlación prompt/retrieval/tool/respuesta con versiones. **Redacción:** PII fuera de logs exportables. **Tokens, costo y latencia:** SLI del copiloto. **Registro de artefactos:** modelo, prompt, dataset versionados. **Audit trail:** quién aprobó qué. **Drift y feedback:** señales de desalineación. **Post mortem blameless:** aprendizaje sin culpas. **Contestabilidad:** corrección y apelación del usuario. **CF-5:** congela interfaces y artefactos para integración final. **a11y:** accesibilidad (WCAG) del UI del copiloto. **SLO:** objetivo de nivel de servicio (umbral medible de calidad). **SLI:** indicador que alimenta el SLO (disponibilidad, faithfulness, drift). **Error budget:** margen de fallos permitido antes de congelar releases. **Burn:** tasa de consumo del error budget. **RTO:** tiempo objetivo de recuperación tras un incidente.",
        "Esta sección parte de S50 (evals y red team) y opera el **copiloto en producción controlada**: traces, registry, SLO/incidentes y UX contestable. El caso `CASO-MOQ-051` (Moquegua sintético) se ejecuta sin credenciales ni servicios externos. Hallazgos de S50 (eval fallida, prompt inyectable) se convierten aquí en **señales de ops**: drift slice, incidente o freeze de release — no se reentrenan a ciegas.",
        "Producto incremental: **Auditable AI Operations Copilot** y freeze **CF-5**. Entrada: trace id, versiones de prompt/modelo/dataset, evidencia, feedback y política. Salida: dashboard **redactado**, SLO con owner, audit trail append-only y mecanismo de corrección/apelación. Error: PII en sink o release sin pin de versiones. Los artefactos se **acumulan** de T1 a T4: traza → métricas → bundle pinneado → ticket de cambio → alerta SLO → timeline de incidente → confirmación UX → ruta de apelación.",
        "Orden de aprendizaje: T1 traces y redacción → T2 registry y auditoría → T3 SLO e incidentes → T4 UX contestable y a11y. Cada tema cierra con un artefacto comprobable del **Auditable AI Operations Copilot**. Practicas solo con **stdlib** y fixtures sintéticos: sin telemetría real de PII ni backends externos obligatorios.",
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
        content:
          "Evidencia mínima para cerrar el primer subtema: caso sintético con asserts locales. Si no tienes esa evidencia, repite el laboratorio antes de avanzar.",
      },
    },
    {
      heading: "Traces de prompts, retrieval y tools",
      subtopicId: "S51-T1-A",
      paragraphs: [
        "Un **trace** correlaciona **prompt template**, **retrieval**, **tool calls** y **respuesta** con **versiones** (prompt/modelo/índice) y un **trace_id** de correlación (prefijo `tr-`). En ops de IA se modela como árbol de **spans** padre/hijo (prompt → retrieval → tool → answer) con atributos por span, no como tres strings sueltos. Sin correlación no hay auditoría: no se puede reconstruir «qué se citó y qué tool se llamó».",
        "**Redacta PII y secrets antes de exportar** a backends de observabilidad; los raw logs con datos personales son un incidente, no un «detalle de ops». Este artefacto alimenta el registry y el dashboard de T1-B en adelante.",
        "Contrato de traza reconstruible. Entrada: `trace_id` (prefijo `tr-`), `prompt_ver` pinneado, lista de citas y nombre de tool. Salida: dict con `status` PASS o acción fail-closed (ante duda, bloquea o cuarentena) y la lista de spans presentes. Error: `pii=True`, spans incompletos, tool omitido o versión vacía → `REDACT_AND_QUARANTINE_TRACE` o `RESTORE_TRACE_CONTEXT`. Criterio CF-5: un auditor de Moquegua sintético reconstruye la decisión **sin** secretos en el sink.",
        "En `CASO-MOQ-051-1A`, el copiloto de la entidad ficticia en Moquegua atiende un ticket sintético de consulta de expediente: el on-call debe ver en el dashboard la traza `tr-moq-51` con spans `prompt/retrieval/tool/answer`, citas `c1` y tool `get_case`. Si el export incluye email o prompt_raw, se cuarentena la traza; ninguna señal del caso prueba fraude ni parentesco.",
      ],
      code: {
        language: 'python',
        title: "traces_prompts_retrieval_tools.py",
        code: `def build_trace(trace_id: str, prompt_ver: str, cites: list, tool: str, pii: bool) -> dict:
    if pii:
        return {"status": "REDACT_AND_QUARANTINE_TRACE", "trace_id": trace_id}
    required = {"prompt", "retrieval", "tool", "answer"}
    spans = [
        {"name": "prompt", "ver": prompt_ver},
        {"name": "retrieval", "cites": list(cites)},
        {"name": "tool", "call": tool},
        {"name": "answer", "pinned": True},
    ]
    names = {s["name"] for s in spans}
    ok = (
        names >= required
        and str(trace_id).startswith("tr-")
        and bool(prompt_ver)
        and bool(tool)
    )
    return {
        "status": "PASS" if ok else "RESTORE_TRACE_CONTEXT",
        "spans": [s["name"] for s in spans],
        "cites": list(cites),
    }

print(build_trace("tr-moq-51", "p3", ["c1"], "get_case", False))
print(build_trace("tr-moq-51", "p3", ["c1"], "get_case", True)["status"])`,
        output: `{'status': 'PASS', 'spans': ['prompt', 'retrieval', 'tool', 'answer'], 'cites': ['c1']}
REDACT_AND_QUARANTINE_TRACE`,
      },
      callout: {
        type: "danger",
        title: "PII en el sink = incidente",
        content:
          "Exportar `prompt_raw`, email o tokens a logs es breach (violación del contrato): `REDACT_AND_QUARANTINE_TRACE`. Antes de cerrar este subtema, ejecuta el contrato sobre el caso sintético y documenta el riesgo residual.",
      },
    },
    {
      heading: "Tokens, costo, latencia y redacción",
      subtopicId: "S51-T1-B",
      paragraphs: [
        "**Tokens, costo y latencia** se miden **por etapa** (prompt build, retrieval, generation, tools) y por **percentil** (p50/p95), no solo media. Un p95 de 5 s con media de 200 ms es un incidente de UX, no un «pico normal». El **costo** se deriva de tokens × precio por etapa; si la suma por etapa no reconcilia `total_tokens`, el dashboard miente. **Redacción** aplica a atributos, eventos, payloads y mensajes de error: un stack trace con email o Authorization es PII en el sink.",
        "Contrato de costo y latencia. Entrada: contadores de tokens por etapa (prompt, retrieval, generation), latencias p50/p95 y un sink de atributos. Salida: fila de dashboard con suma de tokens reconciliada, p95 ≤ SLO y **prueba de redacción** (email/token ausentes del export). Error: media en lugar de percentil, total que no cuadra, o PII en atributos → `ALERT_COST_LATENCY` / `FIX_REDACTION_PIPELINE`. Criterio: un on-call explica el costo de `CASO-MOQ-051` sin abrir raw logs.",
        "En `CASO-MOQ-051-1B`, el dashboard de la entidad ficticia de Moquegua muestra 800+400+300=1500 tokens y p95=900 ms (SLO 1200 ms). Antes de exportar, los atributos `email` y `prompt_raw` se reemplazan por `[REDACTED]`. Ningún campo del caso prueba fraude o parentesco; solo calidad y privacidad operativa del sistema.",
      ],
      code: {
        language: 'python',
        title: "tokens_cost_latency_redaction.py",
        code: `SENSITIVE = {"email", "authorization", "prompt_raw"}
# Precio sintético USD por 1k tokens (solo fixture de enseñanza)
PRICE_PER_1K = 0.002

def redact_attr(key: str, value: str) -> str:
    if key in SENSITIVE or "@" in value:
        return "[REDACTED]"
    return value

def stage_metrics(prompt_t: int, retr_t: int, gen_t: int, p95_ms: int, slo_ms: int) -> dict:
    total = prompt_t + retr_t + gen_t
    cost_usd = round(total / 1000 * PRICE_PER_1K, 6)
    attrs = {
        "email": redact_attr("email", "ana@example.pe"),
        "model": redact_attr("model", "m-2"),
    }
    return {
        "total_tokens": total,
        "cost_usd": cost_usd,
        "p95_ok": p95_ms <= slo_ms,
        "attrs": attrs,
        "export_clean": attrs["email"] == "[REDACTED]",
    }

m = stage_metrics(800, 400, 300, 900, 1200)
print(m["total_tokens"], m["cost_usd"], m["p95_ok"], m["attrs"]["email"], m["export_clean"])
assert m["total_tokens"] == 1500 and m["cost_usd"] == 0.003 and m["export_clean"]`,
        output: `1500 0.003 True [REDACTED] True`,
      },
      callout: {
        type: "warning",
        title: "Percentil, no solo media",
        content:
          "En tu revisión, exige siempre la salida esperada del contrato y un comportamiento fail-closed ante cualquier breach de costo, latencia o redacción.",
      },
    },
    {
      heading: "Registro de modelo, prompt y dataset",
      subtopicId: "S51-T2-A",
      paragraphs: [
        "Con la traza `tr-moq-51` y el dashboard de tokens/p95 de T1 ya redactado, el **registry** fija qué versión generó cada respuesta. Identifica **modelo, prompt, dataset, índice y evaluador** con IDs inmutables; un **release** apunta a un **bundle versionado** (system card + eval digest), no a `latest`. Responder en producción sin pin es drift silencioso: no hay rollback ni post mortem reproducible. El anti-patrón clásico es desplegar con `model=latest` y descubrir el cambio solo cuando falla la calidad.",
        "Contrato de registry inmutable. Entrada: dict de artefactos (`release`, `model`, `prompt`, `dataset`, `index`, `evaluator`) y flag `immutable`. Salida: bundle ordenado pinneado **o** `FREEZE_RELEASE_BUNDLE` si aparece `latest`/vacío/`immutable=False`. Error: versión desconocida o mutable en prod. Criterio: cada respuesta del copiloto se enlaza a un release reproducible (`copilot-7` → `m2/p3/d5`) que el auditor puede cruzar con el `trace_id` de T1.",
        "En `CASO-MOQ-051-2A`, el equipo de la entidad ficticia de Moquegua congela el release `copilot-7` con modelo `m2`, prompt `p3` y dataset de eval `d5`. Un intento de promover `model=latest` se rechaza y se emite freeze; el system card queda enlazado al bundle. No hay PII real ni inferencia de fraude o parentesco.",
      ],
      code: {
        language: 'python',
        title: "registry_model_prompt_dataset.py",
        code: `def pin_release(items: dict, immutable: bool) -> dict:
    keys = ("release", "model", "prompt", "dataset", "index", "evaluator")
    if not immutable:
        return {"status": "FREEZE_RELEASE_BUNDLE", "reason": "mutable"}
    bad = [k for k in keys if not items.get(k) or items.get(k) == "latest"]
    if bad:
        return {"status": "FREEZE_RELEASE_BUNDLE", "reason": ",".join(bad)}
    return {
        "status": "PASS",
        "bundle": sorted((k, items[k]) for k in keys if k in items),
        "system_card_link": f"card://{items['release']}",
    }

good = {"release": "copilot-7", "model": "m2", "prompt": "p3", "dataset": "d5", "index": "i4", "evaluator": "e2"}
print(pin_release(good, True)["status"], pin_release(good, True)["system_card_link"])
print(pin_release({**good, "model": "latest"}, True)["status"])
print(pin_release(good, False)["status"])`,
        output: `PASS card://copilot-7
FREEZE_RELEASE_BUNDLE
FREEZE_RELEASE_BUNDLE`,
      },
      callout: {
        type: "warning",
        title: "Prohibido latest en prod",
        content:
          "No promociones un release a producción sin evidencia de bundle pinneado e inmutable; `latest` o cualquier artefacto vacío son un freeze automático.",
      },
    },
    {
      heading: "Cambio, acceso, retención y auditoría",
      subtopicId: "S51-T2-B",
      paragraphs: [
        "El bundle `copilot-7` de T2-A no se promueve solo. **Change control** registra autor, aprobador y riesgo residual (**segregación de funciones**: quien escribe no se auto-aprueba). **Acceso y retención** son mínimos (need-to-know + TTL corto en ops-read). El **audit log** es **append-only** para eventos de decisión, pero también se **depura** según política legal: retención ≠ eternidad de PII. Sin ambos, no hay gobernanza operable sobre el registry.",
        "Contrato de dual-control. Entrada: `author`, `approver`, `risk`, `access_scope`, `retention_days`, `audit_append_only`. Salida: ticket de cambio auditable o `REJECT_UNGOVERNED_CHANGE`. Error: author==approver, scope admin, retención excesiva o audit no append-only. Si falta evidencia de aprobación independiente → `REQUEST_INDEPENDENT_APPROVAL`. Criterio: se reconstruye quién promovió `copilot-7`, con qué riesgo residual y bajo qué scope.",
        "En `CASO-MOQ-051-2B`, `dev-a` propone el release y `owner-b` lo aprueba con riesgo `medium`, scope `ops-read` y retención 30 días en el audit de la entidad ficticia de Moquegua. Un self-approve o `global-admin` se rechaza. El caso no contiene PII real ni prueba de fraude/parentesco.",
      ],
      code: {
        language: 'python',
        title: "change_access_retention_audit.py",
        code: `def assess_change(ticket: dict) -> str:
    required = {"author", "approver", "risk", "access_scope", "retention_days", "audit_append_only"}
    if missing := sorted(required - ticket.keys()):
        return "REQUEST_INDEPENDENT_APPROVAL"
    ok = (
        ticket["author"] != ticket["approver"]
        and ticket["risk"] in {"low", "medium", "high"}
        and str(ticket["access_scope"]).endswith("-read")
        and ticket["retention_days"] <= 30
        and ticket["audit_append_only"] is True
    )
    return "PASS" if ok else "REJECT_UNGOVERNED_CHANGE"

good = {
    "author": "dev-a", "approver": "owner-b", "risk": "medium",
    "access_scope": "ops-read", "retention_days": 30, "audit_append_only": True,
}
bad = {**good, "author": "dev-a", "approver": "dev-a", "access_scope": "global-admin"}
print(assess_change(good), assess_change(bad))
print(assess_change({"author": "dev-a"}))`,
        output: `PASS REJECT_UNGOVERNED_CHANGE
REQUEST_INDEPENDENT_APPROVAL`,
      },
      callout: {
        type: "warning",
        title: "Self-approve = change no gobernado",
        content:
          "Un cambio sin aprobador independiente, con scope admin o sin audit append-only se rechaza como cambio no gobernado.",
      },
    },
    {
      heading: "SLO, feedback y drift",
      subtopicId: "S51-T3-A",
      paragraphs: [
        "Con release pinneado y change ticket de T2, el **SLO** (objetivo de nivel de servicio) del copiloto combina **disponibilidad**, **calidad** (faithfulness / abstain rate) y **latencia** con **error budget** (margen de fallos permitido antes de congelar releases). Si quemas el presupuesto, se detienen releases: no se «optimiza» en silencio. El **feedback** de usuarios es señal **sesgada** (quien se queja no es la población); **drift** exige slices, baseline y **dueño** antes de actuar — no reentrenar por un spike de thumbs-down. Un hallazgo de red team de S50 puede abrir el mismo slice de drift y, si persiste, el incidente de T3-B.",
        "Contrato de SLO multi-SLI. Entrada: `availability`, `faithfulness`, umbrales SLO, `drift`/`max_drift` y `owner` del runbook. Salida: alerta accionable (`OPEN_COPILOT_INCIDENT`) o `PASS` con owner visible y tasa de consumo del error budget calculable. Error: SLI bajo umbral, drift excesivo o owner vacío. Si falta el owner del slice → `TRIAGE_DRIFT_SLICE` (no se inventa un responsable). Criterio: hay runbook con dueño antes de reentrenar o de tocar el release pinneado.",
        "En `CASO-MOQ-051-3A`, el slice de la entidad ficticia de Moquegua reporta availability 0.999 (≥0.995), faithfulness 0.93 (≥0.9) y drift 0.04 (≤0.08) con owner `ai-oncall`. Si faithfulness cae a 0.4, se abre incidente de copiloto; sin owner no se promociona la alerta a producción como señal de decisión. Señales ≠ fraude ni parentesco.",
      ],
      code: {
        language: 'python',
        title: "slo_feedback_drift.py",
        code: `def error_budget_burn(avail: float, slo: float, window: int = 100) -> float:
    """Fracción de error budget quemada en una ventana sintética de N requests."""
    allowed = (1.0 - slo) * window
    errors = max(0.0, (1.0 - avail) * window)
    return round(errors / allowed, 3) if allowed else 999.0

def assess_slo(record: dict) -> str:
    if not record.get("owner"):
        return "TRIAGE_DRIFT_SLICE"
    ok = (
        record["availability"] >= record["availability_slo"]
        and record["faithfulness"] >= record["faithfulness_slo"]
        and record["drift"] <= record["max_drift"]
    )
    return "PASS" if ok else "OPEN_COPILOT_INCIDENT"

row = {
    "availability": 0.999, "availability_slo": 0.995,
    "faithfulness": 0.93, "faithfulness_slo": 0.9,
    "drift": 0.04, "max_drift": 0.08, "owner": "ai-oncall",
}
print(assess_slo(row), error_budget_burn(0.999, 0.995))
print(assess_slo({**row, "faithfulness": 0.4, "owner": "ai-oncall"}))`,
        output: `PASS 0.2
OPEN_COPILOT_INCIDENT`,
      },
      callout: {
        type: "warning",
        title: "Owner antes de reentrenar",
        content:
          "Antes de reentrenar, exige un runbook con dueño asignado y evidencia reproducible del slice de drift.",
      },
    },
    {
      heading: "Incidentes, rollback y post mortem",
      subtopicId: "S51-T3-B",
      paragraphs: [
        "Cuando el multi-SLI de T3-A rompe el error budget (o un release de T2 introduce `latest`), el **incidente** de IA sigue el orden **contener → rollback → comunicar → post mortem blameless**. Contener congela el release defectuoso; el rollback vuelve al last-good pinneado dentro del **RTO** (tiempo objetivo de recuperación). El post mortem sin culpa nombra condiciones sistémicas (holdout tocado, redaction rota, tool allowlist) y acciones con fecha/dueño — no castiga al on-call. Un simulacro sin timeline ni owners no cuenta como readiness CF-5.",
        "Contrato de respuesta a incidente. Entrada: flags `contained`, `rolled_back_to` (last-good del registry), minutos de rollback vs. `rto_minutes`, conteo de `postmortem_actions` y `owners_assigned`. Salida: timeline verificable o `ROLLBACK_AND_CONTAIN`. Error: sin contención, rollback fuera de RTO o acciones sin dueño. Si falta owners → `CONVENE_INCIDENT_REVIEW`. Criterio: se demuestra cómo revertir al pin de T2 y qué se aprendió para el system card.",
        "En `CASO-MOQ-051-3B`, el copiloto de la entidad ficticia de Moquegua empezó a citar un índice `latest` tras un release. El simulacro exige: **contener** (congelar release), **rollback** a `copilot-6` en ≤10 min (RTO), timeline con dueños y post mortem blameless. Ningún campo del caso prueba fraude o parentesco; solo calidad operativa del sistema.",
      ],
      code: {
        language: 'python',
        title: "incidents_rollback_postmortem.py",
        code: `def run_incident(rec: dict) -> dict:
    if not rec.get("owners_assigned"):
        return {"action": "CONVENE_INCIDENT_REVIEW"}
    within_rto = rec["rollback_minutes"] <= rec["rto_minutes"]
    ok = (
        rec["contained"]
        and str(rec["rolled_back_to"]).startswith("copilot-")
        and within_rto
        and rec["postmortem_actions"] >= 1
    )
    return {
        "action": "PASS" if ok else "ROLLBACK_AND_CONTAIN",
        "timeline": ["contain", "rollback", "communicate", "postmortem"],
        "rollback_to": rec["rolled_back_to"],
    }

good = {
    "contained": True, "rolled_back_to": "copilot-6",
    "rollback_minutes": 7, "rto_minutes": 10,
    "postmortem_actions": 4, "owners_assigned": True,
}
print(run_incident(good)["action"], run_incident(good)["rollback_to"])
print(run_incident({**good, "contained": False})["action"])`,
        output: `PASS copilot-6
ROLLBACK_AND_CONTAIN`,
      },
      callout: {
        type: "danger",
        title: "Contener antes de debatir",
        content:
          "Sin un dueño que responda por el rollback y la evidencia, no se promueve el siguiente paso del freeze CF-5. Contén y revierte antes de debatir la causa raíz.",
      },
    },
    {
      heading: "Incertidumbre, citas y confirmaciones",
      subtopicId: "S51-T4-A",
      paragraphs: [
        "Con ops de traza, registry y incidente ya definidos, la **UX** del copiloto es el último eslabón que el usuario ve. Muestra **incertidumbre** (low/med/high), **citas resolubles** al documento fuente (las mismas `cites` del span de retrieval de T1) y el **alcance** del claim. Una **confirmación** resume el efecto (p. ej. «prepara borrador», no «envía a producción») antes de una acción irreversible y permite **corregir el dato fuente**. Ocultar «no sé» o auto-ejecutar tools de escritura es dark pattern, no productividad.",
        "Contrato de UX contestable. Entrada: flags `uncertainty_shown`, `citations_resolve`, `effect_summary`, `confirmation_required`, `confirmed`. Salida: respuesta listable al usuario o `BLOCK_UNCONFIRMED_ACTION`. Error: sin incertidumbre visible, citas rotas o side-effect sin confirmación. Si falta `confirmed` cuando se exige → `ASK_USER_TO_CONFIRM`. Criterio: el usuario entiende evidencia y aprueba el efecto antes del side-effect; la confirmación queda en el audit trail de T2.",
        "En `CASO-MOQ-051-4A`, el copiloto de Moquegua propone un borrador de respuesta con incertidumbre media, citas a `c1` y resumen «prepara borrador». Solo tras confirmación humana se habilita la tool de escritura. No se infiere fraude ni parentesco desde el texto del caso.",
      ],
      code: {
        language: 'python',
        title: "uncertainty_cites_confirm.py",
        code: `def ux_gate(ui: dict) -> str:
    required = {
        "uncertainty_shown", "citations_resolve",
        "effect_summary", "confirmation_required", "confirmed",
    }
    if missing := sorted(required - ui.keys()):
        return "ASK_USER_TO_CONFIRM"
    ok = (
        ui["uncertainty_shown"]
        and ui["citations_resolve"]
        and bool(ui["effect_summary"])
        and (not ui["confirmation_required"] or ui["confirmed"])
    )
    return "PASS" if ok else "BLOCK_UNCONFIRMED_ACTION"

good = {
    "uncertainty_shown": True, "citations_resolve": True,
    "effect_summary": "prepara borrador",
    "confirmation_required": True, "confirmed": True,
}
print(ux_gate(good))
print(ux_gate({**good, "confirmed": False}))
print(ux_gate({"uncertainty_shown": True}))`,
        output: `PASS
BLOCK_UNCONFIRMED_ACTION
ASK_USER_TO_CONFIRM`,
      },
      callout: {
        type: "warning",
        title: "Side-effect sin confirmación = bloqueo",
        content:
          "Al cerrar este subtema, documenta el riesgo residual y los límites del laboratorio con stdlib. Sin confirmación del efecto, no se ejecuta una acción irreversible.",
      },
    },
    {
      heading: "Accesibilidad, corrección y contestabilidad",
      subtopicId: "S51-T4-B",
      paragraphs: [
        "La confirmación de T4-A no basta si el panel es solo-mouse o ilegible. **Accesibilidad** (WCAG 2.2 AA): flujo completo por teclado, labels para lector de pantalla, contraste ≥ 4.5:1 y lenguaje claro no son opcionales en un copiloto de operaciones. **Contestabilidad** explica cómo **corregir** el dato, **apelar** y obtener respuesta humana con SLA — sin dark patterns (urgencia falsa, opt-out escondido). CF-5 exige flujo demostrable, no solo un banner de disclaimer. Cierra el hilo del producto: traza + métricas redactadas + registry + change ticket + SLO + incidente + UX + a11y = freeze de interfaces.",
        "Contrato de a11y y apelación. Entrada: `keyboard_complete`, `screen_reader_labels`, `contrast_ratio` vs. `min_contrast`, `correction_available`, `appeal_to_human`. Salida: flujo completable o `FAIL_ACCESSIBILITY_GATE`. Error: contraste bajo, teclado incompleto o sin corrección/apelación. Si falta ruta humana → `ROUTE_CONTESTATION`. Criterio: un usuario puede corregir y apelar sin mouse y con lector de pantalla; la apelación queda enlazada al `trace_id` y al release pinneado.",
        "En `CASO-MOQ-051-4B`, el panel de la entidad ficticia de Moquegua alcanza contraste 5.1 (≥4.5), teclado y labels OK, corrección de dato y apelación a humano. Un panel solo-mouse con contraste 2.1 se bloquea. El caso es sintético; no prueba fraude ni parentesco.",
      ],
      code: {
        language: 'python',
        title: "a11y_correction_contestability.py",
        code: `def a11y_gate(ui: dict) -> str:
    required = {
        "keyboard_complete", "screen_reader_labels",
        "contrast_ratio", "min_contrast",
        "correction_available", "appeal_to_human",
    }
    if missing := sorted(required - ui.keys()):
        return "ROUTE_CONTESTATION"
    ok = (
        ui["keyboard_complete"]
        and ui["screen_reader_labels"]
        and ui["contrast_ratio"] >= ui["min_contrast"]
        and ui["correction_available"]
        and ui["appeal_to_human"]
    )
    return "PASS" if ok else "FAIL_ACCESSIBILITY_GATE"

good = {
    "keyboard_complete": True, "screen_reader_labels": True,
    "contrast_ratio": 5.1, "min_contrast": 4.5,
    "correction_available": True, "appeal_to_human": True,
}
print(a11y_gate(good))
print(a11y_gate({**good, "contrast_ratio": 2.1, "keyboard_complete": False}))
print(a11y_gate({"keyboard_complete": True}))`,
        output: `PASS
FAIL_ACCESSIBILITY_GATE
ROUTE_CONTESTATION`,
      },
      callout: {
        type: "warning",
        title: "a11y incompleta bloquea CF-5",
        content:
          "Cierre S51-T4-B / CF-5: teclado, lector, contraste AA (≥4.5), corrección y apelación humana son obligatorios. Fallo → `FAIL_ACCESSIBILITY_GATE`; sin appeal → `ROUTE_CONTESTATION`. Un panel «bonito» solo-mouse no se promociona.",
      },
    },
  ],
  iDo: {
    intro: "Te muestro 8 demos de S51 (Observabilidad, gobernanza y UX del copiloto) alineadas al portafolio CP-N4-C y al freeze CF-5 (cierra interfaces y artefactos). Cada demo **calcula** el artefacto del subtema sobre `CASO-MOQ-051` con stdlib; no son prints decorativos.",
    steps: [
      {
        demoId: "S51-T1-A-DEMO",
        subtopicId: "S51-T1-A",
        environment: "local-python",
        description: "Demo: traza con spans correlacionados y gate de PII",
        preamble:
          "Antes de auditar un ticket del copiloto en Moquegua, el on-call debe **reconstruir** qué se citó y qué tool se llamó. En esta demo la traza `tr-moq-51` arma spans padre/hijo (prompt→retrieval→tool→answer) con citas `c1` y tool `get_case`. Observa el segundo print: con `pii=True` no hay «limpiar después del export» — la acción es cuarentena. No escribas aún; predice el dict PASS y el status de PII antes de mirar la salida.",
        code: {
          language: 'python',
          title: "demo_traces_prompts_retrieval_tools.py",
          code: `def build_trace(trace_id: str, prompt_ver: str, cites: list, tool: str, pii: bool) -> dict:
    if pii:
        return {"status": "REDACT_AND_QUARANTINE_TRACE", "trace_id": trace_id}
    # Árbol padre/hijo sintético: root → retrieval → tool → answer
    spans = [
        {"name": "prompt", "parent": None, "attrs": {"prompt_ver": prompt_ver}},
        {"name": "retrieval", "parent": "prompt", "attrs": {"cites": list(cites)}},
        {"name": "tool", "parent": "retrieval", "attrs": {"call": tool}},
        {"name": "answer", "parent": "tool", "attrs": {"pinned": True}},
    ]
    names = {s["name"] for s in spans}
    ok = (
        str(trace_id).startswith("tr-")
        and names >= {"prompt", "retrieval", "tool", "answer"}
        and bool(prompt_ver)
        and bool(tool)
        and bool(cites)
    )
    return {
        "status": "PASS" if ok else "RESTORE_TRACE_CONTEXT",
        "trace_id": trace_id,
        "spans": [s["name"] for s in spans],
        "cites": list(cites),
    }

print(build_trace("tr-moq-51", "p3", ["c1"], "get_case", False))
print(build_trace("tr-moq-51", "p3", ["c1"], "get_case", True)["status"])`,
          output: `{'status': 'PASS', 'trace_id': 'tr-moq-51', 'spans': ['prompt', 'retrieval', 'tool', 'answer'], 'cites': ['c1']}
REDACT_AND_QUARANTINE_TRACE`,
        },
        why: "Pienso en la traza como árbol padre/hijo (prompt→retrieval→tool→answer) con `trace_id` de correlación: sin los cuatro nombres no hay auditoría de decisión. El prefijo `tr-` correlaciona el ticket; PII activa `REDACT_AND_QUARANTINE_TRACE` fail-closed — no exporto y «limpio después». Orden: traza limpia antes del dashboard de tokens. En We Do repararás el predicado invertido, la tabla PASS/cuarentena/MISSING y la rama CONTINUE/RESTORE.",
        retrospective:
          "Si puedes explicar por qué un span de answer sin retrieval no es auditable, ya tienes el hábito de traza reconstruible. El error clásico es exportar PII «para depurar más rápido». En We Do practicarás el predicado, las tres rutas y la rama cuando falta `pii_in_trace`.",
      },
      {
        demoId: "S51-T1-B-DEMO",
        subtopicId: "S51-T1-B",
        environment: "local-python",
        description: "Demo: suma de tokens por etapa, p95 y redacción de atributos",
        preamble:
          "Con la traza limpia, el dashboard miente si el total de tokens no cuadra o si exportas email. En esta demo 800+400+300 = 1500 tokens, costo 0.003 USD sintético, p95 900 ms ≤ SLO 1200 ms, y `ana@example.pe` sale como `[REDACTED]`. No escribas: predice total, costo, p95_ok y el export del email. Si confías solo en la media o dejas `prompt_raw` en el sink, el on-call de Moquegua no puede explicar el costo sin abrir un incidente de privacidad.",
        code: {
          language: 'python',
          title: "demo_tokens_cost_latency_redaction.py",
          code: `PRICE_PER_1K = 0.002  # USD sintético / 1k tokens

def redact_attr(key: str, value: str) -> str:
    if key in {"email", "authorization", "prompt_raw"} or "@" in value:
        return "[REDACTED]"
    return value

def stage_row(prompt_t: int, retr_t: int, gen_t: int, p95_ms: int, slo_ms: int) -> dict:
    total = prompt_t + retr_t + gen_t
    cost_usd = round(total / 1000 * PRICE_PER_1K, 6)
    email = redact_attr("email", "ana@example.pe")
    return {
        "total_tokens": total,
        "cost_usd": cost_usd,
        "reconciled": total == prompt_t + retr_t + gen_t,
        "p95_ok": p95_ms <= slo_ms,
        "email_export": email,
    }

row = stage_row(800, 400, 300, 900, 1200)
print(row["total_tokens"], row["cost_usd"], row["p95_ok"], row["email_export"])
assert row["total_tokens"] == 1500 and row["cost_usd"] == 0.003 and row["email_export"] == "[REDACTED]"`,
          output: `1500 0.003 True [REDACTED]`,
        },
        why: "Uso p95 (no la media) porque el usuario siente los peores 5% de latencia; la media esconde picos. La suma por etapa es la prueba de reconciliación; el costo = tokens/1000 × precio — si el total miente, el costo miente. Redacto email y `prompt_raw` **antes** del export. En We Do: predicado invertido, assess ALERT/MISSING y decide FIX_REDACTION_PIPELINE.",
        retrospective:
          "Costo creíble = tokens reconciliados por etapa + p95 (no media) + sink limpio. El error clásico es promediar picos de latencia o exportar email «para depurar». Pregunta: si el total miente, ¿por qué el costo en USD también miente? We Do: predicado, tres rutas y helpers de compute/redacción.",
      },
      {
        demoId: "S51-T2-A-DEMO",
        subtopicId: "S51-T2-A",
        environment: "local-python",
        description: "Demo: pin de release y rechazo de latest",
        preamble:
          "Con traza y dashboard listos, el registry fija **qué versión** generó la respuesta. En esta demo el bundle `copilot-7` (m2/p3/d5/i4/e2) pasa solo si es inmutable; `model=latest` y `immutable=False` emiten `FREEZE_RELEASE_BUNDLE`. No escribas: predice las tres salidas. Si dejas `latest` en prod del copiloto de Moquegua, el post mortem no puede reproducir la decisión.",
        code: {
          language: 'python',
          title: "demo_registry_model_prompt_dataset.py",
          code: `def pin_release(items: dict, immutable: bool) -> str:
    keys = ("release", "model", "prompt", "dataset", "index", "evaluator")
    if not immutable or any(not items.get(k) or items.get(k) == "latest" for k in keys):
        return "FREEZE_RELEASE_BUNDLE"
    return "PASS"

good = {"release": "copilot-7", "model": "m2", "prompt": "p3", "dataset": "d5", "index": "i4", "evaluator": "e2"}
print(pin_release(good, True))
print(pin_release({**good, "model": "latest"}, True))
print(pin_release(good, False))`,
          output: `PASS
FREEZE_RELEASE_BUNDLE
FREEZE_RELEASE_BUNDLE`,
        },
        why: "En prod rechazo `latest` y bundles mutables: cada artefacto del bundle (modelo, prompt, dataset, índice, evaluador) debe estar pinneado e inmutable. Sin pin no hay rollback ni post mortem reproducible. El system card se enlaza al release, no a un tag móvil. En We Do: predicado, assess FREEZE/MISSING y decide REGISTER_MISSING_VERSION.",
        retrospective:
          "Release auditable = pin de cada artefacto + inmutabilidad. El error clásico es confiar en `latest` «porque el CI lo actualiza». Pregunta: si el post mortem no puede nombrar modelo y prompt del día del incidente, ¿qué falló en el registry? We Do: predicado, tres rutas y helpers de pin.",
      },
      {
        demoId: "S51-T2-B-DEMO",
        subtopicId: "S51-T2-B",
        environment: "local-python",
        description: "Demo: dual-control, scope read y audit append-only",
        preamble:
          "El bundle `copilot-7` no se promueve solo: hace falta **quién escribió** y **quién aprobó**. En esta demo `dev-a` propone y `owner-b` aprueba con scope `ops-read`, 30 días de retención y audit append-only; self-approve + `global-admin` se rechaza. No escribas: predice PASS y REJECT. Si confundes «yo mismo lo apruebo» con gobernanza, el auditor de Moquegua no puede reconstruir el change.",
        code: {
          language: 'python',
          title: "demo_change_access_retention_audit.py",
          code: `def assess_change(t: dict) -> str:
    ok = (
        t["author"] != t["approver"]
        and t["risk"] in {"low", "medium", "high"}
        and str(t["access_scope"]).endswith("-read")
        and t["retention_days"] <= 30
        and t["audit_append_only"]
    )
    return "PASS" if ok else "REJECT_UNGOVERNED_CHANGE"

good = {"author": "dev-a", "approver": "owner-b", "risk": "medium", "access_scope": "ops-read", "retention_days": 30, "audit_append_only": True}
print(assess_change(good))
print(assess_change({**good, "approver": "dev-a", "access_scope": "global-admin"}))`,
          output: `PASS
REJECT_UNGOVERNED_CHANGE`,
        },
        why: "Dual-control exige author ≠ approver: autoaprobar es el anti-patrón de segregación de funciones. Scope least-privilege termina en `-read`; retención acotada (≤30 días); el audit es append-only, no un wiki editable. En We Do: predicado, assess REJECT/MISSING y decide REQUEST_INDEPENDENT_APPROVAL.",
        retrospective:
          "Dual-control = dos personas + scope `-read` + retención acotada + audit append-only. El error clásico es autoaprobar «porque el owner está de vacaciones». Pregunta: ¿un wiki editable de aprobaciones es audit append-only? We Do: predicado, tres rutas y helpers SoD/policy.",
      },
      {
        demoId: "S51-T3-A-DEMO",
        subtopicId: "S51-T3-A",
        environment: "local-python",
        description: "Demo: multi-SLI, error budget y owner del slice",
        preamble:
          "Con release pinneado, el copiloto se mide en **varios SLI**, no solo uptime. En esta demo availability 0.999, faithfulness 0.93 y drift 0.04 con owner `ai-oncall` pasan; faithfulness 0.4 abre `OPEN_COPILOT_INCIDENT`; el burn del error budget es 0.2 en ventana 100. No escribas: predice PASS, burn e incidente. Si reentrenas por un spike de feedback sin dueño del slice, quemas presupuesto sin runbook en Moquegua.",
        code: {
          language: 'python',
          title: "demo_slo_feedback_drift.py",
          code: `def error_budget_burn(avail: float, slo: float, window: int = 100) -> float:
    allowed = (1.0 - slo) * window
    errors = max(0.0, (1.0 - avail) * window)
    return round(errors / allowed, 3) if allowed else 999.0

def assess_slo(r: dict) -> str:
    if not r.get("owner"):
        return "TRIAGE_DRIFT_SLICE"
    ok = r["availability"] >= r["availability_slo"] and r["faithfulness"] >= r["faithfulness_slo"] and r["drift"] <= r["max_drift"]
    return "PASS" if ok else "OPEN_COPILOT_INCIDENT"

row = {"availability": 0.999, "availability_slo": 0.995, "faithfulness": 0.93, "faithfulness_slo": 0.9, "drift": 0.04, "max_drift": 0.08, "owner": "ai-oncall"}
print(assess_slo(row), "burn", error_budget_burn(0.999, 0.995))
print(assess_slo({**row, "faithfulness": 0.4}))`,
          output: `PASS burn 0.2
OPEN_COPILOT_INCIDENT`,
        },
        why: "Mido availability + faithfulness + drift juntos: un solo float de uptime no basta para un copiloto. El error budget cuantifica margen (burn 0.2 aún no es «quemar el presupuesto»); faithfulness 0.4 abre incidente. Sin owner no hay runbook accionable — no se inventa un responsable. En We Do: predicado, assess OPEN/MISSING y decide TRIAGE_DRIFT_SLICE.",
        retrospective:
          "Señal accionable = multi-SLI + umbral + owner del runbook. El error clásico es reentrenar por thumbs-down sin slice ni baseline. Pregunta: ¿por qué un burn de 0.2 aún no es «quemar el presupuesto» en ventana 100? We Do: predicado, tres rutas y burn.",
      },
      {
        demoId: "S51-T3-B-DEMO",
        subtopicId: "S51-T3-B",
        environment: "local-python",
        description: "Demo: contención, rollback dentro de RTO y post mortem con dueños",
        preamble:
          "Cuando el multi-SLI rompe el presupuesto (o entra `latest`), el orden es **contener → rollback → comunicar → post mortem blameless**. En esta demo el simulacro de Moquegua revierte a `copilot-6` en 7 min (RTO 10), con 4 acciones y owners; sin contención o con 90 min falla a `ROLLBACK_AND_CONTAIN`. No escribas: predice PASS y la acción de fallo. Si debates la causa en prod sin congelar el release, el RTO se quema.",
        code: {
          language: 'python',
          title: "demo_incidents_rollback_postmortem.py",
          code: `def run_incident(r: dict) -> str:
    if not r.get("owners_assigned"):
        return "CONVENE_INCIDENT_REVIEW"
    ok = (
        r["contained"]
        and str(r["rolled_back_to"]).startswith("copilot-")
        and r["rollback_minutes"] <= r["rto_minutes"]
        and r["postmortem_actions"] >= 1
    )
    return "PASS" if ok else "ROLLBACK_AND_CONTAIN"

good = {"contained": True, "rolled_back_to": "copilot-6", "rollback_minutes": 7, "rto_minutes": 10, "postmortem_actions": 4, "owners_assigned": True}
print(run_incident(good))
print(run_incident({**good, "contained": False, "rollback_minutes": 90}))`,
          output: `PASS
ROLLBACK_AND_CONTAIN`,
        },
        why: "Orden: contener, rollback al last-good pinneado del registry (`copilot-6`) dentro del RTO, luego post mortem blameless con dueños de acciones. Si no contuve o me pasé del reloj, la acción es `ROLLBACK_AND_CONTAIN`, no «seguir investigando en prod». Sin owners → CONVENE. En We Do: predicado, assess ROLLBACK/MISSING y decide CONVENE_INCIDENT_REVIEW.",
        retrospective:
          "IR de IA = timeline con reloj (RTO) y dueños, no un chat de culpas. El error clásico es debatir la causa en prod sin congelar el release. Pregunta: si el rollback tardó 90 min con RTO 10, ¿qué imprime el gate y por qué no es «casi PASS»? We Do: predicado, tres rutas y helpers RTO/IR.",
      },
      {
        demoId: "S51-T4-A-DEMO",
        subtopicId: "S51-T4-A",
        environment: "local-python",
        description: "Demo: gate de incertidumbre, citas y confirmación de efecto",
        preamble:
          "La ops interna no basta: el usuario ve la **UX** del copiloto. En esta demo el borrador de Moquegua muestra incertidumbre, citas resolubles y el resumen «prepara borrador»; sin `confirmed` se bloquea con `BLOCK_UNCONFIRMED_ACTION`. No escribas: predice PASS y el bloqueo. Si ocultas «no sé» o escribes a producción sin confirmación, no hay contestabilidad aunque el modelo sea bueno.",
        code: {
          language: 'python',
          title: "demo_uncertainty_cites_confirm.py",
          code: `def ux_gate(ui: dict) -> str:
    ok = (
        ui["uncertainty_shown"]
        and ui["citations_resolve"]
        and bool(ui["effect_summary"])
        and (not ui["confirmation_required"] or ui["confirmed"])
    )
    return "PASS" if ok else "BLOCK_UNCONFIRMED_ACTION"

good = {"uncertainty_shown": True, "citations_resolve": True, "effect_summary": "prepara borrador", "confirmation_required": True, "confirmed": True}
print(ux_gate(good))
print(ux_gate({**good, "confirmed": False}))`,
          output: `PASS
BLOCK_UNCONFIRMED_ACTION`,
        },
        why: "Muestro incertidumbre visible y citas resolubles al doc fuente (mismas del span retrieval); el resumen del efecto («prepara borrador») va **antes** del side-effect. Sin confirmación humana cuando se exige, bloqueo la acción irreversible. En We Do: predicado, assess BLOCK/MISSING y decide ASK_USER_TO_CONFIRM.",
        retrospective:
          "UX contestable = incertidumbre visible + citas resolubles + efecto explícito + OK humano cuando se exige. El error clásico es auto-ejecutar tools de escritura. Pregunta: ¿«prepara borrador» es el mismo side-effect que «envía a producción»? We Do: predicado, tres rutas y helpers de evidencia/confirmación.",
      },
      {
        demoId: "S51-T4-B-DEMO",
        subtopicId: "S51-T4-B",
        environment: "local-python",
        description: "Demo: contraste WCAG, teclado y ruta de apelación",
        preamble:
          "La confirmación de T4-A no basta si el panel es solo-mouse o ilegible. En esta demo contraste 5.1 (≥4.5), teclado, labels, corrección y `appeal_to_human` pasan; contraste 2.1 sin appeal falla `FAIL_ACCESSIBILITY_GATE`. No escribas: predice PASS y el fallo. Si el usuario de Moquegua no puede apelar sin mouse, CF-5 no se cierra aunque el copilot «se vea pro».",
        code: {
          language: 'python',
          title: "demo_a11y_correction_contestability.py",
          code: `def a11y_gate(ui: dict) -> str:
    ok = (
        ui["keyboard_complete"]
        and ui["screen_reader_labels"]
        and ui["contrast_ratio"] >= ui["min_contrast"]
        and ui["correction_available"]
        and ui["appeal_to_human"]
    )
    return "PASS" if ok else "FAIL_ACCESSIBILITY_GATE"

good = {"keyboard_complete": True, "screen_reader_labels": True, "contrast_ratio": 5.1, "min_contrast": 4.5, "correction_available": True, "appeal_to_human": True}
print(a11y_gate(good))
print(a11y_gate({**good, "contrast_ratio": 2.1, "appeal_to_human": False}))`,
          output: `PASS
FAIL_ACCESSIBILITY_GATE`,
        },
        why: "Comparo contraste numérico con el mínimo WCAG 2.2 AA (4.5). Teclado, labels de lector, corrección del dato fuente y apelación humana con SLA cierran contestabilidad; sin appeal no hay CF-5 aunque el UI se vea «bonito». En We Do: predicado, assess FAIL/MISSING y decide ROUTE_CONTESTATION.",
        retrospective:
          "Contestabilidad completa = WCAG AA (teclado, labels, contraste ≥4.5) + corrección del dato + apelación humana. El error clásico es un banner de disclaimer en un panel solo-mouse. Pregunta: si el contraste es 5.1 pero no hay `appeal_to_human`, ¿cierra CF-5? We Do: predicado, tres rutas y helper WCAG.",
      },
    ],
  },
  weDo: {
    intro: "S51 · Laboratorio Auditable AI Operations Copilot y CF-5: 24 retos locales sobre `CASO-MOQ-051`. E1 repara un predicado de dominio. E2 separa valid/invalid/missing. E3 transfiere con helpers de cómputo (reconciliación de tokens, multi-SLI, dual-control, a11y) hacia CONTINUE / acción de breach / restore. Fixtures sintéticos de Moquegua; sin PII real.",
    steps: [
      {
        id: "S51-T1-A-E1",
        subtopicId: "S51-T1-A",
        kind: "guided",
        title: "Traza limpia con cuatro spans y sin PII",
        preamble:
          "- **Contexto:** en `CASO-MOQ-051-1A`, el on-call de la entidad ficticia de Moquegua solo acepta una traza si el `trace_id` correlaciona, hay cuatro spans y no hay PII en el sink.\n- **Meta:** corregir `meets_contract` (`tr-` + spans completos + versiones pinneadas + `pii_in_trace is False`).\n- **Éxito:** imprimes exactamente `S51-T1-A PASS` con el fixture válido.\n- **Límites:** no borres el assert; no inventes spans; no toques los datos del fixture.",
        instruction:
          "1. Abre el starter: `meets_contract` usa `not trace_id or pii_in_trace` (bug: aprueba basura).\n2. Exige `trace_id.startswith(\"tr-\")` y el conjunto `prompt/retrieval/tool/answer` ⊆ spans.\n3. Añade `all(versions.values())` y `not pii_in_trace`.\n4. Conserva el print `S51-T1-A` y el status PASS/REDACT_AND_QUARANTINE_TRACE.",
        hint: "Exige `trace_id` con prefijo `tr-`, los cuatro spans y `pii_in_trace is False`.",
        hints: [
          "Exige `trace_id` con prefijo `tr-`, el conjunto `prompt/retrieval/tool/answer` y versiones no vacías.",
          "El fixture válido ya cumple el contrato; la inversión del starter trata PII o traza vacía como éxito — corrige el sentido del booleano.",
        ],
        edgeCases: ["falta pii_in_trace", "fixture adverso: trace_id vacío, spans incompletos o pii_in_trace=True", "CASO-MOQ-051-1A es sintético"],
        tests: "El fixture `CASO-MOQ-051-1A` satisface un predicado de dominio real; imprime `S51-T1-A PASS` y el assert booleano pasa.",
        feedback:
          "PASS exige correlación, cuatro spans, versiones y cero PII a la vez. Con PII la acción es cuarentena, no «limpiar después». Invertir el booleano marca PASS justo cuando la traza es un incidente para el auditor de Moquegua.",
        retrospective:
          "Traza auditable = `tr-` + cuatro spans + versiones pinneadas + cero PII a la vez. El starter aprueba basura porque invierte el booleano: el auditor de Moquegua vería «PASS» justo cuando hay que cuarentenar. Pregunta: si solo existe el span `answer`, ¿qué falta para reconstruir la decisión? Siguiente (E2): PASS / cuarentena / MISSING:pii_in_trace.",
        starterCode: {
          language: 'python',
          title: "s51-t1-a-e1.py",
          code: `# CASO-MOQ-051 · trace contract gate
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
        title: "Tres rutas de traza (PASS / cuarentena / MISSING)",
        preamble:
          "- **Contexto:** el revisor de observabilidad en Moquegua no trata igual una traza limpia, una con PII y una sin flag de privacidad.\n- **Meta:** implementar `assess` que distinga PASS, REDACT_AND_QUARANTINE_TRACE y MISSING:pii_in_trace.\n- **Éxito:** imprime `PASS REDACT_AND_QUARANTINE_TRACE MISSING:pii_in_trace` en ese orden.\n- **Límites:** si falta `pii_in_trace`, no evalúes contenido; no inventes la clave; missing ≠ «cuarentena de PII».",
        instruction:
          "1. Revisa el starter: con campos presentes devuelve PASS si no hay `trace_id` o si hay PII (bug invertido).\n2. Primero: calcula `missing` de required; si hay → `MISSING:…`.\n3. Luego: `tr-` + cuatro spans + versiones + cero PII → PASS; si no → REDACT_AND_QUARANTINE_TRACE.\n4. Imprime los tres resultados con `print(*results)`.",
        hint: "Primero calcula `missing`; no leas `pii_in_trace` hasta confirmar que la clave existe.",
        hints: [
          "Primero calcula `missing`; no leas `pii_in_trace` hasta confirmar que la clave existe.",
          "Tras el schema: `tr-` + cuatro spans + versiones pinneadas + cero PII. El adverso falla por contenido (PII/spans), no por claves ausentes.",
        ],
        edgeCases: ["falta pii_in_trace", "fixture adverso: trace_id vacío, spans incompletos o pii_in_trace=True", "CASO-MOQ-051-1A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `pii_in_trace` ausente y produce exactamente `PASS REDACT_AND_QUARANTINE_TRACE MISSING:pii_in_trace`.",
        feedback:
          "Separa schema incompleto (`MISSING:pii_in_trace`) de contenido adverso (PII True → cuarentena). No trates ausencia de clave como breach de privacidad; en E3 la acción de restore será RESTORE_TRACE_CONTEXT.",
        retrospective:
          "Missing es incertidumbre de esquema; PII True o spans incompletos son breach de contenido. El error clásico es tratar «falta la clave de PII» como si ya hubiera email en el sink. Luego (E3) enrutas CONTINUE / cuarentena / RESTORE_TRACE_CONTEXT.",
        starterCode: {
          language: 'python',
          title: "s51-t1-a-e2.py",
          code: `# CASO-MOQ-051 · assess trace completeness
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
        title: "Decide traza: CONTINUE o RESTORE",
        preamble:
          "- **Contexto:** en producción del copiloto de Moquegua, una traza incompleta no «sigue con warning»: o continúa limpia o se restaura el contexto.\n- **Meta:** helpers + `decide` → CONTINUE (limpia), REDACT_AND_QUARANTINE_TRACE (adverso), RESTORE_TRACE_CONTEXT (sin `pii_in_trace`).\n- **Éxito:** `CONTINUE REDACT_AND_QUARANTINE_TRACE RESTORE_TRACE_CONTEXT`.\n- **Límites:** no inventes `pii_in_trace`; no conviertas missing en CONTINUE; no toques los fixtures.",
        instruction:
          "1. Corrige `spans_complete` (cuatro nombres, no `len==1`) y `versions_pinned` (todas no vacías y ≠ `latest`).\n2. Missing → `RESTORE_TRACE_CONTEXT` (no CONTINUE).\n3. Con record completo: `tr-` + helpers + no PII → CONTINUE; si no → REDACT_AND_QUARANTINE_TRACE.\n4. Imprime los tres códigos en orden.",
        hint: "Missing → RESTORE_TRACE_CONTEXT; pii_in_trace True o helpers en falso → REDACT_AND_QUARANTINE_TRACE; solo traza limpia y completa → CONTINUE.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `RESTORE_TRACE_CONTEXT` antes de evaluar el contenido.",
          "spans_complete exige el conjunto mínimo de cuatro spans; versions_pinned rechaza cadenas vacías y el tag `latest`.",
        ],
        edgeCases: ["falta pii_in_trace", "fixture adverso: trace_id vacío, spans incompletos o pii_in_trace=True", "CASO-MOQ-051-1A es sintético"],
        tests: "Fixtures `CASO-MOQ-051-1A`, adverso y sin `pii_in_trace` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "Helpers `spans_complete` y `versions_pinned` separan CONTINUE de cuarentena. Faltar `pii_in_trace` exige RESTORE_TRACE_CONTEXT: incertidumbre de esquema, no allow optimista del auditor.",
        retrospective:
          "Un campo ausente es restore, no un allow optimista. El error clásico es promover con «falta el flag de PII, igual se ve completo». Pregunta: ¿por qué cuarentena no es lo mismo que RESTORE?",
        starterCode: {
          language: 'python',
          title: "s51-t1-a-e3.py",
          code: `# CASO-MOQ-051 · decide restore vs. continue (transfer spans/versions)
# DEFECT: helpers invertidos; missing→CONTINUE; no RESTORE_TRACE_CONTEXT
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def spans_complete(spans) -> bool:
    return len(spans) == 1  # DEFECT: exige el set completo

def versions_pinned(versions: dict) -> bool:
    return any(v == "latest" or not v for v in versions.values())  # DEFECT

def decide(record: dict) -> str:
    required = {"case_id", "trace_id", "spans", "versions", "pii_in_trace"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    ok = (
        not record["trace_id"].startswith("tr-")
        or record["pii_in_trace"]
        or not spans_complete(record["spans"])
    )
    return "CONTINUE" if ok else "REDACT_AND_QUARANTINE_TRACE"

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
          code: `def spans_complete(spans) -> bool:
    return {"prompt", "retrieval", "tool", "answer"} <= set(spans)

def versions_pinned(versions: dict) -> bool:
    return all(v and v != "latest" for v in versions.values())

def decide(record: dict) -> str:
    required = {"case_id", "trace_id", "spans", "versions", "pii_in_trace"}
    missing = sorted(required - record.keys())
    if missing:
        return "RESTORE_TRACE_CONTEXT"
    ok = (
        str(record["trace_id"]).startswith("tr-")
        and spans_complete(record["spans"])
        and versions_pinned(record["versions"])
        and not record["pii_in_trace"]
    )
    return "CONTINUE" if ok else "REDACT_AND_QUARANTINE_TRACE"

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
        title: "Tokens reconciliados, p95 bajo SLO y redacción",
        preamble:
          "- **Contexto:** en `CASO-MOQ-051-1B`, el dashboard del copiloto de Moquegua solo está sano si la suma por etapa cuadra, el p95 respeta el SLO y hay campos redactados.\n- **Meta:** completar `meets_contract` (suma == total_tokens, p95 ≤ slo, redacted_fields ≥ 1).\n- **Éxito:** `S51-T1-B PASS`.\n- **Límites:** no cambies los contadores del fixture; no uses la media de latencia; no borres el assert.",
        instruction:
          "1. Abre el starter: PASS si total==0 o p95 > slo (bug).\n2. Suma `prompt_tokens + retrieval_tokens + answer_tokens` y compárala con `total_tokens`.\n3. Exige `p95_ms <= slo_ms` y `redacted_fields >= 1`.\n4. Conserva print/status PASS/ALERT_COST_LATENCY.",
        hint: "Suma prompt+retrieval+answer y compárala con `total_tokens`; exige p95 ≤ SLO y al menos un campo redactado.",
        hints: [
          "Suma prompt+retrieval+answer y compárala con `total_tokens`; exige p95 ≤ SLO y `redacted_fields >= 1`.",
          "El starter pasa si el total es 0 o si p95 supera el SLO — invierte esas comparaciones para reflejar un dashboard sano.",
        ],
        edgeCases: ["falta redacted_fields", "fixture adverso: total_tokens no cuadra, p95>slo o redacted_fields=0", "CASO-MOQ-051-1B es sintético"],
        tests: "El fixture `CASO-MOQ-051-1B` satisface un predicado de dominio real; imprime `S51-T1-B PASS` y el assert booleano pasa.",
        feedback:
          "Un total que no cuadra o un p95 de 5 s con media baja es incidente de UX y costo, no «pico normal». Sin al menos un campo redactado el export no es limpio para el on-call de Moquegua.",
        retrospective:
          "Dashboard sano = suma por etapa == total + p95 ≤ SLO + al menos un campo redactado. El starter celebra un dashboard vacío o lento. Pregunta: ¿un total «bonito» de 1500 sin sumar etapas prueba reconciliación? Siguiente (E2): PASS / ALERT / MISSING:redacted_fields.",
        starterCode: {
          language: 'python',
          title: "s51-t1-b-e1.py",
          code: `# CASO-MOQ-051 · cost/latency SLO
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
        title: "Tres rutas de costo/latencia (PASS / ALERT / MISSING)",
        preamble:
          "- **Contexto:** el gate de métricas en Moquegua separa fila limpia, fila con costo/latencia rota y registro sin contador de redacción.\n- **Meta:** `assess` → PASS, ALERT_COST_LATENCY, MISSING:redacted_fields.\n- **Éxito:** `PASS ALERT_COST_LATENCY MISSING:redacted_fields`.\n- **Límites:** sin `redacted_fields` no evalúes la suma; no rellenes el campo ausente.",
        instruction:
          "1. Starter: PASS si total==0 o p95 > slo (bug).\n2. Primero missing de required.\n3. Luego suma + p95 ≤ slo + redacted_fields ≥ 1.\n4. Imprime la tripleta en orden.",
        hint: "Primero se calcula `missing`; ningún acceso a redacted_fields debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a redacted_fields debe ocurrir antes de esa rama.",
          "Después aplica la regla de S51-T1-B: tokens cuadran, p95 bajo SLO y campos redactados. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta redacted_fields", "fixture adverso: total_tokens no cuadra, p95>slo o redacted_fields=0", "CASO-MOQ-051-1B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `redacted_fields` ausente y produce exactamente `PASS ALERT_COST_LATENCY MISSING:redacted_fields`.",
        feedback:
          "Salida exacta de E2: MISSING:redacted_fields (incertidumbre de esquema). Con total descuadrado o p95 alto es ALERT_COST_LATENCY. En E3 la acción de restore será FIX_REDACTION_PIPELINE.",
        retrospective:
          "MISSING de redacción es incertidumbre de export, no un p95 alto. Total descuadrado o redacted_fields=0 es ALERT por contenido. El error clásico es inventar `redacted_fields=1` para forzar PASS. Pregunta: ¿en qué orden evalúas schema vs. suma de tokens? Luego (E3): CONTINUE / ALERT / FIX_REDACTION_PIPELINE.",
        starterCode: {
          language: 'python',
          title: "s51-t1-b-e2.py",
          code: `# CASO-MOQ-051 · assess token sum + redaction
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
        title: "Decide costo: CONTINUE o FIX redacción",
        preamble:
          "- **Contexto:** en ops del copiloto, un export incompleto no se «promueve con disclaimer»: o continúa limpio o se repara el pipeline de redacción.\n- **Meta:** helpers de compute + `decide` → CONTINUE, ALERT_COST_LATENCY, FIX_REDACTION_PIPELINE.\n- **Éxito:** `CONTINUE ALERT_COST_LATENCY FIX_REDACTION_PIPELINE` (costo válido 0.003).\n- **Límites:** no inventes `redacted_fields`; no uses media de latencia; no toques fixtures.",
        instruction:
          "1. Implementa `reconcile_tokens` (suma por etapa == total).\n2. `estimate_cost_usd` = round(total/1000 * 0.002, 6); `export_clean` = redacted_fields ≥ 1.\n3. Missing → FIX_REDACTION_PIPELINE; con datos: helpers + p95_ok + cost ≥ 0 → CONTINUE.\n4. Imprime los tres códigos en orden.",
        hint: "Primero missing → FIX_REDACTION_PIPELINE; luego reconcile_tokens + p95_ok + export_clean + estimate_cost_usd ≥ 0 para CONTINUE.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `FIX_REDACTION_PIPELINE` antes de evaluar el contenido.",
          "estimate_cost_usd = round(total_tokens/1000 * 0.002, 6); en el fixture válido debe dar 0.003. No uses la media de latencia: el gate es p95_ms <= slo_ms.",
        ],
        edgeCases: ["falta redacted_fields", "fixture adverso: total_tokens no cuadra, p95>slo o redacted_fields=0", "CASO-MOQ-051-1B es sintético"],
        tests: "Fixtures `CASO-MOQ-051-1B`, adverso y sin `redacted_fields` prueban continue/breach/uncertainty en ese orden; el costo del válido es 0.003.",
        feedback:
          "Suma de tokens, p95 y costo = f(tokens, precio) separan CONTINUE de ALERT_COST_LATENCY. Missing no es breach: repara el pipeline de redacción antes de promover el export.",
        retrospective:
          "Si el total miente, el costo miente. El error clásico es tratar missing de redacción como CONTINUE. Pregunta: ¿por qué p95 y no la media en el gate?",
        starterCode: {
          language: 'python',
          title: "s51-t1-b-e3.py",
          code: `# CASO-MOQ-051 · decide fix redaction (transfer con compute)
# DEFECT: no reconcilia tokens ni costo; missing→CONTINUE; gate invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
PRICE_PER_1K = 0.002

def reconcile_tokens(record: dict) -> bool:
    return record["total_tokens"] == 0  # DEFECT

def estimate_cost_usd(total_tokens: int) -> float:
    return 0.0  # DEFECT: debe ser total/1000 * PRICE_PER_1K

def export_clean(record: dict) -> bool:
    return record.get("redacted_fields", 0) == 0  # DEFECT

def decide(record: dict) -> str:
    required = {"case_id", "prompt_tokens", "retrieval_tokens", "answer_tokens", "total_tokens", "p95_ms", "slo_ms", "redacted_fields"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    ok = reconcile_tokens(record) or record["p95_ms"] > record["slo_ms"] or not export_clean(record)
    return "CONTINUE" if ok else "ALERT_COST_LATENCY"

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
          code: `PRICE_PER_1K = 0.002

def reconcile_tokens(record: dict) -> bool:
    return (
        record["prompt_tokens"]
        + record["retrieval_tokens"]
        + record["answer_tokens"]
        == record["total_tokens"]
    )

def estimate_cost_usd(total_tokens: int) -> float:
    return round(total_tokens / 1000 * PRICE_PER_1K, 6)

def export_clean(record: dict) -> bool:
    return record["redacted_fields"] >= 1

def decide(record: dict) -> str:
    required = {"case_id", "prompt_tokens", "retrieval_tokens", "answer_tokens", "total_tokens", "p95_ms", "slo_ms", "redacted_fields"}
    missing = sorted(required - record.keys())
    if missing:
        return "FIX_REDACTION_PIPELINE"
    cost = estimate_cost_usd(record["total_tokens"])
    ok = (
        reconcile_tokens(record)
        and record["p95_ms"] <= record["slo_ms"]
        and export_clean(record)
        and cost >= 0
    )
    return "CONTINUE" if ok else "ALERT_COST_LATENCY"

valid = {"case_id": "CASO-MOQ-051-1B", **{"prompt_tokens":800,"retrieval_tokens":400,"answer_tokens":300,"total_tokens":1500,"p95_ms":900,"slo_ms":1200,"redacted_fields":4}}
invalid = {"case_id": "CASO-MOQ-051-1B", **{"prompt_tokens":800,"retrieval_tokens":400,"answer_tokens":300,"total_tokens":900,"p95_ms":5000,"slo_ms":1200,"redacted_fields":0}}
uncertain = {**valid}
uncertain.pop("redacted_fields")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "ALERT_COST_LATENCY", "FIX_REDACTION_PIPELINE"]
assert estimate_cost_usd(1500) == 0.003` ,
          output: `CONTINUE ALERT_COST_LATENCY FIX_REDACTION_PIPELINE` ,
        },
      },
      {
        id: "S51-T2-A-E1",
        subtopicId: "S51-T2-A",
        kind: "guided",
        title: "Bundle pinneado e inmutable (sin latest)",
        preamble:
          "- **Contexto:** en `CASO-MOQ-051-2A`, el equipo de Moquegua congela el release `copilot-7` solo si modelo/prompt/dataset/índice/evaluador están pinneados e inmutables.\n- **Meta:** corregir `meets_contract` (seis claves ≠ vacío/`latest` y `immutable is True`).\n- **Éxito:** `S51-T2-A PASS`.\n- **Límites:** no aceptes `latest` «por conveniencia»; no borres el assert; no cambies IDs del fixture.",
        instruction:
          "1. Starter: PASS si not immutable o hay `latest` (bug).\n2. Recorre release/model/prompt/dataset/index/evaluator: todos truthy y ≠ `latest`.\n3. Exige `immutable is True`.\n4. Conserva print PASS/FREEZE_RELEASE_BUNDLE.",
        hint: "Ningún artefacto puede ser vacío o `latest`; `immutable` debe ser True.",
        hints: [
          "Recorre release/model/prompt/dataset/index/evaluator: todos pinneados y distintos de `latest`.",
          "El starter aprueba bundles mutables o con `latest` — el contrato de prod es el opuesto: freeze ante esos casos.",
        ],
        edgeCases: ["falta immutable", "fixture adverso: release=latest, versiones vacías o immutable=False", "CASO-MOQ-051-2A es sintético"],
        tests: "El fixture `CASO-MOQ-051-2A` satisface un predicado de dominio real; imprime `S51-T2-A PASS` y el assert booleano pasa.",
        feedback:
          "En prod cada artefacto va pinneado e inmutable. `latest` o mutable congela el release; sin pin no hay rollback ni system card auditable para el freeze CF-5.",
        retrospective:
          "Pin = reproducibilidad del post mortem y del system card de la entidad. El starter aprueba mutable o `latest` y deja al on-call sin versión reconstruible. Pregunta: ¿basta el string `copilot-7` si el modelo es `latest`? Siguiente (E2): PASS / FREEZE / MISSING:immutable.",
        starterCode: {
          language: 'python',
          title: "s51-t2-a-e1.py",
          code: `# CASO-MOQ-051 · immutable release bundle
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
pin_keys = ("release", "model", "prompt", "dataset", "index", "evaluator")
meets_contract = (
    all(record[k] and record[k] != "latest" for k in pin_keys)
    and record["immutable"] is True
)
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
        title: "Tres rutas de registry (PASS / FREEZE / MISSING)",
        preamble:
          "- **Contexto:** el gate de registry en Moquegua separa bundle limpio, bundle con `latest`/mutable y registro sin flag `immutable`.\n- **Meta:** `assess` → PASS, FREEZE_RELEASE_BUNDLE, MISSING:immutable.\n- **Éxito:** `PASS FREEZE_RELEASE_BUNDLE MISSING:immutable`.\n- **Límites:** sin `immutable` no evalúes pins; no inventes el flag.",
        instruction:
          "1. Starter invierte el predicado de pin.\n2. Primero missing de required.\n3. Luego seis versiones pinneadas + immutable True.\n4. Imprime la tripleta.",
        hint: "Primero se calcula `missing`; ningún acceso a immutable debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a immutable debe ocurrir antes de esa rama.",
          "Después aplica la regla de S51-T2-A: seis versiones explícitas y bundle inmutable. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta immutable", "fixture adverso: release=latest, versiones vacías o immutable=False", "CASO-MOQ-051-2A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `immutable` ausente y produce exactamente `PASS FREEZE_RELEASE_BUNDLE MISSING:immutable`.",
        feedback:
          "Salida exacta de E2: MISSING:immutable (no inventes el flag). Bundle con `latest` o mutable es freeze. En E3 la acción de restore será REGISTER_MISSING_VERSION.",
        retrospective:
          "Falta de flag `immutable` no es lo mismo que bundle con `latest`: una es incertidumbre de registro, la otra es breach de prod. El error clásico es inventar `immutable=True` para pasar la tabla. Pregunta: ¿por qué no evalúas pins si falta la clave? Luego (E3): CONTINUE / FREEZE / REGISTER_MISSING_VERSION.",
        starterCode: {
          language: 'python',
          title: "s51-t2-a-e2.py",
          code: `# CASO-MOQ-051 · assess freeze bundle
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
    pin_keys = ("release", "model", "prompt", "dataset", "index", "evaluator")
    ok = all(record[k] and record[k] != "latest" for k in pin_keys) and record["immutable"] is True
    return "PASS" if ok else "FREEZE_RELEASE_BUNDLE"

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
        title: "Decide registry: CONTINUE o FREEZE",
        preamble:
          "- **Contexto:** en el freeze CF-5, un release incompleto no se promociona: se registra la versión faltante o se congela el bundle.\n- **Meta:** helpers + `decide` → CONTINUE, FREEZE_RELEASE_BUNDLE, REGISTER_MISSING_VERSION.\n- **Éxito:** `CONTINUE FREEZE_RELEASE_BUNDLE REGISTER_MISSING_VERSION`.\n- **Límites:** no inventes `immutable`; no conviertas missing en CONTINUE.",
        instruction:
          "1. Corrige `versions_pinned` (all pinneados, no any latest).\n2. `bundle_immutable` = `immutable is True` (no False).\n3. Missing → REGISTER_MISSING_VERSION; ambos helpers True → CONTINUE.\n4. Imprime los tres códigos.",
        hint: "Missing → REGISTER_MISSING_VERSION; versions_pinned y bundle_immutable en falso → FREEZE_RELEASE_BUNDLE; solo pin completo e inmutable → CONTINUE.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REGISTER_MISSING_VERSION` antes de evaluar el contenido.",
          "versions_pinned recorre release/model/prompt/dataset/index/evaluator; bundle_immutable exige flag True, no truthy suelto.",
        ],
        edgeCases: ["falta immutable", "fixture adverso: release=latest, versiones vacías o immutable=False", "CASO-MOQ-051-2A es sintético"],
        tests: "Fixtures `CASO-MOQ-051-2A`, adverso y sin `immutable` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "Helpers versions_pinned y bundle_immutable separan CONTINUE de freeze. Faltar immutable exige REGISTER_MISSING_VERSION: incertidumbre de registro, no promote silencioso.",
        retrospective:
          "Missing del flag no es lo mismo que bundle mutable: uno es incertidumbre de registro, el otro es breach de prod. Pregunta: ¿por qué el system card se enlaza al release pinneado y no a `latest`?",
        starterCode: {
          language: 'python',
          title: "s51-t2-a-e3.py",
          code: `# CASO-MOQ-051 · decide freeze release (transfer pin helpers)
# DEFECT: helpers invertidos; missing→CONTINUE
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def versions_pinned(record: dict) -> bool:
    keys = ("release", "model", "prompt", "dataset", "index", "evaluator")
    return any(not record.get(k) or record.get(k) == "latest" for k in keys)  # DEFECT

def bundle_immutable(record: dict) -> bool:
    return record.get("immutable") is False  # DEFECT

def decide(record: dict) -> str:
    required = {"case_id", "release", "model", "prompt", "dataset", "index", "evaluator", "immutable"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if versions_pinned(record) and bundle_immutable(record) else "FREEZE_RELEASE_BUNDLE"

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
          code: `def versions_pinned(record: dict) -> bool:
    keys = ("release", "model", "prompt", "dataset", "index", "evaluator")
    return all(record.get(k) and record.get(k) != "latest" for k in keys)

def bundle_immutable(record: dict) -> bool:
    return record.get("immutable") is True

def decide(record: dict) -> str:
    required = {"case_id", "release", "model", "prompt", "dataset", "index", "evaluator", "immutable"}
    missing = sorted(required - record.keys())
    if missing:
        return "REGISTER_MISSING_VERSION"
    ok = versions_pinned(record) and bundle_immutable(record)
    return "CONTINUE" if ok else "FREEZE_RELEASE_BUNDLE"

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
        title: "Dual-control con scope read y audit append-only",
        preamble:
          "- **Contexto:** en `CASO-MOQ-051-2B`, el change ticket de Moquegua exige autor ≠ aprobador, risk válido, scope de lectura, retención ≤30 y audit append-only.\n- **Meta:** corregir `meets_contract` con esas cinco anclas.\n- **Éxito:** `S51-T2-B PASS`.\n- **Límites:** no cambies author/approver del fixture; no «arregles» self-approve en silencio; no borres el assert.",
        instruction:
          "1. Starter: PASS si author==approver o scope admin (bug).\n2. Exige author ≠ approver y risk ∈ {low, medium, high}.\n3. Scope `endswith(\"-read\")`, retención ≤ 30, audit_append_only True.\n4. Conserva print PASS/REJECT_UNGOVERNED_CHANGE.",
        hint: "author ≠ approver, scope `*-read`, retención ≤ 30 y audit append-only.",
        hints: [
          "Segregación de funciones: `author` y `approver` son personas distintas; risk ∈ {low, medium, high}.",
          "Self-approve o `global-admin` deben fallar el contrato; el starter hoy los trata como éxito.",
        ],
        edgeCases: ["falta audit_append_only", "fixture adverso: author==approver, scope admin, retención excesiva o audit no append-only", "CASO-MOQ-051-2B es sintético"],
        tests: "El fixture `CASO-MOQ-051-2B` satisface un predicado de dominio real; imprime `S51-T2-B PASS` y el assert booleano pasa.",
        feedback:
          "Self-approve o admin global son cambio no gobernado. Dual-control no es un formulario: es segregación de funciones con rastro append-only que el auditor de Moquegua reconstruye.",
        retrospective:
          "Gobernanza operable = SoD + least privilege + TTL ≤30 + audit append-only. El starter celebra self-approve. Pregunta: si hay un «aprobador» en el ticket pero es la misma persona que el autor, ¿hay dual-control? Siguiente (E2): PASS / REJECT / MISSING:audit_append_only.",
        starterCode: {
          language: 'python',
          title: "s51-t2-b-e1.py",
          code: `# CASO-MOQ-051 · dual control release
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
        title: "Tres rutas de change (PASS / REJECT / MISSING)",
        preamble:
          "- **Contexto:** el gate de change control en Moquegua separa ticket limpio, ticket no gobernado y registro sin flag de audit append-only.\n- **Meta:** `assess` → PASS, REJECT_UNGOVERNED_CHANGE, MISSING:audit_append_only.\n- **Éxito:** `PASS REJECT_UNGOVERNED_CHANGE MISSING:audit_append_only`.\n- **Límites:** sin `audit_append_only` no evalúes SoD; no inventes el flag.",
        instruction:
          "1. Starter invierte dual-control.\n2. Primero missing.\n3. Luego SoD + risk + scope read + retención + audit.\n4. Imprime la tripleta.",
        hint: "Primero se calcula `missing`; ningún acceso a audit_append_only debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a audit_append_only debe ocurrir antes de esa rama.",
          "Después aplica la regla de S51-T2-B: separación de funciones, scope read, retención y audit. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta audit_append_only", "fixture adverso: author==approver, scope admin, retención excesiva o audit no append-only", "CASO-MOQ-051-2B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `audit_append_only` ausente y produce exactamente `PASS REJECT_UNGOVERNED_CHANGE MISSING:audit_append_only`.",
        feedback:
          "Salida exacta de E2: MISSING:audit_append_only (evidencia incompleta). Con SoD roto o scope admin es REJECT. En E3 la acción de restore será REQUEST_INDEPENDENT_APPROVAL.",
        retrospective:
          "MISSING de audit no es REJECT por SoD: aún no sabes si el rastro es append-only. Self-approve o `global-admin` sí son REJECT por contenido. Pregunta: ¿retención 3650 días es «más seguro» o más exposición de PII en ops? Luego (E3): CONTINUE / REJECT / REQUEST_INDEPENDENT_APPROVAL.",
        starterCode: {
          language: 'python',
          title: "s51-t2-b-e2.py",
          code: `# CASO-MOQ-051 · assess change control
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
        title: "Decide change: CONTINUE o pedir aprobación",
        preamble:
          "- **Contexto:** en CF-5, un change incompleto no se «aprueba con disclaimer»: se pide aprobación independiente o se rechaza.\n- **Meta:** helpers + `decide` → CONTINUE, REJECT_UNGOVERNED_CHANGE, REQUEST_INDEPENDENT_APPROVAL.\n- **Éxito:** `CONTINUE REJECT_UNGOVERNED_CHANGE REQUEST_INDEPENDENT_APPROVAL`.\n- **Límites:** no inventes `audit_append_only`; no conviertas missing en CONTINUE.",
        instruction:
          "1. `sod_ok`: author ≠ approver y risk válido.\n2. `access_policy_ok`: scope `-read`, retención ≤30, audit True.\n3. Missing → REQUEST_INDEPENDENT_APPROVAL; ambos True → CONTINUE.\n4. Imprime los tres códigos.",
        hint: "Missing → REQUEST_INDEPENDENT_APPROVAL; sod_ok y access_policy_ok en falso → REJECT_UNGOVERNED_CHANGE; solo ambos True → CONTINUE.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_INDEPENDENT_APPROVAL` antes de evaluar el contenido.",
          "sod_ok separa funciones; access_policy_ok une scope least-privilege, TTL y audit append-only.",
        ],
        edgeCases: ["falta audit_append_only", "fixture adverso: author==approver, scope admin, retención excesiva o audit no append-only", "CASO-MOQ-051-2B es sintético"],
        tests: "Fixtures `CASO-MOQ-051-2B`, adverso y sin `audit_append_only` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "Helpers sod_ok y access_policy_ok separan CONTINUE de rechazo. Faltar audit_append_only exige REQUEST_INDEPENDENT_APPROVAL: no inventes un rastro editable.",
        retrospective:
          "SoD y policy son dos puertas: fallar una ya es rechazo. Missing de audit no es lo mismo que self-approve. Pregunta: ¿por qué retención eterna de PII en audit no es «más seguro»?",
        starterCode: {
          language: 'python',
          title: "s51-t2-b-e3.py",
          code: `# CASO-MOQ-051 · decide restore change control (transfer SoD)
# DEFECT: helpers invertidos; missing→CONTINUE
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def sod_ok(record: dict) -> bool:
    return record["author"] == record["approver"] or record["risk"] not in {"low", "medium", "high"}  # DEFECT

def access_policy_ok(record: dict) -> bool:
    return record["access_scope"].endswith("admin") or record["retention_days"] > 30 or not record["audit_append_only"]  # DEFECT

def decide(record: dict) -> str:
    required = {"case_id", "author", "approver", "risk", "access_scope", "retention_days", "audit_append_only"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if sod_ok(record) and access_policy_ok(record) else "REJECT_UNGOVERNED_CHANGE"

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
          code: `def sod_ok(record: dict) -> bool:
    return record["author"] != record["approver"] and record["risk"] in {"low", "medium", "high"}

def access_policy_ok(record: dict) -> bool:
    return (
        str(record["access_scope"]).endswith("-read")
        and record["retention_days"] <= 30
        and record["audit_append_only"] is True
    )

def decide(record: dict) -> str:
    required = {"case_id", "author", "approver", "risk", "access_scope", "retention_days", "audit_append_only"}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_INDEPENDENT_APPROVAL"
    ok = sod_ok(record) and access_policy_ok(record)
    return "CONTINUE" if ok else "REJECT_UNGOVERNED_CHANGE"

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
        title: "Multi-SLI con owner antes de reentrenar",
        preamble:
          "- **Contexto:** en `CASO-MOQ-051-3A`, el slice de Moquegua solo está verde si availability/faithfulness/drift cumplen umbral y hay owner del runbook.\n- **Meta:** corregir `meets_contract` (tres SLI + owner no vacío).\n- **Éxito:** `S51-T3-A PASS`.\n- **Límites:** no inventes owner; no «promedies» faithfulness; no borres el assert.",
        instruction:
          "1. Starter: PASS si availability < slo o drift > max (bug).\n2. Exige availability ≥ slo, faithfulness ≥ slo, drift ≤ max.\n3. Añade `bool(owner)`.\n4. Conserva print PASS/OPEN_COPILOT_INCIDENT.",
        hint: "availability y faithfulness ≥ sus SLO, drift ≤ max y `owner` no vacío.",
        hints: [
          "Compara cada SLI con su umbral en la dirección correcta (≥ para calidad/disponibilidad, ≤ para drift).",
          "El starter marca PASS cuando availability está bajo el SLO — invierte el sentido y no olvides faithfulness ni owner.",
        ],
        edgeCases: ["falta owner", "fixture adverso: availability bajo SLO, faithfulness baja, drift alto o owner vacío", "CASO-MOQ-051-3A es sintético"],
        tests: "El fixture `CASO-MOQ-051-3A` satisface un predicado de dominio real; imprime `S51-T3-A PASS` y el assert booleano pasa.",
        feedback:
          "Multi-SLI + owner es el mínimo antes de reentrenar. SLI roto abre incidente; owner vacío es triage del slice, no un responsable inventado para el runbook de Moquegua.",
        retrospective:
          "Un solo float de uptime no basta para un copiloto: faithfulness y drift también cuentan, y sin owner no hay runbook. El starter marca PASS cuando el slice está roto. Pregunta: ¿inventas un owner para «cerrar el gate»? Siguiente (E2): PASS / OPEN / MISSING:owner.",
        starterCode: {
          language: 'python',
          title: "s51-t3-a-e1.py",
          code: `# CASO-MOQ-051 · reliability SLOs copiloto
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
        title: "Tres rutas de SLO (PASS / OPEN / MISSING)",
        preamble:
          "- **Contexto:** el gate de SLO en Moquegua separa slice sano, slice en incidente y registro sin clave `owner`.\n- **Meta:** `assess` → PASS, OPEN_COPILOT_INCIDENT, MISSING:owner.\n- **Éxito:** `PASS OPEN_COPILOT_INCIDENT MISSING:owner`.\n- **Límites:** sin clave `owner` no evalúes SLI; owner vacío en el adverso es breach de contenido (no MISSING).",
        instruction:
          "1. Starter invierte comparaciones de SLI.\n2. Primero missing de required.\n3. Luego multi-SLI + bool(owner).\n4. Imprime la tripleta.",
        hint: "Primero se calcula `missing`; ningún acceso a owner debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a owner debe ocurrir antes de esa rama.",
          "Después aplica la regla de S51-T3-A: availability/faithfulness/drift bajo SLO con owner. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta owner", "fixture adverso: availability bajo SLO, faithfulness baja, drift alto o owner vacío", "CASO-MOQ-051-3A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `owner` ausente y produce exactamente `PASS OPEN_COPILOT_INCIDENT MISSING:owner`.",
        feedback:
          "Salida exacta de E2: MISSING:owner. Faithfulness o availability bajo umbral con owner presente → OPEN_COPILOT_INCIDENT. En E3 la acción de restore será TRIAGE_DRIFT_SLICE.",
        retrospective:
          "Falta de clave `owner` es TRIAGE en E3; owner vacío con SLI rotos es OPEN. No mezcles las dos rutas. Luego decides CONTINUE / OPEN / TRIAGE.",
        starterCode: {
          language: 'python',
          title: "s51-t3-a-e2.py",
          code: `# CASO-MOQ-051 · assess SLO fidelity
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
        title: "Decide SLO: CONTINUE o TRIAGE del slice",
        preamble:
          "- **Contexto:** en ops del copiloto, un slice sin dueño no se «optimiza en silencio»: se triajea o se abre incidente.\n- **Meta:** `sli_ok` + burn + `decide` → CONTINUE, OPEN_COPILOT_INCIDENT, TRIAGE_DRIFT_SLICE.\n- **Éxito:** `CONTINUE OPEN_COPILOT_INCIDENT TRIAGE_DRIFT_SLICE` (burn válido 0.2).\n- **Límites:** no inventes owner; no ignores faithfulness; no conviertas missing en CONTINUE.",
        instruction:
          "1. Implementa `error_budget_burn` (errors/allowed en ventana 100).\n2. `sli_ok`: availability, faithfulness y drift vs. umbrales.\n3. Missing de owner → TRIAGE_DRIFT_SLICE; sli_ok + owner + burn finito → CONTINUE.\n4. Imprime los tres códigos.",
        hint: "Missing de owner → TRIAGE_DRIFT_SLICE; owner vacío o SLI roto → OPEN_COPILOT_INCIDENT. Burn = errors/allowed con allowed=(1-slo)*window.",
        hints: [
          "Una ausencia de clave no equivale a breach: enrútala a `TRIAGE_DRIFT_SLICE` antes de evaluar el contenido.",
          "error_budget_burn(0.999, 0.995) debe ser 0.2 en ventana 100. sli_ok no basta solo: también bool(owner).",
        ],
        edgeCases: ["falta owner", "fixture adverso: availability bajo SLO, faithfulness baja, drift alto o owner vacío", "CASO-MOQ-051-3A es sintético"],
        tests: "Fixtures `CASO-MOQ-051-3A`, adverso y sin `owner` prueban continue/breach/uncertainty; burn del válido es 0.2.",
        feedback:
          "Multi-SLI + error budget + owner hacen la alerta accionable. Falta de owner es triage del slice: no inventes un responsable para el reentreno.",
        retrospective:
          "Error budget cuantifica margen; owner hace la alerta accionable. El error clásico es reentrenar sin runbook. Pregunta: ¿por qué un burn de 0.2 aún no es «quemar el presupuesto»?",
        starterCode: {
          language: 'python',
          title: "s51-t3-a-e3.py",
          code: `# CASO-MOQ-051 · decide restore observability owner (transfer multi-SLI)
# DEFECT: missing→CONTINUE; sli_ok invertido; ignora faithfulness y burn
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def error_budget_burn(avail: float, slo: float, window: int = 100) -> float:
    return 0.0  # DEFECT: calcula errors/allowed

def sli_ok(record: dict) -> bool:
    return record["availability"] < record["availability_slo"] or record["drift"] > record["max_drift"]

def decide(record: dict) -> str:
    required = {"case_id", "availability", "availability_slo", "faithfulness", "faithfulness_slo", "drift", "max_drift", "owner"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if sli_ok(record) else "OPEN_COPILOT_INCIDENT"

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
          code: `def error_budget_burn(avail: float, slo: float, window: int = 100) -> float:
    allowed = (1.0 - slo) * window
    errors = max(0.0, (1.0 - avail) * window)
    return round(errors / allowed, 3) if allowed else 999.0

def sli_ok(record: dict) -> bool:
    return (
        record["availability"] >= record["availability_slo"]
        and record["faithfulness"] >= record["faithfulness_slo"]
        and record["drift"] <= record["max_drift"]
    )

def decide(record: dict) -> str:
    required = {"case_id", "availability", "availability_slo", "faithfulness", "faithfulness_slo", "drift", "max_drift", "owner"}
    missing = sorted(required - record.keys())
    if missing:
        return "TRIAGE_DRIFT_SLICE"
    burn = error_budget_burn(record["availability"], record["availability_slo"])
    ok = sli_ok(record) and bool(record["owner"]) and burn < 999.0
    return "CONTINUE" if ok else "OPEN_COPILOT_INCIDENT"

valid = {"case_id": "CASO-MOQ-051-3A", **{"availability":0.999,"availability_slo":0.995,"faithfulness":0.93,"faithfulness_slo":0.9,"drift":0.04,"max_drift":0.08,"owner":"ai-oncall"}}
invalid = {"case_id": "CASO-MOQ-051-3A", **{"availability":0.8,"availability_slo":0.995,"faithfulness":0.4,"faithfulness_slo":0.9,"drift":0.3,"max_drift":0.08,"owner":""}}
uncertain = {**valid}
uncertain.pop("owner")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "OPEN_COPILOT_INCIDENT", "TRIAGE_DRIFT_SLICE"]
assert error_budget_burn(0.999, 0.995) == 0.2` ,
          output: `CONTINUE OPEN_COPILOT_INCIDENT TRIAGE_DRIFT_SLICE` ,
        },
      },
      {
        id: "S51-T3-B-E1",
        subtopicId: "S51-T3-B",
        kind: "guided",
        title: "Contención, rollback en RTO y dueños del post mortem",
        preamble:
          "- **Contexto:** en `CASO-MOQ-051-3B`, el simulacro de incidente del copiloto de Moquegua exige contención, pin last-good, reloj ≤ RTO, ≥1 acción y owners.\n- **Meta:** corregir `meets_contract` con esas anclas.\n- **Éxito:** `S51-T3-B PASS`.\n- **Límites:** no alargues el RTO «a mano»; no borres owners del fixture; no borres el assert.",
        instruction:
          "1. Starter: PASS si not contained o minutos > RTO (bug).\n2. Exige contained True y `rolled_back_to.startswith(\"copilot-\")`.\n3. Minutos ≤ RTO, postmortem_actions ≥ 1, owners_assigned True.\n4. Conserva print PASS/ROLLBACK_AND_CONTAIN.",
        hint: "Contención True, last-good `copilot-*`, minutos ≤ RTO, ≥1 acción y owners asignados.",
        hints: [
          "Orden mental: contained → rollback al pin → reloj ≤ RTO → post mortem con dueños.",
          "El starter pasa si no hubo contención o si el rollback se pasó del RTO; invierte esas ramas.",
        ],
        edgeCases: ["falta owners_assigned", "fixture adverso: sin contención, rollback fuera de RTO o sin acciones/dueños", "CASO-MOQ-051-3B es sintético"],
        tests: "El fixture `CASO-MOQ-051-3B` satisface un predicado de dominio real; imprime `S51-T3-B PASS` y el assert booleano pasa.",
        feedback:
          "El gate de incidente exige contención, pin last-good, reloj ≤ RTO y dueños del post mortem; sin owners la ruta es CONVENE, no un PASS improvisado ante el revisor de plataforma.",
        retrospective:
          "Contener primero, explicar después: contención + pin `copilot-*` + minutos ≤ RTO + ≥1 acción + owners. El starter aprueba un simulacro sin contención o con reloj quemado. Pregunta: ¿un post mortem de 4 acciones sin `contained=True` cierra el incidente? Siguiente (E2): PASS / ROLLBACK / MISSING:owners_assigned.",
        starterCode: {
          language: 'python',
          title: "s51-t3-b-e1.py",
          code: `# CASO-MOQ-051 · incident rollback gate
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
        title: "Tres rutas de incidente (PASS / ROLLBACK / MISSING)",
        preamble:
          "- **Contexto:** el gate de IR en Moquegua separa simulacro listo, respuesta incompleta y registro sin flag de owners.\n- **Meta:** `assess` → PASS, ROLLBACK_AND_CONTAIN, MISSING:owners_assigned.\n- **Éxito:** `PASS ROLLBACK_AND_CONTAIN MISSING:owners_assigned`.\n- **Límites:** sin `owners_assigned` no evalúes RTO; no inventes dueños.",
        instruction:
          "1. Starter invierte contención/RTO.\n2. Primero missing.\n3. Luego contained + pin + RTO + acciones + owners.\n4. Imprime la tripleta.",
        hint: "Primero se calcula `missing`; ningún acceso a owners_assigned debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a owners_assigned debe ocurrir antes de esa rama.",
          "Después aplica la regla de S51-T3-B: contención, last-good, RTO y acciones con dueño. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta owners_assigned", "fixture adverso: sin contención, rollback fuera de RTO o sin acciones/dueños", "CASO-MOQ-051-3B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `owners_assigned` ausente y produce exactamente `PASS ROLLBACK_AND_CONTAIN MISSING:owners_assigned`.",
        feedback:
          "Salida exacta de E2: MISSING:owners_assigned. Sin contención o fuera de RTO emite ROLLBACK_AND_CONTAIN. En E3 la acción de restore será CONVENE_INCIDENT_REVIEW.",
        retrospective:
          "Falta de `owners_assigned` es incertidumbre de roles en el simulacro; sin contención es breach de respuesta. El post mortem no sustituye la contención inmediata del on-call. Pregunta: ¿por qué no inventas `owners_assigned=True` para «cerrar» la tabla? Luego (E3): CONTINUE / ROLLBACK / CONVENE_INCIDENT_REVIEW.",
        starterCode: {
          language: 'python',
          title: "s51-t3-b-e2.py",
          code: `# CASO-MOQ-051 · assess incident response
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
        title: "Decide IR: CONTINUE o convocar revisión",
        preamble:
          "- **Contexto:** en CF-5, un incidente sin dueños no se cierra con un print: se convoca revisión o se fuerza contención.\n- **Meta:** helpers + `decide` → CONTINUE, ROLLBACK_AND_CONTAIN, CONVENE_INCIDENT_REVIEW.\n- **Éxito:** `CONTINUE ROLLBACK_AND_CONTAIN CONVENE_INCIDENT_REVIEW`.\n- **Límites:** no inventes owners; no conviertas missing en CONTINUE.",
        instruction:
          "1. `within_rto`: minutos ≤ RTO y pin `copilot-*`.\n2. `ir_complete`: contained + ≥1 acción + owners True.\n3. Missing → CONVENE_INCIDENT_REVIEW; ambos True → CONTINUE.\n4. Imprime los tres códigos.",
        hint: "Missing → CONVENE_INCIDENT_REVIEW; within_rto e ir_complete en falso → ROLLBACK_AND_CONTAIN; solo ambos True → CONTINUE.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `CONVENE_INCIDENT_REVIEW` antes de evaluar el contenido.",
          "within_rto mide el reloj del rollback; ir_complete exige contención, acciones y dueños del post mortem.",
        ],
        edgeCases: ["falta owners_assigned", "fixture adverso: sin contención, rollback fuera de RTO o sin acciones/dueños", "CASO-MOQ-051-3B es sintético"],
        tests: "Fixtures `CASO-MOQ-051-3B`, adverso y sin `owners_assigned` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "Helpers within_rto e ir_complete separan CONTINUE de contención. Faltar owners_assigned exige CONVENE_INCIDENT_REVIEW: no cierres el incidente sin dueños.",
        retrospective:
          "RTO mide el reloj del rollback; IR complete mide contención y aprendizaje. Missing de owners no es lo mismo que rollback lento. Pregunta: ¿por qué el post mortem blameless nombra condiciones sistémicas y no «el on-call falló»?",
        starterCode: {
          language: 'python',
          title: "s51-t3-b-e3.py",
          code: `# CASO-MOQ-051 · decide restore incident evidence (transfer RTO)
# DEFECT: helpers invertidos; missing→CONTINUE
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def within_rto(record: dict) -> bool:
    return record["rollback_minutes"] > record["rto_minutes"] or not str(record["rolled_back_to"]).startswith("copilot-")  # DEFECT

def ir_complete(record: dict) -> bool:
    return not record["contained"] or record["postmortem_actions"] < 1 or not record["owners_assigned"]  # DEFECT

def decide(record: dict) -> str:
    required = {"case_id", "contained", "rolled_back_to", "rollback_minutes", "rto_minutes", "postmortem_actions", "owners_assigned"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if within_rto(record) and ir_complete(record) else "ROLLBACK_AND_CONTAIN"

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
          code: `def within_rto(record: dict) -> bool:
    return (
        record["rollback_minutes"] <= record["rto_minutes"]
        and str(record["rolled_back_to"]).startswith("copilot-")
    )

def ir_complete(record: dict) -> bool:
    return (
        record["contained"] is True
        and record["postmortem_actions"] >= 1
        and record["owners_assigned"] is True
    )

def decide(record: dict) -> str:
    required = {"case_id", "contained", "rolled_back_to", "rollback_minutes", "rto_minutes", "postmortem_actions", "owners_assigned"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONVENE_INCIDENT_REVIEW"
    ok = within_rto(record) and ir_complete(record)
    return "CONTINUE" if ok else "ROLLBACK_AND_CONTAIN"

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
        title: "Incertidumbre, citas y confirmación del efecto",
        preamble:
          "- **Contexto:** en `CASO-MOQ-051-4A`, el copiloto de Moquegua solo habilita la tool de escritura si muestra incertidumbre, citas, resumen del efecto y confirmación humana.\n- **Meta:** corregir `meets_contract` (evidence + confirmación condicional).\n- **Éxito:** `S51-T4-A PASS`.\n- **Límites:** no inventes `confirmed`; no vacíes `effect_summary`; no borres el assert.",
        instruction:
          "1. Starter: PASS si falta incertidumbre/citas/confirmed (bug).\n2. Exige uncertainty_shown, citations_resolve y effect_summary truthy.\n3. Si confirmation_required, exige confirmed.\n4. Conserva print PASS/BLOCK_UNCONFIRMED_ACTION.",
        hint: "Incertidumbre y citas visibles; si hay confirmación requerida, `confirmed` debe ser True.",
        hints: [
          "`effect_summary` no vacío resume el side-effect («prepara borrador») antes de ejecutarlo.",
          "El starter trata la falta de confirmación como PASS; el contrato bloquea side-effects no confirmados.",
        ],
        edgeCases: ["falta confirmed", "fixture adverso: sin incertidumbre/citas visibles o acción sin confirmación", "CASO-MOQ-051-4A es sintético"],
        tests: "El fixture `CASO-MOQ-051-4A` satisface un predicado de dominio real; imprime `S51-T4-A PASS` y el assert booleano pasa.",
        feedback:
          "Incertidumbre + citas + resumen del efecto van antes del side-effect. Si se exige confirmación y no hay `confirmed`, bloqueas la acción irreversible para el usuario de Moquegua.",
        retrospective:
          "«Prepara borrador» no es lo mismo que «envía a producción»: el resumen del efecto es el contrato con el usuario. El starter invierte incertidumbre, citas o confirmed y aprueba un side-effect ciego. Pregunta: si falta `effect_summary`, ¿el usuario sabe qué se va a ejecutar? Siguiente (E2): PASS / BLOCK / MISSING:confirmed.",
        starterCode: {
          language: 'python',
          title: "s51-t4-a-e1.py",
          code: `# CASO-MOQ-051 · contestable answer UX
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
        title: "Tres rutas de UX (PASS / BLOCK / MISSING)",
        preamble:
          "- **Contexto:** el gate de UX en Moquegua separa respuesta listable, acción bloqueada y registro sin clave `confirmed`.\n- **Meta:** `assess` → PASS, BLOCK_UNCONFIRMED_ACTION, MISSING:confirmed.\n- **Éxito:** `PASS BLOCK_UNCONFIRMED_ACTION MISSING:confirmed`.\n- **Límites:** sin `confirmed` no evalúes el resto; no inventes la clave.",
        instruction:
          "1. Starter invierte uncertainty/citations/confirmed.\n2. Primero missing.\n3. Luego evidence + confirmación condicional.\n4. Imprime la tripleta.",
        hint: "Primero se calcula `missing`; ningún acceso a confirmed debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a confirmed debe ocurrir antes de esa rama.",
          "Después aplica la regla de S51-T4-A: incertidumbre/citas visibles y efecto confirmado. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta confirmed", "fixture adverso: sin incertidumbre/citas visibles o acción sin confirmación", "CASO-MOQ-051-4A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `confirmed` ausente y produce exactamente `PASS BLOCK_UNCONFIRMED_ACTION MISSING:confirmed`.",
        feedback:
          "Salida exacta de E2: MISSING:confirmed. Confirmación requerida en False con side-effect → BLOCK_UNCONFIRMED_ACTION. En E3 la acción de restore será ASK_USER_TO_CONFIRM.",
        retrospective:
          "Clave `confirmed` ausente es ASK_USER_TO_CONFIRM en E3; confirmed False con side-effect es BLOCK. No mezcles incertidumbre de schema con rechazo de contenido. Luego decides CONTINUE / BLOCK / ASK.",
        starterCode: {
          language: 'python',
          title: "s51-t4-a-e2.py",
          code: `# CASO-MOQ-051 · assess contestability fields
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
        title: "Decide UX: CONTINUE o pedir confirmación",
        preamble:
          "- **Contexto:** en CF-5, un side-effect sin evidencia visible no se «manda con warning»: se pide confirmación o se bloquea.\n- **Meta:** helpers + `decide` → CONTINUE, BLOCK_UNCONFIRMED_ACTION, ASK_USER_TO_CONFIRM.\n- **Éxito:** `CONTINUE BLOCK_UNCONFIRMED_ACTION ASK_USER_TO_CONFIRM`.\n- **Límites:** no inventes `confirmed`; no conviertas missing en CONTINUE.",
        instruction:
          "1. `evidence_visible`: incertidumbre + citas + effect_summary.\n2. `effect_confirmed`: not required or confirmed is True.\n3. Missing → ASK_USER_TO_CONFIRM; ambos True → CONTINUE.\n4. Imprime los tres códigos.",
        hint: "Missing → ASK_USER_TO_CONFIRM; evidence_visible o effect_confirmed en falso → BLOCK_UNCONFIRMED_ACTION; solo ambos True → CONTINUE.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `ASK_USER_TO_CONFIRM` antes de evaluar el contenido.",
          "evidence_visible cubre lo que el usuario ve; effect_confirmed cubre el side-effect irreversible.",
        ],
        edgeCases: ["falta confirmed", "fixture adverso: sin incertidumbre/citas visibles o acción sin confirmación", "CASO-MOQ-051-4A es sintético"],
        tests: "Fixtures `CASO-MOQ-051-4A`, adverso y sin `confirmed` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "Helpers evidence_visible y effect_confirmed separan CONTINUE de bloqueo. Faltar confirmed exige ASK_USER_TO_CONFIRM: no ejecutes el side-effect en silencio.",
        retrospective:
          "Evidencia es lo que el usuario ve; confirmación es el control del irreversible. Missing no es lo mismo que «el usuario dijo no». Pregunta: ¿por qué el effect_summary debe quedar también en el audit trail de T2?",
        starterCode: {
          language: 'python',
          title: "s51-t4-a-e3.py",
          code: `# CASO-MOQ-051 · decide restore contestability (transfer UX helpers)
# DEFECT: helpers invertidos; missing→CONTINUE
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def evidence_visible(record: dict) -> bool:
    return not record["uncertainty_shown"] or not record["citations_resolve"] or not record["effect_summary"]  # DEFECT

def effect_confirmed(record: dict) -> bool:
    return record["confirmation_required"] and not record["confirmed"]  # DEFECT: True solo en breach

def decide(record: dict) -> str:
    required = {"case_id", "uncertainty_shown", "citations_resolve", "effect_summary", "confirmation_required", "confirmed"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if evidence_visible(record) and effect_confirmed(record) else "BLOCK_UNCONFIRMED_ACTION"

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
          code: `def evidence_visible(record: dict) -> bool:
    return (
        record["uncertainty_shown"]
        and record["citations_resolve"]
        and bool(record["effect_summary"])
    )

def effect_confirmed(record: dict) -> bool:
    return (not record["confirmation_required"]) or record["confirmed"] is True

def decide(record: dict) -> str:
    required = {"case_id", "uncertainty_shown", "citations_resolve", "effect_summary", "confirmation_required", "confirmed"}
    missing = sorted(required - record.keys())
    if missing:
        return "ASK_USER_TO_CONFIRM"
    ok = evidence_visible(record) and effect_confirmed(record)
    return "CONTINUE" if ok else "BLOCK_UNCONFIRMED_ACTION"

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
        title: "WCAG AA con corrección y apelación humana",
        preamble:
          "- **Contexto:** en `CASO-MOQ-051-4B`, el panel del copiloto de Moquegua solo cierra CF-5 si es operable por teclado, legible (contraste AA), con corrección y apelación a humano.\n- **Meta:** corregir `meets_contract` (teclado + labels + contraste ≥ min + corrección + appeal).\n- **Éxito:** `S51-T4-B PASS`.\n- **Límites:** no uses igualdad exacta de contraste; no borres appeal del fixture; no borres el assert.",
        instruction:
          "1. Starter: PASS si not keyboard o contraste < min o not appeal (bug).\n2. Exige keyboard_complete y screen_reader_labels.\n3. `contrast_ratio >= min_contrast`, correction_available y appeal_to_human.\n4. Conserva print PASS/FAIL_ACCESSIBILITY_GATE.",
        hint: "Teclado + labels + contraste ≥ min AA + corrección + apelación humana.",
        hints: [
          "Compara `contrast_ratio >= min_contrast` (4.5 en AA); no uses igualdad exacta ni el sentido invertido.",
          "El starter aprueba paneles solo-mouse o sin appeal; CF-5 exige ambos caminos y contraste legible.",
        ],
        edgeCases: ["falta appeal_to_human", "fixture adverso: teclado/lector incompleto, contraste bajo o sin apelación", "CASO-MOQ-051-4B es sintético"],
        tests: "El fixture `CASO-MOQ-051-4B` satisface un predicado de dominio real; imprime `S51-T4-B PASS` y el assert booleano pasa.",
        feedback:
          "WCAG AA + corrección + apelación humana cierran CF-5. Un panel solo-mouse o ilegible falla el gate aunque «se vea bonito» en el portfolio.",
        retrospective:
          "Accesibilidad es gate de producto CF-5, no polish final. El starter aprueba paneles ilegibles o sin teclado. Pregunta: ¿comparas contraste con `>=` o con igualdad exacta, y por qué importa 5.1 vs. 4.5? Siguiente (E2): PASS / FAIL / MISSING:appeal_to_human.",
        starterCode: {
          language: 'python',
          title: "s51-t4-b-e1.py",
          code: `# CASO-MOQ-051 · a11y + appeal gate
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
        title: "Tres rutas de a11y (PASS / FAIL / MISSING)",
        preamble:
          "- **Contexto:** el gate de a11y en Moquegua separa panel completable, panel no accesible y registro sin ruta de apelación humana.\n- **Meta:** `assess` → PASS, FAIL_ACCESSIBILITY_GATE, MISSING:appeal_to_human.\n- **Éxito:** `PASS FAIL_ACCESSIBILITY_GATE MISSING:appeal_to_human`.\n- **Límites:** sin `appeal_to_human` no evalúes contraste; no inventes la clave.",
        instruction:
          "1. Starter invierte keyboard/contraste/appeal.\n2. Primero missing.\n3. Luego teclado + labels + contraste ≥ min + corrección + appeal.\n4. Imprime la tripleta.",
        hint: "Primero se calcula `missing`; ningún acceso a appeal_to_human debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a appeal_to_human debe ocurrir antes de esa rama.",
          "Después aplica la regla de S51-T4-B: teclado/lector/contraste y corrección/apelación. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta appeal_to_human", "fixture adverso: teclado/lector incompleto, contraste bajo o sin apelación", "CASO-MOQ-051-4B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `appeal_to_human` ausente y produce exactamente `PASS FAIL_ACCESSIBILITY_GATE MISSING:appeal_to_human`.",
        feedback:
          "Salida exacta de E2: MISSING:appeal_to_human. Contraste bajo o teclado incompleto fallan a11y. En E3 la acción de restore será ROUTE_CONTESTATION.",
        retrospective:
          "MISSING de appeal es incertidumbre de ruta humana; contraste 2.1 o teclado incompleto es FAIL de contenido. El error clásico es promocionar un panel «bonito» que el usuario no puede operar. Pregunta: ¿por qué no evalúas contraste si falta la clave de appeal? Luego (E3): CONTINUE / FAIL / ROUTE_CONTESTATION.",
        starterCode: {
          language: 'python',
          title: "s51-t4-b-e2.py",
          code: `# CASO-MOQ-051 · assess a11y completeness
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
        title: "Decide a11y: CONTINUE o enrutar contestación",
        preamble:
          "- **Contexto:** en el cierre de CF-5, un panel sin ruta humana no se «aprueba con disclaimer»: se enruta a contestación o se falla el gate.\n- **Meta:** `meets_wcag_aa` + `decide` → CONTINUE, FAIL_ACCESSIBILITY_GATE, ROUTE_CONTESTATION.\n- **Éxito:** `CONTINUE FAIL_ACCESSIBILITY_GATE ROUTE_CONTESTATION`.\n- **Límites:** no inventes appeal; compara contraste con `>=`, no con igualdad exacta; no conviertas missing en CONTINUE.",
        instruction:
          "1. Implementa `meets_wcag_aa` con las cinco anclas (teclado, labels, contraste, corrección, appeal).\n2. Missing → ROUTE_CONTESTATION.\n3. Helper True → CONTINUE; si no → FAIL_ACCESSIBILITY_GATE.\n4. Imprime los tres códigos.",
        hint: "Missing → ROUTE_CONTESTATION; compara contraste numéricamente (>=), no con igualdad exacta.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `ROUTE_CONTESTATION` antes de evaluar el contenido.",
          "meets_wcag_aa debe exigir keyboard_complete, screen_reader_labels, contrast_ratio >= min_contrast, correction_available y appeal_to_human.",
        ],
        edgeCases: ["falta appeal_to_human", "fixture adverso: teclado/lector incompleto, contraste bajo o sin apelación", "CASO-MOQ-051-4B es sintético"],
        tests: "Fixtures `CASO-MOQ-051-4B`, adverso y sin `appeal_to_human` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "El umbral AA es contraste ≥ 4.5 con teclado y labels. Sin appeal se enruta a ROUTE_CONTESTATION: no inventes un humano en el if del panel.",
        retrospective:
          "Sin appeal no hay contestabilidad completa aunque el contraste sea 5.1. El error clásico es inventar un humano en el if. Pregunta: ¿cómo enlazas la apelación al `trace_id` y al release pinneado del system card?",
        starterCode: {
          language: 'python',
          title: "s51-t4-b-e3.py",
          code: `# CASO-MOQ-051 · decide restore a11y evidence (transfer WCAG)
# DEFECT: missing→CONTINUE; contraste invertido; ignora labels/corrección
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def meets_wcag_aa(record: dict) -> bool:
    return not record["keyboard_complete"] or record["contrast_ratio"] < record["min_contrast"]

def decide(record: dict) -> str:
    required = {"case_id", "keyboard_complete", "screen_reader_labels", "contrast_ratio", "min_contrast", "correction_available", "appeal_to_human"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if meets_wcag_aa(record) else "FAIL_ACCESSIBILITY_GATE"

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
          code: `def meets_wcag_aa(record: dict) -> bool:
    return (
        record["keyboard_complete"]
        and record["screen_reader_labels"]
        and record["contrast_ratio"] >= record["min_contrast"]
        and record["correction_available"]
        and record["appeal_to_human"]
    )

def decide(record: dict) -> str:
    required = {"case_id", "keyboard_complete", "screen_reader_labels", "contrast_ratio", "min_contrast", "correction_available", "appeal_to_human"}
    missing = sorted(required - record.keys())
    if missing:
        return "ROUTE_CONTESTATION"
    return "CONTINUE" if meets_wcag_aa(record) else "FAIL_ACCESSIBILITY_GATE"

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
    title: "Portafolio CF-5: Observabilidad, gobernanza y UX del copiloto (CP-N4-C + Level-4 regression)",
    context: "Auditable AI Operations Copilot y freeze CF-5. Sobre `CASO-MOQ-051` (Moquegua sintético) ensambla los artefactos de T1–T4: traza redactada → dashboard de costo/latencia → bundle pinneado + change ticket → SLO/incidente → UX contestable y a11y. Entrada: trace id, versiones, evidencia, feedback y política. Salida: dashboard redactado, SLO con owner, audit trail append-only y corrección/apelación. El gate se bloquea ante PII en trace, versión desconocida, drift sin owner o acción irreversible sin confirmación.",
    objectives: [
      "Ensamblar traza reconstruible, métricas por etapa con redacción, registry pinneado y dual-control en un solo paquete de evidencia.",
      "Demostrar el gate CF-5: se puede reconstruir qué respondió, qué citó, qué tool llamó, quién aprobó y cómo revertir.",
      "Automatizar tres rutas: normal (CONTINUE/PASS), breach (`ROLLBACK_AND_CONTAIN`) e incertidumbre (`CONVENE_INCIDENT_REVIEW` o `ASK_USER_TO_CONFIRM`).",
      "Entregar evidencia reproducible, redactada, sin PII real, secretos ni servicios externos obligatorios.",
    ],
    requirements: [
      "Usa exclusivamente fixtures sintéticos identificados por `CASO-MOQ-051`.",
      "Incluye traces de prompt/retrieval/tool con redacción (`traces_redacted`).",
      "Incluye registry y change log de versiones (`registry_changelog`).",
      "Incluye SLO/drift/feedback/incidente/post mortem (`slo_incident_postmortem`).",
      "Incluye UX accesible con incertidumbre, citas, confirmación y contestabilidad (`ux_contestability_a11y`).",
      "Automatiza un caso normal, uno de breach (`ROLLBACK_AND_CONTAIN`) y uno incierto (`CONVENE_INCIDENT_REVIEW` o `ASK_USER_TO_CONFIRM`).",
      "Incluye comandos locales reproducibles, dependencias fijadas y salida esperada.",
      "Registra riesgo residual, responsable, criterio de rollback y limitaciones conocidas.",
    ],
    starterCode: `CASE_ID = "CASO-MOQ-051"
REQUIRED = [
    "traces_redacted",
    "registry_changelog",
    "slo_incident_postmortem",
    "ux_contestability_a11y",
]

# Helpers de dominio: enlaza aquí los artefactos reales de T1–T4 (no marques True a mano).
def traces_redacted_ok(trace: dict) -> bool:
    spans = set(trace.get("spans", []))
    return (
        str(trace.get("trace_id", "")).startswith("tr-")
        and {"prompt", "retrieval", "tool", "answer"} <= spans
        and trace.get("pii_in_trace") is False
        and all(trace.get("versions", {}).values())
    )

def registry_changelog_ok(bundle: dict, change: dict) -> bool:
    keys = ("release", "model", "prompt", "dataset", "index", "evaluator")
    pin = all(bundle.get(k) and bundle.get(k) != "latest" for k in keys) and bundle.get("immutable") is True
    dual = (
        change.get("author") != change.get("approver")
        and str(change.get("access_scope", "")).endswith("-read")
        and change.get("audit_append_only") is True
    )
    return pin and dual

def slo_incident_ok(slo: dict, ir: dict) -> bool:
    sli = (
        slo.get("availability", 0) >= slo.get("availability_slo", 1)
        and slo.get("faithfulness", 0) >= slo.get("faithfulness_slo", 1)
        and slo.get("drift", 1) <= slo.get("max_drift", 0)
        and bool(slo.get("owner"))
    )
    incident = (
        ir.get("contained") is True
        and str(ir.get("rolled_back_to", "")).startswith("copilot-")
        and ir.get("rollback_minutes", 999) <= ir.get("rto_minutes", 0)
        and ir.get("postmortem_actions", 0) >= 1
        and ir.get("owners_assigned") is True
    )
    return sli and incident

def ux_contestability_a11y_ok(ux: dict, a11y: dict) -> bool:
    ux_ok = (
        ux.get("uncertainty_shown")
        and ux.get("citations_resolve")
        and bool(ux.get("effect_summary"))
        and (not ux.get("confirmation_required") or ux.get("confirmed"))
    )
    a11y_ok = (
        a11y.get("keyboard_complete")
        and a11y.get("screen_reader_labels")
        and a11y.get("contrast_ratio", 0) >= a11y.get("min_contrast", 4.5)
        and a11y.get("correction_available")
        and a11y.get("appeal_to_human")
    )
    return bool(ux_ok and a11y_ok)

# Por diseño inicia BLOCKED: rellena dicts con evidencia real del lab y evalúa con los helpers.
trace = {}
bundle, change = {}, {}
slo, ir = {}, {}
ux, a11y = {}, {}

evidence = {
    "traces_redacted": traces_redacted_ok(trace),
    "registry_changelog": registry_changelog_ok(bundle, change),
    "slo_incident_postmortem": slo_incident_ok(slo, ir),
    "ux_contestability_a11y": ux_contestability_a11y_ok(ux, a11y),
}

def readiness(bundle_flags: dict[str, bool]) -> tuple[str, list[str]]:
    missing = [name for name in REQUIRED if bundle_flags.get(name) is not True]
    return ("READY", []) if not missing else ("BLOCKED", missing)

status, missing = readiness(evidence)
print(CASE_ID, status)
print("missing", ",".join(missing))
assert status in {"READY", "BLOCKED"}
`,
    portfolioNote: "Evidencia de CP-N4-C + CF-5 · copiloto observable y contestable: muestra baseline, decisión, pruebas, resultado medido, rollback y riesgo residual. El checklist inicia en BLOCKED por diseño (dicts vacíos); conviértelo en READY alimentando `trace`/`bundle`/`change`/`slo`/`ir`/`ux`/`a11y` con artefactos reales del proyecto y dejando que los helpers calculen las banderas — no codifiques de forma fija True ni cambies asserts. Las tres rutas (normal / breach ROLLBACK_AND_CONTAIN / incertidumbre CONVENE o ASK) deben quedar en evidencia reproducible.",
    retrospective:
      "Antes de marcar listo: (1) ¿puedes reconstruir con un solo `trace_id` qué se citó, qué tool se llamó, qué release pinneado respondió y quién aprobó? (2) ¿qué harías distinto con logs reales vs. fixtures de Moquegua (PII, retención, dual-control)? (3) Escribe en el README una frase de impacto medible (antes/después: p. ej. «export sin redacción → cuarentena; con pin + RTO se revierte en ≤10 min») que puedas defender en 30 segundos ante un revisor de plataforma.",
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
        question: "¿Qué evidencia permite aprobar traces de prompts, retrieval y tools en CASO-MOQ-051?",
        options: ["un print sin assert ni versión", "una captura de pantalla sin fuente", "trace reconstruible sin PII", "datos personales reales para que parezca auténtico"],
        correctIndex: 2,
        explanation: "La teoría exige trace reconstruible sin PII; evidencia decorativa o PII no satisface el contrato.",
      },
      {
        question: "Si un release de copiloto degrada faithfulness y hay que revertir con evidencia, ¿qué respuesta preserva seguridad y auditabilidad?",
        options: ["emitir ROLLBACK_AND_CONTAIN y conservar evidencia", "continuar y ocultar el warning", "inventar evidencia faltante", "borrar el trace para reducir ruido"],
        correctIndex: 0,
        explanation: "El contrato de incidente falla cerrado con ROLLBACK_AND_CONTAIN; no convierte incertidumbre o breach en éxito ni borra la traza.",
      },
      {
        question: "¿Cuál resultado demuestra el gate `CP-N4-C + CF-5 · copiloto observable y contestable`?",
        options: ["el archivo S51 existe, aunque no pruebe el gate", "se puede reconstruir qué respondió, qué citó, qué tool llamó, quién aprobó y cómo revertir", "el README afirma que funciona", "se usó la herramienta más nueva"],
        correctIndex: 1,
        explanation: "El gate es conductual y medible: se puede reconstruir qué respondió, qué citó, qué tool llamó, quién aprobó y cómo revertir.",
      },
      {
        question: "Antes de exportar métricas del copiloto, ¿qué tratamiento de atributos es correcto en S51?",
        options: ["exportar prompt_raw y email para «depurar más rápido»", "usar model=latest en el registry de producción", "autoaprobar el release si el autor y el aprobador son la misma persona", "redactar email/authorization/prompt_raw y rechazar el export si queda PII"],
        correctIndex: 3,
        explanation: "La redacción de atributos sensibles es parte del contrato de observabilidad; dual-control y pin de versiones son obligatorios en prod.",
      },
      {
        question: "Un trace de copiloto con spans completos pero `pii_in_trace=True`, ¿qué acción es correcta en S51?",
        options: ["Promover a producción porque los spans están completos", "Borrar el audit log para ocultar el PII", "REDACT_AND_QUARANTINE_TRACE y bloquear promoción hasta una nueva redacción", "Inferir fraude del usuario a partir del prompt"],
        correctIndex: 2,
        explanation:
          "PII en traza invalida el contrato de observabilidad: se redacta y se cuarentena; no se promueve ni se usa la traza como prueba de culpabilidad.",
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
      { label: "Site Reliability Engineering", note: "Incidentes, post mortems y SLO" },
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
