# S28 Exercise Pedagogy Report (Round 1)

## Section
- **title:** Pruebas de datos, propiedades e integración
- **shortTitle:** Propiedades e integración
- **id:** `llm-agents` (archivo `s28-llm-agents.ts`; contenido = QA de datos del motor ER: propiedades, goldens, dobles e integración — no agentes LLM)
- **index:** 28
- **source:** `src/lib/course/sections/s28-llm-agents.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades de práctica/demo)
- **subtemas:** S28-T1-A invariantes/generación · T1-B idempotencia/simetría/metamórficas · T2-A schema/calidad · T2-B golden/drift/reconciliación · T3-A mocks/fakes/reloj · T3-B contratos de borde sin sobre-mocking · T4-A integración/sqlite · T4-B flakes/determinismo/CI
- **hilo de caso:** desk PE de entity resolution **CP-N3-A** / `CASO-LIM-028` (run_id `cpn3a-dataqa`); contactos sintéticos `@example.pe`; matching ≠ fraude/parentesco; fail-closed en contratos

## Method
- Leído `PEDAGOGY_EXERCISE_SPEC.md` (campos, longitudes, checklist preamble/retrospective, fade E1→E2→E3).
- Inspeccionado manualmente cada `iDo.steps[]` (8 demos), `weDo.steps[]` (24 ejercicios) y `youDo` en `s28-llm-agents.ts` (iDo ~379–593, weDo ~595–1482, youDo ~1484–1608).
- Contrastado con el hilo de la sección: suite que caza encoding, cardinalidad, orden, timeout y reanudación; seed fija; goldens con aprobación humana; dobles de HTTP/DB/reloj; sqlite `:memory:` como análogo honesto a testcontainers.
- **Sin** generadores, bucles, plantillas ni copy-paste mecánico entre unidades.
- Prosa propuesta en **español profesional peruano**, un objetivo primario por unidad.

## Hallazgos transversales (antes del ledger)

| Campo / hábito | Estado actual en S28 |
|----------------|----------------------|
| I Do `preamble` | **Ausente** en las 8 demos |
| I Do `retrospective` | **Ausente** en las 8 demos |
| I Do `description` | Presente y técnica (qué hace el demo); no sustituye preamble formal |
| I Do `why` | Presente; a menudo **1 frase** (bajo el piso 40–90 palabras del spec) |
| We Do `title` | **Ausente** en los 24 |
| We Do `preamble` | **Ausente** en los 24 |
| We Do `retrospective` | **Ausente** en los 24 |
| We Do `instruction` | Estilo denso “ID · concepto + fixture + bug + Pass embebido”: meta y éxito mezclados en un párrafo; legible para quien ya opera suites de QA, **opaco** para newbie sin escena de desk ER |
| We Do `feedback` | 1–2 frases; nombra el bug (bien); a veces ancla CI/contrato; poco *por qué importa al revisor del golden / al job de merge* |
| Starter `# DEFECT:` | **Excelente** hábito en todos; defectos bien nombrados y alineados a la solución |
| Hints | E1 casi-solución (aceptable); E3 a veces da la fórmula casi completa (andamiaje mínimo OK) |
| You Do marco | `context` / `objectives` / `requirements` / `rubric` / `portfolioNote` / starter **sólidos** y con checklist de entrega |
| You Do `retrospective` | **Ausente** |
| Código / outputs | Coherentes con theory y CP-N3-A; **no** proponer cambios de output salvo notas puntuales |

**Patrón dominante:** el andamiaje de *código* (DEFECT nombrado, oráculos canónicos, fade real E1→E3 por subtema, política `sim!=fraud`, seed/sort/reloj) es maduro y alineado al hilo ER. El andamiaje *pedagógico verbal* (preamble → instruction solo-tarea → retrospective) no existe. Un true newbie no responde con claridad: qué practico, por qué importa en un batch sintético de contactos en Lima, cómo sé que gané, qué debe quedarme al cerrar la pestaña.

**Fade E1→E2→E3 (contenido):** progresión real por subtema (p. ej. T1-A: re-seed → invariante de scores → `test_*` con generación; T2-B: drift → blocked sin approved → versión + acción; T4-B: sorted → fail_job por flake_rate → `run(seed)` determinista). **No** son tres clones con números distintos. El fade de *prosa* no se ve porque no hay preambles diferenciados.

**Severity default:** missing preamble+title+retrospective en We Do = **P0**; I Do sin preamble/retrospective = **P1** (aún tienen description+why+código); youDo sin retrospective = **P1**; polish de feedback/why = **P2** si caen preamble/instruction/retrospective.

---

## Unit ledger

### S28-T1-A-DEMO (iDo)
- **Diagnosis:** Demo sólida de propiedad no trivial: seed=1, 15 strings y assert de idempotencia de `norm`. La `description` nombra el skill; falta `preamble` que diga *qué observar* (seed + bucle + assert, no un literal “Ana”) y `retrospective` del misconception “un caso feliz basta”. El `why` es una frase.
- **Checklist:** context fail · goal partial · success partial (output visible) · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  En el desk de QA del motor ER, un solo nombre feliz no caza encoding ni espacios dobles. Esta demo modela una función estilo pytest: con `seed=1` genera 15 strings y aserta que `norm` es idempotente (`f(f(s))==f(s)`). No escribas aún: predice por qué imprimir `seed` y `n` es evidencia útil cuando un assert falla en CI, y por qué un tautología tipo `len>=0` no cuenta como propiedad.
- **Proposed instruction/description improvements:**  
  Mantener description. Ampliar `why` (~50–70 palabras): la propiedad se genera desde la invariante, no desde un ejemplo; seed fija hace reproducible el fallo; en CI real pytest descubre `test_*`; imprime seed+input al romper. Puente a We Do: re-seed por muestra, invariante de scores y `test_normalize_idempotent` con batch generado.
- **Proposed retrospective:**  
  Si puedes explicar por qué un solo literal no es pensamiento basado en propiedades, ya tienes el hábito de T1-A. El error clásico es hardcodear `True` o mirar un caso. En We Do practicarás seed reproducible, rango de scores e idempotencia con N casos.
- **Code/output changes:** none
- **Validation notes:** Output `invariant_ok True / n 15 / seed 1` alineado a theory T1-A.

---

### S28-T1-A-E1 (weDo, guided)
- **Diagnosis:** Drill guiado claro: falta re-seed antes de `b`. Instruction densa mezcla escena, meta y Pass; sin title, preamble ni retrospective. Feedback nombra el PRNG pero no ancla “por qué el job de merge miente sin seed”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Re-sembrar seed antes de cada muestra
- **Proposed preamble:**  
  - **Contexto:** en CI del matcher, dos “mismas” muestras con seed distinta son un flake disfrazado de dato.  
  - **Meta:** con `seed=0` **antes de cada** `random.random()`, obtener el mismo valor dos veces.  
  - **Éxito:** una sola línea booleana `True`.  
  - **Límites:** no compares floats a mano; no dejes el PRNG avanzar sin re-seed; sin PII real.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `seed(0)` solo una vez; `a` y `b` divergen.  
  2. Llama `random.seed(0)` otra vez antes de `b`.  
  3. Imprime solo `a == b`.  
  4. No hardcodees `True`.
- **Proposed feedback improvement:**  
  Sin re-seed, el generador avanza: el segundo `random` no es la misma muestra. Seed antes de cada muestra = reproducible en CI del ER; sin eso el gate de merge miente.
- **Proposed retrospective:**  
  Re-seed por muestra es el hábito mínimo de determinismo. El error clásico es sembrar una vez y asumir que dos lecturas son “la misma”. Siguiente (E2): medir la invariante de scores del batch, no inventar `True`.
- **Code/output changes:** none
- **Validation notes:** DEFECT bien nombrado; solution y output `True` correctos.

---

### S28-T1-A-E2 (weDo, independent)
- **Diagnosis:** Bug de hardcode `True` con score 1.2 fuera de rango — excelente para independiente. Instruction ya nombra `all(...)` y el 1.2; falta escena de contrato de dominio y cierre metacognitivo.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Invariante de scores en [0, 1]
- **Proposed preamble:**  
  - **Contexto:** un score 1.2 en el batch de matching no es “casi 1”: rompe el dominio del contrato y puede contaminar el ranking.  
  - **Meta:** con `scores = [0, 0.5, 1.2]`, calcular si **todos** están en [0, 1].  
  - **Éxito:** imprime exactamente `False` (el 1.2 falla).  
  - **Límites:** usa `all(...)`; no hardcodees `True`; 0 y 1 sí son válidos.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: imprime `True` sin mirar los datos.  
  2. Escribe `all(0 <= s <= 1 for s in scores)`.  
  3. Imprime solo el booleano.  
  4. No mutes la lista.
- **Proposed retrospective:**  
  La invariante se mide con datos, no con teatro. Hardcodear `True` esconde el 1.2. Luego (E3) generas muchos inputs con seed y asertas idempotencia de `normalize`.
- **Code/output changes:** none
- **Validation notes:** E2 con menos migas que E1; éxito observable intacto.

---

### S28-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transferencia real a función `test_*` con seed=42, N=10 y assert de idempotencia. Starter solo mira un literal — anti-patrón perfecto. Falta preamble de “propiedad real vs un caso” y retrospective puente al You Do.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** test_normalize_idempotent con seed y N casos
- **Proposed preamble:**  
  - **Contexto:** en la suite del ER, la propiedad de `normalize` debe resistir un batch generado, no un solo “Ana”.  
  - **Meta:** escribir `test_normalize_idempotent` con seed=42, 10 strings del alfabeto `'a bÁé'` y assert `f(f(s))==f(s)`.  
  - **Éxito:** dos líneas: `idempotent_ok True` y `n_cases 10`.  
  - **Límites:** no dejes `n_cases=1`; no hardcodees sin bucle; datos sintéticos.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: un literal y `return 1`.  
  2. Dentro del test: `random.seed(42)`; genera 10 strings; assert de idempotencia.  
  3. Devuelve `n_cases` real.  
  4. Imprime `idempotent_ok True` y `n_cases` con el valor devuelto.
- **Proposed retrospective:**  
  Una propiedad real genera muchos inputs y aserta la invariante. Un solo literal no es *property-based thinking*. Pregunta: ¿qué imprimirías al fallar un assert para reproducir el bug al primer intento?
- **Code/output changes:** none
- **Validation notes:** Transfer auténtico; alineado a theory T1-A y You Do `test_normalize_idempotent`.

---

### S28-T1-B-DEMO (iDo)
- **Diagnosis:** Worked example claro: simetría de Jaccard de tokens, metamórfica de padding e idempotencia de `pad_norm`. Description OK; falta preamble de “oráculo por relación, no por score mágico” y retrospective del misconception “simetría = casefold equality”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  No siempre conoces el score “correcto” absoluto del matcher, pero sí relaciones: simetría de Jaccard, padding que no cambia `normalize`. Esta demo imprime tres booleanos de propiedades. No escribas aún: predice por qué `j("a b","b a")` debe igualar el orden invertido y por qué rellenar espacios no debe mover el texto canónico.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: propiedades sin oráculo absoluto aún fallan si hay asimetría accidental o normalización rota; metamórfica ≠ igualdad casefold a secas (transformas el input y predices el movimiento de la salida). Puente a We Do: corregir j dirigido, relación under upper, all-pairs de simetría.
- **Proposed retrospective:**  
  Si puedes nombrar la *relación* que usas como oráculo, ya no dependes de un número mágico. El error clásico es confudir simetría con idempotencia. We Do: Jaccard simétrico, metamórfica de mayúsculas y simetría en todos los pares.
- **Code/output changes:** none
- **Validation notes:** Output `sym/meta/idemp True` alineado a theory T1-B.

---

### S28-T1-B-E1 (weDo, guided)
- **Diagnosis:** Starter con j **dirigido** (divide por `len(ta)`) — defect guiado excelente. Instruction densa con fórmula; sin title/preamble/retrospective. Feedback nombra el bug bien.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Jaccard simétrico |∩|/|∪|
- **Proposed preamble:**  
  - **Contexto:** en el matcher de tokens del ER, un score dirigido rompe la expectativa `sim(a,b)==sim(b,a)` y confunde al revisor.  
  - **Meta:** corregir `j` a Jaccard simétrico (casefold, unión en el denominador).  
  - **Éxito:** una línea `True` para `j(a,b)==j(b,a)` con a=`'ana pe xx'`, b=`'pe ana'`.  
  - **Límites:** no dividas solo por `len(ta)`; unión vacía → 1.0; no etiquetes fraude.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: divide por `len(ta)` (dirigido).  
  2. Cambia a `len(ta & tb) / len(ta | tb)` (y empty→1.0).  
  3. Imprime `j(a,b) == j(b,a)`.  
  4. No hardcodees `True`.
- **Proposed retrospective:**  
  Dividir solo por `len(ta)` es score dirigido: asimetría accidental. Jaccard simétrico usa la unión. Siguiente (E2): metamórfica — transformar el input y predecir la relación.
- **Code/output changes:** none
- **Validation notes:** DEFECT claro; Pass `True` correcto.

---

### S28-T1-B-E2 (weDo, independent)
- **Diagnosis:** Starter con `==` case-sensitive — buen bug de metamórfica. Instruction ya da la relación; falta escena “por qué upper no debe romper igualdad casefold” y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Metamórfica: upper no rompe eq casefold
- **Proposed preamble:**  
  - **Contexto:** si tu igualdad de texto es casefold, pasar `x` a mayúsculas no debe cambiar el veredicto de match.  
  - **Meta:** con `eq` casefold, verificar que `eq(x,y) == eq(x.upper(), y)` para x=`'Ana'`, y=`'ana'`.  
  - **Éxito:** una línea `True`.  
  - **Límites:** no uses `==` crudo; no hardcodees; la transformación es el punto pedagógico.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: imprime `x == y` (False y no es metamórfica).  
  2. Define `eq` con `casefold` en ambos lados.  
  3. Imprime `eq(x,y) == eq(x.upper(), y)`.  
  4. No alteres x/y.
- **Proposed retrospective:**  
  Metamórfica = transformar el input y predecir cómo se mueve la salida. No es “casefold equality” a secas. Luego (E3): simetría all-pairs, sin mezclar con idempotencia.
- **Code/output changes:** none
- **Validation notes:** Contrato didáctico bien delimitado vs. oráculo absoluto de score.

---

### S28-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer de **simetría** all-pairs con polaridad invertida en el starter — excelente. Instruction ya advierte no confundir con idempotencia; falta preamble de “documenta la propiedad en el nombre del test” y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Simetría all-pairs de eq casefold
- **Proposed preamble:**  
  - **Contexto:** el revisor de la suite espera que `eq` sea simétrica en *todos* los pares del lote, incluidos negativos y vacíos.  
  - **Meta:** con `eq` casefold, verificar `eq(a,b)==eq(b,a)` en tres pares.  
  - **Éxito:** una línea `True`.  
  - **Límites:** no mires solo el primer par; no inviertas la polaridad; simetría ≠ idempotencia (`f(f(x))`).
- **Proposed instruction/description improvements:**  
  1. Corrige el DEFECT: solo `pairs[0]` y `!=`.  
  2. Usa `all(eq(a,b)==eq(b,a) for a,b in pairs)`.  
  3. Imprime el booleano.  
  4. Deja el par `('x','Y')` — sigue siendo simétrico bajo casefold.
- **Proposed retrospective:**  
  Simetría es reordenar args; idempotencia es componer f consigo misma. Mezclar los nombres en el test confunde al desk. Pregunta: ¿cómo nombrarías el test en pytest para documentar la propiedad?
- **Code/output changes:** none
- **Validation notes:** Transfer alineado a theory T1-B y callout de simetría documentada.

---

### S28-T2-A-DEMO (iDo)
- **Diagnosis:** Demo clara de validador de schema con lista de errores (id/score) sobre tres filas. Description nombra el conteo; falta preamble de fail-closed legible y retrospective del misconception “booleano opaco basta”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  En el borde de ingest del ER, un registro sucio no entra en silencio: necesitas *qué* falló. Esta demo valida tres filas sintéticas y cuenta errores de id/score. No escribas aún: predice cuántos errores suma el batch y por qué la primera fila limpia imprime `ok_first True` sin inventar parentesco.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: contratos de calidad en ingest = fail-closed con lista de errores, no booleano opaco; el revisor ve `id`/`score` y detiene el batch. Puente a We Do: id requerido, etiqueta score fuera de rango y conteo de filas sucias.
- **Proposed retrospective:**  
  Lista de errores > `False` mudo. El error clásico es “arreglar” filas en silencio. We Do: contrato de id, polaridad de score y contador de dirty rows.
- **Code/output changes:** none
- **Validation notes:** Output `errors 2 / ok_first True` correcto.

---

### S28-T2-A-E1 (weDo, guided)
- **Diagnosis:** Starter siempre imprime `ok` con `r={}` — defect guiado ideal. Instruction telegráfica; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** id requerido en el borde de ingest
- **Proposed preamble:**  
  - **Contexto:** un dict vacío en el batch de contactos sintéticos no puede pasar como “ok” al almacén ER.  
  - **Meta:** si no hay `id` usable, imprimir `id requerido`; si no, `ok`.  
  - **Éxito:** una línea `id requerido` con `r = {}`.  
  - **Límites:** `not r.get('id')` cubre clave ausente y cadena vacía; no hardcodees `ok`.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: siempre `ok`.  
  2. Condiciona con `not r.get("id")`.  
  3. Imprime la etiqueta del contrato.  
  4. No inventes un id.
- **Proposed retrospective:**  
  Fail-closed en el borde: `r={}` no es ok. El mensaje legible detiene el batch. Siguiente (E2): etiqueta de score fuera de [0,1].
- **Code/output changes:** none
- **Validation notes:** Pass `id requerido` correcto.

---

### S28-T2-A-E2 (weDo, independent)
- **Diagnosis:** Polaridad invertida en bounds de score — bug clásico de contratos. Instruction ya da la fórmula; falta preamble de dominio del matching y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Etiqueta score fuera de [0, 1]
- **Proposed preamble:**  
  - **Contexto:** score=1.2 en matching no es “casi perfecto”: está fuera del dominio y debe etiquetarse como error de calidad.  
  - **Meta:** imprimir `score` si está fuera de [0,1]; si no, `ok`.  
  - **Éxito:** una línea `score`.  
  - **Límites:** 0 y 1 son válidos; no inviertas la polaridad; una línea.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: imprime `ok` cuando debería fallar.  
  2. Invierte la lógica: error si `not (0 <= score <= 1)`.  
  3. Imprime solo la etiqueta.  
  4. No cambies el valor 1.2.
- **Proposed retrospective:**  
  Polaridad invertida es un bug silencioso de contratos: el job se pone verde con basura. Luego (E3): cuenta filas con al menos un error, no el tamaño del batch.
- **Code/output changes:** none
- **Validation notes:** Output `score` correcto.

---

### S28-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer a contador de filas sucias con `validate` multi-campo. Starter cuenta `len(rows)` — anti-patrón excelente. Falta preamble de “métrica de calidad ≠ tamaño del batch” y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Contar filas con errores de validate
- **Proposed preamble:**  
  - **Contexto:** el reporte de ingest del desk no pregunta “¿cuántas filas llegaron?” sino “¿cuántas rompen el contrato?”.  
  - **Meta:** con `validate` (id no vacío + score en [0,1]), contar filas con `len(errores)>0`.  
  - **Éxito:** el entero `1` (solo la segunda fila falla).  
  - **Límites:** no uses `len(rows)`; define `validate` con lista de errores; sin PII real.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: imprime 2 (todas las filas).  
  2. Implementa `validate` → lista de errores.  
  3. `sum(1 for r in rows if validate(r))`.  
  4. Imprime solo el entero.
- **Proposed retrospective:**  
  `len(rows)` mide el batch; el contrato mide dirty rows. Aquí solo la segunda falla. Pregunta: ¿por qué devolver lista de errores y no un booleano opaco?
- **Code/output changes:** none
- **Validation notes:** Transfer alineado a theory T2-A y You Do `validate_record`.

---

### S28-T2-B-DEMO (iDo)
- **Diagnosis:** Demo mínima de drift + acción `blocked`. Description OK; falta preamble de “drift visible > golden silencioso” y retrospective del misconception “verde en CI = contrato sano”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Un golden es el snapshot versionado de salida esperada del pipeline de pares. Si actualizas el golden sin mirar el diff, escondes regresiones de matching. Esta demo compara golden vs. current y devuelve `blocked` ante drift. Observa: no hay “pass” silencioso cuando `n` cambia de 2 a 3.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: drift visible y bloqueado > golden actualizado en silencio; el PR del desk PE debe explicar *por qué* cambió el contrato. Puente a We Do: detectar drift, bloquear sin approved y leer versión del meta.
- **Proposed retrospective:**  
  Si el golden se reescribe solo, la suite deja de proteger el matching. We Do: etiqueta `drift`, `blocked` sin aprobación y par versión+acción.
- **Code/output changes:** none
- **Validation notes:** Output `drift True / action blocked` correcto.

---

### S28-T2-B-E1 (weDo, guided)
- **Diagnosis:** Starter ignora diff y dice `ok` — defect guiado perfecto. Instruction corta; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Detectar drift golden vs current
- **Proposed preamble:**  
  - **Contexto:** el primer paso de la regresión de matching es *ver* que el snapshot cambió.  
  - **Meta:** si `golden != current`, imprimir `drift`; si no, `ok`.  
  - **Éxito:** una línea `drift` con n=1 vs n=2.  
  - **Límites:** compara dicts; no hardcodees `ok`; sin PII real.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: siempre `ok`.  
  2. Condiciona con `golden != current`.  
  3. Imprime `drift` u `ok`.  
  4. No mutes los dicts.
- **Proposed retrospective:**  
  Siempre imprimir `ok` esconde el diff. Drift visible es el primer paso. Siguiente (E2): reconciliar solo con revisión humana.
- **Code/output changes:** none
- **Validation notes:** Pass `drift` correcto.

---

### S28-T2-B-E2 (weDo, independent)
- **Diagnosis:** Starter ok pese a `diff=True, approved=False` — política de reconciliación bien planteada. Falta preamble de “firma humana” y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Bloquear reconcile sin approved
- **Proposed preamble:**  
  - **Contexto:** en el desk PE, actualizar el golden sin nota de cambio esconde un matching roto hasta producción de revisión.  
  - **Meta:** si hay diff y `approved=False` → `blocked`; solo con aprobación o sin diff → `ok`.  
  - **Éxito:** una línea `blocked`.  
  - **Límites:** no digas `ok` con drift sin firma; no inventes `approved=True`.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: siempre `ok`.  
  2. `blocked` si `diff and not approved`.  
  3. Imprime solo la acción.  
  4. No cambies los booleanos del fixture.
- **Proposed retrospective:**  
  `blocked_drift` fuerza revisión antes de tocar el contrato. Reconciliar en silencio no es velocidad: es regresión oculta. Luego (E3): versión del meta + acción en dos líneas de evidencia.
- **Code/output changes:** none
- **Validation notes:** Output `blocked` correcto.

---

### S28-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a meta versionado (`golden_version=3`) + acción blocked. Starter hardcodea 0/ok — anti-patrón de evidencia de PR. Falta preamble de “evidencia del PR” y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Versión del golden y acción blocked
- **Proposed preamble:**  
  - **Contexto:** el revisor del PR necesita la versión del golden y si el drift quedó bloqueado, no un `0` inventado.  
  - **Meta:** leer `meta['golden_version']` y decidir `blocked` si hay diff sin aprobación.  
  - **Éxito:** dos líneas: `3` y `blocked`.  
  - **Límites:** no hardcodees 0/ok; lee el meta; no actualices el golden en el código.
- **Proposed instruction/description improvements:**  
  1. Corrige el DEFECT: imprime 0 y ok a mano.  
  2. `diff = meta["golden"] != current`.  
  3. Imprime versión y acción.  
  4. Deja `approved=False`.
- **Proposed retrospective:**  
  Versión + acción son evidencia del PR. Fijar 0/ok a mano no es el flujo de drift. Pregunta: ¿qué escribirías en el mensaje del PR si `approved` pasara a True?
- **Code/output changes:** none
- **Validation notes:** Transfer alineado a theory T2-B y You Do reconcile.

---

### S28-T3-A-DEMO (iDo)
- **Diagnosis:** Demo mínima Fake HTTP + reloj fijo con ISO corta. Description OK; falta preamble de “sin red ni reloj real” y retrospective del misconception “str(datetime) es el contrato”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  La suite del ER no debe depender de red ni de `datetime.now()`. Esta demo usa un fake HTTP y un reloj fijo: JSON `ok` y fecha ISO corta. No escribas aún: predice por qué `.date().isoformat()` es el oráculo del contrato y no `str(datetime)`.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: dobles controlados eliminan red y tiempo real; inyecta clock/http al constructor en código de producción. Puente a We Do: fake DB por id, ISO corta y política retry ante 5xx/timeout.
- **Proposed retrospective:**  
  Fakes rápidos y deterministas son el corazón de T3. El error clásico es parchear globales o imprimir el datetime crudo. We Do: lectura del borde, fecha ISO y retry.
- **Code/output changes:** none
- **Validation notes:** Output `True 2026-01-01` correcto.

---

### S28-T3-A-E1 (weDo, guided)
- **Diagnosis:** Starter busca `e2` (None) en vez de `e1` — defect guiado simple pero claro. Instruction OK; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Fake DB: leer name de e1
- **Proposed preamble:**  
  - **Contexto:** un fake de DB es un dict con estado real; la clave incorrecta no prueba el borde de lectura del matcher.  
  - **Meta:** implementar/usar `get_name` para la entidad `e1`.  
  - **Éxito:** una línea `Ana`.  
  - **Límites:** sin red ni sqlite aún; no busques `e2`; no mockees call-order.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: llama con `"e2"`.  
  2. Cambia a `"e1"`.  
  3. Imprime el name devuelto.  
  4. Deja el helper del borde.
- **Proposed retrospective:**  
  Fake con estado real ≠ mock de orden de llamadas. Clave incorrecta no ejercita el contrato. Siguiente (E2): fecha ISO corta del reloj fake.
- **Code/output changes:** none
- **Validation notes:** Pass `Ana` correcto.

---

### S28-T3-A-E2 (weDo, independent)
- **Diagnosis:** Starter con `str(d)` — bug de contrato de fecha bien alineado a theory. Falta preamble de “oráculo ISO” y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Fecha ISO corta con FakeClock
- **Proposed preamble:**  
  - **Contexto:** el reporte del ER pide fecha corta `YYYY-MM-DD`, no el dump completo del datetime con hora y tz.  
  - **Meta:** con `datetime(2026, 7, 20, 15, 30, tzinfo=timezone.utc)`, imprimir la fecha ISO corta.  
  - **Éxito:** una línea `2026-07-20`.  
  - **Límites:** usa `d.date().isoformat()`; no uses `str(d)`; timezone aware se mantiene en el objeto.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: `print(str(d))`.  
  2. Cambia a `d.date().isoformat()`.  
  3. Imprime solo la fecha.  
  4. No reescribas el datetime a mano.
- **Proposed retrospective:**  
  `str(datetime)` no es el contrato de fecha corta. El oráculo del lab es ISO. Luego (E3): política de retry ante 5xx o timeout sin red real.
- **Code/output changes:** none
- **Validation notes:** Output `2026-07-20` alineado a theory T3-A.

---

### S28-T3-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer de política de borde HTTP (5xx o timeout → retry). Starter invierte 5xx e ignora timeout — excelente. Falta preamble de “sin sleep real” y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Retry por 5xx o timeout del fake HTTP
- **Proposed preamble:**  
  - **Contexto:** el cliente del ER no debe marcar `ok` ante 503 o timeout largo: la política de borde es reintentar (sin `sleep` real en CI).  
  - **Meta:** si `status >= 500` o `timeout_ms > 2000` → `retry`; si no, `ok`.  
  - **Éxito:** una línea `retry` con 503 y 3000 ms.  
  - **Límites:** no inviertas 5xx; no ignores timeout; sin red real.
- **Proposed instruction/description improvements:**  
  1. Corrige el DEFECT: polaridad 5xx invertida e ignora timeout.  
  2. `retry` si `status >= 500 or timeout_ms > 2000`.  
  3. Imprime solo la etiqueta.  
  4. No uses `time.sleep`.
- **Proposed retrospective:**  
  503 y timeout largo piden retry, no ok. El fake modela la política sin sockets. Pregunta: ¿por qué un `sleep` real en CI es un flake en potencia?
- **Code/output changes:** none
- **Validation notes:** Transfer alineado a You Do FakeHTTP/timeout.

---

### S28-T3-B-DEMO (iDo)
- **Diagnosis:** Demo clara real vs overmock (`lambda: True`). Description OK; falta preamble de “no mockees lo que quieres probar” y retrospective del misconception “assert de call-order = match probado”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Si mockeas el comparador y solo asertas que “se llamó”, no pruebas matching: ocultas bugs con un `True` mágico. Esta demo contrasta igualdad casefold real con un overmock que acepta pares distintos. Observa `overmock_false_pos True` — eso es un falso positivo de la suite.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: no mockees lógica pura barata; prefiera contratos de borde (input → output/efecto); el overmock marca True en pares distintos. Puente a We Do: casefold ambos lados, detector `weak` y efecto de estado del writer.
- **Proposed retrospective:**  
  Preferir lógica real bajo prueba cuando es pura. We Do: contrato casefold simétrico, detección de overmock y filas escritas como oráculo.
- **Code/output changes:** none
- **Validation notes:** Output `real True / overmock_false_pos True` correcto.

---

### S28-T3-B-E1 (weDo, guided)
- **Diagnosis:** Starter con `lower` solo un lado — defect guiado ideal para Unicode/casefold. Instruction corta; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** casefold en ambos lados del match
- **Proposed preamble:**  
  - **Contexto:** el contrato de igualdad de texto del ER usa `casefold` en **ambos** operandos; `lower` a un lado rompe el match.  
  - **Meta:** comparar `'Ana'` y `'ANA'` con casefold bilateral.  
  - **Éxito:** una línea `True`.  
  - **Límites:** no uses lower solo a un lado; no overmockees el comparador; una línea.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `"Ana".lower() == "ANA"` (False).  
  2. Aplica `casefold()` a ambos.  
  3. Imprime el booleano.  
  4. No hardcodees `True`.
- **Proposed retrospective:**  
  Contrato asimétrico (`lower` a un lado) es un bug de borde. casefold ambos lados es el hábito del ER. Siguiente (E2): detectar cuando el doble acepta cualquier par.
- **Code/output changes:** none
- **Validation notes:** Pass `True` correcto.

---

### S28-T3-B-E2 (weDo, independent)
- **Diagnosis:** Detector de overmock débil — buen contrato de meta-QA. Instruction ya da la heurística; falta preamble de “suite que se auto-engaña” y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Detectar overmock débil (weak)
- **Proposed preamble:**  
  - **Contexto:** si el “matcher” de la suite acepta `('x','y')` y `('1','2')`, no estás probando matching: estás midiendo un lambda.  
  - **Meta:** si `f` devuelve True en ambos pares distintos → `weak`; si no, `ok`.  
  - **Éxito:** una línea `weak`.  
  - **Límites:** no imprimas `ok` por defecto; usa la heurística de pares negativos.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: imprime `ok` sin mirar `f`.  
  2. `weak` si `f("x","y") and f("1","2")`.  
  3. Imprime solo la etiqueta.  
  4. Deja el lambda que siempre True (es el sujeto del test).
- **Proposed retrospective:**  
  Detectar overmock es parte del contrato de borde. Un matcher real no acepta cualquier par. Luego (E3): aserta efecto de estado (filas + name), no orden de métodos.
- **Code/output changes:** none
- **Validation notes:** Output `weak` correcto.

---

### S28-T3-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a contrato observable de writer (rows_written + name). Starter hardcodea 0/`calls` — anti-patrón de sobre-mocking perfecto. Falta preamble y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Efecto de estado, no orden de calls
- **Proposed preamble:**  
  - **Contexto:** el revisor de la suite prefiere “¿se escribió la fila?” a “¿se llamaron tres métodos en este orden?”.  
  - **Meta:** tras un insert sintético, imprimir `rows_written` real y el name escrito.  
  - **Éxito:** dos líneas: `1` y `Ana`.  
  - **Límites:** no inventes métricas de `calls`; lee `result` y `store`; sin red.
- **Proposed instruction/description improvements:**  
  1. Corrige el DEFECT: 0 y `"calls"`.  
  2. Imprime `result["rows_written"]`.  
  3. Imprime `store[-1]["name"]`.  
  4. No mockees el orden de métodos internos.
- **Proposed retrospective:**  
  Contrato de borde = efecto observable. Sobre-mocking aserta calls y se rompe en refactors inocuos. Pregunta: ¿cuándo sí haría falta un mock de interacción (HTTP) y cuándo no?
- **Code/output changes:** none
- **Validation notes:** Transfer alineado a theory T3-B (GOOS-style: pure logic real).

---

### S28-T4-A-DEMO (iDo)
- **Diagnosis:** Integración sqlite mínima: dos homónimas y par con `id_a < id_b`. Description sólida; falta preamble de “integración real vs print teatral” y retrospective.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Una prueba de integración del ER ejerce schema + query reales, no un `print(True)`. Esta demo inserta dos entidades “Ana” en sqlite `:memory:` y materializa el par candidato con `id_a < id_b`. Observa: `pairs [('1','2')]` sale del join, no de un hardcode.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: integración mínima del pipeline de candidatos; schema + join real; sqlite en memoria es análogo honesto a testcontainers (S29 Postgres). Puente a We Do: COUNT real, C(n,2) y reanudación+NFC.
- **Proposed retrospective:**  
  Si el par no sale del motor, no es integración. We Do: SELECT COUNT, cardinalidad de pares y pending con encoding Unicode.
- **Code/output changes:** none
- **Validation notes:** Output `n 2 / pairs [('1','2')]` correcto.

---

### S28-T4-A-E1 (weDo, guided)
- **Diagnosis:** Starter hardcodea 0 sin SELECT — defect guiado ideal de “integración honesta”. Instruction OK; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** SELECT COUNT real en sqlite :memory:
- **Proposed preamble:**  
  - **Contexto:** inventar la métrica de filas no prueba que el INSERT funcionó: es teatro de integración.  
  - **Meta:** tras CREATE + INSERT, leer `COUNT(*)` del motor.  
  - **Éxito:** el entero `1`.  
  - **Límites:** no hardcodees 0; cuenta antes de close (`:memory:` se pierde); una línea.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: imprime 0.  
  2. Ejecuta `select count(*) from t` y toma `fetchone()[0]`.  
  3. Imprime el entero.  
  4. No cierres antes de contar.
- **Proposed retrospective:**  
  Integración honesta lee el store. Hardcodear 0 esconde un INSERT roto. Siguiente (E2): cardinalidad de pares C(n,2).
- **Code/output changes:** none
- **Validation notes:** Pass `1` correcto.

---

### S28-T4-A-E2 (weDo, independent)
- **Diagnosis:** Starter usa `n*n` (diagonal y dobles) — buen bug de cardinalidad. Instruction ya da la fórmula; falta preamble de “pares no ordenados del ER” y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Cardinalidad C(n,2) de pares candidatos
- **Proposed preamble:**  
  - **Contexto:** el join con `id_a < id_b` materializa pares no ordenados sin auto-pares; `n*n` infla el universo.  
  - **Meta:** con n=4, calcular C(4,2)=n*(n-1)//2.  
  - **Éxito:** una línea `6`.  
  - **Límites:** no uses `n*n`; blocking en prod reduce pares, pero aquí mides la cota ingenua.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: `n * n` → 16.  
  2. Cambia a `n * (n - 1) // 2`.  
  3. Imprime solo el entero.  
  4. No inventes un join sqlite aquí (eso fue E1).
- **Proposed retrospective:**  
  `n*n` incluye diagonal y dobles. C(n,2) es la cardinalidad de candidatos no ordenados. Luego (E3): reanudación de ids + NFC de tildes Latam.
- **Code/output changes:** none
- **Validation notes:** Output `6` correcto.

---

### S28-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer dual: pending vs done + NFC de “María” NFD. Starter reprocesa todo y marca encoding_ok False — excelente. Falta preamble de “dos contratos en un ejercicio” y retrospective; instruction densa (aceptable en E3 transfer).
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Reanudación y encoding NFC de tildes
- **Proposed preamble:**  
  - **Contexto:** un batch reanudado no debe reprocesar ids en `done`; y tildes Latam en NFD deben unificarse a NFC antes de igualar nombres.  
  - **Meta:** pendientes en orden original + `encoding_ok True` tras NFC.  
  - **Éxito:** dos líneas: `['b', 'c']` y `encoding_ok True`.  
  - **Límites:** no imprimas `items` completo; no compares NFD crudo con “María”; sin PII real.
- **Proposed instruction/description improvements:**  
  1. Corrige el DEFECT: imprime todos los items y compara NFD crudo.  
  2. `pending = [i for i in items if i not in done]`.  
  3. `unicodedata.normalize("NFC", nfd) == "María"`.  
  4. Imprime pending y `encoding_ok` con el booleano.
- **Proposed retrospective:**  
  Reanudación salta done; NFC unifica tildes. Reprocesar todo + NFD crudo falla ambos contratos. Pregunta: ¿por qué este par de checks aparece en el tagline de la sección?
- **Code/output changes:** none
- **Validation notes:** Transfer alineado a theory T4-A y You Do encoding NFC.

---

### S28-T4-B-DEMO (iDo)
- **Diagnosis:** Demo de determinismo: dos `run(3)` iguales + lista ordenada. Description OK; falta preamble de “flake = diseño incorrecto” y retrospective del misconception “retry 3 es fix”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Un flake pasa o falla sin cambio de código: random sin seed, reloj real, orden de sets. Esta demo fija seed y ordena: dos corridas CI producen la misma lista. Observa el `True` de igualdad entre corridas — eso es requisito del gate de merge, no un lujo.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: determinismo es requisito de la suite que bloquea merge; seed + sorted; retry sin root-cause no es fix. Puente a We Do: sorted de ids, fail_job por flake_rate y `run(seed)` que re-siembra.
- **Proposed retrospective:**  
  Si dos corridas con la misma seed divergen, el diseño es incorrecto. We Do: orden estable, política de gate y run determinista.
- **Code/output changes:** none
- **Validation notes:** Output `True / ['a','b','c']` correcto.

---

### S28-T4-B-E1 (weDo, guided)
- **Diagnosis:** Starter imprime lista cruda sin sorted — defect guiado ideal. Instruction OK; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** sorted antes de comparar con golden
- **Proposed preamble:**  
  - **Contexto:** el orden de un set o de una lista de inserción no es contrato estable entre corridas de CI.  
  - **Meta:** ordenar ids antes de comparar con un golden.  
  - **Éxito:** una línea `['a', 'b']`.  
  - **Límites:** usa `sorted`; no imprimas la lista cruda; una línea.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: imprime `["b","a"]`.  
  2. Aplica `sorted(...)`.  
  3. Imprime solo la lista ordenada.  
  4. No mutes in-place con `.sort()` si el oráculo espera la expresión (cualquiera que imprima `['a','b']` es OK).
- **Proposed retrospective:**  
  Sort fija el orden del batch antes del assert de golden. Siguiente (E2): política de merge con flake_rate > 0.
- **Code/output changes:** none
- **Validation notes:** Pass `['a', 'b']` correcto.

---

### S28-T4-B-E2 (weDo, independent)
- **Diagnosis:** Polaridad invertida del gate de flake_rate — bug de política de CI excelente. Instruction ya nombra fail_job; falta preamble de “retry no es fix” y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** fail_job si flake_rate > 0
- **Proposed preamble:**  
  - **Contexto:** en la suite que bloquea merge del ER, cualquier flake_rate > 0 debe fallar el job; no “promediar a verde”.  
  - **Meta:** con `flake_rate=0.01`, imprimir `fail_job` (si es 0, `ok`).  
  - **Éxito:** una línea `fail_job`.  
  - **Límites:** no inviertas la polaridad; no subas retries sin root-cause; cuarentena documentada ≠ ocultar.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: imprime `ok` cuando hay flakes.  
  2. `fail_job` si `flake_rate > 0`.  
  3. Imprime solo la etiqueta.  
  4. No cambies 0.01 a 0 para “arreglar” el test.
- **Proposed retrospective:**  
  Invertir polaridad o subir retries sin causa no es política de CI. Luego (E3): `run(seed)` que re-siembra y ordena para igualdad entre corridas.
- **Code/output changes:** none
- **Validation notes:** Output `fail_job` correcto.

---

### S28-T4-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer CI: `run(seed)` con re-seed + sorted; starter no re-siembra ni ordena — flake clásico. Falta preamble de “cada llamada re-siembra” y retrospective puente al You Do.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** run(seed) determinista con sorted
- **Proposed preamble:**  
  - **Contexto:** dos “mismas” corridas de CI deben producir el mismo batch; si no, el gate de merge es un flake.  
  - **Meta:** `run(seed)` fija seed, genera 5 letras de `'abc'` y devuelve `sorted(...)`.  
  - **Éxito:** dos líneas: `True` (`run(7)==run(7)`) y la lista ordenada de `run(7)`.  
  - **Límites:** re-siembra **dentro** de cada `run`; no dejes el PRNG avanzar entre llamadas; sin reloj real.
- **Proposed instruction/description improvements:**  
  1. Corrige el DEFECT: sin seed ni sorted.  
  2. Dentro de `run`: `random.seed(seed)`; genera; `return sorted(...)`.  
  3. Imprime igualdad de dos corridas y el resultado.  
  4. No muevas el seed al módulo fuera de `run`.
- **Proposed retrospective:**  
  Cada `run` re-siembra y ordena. Sin eso, dos corridas divergen: flake. Pregunta de cierre del módulo: ¿qué tres controles (seed, reloj, sort) documentarías en el README de la suite del You Do?
- **Code/output changes:** none
- **Validation notes:** Output `True` + lista ordenada alineado a solution; transfer al You Do CI.

---

### youDo (proyecto)
- **Diagnosis:** Marco de portfolio **sólido**: title, context con checklist de 6 criterios de aceptación, objectives, requirements, starter multi-capa, rubric 6 criterios, portfolioNote. Falta **solo** `retrospective` de defensa/reflexión post-build (spec You Do). Un newbie puede construir con el checklist, pero no tiene el cierre metacognitivo de “qué invariante demuestro / qué no prueba la suite / frase de impacto”.
- **Checklist:** context pass · goal pass · success pass (rubric + checklist) · constraints pass · retrospective **fail**
- **Severity:** P1
- **Proposed title:** (ya existe) Suite QA del motor ER — propiedades, goldens e integración
- **Proposed preamble:** N/A — el `context` actual ya cumple rol de escena + criterios; no diluir con un segundo ensayo. Opcional: 2–3 frases de apertura si el Fixer unifica el patrón de otras secciones, sin borrar el checklist.
- **Proposed instruction/description improvements:**  
  Mantener context/objectives/requirements/rubric/starter. Ningún cambio de código requerido por pedagogía. Asegurar que el Fixer no altere outputs del starter `qa_starter_ok` ni los asserts embebidos.
- **Proposed retrospective:**  
  Antes de marcar listo: (1) ¿qué invariante demuestras con seed + assert (idempotencia u otra) y qué imprimirías al fallar? (2) ¿por qué un golden con `blocked_drift` sin aprobación protege mejor al desk que un job siempre verde? (3) En el README, una frase de impacto medible (p. ej. “cero flakes en gate / drift visible”) y una línea de **límite** (matching ≠ fraude/parentesco; sin PII real). Defensa en 30 segundos: propiedades → schema/golden → dobles → integración sqlite → determinismo.
- **Code/output changes:** none
- **Validation notes:** Starter ejecutable y alineado a T1–T4; checklist de entrega ya es oráculo de aceptación.

---

## Priority order

### P0 (We Do: title + preamble + instruction solo-tarea + retrospective — 24 unidades)
1. S28-T1-A-E1, E2, E3  
2. S28-T1-B-E1, E2, E3  
3. S28-T2-A-E1, E2, E3  
4. S28-T2-B-E1, E2, E3  
5. S28-T3-A-E1, E2, E3  
6. S28-T3-B-E1, E2, E3  
7. S28-T4-A-E1, E2, E3  
8. S28-T4-B-E1, E2, E3  

### P1 (I Do preamble/retrospective + why ampliado; You Do retrospective)
1. S28-T1-A-DEMO … S28-T4-B-DEMO (8 demos)  
2. youDo retrospective  

### P2 (polish tras P0/P1)
1. Enriquecer `feedback` de We Do donde solo nombra el bug (anclar desk ER / gate de merge / revisor de golden)  
2. Asegurar longitudes del spec (title 4–12 palabras; preamble 80–150 o 4 bullets; retrospective 40–80; feedback 25–60; why 40–90)  
3. Separar en `instruction` solo pasos numerados (sacar escena al preamble) sin cambiar oráculos  

---

## Residual risks

1. **Nombre de archivo vs. contenido:** `s28-llm-agents.ts` e id `llm-agents` no reflejan el tema real (QA de datos ER). Riesgo de confusión para Fixers/orquestadores; no bloquea la pedagogía de ejercicios pero conviene documentarlo en el fix o en un follow-up de naming.
2. **Instructions densas actuales:** al mover escena a preamble, el Fixer debe **acortar** instruction a pasos (40–100 palabras) sin borrar el ID del ejercicio ni el oráculo de salida.
3. **Hints E1 casi-solución:** aceptable en guided; no reescribir hints salvo que spoileen demasiado el E3 (p. ej. T4-A-E3 ya da NFC y list comp — OK para transfer mínimo).
4. **Longitud de feedback:** varios feedbacks ya están cerca del piso del spec y son correctos; priorizar P0 fields antes de reescribir feedback.
5. **You Do starter largo:** no es un ejercicio bare-terminal; el riesgo es solo la ausencia de retrospective de defensa — no rehacer el proyecto.
6. **Sin cambios de código/output propuestos:** los oráculos y DEFECT están maduros; el Fixer no debe “mejorar” soluciones al añadir prosa.
7. **Anti-aberración en Fix:** aplicar campos unidad por unidad a mano; no plantilla global de preamble para las 24 We Do.

---

## Counts summary for Fixer

| Área | Unidades | Acción principal |
|------|----------|------------------|
| iDo | 8 | +`preamble`, +`retrospective`, ampliar `why` |
| weDo | 24 | +`title`, +`preamble`, reescribir `instruction` a pasos, +`retrospective`; opcional polish `feedback` |
| youDo | 1 | +`retrospective` de defensa |
| Code/output | 0 cambios requeridos | Preservar outputs y DEFECT |

Section 28 exercise pedagogy review complete. Ready for the Fixer prompt.
