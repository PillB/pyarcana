# S03 rebuild contract (route 2)

What the S03 round must produce, item by item. Codex writes the Spanish; this says what to write
and what may not move.

**Provenance.** Built by a mapping workflow over every item in the section, then attacked by the
twelve readiness dimensions of `LESSON_READINESS.md`. Round 1 ran all twelve and this plan is its
revision; round 2 reached only three (concept map, assessment, figures) before the session limit,
and its findings are folded in here. **The other nine dimensions have not attacked this revision:
they are unchecked, not clean.** Every finding is in `rca/s03-redteam-findings.md` with its
evidence.

**The owner's decisions O1-O9 (`OWNER_DECISIONS.md`) outrank everything below.** Where this
contract and a decision disagree, the decision wins. Their consequences here:

| # | Consequence for this contract |
|---|---|
| O1 | Every amount check is `not (isinstance(monto_ingreso, int) or isinstance(monto_ingreso, Decimal)) or isinstance(monto_ingreso, bool)` -> `BAD_TYPE`. Supersedes any item row that picks one type. |
| O2 | S03 lands now. S04's You Do rescope is a binding WORK_QUEUE item, not an open question, and not a precondition. |
| O3 | S03's `contacto` invariant becomes S02's ten-character value. Pinned outputs in T4-A, T4-A-DEMO and exam items `seed.ts:907` and `:935` change with it. |
| O4 | `monto_ingreso` is the S03/S04 name for S02's `monto`, and S02's raw line travels in every case. |
| O5 | No capstone file is touched. S03 removes the learner-facing CP-N1-A label only (`s03:52, 62, 1176, 2351, 2353, 2370, 2508`, `seed.ts:944`); the increment framing stays, as S02 kept it. |
| O6 | `S04-T3-B-E3`'s instruction and hints are a satellite of this round, so CP-N1-A gains no hidden gap. |
| O7 | `theory[3]` stays, and its bridge sentence is NOT optional. |
| O8 | `S03-T1-A-E3` is replaced with an S03-specific transfer. |
| O9 | `communication_audience_tuned` is out of scope here. |

Anything still listed under **Open questions** or **Ask first** below that one of O1-O9 settles is
closed by the decision; the entry stays only for its evidence.

---

## The convention

One convention for all of S03. It covers theory code except theory[3], every iDo demo, weDo starter and solution, the youDo, the 'decisions-rules' playground, AND every learner-visible text field of those objects.

(a) SEVERAL CASES WITHOUT A LOOP OR A FUNCTION: CASE BLOCKS. Each block has three parts:
- One opening line that binds the case. For one input it is a plain assignment (`edad = None`). For two or more values it is one S02 tuple-unpacking line, flat, never a tuple inside a tuple (`region, edad = ("R-FUERA", 30)`). A long target list wraps inside parentheses (R8).
- The decision chain, byte-identical in every block.
- One evidence print. In asserted items, `assert <result> == esperado` comes first and then a PASS print.
Blocks are separated by one blank line.

Rules:
- R1. Only the opening line differs between blocks.
- R2. Every chain ends in `else` or `case _`, and every branch assigns every result name. State this once, in the T2-B theory. Verified failure: without it, the previous block's value prints silently.
  - ONE named exception: the deliberately non-exclusive overwrite block of T2-A (theory[6], T2-A-E2), which exists to show the bug. It is safe only if the remaining `if`s cover every predicted value, so that block is always the THREE-`if` shape (`>= 80` / `>= 50` / `< 50`), never two `if`s. Verified on 3.12: with two `if`s, score 49 raises `NameError: name 'status_bad' is not defined`; with three, 49 prints reject/reject and all five plan predictions hold.
- R3. Case choice: one case per branch of the chain the item teaches, plus both sides of each boundary the item claims. For an OR arm — `|` in a match AND `or` in a condition — ship a case on a NON-FIRST alternative, because the first alternative survives deleting the rest.
  - This binds the two OR arms the derived consistency rule inserts: `or isinstance(edad, bool)` needs a `True` case, and `edad < 0 or edad > 120` needs an over-120 case. Verified: T2-B-DEMO, T2-B-E1, T4-A-E1, T4-A-E3 and T4-B-DEMO as outlined ship neither, and the T4-B prototype stays green (`rc=0`) with `or edad > 120` deleted.
  - Normaliser refinement, verified on 3.12: an arm whose status equals the default's status cannot be protected by any case. Dropping `| "NOT_IN_ALLOWLIST"` from a 4-block T3-B-DEMO still printed `same= True`; dropping `| "BAD_TYPE"` printed `same= False`. Review arms under a review default are documentation rows.
  - Where a case is declined for length or a pinned output, the item's constraints say in one clause that the alternative is a documentation row with no case behind it, and no prose claims coverage. Declined this round, each stated in its item: theory[7] (type and range arms are named predictions), T2-B-E1 (bool), T4-B-DEMO (bool; `> 120` is the retrospective's defective-change answer), T4-A-E3 (type arm), theory[9]/T3-B-DEMO/T3-B-E2 (review arms).
  - Any other value is a named prediction that the learner runs by editing one opening line. One case per run is exploration, never the only evidence.
- R4. THREE named evidence lines, each with a purpose. The item's constraints name which one it uses.
  - E-a `<input> → <status> [<code>]`: items that only classify (T2-A-E1, T2-A-E3, T3-A-*, T3-B-*, theory[7], theory[8], T2-B-DEMO, T1-B-DEMO).
  - E-b `<input> → <result> ok= <bool>`: items that compare against an expectation (theory[10], T4-A-DEMO, T4-A-E1, T4-A-E2, T4-A-E3, T2-A-E2, T2-B-E2, T3-B-DEMO). The label word may be `ok=`, `same=` or a `<variante>=` pair, but every comparison item prints a labelled boolean.
  - E-c `PASS <input> <code|status>` after an assert (theory[11], T4-B-DEMO, T4-B-E2, T4-B-E3, youDo).
  - Use repr or `!r` only where a str, a blank or None could be misread.
- R5. A starter never asks for the same repair twice.
  - When the repair is identical in every block, the starter holds the chain ONCE, in a block whose output shows the defect or raises the item's named error, and lists the remaining cases in text. The learner repairs, copies the block and edits its first line.
  - When each block needs its own work, the starter holds every block. That applies to T1-A-E2, T4-A-E3 and T4-B-E2 only. T1-B-E1 is no longer an exception (its twelve identical repairs are why).
  - The FIRST instruction step of every R5 item is repair-then-copy («repara la cadena antes de copiarla»), and every such item carries one edgeCase for a half-edited copy, because R1 makes a drifted copy invisible.
  - Every starter's full stdout must DIFFER from the solution's declared output (ordered comparison, not line membership), or the starter must exit with the item's named error.
- R6. TWO sanctioned chain shapes, each bound to a subtopic:
  - (1) VALIDATION FUNNEL — absence → type → range or catalog → review thresholds → accept, happy path in the final `else`. Used from T2-B onward. Its fail-closed variant, for acceptance that depends on a combination, is explicit accept rows with a reject default (verified: the accept-last form fails open, 'RUC 1 → accept OK').
  - (2) ORDERED BANDING — most demanding threshold first, default last. Used in T2-A, where the subject is one score with no impossible values.
  - theory[7] p4 introduces the funnel as a CONTRAST with T2-A, not as a flat rule the learner has already seen broken.
- R7. Printed labels come from variables, never from literal copies of the demonstrated value.
- R8. Code lines are 88 columns or fewer. Wrap long tuples, target lists and boolean expressions inside parentheses. ONE exception, named here and nowhere else: a single learner-facing invariant string literal may exceed 88 columns (T4-A-E2's 106-column invariant print).
- Derived consistency rule: wherever an edad type branch appears it is the same expression, `not isinstance(edad, int) or isinstance(edad, bool)`, and R3 binds its bool alternative.

Named exceptions:
- SELECTOR FORM (one named case per run, opening line as selector) is used ONLY by the youDo. The rule, stated once in weDo.intro and again in the youDo: use blocks when the claim is about several cases at once and nothing in the program checks them; use a selector only when the block form would be unreadable AND the item carries its own per-run check (`assert`), in which case the learner records every row's result as the item's evidence. S03-T2-B-E2 loses the selector: verified on 3.12, its pinned `monto = 20000` run prints `ok= True` for all three flattening errors the item exists to prevent (wrong order, dropped None guard, truthiness), so it takes three blocks (None, 0, 20000).
- Two-line single-print blocks: T1-A-E2 and T1-B-E1.
- No blocks, because the item holds distinct expressions rather than cases of one rule: T1-A-DEMO, T1-A-E1, T1-A-E3, T1-B-E2. T4-B-E1 uses three named message variables (s02:1780 precedent).
- Single-path theory: theory[4] only. theory[6] takes TWO blocks (80 and 60), so the learner sees one row where the exclusive and overwrite forms agree and one where they differ.
- theory[3] keeps `def`, its parameter, `return` and four calls. Held definition, the 42nd program, exempt from the practice guard — the exemption is anchored to the heading text, never to the array index.
- T3-A-E3 uses the fail-closed variant.
- T3-B-DEMO ships the 3-block form (OK, BAD_TYPE, FOO) by default. D4 cost, measured by porting `segmentCode` (SteppedCode.tsx:83-100, maxLines 5, output only after the last chunk): today 10 clicks / 47 lines; the 4-block form is 19 clicks / 87 lines with 8 chunks ending on a `:` header; the 3-block form is ~14 clicks / ~65 lines.
- D4 CLICK COST, stated not absorbed. Every demo's reveal cost rises: T2-B-DEMO 4 → ~15 clicks (64→~76 lines with the True block), T4-A-DEMO → ~12, T4-B-DEMO → ~15. Chunking cuts some blocks at a line ending in `:`, splitting `else:` from its body. Demos are capped at the contrast pair plus the cases their own claims need, never at exhaustive coverage; exhaustive coverage lives in the asserted T4-B items and the youDo case table. A SteppedCode change (never end a chunk on `:`; keep a ≤12-line block in one reveal) is a separate instrument commit with a baseline proof, out of scope here.
- The repetition is the honest cost that S04's repetition tool and S05's `def` remove. The prose says so once in weDo.intro and once in theory[3]'s bridge sentence, which is MANDATORY, not optional. Neither sentence may contain the word `for` or «bucle for»: they say «repetir un bloque» or «los bucles de S04» (terms.ts:77 gives `for` the aliases 'bucle for', 'bucles for', 'for'; bare «bucle» is excluded on purpose, and `for`'s first definition is S04-T1-A.p0).

(b) THE RESULT WITHOUT A DICT: D14's three names.
- `status` holds the decision.
- BOUNDARY, stated once and followed everywhere: `status` alone through T2-A, while the learner is still learning exclusivity; `status, code` from T2-B onward wherever the item's claim is about causes. T3-A-E1 and T3-A-E2 therefore gain a code column, so the We Do is not thinner than the I Do it follows; both give up byte-identical output (no adversarial test pins them).
- The decision and its cause travel as one tuple row per branch: `status, code = ("reject", "OUT_OF_RANGE")` — S02's «Tres resultados que viajan juntos» (s02:174-185). A row missing a value raises ValueError instead of leaking a stale code (verified).
- `message = f"..."` goes on its own line right after the row, in every branch. ASYMMETRY, stated once in theory[11] where the third name is introduced: the row protects status and code mechanically, the message only by the rule. Verified on 3.12: a forgotten `message =` line printed `review MISSING | edad OK`, the previous block's sentence, with no error. The way to see it is an instructed experiment — delete one `message =` line and re-run — in the same form as T2-B's TypeError experiment.
- In the youDo only, names carry a field prefix (`edad_status, edad_code = (...)`, `edad_message = ...`), and `registro_status` applies the precedence reject > review > accept.
- Never a dict, a semicolon or a numbered result name.

(c) NAMES AND STALE-NAME RULE.
- Inputs are full field names: edad, monto, region, score, code, contacto, tipo, numero; apellido_paterno / apellido_materno (s02:268). The youDo keeps edad, region and monto_ingreso for S04 (the monto → monto_ingreso rename is L1Q3-7 reserved: ask_first).
- Former parameters and loop variables expand: m→monto, e→edad, r→region, s→score, c→code, t→tipo, ap/am→apellido_*. Single letters stay only as n (T2-A-E3), x (T2-B-E3) and v (T1-B-E1).
- Results are status, code, message. Compared variants are `<resultado>_<variante>` (status_bad/status_good, status_nested/status_guards, status_if/status_match, status_strict/status_fixed). Non-status results keep their noun (policy, banda, etiqueta_bug/etiqueta_ok). Expected values are `esperado`; in the youDo `esperado_<campo>` and `esperado_registro`.
- ONE region catalog under ONE name: `ALLOWED_REGIONS` everywhere (the name the youDo and the playground already pin), and `ALLOWED_ID` for T3-A-E3's id catalog. The prose constant `ALLOWED_REGIONES` (s03:333) is a phantom — no code defines it — and is corrected to `ALLOWED_REGIONS`. Theory T3-A adds one clause saying the code catalog of T1-A and the named catalog of the demos are the same rule over different data, and the T1-A/T3-A member lists are aligned (or T3-A says the catalog grew, which is the review policy's own point). New thresholds get Spanish names: EDAD_MAXIMA, EDAD_ADULTA, MONTO_REVISION, UMBRAL_ACCEPT, UMBRAL_REVIEW, LARGO_*.
- ONE Spanish term per concept (A5). «rama de guarda» is the chain sense (the first branches of one if/elif chain). «retorno temprano», explicitly «dentro de una función», is the function sense theory[3] keeps. Bare English «guards» (23 occurrences) disappears from prose. Sites to align, all of them: O4 (s03:30), theory[7] p1 (s03:286), theory[8] p1 (s03:333), T2-B-E1 (s03:1402/1405/1415), T2-B-E2 title/preamble (s03:1455/1457/1460/1464), T4-A-E3 instruction (s03:2106), T4-B-E3 feedback (s03:2296), youDo requirement (s03:2368), rubric (s03:2514), selfCheck Q7 stem (s03:2567), exam :778. The code FILE NAMES `guards_edad.py` and `refactor_guards_monto.py` keep English (D7 allows English inside code); say so once.
- Likewise one head-word for the catalog concept: theory[0]'s «lista de permitidos» is the head-word; «allowlist» appears once, in theory[8] p1, as the English name the code constants use — not as a second bolded definition. O5 (s03:31) is reworded to «listas de permitidos» (D1 binds outcomes).
- «Title» is ambiguous in a brief and is never used: say HEADING for the exercise title and FILE NAME for the code-block title.
- STALE-NAME RULE, widened to every learner-visible field: no paragraph, heading, description, preamble, instruction, hint, hints, tests, edgeCases, feedback, retrospective, iDo `why`, code header comment, selfCheck stem/option/explanation or exam stem/option/explanation names an identifier, construct or collection the code does not contain. The ban list is `def`, `return`/«devolver» as a function verb, `dict`/«dicts»/«diccionario»/«clave», `.get(`, the `{status, code}` brace notation, «bucle»/«Recorre», `for … in`, `KeyError`, `except`, `validate_*`, `_run_tests`, `classify_score`, `map_code`, `map_edad`, `examples`, `cases`, `fixed(`, `ALLOWED_REGIONES`, and `CP-N1-A` outside ask_first.
- BANNED GLOSSARY ALIASES in requirement-kind fields (course_event_extractor.mts:257-260 counts weDo.instruction, weDo.hint, weDo.tests, youDo.requirement, youDo.objective, youDo.rubric and selfCheck.question as requirements; every alias hit there is a requirement, and a later first definition becomes a DEFINITION_AFTER_REQUIREMENT issue located in decisions-rules): «bucle for», «cobertura de ramas», «cobertura de líneas», «branch coverage», «tipo de dato», «tipos de datos», «valor faltante», «valores nulos», «NaN», «type hint», «valor atípico», «desempaquetado». Safe renderings the section already uses: «tipo incorrecto», «un caso por rama», «ausente/None», «asigna los dos nombres en una línea».

(d) FAILURES AND ENGLISH: never caught (D10), never a reference program that exits non-zero (L1Q3-2).
- Theory code, iDo code and weDo solutionCode exit 0, and their declared outputs contain no traceback.
- A failure is an instructed experiment. The prose names one edit, the learner runs it, and the prose quotes only the last traceback line. A commented line the learner uncomments is the other allowed form (s02:283).
- A QUOTED TRACEBACK LINE IS ALWAYS INLINE CODE (single backticks), inside a Spanish sentence that names what Python was asked to do. Unbackticked, `not`, `between` and `supported` are in code_switching_audit.py's FUNCTION set (scripts/code_switching_audit.py:47-51) and the round goes red on avoidable English. This binds theory[7] p5, T2-B-DEMO, T2-B-E1 and T1-B-E3.
- Inside `paragraphs:` strings, `return` appears only backticked, and «tipo de dato», «tipos de datos» and «desempaquetado/desempaquetar» never appear. tests/adversarial/glossary-first-use.test.mjs is an ABSOLUTE gate over `paragraphs:` (`assert.deepEqual(late, [])`, reproduced clean today) and this round rewrites more theory prose than any other dimension.
- A DEFECT starter may exit with the item's own named error: AssertionError for a red test (T4-B-E3), TypeError for guard order (T4-A-E1, the youDo's text case). Never for an unrelated reason. No path in the section raises AttributeError, a class the course never names (grep S01=0, S02=0, S03=0).
- The fix is always the lesson itself: never try/except, never a condition whose only job is to hide the error.
- Every starter keeps its `# CASO-LIM-003 · …` header (naming the file or rule, never a function) and its `# DEFECT` marker.

(e) WRITING BRIEFS.
- No passage is briefed by a word budget alone. Every at-floor replacement («replace, do not delete», «pad the distractors») is briefed by what the new sentence must make the learner able to do, and every padded distractor is briefed by the misconception it encodes. A length instruction without a content brief produces the assistant register G2 names.
- Replacements keep the purpose clause. G1: the sentence that carries the teaching point outranks the sentence that is merely accurate. A two-limb parallel is not flattened into a three-limb list; a «porque…» is not traded for a curriculum-location clause.
- No meta commentary and no disclaimer speak in learner prose (D12, G1, G2): the section never tells the learner that a row is only documentation, or that a check cannot detect something. Where that point matters it becomes a demo retrospective question the learner answers by deleting an alternative and re-running.
- Bullets that mix brief and copy say which is which: «in Spanish (the English below is the brief, not the copy)».

(f) FIGURES (D3/D5 targets, stated with the shortfall rather than padded). concept_map.json today: `if` load-bearing, 0/5, depth L2; truthiness 0/1; `set` 2/5; exception 3/5; `return` 1/5; `parameter` 1/5. A figure is credited to a concept only through its caption/alt mentions (concept_map.py:139-141), so both S03 figures are credited to nothing.
- S03-tri-state is redrawn for T2-A's own chain and its caption/alt name `if`/`elif`/`else`, which truthfully moves `if` 0/5 → 1/5 and L2 → L3.
- S03-guard-order moves to theory[7] (T2-B) with rows copied from T2-B's funnel. D5 counts are unchanged by the move, because the figure is credited to no concept (.fixer/events.json, `decisions-rules.S03-T1-A.figure`, "mentions": []).
- T1-A gets no new figure this round: the `set`-archetype candidate (membership against a set of literals, including the `"r-sur" in {"R-SUR"}` → False trap) is named and NOT built, and the shortfall is recorded. truthiness 0/1 stays a recorded gap; no table figure in theory[4]/[5] earns its place over the code that already prints the same columns.
- `exception`, `return` and `parameter` gaps are recorded as shortfalls, not padded.

SHAPE INVARIANTS for every rebuilt object:
- 42 python programs against a floor of 41 (theory 10, iDo 8, weDo 24). Each keeps the exact order language / title with no apostrophe / code with no backtick and no `${` / output. Each exits 0 and matches its output line by line under .venv-content 3.12 (D8).
- 40 subtopicIds; 8 demoIds; 24 ids, T1-A-E1…T4-B-E3, in order.
- iDo and weDo strings stay single-quoted, and `id:` comes before `retrospective:`.
- Replace whole objects, anchored by heading, demoId or id.
- No `def main`, `__name__` guard, `try` or `except`.
---

## Assessments

SELF-CHECK (s03:2520-2582). Keep all 8 questions, correctIndex [2,0,1,3,2,0,1,3] (balance 2/2/2/2), 8 single-quoted explanations of ≥22 words, and every pin: Q2 'describe el comportamiento de `bool`, no la política', Q3 'Python no busca la opción “más específica”', Q7 'comparar None con < lanza TypeError' (in the OPTION, not the stem), Q8 'mensajes de validación es accionable' and 'obligan a adivinar la causa'. Changes:
- Q2: pad the distractors (71 vs 22–33 characters), each briefed by the misconception it encodes. WHEN options[1] IS PADDED, update the explanation's verbatim quote of it (s03:2535).
- Q5: option 4 DNI → CLI (D2) AND the stem re-domained off «tipos de documento», since no S03 code holds a document-type catalog after the round; head-word «lista de permitidos».
- Q6: options[3] «devuelve» → produce.
- Q7: REWRITE THE STEM to one chain (absence branch first, comparison as its `elif`), and pad the distractors. The claim that the wording «already fits a flat funnel» is false — verified on 3.12, two separate `if`s in the stem's order still raise "TypeError: '<' not supported between instances of 'NoneType' and 'int'", and only `elif` prints 'review'.
- Q8: correct the brief («inválido» DOES appear, as options[1]'s «no es válido»), and write the explanation as one teaching sentence plus one contrast instead of a three-limb list that repeats itself.
- Q1, Q3, Q4: no change.

OUTCOME → SELF-CHECK MAP (new, required before the round closes). The 8 stems test: Q1 `is None`; Q2 None/0 policy; Q3 first-true-wins; Q4 `"" or "default"`; Q5 permitted list + `in`; Q6 match vs if; Q7 guard order; Q8 actionable message. Against s03:30-34 that leaves O4's unreachable-branch clause, O8's branch-test clause and O5's combined range+allowlist unassessed, while O2 has three items. Either re-target one O2 item to O4's dead-branch clause or O8's branch-test clause (keeping its correctIndex, the 2/2/2/2 balance and all pins), or state the gap as a trade-off covered only by the bank (:806 guard-clauses, :964 actionable-messages). badge_readiness_audit.py:59-60 maps `selfcheck.` events to the EXAM activity, so this is the section's assessment of record.

TOPIC EVALUATIONS. S03 has no topicEvaluations field (grep 0; S01 and S02 have one, S04 and S05 have none). Nothing to change and nothing added.

EXAM BANK (prisma/seed.ts, between '  // S03 V3' at :644 and '  // S04 V3' at :991). Keep each item's concept and correctIndex.

(1) Construct leaks the earlier grep caught:
- :749 stem `def classify(score) … return` → prose, not code (see (3)).
- :806 stem `if x >= 0: return "ok"` → `status = "ok"`, same dead-branch question.
- :878 stem `case … : return "review"` → `status = "review"` (and, per (3), no compound statement on one line).
- :935 «Para `validate_contacto`» → «para el invariante de contacto».
- :722/:723 distractors `if m: return "accept"…` / `if not m: return "reject" siempre` → assignment form.
- :772 explanation «usa elif o return temprano» → drop the return clause.
- :782 distractor «Solo if anidados de 4 niveles sin return» → drop «sin return».
- :869 distractor «Un dict vacío sin ejemplos» → a distractor that does not name dict.
- :778 stem «orden típico de guard clauses» → «ramas de guarda», the section's one Spanish term.

(2) Sites the earlier grep MISSED, now added (a regex over :644-990 for return|def|dict|devolver|validate_|for..in|KeyError|except|CP-N1-A|gate flags all of these):
- :926 keyed answer «las reglas de negocio deben devolver status/code/message» → the function-return form the round removes everywhere else. Becomes: `python -O` disables asserts, so a business rule must set its decision in names the program checks (status, code, message). Align :930's explanation («El motor de reglas expone status/code/message»).
- :925 distractor «assert siempre lanza KeyError» → `KeyError` appears 0 times in S01-S03. Replace with an S02/S03 misconception, e.g. «assert solo funciona con enteros».
- :982 distractor «Silenciar el else con `except: pass`» → try/except is D10-banned before S09 and `pass` disappears from S01-S03 once T2-A-E2 drops it. Replace with a wrong practice built from S03 vocabulary, e.g. deleting the `else` so no case reaches reject, or silencing it with a print. Keep correctIndex 1.
- :907 stem «¿Qué falta para que sea usable en el gate?» → S03 itself never uses the word «gate» (grep 0). Reword to ask what makes the invariant verifiable. Do this SEPARATELY from the 9-digit ask-first.
- :944 explanation «El camino feliz solo no basta para el gate CP-N1-A» → drop the CP-N1-A clause and end on why the happy path alone is not enough for the invariant. Without this, the bank would be the only S03 surface naming the Level-1 gate after the section stops mentioning it (S02's bank has 0 CP-N1 hits, which is the precedent the round cites). ≥7 words, unique, correctIndex 0.

(3) Stems that are invalid Python or off-family:
- :749. ExamView.tsx:291 renders the stem as plain text in one `<p>`, so the chain must be one line with semicolons — and `ast.parse` on 3.12 rejects both today's stem and the planned top-level one-liner ('SyntaxError: invalid syntax'). That makes the distractor 'Error de sintaxis en elif' defensible next to the keyed answer, breaking the bank's own one_best_answer rule (s03_phase5_exam_bank.json:22). Write the chain IN PROSE, naming each branch's condition and status in order, and replace that distractor with a boundary misconception, e.g. «accept y accept (50 cumple la primera condición)». Keep correctIndex 3. Apply the same no-compound-statement rule to :878's match/case.
- :792/:794 (NEW to the list). Same defect as self-check Q7: `if edad < 18:` before `if edad is None:` are two separate `if`s, so the keyed «la guard de ausencia debe ir primero» is false for the code shown. Rewrite the stem as one chain — `if edad < 18:` first, `elif edad is None:` after it — keeping correctIndex 0.
- :849 (NEW). It asks why an allowlist constant is UPPER_CASE, which is S02's naming convention (s02:294), inside the S03-T3-A-EX family whose skill is «Combinar allowlist + rango con accept/review/reject» — so in one attempt of three, O5 is assessed by a PEP 8 item. It also names `ALLOWED_DOC_TYPES` and «tipos de documento», a catalog the section no longer has. Rewrite it as a combined-rule item using theory[8]'s verified prediction (R-FUERA with edad 15 → review NOT_IN_ALLOWLIST, because the allowlist branch runs first). Keep correctIndex 2 and the distinct per-concept positions, and update the phase5 family equivalence note («C: UPPER_CASE constante»).

(4) BANK-WIDE LENGTH CUE (new, major). Running the repo's own parser (exam_selfcheck_pedagogy_audit.parse_seed_questions) over :644-990 and comparing option lengths: the correct option is STRICTLY THE LONGEST in 23 of 24 items, by 2–5x (item 21 at :955 [5,8,4,42] = 5.25x; item 18 at :907 [23,19,83,19] = 3.61x; item 11 at :806 [19,54,20,16] = 2.7x; item 6 at :739 [42,36,109,35] = 2.6x). With PASS_THRESHOLD 70 (src/lib/exam-scoring.ts:8) and one question per concept per attempt (route.ts:172-206), always picking the longest option scores 7/8 or 8/8 on every attempt with no Python knowledge. Add a bank-wide pass: wherever the correct option exceeds about 1.3x the longest distractor, rewrite the distractors so each states a believable misconception at similar length and detail. Keep every correctIndex, concept and per-concept position.

(5) SELF-CHECK TWINS (new, minor). The self-check is public and reveals the correct option and explanation after submit (SectionView.tsx:903, :955), so for 3 of 8 exam concepts one of the three variants is answered in advance (D12). Twin pairs, listed here so later rounds keep them apart: Q4 s03:2545 ↔ :706 (`"" or "default"`); Q7 s03:2567 ↔ :792 (None before `<`); Q8 s03:2575 ↔ :950 (actionable message for edad=-5). While rescoping, move each bank twin to a different surface of the same skill, keeping concept and correctIndex: :706 to a different operand pair; :950 to a different field and value (region or monto); :792 is already reworked under (3).

Keep the bank's invariants: 24 entries; 8 concepts × 3; distinct correctIndex within each concept; positions 6/6/6/6 overall; 24 unique questions and 24 unique explanations, each ≥7 words; no 'Aplicar el concepto con evidencia verificable'; concept ids such as 'guard-clauses' stay; no DNI (grep 0).

CORRECTION to a preserved invariant: `positions[a::3]` is NOT per-attempt balance. exam/start draws a random unused variant per concept (route.ts:206) and returns options unshuffled (route.ts:116, ExamView.tsx:294), so an attempt is not variant slice a. Enumerating every per-concept combination over the bank's position sets, only ~4.5% of possible attempts are 2/2/2/2, ~40% put 4+ of the 8 keys at one position and some put 6. Keep the test (test_s03_independent_contract.py:169-173) as a structural check, but the only balance the section may CLAIM is overall 6/6/6/6 plus distinct positions per concept. The fix (shuffling each drawn item's options in exam/start and storing the permutation in ExamAttemptForm, which D12 already grades against, or constraining the draw) is an instrument change in its own commit — listed under open_questions.

course-state/s03_phase5_exam_bank.json contains none of the rescoped strings except the :849 family note, which is updated with it.

AFTER THE ROUND — hand checks, because the automated rows are partly blind here:
1. badge_readiness_audit maps EXAM to the self-check, not to this bank. Diff the bank by hand as well as the readiness rows.
2. EXPECTED READINESS ROW DIFF, written before execution. Removing `dict` from S03-T3-A-E3.hint[1] and `for` from S03-T4-B-E2.hint[1]/tests moves the course's first `dict` REQUIREMENT into S04, whose next requirement (iteration-summaries.S04-T3-B-E3.instruction, s04:1477 «Arma `rejects` desde el dict…») still precedes the S04 definition at s04:1615 — and that definition is itself spurious (the extractor's APPOSITIVE rule matching ', un typo de', checked on 3.12). Simulated over .fixer/events.json by reimplementing audit_concept_events and the readiness bucketing: today 24 warnings + 5 failures = 29; after dropping dict/for from every decisions-rules event, CP-N1-A goes None → (1, ['dict'], ['iteration-summaries.S04-T3-B-E3.instruction']); progress_phase0_walked, python_data_foundations and integrated_python_ai_capstone_foundations go (2, ['dict','for']) → (1, ['dict']); progress_journey_completed 5 → 4; total 29 → 26. So the four S03 badges lose 'for' ONLY — 'dict' stays, relocated to S04 — and CP-N1-A GAINS a row that the course-wide total hides (badge_readiness_audit.py:157-168 counts gaps in the gate section alone; INDEX.json:10-11 and catalog.ts:59 set CP-N1-A's gate to S04). Any row regression is a failed round (LESSON_READINESS.md:87-90), so CP-N1-A's new row is decided by the owner before execution (ask_first).
3. CRITICAL COMPETENCIES, by hand, because badge_readiness_audit never reads them (the word appears only in its docstring at line 4; lines 89-146 check sections, activities, prerequisites and vocabulary). reproducibility_determinism HOLDS: it is practised in S01 (packaging, git) and S04 (testing_discipline) per curriculum_gap_matrix.json:813, and this round touches neither. communication_audience_tuned, a critical gate of integrated_python_ai_capstone_foundations (S01-S13), has NO mapped practice before S26 (curriculum_gap_matrix.json:812) — before or after this round. Record it in OPEN_QUESTIONS as a catalog-level gap, ask-first, not caused by S03, and keep the three S03 parts closest to it at least as strong: T4-B's person-facing messages, T4-B-E1's message writing, and the youDo portfolioNote (which must still name a concrete reader) and three-voice retrospective.
4. CP-N1-A CLAIM TABLE, by hand, because its readiness row cannot move on any S03 change and its package tests are placeholders (course-state/capstones/CP-N1-A/tests/test_demo.py test_0..test_4 all `assert True  # placeholder`). Tabulate every CP-N1-A claim (BRIEF.md, gate.json, RUBRIC.json, IDO/WEDO/YOUDO.md, demo.py) against what S01-S04 practise after the round, and record the result in LEDGER_NOTES.
5. Re-run tests/adversarial/glossary-first-use.test.mjs (the ABSOLUTE gate over `paragraphs:`), not only the ratchet.
---

## Tests to rescope

- tests/adversarial/test_s03_independent_contract.py::test_you_do_oracle_covers_schema_normal_boundary_and_error_paths (:188-208). Repoint in a test-only commit that first fails on the old form (D9 precedent: repointed, not weakened). The old pin 'assert set(result) == {"status", "code", "message"}' guards all THREE names, so replacing it with two status-only pins would guard strictly LESS: a youDo that never assigns `edad_message`, or a branch that skips its `_code`, would pass. Repoint to THREE pins, not two: 'assert edad_status in STATUS_VALIDOS', a non-empty-message assert as finally written (e.g. 'assert edad_message'), and a per-field code assert (e.g. 'edad_code'). All three fail on today's dict form. Also repoint the fixture strings to the FLAT case tuples as finally wrapped to 88 columns, and ADD a pin on CASO_S02's values as what S03 owes the project (edad 28, monto Decimal("150.50")), the way test_s02_independent_contract.py:63 pins S02's handoff, plus registro_status. Keep assertNotIn('NotImplementedError') and the six codes.

- tests/adversarial/test_s03_independent_contract.py::test_playground_and_pdf_match_the_rules_scope (:114-145). Replace the positive pins 'def validate_monto', 'def validate_region' and '"monto": 0' with the top-level form: the zero-monto opening line of the first case block, plus assertNotIn('def ') and no dict-literal match. Keep 'Practica decisiones y reglas', assertNotIn('Promedio de notas'), the check=True run against expectedOutput, and the PdfReport '"decisions-rules": '3. Reglas'' pin. Own commit; it must fail on today's playground first.

- NEW, tests/adversarial/test_s03_independent_contract.py: an S03 practice guard, over CODE AND LEARNER-VISIBLE TEXT. (a) Code: no `def `, `return`, `for … in`, dict literal, `.get(` or annotation (`->`) in any python code of theory, iDo, weDo starter/solution, the youDo starter or the 'decisions-rules' playground. The dict regex must accept BOTH quote styles, aligned with concept_syntax.mts:46 (the planned \{\s*"[^"]+"\s*: misses single-quoted literals). (b) TEXT: the same scan over instruction, tests, edgeCases, hints, hint, preamble, description, title, feedback, retrospective and the iDo `why`, with a word list — return, «bucle», «Recorre», dict, «dicts», «diccionario», `.get(`, status_for, map_code, map_edad, validate_, examples, cases, fixed(, ALLOWED_REGIONES, KeyError, except. It must FAIL today on s03:1168, 1405, 1788, 1791, 1800, 1907, 1974, 2040 and 2226, none of which any instrument sees: terms.ts:447 gives dict only the alias ['Dict'] and terms.ts:77 gives `for` ['bucle for','bucles for','for'], and course_event_extractor.mts:281 wraps every alias in letter lookarounds, so «dicts», «diccionario» and a bare «bucle» never match. (c) The forward-reference phrase check: weDo.intro and theory[3]'s bridge sentence may say «repetir un bloque» or «los bucles de S04» and may not contain `for` or «bucle for». (d) The theory exemption is anchored to the held-definition block's HEADING ('Una regla con nombre…') or its code file name, never to the index theory[3], because ask_first option (a) would renumber it to theory[11] and the guard would then fail on the one block it was written to spare. Measured today with that ban set: 35 of 42 programs offend (def 33, return 33, for..in 14, dict literal 9, .get( 1, -> 8) and 20 of 24 starters.

- NEW, tests/adversarial/test_s03_independent_contract.py (or a sibling): the SAME text guard over the S03 exam bank (question and options between '  // S03 V3' and '  // S04 V3') and the self-check. It rejects `def`, `return`, `dict`, `validate_\w+`, `for x in`, `KeyError`, `except` and `CP-N1-A`, with theory[3]'s held definition exempt only in theory. It must fail on today's bank at :749, :806, :878, :926 and :935 before the rescope commit. Without it nothing fails on `def classify` or «devolver status/code/message» and a later round can bring them back unnoticed — this is the repeat-issue class the repo says to fix with a guard, not by instance (the hand grep missed 5 sites twice).

- NEW, tests/adversarial/test_s03_independent_contract.py: S03 starter visibility, specified as an ORDERED comparison, not line membership. scripts/planted_defect_audit.py only matches double-quoted ids, so S01-S03 starters are never audited. Run each of the 24 weDo starters under .venv-content 3.12 and assert one of two outcomes: it exits with its named error (AssertionError or TypeError, per a table in the test), or its full stdout (rstripped) DIFFERS from the solution's declared output. The plan's line-absence wording would ship RED on S03-T1-A-E1, an item no plan row changes: verified, its starter prints False/False/False/True/False and its solution True/True/True/False/True, so every starter line is a line of the solution output while the sequences differ. Under the ordered rule it fails today on S03-T1-A-E2 (byte-identical output) and S03-T4-A-E1 (starter prints nothing, rc=0), both of which this round repairs, and passes T1-A-E1 unchanged. EXTEND IT TO THE YOUDO STARTER: assert that the shipped `caso = …` line selects a case whose run exits non-zero. Today's youDo starter fails on its first run (AssertionError on the valid-zero assert, verified); a CASO_S02 selector would print PASS with all five planted defects in place, contradicting s03:2352.

- OPTIONAL, the owner's mitigation for the remaining selector exception. For the youDo, pin the starter's per-case prediction key (which CASO passes, which assert fails, where TypeError is raised); the youDo has no solutionCode in the file. S03-T2-B-E2 no longer needs a matrix test, because it takes the block form.

- AFTER THE ROUND (procedure step 9). CORRECTED: the glossary-first-use RATCHET (DECLARED_LATE_OWED = 19, glossary-first-use-ratchet.test.mjs:29) CANNOT DROP from an S03 round — survey() flags a term when the earliest section containing an alias precedes its declared section, so adding definitions in S03 can only move `first` EARLIER, never later. Reproduced exactly: 19 late, 5 dead. Of the 19, only `return` is first-used in S03, and theory[3] keeps it (under ask_first option (b) it would move to S04, still < S05). None drops. The len()/.isascii()/.isdecimal() rationale is void: none of them is a glossary term or alias (grep returns no match), so glossing them cannot move this ratchet at all. VERIFY INSTEAD that it has not RISEN above 19: any new S03 mention of an alias declared S04+ fails `late.length <= 19`, and `tipo-de-dato` (declared S06, alias 'tipos de datos', 0 occurrences in S03 today) is the live risk the ~20 rewritten requirement-kind fields create.

- DO NOT RESCOPE; these stay binding:
- tests/adversarial/glossary-first-use.test.mjs — an ABSOLUTE gate (`assert.deepEqual(late, [])`, no owed count) over `paragraphs:` prose, reproduced clean today. This round rewrites more S03 theory prose than any other dimension, and `return` (declared S05), `Tipo de dato` (S06) and `Desempaquetado` (S06) are one unbackticked word from a hard failure. Re-run it before the round closes, not only the ratchet.
- test_s03_text_first_contract: the 19 theory anchors; the iDo floors (preamble 50, why 35, retrospective 40) and pins; the weDo retrospective floor of 45 words plus a cue word; the youDo anchors; the selfCheck explanations and pins; bank uniqueness. Measured with its own tokenizer, the two THINNEST weDo retrospectives are S03-T1-A-E2 and S03-T4-B-E1 at 46 words, then S03-T2-B-E3 at 47, S03-T3-A-E3 at 48 and S03-T2-A-E1 at 49 — the 'replace, do not delete' discipline is labelled on all three of the first.
- test_newbie_packet (S03-T4-A-E2).
- test_forward_dependencies (D9_OWED=0, D10_OWED=10).
- test_s02_independent_contract delimiters.
- test_concept_prompt_weight (theory[3] kept).
- The 42/41 program floor; the 40 subtopicIds, 8 demoIds and 24 ids.
NOT a pin, contrary to the earlier plan: test_curriculum_agent_firewall.py:29 mutates build_packet(2)'s youDo, i.e. S02's requirements[0], not S03's (test_newbie_packet.py:57-59 shows build_packet(3) is what makes S03 active). requirements[0] stays a string on its own merits; the citation is dropped.


---

## Still for the owner (ask first)

**A1.** CP-N1-A placement — EXTENDED. (i) Catalog: catalog.ts:59 still gates CP-N1-A at S04 with S01-S04 contributing and S01-S03 as prerequisites; INDEX.json agrees; RUBRIC.json:6 gate_section S04; gate.json:61-64 dependencies S01-S04; CapstonesPage.tsx:342-346 renders both rows to learners. (ii) BRIEF.md still describes S03 as «estructuras de datos», says amount=0 → warn (S03 accepts zero) and takes «una lista de registros (dicts)». (iii) NEW — function claims the round removes from S03's practice and route 2 moves to S05: gate.json:45 "focus": «Funciones pequeñas, reglas centralizadas, sin secretos.»; gate.json:42 maintainability level 2 «Módulos/funciones claros y legibles.» under gate_rule «ningún criterio crítico < 2»; WEDO.md:5 «1) Escribir juntos la función classify().»; the catalog interface 'intake_cli.run(records) -> IntakeResult'. (iv) NEW — the reference implementation teaches the opposite of S03's policy: demo.py:24 `if not row.get("id") or …` tests presence by truthiness, which S03 teaches as the defect; demo.py:29 `if not isinstance(amount, (int, float)):` accepts True (verified: True → ok) and rejects every Decimal (verified: Decimal('150.50') → error, Decimal('0.00') → error), which is exactly the monto recommendation below, while 0 → warn contradicts S03's valid zero and None → error contradicts S03's MISSING → review. Route each through D11 (primer → rewrite → move). Do not edit capstone files this round. This round removes only S03's learner-facing CP-N1-A LABEL (s03:52, 62, 1176, 2351, 2353, 2370, 2508, plus seed.ts:944), following S02's precedent of 0 mentions — the increment FRAMING stays, as S02 kept it (s02:2155, s02:2174).

**A2.** CP-N1-A's NEW readiness row (blocker consequence of this round; decide before execution). Once S03 stops requiring `dict` in its practice text, the course's first dict requirement moves into S04, CP-N1-A's gate section, so CP-N1-A goes 0 → 1 blocking_term_gaps at iteration-summaries.S04-T3-B-E3.instruction while the course-wide total falls 29 → 26 and hides it. Two S03 badges require CP-N1-A as a project (badge_catalog.json: integrated_python_ai_capstone_foundations, progress_journey_completed). Option (a): the owner accepts it as a pre-existing S04 gap this round uncovers — its hidden cause is the spurious appositive credit at s04:1615 — recorded in OPEN_QUESTIONS and in WORK_QUEUE for S04's route-2 round, which removes dict from S04-T3-B-E3's instruction and hints or teaches dict first. Option (b): add S04-T3-B-E3's instruction and hints as an explicit satellite of this round. badge_catalog.json itself needs no change under either option.

**A3.** THE S04 GATE'S SHAPE (moved out of open_questions; 'nothing dangles' is withdrawn). S04's You Do IS CP-N1-A's close and is built on reusing exactly what this round removes: s04:1798 «Client Intake & Data Quality Script (cierre CP-N1-A)»; s04:1800 «Sobre el parser de S02 y las reglas de S03 … implementa las tres funciones hasta ver `tests OK`»; s04:1805 «Reutilizar validación tri-estado por campo (S03)»; s04:1826-1831 `def validate_record(record: dict[str, Any]) -> dict[str, Any]:` / «Reutiliza lógica tipo S03: status global + detalle por campo.» / `# TODO: devolver {status, fields} con accept|reject|review por campo (S03)` / `raise NotImplementedError`; s04:103 «llamar a `validate_record` dentro del bucle»; RUBRIC.json weights maintainability 0.25 on «Diseño limpio, modular, testeable». S03 today has 9 defs in theory, 8 in iDo, 44 in weDo and 6 in the youDo; after the round it has one, in a block the learner never applies, and theory[3] p4 tells the learner functions arrive in S05. So the N1 gate would ask for three annotated def/dict functions and 'reuse' of S03 validation that S03 no longer practises, and S04 consumes dicts keyed monto_ingreso with raw_line while S03 hands over flat case tuples. This is ask-first because it restructures S04's practice layer. Either (a) make landing S03 together with S04's route-2 round (or a CP-N1-A re-gating decision) an explicit sequencing precondition of this round, or (b) record a binding WORK_QUEUE item: S04's route-2 round rescopes s04:1797-1880 and s04:103 to consume S03's handoff — iterate the S03 case table, read edad_/region_/monto_ingreso_ status/code/message and registro_status — and stops asking for a `{status, fields}` dict or a def before S05/S06. The trade-off is stated either way, not absorbed.

**A4.** monto type — THREE options, each with the edge it breaks named. (1) int: S02's handed-over money Decimal('150.50') becomes ('reject','BAD_TYPE') (verified), so CASO_S02 cannot carry S02's value and 'S02 PASS' holds only with a made-up monto. (2) Decimal: every S04 fixture becomes BAD_TYPE → reject (verified: s04:1855-1857 ints 0, 10, -1 and the demo's 100, 50 all BAD_TYPE), including row 0's int 0, which is S03's valid-zero lesson; it also rejects what CP-N1-A's demo.py:29 accepts. (3) RECOMMENDED — accept both: `not (isinstance(monto_ingreso, int) or isinstance(monto_ingreso, Decimal)) or isinstance(monto_ingreso, bool)` → BAD_TYPE. It uses only S02's isinstance (s02:206) and S03's `or`, and verified on 3.12 it gives S02's Decimal('150.50') accept OK, the five S04 int fixtures ['OK','OK','OUT_OF_RANGE','OK','OK'], and True reject BAD_TYPE. Decimal('0.00') keeps the falsy-zero trap (verified) and gives the tighter céntimo boundary 50000.01. Whichever is chosen, CASO_S02's values are fixed to S02's pinned column (edad 28, monto Decimal("150.50")) and pinned in the youDo test; the T2-B-E2 and playground guards follow.

**A5.** The youDo field names and the record schema (L1Q3-7, DECISIONS_2026-09-21.md:839-857, reserved: «S01's You Do data spec and the S02-S04 field names»). The round writes a record schema into the youDo's opening comment and the README, which requires naming: monto_ingreso as the S03/S04 name for S02's `monto` (s02:2196-2197), region as introduced in S03 (S02 hands over `direccion_raw`, `edad_raw`, `monto_raw` and no region, s02:2184-2186), and the `_raw` values dropped between S02 and S04 although S04 expects `raw_line` (s04:1855). Approve the rename and the schema, or supply the names. Optionally carry S02's raw line in each case tuple, which S04 needs.

**A6.** contacto invariant length. S03 says 9 digits (theory T4-A, T4-A-DEMO, seed.ts:907 and :935) while S02's contacto_clean is '0999000111' (10 characters). The planned funnel rejects it (verified). Aligning the length changes pinned outputs and exam items. The :907 «gate» wording is fixed independently of this.

**A7.** S03-T1-A-E3's S03-specific transfer. The item nearly duplicates S02-T2-B-E1 (same file name is_vs_eq.py). Replacing it with region None vs 'R-OESTE' (`in`, `== None`, `is None`) changes its Éxito contract. D14 allows the objective to change, but this was reserved for the owner.

**A8.** theory[3] (the def/call/return held definition). Not moved this round. Option (a): move it to the end of S03 theory as a bridge — exposure unchanged, but the location keys become theory[11].*, the glossary and held-definition gates must be re-run, the flows.ts comment changes, and the practice guard's exemption must already be anchored to the heading (it is). Option (b): move it to S05 once S04's route-2 round removes S04's 8 `return` uses and 1 `parameter` use. A previous round that replaced it exposed 58 uses and was discarded.

**A9.** communication_audience_tuned. It is a critical_competency of integrated_python_ai_capstone_foundations (sections S01-S13) and has no mapped practice before S26 (curriculum_gap_matrix.json:812: written S50/S52, stakeholder_translation S26/S39/S49/S51), before or after this round. badge_readiness_audit never reads critical_competencies, so no report shows it. This is a catalog-level gap, not caused by S03; the owner decides whether to re-scope the competency, add practice earlier, or accept it. S03's three closest surfaces (T4-B messages, T4-B-E1, the youDo portfolioNote and retrospective) are held at least as strong this round.


---

## Open questions

**Q1.** RESOLVED this revision, recorded so the reasoning is not re-litigated: (1) The S03-guard-order figure MOVES to theory[7] (T2-B). D5 counts do not change, because the figure is credited to no concept (.fixer/events.json mentions: []); the earlier reason for keeping it in T1-A misread D5, whose target is per concept (decisions.md:92-94). (2) The youDo keeps `in` over a tuple for registro_status, with T3-B-DEMO's s03:750 `elif code in ("MISSING", "NEEDS_REVIEW"):` as its in-section exemplar, kept on purpose; no instrument models `in`, so the gate-conditional fallback could never have fired. (3) T4-A-E2 keeps a text-type guard, so no planned path raises AttributeError, a class the course never names. (4) theory[9]/T3-B-DEMO/T3-B-E2: the R3 refinement is stated in constraints and said NOWHERE in learner prose (D12/G2); the demo's retrospective turns it into an experiment.

**Q2.** CONFLICT RESOLVED — theory[10]/T4-A-DEMO. One finding asked to revert to today's single combined branch (`not (isascii and isdecimal) or len != 9`) for 4-of-4 branch coverage; another asked to keep the split and add a fifth case. I kept the SPLIT and added the fifth block '١٢٣٤٥٦٧٨٩' → reject, because reverting does not actually protect the L1Q3-2 fix: verified on 3.12, with the four original cases the isascii/isdecimal test can be deleted from EITHER shape and the output stays byte-identical, and only a nine-character non-ASCII case makes base (reject) differ from mutant (accept). The split plus five cases is the only form that is both 5-of-5 covered and protected. Cost: one new output line in two objects.

**Q3.** CONFLICT RESOLVED — T1-B-E1. One finding required replacing `()` (an untaught S06 literal) with `" "`, keeping twelve values and 8+4; another required cutting the twelve byte-identical repairs that breach R5. I dropped `()`, `set()` and `range(0)` and shipped NINE values (None, False, 0, Decimal("0.00"), "", [], "0", " ", [0]) — verified 6 False + 3 True — with 0.0, "x" and 1 as named predictions, and moved the starter to R5's main rule (one block plus a text list). That satisfies both: no untaught literal, no twelve identical repairs, and «doce valores» is reworded (verified not to be a pin). If the owner wants twelve shipped values, the fallback is twelve with `" "` in place of `()` and 7 False + 5 True, keeping the one-block starter.

**Q4.** CONFLICT NOTED — demo length. The reading-load and D4 findings want demos shorter (today's six demos total 156 lines; the planned ones 348, 2.2x); R3 and the derived consistency rule want more cases. The rule applied here: a case ships when the DEMO'S OWN CLAIM needs it (T2-B-DEMO's True block, T4-A-DEMO's fifth block), and is declined with a stated documentation row otherwise; T3-B-DEMO takes the 3-block fallback by default; exhaustive coverage lives in the asserted T4-B items and the youDo table. Net: ~305 lines instead of 348. Confirm, or cut further and accept the named R3 exceptions.

**Q5.** Should the len() gloss live in T4-A theory or T3-A theory? T3-A-E3 is a T3-A exercise that needs len(). Page order puts all theory before the weDo, so T4-A satisfies first-use, but a learner working by subtopic meets T3-A-E3 first. The glosses of len(), .isascii(), .isdecimal() and .isdigit() become course-first definitions; report their counts after the gate. Note .isdigit() is glossed although the round removes its only two code uses before S05 (s03:432, s03:822), because p5 still names it and S05 uses it 16 times from s05:585.

**Q6.** The unknown-value policy still differs by site: theory[3] R-OESTE → review (CHANGED this revision, so the teacher's reference no longer models T3-A-E1's DEFECT), T3-A region and the youDo → review, T3-A-E3 id type → reject (closed catalog), T3-B table NOT_IN_ALLOWLIST → review. One clause per site cites s03:336 «El status final depende de la política». Is that enough for gestalt, or should the section fix one default?

**Q7.** INSTRUMENT BLIND SPOTS to check by reading code after the round, not by counts. Each fix is its own commit with a baseline proof, out of scope for this read-only plan.
- concept_map.json records 0 `annotation` uses in S03 against 13 `->` sites; it has no `len` entry and does not index docstrings.
- scripts/planted_defect_audit.py matches only double-quoted ids, so S01-S03 starters are never audited.
- NEW: capstone readiness rows see ONLY the gate section's vocabulary (badge_readiness_audit.py:153-169), so no change to S03 can ever move CP-N1-A's row — and CP-N1-A's package tests are placeholders that always pass (tests/test_demo.py test_0..test_4).
- NEW: a figure is credited to a concept only through caption/alt mentions (concept_map.py:139-141), so S03-tri-state illustrates if/elif/else while counting toward nothing, and `if` reads 0/5 at L2.
- NEW: the concept map cannot see prose aliases — terms.ts:447 gives dict only ['Dict'], terms.ts:77 excludes bare «bucle», and course_event_extractor.mts:281's letter lookarounds make «dicts», «diccionario» and «bucle» invisible. That is why the practice guard scans text, not only code.
- NEW: `positions[a::3]` does not describe an attempt (route.ts:206 draws a random variant per concept, options unshuffled): only ~4.5% of possible attempts are 2/2/2/2 and ~40% put 4+ keys at one position. Fix by shuffling each drawn item's options in exam/start and storing the permutation in ExamAttemptForm, or by constraining the draw.
- NEW: SteppedCode chunks at blank lines and every 5 lines and reveals output only after the last chunk (SteppedCode.tsx:83-100, :128), so case blocks roughly triple the clicks and cut chunks at lines ending in ':', splitting `else:` from its body. Candidate fix: never end a chunk on ':', and keep a block of ≤12 lines in one reveal.

**Q8.** Applying R3 literally adds output lines the earlier outline omitted: theory[10] and T4-A-DEMO +1 each, theory[11] +1 block, T2-B-DEMO +1 block, T3-A-E2 net -2 blocks but a new code column, T3-A-E3 +1, T3-B-E2 +1, T3-B-E3 +1, T4-A-E1 +2, T4-A-E3 +2, T4-B-E3 +1, the youDo +1 case. None of these outputs is pinned by an adversarial test. Confirm, or convert named ones to predictions and accept the stated R3 exceptions.

**Q9.** Convention (b)'s new boundary (status alone through T2-A, status+code from T2-B on) makes T3-A-E1 and T3-A-E2 give up byte-identical output. The alternative — dropping codes from T3-A-DEMO so the demo does not model a shape the exercises never ask for — was rejected because the demo's four exits are exactly where the cause matters. Confirm the direction.

**Q10.** Does the section want a `set`-archetype figure in T1-A (membership against a set of literals, including the `"r-sur" in {"R-SUR"}` → False trap), which would move `set` 2/5 → 3/5? This revision names it and does NOT build it, and records T1-A as figure-less plus the truthiness 0/1 gap as shortfalls rather than padding them (D5: «the shortfall is reported rather than padded»).


---

## Items (70)

Every item in the section, including those with no change.

### learningOutcomes (s03:26-35)

**Change.** - Reword O4 (s03:30) to name «ramas de guarda» — the first branches of one if/elif chain, which settle absent or impossible values — plus unreachable-branch detection. CORRECTED RATIONALE: «guard clauses» is dropped not because S03 stops showing the early return (theory[3] still shows and defines it) but because S03 never has the learner APPLY that form; the applied technique is the ordered chain branch.
- Reword O5 (s03:31) «allowlists» → «listas de permitidos», the head-word theory[0] defines (D1 binds outcomes; O5 is the learner's first encounter with the word).
- O1-O3, O6-O8 stay. O8 is delivered by case blocks with asserts.

**Preserves.** All 8 outcomes stay taught and exercised. O4's worth survives as chain ordering, short-circuit guards and the pyramid → flat refactor.

**Constraints.** outcome[1] is the course-first held definition of truthiness; keep it verbatim. O8 must not promise a one-command regression over all branches. Exam concept ids such as 'guard-clauses' are structural and stay. O4/O5 wording is requirement-kind text: the banned-alias list applies.

### section metadata (jobRelevance, level 'Principiante', phase 0; s03:20-25)

**Change.** jobRelevance (s03:25) «listas permitidas» → the same head-word as O5 and theory[0], so one concept has one name across metadata, outcomes and prose.

**Preserves.** jobRelevance, level and phase still describe what a learner has done. progress_phase0_walked (S01-S13) still holds.

**Constraints.** No catalog change. D1 binds jobRelevance.

### theory[0] intro (s03:37-54)

**Change.** - p2: demote the second truthiness definition at s03:42 («a esa comodidad se le llama *truthiness*») to a back-reference; the held definition lives at theory[4].p0. Same for s03:194 in theory[5].
- p3: redefine «salida temprana» as «rama de guarda»: the first branch or branches of an if/elif chain that settle an absent or impossible case; because the chain is exclusive, later conditions only see data that passed them.
- p3 keeps «lista de permitidos» as the section's head-word for the catalog concept.
- p5: S03 carries decision, cause and message in three names; S06 packs them into one value.
- Callout: drop «Esa capa produce el motor de reglas de CP-N1-A…» (S02 precedent: 0 CP-N1-A mentions).
- Keep p1, p4 and p6 verbatim, and the «falla cerrado» and decision-table sentences in p3.

**Preserves.** The section's conceptual map: truthiness vs presence, the permitted list, guard-first ordering, decision table and invariant. Only the mechanism named in one definition changes.

**Constraints.** Anchors: '**Puente desde S02.**' (p1), '**invariante** es una condición que declaras para una etapa concreta' (p4), '**Antes de continuar, predice:**' (p6). Held definition stays at theory[4].p0 only. Paragraph prose: `return` only backticked; no «tipo de dato». No word floor.

### theory[1] Contrato de la sección (s03:55-65, optional)

**Change.** p3: replace the label «Criterio de cierre (CP-N1-A)» with a neutral one, criterion unchanged. p1's «salidas tempranas» → «ramas de guarda», per the one-term rule. ADD one forward sentence to the «Orden de los subtemas» contract: the third block explains a rule with a name because S05 builds on it, and everything the learner writes in S03 stays at top level — so a learner reading the contract knows why block 3 looks unlike everything after it.

**Preserves.** Pacing, subtopic order and the closing criterion: accept, reject and review cases per branch, and actionable messages.

**Constraints.** Stays optional: true. No subtopicId, no anchors. Keep the CASO-LIM-003 sentence in p4.

### theory[2] S03-T1-A (s03:66-111)

**Change.** - Code (comparaciones_intake.py) unchanged; its labels already name expressions.
- p2 (D2): keep the set definition verbatim and swap only `"dni" in {"DNI"}` for a lowercase region code, e.g. `"r-sur" in {"R-SUR"}` → False.
- p5: with region = "R-OESTE" the answer is three changed lines (==, != and in), not one (verified).
- The catalog constant here is ALLOWED_REGIONS, and its member list is aligned with T3-A's (today s03:89 has three members and s03:342 four, so `"R-COSTA" in ALLOWED` is False at T1-A and True at T3-A).
- The figure S03-guard-order MOVES OUT of this block (see its satellite item). T1-A ships with no figure this round; the `set`-archetype candidate is named in the convention and not built. Record the shortfall.

**Preserves.** The learner predicts booleans before any branch exists. The set-of-literals + `in` teaching is unchanged.

**Constraints.** Anchors: 'plataforma de alquiler de bicicletas de Ámsterdam' (p0), '**Modelo mental.**' (p4). Held definition: `set` at T1-A.p2, 8 uses. The program counts toward 42/41. subtopicId 'S03-T1-A'. No caption in this block may use «guarda» — the term is first defined at T2-B, 217 lines later.

### theory[3] Una regla con nombre: def, llamada y return (s03:112-164) — HELD DEFINITION

**Change.** - CODE: change the unknown-region branch from `return "reject"` to `return "review"`. Today the teacher's own reference program encodes exactly the mapping S03-T3-A-E1 marks as a DEFECT the learner must repair (s03:1636 '# DEFECT: None → reject y desconocido → reject (debe ser review en ambos)', feedback s03:1626). Verified on 3.12: the four calls then give review / review / accept / accept, so only output line 2 changes ('R-OESTE → review') and line 5 'R-NORTE es accept → True' survives, as does the figure alt's pinned 'R-NORTE' → 'accept'. DROP the plan's earlier clause calling R-OESTE → reject «the fail-closed policy»; the fail-closed demonstration lives in T3-A-E3, whose catalog the plan already declares closed.
- p0 MOTIVATION rewritten: today it promises that naming the rule removes the repetition — which the other 41 programs then refuse to remove (38 literal copies of the edad funnel alone, against 12 `def` copies today). p0 now says that S03 keeps each decision at top level, that a rule with a name is what S05 builds, and that the repeated blocks ahead are its raw material.
- BRIDGE SENTENCE IS MANDATORY, not optional: the repeated case blocks in this section are what a function names in S05. Same wording constraint as weDo.intro — it may say «repetir un bloque» or «los bucles de S04», never `for` or «bucle for».
- D3's fourth element, a check the learner can perform, using the one program the practice guard exempts: predict, then edit — add a call `decidir_region("R-CENTRO")` and predict its line; delete the final `return` and predict the implicit `None`.
- p3: the narrowing is MANDATORY, not optional — «por eso una guarda puede devolver `review` o `reject` de inmediato» becomes «un retorno temprano, dentro de una función», so the function sense and the chain sense are two named things (convention (c)).
- p4: keep «porque otras partes del programa necesitan usarla» and ATTACH the S05 forward reference after it. Do not replace the purpose clause with a curriculum-location clause (G1).
- Callout: keep the two-limb parallel and fold the S03 case into the first limb — a decision the code will use later is kept in a name, or returned if it lives inside a function; a message «que solo debe ver una persona» is printed. Do not expand it into three flat limbs.
- Keep verbatim: p1 and p2's defining sentences, the figure S03-call-return's caption terms.

**Preserves.** The course's first explanation of function, parameter, call and return, including the implicit None. It keeps covering S04's 8 `return` uses and 1 `parameter` use; one earlier round that replaced it exposed 58 uses and was discarded (test_concept_prompt_weight).

**Constraints.** Held definitions: parameter (p1), call (p2), return (p3 plus the figure). apply_patches refuses a replacement that drops these terms. The concept map counts 66 S03 return uses, 6 inside this block; next definition S05-T1-A.p1. This is the 42nd program: removing it spends the whole margin. Exempt from the practice guard — the exemption is anchored to the heading text, not to the index (ask_first option (a) would renumber it to theory[11]). Prose: `return` only backticked. The glossary entry Parámetro (firstSectionId decisions-rules) stays true.

### theory[4] Antes de decidir: bool (s03:165-188)

**Change.** - Print `repr(monto)` first, then label each line by its expression ('bool(monto)', 'monto is None'), and update the declared output. Today's hard-coded labels lie: with monto = None the output reads 'bool(0) → False' and '0 is None → True' (verified).
- REWRITE p2 (s03:170), which the plan omitted. It quotes the old literal lines and says there are two of them; the rebuilt program prints three, and neither quoted string is printed by any line (verified on 3.12: `None`, `bool(monto) → False`, `monto is None → True`). p2 now predicts three lines with the new labels, then re-runs with -5 and predicts True/False.
- p0 keeps the section's ONLY held definition of truthiness (s03:42 and s03:194 become back-references).

**Preserves.** The predict-change-rerun loop now tells the truth for every value the prose asks about (0, None, -5).

**Constraints.** Held definition: truthiness at theory[4].p0; keep the term. Single-path exception. The program counts toward 42/41. Do not merge with T1-B. R7. Brief p2 by what it must teach (predict a labelled line per question), not by a word count.

### theory[5] S03-T1-B (s03:189-233)

**Change.** - Remove decide_monto and its docstring.
- THREE case blocks, monto = None / 0 / -5 (150 drops: its only job, «truthy positive», is T1-B-DEMO's fourth row). Each computes `ausente = monto is None` and `negativo = monto is not None and monto < 0`, then prints repr(monto), bool(monto), ausente, negativo on one line (E-a with named columns).
- Keep the '"" or "default"' and '5 and 99' lines and add '0 and 99', which p3 claims but no code shows.
- p5: compare the bool column against the ausente and negativo columns instead of against decide_monto.
- p0/p1: the truthiness sentence at s03:194 becomes a back-reference to theory[4]'s definition (A5: one definition, not three).
- The policy (absent → review, zero → accept, negative → reject) stays as prose in p4.

**Preserves.** Every T1-B claim runs: falsy values, presence, the short-circuit that keeps None away from `<`, and operand-returning and/or. Branching moves to the blocks that teach it.

**Constraints.** Anchors: 'portal de donaciones de Berlín' (p0), '**Dos capas, dos preguntas.**' (p4). Text values cannot join these blocks: `"" < 0` raises TypeError at the `negativo` line (3.12), and T2-B owns the type guard. Stated cost: theory[4], theory[5], T1-B-DEMO and T1-B-E1 still print bool columns in sequence; each adds a column or a value set the previous one does not run, and the duplicate definitions are what this round removes. The program counts toward 42/41. subtopicId 'S03-T1-B'.

### theory[6] S03-T2-A (s03:234-280)

**Change.** - TWO blocks, not one: score = 80 and score = 60. Each runs the exclusive chain assigning status_good, then the THREE-`if` overwrite version assigning status_bad, then prints both (E-b, `differ=` or a labelled pair). Verified on 3.12: 80 → good accept / bad review (they differ); 60 → review / review (they agree). One row is not enough — the danger of the two-if form is that it is right most of the time.
- THE OVERWRITE BLOCK IS THREE `if`s (`>= 80`, `>= 50`, `< 50`), the same shape as T2-A-E2. With two `if`s and no else, the plan's own instructed prediction at 49 raises `NameError: name 'status_bad' is not defined` (verified) instead of printing reject/reject. This is R2's one named exception; state it in the convention, not here.
- No def, no annotations. Chain shape is R6(2), ordered banding.
- Callout: drop «o retorna temprano»; keep «cambia los `if` posteriores por `elif`».
- p3: assign one status per field instead of «devolver».
- p5 keeps 79 / 50 / 49 / 95 as named predictions run by editing one opening line (verified with the three-if shape: 79 review/review, 50 review/review, 49 reject/reject, 95 accept/review). p4's «Fronteras (`score >= 80`) deben estar documentadas en la tabla de ejemplos» now has a two-row table plus named predictions behind it.

**Preserves.** Exclusivity, first-true-wins, inclusive boundaries and the overwrite bug, now observable where `return` used to make it impossible.

**Constraints.** Anchors: 'centro de soporte de Montreal' (p0), '**Lee la cadena como una fila de puertas.**' (p4). ~+8 lines over the single-block outline; D6 counts are floors, not ceilings. status_bad/status_good match T2-A-E2. The figure S03-tri-state is redrawn for THIS chain (see its satellite item). The program counts toward 42/41.

### theory[7] S03-T2-B (s03:281-327)

**Change.** - Case blocks edad = None and edad = 30 through the funnel: is None → review MISSING; `not isinstance(edad, int) or isinstance(edad, bool)` → reject BAD_TYPE; `edad < 0 or edad > 120` → reject OUT_OF_RANGE; < 18 → review NEEDS_REVIEW; else accept OK. Branches use (status, code) tuple rows.
- First tuple row of the section: tie it in one sentence to S02's `ok, edad, error = resultado` — without the word «desempaquetado» (declared S06; say «asigna los dos nombres en una línea»).
- p1: a «rama de guarda» is the first branches of the chain (chain sense; the function sense stays in theory[3] as «retorno temprano»).
- p4: «el else final» replaces «el último return», written as a CONTRAST with T2-A — a banding chain orders by threshold, a validation chain orders by what can break, so here the happy path moves to the end. Not as a flat rule the learner has already seen broken.
- p5: the reorder experiment. Move `edad < 18` first, run with None, and quote the last line AS INLINE CODE inside a Spanish sentence: `TypeError: '<' not supported between instances of 'NoneType' and 'int'`. State R2 here.
- This block receives the figure S03-guard-order (satellite item), whose rows are this funnel.

**Preserves.** The funnel, ordering discipline and dead-branch reasoning. The TypeError p0/p2 warn about becomes something the learner produces and observes. status and code survive as two names.

**Constraints.** Anchors: 'sistema de admisiones de Nairobi' (p0), '**Modelo mental de embudo.**' (p4; keep the anchor while rewording). Held definition: exception at T2-B.p0, verbatim. Keep the dead-branch example (x >= 0 / x > 5) consistent with T2-B-E3. R3 DECLINED HERE, stated: the type and range arms (including the bool and >120 alternatives) are named predictions ('25', True, -1, 15, 130), not blocks; the demo and E1 carry those cases. Prototype: 37 lines. The program counts toward 42/41.

### theory[8] S03-T3-A (s03:328-368)

**Change.** - Blocks `region, edad = ("R-FUERA", 30)` and `("R-COSTA", 15)`. Chain: None guard → review MISSING; not in ALLOWED_REGIONS → review NOT_IN_ALLOWLIST; not (18 <= edad <= 65) → reject OUT_OF_RANGE; else accept OK, with (status, code) rows. Verified: 'R-FUERA 30 → review NOT_IN_ALLOWLIST', 'R-COSTA 15 → reject OUT_OF_RANGE'.
- p1 REWRITE, which the plan left untouched: drop the second bolded definition («Una **allowlist** es el conjunto de valores admitidos») and reuse theory[0]'s «lista de permitidos» as the head-word, introducing «allowlist» once as the English name the code constants use. Fix the phantom constant `ALLOWED_REGIONES` (s03:333, defined nowhere) to `ALLOWED_REGIONS`, and align this block's member list with T1-A's. Replace «Con exclusividad de ramas y guards…» with the Spanish term.
- Add one clause: the code catalog of T1-A and the named catalog of the demos are the same rule over different data.
- Predictions: R-NORTE 30 (accept OK), None 40 (review MISSING), R-FUERA 15 (still NOT_IN_ALLOWLIST, because the allowlist branch runs first).

**Preserves.** Unknown vs invalid shown with both status and code. The theory shows the contrast pair; T3-A-DEMO covers all four exits.

**Constraints.** Anchors: 'aseguradora digital de Singapur' (p0), '**No confundas desconocido con inválido.**' (p4). Keep the callout's fictitious-codes disclaimer and s03:336's «El status final depende de la política». Prototype: 33 lines. The program counts toward 42/41.

### theory[9] S03-T3-B (s03:369-411)

**Change.** - A top-level `match code:` whose arms assign status, with four blocks: OK, NOT_IN_ALLOWLIST (third alternative of the review arm), BAD_TYPE (second alternative of the reject arm) and FOO (wildcard).
- Keep the p1 table (NOT_IN_ALLOWLIST → review) and the 3.10+ callout unchanged.
- Predictions: MISSING, NEEDS_REVIEW, OUT_OF_RANGE and lowercase 'ok' (review).
- Drop the def and the annotations.
- The R3 refinement is NOT written into learner prose. No sentence says a row is «only documentation» or that a case cannot detect a deleted arm (D12/G2). The point becomes a T3-B-DEMO retrospective question the learner answers by deleting an alternative and re-running.

**Preserves.** Table → code translation, OR patterns, the wildcard as a safety default, and first-match-wins. Every arm has a running case, instead of the analyst's 2-row cut.

**Constraints.** Anchors: 'mesa de ayuda global' (p0), '**Modelo mental: tabla primero, código después.**' (p4). R3 DECLINED for the review arms (a review arm under a review default cannot be protected by any case, verified); the constraints record it and the prose claims nothing. BAD_TYPE does detect its dropped alternative (verified). Needs Python 3.10+. The program counts toward 42/41.

### theory[10] S03-T4-A (s03:412-468)

**Change.** - FIVE blocks `contacto, esperado = (...)`: '999000111' accept, '12345' reject, None review, '  ' reject, and NEW '١٢٣٤٥٦٧٨٩' reject. The four pinned lines come first, so the existing byte-identical prefix survives and the fifth line is the new output.
- The funnel keeps the SPLIT the plan proposed (is None → review; not a str or blank after strip → reject; `not (isascii() and isdecimal())` → reject; `len(...) != 9` → reject; else accept), because the split plus the fifth block is the ONLY form that both covers every branch and protects the L1Q3-2 fix. Verified on 3.12: with the four original cases the digit branch is unreachable and deleting it leaves the output identical; with the fifth block, base gives reject and the mutant gives accept.
- Print with E-b: repr(contacto), →, status, `ok=`, status == esperado.
- The invariant becomes a comment line at the top; the dead name `invariant_text` goes.
- Gloss `len()`, `.isascii()`, `.isdecimal()` AND `.isdigit()` in one sentence each in the same `x.metodo()` form — p5's counterexample names `isdigit()`, and this round removes the course's only two `isdigit` code uses before S05 (s03:432 and s03:822; S05 then uses `c.isdigit()` 16 times from s05:585). Record all four as course-first definitions to recount after the round.
- p3: branches assign status/code/message instead of «Usa returns». p4: «el código usa un `if`» instead of «La función usa…».
- p5 counterexample verified: '١٢٣٤٥٦٧٨٩'.isdigit() True, .isdecimal() True, .isascii() False.

**Preserves.** Invariant, then examples, then a checked expectation for EVERY branch — now literally true at 5 of 5, where the plan's four-case split covered 4 of 5.

**Constraints.** Anchors: 'equipo de logística de Copenhague' (p0), '**Busca el contraejemplo.**' (p5). Invariant/specification defined at p1. The assert mention at p3 is a reinforcement. The 9-digit invariant rejects S02's 10-character '0999000111' (verified): ask-first. Declared output gains exactly one line. The program counts toward 42/41.

### theory[11] S03-T4-B (s03:469-540)

**Change.** - FIVE blocks `edad, esperado = (...)`: None, True, -5, 0 and NEW 121 (the non-first alternative of `edad < 0 or edad > 120`). Verified: without 121 the prototype stays green (rc=0) when `or edad > 120` is deleted, while the bool and `<= 0` mutants go red. Each block runs the chain with tuple rows plus a message line, then `assert code == esperado`, then print('PASS', …, message) (E-c).
- STATE ONCE, at p2 or p5 where O8 is taught: each block carries its own copy of the rule, so its assert protects only that copy. The «Predice la prueba roja» experiment must change the condition in EVERY block (replace-all), and the prose quotes only the final AssertionError line. Verified on 3.12: `edad <= 0` in the first copy only → exit 0, 4 passes, no error; in all copies → exit 1, AssertionError. Name S05's function as what lets one suite protect one rule. Move the one-test-per-copy trade-off UP from T4-B-E2 to here, where O8 is introduced.
- STATE the message asymmetry here (convention (b)): the row protects status and code, the message only by the rule; the experiment is to delete one `message =` line and re-run (verified: it prints the previous block's sentence with no error).
- 'x' and False become predictions; the iDo still shows 'x'. Keep every message line ≤ 88 columns (today's BAD_TYPE line is 98).
- p2: `_run_tests` becomes the youDo's case table. Callout: `validate_record` becomes the youDo's record status.
- p3's generic `>= 18` vs `> 18` may stay; T4-B-E3 practises 18.

**Preserves.** Messages, stable codes, one assert per branch, and a boundary-protecting red test. The status/code/message triple survives as three names (D14 worked consequence).

**Constraints.** Anchors: 'servicio de salud de Toronto' (p0), '**Tres capas, una misma verdad.**'. Code spellings stay as the youDo test pins them. Claims are qualified: the mutants go red WHEN APPLIED TO EVERY COPY; first-copy-only stays green (verified). ~+12 lines for the 121 block. The program counts toward 42/41. D14 trade-off stated: 6 embedded cases become 5, one per branch plus the range alternative.

### iDo.intro (s03:543-544)

**Change.** (none)

**Preserves.** The predict → run → trace → retrospect routine fits the repeated blocks, and «la evidencia debe provenir de la ejecución» stays.

**Constraints.** Sits inside the iDo span that test_every_i_do_models_reasoning_and_closes_with_transfer scans.

### S03-T1-A-DEMO (s03:546-580)

**Change.** (none)

**Preserves.** Already clean: booleans on one record, a set allowlist and the chained range. The counterfactual is a re-run.

**Constraints.** Pin 'prueba contrafactual' in the retrospective. Words: preamble 72 / why 44 / retro 52 (floors 50/35/40). Catalog constant spelled ALLOWED_REGIONS per convention (c). The program counts toward 42/41.

### S03-T1-B-DEMO (s03:581-627)

**Change.** - Remove decide_monto. Keep the `nota = ""` bool line first.
- Blocks monto = None / 0 / -5 / 150 through the four-branch policy chain (is None / == 0 / < 0 / else), assigning `policy` with the four policy strings verbatim.
- One evidence line per block (E-a): value, bool(monto), policy (merged layout, 46 lines, verified). The declared output changes.
- Drop the preamble/why phrasing that implies a named function.

**Preserves.** None vs 0 on one screen, the same bool with a different policy, and the exclusive four-branch chain whose order keeps `< 0` away from None. All four branches exercised.

**Constraints.** Words: preamble 61 / why 43 / retro 57. Single-quoted strings. This is the demo that carries the 150 row theory[5] drops. D4 cost: ~11 clicks against today's ~6. The program counts toward 42/41.

### S03-T2-A-DEMO (s03:628-662)

**Change.** - Blocks score = 80 / 79 / 50 / 49 through the three-branch chain assigning status, printing `score → status` (E-a; 35 lines; verified accept, review, review, reject).
- Replace «Corre el bucle»: brief the replacement by what it must teach — that each block is one run of the same chain with one value changed — not by matching a word count.
- The code title becomes a file name, not classify_score.
- The retrospective's overwrite bug is now real (verified: two ifs give 95 → review).

**Preserves.** The exclusive chain, inclusive boundaries tested on both sides, and order as contract. 95 stays as the retrospective's mental swap.

**Constraints.** Words: preamble 56 (floor 50) / why 43 / retro 49 — replacement briefed by content, not length. R6(2) banding shape. The program counts toward 42/41.

### S03-T2-B-DEMO (s03:663-701)

**Change.** - SIX blocks: edad = None / "25" / True / 200 / 15 / 30 through the flat funnel with (status, code) tuple rows and the bool exclusion; print(repr(edad), "→", status, code) (E-a). The True block is required by R3 and by this item's own claim: verified on 3.12, the five-block outline (None/"25"/200/15/30) prints IDENTICAL output with the bool exclusion deleted, so the preserves sentence about True had no case behind it. 200 already covers the non-first alternative of the range OR.
- -1 moves to the counterfactual.
- Preamble: `repr(e)` → `repr(edad)`.
- Description and heading drop validate_edad and describe the change from pyramid to flat elif funnel.
- The retrospective keeps its pin and adds the reorder counterfactual (`edad < 18` first), quoting the last TypeError line as inline code. Its promise about the We Do must match T2-B-E2's pyramid → flat refactor.

**Preserves.** Every input traced to its exit, type checked before range, a stable code per exit. Today True gets NEEDS_REVIEW; the bool exclusion now sends it to BAD_TYPE — and one shipped block proves it.

**Constraints.** Pin 'Dibuja el embudo de casos'. Words: preamble 55 / why 42 / retro 49. ~76 lines, ~15 SteppedCode clicks against today's 4: the D4 cost is stated in the convention, not absorbed. The program counts toward 42/41.

### S03-T3-A-DEMO (s03:702-736)

**Change.** - Blocks (Lima, 30), (Tacna, 30), (Piura, 15), (None, 40) with (status, code) rows (E-a; 49 lines; verified accept OK, review NOT_IN_ALLOWLIST, reject OUT_OF_RANGE, review MISSING).
- Retrospective: today's pair (R-FUERA 30 vs R-COSTA 15) gives review/review under this demo's allowlist (verified). Use Tacna 30 vs Piura 15 and ask a question the printed codes do not already answer.
- why (s03:733): replace «La función no agrupa…».
- Preamble: say the records are synthetic and the catalog is a fixed list, instead of «regiones sintéticas» for real place names.
- Catalog constant spelled ALLOWED_REGIONS.

**Preserves.** The combined permitted-list-plus-range rule and unknown ≠ invalid, now with the cause printed. The None guard still runs first.

**Constraints.** Keep the region names Lima/Arequipa/Cusco/Piura/Tacna: S04's fixtures depend on them (s04:1855-1869). Words: preamble 63 / why 47 / retro 52. Four blocks because the chain has four exits — this is the demo whose claim needs them. The program counts toward 42/41.

### S03-T3-B-DEMO (s03:737-805)

**Change.** - THREE blocks by default: OK, BAD_TYPE, FOO (~65 lines, ~14 clicks). Each has the five-branch if chain assigning status_if (keeping the separate `elif code == "NOT_IN_ALLOWLIST"`), the match assigning status_match, and print(code, status_if, status_match, 'same=', status_if == status_match) (E-b). The 4-block form is 87 lines / 19 clicks with 8 chunks ending on a `:` header (measured by porting segmentCode), the longest program in S03 against today's 47: D4 and the reading-load finding both point at the 3-block form.
- NOT_IN_ALLOWLIST, MISSING and NEEDS_REVIEW become the counterfactual under «Tapa una implementación»; rewrite «cinco resultados».
- The RETROSPECTIVE carries the R3 point as an experiment, not as a caveat: delete one alternative from an arm, predict `same=`, re-run. Verified: dropping `| "BAD_TYPE"` gives same= False; dropping `| "NOT_IN_ALLOWLIST"` still gives same= True, because the default is review.
- Drop the defs and the annotations.

**Preserves.** One table in two forms, a real equivalence check, OR patterns, and a wildcard that does not accept. The one arm whose deletion is detectable (BAD_TYPE) is shipped as a block.

**Constraints.** Pin 'Tapa una implementación'. Keep «Requiere Python 3.10+ (el curso usa 3.12)». Words: preamble 58 / why 39 / retro 51. No learner prose claims that a review row guards its arm (D12). The program counts toward 42/41.

### S03-T4-A-DEMO (s03:806-850)

**Change.** - The same funnel and FIVE blocks as theory[10] (isascii + isdecimal + len; `contacto, esperado = (...)`), with the four pinned lines first and '١٢٣٤٥٦٧٨٩' → reject as the new fifth line.
- Preamble and why: replace «Corre la lista `examples`» and «`examples` intenta refutarla» with the case blocks, each with its esperado. Brief the replacement by what it must teach (an invariant is refuted by a value, and each block carries the value it predicts), not by a word count.
- Retrospective's fifth example becomes a sixth: the two verified candidates stay — int 999000111 → reject (the non-str branch no shipped case reaches) and ' 999000111 ' → accept (does the invariant allow surrounding spaces?).
- Gloss `.isdigit()` alongside len/isascii/isdecimal (theory[10] owns the gloss; the demo may not name a method the theory never explains).

**Preserves.** Invariant → accept/reject/review examples, repr exposing '  ', and a counterexample hunt. Every block keeps an explicit expected value, and the digit branch now has one.

**Constraints.** Words: why 36 (floor 35) / preamble 61 / retro 46 — replacement briefed by content. The 9-digit invariant is ask-first. Declared output gains exactly one line. The program counts toward 42/41.

### S03-T4-B-DEMO (s03:851-914)

**Change.** - Blocks edad = None / "x" / -5 / 35 with tuple rows, the bool exclusion and `message = ...` on its own line; f-strings with {edad!r} and {type(edad).__name__} unchanged. Then assert code == ..., print('PASS', edad, code), print(' ', message) (E-c). 67 lines; declared output byte-identical (verified).
- Preamble: three separate names instead of «devuelve `{status, code, message}`». Drop the `_run_tests` sentence and brief its replacement by content.
- The retrospective's defective-change answer names 121: deleting `or edad > 120` keeps every assert green until a 121 block exists (verified). That is how this item discharges R3 without changing a byte-identical pinned output.
- Same qualification as theory[11]: dropping `edad < 0` turns the -5 assert red only when the change is made in the -5 copy; a first-copy-only edit stays green (verified, exit 0, 4 passes).

**Preserves.** status (flow), code (counting) and message (action) kept separate; one assert per branch. The pin's defective-change challenge is now provable and correctly scoped.

**Constraints.** Pin 'qué cambio defectuoso la volvería roja'. Words: preamble 53 (floor 50) / why 37 / retro 47. R3 DECLINED for the bool alternative and for `> 120` as blocks, because the output is pinned byte-identical; both are stated as documentation rows, the second answered in the retrospective. The program counts toward 42/41.

### weDo.intro (s03:918-919)

**Change.** - Add the case-block routine once, IN SPANISH (the English here is the brief, not the copy): repair the chain first, then copy the repaired block, then change only its first line.
- Add the selector-vs-blocks rule: blocks when the claim is about several cases at once and nothing in the program checks them; a selector only when the block form would be unreadable AND the item carries its own per-run check, in which case every row's result is recorded as evidence.
- Add that the repetition is what S04 and S05 will remove, WITHOUT the word `for` or «bucle for»: «repetir un bloque» or «los bucles de S04».
- Keep the E1 → E2 → E3 sentence, the 24-exercise claim and the CASO-LIM-003 claim.

**Preserves.** The gradual-release framing and the evidence-over-appearance rule.

**Constraints.** This is weDo.intro, learner-facing Spanish. The forward reference wording is checked by the widened practice guard. The 24-exercise CASO-LIM-003 claim stays true only if every starter keeps its header. The repair-before-copy sentence is repeated as the first instruction step of every R5 item, because 20 of the 24 items have no assert and a drifted copy is otherwise invisible.

### S03-T1-A-E1 (s03:922-973)

**Change.** No code change. Optional: point the retrospective's re-run at 65 as well as 18. At 18 no line changes; at 65, `edad < 65` flips while the inclusive chain stays True (verified). NOTE for the starter-visibility test: this item is invisible under a line-MEMBERSHIP rule (starter prints False/False/False/True/False, solution True/True/True/False/True — every starter line is a line of the solution output), and visible under the ORDERED rule the test now uses. That is why the test is specified as an ordered comparison rather than as line absence.

**Preserves.** Five inverted comparisons repaired and predicted before running; no if. The item needs no rewrite once the test is stated correctly.

**Constraints.** Retrospective 50 words, cues 'Explica'/'pregunta'/'¿' (floor 45 plus a cue). Éxito True, True, True, False, True. The program counts toward 42/41.

### S03-T1-A-E2 (s03:974-1016)

**Change.** - D2: re-domain TIPOS_DOC {"DNI","CE","PAS"} onto opaque internal record-type codes, using the same catalog constant and codes as T3-A-E3 (CLI, PED, plus a third if wanted).
- Two-line blocks: `tipo = "..."` then print(tipo, "→", tipo in ALLOWED_ID). Cases: an allowed code, its lowercase form, a second allowed code, an unknown code. Éxito True, False, True, False.
- The starter holds every block with `tipo == "<first code>"` (R5 exception, reason: the second allowed code is what makes the defect visible; today starter and solution print the same three lines, verified).
- Fix the starter comment «compara con == lista». Make hint and hints[0] agree.
- Update preamble, instruction, hints, feedback, tests and retrospective to the new codes and `tipo`.
- HEADING → Spanish (drop «Membership»). FILE NAME stays allowlist_tipo_doc.py or moves to an id-based name with T3-A-E3; say which.

**Preserves.** Permitted-list membership with `in`, the literal case-sensitive contract, and the normalise-or-review policy question.

**Constraints.** Retrospective 46 words — one of the two THINNEST in the section against the 45-word floor (measured with the gate's own tokenizer): replace words, never delete. Keep 'explica'/'¿' and the forward reference to E3. It is red today under the ordered starter-visibility rule (byte-identical output) and this change fixes it. The program counts toward 42/41.

### S03-T1-A-E3 (s03:1017-1062)

**Change.** Bind the operands to names (`bandera = True`, `uno = 1`, then `bandera == uno` and `bandera is uno`). This removes the 3.12 SyntaxWarning from `True is 1` (verified on starter and solution) while the printed values stay the same. The S03-specific transfer (region None vs 'R-OESTE') is ask-first.

**Preserves.** Identity vs equality and the rule '`is None` for absence, `==` for business values', including the fill-in retrospective.

**Constraints.** Retrospective 47 words (floor 45), cues 'explica'/'pregunta'. Keep the 'Nota:' line in the output. Near-duplicate of S02-T2-B-E1 (same file name is_vs_eq.py): open. The program counts toward 42/41.

### S03-T1-B-E1 (s03:1064-1113)

**Change.** - NINE two-line blocks (`v = <value>` / print(repr(v), "→", bool(v))): None, False, 0, Decimal("0.00"), "", [], "0", " ", [0]. Verified on 3.12: six False then three True. `from decimal import Decimal` at the top (Decimal is shipped, not a prediction, so no unused import).
- `()` NEVER APPEARS. The plan's `{}` → `()` swap replaced one S06 construct with another: the course has never shown the empty tuple, T1-B's own p1 defers empty-collection forms to S06 (s03:194), S02 introduces the tuple only through `(True, 19, None)` (s02:176), and «parentheses make a tuple» is a half-truth (`(5)` is not one). `set()` and `range(0)` also go; the replacements are S02 types plus the two intake confusions that cost most: "0" (text zero, truthy) and " " (blank vs empty, the trap T1-B p2's `not s.strip()` already names).
- 0.0, "x" and 1 become named predictions run by editing one opening line.
- STARTER takes R5's MAIN rule, not the exception: one block (`v = 0`, printing `v is not None` → True where bool(0) is False), with the remaining values listed in text. Twelve byte-identical repairs was the R5 breach.
- Text: Éxito «seis False y tres True»; tests 'checklist: 6 falsy + 3 truthy en el orden dado'; Límites «no reordenes los casos»; instruction steps 2 and 4 (no «Recorre la lista `vals`»); hints[1] becomes "0" vs 0 and " " vs ""; edgeCases drop range(0). The feedback «nueve True al inicio» is wrong for the new starter and is rewritten.
- Retrospective: reword off «doce valores» (verified NOT a pin: `grep -rn "doce valores" tests/adversarial/` returns nothing; the only pin is 45 words plus a cue) to the ideas it already names — ausencia, cero, vacío, blanco — plus the non-empty container of a falsy value.

**Preserves.** The same planted presence-vs-truthiness confusion, the four ideas the retrospective groups by, and [0] as the non-empty container of a falsy value. Nine shipped values plus three predictions still exceed the twelve-value table's teaching.

**Constraints.** Retrospective 54 words, '¿' — the count claim changes, the floor and cue do not. Keep the instruction's inline truthiness gloss (D1 held). The T1-B-E1 entry is REMOVED from the convention's R5 exception list. The program counts toward 42/41.

### S03-T1-B-E2 (s03:1114-1159)

**Change.** (none)

**Preserves.** Operand-returning and/or over five distinct expressions; no blocks.

**Constraints.** Retrospective 54 words, '¿'. Wording stays consistent with theory T1-B ('"" or "default"', '5 and 99'). The program counts toward 42/41.

### S03-T1-B-E3 (s03:1160-1212)

**Change.** - Solution: blocks monto = None / 0 / -1 / 100, each `if monto is None → review / elif monto < 0 → reject / else → accept` assigning status. Declared output unchanged.
- Starter (R5): one block at monto = 0 with `if not monto: status = "reject"`, printing 0 → reject; the remaining cases listed in text; first instruction step is repair-then-copy.
- m → monto throughout.
- REWRITE THE INSTRUCTION (s03:1168), which the plan left stale: step 1 «Sustituye `if not m: return "reject"`» and step 5 «Prueba el bucle dado» both name constructs the rebuilt code does not contain. Step 1 becomes the assignment form; step 5 becomes running each block. This is also concept_map.json's `return`.exercises[0] location.
- Optional hint: putting `monto < 0` first stops the None block with TypeError; quote the last line as inline code.
- Feedback: drop «(CP-N1-A)» (s03:1176).
- Retrospective: «`validate_record` en el You Do» → the youDo's record status.
- Add one edgeCase for a half-edited copy.

**Preserves.** The same bug (truthiness used as presence swallows 0), presence before comparison, and the same four cases and output. The learner now writes the exclusivity with elif/else.

**Constraints.** Retrospective 52 words, 'explica'. The tests field and the Éxito line stay valid. E-a evidence line. The program counts toward 42/41.

### S03-T2-A-E1 (s03:1214-1269)

**Change.** - Solution: blocks score = 80 / 50 / 49 / 100 with the exclusive chain assigning status, printing `score → status` (E-a). Aim for byte-identical output.
- Starter (R5): one block at 80 with the inverted thresholds, printing 80 → reject; the defect is visible only at 80, 49 and 100 (verified). First instruction step is repair-then-copy.
- Preamble Meta: no classify_score. Header comment names the chain. Instruction steps: runs, not a loop. Tests: four blocks.
- 79 stays the retrospective's paper prediction.
- Add one edgeCase for a half-edited copy.

**Preserves.** The same boundaries (80/50/49/100), exclusivity, and the planted inversion repaired once.

**Constraints.** Retrospective 49 words, 'explica'/'¿'. FILE NAME 'bandas_score.py'. R6(2) banding shape. R3 note: 79 is a named prediction, kept because the retrospective asks for it on paper. The program counts toward 42/41.

### S03-T2-A-E2 (s03:1270-1339)

**Change.** - Blocks score = 95 and score = 60. Each holds the THREE-`if` block assigning status_bad with a trace print after each assignment, then the exclusive chain assigning status_good, then print(score, 'bad=', status_bad, 'good=', status_good) (E-b). 60 is the row where the two forms AGREE — without it the learner sees only divergence and learns the opposite of the lesson.
- Starter (R5): the 95 block with the three ifs and `status_good = None  # DEFECT`, printing 'good= None'. No `pass`.
- 30 becomes a named prediction.
- Preamble, instruction, hints[1], feedback, tests and retrospective drop call syntax (bad(95)/good(95)), «Cambia el bucle» and 'status key'.

**Preserves.** The overwrite defect in its most natural top-level form, the 'do not fix the broken version' constraint, and the exclusivity lesson. The trace prints turn the overwrite into executed evidence (verified at 95: accept, review, then '95 bad= review good= accept').

**Constraints.** Retrospective 52 words, 'Compara'/'pregunta'/'¿'. FILE NAME 'ifs_vs_elif.py'. edgeCase 'doble asignación de status'. R2's named exception applies (three ifs, so every predicted value is covered). The program counts toward 42/41.

### S03-T2-A-E3 (s03:1340-1395)

**Change.** - Solution: blocks n = 150 / 75 / 10 / 0 / -3 with the four-band chain assigning `banda` (alto/medio/bajo/nulo). Aim for byte-identical output.
- Starter (R5): one block at n = 75 with the one-threshold defect, printing 75 → alto. At 150 the defect would be invisible (verified). First instruction step is repair-then-copy.
- Preamble Meta: no call syntax. Instruction step 3: runs.
- Add one edgeCase for a half-edited copy.

**Preserves.** Designing a four-branch chain from a spec, strictest threshold first, and else covering 0 and negatives.

**Constraints.** Retrospective 54 words. Labels alto/medio/bajo/nulo. FILE NAME 'trazar_bandas.py'. The single letter n stays. R6(2). The program counts toward 42/41.

### S03-T2-B-E1 (s03:1397-1451)

**Change.** - Solution: blocks edad = None / "25" / 15 / 30 / 130 through the funnel (None → review MISSING; not int or bool → reject BAD_TYPE; <0 or >120 → reject OUT_OF_RANGE; <18 → review NEEDS_REVIEW; else accept OK) with tuple rows and a labelled print (E-a). 130 is the non-first alternative of the range OR.
- Starter (R5): one block at None, `if not edad: status, code = ("reject", "BAD")` / else accept OK. No semicolons. First instruction step is repair-then-copy.
- REWRITE THE INSTRUCTION (s03:1405), which the plan left stale: step 3 «Devuelve dicts `{status, code}`» and step 4 «Prueba con `repr(e)` los cuatro valores del bucle» name a dict, a return and a loop the rebuilt code does not contain. Step 3 becomes the two-name tuple row; step 4 becomes running the five blocks with repr(edad).
- Add the reorder → TypeError observation step, quoting the last line as inline code.
- Heading and preamble: drop «early returns», dicts and validate_edad; use «rama de guarda».
- hints[1]: every branch assigns both names; the happy path is the final else.
- Feedback: «el primer guard» → the second, after None.
- Retrospective: «cuatro valores» → cinco.

**Preserves.** Guard order, a distinct code per cause, no TypeError, and the anti-truthiness lesson. The self-check pin 'comparar None con < lanza TypeError' stays consistent.

**Constraints.** Retrospective 52 words, only cue '¿'; keep a cue. The code spellings are pinned in the youDo test. FILE NAME 'guards_edad.py' (English file name, stated). R3 DECLINED for the bool alternative: stated as a documentation row, carried by T2-B-DEMO's True block. The program counts toward 42/41.

### S03-T2-B-E2 (s03:1452-1535)

**Change.** - NO LONGER A SELECTOR ITEM. THREE blocks: monto = None / 0 / 20000. Each runs the nested pyramid (each leaf assigning status_nested) and the flat chain (status_guards: None → review; not int → reject; <0 → reject; <=10000 → accept; else review), then print(repr(monto), status_nested, status_guards, 'ok=', status_nested == status_guards) (E-b).
- WHY: verified on 3.12, at the plan's pinned `monto = 20000` all three flattening errors this item exists to prevent print `ok= True` — wrong guard order, dropped None guard and truthiness-as-presence. None catches the two order errors, 0 catches the truthiness error, 20000 keeps the policy edge. One run now checks all three failure modes, as today's six-value run did.
- Starter: the None block with `status_guards = None` placeholder, printing repr(monto) and status_nested; the other two blocks listed in text. First instruction step is repair-then-copy.
- Éxito lists the three shipped rows plus "x", -1, 500, 10000 and 10001 as named predictions run by editing one opening line (all ok= True, verified).
- Text: no «funciones», no «bucle de seis casos»; «ambas versiones»; «rama de guarda» for the Spanish term at s03:1455/1457/1460/1464.

**Preserves.** A semantics-preserving refactor (depth 4 → 1), the self-checking ok=, and 20000 as the policy edge a careless flattening breaks (a final `else: reject` slip gives ok= False).

**Constraints.** Stated trade-off: ~50 lines and ~11 clicks against today's 28-line single run; the alternative (one selector row) was verified to give a false green on all three failure modes. FILE NAME 'refactor_guards_monto.py'. edgeCases stay, plus one for a half-edited copy. Retrospective 54 words. The int-vs-Decimal type guard follows the monto ask-first. The program counts toward 42/41.

### S03-T2-B-E3 (s03:1536-1607)

**Change.** - Solution: blocks x = 6 / -2 / 0. Each holds the buggy chain assigning etiqueta_bug with a marker print inside the dead `elif x > 5` (it never prints, verified), then the fixed chain assigning etiqueta_ok, then the bug and ok prints. The explanatory note line uses the set argument.
- Starter (R5): one block at 6 with the buggy chain AND `etiqueta_ok = None  # DEFECT` printed as the ok line. Without the placeholder the starter prints only 'bug 6 → no-negativo', which the ordered starter-visibility rule still passes but which a reader cannot distinguish; the placeholder makes the defect explicit.
- First instruction step is repair-then-copy; add one edgeCase for a half-edited copy.

**Preserves.** Dead-code detection by reading condition order, the universal set argument, and a design fix rather than a magic number. The marker adds branch instrumentation.

**Constraints.** Retrospective 47 words, 'Describe'/'pregunta'/'¿'. NOT the thinnest retrospective: T1-A-E2 and T4-B-E1 are, at 46 (measured with the gate's tokenizer, floor 45). Labels no-negativo/grande-positivo/negativo/positivo/cero. Keep x >= 0 / x > 5 consistent with theory T2-B. FILE NAME 'rama_muerta.py'. The program counts toward 42/41.

### S03-T3-A-E1 (s03:1609-1663)

**Change.** - Solution: blocks region = "Lima" / "Tacna" / None with `if region is None → review MISSING / elif region not in ALLOWED_REGIONS → review NOT_IN_ALLOWLIST / else accept OK`. The output GAINS A CODE COLUMN per convention (b)'s boundary rule, so the We Do is not thinner than the I Do it follows; byte-identical output is given up deliberately (no adversarial test pins these three lines).
- Starter (R5): one block at Tacna with `if region not in ALLOWED_REGIONS: status, code = ("reject", "NOT_IN_ALLOWLIST")`, printing Tacna → reject. First instruction step is repair-then-copy.
- r → region in Meta, instruction and hints. hint/hints[0]: assignment form.
- The DEFECT stays «unknown → reject», which is no longer the teacher's own reference program: theory[3]'s decidir_region now returns review for an unknown region.

**Preserves.** A fail-closed rule that is too strict, repaired with an explicit absence branch; unknown → review, not reject.

**Constraints.** Retrospective 53 words. FILE NAME 'allowlist_regiones.py'. `None not in ALLOWED_REGIONS` is True with no error, so the order is not observable here; E3 makes it observable. E-a evidence line with a code column. The program counts toward 42/41.

### S03-T3-A-E2 (s03:1664-1722)

**Change.** - Solution: FIVE blocks — monto = None / -1 / 0 / 50000 / 50001 — with the chain None → review MISSING; <0 → reject OUT_OF_RANGE; >50000 → review NEEDS_REVIEW; else accept OK, printing a code column (convention (b)). 50000/50001 are the inclusive boundary Límites claims and the youDo pins; 1200 and 60000 become named predictions.
- WHY FIVE AND NOT SEVEN: the plan's seven blocks meant six hand-copies of a nine-line chain (~54 transcribed lines) for a repair that is one character (`elif monto <= 0` → `< 0`). Five blocks cover every branch and both sides of the claimed boundary; the rest are predictions run by editing one line.
- Starter (R5): one block at 0 with `elif monto <= 0` (0 → reject). First instruction step is repair-then-copy.
- m → monto in instruction, feedback and the retrospective's `m >= 0`. Instruction step 3: blocks, not «la lista».

**Preserves.** Strict violation (negative → reject) vs policy threshold (> 50000 → review), zero valid, and absence before comparison. Reversing the order raises an observable TypeError.

**Constraints.** Retrospective 53 words, 'Compara'/'¿'. No 'outlier' or 'valor atípico' (CONCEPT_QUEUE group 44), and none of the banned requirement-kind aliases. FILE NAME 'rango_monto.py'. The output changes (5 lines with a code column); no adversarial test pins it. The program counts toward 42/41.

### S03-T3-A-E3 (s03:1723-1781)

**Change.** - D2 re-domain onto opaque internal ids (verified): ALLOWED_ID = {"CLI", "PED"}, LARGO_CLI = 4, LARGO_PED = 6.
- Blocks `tipo, numero = (...)`: ("CLI", "0001") → accept OK; ("CLI", "01") → reject OUT_OF_RANGE; ("TMP", "123456") → reject NOT_IN_ALLOWLIST; (None, "1") → review MISSING; NEW ("PED", "000123") → accept OK. The PED row is required by R3: verified, deleting the PED length row leaves the other four blocks identical while a valid PED silently becomes reject OUT_OF_RANGE.
- Fail-closed chain (R6(1) variant) with tuple rows: None → MISSING; not in ALLOWED_ID → NOT_IN_ALLOWLIST; tipo == "CLI" and len == LARGO_CLI → OK; tipo == "PED" and len == LARGO_PED → OK; else reject OUT_OF_RANGE.
- The DOC_LEN dict, str() and the for loop go.
- Starter (R5): one block, ("CLI", "01"), with the generic accept/reject defect and no code. First instruction step is repair-then-copy.
- Rewrite preamble Contexto/Éxito (today DNI/CE/PAS), INSTRUCTION, hint/hints (pointing to the len gloss in theory T4-A) and the telegraphic feedback. The instruction must not name a dict, `.get` or a loop.
- Add one clause saying the id-type catalog is closed (unknown → reject), unlike the region catalog (review), citing s03:336.

**Preserves.** Permitted list plus per-type length, distinct codes per cause, and guard order: without the None guard, (None, '1') silently becomes NOT_IN_ALLOWLIST. Fail-closed rows and the enforced pairing are new expert-level points.

**Constraints.** Retrospective 48 words, '¿' (floor 45). tests 'codes MISSING/OUT_OF_RANGE/NOT_IN_ALLOWLIST/OK' and edgeCases 'tipo ok longitud mal' stay true. FILE NAME changes from 'tipo_doc_longitud.py' to an id-based name. D2 is binding: no DNI- or RUC-shaped values. The program counts toward 42/41.

### S03-T3-B-E1 (s03:1783-1839)

**Change.** - A comment table at the top (OK → accept, MISSING → review, OUT_OF_RANGE → reject, any other → review) replaces TABLE.
- Solution: blocks code = OK / MISSING / OUT_OF_RANGE / FOO with an if/elif chain whose else is the default row. Pinned output byte-identical.
- Starter (R5): one block at MISSING holding both DEFECT rows (MISSING → reject, OUT_OF_RANGE → review), printed with the arrow. First instruction step is repair-then-copy, and the instruction must require a row-by-row audit against the comment table before copying, because the OUT_OF_RANGE row's defect does not show in the MISSING block.
- REWRITE THE PREAMBLE, INSTRUCTION AND FEEDBACK, which the plan left stale: s03:1788 «corregir el diccionario `TABLE` y aplicar `get`», s03:1791 «Implementa `status_for(code)` con `TABLE.get(code, "review")`» and s03:1800 «El default (`get(..., "review")`)» all name a dict, a dict method and a function the rebuilt code does not contain. They become the comment table and the else row.
- After the fix, the missing-else experiment: delete the else and predict FOO. It prints the previous block's 'reject' (verified).
- hints[0]: `table.get` → the else row. Feedback: remove «sin hardcodear ifs extra».
- tests: 3 business rows plus the default.
- HEADING → Spanish (drop «Decision table»); FILE NAME stays decision_table.py.

**Preserves.** The table as an independent specification, a row-by-row audit, and an explicit default for unknown codes. The objective shifts from dict lookup (S06) to code faithful to a table.

**Constraints.** Retrospective 53 words, '¿': 'Lee `TABLE`' becomes the comment table, and the bridge to E2 stays. edgeCases 'fila default', plus one for a half-edited copy. The program counts toward 42/41.

### S03-T3-B-E2 (s03:1840-1898)

**Change.** - Align NOT_IN_ALLOWLIST to review (`case "MISSING" | "NEEDS_REVIEW" | "NOT_IN_ALLOWLIST"`), matching the theory table (s03:374) and the demo, since the heading says «Misma tabla». Today it maps to reject (s03:1885).
- Solution: blocks code = OK / MISSING / OUT_OF_RANGE / FOO / NEEDS_REVIEW, plus BAD_TYPE per R3. OUT_OF_RANGE is the first alternative of the reject arm, so only BAD_TYPE detects a dropped `| "BAD_TYPE"`. The output gains one line, 'BAD_TYPE → reject'.
- Starter (R5): one block showing the `case _: accept` defect (FOO → accept). First instruction step is repair-then-copy.
- Instruction step 3: blocks, not «Recorre el bucle».
- Drop the def and the annotations.

**Preserves.** match with literal and OR patterns, and a wildcard whose value is a safety policy rather than filler.

**Constraints.** Retrospective 54 words, '¿'. FILE NAME 'match_codigos.py'. Needs 3.10+. R3 DECLINED for the review arms (NEEDS_REVIEW and NOT_IN_ALLOWLIST equal the review default), stated in the constraints and claimed nowhere in learner prose. Keep today's five lines unchanged in order. The program counts toward 42/41.

### S03-T3-B-E3 (s03:1899-1964)

**Change.** - Code blocks OK / MISSING / OUT_OF_RANGE / NEW FOO with `match code:` assigning status. FOO is required by R3 and by Q6's «y hay `case _`»: verified, deleting `case _` leaves OK/MISSING/OUT_OF_RANGE identical while FOO leaks R2's stale value ('FOO → PREVIOUS'). OUT_OF_RANGE is added because the Éxito line (s03:1904) already promises it.
- Edad blocks None / 30 / 10 with `if edad is None → review / elif 18 <= edad <= 65 → accept / else reject`.
- Then today's Justificación print, unchanged.
- Starter (R5): one code block with the `status = "accept"` defect and one edad block at None with today's `isinstance(edad, int) and 18 <= edad <= 65` / else-accept defect (no TypeError). First instruction step is repair-then-copy.
- REWRITE THE INSTRUCTION (s03:1907) «Implementa `map_code` … Implementa `map_edad`», which the plan left naming two functions the rebuilt code does not contain; it becomes the two block groups.
- hints[1]: «módulo» → program, and add the missing verb. Feedback: «map_edad(None)» → the None block. Preamble Éxito: no function names.

**Preserves.** A defended design choice: match for finite codes, if for a continuous range, and the absence guard. The strict 18–65 rule is the deliberate setup for T4-A-E3's refutation.

**Constraints.** Retrospective 51 words, 'Defiende'/'pregunta'. FILE NAME 'if_vs_match_elegir.py'. The output becomes 8 lines (OK, MISSING, OUT_OF_RANGE, FOO, None, 30, 10, Justificación); no test pins the old lines. The program counts toward 42/41.

### S03-T4-A-E1 (s03:1966-2031)

**Change.** - Solution: SIX blocks `edad, esperado = (...)`: (30,"accept"), (-1,"reject"), (121,"reject"), (None,"review"), ("x","reject"), (True,"reject"). The chain is None → review; `not isinstance(edad, int) or isinstance(edad, bool)` → reject; `edad < 0 or edad > 120` → reject; else accept. print(repr(edad), status, `ok=`, status == esperado) — E-b, so the comparison carries a label like every other comparison item.
- WHY 121 AND True: R3 now binds `or` arms. Verified, the four-case outline stays green with `or edad > 120` deleted (500 → OK) and with the bool exclusion deleted.
- Starter (R5): only the "x" block, without the type branch, which raises TypeError at `edad < 0` (the item's named error). First instruction step is repair-then-copy.
- e → edad. Éxito extends to six rows.
- REWRITE THE INSTRUCTION (s03:1974), which the plan never touched: «2. Define `examples` como lista de dicts `{value, expected}`. 3. Recorre examples» names a list of dicts and a loop the rebuilt code does not contain. It becomes the six case blocks with their esperado. REWRITE tests (s03:1981) «4 examples present» → six blocks.
- hint/hints[0]: six case lines. hints[1] and edgeCases: «campo ausente», not «missing key». Feedback: replace «llena cuatro dicts».

**Preserves.** The type check placed between None and range (placing it after range still crashes), one example per decision state, and each esperado written from the invariant — now including both OR alternatives.

**Constraints.** Retrospective 53 words, 'Relaciona'; keep word for word. The DEFECT marker stays. Declared output grows to six lines. The program counts toward 42/41.

### S03-T4-A-E2 (s03:2032-2097)

**Change.** - Print a single invariant string literal first. R8's ONE exception applies: measured at 106 columns, and the only stated escape hatch (wrapping a tuple) does not apply to a string literal, so the exception is named in the convention rather than leaving the item unable to satisfy both rules. The implicit adjacent-literal concatenation goes.
- Blocks `apellido_paterno, apellido_materno, esperado = (...)`: ("Quispe", "Ñahui", "accept"), ("Quispe", None, "review"), ("  ", "", "reject").
- KEEP A TEXT-TYPE GUARD: `<campo>_vacio = not isinstance(<campo>, str) or <campo>.strip() == ""` (wrapped in parentheses per R8). Then both empty → reject, elif either → review, else accept. Print repr of both names, →, status, `ok=`, status == esperado (E-b).
- WHY: the plan's «drop isinstance» path sent the learner into AttributeError, a class the course never names (grep S01/S02/S03 = 0, while TypeError/ValueError/NameError/AssertionError all have S02 precedents). Verified on 3.12, the guarded form gives vacio = False/True/True/True/True for "Quispe"/None/"  "/""/5, with no AttributeError. A non-text value counts as no evidence; record that as debt in the invariant.
- The swap experiment therefore states only the `or`-first consequence (reject becomes dead), not an AttributeError.
- Starter (R5): one block ("Ramos", "") with the `if not ... or not ...: reject / else accept` defect. First instruction step is repair-then-copy.
- REWRITE THE INSTRUCTION (s03:2040) «1. Reescribe `validate_apellidos` … 3. … compruébalos en un bucle» and tests (s03:2047) «text + examples ejecutables»: no function name, no loop, no `examples`. Replace «`validate_record` del You Do combina campos» (s03:2037) and the retrospective's clause with the youDo's record status.

**Preserves.** The evidence-count policy with three outcomes, strip-based emptiness, None as empty, a Spanish invariant and three checked examples. Branch order stays load-bearing (or-first makes reject dead, verified).

**Constraints.** test_newbie_packet pins: preamble keeps '\n- **Meta:**', accept, review, reject and 'vacíos'; edgeCases == ['uno vacío'] exactly; instruction contains '\n2. Escribe' and not 'falta).n2.'. Retrospective 50 words, 'explica'/'¿'/'Compara'. Every code line ≤88 except the one invariant literal. The program counts toward 42/41.

### S03-T4-A-E3 (s03:2098-2167)

**Change.** - Blocks edad = 15 / None / 30 / NEW 121 / NEW 70. Each runs the strict chain assigning status_strict and the fixed chain assigning status_fixed (None → review; not int or bool → reject; <0 or >120 → reject; <18 → review; <=65 → accept; else review), printing both on one line (E-b). The existing invariant print comes last.
- WHY 121 AND 70: verified, 15/None/30 reach only F1, F4 and F5 of the fixed chain's six branches; deleting the range branch leaves all three identical while -3 silently becomes review, and Límites/hints[1] claim «fuera de 0–120 sí corresponde `reject`». 70 answers the retrospective's own 66–120 prompt.
- Starter (R5 exception: the counterexamples are the given evidence): the 15 and None blocks with the strict chain only, marked DEFECT.
- Preamble: «proponer `validate_edad_fixed`» → a second chain named status_fixed. REWRITE THE INSTRUCTION (s03:2106) «2. Implementa fixed con guards…», which names `fixed` as a callable and uses the English «guards»; it becomes the second chain and «ramas de guarda». Feedback: «fixed(15)» → «fixed para 15».

**Preserves.** The old rule is refuted on concrete values, the promise is revised before the code, and a five-branch ordered chain states the new invariant. The 30 row proves the happy path is still accepted; 121 and 70 make the revised invariant's own boundaries checkable.

**Constraints.** Retrospective 61 words, 'Explica'/'¿'. Side-by-side format (the grouped alternative would put the starter's 'strict' lines inside the solution output and break R5). R3 DECLINED for the type branch: "x" and True are named predictions, stated as documentation rows. ~+2 blocks over the outline. The program counts toward 42/41.

### S03-T4-B-E1 (s03:2169-2217)

**Change.** - Three named messages (mensaje_ausente, mensaje_tipo, mensaje_rango), each printed. The starter holds the vague messages reordered under the matching situation. Output identical to the pin (verified).
- Optional: f-strings from synthetic values ({edad_tipo!r}, type(...).__name__).
- This item is one of the two closest things S03 has to communication_audience_tuned practice: its message-writing work may not get thinner this round.

**Preserves.** The writing work (field + problem + action). The E-RANGE-07 string stays as a stable-but-not-actionable example.

**Constraints.** Retrospective 46 words — one of the two THINNEST against the 45-word floor (with T1-A-E2): replace words, never delete; keep '¿'. The Límites «no inventes DNI ni teléfonos reales» is D2-consistent and stays. The program counts toward 42/41.

### S03-T4-B-E2 (s03:2218-2283)

**Change.** - UMBRAL_ACCEPT = 80 and UMBRAL_REVIEW = 50, defined once.
- Solution: blocks `score, esperado = (...)` for 90 / 55 / 10 / 80 / 50, each running the chain, then assert status == esperado, then print('PASS', score, status) (E-c). Output identical to the pin. The assert message tuple goes (S02 teaches only `assert comparison`).
- Starter (R5 exception): display blocks 90 / 60 / 10 with no esperado and no assert. The learner adds each block's esperado and assert, plus the 80 and 50 blocks.
- Remove the def, annotations, hints[1]'s literal `for` (s03:2230), the English 'for' in tests, «Arma cases = [...]» and «no borres la función».
- REWRITE THE META LINE (s03:2223) «armar `cases` con `expected` y un bucle que use `assert` … sobre `classify_score`», which the plan left naming a list, a loop and a function the rebuilt code does not contain.
- Retrospective: `_run_tests` → the case table.
- The one-test-per-copy trade-off is now STATED IN THEORY T4-B, where O8 is introduced; this item repeats it rather than being the only place it appears.

**Preserves.** Cases chosen by branch, both boundaries, esperado written before running, assert, PASS. UMBRAL_ACCEPT = 81 turns only the 80 block red; UMBRAL_REVIEW = 51 only the 50 block (verified).

**Constraints.** Stated trade-off, verified: a `>`-for-`>=` edit in one copy stays green, because the suite checks five copies. Constants mitigate threshold mutations. Retrospective 50 words, 'explica'. R6(2) banding shape. The program counts toward 42/41.

### S03-T4-B-E3 (s03:2284-2347)

**Change.** - Solution: FIVE blocks `edad, esperado = (...)`: (18,"accept"), (17,"review"), (None,"review"), (30,"accept") and NEW (121,"reject"). Chain: None → review; 18 <= edad <= 65 → accept; `edad < 0 or edad > 120` → reject; else review. Then assert and print('PASS', edad, status).
- WHY 121: verified, with the four planned blocks no case reaches the reject branch — deleting it or widening it leaves the suite green — in the very item that teaches O8 next to «El else/default también cuenta». 121 also exercises the non-first alternative of the range OR. The declared output gains 'PASS 121 reject'; update Éxito, tests and the instruction's «cuatro PASS». 66 stays a named prediction for the inclusive 65 boundary. D14: worth rises, the objective is unchanged.
- Starter (R5): one (18, "accept") block with `edad > 18` marked DEFECT and the assert active. It raises AssertionError (a real red).
- e → edad in the instruction, feedback and retrospective literals. Feedback: «mantén guards de None» → the Spanish term.
- Remove the meta comment. «no borres `cases`» → do not delete any case block.
- Retrospective: `_run_tests`/README → the case table.

**Preserves.** The full red → fix → green cycle on an inclusive boundary, and the ban on editing the expected value. The fix-once starter removes the verified false green (fixing only the 18 copy left three `> 18` copies passing).

**Constraints.** Retrospective 52 words, 'Narra'. The defect stays an operator defect (> vs >=), matching theory T4-B. The program counts toward 42/41.

### S03-youDo.title+context (s03:2351-2353)

**Change.** - Heading: drop «(incremento CP-N1-A)» — the LABEL only.
- KEEP AN INCREMENT SENTENCE in the context, following S02 exactly (s02:2155 «En este incremento del mismo proyecto trabajarás…»). S02's precedent is dropping the CP-N1-A label, not dropping the increment framing; after the plan as written S03 would be the only S01-S04 section that does not present itself as a step of the project, while S01 still promises the span (s01:70, 1907, 2336, 2399) and S04 still builds on «las reglas de S03» (s04:1800). De-listing S03 from the project is ask-first (AGENTS.md: moving a project).
- Keep the four-pass frame and both pins. The passes become: (1) write each field's invariant in the opening comment and the README; (2) repair the edad funnel, where every branch sets edad_status, edad_code and edad_message; (3) repair region and monto_ingreso, then compose registro_status with the precedence reject > review > accept; (4) run the case table one named case at a time by changing the selector line, predicting PASS, a failing assert, or TypeError before each run, add your own rows, AND promote at least two rows into case blocks in the file so one run asserts more than one case.
- Add the selector's reason and the D14 trade-off in the learner's own text: the selector exists because three funnels times nine rows would not fit, and S04's repetition restores the whole-table run. Say it without the word `for`.
- Add ONE HANDOFF SENTENCE naming what S03 hands the project in S03's vocabulary: the case table and the three names per field are what S04 will iterate and what S06 will pack into one value. This is the same bridge S03 receives from S02 at theory[0] p2.
- «Parte del parser de S02» → the valor column of S02's walk. No `{status, code, message}` braces and no validate_record.

**Preserves.** The four-pass structure, the defects-not-blanks stance, predict-before-running, ≥3 fields, None vs a valid falsy zero, synthetic data only, and S03's visible place in the S01 → S02 → S03 → S04 chain.

**Constraints.** Pins: 'construye el motor en cuatro pasadas', 'predice qué asserts fallarán'. No 'NotImplementedError'. Only the CP-N1-A label is removed this round; re-gating and de-listing are ask-first. The increment sentence must not name the capstone.

### S03-youDo.objectives (s03:2354-2360)

**Change.** - [1] Decide status, code and message per field and keep them in three names per field.
- [2] Name the valid zero: Decimal("0.00") if the owner picks Decimal (bool is False, verified), else 0.
- [3] Reword so the in-file case table — re-run per case, plus the two promoted blocks of pass 4 — satisfies «≥1 caso por rama crítica». Do NOT claim it is satisfied until every branch has a case: with the ninth case added (see starterCode) all 17 branches do.
- [4] «README o el comentario inicial del archivo», no docstrings.
- Optional sixth: compose a record status where reject outranks review and review outranks accept.

**Preserves.** The same five competencies plus explicit composition.

**Constraints.** Not pinned by tests. D14: do not claim a one-command regression. objectives are requirement-kind text: the banned-alias list applies («un caso por rama», never «cobertura de ramas»).

### S03-youDo.requirements (s03:2361-2369)

**Change.** - [0] Keep, and add the names <campo>_status/_code/_message plus registro_status.
- [1] Keep the six codes verbatim.
- [2] Every branch assigns all three names of its field (a missing one stops with NameError, S02); a wrong type ends in BAD_TYPE without raising TypeError. Write it as «un tipo incorrecto», never «un tipo de dato incorrecto» — 'tipo de dato' is a glossary alias first defined at collections.S06-T1-B.p0, and in a requirement field it becomes a DEFINITION_AFTER_REQUIREMENT issue located in decisions-rules, one per S03 badge.
- [3] Drop «o en data/» (synthetic cases embedded in the file).
- [4] Keep: every run executes the selected case's asserts.
- [5] Keep.
- [6] A flat if/elif funnel in absence → type → range → accept order instead of nested ifs; «rama de guarda» is the term.
- [7] The case table covers absence, wrong type, valid zero, both boundaries, negative, unknown AND a non-text region. The learner adds two rows of their own, edad 120 and edad True, each designed to turn red under a named defective change. Both survive the 8 shipped rows (verified).

**Preserves.** Every constraint of the old engine: stable codes, no TypeError, no pyramid, assert ≠ business validation. Adds case design driven by named defective changes.

**Constraints.** Requirement-kind fields: the banned-alias list applies («valor faltante»/«valores nulos» → «ausente/None»; «cobertura de ramas» → «un caso por rama»). requirements[0] stays a string on its own merits — DROP the citation of test_curriculum_agent_firewall.py:29, which builds the packet for section 2 (build_packet(2)) and therefore mutates S02's requirements[0], not S03's. The six codes must appear in the youDo.

### S03-youDo.starterCode (s03:2370-2506)

**Change.** - Rebuild whole as top-level statements: an opening comment carrying a WRITTEN RECORD SCHEMA (this is route 2's own recommendation — «give each increment a written record schema instead of changing it silently at every step») with, per field, its type, its absent form (None) and its source: edad from S02's `edad`, monto_ingreso from S02's `monto` (the rename is L1Q3-7 reserved: ask_first), region introduced in S03; plus what S04 receives. Say «incremento de S03» in the header comment, as S02 does at s02:2174, without naming the capstone. Then `from decimal import Decimal`; constants ALLOWED_REGIONS, EDAD_MAXIMA = 120, EDAD_ADULTA = 18, MONTO_REVISION and STATUS_VALIDOS = {"accept", "reject", "review"}.
- NINE named case tuples, each FLAT (no tuple inside a tuple) and unpacked in ONE S02-style line wrapped in parentheses per R8: label, edad, region, monto_ingreso, esperado_edad, esperado_region, esperado_monto, esperado_registro, each expectation a '<status> <code>' string. S02 shows only a flat tuple unpacked in one step (s02:176-186), and nothing in S03 nests one tuple in another.
  CASO_S02 (fixed to S02's pinned handoff: edad 28, monto Decimal("150.50"), region new in S03), CASO_CERO_VALIDO, CASO_AUSENCIA, CASO_DESCONOCIDA, CASO_MENOR_NEGATIVO, CASO_SIN_CONVERTIR ("25", None, "100"), CASO_FRONTERA_DENTRO (18, "Piura", 50000), CASO_FRONTERA_FUERA (121, "Cusco", 50000.01 or 50001), and NEW CASO_REGION_TIPO (30, 51, 100) → accept OK / reject BAD_TYPE / accept OK / reject. Verified: with the 8 planned cases and both learner rows, `region:BAD_TYPE` is never reached and the whole branch can be deleted with every case still green, while region 5 without it gives review NOT_IN_ALLOWLIST and region ['Lima'] raises TypeError.
- SHIPPED SELECTOR IS `caso = CASO_CERO_VALIDO`, not CASO_S02. Verified: today's starter fails on its first run, on the valid-zero assert that carries the section's thesis; the plan's CASO_S02 selector makes the shipped starter print PASS with all five planted defects in place, against s03:2352 «El starter contiene defectos deliberados… predice qué asserts fallarán». Put the rotation order (CERO → AUSENCIA → DESCONOCIDA → REGION_TIPO → MENOR_NEGATIVO → SIN_CONVERTIR → FRONTERA_FUERA → FRONTERA_DENTRO → S02) in context pass 4, so the two passing cases are the last runs.
- Three funnels with tuple rows plus a message line: edad as in theory T2-B; region None → MISSING, not str → BAD_TYPE, not in ALLOWED_REGIONS → review NOT_IN_ALLOWLIST, else OK; monto None → MISSING, wrong type → BAD_TYPE, <0 → OUT_OF_RANGE, >MONTO_REVISION → review NEEDS_REVIEW, else OK.
- registro_status from `"reject" in estados` / `"review" in estados` / else. DECIDED, not left to a gate that cannot see it: `in` over a tuple stays, and its in-section exemplar is T3-B-DEMO's s03:750 `elif code in ("MISSING", "NEEDS_REVIEW"):`, which is therefore kept ON PURPOSE. No instrument models `in` (no concept-map key, not in concept_syntax.mts's SYNTAX list, no glossary entry), so the gate-conditional fallback wording is dropped.
- Decision strings, evidence prints, asserts (statuses in STATUS_VALIDOS, messages non-empty, each decision == its expectation, registro == esperado_registro), then print('PASS', nombre_caso).
- Starter DEFECTs: today's four (truthiness None/0; no type guard; under-18 → reject; unknown/None region → reject) plus review-before-reject precedence. Keep the DEFECT markers; the region DEFECT must make CASO_REGION_TIPO's assert fail.
- Wrap every line to ≤88 columns: the verified draft has 13 lines over 88.

**Preserves.** 3 fields, 6 codes, the 7 original cases plus the S02 continuity case plus the region-type case, and defect-repair pedagogy; 17 branches, every one with a case. Prediction key verified per case: CERO monto assert; AUSENCIA edad; DESCONOCIDA region; REGION_TIPO region; MENOR_NEGATIVO edad; SIN_CONVERTIR TypeError at `edad < EDAD_ADULTA`; FRONTERA_FUERA registro; FRONTERA_DENTRO PASS; S02 PASS.

**Constraints.** Stated trade-offs: the one-command regression over all rows is lost (pass 4's two promoted blocks partly restore it), reuse needs S05, one result object needs S06. No def, return, for, .get(, all(, set() or dict literal; set literals only. The monto type follows the ask-first, which now has a third option that keeps both the S02 and S04 edges. The youDo starter is a plain string, not a counted program, but the starter-visibility test now covers it.

### S03-youDo.portfolioNote (s03:2507-2508)

**Change.** - «no una lista de funciones» → «not a line-by-line tour of the code».
- Tie the before/after evidence to a named case and its passing asserts (the valid-zero case no longer ends in reject).
- The matrix rows map one-to-one onto the case table. Optionally tell the reject-over-review precedence as a second decision.
- `if monto:` → `if monto_ingreso:`.
- Replace «Así la revisión de CP-N1-A puede…» with a CONCRETE NAMED READER at the S04 gate (the person who will run the S04 close), not «a neutral reviewer». This is one of only three S03 surfaces close to communication_audience_tuned, and it may not get vaguer.

**Preserves.** The narrative artifact, the evidence standard and the matrix.

**Constraints.** Pin 'cuenta la historia de una decisión'. 114 words today; no floor. The capstone id is not named; the reader is.

### S03-youDo.rubric (s03:2509-2516)

**Change.** - Reword «Pruebas/ejemplos por rama» (15%) so the case table, re-run per case, plus the two learner-designed rows and pass 4's two promoted blocks satisfy it. Write it as «un caso por rama», never «cobertura de ramas» (a `coverage` alias first defined at rpa-advanced.S24-T4-A-E3.preamble; in a rubric it is a requirement and becomes a DEFINITION_AFTER_REQUIREMENT issue in decisions-rules).
- Optionally widen criterion 1 to the record status.
- «guards» in criterion 5 → «ramas de guarda».

**Preserves.** Six criteria and weights summing to 100%.

**Constraints.** Not pinned. Weights stay 25/25/20/15/10/5. Rubric is requirement-kind text: the banned-alias list applies. Do not claim the 15% criterion is met until every branch has a case (it is, with CASO_REGION_TIPO).

### S03-youDo.retrospective (s03:2517-2518)

**Change.** - Author voice: the absence case and the valid-zero case, whose asserts separate None from zero.
- Reviewer voice may name verified answers: `<` → `<=` at the adult boundary turns FRONTERA_DENTRO red; swapped precedence turns MENOR_NEGATIVO and FRONTERA_FUERA red; deleting the region type branch turns CASO_REGION_TIPO red.
- Keep the closing failure conditions, including «un tipo incorrecto lanza TypeError» — which CASO_REGION_TIPO now makes demonstrable for region, where the planned 8 cases could not.
- Operations voice keeps a concrete reader (communication_audience_tuned).

**Preserves.** The three-voice defence and the real-data reflection, now anchored to cases the learner ran.

**Constraints.** Pins 'Haz una revisión en tres voces', 'Como **autor**', 'Como **operaciones**', 'Como **revisor**'. 119 words.

### S03-selfCheck.Q1 (s03:2522-2528)

**Change.** (none)

**Preserves.** is None for absence.

**Constraints.** correctIndex 2; explanation 32 words (floor 22).

### S03-selfCheck.Q2 (s03:2529-2536)

**Change.** Remove the length cue (correct option 71 characters vs 22–33) by padding the distractors, each briefed by the misconception it encodes, not by a character target. WHEN options[1] IS PADDED, UPDATE THE QUOTED TEXT IN THE EXPLANATION: s03:2535 quotes options[1] word for word («Ambos `reject` porque son falsy»), so padding leaves the explanation quoting an option that no longer exists.

**Preserves.** Same concept and answer position.

**Constraints.** correctIndex 0. Pin 'describe el comportamiento de `bool`, no la política' (it follows the quote and is unaffected). Explanation ≥22 words (31 today).

### S03-selfCheck.Q3 (s03:2537-2543)

**Change.** (none)

**Preserves.** First true condition wins.

**Constraints.** correctIndex 1. Pin 'Python no busca la opción “más específica”'.

### S03-selfCheck.Q4 (s03:2544-2550)

**Change.** No change to Q4 itself. Its exam twin :706 («¿Qué imprime la expresión `"" or "default"`…», same correct answer) moves to a different operand pair while it is rescoped, so the self-check does not publish the key to one of that concept's three exam variants.

**Preserves.** `"" or "default"` → 'default' (verified).

**Constraints.** correctIndex 3; explanation 35 words. «devuelve» here is S03's operand sense, not a leak. The twin pair is listed in assessments so later rounds keep them apart.

### S03-selfCheck.Q5 (s03:2551-2557)

**Change.** D2 and one domain: option 4 `assert tipo == "DNI"` → an opaque code (CLI) AND the STEM's «allowlist de tipos de documento» is re-domained to the same opaque id catalog as T1-A-E2 and T3-A-E3. After the round no S03 code has a document-type catalog, so a stem about one would name a catalog the section no longer has. Use «lista de permitidos» as the head-word.

**Preserves.** Permitted list = set of literals + in.

**Constraints.** correctIndex 2; explanation 35 words. Stem is requirement-kind text (selfcheck.question): banned-alias list applies.

### S03-selfCheck.Q6 (s03:2558-2564)

**Change.** Distractor options[3]: «devuelve» → produce. Optionally trim the correct option (67 vs 52–63 characters).

**Preserves.** match for finite codes vs if for ranges.

**Constraints.** correctIndex 0; explanation 34 words. Q6 teaches «y hay `case _`», which T3-B-E3's new FOO block now exercises.

### S03-selfCheck.Q7 (s03:2565-2572)

**Change.** - REWRITE THE STEM. It is NOT already a flat funnel: it sets `if valor is None` against a second, separate `if valor < 18`, and the keyed rationale («la ausencia se resuelve primero») is true only when the first `if` returns. Verified on 3.12: with two separate `if`s and valor = None the code still prints "TypeError: '<' not supported between instances of 'NoneType' and 'int'"; with `elif valor < 18` it prints 'review'. After this round S03 has no early return, and theory[6] explicitly teaches that consecutive `if`s both run, so a learner who absorbed the section is penalised by the current key. The stem becomes one chain: the absence branch first, the comparison as its `elif`.
- Optionally add to the explanation that a separate `if` would still reach `None < 18`.
- Remove the length cue (75 vs 48–52 characters) by padding the distractors with stated misconceptions (e.g. the «más rápido de comparar» speed model written as a full wrong rule), never by cutting the correct option.
- This is O4's only self-check item; the rewritten stem is the O4 point in the rebuilt form.

**Preserves.** Guard order and the TypeError reason, now true of the code the stem shows.

**Constraints.** correctIndex 1. The pin 'comparar None con < lanza TypeError' lives in the correct OPTION, not the stem, and is untouched. Its exam twin :792/:794 is rescoped the same way (assessments).

### S03-selfCheck.Q8 (s03:2573-2580)

**Change.** - CORRECT THE BRIEF: the explanation dismisses «Error», «inválido» and «bad», and «inválido» DOES appear — options[1] reads 'El campo edad no es válido; corrígelo y vuelve a enviar.' Only «Error» and «bad» are absent. Keep «inválido» and bind it to options[1].
- Brief the explanation as ONE teaching sentence plus ONE contrast — what the correct option adds that the other three all lack (the value and the boundary) — not as a three-limb audit that repeats «has no value or range» twice (G2 restatement).
- Its exam twin :950 moves to a different field and value while it is rescoped.

**Preserves.** Actionable messages (field, value, boundary, fix).

**Constraints.** correctIndex 3. Pins 'mensajes de validación es accionable' (stem) and 'obligan a adivinar la causa' (explanation, kept as the closing clause). ≥22 words.

### S03-selfCheck.balance (s03:2520-2582)

**Change.** Add the OUTCOME → SELF-CHECK map to the assessments section and close the two gaps it exposes: O2 has three items (Q1, Q2, Q4) while O4's dead-branch clause and O8's branch-test clause have none, and O5 is assessed by an allowlist-alone item. Re-target ONE of the three O2 items to O4's unreachable-branch clause or O8's branch-test clause, keeping its correctIndex, the 2/2/2/2 balance and all pins; or state the gap explicitly as a trade-off covered only by the bank (guard-clauses :806, actionable-messages :964).

**Preserves.** 8 questions; positions [2,0,1,3,2,0,1,3].

**Constraints.** Counter {0:2, 1:2, 2:2, 3:2}. Exactly 8 single-quoted explanations of ≥22 words. badge_readiness_audit.py:59-60 maps `selfcheck.` events to the EXAM activity, so this is what counts as S03's assessment for the badges. The optional de-periodising reorder is not taken by default.

### resources (s03:2583-2649)

**Change.** - 'unittest — TestCase' note: «Cubrir ramas accept/reject/review» points to a class-based framework (classes are S11). Re-note it as a later reference; in S03 each branch is covered by case blocks with assert.
- 'Python Crash Course' note: «Capítulos de if y diccionarios como base» → the chapters on if; dicts arrive in S06.

**Preserves.** Every resource and link.

**Constraints.** No code; no pins. Notes are learner-visible: the stale-name and banned-alias lists apply.

### satellite: SectionView.tsx 'decisions-rules' playground (:1070-1101)

**Change.** - Rebuild top-level with TWO case blocks, not three: `monto, region = (0, "Lima")` and `(-5, "Tacna")`. Each runs the monto funnel (monto_status, monto_code tuple rows) and the region chain (region_status, region_code), then prints the case, both statuses and both codes. The MISSING row becomes the hint's prediction, run by editing one opening line.
- WHY TWO: the planned three-block version is 62 lines against today's 28, and 42 of its 50 non-blank lines are the two rule chains, of which only 13 lines are unique text (measured; the planned version runs and matches its claimed output). Two blocks still show accept OK, reject OUT_OF_RANGE and review NOT_IN_ALLOWLIST.
- REWRITE THE HINT. Keeping today's hint is wrong once the rule lives in two copies: it must say that changing a rule means changing it in every block, and that a divergent copy is the first thing to check when two cases disagree. This is the one surface where the learner edits a rule.
- Update expectedOutput. Remove def validate_monto, def validate_region, the list of dicts and the for loop.

**Preserves.** The three original outcomes stay reachable (two shipped, MISSING as the prediction), same heading and same prediction prompt.

**Constraints.** Keep the key "    'decisions-rules': {" (test_s02_independent_contract delimiter) and 'Practica decisiones y reglas'. Must not contain 'Promedio de notas'. Must run with check=True and match expectedOutput. The pin rescope goes in its own commit. The monto type guard follows the Decimal/int ask-first.

### satellite: figure S03-guard-order (figures/data/misc.ts:446, caption/alt at s03:70-71)

**Change.** - MOVE IT to theory[7] (T2-B), resolving the plan's open question rather than shipping the adjacency. Today it sits in T1-A, whose code (s03:92-101) has no `if` at all, and its caption is the first place the learner meets «guarda» — 217 lines before the term is defined at s03:286. SectionView.tsx:426-430 renders a figure between the block's paragraphs and its code, so it claims spatial contiguity with prose that never mentions guards. T2-B.p2 (s03:287) IS its content («Orden típico en validadores: 1) ausencia → 2) tipo → 3) rango/allowlist → 4) accept») and T2-B has no figure.
- D5 COUNTS ARE UNCHANGED by the move: .fixer/events.json records `decisions-rules.S03-T1-A.figure` with "mentions": [], and concept_map.py:139-141 credits a figure to a concept only through its event's mentions. The plan's reason for leaving it («T1-A would lose its only figure») misread D5, whose target is per concept, not per subtopic (decisions.md:92-94).
- COPY THE ROWS FROM T2-B's FUNNEL: None → review MISSING; not int or bool → reject BAD_TYPE; <0 or >120 → reject OUT_OF_RANGE; <18 → review NEEDS_REVIEW; else accept OK. Put «status CODE» in `result` so the figure follows convention (b). The plan's earlier rows (absent → review, out of range → reject, not in list → review, rest → accept) match no chain in the section: verified on 3.12, those rows in that order give R-FUERA 15 → reject while T3-A gives review NOT_IN_ALLOWLIST, because T3-A checks the list first.
- DO NOT PRESERVE THE NOTE (misc.ts:456): «Mover la última guarda al principio cambia la clasificación de todos los registros, no de algunos» is false under today's data and under the fixed data. Verified over 9 record classes: last-guard-first changed 1 of 9 with the fixed rows, catch-all-first changed 8 of 9, today's data changed 4 of 9. Replace it with a claim the new rows make true and that running code can check: moving the `< 18` row first makes None stop with TypeError — the same experiment theory[7].p5 instructs.
- The note and the caption must say DIFFERENT things, or `note` is dropped: DecisionFigure.tsx:18/:124-125 draws `note` inside the SVG and Figure.tsx:108-110 prints the identical `caption` below it, so today the sentence renders twice.
- Its caption may name the excepción/TypeError only if the figure actually shows it.

**Preserves.** The headline (first matching guard wins), now beside the prose that teaches it and over the chain it draws.

**Constraints.** Learner-facing caption and alt are Spanish and use «rama de guarda». The figure is credited to no concept before or after, so no figure_count changes; record that in the after-round diff.

### satellite: figure S03-tri-state (src/components/course/figures/S03TriState.tsx:24-36, caption/alt at s03:237-241) — NEW ITEM

**Change.** - REDRAW IT FOR T2-A's OWN CHAIN. Today it draws a guard funnel over monto records while T2-A teaches a score banding chain: its doors run review / reject / accept against T2-A's accept (>=80) / review (>=50) / reject; its records are «monto ausente», -5 and 120 against T2-A's scores; and its last door is a question («¿valor permitido?» → accept) with no exit for 'no' — a chain without `else`, which R2 forbids and R6 contradicts. Verified on 3.12: running its three doors as top-level case blocks printed `120 -> accept` then `5000 -> accept`, the stale-status leak R2 exists to prevent.
- New doors: «¿score >= 80?» → accept, «¿score >= 50?» → review, then a final unconditional `else` exit → reject. Records on both sides of a boundary: 80, 79, 49, matching theory[6]'s two blocks and its predictions.
- NAME `if`/`elif`/`else` IN THE CAPTION OR ALT. The figure is credited to no concept today because credit flows only through caption/alt mentions; naming them moves the load-bearing `if` from 0/5 to 1/5 figures and from L2 to D3's L3. This is the section's only honest figure credit available this round.
- Update caption and alt at s03:237-241 to match.
- If the owner prefers the funnel drawing, move it to T1-B or T2-B, match that chain's rows and add an explicit `else` exit.

**Preserves.** The 'row of doors' mental model that T2-A.p4 teaches («Lee la cadena como una fila de puertas»), now drawing the chain the block actually runs.

**Constraints.** Component file, not a data entry: the change is in S03TriState.tsx plus the section's caption/alt. D4 constraints (reduced motion, code-fidelity gate) unchanged. Caption/alt are learner-facing Spanish.

### satellite: figures/data/flows.ts — S03-call-return comment (:53) AND figure data (:61-68)

**Change.** - COMMENT (:53): update «S03 illustrates seven of its nine theory blocks with a function, and its T2-B subtopic is built on the early return». After the rebuild only theory[3] uses def, and T2-B is a flat if/elif funnel.
- FIGURE DATA, not only the comment: (a) the `outcome` still defines a guard by the early return («Por eso una guarda puede devolver `review` en la primera línea…»), the definition theory[0].p3 and theory[7].p1 retire. Limit it to the function sense — inside a function, a first `if` that returns ends the body — so it no longer defines «guarda». (b) The single call drawn is R-NORTE, which returns on the LAST line of the body, so the boundary `boundaryAfter: 2` («lo que queda en el cuerpo ya no se ejecuta») marks nothing skipped. Traced with sys.settrace on 3.12: 'R-NORTE' executes body lines [1, 3, 5] of 1..5 (nothing skipped), while None executes [1, 2] and skips 3-5. Draw the None call instead: llamada con None → cuerpo region = None → return entrega review → quien llamó recibe review.
- Update the alt at s03:118-119 to the None path, keeping the caption's held terms «parámetro» and `return` so apply_patches' held-definition check passes.

**Preserves.** The rationale for the S03-call-return figure and its held terms. The figure finally shows what flows.ts:55-56 says is its only job — that the rest of the body never runs.

**Constraints.** The comment is not learner-facing; the caption, alt and outcome are. theory[3]'s code change (unknown → review) does not affect this figure, which draws the None path. Held-definition terms parámetro and return stay in the caption.

### satellite: prisma/seed.ts S03 exam bank (:644-990)

**Change.** See assessments. Rescope every item that presupposes def/return, a dict, validate_contacto, `except`, `KeyError` or CP-N1-A, plus the :749 invalid-Python stem, the :792 two-if stem, the :849 off-family item, the three self-check twins and the bank-wide length cue. Keep each correctIndex.

**Preserves.** 24 items, 8 concepts × 3.

**Constraints.** Delimiters '  // S03 V3' and '  // S04 V3' must not change. The bank is learner-visible text: the widened stale-name guard covers it.

