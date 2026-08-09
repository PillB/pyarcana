# S18 Exercise Pedagogy Report (Round 2)

## Section
- **title:** EDA, estadística descriptiva e incertidumbre
- **shortTitle:** EDA e incertidumbre
- **id:** `data-engineering` (archivo `s18-data-engineering.ts`; contenido = EDA + incertidumbre, no ETL clásico)
- **index:** 18
- **source:** `src/lib/course/sections/s18-data-engineering.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades)
- **subtemas:** T1-A centro/cuantiles · T1-B robustez/escalas · T2-A sesgo muestral · T2-B IC/efecto/bootstrap · T3-A correlación sin causalidad · T3-B segmentos/Tukey · T4-A Q→H→E / P→M→V→L · T4-B notas de datos
- **hilo:** CASO-LIM-018 / incremento **CP-N2-B** (inicio tras S17; puente dashboard S19)
- **Round 1 context:** `round1/S18_EXERCISE_PEDAGOGY_REPORT.md` (solo contraste; **no** rubber-stamp)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (preamble/retrospective checklists, E1→E3 fade, length targets, anti-aberration).
- Manually re-inspected **current** source for every `iDo.steps[]`, `weDo.steps[]`, and `youDo` (title, preamble, instruction, feedback, retrospective, starter DEFECT, solution output, why).
- Executed integrity traps live: (1) T3-A-E1 `corrcoef(y,y)` vs `corrcoef(x,y)` both print `r 1.0`; (2) T3-B-E3 bilateral vs unilateral produce identical flags on current fixture; (3) T4-B-E2 sha1 `2aa26ec9` matches payload with real newlines.
- Scored for a **true newbie** (what / why / success / what sticks), independent of Round-1 proposals.
- Word counts measured only as gates (no bulk prose generation).
- No generators, bulk templates, or source edits.

## Global findings (post Round-1 fix)

| Area | Status | Residual impact |
|------|--------|-----------------|
| **Field coverage** | Complete: 8 iDo con `preamble`+`why`+`retrospective`; 24 weDo con `title`+`preamble`+`instruction`+`feedback`+`retrospective`; youDo con `retrospective` + marco sólido | Round-1 P0 “cero campos” **cerrado** |
| **We Do titles** | Presentes, 4–8 palabras, español PE, alineados al skill | Pass |
| **Preamble shape** | weDo en bullets contexto/meta/éxito/límites; iDo narrativos con predicción | Pass en estructura; bullets a menudo &lt;80 palabras (aceptable por spec “4 short bullets”) |
| **Instruction = steps** | Solo-tarea, ordenados; E1 nombra DEFECT; E2/E3 menos migas | Pass |
| **E1→E2→E3 fade** | Superficies distintas por subtema (n/mean/median → IQR → dict; share → bias → max_bias; Pearson → Spearman → residuales; etc.) | Pass — no clones numéricos |
| **Feedback vs retrospective** | Feedback suele razonar el bug; en **~8** unidades el retro **repite** el feedback casi literal (misconception duplicado, sin metacognición extra) | Residual **P2** sistemático |
| **Retrospective length** | Mediana weDo ≈24–33 palabras (spec 40–80); principio + puente suelen estar; a menudo falta self-check o misconception *distinto* del feedback | Residual **P2** |
| **iDo why** | Casi todos en 40–90; T3-A / T3-B / T4-A / T4-B un poco cortos (33–39) | Residual **P2** leve |
| **Código/outputs** | Coherentes con theory y hilo sintético; seeds documentados | **Un hueco de integridad de aprendizaje:** T3-A-E1 (wrong≈right por output). **Un hueco de verificación débil:** T3-B-E3 (unilateral pasa) |
| **youDo frame** | context CP-N2-B, objectives, requirements, 6 checkpoints, rubric, portfolioNote, retrospective de defensa | Pass; starter aún generoso (mitigado por retro de defensa) |

**Net:** Round 1 cerró el vacío sistemático de prosa verbal. Round 2 no es rubber-stamp: la sección está **lista para learner** en la gran mayoría de unidades; residuales son **calidad** (eco feedback/retro, retros cortas) y **dos defectos de integridad** en correlación Pearson (E1) y máscara Tukey bilateral (E3).

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

### S18-T1-A-DEMO (iDo) — **A**
- **Diagnosis:** Worked example sólido: lognormal + outliers 400/450; dict con n/mean/median/std/cuantiles/IQR. Preamble pide predicción mean vs median y ancla CP-N2-B. `why` (~61 w) en rango. Retrospective repara “solo la media” y puente a We Do.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S18-T1-A-E1 (weDo, guided) — **A**
- **Diagnosis:** Modelo We Do post-fix: title claro; bullets con éxito exacto `n 5` / `mean 30.4` / `median 14.0`; instruction nombra bug; feedback razona auditabilidad de n; retro distingue trio mínimo y apunta a E2 IQR. DEFECT bien nombrado.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: retro ~33 w → +1 self-check “¿por qué n en el print y no solo en el chat?”)
- **Proposed residual:** none required
- **Code/output changes:** none

### S18-T1-A-E2 (weDo, independent) — **B+**
- **Diagnosis:** p10/p90 disfrazados de cuartiles — defecto excelente. Preamble ancla “cuerpo vs colas”. Feedback y retro se solapan en “confundir p10/p90 con cuartiles distorsiona el memo”.
- **Checklist:** all pass; retro partial (eco del feedback)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  IQR es el contrato de dispersión del *cuerpo* sin asumir normalidad; p10/p90 se reportan aparte como cola. El error clásico es etiquetar colas como “Q1/Q3” en el slide. Pregunta: si el negocio pide “rango típico del ticket”, ¿das IQR o p10–p90? Luego (E3) empaquetas n/mean/median/std en un dict reutilizable.
- **Code/output changes:** none

### S18-T1-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Transfer real a `resumen(x)` de portafolio; éxito dict exacto con `ddof=1`; feedback nombra std poblacional; retro con self-check sobre n en el dict. Buen fade desde E1/E2.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S18-T1-B-DEMO (iDo) — **A−**
- **Diagnosis:** Mean 38.88 vs median 16, MAD 1, ratio 2.43, log1p_median. Preamble motiva outlier 200 y escala. Retrospective correcta pero corta (~28 w); `why` en rango.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Si mean ≫ median, prioriza robustez y declara la cola en el memo; no vendas la media como ticket típico. El error clásico es “el cliente promedio gasta ~39 PEN” cuando el mediano está en 16. We Do: ratio, MAD y log1p honestas con ceros.
- **Code/output changes:** none

### S18-T1-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Ratio invertido bien diseñado; éxito observable. Feedback y retro casi clonan “ratio ≫ 1 grita cola / invertido achica el aviso”.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  El semáforo mean/median es un hábito de *lectura* de forma, no un KPI de campaña. Si lo inviertes, el outlier de 100 “tranquiliza” el slide. Pregunta de cierre: con ratio 2.43, ¿reportas mean o median como “típico”? Siguiente: MAD sin anclar en mean.
- **Code/output changes:** none

### S18-T1-B-E2 (weDo, independent) — **B**
- **Diagnosis:** MAD vs mean abs dev — pedagogía excelente. Feedback y retro repiten “mediana dos veces / no es mean abs dev”.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  MAD es un contrato de robustez: cambia el ancla *y* el agregador. El error clásico es “casi igual que mean abs, da igual”. Con el 100, no da igual. Luego (E3): log1p con ceros sin mentir en soles PEN.
- **Code/output changes:** none

### S18-T1-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** Transfer a log1p con cero; éxito lista canónica; límites de comunicación de escala en preamble y feedback; retro con self-check PEN vs log. Puente a T2 bien puesto.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S18-T2-A-DEMO (iDo) — **A−**
- **Diagnosis:** Sesgo de cuota Lima 0.7, max_abs_bias 0.2, cobertura LIMITADA. Preamble con predicción “¿generalizas a todo Perú?”. Retro corta pero repara “sesgo ≠ error aritmético”.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Sesgo de selección ≠ error aritmético: un mean impecable sobre muestra sesgada sigue siendo local a la muestra. Si max |bias| > umbral, el KPI no es “todo el Perú”. We Do: share, signo del bias_pp y `max_bias` de portafolio.
- **Code/output changes:** none

### S18-T2-A-E1 (weDo, guided) — **B**
- **Diagnosis:** count Arequipa vs Lima — micro-E1 claro. Feedback y retro comparten “bug de negocio silencioso”.
- **Checklist:** all pass; retro partial (eco + corta)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Share = conteo/n es el ladrillo de la nota de cobertura. Un share “correcto” de la región equivocada pasa el test de aritmética y falla el de negocio. Pregunta: ¿por qué no basta con `Counter` bonito si la clave está mal? Siguiente: el *signo* del bias_pp.
- **Code/output changes:** none

### S18-T2-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Orden share − pob invertido — defecto clásico. Feedback y retro clonan “invertir miente en el memo / signo = dirección”.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  bias positivo = sobremuestreo de esa región en la muestra. Si inviertes la resta, el memo dice “falta Lima” cuando sobra Lima. El hábito es share − pob, siempre. Luego (E3): el *peor* |bias| decide LIMITADA/OK, no el promedio.
- **Code/output changes:** none

### S18-T2-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** `max_bias` de portafolio; éxito `0.4`; feedback nombra max vs min/promedio; retro con self-check “¿todo el Perú?” y puente a IC. Transfer auténtico.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S18-T2-B-DEMO (iDo) — **A**
- **Diagnosis:** Demo densa bien guiada: diff, IC z que cruza 0, d, bootstrap, nota `no_probado`. Preamble ordena qué mirar (IC cruza 0). `why` repara “probado al 95%” y “rango del 95% de los datos”. Excelente para densidad cognitiva del subtema.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none (seed 21; no regenerar)

### S18-T2-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Olvidar /√n — bug clásico. Feedback y retro muy solapados (jaccard alto): “dispersión vs error del estimador / IC = media ± margen”.
- **Checklist:** all pass; retro partial (eco fuerte)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  El SE del estimador se encoge con √n; la std de los datos no. El error clásico es dibujar un “IC” tan ancho como 1.96·s y asustar al negocio sin causa. Pregunta: si n pasa de 16 a 64, ¿qué pasa con el margen? Siguiente: d de Cohen con orden B−A.
- **Code/output changes:** none

### S18-T2-B-E2 (weDo, independent) — **A−**
- **Diagnosis:** Orden A/B en d; límites “no interpretes d como probado”. Feedback razona el signo; retro corta pero distinta (tamaño ≠ campaña).
- **Checklist:** all pass; retro partial (longitud ~22 w)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  d habla de magnitud estandarizada, no de decisión de campaña ni de “probado”. Invertir grupos voltea el relato del efecto. Pregunta: con d=1.5 y n chico, ¿qué más reportas además del punto? Luego (E3): bootstrap cuando z es dudoso.
- **Code/output changes:** none

### S18-T2-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** Bootstrap de la media con seed 42, B=100; éxito canónico `boot_ic95 (10.89, 31.17)`; límites anti-reinicio de rng y anti-“rango del 95% de x”. Feedback y retro alineados pero no idénticos. Transfer fuerte.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none (seed-dependent; no tocar)

### S18-T3-A-DEMO (iDo) — **A−**
- **Diagnosis:** r_raw ~0.97 → residual ~0.17; Spearman monótono 1.0; claim ético. Preamble excelente (campaña automática solo con r_raw?). `why` un poco corto (~37 w); retro sólida.
- **Checklist:** all pass; why partial (bajo piso 40)
- **Severity residual:** P2
- **Proposed why (expand ~+15 w):**  
  Residualizar es un control exploratorio, no una prueba causal: r cae cuando Z era el confusor. Spearman captura asociaciones monótonas no lineales vía rangos. El claim `asociacion_observada_no_causal` protege el portafolio de lenguaje de fraude o causa automática. En CP-N2-B ese claim es tan importante como el número.
- **Code/output changes:** none

### S18-T3-A-E1 (weDo, guided) — **D**
- **Diagnosis:** El bug `corrcoef(y, y)` es pedagógicamente brillante en intención, pero **el éxito observable no discrimina**: con x=[1..4], y=[2,4,6,8], tanto el starter como la solución imprimen `r 1.0`. Un newbie puede “pasar” sin tocar el código (o el autograder de salida no detecta el DEFECT). Feedback/retro clonan “tautología”.
- **Checklist:** context pass · goal pass · **success fail (wrong≈right)** · constraints pass · retrospective partial
- **Severity residual:** **P1** (integridad de aprendizaje)
- **Proposed residual prose:**  
  - Mantener title/preamble de escena “r=1 en el slide puede ser y consigo misma”.  
  - **Cambiar fixture** para que el r correcto ≠ 1.0 (ver código abajo).  
  - Ajustar éxito y retrospective.
- **Proposed preamble (tweak éxito):**  
  - **Contexto:** un r=1 en el slide puede ser un bug de correlacionar la serie consigo misma.  
  - **Meta:** Pearson de x con y a 3 decimales.  
  - **Éxito:** `r 0.934` con x=[1,2,3,4], y=[2,5,5,10] (el starter con y,y sigue imprimiendo 1.0 y **falla**).  
  - **Límites:** usa `corrcoef(x, y)[0,1]`; no borres x.
- **Proposed retrospective (replace):**  
  Correlacionar y con y siempre da 1: es tautología, no hallazgo. Si tu salida es 1.0 y el fixture no es lineal perfecto, sospecha los argumentos. Revisa siempre los dos vectores. Siguiente: Spearman monótono por rangos.
- **Code/output changes:** **sí — execute-and-diff justificado**

```python
# starter (bug): corrcoef(y, y)
import numpy as np
x = np.array([1, 2, 3, 4], dtype=float)
y = np.array([2, 5, 5, 10], dtype=float)
print("r", round(float(np.corrcoef(y, y)[0, 1]), 3))  # → r 1.0 (falla vs solution)

# solution
print("r", round(float(np.corrcoef(x, y)[0, 1]), 3))  # → r 0.934
```

- **Validation notes:** Verificado en runtime: wrong=1.0, right≈0.934. Actualizar `output` del solution a `r 0.934` y la línea de éxito en preamble.

### S18-T3-A-E2 (weDo, independent) — **A−**
- **Diagnosis:** Pearson crudo etiquetado spearman — excelente. Feedback y retro solapan “confundir etiqueta y método”. Contenido sólido.
- **Checklist:** all pass; retro partial (eco leve)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Spearman resume asociación *monótona*; sigue siendo observación, no causa. El error de auditoría es imprimir Pearson con etiqueta spearman: el revisor cree que usaste rangos. Pregunta: si y = x², ¿esperas Spearman 1 y Pearson &lt;1? Luego: residualizar un confusor Z.
- **Code/output changes:** none

### S18-T3-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Residualizar confusor + claim; seed 1; éxito r_raw/r_residual/claim. Instruction transfer-apropiada; ética alineada a theory. No tocar seeds.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none (seed-dependent)

### S18-T3-B-DEMO (iDo) — **A−**
- **Diagnosis:** Tukey + tasas por región + `sin_claim_causal`. Preamble “describe, no acusa”. Retro corta (~22 w) pero mensaje ético correcto. `why` ~38 w.
- **Checklist:** all pass; retro/why partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Anomalía univariada ≠ causa ni fraude automático. Siempre método + n + límites de segmento. El error clásico es “Cusco tiene más flags → culpable”. We Do: cerca 1.5, tasa solo en Lima, máscara bilateral.
- **Code/output changes:** none

### S18-T3-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Multiplicador 0.5 vs 1.5; éxito `n_hi 1`; flag ≠ fraude en límites. Feedback/retro eco “0.5 inventa outliers / candidatos a revisión”.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  El contrato Tukey del runbook es 1.5·IQR; bajar a 0.5 es inventar un método distinto sin documentarlo. Los flags son candidatos a revisión humana. Pregunta: si n_hi se dispara, ¿miras primero el multiplicador o acusas al canal? Siguiente: tasa solo en Lima.
- **Code/output changes:** none

### S18-T3-B-E2 (weDo, independent) — **A**
- **Diagnosis:** Tasa global vs solo Lima; fixture de 3 filas hace visible el error (global ~0.67 vs Lima 1.0). Feedback razona mezcla de regiones; retro de cohorte. Buen independent.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S18-T3-B-E3 (weDo, transfer) — **C**
- **Diagnosis:** Meta bilateral correcta en prosa, pero el **fixture solo tiene outlier alto** (100). Con lo/hi actuales, `(m > hi)` y `(m < lo) | (m > hi)` producen **la misma lista** `[False, False, False, False, True]`. Un learner que omite la cerca inferior “pasa” el output check. Starter `print([])` sí falla hasta completar algo, pero no fuerza bilateralidad.
- **Checklist:** context pass · goal pass · **success partial (no discrimina bilateral)** · constraints pass · retrospective pass
- **Severity residual:** **P1** (verificación débil del skill transfer)
- **Proposed residual:**  
  - Añadir un valor bajo fuera de cerca (p. ej. `-20` o `0` si lo queda por encima) para que unilateral y bilateral difieran.  
  - Actualizar éxito y output a una lista con al menos un `True` bajo y uno alto.
- **Proposed preamble (tweak éxito; ejemplo):**  
  - **Contexto:** el portafolio marca outliers altos *y* bajos; solo `m > hi` pierde la cola inferior.  
  - **Meta:** booleans fuera de [lo, hi] como lista.  
  - **Éxito:** p. ej. `[True, False, False, False, True]` con un valor muy bajo y un 100 (unilateral solo marcaria el alto).  
  - **Límites:** bilateral; flag ≠ fraude ni culpa de región.
- **Proposed instruction tweak:**  
  1. lo/hi ya calculados.  
  2. `(m < lo) | (m > hi)` — **ambas** cercas.  
  3. `.tolist()` e imprime.  
  4. No cambies el array ni las cercas.
- **Code/output changes:** **sí — fixture + output**

```python
# ejemplo de fixture que discrimina (verificar cuantiles antes de fijar output)
m = np.array([-20.0, 2.0, 3.0, 4.0, 100.0])
# solution: print(((m < lo) | (m > hi)).tolist())
# unilateral m>hi NO debe coincidir con la lista canónica
```

- **Validation notes:** Fixer debe re-ejecutar quantiles con el array final y pegar el output exacto; no inventar la lista sin correr numpy.

### S18-T4-A-DEMO (iDo) — **A−**
- **Diagnosis:** Q→H→E con `decision: None`. Preamble fija el hábito “no saltar de mediana a campaña”. Retro corta; `why` ~39 w (borde).
- **Checklist:** all pass; retro/why partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Si puedes defender por qué `decision` es None con un hallazgo numérico claro, ya separas capas de calidad. El error clásico es rellenar decisión con una campaña “porque la mediana es mayor”. We Do: clave pregunta, umbral hallazgo vs. candidato, traza P→M→V→L.
- **Code/output changes:** none

### S18-T4-A-E1 (weDo, guided) — **A−**
- **Diagnosis:** Print de hipótesis vs pregunta — micro-capa. Éxito string exacto. Feedback/retro eco moderado “mezclar capas confunde el memo”.
- **Checklist:** all pass; retro partial (eco leve)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  La traza empieza por la pregunta de negocio; la hipótesis es una apuesta testeable distinta. Si imprimes la hipótesis en el bloque “pregunta”, el revisor no sabe qué se estaba midiendo. Siguiente: etiquetar solo_hallazgo vs. candidato_decision.
- **Code/output changes:** none

### S18-T4-A-E2 (weDo, independent) — **A**
- **Diagnosis:** Umbral invertido; éxito `solo_hallazgo`; límites anti-campaña automática. Feedback y retro refuerzan “candidato ≠ decisión” sin ser clones totales. Bien calibrado E2.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: edge `median == 15` no se practica; documentar en edgeCases ya existe)
- **Proposed residual:** none required
- **Code/output changes:** none

### S18-T4-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Traza P→M→V→L; L de cobertura “solo web”; self-check en retro sobre canal app. Transfer de portafolio limpio.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S18-T4-B-DEMO (iDo) — **A**
- **Diagnosis:** Nota con filtro, seed 18, sha1_8, n 5→4, median_final. Preamble de auditoría; `why` ancla orden por ticket_id y puente S19. Retro “sin actualizar hash la nota miente”.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: expandir why a ~45 w)
- **Proposed residual:** none required
- **Code/output changes:** none

### S18-T4-B-E1 (weDo, guided) — **A−**
- **Diagnosis:** Note vacío → tres claves; éxito dict exacto. Prosa clara; retro corta pero útil (n_raw vs n_final).
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  n_raw vs. n_final hace visible la pérdida por filtro; sin lista de filtros nadie reproduce el corte. El error clásico es copiar n del raw al final “porque casi no filtramos”. Siguiente: huella SHA-1 de 8 hex.
- **Code/output changes:** none

### S18-T4-B-E2 (weDo, independent) — **A**
- **Diagnosis:** md5 completo vs sha1[:8]; payload con chr(10) bien documentado; éxito `2aa26ec9` verificado. Feedback técnico sólido; retro de contrato algoritmo/longitud + orden de filas. Independent bien calibrado.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S18-T4-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** Nota post-filtro con seed 42; éxito dict; feedback n_final≠n_raw; retro puente a You Do. Cierra el hilo hacia S19.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### youDo (proyecto CP-N2-B inicio) — **A**
- **Diagnosis:** Marco fuerte: context fintech sintética, objectives alineados a LOs, requirements con 5 piezas auditables, starter con 6 checkpoints (filtro, resumen, bias, IC, claim, nota), rúbrica, portfolioNote, **retrospective de defensa** presente (~82 w) con n/métrica/cobertura, z vs bootstrap, ética flag/r, README de impacto y sha1_8. El starter sigue parcialmente relleno (checkpoints 2/4/5 con huecos) — intencional y mitigado por rúbrica + retro; no vaciar sin rediseño.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective pass
- **Severity residual:** none (P2 opcional: dejar p90 y el bloque Pearson más vacíos si se quiere menos “descomentar”; no bloqueante)
- **Proposed residual:** none required
- **Code/output changes:** none

---

## Priority order

### P1 (Fixer primero — integridad)
1. **S18-T3-A-E1** — cambiar fixture y, y output a r ≠ 1.0 para que `corrcoef(y,y)` falle el éxito; actualizar preamble éxito + solution output + feedback si cita `1.0` como hallazgo correcto.  
2. **S18-T3-B-E3** — añadir outlier bajo al array; re-ejecutar Tukey; fijar lista canónica que **falle** si solo se usa `m > hi`; actualizar preamble éxito + solution output.

### P2 (polish — eco feedback/retro y longitud)
Orden sugerido (mayor eco o mayor impacto metacognitivo primero):

1. **T2-B-E1** — retro casi clona feedback (dispersión vs SE).  
2. **T1-B-E1**, **T1-B-E2** — clonan semáforo/MAD.  
3. **T2-A-E1**, **T2-A-E2** — “bug silencioso” / “invertir miente”.  
4. **T3-A-E1** (prosa tras fix de fixture), **T3-A-E2**, **T3-B-E1**, **T4-A-E1**.  
5. **T1-A-E2** — eco p10/p90.  
6. **iDo cortos:** T1-B, T2-A, T3-B, T4-A retrospectives (+ why T3-A si cabe).  
7. **weDo retros &lt;30 w** en general: expandir a 40–80 con principio + misconception *distinto* del feedback + transfer/self-check (sin essays).

No priorizar regeneración de seeds ni reescritura masiva de instructions (ya son solo-tarea).

### None / leave alone
- T1-A-DEMO, T1-A-E1, T1-A-E3, T1-B-E3, T2-A-E3, T2-B-DEMO, T2-B-E3, T3-A-E3, T3-B-E2, T4-A-E2, T4-A-E3, T4-B-DEMO, T4-B-E2, T4-B-E3, youDo — **A** sin fix obligatorio.

---

## Residual risks

1. **T3-A-E1 wrong≈right:** si no se arregla, el autograder por salida y el learner “satisfecho con r=1” invalidan el skill de revisar argumentos de `corrcoef`.  
2. **T3-B-E3 unilateral stealth-pass:** el transfer “bilateral” queda solo en la instrucción, no en el criterio de éxito.  
3. **Eco feedback/retro:** no bloquea aprendizaje, pero reduce el valor metacognitivo del panel de solución (spec: principle + misconception + transfer).  
4. **Densidad T2-B / T3-A:** preambles ya unifican un goal; no re-enseñar toda la theory al expandir retros.  
5. **Outputs seed-dependent** (demo T2-B seed 21, E3 bootstrap seed 42, E3 residuales seed 1, demo T1-A seed 18): Fixer **no** regenera números ni seeds.  
6. **id `data-engineering`:** prosa ya es EDA; no reescribir id en este round.  
7. **You Do starter generoso:** riesgo “solo descomentar” en IC/Pearson; retrospective de defensa mitiga; no vaciar sin rediseño de rúbrica.  
8. **Anti-aberration:** cualquier expand de retro debe ser **hand-written** por unidad; no plantilla “El error clásico es X. Siguiente: Y” pegada 24 veces.

---

## Summary for Fixer

| Unidad tipo | N | Estado post-R1 | Acción Round 2 |
|-------------|---|----------------|----------------|
| iDo | 8 | preamble+why+retro presentes | P2: alargar 3–4 retros cortas; expandir why T3-A si cabe |
| weDo | 24 | title+preamble+instruction+retro presentes | **P1:** T3-A-E1 fixture/output; T3-B-E3 fixture/output. **P2:** ~10 retros que clonan feedback |
| youDo | 1 | retrospective de defensa OK | none obligatorio |
| código/outputs | — | en general intactos | **solo** T3-A-E1 y T3-B-E3 (execute-and-diff) |

Tone gold de referencia (no copiar contenido): S26, S30, S33, S50. Prosa learner-facing: **español profesional peruano**, sin PII real, hilo **CASO-LIM-018 / CP-N2-B → S19**.

**Anti-aberration checklist (este report):**  
- [x] Re-lectura manual de cada unidad en el source *actual*  
- [x] Sin rubber-stamp de propuestas Round 1  
- [x] Sin generadores / bulk templates de prosa  
- [x] Integridad verificada en runtime (corrcoef, Tukey, sha1)  
- [x] Sin edición del source en Round 2  

---

Section 18 exercise pedagogy review complete. Ready for the Fixer prompt.
