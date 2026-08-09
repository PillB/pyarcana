# S32 Exercise Pedagogy Report (Round 1)

## Section
- **title:** Feature engineering y pipelines sin leakage
- **shortTitle:** Features sin leakage
- **id:** `microservices` (archivo `s32-microservices.ts`; contenido = tabla de features versionada del workbench relacional, no microservicios de red)
- **index:** 32
- **source:** `src/lib/course/sections/s32-microservices.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades de práctica/demo)
- **subtemas:** S32-T1-A catálogo/keys · T1-B missing/scale · T2-A grafo relacional · T2-B ventanas half-open · T3-A transformers fit→transform · T3-B persistencia fs-vN · T4-A split tiempo/entidad · T4-B leakage/skew/version
- **hilo de caso:** tabla de features del workbench **CP-N3-B** (fixture sintético Red Andina, `run_id=cpn3b-feat`); gate **train≡serve**; sin timestamps futuros ni labels de decisión como feature; features de grafo (puente S31) **no** son veredicto de fraude ni parentesco; artefacto `fs-vN` es contrato de entrada del baseline **S33**

## Method
- Leído `PEDAGOGY_EXERCISE_SPEC.md` (campos, longitudes, checklist preamble/retrospective, fade E1→E2→E3).
- Inspeccionado manualmente cada `iDo.steps[]` (8 demos), `weDo.steps[]` (24 ejercicios) y `youDo` en `s32-microservices.ts` (iDo ~370–596, weDo ~598–2149, youDo ~2152–2246).
- Contrastado con el hilo de la sección: catálogo → missing/scale → grafo/ventana → fit/persist → split → promote con scan de leakage y skew; vocabulario fail-closed `REQUEST_*` / `REJECT_*`; solo PII sintético.
- **Sin** generadores, bucles, plantillas ni copy-paste mecánico entre unidades.
- Prosa propuesta en **español profesional peruano**, un objetivo primario por unidad.

## Hallazgos transversales (antes del ledger)

| Campo / hábito | Estado actual en S32 |
|----------------|----------------------|
| I Do `preamble` | **Ausente** en las 8 demos |
| I Do `retrospective` | **Ausente** en las 8 demos |
| I Do `description` | Presente y técnica (qué calcula el demo); no sustituye preamble formal (escena + qué observar) |
| I Do `why` | Presente; casi siempre **1 frase** (bajo el piso 40–90 palabras del spec) |
| We Do `title` | **Ausente** en los 24 |
| We Do `preamble` | **Ausente** en los 24 |
| We Do `retrospective` | **Ausente** en los 24 |
| We Do `instruction` | Densa y **técnicamente excelente**: nombra DEFECT, salida exacta y a veces el contrato fail-closed; **mezcla** contexto + meta + éxito + límites en un solo párrafo — legible para quien ya vive feature stores, **opaco** para un true newbie sin escena de train≡serve |
| We Do `feedback` | 1–2 frases; nombra el bug y el código de gate (bien); poco ancla de “por qué el score offline engaña a la cola de revisión” |
| Starter `# DEFECT:` | **Excelente** hábito en todos; defectos bien nombrados y alineados a la solución |
| Hints | E1 casi-solución (aceptable guiado); E2/E3 con menos migas; fade de *código* real |
| You Do marco | `context` / `objectives` / `requirements` / `rubric` / `portfolioNote` / starter **sólidos** y alineados a CP-N3-B → S33 |
| You Do `retrospective` | **Ausente** |
| Código / outputs | Coherentes con theory y CP-N3-B; **no** proponer cambios de output salvo notas puntuales |

**Patrón dominante:** el andamiaje de *código* (fixtures sintéticos Red Andina, bugs nombrados, outputs canónicos, fade real E1→E3 por subtema, política train≡serve, `REQUEST_*` vs `REJECT_*`, puente S31→S33) es maduro y alineado al workbench. El andamiaje *pedagógico verbal* (preamble → instruction solo-tarea → retrospective) no existe. Un true newbie no responde con claridad: qué practico, por qué importa en un feature set de investigación relacional, cómo sé que gané, qué debe quedarme al cerrar la pestaña.

**Fade E1→E2→E3 (contenido):** progresión real por subtema (p. ej. T1-A: booleano `catalog_ok` → `assess` PASS/REJECT/MISSING → `decide` CONTINUE/REJECT/REQUEST; T2-B: corregir `<= t` → assess con recompute → fail-closed `REQUEST_WINDOW`). **No** son tres clones con números distintos. El fade de *prosa* no se ve porque no hay preambles diferenciados.

**Severity default:** missing title+preamble+retrospective en We Do = **P0**; I Do sin preamble/retrospective = **P1** (aún tienen description+why+código); youDo sin retrospective = **P1**; polish de feedback/why = **P2** si caen preamble/instruction/retrospective.

---

## Unit ledger

### S32-T1-A-DEMO (iDo)
- **Diagnosis:** Demo clara de `catalog_check`: keys del row ⊆ catálogo, `note_len` como feature derivada, `catalog_ok True`. La `description` nombra el skill; falta `preamble` que diga *qué observar* (nums, note_len, ok) y escena “serve inventa columnas”. Falta `retrospective` del misconception “si el notebook de train tenía la columna, serve puede inventarla igual”. El `why` es una frase.
- **Checklist:** context fail · goal partial · success partial (output visible) · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Antes de fittear un imputer o un z-score, el workbench CP-N3-B exige un **catálogo** de features: sin él, serve inventa columnas y rompe train≡serve. En esta demo un row sintético Red Andina (`amount_7d`, `canal`, `note`) se valida contra schema tipado y se deriva `note_len`. No escribas aún: predice la lista numérica, la longitud de `"hola"` y si `catalog_ok` es True; luego contrasta con la salida. Si aparece una key fuera del catálogo, el gate no es “ignorar en silencio”.
- **Proposed instruction/description improvements:**  
  Mantener description. Ampliar `why` (~50–70 palabras): el catálogo es la fuente de verdad de dtypes y política de missing; `note_len` se documenta como derivada, no se inventa en serve; keys ⊆ catálogo es el contrato local antes de cualquier fit; una feature desconocida en producción es `REJECT_UNKNOWN_FEATURE`, no un warning opcional. Puente a We Do: corregir unknown keys, assess de tres rutas y fail-closed `REQUEST_CATALOG`.
- **Proposed retrospective:**  
  Si puedes explicar por qué una columna “solo en el notebook de serve” rompe train≡serve sin mirar el código, ya tienes el hábito de catálogo primero. El error clásico es confiar en el dict del row. En We Do practicarás unknown keys y `REQUEST_CATALOG`.
- **Code/output changes:** none
- **Validation notes:** Output `['amount_7d']` / `note_len 4` / `catalog_ok True` alineado a theory T1-A.

---

### S32-T1-A-E1 (weDo, guided)
- **Diagnosis:** Drill guiado excelente: starter calcula `unknown` con `k in known` (al revés). Instruction densa mezcla escena, DEFECT y salida; sin title, preamble ni retrospective. Feedback nombra el contrato pero no ancla “por qué el fit no debería arrancar”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Keys del row ⊆ catálogo (catalog_ok)
- **Proposed preamble:**  
  - **Contexto:** en el feature set sintético Red Andina (`cpn3b-feat`), el fit solo arranca si el row no trae columnas inventadas.  
  - **Meta:** calcular unknown keys como “en row y no en known” y dejar `catalog_ok` correcto.  
  - **Éxito:** una línea exacta `S32-T1-A PASS`.  
  - **Límites:** no inviertas el booleano final; no hardcodees `PASS`; solo PII sintético.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `unknown` usa `k in known` (DEFECT).  
  2. Cambia a `k not in known`.  
  3. Deja `catalog_ok = len(unknown) == 0` y el status PASS/REJECT.  
  4. Imprime `S32-T1-A` y el status.
- **Proposed feedback improvement:**  
  Sin keys desconocidas el catálogo pasa. El predicado al revés aprueba basura: una feature inventada en serve exige `REJECT_UNKNOWN_FEATURE`, no un fit optimista.
- **Proposed retrospective:**  
  Unknown = row − catálogo, no al revés. El error clásico es invertir el predicado y “pasar” siempre. Siguiente (E2): tres rutas PASS / REJECT / MISSING.
- **Code/output changes:** none
- **Validation notes:** DEFECT bien nombrado; solution y output `S32-T1-A PASS` correctos.

---

### S32-T1-A-E2 (weDo, independent)
- **Diagnosis:** Buen foco independiente: `assess` con válido, adverso (`unknown_feat`) e incompleto (sin schema). Starter invierte PASS/REJECT. Instruction ya da salidas exactas; falta escena de “tres decisiones de gate” y cierre metacognitivo.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Assess: PASS, unknown y MISSING schema
- **Proposed preamble:**  
  - **Contexto:** el gate de catálogo no es un booleano suelto: debe distinguir row válido, feature inventada y prerequisito ausente.  
  - **Meta:** implementar `assess` calculando unknown keys (sin flag prebakeado).  
  - **Éxito:** `PASS REJECT_UNKNOWN_FEATURE MISSING:schema`.  
  - **Límites:** primero keys requeridas; no resuelvas el adverso cambiando `case_id`; no inventes schema.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: devuelve PASS cuando hay unknown (DEFECT).  
  2. Si faltan keys → `MISSING:…`.  
  3. Si hay unknown → `REJECT_UNKNOWN_FEATURE`; si no → `PASS`.  
  4. Imprime las tres rutas en una línea.
- **Proposed retrospective:**  
  El adverso falla por *contenido* (feature fuera del catálogo), no por schema ausente. Confundir ambos deja logs inútiles. Luego (E3): `REQUEST_CATALOG` vs `REJECT`.
- **Code/output changes:** none
- **Validation notes:** E2 con menos migas; output canónico intacto.

---

### S32-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transferencia real a fail-closed: missing→`REQUEST_CATALOG`, no CONTINUE; predicado de keys corregido. Instruction lista la salida; falta anclar “ausencia ≠ incumplimiento” y retrospective de entrevista.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Fail-closed: REQUEST_CATALOG vs REJECT
- **Proposed preamble:**  
  - **Contexto:** en promote hacia S33, faltar el catálogo no es “seguir igual”: es pedir el prerequisito.  
  - **Meta:** enrutar válido → CONTINUE, unknown → REJECT, sin schema → REQUEST_CATALOG.  
  - **Éxito:** `CONTINUE REJECT_UNKNOWN_FEATURE REQUEST_CATALOG`.  
  - **Límites:** ausencia ≠ incumplimiento; no inventes schema vacío para “pasar”.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: missing→CONTINUE y predicado invertido.  
  2. Si faltan keys → `REQUEST_CATALOG`.  
  3. Con schema: CONTINUE solo si no hay unknown.  
  4. Imprime las tres decisiones.
- **Proposed retrospective:**  
  `REQUEST_*` pide artefacto; `REJECT_*` demuestra violación. El error clásico es CONTINUE cuando falta el catálogo. Pregunta: ¿qué imprimirías si el row trae `unknown_feat` y el schema sí existe?
- **Code/output changes:** none
- **Validation notes:** Transfer auténtico; alineado a theory T1-A y You Do.

---

### S32-T1-B-DEMO (iDo)
- **Diagnosis:** Worked example sólido: indicator, fill mediana, z-score sobre filled con μ/σ de train. Description OK; falta preamble de “silent fill engaña al modelo” y retrospective del misconception “rellenar con 0 sin marcar ausencia está bien”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Un `None` en montos del caso Red Andina no es “cero barato”: la ausencia es señal. Esta demo marca missing, rellena con mediana de train (2.0) y aplica z-score con μ/σ **congelados** sobre la serie rellena. No escribas: predice `ind`, `filled` y `z` para `[1, None, 3]`; observa que no se reestiman stats en serve. Si rellenas sin indicator, cometes silent fill.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: indicator preserva la señal de ausencia; fill y μ/σ solo de train bloquean leakage de test; z se calcula sobre filled, no sobre constantes; silent fill sin indicator es `REJECT_SILENT_FILL`. Puente a We Do: z sobre filled, assess de indicator y `REQUEST_MEDIAN`.
- **Proposed retrospective:**  
  Indicator + stats de train = contrato de missing/scale. El error clásico es rellenar en silencio o reestimar μ/σ en serve. We Do: corregir z y fallar closed sin mediana.
- **Code/output changes:** none
- **Validation notes:** Output `[False, True, False]` / filled / z alineado a theory T1-B.

---

### S32-T1-B-E1 (weDo, guided)
- **Diagnosis:** Starter escala `[2, 4]` en vez de `filled` — defecto guiado perfecto. Instruction densa; sin title/preamble/retrospective. Feedback nombra silent fill pero no el hábito “z siempre sobre la serie que viaja”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Z-score sobre la serie rellena
- **Proposed preamble:**  
  - **Contexto:** en el pipeline numérico de CP-N3-B, el z-score no puede usar una lista hardcodeada: debe seguir a `filled`.  
  - **Meta:** indicator + fill mediana + z con μ=0, σ=2 sobre filled; `silent_fill=False`.  
  - **Éxito:** `S32-T1-B PASS`.  
  - **Límites:** no escales constantes ajenas; no pongas silent_fill True; stats de train ya dadas.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `z` usa `[2, 4]` (DEFECT).  
  2. Cambia a `for x in filled`.  
  3. Comprueba ind, filled y z contra los valores esperados.  
  4. Imprime `S32-T1-B` y el status.
- **Proposed feedback improvement:**  
  Escalar la serie rellena es el patrón de stats solo de train. Un z “bonito” sobre constantes no se puede servir: silent fill o desalineación es `REJECT_SILENT_FILL`.
- **Proposed retrospective:**  
  El z sigue a filled, no a un ejemplo de pizarra. El error clásico es hardcodear la salida. Siguiente (E2): validar indicator vs values.
- **Code/output changes:** none
- **Validation notes:** DEFECT claro; output `S32-T1-B PASS` correcto.

---

### S32-T1-B-E2 (weDo, independent)
- **Diagnosis:** `assess` debe comparar indicator con `[v is None…]` y exigir median. Starter solo mira si median no es None. Instruction da salidas; falta escena de silent fill en notebook de prod.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Assess silent fill y mediana de train
- **Proposed preamble:**  
  - **Contexto:** un indicator todo False con huecos reales es silent fill: el modelo cree que no faltó nada.  
  - **Meta:** PASS si median presente e indicator marca cada None; adverso → REJECT; sin median → MISSING.  
  - **Éxito:** `PASS REJECT_SILENT_FILL MISSING:median`.  
  - **Límites:** detecta falta de median antes de filled; no “arregles” el indicator del adverso.
- **Proposed instruction/description improvements:**  
  1. Starter: PASS solo por median (DEFECT).  
  2. Calcula `expected_ind` desde values.  
  3. Si indicator ≠ expected → REJECT_SILENT_FILL.  
  4. Imprime las tres rutas.
- **Proposed retrospective:**  
  Mediana de train es prerequisito; silent fill es incumplimiento de contrato, no un atajo de notebook. Luego (E3): `REQUEST_MEDIAN`.
- **Code/output changes:** none
- **Validation notes:** Output canónico intacto.

---

### S32-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Fail-closed de missing/scale: CONTINUE / REJECT_SILENT_FILL / REQUEST_MEDIAN. Starter siempre CONTINUE. Instruction OK a nivel contrato; falta retrospective “no rellenar con 0”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Fail-closed: REQUEST_MEDIAN
- **Proposed preamble:**  
  - **Contexto:** sin mediana de train no hay transform legítimo hacia serve.  
  - **Meta:** enrutar válido → CONTINUE, silent fill → REJECT, sin median → REQUEST_MEDIAN.  
  - **Éxito:** `CONTINUE REJECT_SILENT_FILL REQUEST_MEDIAN`.  
  - **Límites:** no rellenes con 0 en silencio; REQUEST antes de comparar indicator.
- **Proposed instruction/description improvements:**  
  1. DEFECT: missing→CONTINUE y siempre CONTINUE.  
  2. Sin keys → `REQUEST_MEDIAN`.  
  3. Compara indicator con values; CONTINUE solo si ok.  
  4. Imprime las tres decisiones.
- **Proposed retrospective:**  
  Pedir la mediana es fail-closed, no inventar fill. El error clásico es 0 silencioso. Pregunta: ¿REJECT o REQUEST si falta `median` en el record?
- **Code/output changes:** none
- **Validation notes:** Transfer alineado a theory T1-B.

---

### S32-T2-A-DEMO (iDo)
- **Diagnosis:** Demo de shared address, degree y path default 99 — puente claro a S31. Falta preamble “no son veredicto de fraude” y retrospective del misconception “path ausente = 0 o inventar aristas”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Las features relacionales del grafo de evidencia (S31) resumen topología: dirección compartida, degree, min path. En esta demo, dos entidades con `Av1`, vecinos de E1 y path a E9 **ausente** producen shared=1, degree=2, path=99. No escribas: predice los tres números. Recuerda: shared address **no** es etiqueta de parentesco ni de fraude — es input para el modelo o la cola humana.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: solo topología y atributos observados en t; default 99 si falta arista (no inventar edges); label de decisión como feature es `REJECT_LABEL_AS_FEATURE`; sin grafo, `REQUEST_GRAPH_FEAT`. Puente a We Do: lookup de path, ban de uses_label y fail-closed.
- **Proposed retrospective:**  
  Path missing → default alto, no arista inventada. El error clásico es convertir matching en veredicto. We Do: shared/degree/path y rechazo de label-as-feature.
- **Code/output changes:** none
- **Validation notes:** Output `shared 1` / `degree 2` / `path 99` alineado a theory T2-A.

---

### S32-T2-A-E1 (weDo, guided)
- **Diagnosis:** Starter hardcodea path=99 (aceptable por coincidencia) pero exige `uses_label is True` en meets — defecto de gate. Instruction mezcla todo; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Shared, degree y path sin label
- **Proposed preamble:**  
  - **Contexto:** el mini-grafo sintético Red Andina alimenta features, no veredictos.  
  - **Meta:** calcular shared, degree y path (lookup o 99) con `uses_label=False`.  
  - **Éxito:** `S32-T2-A PASS`.  
  - **Límites:** no uses label de decisión en el cómputo; path = `paths.get('E1-E9', 99)`.
- **Proposed instruction/description improvements:**  
  1. DEFECT: path no lee paths; meets exige uses_label True.  
  2. `path = paths.get("E1-E9", 99)`.  
  3. meets con uses_label **False** y shared/degree/path correctos.  
  4. Imprime `S32-T2-A` y el status.
- **Proposed feedback improvement:**  
  Shared, degree y path son topología observada en t. Exigir `uses_label=True` para “pasar” es entrenar con la respuesta: `REJECT_LABEL_AS_FEATURE`.
- **Proposed retrospective:**  
  Features de grafo ≠ label. El error clásico es colar `label_fraud` “porque ayuda al AUC”. Siguiente (E2): assess con ban de uses_label.
- **Code/output changes:** none
- **Validation notes:** Solution y output correctos; path=99 por ausencia de E1-E9 es intencional.

---

### S32-T2-A-E2 (weDo, independent)
- **Diagnosis:** `assess` debe recalcular topología y rechazar uses_label. Starter invierte el ban. Instruction da salidas; falta anclar “el grafo no autoriza parentesco”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Assess grafo y ban de label
- **Proposed preamble:**  
  - **Contexto:** un record con `uses_label=True` no debe promover features al catálogo de train.  
  - **Meta:** PASS con topología limpia; REJECT si hay label; MISSING sin neighbors.  
  - **Éxito:** `PASS REJECT_LABEL_AS_FEATURE MISSING:neighbors`.  
  - **Límites:** calcula degree desde neighbors; no confíes solo en el flag invertido.
- **Proposed instruction/description improvements:**  
  1. DEFECT: PASS si uses_label True.  
  2. Missing keys primero.  
  3. Calcula shared/degree/path; PASS solo si uses_label False y topología válida.  
  4. Imprime las tres rutas.
- **Proposed retrospective:**  
  El grafo resume evidencia, no emite parentesco ni fraude. Luego (E3): `REQUEST_GRAPH_FEAT` sin inventar degree=0.
- **Code/output changes:** none
- **Validation notes:** Output canónico intacto.

---

### S32-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Fail-closed de grafo: CONTINUE / REJECT_LABEL_AS_FEATURE / REQUEST_GRAPH_FEAT. Starter confunde missing con CONTINUE. Instruction fuerte; falta retrospective “no inventes degree=0”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Fail-closed: REQUEST_GRAPH_FEAT
- **Proposed preamble:**  
  - **Contexto:** sin vecinos no hay feature de degree legítima: pedir el grafo es mejor que inventar 0.  
  - **Meta:** topología limpia → CONTINUE; label → REJECT; sin neighbors → REQUEST_GRAPH_FEAT.  
  - **Éxito:** `CONTINUE REJECT_LABEL_AS_FEATURE REQUEST_GRAPH_FEAT`.  
  - **Límites:** no inventes degree=0; recalcula shared/degree/path.
- **Proposed instruction/description improvements:**  
  1. DEFECT: missing→CONTINUE; predicado invertido.  
  2. Sin neighbors → REQUEST_GRAPH_FEAT.  
  3. Con grafo: CONTINUE solo si uses_label False y topología ok.  
  4. Imprime las tres decisiones.
- **Proposed retrospective:**  
  Pedir la feature de grafo evita silent defaults. El error clásico es degree=0 “por si acaso”. Pregunta: ¿qué código sale si falta `neighbors`?
- **Code/output changes:** none
- **Validation notes:** Transfer alineado a T2-A y You Do `graph_feats`.

---

### S32-T2-B-DEMO (iDo)
- **Diagnosis:** Demo central de la sección: half-open vs cerrado (mal), `includes_t=False`. Falta preamble con la “historia del fallo del intro” y retrospective del misconception “incluir ts==t sube el AUC y está bien”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Incluir el instante de decisión `t` en un conteo de eventos es **leakage temporal clásico**: el score offline sube y en serve colapsa. Esta demo contrasta half-open `[t−w, t)` (count=2) con cerrado `<= t` (count=3) sobre eventos `[1,2,3,5]`, t=5, w=3. No escribas: predice count, closed_bad e includes_t. Observa `ok True` solo con la política half-open.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: half-open elimina leakage temporal; el cerrado infla features y el AUC offline (historia del intro); includes_t se deriva del predicado, no de un flag; sin w, `REQUEST_WINDOW`. Puente a We Do: corregir `<= t`, assess y fail-closed.
- **Proposed retrospective:**  
  Si el score solo sube con ventana cerrada, sospecha leakage. El error clásico es `ts <= t` “por redondeo”. We Do: forzar half-open y REQUEST_WINDOW.
- **Code/output changes:** none
- **Validation notes:** Output count 2 / closed_bad 3 / ok True alineado a theory T2-B.

---

### S32-T2-B-E1 (weDo, guided)
- **Diagnosis:** Starter usa `<= t` — el bug más importante de la sección. Instruction ya nombra half-open; sin title/preamble/retrospective formales.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Ventana half-open sin incluir t
- **Proposed preamble:**  
  - **Contexto:** en features de frecuencia del caso Red Andina, contar el evento en t filtra el futuro al modelo.  
  - **Meta:** corregir el predicado a `t−w <= ts < t` (count=2, includes_t=False).  
  - **Éxito:** `S32-T2-B PASS`.  
  - **Límites:** no uses `<= t`; includes_t se deriva del half-open, no de un booleano inventado.
- **Proposed instruction/description improvements:**  
  1. DEFECT: `<= t` en el sum y en includes_t.  
  2. Cambia ambos a `ts < t`.  
  3. meets: count==2 e includes_t False.  
  4. Imprime `S32-T2-B` y el status.
- **Proposed feedback improvement:**  
  Incluir t es leakage temporal. La política half-open es el contrato documentado en el catálogo: train y serve deben usar el mismo predicado.
- **Proposed retrospective:**  
  Estricto en t protege el momento de decisión. El error clásico es “cerrado se ve más estable”. Siguiente (E2): assess con flag includes_t.
- **Code/output changes:** none
- **Validation notes:** Solución y output correctos; es el lab de más impacto de leakage.

---

### S32-T2-B-E2 (weDo, independent)
- **Diagnosis:** `assess` debe recomputar count/includes y rechazar flag True. Starter confía en el flag invertido. Instruction da salidas; falta “el adverso no es schema roto”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Assess ventana y includes_t
- **Proposed preamble:**  
  - **Contexto:** un fixture con `includes_t=True` modela la ventana que filtra t, no un schema incompleto.  
  - **Meta:** PASS half-open limpio; REJECT si se marca t; MISSING sin w.  
  - **Éxito:** `PASS REJECT_FUTURE_TS MISSING:w`.  
  - **Límites:** si falta w no intentes el conteo; recomputa desde events.
- **Proposed instruction/description improvements:**  
  1. DEFECT: PASS cuando includes_t es True.  
  2. Missing w → MISSING:w.  
  3. Recompute count e includes half-open; PASS solo si flag y cómputo limpios.  
  4. Imprime las tres rutas.
- **Proposed retrospective:**  
  El adverso es leakage de política, no de keys. Luego (E3): REQUEST_WINDOW.
- **Code/output changes:** none
- **Validation notes:** Output canónico intacto.

---

### S32-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Fail-closed temporal: CONTINUE / REJECT_FUTURE_TS / REQUEST_WINDOW. Starter missing→CONTINUE. Instruction fuerte; falta retrospective de “sin ancho no hay feature temporal”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Fail-closed: REQUEST_WINDOW
- **Proposed preamble:**  
  - **Contexto:** sin ancho `w` no hay feature de frecuencia legítima hacia S33.  
  - **Meta:** válido → CONTINUE; t incluido → REJECT; sin w → REQUEST_WINDOW.  
  - **Éxito:** `CONTINUE REJECT_FUTURE_TS REQUEST_WINDOW`.  
  - **Límites:** no inventes w; recalcula includes desde events, no solo el flag.
- **Proposed instruction/description improvements:**  
  1. DEFECT: missing→CONTINUE; predicado invertido.  
  2. Sin w → REQUEST_WINDOW.  
  3. Con w: CONTINUE solo si half-open limpio y flag False.  
  4. Imprime las tres decisiones.
- **Proposed retrospective:**  
  Sin ancho de ventana no hay feature temporal. El error clásico es inventar w=7 “por costumbre”. Pregunta: ¿REJECT o REQUEST si falta `w`?
- **Code/output changes:** none
- **Validation notes:** Transfer alineado a You Do `window_count`.

---

### S32-T3-A-DEMO (iDo)
- **Diagnosis:** Demo rica: ModeImputer, error before_fit, column_router (análogo ColumnTransformer). Description larga; falta preamble “qué observar en el orden fit→transform” y retrospective del misconception “hardcodear 'app' en transform basta”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Un transformer tiene contrato: **fit** aprende estado, **transform** aplica; transformar sin fit debe fallar ruidoso. Esta demo fitea la moda de canal (`app`), rellena None, muestra `not fitted` si se llama antes, y enruta amount/canal con fill y scale de train. No escribas: predice la salida de transform, el mensaje before_fit y el routed de amount. Es la idea de sklearn Pipeline/ColumnTransformer sin runtime extra.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: fit→transform ordenado es train≡serve; hardcodear fill en transform rompe el state; router por tipo separa numéricas y categóricas; transform before fit → `REJECT_TRANSFORM_BEFORE_FIT`. Puente a We Do: ModeImputer real, assess try_before_fit y REQUEST_FIT_STATE.
- **Proposed retrospective:**  
  Estado fitted se demuestra con fit real, no con un flag. El error clásico es silent default en serve. We Do: aprender moda y fallar closed sin train_xs.
- **Code/output changes:** none
- **Validation notes:** Output multi-línea alineado a theory T3-A.

---

### S32-T3-A-E1 (weDo, guided)
- **Diagnosis:** Starter no aprende moda y hardcodea "app" en transform — defecto guiado excelente. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** ModeImputer: fit real y transform
- **Proposed preamble:**  
  - **Contexto:** en el pipeline categórico de canal, la moda debe aprenderse de train, no adivinarse.  
  - **Meta:** fit con `max(set, key=count)`; transform rellena None con `self.mode` y falla si no hay fit.  
  - **Éxito:** `S32-T3-A PASS` (out `['app','web']`, mode `app`).  
  - **Límites:** no hardcodees "app" en transform; raise si mode is None.
- **Proposed instruction/description improvements:**  
  1. DEFECT: fit deja mode=None; transform hardcodea.  
  2. En fit, aprende la moda de xs.  
  3. En transform, exige fit y usa self.mode.  
  4. Imprime `S32-T3-A` y el status.
- **Proposed feedback improvement:**  
  El orden fit→transform es el contrato. Un transform “que siempre pone app” no se puede versionar ni servir de forma auditable.
- **Proposed retrospective:**  
  Mode se aprende en fit y se reutiliza en serve. El error clásico es hardcodear la categoría mayoritaria. Siguiente (E2): assess try_before_fit.
- **Code/output changes:** none
- **Validation notes:** Solution y assert correctos.

---

### S32-T3-A-E2 (weDo, independent)
- **Diagnosis:** `assess` debe fittear train y rechazar try_before_fit. Starter confía en el flag adverso. Instruction da salidas; falta “un flag no es evidencia”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Assess fit real vs try_before_fit
- **Proposed preamble:**  
  - **Contexto:** un notebook que “transforma primero” no deja state reproducible para serve.  
  - **Meta:** PASS con fit+transform reales; REJECT si try_before_fit; MISSING sin train_xs.  
  - **Éxito:** `PASS REJECT_TRANSFORM_BEFORE_FIT MISSING:train_xs`.  
  - **Límites:** no confíes en un flag `fitted` prebakeado; mode desde train_xs.
- **Proposed instruction/description improvements:**  
  1. DEFECT: PASS si try_before_fit True.  
  2. Missing train_xs primero.  
  3. Si try_before_fit → REJECT; si no, fit y comprueba transform.  
  4. Imprime las tres rutas.
- **Proposed retrospective:**  
  El state fitted se demuestra con fit real sobre train_xs. Luego (E3): REQUEST_FIT_STATE.
- **Code/output changes:** none
- **Validation notes:** Output canónico intacto.

---

### S32-T3-A-E3 (weDo, transfer)
- **Diagnosis:** Fail-closed de transformers: CONTINUE / REJECT / REQUEST_FIT_STATE. Starter no hace fit. Instruction OK; falta retrospective “no inventes mode='app'”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Fail-closed: REQUEST_FIT_STATE
- **Proposed preamble:**  
  - **Contexto:** sin train_xs no hay state de fit que serializar hacia `fs-vN`.  
  - **Meta:** fit real → CONTINUE; try_before_fit → REJECT; sin train → REQUEST_FIT_STATE.  
  - **Éxito:** `CONTINUE REJECT_TRANSFORM_BEFORE_FIT REQUEST_FIT_STATE`.  
  - **Límites:** no inventes mode='app' sin fit; CONTINUE solo con transform de longitud correcta.
- **Proposed instruction/description improvements:**  
  1. DEFECT: missing→CONTINUE; predicado invertido.  
  2. Sin train_xs → REQUEST_FIT_STATE.  
  3. Con train: REJECT si try_before_fit; si no, fit y CONTINUE si ok.  
  4. Imprime las tres decisiones.
- **Proposed retrospective:**  
  Pedir el state de fit evita silent defaults en serve. El error clásico es inventar la moda. Pregunta: ¿qué sale si falta `train_xs`?
- **Code/output changes:** none
- **Validation notes:** Transfer alineado a T3-A.

---

### S32-T3-B-DEMO (iDo)
- **Diagnosis:** Round-trip JSON del state y apply de mediana a serve — artefacto clave para S33. Falta preamble “por qué versionar” y retrospective “servir sin version es skew silencioso”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  El estado fit (mediana, vocab, μ/σ) debe **sobrevivir** al notebook: se serializa y se aplica igual en serve. Esta demo hace round-trip JSON de `{median: 2, version: fs-v1}` y rellena `[None, 4]` → `[2, 4]`. No escribas: predice median, version y serve. Si mañana cambia el vocab de `canal`, subes a `fs-v2` — S33 debe citar el id nuevo, no reutilizar el viejo en silencio.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: persistir estado versionado evita skew silencioso; apply de mediana de train es el mismo en train e inferencia; sin version → `REJECT_UNVERSIONED`; sin JSON → `REQUEST_STATE_JSON`. Puente a We Do: apply median, assess fs-v* y fail-closed.
- **Proposed retrospective:**  
  `fs-vN` es el contrato de entrada del baseline. El error clásico es reestimar mediana en serve. We Do: round-trip + version bump discipline.
- **Code/output changes:** none
- **Validation notes:** Output `2` / `version fs-v1` / `serve [2, 4]` alineado a theory T3-B.

---

### S32-T3-B-E1 (weDo, guided)
- **Diagnosis:** Starter no aplica mediana al batch. Instruction densa; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** JSON state y mediana en serve
- **Proposed preamble:**  
  - **Contexto:** el batch de serve del caso Red Andina no puede ir con None si el state ya tiene mediana de train.  
  - **Meta:** round-trip JSON, apply median, version que empiece por `fs-v`.  
  - **Éxito:** `S32-T3-B PASS` (serve `[2, 4]`, fs-v1).  
  - **Límites:** no dejes serve = `[None, 4]`; no borres la version.
- **Proposed instruction/description improvements:**  
  1. DEFECT: serve no aplica median.  
  2. `loaded = json.loads(json.dumps(state))`.  
  3. Rellena None con `loaded["median"]`.  
  4. Imprime `S32-T3-B` y el status.
- **Proposed feedback improvement:**  
  El round-trip JSON es el contrato de persistencia. Servir sin aplicar mediana o sin version legible es `REJECT_UNVERSIONED`.
- **Proposed retrospective:**  
  State versionado + apply idéntico = train≡serve. El error clásico es “solo imprimir version”. Siguiente (E2): assess con version vacía.
- **Code/output changes:** none
- **Validation notes:** Solution y output correctos.

---

### S32-T3-B-E2 (weDo, independent)
- **Diagnosis:** `assess` debe round-trip, apply y validar `fs-v*`. Starter invierte el gate de version. Instruction da salidas; falta anclar S33 como consumidor del id.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Assess fs-vN y apply de mediana
- **Proposed preamble:**  
  - **Contexto:** el id `fs-vN` es lo que el baseline S33 citará; version vacía no se promueve.  
  - **Meta:** PASS con state válido y batch sin None; REJECT si version vacía; MISSING sin version.  
  - **Éxito:** `PASS REJECT_UNVERSIONED MISSING:version`.  
  - **Límites:** no apruebes solo con un flag versioned; apply real de median.
- **Proposed instruction/description improvements:**  
  1. DEFECT: PASS sin version válida y sin apply.  
  2. Missing version → MISSING:version.  
  3. Round-trip + startswith('fs-v') + serve == [2, 4].  
  4. Imprime las tres rutas.
- **Proposed retrospective:**  
  Round-trip y apply demuestran train≡serve; el id es el contrato. Luego (E3): REQUEST_STATE_JSON.
- **Code/output changes:** none
- **Validation notes:** Output canónico intacto.

---

### S32-T3-B-E3 (weDo, transfer)
- **Diagnosis:** Fail-closed de persistencia: CONTINUE / REJECT_UNVERSIONED / REQUEST_STATE_JSON. Starter no aplica median. Instruction OK; falta retrospective de artefacto.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Fail-closed: REQUEST_STATE_JSON
- **Proposed preamble:**  
  - **Contexto:** sin version en el record no hay artefacto que S33 pueda citar.  
  - **Meta:** state+apply ok → CONTINUE; version vacía → REJECT; sin version → REQUEST_STATE_JSON.  
  - **Éxito:** `CONTINUE REJECT_UNVERSIONED REQUEST_STATE_JSON`.  
  - **Límites:** no inventes version; CONTINUE solo si serve quedó sin None.
- **Proposed instruction/description improvements:**  
  1. DEFECT: missing→CONTINUE; no aplica median.  
  2. Sin version → REQUEST_STATE_JSON.  
  3. Con version: JSON + fill; CONTINUE si ok.  
  4. Imprime las tres decisiones.
- **Proposed retrospective:**  
  `REQUEST_STATE_JSON` es fail-closed cuando falta el artefacto. El error clásico es promover con version vacía. Pregunta: ¿qué sale si `version=""`?
- **Code/output changes:** none
- **Validation notes:** Transfer alineado a You Do state versionado.

---

### S32-T4-A-DEMO (iDo)
- **Diagnosis:** Time split + overlap de entidades = 0 — defensa de leakage de identidad. Falta preamble de “misma entidad en train y test infla AUC” y retrospective del misconception “random split basta en datos relacionales”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Si la misma entidad aparece en train y test, el modelo memoriza identidad, no patrón generalizable: **leakage de identidad**. Esta demo parte filas sintéticas por cutoff `2026-02-01` (e1 en enero, e2 en febrero) y mide intersección de entidades. No escribas: predice n_train, n_test, overlap y ok. Observa que overlap 0 es el gate antes del baseline S33.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: split temporal + aislamiento de entity; overlap > 0 → `REJECT_ENTITY_OVERLAP`; informe con n_train/n_test/overlap explícitos (no un print “ok” vacío); sin filas → `REQUEST_SPLIT_KEYS`. Puente a We Do: derivar tamaños, assess overlap y fail-closed.
- **Proposed retrospective:**  
  Overlap de entidades infla métricas offline y engaña a la cola de revisión. El error clásico es split aleatorio sobre filas con entidades repetidas. We Do: calcular overlap, no hardcodearlo.
- **Code/output changes:** none
- **Validation notes:** Output n_train 1 / n_test 1 / overlap 0 alineado a theory T4-A.

---

### S32-T4-A-E1 (weDo, guided)
- **Diagnosis:** Starter hardcodea n_train/n_test/overlap — defecto guiado perfecto. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Split por tiempo y overlap de entidades
- **Proposed preamble:**  
  - **Contexto:** el informe de split de CP-N3-B debe derivarse de filas, no de constantes de pizarra.  
  - **Meta:** train = ts < cut; overlap = intersección de entity; n_train=1, n_test=1, overlap=0.  
  - **Éxito:** `S32-T4-A PASS`.  
  - **Límites:** no hardcodees tamaños; deriva de las listas.
- **Proposed instruction/description improvements:**  
  1. DEFECT: `n_train, n_test, overlap = 1, 1, 0` fijos.  
  2. Filtra train/test por cut.  
  3. Calcula len y len(intersección de entity).  
  4. Imprime `S32-T4-A` y el status.
- **Proposed feedback improvement:**  
  El gate exige cero intersección de entidades. Reportar n_train/n_test/overlap es parte del informe, no un detalle opcional.
- **Proposed retrospective:**  
  Overlap se mide, no se inventa. El error clásico es “ya sé que es cero”. Siguiente (E2): assess con entity repetida.
- **Code/output changes:** none
- **Validation notes:** Solution y assert correctos.

---

### S32-T4-A-E2 (weDo, independent)
- **Diagnosis:** `assess` debe medir overlap real; starter aprueba si ambos lados no vacíos. Instruction da salidas; falta escena de e1 en ambos lados.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Assess isolation de entidades en split
- **Proposed preamble:**  
  - **Contexto:** e1 en train y test (mismo entity, distinto ts) es el fallo clásico de group leakage.  
  - **Meta:** PASS sin overlap; REJECT con intersección; MISSING sin rows.  
  - **Éxito:** `PASS REJECT_ENTITY_OVERLAP MISSING:rows`.  
  - **Límites:** no uses flags precomputados; intersección real de entity.
- **Proposed instruction/description improvements:**  
  1. DEFECT: PASS si train y test no vacíos, sin medir overlap.  
  2. Calcula intersección de entity.  
  3. PASS solo si lados no vacíos y len(overlap)==0.  
  4. Imprime las tres rutas.
- **Proposed retrospective:**  
  El overlap se deriva de las filas. Luego (E3): REQUEST_SPLIT_KEYS.
- **Code/output changes:** none
- **Validation notes:** Output canónico intacto; invalid fixture bien diseñado (e1/e1).

---

### S32-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Fail-closed de split: CONTINUE / REJECT_ENTITY_OVERLAP / REQUEST_SPLIT_KEYS. Starter confía en presencia de rows sin medir. Instruction fuerte; falta retrospective de informe obligatorio.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Fail-closed: REQUEST_SPLIT_KEYS
- **Proposed preamble:**  
  - **Contexto:** sin filas de split no se puede auditar leakage de identidad antes del baseline.  
  - **Meta:** overlap 0 y lados no vacíos → CONTINUE; overlap > 0 → REJECT; sin rows → REQUEST_SPLIT_KEYS.  
  - **Éxito:** `CONTINUE REJECT_ENTITY_OVERLAP REQUEST_SPLIT_KEYS`.  
  - **Límites:** no confíes en n_train prebakeado; recalcula intersección.
- **Proposed instruction/description improvements:**  
  1. DEFECT: missing→CONTINUE; no mide intersección.  
  2. Sin rows → REQUEST_SPLIT_KEYS.  
  3. Con rows: CONTINUE solo si overlap 0 y lados no vacíos.  
  4. Imprime las tres decisiones.
- **Proposed retrospective:**  
  El informe de split es obligatorio antes del baseline. El error clásico es “ok” sin números. Pregunta: ¿qué sale si e1 está en train y test?
- **Code/output changes:** none
- **Validation notes:** Transfer alineado a You Do `time_group_split`.

---

### S32-T4-B-DEMO (iDo)
- **Diagnosis:** Scan leaky + skew + feature_set fs-v2 — cierre del promote. Falta preamble de “promover con leakage no es warning” y retrospective del misconception “label_decision ayuda al modelo”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Nombres con `label` o `decision` en el catálogo son **red flags**: el modelo entrenaría con la respuesta. Esta demo escanea `['amount_7d', 'label_decision']`, mide skew |0.8−0.0| > 0.5 y muestra `feature_set fs-v2`. No escribas: predice leaky, skew y el id. En promote limpio (hacia S33) leaky vacío, skew False e id `fs-v*` son obligatorios — no “warnings opcionales”.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: scan de nombres + skew en CI antes del baseline; promover con leaky/skew es fallo de gate; id debe empezar por `fs-v`; sin id → `REQUEST_FEATURE_SET_ID`. Puente a We Do: gate limpio, assess y fail-closed final.
- **Proposed retrospective:**  
  Scan + skew + fs-vN cierran el promote. El error clásico es colar `label_decision` “solo para el notebook”. We Do: invertir el gate defectuoso y exigir id.
- **Code/output changes:** none
- **Validation notes:** Output leaky / skew True / fs-v2 alineado a theory T4-B (demo muestra detección, no promote limpio).

---

### S32-T4-B-E1 (weDo, guided)
- **Diagnosis:** Starter invierte el gate (PASS si hay leak o skew). Fixture limpio debe pasar. Instruction densa; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Gate limpio: scan, skew y fs-vN
- **Proposed preamble:**  
  - **Contexto:** el promote hacia S33 solo avanza con catálogo limpio, skew bajo tolerancia e id versionado.  
  - **Meta:** names sin label/decision, |serve−train| ≤ tol, feature_set `fs-v*`.  
  - **Éxito:** `S32-T4-B PASS`.  
  - **Límites:** no inviertas el gate; no ignores feature_set.
- **Proposed instruction/description improvements:**  
  1. DEFECT: `meets = bool(leaky) or skew`.  
  2. Cambia a not leaky and not skew and startswith('fs-v').  
  3. Status PASS/REJECT_LEAKAGE.  
  4. Imprime `S32-T4-B` y el status.
- **Proposed feedback improvement:**  
  El scan de nombres y el skew cierran el promote. Un gate invertido “premia” el leakage y deja el baseline S33 sobre un espejismo.
- **Proposed retrospective:**  
  Promote limpio = sin leaky, sin skew, con fs-vN. El error clásico es invertir el booleano del gate. Siguiente (E2): assess con label_decision.
- **Code/output changes:** none
- **Validation notes:** Fixture limpio (means 0.0/0.1, tol 0.5) coherente con PASS.

---

### S32-T4-B-E2 (weDo, independent)
- **Diagnosis:** `assess` con válido limpio, adverso label+skew, incomplete sin feature_set. Starter invierte PASS. Instruction da salidas; falta “skew se mide, no se intuye”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Assess leakage, skew y feature_set
- **Proposed preamble:**  
  - **Contexto:** `label_decision` en names y |serve−train| > tol son rechazo de promote, no “features útiles”.  
  - **Meta:** PASS limpio; REJECT_LEAKAGE en adverso; MISSING sin feature_set.  
  - **Éxito:** `PASS REJECT_LEAKAGE MISSING:feature_set`.  
  - **Límites:** recalcula leaky y skew; no uses listas prebakeadas de “ya sé que pasa”.
- **Proposed instruction/description improvements:**  
  1. DEFECT: PASS si leaky o skew.  
  2. Missing feature_set → MISSING:feature_set.  
  3. PASS solo si not leaky, not skew y fs-v*.  
  4. Imprime las tres rutas.
- **Proposed retrospective:**  
  `label_decision` es red flag; el skew se mide con umbral. Luego (E3): REQUEST_FEATURE_SET_ID.
- **Code/output changes:** none
- **Validation notes:** Output canónico intacto.

---

### S32-T4-B-E3 (weDo, transfer)
- **Diagnosis:** Fail-closed final del pipeline: CONTINUE / REJECT_LEAKAGE / REQUEST_FEATURE_SET_ID. Starter promote ciego (siempre CONTINUE). Instruction fuerte; falta retrospective de “contrato que S33 cita”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Fail-closed: REQUEST_FEATURE_SET_ID
- **Proposed preamble:**  
  - **Contexto:** el feature_set id es el contrato que el baseline S33 debe citar; sin id no se entrena.  
  - **Meta:** limpio → CONTINUE; leaky/skew → REJECT; sin feature_set → REQUEST_FEATURE_SET_ID.  
  - **Éxito:** `CONTINUE REJECT_LEAKAGE REQUEST_FEATURE_SET_ID`.  
  - **Límites:** no promotes ciego; recalcula scan y skew.
- **Proposed instruction/description improvements:**  
  1. DEFECT: missing→CONTINUE; always CONTINUE.  
  2. Sin feature_set → REQUEST_FEATURE_SET_ID.  
  3. Con id: CONTINUE solo si scan limpio, sin skew y fs-v*.  
  4. Imprime las tres decisiones.
- **Proposed retrospective:**  
  El promote se gana midiendo, no leyendo un booleano previo. El error clásico es CONTINUE ciego. Pregunta: ¿qué sale si falta `feature_set` en el record?
- **Code/output changes:** none
- **Validation notes:** Transfer final alineado a You Do leak_scan + skew + version.

---

### S32-YOU-DO (youDo)
- **Diagnosis:** Marco de proyecto **sólido**: context ancla CP-N3-B → S33, objectives cubren catálogo/missing/grafo/ventana/fs-vN/split/leakage, requirements train≡serve y sin PII real, rubric con pesos, starter con stubs y acceptance comments. **Falta** `retrospective` de defensa post-build (spec §6 / ejemplar §8.3). Sin ella el learner cierra el tab sin protocolar invariantes, PII sintético vs real y frase de impacto medible.
- **Checklist:** context pass · goal pass (objectives) · success pass (rubric + asserts comentados) · constraints pass (requirements) · retrospective **fail**
- **Severity:** P1
- **Proposed title:** (ya existe) Feature table versionada sin leakage (CP-N3-B)
- **Proposed preamble:** N/A — `context` ya cumple rol de escena; no duplicar. Opcional: una línea al final de context que reenvíe a la retrospective al marcar listo.
- **Proposed instruction/description improvements:**  
  Mantener context/objectives/requirements/starter. Asegurar que el Fixer no altere outputs de acceptance (`n_e1==2`, `ov==0`, `leaky==[]`, version `fs-v*`). Opcional P2: descomentar o documentar asserts en README del portfolio.
- **Proposed retrospective:**  
  Antes de marcar listo: (1) ¿qué invariante demuestras con print o assert — ventana half-open, overlap 0, o leaky vacío? (2) ¿qué harías distinto con datos reales vs. sintéticos Red Andina (PII, ventanas legales, labels de decisión)? (3) Escribe en el README una frase de impacto medible (p. ej. “mismo state `fs-vN` en train y serve; overlap entity = 0”) que puedas defender en 30 segundos ante quien entrena el baseline S33.
- **Code/output changes:** none (starter y acceptance intactos)
- **Validation notes:** Starter coherente con labs E1–E3; portfolioNote ya nombra traspaso a S33.

---

## Priority order

### P0 (We Do: title + preamble + instruction solo-tarea + retrospective; feedback polish opcional en el mismo pase)
1. **S32-T1-A-E1, E2, E3** — catálogo / unknown / REQUEST_CATALOG  
2. **S32-T1-B-E1, E2, E3** — missing-scale / silent fill / REQUEST_MEDIAN  
3. **S32-T2-A-E1, E2, E3** — grafo / label ban / REQUEST_GRAPH_FEAT  
4. **S32-T2-B-E1, E2, E3** — half-open (máximo impacto de leakage temporal) / REQUEST_WINDOW  
5. **S32-T3-A-E1, E2, E3** — ModeImputer / try_before_fit / REQUEST_FIT_STATE  
6. **S32-T3-B-E1, E2, E3** — persistencia fs-vN / REQUEST_STATE_JSON  
7. **S32-T4-A-E1, E2, E3** — split / entity overlap / REQUEST_SPLIT_KEYS  
8. **S32-T4-B-E1, E2, E3** — promote scan-skew-id / REQUEST_FEATURE_SET_ID  

### P1
9. **S32-T1-A … T4-B DEMOs (8 iDo)** — añadir `preamble` + `retrospective`; ampliar `why` al rango 40–90 palabras  
10. **S32-YOU-DO** — añadir `retrospective` de defensa (invariante, PII, frase de impacto S33)

### P2
11. **We Do `feedback`** — alargar 25–60 palabras donde solo hay una frase y falta ancla de cola/baseline  
12. **I Do `why`** — unificar tono con demos vecinas tras el pase P1  
13. **You Do** — opcional: asserts de acceptance descomentados o checklist en portfolioNote

---

## Residual risks
- **Nombre de archivo vs contenido:** `s32-microservices.ts` / id `microservices` no describe “features sin leakage”; el Fixer no debe renombrar en este pase (fuera de scope de campos pedagógicos), pero el reviewer de producto puede anotar deuda de naming.
- **Carga cognitiva de 24 We Do:** el patrón E1→E2→E3 (booleano → assess → decide) es pedagógico y real, pero un newbie puede fatigar; preambles diferenciados (no clones) son el antídoto — el Fixer debe respetar fade de prosa, no copiar el mismo bloque en los 24.
- **E2 que aún “leen flags” en parte** (p. ej. includes_t, uses_label, try_before_fit): el diseño es intencional (validar contrato + recompute); la prosa debe dejar claro que el flag no sustituye el cálculo.
- **Demo T4-B muestra leaky/skew True** mientras E1 de T4-B usa fixture limpio: es coherente (demo = detección; lab = gate de promote limpio); el Fixer no debe “unificar” outputs rompiendo theory.
- **Exact outputs:** no cambiar strings canónicos (`S32-T*-* PASS`, tríos PASS/REJECT/MISSING, tríos CONTINUE/REJECT/REQUEST) salvo execute-and-diff justificado.
- **Sin editar source en Round 1:** este informe es solo diagnóstico y prosa propuesta; implementación = Fixer prompt.

---

Section 32 exercise pedagogy review complete. Ready for the Fixer prompt.
