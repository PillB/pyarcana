# S36 Exercise Pedagogy Report (Round 1)

## Section
- **title:** Clustering, anomalías y validación temporal
- **shortTitle:** Clustering y anomalías
- **id:** `ai-apis-advanced` (archivo `s36-ai-apis-advanced.ts`; contenido = señales auxiliares no supervisadas para triage CP-N3-C, no “APIs de IA genéricas”)
- **index:** 36
- **source:** `src/lib/course/sections/s36-ai-apis-advanced.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades de práctica/demo)
- **subtemas:** S36-T1-A scale/assign–update/density · T1-B k multi-seed · T2-A PCA toy · T2-B interpretación prudente · T3-A σ + path length · T3-B contamination/novelty · T4-A backtest temporal · T4-B P@k + HITL
- **hilo de caso:** workbench de riesgo operativo sintético **CASO-LIM-036** (Red Andina ficticia, Lima) — clustering, rareza y backtests alimentan cola de revisión; **anomalía ≠ conducta indebida**; fail-closed + HITL; puente S35 (ficha del caso) → S36 (señales) → S37 (costo) → S39 (triage CP-N3-C)

## Method
- Leído `PEDAGOGY_EXERCISE_SPEC.md` (campos, longitudes 80–150 preamble / 40–80 retrospective / 40–100 instruction, checklist, fade E1→E2→E3).
- Inspeccionado manualmente cada `iDo.steps[]` (8 demos, ~451–709), `weDo.steps[]` (24 ejercicios, ~711–1725) y `youDo` (~1728–1844) en `s36-ai-apis-advanced.ts`.
- Contrastado con theory T1–T4, learning outcomes y ética de señales (misconduct=False, contamination≠fraude, leakage temporal).
- **Sin** generadores, bucles, plantillas ni copy-paste mecánico entre unidades.
- Prosa propuesta en **español profesional peruano**, un objetivo primario por unidad.

## Hallazgos transversales (antes del ledger)

| Campo / hábito | Estado actual en S36 |
|----------------|----------------------|
| I Do `preamble` | **Ausente** en las 8 demos |
| I Do `retrospective` | **Ausente** en las 8 demos |
| I Do `description` | Presente y técnica; nombra el skill; no sustituye preamble formal |
| I Do `why` | Presente; suele ser **1 frase** (bajo el rango 40–90 palabras del spec) |
| We Do `title` | **Ausente** en los 24 |
| We Do `preamble` | **Ausente** en los 24 |
| We Do `retrospective` | **Ausente** en los 24 |
| We Do `instruction` | Estilo denso “ID · Concepto + fixture + defect del starter + Caso 036 + salida” en un solo párrafo: meta, éxito y límites mezclados; legible para quien ya opera unsupervised, **opaco** para newbie sin escena de cola de revisión |
| We Do `feedback` | 1 frase; nombra el principio (bien); poco *por qué importa a la cola HITL / al gate ético / al README del portfolio* |
| Starter `# DEFECT` | **Excelente** hábito en todos; defectos bien nombrados y alineados a la solución |
| Hints | E1 casi-solución (aceptable guided); E3 a veces da la fórmula casi completa (andamiaje mínimo OK para transfer) |
| You Do marco | `context` / `objectives` / `requirements` / `rubric` / `portfolioNote` / starter **sólidos** y con gate ético |
| You Do `retrospective` | **Ausente** |
| Código / outputs | Coherentes con theory y CP-N3-C; **no** proponer cambios de output salvo notas puntuales |
| Solape T1-B-E1 ↔ T1-B-E2 | Ambos practican `min`→`max` sobre mapas k→score; E2 añade `sanction_from_metric False`. Fade débil en código; el Fixer debe **diferenciar preambles** (elegir k vs. no sancionar por métrica) |
| Solape T3-A-E1 ↔ T3-A-E3 | Ambos corrigen `z=0`→`z=3`; E3 añade ruta `human_review` y `auto_sanction False`. Preambles distintos (regla σ vs. política de enrutamiento) |

**Patrón dominante:** el andamiaje de *código* (bugs nombrados, outputs canónicos, stdlib progressive disclosure, política fail-closed en prints, multi-seed / leakage / P@k) es maduro y alineado al cierre de señales CP-N3-C. El andamiaje *pedagógico verbal* (preamble → instruction solo-tarea → retrospective) no existe. Un true newbie no responde con claridad: qué practico, por qué importa priorizar la cola sintética de Red Andina sin culpar, cómo sé que gané, qué debe quedarme al cerrar la pestaña.

**Fade E1→E2→E3 (contenido):** progresión real en la mayoría de subtemas (p. ej. T1-A: media → z-score → assign–update+density; T3-A: σ → path IF → route HITL; T4-A: fit/score → anti-leakage de meses → spike de tasas; T4-B: P@k → HITL por escasez → elegir métrica). **No** son tres clones idénticos, salvo el par T1-B-E1/E2 (mismo bug min/max). El fade de *prosa* no se ve porque no hay preambles diferenciados.

**Severity default:** missing preamble+title+retrospective en We Do = **P0**; I Do sin preamble/retrospective = **P1** (aún tienen description+why+código); youDo sin retrospective = **P1**; polish de feedback/why = **P2** si caen preamble/instruction/retrospective.

---

## Unit ledger

### S36-T1-A-DEMO (iDo)
- **Diagnosis:** Demo sólida de z-score, assign–update 1D y núcleos density en espacio escalado con `verdict` implícito en la ética del lab (no imprime culpa). La `description` nombra el skill; falta `preamble` que diga *qué observar* (bajo/alto en z, core en el cluster denso) y `retrospective` del misconception “el id de cluster es una etiqueta de conducta”. El `why` es una frase.
- **Checklist:** context fail · goal partial · success partial (output visible) · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Antes de encolar casos del workbench sintético Red Andina, el analista necesita **segmentar por geometría**, no por culpa. En esta demo una serie `raw=[1.0,1.2,5.0,5.2,5.1]` se escala con z-score; un paso assign–update con k=2 separa bajo/alto; density (`eps=0.5`, `min_samples=3`, contando el propio punto) marca núcleos locales. No escribas aún: predice `labels`, los centroides y `core_density`, y compara con la salida. Si saltas el scale, la magnitud miente; si lees el `0`/`1` como “culpable”, rompes el contrato del triage.
- **Proposed instruction/description improvements:**  
  Mantener description. Ampliar `why` (~50–70 palabras): el z-score pone features en escala comparable; assign etiqueta al centroide más cercano y update recalcula medias (núcleo de k-means); density marca densidad local como en la convención sklearn de DBSCAN 1D. Ningún print es veredicto moral. Puente a We Do: reparar media, z-score con `sd=0` y el ciclo assign–update+density con `verdict False`.
- **Proposed retrospective:**  
  Si puedes explicar por qué el centroide y el núcleo density son resúmenes geométricos y no “prueba de fraude”, ya tienes el hábito de señales auxiliares. El error clásico es publicar el id de cluster como sanción. En We Do practicarás media, scale y un ciclo assign–update con defecto ético deliberado.
- **Code/output changes:** none
- **Validation notes:** Output `labels [0,0,1,1,1]` / `c1 -1.22 c2 0.82` / `core_density [False,False,True,True,True]` / `scaled True` alineado a theory T1-A.

---

### S36-T1-A-E1 (weDo, guided)
- **Diagnosis:** Drill guiado claro: starter devuelve la suma en lugar de la media y omite guard de vacío. Instruction densa mezcla ID, meta, defect y prints; sin title, preamble ni retrospective. Feedback nombra geometría pero no ancla “por qué la cola de segmentación depende de un centroide honesto”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Centroide 1D como media del grupo
- **Proposed preamble:**  
  - **Contexto:** en el lab CASO-LIM-036, el primer ladrillo de k-means 1D es resumir un grupo con su media (centroide), no con la suma.  
  - **Meta:** implementar `centroid(vals)` = media aritmética, con `ValueError` si el grupo está vacío.  
  - **Éxito:** con `xs=[1,2]` imprimes `1.5`, luego `n 2` y `ok True`.  
  - **Límites:** no uses la suma cruda; no inventes `0.0` en vacío; no es veredicto de conducta.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `return sum(vals)` (bug: falta dividir y guard).  
  2. Si `not vals`, lanza `ValueError("empty group")`.  
  3. Si no, devuelve `sum(vals) / len(vals)`.  
  4. Conserva los tres prints del contrato.
- **Proposed feedback improvement:**  
  El centroide es la media del grupo: resume geometría para segmentar la cola. Usar la suma infla el “centro” y rompe assign–update. El guard de vacío evita división por cero cuando un cluster queda sin puntos.
- **Proposed retrospective:**  
  Media = centroide 1D; vacío = error, no un `0.0` inventado. El error clásico es tratar la suma como posición. Siguiente (E2): z-score con protección de `sd=0`.
- **Code/output changes:** none
- **Validation notes:** DEFECT bien nombrado; solution y output `1.5` / `n 2` / `ok True` correctos.

---

### S36-T1-A-E2 (weDo, independent)
- **Diagnosis:** Bug de z-score (resta sin dividir, sin `safe_sd`) excelente para independiente. Instruction ya nombra fórmula y fixture; falta escena “montos vs. conteos” y cierre metacognitivo scale-first.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Z-score seguro con sd cero
- **Proposed preamble:**  
  - **Contexto:** sin scale, en Red Andina gana la feature con mayor magnitud (soles vs. conteos). Aquí practicas el z-score atómico antes del assign.  
  - **Meta:** calcular `(x-mu)/safe_sd` con `safe_sd = sd if sd else 1.0`.  
  - **Éxito:** con `x=4, mu=0, sd=2` imprimes `2.0`, `safe_sd 2` y `ok True`.  
  - **Límites:** no omitas la división; si `sd=0` no divides por cero; solo sintético.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: `return x - mu` (bug).  
  2. Define `safe_sd` y divide.  
  3. Imprime `z`, luego `safe_sd` y `ok True` como en la solución.  
  4. No hardcodees `2.0` sin calcular.
- **Proposed retrospective:**  
  Scale-first es el hábito que salva distancias. Dividir por cero o “restar y ya” distorsiona la cola. Luego (E3) unes assign–update y density con `verdict False`.
- **Code/output changes:** none
- **Validation notes:** Solution devuelve tupla `(z, safe_sd)`; starter imprime `sd` crudo en la 2.ª línea — el Fixer debe alinear starter/instruction si se exige el mismo contrato de prints que la solution (hoy el learner debe devolver también `safe_sd`). Nota para Fixer: el starter imprime `print("safe_sd", sd)` con `sd=2` (pasa numéricamente) pero no expone el guard; la solution sí. Pedir en instruction que se imprima el `safe_sd` devuelto por la función.

---

### S36-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer auténtico: labels nearest-centroid, update de medias, density core y corrección ética `verdict True`→`False`. Starter multi-defect es excelente. Falta preamble de “segmentar cola, no sancionar” y retrospective de reutilización en el youDo.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Assign–update y density sin veredicto
- **Proposed preamble:**  
  - **Contexto:** en CASO-LIM-036-1A segmentas la cola por geometría 1D: centroides + núcleos density, nunca por “culpa”.  
  - **Meta:** assign al centroide más cercano, update de medias, `density_core_1d` con `min_samples` contando el propio punto, y `verdict False`.  
  - **Éxito:** `labels [0,0,1,1]`, `c1 3.0 c2 11.0`, `core_density` todo `True`, `verdict False` con `xs=[2,4,10,12]`, `cents0=[2,12]`, `eps=8`, `min_samples=2`.  
  - **Límites:** no dejes labels fijos; no imprimas `cents0` sin update; no marques `verdict True`.
- **Proposed instruction/description improvements:**  
  1. Corrige labels con `argmin |x − c_i|`.  
  2. Agrupa y calcula medias `c1`/`c2`.  
  3. Implementa density: `n_inc >= min_samples` (incluye el punto).  
  4. Imprime labels, c1/c2, core_density y `verdict False`.
- **Proposed retrospective:**  
  Un ciclo assign–update + máscara density basta para ver el núcleo de k-means y DBSCAN 1D. El error clásico es fijar labels a mano o convertir el cluster en sanción. Pregunta: ¿por qué `min_samples` cuenta el propio punto? (convención sklearn.)
- **Code/output changes:** none
- **Validation notes:** Transfer real multi-skill; alineado a demo y theory T1-A.

---

### S36-T1-B-DEMO (iDo)
- **Diagnosis:** Worked example claro de argmax de k en dos seeds y `stable` por acuerdo de k (no ARI). Description OK; falta preamble de “k de negocio vs. espejismo de silhouette” y retrospective del misconception “stable de k = particiones idénticas”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Elegir **k** en el lab multi-seed no es maximizar un número mágico ni sancionar un segmento. En esta demo dos mapas sintéticos k→score eligen el mismo k=3 y `stable True` solo significa **acuerdo de k**, no que las particiones sean idénticas (eso pediría ARI). No escribas: predice `k`, `score` y `stable` antes de mirar la salida. Si fijas k con un solo seed, el “óptimo” puede ser ruido de inicialización.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: `max(scores, key=scores.get)` elige k por seed; igualdad de k no es estabilidad de etiquetas; silhouette alto no legitima sanción. Puente a We Do: corregir `min` por `max`, reportar multi-seed y no sancionar por métrica.
- **Proposed retrospective:**  
  Acuerdo de k ≠ ARI. El error clásico es vender un k inestable o sancionar por silhouette. We Do: argmax, stable y la bandera ética `sanction_from_metric False`.
- **Code/output changes:** none
- **Validation notes:** Output `k 3` / `score 0.5` / `stable True` alineado a theory T1-B.

---

### S36-T1-B-E1 (weDo, guided)
- **Diagnosis:** Starter usa `min` en seed_a — defect guiado perfecto. Instruction telegráfica densa; sin escena de capacidad de cola / multi-seed. Sin title/preamble/retrospective. Feedback correcto pero corto.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Argmax de k en dos seeds
- **Proposed preamble:**  
  - **Contexto:** en CASO-LIM-036-1B eliges k comparando dos seeds sintéticos de score interno, no con un solo run.  
  - **Meta:** `k = max(scores, key=scores.get)` en cada seed; `multi_seed = (k_a == k_b)`.  
  - **Éxito:** imprime `k 3`, `score 0.6` y `multi_seed True` con los mapas del fixture.  
  - **Límites:** no uses `min` sobre scores de calidad; no inventes k a ojo.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `k_a = min(seed_a, key=seed_a.get)` (bug).  
  2. Cámbialo a `max` (seed_b ya está bien).  
  3. Imprime k de seed_a, su score y el bool de acuerdo.  
  4. No reordenes los diccionarios a mano.
- **Proposed retrospective:**  
  Argmax elige el k con mejor score reportado; multi_seed exige el mismo k en ambos seeds. El error clásico es `min` por confusión con “menor error”. Siguiente (E2): misma idea + no sancionar por métrica.
- **Code/output changes:** none
- **Validation notes:** DEFECT claro; Pass correcto.

---

### S36-T1-B-E2 (weDo, independent)
- **Diagnosis:** Casi el mismo bug que E1 (`min` en seed_a) con fixtures distintos y print `sanction_from_metric False`. Fade de código débil respecto a E1; la diferenciación debe vivir en preamble (política métrica ≠ sanción).
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Multi-seed sin sancionar por métrica
- **Proposed preamble:**  
  - **Contexto:** un silhouette sintético alto no autoriza bloquear un segmento de la cola Red Andina. Aquí consolidas argmax multi-seed **y** la bandera ética.  
  - **Meta:** elegir k por argmax en cada seed; reportar `stable` y `sanction_from_metric False`.  
  - **Éxito:** `k 3`, `stable True`, `sanction_from_metric False` con los mapas del fixture.  
  - **Límites:** no uses min; no pongas `sanction_from_metric True`; métrica interna ≠ verdad de negocio.
- **Proposed instruction/description improvements:**  
  1. Corrige `min` → `max` en seed_a.  
  2. Deja seed_b en max.  
  3. Imprime k, stable y la bandera ética.  
  4. No calcues ARI (fuera de alcance del lab).
- **Proposed retrospective:**  
  Estabilidad de k + rechazo de sanción por métrica son el mismo gate: la señal sirve para priorizar revisión, no para castigar. Luego (E3): el bool `stable` se compara bien (`==`, no `!=`).
- **Code/output changes:** none (opcional Fixer: si se quiere fade más fuerte, variar el defect de E2 — p. ej. seeds que divergen y forzar reportar `stable False` — sin cambiar el contrato actual sin justificación)
- **Validation notes:** Output canónico alineado a theory; solape con E1 documentado arriba.

---

### S36-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer ligero: `stable = k_a != k_b` invertido. Superficie pequeña pero el misconception “invertir la comparación” es real. Falta preamble de “acuerdo de k antes de fijar k en el notebook” y self-check.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Acuerdo de k entre seeds
- **Proposed preamble:**  
  - **Contexto:** antes de fijar k en el notebook de señales, verificas si dos seeds coinciden en el entero k.  
  - **Meta:** `stable = (best_k(a) == best_k(b))` e imprimir k acordado.  
  - **Éxito:** `stable True`, `k 3`, `ok True` con seed_a/seed_b del fixture.  
  - **Límites:** no inviertas la comparación; no digas que las particiones son idénticas.
- **Proposed instruction/description improvements:**  
  1. Lee el starter: `stable = k_a != k_b` (bug).  
  2. Cámbialo a `k_a == k_b`.  
  3. Conserva prints de stable, k y ok.  
  4. Los argmax ya están correctos.
- **Proposed retrospective:**  
  Stable de k es un acuerdo de hiperparámetro, no ARI. El error clásico es negar la igualdad o confundir k con etiquetas. Pregunta: si seeds divergen, ¿qué reportas al negocio? (sensibilidad a seed, no un k “óptimo” fingido.)
- **Code/output changes:** none
- **Validation notes:** Transfer mínimo pero legítimo; reforzar en prose la diferencia con ARI.

---

### S36-T2-A-DEMO (iDo)
- **Diagnosis:** Demo clara de scale por eje y proyección ponderada exploratoria. Description OK; falta preamble “lupa no juez” y retrospective anti-autovectores inventados.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  PCA en este lab es una **lupa** para explorar el espacio de features sintéticas, no el modelo de decisión del triage. En la demo escalas un par (x,y) y proyectas con pesos fijos `w0,w1` documentados a mano — no son autovectores de sklearn. Observa `project_pc`, `scaled True` y `exploratory True`. Si proyectas sin scale o clasificas culpa en el eje, rompes el contrato exploratorio.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: scale por coordenada evita que un eje en soles aplaste a otro; la proyección lineal es didáctica; `decision_model` permanece False. Puente a We Do: pesos, batch de pc y weight_share sin auto-reject.
- **Proposed retrospective:**  
  Pesos fijos ≠ PCA de producción; scale antes de proyectar. El error clásico es narrar “eje de riesgo moral”. We Do: pc, lista de proyecciones y masa del componente.
- **Code/output changes:** none
- **Validation notes:** Output `2.0` / `scaled True` / `exploratory True` alineado a T2-A.

---

### S36-T2-A-E1 (weDo, guided)
- **Diagnosis:** Starter suma sin pesos — defect guiado claro. Instruction densa; sin escena exploratoria ni límites `decision_model False`.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Proyección ponderada exploratoria
- **Proposed preamble:**  
  - **Contexto:** en CASO-LIM-036-2A comprimes un punto sintético a un eje con pesos documentados solo para explorar.  
  - **Meta:** `pc = w0*x + w1*y` con `decision_model False`.  
  - **Éxito:** con `(4,6)` y pesos `0.5,0.5` imprimes `5.0`, `exploratory True`, `decision_model False`.  
  - **Límites:** no ignores los pesos; no uses el pc como auto-rechazo.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `pc = x + y` (bug).  
  2. Multiplica cada coordenada por su peso.  
  3. Conserva los tres prints.  
  4. No normalices pesos salvo que el enunciado lo pida (aquí no).
- **Proposed retrospective:**  
  La proyección ponderada es un producto punto didáctico. Omitir pesos es un bug de fórmula, no “otra PCA”. Siguiente (E2): misma idea en batch de puntos.
- **Code/output changes:** none
- **Validation notes:** Output `5.0` correcto.

---

### S36-T2-A-E2 (weDo, independent)
- **Diagnosis:** Pesos invertidos en list comprehension — buen independiente. Falta preamble de “mismo w en todo el batch” y retrospective de no reordenar cargas.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Batch de proyecciones con el mismo w
- **Proposed preamble:**  
  - **Contexto:** el scatter exploratorio del lab proyecta **varios** puntos con el mismo vector de pesos documentado.  
  - **Meta:** aplicar `w[0]*x + w[1]*y` a cada par sin invertir w.  
  - **Éxito:** `pc [1, 3]`, `n 2`, `decision_model False` con `pts=[(1,1),(3,1)]` y `w=(1,0)`.  
  - **Límites:** no inviertas los pesos; no mutes la lista de puntos.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: usa `w[1]*x + w[0]*y` (bug).  
  2. Corrige el orden de pesos.  
  3. Imprime pc, n y decision_model.  
  4. No hardcodees `[1,3]`.
- **Proposed retrospective:**  
  Invertir w rota el significado del eje y engaña la exploración. El batch debe reutilizar el mismo contrato que un punto. Luego (E3): weight_share del primer eje sin auto_reject.
- **Code/output changes:** none
- **Validation notes:** Fade independiente correcto respecto a E1.

---

### S36-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer a `weight_share_pc1` (masa del componente, no varianza de autovalores). Starter invierte fracción — anti-patrón bueno. Falta anclar “proxy de masa ≠ explained variance”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Masa del componente sin auto-rechazo
- **Proposed preamble:**  
  - **Contexto:** en el toy PCA de Red Andina reportas cuánto “pesa” el primer eje como `|w0|/(|w0|+|w1|)`, no como varianza real de autovalores.  
  - **Meta:** calcular weight_share_pc1 y mantener `auto_reject False`.  
  - **Éxito:** `use exploratory`, `weight_share_pc1 0.8`, `auto_reject False` con `w=(0.8,0.2)`.  
  - **Límites:** no uses `|w1|` en el numerador; no presentes pesos fijos como autovectores; no auto-rechaces.
- **Proposed instruction/description improvements:**  
  1. Lee el starter: `share = abs(w1)/mass` (bug).  
  2. Usa `abs(w0)/mass`.  
  3. Conserva use, share y auto_reject.  
  4. Maneja mentalmente mass=0 (fuera del fixture).
- **Proposed retrospective:**  
  weight_share es un proxy de masa del componente documentado, no la varianza explicada de sklearn. El error clásico es invertir ejes o convertir el scatter en juez. Pregunta: ¿por qué `auto_reject` debe ser False aunque share sea alto?
- **Code/output changes:** none
- **Validation notes:** Transfer conceptual sólido; alineado a theory T2-A.

---

### S36-T2-B-DEMO (iDo)
- **Diagnosis:** Demo de far-from-mean + guard de nombre de eje; ética `guilt False` / `review_queue`. Falta preamble de “outlier visual no es villano” y retrospective anti-lectura mágica de PC2.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Un punto lejos en el eje PC puede ser escala mala, error de datos o un segmento legítimo raro — no un villano. En esta demo calculas `far` respecto a la media de `pc`, eliges `review_queue` (nunca auto_block) y verificas que el nombre del eje no contenga tokens de culpa. Observa `far True`, `axis_named_by_business False` y `guilt False` antes de tocar teclado.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: distancia en el eje encola revisión; el guard de nombre corta narrativa mágica; fail-closed = duda → humano. Puente a We Do: tokens prohibidos, higiene pre-review y far sin autoculpa.
- **Proposed retrospective:**  
  Far en PC → cola, no culpa. El error clásico es bautizar el eje como “fraude”. We Do: guards de nombre, ready de features y action ética.
- **Code/output changes:** none
- **Validation notes:** Output alineado a T2-B.

---

### S36-T2-B-E1 (weDo, guided)
- **Diagnosis:** Starter fuerza `named = True` sin chequear — defect guiado ideal. Instruction densa; falta escena “no inventes PC2=fraude”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Guard de tokens en el nombre del eje
- **Proposed preamble:**  
  - **Contexto:** en el dossier de señales, un eje llamado con “fraude” o “culpa” empuja a lectura mágica del scatter.  
  - **Meta:** detectar tokens prohibidos en `axis_name` (casefold).  
  - **Éxito:** con `PC1_feature_mix` imprimes `axis_named_by_business False`, `use exploratory`, `auto_label False`.  
  - **Límites:** no marques True sin chequear; `auto_label` siempre False en este lab.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `named = True` (bug).  
  2. Calcula `any(tok in axis_name.lower() for tok in ("fraude","culpa"))`.  
  3. Conserva los tres prints.  
  4. No cambies el nombre del fixture para “pasar”.
- **Proposed retrospective:**  
  El guard de nombre es higiene narrativa, no un modelo. Forzar True inventa una historia de negocio falsa. Siguiente (E2): ready a partir de missingness y dispersión.
- **Code/output changes:** none
- **Validation notes:** DEFECT y solution correctos.

---

### S36-T2-B-E2 (weDo, independent)
- **Diagnosis:** `scale_ok` forzado a False pese a features dispersas — buen independiente de higiene pre-review. Falta preamble de “antes del scatter, datos listos” y retrospective de no inventar bools.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Ready por missing y dispersión
- **Proposed preamble:**  
  - **Contexto:** antes de encolar un scatter del lab, verificas que no hay `None` y que hay dispersión para estandarizar.  
  - **Meta:** `missing_ok` y `scale_ok = pstdev(features) > 0`; `ready` es la conjunción.  
  - **Éxito:** con `[2.0,4.0,6.0]` imprimes `ready True`, `scale_ok True`, `missing_ok True`.  
  - **Límites:** no hardcodees `scale_ok False`; deriva de los datos.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: `scale_ok = False` (bug).  
  2. Usa `statistics.pstdev(features) > 0`.  
  3. `ready = scale_ok and missing_ok`.  
  4. Conserva los tres prints.
- **Proposed retrospective:**  
  Ready se **deriva** de los datos; un bool inventado miente al revisor. Luego (E3): far en PC encola revisión sin guilt.
- **Code/output changes:** none
- **Validation notes:** Higiene pre-review alineada a interpretación prudente T2-B.

---

### S36-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer ético fuerte: `guilt True` + `auto_block` → `guilt False` + `review_queue`. Superficie perfecta para fail-closed. Falta preamble de “distancia ≠ conducta” y self-check.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Far en PC encola, no culpa
- **Proposed preamble:**  
  - **Contexto:** un punto lejano en pc del CASO-LIM-036-2B es candidato a **revisión humana**, nunca a auto-bloqueo moral.  
  - **Meta:** `far = max(pc)-mean(pc) > 3`; action `review_queue` si far; `guilt` siempre False.  
  - **Éxito:** `guilt False`, `action review_queue`, `far True` con `pc=[1.2,1.8,8.2]`.  
  - **Límites:** no imprimas `auto_block` ni `guilt True`; no uses PII real.
- **Proposed instruction/description improvements:**  
  1. Deja el cálculo de `far` (ya correcto).  
  2. Cambia `guilt` a False.  
  3. Action: `review_queue` si far, si no `pass`.  
  4. Conserva el print de far.
- **Proposed retrospective:**  
  Geometría en PC prioriza la cola; no prueba conducta. El error clásico es auto_block por scatter. Pregunta: ¿qué harías si far es True pero las features originales son legítimas? (HITL y evidencia original.)
- **Code/output changes:** none
- **Validation notes:** Transfer ético alineado a callout “Lectura mágica”.

---

### S36-T3-A-DEMO (iDo)
- **Diagnosis:** Demo de flags σ con ref + path length toy (idea IF). Description OK; falta preamble “path corto = fácil de aislar, no culpa” y retrospective de ref explícito (no `xs[:-1]` mágico).
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Isolation Forest y LOF en producción generan scores de rareza; aquí ves el **contrato** con regla σ (`ref` explícito) y un path length toy: el 50 se aísla en menos cortes que un 10 típico. Observa `flags`, `path_rare` y `misconduct False`. No escribas: predice por qué el path del raro es más corto y por qué eso **no** autoriza un despido.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: μ/σ solo sobre ref; path corto ⇒ rareza geométrica; misconduct False es política. Puente a We Do: z=3, lados del corte y ruta human_review.
- **Proposed retrospective:**  
  σ + path son señales legibles para el humano. El error clásico es estimar normalidad contaminando el fit con el outlier o moralizar el path. We Do: regla, path y enrutamiento.
- **Code/output changes:** none
- **Validation notes:** Output `flags [0,0,1]` / `path_rare 1` / `misconduct False` alineado a T3-A.

---

### S36-T3-A-E1 (weDo, guided)
- **Diagnosis:** Starter con `z=0` marca todo o casi todo — defect guiado excelente. Instruction densa; falta escena “ref de normales del pasado”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Flags σ con z=3 y ref explícito
- **Proposed preamble:**  
  - **Contexto:** en CASO-LIM-036-3A marcas rareza respecto a una referencia limpia, no asumiendo que “el último índice es el malo”.  
  - **Meta:** flag si `x > mu + 3*sd` con μ/σ solo sobre `ref`.  
  - **Éxito:** `flags [0,0,0,1]`, `method rule_sigma`, `misconduct False` con `xs=[1,1,1,10]`, `ref=xs[:3]`.  
  - **Límites:** no dejes z=0; no uses future en el fit (aquí ref es el pasado sintético).
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `z = 0` (bug).  
  2. Cámbialo a `3`.  
  3. Conserva mu/sd sobre ref y los prints.  
  4. No hardcodees la lista de flags.
- **Proposed retrospective:**  
  z=3 es el umbral didáctico de rareza; z=0 rompe la regla. El error clásico es contaminar ref con el outlier. Siguiente (E2): path length toy con lados correctos.
- **Code/output changes:** none
- **Validation notes:** DEFECT y solution correctos.

---

### S36-T3-A-E2 (weDo, independent)
- **Diagnosis:** Lados invertidos en el corte del path toy — independiente fuerte y alineado a la idea IF. Falta preamble de “aislar ≠ culpar” y retrospective de path corto.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Path length toy (idea Isolation Forest)
- **Proposed preamble:**  
  - **Contexto:** el toy IF del lab cuenta cuántos cortes bastan para aislar un punto; path corto sugiere rareza geométrica en la cola sintética.  
  - **Meta:** tras cada umbral t, `active = left if x < t else right`; profundidad al aislar.  
  - **Éxito:** `path_rare 1`, `path_normal 3`, `misconduct False` con pool y cuts del fixture.  
  - **Límites:** no inviertas left/right; no imprimas culpa.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: `active = left if x >= t else right` (bug).  
  2. Usa `x < t` para left.  
  3. Imprime path_rare, path_normal y misconduct.  
  4. No cambies los cuts fijos del lab.
- **Proposed retrospective:**  
  Path corto = más fácil de aislar, no prueba moral. Invertir lados miente el ranking de rareza. Luego (E3): flags σ + ruta human_review sin auto_sanction.
- **Code/output changes:** none
- **Validation notes:** Excelente fade de contenido respecto a E1 (nueva superficie: path).

---

### S36-T3-A-E3 (weDo, transfer)
- **Diagnosis:** Combina z=3 (como E1) con política de ruta; starter usa `auto_fire` y `auto_sanction True` — transfer ético claro. Solape parcial con E1 en el bug de z; la novelty pedagógica es el enrutamiento.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Flag σ encola human_review
- **Proposed preamble:**  
  - **Contexto:** un flag de rareza en Red Andina debe **encolar revisión**, nunca disparar sanción automática.  
  - **Meta:** calcular flags con z=3 sobre ref; `route = human_review` si hay flags; `auto_sanction False`.  
  - **Éxito:** `flags [0,0,0,1]`, `route human_review`, `auto_sanction False` con `xs=[10,11,10,50]`.  
  - **Límites:** no uses z=0 ni `auto_fire`; no moralices el flag.
- **Proposed instruction/description improvements:**  
  1. Corrige z a 3.  
  2. Route: `human_review` si `any(flags)` else `pass`.  
  3. `auto_sanction` False.  
  4. Conserva print de flags.
- **Proposed retrospective:**  
  Señal → ruta humana. El error clásico es auto_fire por rareza. Pregunta: si no hay revisor disponible, ¿qué hace fail-closed? (no emitir sanción automática.)
- **Code/output changes:** none
- **Validation notes:** Transfer de política; diferenciar preamble de E1 (aquí la meta es la ruta, no solo z).

---

### S36-T3-B-DEMO (iDo)
- **Diagnosis:** Demo expected_flags vs capacity con overflow. Description OK; falta preamble contamination≠fraude y retrospective de recalibrar cola.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  **contamination** es una hipótesis de fracción a marcar para controlar la cola, no la tasa de fraude del negocio. En la demo, n=100 y contamination=0.05 esperan 5 flags; con capacity=3 hay overflow y la acción es bajar contamination. Observa `is_fraud_rate False` y el print de action. Si lees “5% de fraude”, el lab falló en comunicación de riesgo.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: `int(n*contamination)` estima carga; overflow fuerza recalibración; nunca is_fraud_rate. Puente a We Do: producto, overflow y novelty vs ref.
- **Proposed retrospective:**  
  Contamination calibra rareza y carga, no ilícitos. El error clásico es vender el parámetro como prevalencia. We Do: expected_flags, overflow y kind novelty.
- **Code/output changes:** none
- **Validation notes:** Output alineado a T3-B.

---

### S36-T3-B-E1 (weDo, guided)
- **Diagnosis:** Starter usa `n + contamination` — defect aritmético guiado. Instruction telegráfica; falta escena de capacidad de cola.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** expected_flags por contamination
- **Proposed preamble:**  
  - **Contexto:** en CASO-LIM-036-3B estimas cuántos flags generará el batch sintético para no saturar revisores.  
  - **Meta:** `expected_flags = int(n * contamination)`.  
  - **Éxito:** con n=200 y contamination=0.1 imprimes `20`, `is_fraud_rate False`, `use capacity_tuning`.  
  - **Límites:** multiplica, no sumes; no digas que 0.1 es fraude.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `int(n + contamination)` (bug).  
  2. Cambia a `int(n * contamination)`.  
  3. Conserva los tres prints.  
  4. No redondees distinto de `int`.
- **Proposed retrospective:**  
  El producto n×contamination es control de cola. Sumar es un bug trivial con impacto de negocio. Siguiente (E2): overflow vs capacity.
- **Code/output changes:** none
- **Validation notes:** DEFECT claro.

---

### S36-T3-B-E2 (weDo, independent)
- **Diagnosis:** Comparación invertida `expected < capacity` — independiente limpio. Falta preamble de “bajar contamination o priorizar” y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Overflow de cola vs capacity
- **Proposed preamble:**  
  - **Contexto:** si esperas 10 flags y solo hay 8 slots de revisor, la cola de Red Andina se desborda.  
  - **Meta:** `overflow = expected > capacity` y action de bajar contamination.  
  - **Éxito:** `overflow True`, `action lower_contamination`, `ok True` con capacity=8, expected=10.  
  - **Límites:** no inviertas la desigualdad; no “descubras más fraude” al overflow.
- **Proposed instruction/description improvements:**  
  1. Revisa: `overflow = expected < capacity` (bug).  
  2. Usa `>`.  
  3. Conserva action y ok.  
  4. No cambies capacity del fixture.
- **Proposed retrospective:**  
  Overflow es un problema de **capacidad**, no de “más delincuentes”. Invertir la comparación oculta el desborde. Luego (E3): novelty calculada vs ref.
- **Code/output changes:** none
- **Validation notes:** Fade independiente correcto.

---

### S36-T3-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a novelty vs ref con z>3; starter imprime `outlier_as_guilt` y misconduct True — excelente anti-patrón ético. Falta preamble novelty vs outlier y self-check.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Novelty frente a ref, sin culpa
- **Proposed preamble:**  
  - **Contexto:** un valor nuevo se compara con un modelo de normalidad **ya fijado** (ref); rareza alta ⇒ kind novelty, no culpa.  
  - **Meta:** z = |x_new−μ|/σ sobre ref; `kind = novelty` si z>3; `misconduct False`.  
  - **Éxito:** `kind novelty`, `misconduct False`, `ok True` con ref=[10,11,10,12], x_new=50.  
  - **Límites:** no hardcodees culpa; calcula z; no uses PII real.
- **Proposed instruction/description improvements:**  
  1. Calcula mu, sd y z sobre ref.  
  2. Asigna kind novelty o in_distribution.  
  3. misconduct False siempre.  
  4. Imprime kind, misconduct, ok.
- **Proposed retrospective:**  
  Novelty es rareza frente a normalidad fijada; no es veredicto. El error clásico es `outlier_as_guilt`. Pregunta: ¿en qué se diferencia novelty de “outlier en el mismo batch de train”? (modelo ya fijado vs. rareza en el conjunto de ajuste.)
- **Code/output changes:** none
- **Validation notes:** Transfer conceptual alineado a theory T3-B.

---

### S36-T4-A-DEMO (iDo)
- **Diagnosis:** Demo fit μ/σ en train, score en future, mean_flag_rate y leakage False. Description OK; falta preamble anti-leakage y retrospective “el reloj manda”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Un backtest temporal honesto **ajusta normalidad solo en el pasado** y marca el futuro. En la demo, train=[10,11,10,12] y future con un 50 producen flags `[0,0,1]`; las ventanas de flag_rate promedian ≈0.103; el mes de test no está en train (`leakage False`). No escribas: predice qué pasa si metes el 50 en el fit (el umbral se ensancha y el experimento miente).
- **Proposed instruction/description improvements:**  
  Ampliar `why`: fit-past/score-future; media de tasas; chequeo de mes duplicado. Puente a We Do: quitar leakage de magnitud, arreglar train_months y detectar spikes.
- **Proposed retrospective:**  
  El reloj del caso manda el split. El error clásico es barajar filas o meter el mes evaluado al fit. We Do: flags, leakage de meses y spike de tasas.
- **Code/output changes:** none
- **Validation notes:** Output alineado a T4-A.

---

### S36-T4-A-E1 (weDo, guided)
- **Diagnosis:** Starter hace fit sobre `train+future` — defect de leakage de magnitud excelente para guided. Instruction densa; falta escena “el 50 no puede entrar al μ del pasado”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Fit solo en el pasado
- **Proposed preamble:**  
  - **Contexto:** en CASO-LIM-036-4A validas la señal σ con backtest: la normalidad se aprende en train y se aplica a future.  
  - **Meta:** μ/σ solo con train; flags en future con z=3; `backtest True`, `leakage False`.  
  - **Éxito:** `flags [0,0,1]` con train/future del fixture.  
  - **Límites:** no concatenes future al fit; no barajes el tiempo.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `pool = train + future` (bug).  
  2. Calcula mu/sd solo con train.  
  3. Score future con umbral 3σ.  
  4. Conserva prints de flags, backtest y leakage.
- **Proposed retrospective:**  
  Meter el futuro en el fit ensancha σ y esconde el outlier: leakage de magnitud. El hábito es split temporal estricto. Siguiente (E2): predicado de meses train/test.
- **Code/output changes:** none
- **Validation notes:** DEFECT pedagógico de primer nivel; solution correcta.

---

### S36-T4-A-E2 (weDo, independent)
- **Diagnosis:** train_months incluye el mes de test — independiente limpio de anti-leakage. Falta preamble de “test ∉ train” y retrospective de split honesto.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Mes de test fuera del train
- **Proposed preamble:**  
  - **Contexto:** el chequeo de leakage del lab es simple y duro: el mes evaluado no puede aparecer en train.  
  - **Meta:** `has_leakage = test_month in train_months` con train limpio.  
  - **Éxito:** `leakage False`, `order temporal`, `ok True` con train `['2026-01']` y test `2026-02`.  
  - **Límites:** no dejes el test dentro de train; no mientas el bool a mano.
- **Proposed instruction/description improvements:**  
  1. Revisa: train incluye `"2026-02"` (bug).  
  2. Quita el mes de test del train.  
  3. Deja la función has_leakage.  
  4. Conserva los tres prints.
- **Proposed retrospective:**  
  Leakage de mes es el anti-patrón más barato de detectar y el más caro de ignorar. Luego (E3): spike de flag_rate entre ventanas.
- **Code/output changes:** none
- **Validation notes:** Independiente bien acotado.

---

### S36-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer a detección de spike en tasas de flags (max−min ≥ 0.3). Starter umbral 0.9 — anti-patrón de “no ver drift”. Falta preamble “investigar antes de ampliar cola”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Spike de flag_rate entre ventanas
- **Proposed preamble:**  
  - **Contexto:** si la tasa de flags salta de 0.1 a 0.5 entre ventanas sintéticas, no amplíes la cola a ciegas: investigas drift o bug de scale.  
  - **Meta:** `spike` si `max(rates)-min(rates) >= 0.3`; action `investigate`.  
  - **Éxito:** `spike True`, `action investigate`, `ok True` con rates=[0.1,0.5].  
  - **Límites:** no dejes umbral 0.9; no ignores el spike.
- **Proposed instruction/description improvements:**  
  1. Corrige el umbral a 0.3.  
  2. Conserva action investigate y ok.  
  3. No hardcodees spike True sin fórmula.  
  4. Piensa en rates constantes (spike False).
- **Proposed retrospective:**  
  Estabilidad de la tasa de flags es parte del backtest. Umbral demasiado alto es ceguera operativa. Pregunta: ¿qué miras primero ante un spike? (scale, leakage, cambio de población.)
- **Code/output changes:** none
- **Validation notes:** Transfer real a monitoreo de ventanas; alineado a theory T4-A.

---

### S36-T4-B-DEMO (iDo)
- **Diagnosis:** Demo mínima de P@k + HITL. Description OK; why de una frase; falta preamble “utilidad de cola con labels escasos” y retrospective anti-ROC fantasma.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Con pocas etiquetas de utilidad, **precision@k** y el humano importan más que un ROC inventado. En la demo, ranking `[1,0]` con k=2 da P@k=0.5; `human True` y `auto_guilt False` son política del triage. Observa que 1 significa “el revisor dijo que sirvió”, no “culpable”. No escribas: predice el cociente y por qué no optimizas accuracy global aquí.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: P@k = utilidad en el top de la cola; HITL obligatorio; auto_guilt False. Puente a We Do: k correcto, HITL por escasez y elegir métrica.
- **Proposed retrospective:**  
  P@k + humano miden si la señal ahorra tiempo. El error clásico es accuracy global con labels ralos o apagar HITL “para ir más rápido”. We Do: k, human_in_loop y choose_metric.
- **Code/output changes:** none
- **Validation notes:** Output `0.5` / human / auto_guilt alineado a T4-B.

---

### S36-T4-B-E1 (weDo, guided)
- **Diagnosis:** Starter usa k=4 en lugar de k=2 — defect guiado simple pero claro. Instruction densa; falta escena de ranking de utilidad.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Precision@k con k del contrato
- **Proposed preamble:**  
  - **Contexto:** en CASO-LIM-036-4B mides qué fracción del top-k del ranking de utilidad ayudó al revisor.  
  - **Meta:** `P@k = sum(ranked[:k]) / k` con el k del contrato (2).  
  - **Éxito:** imprime `0.5`, `k 2`, `auto_guilt False` con ranked=[1,0,1,0].  
  - **Límites:** no uses k=4; no traduzcas 1 a “culpable”.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `k = 4` (bug).  
  2. Cámbialo a `2`.  
  3. Conserva la fórmula y los prints.  
  4. No reordenes el ranking.
- **Proposed retrospective:**  
  k es parte del contrato de evaluación de cola. Cambiar k a escondidas miente el P@k. Siguiente (E2): HITL cuando labels son escasos frente a flags.
- **Code/output changes:** none
- **Validation notes:** Guided simple; alineado a demo.

---

### S36-T4-B-E2 (weDo, independent)
- **Diagnosis:** HITL forzado a False — excelente independiente de política. Falta preamble de escasez y retrospective de gate responsable.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** HITL cuando labels son escasos
- **Proposed preamble:**  
  - **Contexto:** con 5 etiquetas y 40 flags, el régimen es scarce: no puedes apagar al humano “para ir más rápido”.  
  - **Meta:** `human_in_loop = n_labels < n_flags` (y etiquetar scarce).  
  - **Éxito:** imprime `True`, `ok True`, `labels scarce`.  
  - **Límites:** no hardcodees False; no automatizes sanción.
- **Proposed instruction/description improvements:**  
  1. Revisa: `human_in_loop = False` (bug).  
  2. Derívalo de `n_labels < n_flags`.  
  3. Conserva labels scarce/dense.  
  4. Imprime en el orden del contrato.
- **Proposed retrospective:**  
  HITL se **deriva** de la escasez, no se apaga a gusto. El error clásico es False fijo. Luego (E3): elegir precision_at_k cuando la prevalencia de labels es baja.
- **Code/output changes:** none
- **Validation notes:** Independiente de política fuerte.

---

### S36-T4-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a choose_metric por umbral de escasez; starter siempre `global_accuracy` — anti-patrón de métrica engañosa. Falta preamble “ROC fantasma” y self-check.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Elegir P@k con labels ralos
- **Proposed preamble:**  
  - **Contexto:** con 3 labels en 100 casos sintéticos, la accuracy global engaña; el lab exige `precision_at_k`.  
  - **Meta:** si `n_labels/n_total < 0.1` → `precision_at_k`; si no, `global_accuracy`.  
  - **Éxito:** imprime `precision_at_k`, `ok True`, `n 1`.  
  - **Límites:** no devuelvas siempre global_accuracy; no inventes ROC con labels ralos.
- **Proposed instruction/description improvements:**  
  1. Abre choose_metric: return fijo (bug).  
  2. Implementa el umbral 0.1 (y guard n_total<=0).  
  3. Conserva los prints del contrato.  
  4. No hardcodees el string sin condición.
- **Proposed retrospective:**  
  La métrica se elige por régimen de labels, no por moda del dashboard. El error clásico es accuracy global con datos ralos. Pregunta: ¿qué defiendes en 30 segundos ante un gerente que pide “accuracy 99%”? (P@k + HITL + utilidad de cola.)
- **Code/output changes:** none
- **Validation notes:** Transfer de diseño de evaluación; cierre natural del hilo T4-B.

---

### youDo (S36 project)
- **Diagnosis:** Marco de proyecto **sólido**: context, objectives, requirements, rubric con gate ético, portfolioNote y starter casi-pipeline completo (scale → assign/update/density → PCA toy → σ/path → backtest → P@k). Falta **solo** `retrospective` de defensa metacognitiva post-build. El starter es generoso (casi solución ejecutable); el Fixer no debe vaciarlo, pero la retrospective debe empujar a justificar invariantes y límites.
- **Checklist:** context pass · goal pass · success pass (rubric) · constraints pass · retrospective **fail**
- **Severity:** P1
- **Proposed title:** (ya existe) Señales auxiliares de rareza con backtest (CP-N3-C señales)
- **Proposed preamble:** N/A — `context` ya cumple rol de escena; opcional: una línea en context que diga “antes de marcar listo, podrás defender tres invariantes en 30 s” (no obligatorio).
- **Proposed instruction/description improvements:**  
  Mantener objectives/requirements/rubric. Opcional Fixer: en portfolioNote, pedir una frase de impacto medible (p. ej. “P@k en top-k de la cola sintética + HITL obligatorio”) alineada a S30/S33 gold.
- **Proposed retrospective:**  
  Antes de marcar listo: (1) ¿qué invariante demuestras — scale antes de distancias, fit solo en pasado, o `auto_guilt False` en cada flag? (2) ¿qué harías distinto con datos reales vs. sintéticos (PII, capacidad real de revisor)? (3) En el README, una frase de impacto medible que puedas defender en 30 segundos: utilidad de cola (P@k + HITL), no “detectamos fraude”. El error clásico es un notebook bonito que publica rareza como culpa.
- **Code/output changes:** none (starter coherente con demos; no exigir cambios de output)
- **Validation notes:** Rubric gate “Anomalía no es veredicto de conducta” es excelente; retrospective debe reforzar defensa oral/portfolio.

---

## Priority order

### P0 (We Do: title + preamble + instruction task-only + retrospective; feedback +~1 frase de porqué)
1. **S36-T1-A-E1** — media vs suma + guard vacío  
2. **S36-T1-A-E2** — z-score seguro (alinear print de safe_sd)  
3. **S36-T1-A-E3** — assign–update + density + verdict  
4. **S36-T1-B-E1** — argmax multi-seed  
5. **S36-T1-B-E2** — multi-seed + sanction_from_metric (diferenciar prosa de E1)  
6. **S36-T1-B-E3** — stable ==  
7. **S36-T2-A-E1** — proyección ponderada  
8. **S36-T2-A-E2** — batch pc  
9. **S36-T2-A-E3** — weight_share + auto_reject  
10. **S36-T2-B-E1** — guard de nombre  
11. **S36-T2-B-E2** — ready missing/scale  
12. **S36-T2-B-E3** — far → review_queue  
13. **S36-T3-A-E1** — σ z=3  
14. **S36-T3-A-E2** — path length toy  
15. **S36-T3-A-E3** — route human_review  
16. **S36-T3-B-E1** — expected_flags  
17. **S36-T3-B-E2** — overflow  
18. **S36-T3-B-E3** — novelty  
19. **S36-T4-A-E1** — fit-past (anti-leakage magnitud)  
20. **S36-T4-A-E2** — mes test ∉ train  
21. **S36-T4-A-E3** — spike flag_rate  
22. **S36-T4-B-E1** — P@k k=2  
23. **S36-T4-B-E2** — HITL por escasez  
24. **S36-T4-B-E3** — choose_metric  

### P1 (I Do preamble + retrospective + why ampliado; You Do retrospective)
- S36-T1-A-DEMO … S36-T4-B-DEMO (8 demos)  
- youDo retrospective  

### P2 (polish)
- Feedback de 1 frase → 25–60 palabras con ancla de cola HITL / gate ético / portfolio  
- Why de demos a 40–90 palabras  
- Documentar en prose el solape T1-B-E1/E2 y T3-A-E1/E3 (preambles no clonados)  
- Opcional: alinear starter T1-A-E2 al contrato de `safe_sd` de la solution  

---

## Residual risks

1. **Solape E1/E2 en T1-B:** mismo bug `min`→`max`; sin preambles distintos se sentirán clones. No cambiar outputs sin necesidad; sí diferenciar escena (elegir k vs. no sancionar).  
2. **Solape T3-A-E1/E3:** ambos tocan z=0; E3 debe venderse como **política de ruta**, no como re-drill de z.  
3. **You Do starter generoso:** casi pipeline completo; el riesgo pedagógico es “correr y listo” sin defensa. La retrospective + rubric gate mitigan; no vaciar el starter en R1 fix.  
4. **Carga cognitiva de 24 We Do:** alta para true newbie; preambles cortos en viñetas (spec 4 bullets) son preferibles a ensayos.  
5. **Ética ya fuerte en código:** el Fixer no debe diluir `misconduct False` / `auto_guilt False` / `verdict False` al reescribir instruction.  
6. **Outputs canónicos:** preservar exactamente salvo execute-and-diff justificado (p. ej. T1-A-E2 print de safe_sd si se alinea starter).  
7. **Id `ai-apis-advanced` vs. contenido:** residual de naming del archivo; no es bug de ejercicio, pero el Fixer no debe “volver” el section a APIs genéricas.

---

## Fixer handoff notes

- Implementar campos schema: I Do `preamble` + `retrospective` (+ ampliar `why`); We Do `title` + `preamble` + `instruction` solo-pasos + `retrospective` (+ enriquecer `feedback`); You Do `retrospective`.  
- Longitudes del spec; español PE profesional; sin PII real; CASO-LIM-036.  
- No generadores. Prosa de este reporte es **propuesta**, no pegar ciegamente si el Fixer mejora la voz — pero cada unidad debe recibir tratamiento manual.  
- No editar theory/selfCheck salvo que un print de ejercicio lo exija (no es el caso).  
- Validar build estático de la sección tras el fix.

---

Section 36 exercise pedagogy review complete. Ready for the Fixer prompt.
