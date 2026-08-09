# Pre-Round Research — attempt_004

**Agent:** FIXER (isolated from newbies)  
**Date:** 2026-07-21  
**Scope:** Pre-round research only — readiness for **full live dual-newbie walk S01–S52**.  
**Section content edits:** **none** (no definite source-level `EXAM_INVALID`: empty options / `correctIndex` OOR).  
**No `FIX_001.md` this pass.**

---

## 1. attempt_004 dual_sim: `all_sufficiency_ok` and heuristic gaps 0

### Gate snapshot

| Report | Path | Result |
|--------|------|--------|
| Dual-sim | `attempt_004/dual_sim_report.json` | **`all_sufficiency_ok: true`**, `sections_run: 52`, `first_sufficiency_fail: null` |
| Dual-sim gaps | every `results[].n_gaps` | **0** (no selfcheck sufficiency fails; no skeptic exercise `UNTAUGHT_API` / `STARTER_BROKEN` gaps recorded) |
| Heuristic packet scan | `attempt_004/scan_report.json` | **52/52 `status: ok`**, **`total_heuristic_gaps: 0`**, `p0_gaps: 0`, `p1_gaps: 0`, `max_section_clean: 52`, `gaps_sample: []` |
| Selfcheck integrity | `attempt_004/selfcheck_integrity.json` | **`ok_sections: 52`**, `issue_count: 0`, **`p0: 0`**, **`p1: 0`**, `issues: []` |
| Issues log | `attempt_004/issues.jsonl` | **empty** |
| Meta | `attempt_004/meta.json` | reason: *full live dual-newbie S01-S52 clean walk (attempt_003 only had live S01)*; git_sha `0b2156f` |
| Runtime audit (course) | `course-state/python_runtime_audit_report.json` | **ok=true**, pass=2383, fail=0, skip=284, **p0=0 p1=0** |
| Exam/selfcheck pedagogy | `course-state/exam_selfcheck_pedagogy_report.json` | **ok=true**, selfcheck_issues=0, **p0=0 p1=0** |
| Issue registry | `course-state/python_content_issue_registry.json` | p0=[], p1=[] |

### What “sufficiency” means here

- **Sufficiency** (`sufficiency.json` / `sufficiency_ok`): correct self-check option text is **supportable from cumulative learner packet** (landing + S01..SN theory/iDo/exercises text). This is the dual-sim **knowledge gate**.
- **Heuristic gaps** (`gaps_heuristic.json` / `scan_report`): packet-builder `gap_scan` for instruction constructs, untaught imports, missing starters, broken selfcheck option counts.
- **Dual-sim `n_gaps`**: union of sufficiency fails + skeptic **exercise** blocks (`UNTAUGHT_API:*`, `STARTER_BROKEN`). Self-check skeptic blocks (`UNTAUGHT_CONCEPT` on MCQ) are **not** counted in `n_gaps` and do **not** fail `all_sufficiency_ok`.

### Dual-sim scores (context only — not the primary gate)

| Metric | Value |
|--------|-------|
| Newbie A selfcheck pass sections (≥70%) | **18** / 52 |
| Newbie B selfcheck pass sections | **12** / 52 |
| Hard lexical sections (examples) | S10 both **16.7%**; S32 A **25%** B **0%**; S36 A **25%** B **0%** |
| Easy / spoiler-ish (examples) | S16, S18, S22, S23, S31 both **100%** |

Lexical bag-of-words agents routinely miss conceptually fair MCQs (near-tied option scores → B blocks with `UNTAUGHT_CONCEPT` on selfcheck). That is **expected** and already documented from attempt_002/003: **sufficiency + live agents** are the gates that matter for pedagogy.

### Packet quality vs attempt_002

Sample `packets/section_01.json` selfCheck options are **clean** (4 proper strings each; no separator junk). Prior attempt_002 dirty-option risk is **not** reproduced on attempt_004 scan artifacts.

---

## 2. Readiness for live dual-newbie full walk S01–S52

### Ready (green for start)

1. **Knowledge gate:** dual-sim 52/52 sufficiency OK; zero dual-sim exercise gaps in report.
2. **Structural gate:** heuristic gaps 0; selfcheck integrity P0/P1 0; pedagogy audit clean; runtime p0/p1 0.
3. **Learner packets:** 52 packets under `attempt_004/packets/` + per-section `packet.json`; solutions/`correctIndex` stripped in learner view; server-side keys only for grading.
4. **Prior proof:** attempt_003 live A/B cleared **S01** after theory expansion (`FIX_002`); dual-sim stayed clean post-restart.
5. **Policy:** meta preamble — *packet-only; restart after any content fix*.

### Not yet proven on attempt_004

- **No live artifacts** under attempt_004 (`newbie_*_live.json` absent). Automated dual-sim is complete; **LLM dual-newbie full walk has not started**.
- attempt_003 SUMMARY residual still holds: full live dual-LLM on every exercise of **S02–S52** was never the closed gate — only dual_sim + S01 live + restart policy.

### Verdict

**GO for live dual-newbie S01→S52** under isolation rules. Do **not** pre-edit section TS for low dual-sim MCQ scores. Only act on definite `EXAM_INVALID` or live `UNTAUGHT_*` with theory/iDo expansion (see §4).

---

## 3. Common untaught risks in later phases (async, FastAPI, starter-only symbols)

### 3.1 Section **id ≠ V3 title** (agent confusion, not always student-facing)

Many filenames/ids keep legacy names while **titles** retarget:

| Index | id (platform) | V3 student title (approx.) | Not the main path |
|------:|---------------|----------------------------|-------------------|
| 21 | `fastapi` | Documentos, plantillas y reportes trazables (Jinja, provenance) | FastAPI/OpenAPI |
| 27 | `async-concurrency` | Estrategia de pruebas con pytest | asyncio/TaskGroup |
| 32 | `microservices` | Feature engineering y pipelines sin leakage | Docker/K8s microservices |
| 38 | `performance-extreme` | Concurrencia, observabilidad y workflows resilientes | Numba/Cython “extreme” |

Live newbies that key off **ids** or external “S21 = FastAPI” mental models may invent APIs never taught. Packet **titles + theory maps** are authoritative.

### 3.2 “Async / FastAPI” content reality (source grep)

- Course sections under `src/lib/course/sections/`: essentially **no** `async def` / `await` / `FastAPI(` bodies. S38 links asyncio / concurrent.futures as **resources** and teaches concurrency at **policy/dict/demo** level (`pick(bound)`, `fetch_with_timeout` returning a policy dict — not real asyncio).
- S21 demos: Jinja/reporting, not ASGI routers.
- S27 demos: pytest contracts, fixtures, AAA — not event loops.

**Risk for live walk:** if an instruction/hint still says “use FastAPI Depends / asyncio.gather” while demos only show dicts, skeptic correctly emits `UNTAUGHT_API`. Current dual-sim did **not** record such exercise blocks (`n_gaps=0`), so instruction dotted-API scan is clean at bag-of-words level; **LLM newbies** still may demand real framework APIs from outcomes/resources links.

### 3.3 Starter-only symbols (heuristic blind spot)

`gap_scan` (`scripts/newbie_packet_builder.py`):

- Imports **in starter** are treated as **given** (not untaught).
- Flags imports mentioned in **instruction** but missing from cumulative theory/iDo and starter.
- Construct patterns only if named in instruction and absent from taught text.

**Implication:** exercises that ship `import X` / advanced calls only inside `starterCode` with a `# TODO` body are **heuristic-green** even if theory never defines the API. That is intentional for fill-in pedagogy **if** theory/iDo already showed the same API; it is a **false green** if the starter is the sole teacher.

Later-phase pattern (e.g. S32/S36/S38): many weDo items are minimal:

- `instruction`: short phrases (“Media de [1,2].”, “json size.”, “GIL note.”)
- `starterCode`: bare `# TODO`
- `hints`: “Revisa la demo.”

Dual-sim treats incomplete starters as **attemptable** (no block). Live skeptics may:

1. Pass by copying demos (good), or  
2. Report **untaught** if demos are too abstract relative to solution shape, or  
3. Over-reach into external knowledge (forbidden — must report `UNTAUGHT_*` instead).

### 3.4 Other later-phase residual surfaces

- **Type annotations / slicing / CLI primitives:** attempt_003 residual — lightly taught early; starters may carry `-> None` etc. Non-blocking if S01 expansion remains in packet.
- **Thin selfcheck banks (4 Qs)** + jargon verbatim in theory → lexical agents score 100% (S16/S18/S22…) while humans may still need reasoning; inverse: abstract options → low scores despite sufficiency OK.
- **Runtime skips (284):** concentrated early/setup and some mid-course optional stacks — not p0/p1, but in-browser student runtime may differ from host audit.
- **Section catalog drift** (file id `s06-numpy` vs collections content, etc.): confusing for agents using ids.

---

## 4. Recommended response if newbies report `UNTAUGHT_*`

**Policy (mandatory):**

1. **Treat as a content gap, not a student failure.** Tags: `UNTAUGHT_CONCEPT`, `UNTAUGHT_API:<name>`, occasionally `STARTER_BROKEN`.
2. **Expand theory and/or iDo demos in the current section and/or the earliest prior section** that should have introduced the symbol — dictionary-style definition + minimal runnable demo + when-to-use note (mirror `FIX_002` S01 pattern: `print` / `def` / f-string / `sys.argv` / `len` taught **before** exercises require them).
3. **Never put the solution or “the answer” into the exercise** (instruction, hints, or starter beyond intentional blanks/`TODO`/`____`). Starters may scaffold structure; they must not complete the learning objective.
4. **Do not** patch by leaking `correctIndex`, solutionCode, or full solution text into learner packets.
5. **After any section TS change:** restart attempt / rebuild packets / re-run integrity + dual-sim from affected section (meta preamble). Document in `FIX_00N.md` with root cause, files touched, verification commands, and whether live gaps resolved.
6. **Do not** expand content solely to raise dual-sim **lexical** selfcheck % when sufficiency is already OK and a human could answer from packet.
7. If report is **false positive** (concept taught under synonym / Spanish prose / prior section): document in research; optionally improve wording cross-links — still no exercise spoilers.

**Triage order when live blocks:**

| Signal | Action |
|--------|--------|
| Symbol required by instruction, absent from prior+active theory/iDo | Expand theory/iDo; re-demo |
| Symbol only in starter, never explained | Either teach in theory **or** reduce starter to blanks after a demo that introduces it |
| Resource link (asyncio docs) vs no taught surface | Teach conceptual policy in-section **or** drop exercise dependency on real API |
| Empty options / `correctIndex` OOR | **P0 `EXAM_INVALID`** — fix source immediately + `FIX_00N.md` |
| Skeptic MCQ `UNTAUGHT_CONCEPT` only, sufficiency OK | No fix unless live human also cannot justify correct option from packet |

---

## 5. EXAM_INVALID scan (this pass)

| Check | Result |
|-------|--------|
| `offline_selfcheck_integrity` attempt_004 | 52/52, issues=[] |
| Pedagogy audit | p0=p1=0 |
| Spot-check S01 packet options | 4 non-empty options per Q |
| Sample source selfCheck (S21/S32/S36/S38) | `correctIndex: 1` with 4-option arrays — in range |

**No definite empty-options or correctIndex-OOR in source.** No section content edit. **No `FIX_001.md`.**

---

## 6. Residual risks list (return to orchestrator)

1. **Live walk not started** — attempt_004 is dual-sim/packet-clean; LLM A/B S01–S52 evidence still TBD.
2. **Id vs V3 title drift** (fastapi/async/microservices/…) — agents may expect frameworks never taught; stick to packet titles.
3. **Starter-as-sole-teacher** — heuristic allows imports only in starters; live may still flag if theory skipped the API.
4. **Thin late-phase exercises** (TODO + “Revisa la demo”) — higher variance for human-style LLM newbies; risk of over-using external knowledge vs reporting `UNTAUGHT_*`.
5. **Conceptual async/concurrency (S38) without real asyncio surface** — resource links exist; real `await`/`TaskGroup` not taught; fine if exercises stay policy/print-level.
6. **Lexical dual-sim MCQ ≠ mastery** — many sections fail 70% pass bar for A/B while sufficiency holds; do not thrash content for bag-of-words scores.
7. **Selfcheck too easy / option leak** on short jargon-heavy banks (100% both agents) — grades look strong without deep understanding.
8. **Runtime skips (284)** — env/optional stacks; separate from p0/p1; student runtime may still surprise mid-course.
9. **Type hints / light early primitives** — residual from attempt_003; watch S02+ if live re-blocks on annotations or builtins.
10. **Integrity under-powered for non-empty-but-garbage options** — fixed in practice on attempt_004 packets; still no hard assert `len(options)==4` / no separator-only tokens in integrity (hardening residual, not current P0).
11. **No live exercise execution grading** — dual-sim “answers” incomplete starters; does not prove runnable student solutions.
12. **Restart cost** — any theory fix mid-walk invalidates subsequent cumulative packets; plan fix windows carefully.

---

## 7. Recommended verification during live walk

```bash
# Integrity + scan (should stay 0/0)
python3 scripts/newbie_walkthrough_runner.py --scan-all --attempt attempt_004
python3 scripts/newbie_walkthrough_runner.py --selfcheck-integrity --attempt attempt_004

# Dual-sim refresh after any content fix
python3 scripts/newbie_dual_sim.py --attempt attempt_004 --from-section 1 --to-section 52

# Runtime / pedagogy gates (course-wide)
python3 scripts/python_content_runtime_audit.py
python3 scripts/exam_selfcheck_pedagogy_audit.py
```

---

## 8. Summary judgment

| Area | Status |
|------|--------|
| `all_sufficiency_ok` | **True (52/52)** |
| Heuristic gaps | **0** |
| Selfcheck integrity P0/P1 | **0** |
| Runtime / exam pedagogy | **Green** |
| EXAM_INVALID in source | **None found** |
| Live dual-newbie S01–S52 | **Ready to start; not yet run on attempt_004** |
| Content edits this pass | **None** |

**Bottom line:** attempt_004 automated gates are clean enough for the full live dual-newbie walk. FIXER stays on standby: on live `UNTAUGHT_*`, expand **theory/iDo** in current/prior section, never spoil exercises; on true `EXAM_INVALID`, fix source + document `FIX_00N.md` and restart.
