## 2. Summary (2-minute read)

I took PyArcana from S01 to S52 as **Lucía**: a paying Spanish-speaking beginner in Lima who wants
a first data job. I clicked through every section in a real browser, read every lesson and exam as
she would, and filed every problem in the course's own QA tool. **576 findings**: 8 blocker, 149
high, 263 medium, 156 low; 528 are direct observations, 48 inferences.

**The short version.** The course teaches the right *values* unusually well: privacy, honest
numbers, "a score is not a verdict", fail-closed. It does not yet let her *practise*, *prove* or
*show* what she learned:
- Exercises are read-only.
- Exams are unreachable, and where they exist, answering «B» passes.
- Badges point at the wrong sections.
- 12 of 13 portfolio projects would not survive a recruiter's first look.

### Top blockers and high-severity problems

1. **Finishing a section can un-finish it.** After she passes the Autocheck, the button the result
   card offers, «Marcar como completada», marks the section *not* complete. It happens on every
   section, and her account loses it too. (W01, observed on all 52)
2. **A paying learner never sees an exam.** Signed in with Pro, every section shows only the
   self-check. Every competency badge requires the exams. (W02)
3. **The exams that exist can be passed without knowing anything.** In 31 of 52 sections the right
   answer is always option B. The right answer is almost always the longest option. At least 11 keys
   mark a plainly wrong answer as right, e.g. S42 «Que pip elija al azar cada deploy». (W09)
4. **She cannot practise in the browser.** We Do's 1248 exercises have no editor and only a
   «Ver solución» button (W05). I Do's «Ejecutar» shows a pre-written output (W04). The one real
   editor per section practises another topic from S10 on, in 38 of 43 sections (W03). S19's
   editor is a SyntaxError (W12).
5. **Level-closing projects grade something else.** Eight sections are rated blocker because she
   cannot finish the activity from what was taught:
   - Gate sections build a different product from the capstone that grades them: S34, S39, S47,
     S51, S52.
   - S43 needs Docker, which the course never shows how to install.
   - S32's acceptance checks fail correct code.
   - S07's regex starters ship corrupted.

### Top confusions

- **Skills used before they are taught.** For example `try/except` (S02–S05), loops (S03), regex
  syntax (S07), SQL basics (S12), pytest running (S27) and FastAPI itself (S41).
- **Graded material contradicts the lesson.** For example S04's denominator, S08's atomic write,
  S16's Peruvian money format (1000× error on «S/ 1,250.50»), S24's DPI rule and S38's
  idempotency key.
- **Sections titled for tools they never use.** «Browser RPA con Playwright» (S23), «OCR y Document
  AI» (S24), «Endpoints de IA» (S25), «APIs con FastAPI» (S41).
- **Pass marks.** She is told 70% «desbloquea la siguiente sección». Nothing is locked, and badges
  need 85% (W08).

### Badge verdict

**No badge or credential can be earned today, and most would mean the wrong thing if they could.**
- The evidence can't be produced: no exam, no submission, no integrator project, no defense.
- She is never shown a badge's criteria, and the descriptions exist only in English, in a file.
- 19 of 21 competency badges require sections that don't teach the claimed skill. They were mapped
  before the sections were renamed. Example: the SQL badge requires the visualisation and
  profiling sections, not the SQL ones.
- The three level-capstone credentials each need a badge from a *later* level.

(§4)

### Value verdict per level

| Level | Verdict | In one line |
|---|---|---|
| L1 (S01–S13) | **Mostly fulfilled** | The best value for her: rare data discipline from day one, let down by practice that outruns teaching and a closing exam she can't reach. |
| L2 (S14–S26) | **Mixed** | The analyst core (NumPy, pandas, cleaning, joins, EDA, charts) mostly delivers. Three sections are titled for tools they don't use. |
| L3 (S27–S39) | **Mixed, leaning shortchanged** | Interview-grade ideas (SQL, testing, ER, metrics) taught mostly by flipping flags in dicts. |
| L4 (S40–S52) | **Shortchanged for her goal** | Production/SRE material taught by simulation, aimed at a different job. The final project is a self-report form. |

**Portfolio:** 1 of 13 capstones (CP-N4-C) would read well on GitHub, after fixing its run
instructions. The other 12 ship placeholder tests that report green, identical toy data and
no README. None shows SQL, a dataset with a chart, or a dashboard, which is what a Lima recruiter
screens a junior analyst for. The briefs themselves are portfolio-grade (§5.3).

### What to fix first (owner's order, by learner impact)

1. W01: make completion idempotent. One file, `SectionView.tsx`.
2. W02 + W09: serve exams on the static edition; shuffle options; fix the 11 wrong keys; rewrite
   the templated S12/S13 banks.
3. §4: remap `badge_catalog.json` to the current sections and show criteria in Spanish. This is
   an owner decision, under "Ask first".
4. W05 + W03: give We Do a runnable editor, and replace the 38 off-topic playgrounds.
5. §5.3: real tests, fixtures and a README for each capstone; connect each gate section's You Do
   to its capstone.
