# S02 Exercise Pedagogy Report (Round 1)

## Section
- **title:** Valores, tipos, operadores e I/O
- **id:** `basics`
- **index:** 2
- **source:** `src/lib/course/sections/s02-basics.ts`
- **counts:** iDo 8 · weDo 24 · youDo 1 (total 33 units under Gradual Release)

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` (field roles, length caps, E1→E2→E3 fade, preamble/retrospective checklists).
- Manually inspected every `iDo.steps[]`, `weDo.steps[]`, and `youDo` in the canonical source.
- Cross-checked UI behavior in `SectionView.tsx`: `tests` and `feedback` appear only after “Ver solución”; without `preamble` / `title` / `retrospective` the learner sees a truncated instruction blob and no metacognitive close.
- No bulk generation, no scripts to manufacture prose, no copy-paste across other sections.

## Cross-cutting diagnosis (Section 2)

| Gap | Scope | Impact on true newbie |
|-----|--------|------------------------|
| Missing `preamble` | All 8 iDo + all 24 weDo | Cannot answer *what / why / success / constraints* before code |
| Missing `retrospective` | All 33 units (incl. youDo) | No principle / misconception / transfer close |
| Missing We Do `title` | All 24 weDo | Card header truncates long `instruction` (UI fallback) |
| Success often only in `tests` | Most weDo | Criteria appear *after* solution reveal — useless as entry gate |
| `instruction` mixes essay + task | Many weDo | Violates “task steps only”; bloat + cognitive load |
| Feedback short / cheerleading | Several weDo | Explains outcome less than *reasoning* |
| Code pedagogy is strong | Nearly all units | Starters, solutions, outputs, hints, edge cases are solid — **do not rewrite code unless noted** |

**Overall tone of S02 content:** excellent technical design (intake story, `safe_int` contract, Decimal, raw/clean). The campaign gap is the **pedagogical shell** (preamble → task → retrospective), not broken exercises.

**Severity policy used here**
- **P0:** bare terminal drill for a newbie (no context/goal/success before start) *or* high-stakes transfer without framing *or* You Do without defense retrospective.
- **P1:** solid task body but missing title and/or preamble and/or retrospective; success partially implied.
- **P2:** polish (feedback wording, light instruction split, minor why tweaks).

---

## Unit ledger

### S02-T1-A-DEMO (iDo)
- **Diagnosis:** Strong worked example (six fields + `42` vs `"42"`). `description` and `why` orient the expert reader; a true newbie still drops into code without *what to watch* or a close that bridges to We Do. No `preamble`, no `retrospective`.
- **Checklist:** context fail · goal partial (in description) · success fail · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Antes de parsear un intake, el analista debe *ver* el tipo de cada campo. Esta demo usa un registro sintético (sin PII real) con `str`, `int`, `float`, `bool` y `None`. Observa la línea que compara `42` con `"42"`: si confundes número y texto, el pipeline de calidad miente. No escribas aún; sigue cada `print` y la salida esperada.
- **Proposed instruction/description improvements:** Keep description. Optional minor tighten of `why` (already good; length OK).
- **Proposed retrospective:**  
  Si puedes explicar por qué `"42"` no es `42` sin mirar el código, ya tienes el hábito de inspección de tipos. El teléfono y los códigos deben modelarse como `str`. En We Do clasificarás literales y elegirás tipos por semántica del campo.
- **Code/output changes:** none
- **Validation notes:** Preserve exact demo output (types + `False`).

---

### S02-T1-B-DEMO (iDo)
- **Diagnosis:** Models the unified `safe_int` contract used later everywhere — high transfer value. Missing “what to watch” (three branches) and post-demo consolidation that names the reuse sites (pipeline, T4-B, You Do).
- **Checklist:** context fail · goal partial · success fail · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A
- **Proposed preamble:**  
  En formularios y CSV casi todo llega como texto. Esta demo fija el contrato único de `safe_int` de la sección: vacío tras `strip`, entero OK, o basura con mensaje por campo. Observa la tupla `(ok, valor, mensaje)` y por qué `isinstance("19", int)` es `False`. Datos sintéticos; no uses `eval`.
- **Proposed instruction/description improvements:** Description is fine. Keep `why` focus on three-branch contract.
- **Proposed retrospective:**  
  Tres salidas posibles (OK / vacío / basura) y mensaje con nombre de campo: eso es validación profesional. El error clásico es tragar el fallo o convertir sin `strip`. Reutilizarás este contrato en el pipeline de dos campos y en el parser del You Do.
- **Code/output changes:** none
- **Validation notes:** Output must match theory `safe_int` strings exactly.

---

### S02-T2-A-DEMO (iDo)
- **Diagnosis:** Good PEP 8 + `==` model; comments about bad style are subtle. Newbie needs explicit “watch the names and the comparison operator,” then a bridge to bug-hunt E2.
- **Checklist:** context fail · goal partial · success fail · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A
- **Proposed preamble:**  
  En un code review junior en Perú, los nombres y `=` vs `==` se miran antes que el algoritmo. Esta demo muestra `snake_case`, una constante `UPPER_CASE` y una comparación con `==` (no asignación). Observa qué imprime el `if` cuando `edad` no es la mínima. No copies aún el estilo “malo” de los comentarios.
- **Proposed instruction/description improvements:** Keep description.
- **Proposed retrospective:**  
  Asignar es `=`; preguntar igualdad es `==`. Nombres legibles reducen `NameError` y aceleran la revisión. En We Do renombrarás variables y corregirás tres `if` rotos con `=`.
- **Code/output changes:** none
- **Validation notes:** Output `edad=25, mínima=18` must stay.

---

### S02-T2-B-DEMO (iDo)
- **Diagnosis:** Dual lesson (raw/clean strings + list alias/copy + `is None`) is dense for one demo. Without preamble, newbie may miss which prints prove *identity* vs *value*. Retrospective should separate the two habits for intake.
- **Checklist:** context fail · goal partial · success fail · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A
- **Proposed preamble:**  
  El contrato raw/clean del parser exige que el original sobreviva al `strip`. Aquí verás que `strip` devuelve *otro* string y que `b = a` en listas es un alias (mutar `b` muta `a`). También el idioma canónico `x is None`. Sigue raw → clean → alias → copia → `is None` en ese orden.
- **Proposed instruction/description improvements:** Keep description; `why` is strong.
- **Proposed retrospective:**  
  Strings limpios no deben sobrescribir el raw. En mutables, copia antes de mutar. `is` es para identidad (sobre todo `None`); `==` es para valor. We Do te pedirá romper el alias y diseñar un dict con `*_raw`.
- **Code/output changes:** none
- **Validation notes:** Preserve `raw is clean? False` and list prints.

---

### S02-T3-A-DEMO (iDo)
- **Diagnosis:** Clear operator table + IGV float demo as motivation for Decimal. Needs preamble on the precedence trap (`-3**2`) and that money is *expression practice only* here.
- **Checklist:** context fail · goal partial · success fail · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A
- **Proposed preamble:**  
  Antes de confiar en un cálculo de negocio, verifica `//`, `%`, `**` y paréntesis. Presta atención a `-3**2` (vale `-9`, no `9`) y a `(a+b)*c` vs `a+b*c`. El total con IGV 18% usa `float` a propósito: en T3-B lo harás con `Decimal`. Solo observa la salida.
- **Proposed instruction/description improvements:** Keep description.
- **Proposed retrospective:**  
  Precedencia no se memoriza a ciegas: paréntesis explícitos ganan en code review. La basura del float en montos se ataca en la siguiente demo con `Decimal`. We Do practicará operadores y la trampa de la potencia.
- **Code/output changes:** none
- **Validation notes:** Keep `total con IGV (float demo) = 118.0`.

---

### S02-T3-B-DEMO (iDo)
- **Diagnosis:** Core money contract for Perú (soles). `why` is excellent; still no pre-watch framing against `Decimal(0.1)` nor retrospective self-check.
- **Checklist:** context fail · goal partial · success fail · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A
- **Proposed preamble:**  
  En montos en soles, `float` miente: mira `0.1 + 0.2`. Esta demo construye `Decimal` **desde texto**, calcula IGV 18% y redondea a céntimos con `quantize(..., ROUND_HALF_EVEN)`. Observa que no aparece `Decimal(0.1)`. Datos de laboratorio; no es contabilidad real.
- **Proposed instruction/description improvements:** Keep description; optional one-line add to `why` about string constructor (already covered).
- **Proposed retrospective:**  
  Dinero = `Decimal` desde `str` + `quantize` a `0.01`. El error clásico es `Decimal(0.1)` o “arreglar” con `round` al final. En We Do compararás float vs Decimal y armarás propina y `parse_monto`.
- **Code/output changes:** none
- **Validation notes:** Exact outputs `0.30000000000000004`, `0.3`, `118.00`.

---

### S02-T4-A-DEMO (iDo)
- **Diagnosis:** Short f-string demo; good `why` about simulated input. Newbie may not notice *why* we avoid real `input()` in Pyodide/CI.
- **Checklist:** context fail · goal partial · success fail · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A
- **Proposed preamble:**  
  `input()` siempre devuelve `str`; en demos y tests simulamos la captura con variables. Esta demo reporta nombre y monto en soles con f-string y el especificador `:.2f` sobre un `Decimal`. Observa el separador personalizado del segundo `print`. No llames `input()` aquí.
- **Proposed instruction/description improvements:** Keep description.
- **Proposed retrospective:**  
  Separar captura, parse y reporte permite testear sin consola. f-strings + `:.2f` son el formato de resumen del intake. We Do escribirá saludos, reportes multi-línea y una función que simula prompts.
- **Code/output changes:** none
- **Validation notes:** Output lines must match exactly.

---

### S02-T4-B-DEMO (iDo)
- **Diagnosis:** Full mini-parser with three asserts — densest I Do. Without preamble a newbie cannot know which three gates matter (Unicode / vacío / edad inválida) or that asserts *are* the success criterion. High cognitive load → elevate severity.
- **Checklist:** context fail · goal partial · success fail · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** N/A
- **Proposed preamble:**  
  El gate del parser no es “imprimió algo”: son asserts sobre raw, Unicode y errores accionables. Esta demo modela el schema del You Do (CP-N1-A): `*_raw`, limpios, `errors`, y `safe_int` para edad. Observa los tres casos — feliz con Ñahui, nombres vacío, edad `"abc"` — y que el raw nunca se borra. Solo datos sintéticos.
- **Proposed instruction/description improvements:** Keep description; `why` already names the gate.
- **Proposed retrospective:**  
  Tres invariantes: raw siempre presente, Unicode round-trip, número inválido no revienta el proceso. El mensaje nombra campo y valor (`!r`). We Do construirá cada pieza y al final la suite completa; el You Do es este contrato con `main` y tests fijos.
- **Code/output changes:** none
- **Validation notes:** Do not change assert suite or printed dict/errors.

---

### S02-T1-A-E1 (weDo · guided)
- **Diagnosis:** Classic bare drill: instruction is “clasifica literales…” without context/goal/constraints; blanks only. Success lives mainly in `tests` (hidden until solution). No title, preamble, retrospective. Feedback is ok but short.
- **Checklist:** context fail · goal fail · success fail (not pre-task) · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Clasificar cinco literales con `type`
- **Proposed preamble:**  
  - **Contexto:** en un lote de intake sintético (CASO-LIM-002) el primer control de calidad es saber qué tipo trae cada literal.  
  - **Meta:** practicar `repr` + `type(...).__name__` sobre cinco valores base.  
  - **Éxito:** cinco líneas en este orden de tipos: `int`, `float`, `str`, `bool`, `NoneType` (p. ej. `0 → int`).  
  - **Límites:** no conviertas valores; no uses `eval`; solo datos del starter.
- **Proposed instruction/description improvements:**  
  1. Revisa la lista `literales` del starter.  
  2. En el `for`, completa los dos huecos del `print`.  
  3. Ejecuta y compara con la salida esperada (cinco líneas).
- **Proposed retrospective:**  
  El nombre del tipo se lee con `type(x).__name__`; `None` es `NoneType`, no `"None"`. El error clásico es tratar `False` como texto. Siguiente: demostrar que `42` y `"42"` no son lo mismo.
- **Code/output changes:** none
- **Validation notes:** Keep blank style `____` for guided scaffold.

---

### S02-T1-A-E2 (weDo · independent)
- **Diagnosis:** Richer task (types, equality, `isinstance` note) but still no preamble; success criteria mixed into a long instruction sentence; no title/retrospective. Fade from E1 is good (more reasoning, fewer pure blanks).
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Demostrar `42` vs `"42"` y el subtipo bool
- **Proposed preamble:**  
  - **Contexto:** el bug junior más caro en parse es comparar texto numérico con entero sin convertir.  
  - **Meta:** contrastar literales, igualdad cruda vs tras `str()`, y el matiz `isinstance(True, int)`.  
  - **Éxito:** salidas coherentes con tipos `int`/`str`, igualdad cruda `False`, tras `str()` `True`, `isinstance(True, int)` `True`, más una nota de una frase.  
  - **Límites:** no conviertas *antes* de la igualdad cruda; no abuses de bool-como-int en negocio.
- **Proposed instruction/description improvements:**  
  1. Completa los `print` del starter con `codigo_int` y `codigo_str`.  
  2. Imprime tipos, igualdad cruda, igualdad tras `str()`, e `isinstance(True, int)`.  
  3. Cierra con un `print` de nota (una frase) sobre no tratar banderas como montos.
- **Proposed retrospective:**  
  `42 == "42"` es `False` aunque “se vean” iguales; la conversión es explícita. `bool` subclase de `int` es un detalle del lenguaje, no un permiso de modelar banderas como dinero. En E3 elegirás tipos por semántica del campo de intake.
- **Code/output changes:** none (allow minor wording variance on the Nota line if tests stay semantic)
- **Validation notes:** Assert types and equalities; note text can be flexible.

---

### S02-T1-A-E3 (weDo · transfer)
- **Diagnosis:** Good transfer to intake schema; phone-as-str is the key constraint but buried mid-instruction. No title/preamble/retrospective. Starter is well faded (fill values, not loop body).
- **Checklist:** context fail · goal partial · success partial · constraints partial · retrospective fail
- **Severity:** P1
- **Proposed title:** Tipar campos del cliente de intake
- **Proposed preamble:**  
  - **Contexto:** el schema del registro sintético fija tipos antes de cualquier cálculo.  
  - **Meta:** elegir literales y tipos esperados por semántica de campo (no “lo que Excel infiera”).  
  - **Éxito:** seis campos con `ok=True`; `contacto` es `str` (teléfono), `edad` `int`, `activo` `bool`.  
  - **Límites:** teléfono **no** como `int`; Unicode permitido en nombres/apellidos; sin PII real.
- **Proposed instruction/description improvements:**  
  1. Completa cada par `(valor, tipo)` en el dict `campos`.  
  2. Asegura `contacto` como string de dígitos entre comillas.  
  3. Ejecuta el `for` de verificación; todas las líneas deben mostrar `ok=True`.
- **Proposed retrospective:**  
  Elegir tipo es diseño de schema: identificadores (teléfono, códigos) son `str`. `type(v) is t` comprueba clase exacta del literal; en parsers de validación preferirás `isinstance` (T1-B). Llevas esto al You Do al declarar el dict de salida.
- **Code/output changes:** none (synthetic names may vary if types hold)
- **Validation notes:** Rubric: 6 fields, contacto str, all type checks True.

---

### S02-T1-B-E1 (weDo · guided)
- **Diagnosis:** Instruction states success (`21` int) — better than average E1 — but still no context/constraints/retrospective/title. Bare one-liner conversion without job hook.
- **Checklist:** context fail · goal partial · success pass · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** Convertir edad con `strip` e `int`
- **Proposed preamble:**  
  - **Contexto:** en CSV/formularios la edad llega con espacios (`" 21 "`).  
  - **Meta:** hábito `strip` → constructor `int`.  
  - **Éxito:** imprime `21 int` (`edad == 21` y tipo `int`).  
  - **Límites:** no uses `eval`; no ignores espacios (aplica `strip` aunque a veces `int` tolere whitespace).
- **Proposed instruction/description improvements:**  
  1. A partir de `raw`, construye `edad` con `strip` e `int`.  
  2. Imprime valor y `type(edad).__name__`.  
  3. Verifica mentalmente: no debe quedar `str`.
- **Proposed retrospective:**  
  `strip` + `int` es el mínimo viable de campo numérico en texto. El error clásico es convertir sin limpiar y luego fallar en vacíos. Siguiente: envolver esto en `safe_int` con tres ramas.
- **Code/output changes:** none
- **Validation notes:** Output `21 int`.

---

### S02-T1-B-E2 (weDo · independent)
- **Diagnosis:** Core section skill. Instruction already states contract and cases — good independent fade. Still missing title/preamble/retrospective; constraints (`no eval`) only in feedback.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P1
- **Proposed title:** Implementar `safe_int` con tres ramas
- **Proposed preamble:**  
  - **Contexto:** el parser de intake no puede morir en el primer campo basura.  
  - **Meta:** devolver `(ok, valor|None, mensaje|None)` con mensaje accionable.  
  - **Éxito:** cuatro casos `" 21 "`, `""`, `"abc"`, `"  "` como en la solución (OK / vacío / basura / vacío).  
  - **Límites:** sin `eval`; sin `except: pass`; mensaje con nombre de campo y `!r` del valor.
- **Proposed instruction/description improvements:**  
  1. Completa el cuerpo de `safe_int` (vacío tras strip → error; `try int`; `ValueError` → mensaje).  
  2. Deja el `for` de prueba tal cual.  
  3. Ejecuta y compara las cuatro líneas con la solución.
- **Proposed retrospective:**  
  Una `safe_*` reutilizable es el núcleo del gate de parse. Vacío y basura son errores distintos: el mensaje debe decirlo. Reusarás esta función en el pipeline de dos campos y en el You Do.
- **Code/output changes:** none
- **Validation notes:** Message strings should match section contract.

---

### S02-T1-B-E3 (weDo · transfer)
- **Diagnosis:** Excellent multi-field transfer (raw/clean/errors). Instruction is long (essay + task). Needs preamble bullets; constraints against float/Decimal are in paren mid-text. Fade appropriate.
- **Checklist:** context partial · goal pass · success partial · constraints partial · retrospective fail
- **Severity:** P1
- **Proposed title:** Pipeline de dos enteros con raw/errors
- **Proposed preamble:**  
  - **Contexto:** un registro real tiene varios campos; uno puede fallar y el otro seguir OK.  
  - **Meta:** armar dict `raw` / `clean` / `errors` reutilizando `safe_int` dos veces.  
  - **Éxito:** tres escenarios impresos — ambos OK; edad inválida; anios inválidos — con raw intacto.  
  - **Límites:** solo enteros (sin float/Decimal aún); raw siempre con los strings de entrada.
- **Proposed instruction/description improvements:**  
  1. Implementa `pipeline(edad_txt, anios_txt)`.  
  2. Llama `safe_int` para `"edad"` y `"anios_cliente"`; acumula errores.  
  3. Si falla, `clean[campo] = None` pero `raw` conserva el texto.  
  4. Ejecuta los tres `print` del starter.
- **Proposed retrospective:**  
  Errores parciales + raw intacto es el embrión de `parse_client`. No “arregles” un campo pisando el original. Los montos con `Decimal` llegan en T3-B con el mismo estilo de tupla `(ok, valor, error)`.
- **Code/output changes:** none
- **Validation notes:** Preserve three printed dict shapes.

---

### S02-T2-A-E1 (weDo · guided)
- **Diagnosis:** Pure rename drill; instruction lists bad names but not job context. Success (“cinco nombres PEP 8”) weak for newbie who may invent different renames than the print expects.
- **Checklist:** context fail · goal partial · success partial · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Renombrar cinco variables a PEP 8
- **Proposed preamble:**  
  - **Contexto:** el schema de intake se lee en code review: nombres feos retrasan merges.  
  - **Meta:** pasar de CamelCase / abreviaturas / `l` a `snake_case` y `UPPER_CASE`.  
  - **Éxito:** el `print` final corre con `nombre_cliente`, `apellido_paterno`, `indice`, `longitud`, `EDAD_MAXIMA` y valores sintéticos dados.  
  - **Límites:** sin `l`/`O`/`I` sueltos; constante de tope en `UPPER_CASE`.
- **Proposed instruction/description improvements:**  
  1. Sustituye cada `____` por el nombre PEP 8 correcto.  
  2. Asigna los valores sintéticos del starter.  
  3. Ejecuta el `print` (debe listar los cinco sin `NameError`).
- **Proposed retrospective:**  
  `snake_case` para variables, `UPPER_CASE` para constantes de negocio. Evitar `l`/`O`/`I` evita confusiones con `1`/`0`. Siguiente: cazar `=` donde iba `==`.
- **Code/output changes:** none (names must match print identifiers)
- **Validation notes:** Output `Luis Ramos 0 5 120`.

---

### S02-T2-A-E2 (weDo · independent)
- **Diagnosis:** Excellent bug hunt; success clear (three `ok` lines). Missing title/preamble/retrospective; constraint no walrus is only in hint.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P1
- **Proposed title:** Corregir `=` por `==` en tres `if`
- **Proposed preamble:**  
  - **Contexto:** `if x = 1` es `SyntaxError` y el bug de novato más citado en review.  
  - **Meta:** distinguir asignación de comparación en condicionales.  
  - **Éxito:** el archivo corre e imprime exactamente tres líneas: `ok estado`, `ok codigo`, `ok flag`.  
  - **Límites:** no uses `:=` (morsa); en S02 compara con `==` (o truthiness de `flag`).
- **Proposed instruction/description improvements:**  
  1. Localiza las tres comparaciones rotas con `=`.  
  2. Corrígelas para que sean comparaciones válidas.  
  3. Ejecuta y confirma las tres líneas `ok`.
- **Proposed retrospective:**  
  `=` guarda; `==` pregunta. Detectarlo en review es habilidad de producción, no de examen. En E3 mapearás encabezados feos de CSV a identificadores estables.
- **Code/output changes:** none (solution may use `if flag:` — already does)
- **Validation notes:** Three ok prints; no SyntaxError.

---

### S02-T2-A-E3 (weDo · transfer)
- **Diagnosis:** Strong real-world rename map; instruction embeds success rubric lightly. Missing formal preamble/title/retrospective. Good transfer surface (CSV headers).
- **Checklist:** context partial · goal pass · success partial · constraints partial · retrospective fail
- **Severity:** P1
- **Proposed title:** Mapear encabezados CSV a snake_case
- **Proposed preamble:**  
  - **Contexto:** un CSV de intake llega con encabezados con espacios y tildes.  
  - **Meta:** proponer nombres Python estables (`apellido_paterno` / `apellido_materno` incluidos).  
  - **Éxito:** dict con 6 claves; cada encabezado imprime su `snake_case` (sin `???`).  
  - **Límites:** identificadores sin espacios ni tildes; sé consistente (p. ej. teléfono → `contacto`).
- **Proposed instruction/description improvements:**  
  1. Completa `mapeo` original → snake_case para los seis encabezados.  
  2. Incluye `apellido_paterno` y `apellido_materno`.  
  3. Ejecuta el `for` de impresión del mapeo.
- **Proposed retrospective:**  
  Renombrar columnas es el primer commit de un pipeline real: consistencia gana a creatividad. Los apellidos son campos de texto, no parentesco real. Llevas estos nombres al schema del You Do.
- **Code/output changes:** none preferred (solution uses `contacto`/`direccion`/`edad`)
- **Validation notes:** Rubric: 6 keys; both apellido_* present.

---

### S02-T2-B-E1 (weDo · guided)
- **Diagnosis:** Prediction table is good pedagogy but presented as bare fills. Expected bools only in `tests` (hidden). High misconception risk (`[] is []`, `1 is True`) needs pre-task success list.
- **Checklist:** context fail · goal partial · success fail · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Tabla `is` vs `==` (cinco predicciones)
- **Proposed preamble:**  
  - **Contexto:** en el parser usarás `is None` y evitarás `is` para igualdad numérica.  
  - **Meta:** contrastar identidad y valor con cinco expresiones.  
  - **Éxito:** resultados `True`, `True`, `False`, `True`, `False` en ese orden, más un comentario de cuándo usar cada operador.  
  - **Límites:** no “arregles” con conversiones; evalúa las expresiones tal cual.
- **Proposed instruction/description improvements:**  
  1. Completa cada `____` con la expresión correspondiente.  
  2. Ejecuta y verifica la tabla de bools.  
  3. Escribe un comentario de una línea: cuándo `is` vs cuándo `==`.
- **Proposed retrospective:**  
  `is` para identidad (sobre todo `None`); `==` para valor. `[] is []` es `False` porque son objetos distintos. `1 == True` no autoriza usar `is` con números. Siguiente: romper un alias de lista.
- **Code/output changes:** none
- **Validation notes:** Exact five bools.

---

### S02-T2-B-E2 (weDo · independent)
- **Diagnosis:** Clear success in instruction/asserts. Missing shell fields. Good independent fade (one blank for copy).
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P1
- **Proposed title:** Copiar lista y mutar sin alias
- **Proposed preamble:**  
  - **Contexto:** si `trabajo = original` y haces `append`, corrompes la fuente.  
  - **Meta:** crear una copia superficial y demostrar independencia.  
  - **Éxito:** `original == ["a", "b"]`, `trabajo == ["a", "b", "c"]`, `original is trabajo` → `False`.  
  - **Límites:** usa `.copy()` o slice `[:]`; la lista es solo preview de mutabilidad (colecciones a fondo después).
- **Proposed instruction/description improvements:**  
  1. Asigna `trabajo` como copia de `original`.  
  2. Haz `append("c")` solo en `trabajo`.  
  3. Imprime ambas listas y si son el mismo objeto.
- **Proposed retrospective:**  
  Romper el alias antes de mutar es no corromper la fuente de datos. `is` confirma identidad; `==` confirma contenido. En E3 aplicarás la misma idea a strings `*_raw` vs limpios.
- **Code/output changes:** none
- **Validation notes:** Asserts as stated.

---

### S02-T2-B-E3 (weDo · transfer)
- **Diagnosis:** Core raw/clean transfer with assert after mutate — excellent. Instruction is dense; needs preamble that names the audit habit. No title/retrospective.
- **Checklist:** context partial · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P1
- **Proposed title:** Dict raw/clean que sobrevive a mutar
- **Proposed preamble:**  
  - **Contexto:** auditoría de intake exige el texto original aunque el clean se normalice.  
  - **Meta:** `make_record` con `*_raw` y campos strip; luego mutar clean sin tocar raw.  
  - **Éxito:** asserts de raw intacto tras `.upper()` en clean; print final `raw preserved OK`.  
  - **Límites:** no reutilices el mismo nombre para raw y clean; Unicode (María) debe sobrevivir.
- **Proposed instruction/description improvements:**  
  1. Implementa `make_record` devolviendo las cuatro claves.  
  2. Corre el bloque que muta `rec["nombres"]`.  
  3. Confirma que los asserts de raw pasan.
- **Proposed retrospective:**  
  raw/clean es el contrato del You Do y del gate CP-N1-A. Si el assert pasa, ya piensas en auditoría. El error clásico es `clean = raw` en estructuras mutables o sobrescribir el mismo string “normalizado”.
- **Code/output changes:** none
- **Validation notes:** Keep assert block.

---

### S02-T3-A-E1 (weDo · guided)
- **Diagnosis:** Bare operator table; success numbers only in hints/tests. Instruction asks for a “nota” without stating expected values up front.
- **Checklist:** context fail · goal partial · success fail · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Tabla `// % ** /` con enteros
- **Proposed preamble:**  
  - **Contexto:** descomponer cantidades (cajas, cuotas) usa división entera y resto.  
  - **Meta:** practicar `//`, `%`, `**` y `/` en Python 3.  
  - **Éxito:** con `n=17`, `d=5` imprime `// 3`, `% 2`, `** 16`, `/ 3.4` y una nota de que `/` devuelve float.  
  - **Límites:** sin imports; no redondees a mano el `/`.
- **Proposed instruction/description improvements:**  
  1. Completa los cuatro operadores en los `print`.  
  2. Añade un `print` de nota sobre por qué `/` es float.  
  3. Ejecuta y compara con la solución.
- **Proposed retrospective:**  
  En Python 3, `/` siempre produce float; `//` y `%` descomponen enteros. El error clásico es asumir truncado “hacia cero” en negativos (`//` va hacia −∞). Siguiente: la trampa `-3**2`.
- **Code/output changes:** none
- **Validation notes:** Exact operator results.

---

### S02-T3-A-E2 (weDo · independent)
- **Diagnosis:** Success via assert is clear; still no job-context preamble or retrospective. Good independent focus on one misconception.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P1
- **Proposed title:** Precedencia de `-3**2` vs `(-3)**2`
- **Proposed preamble:**  
  - **Contexto:** una línea de scoring o fórmula con signo y potencia rompe silenciosamente.  
  - **Meta:** demostrar la precedencia de `**` sobre el unario `-`.  
  - **Éxito:** prints muestran `-9` y `9`; `cuadrado_neg == 9` y `assert OK`.  
  - **Límites:** no uses `pow` con float; paréntesis obligatorios para el cuadrado del negativo.
- **Proposed instruction/description improvements:**  
  1. Ejecuta mentalmente o imprime ambas formas de potencia.  
  2. Asigna `cuadrado_neg = (-3)**2`.  
  3. Deja el `assert` y confirma `assert OK`.
- **Proposed retrospective:**  
  `-3**2` es `-(3**2)`, no `(-3)**2`. Esta es la pregunta junior de precedencia: paréntesis antes que memoria. En E3 aplicarás paréntesis en la tasa IGV.
- **Code/output changes:** none
- **Validation notes:** Keep both prints and assert.

---

### S02-T3-A-E3 (weDo · transfer)
- **Diagnosis:** Transfer to IGV expression; intentionally shows float garbage (`94.3999…`) — pedagogically excellent if framed. Without preamble, newbie may think their solution is “wrong.” Success and “migrate to Decimal” need front-loading.
- **Checklist:** context fail · goal pass · success partial · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Subtotal e IGV 18% con paréntesis
- **Proposed preamble:**  
  - **Contexto:** ticket sintético de dos líneas; aquí entrenas la *expresión*, no dinero de producción.  
  - **Meta:** `subtotal` y `total = subtotal * (1 + 0.18)` con paréntesis explícitos en la tasa.  
  - **Éxito:** `subtotal` 80; `total` igual a `80*(1+0.18)` (puede mostrar basura float — es esperado).  
  - **Límites:** no uses `Decimal` aún; documenta que T3-B corrige la precisión.
- **Proposed instruction/description improvements:**  
  1. Suma las dos líneas en `subtotal`.  
  2. Calcula `total` multiplicando por `(1 + 0.18)`.  
  3. Imprime ambos; no “arregles” el float con `round` todavía.
- **Proposed retrospective:**  
  La expresión correcta es la mitad del trabajo; la otra mitad es no usar float en montos reales. Si viste `94.3999…`, ya tienes el argumento para exigir `Decimal` en T3-B.
- **Code/output changes:** none — **keep** float garbage in output (motivates next subtopic)
- **Validation notes:** Do not “fix” output to 94.4.

---

### S02-T3-B-E1 (weDo · guided)
- **Diagnosis:** Minimal contrast drill; success assert present in starter. Still bare without context of soles/fintech. Title/preamble/retrospective missing.
- **Checklist:** context fail · goal partial · success pass · constraints partial · retrospective fail
- **Severity:** P1
- **Proposed title:** Contrastar float y `Decimal("0.1")`
- **Proposed preamble:**  
  - **Contexto:** en onboarding de data financiera en Perú, el code review rechaza float para soles.  
  - **Meta:** ver la basura de `0.1+0.2` frente a `Decimal` desde str.  
  - **Éxito:** prints de float y Decimal; assert de suma Decimal a `0.3` y `assert OK`.  
  - **Límites:** `from decimal import Decimal`; **no** `Decimal(0.1)`.
- **Proposed instruction/description improvements:**  
  1. Completa los dos `print` del starter.  
  2. Deja el `assert` intacto.  
  3. Ejecuta hasta ver `assert OK`.
- **Proposed retrospective:**  
  Si viste `0.30000000000000004`, ya tienes el argumento de review. `Decimal` se construye desde texto para no heredar el error binario. Siguiente: propina con `quantize`.
- **Code/output changes:** none
- **Validation notes:** Exact float garbage string in output.

---

### S02-T3-B-E2 (weDo · independent)
- **Diagnosis:** Clear monetary targets in instruction/asserts. Missing shell; constraints “sin float” only partially fronted. Strong independent practice.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P1
- **Proposed title:** Propina 10% con `quantize` a céntimos
- **Proposed preamble:**  
  - **Contexto:** ticket sintético de restaurante en soles; necesitas céntimos estables.  
  - **Meta:** propina 10% y total con `ROUND_HALF_EVEN` y `quantize(0.01)`.  
  - **Éxito:** `propina == Decimal("8.55")` y `total == Decimal("94.05")`, print `OK`.  
  - **Límites:** sin `float`; multiplica por `Decimal("0.10")`; quantize en cada monto a persistir.
- **Proposed instruction/description improvements:**  
  1. Calcula `propina` quantizada a dos decimales.  
  2. Calcula `total` quantizado.  
  3. Ejecuta asserts del starter.
- **Proposed retrospective:**  
  Propina y total a 2 decimales sin basura: patrón listo para demos de data. Quantize en cada paso monetario, no solo al final “por suerte”. E3 generaliza esto a `parse_monto` desde texto de CSV.
- **Code/output changes:** none
- **Validation notes:** Exact Decimal asserts.

---

### S02-T3-B-E3 (weDo · transfer)
- **Diagnosis:** High-value `parse_monto` transfer matching `safe_int` shape. Instruction long; punto decimal convention is critical constraint for Perú and needs preamble emphasis.
- **Checklist:** context partial · goal pass · success partial · constraints partial · retrospective fail
- **Severity:** P1
- **Proposed title:** `parse_monto` con Decimal y errores
- **Proposed preamble:**  
  - **Contexto:** el monto llega como texto de formulario (`"150.50"`); el parser no puede explotar.  
  - **Meta:** `(ok, Decimal|None, error|None)` con strip, vacío, `InvalidOperation` y quantize `0.01`.  
  - **Éxito:** cuatro casos del starter (OK, OK quantize `20.10`, vacío, `abc`) con mensajes accionables.  
  - **Límites:** convención **punto** decimal (no coma); sin float; raw en el mensaje con `!r`.
- **Proposed instruction/description improvements:**  
  1. Implementa `parse_monto` siguiendo el contrato de la pista.  
  2. Rechaza vacío antes de construir Decimal.  
  3. Ejecuta el `for` de cuatro strings y compara salidas.
- **Proposed retrospective:**  
  Mismo contrato que `safe_int`: ok / valor / error. `InvalidOperation` es el `ValueError` del dinero. Conecta este helper al intake cuando el CSV traiga monto; no conviertas con float “por rapidez”.
- **Code/output changes:** none
- **Validation notes:** Match solution messages and `Decimal('20.10')`.

---

### S02-T4-A-E1 (weDo · guided)
- **Diagnosis:** Hello-world f-string; success string in instruction. Extremely bare without context of intake prompts. Risk of feeling like busywork.
- **Checklist:** context fail · goal partial · success pass · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** Saludo con f-string y acento
- **Proposed preamble:**  
  - **Contexto:** los prompts y mensajes del intake van en español claro, con Unicode.  
  - **Meta:** interpolar un nombre con f-string (estilo preferido de S02).  
  - **Éxito:** una línea exacta: `Hola, José. Bienvenido al intake.`  
  - **Límites:** usa f-string (no concatenación con `+` como solución principal).
- **Proposed instruction/description improvements:**  
  1. Construye `mensaje` interpolando `nombre`.  
  2. Imprímelo.  
  3. Verifica acento y texto completo.
- **Proposed retrospective:**  
  Unicode en f-strings “simplemente funciona” en Python 3. El error clásico es olvidar la `f` y ver llaves literales. Siguiente: reporte multi-línea con monto `:.2f`.
- **Code/output changes:** none
- **Validation notes:** Exact greeting string.

---

### S02-T4-A-E2 (weDo · independent)
- **Diagnosis:** Multi-line report with Decimal format — good independent task. Success (99.50) partially stated. Needs preamble on “analyst pastes this into a ticket.”
- **Checklist:** context fail · goal pass · success partial · constraints partial · retrospective fail
- **Severity:** P1
- **Proposed title:** Reporte multi-línea con `S/ {monto:.2f}`
- **Proposed preamble:**  
  - **Contexto:** el analista pega un resumen legible en el ticket de calidad.  
  - **Meta:** cuatro f-strings (nombres, apellido_paterno, contacto, monto).  
  - **Éxito:** salida con las 4 etiquetas y `monto: S/ 99.50` (dos decimales).  
  - **Límites:** no conviertas `Decimal` a `float` solo para formatear; usa `:.2f`.
- **Proposed instruction/description improvements:**  
  1. Completa los cuatro `print` como f-strings.  
  2. Formatea el monto con `S/` y `:.2f`.  
  3. Ejecuta y compara con la solución.
- **Proposed retrospective:**  
  Formato consistente gana a creatividad en reportes de datos. `Decimal` acepta `:.2f` en f-strings. En E3 harás la captura testeable sin `input()` real.
- **Code/output changes:** none
- **Validation notes:** Exact multi-line output.

---

### S02-T4-A-E3 (weDo · transfer)
- **Diagnosis:** Excellent transfer (pure function simulating input). Instruction already stresses no `input()` and all-str types. Missing title/preamble/retrospective shell.
- **Checklist:** context partial · goal pass · success pass · constraints pass · retrospective fail
- **Severity:** P1
- **Proposed title:** Simular prompts sin `input()` real
- **Proposed preamble:**  
  - **Contexto:** en Pyodide/CI no hay consola interactiva confiable; los tests necesitan funciones puras.  
  - **Meta:** `simular_intake(...)` devuelve campos str + subdict `types` con `__name__`.  
  - **Éxito:** `types["edad"]` y `types["nombres"]` son `"str"`; print `OK`.  
  - **Límites:** **no** llames `input()`; no conviertas tipos aún (eso es el parse).
- **Proposed instruction/description improvements:**  
  1. Implementa el dict de retorno con campos y `types`.  
  2. Usa `type(...).__name__` para cada campo (sin comprehensions si evitas complejidad).  
  3. Corre asserts del starter.
- **Proposed retrospective:**  
  Si el intake es str→dict puro, los tests del parser (T4-B) se automatizan. El error clásico es asumir que dígitos en pantalla ya son `int`. El parse viene después, campo por campo.
- **Code/output changes:** none
- **Validation notes:** Keep assert on types str.

---

### S02-T4-B-E1 (weDo · guided)
- **Diagnosis:** Empty-field gate — critical. Instruction states asserts; still light on context that empty is the first real-world break. No title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P1
- **Proposed title:** Parse de nombres vacíos con raw/errors
- **Proposed preamble:**  
  - **Contexto:** el caso vacío es el primero que rompe demos “felices” de intake.  
  - **Meta:** `parse_nombres` con `nombres_raw`, clean o `None`, y `errors` accionable.  
  - **Éxito:** con `""` → raw `""`, `nombres is None`, errors menciona nombres; print `OK`.  
  - **Límites:** guarda raw **antes** de strip; no borres el original.
- **Proposed instruction/description improvements:**  
  1. Completa `parse_nombres`.  
  2. Si vacío tras strip, agrega error y deja clean en `None`.  
  3. Ejecuta asserts del starter.
- **Proposed retrospective:**  
  Raw siempre presente aunque clean sea `None`. Mensaje accionable = campo + raw. Este micro-contrato se multiplica a todos los campos requeridos del You Do.
- **Code/output changes:** none
- **Validation notes:** Keep empty-case asserts.

---

### S02-T4-B-E2 (weDo · independent)
- **Diagnosis:** Unicode round-trip is essential for Perú but the task is almost trivial (two assignments). Instruction is bare; risk of underestimating the *principle*. Elevate framing, not code complexity.
- **Checklist:** context fail · goal partial · success pass · constraints partial · retrospective fail
- **Severity:** P1
- **Proposed title:** Conservar raw Unicode (`Ñahui`)
- **Proposed preamble:**  
  - **Contexto:** apellidos peruanos con ñ y tildes no pueden “romperse” a ASCII en el pipeline.  
  - **Meta:** separar raw (con espacios) y clean (`strip`) sin perder Unicode.  
  - **Éxito:** `raw == original`, `clean == "Ñahui"`, print `Unicode OK`.  
  - **Límites:** no encodes a ASCII; no mutes el string original (son inmutables de todos modos).
- **Proposed instruction/description improvements:**  
  1. Asigna `raw` al original.  
  2. Asigna `clean` con `strip`.  
  3. Corre los asserts.
- **Proposed retrospective:**  
  Si `Ñahui` sobrevive, tu pipeline no es del siglo ASCII. Raw con espacios + clean strip es el mismo hábito que en el parser completo. Siguiente: armar la suite de tres tests del cliente.
- **Code/output changes:** none
- **Validation notes:** Exact asserts.

---

### S02-T4-B-E3 (weDo · transfer)
- **Diagnosis:** Capstone of We Do — full `parse_client` suite. Instruction points to demo; starter is minimal (`pass`). For a true newbie this is P0 without preamble that lists the three gates and forbids uncaught `ValueError`. Feedback is good but hidden with solution.
- **Checklist:** context fail · goal partial · success partial · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Suite `parse_client`: Unicode, vacío, edad
- **Proposed preamble:**  
  - **Contexto:** este ejercicio es el corazón del You Do (CP-N1-A) en miniatura.  
  - **Meta:** `safe_int` + `parse_client` con `*_raw`, limpios y `errors`.  
  - **Éxito:** tres asserts pasan — Ñahui raw OK y sin errors; nombres vacío con error; edad `"abc"` con `edad_raw` intacto — y print `3 tests OK`.  
  - **Límites:** no dejes escapar `ValueError`; raw siempre presente; solo datos sintéticos.
- **Proposed instruction/description improvements:**  
  1. Implementa `safe_int` (vacío / OK / basura).  
  2. Implementa `parse_client` con schema completo y edad opcional.  
  3. No modifiques los tres bloques de assert; ejecútalos hasta `3 tests OK`.
- **Proposed retrospective:**  
  Si la suite pasa en local y en Pyodide, el incremento S02 del capstone está listo. Tres invariantes: Unicode, vacío, número inválido. El You Do añade `mostrar_resumen`, `main` y un cuarto caso de edad en blanco.
- **Code/output changes:** none
- **Validation notes:** Must remain aligned with You Do `_run_tests` (plus You Do’s fourth case).

---

### youDo — Parser de intake (youDo)
- **Diagnosis:** Strongest frame in the section: context, objectives, requirements, rubric, starter with fixed tests, portfolio note. **Missing only `retrospective`** (defense / self-check after build). For portfolio work this is a P0 gap relative to the campaign (no metacognitive close / interview defense prompts). Context already covers job story; do not bloat requirements.
- **Checklist:** context pass · goal pass · success pass (tests in starter) · constraints pass · retrospective fail
- **Severity:** P0
- **Proposed title:** (keep) Parser de intake — registro sintético de cliente
- **Proposed preamble:** N/A as separate field (context already serves; optional light tighten of context only if Fixer wants — not required).
- **Proposed instruction/description improvements:**  
  Optional: add one sentence to `context` that success = `_run_tests()` imprime `tests OK` and demo summary runs — only if not obvious from starter. Prefer **not** rewriting objectives/requirements.
- **Proposed retrospective:**  
  Antes de marcar listo: (1) ¿qué invariante demuestras con un assert (raw intacto, Unicode, o edad inválida)? (2) ¿qué harías distinto con datos reales vs sintéticos (PII)? (3) En el README, una frase de impacto medible (antes/después) que puedas defender en 30 segundos en entrevista. Extensiones naturales: más campos, `Decimal` para monto, lectura de CSV — sin tocar el contrato raw/clean/errors.
- **Code/output changes:** none to starter tests
- **Validation notes:** Keep four test cases (happy+Unicode, empty, invalid age, blank age).

---

## Priority order

### P0 (fix first)
1. **S02-T4-B-DEMO** — densest I Do; needs watch-list of three gates  
2. **S02-T4-B-E3** — full parse suite; entry framing for transfer  
3. **youDo** — add retrospective defense only  
4. **S02-T1-A-E1**, **S02-T1-A-E2** — bare type drills (open the section’s We Do)  
5. **S02-T2-A-E1**, **S02-T2-B-E1**, **S02-T3-A-E1** — pure blanks without pre-task success  
6. **S02-T3-A-E3** — float garbage must be *framed* or learners “fix” wrongly  

### P1 (shell for all remaining units)
- Remaining **6 iDo** demos: add `preamble` + `retrospective` (keep `why`)  
- Remaining **weDo**: add `title` + `preamble` + slim `instruction` to steps-only + `retrospective`  
- Notably: T1-B-E2/E3, T2-A-E2/E3, T2-B-E2/E3, T3-A-E2, T3-B-E1/E2/E3, T4-A-E1/E2/E3, T4-B-E1/E2  

### P2 (polish)
- Short feedback lines that only cheerlead: expand *reasoning* slightly where still under ~25 words after shell fix (e.g. T1-A-E2, T4-A-E1)  
- Ensure E1→E2→E3 titles visibly fade (guided defect → goal+success → new surface) without cloning prompts  

---

## Residual risks

1. **UI shows `tests` only after solution** — even perfect `tests` strings fail as entry success criteria; Fixer must put success in `preamble` (or visible instruction), not only `tests`.  
2. **Float garbage in T3-A-E3** — pedagogically intentional; if someone “cleans” output to 94.4 they break the bridge to Decimal.  
3. **Volume (24 weDo)** — high risk of Fixer template-paste; require hand variation per subtopic story (literales → safe_int → nombres → raw → ops → Decimal → f-string → parser).  
4. **T4-B-E3 ≈ You Do** — retrospective must differentiate practice suite vs portfolio defense (You Do adds `mostrar_resumen`, `main`, fourth age-blank case).  
5. **No code changes required for correctness** — nearly all solutions/outputs are already aligned with theory; avoid opportunistic rewrites.  
6. **Length discipline** — proposed texts above target the spec caps; Fixer should not expand into theory essays (theory tab already covers depth).

---

## Fixer handoff checklist (from §11, S02-specific)

- [ ] Every iDo step: `preamble` + `retrospective`  
- [ ] Every weDo step: short `title`, `preamble`, task-only `instruction`, `retrospective`  
- [ ] youDo: `retrospective` (context/objectives/requirements already strong)  
- [ ] Exact outputs preserved (especially float demos and `safe_int` messages)  
- [ ] Spanish PE; synthetic data only; no real PII  
- [ ] No generators / bulk paste of pedagogical prose  
- [ ] Section source still typechecks / static build  

---

Section 2 exercise pedagogy review complete. Ready for the Fixer prompt.
