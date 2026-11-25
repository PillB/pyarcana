# Ruta aplicada «Python en la web»: design

Written 25 Nov 2026, for Pablo, from learner feedback (a data analyst who asked for frontend
notions, connecting Python to other technologies, conceptual database design, and deploying
beyond a local FastAPI, with an exercise that builds a website). Research and the knowledge map
are in [`RESEARCH.md`](RESEARCH.md) and [`graph.json`](graph.json).

**What exists after this round**

- the view `#ruta-web` inside the course shell (`src/components/tracks/WebTrackView.tsx`);
- the logic in `src/lib/tracks/` (placement, progress, preview) and the content in
  `src/lib/tracks/web/content.ts` (5 modules, 21 steps, one «Hazlo tú» practice per module with a
  hint and a solution that runs, `app.js`);
- a banner on S12 and S13 (detour) and on S27 (required) via `WebTrackLink` in `SectionView`;
- the test `src/lib/cloud/__tests__/web-track.test.ts` (client group, floor 30; 31 tests);
- `scripts/web_track_learner_walk.mjs`: every step done as a learner would, in a temp project,
  checked in Chromium, plus `wrangler deploy --dry-run` with `WALK_WRANGLER=1` (26/26);
- `scripts/web_track_sync_check.cjs`: two real tabs and every view agree (14/14);
- the state machines, their defects and the four red-team passes: [`STATE_MACHINES.md`](STATE_MACHINES.md);
- the research and knowledge map: `RESEARCH.md` and `graph.json` (73 concepts, 92 dependencies).

**Learner-facing prose is a proposal.** AGENTS.md (owner rule, 9 Nov 2026) says Claude-written
learner words are applied only after the owner approves them. This PR is that proposal: merging it
is the approval; requesting changes on a passage is the review.

## 1. Pre-execution round: four routes, tried at small scale

| Route | Probe | Result |
|---|---|---|
| A. New section(s) inside the 52 | `grep -rlE '\b52\b' scripts tests src/lib` | 95 files assume 52 sections; renumber guards, badges, the paywall index and the roadmap (protected) all move. Rejected: an "Ask first" restructure for an *optional* topic. |
| B. Supporting blocks inside S12/S13 | S12 is 2,489 lines and under review in "Review every item in S01–S27" | Makes S12 longer for everyone (not optional), edits a protected path another thread is editing. Rejected. |
| C. Standalone page outside the shell (like the first `/empezar`) | Pablo, 25 Nov: "you lose the header and other navigation" | Repeats a defect already reported and fixed for Sesión 0. Rejected. |
| **D. A view inside the shell, beside the sections** | `node scripts/complexity_gate.mjs` before/after; `git log` churn on `page.tsx` | Gate unchanged (32 over, worst 78); `page.tsx` diff is 4 lines, so conflicts with the two threads editing the shell stay trivial. **Chosen.** |

**Expert and benchmark.** CS50x 2026 orders SQL (week 7) → HTML, CSS, JavaScript (week 8) →
Flask (week 9) (cs50.harvard.edu/extension/2026/fall/syllabus). S12 is PyArcana's SQL+HTTP week,
so the detour sits exactly where CS50 puts the web: after SQL, before a server framework (S41).
The Carpentries keep setup apart from lessons, which is the precedent Sesión 0 already follows
(`audit/session-0/DESIGN.md` §1). A curriculum designer holding CS50's order would accept the
placement; one holding "optional means no learner is blocked" would accept the non-gating link.

## 2. Placement by slug and phase, never by number

The track is anchored to `apis-sql-geo` (recommended after), `evidence-dashboard` (also offered)
and **phase 2** (required from its first section, today S27). Sections have been renumbered before
(`audit/fixer/numbering_epoch.json`), so a track pinned to "12" would follow whatever moved there.
`resolveTrackPlacement` throws, naming the slug and the file to fix, if an anchor stops resolving;
`placed.ts` calls it at import, so the build fails rather than a learner finding the link on the
wrong lesson. Drift is simulated in the test: insert a section before S12, retitle S12, delete its
slug, move phase 2, and an impossible order.

## 3. "Optional at intermediate, required at advanced": what "required" means here

Pablo asked for the track to be optional at the intermediate level and mandatory at the advanced
level. The standing (`trackStanding`) is computed from the phase of what the learner has touched:
`upcoming` before S12, `optional` after it, `required` once they reach phase 2 (named «Integración
avanzada» in `PHASES`), `done` when every step is ticked. S27 shows an amber "required" banner until
the track is done.

**Trade-off, stated:** "required" is shown, not enforced. No gate, exam, badge or paywall reads it.
Enforcing it means changing what a credential claims and how sections unlock, which AGENTS.md puts
under "Ask first". The cost: a learner can ignore the banner. The next step, if Pablo wants it, is a
decision on whether the level-3 badge requires the track, made with the badge owner.

## 4. Its own ticks

`pyarcana:track:ruta-web:v1`, separate from `python-ds-progress` and from Sesión 0. A track tick can
never mark a section complete ("additive media never alters completion state"). Unreadable state
reads as empty and is left in place.

**Trade-off:** ticks stay in this browser; they do not sync to an account. The progress document
sync (`src/lib/progress-document.ts`) carries Sesión 0's theory parts but no track field; adding
one touches the progress schema (a protected path) and is left for a separate change.

## 5. Content decisions

- **Python computes, the browser presents.** The first step is a table of who does what better,
  because that is the learner's literal question («qué cosas hace mejor HTML versus Python»).
- **Every warning runs** (writing rule B8): unescaped `Bodega <Norte>` loses a word in the
  browser; SQLite stores an orphan sale without `PRAGMA foreign_keys = ON`; `/data.json` leaves the
  GitHub Pages subfolder. Each has `# Error` and `# Corrección` halves, outputs pinned by the test.
- **What the browser draws** is shown in a sandboxed frame (`sandbox=""`: no scripts, no forms, no
  same-origin), and the test checks every row of each picture appears in the code's printed output.
- **Stdlib only** (`html`, `http.server`, `urllib`, `sqlite3`, `csv`, `json`), so every block runs
  under plain `python3 -I` and needs no package the learner has not installed.
- **Deployment**: GitHub Pages first (the learner already has Git and a GitHub account from Sesión
  0), Cloudflare Workers static assets second (the current Cloudflare path; the migration guide was
  updated 12 Nov 2026), Vercel named. Python on the server (Vercel FastAPI zero-config, Cloudflare
  Python Workers, GA since Sep 2026) is recognised, not built: S41–S45 teach it properly.
- GitHub Pages' terms (no commercial or SaaS use; 1 GB, soft 100 GB/month) are stated in the
  decision table, because a learner may publish a business dashboard there.

## 6. Red-team round (attack, defend, decide)

| Attack | Defence or fix |
|---|---|
| The previewed HTML could run script in the course page. | Sandboxed frame with no permissions; a test fails if `sandbox` gains `allow-scripts` or a preview contains `<script>`, `on…=` or `javascript:`. |
| The picture drifts from the code. | Test: every `<tr>` in a preview must be in the step's printed output. |
| A prerequisite the learner has not met (pandas at S12). | Found in review and rephrased; test: `buildsOn` may only name sections up to the anchor. |
| `app.js` sorts "1250.00" before "980.50" (text sort). | Executed in the test against a minimal DOM; numeric, textual and toggled orders asserted. |
| A track tick marks a section complete. | Separate key; test asserts the course record is byte-identical after a tick. |
| The banner spreads to every section. | Test: exactly S12, S13 (detour) and S27 (required). |
| Shared link `#ruta-web/modelo`. | Router accepts it; the view scrolls to that module. |
| A section later takes the slug `ruta-web`. | Plain views win in the router; test fails if any section has that slug. |
| `file://` blocks `fetch`. | Taught as a "Si no funciona" on the console step, where a `fetch` actually happens. |
| (research) The built site never calls `fetch`, so the `file://` warning described a failure the site cannot produce. | The serve step now gives the true reason (the page behaves as published; other programs can request `data.json`); the `fetch` is exercised from the browser console. |
| (research) `leer_datos.js` used top-level `await`, a SyntaxError in a classic `<script src>`. | Presented as console code and titled so; the text says a `.js` file needs an `async` function. Test: a block with a top-level `await` must be titled as console code. |
| (research) JavaScript syntax and the DOM were used, never taught. | Glossed against Python in `sitio.ordenar`: `const`, arrow functions as `lambda`, braces as indentation, the ternary, `[...]`, the DOM. |
| (research) The Pages step pushed to a repository it never created; Cloudflare needed Node.js with no instructions. | `git init` + `gh repo create --source . --push`, as in Sesión 0; a "Si no funciona" for a missing `npx`. |
| (research) Modelling sat between HTTP and the site although nothing later depends on it. | Moved to module 5 and said to be independent; the site-and-publish arc now runs 1→4 without a detour. |
| A link to another module while the track is open did not scroll (no remount). | The view also listens to `hashchange`; checked in Chromium at 1280 and 375 px. |
| Python older than 3.12 runs the check. | The test refuses with `REFUSED` and the interpreter found, never skips. |
| (learner walk) `construir_sitio.py` wrote to a temporary folder, so the learner had no `site/` to serve or publish. | Writes `site/` beside the script; the walk serves and publishes that folder. |
| (state machines) Two tabs erased each other's ticks; a stale tab's click flipped instead of setting; a tick overwrote a record it could not read. | Set-intent commits on the latest stored record, a `storage` listener, a backup key. STATE_MACHINES.md SM1 and SM2. |
| (state machines) The track page said "upcoming" or "optional" while S27 said "required"; S12 said "optional" to an advanced learner. | Standing reads every touched section and a furthest-section mark; the S12 title follows the standing. SM3 and SM4. |
| (state machines) The prose cites 15 sections by number ("FastAPI en S41"). | A test pins each number to its slug and simulates an insertion before S12. |
| (state machines) A learner without Sesión 0 gets a `master` branch and Pages offers no `main`. | A «Si no funciona» with `git branch -M main`, run against a `master` repository. |

## 7. Work left undone (named, not absorbed)

- "Required" is advisory (§3).
- Ticks do not sync across devices (§4).
- No dashboard card. The menu has an entry beside Sesión 0 (follow-up round); the dashboard is
  left as it is.
- The track has no graded exercises or quiz; checkpoints are self-checks («Deberías ver») like
  Sesión 0. Auto-graded exercises would need the Pyodide playground, which cannot run a server or
  write files.
- The English UI strings exist; the content is Spanish only, as Sesión 0's is.
- Publishing is checked up to `wrangler deploy --dry-run` and a local Pages-style server; no real
  GitHub Pages or Cloudflare deployment was made, because that needs the learner's own accounts.
- (Fixed in the follow-up round, STATE_MACHINES.md: adding a step no longer demotes learners who
  finished; course progress follows other tabs.)

## 8. Browser evidence (static export, base path /pyarcana, Chromium)

At 1280 and 375 px: the S12 and S13 banners say "detour", S27 says "required", S02 and S15 show
none; the banner opens `#ruta-web` at the top; the two sandboxed previews draw «Bodega» alone and
«Bodega <Norte>» complete; a tick survives a reload and is stored under the track key only; no
horizontal overflow; no console error or CSP report. `npm run test:static-journeys`: 52 passed.

## 9. Retrospective

- **What failed:** the first draft used pandas in a module that starts at S12, where pandas is not
  yet taught (S15). Root cause: writing from the analyst's perspective, not the learner's position.
  Guard: the `buildsOn` test and the research knowledge map's "loose dependency" list.
- **What failed:** the site promised a `fetch` it never made, and a snippet used top-level `await`.
  Root cause: each block was checked alone, never against the page it belongs to. Guards: the
  top-level-`await` test, `app.js` executed against the page's own table, and the research pass,
  which read the track as a learner would and listed every concept it uses but does not teach.
- **What failed:** the mutation script's first search string did not exist (the output line ends in
  a newline, not a backtick). Root cause: assumed the shape of generated text. Guard: each mutation
  asserts its target occurs exactly once before applying it.
