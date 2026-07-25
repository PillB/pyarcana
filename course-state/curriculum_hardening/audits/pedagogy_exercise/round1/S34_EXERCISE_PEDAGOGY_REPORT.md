# S34 Exercise Pedagogy Report (Round 1)

## Section
- **title:** Métricas, desbalance, calibración y umbrales
- **shortTitle:** Métricas y umbrales
- **id:** `cv-ai-integration`
- **index:** 34
- **source:** `src/lib/course/sections/s34-cv-ai-integration.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades de práctica/demo)
- **subtemas:** S34-T1-A confusión/F1/AP · T1-B precision@k/capacidad · T2-A pesos/resample CV-safe · T2-B prevalencia · T3-A Brier/reliability · T3-B calibrador holdout · T4-A thr por costo · T4-B abstención/sensibilidad
- **hilo de caso:** cierre **CP-N3-B** del **Relationship Investigation Workbench** (Red Andina, ficticia); mini-set sintético **CASO-LIM-034** (scores del baseline S33 → cola de revisión humana); `REJECT_*` / `REQUEST_*` como políticas de cola; *score ≠ fraude* ni parentesco; sin PII real

## Method
- Leído `PEDAGOGY_EXERCISE_SPEC.md` (campos, longitudes, checklist preamble/retrospective, fade E1→E2→E3).
- Inspeccionado manualmente cada `iDo.steps[]` (8 demos), `weDo.steps[]` (24 ejercicios) y `youDo` en `s34-cv-ai-integration.ts` (iDo ~384–619, weDo ~621–2077, youDo ~2079–2218).
- Contrastado con el hilo de la sección: confusión completa → top-k bajo capacidad → rebalance solo en train → prevalencia junto a P/R → Brier y bins → mapa afín en `holdout_v1` → thr-vN por costo/capacidad → banda `skip`/`abstain`/`review`.
- **Sin** generadores, bucles, plantillas ni copy-paste mecánico entre unidades.
- Prosa propuesta en **español profesional peruano**, un objetivo primario por unidad.

## Hallazgos transversales (antes del ledger)

| Campo / hábito | Estado actual en S34 |
|----------------|----------------------|
| I Do `preamble` | **Ausente** en las 8 demos |
| I Do `retrospective` | **Ausente** en las 8 demos |
| I Do `description` | Presente y técnica (qué calcula el demo); no sustituye preamble formal (escena de cola + qué observar) |
| I Do `why` | Presente; casi siempre **1 frase** (bajo el piso 40–90 palabras del spec) |
| We Do `title` | **Ausente** en los 24 |
| We Do `preamble` | **Ausente** en los 24 |
| We Do `retrospective` | **Ausente** en los 24 |
| We Do `instruction` | Estilo denso “ID · fixture + DEFECT + salida esperada” embebido: meta, éxito y límites en un solo párrafo; legible para quien ya opera métricas de cola, **opaco** para newbie sin escena del workbench |
| We Do `feedback` | Presente en los 24; a menudo **pregunta de reflexión** (mejor que un “ok”); aún no cierra principio + misconception + transferencia como retrospective |
| Starter `# DEFECT:` | **Excelente** en todos; defectos bien nombrados y alineados a la solución |
| Hints | Progresivos; E1 nombra fórmulas/líneas (aceptable guiado); E2/E3 con menos migas; fade real de *contenido* |
| You Do marco | `context` / `objectives` / `requirements` / `rubric` / `portfolioNote` / starter **sólidos** (cierre CP-N3-B, thr por búsqueda, no copiar 0.6 del demo de 4 puntos) |
| You Do `retrospective` | **Ausente** |
| Código / outputs | Coherentes con theory y CASO-LIM-034; **no** proponer cambios de output salvo notas puntuales |

**Patrón dominante:** el andamiaje de *código* (fixtures `CASO-LIM-034-*`, DEFECT nombrados, outputs canónicos `S34-T*-* PASS` / `CONTINUE REJECT_* REQUEST_*`, fade E1 cálculo → E2 assess → E3 fail-closed, política `fraud_label=False`) es maduro y alineado al workbench. El andamiaje *pedagógico verbal* (preamble → instruction solo-tarea → retrospective) no existe. Un true newbie no responde con claridad: qué practico, por qué importa en una cola de revisión en Lima, cómo sé que gané, qué debe quedarme al cerrar la pestaña.

**Fade E1→E2→E3 (contenido):** progresión real por subtema (E1 repara el cálculo o la fórmula; E2 triages válido/adverso/missing; E3 decide CONTINUE / REJECT / REQUEST). **No** son tres clones con números distintos. El fade de *prosa* no se ve porque no hay preambles diferenciados.

**Severity default:** missing title+preamble+retrospective en We Do = **P0**; I Do sin preamble/retrospective = **P1** (aún tienen description+why+código); youDo sin retrospective = **P1**; polish de feedback/why = **P2** si caen preamble/instruction/retrospective.

---

## Unit ledger

### S34-T1-A-DEMO (iDo)
- **Diagnosis:** Worked example sólido: matriz completa, F1 y average precision de ranking, con `accuracy_only False`. La `description` nombra el skill; falta `preamble` que fije *qué observar* (TP/FP/FN/TN y por qué AP resume ranking sin thr) y `retrospective` del misconception “accuracy basta si el dashboard se ve bien”. El `why` es una frase.
- **Checklist:** context fail · goal partial · success partial (output visible) · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  En Red Andina el baseline de S33 ya da scores; hoy mides si la *decisión* binaria y el *ranking* son honestos. Esta demo arma confusión completa sobre `y=[1,0]` / `pred=[1,1]`, calcula F1 y average precision sobre un mini-ranking. No escribas aún: predice TP/FP/FN/TN, el F1 (~0.667) y el AP; observa que `accuracy_only` queda en `False`. Si solo publicaras accuracy, la cola de revisión humana se autovalida con un espejo.
- **Proposed instruction/description improvements:**  
  Mantener description. Ampliar `why` (~50–70 palabras): la matriz completa ancla P/R/F1; AP resume la calidad del ranking sin fijar thr; accuracy sola es `REJECT_ACCURACY_ONLY` bajo desbalance; TN importa para no “olvidar” verdaderos negativos en el informe. Puente a We Do: F1 armónica + TN contado, assess de política y fail-closed.
- **Proposed retrospective:**  
  Si puedes explicar por qué F1 no es `P+R` y por qué AP no es accuracy, ya tienes el hábito de métricas de cola. El error clásico es publicar un solo porcentaje de aciertos. En We Do repararás la media armónica y el conteo de TN.
- **Code/output changes:** none
- **Validation notes:** Output `tp_fp_fn_tn (1, 1, 0, 0)` / `f1 0.667` / `ap 0.833` alineado a theory T1-A.

---

### S34-T1-A-E1 (weDo, guided)
- **Diagnosis:** Drill guiado excelente: starter usa `f1 = p + r` y `tn = 0`. Instruction densa mezcla DEFECT, PASS y política; sin title, preamble ni retrospective. Feedback pregunta bien, pero no cierra metacognición formal.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** F1 armónica y TN contado
- **Proposed preamble:**  
  - **Contexto:** en `CASO-LIM-034-1A` la cola de Red Andina necesita confusión completa, no un F1 “a ojo” ni un TN inventado.  
  - **Meta:** contar TP/FP/FN/**TN** y calcular F1 como media armónica.  
  - **Éxito:** `S34-T1-A PASS` con `|f1 − 2/3| < 1e-9` y `tn == 1`.  
  - **Límites:** no cambies `y`/`pred`; no uses suma `p+r` como F1; no hardcodees `tn=0`.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `f1 = p + r` y `tn = 0` (DEFECT).  
  2. Cuenta TN con `zip` (pares y=0, pred=0).  
  3. Reemplaza F1 por `2·P·R/(P+R)` con guarda si P+R=0.  
  4. Imprime `S34-T1-A PASS` solo si pasan las dos condiciones del ok.
- **Proposed feedback improvement:**  
  Con P=0.5 y R=1.0 la media armónica es 2/3, no 1.5. TN=1 completa la matriz: sin él el informe miente aunque P y R “cuadran”.
- **Proposed retrospective:**  
  F1 castiga el desbalance entre P y R; sumar no es media armónica. El error clásico es ignorar TN porque “no va a la cola”. Siguiente (E2): triages PASS / REJECT / MISSING sobre counts.
- **Code/output changes:** none
- **Validation notes:** DEFECT bien nombrado; solution y output `S34-T1-A PASS` correctos.

---

### S34-T1-A-E2 (weDo, independent)
- **Diagnosis:** Buen foco independiente: predicado invertido (`PASS` si `accuracy_only True`). Instruction ya da salidas exactas; falta escena de “política de reporte” y cierre metacognitivo. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Assess: counts honestos vs accuracy sola
- **Proposed preamble:**  
  - **Contexto:** el workbench triages tres fixtures de confusión: válido, adverso (accuracy sola o counts cero) e incompleto (sin `tp`).  
  - **Meta:** reparar `assess` para que el predicado de dominio sea honesto.  
  - **Éxito:** `PASS REJECT_ACCURACY_ONLY MISSING:tp`.  
  - **Límites:** missing antes de leer campos; `region`/`team` son contexto, no gates; no inventes `tp`.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: da PASS cuando `accuracy_only` es True (DEFECT).  
  2. Mantén la rama `MISSING:` primero.  
  3. PASS solo si `accuracy_only is False` y suma de counts ≥ 1.  
  4. Imprime las tres rutas en un solo print.
- **Proposed retrospective:**  
  Ausencia de campo ≠ breach de contenido: primero MISSING, luego REJECT por política. El error clásico es mezclar “falta evidencia” con “evidencia mala”. Luego (E3): CONTINUE / REJECT / REQUEST.
- **Code/output changes:** none
- **Validation notes:** E2 con menos migas; output canónico intacto.

---

### S34-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transferencia real a fail-closed operativo: missing→CONTINUE e invertido. Instruction clara; falta anclar a compliance y retrospective de “no fabricar matriz”. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Fail-closed: REQUEST_CONFUSION
- **Proposed preamble:**  
  - **Contexto:** en el gate del workbench, un informe a compliance no puede inventar counts ni seguir si solo hay accuracy.  
  - **Meta:** mapear válido → CONTINUE, adverso → REJECT_ACCURACY_ONLY, sin `tp` → REQUEST_CONFUSION.  
  - **Éxito:** `CONTINUE REJECT_ACCURACY_ONLY REQUEST_CONFUSION`.  
  - **Límites:** no rellenes evidencia; no uses CONTINUE ante missing; no inviertas el predicado.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: missing devuelve CONTINUE y el pred está invertido.  
  2. Sin `tp` → `REQUEST_CONFUSION`.  
  3. Con datos: CONTINUE solo si accuracy_only False y hay al menos un count no nulo.  
  4. Imprime las tres decisiones.
- **Proposed retrospective:**  
  REQUEST_* protege mejor que inventar `tp=0`: ausencia no es “cero observados”. El error clásico es fallar abierto. Pregunta: ¿qué dirías a compliance si el reporte llega sin matriz?
- **Code/output changes:** none
- **Validation notes:** Transfer auténtico; alineado a glosario REJECT/REQUEST de theory.

---

### S34-T1-B-DEMO (iDo)
- **Diagnosis:** Demo clara de precision@k, recall@k y overload. Description útil; falta preamble de “k = capacidad del turno” y retrospective del misconception “maximizar recall@k sin mirar load”. `why` de una frase.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  En un workbench de relaciones no revisas el universo: miras el top-k del ranking porque el equipo tiene tope diario. Esta demo calcula precision@3 y recall@3 sobre labels ya ordenados, y marca overload cuando 50 alertas superan capacidad 10. No escribas: predice 0.667, 1.0 y `True`; piensa qué pasa si optimizas solo el notebook y saturas a tres analistas.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: precision@k mide calidad del recorte; recall@k mide cobertura de positivos; capacity y thr viajan juntos; overload es breach operativo, no detalle de UX. Puente a We Do: fórmula de recall, assess de cola y REQUEST_CAPACITY.
- **Proposed retrospective:**  
  Top-k sin capacidad es métrica de pizarra, no de turno. El error clásico es dividir recall entre k. We Do: corrige recall@k y triages overload.
- **Code/output changes:** none
- **Validation notes:** Output `0.667` / `1.0` / `overload True` alineado a theory T1-B.

---

### S34-T1-B-E1 (weDo, guided)
- **Diagnosis:** Starter divide recall entre k — defecto guiado ideal. Instruction densa con PASS; sin title/preamble/retrospective. Feedback pregunta conceptualmente bien.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** recall@k divide entre n_pos
- **Proposed preamble:**  
  - **Contexto:** en `CASO-LIM-034-1B` mides el top-3 de una cola con capacidad 10 y load 8.  
  - **Meta:** corregir precision@k y recall@k (denominadores distintos).  
  - **Éxito:** `S34-T1-B PASS` con precision≈0.667, recall=1.0 y load ≤ capacity.  
  - **Límites:** no uses k como denominador de recall; no ignores capacity en el ok.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `recall_at_k` divide entre k (DEFECT).  
  2. Usa `sum(labels[:k]) / n_pos` (con guarda si n_pos=0).  
  3. Mantén precision = suma / k.  
  4. Exige también `load <= capacity` antes del PASS.
- **Proposed feedback improvement:**  
  Precision@k es “qué tan limpio es el top”; recall@k es “cuántos positivos del set atrapaste”. Mezclar denominadores rompe el informe del turno.
- **Proposed retrospective:**  
  k y n_pos no son intercambiables. El error clásico es “misma fórmula dos veces”. Siguiente (E2): assess de overload vs missing capacity.
- **Code/output changes:** none
- **Validation notes:** Solution y output `S34-T1-B PASS` correctos.

---

### S34-T1-B-E2 (weDo, independent)
- **Diagnosis:** Predicado invertido (PASS si load > capacity). Instruction ya lista salidas; falta escena de cola-mañana en Lima. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Assess: load vs capacity
- **Proposed preamble:**  
  - **Contexto:** la cola `cola-revision-manana` en Lima-sintética reporta precision@k, load y capacity.  
  - **Meta:** PASS solo con load ≤ capacity y precision en [0,1]; overload y missing con códigos distintos.  
  - **Éxito:** `PASS REJECT_QUEUE_OVERLOAD MISSING:capacity`.  
  - **Límites:** missing primero; `region`/`queue` no son predicados; no inventes capacity.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: PASS cuando load > capacity (DEFECT).  
  2. Invierte el predicado y valida rango de precision_at_k.  
  3. Mantén MISSING:capacity si falta la clave.  
  4. Imprime las tres rutas.
- **Proposed retrospective:**  
  Una cola brillante en el notebook y saturada en el turno es breach. El error clásico es maximizar recall@k ignorando headcount. Luego (E3): REQUEST_CAPACITY en fail-closed.
- **Code/output changes:** none
- **Validation notes:** Output canónico intacto.

---

### S34-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Fail-closed de capacidad: missing→CONTINUE e invertido. Instruction telegráfica pero completa; falta ancla de “no default de 100 alertas/día”. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Fail-closed: REQUEST_CAPACITY
- **Proposed preamble:**  
  - **Contexto:** sin capacidad documentada no hay thr operativo defendible ante el equipo de 3 analistas.  
  - **Meta:** CONTINUE / REJECT_QUEUE_OVERLOAD / REQUEST_CAPACITY.  
  - **Éxito:** `CONTINUE REJECT_QUEUE_OVERLOAD REQUEST_CAPACITY`.  
  - **Límites:** no rellenes capacity por defecto; no CONTINUEs ante missing.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: missing→CONTINUE y pred invertido.  
  2. Sin capacity → REQUEST_CAPACITY.  
  3. CONTINUE solo con load ≤ capacity y precision válida.  
  4. Imprime las tres decisiones.
- **Proposed retrospective:**  
  Pedir capacity es más seguro que asumir 100 alertas/día. El error clásico es un default “generoso” que quema al equipo. Pregunta: ¿qué thr elegirías sin conocer el tope del turno?
- **Code/output changes:** none
- **Validation notes:** Transfer alineado a policy REQUEST_CAPACITY.

---

### S34-T2-A-DEMO (iDo)
- **Diagnosis:** Demo clara de weight_ratio y plan CV-safe. Description nombra el skill; falta preamble de “dos cajas train/test” y retrospective del misconception “resample global mejora el modelo”. `why` corto.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Con nueve negativos por un positivo, el optimizador puede ignorar la minoría. Esta demo muestra `weight_ratio=9.0` y un plan de fold con rebalance solo en train (`resample_global=False`). No escribas: predice el dict del plan y por qué tocar el test del fold inflaría la validación respecto a producción.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: weights/resample reequilibran la señal solo en train; resample global contamina validación (`REJECT_LEAKY_RESAMPLE`); sin n1 no hay ratio (`REQUEST_WEIGHTS`). Puente a We Do: `not resample_global`, assess y REQUEST_WEIGHTS.
- **Proposed retrospective:**  
  CV-safe = rebalance en train, test intacto. El error clásico es “balancear todo el CSV al inicio”. We Do: corrige el flag invertido y cierra la política.
- **Code/output changes:** none
- **Validation notes:** Output `9.0` / plan train-only / `resample_global False` correcto.

---

### S34-T2-A-E1 (weDo, guided)
- **Diagnosis:** Starter pone `resample_train_only = resample_global` — defecto guiado perfecto. Instruction densa; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Plan CV-safe: not resample_global
- **Proposed preamble:**  
  - **Contexto:** en `CASO-LIM-034-2A` documentas el ratio de clase y el plan del fold antes de entrenar.  
  - **Meta:** ratio 9.0 y `resample_train_only=True` cuando `resample_global=False`.  
  - **Éxito:** `S34-T2-A PASS`.  
  - **Límites:** `resample_train_only = not resample_global`; n1 > 0; no toques el test del fold.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: el flag de train-only copia el global (DEFECT).  
  2. Cambia a `not resample_global`.  
  3. Mantén weight_ratio = n0/n1 (float 9.0).  
  4. Imprime PASS solo si ratio, flag y n1 cumplen.
- **Proposed retrospective:**  
  El flag “train only” es la negación del resample global, no su copia. El error clásico es leakage por un booleano al revés. Siguiente (E2): assess de política de fold.
- **Code/output changes:** none
- **Validation notes:** Output `S34-T2-A PASS` correcto.

---

### S34-T2-A-E2 (weDo, independent)
- **Diagnosis:** PASS con resample_global True — buen adverso. Instruction lista salidas; falta escena de “auditoría del ratio”. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Assess: sin resample global
- **Proposed preamble:**  
  - **Contexto:** el workbench revisa si el plan de fold es auditable: n0, n1 y política de resample.  
  - **Meta:** PASS con CV-safe; REJECT_LEAKY_RESAMPLE si hay resample global; MISSING:n1 si falta minoría.  
  - **Éxito:** `PASS REJECT_LEAKY_RESAMPLE MISSING:n1`.  
  - **Límites:** missing primero; exige n1>0 y n0>n1; no inventes minority counts.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: PASS si resample_global es True (DEFECT).  
  2. Invierte: PASS solo con False + n1>0 + n0>n1.  
  3. Mantén MISSING:n1.  
  4. Imprime las tres rutas.
- **Proposed retrospective:**  
  Sin n1 no hay weight ratio defendible. El error clásico es “poner pesos a ojo”. Luego (E3): REQUEST_WEIGHTS en fail-closed.
- **Code/output changes:** none
- **Validation notes:** Output canónico intacto.

---

### S34-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Fail-closed de pesos: missing→CONTINUE e invertido. Instruction corta; falta ancla de auditoría de modelo. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Fail-closed: REQUEST_WEIGHTS
- **Proposed preamble:**  
  - **Contexto:** un reporte de modelo sin conteo de minoría no se puede auditar en el workbench.  
  - **Meta:** CONTINUE / REJECT_LEAKY_RESAMPLE / REQUEST_WEIGHTS.  
  - **Éxito:** `CONTINUE REJECT_LEAKY_RESAMPLE REQUEST_WEIGHTS`.  
  - **Límites:** no inventes n1; no CONTINUEs ante missing.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: missing→CONTINUE y pred invertido.  
  2. Sin n1 → REQUEST_WEIGHTS.  
  3. CONTINUE solo con política CV-safe.  
  4. Imprime las tres decisiones.
- **Proposed retrospective:**  
  REQUEST_WEIGHTS evita ratios fantasmas en el informe. El error clásico es rellenar n1=1 “para que corra”. Pregunta: ¿qué métrica de validación se infla con resample global?
- **Code/output changes:** none
- **Validation notes:** Transfer alineado a REJECT_LEAKY_RESAMPLE / REQUEST_WEIGHTS.

---

### S34-T2-B-DEMO (iDo)
- **Diagnosis:** Demo corta y clara: prevalencia 0.025 y all-neg 0.975. Falta preamble de “di la base rate en voz alta” y retrospective del misconception “accuracy 97.5% = modelo bueno”. `why` mínimo.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  La prevalencia ancla toda interpretación de precision. Esta demo calcula 25/1000 = 0.025 y muestra que un clasificador all-negative luce 0.975 en accuracy sin mandar a nadie a cola. No escribas: predice los tres prints y por qué `accuracy_enough` debe quedar en False en un tablero de revisión.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: base rate cambia entre trimestres; comparar P sin prevalencia engaña; all-neg es el truco barato del dashboard. Puente a We Do: accuracy_enough=False, assess y REQUEST_BASE_RATE.
- **Proposed retrospective:**  
  Sin base rate, precision no es comparable entre periodos. El error clásico es celebrar accuracy alta con clase rara. We Do: rechaza ceguera de prevalencia.
- **Code/output changes:** none
- **Validation notes:** Output `0.025` / `0.975` / `False` correcto.

---

### S34-T2-B-E1 (weDo, guided)
- **Diagnosis:** Starter deja `accuracy_enough=True` — defecto guiado perfecto. Instruction densa; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Prevalencia baja: accuracy no basta
- **Proposed preamble:**  
  - **Contexto:** en `CASO-LIM-034-2B` hay 25 positivos de 1000; el panel ejecutivo se enamora del all-neg.  
  - **Meta:** calcular prev y all_neg_acc, y marcar accuracy_enough=False.  
  - **Éxito:** `S34-T2-B PASS` con prev en (0, 0.5) y accuracy_enough False.  
  - **Límites:** no dejes accuracy_enough=True; no inventes prevalencia distinta del fixture.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: accuracy_enough=True (DEFECT).  
  2. Calcula prevalence = pos/n y all_neg_acc = 1 − prev.  
  3. Fija accuracy_enough = False.  
  4. Imprime PASS solo si el ok del contrato se cumple.
- **Proposed retrospective:**  
  All-neg accuracy ≈ 1 − prev: brilla cuando la clase positiva es rara y no prioriza cola. El error clásico es “97.5% ya está bien”. Siguiente (E2): assess con period/region de contexto.
- **Code/output changes:** none
- **Validation notes:** Output `S34-T2-B PASS` correcto.

---

### S34-T2-B-E2 (weDo, independent)
- **Diagnosis:** Predicado invertido en assess de prevalencia. Instruction ya da salidas; falta escena Q1 vs Q2. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Assess: base rate honesta
- **Proposed preamble:**  
  - **Contexto:** el reporte del period 2024-Q3-sintético en Lima debe llevar prevalencia y renunciar a accuracy sola.  
  - **Meta:** PASS si accuracy_enough False y 0 < prev < 0.5; adverso y missing con códigos distintos.  
  - **Éxito:** `PASS REJECT_PREVALENCE_BLIND MISSING:prevalence`.  
  - **Límites:** missing primero; no uses solo all_neg_acc como gate.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: PASS si accuracy_enough True (DEFECT).  
  2. Invierte y exige rango de prevalencia.  
  3. Mantén MISSING:prevalence.  
  4. Imprime las tres rutas.
- **Proposed retrospective:**  
  Comparar precision entre trimestres sin base rate hace “ganar” al modelo por cambio de población. El error clásico es omitir prevalencia en el slide. Luego (E3): REQUEST_BASE_RATE.
- **Code/output changes:** none
- **Validation notes:** Output canónico intacto.

---

### S34-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Fail-closed de base rate. Instruction corta; feedback pide frase de compliance — buen germen de retrospective, pero el campo formal falta.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Fail-closed: REQUEST_BASE_RATE
- **Proposed preamble:**  
  - **Contexto:** compliance no acepta un informe de cola sin base rate ni con accuracy “suficiente” por decreto.  
  - **Meta:** CONTINUE / REJECT_PREVALENCE_BLIND / REQUEST_BASE_RATE.  
  - **Éxito:** `CONTINUE REJECT_PREVALENCE_BLIND REQUEST_BASE_RATE`.  
  - **Límites:** no inventes prev=0.5; no CONTINUEs ante missing.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: missing→CONTINUE y pred invertido.  
  2. Sin prevalence → REQUEST_BASE_RATE.  
  3. CONTINUE solo con accuracy_enough False y prev en (0, 0.5).  
  4. Imprime las tres decisiones.
- **Proposed retrospective:**  
  Frase de portafolio: “Con prevalencia 2.5%, predecir siempre no-revisar da 97.5% de accuracy y cero priorización.” El error clásico es callar la base rate. Pregunta: ¿qué cambia en precision si la prevalencia cae y el thr se mantiene?
- **Code/output changes:** none
- **Validation notes:** Transfer alineado a REJECT_PREVALENCE_BLIND.

---

### S34-T3-A-DEMO (iDo)
- **Diagnosis:** Demo sólida de Brier medio y bin desalineado (0.85 vs 0.5). Falta preamble de “score 0.8 ≠ 80% de culpa” y retrospective del misconception “un punto perfecto calibra el modelo”. `why` corto.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Un score de priorización no es veredicto de culpa. Esta demo calcula Brier medio sobre un mini-set y un bin [0.7, 1.0) con mean_p=0.85 y freq=0.5: el bin miente. No escribas: predice brier 0.175 y `calibrated False`; resiste la tentación de confiar en un solo caso perfecto.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: Brier promedia (p−y)²; reliability contrasta mean_p vs frecuencia; un punto no basta; medición fuera del set de fit del calibrador (T3-B). Puente a We Do: media del set, assess y REQUEST_BRIER.
- **Proposed retrospective:**  
  Calibración se mide en conjunto y en bins, no en un solo acierto. El error clásico es “p=1, y=1 ⇒ ya está”. We Do: Brier medio 0.25 en un mini-set equilibrado.
- **Code/output changes:** none
- **Validation notes:** Output `brier 0.175` / `bin (0.85, 0.5)` / `calibrated False` correcto.

---

### S34-T3-A-E1 (weDo, guided)
- **Diagnosis:** Starter usa Brier de un solo punto (1,1) — defecto guiado ideal. Instruction densa; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Brier medio del set, no de un punto
- **Proposed preamble:**  
  - **Contexto:** en `CASO-LIM-034-3A` evalúas si el score se puede leer como probabilidad de priorización.  
  - **Meta:** Brier medio sobre `ps=[0.5,0.5]`, `ys=[0,1]` y bin alineado.  
  - **Éxito:** `S34-T3-A PASS` con brier==0.25 y |mean_p−freq|≤0.1.  
  - **Límites:** no uses un solo par (1,1); promedia (p−y)² sobre todo el set.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: brier de un punto perfecto (DEFECT).  
  2. Reemplaza por media de (p−y)² con zip.  
  3. Calcula mean_p y freq del set.  
  4. Imprime PASS solo si ambas condiciones del ok se cumplen.
- **Proposed retrospective:**  
  Un Brier de un caso no demuestra calibración del modelo. El error clásico es “elegir el ejemplo que luce bien”. Siguiente (E2): assess con umbrales del contrato.
- **Code/output changes:** none
- **Validation notes:** Output `S34-T3-A PASS` correcto.

---

### S34-T3-A-E2 (weDo, independent)
- **Diagnosis:** Predicado invertido (PASS si desalineado). Instruction lista salidas; falta distinción discriminación vs calibración en preamble. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Assess: Brier y bin alineados
- **Proposed preamble:**  
  - **Contexto:** el workbench exige Brier y un bin de reliability antes de tratar el score como probabilidad útil.  
  - **Meta:** PASS con brier≤0.25 y |mean_p−freq|≤0.1; adverso y missing con códigos distintos.  
  - **Éxito:** `PASS REJECT_UNCALIBRATED MISSING:brier`.  
  - **Límites:** missing primero; no apruebes desalineación grande.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: PASS si |mean_p−freq| > 0.3 (DEFECT).  
  2. Exige alineación ≤0.1 y brier ≤0.25.  
  3. Mantén MISSING:brier.  
  4. Imprime las tres rutas.
- **Proposed retrospective:**  
  Bins alineados con Brier alto cuentan otra historia (calibración vs discriminación). El error clásico es mirar solo un número. Luego (E3): REQUEST_BRIER.
- **Code/output changes:** none
- **Validation notes:** Output canónico intacto.

---

### S34-T3-A-E3 (weDo, transfer)
- **Diagnosis:** Fail-closed de Brier. Instruction corta; feedback ya pide frase de portafolio — germen de retrospective, campo formal ausente.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Fail-closed: REQUEST_BRIER
- **Proposed preamble:**  
  - **Contexto:** sin Brier en el reporte no hay evidencia de que el score sea probabilidad de priorización (no de culpa).  
  - **Meta:** CONTINUE / REJECT_UNCALIBRATED / REQUEST_BRIER.  
  - **Éxito:** `CONTINUE REJECT_UNCALIBRATED REQUEST_BRIER`.  
  - **Límites:** no inventes brier=0.0 “perfecto”; no CONTINUEs ante missing.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: missing→CONTINUE y pred invertido.  
  2. Sin brier → REQUEST_BRIER.  
  3. CONTINUE con umbrales del contrato de reliability.  
  4. Imprime las tres decisiones.
- **Proposed retrospective:**  
  Frase de portafolio: “El score ordena revisión humana; no afirma culpa ni parentesco.” El error clásico es rellenar Brier cero para pasar el gate. Pregunta: ¿por qué clip a [0,1] no basta como calibración?
- **Code/output changes:** none
- **Validation notes:** Transfer alineado a REJECT_UNCALIBRATED / REQUEST_BRIER.

---

### S34-T3-B-DEMO (iDo)
- **Diagnosis:** Demo clara de mapa afín + clip en holdout_v1. Falta preamble de “dónde se ajustó vs dónde se midió” y retrospective del misconception “clip = calibración”. `why` corto.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Platt real vive en sklearn; aquí un mapa afín `clip(a·raw + b)` simula el contrato del workbench: coeficientes de `holdout_v1`, no del test final. Esta demo transforma `[1.5, -0.2, 0.4]` en `[1.0, 0.0, 0.42]`. No escribas: predice la lista y por qué `train_in_sample` activaría REJECT_IN_SAMPLE_CAL.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: calibrar fuera de muestra evita autoengaño; clip solo no aprende mean_p vs freq; documenta set versionado. Puente a We Do: a·x+b, assess holdout y REQUEST_CAL_SET.
- **Proposed retrospective:**  
  Clip recorta rango; calibración aprende la relación score–frecuencia. El error clásico es fit in-sample. We Do: repara el mapa y cierra la política del set.
- **Code/output changes:** none
- **Validation notes:** Output `[1.0, 0.0, 0.42]` / `holdout_v1` correcto.

---

### S34-T3-B-E1 (weDo, guided)
- **Diagnosis:** Starter solo clip sin a·x+b — defecto guiado excelente. Instruction densa; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Mapa afín en holdout (no solo clip)
- **Proposed preamble:**  
  - **Contexto:** en `CASO-LIM-034-3B` aplicas el calibrador simplificado de holdout_v1 a tres scores crudos.  
  - **Meta:** `cal_i = clip(a·x + b)` con a=0.8, b=0.1.  
  - **Éxito:** `S34-T3-B PASS` con cal == [1.0, 0.0, 0.42] y set holdout.  
  - **Límites:** no uses solo min/max del raw; misma longitud raw/cal; set debe empezar por holdout.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: clip sin a·x+b (DEFECT).  
  2. Aplica `round(min(1, max(0, a*x+b)), 2)`.  
  3. Mantén calibrator_set = "holdout_v1".  
  4. Imprime PASS solo si cal, set y longitudes cumplen.
- **Proposed retrospective:**  
  Clip sin coeficientes no es calibración: no mueve mean_p hacia freq. El error clásico es “ya está en [0,1]”. Siguiente (E2): assess del nombre del set.
- **Code/output changes:** none
- **Validation notes:** Output `S34-T3-B PASS` correcto.

---

### S34-T3-B-E2 (weDo, independent)
- **Diagnosis:** PASS con train_in_sample — buen adverso de auditoría. Instruction lista salidas; falta escena de versionado. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Assess: calibrator_set holdout
- **Proposed preamble:**  
  - **Contexto:** el reporte del workbench debe nombrar el set de calibración versionado y alinear longitudes.  
  - **Meta:** PASS con startswith('holdout') y misma longitud; REJECT si train_in_sample; MISSING sin set.  
  - **Éxito:** `PASS REJECT_IN_SAMPLE_CAL MISSING:calibrator_set`.  
  - **Límites:** missing primero; no apruebes fit in-sample.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: PASS si set == train_in_sample (DEFECT).  
  2. Exige startswith('holdout') y len(raw)==len(cal).  
  3. Mantén MISSING:calibrator_set.  
  4. Imprime las tres rutas.
- **Proposed retrospective:**  
  Sin set versionado no hay auditoría de “dónde se ajustó”. El error clásico es callar el holdout. Luego (E3): REQUEST_CAL_SET.
- **Code/output changes:** none
- **Validation notes:** Output canónico intacto.

---

### S34-T3-B-E3 (weDo, transfer)
- **Diagnosis:** Fail-closed de set de calibración. Instruction corta; feedback pide política de una línea — germen de retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Fail-closed: REQUEST_CAL_SET
- **Proposed preamble:**  
  - **Contexto:** la política del README debe decir *dónde se ajusta* el calibrador y *dónde se mide* Brier.  
  - **Meta:** CONTINUE / REJECT_IN_SAMPLE_CAL / REQUEST_CAL_SET.  
  - **Éxito:** `CONTINUE REJECT_IN_SAMPLE_CAL REQUEST_CAL_SET`.  
  - **Límites:** nunca fit en el test final del reporte; no CONTINUEs ante missing.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: missing→CONTINUE y pred invertido.  
  2. Sin set → REQUEST_CAL_SET.  
  3. CONTINUE solo con holdout + misma longitud.  
  4. Imprime las tres decisiones.
- **Proposed retrospective:**  
  Política en una línea: “Fit en holdout_vN; Brier en split no usado para fit; nunca en test final.” El error clásico es training-serving skew de probabilidades. Pregunta: ¿qué thr de T4 se rompe si calibras in-sample?
- **Code/output changes:** none
- **Validation notes:** Transfer alineado a REJECT_IN_SAMPLE_CAL / REQUEST_CAL_SET.

---

### S34-T4-A-DEMO (iDo)
- **Diagnosis:** Demo clara de choose_thr por costo bajo capacidad 2 → thr 0.6, cost 0. Falta preamble de “thr no es el default 0.5” y retrospective del misconception “el thr lo da la librería”. `why` corto. Nota: You Do usa 5 puntos y thr distinto — la demo debe advertir no copiar 0.6 de memoria.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Con scores calibrados, el umbral es decisión de producto: costo FP/FN y capacidad del equipo. Esta demo busca thr sobre cuatro puntos y capacidad 2; el óptimo es 0.6 con costo 0 y thr-v1. No escribas: predice thr y cost; **no memorices 0.6** — en el You Do con cinco puntos el óptimo cambia.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: itera candidatos, descarta n_review > capacity o 0, minimiza fp·c_fp+fn·c_fn, versiona thr-vN. Puente a We Do: búsqueda real, assess de thr_id y REQUEST_COST_MATRIX.
- **Proposed retrospective:**  
  Thr versionado = auditoría y rollback cuando cambia headcount o prevalencia. El error clásico es thr fijo 0.5. We Do: implementa la búsqueda y cierra la política de costos.
- **Code/output changes:** none
- **Validation notes:** Output `thr 0.6 cost 0` / `thr-v1` correcto; You Do avisa thr distinto en 5 puntos.

---

### S34-T4-A-E1 (weDo, guided)
- **Diagnosis:** Starter fija thr=0.5 sin buscar — defecto guiado perfecto. Instruction densa; sin title/preamble/retrospective. Feedback pregunta bien por c_fn↑.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Búsqueda de thr por costo y capacidad
- **Proposed preamble:**  
  - **Contexto:** en `CASO-LIM-034-4A` eliges thr de cola con c_fp=2, c_fn=10 y capacity=2.  
  - **Meta:** minimizar costo sujeto a n_review ≤ capacity y n_review ≥ 1.  
  - **Éxito:** `S34-T4-A PASS` con thr==0.6, cost==0 y thr_id thr-v*.  
  - **Límites:** no hardcodees 0.5; no copies thr sin recorrer candidatos; versiona thr-v1.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: thr fijo 0.5 (DEFECT).  
  2. Itera thr en sorted(set(scores)).  
  3. Descarta n_review > capacity o 0; minimiza fp*c_fp+fn*c_fn.  
  4. Asigna thr_id thr-v1 e imprime PASS si thr y cost cumplen.
- **Proposed feedback improvement:**  
  Con capacidad 2, thr 0.6 deja los dos positivos sin FP (costo 0). Un thr 0.5 satura o sube costo: por eso se busca, no se fija.
- **Proposed retrospective:**  
  Si c_fn sube, el thr óptimo suele bajar (más cola, menos misses). El error clásico es el default de librería. Siguiente (E2): assess de thr_id y cost.
- **Code/output changes:** none
- **Validation notes:** Output `S34-T4-A PASS` correcto.

---

### S34-T4-A-E2 (weDo, independent)
- **Diagnosis:** PASS con thr_id default — buen adverso de versionado. Instruction lista salidas; falta escena de headcount 10→6. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Assess: thr-v* con cost documentado
- **Proposed preamble:**  
  - **Contexto:** el team cola-relaciones en Lima versiona thr cuando cambia headcount o costos.  
  - **Meta:** PASS con thr-v*, cost not None y n_review≥1; default/None → REJECT; sin cost → MISSING.  
  - **Éxito:** `PASS REJECT_FIXED_THR MISSING:cost`.  
  - **Límites:** missing primero; no apruebes thr_id='default'.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: PASS si thr_id == default (DEFECT).  
  2. Exige startswith('thr-v'), cost is not None y n_review ≥ 1.  
  3. Mantén MISSING:cost.  
  4. Imprime las tres rutas.
- **Proposed retrospective:**  
  thr-v1 vs thr-v2 permite rollback cuando el equipo pasa de 10 a 6 analistas. El error clásico es thr “default” sin matriz de costos. Luego (E3): REQUEST_COST_MATRIX.
- **Code/output changes:** none
- **Validation notes:** Output canónico intacto.

---

### S34-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Fail-closed de matriz de costos. Instruction corta; feedback pide frase a auditor — germen de retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Fail-closed: REQUEST_COST_MATRIX
- **Proposed preamble:**  
  - **Contexto:** un auditor no acepta “el thr mágico 0.5 de la librería” sin costos ni capacidad.  
  - **Meta:** CONTINUE / REJECT_FIXED_THR / REQUEST_COST_MATRIX.  
  - **Éxito:** `CONTINUE REJECT_FIXED_THR REQUEST_COST_MATRIX`.  
  - **Límites:** no asumas c_fp=c_fn=1 en silencio; no CONTINUEs ante missing cost.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: missing→CONTINUE y pred invertido.  
  2. Sin cost → REQUEST_COST_MATRIX.  
  3. CONTINUE con thr-v* y cost documentado.  
  4. Imprime las tres decisiones.
- **Proposed retrospective:**  
  Frase a auditor: “El thr se eligió minimizando costo esperado bajo capacidad del turno y se versionó thr-v1.” El error clásico es thr fijo sin evidencia. Pregunta: ¿qué haces si capacity cae a la mitad?
- **Code/output changes:** none
- **Validation notes:** Transfer alineado a REJECT_FIXED_THR / REQUEST_COST_MATRIX.

---

### S34-T4-B-DEMO (iDo)
- **Diagnosis:** Demo clara de decide() con abstain y sensibilidad thr 0.5→0.6. Falta preamble de “zona gris = primera clase” y retrospective del misconception “forzar 0/1 es más profesional”. `why` corto.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Entre skip y review hay banda gris. Forzar label fabrica confianza falsa. Esta demo devuelve abstain en 0.5, skip en 0.15, review en 0.9, y cuenta 1 flip al mover thr 0.5→0.6. No escribas: predice las salidas y por qué force_label queda en False en el cierre de CP-N3-B.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: abstain protege sujeto y analista; sensibilidad evita thr frágil; matching ≠ fraude. Puente a We Do: repara banda, assess force_1 y REQUEST_ABSTAIN_BAND.
- **Proposed retrospective:**  
  Abstener es salida de producto, no un error del pipeline. El error clásico es force_1 en zona gris. We Do: decide(0.5)==abstain y política fail-closed.
- **Code/output changes:** none
- **Validation notes:** Output `abstain` / `n_flip 1` / `force_label False` correcto.

---

### S34-T4-B-E1 (weDo, guided)
- **Diagnosis:** Starter devuelve review en banda — defecto guiado ideal para REJECT_FORCE_LABEL. Instruction densa; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Banda gris: devolver abstain
- **Proposed preamble:**  
  - **Contexto:** en `CASO-LIM-034-4B` el score 0.5 cae entre low=0.3 y high=0.7; no debe forzar cola.  
  - **Meta:** implementa decide() con skip / abstain / review.  
  - **Éxito:** `S34-T4-B PASS` con decide(0.5)=abstain, (0.1)=skip, (0.9)=review.  
  - **Límites:** no devuelvas force_1 ni labels binarios en zona gris.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: en banda devuelve review (DEFECT).  
  2. Cambia el else a return "abstain".  
  3. Mantén las ramas < low y > high.  
  4. Imprime PASS solo si las tres pruebas del ok pasan.
- **Proposed feedback improvement:**  
  Forzar review en 0.5 satura la cola y finge certeza. Abstain deja el caso a política humana o a un segundo look.
- **Proposed retrospective:**  
  Zona gris ≠ “casi review”. El error clásico es sesgar la banda hacia un solo lado. Siguiente (E2): assess de decision vs force_1.
- **Code/output changes:** none
- **Validation notes:** Output `S34-T4-B PASS` correcto.

---

### S34-T4-B-E2 (weDo, independent)
- **Diagnosis:** PASS con force_1 — buen adverso. Instruction lista salidas; falta escena de sujeto investigado. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Assess: abstain en banda documentada
- **Proposed preamble:**  
  - **Contexto:** el workbench solo aprueba registros en banda con decision=abstain y low/high documentados.  
  - **Meta:** PASS con low < score < high y decision abstain; force_1 → REJECT; sin low → MISSING.  
  - **Éxito:** `PASS REJECT_FORCE_LABEL MISSING:low`.  
  - **Límites:** missing primero; no apruebes force_1.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: PASS si decision == force_1 (DEFECT).  
  2. Exige score estrictamente en (low, high) y decision abstain.  
  3. Mantén MISSING:low.  
  4. Imprime las tres rutas.
- **Proposed retrospective:**  
  force_1 en banda es breach de producto y de ética de cola. El error clásico es “mejor decidir algo”. Luego (E3): REQUEST_ABSTAIN_BAND y cierre del arco.
- **Code/output changes:** none
- **Validation notes:** Output canónico intacto. Nota pedagógica: si decision='skip' con score=0.5 también es breach (no está en el adverso actual; opcional para Fixer/Round 2).

---

### S34-T4-B-E3 (weDo, transfer)
- **Diagnosis:** Fail-closed final del arco CP-N3-B. Instruction corta; feedback cierra promesa “ranking para humanos” — excelente germen; falta campo retrospective formal.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Fail-closed: REQUEST_ABSTAIN_BAND
- **Proposed preamble:**  
  - **Contexto:** cierras CP-N3-B: sin banda documentada no hay thr defendible ni promesa de no autofraude.  
  - **Meta:** CONTINUE / REJECT_FORCE_LABEL / REQUEST_ABSTAIN_BAND.  
  - **Éxito:** `CONTINUE REJECT_FORCE_LABEL REQUEST_ABSTAIN_BAND`.  
  - **Límites:** no fuerces 0/1 en zona gris; no CONTINUEs ante missing low.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: missing→CONTINUE y pred invertido.  
  2. Sin low → REQUEST_ABSTAIN_BAND.  
  3. CONTINUE solo con score en banda y decision abstain.  
  4. Imprime las tres decisiones.
- **Proposed retrospective:**  
  La abstención protege la promesa del workbench: el score prioriza humanos; no emite veredicto automático de fraude. El error clásico es “cerrar el caso con un label para el dashboard”. Pregunta: ¿qué documentarías en el README junto a thr-v1?
- **Code/output changes:** none
- **Validation notes:** Transfer de cierre del arco; alineado a REJECT_FORCE_LABEL / REQUEST_ABSTAIN_BAND.

---

### youDo — Workbench: métricas + thr versionado + abstain (cierre CP-N3-B)
- **Diagnosis:** Marco de proyecto **sólido**: context ancla CASO-LIM-034 y advierte no copiar thr 0.6 del demo de 4 puntos; objectives/requirements/rubric/portfolioNote alineados a CP-N3-B; starter con tres DEFECT claros (choose_thr fijo, decide→review en banda, thr_id default + accuracy_only True). **Falta** `retrospective` de defensa post-build (principio + misconception + transferencia a S35). Un newbie con buen We Do aún puede “pasar asserts” sin articular por qué thr 0.9 y abstain en 0.55 cierran el producto.
- **Checklist:** context pass · goal pass · success pass (asserts + prints) · constraints pass · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (ya tiene title de proyecto)
- **Proposed preamble:** N/A (context ya cubre escena; opcional refuerzo de 2–3 frases solo si el Fixer unifica con schema; no es bloqueante)
- **Proposed instruction/description improvements:**  
  Mantener context/objectives/requirements. En portfolioNote ya hay puente a S35; no diluir. Opcional en context: una línea explícita de “defiende en 30 s thr hallado + Brier + abstain” (hoy vive solo en portfolioNote).
- **Proposed retrospective:**  
  Antes de marcar listo: (1) ¿qué thr devolvió tu búsqueda con capacity=2 y por qué no copiaste 0.6 del demo de cuatro puntos? (2) ¿qué invariante demuestras con Brier/reliability_bin y con decision_sample=abstain en 0.55? (3) Escribe una frase medible: “cola humana versionada, sin autofraude” para el README. En S35 conectarás este reporte con explainability y equidad por slice.
- **Code/output changes:** none (outputs del print dependen de thr óptimo ~0.9; no alterar fixtures)
- **Validation notes:** Starter y asserts coherentes con theory y We Do T4; thr óptimo en 5 puntos suele ser 0.9 (costo 10) — documentado en context.

---

## Priority order

### P0 (We Do: title + preamble + instruction solo-tarea + retrospective; feedback polish opcional en el mismo pase)
1. **S34-T1-A-E1, E2, E3** — confusión/F1 → assess → fail-closed REQUEST_CONFUSION  
2. **S34-T1-B-E1, E2, E3** — top-k/capacidad → overload → REQUEST_CAPACITY  
3. **S34-T2-A-E1, E2, E3** — CV-safe weights → leaky resample → REQUEST_WEIGHTS  
4. **S34-T2-B-E1, E2, E3** — prevalencia → ceguera accuracy → REQUEST_BASE_RATE  
5. **S34-T3-A-E1, E2, E3** — Brier/bin → uncalibrated → REQUEST_BRIER  
6. **S34-T3-B-E1, E2, E3** — mapa afín holdout → in-sample → REQUEST_CAL_SET  
7. **S34-T4-A-E1, E2, E3** — thr por costo → fixed thr → REQUEST_COST_MATRIX  
8. **S34-T4-B-E1, E2, E3** — abstain → force_label → REQUEST_ABSTAIN_BAND  

### P1
- **8× iDo DEMO:** añadir `preamble` + `retrospective`; ampliar `why` al rango 40–90 palabras  
- **youDo:** añadir `retrospective` de defensa post-build (thr hallado, Brier, abstain, puente S35)

### P2
- Unificar tono de `feedback` We Do (25–60 palabras, principio + porqué del breach) una vez existan preambles  
- Opcional: ampliar edge case de T4-B-E2 (decision=skip en banda) en Round 2 si se quiere rigor extra  
- Asegurar que instruction quede **solo pasos** (sacar escena al preamble) sin cambiar outputs

---

## Residual risks
- **Carga cognitiva del patrón E2/E3:** 8 subtemas repiten la tripleta assess/decide; el código ya diferencia códigos REJECT/REQUEST, pero sin preambles el learner puede sentir “el mismo ejercicio 24 veces”. El Fixer debe **diferenciar escena y meta** por subtema (como en este ledger), no copiar una plantilla de tres bullets genéricos.  
- **Thr 0.6 vs 0.9:** el demo T4-A y el You Do usan tamaños distintos; si el preamble de la demo no advierte “no memorices 0.6”, el learner fallará el You Do por copia.  
- **Lenguaje de fraude:** la sección ya reafirma score ≠ fraude; las propuestas de prosa deben mantener esa frontera (especialmente T4-B y youDo).  
- **Longitudes:** respetar 80–150 palabras (preamble), 40–100 (instruction), 40–80 (retrospective); los textos propuestos están en ese rango y deben pegarse sin “ensayar” ensayos más largos.  
- **Schema:** confirmar que el tipo TypeScript de la sección acepte `preamble` / `retrospective` / `title` en iDo/weDo/youDo antes del fix (otras secciones gold ya los usan o están en el mismo gap).  
- **Anti-aberración en el Fix:** implementar unidad por unidad desde este ledger; no generar en bloque con un script de plantillas.

---

## Counts summary for Fixer
| Bloque | Unidades | Campos prioritarios a añadir |
|--------|----------|------------------------------|
| iDo | 8 | preamble, retrospective; why ↑ |
| weDo | 24 | title, preamble, instruction (solo pasos), retrospective; feedback polish |
| youDo | 1 | retrospective |
| **Total** | **33** | sin cambios de código/output salvo justificación execute-and-diff |

Section 34 exercise pedagogy review complete. Ready for the Fixer prompt.
