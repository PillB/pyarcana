# RCA: positional-pins — tests pinned to a block position

Status: IN PROGRESS (append-as-you-go; whatever is on disk is the result)

Destroyed rounds: S33, S05, S15 (3 passing rounds).

## Root cause
(pending)

(replacing the placeholder above as sections are established)

## Root cause

`scripts/course_event_extractor.mts` mints one and only one identifier per learner-visible
event — the `location` string — and **most of its grammar is array-index-derived**. Every
consumer that stores or asserts a `location` therefore stores an array index, and a concepts
round exists precisely to insert elements into those arrays.

The location grammar, field by field (`scripts/course_event_extractor.mts:302-372`):

| producer | line | location shape | positional? |
|---|---|---|---|
| tagline / jobRelevance | 304-305 | `sid.tagline` | stable |
| learning outcome | 306 | `sid.outcome[i]` | **index of `s.learningOutcomes`** |
| theory block key | 317-321 | `b.subtopicId` else `theory[i]` | **fallback = index of `s.theory`** |
| theory block key, repeated subtopicId | 320 | `<subtopicId>#i` | **`i` is the index in `s.theory`, not the nth repeat** |
| theory paragraph | 323 | `sid.<blockkey>.pj` | **index of `b.paragraphs`** |
| theory code/callout/figure/heading | 322-331 | `.heading` `.code` `.callout` `.figure` | stable *given* a stable block key |
| iDo step | 336 | `st.demoId` else `iDo[i]` | **fallback positional** |
| weDo step | 344 | `st.id` else `weDo[i]` | **fallback positional** |
| weDo hint list | 350 | `sid.<stepkey>.hint[j]` | **index of `st.hints`** |
| youDo objective/requirement/rubric | 359-362 | `sid.youDo.objective[i]` etc. | **positional** |
| selfCheck | 366-370 | `sid.selfCheck[i].q` / `.opt[j]` / `.explanation` | **positional** |
| resource | 372 | `sid.resources.doc[i]` | **positional** |

Only four location families are content-stable: `tagline`, `jobRelevance`, and the
`.heading/.code/.callout/.figure` of a theory block that (a) has an explicit `subtopicId` and
(b) is the *first* block carrying it. Everything else carries an ordinal.

`display_order` (`:264`) is a second, wholly positional key: it is `events.length` at push
time, i.e. a course-wide running counter. Inserting one paragraph in S05 renumbers the
`display_order` of every event in S05..S52.

The failure mode: `tools/fixer/gate.py:243` runs `npm run test:adversarial:node` as an
**absolute** gate, and `tools/fixer/run_concepts.sh:62-70` restores the section and `exit 1`s
on any gate failure. So one stale index in one `.test.mjs` file discards an entire round.

## Why fixing instances didn't stop it

The guard that exists, `tests/adversarial/concept-definition-detector.test.mjs:206-221`, is a
source-text grep of **one file** for **two spellings**:

```js
/defines\(\s*'[^']*(?:theory\[\d+\]|#\d+)/
```

Three independent reasons it cannot hold:

1. **It enumerates spellings, not the property.** `theory[N]` and `#N` were the two that had
   already fired. Seven other ordinal-bearing shapes exist (table above) and none is matched.
2. **It only inspects calls to the local helper `defines(`.** A pin written via
   `events.events.find((e) => e.location === ...)` — which this same file does four times —
   is invisible to it.
3. **It is scoped to its own filename**, hard-coded at `:208`. No other consumer is covered.

**The second fix is still incomplete in its own file.** These assertions in
`tests/adversarial/concept-definition-detector.test.mjs` pass the guard today and are
positional:

- `:163` `defines('security.S14-T2-B.p0', 'broadcasting')` — `p0` is `paragraphs[0]`
- `:164` `defines('data-engineering.S18-T3-A.p0', 'correlaci-n')`
- `:165` `defines('security.S14-T1-A.p0', 'dtype')`
- `:171-172` `defines('setup.S01-T3-B.p5', 'git')`, `defines('setup.S01-T3-B.p2', 'git')`
- `:184` `defines('data-engineering.S18-T1-A.p2', 'outlier')`
- `:178` `defines('computer-vision.S23-T1-B-E1.hint[1]', 'if')` — `hints[1]`
- `:64` `events.events.find((e) => e.location === 'setup.outcome[4]')` — `learningOutcomes[4]`
- `:268` `events.events.find((e) => e.location === 'setup.selfCheck[3].explanation')`

`.pN` is the most dangerous of these: a concepts round's commonest edit is adding a paragraph
to an existing theory block, which shifts every later `.pN` in that block. `setup.S01-T3-B.p5`
and `.p2` are in the same block, so one inserted paragraph in S01's T3-B breaks two assertions
at once. This is the *third* missed case, live right now, and it is the same shape as the two
already paid for.

## Blast radius (measured, with numbers)

### How a stale pin becomes a destroyed round

`tools/fixer/gate.py:244` runs `npm run test:adversarial:node` as an **absolute** gate;
`package.json` `test:adversarial:node` = `node --experimental-test-module-mocks --import tsx
--test tests/adversarial/*.test.ts tests/adversarial/*.test.mjs`. On any failure
`tools/fixer/run_concepts.sh:62-70` copies `.fixer/$TAG.pre-concepts.ts` back over the section,
restores seven derived reports, and `exit 1`s. One stale index anywhere in that glob discards
the whole round.

### Share of locations that carry an ordinal

Measured over the committed `course-state/concept_map.json` (the only committed artifact that
stores extractor locations at scale; `.fixer/events.json` is gitignored, and I did not run the
extractor, per the brief):

```
distinct locations                7717
  theory[N]  (block has no subtopicId)     391
  <subtopic>#N  (duplicate subtopicId)      36
  .pN        (paragraph ordinal)           913
  outcome[N]                                87
  selfCheck[N]                             321
  hint[N]                                  504
  youDo.objective|requirement|rubric[N]    141
  resources.doc[N]                         105
  iDo[N] / weDo[N] fallbacks                 0   (every step carries an explicit id)
  -------------------------------------------
  ANY positional                          2208   = 28.6% of all locations
  content-stable                          5509
```

`.pN` is the largest single family and is **not covered by the existing guard**.

### Which sections are landmines

- Theory blocks with no `subtopicId` (so their location is pure `theory[N]`): present in
  **48 of 52 sections**. Worst: `setup` 72, `functions-contracts` 25, `exceptions-logging` 18,
  `basics` 16, `wxpython-gui` 16, `cv-ai-integration` 14, `decisions-rules` 13, `security` 13.
- Duplicate `subtopicId` (so `#N`): only 4 sections — `setup` 18, `data-engineering` 9,
  `advanced-models` 5, `stdlib-deep` 4.
- `.pN`: **all 52 sections**.

All three destroyed rounds sit in high-count sections:
- **S05 = `functions-contracts`** (`src/lib/course/sections/s05-functions-contracts.ts`):
  `theory[N]` = 25 — second-highest in the course. This is the section the
  `theory[5].callout` / `theory[0].p1` pins named.
- **S15 = `stdlib-deep`**: `theory[N]` = 9, `#N` = 4, `.pN` = 34.
- **S33 = `advanced-models`**: `theory[N]` = 8, `#N` = 5, `.pN` = 17.

### Second-order harm: a renumbered pin can pass while guarding nothing

`assert.equal(defines('setup.S01-T3-B.p5', 'git'), false)` at
`tests/adversarial/concept-definition-detector.test.mjs:140`. If an inserted paragraph shifts
`p5` onto a different paragraph that also fails to define `git`, the assertion goes green while
testing a sentence nobody chose. The repo's own standard calls this the worst outcome
("tautological tests are worse than no test"). Only the `assert.ok(ev, ...)` arm — the location
vanishing entirely — fails loudly. So the destroyed rounds are the *visible* half of the
damage; the silent half leaves a green check on an unguarded rule.

### Consumer inventory — who reads an event `location`

Everything that reads `.fixer/events.json` or runs the extractor
(`grep -rn "events.json\|course_event_extractor"`):

**Gated and positional-pinning (round-destroying):**
- `tests/adversarial/concept-definition-detector.test.mjs` — 8 live positional pins
  (lines 61, 132, 133, 134, 140, 141, 149, 154, 277; list in the section above). Runs the
  extractor itself at `:27-30`, so it always sees the post-round tree. This is the only file
  in the repo that pins real locations, and it is the only one that has destroyed rounds.

**Gated, reads locations, does NOT pin them (computes fresh every run — correct):**
- `scripts/concept_map.py:36,84,91` — writes the locations, never asserts one.
- `scripts/first_use_all_audit.py:26,34` (gated as `first_use_issues`)
- `scripts/prose_quality_audit.py:28,92` (gated: `run_on_sentences`, `b5_per_100_sentences`)
- `scripts/code_switching_audit.py:39,122` (gated: `avoidable_english_per_1000`)
- `scripts/badge_readiness_audit.py:22,30`
- `tools/fixer/build_concept_prompt.py:103`, `build_redaction_prompt.py:31`,
  `build_prompt.py:17`, `build_critique_followup.py:61`, `verify_aliases.py:45`,
  `ledger.py:41-47`, `section_path.py:10`, `apply_patches.py:26`
  — these hand locations to codex as *labels*; the patch mechanism itself is anchor/content
  based (`apply_patches.py:137-155`), so a stale label costs a confusing prompt, not a
  rejected patch. I checked: no gated audit carries a location-keyed allowlist, baseline or
  waiver map (`grep -nE "ALLOW|WAIV|EXEMPT|BASELINE|EXPECTED|KNOWN"` over the nine gated
  scripts returns hits only in `scripts/check_section_structure.py:25-37`, and those are
  subtopic *ids*, not ordinals).

**Gated, uses positional literals that are purely synthetic (safe, and the right pattern):**
- `tests/adversarial/test_concept_prompt_weight.py:65,79` — `advanced-models.outcome[5]`
  inside a hand-built dict that is never matched against real events. Its docstring at
  `:15-22` already states the principle that this whole RCA is about: "A test whose fixture
  is the defect cannot survive the defect being fixed."
- `tests/test_glossary_first_use_audit.py:64,71,90,97` — `alpha.theory[8].p1`; `alpha` is not
  a course slug. Also not in `tests/adversarial/`, so not gated at all.

**Not gated; rots silently (documentation-grade harm, not round-destroying):**
- `course-state/code_switching_report.json` — 30 positional locations, regenerated each run.
- `audit/fixer/CONCEPT_QUEUE.md`, `OPEN_QUESTIONS.md`, `WORK_QUEUE.md`,
  `LEDGER_NOTES.md`, `DECISIONS_2026-09-21.md` — prose that cites locations by ordinal.
- `course-state/curriculum_hardening/audits/explorer_reports/S*_EXPLORER_REPORT.md` and
  `course-state/curriculum-agent/learner_runs/**/output.json` — archival, already stale.
- `audit/consolidated/registry.json` / `tools/audit/consolidate.py:38` — its `location` field
  is free-text from human auditors, a *different namespace* from the extractor's. Not affected.

## What the 19 rounds on disk actually did (measured, not inferred)

`.fixer/` in the worktree still holds 19 `S*k.result.json` files — codex's real concepts
patches. I read them (ran nothing). 85 patches total. Counting, for every patch, how many
array elements the replacement adds over the anchor:

| what a concepts round adds | patches | rounds |
|---|---|---|
| a new **theory block** (`heading:` count rises) | **18** | **15 of 19** |
| a new theory **paragraph** (`paragraphs[N]` grows) | **0** | 0 |
| a new **learningOutcome** | **0** | 0 |
| a new **selfCheck question** | **0** | 0 |
| a new **weDo hint** | **0** | 0 |

And the decisive one:

> **All 18 inserted theory blocks carry `subtopicId` delta = 0. Not one of them has a
> `subtopicId`.**

Sample of the inserted headings (`field_path` values are literally `theory`,
`theory (insert before S25-T1-A)`, `theory.before[S33-T3-B]`, `theory (supporting block
immediately before S09-T1-B)`):

```
S05k  'Anotaciones de tipo: una promesa visible, no una barrera'
S15k  'Antes de trabajar: una columna y una tabla'
S33k  'Antes de medir overfit: práctica contra datos apartados'
S34k  'ROC-AUC: qué mide y qué deja fuera'
S37k  'Generadores: procesar un lote a la vez'
```

This pins the mechanism exactly:

1. A round inserts a subtopicId-less block at index `k` of `s.theory`.
2. `scripts/course_event_extractor.mts:318` gives it `theory[k]` — and every **later**
   subtopicId-less block in that section becomes `theory[i+1]`. 48 sections have such blocks;
   `functions-contracts` (S05) has 25 of them.
3. `scripts/course_event_extractor.mts:320` computes the duplicate-subtopic suffix as
   `` `${at}#${i}` `` — **the array index**, not the occurrence count `nth` it computed on the
   line before. So the insert also renumbers every `#N` after `k`. That is S15's
   `stdlib-deep.S15-T4-B#10` → `#11`, and S33's `advanced-models.theory[10]` → `[11]`.
4. Blocks that *do* carry a `subtopicId` and are the first with it are untouched.

**So the risk ranking, from evidence rather than plausibility:**

- `theory[N]` and `#N` — **fire on essentially every round** (15/19 inserted a block). These
  are the two the existing guard covers, and they are covered because they already fired.
- `.pN`, `outcome[N]`, `selfCheck[N]`, `hint[N]`, `youDo.*[N]`, `resources.doc[N]` — **have
  not shifted in any of the 19 rounds**, because no round added an element to those arrays.
  The nine pins on them are *latent*, not imminent. I am saying this plainly because it
  changes what is urgent: the six `.pN` pins are real debt but they are not what is about to
  cost the next round.

The one patch that touched several fields at once (`S14k`, field_path
`tagline, jobRelevance, learningOutcomes, theory (before S14-T1-A)`) kept `text:` entries at
8 → 8: it rewrote outcomes, it did not add one. Nothing in the machinery *prevents* adding
one, though — `apply_patches.py` only checks that the anchor is unique and the file parses
(`tools/fixer/apply_patches.py:137-170`).

## Proposed guards

Ranked by measured payoff. G1 is the repo-wide net; G2 and G3 remove the thing the net is
catching, so the net stops being load-bearing.

### G1 — repo-wide scan for positional event pins (replaces the per-file guard)

- **File:** new `tests/adversarial/no-positional-event-pins.test.mjs`. Lands in the glob that
  `package.json`'s `test:adversarial:node` already runs, which `tools/fixer/gate.py:254`
  already calls, so it needs no wiring.
- **What it asserts:** after stripping comments, no file under `tests/ scripts/ tools/ src/`
  with suffix `.py .mjs .mts .ts .tsx .js .sh .json` contains a quoted string that
  (a) begins with a real section slug followed by `.` and (b) contains an ordinal segment
  — `theory[N]`, `<x>#N`, `.pN`, or any `[N]`.
- **Slug source:** for each module named by `from './sections/X'` in `src/lib/course/index.ts`,
  the first `` /\bid:\s*['"]([a-z0-9][a-z0-9-]*)['"]/ `` in that file. I verified this against
  the 52 slugs in `course-state/concept_map.json`: **exact set match, 52/52, zero nulls.**
  It reads no derived report and spawns no extractor, so unlike
  `concept-definition-detector.test.mjs:27-30` it adds no measurable time to the gate.
- **How it fails:** `assert.deepEqual(hits, [])` listing `file:line  <literal>`, with the
  remedy in the message — *address the event by a distinctive substring with
  `definingEvent(/re/)`, never by its index.*
- **Measured false-positive risk — I ran the scanner over this worktree:**
  - Without comment-stripping: 15 hits, 4 of them prose inside docstrings
    (`concept-definition-detector.test.mjs:175,236` citing the historical failures, and
    `scripts/glossary_first_use.py:7`). **Comment-stripping is mandatory**, not optional.
  - With comment-stripping: **11 hits.** Nine are the genuine live pins listed earlier. Two
    are `tests/adversarial/test_concept_prompt_weight.py:65,79`, a hand-built dict whose
    `'advanced-models.outcome[5]'` is never matched against real events.
  - Over `src/` — 52 section modules full of lesson Python like `rows[0]`, `steps[i + 1]`,
    `s.iloc[0]`, `np.where(mask)[0]` — **0 hits.** The slug-prefix requirement is what buys
    this; a bare `\[\d+\]` rule would light up hundreds of lines of teaching material.
  - **Recommended remedy for the two FPs: change the fixture prefix from `advanced-models` to
    a non-slug such as `fixture`.** The test never resolves the string, so the value is
    arbitrary. That lets G1 ship with **no opt-out marker at all** — and an opt-out marker is
    the next thing someone reaches for when a round is failing at 2am.
- **False negatives I am not hiding:** a pin built by concatenation
  (`` `${slug}.theory[${i}]` ``), one loaded from an untracked fixture, or one whose prefix is
  not a slug. G1 catches *string literals*, which is every pin this repo has ever written
  (11/11 of the ones present, including both that already destroyed rounds).

### G2 — `#${i}` → `#${nth}` in the extractor

- **File:** `scripts/course_event_extractor.mts:320`, `if (nth > 1) at = \`${at}#${i}\``.
- **What it asserts:** nothing; it removes a cause. `nth` is already computed on line 319 and
  is the occurrence count of that `subtopicId` within the section, so `#2`, `#3` are unique
  and stable. An insert elsewhere in `s.theory` no longer moves them.
- **Why it matters:** this is S15's exact failure. `S15-T4-B#10` → `S15-T4-B#11` becomes
  `S15-T4-B#2`, which moves only if a block is inserted *between two blocks already sharing
  that subtopicId*. Given that all 18 observed insertions were subtopicId-less, that is
  approximately never.
- **Cost:** one token. 36 location strings in `course-state/concept_map.json` change once.
  Only 4 sections are affected (`setup` 18, `data-engineering` 9, `advanced-models` 5,
  `stdlib-deep` 4). Nothing asserts on them once G4 lands.
- **False-positive risk:** none — it cannot fire.

### G3 — `theory[${i}]` fallback → a heading-derived key (highest payoff)

- **File:** `scripts/course_event_extractor.mts:317`,
  `let at = b.subtopicId ?? \`theory[${i}]\``.
- **Change:** `b.subtopicId ?? \`theory(${slug(b.heading)})\``, with the existing `nth`
  suffix (from G2) handling any repeat.
- **Why this is the big one:** `heading` is **required** on `TheoryBlock`
  (`src/lib/types.ts:39-41`) — not optional — so every block has one, and the 18 real
  insertions all wrote distinctive prose headings. This removes **391 positional locations
  across 48 sections**, the family that shifts on 15 of every 19 rounds. After G2 + G3, a
  concepts round inserting a subtopicId-less block renumbers **nothing**.
- **Cost:** 391 ids change once. The key then moves if a heading is rewritten — which a round
  does do, but far less often than it inserts, and when it happens the test *should* fail,
  because the thing it named is gone.
- **Prerequisite I did not verify:** heading uniqueness within a section. If two blocks in one
  section share a heading, the `nth` suffix covers it, but that path needs the same
  occurrence-based treatment as G2. Verify before landing.
- **False-positive risk:** none directly; the one-time id churn must land together with G4 or
  the detector test fails on the churn itself.

### G4 — remove the nine live pins in the detector test

- **File:** `tests/adversarial/concept-definition-detector.test.mjs`, lines 61, 132, 133, 134,
  140, 141, 149, 154, 277.
- **What to do:** the file already has the right tool — `definingEvent(re, term)` at
  `:239-243`, which finds the event by a distinctive substring. Rewrite each `defines(loc,
  term)` call as `definingEvent(/distinctive substring/, term)`. Lines 61 and 277 use
  `events.events.find((e) => e.location === ...)` directly and need the same treatment.
- **Why a regex beats any id:** it is invariant under insertion *and* under edits to
  surrounding text, and fails only when the pinned sentence itself changes. That is the
  smallest honest failure surface available.
- **Then delete** the per-file guard at `:206-221`; G1 supersedes it and a second, weaker copy
  of the same rule is how the `#N` case got missed.

### G5 — the adversarial gate reads a stale events cache

- **File:** `tools/fixer/gate.py:253-258`. The three `absolute_gate(...)` calls and
  `snippets_gate` run **before** `after = measure(tag)`, and `measure()` at `:97` is the only
  thing that rewrites `.fixer/events.json`. So while `test:adversarial:py` runs, that cache
  still holds the **snapshot** extraction — the tree as it was *before* the round.
- **Consequence:** `tests/adversarial/test_prose_measure_boundaries.py:84-93` reads
  `.fixer/events.json` and `skipTest`s if absent, so during a round check it asserts about
  pre-round content and cannot catch a regression the round introduced. It is a guard that
  quietly guards nothing.
- **Fix:** hoist one extractor run to the top of `check()` and let `measure()` reuse it; or
  make that test extract fresh the way `concept-definition-detector.test.mjs:27` does.
- **Not affected:** the gated *measures*. `scripts/first_use_all_audit.py:30-40` and
  `scripts/concept_map.py:84-91` always re-extract before reading.
- **False-positive risk:** none; it removes a false *negative*.

### G6 — a content-addressed id: I recommend against it for tests, and say why

The brief asks whether the extractor should emit a stable content-addressed id alongside the
positional one. My answer is that it solves half the problem and **would not have saved any of
the three destroyed rounds that G2+G3 do not already save**, at a cost that is small but not
free.

- A concepts round does two things: it **inserts** blocks and it **rephrases** text. A content
  hash is invariant under insertion and *not* invariant under rephrasing. A test pinned to
  `sha(text)` survives S33/S05/S15 and breaks the first time codex rewords the pinned
  sentence — which is squarely inside the round's remit.
- `definingEvent(/re/)` is invariant under both, and fails only on the narrower, correct
  condition. The repo already invented it (`:239`, with the reasoning in the comment at
  `:231-238`). The gap is not a missing id; it is nine call sites that never migrated.
- **Cost if added anyway:** ~6 lines in `push()` (`node:crypto` is available under tsx), one
  field on every event, and roughly 0.5 MB on a cache the file itself notes is already 9.2 MB
  and gitignored (`scripts/course_event_extractor.mts:256-262`). Plus collision handling for
  repeated short strings within one `section_id`+`kind`.
- **Where it would genuinely pay:** cross-round identity for artifacts that outlive a round —
  `audit/fixer/OPEN_QUESTIONS.md`, `CONCEPT_QUEUE.md`, `WORK_QUEUE.md`, the ledger. Those cite
  positional locations in prose today and are already stale (`OPEN_QUESTIONS.md` carries
  `theory[S39-T4-B].paragraphs[0]`, `weDo.steps[S39-T4-B-E2].preamble`). That is
  documentation-grade rot, not round destruction.
- **If it is added:** extend G1 to forbid tests from pinning the hash too. A hash in an
  assertion is the same mistake wearing a better hat.

**Landing order:** G4 → G1 (green on the same commit) → G2 + G3 together (one id churn) →
G5. G6 only if the queues are migrated to it.

## Confidence and what would refute this

**High confidence — read from source or computed here:**
- The location grammar table. Read directly from `scripts/course_event_extractor.mts:302-372`.
- `#${i}` uses the array index while `nth` sits unused on the line above (`:319-320`).
- 28.6% of the 7,717 distinct locations in `course-state/concept_map.json` carry an ordinal;
  the per-family and per-section counts. Computed here from the committed report.
- `heading` is required on `TheoryBlock` (`src/lib/types.ts:39-41`).
- The existing guard is one file, two spellings, and only inspects `defines(` calls
  (`tests/adversarial/concept-definition-detector.test.mjs:206-221`), and nine positional
  pins in that same file pass it.
- 18 blocks inserted across 15 of 19 rounds, none with a `subtopicId`; zero paragraphs,
  outcomes, questions or hints added. Counted from the 19 `.fixer/S*k.result.json` files.
- G1's scanner output: 11 hits with comment-stripping, 15 without, 0 over `src/`. I ran the
  scanner itself; I ran none of the repo's audit scripts.
- Gate ordering at `tools/fixer/gate.py:253-258`.

**Lower confidence, stated as such:**
- **That the nine remaining pins would have fired.** They have not, in 19 rounds. My claim is
  that nothing prevents them, not that they were about to. `apply_patches.py` accepts any
  patch whose anchor is unique and whose file parses (`:137-170`), so a round that adds a
  learning outcome or a paragraph is permitted; it just has not happened yet.
- **That heading-derived keys (G3) are collision-free.** I did not enumerate headings per
  section. If two blocks in a section share a heading, G3 needs G2's occurrence suffix.
- **Which round-restore each historical failure belongs to.** The `.fixer/*.gate-after.json`
  files all show `failed: []` — they record the *successful re-run*, not the destroyed
  attempt. My attribution of S33/S05/S15 to positional pins comes from the comments at
  `concept-definition-detector.test.mjs:200-215` and `:231-238`, which are testimony, not
  measurement.

**What would refute this:**
- A subtopicId on an inserted block in a future round would break G3's premise (the id would
  no longer be heading-derived) — harmless, but it means G3 buys less than claimed.
- If `#${i}` were intentionally the array index for some consumer that needs source order,
  G2 breaks it. I found no such consumer: `#N` appears only in `concept_map.json` (36 strings)
  and the detector test's docstring.
- If the two `test_concept_prompt_weight.py` fixture strings turn out to be matched against
  real events somewhere I did not find, G1 needs an opt-out after all and my "zero false
  positives" claim is wrong. I read the file (`:41-52`) and the dicts are hand-built; the only
  real data it loads is `CMAP` at `:37`, which it uses for a separate scan.
- If the adversarial gate is ever run outside `gate.py` in a context where `.fixer/events.json`
  is fresh, G5's finding is narrower than stated — but never wrong, since the staleness is
  possible either way.
