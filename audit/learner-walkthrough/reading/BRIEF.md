# Reading brief: a persona-based cognitive walkthrough of one PyArcana section

You are reading PyArcana course sections **as a learner would**, and judging them. Report only:
never edit course files.

## Persona (fixed)
Lucía, 24, Lima, Peru. Native Spanish speaker; reads English slowly (product names fine, English
prose and unglossed anglicisms are friction). Finished secondary school and some university
statistics; no programming before S01. Pays for PyArcana monthly out of a modest salary, so time
and money matter to her. Goal: a first data job (data analyst / junior data role) within a year.
Works on a mid-range Windows laptop and sometimes her phone. Takes the course in order, S01 → S52,
and knows **only what earlier sections taught her** plus general school knowledge.

## Method
Cognitive walkthrough (Wharton, Rieman, Lewis & Polson 1994), adapted to learning: for each
learner action (read a theory block, follow an I Do demo, attempt a We Do exercise, do the You Do
project, answer the self-check, take the exam) ask the four questions:
1. Will she try to achieve the right effect? (does she know what the step asks of her?)
2. Will she notice the correct action is available? (is what she needs on the page or already taught?)
3. Will she associate the correct action with the effect she wants? (instruction unambiguous?)
4. If she does the right thing, will she see progress? (feedback / expected output tells her she's right?)
Plus constructive alignment (Biggs 1996): do learning outcomes, activities and assessment (self-check,
exam, You Do rubric) line up? Plus Nielsen's heuristics where the issue is UI-shaped (H1 visibility of
status, H2 match with real world/language, H5 error prevention, H9 help with errors, H10 help/docs).

## Inputs (read-only)
- Section content: `/tmp/claude-0/sections/SXX-<id>.json` (fields: learningOutcomes, theory[],
  iDo.steps[], weDo.steps[] (exercises), youDo (project + rubric), selfCheck.questions[],
  topicEvaluations, resources).
- Exam bank for that section: `/tmp/claude-0/sections/SXX-<id>.exam.json` (24 questions = 8
  concepts × 3 variants; the learner sees one variant per concept; pass mark is 70%, see
  `src/lib/exam-scoring.ts`).
- Earlier sections: same folder. **To decide whether a term or skill was "taught so far", grep the
  earlier sections' JSON files** (e.g. `grep -l "groupby" /tmp/claude-0/sections/S0[1-4]*.json`).
  Say which file/field you checked. Do not rely on memory of Python; rely on what the course taught.
- Badge catalog: `/home/user/pyarcana/src/lib/eligibility/badge_catalog.json` (find badges whose
  `required_sections` include your section; check `public_claim`, `critical_competencies`,
  `newbie_friendly_description`).
- CPython 3.12 run results for lesson code (pinned packages): all 3244 snippets pass under CPython,
  so "the code is wrong" is unlikely; do not re-run code. The browser runtime is Pyodide 0.26.2
  (pandas 2.2.0, numpy 1.26.4, scikit-learn 1.4.2, matplotlib 3.5.2, no network) while the content
  is pinned to pandas 3.0.5 / numpy 2.2.6 / scikit-learn 1.6.1. Flag any snippet whose printed
  `output` depends on pandas-3-only behaviour (e.g. `str` dtype display, copy-on-write warnings),
  numpy-2-only reprs (`np.float64(1.0)`), sklearn ≥1.5 APIs, network (`requests.get` to a real
  URL), files on disk the browser lacks, or packages Pyodide lacks (e.g. fastapi server run,
  playwright, wxPython, torch, rapidfuzz, pytesseract) — as an *inference*, naming the snippet.

## What to answer per section
1. **Blockers**: anything that would stop Lucía going on (exercise impossible from what was taught,
   project needing paid services/tools she can't get, code that can't run where she is told to run it).
2. **Issues**: anything broken or wrong (contradiction, wrong answer key, an explanation that
   disagrees with its correctIndex, broken expected output, a solution that does not meet its own
   instruction, a rubric that cannot be scored).
3. **Confusions**: unexplained term at first use (check earlier sections!), instruction readable two
   ways, exercise not answerable from what was taught so far, feedback/explanation that doesn't help,
   English left unglossed.
4. Three verdict questions, each one line with a label:
   - Could she do the You Do from what the section taught? (yes / partly / no + why)
   - Does the self-check test what was taught? (yes / partly / no + why)
   - Does the exam test what the badge(s) for this section claim? (name badge ids; yes/partly/no)
5. **Value**: one or two lines: as a paying beginner, fulfilled or shortchanged by this section, and
   would the You Do read well on her GitHub (README? tests? data? a demo?).

Quality bar: be skeptical and specific, not complacent, and not inflated. A finding needs evidence:
quote the Spanish text exactly as written (short quote) and give its location as
`<field path>` e.g. `weDo.steps[3].instruction` or `selfCheck.questions[2]`. Label every judgement
**[O]** observation (you saw it in the text), **[I]** inference (you reasoned it), or **[G]** guess.
Severity: blocker / high / medium / low. Each finding gets a proposed fix naming the file
(`src/lib/course/sections/<file>.ts`, `prisma/seed.ts` for exam items, `badge_catalog.json`, ...)
and the reason. Prefer fewer, well-evidenced findings over many weak ones; aim for the 3–10 that
matter most per section. Don't report style nits unless they would actually confuse Lucía.

## Output
Write ONE markdown file per section to
`/home/user/pyarcana/audit/learner-walkthrough/reading/SXX.md` with exactly this shape:

```
### SXX — <title>
Read: <which fields you read fully>; checked earlier sections: <files grepped for what>.

**Blockers**
- [sev] [O/I/G] <finding> — where: `<field path>` — evidence: «<quote>» — fix: `<file>`: <change> (<reason>)
(or "None found.")

**Issues**
- ...

**Confusions**
- ...

**Verdicts**
- You Do doable from what was taught: <yes/partly/no> [O/I] — <why>
- Self-check tests what was taught: <...>
- Exam tests the badge claim (<badge ids or "no competency badge requires SXX">): <...>
- Value: <fulfilled/mixed/shortchanged> — <why>; GitHub-readiness of the You Do: <...>
- Browser-runtime risks (Pyodide 0.26.2): <snippets at risk, or none>
```
Write in English; quote Spanish exactly. Do not write anything else to the repo.
When done, reply with a 5-line summary of the most serious findings across your sections.
