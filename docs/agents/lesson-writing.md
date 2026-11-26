# Lesson writing, content and dependency graphs: what we learned

Written 25 Nov 2026 from the web track rounds (PRs #196 and #208), with the standard the content
editor and verifier thread applies to S14–S27. It complements `audit/fixer/writing_rules.md` (the
rules) and `docs/agents/lessons.md` (incidents across the course). Read it before writing or
reviewing learner-facing content, in the 52 sections or in a track.

## 1. The standard (owner, 25 Nov 2026)

**Every concept, idea and technique the learner has not been taught is explained where it first
appears.** A **technique** must be explained *and* exemplified: by an exercise, a script, or a
diagram or animation. "Taught" means taught earlier in the course or earlier in the same page,
checked against the glossary and the concept map, never assumed.

### What counts as explained

- An inline gloss at first use, in the same sentence or the next (writing_rules A1). This applies
  everywhere a learner reads: titles, goals, intros, tables, «Deberías ver», «Si no funciona»,
  hints, previews and exam stems.
- The gloss says **what the thing is and what it does for the learner** (A2, B1). Restating the
  label does not count. Good: «`wrangler.jsonc`, el archivo de configuración que le dice a
  Cloudflare qué publicar». Bad: «el archivo de configuración de Wrangler».
- Expand every acronym (A3). Do not use house vocabulary without introducing it (A4). Keep one
  name per concept (A5).
- Say a new idea two ways, and recall what it rests on (B7). A keyword the learner has seen only
  in code has not been taught.

### Which terms need it

Any tool, config file, config field, CLI flag, product or plan name, UI label, acronym or jargon
word the learner has not met. Three cases were missed in the web track:

- **Config files:** every field the learner types is explained, not only the file. The first
  draft of the prototype module explained `wrangler.jsonc` as "the file that says which folder to
  publish", then added `main`, `compatibility_flags`, `d1_databases`, `binding` and `database_id`
  with no word on any of them.
- **Code the learner copies:** each kind of line is explained (what calls it, what it receives,
  what it returns). A Worker's `class Default(WorkerEntrypoint)`, `self.env.DB` and
  `Response.json` are not self-explanatory to someone who knows only S01–S12.
- **UI labels and product names:** «Instant Rollback», «Hobby», «Billing → Spend Management».
  Name what the button or plan does, not only where it is.

### Term or technique

- A **term** is a name to recognise: gloss it.
- A **technique** is something the learner does: deploy, paginate by key, add an index, apply a
  migration, roll back, scope a token. It needs three things:
  1. a **worked example that runs**, with its output pinned by a test;
  2. an **exercise with a planted mistake** that the test catches, or, where nothing can run
     (a dashboard, an account), a script or command the learner walk executes;
  3. a **recall** of what it rests on (B7).
- A **load-bearing technique**, used in three or more sections, gets its own subtopic and a figure
  (decisions D3, depth L3): an inline SVG archetype or motion from `src/components/course/figures/`,
  or a screenshot per D23. The figure must remove work the prose was doing.
- **Every warning gets a counterexample that runs** (B8): `# Error`, then `# Corrección` with the
  same inputs, both outputs pinned. "Pide en una sola consulta con JOIN lo que necesita la página"
  is a warning; without a block that counts 21 queries against 1, it teaches nothing.

## 2. Failure modes found, and the guard for each

| What went wrong | Root cause | Guard |
|---|---|---|
| FastAPI and Jinja named with no explanation | `scripts/concept_map.py` and the identifier audit read only the files that `src/lib/course/index.ts` imports, so a track's `content.ts` was invisible to them | `web-track.test.ts`: "a glossary term taught after S12 is explained where the track first names it" (matches `GLOSSARY_TERMS` with `firstSectionId`) |
| «vista previa» and «producción» offered as choices four steps before they were defined | Definitions written where the topic is taught, not where the word first appears | "a term the track defines in bold is not used earlier in the same module" |
| Two short sentences in a row across a paragraph break (D13) | The check read each paragraph alone; a learner reads them in sequence | D1/D13 test joins a step's paragraphs and a module's intro |
| Sentences over 32 words (D1) | Not measured for the track | The same test, on every passage |
| Fix advice that did not work (`DROP TABLE` repaired by re-applying migrations: Wrangler remembers which migrations it applied) | Advice written from documentation, not run | The learner walk (`scripts/web_track_learner_walk.mjs`, `WALK_WRANGLER=1`) runs every «Si no funciona» it can, both halves |
| Spending limit presented as protection against database charges it does not cover | Product claim not read against the product's own page | Cite the page and its scope; Codex review with the docs open |
| A number in the prose, the table and the code drifting apart (quota of 5 million rows) | The same value kept in three places | A test reads all three and simulates the drift (10 million in the table must fail) |
| «Deberías ver» quoting a line the code no longer prints (SQLite plan wording) | Plan text changes between SQLite versions | A test checks every quoted plan line appears in the pinned output |
| Section numbers in prose going stale after renumbering | Prose cites "S41", the course is ordered by slug | A test pins each cited number to the slug it meant and simulates an insertion |
| A counter that under-reported a full scan | `contar()` placed last in the `WHERE`; SQLite evaluated the cheap term first | Probed both orders before choosing; the output is pinned, so a reordering fails loudly |
| Local behaviour taken as production behaviour | `rows_read` counted locally by `wrangler dev` | Say which environment a quoted value comes from; never claim the remote number |
| Config fields and Worker lines with no word of explanation (`main`, `binding`, `self.env.DB`, `Response.json`) | Code copied from the product's docs; the prose explained the file, not its parts | `web-track.test.ts`: every `wrangler.jsonc` field has a row in the `prototipo.configurar` table, and every name `entry.py` imports or calls has a row in the `worker-d1` table |
| `self.env.ASSETS` used but never declared: a missing page answered 500 (`AttributeError: ASSETS`) | The walk requested `/`, which Cloudflare serves before the Worker runs, so the Worker's fallback line never ran | Test: declared bindings equal `self.env.X` used; the walk requests `/no-existe` and expects 404. Found while writing the explanation of that line, which is itself an argument for explaining every line |
| Warnings with nothing that showed the cost («usa JOIN», «no indexes todas las columnas») | B8 applied to the first warning, not to every one | B8 registry test: each warning names the block with `# Error` then `# Corrección`, two output lines |

## 3. Dependency graphs: where they are and how to use them

| Graph | File | What it holds | Checked by |
|---|---|---|---|
| Course concept map | `course-state/concept_map.json` (built by `scripts/concept_map.py`) | Every concept, where it is defined, depth L0–L3 | `python3 scripts/concept_map.py --check` (fails on L0 and on use before definition), `test_concept_depth_ratchets.py` |
| Glossary | `src/lib/glossary/terms.ts` | 108 terms, aliases, `firstSectionId` | `npm run test:ux-gates` (glossary-intro, glossary-coverage, first-use-all) |
| Web track knowledge map | `audit/tracks/web/graph.json` | Nodes (`status`: `course`, `track`, `deferred`; `where`: section or `modulo:<id>`), edges with a reason, `loose` dependencies and their `resolved` action | `web-track.test.ts`: acyclic, every node's module exists, every action is REMOVE, REPHRASE, GLOSS, TEACH or DEFER |

How to use them when you add content:

1. **Before writing**, list the concepts the new passage uses. Look each one up in the glossary
   and the concept map. A concept taught after the point where the learner reads this one is a
   **loose dependency**.
2. **Resolve each loose dependency** with one action and record it in the graph's `resolved`
   list: REMOVE it, REPHRASE around it, GLOSS it in place, TEACH it here (with a worked example), or
   DEFER it with a pointer to the section that teaches it.
3. **Add a node** for every concept the new content teaches, with edges from what it rests on.
   Each edge carries a one-line reason. The graph must stay acyclic.
4. **Placement by slug, never by number.** A module's `buildsOn` lists section slugs, and a test
   refuses a prerequisite taught after the detour starts.
5. **Known gap:** `concept_map.py` counts glossary aliases in code comments as definitions, and
   does not read track files. Until it does, a track needs its own first-use test (above).

## 4. The process that caught these

- **Proposal, then approval.** Claude-written learner words are applied only after the owner
  approves each passage, its replacement and the reasoning (AGENTS.md, 2026-11-09). A proposal
  file lists them, with the reason and source for each.
- **Codex review.** Policy asks for content Claude writes to be sent to Codex to improve the
  writing. How it is done today, confirmed with the content editor and verifier thread on 25 Nov
  2026: neither thread has run the Codex CLI. The cloud container has no `codex` binary and no
  OpenAI key, so a CLI run can only happen on the owner's machine. Both threads use the GitHub
  Codex bot instead. Post `@codex review` on the PR with the scope stated: the files,
  `audit/fixer/writing_rules.md` as the standard, and what to look for (rules A1–A5, B1–B9, D1,
  D13, facts against the cited pages). Treat P1 (orange) findings as must-fix. For P2 (yellow),
  verify, reply once and carry the fix in the next push. Every fix gets a test that fails on the
  old text. There is no prompt template beyond that comment; say so instead of implying a CLI
  ran.
- **The editor thread's per-item checks** (`/mnt/project-files/review-full/METHOD.md` §3), which a
  track round repeats:
  - every item follows `writing_rules.md`, nothing is used before it is taught, there are no
    real-looking IDs (D2), and it passes the student-question test;
  - theory claims are true on Python 3.12 with pinned packages, and every warning has a running
    counterexample;
  - each worked example prints its pinned output and does what its preamble says;
  - an exercise can be solved with what was taught, its starter does not already pass, and its
    test tells a right answer from a plausible wrong one;
  - each hint is true and more specific than the last.

  Its own extra check is a long-sentence count by script, because one sentence hidden behind
  `?**` slipped past the audit; the track's D1 test strips `**` before splitting for that reason.
- **What the editor thread does beyond that** (its reply of 25 Nov 2026, in
  `/mnt/project-files/web-track/EXPLAIN_ROUND_review.md`):
  - It verifies every Codex finding before acting on it. Codex gets no prompt or checklist of its
    own.
  - Each test file has an `escaped(solution, pinned, mutated_code)` helper. It runs a mutated
    solution and returns `""` when the test catches the mutation, so a failure prints what got
    through.
  - `tests/adversarial/test_assertion_messages.py` rejects weak assertions that have no message.
    It has its own negative control.
  - After changing an exercise, it runs
    `node --import tsx scripts/exercise_fingerprints.mts --write`, adds a `changed` row to the
    exercise-meaning ledger, and verifies with
    `node scripts/exercise_meaning.mjs --ledger-base origin/<base>`. Plain `--check` misses
    row-order collisions.
  - A rewritten exam item is retagged to the concept it now tests, with three variants per
    concept, because `exam-draw.ts` draws one variant per concept.
- **Send new content to the editor thread with a term table.** Give each term or technique, where
  the learner first meets it, and how it is explained or exemplified. Ask for PASS or FINDING per
  row and for terms missing from the table. On the prototype module, it found 9 that the author
  missed:
  - a product named and never used (Cloudflare Pages);
  - a tool used one step before its gloss (`pywrangler`);
  - the injection probe's `%27` and `%20`;
  - a UI path with no purpose given;
  - UTC, CPU and «páginas de 4 KB» not expanded;
  - a technique the practice asked for but only the hint taught (the composite index);
  - a warning with no counterexample («una migración solo agrega»).
- **Offline examples for account-only techniques.** When the real step needs an account or a
  browser, exemplify the decision instead. For a token, compare a permission dict against the
  task (`alcance_minimo.py`). For package names, match them against known ones with `difflib`
  (`nombre_parecido.py`). Name what the script cannot prove, such as that a package exists, and
  keep the manual step for it.
- **The content editor and verifier thread** checks the term list of new content against the
  standard in §1.
- **Every code block runs** under `python3 -I` and its output is pinned. Files that only run on a
  platform (a Cloudflare Worker) are parsed in the unit test and executed by the learner walk.
- **Each test is mutation-checked:** put the defect back and the test must fail (CLAUDE.md,
  "Tautological tests considered harmful").

## 5. Checklist for a new lesson or module

- [ ] Every term, config field, flag, product name and UI label glossed at first use (what it is
      and what it does).
- [ ] Every technique: runnable worked example, an exercise with a planted mistake the test
      catches (or a walked script), and a recall of what it rests on.
- [ ] Every warning: `# Error` and `# Corrección` blocks with pinned outputs.
- [ ] A figure or diagram wherever it removes work the prose was doing; a load-bearing
      technique gets one.
- [ ] Concept map, glossary and the track graph updated; loose dependencies resolved and recorded.
- [ ] D1 (≤ 32 words) and D13 (no two sentences under 15 words in a row, across paragraphs).
- [ ] Facts about third-party products cite the page and the date read.
- [ ] Every «Si no funciona» run, both the failure and the fix.
- [ ] Tests for drift between prose, tables and code; each mutation-checked.
- [ ] Proposal to the owner before applying the words; Codex review after.
