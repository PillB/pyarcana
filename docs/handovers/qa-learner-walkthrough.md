# Handover: a learner walkthrough of the whole course, through the QA platform

Owner: Pablo. Written 5 Oct 2026 for a fresh session. Read `AGENTS.md` and `CLAUDE.md` first;
they are binding and outrank this file.

## The goal

Act as a learner who takes PyArcana from section 1 to section 52 in Chromium, driven by
Playwright. On every section, use the course's own QA workspace to file what you find, then
write one report. Answer these three questions with evidence:

1. **Issues, blockers and confusion, per section.**
   - Issues: anything broken.
   - Blockers: anything that stops a learner from going on.
   - Points of confusion: an unexplained term, an instruction that can be read two ways, an
     exercise that is not answerable from what was taught so far, a feedback message that does
     not help.
2. **Badges.** For each badge, does the learner know what they must show to earn it, and does
   the course teach and assess that? The catalogue is `src/lib/eligibility/badge_catalog.json`
   (31 badges, provisional floors such as self-check ≥85%). Also read
   `src/lib/eligibility/badge-specs.ts` and `claim_evidence_contracts/`.
3. **Value to a paying client.**
   - Per section and per level (L1 to L4, `src/lib/capstones/catalog.ts`): would they feel
     fulfilled or shortchanged?
   - Would they feel accomplished by the projects?
   - Could they show those projects on their GitHub profile, as a recruiter or a client would
     judge them?

## Research first, briefly

Before you build anything, find out how others run a walkthrough like this, and cite what you
use. Useful starting points:
- the cognitive walkthrough (Wharton et al.);
- Nielsen's heuristic evaluation;
- persona-based usability testing;
- Playwright's own guidance on test agents and accessibility snapshots.

For the value question, use instructional-design sources:
- constructive alignment (Biggs): do outcomes, activities and assessment line up?
- Open Badges / credential practice: does each badge's evidence back its claim?

Write down which method you chose and why, as the first section of the report.

## How to run the course here

The cloud sandbox cannot reach pyarcana.dev, cdn.jsdelivr.net or unpkg.com. GitHub, npm and PyPI
are reachable.

- **Site:** run the local stack with `workers/billing/e2e/run.sh`. It builds the static site
  from HEAD into a git worktree under `/tmp/pyarcana-e2e/site`, then serves it with
  `wrangler dev` on http://localhost:8787 with a seeded database. After the first run, use
  `run.sh --no-build`. Stop `workerd` by PID (`pgrep -x workerd`); `pkill -f "wrangler dev"`
  kills your own shell.
- **Browser:** Chromium is at `/opt/pw-browsers/chromium`. Pass `executablePath`; do not run
  `playwright install`. Chromium does not trust the sandbox proxy's CA. Pass
  `sandboxTrustArgs()` from `workers/billing/e2e/sandbox-trust.mjs`, as
  `workers/billing/e2e/tour.e2e.mjs` does. That file is a good template for a new script.
- **Python in the browser:** lessons run Pyodide 0.26.2 from jsDelivr, and they import numpy,
  pandas, matplotlib and requests. jsDelivr is blocked here.
  - Download the official full distribution from GitHub instead:
    `https://github.com/pyodide/pyodide/releases/download/0.26.2/pyodide-0.26.2.tar.bz2`.
  - Serve it with `page.route('https://cdn.jsdelivr.net/pyodide/v0.26.2/full/**', …)`, reading
    from local files.
  - Check that `pyodide.js` matches the SRI hash in
    `src/components/course/CodePlayground.tsx`.
  - These are the real files from another host, not a fake. Still report it as a MUST item, per
    the AGENTS.md rule on stand-ins.
  - `requests` cannot reach the network from the browser on any machine; record how each lesson
    handles that.
- **Signed in:** the e2e seed has accounts; see `workers/billing/e2e/seed.mjs` and `flows.e2e.mjs`
  for how they sign in. Some flows (progress sync, badges view, /cuenta) need one.

## The QA platform

- Open it with the footer link "QA interna" (`data-testid="qa-harness-open"`) or
  Ctrl/⌘ + Alt + Q.
- It has three tabs: Reportar, Sesión and Revisión. Its tutorial (`qa-tour-*`) teaches the
  taxonomy: Tipo, Causa probable, Severidad.
- File one report per finding, from the page where it happens, so the captured context (section,
  scroll, window, SHA) is real.
- Export the session from the Sesión tab at the end, and keep the export with the report.
- The code is `src/components/course/QAHarness.tsx` and `src/lib/qa-session.ts`.

## Reuse before writing

`scripts/e2e_max/` already walks the course. Read these specs and reuse their helpers
(`scripts/e2e_max/helpers/`) rather than writing a new crawler:
- `02_sections_tabs_52.spec.ts`
- `03_demos_exercises.shard.spec.ts`
- `04_quiz_options.shard.spec.ts`
- `05_exam_options.shard.spec.ts`
- `13_mouse_keyboard_lesson_flow.spec.ts`
- `14_curriculum_section_forensics.spec.ts`

`npm run test:python-content` executes every lesson snippet under CPython 3.12, and needs
`.venv-content`, which this sandbox lacks. You can build it from PyPI with the pinned versions.
Use it to separate "the code is wrong" from "the browser runtime is wrong".

## Judging, not only clicking

A script can tell you a button works. It cannot tell you a learner understood. For each section,
read the lesson as the persona would. Write the persona at the top of the report: a Spanish-speaking
beginner in Peru, paying, aiming for a first data job. Then answer:
- Could they do the "You Do" exercise from what the section taught?
- Does the self-check test what was taught?
- Does the exam test what the badge claims?

Mark every judgement as an observation (you saw it), an inference (you reasoned it), or a guess.

## Rules for this task

- **Report only.** Do not edit course content. `src/lib/course/sections/`, `tests/` and
  `public/` are protected paths anyway. Put proposed fixes in the report, each with the file and
  the reason.
- **Branch:** work on `claude/qa-learner-walkthrough`, created from
  `claude/gifted-lamport-8ddc84`. Commit the scripts, the report and the QA export. No PR unless
  Pablo asks.
- **Outputs:**
  - the report: `audit/learner-walkthrough/REPORT.md`, in English. Quote Spanish course text
    as is.
  - screenshots and data: `audit/learner-walkthrough/`. Keep screenshots small and few: one
    per finding, not one per step.
- **Personal data:** never commit personal emails, tokens or the owner's private report.
- **Blocked dependencies:** a blocked or rate-limited dependency is a stop, not a retry. Write
  it in the report and go on with what you can do.
- **Order of work:** commit section by section as you go, so a lost container loses little.
  Start with L1 (S01–S13) end to end, commit, then go on.

## The report's shape

1. Method and persona, with sources.
2. Summary, which a non-technical owner can read in 2 minutes:
   - the top blockers;
   - the top confusions;
   - the badge verdict;
   - the value verdict per level.
3. Per section: blockers, issues, confusions (each with severity, where, evidence, proposed fix).
4. Badges: one row per badge with these columns:
   - what it claims;
   - what the learner is told they must show;
   - where the course teaches it;
   - where it is assessed;
   - the gap.
5. Value per level and portfolio check:
   - for each project: would it read well on GitHub, and what is missing (README, tests, data,
     deploy, a demo)?
   - fulfilled or shortchanged, with reasons.
6. What was not covered and why. Every MUST item (stand-ins).

When done, push, and put a line at the top of `REPORT.md`: `STATUS: COMPLETE` with the commit SHA.
The session that started you checks for that line.
