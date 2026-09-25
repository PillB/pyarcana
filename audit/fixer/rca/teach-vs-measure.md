# teach-vs-measure — a gated measure rises when the course improves

STATUS: in progress (appending as findings are established).

## Root cause

(pending)

## The gated surface (what is actually gated)

`tools/fixer/gate.py:134-151` returns the measure dict. Keys WITHOUT the `info:` prefix are
gated as regressions; `gate.py:188-196` `regression_verdict` fails any key where
`after > before` (floats get a +0.05 tolerance; ints get none, so +1 fails).

Gated regression measures (9):
- `identifier_values_in_section`   (gate.py:135, from scripts/synthetic_identifier_audit.py)
- `never_explained`                (gate.py:136, concept_map depth=="L0")
- `surprising_uses_course_wide`    (gate.py:137, sum of len(surprising_uses))
- `surprising_uses_in_section`     (gate.py:139)
- `run_on_sentences`               (gate.py:140, prose_quality_audit)
- `b5_nominal_constructions_per_100_sentences` (gate.py:143, a RATIO)
- `strict_output_mismatches_in_section` (gate.py:147)
- `avoidable_english_per_1000`     (gate.py:148, a RATIO)
- `first_use_issues`               (gate.py:149, SUM over issue_counts)

Informational (never fail): `used_before_explained` (gate.py:138),
`b5_nominal_constructions` (gate.py:146), `nominalisations_per_100w` (gate.py:150).

Absolute gates (gate.py:253-256): `test:v3`, `test:adversarial:node`,
`test:adversarial:py`, and the snippets gate (`gate.py:164-185`).

Failure consequence: `tools/fixer/run_concepts.sh:58-66` — any non-zero `gate.py check`
restores the section file AND all 7 derived reports, then `exit 1`.

## Root cause

**Every gated measure is a count of *labels*, not a count of *harm*, and the labels are
assigned by a classifier whose classes are not ordered by severity. Teaching a concept does
not remove a defect; it RE-CLASSIFIES it. Whenever the new class is worth more points than
the old one, the course improved and the number rose.**

Three separable mechanisms produce that shape, and all three are live:

**M1 — bucket migration between two gated counts.** Two gates counting two halves of one
population. Teaching moves a concept from bucket A to bucket B; A falls, B rises, and the
gate fails on B. `gate.py:188-196` fails on ANY key rising, so a transfer between two gated
keys is a guaranteed failure whenever the destination bucket is gated. This was
`never_explained` + `used_before_explained`; the fix (`gate.py:102-113`) demoted
`used_before_explained` to informational and gated the total instead. **The same shape
survives in `first_use_issues` and in the `never_explained` / `surprising_uses_*` trio.**

**M2 — one defect counted under N codes.** `scripts/glossary_first_use.py:67-104`.
`NO_VISIBLE_DEFINITION` (line 69-77) ends with `continue` (line 77), so a term with no
definition anywhere contributes **exactly 1** issue. A term that HAS a definition can
contribute **up to 2** — `USE_BEFORE_DEFINITION` (line 85-93) and
`DEFINITION_AFTER_REQUIREMENT` (line 95-104) are independent `if`s over the same term with
no `elif` and no `continue` between them. `gate.py:149` gates
`sum(fu["issue_counts"].values())`, i.e. it adds those codes together.

  So: writing the first-ever definition of a term that is mentioned early and required
  early takes that term from 1 issue to 2. **Net +1. Round destroyed.** That is exactly
  S37/`generator`.

  The severity ordering is inverted: "the learner is never told what this word means"
  (worst) costs 1 point; "the learner is told, just later than an exercise needed it"
  (much better) costs 2. The gate is therefore **paid to leave concepts untaught.**

**M3 — the two instruments disagree on what a definition is, so "teaching" is not one
event.** `scripts/concept_map.py:146` only accepts a definition whose event kind is in
`TEACHING_KINDS` (`concept_map.py:54-67`). `scripts/glossary_first_use.py:61` accepts ANY
`defines` event, including `hint`, `selfcheck.option`, `solution`-adjacent kinds. The same
new paragraph therefore moves the two instruments by different amounts, at different
locations, and a round can satisfy one while tripping the other.

**And the campaign's prompt aims straight at the landmine.**
`tools/fixer/build_concept_prompt.py:117` sorts the work `not
t["never_explained_anywhere"]` first — never-explained (L0) concepts are handed to codex
*first*. Those are precisely the terms sitting at `NO_VISIBLE_DEFINITION`, i.e. precisely
the terms whose first_use cost can only stay flat or rise when they are taught. The
machinery is optimised to hand codex the one class of work the gate punishes.

## Why fixing instances didn't stop it

Both prior fixes were *instance* fixes at the measure level, not at the classifier:

- Fix (1) moved `used_before_explained` behind the `info:` prefix (`gate.py:138`) and added
  `surprising_uses_course_wide` (`gate.py:113`). That removed one bucket pair. It did not
  remove the *property* that produced it — that a gated key counts a class a repair moves
  INTO. `never_explained` and `surprising_uses_in_section` are still two gated keys over one
  population (see Blast radius).
- Fix (2) for `generator` was, per the task text, "worked around by fixing the earlier use;
  the double count stands." That is an instance fix by construction: the *code* at
  `glossary_first_use.py:95` was not touched, so the next term in the same position does the
  same thing. There are 3 such terms left and 7 terms already double-counted (measured
  below).

Documentation cannot help here because the failure is invisible at authoring time: codex
sees a concept list (`build_concept_prompt.py:85-97`) that contains no `requires` events and
no issue codes, so nothing in the prompt can tell an author that teaching *this* term costs
+1 while teaching the one next to it costs 0.

## Is any measure unfalsifiable (always passes)? — YES, one, and it is dead on arrival

**`b5_nominal_constructions_per_100_sentences` has never once been measured.**

- `tools/fixer/gate.py:143` reads `prose.get("b5_per_100_sentences")`.
- The only writer of `course-state/prose_quality_report.json` is
  `scripts/prose_quality_audit.py:115`, writing the dict from `analyse()`
  (`prose_quality_audit.py:75-86`). Its keys are: `words, sentences, words_per_sentence,
  fernandez_huerta, long_sentences, run_on_sentences, nominalisations_per_100w,
  gerunds_per_100w, commas_per_sentence, meta_leaks`. **There is no `b5_per_100_sentences`
  and no `b5_nominal_constructions`.**
- Verified against the committed report: `python3 -c` over
  `course-state/prose_quality_report.json` -> `b5 keys present anywhere: set()` across all
  52 sections.
- Verified against every snapshot on disk: all **19** `.fixer/*.gate-before.json` files have
  `"b5_nominal_constructions_per_100_sentences": null` and
  `"info:b5_nominal_constructions": null`. 19 of 19.
- Verified against history: `git log --all -S"b5_per_100_sentences"` returns exactly ONE
  commit, `0f5a9174`, which is the commit that added the line to `gate.py`. **No commit ever
  added a producer.** The key was consumed before it was ever written.

Consequence chain: `None` -> `regression_verdict` (`gate.py:188-196`) hits
`if b is None or a is None: return "unmeasurable"` (line 195) -> `regression_gate`
(`gate.py:236`) prints `---- b5_...: not measurable (None -> None)` -> **never appended to
`failed`**. The gate prints a line, so it looks alive in the log, and it can never fail.

This voids decision **D7** (`audit/fixer/decisions.md:180-198`), which explicitly *replaced*
the gated `nominalisations_per_100w` with this measure and moved the suffix density to
`info:`. `gate.py:150` duly makes `nominalisations_per_100w` informational. **Net effect: the
entire nominalisation / B5 family is ungated.** A round can double a section's nominalisations
and pass.

That matters for this class in a second way: `unmeasurable` is the same verdict the gate
gives an instrument that genuinely broke on BOTH sides of a round. So a permanently-dead
measure is indistinguishable in the log from a temporarily-dead one, and nobody noticed for
19 rounds.

## Per-measure audit: can a CORRECT improvement raise it?

### 1. `first_use_issues` — YES, confirmed, and the defect is still in the code

`gate.py:149` = `sum(fu["issue_counts"].values())` over
`scripts/glossary_first_use.py`'s three codes.

Mechanism (`glossary_first_use.py:67-104`): `NO_VISIBLE_DEFINITION` ends in `continue`
(line 77) and costs **1**. Once a definition exists, `USE_BEFORE_DEFINITION` (line 79-93)
and `DEFINITION_AFTER_REQUIREMENT` (line 95-104) are two independent `if`s with no `elif`,
so one term can cost **2**.

Formally, inserting a first definition at ordered position `d` takes a term from 1 issue to
`[first_mention_idx < d] + [first_requirement_idx < d]`. **It rises iff a mention AND a
requirement both precede the new definition** — i.e. exactly when the course teaches a word
later than it first used and first drilled it, which is the defect the round exists to fix.

Confirmed on the real case, `git log -1 a7810d38` (`feat(s37): teach the generator
expression the section runs on`), whose own message says: "defining `generator` here turned
one NO_VISIBLE_DEFINITION into both a USE_BEFORE_DEFINITION and a DEFINITION_AFTER_REQUIREMENT,
because S24's weDo hint used the word thirteen sections earlier." The workaround was commit
`0a2808cf` (`feat(s24): stop a hint naming a construct the course teaches thirteen sections
later`) — an instance fix in S24's content, not in `glossary_first_use.py`.

Measured today from `course-state/first_use_all_report.json`:
- `issue_counts` = `{DEFINITION_AFTER_REQUIREMENT: 7, NO_VISIBLE_DEFINITION: 3,
  USE_BEFORE_DEFINITION: 27}`, **total 37** — the gated number.
- **7 terms carry two codes at once**: `for`, `return`, `exception`, `parameter`, `dict`,
  `pipeline`, `outlier`. So 37 points describe only **30 defective terms**. **19% of the
  gated number is the same defect counted twice.**
- The 3 `NO_VISIBLE_DEFINITION` terms are `reshape`, `onehotencoder`, `joblib`. Simulated
  from `.fixer/events.json`: `reshape` has a requirement at
  `packaging.youDo.objective[2]` and a mention at `packaging.theory[5].heading`, so teaching
  it anywhere after the youDo costs 2 where it now costs 1. (Teaching it *inside*
  `theory[5]` is safe, because of the heading exemption at `glossary_first_use.py:11-22` —
  so this landmine only fires when the teaching block lands late, which is the normal case
  when the term is first used in an earlier section.)

**The severity order is inverted.** "Never explained anywhere" — the worst possible state —
is the CHEAPEST at 1 point. "Explained, but after an exercise needed it" is 2. A gate that
only forbids the number rising therefore pays the campaign to leave words untaught.

**And the prompt aims at the landmines.** `tools/fixer/build_concept_prompt.py:117` sorts
`not t["never_explained_anywhere"]` first, handing codex the never-explained terms **first**.
Those are precisely the terms at `NO_VISIBLE_DEFINITION`, i.e. precisely the ones whose cost
can only stay flat or rise.

**What `first_use_issues` should count instead:** the number of *terms* in a bad state,
weighted by how bad that state is, so that any move toward "taught earlier" strictly
decreases it. Concretely, per term, take the worst code rather than the sum, and order the
codes by harm:

    NO_VISIBLE_DEFINITION = 3   (learner is never told)
    DEFINITION_AFTER_REQUIREMENT = 2   (graded on it before being told)
    USE_BEFORE_DEFINITION = 1   (read it before being told)
    clean = 0

then gate on `sum(worst_code_weight(term) for term in terms)`. Under that scoring,
`generator` goes 3 -> 2 (or 3 -> 1) and S37 passes; `reshape` goes 3 -> 0 or 3 -> 2, never
up. A cheaper variant that fixes the double count alone: gate on
`len({issue["term_id"] for issue in issues})` (30 today, not 37) and keep the per-code
counts as `info:`. That removes M2 but NOT the severity inversion — `generator` would still
go 1 term -> 1 term (flat, passes) while `reshape` taught late goes 1 -> 1 (flat, passes),
so it is strictly better and much simpler. **I would ship the distinct-term count first and
the weighting second**, because the weights are a judgement call and the double count is a
plain bug.

### 2. `never_explained` + `surprising_uses_course_wide` + `surprising_uses_in_section` — YES, by a different route than the one that was fixed

The bucket-migration bug (M1) between `never_explained` and `used_before_explained` is
genuinely fixed (`gate.py:108-113`, `gate.py:138`): `surprising_uses` for an undefined
concept is *all* its visible uses (`concept_map.py:177`), and for a defined one it is a
prefix of them (`concept_map.py:171-175`), so teaching a concept can only shrink its own
contribution. That direction is sound.

**What is not fixed: a round adds prose, and prose adds `mentions`.**
`scripts/course_event_extractor.mts:291-307` derives `mentions` from a plain alias regex
(line 305: every hit pushes a mention) but derives `defines` from a hand-curated whitelist of
Spanish definitional cues (`definesTerm`, lines 207-243 — copula, parenthetical gloss, em-dash
gloss, appositive, contrast, `ocurre cuando`, and two closed verb whitelists at lines
152-176). Measured over the course as written:

| surface | events | term mentions | recognised definitions | rate |
|---|---:|---:|---:|---:|
| all learner-visible teaching prose | 6,519 | 3,503 | 310 | **8.8%** |
| `theory.paragraph` only | 2,114 | 1,427 | 191 | **13.4%** |

0.68 mentions and 0.090 recognised definitions per theory paragraph. **Naming a term is
~7.5x more likely to register than defining one.** A correct teaching block that explains a
concept in a frame the whitelist does not carry contributes a *mention* and no *define* —
and the comments in the extractor say this has happened repeatedly and in the worst possible
place (`course_event_extractor.mts:163-176`: `divide` was missing, so cross-validation
"scored never-explained across all 52 sections and its four uses were filed as surprises").

Then the landmine density. Counted from `course-state/concept_map.json`: **how many of the
106 glossary terms would gain a surprising use if a new paragraph merely NAMED them**, per
section:

    S01:85  S02:78  S03:73  S04:69  S05:67  S06:64  S07:63  S08:62  S09:59  S10:57
    S11:55  S12:55  S13:51  S14:45  S15:40  S16:35  S17:33  S18:28  S19:26  S20:26
    S21:26  S22:26  S23:26  S24:25  S25:23  S26:23  S27:23  S28:23  S29:23  S30:22
    S31:22  S32:21  S33:20  S34:17  S35:16  S36:16  S37:15  S38:15  S39:15  S40:15
    S41:14  S42:14  S43:14  S44:14  S45:14  S46:14  S47:13  S48:11  S49:11  S50:11
    S51:11  S52:11        (min 11, max 85, mean 31.4 of 106)

**In S01, 80% of the glossary is unsafe to name.** Teaching `variable` well means writing
`tipo de dato`, `función`, `string` — each of which is defined later and so each of which
adds a surprising use in exactly the section being gated.

The headroom is tiny. From the surviving snapshots, `surprising_uses_in_section` baselines:
S11 **2**, S07 **5**, S06 **7**, S05 **8**, S15 **8**, S14 **9**, S01 **10**, S13 **11**,
S09 **12**, S10 **15**, S17 **31**. A round on S11 has a budget of 2 against a process that
produces ~0.68 new mentions per added paragraph in a section where 55 of 106 terms are
unsafe. **Sections with a low baseline are the ones a correct round is most likely to fail**,
and they are also the ones with the least to gain — the measure is noisiest exactly where
the signal is weakest.

This is the same *shape* as (1): the instrument counts label-firings, and correct teaching
fires labels.

### 3. `avoidable_english_per_1000` — YES. A THIRD confirmed instrument, already documented in its own source

`gate.py:148`; `scripts/code_switching_audit.py:164` =
`round(1000 * (func + leak) / words, 1)`. It is a ratio, gated with the float tolerance
`+0.05` (`gate.py:196`) against a value rounded to one decimal.

**Confirmed instance, in the audit's own comment** (`code_switching_audit.py:79-86`):

> "`not` counted as English leakage, so S09's round - which took the course from 400
> surprising uses to 367 - was restored for explaining what NaN stands for."

Corroborated on disk: `.fixer/S09.gate-before.json` has
`"surprising_uses_course_wide": 400`, and `.fixer/S10.gate-before.json` — the next round's
baseline, i.e. after S09 finally landed — has `367`. The course improved by **33 surprising
uses** and the round was destroyed for writing `NaN` (*not a number*, «no es un número»).
That is this class exactly, on an instrument the task did not name.

**The workaround is typographic, not semantic.** `code_switching_audit.py:90`:
`re.compile(r"(?<!\*)\*[^*\n]{2,80}\*(?=[,;:]?\s*«)")` — an English span is forgiven only if
it is *italic* AND *immediately followed by a guillemet gloss*. A correct gloss written any
other way — Spanish gloss in parentheses, straight quotes, backticks around the English, the
Spanish first and the English after — is still counted. Same shape as `definesTerm`: a
narrow surface pattern standing in for a semantic judgement, so the gate rewards one exact
typography and punishes every other correct rendering.

**Measured sensitivity (this is the part that makes it lethal):**

- One added avoidable-English token moves the raw ratio by `1000/prose_words`, which is
  **0.081 (S01) to 0.171 (S28)**, median **0.144**. Since the value is rounded to 0.1 and a
  rise of 0.1 already beats the 0.05 tolerance, **in 51 of 52 sections a single English
  token always fails the round**; in S01 (delta 0.081 < 0.1) it fails whenever it crosses a
  rounding boundary, ~81% of the time.
- **Deletion fails it too, with no English added at all.** `run_concepts.sh:2` says the
  round may "Teach, rephrase or **remove**". Removing English-free prose shrinks the
  denominator. Words that must be deleted to fail: **S46 45, S51 52, S28 54, S44 75, S35 79,
  S25 79, S29 85, S37 85, S32 87, S42 87** — median across 52 sections **183**, and
  **21 of 52 sections fail on deleting under 150 words**, i.e. on cutting one bloated
  paragraph. One of the three sanctioned repairs mechanically trips the gate.

### 4. `run_on_sentences` — YES, one-sided against adding prose

`gate.py:140`; `scripts/prose_quality_audit.py:74` — sentences of more than 45 words, counted
over the section's whole prose joined (`prose_quality_audit.py:108`), gated as an int with
**zero** tolerance (`gate.py:196`).

A concepts round's action is to ADD prose. Added prose can only add sentences; it cannot
shorten an existing one. So the measure's change under a pure addition is **>= 0 always** —
**no upside, only downside.** The round can earn nothing here and can only lose.

Baselines are small enough for one sentence to matter: from
`course-state/prose_quality_report.json`, `run_on_sentences` is **0** in 10 sections
(S02, S04, S05, S06, S07, S14, S20, S24, S26, S38, S43, S44) and **<= 2** in 30 of 52. A
single 46-word explanatory sentence in any of those fails the round outright.

And the sentence splitter is crude: `prose_quality_audit.py:43` splits only on `[.!?]` +
whitespace. A well-formed Spanish enumeration joined by semicolons — the house form for a
gloss — is ONE sentence however clear it is, so writing a clearer list-shaped explanation can
manufacture a "run-on". `terminated()` (lines 47-62) already documents one instance of this
family: 358 prose events ran into each other and "a round could be restored over a run-on
that is really a list."

Partly mitigated: this one at least measures a real writing defect, so a guard here should
scope it to *added* sentences rather than delete the measure.

### 5. `identifier_values_in_section` — NO, this one is sound

`gate.py:132,135`; `scripts/synthetic_identifier_audit.py:50-60`. It counts eight-digit
literals within 120 characters of DNI/RUC wording, in the files wired into
`src/lib/course/index.ts`, filtered to this section (`gate.py:132`,
`f"/s{num:02d}-" in f["file"]`). Adding a teaching paragraph cannot create an eight-digit
literal next to DNI wording unless the author actually writes one, which is the defect D2
forbids. Baselines confirm it is inert: **0 in 18 of the 19 snapshots**, 4 in S09.

One real but narrow risk: the section filter is a substring match on the file path
(`f"/s{num:02d}-"`), so it depends on filename prefixes and would silently read 0 for a
renamed file — a *false pass*, not a false failure. Not this class. Leave it alone.

### 6. `strict_output_mismatches_in_section` — mostly sound, one real trap

`gate.py:69-81,147`. It runs `scripts/python_content_strict_output_audit.py --only sNN-` and
reads `counts.mismatch`. It only rises when a declared output stops matching what the code
prints — a genuine regression. **Baseline is 0 in all 19 snapshots**, so there is no headroom
at all: any single new snippet whose declared output is off by a character fails.

The trap is that it is a **gate on newly added content as well as existing content**. A
concepts round that adds a worked example (D6 asks for one: `decisions.md:173-178`, "model it
on a worked example with real values") must get its declared output byte-exact on the first
attempt, or the whole round is restored — including the prose, which was fine. That is not
a false positive on the measure, but it is a catastrophic *coupling*: one wrong character in
one new snippet destroys ~75 patches' worth of correct Spanish. I flag it as a blast-radius
problem, not a measurement bug.

### 7. `never_explained` — YES, in the REPHRASE direction (not yet observed, but one sentence from catastrophic)

`run_concepts.sh:2` sanctions three repairs: "Teach, rephrase or remove". `never_explained`
(`gate.py:100,136`) counts concepts with no `first_definition` in `TEACHING_KINDS`
(`concept_map.py:146,152`), and `first_definition` exists only if
`course_event_extractor.mts::definesTerm` (lines 207-243) matched a cue.

**A concept whose definition is rewritten into a clearer sentence that is not on the cue
whitelist drops to L0.** The extractor's own comments say the whitelist is deliberately
minimal (`course_event_extractor.mts:163-176`: "The list is a whitelist, so a missing verb
hides a real definition rather than inventing one" — `divide` alone was the difference
between cross-validation being taught and being "never-explained across all 52 sections").

Measured from `course-state/concept_map.json`: **33 of 106 concepts have exactly ONE
recognised teaching definition.** 11 have none (the L0s). If a round rephrases that one
sentence out of the whitelist, the concept goes L0 and **every one of its uses becomes a
surprising use**:

    +858  for                  only definition: S04 iteration-summaries.S04-T1-A-E2.preamble [wedo.preamble]
    + 54  notebook             only definition: S01 setup.theory[8].p6
    + 43  variable             only definition: S02 basics.S02-T2-A.p1
    + 40  pivot-table          only definition: S17 packaging.iDo.intro
    + 39  ruff                 only definition: S01 setup.outcome[4]  [outcome]
    + 33  defaultdict          only definition: S30 security-infra.S30-T2-A.p3
    + 30  rag                  only definition: S48 ai-governance.jobRelevance
    + 29  iloc-vs-loc          only definition: S15 stdlib-deep.outcome[2]  [outcome]
    + 23  counter              only definition: S08 ...S08-T2-B-E3.instruction [wedo.instruction]

`surprising_uses_course_wide` is **268** today. Rewriting one weDo preamble in S04 takes it to
**1126 — 3.2x** — and `for` is defined in a *weDo preamble*, which is exactly the kind of
half-right placement a concepts round is supposed to improve. Moving `for`'s definition into
S04's theory where it belongs is a textbook correct improvement that has a real chance of
being scored as the worst regression in the campaign's history.

I have NOT observed this firing. I am reporting it as an armed mechanism with a measured
charge, not as a confirmed instance. What makes me confident it is armed: the extractor's own
comments record three separate occasions where a real definition was invisible to
`definesTerm` (`ruff`, cross-validation/`divide`, `Precision`), each found only by hand.

### 8. Absolute gates — one is a hard cap that correct work walks into

`gate.py:253-256` runs `test:v3`, `test:adversarial:node`, `test:adversarial:py` and the
snippets gate. These are pass/fail, so "can improvement raise them" becomes "can correct
added content fail them".

`tests/adversarial/test_over_localized_language.py` caps Peruvian place names at **55 per
section**. `tools/fixer/build_concept_prompt.py:38-59` says in as many words: "Three concepts
rounds have been thrown away on this cap, and every one of them wrote in the house style:
nothing in the prompt said the limit existed." That is three more destroyed rounds of the
same family — a *volume* cap that any added prose in the house voice walks into. It was
mitigated by telling the prompt the remaining budget (`place_name_budget`), which is a
*disclosure*, not a guard: codex can still miscount, and the gate still destroys the round.

`tests/adversarial/narrow-viewport-shrink.test.mjs` is the same shape from OPEN_QUESTIONS Q5
(`audit/fixer/OPEN_QUESTIONS.md:186-190`): correct Spanish "pushed a heading past what the
folded-block/badge layout can shrink to". Longer, clearer wording fails a layout test.

The snippets gate (`gate.py:164-185`) is honest about what it proves and is not in this class.

## Blast radius (measured, with numbers)

- **19 concepts rounds left an apply record** in `.fixer/*k.apply.json`: **80 patches
  offered, 80 applied, 0 rejected.** Codex's Spanish was never refused once. Every loss was
  the machinery.
- **9 destroyed rounds**, none attributable to a rejected patch. Two are documented in
  source comments with their numbers: S17 (`gate.py:102-107` / `tests/adversarial/
  test_gate_concept_measures.py:9-12`) — `never 14 -> 13, used_before_explained 40 -> 41`,
  restored on a round that took the course 420 -> 406 and S17 31 -> 17; and S09
  (`code_switching_audit.py:82-84`) — restored over the word `not` inside «no es un número»,
  on a round that took the course 400 -> 367. Both corroborated by the snapshots on disk
  (`.fixer/S17.gate-before.json` 420/31, `.fixer/S09.gate-before.json` 400,
  `.fixer/S10.gate-before.json` 367). S37 is the third (`git log -1 a7810d38`).
- **Three further rounds** thrown away on the 55-place-name cap
  (`build_concept_prompt.py:41-44`). That is 6 of 9 accounted for by this class alone.
- **`first_use_issues` is 19% double counting today**: 37 points over 30 defective terms;
  7 terms (`for`, `return`, `exception`, `parameter`, `dict`, `pipeline`, `outlier`) pay
  twice for one defect.
- **3 terms are still `NO_VISIBLE_DEFINITION`** (`reshape`, `onehotencoder`, `joblib`) and
  are the highest-priority items in every prompt (`build_concept_prompt.py:117`). `reshape`
  is a live landmine: it is required at `packaging.youDo.objective[2]`, so teaching it
  anywhere after that costs 2 where it now costs 1.
- **Landmine density for `surprising_uses_*`**: terms that a new paragraph cannot even NAME
  without adding a surprising use — **S01: 85 of 106 (80%)**, S05 67, S10 57, S17 33, S52 11;
  mean 31.4. Against baselines of `surprising_uses_in_section` = **2 (S11), 5 (S07), 7 (S06),
  8 (S05/S15)** with zero tolerance.
- **Definition-recognition rate: 8.8%** over all learner-visible teaching prose (310 defines
  / 3,503 mentions over 6,519 events), 13.4% for theory paragraphs. Writing adds mentions
  ~7.5x faster than it adds recognised definitions.
- **`avoidable_english_per_1000`: 52/52 sections fail on one added English token** (delta
  0.081-0.171 against a 0.05 tolerance on a value rounded to 0.1; 51/52 always, S01 ~81%).
  **21/52 sections fail on DELETING under 150 English-free words** (S46 45, S51 52, S28 54).
- **`run_on_sentences` is 0 in 12 sections and <= 2 in 30 of 52**, with zero tolerance,
  against a process whose only action is adding sentences.
- **33 of 106 concepts hang on a single recognised definition**; rephrasing `for`'s one
  sentence moves `surprising_uses_course_wide` from 268 to 1126.
- **`b5_nominal_constructions_per_100_sentences` has been dead for all 19 recorded rounds**
  (null in 19/19 snapshots), so D7 has never been enforced.

## Proposed guards

Ordered by (damage prevented) / (risk of firing on correct work). Every one fails fast and
locally; none is documentation. Existing guards in this area are all *instance* tests
(`tests/adversarial/test_gate_concept_measures.py` pins S17's four numbers;
`test_code_switching_gloss.py` pins the NaN exemption; `test_prose_measure_boundaries.py`
pins the outcome-list run-on). None asserts a *property over the whole gated set*, which is
why the class keeps recurring. G1 and G2 are the ones I would ship first.

---

### G1 — "a gated measure must be capable of being measured"
**File:** `tests/adversarial/test_gate_measures_are_live.py` (new) **plus** an assertion in
`tools/fixer/gate.py::_run` at the `snapshot` branch (line 284-292).

**What it asserts.**
1. *Static half.* Parse `tools/fixer/gate.py` for every `prose.get("K")` / `cs.get("K")` in
   `measure()`, and assert the literal `"K"` appears in the producing script
   (`scripts/prose_quality_audit.py`, `scripts/code_switching_audit.py`). Today this fails on
   `b5_per_100_sentences` and `b5_nominal_constructions`.
2. *Data half.* Assert every such `K` is present in at least one section's row of the
   committed report (`course-state/prose_quality_report.json`,
   `course-state/code_switching_report.json`).
3. *Runtime half.* In `gate.py`, `snapshot` refuses to write a snapshot in which any
   NON-`info:` key is `None`, with the key named. An explicit `MAY_BE_NONE` allowlist, empty
   at first, is the only escape and each entry carries a written reason.

**How it fails.** (1) and (2) are a `unittest` assertion naming the key and both files — sub-
second, runs inside `test:adversarial:py`, which `gate.py:255` already runs as an absolute
gate, so a dead measure fails every round instead of passing 19 of them. (3) fails at
`snapshot`, i.e. **before codex is invoked**, so a broken instrument costs zero quota instead
of a whole round.

**False-positive risk: very low.** Risk is (3) firing on a measure that is legitimately
unmeasurable for one section — `strict_mismatches` returns `None` when the audit cannot run
(`gate.py:79-80`), and a section with no Python snippets is plausible. Mitigation: the
allowlist, and the fact that the current baseline is `0` in 19/19 snapshots, so no section
observed so far produces `None` there. **This guard would have caught the b5 bug on the day
it was written.**

---

### G2 — "improving a term's define-before-use state may never raise its score"
**Files:** `scripts/glossary_first_use.py` (the fix) and
`tests/adversarial/test_first_use_monotonicity.py` (new, the guard).

**The fix.** Change `gate.py:149` from `sum(fu["issue_counts"].values())` to a per-term worst-
code score, and keep the per-code counts as `info:`:

    NO_VISIBLE_DEFINITION 3  >  DEFINITION_AFTER_REQUIREMENT 2  >  USE_BEFORE_DEFINITION 1  >  clean 0
    first_use_issues = sum(worst_weight(term) for term in terms)

Minimal alternative if the weights are contentious: gate on
`len({i["term_id"] for i in issues})` — **30 today instead of 37**. That alone removes the
double count; it does not fix the severity inversion (a never-defined term and a late-defined
term both score 1). **I would ship the distinct-term count immediately** (it is a plain bug
fix with no judgement in it) **and the weighting behind it**, stating that until the weights
land, teaching a never-defined term is scored neutral rather than rewarded.

**What the guard asserts.** Over synthetic payloads built directly for
`audit_concept_events`, exhaustively enumerate every ordering of one term's
(mention, requirement, definition/no-definition) across 4 event slots — a few hundred cases,
deterministic, no I/O — and assert: **for every pair of states A, B where B's definition is
present-and-no-later than A's, score(B) <= score(A).** Plus a named regression case
reproducing S37 (`mention@S24.hint`, `requires@S24.hint`, no definition -> add
`defines@S37.theory`) asserting the score does not rise.

**How it fails.** A `unittest` failure naming the two orderings and the two scores. Runs in
milliseconds inside `test:adversarial:py`.

**False-positive risk: essentially zero.** It is a property of a pure function over
synthetic input; it touches no course content and cannot be affected by a round. It is
exactly the "real, non-tautological test" the repo policy asks for: it fails today, on
`gate.py:149` as written.

---

### G3 — "a definition the course actually writes must be recognised as one"
**File:** `tests/adversarial/concept-definition-detector.test.mjs` (exists — extend it) and a
new corpus fixture.

**What it asserts.** For each of the **33 concepts with exactly one recognised teaching
definition**, pin that sentence as a fixture and assert `definesTerm` still matches it. If a
round rewrites `for`'s only definition and the cue is lost, this fails **naming the concept
and the 858 uses at stake**, instead of the gate reporting `surprising_uses_course_wide:
268 -> 1126` with no explanation.

Second assertion, the one that prevents the *silent* version: `never_explained` may not rise
for a concept the round did not touch. Implement as: `measure()` also records the set of L0
concept ids (as `info:`), and `check` fails with a named list if any concept ENTERED L0.
Today `never_explained` is a bare count, so "one taught, two lost" nets to zero and passes.

**How it fails.** Node test failure naming the concept and the sentence that stopped
matching; the gate failure names the concepts that entered L0.

**False-positive risk: low-moderate.** The fixture half fires when a round legitimately
rewrites one of those 33 sentences into a *different but still-matching* form — in that case
the fixture must be updated, which is the point (a reviewer sees the change). The
entered-L0 half has no false-positive risk I can see: a concept entering L0 is always a
regression by the map's own definition. I am less sure about the fixture half being worth
its maintenance cost than about G1/G2; ship the entered-L0 half first.

---

### G4 — "a ratio may not fail on the denominator"
**Files:** `tools/fixer/gate.py:148` (the fix) and
`tests/adversarial/test_english_measure_is_not_a_ratio.py` (new).

**The fix.** Gate on `english_function_words + ordinary_english_words` (the raw count,
`code_switching_audit.py:161-162`) instead of `avoidable_english_per_1000`, and demote the
ratio to `info:`. Removes the measured failure mode where deleting 45-150 English-free words
fails 21 of 52 sections with no English added.

**What the guard asserts.** Given a before/after pair where the English token count is
unchanged and only English-free prose was removed, the verdict is not `worse`. Table-driven
over the real per-section numbers from `course-state/code_switching_report.json`.

**Trade-off, stated plainly.** The raw count is STRICTER than the ratio for additions: a
section that grows and adds English proportionally used to pass and now fails. I think that
is correct — "we added English" is the defect — but it is a real tightening and it should be
named when it is shipped. It does NOT fix the gloss problem; that is G5.

**False-positive risk: low.** It changes which direction the measure is blind in, not what it
counts.

---

### G5 — "a gloss written in any house-style form is not a leak"
**Files:** `scripts/code_switching_audit.py:90` and
`tests/adversarial/test_code_switching_gloss.py` (exists — extend).

**What it asserts.** The existing exemption is one regex requiring italic English
*immediately* followed by `«`. Extend it to the delimiter set writing rule D4 already names
(`audit/fixer/writing_rules.md:64` — `() [] «» ""`), in either order, and pin one test per
form:

    `NaN` (*not a number*, «no es un número»)     <- exempt today
    `NaN` (*not a number*, "no es un número")     <- counted today
    *not a number* ("no es un número")            <- counted today
    «no es un número» (*not a number*)            <- counted today, gloss-first

**How it fails.** Unit test on `clean()`, naming the form that was not exempted.

**False-positive risk: MODERATE, and this is the one I would be most careful with.**
Widening an exemption makes the gate blind to real leakage — English followed by any
quoted Spanish anywhere nearby would stop counting. The existing test
`test_the_exemption_is_one_count_in_the_whole_course`
(`test_code_switching_gloss.py:69`) is the right shape of protection: pin how many spans the
exemption removes course-wide and fail if widening it removes more than a stated handful.
**Do not ship G5 without that counter test.**

---

### G6 — "a round that cannot pass must not be started" (disclosure, not a gate)
**File:** `tools/fixer/gate.py::_run` snapshot branch, writing `.fixer/$TAG.landmines.json`,
read by `tools/fixer/build_concept_prompt.py`.

**What it does.** At snapshot, for each concept the round will target, compute and record:
does it have a `requires` event earlier than the earliest teachable point in this section
(-> teaching it raises `first_use_issues` under the current scoring); is its only definition
a single cue-match (-> rephrasing it is catastrophic); how many of the 106 terms are unsafe to
name in this section (85 in S01, 11 in S52); the section's `run_on_sentences` headroom and its
remaining place-name budget.

**How it fails.** It does not fail — it prints and it goes into the prompt, the way
`place_name_budget` (`build_concept_prompt.py:38-59`) already does for the place-name cap.
**I am deliberately NOT proposing this as a hard stop.** A gate that refuses to start a round
on a heuristic would itself destroy correct work, which is the harm we are preventing. Its
value is that it makes the trap visible to the author before the quota is spent; the actual
fixes are G1-G4.

## Confidence and what would refute this

**Certain (read directly from the code and the committed data, reproducible in one command):**
- `b5_nominal_constructions_per_100_sentences` has no producer and is `null` in 19/19
  snapshots. Refuted by: finding any script that writes `b5_per_100_sentences` into
  `course-state/prose_quality_report.json`. I checked `git log --all -S` across the whole
  history and found only the consuming line.
- `first_use_issues` double-counts 7 terms today (37 points, 30 terms), and
  `glossary_first_use.py:79-104` has no `elif`/`continue` between its two late codes.
- `avoidable_english_per_1000` sensitivity: one token = 0.081-0.171 against a 0.05 tolerance;
  deletion of 45-150 English-free words fails 21/52 sections. Arithmetic over the committed
  `code_switching_report.json`.
- 33 of 106 concepts have exactly one recognised teaching definition; `for`'s is worth 858
  surprising uses. Arithmetic over the committed `concept_map.json`.
- Landmine densities per section (85 in S01 down to 11 in S52). Same source.

**Confirmed instances (three instruments, not two):** concept_map bucket pair (S17, fixed),
`first_use_all_audit` double code (S37, worked around, code unchanged), and
`code_switching_audit` gloss leakage (S09, worked around by one typographic regex). The third
is confirmed by the audit's own comment at `code_switching_audit.py:82-84` plus the 400 ->
367 figures on disk.

**Inferred, NOT observed — say so out loud:**
- The `never_explained` rephrase direction (measure 7). Armed and charged, never seen firing.
  Refuted by: showing `definesTerm`'s whitelist already covers every reasonable rewrite of
  those 33 sentences. I do not believe that, because the extractor's comments record three
  separate misses found by hand, but I have not tested it. **Testing it properly means
  running the extractor over rewritten sentences, which I could not do — I was instructed
  not to run scripts in this worktree.**
- The claim that a new teaching paragraph adds ~0.68 surprising-use candidates. That is the
  course-wide average mention rate, applied to new prose. New prose written *about* a concept
  probably names more terms than average, so this is likely an underestimate — but I have not
  measured the concepts rounds' own added paragraphs separately.

**What I could not determine:**
- Which 9 rounds were destroyed, and by which key. `run_concepts.sh:28` deletes
  `$TAG.gate-after.json` at the start of each round, so a retry erases the failing record.
  All 19 surviving `gate-after` files have `"failed": []`. **That is itself a defect worth
  fixing: the only durable record of a destroyed round is a commit message.** A one-line
  change — append failures to `.fixer/failures.jsonl` in `check()` before returning 1
  (`gate.py:267`) — would have made this entire analysis a `jq` query instead of a
  reconstruction. I would ship that alongside G1.

**What would refute the root cause as a whole:** evidence that the destroyed rounds failed on
measures rising for reasons unrelated to the round's own additions — e.g. instrument crashes
or stale reports. `gate.py:43-66` and `tests/adversarial/test_gate_measurements.py` already
closed that path, and the two rounds with documented numbers both failed on measures that
moved *because the round improved the course*. But with the failure records deleted I cannot
rule it out for the other rounds.
