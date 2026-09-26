# RCA: stale `firstSectionId` in the glossary

All paths relative to the worktree
`/private/tmp/claude-501/-Users-pabloillescas-Documents-GitHub-pyarcana/cc134761-bb7b-4536-886e-875c53ae213c/scratchpad/mergewt`.
Nothing in it was modified. Measurements come from a read-only replica of the gate's own
matcher, `scratchpad/rca/measure.mjs`, run against the worktree's files.

STATUS: written incrementally. Sections appear as they are established.

## Root cause

`firstSectionId` is a **hand-written editorial claim that was never re-derived after the
curriculum was rewritten**, and the gate that checks it is a *global* check run inside a
*per-section* round.

Three facts, each with evidence:

**1. The values were authored against the pre-V3 curriculum.**
`src/lib/glossary/terms.ts:1` still says `/** Auto-generated glossary SSOT ... */` but there is
no generator anywhere in the repo — `grep -rn "Auto-generated glossary SSOT"` matches that one
line and nothing else. The file was introduced on 2026-07-20 in commit `960d8ff1`
("feat(ux): glossary hover hints…", 73 terms) against a curriculum whose section ids were
`pandas`, `numpy`, `sklearn`, `oop`, `visualization`, `rpa-automation`, `data-structures`,
`functions-modules`, `data-acquisition`. Those section files are still on disk, unreferenced by
`src/lib/course/index.ts`: `src/lib/course/sections/s07-pandas.ts:4` (`id: 'pandas'`),
`s08-visualization.ts:4`, `s09-sklearn.ts:4`, `s10-testing.ts:4`, `s11-advanced-topics.ts:4`.

**2. The V3 rename preserved the *slot*, not the *meaning*.**
Commit `a492d8ea` ("fix(course): give S01-S13 ids that describe what the sections teach",
2026-09-16) renamed thirteen section ids and rewrote **19 `firstSectionId` values** in
`terms.ts` by mechanically applying `SECTION_ID_RENAMES`
(`src/lib/section-id-migrations.ts:16-28`). That map is a *storage* migration — its job is to
keep a learner's saved progress pointing at the same slot (`src/lib/section-id-migrations.ts:2-12`).
Applying it to an editorial claim moves the claim to a section that teaches something else:

| terms | old id (what it meant) | new id (what that slot now teaches) |
|---|---|---|
| 5 | `rpa-automation` | `evidence-dashboard` |
| 3 | `numpy` | `collections` |
| 3 | `functions-modules` | `iteration-summaries` |
| 2 | `pandas` | `files-ingestion` |
| 2 | `data-structures` | `decisions-rules` |
| 1 each | `visualization`, `sklearn`, `oop`, `data-acquisition` | `exceptions-logging`, `modules-packaging-cli`, `functions-contracts`, `text-unicode-regex` |

A scikit-learn term now declares its first teaching in the **modules/packaging/CLI** section.
Nothing in that section teaches it. The value is not "slightly off" — it is a coordinate in a
curriculum that no longer exists.

**3. The gate is global, the round is local — so the failure is not caused by the round.**
`tests/adversarial/glossary-first-use.test.mjs:63-88` scans **every** section's prose for
**every** term. A concepts round edits one section. If that section's new prose happens to
contain a word that some *other*, later section declares, the measure rises and
`tools/fixer/run_concepts.sh` restores the section — destroying work that was itself correct.
The Spanish was never the problem, and that is exactly what the record shows: ~75 patches, zero
rejected.

## Why fixing instances didn't stop it

Each of the three catches (`pytest` S27→S10, `F1-score` S34→S25, `Overfitting` S33→S07) was
fixed by moving *one* term. The fixes are in the log —
`1dd59c2f feat(s10): teach pytest where the learner first meets it`,
`b9297abf feat(s25): teach F1 before the exercise that forbids confusing it`,
`396f4bdc feat(s06,s07): teach overfitting where it first bites, not 26 sections later`
— and each closed exactly one term out of 106. The population was never measured, so the rate
of arrival never changed.

Worse, **the gate cannot find a stale term until a round writes prose that happens to use it.**
That is the "found only when a round happens to teach the term" observation, and it is
structural, not bad luck:

- **33 of 106 terms (31%) are never matched anywhere in learner prose** by the gate's own
  matcher. For those the gate is vacuous — `firstUse` is `undefined`, the `if` at
  `glossary-first-use.test.mjs:83` is skipped, and the declared value is unchecked. It becomes
  checked, and fails, the first time any round writes the word. Examples with their declared
  section: `Train/test split` S30, `MLOps` S47, `Hyperparameter tuning` S36, `StandardScaler`
  S36, `Feature engineering` S32, `defaultdict` S30, `Coverage` S27, `Data leakage` S19,
  `Distribución normal` S18, `namedtuple` S40, `Dunder method` S11.
- **67 of 106 terms (63%) are declared at *exactly* their current first use** — zero margin.
  Only 6 terms are declared strictly earlier than their first use. So for two thirds of the
  glossary, a single new sentence one section earlier flips the gate red.
- **Exposure is 1,294 term×section pairs.** Summing `declared_index - 1` over all terms: that
  is the number of (term, section) combinations in which a round writing one word destroys
  itself. 54 terms are declared at S11 or later, i.e. at least ten sections of exposure each;
  21 terms have 21+ sections of exposure.

Documentation cannot reach this. The author of a round is codex, writing Spanish about the
section in front of it; the landmine is a declaration in a different file about a different
section.

### The two mechanical amplifiers

**(a) The absolute gates are never run before the round.**
`tools/fixer/run_concepts.sh:31` calls `gate.py snapshot`, and `snapshot` runs **only**
`measure()` (`tools/fixer/gate.py:283-292`). The four absolute gates — `test:v3`,
`adversarial (node)`, `adversarial (py)`, snippets — appear only in `check()`
(`gate.py:253-256`). `glossary-first-use.test.mjs` runs inside `test:adversarial:node`
(`package.json:49`). So a round that starts with that test **already red** is
indistinguishable from a round that turned it red, and pays the same price:
`run_concepts.sh:59-68` restores the section, restores the derived reports, and `exit 1`s the
chain — after codex has already been paid for.

**(b) The round cannot repair the thing that destroys it.**
`tools/fixer/apply_patches.py:93-95` resolves exactly one target, `section_file(slug)`, and
`run_concepts.sh:60` restores exactly `${TAG}.pre-concepts.ts`. `src/lib/glossary/terms.ts` is
outside the round's write scope. When the correct fix is "move this term's declaration", the
round cannot make it, cannot pass, and is restored; the fix then lands as a separate human
commit *after* the work was thrown away. That is precisely the shape of
`1dd59c2f`, `b9297abf` and `396f4bdc`.

**(c) A round that is *right* makes the glossary *more* stale, silently.**
The most recent commit on this branch, `bf47bb86 feat(s40): drop NamedTuple, which the section
names but never uses`, correctly removed `NamedTuple` from `s40-architecture-ddd.ts`. It did not
touch `terms.ts` (`git show --name-only bf47bb86` matches no glossary file). `namedtuple` still
declares `firstSectionId: 'architecture-ddd-decisions'`, and **the string `namedtuple` now
appears nowhere in that section's file at all.** No gate fired. The next round that writes the
word anywhere in S01–S39 will be destroyed by a declaration a previous round invalidated.

## Blast radius (measured, with numbers)

Method: `scratchpad/rca/m2.mjs` re-implements `glossary-first-use.test.mjs`'s own extraction
(`paragraphs:` arrays only, strings ≥20 chars) and its own matcher
(`glossary-first-use.test.mjs:77-81`), over the 52 sections `src/lib/course/index.ts` imports.
Entries parsed per-block so comment lines between `term:` and `aliases:` do not drop aliases:
**106 terms, all with an `aliases` array.**

**Under the gate's own matcher (term string only, backtick-guarded):**

| | |
|---|---|
| terms late today | **0** — the suite is green, which is why this class keeps ambushing rounds |
| terms whose canonical string never appears in any section's prose | **33 / 106 (31%)** — for these the gate is *vacuous*: `firstUse` is `undefined` and `glossary-first-use.test.mjs:83` never evaluates |
| terms declared at *exactly* their current first use (zero margin) | **67 / 106 (63%)** |
| terms declared strictly earlier than first use (any margin at all) | **6 / 106** |
| exposure: Σ(declared_index − 1) | **1,294 term×section pairs** in which one new sentence fails the round |
| terms declared at S11 or later (≥10 sections of exposure each) | **54**; 21 of them have 21+ |

**Under-reporting, quantified.** Two knobs, measured separately against the same corpus:

| matcher | late terms | Σ sections late | worst |
|---|---|---|---|
| term only, backtick guard (**the gate as written**) | 0 | 0 | — |
| term only, backtick guard removed | 2 | 9 | 7 |
| term **+ aliases**, backtick guard (what the hover matches) | **7** | 37 | 13 |
| term + aliases, no backtick guard | **8** | 44 | 13 |

The seven the gate cannot see, because it matches only the `term` field:
`Outlier` declared S16 first used S03 (**13 late**), `Train/test split` S30 vs S19 (11),
`Missing values` S14 vs S09 (5), `Desempaquetado` S06 vs S02 (4), `return` S05 vs S03 (2),
`if / condicional` S03 vs S02 (1), `Excepción` S03 vs S02 (1).
Aliases are not decoration: `src/components/course/RichText.tsx:394` iterates
`term.aliases`, so **the hover matches everything the gate does not**. Counted the hover's way,
**83 of 106 terms sit at zero margin**, not 67, and only 12 terms — not 33 — are invisible.

The backtick knob is smaller and **noisier**: removing the guard adds
`return` (S03, backticked throughout `s03-decisions-rules.ts:141-153`), `Merge` (S10),
`.gitignore` (S01), `Tuple` (S05), `defaultdict` (S30). Note the guard is not "skip code": it
excludes a term with a backtick *immediately before it*, so `` `merge` `` is skipped while
`` `df.merge` `` still matches. `RichText.tsx:380` masks the **whole** code span, so a
backticked term genuinely has no tooltip — the guard is defensible for "was a hint available"
and wrong for "did the learner meet the word".

**Terms declared at a section that does not contain them.** This is the staleness itself,
measured three ways (all with aliases, no backtick guard):

- **15 / 106** do not appear in their declared section's learner paragraphs.
- **8 / 106** do not appear **anywhere in that section's source file, including code and
  comments** — verified term-by-term by direct grep of every alias:
  `args y kwargs` → `basics` (S02) [aliases `args y kwargs`, `kwargs`, `**kwargs`, `*args`: 0 hits],
  `namedtuple` → `architecture-ddd-decisions` (S40) [0],
  `apply` → `decisions-rules` (S03) [0],
  `SHAP` → `advanced-models` (S33) [0],
  `Hyperparameter tuning` → `ai-apis-advanced` (S36) [aliases incl. `hiperparámetro`: 0],
  `Distribución normal` → `data-engineering` (S18) [0],
  `Embedding` → `evidence-dashboard` (S13) [`embedding`/`embeddings`: 0],
  `Estimando` → `data-engineering` (S18) [`Estimando`/`estimand`: 0].

A beginner section (S02 `basics`) claiming to introduce `*args`/`**kwargs` is the pre-V3
fingerprint, not an editing slip.

**Prior attempts, and why the number did not stay fixed.** `audit/fixer/LEDGER_NOTES.md:338-347`
records the same diagnosis on 2026-09-17: "Seventeen `firstSectionId` values named a section
where the term never appears", traced to pre-V3 slugs and to the retired `s09-sklearn.ts`,
`s10-testing.ts`, `s11-advanced-topics.ts`; **26 entries were repointed**. Eight days later the
count is 8 by the strictest test and 15 by the prose test. The repointing was to "the section the
concept map says teaches them" — another hand-written judgement, with no artifact keeping it
true — so the population regenerates every time a round legitimately moves or removes a word
(`bf47bb86`, above).

## Proposed guards

Ordered by (value to the campaign) ÷ (risk of destroying correct work). G1 alone would have
saved all three known rounds; it is also the smallest.

### G1 — the round refuses to start on a gate that is already red
**File:** `tools/fixer/gate.py` (`_run`, :283-292) and `tools/fixer/run_concepts.sh:31`.
**What it asserts:** the four absolute gates are evaluated at `snapshot`, not only at `check`.
If any is red **before** codex runs, `snapshot` returns non-zero and `run_concepts.sh:31`'s
existing `|| { echo "!! $TAG snapshot failed"; exit 1; }` stops the chain with the section
untouched.
**How it fails:** `FAIL snapshot S24: adversarial (node) already red — glossary-first-use >
no term is introduced later than the section that first uses it`, and nothing is written,
patched, restored or spent.
**False-positive risk: essentially zero.** It can only refuse work that was going to be
destroyed anyway, and it never fires on a clean tree. The real cost is a *trade-off, stated*:
a course-wide invariant that is red for reasons unrelated to this section now blocks the
section. That is the correct default here — the alternative is the status quo, where it
blocks the section *after* paying for it — but if the owner wants rounds to proceed, the
strictly-better version is G1b.

### G1b — attribute absolute-gate failures to the round that caused them
**File:** `tools/fixer/gate.py`, `absolute_gate()` (:154-162) and `check()` (:253-256).
**What it asserts:** for `test:adversarial:node`, record the **set of failing test names** at
snapshot (`node --test --test-reporter=tap|json ...`, available on this repo's Node
`v24.13.1`) and again at check; the round fails only on a test name that is newly failing.
**How it fails:** `FAIL adversarial (node): newly failing — glossary-first-use > no term is
introduced later…` versus `---- adversarial (node): 1 test already failing before this round
(not attributed)`.
**False-positive risk: low.** The one real risk is a flaky or order-dependent test flipping
between runs and being blamed; the 33 `.test.mjs`/`.test.ts` files here are pure file readers,
so that is unlikely but not impossible. Mitigation: on a newly-failing name, re-run that one
file once before failing the round.

### G2 — a term must appear in the section it claims to introduce
**File:** new `tests/adversarial/glossary-declared-section-contains-term.test.mjs`.
**What it asserts:** for every entry in `src/lib/glossary/terms.ts`, at least one of
`[term, ...aliases]` matches the **source file** of the section whose `id === firstSectionId`,
using the shared `aliasIsAcronym` casing rule (`terms.ts`, re-used by the hover, the extractor
and both Python audits — `LEDGER_NOTES.md:348-355`).
**How it fails:** immediately, in the same round, naming each term, its declared section and
the aliases that were searched. Today it fails on the 8 listed above. It is the *only* guard
that fires on `bf47bb86`-shaped rounds — the ones that make the glossary stale by correctly
deleting a word — and it fires while the author is still in the file that caused it.
**False-positive risk: low, and bounded by matching the whole file rather than prose.** A
section that introduces a term only in code still passes. The realistic false positive is a
term whose section teaches the idea under a Spanish name absent from `aliases` — `Estimando`
is the likely instance. Both repairs (add the alias, or move the id) are one line and both are
correct. **Seed it as a ratchet** with today's 8 in an explicit, commented allow-list, in the
style CLAUDE.md already uses for `scripts/complexity_gate.mjs`: the count may fall, never rise.
A hard failure on all 8 on day one would itself destroy the next round.

### G3 — one matcher, imported by all three callers
**Files:** `src/components/course/RichText.tsx:380-402`,
`tests/adversarial/glossary-first-use.test.mjs:77-81`, `scripts/course_event_extractor.mts`.
**What it asserts:** a single exported `matchesTerm(term, text)` / `firstUseOf(...)`, plus a
test that the hover's answer and the gate's answer agree on the first-use section for all 106
terms.
**Why:** measured divergence above — the gate misses 7 late terms the hover's own matcher
finds, and is blind to 33 terms where the hover is blind to 12. "The gate is green" does not
today mean "the hint was available."
**False-positive risk: HIGH if mis-landed, and this is the one to be careful with.** Simply
switching the gate to alias matching turns it red on 7 terms at once, and at least one is a
**documented false positive**: `s10-modules-packaging-cli.ts:333` writes "Aquí `merge` solo
forma parte del nombre de la función … no es la operación de tablas que aprenderás después" —
prose that anticipates and disclaims the term, and that an alias matcher convicts.
`LEDGER_NOTES.md:530-556` and `OPEN_QUESTIONS.md:492-497` record the same homonym problem and
state that span-claiming must land in all three matchers first. **Land G3 as a
reported-not-gated measure** (gate.py's `INFORMATIONAL` prefix, :188-197) until the homonym
exclusions exist. Do not make it fail a round.

### G4 — derive `firstSectionId`, from teaching events, not from first use
**Verdict: yes, derive it — but the source must be `defines`, not earliest use.**

Deriving from **earliest use** is the obvious move and it is wrong, twice over:
`TermHint.tsx:32` renders `sectionTitle(term.firstSectionId)` to the learner as where the term
was introduced, so a first-use derivation would tell a learner `Merge` is introduced in S10,
where the prose explicitly says it is not; and it makes
`glossary-first-use.test.mjs` compare a value against the thing it was computed from — a
tautological green check, which `AGENTS.md` ranks below having no test.

Deriving from **`defines` events** keeps both honest. `scripts/course_event_extractor.mts`
already emits `defines` / `mentions` / `requires`, and `scripts/glossary_first_use.py:60-62`
already consumes them.
**File:** a committed `course-state/glossary_first_section.json`, regenerated by `measure()`
(`gate.py:84-152`), added to `run_concepts.sh`'s `REPORTS` list (:16-25) so a restore restores
it, plus a test asserting `terms.ts` matches it.
**How it fails:** as a reviewable diff in the round that moved the teaching, not as an ambush
eight sections later.

**What breaks if it is derived — each named, none absorbed:**

1. **`termsAvailableAt` (`src/lib/glossary/index.ts:18-26`).** It hides a term's hover until
   `firstSectionId`. Pointed at the *definition*, every use before the definition loses its
   tooltip — exactly the harm the test exists to catch. The field is doing two jobs at once,
   and that conflation is why a **content** round dies on a **hover-availability** policy. The
   clean split: `definedInSectionId` (derived from `defines`; what `TermHint` displays) and
   availability = `min(first use, definition)` (or no availability gating at all). Until that
   split lands, deriving alone does not remove the class.
2. **`TermHint.tsx:32`** — safe under a `defines` derivation, broken under a first-use one.
3. **`scripts/glossary_intro_audit.py`, `scripts/glossary_coverage_audit.py`** read the field.
   `LEDGER_NOTES.md:343-347` already records that "a green glossary gate can be bought with
   wrong data" — pointing a term early scores zero forward references, and honest values took
   that audit from 4 to 18. Expect those numbers to move once and need re-baselining; that is a
   real cost, not a reason to keep the field hand-written.
4. **Terms with no `defines` event at all.** 12 of 106 are matched nowhere in prose even with
   aliases; 8 appear nowhere in their declared section's file. The pipeline needs a decided
   answer — drop the entry, or keep an explicit override carrying a reason — and without that
   decision a derived pipeline **will fail on correct work**. This is the owner's call and the
   single biggest unknown in this proposal.
5. **`defines` detection is heuristic.** `LEDGER_NOTES.md:530-540`: the detector's verbs were
   added "on measured effect", and a five-verb expansion changed exactly two events. If the
   derived table is regenerated inside the gate and trusted silently, a heuristic drift
   rewrites editorial claims with nobody reading them. Committing the table and asserting
   equality turns drift into a diff.

### G5 — let the round fix what the round breaks
**Files:** `tools/fixer/apply_patches.py:93-95`, `tools/fixer/run_concepts.sh:60`.
**What it asserts:** a patch kind that may write `src/lib/glossary/terms.ts` (restored
alongside `${TAG}.pre-concepts.ts` on failure). Today the correct fix is structurally
unreachable from inside a round; `build_concept_prompt.py:109,219` already hands codex the
glossary entries, so it is being asked to write around a file it cannot touch.
**False-positive risk:** this widens the blast radius of a bad round from one section to the
course-wide glossary. Only worth doing with G2 in place, which makes a bad glossary edit fail
immediately.

### G6 — stop erasing the evidence
**File:** `tools/fixer/run_concepts.sh:30`.
`rm -f .fixer/${TAG}k.* ".fixer/$TAG.gate-before.json" ".fixer/$TAG.gate-after.json"` runs at
the top of every round, so a **retry deletes the failed round's record**. All 19
`.fixer/*.gate-after.json` in the worktree read `failed: []`; not one of the nine destroyed
rounds left a trace. Append-to-timestamped instead of overwrite. Zero false-positive risk, and
without it the next RCA also has to reconstruct from `git log`.

## Confidence and what would refute this

**High confidence (directly verified in files):**
- The 8 terms whose declared section's file contains neither the term nor any alias — grepped
  per alias, listed above with counts of 0.
- The remap of 19 `firstSectionId` values through `SECTION_ID_RENAMES` in `a492d8ea`
  (`git show a492d8ea -- src/lib/glossary/terms.ts`, and `src/lib/section-id-migrations.ts:16-28`).
- `snapshot` does not run the absolute gates (`gate.py:283-292` vs `:253-256`).
- `run_concepts.sh:59-68` restores and exits on any gate failure, including a pre-existing one.
- `bf47bb86` removed `NamedTuple` from S40 and did not touch `terms.ts`.
- The hover matches aliases (`RichText.tsx:394`), the gate does not
  (`glossary-first-use.test.mjs:51,79`).
- "Auto-generated glossary SSOT" (`terms.ts:1`) with no generator in the repo.

**Medium confidence:**
- The lateness counts (0 / 2 / 7 / 8) reproduce the gate's extraction and matcher but are my
  re-implementation, not the gate. I did not run the gate — the task forbids it and a lock
  refuses it. A run of `npm run test:adversarial:node` would confirm the 0.
- "63% of terms sit at zero margin" uses first-use-equals-declared as the proxy for margin.
  A term can be at zero margin and still be safe if the word is unwritable earlier.
- I could not find a per-round record of the nine destroyed rounds (G6 explains why), so the
  attribution of specific rounds to this class rests on the task statement plus the three
  repair commits `1dd59c2f`, `b9297abf`, `396f4bdc`.

**Low confidence / explicitly unsure:**
- Whether `Estimando`, `apply` and `Distribución normal` are stale declarations or terms whose
  section teaches the idea under wording missing from `aliases`. G2 cannot tell these apart,
  which is why it is proposed as a seeded ratchet rather than a hard failure.
- I did **not** measure anything from the `wide` (all learner strings) corpus in the numbers
  above: scanning a whole `.ts` file with a `"…"|'…'` alternation mis-pairs quotes around
  apostrophes and code, and my first pass produced an inconsistent superset. Any claim that
  needs headings, callouts or `edgeCases` must go through the extractor's events, not a regex
  over source.

**What would refute this:**
- If `npm run test:adversarial:node` is red on this worktree *today*, then G1 is not merely a
  saving — every round on this branch has been failing for a pre-existing reason, and the
  ordering of the whole campaign is wrong.
- If the 8 absent terms turn out to be absent because the extractor's events *do* record a
  `defines` for them in those sections (via wording my regex cannot see), then G2's premise is
  wrong and G4's `defines` derivation is the only sound guard.
- If `termsAvailableAt` is not actually reached for the surfaces where these terms appear —
  i.e. `sectionId` is undefined at those call sites, so `glossary/index.ts:19` returns every
  term — then the *learner-visible* harm is nil and this whole class is a gate artefact, to be
  fixed by relaxing the gate rather than by repairing 106 declarations. I did not verify the
  `sectionId` plumbing into `RichText` for every surface; `CONCEPT_QUEUE.md:1122` asserts it is
  passed for theory, iDo and weDo prose, which I did not independently check.
