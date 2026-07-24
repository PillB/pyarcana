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
    "En equipos de plataforma y producto (bancos, fintechs y ops digitales en Perú y LATAM), el rol de AI/Platform Engineer no termina al desplegar el copiloto: te piden **demostrar** qué versión respondió, qué citó, qué tool llamó, quién aprobó el release y cómo hacer rollback. Esta sección entrena dashboard redactado, SLO con owner, audit trail append-only y flujos de corrección/apelación; se promociona solo con evidencia reconstruible.",
  learningOutcomes: [
    { text: "Construir una traza reconstruible (prompt/retrieval/tool/answer) con `trace_id` y sin PII exportable" },
    { text: "Reconciliar tokens por etapa, validar p95 ≤ SLO y demostrar redacción de atributos sensibles" },
    { text: "Pinear un release inmutable (modelo/prompt/dataset/índice) y rechazar `latest` en producción" },
    { text: "Aplicar dual-control, scope least-privilege, retención acotada y audit append-only" },
    { text: "Evaluar multi-SLI (availability, faithfulness, drift) con owner y error budget antes de reentrenar" },
    { text: "Ejecutar contención → rollback dentro de RTO → postmortem blameless con acciones y dueños" },
    { text: "Diseñar UX con incertidumbre visible, citas resolubles y confirmación antes de side-effects" },
    { text: "Cerrar CF-5 con WCAG AA (teclado, contraste, labels) más corrección y apelación humana" },
  ],
  theory: [
    {
      heading: "Ruta de S51: Observabilidad, gobernanza y UX del copiloto",
      paragraphs: [
        "**Diccionario de la sección** (léelo antes de T1). **Trace:** correlación prompt/retrieval/tool/respuesta con versiones. **Redacción:** PII fuera de logs exportables. **Tokens/costo/latency:** SLI del copiloto. **Registro de artefactos:** modelo, prompt, dataset versionados. **Audit trail:** quién aprobó qué. **Drift/feedback:** señales de desalineación. **Postmortem blameless:** aprendizaje sin culpas. **Contestabilidad:** corrección y apelación del usuario. **CF-5:** congela interfaces y artefactos para integración final. **a11y:** accesibilidad (WCAG) del UI del copiloto.",
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
        content: "Evidencia mínima de S51-T1-A: caso sintético con asserts locales; si falta, no promociones.",
      },
    },
    {
      heading: "Traces de prompts, retrieval y tools",
      subtopicId: "S51-T1-A",
      paragraphs: [
        "Un **trace** correlaciona **prompt template**, **retrieval**, **tool calls** y **respuesta** con **versiones** (prompt/modelo/índice) y un **trace_id** de correlación (prefijo `tr-`). En la práctica de ops de IA se modela como árbol de **spans** padre/hijo (prompt → retrieval → tool → answer) con atributos por span — no como tres strings sueltos. Sin correlación no hay auditoría: no se puede reconstruir «qué se citó y qué tool se llamó». **Redacta PII/secrets antes** de exportar a backends de observabilidad; raw logs con datos personales son incidente, no «detalle de ops». Este artefacto alimenta el registry y el dashboard de T1-B en adelante.",
        "Contrato de traza reconstruible. Entrada: `trace_id` (prefijo `tr-`), `prompt_ver` pinneado, lista de citas y nombre de tool. Salida: dict con `status` PASS o acción fail-closed y la lista de spans presentes. Error: `pii=True`, spans incompletos, tool omitido o versión vacía → `REDACT_AND_QUARANTINE_TRACE` o `RESTORE_TRACE_CONTEXT`. Criterio CF-5: un auditor de Moquegua sintético reconstruye la decisión **sin** secretos en el sink.",
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
          "Antes de promover S51-T1-B, verifica el contrato ejecutable y el riesgo residual.",
      },
    },
    {
      heading: "Tokens, costo, latency y redacción",
      subtopicId: "S51-T1-B",
      paragraphs: [
        "**Tokens, costo y latencia** se miden **por etapa** (prompt build, retrieval, generation, tools) y por **percentil** (p50/p95), no solo media: un p95 de 5 s con media de 200 ms es un incidente de UX, no un «pico normal». El **costo** se deriva de tokens × precio por etapa; si la suma por etapa no reconcilia `total_tokens`, el dashboard miente. **Redacción** aplica a atributos, eventos, payloads y mensajes de error: un stack trace con email o Authorization es PII en el sink.",
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
          "La revisión de S51-T2-A exige salida esperada y fail-closed ante breach.",
      },
    },
    {
      heading: "Registro de modelo, prompt y dataset",
      subtopicId: "S51-T2-A",
      paragraphs: [
        "Con la traza `tr-moq-51` y el dashboard de tokens/p95 de T1 ya redactado, el **registry** fija qué versión generó cada respuesta. Identifica **modelo, prompt, dataset, índice y evaluador** con IDs inmutables; un **release** apunta a un **bundle versionado** (system card + eval digest), no a `latest`. Responder en producción sin pin es drift silencioso: no hay rollback ni postmortem reproducible. El anti-patrón clásico es desplegar con `model=latest` y descubrir el cambio solo cuando falla la calidad.",
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
          "Contrato S51-T2-B: fixture S51-T2-B; si falta evidencia, no promociones.",
      },
    },
    {
      heading: "Cambio, acceso, retención y auditoría",
      subtopicId: "S51-T2-B",
      paragraphs: [
        "El bundle `copilot-7` de T2-A no se promueve solo: **change control** registra autor, aprobador y riesgo residual (**segregación de funciones**: quien escribe no se auto-aprueba). **Acceso y retención** son mínimos (need-to-know + TTL corto en ops-read). El **audit log** es **append-only** para eventos de decisión, pero también se **depura** según política legal: retención ≠ eternidad de PII. Sin ambos, no hay gobernanza operable sobre el registry.",
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
          "Para S51-T3-A: fixture S51-T3-A; si falta evidencia, no promociones.",
      },
    },
    {
      heading: "SLO, feedback y drift",
      subtopicId: "S51-T3-A",
      paragraphs: [
        "Con release pinneado y change ticket de T2, el **SLO** del copiloto combina **disponibilidad**, **calidad** (faithfulness / abstain rate) y **latencia** con **error budget**: si quemas el presupuesto, se detienen releases (no se «optimiza» en silencio). El **feedback** de usuarios es señal **sesgada** (quien se queja no es la población); **drift** exige slices, baseline y **dueño** antes de actuar — no reentrenar por un spike de thumbs-down. Un hallazgo de red team de S50 puede abrir el mismo slice de drift y, si persiste, el incidente de T3-B.",
        "Contrato de SLO multi-SLI. Entrada: `availability`, `faithfulness`, umbrales SLO, `drift`/`max_drift` y `owner` del runbook. Salida: alerta accionable (`OPEN_COPILOT_INCIDENT`) o `PASS` con owner visible y burn de error budget calculable. Error: SLI bajo umbral, drift excesivo o owner vacío. Si falta el owner del slice → `TRIAGE_DRIFT_SLICE` (no se inventa un responsable). Criterio: hay runbook con dueño antes de reentrenar o de tocar el release pinneado.",
        "En `CASO-MOQ-051-3A`, el slice de la entidad ficticia de Moquegua reporta availability 0.999 (≥0.995), faithfulness 0.93 (≥0.9) y drift 0.04 (≤0.08) con owner `ai-oncall`. Si faithfulness cae a 0.4, se abre incidente de copiloto; sin owner no se promociona el alert a producción de decisión. Señales ≠ fraude ni parentesco.",
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
          "Promoción de S51-T3-B solo con evidencia reproducible y dueño asignado.",
      },
    },
    {
      heading: "Incidentes, rollback y postmortem",
      subtopicId: "S51-T3-B",
      paragraphs: [
        "Cuando el multi-SLI de T3-A rompe el error budget (o un release de T2 introduce `latest`), el **incidente** de IA sigue el orden **contener → rollback → comunicar → postmortem blameless**. Contener congela el release defectuoso; el rollback vuelve al last-good pinneado dentro del **RTO**; el postmortem sin culpa nombra condiciones sistémicas (holdout tocado, redaction rota, tool allowlist) y acciones con fecha/dueño — no castiga al on-call. Un simulacro sin timeline ni owners no cuenta como readiness CF-5.",
        "Contrato de respuesta a incidente. Entrada: flags `contained`, `rolled_back_to` (last-good del registry), minutos de rollback vs `rto_minutes`, conteo de `postmortem_actions` y `owners_assigned`. Salida: timeline verificable o `ROLLBACK_AND_CONTAIN`. Error: sin contención, rollback fuera de RTO o acciones sin dueño. Si falta owners → `CONVENE_INCIDENT_REVIEW`. Criterio: se demuestra cómo revertir al pin de T2 y qué se aprendió para el system card.",
        "En `CASO-MOQ-051-3B`, el copiloto de la entidad ficticia de Moquegua empezó a citar un índice `latest` tras un release. El simulacro exige: **contener** (congelar release), **rollback** a `copilot-6` en ≤10 min (RTO), timeline con dueños y postmortem blameless. Ningún campo del caso prueba fraude o parentesco; solo calidad operativa del sistema.",
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
          "El dueño de S51-T4-A responde por rollback y evidencia; sin dueño no hay promote.",
      },
    },
    {
      heading: "Incertidumbre, citas y confirmaciones",
      subtopicId: "S51-T4-A",
      paragraphs: [
        "Con ops de traza, registry y incidente ya definidos, la **UX** del copiloto es el último eslabón que el usuario ve: muestra **incertidumbre** (low/med/high), **citas resolubles** al documento fuente (las mismas `cites` del span de retrieval de T1) y el **alcance** del claim; una **confirmación** resume el efecto (p. ej. «prepara borrador», no «envía a producción») antes de una acción irreversible y permite **corregir el dato fuente**. Ocultar «no sé» o auto-ejecutar tools de escritura es dark pattern, no productividad.",
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
          "Cierre de S51-T4-B: documenta residual risk y límites del lab stdlib.",
      },
    },
    {
      heading: "Accesibilidad, corrección y contestabilidad",
      subtopicId: "S51-T4-B",
      paragraphs: [
        "La confirmación de T4-A no basta si el panel es solo-mouse o ilegible. **Accesibilidad** (WCAG 2.2 AA): flujo completo por teclado, labels para lector de pantalla, contraste ≥ 4.5:1 y lenguaje claro no son opcionales en un copiloto de operaciones. **Contestabilidad** explica cómo **corregir** el dato, **apelar** y obtener respuesta humana con SLA — sin dark patterns (urgencia falsa, opt-out escondido). CF-5 exige flujo demostrable, no solo un banner de disclaimer. Cierra el hilo producto: traza + métricas redactadas + registry + change ticket + SLO + incidente + UX + a11y = freeze de interfaces.",
        "Contrato de a11y y apelación. Entrada: `keyboard_complete`, `screen_reader_labels`, `contrast_ratio` vs `min_contrast`, `correction_available`, `appeal_to_human`. Salida: flujo completable o `FAIL_ACCESSIBILITY_GATE`. Error: contraste bajo, teclado incompleto o sin corrección/apelación. Si falta ruta humana → `ROUTE_CONTESTATION`. Criterio: un usuario puede corregir y apelar sin mouse y con lector de pantalla; la apelación queda enlazada al `trace_id` y al release pinneado.",
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
    intro: "Te muestro 8 demos de S51 (Observabilidad, gobernanza y UX del copiloto) alineadas a CP-N4-C + CF-5. Cada demo **calcula** el artefacto del subtema sobre `CASO-MOQ-051` con stdlib; no son prints decorativos.",
    steps: [
      {
        demoId: "S51-T1-A-DEMO",
        subtopicId: "S51-T1-A",
        environment: "local-python",
        description: "Demo: traza con spans correlacionados y gate de PII",
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
        why: "Pienso en la traza como árbol padre/hijo (prompt→retrieval→tool→answer) con `trace_id` de correlación. Sin los cuatro spans no puedo auditar qué se citó ni qué tool se llamó. Si hay PII, cuarentena primero — no exporto y luego «limpio».",
      },
      {
        demoId: "S51-T1-B-DEMO",
        subtopicId: "S51-T1-B",
        environment: "local-python",
        description: "Demo: suma de tokens por etapa, p95 y redacción de atributos",
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
        why: "Uso p95 (no la media) porque el on-call siente los peores 5%. La suma de tokens por etapa debe cuadrar; el costo = tokens/1000 × precio — si la suma miente, el costo miente. Redacto email/prompt_raw **antes** del export.",
      },
      {
        demoId: "S51-T2-A-DEMO",
        subtopicId: "S51-T2-A",
        environment: "local-python",
        description: "Demo: pin de release y rechazo de latest",
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
        why: "En prod rechazo `latest` y bundles mutables: sin pin no hay rollback ni postmortem reproducible. El system card se enlaza al release, no a un floating tag.",
      },
      {
        demoId: "S51-T2-B-DEMO",
        subtopicId: "S51-T2-B",
        environment: "local-python",
        description: "Demo: dual-control, scope read y audit append-only",
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
        why: "Dual-control significa author ≠ approver: auto-aprobar es el anti-patrón. Scope termina en `-read` y retención corta; el audit es append-only, no un wiki editable.",
      },
      {
        demoId: "S51-T3-A-DEMO",
        subtopicId: "S51-T3-A",
        environment: "local-python",
        description: "Demo: multi-SLI, error budget y owner del slice",
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
        why: "Mido availability + faithfulness + drift juntos: un solo float de uptime no basta. El error budget quemado al 20% todavía da margen; faithfulness 0.4 abre incidente. Sin owner no hay runbook accionable.",
      },
      {
        demoId: "S51-T3-B-DEMO",
        subtopicId: "S51-T3-B",
        environment: "local-python",
        description: "Demo: contención, rollback dentro de RTO y postmortem con dueños",
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
        why: "Orden: contener, rollback al last-good `copilot-6` dentro del RTO, luego postmortem blameless con dueños. Si no contuve o me pasé del RTO, la acción es `ROLLBACK_AND_CONTAIN`, no «seguir investigando en prod».",
      },
      {
        demoId: "S51-T4-A-DEMO",
        subtopicId: "S51-T4-A",
        environment: "local-python",
        description: "Demo: gate de incertidumbre, citas y confirmación de efecto",
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
        why: "Muestro incertidumbre y citas resolubles; el resumen del efecto («prepara borrador») va **antes** del side-effect. Sin confirmación humana cuando se exige, bloqueo la acción irreversible.",
      },
      {
        demoId: "S51-T4-B-DEMO",
        subtopicId: "S51-T4-B",
        environment: "local-python",
        description: "Demo: contraste WCAG, teclado y ruta de apelación",
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
        why: "Comparo contraste numérico con el mínimo AA (4.5). Teclado + labels + corrección + apelación humana cierran contestabilidad; sin appeal no hay CF-5 aunque el UI se vea «bonito».",
      },
    ],
  },
  weDo: {
    intro: "S51 · Laboratorio Auditable AI Operations Copilot y CF-5: 24 retos locales sobre `CASO-MOQ-051`. E1 repara un predicado de dominio, E2 separa valid/invalid/missing y E3 transfiere con helpers de compute (reconciliación de tokens, multi-SLI, dual-control, a11y) hacia CONTINUE / acción de breach / restore. Fixtures sintéticos de Moquegua; sin PII real.",
    steps: [
      {
        id: "S51-T1-A-E1",
        subtopicId: "S51-T1-A",
        kind: "guided",
        instruction: "S51-T1-A-E1 · Calcula el contrato de **traces de prompts, retrieval y tools** sobre `CASO-MOQ-051-1A`. El fixture trae `trace_id`, spans (`prompt/retrieval/tool/answer`), versiones pinneadas y `pii_in_trace=False`. Corrige la expresión booleana invertida (no los datos ni el assert). Salida exacta: `S51-T1-A PASS`. El mismo predicado sobre un adverso con PII o spans incompletos debe activar `REDACT_AND_QUARANTINE_TRACE` en E2.",
        hint: "Exige `trace_id` con prefijo `tr-`, los cuatro spans y `pii_in_trace is False`.",
        hints: [
          "Exige `trace_id` con prefijo `tr-`, el conjunto `prompt/retrieval/tool/answer` y versiones no vacías.",
          "El fixture válido ya cumple el contrato; la inversión del starter trata PII o traza vacía como éxito — corrige el sentido del booleano.",
        ],
        edgeCases: ["falta pii_in_trace", "fixture adverso: trace_id vacío, spans incompletos o pii_in_trace=True", "CASO-MOQ-051-1A es sintético"],
        tests: "El fixture `CASO-MOQ-051-1A` satisface un predicado de dominio real; imprime `S51-T1-A PASS` y el assert booleano pasa.",
        feedback: "S51-T1-A-E1: explica qué campo cambió la decisión, por qué el adverso activa REDACT_AND_QUARANTINE_TRACE y por qué faltar pii_in_trace exige RESTORE_TRACE_CONTEXT.",
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
        instruction: "S51-T1-A-E2 · Modela tres rutas del contrato de **traces** (prompts/retrieval/tools): fixture válido, fixture adverso y registro sin `pii_in_trace`. Entrada: dict con case_id, trace_id, spans, versions, pii_in_trace. Salidas exactas: `PASS`, `REDACT_AND_QUARANTINE_TRACE`, `MISSING:pii_in_trace`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero calcula `missing`; no leas `pii_in_trace` hasta confirmar que la clave existe.",
        hints: [
          "Primero calcula `missing`; no leas `pii_in_trace` hasta confirmar que la clave existe.",
          "Tras el schema: `tr-` + cuatro spans + versiones pinneadas + cero PII. El adverso falla por contenido (PII/spans), no por claves ausentes.",
        ],
        edgeCases: ["falta pii_in_trace", "fixture adverso: trace_id vacío, spans incompletos o pii_in_trace=True", "CASO-MOQ-051-1A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `pii_in_trace` ausente y produce exactamente `PASS REDACT_AND_QUARANTINE_TRACE MISSING:pii_in_trace`.",
        feedback: "S51-T1-A-E2: explica qué campo cambió la decisión, por qué el adverso activa REDACT_AND_QUARANTINE_TRACE y por qué faltar pii_in_trace exige RESTORE_TRACE_CONTEXT.",
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
        instruction: "S51-T1-A-E3 · Transferencia de traza: implementa `spans_complete` (los cuatro nombres prompt/retrieval/tool/answer) y `versions_pinned` (todas las versiones no vacías y distintas de `latest`) y úsalas en `decide`. `CASO-MOQ-051-1A` → `CONTINUE`, adverso (PII, spans incompletos o versiones vacías) → `REDACT_AND_QUARANTINE_TRACE`, sin `pii_in_trace` → `RESTORE_TRACE_CONTEXT`. El starter invierte los helpers y trata missing como CONTINUE. Salida: imprime el valor de meets_contract.",
        hint: "Missing → RESTORE_TRACE_CONTEXT; pii_in_trace True o helpers en falso → REDACT_AND_QUARANTINE_TRACE; solo traza limpia y completa → CONTINUE.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `RESTORE_TRACE_CONTEXT` antes de evaluar el contenido.",
          "spans_complete exige el conjunto mínimo de cuatro spans; versions_pinned rechaza cadenas vacías y el tag `latest`.",
        ],
        edgeCases: ["falta pii_in_trace", "fixture adverso: trace_id vacío, spans incompletos o pii_in_trace=True", "CASO-MOQ-051-1A es sintético"],
        tests: "Fixtures `CASO-MOQ-051-1A`, adverso y sin `pii_in_trace` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S51-T1-A-E3: explica cómo spans_complete y versions_pinned separan CONTINUE de cuarentena, y por qué faltar pii_in_trace exige RESTORE_TRACE_CONTEXT.",
        starterCode: {
          language: 'python',
          title: "s51-t1-a-e3.py",
          code: `# CASO-MOQ-051 · decide restore vs continue (transfer spans/versions)
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
        instruction: "S51-T1-B-E1 · Compara el contrato de **tokens, costo, latency y redacción** sobre `CASO-MOQ-051-1B`. Debes demostrar que prompt+retrieval+answer == `total_tokens`, `p95_ms` ≤ `slo_ms` y `redacted_fields` ≥ 1. Corrige la expresión booleana invertida (no los datos ni el assert). Salida exacta: `S51-T1-B PASS`. Un adverso con total descuadrado, p95 alto o sin redacción activa `ALERT_COST_LATENCY` en E2.",
        hint: "Suma prompt+retrieval+answer y compárala con `total_tokens`; exige p95 ≤ SLO y al menos un campo redactado.",
        hints: [
          "Suma prompt+retrieval+answer y compárala con `total_tokens`; exige p95 ≤ SLO y `redacted_fields >= 1`.",
          "El starter pasa si el total es 0 o si p95 supera el SLO — invierte esas comparaciones para reflejar un dashboard sano.",
        ],
        edgeCases: ["falta redacted_fields", "fixture adverso: total_tokens no cuadra, p95>slo o redacted_fields=0", "CASO-MOQ-051-1B es sintético"],
        tests: "El fixture `CASO-MOQ-051-1B` satisface un predicado de dominio real; imprime `S51-T1-B PASS` y el assert booleano pasa.",
        feedback: "S51-T1-B-E1: explica qué campo cambió la decisión, por qué el adverso activa ALERT_COST_LATENCY y por qué faltar redacted_fields exige FIX_REDACTION_PIPELINE.",
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
        instruction: "S51-T1-B-E2 · Verifica tres rutas de `tokens, costo, latency y redacción`: fixture válido, fixture adverso y registro sin `redacted_fields`. Entrada: dict con case_id, prompt_tokens, retrieval_tokens, answer_tokens, total_tokens, p95_ms, slo_ms, redacted_fields. Salidas exactas: `PASS`, `ALERT_COST_LATENCY`, `MISSING:redacted_fields`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a redacted_fields debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a redacted_fields debe ocurrir antes de esa rama.",
          "Después aplica la regla de S51-T1-B: tokens cuadran, p95 bajo SLO y campos redactados. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta redacted_fields", "fixture adverso: total_tokens no cuadra, p95>slo o redacted_fields=0", "CASO-MOQ-051-1B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `redacted_fields` ausente y produce exactamente `PASS ALERT_COST_LATENCY MISSING:redacted_fields`.",
        feedback: "S51-T1-B-E2: explica qué campo cambió la decisión, por qué el adverso activa ALERT_COST_LATENCY y por qué faltar redacted_fields exige FIX_REDACTION_PIPELINE.",
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
        instruction: "S51-T1-B-E3 · Transferencia de costo/latencia: implementa `reconcile_tokens` (suma por etapa), `estimate_cost_usd` (total/1000 × 0.002) y `export_clean` (`redacted_fields >= 1`) y úsalas en `decide`. `CASO-MOQ-051-1B` → `CONTINUE` solo si tokens cuadran, p95 ≤ SLO, export limpio y costo ≥ 0; adverso → `ALERT_COST_LATENCY`; sin `redacted_fields` → `FIX_REDACTION_PIPELINE`. El starter ignora la reconciliación y trata missing como CONTINUE. Salida: imprime el valor de meets_contract.",
        hint: "Primero missing → FIX_REDACTION_PIPELINE; luego reconcile_tokens + p95_ok + export_clean + estimate_cost_usd ≥ 0 para CONTINUE.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `FIX_REDACTION_PIPELINE` antes de evaluar el contenido.",
          "estimate_cost_usd = round(total_tokens/1000 * 0.002, 6); en el fixture válido debe dar 0.003. No uses la media de latencia: el gate es p95_ms <= slo_ms.",
        ],
        edgeCases: ["falta redacted_fields", "fixture adverso: total_tokens no cuadra, p95>slo o redacted_fields=0", "CASO-MOQ-051-1B es sintético"],
        tests: "Fixtures `CASO-MOQ-051-1B`, adverso y sin `redacted_fields` prueban continue/breach/uncertainty en ese orden; el costo del válido es 0.003.",
        feedback: "S51-T1-B-E3: explica cómo suma de tokens, p95 y costo = f(tokens, precio) separan CONTINUE de ALERT_COST_LATENCY, y por qué missing no es breach.",
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
        instruction: "S51-T2-A-E1 · Filtra el contrato de **registro de modelo, prompt y dataset** sobre `CASO-MOQ-051-2A`. Exige release/model/prompt/dataset/index/evaluator pinneados (≠ `latest`) e `immutable=True`. Corrige la expresión booleana invertida (no los datos ni el assert). Salida exacta: `S51-T2-A PASS`. Un adverso con `latest` o mutable activa `FREEZE_RELEASE_BUNDLE` en E2.",
        hint: "Ningún artefacto puede ser vacío o `latest`; `immutable` debe ser True.",
        hints: [
          "Recorre release/model/prompt/dataset/index/evaluator: todos pinneados y distintos de `latest`.",
          "El starter aprueba bundles mutables o con `latest` — el contrato de prod es el opuesto: freeze ante esos casos.",
        ],
        edgeCases: ["falta immutable", "fixture adverso: release=latest, versiones vacías o immutable=False", "CASO-MOQ-051-2A es sintético"],
        tests: "El fixture `CASO-MOQ-051-2A` satisface un predicado de dominio real; imprime `S51-T2-A PASS` y el assert booleano pasa.",
        feedback: "S51-T2-A-E1: explica qué campo cambió la decisión, por qué el adverso activa FREEZE_RELEASE_BUNDLE y por qué faltar immutable exige REGISTER_MISSING_VERSION.",
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
        instruction: "S51-T2-A-E2 · Clasifica tres rutas de `registro de modelo/prompt/dataset`: fixture válido, fixture adverso y registro sin `immutable`. Entrada: dict con case_id, release, model, prompt, dataset, index, evaluator, immutable. Salidas exactas: `PASS`, `FREEZE_RELEASE_BUNDLE`, `MISSING:immutable`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a immutable debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a immutable debe ocurrir antes de esa rama.",
          "Después aplica la regla de S51-T2-A: seis versiones explícitas y bundle inmutable. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta immutable", "fixture adverso: release=latest, versiones vacías o immutable=False", "CASO-MOQ-051-2A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `immutable` ausente y produce exactamente `PASS FREEZE_RELEASE_BUNDLE MISSING:immutable`.",
        feedback: "S51-T2-A-E2: explica qué campo cambió la decisión, por qué el adverso activa FREEZE_RELEASE_BUNDLE y por qué faltar immutable exige REGISTER_MISSING_VERSION.",
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
        instruction: "S51-T2-A-E3 · Transferencia de registry: implementa `versions_pinned` (cada artefacto no vacío y ≠ `latest`) y `bundle_immutable` (`immutable is True`) y úsalas en `decide`. `CASO-MOQ-051-2A` → `CONTINUE`, adverso (latest/vacío/mutable) → `FREEZE_RELEASE_BUNDLE`, sin `immutable` → `REGISTER_MISSING_VERSION`. El starter invierte los helpers y trata missing como CONTINUE. Salida: imprime el valor de meets_contract.",
        hint: "Missing → REGISTER_MISSING_VERSION; versions_pinned y bundle_immutable en falso → FREEZE_RELEASE_BUNDLE; solo pin completo e inmutable → CONTINUE.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REGISTER_MISSING_VERSION` antes de evaluar el contenido.",
          "versions_pinned recorre release/model/prompt/dataset/index/evaluator; bundle_immutable exige flag True, no truthy suelto.",
        ],
        edgeCases: ["falta immutable", "fixture adverso: release=latest, versiones vacías o immutable=False", "CASO-MOQ-051-2A es sintético"],
        tests: "Fixtures `CASO-MOQ-051-2A`, adverso y sin `immutable` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S51-T2-A-E3: explica cómo versions_pinned y bundle_immutable separan CONTINUE de freeze, y por qué faltar immutable exige REGISTER_MISSING_VERSION.",
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
        instruction: "S51-T2-B-E1 · Modela el contrato de **cambio, acceso, retención y auditoría** sobre `CASO-MOQ-051-2B`. Dual-control (`author` ≠ `approver`), risk en {low,medium,high}, scope `*-read`, retención ≤30 y `audit_append_only=True`. Corrige la expresión booleana invertida (no los datos ni el assert). Salida exacta: `S51-T2-B PASS`. Self-approve o admin activa `REJECT_UNGOVERNED_CHANGE` en E2.",
        hint: "author ≠ approver, scope `*-read`, retención ≤ 30 y audit append-only.",
        hints: [
          "Segregación de funciones: `author` y `approver` son personas distintas; risk ∈ {low, medium, high}.",
          "Self-approve o `global-admin` deben fallar el contrato; el starter hoy los trata como éxito.",
        ],
        edgeCases: ["falta audit_append_only", "fixture adverso: author==approver, scope admin, retención excesiva o audit no append-only", "CASO-MOQ-051-2B es sintético"],
        tests: "El fixture `CASO-MOQ-051-2B` satisface un predicado de dominio real; imprime `S51-T2-B PASS` y el assert booleano pasa.",
        feedback: "S51-T2-B-E1: explica qué campo cambió la decisión, por qué el adverso activa REJECT_UNGOVERNED_CHANGE y por qué faltar audit_append_only exige REQUEST_INDEPENDENT_APPROVAL.",
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
        instruction: "S51-T2-B-E2 · Audita tres rutas de `cambio, acceso, retención y auditoría`: fixture válido, fixture adverso y registro sin `audit_append_only`. Entrada: dict con case_id, author, approver, risk, access_scope, retention_days, audit_append_only. Salidas exactas: `PASS`, `REJECT_UNGOVERNED_CHANGE`, `MISSING:audit_append_only`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a audit_append_only debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a audit_append_only debe ocurrir antes de esa rama.",
          "Después aplica la regla de S51-T2-B: separación de funciones, scope read, retención y audit. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta audit_append_only", "fixture adverso: author==approver, scope admin, retención excesiva o audit no append-only", "CASO-MOQ-051-2B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `audit_append_only` ausente y produce exactamente `PASS REJECT_UNGOVERNED_CHANGE MISSING:audit_append_only`.",
        feedback: "S51-T2-B-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_UNGOVERNED_CHANGE y por qué faltar audit_append_only exige REQUEST_INDEPENDENT_APPROVAL.",
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
        instruction: "S51-T2-B-E3 · Transferencia de dual-control: implementa `sod_ok` (author ≠ approver y risk en low/medium/high) y `access_policy_ok` (scope termina en `-read`, retención ≤30, audit_append_only True) y úsalas en `decide`. `CASO-MOQ-051-2B` → `CONTINUE`, adverso → `REJECT_UNGOVERNED_CHANGE`, sin `audit_append_only` → `REQUEST_INDEPENDENT_APPROVAL`. El starter invierte SoD y trata missing como CONTINUE. Salida: imprime el valor de meets_contract.",
        hint: "Missing → REQUEST_INDEPENDENT_APPROVAL; sod_ok y access_policy_ok en falso → REJECT_UNGOVERNED_CHANGE; solo ambos True → CONTINUE.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_INDEPENDENT_APPROVAL` antes de evaluar el contenido.",
          "sod_ok separa funciones; access_policy_ok une scope least-privilege, TTL y audit append-only.",
        ],
        edgeCases: ["falta audit_append_only", "fixture adverso: author==approver, scope admin, retención excesiva o audit no append-only", "CASO-MOQ-051-2B es sintético"],
        tests: "Fixtures `CASO-MOQ-051-2B`, adverso y sin `audit_append_only` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S51-T2-B-E3: explica cómo sod_ok y access_policy_ok separan CONTINUE de rechazo, y por qué faltar audit_append_only exige REQUEST_INDEPENDENT_APPROVAL.",
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
        instruction: "S51-T3-A-E1 · Verifica el contrato de **SLO, feedback y drift** sobre `CASO-MOQ-051-3A`. Availability y faithfulness ≥ sus SLO, drift ≤ max, y `owner` no vacío. Corrige la expresión booleana invertida (no los datos ni el assert). Salida exacta: `S51-T3-A PASS`. SLI roto con owner presente activa `OPEN_COPILOT_INCIDENT` en E2.",
        hint: "availability y faithfulness ≥ sus SLO, drift ≤ max y `owner` no vacío.",
        hints: [
          "Compara cada SLI con su umbral en la dirección correcta (≥ para calidad/disponibilidad, ≤ para drift).",
          "El starter marca PASS cuando availability está bajo el SLO — invierte el sentido y no olvides faithfulness ni owner.",
        ],
        edgeCases: ["falta owner", "fixture adverso: availability bajo SLO, faithfulness baja, drift alto o owner vacío", "CASO-MOQ-051-3A es sintético"],
        tests: "El fixture `CASO-MOQ-051-3A` satisface un predicado de dominio real; imprime `S51-T3-A PASS` y el assert booleano pasa.",
        feedback: "S51-T3-A-E1: explica qué campo cambió la decisión, por qué el adverso activa OPEN_COPILOT_INCIDENT y por qué faltar owner exige TRIAGE_DRIFT_SLICE.",
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
        instruction: "S51-T3-A-E2 · Decide tres rutas de `SLO, feedback y drift`: fixture válido, fixture adverso y registro sin `owner`. Entrada: dict con case_id, availability, availability_slo, faithfulness, faithfulness_slo, drift, max_drift, owner. Salidas exactas: `PASS`, `OPEN_COPILOT_INCIDENT`, `MISSING:owner`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a owner debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a owner debe ocurrir antes de esa rama.",
          "Después aplica la regla de S51-T3-A: availability/faithfulness/drift bajo SLO con owner. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta owner", "fixture adverso: availability bajo SLO, faithfulness baja, drift alto o owner vacío", "CASO-MOQ-051-3A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `owner` ausente y produce exactamente `PASS OPEN_COPILOT_INCIDENT MISSING:owner`.",
        feedback: "S51-T3-A-E2: explica qué campo cambió la decisión, por qué el adverso activa OPEN_COPILOT_INCIDENT y por qué faltar owner exige TRIAGE_DRIFT_SLICE.",
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
        instruction: "S51-T3-A-E3 · Transferencia multi-SLI: implementa `sli_ok` (availability, faithfulness y drift vs umbrales) y `error_budget_burn` (errores/allowed en ventana 100) y úsalas en `decide` con owner obligatorio. `CASO-MOQ-051-3A` → `CONTINUE` si SLI OK, owner presente y burn finito; adverso → `OPEN_COPILOT_INCIDENT`; sin clave `owner` → `TRIAGE_DRIFT_SLICE`. El starter invierte el gate y trata missing como CONTINUE. Salida: imprime el valor de meets_contract.",
        hint: "Missing de owner → TRIAGE_DRIFT_SLICE; owner vacío o SLI roto → OPEN_COPILOT_INCIDENT. burn = errors/allowed con allowed=(1-slo)*window.",
        hints: [
          "Una ausencia de clave no equivale a breach: enrútala a `TRIAGE_DRIFT_SLICE` antes de evaluar el contenido.",
          "error_budget_burn(0.999, 0.995) debe ser 0.2 en ventana 100. sli_ok no basta solo: también bool(owner).",
        ],
        edgeCases: ["falta owner", "fixture adverso: availability bajo SLO, faithfulness baja, drift alto o owner vacío", "CASO-MOQ-051-3A es sintético"],
        tests: "Fixtures `CASO-MOQ-051-3A`, adverso y sin `owner` prueban continue/breach/uncertainty; burn del válido es 0.2.",
        feedback: "S51-T3-A-E3: explica multi-SLI + error budget + owner: por qué falta de owner es triage y no se inventa un responsable.",
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
        instruction: "S51-T3-B-E1 · Clasifica el contrato de **incidentes, rollback y postmortem** sobre `CASO-MOQ-051-3B`. Contención True, last-good `copilot-*`, rollback ≤ RTO, ≥1 acción de postmortem y owners asignados. Corrige la expresión booleana invertida (no los datos ni el assert). Salida exacta: `S51-T3-B PASS`. Sin contención o fuera de RTO activa `ROLLBACK_AND_CONTAIN` en E2.",
        hint: "Contención True, last-good `copilot-*`, minutos ≤ RTO, ≥1 acción y owners asignados.",
        hints: [
          "Orden mental: contained → rollback al pin → reloj ≤ RTO → postmortem con dueños.",
          "El starter pasa si no hubo contención o si el rollback se pasó del RTO; invierte esas ramas.",
        ],
        edgeCases: ["falta owners_assigned", "fixture adverso: sin contención, rollback fuera de RTO o sin acciones/dueños", "CASO-MOQ-051-3B es sintético"],
        tests: "El fixture `CASO-MOQ-051-3B` satisface un predicado de dominio real; imprime `S51-T3-B PASS` y el assert booleano pasa.",
        feedback: "S51-T3-B-E1: explica qué campo cambió la decisión, por qué el adverso activa ROLLBACK_AND_CONTAIN y por qué faltar owners_assigned exige CONVENE_INCIDENT_REVIEW.",
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
        instruction: "S51-T3-B-E2 · Calcula tres rutas de `incidents, rollback y postmortem`: fixture válido, fixture adverso y registro sin `owners_assigned`. Entrada: dict con case_id, contained, rolled_back_to, rollback_minutes, rto_minutes, postmortem_actions, owners_assigned. Salidas exactas: `PASS`, `ROLLBACK_AND_CONTAIN`, `MISSING:owners_assigned`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a owners_assigned debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a owners_assigned debe ocurrir antes de esa rama.",
          "Después aplica la regla de S51-T3-B: contención, last-good, RTO y acciones con dueño. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta owners_assigned", "fixture adverso: sin contención, rollback fuera de RTO o sin acciones/dueños", "CASO-MOQ-051-3B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `owners_assigned` ausente y produce exactamente `PASS ROLLBACK_AND_CONTAIN MISSING:owners_assigned`.",
        feedback: "S51-T3-B-E2: explica qué campo cambió la decisión, por qué el adverso activa ROLLBACK_AND_CONTAIN y por qué faltar owners_assigned exige CONVENE_INCIDENT_REVIEW.",
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
        instruction: "S51-T3-B-E3 · Transferencia de IR: implementa `within_rto` (minutos ≤ RTO y last-good `copilot-*`) y `ir_complete` (contained, ≥1 postmortem_actions, owners_assigned) y úsalas en `decide`. `CASO-MOQ-051-3B` → `CONTINUE`, adverso → `ROLLBACK_AND_CONTAIN`, sin `owners_assigned` → `CONVENE_INCIDENT_REVIEW`. El starter invierte RTO y trata missing como CONTINUE. Salida: imprime el valor de meets_contract.",
        hint: "Missing → CONVENE_INCIDENT_REVIEW; within_rto e ir_complete en falso → ROLLBACK_AND_CONTAIN; solo ambos True → CONTINUE.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `CONVENE_INCIDENT_REVIEW` antes de evaluar el contenido.",
          "within_rto mide el reloj del rollback; ir_complete exige contención, acciones y dueños del postmortem.",
        ],
        edgeCases: ["falta owners_assigned", "fixture adverso: sin contención, rollback fuera de RTO o sin acciones/dueños", "CASO-MOQ-051-3B es sintético"],
        tests: "Fixtures `CASO-MOQ-051-3B`, adverso y sin `owners_assigned` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S51-T3-B-E3: explica cómo within_rto e ir_complete separan CONTINUE de contención, y por qué faltar owners_assigned exige CONVENE_INCIDENT_REVIEW.",
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
        instruction: "S51-T4-A-E1 · Audita el contrato de **incertidumbre, citas y confirmaciones** sobre `CASO-MOQ-051-4A`. Incertidumbre visible, citas resolubles, effect_summary no vacío y (si `confirmation_required`) `confirmed=True`. Corrige la expresión booleana invertida (no los datos ni el assert). Salida exacta: `S51-T4-A PASS`. Side-effect sin confirmación activa `BLOCK_UNCONFIRMED_ACTION` en E2.",
        hint: "Incertidumbre y citas visibles; si hay confirmación requerida, `confirmed` debe ser True.",
        hints: [
          "`effect_summary` no vacío resume el side-effect («prepara borrador») antes de ejecutarlo.",
          "El starter trata la falta de confirmación como PASS; el contrato bloquea side-effects no confirmados.",
        ],
        edgeCases: ["falta confirmed", "fixture adverso: sin incertidumbre/citas visibles o acción sin confirmación", "CASO-MOQ-051-4A es sintético"],
        tests: "El fixture `CASO-MOQ-051-4A` satisface un predicado de dominio real; imprime `S51-T4-A PASS` y el assert booleano pasa.",
        feedback: "S51-T4-A-E1: explica qué campo cambió la decisión, por qué el adverso activa BLOCK_UNCONFIRMED_ACTION y por qué faltar confirmed exige ASK_USER_TO_CONFIRM.",
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
        instruction: "S51-T4-A-E2 · Compara tres rutas de `incertidumbre, citas y confirmaciones`: fixture válido, fixture adverso y registro sin `confirmed`. Entrada: dict con case_id, uncertainty_shown, citations_resolve, effect_summary, confirmation_required, confirmed. Salidas exactas: `PASS`, `BLOCK_UNCONFIRMED_ACTION`, `MISSING:confirmed`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a confirmed debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a confirmed debe ocurrir antes de esa rama.",
          "Después aplica la regla de S51-T4-A: incertidumbre/citas visibles y efecto confirmado. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta confirmed", "fixture adverso: sin incertidumbre/citas visibles o acción sin confirmación", "CASO-MOQ-051-4A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `confirmed` ausente y produce exactamente `PASS BLOCK_UNCONFIRMED_ACTION MISSING:confirmed`.",
        feedback: "S51-T4-A-E2: explica qué campo cambió la decisión, por qué el adverso activa BLOCK_UNCONFIRMED_ACTION y por qué faltar confirmed exige ASK_USER_TO_CONFIRM.",
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
        instruction: "S51-T4-A-E3 · Transferencia de UX: implementa `evidence_visible` (incertidumbre + citas resolubles + effect_summary no vacío) y `effect_confirmed` (si confirmation_required entonces confirmed) y úsalas en `decide`. `CASO-MOQ-051-4A` → `CONTINUE`, adverso → `BLOCK_UNCONFIRMED_ACTION`, sin `confirmed` → `ASK_USER_TO_CONFIRM`. El starter invierte evidencia y trata missing como CONTINUE. Salida: imprime el valor de meets_contract.",
        hint: "Missing → ASK_USER_TO_CONFIRM; evidence_visible o effect_confirmed en falso → BLOCK_UNCONFIRMED_ACTION; solo ambos True → CONTINUE.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `ASK_USER_TO_CONFIRM` antes de evaluar el contenido.",
          "evidence_visible cubre lo que el usuario ve; effect_confirmed cubre el side-effect irreversible.",
        ],
        edgeCases: ["falta confirmed", "fixture adverso: sin incertidumbre/citas visibles o acción sin confirmación", "CASO-MOQ-051-4A es sintético"],
        tests: "Fixtures `CASO-MOQ-051-4A`, adverso y sin `confirmed` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S51-T4-A-E3: explica cómo evidence_visible y effect_confirmed separan CONTINUE de bloqueo, y por qué faltar confirmed exige ASK_USER_TO_CONFIRM.",
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
        instruction: "S51-T4-B-E1 · Decide el contrato de **accesibilidad, corrección y contestabilidad** sobre `CASO-MOQ-051-4B`. Teclado completo, labels de lector, `contrast_ratio` ≥ `min_contrast` (AA), corrección y apelación a humano. Corrige la expresión booleana invertida (no los datos ni el assert). Salida exacta: `S51-T4-B PASS`. Contraste bajo o solo-mouse activa `FAIL_ACCESSIBILITY_GATE` en E2.",
        hint: "Teclado + labels + contraste ≥ min AA + corrección + apelación humana.",
        hints: [
          "Compara `contrast_ratio >= min_contrast` (4.5 en AA); no uses igualdad exacta ni el sentido invertido.",
          "El starter aprueba paneles solo-mouse o sin appeal; CF-5 exige ambos caminos y contraste legible.",
        ],
        edgeCases: ["falta appeal_to_human", "fixture adverso: teclado/lector incompleto, contraste bajo o sin apelación", "CASO-MOQ-051-4B es sintético"],
        tests: "El fixture `CASO-MOQ-051-4B` satisface un predicado de dominio real; imprime `S51-T4-B PASS` y el assert booleano pasa.",
        feedback: "S51-T4-B-E1: explica qué campo cambió la decisión, por qué el adverso activa FAIL_ACCESSIBILITY_GATE y por qué faltar appeal_to_human exige ROUTE_CONTESTATION.",
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
        instruction: "S51-T4-B-E2 · Filtra tres rutas de `accesibilidad, corrección y contestabilidad`: fixture válido, fixture adverso y registro sin `appeal_to_human`. Entrada: dict con case_id, keyboard_complete, screen_reader_labels, contrast_ratio, min_contrast, correction_available, appeal_to_human. Salidas exactas: `PASS`, `FAIL_ACCESSIBILITY_GATE`, `MISSING:appeal_to_human`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a appeal_to_human debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a appeal_to_human debe ocurrir antes de esa rama.",
          "Después aplica la regla de S51-T4-B: teclado/lector/contraste y corrección/apelación. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta appeal_to_human", "fixture adverso: teclado/lector incompleto, contraste bajo o sin apelación", "CASO-MOQ-051-4B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `appeal_to_human` ausente y produce exactamente `PASS FAIL_ACCESSIBILITY_GATE MISSING:appeal_to_human`.",
        feedback: "S51-T4-B-E2: explica qué campo cambió la decisión, por qué el adverso activa FAIL_ACCESSIBILITY_GATE y por qué faltar appeal_to_human exige ROUTE_CONTESTATION.",
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
        instruction: "S51-T4-B-E3 · Transferencia a11y: implementa `meets_wcag_aa` (teclado, labels, `contrast_ratio >= min_contrast`, corrección y apelación) y úsala en `decide`. `CASO-MOQ-051-4B` → `CONTINUE`, adverso → `FAIL_ACCESSIBILITY_GATE`, sin `appeal_to_human` → `ROUTE_CONTESTATION`. El starter invierte el contraste y trata missing como CONTINUE. Salida: imprime el valor de meets_contract.",
        hint: "Missing → ROUTE_CONTESTATION; compara contraste numéricamente (>=), no con igualdad exacta.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `ROUTE_CONTESTATION` antes de evaluar el contenido.",
          "meets_wcag_aa debe exigir keyboard_complete, screen_reader_labels, contrast_ratio >= min_contrast, correction_available y appeal_to_human.",
        ],
        edgeCases: ["falta appeal_to_human", "fixture adverso: teclado/lector incompleto, contraste bajo o sin apelación", "CASO-MOQ-051-4B es sintético"],
        tests: "Fixtures `CASO-MOQ-051-4B`, adverso y sin `appeal_to_human` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S51-T4-B-E3: explica el umbral de contraste AA y por qué sin appeal se enruta a ROUTE_CONTESTATION en lugar de inventar un humano.",
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
      "Incluye SLO/drift/feedback/incidente/postmortem (`slo_incident_postmortem`).",
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
    portfolioNote: "Evidencia de CP-N4-C + CF-5 · copiloto observable y contestable: muestra baseline, decisión, pruebas, resultado medido, rollback y riesgo residual. El checklist inicia en BLOCKED por diseño (dicts vacíos); conviértelo en READY alimentando `trace`/`bundle`/`change`/`slo`/`ir`/`ux`/`a11y` con artefactos reales del proyecto y dejando que los helpers calculen las banderas — no hardcodees True ni cambies asserts.",
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
        options: ["exportar prompt_raw y email para «depurar más rápido»", "usar model=latest en el registry de producción", "auto-aprobar el release si el autor y el aprobador son la misma persona", "redactar email/authorization/prompt_raw y rechazar el export si queda PII"],
        correctIndex: 3,
        explanation: "La redacción de atributos sensibles es parte del contrato de observabilidad; dual-control y pin de versiones son obligatorios en prod.",
      },
      {
        question: "Un trace de copiloto con spans completos pero `pii_in_trace=True`, ¿qué acción es correcta en S51?",
        options: ["Promover a producción porque los spans están completos", "Borrar el audit log para ocultar el PII", "REDACT_AND_QUARANTINE_TRACE y bloquear promoción hasta re-redacción", "Inferir fraude del usuario a partir del prompt"],
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
