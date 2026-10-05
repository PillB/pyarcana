STATUS: COMPLETE e712dfb — page, tests and pipeline built; 8 of 19 screenshots in place, reused from official docs and Django Girls under open licences; 11 still missing (blocked: sandbox network for 3, a real Windows/Mac for 8). See §5, MUST 1.

# Sesión 0: plan, state and hand-off

Branch `claude/session-0-setup-intro`, cut from `claude/gifted-lamport-8ddc84` at `e161435`. Owner:
Pablo. Research: `RESEARCH.md`. Decisions and their reasons: `DESIGN.md`. This file says what was
done, what was verified and how, what is left, and what Pablo must decide or do.

## 1. Phases

| Phase | State | Output |
|---|---|---|
| A, research and root cause | done | `RESEARCH.md`: 70 sources, dated, the blocked ones marked |
| B, design and architecture | done | `DESIGN.md`, this file |
| C, stop for approval | not needed | no protected path was required (§3) |
| D, build | done; 8 of 19 screenshots reused under open licences, 11 still missing (§5, MUST 1) | the files in §2 |

## 2. What was built

| File | What it is |
|---|---|
| `src/app/empezar/page.tsx` | The route `/empezar`: free, opens without signing in, prerendered |
| `src/components/setup/SetupIntro.tsx` | The page: intro, "Antes de empezar", the OS switch, progress, map, parts, way on to S01 |
| `src/components/setup/OsSwitch.tsx` | Three native radio buttons; says whether the track was chosen, detected or guessed |
| `src/components/setup/SetupStepView.tsx` | One step: action, command, screenshot or diagram, "Deberías ver", "Si no funciona", "Hecho" |
| `src/components/setup/Screenshot.tsx` | An annotated, captioned, dated capture; renders nothing when no capture exists |
| `src/components/setup/SetupFigure.tsx` | A diagram in the course's figure frame |
| `src/components/setup/SetupIntroLink.tsx` | The way in, on the dashboard and at the top of S01 |
| `src/lib/setup/os.ts` | OS detection (pure) |
| `src/lib/setup/progress.ts` | Ticks under `pyarcana:sesion0:v1`; fail-safe parsing; never touches `python-ds-progress` |
| `src/lib/setup/content.ts` | The 7 parts and 60 steps (37 on macOS, 40 on Windows, 33 on Linux), and the 18 screenshot specs |
| `src/lib/setup/figures.ts` | The 4 diagrams, as archetype data |
| `src/lib/setup/screenshots.ts`, `types.ts` | Types and validators |
| `src/assets/setup/` | Where captures go: `index.ts` (generated), `shots.json` (records, empty), `README.md` (how to capture) |
| `scripts/setup_screenshots.mjs` | `--report` (missing, stale, current) and `--take` (Playwright captures of the browser pages) |
| `scripts/setup_shots_index.mjs` | Regenerates `index.ts`; `--check` refuses an inconsistent folder |
| `scripts/setup_intro_prose_audit.py` | The writing-rules audit for this page |
| `src/lib/cloud/__tests__/setup-intro.test.ts` | 29 unit tests, registered in `scripts/run_billing_tests.mjs` (client group, floor 29) |
| `workers/billing/e2e/setup.e2e.mjs` | The Playwright check at 1280×800 and 390×844, added to `run.sh` |

Changed files that already existed:
- `src/components/course/Figure.tsx`: `FigureShell` split out of `FigureFrame`, with the same markup.
- `src/components/course/Dashboard.tsx` and `SectionView.tsx`: one `<SetupIntroLink>` each. No
  added branching: the complexity gate's count is unchanged.
- `src/lib/i18n.ts`: 25 keys × 3 locales.
- `scripts/run_billing_tests.mjs`: one suite.
- `workers/billing/e2e/run.sh`: one suite.

## 3. Protected paths

None changed. `git diff --name-status e161435` lists no path under:
- `src/lib/course/sections/`, `src/lib/course/index.ts`;
- `src/lib/progress-store.ts`, `src/lib/progress-sanitize.ts`;
- `prisma/migrations/`, `public/`, `tests/`;
- `scripts/*regression*`, `scripts/static_public.spec.ts`;
- `learning_roadmap_52_V3.md`, `.github/workflows/`, `CODEOWNERS`, `AGENTS.md`.

The handover expected a stop for `public/` (screenshots) or S01 (links). Neither was needed:
- **Screenshots** are imported from `src/assets/setup` and emitted under `_next/static`. This was
  verified under the `/pyarcana` base path (§4).
- **The S01 link** is drawn by `SectionView.tsx` (a component) when `section.index === 1`. The
  section file is untouched.
- **The S01 copy edits** that Sesión 0 makes possible are a proposal only: DESIGN.md §12, decision
  D3 below.

## 4. Verification

Run on this branch on 5 Oct 2026, in the Claude Code cloud sandbox: Node 22.22, Chromium at
`/opt/pw-browsers/chromium`, Python 3.11.

**Unit tests:** `node scripts/run_billing_tests.mjs --only client` runs `setup-intro.test.ts`, 29
tests. They cover:
- OS detection on real user-agent strings: Android is not Linux; an iPad posing as a Mac is a phone;
  Client Hints win;
- ticks: they round-trip; broken state reads empty and is not overwritten; storage that throws;
  their own key;
- screenshot records and the box geometry;
- the content contract:
  - unique step ids that the store accepts;
  - every system gets every part, and no system's steps leak into another's;
  - the top three root causes are present on Windows;
  - **every step has a "Deberías ver"**;
  - every referenced picture and diagram exists, and every spec is used;
  - alt text over 40 characters;
  - diagram text fits its boxes and carries no markdown;
  - no DNI-shaped number;
- the screenshot scripts' pure functions.

**Each new test was seen to fail:**
- OS detection, with the mobile check broken: 2 failures.
- Parsing, with the array check broken: 1 failure.
- The checkpoint rule: it failed on the 9 real steps that lacked a checkpoint, before they got one.
- The markdown rule: a backtick put back into a headline.
- D2: the 8-digit noreply example put back.

**End-to-end** (`workers/billing/e2e/setup.e2e.mjs`): 28 checks pass. They ran against a static
export built with `NEXT_PUBLIC_BASE_PATH=/pyarcana` and served under `/pyarcana/`. They cover:
- no horizontal scroll at 1280 and 390;
- all 4 diagrams draw;
- a Mac user agent gets the macOS track and is told it was detected;
- no foreign steps on the track;
- no script errors;
- the S01 button opens Section 1 (followed, not pattern-matched);
- the keyboard: arrows move the switch, and Enter opens "Si no funciona";
- a tick moves the counter and survives a reload, as does the chosen track;
- the stored key is `pyarcana:sesion0:v1`, with `python-ds-progress` untouched;
- blocked storage: the page says ticks won't stay, and still works;
- a phone gets the "necesitas una computadora" note;
- the dashboard shows the link, S01 shows it at the top, S02 does not, and the S01 link opens
  `/empezar`.

**The screenshot pipeline, end to end:**
- In a scratch copy of the tree (never committed), `captureShot()` captured a local fixture page,
  labelled on screen as "not a screenshot of any real product".
- `setup_shots_index.mjs` indexed it, and the static export emitted it as
  `/pyarcana/_next/static/media/py-release-files.52fcc0fa.png`.
- With `EXPECT_SHOT=1`, the e2e check confirmed the image loads from there, with its alt, its box
  and "Comprobado el 5 oct 2026".
- So a real capture dropped into `src/assets/setup/` will work under the GitHub Pages base path
  without `public/`.

**Visual check:** I looked at captures of the page myself: desktop light, phone dark, a step with
its recovery box open, the PATH diagram, and the step carrying the fixture capture. That review
found one defect, now fixed and tested: literal backticks in SVG diagram text.
- Not a defect: on a phone, the decision diagram scrolls sideways inside its own frame, as every
  course figure does (`FigureFrame`'s scroll container). The page itself does not scroll sideways.

**Prose:** `python3 scripts/setup_intro_prose_audit.py` finds 0 hard failures over 416 strings.
Fernández-Huerta is 81 for the page and 82 for the teaching prose; S01 scores 77.5. DESIGN.md §10
explains why the page is above the handover's 50–70 band and was not padded to fit it.

### 4.1 Gate results

Every gate the handover and AGENTS.md list, on this branch. "Base" means the same command on a clean
worktree of `e161435`.

| Gate | Result | Note |
|---|---|---|
| `npm run test:v3` | pass | the 52-section structure is unchanged |
| `npm run test:adversarial:node` | pass | includes `figure-data-schema.test.mjs` and the billing runner |
| `npm run test:adversarial:py` | pass | |
| `npm run test:course-complete` | pass | |
| `node scripts/preservation_sentinel.mjs` | pass | nothing deleted |
| `node scripts/run_billing_tests.mjs` (all groups) | pass | client group: `setup-intro` 29/29 (floor 29); lint group: 0 complexity offenders |
| `npm run lint` | pass, 7 warnings | the same 7 as base; none in new files |
| `npx tsc --noEmit` | pass | |
| `npm run test:ux-gates` | **fails, pre-existing** | stops at `test:first-use-all`, which fails identically on base (§8) |
| `test:glossary-intro`, `test:glossary-coverage`, `test:i18n-parity`, `test:a11y-contrast`, `test:code-syntax-contrast` | pass | the rest of `ux-gates`, run one by one; i18n parity is 1005 keys in each locale |
| `npm run test:no-identifiers` | **fails, pre-existing** | 8 values in S03 and S09, identical on base (§8). Sesión 0 has its own D2 test |
| `node scripts/complexity_gate.mjs` | **fails, pre-existing** | 34 over against a baseline of 33, identical on base (§8); no new offender |
| `python3 tools/fixer/ledger.py --check` | **fails, pre-existing** | "LEDGER.md is stale" on a pristine base checkout too. Not regenerated here: the ledger belongs to the reviewer-fixer round, and nothing in it changed |
| `npm run test:python-content` | not run | needs `.venv-content` (Python 3.12), absent in this sandbox; no lesson snippet changed |
| `node scripts/setup_shots_index.mjs --check` | pass | 0 captures, consistent |
| `python3 scripts/setup_intro_prose_audit.py` | pass | 0 hard failures |
| `workers/billing/e2e/setup.e2e.mjs` | pass, 28/28 | static export with base path `/pyarcana` and one fixture capture (§4) |

## 5. MUST items: stand-ins, blocks and unverified steps

AGENTS.md: "Report every stub, placeholder, stand-in or fake … as a MUST item: where it is, why it
exists, what it hides, and the decision needed."

**MUST 1. 11 of 19 screenshots are still missing; 8 are reused under open licences.**

*Reused (5 Oct 2026, second round):* Pablo asked for existing tutorials whose screenshots could be
reused. Seven pictures come from the official docs' own public source repositories, and one from
the Django Girls tutorial's repository. The docs
websites were blocked for this sandbox, but `raw.githubusercontent.com` and GitHub's LFS media host
were not. Each picture was chosen by looking at it against its step, and some were rejected (below).
- **Licences:** each has one that allows commercial reuse with attribution:
  - GitHub Docs, CC BY 4.0;
  - VS Code docs, CC BY 3.0 US;
  - Python docs, PSF License v2;
  - Django Girls, CC BY-SA 4.0, **shown unmodified only** (decision D6).
- **Attribution:** under each picture, with links to the source file and the licence, the changes
  ("recortada") and the date it was taken (`Screenshot.tsx`, `Credit`).
- **Its own alt and caption:** each reused picture has them, because it shows someone else's folder
  or version (`vscode101`, `Python 3.13`, the `octocat` account). The caption says so: "la tuya dirá
  Python 3.12".
- **Tests:** a unit test refuses a reused record without an open licence on the allowed list
  (NonCommercial licences are refused, and CC BY-SA is refused if cropped or boxed) or without
  its own alt. The e2e check verifies the
  attribution links on the page.

| id | step | source file | licence | notes |
|---|---|---|---|---|
| `win-py-installer-path` | 2.2 (Windows) | `DjangoGirls/tutorial` `en/python_installation/images/python-installation-options.png` | CC BY-SA 4.0 | Python **3.12.2** with "Add python.exe to PATH" ticked and boxed in green by Django Girls; **unmodified**, no box of ours; the caption says the learner's will read 3.12.10 |
| `gh-2fa-setup` | 4.4 | `github/docs` `assets/images/help/2fa/ghes-3.8-and-higher-2fa-wizard-app-click-code.png` | CC BY 4.0 | its own box marks "setup key"; the caption explains that link | **reused** |
| `gh-noreply-email` | 4.6 | `github/docs` `assets/images/help/settings/email-primary.png` | CC BY 4.0 | **cropped** to remove a box on the wrong control; our box marks the noreply address. It shows the result, not the checkbox | **reused** |
| `mac-py-installer-done` | 2.2 (macOS) | `python/cpython` `Doc/using/mac_installer_07_applications.png` | PSF | shows Python 3.13; the caption says so | **reused** |
| `mac-py-certificates` | 2.3 (macOS), **new spec** | `python/cpython` `Doc/using/mac_installer_08_install_certificates.png` | PSF | 3.13; it **confirms** the `[Process completed]` string of MUST 3 |
| `mac-vscode-shell-command` | 3.2 (macOS) | `microsoft/vscode-docs` `docs/setup/images/mac/shell-command.png` | CC BY 3.0 US | exact wording confirmed (MUST 3) | **reused** |
| `vscode-trust` | 3.x | `microsoft/vscode-docs` `docs/editing/images/getting-started/workspace-trust.png` | CC BY 3.0 US | its own red box is on "Yes, I trust the authors"; button text confirmed (MUST 3) | **reused** |
| `vscode-terminal` | 3.x | `microsoft/vscode-docs` `docs/editing/images/getting-started/terminal-new-file.png` | CC BY 3.0 US | the folder is `vscode101`, the command is `echo`; the caption says so | **reused** |

**Looked at and rejected:**
- the Copilot device-code dialog (`github/docs`). It is a JetBrains window, not the
  github.com/login/device page.
- Windows Terminal's `overview.png` and colour-scheme images (`MicrosoftDocs/terminal`, CC BY 4.0).
  They show split panes and colour tables, too much for a learner opening a terminal for the first
  time (Mayer's coherence principle).
- the hub "terminal" icon (`windows-dev-docs`). It is an illustration, not a screenshot.
- the python.org Windows installer screenshot. It shows 3.8.0, with an older checkbox label.
- Django Girls' other images (the Spanish chapter), which show Python 3.6.1 and 3.4.3.
- Missing Semester, Happy Git with R, Pro Git and The Odin Project. They are NonCommercial, and
  PyArcana Pro is paid (RESEARCH.md §8).

*Still missing: 11.*
- **Where:** `SETUP_SHOTS` in `src/lib/setup/content.ts` with no row in `src/assets/setup/shots.json`.
- **What the page does meanwhile:** for these, `Screenshot` renders nothing, and the step's text
  carries the whole instruction. No drawing pretends to be a screenshot.
- **What it hides:**
  - the Windows track still has no picture before Part 3;
  - the Windows track still has no picture of `Install Now` finishing, the Store aliases screen, or
    the Git installer.
- **Why:**
  - The 3 browser captures were blocked. The sandbox's network policy refused python.org,
    git-scm.com, code.visualstudio.com and github.com pages, through curl and through Chromium
    (`ERR_TUNNEL_CONNECTION_FAILED`, then a 403 from the proxy). They were tried once and not
    retried (AGENTS.md).
  - The 8 remaining installer and desktop captures need a real Windows 11 or Mac. No openly licensed, current
    capture of them was found (RESEARCH.md §8).
- **Decision and action needed from Pablo:**
  1. Browser captures, either way:
     - run `node --import tsx scripts/setup_screenshots.mjs --take` on your own computer; or
     - allow these hosts in the cloud environment's network settings (Network access → Custom →
       add `www.python.org`, `git-scm.com`, `github.com`), and a later session takes them.
  2. Owner captures: take the remaining ones by following `src/assets/setup/README.md`. **Use a test
     GitHub account** for `gh-device-code`.
  3. Optional: replace any reused picture with your own capture later. Delete its row in `shots.json`
     and its PNG, then capture to the spec. The spec's alt and caption already describe the ideal
     capture.

All specs, and their state:

| id | system | source | step | state |
|---|---|---|---|---|
| `win-terminal-open` | Windows | owner | 1.1 | missing |
| `mac-terminal-open` | macOS | owner | 1.1 | missing |
| `py-release-files` | any | browser | 2.1 | missing |
| `win-py-installer-path` | Windows | owner | 2.2 | **reused** |
| `win-py-installer-done` | Windows | owner | 2.3 | missing |
| `win-app-aliases` | Windows | owner | 2.4 | missing |
| `mac-py-installer-done` | macOS | owner | 2.2 | **reused** |
| `mac-py-certificates` | macOS | owner | 2.3 | **reused** |
| `win-vscode-tasks` | Windows | owner | 3.1 | missing |
| `mac-vscode-shell-command` | macOS | owner | 3.2 | **reused** |
| `vscode-trust` | any | owner | 3.x "Abre la carpeta en VS Code" | **reused** |
| `vscode-terminal` | any | owner | 3.x "Abre la terminal integrada" | **reused** |
| `gh-signup-form` | any | browser | 4.2 | missing |
| `gh-2fa-setup` | any | owner (test account) | 4.4 | **reused** |
| `gh-noreply-email` | any | owner (test account) | 4.6 | **reused** |
| `git-win-download` | Windows | browser | 5.1 | missing |
| `win-git-editor` | Windows | owner | 5.2 | missing |
| `mac-clt-prompt` | macOS | owner | 5.1 | missing |
| `gh-device-code` | any | owner (test account) | 6.x "Inicia sesión…" | missing |

**MUST 2. No installer step was run.** Every installer screen, label and output on the page comes
from source code and documentation (R§7), not from a run. The checklist in §7 is the hand check.

**MUST 3. Unverified strings shown to the learner as what they "should see".** Each was written
from source code or docs, not read on a live screen. Confirm each during the hand check (§7):
- the 3.12.10 file names `python-3.12.10-amd64.exe` and `python-3.12.10-macos11.pkg` (from search
  summaries);
- the Windows Store-alias message `Python was not found; run without arguments to install from the
  Microsoft Store…`;
- the PowerShell error `python : El término "python" no se reconoce…` (the Spanish Windows
  wording);
- the Spanish Windows Settings path: Aplicaciones → Configuración avanzada de aplicaciones → Alias
  de ejecución de aplicaciones, and the `Instalador de aplicación` rows;
- ~~the macOS "Install Certificates.command" ending `[Process completed]`~~: confirmed by the Python docs' own screenshot (MUST 1);
- `cli.github.com`'s "Download for Mac" button giving a `.pkg`;
- `winget install --id GitHub.cli -e`'s success line (`Instalado correctamente` /
  `Successfully installed`);
- the GitHub sign-up rules (39 characters, single hyphens) and the Settings labels
  (`Password and authentication`, `Enable two-factor authentication`, `Emails`,
  `Keep my email addresses private`);
- ~~VS Code's `Shell Command: Install 'code' command in PATH` wording, and the trust dialog's
  button text~~: both confirmed by the VS Code docs' screenshots (MUST 1);
- the Ubuntu apt prompt `¿Desea continuar? [S/n]` (on a Spanish-locale Ubuntu);
- `gh auth status` showing `(keyring)`.

**MUST 4. Example values in commands and outputs.** These are not stand-ins for missing data. They
are examples the learner is told to replace:
- the name `Ana Quispe`;
- the user `ana-quispe`;
- the noreply address `123456789+ana-quispe@users.noreply.github.com` (9 digits on purpose; 8 would
  be DNI-shaped, rule D2, and a test now guards it);
- the commit hashes `3f2a1c9` and `8b1e0d4`.

They are listed here because they are invented values in learner-facing text. **Decision:** keep
them as examples (recommended), or replace them with values from a real test account once the
captures exist, so the text and the pictures match.

## 6. Decisions for Pablo (none blocks the page)

**D1. Python 3.12.10's binaries get no security fixes after April 2025** (DESIGN.md §5).
- **Options:**
  - (a) keep 3.12 (recommended for now: it matches `.venv-content` and every pinned output);
  - (b) move the course pin to 3.13 or 3.14, which would change this page and the runtime audit.
- **Recommendation:** (a), revisited when the course next re-pins its packages.

**D2. GitHub Desktop or `gh` for signing in** (DESIGN.md §6).
- **Options:**
  - (a) `gh` (built; S01 already needs it; one route for 3 systems);
  - (b) GitHub Desktop (GitHub's own beginner path; no CLI prompts; Linux would still need `gh`).
- **Recommendation:** (a).

**D3. Trim S01 now that Sesión 0 exists** (DESIGN.md §12; S01 is protected).
- **Options:**
  - (a) apply the §12 table: replace the "open the terminal" paragraph and the Git and `gh` install
    paragraph with a pointer to Sesión 0, and keep the verification block;
  - (b) leave S01 as it is (duplication, but no risk to its tests).
- **Recommendation:** (a), in its own round, under the section rules (`src/lib/course/sections/AGENTS.md`).

**D4. Readability above the handover's band** (FH 81 against "the easy end of 50–70"; DESIGN.md §10).
- **Options:**
  - (a) accept it as the right register for one-action steps (recommended);
  - (b) ask for a rewrite towards 70.

**D6. Share-alike screenshots, shown unmodified** (DESIGN.md §7).
- The Python 3.12 PATH-checkbox picture is Django Girls', under CC BY-SA 4.0. It is shown exactly
  as published, with no crop and no box of ours, and attributed with the licence linked.
- Under the Creative Commons FAQ, that makes it part of a collection, which share-alike does not
  reach. The validator enforces "unmodified" for BY-SA.
- **Options:**
  - (a) keep it (recommended: it is the most important click on the page, and no other open,
    current capture of it exists);
  - (b) remove it until your own capture exists. Delete its row in `shots.json` and the PNG, then
    run `node scripts/setup_shots_index.mjs`.

**D5. Trademark and brand terms for product screenshots** (DESIGN.md §7). Not verified for GitHub,
the PSF or Microsoft. Check before the first capture ships.

## 7. Hand-check checklist for Pablo (real Windows 11 and a real Mac)

Do it with a test GitHub account and the page open at `/empezar`. Tick each box as you go: your
browser keeps the ticks. For each step, check that the action works, that "Deberías ver" matches
the screen, and that the MUST 3 strings are right.

**Windows 11 (Spanish), on a fresh user account if possible**
- [ ] 1.1 Terminal opens; the prompt looks like `PS C:\Users\…>`. 1.2 `pwd` output.
- [ ] 2.1 The 3.12.10 page has `Windows installer (64-bit)`; the file name matches.
- [ ] 2.2 The first installer screen has `Add python.exe to PATH`, unticked by default.
      **Capture `win-py-installer-path` here.**
- [ ] 2.3 `Install Now` works on a non-admin account with the admin box unticked.
      `Setup was successful`.
- [ ] 2.4 Settings path and the two `Instalador de aplicación` rows. **Capture `win-app-aliases`.**
- [ ] Before 2.4, on a fresh account: does `python` open the Store, and what is the exact message?
- [ ] 2.6 `python --version` → `Python 3.12.10`; `py --list` works with the classic launcher.
- [ ] 2.7 `python`, `2 + 2`, `exit()`.
- [ ] 3.1 VS Code User installer; `Add to PATH` is ticked by default.
- [ ] 3.x `mkdir pyarcana`, Open Folder, the trust dialog, the integrated terminal with `pwd` ending
      in `pyarcana`.
- [ ] 4.x Sign-up, the email code, 2FA with an authenticator app, the recovery codes, the noreply
      address.
- [ ] 5.1–5.4 Git for Windows: the editor list offers VS Code (because VS Code is installed); does
      it ask for admin? After restarting VS Code, `git --version`.
- [ ] 5.x The `git config` steps; `git config --get core.autocrlf` → `true`.
- [ ] 6.1 `winget install --id GitHub.cli -e`: the agreement prompt and the success line. Restart
      VS Code; `gh --version`.
- [ ] 6.x `gh auth login`: the four prompts in the stated order, the device page, `Logged in as`.
- [ ] 6.x `gh repo create … --clone`, `cd`, edit `README.md`, `git status`, `add`, `commit`, `push`,
      `gh repo view --web`.
- [ ] 7.1 The four-command check, pasted at once, in a freshly restarted VS Code.

**macOS (Spanish), on an admin account and then once on a standard account**
- [ ] 1.1 Spotlight → Terminal; the prompt ends in `%`.
- [ ] 2.1–2.2 `python-3.12.10-macos11.pkg`; on a standard account, the administrator prompt (the
      fix box).
- [ ] 2.3 `Install Certificates.command` → `[Process completed]`.
- [ ] 2.5 `python3 --version` → `Python 3.12.10` in a new terminal. Does a Mac with Apple's
      `python3` show 3.9.6 first?
- [ ] 3.1–3.2 VS Code moved to Aplicaciones; the "downloaded from the internet" prompt; the
      `Shell Command…` wording.
- [ ] 5.1 `git --version` triggers the Command Line Tools prompt; how long the install takes; the
      `git version` line afterwards.
- [ ] 6.1 `cli.github.com` → Download for Mac → `.pkg` → `gh --version` after restarting VS Code.
- [ ] 6.x–7.1 As on Windows, with `python3`.

**Ubuntu 24.04** (can be done in a VM)
- [ ] 2.x `python3 --version` → 3.12.3; `sudo apt install python3-venv python3-pip`, with the
      Spanish prompt.
- [ ] 3.1 `sudo snap install code --classic`.
- [ ] 5.1 `sudo apt install git`. 6.1 `sudo apt install gh` (universe).
      `gh auth status` shows `(keyring)` or the plain-text warning.

## 8. Pre-existing failures (found, not caused, not fixed here)

These fail identically on the base commit `e161435` (checked in a worktree of it):
- **`node scripts/complexity_gate.mjs`:** 34 functions over the ceiling against a baseline of 33,
  worst 78. This round adds none: the count is the same before and after.
- **`npm run test:first-use-all`:** 70 issues (16 definition after requirement, 12 no visible
  definition, 42 use before definition), all in section files.
- **`npm run test:no-identifiers`:** 8 DNI-shaped values in `s03-decisions-rules.ts` and
  `s09-exceptions-logging.ts`.

`npm run test:ux-gates` stops at the first of these. Its remaining checks were run one by one (§4.1).

## 9. To resume

- Everything is committed and pushed on `claude/session-0-setup-intro`.
- To add captures:
  1. follow `src/assets/setup/README.md`;
  2. run `node scripts/setup_shots_index.mjs`;
  3. run `node scripts/run_billing_tests.mjs --only client`;
  4. look at `/empezar`.
- To check the page end to end:
  1. build with `NEXT_PUBLIC_BASE_PATH=/pyarcana node scripts/build_static_export.mjs`;
  2. serve `out/` under `/pyarcana/`;
  3. run `BASE=http://localhost:<port>/pyarcana node workers/billing/e2e/setup.e2e.mjs` (add
     `EXPECT_SHOT=1` once a capture exists).
- Or run the whole local stack with `workers/billing/e2e/run.sh`, which now includes the suite.
