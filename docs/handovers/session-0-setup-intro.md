# Handover: "Sesión 0", setting up the computer for someone who has never done it

Owner: Pablo. Written 5 Oct 2026 for a fresh, dedicated session. Read `AGENTS.md`, `CLAUDE.md` and
`src/lib/course/sections/AGENTS.md` first; they are binding and outrank this file.

## The gap

Some PyArcana learners barely know how to use their computer. Section 1 (`s01-setup.ts`, 2602
lines) assumes they can download and run an installer without help.
- **Current coverage:** installation is one theory block, "Componentes del stack que vamos a
  instalar" (around lines 271–317). It gives a download URL per tool, then a verification block
  (`python3 --version`, `git --version`, `gh --version`, `code --version`).
- **Thin spots:** "Add python.exe to PATH" is mentioned only in passing (lines 118, 142).
  Windows and macOS/Linux differences are a mapping table, not separate tracks.
- **Visuals:** there are no screenshots. S01 has two SVG figures (`S01-repl-vs-script`,
  `S01-cwd-path`).

Pablo wants a visual, step-by-step intro before Section 1, with screenshots, diagrams and one
action per step. It must cover at least:
1. what a terminal is, and how to find and open it: Windows (Terminal / PowerShell / cmd),
   macOS (Terminal), Linux;
2. downloading and installing Python 3.12 on each OS, including the PATH checkbox, the
   Microsoft Store `python` alias trap, and `py` vs `python` vs `python3`. Then check it works;
3. installing Git, and setting it up in the terminal (`user.name`, `user.email`, default
   branch `main`, line endings on Windows);
4. creating a GitHub account: email check, two-factor authentication (GitHub requires it for
   contributors), and choosing a username that works on a CV;
5. signing in to GitHub from the computer: GitHub Desktop, and/or `gh auth login` (GitHub CLI).
   Then the first clone, edit, commit and push of a practice repository;
6. installing VS Code, opening a folder, and the integrated terminal;
7. a final check that ties it all together, so the learner arrives at Section 1 ready.

His words: research it, compare it to the best practices and tutorials, and "like Ford, copy
the best of all". Then design, architect, strategise, plan, do a root-cause analysis, and build it.

## Phase A: research and root cause

Output: `audit/session-0/RESEARCH.md`, with sources and a date for each claim.

1. **Root causes:** why do beginners fail at setup? Use evidence, not intuition: forum and
   issue data, course post-mortems, beginner-support FAQs. Expected candidates to confirm or
   reject:
   - never opened a terminal, or can't tell it from the Python REPL;
   - PATH not set, or a shell left open from before the install;
   - the Windows Store alias;
   - several Pythons installed;
   - Git Bash vs PowerShell;
   - GitHub refusing a password over HTTPS (tokens since 2021);
   - two-factor authentication;
   - SSH vs HTTPS confusion;
   - antivirus and corporate laptops;
   - non-admin accounts;
   - shared or old computers.
   Rank the causes by frequency and by how badly each one stops a learner.
2. **What the best tutorials do well:** compare at least these, recording for each what it does
   best and what it gets wrong:
   - the Django Girls tutorial (installation, intro to the command line), the benchmark for
     absolute beginners;
   - Software Carpentry's setup page and "The Unix Shell";
   - Microsoft Learn's "Python on Windows for beginners";
   - python.org's "Using Python on Windows" and macOS pages;
   - Real Python's installation guide;
   - GitHub Docs ("Set up Git", "Creating an account", GitHub Desktop, `gh auth login`) and
     GitHub Skills;
   - The Odin Project's foundations;
   - freeCodeCamp;
   - CS50's material for beginners;
   - Spanish-language references a Peruvian beginner would actually find.
3. **How to teach this with pictures:** draw on research on worked examples and on Mayer's
   multimedia principles (signalling, coherence, segmenting). Also cover:
   - screenshot annotation conventions;
   - "what you should see now" checkpoints;
   - recovery boxes;
   - accessibility of screenshots: alt text, and text not only in images.
4. **The "Ford" synthesis:** a table of the best technique per step and where it comes from.

## Phase B: design and architecture

Outputs: `audit/session-0/DESIGN.md` and `audit/session-0/PLAN.md`. For each decision, name the
expert and the benchmark, as AGENTS.md requires.

### Facts already established (5 Oct 2026)

**Do not add a Section 0 to the course manifest.** The course hard-codes 52 sections numbered
from 1 in more than 15 protected tests, among them:
- `tests/adversarial/test_active_v3_curriculum_contract.py` (`range(1, 53)`);
- `content-campaign-progress-fixture.test.ts`;
- `scripts/regression.spec.ts`;
- `scripts/v3_regression_counts.test.mjs`.

The same assumption is in:
- `scripts/v3_invariant_validator.py`;
- `scripts/course_complete_gate.py`;
- `src/lib/course/index.ts` (`totalSections: 52`, `PHASES`);
- badge claims (`badge_catalog.json`: "S01 through S13");
- capstones (`CP-N1-A` needs S01–S04);
- `admin-analytics.ts` (`phaseForSectionIndex`), `admin-api.ts` (`COURSE_SECTION_COUNT = 52`);
- `PdfReport.tsx`;
- the paywall (`gate.ts`: index 0 would always be open);
- many "52 secciones" strings in `src/lib/i18n.ts`.

`src/lib/course/sections/`, `src/lib/course/index.ts`, `tests/` and `public/` are protected
paths (AGENTS.md "Ask first").

**Recommended placement:** a standalone route, for example `src/app/empezar/page.tsx` ("Antes
de empezar" / "Sesión 0"). It should be:
- linked from S01's header and from the dashboard;
- free for everyone (it is the funnel's first step);
- reachable without signing in.

`src/app/` is not protected. Check the exact links and the copy edits with Pablo where they touch
protected files.

**Rendering:** sections have no image block. The only visual is `Figure {id, caption, alt}`,
which points into the inline-SVG registry `src/components/course/figures/index.tsx`
(`FIGURES`, `FIGURE_DATA`, `archetypes/`). Reuse that registry for the diagrams:
- what a terminal is;
- where Python lives and how PATH finds it;
- local repository ↔ GitHub;
- the whole setup as a map.

The page itself can use the existing components: `Callout.tsx`, `CodeBlock.tsx`, `RichText.tsx`
and `FigureFrame` (in `Figure.tsx`).

**Screenshots: OWNER'S DIRECT ORDER (Pablo, 5 Oct 2026).** Sesión 0 uses real screenshots.
- This order supersedes any earlier rule against screenshots. It is decided: do not put it to
  him as a question, and do not quote old rules back to him.
- Annotate every screenshot (an arrow or box on what to click), and give it a caption and alt
  text. Say the key text in the prose too, so a screen-reader user loses nothing.
- Add SVG diagrams (the figure registry) where a diagram explains better than a picture.
- **Storage:** prefer image files imported from `src/` (for example `src/assets/setup/*.png`,
  with `import shot from '…png'`, which the build emits under `_next/static`). That needs no
  protected path. Check that it works with the static export and the `/pyarcana` base path
  (`siteAsset()` in `src/lib/runtime-mode.ts` handles `public/` files only). If it cannot work,
  explain why in PLAN.md. `public/` is still a protected path to ask about.
- **Currency:** give each screenshot a dated "checked on" line, and set up a routine to retake
  them when installers change. Script the browser ones (python.org, git-scm.com,
  github.com sign-up) with Playwright where possible. Installer and terminal screenshots for
  Windows and macOS cannot be taken from this sandbox: list them as needed from Pablo (or
  sourced from official docs with their licence noted), and never fake one.

### Also design
- **OS tracks:** detect the learner's OS, with a visible switch for Windows, macOS and Linux.
  Show one track at a time, never all three mixed.
- **Steps:** each step has one action, a picture, a "deberías ver" checkpoint, and a "si no
  funciona" box for the root causes from Phase A.
- **Progress:** the learner can tick steps, remembered in their browser. Don't touch
  `src/lib/progress-store.ts` (protected); use a separate key.
- **Hand-off to S01:** decide what S01 no longer needs to repeat, as a proposal only. S01 is
  protected.
- **Language:** Spanish (Peru), following `audit/fixer/writing_rules.md`. Define each term at
  first use, sentences of 32 words or fewer, no English outside `code`. Readability
  (Fernández-Huerta) should be at the easy end of 50–70, because this is for absolute
  beginners. Course content is Spanish only; UI strings go through `src/lib/i18n.ts` in all
  three locales, checked by `scripts/i18n_parity_check.mjs`.
- **Accessibility:** alt text on every picture, contrast through `test:ux-gates`, keyboard use,
  and reduced motion.

## Phase C: stop for approval

When the design needs a protected path (`public/`, a section file, `index.ts`, `tests/`), stop:
- write `STATUS: NEEDS APPROVAL — <decisions, each with the options and your recommendation>`
  as the first line of `audit/session-0/PLAN.md`;
- push, and end your turn.

The session that started you relays the decisions to Pablo. His answers come back as an
update to this handover, and a fresh session continues from your branch. So leave everything
committed and pushed, and leave PLAN.md complete enough to resume from. Do the unprotected work
you can before stopping: research, design, SVG diagrams, the page skeleton.

## Phase D: build

Build what was approved.
- **Tests:** a real test for each piece (no tautologies):
  - unit tests in the existing runner (`scripts/run_billing_tests.mjs`, client group) for any
    logic, such as OS detection or step state;
  - a Playwright check of the page at desktop and phone sizes (pattern:
    `workers/billing/e2e/tour.e2e.mjs`, launched with `sandboxTrustArgs()` and
    `/opt/pw-browsers/chromium`).
- **Visual check:** look at the screenshots of the page yourself, not just the test result.
- **Gates:**
  - `npm run test:v3`;
  - `npm run test:ux-gates`;
  - `node scripts/complexity_gate.mjs` (ceiling 15);
  - `node scripts/run_billing_tests.mjs`;
  - `npx tsc --noEmit`;
  - eslint.
- **Unchanged course:** the 52-section suite must stay green.
- **Real installs:** do not claim an installer step was tested unless you ran it. You cannot
  install on Windows or macOS from this sandbox. List every step that needs a hand check by
  Pablo on a real Windows and Mac machine, as a checklist in the report.

## Rules

- **Branch:** `claude/session-0-setup-intro`, created from `claude/gifted-lamport-8ddc84`.
  Commit and push after each phase. No PR unless Pablo asks.
- **Status line:** set `STATUS: COMPLETE <sha>` or `STATUS: BLOCKED <reason>` as the first line
  of `audit/session-0/PLAN.md` when done or stuck.
- **Never commit** personal emails, tokens or the owner's private report.
- **Blocked dependencies:** a blocked or rate-limited dependency is a stop, not a retry. Write
  it down and go on.
- **Stand-ins:** report every stand-in, placeholder or unverified step as a MUST item.

The sandbox cannot reach pyarcana.dev, jsDelivr or unpkg. GitHub, npm and PyPI are reachable. To
see the site, run the local stack with `workers/billing/e2e/run.sh` (http://localhost:8787). Stop
`workerd` by PID: `pkill -f "wrangler dev"` kills your own shell.
