# S36 Exercise Pedagogy Report (Round 2)

## Section
- **title:** Clustering, anomalías y validación temporal
- **shortTitle:** Clustering y anomalías
- **id:** `ai-apis-advanced` (archivo `s36-ai-apis-advanced.ts`; contenido = señales auxiliares no supervisadas para triage CP-N3-C, **no** “APIs de IA genéricas”)
- **index:** 36
- **source:** `src/lib/course/sections/s36-ai-apis-advanced.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades)
- **subtemas:** T1-A scale/assign–update/density · T1-B k multi-seed · T2-A PCA toy · T2-B interpretación prudente · T3-A σ + path length · T3-B contamination/novelty · T4-A backtest temporal · T4-B P@k + HITL
- **hilo:** workbench de riesgo operativo sintético **CASO-LIM-036** (Red Andina ficticia, Lima) — clustering, rareza y backtests alimentan cola de revisión; **anomalía ≠ conducta indebida**; fail-closed + HITL; puente S35 → S36 → S37 → S39 (CP-N3-C)
- **Round 1 context:** `round1/S36_EXERCISE_PEDAGOGY_REPORT.md` (solo contraste; **no** rubber-stamp)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (preamble/retrospective checklists, E1→E3 fade, length targets 80–150 preamble / 40–80 retro / 40–100 instruction / 40–90 why / 25–60 feedback, anti-aberration).
- Manually re-inspected **current** source for every `iDo.steps[]` (8), `weDo.steps[]` (24) y `youDo` (title, preamble, instruction, feedback, retrospective, starter `# DEFECT`, solution output, why).
- Integrity traps checked live:
  1. **T1-A-E2** starter imprime `safe_sd` con `sd` crudo; solution devuelve tupla `(z, safe_sd)` y desempaca — instruction ya pide el `safe_sd` **devuelto**; el starter aún no expone el contrato de prints de la solution (defect de *scale* sí es visible).
  2. **T1-B-E1 vs E2:** mismo bug `min`→`max`; preambles **diferenciados** (elegir k vs. no sancionar por métrica) — fade de código débil, prosa OK.
  3. **T3-A-E1 vs E3:** ambos corrigen `z=0`→`3`; E3 añade `route`/`auto_sanction` — preamble de E3 vende **política de ruta** (bien); instruction de E3 aún abre por el bug de z (re-drill parcial).
- Scored for a **true newbie** (qué / por qué / éxito / qué queda), independent of Round-1 proposals.
- Word counts measured only as gates (no bulk prose generation).
- No generators, bulk templates, or source edits.

## Global findings (post Round-1 fix)

| Area | Status | Residual impact |
|------|--------|-----------------|
| **Field coverage** | Complete: 8 iDo con `preamble`+`why`+`retrospective`; 24 weDo con `title`+`preamble`+`instruction`+`feedback`+`retrospective`; youDo con `retrospective` + marco sólido | Round-1 P0 “cero campos” **cerrado** |
| **We Do titles** | Presentes, 4–10 palabras, español PE, alineados al skill | Pass |
| **Preamble shape** | weDo en bullets contexto/meta/éxito/límites (≈35–61 w; spec permite “4 short bullets”); iDo narrativos con predicción (≈55–78 w) | Pass en estructura; weDo cortos pero legibles para newbie |
| **Instruction = steps** | Solo-tarea, ordenados; E1 nombra DEFECT; E2/E3 con menos migas en la mayoría | Pass; varios **paso 4** son verificación mental (P2) |
| **E1→E2→E3 fade** | Superficies distintas por subtema (media → z-score → assign+density; argmax → ética métrica → `stable==`; pc punto → batch → weight_share; nombre eje → ready → far/guilt; σ → path → route HITL; expected_flags → overflow → novelty; fit-past → mes ∉ train → spike; P@k → HITL scarce → choose_metric) | Pass — no tres clones; residual **código** en T1-B-E1/E2 y solape z en T3-A-E1/E3 |
| **Feedback vs retrospective** | Feedback razona bug + impacto a cola HITL/gate ético; en **~22/24** weDo el retro **repite** el feedback (mismo principio, poco self-check extra) | Residual **P2** sistemático |
| **Retrospective length** | weDo mediana ≈21–40 w (spec 40–80); iDo demos: T1-A en rango (~51); resto iDo ~23–31 w (bajo piso). Principio + puente suelen estar; a menudo falta self-check. Peor caso weDo: **T2-B-E2** (~21 w), **T3-B-E1** (~21 w) | Residual **P2** (pocos **P1** de metacognición fina) |
| **iDo why** | Todos en o cerca del rango 40–90 (≈36–70); T3-B-DEMO why ~36 (ligero bajo piso) | Pass / polish menor |
| **Código/outputs** | Coherentes con theory y CP-N3-C; DEFECT bien nombrados; outputs canónicos preservados | Residual **P2**: T1-A-E2 print contract starter≠solution; T1-B-E1/E2 mismo bug |
| **youDo frame** | context (con invariantes 30 s), objectives, requirements éticos, rubric con gate, portfolioNote, retrospective de defensa (~72 w) | Pass — fuerte; starter sigue generoso |
| **Hints E3** | Aún cerca de la fórmula en varios transfer (aceptable como andamiaje mínimo) | Residual **P2** opcional |
| **Ética en prints** | `verdict False` / `misconduct False` / `auto_guilt False` / `sanction_from_metric False` consistentes | Pass — no diluir en R2 fix |

**Net:** Round 1 cerró el vacío sistemático de prosa verbal (title/preamble/instruction/retrospective) y amplió `why`/feedback. Round 2 no es rubber-stamp: la sección está **lista para learner** en la gran mayoría de unidades; residuales son **calidad** (ecos feedback/retro, retros cortas, fade de código T1-B, contrato print T1-A-E2, re-drill z en T3-A-E3). No hay P0 de cobertura ni defectos que invaliden outputs canónicos.

## Scoring key
| Score | Meaning |
|-------|---------|
| **A** | Newbie responde qué / por qué / éxito / qué queda; sin fix residual obligatorio |
| **B** | Usable; residual menor (eco, longitud, polish) |
| **C** | Parcial; residual R2 debería arreglarse (claridad, metacognición fina, integridad) |
| **D** | Falla el test de true-newbie en un ítem crítico (éxito invisible, wrong≈right total) |

Checklist: **context · goal · success · constraints · retrospective** → pass / partial / fail.

---

## Unit ledger

### S36-T1-A-DEMO (iDo) — **A**
- **Diagnosis:** Worked example sólido de z-score + assign–update 1D + density con predicción pedida (`labels`, centroides, `core_density`). Preamble ancla “segmentar por geometría, no por culpa”. `why` (~70 w) en rango: scale, núcleo k-means, convención sklearn min_samples, puente a We Do. Retrospective repara “id de cluster = sanción” y cierra con hábito de señales auxiliares.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S36-T1-A-E1 (weDo, guided) — **A−**
- **Diagnosis:** Title claro; bullets con éxito `1.5` / `n 2` / `ok True`; instruction nombra `return sum(vals)`; feedback ancla por qué la suma rompe assign–update y el guard de vacío. Retro corta (~27 w) pero diferencia “media = centroide” y puente a E2; menos eco que el resto de la sección.
- **Checklist:** all pass; retro partial (longitud bajo piso)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Media = centroide 1D: resume el grupo para el siguiente assign, no para culpar. Vacío = `ValueError`, no un `0.0` inventado que mueve el centroide al origen. El error clásico del starter es tratar la suma como posición. Pregunta: si un cluster queda sin puntos tras assign, ¿qué debe devolver `update`? (conservar prev o error — no inventar cero.) Siguiente (E2): z-score con protección de `sd=0`.
- **Code/output changes:** none

### S36-T1-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Bug de z-score (resta sin dividir) excelente. Preamble “soles vs. conteos” ancla scale-first. Instruction **mejorada en R1**: pide `safe_sd` devuelto y no hardcodear `2.0`. Residual de integridad: el starter imprime `print("safe_sd", sd)` con el `sd` de entrada (pasa numéricamente con `sd=2`) sin forzar el unpack de la tupla; el learner que solo corrige el return y no desempaca rompe el contrato de prints de la solution.
- **Checklist:** all pass; starter/solution print contract partial
- **Severity residual:** P2 (integridad de prints)
- **Proposed residual (code, optional Fixer):**  
  Alinear starter al contrato de prints de la solution, p. ej.  
  `print(zscore(...))` → dos líneas rotas o comentario `# DEFECT: debe devolver (z, safe_sd) y desempacar` con  
  `z = zscore(...); print(z); print("safe_sd", sd)` y DEFECT explícito en el return + en el print.  
  **No** cambiar el output canónico `2.0 / safe_sd 2 / ok True`.
- **Proposed retrospective (expand, ~40 w):**  
  Scale-first es el hábito que salva distancias en la cola: soles y conteos dejan de competir por magnitud. “Restar y ya” o dividir por cero distorsiona el assign. Pregunta: si `sd=0` en un batch monótono, ¿por qué `safe_sd=1.0` y no un crash? Luego (E3): unes assign–update y density con `verdict False`.
- **Code/output changes:** optional starter print alignment only; **preserve** solution output

### S36-T1-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Transfer auténtico multi-defect (labels fijos, sin update, sin density, `verdict True`). Éxito exacto en preamble. Feedback y retro cercanos en “núcleo k-means/DBSCAN”, pero retro añade self-check de `min_samples` (convención sklearn) — metacognición usable. Fade real desde E1/E2.
- **Checklist:** all pass
- **Severity residual:** none (hints E3 casi dan la fórmula — P2 opcional)
- **Proposed residual:** none required
- **Code/output changes:** none

### S36-T1-B-DEMO (iDo) — **B**
- **Diagnosis:** Argmax multi-seed + `stable` como acuerdo de k (no ARI) — misconception clave bien nombrado en preamble. `why` en rango. Retrospective corta (~26 w) sin self-check; principio + puente a We Do presentes.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Acuerdo de k ≠ ARI ni particiones idénticas: solo dice que dos seeds eligieron el mismo entero. El error clásico es vender un k inestable o sancionar por silhouette. Pregunta: si seed A elige 3 y seed B elige 4, ¿qué reportas al negocio? (sensibilidad a seed, no un “óptimo” fingido.) We Do: argmax, `stable` y `sanction_from_metric False`.
- **Code/output changes:** none

### S36-T1-B-E1 (weDo, guided) — **B**
- **Diagnosis:** DEFECT `min` en seed_a perfecto para guided. Preamble de “dos seeds, no un solo run”. Feedback y retro **eco** (argmax + multi_seed + confusión con “menor error”).
- **Checklist:** all pass; retro partial (eco + ~35 w borderline)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  `max(..., key=scores.get)` elige el k con mejor score **reportado** en ese seed; `multi_seed` solo comprueba igualdad del entero k. Confundir con “menor error” y usar `min` manda la cola al peor k del mapa. Pregunta: ¿por qué seed_b ya en `max` no basta solo? (un seed es ruido de inicialización.) Siguiente (E2): misma idea + bandera `sanction_from_metric False`.
- **Code/output changes:** none

### S36-T1-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Casi el mismo bug que E1 (`min` en seed_a) con fixtures distintos y print `sanction_from_metric False`. **Prosa R1 diferenciada bien** (métrica ≠ sanción). Fade de **código** sigue débil: es re-drill de argmax con un print ético extra. Feedback/retro eco en “mismo gate: priorizar no castigar”.
- **Checklist:** all pass; fade código partial · retro partial (eco)
- **Severity residual:** P2 (no P1: el newbie sí entiende el goal ético distinto)
- **Proposed residual (prose only, preferred):**  
  Mantener bug `min`→`max` si no se quiere tocar outputs; reforzar en instruction que el **objetivo** es la bandera ética + stable, no redescubrir argmax.  
  **Proposed retrospective (replace):**  
  Un silhouette alto no autoriza bloquear un segmento: la métrica interna prioriza revisión. `sanction_from_metric False` es política del triage, no un print decorativo. El error clásico es copiar E1 y olvidar que aquí el gate es ético. Pregunta: si `stable False`, ¿sancionarías al cluster 0 “por si acaso”? (no.) Luego (E3): el bool `stable` se compara con `==`, no `!=`.
- **Code/output changes:** none required (opcional R2 Fixer: seeds que divergen y forzar `stable False` — solo si se reescribe solución/tests; **no** en silent bulk)

### S36-T1-B-E3 (weDo, transfer) — **A−**
- **Diagnosis:** Transfer ligero (`!=` → `==`) pero misconception real. Preamble aclara “no digas que las particiones son idénticas”. Feedback y retro se solapan en ARI vs acuerdo de k; retro **tiene** self-check de seeds que divergen — usable.
- **Checklist:** all pass
- **Severity residual:** P2 opcional (eco feedback/retro)
- **Proposed residual:** none required if Fixer only trims feedback redundancy
- **Code/output changes:** none

### S36-T2-A-DEMO (iDo) — **B+**
- **Diagnosis:** Scale + proyección con pesos fijos; preamble “lupa no juez”; `why` en rango. Retro corta (~29 w) sin self-check.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Pesos fijos ≠ PCA de producción (sklearn aprende autovectores); scale por eje evita que soles aplasten conteos. El error clásico es narrar “eje de riesgo moral” en el scatter. Pregunta: ¿por qué `exploratory True` debe convivir con `decision_model False`? We Do: pc, batch de proyecciones y weight_share sin auto-reject.
- **Code/output changes:** none

### S36-T2-A-E1 (weDo, guided) — **B**
- **Diagnosis:** Starter `pc = x + y` — defect guiado claro. Éxito `5.0` + banderas exploratorias. Feedback ≈ retro (“producto punto didáctico”).
- **Checklist:** all pass; retro partial (eco + ~26 w)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  La proyección ponderada es un producto punto con cargas **documentadas**, no “otra PCA mágica”. Omitir pesos es bug de fórmula: el eje ya no refleja el contrato del lab. Pregunta: con `w0=w1=0.5` y `(4,6)`, ¿por qué 5.0 y no 10? Siguiente (E2): el mismo w sobre un **batch** de puntos.
- **Code/output changes:** none

### S36-T2-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Pesos invertidos en list comprehension — independent limpio. Fade real respecto a E1. Eco feedback/retro en “invertir w rota el eje”.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Invertir `w` rota el significado del eje y engaña la exploración visual de la cola. El batch debe reutilizar el **mismo** vector documentado que un solo punto; no reordenar cargas “porque se ve mejor”. Pregunta: con `w=(1,0)`, ¿qué coordenada debe dominar `pc`? Luego (E3): weight_share del primer eje sin auto_reject.
- **Code/output changes:** none

### S36-T2-A-E3 (weDo, transfer) — **A−**
- **Diagnosis:** Transfer conceptual sólido: masa del componente ≠ explained variance; `auto_reject False`. Retro con self-check “¿por qué auto_reject False aunque share alto?”. Feedback y retro comparten la frase de weight_share — eco parcial tolerable.
- **Checklist:** all pass
- **Severity residual:** P2 opcional (eco)
- **Proposed residual:** none required
- **Code/output changes:** none

### S36-T2-B-DEMO (iDo) — **B+**
- **Diagnosis:** far-from-mean + guard de nombre; ética `review_queue` / `guilt False`. Preamble “no un villano” excelente. Retro corta (~27 w).
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Far en PC → cola de revisión, no culpa automática. El error clásico es bautizar el eje como “fraude” o disparar `auto_block`. Pregunta: si far es True pero las features originales son un segmento legítimo raro, ¿qué haces? (HITL + evidencia original.) We Do: guards de nombre, ready de features y action ética.
- **Code/output changes:** none

### S36-T2-B-E1 (weDo, guided) — **B**
- **Diagnosis:** `named = True` forzado — DEFECT guiado ideal. Eco feedback/retro en “higiene narrativa”.
- **Checklist:** all pass; retro partial (eco + ~27 w)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  El guard de nombre es higiene del dossier: corta lectura mágica del scatter, no es un modelo de riesgo. Forzar `True` inventa una historia de negocio falsa. Pregunta: ¿por qué `auto_label` debe ser False aunque el eje se llame “feature_mix”? Siguiente (E2): ready a partir de missingness y dispersión.
- **Code/output changes:** none

### S36-T2-B-E2 (weDo, independent) — **B−**
- **Diagnosis:** `scale_ok` forzado a False — independent limpio de higiene pre-review. Instruction muy corta (~16 w) pero suficiente. **Peor retro weDo** (~21 w) y eco con feedback (“Ready se deriva…”).
- **Checklist:** all pass; retro fail (longitud + eco)
- **Severity residual:** P2 (casi P1 por metacognición fina)
- **Proposed retrospective (replace):**  
  `ready` se **deriva** de missingness y dispersión (`pstdev > 0`); un bool inventado miente al revisor y libera o bloquea el scatter sin base en los datos. El error clásico del starter es hardcodear `scale_ok False` “por precaución”. Pregunta: con features constantes `[3,3,3]`, ¿`scale_ok` debería ser True? (no — no hay dispersión para estandarizar.) Luego (E3): far en PC encola revisión sin guilt.
- **Code/output changes:** none

### S36-T2-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** Transfer ético fuerte: `guilt True`/`auto_block` → `guilt False`/`review_queue`. Preamble y self-check en retro alineados al callout “Lectura mágica”. Fade auténtico desde E1/E2.
- **Checklist:** all pass
- **Severity residual:** none (hints E3 casi dan la política — OK transfer)
- **Proposed residual:** none required
- **Code/output changes:** none

### S36-T3-A-DEMO (iDo) — **A−**
- **Diagnosis:** flags σ con `ref` + path length toy; preamble pide predecir path corto y por qué **no** autoriza despido. `why` en rango. Retro ~31 w con puente; self-check implícito en “contaminar fit / moralizar path”.
- **Checklist:** all pass
- **Severity residual:** P2 opcional (expandir retro 1 self-check explícito)
- **Proposed residual:** none required
- **Code/output changes:** none

### S36-T3-A-E1 (weDo, guided) — **B**
- **Diagnosis:** `z=0` → satura flags — guided excelente. Preamble “no asumas que el último índice es el malo”. Eco feedback/retro en z=3 vs contaminar ref.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  z=3 es el umbral didáctico de rareza respecto a `ref` limpia; z=0 marca casi todo y satura la cola. El error clásico es meter el outlier en el fit de μ/σ o asumir “el último índice es el malo”. Pregunta: ¿por qué `ref=xs[:3]` y no `xs` completo en este fixture? Siguiente (E2): path length toy con lados correctos del corte.
- **Code/output changes:** none

### S36-T3-A-E2 (weDo, independent) — **A−**
- **Diagnosis:** Lados invertidos del path toy — superficie **nueva** respecto a E1 (fade fuerte). Feedback/retro eco en “path corto ≠ culpa”, pero el skill es distinto y usable.
- **Checklist:** all pass; retro partial (eco menor)
- **Severity residual:** P2 opcional
- **Proposed residual:** none required
- **Code/output changes:** none

### S36-T3-A-E3 (weDo, transfer) — **B+**
- **Diagnosis:** Transfer de **política** (route `human_review`, `auto_sanction False`) con starter `auto_fire` / sanción True. Solape con E1 en bug `z=0`: instruction abre por “Corrige z a 3”, lo que re-drile a E1 antes de la novelty de ruta. Preamble R1 **sí** vende enrutamiento (bien). Retro con self-check fail-closed — fuerte.
- **Checklist:** all pass; instruction partial (re-drill z primero)
- **Severity residual:** P2
- **Proposed instruction (reorder emphasis):**  
  1. Deja μ/σ solo sobre `ref` (ya correcto).  
  2. Asegura umbral de rareza z=3 (el starter tiene z=0).  
  3. Route: `human_review` si `any(flags)` else `pass` — **nunca** `auto_fire`.  
  4. `auto_sanction` False; conserva print de flags.  
  *(Opcional Fixer: si se quiere fade más limpio, dejar z=3 ya correcto en starter y solo defectear route/auto_sanction — **cambiaría** el multi-defect del starter; solo si se re-ejecuta y se acepta; no es P0.)*
- **Code/output changes:** none required (instruction reorder preferred over code change)
- **Validation notes:** Differenciar verbalmente de E1 (meta = ruta, no solo z) ya está en preamble; instruction puede alinearse.

### S36-T3-B-DEMO (iDo) — **B**
- **Diagnosis:** expected_flags vs capacity; preamble contamination≠fraude excelente. `why` ~36 w (ligero bajo piso 40). Retro ~23 w corta.
- **Checklist:** all pass; why/retro partial (longitud)
- **Severity residual:** P2
- **Proposed why (expand ~45 w):**  
  `int(n*contamination)` estima la carga de la cola; overflow frente a capacity fuerza recalibrar (bajar contamination o priorizar), nunca “descubrir más fraude”. `is_fraud_rate` queda False a propósito: el parámetro no es prevalencia de ilícitos. En We Do: producto n×contamination, overflow y novelty vs ref.
- **Proposed retrospective (expand):**  
  Contamination calibra rareza y carga de revisores, no la tasa de ilícitos del negocio. El error clásico es vender “contamination=0.05 ⇒ 5% de fraude”. Pregunta: con overflow, ¿subes contamination “para cazar más”? (no — bajas o priorizas.) We Do: expected_flags, overflow y kind novelty.
- **Code/output changes:** none

### S36-T3-B-E1 (weDo, guided) — **B−**
- **Diagnosis:** `n + contamination` vs producto — guided aritmético claro. Preamble corto (~35 w bullets) pero checklist completo. Retro **~21 w** y eco con feedback.
- **Checklist:** all pass; retro fail (longitud + eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  El producto `n × contamination` es control de **carga** de cola, no prevalencia de ilícitos. Sumar es un bug trivial con impacto de negocio: planificas mal la capacidad de revisores. Pregunta: con n=200 y contamination=0.1, ¿por qué 20 y no 200.1? Siguiente (E2): overflow vs capacity real de slots.
- **Code/output changes:** none

### S36-T3-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Comparación invertida `expected < capacity` — independent limpio. Eco feedback/retro en “capacidad no delincuentes”.
- **Checklist:** all pass; retro partial (eco + ~23 w)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Overflow es un problema de **capacidad de revisor**, no de “más delincuentes en el batch”. Invertir `>` a `<` oculta el desborde y deja la cola HITL sin cupo real. Pregunta: si expected=10 y capacity=8, ¿la action es “subir contamination”? (no — `lower_contamination` o priorizar.) Luego (E3): novelty calculada vs ref, sin culpa.
- **Code/output changes:** none

### S36-T3-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** Transfer conceptual a novelty vs ref con anti-patrón `outlier_as_guilt` / misconduct True. Self-check en retro (novelty vs outlier en batch de train). Fade real desde E1/E2.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S36-T4-A-DEMO (iDo) — **A−**
- **Diagnosis:** fit-past / score-future + mean_flag_rate + leakage False; preamble pide predecir el efecto de meter el 50 en el fit. `why` en rango. Retro ~30 w con principio “el reloj manda”.
- **Checklist:** all pass; retro partial (longitud menor)
- **Severity residual:** P2 opcional
- **Proposed residual:** none required
- **Code/output changes:** none

### S36-T4-A-E1 (weDo, guided) — **A−**
- **Diagnosis:** fit sobre `train+future` — defect de leakage de magnitud de primer nivel. Feedback y retro se solapan en “ensancha σ”, pero el hábito del split es cristalino. Éxito `flags [0,0,1]` exacto.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Meter el futuro en el fit ensancha σ y **esconde** el outlier: leakage de magnitud. El hábito del lab es split temporal estricto — el reloj manda el experimento de la cola. Pregunta: si el 50 entra al train, ¿el flag del future sigue siendo 1? (a menudo no.) Siguiente (E2): predicado de meses train/test.
- **Code/output changes:** none

### S36-T4-A-E2 (weDo, independent) — **B**
- **Diagnosis:** train_months incluye mes de test — independent limpio. Eco feedback/retro en “leakage de mes barato/caro”.
- **Checklist:** all pass; retro partial (eco + ~23 w)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Leakage de mes es el anti-patrón más barato de detectar y el más caro de ignorar: el backtest se vuelve optimista y miente al revisor sobre la utilidad de la señal. El error clásico es dejar el test dentro de `train_months` “por completitud”. Pregunta: con train `['2026-01']` y test `2026-02`, ¿qué imprime `has_leakage`? Luego (E3): spike de flag_rate entre ventanas.
- **Code/output changes:** none

### S36-T4-A-E3 (weDo, transfer) — **A−**
- **Diagnosis:** Spike de tasas (umbral 0.9→0.3) + action investigate — transfer real a monitoreo de ventanas. Self-check en retro (“qué miras primero ante un spike”). Eco parcial con feedback tolerable.
- **Checklist:** all pass
- **Severity residual:** P2 opcional
- **Proposed residual:** none required
- **Code/output changes:** none

### S36-T4-B-DEMO (iDo) — **A−**
- **Diagnosis:** P@k + HITL; preamble aclara que 1 = “sirvió”, no “culpable”. `why` en rango. Retro ~31 w con anti-accuracy/HITL off.
- **Checklist:** all pass
- **Severity residual:** none / P2 opcional expand
- **Proposed residual:** none required
- **Code/output changes:** none

### S36-T4-B-E1 (weDo, guided) — **B**
- **Diagnosis:** k=4→2 — guided simple y claro. Eco feedback/retro en “k es parte del contrato”.
- **Checklist:** all pass; retro partial (eco + ~26 w)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  k es parte del contrato de evaluación de cola: cambiarlo a escondidas miente el P@k reportado al revisor. El 1 del ranking es “sirvió”, no “culpable”. Pregunta: con ranked=`[1,0,1,0]` y k=2, ¿por qué 0.5 y no 0.5 con k=4 (0.5 también numérico pero otro contrato)? Siguiente (E2): HITL cuando labels son escasos frente a flags.
- **Code/output changes:** none  
- **Note:** ranked con k=2 y k=4 da 0.5 en ambos en este fixture — el Fixer **no** debe confiar solo en el float; el print `k 2` es el discriminante (ya en solution). Instruction ya dice “no uses k=4”.

### S36-T4-B-E2 (weDo, independent) — **A−**
- **Diagnosis:** HITL forzado a False — independent de política fuerte. Preamble de escasez 5 labels / 40 flags. Feedback/retro cercanos pero retro acota “False fijo” y puente a E3 choose_metric.
- **Checklist:** all pass
- **Severity residual:** P2 opcional (eco)
- **Proposed residual:** none required
- **Code/output changes:** none

### S36-T4-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** choose_metric por umbral de escasez; starter siempre `global_accuracy` — anti-patrón de ROC/accuracy fantasma. Self-check de defensa 30 s ante gerente — cierre natural del hilo T4-B y del youDo.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### youDo (S36 project) — **A**
- **Diagnosis:** Marco **sólido**: context con “defender tres invariantes en 30 s”, objectives, requirements (anomalía ≠ culpa, sin leakage, HITL, sintético), rubric con gate privacy, portfolioNote de impacto medible (no “detectamos fraude”), retrospective de defensa (~72 w) con (1) invariante (2) real vs sintético/PII (3) frase README. Starter casi-pipeline completo sigue siendo generoso (“correr y listo”), pero R1+R2 mitigan con retrospective + gate + portfolioNote — **no** vaciar el starter.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective pass
- **Severity residual:** P2 opcional (starter generoso documentado; no es bug de prosa)
- **Proposed residual:** none required for prose fields  
  Opcional Fixer (no R2 obligatorio): en `portfolioNote` o README del learner, una checklist de “invariantes que no vienen gratis al run del starter” (p. ej. documentar `contamination` calibrada a capacity ficticia) — solo si se quiere más fricción metacognitiva sin vaciar código.
- **Code/output changes:** none

---

## Priority order (Round 2 residuals only)

### P0
- **Ninguno.** Cobertura de campos y outputs canónicos están listos para learner.

### P1
- **Ninguno bloqueante.** Los peores residuales (T2-B-E2 / T3-B-E1 retros ~21 w + eco) son metacognición fina, no ceguera de éxito.

### P2 (calidad — Fixer R2 opcional pero recomendado en lote manual, no bulk)
1. **Ecos feedback ≈ retrospective** en ~22 weDo — expandir retro con self-check y recortar eco (prioridad: T2-B-E2, T3-B-E1, T3-B-E2, T4-A-E2, T1-B-E1/E2, T2-A-E1/E2, T2-B-E1, T3-A-E1, T4-B-E1).
2. **iDo retros cortas** — expandir: T1-B-DEMO, T2-A-DEMO, T2-B-DEMO, T3-B-DEMO (+ why T3-B-DEMO al piso 40 w).
3. **T1-A-E2** — alinear starter print contract a solution (safe_sd devuelto) sin cambiar output canónico.
4. **T1-B-E1/E2** — mantener preambles distintos; opcional reforzar instruction E2 como “gate ético”, no re-drill de argmax; **no** cambiar outputs sin re-test.
5. **T3-A-E3** — reordenar instruction para priorizar route/`auto_sanction` (meta de transfer) sobre el re-drill de z.
6. **Instruction paso 4 mental** en varios E* — mover a límites del preamble o feedback donde sea solo “piensa en…”.
7. **youDo starter generoso** — documentado; no vaciar; fricción vía retrospective (ya presente).

---

## Residual risks

1. **T1-B-E1/E2 mismo bug `min`→`max`:** sin preambles distintos se sentirían clones; **R1 ya diferenció prosa**. Residual: learner avanzado nota re-drill de código.
2. **T3-A-E1/E3 solape z:** E3 debe sentirse como **política de ruta**; instruction aún abre por z — residual P2 de énfasis, no de cobertura.
3. **T1-A-E2 print contract:** starter puede “pasar” visualmente el safe_sd sin devolver la tupla si el learner no lee la instruction; solution y tests del curso asumen el contrato de solution.
4. **T4-B-E1 float no-discriminante:** P@k con k=2 y k=4 da 0.5 en el fixture; el discriminante es `print("k", k)` — ya en solution; no “arreglar” inventando ranked distinto sin justificación execute-and-diff.
5. **Carga de 24 We Do:** alta; bullets cortos ayudan; no alargar preambles a ensayos en R2.
6. **Ética en código ya fuerte:** no diluir `misconduct`/`verdict`/`auto_guilt` al reescribir retro.
7. **Id `ai-apis-advanced` vs contenido:** residual de naming del archivo; no tocar contenido hacia “APIs genéricas”.
8. **youDo “run and done”:** mitigado por retrospective + gate; riesgo residual de portfolio sin defensa oral — acceptable para R2.

---

## Round-2 Fixer handoff notes

- **No hay P0 de campos faltantes.** R2 es polish de calidad, no reintroducir title/preamble desde cero.
- Preferir **reemplazos de retrospective** (texto completo en este reporte) sobre reescritura masiva de preambles (ya en forma).
- Longitudes: empujar retros weDo hacia **40–80** palabras con 1 self-check; iDo demos cortas hacia el mismo piso.
- Español PE profesional; sin PII real; CASO-LIM-036.
- **No generadores.** Cada unidad residual se edita a mano.
- Preservar outputs canónicos salvo execute-and-diff justificado (candidato único: starter T1-A-E2 prints, no solution output).
- No editar theory/selfCheck salvo necesidad de print (no es el caso).
- Validar build estático de la sección tras el fix.

---

## Summary scores (Round 2)

| Band | Units (approx.) |
|------|-----------------|
| **A / A−** | ~18 (demos fuertes T1-A, T3-A; transfers T1-A-E3, T2-B-E3, T3-B-E3, T4-B-E3; youDo) |
| **B / B+ / B−** | ~15 (mayoría weDo con eco/retro corta; iDo retros cortas) |
| **C / D** | **0** |

**Verdict:** Section 36 exercise pedagogy is **learner-ready** after Round 1. Round 2 residual work is **optional quality tightening** (feedback/retro differentiation, short retros, two integrity/fade notes), not a second full-field campaign.

---

Section 36 exercise pedagogy review complete. Ready for the Fixer prompt.
