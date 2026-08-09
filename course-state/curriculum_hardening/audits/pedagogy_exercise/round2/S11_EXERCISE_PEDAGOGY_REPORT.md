# S11 Exercise Pedagogy Report (Round 2)

## Section
- **title:** OOP y modelo de dominio
- **id:** `testing` (index 11; archivo histórico `s11-testing.ts` — contenido es OOP de dominio CP-N1-C, no “testing” genérico)
- **source file:** `src/lib/course/sections/s11-testing.ts`
- **counts:** iDo 8, weDo 24 (8 subtemas × E1/E2/E3), youDo 1
- **subtopics:** T1-A dataclass · T1-B invariantes · T2-A properties · T2-B frozen/eq · T3-A composición · T3-B Protocol · T4-A repo/service · T4-B tests/ética
- **live:** https://pillb.github.io/pyarcana/

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (field roles, length targets, preamble/retrospective checklists, E1→E2→E3 fade, anti-aberration)
- Manually re-inspected **every** `iDo.steps[]`, `weDo.steps[]`, and `youDo` in the **current** source after Round-1 fixes
- Used Round-1 report only as historical context — **not** as acceptance proof
- Scored residual quality for a true newbie (what / why / success / what sticks), not mere field presence
- No bulk generation; no source edits in this round

## Round-1 fix verification (schema shell)

| Expectation after R1 | Status in current source |
|----------------------|--------------------------|
| All iDo have `preamble` + `retrospective` | **Met** (8/8) |
| All We Do have `title` + `preamble` + task-style `instruction` + `retrospective` | **Met** (24/24) |
| You Do has `retrospective` | **Met** |
| E1→E2→E3 fade preserved | **Met** (guided / independent / transfer per subtopic) |
| Tasks, starters, solutions, outputs, `# DEFECT:` largely intact | **Met** |
| Story alignment (CASO-LIM-011, `@ejemplo.pe`, Decimal, sin `is_fraud`/`is_family`) | **Met** |

**Verdict:** Round-1 closed the systemic P0 “missing pedagogy shell.” Round-2 finds **no new missing-field crisis**. Residual work is **quality**: a few independent-level solution spoilers, thin `why`/feedback, feedback↔retrospective role collapse on key units, short retrospectives under the 40-word soft floor, and minor PE/hint polish.

---

## Global residual findings

| Residual gap | Evidence | Impact | Severity |
|--------------|----------|--------|----------|
| **Independent instruction spoiler** | `S11-T4-A-E2` step 2 gives `return self._d.get(client_id)`; `S11-T3-B-E2` step 2 gives `return norm(text)` | E2 stops being judgment; becomes typed paste | **P1** |
| **Feedback ≈ retrospective** | Worst: `S11-T3-B-E1` (mismo “nombre = contrato”); `S11-T4-B-E1` / `S11-T2-A-E1` (misma idea en ambos) | Feedback no repara razonamiento; retro no cierra metacognición | **P1** (peores pares) · **P2** (resto) |
| **Thin We Do `feedback`** | ~20/24 under ~25 words (spec 25–60); worst: T1-A-E2, T1-B-E2, T2-A-E1, T4-A-E2 | Corrective loop too thin for deliberate practice | **P2** (section-wide; Fixer only worst + any P1 pair) |
| **Short We Do `retrospective`** | Most 19–30 words (spec 40–80 soft floor) | Principle/misconception/transfer often present but compressed | **P2** (expand only units that miss a checklist item or sit under ~25 w) |
| **Thin I Do `why`** | T4-A ~23 w; T4-B ~23 w; T2-B ~28 w; T3-A ~29 w (target 40–90) | Demos of service/ethics/identity under-explain “why this code” | **P1** (T4-A, T4-B) · **P2** (T2-B, T3-A) |
| **Hints still English in places** | e.g. T1-B-E2 “Raise ValueError…”; T2-A-E1 “Print full_name…” | Breaks PE surface consistency | **P2** |
| **Forma reducida vs canónica** | T1-B E2/E3, T4-B E1: 2-field ClientRecord; elsewhere 4-field | Deliberate; preambles already say “forma reducida” where needed | residual risk only — **keep** |
| **You Do shell** | context/objectives/requirements/rubric/oracle + retrospective present | Strong; only optional length/clarity nits | **—** / optional P2 |

**Section severity theme (Round 2):** shell is solid; **P1** only where learning integrity is at risk (E2 spoilers, collapsed feedback/retro on Protocol & test-theatre, thin critical I Do `why`). Most of the rest is **P2 polish**.

Scoring key for residual quality (true newbie):
- **Strong** — checklist solid; lengths OK; no spoiler; misconception + transfer clear
- **Adequate** — usable; small nits only
- **Needs residual** — spoiler, missing piece for newbie, or clear length/role failure

When **no residual text** is proposed: Fixer may leave the unit unchanged.

---

## Unit ledger

### I Do

### S11-T1-A-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Adequate** · retrospective **Strong**
- **Checklist:** context pass · goal pass · success pass (output) · constraints pass · retrospective pass
- **Diagnosis:** R1 prose landed. Newbie watches `classmethod`, list copy, final `repr`. `why` (~37 w) is just under the soft floor but already names factory-on-class + no raw-dict return.
- **Severity:** — (optional P2 thicken `why` only if batching I Do edits)
- **Proposed residual:** none required
- **Code/output changes:** none

### S11-T1-B-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Adequate** · retrospective **Adequate**
- **Checklist:** all pass; retro slightly short (~32 w) but hits fail-closed + bridge to We Do
- **Diagnosis:** Clear fail-closed scene. Optional: one self-check phrase in retro (“¿arreglar en el CLI o rechazar al construir?”) — not required.
- **Severity:** —
- **Proposed residual:** none required
- **Code/output changes:** none

### S11-T2-A-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Strong** · retrospective **Strong**
- **Diagnosis:** Privacy surface + sentinel without IndexError is explicit. No residual.
- **Severity:** —
- **Proposed residual:** none
- **Code/output changes:** none

### S11-T2-B-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Needs residual** (thin ~28 w) · retrospective **Adequate**
- **Checklist:** pass; `why` under-explains why `document_id` must not be identity
- **Diagnosis:** Preamble prediction targets (`size 2`, `e1==e1b True`) are excellent. `why` is telegraphic for a concept that confuses newbies (PII vs stable id).
- **Severity:** P2
- **Proposed residual `why` (full text):**  
  `frozen` + `compare=False` mantienen la identidad solo por `entity_id`: el set de matching colapsa relabels sin inventar entidades. `document_id` es PII corregible; usarlo como key fusionaría personas distintas o reemitidas por accidente. Fail-closed si el id está vacío o solo espacios evita basura en el set de resolución.
- **Code/output changes:** none

### S11-T3-A-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Adequate** · retrospective **Needs residual** (short ~25 w; ethics light)
- **Diagnosis:** has-a vs is-a and “no `is_family()`” are in the preamble; retro could restate that score ≠ parentesco before We Do.
- **Severity:** P2
- **Proposed residual `retrospective` (full text):**  
  Composición mantiene el grafo auditable: el expediente **tiene** entidades y evidencias, no hereda “Persona base”. El par canónico evita duplicar (E1,E2)/(E2,E1); el score es **dato**, no parentesco. Pregunta de auto-chequeo: ¿dónde vivirías un `is_family()` si te lo pidieran? (fuera del value object). We Do: reemplazar herencia, arreglar default mutable en CaseFile y codificar el par canónico.
- **Code/output changes:** none

### S11-T3-B-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Adequate** · retrospective **Strong**
- **Diagnosis:** Puerto vs adapter and S12 bridge are clear. No residual required.
- **Severity:** —
- **Proposed residual:** none
- **Code/output changes:** none

### S11-T4-A-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Needs residual** (~23 w) · retrospective **Adequate**
- **Diagnosis:** Preamble names CLI/service split and `has_is_fraud False`. `why` does not yet explain *why* service must not print/parse CLI — critical for T4-A We Do and You Do.
- **Severity:** P1
- **Proposed residual `why` (full text):**  
  El service orquesta construcción + persistencia y devuelve un dict de borde; no imprime ni parsea argparse porque eso es CLI. `to_dict` elige el export, no es el invariante del tipo. La ausencia de `is_fraud` en el service no es detalle de estilo: es el límite del núcleo CP-N1-C antes de los tests éticos de T4-B.
- **Code/output changes:** none

### S11-T4-B-DEMO (iDo)
- **Scores:** preamble **Strong** · why **Needs residual** (~23 w) · retrospective **Strong**
- **Diagnosis:** Preamble sells “test de ausencia” well. `why` restates more than explains *how* the two tests protect product limits.
- **Severity:** P1
- **Proposed residual `why` (full text):**  
  La suite de dominio codifica dos promesas: el score vive en un rango usable y **no** existen APIs de veredicto (`is_fraud`, `is_related_family`). Un `hasattr` en test no es adorno: documenta el límite ético del matching en código ejecutable. Fixtures sintéticos y cero I/O mantienen el feedback local y CI-rápido.
- **Code/output changes:** none

---

### We Do · T1-A

### S11-T1-A-E1 (weDo · guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Adequate** (short ~26 w)
- **Checklist:** all pass for guided tier
- **Diagnosis:** Default mutable is named without giving the full patch in one line; feedback explains *when* it hurts (two instances, one list). Retro could name the misconception more explicitly.
- **Severity:** optional P2
- **Proposed residual `retrospective` (full text):**  
  Default mutable es el bug más caro en dataclasses de dominio: la lista se evalúa **una** vez y se comparte. El error clásico es “funciona en la primera instancia”. El mismo patrón reaparece en listas de evidencias (T3-A). Siguiente: montos con `Decimal` desde texto, no `float`.
- **Code/output changes:** none

### S11-T1-A-E2 (weDo · independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Adequate** · feedback **Needs residual** (~11 w) · retrospective **Adequate**
- **Diagnosis:** Good independent focus (float → Decimal). Feedback is a slogan, not a reasoning repair.
- **Severity:** P2
- **Proposed residual `feedback` (full text):**  
  Money de negocio se construye con `Decimal("150.50")` desde texto. Pasar por `float` introduce ruido binario que luego rompe comparaciones y quantize en las invariantes de T1-B. Los campos obligatorios sin default obligan a nombrar moneda y monto en cada alta.
- **Code/output changes:** none

### S11-T1-A-E3 (weDo · transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Adequate** · retrospective **Strong**
- **Diagnosis:** Transfer of factory-as-classmethod is clear; awkward starter call site kept. Feedback a bit short but not wrong.
- **Severity:** optional P2 (thicken feedback only if batching)
- **Proposed residual `feedback` (full text):**  
  `from_dict` en la **clase** es el borde reutilizable (CLI, repo, tests). Si el método vive en la instancia o devuelve el dict crudo, el “dominio” nunca nace: solo reenvías basura JSON con otro nombre.
- **Code/output changes:** none (keep awkward starter call site)

---

### We Do · T1-B

### S11-T1-B-E1 (weDo · guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Adequate** · retrospective **Strong**
- **Diagnosis:** Money invariants + no silent FX are clear. Feedback short but names the right policy.
- **Severity:** optional P2
- **Proposed residual `feedback` (full text):**  
  Fail-closed: cero y EUR mueren al construir. No conviertas moneda en el constructor ni “arregles” el monto a 0.01: el allowlist PEN/USD es política de producto local, no un cast mágico de Python.
- **Code/output changes:** none

### S11-T1-B-E2 (weDo · independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Needs residual** (~9 w) · retrospective **Strong**
- **Diagnosis:** “forma reducida” is correctly framed. Feedback under-explains why strip belongs at the border.
- **Severity:** P2
- **Proposed residual `feedback` (full text):**  
  `strip` en el borde evita ids “válidos” que son solo espacios: basura visual que luego rompe joins y sets. Lanza `ValueError` con mensaje claro; no “arregles” el documento a un default silencioso.
- **Hints residual (optional PE):** replace English “Raise ValueError…” with “Lanza `ValueError` con mensaje claro tras `strip`.”
- **Code/output changes:** none

### S11-T1-B-E3 (weDo · transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Adequate** · retrospective **Strong**
- **Diagnosis:** Dual style (list vs raise) is the transfer; ethical “no is_fraud” constraint is explicit. Good.
- **Severity:** —
- **Proposed residual:** none required
- **Code/output changes:** none

---

### We Do · T2-A

### S11-T2-A-E1 (weDo · guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Needs residual** · retrospective **Needs residual**
- **Diagnosis:** Pedagogy of property + order is fine, but feedback and retrospective open with the same idea (“Property calcula; no dupliques…”). Roles collapse.
- **Severity:** P1
- **Proposed residual `feedback` (full text):**  
  Si llamas `full_name()` con paréntesis, no estás usando `@property`: es un método normal. El orden apellido-primero del starter es un bug de presentación fácil de “casi pasar” si solo miras que imprime algo.
- **Proposed residual `retrospective` (full text):**  
  Property = campo virtual calculado; no guardes `full_name` duplicado si se deriva de `first`+`last`. Acceso sin `()` es el contrato. Siguiente: consulta pura con argumento validado (`age_days_since`), sin mutar estado.
- **Hints residual (optional PE):** “Imprime `full_name` (sin paréntesis), no `full_name()`.”
- **Code/output changes:** none

### S11-T2-A-E2 (weDo · independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Adequate** · retrospective **Strong**
- **Diagnosis:** Double defect (inverted subtract + no validation) is well scaffolded for E2 without pasting the full body. Note: class is named `Transaction` with `day_created` (form reduced) — preamble already justifies no `datetime`.
- **Severity:** —
- **Proposed residual:** none required (optional: feedback may add “15 = 25 − 10, no 10 − 25” if learners keep failing silently)
- **Code/output changes:** none

### S11-T2-A-E3 (weDo · transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Adequate** · retrospective **Strong**
- **Diagnosis:** NaN/range transfer is excellent; ethical “score ≠ veredicto” is in preamble limits. Good.
- **Severity:** optional P2 thicken feedback
- **Proposed residual `feedback` (full text):**  
  NaN e inf no son scores válidos: `isfinite` + rango [0, 1] **antes** de guardar. No “recortes” 1.5 a 1.0 en silencio: eso esconde basura en el pipeline de matching.
- **Code/output changes:** none

---

### We Do · T2-B

### S11-T2-B-E1 (weDo · guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Adequate** · retrospective **Needs residual** (~19 w)
- **Diagnosis:** Identity vs label is clear in preamble. Retro is the shortest in the section and barely hits misconception + transfer.
- **Severity:** P2
- **Proposed residual `retrospective` (full text):**  
  Etiqueta visible (`display_name`) puede corregirse sin romper el set: identidad ≠ presentación. El error clásico es meter `document_id` o el nombre en la igualdad y “perder” entidades al relabel. Siguiente: evidencias frozen en un set (dedup exacto del triple).
- **Code/output changes:** none

### S11-T2-B-E2 (weDo · independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** (minimal, good E2) · feedback **Adequate** · retrospective **Strong**
- **Diagnosis:** True independent drill (one concept: `frozen=True`). Do **not** over-guide in Round-2 fix.
- **Severity:** —
- **Proposed residual:** none
- **Code/output changes:** none

### S11-T2-B-E3 (weDo · transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Adequate** · retrospective **Strong**
- **Diagnosis:** BUG vs SAFE contrast is the transfer payoff of the subtopic. Instruction correctly keeps the broken mutable path.
- **Severity:** optional P2 feedback thicken
- **Proposed residual `feedback` (full text):**  
  Si el hash depende de un campo mutable, tras mutar el dict “pierde” la entrada (`get` → `None`) aunque el objeto siga en memoria. Frozen cierra esa puerta: misma identidad ⇒ mismo bucket.
- **Code/output changes:** none

---

### We Do · T3-A

### S11-T3-A-E1 (weDo · guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Adequate**
- **Diagnosis:** Inheritance defect + `design=composition` contract is clear for newbies.
- **Severity:** —
- **Proposed residual:** none required
- **Code/output changes:** none

### S11-T3-A-E2 (weDo · independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Strong**
- **Diagnosis:** Intentional revisit of default mutable on aggregates; feedback names CF2 contamination. Excellent reinforcement without cloning T1-A prose.
- **Severity:** —
- **Proposed residual:** none
- **Code/output changes:** none

### S11-T3-A-E3 (weDo · transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Adequate** · retrospective **Adequate**
- **Diagnosis:** Canonical pair + score + CaseFile is real transfer. Feedback slightly short; retro could restate ethics one line.
- **Severity:** P2
- **Proposed residual `feedback` (full text):**  
  El par canónico (`left_id < right_id`) es invariante de almacén: sin él, (E1,E2) y (E2,E1) cuentan dos veces. Valida score con `isfinite` y [0, 1]; no implementes `is_family()`.
- **Proposed residual `retrospective` (full text):**  
  Canonicidad no es estética: es clave de almacenamiento. Score es **dato de matching**, no parentesco legal. En T3-B desacoplarás el dominio de implementaciones concretas con Protocol (fakes primero, SQL en S12).
- **Code/output changes:** none

---

### We Do · T3-B

### S11-T3-B-E1 (weDo · guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Needs residual** · retrospective **Needs residual**
- **Diagnosis:** Naming defect (`compute` vs `score`) is excellent pedagogy, but feedback and retrospective say almost the same sentence. Split roles.
- **Severity:** P1
- **Proposed residual `feedback` (full text):**  
  Si el fake se llama `compute` y el puerto pide `score`, el duck typing **falla en silencio** hasta el call site (o el type checker). Renombra el método; no “adaptes” el Protocol al fake.
- **Proposed residual `retrospective` (full text):**  
  El nombre del método *es* el contrato del puerto. Un fake con otro verbo no es intercambiable en tests ni en S12. Siguiente: inyectar políticas de normalización como callables, sin herencia.
- **Code/output changes:** none

### S11-T3-B-E2 (weDo · independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Needs residual** (solution paste) · feedback **Adequate** · retrospective **Strong**
- **Diagnosis:** For **independent** E2, step 2 literally gives `return norm(text)` — the entire fix. That nullifies the exercise for a true newbie who only follows numbered steps.
- **Severity:** P1
- **Proposed residual `instruction` (full text):**  
  1. El starter devuelve `text` e ignora el normalizer recibido — ese es el defecto.  
  2. Haz que `apply` use el callable `norm` sobre `text` (sin hardcodear strip dentro de `apply`).  
  3. Mantén los dos normalizers del fixture.  
  4. Imprime ambos resultados (strip y casefold).
- **Proposed residual `feedback` (full text):**  
  Inyectar el normalizer evita hardcodear una sola política de texto en el dominio. Si `apply` ignora `norm`, strip y casefold “funcionan” solo por casualidad del fixture, no por diseño.
- **Code/output changes:** none

### S11-T3-B-E3 (weDo · transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Strong** · retrospective **Strong**
- **Diagnosis:** YAGNI decision DSL is legitimate transfer; labels and success lines are explicit. Instruction states rules without forcing a single-line paste of the whole body. Good.
- **Severity:** —
- **Proposed residual:** none
- **Code/output changes:** none

---

### We Do · T4-A

### S11-T4-A-E1 (weDo · guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Adequate** · retrospective **Strong**
- **Diagnosis:** Serialization border vs dump is well framed. Optional feedback thicken only.
- **Severity:** optional P2
- **Proposed residual `feedback` (full text):**  
  `to_dict` es borde de dashboard: elige qué sale. Aunque `internal_note` exista en el objeto, no va al export. Copia `list(self.emails)` para no filtrar la lista interna del agregado.
- **Code/output changes:** none

### S11-T4-A-E2 (weDo · independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Needs residual** (solution paste) · feedback **Needs residual** (~8 w) · retrospective **Needs residual** (~20 w)
- **Diagnosis:** Same integrity issue as T3-B-E2: independent step 2 is the exact solution line. Feedback is a slogan.
- **Severity:** P1
- **Proposed residual `instruction` (full text):**  
  1. El starter guarda en `_d` pero `get` ignora el almacén (siempre `None`) — localiza ese defecto.  
  2. Implementa `get` para recuperar el row por `client_id` (missing → `None`).  
  3. Mantén la clave `client_id` del row en `save`.  
  4. Imprime el roundtrip de C001 tras `save`/`get`.
- **Proposed residual `feedback` (full text):**  
  Repo light = diccionario con contrato `save`/`get`, sin red ni DB. Si `get` siempre devuelve `None`, el service no puede hacer roundtrip aunque `save` “parezca” correcto.
- **Proposed residual `retrospective` (full text):**  
  El service orquesta; el repo no conoce argparse ni print de negocio. Este fake es el mismo espíritu del Protocol de T3-B. Luego: clasificar capas cli / service / domain para no mezclar invariantes con I/O.
- **Code/output changes:** none

### S11-T4-A-E3 (weDo · transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Adequate** · retrospective **Adequate**
- **Diagnosis:** Layer flags as data is good conceptual transfer. Hints are more specific than instruction (acceptable for transfer with scaffolded fixture).
- **Severity:** P2
- **Proposed residual `feedback` (full text):**  
  La CLI puede imprimir y parsear argv; el service **no** imprime ni parsea; solo el domain sostiene invariantes. El starter invierte service/domain a propósito: corrige flags, no inventes una cuarta capa.
- **Proposed residual `retrospective` (full text):**  
  CLI habla con humanos; service orquesta; dominio guarda la verdad del negocio. Esa frontera es lo que habilita tests puros en T4-B sin red. Pregunta de auto-chequeo: ¿dónde pondrías un `print` de debug de producto? (CLI, no domain.)
- **Code/output changes:** none

---

### We Do · T4-B

### S11-T4-B-E1 (weDo · guided)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Needs residual** · retrospective **Needs residual**
- **Diagnosis:** Test theatre defect is excellent. Feedback and retro both hammer “try/except debe ser real” / “teatro” — collapse.
- **Severity:** P1
- **Proposed residual `feedback` (full text):**  
  Si el test devuelve `"pass"` sin forzar el rechazo, apruebas un dominio roto. El `try/except` solo cuenta si **sin** `__post_init__` el assert de “debía fallar” te detiene.
- **Proposed residual `retrospective` (full text):**  
  Teatro de tests = falsa seguridad en el gate. Un test de invariante demuestra el `ValueError`, no imprime cortesía. Siguiente: tres tests de service con fake repo y asserts de verdad (register / get / missing).
- **Code/output changes:** none

### S11-T4-B-E2 (weDo · independent)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Adequate** · retrospective **Adequate**
- **Diagnosis:** Good independent multi-part: fix fake + service + three real asserts. Instruction names behaviors without pasting full solution bodies.
- **Severity:** optional P2
- **Proposed residual `feedback` (full text):**  
  Fake en memoria + asserts **antes** del `print("pass")` = suite de dominio sin red ni DB. Tres `pass` impresos sin assert son el mismo teatro que E1, solo más ruidoso.
- **Code/output changes:** none

### S11-T4-B-E3 (weDo · transfer)
- **Scores:** title **Strong** · preamble **Strong** · instruction **Strong** · feedback **Adequate** · retrospective **Strong**
- **Diagnosis:** Ethical transfer is the section climax. Starter intentionally keeps `decide_fraud` for ANTES and a lying DESPUES line — Fixer must not “clean” the ANTES Client method.
- **Severity:** optional P2 feedback
- **Proposed residual `feedback` (full text):**  
  Scores son datos de matching; `decide_fraud` / `is_family` no viven en el dominio de familiaridad. El print ANTES documenta el anti-patrón; el DESPUES debe mirar `hasattr` sobre la evidencia (o el diseño final), no dejar el veredicto colgando del mismo tipo.
- **Code/output changes:** none (do **not** remove `Client.decide_fraud` from the solution ANTES block)

---

### You Do

### youDo — Modelo de dominio Cliente–Transacción–Evidencia
- **Scores:** context **Strong** · objectives **Strong** · requirements **Strong** · rubric **Strong** · retrospective **Strong** (~61 w)
- **Checklist:** context/goal/success/constraints pass · retrospective pass (defense triad: invariant / synthetic-vs-real / 30s impact)
- **Diagnosis:** Project frame was already strong in R1; retrospective landed correctly. Oracle `tests_pass` remains the observable success. No structural residual.
- **Severity:** —
- **Proposed residual:** none required  
  Optional P2 only: if portfolioNote and retro feel redundant on PII, keep both — they serve deliverable vs metacognition.
- **Code/output changes:** none

---

## Priority order

### P1 (learning integrity — do first)
1. **S11-T4-A-E2** — rewrite independent `instruction` (remove `return self._d.get(...)` paste); thicken feedback + retrospective  
2. **S11-T3-B-E2** — rewrite independent `instruction` (remove `return norm(text)` paste); optional feedback thicken  
3. **S11-T3-B-E1** — split feedback vs retrospective (same “nombre = contrato” twice)  
4. **S11-T2-A-E1** — split feedback vs retrospective (“Property calcula…” twice)  
5. **S11-T4-B-E1** — split feedback vs retrospective (teatro / try-except collapse)  
6. **S11-T4-A-DEMO** and **S11-T4-B-DEMO** — expand thin `why` (service border + ethical suite)

### P2 (polish after P1)
1. Thin feedback expansions: **T1-A-E2**, **T1-B-E2**, **T2-A-E3**, **T2-B-E3**, **T3-A-E3**, **T4-A-E1**, **T4-A-E3**, **T4-B-E2**, **T4-B-E3** (use proposed texts; skip units already Strong)  
2. Short retrospectives that miss punch: **T1-A-E1**, **T2-B-E1**, **T3-A-DEMO**, **T3-A-E3**  
3. I Do `why` thicken: **T2-B-DEMO** (and optional others already Adequate)  
4. Hints PE: English fragments in T1-B-E2, T2-A-E1, and similar  
5. Do **not** inflate T2-B-E2 instruction — keep independent character

### Leave unchanged (no residual required)
- Strong / adequate units listed with “—” above, including most E3 transfers, T3-A-E1/E2, T1-B-E3, T3-B-E3, You Do shell, and code/outputs across the board

---

## Residual risks

1. **Filename vs content:** `s11-testing.ts` / id `testing` still mislabels OOP domain content — housekeeping, out of scope for pedagogy fix.
2. **E2 over-fix risk:** if Fixer “helps” T2-B-E2 or other short independents with E1-style breadcrumbs, fade regresses.
3. **T4-B-E3 ANTES `decide_fraud`:** intentional living anti-pattern in solution; removing it breaks the ANTES line.
4. **Forma reducida ClientRecord** in T1-B E2/E3 and T4-B E1: keep; do not force 4-field schema into those drills.
5. **T2-A-E2 class named `Transaction`:** not money Transaction — preamble already scopes the demo; renaming is optional and out of minimal fix.
6. **Outputs must be preserved** unless execute-and-diff justifies change; this review proposes **no code/output changes**.
7. **Spanish PE:** proposed residual texts are professional Peruvian Spanish; no real PII.
8. **Section-wide short feedback:** do not bulk-rewrite all 24 — only P1 pairs and the P2 list above, hand-edited.

---

## Fixer handoff notes

- Implement residual field text only; do not regenerate exercises with scripts or templates.
- Prefer the proposed full texts as starting points; trim if over word caps after paste (spec §4).
- Keep `# DEFECT:` comments, starter awkward call sites (T1-A-E3), and ethical ANTES block (T4-B-E3).
- Run section typecheck / static build after edits; do not alter youDo `tests_pass` oracle semantics.
- Gold tone references (do not copy content): S26, S30, S33, S50.

---

Section 11 exercise pedagogy review complete. Ready for the Fixer prompt.
