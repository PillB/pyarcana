# S32 Exercise Pedagogy Report (Round 2)

## Section
- **title:** Feature engineering y pipelines sin leakage
- **shortTitle:** Features sin leakage
- **id:** `microservices` (archivo `s32-microservices.ts`; contenido = tabla de features versionada del workbench relacional, no microservicios de red)
- **index:** 32
- **source:** `src/lib/course/sections/s32-microservices.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades)
- **subtemas:** T1-A catálogo/keys · T1-B missing/scale · T2-A grafo relacional · T2-B ventanas half-open · T3-A transformers fit→transform · T3-B persistencia fs-vN · T4-A split tiempo/entidad · T4-B leakage/skew/version
- **hilo:** tabla de features del workbench **CP-N3-B** (fixture sintético Red Andina, `run_id=cpn3b-feat`); gate **train≡serve**; sin timestamps futuros ni labels de decisión como feature; features de grafo (puente S31) **no** son veredicto de fraude ni parentesco; artefacto `fs-vN` es contrato de entrada del baseline **S33**
- **Round 1 context:** `round1/S32_EXERCISE_PEDAGOGY_REPORT.md` (solo contraste; **no** rubber-stamp)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (preamble/retrospective checklists, E1→E3 fade, length targets, anti-aberration).
- Manually re-inspected **current** source for every `iDo.steps[]` (8), `weDo.steps[]` (24) y `youDo` (title, preamble, instruction, feedback, retrospective, starter DEFECT, solution output, why).
- Verified integrity traps (starter stdout ≠ solution stdout) for representative units: T1-A-E1 (`k in known` vs `not in`), T1-B-E1 (z sobre `[2,4]` vs `filled`), T2-B-E1 (`<= t` vs `< t`), T3-A-E1 (hardcode `"app"` vs mode aprendida), T3-B-E1 (serve sin fill vs `[2,4]`), T4-A-E1 (tamaños fijos vs derivados), T4-B-E1 (gate invertido vs limpio).
- Scored for a **true newbie** (qué / por qué / éxito / qué queda), independent of Round-1 proposals.
- Word counts measured only as gates (no bulk prose generation).
- No generators, bulk templates, or source edits.

## Global findings (post Round-1 fix)

| Area | Status | Residual impact |
|------|--------|-----------------|
| **Field coverage** | Complete: 8 iDo con `preamble`+`why`+`retrospective`; 24 weDo con `title`+`preamble`+`instruction`+`feedback`+`retrospective`; youDo con `retrospective` + marco sólido | Round-1 P0/P1 “cero campos” **cerrado** |
| **We Do titles** | Presentes, español PE, alineados al skill; E1/E2 ~4–7 palabras; **E3 a menudo 3 palabras** (`Fail-closed: REQUEST_*`) bajo el piso 4 del spec | Residual **P2** leve en 8 títulos E3 |
| **Preamble shape** | weDo en bullets contexto/meta/éxito/límites; iDo narrativos con predicción + “no escribas” | Pass en estructura; bullets a menudo &lt;80 w (aceptable por spec “4 short bullets”); iDo ~57–83 w |
| **Instruction = steps** | Solo-tarea, ordenados; E1 nombra DEFECT; E2/E3 menos migas | Pass — varias ~19–33 w (bajo piso 40; legibles; no bloquear) |
| **E1→E2→E3 fade** | Superficies distintas por subtema (booleano/catalog_ok → assess PASS/REJECT/MISSING → decide CONTINUE/REJECT/REQUEST; missing-scale; grafo; half-open; ModeImputer; fs-vN; split; promote) | Pass — **no** clones numéricos |
| **Feedback vs retrospective** | Feedback suele razonar el bug + ancla cola/S33; en **~8–10** unidades el retro **eco** del feedback o queda en “puente E3” sin metacognición extra | Residual **P2** sistemático |
| **Retrospective length** | **Todos** los weDo ret ~10–28 w (spec 40–80); iDo ret ~23–45 w (solo T1-A en rango pleno); principio + puente suelen estar; a menudo falta self-check o misconception *distinto* del feedback | Residual **P2** dominante del pase |
| **iDo why** | 7/8 en rango ~45–55 w; **T3-A-DEMO why ~38 w** (leve bajo 40) | Residual **P2** leve |
| **iDo preamble/retro** | Completos y alineados a CP-N3-B; retros cortas en T1-B…T4-B sin self-check | Residual **P2** |
| **Código/outputs** | Coherentes con theory; DEFECT `# DEFECT:` excelente; **wrong ≠ right** en traps verificados; demo T4-B muestra detección (leaky/skew True) vs E1 fixture limpio | **Sin** hueco de integridad |
| **youDo frame** | context CP-N3-B→S33, objectives, requirements, starter con stubs + acceptance, rubric, portfolioNote, retrospective de defensa (~71 w) | Pass |
| **Hints E1** | Varios casi spoilean la fórmula (T1-A-E1, T2-B-E1, T3-A-E1); aceptable en guided | Residual **P2** opcional (no ampliar spoiling en E3) |

**Net:** Round 1 cerró el vacío sistemático de prosa verbal. Round 2 **no** es rubber-stamp: la sección está **lista para learner** en la gran mayoría de unidades (qué practicar, éxito exacto, defectos nombrados, fade real). Residuales son **calidad** (retros weDo cortas, eco feedback/retro en E2, títulos E3 de 3 palabras, iDo retro bajo piso). **No** hay defectos de integridad wrong≈right ni campos ausentes. Prioridad del Fixer R2 = **P2 polish de retrospectives** (y títulos E3), no reescritura estructural.

## Scoring key
| Score | Meaning |
|-------|---------|
| **A** | Newbie responde qué / por qué / éxito / qué queda; sin fix residual obligatorio |
| **B** | Usable; residual menor (eco, longitud, polish) |
| **C** | Parcial; residual R2 debería arreglarse (claridad, metacognición fina, integridad leve) |
| **D** | Falla el test de true-newbie en un ítem crítico (éxito invisible, wrong≈right) |

Checklist: **context · goal · success · constraints · retrospective** → pass / partial / fail.

---

## Unit ledger

### S32-T1-A-DEMO (iDo) — **A**
- **Diagnosis:** Worked example sólido: keys ⊆ catálogo, `note_len` derivada, `catalog_ok True`. Preamble (~83 w) pide predicción y ancla serve que inventa columnas. `why` (~55 w) en rango. Retro repara “confiar en el dict del row” y puente a We Do — única iDo retro ya en piso 40+.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S32-T1-A-E1 (weDo, guided) — **A−**
- **Diagnosis:** Title claro; bullets con éxito `S32-T1-A PASS`; instruction nombra DEFECT (`k in known`); feedback razona basura aprobada + cola; retro corta pero principio “unknown = row − catálogo” + puente E2. Starter discrimina bien.
- **Checklist:** all pass; retro partial (longitud ~23 w)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Unknown = row − catálogo, no al revés: si inviertes el predicado, “pasas” siempre y el fit arranca sobre basura. El error clásico es creer que “cualquier key del schema cuenta” en lugar de “solo las del row deben estar en known”. Pregunta: si el row trae solo `amount_7d` y el schema lista tres columnas, ¿qué sale en `unknown`? Siguiente (E2): tres rutas PASS / REJECT / MISSING.
- **Code/output changes:** none

### S32-T1-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Assess de tres rutas excelente. Feedback y retro se solapan casi palabra por palabra en “contenido vs schema ausente” (eco fuerte).
- **Checklist:** all pass; retro partial (eco + ~23 w)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Tres códigos distintos son tres historias de ops: PASS (contrato sano), REJECT (violación demostrada), MISSING (falta prerequisito). Confundir “feature inventada” con “schema ausente” deja logs que nadie puede triagear en el promote. Pregunta: ¿por qué el adverso con `unknown_feat` no debe devolver `MISSING:schema`? Luego (E3) separas `REQUEST_CATALOG` de `REJECT`.
- **Code/output changes:** none

### S32-T1-A-E3 (weDo, transfer) — **A−**
- **Diagnosis:** Transfer real a fail-closed; self-check en retro; feedback y retro se distinguen (REQUEST vs REJECT). Title 3 palabras.
- **Checklist:** all pass; title partial
- **Severity residual:** P2
- **Proposed title:** Fail-closed: REQUEST_CATALOG frente a REJECT  
- **Proposed residual (optional retro polish):** none required beyond title
- **Code/output changes:** none

### S32-T1-B-DEMO (iDo) — **B**
- **Diagnosis:** Indicator + fill + z con stats de train; preamble pide predicción; `why` en rango. Retro ~28 w sin self-check.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Indicator + stats de train = contrato de missing/scale: la ausencia es señal, no un cero barato. El error clásico es rellenar en silencio o reestimar μ/σ en serve y creer que el z “se ve bien”. Pregunta: ¿por qué el z se calcula sobre `filled` y no sobre la lista original con `None`? We Do: corregir z y fallar closed sin mediana.
- **Code/output changes:** none

### S32-T1-B-E1 (weDo, guided) — **A−**
- **Diagnosis:** DEFECT z sobre `[2,4]` excelente; feedback ancla silent fill; retro corta pero principio claro.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  El z sigue a `filled`, no a un ejemplo de pizarra: si hardcodeas la salida, train≡serve se rompe en el primer batch real. El error clásico es copiar constantes del notebook “porque el assert pasa”. Pregunta: ¿qué se rompe si mañana la mediana de train deja de ser 2.0? Siguiente (E2): validar indicator vs values.
- **Code/output changes:** none

### S32-T1-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Assess silent fill sólido. Feedback y retro repiten “mediana prerequisito / silent fill = incumplimiento” (eco).
- **Checklist:** all pass; retro partial (eco + ~19 w)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Un indicator todo `False` con huecos reales es un mentiroso: el modelo cree que no faltó nada y la cola confía en un score inflado. La mediana de train es prerequisito; silent fill es rechazo de contrato, no un atajo de notebook. Pregunta: si `values` tiene un `None` y el indicator no lo marca, ¿PASS o REJECT y por qué? Luego (E3): `REQUEST_MEDIAN`.
- **Code/output changes:** none

### S32-T1-B-E3 (weDo, transfer) — **A−**
- **Diagnosis:** Fail-closed limpio; self-check REJECT vs REQUEST; title 3 palabras.
- **Checklist:** all pass; title partial
- **Severity residual:** P2
- **Proposed title:** Fail-closed: REQUEST_MEDIAN sin inventar fill  
- **Code/output changes:** none

### S32-T2-A-DEMO (iDo) — **B**
- **Diagnosis:** Shared/degree/path=99; preamble ancla “no es veredicto”; `why` en rango. Retro ~26 w.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Path missing → default alto (99), no arista inventada ni degree=0 “por si acaso”. El error clásico es convertir matching o shared address en veredicto de parentesco o fraude. Pregunta: ¿por qué un path ausente no debe codificarse como 0? We Do: shared/degree/path y rechazo de label-as-feature.
- **Code/output changes:** none

### S32-T2-A-E1 (weDo, guided) — **A−**
- **Diagnosis:** Doble defecto (path hardcode + meets exige uses_label True) excelente; feedback ancla cola; retro corta.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Features de grafo ≠ label: shared, degree y path son topología observada en t, no la respuesta del caso. El error clásico es colar `label_fraud` “porque ayuda al AUC” o exigir `uses_label=True` para “pasar”. Pregunta: si E1-E9 no está en `paths`, ¿qué valor de path es el contrato del lab? Siguiente (E2): assess con ban de uses_label.
- **Code/output changes:** none

### S32-T2-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Assess ban de label; retro ~16 w casi solo puente E3 (metacognición débil). Feedback ya lleva el peso.
- **Checklist:** all pass; retro partial (muy corta)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  El grafo resume evidencia para el score o la cola, no emite parentesco ni fraude. Un record con `uses_label=True` no se “arregla” ignorando el flag: se rechaza. Pregunta: ¿por qué falta de `neighbors` es MISSING y no REJECT_LABEL? Luego (E3): `REQUEST_GRAPH_FEAT` sin inventar degree=0.
- **Code/output changes:** none

### S32-T2-A-E3 (weDo, transfer) — **A−**
- **Diagnosis:** Fail-closed + self-check; feedback y retro levemente solapan “pedir grafo / degree=0”. Title 3 palabras.
- **Checklist:** all pass; title/retro partial
- **Severity residual:** P2
- **Proposed title:** Fail-closed: REQUEST_GRAPH_FEAT sin inventar 0  
- **Proposed retrospective (replace):**  
  Pedir la feature de grafo evita silent defaults que contaminan el baseline S33. El error clásico es inventar degree=0 “por si acaso” cuando faltan vecinos. Pregunta: ¿qué código sale si falta `neighbors` y el resto del record está completo? Ese hábito (REQUEST vs inventar) es entrevista-relevante.
- **Code/output changes:** none

### S32-T2-B-DEMO (iDo) — **B**
- **Diagnosis:** Demo central half-open vs cerrado; preamble ancla historia del intro; `why` en rango. Retro ~24 w sin self-check.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Si el score offline solo sube con ventana cerrada, sospecha leakage temporal: en serve el instante t no existe igual. El error clásico es `ts <= t` “por redondeo” o “porque se ve más estable”. Pregunta: con eventos `[1,2,3,5]`, t=5, w=3, ¿por qué half-open da 2 y cerrado 3? We Do: forzar half-open y `REQUEST_WINDOW`.
- **Code/output changes:** none

### S32-T2-B-E1 (weDo, guided) — **A**
- **Diagnosis:** Bug de máximo impacto de la sección (`<= t`); preamble/éxito claros; feedback ancla catálogo; retro principio + puente. Listo para learner.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: retro +self-check “¿qué count esperas si un evento cae exactamente en t?”)
- **Proposed residual:** none required
- **Code/output changes:** none

### S32-T2-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Assess includes_t; retro **~12 w** (más corta de la sección) — solo “leakage de política / REQUEST_WINDOW”, eco del feedback.
- **Checklist:** all pass; retro partial (eco + muy corta)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  El adverso con `includes_t=True` modela una **política** que filtra t, no un schema incompleto: es leakage de ventana, no de keys. Recomputar desde `events` evita confiar en un flag prebakeado. Pregunta: si falta `w`, ¿intentas el conteo o devuelves MISSING? Luego (E3): `REQUEST_WINDOW` sin inventar w=7.
- **Code/output changes:** none

### S32-T2-B-E3 (weDo, transfer) — **B**
- **Diagnosis:** Fail-closed temporal; feedback y retro repiten “sin ancho / inventar w=7” (eco). Title 3 palabras. Feedback ~24 w (borde del piso 25).
- **Checklist:** all pass; retro/title partial
- **Severity residual:** P2
- **Proposed title:** Fail-closed: REQUEST_WINDOW sin inventar w  
- **Proposed retrospective (replace):**  
  Sin ancho de ventana no hay feature de frecuencia legítima hacia S33: pedir `w` es fail-closed, no improvisar 7 “por costumbre”. El error clásico es CONTINUE cuando falta el prerequisito. Pregunta: ¿REJECT o REQUEST si falta `w` y el record trae events y t? Ese matiz (ausencia ≠ incumplimiento) se reutiliza en todo el promote.
- **Proposed feedback (expand if touched):**  
  Sin ancho de ventana no hay feature temporal legítima hacia S33. Inventar w=7 “por costumbre” es silent default: pide el prerequisito, no improvises, o el score offline y serve divergen en silencio.
- **Code/output changes:** none

### S32-T3-A-DEMO (iDo) — **B**
- **Diagnosis:** ModeImputer + before_fit + router; preamble pide predicción multi-línea. **why ~38 w** (leve bajo 40); retro ~28 w.
- **Checklist:** all pass; why/retro partial (longitud)
- **Severity residual:** P2
- **Proposed why (expand ~+10 w):**  
  fit→transform ordenado es train≡serve: hardcodear fill en transform rompe el state versionable y el audit del notebook. El router por tipo separa numéricas y categóricas (idea de ColumnTransformer). Transform before fit debe fallar ruidoso (`REJECT_TRANSFORM_BEFORE_FIT`), no inventar silent defaults en serve. Puente a We Do: aprender moda real y fallar closed sin train_xs.
- **Proposed retrospective (expand):**  
  Estado fitted se demuestra con fit real sobre datos de train, no con un flag `fitted=True` prebakeado. El error clásico es silent default en serve (“siempre app”). Pregunta: ¿qué debe ocurrir si llamas `transform` antes de `fit`? We Do: aprender moda y `REQUEST_FIT_STATE`.
- **Code/output changes:** none

### S32-T3-A-E1 (weDo, guided) — **A−**
- **Diagnosis:** DEFECT fit no aprende + transform hardcodea `"app"`; feedback y retro alineados pero retro corta.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  La moda se aprende en fit y se reutiliza en serve: hardcodear `"app"` en transform no se puede versionar ni auditar. El error clásico es “ya sé cuál es la mayoritaria del fixture”. Pregunta: si train fuera `["web","web","app"]`, ¿qué mode debería salir? Siguiente (E2): assess try_before_fit.
- **Code/output changes:** none

### S32-T3-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Assess fit real; retro **~13 w** casi copia la primera frase del feedback.
- **Checklist:** all pass; retro partial (eco + muy corta)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Un flag `try_before_fit` no es evidencia de state: o haces fit real sobre `train_xs` o rechazas el notebook que “transforma primero”. Sin state serializable no hay train≡serve ni baseline auditable. Pregunta: ¿por qué falta de `train_xs` es MISSING y no REJECT_TRANSFORM_BEFORE_FIT? Luego (E3): `REQUEST_FIT_STATE`.
- **Code/output changes:** none

### S32-T3-A-E3 (weDo, transfer) — **B**
- **Diagnosis:** Fail-closed; feedback y retro abren con la misma frase “Pedir el state de fit evita silent defaults”. Title 3 palabras.
- **Checklist:** all pass; retro/title partial (eco)
- **Severity residual:** P2
- **Proposed title:** Fail-closed: REQUEST_FIT_STATE hacia fs-vN  
- **Proposed retrospective (replace):**  
  Sin `train_xs` no hay state que serializar hacia `fs-vN`: pedir el prerequisito es mejor que inventar mode=`"app"`. El error clásico es CONTINUE ciego o un silent default “porque en el demo era app”. Pregunta: ¿qué sale si falta `train_xs`? Ese REQUEST protege el promote a S33.
- **Code/output changes:** none

### S32-T3-B-DEMO (iDo) — **B**
- **Diagnosis:** Round-trip JSON + apply mediana; preamble ancla version bump S33; `why` en rango. Retro ~23 w.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  `fs-vN` es el contrato de entrada del baseline: S33 debe citar el id, no reutilizar un state viejo en silencio. El error clásico es reestimar la mediana en serve o “solo imprimir version” sin apply. Pregunta: si cambia el vocab de `canal`, ¿reutilizas fs-v1 o subes a fs-v2? We Do: round-trip + discipline de version.
- **Code/output changes:** none

### S32-T3-B-E1 (weDo, guided) — **A−**
- **Diagnosis:** DEFECT serve sin apply; instruction ~19 w pero clara; feedback y retro útiles; retro corta.
- **Checklist:** all pass; retro/instruction partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  State versionado + apply idéntico = train≡serve: no basta imprimir `fs-v1` si el batch sigue con `None`. El error clásico es “solo chequear que existe version”. Pregunta: ¿qué debe quedar en serve si el batch es `[None, 4]` y median=2? Siguiente (E2): assess con version vacía.
- **Code/output changes:** none

### S32-T3-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Assess fs-v*; retro ~15 w eco del feedback (“round-trip / id contrato”).
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Round-trip JSON + apply demuestran que el state sobrevive al notebook; el id `fs-v*` es lo que S33 citará. Version vacía no se “arregla” con un flag `versioned=True`. Pregunta: ¿PASS o REJECT si `version=""` aunque la mediana sea 2? Luego (E3): `REQUEST_STATE_JSON`.
- **Code/output changes:** none

### S32-T3-B-E3 (weDo, transfer) — **B**
- **Diagnosis:** Fail-closed persistencia; feedback y retro comparten “REQUEST_STATE_JSON es fail-closed cuando falta el artefacto”. Title 3 palabras.
- **Checklist:** all pass; retro/title partial (eco)
- **Severity residual:** P2
- **Proposed title:** Fail-closed: REQUEST_STATE_JSON sin inventar version  
- **Proposed retrospective (replace):**  
  Falta de `version` en el record es ausencia de artefacto: se pide JSON de state, no se inventa un id. El error clásico es promover con `version=""` o CONTINUE sin apply. Pregunta: ¿qué sale si `version=""` (string vacío, key presente)? Ese matiz (REJECT_UNVERSIONED vs REQUEST) es el que cierra el handoff a S33.
- **Code/output changes:** none

### S32-T4-A-DEMO (iDo) — **B**
- **Diagnosis:** Time split + overlap 0; preamble ancla leakage de identidad; `why` en rango. Retro ~30 w.
- **Checklist:** all pass; retro partial (longitud / sin self-check)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Overlap de entidades infla métricas offline y engaña a la cola de revisión: el modelo memoriza identidad, no patrón. El error clásico es split aleatorio sobre filas con entidades repetidas o un print “ok” sin n_train/n_test/overlap. Pregunta: si e1 aparece en enero y febrero, ¿qué overlap reportas? We Do: calcular overlap, no hardcodearlo.
- **Code/output changes:** none

### S32-T4-A-E1 (weDo, guided) — **A−**
- **Diagnosis:** DEFECT tamaños hardcodeados excelente; feedback ~23 w (leve bajo 25); retro corta.
- **Checklist:** all pass; feedback/retro partial (longitud)
- **Severity residual:** P2
- **Proposed feedback (expand):**  
  El gate exige cero intersección de entidades. Reportar n_train/n_test/overlap es parte del informe auditable antes del baseline, no un detalle opcional: hardcodear `1,1,0` engaña al promote.
- **Proposed retrospective (expand):**  
  Overlap se mide desde las filas, no se inventa en la pizarra. El error clásico es “ya sé que es cero en este fixture”. Pregunta: si mañana agregas una fila de e1 en febrero, ¿qué debe cambiar en el informe? Siguiente (E2): assess con entity repetida.
- **Code/output changes:** none

### S32-T4-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Assess e1/e1 adverso excelente; retro **~10 w** (más corta de todas) — solo eco de “se deriva de las filas”.
- **Checklist:** all pass; retro partial (crítica por longitud)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  e1 en train y test (mismo entity, distinto ts) es group leakage: PASS solo si lados no vacíos y la intersección de entity es vacía. Confiar en “ambos lados tienen filas” sin medir overlap aprueba el fallo clásico. Pregunta: ¿por qué el invalid con e1/e1 no puede ser PASS aunque n_train y n_test sean ≥1? Luego (E3): `REQUEST_SPLIT_KEYS`.
- **Code/output changes:** none

### S32-T4-A-E3 (weDo, transfer) — **A−**
- **Diagnosis:** Fail-closed de split; self-check en retro; title 3 palabras. Buen cierre del subtema.
- **Checklist:** all pass; title partial
- **Severity residual:** P2
- **Proposed title:** Fail-closed: REQUEST_SPLIT_KEYS antes del baseline  
- **Code/output changes:** none

### S32-T4-B-DEMO (iDo) — **A−**
- **Diagnosis:** Scan leaky + skew + fs-v2; preamble aclara demo = detección vs lab E1 limpio (evita confusión). `why` en rango. Retro ~26 w sin self-check.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Scan + skew + fs-vN cierran el promote: no son warnings opcionales. El error clásico es colar `label_decision` “solo para el notebook” o promover con skew alto porque el AUC offline se ve bien. Pregunta: ¿esta demo muestra promote limpio o detección de fallos? (detección). We Do: invertir el gate defectuoso y exigir id.
- **Code/output changes:** none

### S32-T4-B-E1 (weDo, guided) — **A**
- **Diagnosis:** Gate invertido vs fixture limpio; title/preamble/feedback/retro alineados; principio claro + puente E2. Listo para learner.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: retro +self-check “¿qué pasa si names trae label_decision y skew es False?”)
- **Proposed residual:** none required
- **Code/output changes:** none

### S32-T4-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Assess leakage/skew; retro ~13 w eco de “label_decision red flag / skew se mide”.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  `label_decision` en names y |serve−train| > tol son rechazo de promote, no “features útiles”. El skew se mide con umbral; la intuición no sustituye el cálculo. Pregunta: en el fixture adverso, ¿falla por leaky, por skew, o por ambos? Luego (E3): `REQUEST_FEATURE_SET_ID`.
- **Code/output changes:** none

### S32-T4-B-E3 (weDo, transfer) — **A−**
- **Diagnosis:** Fail-closed final del pipeline; self-check; feedback y retro se distinguen mejor que en otros E3. Title 3 palabras.
- **Checklist:** all pass; title partial
- **Severity residual:** P2
- **Proposed title:** Fail-closed: REQUEST_FEATURE_SET_ID hacia S33  
- **Code/output changes:** none

### S32-YOU-DO (youDo) — **A**
- **Diagnosis:** Marco sólido post-R1: context ancla CP-N3-B→S33, objectives cubren catálogo/missing/grafo/ventana/fs-vN/split/leakage, requirements train≡serve y PII sintético, starter con stubs y acceptance comments, rubric con pesos, portfolioNote, **retrospective de defensa** (~71 w) con invariante / PII / frase de impacto medible. Round-1 P1 cerrado.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: descomentar asserts de acceptance o checklist corta en portfolioNote)
- **Proposed residual:** none required
- **Code/output changes:** none (no alterar strings de acceptance: `n_e1==2`, `ov==0`, `leaky==[]`, version `fs-v*`)

---

## Priority order

### P0
Ninguno. Cobertura de campos y integridad de código están cerradas.

### P1
Ninguno obligatorio. No hay unidades que fallen el test de true-newbie en qué/éxito/constraints.

### P2 (Fixer R2 — polish; no reescritura estructural)
1. **We Do retrospectives (24)** — expandir al piso ~40–80 w; **prioridad alta** en las más cortas / con eco:  
   **T2-B-E2**, **T4-A-E2**, **T3-A-E2**, **T4-B-E2**, **T3-B-E2**, **T2-A-E2**, **T1-A-E2**, **T1-B-E2**, **T3-A-E3**, **T3-B-E3**, **T2-B-E3** (texto de reemplazo arriba).  
   El resto de E1/E3: expandir con self-check + misconception distinto del feedback (propuestas en ledger).
2. **We Do títulos E3 (8)** — pasar de 3 a ≥4 palabras:  
   `Fail-closed: REQUEST_* …` (propuestas en T1-A/B, T2-A/B, T3-A/B, T4-A/B E3).
3. **I Do retrospectives (7, excl. T1-A)** — expandir ~10–20 w + self-check opcional (textos arriba).
4. **I Do T3-A why** — +~10 w al piso 40 (texto arriba).
5. **Feedback borde** — T4-A-E1 (~23 w), T2-B-E3/T3-A-E3/T3-B-E2/E3 (~24 w): +1 frase si se toca la unidad.
6. **Hints E1** — opcional: no endurecer spoiling; no ampliar en E3.

### Opcional / fuera de scope de prosa
- Naming de archivo `s32-microservices.ts` / id `microservices` vs contenido “features sin leakage” (deuda de producto; no renombrar en pase pedagógico).
- You Do: asserts de acceptance descomentados o checklist en portfolioNote.

---

## Residual risks
- **Carga cognitiva de 24 We Do:** el patrón E1→E2→E3 es real y pedagógico; preambles ya diferencian escena. El Fixer R2 debe **reescribir** retros a mano (no copiar un bloque de 50 w en los 24).
- **Eco feedback/retro en E2:** si solo se alargan frases sin cambiar el ángulo, el residual persiste; usar las propuestas de *replace* (ops triage, self-check, puente E3 distinto).
- **Demo T4-B (leaky/skew True) vs E1 limpio:** coherente; no unificar outputs.
- **Exact outputs:** no cambiar strings canónicos (`S32-T*-* PASS`, tríos PASS/REJECT/MISSING, tríos CONTINUE/REJECT/REQUEST) salvo execute-and-diff justificado.
- **E2 que leen flags en parte** (includes_t, uses_label, try_before_fit): diseño intencional (contrato + recompute); la prosa de retro debe seguir diciendo que el flag no sustituye el cálculo.
- **Sin editar source en Round 2 Review:** este informe es solo diagnóstico y prosa residual; implementación = Fixer R2.

---

Section 32 exercise pedagogy review complete. Ready for the Fixer prompt.
