# S33 Exercise Pedagogy Report (Round 1)

## Section
- **title:** ML supervisado y baselines responsables
- **shortTitle:** Baselines ML responsables
- **id:** `advanced-models`
- **index:** 33
- **source:** `src/lib/course/sections/s33-advanced-models.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades de práctica/demo)
- **subtemas:** S33-T1-A framing/unit/target/horizon · T1-B dual baseline dummy+regla/costo · T2-A logística/sigmoid/L2 · T2-B coeficientes escalados · T3-A stump+voto · T3-B overfit/seed · T4-A tracking honesto · T4-B group CV por entidad
- **hilo de caso:** workbench **CP-N3-B** (Red Andina) con fixture sintético **CASO-LIM-033**; target `needs_review_7d` (cola de revisión, **no** fraude); dual baseline (dummy majority + regla simple); predicción de prioridad ≠ etiqueta de delito ni parentesco; un run con `beats_dummy=False` se loguea igual

## Method
- Leído `PEDAGOGY_EXERCISE_SPEC.md` (campos, longitudes, checklist preamble/retrospective, fade E1→E2→E3).
- Inspeccionado manualmente cada `iDo.steps[]` (8 demos, ~357–585), `weDo.steps[]` (24 ejercicios, ~587–2016) y `youDo` (~2018–2130) en `s33-advanced-models.ts`.
- Contrastado con el hilo de la sección: unit/target/horizon → dummy+regla+costo → sigmoid/L2 → ranking |coef| sin claim causal → stump controlado → gap train−valid + seed → tracking con victoria/derrota → group CV con disyunción de entidades.
- **Sin** generadores, bucles, plantillas ni copy-paste mecánico entre unidades.
- Prosa propuesta en **español profesional peruano**, un objetivo primario por unidad.
- Nota de contexto: el spec lista S33 como *gold tone reference* de tono de código; el **andamiaje de código** (DEFECT nombrados, fixtures CASO-LIM-033, outputs canónicos, fade E1 fix → E2 assess → E3 decide) es maduro, pero los campos `preamble` / `title` / `retrospective` **aún no existen** en el source — el gap verbal es el mismo patrón de secciones vecinas.

## Hallazgos transversales (antes del ledger)

| Campo / hábito | Estado actual en S33 |
|----------------|----------------------|
| I Do `preamble` | **Ausente** en las 8 demos |
| I Do `retrospective` | **Ausente** en las 8 demos |
| I Do `description` | Presente y técnica (qué hace el demo); no sustituye preamble formal (escena + qué observar) |
| I Do `why` | Presente; suele ser **1 frase densa** (bajo el piso 40–90 palabras del spec) |
| We Do `title` | **Ausente** en los 24 |
| We Do `preamble` | **Ausente** en los 24 |
| We Do `retrospective` | **Ausente** en los 24 |
| We Do `instruction` | Densa y **técnicamente excelente**: nombra DEFECT, fixture y salida exacta; **mezcla** contexto + meta + éxito + límites en un solo bloque — legible para quien ya hace ML de cola, **opaco** para un newbie sin escena de workbench |
| We Do `feedback` | Presente en los 24; nombra el contrato del gate (bien); a menudo 1 frase; poco *por qué importa en la cola de revisión de Lima* ni metacognición |
| Starter `# DEFECT:` | **Excelente** en todos; defectos bien nombrados y alineados a la solución |
| Hints | E1 casi-solución (aceptable guiado); E2/E3 con menos migas; fade real de andamiaje |
| You Do marco | `context` / `objectives` / `requirements` / `rubric` / `portfolioNote` / starter **sólidos** y alineados a CP-N3-B |
| You Do `retrospective` | **Ausente** |
| Código / outputs | Coherentes con theory y CASO-LIM-033; **no** proponer cambios de output salvo notas puntuales |

**Patrón dominante:** el andamiaje de *código* (fixtures sintéticos, bugs nombrados, outputs canónicos, progresión E1 corrección numérica → E2 enrutado assess → E3 fallo cerrado CONTINUE/REJECT/REQUEST, política `needs_review ≠ fraud`, comparación honesta al dummy y a la regla) es de referencia. El andamiaje *pedagógico verbal* (preamble → instruction solo-tarea → retrospective) no existe. Un true newbie no responde con claridad: qué practico, por qué importa en un workbench de revisión de alertas (p. ej. Lima o Arequipa), cómo sé que gané, qué debe quedarme al cerrar la pestaña.

**Fade E1→E2→E3 (contenido):** progresión real por subtema (p. ej. T1-A: prevalencia+fraud_name → assess de tres fixtures → decide CONTINUE/REJECT/REQUEST; T4-A: beats False válido → assess de log → dual win/lose + REQUEST_METRICS). **No** son tres clones con números distintos. El fade de *prosa* no se ve porque no hay preambles diferenciados.

**Severity default:** missing title+preamble+retrospective en We Do = **P0**; I Do sin preamble/retrospective = **P1** (aún tienen description+why+código); youDo sin retrospective = **P1**; polish de feedback/why = **P2** si caen preamble/instruction/retrospective.

---

## Unit ledger

### S33-T1-A-DEMO (iDo)
- **Diagnosis:** Demo sólida de framing: `entity_pair` + `needs_review_7d` + horizon 7, `fraud_name False` y prevalencia 0.25 sobre `y=[0,1,0,0]`. La `description` nombra el skill; falta `preamble` que diga *qué observar* (unit, target limpio, prevalencia antes del fit) y `retrospective` del misconception “llamar al target `is_fraud` es solo un nombre”. El `why` es una frase.
- **Checklist:** context fail · goal partial · success partial (output visible) · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Antes de entrenar en el workbench de Red Andina (CP-N3-B), el analista cierra el **problema de scoring**: unidad, target de cola y horizonte. En esta demo el fixture sintético CASO-LIM-033 usa `entity_pair`, `needs_review_7d` y 7 días. No escribas aún: predice si `fraud_name` es False, qué prevalencia sale de `y=[0,1,0,0]` y por qué un target llamado `is_fraud` rompería el producto. Observa la salida: unit, target, horizon, fraud_name y prevalence.
- **Proposed instruction/description improvements:**  
  Mantener description. Ampliar `why` (~50–70 palabras): el ML solo prioriza la cola de revisión humana; un nombre con `fraud` es breach de producto, no de schema; la prevalencia se anota **antes** del fit para no engañarse con el dummy majority; sin horizonte explícito no se inventa 7 en silencio. Puente a We Do: corregir prevalencia y el check invertido de fraud.
- **Proposed retrospective:**  
  Si puedes explicar por qué `needs_review_7d` no es un veredicto de delito sin mirar el código, ya tienes el hábito de framing honesto. El error clásico es modelar “fraude” porque el negocio lo pide en la conversación. En We Do practicarás prevalencia correcta y rechazo de nombres prohibidos.
- **Code/output changes:** none
- **Validation notes:** Output `entity_pair needs_review_7d 7` / `fraud_name False` / `prevalence 0.25` alineado a theory T1-A.

---

### S33-T1-A-E1 (weDo, guided)
- **Diagnosis:** Drill guiado claro: starter divide por `len(y)-1` e invierte `fraud_name is True`. Instruction densa mezcla DEFECT, contrato y salida; sin title, preamble ni retrospective. Feedback nombra el framing pero no ancla “por qué la cola de Lima miente si la prevalencia está mal”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Prevalencia y target sin fraud
- **Proposed preamble:**  
  - **Contexto:** en CASO-LIM-033-1A el workbench exige unit, target de cola y prevalencia real antes de cualquier modelo.  
  - **Meta:** corregir el cálculo de prevalencia y el check de nombre fraud.  
  - **Éxito:** una línea `S33-T1-A PASS`.  
  - **Límites:** `prevalence = round(sum(y)/len(y), 3)` (no `len(y)-1`); exige `fraud_name is False`; no inventes labels de fraude.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: divide por `len(y)-1` y exige `fraud_name is True` (DEFECT).  
  2. Cambia a `sum(y) / len(y)` redondeado a 3.  
  3. Exige `fraud_name is False` con target `needs_review_7d`.  
  4. Imprime `S33-T1-A` y el status (debe ser PASS).
- **Proposed feedback improvement:**  
  Con `y=[0,1,0,0]` la prevalencia es 0.25, no 0.333. Exigir `fraud_name True` sobre un target limpio es un gate invertido: el breach es el nombre `is_fraud`, no el framing correcto.
- **Proposed retrospective:**  
  Prevalencia = positivos / n, mirados **antes** del fit. El error clásico es off-by-one en el denominador o aceptar un target con “fraud” en el nombre. Siguiente (E2): enrutar válido, adverso e incompleto.
- **Code/output changes:** none
- **Validation notes:** DEFECT bien nombrado; solution y output `S33-T1-A PASS` correctos.

---

### S33-T1-A-E2 (weDo, independent)
- **Diagnosis:** Independiente fuerte: prevalencia inventada y assess que da PASS al adverso `is_fraud`. Instruction ya lista las tres salidas; falta escena de “gate de producto” y cierre metacognitivo. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Assess de framing con prevalencia calculada
- **Proposed preamble:**  
  - **Contexto:** el gate del workbench no solo “ve” el dict: exige prevalencia calculada y rechaza nombres de fraude.  
  - **Meta:** armar el fixture válido con prevalencia real y enrutar tres casos (limpio, `is_fraud`, sin horizon).  
  - **Éxito:** `PASS REJECT_FRAUD_TARGET MISSING:horizon`.  
  - **Límites:** no hardcodes 0.25 a mano sin calcular; missing de horizon **antes** de mirar el contenido; datos sintéticos.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: `prevalence = 0.0` y assess da PASS si el target contiene `"fraud"` (DEFECT).  
  2. Calcula prevalencia de `y=[0,1,0,0]`.  
  3. Corrige `assess`: missing primero; PASS solo target limpio + horizon > 0 + unit + prevalence==0.25.  
  4. Imprime las tres salidas en orden.
- **Proposed retrospective:**  
  `is_fraud` es breach de **producto**, no de schema vacío. El error clásico es hardcodear prevalencia “porque ya sabes el número”. Luego (E3): CONTINUE / REJECT / REQUEST en lugar de PASS genérico.
- **Code/output changes:** none
- **Validation notes:** E2 con menos migas que E1; output canónico intacto.

---

### S33-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transferencia real al fallo cerrado: CONTINUE / REJECT_FRAUD_TARGET / REQUEST_HORIZON. Starter inventa prevalence=1.0 y trata missing como CONTINUE. Instruction ya nombra las rutas; falta anclar reutilización en You Do y retrospective “ausencia ≠ breach”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Fallo cerrado: CONTINUE o REQUEST_HORIZON
- **Proposed preamble:**  
  - **Contexto:** en ops de riesgo no se inventa un horizonte de 7 días cuando falta: se pide evidencia.  
  - **Meta:** decidir CONTINUE / REJECT_FRAUD_TARGET / REQUEST_HORIZON con prevalencia calculada.  
  - **Éxito:** `CONTINUE REJECT_FRAUD_TARGET REQUEST_HORIZON`.  
  - **Límites:** missing → REQUEST_HORIZON (no CONTINUE); no inventes prevalence; is_fraud cierra con REJECT.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: prevalence inventada y missing devuelve CONTINUE.  
  2. Calcula prevalencia real (0.25).  
  3. En `decide`, missing → `REQUEST_HORIZON`; limpio → `CONTINUE`; fraud en nombre → `REJECT_FRAUD_TARGET`.  
  4. Imprime las tres decisiones en orden.
- **Proposed retrospective:**  
  REQUEST_* pide evidencia; REJECT_* cierra el breach; CONTINUE solo con framing limpio. El error clásico es tratar “falta horizon” como si fuera OK. Pregunta: ¿por qué no rellenar 7 por defecto en silencio?
- **Code/output changes:** none
- **Validation notes:** Transfer auténtico; alineado a callout REQUEST_HORIZON de theory T1-A.

---

### S33-T1-B-DEMO (iDo)
- **Diagnosis:** Worked example claro de dual baseline: dummy_acc 0.667, cost 1, regla perfecta 1.0. Description nombra dual baseline; falta preamble de “sin ancla el ML no demuestra valor” y retrospective del misconception “si el modelo gana al dummy ya promociono”. El `why` es una frase.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  En mesas de revisión de alertas (p. ej. Lima), un workbench serio documenta **dummy majority** y una **regla simple** antes del modelo. En esta demo, con `y=[1,1,0]` y `x=[1,1,0]`, el dummy acierta 2/3 (costo 1 por un FP) y la regla `x>=1` acierta 1.0. No escribas: predice dummy_acc, cost y rule_acc; observa que a veces la heurística **ya gana** al dummy — y eso se celebra documentándolo, no ocultándolo.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: dual baseline + costo FP/FN anclan el valor mínimo; el costo traduce errores a impacto de cola, no a moral de fraude; sin `has_baseline` no se promociona modelo; comparar solo accuracy sin costo engaña cuando FN es caro. Puente a We Do: majority con max, costo derivado y regla x>=thr.
- **Proposed retrospective:**  
  Dummy y regla se calculan de y vs. pred, no se inventan. El error clásico es entrenar sin baseline “porque el modelo se ve bien”. We Do: dual ancla con max (no min) y cost real.
- **Code/output changes:** none
- **Validation notes:** Output dummy 0.667 / cost 1 / rule_acc 1.0 alineado a theory T1-B.

---

### S33-T1-B-E1 (weDo, guided)
- **Diagnosis:** Guiado excelente: starter usa `min` (minoría), cost=0 hardcode y umbral de regla invertido. Instruction densa; sin title/preamble/retrospective. Feedback menciona dual baseline pero no el “por qué en la cola”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Dual baseline: dummy, costo y regla
- **Proposed preamble:**  
  - **Contexto:** CASO-LIM-033-1B exige dummy majority **y** regla `x>=1` documentados antes del ML.  
  - **Meta:** calcular dummy_acc≈0.667, cost=1 (un FP) y rule_acc=1.0.  
  - **Éxito:** `S33-T1-B PASS`.  
  - **Límites:** majority con `max(set(y), key=y.count)` (no `min`); costo desde y vs. dummy; no dejes cost=0 inventado.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `min` de clase, cost=0 y `v < 1` en la regla (DEFECT).  
  2. Cambia a `max` para majority.  
  3. Suma c_fp/c_fn al comparar y vs. dummy.  
  4. Regla con `v >= 1.0`; imprime `S33-T1-B PASS`.
- **Proposed feedback improvement:**  
  Con y=[1,1,0] el majority es 1: un FP cuesta 1 (c_fp=1). La regla sobre x da pred perfecta. Usar min o hardcodear cost deja un “baseline” falso que el modelo “gana” sin mérito.
- **Proposed retrospective:**  
  Dual baseline = dummy **y** regla, ambos calculados. El error clásico es documentar solo el dummy y olvidar que la regla ya puede ser perfecta. Siguiente (E2): assess con cost/acc derivados.
- **Code/output changes:** none
- **Validation notes:** DEFECT tripe (min/cost/regla) alineado a solution.

---

### S33-T1-B-E2 (weDo, independent)
- **Diagnosis:** Independiente claro: cost=None en el válido y assess que da PASS al adverso. Instruction nombra las tres salidas; falta escena y retrospective. Sin title.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Assess de baseline con cost calculado
- **Proposed preamble:**  
  - **Contexto:** el contrato del gate se alimenta de números reales, no de un dict pre-rellenado a mano.  
  - **Meta:** derivar dummy_acc y cost; enrutar válido / sin baseline / sin cost.  
  - **Éxito:** `PASS REJECT_NO_BASELINE MISSING:cost`.  
  - **Límites:** missing de cost primero; no des PASS si `has_baseline is False`; deriva cost como en E1.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: `cost = None` y assess invertido (DEFECT).  
  2. Deriva cost de FP/FN sobre el dummy.  
  3. PASS solo con has_baseline True, cost no nulo y dummy_acc >= 0.  
  4. Imprime las tres salidas.
- **Proposed retrospective:**  
  Un baseline sin costo es incompleto para la cola (FP/FN asimétricos). El error clásico es un dict “válido” con cost None. Luego (E3): REQUEST_COST en lugar de inventar c_fn.
- **Code/output changes:** none
- **Validation notes:** assert solution espera cost==1 y acc==0.667; intacto.

---

### S33-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a CONTINUE / REJECT_NO_BASELINE / REQUEST_COST. Starter hardcodea cost=99 y missing→CONTINUE. Instruction ya nombra las rutas; falta preamble de “no inventar c_fn en silencio”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** REQUEST_COST si falta el costo de cola
- **Proposed preamble:**  
  - **Contexto:** en el workbench, un c_fn inventado “porque 5 suena bien” distorsiona la promoción del modelo.  
  - **Meta:** derivar cost real y decidir CONTINUE / REJECT_NO_BASELINE / REQUEST_COST.  
  - **Éxito:** `CONTINUE REJECT_NO_BASELINE REQUEST_COST`.  
  - **Límites:** no dejes cost=99; missing → REQUEST_COST; has_baseline False → REJECT.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: cost hardcode y missing devuelve CONTINUE.  
  2. Deriva cost de y vs. dummy (esperado 1).  
  3. Corrige `decide` a REQUEST_COST / REJECT / CONTINUE según el caso.  
  4. Imprime las tres decisiones.
- **Proposed retrospective:**  
  El costo se calcula o se pide; no se inventa. El error clásico es rellenar defaults en silencio. Pregunta: ¿qué riesgo hay si c_fn real es mucho mayor que el del lab?
- **Code/output changes:** none
- **Validation notes:** Transfer alineado a callout REQUEST_COST de theory T1-B.

---

### S33-T2-A-DEMO (iDo)
- **Diagnosis:** Demo clara: sigmoid(0)=0.5, pred 0 con thr=0.6, l2_sq=5, penalty l2. Description técnica; falta preamble de “umbral de producto vs magia del modelo” y retrospective del misconception “Σw² prueba que usaste L2”. `why` de una frase.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  La logística es el primer modelo interpretable del workbench: σ(z) da probabilidad y el **umbral** convierte eso en prioridad de cola. En esta demo, p≈0.55 con thr=0.6 **no** prioriza (pred 0); si thr fuera 0.5, la misma p daría 1. Observa también `l2_sq=5` (solo magnitud) y `penalty l2` en params: la **declaración** de regularización, no el Σw², es la evidencia del gate.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: sigmoid acota p en (0,1); thr es decisión de producto (cuánta cola aguantas); l2_sq=Σw² es diagnóstico, no prueba de fit regularizado; sin penalty=\"l2\" el gate marca REJECT_UNREGULARIZED. Puente a We Do: thr 0.6, Σw² y penalty documentada.
- **Proposed retrospective:**  
  Umbral ≠ veredicto de fraude; L2 se **declara** en params. El error clásico es creer que l2_sq>0 “prueba” regularización. We Do: arreglar L1 vs L2 y thr del lab.
- **Code/output changes:** none
- **Validation notes:** Output `0.5 0.881` / `pred 0` / `l2_sq 5` / `penalty l2` correcto.

---

### S33-T2-A-E1 (weDo, guided)
- **Diagnosis:** Guiado perfecto: thr=0.5, penalty none, L1 en vez de Σw². Instruction densa con PASS; sin title/preamble/retrospective. Feedback bueno sobre el primer modelo interpretable.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Sigmoid, thr 0.6 y L2 documentada
- **Proposed preamble:**  
  - **Contexto:** CASO-LIM-033-2A exige p, pred umbralada, l2_sq diagnóstico y `penalty=\"l2\"`.  
  - **Meta:** p=0.5, pred=0 con thr=0.6, l2_sq=5 y penalty l2.  
  - **Éxito:** `S33-T2-A PASS`.  
  - **Límites:** l2_sq = sum(v*v), no abs; thr del lab = 0.6; no dejes penalty=\"none\".
- **Proposed instruction/description improvements:**  
  1. Abre el starter: thr=0.5, penalty none, sum(abs(v)) (DEFECT).  
  2. Fija thr=0.6 y penalty=\"l2\".  
  3. Cambia a sum(v*v) para l2_sq.  
  4. Imprime `S33-T2-A PASS`.
- **Proposed feedback improvement:**  
  p≈0.55 no alcanza thr=0.6 → pred 0. L1 (suma de |w|) no es l2_sq. El gate exige la config L2, no un umbral mágico sobre Σw².
- **Proposed retrospective:**  
  Cuatro piezas: sigmoid, thr de producto, l2_sq diagnóstico, penalty en params. El error clásico es confiar thr=0.5 “porque es el default”. Siguiente (E2): assess con penalty none como adverso.
- **Code/output changes:** none
- **Validation notes:** Solution y assert meets_contract correctos.

---

### S33-T2-A-E2 (weDo, independent)
- **Diagnosis:** Independiente: assess da PASS cuando penalty==\"none\". Instruction lista salidas; falta escena de “la config prueba L2, no la magnitud”. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Assess: penalty l2, no solo l2_sq
- **Proposed preamble:**  
  - **Contexto:** un vector con pesos no nulos puede venir de un fit **sin** regularizar; el gate mira la declaración.  
  - **Meta:** enrutar válido (penalty l2) / adverso (none) / sin p.  
  - **Éxito:** `PASS REJECT_UNREGULARIZED MISSING:p`.  
  - **Límites:** missing de p primero; PASS solo con penalty==\"l2\" y p/pred válidos; l2_sq no sustituye la config.
- **Proposed instruction/description improvements:**  
  1. Revisa el assess invertido (PASS si penalty==\"none\").  
  2. Deja p, pred y l2 ya calculados.  
  3. PASS solo si penalty==\"l2\" y rangos OK.  
  4. Imprime las tres salidas.
- **Proposed retrospective:**  
  Config documentada ≠ magnitud de coeficientes. El error clásico es “l2_sq=5 ⇒ ya hay L2”. Luego (E3): REQUEST_SIGMOID si falta p.
- **Code/output changes:** none
- **Validation notes:** Output canónico intacto.

---

### S33-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer a CONTINUE / REJECT_UNREGULARIZED / REQUEST_SIGMOID. Starter missing→CONTINUE e invertido. Instruction corta (aceptable en transfer) pero sin preamble de “sin p no se prioriza cola”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** REQUEST_SIGMOID si falta la probabilidad
- **Proposed preamble:**  
  - **Contexto:** priorizar cola sin p en [0,1] es adivinar; sin L2 documentada el modelo no pasa el gate del lab.  
  - **Meta:** decide CONTINUE / REJECT_UNREGULARIZED / REQUEST_SIGMOID.  
  - **Éxito:** `CONTINUE REJECT_UNREGULARIZED REQUEST_SIGMOID`.  
  - **Límites:** missing → REQUEST_SIGMOID; no trates penalty none como CONTINUE aunque l2>0.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: missing→CONTINUE y PASS invertido sobre penalty.  
  2. Missing → `REQUEST_SIGMOID`.  
  3. penalty==\"l2\" + p/pred válidos → CONTINUE; si no → REJECT_UNREGULARIZED.  
  4. Imprime las tres decisiones.
- **Proposed retrospective:**  
  Sin sigmoid no hay score de cola; sin penalty l2 no se acepta el modelo. El error clásico es “seguir con CONTINUE” cuando falta p. Pregunta: ¿qué pedirías si falta C o λ además del penalty?
- **Code/output changes:** none
- **Validation notes:** Transfer alineado a callout REQUEST_SIGMOID.

---

### S33-T2-B-DEMO (iDo)
- **Diagnosis:** Demo clara de ranking |coef| con shared_phone arriba, causal False, scaled True. Falta preamble de “sin scaling las magnitudes mienten” y retrospective del misconception “coef positivo = colusión probada”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Las features de S32 (`shared_phone`, `amount_z`) ya vienen escaladas y sin leakage. En esta demo rankeas por |coef| y reportas `causal False` y `scaled True`. No escribas: predice el orden (shared_phone primero) y por qué un signo positivo **no** prueba parentesco ni fraude. Si las features no estuvieran en z-score, comparar |w| sería engañoso.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: solo con scaled=True las magnitudes son comparables; el signo es asociación en el modelo, no causa social; el ranking por |coef| es atajo de lab, no estabilidad entre folds. Puente a We Do: reverse=True y causal False.
- **Proposed retrospective:**  
  Ranking honesto = features escaladas + sin claim causal. El error clásico es leer “shared_phone alto ⇒ colusión”. We Do: orden descendente y flags de interpretación.
- **Code/output changes:** none
- **Validation notes:** Output ranking + causal False + scaled True alineado a theory T2-B.

---

### S33-T2-B-E1 (weDo, guided)
- **Diagnosis:** Guiado: orden ascendente y exige causal True. Instruction densa; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Ranking |coef| sin claim causal
- **Proposed preamble:**  
  - **Contexto:** el informe del workbench lista features S32 por importancia de coeficiente solo si están escaladas.  
  - **Meta:** top=`shared_phone`, scaled True, causal False.  
  - **Éxito:** `S33-T2-B PASS`.  
  - **Límites:** `sorted(..., reverse=True)`; no exijas causal True; no compares |coef| si scaled=False.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: sorted sin reverse y causal is True en el contrato (DEFECT).  
  2. Añade reverse=True.  
  3. Exige causal is False (y scaled True, top shared_phone).  
  4. Imprime `S33-T2-B PASS`.
- **Proposed feedback improvement:**  
  Sin reverse el “top” es amount_z por magnitud menor. Exigir causal True es un gate anti-producto: el lab prohíbe el claim causal en el informe.
- **Proposed retrospective:**  
  |coef| descendente + causal=False. El error clásico es ordenar al revés o “demostrar causa” con un signo. Siguiente (E2): assess con scaled False como adverso.
- **Code/output changes:** none
- **Validation notes:** Solution correcta; output PASS.

---

### S33-T2-B-E2 (weDo, independent)
- **Diagnosis:** Independiente: ranking ascendente + assess invertido. Instruction lista salidas; falta escena de informe.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Assess de coefs escalados y no causales
- **Proposed preamble:**  
  - **Contexto:** un informe con scaled=False o causal=True no debe pasar el gate de interpretación.  
  - **Meta:** top calculado + tres rutas PASS / REJECT_UNSCALED_COEF / MISSING:scaled.  
  - **Éxito:** `PASS REJECT_UNSCALED_COEF MISSING:scaled`.  
  - **Límites:** missing de scaled primero; top debe ser shared_phone; no des PASS al adverso.
- **Proposed instruction/description improvements:**  
  1. Corrige ranking con reverse=True.  
  2. Arma valid con top, scaled True, causal False.  
  3. PASS solo si scaled, !causal y top correcto.  
  4. Imprime las tres salidas.
- **Proposed retrospective:**  
  El adverso falla por flags de interpretación, no por schema vacío. El error clásico es rankear features crudas “porque el número se ve grande”. Luego (E3): REQUEST_SCALE_FLAG.
- **Code/output changes:** none
- **Validation notes:** Output canónico intacto.

---

### S33-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer CONTINUE / REJECT_UNSCALED_COEF / REQUEST_SCALE_FLAG. Instruction corta; sin preamble de “pedir el flag evita rankings engañosos”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** REQUEST_SCALE_FLAG antes de rankear
- **Proposed preamble:**  
  - **Contexto:** si el log no trae `scaled`, no inventes True: pides el flag y detienes el ranking engañoso.  
  - **Meta:** decide CONTINUE / REJECT_UNSCALED_COEF / REQUEST_SCALE_FLAG.  
  - **Éxito:** `CONTINUE REJECT_UNSCALED_COEF REQUEST_SCALE_FLAG`.  
  - **Límites:** missing → REQUEST_SCALE_FLAG antes de mirar causal; unscaled o causal → REJECT.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: missing→CONTINUE y predicado invertido.  
  2. Missing → `REQUEST_SCALE_FLAG`.  
  3. CONTINUE solo scaled True y causal False.  
  4. Imprime las tres decisiones.
- **Proposed retrospective:**  
  Pedir el scale flag es fail-closed de interpretación. El error clásico es rankear “igual” sin saber la escala. Pregunta: ¿qué harías si scaled=True pero las columnas no son z-score de S32?
- **Code/output changes:** none
- **Validation notes:** Transfer alineado a callout REQUEST_SCALE_FLAG.

---

### S33-T3-A-DEMO (iDo)
- **Diagnosis:** Demo clara stump [0,1] + majority 1 + depth_unlimited False. Falta preamble de “ensamble controlado ≠ RF completo” y retrospective del misconception “profundidad ilimitada generaliza mejor”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Un **stump** es un árbol de profundidad 1: una sola pregunta `x >= thr`. Varios predictores débiles con **voto mayoritario** ilustran el ensamble sin API pesadas — no es un Random Forest completo. En esta demo, thr=0.3 sobre [0.1, 0.4] da [0, 1] y el voto [1,0,1] da 1. Observa `depth_unlimited False`: profundidad libre sobreajusta el sintético y miente frente al dummy.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: stump + vote es la idea de “muchos débiles controlados”; bagging/boosting son familias más ricas (lectura); sin control de depth el lab rechaza el run; compara accuracy del ensamble al dummy/regla de T1-B. Puente a We Do: thr correcto y majority con umbral de mayoría.
- **Proposed retrospective:**  
  Control de profundidad es parte del producto, no un detalle de sklearn. El error clásico es un árbol profundo que memoriza el fixture. We Do: arreglar thr invertido y majority rota.
- **Code/output changes:** none
- **Validation notes:** Output stump/majority/depth alineado a theory T3-A.

---

### S33-T3-A-E1 (weDo, guided)
- **Diagnosis:** Guiado: `x < thr` y majority `sum > len`. Instruction densa; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Stump thr y majority vote correctos
- **Proposed preamble:**  
  - **Contexto:** CASO-LIM-033-3A pide predicciones de stump controlado y un voto de tres débiles.  
  - **Meta:** preds=[0,1], maj=1, depth_unlimited False.  
  - **Éxito:** `S33-T3-A PASS`.  
  - **Límites:** `int(x >= thr)`; majority `sum >= (len+1)//2`; no dejes depth libre.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: umbral invertido y majority imposible (DEFECT).  
  2. Cambia a `x >= thr`.  
  3. Majority con umbral de mayoría simple.  
  4. Imprime `S33-T3-A PASS`.
- **Proposed feedback improvement:**  
  0.1 no alcanza 0.3 → 0; 0.4 sí → 1. Con votos [1,0,1] la mayoría es 1. `sum > len` casi nunca es True: el voto queda muerto.
- **Proposed retrospective:**  
  Sentido del umbral y del voto importan tanto como “tener un stump”. El error clásico es copiar thr de otro lab sin mirar el fixture. Siguiente (E2): reject de depth_unlimited.
- **Code/output changes:** none
- **Validation notes:** Solution y assert correctos.

---

### S33-T3-A-E2 (weDo, independent)
- **Diagnosis:** Independiente de assess: PASS cuando depth_unlimited True (invertido). Instruction lista salidas; falta escena de overfit por depth.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Assess: rechazar profundidad ilimitada
- **Proposed preamble:**  
  - **Contexto:** depth libre sobre el sintético memoriza ruido y no demuestra valor frente al dummy.  
  - **Meta:** enrutar válido / depth libre / sin stump_preds.  
  - **Éxito:** `PASS REJECT_DEPTH_UNLIMITED MISSING:stump_preds`.  
  - **Límites:** missing primero; PASS solo depth False y preds no vacías.
- **Proposed instruction/description improvements:**  
  1. Revisa el assess que da PASS si depth_unlimited is True (DEFECT).  
  2. Invierte: PASS con depth False y len(stump_preds) >= 1.  
  3. Deja las tres rutas en orden.  
  4. Imprime las salidas.
- **Proposed retrospective:**  
  El adverso no es “stump vacío de idea”: es profundidad sin control. El error clásico es max_depth=None “porque el accuracy de train sube”. Luego (E3): REQUEST_STUMP.
- **Code/output changes:** none
- **Validation notes:** Output canónico intacto.

---

### S33-T3-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer con preds calculados + CONTINUE / REJECT / REQUEST_STUMP. Starter thr invertido y missing→CONTINUE. Instruction ya pide cálculo; falta preamble de “se pide el stump calculado”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** REQUEST_STUMP si no hay predicciones
- **Proposed preamble:**  
  - **Contexto:** aceptar un ensamble opaco o depth libre sin ver preds del stump es un breach del lab.  
  - **Meta:** calcular preds/maj y decidir CONTINUE / REJECT_DEPTH_UNLIMITED / REQUEST_STUMP.  
  - **Éxito:** `CONTINUE REJECT_DEPTH_UNLIMITED REQUEST_STUMP`.  
  - **Límites:** thr=0.3 con `>=`; missing → REQUEST_STUMP; depth True → REJECT.
- **Proposed instruction/description improvements:**  
  1. Corrige stump a `x >= thr`.  
  2. Calcula preds y maj del fixture.  
  3. decide: missing → REQUEST_STUMP; depth controlada + preds → CONTINUE; si no → REJECT.  
  4. Imprime las tres decisiones.
- **Proposed retrospective:**  
  Se pide el stump calculado antes de celebrar el voto. El error clásico es hardcodear [0,1] y olvidar thr. Pregunta: ¿por qué depth_unlimited=True se rechaza aunque majority sea 1?
- **Code/output changes:** none
- **Validation notes:** assert preds==[0,1] y maj==1 en solution.

---

### S33-T3-B-DEMO (iDo)
- **Diagnosis:** Demo clara overfit True (0.95−0.70) y seed 42 → [1,0,4]. Falta preamble de “0.2 es umbral de lab, no ley universal” y retrospective del misconception “elegir depth solo por train_acc”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Un gap **train − valid** grande señala memorización. El umbral **0.2** es diagnóstico de lab del workbench, no una ley de ML. En esta demo, 0.95 vs 0.70 dispara overfit True; `seeded_ints(42)` fija tres enteros reproducibles. No escribas: predice overfit y la lista; observa que sin seed no hay auditoría entre PRs del modelo.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: mejor profundidad se elige por valid (o costo en valid), nunca solo train; seed en params hace comparable la corrida; gap>0.2 con seed aún se reporta y puede rechazarse. Puente a We Do: gap_thr=0.2 y not overfit en el caso controlado.
- **Proposed retrospective:**  
  Reproducibilidad + control de gap son requisitos de experimentación responsable. El error clásico es “train 99% ⇒ listo”. We Do: umbral unificado 0.2 y seed presente.
- **Code/output changes:** none
- **Validation notes:** Output overfit True / [1,0,4] / seed 42 alineado a theory T3-B.

---

### S33-T3-B-E1 (weDo, guided)
- **Diagnosis:** Guiado sutil: gap_thr=0.15 y PASS cuando hay overfit; el caso controlado es train 0.8 / valid 0.75 (gap 0.05). Instruction densa; sin title/preamble/retrospective. Riesgo de confusión: el demo usa overfit True y el E1 usa caso **sin** overfit — el learner necesita escena clara.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Gap ≤ 0.2 y seed fija
- **Proposed preamble:**  
  - **Contexto:** CASO-LIM-033-3B acepta un run controlado: gap pequeño **y** seed presente.  
  - **Meta:** con train=0.8, valid=0.75 y seed=42, pasar el gate (no overfit).  
  - **Éxito:** `S33-T3-B PASS`.  
  - **Límites:** gap_thr del lab = **0.2** (no 0.15); PASS si **not** overfit y seed no nula; no inventes seed.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: thr=0.15 y meets_contract = is_overfit (DEFECT).  
  2. Fija gap_thr=0.2.  
  3. meets_contract = (not is_overfit) and seed is not None.  
  4. Imprime `S33-T3-B PASS`.
- **Proposed feedback improvement:**  
  0.8−0.75=0.05 no supera 0.2. El umbral 0.15 del starter es un off-by-policy del lab. Exigir is_overfit para PASS invierte el gate de control.
- **Proposed retrospective:**  
  Gap controlado + seed = mínimo reproducible. El error clásico es copiar el thr de otro notebook. Siguiente (E2): REJECT_OVERFIT cuando el gap es grande.
- **Code/output changes:** none
- **Validation notes:** Nota pedagógica: el demo muestra overfit True; E1 practica el caso **controlado**. El Fixer debe dejar esa distinción explícita en preamble (ya propuesta).

---

### S33-T3-B-E2 (weDo, independent)
- **Diagnosis:** Independiente: assess da PASS cuando gap > 0.2. Instruction lista salidas; falta escena.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Assess: REJECT_OVERFIT si gap grande
- **Proposed preamble:**  
  - **Contexto:** un gap train−valid de 0.39 con seed 42 sigue siendo overfit rechazable en este gate.  
  - **Meta:** enrutar válido (gap≤0.2 + seed) / adverso / sin seed.  
  - **Éxito:** `PASS REJECT_OVERFIT MISSING:seed`.  
  - **Límites:** missing de seed primero; no des PASS al gap grande.
- **Proposed instruction/description improvements:**  
  1. Revisa el assess invertido (PASS si gap > 0.2).  
  2. PASS solo gap <= 0.2 y seed presente.  
  3. Mantén invalid train 0.99 / valid 0.6.  
  4. Imprime las tres salidas.
- **Proposed retrospective:**  
  Seed presente no “perdona” un gap enorme. El error clásico es loguear seed y celebrar train_acc. Luego (E3): REQUEST_SEED.
- **Code/output changes:** none
- **Validation notes:** Output canónico intacto.

---

### S33-T3-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer CONTINUE / REJECT_OVERFIT / REQUEST_SEED. Instruction corta; falta preamble de “no inventar 42 en silencio”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** REQUEST_SEED si falta la semilla
- **Proposed preamble:**  
  - **Contexto:** sin seed no se audita un PR del modelo entre versiones del workbench.  
  - **Meta:** decide CONTINUE / REJECT_OVERFIT / REQUEST_SEED.  
  - **Éxito:** `CONTINUE REJECT_OVERFIT REQUEST_SEED`.  
  - **Límites:** missing → REQUEST_SEED (no rellenar 42); gap > 0.2 → REJECT.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: missing→CONTINUE y predicado invertido sobre gap.  
  2. Missing → `REQUEST_SEED`.  
  3. CONTINUE solo gap <= 0.2 y seed no nula.  
  4. Imprime las tres decisiones.
- **Proposed retrospective:**  
  Se pide la seed; no se inventa. El error clásico es hardcodear 42 “porque siempre lo usamos”. Pregunta: ¿qué más pondrías en params junto a seed y depth?
- **Code/output changes:** none
- **Validation notes:** Transfer alineado a callout REQUEST_SEED.

---

### S33-T4-A-DEMO (iDo)
- **Diagnosis:** Demo clave de la sección: beats_win True, beats_lose False, lose_run_ok True. Falta preamble de “la derrota es evidencia, no basura” y retrospective del misconception “solo se loguean victorias”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Tracking mínimo del workbench: keys ordenadas, `beats_dummy` calculado y un run **válido aunque pierda**. En esta demo, acc 0.7 gana al dummy 0.667; acc 0.5 pierde — y `lose_run_ok` es True porque hay metrics + run_id + beats booleano. No escribas: predice beats_win, beats_lose y por qué metrics vacías sí invalidan el log mientras la derrota no.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: comparación honesta es el producto; no exijas beats True para aceptar el log; si la regla ya tiene acc 1.0, ganar solo al dummy no basta para promocionar; keys sorted ayudan al audit. Puente a We Do: beats False con log completo = PASS.
- **Proposed retrospective:**  
  beats_dummy False bien logueado es válido. El error clásico es borrar el run que “quedó mal”. We Do: quitar el gate anti-ML que exige victoria.
- **Code/output changes:** none
- **Validation notes:** Output dual win/lose + lose_run_ok True alineado a theory T4-A.

---

### S33-T4-A-E1 (weDo, guided)
- **Diagnosis:** Guiado excelente y central a la ética del lab: starter exige `beats is True`. Instruction densa; sin title/preamble/retrospective. Feedback ya nombra la idea; se puede anclar a la cola de ops.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Run válido aunque pierda al dummy
- **Proposed preamble:**  
  - **Contexto:** en ops de riesgo, un experimento que pierde al dummy y se documenta evita lanzar complejidad inútil.  
  - **Meta:** con acc=0.5 y dummy=0.667, beats=False y log completo → PASS.  
  - **Éxito:** `S33-T4-A PASS`.  
  - **Límites:** no uses `beats is True` como gate de validez; exige metrics no vacías, beats booleano y run_id.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: meets_contract exige beats is True (DEFECT anti-ML).  
  2. Calcula beats = acc > dummy_acc (será False).  
  3. Valida con bool(metrics), isinstance(beats, bool), bool(run_id).  
  4. Imprime `S33-T4-A PASS`.
- **Proposed feedback improvement:**  
  0.5 no supera 0.667 → beats False. Eso **no** es REJECT_UNLOGGED_RUN. El rechazo es para metrics vacías o run_id vacío: la derrota se loguea con honestidad.
- **Proposed retrospective:**  
  Validez del log ≠ victoria del modelo. El error clásico es filtrar “solo wins” y sesgar el historial de experimentos. Siguiente (E2): assess de log mal armado.
- **Code/output changes:** none
- **Validation notes:** assert meets_contract True and beats False — crítico; no tocar.

---

### S33-T4-A-E2 (weDo, independent)
- **Diagnosis:** Independiente: assess da PASS con metrics vacías. Instruction lista salidas; falta escena “adverso = mal logueado, no modelo perdedor”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Assess: REJECT_UNLOGGED_RUN sin metrics
- **Proposed preamble:**  
  - **Contexto:** el adverso del gate de tracking es un run sin metrics o sin run_id, **no** un beats_dummy False.  
  - **Meta:** enrutar log completo / vacío / sin campo metrics.  
  - **Éxito:** `PASS REJECT_UNLOGGED_RUN MISSING:metrics`.  
  - **Límites:** no castigues beats False; missing de metrics primero; valid puede llevar beats False.
- **Proposed instruction/description improvements:**  
  1. Revisa el assess que da PASS si not metrics (DEFECT).  
  2. PASS si metrics no vacías, beats_dummy presente y run_id truthy.  
  3. Mantén valid con beats False.  
  4. Imprime las tres salidas.
- **Proposed retrospective:**  
  Mal logueado ≠ perdió al dummy. El error clásico es mezclar ambos en el mismo if. Luego (E3): dual win/lose + REQUEST_METRICS.
- **Code/output changes:** none
- **Validation notes:** Output canónico intacto.

---

### S33-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer rico (cuatro salidas): CONTINUE CONTINUE REJECT REQUEST_METRICS. Starter exige beats True. Instruction ya es casi un mini-brief; sin preamble/retrospective formales ni title. Feedback fuerte.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tracking dual: victoria y derrota se loguean
- **Proposed preamble:**  
  - **Contexto:** el historial del workbench debe mostrar wins **y** losses frente al dummy 0.667.  
  - **Meta:** decide sobre win, lose, run vacío y sin metrics.  
  - **Éxito:** `CONTINUE CONTINUE REJECT_UNLOGGED_RUN REQUEST_METRICS`.  
  - **Límites:** no exijas beats True; missing metrics → REQUEST_METRICS; metrics {} o run_id '' → REJECT.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: exige victoria y missing→CONTINUE.  
  2. Calcula beats en win y lose (True y False).  
  3. CONTINUE si log completo (beats True o False); REJECT si vacío; REQUEST si falta metrics.  
  4. Imprime las cuatro decisiones en orden.
- **Proposed retrospective:**  
  Tracking responsable documenta ambas caras. El error clásico es ocultar derrotas “para el dashboard del jefe”. Pregunta: si la regla ya tiene acc 1.0, ¿basta beats_dummy True para promocionar?
- **Code/output changes:** none
- **Validation notes:** assert win True y lose False; cuatro salidas exactas — no alterar.

---

### S33-T4-B-DEMO (iDo)
- **Diagnosis:** Demo clara mean 0.65, n_groups 3, disjoint True. Falta preamble de “random split infla métricas con filas por entidad” y retrospective del misconception “contar filas = contar grupos”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Group CV por entidad evita leakage: la misma entidad no cae en train y valid del mismo fold. En esta demo, entities con e1 repetido dan **3** grupos (no 4 filas); mean de [0.6, 0.7, 0.65] con 3 decimales es 0.65; train {e1} y valid {e2,e3} son disjuntos. Observa `random_leak_ok False`: un split aleatorio con pares repetidos hace que el modelo “recuerde” al par.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: n_groups = len(set(...)) es perfilado; la prueba de group CV es disyunción; random split infla métricas con múltiples filas por entidad; el análisis de errores por slice se profundiza en S34. Puente a We Do: set, round 3 e isdisjoint.
- **Proposed retrospective:**  
  Disyunción por entidad es el contrato, no solo el mean de folds. El error clásico es len(entities) o confiar en KFold clásico. We Do: n_groups=3 y mean=0.65 exactos.
- **Code/output changes:** none
- **Validation notes:** Output mean/n_groups/disjoint alineado a theory T4-B.

---

### S33-T4-B-E1 (weDo, guided)
- **Diagnosis:** Guiado: len(entities), round 2, disjoint hardcode True. Instruction densa; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** n_groups, mean_fold y disyunción
- **Proposed preamble:**  
  - **Contexto:** CASO-LIM-033-4B exige entidades únicas, media de folds y train∩valid vacío.  
  - **Meta:** n_groups=3, mean=0.65, disjoint True.  
  - **Éxito:** `S33-T4-B PASS`.  
  - **Límites:** len(set(entities)); round(..., 3) no 2; calcula isdisjoint, no hardcodes True.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: len(entities), round 2, disjoint=True fijo (DEFECT).  
  2. n_groups = len(set(entities)).  
  3. mean con 3 decimales; disjoint con set(...).isdisjoint(...).  
  4. Imprime `S33-T4-B PASS`.
- **Proposed feedback improvement:**  
  e1 se repite: hay 3 grupos, no 4. round a 2 da 0.65 por casualidad en este fixture, pero el contrato del lab es 3 decimales. Hardcodear disjoint esconde un leak futuro.
- **Proposed retrospective:**  
  Tres chequeos: grupos, media, disyunción. El error clásico es contar filas. Siguiente (E2): assess con random_split True como adverso.
- **Code/output changes:** none
- **Validation notes:** Solution assert meets_contract True correcto.

---

### S33-T4-B-E2 (weDo, independent)
- **Diagnosis:** Independiente: n_groups=len, mean round 2, assess da PASS al random_split. Instruction lista salidas; falta escena de leakage entre folds.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Assess group CV sin random_split
- **Proposed preamble:**  
  - **Contexto:** random_split=True con entidades repetidas infla la métrica: el modelo ve al par en train y “acierta” en valid.  
  - **Meta:** n_groups/mean calculados + PASS / REJECT_RANDOM_LEAK / MISSING:entities.  
  - **Éxito:** `PASS REJECT_RANDOM_LEAK MISSING:entities`.  
  - **Límites:** n_groups de set; mean con 3 decimales; PASS solo random_split False y ≥2 grupos.
- **Proposed instruction/description improvements:**  
  1. Corrige n_groups y mean.  
  2. assess: missing entities primero; PASS con random_split False, n_groups>=2 y mean==0.65.  
  3. No des PASS al adverso random.  
  4. Imprime las tres salidas.
- **Proposed retrospective:**  
  Group CV se alimenta de cálculos, no de un dict pre-rellenado. El error clásico es “ya puse random_split False a mano” sin n_groups real. Luego (E3): REQUEST_GROUP_IDS.
- **Code/output changes:** none
- **Validation notes:** assert n_groups==3 y mean==0.65 en solution.

---

### S33-T4-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer CONTINUE / REJECT_RANDOM_LEAK / REQUEST_GROUP_IDS. Starter cuenta filas y missing→CONTINUE. Instruction ya nombra n_groups=3; sin preamble de “sin group ids no hay CV confiable”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** REQUEST_GROUP_IDS sin lista de entidades
- **Proposed preamble:**  
  - **Contexto:** sin ids de entidad no puedes garantizar disyunción entre folds: se pide la lista, no se inventa el split.  
  - **Meta:** n_groups=3 calculado y decide CONTINUE / REJECT_RANDOM_LEAK / REQUEST_GROUP_IDS.  
  - **Éxito:** `CONTINUE REJECT_RANDOM_LEAK REQUEST_GROUP_IDS`.  
  - **Límites:** n_groups = len(set(...)); missing → REQUEST_GROUP_IDS; random_split True → REJECT.
- **Proposed instruction/description improvements:**  
  1. Corrige n_groups a len(set(entities)).  
  2. Missing → `REQUEST_GROUP_IDS`.  
  3. CONTINUE solo random_split False y n_groups >= 2 (y coherente con set de entities).  
  4. Imprime las tres decisiones.
- **Proposed retrospective:**  
  n_groups se calcula de entidades únicas; sin group ids se pide evidencia. El error clásico es asumir KFold clásico “porque sklearn lo hace fácil”. Pregunta: ¿qué pasaría si e1 apareciera en train y valid del mismo fold?
- **Code/output changes:** none
- **Validation notes:** Transfer alineado a callout REQUEST_GROUP_IDS; assert n_groups==3.

---

### youDo (youDo)
- **Diagnosis:** Proyecto sólido de cierre CP-N3-B: framing → dummy+costo+regla → stump con thr defectuoso 0.9 → run log con beats_dummy/beats_rule → group CV. `context`, objectives, requirements, rubric y portfolioNote están bien armados. Falta `retrospective` de defensa (qué invariante demuestras, PII sintético, frase de impacto). El starter es un worked skeleton con defect intencional de thr — excelente para You Do.
- **Checklist:** context pass · goal pass · success partial (rubric, no output único) · constraints pass · retrospective fail
- **Severity:** P1
- **Proposed title:** (ya existe) Baseline vs. modelo: framing + tracking (CP-N3-B)
- **Proposed preamble:** N/A como campo We Do; el `context` actual es suficiente como escena. Opcional: una línea al inicio del context subrayando “elige thr sensato, recalcula beats, loguea aunque pierdas”.
- **Proposed instruction/description improvements:**  
  Mantener starter y requisitos. Añadir en objectives o portfolioNote (si el Fixer unifica): documentar en README por qué el thr elegido prioriza de forma sensata **sin** convertir el score en veredicto de fraude; incluir al menos un print o assert de disyunción train/valid.
- **Proposed retrospective:**  
  Antes de marcar listo: (1) ¿qué invariante demuestras — dual baseline documentado, seed en params, o disyunción de entidades? (2) ¿qué harías distinto con datos reales vs. sintéticos (PII, prevalencias distintas)? (3) Escribe en el README una frase de impacto medible (p. ej. “regla acc X vs stump Y; beats_rule=Z”) que puedas defender en 30 segundos sin overclaim de fraude.
- **Code/output changes:** none (thr=0.9 es defect intencional; el learner elige thr — no fijar un thr canónico en el reporte salvo que tests del sitio lo exijan más adelante)
- **Validation notes:** Rubric y portfolioNote ya empujan beats False válido y group CV; la retrospective cierra el hábito metacognitivo del You Do.

---

## Priority order

### P0 (We Do: title + preamble + instruction solo-tarea + retrospective; feedback si se indica)
1. S33-T1-A-E1, E2, E3 — framing / prevalencia / fallo cerrado de horizon  
2. S33-T1-B-E1, E2, E3 — dual baseline, cost, REQUEST_COST  
3. S33-T2-A-E1, E2, E3 — sigmoid, L2 documentada, REQUEST_SIGMOID  
4. S33-T2-B-E1, E2, E3 — ranking |coef|, scale flag  
5. S33-T3-A-E1, E2, E3 — stump, depth, REQUEST_STUMP  
6. S33-T3-B-E1, E2, E3 — gap 0.2, seed, REQUEST_SEED (aclarar E1 = caso **controlado** vs demo overfit)  
7. S33-T4-A-E1, E2, E3 — tracking honesto (victoria y derrota); **prioridad ética del lab**  
8. S33-T4-B-E1, E2, E3 — n_groups, random leak, REQUEST_GROUP_IDS  

### P1
- Las 8 demos iDo: añadir `preamble` + `retrospective`; ampliar `why` al rango 40–90 palabras  
- youDo: añadir `retrospective` de defensa  

### P2
- Acortar instructions We Do a pasos solo-tarea (40–100 palabras) **después** de mover contexto a preamble  
- Enriquecer feedback a 25–60 palabras con ancla de cola de revisión / workbench (varios ya están cerca del piso)  
- Opcional: una frase en youDo.context sobre thr defectuoso 0.9 como decisión de producto  

---

## Residual risks

1. **Confusión demo T3-B vs E1:** el demo ilustra overfit True (0.95/0.70); E1 practica el caso controlado (0.8/0.75). Sin preamble, el learner puede “forzar” overfit True para imitar el demo y fallar el PASS.  
2. **Instrucciones densas con ID de ejercicio:** al mover contexto a preamble, el Fixer debe **recortar** el instruction o quedará doble ensayo (bloat vs spec).  
3. **Vocabulario técnico (beats_dummy, l2_sq, group CV):** correcto para el nivel “Competente a experto”, pero el preamble debe seguir anclando en español concreto de cola de revisión; no solo jerga de métricas.  
4. **You Do thr abierto:** sin test automático de thr “óptimo”, el learner puede hardcodear thr que maximice train sin documentar beats_rule; la retrospective y el rubric deben empujar la comparación honesta.  
5. **S33 como gold tone de código:** el Fixer no debe “reescribir” fixtures ni outputs canónicos al añadir prosa; el riesgo de regresión de asserts es alto si se toca starter/solution.  
6. **No hay PII real en fixtures** — mantener esa política en cualquier ejemplo nuevo del Fixer (solo CASO-LIM-033 sintético).  

---

## Fixer handoff (checklist)

- [ ] 24 We Do: `title`, `preamble` (80–150 palabras o 4 bullets), `instruction` solo-tarea, `retrospective` (40–80 palabras)  
- [ ] 8 I Do: `preamble` + `retrospective`; `why` ampliado donde caiga corto  
- [ ] 1 You Do: `retrospective`  
- [ ] Feedback We Do en rango 25–60 palabras cuando quede en 1 frase seca  
- [ ] Outputs y asserts **intactos** salvo execute-and-diff justificado  
- [ ] Español PE profesional; sin PII real; sin generators  
- [ ] Fade E1→E2→E3 de **prosa** diferenciado (no tres preambles clones)  
- [ ] Build/typecheck de la sección tras editar el source  

Section 33 exercise pedagogy review complete. Ready for the Fixer prompt.
