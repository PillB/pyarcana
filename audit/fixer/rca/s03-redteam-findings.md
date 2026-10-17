# S03 route-2 plan: red-team findings

Attackers from `LESSON_READINESS.md`'s twelve readiness dimensions, against the plan from the
S03 mapping workflow. Each finding carries evidence: quoted source with line numbers, an
artifact path and value, or code run on 3.12 with its output.

| Round | Dimensions that ran | Findings | blocker | major | minor |
|---|---|---|---|---|---|
| 1 | 12 of 12 | 88 | 7 | 48 | 33 |
| 2 | 3 of 12 (concept map, assessment, figures) | 17 | 1 | 11 | 5 |

Round 2's other nine attackers died on the session usage limit, so those dimensions are
UNCHECKED against the revised plan, not clean — see LEDGER_NOTES, "A dead reviewer is not a
clean review". They run in the finishing pass, together with the owner's decisions O1–O9
(`OWNER_DECISIONS.md`), which settle the nine questions round 1 raised.

## Round 1

### [blocker] S03-T1-A-E1 (s03:922-973) + tests_to_rescope, "NEW … S03 starter visibility"

**Problem.** The plan ships a new adversarial test requiring every weDo starter to either raise its named error or print at least one line absent from the solution's declared output, states it "fails today on S03-T1-A-E2" (one item), and marks T1-A-E1 "No code change". T1-A-E1's starter is also invisible under exactly that rule, so the round lands a test that is red on an item the plan never touches.

**Evidence.** I ran all 24 S03 starters and solutions under .venv-content 3.12 and compared starter stdout lines against the solution's declared output line set. Two items have ZERO absent lines:
  S03-T1-A-E1      starter_rc=0 *** INVISIBLE ***
  S03-T1-A-E2      starter_rc=0 *** INVISIBLE ***
  (all other 22: VISIBLE)
T1-A-E1 starter (s03:942-955) with edad=25, region="R-SUR" prints `False/False/False/True/False`; the solution's declared output (s03:964-968) is `True/True/True/False/True`. Every starter line ('True' or 'False') already occurs in the solution output, so no line is absent. The defect is five inverted comparisons whose only evidence is line ORDER, which a line-set rule cannot see.

**Fix.** Either (a) give T1-A-E1 a code change that makes the defect visible line-by-line — e.g. label each print with its expression (`print("edad >= 18 →", edad >= 18)`), which makes each starter line textually distinct from every solution line and also satisfies R7; or (b) specify the new test as an ORDERED comparison (starter stdout != solution declared output) rather than a line-absence test, and re-verify all 24 items under that definition. Do not ship the test while naming only T1-A-E2 as the current failure.

### [blocker] S03-T2-B-E2 (s03:1452-1535) — SELECTOR EXCEPTION

**Problem.** The plan justifies the selector with "the item is acceptable only because ok= checks each run". For the pinned run (`monto = 20000`) that is false: the three flattening errors T2-B exists to prevent — guard order reversed, None guard dropped, truthiness used for presence — all print `ok= True` at 20000. The refactor-equivalence exercise ships a green light on its own three failure modes, and no single opening line can fix that.

**Evidence.** Ran under .venv-content 3.12, comparing today's `validate_monto_nested` (s03:1475-1490) against three plausible flattenings:
```
wrong_order:   ok= at monto=20000 -> True; matrix rows that disagree -> [None]
no_none_guard: ok= at monto=20000 -> True; matrix rows that disagree -> [None]
truthiness:    ok= at monto=20000 -> True; matrix rows that disagree -> [0]
   at 20000: review review   (all three)
```
So None catches the two order errors, 0 catches the truthiness error, and 20000 catches none of the three. Today's shipped run catches all three in one command: `s03:1514 for v in [None, "x", -1, 0, 500, 20000]:` with `print(v, a, b, "ok=", a == b)`. The plan's own pinned output is the single line '20000 review review ok= True'.

**Fix.** Use the block form the plan already sanctions for two implementations per block (T3-B-DEMO, 4 blocks, verified at 87 lines): blocks at `monto = None`, `0`, `"x"`, `20000`, each running the pyramid then the flat chain and printing `ok=`. One run then checks all three failure modes. If the selector must stay for length, the pinned opening line must be `monto = None` (not 20000), the Éxito line must require the learner to record `ok=` for all eight matrix rows in the retrospective as the item's evidence, and the retrospective must say plainly which error each row is the only one that catches.

### [blocker] S03-youDo.starterCode (s03:2370-2506) — SELECTOR EXCEPTION

**Problem.** The rebuilt You Do starter, run exactly as shipped, prints PASS while all five planted defects are still in place. Today's starter fails on its first run, on the assert that carries the section's thesis. The plan therefore replaces "run it and watch it go red" with "run it and watch it go green" at the one stage where the learner is meant to own the engine — and the plan's own new starter-visibility guard is written so that it cannot catch this.

**Evidence.** Plan, item S03-youDo.starterCode: "Then `caso = CASO_S02` and the two-step S02 unpacking" and "Prediction key verified per case: S02 PASS; CERO monto assert; AUSENCIA edad; …". So the shipped selector line names the one case that passes.
Today, extracted from s03:2370-2506 and run under .venv-content 3.12 (`s03:2453 def _run_tests():`, `s03:2505 _run_tests()`):
```
{'edad': {'status': 'reject', …}, 'region': …, 'monto_ingreso': …}
Traceback (most recent call last):
  File "youdo_starter.py", line 136, in <module>
    _run_tests()
  File "youdo_starter.py", line 93, in _run_tests
    assert r["monto_ingreso"]["status"] == "accept"  # cero válido
AssertionError
exit=1
```
The plan's new guard is scoped to exclude this file: "NEW … S03 starter visibility. Run each of the 24 weDo starters …", and item S03-youDo.starterCode states "The youDo starter is a plain string, not a counted program." The learner-facing promise it contradicts is s03:2352: "El starter contiene defectos deliberados, no casillas vacías: predice qué asserts fallarán antes de corregirlos".

**Fix.** Ship the selector pointing at a failing case, not a passing one: `caso = CASO_CERO_VALIDO` (whose assert is the valid-zero thesis of the whole section), and put the rotation order (CERO → AUSENCIA → DESCONOCIDA → MENOR_NEGATIVO → SIN_CONVERTIR → FRONTERA_FUERA → FRONTERA_DENTRO → S02) in youDo.context pass 4, so the two PASS cases are the last runs, not the first. Extend the new starter-visibility test to the youDo starter (assert that the shipped `caso = …` line selects a case whose run exits non-zero), so this cannot regress silently.

### [blocker] SECTION: removing 'dict' from S03-T3-A-E3 hint[1] and 'for' from S03-T4-B-E2 hint[1] and tests; the plan's 'AFTER THE ROUND' expectations

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

### [blocker] learningOutcomes (s03:26-35)

**Problem.** The plan drops «guard clauses» from O4 but never fixes the Spanish replacement term, while three other items are ordered to align to that unnamed term. After the round the same technique carries four learner-facing names: «guarda(s)», bare English «guards», «salida(s) temprana(s)» and O4's unnamed replacement — a straight A5 («one name per concept») and A1 breach. Worse, «guarda» ends up with two incompatible mechanisms: theory[3] keeps it as something that returns inside a function, theory[7]/youDo redefine it as the first branches of a top-level chain.

**Evidence.** s03:30 `{ text: 'Aplicar guard clauses y detectar ramas inalcanzables por orden de condiciones' },`. Plan, learningOutcomes: «Drop «guard clauses» as the named technique» — no Spanish replacement is given anywhere in the plan. Three items then depend on that missing term: rubric item «"guards" in criterion 5 → the Spanish term the theory uses»; assessments «:778, stem «orden típico de guard clauses» → align with O4's renamed technique (ordered guard branches)» (an English phrase, not a term); requirements[6] «keep «guarda» because the theory keeps it as the first branches». Two senses collide: theory[3] item keeps s03:125 «por eso una guarda puede devolver `review` o `reject` de inmediato» (only narrowed to «dentro de una función»), while theory[7] item says «p1: a guard is the first branches of the chain», replacing s03:286 «Una **guard clause** (salida temprana) valida precondiciones y **retorna de inmediato** con `reject`/`review`». Bare English «guards» survives at four sites whose objects the plan rewrites but whose wording it never names: s03:333 «Con exclusividad de ramas y guards, el motor ya puede combinar…», s03:2106 «2. Implementa fixed con guards (None, tipo, rango, menores, banda 18–65).», s03:2296 «Cambia > por >= en el camino accept; mantén guards de None.», s03:2567 «En un validador con guards, ¿por qué debe ir `if valor is None` antes de `if valor < 18`?». `grep -o "guards" | wc -l` = 23 in the section file.

**Fix.** Fix ONE Spanish term in the convention block (e.g. «rama de guarda» for the chain sense) and a distinct one for the function sense theory[3] keeps (e.g. «retorno temprano», explicitly «dentro de una función»). Then enumerate every site to align, not just the four the item list happens to reach: O4 (s03:30), theory[7] p1 (s03:286), theory[8] p1 (s03:333), T2-B-E1 (s03:1402/1405/1415), T2-B-E2 title and preamble (s03:1455/1457/1460/1464), T4-A-E3 instruction (s03:2106), T4-B-E3 feedback (s03:2296), youDo requirement (s03:2368), rubric (s03:2514), selfCheck Q7 stem (s03:2567), exam :778. Say in the plan whether the code file titles `guards_edad.py` and `refactor_guards_monto.py` keep English.

### [blocker] theory[3] (s03:112-164)

**Problem.** After the rebuild, theory[3] is the only block in S03 that contains a function, and its own opening motivation is falsified by the other 41 programs. The plan keeps p0 verbatim and marks the only bridge sentence "Optional", so by default the section ships a teacher who states the cure on the third block and then performs the disease for the rest of the section.

**Evidence.** s03:122 (plan: "Keep verbatim: p0-p3's defining sentences"): 'En intake, la misma decisión sobre una región aparece una y otra vez. Darle un nombre permite aplicarla a muchos valores sin reescribir sus comparaciones y sus ramas.' Plan convention (a): "The repetition is the honest cost that S04's loop and S05's def remove. The prose says so once, in weDo.intro and in theory[3]'s bridge sentence" — but the theory[3] item lists that bridge as "Optional bridge sentence". Scale of the contradiction, counted from the plan's own block counts for the edad funnel alone: theory[7] 2 + T2-B-DEMO 5 + T2-B-E1 5 + theory[11] 4 + T4-B-DEMO 4 + T4-A-E1 4 + T4-A-E3 6 (3 blocks x 2 chains) + T4-B-E3 4 + T3-B-E3 3 + youDo 1 = 38 literal copies of one chain, against 12 `def` copies today (grep -n 'def validate_edad|def map_edad|def validate_edad_msg|def validate_edad_strict|def validate_edad_fixed' s03 -> 295, 483, 673, 861, 1433, 1950, 2008, 2135, 2143, 2329, 2380). Seam with S02: s02:51 'Tampoco definiremos funciones; una función es un bloque reutilizable de instrucciones.' So the arc reads no functions (S02) -> functions (S03 block 3) -> no functions (S03 blocks 4-12, 8 demos, 24 exercises, You Do, playground).

**Fix.** Make the bridge non-optional and rewrite theory[3] p0's motivation so it promises naming (S05), not the removal of repetition the section then refuses to remove: e.g. p0 states that S03 keeps each decision at top level, that a rule with a name is what S05 builds, and that the repeated blocks ahead are the raw material. Add the same forward sentence to theory[1]'s Orden de los subtemas so a learner reading the contract knows why block 3 looks unlike everything after it. If the owner takes the ask_first move instead, prefer option (a) (end of theory) so the def block sits as a bridge and not as an interruption of T1.

### [blocker] theory[3] (s03:112-164)

**Problem.** The section's held-definition reference program encodes, as the teacher's own correct code, exactly the mapping that S03-T1-A... S03-T3-A-E1 marks as a DEFECT the learner must repair. The plan's mitigation is one clause inside theory[3] calling it "fail-closed policy", which cannot reach the learner who is told 173 lines later that the same mapping is a definitive rejection applied by mistake.

**Evidence.** s03:134-139: 'def decidir_region(region):' / 'if region is None: return "review"' / 'if region not in ALLOWED: return "reject"'; declared output s03:153 'R-OESTE → reject'. S03-T3-A-E1 starter s03:1636: '# DEFECT: None → reject y desconocido → reject (debe ser review en ambos)' with s03:1637-1638 'if r not in ALLOWED:' / 'return "reject"'. Its feedback, s03:1626: 'Si `None` o `Tacna` salen `reject`, aún aplicas un rechazo definitivo. En esta política, la ausencia y el valor desconocido pasan a **review**'. Plan theory[3] change list: "Add one clause that decidir_region's R-OESTE → reject is the fail-closed policy of theory[0]".

**Fix.** Change decidir_region's unknown branch to `review` so the held definition matches the section's dominant policy (the figure S03-call-return's alt text pins only 'R-NORTE' -> 'accept', so the four calls and five output lines can keep their shape with 'R-OESTE → review'), and move the fail-closed reject demonstration to T3-A-E3, whose id catalog the plan already declares closed. If the reject is kept, change T3-A-E1's DEFECT to a different error (for example `None` reaching `not in` first) so no exercise asks the learner to repair the teacher's own reference program.

### [major] S03-T1-B-E1 (s03:1064-1113)

**Problem.** The plan replaces `{}` with `()`, the empty tuple. The course has never shown that value, and the T1-B theory sitting above this exercise says the forms of empty collections belong to S06. The learner must predict `bool(())` for a literal they have never been taught, so the plan swaps one S06 construct for another. It also leans on the half-truth that 'parentheses make a tuple' (`(5)` is not one). This breaks D14 rule 1: only constructs introduced at or before the section.

**Evidence.** - Plan: 'Replacements: {} → (), set() → Decimal("0.00"), range(0) → "0"'.
- The planned values run on .venv-content 3.12 print '() → False' (8 False, then 4 True).
- s03:194 (T1-B p1): 'Las colecciones vacías también son falsy, pero estudiarás sus distintas formas en S06.'
- s02:176 introduces the tuple only through `(True, 19, None)`.
- A grep of s01-setup.ts and s02-basics.ts finds no `()` value and no «tupla vacía».

**Fix.** Replace `()` with `" "`, a one-space string. It is truthy, an S02 type, and the blank-versus-empty intake trap that T1-B p2's `not s.strip()` already names. The counts become 7 False + 5 True, so update Éxito, tests, feedback and hints; «doce valores» still holds. Only if 8+4 is required instead: add one sentence to T1-B p1 showing `()` as the empty tuple, and reword its «S06» deferral.

### [major] S03-T4-A-E2 (s03:2032-2097)

**Problem.** The plan requires "a single invariant string literal" printed first and removes the implicit adjacent-literal concatenation, but R8 caps code lines at 88 columns. The single-literal form is 106 columns, and R8's only stated escape hatch ("wrap a long tuple inside parentheses") does not apply to a string literal. The plan therefore mandates two rules the item cannot satisfy at once.

**Evidence.** Today the text is kept under 88 by the parenthesised concatenation at s03:2079-2082:
  invariant_text = (
      "ambos apellidos presentes y no vacíos → accept; "
      "uno ausente/vacío → review; ambos vacíos → reject"
  )
Measured the planned replacement on 3.12:
  106  OVER-88  T4A-E2 invariant print   → `print("ambos apellidos presentes y no vacíos → accept; uno ausente/vacío → review; ambos vacíos → reject")`
The rest of the planned item is inside the cap (open line 76, `apellido_*_vacio` lines 83, print line 86), so this is the only conflict.

**Fix.** Name the exception explicitly in R8: a single learner-facing string literal may exceed 88 columns, and this is the only place it may. Otherwise either keep a bound name with parenthesised implicit concatenation (as today) and say the concatenation stays, or shorten the invariant text to fit 88 and declare the new first output line — but then s03:2092's pinned first output line changes, which the item must state.

### [major] S03-T4-B-E3 (s03:2284-2347)

**Problem.** The plan keeps the 4 case blocks (18, 17, None, 30) 'identical to the pin', but its chain has 4 branches and no case reaches the reject branch (`edad < 0 or edad > 120`). This is the O8 subtopic's suite exercise, next to theory that says 'El else/default también cuenta' (s03:475). It breaks the plan's own R3 ('one case per branch of the chain the item teaches'). Deleting or widening the reject branch leaves the learner's suite green.

**Evidence.** s03:2291 Éxito lists only '18 → accept, 17 → review, None → review y 30 → accept'. The plan's T4-B-E3 chain is 'None → review; 18 <= edad <= 65 → accept; <0 or >120 → reject; else review'. t4b_e3.py printed 'mutant=drop_reject suite green: True | -5 -> review | 130 -> review' and 'mutant=widen suite green: True | -5 -> reject | 130 -> review'.

**Fix.** Add one reject block, e.g. (121, "reject"), which uses the second alternative so it also guards `> 120`. The solution output gains 'PASS 121 reject'; update Éxito, the tests field and the instruction's 'cuatro PASS'. Keep the fix-once starter as a single (18, "accept") DEFECT block. Optionally add a (66, "review") block, because the rule claims 65 as an inclusive boundary. D14: worth rises and the objective is unchanged.

### [major] S03-selfCheck.Q7 (s03:2565-2572) + exam bank prisma/seed.ts:792-794

**Problem.** This is O4's only self-check item, and it keeps a claim that is false once return is gone. It says that putting `if valor is None` before `if valor < 18` avoids the TypeError. That is true only when the first `if` returns. In the rebuilt S03 every rule is a top-level chain that assigns and never returns, so two separate `if`s in that order still raise TypeError; only `elif` protects. The plan says Q7 'already fits a flat funnel', which is wrong. Its assessments rescope list also misses the exam bank item on the same point.

**Evidence.** s03:2567: '¿por qué debe ir `if valor is None` antes de `if valor < 18`?' The correct option (s03:2568) reads 'Porque comparar None con < lanza TypeError; la ausencia se resuelve primero'. seed.ts:792: 'Si escribes `if edad < 18: ...` antes de `if edad is None:`, ¿qué riesgo concreto hay?' and its correct option at :794, '...la guard de ausencia debe ir primero'. The plan's selfCheck.Q7 row says 'the wording already fits a flat funnel'. Its assessments list covers :722/:723/:749/:772/:778/:782/:806/:869/:878/:935 but not :792/:794. Ran with .venv-content 3.12: `valor = None` / `if valor is None: status = "review"` / `if valor < 18: status = "review"` printed "TypeError: '<' not supported between instances of 'NoneType' and 'int'". The same code with `elif valor < 18:` printed 'review'.

**Fix.** Q7: rewrite the stem so the second test is `elif valor < 18` in the same chain (in Spanish: a chain of guards). The pinned substring 'comparar None con < lanza TypeError' is in the option, not the stem, and survives, as does correctIndex 1. Optionally add to the explanation that a separate `if` would still reach `None < 18`. That is the O4 point in the rebuilt form. Exam :792: rewrite the stem as `if edad < 18:` placed before `elif edad is None:` in one chain, keeping correctIndex 0. Add :792/:794 to the plan's exam-bank rescope list.

### [major] S03-selfCheck.Q7 (s03:2567) and exam bank :792

**Problem.** The plan says Q7's wording 'already fits a flat funnel'. It does not. The stem sets `if valor is None` against `if valor < 18`: two separate `if` statements. After the plan S03 has no early return, and theory[6] now runs the two-if overwrite to show that consecutive `if`s both evaluate. With two `if`s, putting the None check first still raises TypeError. So the keyed rationale ('la ausencia se resuelve primero') is false for the code shown, and a learner who absorbed theory[6] is penalised. Bank twin :792 ('`if edad < 18: ...` antes de `if edad is None:`', keyed answer 'la guard de ausencia debe ir primero') has the same defect and is not in the plan.

**Evidence.** s03:2567 'En un validador con guards, ¿por qué debe ir `if valor is None` antes de `if valor < 18`?'; the correct option is 'Porque comparar None con < lanza TypeError; la ausencia se resuelve primero'. I ran two scripts with .venv-content 3.12.12. With `if valor is None: …` followed by a second `if valor < 18: …` and valor = None, it printed "TypeError: '<' not supported between instances of 'NoneType' and 'int'". With the second line as `elif valor < 18:`, it printed 'review'. The plan item S03-selfCheck.Q7 says 'Guard order; the wording already fits a flat funnel.'

**Fix.** Change Q7's stem to show the absence branch first and the comparison as an `elif` of the same chain. The stem has no pin; the pin 'comparar None con < lanza TypeError' stays in the correct option, untouched. Rescope bank :792's stem the same way (`if edad < 18:` as the first branch, `elif edad is None:` after it), keeping correctIndex 0.

### [major] S03-selfCheck.Q8 (s03:2573-2580)

**Problem.** The plan's rewrite brief rests on a false premise: it asserts that «Error», «inválido» and «bad» none of them appear in the options, but «inválido» does appear, as «no es válido» in options[1]. Following the instruction literally deletes an accurate reference. The planned replacement is also a three-limb list of absences that repeats the same clause twice — a restatement close, which G2 forbids.

**Evidence.** s03:2577 options[1]: 'El campo edad no es válido; corrígelo y vuelve a enviar.' s03:2579 explanation: '… “Error”, “inválido” y “bad” solo anuncian que algo falló; obligan a adivinar la causa o leer el código.' Plan, selfCheck.Q8: «It dismisses «Error», «inválido» and «bad», none of which appear.» — «inválido» is options[1]'s own wording. The planned replacement, «record 42/E-RANGE-07 has no field, value or fix; «no es válido; corrígelo…» has no value or range; «fuera del rango…» has no value or range», repeats «has no value or range» verbatim for two of three limbs.

**Fix.** Correct the brief: only «Error» and «bad» are absent. Keep «inválido» and bind it to options[1]. Brief the explanation as one teaching sentence plus one contrast, not a three-limb audit, e.g. name what the correct option adds that the other three share the lack of (the value and the boundary), and keep the pin «obligan a adivinar la causa» as the closing clause.

### [major] S03-youDo.starterCode (s03:2370-2506)

**Problem.** The section's climax uses a weaker evidence model than the exercises that precede it. Every rebuilt weDo item shows all of its cases in one run; the You Do shows one case per run and, by the plan's own admission, loses the whole-table regression. Gradual release should end with the learner holding more evidence than in E3, not less.

**Evidence.** Plan youDo.starterCode: 'Then `caso = CASO_S02` and the two-step S02 unpacking' and, in youDo.title+context, 'run the case table one named case at a time by changing the selector line'. Plan's own stated trade-off in the same item: 'the one-command regression over all rows is lost (S04's loop can iterate this table)'. Against it, plan T4-B-E2: 'blocks `score, esperado = (...)` for 90 / 55 / 10 / 80 / 50, each running the chain, then assert status == esperado, then print(\'PASS\', score, status)' — five asserted cases in one run; plan T4-B-E3: four asserted blocks in one run. Plan objectives item: 'D14: do not claim a one-command regression.'

**Fix.** Keep the selector for the eight shipped rows, but make pass 4 require the learner to promote at least two rows into case blocks in the file — the same copy-and-edit-one-line routine the weDo taught — so at least one run asserts more than one case and the You Do is not the only item in the section whose evidence is a single row. Say in youDo.context that the selector exists because three funnels times eight rows would not fit, and that S04's loop restores the whole-table run; that sentence is also where the D14 trade-off becomes visible to the learner instead of only to the reviewer.

### [major] S03-youDo.starterCode (s03:2370-2506) + youDo.requirements[2]/[7], objectives[3], rubric 'Pruebas/ejemplos por rama'

**Problem.** The planned region funnel adds a branch, `not isinstance(region, str)` → reject BAD_TYPE, that none of the 8 shipped cases reaches. Neither of the 2 learner rows the plan requires (edad 120, edad True) reaches it either. O8 promises 'cubrir cada rama con un caso de prueba', and theory T4-B tells the learner this is the discipline of the You Do. requirements[2] demands that wrong types end in BAD_TYPE without TypeError, and the kept retrospective failure condition is 'un tipo incorrecto lanza TypeError'. Neither can be shown for region. A learner can omit the branch entirely and every case stays green. The plan still says the reworded objectives[3] and the rubric's 15% criterion are satisfied.

**Evidence.** Plan youDo.starterCode lists the region funnel 'None → MISSING, not str → BAD_TYPE, not in ALLOWED_REGIONS → review NOT_IN_ALLOWLIST, else OK' and 8 cases whose regions are Lima/Lima/Arequipa/Tacna/Lima/None/Piura/Cusco (the originals are at s03:2462-2489). Prototype youdo_cov.py, which implements the plan's three funnels and runs the 8 cases, printed "8 shipped cases, uncovered: ['region:BAD_TYPE']". With the learner rows edad 120 and True it printed "uncovered: ['region:BAD_TYPE']". region_mut.py printed '8 cases identical with branch omitted: True'. Without the branch, region 5 gives ('review','NOT_IN_ALLOWLIST'), and region ['Lima'] gives "TypeError: unhashable type: 'list'". s03:2364 reads 'los tipos incorrectos se rechazan sin lanzar TypeError'.

**Fix.** Add a ninth named case with a non-text region and an int for the other fields, e.g. a CASO_REGION_TIPO row (30, 51, 100) whose expectations are accept OK / reject BAD_TYPE / accept OK / registro reject. Add it to the prediction key (the starter's region DEFECT then fails that case's assert) and to requirement [7]'s coverage list. Alternatively, make one of the two learner-designed rows a region-type row. Update the test_you_do_oracle rescope pins to include the new tuple. Do not claim objectives[3] or the rubric criterion are met until every one of the 17 branches has a case.

### [major] S03-youDo.title+context, youDo.starterCode opening comment, youDo.portfolioNote, theory[0] callout

**Problem.** The plan removes every learner-facing statement that S03's You Do is an increment of the cumulative project, and it calls this S02's precedent. S02 dropped only the label: it kept the increment framing, and its contract test still pins what S02 owes the project. After the plan, S03 would be the only S01-S04 section that does not present itself as a step of the project. Meanwhile S01 promises the project spans S02-S04, three capstone artifacts list S03 as a contributing increment, and S04 builds on 'las reglas de S03'. The plan's own ask_first says 'whether S03 remains an increment' is the owner's call, but these deletions decide it now. Removing S03 from the project is Ask-first ('moving a project between sections', AGENTS.md).

**Evidence.** S02 keeps the framing at s02:2155 ('En este incremento del mismo proyecto trabajarás…') and in the starter at s02:2174 (`"""captura_cliente.py — incremento de S02`). The S02 test docstring, test_s02_independent_contract.py:51-57, reads 'S02's increment is the raw/clean/value walk … What S02 still owes the project is pinned here'. S01 promises the span at s01:1907 ('Prepara el esqueleto CP-N1-A para S02–S04') and s01:70 ('el proyecto acumulativo que cerrarás en S04'). Three artifacts list S03 as contributing: catalog.ts:59 `mk('CP-N1-A',…,'S04',['S01','S02','S03','S04'],…)`, capstone_validation/reality/section_capstone_mapping.json:25-32 (S03 has "artifactRole": "project_increment") and gate.json:62-66 (dependencies S01-S04). S04 builds on S03 at s04:1800 ('Sobre el parser de S02 y las reglas de S03'). The plan's youDo item says 'Title: drop «(incremento CP-N1-A)»… The closing sentence makes no CP-N1-A increment claim', and its starter item says 'no «incremento CP-N1-A»'. Neither item keeps an increment sentence.

**Fix.** Follow S02 exactly. Drop only the label 'CP-N1-A'. Keep a 'same project increment' sentence in the youDo context and 'incremento de S03' in the starter's opening comment. In portfolioNote, keep a reviewer at the S04 gate without naming the capstone. Add a pin to the S03 youDo test for what S03 hands the project: CASO_S02's values, the per-field three names and registro_status. Leave de-listing S03 to the owner, as the plan's ask_first already says.

### [major] SECTION

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

### [major] SECTION

**Problem.** Across the R5(a) items the learner's hand-transcription now dwarfs the conceptual work, and in one case the plan's own R5 principle is inverted. The effort a beginner spends is no longer proportional to what they learn: the part that teaches takes a keystroke, the part that takes the hour teaches nothing.

**Evidence.** S03-T3-A-E2: today the starter holds the whole chain and the loop, and the entire repair is one character — `s03:1692 if m <= 0:` → `if m < 0:` — with five rows of evidence printed on the first run (`s03:1698 for m in [None, -1, 0, 1200, 60000]:`). The plan makes the starter "one block at 0 with `elif monto <= 0`" and the solution seven blocks (None, -1, 0, 1200, 60000, 50000, 50001), so the same one-character repair now ships with six hand-copies of a nine-line chain (~54 transcribed lines).
S03-T1-B-E1: today's solution is three lines (s03:1097-1099). The plan is "12 two-line blocks" (~36 lines) and "The starter holds every block with `v is not None`" — i.e. twelve byte-identical repairs, against the plan's own "R5. A starter never asks for the same repair twice." The exception list gives a reason for T1-A-E2 ("The second allowed code makes the defect visible") and none for T1-B-E1.
The constraint cited for keeping twelve ("'doce valores' stays true") is not a pin: `grep -rn "doce valores" tests/adversarial/` returns nothing; the only pin on that retrospective (s03:1083) is 45 words plus a cue.

**Fix.** Apply R3's own escape instead of literal branch-coverage-by-copy: one block per branch of the chain the item teaches, every extra value a named prediction run by editing the opening line. T3-A-E2 → four blocks (None, -1, 0, 60000) with 1200/50000/50001 as named predictions. T1-B-E1 → blocks for the ideas its own retrospective names (ausencia, cero, colección vacía, colección no vacía) plus "0"/`[0]`, with the remaining values as predictions, and reword the retrospective off 'doce valores'.

### [major] SECTION

**Problem.** The reading load of the I Do stage and of the playground roughly doubles, and by R1 every added line is an exact duplicate. An iDo demo is the teacher's worked example, where the teacher controls the length; making the learner read the same eleven-line chain five times is not the honest cost of not having a loop, it is a choice. The playground is worse: it is the one surface where the learner edits a rule, and the rule now lives in three places while the plan keeps the old hint.

**Evidence.** Today's six demos the plan sizes: 23 + 14 + 17 + 15 + 47 + 40 = 156 lines (measured from the file). The plan's own stated sizes: T1-B-DEMO 46, T2-A-DEMO 35, T2-B-DEMO 64, T3-A-DEMO 49, T3-B-DEMO 87, T4-B-DEMO 67 = 348 lines, 2.2x. T3-B-DEMO at 87 becomes the longest program in S03 against today's maximum of 47.
Playground: I wrote the planned version to the plan's spec and ran it under .venv-content 3.12 — output matches the plan's claim (A accept/accept, B review MISSING / review NOT_IN_ALLOWLIST, C reject OUT_OF_RANGE / accept). Measured: 62 lines against today's 28 (SectionView.tsx:1070-1101); 42 of 50 non-blank lines are the two rule chains, of which only 13 lines are unique text. The plan says "Keep the hint (it already says to edit a value and predict)" — but that hint (SectionView.tsx:1101) tells the learner to change a value, and never warns that changing the rule now means three identical edits, with a divergent copy as the silent failure.

**Fix.** Cap an iDo demo at the contrast pair plus named predictions — the pattern the plan already sanctions for theory[8] ("Blocks `region, edad = (\"R-FUERA\", 30)` and `(\"R-COSTA\", 15)` … Predictions: R-NORTE 30, None 40, R-FUERA 15") — and leave exhaustive branch coverage to the places that check it: the asserted T4-B items and the You Do case table. For the playground, keep two blocks, and rewrite the hint to say that a rule change must be repeated in every block and that a divergent copy is the first thing to check when two cases disagree.

### [major] SECTION

**Problem.** Convention (c)'s stale-name rule lists the fields it binds, and the list omits `instruction`, `paragraphs`, `tests` and `edgeCases`. Because the rule is the plan's only mechanical guard for this class, every stale function/list/loop name in an unlisted field survives unless an item happens to catch it — and at least three do not.

**Evidence.** Plan, convention (c): «No title, description, preamble, hint, feedback, retrospective or header comment names a function, loop or list that the code does not contain (validate_record, _run_tests, classify_score, examples, cases, «el bucle»).» Sites the omission leaves behind: (1) s03:1974, T4-A-E1 instruction, «1. Añade guard de tipo (`isinstance`) al DEFECT.\n2. Define `examples` como lista de dicts `{value, expected}`.\n3. Recorre examples, imprime valor, got y comparación booleana.» — the plan's T4-A-E1 item rewrites hint, hints[1], edgeCases and feedback and never mentions `instruction`, yet the new design has no `examples` list and no loop; (2) s03:2106, T4-A-E3 instruction, «2. Implementa fixed con guards (None, tipo, rango, menores, banda 18–65).» — the plan's T4-A-E3 item touches only preamble and feedback, leaving `fixed` named as a callable; (3) s03:333, theory paragraph, «`ALLOWED_REGIONES = {"R-NORTE", "R-SUR", ...}`», a constant defined nowhere.

**Fix.** Extend convention (c) to «no paragraph, title, description, preamble, instruction, hint, hints, feedback, tests, edgeCases, retrospective or header comment names an identifier, loop or collection the code does not contain», and add the three sites above to the item list explicitly (T4-A-E1 instruction, T4-A-E3 instruction, theory[8] p1).

### [major] SECTION

**Problem.** Nine passages are briefed to codex as word budgets with no statement of what the replacement must teach. «Replace, do not delete», «with the same number of words», «without losing words» and «pad the distractors» are instructions to produce filler at a fixed length — exactly the assistant register G2 names (scaffolding, restatement, over-qualification) and the G3 regression (longer, flatter, less quotable, gates still green).

**Evidence.** Plan, S03-T2-A-DEMO: «Replace «Corre el bucle» with the same number of words.» plus «Words: preamble 56 (floor 50; replace, do not delete)» — a word count with zero content brief. S03-T4-A-DEMO: «replace … with the four case blocks, each with its esperado, without losing words» / «why 36 (floor 35; replace, do not delete)». S03-T4-B-DEMO: «preamble 53 (floor 50: removing the ~9-word `_run_tests` sentence breaks it unless replaced)». S03-T1-A-E2: «Retrospective 46 words (floor 45): replace words, do not delete». S03-T4-B-E1: «Retrospective 46 words (floor 45; replace, do not delete)». S03-T2-B-E3: «Retrospective 47 words (floor 45; thinnest)». S03-T3-A-E3: «Retrospective 48 words, '¿' (floor 45)». selfCheck Q2: «Pad the distractors to comparable detail.» selfCheck Q7: «Remove the length cue (75 vs 48–52 characters) by padding the distractors, not by cutting the correct option.» — measured: Q2 options are 71/31/22/33 characters, Q7 are 48/75/52/49, and the plan forbids the only non-additive remedy.

**Fix.** For each at-floor passage, name the teaching content of the replacement, not its length: what the new sentence must make the learner able to do. For Q2 and Q7, brief the distractors by the misconception each one encodes (e.g. Q7's «más rápido de comparar» → the speed misconception stated as a full wrong rule), so the added characters carry a wrong model the learner can reject, rather than padding.

### [major] SECTION

**Problem.** The plan's test inventory names only the glossary-first-use RATCHET and never `tests/adversarial/glossary-first-use.test.mjs`, which is an absolute gate (`assert.deepEqual(late, [])`, no owed count) over `paragraphs:` prose. The round rewrites more S03 theory prose than any other dimension, and three glossary terms declared after S03 are one unbackticked word away from hard-failing it.

**Evidence.** tests/adversarial/glossary-first-use.test.mjs:63-88 — scans only `paragraphs:` arrays (`proseOf`), matches the `term` field with `(?<![\w\`])term(?!\w)` case-insensitively, and ends `assert.deepEqual(late, [], 'terms whose hint is withheld until after first contact')`.
I reproduced it exactly against the repo: `STRICT late: []` today.
terms.ts firstSectionId values: `return` → 'functions-contracts' (S05); `Tipo de dato` → 'collections' (S06); `Desempaquetado` → 'collections' (S06).
My scan of prose by section: S01 0, S02 0, S03 0, S04 0, S05 0 unbackticked `return`; and 0 occurrences of any S04+ term in S03 prose today (`grep -in "tipo de dato|tipos de datos" s03-decisions-rules.ts` → no matches).
The plan rewrites exactly the paragraphs that discuss these: theory[0] p3/p5, theory[3] p3/p4 + callout ("inside a function it is returned"), theory[6] p3 ("assign one status per field instead of «devolver»"), theory[7] p1/p4 ("«el else final» replaces «el último return»") and the new sentence tying the tuple rows to S02's `ok, edad, error = resultado`, theory[10] p3 ("branches assign status/code/message instead of «Usa returns»"), plus a `tipo` field and type-guard prose in T1-A-E2, T3-A-E3, Q5 and the youDo.

**Fix.** Add `tests/adversarial/glossary-first-use.test.mjs` to DO-NOT-RESCOPE, and add one writing rule to the convention: inside `paragraphs:` strings, S03 may write `return` only backticked, and may not write «tipo de dato», «tipos de datos» or «desempaquetado/desempaquetar» at all (say «qué clase de valor es» and «asigna los dos nombres en una línea»). Re-run this gate before the round closes, not only the ratchet.

### [major] SECTION

**Problem.** The plan fixes stale prose (function names, `return`, dicts, `bucle`) item by item and misses at least four instruction and preamble strings in items it rebuilds. After the round those items would instruct the learner to return a value, rewrite a function and run a loop in code that contains none of the three. This is the second occurrence of the class the plan already addresses with a code-level guard, so the instance list is the wrong instrument.

**Evidence.** S03-T1-B-E3, s03:1168: '1. Sustituye `if not m: return "reject"`. … 5. Prueba el bucle dado y compara la salida.' — the plan item for T1-B-E3 lists only solution blocks, starter, m→monto, an optional hint, the feedback CP-N1-A drop and the retrospective. S03-T2-B-E1, s03:1405: '3. Devuelve dicts `{status, code}` (no un solo `"BAD"`).\n4. Prueba con `repr(e)` los cuatro valores del bucle.' — the plan item mentions only the added reorder step and the title/preamble. S03-T4-A-E2, s03:2040: '1. Reescribe `validate_apellidos` (el DEFECT rechaza cualquier falta). … 3. Arma tres ejemplos (`accept` / `review` / `reject`) y compruébalos en un bucle.' — not in that item's change list. S03-T4-B-E2, s03:2223: '- **Meta:** armar `cases` con `expected` y un bucle que use `assert` e imprima `PASS` sobre `classify_score`.' — the plan removes «Arma cases = [...]» and «no borres la función», not this string.

**Fix.** Extend the proposed NEW practice-guard test in tests/adversarial/test_s03_independent_contract.py from code to prose: for every theory block, iDo step and weDo step, assert that title, description, preamble, instruction, hint, hints, edgeCases, tests, feedback and retrospective contain none of `def `, `return`, `bucle`, `dict`, `función`/`funciones`, and no `nombre(` call syntax, unless the item is theory[3]. Baseline it on today's file (it must fail on s03:1168, 1405, 2040, 2223 among others), then let the sweep be mechanical instead of enumerated.

### [major] SECTION

**Problem.** Convention (b) states the result shape as universal ("The decision and its cause travel as one tuple row per branch"), but roughly half the rebuilt items carry `status` alone, and the plan gives no rule for which. Inside a single subtopic the gradual release inverts: T3-A's theory and demo print a code, its first two exercises do not, and its third does again.

**Evidence.** Plan (b): 'The decision and its cause travel as one tuple row per branch: `status, code = ("reject", "OUT_OF_RANGE")`.' Plan theory[8] (T3-A): output 'R-FUERA 30 → review NOT_IN_ALLOWLIST'; plan T3-A-DEMO: '(status, code) rows (49 lines; verified: accept OK, review NOT_IN_ALLOWLIST, reject OUT_OF_RANGE, review MISSING)'. Plan T3-A-E1: 'Pinned output byte-identical (\'Lima → accept\', \'Tacna → review\', \'None → review\')' — status only. Plan T3-A-E2: 'The chain: None → review; <0 → reject; >50000 → review; else accept' — status only. Plan T3-A-E3: 'Fail-closed chain (R6 variant) with tuple rows' — codes again. Same split across the section: T1-B-E3, T2-A-E1/E2/E3, T2-B-E2, T3-B-E1/E2/E3 keep status alone while T2-B, T4-A-E1, T4-B-* carry codes.

**Fix.** Add one sentence to convention (b) that fixes the boundary and state it once in the prose: `status` alone through T2-A (the learner is still learning exclusivity), `status, code` from T2-B onward wherever the item's claim is about causes. Then make T3-A-E1 and T3-A-E2 carry codes so the We Do is not thinner than the I Do it follows (T3-A-E1's three pinned lines would gain a code column; the plan already accepts an output change in T3-A-E2), or, if the pins must hold byte-identically, drop the codes from T3-A-DEMO so the demo does not model a shape the exercises never ask for.

### [major] SECTION

**Problem.** R6 declares one chain shape for the section — funnel, happy path in the final `else` — and lists exactly one sanctioned variant, but every T2-A item (the first chains the learner ever writes) is threshold-ordered with the happy path FIRST and `reject` as the default. R6 names no exception for it, and T2-B's theory is planned to say plainly that the happy path sits in the final else, contradicting the code the learner wrote one subtopic earlier.

**Evidence.** Plan R6: 'The chain shape is the funnel: absence → type → range or catalog → review thresholds → accept, with the happy path in the final `else`. The one sanctioned variant, for acceptance that depends on a combination, is explicit accept rows with a reject default.' s03:256-261 (kept in substance by plan theory[6], T2-A-DEMO, T2-A-E1): 'if score >= 80:' / 'return "accept"' / 'elif score >= 50:' / 'return "review"' / 'else:' / 'return "reject"'. Plan T2-A-E3 keeps the same ordering for four bands ('alto/medio/bajo/nulo', strictest threshold first). Plan theory[7]: 'p4: «el else final» replaces «el último return», and say plainly that the happy path now sits in the final else.'

**Fix.** Rewrite R6 to name two sanctioned shapes and bind each to a subtopic: (1) the validation funnel — absence, type, range/catalog, review thresholds, accept last — used from T2-B onward; (2) ordered banding — most demanding threshold first, default last — used in T2-A, where the subject is a single score with no impossible values. Then reword theory[7] p4 as a contrast with T2-A ('a banding chain orders by threshold; a validation chain orders by what can break, so here the happy path moves to the end') instead of a flat rule the learner has already seen broken.

### [major] SECTION

**Problem.** R4 claims one evidence-line format for the section, then the plan's own items ship at least four. Subtopic T4-A alone prints three different shapes for the same idea (input, result, expectation), so the learner cannot read an S03 output line by habit.

**Evidence.** Plan R4: 'The evidence line prints the input and the result names, separated by `→`.' Plan theory[10] (T4-A): 'Print repr(contacto), →, status, ok=, status == esperado.' Plan T4-A-E1: 'print(repr(edad), status, status == esperado)' — no arrow, no label. Plan T4-A-E2: 'Print repr of both names, →, status, status == esperado' — arrow, no label. Plan T4-B items: 'print(\'PASS\', score, status)'. Also without the arrow: T2-A-E2 'print(score, \'bad=\', status_bad, \'good=\', status_good)', T2-B-E2 'print(repr(monto), status_nested, status_guards, \'ok=\', ...)', T3-B-DEMO 'print(code, status_if, status_match, \'same=\', ...)'. None of these appears under the convention's "Named exceptions", which cover block structure only.

**Fix.** Replace R4's single rule with three named evidence lines and assign each a purpose: (E-a) `<input> → <status> [<code>]` for items that only classify; (E-b) `<input> → <result> ok= <bool>` for items that compare against an expectation in prose; (E-c) `PASS <input> <code>` after an assert. Then bring T4-A-E1 and T4-A-E2 onto E-b (both already print the comparison; adding the `ok=` label costs no pinned output, since neither item's output is pinned byte-identical in the plan) and list T2-A-E2, T2-B-E2 and T3-B-DEMO under E-b as comparison variants with their own label word.

### [major] SECTION

**Problem.** The handoff into S04's opening breaks. S04's first subtopic names `validate_record` as the base pattern to call inside the loop, and S04's You Do tells the learner to reuse S03's logic as a dict of fields — both referents disappear from S03 in this round. The plan dismisses this as "nothing dangles" on the grounds that S04 defines its own, which answers definition but not continuity: the learner arrives in S04 with eight tuple constants and three loose names per field.

**Evidence.** s04:103: 'En lotes de clientes sintéticos, el patrón base es `for registro in filas:` y, más adelante en el You Do, llamar a `validate_record` dentro del bucle.' s04:1826-1832: 'def validate_record(record: dict[str, Any]) -> dict[str, Any]:' / '"""Reutiliza lógica tipo S03: status global + detalle por campo.' / '# TODO: devolver {status, fields} con accept|reject|review por campo (S03)'. Plan youDo.title+context: 'No `{status, code, message}` braces and no validate_record'; plan (b): 'Never a dict, a semicolon or a numbered result name.' Plan open_questions: 'Downstream, not in scope: s04:103 and S04's youDo define and call their own validate_record (s04:1826), so nothing dangles.'

**Fix.** Do not leave this to the S04 round's discretion. (1) End S03's youDo.context with one sentence naming the handoff in S03's own vocabulary: the case table and the three names per field are what S04 will iterate, and what S06 will pack into one value — this is the same bridge S03 already receives from S02 at theory[0] p2. (2) Record both exact strings (s04:103 and s04:1826-1832) in WORK_QUEUE as binding on the S04 route-2 round, alongside the monto-type decision the plan already defers there, so the reuse claim is repointed rather than silently orphaned.

### [major] SECTION

**Problem.** One catalog appears under four constant names and two disjoint value sets, and convention (c) ratifies three of the four instead of unifying them. The set's membership also differs between two theory blocks, so a prediction learned in T1-A is wrong in T3-A.

**Evidence.** Four spellings: s03:89 and s03:131 and s03:558 and s03:1633 'ALLOWED = ...'; s03:333 prose 'ALLOWED_REGIONES = {"R-NORTE", "R-SUR", ...}'; s03:342 and s03:712 'ALLOWED_REG = ...'; s03:2377 'ALLOWED_REGIONS = {"Lima", "Arequipa", "Cusco", "Piura"}'. Two vocabularies: theory and the T1 demo use R-codes (s03:89 '{"R-NORTE", "R-SUR", "R-CENTRO"}'), every demo and exercise from T3-A on uses city names (s03:712 '{"Lima", "Arequipa", "Cusco", "Piura"}'). Membership differs across theory blocks: s03:89 has three members, s03:342 has four ('R-COSTA' added), so `"R-COSTA" in ALLOWED` is False at T1-A and True at T3-A. Plan (c): 'Keep ALLOWED, ALLOWED_REG and ALLOWED_REGIONS.' The prose spelling ALLOWED_REGIONES is not mentioned anywhere in the plan.

**Fix.** Use ALLOWED_REGIONS everywhere for the region catalog (it is the name the You Do and the playground already pin) and reserve ALLOWED_ID for T3-A-E3's id catalog; fix s03:333's prose to the same spelling. Keep the two value vocabularies only if theory T3-A adds one clause saying the code catalog of T1-A and the named catalog of the demos are the same rule over different data, and align the T1-A and T3-A member lists (or state in T3-A that the catalog grew, which is itself the point of the review policy).

### [major] SECTION (convention (c) and the rows for S03-T1-B-E3, T2-B-E1, T3-B-E1, T3-B-E3, T4-A-E1, T4-A-E2, T4-B-E2)

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

### [major] SECTION (exam bank prisma/seed.ts:644-990) / assessments

**Problem.** In the S03 exam bank, the correct option is the longest of the four in 23 of 24 items, often 2 to 5 times longer than the others. Always picking the longest option passes every S03 attempt without any Python knowledge. The plan treats option length as a defect, but only fixes it in self-check Q2 and Q7; it keeps every bank item's options and correctIndex and never mentions the bank's length cues.

**Evidence.** I ran the repo's own parser (exam_selfcheck_pedagogy_audit.parse_seed_questions) on seed.ts lines 644-990 and compared option lengths. Result: 'correct strictly longest: 23 / 24'. Examples of correct-option length vs the longest distractor: item 21 (:955) [5, 8, 4, 42] → 5.25x; item 18 (:907) [23, 19, 83, 19] → 3.61x; item 11 (:806) [19, 54, 20, 16] → 2.7x; item 6 (:739) [42, 36, 109, 35] → 2.6x. The only exception is item 1 (:664, '1000 <= monto <= 2000'). The pass mark is 70 (src/lib/exam-scoring.ts:8: PASS_THRESHOLD = 70), and each attempt draws one question per concept, 8 in total (route.ts:172-206). So the longest-option strategy scores 7/8 or 8/8 on every attempt. The plan's assessments section only says 'Q2 and Q7: pad the distractors to remove the length cues'.

**Fix.** Add a bank-wide length-cue pass to the assessments section. For every item where the correct option is more than about 1.3x the longest distractor, rewrite the distractors so each one states a believable misconception at similar length and detail. Keep the correctIndex, the concept and the per-concept distinct positions. Add a check (in the new S03 assessment test) that the correct option is the strict longest in at most about 1/3 of items, and that it fails on today's 23/24.

### [major] SECTION (open_questions, last bullet: 'Downstream, not in scope … so nothing dangles'; and ask_first 'CP-N1-A placement')

**Problem.** The Level-1 capstone gate at S04 depends on what the learner has done by the end of S03, and the plan changes that without saying so. Today S03's practice has the learner write or repair per-field validation functions that return a dict. CP-N1-A's closing You Do at S04 is built on reusing exactly that. The plan removes every def, return and dict from S03 practice. Its own theory[3] and weDo.intro edits then tell the learner that functions arrive in S05. Yet the plan says 'nothing dangles', and its ask_first describes the round as only removing labels ('This round only drops S03's learner-facing «incremento CP-N1-A» claims'). After this round, the N1 gate asks the learner to 'reuse' an S03 function that S03 no longer has them write, and to implement three annotated functions they have never practised. That trade-off is absorbed, not stated.

**Evidence.** S04 is the CP-N1-A gate: catalog.ts:59 `mk('CP-N1-A',…,1,'S04',['S01','S02','S03','S04'],[],['S01','S02','S03'], … 'intake_cli.run(records) -> IntakeResult'` (level 1, gate S04, prerequisites S01-S03), rendered to learners at CapstonesPage.tsx:342-346. s04:1798 title "Client Intake & Data Quality Script (cierre CP-N1-A)". s04:1800 says "Sobre el parser de S02 y las reglas de S03 … implementa las tres funciones hasta ver `tests OK`". s04:1805 objective "Reutilizar validación tri-estado por campo (S03)". s04:1826-1830 starter: `def validate_record(record: dict[str, Any]) -> dict[str, Any]:` / "Reutiliza lógica tipo S03: status global + detalle por campo." / `# TODO: devolver {status, fields} con accept|reject|review por campo (S03)`. CP-N1-A/RUBRIC.json weights maintainability 0.25 on "Diseño limpio, modular, testeable". S03 today, counted with grep -o 'def [a-z_]*(': 9 defs in theory, 8 in iDo, 44 in weDo (s03:918-2348), 6 in youDo (s03:2350-2518). The plan keeps only theory[3]'s decidir_region. The plan's own youDo trade-off says 'reuse needs S05, and a single result object needs S06', and its theory[3] p4 change says S05 turns a rule into a function.

**Fix.** Move the S04 bullet out of 'Downstream, not in scope' and into ask_first under CP-N1-A placement, and delete 'nothing dangles'. State the trade-off in plain terms: until S04's route-2 round or CP-N1-A re-gating lands, the N1 gate at S04 asks for three def/dict functions and 'reuse' of S03 validation that S03 no longer practises. List s04:1798, 1800, 1805 and 1826-1853 as the affected sites. Alternatively, make landing S03 together with the S04 round (or the re-gating decision) an explicit sequencing precondition of this round.

### [major] SECTION — convention (a) R3 and the "derived consistency rule" (`not isinstance(edad, int) or isinstance(edad, bool)`)

**Problem.** R3 requires a non-first alternative for every OR arm ("a first alternative survives deleting the `|`"), but the plan inserts `or isinstance(edad, bool)` into roughly seven programs and ships a case that exercises it in exactly one (theory[11] T4-B). The same holds for `edad < 0 or edad > 120`: every site ships only a negative value. The plan's own preserves text for T2-B-DEMO claims a behavioural change ("Today True gets NEEDS_REVIEW; the bool exclusion now sends it to BAD_TYPE") that its shipped case list — None/"25"/200/15/30 — cannot show.

**Evidence.** T2-B-DEMO, planned five blocks, 64 lines, with and without the bool exclusion:
  == with bool exclusion            == MUTANT: bool exclusion dropped
  None → review MISSING             None → review MISSING
  '25' → reject BAD_TYPE            '25' → reject BAD_TYPE
  200 → reject OUT_OF_RANGE         200 → reject OUT_OF_RANGE
  15 → review NEEDS_REVIEW          15 → review NEEDS_REVIEW
  30 → accept OK                    30 → accept OK
Identical. Same result for theory[7] (blocks None/30), T2-B-E1 (None/"25"/15/30/130), T4-A-E1 (30/-1/None/"x"), T4-A-E3 (15/None/30), T4-B-DEMO (None/"x"/-5/35) — none ships a bool. The range OR is unprotected even where the plan verified the others: on the planned T4-B theory prototype (67 lines, max 88 cols) the two plan-named mutants go red, but a third does not —
  == MUTANT drop bool exclusion | rc=1 | AssertionError
  == MUTANT edad <= 0 | rc=1 | AssertionError
  == MUTANT drop 'or edad > 120' | rc=0 | all PASS

**Fix.** Apply R3 to the two OR arms wherever the consistency rule is inserted: add a `True` block (expected `reject BAD_TYPE`) to T2-B-DEMO, T2-B-E1, T4-A-E1 and T4-B-DEMO, and an over-120 block (130/200) wherever only a negative value is shipped. Where the owner refuses the extra output lines, state per item in the constraints that the added alternative is a documentation row with no case behind it — the same honesty the plan already applies to the T3-B NOT_IN_ALLOWLIST arm under the R3 refinement — and drop the T2-B-DEMO preserves sentence about True.

### [major] ask_first (monto type: Decimal or int) + S03-youDo.starterCode CASO_S02

**Problem.** The monto-type ask-first offers two options, and each one breaks one edge of the project chain. With int, S02's handed-over money becomes BAD_TYPE, so CASO_S02 cannot carry S02's value and 'S02 PASS' only holds with a made-up monto. With Decimal, every monto_ingreso fixture in S04's You Do becomes BAD_TYPE → reject. That includes row 0's int 0, which is exactly S03's valid-zero lesson. The plan says only 'S04 must follow' and 'Both variants pass all 8 youDo cases'. It never gives CASO_S02's values, so the S02 continuity it claims is not guaranteed.

**Evidence.** S02 pins Decimal money as the handoff. s02:2197 has `monto = Decimal(monto_clean).quantize(...)`, s02:2211 has `assert monto == Decimal("150.50")`, and tests/adversarial/test_s02_independent_contract.py:63 pins it ('money is Decimal, built from text'). S04 fixtures use int values: s04:1855-1857 are `"monto_ingreso": 0`, `10` and `-1`, and the demo has 100 and 50. I ran the plan's youDo monto funnel under .venv-content 3.12 with each guard:
int     S02 monto Decimal('150.50') ('reject', 'BAD_TYPE') | S04 int fixtures ['OK', 'OK', 'OUT_OF_RANGE', 'OK', 'OK'] | True ('reject', 'BAD_TYPE')
decimal S02 monto Decimal('150.50') ('accept', 'OK') | S04 int fixtures ['BAD_TYPE', 'BAD_TYPE', 'BAD_TYPE', 'BAD_TYPE', 'BAD_TYPE'] | True ('reject', 'BAD_TYPE')
both    S02 monto Decimal('150.50') ('accept', 'OK') | S04 int fixtures ['OK', 'OK', 'OUT_OF_RANGE', 'OK', 'OK'] | True ('reject', 'BAD_TYPE')
In the plan, CASO_S02 is named but given no values ('Eight named case tuples … CASO_S02, …'; 'Prediction key … S02 PASS').

**Fix.** Add a third option to the ask-first that keeps both edges: `not (isinstance(monto_ingreso, int) or isinstance(monto_ingreso, Decimal)) or isinstance(monto_ingreso, bool)` → BAD_TYPE. It uses only S02's isinstance (s02:206) and S03's `or`, and it passes the verification above. For each option, say which edge it breaks. Fix CASO_S02's values as S02's pinned value column (edad 28, monto Decimal("150.50")), and state that region is new in S03. Pin that tuple in the rescoped youDo test as 'what S03 owes the project', the way test_s02_independent_contract pins S02's handoff.

### [major] ask_first: CP-N1-A placement

**Problem.** The ask-first lists three BRIEF problems: «estructuras de datos», amount=0 → warn, and «lista de registros (dicts)». It misses CP-N1-A claims that the plan itself moves later or contradicts. (a) The gate grades function-writing, which the plan removes from all of S03's practice and tells learners arrives in S05. (b) CP-N1-A's reference classify() teaches the opposite of S03's policy. It tests presence by truthiness, which S03 teaches as the defect. It accepts True as a valid amount, which the plan's consistency rule sends to BAD_TYPE. It classifies every Decimal, including S02's money and the plan's recommended valid zero Decimal("0.00"), as error. The capstone gated at S04, with S03 contributing, would therefore grade against S03.

**Evidence.** course-state/capstones/CP-N1-A/gate.json:45 has "focus": "Funciones pequeñas, reglas centralizadas, sin secretos." and gate.json:42 has maintainability level "2": "Módulos/funciones claros y legibles." (gate_rule: 'ningún criterio crítico < 2'). WEDO.md:5 reads '1) Escribir juntos la función classify().' catalog.ts:59-62 has the interface 'intake_cli.run(records) -> IntakeResult'. demo.py:24 has `if not row.get("id") or …` and demo.py:29 has `if not isinstance(amount, (int, float)):`. I ran demo.classify under .venv-content 3.12 with the other fields valid:
Decimal('150.50') -> error
Decimal('0.00') -> error
True -> ok
0 -> warn
None -> error

**Fix.** Extend the CP-N1-A ask-first item and cite each site: gate.json:42/45, WEDO.md:5 and the catalog interface as function claims that S03 no longer practises (and that route 2 moves to S05); demo.py:24 as truthiness-as-presence; demo.py:29 as bool accepted and Decimal rejected. Route each through D11 (primer → rewrite → move). Tie the plan's Decimal recommendation explicitly to demo.py:29, which rejects Decimal outright. Do not edit the capstone files this round.

### [major] exam bank :749 (if-elif-else variant 2)

**Problem.** The plan rescopes :749 into 'a top-level chain that assigns status'. The exam UI renders the stem as plain text in one <p>, so the chain has to stay on one line with semicolons, and that is invalid Python. Today's stem is also invalid. Because of that, the distractor 'Error de sintaxis en elif' is a defensible answer next to the keyed 'accept y review'. That breaks the bank's own one_best_answer rule, and the plan does not address it.

**Evidence.** seed.ts:749 'Con `def classify(score): if score >= 80: return "accept"; elif score >= 50: …`'; distractor :753 'Error de sintaxis en elif'; correctIndex 3. ExamView.tsx:291 renders `<p className="text-sm font-medium text-foreground">{q.question}</p>` as plain text, not a code block. I ran ast.parse under .venv-content 3.12.12 on the stem forms. It printed 'current_749 SyntaxError: invalid syntax' and 'planned_749_toplevel SyntaxError: invalid syntax' (for 'if score >= 80: status = "accept"; elif score >= 50: status = "review"; else: status = "reject"'). course-state/s03_phase5_exam_bank.json:22 has '"one_best_answer": true'.

**Fix.** Write the :749 chain in prose, naming each branch's condition and status in order, not as one-line code. Replace the 'Error de sintaxis en elif' distractor with a boundary misconception, for example 'accept y accept (50 cumple la primera condición)'. Keep correctIndex 3. Apply the same rule to any rescoped stem that shows a compound statement (:878's match/case).

### [major] exam bank :925, :926, :907, :944, :982

**Problem.** The bank grep in the plan still misses learner-facing sites of the same class it is removing. (1) :926 is the keyed correct answer, and it says business rules «deben devolver status/code/message». That is the function-return, one-result-object form that the plan removes everywhere else: theory[3] p4 now says S05 turns a rule into a function that returns it, and the T4-B-DEMO preamble's «devuelve `{status, code, message}`» becomes three names. (2) The plan removes S03's learner-facing CP-N1-A claims from 7 section sites, but the bank keeps them: stem :907 «usable en el gate», where S03 itself never uses the word 'gate' (grep: 0), and explanation :944 «el gate CP-N1-A». (3) The plan changes the dict distractor at :869, but distractors naming other untaught constructs stay: :925 'assert siempre lanza KeyError' (KeyError appears 0 times in S01-S03) and :982 'Silenciar el else con except: pass' (a try/except construct, D10).

**Evidence.** seed.ts:926 'python -O desactiva asserts; las reglas de negocio deben devolver status/code/message' (correctIndex 3 at :928). :930 explanation 'El motor de reglas expone status/code/message'. :907 '¿Qué falta para que sea usable en el gate?'. :944 'El camino feliz solo no basta para el gate CP-N1-A.' :925 'assert siempre lanza KeyError'. :982 'Silenciar el else con except: pass'. `grep -c KeyError` on s01/s02/s03 prints 0/0/0. `grep '\bgate\b'` on s03-decisions-rules.ts gives no match. I ran a regex (return|def|dict|devolver|validate_|for..in|KeyError|except|CP-N1-A|gate) over :644-990. It flags every planned site, plus MISSED sites at 925, 926, 944 (twice) and 982. The plan's list covers only 722, 723, 749, 772, 778, 782, 806, 869, 878, 907 (deferred) and 935.

**Fix.** Add these to the bank rescope, keeping each correctIndex. :926 becomes: python -O disables asserts, so a business rule must set its decision in names the program checks (status, code, message). :930 is aligned to match. Drop the gate wording from :907 separately from the 9-digit ask-first; the stem then asks what makes the invariant verifiable. Remove 'CP-N1-A' from :944. :925 and :982 get distractors built from S02/S03 misconceptions, for example 'assert only works with int', or silencing the else with a print.

### [major] open_questions: 'Downstream, not in scope: s04:103 and S04's youDo define and call their own validate_record (s04:1826), so nothing dangles'

**Problem.** This is false. S04 does not define a validate_record the learner can call. It ships a stub whose body the learner must write by reusing S03's logic, shaped as a function that returns a per-field dict. After the plan, S03 practises neither functions nor dict results. The plan's own theory[3] p4 now tells learners that S05 turns a rule into a function. So S04's You Do asks for an S03-shaped artifact that S03 no longer teaches. S04 also consumes dicts that carry raw_line, while the plan's S03 case table is positional tuples with no raw field. The S03→S04 handoff breaks in form, and nothing records it.

**Evidence.** s04:1826-1831:
`def validate_record(record: dict[str, Any]) -> dict[str, Any]:`
`    """Reutiliza lógica tipo S03: status global + detalle por campo.`
`    # TODO: devolver {status, fields} con accept|reject|review por campo (S03)`
`    raise NotImplementedError`
s04:1805 objective: 'Reutilizar validación tri-estado por campo (S03)'. s04:1855 fixture: `{"edad": 30, "region": "Lima", "monto_ingreso": 0, "raw_line": "30|Lima|0"}`. The plan's theory[3] item says: 'S03 keeps each decision in a name at top level, and S05 turns a rule into a function that returns it.' The plan's youDo case table is 'Eight named case tuples (label, (edad, region, monto_ingreso), (…expectations))'.

**Fix.** Replace 'nothing dangles' with an explicit WORK_QUEUE item that is Ask-first because it restructures S04's practice layer. S04's route-2 round must rescope s04:1797-1880 to consume S03's handoff: iterate the S03 case table, read edad_/region_/monto_ingreso_ status/code/message and registro_status, and stop asking for a `{status, fields}` dict or a def before S05/S06. Also write the handoff shape into the S03 youDo so S04 can quote it.

### [major] satellite: figure S03-guard-order (figures/data/misc.ts:446, attached at s03:69 in theory T1-A)

**Problem.** The planned branch data matches no decision chain in the section, and one of its rules cannot be carried out. The plan fixes the rows as absent → review, out of range → reject, not in list → review, rest → accept, so the range row comes before the list row. Theory T3-A and T3-A-DEMO are the only S03 chains with both a range and a list, and both check the list first. The plan itself relies on that order: its T3-A prediction is 'R-FUERA 15 (still NOT_IN_ALLOWLIST, because the allowlist branch runs first)'. The plan's other rule, 'Order the branches like the chain of the block the figure sits beside', cannot be applied at the current placement: T1-A's code (comparaciones_intake.py) only prints booleans and has no chain. Placement is also left open. The rows also carry status only, while convention (b) pairs every status with a code.

**Evidence.** s03:343-351 (T3-A): `if region is None or edad is None: return "review"` / `if region not in ALLOWED_REG: return "review"` / `if not (18 <= edad <= 65): return "reject"`. The demo at s03:711-718 uses the same order. The T1-A code at s03:92-101 has no `if`.
Ran on .venv-content 3.12, applying the plan's figure rows in the plan's order next to the plan's T3-A chain. It printed:
`figure  R-FUERA 15 -> reject`
`T3-A    R-FUERA 15 -> review NOT_IN_ALLOWLIST`

**Fix.** Decide the placement this round (see the next finding) and copy the rows from the chain beside the figure.
- At T2-B, use the plan's T2-B funnel: None → review MISSING; not int or bool → reject BAD_TYPE; <0 or >120 → reject OUT_OF_RANGE; <18 → review NEEDS_REVIEW; else → accept OK. There is no list row.
- At T3-A, use T3-A's order: absent → review MISSING; not in allowlist → review NOT_IN_ALLOWLIST; out of range → reject OUT_OF_RANGE; else → accept OK.
In both cases, put 'status CODE' in `result` so the figure follows convention (b).

### [major] satellite: figure S03-guard-order note and caption (misc.ts:456, s03:70-71)

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

### [major] tests_to_rescope (NEW S03 practice guard)

**Problem.** The plan adds a mechanical guard for the class, but only over code (theory, iDo, weDo, youDo starter, playground). The self-check and the exam bank carry the same class of leak: def, return, dict and validate_* in stems and options. The plan itself says the planning output missed 6 bank sites, and the finding above shows a hand grep still misses 5 more. Nothing fails today on the bank's `def classify` or 'devolver status/code/message', so a later round can bring them back unnoticed. This is the repeat-issue pattern the repo says to fix with a guard, not by instance.

**Evidence.** Plan NEW guard: 'No `def `, `return`, `for … in`, dict literal …, `.get(` or annotation (`->`) may appear in any python code of theory …, iDo, weDo starter/solution, the youDo starter or the 'decisions-rules' playground.' The bank and selfCheck are not in scope. Plan assessments: 'Grep of the bank also found sites the planning output missed: :722 … :778'. My regex run over seed.ts:644-990 still reports 'MISSED' at 925, 926, 944 and 982 (see previous finding). Existing bank tests (test_s03_text_first_contract.py:157-183, test_s03_independent_contract.py:147-173) check only counts, uniqueness, word floors and positions.

**Fix.** Extend the NEW guard, or add a sibling test, to cover the learner-visible text of the S03 bank (question and options between '  // S03 V3' and '  // S04 V3') and of selfCheck. It rejects `def`, `return`, `dict`, `validate_\w+`, `for x in`, `KeyError`, `except` and `CP-N1-A`, with theory[3]'s held definition exempt only in theory. It must fail on today's bank at :749, :806, :878, :926 and :935 before the rescope commit.

### [major] tests_to_rescope → NEW "S03 starter visibility" test

**Problem.** The rule as written ("prints at least one line absent from the solution's declared output") is line-membership, not sequence comparison, so it stays RED after the round on S03-T1-A-E1 — an item the plan explicitly does not change ("No code change"). The plan claims the new test "fails today on S03-T1-A-E2" only; in fact it fails today on three of the 24, and one of them is never repaired by any plan item.

**Evidence.** I ran all 24 weDo starters under /private/tmp/.../mergewt/.venv-content/bin/python (3.12) and compared each stdout to its solutionCode `output`.

S03-T1-A-E1 starter (s03:949-953):
  print(edad < 18) / print(edad >= 65) / print(edad < 18 or edad > 65) / print(region != "R-OESTE") / print(region == "R-NORTE")
  → stdout 'False\nFalse\nFalse\nTrue\nFalse', rc=0
S03-T1-A-E1 solution declared output (s03:968-972): 'True\nTrue\nTrue\nFalse\nTrue'
Every starter line ("False", "True") IS a line of the declared output, so "at least one line absent" is FALSE, and rc=0 with no named error. Verdict printed by my replication: `S03-T1-A-E1: rc=0 *** INVISIBLE ***`.
Also red today: S03-T1-A-E2 (byte-identical output, the case the plan names) and S03-T4-A-E1 (starter prints nothing, rc=0 — the plan's rebuild makes it raise TypeError, so that one recovers).

**Fix.** State the rule as an ordered comparison: the starter's full stdout (rstripped) must DIFFER from the solution's declared output, or the starter must exit with the item's named error from the test's table. That still fails today on T1-A-E2 (byte-identical) and on T4-A-E1 (empty vs four lines), and it passes T1-A-E1 unchanged. If line-membership is kept instead, T1-A-E1 must be added to the plan as a content change, which it currently is not.

### [major] tests_to_rescope → test_s03_independent_contract.py::test_you_do_oracle_covers_schema_normal_boundary_and_error_paths

**Problem.** The repoint trades a pin on the three-part result for two pins that are both about status values only, so it guards strictly less than the old one. Under D14 the three names ARE the deliverable; after this repoint a youDo that never assigns `edad_message`, or a branch that skips its `_code`, passes the gate. This is a pin that guards something real, so Q4 says write around it, not shrink it.

**Evidence.** test_s03_independent_contract.py:193-196 pins `'assert set(result) == {"status", "code", "message"}'` — i.e. it pins that the youDo's own oracle checks all three names. The plan replaces it with `'STATUS_VALIDOS = {"accept", "reject", "review"}'` and `'assert edad_status in STATUS_VALIDOS'`; neither mentions code or message. The retained six-code pin (:200-208) only requires the code STRINGS to appear somewhere in the youDo span, which the decision strings already satisfy.
Today the youDo oracle also has s03:2458 `assert isinstance(result["message"], str) and result["message"]`, which no pin covers — it survives only because :2455 forces the shape.
The plan's own youDo design ("asserts (statuses in STATUS_VALIDOS, messages non-empty, each decision == its expectation, registro == esperado_registro)") therefore ships assertions that no pin protects.

**Fix.** Repoint to three pins, not two: keep `'assert edad_status in STATUS_VALIDOS'`, and add a pin on the non-empty-message assert (e.g. `'assert edad_message'` as finally written) and on a per-field code assert (e.g. `'edad_code'`). All three fail on today's dict form, so the red-first test-only commit still works.

### [major] theory[10] S03-T4-A (s03:412-468) and S03-T4-A-DEMO (s03:806-850)

**Problem.** The plan splits today's single digit-or-length branch into two branches: `not (isascii and isdecimal)` → reject, then `len != 9` → reject. It keeps only the four current cases. No case reaches the new digit branch, so the block that teaches O7 and O8 (s03:418, 'prueba al menos una vez cada rama distinta… Varias ramas pueden terminar con el mismo status y aun así necesitar casos propios') now shows a chain with an untested branch right below that sentence. This is a regression: today's shape covers 4 of 4 branches, and the planned one covers 4 of 5. The plan's 'preserves' column claims 'a checked expectation for every branch', which is false. Neither of the plan's two candidate fifth examples for the DEMO retrospective reaches the branch either.

**Evidence.** Today's code at s03:432 and s03:822 is `if not digits.isdigit() or len(digits) != 9:` (one branch, reached by '12345'). The plan's funnel is '…not (strip().isascii() and strip().isdecimal()) → reject; len(strip()) != 9 → reject'. t4a_cov.py printed "branch never reached: ['B3 no-digitos->reject']" and 'mutant (digit branch deleted) same on 4 cases: True'. It also printed "mutant on 'abcdefghi': accept | plan chain: reject". For the candidates it printed "candidate 999000111 -> B2 no-str/blank->reject" and "candidate ' 999000111 ' -> B5 accept".

**Fix.** Keep today's shape: one branch `not (s.isascii() and s.isdecimal()) or len(s) != 9` → reject. Verified in rest.py: the four cases print the same four results, byte-identical to the pin, and the branch still rejects '١٢٣٤٥٦٧٨٩', '９９９０００１１１' and 'abcdefghi'. This keeps 4 of 4 branches covered and satisfies L1Q3-2. If the split is wanted for teaching, add a fifth block ('abcdefghi' or the p5 counterexample, esperado reject) to both theory[10] and T4-A-DEMO and accept one more output line. Either way, correct the 'every branch' claim.

### [major] theory[10] S03-T4-A (s03:412-468) and S03-T4-A-DEMO (s03:806-850)

**Problem.** The plan's headline correctness fix — replacing `isdigit()` with `isascii() and isdecimal()` to close the L1Q3-2 hole — is added as a branch that none of the four shipped cases can reach. Deleting the entire new branch leaves the declared output byte-identical, so nothing in the item demonstrates or protects the fix; the only value that exercises it ('١٢٣٤٥٦٧٨٩') lives in p5 prose as a prediction. R3 ("one case per branch of the chain the item teaches") is violated on the one branch the round exists to add.

**Evidence.** Built the planned funnel (None → review; not str or blank → reject; `not (strip().isascii() and strip().isdecimal())` → reject; `len(strip()) != 9` → reject; else accept) with the four planned blocks '999000111'/'12345'/None/'  '. Baseline output is byte-identical to s03:461-464. Then replaced the digit branch with `elif False:` and diffed:
  === baseline / === mutant (isascii/isdecimal branch removed)
  '999000111' → accept ok= True / '12345' → reject ok= True / None → review ok= True / '  ' → reject ok= True
  === diff: IDENTICAL OUTPUT
'12345' is ASCII-decimal, so it exits at the `len != 9` branch, never at the digit branch. Verified the counterexample values do reach it: `'١٢٣٤٥٦٧٨٩'` → len 9, isdigit True, isdecimal True, isascii False; `'９９９０００１１１'` → len 9, isdigit True, isdecimal True, isascii False.

**Fix.** Add a fifth block to theory[10] and to T4-A-DEMO whose value is ASCII-rejecting but nine characters long — `contacto, esperado = ("١٢٣٤٥٦٧٨٩", "reject")` — so the digit branch has its own case and the declared output gains one line. Keep the four pinned lines first so the existing byte-identical pins survive, and state that the fifth line is the new output. If the extra line is refused, say plainly in the constraints that the isascii/isdecimal branch is unexercised and that no case protects the L1Q3-2 fix.

### [major] theory[11] S03-T4-B (s03:469-540) and S03-T4-B-DEMO (s03:851-914)

**Problem.** O8's red-test cycle depends on which copy the learner edits. Case blocks hold one copy of the rule per block, and an assert only protects the copy in its own block. A learner doing the experiment the prose names ('Predice la prueba roja', retargeted to `edad <= 0`) edits the first match, which is the None block, and everything stays green. The plan nonetheless claims 'Both mutants go red' for theory T4-B and says the DEMO pin's challenge is 'now provable'. It states the one-test-per-copy trade-off only at T4-B-E2. p0's kept promise, 'una prueba que impide que esa explicación se vuelva falsa tras un cambio', is not delivered in this form unless the change is made in every copy.

**Evidence.** s03:478 reads '**Predice la prueba roja.** … ¿qué assert revela el error…'. p0 is at s03:473. The plan's theory[11] row says 'Both mutants go red: dropping `or isinstance(edad, bool)` fails at True, and `edad <= 0` fails at 0'. Its T4-B-DEMO row says 'dropping `edad < 0` turns the -5 assert red (verified)'. build_t4b.py (plan's 4 blocks) printed: '`edad <= 0` in FIRST copy only … exit=0 passes=4 (no error)'; '`edad <= 0` in ALL copies exit=1 passes=3 AssertionError'; 'drop bool exclusion in FIRST copy only exit=0 passes=4'; 'drop bool exclusion in ALL copies exit=1 passes=1 AssertionError'. demo_copy.py printed 'T4-B-DEMO drop `edad < 0 or` in first copy exit=0 passes=4' and '… in the -5 copy exit=1 passes=2 AssertionError'.

**Fix.** In theory T4-B, at p2 or p5 where O8 is taught, state once that each block carries its own copy of the rule, so its assert protects only that copy. The red-test experiment must change the condition in every block (replace-all), and the prose quotes only the final AssertionError line. Name S05's function as what lets one suite protect one rule. Use the same wording in T4-B-DEMO's why or retrospective. Qualify the plan's claims to 'red when applied to every copy (first-copy-only stays green, verified)', and move the T4-B-E2 trade-off statement up to the theory so the section says it where O8 is introduced.

### [major] theory[2] S03-T1-A (s03:66-111) / open_questions[0]

**Problem.** The plan leaves S03-guard-order in T1-A, where no prose explains it. The prose it does explain is T2-B, which has no figure. Its only reason for leaving it is 'T1-A would lose its only figure (D5 count)'. That misreads D5: the target is per concept, not per subtopic. The concept map credits this figure to no concept, so moving it changes no figure_count. The figure is also the first place the learner meets the word «guarda». It sits between T1-A's comparison prose and its code, before any chain or guard has been taught.

**Evidence.** SectionView.tsx:426-430 renders the figure between the block's paragraphs and its code ('Spatial contiguity: the figure sits between the prose it explains').
T1-A's paragraphs (s03:76-82) never mention guards. `grep -n -i guarda` over the section returns s03:71 and 73 (this figure's caption and alt) as the first hits, before theory[3] (s03:125) and T2-B.p0.
T2-B.p2 (s03:287) is the figure's content: 'Orden típico en validadores: 1) ausencia → 2) tipo → 3) rango/allowlist → 4) accept'. T2-B.p4 (s03:289) is '**Modelo mental de embudo.**'. T2-B has no `figure:` key (grep lines 282-283).
D5 (decisions.md:92-94): 'every concept carries 5–10 visuals … not one figure per section'.
.fixer/events.json, event decisions-rules.S03-T1-A.figure: "mentions": [].
concept_map.py:139-141 credits a figure to a concept only through the event's mentions.

**Fix.** Resolve open_questions[0] in the plan: move S03-guard-order to theory[7] (T2-B), with rows copied from T2-B's funnel. Record that D5 counts are unchanged, because the figure is credited to no concept.
If T1-A should keep a visual, it must remove work the prose now does badly. One candidate is a `set`-archetype figure of membership against a set of literals, including the case trap the plan adds (`"r-sur" in {"R-SUR"}` → False). It would count toward `set` (2/5 today). If nothing earns a figure there, leave T1-A without one and say so.

### [major] theory[3] Una regla con nombre: def, llamada y return (s03:112-164)

**Problem.** Both prose replacements the plan specifies trade a purpose clause for a curriculum-location clause, and the callout replacement breaks a two-limb parallel into three limbs. This is the G1/G3 regression pattern verbatim — the sentence that is merely accurate displacing the one that teaches, and a longer, flatter, less quotable replacement.

**Evidence.** Today's callout, s03:160: «Una decisión que el código usará después se retorna; un mensaje que solo debe ver una persona se imprime.» — one sentence, two parallel limbs, each carrying its purpose («que el código usará después», «que solo debe ver una persona»). The plan's replacement: «a decision the code will use later is kept in a name; inside a function it is returned; a message for a person is printed» — three limbs, the middle one conditional, and «que solo debe ver una persona» reduced to «for a person» (B4: purpose dropped). Same pattern in p4: today s03:126 ends «Las reglas de S03 retornan sus decisiones porque otras partes del programa necesitan usarlas.» — the plan replaces it with «S03 keeps each decision in a name at top level, and S05 turns a rule into a function that returns it», which states where things live and drops the «porque…» that answers why a decision is kept at all. writing_rules G1 cites exactly this: «El sentence that carries the teaching point outranks the sentence that is merely accurate.»

**Fix.** Brief both replacements to keep the purpose clause. Callout: keep the two-limb parallel and fold the S03 case into the first limb, e.g. «Una decisión que el código usará después se guarda en un nombre —o se retorna, si vive dentro de una función—; un mensaje que solo debe ver una persona se imprime.» p4: keep «porque otras partes del programa necesitan usarla» and attach the S05 forward reference after it, rather than replacing it.

### [major] theory[3] Una regla con nombre: def, llamada y return (s03:112-164) — HELD DEFINITION

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

### [major] theory[3] Una regla con nombre: def, llamada y return (s03:112-164) — HELD DEFINITION

**Problem.** After the rebuild no learner anywhere in S03 writes, calls or returns from a function — the plan's own practice guard forbids it in theory, iDo, weDo, the You Do and the playground. The block keeps orientation, a worked example and a figure, but loses D3's fourth element, a check the learner can perform, and by D3's own test the concept is no longer load-bearing for this section. The section ends up explaining a tool in detail and then forbidding it for 24 exercises without saying so.

**Evidence.** Plan, tests_to_rescope: "NEW … an S03 practice guard. No `def `, `return`, `for … in`, dict literal …, `.get(` or annotation (`->`) may appear in any python code of theory (theory[3] exempt, held definition), iDo, weDo starter/solution, the youDo starter or the 'decisions-rules' playground."
Today the learner writes 28 functions in the weDo span alone (`sed -n '917,2348p' … | grep -c '^def '` → 28), e.g. s03:1183 `def validate_monto(m):`, s03:1238 `def classify_score(score: int) -> str:`, s03:1420 `def validate_edad(edad):`, s03:1749 `def tipo_doc_len(tipo, numero):`. After the rebuild: zero.
D3 (audit/fixer/decisions.md:43-44): "Those concepts get their own subtopic: orientation, a worked example with real values, a figure, **and a check the learner can perform**." D3's test (:49-50): "if the learner misunderstands this, does a later exercise in this section become unsolvable?" — after the rebuild, no.

**Fix.** If the block stays this round, make its new status explicit rather than implicit: one sentence saying plainly that S03 will not ask the learner to write a function and S05 will, and give it the check D3 requires using the one program the practice guard exempts — ask the learner to predict, then edit, `decidir_region`'s four calls (add `decidir_region("R-CENTRO")`, delete a `return` and predict the implicit `None`). Otherwise take ask_first option (b) and move it, since the round has just removed the only S03 evidence that it belongs here.

### [major] theory[4] Antes de decidir: bool (s03:165-188)

**Problem.** The item's whole justification is that the hard-coded labels lie when the learner edits `monto`. The fix re-labels each line by its expression and prints `repr(monto)` first, but the plan lists no prose change — and p2 at s03:170 quotes the old literal output lines and says there are two of them. After the rebuild the program prints three lines and neither quoted line appears, so the predict-verify paragraph is falsified by the very change meant to make it true.

**Evidence.** s03:170 (verbatim): 'Ahora cambia `monto` por `None` y predice las dos líneas antes de ejecutar. Lo correcto es `bool(None) → False` y `None is None → True`: la primera línea describe la truthiness y la segunda comprueba ausencia.'
Ran the planned form with monto = None on 3.12:
  None
  bool(monto) → False
  monto is None → True
Three lines; the strings 'bool(None) → False' and 'None is None → True' are printed by no line. (Today's code at s03:174-178 prints two lines, which is why p2 says "las dos líneas".)

**Fix.** Add to the item's change list: rewrite s03:170 to quote the new labels and the new line count — e.g. predict three lines, `None`, `bool(monto) → False`, `monto is None → True`, then re-run with `-5` and predict `True`/`False`. Keep the truthiness term and the p0 held definition untouched. Alternatively drop the `repr(monto)` line and keep two lines, but the quoted label strings still have to change.

### [major] theory[6] S03-T2-A (s03:234-280)

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

### [major] theory[6] S03-T2-A (s03:234-280)

**Problem.** The plan specifies the overwrite-bug block as "the two-if overwrite version" while also promising the learner that editing the one opening line to 49 prints "reject/reject". With exactly two ifs and no `else` (R2 is waived here by design), neither branch fires at 49 and `status_bad` is unbound: the learner's instructed prediction produces a NameError traceback, not a decision. The sibling item T2-A-E2 words the same construct as a "three-if block", so the plan is internally inconsistent about the shape.

**Evidence.** Plan text: "then through the two-if overwrite version assigning status_bad" and "p5: predictions 79 / 50 / 49 / 95 (verified: … 49 reject/reject …)". Ran both shapes on 3.12:
  == TWO-IF (as the plan words it)
    score= 80 -> 80 good= accept bad= review
    score= 79 -> 79 good= review bad= review
    score= 50 -> 50 good= review bad= review
    score= 49 -> NameError: name 'status_bad' is not defined. Did you mean: 'status_good'?
    score= 95 -> 95 good= accept bad= review
  == THREE-IF (as T2-A-E2 words it)
    score= 49 -> 49 good= reject bad= reject   (all five predictions match the plan)
Today's code has the third branch: s03:1238-1246 `bad()` is `status = None` + three ifs (`>=80`, `>=50`, `<50`).

**Fix.** Specify theory[6]'s defective block as the same three-`if` shape as T2-A-E2 (`if score >= 80` / `if score >= 50` / `if score < 50`), or add an explicit `status_bad = "reject"` default before the ifs. Then state in the convention that R2 (`else` + every branch assigns every name) has one named exception — the deliberately non-exclusive overwrite block — and that the exception is only safe when the remaining ifs cover every predicted value.

### [major] theory[6] S03-T2-A (s03:234-280)

**Problem.** The block that teaches banding drops from five printed classifications to one. The two inclusive boundaries it asks the learner to predict stop being answered by its own run, and — worse for the overwrite bug the block now demonstrates — the single case chosen (80) is one where the two forms differ, so the learner never sees a row where they agree. The whole danger of the two-if form is that it is right most of the time; a one-row demonstration teaches the opposite.

**Evidence.** Today, s03:263-267 prints five rows: `print(95, …)`, `60`, `30`, `80`, `50` → accept/review/reject/accept/review. Plan: "Single-path exception: score = 80 goes through the exclusive chain … then through the two-if overwrite version".
Ran under .venv-content 3.12:
```
 95  good=accept  bad=review  differ=True
 80  good=accept  bad=review  differ=True
 79  good=review  bad=review  differ=False
 60  good=review  bad=review  differ=False
 50  good=review  bad=review  differ=False
 49  good=reject  bad=reject  differ=False
```
The block's own prose then over-promises against a one-row table: s03:250 "**Predice las fronteras.** Antes de ejecutar, clasifica 80, 79, 50 y 49" (only 80 is answered) and s03:248 "Fronteras (`score >= 80`) deben estar documentadas en la tabla de ejemplos" (the table becomes one row).

**Fix.** Two blocks, not one: `score = 80` (accept vs review) and `score = 60` (review vs review), about +8 lines, which D6 explicitly permits ("counts are floors, not ceilings"). The learner then reads the real lesson off the output — the buggy form agrees on the middle band and diverges only at the top — and p5's 79/49/95 stay as named predictions run by editing one line.

### [major] theory[7] S03-T2-B (s03:281-327)

**Problem.** The plan mandates quoting a full English traceback line in at least three learner-facing prose fields and never says to render it as inline code. D7 allows English only inside `code`. Unformatted, the quote also trips the one instrument that is not blind here: `not`, `between` and `supported` are in code_switching_audit.py's FUNCTION set, so the round can go red on avoidable English for a change the plan calls mandatory. There is no precedent in S02 or S03 for this form to copy.

**Evidence.** Plan, theory[7]: «p5: add the reorder experiment. Move `edad < 18` first, run with None, and quote only "TypeError: '<' not supported between instances of 'NoneType' and 'int'".» Same instruction repeated in S03-T2-B-DEMO («adds the reorder counterfactual … → quote the last TypeError line»), S03-T2-B-E1 («add the reorder → TypeError observation step, quoting the last line») and optionally S03-T1-B-E3. `grep -rn "not supported between|Traceback" src/lib/course/sections/s02-*.ts src/lib/course/sections/s03-decisions-rules.ts` returns nothing — no precedent. Today's S03 renders the same fact as a term only: s03:287 «Si comparas `edad < 18` antes de chequear `None`, obtienes `TypeError`.» scripts/code_switching_audit.py:47-51 FUNCTION includes `not`, `between`, `without`, `within`; STRIP removes `` `inline code` `` spans, so a backticked quote is invisible and a bare one is counted.

**Fix.** Add one line to convention (d): the quoted traceback line is always rendered as inline code (single backticks), and the Spanish sentence around it names what Python was asked to do, e.g. «Python intenta comparar `None` con un entero y se detiene: `TypeError: '<' not supported between instances of 'NoneType' and 'int'`.» State it once in the convention so all three sites inherit it.

### [major] theory[8] S03-T3-A (s03:328-368)

**Problem.** The plan ratifies two bolded, competing definitions of the same concept in one section — «lista de permitidos» in theory[0] and «allowlist» in theory[8] — plus «listas permitidas» in the heading and jobRelevance and «allowlists» unglossed in outcome O5. A1 binds learning outcomes explicitly, and O5 is the learner's first encounter with the word. The same paragraph also names a constant that exists nowhere in the section.

**Evidence.** s03:43 «Una **lista de permitidos** enumera de antemano los valores conocidos que una regla puede aceptar.» (bolded definition). s03:333 «Una **allowlist** es el conjunto de valores admitidos (`ALLOWED_REGIONES = {"R-NORTE", "R-SUR", ...}`).» (second bolded definition, English head-word). s03:31 O5 «Implementar rangos y allowlists combinados para reglas de dominio sintéticas» — unglossed, and the plan's learningOutcomes item says «O1-O3 and O5-O8 stay». s03:25 jobRelevance «listas permitidas»; s03:329 heading «Reglas de dominio: rangos y listas permitidas». The plan's theory[8] item changes only the code blocks and the predictions; p1 is untouched. `grep -n "ALLOWED_REGIONES"` returns exactly one hit, s03:333, in prose — the code uses `ALLOWED` (s03:89, 558, 1633), `ALLOWED_REG` (s03:342, 712) and `ALLOWED_REGIONS` (s03:2377), and the plan's convention (c) says «Keep ALLOWED, ALLOWED_REG and ALLOWED_REGIONS», so the prose's fourth name stays phantom.

**Fix.** Add to theory[8]: rewrite p1 to reuse theory[0]'s «lista de permitidos» as the head-word and introduce «allowlist» once, in the same sentence, as the English name the code constants use — or drop the second bolded definition entirely. Reword O5 (s03:31) to «listas de permitidos», since A1 binds outcomes. Fix `ALLOWED_REGIONES` at s03:333 to whichever constant the T3-A code actually defines (`ALLOWED_REG`), and decide in the convention whether three constant spellings for one catalog survive.

### [minor] S03-T2-B-E3 (s03:1536-1607)

**Problem.** The constraint calls this retrospective "the thinnest" at 47 words against the 45-word floor. Two weDo retrospectives sit closer to the floor, and both are items the plan rewrites, so the "replace, do not delete" discipline is attached to the wrong item as the worst case.

**Evidence.** Counting with the gate's own tokenizer (test_s03_text_first_contract.py:21-22 `_words`) over `_between(source, "  weDo: {", "  youDo: {")`: S03-T1-A-E2 = 46, S03-T4-B-E1 = 46, S03-T2-B-E3 = 47, S03-T3-A-E3 = 48, S03-T2-A-E1 = 49. Floor is 45 (test_s03_text_first_contract.py:112). The plan does flag 46 for T1-A-E2 and T4-B-E1 separately, so the fix is only to the label.

**Fix.** Move the "thinnest" label to S03-T1-A-E2 and S03-T4-B-E1 (46 words, one word of margin each) and keep the replace-don't-delete instruction on all three.

### [minor] S03-T3-B-E1 (s03:1783-1839)

**Problem.** The item says «Spanish title» and, four lines later, «Title 'decision_table.py'». The plan uses the bare word «Title» for two different fields — the exercise heading and the code-block file name — and never says so, so the two bullets read as a contradiction. The same ambiguity hits T1-A-E2, whose «Title in Spanish» has no pinned counterpart at all.

**Evidence.** s03:1786 exercise heading: `title: 'Decision table código → status',`. s03:1821 code-block title: `title: 'decision_table.py',`. Plan, S03-T3-B-E1 change list ends «- Spanish title.» and its constraints say «Title 'decision_table.py'.» Plan, S03-T1-A-E2 change list ends «- Title in Spanish.» with no constraint pin; that item's two title fields are s03:977 «Membership en allowlist de tipo de documento» and s03:996/1007 'allowlist_tipo_doc.py'.

**Fix.** Use two words in the plan: «heading» for the exercise title and «file name» for the code-block title. Restate T3-B-E1 as «heading → Spanish (drop «Decision table»); file name stays decision_table.py» and T1-A-E2 as «heading → Spanish (drop «Membership»); file name → …».

### [minor] S03-T4-A-E2 (s03:2032-2097)

**Problem.** Two parts of this row send the learner into an `AttributeError`, an error class the course has never named: the planned swap experiment, and the open question's option to drop `isinstance` and record the integer case as debt in the printed invariant. Every other error the plan uses has an S02 precedent (TypeError, ValueError, NameError, AssertionError).

**Evidence.** - Plan T4-A-E2 preserves: '(swapping raises AttributeError; or-first makes reject dead; both verified)'.
- Open question: 'an int raises AttributeError, recorded as debt in the invariant'.
- Grep counts: AttributeError S01=0, S02=0, S03=0. TypeError S02=1, ValueError S02=12, NameError S02=7, AssertionError S02=2.
- 3.12 output for the swap with None: "AttributeError: 'NoneType' object has no attribute 'strip'".

**Fix.** Pick one:
- Keep the text-type guard, so no planned path raises AttributeError, and state the swap consequence only for the `or-first makes reject dead` experiment.
- Or, where the experiment is instructed, gloss AttributeError in one clause, tied to S02's «el punto permite consultar un dato asociado» (s02:109).

### [minor] S03-selfCheck (s03:2520-2582) outcome coverage

**Problem.** The plan rewrites O4, says O8 'is now delivered by case blocks with asserts', and leaves Q1, Q3 and Q4 unchanged, but it never maps self-check items to outcomes. The self-check is what the readiness audit counts as S03's EXAM activity. No self-check item assesses unreachable branches (O4's second clause, kept in the plan's rewording), covering each branch with a test case (O8's second clause), or combining a range with an allowlist (O5; Q5 is an allowlist alone). O2 has three items (Q1, Q2, Q4).

**Evidence.** The 8 stems at s03:2524-2575 test, in order: Q1 is None, Q2 None/0 policy, Q3 first-true-wins, Q4 `"" or "default"`, Q5 allowlist set+in, Q6 match vs if, Q7 None before <, Q8 actionable message. The outcomes at s03:30-34 are O4 'Aplicar guard clauses y detectar ramas inalcanzables…', O5 'Implementar rangos y allowlists combinados…' and O8 '…y cubrir cada rama con un caso de prueba'. scripts/badge_readiness_audit.py:59-60 maps `selfcheck.` events to offers 'EXAM'.

**Fix.** Add an outcome → self-check table to the assessments section. Either re-target one of the three O2 items to O4's dead-branch clause or O8's branch-test clause, keeping its correctIndex, the 2/2/2/2 balance and all pins, or state the gap explicitly as a trade-off covered only by the bank (guard-clauses :806, actionable-messages :964).

### [minor] S03-selfCheck Q4/Q7/Q8 vs exam bank :706/:792/:950

**Problem.** Three self-check questions are near-copies of exam bank items. The self-check is public, and after submit it shows the correct option and explanation (SectionView.tsx:903, :955). So for 3 of 8 exam concepts, one of the three variants is answered before the exam. D12 treats a question whose key the learner was shown as not evidence. The plan edits Q7 and Q8 but leaves their bank twins identical in substance.

**Evidence.** Q4 s03:2545 '¿Qué devuelve la expresión `"" or "default"`…' (correct '"default"') vs seed.ts:706 '¿Qué imprime la expresión `"" or "default"`…' (correct '"default", porque or…'). Q8 s03:2575 (correct "Campo 'edad'=-5 fuera de rango; usa un entero 0–120.") vs seed.ts:950-955 '¿Cuál mensaje es accionable al rechazar edad=-5…' (correct "Campo 'edad'=-5 fuera de rango; usa 0–120."). Q7 s03:2567 vs seed.ts:792 (both: None before < 18 → TypeError). SectionView.tsx:903 has 'showCorrect = submitted && oIdx === q.correctIndex', and :955 renders {q.explanation}.

**Fix.** While rescoping, move each bank twin to a different surface of the same skill, keeping concept and correctIndex. For :706, a different operand pair whose `or` result must be predicted. For :950, a different field and value, such as region or monto. :792 is already being reworked by the Q7 finding. List the twin pairs in the assessments section so later rounds keep them apart.

### [minor] S03-selfCheck.Q2 (s03:2529-2536)

**Problem.** The plan pads Q2's distractors to remove the length cue, but the explanation quotes distractor 1 word for word. Padding option 1 leaves the explanation quoting an option that no longer exists, and the plan's constraints list only the pin and the word count.

**Evidence.** s03:2533 options[1] 'Ambos `reject` porque son falsy' (31 chars; the correct option is 71). The explanation (s03:2535) reads '“Ambos `reject` porque son falsy” describe el comportamiento de `bool`, no la política del dato.' The plan's item S03-selfCheck.Q2 change is 'Pad the distractors to comparable detail', with constraints 'correctIndex 0. Pin …. Explanation 31 words.'

**Fix.** Add a constraint: when options[1] is padded, update the quoted text in the explanation to match it exactly. The pin 'describe el comportamiento de `bool`, no la política' follows the quote and is unaffected. Keep the explanation at 22 words or more.

### [minor] S03-youDo.requirements (s03:2361-2369)

**Problem.** The constraint "requirements[0] must stay a string (test_curriculum_agent_firewall.py:29 mutates it)" cites a test that never reads S03. That test builds the packet for section 2, so it guards S02's youDo. No test guards S03's requirements[0] shape, and the plan's stated protection is illusory.

**Evidence.** tests/adversarial/test_curriculum_agent_firewall.py:21 `packet = packet_builder.build_packet(2, attempt_id="firewall-red")`; :28-29 `you_do = copy.deepcopy(packet)` / `you_do["active"]["youDo"]["requirements"][0] += " mutation"`.
build_packet(N) makes section N active: tests/adversarial/test_newbie_packet.py:57-59 calls `build_packet(3)` and then looks up `exercises["S03-T4-A-E2"]`. So build_packet(2) → S02 is active, and :29 mutates S02's requirements[0], not S03's.

**Fix.** Drop the citation. Either keep requirements[0] a string on its own merits (it is the right shape) and say so without claiming a guard, or add the S03 case to test_s03_independent_contract.py if the property is worth pinning.

### [minor] S03-youDo.starterCode (case table) + ask_first

**Problem.** Route 2 was accepted on the recommendation to 'give each increment a written record schema instead of changing it silently at every step'. The plan changes the record again without writing one: S03's dict {edad, region, monto_ingreso} becomes a positional tuple inside (label, record, expectations). It does not say where each field comes from. S02 hands over separate names: `edad`, `monto` (not monto_ingreso), no region, and the preserved `_raw` values. S04 then expects dicts keyed monto_ingreso with raw_line. The rename monto → monto_ingreso, the source of region and the raw values dropped between S02 and S04 are all left silent. The field names are reserved to the owner under L1Q3-7, which the plan does not cite.

**Evidence.** OWNER_PACKET_2026-09-21.md:62-67: '## 4. Level 1: the practice layer, and CP-N1-A's schema … give each increment a written record schema instead of changing it silently at every step. This is Q3's route 2'. DECISIONS_2026-09-21.md:839-857 (L1Q3-7) is reserved: 'S01's You Do data spec and the S02-S04 field names (AGENTS.md:97)'. S02's handoff is s02:2184-2186 (`direccion_raw`, `edad_raw`, `monto_raw`; no region) and s02:2196-2197 (`edad = ____`, `monto = Decimal(…)`). S04 expects s04:1855 (`"monto_ingreso": 0, "raw_line": "30|Lima|0"`). The plan's names item says 'The youDo keeps edad, region and monto_ingreso for S04', with no source mapping.

**Fix.** Add a written record schema to the youDo's opening comment, and require it in the README. For each field give its type, its absent form (None) and its source: edad from S02's edad, monto_ingreso from S02's monto, region introduced in S03. Say what S04 receives from it. Add L1Q3-7 to ask_first for the monto → monto_ingreso rename. Optionally, carry S02's raw line in each case tuple, which S04 needs (raw_line).

### [minor] S03-youDo.starterCode (s03:2370-2506)

**Problem.** Each planned case is a tuple that contains two other tuples, unpacked in two steps. The plan calls this 'two-step S02 unpacking', but S02 shows only a flat tuple unpacked in one step. No S03 theory, demo or exercise in the plan nests one tuple inside another, so the youDo is where the learner first meets the shape, with no example before it.

**Evidence.** - Plan: 'Eight named case tuples (label, (edad, region, monto_ingreso), (esperado_edad, esperado_region, esperado_monto, esperado_registro))' and 'the two-step S02 unpacking'.
- s02:176-186 show only `resultado = (True, 19, None)` and `ok, edad, error = resultado`.
- Every opening line in the plan's convention (a) is flat, for example `region, edad = ("R-FUERA", 30)`.

**Fix.** Pick one:
- Flatten each case to a single tuple and unpack it in one S02-style line, wrapped in parentheses per R8.
- Or add a nested-case line, with its two-step unpacking, to one earlier worked example (theory T4-B or T4-B-DEMO) so the youDo reuses a form the learner has already seen run.

### [minor] S03-youDo.starterCode (s03:2370-2506)

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

### [minor] S03-youDo.title+context / S03-youDo.starterCode / S03-youDo.portfolioNote (and ask_first 'CP-N1-A placement')

**Problem.** The plan misreads S02's precedent and, in learner-facing text, decides a question it reserves for the owner. S02 dropped the CP-N1-A label but kept its increment framing. The plan drops «incremento CP-N1-A» from S03's title, starter and closing sentence, and swaps the portfolio note's CP-N1-A review for 'a neutral reviewer'. It never says to keep any increment wording. Yet ask_first says 'whether S03 remains an increment are the owner's call'. After the round, S01 still promises learners that S02-S04 each add to the Level-1 intake script, and S04 still builds on 'las reglas de S03'. S03 would be the only link in the N1 chain that no longer calls itself an increment. The CP-N1-A ask_first also omits several learner-facing and catalog sites that say S03 contributes.

**Evidence.** S02's actual precedent: s02:2155 'En este incremento del mismo proyecto trabajarás con una captura sintética completa' and s02:2174 starter '"""captura_cliente.py — incremento de S02'. The S01 promises: s01:2336 'S02–S04 añadirán el script de admisión sin rehacer esta base'; s01:2399 'Este repositorio es la base de tu portafolio de Nivel 1… Cada sección suma evidencia'; s01:70 'Ese esqueleto inicia `CP-N1-A`, el proyecto acumulativo que cerrarás en S04'. The roadmap: learning_roadmap_52_V3.md:151 gives S3 '**Proyecto:** motor de reglas del intake' and :162 gives S4 'cierre CP-N1-A'. The catalog: CP-N1-A/gate.json:61-64 dependencies S01-S04; CP-N1-A/RUBRIC.json:6 gate_section S04. The learner-facing CapstonesPage.tsx:342-346 renders CP-N1-A prerequisites (S01-S03) and contributingSections (S01-S04). The plan's ask_first names only catalog.ts:59, INDEX.json, BRIEF.md and S03's own seven lines.

**Fix.** Follow S02's precedent exactly: remove only the CP-N1-A label. Keep an increment marker in S03, such as a starter docstring saying the file is S03's increment and a context sentence saying it is an increment of the same project, so the owner's question stays open and the S01 → S02 → S03 → S04 chain stays visible. Add these sites to the CP-N1-A ask_first so the owner sees every surface that claims S03 contributes: s01:70, 1907, 2336 and 2399; learning_roadmap_52_V3.md:149-162; gate.json dependencies; RUBRIC.json gate_section; and CapstonesPage's prerequisites and contributing rows.

### [minor] SECTION

**Problem.** The section adopts two opposite conventions for the same problem and never states the rule that chooses between them. Twenty-two items tell the learner to copy the block; the two that carry a whole-matrix claim — the equivalence refactor and the engine — are the two that get one case per run. From the learner's side the rule reads as "copy when it is short, stop copying when it gets long", which is the opposite of the pedagogical reason (the selector belongs where a per-run check exists, the blocks where evidence must be simultaneous).

**Evidence.** Plan, convention (a): "Named exceptions: Selector form, one named case per run with the opening line as the selector: the youDo …; S03-T2-B-E2". Plan, weDo.intro: "Add the case-block routine once, in English terms for the writer: fix the chain once, copy the repaired block, change only its first line." Nothing in convention (a), weDo.intro, T2-B-E2 or the youDo tells the learner when one form replaces the other. The two selector items are precisely the two whose success criterion is a statement about all cases: s03:1457 "en `[None, \"x\", -1, 0, 500, 20000]` la versión anidada y la versión con guardas coinciden (`ok= True`)" and the You Do's "≥1 caso por rama crítica" (s03:2357).

**Fix.** State the rule once in weDo.intro and repeat it in the two selector items: blocks when the claim is about several cases at once and nothing in the program checks them; a selector only when the block form would be unreadable AND the item carries its own per-run check (`ok=` or `assert`), in which case the learner must record every row's result as the item's evidence.

### [minor] SECTION (R3 gaps: S03-T4-A-E3 s03:2098-2167, S03-T3-A-E3 s03:1723-1781, S03-T3-B-E3 s03:1899-1964)

**Problem.** Three more rebuilt items teach a chain that has branches no case reaches. The plan's R3 says every branch gets a case, and O8 says the learner covers each branch with a test case, yet the section's own models leave these branches untested. T4-A-E3's fixed chain has 6 branches, and 15/None/30 reach 3, while Límites and hints[1] claim 'fuera de 0–120 sí corresponde reject'. The new fail-closed T3-A-E3 has a PED accept row that no block reaches. T3-B-E3's `case _` safety default has no unknown-code block, although Q6 teaches 'y hay case _'.

**Evidence.** rest.py printed 'T4-A-E3 range branch deleted, 15/None/30 identical: True | -3 -> review (plan chain: reject)'. t4b_e3.py printed "T4-A-E3 fixed chain, branches hit by 15/None/30: ['F1', 'F4', 'F5'] of F1..F6". t3a_e3.py printed 'T3-A-E3 PED row deleted, 4 blocks identical: True' and "valid PED ('PED','000123'): ('accept', 'OK') -> with row deleted: ('reject', 'OUT_OF_RANGE')". rest.py printed 'T3-B-E3 `case _` deleted, OK/MISSING/OUT_OF_RANGE identical: True | FOO -> PREVIOUS', which means R2's stale value leaks. s03:2103 reads 'fuera de 0–120 sí corresponde `reject`'.

**Fix.** T4-A-E3: add blocks at -3 or 121 (strict reject / fixed reject) and at 70 (fixed review), which also answers the retrospective's 66–120 prompt. T3-A-E3: add a ("PED", "000123") → accept OK block. T3-B-E3: add a FOO → review code block. If the owner rejects the extra output lines, list these items as named R3 exceptions in the convention and remove any prose claiming that every branch is exercised.

### [minor] SECTION (exam bank) — 'positions[a::3]' invariant

**Problem.** The plan keeps '2/2/2/2 per attempt slice positions[a::3]' as a balance invariant, as if it described an attempt. It does not. exam/start draws a random unused variant per concept and does not shuffle options, so an attempt is not variant slice a. With today's bank positions, only about 4.5% of possible first attempts are balanced 2/2/2/2; about 40% put 4 or more of the 8 keys at one position, and some put 6. The plan preserves an invariant that does not describe what learners see, and does not state that.

**Evidence.** route.ts:206 'const selected = available[Math.floor(Math.random() * available.length)]'. route.ts:116 'options: JSON.parse(q.options)' shows options are returned unshuffled, and ExamView.tsx:294 maps q.options in order. I enumerated every per-concept variant combination for the bank's position sets [[0,1,2],[1,2,3],[2,3,0],[3,0,1]]×2. The largest share of the 8 keys at one position was 2 in 4.5%, 3 in 56%, 4 in 32.4%, 5 in 6.6% and 6 in 0.5% (e.g. (0,1,0,0,0,1,0,0)). The test is test_s03_independent_contract.py:169-173 (Counter(positions[attempt::3])).

**Fix.** Stop describing positions[a::3] as per-attempt balance. Add this as an instrument blind spot under open_questions, with its own commit outside this read-only plan. Options: shuffle each drawn item's options in exam/start and store the permutation in ExamAttemptForm (D12 already grades against the saved form), or constrain the draw. Until then, the only balance the section can claim is overall 6/6/6/6 and distinct positions per concept.

### [minor] SECTION: every rewritten requirement-kind field (weDo instruction/hint/tests; youDo objective, requirement and rubric, e.g. rubric «Pruebas/ejemplos por rama», requirements[2] wrong type → BAD_TYPE, requirements[7]; T4-A-E1 hints)

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

### [minor] SECTION: verifying dimension 2 ('critical_competencies practised by then')

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

### [minor] assessments 'AFTER THE ROUND' + open_questions instrument blind spots

**Problem.** Nothing checks dimension 4 in this plan. The readiness audit builds each capstone row only from vocabulary gaps in that capstone's gate section, so no change to S03 can ever move CP-N1-A's row. CP-N1-A's package tests are placeholders that always pass. The plan's post-round step says to diff the readiness rows by hand, but here those rows are blind, and the plan's instrument blind-spot list omits this gap.

**Evidence.** scripts/badge_readiness_audit.py:153 has `slug = by_num.get(n) if n else None`, taking n from c["gate_section"]. Line 158 reads `i for i in gaps.get(slug, [])`, and line 169 builds the row with `cap_rows.append({"id": c["id"], "gate_section": slug, …})`. course-state/badge_readiness_report.json holds {"id": "CP-N1-A", "gate_section": "iteration-summaries", "blocking_term_gaps": 0}. course-state/capstones/CP-N1-A/tests/test_demo.py test_0 through test_4 all read `assert True  # placeholder — replace with real check`. The plan's open question lists concept_map annotations, len and planted_defect_audit as blind spots, and nothing about capstones.

**Fix.** Add a hand check after the round. Tabulate every CP-N1-A claim (BRIEF.md, gate.json, RUBRIC.json, IDO/WEDO/YOUDO.md, demo.py) against what S01-S04 practise after the round, and record the result in LEDGER_NOTES. Add 'capstone readiness rows see only the gate section's vocabulary' to the open_questions instrument list, as an instrument fix for its own commit.

### [minor] convention (a) case blocks × iDo demos (D4 SteppedCode)

**Problem.** I Do demos render through SteppedCode, D4's stepped reveal. It chunks code at blank lines and every 5 lines, and shows the output only after the last chunk. The plan's case-block layout (about 12-line blocks separated by one blank line) roughly doubles or quadruples the clicks before any output is seen. It also cuts every block at a line ending in ':', so the header is revealed without its body. In the funnel, that splits the happy-path `else:` from `status, code = ("accept", "OK")`. D4 says a reveal fits 'where the order is the lesson', and segmentCode's own doc says chunks are 'what a person would actually type in one go'. The plan does not state this trade-off.

**Evidence.** SectionView.tsx:517-523 renders every I Do demo with <SteppedCode>. SteppedCode.tsx:83-100 has segmentCode(maxLines=5). SteppedCode.tsx:128 sets `outputVisible = showAll || (done && ran)`.
Ported segmentCode to Python and ran it on today's S03 demos: T2-B-DEMO has 17 lines and 4 clicks; T3-B-DEMO has 47 lines and 10 clicks.
Built plan-faithful prototypes; the line counts match the plan's stated 64 and 87, and both run and match the plan's outputs. T2-B-DEMO: 64 lines, 15 clicks, 5 chunks ending on a ':' header ('else:'). T3-B-DEMO: 87 lines, 19 clicks, 8 chunks ending on a header ('else:', 'case "MISSING" | "NEEDS_REVIEW" | "NOT_IN_ALLOWLIST":').

**Fix.** State the D4 cost in the plan: clicks per demo before and after, and the header/body splits.
One option is to take the 3-block T3-B-DEMO fallback.
Another is to raise, as its own commit with a baseline proof, a SteppedCode change that ends chunks only at blank lines when a block is 12 lines or fewer, or that never ends a chunk on a line ending in ':', so that one case block is one reveal step.

### [minor] convention (b)

**Problem.** The convention justifies the tuple row by a mechanical protection that covers only two of its three names. A branch that forgets its `message` line does not fail; it silently prints the previous block's sentence beside the new status — the exact failure R2 was written to prevent, and the one the You Do's three-fields-times-five-branches code is most likely to hit.

**Evidence.** Plan (b): 'A row missing a value raises ValueError instead of leaking a stale code (verified)' and '`message = f"..."` goes on its own line right after the row, in every branch.' Ran with .venv-content/bin/python 3.12 (scratchpad/g12/rows.py), printing: 'block 1 -> accept OK edad OK' / 'row missing a value -> ValueError not enough values to unpack (expected 2, got 1)' / 'message forgotten -> review MISSING | edad OK' — the forgotten message keeps the previous block's 'edad OK' beside status review and code MISSING, with no error. S02's precedent the plan cites carries all three facts in one row: s02:176 'En `(True, 19, None)`, la primera posición indica que la conversión funcionó. La segunda guarda la edad `19` y la tercera contiene `None`'.

**Fix.** State the asymmetry once, in theory[11] (T4-B), where the third name is introduced: the row protects status and code mechanically, the message is protected only by the rule, and the way to see it is to delete one `message =` line and re-run — the same instructed-experiment form the plan already uses for the TypeError in T2-B. Alternatively carry all three in the row where no f-string needs an earlier value (`status, code, message = ("review", "MISSING", "Campo 'edad' ausente…")`), which matches s02:174-185 exactly and keeps the ValueError guard over all three.

### [minor] exam bank :849 (allowlists-ranges variant 3) and S03-selfCheck.Q5 (s03:2552)

**Problem.** Two problems share this variant. (1) Outcome O5 promises combined ranges and allowlists, but in one of three attempts it is assessed by :849, which tests S02's PEP 8 naming convention and not a combined rule. That breaks the bank's own family contract. (2) After the plan re-domains TIPOS_DOC and DOC_LEN to opaque ids, no S03 code has a document-type catalog. Yet :849 still names `ALLOWED_DOC_TYPES`, its explanation says «tipos de documento», and the self-check Q5 stem keeps «allowlist de tipos de documento» while the plan swaps only option 4 to 'CLI', a record-type code that is not a document type.

**Evidence.** seed.ts:849 '¿Por qué conviene nombrar la allowlist en `UPPER_CASE` (p. ej. `ALLOWED_DOC_TYPES`)…'; :853 correct option 'Por convención de constantes de módulo…'; :858 '(regiones, tipos de documento)'. S02 already teaches this: s02:294 'Constantes: UPPER_CASE'. s03_phase5_exam_bank.json, family S03-T3-A-EX, has skill 'Combinar allowlist + rango con accept/review/reject', equivalence note 'C: UPPER_CASE constante', and parallelism_rules 'cognitive_demand: A/B/C matched within family'. s03:2552 'Una allowlist de tipos de documento se implementa mejor como…'. The plan's Q5 change covers only option 4, 'DNI' → an opaque code such as 'CLI'.

**Fix.** Rewrite :849 as a combined-rule item using the plan's own verified theory[8] prediction: R-FUERA with edad 15 under the none → allowlist → range chain gives review NOT_IN_ALLOWLIST, because the allowlist branch runs first. Keep correctIndex 2 and distinct per-concept positions, and update the phase5 family note. Re-domain the Q5 stem to the same opaque catalog as T1-A-E2 and T3-A-E3, so the stem and option 4 describe one domain.

### [minor] learningOutcomes O4 (s03:30) + theory[3] p3 (s03:125)

**Problem.** The rationale for rewording O4 is factually wrong, and the plan leaves a conflicting definition of «guarda» optional. The plan drops «guard clauses» because 'its canonical form is the early return, which S03 no longer shows'. But theory[3], which the plan keeps verbatim, shows exactly that form and defines a guard by it. After the plan, the section defines guard twice: theory[0]/T2-B as the leading branches of an if/elif chain, and theory[3] p3 as an immediate return. The Q7 and :792 assessments test the return version (see the Q7 finding).

**Evidence.** s03:134-136 read `def decidir_region(region):` / `if region is None:` / `return "review"`. s03:125 reads '…por eso una guarda puede devolver `review` o `reject` de inmediato.' The plan's learningOutcomes row says 'its canonical form is the early return, which S03 no longer shows'. The plan's theory[3] row says 'Optional: narrow p3's clause … to «dentro de una función»'.

**Fix.** Make the theory[3] p3 narrowing mandatory, so the guard that returns is presented as the function form the learner applies from S05, while S03's guards are the leading branches of one chain. Correct the plan's O4 rationale: S03 shows early-return guards only in the held definition and never has the learner apply them. The reworded O4 stays as planned.

### [minor] satellite: figure S03-guard-order (figures/data/misc.ts:446, attached at s03:69)

**Problem.** A figure about guard order sits beside the one theory block in S03 whose code has no branch at all, and its caption uses «guarda» 217 lines before the term is defined. The plan corrects the figure's data and leaves the placement as an open question, so the jarring adjacency ships.

**Evidence.** s03:66-69: the figure is attached inside the block headed 'Comparaciones y el operador in' (subtopicId 'S03-T1-A'), whose code (s03:83-95) is six `print` calls of comparisons and `in` with no `if`. Caption, s03:71-72: 'Mover la última guarda al principio cambia la clasificación de todos los registros, no de algunos.' First definition of the term, s03:286: 'Una **guard clause** (salida temprana) valida precondiciones…'. Plan open_questions: 'Should the S03-guard-order figure (attached at s03:69, theory T1-A) move to T2-B, whose subject it draws?'

**Fix.** Move the figure to theory[7] (T2-B), where its caption's vocabulary and its four branches are the block's own subject, and give T1-A a figure of what T1-A teaches (three questions over one value: same value, belongs to catalog, absent) so the D5 count holds. If the move is refused, at minimum retitle the caption in T1-A's vocabulary (condition order, not «guarda») so no caption uses a term the section has not yet defined.

### [minor] satellite: prisma/seed.ts S03 exam bank (:644-990)

**Problem.** The rescope list says it caught the sites the planning output missed, but it still misses one distractor built on `except: pass`. D10 bans try/except before S09, and `pass` appears nowhere in S01–S03 content once the plan removes it from T2-A-E2. An S03 exam would show the learner both constructs before either is taught.

**Evidence.** - seed.ts:982: 'Silenciar el else con except: pass' (concept 'actionable-messages-branch-tests', correctIndex 1).
- The plan's rescope list names :722, :723, :749, :772, :778, :782, :806, :869, :878, :907 and :935, but not :982.
- `grep -w except` over s01–s03 finds 0 hits.
- terms.ts gives the Excepción entry the aliases 'except' and 'try/except'.
- decisions.md D10: 'Every earlier use is a forward dependency and comes out'.

**Fix.** Reword the :982 distractor into a wrong practice that uses only S03 vocabulary, for example «Borrar el `else` para que ningún caso llegue a `reject`». Keep correctIndex 1, and keep questions and explanations unique.

### [minor] satellite: prisma/seed.ts S03 exam bank (:644-990)

**Problem.** The plan removes all seven learner-facing CP-N1-A claims in s03 (52, 62, 1176, 2351, 2353, 2370, 2508), citing S02's precedent of zero mentions. It misses the CP-N1-A gate claim inside S03's own exam bank, which is in this round's scope. After the round, S03's exam would be the only S03 surface that names the Level-1 gate, while the section itself never mentions it.

**Evidence.** prisma/seed.ts:944, explanation of the invariants-examples item (the `validate_contacto` item at :935): 'Mínimo: un ejemplo por estado que la regla produce. El camino feliz solo no basta para el gate CP-N1-A.' A grep of seed.ts for CP-N1 finds no hit before :644, so S02's bank has 0, matching the cited precedent. The only other S03-range hit is :944. The plan's exam rescope list covers :722, :723, :749, :772, :778, :782, :806, :869, :878, :907 and :935, but not :944.

**Fix.** Add seed.ts:944 to the exam-bank rescope. Drop the CP-N1-A clause and keep the per-state rule, for example by ending the sentence on why the happy path alone is not enough for the invariant. Keep the explanation at 7 words or more and unique within the bank, and keep correctIndex 0.

### [minor] tests_to_rescope → "AFTER THE ROUND (procedure step 9): lower any ratchet that moved"

**Problem.** The stated reason for DECLARED_LATE_OWED dropping is false, and the direction of risk is inverted. Adding course-first definitions in S03 cannot lower this ratchet; only removing text or moving a firstSectionId earlier can. Nothing S03 removes this round touches any of the 19 late entries, so the number cannot drop — while any new S03 mention of a later-declared alias makes it 20 and trips the `<=` assert.

**Evidence.** glossary-first-use-ratchet.test.mjs:29 `DECLARED_LATE_OWED = 19`; survey() at :33-56 computes `first` as the earliest section whose JSON contains any alias, and flags `first < declared`. Adding a definition in S03 can only move `first` earlier, never later.
`grep -n "'len'|\"len\"|isascii|isdecimal" src/lib/glossary/terms.ts` → no matches: none of len(), .isascii(), .isdecimal() is a glossary term or alias, so glossing them cannot move this ratchet at all.
I reproduced survey() exactly (19 late, 5 dead — matching DECLARED_LATE_OWED=19 and NEVER_APPEARS_OWED=5). The 19: for(declared S04/first S02), truthiness(S03/S02), if(S03/S01), generator, return(S05/S03), coverage, unpacking(S06/S02), set(S03/S01), shape, merge, eda, missing-values, pipeline, cross-validation, train-test-split, mlops, entity-resolution, fastapi, llm. The only one whose first use is S03 is `return`, and theory[3] keeps it (and under ask_first option (b) it would move to S04, still < S05). So none drops.
Rise risk is concrete: `tipo-de-dato` is declared S06 with alias 'tipos de datos' and currently first-used S06; S03 has 0 occurrences today.

**Fix.** Replace the step-9 note with: "this ratchet cannot drop from an S03 round — verify it has not RISEN above 19 (any new S03 mention of an alias declared S04+ fails `late.length <= 19`)." Drop the len()/.isascii()/.isdecimal() rationale entirely.

### [minor] tests_to_rescope → NEW "S03 practice guard"

**Problem.** The guard exempts "theory[3]" by index, but ask_first option (a) moves that block to the end of theory, where its location keys become theory[11].*. If the owner takes it, the exemption lands on the T1-B block (no def) and the held-definition block's `def`/`return`/`->` is no longer exempt — the guard fails on the one block it was written to spare.

**Evidence.** The plan's own ask_first entry: "Option (a): move it to the end of S03 theory as a bridge. Exposure is unchanged, but the location keys become theory[11].*". The plan's tests_to_rescope wording is "No `def `, `return`, `for … in`, dict literal (regex \{\s*\"[^\"]+\"\s*:), `.get(` or annotation (`->`) may appear in any python code of theory (theory[3] exempt, held definition)".
Measured on today's file with that exact ban set: of the 42 counted programs, 35 offend (def 33, return 33, for..in 14, dict-literal 9, .get( 1, -> 8) and 20 of the 24 starters offend — so the guard does fail red today as the plan says, but the single exemption is the whole difference between green and red after the round.

**Fix.** Anchor the exemption to the block's heading ('Una regla con nombre: def, llamada y return') or to its code title (decidir_region.py), not to the array index, so it survives the ask_first move and any future reordering.

### [minor] theory[10] S03-T4-A (s03:412-468) and S03-T4-A-DEMO

**Problem.** The plan glosses `len()`, `.isascii()` and `.isdecimal()`, but p5's counterexample also names `isdigit()`, which gets no gloss. The plan also removes the course's only two code uses of `isdigit` before S05, and S05 then uses `c.isdigit()` 16 times. So `isdigit` is named in S03 without an explanation, and S05 loses its only earlier example.

**Evidence.** - Plan (theory[10]): 'p5 counterexample: \'١٢٣٤٥٦٧٨٩\', which isdigit() and isdecimal() accept and isascii() rejects' and 'Gloss len(), .isascii() and .isdecimal() in one sentence each'.
- s03:432 and s03:822 (`digits.isdigit()`) are the only uses in S01–S04 (grep: S01=0, S02=0, S04=0). The planned funnel replaces both.
- s05:585 `d = "".join(c for c in raw if c.isdigit())` is the first of 16 S05 uses.
- Verified on 3.12: '١٢٣٤٥٦٧٨٩'.isdigit() → True, .isdecimal() → True, .isascii() → False.

**Fix.** Add `.isdigit()` to the T4-A gloss sentence, in the same `x.metodo()` form: it also accepts non-ASCII digits, which is why the funnel adds `.isascii()`. Record it with len/isascii/isdecimal as a course-first definition to recount after the round.

### [minor] theory[11] S03-T4-B, S03-T4-B-DEMO, S03-T4-A-E1 (OR alternative `edad > 120`)

**Problem.** R3 says an OR arm needs a non-first alternative, because the first alternative survives deleting the rest. The plan applies that only to match `|`. In these three O7/O8 items the OUT_OF_RANGE branch is `edad < 0 or edad > 120`, and the only case reaching it is -5 or -1, the first alternative. The messages and invariant claim 0–120, but the upper bound can be deleted and every assert stays green.

**Evidence.** t4b_theory.py printed 'theory T4-B green with `or edad > 120` deleted: True | 500 -> OK', 'T4-B-DEMO green with `or edad > 120` deleted: True | 500 -> OK' and 'T4-A-E1 green with `or edad > 120` deleted: True | 500 -> OK'. The plan's case lists are theory[11] 'None|True|-5|0', T4-B-DEMO 'None / "x" / -5 / 35' and T4-A-E1 '30, -1, None, "x"'.

**Fix.** Extend R3's OR rule to `or` conditions. In theory T4-B, add a 121 → OUT_OF_RANGE block; its output is not pinned. In T4-A-E1, add 121 → reject and extend Éxito. T4-B-DEMO's output is pinned byte-identical, so either add the block and accept the pin change, or name 121 as the retrospective's defective-change answer ('deleting `or edad > 120` stays green until you add 121').

### [minor] theory[4] (s03:165-188), theory[5] (s03:189-233)

**Problem.** Truthiness is defined three times in the same section and shown as a bool table four times in a row. The plan keeps all three definitions and widens the fourth table rather than reducing any, so the section's opening reads as a teacher circling the same point.

**Evidence.** Three definitions: s03:42 'a esa comodidad se le llama *truthiness*'; s03:168 'La regla que usa para hacerlo se llama **truthiness**'; s03:194 'Python evalúa la **truthiness**, es decir, si trata un valor como verdadero o falso'. Four consecutive bool tables after the rebuild: theory[4] (plan: 'Print repr(monto) first, then label each line by its expression'), theory[5] (plan: 'Each computes `ausente` … then prints repr(monto), bool(monto), ausente and negativo on one line' for None/0/-5/150), S03-T1-B-DEMO (plan: 'One evidence line per block: value, bool(monto), policy' for None/0/-5/150), S03-T1-B-E1 (plan: '12 two-line blocks (`v = <value>` / print(repr(v), "→", bool(v)))'). theory[5] and T1-B-DEMO run the identical four values.

**Fix.** Keep the held definition at theory[4] p0 and demote s03:42 and s03:194 to back-references ('la truthiness que definiste en el bloque anterior'), which the glossary gate should prefer anyway. Give theory[5]'s blocks values that theory[4] and the demo do not already run (for example "" and "0"), so the fourth table adds the text cases T1-B's prose claims rather than repeating None/0/-5/150 a third time.

### [minor] theory[9] S03-T3-B (s03:369-411)

**Problem.** The R3 refinement invites a sentence in learner prose whose subject is the instrument, not the rule: that a given `case` cannot detect a deleted alternative because the default carries the same status. «Say so or say nothing» explicitly authorises writing it, and an open question asks whether the table itself should say review rows are documentation. That is disclaimer speak and meta commentary (D12, G1, G2) in the section's held match/case explanation.

**Evidence.** Plan, theory[9] constraints: «Per the R3 refinement, the NOT_IN_ALLOWLIST block shows the arm's row but cannot detect a dropped `| "NOT_IN_ALLOWLIST"`, because the default is also review; do not claim it does.» S03-T3-B-DEMO constraints: «The NOT_IN_ALLOWLIST row catches a wrong status on its own arm, not a deleted arm; say so or say nothing.» open_questions #3: «Should the table itself say that review rows equal to the default are documentation?» writing_rules D12 bars meta commentary; G2 bars hedging and neutrality that never commits.

**Fix.** Resolve «say so or say nothing» to «say nothing in learner prose». If the point must appear, turn it into the teaching statement it actually is — the wildcard absorbs every review row, so listing them is documentation of the table, not extra protection — and put it in the demo's retrospective as a question the learner answers by deleting an alternative, not as a caveat in the theory.

### [minor] weDo.intro (s03:918-919)

**Problem.** The convention introduces a new learner failure mode — copies of the chain that drift apart — and the mitigation appears exactly once, in weDo.intro, for 24 exercises. Twenty of the 24 have no assert, so in those a divergent copy prints a wrong line and nothing names it. The plan itself identifies this failure as a verified false green when it occurs in a shipped item, then relies on a single sentence to stop the learner reproducing it by hand.

**Evidence.** Plan, weDo.intro: "fix the chain once, copy the repaired block, change only its first line". Plan, S03-T4-B-E3: "The fix-once starter removes the verified false green (fixing only the 18 copy left three `> 18` copies passing)." Plan, convention (a) R1: "Only the opening line differs between blocks" — so a drifted copy is invisible unless the learner diffs by eye. Only T4-B-E2, T4-B-E3, T4-A-E1 and T4-A-E3 carry asserts or an expected value per block; the other twenty items rely on the Éxito line alone.

**Fix.** Make "repara la cadena antes de copiarla" the first instruction step of every R5(a) item rather than a single line in weDo.intro, and add one edgeCase entry naming a drifted copy (e.g. 'una copia editada a medias') to those items, so the failure mode the convention creates is one the learner has been told to look for.

### [minor] weDo.intro (s03:918-919)

**Problem.** The instruction «Add the case-block routine once, in English terms for the writer» is ambiguous about which language reaches the page. weDo.intro is learner-facing Spanish; a literal reading produces English prose there, which D7 forbids outside `code`.

**Evidence.** Plan, weDo.intro: «Add the case-block routine once, in English terms for the writer: fix the chain once, copy the repaired block, change only its first line.» The binding context's «Do not write learner-facing Spanish; describe changes in English» is addressed to the reviewer, not to the writer executing the plan, so nothing else in the item disambiguates it.

**Fix.** Rewrite the bullet as «Add the case-block routine once, in Spanish (the English below is the brief, not the copy): …», and do the same for any other item whose bullet mixes brief and copy.

### [minor] weDo.intro (s03:918-919) and theory[3] bridge sentence

**Problem.** The plan requires a forward reference to 'S04's loop' in weDo.intro and in theory[3]'s bridge sentence, but does not constrain the wording. If the Spanish names `for` («el bucle `for` de S04»), the extractor counts a new use of `for` in S03, which is first explained only in S04. That would add a surprising use in the same round that removes the other 23.

**Evidence.** - Plan convention: 'The repetition is the honest cost that S04's loop and S05's def remove. The prose says so once, in weDo.intro and in theory[3]'s bridge sentence'.
- weDo.intro row: 'Add that the repetition is what S04's loop and S05's functions will remove.'
- terms.ts:77 gives `for` the aliases ['bucle for', 'bucles for', 'for']; bare «bucle» is excluded on purpose (terms.ts:74-76).
- concept_map.json: for.first_definition = S04-T1-A.p0.

**Fix.** State in both rows that the forward reference says «repetir un bloque» or «los bucles de S04» and never names `for`. Add the phrase check to the widened practice guard.

## Round 2

### [blocker] S03-selfCheck.balance (s03:2520-2582) + assessments «OUTCOME → SELF-CHECK MAP»

**Problem.** The plan's new outcome→self-check map — the artifact this round produces to close dimension 6 — is built against O4–O8 only and misses the one outcome with ZERO self-check items. O7 «Enunciar invariantes de campo con ejemplos `accept`/`reject`/`review`» (s03:33) is not touched by any of the 8 stems, yet the plan's gap list names only «O4's unreachable-branch clause, O8's branch-test clause and O5's combined range+allowlist», and then spends the single spare item on O4 or O8 — leaving O7 at zero after the round. Because badge_readiness_audit.py:59-60 maps `selfcheck.` events to the EXAM activity, this self-check IS S03's assessment of record for the badges, so O7 is an outcome the badge surface never tests.

**Evidence.** Plan, assessments: «Against s03:30-34 that leaves O4's unreachable-branch clause, O8's branch-test clause and O5's combined range+allowlist unassessed, while O2 has three items.» s03:30-34 is O4..O8 — O1, O2 and O3 are never checked, and O7 (s03:33) is inside the checked range but omitted. The 8 stems, read verbatim: s03:2523 «comprobar la ausencia de un campo opcional» (O1/O2); s03:2530-2531 «qué debe ocurrir con los valores None y 0» (O2); s03:2538 «En una cadena if/elif/else, ¿qué ocurre cuando la primera condición es verdadera?» (O3); s03:2545 «¿Qué devuelve la expresión `"" or "default"`…» (O2); s03:2552 «Una allowlist de tipos de documento se implementa mejor como…» (O1/O5); s03:2559 «¿Cuándo aporta más claridad `match/case` que `if`…» (O6); s03:2566-2567 «¿por qué debe ir `if valor is None` antes de `if valor < 18`?» (O4); s03:2574-2575 «¿Cuál de estos mensajes de validación es accionable…» (O8, message clause only). None states an invariant or asks for an accept/reject/review example set. O7 is assessed in the bank (concept `invariants-examples`, prisma/seed.ts:905, :919, :933) and nowhere in the self-check.

**Fix.** Correct the map to run over all 8 outcomes (s03:27-34), record O7 = 0 items and O1 = 0 items of its own, and re-target Q4 — O2's third item, the weakest of the three and the one the plan already flags as an exam twin — to O7: an invariant stem built from the rebuilt theory[10] funnel (a 9-digit `contacto` invariant plus which of four example sets covers accept / reject / review), keeping correctIndex 3, the [2,0,1,3,2,0,1,3] sequence and the 2/2/2/2 counter. Then state the remaining O4-dead-branch and O8-branch-test clause gaps as the trade-off covered only by the bank (:806, :962), instead of spending the spare item there.

### [major] SECTION (convention (a) opening line, convention (b) tuple row, theory[7] brief)

**Problem.** The tuple row is the rebuilt section's universal case-block opener and its universal result carrier, and no brief in the plan ever asks for the construct to be NAMED in learner Spanish. The maps therefore stay blind to it: `tuple` and `unpacking` will still record zero uses in S03 after a round that puts the construct in ~30 blocks. The plan's own replacement wording describes only the left-hand side («asigna los dos nombres en una línea») and never says what `("reject", "OUT_OF_RANGE")` is. «tupla» is not banned and is not barred by any gate — only «desempaquetado» is — so the silence is an omission, not a constraint.

**Evidence.** concept_map.json, `tuple`.uses: S02 basics.theory[5].p0/p1/p3 then S05 functions-contracts.theory[6].* — no S03 entry at all. `unpacking`.uses: S02 basics.theory[5].p1 then S06 collections.* — no S03 entry. terms.ts:451-453 `id: 'tuple'` / `term: 'Tuple'` / `aliases: ["Tuple", "tupla", "tuplas"]` with firstSectionId 'basics' (S02), so «tupla» in S03 prose is legal and would credit the concept; terms.ts:459-461 `id: 'unpacking'` / `term: 'Desempaquetado'` / firstSectionId 'collections' (S06) is the only one the gate bars, and glossary-first-use.test.mjs:67-80 matches the `term` field only, not the aliases. Plan text, convention (a): «For two or more values it is one S02 tuple-unpacking line, flat ... (`region, edad = ("R-FUERA", 30)`)»; convention (b): «`status, code = ("reject", "OUT_OF_RANGE")` — S02's «Tres resultados que viajan juntos» (s02:174-185)»; theory[7] item: «tie it in one sentence to S02's `ok, edad, error = resultado` — without the word «desempaquetado» (declared S06; say «asigna los dos nombres en una línea»)». Nowhere does any item, convention or constraint ask for «tupla». Separately, the S02 form the plan cites is a TWO-step one: s02:176 «Una **tupla** reúne varios valores en un orden fijo. Se escribe entre paréntesis, como `(True, 19, None)`»; s02:177 «La línea `ok, edad, error = resultado` reparte las tres posiciones»; and s02's `tupla_resultado.py` block is `resultado = (True, 19, None)` then `ok, edad, error = resultado`. Assigning straight from a literal, and R8's parenthesised long target list, are forms S02 never shows (both run: verified on .venv-content 3.12, `region, edad = ("R-FUERA", 30)` and a wrapped 9-name target list both execute).

**Fix.** Add to convention (b) and to theory[7]'s brief: the sentence that introduces the first row must name «tupla» (legal in S03 — firstSectionId 'basics'), show it as S02's form with the intermediate name removed (S02 built `resultado` first, S03 writes the literal on the same line), and keep the «desempaquetado» ban with an explicit note that the ACTION stays unnamed until S06. Add one S02-shaped two-step line to theory[7]'s code so `tuple` gains an S03 `theory.code` example, and record the expected concept-map row change (tuple: S03 uses 0 → n) in the after-round diff, where today the plan records nothing.

### [major] SECTION (open_questions → «INSTRUMENT BLIND SPOTS»)

**Problem.** `match`/`case` has no glossary term and no concept-map row anywhere in the course, so the entire T3-B subtopic — an outcome, two theory blocks, a demo, three exercises and a self-check item — is invisible to every dimension-1 instrument: it can never be reported as used-before-explained, under-exemplified or figure-short, and the hover glossary gives a learner nothing. The plan increases match's footprint in four objects and its own blind-spot list, which names six instruments, never mentions it.

**Evidence.** terms.ts has 105 entries and none whose id or term contains 'match' (extracted with a regex over `id:`/`term:`/`aliases:`/`firstSectionId:`; result `[]`). concept_map.json has 108 concept ids and no 'match' key. `if`'s aliases are the closest and do not cover it: terms.ts:131 `aliases: ['if / condicional', 'if/else', 'condicionales', 'condicional', 'elif', 'else', 'if']`. scripts/concept_syntax.mts:45-48 `SYNTAX` has exactly two rules, `dict` and `repr`, so no syntax-level credit either. Meanwhile s03:32 is a learner-facing outcome naming it («Leer una decision table y expresar reglas claras con if o match según el caso») and `match code:` appears at s03:384, 760, 1865, 1880, 1940. The plan adds to all of these: theory[9] «four blocks: OK, NOT_IN_ALLOWLIST ... BAD_TYPE ... and FOO», T3-B-DEMO «THREE blocks by default», T3-B-E2 «The output gains one line, 'BAD_TYPE → reject'», T3-B-E3 «Code blocks OK / MISSING / OUT_OF_RANGE / NEW FOO with `match code:`». The plan's open_questions «INSTRUMENT BLIND SPOTS» list names concept_map annotation/len, planted_defect_audit, capstone readiness rows, figure caption/alt credit, prose aliases, positions[a::3] and SteppedCode — and not this.

**Fix.** Add it to the blind-spot list with the counts above, and record in OPEN_QUESTIONS/WORK_QUEUE that S03 teaches and exercises a construct with no glossary entry. The instrument fix (a `match` / `case` term with firstSectionId 'decisions-rules', or a SYNTAX rule in concept_syntax.mts) is its own commit with a baseline proof; until then the section must state the shortfall rather than let a clean concept-map row imply coverage.

### [major] assessments «(5) SELF-CHECK TWINS»

**Problem.** The twin census is wrong by a factor of ~2.7 and the plan's mitigation therefore covers a third of the leak. The public self-check reveals the correct option AND the explanation after submit, with no attempt cap; at the plan's own standard (a variant whose key is answered in advance) at least 8 of the 24 bank variants are pre-answered across 7 of the 8 concepts, not 3 of 8 concepts. One leak is cross-family and so invisible to a same-concept scan: self-check Q5's explanation publishes the keyed rationale of an `invariants-examples` variant. This matters beyond fairness: exam/start computes `exposedItems` only from `keysSeenBeforeFix` (legacy-submit rows), so a self-check twin can never raise it, and `isEvidence` (src/lib/exam-scoring.ts:72-79) admits the attempt as evidence for credentials with `exposedItems === 0`.

**Evidence.** Reveal: SectionView.tsx:902 `const showCorrect = submitted && oIdx === q.correctIndex` (green + check icon) and :946-956 render `q.explanation` after submit. Draw: src/app/api/exam/start/route.ts:196-205 prefers variants no earlier attempt drew, so over MAX_EXAM_ATTEMPTS=3 all three variants of every concept are drawn exactly once. Pairs the plan misses, quoted: (a) Q1 explanation s03:2527 «`is None` responde la pregunta de presencia sin colapsar valores válidos como `0` o `""` … `is 0` confunde identidad con valor» vs seed.ts:682 key «if valor is None: para ausencia; if valor == 0: para el valor cero» + :687-688. (b) Q3 explanation s03:2542 «La primera condición verdadera gana y las ramas posteriores se omiten» vs seed.ts:740 key «Porque la primera condición verdadera gana y las ramas son excluyentes; tres if pueden sobrescribir el status» — and the same sentence answers :761-773 («El segundo if también se evaluó y sobrescribió status»). (c) Q6 explanation s03:2563 «los rangos numéricos y las combinaciones de campos suelen leerse mejor como comparaciones» vs seed.ts:897 key «Cuando hay rangos numéricos o combinaciones de varios campos que no son literales finitos». (d) CROSS-FAMILY: Q5 explanation s03:2556 «`assert` no debe ser la única validación de producción porque `python -O` puede desactivarlo» vs seed.ts:926 key «python -O desactiva asserts; las reglas de negocio deben devolver status/code/message» + :930 — the plan is rewriting :926's key while leaving the self-check sentence that gives it away. (e) Q2 s03:2530-2535 vs seed.ts:691-700. With 8 leaked variants over 3 attempts that is ~2.7 pre-answered items per 8-item attempt against PASS_THRESHOLD 70 (exam-scoring.ts:8), while `exposedItems` reports 0.

**Fix.** Extend the twin table to Q1↔:676, Q2↔:691, Q3↔:733 and :761, Q5's explanation↔:926, Q6↔:890, alongside the three already listed, and state the count as 8 of 24 variants / 7 of 8 concepts. Cheapest mitigation, since the bank rescope already touches most of these: cut the give-away clause from the self-check explanation (Q3's second sentence, Q5's `python -O` clause, Q6's rangos/combinaciones clause) rather than moving five more bank items, and keep every explanation ≥22 words by replacing those clauses with the misconception the item's own distractor encodes. Record in the after-round hand checks that `exposedItems` cannot model this, so the twin table is the only control.

### [major] assessments «TOPIC EVALUATIONS»

**Problem.** The plan's statement is true of the section file and false of the artifact: S03's four topic-evaluation packages already exist, generated and checked in, and are simply never surfaced, while S01 and S02 each render four. Dimension 6 names `topicEvaluations` explicitly, and the plan closes it with «Nothing to change and nothing added» — an absorbed trade-off, not a stated one. A learner walking S01 → S02 → S03 loses the formative evaluation at exactly the section that introduces decision logic.

**Evidence.** `course-state/topic_evaluations/s03_te.json` exists and holds four packages: S03-T1-TE, S03-T2-TE, S03-T3-TE, S03-T4-TE (verified with .venv-content/bin/python: s01 4, s02 4, s03 4). S01 renders its four at s01-setup.ts:2472, :2498, :2524, :2550; S02 renders its four at s02-basics.ts:2312, :2338, :2364, :2390; `grep -rn topicEvaluations src/lib/course/sections` returns only s01, s02 and s30 — S03 has no field. The field is rendered when present: SectionView.tsx:786 `{section.topicEvaluations && section.topicEvaluations.length > 0 && (`. scripts/generate_topic_evaluations.py:2 says the artifact is «4 TE × 52 sections».

**Fix.** Either (a) port the four S03 packages into the section as `topicEvaluations`, rescoped to the post-round practice — the deliverables must name case blocks and per-field status/code/message, never a function, a dict or a loop, and must pass the new bank/self-check text guard — or (b) record the absence as an explicit stated trade-off in OPEN_QUESTIONS and WORK_QUEUE («S03's generated TE packages are not surfaced; S01 and S02's are»), with the reason. Do not close dimension 6 with «nothing to change» while the artifact exists.

### [major] convention (f) FIGURES — "so both S03 figures are credited to nothing"

**Problem.** The plan's figure baseline is wrong on both counts, and it contradicts its own numbers in the same sentence. S03 has THREE `theory.figure` events, not two, and one of them IS credited: `decisions-rules.theory[3].figure` (S03-call-return) carries `mentions: ['return','parameter']` and `defines: ['return']`. That event is precisely where convention (f)'s own "`return` 1/5; `parameter` 1/5" comes from. Because the plan believes no S03 figure is credited, it (a) treats the whole figure ledger as immovable this round, (b) declares the tri-state redraw "the section's only honest figure credit available", and (c) prescribes an after-round diff ("no figure_count changes; record that in the after-round diff") that omits the one S03 figure whose credit can actually regress — the one this same round rewrites (the flows.ts satellite rewrites S03-call-return's alt and outcome).

**Evidence.** Section source: three figure blocks — s03:69 `id: "S03-guard-order"`, s03:115 `id: "S03-call-return"`, s03:237 `id: "S03-tri-state"`.
Ran over .fixer/events.json with .venv-content/bin/python:
  decisions-rules.S03-T1-A.figure | mentions= [] | defines= []
  decisions-rules.theory[3].figure | mentions= ['return', 'parameter'] | defines= ['return']
  decisions-rules.S03-T2-A.figure | mentions= [] | defines= []
course-state/concept_map.json agrees: return.figures = [{"section":"S03","location":"decisions-rules.theory[3].figure"}], figure_count 1, figure_target 5; parameter.figures identical, figure_count 1.
Crediting path confirmed at scripts/course_event_extractor.mts:380-381 — `push(sid,'theory.figure', ..., `${b.figure.caption} ${b.figure.alt}`)` — and scripts/concept_map.py:139-140 (`if visible and e["kind"] in FIGURE_KINDS: c["figures"].append(rec)`), FIGURE_KINDS = {"theory.figure"} (concept_map.py:44).

**Fix.** Rewrite convention (f)'s baseline: S03 ships three figures; S03-guard-order and S03-tri-state are credited to nothing, and S03-call-return is the section's only credited figure, carrying `return` 1/5, `parameter` 1/5 and a `defines: ['return']` record. Then state the round's expected post-round figure ledger in full (if 0→1; return 1→1; parameter 1→1; exception 3→? per the next finding; set 2, truthiness 0 unchanged) as the target for procedure step 7's hand diff, and add to the flows.ts satellite item an explicit check that the rewritten caption+alt still yields mentions ['return','parameter'] and defines ['return'] — the alt rewrite to the None path must not be the only place those terms lived.

### [major] exam bank prisma/seed.ts:705-716 (truthiness-shortcircuit variant B)

**Problem.** The stem misdescribes what Python does, and the plan's only change to this item is to move it «to a different operand pair», which preserves the defect. `"" or "default"` is an expression: it prints nothing. The self-check twin at s03:2545 gets this right («¿Qué devuelve…»), so the section already carries the correct verb; the exam is the copy that is wrong. Three of the four options are phrased as values, so a learner who answers the question literally («nothing is printed») has no option to pick.

**Evidence.** prisma/seed.ts:706 `question: '¿Qué imprime la expresión `"" or "default"` en Python y por qué?'`. Run under .venv-content/bin/python 3.12, a file whose whole body is the line `"" or "default"` produced empty stdout with rc=0; `python -c 'print(repr("" or "default"))'` printed `'default'`. Self-check Q4 at s03:2545 uses the correct verb: «¿Qué devuelve la expresión `"" or "default"` en Python?». The plan's assessments (5) says only «:706 to a different operand pair».

**Fix.** When rescoping :706, change the verb as well as the operand pair: «¿Qué valor entrega la expresión `<nuevo par>` en Python y por qué?», keeping correctIndex 2 and the concept. «Entrega/devuelve» is the operand sense the plan already blesses for Q4, so it does not collide with the stale-name ban on `return`/«devolver» as a function verb.

### [major] s03-t1-b-e1 (s03:1064-1113)

**Problem.** The plan's conflict resolution drops `set()` together with `()` and `range(0)`, but the stated reason — an untaught construct — is false for `set()`. `set` is declared for this section and first defined 1000 lines above, in T1-A of S03 itself, and the empty set is the falsy form of the one collection S03 teaches for allowlists. The cut also leaves the concept that S03 both declares and defines with no occurrence of its name in any S03 code at all, and forces a replacement (`Decimal("0.00")`) that drags in the section's first import.

**Evidence.** concept_map.json `set`.first_definition = {'section': 'S03', 'location': 'decisions-rules.S03-T1-A.p2'}; terms.ts:489-491 `id: 'set'` / `term: 'Set'` with firstSectionId 'decisions-rules'. The definition itself is s03:79: «Para una lista permitida de códigos fijos, aquí usarás un **`set` de literales**. Un `set` reúne valores sin repetirlos; lo estudiarás a fondo cuando lleguen las colecciones» — i.e. introduced here on purpose and deferred only for depth, unlike `{}` (dict, first_definition S04) and `()` (never shown). The dropped value is at s03:1089/1097 (`vals = [None, False, 0, 0.0, "", [], {}, set(), range(0), "x", 1, [0]]`) with the pinned output line `set() → False` at s03:1107. Plan text, T1-B-E1: «`set()` and `range(0)` also go»; open_questions: «I dropped `()`, `set()` and `range(0)`» under a resolution whose premise is «no untaught literal». After the round, S03's `set` mentions in .fixer/events.json drop from 8 to prose only: today they are S03-T1-A.p2 (theory.paragraph), S03-T1-A-DEMO.preamble, S03-T1-A-E2.starter (header «membership set TIPOS_DOC», which the plan re-domains off TIPOS_DOC), S03-T1-B-E1.starter and .solution (`set()`, dropped), youDo.starter (the plan bans `set()`), selfCheck[4].opt[2] and .explanation — and none of the eight is a `theory.code`/`ido.code` event, so `set` already has 0 S03 examples under EXAMPLE_KINDS (scripts/concept_map.py:40).

**Fix.** Keep `set()` in the value table — it is in scope by the section's own first definition — and drop one of the S02-typed duplicates instead if nine values is the cap. State in the item's constraints that `set` is S03-declared (terms.ts:489-491) so the exclusion reasoning for `{}` and `()` does not extend to it, and record in the after-round diff that S03 credits `set` only through prose and the self-check.

### [major] s03-t1-b-e1 (s03:1064-1113) — starter

**Problem.** The plan puts `from decimal import Decimal` at the top of the item and simultaneously moves the starter to R5's main rule (one block, `v = 0`, remaining values listed in text). Both branches are broken: with the import the starter ships an import nothing in it uses, and without it the learner who copies the listed `Decimal("0.00")` row stops with `NameError: name 'Decimal' is not defined` — an error convention (d) forbids. The plan's «no unused import» parenthesis only covers the solution, and nothing in the item's text names the import, which is S03's first.

**Evidence.** Plan, T1-B-E1: «NINE two-line blocks ... None, False, 0, Decimal("0.00"), "", [], "0", " ", [0] ... `from decimal import Decimal` at the top (Decimal is shipped, not a prediction, so no unused import)» and, four bullets later, «STARTER takes R5's MAIN rule, not the exception: one block (`v = 0`, printing `v is not None` → True where bool(0) is False), with the remaining values listed in text.» Convention (d): «A DEFECT starter may exit with the item's own named error: AssertionError for a red test (T4-B-E3), TypeError for guard order (T4-A-E1, the youDo's text case). Never for an unrelated reason.» S03 has no Python import today: `grep -n "^from \|^import \|    from "` over src/lib/course/sections/s03-decisions-rules.ts returns only line 11, `import type { CourseSection } from '../../types'` (TypeScript). `import` is on LESSON_READINESS.md step 2's explicit watch list («Read the code for constructs used without their name (`assert`, `repr`/`!r`, dict and set literals, imports, methods, `in`, slicing)»), and no glossary term or concept-map key models it (108 concept ids, none for import). Verified on .venv-content 3.12: `bool(Decimal("0.00"))` is `False`, so the value works — the defect is the import contract, not the value.

**Fix.** Decide the starter explicitly. Either keep `set()` (see the previous finding) and drop `Decimal` so the item needs no import at all, or ship the import in BOTH starter and solution and make the starter's one block use it (`v = Decimal("0.00")` as the shipped block, with `0` in the text list), and add one clause to the instruction naming the import line as S02's `from decimal import Decimal, ROUND_HALF_EVEN` (s02:403) reduced to the one name this file needs. Say which in the item's constraints so the R5 rewrite cannot silently pick the NameError branch.

### [major] satellite: figure S03-guard-order (misc.ts:446; caption/alt s03:70-73) + convention (f)

**Problem.** The plan moves this figure into theory[7] (T2-B) and mandates that its note become the TypeError experiment, and then declines the free, honest concept credit that move creates. `exception` is load-bearing, sits at 3/5 with figure_gap 2 (D5 sequencing tier 1), and is FIRST DEFINED in exactly the block the figure is moving into. The plan instead writes a permissive clause — "Its caption may name the excepción/TypeError only if the figure actually shows it" — with no instruction, and then asserts the tri-state redraw is "the section's only honest figure credit available this round". By the plan's own mandated note, the figure does show it, so the condition is already satisfied and the credit is simply left on the floor.

**Evidence.** course-state/concept_map.json: exception → figure_count 3, figure_target 5, figure_gap 2, load_bearing true, first_definition {"section":"S03","location":"decisions-rules.S03-T2-B.p0","kind":"theory.paragraph"}; its three figures are S09-T2-A, S12-T1-A, S14-T1-B — none in S03.
src/lib/glossary/terms.ts:189-191 — id: 'exception', aliases: ['excepciones','excepción','exceptions','exception','except','try/except'] (so «excepción» in caption or alt credits it; a bare `TypeError` does not).
Plan text, same item: "Replace it with a claim the new rows make true and that running code can check: moving the `< 18` row first makes None stop with TypeError".
No surprising-use risk: scripts/course_event_extractor.mts:372-381 pushes `theory.heading`, then every `theory.paragraph`, then code/callout, and `theory.figure` LAST — so a T2-B figure event follows T2-B.p0's definition.

**Fix.** Make it mandatory, not permissive: the moved figure's ALT must name «excepción» in a Spanish sentence tied to what the figure draws (e.g. the reorder row producing a `TypeError`), keeping the caption on the ordering claim so caption and note still say different things. Record `exception` 3/5 → 4/5 in the after-round figure diff, and drop the claim that tri-state is the only honest credit available — there are two.

### [major] satellite: figure S03-tri-state — the fallback clause ("If the owner prefers the funnel drawing, move it to T1-B or T2-B")

**Problem.** The plan's own escape hatch collides with the plan's other figure decision and silently cancels the round's only figure gain. A theory block carries exactly one figure, and theory[7] (T2-B) is already the destination the guard-order item claims. If the owner takes the fallback and moves tri-state to T2-B, one of the two figures has no block; if the owner moves it to T1-B, T2-A ends the round figure-less and `if` stays at 0/5 and L2 — the exact result convention (f) sells as the round's D5 win. The plan never says which figure wins the block, and no test would catch the conflict, because figure-data-schema checks attachment per SECTION file, not per theory block.

**Evidence.** src/lib/types.ts:48 — `figure?: Figure` (singular, one per TheoryBlock); scripts/course_event_extractor.mts:379-381 — `if (b.figure) { push(...) }`, one event per block.
Plan, guard-order item: "MOVE IT to theory[7] (T2-B)". Plan, tri-state item: "If the owner prefers the funnel drawing, move it to T1-B or T2-B".
The gain at risk: concept_map.json `if` → figures [], figure_count 0, figure_target 5, depth L2, load_bearing true; its two headings (decisions-rules.S03-T1-B.heading at s03:190 'Qué es verdadero en un if…' and decisions-rules.S03-T2-A.heading at s03:235 'Ramas de decisión con if/elif/else') and 436 examples mean a figure is the single missing ingredient for L3 (concept_map.py:152-154: L3 requires headings AND figures AND examples).
tests/adversarial/figure-data-schema.test.mjs:21-29 builds attachments per section FILE, so two figures competing for one block is not a test failure.

**Fix.** Delete the fallback or bind it: state that theory[7] is reserved for S03-guard-order, and that tri-state stays on T2-A because that block is the only place a figure can move `if` from 0/5 to 1/5 and L2 to L3. If the owner really wants the funnel drawing kept, the fallback must name which figure vacates theory[7] and restate the resulting figure ledger (`if` stays 0/5, L2) as work left undone.

### [major] tests_to_rescope / "AFTER THE ROUND" — no figure instrument is named anywhere in the plan

**Problem.** This round rewrites a bespoke animated SVG component (S03TriState.tsx), grows a data figure from 4 to 5 branches (changing its computed SVG height and its step count), moves a figure between theory blocks and rewrites two captions and three alts — and the plan's whole test inventory (tests_to_rescope plus the "DO NOT RESCOPE; these stay binding" list plus the five after-round hand checks) names not one of the four instruments that guard figures. Worse, the one that looks like it would catch a geometry spill is provably blind to this component, and the one that would catch it is wired to nothing.

**Evidence.** Instruments that exist and are unnamed in the plan: tests/adversarial/figures-static.test.mjs, tests/adversarial/figure-data-schema.test.mjs, tests/adversarial/figure-geometry.test.ts (all three run under `npm run test:adversarial:node` — package.json: "node --experimental-test-module-mocks --import tsx --test tests/adversarial/*.test.ts tests/adversarial/*.test.mjs"), and scripts/figure_render_probe.mjs.
Blind spot, measured: figures-static.test.mjs:103-113 checks off-canvas geometry with `src.matchAll(/x=\{(\d+)\}\s+y=\{[^}]+\}\s+w=\{(\d+)\}/g)` — literal numbers only. Ran that exact regex against src/components/course/figures/S03TriState.tsx: "literal boxes found: 0". Every box there is computed (`x={x}` / `w={doorW}`, S03TriState.tsx:67-70, :95-101), so a redraw that runs off the 560 canvas fails nothing. The canvas is real: FIG.width = 560 (src/components/course/Figure.tsx:141); with startX=96, doorW=132, gap=28 (S03TriState.tsx:35-38) three columns end at 548 and four at 708.
`grep -rn "figure_render_probe" package.json tools/fixer/*.py audit/fixer/LESSON_READINESS.md` returns nothing — the probe is manual.

**Fix.** Add to tests_to_rescope / after-round: (1) run `npm run test:adversarial:node` and name tests/adversarial/figures-static.test.mjs (no literal hex, FIG.width viewBox, ≥14px type floor, motion SVG length attrs), figure-data-schema.test.mjs (caption and alt each >20 chars, headline ≤130, one section per figure, id names its section) and figure-geometry.test.ts as binding; (2) state the S03TriState geometry budget explicitly — the redraw stays at three columns (96 + 3·132 + 2·28 = 548 ≤ 560); a fourth column would end at 708 — and note that figures-static cannot see it; (3) run scripts/figure_render_probe.mjs by hand after the redraw, because nothing runs it automatically.

### [minor] SECTION (convention (f) figures)

**Problem.** The plan reports truthiness only as a figure ratio («truthiness 0/1») and never as what the map actually says: truthiness is at depth L1, the lowest teaching depth for a defined concept, because it has zero worked examples anywhere in the course. It is the concept S03 both declares and holds the first definition of, and the plan rebuilds theory[4] and theory[5] code from scratch — the one chance this round to credit it — without doing so or recording the gap.

**Evidence.** concept_map.json `truthiness`: depth 'L1', examples 0, headings 0, figures 0, load_bearing False, figure_target 1, figure_gap 1, declared_first_section 'decisions-rules', first_definition {'section': 'S03', 'location': 'decisions-rules.outcome[1]'}. scripts/concept_map.py:152-160 sets depth: L3 needs headings AND figures AND examples, L2 needs examples, otherwise L1; :182-183 `load_bearing = depth in ("L2","L3") and len(sections_used) >= 3` and `figure_target = 5 if load_bearing else 1`. EXAMPLE_KINDS (concept_map.py:40) is {theory.code, ido.code, theory.code.explanation}, credited through the event's `mentions`, so a concept is exemplified only if a code block NAMES it — and none does: in .fixer/events.json the 35 S03 `truthiness` mentions are outcomes, paragraphs, callouts, preambles, hints, instructions, a title, tests, youDo fields, self-check explanations and a resource, with no `theory.code` or `ido.code` among them. The plan's (f) lists «truthiness 0/1» and «truthiness 0/1 stays a recorded gap» and says nothing about depth or examples, while its theory[4] and theory[5] items rewrite both code blocks entirely («Print `repr(monto)` first, then label each line by its expression»; «THREE case blocks, monto = None / 0 / -5 ... Remove decide_monto»).

**Fix.** State the real row in (f): truthiness is L1 with 0 examples, not merely 0/1 figures. Then either take the credit — name «truthiness» in one comment line of theory[4]'s rebuilt code, which moves depth L1 → L2 and load_bearing False → True — and state the consequence in the same breath, that figure_target rises 1 → 5 and figure_gap 1 → 5 (concept_map.py:182-185); or decline it and record BOTH the L1 depth and the 0/1 figure gap as shortfalls, the way (f) already records `exception`, `return` and `parameter`.

### [minor] assessments, last line («course-state/s03_phase5_exam_bank.json contains none of the rescoped strings except the :849 family note»)

**Problem.** False. The phase-5 manifest also carries the family note for the variant the plan moves in twin-mitigation (5), so that note goes stale in the same round. Separately, the manifest names the wrong seed key for the bank it describes — the dimension-6 artifact points at the retired slug — and the plan's assessments pass never checks it.

**Evidence.** course-state/s03_phase5_exam_bank.json:46 `"equivalence_note": "A: if monto: bug con cero; B: '' or default; C: política None/0/negativo. Misma skill truthiness/short-circuit."` — «B: '' or default» describes prisma/seed.ts:706, which assessments (5) moves «to a different operand pair». Same file, :4 `"section_id": "data-structures"` and :16 `"seed_key": "data-structures"`, while the bank is keyed `'decisions-rules'` at prisma/seed.ts:645 (the comment at :644 records `data-structures` only as the platform id) and QUESTION_BANK is seeded by its own key at prisma/seed.ts:15548.

**Fix.** Add the S03-T1-B-EX note to the phase-5 edit list alongside the :849 S03-T3-A-EX note, and update «B: '' or default» to the new operand pair. Correct `seed_key` to `decisions-rules` (keeping `section_id: data-structures` only if it is documented as the legacy DB alias that exam/start's `sectionIdAliases` resolves).

### [minor] exam bank prisma/seed.ts:650 and :821 vs convention (c) and tests_to_rescope (new bank text guard)

**Problem.** Convention (c) requires «ONE region catalog under ONE name: `ALLOWED_REGIONS` everywhere», and the plan states «The bank is learner-visible text: the widened stale-name guard covers it». It does not: the bank carries two further spellings of the region catalog that the rescope list never names, and the new bank guard's word list has no catalog-name check, so nothing fails on them before or after the round.

**Evidence.** prisma/seed.ts:650 «`region = "Lima"` y `ALLOWED = {"Lima", "Arequipa", "Cusco"}`»; :821 «En S03, `ALLOWED_REG = {"Lima", "Arequipa", "Cusco"}`». Both are the region catalog the section renames (today s03:89 `ALLOWED`, s03:342 `ALLOWED_REG`, s03:333 prose `ALLOWED_REGIONES`). The plan's bank rescope list (assessments (1)-(5)) names :650 and :821 nowhere. The new guard in tests_to_rescope rejects only «`def`, `return`, `dict`, `validate_\w+`, `for x in`, `KeyError`, `except` and `CP-N1-A`» — no catalog name, not even `ALLOWED_REGIONES`, which convention (c) calls a phantom.

**Fix.** Add :650 and :821 to the bank rescope list (`ALLOWED` and `ALLOWED_REG` → `ALLOWED_REGIONS`, members aligned with the rebuilt T3-A/T3-A-DEMO list), and add `ALLOWED_REGIONES|ALLOWED_REG\b|ALLOWED\b(?!_REGIONS|_ID)` to the new bank/self-check text guard so the class is caught mechanically rather than by a hand grep that has already missed sites twice.

### [minor] exam bank prisma/seed.ts:961-974 (actionable-messages-branch-tests variant B)

**Problem.** This is O8's own «un caso por rama» variant, and after the round its keyed rule is the belief the section's new R3 exists to correct. R3 says one case per branch is not enough — an `or` arm needs a case on a non-first alternative — and the plan's own verified evidence is that T4-B-E3's four blocks leave the reject branch unreached while mutations stay green. The item's explanation states one-test-per-branch as the rule with no qualification, and the plan's bank rescope list never names :962.

**Evidence.** prisma/seed.ts:963-964 question «Si el validador de edad tiene 4 caminos (None, tipo mal, rango, OK), ¿cuántos casos de prueba mínimos necesitas?»; :966 key «Al menos 4: un test por rama, incluyendo el default»; :973 explanation «Un test por rama del validador. Si solo pruebas accept, el off-by-one en fronteras no se detecta.» Plan, convention R3: «For an OR arm … ship a case on a NON-FIRST alternative, because the first alternative survives deleting the rest.» Plan, item S03-T4-B-E3: «WHY 121: verified, with the four planned blocks no case reaches the reject branch — deleting it or widening it leaves the suite green — in the very item that teaches O8.» Plan, item theory[11]: the chain has five branches and gets five blocks. The plan's assessments (1)-(5) lists :749, :806, :878, :935, :722, :723, :772, :782, :869, :778, :926, :925, :982, :907, :944, :792, :849, :706 — not :962.

**Fix.** Add :962 to the rescope list. Keep correctIndex 0 and reword the key and explanation to R3's rule: at least one case per branch, plus one on each non-first alternative of an `or` — and cite the section's own instance (the 121 block T4-B-E3 gains). Otherwise the exam's O8 key contradicts the section's O8 convention.

### [minor] open_questions → "INSTRUMENT BLIND SPOTS" (the caption/alt entry)

**Problem.** The plan correctly adds "a figure is credited to a concept only through caption/alt mentions" as a new blind spot, but misses the half that bites this round: caption and alt are read by NO writing gate. Every wording rule the plan imposes on captions — Spanish only, «rama de guarda» not «guards», naming `if`/`elif`/`else`, naming the excepción honestly, caption and note saying different things — is enforced by nothing at all. The plan lists the glossary-first-use gate, the ratchet, the code-switching audit and the prose-quality audit as the round's writing instruments; none of them sees a caption.

**Evidence.** scripts/code_switching_audit.py:130-136 — PROSE = {"theory.paragraph", "tagline", "jobRelevance", "outcome", "theory.callout", "ido.preamble", "ido.why", "ido.retrospective", "ido.description", "wedo.preamble", "wedo.instruction", "wedo.hint", "wedo.retrospective", "youdo.context", "youdo.objective", "youdo.requirement", "selfcheck.question", "selfcheck.option", "selfcheck.explanation"} — no "theory.figure".
scripts/prose_quality_audit.py:178-180 — PROSE = {"theory.paragraph", "jobRelevance", "tagline", "outcome", "theory.callout", "ido.why", "ido.preamble", "ido.retrospective", "wedo.preamble", "wedo.instruction", "youdo.context"} — no "theory.figure".
The plan itself states glossary-first-use.test.mjs is "an ABSOLUTE gate over `paragraphs:`" — captions are not paragraphs.
The only caption check that exists is a length floor: tests/adversarial/figure-data-schema.test.mjs:64-71, `cap[1].trim().length > 20` and `alt[1].trim().length > 20`.
Today's unguarded result is visible in the section: s03:73 alt reads "…del campo ausente al accept final" with `accept` unbackticked, which would be an ORDINARY-set hit (code_switching_audit.py:54-58 lists "review"/"reviews") if captions were scanned at all.

**Fix.** Add the exclusion to the blind-spot list ("theory.figure is in neither audit's PROSE set, and glossary-first-use covers only `paragraphs:`, so caption and alt are unguarded prose") and put a hand check in the after-round list: read all three S03 captions and alts for Spanish, for the one-term rule («rama de guarda»), for backticked status words, and for caption ≠ note on S03-guard-order.
