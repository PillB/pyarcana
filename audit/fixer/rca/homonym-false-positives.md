# RCA — homonym false positives in the concept map

**Status: in progress.** Written incrementally; everything below is established and cited.

Repo read-only: `/private/tmp/claude-501/-Users-pabloillescas-Documents-GitHub-pyarcana/cc134761-bb7b-4536-886e-875c53ae213c/scratchpad/mergewt`

## Mechanism (established first, so later sections can refer to it)

- `scripts/course_event_extractor.mts:248-276` builds one regex **per glossary term** from
  `[t.term, ...t.aliases]`, sorted longest-first *inside that term's own alternation only*
  (line 251-253). There is no cross-term arbitration anywhere in the file.
- `scripts/course_event_extractor.mts:295-308`: every term is tested independently against
  every event's text; the first hit pushes `term.id` onto `mentions`. Matching is
  case-insensitive (`'giu'`, line 268) for non-acronym aliases.
- `scripts/concept_map.py:118-136` turns each `mentions` entry into a `uses` record;
  `scripts/concept_map.py:160-177` computes `surprising_uses` = every visible use that
  precedes `first_definition` (or *all* visible uses when the concept has none).
- `tools/fixer/gate.py:113-115` gates on `surprising_uses_course_wide` (sum of all
  `surprising_uses`) and `surprising_uses_in_section`. Both are hard-gated: any rise
  fails the round and `tools/fixer/run_concepts.sh` restores the section.

So a homonym match is not cosmetic: it is a gated number.

## Method (stated so it can be attacked)

I could not run the repo's scripts (forbidden, and they write shared reports). Instead I wrote a
**read-only probe**, `/private/tmp/claude-501/-Users-pabloillescas-Documents-GitHub-pyarcana/cc134761-bb7b-4536-886e-875c53ae213c/scratchpad/probe/dump.mts`, that imports the same
`COURSE_SECTIONS` and `GLOSSARY_TERMS` and rebuilds the *same* alias regexes and the *same*
event walk as `scripts/course_event_extractor.mts:248-400`, but emits, for every hit, the
matched literal and 60 characters of context on each side. It writes nothing.

Joining that against the committed `course-state/concept_map.json`, **all 268
`surprising_uses` resolved to a concrete matched literal with zero misses**, so the committed
map and the current sources agree and the evidence below is the text the extractor actually saw.
Artifacts: `/private/tmp/claude-501/-Users-pabloillescas-Documents-GitHub-pyarcana/cc134761-bb7b-4536-886e-875c53ae213c/scratchpad/probe/surprising_with_text.json`.

Classification rule used (applied to the matched literal *in its context*):

- **H — homonym**: the matched text is an ordinary Spanish or English word, a title, or an
  identifier the section defines itself, and a reader would not say the glossary concept is
  present. Counting it is pure noise.
- **G — genuine**: the matched text really is the concept (Python keyword, library call,
  the Spanish term used technically). Counting it is correct *as a mention*; whether it is
  *surprising* then depends on the definition detector, not on alias matching.

## Where the 268 live (measured)

Totals from `course-state/concept_map.json` (my own read, not a script run):

| | |
|---|---|
| `surprising_uses` summed over all concepts | **268** |
| of those, concepts that are not L0 | 253 (the 15 remainder are L0 concepts, whose *every* visible use is listed — `concept_map.py:177`) |
| S02 + S03 + S04 | **202** (81 / 61 / 60) |
| concepts contributing | 32 |

Concentration by concept: `for` 105, `dict` 33, `pipeline` 18, `exception` 14, `pivot-table` 12,
`reshape` 9, `outlier` 8, `llm` 7, `if` 6, `return` 6, `merge` 5, then a tail of 26 concepts
with ≤4 each.

## Root cause

`scripts/course_event_extractor.mts:248-276` decides that a glossary concept is *present* by a
single test: **does any alias string occur with a non-letter on each side?** There is no other
evidence required — not part of speech, not the surrounding noun phrase, not whether the text
is code the section itself wrote, not what the other terms matched at the same offset.

Three separable defects follow, all at that one site:

1. **Ordinary words are aliases.** `function`'s aliases are
   `['función','funciones','def','function','functions']` (`src/lib/glossary/terms.ts:37`);
   `set` is `['Set']` (`:471`); `for` is `['bucle for','bucles for','for']` (`:77`);
   `correlaci-n` is `['Correlación']` (`:794`). Course-wide these fire
   3,595× (`if`), 3,008× (`def`), 2,075× (`for`), 1,692× (`dict`), 886× (`set`),
   271× (`función`) — measured from the probe. Every one of those is a candidate `use`.
2. **No cross-term arbitration.** The longest-first sort at
   `course_event_extractor.mts:251-253` is **inside one term's own alternation**
   (`[...new Set(raw)].sort(...)` where `raw = [t.term, ...t.aliases]`). Terms are then matched
   independently in the loop at `:295-308`. Confirmed by measurement: **59 overlapping
   cross-term hit-pairs course-wide, in 5 pairs** — `list`/`list-comprehension` ×21,
   `precision`/`recall` ×18, `commit`/`conventional-commits` ×16,
   `dict`/`dict-comprehension` ×3, `function`/`generator` ×1. e.g.
   `"Dict comprehension id→status"` (S04 hint) is counted as a use of **both** `dict` and
   `dict-comprehension`; `"Una **función generadora** entrega valores…"` (S37) counts as a use
   of both `generator` and `function`.
3. **A homonym can be credited as a *definition*, and the reward flows backwards.**
   `definesTerm()` (`:207-240`) runs its cue regexes against the *match span*, with no check
   that the span is the head of the noun phrase. So
   `"Un **identificador de correlación** es el mismo texto corto…"`
   (`src/lib/course/sections/s09-exceptions-logging.ts:336`) satisfies POST_CUE (`es el`) for
   the term `correlaci-n`, and `course-state/concept_map.json` now records
   `correlaci-n.first_definition = exceptions-logging.theory[8].p0` at depth **L2**.
   The course's statistical-correlation concept is officially defined by a paragraph about
   **log correlation IDs**.

Defect 3 is the one that makes this worse than noise: it is *self-reinforcing*.
`d89471a2 fix(glossary): repair the term matcher, then the 54 terms it was hiding` re-pointed
30 terms' `firstSectionId` at "where the term first appears", and for `correlaci-n` that moved
it `pandas` → `visualization` (the old id of the exceptions section) and then
`a492d8ea` renamed it to `exceptions-logging` (`src/lib/glossary/terms.ts:797`). A homonym
occurrence thus became the glossary's declared teaching site, which is what the campaign then
targeted, which is what a later round satisfied by writing a real correlation-ID subtopic at
`s09-exceptions-logging.ts:334-336` — a genuinely good paragraph that moved a gated number by
teaching **a different concept from the one being counted**.

## Blast radius (measured, with numbers)

### How many of the 268 are homonyms — the answer is *not* most of them

I adjudicated all 268 by reading the matched literal in context (evidence file above). Counts:

| class | uses | share |
|---|---:|---:|
| **H — clear homonym** (matched text is not the concept) | **10** | 3.7% |
| **B — borderline** (ordinary Spanish / sense-drift; a careful reviewer could go either way) | **22** | 8.2% |
| **G — genuine concept mention** | **236** | 88.1% |

**The clear homonyms (10), with citations:**

| concept | n | where | matched text |
|---|---:|---|---|
| `correlaci-n` | 3 | `src/lib/course/sections/s09-exceptions-logging.ts:43, :45, :59` | "identificador de correlación" — a log correlation ID |
| `merge` | 3 | `s10-modules-packaging-cli.ts:333` (theory), `:1846` (weDo title "Merge de config"), `:1865-1867` (`def merge(defaults, file_cfg, env_cfg, flags)`) | a local config-merge function |
| `for` | 3 | `s02-basics.ts:2556`, `s03-decisions-rules.ts:2516` ("Python for Everybody"), `s03-decisions-rules.ts:2143` ("N cases for N branches") | the English preposition |
| `set` | 1 | `s01-setup.ts:2122` ("# Éxito: set acotado + plan de ampliación", inside a Ruff `select = [...]` exercise) | English "set" |

`s10-modules-packaging-cli.ts:333` is the strongest single piece of evidence in this whole
analysis: the prose *already says in Spanish* "Aquí `merge` solo forma parte del nombre de la
función … no es la operación de tablas que aprenderás después." Codex wrote a disclaimer and
the extractor counted the disclaimer as three uses of the pandas concept.

**The borderline 22:** `outlier` ×8 in S03 ("valor atípico" as everyday quality-control
Spanish; the statistical term is declared at S16), `reshape` ×9 in S17 (glossary defines the
NumPy `arr.reshape`, `src/lib/glossary/terms.ts:553`; S17 means pandas long/wide), plus
`entity-resolution` ×2 (the bare acronym `ER`), `if` ×1 (a bash `if` inside a shell comment,
`s01-setup.ts`), `onehotencoder` ×1, `shape` ×1.

**The 236 genuine ones are the real story of the 268.** The three sections holding 202 of them
break down as: S02 = `for` 21, `dict` 18, `exception` 14, `pipeline` 13, `if` 5, `return` 5,
`parameter` 3, `function` 2; S03 = `for` 40, `outlier` 8, `dict` 7, `truthiness` 3,
`pipeline` 2, `return` 1; S04 = `for` 44, `dict` 8, `dict-comprehension` 4, `pipeline` 3,
`list-comprehension` 1. Every `for` and `dict` hit I inspected is a real Python `for`/`dict`.
`for`'s `first_definition` is `iteration-summaries.S04-T1-A-E2.preamble` — a weDo preamble —
even though `iteration-summaries.S04-T1-A.p0` says
"piensa primero en **`for`**. `for x in lista` entrega cada valor una vez y en orden", which is
a definition the detector cannot see (`isMarkedSubject` at
`course_event_extractor.mts:124-127` requires the closing mark right after the term, and here
the marked span is a whole expression). **So ~75% of the 268 is a definition-detector
false negative wearing homonym clothing.** If my assignment is the headline number, the honest
finding is that suppressing homonyms moves it by single digits.

### What the homonyms actually cost — the damage is qualitative, not the count

`correlaci-n` is the whole case in one concept:

- `course-state/concept_map.json` records
  `correlaci-n.first_definition = exceptions-logging.theory[8].p0`, depth **L2**.
  That paragraph (`s09-exceptions-logging.ts:336`) defines a **correlation ID**.
- `src/lib/glossary/terms.ts:797` declares `firstSectionId: 'exceptions-logging'`.
  History: `pandas` → `visualization` (commit `d89471a2`, which re-pointed 30 terms at "where
  the term first appears") → `exceptions-logging` (commit `a492d8ea`, an id rename). The
  glossary was re-pointed **at the homonym**.
- Course-wide, `correlación` fires 28 times; **9 are the logging sense** (5 in S09,
  1 in S38 "logs, métricas, trazas, correlación y SLI/SLO", 3 in S51 "`trace_id` de
  correlación"), 19 are the statistical sense (S18, S19, S35). The first in course order is a
  logging one, which is why every "first" computation lands there.
- Net effect: a round that wrote a genuinely good correlation-ID subtopic in a logging section
  moved a gated number by teaching a different concept. The gate rewarded it.

### Latent radius — where this fires next

Measured from the probe, course-wide, not just in the 268:

- **411 alias hits where the matched literal is also the name of a `def`/`class` in that same
  section's own code.** Top: `path`@S31 ×94 (`def path(s, t, max_h=4)`,
  `s31-streaming-data.ts:643` — graph path, vs the `PATH` env var),
  `path`@S37 ×52 (`s37-dbt-bigquery.ts:113,475`), `repo`@S11 ×43 and `repo`@S29 ×16
  (DDD repository vs Git repository), `f1`@S34 ×42, `overfit`@S33 ×41,
  `__post_init__`@S11 ×30, `set`@S12 ×22, `pipeline`@S02 ×21, `apply`@S22 ×19
  (`s22-rapidfuzz-entity.ts:394`) and `apply`@S11 ×14 (`s11-oop-domain.ts:1884`),
  `merge`@S10 ×7, `repl`@S22 ×2 (a regex-replacement function).
  Codex raised the S10 `merge`/`apply` case itself; it is one of thirteen.
- **59 cross-term overlapping hit-pairs**, in 5 pairs: `list`/`list-comprehension` ×21,
  `precision`/`recall` ×18, `commit`/`conventional-commits` ×16,
  `dict`/`dict-comprehension` ×3, `function`/`generator` ×1. Only 3 land in today's 268, but
  each is a term double-counted every time the longer phrase is written.
- **17 definition credits where the matched alias is the complement of a preceding `de`** —
  a compound noun being read as the head term.

## Why fixing instances didn't stop it

Every fix so far has been at the instance layer, and the machinery has no memory of instances:

- **Rewriting the prose does not help, and can hurt.** S10's paragraph now *says* `merge` here
  is not the pandas operation (`s10-modules-packaging-cli.ts:333`). The sentence added one more
  occurrence of the string `merge`, so the disclaimer raised the count it was disclaiming.
- **Re-pointing `firstSectionId` propagates the error instead of fixing it.** `d89471a2` fixed
  a real regex bug and then, correctly by its own logic, moved 30 terms to "where the term
  first appears". Because the extractor's notion of *appears* is string matching, a homonym
  occurrence can be the earliest one, and `correlaci-n` was moved onto it
  (`src/lib/glossary/terms.ts:797`). The SSOT now carries the mistake, so every later audit
  that reads `firstSectionId` — `scripts/glossary_intro_audit.py:70`,
  `scripts/glossary_first_use.py:47`, `scripts/glossary_coverage_audit.py:78`,
  `scripts/anglicism_gloss_audit.py:103`, `scripts/e2e_max/08_glossary_52.shard.spec.ts:12` —
  inherits it. `glossary_first_use.audit_concept_events` feeds `first_use_issues`, which is a
  **gated** measure (`tools/fixer/gate.py:136`).
- **Teaching the term "where the map says it is needed" closes the finding by writing the
  wrong lesson.** That is what happened at `s09-exceptions-logging.ts:334-336`, and it *passed*
  the gate. Nothing in the loop can tell "taught the concept" from "wrote more text containing
  the string".
- **The comment blocks in `course_event_extractor.mts` are a list of exactly this class of
  bug**, each fixed one alias at a time: `.py` excluded for `dunder-method` (`:259-262`),
  `bucle`/`bucles` removed from `for` (`terms.ts:75-77`), `joblib/pickle` re-punctuated
  (`d89471a2`). Documentation of the pattern has been accumulating for months and the pattern
  keeps recurring, because there is no assertion anywhere that fails when a new one appears.

## Proposed guards

Ordered by measured precision. Every one of these was evaluated against the whole course before
being proposed; the ones I tried and rejected are listed too, because a guard that fires on
correct work is the harm we are preventing.

### P1 — Compound-noun suppression in `definesTerm()` (measured: 10 removed, 10 of them wrong, 0 correct ones lost)

**File:** `scripts/course_event_extractor.mts`, inside `definesTerm()` (`:207-240`).

**What it asserts:** an alias that is the complement of an immediately preceding `<noun> de`
is part of a *compound noun*, so a copula or naming cue attached to that compound defines the
compound, not the alias. Concretely, add before the POST_CUE / PRE_CUE / NAMING_PARTICIPLE
branches:

```ts
/** "identificador **de correlación** es …" defines the identifier, not `correlación`. */
const DE_COMPOUND = /(?<![\p{L}\d_])\p{L}{3,}\s+de\s+[`*_"'«(]{0,3}$/u
const compound = DE_COMPOUND.test(before)
// then: if (!compound && POST_CUE.test(after) && …) return true
//       if (!compound && (PRE_CUE.test(before) || NAMING_PARTICIPLE.test(before))) return true
```

The paren/dash/appositive/verb branches are deliberately **left alone**: a parenthetical gloss
right after a compound really does gloss the term.

**Measured effect over all 52 sections** (my probe, replicating `definesTerm` exactly):

- 428 visible definition credits today. The rule removes **10**. I read all 10:
  `correlaci-n`@S09 ("identificador de correlación **es el** mismo texto corto"),
  `merge`@S28 ×2 ("el gate de merge **es un** flake"), `path`@S32 ("qué valor de path **es el**
  contrato"), `path` is also hit at S36 via a paren gloss and is **kept**, `slicing`@S35
  ("El reporte de slice **es un** producto"), `groupby`@S20, `dtype`@S15, `missing-values`@S15,
  `dependencias`@S43, `return`@S05 ("se denomina **función de retorno**" — defines *callback*).
  **All ten are wrong credits.** Precision 10/10 on this corpus.
- 7 compound credits are **kept** because a paren/dash gloss also fires, and 4 of those 7 are
  genuine (`pipeline`@S12, `entity-resolution`@S27, `data-leakage`@S19,
  `path`@S36). The refinement is what buys that: the naive "any `de` compound" rule loses them.
- **Only one concept's map entry changes**: `correlaci-n.first_definition` moves from
  `exceptions-logging.theory[8].p0` to `data-engineering.S18-T3-A.p0`
  ("La **correlación** mide asociación, **no causa**") — the correct site.
- `never_explained` does not move. `surprising_uses_course_wide` goes **268 → 274** (+6): the
  six S09/S38/S51 logging-sense mentions stop being covered by a fake definition.

**How it fails:** it does not fail anything by itself; it corrects a number. **It must land in
its own commit with a fresh `gate.py snapshot`**, because +6 on a gated measure would fail the
next round otherwise. Pair it with P2 below, which takes the same number to **265**.

**False-positive risk:** low but non-zero. A Spanish sentence that legitimately defines a term
while that term sits after `de` — e.g. "El concepto de **overfitting** es …" — would lose its
credit. I found no such sentence in the current course (0 of 428), but the course is still being
written, so this needs the ratchet test in P4.

### P2 — `notAliases` exclusion phrases in the glossary SSOT, with a staleness test

**Files:** `src/lib/glossary/terms.ts` (new optional field), `scripts/course_event_extractor.mts`
(subtract), and a new test.

**What it asserts:** a term may declare exact phrases in which its alias does **not** mean the
concept. The extractor drops any hit whose span falls inside a `notAliases` match.

```ts
{ id: 'correlaci-n', aliases: ['Correlación'],
  notAliases: ['identificador de correlación', 'id de correlación', '`trace_id` de correlación'] }
{ id: 'set',   notAliases: ['set acotado'] }
{ id: 'for',   notAliases: ['Python for Everybody', 'cases for N branches'] }
{ id: 'merge', notAliases: ['merge_config', 'gate de merge'] }
```

**The test is the guard, not the list.** `scripts/__tests__/glossary_not_aliases.test.ts`
asserts, for every `notAliases` entry: (a) it contains one of that term's own aliases as a
substring — otherwise it is suppressing something unrelated; (b) it **currently matches at
least one place in the course**. (b) is the important one: an exclusion that stops matching is
an exclusion that will silently swallow a *future real* use, so a dead entry fails `test:v3`
(an absolute gate at `tools/fixer/gate.py:249`) and names itself.

**Measured effect:** with P1 + the four entries above, `surprising_uses_course_wide` is
**265** (vs 268 today), `set`@S01 drops to 0 surprising uses, `for` 105 → 102.
I could not get the S10 `merge` uses out with a phrase list alone — "Merge de config con
precedencia" and `def merge(...)` need P3.

**False-positive risk:** essentially zero — the exclusion is an exact longer phrase, authored
by a human, and it can only shrink a match that the longer phrase already covers.
**False-negative risk:** real but bounded and visible: this is the one mechanism here that
deliberately suppresses, so every entry is one line in a reviewable file rather than a
heuristic. Test (b) is what keeps it honest.

### P3 — A code-scope rule: an identifier the section itself defines is not a library concept

**File:** `scripts/course_event_extractor.mts`, in the per-section walk.

**What it asserts:** collect the identifiers this section binds with `def`/`class` in its own
code fields. Inside **code-bearing events only** (`theory.code`, `ido.code`, `wedo.starter`,
`youdo.starter`, `wedo.tests`, `solution`), a hit whose matched literal equals one of those
identifiers does not count as a mention — **unless** this section is the term's own
`firstSectionId`.

**How it fails:** it changes a number rather than failing, so it ships with a golden test,
`scripts/__tests__/event_extractor_local_ids.test.ts`, pinning the cases: `def merge(...)` in
S10 yields no `merge` mention; `def pipeline(...)` in S02 **does** yield one (S02 *is*
`pipeline`'s `firstSectionId`, `terms.ts:642`); `def __post_init__` in S11 **does** yield a
`dunder-method` mention (S11 is its `firstSectionId`, `terms.ts`).

**Measured effect:** tiny today — **2** of the 268 surprising uses removed (both `merge`@S10).
Its value is the 411-hit latent population above: `path`@S31/S37, `repo`@S11/S29,
`apply`@S11/S22, `repl`@S22 are all currently one round away from becoming a term's *first*
use or first definition.

**False-positive/negative risk — this is the one I am least comfortable with.** The
`firstSectionId` exemption is what keeps `dunder-method`@S11, `pipeline`@S02 and `overfit`@S33
safe, but it does **not** save `f1`@S34 (42 hits; `f1-score`'s `firstSectionId` is
`streamlit-dashboards`), where `def f1(...)` genuinely is the F1 score. Restricting the rule to
code events limits the damage — S34's prose uses survive, and code kinds are not in
`TEACHING_KINDS` (`scripts/concept_map.py:56-70`) so no definition can be lost — but 42 code
mentions would disappear from `f1-score`'s `uses`. **If only one of P1–P3 ships, it should not
be this one.** A strictly safer variant: do not suppress at all; emit the collision into the
event as a field and into `tools/fixer/build_concept_prompt.py:79` so the round's prompt says
"`merge` here is this section's own function", which is what a reviewer needs anyway.

### P4 — The ratchet that makes all of the above safe to change

**File:** new `scripts/__tests__/concept_map_ratchet.test.ts` (or a check inside `test:v3`),
plus a committed `audit/fixer/concept_map_baseline.json`.

**What it asserts:** for every concept, `first_definition.location` and the count of
`surprising_uses` equal the committed baseline, **except** for entries the commit explicitly
re-baselines. A change to a regex in `course_event_extractor.mts` that moves 40 concepts fails
immediately and prints which ones; a change that moves exactly `correlaci-n` passes once the
baseline line is updated in the same commit.

**How it fails:** `npm run test:v3`, which is already an absolute gate
(`tools/fixer/gate.py:249`), so it fails *before* a round's before/after measurement rather
than as a mysterious regression after it.

**False-positive risk:** it fires on every legitimate content round that teaches a new concept.
That is why the baseline has to be regenerable in one command and the diff has to be readable
— the guard's job is to make the change *visible and deliberate*, not to forbid it. If that
churn is judged too high, scope it to `first_definition.location` only (which moves far less
often than the counts) — I did not measure the churn rate over the 24 processed sections,
so treat the scoping as an open question.

### Cross-term longest match — verified, and what I recommend

Verified as asked: at `scripts/course_event_extractor.mts:248-253`, `raw = [t.term,
...(t.aliases ?? [])]` is sorted longest-first **inside one term's alternation**; the loop at
`:295-308` then tests each term independently against the full text. There is no cross-term
arbitration. Measured consequence: 59 overlapping hit-pairs (listed above).

**Recommendation: fix it for `defines`, not for `mentions`.** A shorter alias of term A whose
span is wholly inside a longer alias of term B must not be able to earn a *definition* credit
(`"Una **función generadora** entrega valores de uno en uno"` must define `generator`, never
`function`). Leave `mentions` alone: a learner who reads "Conventional Commits" in S01 really
has met the word `commit`, and dropping that mention is exactly the false negative we said is
worse than a false positive. Guard: `scripts/__tests__/event_extractor_aliases.test.mts` with
fixed strings — `"Una **función generadora** entrega…"` → defines `generator`, not `function`;
`"**Conventional Commits** es una regla"` → defines `conventional-commits`, not `commit`;
`"Dict comprehension id→status"` → mentions both, defines neither.

### Rejected after measuring

- **"The crediting sentence must share content words with the glossary `definition` field."**
  This is the rule that would have caught `correlaci-n` at the moment it was written, and I
  wanted it. Measured: **153 of 428** current definition credits share zero content words with
  their term's own definition, including plainly correct ones such as
  `"Un **método dunder** es un método cuyo nombre empieza y termina con dos guiones bajos"`
  (`oop-domain.theory[2].p1`). As a gate it would destroy rounds wholesale. Viable only as a
  ranked *report* for a human, never as a check.
- **An adjudication ledger covering every ordinary-word alias occurrence.** `if` fires 3,595
  times, `def` 3,008, `for` 2,075, `dict` 1,692, `set` 886, `función` 271. Any ledger over that
  population needs a new entry on almost every content edit. Rejected on churn.
- **Blanket suppression of a local `def` name (P3 without the `firstSectionId` exemption and
  the code-only scope).** It suppresses `dunder-method` in the very section that teaches it.

## Confidence and what would refute this

**High confidence (mechanical, reproducible):**

- The extractor decides concept presence by alias string match alone, with no cross-term
  arbitration (`scripts/course_event_extractor.mts:248-276`, `:295-308`). Read the code.
- The 268 figure, its decomposition by concept and section, the 59 cross-term overlaps, the
  411 local-identifier collisions, the 17 `de`-compound definition credits, the 428 total
  definition credits, and the 153 zero-overlap credits. All of these come from a probe that
  **reproduces the committed `concept_map.json` exactly** — my independent reimplementation of
  `concept_map.py`'s surprising-use logic on top of my own extraction returns 268, matching
  `course-state/concept_map.json` to the unit, and all 268 join to a matched literal with zero
  misses. If the probe were wrong, that agreement would not hold.
- `correlaci-n.first_definition` is the correlation-ID paragraph, and the glossary's
  `firstSectionId` was moved onto the homonym by `d89471a2`. Both are in the repository.
- P1's measured effect (10 credits removed, one concept's first definition moved, 268 → 274)
  was computed by re-running the real `definesTerm()` with and without the rule.

**Lower confidence, stated as judgement:**

- **The H / B / G split is mine, not a measurement.** I read 268 contexts and applied the rule
  at the top of this file. Another reviewer would move `outlier`@S03 (8) and `reshape`@S17 (9)
  across the line in either direction, which is ±17 on a 268 base. The claim I would defend
  hardest is the *shape*: clear homonyms are single digits, not hundreds.
- P3's `firstSectionId` exemption is designed from 13 observed collisions. I know it fails on
  `f1`@S34. There may be other cases like it that I did not enumerate.
- I did not measure P4's churn rate across the 24 processed sections, so "scope it to
  `first_definition.location`" is a suggestion, not a finding.

**What would refute this:**

1. **Show me a `for`, `dict`, `pipeline` or `exception` hit in S02–S04 that is not the Python
   construct.** I found 3 in 202 (two book titles and one English sentence). If a sample of
   those 202 turns up a materially higher homonym rate, my central claim — that this class is
   small and the headline is really a definition-detector problem — is wrong, and the priority
   order of the guards should change.
2. **A single Spanish sentence in the course that defines a term while the term sits after
   `<noun> de`.** One would show P1's precision is corpus luck rather than a property of
   Spanish. I found zero in 428 credits; I did not search the sections' unmatched prose.
3. **Evidence that any of the nine destroyed rounds failed on `surprising_uses_*`.** I could
   not establish this: the surviving `.fixer/*.gate-after.json` files are the *last* run per
   section and all 19 show `"failed": []`, so the failing snapshots were overwritten by the
   re-run. If the destroyed rounds actually died on `run_on_sentences` or
   `b5_nominal_constructions_per_100_sentences`, then homonyms never destroyed a round at all
   and this class is purely a headline-integrity problem — which is still worth fixing,
   because the campaign reports that headline as progress, but it would not be an emergency.
4. **`concept_map.json` being stale relative to `src/`.** It is not — my probe rebuilt the
   matches from the current sources and all 268 still resolve — but if someone edits sections
   before re-running, my line numbers will drift.

**One thing I could not check:** whether the brief's S01 example
("los tres archivos cumplen funciones distintas" counted as the programming concept `function`)
still exists. `grep "funciones distintas" src/lib/course/sections/s01-setup.ts` returns nothing,
and `function` has only 2 surprising uses today, both in S02 and both genuine. The *instance*
is gone; the *cause* is not — `function`'s aliases still include bare `función`/`funciones`
(`src/lib/glossary/terms.ts:37`), which fire 271 + 95 times course-wide, and nothing stops the
next ordinary-Spanish "funciones" from landing where it matters.

---

### Reproducing this

Read-only probes, nothing written to the repo:

- `/private/tmp/claude-501/-Users-pabloillescas-Documents-GitHub-pyarcana/cc134761-bb7b-4536-886e-875c53ae213c/scratchpad/probe/dump.mts` — alias hits + context for every event
- `/private/tmp/claude-501/-Users-pabloillescas-Documents-GitHub-pyarcana/cc134761-bb7b-4536-886e-875c53ae213c/scratchpad/probe/branches.mts` — which `definesTerm()` branch credited each definition
- `/private/tmp/claude-501/-Users-pabloillescas-Documents-GitHub-pyarcana/cc134761-bb7b-4536-886e-875c53ae213c/scratchpad/probe/surprising_with_text.json` — the 268, each with its matched literal
- run with `cd <repo> && npx tsx <probe>.mts` (the repo only supplies `node_modules`)
