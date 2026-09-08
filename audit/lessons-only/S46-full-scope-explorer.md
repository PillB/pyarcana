# 1. Section Identification & Scope

**Section:** S46 — Ingeniería de datos y orquestación de producción  
**Canonical source:** `src/lib/course/sections/s46-gpu-computing.ts`  
**Blob:** `0e7a2010c6c001768f7d3486a090fd1c2a43c994`  
**Stable legacy id:** `gpu-computing` — preserve absent a progress migration.  
**Roadmap:** prerequisite S45; local/cloud; production-grade pipeline increment; S47 closes CP-N4-B.

Continuity gate was executed before auditing new curriculum. S01 is covered by the running lesson JSON; S02–S44 have dedicated JSON; S45 has complete current-conversation granular JSON plus a valid GitHub continuity manifest/meta/wiki. `S46.json` did not exist, so S46 was the mandatory next lesson and is the sole scope of this Explorer run.

The public GitHub Pages card was verified as `Data eng producción` with the current pipeline/backfill/lineage tagline. The web text extractor does not expose deep SPA tabs, therefore deep-render-only claims are not asserted. Canonical source, shared renderer, figure registry, exam route and resource surfaces were audited directly.

# 2. Executive Summary of Quality

**2.5/10 — REPAIR_REQUIRED — release FAIL.**

**35 confirmed findings: P0=1, P1=25, P2=9. 81 learner-facing elements inventoried in the complete JSON artifact.**

S46 has a useful causal premise: facts arrive out of order, event time differs from processing time, late data forces a window-closing policy, and production reruns require checkpoints, lineage and idempotent sinks. The primary failure is that the section then teaches a materially incorrect definition of **allowed lateness**. T1-A treats it as a generic band immediately behind the watermark (`0 < watermark-event_time <= grace`). In event-time window systems such as Flink, the relevant lifecycle is the window: once the watermark passes the window end, late-but-accepted elements may still update retained state until `window_end + allowed_lateness`. The current S46 example has `window_end=120`, `watermark=110`, yet calls event 105 `ALLOWED_LATE` even though the watermark has not closed that window. The same wrong model propagates into the dedicated figure, I Do, We Do, fallback self-check and You Do, so this is classified P0.

The second systemic failure is evidence theater around production state. Exactly-once is illustrated with an in-memory `set`; checkpoint validity becomes `checkpoint == 2` or equality of arbitrary strings; backfill validation accepts impossible intervals; lineage validity is mixed with null-rate quality; and the final project demonstrates second-run idempotence only inside one process. RED tests reproduced watermark regression, retry duplication after restart, invalid backfills passing, valid UUID run IDs rejected, impossible SLI/RTO values passing, and known breaches being masked by missing fields in all eight E3 families.

# 3. Detailed Issue Registry

The canonical detailed registry is `audit/lessons-only/sections/S46.json`; the complete paragraph/exercise-level artifact in the current conversation is `S46.json`, SHA-256 `eeb171f72fe7dcbc7c7672804110487d0870c7455182653fc900c21762aa150b`.

## P0

- **S46-F06 — allowed lateness construct is wrong and propagated.** Replace the generic watermark-minus-event grace band with an explicit event-time window lifecycle (`window_start/window_end`, watermark crossing window end, retained state until window end + allowed lateness). Repair theory, figure, I Do, T1-A E1/E2/E3, self-check and You Do together.

## P1

- **F01:** S45 prerequisite remains REPAIR_REQUIRED with a P0 durability failure; S46 learner release is downstream-blocked.
- **F02:** `estimatedHours: 9` conflicts with roadmap provisional 16–24h without pilot evidence.
- **F05:** `La cuarentena de S45` is a false bridge; current S45 teaches DLQ, and DLQ is analogous to but not identical with a streaming side output.
- **F07:** `max(event_times)-lag` is stateless and can regress from 110 to 90 across successive batches.
- **F08:** exactly-once demo uses a process-local set; after restart `e1` is applied again.
- **F09:** `checkpoint == 2` is a magic-value assertion, not a recoverable checkpoint.
- **F10:** DAG/asset outcome promises typed IO, owners and invalidation, but executable evidence is acyclicity plus `typed_io=True`.
- **F12:** backfill validator accepts empty, inverted, zero-length and negative intervals.
- **F13:** prose promises no collision with a live run; code has no active-run registry/lock/concurrency state.
- **F15:** equality of checkpoint/resume labels does not prove checkpoint existence, ownership or source/sink consistency.
- **F17:** missing-first E3 routing masks independently observable breaches in all eight families.
- **F18:** lineage completeness is conflated with data-quality null-rate threshold.
- **F19:** prose promises code/run/input/output lineage, but code/version/transformation identity is absent.
- **F21:** You Do's first-wins `seen_ids` silently discards conflicting payloads under the same event_id.
- **F23:** SLI/SLO/RTO helpers can PASS ratios outside [0,1] and negative times.
- **F24:** all 24 We Do exercises repeat essentially the same predicate → tri-state → router grammar.
- **F25:** E3 is labeled transfer but preserves case, fields, representation and named control from E1/E2.
- **F26:** multiple solutions print tautological `meets_contract True` markers unrelated to the domain gate.
- **F27:** You Do filters LATE/OUT_OF_WINDOW from `accepted` but creates no required side-output/quarantine artifact.
- **F28:** You Do idempotence/recovery is same-process only; no persistent sink/checkpoint is reopened after failure.
- **F29:** You Do `ops_status` omits RTO and postmortem evidence despite T4-B objectives and prior practice.
- **F30:** independent project ends with print-only evidence and no integrated executable acceptance oracle.
- **F31:** four roadmap-mandated authentic topic evaluations are absent from canonical section surface.
- **F32:** fallback self-check samples only five questions; exam API dynamically uses available concepts instead of enforcing eight expected subtopics. A missing authenticated S46 bank is **not** claimed because it was not proven.
- **F33:** S46 copy speaks of CP-N4-B as if S46 were its closure gate; authoritative roadmap closes CP-N4-B at S47.

## P2

- **F03:** `Nada falló` is too absolute; out-of-order arrival may occur without an application bug but can still violate an operational SLO.
- **F04:** processing-time aggregates are not meaningless; they answer arrival/processing questions rather than event-occurrence questions.
- **F11:** DAG `única regla dura`/`nada arranca nunca` wording is imprecise; cyclic DAG definitions are generally rejected before execution.
- **F14:** no-overlap is a reasonable course concurrency policy, not a universal ban on intentional reprocessing.
- **F16:** exact schema equality is valid only after naming this as a strict no-unversioned-change contract.
- **F20:** `run-` prefix is an arbitrary local convention; OpenLineage run IDs are globally unique and commonly UUIDs. Local dictionaries should not be called facets without distinguishing the external model.
- **F22:** small-file evidence is self-reported counts rather than measured from an output directory/manifest.
- **F34:** SLA/SLI/SLO/RTO/sink/checkpoint/backfill/lineage terminology has uneven first-use explanation.
- **F35:** broad documentation links should be supplemented with precise pages for allowed lateness, fault tolerance, backfill reprocessing and OpenLineage entities/facets.

# 4. Meta-Leak Report

No learner-facing stale GPU meta-leak was proven. The source comment correctly explains that filename/id are historical compatibility artifacts, but shared `SectionView` inspection did not reveal a `gpu-computing` semantic playground mapping. Therefore **renaming the id is explicitly rejected** unless a learner-progress migration is designed.

No missing-figure finding is valid. `S46-event-time` is registered as a bespoke component and `S46-exactly-once` exists in the flow registry. The former is nevertheless pedagogically wrong because it visualizes the same incorrect grace band as T1-A.

# 5. Pedagogical & Redaction Deep Dive

## Narrative flow

Preserve the opening causal spine: delayed arrival → event vs processing time → window closure question → watermark/late policy → DAG/backfill → quality/lineage → incremental/SLO operation. Repair the false S45-quarantine bridge and S46/S47 CP-N4-B closure language without weakening the cross-section progression.

## I Do / We Do / You Do

Raw counts are present: eight I Do demos and 24 We Do exercises. Fidelity is weaker. The repeated dict/predicate/router grammar allows procedural pattern recognition to substitute for domain reasoning. E3 removes hints but usually does not change representation, so it does not satisfy the roadmap's stated transfer requirement.

You Do broadens the surface but drops evidence. A stronger final lab remains local and cheap: persist checkpoint/sink in SQLite/files, kill/reopen, replay; reconcile every input to accepted or side output; record a lineage event with job/code revision; inspect a backfill run table; derive file counts from a partition manifest; assert normal/breach/uncertainty paths.

## Cognitive load

Do not fix S46 by requiring a full Flink/Airflow/OpenLineage stack. Use progressive local fidelity: precise timeline → persisted state → DAG manifest → active-run table → lineage event → partition manifest → kill/replay integrated project. This controls setup cost while preserving the named production semantics.

## Peruvian Spanish / terminology

At first meaningful use expand and explain `SLA`, `SLI`, `SLO`, `RTO`, `sink`, `checkpoint`, `backfill`, `lineage`, `side output`, and `small files`, then keep the standard term. Replace absolutes (`Nada falló`, `cifras que no significan nada`, `única regla dura`) with scoped causal statements.

# 6. Proposed GitHub-style Diffs

Explorer only; these are proposals and were not applied.

```diff
@@ T1-A
-def classify(event_time, window_end, watermark, allowed_lateness):
-    if event_time > window_end: return "OUT_OF_WINDOW"
-    if event_time > watermark: return "ON_TIME"
-    if watermark - event_time <= allowed_lateness: return "ALLOWED_LATE"
-    return "LATE"
+def classify(event_time, window_start, window_end, watermark, allowed_lateness):
+    if not (window_start <= event_time < window_end):
+        return "OUT_OF_WINDOW"
+    if watermark <= window_end:
+        return "ON_TIME"
+    if watermark <= window_end + allowed_lateness:
+        return "ALLOWED_LATE"
+    return "LATE"
```

```diff
@@ watermark
-def advance_watermark(event_times, lag):
-    return max(event_times) - lag
+def advance_watermark(previous_max, new_event_times, lag):
+    max_seen = max(previous_max, *new_event_times)
+    return max_seen, max_seen - lag
```

```diff
@@ exactly-once/checkpoint
-seen = set()
-checkpoint = 2
+state = sqlite3.connect("s46_state.sqlite")
+# Persist source offset + applied key + sink version.
+# Close/reopen state before replay and verify the retry creates no second effect.
```

```diff
@@ backfill
+if not intervals or any(len(i) != 2 or i[0] >= i[1] for i in intervals):
+    return "INVALID_BACKFILL_INTERVAL"
+if overlaps_active_run(intervals, active_runs):
+    return "STOP_CONCURRENT_WRITER"
-checkpoint_ok = checkpoint == resume_from
+checkpoint_ok = checkpoint_record_exists(checkpoint) and resume_matches_state(...)
```

```diff
@@ lineage
-lineage_ok = run_id.startswith("run-") and inputs and outputs and null_rate <= .02 and owner
+lineage_complete = valid_unique_run_id(run_id) and inputs and outputs and job_name and code_revision and owner
+quality_ok = 0 <= null_rate <= MAX_NULL_RATE
```

```diff
@@ E3 fail-closed routing
-if missing:
-    return "REVIEW_*"
-if bad(record):
-    return "BLOCK_*"
+missing = missing_fields(record)
+breaches = observable_breaches(record)
+if breaches:
+    return {"decision":"BLOCK_*", "breaches":breaches, "missing":missing}
+if missing:
+    return {"decision":"REVIEW_*", "missing":missing}
```

```diff
@@ learner-visible solution evidence
-meets_contract = ('1A-0' == '1A-0')
-print('meets_contract', meets_contract)
+assert results == EXPECTED_RESULTS
```

```diff
@@ You Do late reconciliation
-accepted = [event for event, label in ... if label in {"ON_TIME","ALLOWED_LATE"}]
+accepted, side_output = [], []
+for event, label in zip(EVENTS, labels):
+    (accepted if label in {"ON_TIME","ALLOWED_LATE"} else side_output).append(...)
+assert len(EVENTS) == len(accepted) + len(side_output)
```

```diff
@@ duplicate handling
-if event_id in seen_ids:
-    continue
+if event_id in seen_payload_hash:
+    if seen_payload_hash[event_id] != stable_hash(row):
+        raise ConflictingDuplicate(event_id)
+    continue
```

```diff
@@ final project
+assert all_inputs_reconciled()
+assert restart_and_replay_changes() == 0
+assert backfill_plan_is_safe_and_checkpoint_exists()
+assert lineage_complete_and_quality_reported_separately()
+assert measured_rto_and_freshness_slo_gate()
+assert normal_breach_uncertainty_routes()
```

# 7. Recommended Priority Order for fixing

1. F06 P0 everywhere at once.
2. F07–F09/F15/F28 restart/checkpoint semantics.
3. F17 all E3 breach+missing precedence.
4. F27–F30 You Do evidence and integrated verifier.
5. F18–F20 lineage model.
6. F12–F15 backfill/concurrency/state provenance.
7. F10/F21–F23 asset/duplicate/files/numeric contracts.
8. F24–F26 practice diversity and elimination of tautological green markers.
9. F31/F32/F33 roadmap assessment/capstone invariants.
10. P2 precision/terminology/resources and F02 workload metadata.
11. Re-run every stored RED mutation plus kill/reopen/replay regression before release.

# 8. Graph Memory Update notes

Key graph edges: `F06 -> event-time figure -> selfCheck Q4 -> You Do`; `F08 -> F28` volatile state; `F15 -> F28` recovery evidence; `F17 -> F24` state-machine defect inside repeated grammar; `F18 <-> F19` lineage composition; `F33 -> roadmap:S47` capstone closure conflict.

Permanent Fixer invariant: **a late-data or recovery rule may be simplified in implementation, but the relation being taught must remain the same relation used by the named production concept.**

This is the complete Explorer report for Section 46. Ready for the Fixer prompt.
