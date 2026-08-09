# S20 Exercise Pedagogy Report (Round 2)

## Section
- **title:** Automatización robusta de Excel
- **shortTitle:** Excel factory
- **id:** `rag` (archivo histórico `s20-rag.ts`; contenido = excel factory openpyxl / plantillas / conciliación / batch / manifest — **no** RAG)
- **index:** 20
- **source:** `src/lib/course/sections/s20-rag.ts` (re-leído **después** del fix Round-1)
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades)
- **subtemas:** T1-A sheets/celdas/headers · T1-B fórmulas vs. materialización · T2-A estilos y plantilla copy→save · T2-B fechas ISO y merges · T3-A conciliación y pivots · T3-B validación estructural · T4-A batch corrupt/lock · T4-B backup, idempotencia y manifest
- **hilo:** excel factory CP-N2-B / `cpn2b_factory.xlsx` (Entrada/Salida, Lima–Cusco–Arequipa, PEN; master intocable + manifest; puente S21)
- **Round 1 context:** `round1/S20_EXERCISE_PEDAGOGY_REPORT.md` (solo contraste; **no** rubber-stamp)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (roles de campo, longitudes, checklists preamble/retrospective, fade E1→E3, anti-aberration).
- Manually re-inspected **every** `iDo.steps[]`, `weDo.steps[]`, and `youDo` in the **current** source: title, preamble, instruction, feedback, retrospective, starter DEFECT, solution/output, why.
- Scored residual quality for a **true newbie** (what / why / success / what sticks) — field *presence* alone is not acceptance.
- Word counts measured only as gates (no generators of prose). Round-1 used only to avoid re-diagnosing the old “zero shell” crisis.
- **No** source edits in this round. Hand-crafted residual proposals only.

## Round-1 fix verification (schema shell)

| Expectation after R1 | Status in current source |
|----------------------|--------------------------|
| All iDo have `preamble` + `retrospective` | **Met** (8/8); `why` now ~40–76 words (floor OK) |
| All We Do have `title` + `preamble` + task-style `instruction` + `retrospective` | **Met** (24/24) |
| We Do `instruction` is ordered steps (not “Concepto + fixture” essay) | **Met** |
| You Do has `retrospective` | **Met** (~79w, defense triad) |
| E1→E2→E3 fade preserved (surfaces, not number clones) | **Met** |
| Starters, solutions, canonical outputs intact | **Met** (no execute-and-diff needed) |
| Spanish PE; synthetic data; no real PII | **Met** |
| Feedback with auditor/VP impact (R1 P2) | **Mostly met** on T3–T4; residual thin floors remain |

**Verdict:** Round-1 closed the systemic P0 “missing pedagogy shell.” Round-2 finds **no missing-field crisis**. Residual work is **quality**: section-wide short retrospectives (under the 40–80 floor), one strong feedback↔retrospective echo (T2-A-E3), thin feedback/instruction floors on a few drills, soft transfer-hint spoiling, and the known T2-B-E2 false-pass note.

---

## Global residual findings

| Residual gap | Evidence | Impact | Severity |
|--------------|----------|--------|----------|
| **We Do retrospectives short** | 24/24 under or near floor (measured ≈13–34w); many stop at “principio + siguiente” without misconception explícito o self-check | Metacognition thin; learner closes tab without a sticky self-test | **P1** (section theme: expand worst 12–14; not every unit needs a novel essay) |
| **I Do retrospectives short** | 7/8 under 40w (T1-A 45 is the only floor-pass; T3-B 17, T4-A 18, T2-A 22 are thinnest) | Demo → We Do bridge exists, but “misconception repaired” is often one clause | **P1** on thinnest 4–5 · **P2** elsewhere |
| **Feedback ≈ retrospective** | **T2-A-E3** shares the same spine (“Si la segunda línea es False, no copiaste…”); milder pairs T1-B-E1, T2-B-E2 | Deliberate-practice loop collapses; retro loses distinct job | **P1** (T2-A-E3) · **P2** (milder pairs) |
| **E3 transfer hint spoiling** | T1-B-E3 / T3-A-E3 / T3-B-E3 first hints give near-complete predicates | Transfer becomes “type the hint” not judgment | **P2** (soften first hint to concept) |
| **Instruction under 40w** | Most We Do instructions ≈18–29w (four short steps) | Still task-clear for drills; floor is soft for micro-tasks | **P2** optional only if a step is ambiguous |
| **Feedback under 25w** | T1-A-E3 ≈23, T2-B-E1 ≈24, T4-A-E1 ≈24 | Corrective loop thin | **P2** |
| **Title short** | T3-B-E3 title ≈3 words (`validate_rows devuelve violators`) | Spec 4–12 words | **P2** |
| **T2-B-E2 false-pass** | Output only proves C1=`None`; writing ancla B1 is not verified | Partial completion can match output | **P2** (note only unless Fixer accepts output change) |
| **You Do** | Context + objectives + requirements + starter huecos + retrospective **strong** | No P0/P1 | — / optional P2 only |
| **Code/outputs** | Coherent with theory and factory mini-contract | Do **not** change pass outputs | — |

**Section severity theme (Round 2):** solid shell; residual is **retrospective length + role separation + soft spoiling**, not redesign. A true newbie *can* answer what/why/success from preambles (bullet checklist is consistent and job-hooked to the VP factory). The gap is **what sticks after the tab closes** and **not being spoon-fed on transfer**.

### Scoring key
| Score | Meaning |
|-------|---------|
| **A** | Newbie answers what / why / success / what sticks; no required residual |
| **B** | Usable; residual polish (length, eco, soft spoiler) |
| **C** | Partial; R2 Fixer should tighten (integrity or metacognition) |
| **D** | Fails true-newbie on a critical item |

Checklist: **context · goal · success · constraints · retrospective** → pass / partial / fail.

When **Proposed residual: none required**, Fixer may leave the unit unchanged.

---

## Unit ledger

### S20-T1-A-DEMO (iDo) — **A−**
- **Scores:** preamble **Strong** (~67w) · why **Strong** (~76w) · retrospective **Adequate** (~45w, floor pass)
- **Checklist:** context pass · goal pass · success pass (predice sheetnames/n/A2) · constraints pass · retrospective pass
- **Diagnosis:** R1 prose landed. Sheetnames as contract, `n_filas = max_row - 1`, and misconception “Input_v2” are clear. Why bridges to We Do T1-A.
- **Severity residual:** none required (optional: one self-check question if Fixer expands I Do retros as a batch)
- **Proposed residual:** none required
- **Code/output changes:** none

### S20-T1-A-E1 (weDo, guided) — **B**
- **Scores:** title Strong · preamble Strong (4 bullets) · instruction Strong · feedback Adequate (~27w) · retrospective **short** (~34w)
- **Checklist:** all pass structure; retro partial (light self-check)
- **Diagnosis:** Model guided unit. DEFECT clear (default Sheet + A1 empty). Feedback anchors to factory reads/conciliación. Retro names schema but rushes bridge.
- **Severity residual:** P1 (retro length)
- **Proposed retrospective (replace):**  
  Nombre de hoja + header de fila 1 son el “schema” del xlsx: sin `Entrada` y `region`, el factory no ancla lecturas ni conciliación. El error clásico es confiar en “la primera columna” sin nombre. Pregunta: si A1 sigue `None`, ¿qué falla después al contar filas? Siguiente (E2): append de header + fila y medir `max_row`.
- **Code/output changes:** none

### S20-T1-A-E2 (weDo, independent) — **B**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong · retrospective **short** (~27w)
- **Checklist:** all pass; retro partial
- **Diagnosis:** Independent fade correct (`max_row` includes header). Feedback already ties n to conciliación. Retro lacks self-check.
- **Severity residual:** P1 (retro)
- **Proposed retrospective (replace):**  
  `max_row` incluye la fila de encabezado: datos de negocio = `max_row - 1`. Ese `n` reaparece en `Salida` y en el manifest. El error clásico es imprimir 1 y creer que “no hay filas” cuando solo falta el append de datos. Pregunta: con header + 3 regiones, ¿qué imprime `max_row`? Luego (E3) fijarás el par canónico `Entrada`/`Salida`.
- **Code/output changes:** none

### S20-T1-A-E3 (weDo, transfer) — **B**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback thin (~23w) · retrospective Adequate (~34w, has self-check)
- **Diagnosis:** Authentic transfer to factory sheetnames. Retro already asks what breaks if `Sheet` remains. Feedback under floor.
- **Severity residual:** P2 (feedback floor)
- **Proposed feedback (replace):**  
  El orden típico es `['Entrada', 'Salida']` si creas `Salida` después del rename. Sin esos nombres el auditor no encuentra el detalle ni los KPIs — y un script ajeno del cierre de mes rompe en silencio.
- **Code/output changes:** none

---

### S20-T1-B-DEMO (iDo) — **B**
- **Scores:** preamble Strong (~58w) · why Strong (~64w) · retrospective **short** (~28w)
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective partial
- **Diagnosis:** Formula-as-string vs. Python 25 is a clear worked example. Retro states the dual contract but skips misconception + self-check.
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Fórmula = contrato visual para el humano en Excel; valor Python = contrato auditable del factory. El error clásico es “la fórmula se ve bien, el número está bien” en CI sin motor. Pregunta: ¿qué imprimiría `data_only` sobre una fórmula recién escrita sin cache? We Do: escribir el string `=…`, materializar sumas y detectar celdas con prefijo `=`.
- **Code/output changes:** none

### S20-T1-B-E1 (weDo, guided) — **B** / mild eco
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong · retrospective **short** (~24w) + mild eco with feedback
- **Diagnosis:** Starter A3=0 is excellent guided defect. Feedback and retro both restate “string vs numérico”.
- **Severity residual:** P1 (retro distinct + length)
- **Proposed retrospective (replace):**  
  La fórmula vive como string con prefijo `=`; el número 0 en la celda no es “fórmula vacía”. El VP puede ver `=A1+A2`; el CI no la evalúa. Pregunta: si lees A3 con openpyxl, ¿obtienes 15 o el texto de la fórmula? Siguiente (E2): materializar la suma en Python sin depender de Excel.
- **Code/output changes:** none

### S20-T1-B-E2 (weDo, independent) — **B**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong · retrospective **short** (~30w)
- **Diagnosis:** Materialization path is clear; starter `or 0` trap is good. Retro names classic error but light on self-check.
- **Severity residual:** P2
- **Proposed residual retrospective (optional expand):**  
  Materializar = calcular en Python y (en el factory) volcar el número a `Salida`. El error clásico es creer que openpyxl “ya sumó” la fórmula. Pregunta: ¿por qué `data_only=True` no resuelve esto en CI Linux? Luego (E3) un predicado `es_formula` reutilizable.
- **Code/output changes:** none

### S20-T1-B-E3 (weDo, transfer) — **B**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong · retrospective Adequate (~32w) · hint 1 **spoils**
- **Diagnosis:** Transfer to helper is right fade. First hint is the full predicate. Retro has self-check on leading space.
- **Severity residual:** P2 (soften hint)
- **Proposed residual:** none on prose required; optional first hint → “Revisa tipo string y prefijo `=` (un int nunca es fórmula).”
- **Code/output changes:** none

---

### S20-T2-A-DEMO (iDo) — **B** / **C** on retro
- **Scores:** preamble Strong (~65w) · why Adequate (~48w) · retrospective **thin** (~22w)
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective fail (length/roles)
- **Diagnosis:** copy→load→style→write→save is the factory skeleton. Retro is two telegraphic sentences without misconception or self-check.
- **Severity residual:** P1
- **Proposed retrospective (replace):**  
  Copy → load → write → save es el esqueleto del excel factory: el master del VP no es borrador de trabajo. El error clásico es `save` in-place y mezclar datos de ayer con los de hoy. Pregunta: ¿qué evidencia mínima prueba plantilla intocable? We Do: bold, fill corporativo `1F4E79` y el flujo completo en directorio temporal.
- **Code/output changes:** none

### S20-T2-A-E1 (weDo, guided) — **B**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong · retrospective **short** (~23w)
- **Diagnosis:** Font bold drill is clean. Retro only bridges to fill without sticky misconception.
- **Severity residual:** P1 (retro)
- **Proposed retrospective (replace):**  
  El estilo se adjunta a la celda **después** del valor; el workbook no tiene un “bold global”. El error clásico es reasignar A1 y perder el `Font`. Pregunta: si `font.bold` es None, ¿qué faltó? Siguiente (E2): color corporativo `1F4E79` con PatternFill — el fill por defecto no basta.
- **Code/output changes:** none

### S20-T2-A-E2 (weDo, independent) — **B+**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong · retrospective **short** (~29w)
- **Diagnosis:** RGB endswith trap is excellent independent pedagogy. Hints no longer dump the full PatternFill line (R1 spoiling improved). Retro short but principle is right.
- **Severity residual:** P2
- **Proposed residual retrospective (optional expand):**  
  Validar el RGB evita “se ve azul en mi laptop” sin contrato con el master. El fill default a menudo no es None: `is not None` no es un gate. Pregunta: ¿por qué theme color genérico falla el endswith? Luego (E3) plantilla intocable: copiar master, escribir en la copia, dejar master vivo.
- **Code/output changes:** none

### S20-T2-A-E3 (weDo, transfer) — **C**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong · retrospective **eco with feedback** (~34w)
- **Checklist:** all pass except retro role (duplicates feedback spine)
- **Diagnosis:** Mini-integración copy→load→write→save is the right transfer to You Do. **Feedback and retrospective open with the same diagnosis** (“Si la segunda línea es False, no copiaste…”). That is the strongest integrity residual in the section.
- **Severity residual:** P1 (role separation)
- **Proposed retrospective (replace — keep feedback as-is):**  
  Copy → load → write → save deja el master intacto y materializa solo en `out/`. Este es el esqueleto del *Tú haces*: sin `shutil.copy`, el contrato visual del VP se corrompe en la primera corrida. Pregunta: ¿qué imprime el starter si out no existe? Puente a T2-B: fechas ISO y merges sin romper el layout de la plantilla.
- **Code/output changes:** none

---

### S20-T2-B-DEMO (iDo) — **B**
- **Scores:** preamble Strong (~55w) · why Strong (~52w) · retrospective **short** (~24w)
- **Diagnosis:** ISO + anchor vs. non-anchor is clear. Retro is telegraphic.
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  ISO evita “¿marzo o abril?” entre laptops; ancla = top-left del merge. El error clásico es leer C1/D1 y creer que el valor “desapareció”. Pregunta: ¿dónde escribes si el merge es B1:D1? We Do: fecha en metadata, valor de no-ancla y conteo de rangos merged.
- **Code/output changes:** none

### S20-T2-B-E1 (weDo, guided) — **B** / **C** on retro
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback thin (~24w) · retrospective **thin** (~17w)
- **Diagnosis:** String vs `date` trap is excellent. Retro is two short clauses.
- **Severity residual:** P1 (retro) + P2 (feedback floor)
- **Proposed feedback (replace):**  
  Si no hay `isoformat` de verdad, A1 sigue siendo str u otro tipo: asigna `date(2024, 1, 15)`, no el string `'2024-01-15'`. ISO evita ambigüedad de locale entre laptops del equipo.
- **Proposed retrospective (replace):**  
  `date` + `isoformat` = contrato portable del corte de mes en metadata. El error clásico es dejar un string que “se ve” ISO pero no es un objeto fecha. Pregunta: ¿qué pasa si el locale del SO parsea `03/04/24` distinto? Siguiente (E2): el valor del merge no vive en la celda no-ancla.
- **Code/output changes:** none

### S20-T2-B-E2 (weDo, independent) — **B**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong · retrospective **short** (~20w) + mild eco
- **Diagnosis:** Concept of non-anchor `None` is right. Known false-pass: learner can print C1 without writing B1 and still match output. Feedback/retro share “pierde montos”.
- **Severity residual:** P2 (retro + false-pass note)
- **Proposed retrospective (replace):**  
  Ancla = esquina superior izquierda. Si lees no-ancla, el pipeline “pierde” montos aunque el VP “vea” un valor en pantalla. Pregunta: ¿escribir en C1 actualiza el merge visible? Luego (E3) contar cuántos bloques merged hay activos.
- **Code/output changes:** none (optional harden only if product accepts printing anchor too — out of default scope)
- **Validation notes:** Do not change output to `x\nNone` without orchestrator approval (breaks equality tests).

### S20-T2-B-E3 (weDo, transfer) — **B+**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong · retrospective Adequate (~29w, has self-check)
- **Diagnosis:** Transfer clean; retro already asks about merge A2:A100. Near floor but complete roles.
- **Severity residual:** P2 optional expand only
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S20-T3-A-DEMO (iDo) — **B**
- **Scores:** preamble Strong (~55w) · why Strong (~53w) · retrospective **short** (~23w)
- **Diagnosis:** Portada 35.5 + pivot dict teaches credibility gate. Retro jumps to We Do without misconception.
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Conciliar n y montos es el quality gate del workbook: sin él, la portada “optimista” viaja a gerencia. El error clásico es sumar a mano la portada y olvidar una región. Pregunta: ¿dónde vive `reconcile_ok` además del print? We Do: corregir portada desde celdas, groupby sum y función `reconcile` con tolerancia.
- **Code/output changes:** none

### S20-T3-A-E1 (weDo, guided) — **B**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong (~39w) · retrospective **short** (~25w)
- **Diagnosis:** B1=16 vs detail 15 is a strong guided defect. Feedback already has fail-closed. Retro thin.
- **Severity residual:** P1 (retro)
- **Proposed retrospective (replace):**  
  El detalle manda; la portada se alinea o se falla. Fail-closed = no emitir paquete si no cuadra. El error clásico es bajar B2/B3 “para que cuadre” en vez de corregir la portada. Pregunta: con tol 0.01, ¿16 vs 15 pasa? Siguiente (E2): pivot lógico con groupby sum.
- **Code/output changes:** none

### S20-T3-A-E2 (weDo, independent) — **B+**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong · retrospective **short** (~26w)
- **Diagnosis:** mean→sum defect is production-grade independent. Feedback already names auditor. Retro almost complete.
- **Severity residual:** P2
- **Proposed residual retrospective (optional expand):**  
  Mean vs sum es el bug silencioso del “KPI que se ve razonable”. El pivot del factory es suma por región, no promedio. Pregunta: ¿qué número incorrecto vería el VP en Lima si dejas mean? Luego (E3) empaquetar la regla en `reconcile(det, portada, tol)`.
- **Code/output changes:** none

### S20-T3-A-E3 (weDo, transfer) — **B**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong · retrospective Adequate (~29w) · hint 1 near-complete
- **Diagnosis:** tol default 0.0→0.01 is clean transfer. Retro has self-check. Soft spoiling in first hint.
- **Severity residual:** P2 (hint)
- **Proposed residual:** soften first hint to “default de tolerancia documentada en PEN (2 decimales), no igualdad bit a bit.”
- **Code/output changes:** none

---

### S20-T3-B-DEMO (iDo) — **C** on retro
- **Scores:** preamble Strong (~53w) · why Adequate (~42w) · retrospective **thin** (~17w)
- **Diagnosis:** headers OK + Piura/Ica abort is clear. Retro is a slogan + bridge only.
- **Severity residual:** P1
- **Proposed retrospective (replace):**  
  Primero headers, luego dominio, luego escritura. El error clásico es “arreglar” en silencio el orden de columnas o inventar regiones para no abortar. Pregunta: ¿qué debe ir al manifest si `abort` es True? We Do: completar header en hoja, filtrar violators y función `validate_rows`.
- **Code/output changes:** none

### S20-T3-B-E1 (weDo, guided) — **C** on retro
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong · retrospective **thin** (~16w)
- **Diagnosis:** Missing B1=`monto` is clear guided. Retro is one sentence + bridge.
- **Severity residual:** P1
- **Proposed retrospective (replace):**  
  Headers incompletos fallan antes de materializar `Salida`: el schema del VP no se improvisá a las 23:00. El error clásico es ignorar `None` en B1 y seguir el lote. Pregunta: si `expected` y `got` difieren en orden, ¿es `True`? Siguiente (E2): allowlist de regiones leídas desde la hoja.
- **Code/output changes:** none

### S20-T3-B-E2 (weDo, independent) — **B**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong · retrospective **short** (~20w)
- **Diagnosis:** print-all vs violators is clean independent. Feedback already covers inverted predicate.
- **Severity residual:** P1 (retro length)
- **Proposed retrospective (replace):**  
  Violators nombrados = evidencia auditable; un bool silencioso no le sirve al auditor. El error clásico es imprimir todas las regiones o invertir el predicado hacia las válidas. Pregunta: ¿debe salir Lima en la lista? Luego (E3) la misma regla en función reutilizable sobre filas dict.
- **Code/output changes:** none

### S20-T3-B-E3 (weDo, transfer) — **B**
- **Scores:** title **short** (3w) · preamble Strong · instruction Strong · feedback Strong · retrospective Adequate (~31w) · hint spoils
- **Diagnosis:** `in` vs `not in` is classic transfer. Retro has self-check. Title under 4-word floor; first hint is full listcomp.
- **Severity residual:** P2
- **Proposed title:** Validar filas y devolver violators  
- **Proposed residual:** soften first hint to “devuelve regiones **fuera** de allowed, no las válidas.”
- **Code/output changes:** none

---

### S20-T4-A-DEMO (iDo) — **C** on retro
- **Scores:** preamble Strong (~56w) · why Adequate (~41w) · retrospective **thin** (~18w)
- **Diagnosis:** Batch counts 2/1/1 are clear. Retro is slogan + bridge.
- **Severity residual:** P1
- **Proposed retrospective (replace):**  
  Aislar fallos, no abortar todo el lote: un corrupt o lock no tumba la noche del cierre. El error clásico es dejar que una excepción sin capturar mate el proceso. Pregunta: ¿qué mira primero el auditor en el summary? We Do: `ok_count`, `classify` con try/except y Counter del summary.
- **Code/output changes:** none

### S20-T4-A-E1 (weDo, guided) — **C** on retro
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback thin (~24w) · retrospective **thin** (~13w)
- **Diagnosis:** Counting corrupt vs ok is excellent guided bug. Shortest retro in the section.
- **Severity residual:** P1
- **Proposed feedback (replace):**  
  Si sale 1, contaste `corrupt` o iteraste mal las keys. El `ok_count` es el campo que el auditor mira primero en el summary del batch nocturno — no el número de fallos.
- **Proposed retrospective (replace):**  
  Contador correcto = evidencia de lote sano. El error clásico es sumar el estado “llamativo” (corrupt) en vez de `ok`. Pregunta: con 3 ok y 1 locked, ¿qué debe imprimir el summary de ok? Siguiente (E2): implementar `classify` real con excepciones.
- **Code/output changes:** none

### S20-T4-A-E2 (weDo, independent) — **B** / **C** on retro
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong · retrospective **thin** (~15w)
- **Diagnosis:** try/except classify is solid independent. Feedback distinguishes lock vs corrupt. Retro is two clauses.
- **Severity residual:** P1
- **Proposed retrospective (replace):**  
  Lock ≠ corrupt: políticas de reintento distintas (esperar al contador vs. cuarentena). El error clásico es devolver siempre `ok` o tragar `Exception` genérica. Pregunta: ¿qué devolverías con `BadZipFile`? Luego (E3) agregar conteos con Counter para el manifest.
- **Code/output changes:** none

### S20-T4-A-E3 (weDo, transfer) — **B+**
- **Scores:** title Strong · preamble Adequate (4 bullets, thinner text) · instruction Strong · feedback Strong · retrospective Adequate (~26w) · hints **improved** (no longer dump Counter line)
- **Diagnosis:** Transfer to summary dict is right. R1 spoiling of full `dict(Counter(...))` was softened. Retro short but has CP-N2-B bridge.
- **Severity residual:** P2 optional (expand retro self-check)
- **Proposed residual retrospective (optional):**  
  Counter del summary es lo que el revisor de CP-N2-B abre en 30 segundos: conteos por categoría, no la lista cruda de paths. Pregunta: si omites locked, ¿qué historia falsa cuentas del lote? Puente a T4-B: backup, idempotencia y manifest con hash.
- **Code/output changes:** none

---

### S20-T4-B-DEMO (iDo) — **B** / **C** on retro
- **Scores:** preamble Strong (~53w) · why Adequate (~40w, floor) · retrospective **thin** (~20w)
- **Diagnosis:** Idempotent manifest JSON is the closing worked example. Retro is a list of nouns + bridge.
- **Severity residual:** P1
- **Proposed retrospective (replace):**  
  Idempotencia + backup + tests + manifest cierran el factory hacia S21. El error clásico es hashear filas sin orden canónico y creer que “cambió el negocio” en un re-run. Pregunta: ¿qué flag del JSON defiende que el master no se tocó? We Do: armar el dict mínimo, dig orden-invariante y `structural_ok` como superset.
- **Code/output changes:** none

### S20-T4-B-E1 (weDo, guided) — **B**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong · retrospective **short** (~21w)
- **Diagnosis:** Fake hash + idempotent False is excellent guided. Feedback already auditor-focused.
- **Severity residual:** P1 (retro)
- **Proposed retrospective (replace):**  
  Hash truncado a 8 hex identifica la entrada sin volcar datos. El error clásico es dejar `idempotent=False` o `00000000` “para que compile”. Pregunta: ¿por qué el manifest exige `sheets` y `reconcile_ok` además del hash? Siguiente (E2): dig de filas orden-invariante para re-runs.
- **Code/output changes:** none

### S20-T4-B-E2 (weDo, independent) — **B**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong (~46w) · retrospective **short** (~23w)
- **Diagnosis:** Missing `sorted` is production-grade independent. Feedback already excellent. Retro thin vs. feedback richness.
- **Severity residual:** P1 (retro)
- **Proposed retrospective (replace):**  
  Orden canónico = idempotencia lógica. Sin él, re-ejecutar “cambia” el artefacto y el factory pierde confianza en el cierre de mes. El error clásico es hashear el orden de lectura del sheet. Pregunta: ¿Lima/Cusco vs Cusco/Lima debe cambiar el dig? Luego (E3) `structural_ok` con superset de sheets.
- **Code/output changes:** none

### S20-T4-B-E3 (weDo, transfer) — **B+**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong · retrospective Adequate (~29w, has self-check)
- **Diagnosis:** `==` vs `>=` is clean transfer to You Do. Hints conceptual (superset), not full code dump. Near-floor retro but complete roles.
- **Severity residual:** P2 optional only
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S20-youDo (youDo) — **A**
- **Scores:** context Strong (~75w) · objectives/requirements Strong · starter huecos Strong · portfolioNote Strong (prints canónicos) · retrospective **Strong** (~79w)
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective pass
- **Diagnosis:** R1 retrospective landed with defense triad (manifest evidence, lock/corrupt ops, measurable impact phrase). Starter three holes map to T2-A-E3 + T3-A + T4-B. No redesign.
- **Severity residual:** none required
- **Proposed residual:** none (optional P2: one line in context naming the three COMPLETAR holes by name for scanability — not required)
- **Code/output changes:** none

---

## Priority order (Round 2 Fix)

### P1 (do first — metacognition + integrity)
1. **S20-T2-A-E3** — separate retrospective from feedback (strongest eco).  
2. **We Do retrospectives under ~25w (expand worst):** T4-A-E1, T4-A-E2, T3-B-E1, T2-B-E1, T2-B-E2, T3-B-E2, T4-B-E1, T4-B-E2, T1-B-E1, T2-A-E1, T3-A-E1, T1-A-E2.  
3. **I Do retrospectives thinnest:** T3-B-DEMO, T4-A-DEMO, T4-B-DEMO, T2-A-DEMO, T1-B-DEMO (principle + misconception + self-check + bridge).

### P2 (polish)
4. Feedback floors: T1-A-E3, T2-B-E1, T4-A-E1.  
5. Soften transfer first-hints: T1-B-E3, T3-A-E3, T3-B-E3.  
6. Title T3-B-E3 → ≥4 words.  
7. Optional expands on B+ units (T2-A-E2, T3-A-E2, T4-A-E3) if batching retros.  
8. T2-B-E2 false-pass: document only unless product accepts output change.  
9. Optional I Do self-check on units already near floor (T1-A-DEMO, T2-B-E3, T4-B-E3).

### Leave alone
- **S20-youDo** — A.  
- **S20-T1-A-DEMO** — A− (floor-pass retro).  
- Code/solution outputs across the section.

---

## Residual risks

- **Id/path `rag` vs. Excel content:** still confuses searchers; product/orchestrator decision, not exercise-prose fix.  
- **Retrospective batch expansion:** Fixer must hand-write; no template fill of “Principio: {x}. Error: {y}.” across 24 units.  
- **Output immutability:** do not change canonical prints to “fix” T2-B-E2 without test policy change.  
- **openpyxl environment:** units assume `local-python` with openpyxl; do not rewrite to CSV.  
- **You Do JSON comment hole:** still easy to leave `manifest_written False`; retrospective already pressures persistence — keep that pressure.  
- **Instruction word-count floor:** micro-drills with 4 clear steps often land <40w; do not pad with essay text that reintroduces Concepto+fixture.

---

## Counts summary for Round-2 Fixer

| Tipo | Unidades | Shell complete | Residual P1 focus | Residual P2 |
|------|----------|----------------|-------------------|-------------|
| iDo  | 8        | 8/8            | ~5 thin retros    | ~2–3 polish |
| weDo | 24       | 24/24          | ~12 short retros + T2-A-E3 eco | hints, fb floors, 1 title |
| youDo| 1        | 1/1            | 0                 | optional    |
| **Missing fields** | **0** | — | — | — |

Código/output: **sin cambios requeridos** para pedagogía (salvo nota opcional T2-B-E2 con aprobación de tests).

Section 20 exercise pedagogy review complete. Ready for the Fixer prompt.
