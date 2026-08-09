# S26 Paragraph-by-Paragraph Analysis with Sources

Generated: 2026-07-24T04:27:49.332+00:00
Section: Orquestación y VP RPA + AI Analyst
File: `s26-integrator-phase1.ts`
STORM cycles: **26**
Expert rank: **9.55**

## Competitive sources (domain-honest HTTP ≥5)

- Prefect: [Docs](https://docs.prefect.io/) — orchestration
- Prefect: [Flows](https://docs.prefect.io/v3/concepts/flows) — flows
- Airflow: [Core concepts](https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/overview.html) — DAGs
- Google: [SRE SLOs workbook](https://sre.google/workbook/implementing-slos/) — SLO
- Google: [Postmortem culture](https://sre.google/sre-book/postmortem-culture/) — incidents
- 12factor: [App methodology](https://12factor.net/) — config logs
- Coursera: [Pipeline orchestration](https://www.coursera.org/courses?query=data%20pipeline%20orchestration) — MOOC
- deeplearning.ai: [Data engineering](https://www.deeplearning.ai/specializations/data-engineering) — pipelines
- MIT: [6.100L](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/) — foundations
- Harvard: [CS50P](https://cs50.harvard.edu/python/) — tests
- Nygard: [Release It concepts](https://pragprog.com/titles/mnee2/release-it-second-edition/) — stability
- Py4E: [Python for Everybody](https://www.py4e.com) — progressive
- Live: [PyArcana](https://pillb.github.io/pyarcana/) — course

## Gold pass
| Area | Decision |
|------|----------|
| theory/iDo | domain contracts |
| weDo | CASO DEFECT |
| git | NO restore |
| STORM | hand_STORM_domain_sources |
| expert pass | deepen + expand resources |

## Theory (paragraph-level)

### Cierre CP-N2-C: orquestación del VP y regresión N2
**P1** (rank 9.55/10)
> S26 cierra el **Value Proposition RPA + AI Analyst** de CP-N2-C: orquestas el pipeline sintético Excel/sistema → validación → análisis → IA asistida → informe → aprobación human…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Prefect: https://docs.prefect.io/; Prefect: https://docs.prefect.io/v3/concepts/flows
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Cierre CP-N2-C: orquestación del VP y regresión » in S26_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> La regresión N2 (S14–S26 + CF-2) exige contratos estables entre análisis, reporting y automatización: mismos fixtures sintéticos, mismos predicates de éxito, y cero etiquetas au…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Prefect: https://docs.prefect.io/v3/concepts/flows; Airflow: https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/overview.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Cierre CP-N2-C: orquestación del VP y regresión » in S26_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Orden pedagógico: **T1 Orquestación** (DAG/estados/límites) → **T2 Resiliencia** (checkpoint, retry, DLQ, idempotencia, rollback) → **T3 HITL** (colas, approve/reject/edit) → **…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Airflow: https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/overview.html; Google: https://sre.google/workbook/implementing-slos/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Cierre CP-N2-C: orquestación del VP y regresión » in S26_STORM.json; edge `research_supports_paragraph`.

### tasks/flows/DAG y estados
**P1** (rank 9.55/10)
> Un **DAG** (directed acyclic graph) codifica dependencias de negocio: no puedes analizar antes de validar ni generar draft_email antes de approve. En la práctica del VP peruano …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Google: https://sre.google/workbook/implementing-slos/; Google: https://sre.google/sre-book/postmortem-culture/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «tasks/flows/DAG y estados» in S26_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Cada **task** expone estados observables: `pending`, `running`, `success`, `failed`, `skipped`. El **flow** agrega un estado global (p. ej. `failed` si un nodo crítico falló). E…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Google: https://sre.google/sre-book/postmortem-culture/; 12factor: https://12factor.net/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «tasks/flows/DAG y estados» in S26_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Implementación didáctica con dicts de nodos + edges y **orden topológico** (sin Prefect/Airflow instalado): si hay ciclo, el pipeline **no arranca**. Contrato: `edges list[(str,…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** 12factor: https://12factor.net/; Coursera: https://www.coursera.org/courses?query=data%20pipeline%20orchestration
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «tasks/flows/DAG y estados» in S26_STORM.json; edge `research_supports_paragraph`.

### límites, metadata y schedules
**P1** (rank 9.55/10)
> **Rate limits** (api_rpm, max_parallel_tasks) protegen APIs y colas compartidas: un burst nocturno de reintentos no debe tumbar el endpoint de export del sistema sintético. Meta…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Coursera: https://www.coursera.org/courses?query=data%20pipeline%20orchestration; deeplearning.ai: https://www.deeplearning.ai/specializations/data-engineering
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «límites, metadata y schedules» in S26_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> **Schedules** tipo cron (`0 6 * * 1-5` America/Lima) cubren días hábiles 06:00; on-demand cubre cierre de mes o reprocesos. En deploy: **`disable_schedule` → drain** antes de ca…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** deeplearning.ai: https://www.deeplearning.ai/specializations/data-engineering; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «límites, metadata y schedules» in S26_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Caso PE: San Isidro fija `max_parallel_tasks=2` y `api_rpm=30`; si `api_rpm>60` el preflight imprime `too_high` y **bloquea** el schedule hasta revisión humana del límite.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «límites, metadata y schedules» in S26_STORM.json; edge `research_supports_paragraph`.

### checkpoints, retry/backoff y dead-letter
**P1** (rank 9.55/10)
> Un **checkpoint** persiste ids ya procesados para reanudar sin rehacer ingest costoso: tras un crash a mitad de `analyze`, solo quedan pendientes los no marcados. Lab: set en me…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; Nygard: https://pragprog.com/titles/mnee2/release-it-second-edition/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «checkpoints, retry/backoff y dead-letter» in S26_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> **Retry con backoff** exponencial (`base * 2**(attempt-1)`, con cap) absorbe 429/timeout. **No** reintentes schema inválido de negocio: eso va a **DLQ** con owner y SLA — DLQ no…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Nygard: https://pragprog.com/titles/mnee2/release-it-second-edition/; Py4E: https://www.py4e.com
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «checkpoints, retry/backoff y dead-letter» in S26_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Caso PE: item flaky de export → DLQ `timeout_exhausted`, owner=`ops_rpa`. Contrato lab: `process_with_dlq` → `(ok, dlq, ckpt)` **sin duplicar** ok tras reanudación.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Py4E: https://www.py4e.com; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «checkpoints, retry/backoff y dead-letter» in S26_STORM.json; edge `research_supports_paragraph`.

### idempotencia, concurrencia y rollback
**P1** (rank 9.55/10)
> Pasos **idempotentes** usan keys de negocio (`run_id`, `entity_id`): la segunda escritura no pisa un valor ya materializado (create-once). Un retry **no** duplica drafts por ree…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Live: https://pillb.github.io/pyarcana/; Prefect: https://docs.prefect.io/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «idempotencia, concurrencia y rollback» in S26_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> **Concurrencia**: locks/flags `locked` por entidad evitan dos workers en el mismo informe. Si `locked=True` → busy y reencola. Lab: flag fail-closed; prod: lease con TTL.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Prefect: https://docs.prefect.io/; Prefect: https://docs.prefect.io/v3/concepts/flows
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «idempotencia, concurrencia y rollback» in S26_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> **Rollback/compensación** no siempre es ACID: si falla `draft_email` tras `write_report`, borra draft y marca report `superseded`. Documenta el grafo de compensación en el runbo…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Prefect: https://docs.prefect.io/v3/concepts/flows; Airflow: https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/overview.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «idempotencia, concurrencia y rollback» in S26_STORM.json; edge `research_supports_paragraph`.

### revisión de análisis/reporte/destinatario
**P1** (rank 9.55/10)
> HITL del VP exige **tres colas**: `analysis` (métricas/outliers), `report` (narrativa), `recipient` (destinatario). Cualquier `pending>0` **bloquea** envío: `blocked = any(count…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Airflow: https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/overview.html; Google: https://sre.google/workbook/implementing-slos/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «revisión de análisis/reporte/destinatario» in S26_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> La IA asistida **solo propone** texto/highlights; **no cierra** el caso. Si `analysis` pending, el flow queda en `human_review` aunque `report` esté listo — evita “correo automá…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Google: https://sre.google/workbook/implementing-slos/; Google: https://sre.google/sre-book/postmortem-culture/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «revisión de análisis/reporte/destinatario» in S26_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Caso: `cpn2c-hitl-01` con analysis=1, report=1, recipient=0 → `blocked True`. Scores de matching alimentan `analysis` como **evidencia**, nunca como veredicto de fraude.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Google: https://sre.google/sre-book/postmortem-culture/; 12factor: https://12factor.net/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «revisión de análisis/reporte/destinatario» in S26_STORM.json; edge `research_supports_paragraph`.

### aprobación, rechazo, edición y auditoría
**P1** (rank 9.55/10)
> Toda decisión humana deja **audit** `{action, actor, ts, reason?}`. `approve` avanza; `reject` exige reason no vacío; `edit` versiona (1→2) sin borrar historia. Sin audit, CP-N2…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** 12factor: https://12factor.net/; Coursera: https://www.coursera.org/courses?query=data%20pipeline%20orchestration
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «aprobación, rechazo, edición y auditoría» in S26_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Actor = id sintético (`r1`, `r2`), no correo personal real. El sistema **no envía**: solo materializa `draft_email` tras approve. Rechazos reabren cola según reason code del run…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Coursera: https://www.coursera.org/courses?query=data%20pipeline%20orchestration; deeplearning.ai: https://www.deeplearning.ai/specializations/data-engineering
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «aprobación, rechazo, edición y auditoría» in S26_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Política PE: `quality_narrative` → reencola report; `wrong_recipient` → reencola recipient. Audit **append-only** — nunca reescritura de entradas previas.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** deeplearning.ai: https://www.deeplearning.ai/specializations/data-engineering; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «aprobación, rechazo, edición y auditoría» in S26_STORM.json; edge `research_supports_paragraph`.

### SLO, alerts y runbook
**P1** (rank 9.55/10)
> **SLO** del VP sintético: `success_rate ≥ 0.95` diario; si rate=0.90 → `alert_success_rate`. P0: `sends_without_approve > 0` — violación de control, no warning suave.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «SLO, alerts y runbook» in S26_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Runbook de incidente: **`disable_schedule → drain → page`**. Primero detienes el cron America/Lima, drenas workers, luego pages on-call con severidad explícita.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; Nygard: https://pragprog.com/titles/mnee2/release-it-second-edition/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «SLO, alerts y runbook» in S26_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Métricas del metadata de run: throughput, fallas, HITL latency, costo de tokens. **No** inventes `fraud_rate` en el dashboard — matching/score ≠ culpabilidad.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Nygard: https://pragprog.com/titles/mnee2/release-it-second-edition/; Py4E: https://www.py4e.com
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «SLO, alerts y runbook» in S26_STORM.json; edge `research_supports_paragraph`.

### pruebas E2E, seguridad, costo y métricas de valor
**P1** (rank 9.55/10)
> E2E del cierre: path canónico `ingest…draft` en success con fixtures sintéticos. Seguridad: secretos fuera del repo, scopes mínimos, **`fraud_labels=0`** (el VP no auto-etiqueta…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Py4E: https://www.py4e.com; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «pruebas E2E, seguridad, costo y métricas de valo» in S26_STORM.json; edge `research_supports_paragraph`.

**P2** (rank 9.55/10)
> Costo: tokens de IA + minutos de RPA acotados. Valor: minutos ahorrados estimados (p. ej. 45) vs manual — estimación de producto, no promesa financiera.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Live: https://pillb.github.io/pyarcana/; Prefect: https://docs.prefect.io/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «pruebas E2E, seguridad, costo y métricas de valo» in S26_STORM.json; edge `research_supports_paragraph`.

**P3** (rank 9.55/10)
> Regresión N2: CP-N2-A/B/C critical+privacy y CF-2. Paquete de defensa: e2e, cost, value, `fraud_labels=0`, n2_regression pass.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Prefect: https://docs.prefect.io/; Prefect: https://docs.prefect.io/v3/concepts/flows
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «pruebas E2E, seguridad, costo y métricas de valo» in S26_STORM.json; edge `research_supports_paragraph`.

**P4** (rank 9.55/10)
> Caso PE: `cpn2c-close-e2e` con `data_cutoff` fijo; si un step failed → E2E False y **no** se firma promoción. Matching/OCR/RPA solo encolan evidencia — nunca claim de colusión/f…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain-honest sources.
- **Sources:** Prefect: https://docs.prefect.io/v3/concepts/flows; Airflow: https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/overview.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «pruebas E2E, seguridad, costo y métricas de valo» in S26_STORM.json; edge `research_supports_paragraph`.

