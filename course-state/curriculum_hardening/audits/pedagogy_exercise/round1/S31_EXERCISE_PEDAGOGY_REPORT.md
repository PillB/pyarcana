# S31 Exercise Pedagogy Report (Round 1)

## Section
- **title:** Grafos y evidencia relacional
- **shortTitle:** Grafos y evidencia
- **id:** `streaming-data` (archivo `s31-streaming-data.ts`; contenido = grafo de evidencia relacional CP-N3-B — no streaming de datos)
- **index:** 31
- **source:** `src/lib/course/sections/s31-streaming-data.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades de práctica/demo)
- **subtemas:** S31-T1-A nodos/aristas/dirección/peso · T1-B multigrafo/tiempo/provenance · T2-A tablas→grafo · T2-B dedup/agregación con detalle · T3-A grado/componentes/caminos · T3-B centralidad con límites · T4-A subgrafos/pruebas · T4-B viz/privacidad/escala
- **hilo de caso:** desk PE de investigación relacional **CP-N3-B** / `CASO-LIM-031` (run_id `cpn3b-01`); entidades sintéticas `@example.pe` / Lima–Red Andina; path + evidencia ≠ fraude/parentesco; centralidad = estructura no culpa

## Method
- Leído `PEDAGOGY_EXERCISE_SPEC.md` (campos, longitudes, checklist preamble/retrospective, fade E1→E2→E3).
- Inspeccionado manualmente cada `iDo.steps[]` (8 demos, ~415–689), `weDo.steps[]` (24 ejercicios, ~691–1819) y `youDo` (~1821–1912) en `s31-streaming-data.ts`.
- Contrastado con el hilo de la sección: filas sintéticas → grafo tipado con provenance; path reproducible con hop limit; ego-k; disclaimer de centralidad; vista redactada para el revisor humano.
- **Sin** generadores, bucles, plantillas ni copy-paste mecánico entre unidades.
- Prosa propuesta en **español profesional peruano**, un objetivo primario por unidad.

## Hallazgos transversales (antes del ledger)

| Campo / hábito | Estado actual en S31 |
|----------------|----------------------|
| I Do `preamble` | **Ausente** en las 8 demos |
| I Do `retrospective` | **Ausente** en las 8 demos |
| I Do `description` | Presente y técnica (qué modela el demo); no sustituye preamble formal |
| I Do `why` | Presente; **1 frase** en casi todos (bajo el piso 40–90 palabras del spec) |
| We Do `title` | **Ausente** en los 24 |
| We Do `preamble` | **Ausente** en los 24 |
| We Do `retrospective` | **Ausente** en los 24 |
| We Do `instruction` | Estilo denso “ID · concepto + fixture + meta + éxito embebido”: legible para quien ya construye grafos, **opaco** para newbie sin escena de desk de revisión relacional |
| We Do `feedback` | Uniforme: *«Compara tu salida con la solución.»* — **cero** razonamiento (peor que sections con feedback nombrando el bug) |
| Starter defect | En la mayoría hay `# TODO` + hueco real; **no** hay hábito `# DEFECT:` nombrado como en S28 — el defect se infiere del comentario/starter vacío |
| Hints | E1 con migas cercanas a solución (aceptable); E2/E3 a menudo dan la fórmula casi completa |
| You Do marco | `context` / `objectives` / `requirements` / `rubric` / `portfolioNote` / starter **sólidos** y alineados a CP-N3-B |
| You Do `retrospective` | **Ausente** |
| Código / outputs | Coherentes con theory y schema canónico (`owns` · `transfer` · `shared_phone` · …); **no** proponer cambios de output salvo notas puntuales |

**Patrón dominante:** el andamiaje de *código* (schema tipado, multigrafo con provenance, agregación que conserva `record_id`, BFS sorted + hop limit, degree con `guilt=False`, ego-k, redact, política summarize/render) es maduro y alineado al hilo de investigación. El andamiaje *pedagógico verbal* (preamble → instruction solo-tarea → retrospective) no existe. Un true newbie no responde con claridad: qué practico, por qué importa en un caso sintético de Lima, cómo sé que gané, qué debe quedarme al cerrar la pestaña.

**Fade E1→E2→E3 (contenido):** progresión real por subtema (p. ej. T1-A: modelo literal → out-strength → clasificación directed/undirected; T2-B: colapso canónico → agregar con records → invariante sum(n)==detail; T3-B: degree centrality → hub INF-/PER- → high-degree + etypes). **No** son tres clones con números distintos. El fade de *prosa* no se ve porque no hay preambles diferenciados.

**Severity default:** missing title+preamble+retrospective en We Do = **P0**; I Do sin preamble/retrospective = **P1** (aún tienen description+why+código); youDo sin retrospective = **P1**; feedback genérico y why de 1 frase = **P2** si caen preamble/instruction/retrospective.

---

## Unit ledger

### S31-T1-A-DEMO (iDo)
- **Diagnosis:** Demo sólida de modelo mínimo: 4 nodos, aristas `owns` / `shared_phone` / `transfer` con dirección y peso. La `description` nombra el skill; falta `preamble` que diga *qué observar* (etype + directed + weight como contrato, no decoración) y `retrospective` del misconception “peso = veredicto”. El `why` es una frase.
- **Checklist:** context fail · goal partial · success partial (output visible) · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  En el desk de investigación relacional, un grafo sin tipos estables no se puede filtrar ni auditar. Esta demo arma el contrato mínimo de CP-N3-B: nodos entidad/cuenta y aristas `owns`, `shared_phone` y `transfer` con dirección y peso. No escribas aún: predice por qué `transfer` debe ser dirigida y `shared_phone` no, y por qué el peso `99.5` es evidencia cuantitativa y no una etiqueta de culpa.
- **Proposed instruction/description improvements:**  
  Mantener description. Ampliar `why` (~50–70 palabras): dirección y peso son campos del schema, no adornos de layout; `etype` estable permite filtrar el path del revisor; unidades de peso (PEN, count, score) deben declararse por etype. Puente a We Do: completar modelo literal, out-strength y conteos directed/undirected.
- **Proposed retrospective:**  
  Si puedes explicar por qué `transfer` dirigida y `shared_phone` no dirigida no son intercambiables, ya tienes el hábito de schema primero. El error clásico es tratar el peso como veredicto. En We Do practicarás modelar aristas, medir fuerza saliente y clasificar dirección.
- **Code/output changes:** none
- **Validation notes:** Output `n_nodes 4 / n_edges 4 / types / directed_tx True / weight 99.5` alineado a theory T1-A.

---

### S31-T1-A-E1 (weDo, guided)
- **Diagnosis:** Starter casi vacío (`edges = []`) con TODO claro: owns dirigido + shared_phone no dirigido. Instruction densa mezcla ID, fixture y éxito; sin title, preamble ni retrospective. Feedback genérico no nombra el hueco.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Modelo mínimo: owns y shared_phone
- **Proposed preamble:**  
  - **Contexto:** en `CASO-LIM-031`, el revisor necesita un grafo tipado antes de cargar filas reales del ledger.  
  - **Meta:** completar dict `nodes` (ya dado) y lista `edges` con `owns` E1→A1 (dirigida) y `shared_phone` E1–E2 (no dirigida).  
  - **Éxito:** `n_nodes 3` / `n_edges 2` / `n_directed 1`.  
  - **Límites:** no inventes etypes fuera del schema; sin PII real; no etiquetes fraude ni parentesco.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: `nodes` listo, `edges` vacío.  
  2. Agrega arista `owns` E1→A1 con `directed=True` y peso 1.0.  
  3. Agrega `shared_phone` E1–E2 con `directed=False`.  
  4. Imprime `n_nodes`, `n_edges` y `n_directed` (cuenta `directed=True`).
- **Proposed feedback improvement:**  
  Sin aristas tipadas no hay filtro de path. `n_directed` debe ser 1: solo `owns` es dirigida; `shared_phone` no cuenta. Compara con la salida canónica.
- **Proposed retrospective:**  
  El modelo mínimo fija tipos, dirección y peso antes de la carga masiva. El error clásico es dejar `edges=[]` o mezclar convenciones de dirección en el mismo etype. Siguiente (E2): medir fuerza saliente por nodo.
- **Code/output changes:** none
- **Validation notes:** Starter con hueco real; solution y output correctos.

---

### S31-T1-A-E2 (weDo, independent)
- **Diagnosis:** Out-strength (suma de pesos salientes) es un skill útil y distinto de E1. Instruction ya da la definición; falta escena de “por qué el revisor prioriza hubs de flujo” y cierre metacognitivo. Feedback genérico.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Out-strength: peso saliente por nodo
- **Proposed preamble:**  
  - **Contexto:** en un grafo de transferencias, el revisor a veces prioriza nodos por **flujo saliente**, no solo por conteo de vecinos.  
  - **Meta:** con aristas `(src, dst, weight)`, calcular out-strength (suma de pesos por `src`) y reportar el top.  
  - **Éxito:** `top B` / `value 5.0` / `n 2`.  
  - **Límites:** acumula solo por `src`; nodos solo-destino no aparecen; datos sintéticos.
- **Proposed instruction/description improvements:**  
  1. Implementa `out_strength(edges)` → dict `src → suma`.  
  2. Elige `top = max(out, key=out.get)`.  
  3. Imprime `top`, `value` y `n = len(out)`.  
  4. No uses el `dst` para el total saliente.
- **Proposed retrospective:**  
  Out-strength es evidencia de flujo, no de culpa. El error clásico es contar vecinos en vez de sumar pesos, o incluir destinos. Luego (E3): clasificar directed vs. undirected con etypes del schema.
- **Code/output changes:** none
- **Validation notes:** E2 con menos migas de escena que E1; éxito observable intacto.

---

### S31-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer real: clasificar directed/undirected y etypes únicos — el filtro que el revisor aplica al path. Starter con contadores en cero; instruction densa. Falta preamble de “misma etype no mezcla convenciones” y retrospective puente a T1-B.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Clasificar directed, undirected y etypes
- **Proposed preamble:**  
  - **Contexto:** el revisor del path filtra por dirección y por tipo; si mezclas convenciones en un mismo `etype`, el filtro miente.  
  - **Meta:** de una lista de aristas con `directed` y `etype`, devolver conteos y etypes ordenados.  
  - **Éxito:** `directed 2` / `undirected 1` / `etypes ['shared_phone', 'transfer']`.  
  - **Límites:** schema canónico; no inventes labels de fraude; datos sintéticos.
- **Proposed instruction/description improvements:**  
  1. Completa `counts(edges)`: suma directed True y False por separado.  
  2. Construye `etypes = sorted({e['etype'] for e in edges})`.  
  3. Imprime `directed`, `undirected` y `etypes`.  
  4. No hardcodees los conteos.
- **Proposed retrospective:**  
  Clasificar dirección y etype es el primer filtro auditable del path. El error clásico es colapsar todo en un solo contador. Pregunta: ¿qué harías si un mismo etype aparece a veces directed y a veces no?
- **Code/output changes:** none
- **Validation notes:** Transfer auténtico; alineado a theory T1-A y schema canónico.

---

### S31-T1-B-DEMO (iDo)
- **Diagnosis:** Worked example claro: dos multiaristas E1–E2 con `rid`/`src` y selección del `latest` por timestamp. Description OK; falta preamble de “varias aristas = varios hechos” y retrospective del misconception “quedarse solo con la última borra auditoría”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Entre el mismo par pueden coexistir varias transferencias o contactos: eso es un multigrafo. Esta demo guarda cada `record_id` y source, y además elige la arista más reciente por `ts` sin borrar el resto. No escribas aún: predice por qué `prov_ok` debe ser True solo si *todas* tienen `rid` y `src`, y por qué `latest` es r1 (2026-03-01).
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: multigrafo + provenance habilita auditoría del camino; “latest” es una vista, no un reemplazo del detalle; sin `record_id` el hop del revisor es decoración. Puente a We Do: contar multi-pares, filtrar por ventana y validar provenance.
- **Proposed retrospective:**  
  Si puedes distinguir “agregar/filtrar por tiempo” de “borrar el detalle”, ya tienes el hábito de T1-B. El error clásico es colapsar a una arista y perder `record_id`. We Do: multi-count, filtro temporal y gate de provenance.
- **Code/output changes:** none
- **Validation notes:** Output `multi 2 / rids / prov_ok True / latest r1` alineado a theory T1-B.

---

### S31-T1-B-E1 (weDo, guided)
- **Diagnosis:** Contar multi-aristas por par con Counter — defect guiado claro (`c = None`). Instruction corta pero sin escena de “por qué el revisor ve n=2 entre E1–E2”. Feedback genérico.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Contar multi-aristas por par
- **Proposed preamble:**  
  - **Contexto:** en el multigrafo de `CASO-LIM-031`, dos transferencias E1→E2 son dos hechos, no uno.  
  - **Meta:** con filas `(src, dst)`, contar ocurrencias por par y reportar el top.  
  - **Éxito:** `pair E1 E2` / `n 2` / `pairs 2`.  
  - **Límites:** el orden `src,dst` importa; no colapses a undirected sin documentarlo; sin PII.
- **Proposed instruction/description improvements:**  
  1. Arma `Counter(rows)`.  
  2. Obtén el par más frecuente con `most_common(1)`.  
  3. Imprime `pair` (dos ids), `n` y `pairs = len(c)`.  
  4. No hardcodees `n 2`.
- **Proposed retrospective:**  
  Multi-count revela densidad de hechos entre el mismo par. El error clásico es `set(rows)` y perder la frecuencia. Siguiente (E2): filtrar por ventana temporal sin borrar provenance.
- **Code/output changes:** none
- **Validation notes:** DEFECT implícito claro; Pass canónico correcto.

---

### S31-T1-B-E2 (weDo, independent)
- **Diagnosis:** Filtro temporal + check de `record_id` — buen independiente. Instruction ya da el umbral; falta escena “ventana del caso” y retrospective. Feedback genérico.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Filtrar aristas por ventana temporal
- **Proposed preamble:**  
  - **Contexto:** el caso no debe mezclar 2019 con 2026 sin documentarlo; el workbench filtra por `ts`.  
  - **Meta:** conservar aristas con `ts >= '2026-02-01'` y verificar provenance.  
  - **Éxito:** `n 2` / `prov True` / `first b`.  
  - **Límites:** límite inclusivo; no mutes la lista original si puedes evitarlo; datos sintéticos.
- **Proposed instruction/description improvements:**  
  1. Filtra `edges` con `ts >= '2026-02-01'`.  
  2. Comprueba que todas tienen `record_id`.  
  3. Imprime `n`, `prov` y el primer `record_id` del filtro.  
  4. No hardcodees `first`.
- **Proposed retrospective:**  
  La ventana temporal acota el grafo al caso; el filtro no dispensa de provenance. Luego (E3): validar que cada arista tenga source y record_id no vacíos.
- **Code/output changes:** none
- **Validation notes:** Strings ISO ordenables — contrato didáctico limpio.

---

### S31-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Gate de provenance con un `source` vacío a propósito — excelente transfer. Starter con `ok` que devuelve False siempre. Falta preamble de fail-closed y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Validar provenance en cada arista
- **Proposed preamble:**  
  - **Contexto:** sin `source` y `record_id`, el revisor no puede saltar del hop al ledger; el builder debe fallar de forma tipificada.  
  - **Meta:** `all_ok` solo si cada arista tiene source y record_id no vacíos; reportar `n_bad` y `n`.  
  - **Éxito:** `all_ok False` / `n_bad 1` / `n 3`.  
  - **Límites:** string vacío cuenta como mal; no “arregles” el fixture a mano; sin fraude automático.
- **Proposed instruction/description improvements:**  
  1. Completa `ok(e)`: `bool(e.get('source') and e.get('record_id'))`.  
  2. Cuenta `n_bad` con las que fallan.  
  3. Imprime `all_ok`, `n_bad` y `n`.  
  4. No hardcodees `False`.
- **Proposed retrospective:**  
  Provenance es el contrato de auditoría del multigrafo. El error clásico es aceptar source vacío o inventar un rid. Pregunta: ¿rechazarías la carga o crearías aristas “huérfanas” silenciosas?
- **Code/output changes:** none
- **Validation notes:** Transfer auténtico; alineado a callout theory “No borrar detalle”.

---

### S31-T2-A-DEMO (iDo)
- **Diagnosis:** Demo clara de proyección tablas→nodos/aristas con teléfono compartido como nodo `900`. Description OK; falta preamble del patrón `E → has_phone → valor` y retrospective “shared phone ≠ parentesco”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Tras el ER de S30, las tablas de entidades, cuentas y contactos se proyectan a grafo. Esta demo construye nodos (incluidos valores de teléfono) y aristas `owns` / `has_phone`. Observa que e1 y e2 comparten el valor `900`: es un **hecho de contacto**, no parentesco. No escribas aún; sigue la unión de ids y el conteo de aristas.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: tablas → grafo con tipos del schema canónico; el contacto como nodo intermedio facilita el path `E1 → 900 → E2`; ids sintéticos estables hacen la construcción idempotente. Puente a We Do: owns ordenadas, shared values y unión de nodos.
- **Proposed retrospective:**  
  Si puedes dibujar el hop por teléfono compartido sin inventar parentesco, ya internalizaste T2-A. El error clásico es modelar solo personas y omitir el nodo de contacto. We Do: proyectar owns, detectar shared y armar el set de nodos.
- **Code/output changes:** none
- **Validation notes:** Output `nodes ['900', 'a1', 'e1', 'e2'] / n_edges 3` alineado a theory T2-A.

---

### S31-T2-A-E1 (weDo, guided)
- **Diagnosis:** Proyectar `owns` desde accounts con sort — starter `owns = []`. Instruction densa; sin title/preamble/retrospective. Feedback genérico.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Proyectar aristas owns desde cuentas
- **Proposed preamble:**  
  - **Contexto:** entity —`owns`→ account es la primera arista del schema canónico en el caso.  
  - **Meta:** desde `accounts[{id, owner}]`, generar pares (owner, id) ordenados y etiquetar etype.  
  - **Éxito:** `owns [('e1', 'a1'), ('e2', 'a2')]` / `n 2` / `etype owns`.  
  - **Límites:** orden lexicográfico; no inventes owners; datos sintéticos.
- **Proposed instruction/description improvements:**  
  1. Construye tuples `(owner, id)` desde cada cuenta.  
  2. Ordénalos con `sorted`.  
  3. Imprime `owns`, `n` y `etype` como `"owns"`.  
  4. No hardcodees la lista final.
- **Proposed retrospective:**  
  `owns` ancla la entidad a la cuenta antes de las transferencias. El error clásico es invertir src/dst o omitir el sort (rompe idempotencia visual). Siguiente (E2): detectar contactos compartidos sin inferir parentesco.
- **Code/output changes:** none
- **Validation notes:** Sort en solution corrige el orden invertido del fixture — buen defecto implícito.

---

### S31-T2-A-E2 (weDo, independent)
- **Diagnosis:** Shared contact ≥2 entidades con nota `not_parentesco` — excelente ancla ética. Falta preamble de “hecho a revisar” y retrospective. Feedback genérico.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Detectar contactos compartidos (≥2)
- **Proposed preamble:**  
  - **Contexto:** dos entidades con el mismo teléfono sintético generan un hecho de contacto compartido para la cola humana.  
  - **Meta:** agrupar por valor y listar los que tienen ≥2 entidades; imprimir la nota `not_parentesco`.  
  - **Éxito:** `shared ['900', '901']` / `n_shared 2` / `note not_parentesco`.  
  - **Límites:** no etiquetes parentesco ni fraude; solo datos sintéticos.
- **Proposed instruction/description improvements:**  
  1. Acumula entidades por valor de contacto en un `defaultdict(set)`.  
  2. Filtra valores con `len(es) >= 2`.  
  3. Imprime `shared` sorted, `n_shared` y `note not_parentesco`.  
  4. No inventes labels de conducta.
- **Proposed retrospective:**  
  Shared contact = hipótesis con evidencia, no veredicto. El error clásico es saltar a “familia” o “colusión”. Luego (E3): unir entidades, cuentas y contactos en un solo set de nodos.
- **Code/output changes:** none
- **Validation notes:** Nota `not_parentesco` alineada a selfCheck y theory.

---

### S31-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Unión de tres conjuntos de ids — transfer simple pero correcto. Instruction ya nombra la unión; falta escena de “por qué el teléfono es nodo” y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Unión de nodos: entidades, cuentas, contactos
- **Proposed preamble:**  
  - **Contexto:** el grafo del caso incluye personas, cuentas y valores de contacto como nodos de primera clase.  
  - **Meta:** `nodes = entities ∪ accounts ∪ contact_values`; reportar cardinalidad y membresía.  
  - **Éxito:** `n_nodes 5` / `has_contact True` / `has_ent True`.  
  - **Límites:** no dupliques a mano; usa sets; fixture sintético.
- **Proposed instruction/description improvements:**  
  1. Une los tres conjuntos con el operador `|`.  
  2. Imprime `n_nodes`, si `"900"` está y si `"e1"` está.  
  3. No hardcodees `5`.  
  4. No conviertas contactos en aristas sin nodos aquí.
- **Proposed retrospective:**  
  El set de nodos es la base de paths y ego-k. El error clásico es olvidar el valor de contacto y luego no poder dibujar el hop. Pregunta: ¿qué path se pierde si el teléfono no es nodo?
- **Code/output changes:** none
- **Validation notes:** Transfer mínimo pero fiel al patrón canónico de theory.

---

### S31-T2-B-DEMO (iDo)
- **Diagnosis:** Agregación E1–E2 con sum 15 y `ids ['t1','t2']` — el corazón del subtema. Description OK; falta preamble “agregado + detalle” y retrospective del misconception “sum basta para auditar”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El revisor filtra con sumas, pero audita con `record_id`. Esta demo agrega montos por par **y** conserva la lista de ids. No escribas aún: predice por qué `detail_n 2` debe coincidir con la longitud de `ids`, y qué pregunta del revisor fallaría si solo imprimieras `sum 15`.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: agregado y detalle conviven; el workbench prioriza con sum y explica con records; borrar ids rompe la auditoría. Puente a We Do: colapso canónico post-ER, agregar con records e invariante de no-pérdida.
- **Proposed retrospective:**  
  Si puedes defender por qué el path necesita la capa de detalle, ya tienes T2-B. El error clásico es `sum` sin lista. We Do: reescribir aristas canónicas, agregar conservando records y verificar el invariante.
- **Code/output changes:** none
- **Validation notes:** Output `sum 15.0 / ids ['t1', 't2'] / detail_n 2` alineado a theory T2-B.

---

### S31-T2-B-E1 (weDo, guided)
- **Diagnosis:** Colapso raw→canónico post-ER S30 — puente excelente entre secciones. Starter `ce = []`. Instruction densa; sin preamble de “mapa del matching”. Feedback genérico.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Colapsar raw_id a canónico post-ER
- **Proposed preamble:**  
  - **Contexto:** tras S30, dos raw del mismo canónico no deben generar aristas fantasmas en el grafo.  
  - **Meta:** con mapa `canon` y aristas raw, reescribir a ids canónicos únicos y ordenados.  
  - **Éxito:** `canonical_edges [('E1', 'E2')]` / `n 1` / `collapsed True`.  
  - **Límites:** usa el mapa; no inventes canónicos; sin PII real.
- **Proposed instruction/description improvements:**  
  1. Reescribe cada arista con `canon[a]` y `canon[b]`.  
  2. Colapsa con un `set` de tuples y ordena.  
  3. Imprime `canonical_edges`, `n` y `collapsed True`.  
  4. No dejes las aristas raw en el grafo final.
- **Proposed retrospective:**  
  El mapa raw→canónico es el puente S30→S31. El error clásico es olvidar el mapa y duplicar hops. Siguiente (E2): agregar montos sin borrar `record_id`.
- **Code/output changes:** none
- **Validation notes:** Dos raw r1/r2 → E1 colapsan bien en solution.

---

### S31-T2-B-E2 (weDo, independent)
- **Diagnosis:** Agregar amount + append record_id — skill central del subtema. Instruction ya advierte no borrar detalle; falta escena de cola humana y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Agregar montos conservando record_id
- **Proposed preamble:**  
  - **Contexto:** el hop A→B del revisor muestra suma **y** lista de transacciones fuente.  
  - **Meta:** por par `(src, dst)`, sumar `amount` y append de cada `record_id`.  
  - **Éxito:** `sum 7` / `records ['1', '2']` / `detail_kept True`.  
  - **Límites:** no descartes records al agregar; clave al menos `(src, dst)`; datos sintéticos.
- **Proposed instruction/description improvements:**  
  1. Para cada fila, clave `(src, dst)`.  
  2. Suma `amount` y haz `append` del `record_id`.  
  3. Imprime sum, records y `detail_kept True` del par A–B.  
  4. No reemplaces la lista de records por un solo id.
- **Proposed retrospective:**  
  Agregado acelera filtros; detalle responde “muéstrame las transacciones”. Luego (E3): probar el invariante `sum(n) == len(detail)`.
- **Code/output changes:** none
- **Validation notes:** Alineado al callout danger de theory.

---

### S31-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Invariante de no-pérdida al agregar — transfer metacognitivo excelente. Starter con bucle por completar. Falta preamble de “regresión de auditoría” y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Invariante: suma de n igual a detail
- **Proposed preamble:**  
  - **Contexto:** un bug silencioso es agregar y “perder” filas: el path deja de ser auditable.  
  - **Meta:** construir capa agregada (`n` y `records` por par) y verificar `sum(n) == len(detail)`.  
  - **Éxito:** `ok True` / `total 5` / `detail_n 5`.  
  - **Límites:** no hardcodees `ok True`; construye desde `detail`; sin PII.
- **Proposed instruction/description improvements:**  
  1. Acumula `n` y `records` por `(src, dst)`.  
  2. Calcula `total = sum(a['n'] for a in aggs.values())`.  
  3. Imprime `ok`, `total` y `detail_n`.  
  4. No borres filas del detalle original.
- **Proposed retrospective:**  
  El invariante es un test de regresión de auditoría. El error clásico es confiar en el agregado sin contrastar cardinalidades. Pregunta: ¿qué imprimirías si `total != detail_n` en CI?
- **Code/output changes:** none
- **Validation notes:** Transfer auténtico hacia You Do tests mínimos.

---

### S31-T3-A-DEMO (iDo)
- **Diagnosis:** BFS path A→D con vecinos sorted y `repro True` — core del subtema. Description OK; falta preamble de hop limit + reproducibilidad y retrospective del misconception “cualquier path vale”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El revisor necesita un camino **reproducible** y acotado, no una exploración infinita. Esta demo hace BFS de A a D con vecinos ordenados y muestra `hops` y `repro`. No escribas aún: predice por qué sorted de vecinos hace que dos ejecuciones den el mismo path, y por qué un hop limit protege al workbench.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: camino acotado y ordenado = reproducible; hop limit controla costo y ruido; en producción NetworkX cubre el mismo contrato. Puente a We Do: grado, componentes y BFS A→D.
- **Proposed retrospective:**  
  Si puedes explicar por qué sorted vecinos implica `repro True`, ya tienes el hábito de paths auditables. El error clásico es BFS con orden de set no determinista. We Do: degree, componentes conexas y path con hops.
- **Code/output changes:** none
- **Validation notes:** Output `path ['A','B','C','D'] / hops 3 / repro True` alineado a theory T3-A.

---

### S31-T3-A-E1 (weDo, guided)
- **Diagnosis:** Grado no dirigido — starter con `deg` vacío. Instruction clara en meta; sin escena “hubs para priorizar exploración, no culpar”. Feedback genérico.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Grado no dirigido por nodo
- **Proposed preamble:**  
  - **Contexto:** el grado ayuda a filtrar hubs y priorizar exploración en el grafo del caso.  
  - **Meta:** en un grafo no dirigido, contar vecinos por nodo (ambos extremos).  
  - **Éxito:** `deg {'a': 2, 'b': 2, 'c': 2}` / `max 2` / `n 3`.  
  - **Límites:** cuenta u y v por arista; no uses grado como culpa; datos sintéticos.
- **Proposed instruction/description improvements:**  
  1. Por cada arista, `deg[u] += 1` y `deg[v] += 1`.  
  2. Imprime el dict con keys sorted, el máximo y `n`.  
  3. No hardcodees los 2.  
  4. No conviertas el grado en etiqueta de conducta.
- **Proposed retrospective:**  
  Grado es estructura: prioriza, no sentencia. El error clásico es contar solo un extremo (como si fuera dirigido). Siguiente (E2): componentes conexas del grafo del caso.
- **Code/output changes:** none
- **Validation notes:** Triángulo a-b-c — grados uniformes didácticos.

---

### S31-T3-A-E2 (weDo, independent)
- **Diagnosis:** Componentes conexas con dos islas — independiente real (DFS/BFS). Instruction nombra sort; falta preamble “acotar ruido del banco” y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Componentes conexas del grafo
- **Proposed preamble:**  
  - **Contexto:** un caso de revisión suele vivir en un subgrafo acotado; las islas irrelevantes no deben mezclarse en la misma vista.  
  - **Meta:** listar componentes (cada una sorted) ordenadas por el primer nodo.  
  - **Éxito:** `comps [['a', 'b'], ['c', 'd', 'e']]` / `n_comp 2` / `ok True`.  
  - **Límites:** grafo no dirigido; no hardcodees las listas; datos sintéticos.
- **Proposed instruction/description improvements:**  
  1. Construye adj no dirigido (ya en starter).  
  2. DFS o BFS desde cada nodo no visitado; ordena cada comp.  
  3. Ordena la lista de comps por el primer id.  
  4. Imprime `comps`, `n_comp` y `ok True`.
- **Proposed retrospective:**  
  Componentes acotan el caso y reducen ruido. Luego (E3): BFS path A→D con hops y found.
- **Code/output changes:** none
- **Validation notes:** Dos islas bien separadas; solution canónica clara.

---

### S31-T3-A-E3 (weDo, transfer)
- **Diagnosis:** BFS A→D con nota “camino = hipótesis, no veredicto” — transfer alineado a ética de la sección. Starter `path = None`. Falta preamble de reproducibilidad y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** BFS path reproducible A→D
- **Proposed preamble:**  
  - **Contexto:** el path del revisor es una hipótesis con evidencia, no un auto-veredicto de fraude.  
  - **Meta:** BFS de A a D con vecinos sorted; reportar path, hops y found.  
  - **Éxito:** `path ['A', 'B', 'C', 'D']` / `hops 3` / `found True`.  
  - **Límites:** vecinos sorted; no inventes atajos; sin etiquetas de culpa.
- **Proposed instruction/description improvements:**  
  1. BFS con `deque` desde A; `seen` evita revisitas.  
  2. Explora `sorted(adj[n])` para reproducibilidad.  
  3. Al llegar a D, guarda el path y calcula hops = len−1.  
  4. Imprime `path`, `hops` y `found`.
- **Proposed retrospective:**  
  Path + hops es el contrato del workbench. El error clásico es orden no determinista o confundir path con veredicto. Pregunta: ¿qué disclaimer pondrías junto al path en la UI del revisor?
- **Code/output changes:** none
- **Validation notes:** Transfer auténtico; alineado a demo T3-A y You Do `bfs_path`.

---

### S31-T3-B-DEMO (iDo)
- **Diagnosis:** Hub H degree 3 + `guilt_label False` — mensaje ético central. Description OK; falta preamble “estructura no culpa” y retrospective del misconception “alta centralidad → fraude”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Un hub puede ser un procesador de pagos legítimo o un teléfono de call center. Esta demo calcula el nodo de mayor grado y emite `interpretation structure_only` con `guilt_label False`. No escribas aún: predice por qué un score alto solo ordena la cola humana y nunca cierra el caso.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: métrica estructural con interpretación limitada; reporta siempre disclaimer; no automatices fraude. Puente a We Do: degree centrality estándar, hub INF-/PER- y high-degree con etypes.
- **Proposed retrospective:**  
  Si puedes decir en una frase por qué centralidad ≠ culpabilidad, ya tienes el gate ético de T3-B. El error clásico es auto-label. We Do: normalizar deg/(n−1), clasificar infra vs. persona e interpretar con tipos de arista.
- **Code/output changes:** none
- **Validation notes:** Output `top_node H degree 3 / structure_only / guilt_label False` alineado a theory T3-B.

---

### S31-T3-B-E1 (weDo, guided)
- **Diagnosis:** Degree centrality estándar deg/(n−1) con `guilt=False` — starter con acumulación pendiente. Instruction densa con fórmula; sin preamble de “norma por n−1 no por max observado”. Feedback genérico.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Degree centrality deg/(n−1) sin culpa
- **Proposed preamble:**  
  - **Contexto:** en redes simples no dirigidas, la centrality estándar normaliza por `n−1`, no por el máximo observado del lote.  
  - **Meta:** acumular grado, normalizar, reportar top y score; siempre `guilt=False`.  
  - **Éxito:** `top H` / `score 1.0` / `guilt False`.  
  - **Límites:** no uses max_observed como denominador; no etiquetes fraude; datos sintéticos.
- **Proposed instruction/description improvements:**  
  1. Acumula deg en ambos extremos.  
  2. `n = len(deg)`; `norm = deg / (n - 1)`.  
  3. Elige top y redondea score a 2 decimales.  
  4. Imprime top, score y `guilt False`.
- **Proposed retrospective:**  
  La fórmula correcta evita inflar rankings con lotes chicos mal normalizados. El error clásico es deg/max o convertir score en culpa. Siguiente (E2): clasificar el hub como infra o persona.
- **Code/output changes:** none
- **Validation notes:** H conectado a A,B,C → score 1.0 didáctico.

---

### S31-T3-B-E2 (weDo, independent)
- **Diagnosis:** Hub INF-PAY vs PER- con disclaimer — excelente ancla de dominio PE (procesador de pagos). Instruction larga pero sin preamble formal ni retrospective. Feedback genérico.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Hub infra vs. persona por prefijo
- **Proposed preamble:**  
  - **Contexto:** un hub `INF-PAY` de pagos no implica culpa de las personas `PER-` conectadas.  
  - **Meta:** calcular grado desde aristas, elegir hub y clasificar por prefijo `INF-` / `PER-`.  
  - **Éxito:** `kind infra` / `disclaimer centrality_not_guilt` / `hub INF-PAY`.  
  - **Límites:** grado desde aristas (no ranking pre-horneado); sin fraude automático.
- **Proposed instruction/description improvements:**  
  1. Acumula deg en ambos extremos.  
  2. `hub = max(deg, key=deg.get)`.  
  3. `kind = 'infra' if hub.startswith('INF-') else 'person'`.  
  4. Imprime kind, disclaimer y hub.
- **Proposed retrospective:**  
  Interpretar con tipo de nodo evita castigar infraestructura legítima. Luego (E3): nodos high-degree filtrados **y** etypes incidentes del hub.
- **Code/output changes:** none
- **Validation notes:** Fixture realista INF-PAY + 5 PER; solution canónica.

---

### S31-T3-B-E3 (weDo, transfer)
- **Diagnosis:** High-degree ≥3 + only_transfer del hub H (False por shared_phone) — transfer rico en interpretación. Instruction densa; falta preamble “interpreta siempre con tipos” y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** High-degree e interpretación por etypes
- **Proposed preamble:**  
  - **Contexto:** un hub con `shared_phone` y `transfer` no se interpreta igual que un hub solo de transferencias.  
  - **Meta:** calcular degree y etypes desde aristas; filtrar degree ≥ 3; ver si H es solo `transfer`.  
  - **Éxito:** `high ['H']` / `only_transfer False` / `interpret_with_types True`.  
  - **Límites:** no uses dict pre-horneado de incidentes; sin labels de fraude; sintético.
- **Proposed instruction/description improvements:**  
  1. Acumula deg y sets de etype por extremo.  
  2. `high = sorted` nodos con deg ≥ 3.  
  3. `only_transfer` si etypes de H son solo `{'transfer'}`.  
  4. Imprime high, only_transfer e `interpret_with_types True`.
- **Proposed retrospective:**  
  Centralidad sin tipos de arista es un número ciego. El error clásico es rankear solo por grado. Pregunta: ¿cómo cambiaría la cola si H fuera solo `transfer`?
- **Code/output changes:** none
- **Validation notes:** Transfer auténtico; shared_phone fuerza only_transfer False a propósito.

---

### S31-T4-A-DEMO (iDo)
- **Diagnosis:** Ego k=1 desde S con test_ok — worked example limpio. Falta preamble “seed del caso + k hops” y retrospective del misconception “ego = grafo completo del banco”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El revisor no navega 100k nodos: arranca del seed del caso y expande k hops. Esta demo extrae ego k=1 desde S y aserta el conjunto esperado. No escribas aún: predice por qué C (a 2 hops) no entra en k=1 y por qué un assert de membresía es un test de regresión útil.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: subgrafo de caso testeable; ego-k acota el workbench; el path del seed es hipótesis con evidencia. Puente a We Do: ego k=1/2, invariantes de calidad e idempotencia del builder.
- **Proposed retrospective:**  
  Si puedes decir qué entra y qué no en k=1 vs k=2, ya tienes el hábito de subgrafos de caso. El error clásico es devolver el grafo entero. We Do: ego, invariantes y build idempotente.
- **Code/output changes:** none
- **Validation notes:** Output `ego ['A','B','S'] / test_ok True` alineado a theory T4-A.

---

### S31-T4-A-E1 (weDo, guided)
- **Diagnosis:** `ego(seed,k)` con k=1 y k=2; starter devuelve solo `{seed}`. Instruction clara; sin preamble formal ni retrospective. Feedback genérico.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Ego k-hop desde la semilla del caso
- **Proposed preamble:**  
  - **Contexto:** el workbench arranca en la entidad seed y expande con hop limit configurable.  
  - **Meta:** implementar expansión por capas; comparar k=1 y k=2 desde A en A–B–C–D.  
  - **Éxito:** `k1 ['A', 'B']` / `k2 ['A', 'B', 'C']` / `has_D_k2 False`.  
  - **Límites:** no incluyas D en k=2; no hardcodees sets; datos sintéticos.
- **Proposed instruction/description improvements:**  
  1. Completa `ego`: por cada hop, vecinos no vistos → nueva layer.  
  2. Imprime sorted de k=1 y k=2.  
  3. Imprime si D está en k=2 (debe ser False).  
  4. No devuelvas solo `{seed}`.
- **Proposed retrospective:**  
  Ego-k es el recorte operativo del caso. El error clásico es un solo paso o el grafo completo. Siguiente (E2): invariantes no_self / pesos / provenance.
- **Code/output changes:** none
- **Validation notes:** Cadena A–B–C–D didáctica para radio exacto.

---

### S31-T4-A-E2 (weDo, independent)
- **Diagnosis:** Tres invariantes con self-loop a propósito — excelente. Instruction ya nombra el defect; falta preamble de calidad del builder y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Invariantes: self-loop, pesos, provenance
- **Proposed preamble:**  
  - **Contexto:** cada bug de construcción (self-loop basura, peso negativo, rid faltante) merece un test de regresión.  
  - **Meta:** evaluar `no_self`, `w_ok` y `prov` sobre un fixture con self-loop deliberado.  
  - **Éxito:** `no_self False` / `w_ok True` / `prov True`.  
  - **Límites:** no “arregles” el fixture; mide lo que hay; sintético.
- **Proposed instruction/description improvements:**  
  1. `no_self = all(src != dst)`.  
  2. `w_ok = all(w >= 0)`.  
  3. `prov = all(rid presente)`.  
  4. Imprime los tres booleanos.
- **Proposed retrospective:**  
  Los invariantes convierten calidad del grafo en asserts. Luego (E3): build idempotente que conserve dirección.
- **Code/output changes:** none
- **Validation notes:** Self-loop en starter es el DEFECT pedagógico correcto.

---

### S31-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Idempotencia del builder dirigido (no `tuple(sorted(e))` por arista) — transfer sutil y valioso. Starter `return []`. Falta preamble “re-runs del revisor” y retrospective del anti-patrón de simetrizar transferencias.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Build idempotente conservando dirección
- **Proposed preamble:**  
  - **Contexto:** el revisor re-ejecuta el builder; A→B no es B→A en un grafo dirigido de transferencias.  
  - **Meta:** `build` determinista con `sorted(set(edges))` sin reordenar extremos de cada arista.  
  - **Éxito:** `equal True` / `edges [('a', 'b'), ('b', 'c')]` / `idempotent True`.  
  - **Límites:** no hagas `tuple(sorted(e))` por arista; orden de entrada no debe cambiar el grafo canónico.
- **Proposed instruction/description improvements:**  
  1. Implementa `build` como `sorted(set(edges))`.  
  2. Compara dos builds del mismo raw y del raw invertido.  
  3. Imprime `equal`, `edges` e `idempotent`.  
  4. No simetrices pares dirigidos.
- **Proposed retrospective:**  
  Idempotencia + dirección = confianza en re-runs. El error clásico es colapsar A→B con B→A. Pregunta: ¿qué se rompe en auditoría si el path invierte un hop de transferencia?
- **Code/output changes:** none
- **Validation notes:** Transfer auténtico y alineado a requirements del You Do.

---

### S31-T4-B-DEMO (iDo)
- **Diagnosis:** Redact de teléfono + evidence_records + pii_full False — cierre de privacidad de la sección. Falta preamble “layout bonito con PII = incidente” y retrospective.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Un layout con PII completa es un incidente de compliance, no un entregable de portafolio. Esta demo redacta teléfonos en el path view y adjunta `records` del hop. No escribas aún: predice por qué `pii_full False` es parte del contrato y qué ve el revisor al hacer clic en el hop.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: vista de path con privacidad y evidencia; redact por defecto; records solo al revisor autorizado. Puente a We Do: redact email, records por hop del path y política summarize/render.
- **Proposed retrospective:**  
  Si puedes defender redact + records por hop, ya tienes el storyboard del revisor. El error clásico es capturar PII completa en el portafolio. We Do: redact, evidence por hop y umbral de escala.
- **Code/output changes:** none
- **Validation notes:** Output `labels / evidence_records / pii_full False` alineado a theory T4-B.

---

### S31-T4-B-E1 (weDo, guided)
- **Diagnosis:** Redact email `an***@example.pe` — starter `red = None`. Instruction densa; sin preamble de compliance. Feedback genérico.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Redactar email en labels de la vista
- **Proposed preamble:**  
  - **Contexto:** la vista del revisor muestra lo mínimo para decidir; el portafolio nunca lleva PII completa.  
  - **Meta:** local[:2] + `***@` + domain para `ana@example.pe`.  
  - **Éxito:** `redacted an***@example.pe` / `domain example.pe` / `full_pii False`.  
  - **Límites:** solo datos `@example.pe`; no imprimas el local completo.
- **Proposed instruction/description improvements:**  
  1. Ya tienes `partition('@')`.  
  2. Arma `red = local[:2] + '***@' + domain`.  
  3. Imprime redacted, domain y `full_pii False`.  
  4. No hardcodees el string final sin usar local/domain.
- **Proposed retrospective:**  
  Redact es el default de la vista, no un extra. El error clásico es loguear PII “para debug”. Siguiente (E2): adjuntar records por hop del path.
- **Code/output changes:** none
- **Validation notes:** Mismo patrón que theory `viz_privacy.py`.

---

### S31-T4-B-E2 (weDo, independent)
- **Diagnosis:** Records por hop con zip(path, path[1:]) — skill clave del storyboard. Instruction ya nombra explainable; falta preamble y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Evidencia de arista por hop del path
- **Proposed preamble:**  
  - **Contexto:** al hacer clic en cada hop, el revisor debe ver `records` (y en prod ts/source).  
  - **Meta:** dado un path y un dict de evidencia por par, listar records en orden del path.  
  - **Éxito:** `records [['r1'], ['r2', 'r3']]` / `n_hops 2` / `explainable True`.  
  - **Límites:** un hop sin evidence no es explicable; datos sintéticos.
- **Proposed instruction/description improvements:**  
  1. Recorre pares consecutivos con `zip(path, path[1:])`.  
  2. Busca cada par en `ev`.  
  3. Imprime `records`, `n_hops` y `explainable True`.  
  4. No inventes records.
- **Proposed retrospective:**  
  Path sin records es layout; path con records es evidencia. Luego (E3): política de escala render vs. summarize.
- **Code/output changes:** none
- **Validation notes:** Alineado a path_view del You Do starter.

---

### S31-T4-B-E3 (weDo, transfer)
- **Diagnosis:** Política max_n=500 summarize/render — transfer de producto real. Starter siempre `"render"`. Falta preamble SNAP/escala y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Política de escala: render o summarize
- **Proposed preamble:**  
  - **Contexto:** dibujar 5000 nodos en el navegador del revisor no es “más transparente”: es ruido.  
  - **Meta:** si `n_nodes > max_n` → `summarize`; si no → `render`. Probar 5000 y 50 con max_n=500.  
  - **Éxito:** `n5000 summarize` / `n50 render` / `max_n 500`.  
  - **Límites:** umbral ilustrativo del lab (no universal); sintético; sin PII.
- **Proposed instruction/description improvements:**  
  1. Completa `decide(n)` con el umbral.  
  2. Imprime decisión para 5000 y 50.  
  3. Imprime `max_n`.  
  4. No dejes siempre `"render"`.
- **Proposed retrospective:**  
  Escala es política de producto: ego-k o resumen, no “todo el banco”. El error clásico es forzar render total. Pregunta: ¿qué resumen mostrarías (top hubs, tamaños de componentes, conteos por etype)?
- **Code/output changes:** none
- **Validation notes:** Transfer auténtico hacia requirements You Do de política documentada.

---

### youDo — Grafo temporal con caminos de evidencia (CP-N3-B inicio)
- **Diagnosis:** Marco de proyecto **sólido**: context con storyboard del revisor, objectives alineados a T1–T4, requirements con schema/path/tests/redact/disclaimer, starter con `bfs_path` y TODOs claros, rubric con gate anti-fraude. Falta **solo** `retrospective` metacognitiva post-build (defensa de invariantes, PII sintético, impacto medible). Sin eso el learner cierra el tab sin auto-chequeo de portafolio.
- **Checklist:** context pass · goal pass · success pass (rubric) · constraints pass · retrospective **fail**
- **Severity:** P1
- **Proposed title:** N/A (ya tiene title de proyecto)
- **Proposed preamble:** N/A (context ya cubre escena; no duplicar essay)
- **Proposed instruction/description improvements:**  
  Mantener context/objectives/requirements. Opcional (P2): una línea en `portfolioNote` que recuerde el checklist de defensa en 30s.
- **Proposed retrospective:**  
  Antes de marcar listo: (1) ¿qué invariante demuestras con un test (idempotencia, no self-loop, provenance, ego-k)? (2) ¿qué harías distinto con datos reales vs. sintéticos (PII, redacción, roles)? (3) En el README, una frase de impacto medible (p. ej. “path + records por hop sin auto-label”) que puedas defender en 30 segundos ante un revisor de compliance. El grafo explica conexiones; no sentencia culpabilidad.
- **Code/output changes:** none
- **Validation notes:** Starter y rubric listos para Fixer solo-añadir `retrospective`; no reescribir el proyecto.

---

## Priority order

### P0 (We Do: title + preamble + instruction solo-tarea + retrospective + feedback con razonamiento)
1. **S31-T1-A-E1, E2, E3** — modelo, out-strength, directed/undirected  
2. **S31-T1-B-E1, E2, E3** — multi-count, ventana temporal, provenance  
3. **S31-T2-A-E1, E2, E3** — owns, shared contact, unión de nodos  
4. **S31-T2-B-E1, E2, E3** — colapso canónico, agregar con records, invariante  
5. **S31-T3-A-E1, E2, E3** — grado, componentes, BFS path  
6. **S31-T3-B-E1, E2, E3** — centrality, hub INF/PER, high-degree+etypes  
7. **S31-T4-A-E1, E2, E3** — ego-k, invariantes, idempotencia dirigida  
8. **S31-T4-B-E1, E2, E3** — redact, evidence por hop, scale policy  

### P1 (I Do preamble + retrospective + why ampliado; You Do retrospective)
- **S31-T1-A-DEMO … S31-T4-B-DEMO** (8 demos)  
- **youDo** — añadir solo `retrospective` de defensa  

### P2 (polish)
- Unificar feedback: dejar de usar solo *«Compara tu salida con la solución.»*; cada unidad con 25–60 palabras que nombren el bug o el principio (propuestas en ledger como “Proposed feedback improvement” donde se redactó; en el resto el Fixer debe hand-write el mismo nivel de razonamiento).  
- Opcional: hábito `# DEFECT:` en starters (hoy es `# TODO` + hueco).  
- Ampliar todos los `why` de I Do al rango 40–90 palabras.

---

## Residual risks

1. **Nombre de archivo vs. contenido:** `s31-streaming-data.ts` / id `streaming-data` vs. título “Grafos y evidencia relacional” puede confundir al Fixer o a herramientas de búsqueda; el reporte usa el **contenido real** (grafos CP-N3-B). No renombrar en esta ronda salvo que el orchestrator lo pida.  
2. **Feedback vacío masivo:** las 24 We Do comparten la misma frase; el Fixer debe **hand-write** feedback por unidad (anti-aberración: no plantilla global).  
3. **Hints casi-solución en E3:** varios E3 ya dan la fórmula en hints; al añadir preamble, no empujar más spoiler en instruction.  
4. **Ética del grafo:** cualquier prose nueva debe conservar el gate: path/evidencia ≠ fraude/parentesco; centralidad ≠ culpa; solo `@example.pe`.  
5. **No tocar outputs canónicos** al inyectar campos pedagógicos: los tests del harness dependen de líneas exactas (`n_nodes 3`, `guilt False`, etc.).  
6. **Volumen:** 33 unidades; el Fixer debe ir subtema por subtema (T1-A … T4-B) sin bulk generator.

---

## Fixer handoff notes

- Schema preferred: I Do `preamble` + `retrospective` (+ ampliar `why`); We Do `title` + `preamble` + slim `instruction` + `retrospective` + `feedback` rico; You Do `retrospective` only.  
- Longitudes del spec: title 4–12 palabras; preamble 80–150 palabras o 4 bullets; instruction 40–100 palabras en pasos; retrospective 40–80; feedback 25–60.  
- Fade E1→E2→E3: guiado nombra el hueco; independiente da meta+éxito; transfer nueva superficie, mismo principio — **no** clonar el mismo prompt con otros números.  
- Validar build estático de la sección tras el fix; no se requiere cambiar código de solution/output en esta campaña salvo bug real descubierto al ejecutar.

---

Section 31 exercise pedagogy review complete. Ready for the Fixer prompt.
