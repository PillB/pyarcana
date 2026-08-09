# S07 Exercise Pedagogy Report (Round 2)

## Section
- **title:** Texto, Unicode y expresiones regulares
- **id:** `data-acquisition` (index 7)
- **source:** `src/lib/course/sections/s07-data-acquisition.ts`
- **counts:** iDo 8, weDo 24 (8 subtemas × E1/E2/E3), youDo 1
- **subtopics:** T1-A Unicode NFC/casefold · T1-B nombres latam/partículas · T2-A str methods · T2-B contacto modesto · T3-A regex grupos/anchors · T3-B compile/extracción/límites · T4-A Jaccard/exact · T4-B FP/FN y evidencia
- **Round 1 context:** `round1/S07_EXERCISE_PEDAGOGY_REPORT.md` (context only — no rubber-stamp)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (preamble/retrospective checklists, E1→E3 fade, length targets, anti-aberration)
- Manually re-inspected **current** source for every `iDo.steps[]`, `weDo.steps[]`, and `youDo` (title, preamble, instruction, feedback, retrospective, starter defect, solution output, why)
- Measured word counts of pedagogical fields only (allowed); no generators of prose
- Compared against Round-1 gaps only to see what was filled; scores below are independent quality judgments for a true newbie
- No bulk generation; no source edits

## Global findings (post Round-1 fix)

| Area | Status | Residual impact |
|------|--------|-----------------|
| **Field coverage** | Complete: every iDo has `preamble`+`why`+`retrospective`; every weDo has `title`+`preamble`+`instruction`+`feedback`+`retrospective`; youDo has `retrospective` + strong context | Round-1 P0 “zero fields” is **closed** |
| **We Do titles** | Present, 4–7 words, Spanish PE, role-aligned | Pass |
| **Preamble shape** | All weDo use bullets contexto/meta/éxito/límites; iDo narrative “qué observar” | Structure pass; several iDo preambles short of 80–150 w target |
| **Instruction = steps** | Task-only ordered steps; E1 names defect; E2/E3 mostly less spoon-fed | Pass with minor fade nits (T1-B-E1/E2 twin defect) |
| **E1→E2→E3 fade** | Distinct surfaces (NFC → casefold → diagnóstico; apellidos → partículas → review; strip → join → dígitos; email → phone → overfit; fullmatch → groupdict → search/full; compile → findall → backtracking; exact → Jaccard → umbrales; FP/FN → evidencia → no-parentesco) | Pass — not number-clones of the same prompt |
| **Feedback reasoning** | Mostly 20–37 w with misconception | Several under 25 w; a few echo retrospective |
| **Retrospectives** | Present everywhere | **Systematic thinness:** many weDo retros 13–26 w (target 40–80); several iDo retros 19–27 w |
| **Starter `print('ok', True)`** | Still on **all 24** weDo starters; solutions omit it | **P1 integrity:** only T1-A-E1 instruction tells the learner to remove it |
| **Free-form output units** | T1-A-E3 (`causa`), T2-B-E3 (política), T3-A-E3 (uso), T3-B-E3 (4 prints), T4-B-E2 (`reason`), T4-B-E3 (3 prints) | Risk if UI does exact stdout compare; preambles name content but not “frase canónica del panel” |
| **youDo frame** | context + objectives + requirements + rubric + retrospective defensa | Pass (A) |
| **Code/outputs** | Intact; defects intentional; ethics wall holds (no parentesco, no PII real, no scraping) | No broken solution found |

**Net:** Round 1 closed the systematic missing-text gap. Round 2 residuals are **thin metacognitive closes, residual starter noise, free-form output risk, and length polish** — not empty scaffolds. No P0 “unit unusable.”

---

## Scoring key
| Score | Meaning |
|-------|---------|
| **A** | Newbie can answer what / why / success / what sticks; no residual fix needed |
| **B** | Usable; minor residual (thin retro, length, polish) |
| **C** | Partial; residual should be fixed in R2 (clarity, thin metacognition, mild integrity) |
| **D** | Fails true-newbie test on a critical checklist item |

Checklist: **context · goal · success · constraints · retrospective** → pass / partial / fail.

---

## Unit ledger

### S07-T1-A-DEMO (iDo) — **B+**
- **Diagnosis:** Strong demo of raw equality fail vs NFC + casefold. Preamble sequences what to watch (code points, NFC, casefold). `why` names FN silenciosos en CRM latam. Retrospective has principle + classic error + We Do bridge. Slightly under length targets (pre ~67, retro ~39); self-check optional missing.
- **Checklist:** context pass · goal pass · success pass (output) · constraints pass · retrospective pass
- **Severity residual:** P2
- **Proposed residual improvements:** Optional +1 sentence in retrospective: “Autochequeo: ¿puedes decir, sin mirar, qué imprime `ord` en la forma NFD de José?” No change to code/output.
- **Code/output changes:** none

---

### S07-T1-A-E1 (weDo, guided) — **A**
- **Diagnosis:** Model We Do for the section: title clear; preamble with exact `repr` success including empty string; instruction names defect and uniquely tells learner to drop residual `print('ok')`; feedback repairs “NFC no inventa texto”; retro bridges to casefold E2. Starter defect pedagogical.
- **Checklist:** all pass
- **Severity residual:** none (optional P2: retro ~26 w — could expand one sentence)
- **Proposed residual:** none required
- **Code/output changes:** none (this unit already models ok-print cleanup)

---

### S07-T1-A-E2 (weDo, independent) — **A−**
- **Diagnosis:** Excellent policy pedagogy (`casefold` as contract even when `lower` “works”). Preamble and feedback both explain ß / no bifurcar políticas. Instruction is properly lighter than E1. Residual: starter still ends with `print('ok', True)` while instruction does not mention removal (systematic issue).
- **Checklist:** all pass for pedagogy; constraints pass
- **Severity residual:** P1 (shared starter noise) / P2 retro length
- **Proposed residual:** Drop `print('ok', True)` from starter **or** add instruction step: “Imprime solo el booleano (sin prints residuales).”
- **Code/output changes:** remove residual print from starter (preferred)

---

### S07-T1-A-E3 (weDo, transfer) — **B**
- **Diagnosis:** Real transfer (diagnose, don’t only apply NFC). Success lines clear. Feedback repairs “ver igual ≠ ser igual”. Free-form `causa: …` line risks exact-output mismatch if learner paraphrases well.
- **Checklist:** context pass · goal pass · success partial (frase de causa free-form) · constraints pass · retrospective pass
- **Severity residual:** P1 (output compare on prose) / P2
- **Proposed instruction micro-edit (step 3):**  
  `3. Escribe una línea \`causa: …\` que nombre formas compuesta vs combining mark (usa el texto canónico del panel de solución si el entorno compara salida exacta).`
- **Proposed residual (optional full causa canónica already in solution):** keep solution phrase fixed; do not loosen to free prose in auto-grade paths.
- **Code/output changes:** none required if UI documents exact match

---

### S07-T1-B-DEMO (iDo) — **B+**
- **Diagnosis:** Worked example of given + two apellidos with particles and raw conservation. Preamble and why set ethics wall (heurística ≠ identidad legal). Retrospective thin on misconception (~34 w) but bridges to We Do triad.
- **Checklist:** all pass
- **Severity residual:** P2
- **Proposed retrospective expand (full replace):**  
  Dos apellidos finales + given con partículas es el patrón base latam del curso. El error clásico es forzar first/last US o borrar `del` “porque sobra”. No es convención universal: documenta límites y conserva `raw`. We Do: split feliz, partículas, y fail-closed cuando hay pocos tokens.
- **Code/output changes:** none

---

### S07-T1-B-E1 (weDo, guided) — **A−**
- **Diagnosis:** Defect `given = toks[0]` clear; success exact; feedback short (~21 w) but names “María” left out. Retrospective bridges to particles E2. Feedback slightly under length gate.
- **Checklist:** all pass
- **Severity residual:** P2
- **Proposed feedback expand:**  
  Con cuatro tokens, `toks[0]` deja fuera «María». Los últimos dos son apellidos; todo lo anterior es given. Es heurística de modelado, no RENIEC ni prueba de parentesco.
- **Code/output changes:** remove `print('ok', True)` from starter

---

### S07-T1-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Same structural defect as E1 on particle surface — intentional repetition with variation. Prose differentiates (preserve `del Carmen`, no mega-regex). Retrospective very short (~20 w) and light on the “de la Cruz as apellido” limit (that lives only in feedback).
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective partial (thin)
- **Severity residual:** P2
- **Proposed retrospective (full replace):**  
  Partículas en given son el caso latam típico: no inventes reglas mágicas de borrado del medio. Esta heurística no resuelve todos los «de la Cruz» como apellido; por eso existe `review`. Luego (E3): fail-closed con pocos tokens.
- **Code/output changes:** remove residual print from starter

---

### S07-T1-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** Excellent ethical/technical transfer: Madonna → review; Luis Quispe Huamán → ok. Preamble states fail-closed demográfico. Feedback and retro reinforce “review > inventar campos”. Success dict shapes in solution are clear.
- **Checklist:** all pass
- **Severity residual:** P2 (retro ~22 w; starter residual print)
- **Proposed residual:** Optional expand retro one sentence on CP-N1-B; drop starter `print('ok')`.
- **Code/output changes:** remove residual print from starter

---

### S07-T2-A-DEMO (iDo) — **B**
- **Diagnosis:** Clean strip/collapse/replace/find demo. Preamble anchors “str primero”. `why` slightly short (~36 w). Retrospective too thin (~20 w): principle + bridge only, weak misconception.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective partial
- **Severity residual:** P2
- **Proposed retrospective (full replace):**  
  Si `replace`/`split` bastan, no escribas regex: menos backtracking y más tests. El error clásico es “ya pongo un patrón inteligente” para un guion o una abreviatura. We Do T2-A: CSV-like con strip, `join` estable, y dígitos de teléfono sin `re`.
- **Proposed why expand (optional):**  
  Los métodos `str` resuelven la limpieza de dirección sin regex: `replace` es literal y predecible. En el normalizador documentas el paso en `transforms` y conservas el `raw` por si mañana cambia la política de abreviaturas.
- **Code/output changes:** none

---

### S07-T2-A-E1 (weDo, guided) — **B+**
- **Diagnosis:** Classic strip-after-split; success list exact; feedback anticipates S08 `csv`. Retrospective very short (~17 w).
- **Checklist:** all pass for task; retrospective partial
- **Severity residual:** P2
- **Proposed retrospective (full replace):**  
  Strip por campo es la higiene mínima antes de normalizar: `split` no recorta espacios. El error clásico es comparar `' Ana '` con `'Ana'` y culpar al CRM. Siguiente: `join` con separadores estables (E2).
- **Code/output changes:** remove residual print from starter

---

### S07-T2-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Simple join dual-separator practice; success exact. Appropriate E2 lightness. Retro thin (~19 w). Low cognitive load is OK; misconception (“bucle con + deja basura”) lives only in feedback.
- **Checklist:** all pass
- **Severity residual:** P2
- **Proposed residual:** Optional pull “bucle con `+` deja basura al borde” into retro; drop starter residual print.
- **Code/output changes:** remove residual print from starter

---

### S07-T2-A-E3 (weDo, transfer) — **B+**
- **Diagnosis:** Good “str first” transfer: dual path replace vs isdigit; starter defect `isalnum` is subtle and valuable. Feedback thin (~18 w). Differentiates from T2-B-E2 (no country code / no PE framing) — intentional double reinforcement, preambles distinct enough.
- **Checklist:** all pass
- **Severity residual:** P2
- **Proposed feedback expand:**  
  `isalnum` deja letras si las hubiera; para teléfono quieres solo dígitos. Un `replace` controlado es más legible que un patrón “listo”. Aquí no valides operadora ni longitud.
- **Code/output changes:** remove residual print from starter

---

### S07-T2-B-DEMO (iDo) — **B**
- **Diagnosis:** Excellent triple beat (modest email, PE digits, overfit rejects plus). Preamble tells learner to predict the third print. `why` and retro short; retro misses explicit misconception name beyond “overfit”.
- **Checklist:** all pass; retrospective partial on length
- **Severity residual:** P2
- **Proposed retrospective (full replace):**  
  Validación modesta + cola de review supera a la regex hiper-estricta. El misconception es “cuanto más estricta, mejor calidad”: en realidad rechazas válidos (plus tags). We Do: implementar el contrato de email, dígitos de teléfono, y demostrar el rechazo del overfit.
- **Code/output changes:** none

---

### S07-T2-B-E1 (weDo, guided) — **A−**
- **Diagnosis:** Rich guided contract (ok + three review_error). Preamble absorbs product constraints well; instruction task-only. Feedback explains empty local / double @ / spaces without claiming deliverability. Residual starter print not mentioned in steps (unlike T1-A-E1).
- **Checklist:** all pass
- **Severity residual:** P1 (starter noise) / P2 retro length
- **Proposed residual:** Remove `print('ok', True)` from starter; optionally add step “Imprime solo `ok` / `review_error` del loop.”
- **Code/output changes:** remove residual print from starter

---

### S07-T2-B-E2 (weDo, independent) — **A−**
- **Diagnosis:** Clear PE phone digits with +51 conservation; limits ban operator/length validation. Instruction properly short for E2. Feedback+retro slightly redundant on “política de dígitos > regex”.
- **Checklist:** all pass
- **Severity residual:** P2
- **Proposed residual:** Dedup: keep “longitud/operadora fuera de banda” only in feedback or only in retro; drop starter residual print.
- **Code/output changes:** remove residual print from starter

---

### S07-T2-B-E3 (weDo, transfer) — **B**
- **Diagnosis:** Strong product-transfer surface. Starter inverts rejected flag and teaches false policy — excellent defect. Free-form política line needs canonical phrase for auto-compare (solution already fixes one).
- **Checklist:** context pass · goal pass · success partial (prose line) · constraints pass · retrospective pass
- **Severity residual:** P1 (exact prose) / P2
- **Proposed instruction step 3:**  
  `3. Imprime la política modesta en **una** línea (alineada al panel de solución: un @, local/dominio, cero espacios; sin entregabilidad).`
- **Code/output changes:** remove residual print from starter

---

### S07-T3-A-DEMO (iDo) — **B**
- **Diagnosis:** Named group + fullmatch contrast well shown. Preamble predicts field vs substring. Retro short (~26 w) but principle present. `why` under length target (~33 w).
- **Checklist:** all pass
- **Severity residual:** P2
- **Proposed why expand:**  
  Los grupos con nombre documentan el contrato del campo (`m.group('dni')` en vez de índices mágicos). Confundir `search` con `fullmatch` genera falsos positivos de validación: un código embebido «pasa» cuando solo buscabas un substring en un log.
- **Code/output changes:** none

---

### S07-T3-A-E1 (weDo, guided) — **A**
- **Diagnosis:** Excellent defect: `search` + `[A-Z]{3}` lets `'Lima'` pass via `'Lim'`. Feedback names that trap. Success True/False clear. Model guided regex unit.
- **Checklist:** all pass
- **Severity residual:** P2 starter noise only
- **Proposed residual:** remove residual print from starter
- **Code/output changes:** remove residual print from starter

---

### S07-T3-A-E2 (weDo, independent) — **A−**
- **Diagnosis:** Crossed positional groups + missing names; constraint “not for María del Carmen” is excellent transfer of T1-B. Instruction independent enough. Feedback ~23 w borderline.
- **Checklist:** all pass
- **Severity residual:** P2
- **Proposed residual:** remove residual print; optional +1 sentence feedback already has particle note — OK as is.
- **Code/output changes:** remove residual print from starter

---

### S07-T3-A-E3 (weDo, transfer) — **B+**
- **Diagnosis:** Starter swaps search/fullmatch **and** policy text — strong integrity for transfer. Success three lines. Free-form risk on policy line mitigated by short fixed phrase in solution.
- **Checklist:** all pass if exact phrase required; success partial if free paraphrase allowed
- **Severity residual:** P1 (document exact policy string) / P2 retro thin (~20 w)
- **Proposed retrospective expand:**  
  search/finditer = extracción; fullmatch = gate del campo. El error clásico es copiar un patrón de log a un validador de formulario. En T3-B reutilizas patrones compilados y extraes múltiples señales de un log.
- **Code/output changes:** remove residual print from starter

---

### S07-T3-B-DEMO (iDo) — **B**
- **Diagnosis:** compile + findall + finditer + backtracking note. Preamble asks to predict spans. Retro thin (~24 w) but principle “regex aburrida es feature” present.
- **Checklist:** all pass
- **Severity residual:** P2
- **Proposed residual:** Optional self-check in retro: “¿findall y finditer devuelven la misma información de posición?”
- **Code/output changes:** none

---

### S07-T3-B-E1 (weDo, guided) — **A−**
- **Diagnosis:** Defect `\d{9}` without leading 9; reuse of compiled pattern in loop. Success format with arrow clear. Retro short (~18 w).
- **Checklist:** all pass
- **Severity residual:** P2
- **Proposed retrospective expand:**  
  compile + reuse documenta intención y evita reescribir el raw string en cada log. El error clásico es “cualquier 9 dígitos = celular”. Siguiente: findall de códigos de región-número (E2).
- **Code/output changes:** remove residual print from starter

---

### S07-T3-B-E2 (weDo, independent) — **B+**
- **Diagnosis:** Silent case bug (`[a-z]` → empty list) is excellent independent surface. Instruction only 3 steps (OK for E2). Retro very short (~17 w).
- **Checklist:** all pass; retrospective partial
- **Severity residual:** P2
- **Proposed retrospective (full replace):**  
  findall multi-match es extracción ordenada, no gate de email. El error de case es silencioso: lista vacía sin excepción. Luego (E3): documentar el riesgo de backtracking **sin** ejecutarlo.
- **Code/output changes:** remove residual print from starter

---

### S07-T3-B-E3 (weDo, transfer) — **B**
- **Diagnosis:** Policy/prose E3 done right: forbids running hostile strings; starter recommends anti-pattern. Four canonical prints fixed in solution. Still free-form risk if learner rewrites with synonyms. Feedback strong.
- **Checklist:** context pass · goal pass · success partial (prose) · constraints pass · retrospective pass
- **Severity residual:** P1 (exact four lines) / P2
- **Proposed instruction step 1:**  
  `1. Reescribe los prints del starter para que coincidan con la política canónica del panel (patrón peligroso, riesgo hang/CPU, mitigación, preferir a+b o pasos).`
- **Code/output changes:** remove residual print from starter

---

### S07-T4-A-DEMO (iDo) — **B**
- **Diagnosis:** Jaccard ~0.667 → review with dot-as-space tokenization. Preamble clear anti auto-merge. Retrospective too short (~19 w): principle only, weak misconception.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective partial
- **Severity residual:** P2
- **Proposed retrospective (full replace):**  
  Score = evidencia para un humano, no veredicto. El error clásico es “0.67 es alto → fusionar cuentas”. Exact solo con igualdad plena tras el mismo pipeline. We Do: exact match normalizado, implementación de Jaccard, y umbrales de decisión.
- **Code/output changes:** none

---

### S07-T4-A-E1 (weDo, guided) — **B+**
- **Diagnosis:** Defect strip+lower without NFC/collapse is the right first line of matching. Success True. Feedback and retro both thin (~16 w) and overlap on “exact miente”.
- **Checklist:** all pass for task; feedback/retro partial on length
- **Severity residual:** P2
- **Proposed feedback (full replace):**  
  `strip().lower()` no colapsa dobles espacios ni unifica formas Unicode. Sin NFC + join/split + casefold, el “exact” del intake miente y genera FN o merges frágiles.
- **Proposed retrospective (full replace):**  
  Exact normalizado es la primera línea: barata, auditable y sin scores. El error clásico es saltar directo a similitud. Siguiente: Jaccard cuando el exact falla (E2).
- **Code/output changes:** remove residual print from starter

---

### S07-T4-A-E2 (weDo, independent) — **A−**
- **Diagnosis:** Double defect (min len + no NFC) is pedagogically rich; success 0.667 canonical. Feedback explains Dice-like inflation. Retro very short (~14 w) and largely restates “review no merge”.
- **Checklist:** all pass; retrospective partial
- **Severity residual:** P2
- **Proposed retrospective (full replace):**  
  Jaccard usa |A∩B|/|A∪B| tras el mismo pipeline Unicode. Score parcial → review en el pipeline, no merge automático ni “es la misma persona”. Luego (E3): codificar umbrales exact/review/no_match.
- **Code/output changes:** remove residual print from starter

---

### S07-T4-A-E3 (weDo, transfer) — **A−**
- **Diagnosis:** Threshold policy transfer; starter marks 0.67 as exact — clear integrity hole for the learner to fix. Success line exact. Feedback/retro short but message right.
- **Checklist:** all pass
- **Severity residual:** P2
- **Proposed residual:** Expand retro to name cost of false exact merges; drop starter residual print.
- **Proposed retrospective (full replace):**  
  Decisiones de matching son de proceso, no etiquetas familiares. Un umbral flojo que convierte 0.67 en `exact` fabrica fusiones. En T4-B nombras FP/FN y empaquetas evidencia para el humano.
- **Code/output changes:** remove residual print from starter

---

### S07-T4-B-DEMO (iDo) — **B**
- **Diagnosis:** TP/FP/FN table with latam pairs; ethics note at end. Preamble asks mental classification before print. Retro thin (~23 w).
- **Checklist:** all pass; retrospective partial on length
- **Severity residual:** P2
- **Proposed retrospective (full replace):**  
  FP y FN tienen costo de negocio distinto (fusión errónea ≠ omitir un cliente real). El error clásico es optimizar solo “accuracy” sin nombrar el error. We Do: clasificar a mano, empaquetar evidencia, y enunciar por qué no hay parentesco automático.
- **Code/output changes:** none

---

### S07-T4-B-E1 (weDo, guided) — **B+**
- **Diagnosis:** Inverted FP/FN tags — perfect guided surface. Success FP then FN. Retro extremely short (~13 w).
- **Checklist:** all pass for task; retrospective partial
- **Severity residual:** P2
- **Proposed retrospective (full replace):**  
  Nombrar el error precede a mover el umbral: FP = el sistema dijo match y no debía; FN = debía coincidir y no lo hizo. Invertirlos entrena mal la política de review. Siguiente: empaquetar evidencia estructurada (E2).
- **Code/output changes:** remove residual print from starter

---

### S07-T4-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Evidence package with five keys; starter omits reason and uses decision=match. Free-form `reason` is the main residual risk for exact stdout compare (solution freezes one Spanish phrase).
- **Checklist:** context pass · goal pass · success partial (reason phrase) · constraints pass · retrospective pass
- **Severity residual:** P1 (reason exact match) / P2
- **Proposed instruction step 3:**  
  `3. Escribe un \`reason\` en español que mencione similitud parcial y revisión humana (usa la frase canónica del panel si hay comparación exacta de salida).`
- **Code/output changes:** remove residual print from starter; keep solution `reason` frozen

---

### S07-T4-B-E3 (weDo, transfer) — **B+**
- **Diagnosis:** Ethical close of section as transfer; starter affirms prohibited claims. Three fixed policy lines in solution. Retro bridges to You Do. Free-form risk if paraphrase diverges.
- **Checklist:** all pass if exact phrases; success partial under free prose
- **Severity residual:** P1 (document three canonical lines) / P2
- **Proposed residual:** Same as T3-B-E3 — point instruction at solution panel phrasing for auto-grade.
- **Code/output changes:** remove residual print from starter

---

### youDo — Normalización latinoamericana (CP-N1-B) — **A**
- **Diagnosis:** Project frame is complete: context (CP-N1-B raw/normalized/transforms), objectives, requirements (email/phone/NFC/review ethics), rubric, starter with `NotImplementedError` contracts, portfolioNote, and a defense retrospective with three self-checks + measurable impact + S08 bridge. Newbie can build and know what “listo” means. No forced duplicate preamble needed (context already plays that role).
- **Checklist:** context pass · goal pass · success pass (rúbrica) · constraints pass · retrospective pass
- **Severity residual:** none required
- **Proposed residual:** Optional only — one bullet in portfolioNote that README must show fail-closed mononym → review (already covered by requirements/objectives).
- **Code/output changes:** none

---

## Score summary

| Score | Units |
|-------|-------|
| **A / A−** | T1-A-E1, T1-A-E2, T1-B-E1, T1-B-E3, T2-B-E1, T2-B-E2, T3-A-E1, T3-A-E2, T3-B-E1, T4-A-E2, T4-A-E3, youDo (+ several B+ near A) |
| **B / B+** | All 8 iDo; remaining weDo (thin retros, free-form risk, starter noise) |
| **C / D** | **none** |

Round-1 systematic empty fields are closed. No unit fails the true-newbie critical path.

---

## Priority order (Round 2 Fixer)

### P1 (do first — integrity / learner success friction)
1. **Strip `print('ok', True)` from all 24 weDo starters** (or systematically tell E2/E3 to print only canonical lines). Only T1-A-E1 currently names the cleanup.
2. **Free-form stdout units — anchor to solution panel phrases:**  
   T1-A-E3 (`causa`), T2-B-E3 (política), T3-A-E3 (uso), T3-B-E3 (4 lines), T4-B-E2 (`reason`), T4-B-E3 (3 lines). One instruction clause each: “alineado al panel de solución si hay comparación exacta.”

### P2 (quality polish)
1. **Expand thin retrospectives** (priority order by thinness / load):  
   T4-B-E1, T4-A-E2, T4-A-E1, T4-A-E3, T2-A-E1, T3-B-E1, T3-B-E2, T1-B-E2, T2-A-DEMO, T2-B-DEMO, T4-A-DEMO, T4-B-DEMO — use full replacements above where given.
2. **Expand thin feedback** where under ~20 w: T2-A-E3, T4-A-E1, T4-A-E3, T1-B-E1.
3. **iDo why/retro length** on T2-A, T2-B, T3-A, T4-A demos (optional if timeboxed after weDo).
4. **Dedup feedback↔retro** on T2-B-E2 (same “política de dígitos” sentence twice).

### P3 (optional)
- Self-check questions in 2–3 iDo retros (T1-A, T3-B).
- PortfolioNote mononym→review reminder on youDo (already in requirements).

---

## Residual risks

1. **Output compare on prose units** remains the highest operational risk; fixing instruction anchors is cheaper than softening graders.
2. **T1-B-E1 / E2 twin defect** is still the same `given = toks[0]` — acceptable if prose stays non-clone (currently OK); do not rewrite as identical step lists.
3. **T2-A-E3 vs T2-B-E2 phone reinforcement** is intentional; keep PE framing only on T2-B.
4. **Do not reopen scope** with scraping/HTTP/SQL or real PII; ethics wall on matching must stay.
5. **Exact solution outputs** should stay frozen unless execute-and-diff justifies a change.
6. **No generators** for any residual prose — hand-edit per unit.

---

## Round-1 → Round-2 delta (what fixed vs residual)

| Round-1 gap | Status after fix | Round-2 residual |
|-------------|------------------|------------------|
| Zero preamble | **Closed** (8+24) | Length polish on some iDo |
| Zero retrospective | **Closed** (8+24+1) | Many weDo retros still thin (13–26 w) |
| Zero weDo title | **Closed** (24) | None |
| Instructions = drill | **Mostly closed** | Minor fade nits only |
| One-line feedback | **Mostly closed** | A few still &lt;20 w |
| youDo no retro | **Closed** | A quality |
| Starter `print('ok')` noise | **Not fixed** | P1 systematic |
| Free-form E3/reason outputs | Named in R1 risks | Still needs instruction anchors |

---

## Counts summary for Fixer

| Kind | Units | Field coverage | Primary residual |
|------|-------|----------------|------------------|
| iDo | 8 | complete | thin retro/why length (P2) |
| weDo | 24 | complete | starter noise (P1); thin retros (P2); prose exact-match (P1) |
| youDo | 1 | complete | none required |

**No source files were modified in this review round.**

Section 7 exercise pedagogy review complete. Ready for the Fixer prompt.
