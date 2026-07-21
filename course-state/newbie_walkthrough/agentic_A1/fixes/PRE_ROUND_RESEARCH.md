# Pre-Round Research — agentic_A1 (FIXER)

**Agent:** FIXER (isolated from newbies)  
**Attempt:** `agentic_A1`  
**Started:** 2026-07-21T21:57:24Z · git_sha `0830039` · brand **PyArcana**  
**Scope:** Pre-round research only. **No section content edits** this pass.  
**Authoritative sources:** `meta.json`, `agentic/GRAPH_MEMORY.json`, `scripts/newbie_agentic_validator.py`, attempt trail `ATTEMPT_LOG.md` / `SUMMARY.md` (attempt_007b CLEAN_52 under code-exec), prior FIX notes (`FIX_001`, `FIX_002` phase3 + S01), `exam_selfcheck_pedagogy_report.json`, learning roadmap / course pedagogy.

---

## 1. Primary pass bar — pure agentic justification (not code-exec)

### Gate definition

| Layer | Role for agentic_A1 |
|-------|---------------------|
| **Primary pass bar** | Dual-newbie **LLM packet-only** walk + **Validator justification gate** |
| **Not the pass bar** | Programmatic `code_exec` output matching, dual-sim bag-of-words alone, generator scripts |
| **Platform QA only** | Runtime audit, code-exec grader (`newbie_live_phase_runner`), lexical dual-sim sufficiency |

Evidence of intent:

- `agentic_A1/meta.json`: *“Phase2 pure agentic dual-newbie from landing; Validator justification gate (not code-exec)”*
- `agentic/GRAPH_MEMORY.json`: rule `agentic_justification_primary`; forbidden for pass bar: `code_exec_only`, `dual_sim_lexical_only`, `generator_scripts`
- `AGENTIC_ATTEMPT_LOG.md`: *“Programmatic code-exec is platform QA only, not the pass bar for this gate.”*
- `scripts/newbie_agentic_validator.py` success criteria (summary):
  - Live artifacts for both agents with correct `attempt_id` and **no** generator fingerprints
  - Selfcheck: chosen answers + **`justification_from_packet`** with lexical support from packet corpus
  - Exercises: either honest **`UNTAUGHT_*` / `STARTER_BROKEN`** blocks **or** answer/code + packet-grounded justification
  - Offline keys used only for fairness (`chosen_index` score) — **keys never shown to newbies**
  - Code execution is optional diagnostics and **does not decide pass**

### Practical thresholds (validator)

Agent section pass (both A and B) requires approximately:

- All selfcheck items answered, **no** selfcheck `blocked_on`
- Selfcheck score ≥ **70%** vs offline keys
- Justification support ratio ≥ **0.5** on answered selfcheck
- **Zero** hard exercise blocks (`UNTAUGHT*` / `STARTER_BROKEN`)
- Exercise coverage: missing ≤ ~10% of expected weDo IDs; justified/attempted exercise ratio ≥ **0.7**

### Isolation rules (do not break)

- Newbies see **landing + S01..SN** packets only; solutions / `correctIndex` stripped from learner packets.
- After any content fix: **restart** attempt / rebuild packets / re-run agentic validation from affected section.
- Do **not** thrash content solely for low dual-sim MCQ lexical scores when packet sufficiency and human-style justification remain fair.

### Relationship to attempt_007b

attempt_007b proved **CLEAN_52 live dual-LLM** under **code_exec grading** after FIX_002 demo scaffolds. That is **necessary platform confidence**, not the agentic gate. agentic_A1 re-proves teachability via **justified packet reasoning**. Shallow but teachable phase-3 scaffolds may still pass code-exec while failing agentic bar if newbies invent outside packet or cannot justify from theory/iDo.

---

## 2. Known residual risks (prior attempts)

### R1 — Phase 3 demo-scaffold depth (S40–S52 / Master)

**History**

| Attempt | What happened |
|---------|----------------|
| 004–006 | Live Skeptic blocked phase-3 weDo: instruction-only “print this target” + empty `# TODO` starters; no taught construction path |
| FIX_002 | Rebuild each S40–S52 weDo starter from matching **iDo demo** (same `subtopicId`): all demo lines present, **one** print line → `# TODO`; instructions/hints point at that demo only |
| FIX_002b | Solutions = iDo demos for honest code grading |
| **007b** | Full real dual-LLM + code_exec **CLEAN_52** |

**Residual (still open pedagogy debt)**

- `SUMMARY.md`: *“Phase 3 pedagogy still shallow (demo-scaffold exercises) but teachable for packet-only newbies; deeper Master tasks remain curriculum work.”*
- Risk under **agentic** bar: newbies may complete “fill one print” by pattern-copy without concept justifications, **or** refuse with `UNTAUGHT_TASK` / `UNTAUGHT_MAPPING` if demo↔exercise alignment is weak in a section.
- Do **not** expand phase-3 into full Master redesign mid-gate unless live agents hard-block with honest `UNTAUGHT_*`. Prefer theory/iDo depth in the **same subtopic** over spoiling transfer exercises.
- Generator taint (attempt_005 phase3) is forbidden forever: authenticity checks reject `correct_preview` / `_gen_` fingerprints.

### R2 — S01 shell protocols (non-Python / multi-shell surface)

S01 is the densest **shell + OS protocol** section in the course (venv activation, PATH vs cwd, exit codes, PowerShell vs bash/zsh, git, markdown transfer exercises). Residuals:

| Surface | Residual / watch |
|---------|------------------|
| **Shell dialects** | Same skill taught as bash/zsh (`$?`, `source .venv/bin/activate`) **and** PowerShell (`$LASTEXITCODE`, `.venv\Scripts\Activate.ps1`). Packet must keep both paths explicit; newbies blocking on “wrong shell” is a content gap if only one dialect is in theory/iDo for that exercise. |
| **PATH ≠ cwd** | Core S01 teaching; confusions still common. Live blocks that invent “PATH is the project folder” indicate distractors OK; blocks that cannot find *any* taught protocol → expand theory callouts, not exercise answers. |
| **Markdown / transcript weDo** | Transfer exercises with `language: 'markdown'` (e.g. install/PATH checklists, terminal transcripts). Runtime audit **skips** many S01 shell artifacts (historical ~59 skips). Dual-sim once false-positive `STARTER_BROKEN` when starter extraction was empty — packet builder must still flatten nested `starterCode`. Under agentic gate, empty starter in packet ⇒ honest `STARTER_BROKEN`, not invent. |
| **Remote GitHub auth** | Skeptical review `S01-SK-001` (accepted P2): push/PR needs remote auth; demos document UI/`gh` path; sandbox UNVERIFIED. Not a P0 for agentic if packet teaches local git + PR *concept*. |
| **Host Python version** | `S01-SK-002` (P3): host may be 3.9; course targets 3.12+. Content teaches verification; agents must not invent version workarounds outside packet. |
| **Script primitives (mitigated)** | attempt_003 FIX_002 (S01 theory): `print` / `def main` / `if __name__` / f-string / `sys.argv` / `len` / `sys.executable` taught before exercises. Residual from live B notes: type hints (`-> None`) lightly explained; slicing `sys.argv[1:]` starter-provided; `datetime` methods thin. Watch for new `UNTAUGHT_API` if starters pull more stdlib than theory. |

**Implication for fixer:** S01 failures that are **protocol/OS** should be fixed by expanding **theory + iDo shell demos** (both Windows and Unix lines), never by pasting full terminal transcripts into weDo solutions visible to newbies.

### R3 — Other carry-forward risks

1. **Lexical dual-sim ≠ mastery** — bag-of-words MCQ scores can be low while packet is fair; do not thrash options for sim scores alone under agentic gate.
2. **Spoiler-easy MCQs** — historical S16/S18 100% lexical; monitor if agentic justifications are hollow restatements of unique theory phrases (validator hits, but pedagogy thin).
3. **Late-phase thin theory / blueprint placeholders** — older live notes; FIX_001 expanded S40–S52 stubs once; re-check if newbies still hit generic “Completa el ejercicio” without demo mapping.
4. **Integrity under-powered for garbage-but-non-empty options** — fixed in practice (packets now 4 clean options on S01 sample); hardening `len(options)==4` still residual QA, not current P0.
5. **Prior-section cumulative packet** — agentic corpus = landing + prior sections + active. Fix expansions must land in **current or earliest prior** section so cumulative packets teach the symbol before later use.

---

## 3. How to expand lessons when newbies report `UNTAUGHT_*`

### Treat as content gap, not student failure

| Tag | Meaning | Fixer response |
|-----|---------|----------------|
| `UNTAUGHT_CONCEPT` | MCQ / idea not supportable from packet | Expand **theory** (definition + when-to-use + contrast) in current or prior section |
| `UNTAUGHT_API:<name>` | Symbol/API required but never taught | Add **theory prose + minimal iDo demo** that *names and runs* the API **before** the exercise that needs it |
| `UNTAUGHT_TASK` / `UNTAUGHT_MAPPING` | Task or demo→exercise mapping missing | Align **instruction/hints to taught demo lines**; deepen starter scaffold from iDo (FIX_002 pattern), not free-form solution dumps |
| `STARTER_BROKEN` | Empty/unusable starter in packet | Fix source `starterCode` extraction / non-empty markdown or python template |
| `EXAM_INVALID` | Empty options / `correctIndex` OOR | **P0** fix source immediately + `FIX_00N.md` + restart |

### Expansion rules (non-negotiable)

1. **Expand theory and/or iDo only** in the **current section** and/or the **earliest prior section** that should have introduced the idea.
2. **Never spoiler the exercise** — do not paste the final answer, full solution body, or `correctIndex` into weDo instructions, hints, or starters beyond the intentional single-blank scaffold.
3. **Mirror successful patterns:**
   - S01 script primitives FIX (attempt_003): dictionary definition + runnable demo block + exercises that only fill taught blanks.
   - Phase-3 FIX_002: starter = demo with **one** learner TODO; instructions point at that demo.
4. **Both shell dialects** when the skill is OS protocol (S01): show bash/zsh **and** PowerShell in theory/iDo if exercises accept either.
5. **After any TS change:** restart attempt policy — rebuild packets, re-run integrity + agentic validation; document root cause, files, verification in `FIX_00N.md`.
6. **Do not invent outside curriculum roadmap** — expansion stays within section scope (setup before basics, etc.); no forward-spoiling later Master APIs into early sections.

### When **not** to edit

- Skeptic MCQ `UNTAUGHT_CONCEPT` only, while offline sufficiency / human can justify correct option from packet → **no fix** (agent noise).
- Low dual-sim % with green sufficiency → **no fix**.
- Branding / visual redesign requests → **out of scope** (see §4).
- “Make phase-3 Master-depth” without live hard blocks → **curriculum backlog**, not mid-round P0.

---

## 4. Branding — already PyArcana + Art Nouveau (no redesign)

| Fact | Evidence |
|------|----------|
| Product brand | **PyArcana** (`meta.json` `brand`, landing title/description in packets, attempt logs) |
| Visual system | Art Nouveau (Mucha-inspired) palette, ornaments, serif display tokens — already specified in `worklog.md` design brief and implemented in app shell |
| FIXER scope | **No redesign**, no palette/ornament/logo work this gate. Content and pedagogy only. |

Landing copy in agentic packets already welcomes learners to PyArcana; preserve brand strings when editing section TS.

---

## 5. EXAM_INVALID scan (this pass)

| Check | Result |
|-------|--------|
| `course-state/exam_selfcheck_pedagogy_report.json` (2026-07-21) | **ok=true**, selfcheck_issues=0, **p0=0 p1=0**, issues=[] |
| Source grep for empty options / obvious OOR `correctIndex` | **No matches** in `src/lib/course/sections/*.ts` |
| Spot-check `agentic_A1/packets/section_01.json` selfCheck_stems | **5 questions × 4 non-empty options** each (venv, gitignore, Conventional Commits, `pip install -r`, `.env`) |
| Section content edit this pass | **None** |
| `FIX_00N.md` this pass | **None** (research only) |

**No definite empty-options or correctIndex-OOR in source.** FIXER does not edit section content until live agentic walk produces real gaps or a true `EXAM_INVALID` appears.

---

## 6. Residual risks — checklist for the live agentic walk

Ordered for fixer standby (highest operational impact first):

1. **Phase-3 demo-scaffold shallowness** — teachable for code-exec; agentic agents may still block on mapping/concept depth or invent Master APIs. Fix = theory/iDo + scaffold alignment, not solution spoilers.
2. **S01 shell protocols** — multi-shell, PATH/cwd, markdown transcripts, activation paths; residual thinness on type hints / slicing / minor stdlib in starters.
3. **Honest `UNTAUGHT_*` cascade** — first hard block in early section stalls cumulative packets; expand earliest teaching locus and **restart**.
4. **Generator / key leakage** — any `correct_preview` or solution bleed fails validator authenticity (P0 process).
5. **Justification quality** — answers without packet-grounded justifications fail even if “lucky” correct (`WEAK_JUSTIFICATION` / score gates).
6. **Selfcheck fairness vs inventing** — ≥70% + justifications required; do not lower bar to code-exec equivalence.
7. **Integrity hardening residual** — non-empty garbage options historically escaped empty-option checks; current pedagogy report green; re-run `offline_selfcheck_integrity` if packets look inflated.
8. **Remote git / host Python variance** — accepted environmental residuals; teach verification, don’t overfit sandbox.
9. **Curriculum depth debt** — Master-level non-scaffold exercises remain post-gate work.
10. **Brand/design** — locked PyArcana + Art Nouveau; zero redesign bandwidth this gate.

---

## 7. Bottom line

| Item | Status |
|------|--------|
| Primary gate | **Agentic justification from packets** (validator) |
| Code-exec | Platform QA only; attempt_007b CLEAN_52 is prior confidence, not this bar |
| Phase-3 residual | Shallow demo-scaffolds — monitor for live `UNTAUGHT_*` |
| S01 residual | Shell protocol / multi-OS / markdown transfer surface |
| UNTAUGHT response | Expand **theory/iDo** current or prior; **never spoiler exercises** |
| Branding | **PyArcana + Art Nouveau — no redesign** |
| EXAM_INVALID source | **None found** — no content edit, no FIX file this pass |

**FIXER standby posture:** wait for live dual-newbie agentic artifacts under `agentic_A1`. On honest gaps, fix teaching surface and restart; on `EXAM_INVALID`, fix source immediately and document `FIX_00N.md`.
