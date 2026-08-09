# S38 Fixer Report (Round 2) — Concurrencia, observabilidad y workflows resilientes

**Role:** Curriculum Fixer · Technical Editor · Pedagogical Rewriter (second-round)  
**Date:** 2026-07-25  
**Task ID:** FIXER-R2-S38  
**Scope lock:** Section 38 only (`id: performance-extreme`)  
**Canonical source (only product file edited):** `src/lib/course/sections/s38-performance-extreme.ts`  
**Live:** https://pillb.github.io/pyarcana/#performance-extreme  

---

## 1. Section identification and sources reviewed

| Field | Value |
|--------|--------|
| Section # | **38** |
| Title | Concurrencia, observabilidad y workflows resilientes |
| shortTitle | Concurrencia y resiliencia |
| Internal id | `performance-extreme` |
| Canonical file | `src/lib/course/sections/s38-performance-extreme.ts` |
| Live route | `#performance-extreme` |
| Primary Explorer report | `course-state/curriculum_hardening/audits/explorer_reports/S38_EXPLORER_REPORT.md` |
| Expert report | `expert_audit/S38_report.md` |
| Expert 2 audit | `expert_audit/expert_2_audit/Section 38 Quality Audit.docx` |
| Spanish-quality JSON | `course-state/curriculum_hardening/audits/spanish_quality/S38_SPANISH_QUALITY.json` |
| Grammar plan | `expert_audit/_GRAMMAR_SUBPLAN.md` |
| Campaign summary | `expert_audit/CAMPAIGN_SUMMARY.md` |
| Shared worklog | `expert_audit/worklog.md` |
| Round-1 Fixer claim (re-audited) | `course-state/curriculum_hardening/audits/fixer_reports/S38_FIXER_REPORT.md` |
| Assessment | In-section `selfCheck` (**9** MCQs); You Do CP-N3-C; authenticated bank key `performance-extreme` (not rewritten) |
| Validation | Manual greps; execute-and-diff **41/41** theory+I Do+We Do oracles; `scripts/spanish_quality_audit.py --from 38 --to 38 --no-lt` |

### Anti-aberration acknowledgment

No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content. Automation was used only for mechanical validation (grep, code execution, output comparison, Spanish-quality metrics).

---

## 2. Summary of changes applied

### Round-2 reality check

**Round-1 Fixer** already closed Explorer **I01–I22** (meta purge, playground domain, instruction/starter alignment, hollow tokens, resume semantics, token-bucket caveat, 9 MCQs, DEFECTO es-PE, You Do scaffold). Independent re-check **held**:

- No `Legacy id` / `path V3` / `Id … conservado` / `token de pase`
- SectionView playground still backpressure + timeout + idempotency (out of R2 edit scope; verified read-only)
- 24 We Do instruction↔starter defect descriptions aligned
- Checkpoint `last_done` → `resume_from` next pending
- 9 self-check MCQs with balanced `correctIndex` distribution

**Expert report (8.0/10)** residual Spanish/cognitive-load items were **active** and fixed this round.

**Expert-2 (6.5/10)** raised construct-validity issues (real concurrency, durable crash/resume, TOCTOU on `Queue.full()`, idempotency as store not string, cancellation honesty, rubric bonus). Section-local fixes applied where feasible without rewriting the entire exercise lattice or global exam bank.

### Resolution table

| Issue | Source | Status before R2 | Change applied | Validation |
|-------|--------|------------------|----------------|------------|
| I01 playground domain | Explorer | **Already fixed (R1)** | Confirmed SectionView on-topic | Read-only grep |
| I02–I04 meta id leaks | Explorer | **Already fixed** | Held | Grep clean |
| I05–I11 exercise depth/alignment | Explorer | **Already fixed / strengthened R1** | Held; defect→defecto Spanish | Oracles 41/41 |
| I12–I16 mechanism / tests / resume | Explorer | **Already fixed** | Held + queue TOCTOU fix (R2) | Exec |
| I17 You Do thinness | Explorer + E2 | **Partial → improved** | Durable CKPT/APPLIED scaffold; apply_once demo | Source |
| I18 self-check | Explorer | **Already fixed (9 Q)** | Held | 9 MCQs |
| I19–I20 casing / DEFECTO | Explorer | **Already fixed** | Residual English `defect` → DEFECTO/defecto | Grep |
| I21 PdfReport | Explorer | **Already fixed (R1 platform)** | Not section-owned | Residual platform |
| I22 depth vs resources | Explorer | **Constrained residual** | Honest notes on contracts vs prod | Documented |
| EXP #4 Red Andina sintético | Expert + SQ | **Active → fixed** | `sintética` | Grep |
| EXP #5 presupuesto claros | Expert + SQ | **Active → fixed** | `claro` + unit spacing | Grep |
| EXP #6 un API | Expert | **Active → fixed** | `una API` | Grep |
| EXP #1/#2 `**` markdown leaks | Expert | **Active → fixed (section)** | Removed `**observabilidad**` / `**ambos**` | Grep |
| EXP #7 diccionario mega-paragraph | Expert + SQ | **Active → fixed** | Markdown bullet list | Source |
| EXP #8 run-on L66/L33/L68/L115 | Expert | **Active → fixed** | Split paragraphs | Source |
| EXP #25 `vs` → `vs.` | Expert + SQ | **Active → fixed** | Prose/headings/hints/selfCheck | 0 bare `vs ` |
| iDo/weDo intros | Expert | **Active → fixed** | Split intro sentences | Source |
| S38-05 Queue.full TOCTOU | Expert-2 | **Active → fixed** | `put_nowait` + `Full` theory + I Do | Exec + output |
| S38-03/04 idem + durable store | Expert-2 | **Partial → improved** | APPLIED set + CKPT store; prose honesty | Exec |
| S38-06 cancellation honesty | Expert-2 | **Partial → improved** | Explicit: playground classifies; async cancels | Source |
| S38-10 rubric bonus | Expert-2 | **Active → fixed** | Idempotencia + runbook **15%** mandatory | Rubric sums 100% |
| S38-01 real ThreadPool | Expert-2 | **Residual deferred** | LO/You Do ask local executor; lattice remains contract-first | Documented |
| S38-02 crash/restart test | Expert-2 | **Residual partial** | Scaffold + portfolioNote drill; no full multi-process harness in SPA | Documented |
| S38-11 exam bank A bias | Expert-2 | **Deferred** | Authenticated bank outside section-only product edit | Platform/agent D |
| Platform RichText | Cross-cutting | Platform | Section-local bold removed; component still raw for some fields | Residual platform |
| Legacy id `performance-extreme` | Cross-cutting | Compatibility | Kept as progress/URL key | Residual |

---

## 3. Full corrected content or precise complete diffs

**Authoritative full section after Round 2:**  
`src/lib/course/sections/s38-performance-extreme.ts`

### Representative corrections (post-R2)

**Spanish concordance:**
- `Red Andina sintética` (was `sintético`)
- `presupuesto de error claro` (was `claros`)
- `una API mock` (was `un API`)
- `vs.` standardized; units `120 ms` / `400 ms`
- Instructions: `(defect)` → `(defecto)`; starter comments `DEFECTO:`

**Cognitive load:**
- Diccionario as bullet list (includes backpressure/idempotency honesty)
- T1-A choice criteria split into three paragraphs
- Caso Red Andina, T1-A/T1-B aplicación, iDo/weDo intros split

**Markdown safety (section-local):**
- `jobRelevance`: plain `observabilidad` (no `**`)
- T3-B-E2: plain `ambos` (no `**`)

**Technical honesty (Expert-2):**
- Theory + I Do T2-A: `from queue import Queue, Full` + `put_nowait` / `except Full`
- T4-A: `APPLIED` set + `CKPT` store + `apply_once` double-call assert (output lines unchanged)
- T2-B: playground classifies timeout; real cancel via `wait_for` / `CancelledError`
- You Do: `apply_once`, CKPT/APPLIED, mandatory runbook + idempotency requirement; rubric no longer `bonus`

**Contract lead-ins varied:** del tramo / de carga / de timeout / de observabilidad / de SLO / de workflow / de fallo.

---

## 4. After-Fix Validation Report

| Check | Result |
|-------|--------|
| Explorer I01–I22 P0/P1 | **Already fixed (R1)** / held |
| Expert concordance + vs. + load splits | **Fixed** |
| Expert markdown `**` in raw fields | **Fixed** (section strings) |
| Expert-2 Queue TOCTOU | **Fixed** |
| Expert-2 idempotency store / durable framing | **Improved** (fixture store; full multi-process crash harness residual) |
| Expert-2 rubric bonus | **Fixed** (15% mandatory) |
| Meta grep | Legacy/V3/conservado/token de pase/`**ambos**`/`**observabilidad**` → **0** |
| Code exec oracles | **41/41** match declared `output` |
| Python compile of code chunks | **65/65** ok |
| Spanish quality (`--no-lt`) | **8.79 → 9.89** (findings **70 → 10**; residual mostly LT-false-positive class tech tokens when LT on) |
| Self-check | **9** MCQs; `correctIndex` dist {0:2, 1:3, 2:2, 3:2} — no positional monopoly |
| Markdown / RichText | Platform residual for other fields; S38 raw-bold sites cleared |
| Assessment bank (prisma) | Not rewritten this pass (Expert-2 S38-11 deferred) |
| Previous/next | S37 measure-first → S38 operate → S39 Case Triage; bridges preserved |

**Explicit confirmation:**  
No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content. Automation was used only for mechanical validation.

---

## 5. Residual risks and later recommendations

### Section-local residuals
- Progressive disclosure still prioritizes **operational contracts** over launching `ProcessPoolExecutor` / full `asyncio` cancellation in the browser playground (intentional safety boundary; Expert-2 S38-01/S38-06 partially deferred).
- Crash/resume multi-process evidence is **scaffolded** (CKPT/APPLIED + portfolioNote) but not a full SPA-executable process-kill harness.
- Taxonomy prefixes `S38-T*-E* · CASO-LIM-038-…` remain in instructions (systemic with S10/S11; hide at renderer).
- `hint` === `hints[0]` DRY redundancy remains (systemic loader concern).

### Repository-wide / deferred
- SectionView `<RichText>` for jobRelevance / instruction / feedback / context / portfolioNote
- Authenticated exam bank option-position balance (Expert-2 S38-11) — Global Agent D
- Legacy id `performance-extreme` compatibility migration — Global Agent C
- PdfReport short label already fixed in R1; re-verify if regenerated

### Adjacent-section
- S39 should continue to expect CP-N3-C contracts from S38; no S39 edits this pass.

---

## 6. Updated Graph Memory notes

| Node | Note |
|------|------|
| Section node | S38 · `performance-extreme` · concurrency + o11y + resilient workflows · CP-N3-C |
| Corrected concepts | Backpressure via `put_nowait`/`Full`; idempotency = key **+** applied store; checkpoint durable framing; error-budget agreement; vs. RAE polish |
| Prerequisite edges | S37 measure-first / same_result → S38 bound choice |
| Forward edges | S38 contracts → S39 Case Triage N3 assembly |
| Retained strengths | c-synth-1 continuous case; 8×3 We Do lattice; 9 MCQs; privacy posture; resources list |
| Resolved defects | Explorer I01–I22 held; Spanish concordance; TOCTOU; markdown asterisks; rubric bonus |
| Remaining risks | Real executor labs; multi-process crash test; exam bank bias |
| Compatibility | Keep `id: performance-extreme` for progress/URL |
| Assessment coverage | Public selfCheck T1–T4; You Do CP-N3-C; auth bank unchanged |

---

## 7. Files changed

| File | Why |
|------|-----|
| `src/lib/course/sections/s38-performance-extreme.ts` | All learner-facing R2 fixes (theory, I Do, We Do wording, You Do, rubric, selfCheck option wording) |
| `course-state/curriculum_hardening/audits/fixer_reports/round2/S38_FIXER_REPORT.md` | This report |
| `expert_audit/worklog_entries_r2/S38.md` | Full worklog entry |
| `expert_audit/worklog.md` | Append-only completion pointer |
| `course-state/curriculum_hardening/audits/spanish_quality/S38_SPANISH_QUALITY.json` | Regenerated by validation script (`--no-lt`) |

---

## 8. Worklog confirmation

Completion entry appended to `expert_audit/worklog.md` (Task ID: **FIXER-R2-S38**).  
Full detail in `expert_audit/worklog_entries_r2/S38.md`.

---

Section 38 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
