# Pre-Round Research — attempt_002

**Agent:** FIXER (isolated)  
**Date:** 2026-07-21  
**Scope:** Read-only validation of runtime audit, selfcheck integrity, dual-newbie scan, and pedagogy alignment.  
**Section content edits:** none (no definite source-level empty-options / correctIndex-OOR found).

---

## 1. Gate snapshots (what looks solid)

| Report | Path | Result |
|--------|------|--------|
| Runtime audit | `course-state/python_runtime_audit_report.json` | **ok=true**, pass=2382, fail=0, skip=283, **p0=0 p1=0** |
| Issue registry | `course-state/python_content_issue_registry.json` | p0=[], p1=[] |
| Exam/selfcheck pedagogy | `course-state/exam_selfcheck_pedagogy_report.json` | seed+selfcheck **p0=0 p1=0**, issues=[], ok=true (1248 seed Qs, 416 concepts) |
| Heuristic packet scan | `attempt_002/scan_report.json` | **52/52 ok**, total_heuristic_gaps=0, p0_gaps=0, p1_gaps=0 |
| Selfcheck integrity | `attempt_002/selfcheck_integrity.json` | **ok_sections=52**, issue_count=0, **p0=0 p1=0** |
| Attempt meta | `attempt_002/meta.json` | reason: *after runtime P1=0, lambda lesson, packet id fix* |

### Runtime audit alignment with best practices

Audit classifier (`scripts/python_content_runtime_audit.py`) matches intended pedagogy:

1. **Incomplete exercise starters** — markers (`____`, `TODO`, `# BUG`, `NotImplementedError`, …) that fail with pedagogical errors (`NameError`, `IndexError`, `SyntaxError`, `AssertionError`, …) classify as **`expected_fail_ok` (pass)**. Confirmed on S01 sample starters.
2. **Nondeterministic / illustrative demos** — soft path via `output_illustrative` (`...` / `…`), `output_nondeterministic_ok` (structural similarity for timestamps/timings), `output_error_demo_ok` (shared error tokens). No P1 `output_mismatch` failures remain.
3. **Skips (283)** are environmental/P2-class, not gate-breakers: concentrated in
   - **S01 setup** (59) — shell/markdown/non-executable artifacts
   - **S14–S18** (~26–40 each) — likely `missing_dependency` / fixture / non-python
   - S03/S09–S10/S19–S21 smaller skip tails  
   Later sections (≈S22+) mostly 0 skips with full pass.

### Lambda teaching order

- **First formal lesson:** S05 (`s05-oop.ts` — title: *Funciones, contratos y descomposición*), theory block *Pureza, efectos e inyección de I/O*: syntax, when to use, prefer named `def` when logic grows; demo injects `norm=lambda s: ...`.
- **S01–S04:** no `lambda` usage in section TS (grep clean).
- **S06+:** heavy `key=lambda` in collections/sort demos and exercises — **after** S05 lesson.  
**Verdict:** lambda-before-exercises requirement is **satisfied**.

### Dual-sim progress (partial)

Automated dual-sim has graded at least **S01–S24** (grades + sufficiency present). Heuristic `gaps.json` from dual-sim (not packet heuristic) is sparse:

| Section | Dual-sim gaps |
|---------|----------------|
| S01 | STARTER_BROKEN on skeptic for `S01-T1-B-E3` (markdown transfer; starter exists in source — packet/starter extraction or empty-string path for skeptic) |
| S02 | selfcheck-3 sufficiency 0.0 for correct preview `[1, 2, 3]`; STARTER_BROKEN on `S02-T1-B-E3`, `S02-T4-B-E3` |
| S04 | selfcheck-0 sufficiency 0.0 for `[0,1,2]` |
| S06 | selfcheck-0 sufficiency 0.0 for `[3,4]` |
| Others sampled | empty dual-sim gaps |

Lexical dual-sim selfcheck scores (illustrative):

| Section | A % | B % | Note |
|---------|-----|-----|------|
| S01 | 60 | 40 | Conceptual / commit-message distractors |
| S02 | 40 | 40 | Result-list options hard to token-match |
| S05 | 40 | 20 | Functions section |
| S09 | 33 | 33 | |
| **S10** | **16.7** | **16.7** | **Hardest early section for lexical agents** |
| S11 | 83 | 67 | |
| **S16** | **100** | **100** | **Both perfect — spoiler / option-leak risk** |
| **S18** | **100** | **100** | Same |
| S19 | 50 | 25 | |

Integrity + pedagogy + runtime gates: **green**. Residual risk is mostly **pedagogy/packet UX** for the dual-newbie pass, not compiler/runtime breakage.

---

## 2. Residual risks for dual-newbie pass

### R1 — P0 operational: learner packets on disk still have garbage selfCheck options

**Evidence:** `attempt_002/packets/section_01.json` and `section_01/packet.json` still show options arrays with separator junk:

```text
"options": [
  "Para acelerar la ejecución del código Python",
  ",\n          ",
  "Para aislar las dependencias ...",
  ...
]
```

Quoted options (Conventional Commits) also **duplicate/fragment** (`"cambios"` + `cambios` + `',\n          '`).

**Source TS is clean** (`s01-setup.ts` has 4 proper single-quoted options; `correctIndex` in range).

**Why integrity still p0=0:** `offline_selfcheck_integrity` only checks empty options and `correctIndex` OOR. Inflated arrays (7+ items) keep CI in range, so garbage does **not** trip P0.

**Split brain:** dual-sim rebuilds via `build_packet()` and records **4 scores** per question (consistent with a fixed runtime parse). Live LLM newbies reading **disk packets** already report garbage option tokens (`newbie_a_live.json` confusions).

**Impact:** wrong `chosen_index` space for live agents; spoils fair dual-newbie evidence; undermines grading if anyone grades against packet indices instead of server keys.

**Action (next fix round):** regenerate all attempt_002 packets (`--scan-all`) after confirming `extract_string_array` is the robust path; add integrity assertion `len(options)==4` (or ≥2 and no separator-only items); document in `FIX_001.md`.

### R2 — Selfcheck too hard (packet-only lexical learners)

- S10 **16.7%** both personas; S05/S09 low 20–40% for skeptic.
- Sufficiency failures on **code-result options** (`[1,2,3]`, `[0,1,2]`, `[3,4]`) with support_ratio 0.0: either the demo never prints that exact literal, or tokenizer drops list/number shapes — real humans may still solve from demos.
- Live Newbie A: `len()` used in S01 blanks but not named in theory/iDo.
- Live Newbie B: blocks on untaught `def`/f-strings/`sys.argv`/`sys.executable` early in S01.

**Risk:** dual-newbie pass over-flags “untaught” or fails selfcheck gates that a human beginner with the same packet could pass by reasoning.

### R3 — Selfcheck too easy / spoiler (verbatim option leak)

- S16 and S18: **100% both agents** via pure lexical match.
- Later sections with short 4-question banks and jargon that appears verbatim in theory may be “free points.”
- Sufficiency `support_ratio` near 1.0 is good for learnability but combined with unique long phrases can make distractors dead.

**Risk:** dual-newbie selfcheck grades look better than true understanding; exam banks may share the same pattern (pedagogy audit did not flag, but lexical sim did).

### R4 — STARTER_BROKEN / transfer exercises without Python starters

- Markdown transfer exercises (e.g. `S01-T1-B-E3`) have `starterCode.language: 'markdown'` with fill-in template in source; skeptic dual-sim still emitted STARTER_BROKEN when starter string empty in packet.
- Incomplete Python starters with `____`/`TODO` are **OK** (aligned with runtime `expected_fail_ok`).

**Risk:** false-positive gaps; ensure packet builder flattens nested `starterCode.code` for markdown/python consistently.

### R5 — Untaught APIs beyond heuristic scan

Packet heuristic `gap_scan` is import/construct-light and returned **0** gaps course-wide. Live skeptics still flag:

- Control-flow / builtins implied by blanks (`len`, `def`, f-strings) before formal teaching section.
- Section-id vs title drift in catalog (file `s06-numpy.ts` teaches collections, not NumPy) — confusing for agents using ids, not a student-facing bug if UI shows titles.

### R6 — High skip density mid-course (not P0)

S14–S18 runtime mostly skip: fine for gate if intentional (optional stacks). Dual-newbie may still need demos that **run** in the in-browser interpreter; verify student-facing runtime separately from audit host skips.

### R7 — No definite source broken exam (this pass)

- No empty options / correctIndex OOR in integrity report.
- Pedagogy audit clean.
- **Do not change section TS solely for dual-sim lexical scores** until packets are regenerated and live agents re-run on clean options.

---

## 3. Recommended verification commands

```bash
# 1) Runtime gate (must stay p0=p1=0)
python3 scripts/python_content_runtime_audit.py

# 2) Exam + section selfcheck pedagogy
python3 scripts/exam_selfcheck_pedagogy_audit.py

# 3) Rebuild learner packets + heuristic scan (clears stale garbage options)
python3 scripts/newbie_walkthrough_runner.py --scan-all --attempt attempt_002

# 4) Selfcheck integrity (consider hardening to reject separator-only options)
python3 scripts/newbie_walkthrough_runner.py --selfcheck-integrity --attempt attempt_002

# 5) Spot-check option parse quality after rescan
python3 - <<'PY'
import json
from pathlib import Path
p = Path("course-state/newbie_walkthrough/attempt_002/packets/section_01.json")
stems = json.loads(p.read_text())["active"]["selfCheck_stems"]
for i, s in enumerate(stems):
    opts = s["options"]
    bad = [o for o in opts if not o.strip() or o.strip() in {",",} or o.strip().startswith(",\n")]
    print(i, "n=", len(opts), "bad=", bad, "sample=", opts[:2])
    assert len(opts) >= 2 and not bad, f"Q{i} still dirty"
print("section_01 options OK")
PY

# 6) Dual-sim refresh (after clean packets)
python3 scripts/newbie_dual_sim.py --attempt attempt_002 --from-section 1 --to-section 52

# 7) Lambda order smoke (no lambda before S05)
rg -n "\\blambda\\b" src/lib/course/sections/s0{1,2,3,4}*.ts || true
rg -n "\\blambda\\b" src/lib/course/sections/s05-oop.ts | head
PY
```

Optional hardening (future FIX, not done this pass):

- Share `exam_selfcheck_pedagogy_audit.parse_string_array_elements` with `newbie_packet_builder.extract_string_array`.
- Integrity: fail P0 if any option matches `^\s*,\s*$` or `len(options) not in (3,4,5)` for selfCheck, or if option equals only punctuation/whitespace.
- Force `--scan-all` after any parser fix before live dual-newbie agents read packets.

---

## 4. FIX log

- **No `FIX_001.md` this pass** — no section TS change; no definite source empty-option / CI-OOR.
- **Highest priority next fixer action:** regenerate attempt_002 packets + re-run integrity with stricter option sanitizer; then re-grade dual-sim S01–S10 sufficiency list-literal questions.

---

## 5. Summary judgment

| Area | Status |
|------|--------|
| Runtime p0/p1 | Solid |
| Heuristic packet gaps | Solid (0) |
| Selfcheck integrity (narrow definition) | Solid but **under-powered** |
| Lambda before use | Solid |
| Incomplete starter pedagogy | Solid |
| Soft-match nondeterministic demos | Solid |
| Dual-newbie residual | **Packets on disk dirty; hard selfchecks early; easy/spoiler S16/S18; some untaught early builtins** |

**Bottom line:** Course gates that ship to students (runtime, seed pedagogy, structural integrity under current checks) are green. Dual-newbie **attempt_002** still has material residual risk around **stale/corrupt packet options**, **early untaught surface**, and **selfcheck difficulty skew** — address packet regeneration before trusting live dual-newbie grades.
