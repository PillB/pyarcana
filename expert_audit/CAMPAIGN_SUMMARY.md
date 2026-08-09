# Pyarcana Curriculum Audit Campaign — Final Orchestrator Summary

**Target:** https://pillb.github.io/pyarcana/ (repo: https://github.com/PillB/pyarcana)
**Campaign:** 52 parallel Curriculum Auditor subagents (S01–S52), one per section.
**Method:** Stanford STORM + Graph/Loop/Harness Engineering; verbatim Curriculum
Auditor instructions per section; Spanish grammar subplan (Fernández-Huerta,
INFLESZ, WPS/SPW, LanguageTool `es`, 13 pedagogical heuristics) applied to every
paragraph and sentence.

## Deliverables
- **52 per-section reports:** `/home/z/my-project/audits/S01_report.md` … `S52_report.md`
- **Shared grammar subplan:** `/home/z/my-project/audits/_GRAMMAR_SUBPLAN.md`
- **Shared worklog:** `/home/z/my-project/worklog.md` (one summary entry per section + this closer)
- Many sections also produced reusable extractor/metrics/LT helper scripts and JSON artifacts.

## Fleet quality scores (1–10)
| S | Score | | S | Score | | S | Score | | S | Score |
|---|-------|---|---|-------|---|---|-------|---|---|-------|
| 01 | 8.2 | 14 | 7.4 | 27 | 7.6 | 40 | 7.4 |
| 02 | 7.5 | 15 | 7.6 | 28 | 7.0 | 41 | 5.8 |
| 03 | 5.5 | 16 | 6.5 | 29 | 8.0 | 42 | 7.0 |
| 04 | 6.5 | 17 | 6.5 | 30 | 8.4 | 43 | 8.2 |
| 05 | 8.0 | 18 | 5.5 | 31 | 8.4 | 44 | 6.4 |
| 06 | 7.5 | 19 | 4.5 | 32 | 7.4 | 45 | 7.6 |
| 07 | 7.5 | 20 | 5.0 | 33 | 8.5 | 46 | 7.0 |
| 08 | 8.0 | 21 | 7.5 | 34 | 7.5 | 47 | 7.0 |
| 09 | 8.0 | 22 | 7.0 | 35 | 7.0 | 48 | 6.5 |
| 10 | 7.3 | 23 | 7.0 | 36 | 8.4 | 49 | 7.2 |
| 11 | 8.0 | 24 | 7.5 | 37 | 7.2 | 50 | 8.6 |
| 12 | 6.0 | 25 | 7.0 | 38 | 8.0 | 51 | 8.0 |
| 13 | 8.0 | 26 | 8.4 | 39 | 7.2 | 52 | 7.5 |

- **Mean:** 7.3 / 10  ·  **Min:** 4.5 (S19)  ·  **Max:** 8.6 (S50)
- **Bottom 5 (neediest):** S19 (4.5), S20 (5.0), S03 (5.5), S18 (5.5), S41 (5.8)
- **Top 5 (gold-standard):** S50 (8.6), S33 (8.5), S26 (8.4), S30 (8.4), S31 (8.4), S36 (8.4)

## Cross-cutting systemic defects (highest-leverage fixes)
These were independently rediscovered by many section auditors and represent the
biggest single-PR wins for the Fixer phase:

1. **Legacy id / filename / URL drift (V3 retarget debt)** — pervasive (30+ sections:
   S05, S06, S07, S08, S09, S10, S11, S12, S13, S14, S15, S16, S17, S18, S19, S20,
   S21, S22, S23, S24, S25, S28, S29, S30, S32, S35, S37, S39, S40, S41, S42, S43,
   S44, S46, S47, S48, S49, S50, S51). The `id`/filename/URL hash still names the
   *old* topic while the content was rescoped. Recommended: one coordinated PR that
   sets `section.id === slugify(section.shortTitle)` across all 52 + redirects.

2. **Off-topic interactive playground demos** — `SectionView.tsx` `demos[section.id]`
   loads stale V2 playground code (e.g., CLIP/Whisper under a CI/CD section,
   QLoRA under a FastAPI section, Streamlit under an AI-endpoints section,
   GraphRAG under a schemas/security section, GPU code under a data-engineering
   section). Verified live by multiple auditors. Same root cause as #1.

3. **`PdfReport.tsx` wrong section labels** — many sections show legacy labels
   ("41. FineTune", "44. Multi-Modal", "42. GraphRAG", "9. Viz", "23. CV", etc.).

4. **Markdown leak (raw JSX without `<RichText>`)** — `jobRelevance`,
   `callout.content`, `step.instruction`, `step.why`, `step.hint`, `step.feedback`,
   `project.context`, `project.portfolioNote`, `rubric.criterion` render literal
   `**asterisks**`, pipes, and backticks on 4 of 5 tabs. **Single highest-leverage
   edit in the campaign** — one PR benefits all 52 sections. (Flagged by S06, S16,
   S17, S22, S35, S38, etc.)

5. **Pseudonymization drift → fabricated code/output pairs** — a region-rename
   pass swapped `Lima/Arequipa/Cusco` → `Sucursal-Norte/Sur/Centro`,
   `Oficina-Este/Oeste`, `Cliente-A/B` inconsistently across `instruction`/`hint`/
   `starterCode`/`solutionCode`/`output`, so displayed outputs are fabricated and
   some exercises crash (`KeyError`) / are unsolvable. Confirmed in S03, S04, S07,
   S08, S11, S12, S17, S18, S19, S20. Recommended: a repo-wide harness that
   executes every `code` block and diffs real vs. stored `output`.

6. **`hint` ≡ `hints[0]` duplication** — 24/24 exercises per section (S01, S09,
   S10, S37, S38, …). Wasted field; pick one.

7. **`vs` → `vs.` typography** — systemic across nearly every section.

8. **RAE orthography nits (recurring):** `cache`→`caché`, plural siglas
   `APIs`/`URLs`/`CVEs`/`IDs`/`PRs`→invariable, `auto-X`→`autoX`
   (`autoetiqueta`, `autofraude`, `autoaceptar`), `re-X`→`reX` (`reprocesar`,
   `reOCR`), `postmortem`→`post mórtem`, `mismo resultado` missing article `el`.

9. **`# DEFECT:` vs `# TODO:` vs `# BUG intencional:` marker convention drift**
   across sections (S27 establishes `# DEFECT:`; S28 switches to
   `# BUG intencional:`; S30/S48 use `# TODO:`).

10. **Tautological stub assertions** `meets_contract = ('1A-1' == '1A-1')`
    printed to learners in S45/S48/S49/S50 solutionCode (not S51, which uses
    real predicates).

11. **Curriculum-owner / author-register callouts** ("El dueño de Sxx-T*-A
    responde por…", "Antes de promover…", "residual risk") leak internal
    instructor voice into learner-facing text (S44, S45, S48, S49, S51).

12. **Cognitive-load hotspots:** mega-paragraph "Diccionario de la sección"
    glossaries (S01 438w, S26/S38/S40/S49 ~100–120w) and 50–60w `jobRelevance`
    openers across many sections.

## Grammar methodology applied (per section)
Every auditor implemented/ran the shared subplan: TS-aware prose extraction →
paragraph/sentence splitting (Spanish-aware `¿¡`) → Fernández-Huerta + INFLESZ +
WPS + SPW + 13 heuristics per unit → LanguageTool `es` (chunked, throttled) →
false-positive filtering (MORFOLOGIK on tech terms, diacritic `solo`/`mismo`
post-2010 RAE, voseo in es-PE, etc.). Aggregate FH bands cluster in the healthy
"normal / fácil" range (~64–83) for technical Spanish, with WPS ~10–14 (under the
15–32 soft cap) — readability is generally healthy; the deficits are structural
(identity/markdown/code-output integrity), not linguistic.

## Recommended Fixer priority order (campaign-wide)
1. **P0 — One PR:** route the 5–8 markdown fields through `<RichText>` in
   `SectionView.tsx` (fixes literal-asterisk leak on all 52 sections).
2. **P0 — One PR:** coordinated `section.id`/filename/URL/`PdfReport` label
   rename sweep + `demos[id]` playground realignment across all 52.
3. **P0 — One PR:** repo-wide code/output integrity harness; regenerate every
   stored `output` by executing the code; fix the unsolvable exercises (S19 etc.).
4. **P1:** per-section P1 fixes already drafted as GitHub-style diffs in each
   `SNN_report.md` (gender/number concordance, `vs.`, RAE orthography, run-on
   splits, author-register callout rewrites).
5. **P2:** `hint`/`hints[0]` de-duplication; marker-convention standardization
   (`# DEFECT:`); remove tautological stub assertions.

## Notes
- Two sections needed a single retry due to agent context-deadline timeouts
  (S38, S51); both completed on retry and produced full reports.
- Every report ends with the required closer: *"This is the complete Explorer
  report for Section N. Ready for the Fixer prompt."*
- No content was modified (audit-only, per the non-negotiable rules); every fix
  is proposed as a ready-to-apply GitHub-style diff inside the corresponding
  `SNN_report.md`.
