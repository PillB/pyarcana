# S27 Exercise Pedagogy Report (Round 1)

## Section
- **title:** Estrategia de pruebas con pytest
- **shortTitle:** Pytest y contratos
- **id:** `async-concurrency` (archivo `s27-async-concurrency.ts`; contenido = contratos pytest / CP-N3-A sobre normalización y matching sintético — **no** async/await ni hilos)
- **index:** 27
- **source:** `src/lib/course/sections/s27-async-concurrency.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades de práctica/demo)
- **subtemas:** S27-T1-A riesgo/pirámide · T1-B AAA/oráculos · T2-A discovery/asserts/parametrize · T2-B fixtures/scopes · T3-A isclose/raises/tmp · T3-B negativos/mensajes · T4-A cobertura de ramas · T4-B mutación/regresión
- **hilo de caso:** inicio **CP-N3-A** (run_id `cpn3a-01`; contactos sintéticos `@example.pe`; matching = misma entidad sintética, **nunca** fraude ni parentesco)

## Method
- Leído `PEDAGOGY_EXERCISE_SPEC.md` (campos, longitudes, checklist preamble/retrospective, fade E1→E2→E3).
- Inspeccionado manualmente cada `iDo.steps[]` (8 demos ~407–631), `weDo.steps[]` (24 ejercicios ~633–1426) y `youDo` (~1428–1512) en `s27-async-concurrency.ts`.
- Contrastado con el hilo de la sección: motor ER sintético, `normalize_name` / `exact_match` / umbrales auto-review-non, pirámide unit→integration→e2e, dual-track pytest CLI vs assert+print del lab, ética no-fraude.
- **Sin** generadores, bucles, plantillas ni copy-paste mecánico entre unidades.
- Prosa propuesta en **español profesional peruano**, un objetivo primario por unidad.

## Hallazgos transversales (antes del ledger)

| Campo / hábito | Estado actual en S27 |
|----------------|----------------------|
| I Do `preamble` | **Ausente** en las 8 demos |
| I Do `retrospective` | **Ausente** en las 8 demos |
| I Do `description` | Presente y alineada al skill; no sustituye preamble formal |
| I Do `why` | Presente; casi siempre **1 frase** (bajo el piso 40–90 palabras del spec) |
| We Do `title` | **Ausente** en los 24 (solo prefijo `S27-T…-E… ·` dentro de `instruction`) |
| We Do `preamble` | **Ausente** en los 24 |
| We Do `retrospective` | **Ausente** en los 24 |
| We Do `instruction` | Mejor que un drill vacío: nombra `# DEFECT:`, Caso 27 y salida; **mezcla** meta + pasos + contrato en un solo bloque; opaca para newbie sin escena de “por qué el clerical queue hereda basura” |
| We Do `feedback` | Presente en los 24; a menudo nombra el *porqué* del bug (producto vs suma, deepcopy, isclose, mutante). A veces 1 frase; poco anclado al riesgo del motor ER |
| Starter `# DEFECT:` | **Excelente** hábito en todos; defectos bien nombrados y alineados a la solución |
| Hints | Progresivos; E1 casi-spoiling (aceptable guiado); E3 con pistas mínimas — fade real |
| You Do marco | `context` / `objectives` / `requirements` / `rubric` / `portfolioNote` / starter **sólidos** y alineados a CP-N3-A |
| You Do `retrospective` | **Ausente** |
| Código / outputs | Coherentes con theory y hilo sintético; **no** proponer cambios de output salvo notas puntuales |
| Filename vs contenido | El id de archivo `async-concurrency` y el id de sección no reflejan el contenido (pytest/contratos). No es defecto de ejercicio, pero confunde al revisor y al buscador del repo |

**Patrón dominante:** el andamiaje de *código* (starters con bug nombrado, outputs canónicos, fade real E1→E3 por subtema, dual-track pytest/assert, ética de matching) es maduro y alineado a CP-N3-A. El andamiaje *pedagógico verbal* (preamble → instruction solo-tarea → retrospective) no existe. Un true newbie no responde con claridad: qué practico, por qué importa en un motor de entity resolution de un banco/fintech peruano sintético, cómo sé que gané, qué debe quedarme al cerrar la pestaña.

**Fade E1→E2→E3 (contenido):** progresión real por subtema (p. ej. T1-A: producto → orden descendente → capa del max; T1-B: normalize strip-only → assert pass → equality after normalize; T2-B: deepcopy → scope function → factory len; T4-B: matar mutante → falla útil → bug_repro→regression). **No** son tres clones con números distintos. El fade de *prosa* no se ve porque no hay preambles diferenciados.

**Severity default:** missing title+preamble+retrospective en We Do = **P0**; I Do sin preamble/retrospective = **P1** (aún tienen description+why+código); youDo sin retrospective = **P1**; polish de feedback/why = **P2** si caen preamble/instruction/retrospective.

---

## Unit ledger

### S27-T1-A-DEMO (iDo)
- **Diagnosis:** Demo sólida de ranking por `impact × likelihood` (normalize → blocking → repo_sql; top_layer unit). La `description` nombra el skill; el `why` es una frase. Falta `preamble` que diga *qué observar* (score reordena tiempo, no invierte la pirámide) y `retrospective` del misconception “más tests de UI = mejor suite”.
- **Checklist:** context fail · goal partial · success partial (output visible) · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Antes de escribir un solo `assert` del motor ER sintético, el equipo decide *dónde* gastar minutos de prueba. En esta demo se calcula score = impacto × probabilidad y se ordenan áreas: normalización primero, repo después, UI al final. No escribas aún: predice el orden y la capa del tope. Si inviertes la pirámide con solo E2E de la cola de revisión, el `strip` roto llegará al clerical queue con confianza falsa.
- **Proposed instruction/description improvements:**  
  Mantener description. Ampliar `why` (~50–70 palabras): el score no sustituye unit/integration/e2e; solo reordena el tiempo finito del sprint. Normalización y blocking tocan cada par sintético; un bug ahí multiplica basura en matching. Puente a We Do: producto, orden descendente y capa del área de mayor score.
- **Proposed retrospective:**  
  Si puedes explicar por qué normalize gana a la UI en la cola de prioridad *sin mirar el código*, ya tienes el hábito de riesgo primero. El error clásico es medir “número de tests” y dejar sin contrato la rama que mueve el merge. En We Do practicarás score, ranking y elegir la capa unit.
- **Code/output changes:** none
- **Validation notes:** Output `['normalize', 'blocking', 'repo_sql']` / `top_layer unit` alineado a theory T1-A.

---

### S27-T1-A-E1 (weDo, guided)
- **Diagnosis:** Drill guiado claro: starter suma en vez de multiplicar (5+4=9 vs 5×4=20). Instruction telegráfica con ID y defecto; sin title, preamble ni retrospective. Feedback nombra el producto pero no ancla “por qué el score decide la cola del sprint”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Score de riesgo: producto, no suma
- **Proposed preamble:**  
  - **Contexto:** en CP-N3-A priorizas suites del motor ER sintético con un score simple que el equipo pueda discutir en la retro.  
  - **Meta:** calcular `impact * likelihood` (no sumar).  
  - **Éxito:** una sola línea con el entero `20` (impact=5, likelihood=4).  
  - **Límites:** no uses suma; no imprimas etiquetas; no inventes otra fórmula en este ejercicio.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `print(impact + likelihood)` (bug: suma).  
  2. Cambia a producto `impact * likelihood`.  
  3. Imprime solo el número.  
  4. Con 5 y 4 el oráculo es 20.
- **Proposed feedback improvement:**  
  El score de priorización es producto (5×4=20), no suma. Si sumas, un área “media” se disfraza de alta prioridad y la cola del sprint miente.
- **Proposed retrospective:**  
  Producto impacto×probabilidad es la heurística de bolsillo del ranking. El error clásico es sumar o inventar un ponderado opaco. Siguiente (E2): ordenar áreas por ese score de mayor a menor.
- **Code/output changes:** none
- **Validation notes:** DEFECT bien nombrado; solution y output `20` correctos.

---

### S27-T1-A-E2 (weDo, independent)
- **Diagnosis:** Bug de orden ascendente vs descendente — excelente para independiente. Instruction ya nombra el criterio; falta escena de “unit antes que e2e” y cierre metacognitivo. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Ordenar áreas por riesgo descendente
- **Proposed preamble:**  
  - **Contexto:** con tiempo finito, el README del paquete de tests debe listar primero lo que más duele si falla.  
  - **Meta:** ordenar filas por score (impacto×probabilidad) **descendente** e imprimir solo los nombres.  
  - **Éxito:** `['unit', 'e2e']` (unit score 25 antes que e2e score 2).  
  - **Límites:** no dejes el orden ascendente; no pidas empates aquí; una sola lista de salida.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: `sorted(..., key=score)` sin signo negativo (ascendente).  
  2. Usa clave negativa `-(r[1]*r[2])` (o `reverse=True` equivalente).  
  3. Imprime la list comprehension de nombres.  
  4. No alteres las tuplas de datos.
- **Proposed retrospective:**  
  Descendente por score pone la base ancha (unit de alto riesgo) primero en la conversación del equipo. Ordenar al revés es invertir la pirámide en la práctica. Luego (E3) eliges la *capa* del área de mayor score.
- **Code/output changes:** none
- **Validation notes:** E2 con menos migas que E1; output canónico intacto.

---

### S27-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transferencia real: de score a *capa* del tope (`max` vs `min`). Instruction ya da el oráculo `'unit'`; falta anclar reutilización en el mapa de riesgo del You Do y retrospective de “min invierte la pirámide”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Capa del área de mayor score
- **Proposed preamble:**  
  - **Contexto:** el mapa de riesgo de CP-N3-A no solo nombra áreas: reporta en qué capa de la pirámide inviertes primero.  
  - **Meta:** de la lista `(área, score, capa)`, tomar el **mayor** score e imprimir su capa.  
  - **Éxito:** la cadena `unit` (normalize score 20 gana a ui_review e2e score 4).  
  - **Límites:** no uses `min`; no imprimas el nombre del área; no inventes empates.
- **Proposed instruction/description improvements:**  
  1. El starter usa `min` (elige el score más bajo).  
  2. Cambia a `max(risks, key=lambda r: r[1])`.  
  3. Imprime el índice de capa `top[2]`.  
  4. Verifica mentalmente: 20 > 4 → unit.
- **Proposed retrospective:**  
  Priorizar con `max` alinea la inversión con la base de la pirámide; `min` manda a testear la UI barata de impacto y deja el contrato unit sin red. Pregunta de cierre: en el You Do, ¿qué área del `risk_map` saldría primero?
- **Code/output changes:** none
- **Validation notes:** Transfer auténtico; alineado a theory T1-A y You Do `risk_map`.

---

### S27-T1-B-DEMO (iDo)
- **Diagnosis:** Worked example AAA claro (`"  María  Ríos "` → `"maría ríos"`). Description OK; `why` una frase. Falta preamble de “oráculo ≠ print” y retrospective del misconception “si se ve bien en consola, el contrato está sellado”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Un test legible se lee en diez segundos: dado este raw sintético, al normalizar, espero este oráculo. En esta demo el Arrange fija `"  María  Ríos "` y el oráculo `"maría ríos"`; el Act llama `normalize_name`; el Assert compara. No escribas: sigue las fases y comprueba el print. Si confundes un `print` amable con un `assert`, el merge del colega no protege el matching.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: oráculo fijo = regresión confiable en CI; `casefold` + colapsar espacios es el contrato de igualdad de entidad sintética; el assert debe fallar ruidosamente si se rompe; puente a We Do (normalize real, pass/fail honesto, matching normalizado).
- **Proposed retrospective:**  
  AAA con oráculo determinista es el esqueleto de todo contrato de `normalize_name`. El error clásico es “ya imprimió bien” sin assert. We Do: colapsar espacios, imprimir `pass` solo si el assert vive, y comparar dos lados normalizados.
- **Code/output changes:** none
- **Validation notes:** Output `got maría ríos` / `aaa pass` correcto.

---

### S27-T1-B-E1 (weDo, guided)
- **Diagnosis:** Starter solo hace `strip` — defecto guiado ideal para el contrato real. Instruction densa; sin title/preamble/retrospective. Feedback bueno sobre casefold+split/join.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Normalizar con casefold y colapsar espacios
- **Proposed preamble:**  
  - **Contexto:** en entity resolution, dos contactos sintéticos solo se comparan tras un contrato de normalización estable.  
  - **Meta:** aplicar `casefold` y colapsar espacios internos con `split`/`join` (no solo `strip`).  
  - **Éxito:** una línea `a b` a partir de `' A  B '`.  
  - **Límites:** no dejes solo strip; no imprimas etiquetas; no uses PII real.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `print(s.strip())` (bug).  
  2. Usa `' '.join(s.casefold().split())`.  
  3. Imprime solo el resultado.  
  4. Comprueba mentalmente: dobles espacios y mayúsculas desaparecen.
- **Proposed retrospective:**  
  `strip` limpia bordes; no colapsa dobles espacios ni unifica case. El contrato real del motor es casefold + split/join. Siguiente (E2): assert con oráculo y señal `pass` honesta.
- **Code/output changes:** none
- **Validation notes:** DEFECT claro; output `a b` correcto.

---

### S27-T1-B-E2 (weDo, independent)
- **Diagnosis:** Bug sutil y excelente: assert correcto pero imprime `'fail'`. Enseña “teatro de verde/rojo” en CI. Falta preamble de escena y retrospective. Sin title.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tras el assert, imprime pass
- **Proposed preamble:**  
  - **Contexto:** el oráculo `'ana'` para `'ANA'.casefold()` debe quedar sellado: si el assert no lanza, el caso pasó.  
  - **Meta:** mantener el assert y reportar `'pass'` (no `'fail'` inventado).  
  - **Éxito:** una línea `pass`.  
  - **Límites:** no borres el assert; no imprimas fail si el contrato se cumple; oráculo fijo `'ana'`.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: assert OK pero `print('fail')`.  
  2. Cambia el print a `'pass'`.  
  3. No alteres el oráculo ni el raw.  
  4. Si rompes el assert a propósito, el programa debe detenerse (no imprimir fail a mano).
- **Proposed retrospective:**  
  Un `fail` después de un assert verde confunde al humano y a la lectura del log. El contrato es: o el assert mata el proceso, o reportas pass. Luego (E3): matching exacto normalizando *ambos* lados.
- **Code/output changes:** none
- **Validation notes:** Pedagogía de “señal honesta” muy alineada a theory (oráculo ≠ impresión).

---

### S27-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer al matching exacto post-normalización. Instruction ya advierte matching ≠ fraude. Falta preamble de escena ER y retrospective ética. Sin title.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Matching exacto tras normalizar ambos
- **Proposed preamble:**  
  - **Contexto:** el motor ER pregunta solo si dos cadenas sintéticas son la misma entidad tras el contrato de normalización — no si hay fraude ni parentesco.  
  - **Meta:** normalizar `a` y `b` (`casefold` + colapsar espacios) y comparar.  
  - **Éxito:** `True` para `'X Y'` vs `'x  y'`.  
  - **Límites:** no compares crudo; no etiquetes fraude; datos sintéticos.
- **Proposed instruction/description improvements:**  
  1. El starter hace `a == b` crudo (False).  
  2. Aplica el mismo normalize a ambos lados.  
  3. Imprime el booleano de igualdad.  
  4. No cambies los strings de prueba.
- **Proposed retrospective:**  
  Matching exacto compara entidades normalizadas, no basura de espacios/case. El error clásico es igualdad cruda o, peor, inferir riesgo/parentesco del score. Pregunta: ¿qué reutilizas de aquí en `exact_match` del You Do?
- **Code/output changes:** none
- **Validation notes:** Transfer alineado a You Do `exact_match` y ética de la sección.

---

### S27-T2-A-DEMO (iDo)
- **Diagnosis:** Demo de discovery conceptual (`test_*`, node_ids, asserts). Description OK; `why` corto. Falta preamble de “si no se llama test_, no corre a las 2 a. m.” y retrospective del misconception “cualquier función en el archivo es un caso”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  pytest descubre funciones `test_*` (y clases `Test*`) en archivos `test_*.py`. En esta demo hay dos contratos ejecutados a mano con la misma forma que el runner real: normalización y dominio sintético `@example.pe`. Observa los `node_ids` impresos: son los nombres con los que re-correrías solo el fallido. No escribas; predice qué pasa si renombras a `helper_exact` sin el prefijo.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: nombres estables = re-run puntual en CI; el lab ejecuta assert+print cuando no hay CLI, pero la forma `test_*` es la real; helpers no son casos. Puente a We Do: filtrar discovery, assert honesto, tabla estilo parametrize.
- **Proposed retrospective:**  
  Naming `test_*` es el contrato de discovery. El error clásico es meter lógica de prueba en helpers que nadie corre. We Do: filtrar la lista, distinguir ok/fail y aplicar oráculos fila a fila.
- **Code/output changes:** none
- **Validation notes:** Output con `n_tests 2` correcto.

---

### S27-T2-A-E1 (weDo, guided)
- **Diagnosis:** Filtrar `startswith('test_')` — guiado simple y bien alineado. Instruction telegráfica; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Descubrir solo nombres test_
- **Proposed preamble:**  
  - **Contexto:** en la suite del motor ER, un helper no es un caso de CI ni un node id.  
  - **Meta:** de una lista de nombres, quedarte solo con los que empiezan por `'test_'`.  
  - **Éxito:** `['test_a', 'test_b']` (helper fuera).  
  - **Límites:** no imprimas la lista completa; no inventes discovery de clases `Test*` en este ejercicio.
- **Proposed instruction/description improvements:**  
  1. El starter imprime `names` sin filtrar.  
  2. Filtra con `n.startswith('test_')`.  
  3. Imprime la lista resultante.  
  4. No reordenes de más: el orden de aparición basta.
- **Proposed retrospective:**  
  Discovery por prefijo es la regla por defecto de pytest. Confundir helper con test deja “contratos” que nunca corren. Siguiente (E2): un assert que diga fail cuando left ≠ right.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S27-T2-A-E2 (weDo, independent)
- **Diagnosis:** Teatro de verde (`siempre ok`) — patrón pedagógico fuerte. Instruction ya lo nombra; falta preamble y retrospective. Sin title.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Assert honesto: ok o fail
- **Proposed preamble:**  
  - **Contexto:** un assert de CI que siempre imprime verde no protege el merge de normalización.  
  - **Meta:** si `left != right` reportar `'fail'`, si no `'ok'`.  
  - **Éxito:** `fail` con left=`'a'` y right=`'b'`.  
  - **Límites:** no hardcodees `'ok'`; en pytest real el rewrite mostraría el diff de ambos lados.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: `print('ok')` siempre.  
  2. Compara left y right.  
  3. Imprime `'ok'` o `'fail'` según igualdad.  
  4. No cambies los valores de prueba.
- **Proposed retrospective:**  
  Teatro de verde es peor que no tener test: da confianza falsa. Un assert honesto distingue lados. Luego (E3): tabla de filas con oráculo strip (parametrize mental).
- **Code/output changes:** none
- **Validation notes:** Bien alineado al callout “Oráculo ≠ impresión” de theory.

---

### S27-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer a tabla estilo `@pytest.mark.parametrize`. Starter compara crudo. Instruction densa pero correcta. Falta preamble de “cada fila = node id conceptual” y retrospective. Sin title.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tabla parametrize con oráculo strip
- **Proposed preamble:**  
  - **Contexto:** los contratos de normalize viven en tablas `(entrada, esperado)`; cada fila es un caso conceptual en CI.  
  - **Meta:** aplicar `strip` a cada raw y reportar si coincide con el esperado.  
  - **Éxito:** `[True, True]` para los dos casos dados.  
  - **Límites:** no compares crudo; no imprimas las tuplas sin evaluar; casefold se suma en el contrato real (aquí solo strip).
- **Proposed instruction/description improvements:**  
  1. El starter hace `raw == exp` sin strip.  
  2. Usa list comprehension con `raw.strip() == exp`.  
  3. Imprime la lista de booleanos.  
  4. No borres filas de la tabla.
- **Proposed retrospective:**  
  Parametrize es una tabla que se *ejecuta*, no un print de tuplas. El error clásico es copiar el cuerpo del test tres veces. En el You Do, cada oráculo de normalize debería ser una fila mental (o real) de esa tabla.
- **Code/output changes:** none
- **Validation notes:** Transfer auténtico hacia discovery/parametrize de T2-A.

---

### S27-T2-B-DEMO (iDo)
- **Diagnosis:** Demo de aislamiento function-scope con `deepcopy`. Description OK; `why` una frase. Falta preamble del flake de orden y retrospective “session mutable contamina”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Si un test muta un fixture compartido, el siguiente puede fallar solo cuando el orden de la suite cambia. En esta demo un factory-like `contacts_fx` devuelve `deepcopy` de una lista de contactos sintéticos: el test A renombra a `"X"` y el B sigue viendo `"Luis"`. No escribas: predice `isolated` y por qué un `list.copy()` superficial no bastaría si el dict es anidado.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: function-scope es el default de pytest; session solo para recursos caros de solo lectura; deepcopy aísla dicts internos. Puente a We Do: deepcopy vs copy, elegir scope `function`, factory `make(n)`.
- **Proposed retrospective:**  
  Aislamiento function + copia profunda evita flakes de orden. El error clásico es mutar un fixture session. We Do: demostrar orig intacto, elegir el scope seguro y medir la factory.
- **Code/output changes:** none
- **Validation notes:** Output `isolated True` / `a_mut X` correcto.

---

### S27-T2-B-E1 (weDo, guided)
- **Diagnosis:** Shallow vs deep copy — guiado clásico y bien nombrado. Instruction técnica; sin title/preamble/retrospective. Feedback bueno.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** deepcopy: no contamines el original
- **Proposed preamble:**  
  - **Contexto:** un fixture de contactos sintéticos se muta en un test de matching; el siguiente test no debe ver basura.  
  - **Meta:** copiar con `deepcopy`, mutar la copia y demostrar que `orig[0]['n']` sigue en 1.  
  - **Éxito:** el entero `1`.  
  - **Límites:** no uses `copy` superficial; no mutes `orig` a propósito; una sola línea de salida.
- **Proposed instruction/description improvements:**  
  1. El starter usa `from copy import copy` (shallow).  
  2. Cambia a `deepcopy`.  
  3. Deja la mutación en `c[0]['n']=9`.  
  4. Imprime `orig[0]['n']`.
- **Proposed retrospective:**  
  `list.copy()` comparte dicts internos; `deepcopy` corta la contaminación. Ese es el mecanismo detrás de un fixture function limpio. Siguiente (E2): política de scopes para datos mutables.
- **Code/output changes:** none
- **Validation notes:** DEFECT y solution alineados.

---

### S27-T2-B-E2 (weDo, independent)
- **Diagnosis:** Elegir scope `function` desde un dict de política — buen E2 conceptual (menos “código mágico”). Instruction ya marca session como False. Falta preamble de flakes y retrospective. Sin title.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Scope seguro para datos mutables
- **Proposed preamble:**  
  - **Contexto:** pytest permite function/class/module/session; solo algunos son seguros si el fixture es una lista mutable.  
  - **Meta:** del mapa `safe_for_mutable`, elegir el scope marcado True (el default).  
  - **Éxito:** imprimir `function`.  
  - **Límites:** no elijas `session`; session solo para recursos caros de solo lectura.
- **Proposed instruction/description improvements:**  
  1. El starter hardcodea `chosen = 'session'`.  
  2. Busca el scope con valor True (p. ej. `next(... if ok)`).  
  3. Imprime ese scope.  
  4. No reescribas el dict de política a mano con todos True.
- **Proposed retrospective:**  
  function-scope es el default seguro: setup fresco por test. Session sobre listas mutables produce flakes de orden (“pasa solo si corre después de X”). Luego (E3): factory que crea N entidades por caso.
- **Code/output changes:** none
- **Validation notes:** Enseña política, no solo API de pytest.

---

### S27-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Factory fixture `make(n)` — transfer claro; starter hardcodea 0. Instruction mínima. Falta preamble y retrospective. Sin title.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Factory: longitud de make(3)
- **Proposed preamble:**  
  - **Contexto:** en tests de matching necesitas N contactos sintéticos distintos por caso, no un global compartido.  
  - **Meta:** usar la factory `make` e imprimir `len(make(3))`.  
  - **Éxito:** el entero `3`.  
  - **Límites:** no hardcodees 0 ni 3 sin llamar a `make`; ids sintéticos `c0..` (sin PII).
- **Proposed instruction/description improvements:**  
  1. El starter define `make` pero imprime `0`.  
  2. Llama `make(3)`.  
  3. Imprime su longitud.  
  4. No reescribas la factory.
- **Proposed retrospective:**  
  La factory crea entidades por caso y apoya el aislamiento. Hardcodear el tamaño no prueba ni la factory ni el contrato de ids. En el You Do, un `@pytest.fixture` o factory similar alimenta los AAA de normalize/match.
- **Code/output changes:** none
- **Validation notes:** Output `3` correcto; edge n=0 documentado en edgeCases.

---

### S27-T3-A-DEMO (iDo)
- **Diagnosis:** Demo densa de cuatro bordes (ValueError, isclose, reloj inyectado, tmp). Description lista todo; `why` una frase. Riesgo cognitivo: un newbie no sabe *qué mirar primero*. Falta preamble guiado y retrospective de flakes (reloj/float/tmp).
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Los tests de matching se rompen en producción por bordes, no por el happy path. Esta demo empaqueta cuatro: excepción tipada con mensaje, `isclose` para scores IEEE, edad con reloj *inyectado* (no `date.today()`), y lectura en directorio temporal. No escribas: anota mentalmente qué fallaría si usaras `==` en floats o el reloj real del sistema en Lima vs UTC del runner.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: cada borde evita un flake distinto; el mensaje forma parte del contrato del raise; abs_tol se documenta; tmp no escribe en el repo. Puente a We Do: isclose, match de mensaje, NamedTemporaryFile.
- **Proposed retrospective:**  
  Bordes numéricos, temporales y de I/O son parte del contrato del motor, no “extras”. El error clásico es `==` en floats o `datetime.now()` en asserts. We Do: isclose, inspeccionar el mensaje del raise y leer el tmp.
- **Code/output changes:** none
- **Validation notes:** Output multi-línea coherente con theory T3-A.

---

### S27-T3-A-E1 (weDo, guided)
- **Diagnosis:** Trampa IEEE `0.1+0.2 == 0.3` — clásico y bien puesto en scores de matching. Instruction ya advierte umbrales. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Scores con math.isclose, no ==
- **Proposed preamble:**  
  - **Contexto:** los umbrales thr_auto/thr_review del clasificador de pares usan floats; un `==` bit a bit es trampa pedagógica y de producción.  
  - **Meta:** usar `math.isclose(0.1 + 0.2, 0.3)` e imprimir el booleano.  
  - **Éxito:** `True`.  
  - **Límites:** no uses `==`; documenta tolerancia en el contrato real (aquí basta el default de isclose).
- **Proposed instruction/description improvements:**  
  1. El starter imprime `0.1 + 0.2 == 0.3` (False).  
  2. Cambia a `math.isclose(...)`.  
  3. Imprime solo el booleano.  
  4. No alteres los literales 0.1/0.2/0.3.
- **Proposed retrospective:**  
  isclose (con abs_tol/rel_tol documentados) es el hábito de scores de matching. El error clásico es igualdad exacta o redondeos opacos. Siguiente (E2): el mensaje del ValueError también es contrato.
- **Code/output changes:** none
- **Validation notes:** Output `True` correcto.

---

### S27-T3-A-E2 (weDo, independent)
- **Diagnosis:** Modelo de `pytest.raises(..., match=)` con contención de fragmento. Instruction larga y honesta sobre regex vs lab. Starter deja `matched = False`. Falta preamble más corto y retrospective. Sin title. Feedback ya es fuerte (casi demasiado largo vs spec 25–60).
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** raises + fragmento en el mensaje
- **Proposed preamble:**  
  - **Contexto:** un `raises` que solo mira el tipo acepta un mensaje basura; en CI el fragmento acelera el fix.  
  - **Meta:** capturar el `ValueError` de `int('x')` e imprimir `True` solo si el mensaje contiene `'invalid'`.  
  - **Éxito:** `True` (en CPython suele decir *invalid literal*).  
  - **Límites:** en pytest real `match=` es regex (`re.search`); aquí contención literal sin metacaracteres; no imprimas False a ciegas.
- **Proposed instruction/description improvements:**  
  1. El starter pone `matched = False` en el except.  
  2. Inspecciona `str(e)` (casefold opcional) buscando `'invalid'`.  
  3. Imprime el booleano.  
  4. No cambies el input `'x'`.
- **Proposed feedback improvement (tighten):**  
  El tipo *y* el fragmento del mensaje son contrato. En pytest real, `match=` es regex: usa `re.escape` si el texto trae metacaracteres.
- **Proposed retrospective:**  
  Mensaje + tipo = contrato de excepción. Solo el tipo es teatro parcial. Luego (E3): leer el contenido real de un archivo temporal, no asumir cadena vacía.
- **Code/output changes:** none
- **Validation notes:** Dual-track lab/pytest bien documentado en instruction actual; conservar esa honestidad al acortar.

---

### S27-T3-A-E3 (weDo, transfer)
- **Diagnosis:** NamedTemporaryFile + relectura por path. Starter imprime `''`. Transfer real de I/O. Falta preamble de “no escribir en el repo” y retrospective. Sin title.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Leer el contenido del tempfile
- **Proposed preamble:**  
  - **Contexto:** los tests de normalización a veces escriben evidencia en disco; nunca en el home ni en el árbol del repo.  
  - **Meta:** escribir `'ok'` en un `NamedTemporaryFile` (utf-8, delete=False), reabrir por path e imprimir el contenido strip.  
  - **Éxito:** la línea `ok`.  
  - **Límites:** no imprimas vacío; encoding utf-8 al escribir y leer; en prod borra en finally.
- **Proposed instruction/description improvements:**  
  1. El starter escribe pero imprime `''`.  
  2. Usa `Path(path).read_text(encoding='utf-8').strip()`.  
  3. Imprime ese texto.  
  4. No cambies el contenido escrito.
- **Proposed retrospective:**  
  El contrato de tmp es el contenido real, no un print inventado. delete=False deja path reabrable; TemporaryDirectory borra al salir. En el You Do, prefiera fixtures `tmp_path` de pytest cuando trabajes en tu máquina.
- **Code/output changes:** none
- **Validation notes:** Output `ok` correcto.

---

### S27-T3-B-DEMO (iDo)
- **Diagnosis:** Tabla de negativos de RUC sintético (formato 11 dígitos, no SUNAT). Description OK; `why` una frase. Falta preamble de “fallar controlado vs AttributeError críptico” y retrospective “mensaje con valor ofensivo sintético”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Si el motor traga un RUC basura en silencio, el matching “funciona” con datos que no debían entrar. Esta demo valida formato sintético (11 dígitos) con una tabla happy + tres negativos y exige el fragmento `"inválido"` en el mensaje. No escribas: predice por qué un `ValueError` con valor ofensivo en el mensaje gana a un genérico `invalid input` a las 2 a. m. en CI. No hay consulta SUNAT real.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: mensajes con valor sintético aceleran el fix; sin PII real ni tokens; tabla input→excepción→fragmento es el diseño. Puente a We Do: imprimir mensaje, validar arroba, f-string con campo y valor.
- **Proposed retrospective:**  
  Negativos controlados son parte del contrato público del validador. El error clásico es confiar en el happy path o filtrar PII real en el assert. We Do: mensaje vs tipo, gate de `@`, mensaje con campo nombrado.
- **Code/output changes:** none
- **Validation notes:** Output `neg_table True` / `n 4` correcto.

---

### S27-T3-B-E1 (weDo, guided)
- **Diagnosis:** Imprimir tipo vs mensaje — defecto guiado perfecto para CI. Instruction clara. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Imprime el mensaje, no el tipo
- **Proposed preamble:**  
  - **Contexto:** el caso negativo de email vacío debe dejar un mensaje legible en el log de CI.  
  - **Meta:** lanzar `ValueError('email vacío')`, capturarlo e imprimir el **texto** del contrato.  
  - **Éxito:** la línea `email vacío`.  
  - **Límites:** no imprimas `type(e).__name__`; no uses PII real; None vs vacío es otro caso (edge).
- **Proposed instruction/description improvements:**  
  1. El starter imprime `type(e).__name__` → `ValueError`.  
  2. Cambia a `print(e)` o `print(str(e))`.  
  3. Mantén el raise con el mensaje dado.  
  4. No borres el try/except.
- **Proposed retrospective:**  
  El mensaje es el contrato del negativo; el tipo solo no dice *qué* falló. Siguiente (E2): un email sintético sin `@` no puede marcar ok.
- **Code/output changes:** none
- **Validation notes:** Output `email vacío` correcto.

---

### S27-T3-B-E2 (weDo, independent)
- **Diagnosis:** Teatro de verde otra vez (siempre `'ok'`). Bien diseñado. Falta preamble y retrospective. Sin title.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Email sintético: exige arroba
- **Proposed preamble:**  
  - **Contexto:** validación mínima de contacto sintético (no RFC completo) para el intake del motor ER.  
  - **Meta:** si falta `'@'`, reportar `'invalid'`; si no, `'ok'`.  
  - **Éxito:** `invalid` con `s='sin-arroba'`.  
  - **Límites:** no imprimas siempre ok; no es validación RFC; sin PII real.
- **Proposed instruction/description improvements:**  
  1. El starter imprime `'ok'` a ciegas.  
  2. Condiciona con `'@' in s`.  
  3. Imprime `'ok'` o `'invalid'`.  
  4. No cambies el string de prueba.
- **Proposed retrospective:**  
  El negativo debe fallar de forma controlada. Teatro de verde en validación de entrada es basura en matching. Luego (E3): mensajes que nombran campo y valor ofensivo sintético.
- **Code/output changes:** none
- **Validation notes:** Output `invalid` correcto.

---

### S27-T3-B-E3 (weDo, transfer)
- **Diagnosis:** Mensaje útil con `!r` — transfer de diseño de errores. Instruction buena. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Mensaje con campo y valor ofensivo
- **Proposed preamble:**  
  - **Contexto:** en el clerical queue, el mensaje del validador es documentación viva del contrato de entrada.  
  - **Meta:** con `v=-1`, construir `campo score inválido: {v!r}`.  
  - **Éxito:** `campo score inválido: -1`.  
  - **Límites:** no uses un genérico `'error'`; no loguees tokens ni PII real; el valor es sintético.
- **Proposed instruction/description improvements:**  
  1. El starter imprime `'error'`.  
  2. Usa f-string con `!r` y el nombre del campo.  
  3. Imprime esa sola línea.  
  4. No cambies `v`.
- **Proposed retrospective:**  
  Campo + valor ofensivo sintético acelera el fix; un “error” genérico no dice dónde mirar. Ese hábito va a los negativos del You Do (`require_email`-style). Ética: nunca tokens reales en asserts de CI.
- **Code/output changes:** none
- **Validation notes:** Output exacto con `!r` de int correcto.

---

### S27-T4-A-DEMO (iDo)
- **Diagnosis:** Demo de tres bandas de umbral auto/review/non. Description OK; `why` una frase. Falta preamble de “100 % de líneas ≠ riesgo cubierto” y retrospective.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Puedes cubrir helpers de log y dejar sin caso la rama `review` que mueve el clerical queue. Esta demo ejercita las tres bandas del clasificador de pares sintéticos (0.95 auto, 0.75 review, 0.1 non) y reporta cobertura de ramas. No escribas: predice si un set con solo auto y review dejaría deuda de riesgo. Matching aquí no etiqueta fraude.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: risk coverage prioriza umbrales de negocio; el reporte es evidencia, no meta vacía del 100 % de líneas. Puente a We Do: ambas ramas hi/lo, detectar falta de `non`, porcentaje 2/3→66.
- **Proposed retrospective:**  
  Tres bandas de umbral son el núcleo del contrato de `classify_pair`. El error clásico es vanidad de % de líneas. We Do: ejercer ambas ramas, detectar deuda y reportar porcentaje legible.
- **Code/output changes:** none
- **Validation notes:** Output `full True` / tres ramas correcto.

---

### S27-T4-A-E1 (weDo, guided)
- **Diagnosis:** Solo una rama ejercida — guiado claro de branch coverage mínima. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Cubrir ambas ramas hi y lo
- **Proposed preamble:**  
  - **Contexto:** una sola llamada deja media función sin contrato; en umbrales eso es deuda de matching.  
  - **Meta:** ejercitar `f(1)` y `f(-1)` e imprimir ambas salidas.  
  - **Éxito:** `hi lo` en una línea.  
  - **Límites:** no imprimas solo una rama; no mutes la función.
- **Proposed instruction/description improvements:**  
  1. El starter solo hace `print(f(1))`.  
  2. Añade la llamada a `f(-1)`.  
  3. Imprime ambas en un solo print.  
  4. No cambies la definición de `f`.
- **Proposed retrospective:**  
  Branch coverage mínima = ambas salidas en la evidencia. Una sola llamada es teatro de “pasó el test”. Siguiente (E2): detectar si falta la banda `non` en el set de hits.
- **Code/output changes:** none
- **Validation notes:** Output `hi lo` correcto.

---

### S27-T4-A-E2 (weDo, independent)
- **Diagnosis:** Invertir membership (`in` vs `not in`) para deuda de risk coverage. Excelente E2. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** ¿Falta la rama non?
- **Proposed preamble:**  
  - **Contexto:** si CI nunca vio `non_match`, el clerical queue puede romperse en producción sin alarma.  
  - **Meta:** dado `hit={'auto','review'}`, imprimir True si falta `'non'`.  
  - **Éxito:** `True`.  
  - **Límites:** no uses `'non' in hit` (respuesta invertida); risk coverage ≠ solo line coverage.
- **Proposed instruction/description improvements:**  
  1. El starter imprime `'non' in hit` → False.  
  2. Cambia a `'non' not in hit`.  
  3. Imprime el booleano.  
  4. No alteres el set.
- **Proposed retrospective:**  
  Preguntar “¿qué rama de negocio no tiene caso?” gana a “¿llegamos al 90 % de líneas?”. Luego (E3): convertir 2 de 3 en un porcentaje entero legible para el equipo.
- **Code/output changes:** none
- **Validation notes:** Output `True` correcto.

---

### S27-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Porcentaje truncado 66 — transfer de *reporte* de evidencia. Instruction ya advierte contra meta vacía del 100 %. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Cobertura como porcentaje entero
- **Proposed preamble:**  
  - **Contexto:** el equipo lee un entero 0–100 en el README o en la retro, no una fracción 0.666.  
  - **Meta:** con k=2, n=3, imprimir `int(100 * k / n)`.  
  - **Éxito:** el entero `66`.  
  - **Límites:** no imprimas la fracción k/n; no uses solo line coverage como KPI del motor.
- **Proposed instruction/description improvements:**  
  1. El starter imprime `k / n`.  
  2. Escala a porcentaje entero truncado.  
  3. Imprime solo ese entero.  
  4. No redondees a 67 a menos que el contrato lo pida (aquí truncar).
- **Proposed retrospective:**  
  El % es evidencia accionable; la fracción cruda no se discute bien en la retro. En el You Do, reporta las tres bandas de umbral cubiertas, no un vanity score de líneas.
- **Code/output changes:** none
- **Validation notes:** Output `66` correcto (truncación int).

---

### S27-T4-B-DEMO (iDo)
- **Diagnosis:** Mutación sin casefold; test debe matar al mutante. Description OK; `why` una frase. Falta preamble de “suite verde = teatro” y retrospective del ciclo bug_repro → regression.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Cambia el código a propósito (quita `casefold`) y mira si *algún* test falla. Si la suite sigue verde, el assert es teatro de cobertura. En esta demo `good` pasa el oráculo `"ana"` y `mutant` (solo strip) no: `kills_mutant True`. No escribas: predice qué pasaría si el oráculo fuera solo un print del string crudo.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: mutación conceptual no requiere framework el día 1; si el mutante vive, añade regresión. Puente a We Do: good pasa y mutant falla; dict de falla útil; ciclo bug_repro → regression_test.
- **Proposed retrospective:**  
  Matar mutantes demuestra que el oráculo protege el contrato. El error clásico es cobertura de líneas con asserts débiles. We Do: distinguir good/mutant, fallas útiles y fijar la regresión normalizada.
- **Code/output changes:** none
- **Validation notes:** Output `test_good True` / `kills_mutant True` correcto.

---

### S27-T4-B-E1 (weDo, guided)
- **Diagnosis:** Starter exige que mutant también pase (`== 'a'`) — defecto guiado excelente. Sin title/preamble/retrospective. Feedback fuerte.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** El mutante debe fallar el oráculo
- **Proposed preamble:**  
  - **Contexto:** un test de regresión de `strip` debe pasar en el código bueno y fallar si alguien quita el strip.  
  - **Meta:** imprimir True solo si `good == 'a'` **y** `mutant != 'a'`.  
  - **Éxito:** `True` con raw `' a '`.  
  - **Límites:** no exijas que mutant también pase; si ambos pasan, no hay contrato.
- **Proposed instruction/description improvements:**  
  1. El starter hace `good == 'a' and mutant == 'a'`.  
  2. Cambia la segunda comparación a `!=`.  
  3. Imprime el booleano.  
  4. No alteres good/mutant.
- **Proposed retrospective:**  
  Buen camino verde + mutante rojo = contrato. Ambos verdes = teatro. Siguiente (E2): cuando falla, el mensaje debe traer input/expected/actual.
- **Code/output changes:** none
- **Validation notes:** Output `True` correcto.

---

### S27-T4-B-E2 (weDo, independent)
- **Diagnosis:** Dict de falla útil con roles correctos. Starter omite input e invierte expected/actual. Excelente E2. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Falla útil: input, expected, actual
- **Proposed preamble:**  
  - **Contexto:** a las 2 a. m. el colega necesita el raw sintético y ambos lados del oráculo, no un assert ciego.  
  - **Meta:** con inp/expected/actual dados, imprimir un dict con keys `input`, `expected`, `actual`.  
  - **Éxito:** `{'input': 'ANA', 'expected': 'ana', 'actual': 'Ana'}`.  
  - **Límites:** no omitas input; no inviertas roles; sin PII real en mensajes de CI.
- **Proposed instruction/description improvements:**  
  1. El starter imprime `{'expected': actual, 'actual': expected}` sin input.  
  2. Arma el dict con los tres campos en roles correctos.  
  3. Imprime el dict.  
  4. No cambies los literales de prueba.
- **Proposed retrospective:**  
  Input + expected + actual acelera el fix; roles invertidos lo retrasan. Luego (E3): cierra el ciclo bug_repro → regression_test con normalización.
- **Code/output changes:** none
- **Validation notes:** Output canónico con orden de keys de dict de inserción (Py3.7+) alineado a solution.

---

### S27-T4-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer del ciclo bug_repro → regression_test. Starter se queda en comparación cruda (False). Instruction excelente. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** De bug_repro a regression_test
- **Proposed preamble:**  
  - **Contexto:** el bug era comparar `' ANA '` con el oráculo `'ana'` sin normalizar; al cerrar el ticket debe quedar un test verde que mate mutantes sin strip/casefold.  
  - **Meta:** aplicar `casefold` + `strip` y reportar el booleano del contrato.  
  - **Éxito:** `True`.  
  - **Límites:** no te quedes en bug_repro (print False); no uses PII real; después parametriza varios raw con el mismo oráculo.
- **Proposed instruction/description improvements:**  
  1. El starter hace `raw == oracle` (False).  
  2. Normaliza: `got = raw.casefold().strip()`.  
  3. Imprime `got == oracle`.  
  4. No cambies el oráculo.
- **Proposed retrospective:**  
  bug_repro muestra el fallo; regression_test fija el oráculo normalizado para CI. Política del ticket: no cerrar sin el caso que mata al mutante. En el You Do, quita casefold a propósito y comprueba que `test_normalize_spaces` falla.
- **Code/output changes:** none
- **Validation notes:** Cierre perfecto del arco T4-B y del You Do mutante.

---

### youDo (youDo)
- **Diagnosis:** Marco de proyecto **sólido**: context CP-N3-A, objectives medibles (mapa de riesgo, ≥4 AAA, fixtures, negativos, tres ramas, mutante), requirements de ética y datos sintéticos, starter ejecutable, rubric completa, portfolioNote. **Falta** `retrospective` de defensa post-build (spec §8.3). Un true newbie puede “terminar el código” sin saber qué invariantes defender en 30 segundos.
- **Checklist:** context pass · goal pass · success pass (rubric) · constraints pass · retrospective **fail**
- **Severity:** P1
- **Proposed title:** N/A (ya tiene title de proyecto)
- **Proposed preamble:** N/A (context/objectives ya cumplen el rol de marco; no duplicar essay)
- **Proposed instruction/description improvements:**  
  Ninguno estructural. Opcional P2: en `context`, una frase que recuerde dual-track (`pytest -q` en máquina vs assert+print del lab) ya está; mantenerla. El starter comenta “Extiende: negativos… mutante” — suficiente.
- **Proposed retrospective:**  
  Antes de marcar listo: (1) ¿qué invariante de `normalize_name` o de umbral demuestras con un test que fallaría si quitas `casefold` o inviertes un thr? (2) ¿tus mensajes de negativos nombran campo y valor *sintético* sin PII real? (3) En el README, una frase de impacto medible (p. ej. “tres bandas de umbral + un mutante muerto”) que puedas defender en 30 segundos ante un lead de data eng. Matching no es fraude: di en voz alta qué *no* afirma tu suite.
- **Code/output changes:** none
- **Validation notes:** Starter corre con `starter_ok`; alinear retrospective al ciclo bug_repro → regression del T4-B.

---

## Priority order

### P0 (We Do: title + preamble + instruction solo-tarea + retrospective en los 24)
1. **S27-T1-A-E1, E2, E3** — score producto → ranking → capa max (base de priorización CP-N3-A)
2. **S27-T1-B-E1, E2, E3** — normalize real → pass honesto → matching post-normalize
3. **S27-T2-A-E1, E2, E3** — discovery → assert honesto → tabla parametrize
4. **S27-T2-B-E1, E2, E3** — deepcopy → scope function → factory
5. **S27-T3-A-E1, E2, E3** — isclose → raises+match → tempfile content
6. **S27-T3-B-E1, E2, E3** — mensaje vs tipo → email inválido → f-string de campo
7. **S27-T4-A-E1, E2, E3** — ambas ramas → falta non → % 66
8. **S27-T4-B-E1, E2, E3** — matar mutante → falla útil → regression_test

### P1
9. **Ocho iDo demos** — añadir `preamble` + `retrospective`; ampliar `why` al piso 40–90 palabras  
10. **youDo** — añadir `retrospective` de defensa (invariante, PII, frase de impacto, ética matching)

### P2
11. **Feedback We Do** — donde quede en 1 frase, anclar al clerical queue / CI / mutante (sin superar ~60 palabras)  
12. **Notas de filename** — documentar en fix notes que el id `async-concurrency` no coincide con el contenido (fuera de scope de prosa de ejercicio, pero confunde revisores)

---

## Residual risks

1. **Carga cognitiva en T3-A-DEMO:** cuatro bordes en un solo demo; el preamble propuesto mitiga, pero el Fixer no debe alargar el código — solo la prosa de atención.  
2. **Dual-track pytest vs assert+print:** las instructions ya son honestas; al separar preamble/instruction, el Fixer debe **no** borrar la nota de que `match=` es regex en pytest real.  
3. **Outputs canónicos:** ningún cambio de código/output es pedagogicamente obligatorio; alterar oráculos rompería tests del lab.  
4. **Ética matching ≠ fraude:** ya está en theory/callouts y en varias instructions; preambles de T1-B-E3 y youDo retrospective deben reforzarla sin copiar el mismo párrafo en los 24.  
5. **Fade de prosa:** al escribir 24 preambles, el Fixer debe diferenciar E1 (pasos y defecto nombrado), E2 (meta+éxito, menos migas) y E3 (superficie nueva, misma principio) — no clonar bullets con el número cambiado.  
6. **Anti-aberration en el Fix:** implementar a mano por unidad; no scripts que inyecten preambles genéricos.

---

## Fixer acceptance hints (from this review)

- [ ] 24 We Do con `title`, `preamble` (80–150 palabras o 4 bullets), `instruction` solo pasos, `retrospective` (40–80 palabras)  
- [ ] 8 I Do con `preamble` + `retrospective`; `why` reforzado  
- [ ] 1 You Do con `retrospective` de defensa  
- [ ] Outputs y solutions **intactos** salvo justificación execute-and-diff  
- [ ] Español PE profesional; solo datos sintéticos `@example.pe`  
- [ ] Sin generadores ni bulk replace de prosa  
- [ ] Sección sigue compilando en el build estático

---

Section 27 exercise pedagogy review complete. Ready for the Fixer prompt.
