# S25 Exercise Pedagogy Report (Round 1)

## Section
- **title:** Endpoints de IA, Hugging Face y prompting evaluado
- **shortTitle:** IA endpoints y prompts
- **id:** `streamlit-dashboards` (archivo `s25-streamlit-dashboards.ts`; contenido = stack IA / mock HF / prompting / evals — no dashboards Streamlit)
- **index:** 25
- **source:** `src/lib/course/sections/s25-streamlit-dashboards.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades de práctica/demo)
- **subtemas:** S25-T1-A stack rules/specialized/LLM · T1-B model card/licencia/host · T2-A mock HF contrato · T2-B batch/caché/costo/circuit · T3-A prompt+schema JSON · T3-B tools/checkpoints · T4-A golden/schema/field_match · T4-B injection/minimize/no-fraude
- **hilo de caso:** asistente de IA **CP-N2-C** (desk riesgos sintético Lima; campos OCR de S24 como contexto no confiable; fixture `CASO-LIM-025`; score ≠ fraude; fail-closed a `human_review`)

## Method
- Leído `PEDAGOGY_EXERCISE_SPEC.md` (campos, longitudes, checklist preamble/retrospective, fade E1→E2→E3).
- Inspeccionado manualmente cada `iDo.steps[]` (demos ~371–595), `weDo.steps[]` (~597–1555) y `youDo` (~1557–1650) en `s25-streamlit-dashboards.ts`.
- Contrastado con el hilo de la sección: decisión de stack, model card, adapter mock HF, ops de inferencia, schema narrativo, allowlist de tools, golden metrics, request segura; sin PII real; `auto_fraud=False`.
- **Sin** generadores, bucles, plantillas ni copy-paste mecánico entre unidades.
- Prosa propuesta en **español profesional peruano**, un objetivo primario por unidad.

## Hallazgos transversales (antes del ledger)

| Campo / hábito | Estado actual en S25 |
|----------------|----------------------|
| I Do `preamble` | **Ausente** en las 8 demos |
| I Do `retrospective` | **Ausente** en las 8 demos |
| I Do `description` | Presente y técnica; nombra el skill pero no sustituye preamble formal |
| I Do `why` | Presente; casi siempre **1 frase** (bajo el piso 40–90 palabras del spec) |
| We Do `title` | **Ausente** en los 24 |
| We Do `preamble` | **Ausente** en los 24 |
| We Do `retrospective` | **Ausente** en los 24 |
| We Do `instruction` | Estilo denso “ID · fixture + bug + Salida exacta: …” embebido: meta, éxito y a veces límites en un solo párrafo; legible para quien ya opera endpoints de IA, **opaco** para newbie sin escena de desk Lima |
| We Do `feedback` | 1 frase; nombra el bug (bien); poco *por qué importa al VP / al costo cloud / al HITL* |
| Starter `# Bug:` | **Excelente** hábito en todos; defectos bien nombrados y alineados a la solución |
| Hints | E1 casi-solución (aceptable); E3 a veces da la fórmula casi completa (andamiaje mínimo OK para transfer) |
| You Do marco | `context` / `objectives` / `requirements` / `rubric` / `portfolioNote` / starter **sólidos** y con política fail-closed |
| You Do `retrospective` | **Ausente** |
| Código / outputs | Coherentes con theory y CP-N2-C; **no** proponer cambios de output salvo notas puntuales |

**Patrón dominante:** el andamiaje de *código* (bugs nombrados, outputs canónicos, fade real E1→E3 por subtema, política `auto_fraud=False` / `signal_only` / `human_review`) es maduro y alineado al asistente de IA. El andamiaje *pedagógico verbal* (preamble → instruction solo-tarea → retrospective) no existe. Un true newbie no responde con claridad: qué practico, por qué importa en un desk de riesgos en Lima, cómo sé que gané, qué debe quedarme al cerrar la pestaña.

**Fade E1→E2→E3 (contenido):** progresión real por subtema (p. ej. T1-A: árbol rules → umbral specialized 500 → metadata sin autofraude; T2-A: primer item case-insensitive → dict model/label → batch model/label/score; T3-A: parse+n → issubset → schema_fail; T4-B: request segura → minimize → score≠fraude). **No** son tres clones con números distintos. El fade de *prosa* no se ve porque no hay preambles diferenciados.

**Severity default:** missing preamble+title+retrospective en We Do = **P0**; I Do sin preamble/retrospective = **P1** (aún tienen description+why+código); youDo sin retrospective = **P1**; polish de feedback/why = **P2** si caen preamble/instruction/retrospective.

---

## Unit ledger

### S25-T1-A-DEMO (iDo)
- **Diagnosis:** Worked example sólido del árbol `choose_stack` sobre tres tickets (rules → specialized_model → llm_structured). La `description` nombra el skill; falta `preamble` que diga *qué observar* (orden de ramas: determinista antes de pagar LLM) y `retrospective` del misconception “si hay un LLM disponible, úsalo siempre”. El `why` es una frase.
- **Checklist:** context fail · goal partial · success partial (output visible) · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  En el desk sintético Lima, cada ticket del assist decide un stack *antes* de gastar tokens. En esta demo el árbol evalúa tres casos: uno determinista con patrones conocidos, uno con label set fijo y 800 ejemplos, y uno que necesita lenguaje con validador de schema. No escribas aún: predice las tres cadenas de salida y nota el orden de las ramas — si el ticket es determinista, no pagas un LLM. El path nunca elige “fraude automático”.
- **Proposed instruction/description improvements:**  
  Mantener description. Ampliar `why` (~50–70 palabras): `choose_stack` deja rastro auditable del stack; las ramas son mutuamente prioritarias (rules primero); specialized exige label fijo y n_train≥500; llm_structured solo con schema validator; si nada calza, `human`. Puente a We Do: implementar el árbol, corregir umbral specialized y fijar metadata sin autofraude.
- **Proposed retrospective:**  
  Si puedes explicar por qué un ticket determinista no va a LLM sin mirar el código, ya tienes el hábito de selección de stack. El error clásico es saltar a `llm_structured` por moda. En We Do practicarás el árbol completo, el umbral 500 y la política `auto_fraud=False`.
- **Code/output changes:** none
- **Validation notes:** Output `rules / specialized_model / llm_structured` alineado a theory T1-A.

---

### S25-T1-A-E1 (weDo, guided)
- **Diagnosis:** Drill guiado claro: starter siempre devuelve `llm_structured`. Instruction densa mezcla ID, ramas del árbol y salida exacta; sin title, preamble ni retrospective. Feedback nombra el bug pero no ancla “por qué el desk no debe pagar LLM en tickets de reglas”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Árbol choose_stack: rama rules primero
- **Proposed preamble:**  
  - **Contexto:** en CP-N2-C un ticket determinista con patrones conocidos no debe ir al LLM: el VP quiere auditabilidad barata.  
  - **Meta:** implementar `choose_stack` con las cuatro ramas de la teoría (rules → specialized → llm_structured → human).  
  - **Éxito:** imprime exactamente `rules` para el ticket del fixture.  
  - **Límites:** no dejes el return fijo a `llm_structured`; no inventes una quinta rama; no etiquetes fraude.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `choose_stack` ignora flags y devuelve siempre `llm_structured`.  
  2. Implementa las cuatro ramas en orden (deterministic+patterns_known → rules; fixed+n≥500 → specialized; language+schema → llm_structured; else human).  
  3. Evalúa el ticket del fixture e imprime solo el stack.  
  4. No mutes el ticket ni agregues texto extra.
- **Proposed feedback improvement:**  
  Si salió `llm_structured`, la rama determinista no se evaluó antes del fallback. Un ticket con `deterministic` y `patterns_known` es `rules`: barato, reproducible y auditable en el desk Lima.
- **Proposed retrospective:**  
  El orden de ramas es el control de costo y auditoría. El error clásico es “siempre LLM”. Siguiente (E2): umbral de specialized con n_train realista.
- **Code/output changes:** none
- **Validation notes:** Bug bien nombrado; solution y output `rules` correctos.

---

### S25-T1-A-E2 (weDo, independent)
- **Diagnosis:** Bug de umbral (1000 vs 500) excelente para independiente. Instruction ya nombra n=800 y specialized; falta escena de “por qué el umbral de la teoría importa al presupuesto de train” y cierre metacognitivo.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Specialized model con n_train ≥ 500
- **Proposed preamble:**  
  - **Contexto:** el desk elige modelo especializado cuando el label set es fijo y hay volumen de train suficiente (≥500 en el lab).  
  - **Meta:** corregir el umbral de `choose_stack` para devolver `specialized_model` con n_train=800.  
  - **Éxito:** imprime exactamente `specialized_model`.  
  - **Límites:** umbral 500 (no 1000); no inventes otra rama; ticket no determinista.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: umbral `n_train >= 1000` (bug).  
  2. Baja el umbral a `>= 500` como en la teoría T1-A.  
  3. Imprime solo el stack del ticket.  
  4. No cambies los flags del ticket.
- **Proposed retrospective:**  
  El umbral documentado en teoría es el contrato del lab: 800 ejemplos con fixed labels → specialized. Confundir 1000 con 500 es un bug silencioso de política. Luego (E3) fijas metadata sin autofraude aunque el stack sea LLM.
- **Code/output changes:** none
- **Validation notes:** E2 con menos migas que E1; éxito observable intacto.

---

### S25-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transferencia real a metadata de run (`auto_fraud=False`, `policy='no_auto_fraud'`). Starter autoetiqueta fraude con LLM — anti-patrón excelente y central al curso. Falta preamble de política del assist y retrospective “score ≠ veredicto”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Metadata de run sin autofraude
- **Proposed preamble:**  
  - **Contexto:** en CP-N2-C ningún stack (ni `llm_structured`) etiqueta fraude solo: el modelo emite señales; el humano decide.  
  - **Meta:** `run_meta(stack)` debe fijar `auto_fraud=False` y `policy='no_auto_fraud'` para cualquier stack.  
  - **Éxito:** `{'stack': 'llm_structured', 'auto_fraud': False, 'policy': 'no_auto_fraud'}`.  
  - **Límites:** no pongas `auto_fraud=True` si el stack es LLM; no inventes otras keys.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: el starter pone `auto_fraud` según `stack == 'llm_structured'`.  
  2. Devuelve siempre `auto_fraud=False` y `policy='no_auto_fraud'`.  
  3. Imprime el dict de `run_meta('llm_structured')`.  
  4. Conserva la key `stack`.
- **Proposed retrospective:**  
  La metadata del run es evidencia de política: LLM ≠ veredicto. El error clásico es “score alto → fraude en metadata”. Pregunta: ¿por qué HITL sigue obligatorio aunque el stack sea `rules`?
- **Code/output changes:** none
- **Validation notes:** Transfer auténtico; alineado a ética de sección y You Do.

---

### S25-T1-B-DEMO (iDo)
- **Diagnosis:** Demo clara de `hosting_policy` (host local, blocks_fraud, license). Description OK; falta preamble de “lee la card antes de desplegar” y retrospective del misconception “licencia permisiva = uso libre de fraude”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Antes de llamar al modelo, el analista del desk Lima lee la model card: licencia, intended use y `not_for`. En esta demo `hosting_policy` elige host local, marca si se bloquea adjudicación de fraude y expone la licencia apache-2.0. No escribas: predice el dict de salida y nota que `blocks_fraud` viene de membership en `not_for`, no de la licencia. Apache-2.0 no te autoriza a saltarte `not_for`.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: host local por default en el lab; `not_for` es política de uso, no decoración; licencia y ética son ejes distintos. Puente a We Do: license_reuse, deploy con PII y card_gate compuesto.
- **Proposed retrospective:**  
  Si puedes explicar por qué una licencia permisiva no anula `not_for`, ya tienes el hábito de gobernanza de modelos. We Do: reuso de licencia, host con PII y gate combinado de la card.
- **Code/output changes:** none
- **Validation notes:** Output con `blocks_fraud: True` alineado a theory T1-B.

---

### S25-T1-B-E1 (weDo, guided)
- **Diagnosis:** Lógica invertida en `license_reuse` — defect guiado perfecto. Instruction telegráfica; sin escena de “por qué MIT/Apache permiten reuso en el lab pero no anulan ética”.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Licencia reutilizable: mit y apache-2.0
- **Proposed preamble:**  
  - **Contexto:** el desk registra si la licencia de la card permite reuso comercial básico en el lab.  
  - **Meta:** `license_reuse(lic)` → `reuse_ok` si lic ∈ {mit, apache-2.0}; si no, `review`.  
  - **Éxito:** imprime exactamente `reuse_ok` con lic='mit'.  
  - **Límites:** no inviertas el set; reuse_ok no anula `not_for`.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: devuelve `review` cuando lic está en permisivas (bug invertido).  
  2. Corrige a `reuse_ok` si lic ∈ {mit, apache-2.0}, si no `review`.  
  3. Imprime el resultado de `license_reuse('mit')`.  
  4. No agregues otras licencias al set del lab.
- **Proposed retrospective:**  
  MIT/Apache son reuse_ok en el lab; copyleft u otras van a review legal. El error clásico es invertir el set. Siguiente (E2): PII viva fuerza host local.
- **Code/output changes:** none
- **Validation notes:** DEFECT claro; Pass `reuse_ok` correcto.

---

### S25-T1-B-E2 (weDo, independent)
- **Diagnosis:** Bug “cloud con PII” — excelente política de privacidad. Instruction ya nombra local_or_private_vpc; falta preamble de DPA/minimización y retrospective de “sintéticos vs PII viva”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** PII viva: host local o VPC privada
- **Proposed preamble:**  
  - **Contexto:** si hay PII viva, el curso prohíbe endpoint público: local o VPC privada.  
  - **Meta:** `deploy_choice(has_pii=True)` → `local_or_private_vpc`.  
  - **Éxito:** imprime exactamente `local_or_private_vpc`.  
  - **Límites:** no envíes PII a cloud_ok; sintéticos sin PII pueden ser cloud_ok si licencia e intended use lo permiten.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: con PII devuelve `cloud_ok` (bug).  
  2. Invierte: PII → `local_or_private_vpc`; sin PII → `cloud_ok`.  
  3. Imprime `deploy_choice(True)`.  
  4. No inventes un tercer host.
- **Proposed retrospective:**  
  PII viva fuerza local/VPC: control de exfiltración, no “preferencia de infra”. Luego (E3) unes licencia y `not_for` en un solo `card_gate`.
- **Code/output changes:** none
- **Validation notes:** Contrato didáctico alineado a theory T1-B.

---

### S25-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a `card_gate` compuesto (reuse_ok + blocks_fraud). Starter hardcodea False/False — anti-patrón de “ignorar la card”. Falta preamble de auditoría y retrospective “consulta la card, no hardcodes”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** card_gate: licencia y not_for
- **Proposed preamble:**  
  - **Contexto:** la model card del lab (apache-2.0, not_for con fraud adjudication) debe producir un gate auditable antes del deploy.  
  - **Meta:** `card_gate(card)` → `reuse_ok` por licencia y `blocks_fraud` por membership en not_for.  
  - **Éxito:** `{'reuse_ok': True, 'blocks_fraud': True}`.  
  - **Límites:** no hardcodes False; licencia permisiva no anula not_for.
- **Proposed instruction/description improvements:**  
  1. Lee la card del starter (license + not_for).  
  2. Calcula `reuse_ok` con set {mit, apache-2.0}.  
  3. Calcula `blocks_fraud` con `'fraud adjudication' in not_for`.  
  4. Imprime el dict (sin keys extra).
- **Proposed retrospective:**  
  Un gate compuesto es lo que auditas en metadata del run. El error clásico es hardcodear False o confundir intended use con not_for. Pregunta: ¿por qué biometric id en not_for también bloquearía un uso fuera de scope?
- **Code/output changes:** none
- **Validation notes:** Transfer auténtico; alineado a I Do T1-B y You Do metadata.

---

### S25-T2-A-DEMO (iDo)
- **Diagnosis:** Mock HF con dos textos y contrato model/label/score. Description técnica; falta preamble de “mock intercambiable con endpoint real” y retrospective del misconception “sin clave model el adapter igual funciona”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  En producción un `pipeline` de HF o un Inference Endpoint devuelven label/score; tu adapter añade `model` y fija el contrato. En esta demo un mock por keyword (“factura” → billing) procesa dos textos sintéticos. No escribas: predice model, label y score de cada línea y nota que el case-insensitive y la clave `model` son parte del contract test del lab, no adornos.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: mock y HTTP real deben pasar el mismo test; score no es veredicto de fraude; el borrador narrativo del You Do usa otro schema. Puente a We Do: primer item, dict model/label y batch completo.
- **Proposed retrospective:**  
  Si puedes explicar por qué el dict lleva `model` en cada item, ya entiendes el contract test del adapter. We Do: normalizar case, completar keys y batch con score.
- **Code/output changes:** none
- **Validation notes:** Output de dos dicts alineado a theory T2-A.

---

### S25-T2-A-E1 (weDo, guided)
- **Diagnosis:** Case-sensitive + omite `model` — dos bugs en un starter guiado, bien acotados. Instruction densa; sin escena de “por qué el contract test del mock falla sin model”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Primer item mock HF con model y lower
- **Proposed preamble:**  
  - **Contexto:** el mock del desk clasifica tickets sintéticos; “Factura” debe matchear en minúsculas y el contrato exige clave `model`.  
  - **Meta:** devolver `{model, label}` para t='Factura X' y model='demo'.  
  - **Éxito:** `{'model': 'demo', 'label': 'billing'}`.  
  - **Límites:** usa `t.lower()`; no imprimas solo el string label; no omitas model.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: compara sin `.lower()` e imprime un string suelto.  
  2. Calcula label con `'factura' in t.lower()`.  
  3. Imprime el dict `{model, label}`.  
  4. No agregues score todavía (eso viene en E3).
- **Proposed retrospective:**  
  Case-insensitive evita falsos “other”; `model` hace auditable el artefacto. Siguiente (E2): completar el dict mínimo del contrato.
- **Code/output changes:** none
- **Validation notes:** Dual defect bien nombrado; output canónico correcto.

---

### S25-T2-A-E2 (weDo, independent)
- **Diagnosis:** Omitir `model` en el dict de salida — drill de contrato puro. Instruction ya nombra keys; falta preamble de “variable model_id ≠ clave model” y retrospective de naming.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Dict de contrato: model y label
- **Proposed preamble:**  
  - **Contexto:** el contract test del lab exige las keys `model` y `label` en la salida del mock (no `model_id` en el JSON).  
  - **Meta:** imprimir `{'model': 'demo', 'label': 'other'}`.  
  - **Éxito:** el dict exacto anterior.  
  - **Límites:** no omitas model; la variable puede llamarse model_id, la clave de salida es `model`.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: solo imprime `{'label': label}`.  
  2. Añade la clave `model` con el valor de model_id.  
  3. Imprime el dict completo.  
  4. No renombres la clave a model_id en la salida.
- **Proposed retrospective:**  
  Naming de variable ≠ naming de contrato. Luego (E3) el batch añade score y lista de dicts como en teoría.
- **Code/output changes:** none
- **Validation notes:** Independiente limpio; success exacto.

---

### S25-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer a `mock_pipeline` batch con model/label/score — pieza reutilizable del You Do. Starter colapsa a lista de strings. Falta preamble de “misma forma que theory” y retrospective de contract test por item.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Batch mock HF: model, label y score
- **Proposed preamble:**  
  - **Contexto:** el adapter del assist procesa batches; cada item debe llevar model, label y score para el contract test.  
  - **Meta:** implementar `mock_pipeline` sobre ['Factura X','hola'] con billing/0.9 y other/0.6.  
  - **Éxito:** lista de dos dicts exacta de la solución.  
  - **Límites:** no devuelvas lista de strings; case-insensitive; orden = orden del input.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: solo devuelve `['other', ...]`.  
  2. Por cada texto calcula label y score.  
  3. Append `{model, label, score}`.  
  4. Imprime la lista completa.
- **Proposed retrospective:**  
  El batch con contrato estable es lo que reutilizas en CP-N2-C. El error clásico es colapsar a labels sueltos. Pregunta: ¿por qué el score del mock no se convierte en etiqueta de fraude?
- **Code/output changes:** none
- **Validation notes:** Transfer alineado a theory T2-A y demo.

---

### S25-T2-B-DEMO (iDo)
- **Diagnosis:** Cache miss/hit + tres timeouts + circuit_open — demo operativa densa y valiosa. Falta preamble de “qué observar en el contador de fallas” y retrospective del misconception “reintentar LLM a ciegas arregla el timeout”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Operar el assist no es solo llamar al modelo: es caché, contador de fallas y circuit breaker. En esta demo ves un miss y un hit de caché, luego tres timeouts que dejan `failures=3` y una llamada que ya no martilla el endpoint (`circuit_open`). No escribas: predice el orden de las tres líneas de salida y por qué el fallback es `rules_or_human`, no un JSON inventado de éxito.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: caché evita refacturar el mismo ticket; OPEN_AFTER=3 es el umbral didáctico; circuito abierto sin inventar éxito. Puente a We Do: get miss/hit, estimate_cost y contador con circuit_open.
- **Proposed retrospective:**  
  Si puedes explicar por qué tras 3 fallas no reintentas el LLM, ya tienes el hábito de ops de inferencia. We Do: escribir caché, estimar costo por 1k tokens y abrir el circuito.
- **Code/output changes:** none
- **Validation notes:** Output multi-línea alineado a theory T2-B.

---

### S25-T2-B-E1 (weDo, guided)
- **Diagnosis:** Cache que no escribe — defect guiado clásico y claro. Instruction ya describe miss/hit; falta escena de costo cloud y retrospective de “segunda llamada sin escribir cache”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Caché: miss luego hit
- **Proposed preamble:**  
  - **Contexto:** re-procesar el mismo ticket sin caché multiplica la factura cloud del desk.  
  - **Meta:** `get(x)` devuelve (valor, cached); primera 'a' → miss, segunda → hit.  
  - **Éxito:** `('ok', False) ('ok', True)`.  
  - **Límites:** en el miss debes escribir `cache[x]`; no imprimas solo True/False sueltos.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: siempre `('ok', False)` sin escribir cache.  
  2. Si x en cache → return valor, True; si no, guarda 'ok' y return 'ok', False.  
  3. Imprime `get('a'), get('a')` en una línea.  
  4. No uses otra key distinta de 'a'.
- **Proposed retrospective:**  
  Escribir en el miss es lo que habilita el hit. El error clásico es devolver flags fijos. Siguiente (E2): estimar costo por mil tokens.
- **Code/output changes:** none
- **Validation notes:** Pass exacto alineado a I Do.

---

### S25-T2-B-E2 (weDo, independent)
- **Diagnosis:** Fórmula de costo sin `/1000` — bug de ops realista. Instruction ya da la fórmula; falta preamble de “subestimar la factura del VP” y retrospective de units.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Costo por 1k tokens con /1000
- **Proposed preamble:**  
  - **Contexto:** el desk estima costo de un batch antes de promover un prompt largo con tools.  
  - **Meta:** `estimate_cost(500, 0.002)` = cost_per_1k * n_tokens / 1000.  
  - **Éxito:** imprime el float `0.001`.  
  - **Límites:** no omitas la división por 1000; no redondees a int.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: multiplica sin `/1000` (devuelve 1.0).  
  2. Corrige la fórmula a `cost_per_1k * n_tokens / 1000`.  
  3. Imprime `estimate_cost(500)`.  
  4. No cambies el default 0.002.
- **Proposed retrospective:**  
  Sin `/1000` inflas el costo mil veces o confundes unidades de billing. Luego (E3) cuentas fallas y abres el circuit breaker.
- **Code/output changes:** none
- **Validation notes:** Independiente limpio; output `0.001` correcto.

---

### S25-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a contador de fallas + circuit_open — reutilizable en You Do. Starter reintenta 'llm' sin contar. Falta preamble de “no martillar el endpoint” y retrospective de fallback.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Timeout: contar fallas y abrir circuito
- **Proposed preamble:**  
  - **Contexto:** con failures=2 y un timeout más, el assist debe abrir el circuito (OPEN_AFTER=3) y no reintentar el LLM.  
  - **Meta:** en el except, incrementar failures e imprimir `circuit_open` o `rules`.  
  - **Éxito:** imprime exactamente `circuit_open`.  
  - **Límites:** no imprimas 'llm'; no inventes JSON de éxito; cuenta antes de decidir.
- **Proposed instruction/description improvements:**  
  1. Lee el starter: en except imprime 'llm' (bug).  
  2. Haz `failures += 1`.  
  3. Si failures >= OPEN_AFTER imprime `circuit_open`; si no, `rules`.  
  4. No rellames al endpoint dentro del except.
- **Proposed retrospective:**  
  Contar fallas y abrir el circuito evita cascadas de costo y latencia. El error clásico es reintentar LLM a ciegas. Pregunta: ¿por qué el fallback no puede ser un JSON inventado de “éxito”?
- **Code/output changes:** none
- **Validation notes:** Transfer alineado a demo T2-B y You Do timeout.

---

### S25-T3-A-DEMO (iDo)
- **Diagnosis:** Schema payload + `json_schema True` — gate mínimo claro. Falta preamble de “sin schema no hay promote” y retrospective del misconception “si el texto se ve bien, publica”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El borrador narrativo del assist solo entra al informe del VP si el JSON cumple keys requeridas. En esta demo se construye un payload con hallazgo/n/mediana/limite, se serializa y se valida con un set de required. No escribas: predice la línea del JSON y por qué `json_schema` es True. Si falta una key, en el flujo real no “arreglas” en silencio: fail-closed.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: este gate es presencia de keys (no motor JSON Schema completo); constrained decoding del proveedor no sustituye validación en código. Puente a We Do: parse+n, issubset con extras, schema_fail.
- **Proposed retrospective:**  
  Schema first: sin keys required no hay promote. We Do: parsear raw, comprobar subset y fallar cerrado cuando falta mediana.
- **Code/output changes:** none
- **Validation notes:** Output JSON + True alineado a theory T3-A.

---

### S25-T3-A-E1 (weDo, guided)
- **Diagnosis:** Imprime raw sin `loads` — defect guiado esencial. Instruction densa con REQUIRED y salida `1 True`; falta escena de “métricas operan sobre dicts” y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Parse JSON y flag de schema
- **Proposed preamble:**  
  - **Contexto:** el modelo devuelve un string; el gate del assist opera sobre un dict parseado.  
  - **Meta:** `json.loads` + comprobar REQUIRED ⊆ keys; imprimir `n` y el booleano.  
  - **Éxito:** `1 True` en una línea.  
  - **Límites:** no imprimas el string raw; no omitas issubset.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: imprime `raw` sin parsear.  
  2. Haz `obj = json.loads(raw)`.  
  3. Imprime `obj['n']` y `REQUIRED.issubset(obj)`.  
  4. No mutes REQUIRED.
- **Proposed retrospective:**  
  Sin loads no hay contrato ni métricas. El error clásico es imprimir el string “bonito”. Siguiente (E2): issubset con keys extra permitidas.
- **Code/output changes:** none
- **Validation notes:** Pass `1 True` correcto.

---

### S25-T3-A-E2 (weDo, independent)
- **Diagnosis:** `issuperset` sobre string crudo — misconception excelente de sets/JSON. Instruction ya advierte; falta preamble de “extras OK, faltantes no” y retrospective de dirección del subset.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Required ⊆ keys (no issuperset al revés)
- **Proposed preamble:**  
  - **Contexto:** el schema del lab permite keys extra; solo falla si falta una required.  
  - **Meta:** parsear raw y comprobar REQUIRED={'h','n'} ⊆ keys del objeto.  
  - **Éxito:** imprime `True`.  
  - **Límites:** no uses issuperset sobre el string; no falles por la key `extra`.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: `REQUIRED.issuperset(raw)` sin loads (bug).  
  2. Parsea a dict.  
  3. Imprime `REQUIRED.issubset(obj)` (o `REQUIRED <= set(obj)`).  
  4. No elimines `extra` del JSON.
- **Proposed retrospective:**  
  issubset (required ⊆ keys) es la dirección correcta; issuperset o validar el string mienten. Luego (E3) el gate publica `schema_fail` si falta mediana.
- **Code/output changes:** none
- **Validation notes:** Independiente pedagógico fuerte.

---

### S25-T3-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer a fail-closed `schema_fail` con raw incompleto — núcleo del You Do. Starter imprime 'ok' sin validar. Falta preamble de “texto bonito no basta” y retrospective de promote.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Schema gate: ok o schema_fail
- **Proposed preamble:**  
  - **Contexto:** el prompt del lab pide hallazgo/n/mediana/limite; un raw sin mediana no se publica al informe del VP.  
  - **Meta:** loads + issubset → `ok` o `schema_fail`.  
  - **Éxito:** imprime exactamente `schema_fail`.  
  - **Límites:** no hardcodes 'ok'; keys extra no salvan una required faltante.
- **Proposed instruction/description improvements:**  
  1. Lee el starter: imprime 'ok' sin validar.  
  2. Parsea raw.  
  3. Si REQUIRED ⊆ obj imprime `ok`; si no, `schema_fail`.  
  4. No inventes la key mediana en el JSON.
- **Proposed retrospective:**  
  Fail-closed es el gate CP-N2-C: sin schema no hay promote. El error clásico es publicar texto que “se ve bien”. Pregunta: ¿qué harías si el JSON ni siquiera parsea?
- **Code/output changes:** none
- **Validation notes:** Transfer alineado a theory T3-A y You Do validate_output.

---

### S25-T3-B-DEMO (iDo)
- **Diagnosis:** Plan con allowlist y stop en shell_rm — demo de checkpoints clara. Falta preamble de “tools = privilegios” y retrospective del misconception “si el plan lista shell_rm, se ejecuta igual”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Cada tool del assist es un privilegio (red, FS, shell). En esta demo un plan con think → calc_sum → shell_rm se corta en denegación: el log muestra stop y no continúa ciego. No escribas: predice el log final y por qué shell_rm no aparece como paso ok. El asistente solo propone borradores; el humano aprueba acciones externas.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: allowlist didáctica; deny = stop; log es evidencia del checkpoint. Puente a We Do: gate deny, log de pasos y stop en plan.
- **Proposed retrospective:**  
  Si puedes explicar por qué deny corta el plan, ya tienes el hábito de checkpoints. We Do: dict de auditoría, len(log) y break al denegar.
- **Code/output changes:** none
- **Validation notes:** Output `['think', 'calc_sum', 'stop']` alineado a theory T3-B.

---

### S25-T3-B-E1 (weDo, guided)
- **Diagnosis:** gate invertido + string suelto en vez de dict de auditoría — dual defect bueno. Instruction densa; falta escena de “por qué el log necesita el name denegado”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tool deny con dict de auditoría
- **Proposed preamble:**  
  - **Contexto:** el checkpoint del assist registra denegaciones con status y name para auditar el stop.  
  - **Meta:** `gate('shell_rm')` → `{'status': 'deny', 'name': 'shell_rm'}` con allow={calc_sum, lookup_metric}.  
  - **Éxito:** el dict exacto anterior.  
  - **Límites:** default deny; no devuelvas un string suelto; no inviertas ok/deny.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: devuelve strings e invierte la lógica.  
  2. Si name not in allow → dict status deny + name.  
  3. Si está en allow → status ok + name.  
  4. Imprime `gate('shell_rm')`.
- **Proposed retrospective:**  
  El dict de deny es evidencia del checkpoint, no un print cosmético. Siguiente (E2): registrar pasos permitidos en un log.
- **Code/output changes:** none
- **Validation notes:** Pass dict correcto.

---

### S25-T3-B-E2 (weDo, independent)
- **Diagnosis:** Log vacío y print(0) — drill de evidencia de plan. Instruction ya pide len=2; falta preamble de “el log es evidencia” y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Log de checkpoints permitidos
- **Proposed preamble:**  
  - **Contexto:** el plan del assist deja rastro de qué pasos se intentaron y pasaron.  
  - **Meta:** con steps=['think','calc_sum'] y allow={calc_sum}, append dicts ok y imprimir len(log)=2.  
  - **Éxito:** imprime el entero `2`.  
  - **Límites:** no dejes log vacío; tool denegado no sumaría ok (aquí no hay deny).
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: `pass` en el for y print(0).  
  2. Por cada paso, si es think o está en allow, append `{'step': s, 'ok': True}`.  
  3. Imprime `len(log)`.  
  4. No hardcodes 2 sin recorrer steps.
- **Proposed retrospective:**  
  El log es evidencia del plan, no un contador mágico. Luego (E3) detienes el plan al encontrar shell_rm.
- **Code/output changes:** none
- **Validation notes:** Independiente limpio.

---

### S25-T3-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a stop+break en plan — espejo del I Do. Starter append de todo sin deny. Falta preamble de “no continuar ciego” y retrospective de tools como privilegios.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Stop y break al denegar shell_rm
- **Proposed preamble:**  
  - **Contexto:** un tool fuera de allowlist no se ejecuta y corta el plan del assist.  
  - **Meta:** con steps=['think','calc_sum','shell_rm'], append 'stop' y break al denegar.  
  - **Éxito:** `['think', 'calc_sum', 'stop']`.  
  - **Límites:** no dejes shell_rm como paso ok; no continúes tras deny.
- **Proposed instruction/description improvements:**  
  1. Lee el starter: append de todos los steps sin filtro.  
  2. Si el paso no es think y no está en allow → append 'stop' y break.  
  3. Si no, append el paso.  
  4. Imprime el log final.
- **Proposed retrospective:**  
  Deny = stop: no hay shell libre en el sandbox del curso. El error clásico es loguear shell_rm como ok. Pregunta: ¿qué tool del lab sí está en allow y por qué calc_sum no basta como “todo permitido”?
- **Code/output changes:** none
- **Validation notes:** Transfer alineado a demo T3-B.

---

### S25-T4-A-DEMO (iDo)
- **Diagnosis:** Eval exact/schema_ok/field_match_rate sobre dos filas — núcleo de promote. Falta preamble de “no promociones demo que suena bien” y retrospective del misconception “schema_ok implica exact”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El assist de CP-N2-C no se promociona sin eval vs. baseline: exact match, schema_ok y acierto por campo. En esta demo dos filas sintéticas muestran perfect match (1.0) y match parcial (0.5) con schema aún True. No escribas: predice por qué la segunda fila no es exact y por qué field_match_rate no es F1 estadístico. El score del clasificador no se convierte en etiqueta de fraude aquí.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: schema y exact son gates distintos; field_match_rate promedia igualdad por key en la unión pred∪gold. Puente a We Do: dict de métricas, 0.5 por campo y promote human_review.
- **Proposed retrospective:**  
  Si puedes explicar por qué schema_ok True con exact False es útil para el revisor, ya usas métricas con juicio. We Do: calcular exact/schema, field_match_rate y el gate de promote.
- **Code/output changes:** none
- **Validation notes:** Outputs de dos dicts alineados a theory T4-A.

---

### S25-T4-A-E1 (weDo, guided)
- **Diagnosis:** exact y schema_ok hardcodeados False — defect guiado simple y claro. Instruction ya pide el dict; falta escena de promote y retrospective de “comparar, no hardcodear”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Exact y schema_ok sobre una fila golden
- **Proposed preamble:**  
  - **Contexto:** el gate de promote del lab exige al menos exact y schema_ok sobre filas golden.  
  - **Meta:** calcular `exact=pred==gold` y `schema_ok=all(k in pred for k in required)`.  
  - **Éxito:** `{'exact': True, 'schema_ok': True}`.  
  - **Límites:** no hardcodes False; un solo print del dict.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: imprime dict con False fijos.  
  2. Calcula exact y schema_ok.  
  3. Imprime el dict de métricas.  
  4. No alteres pred/gold.
- **Proposed retrospective:**  
  Comparar es el hábito; hardcodear métricas engaña al VP. Siguiente (E2): acierto por campo cuando n discrepa.
- **Code/output changes:** none
- **Validation notes:** Pass dict correcto.

---

### S25-T4-A-E2 (weDo, independent)
- **Diagnosis:** field_match_rate hardcodeado 1.0 — excelente para ver match parcial. Instruction ya aclara “no es F1”; falta preamble de utilidad al revisor y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** field_match_rate: acierto por campo
- **Proposed preamble:**  
  - **Contexto:** el revisor necesita saber *qué* campos fallan, no solo un booleano global.  
  - **Meta:** promedio de igualdad por key en pred∪gold con h igual y n distinto → 0.5.  
  - **Éxito:** imprime el float `0.5`.  
  - **Límites:** no uses F1 de precisión/recall; no imprimas 1.0 por “casi igual”.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: imprime 1.0 sin calcular.  
  2. Arma la unión de keys.  
  3. Suma hits donde pred.get(k)==gold.get(k).  
  4. Imprime hits / len(keys).
- **Proposed retrospective:**  
  field_match_rate es un proxy de lab para ver campos rotos; no es F1. Luego (E3) el gate promote envía a human_review si falta una key required.
- **Code/output changes:** none
- **Validation notes:** Independiente alineado a theory T4-A.

---

### S25-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer a `promote` fail-closed — pieza del You Do. Starter siempre auto_candidate. Falta preamble de “schema_fail → HITL” y retrospective de auto_candidate ≠ envío.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Promote: human_review si falta required
- **Proposed preamble:**  
  - **Contexto:** sin keys required (aquí falta mediana), el assist no es auto_candidate: va a human_review.  
  - **Meta:** `promote(pred, required)` fail-closed.  
  - **Éxito:** imprime exactamente `human_review`.  
  - **Límites:** no promociones siempre; auto_candidate no es fraude ni autoenvío.
- **Proposed instruction/description improvements:**  
  1. Lee el starter: siempre `auto_candidate`.  
  2. Si falta alguna required en pred → `human_review`.  
  3. Si no → `auto_candidate`.  
  4. Imprime el resultado con el fixture dado.
- **Proposed retrospective:**  
  Fail-closed al schema es el gate de CP-N2-C. El error clásico es “promover siempre y revisar después”. Pregunta: ¿por qué auto_candidate aún requiere golden en el You Do?
- **Code/output changes:** none
- **Validation notes:** Transfer alineado a You Do y ética de sección.

---

### S25-T4-B-DEMO (iDo)
- **Diagnosis:** Request segura (tools=[], HITL) + minimize sin api_key — demo de seguridad densa. Falta preamble de “OCR/email son untrusted” y retrospective del misconception “el regex es el control real”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El documento OCR o el email sintético pueden intentar dar órdenes (“ignore previous instructions”). En esta demo la request deja el texto en `untrusted_document`, tools vacíos, tope de chars y aprobación humana; luego minimize quita `api_key` del payload. No escribas: predice las dos líneas de salida y por qué el control real no es el regex, sino privilegio mínimo + HITL + minimización.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: regex es telemetría; nunca eleves el doc a system; secretos fuera del contexto del modelo. Puente a We Do: signal+request, minimize y decision sin fraud.
- **Proposed retrospective:**  
  Si puedes explicar por qué tools=[] y HITL importan más que detectar una frase, ya tienes el hábito de injection-by-design. We Do: request completa, minimize y score≠fraude.
- **Code/output changes:** none
- **Validation notes:** Output tools/HITL + dict minimizado alineado a theory T4-B.

---

### S25-T4-B-E1 (weDo, guided)
- **Diagnosis:** Signal case-sensitive y sin request segura — dual gap importante. Instruction ya pide dos líneas de salida; falta preamble de “seguridad aunque regex falle” y retrospective de telemetría vs control.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Signal case-insensitive y request segura
- **Proposed preamble:**  
  - **Contexto:** un doc hostil sintético pide “IGNORE previous instructions”; el assist debe detectar la señal *y* armar request con tools vacíos + HITL.  
  - **Meta:** regex case-insensitive + request_for con untrusted_document, tools=[], max 160, approval True.  
  - **Éxito:**  
    `True []`  
    `160 True`  
  - **Límites:** no eleves el doc a system; no bastes con print(signal) solo.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: membership case-sensitive y sin request.  
  2. Implementa signal con `re.search` y `(?i)`.  
  3. Arma request_for con las cuatro keys de política.  
  4. Imprime las dos líneas como en la solución.
- **Proposed retrospective:**  
  Signal es telemetría; tools=[] + HITL son el control. El error clásico es confiar solo en el regex. Siguiente (E2): minimize sin secretos.
- **Code/output changes:** none
- **Validation notes:** Pass multi-línea correcto; starter incompleto a propósito.

---

### S25-T4-B-E2 (weDo, independent)
- **Diagnosis:** minimize que reenvía payload completo (incluye api_key) — anti-patrón de exfiltración excelente. Instruction clara; falta preamble de “secretos fuera del modelo” y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Minimize: solo keys permitidas
- **Proposed preamble:**  
  - **Contexto:** enviar `api_key` al contexto del modelo es un incidente de exfiltración.  
  - **Meta:** `minimize` devuelve solo keys en allow presentes en el payload.  
  - **Éxito:** `{'ruc': '1', 'total': 2}`.  
  - **Límites:** no reimprimas p entero; api_key no debe aparecer.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: `return payload` (bug).  
  2. Filtra con comprehension sobre allow_keys si k in payload.  
  3. Imprime el dict minimizado.  
  4. No agregues keys fuera de allow.
- **Proposed retrospective:**  
  Minimización es control de exfiltración, no estética del JSON. Luego (E3) la decisión de promote nunca devuelve fraud por score alto.
- **Code/output changes:** none
- **Validation notes:** Independiente alineado a theory T4-B y You Do.

---

### S25-T4-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a política score≠fraude — clímax ético de la sección. Starter etiqueta fraud con score≥0.9. Falta preamble de “señal de prioridad, no veredicto” y retrospective de HITL.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Score alto: signal_only, nunca fraud
- **Proposed preamble:**  
  - **Contexto:** en CP-N2-C el score prioriza revisión humana; nunca autoetiqueta fraude.  
  - **Meta:** `decision(score, schema_ok)` → human_review si schema falla; si no, `signal_only`.  
  - **Éxito:** imprime `signal_only` con score=0.99 y schema_ok=True.  
  - **Límites:** ninguna rama retorna `fraud`; score alto ≠ veredicto legal.
- **Proposed instruction/description improvements:**  
  1. Lee el starter: score≥0.9 → fraud (bug de política).  
  2. Si not schema_ok → human_review.  
  3. Si no → signal_only.  
  4. Imprime `decision(0.99, True)`.
- **Proposed retrospective:**  
  Matching o score no son veredicto de fraude: es la política del roadmap del curso. El error clásico es umbral de score → etiqueta automática. Pregunta: ¿qué imprime decision(0.99, False) y por qué?
- **Code/output changes:** none
- **Validation notes:** Transfer ético alineado a intro de sección, E3 de T1-A y You Do.

---

### youDo (proyecto: Asistente JSON evaluado · CP-N2-C)
- **Diagnosis:** Marco de proyecto maduro: context, objectives (4), requirements (4), rubric (6 criterios con pesos), portfolioNote y starter con SCHEMA_KEYS, GOLDEN de 3 filas, helpers de cache/validate/injection/minimize y stubs NotImplementedError. Un true newbie tiene el *qué construir*, pero falta `retrospective` de defensa/reflexión post-build (spec You Do). El context ya ancla S24→S25→S26; no reescribir el marco entero — solo añadir cierre metacognitivo.
- **Checklist:** context pass · goal pass (objectives) · success pass (rubric) · constraints pass (requirements) · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (ya tiene title de proyecto)
- **Proposed preamble:** N/A (context cumple rol de escena; no duplicar essay)
- **Proposed instruction/description improvements:**  
  Mantener context/objectives/requirements/rubric/starter. Opcional (P2): en context, una frase de éxito observable del run local (“eval_golden sobre ≥3 filas imprime schema_rate/exact/field_match_rate; injection_signal → human_review”). No tocar outputs de golden salvo execute-and-diff justificado.
- **Proposed retrospective:**  
  Antes de marcar listo: (1) ¿qué invariante demuestras con `eval_golden` (exact, schema_rate, field_match_rate) frente a un baseline de reglas o mock previo? (2) ¿dónde el path es fail-closed (`schema_fail` / injection → human_review) y por qué score nunca es fraude? (3) En el README, una frase de impacto medible (antes/después: p. ej. “sin schema no se publica; con golden el promote es auditable”) que puedas defender en 30 segundos ante el VP del desk. Puente a S26: este adapter y contrato alimentan la orquestación Excel→…→modelo/IA→informe→correo.
- **Code/output changes:** none (starter y GOLDEN coherentes con theory; no proponer cambios de código en Round 1)
- **Validation notes:** Rubric cubre contrato narrativo vs clasificador, ops, privacidad, injection-by-design, legibilidad y es-PE. Solo falta retrospective de cierre.

---

## Priority order

### P0 (We Do: title + preamble + instruction solo-tarea + retrospective; feedback si el Fixer toca la unidad)
1. S25-T1-A-E1, E2, E3  
2. S25-T1-B-E1, E2, E3  
3. S25-T2-A-E1, E2, E3  
4. S25-T2-B-E1, E2, E3  
5. S25-T3-A-E1, E2, E3  
6. S25-T3-B-E1, E2, E3  
7. S25-T4-A-E1, E2, E3  
8. S25-T4-B-E1, E2, E3  

### P1 (I Do preamble + retrospective + why ampliado; You Do retrospective)
1. S25-T1-A-DEMO … S25-T4-B-DEMO (8 demos)  
2. youDo retrospective  

### P2 (polish)
1. Ampliar feedback We Do con ancla de desk/costo/HITL (propuestas ya en ledger donde aplica)  
2. Frase de éxito observable opcional en youDo.context  
3. Revisar hints E3 que dan la solución casi literal (mantener andamiaje mínimo; no spamear spoilers extra)

---

## Residual risks

1. **Nombre de archivo vs contenido:** `s25-streamlit-dashboards.ts` / id `streamlit-dashboards` vs título de IA endpoints — riesgo de desorientación en navegación interna; fuera de scope de prose de ejercicios, pero el Fixer no debe “corregir” el id sin orquestación.
2. **Dos contratos de salida:** clasificador `{model,label,score}` vs narrativo `{hallazgo,n,mediana,evidence_ids,model}` — preambles propuestos los separan; si el Fixer colapsa prose genérica, el newbie confunde forms.
3. **Hints casi-solución en E1:** aceptable en guided; al añadir preamble, no pegar el mismo código otra vez en instruction.
4. **Longitudes:** preambles propuestos en bullets ~80–150 palabras; el Fixer debe recortar si el UI se satura, sin borrar success criteria.
5. **Outputs canónicos:** no se proponen cambios de `solutionCode.output`; cualquier diff debe ser execute-and-diff justificado en Round 1 Fix.
6. **Anti-aberración en el Fix:** implementar campo a campo a mano; no generar 24 preambles con un script.

---

## Counts summary for Fixer

| Tipo | Unidades | preamble | title | retrospective | primary severity |
|------|----------|----------|-------|---------------|------------------|
| iDo | 8 | 0/8 | N/A | 0/8 | P1 |
| weDo | 24 | 0/24 | 0/24 | 0/24 | P0 |
| youDo | 1 | N/A (context OK) | has title | 0/1 | P1 |

**Código/starter/outputs:** maduros; foco del Fix = campos pedagógicos (`title`, `preamble`, `instruction` task-only, `retrospective`, ampliar `why`/`feedback` donde se toque la unidad).

Section 25 exercise pedagogy review complete. Ready for the Fixer prompt.
