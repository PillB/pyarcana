# YOUDO — CP-N4-C (Independent practice)

The learner extends the harness (esto es, un arnés: la estructura que orquesta, limita y observa a los agentes mientras trabajan) on their own. Each task has a concrete
acceptance test the learner must make pass.

## Task A — Add a `summarize` RAG (esto es, Generación Aumentada por Recuperación: antes de responder, el sistema busca documentos y cita de dónde sacó cada afirmación) path
**Acceptance:** `copilot.run(Task(query="summarize the rollback procedure",
mode="LOCAL"))` produces a `final_answer` whose text begins with the
rollback snippet and ends with `[doc_id=rollback]`.

## Task B — Add an ACL (esto es, Lista de Control de Acceso: reglas que dicen qué documentos puede ver cada rol)-protected retrieval test
**Acceptance:** with `principal="anon"`, the `internal-er` document is
**not** present in `state.citations`. With `principal="analyst"` it is.

## Task C — Add a SERP (esto es, Search Engine Results Page: los resultados que devuelve un buscador; aquí se usan como datos con fuente, no como instrucciones)-outage (esto es, una caída del servicio: el proveedor deja de responder) test
**Acceptance:** with `WebAdapter(available=False)`, the run still completes
(`status="COMPLETE"`) using only the RAG path; the trace contains no
`web.search` span (esto es, un segmento de una traza: cuánto duró y qué hizo un solo paso).

## Task D — Add a commercial-outage test
**Acceptance:** construct a `CommercialModelAdapter(simulate_outage=True)`,
wrap it in a `Provider(ProviderConfig(mode="COMMERCIAL"))`, run a task, and
assert `record.fell_back_to_local is True` and that an incidente (esto es, un evento donde el sistema se comportó mal o se cayó, que se debe registrar y analizar) with
`kind="provider_fallback"` exists.

## Task E — Add a loop-detection test
**Acceptance:** force the local adapter (esto es, un adaptador: un pedazo de código que traduce entre nuestro formato y el de un proveedor de modelos) to always propose the same plan
(monkey-patch `LocalModelAdapter._plan` to return a constant), run a task,
and assert `record.stop_reason == "loop_detected"` and
`len(record.steps) <= 8`.

## Task F — Add a redaction test
**Acceptance:** put the literal `a@example.test` and `api_key=sk-abc123`
in a task `extra` field; run; assert that `str(record.trace)` contains
neither literal.

## Task G — Add an incident audit
**Acceptance:** after a run that exercises HITL (esto es, Human-In-The-Loop: un humano aprueba antes de que se ejecute una acción sensible), budget abort and a denied
tool, write a helper `summarise_incidents(record)` returning
`{kind: count}` and assert the keys include `hitl_required`,
`budget_exceeded`, and `tool_denied` as appropriate.

## Definition of done
- All seven acceptance tests pass.
- `python3 course-state/capstones/CP-N4-C/demo.py` exits 0.
- `python3 tests/adversarial/test_n4c_harness.py` passes 10/10.
- No real PII, no real API key, no network call, no inflated workplace
  titles in any new copy.
