# S25 Exercise Pedagogy Report (Round 2)

## Section
- **title:** Endpoints de IA, Hugging Face y prompting evaluado
- **shortTitle:** IA endpoints y prompts
- **id:** `streamlit-dashboards` (archivo histórico `s25-streamlit-dashboards.ts`; contenido = stack IA / mock HF / prompting / evals — no dashboards Streamlit)
- **index:** 25
- **source file:** `src/lib/course/sections/s25-streamlit-dashboards.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades)
- **subtemas:** S25-T1-A stack rules/specialized/LLM · T1-B model card/licencia/host · T2-A mock HF contrato · T2-B batch/caché/costo/circuit · T3-A prompt+schema JSON · T3-B tools/checkpoints · T4-A golden/schema/field_match · T4-B injection/minimize/no-fraude
- **hilo de caso:** asistente de IA **CP-N2-C** (desk riesgos sintético Lima; campos OCR de S24 como contexto no confiable; fixture `CASO-LIM-025`; score ≠ fraude; fail-closed a `human_review`)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (roles de campo, longitudes, checklist preamble/retrospective, fade E1→E2→E3, anti-aberration)
- Manually re-inspected **every** `iDo.steps[]`, `weDo.steps[]`, and `youDo` in the **current** source after Round-1 fixes
- Used Round-1 report only as historical context — **not** as acceptance proof
- Scored residual quality for a true newbie (qué practico / por qué importa / cómo sé que gané / qué debe quedarme), not mere field presence
- Measurement-only word counts and feedback↔retro lexical overlap (allowed); no bulk generation of prose
- No source edits in this round
- Residual proposals in **español profesional peruano**, un objetivo primario por unidad

## Round-1 fix verification (schema shell)

| Expectation after R1 | Status in current source |
|----------------------|--------------------------|
| All iDo have `preamble` + `retrospective` | **Met** (8/8) |
| I Do `why` expanded toward 40–90 words | **Met** (~38–54 w; T3-B why ~38 soft edge) |
| All We Do have `title` + `preamble` + task-style `instruction` + `retrospective` | **Met** (24/24) |
| We Do `preamble` in 4-bullet form (Contexto / Meta / Éxito / Límites) | **Met** — valid alternative to 80–150-word prose |
| We Do `instruction` task-only (numbered steps) | **Met** — densas “ID · fixture + Salida exacta” de R1 eliminadas |
| You Do has `retrospective` of defense | **Met** (~89 w multi-check) |
| You Do context success observable (R1 P2 optional) | **Met** — frase de `eval_golden` / injection → human_review presente |
| E1→E2→E3 fade preserved in *code* | **Met** |
| Starters with `# Bug` / `CASO-LIM-025`, solutions, outputs intact | **Met** |
| Feedback with desk/HITL/costo anchors (R1 P2) | **Mostly met** — several still thin (&lt;25 w) or copy retro |

**Verdict:** Round-1 closed the systemic P0 “missing pedagogy shell.” Round-2 finds **no new missing-field crisis**. Residual work is **quality**: (1) **feedback ↔ retrospective role collapses** on several units (same sentence or core idea), (2) **short We Do retrospectives** under the 40-word soft floor, (3) **thin feedback** on a few units, (4) **I Do retrospectives** that stop at bridge without misconception/self-check (worst: T3-A-DEMO ~20 w), (5) **E2 hints** that paste the full solution line (acceptable for guided; slightly heavy for independent).

---

## Global residual findings

| Residual gap | Evidence | Impact | Severity |
|--------------|----------|--------|----------|
| **Feedback ≈ retrospective** (phrase paste) | **T1-B-E2** (PII/exfiltración), **T3-B-E2** (“log es evidencia… no contador mágico”), **T4-A-E1** (“hardcodear métricas engaña al VP”), **T4-B-E1** (telemetría vs control), **T1-B-E3** (“gate compuesto… metadata”), **T4-A-E3** (“Fail-closed al schema es el gate de CP-N2-C”), **T4-B-E2** (“Minimización es control de exfiltración”) | Feedback does not repair *reasoning* of the failed attempt; retro does not add metacognition | **P1** (clear pairs above) |
| **Mild feedback/retro echo** | **T1-A-E2** (“bug silencioso de política”), **T2-A-E3** (score ≠ fraude), **T3-B-E3** (“shell libre en el sandbox”) | Usable but redundant close | **P2** |
| **Short We Do `retrospective`** (&lt;~25–30 w; soft floor 40–80) | Worst: **T4-A-E1 ~17**, **T2-A-E1 ~18**, **T3-B-E2 ~18**, **T2-A-E2 ~19**, **T3-B-E1 ~20**, **T2-B-E2 ~21**, **T1-B-E2 ~22**, **T3-A-E1/E2 ~22**, **T4-B-E1/E2 ~21–22**, **T2-B-E1 ~24**, **T1-A-E1 ~25** | Principle present; misconception and/or self-check often missing when not also a collapse pair | **P2** (expand collapsed pairs first; then worst shorts) |
| **Thin We Do `feedback`** (&lt;25 w soft floor) | **T1-A-E3 ~14**, **T2-B-E3 ~18**, **T4-A-E1 ~18**, **T1-B-E2 ~19**, **T4-A-E3 ~19**, **T2-A-E2 ~20** | Corrective loop thin for deliberate practice | **P2** (with collapse pairs, rewrite feedback) |
| **I Do `retrospective` soft floor** | **T3-A ~20** (worst), **T2-A ~29**, **T3-B ~26**, **T4-B ~30**, **T4-A ~31**, **T1-B ~33**, **T2-B ~33** | Bridge + principle present; misconception/self-check often absent | **P2** (only densest: T3-A required; others optional) |
| **I Do preamble slightly under 80-word prose floor** | Most demos ~56–77 w prose (not bullets); content already strong | Usable; do **not** bulk-pad | **P2** optional (only if Fixer batches a unit) |
| **E2 hints near-complete solution** | **T1-A-E2**, **T2-A-E2**, **T3-A-E2**, **T4-A-E2** first hint = almost the answer line | Independent tier becomes paste; preamble already states success | **P2** (soften first hint; keep second progressive) |
| **You Do shell** | context / objectives / requirements / rubric / portfolioNote + retrospective present | Defense frame strong; success phrase already in context | **—** |
| **Exact outputs / solutions** | Canonical strings aligned to theory and CP-N2-C | Fixer must not “polish” solution strings or outputs | residual risk — **keep** |
| **Titles 4–12 words** | All 24 titles in range | No residual | **—** |
| **Two output contracts** | Clasificador `{model,label,score}` vs narrativo `{hallazgo,n,mediana,…}` separated in demos/preambles | Newbie risk if Fixer collapses prose | residual risk — **keep separation** |

**Section severity theme (Round 2):** shell is solid; **P1** only where learning integrity is at risk (**feedback = retrospective** on clear pairs). Most of the rest is **P2 polish**. Do **not** bulk-rewrite every preamble just to hit 80 words — 4-bullet form already satisfies the spec alternative.

Scoring key for residual quality (true newbie):
- **Strong** — checklist solid; lengths OK or bullets complete; no spoiler; misconception + transfer clear; feedback ≠ retro
- **Adequate** — usable; small nits only
- **Needs residual** — spoiler, role collapse, missing piece for newbie, or clear length/role failure

When **no residual text** is proposed: Fixer may leave the unit unchanged.

---

## Unit ledger

### I Do

### S25-T1-A-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Strong** · retrospective **Strong**
- **Checklist:** context pass · goal pass · success pass (predice tres stacks) · constraints pass · retrospective pass
- **Diagnosis:** R1 prose landed. Newbie watches branch order (rules before LLM); misconception “siempre LLM” is explicit. No integrity gap.
- **Severity:** —
- **Proposed residual:** none required
- **Code/output changes:** none

### S25-T1-B-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Strong** · retrospective **Adequate** (~33 w; light self-check)
- **Checklist:** all pass; retro bridge-heavy
- **Diagnosis:** “Apache no anula `not_for`” is the right misconception. Optional self-check on blocks_fraud source.
- **Severity:** optional P2
- **Proposed residual `retrospective` (full text):**  
  Si puedes explicar por qué una licencia permisiva no anula `not_for`, ya tienes el hábito de gobernanza de modelos. El error clásico es “Apache-2.0 = uso libre de fraude”. Pregunta: ¿de dónde sale `blocks_fraud` en el dict — de la licencia o de membership en `not_for`? We Do: reuso de licencia, host con PII y gate combinado de la card.
- **Code/output changes:** none

### S25-T2-A-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Strong** · retrospective **Adequate** (~29 w)
- **Diagnosis:** Contract keys + case-insensitive prediction targets are clear. Optional self-check on second line label.
- **Severity:** optional P2
- **Proposed residual `retrospective` (full text):**  
  Si puedes explicar por qué el dict lleva `model` en cada item, ya entiendes el contract test del adapter. El error clásico es confiar en el label suelto o confundir este schema con el narrativo del You Do. Pregunta: ¿qué label y score predices para “Hola mundo”? We Do: normalizar case, completar keys y batch con score.
- **Code/output changes:** none

### S25-T2-B-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Strong** · retrospective **Adequate** (~33 w)
- **Diagnosis:** Miss/hit + three timeouts + circuit_open is dense and well framed. No integrity gap.
- **Severity:** —
- **Proposed residual:** none required
- **Code/output changes:** none

### S25-T3-A-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Strong** · retrospective **Needs residual** (~20 w; under floor; thin misconception)
- **Checklist:** context/goal/success pass · retrospective partial (bridge only)
- **Diagnosis:** Worked example of schema gate is strong, but retro is a two-line bridge without self-check. Newbie needs “texto bonito ≠ promote” restated after the demo.
- **Severity:** P2
- **Proposed residual `retrospective` (full text):**  
  Schema first: sin keys required no hay promote, aunque el texto “se vea bien”. El error clásico es publicar el string crudo o confiar en constrained decoding del proveedor. Pregunta: si falta `mediana` en el JSON, ¿qué debe pasar en el desk del VP? We Do: parsear raw, comprobar subset y fallar cerrado.
- **Code/output changes:** none

### S25-T3-B-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Adequate** (~38 w soft edge) · retrospective **Adequate** (~26 w)
- **Diagnosis:** Deny-stop prediction is excellent. Optional expand retro with self-check on allowlist contents.
- **Severity:** optional P2
- **Proposed residual `retrospective` (full text):**  
  Si puedes explicar por qué deny corta el plan, ya tienes el hábito de checkpoints. El error clásico es loguear `shell_rm` como ok o seguir el plan ciego. Pregunta: ¿qué tools del lab están en allow y por qué `think` es excepción? We Do: dict de auditoría, len(log) y break al denegar.
- **Code/output changes:** none

### S25-T4-A-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Strong** · retrospective **Adequate** (~31 w)
- **Diagnosis:** schema_ok True + exact False is the right misconception. No integrity gap.
- **Severity:** —
- **Proposed residual:** none required
- **Code/output changes:** none

### S25-T4-B-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Strong** · retrospective **Adequate** (~30 w)
- **Diagnosis:** tools=[] + HITL over regex is clear. No integrity gap for Round 2.
- **Severity:** —
- **Proposed residual:** none required
- **Code/output changes:** none

---

### We Do — T1-A

### S25-T1-A-E1 (weDo, guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Adequate** (~25 w)
- **Checklist:** context/goal/success/constraints pass · retrospective pass (light length)
- **Diagnosis:** Guided fade OK; instruction names branches (acceptable for E1). Feedback explains failed branch order without pasting solution code. Retro short but has misconception + transfer.
- **Severity:** optional P2 (expand retro only if batching T1-A)
- **Proposed residual `retrospective` (full text):**  
  El orden de ramas es el control de costo y auditoría del desk: determinista primero, LLM solo con schema. El error clásico es “siempre LLM”. Pregunta: ¿qué imprime el árbol si solo `needs_language` es True y no hay validator? Siguiente (E2): umbral de specialized con n_train realista.
- **Code/output changes:** none

### S25-T1-A-E2 (weDo, independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Adequate** · retrospective **Adequate**
- **Diagnosis:** Threshold bug is the right independent drill. Mild echo: feedback and retro both “bug silencioso de política”. First hint pastes the full `if` line.
- **Severity:** P2
- **Proposed residual `feedback` (full text):**  
  Con n=800 el umbral de la teoría T1-A es 500, no 1000. Si salió `other`, el starter sigue con el umbral inventado: el desk excluye specialized aunque el train sea suficiente.
- **Proposed residual `retrospective` (full text):**  
  El umbral documentado es contrato de lab, no un número “de moda”. Confundir 1000 con 500 cambia el stack sin que el test de negocio lo grite. Luego (E3) fijas metadata sin autofraude aunque el stack sea LLM.
- **Proposed residual hints (optional):** first hint → “Compara el umbral del starter con el de la demo/teoría T1-A (no inventes otro número).” Keep second progressive.
- **Code/output changes:** none

### S25-T1-A-E3 (weDo, transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Needs residual** (~14 w) · retrospective **Strong**
- **Diagnosis:** Transfer to policy metadata is excellent; retro has self-check. Feedback is under floor and only restates the fixed policy without diagnosing the starter’s conditional bug.
- **Severity:** P2
- **Proposed residual `feedback` (full text):**  
  Si `auto_fraud` salió True, el starter aún amarra el flag a `stack == 'llm_structured'`. En CP-N2-C **ningún** stack autoetiqueta: metadata fija `auto_fraud=False` y `policy='no_auto_fraud'` para el path del assist.
- **Code/output changes:** none

---

### We Do — T1-B

### S25-T1-B-E1 (weDo, guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Adequate** · retrospective **Adequate** (~28 w)
- **Diagnosis:** Inverted license set is clean guided. No integrity gap.
- **Severity:** —
- **Proposed residual:** none required
- **Code/output changes:** none

### S25-T1-B-E2 (weDo, independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Needs residual** · retrospective **Needs residual**
- **Diagnosis:** **Role collapse:** feedback and retrospective share the same core claim (“PII viva fuerza local/VPC… control de exfiltración, no preferencia de infra”). Newbie hears one idea twice; no metacognitive close.
- **Severity:** P1
- **Proposed residual `feedback` (full text):**  
  Si imprimiste `cloud_ok` con `has_pii=True`, la rama del starter está invertida: con PII viva el curso prohíbe endpoint público. Debe salir `local_or_private_vpc` (control de exfiltración, no “preferencia de cloud”).
- **Proposed residual `retrospective` (full text):**  
  PII viva fuerza local o VPC: el desk no “elige infra por gusto”. Sintéticos sin PII pueden ser `cloud_ok` si licencia e intended use lo permiten. Pregunta: ¿por qué DPA y minimización siguen obligatorios aunque el host sea cloud_ok? Luego (E3) unes licencia y `not_for` en un solo `card_gate`.
- **Code/output changes:** none

### S25-T1-B-E3 (weDo, transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Needs residual** · retrospective **Strong** (self-check good; shares opening with feedback)
- **Diagnosis:** **Role collapse on opening phrase:** feedback ends with “Un gate compuesto es lo que auditas en metadata del run” = retro start. Retro’s biometric self-check is good — keep and rewrite feedback.
- **Severity:** P1
- **Proposed residual `feedback` (full text):**  
  Si ambos flags salieron False, hardcodeaste el gate: lee `card['license']` (set mit/apache-2.0) y membership de `'fraud adjudication'` en `not_for`. Licencia permisiva no apaga el bloqueo de fraude.
- **Proposed residual `retrospective`:** keep current (self-check on biometric is strong) **or** drop the duplicated first sentence if feedback is rewritten as above:
  El error clásico es hardcodear False o confundir intended use con not_for. Un gate compuesto es lo que auditas en metadata del run. Pregunta: ¿por qué biometric id en not_for también bloquearía un uso fuera de scope?
- **Code/output changes:** none

---

### We Do — T2-A

### S25-T2-A-E1 (weDo, guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Adequate** (~18 w short)
- **Diagnosis:** Dual defect (case + model key) well scaffolded. Retro under floor but clear transfer.
- **Severity:** P2
- **Proposed residual `retrospective` (full text):**  
  Case-insensitive evita falsos “other”; la clave `model` hace auditable el artefacto del mock. El error clásico es imprimir solo el string label. Siguiente (E2): completar el dict mínimo del contrato sin confundir `model_id` (variable) con `model` (key).
- **Code/output changes:** none

### S25-T2-A-E2 (weDo, independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Adequate** · retrospective **Needs residual** (~19 w)
- **Diagnosis:** Naming contract vs variable is the right independent point. Retro is a one-liner + transfer. First hint pastes full print.
- **Severity:** P2
- **Proposed residual `retrospective` (full text):**  
  Naming de variable ≠ naming de contrato: la key de salida es `model`, aunque el parámetro se llame `model_id`. El error clásico es omitir la key o publicarla como `model_id` en el JSON. Luego (E3) el batch añade score y lista de dicts como en teoría.
- **Proposed residual hints (optional):** first hint → “El contract test exige dos keys en el dict de salida; una ya está, falta la del identificador del modelo.” 
- **Code/output changes:** none

### S25-T2-A-E3 (weDo, transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Strong**
- **Diagnosis:** Batch transfer aligned to You Do; self-check on score≠fraude. Mild phrase echo with feedback on score — acceptable.
- **Severity:** —
- **Proposed residual:** none required
- **Code/output changes:** none

---

### We Do — T2-B

### S25-T2-B-E1 (weDo, guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Adequate** (~24 w)
- **Diagnosis:** Write-on-miss is well taught. Feedback diagnoses the bug; retro short but OK.
- **Severity:** optional P2
- **Proposed residual `retrospective` (full text):**  
  Escribir en el miss es lo que habilita el hit y evita pagar dos veces el mismo ticket. El error clásico es devolver flags fijos sin mutar `cache`. Pregunta: ¿qué devuelve la tercera llamada a `get('a')` tras un miss+hit correctos? Siguiente (E2): estimar costo por mil tokens.
- **Code/output changes:** none

### S25-T2-B-E2 (weDo, independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Adequate** · retrospective **Adequate** (~21 w)
- **Diagnosis:** Units of billing are clear. Mild thematic echo (inflate /1000) but feedback diagnoses 0.002×500=1.0; retro generalizes — mild P2 only if batching.
- **Severity:** optional P2
- **Proposed residual `retrospective` (full text):**  
  Sin `/1000` confundes “precio por mil tokens” con “precio por token” y la factura del VP miente. El error clásico es multiplicar y redondear a int. Luego (E3) cuentas fallas y abres el circuit breaker sin inventar JSON de éxito.
- **Code/output changes:** none

### S25-T2-B-E3 (weDo, transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Adequate** (~18 w thin) · retrospective **Strong**
- **Diagnosis:** Circuit open transfer is excellent; retro self-check strong. Feedback slightly thin.
- **Severity:** P2
- **Proposed residual `feedback` (full text):**  
  Si imprimiste `llm`, no contaste la falla: en el `except` haz `failures += 1` y decide `circuit_open` si `failures >= OPEN_AFTER` (aquí 3). Reintentar el LLM a ciegas multiplica costo y latencia del desk.
- **Code/output changes:** none

---

### We Do — T3-A

### S25-T3-A-E1 (weDo, guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Adequate** (~22 w)
- **Diagnosis:** loads + issubset guided well. Feedback distinguishes raw vs metrics. Retro short.
- **Severity:** optional P2
- **Proposed residual `retrospective` (full text):**  
  Sin `loads` no hay contrato ni métricas: el gate opera sobre dicts. El error clásico es imprimir el string “bonito” o solo `n` sin el flag. Siguiente (E2): issubset con keys extra permitidas (dirección required ⊆ keys).
- **Code/output changes:** none

### S25-T3-A-E2 (weDo, independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Adequate** (names exact API — necessary for the defect) · feedback **Strong** · retrospective **Adequate** (~22 w)
- **Diagnosis:** issuperset-on-string is a strong independent misconception. First hint pastes full solution.
- **Severity:** P2
- **Proposed residual `retrospective` (full text):**  
  issubset (required ⊆ keys) es la dirección correcta; issuperset o validar el string mienten y pueden fallar con keys extra legítimas. El error clásico es “el JSON se ve completo”. Luego (E3) el gate publica `schema_fail` si falta mediana.
- **Proposed residual hints (optional):** first hint → “Parsea primero; la dirección del set es required respecto de las keys del objeto, no al revés.”
- **Code/output changes:** none

### S25-T3-A-E3 (weDo, transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Adequate** · retrospective **Strong**
- **Diagnosis:** Fail-closed transfer with self-check. Mild thematic overlap with feedback on schema_fail — acceptable.
- **Severity:** —
- **Proposed residual:** none required
- **Code/output changes:** none

---

### We Do — T3-B

### S25-T3-B-E1 (weDo, guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Adequate** (~20 w)
- **Diagnosis:** Deny dict shape is clear. Retro short; mild theme echo with feedback on “evidencia del checkpoint”.
- **Severity:** P2
- **Proposed residual `retrospective` (full text):**  
  El dict de deny (status + name) es evidencia del checkpoint, no un print cosmético. El error clásico es devolver un string suelto o invertir ok/deny. Siguiente (E2): registrar pasos permitidos en un log con `len(log)`.
- **Code/output changes:** none

### S25-T3-B-E2 (weDo, independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Needs residual** · retrospective **Needs residual**
- **Diagnosis:** **Role collapse (phrase paste):** feedback ends with “El log es evidencia del plan, no un contador mágico.” = entire retrospective start. Must differentiate.
- **Severity:** P1
- **Proposed residual `feedback` (full text):**  
  Si imprimiste `0`, el `for` no appendeó: registra `think` y los pasos en `allow` como dicts `{step, ok}` y al final `print(len(log))`. No hardcodes `2` sin recorrer `steps`.
- **Proposed residual `retrospective` (full text):**  
  El log es evidencia del plan: el VP puede auditar qué se intentó. El error clásico es un contador mágico o un `pass` vacío. Pregunta: si `steps` incluyera `shell_rm`, ¿sumaría un ok? Luego (E3) detienes el plan al denegar.
- **Code/output changes:** none

### S25-T3-B-E3 (weDo, transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Strong**
- **Diagnosis:** Stop+break transfer mirrors I Do; self-check strong. Mild “shell libre” echo — acceptable.
- **Severity:** —
- **Proposed residual:** none required
- **Code/output changes:** none

---

### We Do — T4-A

### S25-T4-A-E1 (weDo, guided)
- **Scores:** title **Strong** · preamble **Adequate** (bullets short; success exact) · instruction **Strong** · feedback **Needs residual** · retrospective **Needs residual** (~17 w)
- **Diagnosis:** **Role collapse:** both use “hardcodear métricas engaña al VP”. Feedback thin; retro under floor.
- **Severity:** P1
- **Proposed residual `feedback` (full text):**  
  Si exact o schema_ok salieron False con dicts idénticos, no uses literales: calcula `exact = pred == gold` y `schema_ok = all(k in pred for k in required)`. Un dict de métricas inventado miente en el gate de promote.
- **Proposed residual `retrospective` (full text):**  
  Comparar pred/gold es el hábito; hardcodear booleans engaña al VP y al golden. El error clásico es “el test ya sabe la respuesta”. Pregunta: ¿schema_ok puede ser True con exact False? Siguiente (E2): acierto por campo cuando n discrepa.
- **Code/output changes:** none

### S25-T4-A-E2 (weDo, independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Adequate** (~26 w)
- **Diagnosis:** field_match_rate vs F1 is well framed. First hint nearly full formula — soften if batching.
- **Severity:** optional P2
- **Proposed residual hints (optional):** first hint → “Promedia igualdad por key en la unión pred∪gold (no F1 de precisión/recall).”
- **Code/output changes:** none

### S25-T4-A-E3 (weDo, transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Needs residual** · retrospective **Strong** (self-check; shares open with feedback)
- **Diagnosis:** **Role collapse on opener:** “Fail-closed al schema es el gate de CP-N2-C” appears in both. Keep retro self-check; rewrite feedback.
- **Severity:** P1
- **Proposed residual `feedback` (full text):**  
  Si salió `auto_candidate`, no validaste que **todas** las required (incluido `mediana`) estén en pred. Con el fixture incompleto el path correcto es `human_review`, no promover y “revisar después”.
- **Proposed residual `retrospective`:** keep current self-check version (drop duplicated first sentence if desired):  
  El error clásico es “promover siempre y revisar después”. Fail-closed al schema es el gate de CP-N2-C. Pregunta: ¿por qué auto_candidate aún requiere golden en el You Do?
- **Code/output changes:** none

---

### We Do — T4-B

### S25-T4-B-E1 (weDo, guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Needs residual** · retrospective **Needs residual**
- **Diagnosis:** **Role collapse:** both center “regex/signal = telemetría; tools=[] + HITL = control”. Dual skill (signal + request) needs feedback that diagnoses the starter’s two bugs separately.
- **Severity:** P1
- **Proposed residual `feedback` (full text):**  
  Dos fallas típicas del starter: (1) membership case-sensitive no ve “IGNORE”; (2) no armas `request_for` con tools vacíos, max 160 y HITL. Imprime las dos líneas de política; no basta un solo `print(signal)`.
- **Proposed residual `retrospective` (full text):**  
  Signal es telemetría; tools=[] + HITL + untrusted_document son el control real. El error clásico es confiar solo en el regex o elevar el doc a system. Pregunta: si el regex no dispara, ¿la request sigue siendo segura? Siguiente (E2): minimize sin secretos.
- **Code/output changes:** none

### S25-T4-B-E2 (weDo, independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Needs residual** · retrospective **Needs residual**
- **Diagnosis:** **Role collapse:** “Minimización es control de exfiltración” in both. Skill is solid; prose roles blur.
- **Severity:** P1
- **Proposed residual `feedback` (full text):**  
  Si `api_key` aparece en la salida, `minimize` aún hace `return payload`. Filtra: solo keys de `allow` que existan en el payload. El secreto no debe llegar al contexto del modelo.
- **Proposed residual `retrospective` (full text):**  
  Minimización es control de exfiltración, no estética del JSON. El error clásico es reenviar el payload completo “por si el modelo lo necesita”. Pregunta: ¿qué pasa con una key permitida ausente del payload? Luego (E3) la decisión nunca devuelve `fraud` por score alto.
- **Code/output changes:** none

### S25-T4-B-E3 (weDo, transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Strong**
- **Diagnosis:** Ethical climax of the section; feedback diagnoses fraud branch; retro self-check on `decision(0.99, False)` is excellent. No residual required.
- **Severity:** —
- **Proposed residual:** none required
- **Code/output changes:** none

---

### You Do

### youDo (proyecto: Asistente JSON evaluado · CP-N2-C)
- **Scores:** context **Strong** · objectives **Strong** · requirements **Strong** · rubric **Strong** · retrospective **Strong** · portfolioNote **Strong**
- **Checklist:** context pass · goal pass · success pass (rubric + success phrase in context) · constraints pass · retrospective pass
- **Diagnosis:** R1 shell complete. Multi-check retrospective (eval_golden invariant, fail-closed paths, 30s README claim, S26 bridge) matches You Do exemplar. No residual rewrite needed; do not touch starter/GOLDEN outputs.
- **Severity:** —
- **Proposed residual:** none required
- **Code/output changes:** none

---

## Priority order

### P1 (feedback ≠ retrospective — learning integrity)
1. **S25-T1-B-E2** — rewrite feedback + retrospective (PII / exfiltración paste)
2. **S25-T1-B-E3** — rewrite feedback (gate compuesto paste); keep retro self-check
3. **S25-T3-B-E2** — rewrite feedback + retrospective (log/contador mágico paste)
4. **S25-T4-A-E1** — rewrite feedback + retrospective (hardcodear métricas paste)
5. **S25-T4-A-E3** — rewrite feedback (fail-closed gate paste); keep retro self-check
6. **S25-T4-B-E1** — rewrite feedback + retrospective (telemetría/control paste)
7. **S25-T4-B-E2** — rewrite feedback + retrospective (minimización paste)

### P2 (length, thin feedback, optional I Do, soft hints)
1. **S25-T3-A-DEMO** retrospective expand (worst I Do ~20 w)
2. **S25-T1-A-E3** feedback expand (~14 w)
3. **S25-T2-B-E3** feedback expand
4. Short We Do retros: **T2-A-E1**, **T2-A-E2**, **T3-B-E1**, and optional T1-A-E1 / T2-B-E1 / T3-A-E1
5. Mild echo polish: **T1-A-E2** feedback/retro
6. Optional I Do retros: T1-B, T2-A, T3-B
7. Soften first hints on independent: T1-A-E2, T2-A-E2, T3-A-E2, T4-A-E2 (if Fixer touches those units)

### Leave unchanged unless batching
- All units scored **Strong** with no residual: T1-A-DEMO, T2-B-DEMO, T4-A-DEMO, T4-B-DEMO, T1-B-E1, T2-A-E3, T3-A-E3, T3-B-E3, T4-B-E3, youDo
- Canonical `solutionCode` / `output` / starter bugs: **do not change** without execute-and-diff

---

## Residual risks

1. **Nombre de archivo vs contenido:** `s25-streamlit-dashboards.ts` / id `streamlit-dashboards` vs título de IA endpoints — desorientación de navegación; fuera de scope de prose de ejercicios.
2. **Dos contratos de salida:** clasificador vs narrativo — preambles actuales los separan; no colapsar prose genérica al reescribir feedback/retro.
3. **Hints casi-solución en E1:** aceptable en guided; al tocar E2 no pegar el mismo código en instruction y feedback.
4. **Longitudes:** no bulk-pad preambles 4-bullet para “llegar a 80 palabras”; expandir solo retros/feedback con colapso o &lt;25–30 w.
5. **Outputs canónicos:** no se proponen cambios de `solutionCode.output`.
6. **Anti-aberración en el Fix:** reescribir solo las unidades P1 y P2 prioritarias a mano; no generar 24 retros con un script.

---

## Counts summary for Fixer (Round 2)

| Tipo | Unidades | Shell fields present | Primary residual work |
|------|----------|----------------------|------------------------|
| iDo | 8 | 8/8 preamble+retro | P2: T3-A retro; optional 3 demos |
| weDo | 24 | 24/24 title+preamble+instruction+retro | **P1:** 7 role-collapse pairs; P2: thin fb / short ret / soft hints |
| youDo | 1 | retrospective present | none |

**Código/starter/outputs:** maduros; foco del Fix R2 = desacoplar **feedback** (diagnóstico del intento fallido) de **retrospective** (principio + misconception + transfer/self-check), y expandir los peores cortos.

Section 25 exercise pedagogy review complete. Ready for the Fixer prompt.
