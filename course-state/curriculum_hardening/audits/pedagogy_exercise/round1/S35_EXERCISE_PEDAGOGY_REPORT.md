# S35 Exercise Pedagogy Report (Round 1)

## Section
- **title:** Explicabilidad, equidad e incertidumbre
- **shortTitle:** Explicabilidad y equidad
- **id:** `system-design` (archivo `s35-system-design.ts`; contenido = ficha de caso CP-N3-C, no “system design” genérico)
- **index:** 35
- **source:** `src/lib/course/sections/s35-system-design.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades de práctica/demo)
- **subtemas:** S35-T1-A ranking por drop · T1-B explicación local y 4 capas · T2-A slices y low_n · T2-B proxies high-risk · T3-A banda p±q · T3-B OOD y abstención · T4-A model card · T4-B override/audit
- **hilo de caso:** **inicio CP-N3-C** — ficha de caso sintético `CASO-LIM-035` (Red Andina, Lima); separa **evidencia | modelo | incertidumbre | humano**; **nunca** auto-etiqueta fraude ni parentesco; hilo S34 (métricas/umbrales) → S35 (ficha auditable) → portfolio de gobernanza

## Method
- Leído `PEDAGOGY_EXERCISE_SPEC.md` (campos, longitudes, checklist preamble/retrospective, fade E1→E2→E3).
- Inspeccionado manualmente cada `iDo.steps[]` (8 demos, ~334–537), `weDo.steps[]` (24 ejercicios, ~538–2093) y `youDo` (~2095–2190) en `s35-system-design.ts`.
- Contrastado con theory T1–T4, learning outcomes de CP-N3-C y códigos de política (`REJECT_*` / `REQUEST_*` / `CONTINUE`).
- **Sin** generadores, bucles, plantillas ni copy-paste mecánico entre unidades.
- Prosa propuesta en **español profesional peruano**, un objetivo primario por unidad.

## Hallazgos transversales (antes del ledger)

| Campo / hábito | Estado actual en S35 |
|----------------|----------------------|
| I Do `preamble` | **Ausente** en las 8 demos |
| I Do `retrospective` | **Ausente** en las 8 demos |
| I Do `description` | Presente y técnica; nombra skill + fixture; no sustituye preamble formal |
| I Do `why` | Presente; suele ser **1–2 frases** (en o bajo el piso 40–90 palabras del spec) |
| We Do `title` | **Ausente** en los 24 |
| We Do `preamble` | **Ausente** en los 24 |
| We Do `retrospective` | **Ausente** en los 24 |
| We Do `instruction` | Estilo denso “ID · Concepto + fixture + DEFECT del starter + salidas exactas + códigos de política” en un solo bloque: meta, éxito y límites mezclados; legible para quien ya opera workbench de riesgo, **opaco** para newbie sin escena de cola de revisión |
| We Do `feedback` | 1 frase; nombra el principio (bien); a menudo plantilla “explica qué campo… / por qué el adverso…” sin anclar *por qué importa a la ficha o al override en Lima* |
| Starter `# DEFECT:` | **Excelente** en todos; defectos bien nombrados y alineados a la solución |
| Hints | E1 casi-solución (aceptable para guided); E3 transfer a veces da la forma de `build_*` casi completa (andamiaje mínimo OK) |
| Fade E1→E2→E3 | **Real por contenido**: E1 repara operación de dominio; E2 tri-ruta PASS/REJECT/MISSING; E3 decide CONTINUE/REJECT/REQUEST — y en T1-B, T2-A, T2-B, T3-B, T4-A hay **transferencia real** (`build_ficha`, `build_slice_report`, etc.). T1-A-E3, T3-A-E3 y T4-B-E3 son fail-closed clásico sin `build_*` (válidos, pero el Fixer debe diferenciar preambles para no sentir clones de E2) |
| You Do marco | `context` / `objectives` / `requirements` / `rubric` / `portfolioNote` / starter **sólidos**; tres `fill_*` con DEFECT invertidos; gate ético claro |
| You Do `retrospective` | **Ausente** |
| Código / outputs | Coherentes con theory y CP-N3-C; **no** proponer cambios de output salvo notas puntuales |
| Ética del hilo | Consistente: `means_fraud=False`, `causal=False`, no auto_label, fail-closed OOD, audit con `by` |

**Patrón dominante:** el andamiaje de *código* (bugs nombrados, outputs canónicos, códigos de política, fade E1→E3, transferencia real en varios E3, youDo con tres fill rotos) es maduro y alineado al inicio CP-N3-C. El andamiaje *pedagógico verbal* (preamble → instruction solo-tarea → retrospective) no existe. Un true newbie no responde con claridad: qué practico, por qué importa la ficha de `CASO-LIM-035` en la cola de Red Andina, cómo sé que gané, qué debe quedarme al cerrar la pestaña.

**Severity default:** missing preamble+title+retrospective en We Do = **P0**; I Do sin preamble/retrospective = **P1** (aún tienen description+why+código); youDo sin retrospective = **P1**; polish de feedback/why = **P2** si caen preamble/instruction/retrospective.

---

## Unit ledger

### S35-T1-A-DEMO (iDo)
- **Diagnosis:** Demo clara de ranking por drop (`shared_phone` gana a `amount_7d`) con `means_fraud=False`. La `description` nombra features y métrica; falta `preamble` que diga *qué observar* (argmax de sensibilidad ≠ veredicto de fraude) y `retrospective` del misconception “el top feature es el culpable”. El `why` es una frase.
- **Checklist:** context fail · goal partial · success partial (output visible) · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  En la cola sintética de Red Andina, el mapa global de sensibilidad orienta qué features barajar primero, no a quién acusar. En esta demo tres drops ficticios (`shared_phone`, `amount_7d`, `region`) se ordenan por caída de `precision_at_k`. No escribas aún: predice el top y el flag `means_fraud`, y comprueba por qué un drop de 0.1 no es prueba de fraude. Si confundes ranking con veredicto, la ficha de caso se vuelve acusación.
- **Proposed instruction/description improvements:**  
  Mantener description. Ampliar `why` (~50–70 palabras): `max(drops, key=drops.get)` elige la feature cuya permutación daña más la métrica de cola; la misma métrica debe usarse en baseline y en drop; `means_fraud=False` es contrato ético del lab, no un booleano decorativo. Puente a We Do: corregir `min` invertido y el assert que exige `means_fraud=True`.
- **Proposed retrospective:**  
  Si puedes explicar por qué `shared_phone` gana el ranking *sin* decir “es fraude”, ya separas sensibilidad del modelo de la decisión humana. El error clásico es traducir top_feature a label. En We Do repararás dirección del ranking y el flag ético.
- **Code/output changes:** none
- **Validation notes:** Output `shared_phone 0.1` / `means_fraud False` / `ok True` alineado a theory T1-A.

---

### S35-T1-A-E1 (weDo, guided)
- **Diagnosis:** Drill guiado excelente: starter usa `min` y exige `means_fraud is True`. Instruction densa mezcla ID, meta, DEFECT y Pass; sin title, preamble ni retrospective. Feedback nombra el principio pero no ancla “por qué la cola de Lima no puede leer importancia como acusación”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Ranking por drop, no por min
- **Proposed preamble:**  
  - **Contexto:** en `CASO-LIM-035-1A` el workbench publica drops de permutación; el ranking debe elegir la feature más sensible a `precision_at_k`.  
  - **Meta:** calcular `top_feature` con argmax de drops y dejar `means_fraud=False`.  
  - **Éxito:** una línea `S35-T1-A PASS` (assert del contrato).  
  - **Límites:** no uses `min`; no trates importancia como prueba de fraude; solo datos sintéticos.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `top_feature` usa `min` y el predicado exige `means_fraud is True` (doble DEFECT).  
  2. Cambia a `max(drops, key=drops.get)`.  
  3. Exige `top == "shared_phone"`, drop 0.1, métrica `precision_at_k` y `means_fraud is False`.  
  4. Imprime `S35-T1-A` y el status; el assert debe pasar.
- **Proposed feedback improvement:**  
  El ranking se calcula (argmax), no se inventa. Un drop alto mide sensibilidad de la métrica de cola; marcarlo como fraude convierte el mapa global en acusación y rompe la ficha CP-N3-C.
- **Proposed retrospective:**  
  Dirección del ranking + flag ético son el primer ladrillo de explicación global. El error clásico es `min` o `means_fraud=True`. Siguiente (E2): tres rutas schema / contenido / missing.
- **Code/output changes:** none
- **Validation notes:** DEFECT bien nombrado; solution y output `S35-T1-A PASS` correctos.

---

### S35-T1-A-E2 (weDo, independent)
- **Diagnosis:** Tri-ruta PASS / REJECT_CAUSAL_CLAIM / MISSING:drops — buen contrato independiente. Starter da PASS si `means_fraud is True`. Instruction ya nombra salidas; falta escena de “schema primero, ética después” y cierre metacognitivo.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de importancia ética
- **Proposed preamble:**  
  - **Contexto:** el gate de T1-A debe rechazar importancia leída como fraude y pedir drops si faltan, sin confundir schema con breach de contenido.  
  - **Meta:** implementar `assess` con missing primero, luego ranking usable y `means_fraud is False`.  
  - **Éxito:** una línea `PASS REJECT_CAUSAL_CLAIM MISSING:drops`.  
  - **Límites:** no des PASS al adverso; no evalúes ranking sin `drops`.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: PASS si `means_fraud is True` (bug de contenido).  
  2. Si faltan keys → `MISSING:…`.  
  3. Con datos: top calculable, métrica de cola y `means_fraud is False` → PASS; si no → `REJECT_CAUSAL_CLAIM`.  
  4. Imprime las tres rutas en una línea.
- **Proposed retrospective:**  
  Schema primero, ética después: `means_fraud=True` es breach de contenido, no de keys. Pregunta: ¿por qué faltar `drops` no es lo mismo que un drop de 0.1 con flag malo?
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto; fade independiente respecto a E1.

---

### S35-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Fail-closed CONTINUE / REJECT_CAUSAL_CLAIM / REQUEST_METRIC_DROP. Starter hace missing→CONTINUE y pred invertido. **No** es `build_*` como otros E3 de la sección: es transfer de política de cola. Falta preamble que distinga REQUEST (incertidumbre) de REJECT (breach) y retrospective de reutilización en el workbench.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Fail-closed: CONTINUE o pedir drops
- **Proposed preamble:**  
  - **Contexto:** en la cola de revisión, un caso sin drops no se “aprueba en silencio”: se pide la métrica; un caso con `means_fraud=True` se rechaza.  
  - **Meta:** enrutar ausencia a `REQUEST_METRIC_DROP` y breach ético a `REJECT_CAUSAL_CLAIM`.  
  - **Éxito:** `CONTINUE REJECT_CAUSAL_CLAIM REQUEST_METRIC_DROP`.  
  - **Límites:** no trates missing como CONTINUE; no rellenes drops inventados.
- **Proposed instruction/description improvements:**  
  1. Lee el starter: missing devuelve CONTINUE y el pred está invertido.  
  2. Missing → `REQUEST_METRIC_DROP`.  
  3. Completo y ético (`means_fraud=False`, métrica de cola, drop > 0) → `CONTINUE`; si no → `REJECT_CAUSAL_CLAIM`.  
  4. Imprime las tres decisiones en orden.
- **Proposed retrospective:**  
  REQUEST no es PASS disfrazado: es “no decido sin evidencia”. El error clásico es continuar cuando faltan drops. En T1-B pasarás del mapa global a la ficha local de *este* caso.
- **Code/output changes:** none
- **Validation notes:** Transfer de política (no clone de E2 con otros strings); alineado a callout theory.

---

### S35-T1-B-DEMO (iDo)
- **Diagnosis:** Worked example de contrib value×weight y `causal=False`. Description OK; falta preamble de “aditivo de lab ≠ SHAP ni causa legal” y retrospective del misconception “el feature con mayor contrib es el culpable del caso”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Después del mapa global, la ficha necesita contribución **local** al score de este caso. En la demo, `shared_phone` y `amount_z` se multiplican valor×peso; la suma es 1.0 y el flag `causal` queda en False. No escribas: predice contrib y suma, y fíjate que el lab no afirma causa legal ni implementa SHAP. Si omites `causal=False`, la capa modelo se confunde con veredicto.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: el aditivo `v*w` con baseline 0 es andamiaje de lab; correlación/contribución no demuestran causalidad; las 4 capas de la ficha (evidencia|modelo|incertidumbre|humano) se preparan aquí con el flag ético. Puente a We Do: reescribir `local_contrib` y el predicado de capas.
- **Proposed retrospective:**  
  Explicar el score no es acusar a la persona. El error clásico es leer el top local como fraude. We Do: calcular contrib, armar capas y rechazar `causal=True`.
- **Code/output changes:** none
- **Validation notes:** Output `sum 1.0` / `causal False` alineado a theory T1-B.

---

### S35-T1-B-E1 (weDo, guided)
- **Diagnosis:** Starter con contrib en ceros y PASS si `causal is True` — defect guiado perfecto. Instruction densa; sin escena de ficha de 4 capas ni retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Contrib local y causal=False
- **Proposed preamble:**  
  - **Contexto:** en `CASO-LIM-035-1B` el analista arma la capa modelo con contribuciones value×weight y cuatro capas de ficha.  
  - **Meta:** implementar `local_contrib`, exigir capas completas y `causal is False`.  
  - **Éxito:** `S35-T1-B PASS`.  
  - **Límites:** no hardcodees contrib; no marques causal=True; no inventes fraude.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `local_contrib` devuelve ceros y el predicado exige `causal is True`.  
  2. Calcula `{k: v * w for k, (v, w) in feats.items()}`.  
  3. Exige set de 4 capas, `shared_phone==0.9` y suma ≈ 1.0.  
  4. Imprime `S35-T1-B` y el status.
- **Proposed retrospective:**  
  La contribución se calcula; `causal=False` evita convertir la explicación en acusación. Siguiente (E2): PASS/REJECT/MISSING sobre layers.
- **Code/output changes:** none
- **Validation notes:** Solution y output correctos.

---

### S35-T1-B-E2 (weDo, independent)
- **Diagnosis:** Tri-ruta sobre layers y causal. Feedback genérico “explica qué campo…”. Falta preamble de escena y retrospective de schema vs claim causal.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Gate local: capas y no-causal
- **Proposed preamble:**  
  - **Contexto:** el gate de explicación local debe aceptar ficha completa con `causal=False`, rechazar claim causal y reportar layers ausentes.  
  - **Meta:** `assess` con missing primero y predicado de 4 capas + causal.  
  - **Éxito:** `PASS REJECT_CAUSAL_CLAIM MISSING:layers`.  
  - **Límites:** no des PASS si `causal=True` o layers incompletas.
- **Proposed instruction/description improvements:**  
  1. Starter da PASS con `causal is True`.  
  2. Missing → `MISSING:…`.  
  3. PASS solo si `causal is False` y set(layers) es el de 4 capas.  
  4. Imprime las tres rutas.
- **Proposed retrospective:**  
  Capas incompletas no se “arreglan” con un booleano suelto. El adverso falla por contenido (causal/layers), no por schema. Luego (E3) **construyes** la ficha desde campos crudos.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S35-T1-B-E3 (weDo, transfer)
- **Diagnosis:** **Transferencia real** excelente: `build_ficha` + `decide` desde evidence/contrib/causal/decision/by. Starter omite capas y siempre CONTINUE. Falta preamble de “ensamblar producto, no flip de booleano” y retrospective de reutilización en You Do.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Armar ficha de 4 capas
- **Proposed preamble:**  
  - **Contexto:** el portfolio no recibe un record ya armado: llegan campos crudos del caso y debes montar la ficha.  
  - **Meta:** `build_ficha` con evidence|model|uncertainty|human; `decide` con CONTINUE / REJECT_CAUSAL_CLAIM / REQUEST_LAYER_FIELDS.  
  - **Éxito:** `CONTINUE REJECT_CAUSAL_CLAIM REQUEST_LAYER_FIELDS`.  
  - **Límites:** no rellenes evidence inventada; no dejes causal=True en CONTINUE.
- **Proposed instruction/description improvements:**  
  1. Si falta evidence → ficha None → `REQUEST_LAYER_FIELDS`.  
  2. Monta las 4 claves; model lleva contrib y causal.  
  3. Si causal no es False → `REJECT_CAUSAL_CLAIM`.  
  4. Si no, `CONTINUE`. Imprime las tres rutas.
- **Proposed retrospective:**  
  Transferir es ensamblar el producto y luego aplicar el gate. El error clásico es flip de PASS/REJECT sobre un dict ya listo. En el You Do reutilizarás este hábito en `fill_*`.
- **Code/output changes:** none
- **Validation notes:** Transfer auténtico; no es clone de E1/E2.

---

### S35-T2-A-DEMO (iDo)
- **Diagnosis:** Demo de `slice_flag` LIM ok_n vs AQP low_n. Description y why correctos pero breves; falta preamble de “precision alta con n=8 no es paridad” y retrospective del misconception low_n.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Cortar por región revela daño diferencial potencial, pero sin n el reporte de equidad miente. En esta demo LIM (n=100) y AQP (n=8) se marcan con `ok_n` / `low_n` bajo `min_n=30` (política del lab). No escribas: predice los flags y explica por qué un precision 0.9 en AQP no autoriza gritar paridad. Si omites n, el slice es marketing, no auditoría.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: reportar n evita afirmaciones vacías; `low_n` no prueba inequidad ni paridad a favor; `min_n=30` es política del ejercicio, no estándar universal. Puente a We Do: invertir el umbral del flag y rechazar claims con n bajo.
- **Proposed retrospective:**  
  Métrica sin n no es equidad defendible. El error clásico es celebrar precision alta en muestra chica. We Do: flag desde n, tri-ruta y reporte de slice.
- **Code/output changes:** none
- **Validation notes:** Output alineado a theory T2-A.

---

### S35-T2-A-E1 (weDo, guided)
- **Diagnosis:** Starter invierte el umbral (`ok_n` si n < min_n). Instruction ya enseña el contrato; falta escena y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Flag low_n desde n y min_n
- **Proposed preamble:**  
  - **Contexto:** en `CASO-LIM-035-2A` (LIM n=100, precision=0.6) el reporte de slice debe marcar si la muestra basta para hablar.  
  - **Meta:** implementar `slice_flag` y PASS solo con `ok_n` y precision en [0,1].  
  - **Éxito:** `S35-T2-A PASS`.  
  - **Límites:** no pases con low_n; `min_n` es política del lab.
- **Proposed instruction/description improvements:**  
  1. Starter: `ok_n` si n < min_n (invertido).  
  2. Corrige a `low_n` si n < min_n, si no `ok_n`.  
  3. PASS si flag es `ok_n` y precision ∈ [0,1].  
  4. Imprime `S35-T2-A` y el status.
- **Proposed retrospective:**  
  El flag se calcula desde n; precision alta no salva low_n. Siguiente (E2): rechazar claim con n=5.
- **Code/output changes:** none
- **Validation notes:** Solution correcta.

---

### S35-T2-A-E2 (weDo, independent)
- **Diagnosis:** Tri-ruta con adverso n=5 y precision 0.95. Falta preamble de “no grites paridad con n chico” y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Rechazar claim con n insuficiente
- **Proposed preamble:**  
  - **Contexto:** un slice AQP sintético con n=5 y precision 0.95 no autoriza afirmación fuerte de equidad.  
  - **Meta:** `assess` → PASS / REJECT_LOW_N_CLAIM / MISSING:slice_n.  
  - **Éxito:** `PASS REJECT_LOW_N_CLAIM MISSING:slice_n`.  
  - **Límites:** schema primero; no des PASS al adverso de n bajo.
- **Proposed instruction/description improvements:**  
  1. Starter da PASS si slice_n < min_n (invertido).  
  2. Missing → MISSING.  
  3. PASS si n ≥ min_n y precision en [0,1]; si no REJECT_LOW_N_CLAIM.  
  4. Imprime las tres rutas.
- **Proposed retrospective:**  
  low_n + claim fuerte = breach de equity reportable. Faltar n es REQUEST en E3, no REJECT silencioso. Luego montarás el reporte desde campos crudos.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S35-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer real: `build_slice_report` + decide con claim=parity y low_n. Excelente. Falta preamble y retrospective de “ensamblar n+flag+claim”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Reporte de slice con flag y claim
- **Proposed preamble:**  
  - **Contexto:** el portfolio pide un mini-reporte de equity: región, n, precision, flag y claim.  
  - **Meta:** construir el reporte y enrutar CONTINUE / REJECT_LOW_N_CLAIM / REQUEST_SLICE_N.  
  - **Éxito:** `CONTINUE REJECT_LOW_N_CLAIM REQUEST_SLICE_N`.  
  - **Límites:** no inventes n; no afirmes parity con low_n.
- **Proposed instruction/description improvements:**  
  1. Sin n → None → REQUEST_SLICE_N.  
  2. flag = low_n si n < min_n else ok_n; retiene claim.  
  3. low_n + claim parity → REJECT; ok_n + precision válida → CONTINUE.  
  4. Imprime las tres decisiones.
- **Proposed retrospective:**  
  El reporte de slice es un producto, no un flip de booleano. El error clásico es gritar paridad con n=5. En T2-B preguntas qué proxies empujan el daño.
- **Code/output changes:** none
- **Validation notes:** Transfer auténtico alineado a portfolioNote del youDo.

---

### S35-T2-B-DEMO (iDo)
- **Diagnosis:** Demo de tag high desde gaps y action review. why breve; falta preamble de “proxy ≠ label de fraude” y retrospective.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Un proxy (p. ej. `district_code`) puede correlacionar con grupos y elevar FP en la cola sin ser prueba de culpa. En esta demo se deriva tag high desde gaps sintéticos y se elige `action=review` con `means_fraud=False`. No escribas: predice la lista high y por qué no aparece `auto_label`. Si conviertes proxy en etiqueta, rompes el contrato de daño diferencial.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: el tag se justifica con evidencia de gap; mitigar es review/mitigate/drop; auto_label es breach. Puente a We Do: filtrar high bien y prohibir auto_label.
- **Proposed retrospective:**  
  Mitigar proxy documenta daño potencial; no acusa al individuo. We Do: lista high, gate de action y audit desde tags crudos.
- **Code/output changes:** none
- **Validation notes:** Output `['district_code']` / `action review` correcto.

---

### S35-T2-B-E1 (weDo, guided)
- **Diagnosis:** Starter filtra `risk=="low"` y PASS con `auto_label`. Defect doble excelente. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Proxy high y action de mitigación
- **Proposed preamble:**  
  - **Contexto:** en `CASO-LIM-035-2B`, `district_code` llega con tag high; la acción no puede ser auto_label.  
  - **Meta:** listar high-risk correctamente y exigir action ∈ {review, mitigate, drop}.  
  - **Éxito:** `S35-T2-B PASS`.  
  - **Límites:** no filtres por `"low"`; no auto-etiquetes fraude.
- **Proposed instruction/description improvements:**  
  1. Starter: high_risk usa `"low"` y action es auto_label.  
  2. Filtra `v == "high"`.  
  3. Cambia action a review (u otra de mitigación).  
  4. PASS si district_code ∈ high y action válida.
- **Proposed retrospective:**  
  Detectar high y mitigar son dos mitades del contrato. auto_label sobre proxy es breach. Siguiente (E2): tres rutas de action.
- **Code/output changes:** none
- **Validation notes:** Solution correcta.

---

### S35-T2-B-E2 (weDo, independent)
- **Diagnosis:** Tri-ruta PASS / REJECT_PROXY_FEATURE / MISSING:action. Feedback plantilla. Falta escena y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Gate de proxy: review, no auto_label
- **Proposed preamble:**  
  - **Contexto:** el gate de T2-B acepta proxy high con mitigación y rechaza auto_label o action ausente.  
  - **Meta:** `assess` → PASS / REJECT_PROXY_FEATURE / MISSING:action.  
  - **Éxito:** `PASS REJECT_PROXY_FEATURE MISSING:action`.  
  - **Límites:** schema primero; auto_label siempre REJECT.
- **Proposed instruction/description improvements:**  
  1. Starter da PASS si action == auto_label.  
  2. Missing → MISSING.  
  3. PASS si risk high y action en {review, mitigate, drop}.  
  4. Imprime las tres rutas.
- **Proposed retrospective:**  
  auto_label es breach de producto, no un atajo de recall. Faltar action pide audit (REQUEST en E3). Luego construirás el audit desde features crudas.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S35-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer real: `build_proxy_audit` con high_risk, action, means_fraud=False. Falta preamble y retrospective de portfolio.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Audit de proxies desde tags
- **Proposed preamble:**  
  - **Contexto:** el portfolio documenta proxies con lista high-risk y acción de mitigación, no con un tag inventado a mano.  
  - **Meta:** construir audit y enrutar CONTINUE / REJECT_PROXY_FEATURE / REQUEST_PROXY_AUDIT.  
  - **Éxito:** `CONTINUE REJECT_PROXY_FEATURE REQUEST_PROXY_AUDIT`.  
  - **Límites:** means_fraud=False; no auto_label; no inventes features.
- **Proposed instruction/description improvements:**  
  1. Sin features → REQUEST_PROXY_AUDIT.  
  2. high_risk = keys con tag high; means_fraud=False.  
  3. auto_label o means_fraud True → REJECT; high + action válida → CONTINUE.  
  4. Imprime las tres decisiones.
- **Proposed retrospective:**  
  El audit se arma desde tags; el gate viene después. En T3 comunicas incertidumbre del score restante tras mitigar proxies.
- **Code/output changes:** none
- **Validation notes:** Transfer auténtico; tags pre-etiquetados (OK: theory ya mostró tag_from_evidence).

---

### S35-T3-A-DEMO (iDo)
- **Diagnosis:** Banda toy p±q con coverage_claim=False. why breve; falta preamble de “punto sin ancho engaña” y límite toy vs conformal.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Un score puntual de 0.6 en la ficha se ve “seguro” hasta que publicas el ancho. En esta demo `p=0.6`, `q=0.1` producen [0.5, 0.7] con `level=toy` y `coverage_claim=False`. No escribas: predice lo/hi y por qué no puedes afirmar cobertura conformal del lab. Si publicas solo el punto, el analista no ve inestabilidad antes del override.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: la banda toy entrena el hábito de no publicar solo p; conformal real (MAPIE/cobertura) queda en recursos; q==0 o level=point es REJECT_POINT_ONLY. Puente a We Do: calcular lo/hi, no inventar el punto.
- **Proposed retrospective:**  
  Intervalo honesto (aunque toy) prepara abstención y override. El error clásico es vender “conformal calibrado” con banda ilustrativa. We Do: score_band y fail-closed por q.
- **Code/output changes:** none
- **Validation notes:** Output 0.5 0.7 / level toy / coverage_claim False correcto.

---

### S35-T3-A-E1 (weDo, guided)
- **Diagnosis:** Starter publica lo=hi=p y level=point aunque q>0. Defect de cálculo real, no solo booleano. Sin preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Banda p±q, no solo el punto
- **Proposed preamble:**  
  - **Contexto:** en `CASO-LIM-035-3A` el score 0.6 debe salir con ancho q=0.1 en la ficha.  
  - **Meta:** implementar `score_band` simétrica y PASS si q>0, level ≠ point e hi > lo.  
  - **Éxito:** `S35-T3-A PASS` (banda [0.5, 0.7]).  
  - **Límites:** no publiques solo el punto; no digas cobertura real en level toy.
- **Proposed instruction/description improvements:**  
  1. Starter: lo=hi=p, level=point.  
  2. lo, hi = round(p±q, 2); level del record si q>0.  
  3. Exige hi>lo y valores 0.5/0.7.  
  4. Imprime `S35-T3-A` y el status.
- **Proposed retrospective:**  
  La banda se calcula; level=toy es honesto. Siguiente (E2): tri-ruta con q==0 adverso.
- **Code/output changes:** none
- **Validation notes:** Solution exige lo/hi exactos — bien para guided.

---

### S35-T3-A-E2 (weDo, independent)
- **Diagnosis:** Tri-ruta PASS / REJECT_POINT_ONLY / MISSING:q. Falta preamble y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de intervalo
- **Proposed preamble:**  
  - **Contexto:** el gate de incertidumbre debe rechazar punto solo y pedir q si falta.  
  - **Meta:** `assess` con missing primero y q>0 + level ≠ point.  
  - **Éxito:** `PASS REJECT_POINT_ONLY MISSING:q`.  
  - **Límites:** no des PASS si q==0 o level=point.
- **Proposed instruction/description improvements:**  
  1. Starter da PASS si q==0.  
  2. Missing → MISSING.  
  3. PASS si q>0, level ≠ point y p en [0,1].  
  4. Imprime las tres rutas.
- **Proposed retrospective:**  
  q==0 es breach de contenido; faltar q es schema. En E3 la misma lógica se enruta a CONTINUE/REJECT/REQUEST para la cola.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S35-T3-A-E3 (weDo, transfer)
- **Diagnosis:** Fail-closed clásico (sin build_*), similar en forma a T1-A-E3. Contenido distinto (q/level). Falta preamble que evite sensación de clone y retrospective de “banda dentro de dominio ≠ OOD”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Fail-closed de banda en cola
- **Proposed preamble:**  
  - **Contexto:** en la cola, un caso sin q no se scorea a ciegas; un caso punto-solo se rechaza.  
  - **Meta:** CONTINUE / REJECT_POINT_ONLY / REQUEST_INTERVAL.  
  - **Éxito:** `CONTINUE REJECT_POINT_ONLY REQUEST_INTERVAL`.  
  - **Límites:** missing → REQUEST, no CONTINUE; no rellenes q.
- **Proposed instruction/description improvements:**  
  1. Starter: missing→CONTINUE y pred invertido.  
  2. Missing → REQUEST_INTERVAL.  
  3. Completo con q>0 y level ≠ point → CONTINUE; si no REJECT_POINT_ONLY.  
  4. Imprime las tres decisiones.
- **Proposed retrospective:**  
  La banda comunica incertidumbre *dentro* del dominio. En T3-B, si el caso es OOD, ni la mejor banda basta: se abstiene.
- **Code/output changes:** none
- **Validation notes:** Diferenciar preamble de T1-A-E3 (drops vs q) para el Fixer.

---

### S35-T3-B-DEMO (iDo)
- **Diagnosis:** OOD univariante y abstain. why breve; falta preamble de “fuera de train no fuerces label” y límite de detector.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Aunque la banda esté bien, un z extremo o canal nuevo puede salir del soporte de train. En esta demo `z=[1,2,3.5]` con thr=3 dispara OOD; la acción es `abstain`, nunca `auto_fraud`. No escribas: predice ood y action, y nota que el detector es univariante de lab (no OOD multivariante de producción). Si fuerzas label en OOD, la ficha miente.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: fail-closed hacia humano con reason=ood; z debe venir de scaler fit en train; auto_fraud es REJECT_AUTO_LABEL. Puente a We Do: detectar OOD y corregir la política de acción.
- **Proposed retrospective:**  
  OOD cambia de dominio; no se “arregla” con más confianza en el score. We Do: abstain obligatorio y capa uncertainty ensamblada.
- **Code/output changes:** none
- **Validation notes:** Output True / abstain / auto_fraud False correcto.

---

### S35-T3-B-E1 (weDo, guided)
- **Diagnosis:** Starter detecta OOD bien pero PASS exige auto_fraud. Defect de política, no de detector — excelente. Sin preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** OOD implica abstain, no auto_fraud
- **Proposed preamble:**  
  - **Contexto:** en `CASO-LIM-035-3B` el vector z supera el umbral; la política de ficha es abstener.  
  - **Meta:** PASS solo si ood y action=abstain.  
  - **Éxito:** `S35-T3-B PASS`.  
  - **Límites:** no fuerces auto_fraud; no inventes zs.
- **Proposed instruction/description improvements:**  
  1. Starter: action=auto_fraud y predicado lo exige.  
  2. Cambia action a abstain.  
  3. meets_contract = ood and action == "abstain".  
  4. Imprime `S35-T3-B` y el status.
- **Proposed retrospective:**  
  Detectar OOD no basta: la acción correcta es fail-closed. Siguiente (E2): tri-ruta de action.
- **Code/output changes:** none
- **Validation notes:** is_ood ya correcto en starter — pedagogía de política pura.

---

### S35-T3-B-E2 (weDo, independent)
- **Diagnosis:** Tri-ruta PASS / REJECT_AUTO_LABEL / MISSING:action. Falta preamble y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Gate OOD: abstain o breach
- **Proposed preamble:**  
  - **Contexto:** el gate de T3-B acepta OOD+abstain, rechaza auto_fraud y reporta action ausente.  
  - **Meta:** `assess` con missing primero y predicado de OOD+abstain.  
  - **Éxito:** `PASS REJECT_AUTO_LABEL MISSING:action`.  
  - **Límites:** schema primero; auto_fraud siempre REJECT.
- **Proposed instruction/description improvements:**  
  1. Starter da PASS si action == auto_fraud.  
  2. Missing → MISSING.  
  3. PASS si max|z| > thr y action == abstain.  
  4. Imprime las tres rutas.
- **Proposed retrospective:**  
  Faltar action es REQUEST de política en E3, no un PASS silencioso. Luego armarás la capa uncertainty desde zs crudos.
- **Code/output changes:** none
- **Validation notes:** Solution también re-chequea OOD — bien.

---

### S35-T3-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer real: `build_uncertainty` con ood/action/reason. Falta preamble y retrospective de reason=ood en ficha.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Capa uncertainty desde z-scores
- **Proposed preamble:**  
  - **Contexto:** la ficha CP-N3-C guarda incertidumbre como capa, no como print suelto.  
  - **Meta:** construir `{ood, action, reason}` y enrutar CONTINUE / REJECT_AUTO_LABEL / REQUEST_OOD_POLICY.  
  - **Éxito:** `CONTINUE REJECT_AUTO_LABEL REQUEST_OOD_POLICY`.  
  - **Límites:** no rellenes zs; no dejes auto_fraud en OOD.
- **Proposed instruction/description improvements:**  
  1. Sin zs → REQUEST_OOD_POLICY.  
  2. ood = max|z| > thr; reason='ood' si aplica.  
  3. ood y action ≠ abstain → REJECT; ood y abstain → CONTINUE.  
  4. Imprime las tres decisiones.
- **Proposed retrospective:**  
  reason=ood hace auditable la abstención. En T4 documentas usos permitidos (card) y el rastro del override humano.
- **Code/output changes:** none
- **Validation notes:** Transfer auténtico alineado a youDo fill_uncertainty.

---

### S35-T4-A-DEMO (iDo)
- **Diagnosis:** Model card mínima con out_of_scope y contestability. why breve; falta preamble de “scope de producto” y retrospective.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Sin model card, la ficha flota: no hay límite escrito de lo que el score *no* puede hacer. En esta demo `use=queue_rank`, `out_of_scope` incluye `fraud_label`, `owner=risk_ops` y `contestability=True`. No escribas: predice por qué `card_ok` es True y qué fallaría si use fuera fraud_label. Si omites out_of_scope, el score se cuela como etiqueta automática.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: keys mínimas + fraud_label fuera de scope + contestability habilitan apelación sin borrar histórico. Puente a We Do: validar card y construirla desde prohibited crudo.
- **Proposed retrospective:**  
  La card es contrato de producto, no un README decorativo. We Do: card_ok, gate de scope y build_card.
- **Code/output changes:** none
- **Validation notes:** Output alineado a theory T4-A.

---

### S35-T4-A-E1 (weDo, guided)
- **Diagnosis:** Starter acepta use=fraud_label. Defect de validador excelente. Sin preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Card válida: queue_rank y scope
- **Proposed preamble:**  
  - **Contexto:** en `CASO-LIM-035-4A` la card del ranker de cola debe prohibir fraud_label y permitir contestabilidad.  
  - **Meta:** implementar `card_ok` con keys, use, out_of_scope y contestability.  
  - **Éxito:** `S35-T4-A PASS`.  
  - **Límites:** no aceptes use=fraud_label ni contestability=False.
- **Proposed instruction/description improvements:**  
  1. Starter: card_ok True solo si use==fraud_label.  
  2. need = {use, out_of_scope, owner, contestability}.  
  3. Exige queue_rank, fraud_label en out_of_scope y contestability True.  
  4. Imprime `S35-T4-A` y el status.
- **Proposed retrospective:**  
  out_of_scope no es decorativo: es el límite de producto. Siguiente (E2): tri-ruta de scope.
- **Code/output changes:** none
- **Validation notes:** Solution correcta.

---

### S35-T4-A-E2 (weDo, independent)
- **Diagnosis:** Tri-ruta PASS / REJECT_SCOPE_BREACH / MISSING:out_of_scope. Falta preamble y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Gate de scope de model card
- **Proposed preamble:**  
  - **Contexto:** el gate de T4-A acepta card de cola con contestabilidad y rechaza use=fraud_label o scope vacío.  
  - **Meta:** `assess` → PASS / REJECT_SCOPE_BREACH / MISSING:out_of_scope.  
  - **Éxito:** `PASS REJECT_SCOPE_BREACH MISSING:out_of_scope`.  
  - **Límites:** schema primero; adverso por contenido.
- **Proposed instruction/description improvements:**  
  1. Starter da PASS si use==fraud_label.  
  2. Missing → MISSING.  
  3. PASS si queue_rank, fraud_label en out_of_scope y contestability True.  
  4. Imprime las tres rutas.
- **Proposed retrospective:**  
  use=fraud_label es breach de producto aunque el score sea “preciso”. Luego construirás la card desde `prohibited` crudo.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S35-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer real: `build_card` desde prohibited → out_of_scope. Falta preamble y retrospective de Mitchell mínimo en portfolio.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Construir card desde usos prohibidos
- **Proposed preamble:**  
  - **Contexto:** el portfolio no recibe out_of_scope listo: llega `prohibited` y debes armar la card.  
  - **Meta:** build_card + decide CONTINUE / REJECT_SCOPE_BREACH / REQUEST_CARD_KEYS.  
  - **Éxito:** `CONTINUE REJECT_SCOPE_BREACH REQUEST_CARD_KEYS`.  
  - **Límites:** no inventes out_of_scope vacío como válido; no dejes use=fraud_label en CONTINUE.
- **Proposed instruction/description improvements:**  
  1. Sin prohibited → REQUEST_CARD_KEYS.  
  2. out_of_scope = list(prohibited); copia use/owner/contestability.  
  3. Gate: queue_rank + fraud_label en scope + contestability.  
  4. Imprime las tres decisiones.
- **Proposed retrospective:**  
  Construir la card y validar scope son dos pasos; saltar el build deja la ficha sin contrato de producto. En T4-B cierras con audit del override humano.
- **Code/output changes:** none
- **Validation notes:** Transfer auténtico.

---

### S35-T4-B-DEMO (iDo)
- **Diagnosis:** audit_event con by y ts de portfolio. why breve; falta preamble de “override silencioso no es gobernanza”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Un override sin actor no se puede reconstruir: no hay gobernanza. En esta demo `analyst_7` hace `override_skip` con case, human, by, reason y ts; `audit_min` y `audit_portfolio` deben ser True. No escribas: predice por qué by vacío rompería el lab y por qué ts/reason importan al portfolio. Si omites by, la decisión humana desaparece del audit trail.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: mínimo case/human/by no vacío; portfolio añade ts/reason/model_version. Puente a We Do: corregir validador que acepta by vacío.
- **Proposed retrospective:**  
  Sin by no hay gobernanza. We Do: audit_event, tri-ruta y fail-closed de override silencioso.
- **Code/output changes:** none
- **Validation notes:** Output audit_min/audit_portfolio True correcto.

---

### S35-T4-B-E1 (weDo, guided)
- **Diagnosis:** Starter da True cuando by está vacío (`not event.get("by")`). Defect guiado perfecto. Sin preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Override con by no vacío
- **Proposed preamble:**  
  - **Contexto:** en `CASO-LIM-035-4B` el override debe dejar actor reconstruible.  
  - **Meta:** `audit_event` exige case, human y by no vacío.  
  - **Éxito:** `S35-T4-B PASS`.  
  - **Límites:** no des PASS con by vacío; ts es portfolio, no gate mínimo de este E1.
- **Proposed instruction/description improvements:**  
  1. Starter: return True cuando by está vacío.  
  2. Exige keys case/human/by y bool(by), bool(case), bool(human).  
  3. Imprime `S35-T4-B` y el status.  
  4. Verifica mentalmente con by=analyst_7.
- **Proposed retrospective:**  
  by vacío es override silencioso aunque el score se vea “correcto”. Siguiente (E2): tres rutas de audit.
- **Code/output changes:** none
- **Validation notes:** Solution correcta.

---

### S35-T4-B-E2 (weDo, independent)
- **Diagnosis:** Tri-ruta PASS / REJECT_SILENT_OVERRIDE / MISSING:by. Falta preamble y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Gate de audit de override
- **Proposed preamble:**  
  - **Contexto:** el gate de T4-B acepta override con actor, rechaza by vacío y reporta by ausente.  
  - **Meta:** `assess` → PASS / REJECT_SILENT_OVERRIDE / MISSING:by.  
  - **Éxito:** `PASS REJECT_SILENT_OVERRIDE MISSING:by`.  
  - **Límites:** schema primero; by vacío es breach de contenido.
- **Proposed instruction/description improvements:**  
  1. Starter da PASS si not by.  
  2. Missing → MISSING.  
  3. PASS si by, case y human son truthy.  
  4. Imprime las tres rutas.
- **Proposed retrospective:**  
  Faltar by (MISSING) no es lo mismo que by="" (REJECT). En E3 enrutas missing a REQUEST_AUDIT_FIELDS para la cola.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S35-T4-B-E3 (weDo, transfer)
- **Diagnosis:** Fail-closed clásico CONTINUE / REJECT_SILENT_OVERRIDE / REQUEST_AUDIT_FIELDS (sin build_*). Forma similar a T1-A-E3 y T3-A-E3; contenido de gobernanza. Falta preamble diferenciador y retrospective de cierre de sección.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Fail-closed de override en cola
- **Proposed preamble:**  
  - **Contexto:** en la cola de Red Andina, un override sin by no se “aprueba”: se pide audit; un by vacío se rechaza.  
  - **Meta:** CONTINUE / REJECT_SILENT_OVERRIDE / REQUEST_AUDIT_FIELDS.  
  - **Éxito:** `CONTINUE REJECT_SILENT_OVERRIDE REQUEST_AUDIT_FIELDS`.  
  - **Límites:** missing → REQUEST, no CONTINUE; no inventes by.
- **Proposed instruction/description improvements:**  
  1. Starter: missing→CONTINUE y pred invertido.  
  2. Missing → REQUEST_AUDIT_FIELDS.  
  3. Completo con by/case/human truthy → CONTINUE; si no REJECT_SILENT_OVERRIDE.  
  4. Imprime las tres decisiones.
- **Proposed retrospective:**  
  Con card + audit, la ficha CP-N3-C queda lista para el portfolio. Pregunta: ¿qué añadirías (ts, reason, model_version) para reconstrucción forense real?
- **Code/output changes:** none
- **Validation notes:** Diferenciar preamble de otros E3 fail-closed; cierra el arco de la sección.

---

### S35-YOU-DO (youDo)
- **Diagnosis:** Marco de proyecto **sólido**: context de Red Andina, objectives de 4 capas + card + OOD, requirements éticos, rubric con pesos, portfolioNote, starter con tres `fill_*` rotos (contrib/means_fraud/causal, banda punto + auto_fraud, card fraud_label + by vacío). Falta **solo** `retrospective` de defensa post-build. Un newbie que llega con We Do incompletos en prosa aún puede ejecutar el starter, pero no tiene prompt de metacognición al marcar listo.
- **Checklist:** context pass · goal pass · success pass (asserts + portfolio_ready) · constraints pass · retrospective fail
- **Severity:** P1
- **Proposed title:** (ya existe) Ficha de caso: evidencia | modelo | incertidumbre | humano (CP-N3-C inicio)
- **Proposed preamble:** N/A — `context` ya cumple rol de escena; no duplicar. Opcional: una línea de entrada al starter en UI si el Fixer quiere “repara los tres fill_* hasta portfolio_ready True”.
- **Proposed instruction/description improvements:**  
  Mantener context/objectives/requirements/rubric. Asegurar que la UI muestre los asserts esperados (`ethics_ok`, `uncertainty_ok`, `governance_ok`, `portfolio_ready True`). No cambiar lógica de starter salvo bugs de ejecución.
- **Proposed retrospective:**  
  Antes de marcar listo: (1) ¿qué invariante de la ficha demuestras con `portfolio_ready` (capas + ética + OOD + card/by)? (2) ¿qué caso adverso documentas en la nota (OOD, by vacío, low_n o proxy) y por qué no rellenas evidencia inventada? (3) Escribe una frase de impacto medible para el README: *antes* el score se leía como veredicto; *después* la cola separa evidencia, modelo, incertidumbre y humano con audit. ¿Puedes defender en 30 segundos por qué explicar no es acusar?
- **Code/output changes:** none (starter y asserts coherentes con We Do)
- **Validation notes:** youDo integra T1-B, T3-A/B, T4-A/B; slice/proxy se piden en portfolioNote (documentación), no en asserts del código — intencional y OK.

---

## Priority order

### P0 (We Do: title + preamble + instruction solo-tarea + retrospective; feedback endurecido)
1. **Todos los 24 We Do** — sin excepción: `title`, `preamble` (checklist context/goal/success/constraints), `instruction` desacoplada del ensayo, `retrospective`, y feedback que ancle ficha/cola/override (no solo “explica qué campo”).
2. **Priorizar dentro de P0 por arco de producto (si se fija por oleadas):**  
   - Oleada 1 (núcleo ficha): T1-A-E1…E3, T1-B-E1…E3  
   - Oleada 2 (equidad): T2-A-E1…E3, T2-B-E1…E3  
   - Oleada 3 (incertidumbre): T3-A-E1…E3, T3-B-E1…E3  
   - Oleada 4 (gobernanza): T4-A-E1…E3, T4-B-E1…E3  
3. **E3 con transfer real** (T1-B, T2-A, T2-B, T3-B, T4-A): preambles deben enfatizar *ensamblar producto*, no flip de PASS/REJECT.  
4. **E3 fail-closed clásico** (T1-A, T3-A, T4-B): preambles deben diferenciar REQUEST vs REJECT y no copiarse entre sí (drops / q / by).

### P1
1. **8 I Do:** añadir `preamble` + `retrospective`; ampliar `why` al rango 40–90 palabras.  
2. **You Do:** añadir `retrospective` de defensa (no reescribir context/rubric).

### P2
1. **Feedback We Do:** sustituir plantillas “explica qué campo cambió…” por 25–60 palabras ancladas a Red Andina / ficha / portfolio.  
2. **weDo.intro:** ya es bueno; opcionalmente una línea que recuerde “preamble → tarea → retrospective” cuando existan los campos.  
3. **Hints E1:** revisar que no spoileen la solución entera donde baste nombrar el DEFECT (varios E1 ya son casi-solución — aceptable guided, no endurecer salvo ruido).

---

## Residual risks

1. **Prosa vs. código:** el Fixer puede rellenar campos y dejar outputs intactos (recomendado). Si se toca código de solución por “mejor pedagogía”, re-ejecutar y diff de output es obligatorio.  
2. **Sensación de 24 clones:** el código ya diferencia E1/E2/E3 y varios E3 son transfer; el riesgo residual es **preambles genéricos** del estilo “corrige el DEFECT del starter” sin escena de cola/ficha. Cada subtema necesita ancla distinta (ranking / capas / n / proxy / banda / OOD / card / by).  
3. **T1-A-E3, T3-A-E3, T4-B-E3** comparten forma fail-closed: sin preambles diferenciados se leen como E2 con otros strings.  
4. **Carga cognitiva del newbie:** S35 asume S34 y vocabulario de workbench; preambles deben recordar *una* pregunta guía (“¿qué capa estoy mirando?”) sin re-enseñar toda la theory.  
5. **You Do slice/proxy en nota, no en asserts:** el Fixer no debe inventar asserts de slice en el starter a menos que el curriculum lo pida; la retrospective debe empujar la nota de portfolio, no un nuevo test.  
6. **Ética y PII:** el hilo sintético es sólido; cualquier texto propuesto debe mantener `CASO-LIM-035`, Red Andina ficticia y `means_fraud=False` / no auto_label.  
7. **Longitudes del spec:** al implementar, recortar preambles a ~80–150 palabras y retrospectives a ~40–80; este reporte prioriza claridad de Fixer sobre el conteo exacto de palabras en cada bloque propuesto.

---

## Fixer handoff notes

- **No editar source en Round 1** (este informe es solo diagnóstico + prosa propuesta).  
- Schema preferido: I Do `preamble` + `retrospective`; We Do `title` + `preamble` + `instruction` (task-only) + `retrospective`; You Do `retrospective`.  
- Preservar outputs exactos y DEFECT comments.  
- Español PE profesional; sin PII real.  
- Tras fix: typecheck/build estático de la sección; no generadores de prosa.

---

Section 35 exercise pedagogy review complete. Ready for the Fixer prompt.
