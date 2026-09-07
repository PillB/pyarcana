# S41 — Full-scope Explorer report

## 1. Section Identification & Scope

- **Section:** S41 — APIs con FastAPI y contratos HTTP
- **Canonical source:** `src/lib/course/sections/s41-llm-finetuning.ts`
- **Source commit:** `535bd4d7b603283af9a39a813a79f05afbc47b48`
- **Canonical blob:** `938b1cb6d4ee1c7066a93b5dd226338c23e47631`
- **Phase:** 3 — Sistemas de Producción Gobernados
- **Capstone relationship:** S41 contributes the HTTP/API increment to **CP-N4-A**; the canonical gate is **S43**.
- **Reviewed:** 33/33 theory/reference paragraphs, 33 theory components, 8/8 I Do demos, 24/24 We Do exercises, 12 You Do surfaces, 8/8 self-check questions and 17/17 resources.
- **Production content modified:** no. Audit only.

The public crawl exposes S41 as **API FastAPI** with the same tagline as `main`. It does not expose a trustworthy fresh hydrated section body, so no render-only defect is invented from crawl omissions.

## 2. Executive Summary of Quality

**Score: 1.1 / 10 — REPAIR_REQUIRED — release recommendation: FAIL.**

The existing theory audit contained **40 material findings**. Full-scope review adds **18 practice/assessment findings**, producing **58 total: P0=2, P1=46, P2=10**.

Two defects are release-blocking.

**P0 #1:** a section explicitly titled FastAPI allows the learner to finish its independent project without importing FastAPI, constructing an app, declaring Pydantic request/response models, using `Depends`, creating a `TestClient`, or inspecting generated OpenAPI. The portfolio note makes a real FastAPI rewrite optional.

**P0 #2:** final readiness can pass with a same-process in-memory idempotency map. T1-B correctly warns that sequential `if key in store` evidence does not prove atomicity under concurrency and does not survive a restart. The project then grades that same insufficient proof as sufficient.

The recurring defect is **evidence substitution**: names, flags, counts and handwritten records stand in for executable guarantees. Missing version metadata becomes `REPLAY_STORED_RESPONSE`; `openapi_matches=True` stands in for OpenAPI; `durable_job=True` stands in for persistence; `resource_closed=True` stands in for cancellation/lifecycle; `seeded_failure_detected=True` stands in for a test; `pii_in_log=False` stands in for telemetry inspection.

## 3. Detailed Issue Registry

### S41-F41 — P0 — You Do can pass without FastAPI

You Do is a “lab stdlib (isomorfo a FastAPI)” and the portfolio note makes FastAPI + TestClient optional. A learner can therefore obtain the success state without performing the framework skill named in the title/outcomes. Official FastAPI testing is fully local, so no infrastructure constraint justifies this omission.

**Repair:** keep pure functions as preparation, then require a real `FastAPI()` app, Pydantic models, `Depends`, `/v1/jobs`, `TestClient` and `app.openapi()`.

### S41-F42 — P0 — Final idempotency gate false-greens an unsafe implementation

The final starter uses global `jobs`/`idempo` structures and readiness tests created→replay→conflict only sequentially in one process. This contradicts the section's own warning that the check-then-set pattern is insufficient under concurrent requests and restart.

**Repair:** local durable store (SQLite is sufficient), scoped key + immutable fingerprint + stored response, transactional uniqueness, concurrent double-submit test and close/reopen/replay test.

### S41-F43 — P1 — Final readiness never assesses POST 201

`create_job` returns a label and dict; no TestClient response ever proves 201 or `Location`. The learner can close S41 without demonstrating the central T1-A contract.

### S41-F44 — P1 — Final validation is only field presence

`validate()` accepts any values if `name` and `priority` keys exist. The final gate tests only missing priority; wrong types/ranges can return 200.

### S41-F45 — P1 — “v1 compatibility” is not executed

Readiness checks GET=200 and presence of `job_id`. No frozen v1 consumer or previous schema/error/pagination contract is run. A breaking candidate can remain READY.

### S41-F46 — P1 — Project context/rubric promise properties readiness ignores

The context names timeout and limit behavior; the rubric scores trace/rollback. Readiness executes neither timeout/cancellation, rate limiting, trace propagation nor rollback.

### S41-F47 — P1 — Required uncertainty path absent

Requirements ask for normal, breach and uncertain paths (`RETRY_OR_ESCALATE` or MISSING), but the starter/readiness has created/replay/conflict/rejected/GET only.

### S41-F48 — P1 — Visible rubric is unearned and blurs CP-N4-A

The rubric allocates points to least privilege, lineage/evidence and trace/rollback although the starter does not operationalize them. The portfolio wording calls this CP-N4-A evidence/gate even though canonical CP-N4-A gates in S43.

### S41-F49 — P1 — Missing version metadata is routed to replay

T1-B E3 returns `REPLAY_STORED_RESPONSE` for missing required fields; the example removes `version`. Missing compatibility metadata should block/inspect the record, not authorize replay. The record does not even model a stored response.

### S41-F50 — P1 — Reference solution says PASS then leaves `meets_contract=False`

After the correct `idem-are-1` asserts, the solution evaluates `idempotent_create(store, "k1", {"x":1}) == "replay"`. `k1` is new, so the same reference function returns `created`. The learner sees a successful reference followed by a false contract indicator.

### S41-F51 — P1 — We Do teaches presence-only schema validation

T2-B E1 validates only that `name` and `priority` exist. E2/E3 receive `openapi_matches` as a boolean. The practical reference therefore does not execute the Pydantic types/ranges/OpenAPI promised in the prose.

### S41-F52 — P1 — Practice re-collapses CPU isolation and durability

T3-A theory correctly distinguishes CPU isolation from durability. E1 then maps both `cpu_heavy` and `durable` to one `background` label and an append to a list; E2/E3 use flags. A list does not survive process restart and BackgroundTasks do not by themselves isolate heavy CPU.

### S41-F53 — P1 — Timeout/cancellation/lifecycle remains simulated

T3-B compares numbers and uses `resource_closed`/`clear()`; it does not produce a real timeout or cancellation. Ordered negative budgets can pass the official decision functions.

### S41-F54 — P1 — Test pyramid is certified through declarations

T4-A E1 uses a bug-name mapping/counts; E2/E3 receive `rule_unit`, `http_contract`, `adapter_integration`, `seeded_failure_detected` booleans. No seed has to be executed. Negative counts can satisfy the reference inequality.

### S41-F55 — P1 — Rate, compatibility and privacy are self-attested

T4-B uses `used > limit` without a time window; exact-key redaction misses PII inside values; E2/E3 receive `old_consumer_passes` and `pii_in_log` as assertions rather than executed evidence.

### S41-F56 — P2 — 24-exercise monoculture weakens transfer

Nearly every subtopic repeats E1 repair predicate / E2 valid-adversarial-missing / E3 continue-breach-review. The fail-closed pattern is useful, but here it displaces actual API activity: endpoint construction, dependency override, HTTP request, OpenAPI inspection, concurrent/restart idempotency and seeded tests.

### S41-F57 — P1 — Self-check merges CPU-bound and durable again

Q7 asks about “un score CPU-bound o un job durable” as one category and rewards a single background/worker answer, undoing T3-A's strongest conceptual distinction.

### S41-F58 — P2 — Self-check presents local `retry_after_s` as retry signal

`retry_after_s` may be a valid custom body field, but the interoperable HTTP mechanism is `Retry-After` when the server can state a retry time. The quiz should distinguish HTTP header from local payload convention.

## 4. Meta-Leak Report

No new learner-facing developer instruction leak was confirmed.

The legacy filename/id `llm-finetuning` is source-only and a stable URL/progress key; renaming it without migration remains a rejected finding.

The confirmed learner-facing **topic leak** remains the Theory playground: the mapping keyed by `llm-finetuning` teaches simulated QLoRA/LoRA/VRAM instead of HTTP/FastAPI. Preserve the stable key and replace the mapped activity.

## 5. Pedagogical & Redaction Deep Dive

### Gradual Release fidelity

I Do mostly predicts outputs from stdlib functions. We Do mostly repairs predicates over synthetic records. You Do still remains a dict/list program. Real FastAPI exists primarily in prose/resources and is optional at the end. The learner is therefore expected to invent the mapping from proxies to `FastAPI`, Pydantic, dependency overrides, TestClient and OpenAPI independently.

### Comprehension / widow terms

The existing paragraph audit already records dense English/API terminology (`path operation`, `body`, `keyset`, `boundary`, `background`, `shape`, `allow-list`, `trace`, `lifecycle`, `replay`, `handler`). These terms are legitimate, but should be introduced Spanish-first with causal meaning before repeated use.

### External benchmark

FastAPI's official testing guide shows that a local application can be passed directly to `TestClient` and tested with normal pytest assertions. Response models validate returned data, add schema to OpenAPI and filter output. Therefore making those mechanisms optional is not necessary progressive disclosure.

RFC 9110 distinguishes an unknown resource from 405 Method Not Allowed and requires an `Allow` header for 405. For 201, a supplied `Location` refers to the primary resource created.

The latest IETF `Idempotency-Key` document is revision -07 from October 2025 and expired April 18, 2026; it remains an archived Internet-Draft, not a finalized RFC. It explicitly prohibits reusing a key with a different request payload.

FastAPI's BackgroundTasks documentation also distinguishes small same-process tasks from heavy computation that may need separate multi-process/worker tooling. Durability remains a separate guarantee.

## 6. Proposed GitHub-style Diffs

### A. Require actual FastAPI in You Do

```diff
@@ youDo objectives / requirements
- Implementar ... en un lab stdlib (isomorfo a FastAPI).
- Documenta el mapeo mental a FastAPI (`@app.post`, `Depends`, OpenAPI)
+ Modela primero la semántica con funciones puras.
+ Luego implementa obligatoriamente una app `FastAPI()` local con:
+ - modelos Pydantic de request/response;
+ - `POST /v1/jobs` y `GET /v1/jobs/{id}`;
+ - `Depends` para el store;
+ - `TestClient` para acceptance tests;
+ - `app.openapi()` como evidencia del contrato.
@@ portfolioNote
- Enlace opcional: reescribe el lab con FastAPI + TestClient
+ El lab stdlib es preparación; el cierre de S41 requiere FastAPI + TestClient.
```

### B. Replace sequential idempotency gate

```diff
-jobs = []
-idempo = {}
+store = SqliteJobStore(...)
+# UNIQUE(tenant_id, operation, idempotency_key)
+# record: fingerprint + response status/body + job_id
@@ readiness
-# created -> replay -> conflict in one process
+# two simultaneous identical requests -> one job
+# changed fingerprint under same scope/key -> conflict, no new job
+# close/reopen store -> retry original -> same stored response/job_id
```

### C. Restore HTTP create semantics

```diff
+response = client.post("/v1/jobs", json=valid, headers={"Idempotency-Key": key})
+assert response.status_code == 201
+assert response.headers["Location"] == f"/v1/jobs/{response.json()['job_id']}"
+assert client.get("/v1/nope").status_code == 404
+r = client.put("/v1/jobs")
+assert r.status_code == 405
+assert "POST" in r.headers["Allow"]
```

### D. Replace key presence with Pydantic/OpenAPI evidence

```diff
-required = {"name", "priority"}
+class JobCreate(BaseModel):
+    name: str = Field(min_length=1)
+    priority: Literal["low", "normal", "high"]
+
+class JobPublic(BaseModel):
+    job_id: str
+    status: Literal["queued", "done"]
+    name: str
+    priority: Literal["low", "normal", "high"]
+
+assert client.post(...wrong_type...).status_code == 422
+assert fake_domain.calls == 0
+assert generated_openapi_matches_expected(app.openapi())
```

### E. Do not replay on missing version

```diff
-if missing:
-    return "REPLAY_STORED_RESPONSE"
+if missing:
+    return "INSPECT_IDEMPOTENCY_RECORD"
```

### F. Preserve CPU vs durability distinction

```diff
-def choose_boundary(kind): ... "background"
+def classify_work(kind):
+    return {"execution_boundary": ..., "requires_durable_enqueue": ...}
+# CPU: prove work outside event loop/process.
+# Durable: persist before `queued` and reopen store in test.
```

### G. Replace boolean test evidence

```diff
-{"http_contract": True, "seeded_failure_detected": True}
+results = run_seeded_pytest_suite(...)
+assert results["domain_seed"].failed_test == "test_domain_rule"
+assert results["http_seed"].failed_test == "test_post_returns_201"
+assert results["adapter_seed"].failed_test == "test_store_contract"
```

### H. Correct capstone wording

```diff
- Gate CP-N4-A
- Evidencia de CP-N4-A · API HTTP gobernada
+ Gate local de S41: incremento HTTP que contribuye a CP-N4-A
+ CP-N4-A se promociona en S43 con evidencia integrada de S40–S43.
```

## 7. Recommended Priority Order for fixing

1. **P0:** F41 — make FastAPI/Pydantic/TestClient/OpenAPI mandatory.
2. **P0:** F42 — durable/atomic/concurrent/restart idempotency.
3. **P1:** F43–F45 — real HTTP create, schema validation and old-consumer compatibility.
4. **P1:** F49–F50 — fix dangerous/contradictory idempotency reference solutions.
5. **P1:** F52–F55 — rebuild T3/T4 around executed evidence rather than flags.
6. **P1:** F46–F48 — align project scope, uncertainty and rubric with what is actually assessed and with S43 capstone ownership.
7. **P1/P2:** F51, F56–F58 — repair validation practice, diversify the exercise grammar and correct retrieval assessment.
8. Then repair inherited F01–F40 without weakening the technically accurate T3-A explanation.

## 8. Graph Memory Update Notes

Add these edges:

- `S41 title/outcomes -> YouDo FastAPI implementation = MISSING_MANDATORY_TRANSFER`
- `T1-B theory warning -> YouDo idempotency gate = CONTRADICTION`
- `missing version -> REPLAY_STORED_RESPONSE = UNSAFE_UNCERTAINTY_ACTION`
- `T2-B Pydantic promise -> WeDo/YouDo key presence = FALSE_GREEN`
- `T3-A CPU != durability -> WeDo/SelfCheck = COLLAPSED_DISTINCTION`
- `T4-A outcome -> seeded_failure_detected boolean = SELF_ATTESTED_EVIDENCE`
- `T4-B compatibility/privacy -> booleans = SELF_ATTESTED_EVIDENCE`
- `S41 -> CP-N4-A = CONTRIBUTES_TO`
- `CP-N4-A -> S43 = GATE_SECTION`
- `legacy id llm-finetuning -> QLoRA playground = TOPIC_LEAK`
- `legacy id llm-finetuning -> rename = REJECTED_WITHOUT_PROGRESS_MIGRATION`

The original 33/33 paragraph shards remain authoritative for paragraph-level current text, attack/defense, improved paragraph and justification. The new shards extend practical surfaces without overwriting them.

**This is the complete Explorer report for Section 41. Ready for the Fixer prompt.**