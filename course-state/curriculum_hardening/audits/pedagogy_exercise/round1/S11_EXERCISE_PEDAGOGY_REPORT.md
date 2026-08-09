# S11 Exercise Pedagogy Report (Round 1)

## Section
- **title:** OOP y modelo de dominio
- **id:** `testing` (index 11; archivo histórico `s11-testing.ts` — contenido es OOP de dominio CP-N1-C, no “testing” genérico)
- **source:** `src/lib/course/sections/s11-testing.ts`
- **counts:** iDo 8, weDo 24 (8 subtemas × E1/E2/E3), youDo 1
- **subtopics:** T1-A dataclass/instancias · T1-B invariantes · T2-A properties/métodos · T2-B igualdad/hash/frozen · T3-A composición · T3-B Protocol · T4-A repo/service/serialización · T4-B tests de dominio y ética

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` (preamble checklist, retrospective, E1→E2→E3 fade, length limits)
- Manually inspected every `iDo.steps[]`, `weDo.steps[]`, and `youDo` in the source (código, starter, solution, output, instruction, hint(s), feedback, why)
- Cross-checked against section story (núcleo CP-N1-C: ClientRecord, ResolvedEntity, Transaction, RelationshipEvidence; local-python; sin `is_fraud`/`is_family`; datos sintéticos PE)
- No bulk generation, no scripts, no copy-paste across sections

## Global findings (before unit ledger)

| Gap | Where | Impact |
|-----|--------|--------|
| **Zero `preamble`** | All 8 iDo + all 24 weDo | Newbie no ve escenario de matching local → meta → éxito → límites antes del código |
| **Zero `retrospective`** | All iDo + weDo + youDo | Cierre metacognitivo ausente; no hay puente E1→E2→E3 ni al You Do / S12 |
| **Zero We Do `title`** | 24 weDo | Solo el prefijo “E1/E2/E3 …” dentro de `instruction`; UI carece de encabezado corto |
| **Instructions = drill + fixture** | Most weDo | “Completa X / implementa Y / imprime Z”; andamiaje de pasos uneven (E1 a veces denso, a veces telegráfico) |
| **Feedback de una línea** | Most weDo | Nombra el síntoma; pocas veces repara el *razonamiento* del anti-patrón (default mutable, float money, veredicto en dominio) |
| **`why` iDo corto y técnico** | 8 demos | Cumple rol técnico; no sustituye preamble (antes) ni retrospective (después) |
| **youDo bien enmarcado** | context/objectives/requirements/rubric + starter con oráculo `tests_pass` | Fuerte para proyecto; falta solo `retrospective` de defensa |
| **Código/outputs** | Casi todos | Pedagógicamente coherentes; defectos de starter bien etiquetados (`# DEFECT: …`); outputs canónicos claros |
| **Story alignment** | Strong | CASO-LIM-011, `@ejemplo.pe`, `C00x`/`E0x`, Decimal PEN/USD, sin PII real |

**Severity default for this section:** systematic missing preamble+retrospective is **P0** on every We Do and **P1** on I Do (demos still have `description`+`why`+worked code). youDo retrospective alone is **P1**. Feedback/title polish is often **P2** if preamble/instruction/retrospective land.

---

## Unit ledger

### S11-T1-A-DEMO (iDo)
- **Diagnosis:** Worked example sólido de `ClientRecord.from_dict` sobre dict sintético. `description` y `why` existen pero son telegráficos: el newbie no recibe “qué mirar antes de ejecutar” ni “qué principio se lleva”. El borde dict→dominio es el hilo del subtema; sin preamble se ve solo como “factory mágica”.
- **Checklist:** context fail · goal partial · success partial (output existe) · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Tras la CLI de S10, el onboarding sintético deja de ser un dict anónimo y pasa a un **tipo con nombre**. En esta demo un payload JSON-like (`C001`, `@ejemplo.pe`) se convierte con `from_dict` en `ClientRecord`. No escribas aún: sigue el `classmethod`, observa que `emails` se copia a lista, y predice el `repr` final. Sin PII real; solo stdlib.
- **Proposed instruction/description improvements:**  
  Description: “`ClientRecord.from_dict`: borde dict sintético → dataclass canónica”. Ampliar `why` (~60 palabras): el factory vive en la clase, no en la instancia; el CLI/JSON no inventa campos sueltos; `list(d.get(...))` evita alias del dict crudo.
- **Proposed retrospective:**  
  Si puedes explicar por qué `from_dict` es `@classmethod` y no método de instancia, ya tienes el hábito del borde dict→dominio. El error clásico es devolver el dict crudo. En We Do arreglarás default mutable, money con `Decimal` y la factory bien hecha.
- **Code/output changes:** none
- **Validation notes:** Output actual es el éxito observable de la demo.

---

### S11-T1-A-E1 (weDo, guided)
- **Diagnosis:** Defecto clásico y excelente: `emails: list = []` (default mutable). Instruction nombra campos y éxito pero mezcla meta con fixture; sin preamble de contexto CP-N1-C ni title ni retrospective. Feedback de una línea es correcto pero no ancla *cuándo* duele el bug (dos instancias, una lista).
- **Checklist:** context fail · goal pass · success partial · constraints partial (stdlib dicho) · retrospective fail
- **Severity:** P0
- **Proposed title:** ClientRecord con emails y default_factory
- **Proposed preamble:**  
  - **Contexto:** en el registro de cliente del matching local, cada `ClientRecord` necesita su propia lista de emails.  
  - **Meta:** completar la dataclass canónica y eliminar el default mutable.  
  - **Éxito:** un `repr` `ClientRecord(...)` con `emails=['ana@ejemplo.pe']`.  
  - **Límites:** solo stdlib; no uses `emails=[]` como default; datos sintéticos `C001` / `@ejemplo.pe`.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `emails: list = []` es el defecto (lista compartida).  
  2. Importa `field` y tipa `emails: list[str] = field(default_factory=list)`.  
  3. Instancia con `C001`, `DNI-1`, `Ana Pérez` y el email de demo.  
  4. Imprime el objeto (sin texto extra).
- **Proposed feedback improvement:**  
  Si dos instancias comparten la misma lista al mutar emails, el default se evaluó una sola vez. `field(default_factory=list)` crea una lista **nueva** por instancia — base del schema canónico de ClientRecord.
- **Proposed retrospective:**  
  Default mutable es el bug más caro en dataclasses de dominio. El mismo patrón aparece en listas de evidencias (T3-A). Siguiente: montos con `Decimal`, no `float`.
- **Code/output changes:** none
- **Validation notes:** Starter defect is pedagogical and well-formed.

---

### S11-T1-A-E2 (weDo, independent)
- **Diagnosis:** Buen foco independiente (`amount: float` → `Decimal` desde texto). Instruction densa tipo mini-spec; falta preamble de “por qué money no es float en matching financiero” y cierre. Feedback correcto en una frase. E2 debería fijar meta+éxito con menos migas — hoy aún suena a checklist.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Transaction con Decimal y moneda PEN
- **Proposed preamble:**  
  - **Contexto:** en el dominio de familiaridad, un monto de transacción es valor de negocio, no un `float` de demo.  
  - **Meta:** modelar `Transaction` con `Decimal` desde texto y `currency` obligatoria.  
  - **Éxito:** repr con `amount=Decimal('150.50')` y `currency='PEN'`.  
  - **Límites:** solo stdlib; no construyas el monto desde `float`; sin web/ORM.
- **Proposed instruction/description improvements:**  
  1. Cambia el tipo de `amount` de `float` a `Decimal`.  
  2. Importa `Decimal` y construye con `Decimal("150.50")`.  
  3. Mantén `tx_id`, `client_id`, `currency` obligatorios (sin defaults).  
  4. Imprime la instancia; no llames `float()`.
- **Proposed retrospective:**  
  Money en dominio se construye desde texto para evitar ruido binario. El mismo rigor de tipo prepara las invariantes de T1-B (positivo, 2 decimales, allowlist PEN/USD).
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto; starter defect clear.

---

### S11-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transferencia real: `from_dict` mal como método de instancia que devuelve el dict. Instruction ya narra el bug; falta contexto de rehidratación JSON/CLI y retrospective. El call site del starter (`ClientRecord.from_dict(ClientRecord(...), raw)`) es confuso a propósito — conviene que preamble diga *qué falla conceptualmente*.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** from_dict classmethod que devuelve ClientRecord
- **Proposed preamble:**  
  - **Contexto:** el borde de onboarding recibe un dict (JSON/CLI) y debe producir un `ClientRecord`, no reenviar el dict.  
  - **Meta:** corregir `from_dict` a `@classmethod` que construye con `cls(...)`.  
  - **Éxito:** una línea `ClientRecord C007`.  
  - **Límites:** solo stdlib; no devuelvas el dict crudo; emails con `list(d.get("emails", []))`.
- **Proposed instruction/description improvements:**  
  1. El starter define `from_dict` sobre `self` y devuelve `d` — ese es el defecto.  
  2. Conviértelo en `@classmethod` que lea las keys canónicas.  
  3. Llama `ClientRecord.from_dict(raw)` (sin instancia dummy).  
  4. Imprime `type(c).__name__` y `c.client_id`.
- **Proposed retrospective:**  
  Factory en la clase = borde reutilizable en repo y tests. Devolver el dict “porque ya está” salta el dominio. En T1-B validarás que lo construido no acepte ids vacíos.
- **Code/output changes:** none
- **Validation notes:** Starter call site is intentionally awkward; keep it.

---

### S11-T1-B-DEMO (iDo)
- **Diagnosis:** Demo clara fail-closed: ok + `document_id` vacío. `why` técnico corto. Falta escena “por qué un objeto a medias en el set de resolución es peor que un ValueError” y cierre metacognitivo.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Un `ClientRecord` con `document_id` en blanco no debe existir en memoria: el matching local fallaría más tarde y más opaco. Observa `validate()` reutilizable y `__post_init__` que lo invoca. Predice el `print` feliz y la línea `rejected document_id vacío`. Sin side-effects de red ni “arreglos” silenciosos del id.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: fail-on-construct centraliza reglas junto al tipo; el mismo `validate` sirve en factories y rehidratación.
- **Proposed retrospective:**  
  Si puedes decir por qué fallar al construir es más seguro que “arreglar” en el CLI, ya internalizaste fail-closed. We Do: invariantes de `Transaction`, `from_dict` con strip, y `validate()` que acumula errores.
- **Code/output changes:** none

---

### S11-T1-B-E1 (weDo, guided)
- **Diagnosis:** Starter acepta `0` y `EUR` sin `__post_init__` — defecto guiado excelente. Instruction densa (quantize, allowlist) pero sin preamble de “moneda sin conversión silenciosa” ni retrospective. Feedback bueno y corto.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Transaction rechaza cero y EUR
- **Proposed preamble:**  
  - **Contexto:** en el núcleo de dominio, un monto inválido o una moneda fuera de allowlist no debe circular.  
  - **Meta:** imponer invariantes en `__post_init__` (Decimal > 0, 2 decimales, PEN/USD).  
  - **Éxito:** tres líneas — repr PEN válido; `reject amount debe ser > 0`; `reject currency no soportada`.  
  - **Límites:** sin conversión PEN→USD; sin float; solo stdlib.
- **Proposed instruction/description improvements:**  
  1. Añade `__post_init__` al starter (hoy acepta todo).  
  2. Valida tipo Decimal, `amount > 0`, quantize a `0.01`, currency en `{"PEN","USD"}`.  
  3. Imprime el caso ok; captura `ValueError` en cero y EUR.  
  4. Prefija rechazos con `reject`.
- **Proposed retrospective:**  
  Fail-closed en money evita “arreglos” de moneda en el constructor. El allowlist es política de producto local, no un tipo mágico de Python. Siguiente: validar ids en `from_dict`.
- **Code/output changes:** none
- **Validation notes:** Solution output is the contract.

---

### S11-T1-B-E2 (weDo, independent)
- **Diagnosis:** Forma reducida (solo dos campos) enfoca strip/vacío bien. Instruction telegráfica; falta anclar por qué strip evita “espacio = id válido” en el borde JSON. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** from_dict rechaza document_id en blanco
- **Proposed preamble:**  
  - **Contexto:** al rehidratar un cliente desde dict, un `document_id` de solo espacios es basura disfrazada.  
  - **Meta:** validar `client_id` y `document_id` no vacíos tras `strip`.  
  - **Éxito:** repr ok de C1/D1; luego mensaje `document_id vacío`.  
  - **Límites:** forma reducida a propósito (no emails); solo stdlib; lanza `ValueError`.
- **Proposed instruction/description improvements:**  
  1. En `from_dict`, haz `strip` de ambos campos.  
  2. Si alguno queda vacío, lanza `ValueError` con mensaje claro.  
  3. Imprime el caso válido.  
  4. Captura el caso `" "` e imprime el error (sin traceback crudo si usas try).
- **Proposed retrospective:**  
  `strip` en el borde evita ids “válidos” que son basura visual. Misma regla que en `__post_init__` del I Do. Luego: `validate()` que devuelve lista (otro estilo de reporte de errores).
- **Code/output changes:** none

---

### S11-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Transferencia útil: acumular errores vs lanzar. Instruction clara; falta contexto de cuándo lista de errores (UI/API) vs fail-closed en constructor, y cierre. Feedback ya anticipa ese dualismo — reforzarlo en retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** validate() devuelve lista de errores
- **Proposed preamble:**  
  - **Contexto:** a veces la UI necesita *todos* los problemas de un registro, no solo el primero que lanza.  
  - **Meta:** implementar `validate() -> list[str]` (vacía si ok).  
  - **Éxito:** `['client_id vacío', 'document_id vacío']` y luego `[]`.  
  - **Límites:** no lances excepción en `validate`; no inventes veredictos de fraude; solo stdlib.
- **Proposed instruction/description improvements:**  
  1. El starter siempre devuelve `[]` — rellena las reglas con `strip`.  
  2. Acumula mensajes en una lista.  
  3. Imprime `bad.validate()` y `good.validate()`.  
  4. No conviertas esto en `is_fraud`.
- **Proposed retrospective:**  
  Lista de errores = reporte reutilizable; `__post_init__` = fail-closed. Ambos viven en el dominio; ninguno emite fraude. En T2-A pasarás de validar estado a exponer consultas seguras con properties.
- **Code/output changes:** none

---

### S11-T2-A-DEMO (iDo)
- **Diagnosis:** Demo limpia de `display_name` + `masked_email` con sentinel sin email. `why` menciona IndexError pero no hay preamble de “por qué el dashboard no imprime PII completa”. Sin retrospective.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  En logs y dashboard de evidencia el email completo no debe ser la superficie por defecto. Sigue las properties: `display_name` es lectura simple; `masked_email` particiona en `@`, enmascara el local y devuelve `(sin email)` si la lista está vacía — nunca `IndexError`. Datos sintéticos `Lucía` / `lucia@ejemplo.pe`. No escribas; predice las dos líneas de salida.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: properties sin side-effects; máscara para UI; raw solo en borde autorizado.
- **Proposed retrospective:**  
  Property = consulta calculada sin mutar. El sentinel documentado es fail-soft de presentación, no “arreglar” datos. We Do: property, método de consulta con validación de argumento, y setter de score con rango.
- **Code/output changes:** none

---

### S11-T2-A-E1 (weDo, guided)
- **Diagnosis:** Value object `PersonName` bien acotado (no schema alterno de ClientRecord). Defecto doble: método con paréntesis + orden apellido primero. Instruction OK; falta preamble/title/retrospective. Feedback corto correcto.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Property full_name en PersonName
- **Proposed preamble:**  
  - **Contexto:** entrenas `@property` en un value object de nombre, separado del schema de cliente.  
  - **Meta:** exponer `full_name` calculado (nombre + apellido) sin campo duplicado.  
  - **Éxito:** una línea `Ana Pérez` accedida **sin** paréntesis.  
  - **Límites:** solo stdlib; no guardes `full_name` como campo; no uses setter aquí.
- **Proposed instruction/description improvements:**  
  1. El starter usa `def full_name(self)` y orden invertido — corrige ambos.  
  2. Marca `@property` y concatena `first_name` + espacio + `last_name`.  
  3. Imprime `.full_name` (sin `()`).  
  4. No almacenes el string completo en el dataclass.
- **Proposed retrospective:**  
  Property calcula; no dupliques estado derivado. El acceso sin `()` es el contrato de “campo virtual”. Siguiente: consulta pura con argumento validado (`age_days_since`).
- **Code/output changes:** none

---

### S11-T2-A-E2 (weDo, independent)
- **Diagnosis:** Defecto de resta invertida + sin validación de día anterior — muy pedagógico. Instruction ya casi es spec completa; falta anclar “consulta pura = no muta, no red” en preamble y cerrar con misconception de invertir `day - day_created`.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** age_days_since como consulta pura
- **Proposed preamble:**  
  - **Contexto:** en demos sin `datetime`, un día entero basta para practicar consultas de edad del registro.  
  - **Meta:** implementar `age_days_since(day)` que valida y calcula sin mutar.  
  - **Éxito:** `15` (día 25 − creación 10) y `reject día anterior a creación`.  
  - **Límites:** no mutes `day_created`; no llames red/disco; solo stdlib.
- **Proposed instruction/description improvements:**  
  1. El starter resta al revés y no valida — localiza ambas fallas.  
  2. Si `day < day_created`, lanza `ValueError`.  
  3. Si no, devuelve `day - day_created`.  
  4. Imprime el ok; captura el reject con prefijo `reject`.
- **Proposed retrospective:**  
  Consulta pura = argumento válido + cálculo, sin side-effects. Invertir la resta es un bug silencioso que “casi” pasa tests. Luego: mutación controlada con setter de score.
- **Code/output changes:** none

---

### S11-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Transferencia fuerte (rango + `isfinite` + NaN). Starter “acepta todo” es perfecto. Falta preamble ético-técnico: score es señal, no veredicto; y retrospective que una el setter con el tema de matching.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Setter de score finito en [0, 1]
- **Proposed preamble:**  
  - **Contexto:** un score de señal puede mutar en un objeto de trabajo, pero nunca fuera de [0, 1] ni con NaN/inf.  
  - **Meta:** validar en el setter de `score` con `isfinite` y rango.  
  - **Éxito:** `ok 0.4`; `reject score fuera de rango`; `reject_nan score fuera de rango`.  
  - **Límites:** no “recortes” silenciosos a 1.0; score no es veredicto de fraude; solo stdlib.
- **Proposed instruction/description improvements:**  
  1. En el setter, convierte a float y valida.  
  2. Rechaza no finitos y fuera de [0, 1] con el mismo mensaje.  
  3. Caso ok 0.4; try/except en 1.5 y NaN.  
  4. Prefijos `ok` / `reject` / `reject_nan` según el contrato.
- **Proposed retrospective:**  
  NaN no es “casi 0”: rompe comparaciones. Validar en el setter evita basura en el pipeline de matching. En T2-B la mutabilidad se vuelve más peligrosa: identidad y hash.
- **Code/output changes:** none

---

### S11-T2-B-DEMO (iDo)
- **Diagnosis:** Demo excelente: dos E1 con nombres distintos colapsan en set size 2; id vacío rechazado. `why` telegráfico. Falta “qué línea predices primero” y el misconception de usar `document_id` como identidad.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  En resolución de entidades, la identidad estable es `entity_id`, no el nombre visible ni el documento. Observa `frozen=True`, `display_name` con `compare=False`, y el set `{e1, e1b, e2}`: el relabel de Ana **no** inventa una tercera entidad. También el reject de id en blanco. Predice `size 2` y `e1==e1b True` antes de mirar la salida.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: document_id es PII corregible; usarlo como key fusionaría entidades por accidente.
- **Proposed retrospective:**  
  Igualdad por id estable + etiqueta fuera del compare = set de matching confiable. We Do: frozen equality, dedup de evidencias, y el bug clásico de key mutable en dict.
- **Code/output changes:** none

---

### S11-T2-B-E1 (weDo, guided)
- **Diagnosis:** Starter sin frozen y con name en compare — defecto ideal. Instruction ya pide igualdad y tamaño de set; falta preamble de identidad vs etiqueta y retrospective. Feedback de una línea es bueno.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** ResolvedEntity frozen solo por entity_id
- **Proposed preamble:**  
  - **Contexto:** el set de resolución local colapsa entidades por id estable, no por el nombre mostrado.  
  - **Meta:** `frozen=True` + `display_name` con `compare=False`.  
  - **Éxito:** `True False` y tamaño de set `2`.  
  - **Límites:** no uses `document_id` en la igualdad; solo stdlib; id vacío se rechaza.
- **Proposed instruction/description improvements:**  
  1. El starter compara también el nombre — por eso el set no colapsa bien.  
  2. Aplica `frozen=True` y `field(compare=False)` en `display_name`.  
  3. Opcional: `__post_init__` que rechace id vacío.  
  4. Imprime `a == b, a == c` y `len({a, b, c})`.
- **Proposed retrospective:**  
  Etiqueta visible puede corregirse sin romper el set. Identidad ≠ presentación. Siguiente: evidencias frozen en un set (dedup exacto).
- **Code/output changes:** none

---

### S11-T2-B-E2 (weDo, independent)
- **Diagnosis:** Drill mínimo (añadir `frozen=True`) con output `2`. Pedagógicamente correcto como E2, pero instruction es casi un tweet; necesita preamble de *por qué* el set no colapsa sin frozen y un cierre de transferencia al matching.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Set de Evidence frozen colapsa duplicados
- **Proposed preamble:**  
  - **Contexto:** en el almacén de señales, el mismo triple (left, right, score) no debe contar dos veces.  
  - **Meta:** hacer `Evidence` hasheable de forma estable con `frozen`.  
  - **Éxito:** una línea `2` (duplicado exacto + un par distinto).  
  - **Límites:** solo stdlib; no implementes `__hash__` a mano si `frozen` basta.
- **Proposed instruction/description improvements:**  
  1. El starter no es frozen: el set no colapsa valores iguales.  
  2. Marca `@dataclass(frozen=True)`.  
  3. Mantén los tres elementos del set.  
  4. Imprime solo `len(s)`.
- **Proposed retrospective:**  
  Frozen + eq por campos = set de value objects sin keys inestables. Sin frozen, Python no trata dos “iguales” mutables como el mismo en un set. Luego: el anti-patrón de mutar la key de un dict.
- **Code/output changes:** none

---

### S11-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Transferencia excelente (BUG lookup None + SAFE row). Instruction pide imprimir BUG/SAFE pero el starter deja SAFE en `"skipped"` — bien. Falta preamble conceptual (hash cambia → bucket perdido) y retrospective. Feedback correcto.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Key mutable vs FrozenEntity en dict
- **Proposed preamble:**  
  - **Contexto:** usar una entidad mutable como key de dict es un bug clásico de matching en memoria.  
  - **Meta:** demostrar el lookup roto tras mutar y la versión frozen segura.  
  - **Éxito:** `BUG lookup_after_mutate None` y `SAFE row`.  
  - **Límites:** no “arregles” el mutable con hacks; muestra el contraste; solo stdlib.
- **Proposed instruction/description improvements:**  
  1. Conserva el bloque mutable que muta `name` tras insertar.  
  2. Observa que `d.get(m)` devuelve `None`.  
  3. Añade `FrozenEntity` frozen e inserta/lookup con la misma identidad.  
  4. Imprime las dos líneas con prefijos `BUG` y `SAFE`.
- **Proposed retrospective:**  
  Si el hash depende de un campo mutable, el dict “pierde” la entrada. Frozen cierra esa puerta. En T3-A agruparás entidades y evidencias con composición, no con herencia forzada.
- **Code/output changes:** none

---

### S11-T3-A-DEMO (iDo)
- **Diagnosis:** Composición CaseFile + evidencias validadas (par canónico, score). `why` bueno pero corto. Falta escena “has-a vs is-a” y el aviso ético de que score ≠ parentesco.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El expediente de matching **tiene** una entidad y **tiene** evidencias: composición, no herencia de “Persona base”. Observa `RelationshipEvidence` fail-closed (par canónico, score finito en [0,1]) y `CaseFile.add` que solo agrega objetos ya válidos. Predice `E1 n_ev 2` y la lista de scores. No hay `is_family()`.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: add no revalida el mundo; el invariante vive en el value object.
- **Proposed retrospective:**  
  Composición mantiene el grafo auditable. El par canónico evita duplicar (E1,E2)/(E2,E1). We Do: reemplazar herencia, arreglar default mutable en CaseFile, y codificar el par canónico.
- **Code/output changes:** none

---

### S11-T3-A-E1 (weDo, guided)
- **Diagnosis:** Herencia forzada `Client(PersonInfo)` con orden confuso de args — defecto guiado excelente. Instruction clara; falta preamble de “sin subtipo real no heredes” y retrospective. Feedback bueno.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Client tiene PersonInfo (composición)
- **Proposed preamble:**  
  - **Contexto:** reutilizar un nombre no justifica `Client` como subtipo de `PersonInfo`.  
  - **Meta:** modelar has-a: `Client` con campo `person`.  
  - **Éxito:** `C001 Ana` y `design=composition`.  
  - **Límites:** no heredes de `PersonInfo`; solo stdlib.
- **Proposed instruction/description improvements:**  
  1. Quita la herencia en `Client`.  
  2. Añade campo `person: PersonInfo`.  
  3. Construye `Client("C001", PersonInfo("Ana", "Pérez"))`.  
  4. Imprime `client_id` + `person.first_name` y la línea `design=composition`.
- **Proposed retrospective:**  
  is-a solo con subtipo real; has-a desacopla. Cambiar `PersonInfo` no rompe la identidad de `Client`. Siguiente: lista de evidencias sin default mutable.
- **Code/output changes:** none

---

### S11-T3-A-E2 (weDo, independent)
- **Diagnosis:** Mismo anti-patrón de T1-A (default `[]`) aplicado a agregados — refuerzo deliberado y bueno. Instruction con éxito `n= 2 empty 0`; falta preamble que conecte “expediente contaminado” y retrospective de por qué reaparece el bug.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** CaseFile sin lista compartida entre casos
- **Proposed preamble:**  
  - **Contexto:** cada expediente de matching debe nacer vacío, no heredar evidencias del anterior por accidente.  
  - **Meta:** `evidences` con `field(default_factory=list)` y `add_evidence`.  
  - **Éxito:** una línea `n= 2 empty 0`.  
  - **Límites:** no uses `evidences=[]`; solo stdlib.
- **Proposed instruction/description improvements:**  
  1. El starter comparte la lista: CF2 “ve” lo de CF1.  
  2. Cambia a `field(default_factory=list)`.  
  3. Añade dos evidencias a CF1; crea CF2 limpio.  
  4. Imprime el contrato exacto `n= 2 empty 0`.
- **Proposed retrospective:**  
  Default mutable en agregados contamina casos. Es el mismo principio de emails en ClientRecord, ahora en el grafo de evidencias. Luego: invariantes del value object de relación.
- **Code/output changes:** none

---

### S11-T3-A-E3 (weDo, transfer)
- **Diagnosis:** Transferencia completa (par canónico + score + CaseFile). Starter agrega (E2,E1) sin validar. Instruction sólida; falta preamble de “por qué el orden de ids importa en el almacén” y cierre ético (score ≠ parentesco).
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Par canónico y score en RelationshipEvidence
- **Proposed preamble:**  
  - **Contexto:** (E1,E2) y (E2,E1) no deben ser dos relaciones distintas en el matching local.  
  - **Meta:** validar par canónico (`left_id < right_id`) y score finito en [0, 1].  
  - **Éxito:** `n_ev 2` y `reject par no canónico`.  
  - **Límites:** no implementes `is_family()`; no recortes scores en silencio; solo stdlib.
- **Proposed instruction/description improvements:**  
  1. Añade `__post_init__` con comparación lexicográfica e `isfinite`.  
  2. Agrega dos evidencias válidas (p. ej. E1-E2 y E1-E3).  
  3. Intenta construir (E2,E1) y captura el reject.  
  4. Imprime `n_ev` y `reject …`.
- **Proposed retrospective:**  
  Canonicidad es invariante de almacenamiento, no estética. Score es dato de matching. En T3-B desacoplarás el dominio de implementaciones concretas con Protocol.
- **Code/output changes:** none

---

### S11-T3-B-DEMO (iDo)
- **Diagnosis:** Protocol + FakeStore + `upsert` tipado al puerto — demo clara. `why` menciona S12; falta preamble de “por qué no acoplar a SQL ahora” y retrospective.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El servicio de dominio no debe importar SQLite ni HTTP para guardar una entidad. Observa el `Protocol EntityStore` (`get`/`save`) y un `FakeStore` en memoria que cumple el contrato por forma. Sigue `upsert`: depende del puerto, no de una clase base pesada. Predice el dict de `E9` en la salida. Adapter real llega en S12.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: duck typing estructural; fakes de test sin mock frameworks.
- **Proposed retrospective:**  
  Puerto = contrato; adapter = detalle. Si el fake funciona, el dominio es testeable offline. We Do: renombrar método al contrato, inyectar normalizers, y decidir cuándo *no* introducir Protocol (YAGNI).
- **Code/output changes:** none

---

### S11-T3-B-E1 (weDo, guided)
- **Diagnosis:** Defecto fino y excelente: `compute` vs `score` (nombre del puerto). Instruction pide 0.5; falta preamble de “el nombre es el contrato” y retrospective. Feedback ya lo dice en una línea — reforzar.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** FakeScorer cumple el método score del Protocol
- **Proposed preamble:**  
  - **Contexto:** un fake de scoring solo sirve si expone el **mismo** método que el puerto.  
  - **Meta:** implementar `score` (no `compute`) para el par `("E1","E2")`.  
  - **Éxito:** una línea `0.5`.  
  - **Límites:** no instancies el Protocol; solo stdlib.
- **Proposed instruction/description improvements:**  
  1. El starter llama `compute` — renombra al contrato `score`.  
  2. Tipa opcionalmente `s: Scorer = FakeScorer()`.  
  3. Imprime `s.score(("E1", "E2"))`.  
  4. No cambies la firma del Protocol.
- **Proposed retrospective:**  
  El nombre del método *es* el contrato. Un fake con otro verbo no es intercambiable. Siguiente: inyectar políticas de normalización sin heredar.
- **Code/output changes:** none

---

### S11-T3-B-E2 (weDo, independent)
- **Diagnosis:** `apply` ignora `norm` — defecto simple y claro de inyección. Instruction mínima; necesita preamble de “política de texto inyectable” y retrospective de duck typing (callable, no solo Protocol formal).
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** apply inyecta strip y casefold
- **Proposed preamble:**  
  - **Contexto:** el dominio de matching no debe hardcodear una sola política de normalización de texto.  
  - **Meta:** hacer que `apply(norm, text)` invoque el normalizer recibido.  
  - **Éxito:** dos líneas `Ana` y `ana`.  
  - **Límites:** no hardcodes strip dentro de `apply`; solo stdlib.
- **Proposed instruction/description improvements:**  
  1. El starter devuelve `text` y ignora `norm`.  
  2. Cambia a `return norm(text)`.  
  3. Mantén los dos normalizers del fixture.  
  4. Imprime ambos resultados.
- **Proposed retrospective:**  
  Inyectar el callable evita acoplar una sola política. Es el mismo espíritu del Protocol, a escala de función. Luego: YAGNI — cuándo *no* crear un Protocol.
- **Code/output changes:** none

---

### S11-T3-B-E3 (weDo, transfer)
- **Diagnosis:** Mini-DSL de decisión YAGNI con etiquetas literales — transferencia conceptual fuerte (no solo “arregla el bug de código”). Instruction densa; starter siempre `True`. Falta preamble de “costo de abstracción prematura” y retrospective que conecte a S12 (sí habrá adapters).
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Cuándo introducir Protocol (YAGNI)
- **Proposed preamble:**  
  - **Contexto:** un Protocol “por si acaso” con una sola impl y sin fakes es ruido de diseño.  
  - **Meta:** codificar `should_introduce_protocol` con reglas estables.  
  - **Éxito:** tres líneas `WHEN_NOT: solo_una_impl`, `WHEN_NOT: api_inestable`, `INTRODUCE: dos_adapters_con_fake`.  
  - **Límites:** etiquetas literales del contrato; solo stdlib.
- **Proposed instruction/description improvements:**  
  1. El starter siempre devuelve `True` — aplica las reglas de los hints.  
  2. False si API inestable; False si <2 adapters y sin fake.  
  3. Recorre los casos del fixture.  
  4. Imprime `WHEN_NOT:` / `INTRODUCE:` + label.
- **Proposed retrospective:**  
  Abstracción cuando hay al menos dos caminos o dobles de test **y** la API ya no baila. En T4-A el puerto se concreta en repo/service/serialización sin meter veredictos.
- **Code/output changes:** none

---

### S11-T4-A-DEMO (iDo)
- **Diagnosis:** Service + repo + `to_dict` + assert ético `has_is_fraud False`. Muy alineado al gate. Falta preamble de fronteras CLI/service/dominio y retrospective.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  La CLI de S10 no debe cargar las reglas de negocio: un `ClientService` orquesta `register` sobre un repo en memoria y devuelve un dict de borde. Observa que **no** existe `is_fraud` en el service. Predice el dict de Ana y `has_is_fraud False`. I/O de archivos y argparse quedan fuera del núcleo.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: service no imprime ni parsea CLI; `to_dict` es borde, no invariante.
- **Proposed retrospective:**  
  Persistencia ligera + ausencia deliberada de veredictos = dominio listo para tests puros. We Do: `to_dict` sin nota interna, repo save/get, y capas cli/service/domain como tipos.
- **Code/output changes:** none

---

### S11-T4-A-E1 (weDo, guided)
- **Diagnosis:** Defecto de privacidad/export: `internal_note` se filtra al dashboard. Instruction buena; falta preamble de “borde de serialización ≠ dump del objeto” y retrospective. Feedback OK.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** to_dict omite internal_note del export
- **Proposed preamble:**  
  - **Contexto:** el export al dashboard de evidencia no debe llevar notas de backoffice.  
  - **Meta:** `to_dict` con client_id/document_id/full_name/emails únicamente.  
  - **Éxito:** dict sin clave `internal_note` (aunque el objeto la tenga).  
  - **Límites:** no modeles contraseñas en el agregado; copia emails con `list(...)`; solo stdlib.
- **Proposed instruction/description improvements:**  
  1. El starter serializa `internal_note` — quítalo del dict.  
  2. Mantén los cuatro campos públicos.  
  3. Usa `list(self.emails)` para no filtrar la lista interna.  
  4. Imprime el `to_dict` del caso VIP de demo.
- **Proposed retrospective:**  
  Serializar no es “vars(obj)”. El borde elige qué sale. Misma disciplina que no meter secretos en el agregado de familiaridad. Siguiente: repo en memoria.
- **Code/output changes:** none

---

### S11-T4-A-E2 (weDo, independent)
- **Diagnosis:** `get` siempre `None` con `save` aparentemente ok — defecto de una línea ideal para E2. Instruction corta; necesita preamble de “repo light sin CLI” y cierre.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Repo en memoria: save y get por client_id
- **Proposed preamble:**  
  - **Contexto:** el service necesita un repositorio mínimo para roundtrip de clientes sintéticos.  
  - **Meta:** implementar `save`/`get` sobre un dict interno.  
  - **Éxito:** `{'client_id': 'C001', 'email': 'a@ejemplo.pe'}` tras save/get.  
  - **Límites:** sin red/DB; `get` missing → `None`; solo stdlib.
- **Proposed instruction/description improvements:**  
  1. El starter guarda pero `get` ignora el almacén.  
  2. Implementa `return self._d.get(client_id)`.  
  3. Mantén la clave `client_id` del row.  
  4. Imprime el roundtrip de C001.
- **Proposed retrospective:**  
  Repo light = diccionario con contrato, no framework. El service orquesta; el repo no conoce argparse. Luego: clasificar capas cli/service/domain.
- **Code/output changes:** none

---

### S11-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Modelar fronteras como datos (`Layer`) es transferencia conceptual fuerte. Starter tiene service.may_print True y domain.holds_invariants False. Instruction densa; falta preamble de por qué el service no imprime y retrospective hacia tests (T4-B).
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Capas cli, service y domain
- **Proposed preamble:**  
  - **Contexto:** mezclar print de negocio e invariantes en el service ensucia el núcleo.  
  - **Meta:** clasificar tres capas con flags `may_print`, `may_parse_cli`, `holds_invariants`.  
  - **Éxito:** tres líneas `LAYER: …` con cli print/cli True; service ambos False; domain inv=True.  
  - **Límites:** service no imprime ni parsea CLI; solo domain sostiene invariantes; solo stdlib.
- **Proposed instruction/description improvements:**  
  1. Corrige el starter: service no imprime; domain sí sostiene invariantes.  
  2. Mantén el orden cli → service → domain.  
  3. Conserva el formato de `print` del fixture.  
  4. No añadas capas extra.
- **Proposed retrospective:**  
  CLI habla con humanos; service orquesta; dominio guarda la verdad del negocio. Esa frontera permite tests puros en T4-B sin red.
- **Code/output changes:** none

---

### S11-T4-B-DEMO (iDo)
- **Diagnosis:** Tests éticos `hasattr` + rango de score — corazón del gate. `why` bueno. Falta preamble de “documentar el límite legal en código” y retrospective.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Un test que verifica la **ausencia** de `is_fraud` / `is_related_family` no es adorno: fija el límite ético del producto de matching. Sigue las dos funciones: score en rango y no-APIs de veredicto. Predice dos `pass`. Fixtures sintéticos; sin red ni DB.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: suite de dominio = invariantes + ética codificada; scores son campos.
- **Proposed retrospective:**  
  Si el test de “no existe el método” pasa, el diseño resiste la tentación del veredicto fácil. We Do: test de rechazo real, fake repo con asserts, y extraer `decide_fraud` del dominio.
- **Code/output changes:** none

---

### S11-T4-B-E1 (weDo, guided)
- **Diagnosis:** Starter “test always pass” sin `__post_init__` — defecto de teatro de tests excelente. Instruction corta; falta preamble de “un test que no ejercita el rechazo es teatro” y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Test real: document vacío debe fallar
- **Proposed preamble:**  
  - **Contexto:** los tests del dominio demuestran invariantes, no imprimen `pass` por cortesía.  
  - **Meta:** rechazar `document_id` en blanco y hacer que el test solo pase si hay `ValueError`.  
  - **Éxito:** una línea `pass`.  
  - **Límites:** sin red/DB; forma reducida client_id+document_id; solo stdlib.
- **Proposed instruction/description improvements:**  
  1. Añade `__post_init__` que falle con strip vacío.  
  2. En el test, usa try/except: si no lanza, `assert False`.  
  3. Devuelve `"pass"` solo en el except correcto.  
  4. Imprime el resultado del test.
- **Proposed retrospective:**  
  Teatro de tests = falsa seguridad. El try/except debe ser real. Siguiente: tres tests de service con fake repo y asserts de verdad.
- **Code/output changes:** none

---

### S11-T4-B-E2 (weDo, independent)
- **Diagnosis:** Starter imprime tres `pass` sin asserts; fake `save` no-op — perfecto para E2 de disciplina de pruebas. Instruction mínima; necesita preamble de fake vs “mock mágico” y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres tests puros con FakeRepo
- **Proposed preamble:**  
  - **Contexto:** el service de dominio se prueba con un repo en memoria, no con magia de mocks.  
  - **Meta:** `register`, `get` existente y `get` missing con asserts reales.  
  - **Éxito:** tres líneas `pass`.  
  - **Límites:** sin red/DB; el fake implementa save/get de verdad; solo stdlib.
- **Proposed instruction/description improvements:**  
  1. Haz que `FakeRepo.save` guarde en `self.d` y `get` recupere.  
  2. `Service.register` debe persistir y devolver el row.  
  3. Cada test hace assert y luego imprime `pass`.  
  4. Missing: `get("X") is None`.
- **Proposed retrospective:**  
  Fake = implementación simple del puerto. Assert antes del print evita teatro. Luego: extraer el anti-patrón de veredicto del dominio.
- **Code/output changes:** none

---

### S11-T4-B-E3 (weDo, transfer)
- **Diagnosis:** Transferencia ética clave del curso: `decide_fraud` → `RelationshipEvidence` con score. Instruction clara; starter deja DESPUES todavía True. Falta preamble de impacto de producto y retrospective de defensa para el You Do.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Extraer decide_fraud; dejar solo signal_score
- **Proposed preamble:**  
  - **Contexto:** un método `decide_fraud` en el dominio de familiaridad es un riesgo de producto y de ética.  
  - **Meta:** mostrar el ANTES, modelar evidencia con score, y assert de ausencia de APIs de veredicto.  
  - **Éxito:** `ANTES has_decide_fraud True` y `DESPUES signal_score 0.95 has_decide_fraud False`.  
  - **Límites:** no implementes `is_family`; umbrales de producto viven fuera; solo stdlib.
- **Proposed instruction/description improvements:**  
  1. Conserva el print ANTES sobre `Client.decide_fraud`.  
  2. Define `RelationshipEvidence` frozen con ids + `signal_score`.  
  3. Assert `not hasattr` de decide_fraud/is_fraud/is_related_family.  
  4. Imprime DESPUES con el score 0.95 y `has_decide_fraud False` sobre la clase de evidencia.
- **Proposed retrospective:**  
  Scores son datos; veredictos son frontera humana/producto. Ese límite es el gate CP-N1-C. En You Do integrarás los cuatro tipos con tests que lo demuestren de punta a punta.
- **Code/output changes:** none

---

### youDo — Modelo de dominio Cliente–Transacción–Evidencia
- **Diagnosis:** Proyecto bien enmarcado: context, objectives, requirements, rubric, starter con TODOs y oráculo `tests_pass`. Portfolio note y ética presentes. **Falta únicamente `retrospective`** de defensa/metacognición post-build (spec §3 You Do). Sin ella el learner cierra el tab sin ensayar la justificación de 30 s del gate.
- **Checklist:** context pass · goal pass · success pass (oráculo + rubric) · constraints pass · retrospective **fail**
- **Severity:** P1
- **Proposed title:** (ya existe) Modelo de dominio Cliente–Transacción–Evidencia
- **Proposed preamble:** N/A — `context` ya cubre el rol de preamble del proyecto; no duplicar ensayo.
- **Proposed instruction/description improvements:**  
  Ninguno estructural. Opcional menor: en `portfolioNote`, una línea que recuerde contrastar datos sintéticos vs PII real en el README de límites.
- **Proposed retrospective:**  
  Antes de marcar listo: (1) ¿qué invariante demuestras con el oráculo `tests_pass` (vacíos, Decimal, par canónico, ausencia de `is_fraud`)? (2) ¿qué harías distinto con datos reales vs sintéticos `@ejemplo.pe` (PII, logs, export)? (3) Escribe en el README una frase de impacto medible (antes: dicts anónimos / después: tipos con fail-closed) que puedas defender en 30 segundos ante un revisor de producto.
- **Code/output changes:** none (starter y oráculo son pedagógicamente sólidos)
- **Validation notes:** Requirements already encode ethical and technical gates; Fixer only needs `retrospective` field if schema supports it.

---

## Priority order

### P0 (We Do — missing preamble + title + retrospective; instruction/feedback polish)
1. All 24 We Do units, in pedagogical order T1-A → T4-B (E1 then E2 then E3 within each subtopic).
2. Within each unit Fixer should add: `title`, `preamble`, task-only `instruction`, stronger `feedback` where noted, `retrospective`.
3. Highest conceptual risk if left bare: **T1-A-E1** (default mutable), **T1-B-E1** (money invariants), **T2-B-E3** (mutable key), **T3-A-E3** (canonical pair), **T4-B-E3** (extract fraud API).

### P1 (I Do demos + You Do close)
1. All 8 I Do: add `preamble` + `retrospective`; optionally thicken `why` to 40–90 words.
2. You Do: add `retrospective` de defensa (context/objectives already strong).

### P2 (polish after P0/P1 land)
1. We Do feedback expansions already drafted above (reasoning, not just symptom).
2. Minor description wording on iDo where noted.
3. Ensure UI field names match schema (`title`/`preamble`/`retrospective`) when Fixer lands.

---

## Residual risks

1. **Filename vs content:** `s11-testing.ts` / id `testing` can confuse Fixers and analytics; pedagogical report uses content truth (OOP dominio). Consider rename in a later housekeeping PR — out of scope for this review.
2. **Forma reducida vs canónica:** T1-B E2/E3 y T4-B E1 usan ClientRecord de 2 campos; T1-A y You Do usan forma canónica de 4. Es deliberado y bueno, pero preambles deben decir “forma reducida a propósito” para no sembrar schema drift en el learner.
3. **E2 T2-B (frozen set) es muy corto:** riesgo de que el Fixer sobre-escriba instruction y quite el carácter independiente; mantener meta+éxito, no re-guiar línea a línea.
4. **T3-B-E3 es conceptual:** algunos newbies esperan “bug de código” puro; el preamble debe legitimar el ejercicio de diseño YAGNI.
5. **T4-B-E3 solution still defines `decide_fraud` on Client for the ANTES print:** pedagogically intentional; Fixer must not “clean” that away or the ANTES line breaks.
6. **Outputs must be preserved** unless execute-and-diff justifies change; this review proposes **no code/output changes**.
7. **Spanish PE:** all proposed learner-facing text is professional Peruvian Spanish; no real PII.

---

## Fixer handoff notes

- Implement fields only; do not regenerate exercises with scripts.
- Prefer the proposed texts as starting points; shorten if over word caps after paste (spec §4).
- Keep `# DEFECT:` comments in starters — they are guided breadcrumbs for E1.
- Run section typecheck / static build after edits; do not alter `tests_pass` oracle semantics in youDo.
- Gold tone references (do not copy content): S26, S30, S33, S50.

---

Section 11 exercise pedagogy review complete. Ready for the Fixer prompt.
