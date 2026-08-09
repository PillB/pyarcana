# S37 Fixer Report (Round 2) — Profiling, algoritmos y rendimiento

**Generated:** 2026-07-25  
**Role:** Second-round Section Fixer (headless)  
**Section:** 37 · `dbt-bigquery` · Profiling, algoritmos y rendimiento  
**Source edited (only):** `src/lib/course/sections/s37-dbt-bigquery.ts`  
**Anti-aberration:** **OK** — no generators, loops, templates, or bulk mechanisms manufactured educational prose. Automation used only for mechanical validation (code/output oracles, Spanish metrics, residual greps). Hand-authored before→after maps applied as exact string replacements; each unit was reviewed for pedagogical intent.

---

## 1. Section identification and sources reviewed

| Field | Value |
| --- | --- |
| Section number / title | 37 — Profiling, algoritmos y rendimiento |
| Canonical file | `src/lib/course/sections/s37-dbt-bigquery.ts` |
| Live route | https://pillb.github.io/pyarcana/#dbt-bigquery |
| Internal ID | `dbt-bigquery` (legacy routing hash; content is profiling/performance) |
| Primary Explorer report | `course-state/curriculum_hardening/audits/explorer_reports/S37_EXPLORER_REPORT.md` (baseline 6.0; print-theater / LO overclaim) |
| Round-1 Fixer report | `course-state/curriculum_hardening/audits/fixer_reports/S37_FIXER_REPORT.md` (R1 ~9.62 structural + cProfile/peak) |
| Expert report | `expert_audit/S37_report.md` (7.2; Spanish/meta residuals) |
| Expert-2 report | `expert_audit/expert_2_audit/Section 37 Quality Audit.docx` (You Do same_result tautology; tracemalloc unrelated allocation) |
| Spanish-quality JSON | `course-state/curriculum_hardening/audits/spanish_quality/S37_SPANISH_QUALITY.json` (pre R2: 8.43) |
| Grammar plan | `expert_audit/_GRAMMAR_SUBPLAN.md` |
| Campaign / worklog | `expert_audit/CAMPAIGN_SUMMARY.md`, `expert_audit/worklog.md` |
| Assessment | Embedded `selfCheck` (5 MCQ); no separate question-bank file for this id |
| Validation | Manual oracle harness (theory T1-A + iDo T1-A + 24 We Do solutions + You Do starter), `scripts/spanish_quality_audit.py --from 37 --to 37 --no-lt`, residual greps |

**Scope boundary:** Only Section 37 canonical source. No edits to `SectionView.tsx`, `PdfReport.tsx`, other sections, or global platform files.

---

## 2. Summary of changes applied

### Baseline reality check

Round-1 already resolved Explorer Issues **ISSUE-01…ISSUE-18** (legacy id digressions in prose, print-theater We Do, instruction↔starter alignment, cProfile/wall/CPU/tracemalloc tools, You Do scaffold, gate V3/es-PE/solutionCode leaks, S30/S38 bridges, dual reduction semantics). Current source matched the gold structure (dictionary + 8 subtopics × theory/I Do/We Do triad + scale report You Do + 5 self-check).

Round-2 focused on **Expert-2 critical technical defects** (You Do same_result tautology; tracemalloc on unrelated allocation), **expert Spanish/meta residuals**, **instruction/feedback de-prefixing**, and **register polish**.

### Resolution table

| Issue | Source | Status before R2 | Change applied | Validation |
| --- | --- | --- | --- | --- |
| Explorer ISSUE-01…18 structural | Explorer + R1 report | **Already fixed** in source | Confirmed present; no re-architecture | Residual greps: 0 legacy digression / gate V3 / path V3 / es-PE / solutionCode-in-starter; 24/24 oracles PASS |
| Expert-2 Issue 1 You Do same_result tautology | Expert-2 Critical | Active | Rewrote starter: shared fixture; `before_path`/`after_path` timed; `same_result` compares actual function outputs; `blocked_pairs` accounts for remainder | You Do executes; `same_result True`; negative test detects semantic drift |
| Expert-2 Issue 2 tracemalloc unrelated alloc | Expert-2 Critical | Active in theory T1-A, iDo T1-A, weDo T1-A-E2 | Peak measured under `path`/`work` itself; hot path allocates list of squares | Theory + iDo + E2 PASS |
| Expert S37-ISSUE-01 id/filename | Expert H | Compatibility | **Retained** `id: "dbt-bigquery"` and filename (progress/URL); no learner digression | Residual platform |
| Expert S37-ISSUE-05 `mismo resultado` | Expert M | Active ×6+ | Article forms (`el mismo` / `con el mismo` / `junto con el mismo`) | Grep clean for bare `con mismo resultado` |
| Expert S37-ISSUE-06 verb anglicisms | Expert M | Active | Profilear→Perfilar; Benchmarkear→Medir con benchmark; scorear→puntuar; Cachear→Guardar en caché | Grep 0 |
| Expert S37-ISSUE-07/08 anglicism + clever | Expert M/L | Active | «más ingenioso»; cold start gloss; compute-bound gloss; shaving→recorte | Source |
| Expert S37-ISSUE-09 register | Expert M | Active | Theory tú/impersonal unified on key paragraphs (`indicó`, `sube`/`aísla`/`presentes`, `se documenta`) | Source |
| Expert S37-ISSUE-10 long instructions | Expert M / SQ | Active WPS 34–40 | Dense E2/E3 instructions split into short sentences with backticked identifiers | SQ 8.43→9.87 |
| Expert S37-ISSUE-11 `PRs` | Expert L | Active | `entre PR` (sigla invariable) | Grep 0 `PRs` |
| Expert S37-ISSUE-12 COMMA_PERO | Expert L | Active | Comma before `pero` in E1 wall instruction | Source |
| Expert S37-ISSUE-13 paren spacing | Expert L | Active | T3-B-E1 key incompleta rephrased | Source |
| Expert S37-ISSUE-14/15/17 mata, shot, #1 | Expert L | Active | inutiliza; una sola medición; métrica principal | Source |
| Expert S37-ISSUE-03 CP-N3-C in headings | Expert L | Active | Theory map + You Do title softened to learner Spanish; portfolio note drops code-as-heading | Source |
| Expert S37-ISSUE-04 bridges | Expert L | Keep (senior) | Bolded S14→S30→S37 / S37→S38; retained as connective tissue | Source |
| Expert S37-ISSUE-02 hint/hints[0] | Expert M | Active pattern | Deferred — progressive `hints[]` already deepen after index 0 on many steps; schema dual field is platform-wide | Residual |
| Expert S37-ISSUE-20 CASO-LIM density | Expert L | Active ×30+ | Stripped from instructions/feedback/starter headers; kept labeled case in jobRelevance/map contract code only | 4 residual labeled uses |
| Expert S37-ISSUE-21/22 tests/edgeCases template | Expert L | Active | edgeCases humanized on key steps; tests strings de-prefixed; full executable harness is out of platform scope | Residual light |
| SQ long_sentence / comma_density | SQ | Active | Split densest instructions; residual density is exercise-contract prose | findings 76→7 |
| SQ repeated_word `array.array` | SQ | Medium | **False positive** (module attribute) | Documented FP |
| SQ lowercase after `vs.` | SQ | Low | **False positive** (abbreviation `vs.`) | Documented FP |
| RichText markdown leak | Cross-cut 6.1 | Platform | Recorded only | Residual |
| Legacy id `dbt-bigquery` | Cross-cut 6.2 | Compatibility | **Retained** | Residual |

---

## 3. Full corrected content / precise diffs (summary of substantive edits)

All product changes are in `src/lib/course/sections/s37-dbt-bigquery.ts`. Representative units:

### Header
- **Tagline:** capital start; `el mismo resultado`; terminal period.
- **jobRelevance:** `n` backticked; labeled case reference; privacy articles.
- **learningOutcomes:** Perfilar / Medir con benchmark; terminal `.`; `vs.`; 2 % spacing; dtypes estrechos.

### Theory
- Map heading: “escala del matching” (no CP-N3-C noise).
- Dictionary: cold start gloss; matching/features wording.
- T1-A: compute-bound gloss; tracemalloc of real path; cProfile hot_fn unchanged outputs.
- T1-B…T4-B: register, anglicisms, articles, `puntuar`, guardar en caché, métrica principal, units with RAE space.
- Application lines: “caso sintético T*-*” instead of taxonomy tags in prose.
- Callouts: ER expanded; itemsize backticked; El mismo resultado.

### I Do
- Intro without raw CASO tag dump.
- T1-A demo: path allocation under tracemalloc; split `why`.
- T2-A why: métrica principal + vs.

### We Do (24)
- Instructions: `Ejercicio E1/E2/E3 · …`; CASO-LIM stripped; dense contracts sentence-split; technical tokens backticked.
- Feedback: authoring prefixes removed; `PRs`→`PR`; professional short sentences.
- Starter headers: `# E* — … (sintético, sin PII)`.
- T1-A-E2 solution: peak of `work`, not separate list.
- edgeCases: humanized where touched.

### You Do
- Title without CP-N3-C parenthetical.
- Context/requirements emphasize calculated `same_result`.
- Starter: `before_path` / `after_path` share fixture; pair counts with remainder distribution; assert on real outputs.
- Rubric bonus: “salidas de las funciones medibles”.
- Portfolio: traspaso a S38.

### Self-check
- Cold-start gloss; `poner en rojo`; 2 % spacing; article before hardware; `n` backticked in explanation.
- **correctIndex values unchanged** (0, 2, 3, 1, 0).

### Preserved (do not break)
- `id: "dbt-bigquery"` (URL/progress compatibility).
- Computational We Do kernels and solution output contracts.
- Ethics spine (synthetic, no PII, no fraud inference).
- 5 self-check MCQs and answer keys.
- S14→S30→S37→S38 narrative bridges.
- Resources list.

---

## 4. After-Fix Validation Report

| Check | Result |
| --- | --- |
| Explorer ISSUE-01…18 | **Already fixed** (R1) — revalidated |
| Expert-2 same_result + tracemalloc | **Fixed** |
| Expert ISSUE-05…17 Spanish/meta (section-local) | **Fixed** or **deferred with justification** |
| Theory T1-A + iDo T1-A | **PASS** (stable predicates + hot_fn) |
| We Do solutionCode | **24/24 PASS** |
| You Do starter | **PASS** (`same_result True`, reduction ~0.905, gate_ok) |
| Spanish quality | **8.43 → 9.87** (`--no-lt`); FH ~85.4; findings 76→7 (mostly FP `vs.` / `array.array` / exercise comma density) |
| Residual greps | 0 Profilear/Benchmarkear/scorear/Cachear/más clever/un solo shot/PRs/gate V3/path V3/es-PE; 0 `instruction: "S37-` / `feedback: "S37-` |
| Assessment keys | Self-check indices unchanged; 5 questions; distribution intact |
| Markdown / RichText | Platform defect unchanged; section still uses `**bold**` in jobRelevance |
| Live render | Hash `#dbt-bigquery` retained; content is profiling |
| Previous/next | S30 blocking/recall bridge and S38 budgets handoff preserved |

**Explicit statement:**  
No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content. Automation was used only for mechanical validation.

---

## 5. Residual risks and later recommendations

### Section-local residuals
- Dual `hint` / `hints[0]` schema still often mirrors first progressive hint (course-wide pattern; not rewritten en masse).
- `tests:` fields remain descriptive strings, not executable harness (platform limitation).
- Theory `blocking_cost` still uses exact division when `n % blocks == 0` (demos use exact cases); You Do remainder-aware formula is the portfolio standard.
- SQ residual findings: `vs.` casing false positives; dense multi-token exercise instructions.

### Repository-wide platform dependencies
- Legacy `id` / filename `dbt-bigquery` (Global Agent C migration with aliases).
- `SectionView.tsx` RichText markdown leak (Global Agent A).
- Optional PdfReport label drift if any still says dbt/BigQuery (Global Agent C).

### Deferred
- Authenticated exam bank (if any) not present as a separate file for this id in this repo layout; public self-check only.
- Full statistical CI budget (host-noise-aware) remains a senior extension, not a section-local rewrite of all budget labs.

---

## 6. Updated Graph Memory notes

```
[S30 blocking+recall] --informs--> [S37-T2 pair cost + recall gate]
[S37-T1 measure wall/CPU/peak/hot_fn] --feeds--> [S37-T4 budget]
[S37 same_result] --gate--> [any optimization node]  # now enforced on function outputs in You Do
[legacy id dbt-bigquery] --noise_edge--> [learner topic model]  # routing only; prose clean
[resources cProfile/tracemalloc] --lab_edge--> [theory+iDo+E2]  # closed
[weDo compute kernels] --support--> [youDo portfolio]
[S37 budgets + before/after] --feeds--> [S38 concurrency metrics]
```

**Retained strengths:** gate triad same_result / before_after / budget; E1→E2→E3 ladder; synthetic ethics; stdlib-first measurement stack.

**Resolved defect nodes:** You Do tautological same_result; tracemalloc theater; Spanish article/verb/register cluster; learner-facing S37-T* / CASO-LIM instruction spam.

**Compatibility constraints:** keep `id: "dbt-bigquery"` and filename until Global Agent C migrates with aliases.

---

## 7. Files changed

| File | Why |
| --- | --- |
| `src/lib/course/sections/s37-dbt-bigquery.ts` | Sole product edit: theory, I Do, We Do, You Do, self-check prose + technical oracles |
| `course-state/curriculum_hardening/audits/fixer_reports/round2/S37_FIXER_REPORT.md` | This report |
| `expert_audit/worklog_entries_r2/S37.md` | Full worklog entry |
| `expert_audit/worklog.md` | Append-only completion pointer FIXER-R2-S37 |
| `course-state/curriculum_hardening/audits/spanish_quality/S37_SPANISH_QUALITY.json` | Regenerated by validation script only |

---

## 8. Worklog confirmation

Completion entry written to:
- `expert_audit/worklog_entries_r2/S37.md` (full)
- `expert_audit/worklog.md` (append pointer, Task ID: **FIXER-R2-S37**)

---

Section 37 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
