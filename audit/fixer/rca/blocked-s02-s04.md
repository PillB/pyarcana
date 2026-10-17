# RCA: blocked-s02-s04 — 202 of 268 surprising uses in S02/S03/S04

Status: IN PROGRESS (written incrementally; whatever is on disk is the result).
Repo read: /private/tmp/claude-501/-Users-pabloillescas-Documents-GitHub-pyarcana/cc134761-bb7b-4536-886e-875c53ae213c/scratchpad/mergewt (read-only)

## Root cause

(pending — first pass gathering evidence)

### Measured decomposition of the 202 (reproduced from the committed report)

Metric definition: `tools/fixer/gate.py:113` — `surprising_uses_course_wide = sum(len(c["surprising_uses"]) for c in cmap.values())`.
Note it has **no** `depth != "L0"` filter (unlike `:108`), so L0 concepts count too.

Recomputed from `course-state/concept_map.json` (committed, 2.8 MB, mtime 2026-09-24):
total **268**; S02 **81**, S03 **61**, S04 **60** → **202**. Confirms the brief exactly.
(With the `depth != "L0"` filter the totals are 253 / 81 / 61 / 56 — the 4-row gap is S04's
`dict-comprehension`, which is L0 course-wide.)

Per section and concept:

| section | concept | n | first_definition the map found |
|---|---|---|---|
| S02 | `for` | 21 | S04 `iteration-summaries.S04-T1-A-E2.preamble` (wedo.preamble) |
| S02 | `dict` | 18 | S04 `iteration-summaries.S04-T4-A-E3.preamble` (wedo.preamble) |
| S02 | `exception` | 14 | S03 `decisions-rules.S03-T2-B.p0` (theory.paragraph) |
| S02 | `pipeline` | 13 | S05 `functions-contracts.S05-T1-A.callout` |
| S02 | `if` | 5 | S02 `basics.S02-T2-A-DEMO.why` (ido.why) — intra-section |
| S02 | `return` | 5 | S03 `decisions-rules.theory[3].p3` |
| S02 | `parameter` | 3 | S03 `decisions-rules.theory[3].p1` |
| S02 | `function` | 2 | S02 `basics.theory[0].callout` — intra-section |
| S03 | `for` | 40 | S04 (as above) |
| S03 | `outlier` | 8 | S16 `wxpython-gui.jobRelevance` |
| S03 | `dict` | 7 | S04 (as above) |
| S03 | `truthiness` | 3 | S03 `decisions-rules.theory[0].p2` — intra-section |
| S03 | `pipeline` | 2 | S05 |
| S03 | `return` | 1 | S03 — intra-section |
| S04 | `for` | 44 | S04 `S04-T1-A-E2.preamble` — **intra-section** |
| S04 | `dict` | 8 | S04 `S04-T4-A-E3.preamble` — **intra-section** |
| S04 | `dict-comprehension` | 4 | none (L0) |
| S04 | `pipeline` | 3 | S05 |
| S04 | `list-comprehension` | 1 | S04 — intra-section |

**The metric's mechanic** (`scripts/concept_map.py:159-175`): `surprising_uses` is every
learner-visible use, in course display order, strictly *before* the first definition whose
`kind` is in `TEACHING_KINDS` (`scripts/concept_map.py:56-68`). A definition is detected by
`definesTerm()` in `scripts/course_event_extractor.mts:207-243` — a whitelist of Spanish
definition cues. So a use in the *same* section as the definition, but earlier in display
order, counts exactly like a use seven sections early.

This splits the 202 into two populations that a single owner decision does **not** cover
equally. Quantified in the next section.

### The 202 split three ways, and only one of the three is Q3's

| population | count | who can fix it |
|---|---|---|
| **cross-section** — used in a section earlier than the one that defines it | **134** (S02 74, S03 57, S04 3) | mostly Q3's route |
| **intra-section ordering** — used in the *same* section, before the definition's display order | **64** (S04 53, S02 7, S03 4) | route-independent; a prose edit |
| **L0** — `dict-comprehension`, defined nowhere in 52 sections | **4** (all S04) | route-independent |

By layer, the 202 are: weDo **101**, theory/preview **54**, iDo **41**, youDo **6**.
**Only 6 of the 202 sit in a youDo**, and CP-N1-A *is* the youDo (Q3 in
`audit/fixer/OPEN_QUESTIONS.md:113`: "S02→S03→S04's youDos are one cumulative project
(CP-N1-A)"). Moving CP-N1-A therefore moves at most 6 of the 202 surprising uses directly.
This is the single most important number in this file: **the block is attributed to Q3, but
Q3's own subject is 3% of the measured harm.** The weDo/iDo/theory layers are 196 of 202 and
are not the capstone.

## Root cause

Two independent causes were fused into one blocked question.

**Cause A — a real curriculum inversion, confined to S02 and S03.** 131 of the 134
cross-section uses are in S02 and S03, and they are genuine: `for` is declared and taught in
S04 (`src/lib/glossary/terms.ts:73-82`, `firstSectionId: 'iteration-summaries'`) yet S02 uses
it 21 times and S03 40 times; `dict`'s first teaching-surface definition is S04 yet S02 uses it
18 times; `exception`'s is S03 yet S02 uses it 14 times, and D10
(`audit/fixer/decisions.md:248-259`) says the real lesson is S09, so the S03 "definition" at
`decisions-rules.S03-T2-B.p0` is itself an early leak that happens to score as teaching.

**Cause B — a definition detector whose credit is a whitelist, and the whitelist misses the
sentence that actually teaches.** 64 of the 202 are uses inside the teaching section itself,
ahead of the credited definition. S04 is the worst case and it is pure measurement:

- S04's own theory teaches `for` at `src/lib/course/sections/s04-iteration-summaries.ts:81`:
  "Cuando la pregunta es «¿qué hago con cada valor de este grupo?», piensa primero en
  **`for`**. `for x in lista` entrega cada valor una vez y en orden". `entrega` **is** on
  `DESCRIBING_VERB` (`scripts/course_event_extractor.mts:152-153`), but the marked subject is
  the whole expression `` `for x in lista` ``, and `isMarkedSubject`
  (`scripts/course_event_extractor.mts:124-127`) requires the closing mark immediately after
  the term. Deliberate — the comment at `:120-123` says a command line must not count as its
  own subject — and here it rejects the real teaching sentence.
- The definition the map *does* credit is `iteration-summaries.S04-T1-A-E2.preamble`,
  `src/lib/course/sections/s04-iteration-summaries.ts:657`: "practicar un contador manual en un
  `for` (base del gate de resúmenes)". `PAREN_GLOSS`
  (`scripts/course_event_extractor.mts:69`) accepts any ≥10-char parenthetical containing a
  function word (`looksLikeProse`, `:91-94`), so "(base del gate de resúmenes)" — which says
  nothing about what a `for` is — is the one and only definition of `for` in the whole course.

  Verified: `course-state/concept_map.json` lists `for` with **963 learner-visible uses and
  exactly 1 definition**, that parenthesis.

**That single parenthesis is a landmine sitting in the middle of the blocked block.** Because
`surprising_uses` falls back to *every* visible use when `first_definition` is null
(`scripts/concept_map.py:174-175`), deleting or rewording that parenthetical makes `for` L0 and
takes `surprising_uses_course_wide` from **268 to 268 − 105 + 963 = 1126** — a 4× rise on the
gate's own hard-fail measure (`tools/fixer/gate.py:113`). Any concepts round that rewrites
S04-T1-A-E2's preamble for style destroys itself, and the diff that did it will look like an
improvement.

## Why fixing instances didn't stop it

Three reasons, all measured.

**1. The queue's own rows say the block is mostly not blocked.** 12 rows in
`audit/fixer/CONCEPT_QUEUE.md` carry `Q3_ROUTE_PENDING` (table rows 23, 24, 25, 26, 33, 34, 40,
42, 43, 47, 51, 57 — `CONCEPT_QUEUE.md:39-73`), and reading the twelve details shows **nine of
them already contain a route-independent fix**, written out and verified twice:

| row | uses | route-independent fix exists? | what genuinely waits on the route |
|---|---|---|---|
| 23 `exception` | 1 | yes (ask which error Python shows) | the `capturarla` clause |
| 24 `for` | 8 | **yes, whole row** — explicit prints, same output | — |
| 25 `for` | 7 | yes for the loop | the `def`/try-except/dict around it |
| 26 `for` | 5 | yes, two options given | the lists/dicts/`def` |
| 33 `if` | 1 | **no** | `safe_int`'s three-branch contract |
| 34 `parameter` | 3 | cosmetic only | `def` |
| 40 `return` | 11 | **no** | the five CP-N1-A functions |
| 42 `for` | 29 | yes for all 29 locations | the youDo `_run_tests` |
| 43 `for` | 2 | **yes, whole row** | — |
| 47 `return` | 38 | yes, via row 46's S03 D3 block | dict results, `isinstance`, the youDo starter |
| 51 `dict-comprehension` | 4 | **yes, whole row** (S04 defers comprehensions to S06 anyway) | the rows staying dicts |
| 57 `return` | 7 | yes, given row 47 | `raise ValueError`, `dict[str, Any]`, `__future__` |

The genuinely route-locked residue is rows 33 and 40 — **12 uses** — plus the dict/`def`/
try-except cores inside rows 25, 26, 42, 47, 51 and 57. The label `Q3_ROUTE_PENDING` was applied
to the *exercise*, not to the *use*, so a whole row parks because one construct in it is route-
dependent. That is why "fix the instances" never ran: the instances were filed under a question.

**2. The numbers the queue parks against are stale.** `CONCEPT_QUEUE.md:3` says it was
generated 2026-09-17 from "898 surprising uses". The committed map now has 268. Row 47 claims 38
S03 `return` uses; the current map has **1**. Row 40 claims 11 S02 `return` uses; the map has
**5**. A round that opens the queue sees a workload that no longer exists, and a gate that
measures something else.

**3. Two documents dated the same day give the owner opposite recommendations.**
`audit/fixer/OWNER_PACKET_2026-09-21.md:74-86` (item 4) recommends **route 2**, "Move the parts
of CP-N1-A that need functions, dicts and exceptions to the sections that teach them (S05, S06,
S09) … This is Q3's route 2". The decision record it cites, `audit/fixer/DECISIONS_2026-09-21.md`
**L1Q3-6 at :821-833**, says "Keep RECOMMENDED_ASK_FIRST and **route 1**" — where its own
question text defines route 1 as "rewrite the capstone to V3's own S2/S4 lines" and route 2 as
"move the gate". `OPEN_QUESTIONS.md:117-122` also recommends route 2. So the packet's
recommendation and its cited decision disagree, and nothing in either file notes the
disagreement. An owner reading item 4 and then opening L1Q3-6 to check it finds a contradiction
and no way to tell which is later. **This alone is a sufficient explanation for nine months of
non-answer, and it is cheap to fix.**

## Blast radius (measured, with numbers)

### Exactly which constructs leak, and where

Counted by regex over the whole section source (prose + starters + solutions + hints), so these
are site counts, not learner-visible-use counts. Patterns are given so they can be re-run.

| construct | pattern | S02 | S03 | S04 | taught in |
|---|---|---|---|---|---|
| `def` | `\bdef ` | 34 | 68 | 10 | S05 (`functions-contracts`) |
| `for` | `\bfor ` | (21 vis. uses) | (40) | teaches it | S04 |
| dict-shaped code | `\{["']` \| `.items()` \| `.get(` \| `dict[` | 19 | 98 | 60 | S06 (`collections`) |
| `try`/`except` | `\btry\s*:` \| `\bexcept\b` | **24** | 0 | **11** | S09 (`exceptions-logging`) |
| `raise` | `\braise\b` | 3 | 0 | 12 | S09 |
| `->` annotation | `->` | 13 | 13 | 4 | S05 |
| `from __future__` | literal | 1 | 0 | 1 | never taught |
| `from typing` | literal | 0 | 0 | 1 | never taught |

**The try/except figure is not an estimate — it is a live gate.**
`tests/adversarial/test_forward_dependencies.py:133` sets `D10_OWED = 35`, and I reproduced the
scan read-only against the same sources (sections + Theory-tab playgrounds in
`src/components/course/SectionView.tsx` + capstone `STARTER/*.py`): **35 sites exactly, S02 24 +
S04 11, nothing else in the course.** The file's own comment at `:129-132` says so: "What
remains is S02 (24) and S04 (11), inside CP-N1-A, which wait on the Q3 route — an owner
question." D9 is already at 0. So **Q3 is the only thing standing between D10 and zero**, and
D10's ratchet is an exact-equality assertion (`:141-149`), so the last 35 must be removed in one
change or the constant edited with them.

### How many rows each route touches

Exercises whose block contains a construct that section does not teach (patterns above, minus
the noisy annotation one; `def`/`for`/dict/try-except only):

| section | exercises needing change | iDo demos needing change | youDo |
|---|---|---|---|
| S02 | **11 of 24** | **8 of 8** | 1 (100-line starter: 4 `def`, 2 try/except, 3 `for`, 4 `->`, 3 `any()` genexps, `from __future__`) |
| S03 | **21 of 24** | **8 of 8** | 1 (137-line starter: 6 `def`, 12 dict literals, 2 set literals, 2 `isinstance`, 19 asserts) |
| S04 | **9 of 24** | **5 of 8** | 1 (60-line starter: 4 `def`, 6 dict literals, `dict[str, Any]` ×6, `from __future__`, `from typing`) |
| **total** | **41 of 72** | **21 of 24** | **3** |

S03 is the worst section by far and it is *not* where the attention has gone: 21 of its 24
exercises and all 8 demos use `def`, two sections before S05 teaches it, on a theory layer whose
subject is `if`/`elif`/guards.

### What V3 actually asks for (the contract both routes are measured against)

`learning_roadmap_52_V3.md:138-171`:

- S2 gate (`:146`): "capturar un registro sintético de cliente con nombres, dos apellidos,
  contacto y dirección, sin perder el valor original. Casos vacíos, Unicode y número inválido
  pasan pruebas." No function, no dict, no exception handling is named.
- S3 gate (`:157`): "reglas explicables que aceptan, rechazan o ponen en revisión **un campo**" —
  singular. The implemented S03 youDo validates **three** fields through six functions returning
  dicts.
- S4 gate (`:168`): "procesa múltiples registros por stdin/stdout, resume errores y tasas con
  denominadores correctos, conserva originales… La CLI instalable llega en S10."
- S5's project line (`:174`) is already "inicio CP-N1-B"; S8's (`:206`) is "cierre CP-N1-B";
  S9's (`:217`) is "inicio CP-N1-C".

Two consequences, both load-bearing for the decision:

1. **The current practice layer over-delivers against its own contract.** V3 never asks S02–S04
   for functions, dicts or exception handling. Route 1 moves *toward* V3; route 2 moves away
   from it.
2. **Route 2 has nowhere to land.** S05, S08 and S09 already carry CP-N1-B and CP-N1-C
   increments in V3. Moving CP-N1-A's parser into S05/S06/S09 puts two capstone increments in
   the same sections and requires editing `learning_roadmap_52_V3.md`, which `AGENTS.md` reserves
   to the owner and which the packet itself treats as a separate decision (item 10,
   `OWNER_PACKET_2026-09-21.md:154-161`).

### A fact that changes route 1's price, and post-dates Q3's recommendation

Q3's route-2 recommendation (`OPEN_QUESTIONS.md:117-122`) rests on "route 1 is a rewrite that
would have to drop the multi-field record the project is built around (no dict)". That is no
longer true of the course as committed:

- **S02 teaches tuples and unpacking in place**, `src/lib/course/sections/s02-basics.ts:155-156`:
  "Una **tupla** reúne varios valores en un orden fijo… La línea `ok, edad, error = resultado`
  reparte las tres posiciones… Esta acción se llama **desempaquetar una tupla**."
- **S02 introduces lists in place**, `s02-basics.ts:266`: "Una **lista** agrupa varios valores
  entre corchetes y puede modificarse", with depth explicitly deferred to S06.
- `safe_int`'s own published contract is already a tuple — `(ok, valor, error)`.

So a multi-field record with an error list is expressible in constructs S02 already teaches. The
sentence Q3 rests on was written 2026-09-11 and the same document's own 2026-09-16 correction
(`OPEN_QUESTIONS.md:106-110`) retracts the premise: "`tuple` is no longer a leak — S02 teaches it
in place… the reason it looked untaught was the detector". **The correction was never carried
into the recommendation.**

### The three routes, priced

Q3's numbering (`OPEN_QUESTIONS.md:126-135`), which L1Q3-6 shares.

**Route 1 — rewrite the S02–S04 practice layer in constructs those sections teach.**

*Changes, concretely:* 41 of 72 exercises, 21 of 24 iDo demos, 3 youDo starters (297 starter
lines total), 3 Theory-tab playground blocks in `src/components/course/SectionView.tsx`.
Constructs to eliminate before their section: `def` (112 sites), dict-shaped code (177),
try/except (35), `raise` (15), `->` (30), `from __future__` (2), `from typing` (1).
`course-state/capstones/CP-N1-A/` package, `public/capstones/CP-N1-A_BRIEF.md` and `_RUBRIC.json`
get restated acceptance criteria; V3 is **not** edited.

*Costs, stated:* (a) every code/output pair in the three sections is pinned and executed —
`test_s02_independent_contract.py:65` requires ≥41 pairs and runs each one, S03's requires ≥41
(`test_s03_independent_contract.py:80`); every rewritten demo must reproduce its declared output
line for line or `strict_output_mismatches_in_section` rises and the round is restored.
(b) Three tests pin the current design and must be repointed, not weakened:
`test_s02_independent_contract.py:49-52` pins `def safe_int(campo: str, valor: str)`,
`def parse_client(`, `raise NotImplementedError` and `assert r["errors"] == []`;
`:86` pins `def safe_int(campo, valor):` inside the Theory playground;
`test_s03_independent_contract.py:190-208` pins the six status codes and three literal fixtures
of the S03 youDo. (c) The S03 youDo's pedagogy — deliberate defects the learner predicts and
repairs — has to survive a rewrite that removes the functions the defects live in. This is the
real content risk and I cannot size it from the repository.
(d) V3's S3 gate says "un campo", so the honest route-1 S03 increment validates **one** field,
which is a visible reduction in what the section asks of a learner.

*What it does not cost:* no capstone moves, no gate moves, no protected-path curriculum edit,
no badge or credential text changes.

**Route 2 — move the parser project to the sections that teach its prerequisites (S05/S06/S09).**

*Changes, concretely:* the youDo of S02, S03 and S04 is deleted or reduced and its content
re-lands in S05, S06 and S09, which in V3 already carry CP-N1-B's start (`:174`), the tabular
model (`:184`) and CP-N1-C's start (`:217`). Wiring that binds CP-N1-A to S04 and must move
with it: `src/lib/capstones/catalog.ts:27` (level-1 gates `['S04','S08','S13']`), `:59`
(`mk('CP-N1-A', …, 'S04', ['S01','S02','S03','S04'], …)`), `:110`, `:121` (GATE_MAP
`S04:'CP-N1-A'`); `course-state/capstones/CP-N1-A/gate.json` (`"gate_section": "S04"`,
`"dependencies": ["S01","S02","S03","S04"]`); `course-state/capstones/INDEX.json`;
`tests/adversarial/test_section_capstone_mapping.py:41` (canonical GATE_MAP);
`public/capstones/CP-N1-A_BRIEF.md` and `_RUBRIC.json` (protected); `prisma/seed.ts` (three exam
questions phrased "el gate CP-N1-A", `:944`, `:1169`, `:1326`); 13 files under
`capstone_validation/`; and **6 mentions in `learning_roadmap_52_V3.md`**, a path `AGENTS.md`
reserves to the owner.

*Costs, stated:* (a) it needs the V3 amendment the packet treats as a separate owner decision
(item 10). (b) It leaves S02–S04 with **no** cumulative practice layer, so the new content is
authored from nothing — the packet's own admission (`OPEN_QUESTIONS.md:121-122`: "S02–S04 then
need a genuinely new, concept-clean practice layer, which is new content, not moved content").
That new layer faces exactly route 1's authoring problem, so route 2 pays route 1's cost **plus**
the move. (c) The 196 non-youDo surprising uses are untouched by it.

*What it buys:* the 6 youDo surprising uses, and a capstone whose code matches its section's
knowledge.

**Route 3 — teach `def`, dicts and exceptions inside S02.** Already rejected in Q3
(`:134-135`) and contradicted by S02's own scope callout, `s02-basics.ts:51`: "Todavía no
usaremos condicionales ni bucles." I did not re-price it; nothing found here revives it.

### Which findings unblock under each route

| | route 1 | route 2 | route 3 |
|---|---|---|---|
| 12 `Q3_ROUTE_PENDING` queue rows | all 12 | all 12 | all 12 |
| the 9 rows with a route-independent fix | **already unblocked today** | already unblocked today | already unblocked today |
| D10's last 35 try/except sites (`D10_OWED`) | all 35 | S02's 24 move, S04's 11 move | 0 (S02 would teach it) |
| 202 surprising uses in S02–S04 | ~198 (all but the tagline-class) | ~6 directly, rest re-authored | unknown |
| the 64 intra-section/L0 ones | route-independent, fixable now | route-independent | route-independent |
| V3 amendment needed | no | **yes** | yes |
| protected paths touched | briefs/rubric | briefs/rubric **+ V3 + GATE_MAP + seed** | V3 |

### Recommendation, with its trade-offs stated

**The evidence now favours route 1, and it did not when Q3 was written.** Three facts changed:

1. S02 teaches tuples, unpacking and lists in place (`s02-basics.ts:155-156`, `:266`), so the
   "no dict means no multi-field record" premise behind route 2 no longer holds.
2. V3's own gates for S2/S3/S4 never ask for functions, dicts or exception handling
   (`learning_roadmap_52_V3.md:146`, `:157`, `:168`), so route 1 restores the contract while
   route 2 must amend it.
3. Route 2 does not avoid route 1's authoring cost; it adds to it, by its own text.

**Trade-offs I am not hiding.** Route 1 is the larger content edit *in this repository* (41
exercises, 21 demos, 3 starters) and it shrinks what S03 asks of a learner to V3's "un campo".
It also risks the S03 youDo's deliberate-defect pedagogy, which is the best-designed thing in
the three sections and which I cannot cost from source. Route 2's advantage is that the code
already written stays written, somewhere. If the owner values that code more than V3's contract,
route 2 is defensible — but then item 10 (may V3 be amended) has to be answered first, and the
packet currently asks them in the wrong order.

**And the cheapest thing on the page is neither route.** 64 of the 202 are intra-section or L0
and need no decision at all (see the guards below). Unblocking those does not pre-empt Q3.

## Proposed guards

Ordered by value per line of code. Every one fails on a measurement, not on a reviewer noticing.

### G1 — Refuse a patch that deletes a concept's only definition
**File:** `tools/fixer/apply_patches.py` (the per-patch rejection path, `:135-157`, which already
rejects with a `reason` and leaves the finding open).
**Asserts:** before applying, if the patch's anchor text contains the `first_definition`
location of any concept in `course-state/concept_map.json` whose teaching-surface definition
count is 1, and the replacement no longer satisfies `definesTerm` for that concept, reject **that
patch** with `reason: "removes the only definition of <concept> (<n> visible uses); the gate
would rise by <n>"`.
**How it fails:** one patch is refused, named, with the number. The round survives.
**Why here and not at the gate:** the gate already catches the damage — `never_explained` is a
gated regression measure (`tools/fixer/gate.py:137`) and would go 14→15 — but it catches it after
codex's whole section has been written, and it reports a bare integer. The cost of the current
design is the whole round; the cost of this guard is one patch.
**False-positive risk: moderate, and it must be bounded.** A patch that *moves* a definition
(rewriting the sentence in a way the whitelist still recognises) must not be refused, so the
check has to re-run `definesTerm` on the replacement, not merely diff the text. A patch that
improves the sentence in a shape the whitelist does not know (the S04-T1-A case below) would be
refused wrongly. Mitigation: make the refusal carry the exact cue list, so the author re-words
once instead of losing the round.

### G2 — Ratchet on concepts held up by a single definition
**File:** new `tests/adversarial/test_concept_definition_integrity.py`.
**Asserts, measured today from `course-state/concept_map.json`:**
- 33 of 95 defined concepts have exactly **one** teaching-surface definition; **3** of those have
  ≥50 learner-visible uses: `for` (963 uses, `wedo.preamble`), `notebook` (54,
  `theory.paragraph`), `pivot-table` (52, `ido.intro`). Ratchet `SOLE_DEFINITION_OWED = 3`, same
  shape as `D10_OWED` in `tests/adversarial/test_forward_dependencies.py:133`.
- 34 concepts have their first definition on a non-teaching-*theory* surface (`tagline`,
  `outcome`, `jobRelevance`, `wedo.preamble`) — `dict` (1049 uses), `for` (963), `path` (456),
  `recall` (191), `dtype` (176)… Ratchet that count too, at 34.
**How it fails:** the list is printed with concept, use count and location, so the failure says
which sentence is load-bearing.
**False-positive risk: low.** It only fires when a number rises, and the exact-equality half
(the D10 pattern) forces the constant down when work lands.

### G3 — Make the aggregate failure say which concept moved
**File:** `tools/fixer/gate.py`, in `regression_gate` (`:224-247`) for the key
`surprising_uses_course_wide`.
**Asserts:** nothing new. On a rise, it diffs the before/after concept maps and prints the top
five concepts by delta with their `first_definition` before and after.
**How it fails:** it does not; it turns "268 → 1126" into "`for`: +858, first_definition
`iteration-summaries.S04-T1-A-E2.preamble` → none".
**False-positive risk: none.** This is the single highest-value change on the page relative to
its size, because every destroyed round in this class produced a number no one could act on.

### G4 — The owner's three documents must name the same route
**File:** new `tests/adversarial/test_owner_questions_are_consistent.py`.
**Asserts:** the route recommended for Q3 is identical in `audit/fixer/OPEN_QUESTIONS.md`
(§Q3 "Recommendation… route N"), `audit/fixer/OWNER_PACKET_2026-09-21.md` (item 4, "This is Q3's
route N") and `audit/fixer/DECISIONS_2026-09-21.md` (L1Q3-6, "Keep … and route N"). Today they
are **2, 2 and 1** — the test fails on today's tree, which is the point.
**How it fails:** names the three files, the three extracted numbers and the three lines.
**False-positive risk: low but real.** It is a regex over prose; a rewording that drops the
literal token `route N` makes it fail for the wrong reason. Bound it by asserting only when all
three tokens are found, and failing loudly (not silently passing) when a file stops containing
one.

### G5 — A queue row may not quote a count the map does not have
**File:** new check inside `tools/fixer/ledger.py` (already the "computed from an artifact, never
hand-ticked" tool) or a test beside it.
**Asserts:** for each single-section row of `audit/fixer/CONCEPT_QUEUE.md`, the `uses` column
equals `len(surprising_uses)` for that (section, concept) in `course-state/concept_map.json`.
**Measured today: 76 of 90 single-section (section, concept) pairs disagree.** Examples:
S03 `return` — queue 50, map 1; S05 `return` — queue 24, map 0; S02 `abc` — queue 23, map 0;
S04 `for` — queue 7, map **44**; S02 `exception` — queue 2, map 14.
**How it fails:** prints the disagreeing rows so the queue is regenerated instead of read.
**False-positive risk: low**, but it will be red until the queue is regenerated, so it should
land as a ratchet at 76 rather than a hard gate, or with the regeneration in the same change.

### G6 — Turn the Q3 block into a ratchet instead of a gate
**File:** the same new test as G2, or `tools/fixer/ledger.py`.
**Asserts:** the number of surprising uses filed under `Q3_ROUTE_PENDING` may only go down. Nine
of the twelve rows carry a route-independent fix that can land today; the genuinely route-locked
residue is rows 33 and 40, **12 uses**. Baseline the ratchet at today's blocked count and let the
route-independent work reduce it without an owner decision.
**False-positive risk: low.** The risk it removes is larger: today a single unanswered question
parks 202 measured uses, 196 of which it does not govern.

### The specific repair G1–G3 exist to protect, which needs no owner decision

`src/lib/course/sections/s04-iteration-summaries.ts:81` should state the definition with the bare
term as its subject — e.g. "**`for`** recorre cada valor de un grupo una vez y en orden", where
`recorre` is already on `DESCRIBING_VERB` (`scripts/course_event_extractor.mts:152-153`) and the
backticks close right after `for`, satisfying `isMarkedSubject` (`:124-127`). Predicted effect,
computed from the map's own ordering rule (`scripts/concept_map.py:159-175`): `for`'s first
definition moves from `S04-T1-A-E2.preamble` to `S04-T1-A.p0`; the heading in the same block is
exempt (`:164-170`); S04's 44 surprising `for` uses fall to **3** (tagline, `outcome[0]`,
`theory[1].p1`), so `surprising_uses_course_wide` goes **268 → 227** in one sentence — and `for`
stops depending on a parenthesis for its existence.

I have **not** run anything to confirm this, per the instruction not to run the repo's scripts.
It is an arithmetic prediction from the committed map and the extractor source, and it is the
first thing a round should verify rather than assume.

## Confidence and what would refute this

**High confidence (recomputed from committed artifacts, and they agree with the brief exactly).**
`for` 21+40+44 = **105**, `dict` 18+7+8 = **33**, `exception` **14**, S02+S03+S04 = **202** of
**268**. My recomputation of the brief's headline figures from
`course-state/concept_map.json` reproduces them to the unit, so the committed map is the same
snapshot the campaign measured. Likewise `D10_OWED = 35` reproduced as S02 24 + S04 11 by
replaying the scan in `tests/adversarial/test_forward_dependencies.py:94-104` read-only.

**High confidence:** the 134 / 64 / 4 split (cross-section / intra-section / L0); that `for` has
exactly one definition course-wide and it is a parenthetical in an exercise preamble; that only
6 of 202 sit in a youDo; that the three owner-facing documents name different routes; that 76 of
90 queue rows quote counts the map no longer has.

**Medium confidence:** the row counts for route 1 (41 of 72 exercises, 21 of 24 demos). They come
from regexes over whole exercise blocks, so a block that only *mentions* `` `for` `` in prose
counts as needing change. I removed the worst offender (the `->`/`: int` annotation pattern,
which false-matched the output line "tipos: int str" at `s02-basics.ts:937`), but `\bfor ` still
matches Spanish "for" inside backticks. Treat 41/72 as an upper bound; the lower bound is the
union of `def`/dict/try-except only.

**Low confidence, flagged as such:** the predicted 268 → 227 from rewriting
`s04-iteration-summaries.ts:81`. It follows from the extractor's cue list and the map's ordering
rule, but I did not run either instrument (the task forbids it and a lock refuses it). It could
be wrong if the replacement trips `NEGATED_VERB`, if another `for` use sits between `theory[1]`
and `S04-T1-A.p0` in display order, or if the extractor's `display_order` differs from the order
`surprising_uses` is listed in.

**What would refute the recommendation for route 1:**
- If the owner's intent for `learning_roadmap_52_V3.md` is that its gate lines are aspirational
  summaries rather than the contract, then "route 1 restores the contract" loses its force and
  route 2's cost of amending V3 mostly disappears.
- If the S03 deliberate-defect youDo cannot be rebuilt without functions — I could not establish
  this either way from source, and it is the strongest argument against route 1.
- If there is a record, anywhere I did not read, in which the owner already chose route 2 and
  L1Q3-6 is the stale document rather than the packet. I searched `audit/fixer/decisions.md`
  (D1–D13) and found no Q3 ruling: D9, D10 and D11 constrain it but none decides it.

**What would refute the root-cause claim:** if `course-state/concept_map.json` in the worktree is
not what `gate.py` regenerates — the map is a tracked file that every audit rewrites, so a round
in flight could have left a map that does not match the sections. The brief's numbers matching
mine to the unit is evidence against that, not proof of it.
