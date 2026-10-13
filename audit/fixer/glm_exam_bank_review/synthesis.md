# Recommendation on the GLM lane's exam-bank work (base 29f0af20, uncommitted in the owner's tree)

## 1. Verdict

**Adopt the content with changes, and do not adopt the tooling as it stands.**

- The 118 rewritten questions are a net gain: 92 are better, 20 are unchanged in quality, 6 are worse, and 0 have a wrong key. Integrity holds: 0 reorder failures, and the checker caught both planted mutants.
- The tooling cannot be landed. `apply_bank_repairs.py` cannot repair slot 23 of any bank. `rebalance_exam_bank_positions.py` can silently scramble answer positions. None of the new code has a test. Four functions are over the complexity ceiling of 15.
- The decision behind the work (D15) cannot be recorded as written. Its root cause is false at HEAD. Its number also collides with a different D15 already on origin/main.

## 2. What the work actually does

**Scope**
- 118 of 1248 questions changed, all in 5 banks. The other 1130 questions, the other 47 banks and all non-bank code in `prisma/seed.ts` are byte-identical to HEAD.
- The 1250 `question:` hits are 1248 questions plus 2 that sit outside the bank.
- Both versions have the same 52 keys, 24 questions per key, the same concept in every slot, 0 slot moves and 0 changes to the number of options.

**Changes by type**
- 6 questions were only reordered.
- 1 question was reordered and its explanation edited.
- 111 had option text edited.
- 88 had the stem edited.
- 111 had the explanation edited.
- 88 had `correctIndex` changed.

**Changes by section** (changed / options edited / stems edited / `correctIndex` changed)

| Section | Changed | Options | Stems | `correctIndex` |
|---|---|---|---|---|
| S05 functions-contracts | 24 | 24 | 23 | 16 |
| S08 files-ingestion | 23 (6 reorders) | 17 | 9 | 18 |
| S09 exceptions-logging | 24 | 24 | 10 | 18 |
| S10 modules-packaging-cli | 23 | 23 | 23 | 18 |
| S11 oop-domain | 24 (1 reorder) | 23 | 23 | 18 |

**Length cue** (the correct option is the longest one)
- Course-wide, strictly longest: 1156 → 1107 of 1248.
- Course-wide, longest including ties: 1165 → 1119.
- Under main's ratchet test (`tests/adversarial/test_exam_length_cue.py`): 1125 → 1079 of 1200. I re-ran this test in scratch, and the working seed fails `test_repairs_are_kept`.
- In the 118 changed items, the key is the unique longest option in 61 (52%), down from 110 (93%). The mean ratio of key length to distractor length fell from 2.26 to 1.13.
- The cue is still strong in S08 (18 of 23) and S09 (18 of 24). It is largely gone in S05 (9/24), S10 (7/23) and S11 (9/24).

**Answer position**
- All 5 banks now follow the D15 §4 position cycle.
- At HEAD, every S10 and S11 question had `correctIndex` 1. The app sends options in stored order (`src/app/api/exam/start/route.ts:116` on main), so always picking B scored 100% in those two sections.
- 29 of 52 banks still have `correctIndex` 1 on all 24 questions.

**Provenance**
- Seven codex result files are on disk in `.fixer/`, and the working seed matches them exactly.
- Their `section_id` was changed by hand afterwards (for example "S08" became "files-ingestion"), and that change is not logged.
- `.fixer/` is gitignored (`.gitignore:103`), so none of this record would land in the repo.

## 3. Defects, blockers first

**B1. The decision number collides with main (blocker).**
- On origin/main, `audit/fixer/decisions.md` already uses D13 (self-answering pass), D14 (graded exercise re-engineered) and D15 (ADR-7, static edition with accounts and billing), and runs to D20.
- The owner's tree uses D13 (run_id), D14 (route 2) and D15 (exam banks), and main has none of those three.
- All three scripts cite "D15 §4": `apply_bank_repairs.py:14`, `rebalance_exam_bank_positions.py:2` and `exam_selfcheck_pedagogy_audit.py:188/214/226/320/355`.
- Fix: land the exam-bank decision as D21, and the other two as D22 and D23. Update every "D15" reference in the scripts.

**B2. D15's root cause is false (blocker for the record, not for the content).**
- HEAD already has authored 24-question banks for all five sections, under double-quoted keys: `git show HEAD:prisma/seed.ts` lines 1339, 2025, 2363, 2653 and 2943. They were introduced by a492d8ea on 2026-09-16.
- The figure "47 of 52" matches the 44 single-quoted keys plus the 3 unquoted keys. That points to a parser that missed the 5 double-quoted banks. This is an inference.
- Whether deployed databases really returned 404 is UNDETERMINED.
- So the work replaced 118 existing items; it did not author new coverage. Under preservation-first, the owner must approve a replacement.
- Fix: correct the root cause, and change §6 from "47 today" to 52.

**B3. Main's length-cue ratchet fails on landing (blocker).**
- `test_repairs_are_kept` fails on the working seed: 1079 against the pinned 1125.
- Fix: set `LONGEST_IS_CORRECT_OWED` to 1079. `PERFECT_CUE_BANKS_OWED` stays at 11, which I verified.
- That test's docstring says "never trimming the key". The bandfix prompt says "Trim the correct option to the band". That conflict needs an owner ruling (see section 7).

**B4. `apply_bank_repairs.py` cannot repair slot 23 (blocker for the tool).**
- I confirmed this by reading the code. The block it rebuilds (`original[km.end():i]`, lines 155-162) includes the bank's closing `]`.
- The last part is then replaced by a new string without `]` (lines 210-214). Its own balance gate then refuses to write.
- It also has other defects:
  - The docstring promises "no silent double-apply", but rerunning an older repair set silently reverts a newer repair.
  - Duplicate slot indexes collapse silently.
  - Questions with 3 or 5 options, and empty strings, pass.
  - A raw carriage return passes, and `tsv()` escapes only `\`, `'` and `\n`, so the written seed is invalid TypeScript.
  - Brackets inside strings, such as `[0, 5)`, crash it with an IndexError.
- Fix: rebuild it on the TypeScript compiler API, as `scripts/rebalance_selfcheck_positions.mjs` already does, or do not land it.

**B5. `rebalance_exam_bank_positions.py` can silently scramble answers (blocker for the tool).**
- It sees only the 5 double-quoted banks (key regex at line 62).
- In one test, an options array written with double quotes made `--write` move 20 of 24 answers off the cycle while it reported `uniform_ok=true`.
- It has no write gates and always exits 0.
- Fix: do not land it. Rather than extend it, retire the static position cycle (see 7.2).

**M1. No tests.** Nothing tests the new scripts, the two schemas or the new audit checks. `grep -rnE 'exam_selfcheck|apply_bank|rebalance_exam|QUESTION_BANK|exam_bank' tests` returns nothing.

**M2. Complexity over the ceiling.**
- `apply_bank_repairs.py:133` `main` is 54.
- `apply_bank_repairs.py:47` `bracket_balance` is 28.
- `rebalance_exam_bank_positions.py:56` `main` is 21.
- `exam_selfcheck_pedagogy_audit.py:213` `bank_balance_issues` is 18.
- The audit's `main` rose from 16 to 27.
- `scripts/complexity_gate.mjs` scans only TypeScript, so no gate catches any of these.

**M3. The audit does not enforce D15.**
- It has no check of answer positions: setting every S05 `correctIndex` to 1 still gives `ok=True`.
- The §3 "not cosmetic rewording" check catches only exact duplicates.
- The §6 "exactly 3 variants" check is report-only.
- Deleting `course-state/exam_bank_coverage_floor.json` resets the floor to 0. The audit then writes a new floor itself (around line 352), so coverage can fall with exit 0.
- Fix:
  - Store the floor as a tracked set of slugs.
  - Treat a missing floor file as P0.
  - Never write the floor from inside the gate.

**M4. S10 slot 1 has a key that the Python docs contradict.**
- The key (`seed.ts:2582`) says `python -m` "evita depender del `cwd`".
- The docs say the opposite. Current docs (3.14.8, cmdline, under `-m`): "the current directory will be added to the start of sys.path". Only `-P` or `PYTHONSAFEPATH` stops this.
- The lesson makes the same claim: `s10-modules-packaging-cli.ts:98` and `:812` in the owner's tree, and `:69` on main ("sin pelear con sys.path").
- Fix: Codex rewrites the key and the lesson lines together.

**M5. Eight items need another Codex pass.**
- Six items got worse:
  - S09#9: the defining property of the key moved into a distractor.
  - S09#20: the key is a telegraphic fragment ("Conteos, entradas críticas, política válida", `seed.ts:2517`).
  - S09#21: only the key starts with "Cuando".
  - S10#23: "S10 fija INFO" is called the safe default. Python's root logger defaults to WARNING (verified in the current logging docs).
  - S08#7: the question drifted from CSV dialects and headers to the order of Decimal conversion.
  - S05#16: only the key contains `==`.
- Two items have other problems:
  - S09#22: the key does not complete the stem "debe ser preferentemente:".
  - S11#22: it now repeats slot 20 (inject a fake repository).

**M6. S10#3 overgeneralises circular imports.**
- The key (`seed.ts:2605`) says the package "falla al arrancar". The lesson says the same (`s10:742`).
- The Python 3.12 FAQ says a circular import fails only when a name is read before its module finishes initialising.
- Fix: the key and the lesson change together.

**M7. Much of the length balance came from padding distractors that are still implausible.**
- 59 of the 118 items had distractors grow by more than 1.5×.
- Items where at least 2 distractors carry an absolute term and the key carries none rose from 22 to 27.
- All 96 S05 options end with a period, against 0 in each of S08, S09, S10 and S11.
- Some ungrammatical distractors from HEAD were left in place, for example "Compila el código a más rápido" (S09#7).

**M8. The provenance record will not land.**
- The codex results live only in gitignored `.fixer/`.
- The rename of `section_id` is not logged.
- There is no `.apply.json` record.
- Fix: copy the 7 result JSONs and the prompt hashes to a tracked `audit/fixer/` path.

**Minor findings, reported under the 5 Oct rule** (all pre-existing, and also on main)
- The S12 (`apis-sql-geo`) and S13 (`evidence-dashboard`) banks are stand-ins. All 48 stems are one template, "[S12/A] Sobre «…», ¿cuál es la práctica correcta…", and every family repeats the same options across its three variants.
- These two banks are the real "missing exam banks", not S05 or S08–S11.
- About 20 late banks have a median explanation of 39 characters or less. `multimodal` has a median of 19.
- Dead code in the tooling:
  - `apply_bank_repairs.py:164` has an `if False` branch.
  - Line 198 has a join that changes nothing.
  - `rebalance_exam_bank_positions.py:106-107` is a loop whose body is only `pass`.

## 4. How to land it

**Base**
- 29f0af20 is an ancestor of origin/main, which is c36783dc (273 commits ahead).
- `git log 29f0af20..origin/main -- prisma/seed.ts scripts/exam_selfcheck_pedagogy_audit.py` returns nothing. The seed on main is byte-identical to the base, so the bank and audit diffs apply cleanly.
- Main did change the exam routes, under its own D12: `start`, `submit`, `exam-scoring.ts` and `schema.prisma` (+619/−139).
  - D12's `ExamAttemptForm` stores each attempt's questions and key. A reseed therefore cannot change an attempt in progress.
  - Exposure is keyed by (concept, variant) (`start/route.ts:88`). A rewritten item keeps its old "seen" status, which errs on the safe side.

**Open PRs**
- No open PR touches the seed, the audit, the rebalancers or the schemas. `git diff origin/main...origin/<branch> --stat` on those paths shows only test files and `OWNER_DECISIONS.md`.
- #80 adds `audit/fixer/OWNER_DECISIONS.md`, which is where codex briefs read owner decisions.
- #82's badge claims include each "section exam" (for example `S51-EXAM`), and the S12/S13 stand-ins weaken those claims.
- #81 and #84 do not interact with this work.

**What to carry over**
- Start a fresh worktree from origin/main.
- Carry over:
  - The 5-bank seed diff, minus the 8 items in M5, which go back to Codex.
  - The audit diff, rewritten under 15 complexity.
  - The floor, as a set of slugs.
  - The two schemas.
- Do not carry over `rebalance_exam_bank_positions.py`.
- Carry over `apply_bank_repairs.py` only after it is rebuilt on the TypeScript compiler API.

**Constants that must move**
- `tests/adversarial/test_exam_length_cue.py:33`: `LONGEST_IS_CORRECT_OWED` goes from 1125 to 1079.
- `PERFECT_CUE_BANKS_OWED` stays at 11.
- That test's `_BANK` regex sees only single-quoted keys, so it measures 1200 of 1248 questions.
- Widening the regex is a separate commit with its own mutation proof. The honest figure then becomes 1119, ties included.

**Tests to add** (each with the mutant it must catch)
1. Bank integrity: 52 active slugs, 8 concepts × 3 variants, 4 distinct non-empty options, and `0 <= correctIndex < 4`. Mutants: drop a variant, use 3 options, duplicate an option, set `correctIndex` to 4.
2. Position balance as a ratchet, with 29 all-B banks owed. Mutant: set every S05 `correctIndex` to 1. Today's audit passes this mutant.
3. Floor: a missing file is P0 and a shrinking slug set is P0. Mutant: delete the file and cut S05 to 6 concepts. Today this exits 0.
4. Parallelism: catch near-duplicate variants. Mutant: variant B equals "[B] " plus variant A.
5. If the applier is kept:
   - A slot-23 repair applies, and the output parses as TypeScript. Mutant: the current code.
   - A CR, 3 options, a duplicate index, or rerunning an older set after a newer one is refused.
   - `[0, 5)` inside a string applies.
6. Every new Python function stays at complexity 15 or below. Extend the complexity gate, or add a radon check, because `complexity_gate.mjs` does not see Python.

**Where D15 is recorded**
- It exists only in the uncommitted `decisions.md`, under a number main uses for something else.
- No gate reads it. The scripts cite it only in comments.
- Record it as D21 with the corrected root cause.
- After #80 lands, add an O-entry to `OWNER_DECISIONS.md`, so codex briefs inject it.

**Deploying**
- `prisma/seed.ts` runs `questionBank.deleteMany({})`, which deletes every question row.
- D15 §7 makes a reseed ask-first, so it needs the owner's explicit approval.

## 5. The 52 → 55 renumber

Five things in this tooling are tied to section numbers. Each needs its own fix.

**1. The position cycle is keyed to section number.**
- All three tools compute `SECTION_CYCLES[(index-1) % 4]` from the section's mutable `index:` field:
  - `apply_bank_repairs.py:29` (via `section_number()`)
  - `rebalance_exam_bank_positions.py:30-35`
  - `scripts/rebalance_selfcheck_positions.mjs:32-41` on main
- Shifts of +2 and +3 are not multiples of 4, so every bank and self-check after S18 gets a new required cycle.
- The applier would then refuse every repair to a shifted bank that had been rebalanced, and the audit would not notice the drift.
- Fix, in order of preference:
  1. Shuffle options per attempt in `exam/start` and store the permuted key in `ExamAttemptForm`. This removes the position contract altogether.
  2. Otherwise, check a property that does not depend on the number: each position 6 times per 24 questions, and no run of 3.

**2. The coverage floor is a count.**
- The new S19, S20 and S35 will have no bank. That gives 3 `bank_missing` P0s, and the audit returns 1 (line 413), so `test:unit` turns red.
- The renumber PR must either ship 3 banks or carry an explicit owed list.
- A slug set also prevents a swap, where one section gains a bank while another loses one and the count stays the same.

**3. The codex artifacts are number-keyed.**
- Files are named like `.fixer/S08bankaudit.*`.
- Codex returned `"section_id":"S10"`, which was then rewritten to the slug by hand.
- Fix: require the slug in the prompt and in `exam_bank_repair.schema.json`.

**4. Some learner-facing text names section numbers.**
- Items that name a section number rose from 61 to 72. All of the new ones are S05–S11, which do not shift.
- 4 existing items name S30 or S31. The renumber map must rewrite them.
- Prefer "esta sección" over a number in stems.

**5. What already survives.**
- `QUESTION_BANK` keys, the audit's active slugs (from each section's `id:` field) and main's `loadSectionBank(sectionId, aliases)` are all slug-keyed.
- Exam IDs such as `S51-EXAM` in #82 are not slug-keyed and need the renumber map.

## 6. Docs-check verdicts

**Python (current docs)**
- WRONG: the S10#1 key about `-m` and the working directory (cmdline docs, 3.14.8).
- Debatable: S10#23's "INFO is the safe default", because the root logger defaults to WARNING.
- Overgeneralised: S10#3's claim about circular imports (FAQ, 3.12.15).

**PR #81** has 0 WRONG claims (5 confirmed, 3 nuanced). Three points should still be fixed:
- **Concurrency:** `concurrency: {group: pages, cancel-in-progress: true}` (deploy.yml lines 21-23) is evaluated before the job's `if`.
  - A run that later skips, such as one after a failed Tests run, can therefore cancel a good deploy that is in progress.
  - This is already on main. GitHub's Pages starter uses `cancel-in-progress: false`.
  - Fix: move concurrency to the job, or set it to false.
- **Wording:** tests.yml calls the branch-creation `before` "null". It is forty zeros, and GitHub documents that only on the receive side. `github.event.created` is the documented signal.
- **Defense in depth:** add a `workflow_run.head_repository.full_name == github.repository` check.

**Node 20 actions**
- `upload-pages-artifact@v3` and `deploy-pages@v4` still declare node20.
- They are not blocking: a deploy succeeded on 2026-10-06T20:28Z (#83), after Node 20 was removed on 2026-09-23. This resolves the lane's UNDETERMINED.
- Upgrading to v5 is deferrable. `upload-pages-artifact` v4 and later drop dotfiles, so check `out/` for any first.

**scipy 1.13.1:** all 6 APIs are confirmed and ran in `.venv-content`. The statistics design document was not found, so its assumed signatures are UNDETERMINED.

**Item-writing research**
- D15's blocked research can now be closed.
- Haladyna, Downing and Rodriguez (2002), and the NBME Item-Writing Guide (6th ed., pp. 21-25), both say to vary the key position and keep options about equal in length.
- NBME's fix for long keys is to "Remove language used for teaching points and rationales". That supports trimming rationale from the key, and contradicts main's blanket "never trim the key".

## 7. Owner decisions needed (recommendation first)

1. **Keep 110 of the 118 rewrites, and send the 8 in M5 back to Codex.** This replaces existing items, so it needs explicit approval under preservation-first. The S10 `-m` and circular-import lesson lines are corrected in the same round.
2. **Replace the static position cycle with a per-attempt option shuffle stored in `ExamAttemptForm`.**
   - It fixes all 29 all-B banks with no edits to the seed text.
   - It survives the renumber.
   - Learners will see options in a different order on each attempt, and that needs its own test.
   - 0 options in the bank refer to other options ("anteriores"), so shuffling breaks no item.
3. **Rule on trimming the key.** Remove teaching and rationale language from the key, as NBME says. Never remove the precision that makes it correct. Amend main's test docstring to match.
4. **Record the decision as D21** with the corrected root cause (52/52 at base; the gap was a quoting artifact). Add an O-entry once #80 lands.
5. **Approve a reseed after merge.** D15 §7 makes it ask-first. D12's form table protects attempts in progress, and exposure carries over through (concept, variant).
6. **Schedule the S12 and S13 stand-in banks (48 templated questions) as the first real bank-authoring rounds.** They, together with the thin late banks, are the actual exam-bank gap.
7. **Drop `rebalance_exam_bank_positions.py`.** Land `apply_bank_repairs.py` only after it is rebuilt on the TypeScript compiler API with the tests in section 4.

My scratch outputs are in `/private/tmp/claude-501/-Users-pabloillescas-Documents-GitHub-pyarcana/7ce613dd-3e23-4ed3-b165-9bffbd388440/scratchpad/glm-bank/` (`synthesis/` holds the length-cue rerun). I wrote nothing to the owner's tree.