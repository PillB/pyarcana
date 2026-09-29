# S03 route-2 plan: red-team findings, round 1 (2026-09-28)

Twelve attackers, one per readiness dimension of `LESSON_READINESS.md`, against the plan from
the S03 mapping workflow. Round 1 only: the session hit its usage limit and rounds 2 and 3 died
(see LEDGER_NOTES, "A dead reviewer is not a clean review"). Three of round 1's twelve attackers
(writing, python, pins) also died, so this is 9 of 12 dimensions, one round.

2 blocker, 36 major, 30 minor.

## [blocker] SECTION: removing 'dict' from S03-T3-A-E3 hint[1] and 'for' from S03-T4-B-E2 hint[1] and tests; the plan's 'AFTER THE ROUND' expectations

**Problem.** Once S03 stops using dict in its practice text, the course's first dict requirement moves into S04. S04 is CP-N1-A's gate section, so CP-N1-A gains a new CAPSTONE_GATE_VOCABULARY_GAP finding (0 → 1). The gate only checks the course-wide total, and that total falls from 29 to 26, so the gate hides the new row. Two of the four S03 badges require CP-N1-A as a project. The procedure counts any row regression as a failed round, and the plan neither expects this row nor resolves it. The plan also implies the dict and for gaps both disappear. For the four S03 badges only 'for' goes; 'dict' stays, relocated to S04.

**Evidence.** Gap: 'dict' is first required at decisions-rules.S03-T3-A-E3.hint[1] (s03:1735 'DOC_LEN = {"DNI": 8, ...}') and first defined at iteration-summaries.S04-T4-A-E3.preamble (s04:1615). The next requirement after S03 is iteration-summaries.S04-T3-B-E3.instruction (s04:1477 'Arma `rejects` desde el dict…'), which still comes before that definition.

The S04 definition is spurious: the extractor's APPOSITIVE rule matches ', un typo de' after 'dict' (checked on 3.12).

Why CP-N1-A: badge_readiness_audit.py:157-168 counts gaps in the gate section only. INDEX.json:10-11 and catalog.ts:59 set CP-N1-A's gate to S04. The current report row is {'id':'CP-N1-A','gate_section':'iteration-summaries','blocking_term_gaps':0}.

Simulation over .fixer/events.json: I reimplemented audit_concept_events and the readiness bucketing in a temp script. It reproduces today's 24 warnings + 5 failures = 29. After dropping dict/for from every decisions-rules event:
- CP-N1-A: None -> (1, ['dict'], ['iteration-summaries.S04-T3-B-E3.instruction'])
- progress_phase0_walked, python_data_foundations and integrated_python_ai_capstone_foundations: (2, ['dict','for']) -> (1, ['dict'])
- progress_journey_completed: 5 -> 4
- Total: 29 -> 26.

badge_catalog.json lists CP-N1-A in required_projects of integrated_python_ai_capstone_foundations and progress_journey_completed.

LESSON_READINESS.md:87-90: 'a total can hold while one badge gains a finding… Any regression in any dimension is a failed round.'

**Fix.** Write the expected row diff into the plan before execution:
- the four S03 badges each lose 'for' and keep 'dict', now located at S04;
- CP-N1-A gains 'dict' at iteration-summaries.S04-T3-B-E3.instruction.

Then decide how CP-N1-A's new row is handled, as an ask-first item because it concerns a capstone:
(a) The owner accepts it as a pre-existing S04 gap the round uncovers. Its hidden cause is the spurious appositive credit at s04:1615. Record it in OPEN_QUESTIONS and in WORK_QUEUE for S04's route-2 round, which removes dict from S04-T3-B-E3's instruction and hints or teaches dict first.
(b) Add S04-T3-B-E3's instruction and hints as an explicit satellite of this round.

Fix the 'AFTER THE ROUND' note to say that only 'for' leaves the badge rows.

## [blocker] theory[11] S03-T4-B, S03-T4-B-DEMO, S03-T4-B-E2, S03-T4-B-E3

**Problem.** With case blocks, each assert checks only the copy of the chain in its own block. There is no single implementation for a test to protect. The plan's 'verified' mutant claims hold only when the defective edit is applied to every copy, and no learner edits that way. So T4-B's core concept (a test per branch keeps one rule from regressing; the red → fix → green cycle; the pinned 'which defective change turns this line red' challenge) is watered down. The retargeted 'Predice la prueba roja' experiment stays green in 3 of the 4 places a learner could make the edit.

**Evidence.** Plan theory[11]: 'Both mutants go red: dropping `or isinstance(edad, bool)` fails at True, and `edad <= 0` fails at 0.' Plan T4-B-DEMO: 'dropping `edad < 0` turns the -5 assert red (verified)'. Plan T4-B-E2 admits the class: 'a `>`-for-`>=` edit in one copy stays green, because the suite checks five copies.' Today's pins and prose that rely on one implementation: s03:476 'El ciclo **prueba roja → ajustar regla → verde**', s03:478 '¿qué assert revela el error de escribir `edad > 18`?', s03:913 'explica qué cambio defectuoso la volvería roja', s03:2237 'Propón un cambio defectuoso que solo una frontera detectaría'. I ran scratchpad/ped9/t4b_blocks.py (the plan's 4 blocks None/True/-5/0, with the mutant `edad <= 0` placed in one copy at a time) under .venv-content 3.12. It printed: 'mutant `edad <= 0` in block 0 (None): exit=0', 'block 1 (True): exit=0', 'block 2 (-5): exit=0', 'block 3 (0): exit=1 last=AssertionError'. I ran t4be3_t2ae2.py on the T4-B-E3 blocks 18/17/None/30 with `18 < edad` in one copy. It printed exit=1 only for block 18 and exit=0 for blocks 17, None and 30.

**Fix.** For the items that teach a red test (theory[11] and T4-B-E3 at least), switch to the selector form the plan already uses for the youDo: one chain, and an opening line that picks one named case `edad, esperado = CASO_...`. A defective edit to that single chain then turns red on the run that selects the boundary case. Say once that running every case in one command is S04's job. If blocks are kept, do two things. (a) Move every mutable part of the rule into shared UPPER_CASE constants, as T4-B-E2 does with UMBRAL_* (the plan verified these go red globally), and retarget T4-B p5, the T4-B-DEMO pinned retrospective and the E2 retrospective to a constant change. (b) Add one sentence to T4-B saying that each assert checks only the copy above it. Never claim a mutant 'turns X red' without saying which copy is edited.

## [major] S03-T1-B-DEMO (s03:581-627) + S03-T1-B-E3 (s03:1160-1212)

**Problem.** The plan inverts the T1 → T2 arc. It puts if/elif/else chains into two T1-B items, and its own theory[5] item keeps T1-B free of chains. As a result, the learner first writes an exclusive if/elif/else in a T1-B transfer exercise (E3), before T2-A-E1, the guided exercise that is meant to be the first practice of that skill (outcome O3). T2-A's theory still announces if/elif/else as the new idea.

**Evidence.** Plan T1-B-DEMO: 'Each runs the four-branch policy chain (is None / == 0 / < 0 / else)'. Plan T1-B-E3: 'each `if monto is None → review / elif monto < 0 → reject / else → accept`' and 'The learner now writes the exclusivity with elif/else'. Plan theory[5]: 'The policy (absent → review, zero → accept, negative → reject) stays in p4 as prose. It becomes branches in T2.' Kept prose: s03:60 «T2 pasa al control de flujo: `if`/`elif`/`else`»; s03:246 «ahora esos booleanos se convierten en una sola rama dominante. La forma canónica de una decisión exclusiva es `if` / `elif` / `else`»; s03:927 (T1-A-E1) «el motor aún no escribe `if`; primero debe predecir booleanos». Today the first elif/else in S03 code is theory T2-A (s03:258). The current T1-B-DEMO (s03:591-598) and T1-B-E3 (s03:1198-1203) have no elif or else. T2-A-E1 is kind 'guided' (s03:1216). Page order puts all theory first, but the weDo order (T1-B-E3 before T2-A-E1) holds in every reading mode.

**Fix.** Pick one of two options and state it. (a) Keep T1 free of chains, as theory[5] already is. T1-B-DEMO prints the value, bool(monto), `ausente` and `negativo` columns per block, and the policy stays prose until T2. T1-B-E3 repairs the truthiness-as-presence bug in the condition itself: the starter's `rechazar = not monto` prints True at 0; the fix is `ausente = monto is None` and `negativo = monto is not None and monto < 0`, checked on None/0/-1/100. The tri-state chain is then first written in T2-A-E1 and T2-B-E1, which already hold it. This keeps the item's worth, the same bug and the same four cases (D14). (b) If T1-B keeps its chains, rewrite s03:60 and theory[6] p1 so that T2-A deepens if/elif/else (exclusivity, overwrite, boundaries) instead of introducing it, and give T1-B-DEMO one sentence that introduces elif/else as the first reading of a chain.

## [major] S03-T1-B-E1 (s03:1064-1113)

**Problem.** The plan replaces `{}` with `()`, the empty tuple. The course has never shown that value, and the T1-B theory sitting above this exercise says the forms of empty collections belong to S06. The learner must predict `bool(())` for a literal they have never been taught, so the plan swaps one S06 construct for another. It also leans on the half-truth that 'parentheses make a tuple' (`(5)` is not one). This breaks D14 rule 1: only constructs introduced at or before the section.

**Evidence.** - Plan: 'Replacements: {} → (), set() → Decimal("0.00"), range(0) → "0"'.
- The planned values run on .venv-content 3.12 print '() → False' (8 False, then 4 True).
- s03:194 (T1-B p1): 'Las colecciones vacías también son falsy, pero estudiarás sus distintas formas en S06.'
- s02:176 introduces the tuple only through `(True, 19, None)`.
- A grep of s01-setup.ts and s02-basics.ts finds no `()` value and no «tupla vacía».

**Fix.** Replace `()` with `" "`, a one-space string. It is truthy, an S02 type, and the blank-versus-empty intake trap that T1-B p2's `not s.strip()` already names. The counts become 7 False + 5 True, so update Éxito, tests, feedback and hints; «doce valores» still holds. Only if 8+4 is required instead: add one sentence to T1-B p1 showing `()` as the empty tuple, and reword its «S06» deferral.

## [major] S03-T2-A-E2

**Problem.** The rebuild drops the score = 30 case, so the reject branch of the exclusive chain the learner writes never runs. A learner whose `else` assigns the wrong status gets exactly the solution's output. The plan's own R3 (one case per branch of the chain the item teaches) is broken without a named exception, and this graded exercise loses a check it has today (D14.3).

**Evidence.** Plan: 'Blocks score = 95 and score = 60 … 30 becomes a named prediction.' Today's Éxito at s03:1275 is 'para 95, 60, 30 → `good` da `accept`, `review`, `reject`', and today's output (s03:1335-1337) includes '30 bad= reject good= reject'. I ran scratchpad/ped9/t4be3_t2ae2.py. It printed 'plan, correct else=reject : ['95 bad= review good= accept', '60 bad= review good= review']' and 'plan, WRONG else=review : ['95 bad= review good= accept', '60 bad= review good= review']', which are identical. It also printed 'today, WRONG else=review : [..., '30 bad= reject good= review']', where the 30 row exposes the defect.

**Fix.** Keep three blocks: 95, 60 and 30. If length is the constraint, put the per-assignment trace prints only in the 95 block, where the overwrite happens, and not in the 60 and 30 blocks. Never drop the case. Restore the reject row in the Éxito line.

## [major] S03-T3-B-E1

**Problem.** This guided item's R5 fix-once starter holds only the MISSING block, so the OUT_OF_RANGE defect does not show in the starter's output. The plan admits this. Under the copy routine, a learner who repairs the visible row, copies the block, and then fixes OUT_OF_RANGE only where it shows up (in its own block) matches the solution output exactly, while 3 of 4 copies still map OUT_OF_RANGE to review. That is a false green in the most scaffolded stage, the same class the plan removed from T4-B-E3. Today's starter shows both defects in one run.

**Evidence.** Plan: 'Starter (R5): one block at MISSING holding both DEFECT rows … because the OUT_OF_RANGE row's defect does not show in the MISSING block.' Today's starter (s03:1807-1817) loops over OK/MISSING/OUT_OF_RANGE/FOO, so 'MISSING reject' and 'OUT_OF_RANGE review' both print. I ran scratchpad/ped9/t3be1.py. It printed 'OK → accept', 'MISSING → review', 'OUT_OF_RANGE → reject', 'FOO → review' and 'matches planned solution output: True', while 3 of 4 copies still carry `elif code == "OUT_OF_RANGE": status = "review"`.

**Fix.** Hold two blocks in the starter, MISSING and OUT_OF_RANGE, so each planted defect prints. Instruct the learner to repair both rows in the first block and then replace every other block with a copy of it, never patching a copy. Generalise R5: every planted defect must print in at least one starter block, and after any later repair every block is re-copied from the repaired one.

## [major] S03-T4-B-E3 (s03:2284-2347)

**Problem.** The plan keeps the 4 case blocks (18, 17, None, 30) 'identical to the pin', but its chain has 4 branches and no case reaches the reject branch (`edad < 0 or edad > 120`). This is the O8 subtopic's suite exercise, next to theory that says 'El else/default también cuenta' (s03:475). It breaks the plan's own R3 ('one case per branch of the chain the item teaches'). Deleting or widening the reject branch leaves the learner's suite green.

**Evidence.** s03:2291 Éxito lists only '18 → accept, 17 → review, None → review y 30 → accept'. The plan's T4-B-E3 chain is 'None → review; 18 <= edad <= 65 → accept; <0 or >120 → reject; else review'. t4b_e3.py printed 'mutant=drop_reject suite green: True | -5 -> review | 130 -> review' and 'mutant=widen suite green: True | -5 -> reject | 130 -> review'.

**Fix.** Add one reject block, e.g. (121, "reject"), which uses the second alternative so it also guards `> 120`. The solution output gains 'PASS 121 reject'; update Éxito, the tests field and the instruction's 'cuatro PASS'. Keep the fix-once starter as a single (18, "accept") DEFECT block. Optionally add a (66, "review") block, because the rule claims 65 as an inclusive boundary. D14: worth rises and the objective is unchanged.

## [major] S03-selfCheck.Q7 (s03:2565-2572) + exam bank prisma/seed.ts:792-794

**Problem.** This is O4's only self-check item, and it keeps a claim that is false once return is gone. It says that putting `if valor is None` before `if valor < 18` avoids the TypeError. That is true only when the first `if` returns. In the rebuilt S03 every rule is a top-level chain that assigns and never returns, so two separate `if`s in that order still raise TypeError; only `elif` protects. The plan says Q7 'already fits a flat funnel', which is wrong. Its assessments rescope list also misses the exam bank item on the same point.

**Evidence.** s03:2567: '¿por qué debe ir `if valor is None` antes de `if valor < 18`?' The correct option (s03:2568) reads 'Porque comparar None con < lanza TypeError; la ausencia se resuelve primero'. seed.ts:792: 'Si escribes `if edad < 18: ...` antes de `if edad is None:`, ¿qué riesgo concreto hay?' and its correct option at :794, '...la guard de ausencia debe ir primero'. The plan's selfCheck.Q7 row says 'the wording already fits a flat funnel'. Its assessments list covers :722/:723/:749/:772/:778/:782/:806/:869/:878/:935 but not :792/:794. Ran with .venv-content 3.12: `valor = None` / `if valor is None: status = "review"` / `if valor < 18: status = "review"` printed "TypeError: '<' not supported between instances of 'NoneType' and 'int'". The same code with `elif valor < 18:` printed 'review'.

**Fix.** Q7: rewrite the stem so the second test is `elif valor < 18` in the same chain (in Spanish: a chain of guards). The pinned substring 'comparar None con < lanza TypeError' is in the option, not the stem, and survives, as does correctIndex 1. Optionally add to the explanation that a separate `if` would still reach `None < 18`. That is the O4 point in the rebuilt form. Exam :792: rewrite the stem as `if edad < 18:` placed before `elif edad is None:` in one chain, keeping correctIndex 0. Add :792/:794 to the plan's exam-bank rescope list.

## [major] S03-selfCheck.Q7 (s03:2567) and exam bank :792

**Problem.** The plan says Q7's wording 'already fits a flat funnel'. It does not. The stem sets `if valor is None` against `if valor < 18`: two separate `if` statements. After the plan S03 has no early return, and theory[6] now runs the two-if overwrite to show that consecutive `if`s both evaluate. With two `if`s, putting the None check first still raises TypeError. So the keyed rationale ('la ausencia se resuelve primero') is false for the code shown, and a learner who absorbed theory[6] is penalised. Bank twin :792 ('`if edad < 18: ...` antes de `if edad is None:`', keyed answer 'la guard de ausencia debe ir primero') has the same defect and is not in the plan.

**Evidence.** s03:2567 'En un validador con guards, ¿por qué debe ir `if valor is None` antes de `if valor < 18`?'; the correct option is 'Porque comparar None con < lanza TypeError; la ausencia se resuelve primero'. I ran two scripts with .venv-content 3.12.12. With `if valor is None: …` followed by a second `if valor < 18: …` and valor = None, it printed "TypeError: '<' not supported between instances of 'NoneType' and 'int'". With the second line as `elif valor < 18:`, it printed 'review'. The plan item S03-selfCheck.Q7 says 'Guard order; the wording already fits a flat funnel.'

**Fix.** Change Q7's stem to show the absence branch first and the comparison as an `elif` of the same chain. The stem has no pin; the pin 'comparar None con < lanza TypeError' stays in the correct option, untouched. Rescope bank :792's stem the same way (`if edad < 18:` as the first branch, `elif edad is None:` after it), keeping correctIndex 0.

## [major] S03-youDo.starterCode (default selector) + requirements[4] + portfolioNote

**Problem.** The starter's default selector is CASO_S02, which the plan verified PASSES on the defective starter. Running the You Do as given therefore prints PASS despite five planted defects. The submitted file then prints the same PASS whether or not any defect was fixed. The 'reproducible demo whose asserts run' requirement and the portfolio's before/after evidence become vacuous for a reviewer running the file. Today the starter visibly fails.

**Evidence.** Plan youDo: 'Then `caso = CASO_S02` …' and 'Prediction key verified per case: S02 PASS; CERO monto assert; …'. Plan requirements[4]: 'Keep: every run executes the selected case's asserts.' Today's requirement at s03:2366: 'Demo reproducible al final del archivo; al ejecutarlo también corren los `assert`'. portfolioNote s03:2508: 'Cierra con una evidencia antes/después … respaldada por la prueba correspondiente'. I ran today's starter (s03:2371-2505) under .venv-content 3.12. It exits 1 with AssertionError at s03:2462 `assert r["monto_ingreso"]["status"] == "accept"  # cero válido`.

**Fix.** Set the default selector to a case that fails on the starter (CASO_CERO_VALIDO, the section's headline trap), so the first run is red. Require the README to record every case run with its predicted and observed outcome, since this replaces the lost one-command suite. Reword requirements[4] so it says the default run shows one case. If CASO_S02 passing on a defective engine is meant as a lesson ('one green case proves nothing'), say so explicitly in pass 4.

## [major] S03-youDo.starterCode (s03:2370-2506) + youDo.requirements[2]/[7], objectives[3], rubric 'Pruebas/ejemplos por rama'

**Problem.** The planned region funnel adds a branch, `not isinstance(region, str)` → reject BAD_TYPE, that none of the 8 shipped cases reaches. Neither of the 2 learner rows the plan requires (edad 120, edad True) reaches it either. O8 promises 'cubrir cada rama con un caso de prueba', and theory T4-B tells the learner this is the discipline of the You Do. requirements[2] demands that wrong types end in BAD_TYPE without TypeError, and the kept retrospective failure condition is 'un tipo incorrecto lanza TypeError'. Neither can be shown for region. A learner can omit the branch entirely and every case stays green. The plan still says the reworded objectives[3] and the rubric's 15% criterion are satisfied.

**Evidence.** Plan youDo.starterCode lists the region funnel 'None → MISSING, not str → BAD_TYPE, not in ALLOWED_REGIONS → review NOT_IN_ALLOWLIST, else OK' and 8 cases whose regions are Lima/Lima/Arequipa/Tacna/Lima/None/Piura/Cusco (the originals are at s03:2462-2489). Prototype youdo_cov.py, which implements the plan's three funnels and runs the 8 cases, printed "8 shipped cases, uncovered: ['region:BAD_TYPE']". With the learner rows edad 120 and True it printed "uncovered: ['region:BAD_TYPE']". region_mut.py printed '8 cases identical with branch omitted: True'. Without the branch, region 5 gives ('review','NOT_IN_ALLOWLIST'), and region ['Lima'] gives "TypeError: unhashable type: 'list'". s03:2364 reads 'los tipos incorrectos se rechazan sin lanzar TypeError'.

**Fix.** Add a ninth named case with a non-text region and an int for the other fields, e.g. a CASO_REGION_TIPO row (30, 51, 100) whose expectations are accept OK / reject BAD_TYPE / accept OK / registro reject. Add it to the prediction key (the starter's region DEFECT then fails that case's assert) and to requirement [7]'s coverage list. Alternatively, make one of the two learner-designed rows a region-type row. Update the test_you_do_oracle rescope pins to include the new tuple. Do not claim objectives[3] or the rubric criterion are met until every one of the 17 branches has a case.

## [major] S03-youDo.starterCode + context (s03:2350-2506)

**Problem.** Gradual release breaks at the youDo. It introduces five conventions that no theory block, demo or weDo item models: named CASO_* case constants; a three-level nested tuple (label, (inputs), (expectations)); two-step unpacking; expectations written as composite '<status> <code>' strings compared with built 'decision strings'; and composing a record status with the precedence reject > review > accept over several statuses. The only earlier selector (T2-B-E2) is a bare `monto = 20000`. S02 shows exactly one flat tuple, unpacked once.

**Evidence.** Plan youDo starter: 'Eight named case tuples (label, (edad, region, monto_ingreso), (esperado_edad, esperado_region, esperado_monto, esperado_registro)), each expectation a \'<status> <code>\' string', then '`caso = CASO_S02` and the two-step S02 unpacking', 'registro_status from `"reject" in estados`...', 'Decision strings, evidence prints, asserts'. S02's only tuple is s02:183-185: `resultado = (True, 19, None)` / `ok, edad, error = resultado`. A grep of s02-basics.ts for tuple assignments finds no other tuple and no nested tuple. Every earlier plan item unpacks flat, single-level tuples: `edad, esperado = (...)` (T4-B), `tipo, numero = (...)` (T3-A-E3), `apellido_paterno, apellido_materno, esperado = (...)` (T4-A-E2). No earlier plan item compares a composite status+code string or combines several statuses by precedence; T4-A-E2 combines two emptiness booleans, not statuses.

**Fix.** Model each youDo convention before the youDo. Introduce named case tuples plus the selector line in T4-B (the same change as the T4-B finding) and in at least one weDo item, e.g. T4-B-E3, whose (18/17/None/30, esperado) cases fit. Model composing statuses by precedence in one weDo item, e.g. extend T4-A-E2's two-field composition or T4-B-E2. Otherwise simplify the youDo: flat case tuples unpacked in one S02-style step, and separate esperado_<campo>_status and esperado_<campo>_code names instead of composite strings. State whichever trade-off you choose, such as a longer tuple or more names.

## [major] S03-youDo.starterCode + youDo.context (pass 4)

**Problem.** The independent stage introduces several mechanics that no I Do models and no We Do practises: named case constants holding nested tuples; two-step unpacking; a selector line; expectations written as '<status> <code>' strings; field-prefixed result names (edad_status/edad_code/edad_message …); and a record status composed by precedence through `in` over a tuple of statuses. The starter also plants a DEFECT on precedence order, a defect class never shown earlier. This breaks gradual release, and the D6 explicit-instruction sequence (model → guided → independent) for the youDo's central new technique.

**Evidence.** Plan youDo.starterCode: 'Eight named case tuples (label, (edad, region, monto_ingreso), (esperado_edad, esperado_region, esperado_monto, esperado_registro)), each expectation a '<status> <code>' string … `caso = CASO_S02` and the two-step S02 unpacking … registro_status from `"reject" in estados` … Starter DEFECTs: … plus review-before-reject precedence.' S02 teaches only a flat 3-tuple (s02:176-185, `ok, edad, error = resultado`). A grep of s02-basics.ts for '), (' returns no nested tuple. Every planned iDo/weDo opening line is a flat assignment or a flat tuple. The only selector item is T2-B-E2, with a scalar (`monto = 20000`). No iDo or weDo item composes two field statuses (T4-A-E2 composes two emptiness booleans).

**Fix.** Before the youDo, model a two-field status composition with reject > review precedence in one iDo demo (e.g. T3-A-DEMO or T4-B-DEMO) and practise it in one weDo item. T4-A-E2 already combines two fields and could compose two per-field statuses. Introduce the named-case selector with a flat tuple in a T4-B item (e.g. T4-B-E3), so the youDo reuses a practised form. If that cannot fit, remove the precedence DEFECT from the youDo starter and flatten the case constants to a single level.

## [major] S03-youDo.title+context, youDo.starterCode opening comment, youDo.portfolioNote, theory[0] callout

**Problem.** The plan removes every learner-facing statement that S03's You Do is an increment of the cumulative project, and it calls this S02's precedent. S02 dropped only the label: it kept the increment framing, and its contract test still pins what S02 owes the project. After the plan, S03 would be the only S01-S04 section that does not present itself as a step of the project. Meanwhile S01 promises the project spans S02-S04, three capstone artifacts list S03 as a contributing increment, and S04 builds on 'las reglas de S03'. The plan's own ask_first says 'whether S03 remains an increment' is the owner's call, but these deletions decide it now. Removing S03 from the project is Ask-first ('moving a project between sections', AGENTS.md).

**Evidence.** S02 keeps the framing at s02:2155 ('En este incremento del mismo proyecto trabajarás…') and in the starter at s02:2174 (`"""captura_cliente.py — incremento de S02`). The S02 test docstring, test_s02_independent_contract.py:51-57, reads 'S02's increment is the raw/clean/value walk … What S02 still owes the project is pinned here'. S01 promises the span at s01:1907 ('Prepara el esqueleto CP-N1-A para S02–S04') and s01:70 ('el proyecto acumulativo que cerrarás en S04'). Three artifacts list S03 as contributing: catalog.ts:59 `mk('CP-N1-A',…,'S04',['S01','S02','S03','S04'],…)`, capstone_validation/reality/section_capstone_mapping.json:25-32 (S03 has "artifactRole": "project_increment") and gate.json:62-66 (dependencies S01-S04). S04 builds on S03 at s04:1800 ('Sobre el parser de S02 y las reglas de S03'). The plan's youDo item says 'Title: drop «(incremento CP-N1-A)»… The closing sentence makes no CP-N1-A increment claim', and its starter item says 'no «incremento CP-N1-A»'. Neither item keeps an increment sentence.

**Fix.** Follow S02 exactly. Drop only the label 'CP-N1-A'. Keep a 'same project increment' sentence in the youDo context and 'incremento de S03' in the starter's opening comment. In portfolioNote, keep a reviewer at the S04 gate without naming the capstone. Add a pin to the S03 youDo test for what S03 hands the project: CASO_S02's values, the per-field three names and registro_status. Leave de-listing S03 to the owner, as the plan's ask_first already says.

## [major] SECTION

**Problem.** The plan never states S03's D5/D3 figure targets or its shortfall. It adds no figure and records no gap as work left undone, although D5 requires 'the shortfall is reported rather than padded'.
- For `if`, the load-bearing concept S03 owns (firstSectionId decisions-rules), the map shows 0/5 figures, which keeps it at L2 instead of D3's L3. The one S03 figure that illustrates if/elif/else (S03-tri-state in T2-A, whose heading names if/elif/else) counts toward no concept, because its caption and alt never name `if`, `elif` or `else`.
- That blind spot is missing from the plan's list of instrument blind spots.
- The other S03-taught concepts stay short: truthiness 0/1, return 1/5, parameter 1/5, set 2/5 and exception 3/5. T2-B, where exception is first defined and where the plan adds the reorder → TypeError experiment, has no figure.

**Evidence.** course-state/concept_map.json:
- if: load_bearing True, figure_target 5, figure_count 0, figure_gap 5, depth L2, headings ['decisions-rules.S03-T1-B.heading', 'decisions-rules.S03-T2-A.heading'], 436 examples.
- truthiness: target 1, count 0, gap 1.
- return 1/5, parameter 1/5, set 2/5, exception 3/5.
docs/concept-map/S03.md:20-24 and :31 show '0/5 ⚠' for if and '0/1 ⚠' for truthiness.
scripts/concept_map.py:16: 'L3  L2 plus its own subtopic heading and a figure (D3, for load-bearing concepts)'. Lines 153 and 183-185 compute depth and gap. Lines 139-141 credit figures by event mentions.
.fixer/events.json, event decisions-rules.S03-T2-A.figure: "mentions": []. Its text is only caption plus alt ('Cada puerta es una pregunta…').
glossary terms.ts:129-131: if aliases 'elif', 'else', 'if'.
The plan's only figure-count text is 'D5 figure count: T1-A has no other figure'.

**Fix.** Add a figure-targets row to the plan for each S03-taught concept (if, truthiness, set, exception, return, parameter). Each row says either which figure removes which prose work, or that no figure earns its place, stated as a shortfall.
At minimum:
- once S03-tri-state is redrawn for T2-A's chain, name `if`/`elif`/`else` in its caption or alt, which truthfully credits `if` (0/5 → 1/5 and L2 → L3);
- with S03-guard-order moved to T2-B, let its caption name the TypeError/excepción it demonstrates only if the figure actually shows it;
- record the truthiness 0/1 gap, or justify a presence-vs-truthiness table figure in theory[4]/[5].
Add the caption/alt-only attribution to the list of instrument blind spots.

## [major] SECTION (convention (c) and the rows for S03-T1-B-E3, T2-B-E1, T3-B-E1, T3-B-E3, T4-A-E1, T4-A-E2, T4-B-E2)

**Problem.** The rebuild will leave `return`, dicts, a dict method, loops and removed function names in learner-facing text of seven exercises, and no gate will see them. Convention (c) covers only title, description, preamble, hint, feedback, retrospective and header comment. It leaves out `instruction`, `tests` and `edgeCases`, and it bans only 'a function, loop or list', not dicts, dict methods or `return`. None of the seven item rows rewrites these fields. The concept map cannot see the words either, and the new S03 practice guard scans only Python code. So after the round the map reports S03 clean for dict and for while the learner still reads these instructions.

**Evidence.** Sites that survive the plan as written:
- s03:1168, T1-B-E3 instruction: '1. Sustituye `if not m: return "reject"`. … 5. Prueba el bucle dado'. The row only says 'm → monto throughout'. concept_map.json return.exercises[0] = 'decisions-rules.S03-T1-B-E3.instruction'.
- s03:1405, T2-B-E1 instruction: '3. Devuelve dicts `{status, code}` … 4. Prueba con `repr(e)` los cuatro valores del bucle.' The row only adds a reorder step.
- T3-B-E1: preamble s03:1788 'corregir el diccionario `TABLE` y aplicar `get`'; instruction s03:1791 'Implementa `status_for(code)` con `TABLE.get(code, "review")`'; feedback s03:1800 'El default (`get(..., "review")`)'. The row only removes «sin hardcodear ifs extra».
- s03:1907, T3-B-E3 instruction: 'Implementa `map_code` … Implementa `map_edad`'. The row changes only hints[1], the feedback and the preamble Éxito.
- T4-A-E1: instruction s03:1974 'Define `examples` como lista de dicts `{value, expected}`. 3. Recorre examples'; tests s03:1981 '4 examples present'.
- T4-A-E2: instruction s03:2040 'Reescribe `validate_apellidos` … compruébalos en un bucle'; tests s03:2047 'text + examples ejecutables'. The row pins this instruction but never rewrites it.
- s03:2226, T4-B-E2 instruction: 'Define `cases` como lista de `(score, expected)` … Por cada caso'.
Why the instruments miss them:
- terms.ts:447 gives dict only the alias ['Dict'], and terms.ts:77 gives for ['bucle for','bucles for','for'].
- course_event_extractor.mts:281 wraps every alias in letter lookarounds, so «dicts», «diccionario» and a bare «bucle» never match.
- Accordingly, concept_map.json lists S03 dict uses only in code plus T3-A-E3.hint[1], and S03 for uses only in code, hint[1] and tests, even though the lines above contain «dicts», «diccionario» and «bucle».
- The planned guard covers 'any python code of theory…, iDo, weDo starter/solution…'.

**Fix.** - Extend convention (c) to every learner-visible field: instruction, tests, edgeCases, hints, and the iDo `why`.
- Extend its ban list to `return`/`def`, dict/«dicts»/«diccionario»/«clave», `.get`, the `{status, code}` brace notation, and «bucle»/«Recorre».
- Add an explicit instruction/tests rewrite to each of the seven item rows listed above.
- Widen the new test_s03_independent_contract practice guard to scan those text fields with a word list: return, «bucle», dict, «diccionario», `.get(`, status_for, map_code, map_edad, validate_, examples, cases. It must fail today on s03:1168, 1405, 1788, 1791, 1800, 1907, 1974, 2040 and 2226.
- Align the guard's dict regex with concept_syntax.mts:46, which accepts both quote styles.

## [major] SECTION (derived consistency rule `not isinstance(edad, int) or isinstance(edad, bool)`)

**Problem.** The plan writes the bool exclusion into theory[7], T2-B-DEMO, T2-B-E1 (where the learner must write it), T4-A-E1, T4-A-E3, T4-B-DEMO and the youDo. Only theory[11] (the True block) runs a bool. In every other item, deleting the clause leaves the output unchanged. That is the 'survives deletion' defect the plan's own R3 refinement condemns for match alternatives. Learners are asked to write a clause whose effect they never observe, against the section's evidence-over-appearance rule. Today's theory T2-B does show it running.

**Evidence.** Plan T2-B-DEMO blocks: None / "25" / 200 / 15 / 30. Plan T2-B-E1 blocks: None / "25" / 15 / 30 / 130. Plan T4-A-E1: 30, -1, None, "x". Plan T4-B-DEMO: None / "x" / -5 / 35. Plan R3: 'For an OR arm, use a non-first alternative, because a first alternative survives deleting the `|`.' I ran scratchpad/ped9/boolclause.py. It printed 'theory[7] (None, 30): output identical with and without `or isinstance(edad, bool)` -> True', 'T2-B-DEMO …: … -> True', 'T2-B-E1 …: … -> True' and 'today theory T2-B (+True,False): … -> False'. Today's s03:308-309 prints 'True → … BAD_TYPE' and 'False → … BAD_TYPE'.

**Fix.** Apply R3 to `or` alternatives in if conditions as well as to `|` arms. Add a True block to T2-B-DEMO or theory[7], where the clause is introduced, and to T2-B-E1, where the learner writes it, so deleting the clause changes a printed line. In items with no bool case, either add one or cite the rule without claiming those cases exercise it.

## [major] SECTION (exam bank prisma/seed.ts:644-990) / assessments

**Problem.** In the S03 exam bank, the correct option is the longest of the four in 23 of 24 items, often 2 to 5 times longer than the others. Always picking the longest option passes every S03 attempt without any Python knowledge. The plan treats option length as a defect, but only fixes it in self-check Q2 and Q7; it keeps every bank item's options and correctIndex and never mentions the bank's length cues.

**Evidence.** I ran the repo's own parser (exam_selfcheck_pedagogy_audit.parse_seed_questions) on seed.ts lines 644-990 and compared option lengths. Result: 'correct strictly longest: 23 / 24'. Examples of correct-option length vs the longest distractor: item 21 (:955) [5, 8, 4, 42] → 5.25x; item 18 (:907) [23, 19, 83, 19] → 3.61x; item 11 (:806) [19, 54, 20, 16] → 2.7x; item 6 (:739) [42, 36, 109, 35] → 2.6x. The only exception is item 1 (:664, '1000 <= monto <= 2000'). The pass mark is 70 (src/lib/exam-scoring.ts:8: PASS_THRESHOLD = 70), and each attempt draws one question per concept, 8 in total (route.ts:172-206). So the longest-option strategy scores 7/8 or 8/8 on every attempt. The plan's assessments section only says 'Q2 and Q7: pad the distractors to remove the length cues'.

**Fix.** Add a bank-wide length-cue pass to the assessments section. For every item where the correct option is more than about 1.3x the longest distractor, rewrite the distractors so each one states a believable misconception at similar length and detail. Keep the correctIndex, the concept and the per-concept distinct positions. Add a check (in the new S03 assessment test) that the correct option is the strict longest in at most about 1/3 of items, and that it fails on today's 23/24.

## [major] SECTION (open_questions, last bullet: 'Downstream, not in scope … so nothing dangles'; and ask_first 'CP-N1-A placement')

**Problem.** The Level-1 capstone gate at S04 depends on what the learner has done by the end of S03, and the plan changes that without saying so. Today S03's practice has the learner write or repair per-field validation functions that return a dict. CP-N1-A's closing You Do at S04 is built on reusing exactly that. The plan removes every def, return and dict from S03 practice. Its own theory[3] and weDo.intro edits then tell the learner that functions arrive in S05. Yet the plan says 'nothing dangles', and its ask_first describes the round as only removing labels ('This round only drops S03's learner-facing «incremento CP-N1-A» claims'). After this round, the N1 gate asks the learner to 'reuse' an S03 function that S03 no longer has them write, and to implement three annotated functions they have never practised. That trade-off is absorbed, not stated.

**Evidence.** S04 is the CP-N1-A gate: catalog.ts:59 `mk('CP-N1-A',…,1,'S04',['S01','S02','S03','S04'],[],['S01','S02','S03'], … 'intake_cli.run(records) -> IntakeResult'` (level 1, gate S04, prerequisites S01-S03), rendered to learners at CapstonesPage.tsx:342-346. s04:1798 title "Client Intake & Data Quality Script (cierre CP-N1-A)". s04:1800 says "Sobre el parser de S02 y las reglas de S03 … implementa las tres funciones hasta ver `tests OK`". s04:1805 objective "Reutilizar validación tri-estado por campo (S03)". s04:1826-1830 starter: `def validate_record(record: dict[str, Any]) -> dict[str, Any]:` / "Reutiliza lógica tipo S03: status global + detalle por campo." / `# TODO: devolver {status, fields} con accept|reject|review por campo (S03)`. CP-N1-A/RUBRIC.json weights maintainability 0.25 on "Diseño limpio, modular, testeable". S03 today, counted with grep -o 'def [a-z_]*(': 9 defs in theory, 8 in iDo, 44 in weDo (s03:918-2348), 6 in youDo (s03:2350-2518). The plan keeps only theory[3]'s decidir_region. The plan's own youDo trade-off says 'reuse needs S05, and a single result object needs S06', and its theory[3] p4 change says S05 turns a rule into a function.

**Fix.** Move the S04 bullet out of 'Downstream, not in scope' and into ask_first under CP-N1-A placement, and delete 'nothing dangles'. State the trade-off in plain terms: until S04's route-2 round or CP-N1-A re-gating lands, the N1 gate at S04 asks for three def/dict functions and 'reuse' of S03 validation that S03 no longer practises. List s04:1798, 1800, 1805 and 1826-1853 as the affected sites. Alternatively, make landing S03 together with the S04 round (or the re-gating decision) an explicit sequencing precondition of this round.

## [major] ask_first (monto type: Decimal or int) + S03-youDo.starterCode CASO_S02

**Problem.** The monto-type ask-first offers two options, and each one breaks one edge of the project chain. With int, S02's handed-over money becomes BAD_TYPE, so CASO_S02 cannot carry S02's value and 'S02 PASS' only holds with a made-up monto. With Decimal, every monto_ingreso fixture in S04's You Do becomes BAD_TYPE → reject. That includes row 0's int 0, which is exactly S03's valid-zero lesson. The plan says only 'S04 must follow' and 'Both variants pass all 8 youDo cases'. It never gives CASO_S02's values, so the S02 continuity it claims is not guaranteed.

**Evidence.** S02 pins Decimal money as the handoff. s02:2197 has `monto = Decimal(monto_clean).quantize(...)`, s02:2211 has `assert monto == Decimal("150.50")`, and tests/adversarial/test_s02_independent_contract.py:63 pins it ('money is Decimal, built from text'). S04 fixtures use int values: s04:1855-1857 are `"monto_ingreso": 0`, `10` and `-1`, and the demo has 100 and 50. I ran the plan's youDo monto funnel under .venv-content 3.12 with each guard:
int     S02 monto Decimal('150.50') ('reject', 'BAD_TYPE') | S04 int fixtures ['OK', 'OK', 'OUT_OF_RANGE', 'OK', 'OK'] | True ('reject', 'BAD_TYPE')
decimal S02 monto Decimal('150.50') ('accept', 'OK') | S04 int fixtures ['BAD_TYPE', 'BAD_TYPE', 'BAD_TYPE', 'BAD_TYPE', 'BAD_TYPE'] | True ('reject', 'BAD_TYPE')
both    S02 monto Decimal('150.50') ('accept', 'OK') | S04 int fixtures ['OK', 'OK', 'OUT_OF_RANGE', 'OK', 'OK'] | True ('reject', 'BAD_TYPE')
In the plan, CASO_S02 is named but given no values ('Eight named case tuples … CASO_S02, …'; 'Prediction key … S02 PASS').

**Fix.** Add a third option to the ask-first that keeps both edges: `not (isinstance(monto_ingreso, int) or isinstance(monto_ingreso, Decimal)) or isinstance(monto_ingreso, bool)` → BAD_TYPE. It uses only S02's isinstance (s02:206) and S03's `or`, and it passes the verification above. For each option, say which edge it breaks. Fix CASO_S02's values as S02's pinned value column (edad 28, monto Decimal("150.50")), and state that region is new in S03. Pin that tuple in the rescoped youDo test as 'what S03 owes the project', the way test_s02_independent_contract pins S02's handoff.

## [major] ask_first: CP-N1-A placement

**Problem.** The ask-first lists three BRIEF problems: «estructuras de datos», amount=0 → warn, and «lista de registros (dicts)». It misses CP-N1-A claims that the plan itself moves later or contradicts. (a) The gate grades function-writing, which the plan removes from all of S03's practice and tells learners arrives in S05. (b) CP-N1-A's reference classify() teaches the opposite of S03's policy. It tests presence by truthiness, which S03 teaches as the defect. It accepts True as a valid amount, which the plan's consistency rule sends to BAD_TYPE. It classifies every Decimal, including S02's money and the plan's recommended valid zero Decimal("0.00"), as error. The capstone gated at S04, with S03 contributing, would therefore grade against S03.

**Evidence.** course-state/capstones/CP-N1-A/gate.json:45 has "focus": "Funciones pequeñas, reglas centralizadas, sin secretos." and gate.json:42 has maintainability level "2": "Módulos/funciones claros y legibles." (gate_rule: 'ningún criterio crítico < 2'). WEDO.md:5 reads '1) Escribir juntos la función classify().' catalog.ts:59-62 has the interface 'intake_cli.run(records) -> IntakeResult'. demo.py:24 has `if not row.get("id") or …` and demo.py:29 has `if not isinstance(amount, (int, float)):`. I ran demo.classify under .venv-content 3.12 with the other fields valid:
Decimal('150.50') -> error
Decimal('0.00') -> error
True -> ok
0 -> warn
None -> error

**Fix.** Extend the CP-N1-A ask-first item and cite each site: gate.json:42/45, WEDO.md:5 and the catalog interface as function claims that S03 no longer practises (and that route 2 moves to S05); demo.py:24 as truthiness-as-presence; demo.py:29 as bool accepted and Decimal rejected. Route each through D11 (primer → rewrite → move). Tie the plan's Decimal recommendation explicitly to demo.py:29, which rejects Decimal outright. Do not edit the capstone files this round.

## [major] exam bank :749 (if-elif-else variant 2)

**Problem.** The plan rescopes :749 into 'a top-level chain that assigns status'. The exam UI renders the stem as plain text in one <p>, so the chain has to stay on one line with semicolons, and that is invalid Python. Today's stem is also invalid. Because of that, the distractor 'Error de sintaxis en elif' is a defensible answer next to the keyed 'accept y review'. That breaks the bank's own one_best_answer rule, and the plan does not address it.

**Evidence.** seed.ts:749 'Con `def classify(score): if score >= 80: return "accept"; elif score >= 50: …`'; distractor :753 'Error de sintaxis en elif'; correctIndex 3. ExamView.tsx:291 renders `<p className="text-sm font-medium text-foreground">{q.question}</p>` as plain text, not a code block. I ran ast.parse under .venv-content 3.12.12 on the stem forms. It printed 'current_749 SyntaxError: invalid syntax' and 'planned_749_toplevel SyntaxError: invalid syntax' (for 'if score >= 80: status = "accept"; elif score >= 50: status = "review"; else: status = "reject"'). course-state/s03_phase5_exam_bank.json:22 has '"one_best_answer": true'.

**Fix.** Write the :749 chain in prose, naming each branch's condition and status in order, not as one-line code. Replace the 'Error de sintaxis en elif' distractor with a boundary misconception, for example 'accept y accept (50 cumple la primera condición)'. Keep correctIndex 3. Apply the same rule to any rescoped stem that shows a compound statement (:878's match/case).

## [major] exam bank :925, :926, :907, :944, :982

**Problem.** The bank grep in the plan still misses learner-facing sites of the same class it is removing. (1) :926 is the keyed correct answer, and it says business rules «deben devolver status/code/message». That is the function-return, one-result-object form that the plan removes everywhere else: theory[3] p4 now says S05 turns a rule into a function that returns it, and the T4-B-DEMO preamble's «devuelve `{status, code, message}`» becomes three names. (2) The plan removes S03's learner-facing CP-N1-A claims from 7 section sites, but the bank keeps them: stem :907 «usable en el gate», where S03 itself never uses the word 'gate' (grep: 0), and explanation :944 «el gate CP-N1-A». (3) The plan changes the dict distractor at :869, but distractors naming other untaught constructs stay: :925 'assert siempre lanza KeyError' (KeyError appears 0 times in S01-S03) and :982 'Silenciar el else con except: pass' (a try/except construct, D10).

**Evidence.** seed.ts:926 'python -O desactiva asserts; las reglas de negocio deben devolver status/code/message' (correctIndex 3 at :928). :930 explanation 'El motor de reglas expone status/code/message'. :907 '¿Qué falta para que sea usable en el gate?'. :944 'El camino feliz solo no basta para el gate CP-N1-A.' :925 'assert siempre lanza KeyError'. :982 'Silenciar el else con except: pass'. `grep -c KeyError` on s01/s02/s03 prints 0/0/0. `grep '\bgate\b'` on s03-decisions-rules.ts gives no match. I ran a regex (return|def|dict|devolver|validate_|for..in|KeyError|except|CP-N1-A|gate) over :644-990. It flags every planned site, plus MISSED sites at 925, 926, 944 (twice) and 982. The plan's list covers only 722, 723, 749, 772, 778, 782, 806, 869, 878, 907 (deferred) and 935.

**Fix.** Add these to the bank rescope, keeping each correctIndex. :926 becomes: python -O disables asserts, so a business rule must set its decision in names the program checks (status, code, message). :930 is aligned to match. Drop the gate wording from :907 separately from the 9-digit ask-first; the stem then asks what makes the invariant verifiable. Remove 'CP-N1-A' from :944. :925 and :982 get distractors built from S02/S03 misconceptions, for example 'assert only works with int', or silencing the else with a print.

## [major] learningOutcomes O4 + theory[0] p3 + theory[3] + theory[7] (T2-B)

**Problem.** After this plan, S03 defines «guarda» and «salida temprana» twice, in two incompatible ways. theory[0] and T2-B redefine them as the first branches of a flat if/elif chain. theory[3] sits between those two blocks and keeps, word for word, the early-return guard code and the sentence that a guard returns immediately. The plan's reason for dropping «guard clauses» from O4 is that the early return 'S03 no longer shows', which is false for its own end state. theory[3]'s new p4 sentence also contradicts the code directly above it, and its bridge sentence points to case blocks the learner has not yet met.

**Evidence.** Plan O4: 'Drop «guard clauses» as the named technique: its canonical form is the early return, which S03 no longer shows.' Plan theory[3]: 'Keep verbatim: p0-p3's defining sentences, the code (decidir_region.py...)'. That code is the canonical guard clause, s03:134-139: `if region is None:\n        return "review"\n    if region not in ALLOWED:\n        return "reject"\n    return "accept"`. s03:125, kept unless the optional narrowing is taken: «por eso una guarda puede devolver `review` o `reject` de inmediato». Plan theory[0] p3 redefines «salida temprana» as 'the first branch or branches of an if/elif chain'. Plan theory[7]: 'p1: a guard is the first branches of the chain.' The plan's replacement for theory[3] p4 ('S03 keeps each decision in a name at top level, and S05 turns a rule into a function that returns it') sits directly under decidir_region.py, which is already a rule turned into a function that returns it (s03:131-151). The bridge sentence ('the repeated case blocks in this section are what a function names in S05') appears at theory[3], but the plan's first case block is theory[5].

**Fix.** Make the narrowing of s03:125 mandatory, to «dentro de una función», rather than optional. Add one sentence in theory[3] naming the two forms: inside a function, a guard ends the body with return; in S03's top-level code, the same role is played by the first branches of the chain. Correct the plan's O4 rationale to 'S03 practises guards as ordered chain branches; the early-return form appears only in theory[3]'s held definition'. Replace the theory[3] p4 sentence with one that does not deny what the block just did, for example: in the rest of S03 you write rules without def, so each decision stays in a name; S05 studies functions in depth. Move the case-block bridge sentence to weDo.intro only, where blocks have already been seen.

## [major] open_questions: 'Downstream, not in scope: s04:103 and S04's youDo define and call their own validate_record (s04:1826), so nothing dangles'

**Problem.** This is false. S04 does not define a validate_record the learner can call. It ships a stub whose body the learner must write by reusing S03's logic, shaped as a function that returns a per-field dict. After the plan, S03 practises neither functions nor dict results. The plan's own theory[3] p4 now tells learners that S05 turns a rule into a function. So S04's You Do asks for an S03-shaped artifact that S03 no longer teaches. S04 also consumes dicts that carry raw_line, while the plan's S03 case table is positional tuples with no raw field. The S03→S04 handoff breaks in form, and nothing records it.

**Evidence.** s04:1826-1831:
`def validate_record(record: dict[str, Any]) -> dict[str, Any]:`
`    """Reutiliza lógica tipo S03: status global + detalle por campo.`
`    # TODO: devolver {status, fields} con accept|reject|review por campo (S03)`
`    raise NotImplementedError`
s04:1805 objective: 'Reutilizar validación tri-estado por campo (S03)'. s04:1855 fixture: `{"edad": 30, "region": "Lima", "monto_ingreso": 0, "raw_line": "30|Lima|0"}`. The plan's theory[3] item says: 'S03 keeps each decision in a name at top level, and S05 turns a rule into a function that returns it.' The plan's youDo case table is 'Eight named case tuples (label, (edad, region, monto_ingreso), (…expectations))'.

**Fix.** Replace 'nothing dangles' with an explicit WORK_QUEUE item that is Ask-first because it restructures S04's practice layer. S04's route-2 round must rescope s04:1797-1880 to consume S03's handoff: iterate the S03 case table, read edad_/region_/monto_ingreso_ status/code/message and registro_status, and stop asking for a `{status, fields}` dict or a def before S05/S06. Also write the handoff shape into the S03 youDo so S04 can quote it.

## [major] satellite: figure S03-guard-order (figures/data/misc.ts:446, attached at s03:69 in theory T1-A)

**Problem.** The planned branch data matches no decision chain in the section, and one of its rules cannot be carried out. The plan fixes the rows as absent → review, out of range → reject, not in list → review, rest → accept, so the range row comes before the list row. Theory T3-A and T3-A-DEMO are the only S03 chains with both a range and a list, and both check the list first. The plan itself relies on that order: its T3-A prediction is 'R-FUERA 15 (still NOT_IN_ALLOWLIST, because the allowlist branch runs first)'. The plan's other rule, 'Order the branches like the chain of the block the figure sits beside', cannot be applied at the current placement: T1-A's code (comparaciones_intake.py) only prints booleans and has no chain. Placement is also left open. The rows also carry status only, while convention (b) pairs every status with a code.

**Evidence.** s03:343-351 (T3-A): `if region is None or edad is None: return "review"` / `if region not in ALLOWED_REG: return "review"` / `if not (18 <= edad <= 65): return "reject"`. The demo at s03:711-718 uses the same order. The T1-A code at s03:92-101 has no `if`.
Ran on .venv-content 3.12, applying the plan's figure rows in the plan's order next to the plan's T3-A chain. It printed:
`figure  R-FUERA 15 -> reject`
`T3-A    R-FUERA 15 -> review NOT_IN_ALLOWLIST`

**Fix.** Decide the placement this round (see the next finding) and copy the rows from the chain beside the figure.
- At T2-B, use the plan's T2-B funnel: None → review MISSING; not int or bool → reject BAD_TYPE; <0 or >120 → reject OUT_OF_RANGE; <18 → review NEEDS_REVIEW; else → accept OK. There is no list row.
- At T3-A, use T3-A's order: absent → review MISSING; not in allowlist → review NOT_IN_ALLOWLIST; out of range → reject OUT_OF_RANGE; else → accept OK.
In both cases, put 'status CODE' in `result` so the figure follows convention (b).

## [major] satellite: figure S03-guard-order note and caption (misc.ts:456, s03:70-71)

**Problem.** The plan says it 'preserves … the note about reordering'. That note claims that moving the last guard to the front changes the classification of all records, not just some. The claim is false under today's data and under the plan's fixed data, whichever branch 'la última guarda' refers to. The sentence also appears twice on screen: the decision archetype draws `note` inside the SVG, and FigureFrame prints the identical `caption` below it.

**Evidence.** misc.ts:456: note: 'Mover la última guarda al principio cambia la clasificación de todos los registros, no de algunos.' The caption at s03:70-71 repeats the same sentence.
DecisionFigure.tsx:18 and :124-125 render `data.note`. Figure.tsx:108-110 renders `figure.caption`.
Ran on .venv-content 3.12 over 9 record classes (region R-NORTE/R-FUERA/None × edad 30/15/None). It printed:
`fixed-data | last guard (list) first | changed 1 of 9`
`fixed-data | catch-all first | changed 8 of 9` (R-NORTE 30 stays accept)
`today-data | last guard (list) first | changed 4 of 9`

**Fix.** Do not preserve the note. Once the rows match their chain, replace the claim with one that the new rows make true and that can be checked by running code.
For example, at T2-B: moving the `< 18` row first makes None stop with TypeError. That is the plan's own reorder experiment, and the figure would then show the same thing theory[7].p5 asks the learner to run.
Make the caption and the note say different things, or drop `note`, so the sentence is not rendered twice.

## [major] tests_to_rescope (NEW S03 practice guard)

**Problem.** The plan adds a mechanical guard for the class, but only over code (theory, iDo, weDo, youDo starter, playground). The self-check and the exam bank carry the same class of leak: def, return, dict and validate_* in stems and options. The plan itself says the planning output missed 6 bank sites, and the finding above shows a hand grep still misses 5 more. Nothing fails today on the bank's `def classify` or 'devolver status/code/message', so a later round can bring them back unnoticed. This is the repeat-issue pattern the repo says to fix with a guard, not by instance.

**Evidence.** Plan NEW guard: 'No `def `, `return`, `for … in`, dict literal …, `.get(` or annotation (`->`) may appear in any python code of theory …, iDo, weDo starter/solution, the youDo starter or the 'decisions-rules' playground.' The bank and selfCheck are not in scope. Plan assessments: 'Grep of the bank also found sites the planning output missed: :722 … :778'. My regex run over seed.ts:644-990 still reports 'MISSED' at 925, 926, 944 and 982 (see previous finding). Existing bank tests (test_s03_text_first_contract.py:157-183, test_s03_independent_contract.py:147-173) check only counts, uniqueness, word floors and positions.

**Fix.** Extend the NEW guard, or add a sibling test, to cover the learner-visible text of the S03 bank (question and options between '  // S03 V3' and '  // S04 V3') and of selfCheck. It rejects `def`, `return`, `dict`, `validate_\w+`, `for x in`, `KeyError`, `except` and `CP-N1-A`, with theory[3]'s held definition exempt only in theory. It must fail on today's bank at :749, :806, :878, :926 and :935 before the rescope commit.

## [major] theory[10] S03-T4-A (len gloss) / S03-T3-A-E3

**Problem.** len() becomes a course-first definition in S03, and T3-A-E3 cannot be solved without it (the per-type length rows). S04 then uses it at least 9 times without defining it. By D3's test it is load-bearing, yet the plan gives it a one-sentence gloss. The rebuilt T4-A code uses len only inside a condition and never prints a len value, so there is no worked example with real values (D6) and no check. It also sits in T4-A theory, while the T3-A exercise that needs it comes first by subtopic.

**Evidence.** Plan theory[10]: 'Gloss len(), .isascii() and .isdecimal() in one sentence each … These become course-first definitions.' Plan T3-A-E3: 'tipo == "CLI" and len == LARGO_CLI → OK'. grep 'len(' in s02-basics.ts and s01-setup.ts: 0 hits. S04 uses len at s04:103, 126, 135, 176, 210, 385, 402, 437 and 463, with no definition. D3 (decisions.md:36-53): 'if the learner misunderstands this, does a later exercise in this section become unsolvable? If yes, it needs a subsection.'

**Fix.** Give len a worked example with printed values (e.g. print repr(x), len(x) and len(x.strip()) for a padded code) plus a prediction check. Place it where T3-A-E3 can rely on it: a supporting theory block without a subtopicId next to T3-A (D6), or T3-A theory itself. .isascii()/.isdecimal() are used only in T4-A theory and T4-A-DEMO and may stay glosses.

## [major] theory[10] S03-T4-A (s03:412-468) and S03-T4-A-DEMO (s03:806-850)

**Problem.** The plan splits today's single digit-or-length branch into two branches: `not (isascii and isdecimal)` → reject, then `len != 9` → reject. It keeps only the four current cases. No case reaches the new digit branch, so the block that teaches O7 and O8 (s03:418, 'prueba al menos una vez cada rama distinta… Varias ramas pueden terminar con el mismo status y aun así necesitar casos propios') now shows a chain with an untested branch right below that sentence. This is a regression: today's shape covers 4 of 4 branches, and the planned one covers 4 of 5. The plan's 'preserves' column claims 'a checked expectation for every branch', which is false. Neither of the plan's two candidate fifth examples for the DEMO retrospective reaches the branch either.

**Evidence.** Today's code at s03:432 and s03:822 is `if not digits.isdigit() or len(digits) != 9:` (one branch, reached by '12345'). The plan's funnel is '…not (strip().isascii() and strip().isdecimal()) → reject; len(strip()) != 9 → reject'. t4a_cov.py printed "branch never reached: ['B3 no-digitos->reject']" and 'mutant (digit branch deleted) same on 4 cases: True'. It also printed "mutant on 'abcdefghi': accept | plan chain: reject". For the candidates it printed "candidate 999000111 -> B2 no-str/blank->reject" and "candidate ' 999000111 ' -> B5 accept".

**Fix.** Keep today's shape: one branch `not (s.isascii() and s.isdecimal()) or len(s) != 9` → reject. Verified in rest.py: the four cases print the same four results, byte-identical to the pin, and the branch still rejects '١٢٣٤٥٦٧٨٩', '９９９０００１１１' and 'abcdefghi'. This keeps 4 of 4 branches covered and satisfies L1Q3-2. If the split is wanted for teaching, add a fifth block ('abcdefghi' or the p5 counterexample, esperado reject) to both theory[10] and T4-A-DEMO and accept one more output line. Either way, correct the 'every branch' claim.

## [major] theory[11] S03-T4-B (s03:469-540) and S03-T4-B-DEMO (s03:851-914)

**Problem.** O8's red-test cycle depends on which copy the learner edits. Case blocks hold one copy of the rule per block, and an assert only protects the copy in its own block. A learner doing the experiment the prose names ('Predice la prueba roja', retargeted to `edad <= 0`) edits the first match, which is the None block, and everything stays green. The plan nonetheless claims 'Both mutants go red' for theory T4-B and says the DEMO pin's challenge is 'now provable'. It states the one-test-per-copy trade-off only at T4-B-E2. p0's kept promise, 'una prueba que impide que esa explicación se vuelva falsa tras un cambio', is not delivered in this form unless the change is made in every copy.

**Evidence.** s03:478 reads '**Predice la prueba roja.** … ¿qué assert revela el error…'. p0 is at s03:473. The plan's theory[11] row says 'Both mutants go red: dropping `or isinstance(edad, bool)` fails at True, and `edad <= 0` fails at 0'. Its T4-B-DEMO row says 'dropping `edad < 0` turns the -5 assert red (verified)'. build_t4b.py (plan's 4 blocks) printed: '`edad <= 0` in FIRST copy only … exit=0 passes=4 (no error)'; '`edad <= 0` in ALL copies exit=1 passes=3 AssertionError'; 'drop bool exclusion in FIRST copy only exit=0 passes=4'; 'drop bool exclusion in ALL copies exit=1 passes=1 AssertionError'. demo_copy.py printed 'T4-B-DEMO drop `edad < 0 or` in first copy exit=0 passes=4' and '… in the -5 copy exit=1 passes=2 AssertionError'.

**Fix.** In theory T4-B, at p2 or p5 where O8 is taught, state once that each block carries its own copy of the rule, so its assert protects only that copy. The red-test experiment must change the condition in every block (replace-all), and the prose quotes only the final AssertionError line. Name S05's function as what lets one suite protect one rule. Use the same wording in T4-B-DEMO's why or retrospective. Qualify the plan's claims to 'red when applied to every copy (first-copy-only stays green, verified)', and move the T4-B-E2 trade-off statement up to the theory so the section says it where O8 is introduced.

## [major] theory[11] S03-T4-B + S03-T4-B-DEMO + S03-T4-B-E2 + theory[0] p6 (s03:46) vs S03-youDo

**Problem.** The arc's closing promise is a test that stops the rule from being changed by accident. That promise only holds when there is one rule. Under R1, the subtopic that teaches tests (T4-B) copies the chain into every block, so each assert guards only the copy above it: a defect written into 3 of the 4 copies stays fully green. The plan admits this only for T4-B-E2, yet claims 'both mutants go red' in the theory and the demo. The youDo then uses the opposite model: one chain, and a selector line that picks the case. The section teaches testing with one structure and grades it with another.

**Evidence.** Ran on .venv-content 3.12 a prototype of the plan's theory[11]: blocks None/True/-5/0, tuple rows, `assert code == esperado`, with the plan's retargeted red test `edad <= 0 or edad > 120`. Output: 'mutant in NO copy: exit=0; stdout=[PASS None MISSING, PASS True BAD_TYPE, PASS -5 OUT_OF_RANGE, PASS 0 OK]'; 'mutant in None/True/-5 copies (3 of 4): exit=0; stdout=[... all 4 PASS]'; 'mutant in the 0 copy only: exit=1; ... last_err=AssertionError'. The same rule written once, with the selector form: 'edad <= 0 or edad > 120 -> [CASO_AUSENTE:PASS, CASO_BOOL:PASS, CASO_NEGATIVO:PASS, CASO_CERO:AssertionError]'. Plan theory[11]: 'Both mutants go red: dropping `or isinstance(edad, bool)` fails at True, and `edad <= 0` fails at 0.' Plan T4-B-DEMO: 'dropping `edad < 0` turns the -5 assert red (verified)'. Plan T4-B-E2: 'a `>`-for-`>=` edit in one copy stays green, because the suite checks five copies.' s03:46, kept verbatim: «exhibir una prueba que impida cambiarla por accidente». Plan youDo retrospective: '`<` → `<=` at the adult boundary turns FRONTERA_DENTRO red' (true there only because the youDo has one chain).

**Fix.** Use one model for 'a test protects a rule' in T4-B and in the youDo. Preferred: T4-B theory, T4-B-DEMO and T4-B-E3 (four cases that fit named tuples) use the youDo's selector form. The chain is written once, the cases are named tuples with esperado, and `caso = ...` picks one. State the cost once: one case per run, so the declared output shows the selected case, and the other cases are named runs. If the blocks stay, T4-B theory must say plainly that each assert protects only the copy it sits under. Then retarget s03:46 p6, the T4-B-DEMO pin claim and theory[11]'s 'both mutants go red' to 'the copy in that block', and extend the T4-B-E2 trade-off sentence to the whole of T4-B.

## [major] theory[2] S03-T1-A (s03:66-111) / open_questions[0]

**Problem.** The plan leaves S03-guard-order in T1-A, where no prose explains it. The prose it does explain is T2-B, which has no figure. Its only reason for leaving it is 'T1-A would lose its only figure (D5 count)'. That misreads D5: the target is per concept, not per subtopic. The concept map credits this figure to no concept, so moving it changes no figure_count. The figure is also the first place the learner meets the word «guarda». It sits between T1-A's comparison prose and its code, before any chain or guard has been taught.

**Evidence.** SectionView.tsx:426-430 renders the figure between the block's paragraphs and its code ('Spatial contiguity: the figure sits between the prose it explains').
T1-A's paragraphs (s03:76-82) never mention guards. `grep -n -i guarda` over the section returns s03:71 and 73 (this figure's caption and alt) as the first hits, before theory[3] (s03:125) and T2-B.p0.
T2-B.p2 (s03:287) is the figure's content: 'Orden típico en validadores: 1) ausencia → 2) tipo → 3) rango/allowlist → 4) accept'. T2-B.p4 (s03:289) is '**Modelo mental de embudo.**'. T2-B has no `figure:` key (grep lines 282-283).
D5 (decisions.md:92-94): 'every concept carries 5–10 visuals … not one figure per section'.
.fixer/events.json, event decisions-rules.S03-T1-A.figure: "mentions": [].
concept_map.py:139-141 credits a figure to a concept only through the event's mentions.

**Fix.** Resolve open_questions[0] in the plan: move S03-guard-order to theory[7] (T2-B), with rows copied from T2-B's funnel. Record that D5 counts are unchanged, because the figure is credited to no concept.
If T1-A should keep a visual, it must remove work the prose now does badly. One candidate is a `set`-archetype figure of membership against a set of literals, including the case trap the plan adds (`"r-sur" in {"R-SUR"}` → False). It would count toward `set` (2/5 today). If nothing earns a figure there, leave T1-A without one and say so.

## [major] theory[3] (def/call/return held definition) + weDo.intro + convention cost statement

**Problem.** The plan keeps theory[3]'s opening promise that naming a rule lets you apply it to many values without rewriting its branches, and its four-call demonstration. It then imposes R1, the byte-identical chain copied into every block, on all S03 practice. It justifies the repetition as 'the honest cost that S04's loop and S05's def remove'. From the learner's side that statement is false: they were taught def, parameters, calls and return a few blocks earlier in S03. So the section teaches the cure in theory and forbids it in practice. The only explanation the learner gets points to a future section for a tool they already hold (D14.1: 'no "you will see this later" substituting for making the work legible now'). A learner who applies theory[3] in a weDo item writes cleaner code than the reference solution.

**Evidence.** s03:122 (theory[3] p0, which the plan leaves unchanged): 'Darle un nombre permite aplicarla a muchos valores sin reescribir sus comparaciones y sus ramas.' s03:142-145 are the four calls of decidir_region. Plan convention: 'R1. Only the opening line differs between blocks' and 'The repetition is the honest cost that S04's loop and S05's def remove.' Plan weDo.intro: 'Add that the repetition is what S04's loop and S05's functions will remove.' Plan theory[3] p4: 'S03 keeps each decision in a name at top level, and S05 turns a rule into a function that returns it.' The theory[3] move is parked in ask_first, but the cost sentence is planned for this round regardless.

**Fix.** Make the theory[3] placement decision (ask_first option b, move to S05) a precondition of this rebuild, because the convention's stated cost depends on it. If theory[3] stays, rewrite the weDo.intro and theory[3] p4 sentences to give the true reason S03 practice repeats the chain: S03 practises tracing each case's path through one chain, and designing a function's parameters and return contract is S05's subject. Do not say S05's functions 'remove' a repetition the learner already knows how to remove. Scope p0's 'sin reescribir' claim to that later work.

## [major] theory[3] Una regla con nombre: def, llamada y return (s03:112-164) — HELD DEFINITION

**Problem.** The plan keeps S03-call-return verbatim and edits only the code comment at flows.ts:53. Two problems remain in the learner-visible figure data.
(a) The outcome still says a guard returns `review` on its first line. That is the early-return definition of guard, which the plan retires in theory[0].p3 and theory[7].p1. The plan narrows the same clause in p3 ('dentro de una función'), but only optionally, and not in the figure.
(b) The figure's single call, R-NORTE, returns on the last line of the body. Its boundary 'lo que queda en el cuerpo ya no se ejecuta' therefore marks nothing skipped, and the stage just after the boundary ('quien llamó') is one that does run. By flows.ts:55-56's own reasoning, showing that the rest of the body never runs is the figure's only job.

**Evidence.** flows.ts:61-68:
`{ label: 'llamada', sub: 'con «R-NORTE»' } … { label: 'return', sub: 'entrega accept' }, { label: 'quien llamó', sub: 'recibe accept' }`, `boundaryAfter: 2`
`outcome: 'Por eso una guarda puede devolver `review` en la primera línea: el resto del cuerpo no llega a correr.'`
FlowFigure.tsx:107-134 draws the boundary after stage 2 and shows the outcome at the last step.
Traced decidir_region (s03:134-140) on 3.12 with sys.settrace. It printed:
`'R-NORTE' body lines executed (offset from def): [1, 3, 5] of body lines 1..5` (the return is the last line, so nothing is skipped)
`None body lines executed (offset from def): [1, 2]` (lines 3-5 skipped)

**Fix.** Add a satellite item for the flows.ts S03-call-return data, not only its comment.
- Draw the None call: llamada con None → cuerpo region = None → return entrega review, with the boundary after it → quien llamó recibe review.
- Limit the outcome to a function, e.g. inside a function a first `if` that returns ends the body. It must no longer define a guard.
- Update the alt at s03:118-119 to the None path, keeping the caption's held terms 'parámetro' and 'return' so apply_patches' held-definition check passes.

## [major] theory[6] S03-T2-A (s03:234-280)

**Problem.** The plan keeps S03-tri-state beside T2-A, saying 'The figure S03-tri-state draws all three exits', and does not list its component as a satellite. The figure draws a guard funnel over monto records, not T2-A's score chain.
- Its doors run review, reject, accept; T2-A's chain runs accept (>=80), review (>=50), else reject.
- Its records are monto ausente, -5 and 120; T2-A's example is score 80.
- Its last door is a question ('¿valor permitido?' → accept) with no exit for 'no'. That is a chain without `else`, the shape the plan's R2 forbids ('Every chain ends in else'), and it contradicts R6 ('happy path in the final else').
- It cannot show T2-A's claim that the strictest threshold goes first.

**Evidence.** S03TriState.tsx:24-36:
`{ name: 'monto ausente', stops: 0, out: 'review' }, { name: 'monto = -5', … 'reject' }, { name: 'monto = 120', … 'accept' }`
`doors = [{ q: '¿falta el campo?', out: 'review' }, { q: '¿fuera de rango?', out: 'reject' }, { q: '¿valor permitido?', out: 'accept' }]`
T2-A code at s03:257-263: `if score >= 80: … accept / elif score >= 50: … review / else: … reject`.
Ran the figure's three doors as the plan's top-level case blocks (monto 120, then 5000; permitted means <= 1000) on 3.12. It printed `120 -> accept` then `5000 -> accept`: the stale status leaks, which is exactly the failure the plan cites under R2.

**Fix.** Add S03TriState.tsx as a satellite item and redraw it for T2-A's chain.
- Doors '¿score >= 80?' → accept and '¿score >= 50?' → review.
- A final unconditional `else` exit → reject.
- Records on both sides of a boundary, e.g. 80, 79 and 49, to match the plan's predictions.
If the owner prefers the funnel drawing, move it to T1-B or T2-B, match that chain's rows, and add an explicit `else` exit.
Either way, update its caption and alt at s03:237-241 to match.

## [major] theory[6] S03-T2-A, theory[7] S03-T2-B, theory[8] S03-T3-A

**Problem.** Three theory blocks that teach load-bearing branching concepts lose runs they have today. theory[6], the course's canonical if/elif/else block, goes from 5 runs covering all three branches and both boundaries to 1 run. theory[7], the funnel, goes from 7 runs covering all 5 exits (including True/False → BAD_TYPE) to 2 runs (None, 30). theory[8] goes from 4 runs covering all 4 exits to 2. The convention exempts only theory[4] and theory[6], so [7] and [8] break R3 without an exception. theory[6]'s exemption is unjustified, and its 'preserves' line claims 'inclusive boundaries', yet the 50 boundary never runs. T4-B-E3 (no reject case) and T4-A-E3 (3 cases for 6 branches) are further unlisted R3 exceptions. None of these cuts is stated as a D14 trade-off.

**Evidence.** Today theory[6] (s03:263-272) prints 95/60/30/80/50 → accept/review/reject/accept/review. Plan: 'Single-path exception: score = 80 …'. Today theory[7] (s03:306-319) prints None, '25', True, False, -1, 15 and 30 through all 5 exits. Plan: 'Case blocks for edad = None and edad = 30 through the funnel … Predictions: '25', True, -1, 15.' Today theory[8] (s03:353-360) prints R-NORTE 30 accept, R-FUERA 30 review, R-COSTA 15 reject, None 40 review. Plan: 'Blocks `region, edad = ("R-FUERA", 30)` and `("R-COSTA", 15)`.' Plan convention: 'R3. … one case per branch of the chain the item teaches' and 'Single-path theory: theory[4] and theory[6].'

**Fix.** theory[6]: run the exclusive chain for 80/50/49 (or 80/79/50/49), and add one 95 block that shows status_bad overwriting. theory[7]: add at least True and one out-of-range block; this is the only place in T2-B where the bool exclusion could run. theory[8]: restore the accept and None blocks. If a line budget truly forbids this, record each cut as a D14 trade-off, add these items to the convention's exception list with a reason, and name in the prose which demo carries the missing exits.

## [major] theory[8] S03-T3-A vs S03-youDo registro_status

**Problem.** The section models two incompatible ways to combine a record's field failures and never contrasts them. theory[8]'s single combined chain reports only the first failing cause (allowlist first), and the plan adds a prediction that presents this as correct. The youDo then requires per-field decisions with reject > review precedence. The same record comes out review in T3-A and reject in the youDo. The planned prediction also contradicts T3-A's kept p4, which says distinct codes let you review the catalog without hiding a range error. The combined chain hides exactly that error.

**Evidence.** Plan theory[8]: 'Predictions: … R-FUERA 15 (still NOT_IN_ALLOWLIST, because the allowlist branch runs first).' Kept anchor p4, s03:336: 'conservar códigos distintos permite revisar el catálogo sin ocultar un error de rango.' Plan youDo: 'registro_status applies the precedence reject > review > accept.' I ran scratchpad/ped9/t3a_vs_youdo.py. It printed 'T3-A chain  R-FUERA 15 → review NOT_IN_ALLOWLIST' (15 is outside 18–65, and OUT_OF_RANGE is hidden), 'T3-A chain  R-FUERA 200 → review NOT_IN_ALLOWLIST' and 'youDo rule  R-FUERA 200 → registro reject'.

**Fix.** Recast the R-FUERA 15 prediction in theory[8] as the limit of a single combined chain: it can carry only the first cause, and here it hides a range violation, which is why p4 keeps codes per cause. Add one sentence bridging to the youDo: decide each field separately, then combine with an explicit precedence. Model that combination in an iDo or weDo item before the youDo (see the next finding).

## [minor] Convention (c) NAMES + theory[8] p1-p2 (s03:333-334) + youDo constants

**Problem.** The naming convention freezes three spellings for the one region allowlist and leaves a fourth in prose. It breaks continuity with S02's constants for the same edad bounds, and it mixes English ALLOWED_* names with Spanish new constants, against S02's all-Spanish precedent. Inside theory[8], the prose names the allowlist differently from the code in the same block.

**Evidence.** S02: `EDAD_MINIMA = 18` (s02:276, s02:627) and `EDAD_MAXIMA = 120` (s02:1214). The plan's youDo: 'EDAD_MAXIMA = 120, EDAD_ADULTA = 18': the maximum's name continues, the minimum's does not. s03:334, untouched by the plan: «`MIN_EDAD <= edad <= MAX_EDAD`», a third naming of the same bounds. s03:333, prose: «`ALLOWED_REGIONES = {"R-NORTE", "R-SUR", ...}`»; s03:342, same block, code: `ALLOWED_REG = {...}`. Plan (c): 'Keep ALLOWED, ALLOWED_REG and ALLOWED_REGIONS', and T3-A-E3 adds ALLOWED_ID. grep counts in s03: ALLOWED_REG 4, ALLOWED_REGIONS 2, ALLOWED_REGIONES 1.

**Fix.** Use S02's EDAD_MINIMA for 18 in the youDo, or state why 'adulta' is a different rule. Rewrite s03:334 with the names the code uses (EDAD_MINIMA/EDAD_MAXIMA or literals). Give every region-allowlist site one constant name, and make s03:333's prose match its own block's code. If ALLOWED_REGIONS must stay for the youDo test pin, use it everywhere, and record the English/Spanish mix as a stated exception in (c).

## [minor] Convention R4 vs the items (T4-A theory/DEMO/E1/E2, T2-A-E2, T2-B-E2, T3-B-DEMO)

**Problem.** R4 is stated as a universal evidence-line rule (input → result), but several planned items print without the arrow. The 'does it match the expectation' column also has four spellings: `ok=`, `same=`, a bare True/False and PASS. T4-A alone uses three formats for the same evidence (value → got → matches expected), so the learner meets a different layout at each step of one subtopic.

**Evidence.** Plan R4: 'The evidence line prints the input and the result names, separated by `→`.' Plan theory[10] and T4-A-DEMO: 'Print repr(contacto), →, status, ok=, status == esperado' ('999000111' → accept ok= True). Plan T4-A-E1: 'print(repr(edad), status, status == esperado)': no arrow, no label, output like '30 accept True'. Plan T4-A-E2: 'Print repr of both names, →, status, status == esperado': arrow, but a bare bool. Plan T2-B-E2: `print(repr(monto), status_nested, status_guards, 'ok=', ...)`; T3-B-DEMO: `print(code, status_if, status_match, 'same=', ...)`; T2-A-E2: `print(score, 'bad=', status_bad, 'good=', status_good)`. None of these print the arrow.

**Fix.** Either make R4 true or narrow it. Make one label for the check column (ok=), applied in T4-A-E1 and T4-A-E2, plus the arrow in T4-A-E1. Then T4-A reads theory → demo → E1 → E2 in one layout. List `same=` (an equivalence of two implementations), the bad=/good= pair and PASS (the T4-B assert form) as named R4 exceptions, each with its reason.

## [minor] S03-T4-A-E2 (s03:2032-2097)

**Problem.** Two parts of this row send the learner into an `AttributeError`, an error class the course has never named: the planned swap experiment, and the open question's option to drop `isinstance` and record the integer case as debt in the printed invariant. Every other error the plan uses has an S02 precedent (TypeError, ValueError, NameError, AssertionError).

**Evidence.** - Plan T4-A-E2 preserves: '(swapping raises AttributeError; or-first makes reject dead; both verified)'.
- Open question: 'an int raises AttributeError, recorded as debt in the invariant'.
- Grep counts: AttributeError S01=0, S02=0, S03=0. TypeError S02=1, ValueError S02=12, NameError S02=7, AssertionError S02=2.
- 3.12 output for the swap with None: "AttributeError: 'NoneType' object has no attribute 'strip'".

**Fix.** Pick one:
- Keep the text-type guard, so no planned path raises AttributeError, and state the swap consequence only for the `or-first makes reject dead` experiment.
- Or, where the experiment is instructed, gloss AttributeError in one clause, tied to S02's «el punto permite consultar un dato asociado» (s02:109).

## [minor] S03-selfCheck (s03:2520-2582) outcome coverage

**Problem.** The plan rewrites O4, says O8 'is now delivered by case blocks with asserts', and leaves Q1, Q3 and Q4 unchanged, but it never maps self-check items to outcomes. The self-check is what the readiness audit counts as S03's EXAM activity. No self-check item assesses unreachable branches (O4's second clause, kept in the plan's rewording), covering each branch with a test case (O8's second clause), or combining a range with an allowlist (O5; Q5 is an allowlist alone). O2 has three items (Q1, Q2, Q4).

**Evidence.** The 8 stems at s03:2524-2575 test, in order: Q1 is None, Q2 None/0 policy, Q3 first-true-wins, Q4 `"" or "default"`, Q5 allowlist set+in, Q6 match vs if, Q7 None before <, Q8 actionable message. The outcomes at s03:30-34 are O4 'Aplicar guard clauses y detectar ramas inalcanzables…', O5 'Implementar rangos y allowlists combinados…' and O8 '…y cubrir cada rama con un caso de prueba'. scripts/badge_readiness_audit.py:59-60 maps `selfcheck.` events to offers 'EXAM'.

**Fix.** Add an outcome → self-check table to the assessments section. Either re-target one of the three O2 items to O4's dead-branch clause or O8's branch-test clause, keeping its correctIndex, the 2/2/2/2 balance and all pins, or state the gap explicitly as a trade-off covered only by the bank (guard-clauses :806, actionable-messages :964).

## [minor] S03-selfCheck Q4/Q7/Q8 vs exam bank :706/:792/:950

**Problem.** Three self-check questions are near-copies of exam bank items. The self-check is public, and after submit it shows the correct option and explanation (SectionView.tsx:903, :955). So for 3 of 8 exam concepts, one of the three variants is answered before the exam. D12 treats a question whose key the learner was shown as not evidence. The plan edits Q7 and Q8 but leaves their bank twins identical in substance.

**Evidence.** Q4 s03:2545 '¿Qué devuelve la expresión `"" or "default"`…' (correct '"default"') vs seed.ts:706 '¿Qué imprime la expresión `"" or "default"`…' (correct '"default", porque or…'). Q8 s03:2575 (correct "Campo 'edad'=-5 fuera de rango; usa un entero 0–120.") vs seed.ts:950-955 '¿Cuál mensaje es accionable al rechazar edad=-5…' (correct "Campo 'edad'=-5 fuera de rango; usa 0–120."). Q7 s03:2567 vs seed.ts:792 (both: None before < 18 → TypeError). SectionView.tsx:903 has 'showCorrect = submitted && oIdx === q.correctIndex', and :955 renders {q.explanation}.

**Fix.** While rescoping, move each bank twin to a different surface of the same skill, keeping concept and correctIndex. For :706, a different operand pair whose `or` result must be predicted. For :950, a different field and value, such as region or monto. :792 is already being reworked by the Q7 finding. List the twin pairs in the assessments section so later rounds keep them apart.

## [minor] S03-selfCheck.Q2 (s03:2529-2536)

**Problem.** The plan pads Q2's distractors to remove the length cue, but the explanation quotes distractor 1 word for word. Padding option 1 leaves the explanation quoting an option that no longer exists, and the plan's constraints list only the pin and the word count.

**Evidence.** s03:2533 options[1] 'Ambos `reject` porque son falsy' (31 chars; the correct option is 71). The explanation (s03:2535) reads '“Ambos `reject` porque son falsy” describe el comportamiento de `bool`, no la política del dato.' The plan's item S03-selfCheck.Q2 change is 'Pad the distractors to comparable detail', with constraints 'correctIndex 0. Pin …. Explanation 31 words.'

**Fix.** Add a constraint: when options[1] is padded, update the quoted text in the explanation to match it exactly. The pin 'describe el comportamiento de `bool`, no la política' follows the quote and is unaffected. Keep the explanation at 22 words or more.

## [minor] S03-youDo.context + CASO_S02 (transition from S02)

**Problem.** The youDo claims to start from «the valor column of S02's walk» through a CASO_S02 continuity case. S02 never produced a region, and it calls the amount `monto`, always a Decimal. So the continuity case must invent one of its three inputs and rename another. The field S02's youDo makes central, contacto with its leading zero, is not a youDo field.

**Evidence.** grep -c -i 'region' s02-basics.ts → 0; grep -c 'monto_ingreso' s02-basics.ts → 0. S02 youDo raw fields (s02:2170-2176): nombres, apellido_paterno, apellido_materno, contacto, direccion, edad, monto. S02 values: `monto = Decimal("150.50")` (s02:481, s02:769). Plan youDo.context: '«Parte del parser de S02» → the valor column of S02's walk'. Plan youDo starter: 'CASO_S02' within '(label, (edad, region, monto_ingreso), ...)'. Plan (c): 'The youDo keeps edad, region and monto_ingreso for S04.'

**Fix.** Make the continuity claim exact. CASO_S02 takes edad and monto from S02's youDo (28 and Decimal("150.50"), which ties to the monto-type ask-first). State that region is a new field in S03, and name the monto → monto_ingreso rename in one clause. Or narrow the context sentence to 'the edad and monto of S02's walk'. Record under the contacto ask-first that S02's showcase field has no S03 youDo counterpart.

## [minor] S03-youDo.starterCode (case table) + ask_first

**Problem.** Route 2 was accepted on the recommendation to 'give each increment a written record schema instead of changing it silently at every step'. The plan changes the record again without writing one: S03's dict {edad, region, monto_ingreso} becomes a positional tuple inside (label, record, expectations). It does not say where each field comes from. S02 hands over separate names: `edad`, `monto` (not monto_ingreso), no region, and the preserved `_raw` values. S04 then expects dicts keyed monto_ingreso with raw_line. The rename monto → monto_ingreso, the source of region and the raw values dropped between S02 and S04 are all left silent. The field names are reserved to the owner under L1Q3-7, which the plan does not cite.

**Evidence.** OWNER_PACKET_2026-09-21.md:62-67: '## 4. Level 1: the practice layer, and CP-N1-A's schema … give each increment a written record schema instead of changing it silently at every step. This is Q3's route 2'. DECISIONS_2026-09-21.md:839-857 (L1Q3-7) is reserved: 'S01's You Do data spec and the S02-S04 field names (AGENTS.md:97)'. S02's handoff is s02:2184-2186 (`direccion_raw`, `edad_raw`, `monto_raw`; no region) and s02:2196-2197 (`edad = ____`, `monto = Decimal(…)`). S04 expects s04:1855 (`"monto_ingreso": 0, "raw_line": "30|Lima|0"`). The plan's names item says 'The youDo keeps edad, region and monto_ingreso for S04', with no source mapping.

**Fix.** Add a written record schema to the youDo's opening comment, and require it in the README. For each field give its type, its absent form (None) and its source: edad from S02's edad, monto_ingreso from S02's monto, region introduced in S03. Say what S04 receives from it. Add L1Q3-7 to ask_first for the monto → monto_ingreso rename. Optionally, carry S02's raw line in each case tuple, which S04 needs (raw_line).

## [minor] S03-youDo.starterCode (s03:2370-2506)

**Problem.** Each planned case is a tuple that contains two other tuples, unpacked in two steps. The plan calls this 'two-step S02 unpacking', but S02 shows only a flat tuple unpacked in one step. No S03 theory, demo or exercise in the plan nests one tuple inside another, so the youDo is where the learner first meets the shape, with no example before it.

**Evidence.** - Plan: 'Eight named case tuples (label, (edad, region, monto_ingreso), (esperado_edad, esperado_region, esperado_monto, esperado_registro))' and 'the two-step S02 unpacking'.
- s02:176-186 show only `resultado = (True, 19, None)` and `ok, edad, error = resultado`.
- Every opening line in the plan's convention (a) is flat, for example `region, edad = ("R-FUERA", 30)`.

**Fix.** Pick one:
- Flatten each case to a single tuple and unpack it in one S02-style line, wrapped in parentheses per R8.
- Or add a nested-case line, with its two-step unpacking, to one earlier worked example (theory T4-B or T4-B-DEMO) so the youDo reuses a form the learner has already seen run.

## [minor] S03-youDo.starterCode (s03:2370-2506)

**Problem.** The youDo's fallback for `"reject" in estados` cannot trigger. The open question says to fall back to chained `==` 'if the first-use gate flags it', but no instrument models `in`, so the gate will never flag it. The decision has to be made now, by reading the section.

**Evidence.** - Plan open question: 'If the first-use gate flags it, fall back to chained `==` with `or`.'
- concept_map.json has no membership or `in` concept among its keys.
- concept_syntax.mts:45-48: SYNTAX lists only 'dict' and 'repr'.
- The glossary has no `in` entry.
- The only exemplar of `in` over a tuple in the section is T3-B-DEMO, s03:750 `elif code in ("MISSING", "NEEDS_REVIEW"):`, which the plan keeps implicitly.

**Fix.** Decide in the plan:
- Either keep `in` over the tuple and cite T3-B-DEMO's s03:750 line as its in-section exemplar, which then must be kept on purpose.
- Or build the record statuses as T1-A's taught form, a set used with `in`.
Drop the gate-conditional wording.

## [minor] S03-youDo.title+context / S03-youDo.starterCode / S03-youDo.portfolioNote (and ask_first 'CP-N1-A placement')

**Problem.** The plan misreads S02's precedent and, in learner-facing text, decides a question it reserves for the owner. S02 dropped the CP-N1-A label but kept its increment framing. The plan drops «incremento CP-N1-A» from S03's title, starter and closing sentence, and swaps the portfolio note's CP-N1-A review for 'a neutral reviewer'. It never says to keep any increment wording. Yet ask_first says 'whether S03 remains an increment are the owner's call'. After the round, S01 still promises learners that S02-S04 each add to the Level-1 intake script, and S04 still builds on 'las reglas de S03'. S03 would be the only link in the N1 chain that no longer calls itself an increment. The CP-N1-A ask_first also omits several learner-facing and catalog sites that say S03 contributes.

**Evidence.** S02's actual precedent: s02:2155 'En este incremento del mismo proyecto trabajarás con una captura sintética completa' and s02:2174 starter '"""captura_cliente.py — incremento de S02'. The S01 promises: s01:2336 'S02–S04 añadirán el script de admisión sin rehacer esta base'; s01:2399 'Este repositorio es la base de tu portafolio de Nivel 1… Cada sección suma evidencia'; s01:70 'Ese esqueleto inicia `CP-N1-A`, el proyecto acumulativo que cerrarás en S04'. The roadmap: learning_roadmap_52_V3.md:151 gives S3 '**Proyecto:** motor de reglas del intake' and :162 gives S4 'cierre CP-N1-A'. The catalog: CP-N1-A/gate.json:61-64 dependencies S01-S04; CP-N1-A/RUBRIC.json:6 gate_section S04. The learner-facing CapstonesPage.tsx:342-346 renders CP-N1-A prerequisites (S01-S03) and contributingSections (S01-S04). The plan's ask_first names only catalog.ts:59, INDEX.json, BRIEF.md and S03's own seven lines.

**Fix.** Follow S02's precedent exactly: remove only the CP-N1-A label. Keep an increment marker in S03, such as a starter docstring saying the file is S03's increment and a context sentence saying it is an increment of the same project, so the owner's question stays open and the S01 → S02 → S03 → S04 chain stays visible. Add these sites to the CP-N1-A ask_first so the owner sees every surface that claims S03 contributes: s01:70, 1907, 2336 and 2399; learning_roadmap_52_V3.md:149-162; gate.json dependencies; RUBRIC.json gate_section; and CapstonesPage's prerequisites and contributing rows.

## [minor] SECTION (R3 gaps: S03-T4-A-E3 s03:2098-2167, S03-T3-A-E3 s03:1723-1781, S03-T3-B-E3 s03:1899-1964)

**Problem.** Three more rebuilt items teach a chain that has branches no case reaches. The plan's R3 says every branch gets a case, and O8 says the learner covers each branch with a test case, yet the section's own models leave these branches untested. T4-A-E3's fixed chain has 6 branches, and 15/None/30 reach 3, while Límites and hints[1] claim 'fuera de 0–120 sí corresponde reject'. The new fail-closed T3-A-E3 has a PED accept row that no block reaches. T3-B-E3's `case _` safety default has no unknown-code block, although Q6 teaches 'y hay case _'.

**Evidence.** rest.py printed 'T4-A-E3 range branch deleted, 15/None/30 identical: True | -3 -> review (plan chain: reject)'. t4b_e3.py printed "T4-A-E3 fixed chain, branches hit by 15/None/30: ['F1', 'F4', 'F5'] of F1..F6". t3a_e3.py printed 'T3-A-E3 PED row deleted, 4 blocks identical: True' and "valid PED ('PED','000123'): ('accept', 'OK') -> with row deleted: ('reject', 'OUT_OF_RANGE')". rest.py printed 'T3-B-E3 `case _` deleted, OK/MISSING/OUT_OF_RANGE identical: True | FOO -> PREVIOUS', which means R2's stale value leaks. s03:2103 reads 'fuera de 0–120 sí corresponde `reject`'.

**Fix.** T4-A-E3: add blocks at -3 or 121 (strict reject / fixed reject) and at 70 (fixed review), which also answers the retrospective's 66–120 prompt. T3-A-E3: add a ("PED", "000123") → accept OK block. T3-B-E3: add a FOO → review code block. If the owner rejects the extra output lines, list these items as named R3 exceptions in the convention and remove any prose claiming that every branch is exercised.

## [minor] SECTION (exam bank) — 'positions[a::3]' invariant

**Problem.** The plan keeps '2/2/2/2 per attempt slice positions[a::3]' as a balance invariant, as if it described an attempt. It does not. exam/start draws a random unused variant per concept and does not shuffle options, so an attempt is not variant slice a. With today's bank positions, only about 4.5% of possible first attempts are balanced 2/2/2/2; about 40% put 4 or more of the 8 keys at one position, and some put 6. The plan preserves an invariant that does not describe what learners see, and does not state that.

**Evidence.** route.ts:206 'const selected = available[Math.floor(Math.random() * available.length)]'. route.ts:116 'options: JSON.parse(q.options)' shows options are returned unshuffled, and ExamView.tsx:294 maps q.options in order. I enumerated every per-concept variant combination for the bank's position sets [[0,1,2],[1,2,3],[2,3,0],[3,0,1]]×2. The largest share of the 8 keys at one position was 2 in 4.5%, 3 in 56%, 4 in 32.4%, 5 in 6.6% and 6 in 0.5% (e.g. (0,1,0,0,0,1,0,0)). The test is test_s03_independent_contract.py:169-173 (Counter(positions[attempt::3])).

**Fix.** Stop describing positions[a::3] as per-attempt balance. Add this as an instrument blind spot under open_questions, with its own commit outside this read-only plan. Options: shuffle each drawn item's options in exam/start and store the permutation in ExamAttemptForm (D12 already grades against the saved form), or constrain the draw. Until then, the only balance the section can claim is overall 6/6/6/6 and distinct positions per concept.

## [minor] SECTION: every rewritten requirement-kind field (weDo instruction/hint/tests; youDo objective, requirement and rubric, e.g. rubric «Pruebas/ejemplos por rama», requirements[2] wrong type → BAD_TYPE, requirements[7]; T4-A-E1 hints)

**Problem.** The plan rewrites more than 20 requirement-kind fields but gives the writer no vocabulary guard. The natural Spanish for concepts the plan names in English ('one case per branch', 'wrong type', 'absent value') includes glossary aliases that are first defined long after S03. Any one of them in an S03 requirement field becomes a DEFINITION_AFTER_REQUIREMENT issue located in decisions-rules. That adds one readiness finding to each of the four S03 badges.

**Evidence.** course_event_extractor.mts:257-260: REQUIRING = wedo.instruction, wedo.hint, youdo.requirement, youdo.objective, selfcheck.question, wedo.tests, youdo.rubric. Line 324: every alias hit in these kinds counts as a requirement.

Glossary aliases and their first definitions:
- 'cobertura de ramas' → coverage, first defined at rpa-advanced.S24-T4-A-E3.preamble;
- 'tipo de dato' → tipo-de-dato, first defined at collections.S06-T1-B.p0, required nowhere today;
- 'valor faltante' / 'valores nulos' → missing-values, first defined at exceptions-logging.theory[2].p0.

Checked on 3.12: 'Pruebas con cobertura de ramas' matches coverage and 'un tipo de dato incorrecto' matches tipo-de-dato. Today's wording 'los tipos incorrectos se rechazan' (s03:2364) matches nothing.

Simulation: putting 'tipo de dato' in youDo.requirement[2] and 'cobertura de ramas' in youDo.rubric[3] gives 2 S03-located blocking issues × 4 badges = 8 new findings.

**Fix.** Add a banned-alias list to the plan's constraints and to the codex brief for all S03 requirement-kind fields. It covers the aliases of for, dict, coverage, tipo-de-dato, missing-values, annotation, outlier and pytest ('bucle for', 'cobertura de ramas/líneas', 'branch coverage', 'tipo de dato', 'valor faltante', 'valores nulos', 'NaN', 'type hint', 'valor atípico').

Name the safe renderings the section already uses: 'tipo incorrecto', 'un caso por rama', 'ausente/None'.

After applying, confirm with the readiness row diff that no decisions-rules location appears.

## [minor] SECTION: verifying dimension 2 ('critical_competencies practised by then')

**Problem.** The plan checks dimension 2 only through the readiness rows, but badge_readiness_audit never reads critical_competencies, so half of the dimension goes unchecked.
- By hand, reproducibility_determinism holds: it is practised in S01 (packaging, git) and S04 (testing_discipline), and the plan touches neither.
- communication_audience_tuned, a critical gate of integrated_python_ai_capstone_foundations (S01–S13), has no mapped practice before S26, before or after the plan.

The plan names neither result. The pre-existing gap could later be blamed on S03, or be dropped silently.

**Evidence.** badge_readiness_audit.py mentions critical_competencies only in its docstring (line 4). The code at lines 89-146 checks sections, activities, prerequisites and vocabulary only (grep 'critical' → line 4 only).

badge_catalog.json:
- python_data_foundations: critical ['reproducibility_determinism'], sections S01–S05;
- integrated_python_ai_capstone_foundations: critical ['reproducibility_determinism', 'communication_audience_tuned'], sections S01–S13.

industry_alignment/curriculum_gap_matrix.json:
- line 812: communication_audience_tuned, written S50/S52, stakeholder_translation S26/S39/S49/S51;
- line 813: reproducibility_determinism, packaging S01/S15/S17, git S01/S47, testing S04/S11/S21.

curriculum_skill_graph.json maps every S03 activity to python_core, python_idioms and data_validation only.

The plan's 'AFTER THE ROUND' step diffs only the bank and the readiness rows.

**Fix.** Add a hand check of critical competencies to the plan's after-round step:
- reproducibility_determinism: holds, because S01 and S04 are unchanged.
- communication_audience_tuned: not practised by S13 before or after the plan. Record it in OPEN_QUESTIONS as a catalog-level gap (ask-first), not caused by S03.

Add a constraint that the S03 parts closest to that skill stay at least as strong: T4-B's person-facing messages, T4-B-E1's message writing, and the youDo portfolioNote and three-voice retrospective. In particular, the portfolioNote rewrite that drops «la revisión de CP-N1-A» must still name a concrete reader.

## [minor] Terminology: guard / guards / guarda / guardia across S03

**Problem.** The plan renames the technique in Spanish in only two places: O4 (s03:30) and rubric criterion 5 (s03:2514). About a dozen learner-facing sites keep the English «guard(s)», s03:289 uses a third form, «guardia», and the plan misreads youDo requirement [6] as already saying «guarda». One teacher would use one word for one concept.

**Evidence.** grep in s03-decisions-rules.ts: English 'guard' on 30 lines, including learner prose the plan does not touch: s03:333 «Con exclusividad de ramas y guards»; s03:1455 title «Refactor de pirámide a guards (monto)»; s03:1916 «falta el guard de ausencia»; s03:1974 «Añade guard de tipo»; s03:2106 «Implementa fixed con guards»; s03:2296 «mantén guards de None»; s03:2567 (selfCheck Q7 stem) «En un validador con guards»; s03:2368 «Preferir guards a pirámides de if anidados». Spanish «guarda(s)» on 14 lines; «guardia» at s03:289 («Cada guardia retira una clase de casos»). The plan's youDo.requirements[6]: '(keep «guarda» because the theory keeps it...)', but the text at s03:2368 says «guards».

**Fix.** Add a terminology line to convention (c): «guarda / guardas» everywhere in learner prose, titles, hints, feedback, the Q7 stem and youDo requirement [6]; «guardia» at s03:289 becomes «guarda». List each site above in the item it belongs to. Check that no pinned substring contains 'guard': the Q7 pin is in the correct option, not the stem.

## [minor] assessments 'AFTER THE ROUND' + open_questions instrument blind spots

**Problem.** Nothing checks dimension 4 in this plan. The readiness audit builds each capstone row only from vocabulary gaps in that capstone's gate section, so no change to S03 can ever move CP-N1-A's row. CP-N1-A's package tests are placeholders that always pass. The plan's post-round step says to diff the readiness rows by hand, but here those rows are blind, and the plan's instrument blind-spot list omits this gap.

**Evidence.** scripts/badge_readiness_audit.py:153 has `slug = by_num.get(n) if n else None`, taking n from c["gate_section"]. Line 158 reads `i for i in gaps.get(slug, [])`, and line 169 builds the row with `cap_rows.append({"id": c["id"], "gate_section": slug, …})`. course-state/badge_readiness_report.json holds {"id": "CP-N1-A", "gate_section": "iteration-summaries", "blocking_term_gaps": 0}. course-state/capstones/CP-N1-A/tests/test_demo.py test_0 through test_4 all read `assert True  # placeholder — replace with real check`. The plan's open question lists concept_map annotations, len and planted_defect_audit as blind spots, and nothing about capstones.

**Fix.** Add a hand check after the round. Tabulate every CP-N1-A claim (BRIEF.md, gate.json, RUBRIC.json, IDO/WEDO/YOUDO.md, demo.py) against what S01-S04 practise after the round, and record the result in LEDGER_NOTES. Add 'capstone readiness rows see only the gate section's vocabulary' to the open_questions instrument list, as an instrument fix for its own commit.

## [minor] convention (a) case blocks × iDo demos (D4 SteppedCode)

**Problem.** I Do demos render through SteppedCode, D4's stepped reveal. It chunks code at blank lines and every 5 lines, and shows the output only after the last chunk. The plan's case-block layout (about 12-line blocks separated by one blank line) roughly doubles or quadruples the clicks before any output is seen. It also cuts every block at a line ending in ':', so the header is revealed without its body. In the funnel, that splits the happy-path `else:` from `status, code = ("accept", "OK")`. D4 says a reveal fits 'where the order is the lesson', and segmentCode's own doc says chunks are 'what a person would actually type in one go'. The plan does not state this trade-off.

**Evidence.** SectionView.tsx:517-523 renders every I Do demo with <SteppedCode>. SteppedCode.tsx:83-100 has segmentCode(maxLines=5). SteppedCode.tsx:128 sets `outputVisible = showAll || (done && ran)`.
Ported segmentCode to Python and ran it on today's S03 demos: T2-B-DEMO has 17 lines and 4 clicks; T3-B-DEMO has 47 lines and 10 clicks.
Built plan-faithful prototypes; the line counts match the plan's stated 64 and 87, and both run and match the plan's outputs. T2-B-DEMO: 64 lines, 15 clicks, 5 chunks ending on a ':' header ('else:'). T3-B-DEMO: 87 lines, 19 clicks, 8 chunks ending on a header ('else:', 'case "MISSING" | "NEEDS_REVIEW" | "NOT_IN_ALLOWLIST":').

**Fix.** State the D4 cost in the plan: clicks per demo before and after, and the header/body splits.
One option is to take the 3-block T3-B-DEMO fallback.
Another is to raise, as its own commit with a baseline proof, a SteppedCode change that ends chunks only at blank lines when a block is 12 lines or fewer, or that never ends a chunk on a line ending in ':', so that one case block is one reveal step.

## [minor] exam bank :849 (allowlists-ranges variant 3) and S03-selfCheck.Q5 (s03:2552)

**Problem.** Two problems share this variant. (1) Outcome O5 promises combined ranges and allowlists, but in one of three attempts it is assessed by :849, which tests S02's PEP 8 naming convention and not a combined rule. That breaks the bank's own family contract. (2) After the plan re-domains TIPOS_DOC and DOC_LEN to opaque ids, no S03 code has a document-type catalog. Yet :849 still names `ALLOWED_DOC_TYPES`, its explanation says «tipos de documento», and the self-check Q5 stem keeps «allowlist de tipos de documento» while the plan swaps only option 4 to 'CLI', a record-type code that is not a document type.

**Evidence.** seed.ts:849 '¿Por qué conviene nombrar la allowlist en `UPPER_CASE` (p. ej. `ALLOWED_DOC_TYPES`)…'; :853 correct option 'Por convención de constantes de módulo…'; :858 '(regiones, tipos de documento)'. S02 already teaches this: s02:294 'Constantes: UPPER_CASE'. s03_phase5_exam_bank.json, family S03-T3-A-EX, has skill 'Combinar allowlist + rango con accept/review/reject', equivalence note 'C: UPPER_CASE constante', and parallelism_rules 'cognitive_demand: A/B/C matched within family'. s03:2552 'Una allowlist de tipos de documento se implementa mejor como…'. The plan's Q5 change covers only option 4, 'DNI' → an opaque code such as 'CLI'.

**Fix.** Rewrite :849 as a combined-rule item using the plan's own verified theory[8] prediction: R-FUERA with edad 15 under the none → allowlist → range chain gives review NOT_IN_ALLOWLIST, because the allowlist branch runs first. Keep correctIndex 2 and distinct per-concept positions, and update the phase5 family note. Re-domain the Q5 stem to the same opaque catalog as T1-A-E2 and T3-A-E3, so the stem and option 4 describe one domain.

## [minor] iDo.intro + first multi-block program (theory[5])

**Problem.** The plan turns 7 of 8 demos and most theory code into repeated case blocks, up to 8 copies of a chain in T3-B-DEMO. It tells the learner how to read them only 'once, in weDo.intro and in theory[3]'s bridge sentence', and marks that bridge optional. weDo.intro comes after all theory and every iDo demo. So the reading rule (read the first block fully, later blocks differ only in line 1, names keep the previous block's values) is explained after the learner has met every multi-block program. The repetition load goes unsignalled exactly where it is heaviest.

**Evidence.** Plan iDo.intro: 'change': '' (unchanged; s03:544 says nothing about blocks). Plan convention: 'The prose says so once, in weDo.intro and in theory[3]'s bridge sentence.' Plan theory[3]: 'Optional bridge sentence'. Planned demo lengths against today's code: T1-B-DEMO 46 (s03:591-613, 23 lines), T2-B-DEMO 64 (s03:673-689, 17), T3-A-DEMO 49 (s03:712-726, 15), T3-B-DEMO 87 (s03:747-793, 47), T4-B-DEMO 67 (s03:861-900, 40). In page order the first multi-block program is theory[5] (blocks None/0/-5/150).

**Fix.** State the block-reading rule at first use (theory[5], or theory[7] where the first repeated chain appears) and again in one sentence in iDo.intro. Consider a one-line comment per block naming its case, so the learner can skim copies and go straight to the line that changes.

## [minor] learningOutcomes O4 (s03:30) + theory[3] p3 (s03:125)

**Problem.** The rationale for rewording O4 is factually wrong, and the plan leaves a conflicting definition of «guarda» optional. The plan drops «guard clauses» because 'its canonical form is the early return, which S03 no longer shows'. But theory[3], which the plan keeps verbatim, shows exactly that form and defines a guard by it. After the plan, the section defines guard twice: theory[0]/T2-B as the leading branches of an if/elif chain, and theory[3] p3 as an immediate return. The Q7 and :792 assessments test the return version (see the Q7 finding).

**Evidence.** s03:134-136 read `def decidir_region(region):` / `if region is None:` / `return "review"`. s03:125 reads '…por eso una guarda puede devolver `review` o `reject` de inmediato.' The plan's learningOutcomes row says 'its canonical form is the early return, which S03 no longer shows'. The plan's theory[3] row says 'Optional: narrow p3's clause … to «dentro de una función»'.

**Fix.** Make the theory[3] p3 narrowing mandatory, so the guard that returns is presented as the function form the learner applies from S05, while S03's guards are the leading branches of one chain. Correct the plan's O4 rationale: S03 shows early-return guards only in the held definition and never has the learner apply them. The reworded O4 stays as planned.

## [minor] satellite: figure S03-guard-order (misc.ts:446, attached at s03:67-75)

**Problem.** By default the figure stays at T1-A, since its placement is only an open question. There it draws an ordered chain of guards beside a block that has no chain, before the arc has introduced if/elif (T2-A) or guards (T2-B). The plan's instruction to 'order the branches like the chain of the block the figure sits beside' cannot be carried out at T1-A.

**Evidence.** s03:67-75: the figure 'S03-guard-order' is attached to theory[2] (subtopic S03-T1-A). T1-A's code, comparaciones_intake.py (s03:87-96), holds only comparison prints and no branch. Figure headline (misc.ts:448): «Las guardas se evalúan en orden y la primera que coincide gana». Plan figure item: 'Order the branches like the chain of the block the figure sits beside. Placement is an open question.'

**Fix.** Settle placement inside the plan rather than leaving it open. Order the figure's branches like theory[7]'s T2-B funnel, which gives absence → type → range → accept with the corrected results, and either move it to T2-B (a D5 trade-off stated for T1-A) or keep it at T1-A with a caption that frames it explicitly as a preview of T2-B. Do not describe it as matching a chain that T1-A does not have.

## [minor] satellite: prisma/seed.ts S03 exam bank (:644-990)

**Problem.** The rescope list says it caught the sites the planning output missed, but it still misses one distractor built on `except: pass`. D10 bans try/except before S09, and `pass` appears nowhere in S01–S03 content once the plan removes it from T2-A-E2. An S03 exam would show the learner both constructs before either is taught.

**Evidence.** - seed.ts:982: 'Silenciar el else con except: pass' (concept 'actionable-messages-branch-tests', correctIndex 1).
- The plan's rescope list names :722, :723, :749, :772, :778, :782, :806, :869, :878, :907 and :935, but not :982.
- `grep -w except` over s01–s03 finds 0 hits.
- terms.ts gives the Excepción entry the aliases 'except' and 'try/except'.
- decisions.md D10: 'Every earlier use is a forward dependency and comes out'.

**Fix.** Reword the :982 distractor into a wrong practice that uses only S03 vocabulary, for example «Borrar el `else` para que ningún caso llegue a `reject`». Keep correctIndex 1, and keep questions and explanations unique.

## [minor] satellite: prisma/seed.ts S03 exam bank (:644-990)

**Problem.** The plan removes all seven learner-facing CP-N1-A claims in s03 (52, 62, 1176, 2351, 2353, 2370, 2508), citing S02's precedent of zero mentions. It misses the CP-N1-A gate claim inside S03's own exam bank, which is in this round's scope. After the round, S03's exam would be the only S03 surface that names the Level-1 gate, while the section itself never mentions it.

**Evidence.** prisma/seed.ts:944, explanation of the invariants-examples item (the `validate_contacto` item at :935): 'Mínimo: un ejemplo por estado que la regla produce. El camino feliz solo no basta para el gate CP-N1-A.' A grep of seed.ts for CP-N1 finds no hit before :644, so S02's bank has 0, matching the cited precedent. The only other S03-range hit is :944. The plan's exam rescope list covers :722, :723, :749, :772, :778, :782, :806, :869, :878, :907 and :935, but not :944.

**Fix.** Add seed.ts:944 to the exam-bank rescope. Drop the CP-N1-A clause and keep the per-state rule, for example by ending the sentence on why the happy path alone is not enough for the invariant. Keep the explanation at 7 words or more and unique within the bank, and keep correctIndex 0.

## [minor] theory[0] p5 (transition into S04)

**Problem.** The rewritten p5 tells the learner that S06 will pack decision, cause and message into one value. S04, the next section, teaches dict in its third theory block, and its youDo returns dict results, so the forward pointer is wrong about the very next step.

**Evidence.** Plan theory[0]: 'p5: S03 carries decision, cause and message in three names; S06 packs them into one value.' s04:72-80: heading «Cómo leer un dict en estos ejemplos», with `ficha = {"id": "C001", "edad": 30}`. s04:1826-1830: `def validate_record(record: dict[str, Any]) -> dict[str, Any]` ... «devolver {status, fields} con accept|reject|review por campo (S03)». s04:48 opens with «Desde **S03** ya validas un registro».

**Fix.** Either word p5 without a section number that S04 contradicts (e.g. 'a later section packs them into one value'), or keep S06 and add to open_questions a dependency for S04's route-2 round: S04's dict primer (s04:72) and dict-returning youDo must move to S06, or S03's pointer must change. The transition is only consistent once one of these is true.

## [minor] theory[10] S03-T4-A (s03:412-468) and S03-T4-A-DEMO

**Problem.** The plan glosses `len()`, `.isascii()` and `.isdecimal()`, but p5's counterexample also names `isdigit()`, which gets no gloss. The plan also removes the course's only two code uses of `isdigit` before S05, and S05 then uses `c.isdigit()` 16 times. So `isdigit` is named in S03 without an explanation, and S05 loses its only earlier example.

**Evidence.** - Plan (theory[10]): 'p5 counterexample: \'١٢٣٤٥٦٧٨٩\', which isdigit() and isdecimal() accept and isascii() rejects' and 'Gloss len(), .isascii() and .isdecimal() in one sentence each'.
- s03:432 and s03:822 (`digits.isdigit()`) are the only uses in S01–S04 (grep: S01=0, S02=0, S04=0). The planned funnel replaces both.
- s05:585 `d = "".join(c for c in raw if c.isdigit())` is the first of 16 S05 uses.
- Verified on 3.12: '١٢٣٤٥٦٧٨٩'.isdigit() → True, .isdecimal() → True, .isascii() → False.

**Fix.** Add `.isdigit()` to the T4-A gloss sentence, in the same `x.metodo()` form: it also accepts non-ASCII digits, which is why the funnel adds `.isascii()`. Record it with len/isascii/isdecimal as a course-first definition to recount after the round.

## [minor] theory[11] S03-T4-B, S03-T4-B-DEMO, S03-T4-A-E1 (OR alternative `edad > 120`)

**Problem.** R3 says an OR arm needs a non-first alternative, because the first alternative survives deleting the rest. The plan applies that only to match `|`. In these three O7/O8 items the OUT_OF_RANGE branch is `edad < 0 or edad > 120`, and the only case reaching it is -5 or -1, the first alternative. The messages and invariant claim 0–120, but the upper bound can be deleted and every assert stays green.

**Evidence.** t4b_theory.py printed 'theory T4-B green with `or edad > 120` deleted: True | 500 -> OK', 'T4-B-DEMO green with `or edad > 120` deleted: True | 500 -> OK' and 'T4-A-E1 green with `or edad > 120` deleted: True | 500 -> OK'. The plan's case lists are theory[11] 'None|True|-5|0', T4-B-DEMO 'None / "x" / -5 / 35' and T4-A-E1 '30, -1, None, "x"'.

**Fix.** Extend R3's OR rule to `or` conditions. In theory T4-B, add a 121 → OUT_OF_RANGE block; its output is not pinned. In T4-A-E1, add 121 → reject and extend Éxito. T4-B-DEMO's output is pinned byte-identical, so either add the block and accept the pin change, or name 121 as the retrospective's defective-change answer ('deleting `or edad > 120` stays green until you add 121').

## [minor] theory[6] S03-T2-A + S03-T2-A-DEMO retrospective (s03:661) + S03-T2-A-E2

**Problem.** The theory now runs the exact program that the independent exercise asks for: the same status_bad/status_good names, the same three-ifs overwrite version and the same exclusive chain. Between them, the demo does not show the bug, and its kept retrospective promises that the weDo will be the first deliberate showing. The learner meets the bug in theory, is told it is coming, then rebuilds the theory's code in E2.

**Evidence.** Plan theory[6]: 'score = 80 goes through the exclusive chain assigning status_good, then through the two-if overwrite version assigning status_bad... This is the first time the overwrite bug in p2/p4 is shown running' and 'The status_bad/status_good names match T2-A-E2.' Plan T2-A-E2: 'Each holds the three-if block assigning status_bad... then the exclusive chain assigning status_good'. s03:661 (T2-A-DEMO retrospective, not rewritten by the plan): «El error clásico es usar dos `if` y sobrescribir `status`; en We Do verás el fallo de forma deliberada y construirás la versión exclusiva.» Ran on 3.12: '80 good= accept bad= review'.

**Fix.** Let each stage do new work. Either theory[6] shows only the exclusive chain and states the overwrite as a prediction (at 80, what would a second `if` do?), leaving the running bad/good pair to E2. Or keep theory[6] as planned and change T2-A-E2's task, e.g. find the overwrite in an unlabelled three-if block at a value the theory did not use, then repair it. In both cases, rewrite s03:661's «en We Do verás el fallo» to match.

## [minor] theory[7] p5 + S03-T2-B-DEMO retrospective + S03-T2-B-E1 instruction (+ T1-B-E3 optional hint)

**Problem.** The same experiment appears three times in a row in T2-B: move `edad < 18` first, run with None, quote the TypeError. It uses the same field, the same value and the same edit. A fourth copy is an optional hint in T1-B-E3. The other half of the funnel's ordering claim, type before range, never becomes observable in T2-B; it is first observed in T4-A-E1.

**Evidence.** Plan theory[7]: 'Move `edad < 18` first, run with None, and quote only "TypeError: \'<\' not supported between instances of \'NoneType\' and \'int\'"'. Plan T2-B-DEMO: 'adds the reorder counterfactual (`edad < 18` first → quote the last TypeError line)'. Plan T2-B-E1: 'add the reorder → TypeError observation step, quoting the last line'. Plan T1-B-E3: 'putting `monto < 0` first stops the None block with TypeError'. s03:287 states both ordering rules («ausencia → tipo → rango»). A variant I ran on 3.12, with the range branch above the type branch and edad = "25", printed 'exit 1 | TypeError: \'<\' not supported between instances of \'str\' and \'int\''.

**Fix.** Vary the experiment. Keep None-before-`<` in theory[7] p5. Make the T2-B-DEMO counterfactual the range-above-type reorder with "25", so the type-before-range rule is observed in its own subtopic. Leave T2-B-E1's step as the learner's own prediction of which reorder fails, without prescribing the same edit a third time.

## [minor] weDo.intro (s03:918-919) and theory[3] bridge sentence

**Problem.** The plan requires a forward reference to 'S04's loop' in weDo.intro and in theory[3]'s bridge sentence, but does not constrain the wording. If the Spanish names `for` («el bucle `for` de S04»), the extractor counts a new use of `for` in S03, which is first explained only in S04. That would add a surprising use in the same round that removes the other 23.

**Evidence.** - Plan convention: 'The repetition is the honest cost that S04's loop and S05's def remove. The prose says so once, in weDo.intro and in theory[3]'s bridge sentence'.
- weDo.intro row: 'Add that the repetition is what S04's loop and S05's functions will remove.'
- terms.ts:77 gives `for` the aliases ['bucle for', 'bucles for', 'for']; bare «bucle» is excluded on purpose (terms.ts:74-76).
- concept_map.json: for.first_definition = S04-T1-A.p0.

**Fix.** State in both rows that the forward reference says «repetir un bloque» or «los bucles de S04» and never names `for`. Add the phrase check to the widened practice guard.
