# Section screenshots: what was inserted

Done 2026-10-06 under owner decision **D19** (`audit/fixer/decisions.md`), which overrides D4 for
these seven images only. Branch `claude/section-screenshots`.

## Where each image went

| Image | Section · block | Sits right after (paragraphs counted from 1) | Guide linked under it |
|---|---|---|---|
| `s01-compare-pr-banner` | S01 · Pull Request: pedir revisión antes de integrar | paragraph 3 ("Publica la rama y abre **Compare & pull request**…") | GitHub Docs, crear un pull request (es) |
| `s01-pr-files-changed-tab` | S01 · same block | paragraph 4 ("Antes de crear el PR, abre **Files changed**…") | GitHub Docs, revisar los cambios de un pull request (es) |
| `s01-new-repository-menu` | S01 · Ramas, Pull Requests y recuperación segura (S01-T3-B) | paragraph 2 ("…usa el menú **+ → New repository**…") | GitHub Docs, crear un repositorio (es) |
| `s01-vscode-extensions-python` | S01 · Componentes del stack que vamos a instalar | the code block (its comment `# 4) Extensiones en VS Code…`), before the callout | VS Code docs, Extension Marketplace (en) |
| `s01-ruff-quickfix-f401` | S01 · VS Code y Ruff como calidad mínima (S01-T4-A) | the callout "Extensión + CLI" ("La extensión Ruff en VS Code subraya…") | ruff-vscode README (en) |
| `s23-trace-viewer` | S23 · Trace, screenshot y logs (S23-T3-A) | paragraph 2 ("…abres el zip en Trace Viewer…") | Playwright Trace Viewer, Python edition (en) |
| `s44-merge-blocked` | S44 · branch/review policy y release notes (S44-T4-A) | paragraph 1 ("La **protección de la rama** `main` exige…") | GitHub Docs, ramas protegidas (es) |

Every guide URL was fetched on 2026-10-06 and returned 200. The GitHub Docs and VS Code URLs are
the current paths the old ones redirect to. The ruff-vscode README and the licence files on
github.com could not be fetched through this sandbox's proxy (403); their content was read from
raw.githubusercontent.com instead.

## How it works

- `TheoryBlock.screenshots: { id, after }[]`, where `after` is a paragraph index, `'code'` or
  `'callout'`. No prose was edited; the section diffs are additions only.
- The prose of a block is split after that paragraph (`proseSegments`). `RichText` takes the
  prose above as already seen, so a glossary hint is not shown twice in one block.
- One source of truth: `src/assets/sections/shots.json` holds credit, licence, licence file,
  changes, date consulted, alt, caption and guide for each image. It is validated by Sesión 0's
  `validShotRecord` plus `validSectionShotRecord`: credited, alt ≠ caption, and a guide whose
  link text is descriptive.
- Rendering reuses Sesión 0's `Screenshot` (credit line included) and its guide line, moved to
  `src/components/setup/OfficialGuide.tsx` so both pages print the same sentence.
- Images are imported from `src/assets/sections/` and emitted as
  `/pyarcana/_next/static/media/<name>.<hash>.png`. Nothing is in `public/`.
- `REUSE_LICENCES` gained `MIT` and `Apache-2.0`. A credit under either must link the source's
  own LICENSE file, because that file carries the copyright notice both licences require, and
  names the holder in `source`.

## Tests

- `tests/adversarial/section-screenshots.test.ts`, 19 tests: records validate; the set is pinned
  to these seven; alt is not empty and is not the caption; licences are on the allowlist and
  NC/ND are rejected; each PNG exists, is imported, matches its record's size and is
  byte-identical to the validated survey copy; each anchor sentence is in the passage right
  above its picture; the split loses no prose in any of the 52 sections.
  - Each guard was broken once and reported the failure: S44 picture moved one paragraph, an
    NC licence added, alt set to caption, the Apache credit stripped of its licence file.
- `scripts/a11y.spec.ts`, new test "section screenshots load…". It checks the five S01 images
  in the static export under `/pyarcana`: loaded, from `_next/static/media`, not upscaled, alt
  over 40 characters, caption is not the alt, credit present, guide link text not "aquí".
  Axe is scoped to those five pictures and their guide lines; the whole S01 page is the
  existing test just above it. Removing one emitted PNG made it fail with the image's name.

## Gates

Run on 2026-10-06. "Base" is `775a3a7` (this branch's start), "branch" is the tested code of
`af5bb52`. Commits after it change only documentation.

| Gate | Base | Branch | Note |
|---|---|---|---|
| `npm run test:v3` | pass | pass | |
| `npm run test:ux-gates` | **fail** | **fail** | Stops at `first-use-all`, on both. |
| `npm run test:first-use-all` | **fail** | **fail** | Already failing on base. Report identical to base's. |
| `npm run test:no-identifiers` | **fail** | **fail** | Already failing on base (S03, S09). Report identical. |
| `npm run test:course-complete` | pass | pass | |
| `node scripts/complexity_gate.mjs` | **fail** 34/33 | **fail** 34/33 | Already failing on base (`QATour`). Same offender list; nothing added. |
| `python3 scripts/prose_quality_audit.py` | pass | pass | Output identical. It does not read `shots.json`, so captions were checked by hand: no sentence over 28 words (D1). |
| `npm run lint` | pass, 0 errors, 7 warnings | pass, the same 7 warnings | One run showed 41 errors. They came from my untracked copy of the built site (`.ci-static/`), which `eslint .` walked. After deleting it: clean. |
| `npx tsc --noEmit` | pass | pass | Needs `npx prisma generate` first in a fresh container. |
| `node scripts/run_billing_tests.mjs --only client` | pass, 507 | pass, 507 | |
| `python3 tools/fixer/ledger.py --check` | **fail** | **fail** | Already failing on base: "LEDGER.md is stale". |
| `npm run test:adversarial:node` | not run | pass, 366 tests, billing 1117 | Includes the 19 new tests. |
| `npm run test:adversarial:py` | not run | pass, 322 tests | |
| `node scripts/preservation_sentinel.mjs` | n/a | OK | Run with `PRESERVATION_BASE=775a3a7`: 0 unauthorised deletions. Without it the script falls back to `HEAD~1`, because `origin/main` is not fetched here. |
| `scripts/a11y.spec.ts`, static export under `/pyarcana` | n/a | 12/12 pass | See below. |
| `npm run test:python-content` | not run | not run | No `.venv-content` (Python 3.12) in this container, and the audit refuses a verdict under 3.13. No code block changed. |

- **Reports:** the nine `course-state/*.json` reports these gates rewrite were regenerated from
  base and from the branch. Ignoring timestamps, they are identical. They differ from the
  versions committed at HEAD only because those are stale; for example, the committed v3 report
  still lists the old section ids. They were not committed: refreshing them is unrelated work.
- **The S01 axe contrast failure did not reproduce.** The order lists it as already failing on
  base. Here the whole-S01 test passes on the branch. `audit/session-0/PLAN.md` puts that failure
  on CodePlayground's amber status line, which appears when the sandbox blocks Pyodide's CDN.
  This container reaches the network. That fits, but it is not confirmed, and base was not run
  through axe here.
- **Browser runs need** `launchOptions.executablePath: '/opt/pw-browsers/chromium'` in this
  sandbox, through a local config file that was not committed.

## Trade-offs

- **Captions edited**, under writing rules C1 and C6:
  - VS Code: the survey caption said "tu número de versión será distinto", but the crop removed
    the version. The caption now names what is still visible and will differ: the download counts.
  - Ruff: "corrige borrando la línea" became "borra tú el import sobrante". Line 7 in the picture
    imports two names, so deleting the whole line would delete a name that is still used.
  - The rest: split into two sentences where a semicolon joined two ideas. The S23 caption opens
    with a verb, "Así se ve…".
- **"(se abre en otra pestaña)"** is screen-reader-only text, as in Sesión 0, not visible text.
  The order asked for "the line Sesión 0 uses", and that is how Sesión 0 prints it.
- **No theme variant.** These are raster captures: the four GitHub screens and Trace Viewer are
  light, the two VS Code captures are dark, and none follows the site's theme. D4 named this
  cost, and the owner accepted it in D19.
- **No upscaling.** A picture is never wider than its own pixels (`maxWidth: width`). The
  732 px menu and the 520 px VS Code crop were stretched and blurred at full column width.
  The cost is that they now render narrower than the text column.
- **No click-to-enlarge.** At the 830 px column, the Trace Viewer's error text (1600 px source)
  is small. The alt and caption carry what the error says. Sesión 0 has no zoom either.
- **The anchor test is literal.** If a later round rewrites an anchor sentence, the test fails.
  That is on purpose: the picture must be re-checked against the new text, not carried along.

## Not done

- **Dark-theme check of the pictures:** only light theme was rendered and inspected.
- **S23 and S44 are not in the browser test.** Their placement is covered by the unit test, and
  they were rendered and inspected by eye on the static build, but the axe test opens S01 only.
- **`audit/section-screenshots/survey/`** keeps the English `changes` text. The app's records
  carry Spanish translations.
