## 1. Method and persona

### Persona

**Lucía, 24, Lima.** Native Spanish speaker; reads English slowly (product names are fine,
English prose and unglossed anglicisms are friction). Finished secondary school and some
university statistics; no programming before S01. Pays for PyArcana monthly from a modest salary,
so time and money matter. Goal: a first data job (data analyst / junior data role) within a year.
Works on a mid-range Windows laptop, sometimes her phone. Takes the course in order, S01 → S52,
and knows only what earlier sections taught her.

### Method chosen, and why

The question is not "does the button work" but "would this learner understand, practise, be
assessed fairly, and come out with something she can show". No single method answers that, so
the walkthrough combines four, each for the part it is good at:

| Part of the question | Method | Source | How it was applied here |
|---|---|---|---|
| Can she do each step from what she knows? | **Cognitive walkthrough**: for each action, the four questions (will she try the right effect, notice the action, connect action to effect, see progress?) | Wharton, Rieman, Lewis & Polson, "The cognitive walkthrough method: a practitioner's guide", in Nielsen & Mack (eds.), *Usability Inspection Methods*, Wiley 1994 | Applied to every theory block, I Do demo, We Do exercise, You Do project, self-check and exam item of every section, against a fixed persona who knows only earlier sections (checked by grepping the earlier sections' text, not from memory). |
| Is the interface clear? | **Heuristic evaluation**, the ten heuristics | Nielsen, "Enhancing the explanatory power of usability heuristics", CHI '94; NN/g "10 Usability Heuristics" (2020 revision) | Used to name UI findings (H1 visibility of status, H2 match with the real world/language, H5 error prevention, H9 recovery from errors, H10 help). |
| Whose eyes? | **Persona-based usability testing** | Cooper, *The Inmates Are Running the Asylum* (1999); Pruitt & Adlin, *The Persona Lifecycle* (2006) | One fixed, written persona (above); every judgement is made as her, not as an expert. |
| Does it actually work in a browser? | **Scripted browser walk** with Playwright, reading the page as text and as the accessibility tree rather than pixels | Playwright docs: locators by role/text, `ariaSnapshot`, and the Playwright test-agent guidance (planner → generator → healer, v1.56) | `scripts/walk.mjs` takes each section as a learner does (Theory → I Do → We Do → You Do → Autocheck), runs the playground in real Pyodide, follows its hint once, answers the self-check once with one wrong answer, then clicks the result card's own button, and records progress after each step, console errors, failed requests and a phone-width overflow check. |
| Do outcomes, activities and assessment line up? | **Constructive alignment** | Biggs, "Enhancing teaching through constructive alignment", *Higher Education* 32 (1996) 347–364 | Per section: learning outcomes ↔ We Do/You Do ↔ self-check ↔ exam. Per badge: claim ↔ where taught ↔ where assessed. |
| Does each badge's evidence back its claim? | **Open Badges / credential practice**: a badge states criteria the earner can read and carries evidence that meets them | 1EdTech *Open Badges 3.0* (2024), `Achievement.criteria` and `evidence`; the catalog's own design constraints («Never exceed the evidence collected») | Section 4 table. |
| Are the exams fair measures? | **Multiple-choice item-writing guidelines** | Haladyna, Downing & Rodriguez, "A review of multiple-choice item-writing guidelines", *Applied Measurement in Education* 15(3), 2002 | Answer-position balance, longest-option cue, plausible distractors; computed over the whole bank, not sampled. |

**Why this mix and not a lab study.** A moderated test with real Peruvian beginners is the gold
standard (Nielsen's "five users" rule), and it is not possible from a sandbox. A cognitive
walkthrough is the standard substitute when users are unavailable, and its known weakness is that
it finds *learnability* problems better than *motivation* ones; the value section (5) is where that
gap is covered, explicitly as judgement.

**Who did the reading.** Each section was read in full (outcomes, theory, I Do, We Do, You Do,
self-check, the 24-item exam bank) by a reading agent working from the same written brief
(`reading/BRIEF.md`), one agent per two or three sections, in order, with the earlier sections on
hand for "taught so far" checks. The strongest claims were then re-checked by hand against the
source before they went into this report (noted where it matters). The browser walk and the QA
filing were run once per level.

**Evidence labels.** Every judgement is marked **[O]** observation (seen in the text, the browser
or the data), **[I]** inference (reasoned from what was seen), or **[G]** guess.
Severity follows the QA tutorial's own rule («¿existe una forma de seguir?», tour step 7):
**blocker** = no way on. Since the platform locks nothing (every section opens regardless of
score), a blocker here means *she cannot complete that activity from what she was taught*;
**high** = there is a way on, but it is costly or not evident (or her record/credential is wrong);
**medium**, **low**.

### What was run

| What | Result | Where |
|---|---|---|
| Existing e2e suites, `workers/billing/e2e/run.sh` (local build of HEAD `2ffbfed`, launch stage forced to beta) | ads 16/16, flows 64/64, usage 23/23 (1 SKIP: real jsDelivr unreachable), qa 15/15, cuenta 7/7, tour 4/4 | `data/baseline-e2e-run.txt` |
| `npm run test:python-content` under `.venv-content` (CPython 3.12, pinned numpy 2.2.6, pandas 3.0.5, scikit-learn 1.6.1, scipy 1.13.1), built here from PyPI | **3244 pass, 0 fail, 118 skip**, 52 sections, environment matches pins | `data/cpython/` |
| Browser walk, `scripts/walk.mjs`, Chromium, 1366×768 and 390×844, account `paid` (Pro) | per section | `data/walk/SXX.json` |
| Persona reading, `reading/BRIEF.md` | per section | `reading/SXX.md` |
| QA workspace: tutorial taken, one report per finding filed from its page, session exported | see §6 | `data/qa-tour.json`, `qa-export/` |

The CPython result matters for reading the rest: **lesson code is correct under the declared
environment**. Where something fails, it is the page, the browser runtime, the order of teaching,
or the assessment, not the Python.
