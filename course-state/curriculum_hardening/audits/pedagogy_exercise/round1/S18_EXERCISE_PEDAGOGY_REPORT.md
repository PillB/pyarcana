# S18 Exercise Pedagogy Report (Round 1)

## Section
- **title:** EDA, estadística descriptiva e incertidumbre
- **shortTitle:** EDA e incertidumbre
- **id:** `data-engineering` (archivo `s18-data-engineering.ts`; contenido = EDA + incertidumbre, no ETL clásico)
- **index:** 18
- **source:** `src/lib/course/sections/s18-data-engineering.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades de práctica/demo)
- **subtemas:** S18-T1-A centro/cuantiles · T1-B robustez/escalas · T2-A sesgo muestral · T2-B IC/efecto/bootstrap · T3-A correlación sin causalidad · T3-B segmentos/Tukey · T4-A Q→H→E / P→M→V→L · T4-B notas de datos
- **hilo de caso:** CASO-LIM-018 / incremento **CP-N2-B** (inicio: EDA honesto tras dataset limpio de S17; puente a dashboard S19)

## Method
- Leído `PEDAGOGY_EXERCISE_SPEC.md` (campos, longitudes, checklist preamble/retrospective, fade E1→E2→E3).
- Inspeccionado manualmente cada `iDo.steps[]`, `weDo.steps[]` y `youDo` en `s18-data-engineering.ts` (demos ~369–635, weDo ~637–1523, youDo ~1525–1628).
- Contrastado con el hilo de la sección: tickets sintéticos Lima/Arequipa/Cusco, montos PEN, hallazgo ≠ hipótesis ≠ decisión, IC z vs. bootstrap, Tukey ≠ fraude, nota de datos con seed y huella.
- **Sin** generadores, bucles, plantillas ni copy-paste mecánico entre unidades.
- Prosa propuesta en **español profesional peruano**, un objetivo primario por unidad.

## Hallazgos transversales (antes del ledger)

| Campo / hábito | Estado actual en S18 |
|----------------|----------------------|
| I Do `preamble` | **Ausente** en las 8 demos |
| I Do `retrospective` | **Ausente** en las 8 demos |
| I Do `description` | Presente y clara (qué hace el demo); no sustituye preamble formal |
| I Do `why` | Presente pero **corto** (1 frase; bajo el piso 40–90 palabras del spec) |
| We Do `title` | **Ausente** en los 24 (solo prefijo “E1/E2/E3 …” dentro de `instruction`) |
| We Do `preamble` | **Ausente** en los 24 |
| We Do `retrospective` | **Ausente** en los 24 |
| We Do `instruction` | Estilo “**E_n (kind) — corrige bug / completa X. Fixture…**”: meta + éxito mezclados; legible para quien ya hace EDA, **opaco** para newbie sin escena de negocio |
| We Do `feedback` | Una o dos líneas; a menudo nombra el bug pero poco *razonamiento* de por qué el hábito importa en CP-N2-B |
| Starter `# Bug a corregir:` | **Excelente** hábito en casi todos; defectos bien nombrados y alineados a la solución |
| Hints | Útiles; en E1 casi-solución (aceptable); en E3 a veces spoiling (aceptable como andamiaje mínimo) |
| You Do marco | `context` / `objectives` / `requirements` / `rubric` / `portfolioNote` / starter **sólidos** |
| You Do `retrospective` | **Ausente** |
| Código / outputs | Coherentes con theory y hilo sintético; **no** proponer cambios de output salvo notas puntuales |

**Patrón dominante:** el andamiaje de *código* (arrays sintéticos, bugs nombrados, outputs canónicos, fade real E1→E3 por subtema) es maduro y alineado a CP-N2-B. El andamiaje *pedagógico verbal* (preamble → instruction solo-tarea → retrospective) no existe. Un true newbie no responde con claridad: qué practico, por qué importa en un EDA de fintech sintética, cómo sé que gané, qué debe quedarme al cerrar la pestaña.

**Fade E1→E2→E3 (contenido):** progresión real por subtema (p. ej. T1-A: n/mean/median → Q1/Q3/IQR → dict `resumen`; T2-B: margen SE → Cohen d → bootstrap; T3-A: Pearson → Spearman → residualizar confusor). **No** son tres clones con números distintos. El fade de *prosa* no se ve porque no hay preambles diferenciados.

**Severity default:** missing preamble+title+retrospective en We Do = **P0**; I Do sin preamble/retrospective = **P1** (aún tienen description+why+código); youDo sin retrospective = **P1**; polish de feedback/why = **P2** si caen preamble/instruction/retrospective.

---

## Unit ledger

### S18-T1-A-DEMO (iDo)
- **Diagnosis:** Demo sólida de resumen de montos lognormales + outliers (n=92): mean 30.5 vs. median 20.02 y cuantiles. La `description` nombra el skill; falta `preamble` que diga *qué observar* (mean ≫ median por cola) y `retrospective` del misconception “el ticket típico es la media”. El `why` es una frase.
- **Checklist:** context fail · goal partial · success partial (output visible) · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Antes de escribir un slide de “ticket promedio” para CP-N2-B, el analista debe *ver* la forma de la distribución. En esta demo generamos montos sintéticos (lognormal + dos outliers de 400 y 450 PEN) y un dict con n, mean, median, std muestral, cuantiles e IQR. No escribas aún: predice si mean y median coincidirán; luego compara con la salida. Si confundes “típico” con media, el memo de negocio miente sobre el cliente mediano.
- **Proposed instruction/description improvements:**  
  Mantener description. Ampliar `why` (~50–70 palabras): n siempre va con el resumen; mean se infla con cola; median/Q50 es el ticket típico; IQR y p90 documentan dispersión y cola sin asumir normalidad; puente a We Do donde se corrigen resúmenes incompletos.
- **Proposed retrospective:**  
  Si puedes explicar por qué mean 30.5 y median ~20 no se contradicen (cola + outliers), ya tienes el hábito de centro dual. El error clásico es reportar solo la media. En We Do practicarás n/mean/median, IQR y un dict reutilizable de portafolio.
- **Code/output changes:** none
- **Validation notes:** Output canónico alineado a theory T1-A.

---

### S18-T1-A-E1 (weDo, guided)
- **Diagnosis:** Drill guiado claro: starter solo imprime mean; falta n y median. Instruction nombra fixture y éxito pero mezcla meta/pasos; sin title, preamble ni retrospective. Feedback de una línea no repara “¿para qué sirve n?”.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Reportar n, mean y median juntos
- **Proposed preamble:**  
  - **Contexto:** en el resumen de un lote de tickets sintéticos de CP-N2-B, un solo `mean` sin n ni median es un hallazgo incompleto.  
  - **Meta:** completar el contrato mínimo de centro: n, mean y median.  
  - **Éxito:** tres líneas `n 5`, `mean 30.4`, `median 14.0` con el array del starter.  
  - **Límites:** no inventes datos; no omitas etiquetas; no borres el array sintético.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: solo imprime `mean` (bug nombrado).  
  2. Añade `print` de `n` con `montos.size` (o `len`).  
  3. Añade `median` con `np.median`.  
  4. Redondea mean a 2 decimales; imprime solo las tres etiquetas pedidas.
- **Proposed feedback improvement:**  
  n documenta tamaño; mean se mueve con el 100; median 14 es el ticket típico. Un EDA sin n no es auditable: nadie sabe sobre cuántas filas se basó el número.
- **Proposed retrospective:**  
  El trio n + mean + median es el mínimo de un hallazgo de distribución. El error clásico es “solo la media del día”. Siguiente (E2): cuantiles Q1/Q3 e IQR para dispersión.
- **Code/output changes:** none
- **Validation notes:** DEFECT bien nombrado; solution y output correctos.

---

### S18-T1-A-E2 (weDo, independent)
- **Diagnosis:** Buen foco independiente: percentiles 10/90 disfrazados de cuartiles. Instruction densa; falta anclar por qué IQR (no p10–p90) es el contrato de dispersión del curso. Sin preamble/title/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Q1, Q3 e IQR correctos
- **Proposed preamble:**  
  - **Contexto:** el negocio pregunta “cuánto se dispersa el ticket típico”; p10/p90 miden colas, no el IQR de cuartiles.  
  - **Meta:** calcular Q1 (p25), Q3 (p75) e IQR = Q3−Q1.  
  - **Éxito:** `Q1 8.5`, `Q3 12.5`, `IQR 4.0` con el array del starter.  
  - **Límites:** no uses 0.10/0.90 como si fueran cuartiles; redondea a 2 decimales.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: `np.quantile(..., [0.10, 0.90])` (bug).  
  2. Cambia a `[0.25, 0.75]`.  
  3. Imprime Q1, Q3 e IQR con las etiquetas exactas.  
  4. No alteres el array de montos.
- **Proposed retrospective:**  
  IQR describe el “cuerpo” central sin asumir normalidad. Confundir colas (p10/p90) con cuartiles distorsiona el memo de dispersión. Luego (E3) empaquetas n/mean/median/std en un dict reutilizable.
- **Code/output changes:** none
- **Validation notes:** E2 con menos migas que E1; éxito observable intacto.

---

### S18-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transferencia real a función `resumen` de portafolio. Instruction ya lista claves y `ddof=1`; falta escena de reutilización en notebook y cierre metacognitivo. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Dict resumen reutilizable del portafolio
- **Proposed preamble:**  
  - **Contexto:** en CP-N2-B copiar prints sueltos no escala; el notebook necesita una función de resumen.  
  - **Meta:** implementar `resumen(x)` → dict con n, mean, median, std muestral.  
  - **Éxito:** sobre `[1,2,3,4,5]` imprime `{'n': 5, 'mean': 3.0, 'median': 3.0, 'std': 1.5811}`.  
  - **Límites:** `ddof=1` (muestra); redondeo a 4 decimales; no devuelvas `{}` vacío.
- **Proposed instruction/description improvements:**  
  1. Completa el cuerpo de `resumen` (starter devuelve `{}`).  
  2. Convierte a array float; calcula n, mean, median, std(ddof=1).  
  3. Redondea numéricos a 4 decimales; n como int.  
  4. Deja el `print(resumen([...]))` de prueba.
- **Proposed retrospective:**  
  Un dict con contrato fijo es el artefacto que alimenta tablas y notas de datos. El error clásico es std poblacional (ddof=0) en muestra. Pregunta de cierre: ¿por qué reportas n dentro del dict y no solo en el markdown?
- **Code/output changes:** none
- **Validation notes:** Transfer auténtico; alineado a demo T1-A.

---

### S18-T1-B-DEMO (iDo)
- **Diagnosis:** Worked example claro: mean 38.88 vs. median 16, MAD 1, ratio 2.43, log1p_median. Description OK; falta preamble que motive “típico vs. outlier de 200” y retrospective del misconception “log convierte soles a soles comparables”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Cuando un ticket de 200 PEN se cuela entre montos ~15, la media deja de ser “típico”. Esta demo compara mean, median, MAD y el ratio mean/median, y muestra la mediana en escala `log1p`. No escribas: observa cómo el ratio > 2 avisa cola y por qué log1p no borra la necesidad de declarar la escala. Datos sintéticos, sin PII.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: MAD ancla en mediana; ratio mean/median es un semáforo de cola; log1p reduce asimetría visual pero no se reporta como diferencia en PEN sin antitransformar.
- **Proposed retrospective:**  
  Si mean ≫ median, prioriza robustez y declara la cola. El error clásico es vender la media como ticket típico. We Do: ratio, MAD y transformación log1p honestas.
- **Code/output changes:** none

---

### S18-T1-B-E1 (weDo, guided)
- **Diagnosis:** Bug invertido (median/mean) bien diseñado. Instruction telegráfica; no ancla el semáforo de cola al memo ejecutivo. Sin preamble/title/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Ratio mean/median como semáforo
- **Proposed preamble:**  
  - **Contexto:** el analista de CP-N2-B necesita un número simple que avise “hay cola” sin graficar aún.  
  - **Meta:** imprimir mean, median y ratio = mean/median.  
  - **Éxito:** `mean 29.2`, `median 12.0`, `ratio 2.43`.  
  - **Límites:** no inviertas la razón; redondea mean y ratio a 2 decimales.
- **Proposed instruction/description improvements:**  
  1. El starter usa `med / m` (bug).  
  2. Cambia a `m / med`.  
  3. Mantén etiquetas `mean`, `median`, `ratio`.  
  4. No alteres el array con el 100.
- **Proposed retrospective:**  
  Ratio ≫ 1 grita cola pesada; ratio invertido “achica” el aviso. Mismo hábito que en la demo T1-B. Siguiente: MAD sin usar mean.
- **Code/output changes:** none

---

### S18-T1-B-E2 (weDo, independent)
- **Diagnosis:** MAD vs. mean abs deviation: defecto pedagógico excelente. Instruction correcta pero sin escena “por qué MAD resiste el 100”. Feedback corto.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** MAD con mediana, no con media
- **Proposed preamble:**  
  - **Contexto:** con un outlier de 100, la dispersión “típica” no debe anclarse en la media.  
  - **Meta:** calcular MAD = mediana de |x − mediana|.  
  - **Éxito:** una línea `MAD 1.0`.  
  - **Límites:** no uses mean ni mean de desviaciones absolutas; no mutes el array.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: ancla y promedio con mean.  
  2. Cambia ancla a mediana; dispersión a mediana de absolutos.  
  3. Imprime solo `MAD` y el valor.  
  4. No renombres la etiqueta.
- **Proposed retrospective:**  
  MAD usa mediana dos veces: es robusto por diseño. Confundirlo con mean abs dev es un error de contrato, no de “casi igual”. Luego (E3): escala log1p con ceros.
- **Code/output changes:** none

---

### S18-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a log1p con cero en montos — skill real de EDA. Instruction ya advierte no comparar log como PEN; falta preamble de “ceros en montos” y retrospective de comunicación de escala.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** log1p honesto con montos y ceros
- **Proposed preamble:**  
  - **Contexto:** en EDA de montos ≥0 a veces hay ceros; `log(0)` rompe el pipeline.  
  - **Meta:** transformar con `log1p` e imprimir lista a 3 decimales.  
  - **Éxito:** `[0.0, 0.693, 2.303, 4.605]`.  
  - **Límites:** no uses `log` crudo; no compares diferencias log como soles PEN en el memo.
- **Proposed instruction/description improvements:**  
  1. Completa el starter que imprime `[]`.  
  2. Aplica `np.log1p(x)`.  
  3. Redondea cada valor a 3 decimales en lista.  
  4. No inventes otros transformadores.
- **Proposed retrospective:**  
  log1p es seguro con ceros; la honestidad está en declarar la escala en eje y conclusión. Pregunta: si el KPI es en PEN, ¿reportas en log o antitransformas? Puente a T2: incertidumbre sobre el estimador, no solo la escala.
- **Code/output changes:** none

---

### S18-T2-A-DEMO (iDo)
- **Diagnosis:** Demo clara de sesgo de cuota: Lima 0.7 vs. pob 0.5, max_abs_bias 0.2, cobertura LIMITADA. Falta preamble de “mean correcto ≠ población bien representada” y retrospective del misconception “si el cálculo está bien, la muestra sirve para todo el Perú”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Un `mean` impecable sobre una muestra sesgada sigue siendo una estimación sesgada de la población. Esta demo compara shares de muestra vs. cuotas sintéticas (Lima/Arequipa/Cusco), calcula el peor |bias_pp| y marca cobertura LIMITADA si supera 0.1. Observa los números: no escribas aún; predice si generalizarías el KPI regional al “todo Perú”.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: bias se mide en puntos porcentuales; el umbral 0.1 es contrato de la nota de datos; sin marco poblacional se declara cobertura limitada, no se inventa representatividad.
- **Proposed retrospective:**  
  Sesgo de selección ≠ error aritmético. Si max |bias| es alto, el hallazgo es local a la muestra. We Do: share, signo del bias y `max_bias` de portafolio.
- **Code/output changes:** none

---

### S18-T2-A-E1 (weDo, guided)
- **Diagnosis:** Bug trivial (cuenta Arequipa en vez de Lima) — bueno para guiado, pero instruction no explica *para qué* el share. Sin escena de nota de cobertura.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Proporción de Lima en la muestra
- **Proposed preamble:**  
  - **Contexto:** antes de comparar con cuotas poblacionales, necesitas el share observado de cada región.  
  - **Meta:** calcular e imprimir `share_Lima` (2 decimales).  
  - **Éxito:** `share_Lima 0.75` con la lista del starter.  
  - **Límites:** cuenta solo `"Lima"`; no inventes otra muestra.
- **Proposed instruction/description improvements:**  
  1. El starter hace `count("Arequipa")` (bug).  
  2. Cambia a `count("Lima")` y divide por `len(muestra)`.  
  3. Imprime con etiqueta `share_Lima` y round 2.  
  4. No uses Counter si no hace falta.
- **Proposed retrospective:**  
  Share = conteo/n es el ladrillo del bias. Contar la región equivocada es un bug de negocio silencioso. Siguiente: el signo del bias_pp.
- **Code/output changes:** none

---

### S18-T2-A-E2 (weDo, independent)
- **Diagnosis:** Signo del bias invertido — defecto clásico y útil. Instruction correcta; falta anclar “positivo = sobremuestreo”.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** bias_pp = share − población
- **Proposed preamble:**  
  - **Contexto:** en la nota de datos, bias positivo en Lima significa sobremuestreo de Lima, no “menos Lima”.  
  - **Meta:** calcular `bias_Lima_pp` con el orden share − pob.  
  - **Éxito:** `bias_Lima_pp 0.3` (share 0.8, pob 0.5).  
  - **Límites:** no inviertas la resta; redondea a 2 decimales.
- **Proposed instruction/description improvements:**  
  1. Starter imprime `pob - share`.  
  2. Corrige a `share - pob`.  
  3. Mantén la etiqueta `bias_Lima_pp`.  
  4. No cambies los valores 8/10 y 0.5.
- **Proposed retrospective:**  
  El signo del bias comunica dirección del sesgo. Invertirlo miente en el memo de cobertura. Luego (E3): el *peor* |bias| entre regiones.
- **Code/output changes:** none

---

### S18-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer a `max_bias(pob, counts)` — skill de portafolio. Instruction sólida; falta preamble de umbral LIMITADA y retrospective de generalización.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Peor |bias_pp| de cobertura
- **Proposed preamble:**  
  - **Contexto:** la nota de CP-N2-B marca cobertura LIMITADA/OK con el máximo |bias|, no con el promedio ni el mínimo.  
  - **Meta:** implementar `max_bias(pob, counts)`.  
  - **Éxito:** imprime `0.4` con el fixture (9 Lima / 1 Arequipa vs. 50-50).  
  - **Límites:** itera claves de `pob`; usa `counts.get(k, 0)`; no devuelvas el mínimo.
- **Proposed instruction/description improvements:**  
  1. Completa el cuerpo (hoy `NotImplementedError`).  
  2. n = suma de counts.  
  3. Por región: |count/n − share_pob|; devuelve el max.  
  4. Deja el `print(round(..., 2))` de prueba.
- **Proposed retrospective:**  
  El riesgo de generalización es el *peor* sesgo de cuota. Pregunta: con max |bias| = 0.4, ¿afirmas el KPI para “todo el Perú”? Puente a T2-B: incertidumbre del estimador *además* del sesgo de muestra.
- **Code/output changes:** none

---

### S18-T2-B-DEMO (iDo)
- **Diagnosis:** Demo densa y valiosa: diff, IC z, Cohen d, bootstrap de la diferencia, nota “no_probado”. Description larga; falta preamble que ordene *qué mirar* (IC que cruza 0) y retrospective del misconception “IC 95% = probado al 95%”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Magnitud sin incertidumbre es marketing. Aquí dos grupos sintéticos (ctrl/trat) reportan diferencia de medias, IC 95% z, d de Cohen, bootstrap de la diferencia y n. Observa si el IC cruza 0 y la nota `no_probado`: el EDA dice “compatible con”, no “queda demostrado”. Predice el signo de d y si el bootstrap se parece al IC z.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: IC habla del parámetro bajo modelo de muestreo, no del rango del 95% de los datos; bootstrap ayuda con n chico/colas; d comunica tamaño de efecto; ninguno es causalidad ni “probado”.
- **Proposed retrospective:**  
  Si el IC de la diferencia incluye 0, no vendas certeza de efecto. Siempre n + magnitud + intervalo. We Do: margen SE, d con orden B−A, bootstrap de la media.
- **Code/output changes:** none

---

### S18-T2-B-E1 (weDo, guided)
- **Diagnosis:** Bug clásico (olvida /√n). Instruction correcta; falta escena de “error estándar vs. dispersión bruta”.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Margen del IC 95% con √n
- **Proposed preamble:**  
  - **Contexto:** el margen del IC z no es 1.96·s; es 1.96·(s/√n).  
  - **Meta:** calcular e imprimir `margen` a 3 decimales.  
  - **Éxito:** `margen 0.98` con media=10, s=2, n=16.  
  - **Límites:** z≈1.96; no inventes t-student aquí; no omitas √n.
- **Proposed instruction/description improvements:**  
  1. Starter: `1.96 * s` sin dividir.  
  2. Divide por `math.sqrt(n)`.  
  3. Imprime `margen` redondeado a 3.  
  4. Deja media/s/n fijos.
- **Proposed retrospective:**  
  Sin /√n confundes dispersión de datos con error del estimador. El IC es media ± margen. Siguiente: tamaño de efecto d.
- **Code/output changes:** none

---

### S18-T2-B-E2 (weDo, independent)
- **Diagnosis:** Orden A/B invertido en d — simple pero enseña convención de signo. Instruction ya dice “no ‘probado’”; falta preamble de magnitud vs. p-valor.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** d de Cohen con orden B − A
- **Proposed preamble:**  
  - **Contexto:** d resume magnitud estandarizada; el signo depende de qué grupo restas.  
  - **Meta:** d = (media_B − media_A) / s_pooled.  
  - **Éxito:** `d 1.5` (A=10, B=13, sp=2).  
  - **Límites:** no inviertas A y B; no interpretes d como “probado”.
- **Proposed instruction/description improvements:**  
  1. Starter usa (10−13)/2.  
  2. Corrige a (13−10)/2.  
  3. Imprime `d` a 2 decimales.  
  4. No cambies s_pooled.
- **Proposed retrospective:**  
  d habla de tamaño, no de decisión de campaña. Invertir grupos voltea el relato. Luego (E3): bootstrap cuando z es dudoso.
- **Code/output changes:** none

---

### S18-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Bootstrap de la media — transferencia fuerte y alineada a theory. Instruction ya es mini-ensayo (casi preamble embebido); conviene separar preamble/instruction y añadir retrospective del misconception “IC = rango del 95% de tickets”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Bootstrap simple de la media
- **Proposed preamble:**  
  - **Contexto:** con montos de cola pesada y n chico, 1.96·s/√n es tosco; el portafolio pide bootstrap documentado.  
  - **Meta:** remuestrear con reemplazo B=100 (seed fija), percentiles 2.5/97.5 de la media.  
  - **Éxito:** `boot_ic95 (10.89, 31.17)`, `n 5`, `nota bootstrap_simple`.  
  - **Límites:** no reinicies el rng en el bucle; no uses z aquí; el IC no es el rango del 95% de x.
- **Proposed instruction/description improvements:**  
  1. Completa el bloque de boots (starter imprime None).  
  2. B medias con `rng.choice(..., replace=True)`.  
  3. `np.quantile(..., [0.025, 0.975])` redondeado a 2.  
  4. Imprime n y nota exacta `bootstrap_simple`.
- **Proposed retrospective:**  
  Bootstrap estima la incertidumbre del *estimador*, no el intervalo donde viven el 95% de los tickets. Seed fija hace auditable el notebook. Puente a T3: asociación sin vender causa.
- **Code/output changes:** none
- **Validation notes:** Output depende de seed 42 y B=100; no tocar.

---

### S18-T3-A-DEMO (iDo)
- **Diagnosis:** Demo excelente: r_raw ~0.97 cae a ~0.17 residualizando Z; Spearman monótono 1.0; claim no causal. Falta preamble de confusor y retrospective “r alto no es causa”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Un r de 0.97 puede ser un confusor Z que mueve X e Y a la vez. Esta demo muestra Pearson crudo, Pearson de residuales tras regresar X e Y sobre Z, Spearman en una relación monótona no lineal, y la etiqueta ética `asociacion_observada_no_causal`. Observa la caída de r: no escribas; pregunta en voz alta si recomendarías una campaña automática solo con r_raw.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: residualizar es un control exploratorio, no prueba causal; Spearman captura monótonas; el claim protege el portafolio de lenguaje de fraude/causa.
- **Proposed retrospective:**  
  r alto es hallazgo de asociación, no veredicto. Si al controlar Z cae, el confusor era el relato. We Do: Pearson correcto, Spearman por rangos, residuales de confusor.
- **Code/output changes:** none

---

### S18-T3-A-E1 (weDo, guided)
- **Diagnosis:** Bug corrcoef(y,y)=1 — guiado perfecto para newbie. Instruction corta; falta escena “por qué r=1 engaña al memo”.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Pearson entre x e y, no y consigo
- **Proposed preamble:**  
  - **Contexto:** un r=1 en el slide puede ser un bug de correlacionar la serie consigo misma.  
  - **Meta:** Pearson de x con y a 3 decimales.  
  - **Éxito:** `r 1.0` con x=[1..4], y=[2,4,6,8].  
  - **Límites:** usa `corrcoef(x, y)[0,1]`; no borres x.
- **Proposed instruction/description improvements:**  
  1. Starter: `corrcoef(y, y)`.  
  2. Cambia a `corrcoef(x, y)`.  
  3. Redondea a 3; etiqueta `r`.  
  4. No alteres los arrays.
- **Proposed retrospective:**  
  Correlacionar y con y siempre da 1: es tautología, no hallazgo. Revisa siempre los dos argumentos. Siguiente: Spearman monótono.
- **Code/output changes:** none

---

### S18-T3-A-E2 (weDo, independent)
- **Diagnosis:** Pearson vs. Spearman en monótona no lineal — pedagogía excelente. Instruction densa; falta anclar “monótono ≠ lineal”.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Spearman como Pearson de rangos
- **Proposed preamble:**  
  - **Contexto:** y crece monótono pero no lineal con x; Pearson en escala original no es el contrato “Spearman”.  
  - **Meta:** rangos de x e y + Pearson de rangos.  
  - **Éxito:** `spearman 1.0`.  
  - **Límites:** usa `argsort(argsort(...))`; no reportes Pearson crudo con etiqueta spearman.
- **Proposed instruction/description improvements:**  
  1. Starter imprime Pearson de x,y crudos.  
  2. Construye rx, ry con rangos.  
  3. `corrcoef(rx, ry)[0,1]` redondeado a 3.  
  4. Etiqueta exacta `spearman`.
- **Proposed retrospective:**  
  Spearman resume asociación monótona; sigue siendo asociación observada, no causa. Confundir etiqueta y método rompe la auditoría del notebook. Luego: residualizar un confusor Z.
- **Code/output changes:** none

---

### S18-T3-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer fuerte a confusor + residuales + claim. Instruction ya casi es preamble; conviene formalizar y cerrar con retrospective ética.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Residualizar confusor y claim no causal
- **Proposed preamble:**  
  - **Contexto:** en CP-N2-B un r alto entre monto y visitas puede ser tamaño de ciudad (Z).  
  - **Meta:** reportar r_raw, r_residual tras residualizar x,y vs z, y claim ético.  
  - **Éxito:** `r_raw 0.828`, `r_residual 0.075`, `claim asociacion_observada_no_causal`.  
  - **Límites:** seed 1 y coeficientes del starter fijos; no regeneres datos; no afirmes causa.
- **Proposed instruction/description improvements:**  
  1. r_raw ya está; completa residuales.  
  2. `polyfit(z, serie, 1)` para x e y; resta la predicción.  
  3. Pearson de residuales a 3 decimales.  
  4. Imprime claim exacto no causal.
- **Proposed retrospective:**  
  Si r cae al controlar Z, el confusor era el relato principal. El claim protege de lenguaje causal en el portafolio. Puente a T3-B: flags por segmento sin culpa regional.
- **Code/output changes:** none
- **Validation notes:** Output seed-dependent; no alterar seed ni tamaños.

---

### S18-T3-B-DEMO (iDo)
- **Diagnosis:** Demo clara: Tukey lo/hi, tasas de flag por región, `sin_claim_causal True`. Falta preamble “flag ≠ fraude” y retrospective de narrativa regional.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Marcar montos fuera de cercas Tukey es un hallazgo univariado, no un veredicto de fraude ni culpa de región. Esta demo calcula lo/hi, flags y sum/mean de flags por Lima/Arequipa/Cusco en datos sintéticos. Observa tasas 0.167 en Arequipa y Cusco: describe, no acusa. Predice si Lima tiene flags antes de mirar la salida.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: 1.5·IQR es contrato clásico; tasas por segmento son descriptivas; la decisión de investigar es humana; el booleano ético cierra el artefacto.
- **Proposed retrospective:**  
  Anomalía univariada ≠ causa ni fraude automático. Siempre método + n + límites. We Do: cerca superior, tasa por Lima, máscara bilateral.
- **Code/output changes:** none

---

### S18-T3-B-E1 (weDo, guided)
- **Diagnosis:** Multiplicador 0.5 vs 1.5 — defect limpio. Instruction menciona “Flag ≠ fraude” (bien) pero sin preamble formal.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Cerca superior Tukey 1.5·IQR
- **Proposed preamble:**  
  - **Contexto:** el runbook de anomalías univariadas usa cerca hi = Q3 + 1.5·IQR.  
  - **Meta:** contar cuántos montos superan hi.  
  - **Éxito:** `n_hi 1` (el 50 del array).  
  - **Límites:** multiplicador 1.5 (no 0.5); flag ≠ fraude.
- **Proposed instruction/description improvements:**  
  1. Starter usa `0.5 * iqr`.  
  2. Cambia a `1.5 * iqr`.  
  3. Cuenta `(m > hi).sum()` como int.  
  4. Etiqueta `n_hi`.
- **Proposed retrospective:**  
  0.5·IQR inventa outliers de más; el contrato Tukey es 1.5. Los flags son candidatos a revisión. Siguiente: tasa solo en Lima.
- **Code/output changes:** none

---

### S18-T3-B-E2 (weDo, independent)
- **Diagnosis:** Tasa global vs. tasa en Lima — skill de segmentación. Instruction correcta; falta anclar “no generalices la tasa global al segmento”.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Tasa de flags solo en Lima
- **Proposed preamble:**  
  - **Contexto:** un slide que mezcla regiones miente sobre “riesgo en Lima”.  
  - **Meta:** media de flags donde region == "Lima".  
  - **Éxito:** `tasa_Lima 1.0` con el fixture de 3 filas.  
  - **Límites:** no uses `flag.mean()` global; no inventes causalidad regional.
- **Proposed instruction/description improvements:**  
  1. Starter imprime mean global.  
  2. Enmascara `flag[region == "Lima"]`.  
  3. Media float; etiqueta `tasa_Lima`.  
  4. No alteres los arrays.
- **Proposed retrospective:**  
  Segmentar antes de promediar es el hábito del EDA por cohorte. Tasa alta en un segmento es hallazgo descriptivo. Luego: máscara Tukey bilateral completa.
- **Code/output changes:** none

---

### S18-T3-B-E3 (weDo, transfer)
- **Diagnosis:** Máscara bilateral — transfer de portafolio. lo/hi ya dados; falta completar flags. Instruction buena; añadir preamble ético y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Máscara Tukey bilateral a lista
- **Proposed preamble:**  
  - **Contexto:** el portafolio marca outliers altos *y* bajos; solo `m > hi` pierde la cola inferior.  
  - **Meta:** booleans fuera de [lo, hi] como lista.  
  - **Éxito:** `[False, False, False, False, True]` con m que incluye 100.  
  - **Límites:** bilateral; documenta en memo flag ≠ fraude ni culpa de región.
- **Proposed instruction/description improvements:**  
  1. lo/hi ya calculados.  
  2. `(m < lo) | (m > hi)`.  
  3. `.tolist()` e imprime.  
  4. No cambies el array ni las cercas.
- **Proposed retrospective:**  
  Bilateral protege de sesgo a “solo valores altos”. Flags son input a investigación humana. Puente a T4: trazar pregunta→evidencia sin convertir flag en decisión.
- **Code/output changes:** none

---

### S18-T4-A-DEMO (iDo)
- **Diagnosis:** Demo de plantilla Q→H→E con `decision: None`. Description clara; falta preamble de por qué decisión es None y retrospective “hallazgo no es campaña”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El artefacto de calidad de CP-N2-B separa pregunta, hipótesis, cálculo, resultado e incertidumbre; la decisión de negocio puede quedar en `None` hasta que un humano la tome. Sigue el dict sintético Lima vs. Cusco: imprime pregunta, hallazgo y verifica que decisión es None. No escribas: el hábito es no saltar de mediana a campaña.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: traza auditable; incertidumbre y cobertura en el mismo objeto; decisión nula es una feature, no un bug.
- **Proposed retrospective:**  
  Si puedes defender por qué decision es None con un hallazgo claro, ya separas capas. We Do: clave pregunta, umbral hallazgo vs. candidato, traza P→M→V→L.
- **Code/output changes:** none

---

### S18-T4-A-E1 (weDo, guided)
- **Diagnosis:** Print de hipótesis en vez de pregunta — simple pero enseña capas del dict. Instruction OK; sin escena.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Imprimir la pregunta, no la hipótesis
- **Proposed preamble:**  
  - **Contexto:** en la traza Q→H→E, la pregunta de negocio y la hipótesis son capas distintas.  
  - **Meta:** imprimir solo el valor de `evidencia["pregunta"]`.  
  - **Éxito:** `¿Cuál es el ticket mediano?`  
  - **Límites:** no reescribas el dict; no imprimas hipótesis ni resultado.
- **Proposed instruction/description improvements:**  
  1. Starter imprime `hipotesis`.  
  2. Cambia la clave a `pregunta`.  
  3. Un solo print del string.  
  4. No mutes el dict.
- **Proposed retrospective:**  
  Mezclar pregunta e hipótesis confunde el memo y la revisión. La traza empieza por la pregunta. Siguiente: etiquetar nivel de hallazgo vs. candidato a decisión.
- **Code/output changes:** none

---

### S18-T4-A-E2 (weDo, independent)
- **Diagnosis:** Umbral invertido para solo_hallazgo vs. candidato_decision. Instruction ya advierte no inventar campañas; formalizar preamble.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Hallazgo vs. candidato a decisión
- **Proposed preamble:**  
  - **Contexto:** una mediana de 12 no dispara campaña; solo etiqueta el nivel del hallazgo.  
  - **Meta:** si median < 15 → `solo_hallazgo`; si no → `candidato_decision`.  
  - **Éxito:** `solo_hallazgo` con median=12.  
  - **Límites:** no lances decisiones automáticas; corrige el operador de comparación.
- **Proposed instruction/description improvements:**  
  1. Starter usa `median > 15` al revés.  
  2. Condición correcta: `median < 15` → solo_hallazgo.  
  3. Un print de la etiqueta.  
  4. No cambies el umbral 15.
- **Proposed retrospective:**  
  Candidato a decisión ≠ decisión tomada. El EDA etiqueta; el negocio decide. Luego (E3): traza P→M→V→L con límite de cobertura.
- **Code/output changes:** none

---

### S18-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Traza P→M→V→L — transfer de portafolio fuerte. Instruction buena; falta preamble de por qué L es obligatorio.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Traza P→M→V→L auditable
- **Proposed preamble:**  
  - **Contexto:** sin límite de cobertura (L), un hallazgo de mediana en Lima no es auditable.  
  - **Meta:** función `traza` con prints `P:`, `M:`, `V:`, `L:`.  
  - **Éxito:** cuatro líneas con “ticket mediano Lima”, median, 27.5, “solo web”.  
  - **Límites:** no cambies la llamada de prueba; usa el parámetro `limite`.
- **Proposed instruction/description improvements:**  
  1. Completa el `pass` de la función.  
  2. Cuatro prints con prefijos exactos.  
  3. Orden P, M, V, L.  
  4. Deja `traza(...)` intacta.
- **Proposed retrospective:**  
  L cierra la traza: “solo web” impide generalizar. Pregunta de cierre: ¿qué L pondrías si la muestra es solo canal app? Puente a T4-B: nota de datos con n y hash.
- **Code/output changes:** none

---

### S18-T4-B-DEMO (iDo)
- **Diagnosis:** Demo de nota de datos con filtro monto>0, seed, sha1_8 y median_final. Falta preamble de auditoría y retrospective “sin hash no hay reproducibilidad”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El notebook del portafolio no es creíble sin nota de datos: origen, n_raw/n_final, filtros, seed y huella corta del CSV ordenado. Esta demo filtra montos > 0 en tickets sintéticos T001…, arma el dict y calcula mediana final. Observa cómo n cae de 5 a 4 y por qué el sha1 se toma del blob filtrado ordenado. Sin PII real.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: ordenar por ticket_id estabiliza el hash; seed fija el generador; filtros hacen auditable la exclusión; puente a S19 dashboard.
- **Proposed retrospective:**  
  Si cambias el filtro y no actualizas n_final ni el hash, la nota miente. We Do: dict mínimo, sha1[:8], nota post-filtro con seed.
- **Code/output changes:** none

---

### S18-T4-B-E1 (weDo, guided)
- **Diagnosis:** Note vacío — guiado mínimo viable. Instruction lista claves; falta escena de auditoría.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Nota mínima n_raw, n_final, filtros
- **Proposed preamble:**  
  - **Contexto:** un `{}` en la nota de datos no pasa revisión de CP-N2-B.  
  - **Meta:** dict con n_raw=5, n_final=4, filtros `["monto>0"]`.  
  - **Éxito:** imprimir ese dict.  
  - **Límites:** n_final ≤ n_raw; no inventes campos extra obligatorios aquí.
- **Proposed instruction/description improvements:**  
  1. Starter: `note = {}`.  
  2. Llena las tres claves.  
  3. `print(note)`.  
  4. Filtros como lista de strings.
- **Proposed retrospective:**  
  n_raw vs. n_final hace visible la pérdida por filtro. Sin filtros listados, nadie reproduce el corte. Siguiente: huella SHA-1 corta.
- **Code/output changes:** none

---

### S18-T4-B-E2 (weDo, independent)
- **Diagnosis:** md5 completo vs. sha1[:8] — defect de contrato de huella. Instruction técnica densa (newlines); buena; formalizar preamble de por qué 8 hex.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** SHA-1 de 8 hex del CSV
- **Proposed preamble:**  
  - **Contexto:** la huella corta del CSV ordenado permite detectar cambios de filas sin pegar el digest entero.  
  - **Meta:** sha1 del payload con newlines reales, primeros 8 hex.  
  - **Éxito:** `2aa26ec9`.  
  - **Límites:** no md5; no digest completo; newlines reales (chr(10)), no la secuencia literal `\n` de dos caracteres.
- **Proposed instruction/description improvements:**  
  1. Starter usa md5 y digest completo.  
  2. Cambia a `sha1(...).hexdigest()[:8]`.  
  3. Mantén el armado del payload del starter.  
  4. Un solo print del string de 8 chars.
- **Proposed retrospective:**  
  Algoritmo y longitud son contrato del portafolio. Cambiar el orden de filas cambia el hash: por eso se ordena antes. Luego (E3): nota con n y seed tras filtro.
- **Code/output changes:** none
- **Validation notes:** Output `2aa26ec9` depende de newlines exactos; no alterar fixture.

---

### S18-T4-B-E3 (weDo, transfer)
- **Diagnosis:** Nota post-filtro con seed — cierra hilo a S19. Instruction sólida; falta preamble de reproducibilidad entre personas y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Nota post-filtro con seed 42
- **Proposed preamble:**  
  - **Contexto:** el cierre hacia S19 exige n_raw, n_final y seed en la misma nota.  
  - **Meta:** filtrar monto>0 y armar dict con seed 42.  
  - **Éxito:** `{'n_raw': 3, 'n_final': 2, 'seed': 42}`.  
  - **Límites:** n_final no puede igualar n_raw si el filtro elimina filas; seed exacto 42.
- **Proposed instruction/description improvements:**  
  1. n_raw ya está; df2 filtra monto>0.  
  2. Completa note con n_raw, n_final=len(df2), seed=42.  
  3. Imprime el dict.  
  4. No borres el filtro.
- **Proposed retrospective:**  
  Seed + n_final hacen reproducible el notebook entre compañeros. Sin seed, “me salió distinto” no es auditable. Puente a You Do: EDA completo de CP-N2-B con los seis checkpoints.
- **Code/output changes:** none

---

### youDo (proyecto CP-N2-B inicio)
- **Diagnosis:** Marco de proyecto **fuerte**: context de fintech sintética, objectives alineados a learning outcomes, requirements con salida mínima auditable (5 piezas), starter con 6 checkpoints parcialmente rellenos, rúbrica ponderada, portfolioNote hacia S19. **Falta** `retrospective` formal de defensa/metacognición post-build. El starter ya guía mucho (bien); el cierre “antes de marcar listo” no está escrito como campo retrospective.
- **Checklist:** context pass · goal pass · success pass (rubric + salida mínima) · constraints pass · retrospective **fail**
- **Severity:** P1
- **Proposed title:** (ya existe) EDA honesto para CP-N2-B (inicio)
- **Proposed preamble:** N/A como campo separado — el `context` ya cumple rol de escena; opcionalmente no duplicar. Si el schema solo exige retrospective en youDo, no forzar preamble.
- **Proposed instruction/description improvements:**  
  Ninguno estructural. Opcional P2: en checkpoint 2 del starter, dejar más vacío p90 para que no sea “solo descomentar”; no es bloqueante. Mantener etiqueta ética `asociacion_observada_no_causal`.
- **Proposed retrospective:**  
  Antes de marcar listo: (1) ¿cada hallazgo cita n, métrica y un límite de cobertura? (2) ¿declaraste por qué usaste z, bootstrap o ambos en montos lognormales? (3) ¿puedes defender en 30 segundos que un flag Tukey o un r alto no es fraude ni causa? Escribe en el README una frase de impacto medible (antes/después del EDA) y confirma que la nota de datos incluye seed y sha1_8 del CSV ordenado. Ese paquete es lo que alimenta el dashboard de S19.
- **Code/output changes:** none (starter ya pedagógico)
- **Validation notes:** Alineado a theory T1–T4 y a demos; solo datos sintéticos.

---

## Priority order

### P0 (Fixer primero — We Do verbal scaffolding)
Todos los **24** We Do carecen de `title`, `preamble` y `retrospective`; la `instruction` mezcla meta/éxito con pasos. Orden sugerido de implementación por subtema (para no romper el hilo del learner):

1. **T1-A** E1 → E2 → E3 (n/mean/median → IQR → dict resumen)  
2. **T1-B** E1 → E2 → E3 (ratio → MAD → log1p)  
3. **T2-A** E1 → E2 → E3 (share → bias_pp → max_bias)  
4. **T2-B** E1 → E2 → E3 (margen → d → bootstrap)  
5. **T3-A** E1 → E2 → E3 (Pearson → Spearman → residuales)  
6. **T3-B** E1 → E2 → E3 (cerca 1.5 → tasa Lima → máscara bilateral)  
7. **T4-A** E1 → E2 → E3 (pregunta → hallazgo/decisión → P→M→V→L)  
8. **T4-B** E1 → E2 → E3 (note mínima → sha1[:8] → note+seed)

En cada unidad: añadir `title` (4–12 palabras), `preamble` (80–150 palabras o 4 bullets), recortar `instruction` a pasos de tarea, `retrospective` (40–80 palabras), y enriquecer `feedback` a 25–60 palabras con *razonamiento* (P2 si el tiempo aprieta tras preamble).

### P1 (I Do + You Do)
1. **8 I Do demos:** añadir `preamble` + `retrospective`; ampliar `why` al rango 40–90 palabras.  
2. **youDo:** añadir `retrospective` de defensa (propuesta arriba).

### P2 (polish)
- Feedback We Do de una línea → 25–60 palabras con misconception típico.  
- Hints E3: si spoilean demasiado el cuerpo, dejar una miga menos (opcional; no bloquear).  
- Unificar vocabulario CASO-LIM-018 / CP-N2-B en preambles (ya presente en starters).

---

## Residual risks

1. **Densidad de T2-B y T3-A:** IC, d, bootstrap y confusores son cognitivamente pesados; preambles deben **un** goal primario (no re-enseñar toda la theory). Riesgo de bloat si el Fixer pega essays >150 palabras.  
2. **Outputs seed-dependent** (demo T2-B, E3 bootstrap T2-B, E3 residuales T3-A, demo T1-A lognormal): el Fixer **no** debe regenerar números ni cambiar seeds.  
3. **E1 muy micro** (p. ej. print de clave pregunta, count de región): el preamble no debe inventar un proyecto gigante; mantener escena corta y un skill.  
4. **id de sección `data-engineering`:** el contenido es EDA/incertidumbre; no reescribir el id en este round, pero el Fixer debe alinear prosa a EDA, no a pipelines ETL.  
5. **Ética de fraude/causalidad:** ya está en theory y algunos feedback; los retrospectives propuestos la refuerzan — no suavizar en el fix.  
6. **You Do starter casi completo:** el riesgo pedagógico es “solo descomentar”; el retrospective de defensa mitiga; no vaciar el starter en Round 1 sin diseño de rúbrica.  
7. **Sin ejecución de tests en este review:** outputs no se re-ejecutaron; se asume canonicidad del source (coherente con theory). El Fixer no cambia outputs salvo diff justificado.

---

## Summary for Fixer

| Unidad tipo | N | Acción principal |
|-------------|---|------------------|
| iDo | 8 | +preamble, +retrospective, expandir why |
| weDo | 24 | +title, +preamble, instruction solo-pasos, +retrospective, feedback más razonado |
| youDo | 1 | +retrospective de defensa |
| código/outputs | — | **none** salvo justificación execute-and-diff |

Tone gold de referencia (no copiar contenido): S26, S30, S33, S50. Prosa learner-facing: **español profesional peruano**, sin PII real, hilo **CASO-LIM-018 / CP-N2-B → S19**.

**Anti-aberration checklist (este report):**  
- [x] Lectura manual de cada unidad  
- [x] Sin generadores / bulk templates  
- [x] Propuesta hand-crafted por unidad  
- [x] Sin edición del source en Round 1  

---

Section 18 exercise pedagogy review complete. Ready for the Fixer prompt.
