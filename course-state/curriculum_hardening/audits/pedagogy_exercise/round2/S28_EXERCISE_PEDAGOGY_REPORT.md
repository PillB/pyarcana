# S28 Exercise Pedagogy Report (Round 2)

## Section
- **title:** Pruebas de datos, propiedades e integración
- **shortTitle:** Propiedades e integración
- **id:** `llm-agents` (archivo `s28-llm-agents.ts`; contenido = QA de datos del motor ER: propiedades, goldens, dobles e integración — **no** agentes LLM)
- **index:** 28
- **source:** `src/lib/course/sections/s28-llm-agents.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades)
- **subtemas:** T1-A invariantes/generación · T1-B idempotencia/simetría/metamórficas · T2-A schema/calidad · T2-B golden/drift/reconciliación · T3-A mocks/fakes/reloj · T3-B contratos de borde sin sobre-mocking · T4-A integración/sqlite · T4-B flakes/determinismo/CI
- **hilo:** desk PE **CP-N3-A** / `CASO-LIM-028` (run_id `cpn3a-dataqa`); contactos sintéticos `@example.pe`; matching ≠ fraude/parentesco; fail-closed; seed/sort/reloj
- **Round 1 context:** `round1/S28_EXERCISE_PEDAGOGY_REPORT.md` (solo contraste; **no** rubber-stamp)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (preamble/retrospective checklists, E1→E3 fade, length targets, anti-aberration).
- Manually re-inspected **current** source for every `iDo.steps[]` (8), `weDo.steps[]` (24) y `youDo` (title, preamble, instruction, feedback, retrospective, starter `# DEFECT:`, solution output, why).
- Scored for a **true newbie** (qué / por qué / éxito / qué queda), independent of Round-1 proposals.
- Word counts and feedback↔retrospective token overlap measured **only** as gates (no bulk prose generation).
- Spot-checked integrity traps (starter stdout ≠ solution stdout) on representative units across T1–T4.
- No generators, bulk templates, or source edits.

## Global findings (post Round-1 fix)

| Area | Status | Residual impact |
|------|--------|-----------------|
| **Field coverage** | Completa: 8 iDo con `preamble`+`why`+`retrospective`; 24 weDo con `title`+`preamble`+`instruction`+`feedback`+`retrospective`; youDo con `retrospective` + marco sólido | Round-1 P0 “cero campos” **cerrado** |
| **We Do titles** | Presentes, 3–8 palabras, español PE + identificadores de dominio (Jaccard, NFC, `run(seed)`); skill-aligned | Pass (T1-B-E1 con 3 tokens + símbolos: leve bajo piso 4) |
| **Preamble shape** | weDo en bullets contexto/meta/éxito/límites; iDo narrativos con predicción + “no escribas” | Pass en estructura; bullets a menudo 45–65 w (aceptable por spec “4 short bullets”); iDo narrativos 44–69 w (varios bajo 80 narrativo) |
| **Instruction = steps** | Solo-tarea, ordenados 1–4; E1 nombra DEFECT; E2/E3 menos escena | Pass — casi todas 22–39 w (bajo piso 40; legibles y no bloquear) |
| **E1→E2→E3 fade** | Superficies distintas por subtema (re-seed → scores → `test_*` batch; j dirigido → metamórfica upper → all-pairs; id → score → dirty rows; drift → blocked → version+acción; fake DB → ISO → retry; casefold → weak → estado; COUNT → C(n,2) → resume+NFC; sorted → fail_job → `run(seed)`) | Pass — **no** clones numéricos |
| **Feedback vs retrospective** | Feedback suele razonar el bug; en **~15** unidades el retro **eco** del feedback (jaccard tokens ≥0.28; peores: T3-A-E3 0.86, T4-A-E3 0.68, T2-A-E3 0.53) | Residual **P2** sistemático |
| **Retrospective length** | Casi todas weDo 17–38 w (spec 40–80); iDo 21–45 w; youDo 81 w en rango | Residual **P2**: alargar + self-check donde solo hay puente E2 |
| **iDo why** | 5 de 8 bajo 40 w (T2-B, T3-A/B, T4-A/B); T1-A/B y T2-A en/cerca de rango | Residual **P2** al expandir solo si se toca la unidad |
| **Código/outputs** | Coherentes con theory y hilo; `# DEFECT:` excelente; **wrong ≠ right** en traps verificados | **Sin** hueco de integridad tipo wrong≈right |
| **youDo frame** | context CP-N3-A + checklist 6 criterios, objectives, requirements, starter multi-capa, rubric 6, portfolioNote, retrospective de defensa | Pass (**A**) |
| **Typo** | T1-B-DEMO retro: **«confudir»** → confundir | **P2** fix puntual |
| **Hints E3** | Algunos casi spoilean (fórmulas); aceptable como andamiaje mínimo de transfer | Residual **P2** opcional |

**Net:** Round 1 cerró el vacío sistemático de prosa verbal. Round 2 **no** es rubber-stamp: la sección está **lista para learner** en la gran mayoría de unidades (newbie responde qué/por qué/éxito). Residuales son **calidad** (eco feedback/retro, retros cortas sin metacognición extra, `why`/feedback bajo piso, typo). **No** hay defectos de integridad wrong≈right ni preambles ausentes. Prioridad del Fixer R2 = **P2 polish selectivo**, no reescritura estructural.

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

### S28-T1-A-DEMO (iDo) — **A**
- **Diagnosis:** Worked example sólido: seed=1, 15 strings, assert de idempotencia de `norm`. Preamble (69 w) ancla desk ER + predicción seed/n vs tautología. `why` (60 w) en rango; retro (45 w) repara “un literal basta” y puente We Do. Output canónico intacto.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S28-T1-A-E1 (weDo, guided) — **A**
- **Diagnosis:** Title claro; bullets con éxito `True`; instruction nombra seed única; feedback ancla gate de merge; retro (38 w) misconception + puente E2. Starter `False` → solution `True` (discrimina).
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: retro +2 w self-check “¿qué imprimirías en CI si a!=b?”)
- **Proposed residual:** none required
- **Code/output changes:** none

### S28-T1-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Hardcode `True` con score 1.2 — excelente. Preamble/meta/éxito claros. Instruction da la fórmula `all(...)` casi completa (aceptable en independent; un poco receta). Feedback y retro solapan “teatro / hardcode True / 1.2”; retro corta (27 w).
- **Checklist:** all pass; retro partial (eco + longitud)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  El dominio [0, 1] se **mide** sobre el batch; un `True` de teatro pone verde al merge con basura en el ranking. El error clásico es “el test ya pasaba, no toqué los datos”. Pregunta: ¿qué reportarías al revisor si el único fallo es 1.2? Luego (E3) generas N inputs con seed y asertas idempotencia de `normalize`.
- **Code/output changes:** none

### S28-T1-A-E3 (weDo, transfer) — **B**
- **Diagnosis:** Transfer real a `test_*` con seed=42 y N=10. Preamble fuerte. Feedback y retro eco alto (j≈0.33): ambos abren “propiedad real genera muchos inputs… un solo literal”. Retro ya tiene self-check (bien); falta diferenciar del feedback.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Property-based thinking = invariante + generación + assert, no un caso “Ana”. El error clásico es devolver `n_cases=1` o hardcodear el print final. Pregunta: al fallar un assert, ¿qué tres datos (seed, input, expected/actual) harían reproducible el bug al primer intento? Ese hábito alimenta el You Do `test_normalize_idempotent`.
- **Code/output changes:** none

---

### S28-T1-B-DEMO (iDo) — **B**
- **Diagnosis:** Simetría + metamórfica + idempotencia en un worked example claro. Preamble (53 w) pide predicción de relaciones. `why` (44 w) OK. Retro (37 w) útil pero typo **«confudir»** y sin self-check.
- **Checklist:** all pass; retro partial (typo + longitud)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Si puedes nombrar la *relación* que usas como oráculo, ya no dependes de un número mágico de score. El error clásico es **confundir** simetría con idempotencia (reordenar args ≠ componer `f` consigo misma). Pregunta: ¿qué nombre de test documentaría la simetría de Jaccard en pytest? We Do: j simétrico, metamórfica under upper y all-pairs.
- **Code/output changes:** none

### S28-T1-B-E1 (weDo, guided) — **B**
- **Diagnosis:** j dirigido (`len(ta)`) es defect guiado excelente. Title corto (3 tokens + símbolos). Feedback y retro casi clones (“Dividir solo por len(ta)… Jaccard simétrico usa la unión”). Feedback 22 w (bajo 25).
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed title (optional):** Jaccard simétrico con unión en el denominador
- **Proposed retrospective (replace):**  
  Un score dirigido rompe la expectativa del revisor (`sim(a,b)==sim(b,a)`) aunque el happy path “se vea bien”. Jaccard canónico usa |∩|/|∪|; empty→1.0. Pregunta: ¿cómo documentarías una distancia *dirigida* para que nadie asuma simetría? Siguiente (E2): metamórfica — transformar el input y predecir la relación.
- **Proposed feedback (optional expand):**  
  Dividir solo por `len(ta)` es score dirigido: `j(a,b)≠j(b,a)`. Jaccard simétrico usa la unión; el revisor del matcher espera simetría documentada en el nombre del test, no un número mágico de score.
- **Code/output changes:** none

### S28-T1-B-E2 (weDo, independent) — **A−**
- **Diagnosis:** Starter `x==y` vs relación metamórfica — excelente. Preamble delimita bien metamórfica vs casefold a secas. Feedback razona; retro añade puente E3 sin eco total. Feedback 24 w (borde).
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: feedback +1 frase “oráculo sin score absoluto”)
- **Proposed residual:** none required
- **Code/output changes:** none

### S28-T1-B-E3 (weDo, transfer) — **B**
- **Diagnosis:** All-pairs + polaridad invertida en starter — transfer auténtico. Feedback y retro eco alto (j≈0.45) en “simetría vs idempotencia”. Retro ya tiene self-check de naming; reescribir para no clonar feedback.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  All-pairs evita el anti-patrón de mirar solo el happy path (`pairs[0]`). El error clásico es invertir `!=` “para que falle algo” o mezclar el nombre del test con `f(f(x))`. Pregunta: con el par `('x','Y')`, ¿por qué la simetría sigue siendo True bajo casefold? Documenta la propiedad en el nombre del test antes del You Do.
- **Code/output changes:** none

---

### S28-T2-A-DEMO (iDo) — **B**
- **Diagnosis:** Validador con lista de errores + conteo; preamble pide predicción de `errors 2`. `why` 40 w (piso). Retro 27 w: principio + misconception + puente, pero telegráfica.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Lista de errores legible > `False` mudo: el revisor ve *qué* rompió el contrato y detiene el batch. El error clásico es “arreglar” filas en silencio o devolver un booleano opaco. Pregunta: ¿qué dos etiquetas esperas en la fila sucia del demo? We Do: id requerido, polaridad de score y contador de dirty rows.
- **Code/output changes:** none

### S28-T2-A-E1 (weDo, guided) — **B**
- **Diagnosis:** Starter siempre `ok` con `r={}` — ideal E1. Feedback y retro eco (j≈0.41) en “Fail-closed… r={} no es ok”. Retro 23 w.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  En el borde de ingest, un dict vacío no es “casi válido”: sin `id` usable el almacén ER no recibe la fila. El mensaje `id requerido` es evidencia para el revisor, no un castigo cosmético. Pregunta: ¿`id=""` y clave ausente deben fallar igual? Siguiente (E2): etiqueta de score fuera de [0,1].
- **Code/output changes:** none

### S28-T2-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Polaridad invertida de bounds — bug clásico. Feedback/retro eco “polaridad invertida… job verde con basura”. Discrimina bien (`ok` vs `score`).
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  0 y 1 son válidos; 1.2 no es “casi perfecto”. Invertir el `if` es un bug silencioso de contratos: el gate se pone verde y el ranking se contamina. Pregunta: ¿por qué el éxito del ejercicio es la etiqueta `score` y no un booleano? Luego (E3): cuenta filas con al menos un error, no el tamaño del batch.
- **Code/output changes:** none

### S28-T2-A-E3 (weDo, transfer) — **B**
- **Diagnosis:** `len(rows)` vs dirty rows — transfer claro. Eco muy alto (j≈0.53) entre feedback y retro; retro ya tiene self-check sobre lista vs booleano (mantener).
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Volumen del batch ≠ calidad del batch: aquí solo la segunda fila rompe id/score. El error clásico es imprimir `2` porque “hay dos filas”. Pregunta: ¿por qué `validate` devuelve lista de errores y no un booleano opaco cuando el desk debe fallar cerrado? Ese contador alimenta el reporte de ingest del You Do.
- **Code/output changes:** none  
- **Note:** `sum(1 for r in rows if validate(r))` confía en truthiness de lista no vacía — correcto; opcional en instruction aclarar `if validate(r)` ≡ hay errores (P2 minúsculo).

---

### S28-T2-B-DEMO (iDo) — **B**
- **Diagnosis:** Drift + `blocked` mínimo y legible. Preamble ancla “no pass silencioso”. `why` 32 w (bajo). Retro 24 w telegráfica.
- **Checklist:** all pass; why/retro partial (longitud)
- **Severity residual:** P2
- **Proposed why (expand ~+15 w):**  
  Drift visible y bloqueado > golden actualizado en silencio. El PR del desk PE debe explicar *por qué* cambió el contrato de pares; un job verde sin diff legible esconde matching roto. We Do: etiqueta `drift`, `blocked` sin approved y par versión+acción como evidencia de revisión.
- **Proposed retrospective (expand):**  
  Si el golden se reescribe solo, la suite deja de proteger el matching: el contrato se mueve con el bug. El error clásico es “actualizar snapshot para poner CI en verde”. Pregunta: ¿quién debe firmar un cambio de golden? We Do: `drift`, `blocked` sin aprobación y versión+acción.
- **Code/output changes:** none

### S28-T2-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Siempre `ok` pese a n=1 vs n=2. Eco feedback/retro (j≈0.42); retro **19 w** (la más corta del módulo junto con T4-A-E1).
- **Checklist:** all pass; retro partial (eco + muy corta)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Ver el diff es el primer paso de la regresión: sin etiqueta `drift`, el desk no sabe que el snapshot de pares cambió. El error clásico es hardcodear `ok` “porque el pipeline corrió”. Pregunta: ¿qué mostrarías en expected vs. actual en el log de CI? Siguiente (E2): reconciliar solo con revisión humana.
- **Code/output changes:** none

### S28-T2-B-E2 (weDo, independent) — **A−**
- **Diagnosis:** Política `blocked` sin approved — bien anclada al desk PE. Feedback y retro se solapan en “silencio = regresión” pero retro añade “no es velocidad” y puente E3. Feedback 22 w.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: alinear wording sin clonar la primera frase del feedback)
- **Proposed residual:** none required
- **Code/output changes:** none

### S28-T2-B-E3 (weDo, transfer) — **B**
- **Diagnosis:** Meta versionado + blocked — evidencia de PR. Eco (j≈0.39) en “versión + acción / 0/ok a mano”; self-check del PR message es bueno — reescribir sin clonar.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  El revisor del PR necesita la versión del golden y la acción real, no un `0` inventado. El error clásico es “arreglar” el test imprimiendo lo esperado a mano. Pregunta: si `approved` pasara a True, ¿qué una línea de changelog pondrías en el PR? Eso es el flujo de reconcile del You Do.
- **Code/output changes:** none

---

### S28-T3-A-DEMO (iDo) — **B**
- **Diagnosis:** Fake HTTP + reloj fijo; preamble predice ISO corta vs `str(datetime)`. `why` 31 w y retro 29 w bajo piso; contenido correcto.
- **Checklist:** all pass; why/retro partial (longitud)
- **Severity residual:** P2
- **Proposed why (expand):**  
  Dobles controlados eliminan red y tiempo real de la suite: el oráculo es JSON `ok` y fecha ISO corta, no el wall clock. En código de producción inyecta clock/http al constructor; no parchees globales. We Do: fake DB por id, ISO corta y política retry ante 5xx/timeout sin `sleep`.
- **Proposed retrospective (expand):**  
  Fakes rápidos y deterministas son el corazón de T3. El error clásico es parchear `datetime.now` global o imprimir el datetime crudo como contrato. Pregunta: ¿por qué `.date().isoformat()` es más estable en asserts que `str(d)`? We Do: lectura del borde, fecha ISO y retry.
- **Code/output changes:** none

### S28-T3-A-E1 (weDo, guided) — **A−**
- **Diagnosis:** Drill muy delgado (e2→e1) pero pedagogía de “clave del borde” clara; preamble/feedback razonables; retro 24 w con puente. Discrimina `None` vs `Ana`.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: retro +self-check “¿qué devolvería un mock de call-order aquí?”)
- **Proposed residual:** none required
- **Code/output changes:** none

### S28-T3-A-E2 (weDo, independent) — **A−**
- **Diagnosis:** `str(d)` vs ISO corta — alineado a theory. Feedback 22 w; retro distinta y con puente E3. Éxito exacto `2026-07-20`.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S28-T3-A-E3 (weDo, transfer) — **C+**
- **Diagnosis:** Política retry 5xx/timeout — transfer bueno. **Eco extremo** feedback/retro (j≈0.86): casi la misma frase + self-check en retro. Debe reescribirse el retro para metacognición (cuándo sleep / flake), no repetir el bug.
- **Checklist:** all pass; retro partial (eco severo)
- **Severity residual:** P2 (prioridad alta dentro de P2)
- **Proposed retrospective (replace):**  
  La política de borde se prueba con un fake: sin sockets y sin `time.sleep`. El error clásico es marcar `ok` ante 503 o ignorar timeout “porque a veces responde”. Pregunta: ¿por qué un `sleep` real en CI es un flake en potencia aunque “arregle” un caso local? Ese hábito alimenta FakeHTTP del You Do.
- **Code/output changes:** none

---

### S28-T3-B-DEMO (iDo) — **B**
- **Diagnosis:** real vs overmock claro; preamble nombra falso positivo de suite. `why` 35 w; retro **21 w** (muy corta, casi solo puente).
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Preferir lógica real bajo prueba cuando es pura y barata: mockear el comparador esconde bugs con un `True` mágico. El error clásico es asertar “se llamó” en vez de “el par distinto no matchea”. Pregunta: ¿qué prueba el flag `overmock_false_pos` al desk? We Do: casefold bilateral, detector `weak` y filas escritas como oráculo.
- **Code/output changes:** none

### S28-T3-B-E1 (weDo, guided) — **A−**
- **Diagnosis:** `lower` unilateral — defect guiado ideal. Feedback y retro se solapan en casefold bilateral pero retro añade puente E2. Discrimina False→True.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S28-T3-B-E2 (weDo, independent) — **A**
- **Diagnosis:** Detector `weak` sobre lambda siempre-True — meta-QA excelente. Preamble “suite que se auto-engaña”; feedback y retro complementarios (heurística vs “matcher real no acepta cualquier par”).
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S28-T3-B-E3 (weDo, transfer) — **B**
- **Diagnosis:** Estado (rows + name) vs calls — transfer GOOS-style fuerte. Eco (j≈0.48) en “efecto observable / sobre-mocking”; self-check de cuándo mockear HTTP es bueno — reescribir sin clonar.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  El oráculo del writer es el store, no el contador de métodos internos. Sobre-mocking se rompe en refactors inocuos y da falsa confianza. Pregunta: ¿cuándo sí haría falta un mock de interacción (HTTP de terceros) y cuándo basta el fake con estado? Lleva ese criterio al `test_doubles` del You Do.
- **Code/output changes:** none

---

### S28-T4-A-DEMO (iDo) — **B**
- **Diagnosis:** Integración sqlite real (join id_a < id_b). Preamble “no print(True)”. `why` 28 w y retro 22 w cortos; principio correcto.
- **Checklist:** all pass; why/retro partial (longitud)
- **Severity residual:** P2
- **Proposed why (expand):**  
  Integración mínima del pipeline de candidatos: schema + join real, no un booleano teatral. sqlite `:memory:` es análogo honesto a testcontainers (S29 Postgres); el par sale del motor. We Do: SELECT COUNT, cardinalidad C(n,2) y reanudación+NFC de tildes Latam.
- **Proposed retrospective (expand):**  
  Si el par no sale del motor, no es integración: hardcodear `pairs` esconde un JOIN roto. El error clásico es “el test pasó porque imprimí lo esperado”. Pregunta: ¿por qué `id_a < id_b` evita auto-pares y dobles? We Do: COUNT, C(n,2) y pending con encoding Unicode.
- **Code/output changes:** none

### S28-T4-A-E1 (weDo, guided) — **B**
- **Diagnosis:** Hardcode 0 vs COUNT real — ideal. Retro **17 w** (mínima del módulo): solo principio + puente, sin self-check.
- **Checklist:** all pass; retro partial (muy corta)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Integración honesta lee el store con SQL, no inventa la métrica. Hardcodear `0` esconde un INSERT roto o un close prematuro de `:memory:`. Pregunta: ¿en qué momento del script debes contar para no perder la base en memoria? Siguiente (E2): cardinalidad de pares C(n,2).
- **Code/output changes:** none

### S28-T4-A-E2 (weDo, independent) — **B**
- **Diagnosis:** `n*n` vs C(n,2) — buen bug de cardinalidad ER. Eco (j≈0.43) feedback/retro en “n*n diagonal y dobles”.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  El join con `id_a < id_b` materializa pares no ordenados; `n*n` infla el universo con diagonal y dobles. C(n,2) es la cota ingenua antes de blocking en prod. Pregunta: con n=4, ¿por qué 16 engaña al revisor de cardinalidad? Luego (E3): reanudación de ids + NFC de tildes Latam.
- **Code/output changes:** none

### S28-T4-A-E3 (weDo, transfer) — **B**
- **Diagnosis:** Dual resume + NFC — alineado al tagline de la sección. Eco alto (j≈0.68); self-check del tagline es bueno — mantener idea, reescribir prosa.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Un batch reanudado salta `done`; NFC unifica tildes Latam antes de igualar nombres. Reprocesar todo + comparar NFD crudo falla ambos contratos a la vez. Pregunta: ¿por qué encoding y reanudación aparecen juntos en el tagline de S28 (no solo en un test aislado)? Llévalos al `test_integration` del portfolio.
- **Code/output changes:** none

---

### S28-T4-B-DEMO (iDo) — **B**
- **Diagnosis:** Dos `run(3)` + sorted — determinismo visible. Preamble “flake = diseño”. `why` 32 w; retro 22 w corta pero con misconception implícito.
- **Checklist:** all pass; why/retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Si dos corridas con la misma seed divergen, el diseño es incorrecto — no “mala suerte de CI”. El error clásico es subir retries sin root-cause y llamar a eso un fix. Pregunta: ¿qué tres controles (seed, reloj, sort) fijarías antes del gate de merge? We Do: sorted de ids, fail_job por flake_rate y `run(seed)` que re-siembra.
- **Code/output changes:** none

### S28-T4-B-E1 (weDo, guided) — **B**
- **Diagnosis:** sorted antes de golden — claro. Retro 20 w (solo principio + puente E2); feedback 24 w en el piso.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  El orden de un set o de inserción no es contrato estable entre corridas. `sorted` fija el batch antes del assert de golden de pares. El error clásico es culpar a “Python no determinista” sin ordenar. Pregunta: ¿serializarías el golden con keys ordenadas en JSON? Siguiente (E2): política de merge con flake_rate > 0.
- **Code/output changes:** none

### S28-T4-B-E2 (weDo, independent) — **A−**
- **Diagnosis:** Polaridad del gate flake_rate — excelente política de CI. Feedback razona retries sin causa; retro corta pero distinta (puente a `run(seed)`). Discrimina `ok` vs `fail_job`.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: retro +self-check “¿cuarentena documentada ≠ borrar el test?”)
- **Proposed residual:** none required
- **Code/output changes:** none

### S28-T4-B-E3 (weDo, transfer) — **A−**
- **Diagnosis:** `run(seed)` re-siembra + sorted — cierre del módulo fuerte. Feedback y retro se solapan en “cada run re-siembra”, pero retro añade self-check de tres controles al README del You Do (valioso). Output canónico de lista ordenada intacto.
- **Checklist:** all pass; retro partial (eco leve)
- **Severity residual:** P2 leve
- **Proposed retrospective (optional replace):**  
  Cada llamada a `run` debe re-sembrar *dentro* de la función y devolver orden estable; si no, el gate de merge es un flake disfrazado de test. El error clásico es sembrar una vez a nivel de módulo. Pregunta de cierre: ¿qué tres controles (seed, reloj, sort) documentarías en el README de la suite del You Do antes de pedir review?
- **Code/output changes:** none

---

### youDo (proyecto) — **A**
- **Diagnosis:** Marco de portfolio **completo y maduro**: title, context con checklist de 6 criterios de aceptación, objectives, requirements, starter multi-capa ejecutable (`qa_starter_ok`), rubric 6 criterios, portfolioNote, retrospective de defensa (81 w) con tres preguntas + pitch 30 s. Un newbie puede construir y defender. Sin cambio de código requerido por pedagogía.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required (no diluir el `context` con un segundo essay)
- **Code/output changes:** none

---

## Priority order

### P0
Ninguno. Cobertura de campos y oráculos están cerrados post Round-1.

### P1
Ninguno crítico para true-newbie (éxito observable y escena presentes en todas las unidades).

### P2 (Fixer R2 — polish selectivo, no reescritura masiva)

**A. Ecos feedback↔retrospective (reemplazar solo `retrospective` salvo nota):**  
1. **Alta prioridad:** S28-T3-A-E3 (j≈0.86), S28-T4-A-E3 (j≈0.68), S28-T2-A-E3 (j≈0.53), S28-T3-B-E3 (j≈0.48), S28-T1-B-E3 (j≈0.45)  
2. **Media:** S28-T2-B-E1, S28-T2-A-E1, S28-T3-A-E1, S28-T4-A-E2, S28-T2-A-E2, S28-T2-B-E3, S28-T1-B-E1, S28-T1-A-E3, S28-T1-A-E2  

**B. Retrospectives muy cortas (<25 w) — expandir a 40–80 con principle + misconception + transfer + opcional self-check:**  
S28-T4-A-E1 (17 w), S28-T2-B-E1 (19 w), S28-T4-B-E1 (20 w), S28-T3-B-DEMO (21 w), S28-T4-A-DEMO / T4-B-DEMO / T2-B-DEMO (22–24 w), S28-T2-A-E1 (23 w)

**C. Typo:** S28-T1-B-DEMO retrospective «confudir» → **confundir** (o usar texto propuesto arriba).

**D. iDo `why` bajo 40 w (solo si se toca la unidad):** T2-B-DEMO, T3-A-DEMO, T3-B-DEMO, T4-A-DEMO, T4-B-DEMO.

**E. Opcional menor:**  
- Title T1-B-E1 → “Jaccard simétrico con unión en el denominador”  
- Feedback &lt;25 w: T1-B-E1/E3, T2-B-E2, T3-A-E2 (expandir 1 frase de job/desk)  
- Instruction bajo 40 w: no bloquear; solo alargar si el Fixer reabre la unidad  
- Instruction T2-A-E3: aclarar truthiness de lista de errores  

---

## Residual risks

1. **Nombre de archivo vs. contenido:** `s28-llm-agents.ts` / id `llm-agents` sigue sin reflejar QA de datos ER. No bloquea pedagogía de ejercicios; follow-up de naming.
2. **Eco sistemático feedback/retro:** patrón de Round-1 Fix (pegar principio del feedback en el retro). El Fixer R2 debe **reescribir** retros a mano, no search-replace global.
3. **Longitudes bajo piso del spec:** instructions cortas son legibles (task-only); no forzar relleno. Priorizar retros y ecos.
4. **Hints E3 casi-solución:** aceptable en transfer; no reescribir salvo spoiler que quite el trabajo del learner.
5. **You Do starter largo:** no es bare-terminal; no rehacer el proyecto en R2.
6. **Sin cambios de código/output propuestos:** oráculos y DEFECT maduros; el Fixer no debe “mejorar” soluciones al pulir prosa.
7. **Anti-aberración en Fix R2:** unidad por unidad; no plantilla de retrospective para las 24 We Do.

---

## Counts summary for Fixer R2

| Área | Unidades | Acción principal |
|------|----------|------------------|
| iDo | 8 | P2: typo T1-B; expandir 4–5 `why`/`retrospective` cortos |
| weDo | 24 | P2: reescribir ~12–15 `retrospective` con eco o &lt;25 w; opcional polish feedback/title |
| youDo | 1 | **none** |
| Code/output | 0 cambios requeridos | Preservar outputs y DEFECT |

## Integrity spot-check (starter ≠ solution)

| Unit | Starter (wrong) | Solution (right) |
|------|-----------------|------------------|
| T1-A-E1 | `False` (a≠b) | `True` |
| T1-A-E2 | `True` hardcode | `False` |
| T1-A-E3 | `n_cases 1` | `n_cases 10` |
| T1-B-E1 | `False` (j dirigido) | `True` |
| T2-A-E1 | `ok` | `id requerido` |
| T2-B-E2 | `ok` | `blocked` |
| T3-A-E2 | datetime str completo | `2026-07-20` |
| T3-B-E2 | `ok` | `weak` |
| T4-A-E1 | `0` | `1` |
| T4-B-E2 | `ok` | `fail_job` |
| T4-B-E3 | igualdad inestable / lista desordenada | `True` + lista ordenada |

Ningún trap wrong≈right detectado.

---

Section 28 exercise pedagogy review complete. Ready for the Fixer prompt.
