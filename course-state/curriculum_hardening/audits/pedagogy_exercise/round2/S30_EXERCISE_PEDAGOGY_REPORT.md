# S30 Exercise Pedagogy Report (Round 2)

## Section
- **title:** Entity resolution probabilístico
- **shortTitle:** ER probabilístico
- **id:** `security-infra` (archivo `s30-security-infra.ts`; contenido = motor de entity resolution testeable CP-N3-A, no “infra de seguridad” genérica)
- **index:** 30
- **source:** `src/lib/course/sections/s30-security-infra.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades)
- **subtemas:** T1-A exact/edit/token/fecha · T1-B missing y frecuencia · T2-A blocking y candidate recall · T2-B costo e imposibles · T3-A pesos y umbrales · T3-B cola clerical y Union-Find · T4-A split por entidad · T4-B P/R, co-cluster y error slices
- **hilo:** cierre **CP-N3-A** — motor ER sintético `CASO-LIM-030` (contactos Lima `@example.pe`); scores priorizan cola clerical; **nunca** auto-etiquetan fraude, parentesco ni colusión; hilo S29 → S30 → S31
- **Round 1 context:** `round1/S30_EXERCISE_PEDAGOGY_REPORT.md` (solo contraste; **no** rubber-stamp)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (preamble/retrospective checklists, E1→E3 fade, length targets, anti-aberration).
- Manually re-inspected **current** source for every `iDo.steps[]`, `weDo.steps[]`, and `youDo` (title, preamble, instruction, feedback, retrospective, starter DEFECT, solution output, why).
- Integrity traps checked live: (1) **T3-A-E1** weights `1.0`/`1.0` → starter `1.5` vs solution `0.75` (**defect visible**; Round-1 P1 código **cerrado**); (2) **T3-A-E3** pesos suman 1 → numerador sin `/sum(w)` ya da `0.875` (score-normalization **invisible** por salida; decision/explain sí fallan); (3) **T2-A-E3** vs **T2-B-E1** preambles distintos (candidatos vs SLO de costo).
- Scored for a **true newbie** (qué / por qué / éxito / qué queda), independent of Round-1 proposals.
- Word counts measured only as gates (no bulk prose generation).
- No generators, bulk templates, or source edits.

## Global findings (post Round-1 fix)

| Area | Status | Residual impact |
|------|--------|-----------------|
| **Field coverage** | Complete: 8 iDo con `preamble`+`why`+`retrospective`; 24 weDo con `title`+`preamble`+`instruction`+`feedback`+`retrospective`; youDo con `retrospective` + marco sólido | Round-1 P0 “cero campos” **cerrado** |
| **We Do titles** | Presentes, 4–8 palabras, español PE, alineados al skill | Pass |
| **Preamble shape** | weDo en bullets contexto/meta/éxito/límites; iDo narrativos con predicción | Pass en estructura (bullets ≈40–70 w; spec permite “4 short bullets”) |
| **Instruction = steps** | Solo-tarea, ordenados; E1 nombra DEFECT; E2/E3 menos migas en la mayoría | Pass; varios **paso 4** son verificación mental, no acción (P2) |
| **E1→E2→E3 fade** | Superficies distintas por subtema (exact → Jaccard → date_sim; missing → freq → informative; fold → recall ∩ → C(n,2); costo → person≠org → filter_before_score; score norm → review → ítem explain; UF → no fraud → filter labels; train → prevalencia → cross_split; precisión → recall → slices) | Pass — no clones numéricos; T2-A-E3/T2-B-E1 diferenciados en prosa |
| **Feedback vs retrospective** | Feedback suele razonar el bug *y* el impacto a cola/SLO/README; en **~14** unidades el retro **repite** el feedback (mismo principio, poco metacognición extra o self-check) | Residual **P2** sistemático |
| **Retrospective length** | weDo mediana ≈26–35 palabras (spec 40–80); iDo demos ~24–43 (solo T1-A-DEMO en rango). Principio + puente suelen estar; a menudo falta self-check. Peor caso weDo: **T4-A-E1** (~21 w), **T2-B-E1** (~23 w) | Residual **P2** (pocos **P1** de metacognición fina) |
| **iDo why** | Todos en o cerca del piso 40–90 (rango ~41–65); OK | Pass / polish menor |
| **Código/outputs** | Coherentes con theory y CP-N3-A; DEFECT bien nombrados; T3-A-E1 defect ahora observable | Residual **P2**: T3-A-E3 score-norm invisible si solo se miran los 3 campos del dict |
| **youDo frame** | context, objectives, requirements (ético, PII, cross_split), rubric con gate, portfolioNote, retrospective de defensa (~93 w) | Pass — fuerte |
| **Hints E3** | Aún cerca de la fórmula en varios transfer (aceptable como andamiaje mínimo) | Residual **P2** opcional |

**Net:** Round 1 cerró el vacío sistemático de prosa verbal y el defect invisible de T3-A-E1. Round 2 no es rubber-stamp: la sección está **lista para learner** en la gran mayoría de unidades; residuales son **calidad** (ecos feedback/retro, retros cortas, paso-4 mental, T3-A-E3 score-norm). No hay P0 de cobertura ni defectos que invaliden outputs canónicos.

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

### S30-T1-A-DEMO (iDo) — **A**
- **Diagnosis:** Worked example sólido: email con distinta capitalización → `exact 1.0`; tokens reordenados → `token_jaccard 1.0`. Preamble pide predicción y ancla cola clerical. `why` (~56 w) en rango. Retrospective repara “culpar al umbral” y puente a We Do.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S30-T1-A-E1 (weDo, guided) — **A−**
- **Diagnosis:** Title claro; bullets con éxito `1.0`; instruction nombra comparación cruda; feedback ancla cola de review; retro distingue string crudo vs umbral. Paso 4 es verificación mental, no tarea de código.
- **Checklist:** all pass; instruction partial (paso 4 no-tarea)
- **Severity residual:** P2
- **Proposed instruction (step 4 tweak):**  
  1. Abre el starter: `print(1.0 if a == b else 0.0)` (bug: comparación cruda).  
  2. Normaliza cada lado: `" ".join(s.casefold().split())`.  
  3. Imprime `1.0` si coinciden, `0.0` si no.  
  *(Mover “ambos lados → `'ana'`” al feedback o a límites del preamble — ya está implícito en éxito.)*
- **Code/output changes:** none

### S30-T1-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Denominador `|ta|` vs unión — independent limpio. Éxito float canónico. Feedback y retro casi clonan “Jaccard usa la unión / miente a auto_match”.
- **Checklist:** all pass; retro partial (eco + ~29 w)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  El denominador de Jaccard es la unión: así el score de nombre es comparable entre pares del scorer. Dividir por un solo set no “falla el test de tipos”; falla la calibración del umbral. Pregunta: con `ta={a,b}` y `tb={b,c}`, ¿por qué 1/3 y no 1/2? Luego (E3): tolerancia de fechas, no tokens.
- **Code/output changes:** none

### S30-T1-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Transfer real a `date_sim` con banda; starter solo igualdad exacta; retro con self-check “¿por qué 0.5 y no 1.0?”. Fade auténtico desde E1/E2.
- **Checklist:** all pass
- **Severity residual:** none (hints E3 casi dan la fórmula — P2 opcional)
- **Proposed residual:** none required
- **Code/output changes:** none

### S30-T1-B-DEMO (iDo) — **B**
- **Diagnosis:** `missing` / `agree` / pesos 0.025 vs 1.0 claros. Preamble de “0.025 no es peor match moral” excelente. Retrospective corta (~28 w) sin self-check.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Vacío → `missing`; valor común → menos peso de acuerdo. El error clásico es empujar missing a `non_match` y saturar la cola. Pregunta: si dos fuentes nunca publican phone, ¿un “agree” vacío sería evidencia de identidad? We Do: estados, rareza y cobertura por fuente.
- **Code/output changes:** none

### S30-T1-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Starter imprime `agree` en vacío — DEFECT perfecto. Feedback y retro se solapan en “missing no es agree/disagree”.
- **Checklist:** all pass; retro partial (eco + corto)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Tres estados (`missing` / `agree` / `disagree`) evitan inventar evidencia cuando falta un lado. El error clásico del starter es maquillar vacío como acuerdo. Siguiente (E2): bajar el peso de valores frecuentes, no re-etiquetar el vacío.
- **Code/output changes:** none

### S30-T1-B-E2 (weDo, independent) — **A−**
- **Diagnosis:** `base * f` vs `base / f` con éxito `0.02 0.5`; límites anti-“FS completo” claros. Feedback y retro cercanos pero el puente a E3 (missing por fuente) diferencia.
- **Checklist:** all pass
- **Severity residual:** P2 opcional (retro ~28 w → +1 self-check “¿qué peso si freq=1 ausente?”)
- **Proposed residual:** none required
- **Code/output changes:** none

### S30-T1-B-E3 (weDo, transfer) — **B**
- **Diagnosis:** Transfer a `informative_missing` por cobertura de fuente; anti-MCAR fuerte. Feedback y retro **casi idénticos** (eco explícito).
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  La cobertura por `source_system` convierte un vacío en señal de diseño, no en azar. Asumir MCAR sin tabla es un bug de modelo, no de relleno. Pregunta: con `web_form` phone=0.8, ¿qué etiqueta imprime y por qué no rellenas phone? En el You Do documentarás patrones de ausencia en el README.
- **Code/output changes:** none

### S30-T2-A-DEMO (iDo) — **B+**
- **Diagnosis:** Blocking + candidate recall 1.0 con claves ya plegadas; `why` contrasta theory (0.0 por acentos) — puente verbal presente. Retro corta (~27 w).
- **Checklist:** all pass; retro partial (longitud / sin self-check)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Blocking sin recall medido es fe en ciego. El error clásico es “optimizar CPU” sin gold sintético. Pregunta: si r3 cayera en el mismo bucket, ¿subiría el numerador del recall o solo `ncand`? We Do: clave estable, intersección honesta y pares por bloque.
- **Code/output changes:** none

### S30-T2-A-E1 (weDo, guided) — **A**
- **Diagnosis:** Fold de tildes con éxito `lopez|lim`; feedback ancla candidate recall 0.0; retro puente a intersección. Alineado a theory T2-A.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S30-T2-A-E2 (weDo, independent) — **A**
- **Diagnosis:** Unión vs intersección en numerador — independent excelente. Éxito `0.5`; “no inventes el 0.5 a mano” correcto. Feedback razona matches invisibles; retro no es eco total.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S30-T2-A-E3 (weDo, transfer) — **B**
- **Diagnosis:** C(n,2) multi-bloque con sizes [2,4,3]→10; preamble ancla “espacio de candidatos del blocking” (bien diferenciado de T2-B-E1). Feedback≈retro sobre C(n,2).
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  El scorer solo ve pares *dentro* de bloque: sumar tamaños subestima ese espacio. Pregunta: un bloque de tamaño 1, ¿cuántos pares aporta y por qué? En T2-B el mismo C(n,2) se lee como SLO de CPU y se combina con `filter_before_score`.
- **Code/output changes:** none

### S30-T2-B-DEMO (iDo) — **B**
- **Diagnosis:** cost 200 + impossible True; preamble de `filter_before_score`. Retro corta; `why` en piso.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Costo de pares y filtro de imposibles protegen CPU y calidad de la cola. El error clásico es scorear person–org y “limpiar” después. Pregunta: ¿por qué el filtro va *antes* del edit distance y no después? We Do: costo, impossible y política nombrada.
- **Code/output changes:** none

### S30-T2-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Mismo C(n,2) que T2-A-E3 con sizes [3,5]→13; preamble **SLO del batch** diferencia bien. Retro muy corta (~23 w) y eco parcial del feedback.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  El SLO del batch mira pares que llegarían al scorer, no registros en el bloque. Confundir `sum(sizes)` con costo es un error de capacidad, no de matching. Siguiente (E2): marcar person≠org como impossible *antes* de gastar similitud.
- **Code/output changes:** none (mantener fixture distinto de T2-A-E3)

### S30-T2-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Drill mínimo `==` vs `!=` honesto; límites anti-fraude. Feedback≈retro “impossible / por si acaso”.
- **Checklist:** all pass; retro partial (eco); skill simple pero alineado
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  `True` aquí no es “son la misma entidad”: es “no gastes scorer”. El error clásico es comparar todo y filtrar en la UI. Pregunta: si ambos fueran `person`, ¿qué imprime y qué haría el pipeline? Luego (E3): cuenta kept y nombra la política.
- **Code/output changes:** none

### S30-T2-B-E3 (weDo, transfer) — **A−**
- **Diagnosis:** Transfer de pipeline: kept=2 + `filter_before_score`; anti-patrón `score_first` excelente. Feedback y retro cercanos pero el puente a T3 diferencia.
- **Checklist:** all pass
- **Severity residual:** P2 opcional (aflojar eco “pares kept”)
- **Proposed residual:** none required
- **Code/output changes:** none

### S30-T3-A-DEMO (iDo) — **A−**
- **Diagnosis:** 0.94 auto_match con umbrales duales; preamble contrasta theory 0.875→review. `why` aclara “no es probabilidad calibrada”. Retro ~29 w sin self-check.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed residual (optional expand):**  
  Umbrales duales protegen operaciones: lo dudoso va a humanos. El error clásico es un solo corte y auto-etiquetar de más. Pregunta: con score 0.5 exacto y t_low=0.5, ¿auto, review o non_match? We Do: normalización, `review` y explain por campo.
- **Code/output changes:** none

### S30-T3-A-E1 (weDo, guided) — **A**
- **Diagnosis:** **Round-1 fix adoptado:** pesos 1.0+1.0; starter imprime `1.5`, solution `0.75` — defect **observable**. Preamble e instruction lo explicitan. Feedback/retro cercanos pero el aprendizaje de normalización es sólido.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: retro + self-check “¿qué imprime si solo sumas sims sin pesos?”)
- **Proposed residual:** none required
- **Code/output changes:** none (ya correcto)

### S30-T3-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Siempre `auto_match` con s=0.7 → debe ser `review`. Feedback≈retro “banda gris es diseño”.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Tres bandas (auto / review / non) son un contrato operativo, no un umbral único disfrazado. Forzar auto con 0.7 es el error del starter y de muchos notebooks. Pregunta: con s=0.5 y t_low=0.5, ¿qué imprime y por qué el `<=` importa? Luego (E3): arma el ítem con score, decisión y explain.
- **Code/output changes:** none

### S30-T3-A-E3 (weDo, transfer) — **B− / C+**
- **Diagnosis:** Transfer a ítem clerical completo — excelente como producto. **Integridad residual:** pesos suman 1.0, así `sum(sim·w)` ya es `0.875`; un learner puede “pasar” corrigiendo solo `decision` y `explain` sin dividir por `sum(w)`. Decision forzada `auto_match` y explain incompleto sí fallan el test de dict. Feedback/retro cortos y cercanos.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective partial · **score-defect observability partial**
- **Severity residual:** P2 (integridad) + P2 (eco)
- **Proposed residual (code, recomendado):**  
  Pesos que no sumen 1 para hacer visible la normalización, p. ej.  
  `weights = {"name": 1.0, "email": 1.0, "phone": 0.5}`  
  y ajustar sims para un score canónico redondeado distinto del numerador crudo; **o** dejar fixture y añadir assert conceptual en feedback: “si dejas de dividir y los pesos suman 1, el número miente el día que cambies pesos”.  
  **Proposed retrospective (replace):**  
  El revisor actúa sobre score + decisión + vector de aportes; omitir un campo en `explain` es un bug de producto. El error clásico es auto_match optimista sin phone. En T3-B unirás decisiones aprobadas en clusters con Union-Find.
- **Code/output changes:** opcional (execute-and-diff si se cambian pesos); outputs actuales siguen válidos si se documenta la limitación

### S30-T3-B-DEMO (iDo) — **B+**
- **Diagnosis:** UF con bridge clerical e3–e4 → True; preamble de sobrefundido hacia S31. Retro ~32 w.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed residual (optional):**  
  La transitividad es el corazón de la fusión exportable a S31. El error clásico es unir un puente dudoso sin validar. Pregunta: si e3–e4 fuera `uncertain`, ¿deberías hacer `union`? We Do: cluster, contrato de cola y alcance ético de labels.
- **Code/output changes:** none

### S30-T3-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Solo `union(1,2)` deja 3 aislado — guided perfecto. Feedback≈retro transitividad/completeness.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Un cluster partido exporta entidades duplicadas al grafo S31 aunque cada par “local” se vea bien. El error del starter es olvidar el segundo `union`. Pregunta: tras `union(1,2)` y `union(2,3)`, ¿`find(1)==find(3)` exige path compression? Siguiente (E2): contrato del ítem de cola sin `fraud`.
- **Code/output changes:** none

### S30-T3-B-E2 (weDo, independent) — **A−**
- **Diagnosis:** Gate ético `fraud` en actions; éxito dict canónico. Feedback y retro cercanos en label_space; puente a E3 ayuda.
- **Checklist:** all pass
- **Severity residual:** P2 opcional (eco “bug de alcance”)
- **Proposed residual:** none required
- **Code/output changes:** none

### S30-T3-B-E3 (weDo, transfer) — **B**
- **Diagnosis:** Filtro de `fraud`/`kinship` con orden de aparición — transfer ético real. Feedback y retro **casi clones** de la frase “ER responde ¿misma entidad?”.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  El borde del sistema filtra labels ajenos *antes* de que el score se lea como acusación. Parentescos y fraude son pipelines distintos; aquí solo sobrevive match/non_match/uncertain. Pregunta: si `proposed` trajera solo `fraud`, ¿qué lista imprime? En T4 medirás el motor sin leakage de entidades.
- **Code/output changes:** none

### S30-T4-A-DEMO (iDo) — **B**
- **Diagnosis:** train 2 / test 1; preamble anti-leakage fuerte. Retro la más corta de iDo (~24 w).
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Split por entidad es la guardia anti-leakage: la misma identidad no entrena y examina. El error clásico es partir *pares* al azar. Pregunta: el par e1–e4 (mixto), ¿es train limpio en esta demo simple? We Do: clasificación, base rate y `cross_split` explícito.
- **Code/output changes:** none

### S30-T4-A-E1 (weDo, guided) — **B−**
- **Diagnosis:** Train/test invertidos — clear. Feedback fuerte (“bug silencioso de F1”); **retro más corta del weDo (~21 w)** y casi solo repite “subset → train”.
- **Checklist:** all pass; retro partial (longitud + eco)
- **Severity residual:** P1 (metacognición mínima) / P2 alto
- **Proposed retrospective (replace):**  
  Un par es train solo si *ambas* entidades ⊆ train_e. Invertir la rama aprueba el test de “algo se imprime” y miente al calibrar umbrales. Pregunta: con a=e1, b=e4 y train_e={e1,e2,e3}, ¿train o test en *esta* etiqueta binaria? Siguiente (E2): prevalencia de matches en el gold.
- **Code/output changes:** none

### S30-T4-A-E2 (weDo, independent) — **A−**
- **Diagnosis:** n/matches invertido → 5.0 vs 0.2; ancla accuracy engañoso. Feedback y retro se complementan (README / base rate).
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: retro + “¿qué accuracy tendría un modelo que siempre dice non_match?”)
- **Proposed residual:** none required
- **Code/output changes:** none

### S30-T4-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Mejor E3 anti-leakage de la sección: train / test / cross_split; starter trata mixto como test. Feedback razona leakage disfrazado; retro con puente a T4-B. Hints dan los tres pares (aceptable en transfer).
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: aflojar 1 miga en hints)
- **Proposed residual:** none required
- **Code/output changes:** none

### S30-T4-B-DEMO (iDo) — **B+**
- **Diagnosis:** Demo rica P/R + co-cluster; preamble pide explicar completeness 0.5 vs quality 1.0. Retro corta pero principio correcto.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed residual (optional expand):**  
  Reporta pairwise + ambas vistas de co-cluster: un solo F1 de notebook esconde clusters partidos. El error clásico es celebrar precisión 1.0 con recall 0.5 sin slices. Pregunta: quality 1.0 con completeness 0.5, ¿qué tipo de error de fusión describe? We Do: derivar P y R y priorizar slices.
- **Code/output changes:** none

### S30-T4-B-E1 (weDo, guided) — **B**
- **Diagnosis:** tp/fp con éxito `0.67`; starter `pred_pos/pred_pos=1.0` anti-patrón bueno. Feedback≈retro “no cuentes solo predicciones”.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Precisión castiga FP de auto_match que duelen a operaciones. Contar “cuántos dije match” sin gold es teatro. Pregunta: si y_pred fuera todo 0, ¿qué imprime un motor real con tp+fp=0? Siguiente (E2): recall con fn (matches perdidos).
- **Code/output changes:** none

### S30-T4-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Numerador `tp+fn` siempre 1.0 — independent limpio. Feedback≈retro “complementa candidate recall”.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Recall pairwise mira el scorer; candidate recall mira el embudo de blocking. Un numerador que siempre da 1.0 es métrica rota, no “buen motor”. Pregunta: con tp=2, fn=0, ¿qué recall y qué te dice de umbrales? Luego (E3): agrega errores por slice accionable.
- **Code/output changes:** none

### S30-T4-B-E3 (weDo, transfer) — **B**
- **Diagnosis:** Counter + max → `['missing_phone']`; anti-fraude en límites. Feedback≈retro “hipótesis de mejora”.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Los slices convierten índices de error en backlog priorizado (más blocking, más peso a phone). Un `[]` o un índice suelto no prioriza. Pregunta: si `common_last_name` también tuviera 2 errores, ¿qué imprime? En el You Do reportarás slices en el README del portfolio.
- **Code/output changes:** none

### youDo — Motor de entity resolution testeable — cierre CP-N3-A (youDo) — **A**
- **Diagnosis:** Marco de proyecto **fuerte**: context CP-N3-A, objectives T1–T4, requirements (PII, explain, gate ético, cross_split en README), rubric con gate, portfolioNote medible, starter con stubs `NotImplementedError` y helpers ya sanos (`exact`, `block_key`, `pair_score` con missing, `decide`). **Retrospective de defensa** (~93 w) con tres preguntas + cierre sobre score 0.91 sin aportes — cumple §8.3 del spec.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective pass
- **Severity residual:** none (P2 opcional: docstring en `entity_split` que recuerde devolver/excluir `cross_split` — ya en objectives)
- **Proposed residual:** none required
- **Code/output changes:** none

---

## Priority order (Round 2 Fixer)

### P0
- **Ninguno.** Cobertura de campos y outputs canónicos están en pie; no hay unit que un newbie no pueda abordar con title/preamble/instruction/success visibles.

### P1 (pocos — metacognición fina)
1. **S30-T4-A-E1:** expandir retrospective (~21 w → 40–60) con self-check del par mixto y impacto en calibración de umbrales (texto propuesto en ledger).
2. **Opcional P1 suave:** si el Fixer toca código, **S30-T3-A-E3** — hacer el defect de normalización observable (pesos que no sumen 1) *o* documentar en feedback que con pesos unitarios el numerador ya es el score.

### P2 (calidad sistemática — batch de polish verbal)
3. **Des-eco feedback/retrospective** en las unidades marcadas B con eco: T1-A-E2, T1-B-E1, T1-B-E3, T2-A-E3, T2-B-E1, T2-B-E2, T3-A-E2, T3-B-E1, T3-B-E3, T4-B-E1, T4-B-E2, T4-B-E3 (y eco parcial en T1-B-DEMO / iDo retros cortas). Patrón: feedback = *por qué falló el starter + impacto*; retro = *principio + misconception distinto o self-check + puente*.
4. **Subir retrospectives iDo** bajo ~30 w: T1-B, T2-A, T2-B, T3-A, T3-B, T4-A, T4-B (textos de expansión propuestos donde aportan).
5. **Instruction paso 4 mental → acción o eliminación** en E1s (p. ej. T1-A-E1 “verifica mentalmente”).
6. **Hints E3** (opcional): aflojar una miga en T4-A-E3 / T1-A-E3 si se quiere más transfer puro.
7. **youDo:** opcional docstring en stub `entity_split` sobre exclusión de `cross_split` en P/R primario.

---

## Residual risks

1. **Nombre de archivo vs contenido:** `s30-security-infra.ts` / id `security-infra` sigue sin describir ER; confunde buscadores internos (no es bug de ejercicios).
2. **T3-A-E3 score-norm invisible:** con pesos que suman 1, se puede pasar arreglando solo decision+explain; riesgo de falsa maestría en normalización (mitigado parcialmente por T3-A-E1 ya fijo).
3. **Solape C(n,2):** T2-A-E3 y T2-B-E1 siguen la misma fórmula; preambles ya diferencian candidatos vs SLO — mantener esa distinción al editar.
4. **Demo T2-A vs theory T2-A:** theory muestra recall 0.0 por acentos; demo 1.0 con claves plegadas — el `why` actual ya puentea; no romper ese contraste.
5. **Retros cortas + eco:** un newbie puede “cerrar la pestaña” sin self-check en ~media de los weDo; no bloquea el drill pero debilita metacognición.
6. **You Do amplitud:** sigue siendo un capstone grande; con scaffolding verbal ya presente, el riesgo es de alcance de producto, no de “instruction opaca”.
7. **No se proponen cambios de outputs canónicos** salvo el opcional de T3-A-E3 si se re-pesan campos; cualquier cambio de código → execute-and-diff en el round de Fix.

---

## Round-1 → Round-2 delta

| Round-1 issue | Round-2 status |
|---------------|----------------|
| 0 preamble/title/retrospective en casi todo | **Cerrado** — campos presentes en 33 unidades |
| Instruction densa monobloque | **Cerrado** — pasos solo-tarea |
| T3-A-E1 defect invisible (pesos 0.5+0.5) | **Cerrado** — pesos 1.0+1.0; starter 1.5 |
| T2-A-E3 / T2-B-E1 clones verbales | **Cerrado** en preambles (candidatos vs SLO) |
| youDo sin retrospective | **Cerrado** — defensa §8.3 |
| Feedback 1 frase sin impacto | **Mejorado** — la mayoría razona cola/SLO/ética |
| Eco feedback≈retro | **Abierto** (P2 sistemático) |
| Retros &lt; 40 palabras | **Abierto** (P2; 1 caso P1 fino en T4-A-E1) |
| T3-A-E3 score-norm | **Nuevo residual** (parcial; no estaba en R1 como issue de código compuesto) |

## Counts for Fixer (Round 2)

| Tipo | N | Campos core | Residual R2 |
|------|---|-------------|-------------|
| iDo | 8 | preamble/why/retro presentes | 7 retros cortas (P2) |
| weDo | 24 | title/preamble/instruction/feedback/retro presentes | ~12–14 ecos; 1 retro P1 fina; T3-A-E3 integridad P2 |
| youDo | 1 | retrospective defensa OK | none required |
| **Total units** | **33** | cobertura **pass** | polish verbal + 1 integridad opcional |

**Código de práctica:** maduro (defects nombrados, fade real, T3-A-E1 observable, gate ético).  
**Prosa de andamiaje:** presente y usable; residual = **calidad** (no ausencia).  
**Acción del Fixer R2:** reescribir a mano solo residuales propuestos; preservar outputs salvo T3-A-E3 si se adopta re-peso; sin generadores.

Section 30 exercise pedagogy review complete. Ready for the Fixer prompt.
