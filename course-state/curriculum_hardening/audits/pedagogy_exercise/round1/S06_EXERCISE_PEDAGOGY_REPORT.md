# S06 Exercise Pedagogy Report (Round 1)

## Section
- **title:** Colecciones y estructuras de datos
- **id:** `numpy` (index 6; archivo histórico `s06-numpy.ts` — contenido es colecciones stdlib, no NumPy)
- **source:** `src/lib/course/sections/s06-numpy.ts`
- **counts:** iDo 8, weDo 24 (8 subtemas × E1/E2/E3), youDo 1
- **subtopics:** T1-A secuencias/slicing · T1-B unpack/alias/copia · T2-A dicts · T2-B sets/dedup · T3-A anidado · T3-B missing · T4-A sorted · T4-B elección/JSON

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` (preamble checklist, retrospective, E1→E2→E3 fade, length limits)
- Manually inspected every `iDo.steps[]`, `weDo.steps[]`, and `youDo` in the source (código, starter, solution, output, instruction, hint(s), feedback, why)
- Cross-checked against section story (modelo tabular en RAM / inicio CP-N1-B, datos sintéticos, sin NumPy/pandas)
- No bulk generation, no scripts, no copy-paste across sections

## Global findings (before unit ledger)

| Gap | Where | Impact |
|-----|--------|--------|
| **Zero `preamble`** | All 8 iDo + all 24 weDo | Newbie no ve escenario → meta → éxito → límites antes del código |
| **Zero `retrospective`** | All iDo + weDo + youDo | Cierre metacognitivo ausente; no hay puente a la siguiente práctica |
| **Zero We Do `title`** | 24 weDo | Solo el prefijo “E1/E2/E3 …” dentro de `instruction`; UI carece de encabezado corto |
| **Instructions = drill + fixture** | Most weDo | “Concepto + datos + imprime X”; poco andamiaje ordenado en pasos para E1 |
| **Feedback de una línea** | Most weDo | No explica el *razonamiento* del error típico ni el porqué del patrón |
| **`why` iDo corto y técnico** | 8 demos | Cumple rol técnico; no sustituye preamble (antes) ni retrospective (después) |
| **youDo bien enmarcado** | context/objectives/requirements/rubric | Fuerte para proyecto; falta solo `retrospective` de defensa |
| **Código/outputs** | Casi todos | Pedagógicamente coherentes; defectos de starter bien nombrados en la mayoría de E1 |

**Severity default for this section:** systematic missing preamble+retrospective is **P0** on every We Do and **P1** on I Do (demos still have `description`+`why`+worked code). youDo retrospective alone is **P1**. Feedback/title polish is often **P2** if preamble/instruction/retrospective land.

---

## Unit ledger

### S06-T1-A-DEMO (iDo)
- **Diagnosis:** Demo sólida de ventana `txs[-n:]` + proyección a tupla de keys. `description` y `why` existen pero son telegráficos. No hay preamble (qué mirar antes de ejecutar) ni retrospective (principio + misconception de off-by-one / mutar keys). Un newbie ve código y output sin saber *por qué* la tupla de keys es un “contrato”.
- **Checklist:** context fail · goal partial (implícito en description) · success partial (output existe, no se nombra como criterio) · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  En un extracto de onboarding sintético (ids `T0x`, sin PII real) necesitas las **últimas N** transacciones y un contrato fijo de columnas. Observa la demo sin escribir aún: (1) `txs[-n:]` arma la ventana sin mutar la lista original; (2) la tupla `keys` fija qué campos se proyectan; (3) el `print` de `len(ventana)` confirma el tamaño. El stop del slicing es exclusivo como en `range`. Datos de demo únicamente.
- **Proposed instruction/description improvements:**  
  Mantener description casi igual; opcional: “Ventana de últimas txs con slicing y contrato de keys (tuple)”. Ampliar `why` a ~60 palabras: proyección por keys + inmutabilidad del contrato vs. lista de headers mutable.
- **Proposed retrospective:**  
  Si puedes decir por qué `keys` es tuple y no list, ya internalizaste el contrato de columnas. El error clásico es copiar filas a mano con un `for` en vez de slicing. En We Do T1-A practicarás ventanas y el choque al mutar una tuple.
- **Code/output changes:** none
- **Validation notes:** Output actual es el éxito observable de la demo.

---

### S06-T1-A-E1 (weDo, guided)
- **Diagnosis:** Drill clásico: starter usa `txs[:2]` (primeros 2) en vez de últimos 2; caso vacío ya está en fixture. Instruction nombra éxito pero mezcla meta y pasos; sin preamble (contexto extracto / CP-N1-B) ni retrospective. Feedback de una línea no repara el misconception “slicing vacío lanza error”.
- **Checklist:** context fail · goal partial · success pass (casi: output esperado en solution) · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Últimos 2 montos con slicing negativo
- **Proposed preamble:**  
  - **Contexto:** en el mini almacén de txs sintéticas, el reporte “últimos movimientos” usa ventanas, no reescritura a mano.  
  - **Meta:** practicar slicing negativo y el caso lista vacía.  
  - **Éxito:** con `txs = [10,20,30,40,50]` imprimes `[40, 50]` y `2`; con lista vacía, `[]` y `0`.  
  - **Límites:** solo biblioteca estándar; no mutes `txs`; no uses bucles para la ventana.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `ventana = txs[:2]` toma el **inicio**, no el final.  
  2. Cambia a `txs[-2:]` (y lo mismo en `empty`).  
  3. Imprime la ventana y su `len` en ambos casos.  
  4. No agregues texto extra en los `print`.
- **Proposed feedback improvement:**  
  `[:2]` son los primeros dos; `[-2:]` son los últimos. En lista vacía el slicing devuelve `[]` sin `IndexError` — por eso el caso vacío se prueba junto a la ventana feliz.
- **Proposed retrospective:**  
  La ventana negativa es el mismo patrón de “últimos N” del extracto. No confundas índice `[ -2 ]` (un elemento) con slice `[-2:]` (lista). Siguiente: contrato de columnas con tuple (E2).
- **Code/output changes:** none (output canónico correcto)
- **Validation notes:** Starter defect is pedagogical and well-formed.

---

### S06-T1-A-E2 (weDo, independent)
- **Diagnosis:** Buen foco (list → tuple + `+` sin mutar). Instruction densa con éxito implícito; sin preamble ni title. Feedback bueno en una frase pero corto. E2 debería fijar meta+éxito con menos migas que E1 — hoy aún suena a mini-spec, no a práctica independiente con andamiaje de contexto.
- **Checklist:** context fail · goal pass · success partial · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Headers a tuple y extensión sin mutar
- **Proposed preamble:**  
  - **Contexto:** el esquema de columnas del almacén no debe mutarse si un helper hace `append` por error.  
  - **Meta:** convertir headers a `tuple` y demostrar extensión con `+`.  
  - **Éxito:** `KEYS` imprime `('id', 'monto')`; `more` es `('id', 'monto', 'canal')`; `KEYS` sigue igual después.  
  - **Límites:** no uses `.append` sobre `KEYS`; no dejes `KEYS` como alias de la lista.
- **Proposed instruction/description improvements:**  
  1. Parte de `headers = ['id', 'monto']`.  
  2. Crea `KEYS` inmutable desde esa lista.  
  3. Construye `more` agregando `'canal'` sin mutar `KEYS`.  
  4. Imprime `KEYS`, `more` y de nuevo `KEYS` para verificar estabilidad.
- **Proposed retrospective:**  
  Tuple = snapshot de contrato; list = cola que crece. Si necesitas “agregar columna”, creas **otra** secuencia. Luego (E3) verás el `AttributeError` al tratar la tuple como lista mutable.
- **Code/output changes:** none
- **Validation notes:** Starter `KEYS = headers` + `KEYS + ['canal']` es el defecto correcto para E2.

---

### S06-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transferencia real (diagnóstico AttributeError → list → append). Instruction ya narra el bug; falta contexto de cuándo conviene tuple vs list en el almacén, y cierre retrospectivo. Feedback aceptable pero sin misconception explícito (“convertí todo a list y perdí el contrato”).
- **Checklist:** context fail · goal pass · success partial · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Diagnosticar append sobre tuple de ids
- **Proposed preamble:**  
  - **Contexto:** a veces un snapshot de ids llega como tuple (inmutable); el pipeline intenta mutarlo como cola.  
  - **Meta:** capturar `AttributeError`, convertir a `list` y mutar una **copia**.  
  - **Éxito:** un `print` de diagnóstico con nombre `AttributeError` y luego `['C001', 'C002', 'C003']`.  
  - **Límites:** no uses `except Exception` genérico en la solución; no mutes la tuple original (no se puede).
- **Proposed instruction/description improvements:**  
  1. Intenta `ids.append('C003')` dentro de `try`.  
  2. En `except AttributeError`, imprime tipo y mensaje.  
  3. Convierte a lista, haz `append('C003')` e imprime el resultado.  
  4. Deja la tuple original intacta en el mensaje de error.
- **Proposed retrospective:**  
  Mutar exige list; el snapshot de ids puede seguir siendo tuple. El error es la señal, no un “fallo vergonzoso”. En T1-B el riesgo sube: alias y copias en listas de dicts.
- **Code/output changes:** none
- **Validation notes:** Starter uses bare `Exception` — E1-style defect for transfer diagnosis; OK.

---

### S06-T1-B-DEMO (iDo)
- **Diagnosis:** Excelente worked example alias → shallow `dict(c)` → deep. `why` correcto pero sin escena previa ni cierre. El output muestra contaminación por alias; el learner necesita que le digan *qué línea* observar primero (`mal = clientes`).
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Antes de “clonar” clientes en el store en RAM, confunde nombre con copia. Sigue la demo: `mal = clientes` **es alias**; al mutar `score` el original cambia. Luego `dict(c)` por fila aísla el nivel 1 si los campos son planos; `deepcopy` aísla anidados. Datos sintéticos `C00x`. No reescribas el código; predice cada `print` y compáralo con la salida.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: explicar por qué shallow de dicts planos basta aquí y cuándo no (tags/listas internas → T1-B We Do E3).
- **Proposed retrospective:**  
  Si `b = a` y mutas un campo, ambas variables ven el cambio: no hay “copia mágica”. Shallow corta el contenedor; deep corta el grafo. We Do: unpack, alias vs `copy()`, y tags anidados.
- **Code/output changes:** none (nota: demo usa shallow vía `dict(c)`; theory usa `rows.copy()` — consistente pedagógicamente si se explica)

---

### S06-T1-B-E1 (weDo, guided)
- **Diagnosis:** Starter con índices cruzados (`region = fila[2]`) es un defect guiado claro. Instruction demasiado corta (“imprime los tres”); no ancla shape de fila al almacén. Sin preamble/title/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Desempaquetar fila en cid, región y monto
- **Proposed preamble:**  
  - **Contexto:** filas sintéticas de intake llegan como tuplas posicionales; el unpack documenta el shape.  
  - **Meta:** asignar `cid, region, monto` sin índices sueltos.  
  - **Éxito:** una línea `C001 Lima 10` (en ese orden).  
  - **Límites:** no uses índices `fila[i]` en la solución final; no fuerces el caso de largo incorrecto aquí.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: `region` y `monto` están cruzados.  
  2. Sustituye por unpack `cid, region, monto = fila`.  
  3. Imprime los tres en un solo `print`.  
  4. Confirma mentalmente que el largo de `fila` es 3.
- **Proposed retrospective:**  
  Unpack es un contrato de shape: si el largo no calza, Python falla — y eso es bueno. Siguiente: alias vs `copy()` en listas (E2).
- **Code/output changes:** none

---

### S06-T1-B-E2 (weDo, independent)
- **Diagnosis:** Demo de alias vs copy con ints (shallow suficiente). Instruction procedural pero sin por qué laboral; feedback corto. Falta explicitar éxito de las dos líneas de print.
- **Checklist:** context fail · goal pass · success partial · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Alias versus copy en lista de enteros
- **Proposed preamble:**  
  - **Contexto:** al “duplicar” una cola de ids numéricos de demo, `=` no copia.  
  - **Meta:** contrastar alias y `list.copy()` con mutaciones `append`.  
  - **Éxito:** tras alias append 3 → `xs` y `copia` divergen (`[1,2,3]` vs `[1,2]`); tras append 4 solo a copia → `xs` sin 4.  
  - **Límites:** no uses `deepcopy` aquí (ints inmutables; shallow basta).
- **Proposed instruction/description improvements:**  
  1. Parte de `xs = [1, 2]`.  
  2. Crea `alias` (mismo objeto) y `copia` (shallow).  
  3. Mutar alias, imprimir; mutar copia, imprimir.  
  4. Compara con el output de la solución.
- **Proposed retrospective:**  
  `copy()` corta el alias del **contenedor**. Con objetos anidados el cuento cambia (E3). Pregunta de cierre: ¿por qué `copia` no vio el 3?
- **Code/output changes:** none

---

### S06-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Transferencia fuerte al modelo cliente/tags. Starter deja `deep = rows.copy()` a propósito. Instruction ya es buena; faltan preamble (fuga en CP-N1-B) y retrospective. Feedback menciona modelo pero no el misconception “ya hice copy, estoy a salvo”.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Tags anidados: shallow no aísla
- **Proposed preamble:**  
  - **Contexto:** clientes con `tags: list` en el store; un helper “copia” el lote y contamina el original.  
  - **Meta:** demostrar que `list.copy()` comparte dicts internos y que `deepcopy` aísla.  
  - **Éxito:** tras shallow, original tiene `'s'`; tras deep append `'d'`, original **no** gana solo `'d'` de más (queda con `['a','s']` y deep con `['a','s','d']` según fixture).  
  - **Límites:** `import copy`; no inventes otra estructura.
- **Proposed instruction/description improvements:**  
  1. Ejecuta el starter y observa la fuga por tags.  
  2. Reemplaza la “deep” falsa por `copy.deepcopy`.  
  3. Mutar solo el deep e imprime original vs deep.  
  4. No “arregles” borrando el experimento shallow: sirve de contraste.
- **Proposed retrospective:**  
  Shallow de `list[dict]` **no** aísla campos lista/dict. En el You Do, si mutas contactos de una copia, decide deep o reconstrucción por fila. Puente a T2: índices dict sin copiar de más.
- **Code/output changes:** none

---

### S06-T2-A-DEMO (iDo)
- **Diagnosis:** Índice `id→cliente` + `get` encadenado claro. Nombres sintéticos LATAM OK. Falta preamble (por qué lista + índice conviven) y retrospective (KeyError vs default).
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Cuando buscas “¿dónde está C002?” muchas veces, recorrer la lista es lento y ruidoso. La demo construye un índice `id → fila`, hace lookup de nombre con `get` anidado y muestra un id ausente → `"N/A"`. Observa también `sorted(idx)`: las keys del dict se ordenan al reportar. Solo datos sintéticos; no reescribas, sigue los `print`.
- **Proposed retrospective:**  
  Lista = orden de llegada; dict = lookup. `get` evita KeyError en demos de intake; el acceso duro se reserva a invariantes. We Do: construir dict desde pares, `get` vs KeyError, y merge de configs sin mutar defaults.
- **Code/output changes:** none

---

### S06-T2-A-E1 (weDo, guided)
- **Diagnosis:** Starter deja `d = pares` (lista) — defect guiado excelente. Instruction mezcla meta y anti-patrón; sin title/preamble/retrospective. Feedback idiomático pero seco.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Dict desde pares id–región
- **Proposed preamble:**  
  - **Contexto:** un lote sintético llega como pares `(id, región)` y necesitas un índice de lookup.  
  - **Meta:** construir un `dict` real, no dejar la lista de pares.  
  - **Éxito:** imprime `{'C001': 'Lima', 'C002': 'Cusco'}` y el lookup `Cusco` con clave `'C002'`.  
  - **Límites:** claves hashables (`str`); no uses pandas.
- **Proposed instruction/description improvements:**  
  1. El starter asigna `d = pares` (sigue siendo lista).  
  2. Construye el dict con `dict(pares)` (o comprensión).  
  3. Imprime el dict y `d['C002']`.  
  4. No indexes por posición `d[1]` como si fuera lista.
- **Proposed retrospective:**  
  `dict(pares)` es el constructor idiomático clave–valor. El índice del almacén nace así. Siguiente: `get` cuando el id puede faltar (E2).
- **Code/output changes:** none

---

### S06-T2-A-E2 (weDo, independent)
- **Diagnosis:** Contraste get vs KeyError bien elegido. Starter incompleto (falta el `get` de C001/C999). Instruction lista tareas sin criterio de líneas de salida. Sin scaffolding de contexto de campos opcionales.
- **Checklist:** context fail · goal pass · success partial · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** get con default frente a KeyError
- **Proposed preamble:**  
  - **Contexto:** ids opcionales en intake sintético: a veces reportas “N/A”, a veces un bug de programación debe fallar fuerte.  
  - **Meta:** usar `get` para opcionales y capturar `KeyError` en acceso duro.  
  - **Éxito:** tres líneas conceptuales: `Ana`, `N/A`, y un print de `KeyError 'C999'`.  
  - **Límites:** no tragues todas las excepciones con `except Exception`.
- **Proposed instruction/description improvements:**  
  1. Con `idx = {'C001': 'Ana'}`, imprime `get` de C001 y de C999 (default `'N/A'`).  
  2. En un `try`, accede `idx['C999']`.  
  3. En `except KeyError`, imprime el error.  
  4. Compara con la solución: no omitas el `get` de C001.
- **Proposed retrospective:**  
  `get` = ausencia esperada; `KeyError` = invariante roto. En el modelo anidado (T3-B) reutilizarás el mismo criterio con rutas de claves.
- **Code/output changes:** none

---

### S06-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Merge sin mutar defaults — transfer laboral real. Starter muta con `update` y confunde merged/defaults. Instruction larga pero usable; faltan preamble/retrospective y feedback de razonamiento (precedencia override).
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Fusionar config sin mutar defaults
- **Proposed preamble:**  
  - **Contexto:** varios helpers comparten una config base de retry/timeout; un override no debe pisar el original en memoria.  
  - **Meta:** merge con precedencia override > defaults, dejando `defaults` intacto.  
  - **Éxito:** `merged` con `retry: 5` y `timeout: 30`; `defaults` sigue en `retry: 1`; opcional mostrar copy+update.  
  - **Límites:** no dejes `defaults.update(override)` sobre el dict compartido.
- **Proposed instruction/description improvements:**  
  1. Observa el starter: `update` muta `defaults`.  
  2. Construye `merged` sin mutar el base (`{**defaults, **override}` u equivalente).  
  3. Imprime merged y defaults.  
  4. (Opcional del solution) muestra `dict(defaults)` + `update` como alternativa segura.
- **Proposed retrospective:**  
  Precedencia documentada + no mutar config compartida evita bugs fantasmas entre helpers. Puente a T2-B: sets y conflictos de dedup en el almacén.
- **Code/output changes:** none

---

### S06-T2-B-DEMO (iDo)
- **Diagnosis:** Núcleo de calidad: unique + conflicts + intersección de lotes. `why` corto. Newbie necesita preámbulo que separe “duplicado idéntico” de “conflicto de payload”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  En calidad de datos, deduplicar **no** es borrar a ciegas. Observa: tres filas con `C001` — dos con el mismo email (duplicado inocente) y una con email distinto (conflicto reportado). La demo lista `unique`, cuenta conflictos y muestra intersección de dos lotes con sets. Predice `n_conflicts` antes de mirar el output. Solo emails `*@ex.com` sintéticos.
- **Proposed retrospective:**  
  Primera vista en `unique`; payload distinto → `conflicts` con traza. “El último gana” sin reporte es anti-patrón. We Do: emails ordenados, operaciones de set, y `dedup_report` completo.
- **Code/output changes:** none

---

### S06-T2-B-E1 (weDo, guided)
- **Diagnosis:** `set` sin `sorted` = salida no determinista. Instruction nombra éxito; sin contexto de export reproducible. Feedback OK en una línea.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Emails únicos en lista ordenada
- **Proposed preamble:**  
  - **Contexto:** cohorte de contactos sintéticos; el set deduplica, pero el print debe ser estable.  
  - **Meta:** unicos como lista ordenada, no set crudo.  
  - **Éxito:** `['a@ex.com', 'b@ex.com']` (una sola vez cada email).  
  - **Límites:** no dependas del orden de inserción del set.
- **Proposed instruction/description improvements:**  
  1. El starter imprime un `set` sin orden garantizado.  
  2. Usa `sorted(set(emails))`.  
  3. Imprime solo esa lista.  
  4. Verifica que el duplicado no aparece dos veces.
- **Proposed retrospective:**  
  Dedup + `sorted` = demo reproducible. El mismo hábito se reutiliza en JSON `sort_keys` (T4-B). Siguiente: intersección y diferencia simétrica (E2).
- **Code/output changes:** none

---

### S06-T2-B-E2 (weDo, independent)
- **Diagnosis:** Starter usa `|` y `-` en vez de `&` y `^` — defect independiente bueno. Instruction ya es clara; falta contexto de “quién está en ambos lotes / solo en uno”.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Intersección y diferencia simétrica de lotes
- **Proposed preamble:**  
  - **Contexto:** dos lotes de emails de campaña sintética; necesitas “en ambos” y “solo en uno”.  
  - **Meta:** `a & b` y `a ^ b`, ambos ordenados.  
  - **Éxito:** inter `b@…, c@…`; symdiff `a@…, d@…`.  
  - **Límites:** no uses bucles O(n²) para membership; sets + `sorted`.
- **Proposed instruction/description improvements:**  
  1. Corrige operadores del starter (unión/diferencia no son intersección/symdiff).  
  2. Imprime `inter` y `symdiff` con `sorted`.  
  3. No reordenes a mano con `sort` in-place del set (no aplica).
- **Proposed retrospective:**  
  Intersección = cohorte compartida; symdiff = exclusivo de un lado. En el You Do, el set de ids apoya membership de cohorte; los conflictos de payload van en dicts (E3).
- **Code/output changes:** none

---

### S06-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Ejercicio estrella del subtema y del You Do. Instruction ya enuncia política idéntico≠conflicto; starter omite comparación de payload. Falta preamble de calidad de datos y retrospective de transferencia al capstone. Feedback bueno pero breve.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** dedup_report con unique y conflicts
- **Proposed preamble:**  
  - **Contexto:** en CP-N1-B, dos filas con el mismo `id` y datos distintos deben **reportarse**, no silenciarse.  
  - **Meta:** devolver `{unique, conflicts}` con política de payload.  
  - **Éxito:** unique con primera vista de C001 y C002; un solo conflicto C001 `v:1` vs `v:9`; la fila idéntica no entra a conflicts.  
  - **Límites:** no borres filas del reporte; no uses “último gana” sin traza.
- **Proposed instruction/description improvements:**  
  1. Cambia `seen` de set a dict id→fila.  
  2. Si el id es nuevo, guarda en unique.  
  3. Si ya existe y `seen[k] != r`, anexa a conflicts.  
  4. Imprime el dict resultado del fixture del starter.
- **Proposed retrospective:**  
  Idéntico = ruido; distinto = conflicto de calidad. Este es el mismo contrato del You Do. Pregunta: ¿por qué un set de ids solo no basta para detectar choque de payload?
- **Code/output changes:** none (output canónico es la referencia)

---

### S06-T3-A-DEMO (iDo)
- **Diagnosis:** Modelo cliente→contacts/txs + flatten. Muy alineado al You Do. Falta escena “esto es el store en RAM” y cierre hacia aplanar para S08.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El núcleo de CP-N1-B es un grafo en memoria: cliente con `contacts[]` y `txs[]`. Observa `summarize_client` (conteo y total) y `flatten_store` (filas densas con `client_id`). No es una base de datos: es el almacén en RAM antes de CSV/JSON en S08. Sigue los prints; nombres sintéticos LATAM.
- **Proposed retrospective:**  
  Anidar es modelar; aplanar es exportar. Cada fila flat conserva `client_id` para no perder la relación. We Do: contar contactos, aplanar todas las txs, y validar shape roto.
- **Code/output changes:** none

---

### S06-T3-A-E1 (weDo, guided)
- **Diagnosis:** Starter imprime la lista de contactos en vez de `len`. Muy guiado y claro; pedagogy gaps son solo scaffolding textual.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Contar contactos por cliente
- **Proposed preamble:**  
  - **Contexto:** resumen del store: cuántos contactos tiene cada cliente sintético.  
  - **Meta:** `len(c['contacts'])` por fila.  
  - **Éxito:** `C001 → 2` y `C002 → 0` (lista vacía válida).  
  - **Límites:** no imprimas la lista cruda; no inventes contactos.
- **Proposed instruction/description improvements:**  
  1. El starter imprime `c['contacts']` completo.  
  2. Cambia a `len(...)`.  
  3. Formato `id → n`.  
  4. C002 con `[]` debe ser 0, no “faltante”.
- **Proposed retrospective:**  
  Lista vacía es shape OK con conteo 0. Validar presencia de la clave es otro problema (E3 shape). Siguiente: aplanar txs (E2).
- **Code/output changes:** none

---

### S06-T3-A-E2 (weDo, independent)
- **Diagnosis:** Starter solo toma `txs[0]` — defect perfecto de denormalización incompleta. Instruction ya exige 3 filas; falta por qué de `client_id` y retrospective a S08.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Aplanar txs con client_id
- **Proposed preamble:**  
  - **Contexto:** para export tabular, cada tx necesita el id del cliente dueño.  
  - **Meta:** filas densas `{client_id, tx_id, monto}` de **todas** las txs.  
  - **Éxito:** lista de 3 filas (C001×1 + C002×2) como en la solución.  
  - **Límites:** no te quedes solo con la primera tx de cada cliente.
- **Proposed instruction/description improvements:**  
  1. Detecta el bug: `c['txs'][0]` ignora el resto.  
  2. Recorre cada tx de cada cliente (doble `for` o comprehension).  
  3. Incluye `client_id` en cada fila.  
  4. Imprime `flat` completo.
- **Proposed retrospective:**  
  Denormalizar `client_id` es el puente a CSV en S08. El bug de “solo la primera tx” pierde ingresos en un resumen. Siguiente: shape inconsistente (E3).
- **Code/output changes:** none

---

### S06-T3-A-E3 (weDo, transfer)
- **Diagnosis:** Valida `isinstance(..., list)`; starter usa `bool(txs)` y marca `[]` como review — misconception de oro. Instruction buena; falta anclar a cuarentena/calidad.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Validar shape de txs (list o review)
- **Proposed preamble:**  
  - **Contexto:** filas rotas llegan al store (falta clave o tipo string).  
  - **Meta:** marcar `ok` solo si `txs` es `list` (vacía permitida).  
  - **Éxito:** `C001 ok`, `C002 review`, `C003 review`.  
  - **Límites:** no uses `bool(txs)` (castiga la lista vacía legítima).
- **Proposed instruction/description improvements:**  
  1. El starter trata falsy como review.  
  2. Usa `isinstance(c.get('txs'), list)`.  
  3. Imprime `id` y status.  
  4. Lista vacía = ok.
- **Proposed retrospective:**  
  Shape ≠ contenido: `[]` es válido; ausente o string no. En T3-B el foco pasa de shape a missing de campos opcionales.
- **Code/output changes:** none

---

### S06-T3-B-DEMO (iDo)
- **Diagnosis:** `dig` + flags missing/empty/ok — joya pedagógica. Output de C003 con espacio tras empty es sutil. Falta preamble de política y retrospective del misconception `if not phone`.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Campos opcionales anidados (`profile.phone`) no se leen con `d['a']['b']` a ciegas. La demo muestra un helper `dig` y clasifica: valor OK, **missing** (ruta incompleta) y **empty** (string vacío). Observa C003: el teléfono existe pero es `""` — no es lo mismo que C004 sin `profile`. Solo datos sintéticos.
- **Proposed retrospective:**  
  Missing ≠ empty ≠ ok. Centralizar el acceso evita KeyError y unifica el reporte de completitud. We Do: `get_nested`, marcar missing de email, y tabla falsy vs missing.
- **Code/output changes:** none (no cambiar output salvo que se documente el espacio en empty)

---

### S06-T3-B-E1 (weDo, guided)
- **Diagnosis:** Starter sin chequeo de claves — lanza KeyError en email. Instruction especifica API; falta éxito explícito de dos prints y contexto.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** get_nested seguro por ruta de claves
- **Proposed preamble:**  
  - **Contexto:** `profile.phone` presente y `profile.email` ausente en un cliente sintético.  
  - **Meta:** recorrer claves; si falta un nivel, devolver `default`.  
  - **Éxito:** `999` y `N/A`.  
  - **Límites:** no uses try/except como único diseño; chequea dict y pertenencia de clave.
- **Proposed instruction/description improvements:**  
  1. El starter hace `cur = cur[k]` sin guardas.  
  2. Si no es dict o falta `k`, retorna `default`.  
  3. Prueba phone y email con default.  
  4. No hardcodees los resultados sin la función.
- **Proposed retrospective:**  
  El helper es reutilizable en el You Do. Un try/except alrededor de todo el path oculta bugs de tipo. Siguiente: missing de negocio en email (E2).
- **Code/output changes:** none

---

### S06-T3-B-E2 (weDo, independent)
- **Diagnosis:** Starter con `if not c.get('email')` confunde None/ausente con `''`. Instruction ya fija política `'' = present`. Falta anclar a tasas de completitud del pipeline.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Marcar email missing o present
- **Proposed preamble:**  
  - **Contexto:** reporte de completitud de emails en un lote sintético.  
  - **Meta:** missing solo si clave ausente o valor `None`.  
  - **Éxito:** `C001: present`, `C002: missing`, `C003: missing`.  
  - **Límites:** no uses solo `if not c.get('email')` (trataría `''` como missing).
- **Proposed instruction/description improvements:**  
  1. Revisa la política del enunciado.  
  2. Corrige la condición del starter.  
  3. Imprime `id: flag` por cliente.  
  4. No agregues casos extra al fixture.
- **Proposed retrospective:**  
  Completitud mide ausencia real, no “falsy”. La política se documenta; no se improvisa en cada `if`. E3 generaliza a varios falsy.
- **Code/output changes:** none  
  **Note for Fixer:** instruction mentions `''` as present but fixture has no `''` row — optional P2 add a fourth client if pedagogy wants live check; not required if policy is stated only.

---

### S06-T3-B-E3 (weDo, transfer)
- **Diagnosis:** Tabla falsy vs missing — transferencia conceptual excelente. Starter usa `not v` para missing. Instruction un poco abstracta (“tabla mental”); conviene anclar a reglas de negocio del almacén.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Falsy no es lo mismo que missing
- **Proposed preamble:**  
  - **Contexto:** montos `0`, strings vacíos y listas vacías son datos; solo `None` es missing en esta política.  
  - **Meta:** imprimir para cada valor si es falsy y si es missing.  
  - **Éxito:** solo `None` con `missing=True`; `''`, `0`, `[]` con `missing=False`.  
  - **Límites:** no uses `not v` como definición de missing.
- **Proposed instruction/description improvements:**  
  1. Recorre `vals = [None, '', 0, []]`.  
  2. Calcula falsy con `not bool(v)` (o equivalente).  
  3. Missing solo con `v is None`.  
  4. Imprime `repr(v)` y ambos flags.
- **Proposed retrospective:**  
  `if not value` es el bug silencioso de calidad. Documenta la política del dominio (aquí None = missing). Puente a T4: ordenar y exportar con reglas explícitas.
- **Code/output changes:** none

---

### S06-T4-A-DEMO (iDo)
- **Diagnosis:** sorted multi-key + trampa de `list.sort` → None. Dos ideas en una demo (carga cognitiva alta pero útil). Preamble debería decir qué observar en cada bloque; retrospective separar “orden de export” vs “retorno None”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Los exports del almacén piden orden estable: primero región, luego nombre. Observa `sorted(..., key=lambda r: (región, nombre))` **sin** mutar la lista original. Después, el anti-patrón: `list.sort` muta y **retorna None**. Predice las líneas de salida antes de ejecutar. Datos sintéticos Lima/Cusco.
- **Proposed retrospective:**  
  `sorted` = nueva lista; `.sort` = in-place y None. Key multi-campo es ranking lexicográfico. We Do: orden por monto, multi-campo, y el bug de asignar `.sort()`.
- **Code/output changes:** none

---

### S06-T4-A-E1 (weDo, guided)
- **Diagnosis:** Starter ordena por `id` en vez de monto. Claro. Falta contexto de ranking de transacciones.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Ordenar txs por monto ascendente
- **Proposed preamble:**  
  - **Contexto:** listar txs sintéticas de menor a mayor monto para un extracto.  
  - **Meta:** `sorted` con `key` en `monto`.  
  - **Éxito:** ids `['T1', 'T2']`.  
  - **Límites:** no mutes con `.sort`; no ordenes por `id`.
- **Proposed instruction/description improvements:**  
  1. El starter usa `key` sobre `id`.  
  2. Cambia el key a `monto`.  
  3. Imprime la lista de ids ordenados.  
  4. Deja `rows` original sin mutar.
- **Proposed retrospective:**  
  El `key` extrae el criterio sin reescribir comparadores. Siguiente: dos criterios a la vez (región, nombre).
- **Code/output changes:** none

---

### S06-T4-A-E2 (weDo, independent)
- **Diagnosis:** Multi-key; starter ordena solo por nombre. Instruction ya da el key y el orden esperado — para E2 es un poco sobre-andamiado (migas del key en el enunciado), pero aceptable si se mueve el key a hints.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Orden multi-campo región y nombre
- **Proposed preamble:**  
  - **Contexto:** ranking de clientes sintéticos para un reporte regional.  
  - **Meta:** ordenar por región y, en empate, por nombre.  
  - **Éxito:** tres líneas `Cusco Bob` / `Lima Ana` / `Lima Zed`.  
  - **Límites:** un solo `sorted`; no ordenes dos veces a mano.
- **Proposed instruction/description improvements:**  
  1. El starter ordena solo por nombre.  
  2. Usa una clave compuesta (tupla) región→nombre.  
  3. Imprime `región nombre` por fila.  
  4. No hardcodees el orden en prints fijos.
  *(Fade: mover la lambda exacta a hint 1, no al instruction.)*
- **Proposed retrospective:**  
  La tupla en `key` compara de izquierda a derecha. Es el mismo patrón del demo y del export por `id` en T4-B.
- **Code/output changes:** none

---

### S06-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Contraste sort vs sorted; starter asigna `base.sort()` a `copy_sorted`. Transferencia clara del bug clásico. Falta retrospective de “nunca encadenes .sort()”.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** list.sort retorna None; sorted no muta
- **Proposed preamble:**  
  - **Contexto:** un helper “ordenó” la cola y devolvió `None` al caller.  
  - **Meta:** demostrar mutación in-place vs copia ordenada.  
  - **Éxito:** `ret None`, `rows` ordenada, `base` intacta y `copy` ordenada.  
  - **Límites:** no “arregles” omitiendo el experimento de `.sort` sobre `rows`.
- **Proposed instruction/description improvements:**  
  1. Deja `rows.sort()` y muestra su retorno.  
  2. Para `base`, usa `sorted(base)` en la variable de copia.  
  3. Imprime base y copy.  
  4. Confirma que base sigue `[3,1,2]`.
- **Proposed retrospective:**  
  Asignar `x = lst.sort()` es un bug clásico de interviews y de pipelines. Si compartes la lista con otro módulo, prefiere `sorted` o documenta la mutación. Puente a T4-B: elección de estructura y JSON estable.
- **Code/output changes:** none

---

### S06-T4-B-DEMO (iDo)
- **Diagnosis:** JSON determinista con sort de clients + `sort_keys`. Excelente para portafolio. Falta preamble de reproducibilidad de demos y retrospective de “mismo input → mismo string”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Un artefacto de demo del modelo en memoria debe ser **reproducible**: misma entrada, mismo JSON. Observa ordenar `clients` por `id` y `json.dumps(..., sort_keys=True)`. La igualdad `a == b` en dos corridas es el test de determinismo. Sin PII real; `generated_by` es metadata sintética.
- **Proposed retrospective:**  
  Ordenar filas + `sort_keys` elimina el “orden mágico” de dict/set. Es evidencia de portafolio en el README del You Do. We Do: elegir list/dict/set, dumps determinista, y tradeoff de membership.
- **Code/output changes:** none

---

### S06-T4-B-E1 (weDo, guided)
- **Diagnosis:** Elección de estructuras; starter pone `list` en todo. Conceptual, poco “código” — OK para E1 de T4-B. Feedback apunta al rubric del You Do; falta preamble de justificación.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Elegir list, dict o set por operación
- **Proposed preamble:**  
  - **Contexto:** tres jobs del almacén en RAM con distinta carga.  
  - **Meta:** asignar la estructura Python adecuada a cada job.  
  - **Éxito:** cola → list; lookup id → dict; emails únicos → set.  
  - **Límites:** una elección por línea; no inventes estructuras de terceros.
- **Proposed instruction/description improvements:**  
  1. El starter marca todo como `list`.  
  2. Corrige cada job según el rol (orden, lookup, membership).  
  3. Imprime `job → estructura`.  
  4. No uses pandas/NumPy.
- **Proposed retrospective:**  
  Justificar la estructura es parte del rubric del You Do. La “mejor” estructura depende de la pregunta (orden vs lookup vs unicidad). Siguiente: JSON determinista (E2).
- **Code/output changes:** none

---

### S06-T4-B-E2 (weDo, independent)
- **Diagnosis:** Export JSON; starter sin sort de ids ni `sort_keys`. Instruction y tests claros. Falta anclar a CI/demos reproducibles.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** JSON determinista con ids y sort_keys
- **Proposed preamble:**  
  - **Contexto:** el mismo payload de demo debe producir el mismo string en cada corrida.  
  - **Meta:** ordenar `ids` y serializar con `sort_keys=True`.  
  - **Éxito:** exactamente `{"a": 2, "ids": ["C001", "C002"], "z": 1}`.  
  - **Límites:** `ensure_ascii=False`; un solo `print` del string.
- **Proposed instruction/description improvements:**  
  1. Ordena la lista `ids` del payload.  
  2. Usa `json.dumps` con `sort_keys=True`.  
  3. Imprime el string una vez.  
  4. No dependas del orden de inserción de las claves del dict.
- **Proposed retrospective:**  
  Determinismo = confianza en tests y en el README del portafolio. Combina sort de colecciones **y** de claves JSON. Siguiente: costo de membership list vs set (E3).
- **Code/output changes:** none

---

### S06-T4-B-E3 (weDo, transfer)
- **Diagnosis:** Tradeoff conceptual con `n*n` vs `n` — transfer real a diseño del almacén. Starter incompleto a propósito. Instruction densa; conviene separar meta de “no inventes Big-O a mano” en constraints del preamble.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Membership list vs set y costo de n búsquedas
- **Proposed preamble:**  
  - **Contexto:** n búsquedas de un id en cohorte; list recorre, set hashea.  
  - **Meta:** comprobar `in` en ambas y **derivar** costos `n*n` y `n` desde `len`.  
  - **Éxito:** ambos `in` True; `costo_conceptual_list 25` y `costo_conceptual_set 5` con n=5.  
  - **Límites:** no hardcodees 25/5 sin calcular desde `n`; no importes librerías de timing.
- **Proposed instruction/description improvements:**  
  1. Construye `ids_set` desde la lista.  
  2. Imprime `in list` e `in set` para `'C003'`.  
  3. `n = len(ids_list)`; imprime `n*n` y `n`.  
  4. Mantén los labels del solution para comparar.
- **Proposed retrospective:**  
  Indexar con set/dict **antes** de bucles anidados evita el O(n²) silencioso del modelo en RAM. Memoria extra a cambio de tiempo. Cierra T4 y prepara el You Do: componer list+dict+set con reglas de calidad.
- **Code/output changes:** none

---

### youDo — Modelo tabular en memoria (CP-N1-B) (youDo)
- **Diagnosis:** Marco de proyecto **fuerte**: context, objectives, requirements, starter con `NotImplementedError`, rubric y portfolioNote. Un newbie puede defender el “qué construir”. **Falta** `retrospective` de defensa/reflexión post-build (spec §8.3). Sin ella, el cierre metacognitivo del Gradual Release queda abierto. No hay gaps de “drill desnudo” aquí; la severidad es por cierre, no por vacío total.
- **Checklist:** context pass · goal pass · success partial (rubric = éxito difuso pero usable) · constraints pass · retrospective fail
- **Severity:** P1
- **Proposed title:** (ya existe) Modelo tabular en memoria (CP-N1-B)
- **Proposed preamble:** N/A como campo nuevo obligatorio — `context` ya cumple rol de escena. Opcional: 1 frase al final de context recordando “éxito = funciones implementadas + main sin NotImplementedError + README con conflicto y JSON”.
- **Proposed instruction/description improvements:**  
  - Añadir en objectives o requirements un **criterio de corrida**: `python memory_model.py` imprime flat, JSON estable y un `dedup_report` con al menos un conflicto en el fixture de `main`.  
  - Dejar explícito: payload idéntico no es conflicto (alineado a T2-B-E3).
- **Proposed retrospective:**  
  Antes de marcar listo: (1) ¿qué invariante demuestras con un print o assert (unique vs conflicts, JSON idéntico en dos dumps)? (2) ¿qué harías distinto con datos reales vs sintéticos (PII, volúmenes)? (3) En el README, una frase de impacto medible (p. ej. “mismo input → mismo JSON; conflictos de id no se silencian”) que puedas defender en 30 segundos ante un reclutador. Si mutas copias del store, ¿shallow o deep — y por qué?
- **Code/output changes:** none required for Round 1 pedagogy; optional comment in starter linking to T2-B-E3 policy
- **Validation notes:** Starter is portfolio-grade; keep APIs.

---

## Priority order

### P0 (Fixer first — all 24 We Do)
Every We Do unit needs hand-written:
1. short `title` (4–12 words)
2. `preamble` (bullets: contexto / meta / éxito / límites)
3. tightened `instruction` (task steps only; E1 may point at defect line; E2 less breadcrumb; E3 transfer surface)
4. `retrospective` (principle + misconception + transfer)
5. stronger `feedback` where currently one dry sentence (esp. T1-A-E1, T1-B-E3, T2-A-E2, T2-B-E3, T3-A-E3, T3-B-E2/E3, T4-A-E3, T4-B-E3)

**Suggested Fixer batch order (dependencies of story, not code):**
1. T1-A E1→E3 (ventanas y contratos)
2. T1-B E1→E3 (unpack / alias / deep)
3. T2-A E1→E3 (dict / get / merge)
4. T2-B E1→E3 (set / ops / dedup_report) — crítico para You Do
5. T3-A E1→E3 (grafo / flatten / shape)
6. T3-B E1→E3 (nested / missing / falsy)
7. T4-A E1→E3 (sorted / multi / sort None)
8. T4-B E1→E3 (choose / JSON / tradeoff)

### P1 (I Do × 8 + You Do)
- Add `preamble` + `retrospective` to all 8 demos; lightly expand thin `why` only if under ~40 words after edit.
- Add You Do `retrospective`; optional success-of-run sentence in context/requirements.

### P2 (polish)
- Ensure E2 instructions don’t paste full lambdas when hints already carry them (T4-A-E2).
- Optionally add `''` email fixture row in T3-B-E2 if policy must be live-tested.
- Align feedback length to 25–60 words across the board.
- Section filename/`id: "numpy"` vs content “colecciones” is product debt, not exercise pedagogy — out of scope unless orchestrator asks.

---

## Residual risks
1. **Volume:** 33 units; Fixer must hand-write prose (anti-aberration). Risk of fatigue → copy-paste between E1/E2/E3 — reject clones that only change numbers.
2. **Cognitive load T4-A-DEMO:** two lessons (multi-sort + `.sort`→None); preamble must sequence attention or newbies miss the second point.
3. **T3-B-E2 policy vs fixture:** `'' = present` stated but not in data — learners may not feel the bug unless they invent a case.
4. **S06-T2-B-E3 / You Do coupling:** prose must stay consistent on identical-payload ≠ conflict; drift would confuse portfolio.
5. **No schema verification in this review** that `preamble`/`retrospective`/`title` fields are already typed in `CourseSection` — Fixer should confirm types accept optional fields before compile.
6. **Outputs:** preserve exact solution outputs unless execute-and-diff justified; this report requests **no** code/output changes.

---

## Summary counts
| Kind | Units | Missing preamble | Missing retrospective | Missing title | Typical severity |
|------|------:|-----------------:|----------------------:|--------------:|------------------|
| iDo | 8 | 8 | 8 | N/A | P1 |
| weDo | 24 | 24 | 24 | 24 | P0 |
| youDo | 1 | N/A (context OK) | 1 | exists | P1 |

**Net:** Code scaffolds and defects are largely strong; the pedagogy gap is almost entirely **missing Gradual-Release text fields** (preamble → task → retrospective) and thin feedback—not broken exercises.

Section 6 exercise pedagogy review complete. Ready for the Fixer prompt.
