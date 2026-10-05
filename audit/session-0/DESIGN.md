# Sesión 0: design

Written 5 Oct 2026, for Pablo. It builds on `audit/session-0/RESEARCH.md` (cited as R§n) and the
handover `docs/handovers/session-0-setup-intro.md`. For each decision it names the expert who would
review it, the published benchmark they would use, the options considered and the trade-off.

**What exists after this round:**
- the route `/empezar`;
- the logic in `src/lib/setup/`;
- the components in `src/components/setup/`;
- the screenshot pipeline (`src/assets/setup/`, `scripts/setup_screenshots.mjs`,
  `scripts/setup_shots_index.mjs`);
- the prose audit (`scripts/setup_intro_prose_audit.py`);
- the tests (`src/lib/cloud/__tests__/setup-intro.test.ts`, `workers/billing/e2e/setup.e2e.mjs`).

**What does not exist yet:** any screenshot. See §7 and the MUST items in `PLAN.md`.

## 1. Placement: a standalone route, outside the 52 sections

**Decision:** Sesión 0 is `src/app/empezar/page.tsx`, at `/empezar`.
- It is linked from the dashboard hero and from the top of Section 1 (`SetupIntroLink`).
- It is free.
- It opens without signing in.
- It touches no course count.

**Why:**
- More than 15 protected tests, gates and claims hard-code 52 sections numbered from 1. The
  handover lists them.
- A "Section 0" would also open at index 0 under the paywall (`gate.ts`). It would also enter the
  badge and capstone arithmetic.
- A route outside the manifest changes none of that. It also gives the funnel's first step a URL of
  its own that can be shared.

**Expert and benchmark:**
- Django Girls keeps "Installation" as its own chapter before any code (R§2). So do Software
  Carpentry ("Setup" is a page apart from every lesson) and The Odin Project ("Installations" is a
  separate lesson).
- All three treat setup as a prerequisite page, not lesson 0 of the syllabus. A curriculum designer
  holding the Carpentries' structure would accept this placement.

**Trade-off, stated:**
- Sesión 0 does not appear in the sidebar and earns nothing in the course record.
- A learner who skips it is not stopped. That is deliberate: the S01 link says "¿Primera vez
  instalando programas?" and does not gate.
- The cost: nothing forces the learners who need it most to find it. The dashboard link is shown
  to everyone, returning learners included, for that reason (a new computer resets the problem).

**Protected paths:** none needed.
- `src/app/`, `src/components/` and `src/lib/i18n.ts` are not protected.
- The S01 link is rendered by `SectionView.tsx`, a component, not by the section file.

## 2. Order of the parts

**Decision:** the order is:
1. Terminal
2. Python 3.12
3. VS Code
4. GitHub account
5. Git
6. Connect and first push
7. Final check

The handover listed VS Code sixth and the account after Git.

**Why (R§6 points 5 and 6):**
- **VS Code before Git.**
  - Git for Windows' default editor is Vim. The installer itself says Vim is the default "only for
    historical reasons" (R§1.1 ¶12).
  - A learner who runs `git commit` without `-m` cannot leave Vim.
  - The installer offers VS Code only if VS Code is already installed.
  - Django Girls installs the code editor right after Python, before anything else.
- **The account before Git's configuration.**
  - `user.email` should be GitHub's private noreply address, which exists only once the account
    does. The Odin Project's "Setting up Git" does exactly this (R§2).
  - It also designs away `GH007: Your push would publish a private email address`. A learner whose
    account blocks pushes that expose their email would hit that error on the first push.

**Trade-off:**
- The learner leaves the terminal for the browser in Part 4, then comes back.
- Keeping the handover's order would mean either Vim, or a second visit to the Git configuration.
  One context switch is cheaper.

## 3. One operating-system track at a time

**Decision:**
- The page shows one track: Windows, macOS or Linux.
- It guesses the track from the browser (`detectOs` in `src/lib/setup/os.ts`) and says which it did:
  "Lo detectamos…", "Elegiste…" or "No pudimos detectar…".
- A visible switch, built from three native radio buttons, changes the track at any time. The choice
  is remembered.
- When nothing identifies the system (and on phones), the track falls back to Windows.

**Expert and benchmark:**
- The Carpentries' setup page uses one tab per operating system. So does Microsoft Learn's install
  guidance.
- Mayer's coherence principle: material the learner does not need competes for attention with the
  material they do (R§3).
- S01's mapping table is the counter-example the handover names. It mixes three systems in each row.

**Detection details, each tested with real user-agent strings:**
- Client Hints come first, then `navigator.platform`, then the user agent.
- Android is a phone, never "Linux".
- An iPad that requests the desktop site reports a Mac with a touch screen, and is treated as a
  phone.
- Chrome OS gets the Linux track.

**Trade-off:**
- The prerendered HTML shows the Windows track. After hydration a macOS or Linux learner sees their
  track replace it, a brief flash.
- Rendering all three tracks and hiding two before paint would remove the flash. It would need an
  inline script, and it would put three tracks' text into every no-JS read.
- The fallback being Windows is a judgement: Windows dominates desktop share in Peru (R§5, not
  measured for PyArcana's learners).

## 4. The anatomy of a step

**Decision:** every step has:
- one action as its title, in the imperative;
- a short body;
- at most one command, with a copy button;
- an optional screenshot or diagram;
- a "Deberías ver" checkpoint, which is **required** and enforced by a unit test;
- an optional "Si no funciona" disclosure, made of symptom → numbered actions;
- a "Hecho" checkbox.

**Expert and benchmark:**
- **John Carroll's minimalism** (*The Nurnberg Funnel*, 1990). Its four principles are: choose an
  action-oriented approach; anchor the tool in the task domain; support error recognition and
  recovery; support reading to do, study and locate. "Si no funciona" is the error-recovery
  principle, and the checkpoint is error recognition.
- **Hans van der Meij's** studies of screenshots in software tutorials (R§3) put a screenshot next
  to the action it shows.
- The handover's "deberías ver" requirement matches the main finding of the 24-session study in
  R§1.1 ¶12: beginners could not tell whether an installation had worked. The test was red until 9
  steps got a checkpoint. It enforces the contract, not a count.
- **Mayer's segmenting principle:** one action per step, numbered `parte.paso`. Recovery boxes
  start closed (`<details>`), so the main path stays short.

**The recovery boxes cover the ranked causes of R§1.2:**

| Rank | Cause | Where |
|---|---|---|
| 1 | Terminal vs Python prompt | step 2.x "Entra a Python y vuelve a salir", and the `>>>` fix |
| 2 | PATH and a stale terminal | the PATH checkbox step, "Cierra la terminal y abre una nueva", and the fix boxes of every `--version` check. On Windows, after the Git and `gh` installs, VS Code must be restarted whole. That is stated, not assumed |
| 3 | Store alias | a step of its own, plus the exact "Python was not found" symptom |
| 4 | Password refused over HTTPS | designed away by `gh auth login`'s browser flow, with a fix box for the password prompt (`gh auth setup-git`) |
| 5 | Several Pythons | `py --list` on Windows; Apple's 3.9.6 on macOS (`Update Shell Profile.command`); deadsnakes on Ubuntu releases other than 24.04 |
| 7 | Vim | designed away (§2) |
| 8 | Non-admin | the 3.12 Windows installer's admin checkbox; the macOS `.pkg` needing an administrator; Git for Windows' elevation |
| 9 | 2FA lock-out | a step of its own for the recovery codes |
| 10 | SSH | never offered; one fix box if chosen by mistake |
| 11 | Antivirus, managed laptops | "Antes de empezar" and the installer fix box: ask IT, never switch the antivirus off |
| 12 | Shared computers | `gh auth logout`, and the plain-text credential warning |
| 13 | Keyboards | how to paste in each terminal (Part 1 intro) |
| 14 | macOS certificates | a step of its own |

Rank 6, Git Bash vs PowerShell, is avoided: the page names one shell per system.

## 5. Python: which installer, which version

**Decision:**
- **Windows:** the classic `python-3.12.10-amd64.exe`, with `Add python.exe to PATH` ticked, then
  the Store aliases turned off.
- **macOS:** `python-3.12.10-macos11.pkg`, then `Install Certificates.command`.
- **Linux:** Ubuntu 24.04's own `python3` (3.12.3) plus `python3-venv` and `python3-pip`. Any other
  Ubuntu release gets `python3.12` from the deadsnakes PPA, beside the system Python and never
  replacing it.
- The checkpoint tells the learner the version "debe empezar con 3.12". It does not pin a patch
  number.

**Why:**
- The course runs on 3.12 (`.venv-content`).
- 3.12.10 is the last 3.12 with Windows and macOS binary installers (R§5.1).
- The handover asked for the PATH checkbox, the Store alias trap and `py` vs `python` vs
  `python3`. Those are the classic installer's realities.
- The new Python install manager has no PATH checkbox. It works through app execution aliases,
  whose open bugs in 2026 (R§5.2, pymanager #370, #380) are exactly the failure this page exists
  to prevent.

**Expert and benchmark:**
- python.org's "Using Python on Windows" (3.12 edition). It is the authority for the installer's
  options and for "Modify" as the after-the-fact PATH fix.
- PEP 693 (the 3.12 release schedule).

**Trade-offs (and decisions for Pablo):**
- 3.12.10's binaries receive no security fixes after April 2025. For a learner's own laptop running
  course exercises the risk is low, but it is not zero.
- If that is unacceptable, the thing to change is the course's 3.12 pin (3.13 or 3.14), not this
  page. That is Pablo's call, and is listed in `PLAN.md`.
- The classic installer is deprecated since 3.14. It will keep working for 3.12, but python.org's
  own pages now recommend the install manager. A learner who already has the manager is told
  nothing about it; mixing the two causes conflicts (R§5.2). A fix box for "I already installed
  the Python install manager" is a candidate for the first hand-check round.
- deadsnakes carries "no guarantee of timely updates in case of security problems" (R§5.1). It is
  offered only off the 24.04 path.

## 6. Signing in: `gh auth login`, not GitHub Desktop

**Decision:** one route for all three systems:
1. install `gh`;
2. `gh auth login` (GitHub.com → HTTPS → Y → Login with a web browser);
3. `gh repo create practica-pyarcana --public --add-readme --clone`;
4. edit `README.md` in VS Code;
5. `git status`, `git add`, `git commit -m`, `git push`;
6. `gh repo view --web`.

**Options:**
- **GitHub Desktop**, which the research recommended as primary. GitHub's own 2026 beginner journey
  uses it, and its browser sign-in designs away the password failure.
- **`gh`**: the CLI route.

**Why `gh`:**
- Section 1 already requires `gh` and logs in with it ("lo usarás en T3"). With Desktop the learner
  would install two tools and sign in twice.
- Linux has no official Desktop, so it would need a second route.
- The course teaches `git add/commit/push` at the command line, and Desktop hides exactly those
  commands.
- `gh`'s browser flow removes the password failure just as Desktop's does (R§5.9). It also sets
  itself as Git's credential helper.

**Expert and benchmark:**
- Greg Wilson and the Carpentries' "Version Control with Git". It teaches Git at the command line
  to novices, on the argument that the commands are what transfer.
- GitHub Docs "Set up Git" lists `gh auth login` as the CLI route.

**Trade-offs:**
- Four prompts in English with jargon (protocol, credentials). The page pre-answers all four in
  order, and a screenshot of the device-code page is specified.
- The plain-text token fallback gets its own fix box, and so does the shared-computer risk.
- GitHub Desktop stays a valid choice for Pablo. Switching is a content change in Part 6 only.

## 7. Screenshots

**Owner's order (5 Oct 2026):**
- Sesión 0 uses real screenshots: annotated, captioned, with alt text and a dated "checked on"
  line.
- Never a fake one.

**Decisions:**
- **A screenshot is first a specification.** `SETUP_SHOTS` in `content.ts` holds 19 specs. Each
  has:
  - an id;
  - the system it belongs to;
  - who can take it (`browser-script` for public web pages, `owner-capture` for installers and
    desktop apps);
  - a `brief` for whoever takes it;
  - the learner-facing `alt` and `caption`.
- **A capture is a PNG plus a record.** The PNG goes in `src/assets/setup/<id>.png`. The record goes
  in `src/assets/setup/shots.json`: `checkedOn`, the size, and the box around what to click, in
  percent. `scripts/setup_shots_index.mjs` regenerates the import index and `--check` refuses a
  picture without a record, or a record without a picture. The unit tests check the same.
- **The box is drawn over the image in SVG, not baked in.**
  - A retake needs only the new PNG and a re-measured box, and the script measures it from a CSS
    selector.
  - The cost: an owner capture's box must be measured by hand, in percent of the image.
  - The box is two strokes, dark under amber, so it reads on light and dark screenshots. It is
    `aria-hidden`, because the alt already names what it marks.
- **Storage.**
  - PNGs are imported from `src/`, so the build emits them under `_next/static/media` with a
    content hash and the base path applied by Next itself.
  - No `public/` (a protected path), and no `siteAsset()`, which covers `public/` only.
  - Verified: a static export with `NEXT_PUBLIC_BASE_PATH=/pyarcana` served the picture from
    `/pyarcana/_next/static/media/…png`. The details are in `PLAN.md` §Verification. The test build
    used a capture of a local fixture page, made by the real capture function and never committed.
- **No capture, no picture.** Until a capture exists, `Screenshot` renders nothing and the step's
  text carries the instruction alone. It does not render a drawing that looks like an installer:
  that would be the fake the order forbids.
  - Every learner-facing fact a picture shows is also in the step text. That is WCAG 2.2 SC 1.1.1,
    and the reason an absent picture costs clarity but no information.
- **Terminal output is text, never a screenshot.**
  - WCAG 2.2 SC 1.4.5 (images of text): the learner must be able to compare, copy and search what
    the terminal says.
  - Django Girls does the same.
  - So "deberías ver" shows the expected lines in a `<pre>`, and screenshots are kept for windows,
    dialogs and web pages, where the layout is the information.
- **Currency.**
  - `node --import tsx scripts/setup_screenshots.mjs --report` lists each spec as missing, stale
    (older than 120 days, `SHOT_MAX_AGE_DAYS`) or current.
  - `--take` re-captures every `browser-script` spec with Playwright and re-measures its box.
  - The routine: run `--report` monthly, and whenever python.org, git-scm.com, GitHub or VS Code
    change their pages. The report is not a CI gate on purpose: a gate that turns red with the
    calendar fails builds that changed nothing.
- **Licences.**
  - A picture is either our own capture of a product's screen, or a screenshot reused from the
    product's official documentation under that documentation's open licence.
  - Reuse is allowed only under a licence that permits commercial use with attribution
    (`REUSE_LICENCES` in `src/lib/setup/screenshots.ts`): CC BY 4.0 (GitHub Docs, Microsoft Learn,
    Windows Terminal docs), CC BY 3.0 US (VS Code docs), the PSF License (Python docs), and CC BY-SA
    4.0 under the condition below.
  - The attribution is printed under the picture: source and licence linked, changes ("recortada"),
    and the date it was taken. That is what CC BY 4.0 §3(a) asks for.
  - **CC BY-SA 4.0 is allowed only for a picture shown unmodified**: no crop, and no box of ours over
    it. The validator enforces this.
    - Shown as-is beside our text, the picture is part of a collection, which share-alike does not
      reach (Creative Commons FAQ).
    - A crop or an overlay could make it an adaptation.
    - It is used once, for the Python PATH checkbox (Django Girls). Owner decision D6 in `PLAN.md`.
  - NonCommercial licences are refused, because Pro is paid. That rules out Missing Semester, The
    Odin Project, Happy Git with R and Pro Git (RESEARCH.md §8).
  - A reused picture brings its own alt and caption. It shows someone else's screen (another folder,
    Python 3.13 instead of 3.12), and the caption says so instead of pretending otherwise.
  - Not verified: whether GitHub's, the PSF's or Microsoft's trademark and brand guidelines restrict
    instructional screenshots of their products. This is a SHOULD item for Pablo in `PLAN.md`. The
    reused images come with a copyright licence, which is not a trademark licence.

**Blocked, stated (AGENTS.md: a blocked dependency is a stop):**
- The sandbox's network policy refused python.org, git-scm.com, code.visualstudio.com and
  github.com pages. Both curl and Chromium were refused: `ERR_TUNNEL_CONNECTION_FAILED`, then a 403
  from the proxy.
- So none of the 3 `browser-script` captures could be taken.
- Of the 16 `owner-capture` specs, 8 were filled by reusing openly licensed screenshots (second
  round, `PLAN.md` MUST 1). The other 8 need a real Windows or Mac.
- `PLAN.md` lists the 11 still missing as MUST items.

## 8. Diagrams

**Decision:** four diagrams, drawn by the course's own figure archetypes, in the course's own frame
(`FigureShell`, split out of `FigureFrame`):

| Diagram | Archetype | What it shows | What prose did badly |
|---|---|---|---|
| `setup-map` | stack | the seven parts, bottom-up | which piece needs which |
| `setup-terminal` | flow | type → shell → program → text reply | that the terminal is a messenger, not a brain |
| `setup-path` | decision | the shell searching the PATH folders in order | a search order and its "no se reconoce" failure |
| `setup-local-remote` | table | the same project on your computer and on GitHub, `git push` one way and `git clone / git pull` the other | two places and a direction |

**Why a separate registry (`src/lib/setup/figures.ts`):**
- `tests/adversarial/figure-data-schema.test.mjs` requires every entry in
  `src/components/course/figures/data` to hang on one of the 52 sections. That rule is right for
  the course.
- Sesión 0 is not a section, so its data lives beside its content, and its own unit test applies
  the same box-fit arithmetic.

**Expert and benchmark:**
- Mayer's signalling and spatial-contiguity principles.
- The course's own rule D5: "each figure removes work the prose was doing badly, or it is not
  added".
- The archetypes already honour reduced motion (`useFigureSteps`) and the measured contrast roles
  (`INK`).

## 9. Progress

**Decision:**
- Ticks live under their own key, `pyarcana:sesion0:v1`, as `{v, os, done[]}`.
- Invalid state reads as empty and is never overwritten by a read.
- Unknown well-formed ids are kept, so a newer page's ticks survive an older tab.
- Storage that throws reads empty, and the page says "tus marcas se perderán".

**Why:**
- AGENTS.md invariants: course progress (`python-ds-progress`) must not change, and "additive media
  never alters completion state".
- `src/lib/progress-store.ts` is protected.
- The end-to-end check asserts that the course key stays untouched.

**Trade-off:** ticks do not sync across devices, unlike course progress for signed-in learners.

## 10. Language and readability

**Decisions:**
- Spanish (Peru), voseo-free tú, short sentences.
- Every term is defined where it first appears: terminal, prompt, shell, ruta, PATH, REPL, editor,
  terminal integrada, Git, commit, rama, GitHub, verificación en dos pasos, credencial,
  repositorio, clonar, README, certificados, lanzador.
- English appears only inside `code`. That includes the literal labels on screen, so the learner
  can match them.
- UI strings (25 keys) go through `src/lib/i18n.ts` in es-PE, es-ES and en, checked by
  `scripts/i18n_parity_check.mjs`. The content is Spanish only, like the course.

**Measured** by `python3 scripts/setup_intro_prose_audit.py`, which imports the course audit's own
formulas:
- **Hard checks** (exit 1): no sentence over 32 words, no English outside `code`, paired ¿? ¡!, no
  doubled words, no authoring residue. Result: 0 failures over 416 strings.
- **Fernández-Huerta:** 81 for the page and 82 for the teaching prose alone.
  - The handover asked for "the easy end of 50–70". The page is easier than that band.
  - S01 itself scores 77.5 and S02 75.8 (same formula, `prose_quality_audit.py`), so the course
    already sits above 70.
  - The writing rules (E) call the band "a signal for ranking passages, never proof". For
    procedural one-action steps, the short sentences that lift the score are the design (Carroll).
  - The risk the rules name for a high score is under-teaching. That was checked by hand against
    A1–A2: each term says what it is and why it matters here.
  - Lengthening sentences to land in the band would be G3's regression ("a longer translation is
    not a better one").
  - Stated as a deviation, not hidden.

**Not done:** the Codex authoring and critique loop of the reviewer-fixer round (AGENTS.md) was not
run. It is built for the 52 sections, and `tools/fixer/*` does not read this page. A human or Codex
read of the Spanish is a SHOULD item in `PLAN.md`.

## 11. Accessibility

- **The OS switch:** native radio inputs in a fieldset with a legend. Arrow keys, focus ring
  (`has-[:focus-visible]`), and a 44px target (`min-h-11`).
- **"Hecho":** a native checkbox with a label.
- **"Si no funciona":** native `<details>`, opened with Enter or Space.
- **Landmarks:** `<main>`, `<nav>` for the parts list, and `<section>` with a heading for each part.
- The progress line is `role="status"`.
- **Screenshots:** alt text on every one (each over 40 characters, tested), the box `aria-hidden`,
  and every instruction also in the text.
- **Diagrams:** the archetypes' `<title>`, plus the frame's visually hidden alt.
- **Reduced motion:** the figure steps cut instead of animating (`useFigureSteps`). The page has no
  other motion.
- **Contrast:** the page reuses the course's tokens and Callout palette. `npm run test:ux-gates`
  runs the course's static contrast checks.
  - The amber box over screenshots is a fixed colour on purpose, because it sits on a picture, not
    on the theme.
  - **Not done:** an axe-core run against `/empezar` (the course's readability spec walks sections
    only).

## 12. Hand-off to Section 1: what S01 no longer needs to repeat (proposal only)

`src/lib/course/sections/s01-setup.ts` is protected. This is a proposal for Pablo, and nothing in
S01 was changed.

| S01 now | Proposal | Why |
|---|---|---|
| "Componentes del stack que vamos a instalar" ¶4 (how to open the terminal on each system) | Replace with one line: "Si nunca abriste la terminal, empieza por la Sesión 0" plus a link | Sesión 0 Part 1 teaches it with a picture and a checkpoint |
| Same block ¶5 (installing Git and `gh`, the download URLs, `gh --version`) | Shorten to the verification only (`git --version`, `gh auth status`) | Parts 5 and 6 install and sign in |
| The verification code block (Python, Git, `gh`, `code`, extensions) | Keep, but point at Sesión 0 Part 7 as the same check | It is S01's own contract and stays useful |
| "Add python.exe to PATH" mentioned in passing (T1-A ¶2 and its callout) | Keep the one-line reminder; drop "marca Add python.exe to PATH" from the callout | Taught as a step in Part 2 |
| The Windows/macOS/Linux mapping table | Keep | It is about venv activation and exit codes, which Sesión 0 does not teach |
| `python` vs `python3` advice | Keep | S01 is where `-m pip` makes it matter |

The concepts S01 should **not** assume from Sesión 0, because Sesión 0 does not teach them: venv,
pip, exit codes, the cwd/PATH distinction beyond "the terminal searches a list of folders".

## 13. Not done in this round, by decision or by block

- **No screenshots.** Blocked (§7). These are MUST items.
- **No installer step was run.** The sandbox cannot install on Windows or macOS. Every installer
  screen and label comes from source code and docs (R§7). Pablo's hand-check list is in `PLAN.md`.
- **No S01 edits.** The section file is protected; §12 is a proposal.
- **No axe run, and no Codex prose round.** §10 and §11.
- **Pre-existing failure.** The complexity gate fails at the base commit `e161435`: 34 functions
  over the ceiling against a baseline of 33. This round adds none.
