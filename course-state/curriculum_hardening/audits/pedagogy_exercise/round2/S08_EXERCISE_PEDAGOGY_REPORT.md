# S08 Exercise Pedagogy Report (Round 2)

## Section
- **title:** Archivos, CSV, JSON y contratos de ingesta
- **id:** `pandas` (index 8; archivo histórico `s08-pandas.ts` — contenido es pathlib/csv/json/hashlib/stdlib ETL, **no** pandas)
- **source:** `src/lib/course/sections/s08-pandas.ts`
- **counts:** iDo 8, weDo 24 (8 subtemas × E1/E2/E3), youDo 1
- **subtopics:** T1-A Path/UTF-8 · T1-B atomic/newlines · T2-A CSV dialect/cast · T2-B cuarentena · T3-A JSON/JSONL · T3-B schema/nulls · T4-A hash/backup · T4-B manifest/reconcile
- **gate:** CP-N1-B (clean + quarantine + manifest, fail-closed, solo datos sintéticos)
- **Round 1 context:** `round1/S08_EXERCISE_PEDAGOGY_REPORT.md` (no rubber-stamp)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (preamble/retrospective checklists, E1→E3 fade, length targets, anti-aberration)
- Manually re-inspected **current** source for every `iDo.steps[]`, `weDo.steps[]`, and `youDo` (title, preamble, instruction, feedback, retrospective, starter defect, solution output, why)
- Verified integrity traps by executing T4-B-E2 starter vs solution (return shape + compensated_bad aggregate) and cross-checking T1-B-E2 call-site (`FULL` vs `ok`)
- Compared against Round-1 gaps only to see what was filled; scores below are independent quality judgments for a **true newbie**
- No bulk generation; no source edits; word counts used only as length gates

## Scoring key
| Score | Meaning |
|-------|---------|
| **A** | Newbie can answer what / why / success / what sticks; no residual fix needed |
| **B** | Usable; minor residual (thin retro, length, polish) |
| **C** | Partial; residual should be fixed in R2 (clarity, thin metacognition, mild integrity) |
| **D** | Fails true-newbie test on a critical checklist item (success invisible, wrong vs right indistinguishable) |

Checklist: **context · goal · success · constraints · retrospective** → pass / partial / fail.

**Severity (Round 2):**
- **P0:** Field missing or prose unusable for a newbie. **None found.**
- **P1:** Usable frame, but success ambiguity / API mismatch / role collision that still confuses.
- **P2:** Polish (length bands, hint spoil, mild wording).

---

## Global findings (post Round-1 fix)

| Area | Status | Residual impact |
|------|--------|-----------------|
| **Field coverage** | Complete: every iDo has `preamble`+`why`+`retrospective`; every weDo has `title`+`preamble`+`instruction`+`feedback`+`retrospective`; youDo has defense `retrospective` + strong context | Round-1 P0 “zero fields” is **closed** |
| **We Do titles** | Present, 4–9 words, Spanish PE, role-aligned | Pass |
| **Preamble shape** | All weDo use bullets contexto/meta/éxito/límites (spec allows 4 short bullets) | Pass on structure |
| **Instruction = steps** | Task-only ordered steps; E1 names defect; E2/E3 mostly less spoon-fed | Pass with a few E1 “paste the one-liner” and one E2 fixture gap |
| **E1→E2→E3 fade** | Distinct surfaces (exists → with lines → UnicodeDecode; DictReader → writeheader → Decimal reject; schema → null → setdefault; sha256 → backup → provenance; manifest → compensated → fail-closed run) | Pass — not number-clones |
| **Feedback reasoning** | Mostly 28–45 words with misconception + gate reason | Generally distinct from retro (better than S04 clone pattern) |
| **Retrospective length** | Many land ~18–35 words (spec target 40–80); principle + bridge present, self-check often missing | P2 bulk |
| **Code/outputs** | Intact; `# DEFECT:` comments pedagogical; digests golden | One **learning-integrity** hole: T4-B-E2 (below); mild call-site friction T1-B-E2 |
| **youDo frame** | context + receta + éxito de corrida + requirements + rubric + retrospective defensa | Pass |

**Net:** Round 1 closed the systematic missing-text gap with high-fidelity application of the proposed prose. Round 2 residuals are **quality, thin closes, one starter/success API mismatch on the key compensate concept, and fixture underspec on that same unit** — not empty scaffolds.

---

## Unit ledger

### S08-T1-A-DEMO (iDo) — **A**
- **Diagnosis:** Preamble sequences what to watch (write_text UTF-8, exists, relectura, Windows locale). `why` anchors Path + portable encoding as first brick of the gate. Retrospective: principle (encoding is contract) + classic error (SO default) + We Do bridge. Output `(True, 'cliente;José\n')` is the observable success. No residual required for a newbie.
- **Checklist:** context pass · goal pass · success pass · constraints pass (demo only; no PII) · retrospective pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

---

### S08-T1-A-E1 (weDo, guided) — **A− / B+**
- **Diagnosis:** Title clear; preamble bullets with exact success `True`; instruction names the defect (exists without write); feedback repairs “Path ya crea el archivo”; starter `# DEFECT` pedagogical. Retrospective (~32w) has principle + bridge but thin on explicit misconception wording (feedback carries it).
- **Checklist:** all pass; retrospective partial on length only
- **Severity residual:** P2
- **Proposed retrospective (optional expand):**  
  Crear + verificar es el primer ladrillo de provenance: un `Path` no es un archivo. El error clásico es confiar en que el cwd o el IDE “ya dejaron” el intake. Siguiente (E2): escribir y releer con `with` sin dejar handles abiertos.
- **Code/output changes:** none

---

### S08-T1-A-E2 (weDo, independent) — **A**
- **Diagnosis:** Strong operational hook (handles as debt); success list exact; limits ban `write_text` to force `with`. Instruction steps independent enough. Feedback names `\n`/`strip` pitfall. Fade from E1 is real.
- **Checklist:** all pass
- **Severity residual:** P2 optional — step 1 says `open('w'…)` while solution uses `p.open`; both work; could say `with p.open(...)` to match pathlib habit of the section.
- **Proposed residual:** optional instruction step 1:  
  `1. En lines.txt, escribe a, b y c (una por línea) con with p.open('w', encoding='utf-8').`
- **Code/output changes:** none

---

### S08-T1-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Real transfer surface (latin-1 swallow → UnicodeDecodeError + fail-closed action). Preamble bans magic encoding; starter defect excellent; feedback anchors file-level quarantine vs cell fix. Success flexible on acción text (OK for transfer) but solution string is a clear target.
- **Checklist:** all pass
- **Severity residual:** none (optional P2: pin one preferred acción string in success bullet for auto-check environments)
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S08-T1-B-DEMO (iDo) — **A**
- **Diagnosis:** Consumer-mid-write story; prediction prompt for three-line output; contract `name + '.tmp'` explicit. Why and retrospective both land principle vs “escribí el string ≠ consumidor ve estado final”.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

---

### S08-T1-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Micro-drill (CRLF detect) with correct defect (`b'\n' in data`). Preamble anchors provenance without normalize. Retrospective very short (~18–22w): principle + bridge only, no self-check. Appropriate for E1 task; metacognitive close is thin.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective partial (thin)
- **Severity residual:** P2
- **Proposed retrospective (full replace):**  
  Newlines son metadata del origen, no un “error a silenciar”. El misconception es normalizar el crudo en silencio y perder la firma Windows. Autochequeo: ¿por qué `b'\n' in win` da True y aún así no sirve como detector CRLF? Siguiente (E2): `write_atomic` con el contrato tmp del curso.
- **Code/output changes:** none

---

### S08-T1-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Gate-critical helper. Preamble and limits name the exact tmp contract. Feedback explains same-dir replace. **Friction:** starter body calls `write_atomic(p, 'FULL')` while success/instruction demand `'ok\n'` — instruction step 4 covers it, but a hurried newbie who only rewrites the function and re-runs starter gets `FULL` and fails the mental success check. Mild integrity, not broken.
- **Checklist:** all pass (success named; call-site is extra cognitive load)
- **Severity residual:** P2 (prefer P1 only if auto-grader compares starter call text)
- **Proposed residual:** Align starter call to `'ok\n'` so the only defect is non-atomic write (or keep FULL and add instruction step 1b: “cambia el call a `'ok\n'`”). Prefer:  
  starter: `write_atomic(p, 'ok\n')` with `# DEFECT: write directo sin tmp/replace`.
- **Code/output changes:** starter call text only (optional); keep solution output `ok\n`

---

### S08-T1-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** Excellent mid vs final narrative; keeps partial evidence; renames `end` → `final`. Feedback clarifies atomic does not rewrite history. Retrospective has self-check-worthy principle. Distinct from E2 (implement helper → simulate consumer risk).
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

---

### S08-T2-A-DEMO (iDo) — **A**
- **Diagnosis:** DictReader + Decimal→string + ISO fecha; float warning; predict-and-contrast. Why bridges S02 money contract. Retrospective misconception “parece número”.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

---

### S08-T2-A-E1 (weDo, guided) — **A**
- **Diagnosis:** Split-manual defect classic; success dict exact; limits ban `split(',')`. Feedback + retro distinct (DictReader fieldnames vs header-as-contract). Good E1.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

---

### S08-T2-A-E2 (weDo, independent) — **A**
- **Diagnosis:** Missing writeheader defect excellent (n=0/basura). Success two-line exact. Feedback explains DictReader mis-header pathology. Independent scaffold right.
- **Checklist:** all pass
- **Severity residual:** P2 optional — step 4 (“En disco real usarías newline=''”) is useful note but not a task step; could move to hint.
- **Code/output changes:** none

---

### S08-T2-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** float → Decimal + `motivo=cast_monto`; success three lines golden; limits ban float and silent 0. Bridge to `load_clients_csv` You Do. Fade E1 reader → E2 writer → E3 cast/reject is textbook.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

---

### S08-T2-B-DEMO (iDo) — **A**
- **Diagnosis:** Clean/quar split with `col_count` + raw; prediction prompt; why ties to T4 reconcile. Retrospective misconception “casi bien / truncar”.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

---

### S08-T2-B-E1 (weDo, guided) — **B**
- **Diagnosis:** One-line boolean drill; preamble anchors pre-zip check; success `True` exact. Instruction step 2 pastes the full expression (OK for guided). Retrospective (~18w) thinnest in section — no misconception sentence.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective partial
- **Severity residual:** P2
- **Proposed retrospective (full replace):**  
  Contar columnas es el portero de clean: sin este check, `zip` silencia el sobrante y desalinea métricas. El error clásico es truncar la fila “para que pase”. Siguiente (E2): persistir cuarentena en CSV con `raw` y `reason`.
- **Code/output changes:** none

---

### S08-T2-B-E2 (weDo, independent) — **A**
- **Diagnosis:** Quarantine as first-class artifact; newline='' + fieldnames; success `col_count`. Feedback names Windows CSV breakage. Strong gate piece.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

---

### S08-T2-B-E3 (weDo, transfer) — **B**
- **Diagnosis:** Counter sorted → manifest reasons. **Fade note:** instruction almost pastes `sorted(Counter(reasons).items())` and “quita el pass” — surface is transfer-to-summary but scaffold still E1-like. Feedback on stable reason vocabulary is excellent. For true transfer, instruction could name goal + success without the Counter call.
- **Checklist:** all pass
- **Severity residual:** P2
- **Proposed instruction (slightly less spoon-fed):**  
  1. El starter importa `Counter` pero no imprime (solo `pass`).  
  2. Cuenta cada `reason` y recórrelos en orden lexicográfico.  
  3. Imprime `motivo conteo` por línea.  
  4. No inventes un orden manual con listas fijas.  
  (Keep Counter API in hints.)
- **Code/output changes:** none

---

### S08-T3-A-DEMO (iDo) — **A**
- **Diagnosis:** Same list → array vs JSONL; ensure_ascii + montos string; prediction prompt. Why chooses format by use case. Retrospective: JSONL ≠ broken array.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

---

### S08-T3-A-E1 (weDo, guided) — **A**
- **Diagnosis:** Slice defect funny and true; loads vs load in feedback; success `C001`. Tight guided unit.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

---

### S08-T3-A-E2 (weDo, independent) — **A**
- **Diagnosis:** Latam legibility; success José without `\u`; limits ban hand-rewriting string. Feedback separates dumps flag vs disk encoding. Good PE Spanish job hook.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

---

### S08-T3-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** `default=str` hide vs TypeError + isoformat; dual output; limits ban default=str in final. Transfer surface clean; bridge to schema T3-B.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

---

### S08-T3-B-DEMO (iDo) — **A**
- **Diagnosis:** Required presence vs truthiness (`email: None` passes); missing key fails; setdefault evolution. Three-output prediction. Core misconception named for We Do E2.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

---

### S08-T3-B-E1 (weDo, guided) — **A− / B+**
- **Diagnosis:** Always-True starter classic; success tuple exact; limits “solo presencia”. Instruction gives full listcomp (guided OK). Feedback separates schema vs cast_monto reasons — high value.
- **Checklist:** all pass
- **Severity residual:** P2 optional thin retro (~25w)
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S08-T3-B-E2 (weDo, independent) — **A**
- **Diagnosis:** Core integrity unit of T3-B. Starter `bool(obj.get('email'))` → False; solution `'email' in obj` + value None. Preamble/limits ban truthiness proxy. Feedback explains false quarantine of “email desconocido”. Learning distinction is **correct and testable**.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

---

### S08-T3-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** setdefault vs assignment that stomps vip; dual success dicts; limits name setdefault. Feedback + retro distinct. Clean transfer.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

---

### S08-T4-A-DEMO (iDo) — **A**
- **Diagnosis:** Auditor question framing; hash of **input** + backup; 12-hex + exists. Why and retro both hammer “no hashees el clean y digas que es el input”.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

---

### S08-T4-A-E1 (weDo, guided) — **A**
- **Diagnosis:** `hash()` builtin misconception perfect; success `ba7816bf 64` golden; limits name non-portable builtin. Feedback explains process instability. Strong.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

---

### S08-T4-A-E2 (weDo, independent) — **A**
- **Diagnosis:** copy2 + byte equality (not exists); success `True`. Feedback: exists ≠ equality. Independent level right.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

---

### S08-T4-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Provenance dict path/sha256/bytes; fixture `id\nC1\n` size 6; full sha256 in solution matches demo prefix. Feedback: ornamental manifest without hash/size. Bridge to T4-B.
- **Checklist:** all pass
- **Severity residual:** P2 — starter prints `sorted(prov.items())` while success is full dict; instruction step 3 says print dict — OK, but starter shape may tempt list-of-tuples output.
- **Proposed residual:** optional starter print: `print(prov)` with incomplete dict so shape matches solution.
- **Code/output changes:** none required

---

### S08-T4-B-DEMO (iDo) — **A**
- **Diagnosis:** Multi-source manifest; predict totals 5/4/1; derived sums; all(reconcile_ok). Why + retro fail-closed “no hay casi OK”. Gate climax before You Do.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

---

### S08-T4-B-E1 (weDo, guided) — **A**
- **Diagnosis:** Hardcoded True defect is real gate anti-pattern; success multi-line exact (5 4 1 + pairs + global True). Instruction step-by-step for guided multi-part task. Feedback: derived totals. Strong.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

---

### S08-T4-B-E2 (weDo, independent) — **C**
- **Diagnosis:** Pedagogically the **most important** unit of T4-B (compensated_bad). Prose is good (preamble names the lie of aggregate-only). Feedback is strong interview-grade. **But two integrity gaps for a true newbie:**

  1. **Return-shape mismatch:** starter returns `(True, n_in, n_clean, 0)` (4-tuple) and prints that shape; solution returns a **bool** and prints `True` / `False` on two fixtures. A learner who “fixes” only the always-True while keeping the starter return contract never matches success.
  2. **Fixture underspec:** instruction says “Prueba good y compensated_bad” without numeric rows. Numbers live only in `solutionCode`. Hints say “caso donde el agregado cuadra…” without figures. Independent tier still needs **success-defining fixtures** in preamble or instruction (not the algorithm).

  Verified live: compensated_bad aggregate `n_in=10` equals `n_clean+n_quarantine=10` while each source fails — math is correct when fixtures are known.
- **Checklist:** context pass · goal pass · success **partial** (True/False named; how to build compensated_bad not) · constraints pass · retrospective pass (thin but has principle)
- **Severity residual:** **P1**
- **Proposed title:** keep
- **Proposed preamble (add fixture bullet under Éxito):** keep bullets; extend éxito:  
  - **Éxito:** imprime `True` (good) y luego `False` (compensated_bad).  
  - **Fixtures:** `good = [{'n_in': 5, 'n_clean': 3, 'n_quarantine': 2}]`; `compensated_bad = [{'n_in': 5, 'n_clean': 5, 'n_quarantine': 1}, {'n_in': 5, 'n_clean': 4, 'n_quarantine': 0}]` (agregado 10=10; cada fuente no cuadra).
- **Proposed instruction:**  
  1. El starter devuelve siempre True (y además devuelve una tupla: el contrato final es un **solo booleano**).  
  2. Exige igualdad **por cada fuente** y también en los totales derivados.  
  3. Prueba `good` y `compensated_bad` con los fixtures del preamble.  
  4. Imprime solo los dos booleanos (True luego False).
- **Proposed starter change:**  
  `return True` only (or `return True  # DEFECT: no valida por fuente`), plus both fixtures and two prints already in starter with wrong always-True — so defect is logic, not missing world.
- **Proposed retrospective (slight expand):**  
  Si puedes explicar compensated_bad sin código (sobrante en una fuente + faltante en otra = total mentiroso), ya defendiste CP-N1-B. El misconception es confiar solo en la suma global. Luego (E3): el mini-`run()` fail-closed — mismo if del You Do.
- **Code/output changes:** starter return shape + include fixtures; **preserve** solution output `True\nFalse` and compensated numbers

---

### S08-T4-B-E3 (weDo, transfer) — **A− / B+**
- **Diagnosis:** Mini pre–You Do `run()` fail-closed; success strings exact for good/bad; report all broken sources; retrospective has self-check question. Bridge explicit. **Hint spoil:** first hint is nearly the full `broken = [...]` listcomp — heavy for transfer (acceptable as progressive second-tier if UI shows hints one by one; first hint could be softer).
- **Checklist:** all pass
- **Severity residual:** P2
- **Proposed hints rebalance:**  
  1. “Lista nombres de fuentes donde `n_in != n_clean + n_quarantine`.”  
  2. Keep listcomp as second hint.
- **Code/output changes:** none

---

### S08-YouDo (youDo) — **A**
- **Diagnosis:** Strong assembly frame: receta T1–T4, **éxito de corrida observable** (three demo scenarios including exit 1), requirements contractual (Decimal, write_atomic, newline='', per-source reconcile, no compensation), starter with NotImplemented per piece, rubric + portfolioNote. Retrospective is defense-style (invariants, real vs synthetic PII, 30s impact sentence) — matches spec exemplar pattern. No empty fields.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective pass
- **Severity residual:** none
- **Proposed residual:** none (do not bloat context)
- **Code/output changes:** none

---

## Priority order

### P0
None. Field coverage and core pedagogy are present and usable.

### P1 (fix first)
1. **S08-T4-B-E2** — Align starter return type to a single bool; **publish compensated_bad / good fixtures in preamble or instruction** (not only in solution); keep golden `True\nFalse` and numeric fixtures as in current solution.

### P2 (polish if budget)
1. **Thin retrospectives** on micro-drills: T1-B-E1, T2-B-E1, optionally T1-A-E1 / T3-B-E1 — expand to ~40–55w with explicit misconception + optional self-check.  
2. **T1-B-E2** — Align starter call to `'ok\n'` (or document call change in step 1).  
3. **T2-B-E3** — Slightly less spoon-fed instruction; leave Counter API in hints.  
4. **T4-B-E3** — Soften first hint.  
5. **T4-A-E3** — Optional starter `print(prov)` shape match.  
6. **T1-A-E2** — Prefer `p.open` wording in instruction.  
7. Bulk: where feedback and retro restate the same principle, ensure retro always adds **transfer + self-check** (most units already do; micro-drills lag).

---

## Residual risks

1. **Section id `pandas` vs stdlib ETL content** — UI/path expectation mismatch remains; jobRelevance already clarifies; out of exercise-prose scope.  
2. **T4-B-E2 conceptual load** — even after fixture pin, compensated_bad needs careful reading; do not “simplify away” the two-source lie.  
3. **Golden digests** (sha256 of `abc`, `id\nC1\n`) — never rewrite content bytes when polishing prose.  
4. **E1 one-liner drills** (T2-B-E1, T1-B-E1) — risk of over-preamble; keep single goal + exact bool output.  
5. **youDo density** — context already long; R2 must not re-essay it.  
6. **Fade discipline** — T2-B-E3 and heavy E3 hints are the main places fade softens; prefer hint demotion over bloating preambles.  
7. **Idioma** — keep Peruvian professional Spanish; retain course contract tokens (`reason`, `reconcile_ok`, `write_atomic`, fail-closed).

---

## Fixer handoff notes

- **Do not** re-run a full preamble campaign; fields exist and are mostly **A**.  
- **Must fix:** T4-B-E2 starter API + learner-visible fixtures (P1).  
- **Prefer:** thin-retro expansions only where listed (P2).  
- Preserve all solution `output` strings unless execute-and-diff proves a bug.  
- Keep `# DEFECT:` comments.  
- After fix: static typecheck/build of section module; no generators for prose.

---

Section 8 exercise pedagogy review complete. Ready for the Fixer prompt.
