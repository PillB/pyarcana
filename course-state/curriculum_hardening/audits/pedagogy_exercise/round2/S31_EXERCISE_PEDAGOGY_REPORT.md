# S31 Exercise Pedagogy Report (Round 2)

## Section
- **title:** Grafos y evidencia relacional
- **shortTitle:** Grafos y evidencia
- **id:** `streaming-data` (archivo `s31-streaming-data.ts`; contenido = grafo de evidencia relacional CP-N3-B — no streaming de datos)
- **index:** 31
- **source:** `src/lib/course/sections/s31-streaming-data.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades)
- **subtemas:** T1-A nodos/aristas/dirección/peso · T1-B multigrafo/tiempo/provenance · T2-A tablas→grafo · T2-B dedup/agregación con detalle · T3-A grado/componentes/caminos · T3-B centralidad con límites · T4-A subgrafos/pruebas · T4-B viz/privacidad/escala
- **hilo:** desk PE de investigación relacional **CP-N3-B** / `CASO-LIM-031` (run_id conceptual `cpn3b-01`); entidades sintéticas `@example.pe` / Lima–Red Andina; path + evidencia ≠ fraude/parentesco; centralidad = estructura no culpa
- **Round 1 context:** `round1/S31_EXERCISE_PEDAGOGY_REPORT.md` (solo contraste; **no** rubber-stamp)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (preamble/retrospective checklists, E1→E3 fade, length targets, anti-aberration).
- Manually re-inspected **current** source for every `iDo.steps[]` (8), `weDo.steps[]` (24) y `youDo` (title, preamble, instruction, feedback, retrospective, starter defect, solution output, why).
- Verified integrity traps (starter stdout ≠ solution stdout) for representative units: T1-A-E1 (`edges=[]` incompleto vs `n_edges 2`), T1-A-E2 (`out={}` vs `top B`), T1-B-E3 (`ok` siempre False → `n_bad 3` si se usa ciego vs `n_bad 1`), T2-B-E1 (`ce=[]` vs canónico colapsado), T3-A-E3 (`path=None` vs A→D), T3-B-E1 (sin norm vs `score 1.0`), T4-A-E1 (`return {seed}` vs k1/k2), T4-A-E3 (`return []` vs edges ordenados), T4-B-E3 (siempre `render` vs `summarize` en 5000).
- Scored for a **true newbie** (qué / por qué / éxito / qué queda), independent of Round-1 proposals.
- Word counts measured only as gates (no bulk prose generation).
- No generators, bulk templates, or source edits.

## Global findings (post Round-1 fix)

| Area | Status | Residual impact |
|------|--------|-----------------|
| **Field coverage** | Complete: 8 iDo con `preamble`+`why`+`retrospective`; 24 weDo con `title`+`preamble`+`instruction`+`feedback`+`retrospective`; youDo con `retrospective` + marco sólido | Round-1 P0 “cero campos” **cerrado** |
| **We Do titles** | Presentes, 4–7 palabras, español PE, alineados al skill | Pass |
| **Preamble shape** | weDo en bullets contexto/meta/éxito/límites; iDo narrativos con predicción + “no escribas” | Pass en estructura; bullets a menudo &lt;80 w (aceptable por spec “4 short bullets”); iDo narrativos ~45–65 w |
| **Instruction = steps** | Solo-tarea, ordenados; E1 nombra hueco; E2/E3 menos migas | Pass — varias ~11–36 w (bajo piso 40; legibles; no bloquear salvo T4-A-E2 muy escueta) |
| **E1→E2→E3 fade** | Superficies distintas por subtema (modelo → out-strength → directed/etypes; multi-count → ventana → provenance; owns → shared → unión nodos; colapso ER → agregar+records → invariante; grado → componentes → BFS; deg/(n−1) → INF/PER → high+etypes; ego-k → invariantes → build dirigido; redact → records hop → scale) | Pass — **no** clones numéricos |
| **Feedback vs retrospective** | Feedback suele razonar el bug; en **~6–8** unidades el retro **eco** del feedback (misma frase de apertura o misconception idéntico) | Residual **P2** sistemático en eco |
| **Retrospective length** | Mediana weDo ≈24–32 w (spec 40–80); varias **muy cortas** (&lt;20 w): T2-B-E2, T3-A-E2, T3-B-E2, T4-A-E2, T4-B-E2 | Residual **P2** prioritario en polish |
| **iDo why** | 2/8 en rango ~45–55 w; **6/8** ~32–38 w (bajo piso 40) | Residual **P2** leve (expandir al tocar la unidad) |
| **iDo preamble/retro** | Completos y útiles; retros iDo ~34–42 w (varias bajo 40); preambles 45–65 w | Residual **P2** leve |
| **Código/outputs** | Coherentes con theory y schema canónico; starters con hueco real; **wrong ≠ right** en traps verificados | **Sin** hueco de integridad tipo wrong≈right |
| **youDo frame** | context CP-N3-B, objectives, requirements éticos, starter ejecutable (`bfs_path` + TODOs), rubric 6+bonus+gate, portfolioNote, retrospective de defensa (~64 w) | Pass |
| **Hints E1** | Varios casi spoilean la fórmula (T1-B-E1 Counter, T2-A-E1 sorted); aceptable en guided | Residual **P2** opcional (no ampliar spoiling en E3) |
| **Ética del grafo** | Conservada en prose: no parentesco/fraude auto; `guilt False`; `not_parentesco`; redact; `@example.pe` | Pass — no regresar |

**Net:** Round 1 cerró el vacío sistemático de prosa verbal. Round 2 **no** es rubber-stamp: la sección está **lista para learner** en la gran mayoría de unidades. Residuales son **calidad** (eco feedback/retro, retros muy cortas sin misconception o self-check, iDo why/retro levemente cortos, feedback &lt;25 w en ~4 unidades). **No** hay defectos de integridad wrong≈right ni campos ausentes. Prioridad del Fixer R2 = **P2 polish**, no reescritura estructural.

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

### S31-T1-A-DEMO (iDo) — **A**
- **Diagnosis:** Worked example sólido: 4 nodos, aristas `owns` / `shared_phone` / `transfer` con dirección y peso. Preamble pide predicción (transfer dirigida vs shared no; peso ≠ culpa). `why` (~55 w) en rango: schema, etype, unidades, puente We Do. Retro repara “peso = veredicto” y apunta a modelar / out-strength / clasificar.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S31-T1-A-E1 (weDo, guided) — **A−**
- **Diagnosis:** Title claro; bullets con éxito exacto; instruction nombra `edges` vacío; feedback razona `n_directed=1` (solo owns); retro distinta (mezclar convenciones de dirección + puente E2). Starter `edges=[]` discrimina. Feedback ~24 w (leve bajo 25).
- **Checklist:** all pass
- **Severity residual:** P2 leve (feedback +1 frase si se toca)
- **Proposed residual:** none required
- **Code/output changes:** none

### S31-T1-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Out-strength es skill distinto de E1. Éxito exacto. Feedback y retro se solapan en “no contar vecinos / no incluir destinos” (eco parcial); retro carece de self-check.
- **Checklist:** all pass; retro partial (eco + corta ~32 w)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Out-strength es evidencia de *flujo saliente*, no de culpa ni de popularidad de vecinos. Si confundes “cuántos destinos toca B” con “cuánto peso sale de B”, el revisor prioriza mal la cola de hops. Pregunta: ¿por qué un nodo solo-destino no aparece en el dict de out-strength? Luego (E3) clasificarás directed vs. undirected con etypes del schema.
- **Code/output changes:** none

### S31-T1-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Transfer real: conteos directed/undirected + etypes sorted. Self-check en retro (“¿qué harías si un etype mezcla directed?”). Feedback distinto (un solo contador). Discrimina hardcode.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S31-T1-B-DEMO (iDo) — **A−**
- **Diagnosis:** Multiaristas + `prov_ok` + `latest` r1; preamble predice; `why` (~45 w) en rango. Retro (~38 w) repara colapsar detalle; sin self-check explícito.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Si puedes distinguir «agregar o filtrar por tiempo» de «borrar el detalle», ya tienes el hábito de T1-B. El error clásico es quedarte solo con `latest` y perder `record_id` del resto. Pregunta: ¿qué audita el revisor si el hop solo muestra la última transferencia? We Do: multi-count, filtro temporal y gate de provenance.
- **Code/output changes:** none

### S31-T1-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Multi-count con Counter; defect `c = None` claro. Feedback y retro ambos anclan en `set(rows)` (eco). Retro ~27 w, puente E2 OK.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Multi-count hace visible la *densidad de hechos* entre el mismo par: dos transferencias E1→E2 son dos filas auditables, no un “mismo hop”. El error clásico es colapsar con `set` antes de medir frecuencia. Pregunta: si el revisor pregunta “¿cuántos eventos hay entre E1 y E2?”, ¿qué número defiendes? Siguiente (E2): filtrar por ventana temporal sin borrar provenance.
- **Code/output changes:** none

### S31-T1-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Filtro temporal + prov; éxito claro. Feedback nombra umbral inclusivo (bueno). Retro ~26 w, sin misconception rico ni self-check.
- **Checklist:** all pass; retro partial (corta)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  La ventana temporal acota el grafo al caso: mezclar 2019 con 2026 sin documentarlo contamina el path. Filtrar no dispensa de provenance: cada arista que sobrevive debe seguir saltando al ledger. Pregunta: si una arista cae fuera de la ventana, ¿la borras del detalle fuente o solo de la vista del caso? Luego (E3): validar source y record_id no vacíos.
- **Code/output changes:** none

### S31-T1-B-E3 (weDo, transfer) — **A−**
- **Diagnosis:** Gate de provenance con `source` vacío; self-check fuerte en retro. Feedback ~21 w (bajo 25) pero nombra fail-closed. Starter `return False` discrimina si se completa el bucle mal.
- **Checklist:** all pass
- **Severity residual:** P2 leve (expandir feedback si se toca)
- **Proposed feedback (expand if touched):**  
  Un `source` vacío (`''`) es fail-closed: cuenta como bad. Si `all_ok` sale True, tu `ok` acepta strings vacíos o no mira `record_id`. No “arregles” el fixture a mano: el punto es detectar la arista huérfana. Compara con `n_bad 1`.
- **Code/output changes:** none

### S31-T2-A-DEMO (iDo) — **B**
- **Diagnosis:** Proyección tablas→nodos con `900` compartido; preamble ética clara. `why` ~37 w (bajo 40); retro ~39 w. Principio shared≠parentesco está en preamble, no reforzado en retro con self-check.
- **Checklist:** all pass; why/retro partial (longitud)
- **Severity residual:** P2
- **Proposed why (expand):**  
  Tablas → grafo con tipos del schema canónico (`owns`, `has_phone`). El contacto como nodo intermedio facilita el path `E1 → 900 → E2` sin inventar parentesco. Ids sintéticos estables hacen la construcción idempotente. Sin el valor de teléfono como nodo, el hop de contacto compartido no se dibuja. We Do: proyectar owns ordenadas, detectar shared y armar el set de nodos.
- **Proposed retrospective (expand):**  
  Si puedes dibujar el hop por teléfono compartido sin inventar parentesco, ya internalizaste T2-A. El error clásico es modelar solo personas y omitir el nodo de contacto. Pregunta: ¿qué ve el revisor si el teléfono no es nodo de primera clase? We Do: proyectar owns, detectar shared y unir el set de nodos.
- **Code/output changes:** none

### S31-T2-A-E1 (weDo, guided) — **A**
- **Diagnosis:** Owns con sort; feedback nombra fixture desordenado e idempotencia; retro distinta (invertir src/dst). Discrimina bien.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S31-T2-A-E2 (weDo, independent) — **C**
- **Diagnosis:** Skill ético excelente (`not_parentesco`). **Eco fuerte:** feedback y retrospective abren con la misma frase “Shared contact = hipótesis con evidencia, no veredicto.” Retro no añade metacognición nueva.
- **Checklist:** context/goal/success/constraints pass; retro partial (**eco**)
- **Severity residual:** P2 (prioridad alta entre polish)
- **Proposed retrospective (replace):**  
  Detectar shared es el *disparador* de la cola humana, no la sentencia. El error clásico es saltar a «familia» o «colusión» cuando solo tienes un valor de contacto repetido. Pregunta: si mañana el mismo teléfono es de un call center legítimo, ¿qué cambia en tu modelo y qué no? Luego (E3): unir entidades, cuentas y contactos en un solo set de nodos.
- **Code/output changes:** none

### S31-T2-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Unión de tres sets; self-check (“¿qué path se pierde si el teléfono no es nodo?”). Feedback distinto (has_contact False). Transfer fiel al patrón canónico.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S31-T2-B-DEMO (iDo) — **B**
- **Diagnosis:** Agregado + lista de ids; preamble predice `detail_n`. `why` ~32 w y retro ~36 w bajo piso. Principio sólido pero denso-corto.
- **Checklist:** all pass; why/retro partial (longitud)
- **Severity residual:** P2
- **Proposed why (expand):**  
  Agregado y detalle conviven: el workbench prioriza con `sum` y explica con `records`. Borrar ids rompe la auditoría del path aunque la suma sea correcta. La clave de agregado debe incluir al menos `(src, dst, etype)` cuando el schema lo exija. We Do: colapso canónico post-ER, agregar conservando records e invariante de no-pérdida.
- **Proposed retrospective (expand):**  
  Si puedes defender por qué el path necesita la capa de detalle además del total, ya tienes T2-B. El error clásico es imprimir solo `sum 15` y creer que el hop es auditable. Pregunta: ¿qué pide el revisor al hacer clic en el hop E1→E2? We Do: reescribir aristas canónicas, agregar conservando records y verificar el invariante.
- **Code/output changes:** none

### S31-T2-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Puente S30→S31 excelente. Feedback nombra hops fantasma. Retro ~24 w, eco leve del “olvidar el mapa”.
- **Checklist:** all pass; retro partial (corta)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  El mapa raw→canónico es el puente S30→S31: sin él, dos raw del mismo cliente generan aristas fantasmas y el path del revisor se fragmenta. El error clásico es copiar ids raw al grafo “para no perder información” y duplicar hops. Pregunta: ¿dónde guardas el mapa para reescribir aristas sin rehacer el matching? Siguiente (E2): agregar montos sin borrar `record_id`.
- **Code/output changes:** none

### S31-T2-B-E2 (weDo, independent) — **C**
- **Diagnosis:** Skill central del subtema. Feedback bueno (sum sin records). **Retro ~14 w** — solo puente E3, sin misconception ni self-check. Falla el test de “qué debe quedarme al cerrar la pestaña”.
- **Checklist:** context/goal/success/constraints pass; retrospective **partial** (demasiado corta)
- **Severity residual:** P2 (prioridad alta)
- **Proposed retrospective (replace):**  
  Agregado acelera filtros; detalle responde «muéstrame las transacciones de este hop». Si solo dejas el total, el path es un número opaco y el workbench deja de ser auditable. El error clásico es sobrescribir la lista de records con un solo id. Pregunta: ¿qué imprimirías si `detail_kept` fuera False en CI? Luego (E3): probar el invariante `sum(n) == len(detail)`.
- **Code/output changes:** none

### S31-T2-B-E3 (weDo, transfer) — **B**
- **Diagnosis:** Invariante de no-pérdida; self-check de CI en retro. **Eco parcial:** feedback y retro abren con “test de regresión de auditoría”. Aun así usable.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Contrastar cardinalidades (`sum(n)` vs `len(detail)`) es el hábito que evita bugs silenciosos de agregación. El error clásico es confiar en el dict agregado porque “las sumas se ven bien”. Pregunta: si `total != detail_n` en CI, ¿fallas el build o solo logueas un warning? Ese gate te sirve en el You Do y en el workbench real.
- **Code/output changes:** none

### S31-T3-A-DEMO (iDo) — **B**
- **Diagnosis:** BFS A→D + `repro True`; preamble predice sorted vecinos. `why` ~32 w y retro ~35 w cortos; principio correcto.
- **Checklist:** all pass; why/retro partial (longitud)
- **Severity residual:** P2
- **Proposed why (expand):**  
  Camino acotado y con vecinos ordenados = reproducible entre re-runs del revisor. El hop limit controla costo y ruido de paths largos poco accionables; en producción NetworkX cubre el mismo contrato sobre MultiGraph. Un path sin orden estable no se puede auditar ni comparar en tests. We Do: grado, componentes conexas y BFS A→D con hops.
- **Proposed retrospective (expand):**  
  Si puedes explicar por qué vecinos `sorted` implica `repro True`, ya tienes el hábito de paths auditables. El error clásico es BFS con orden de `set` no determinista o tratar cualquier camino como “el” path del caso. Pregunta: ¿qué pondrías junto al path en la UI del revisor? We Do: degree, componentes y path con hops.
- **Code/output changes:** none

### S31-T3-A-E1 (weDo, guided) — **B**
- **Diagnosis:** Grado no dirigido; feedback nombra “solo un extremo”. Retro eco leve (“prioriza, no sentencia”) con feedback.
- **Checklist:** all pass; retro partial (eco leve)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Grado es estructura: filtra hubs y prioriza exploración, nunca etiqueta conducta. El error clásico es contar solo un extremo (como si el grafo fuera dirigido) o convertir el máximo en “sospechoso”. Pregunta: en un triángulo a–b–c, ¿por qué todos los grados salen 2? Siguiente (E2): componentes conexas del grafo del caso.
- **Code/output changes:** none

### S31-T3-A-E2 (weDo, independent) — **C**
- **Diagnosis:** Componentes con dos islas — independiente real. Feedback bueno. **Retro ~16 w**: solo “acotan el caso… Luego E3” — sin misconception, sin self-check. Debe expandirse en R2.
- **Checklist:** context/goal/success pass; retrospective **partial** (casi vacía de metacognición)
- **Severity residual:** P2 (prioridad alta)
- **Proposed retrospective (replace):**  
  Las componentes conexas acotan el caso y evitan mezclar islas irrelevantes en la misma vista del revisor. El error clásico es un `seen` incompleto que “puentea” islas o hardcodear las listas en vez de recorrer el adj. Pregunta: si mañana aparece un puente sintético entre las dos islas, ¿qué cambia en `n_comp` y en la cola de revisión? Luego (E3): BFS path A→D con hops y found.
- **Code/output changes:** none

### S31-T3-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** BFS reproducible + ética path≠veredicto; self-check de disclaimer en UI. Feedback nombra sorted. Starter `path=None` discrimina.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S31-T3-B-DEMO (iDo) — **A−**
- **Diagnosis:** Hub H + `guilt_label False` — gate ético central. Preamble predice. `why` ~38 w y retro ~34 w levemente cortos; mensaje claro.
- **Checklist:** all pass
- **Severity residual:** P2 leve
- **Proposed residual:** none required (expand why/retro solo si se toca el demo)
- **Code/output changes:** none

### S31-T3-B-E1 (weDo, guided) — **A**
- **Diagnosis:** deg/(n−1) + `guilt False`; feedback nombra denominador correcto vs max_observed. Retro distinta (deg/max e inflar rankings). Éxito didáctico score 1.0.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S31-T3-B-E2 (weDo, independent) — **B**
- **Diagnosis:** INF-PAY vs PER- excelente ancla de dominio. Feedback rico. **Retro ~19 w** — puente E3 sin self-check ni misconception extendido.
- **Checklist:** all pass; retro partial (corta)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Interpretar el hub con tipo de nodo evita castigar infraestructura legítima (procesador de pagos, call center). El error clásico es hardcodear el ranking o tratar alto grado de `INF-` como culpa de las `PER-` conectadas. Pregunta: si el hub fuera `PER-99` con el mismo grado, ¿qué cambia en la cola humana y qué disclaimer se mantiene? Luego (E3): high-degree **y** etypes incidentes del hub.
- **Code/output changes:** none

### S31-T3-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** High-degree + `only_transfer False` por shared_phone; self-check de cola. Feedback nombra etypes. Transfer auténtico.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S31-T4-A-DEMO (iDo) — **B**
- **Diagnosis:** Ego k=1 desde S; preamble predice C fuera. `why` ~33 w y retro ~35 w cortos.
- **Checklist:** all pass; why/retro partial (longitud)
- **Severity residual:** P2
- **Proposed why (expand):**  
  Subgrafo de caso testeable: ego-k acota el workbench al radio del seed y hace el assert de membresía un test de regresión útil. El path del seed es hipótesis con evidencia, no veredicto. Devolver el grafo entero del “banco” no es más transparente: es ruido. We Do: ego k=1/2, invariantes de calidad e idempotencia del builder.
- **Proposed retrospective (expand):**  
  Si puedes decir qué entra y qué no en k=1 vs k=2, ya tienes el hábito de subgrafos de caso. El error clásico es devolver el grafo entero o un solo vecino. Pregunta: ¿por qué un assert `ego1 == [...]` es mejor que solo imprimir el set? We Do: ego, invariantes y build idempotente.
- **Code/output changes:** none

### S31-T4-A-E1 (weDo, guided) — **A**
- **Diagnosis:** Ego k=1/2; starter devuelve solo `{seed}` — trap excelente. Feedback nombra radio mal contado. Retro puente E2.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: self-check en retro)
- **Proposed residual:** none required
- **Code/output changes:** none

### S31-T4-A-E2 (weDo, independent) — **C**
- **Diagnosis:** Tres invariantes con self-loop deliberado — excelente. Feedback nombra “no arregles el fixture”. **Instruction ~11 w** (muy escueta pero clara). **Retro ~15 w** — solo puente E3. Metacognición insuficiente.
- **Checklist:** goal/success pass; instruction partial (corta); retrospective **partial**
- **Severity residual:** P2 (prioridad alta en retro; instruction opcional)
- **Proposed instruction (optional expand):**  
  1. Calcula `no_self = all(src != dst)` sobre el fixture (incluye self-loop b→b).  
  2. Calcula `w_ok = all(w >= 0)`.  
  3. Calcula `prov = all(rid presente)`.  
  4. Imprime los tres booleanos; no “arregles” el fixture.
- **Proposed retrospective (replace):**  
  Los invariantes convierten calidad del grafo en asserts de regresión: self-loop basura, peso negativo y rid faltante deben fallar de forma explícita. El error clásico es “arreglar” el fixture del test para que todo pase verde. Pregunta: ¿en qué orden reportarías los tres flags al revisor del builder? Luego (E3): build idempotente que conserve dirección.
- **Code/output changes:** none

### S31-T4-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Idempotencia sin `tuple(sorted(e))` por arista — transfer sutil y valioso. Self-check de hop invertido. Feedback nombra el anti-patrón. Starter `return []` discrimina.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S31-T4-B-DEMO (iDo) — **A−**
- **Diagnosis:** Redact + evidence_records + `pii_full False`. Preamble compliance fuerte. why/retro levemente cortos; mensaje claro.
- **Checklist:** all pass
- **Severity residual:** P2 leve
- **Proposed residual:** none required
- **Code/output changes:** none

### S31-T4-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Redact email; éxito exacto. **Eco:** feedback y retro abren con “Redact es el default de la vista, no un extra.”
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  La vista del revisor (y el portafolio) llevan lo mínimo necesario para decidir; el local completo no es “debug útil”, es riesgo de compliance. El error clásico es hardcodear el string redactado sin usar `local`/`domain` o loguear PII “por si acaso”. Pregunta: ¿qué cambia si el email real llegara fuera de `@example.pe`? Siguiente (E2): adjuntar records por hop del path.
- **Code/output changes:** none

### S31-T4-B-E2 (weDo, independent) — **C**
- **Diagnosis:** Records por hop con zip — skill del storyboard. **Eco fuerte:** feedback y retro repiten “Path sin records es layout; path con records es evidencia.” Retro ~18 w, sin self-check.
- **Checklist:** all pass; retro partial (**eco** + corta)
- **Severity residual:** P2 (prioridad alta)
- **Proposed retrospective (replace):**  
  Cada hop del path debe mapear a evidencia (`records`, y en prod ts/source); si un par falta en el dict, el hop no es explicable. El error clásico es inventar rids o listar records en orden arbitrario. Pregunta: ¿qué mostraría la UI si `ev` no tuviera el par del segundo hop? Luego (E3): política de escala render vs. summarize.
- **Code/output changes:** none

### S31-T4-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** Política max_n=500; starter siempre `render` discrimina; self-check de qué resumen mostrar. Feedback nombra umbral del lab. Transfer de producto real.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### youDo — Grafo temporal con caminos de evidencia (CP-N3-B inicio) — **A**
- **Diagnosis:** Marco de proyecto sólido: context con storyboard del revisor, objectives T1–T4, requirements schema/path/tests/redact/disclaimer, starter con `bfs_path` y TODOs, rubric con gate anti-fraude, portfolioNote. `retrospective` (~64 w) de defensa post-build con tres preguntas + frase de impacto — alineada al exemplar del spec.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

---

## Priority order (Round 2 Fixer)

### P0
- **Ninguno.** Cobertura de campos y integridad starter≠solution están cerradas.

### P1
- **Ninguno bloqueante.** No hay unidades D ni fallos de true-newbie en éxito/contexto.

### P2 (polish — orden sugerido)

1. **Retros muy cortas o casi vacías de metacognición** (expandir a 40–80 w con principio + misconception *distinto* del feedback + self-check o puente):  
   - **S31-T2-B-E2**, **S31-T3-A-E2**, **S31-T4-A-E2**, **S31-T3-B-E2**, **S31-T4-B-E2**
2. **Eco feedback ↔ retrospective** (reescribir retro para no copiar la frase del feedback):  
   - **S31-T2-A-E2**, **S31-T4-B-E1**, **S31-T4-B-E2**, **S31-T2-B-E3**, **S31-T1-A-E2**, **S31-T1-B-E1**, **S31-T3-A-E1**
3. **iDo why/retro bajo piso 40 w** (expandir solo al tocar el demo):  
   - T2-A, T2-B, T3-A, T3-B, T4-A, T4-B demos; T1-B retro
4. **Feedback &lt;25 w** (opcional): T1-A-E1, T1-B-E3, T4-A-E3, T4-B-E2
5. **Instruction muy escueta (opcional):** T4-A-E2 (~11 w)

### No tocar sin causa
- Outputs canónicos y solution code (tests del harness).  
- Hints de E3 que ya rozan spoiler: no añadir más fórmula en instruction.  
- youDo marco (solo si se quiere una línea extra en portfolioNote — no necesario).

---

## Residual risks

1. **Nombre de archivo vs. contenido:** `s31-streaming-data.ts` / id `streaming-data` vs. título “Grafos y evidencia relacional” sigue siendo confuso para búsqueda; no renombrar en esta ronda salvo orchestrator.
2. **Anti-aberración en polish:** al expandir retros, **hand-write** cada una; no plantilla global “principio + error clásico + siguiente”.
3. **Ética del grafo:** cualquier prosa nueva debe conservar path/evidencia ≠ fraude/parentesco; centralidad ≠ culpa; solo `@example.pe`.
4. **No tocar outputs** al editar campos pedagógicos.
5. **Longitud vs. densidad:** varias unidades ya enseñan bien en 25–35 w; el Fixer debe expandir solo donde falta misconception/self-check, no inflar las que ya son **A**.

---

## Fixer R2 handoff notes

- Schema: campos ya presentes; R2 = **refinar** retrospective (y where marked: why, feedback, instruction), no reintroducir title/preamble desde cero.  
- Longitudes objetivo al tocar: retrospective 40–80; why 40–90; feedback 25–60; instruction 40–100 si se expande T4-A-E2.  
- Priorizar las **C** y ecos fuertes antes que iDo why de unidades A−.  
- Validar build estático de la sección tras el fix; no se requiere cambiar solution/output salvo bug real.  
- Fade E1→E2→E3 de *contenido* ya es correcto: no homogenizar preambles.

---

Section 31 exercise pedagogy review complete. Ready for the Fixer prompt.
