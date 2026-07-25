# S05 Exercise Pedagogy Report (Round 2)

## Section
- **title:** Funciones, contratos y descomposición
- **shortTitle:** Funciones & Contratos
- **id:** `oop` (archivo histórico `s05-oop.ts`; contenido = funciones puras / contratos, no clases)
- **index:** 5
- **source:** `src/lib/course/sections/s05-oop.ts` (re-leído **después** de Round-1 Fix; no se asume el reporte R1)
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24**, youDo **1** (total **33**)
- **subtemas:** S05-T1-A … T4-B (× I Do + E1/E2/E3)
- **hilo de caso:** CASO-LIM-005 / inicio **CP-N1-B**

## Method
- Re-leído `PEDAGOGY_EXERCISE_SPEC.md` (campos, longitudes, checklist preamble/retrospective, fade E1→E2→E3, anti-aberration).
- Inspeccionado **manualmente** cada `iDo.steps[]`, `weDo.steps[]` y `youDo` en el fuente actual (~L384–1834).
- Contrastado con el reporte R1 **solo como contexto** (qué se pidió); el juicio de R2 se basa en el fuente actual.
- Medición auxiliar de longitudes (conteo de palabras) y solapamiento feedback↔retrospective; **sin** generadores de prosa.
- Prosa residual propuesta a mano en **español profesional peruano**.

## Hallazgo global (post Round-1 Fix)

| Campo | Estado R1 | Estado actual (R2) |
|-------|-----------|---------------------|
| I Do `preamble` / `retrospective` | ausentes | **presentes** en 8/8 |
| I Do `why` | 1 frase | **ampliado** (aún corto en varios) |
| We Do `title` | ausente | **presente** en 24/24 |
| We Do `preamble` | ausente | **presente** (formato 4 viñetas) |
| We Do `instruction` | drill mezclado | **pasos** (a menudo por debajo del piso 40 palabras) |
| We Do `retrospective` | ausente | **presente** (a menudo 25–35 palabras; piso spec 40–80) |
| We Do `feedback` | 1 línea | **enriquecido**; en varios **clona** el retrospective |
| You Do `retrospective` | ausente | **presente** y sólido |
| Starter `# FALLO:` | bueno | sigue bueno |
| Outputs canónicos | OK | **no tocar** salvo nota puntual |

**Veredicto R2:** el vacío estructural de R1 **ya no existe**. Un true newbie ahora puede, en la mayoría de unidades, responder qué practica, por qué importa, cómo sabe que ganó y qué debe quedarle. El trabajo residual es de **calidad y fade**, no de “campos ausentes”:

1. **Retrospectives y varios `why`/I Do preambles** por debajo del piso de palabras del spec (aún útiles, pero flacos en principio + misconception + transfer).  
2. **Feedback ≈ retrospective** en un subconjunto (jaccard alto): el learner recibe el mismo mensaje dos veces y pierde la metacognición distinta.  
3. **Hints de E2/E3** que aún pegan la solución (spoiling del fade).  
4. **Instructions** a veces tan cortas que el paso 1 nombra el defecto y el resto es telegráfico (OK en E3; justo de más en E1/E2).  
5. Éxitos **vagos** en 2 preambles (`err ...`, `SKIP malo ...`) frente a output exacto.

**No** hay P0 de “sin andamiaje verbal”. Severidad dominante residual: **P1** (clones + fade de hints + retros cortos en unidades críticas) y **P2** (piso de longitud / pulido).

---

## Unit ledger

Leyenda de checklist: **pass** / **partial** / **fail** sobre context · goal · success · constraints · retrospective (calidad, no solo presencia).  
Severidad residual: **P0** (bloquea newbie) · **P1** (daña aprendizaje o fade) · **P2** (pulido) · **ok** (sin cambio de prosa recomendado).

### S05-T1-A-DEMO (iDo)
- **Diagnosis:** Preamble (~80 p.) y retrospective (~54) cumplen el espíritu del spec: mira return vs print, datos sintéticos, puente a We Do. `why` (~52) explica el contrato strip/split/join/title. Un true newbie sabe *qué mirar*. Residual mínimo: none estructural.
- **Checklist:** context **pass** / goal **pass** / success **pass** (output) / constraints **pass** / retrospective **pass**
- **Severity residual:** **ok**
- **Proposed changes:** none
- **Code/output changes:** none
- **Validation notes:** Output canónico OK.

### S05-T1-A-E1 (weDo, guided)
- **Diagnosis:** Title, preamble en 4 viñetas, instruction en pasos y feedback con razonamiento están bien para E1. Retrospective nombra principio + bug `None` + pregunta de cierre (buena). Hint 1 es la one-liner completa — **aceptable en E1 guiado**. Instruction (~39) y retro (~36) un poco bajo el piso; feedback y retro comparten ~40% vocabulario (tolerable).
- **Checklist:** context **pass** / goal **pass** / success **pass** / constraints **pass** / retrospective **pass** (ligeramente corta)
- **Severity residual:** **P2**
- **Proposed title:** (mantener) Contar palabras con `return` (no `print`)
- **Proposed instruction (opcional, +claridad):**  
  1. Abre el starter: `n_palabras` hace `print` del conteo y no tiene `return`.  
  2. El caller hace `print(n_palabras(...))` y hoy ve `None`.  
  3. Calcula tokens con `strip` + `split` y **devuelve** el entero.  
  4. Deja un solo `print` en el caller; la línea exacta debe ser `2`.
- **Proposed retrospective:** (mantener; opcional alargar 1 frase de transfer)  
  `return` es el contrato con quien llama; `print` es un efecto del borde. El mismo bug (`None` silencioso) rompe pipelines cuando encadenas normalizadores. Pregunta de cierre: si borras el `print` del caller, ¿la función sigue “haciendo su trabajo” para el resto del código?
- **Code/output changes:** none
- **Validation notes:** Feedback actual OK; no clonar más el retro.

### S05-T1-A-E2 (weDo, independent)
- **Diagnosis:** Framing de política CP-N1-B claro; éxito exacto; límites sin regex. Retrospective nombra los dos fallos parciales (title sin colapsar / colapsar sin title). **Hint 1** describe casi la one-liner completa — pesado para E2 independiente. Retro corta (~26).
- **Checklist:** context **pass** / goal **pass** / success **pass** / constraints **pass** / retrospective **partial** (corta; buen contenido)
- **Severity residual:** **P1** (hint spoiling E2)
- **Proposed title:** (mantener)
- **Proposed hints (reemplazo, no spoiling):**  
  1. “Solo `strip` no toca dobles espacios ni mayúsculas: ¿qué métodos del I Do convierten basura de espacios en un solo espacio y title por palabra?”  
  2. “Prueba mental: `'QUISPE'` debe salir title-case; `'  Juan   Pérez '` no debe conservar el hueco doble.”
- **Proposed retrospective:**  
  Title-case sin colapsar deja basura (`"Juan  Pérez"`). Colapsar sin title deja `"QUISPE"`. Ambos fallan matching del gate. Reusarás este contrato en el You Do y en cualquier orquestador que toque nombres.
- **Code/output changes:** none

### S05-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer legítimo (misma lección return, superficie `etiqueta_campo`). Preamble y heurística de feedback buenos. Hints orientan sin pegar f-string de solución. Retro + feedback se solapan un poco en la frase del `None`.
- **Checklist:** context **pass** / goal **pass** / success **pass** / constraints **pass** / retrospective **pass**
- **Severity residual:** **P2**
- **Proposed retrospective (diferenciar del feedback):**  
  El bug `None` reaparece al migrar de script a función. Si la consola muestra `None` tras `print(fn(...))`, no “arregles” imprimiendo más: devuelve el valor. En T1-B el mismo rigor de contrato se aplica a defaults y keywords.
- **Code/output changes:** none

### S05-T1-B-DEMO (iDo)
- **Diagnosis:** Preamble del default evaluado una vez es claro; output good/bad es el mensaje. **Retrospective corta** (~30; piso 40): principio sí, misconception sí, transfer sí pero apretado. `why` (~46) OK.
- **Checklist:** context **pass** / goal **pass** / success **pass** / constraints **partial** (implícito) / retrospective **partial**
- **Severity residual:** **P2**
- **Proposed retrospective:**  
  Si en un PR de normalización ves `def f(x, acc=[])`, es P1 de producción: el default es un objeto vivo compartido. La reparación mental es “defaults inmutables o `None` + creación local”. En We Do reescribirás el antipatrón; no lo “arregles” copiando la lista en el caller.
- **Code/output changes:** none

### S05-T1-B-E1 (weDo, guided)
- **Diagnosis:** Buen E1 (hardcode vs parámetro). Preamble/instruction claros. Hints no spoilean la one-liner. Instruction algo telegráfica (~26).
- **Checklist:** context **pass** / goal **pass** / success **pass** / constraints **pass** / retrospective **pass**
- **Severity residual:** **P2**
- **Proposed instruction (opcional):**  
  1. El starter ignora `titulo` y fija el literal `"Cliente"` en el f-string.  
  2. Usa la variable `titulo` en `f'{titulo}: {nombre}'`.  
  3. Primera llamada sin segundo argumento (default); segunda con `titulo='VIP'`.  
  4. Confirma exactamente `Cliente: Quispe` y `VIP: Quispe`.
- **Code/output changes:** none

### S05-T1-B-E2 (weDo, independent)
- **Diagnosis:** Tema crítico bien enmarcado (acumulador contaminado). Feedback explica la evaluación única. **Hint 1 es la solución literal** (`if bucket is None: bucket = []`) — rompe el fade E2. Retro aceptable pero corta.
- **Checklist:** context **pass** / goal **pass** / success **pass** / constraints **pass** / retrospective **pass**
- **Severity residual:** **P1**
- **Proposed hints:**  
  1. “El default se crea al **definir** la función, no en cada llamada. ¿Qué valor inmutable usarías como centinela y dónde crearías la lista nueva?”  
  2. “Tras el fix, `good_add(1)` y `good_add(2)` no deben compartir el mismo objeto lista.”
- **Proposed retrospective:** (mantener fondo; ligera ampliación)  
  El objeto default vive con la función, no con la llamada: por eso `bad(1)` y `bad(2)` comparten memoria. En code review junior+ este es un filtro clásico; en el lote de intake el síntoma es filas “contaminadas” sin excepción ruidosa.
- **Code/output changes:** none

### S05-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Keyword-only bien enmarcado (ETL Perú, flag de política). Preamble ya apunta al input del starter. Hints guían sin pegar el join de dígitos completo. Buena unidad.
- **Checklist:** context **pass** / goal **pass** / success **pass** / constraints **pass** / retrospective **pass**
- **Severity residual:** **ok** / **P2** menor (retro ~30)
- **Proposed changes:** none obligatorios. Opcional alargar retro 1 frase: “Si eliminas el `*`, un posicional accidental puede silenciar el flag.”
- **Code/output changes:** none

### S05-T2-A-DEMO (iDo)
- **Diagnosis:** Preamble de pre/post/raise claro. `why` en el piso (~40). Retro corta (~32): repite casi el mismo mensaje del `why`/teoría.
- **Checklist:** context **pass** / goal **pass** / success **pass** / constraints **partial** / retrospective **partial**
- **Severity residual:** **P2**
- **Proposed retrospective:**  
  Si el docstring dice “exige `@`” y el código no valida, gana el código y el revisor devuelve el PR. El error clásico es documentar la política y olvidar el `raise`. En We Do convertirás un `#` en docstring real y alinearás pre/post con el cuerpo.
- **Proposed why (opcional, ~55–70 p.):**  
  El `raise` es parte del contrato de negocio, no un adorno de Python. El docstring no sustituye al código, pero debe coincidir en pre, post y errores. Un junior que solo hace `lower` sin validar `@` deja pasar basura al matching; un revisor que lee el doc y ejecuta el caso `x` debe ver el mismo rechazo.
- **Code/output changes:** none

### S05-T2-A-E1 (weDo, guided)
- **Diagnosis:** Meta `__doc__` vs `#` excelente. Feedback y retrospective **casi clones** (jaccard ~0.63): ambos dicen “solo docstring carga `__doc__`”. E1 hints OK (no pegan el texto del doc).
- **Checklist:** context **pass** / goal **pass** / success **pass** / constraints **pass** / retrospective **partial** (duplica feedback)
- **Severity residual:** **P1**
- **Proposed retrospective (reescritura para no clonar feedback):**  
  El revisor y `help()` no leen tus `#`. Si `__doc__` es `None`, el contrato no existe para herramientas aunque “se lea” en el archivo. Pregunta de cierre: ¿qué imprimiría `print(strip_collapse.__doc__)` si solo hay un comentario bajo `def`?
- **Proposed feedback:** (mantener actual — ya razona el síntoma `None`)
- **Code/output changes:** none (texto del docstring de solución es canónico del output)

### S05-T2-A-E2 (weDo, independent)
- **Diagnosis:** Alineado al gate. **Éxito vago** en preamble: `err ...` en vez de `err email sin @`. Hint 1 pega `if '@' not in s: raise ValueError` (spoiling E2). Feedback/retro se solapan en pre/post.
- **Checklist:** context **pass** / goal **pass** / success **partial** / constraints **pass** / retrospective **partial**
- **Severity residual:** **P1**
- **Proposed preamble (viñeta Éxito exacta):**  
  - **Contexto:** política de gate: strip+lower y rechazo si no hay `@`.  
  - **Meta:** alinear docstring, código y error de dominio.  
  - **Éxito:** `a@b.com` y `err email sin @`.  
  - **Límites:** no tragues el error con un return silencioso; no uses PII real.
- **Proposed hints:**  
  1. “El docstring promete lower y `@`. ¿Qué falta en el cuerpo además del `strip`?”  
  2. “El `try/except` del starter debe imprimir un mensaje en español accionable, no silenciar el fallo.”
- **Proposed retrospective:**  
  Pre/post en el docstring y `raise` en el cuerpo deben decir lo mismo. Separar “email malo de negocio” de un bug de Python evita logs confusos en el ETL; el triage del lote necesita mensajes legibles, no `None` ni excepciones genéricas sin contexto.
- **Code/output changes:** none (mensaje `email sin @` canónico)

### S05-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Postcondición viva bien vendida. Feedback y retro **clonan** la frase de “expected a propósito” (jaccard ~0.61). Hints aceptables para transfer.
- **Checklist:** context **pass** / goal **pass** / success **pass** / constraints **pass** / retrospective **partial** (duplica feedback)
- **Severity residual:** **P1**
- **Proposed retrospective:**  
  Un assert de forma (sin extremos ni dobles espacios) mantiene viva la post cuando alguien “solo” cambia el `return`. Si el assert falla tras un cambio, discutes política — no borras el assert. En T2-B verás hints y errores de dominio sin abortar el lote.
- **Code/output changes:** none

### S05-T2-B-DEMO (iDo)
- **Diagnosis:** Tupla de dominio + hints no runtime bien mostrados. Preamble, `why` y retro **todos cortos** (~52 / ~32 / ~27). Contenido correcto; le falta una frase de “cuándo raise vs tupla” en el retro (el `why` ya lo dice).
- **Checklist:** context **pass** / goal **pass** / success **pass** / constraints **partial** / retrospective **partial**
- **Severity residual:** **P2**
- **Proposed retrospective:**  
  Elegir `raise` o tupla `(ok, value, err)` es decisión de diseño del módulo: sé consistente. El error clásico es anotar `-> int` y devolver un `str` “porque se ve igual en el print”. En We Do verás que el hint no impide esa mentira en runtime.
- **Proposed why (opcional):**  
  Raise es contrato estricto (falla ruidosa en la fila). La tupla es borde tolerante: el lote imprime y sigue. Los hints (`Tuple[...]`) documentan forma para humanos y mypy; no convierten ni chequean al ejecutar. Mezclar raise y tuplas en el mismo helper sin documentar confunde al siguiente junior del pipeline.
- **Code/output changes:** none

### S05-T2-B-E1 (weDo, guided)
- **Diagnosis:** El print de la nota exacta sigue siendo “teatro”, pero el preamble lo justifica como demo de humildad del hint — aceptable. Instruction pide la nota; éxito exacto. Hints no spoilean el `return len`. OK para E1.
- **Checklist:** context **pass** / goal **pass** / success **pass** / constraints **pass** / retrospective **pass**
- **Severity residual:** **P2**
- **Proposed changes:** none obligatorios. No cambiar la frase canónica `hint no valida en runtime`.
- **Code/output changes:** none

### S05-T2-B-E2 (weDo, independent)
- **Diagnosis:** Mejor ejercicio de dominio de la sección. **Feedback y retrospective son casi el mismo párrafo** (jaccard ~0.90) — residual más claro de clonación. Hints algo densos pero no pegan los cuatro returns.
- **Checklist:** context **pass** / goal **pass** / success **pass** (via solución) / constraints **pass** / retrospective **partial** (clona feedback)
- **Severity residual:** **P1**
- **Proposed retrospective (distinta del feedback):**  
  En el triage del ETL, “no es entero” te manda a limpiar el campo; “negativo no permitido” te manda a la regla de negocio. Si unificas ambos en un solo `False` opaco, el junior no sabe si reparsear o rechazar. Pregunta: ¿por qué `0` no debe caer en la rama de error?
- **Proposed feedback:** (mantener el actual — ya separa forma vs dominio)
- **Code/output changes:** none (mensajes de la solución canónicos)

### S05-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Diseño core/borde excelente. Preamble éxito vago (`SKIP malo ...`). Feedback y retro clonan “core estricto + borde tolerante” (jaccard ~0.76). Instruction ya pide el texto de estrategia de la solución — bien.
- **Checklist:** context **pass** / goal **pass** / success **partial** / constraints **pass** / retrospective **partial**
- **Severity residual:** **P1**
- **Proposed preamble (Éxito exacto):**  
  - **Contexto:** el normalizador de email del gate es estricto; el **lote** debe tolerar filas malas sin abortar todo.  
  - **Meta:** `raise` en el core + `try/except` por fila en el borde.  
  - **Éxito:** `estrategia: raise + try por fila en el borde`, luego `OK ok@ex.com` y `SKIP malo email inválido`.  
  - **Límites:** no pongas el `try` dentro del normalizador puro; no inventes PII.
- **Proposed retrospective:**  
  Tests del core no deben depender de “filas hermanas” ni de capturar stdout del lote. El error de una fila no borra el resto. Si metes el `try` dentro del pure core, conviertes un contrato estricto en un normalizador que traga basura en silencio.
- **Code/output changes:** none (texto de estrategia canónico)

### S05-T3-A-DEMO (iDo)
- **Diagnosis:** Orquestador delgado bien narrado. Preamble un poco corta (~47). `why` corto (~30). Retro OK (~41).
- **Checklist:** context **pass** / goal **pass** / success **pass** / constraints **partial** / retrospective **pass**
- **Severity residual:** **P2**
- **Proposed why:**  
  Cada pieza es pura y testeable sola. El orquestador solo compone: cambia una política en un helper y el dict de salida se actualiza sin copiar `strip`/`lower`/`title` en cinco sitios. Eso es lo que un revisor de CP-N1-B busca antes de aceptar el núcleo.
- **Code/output changes:** none

### S05-T3-A-E1 (weDo, guided)
- **Diagnosis:** Extracción bien acotada. Hint 1 casi es la solución (`return strip_collapse(raw).title()`) — en E1 es borderline OK. Feedback corto (~23). Feedback y retro se solapan en “piezas pequeñas”.
- **Checklist:** context **pass** / goal **pass** / success **pass** / constraints **pass** / retrospective **pass**
- **Severity residual:** **P2**
- **Proposed hints (E1 guiado, sin one-liner total):**  
  1. “`strip_collapse` hoy es identidad: debe colapsar espacios como en el I Do.”  
  2. “`normalize_nombre` no debe rehacer el colapso: llama al helper y luego aplica title.”
- **Code/output changes:** none

### S05-T3-A-E2 (weDo, independent)
- **Diagnosis:** Defect fuerte (orquestador no llama helpers). **Hint 1 pega el `return` del dict** — spoiling fuerte para independent. Resto de prosa bueno.
- **Checklist:** context **pass** / goal **pass** / success **pass** / constraints **pass** / retrospective **pass**
- **Severity residual:** **P1**
- **Proposed hints:**  
  1. “Los helpers ya saben de title y de `@`. ¿Qué debería hacer `normalize_contact` además de armar claves del dict?”  
  2. “Si dejas `email` crudo o solo `strip` en el orquestador, el gate miente aunque el print ‘se vea’.”
- **Code/output changes:** none

### S05-T3-A-E3 (weDo, transfer)
- **Diagnosis:** Monstruo a descomponer — E3 sólido. Feedback y retro repiten “PR se rechaza” (jaccard ~0.55). Hints de transfer OK (principio, no código).
- **Checklist:** context **pass** / goal **pass** / success **pass** / constraints **pass** / retrospective **partial** (solapa feedback)
- **Severity residual:** **P2**
- **Proposed retrospective:**  
  Misma salida, diseño distinto: eso es descomposición real. El You Do te pedirá el mismo patrón con **cuatro** campos; si el monstruo vuelve allí, no podrás testear políticas por separado ni reutilizarlas en S08/S10.
- **Code/output changes:** none

### S05-T3-B-DEMO (iDo)
- **Diagnosis:** Idempotencia clara en código y preamble. `why` y retro cortos pero alineados. Buena demo.
- **Checklist:** context **pass** / goal **pass** / success **pass** / constraints **pass** / retrospective **partial** (corta)
- **Severity residual:** **P2**
- **Proposed retrospective:**  
  Idempotencia es el test mínimo del gate: re-correr el ETL no debe “seguir transformando” un canónico. Si `f(f(x)) != f(x)`, el lote se degrada en silencio entre corridas. En We Do lo demostrarás con una línea `999000 True` — y verás que “estable” no basta si la política de dígitos falla.
- **Code/output changes:** none

### S05-T3-B-E1 (weDo, guided)
- **Diagnosis:** **Mejor residual de R1 ya incorporado:** el preamble avisa del engaño `999-000 True` (idempotente pero política incorrecta). Feedback y retro refuerzan ese punto sin ser clones exactos. Unidad fuerte.
- **Checklist:** context **pass** / goal **pass** / success **pass** / constraints **pass** / retrospective **pass**
- **Severity residual:** **ok**
- **Proposed changes:** none
- **Code/output changes:** none

### S05-T3-B-E2 (weDo, independent)
- **Diagnosis:** I/O al borde bien elegido. **Preamble la más corta de los We Do (~36)**: meta y límites OK, contexto un poco seco. Instruction telegráfica (~25). Hints OK (no spoilean el raise).
- **Checklist:** context **partial** / goal **pass** / success **pass** / constraints **pass** / retrospective **pass**
- **Severity residual:** **P2**
- **Proposed preamble:**  
  - **Contexto:** un `print` dentro del normalizador contamina tests y logs del ETL; el core de email del gate debe ser pure strip+lower con `@`.  
  - **Meta:** core puro + reporte solo en `print_report`.  
  - **Éxito:** línea exacta `email= z@w.com`.  
  - **Límites:** sin `print` en `normalize_email`; valida `@` con `raise`; no inventes PII.
- **Proposed instruction:**  
  1. Saca el `print` del core.  
  2. Añade validación de `@` con `ValueError` si falta.  
  3. `print_report` debe imprimir el valor **retornado** por el core.  
  4. Ejecuta el call del starter y compara con `email= z@w.com`.
- **Code/output changes:** none

### S05-T3-B-E3 (weDo, transfer)
- **Diagnosis:** Inyección clara; title corto (3 palabras). Hints buenos. Retro corta pero con transfer a orquestador delgado. OK.
- **Checklist:** context **pass** / goal **pass** / success **pass** / constraints **pass** / retrospective **pass**
- **Severity residual:** **P2**
- **Proposed title (opcional, 4–6 palabras):** Inyectar el normalizador en `process`
- **Code/output changes:** none

### S05-T4-A-DEMO (iDo)
- **Diagnosis:** Closure factory bien presentada. `why` y retro cortos (~32 / ~28). Nuevoie se queda con “cierra prefix” pero poco de LEGB explícito en el retro.
- **Checklist:** context **pass** / goal **pass** / success **pass** / constraints **pass** / retrospective **partial**
- **Severity residual:** **P2**
- **Proposed retrospective:**  
  La interna recuerda el enclosing sin ensuciar el namespace global: cada factory cierra su propio `prefix`. El error clásico es mutar un `PREF` global y que dos normalizadores se pisen. En We Do verás primero que una asignación local no pisa el global, y luego armarás factories PE/CL.
- **Code/output changes:** none

### S05-T4-A-E1 (weDo, guided)
- **Diagnosis:** LEGB local vs global con starter engañoso — excelente. Preamble e instruction claros. Retro corta (~23) y sin pregunta de cierre.
- **Checklist:** context **pass** / goal **pass** / success **pass** / constraints **pass** / retrospective **partial**
- **Severity residual:** **P2**
- **Proposed retrospective:**  
  Asignar dentro de `f` crea un local; el global no cambia sin `global`. LEGB no es trivia de examen: evita mutar configuración de política desde helpers y explica bugs “imposibles” en scripts de normalización. Pregunta: ¿qué imprimirías si movieras el `print('in', x)` fuera de `f` sin tocar el cuerpo?
- **Code/output changes:** none

### S05-T4-A-E2 (weDo, independent)
- **Diagnosis:** Factory PE/CL alineada al I Do. Hints conceptuales (closure) sin pegar `prefix + d` como única línea — aceptable. Instruction corta. Buena unidad.
- **Checklist:** context **pass** / goal **pass** / success **pass** / constraints **pass** / retrospective **pass**
- **Severity residual:** **ok** / **P2** menor
- **Proposed changes:** none obligatorios
- **Code/output changes:** none

### S05-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Factory multipolítica — buen transfer. Hints de principio. Feedback/retro se rozan en “config en enclosing”. OK.
- **Checklist:** context **pass** / goal **pass** / success **pass** / constraints **pass** / retrospective **pass**
- **Severity residual:** **P2**
- **Proposed retrospective (ligera diferenciación):**  
  Dos normalizadores pueden convivir en el mismo proceso sin un `mode` global mutable: cada factory cierra su política. Es el mismo espíritu de inyección de T3-B, con fábrica. Si mañana agregas `mode='title'`, no reescribes los callers: devuelves otra fn.
- **Code/output changes:** none

### S05-T4-B-DEMO (iDo)
- **Diagnosis:** Rojo-verde-refactor oro en código. Preamble y `why` buenos. Retro corta pero con puente a We Do.
- **Checklist:** context **pass** / goal **pass** / success **pass** / constraints **partial** / retrospective **partial**
- **Severity residual:** **P2**
- **Proposed retrospective:**  
  Refactor sin suite es fe en la suerte. Si el refactor cambiara upper por lower, los asserts deben gritar — ese grito es el contrato. En We Do escribirás asserts de email, repararás un “refactor” que rompe upper, y armarás una tabla de casos para nombre.
- **Code/output changes:** none

### S05-T4-B-E1 (weDo, guided)
- **Diagnosis:** “Ejemplos primero” claro. Hint 1 pega el assert completo — **aceptable en E1**. Starter imprime el email ( tentación de “pasar a ojo”); preamble y instruction empujan a asserts + `OK`. Buena unidad.
- **Checklist:** context **pass** / goal **pass** / success **pass** / constraints **pass** / retrospective **pass**
- **Severity residual:** **ok**
- **Proposed changes:** none
- **Code/output changes:** none

### S05-T4-B-E2 (weDo, independent)
- **Diagnosis:** Defect excelente (lower disfrazado de refactor). Feedback y retro **clonan** verde-refactor-verde / upper (jaccard ~0.66). Hints buenos (no pegan el helper). **Solución** re-asserta solo `AV 1` post-refactor (idempotencia del starter se pierde en el bloque final) — residual de código opcional de R1.
- **Checklist:** context **pass** / goal **pass** / success **pass** / constraints **pass** / retrospective **partial**
- **Severity residual:** **P1** (prosa clon) · **P2** (assert post-refactor opcional)
- **Proposed retrospective:**  
  Si el assert se pone rojo tras “embellecer”, o el refactor falló o cambiaste el contrato sin documentarlo. No “arregles” expected a lower: eso miente sobre el gate de dirección. El hábito es verde → extraer helper → verde otra vez.
- **Code/output changes (opcional):** tras redefinir `normalize_dir`, reinsertar  
  `assert normalize_dir(normalize_dir('x')) == normalize_dir('x')`  
  sin cambiar el `output` (`JR 2`).
- **Validation notes:** No alterar expected `AV 1` / print final.

### S05-T4-B-E3 (weDo, transfer)
- **Diagnosis:** Suite tabla — cierre fuerte. Instruction la más corta (~22): legible pero telegráfica. Hints de transfer buenos. Feedback/retro se rozan en “mentir sobre el gate”. Output con espacios en `PASS   a  b  ` es frágil — no “limpiar”.
- **Checklist:** context **pass** / goal **pass** / success **pass** / constraints **pass** / retrospective **pass**
- **Severity residual:** **P2**
- **Proposed instruction:**  
  1. El starter imprime `all PASS` sin recorrer `cases`.  
  2. Haz `for inp, exp in cases`.  
  3. Calcula el got, `assert` igualdad, e imprime `PASS` con flecha (mismo formato que la solución).  
  4. Cierra con `all PASS` solo si todos los asserts pasaron.
- **Code/output changes:** none (preservar espacios del output)

### youDo — Normalizadores puros (inicio CP-N1-B)
- **Diagnosis:** Marco de proyecto sólido (`context`, objectives, requirements, rubric, starter con `_run_tests`). Retrospective de defensa (~75 p.) cumple el espíritu del exemplar §8.3. Clave `nombres` en `normalize_record` sigue alineada al starter (no “corregir” en esta campaña). Sin campos faltantes.
- **Checklist:** context **pass** / goal **pass** / success **pass** / constraints **pass** / retrospective **pass**
- **Severity residual:** **ok** / **P2** opcional
- **Proposed preamble:** N/A — `context` cumple.  
  Opcional en `portfolioNote`: pedir una frase de idempotencia pegada por cada normalizador (ya implícito en objectives).
- **Proposed retrospective:** (mantener)  
  Antes de marcar listo: (1) ¿qué assert demuestra idempotencia en **cada** normalizador, no solo en uno? (2) ¿dónde vivirían los `print` y la lectura de archivos si esto pasara a S08 — y por qué **no** están en el core hoy? (3) Escribe en el README una frase de impacto medible (p. ej. “cuatro políticas de CP-N1-B testeables sin abrir CSV”) que puedas defender en 30 segundos. Revisa también que el orquestador no reimplemente reglas.
- **Code/output changes:** none

---

## Priority order (Round 2 Fixer)

### P1 — hacer primero (calidad / fade / no-clon)
1. **Desclonar feedback ↔ retrospective** (reescritura de retro, no borrar feedback):  
   **T2-A-E1**, **T2-A-E3**, **T2-B-E2**, **T2-B-E3**, **T4-B-E2** (y de paso **T3-A-E3** si hay tiempo).  
2. **Suavizar hints spoiling en E2 (e independent):**  
   **T1-A-E2**, **T1-B-E2**, **T2-A-E2**, **T3-A-E2**.  
3. **Éxito exacto en preamble:**  
   **T2-A-E2** (`err email sin @`), **T2-B-E3** (tres líneas de estrategia/OK/SKIP canónicas).

### P2 — pulido de longitud y claridad
1. **I Do** con retro/`why` bajo el piso: T1-B, T2-A, T2-B, T3-A (`why`), T3-B, T4-A, T4-B — ampliar 1–3 frases sin ensayo.  
2. **We Do** instructions telegráficas donde se propuso texto: T1-A-E1, T1-B-E1, T3-B-E2, T4-B-E3.  
3. **T3-B-E2** preamble más completa; **T3-B-E3** title opcional.  
4. **T3-A-E1** hints menos one-liner.  
5. **T4-B-E2** opcional: re-assert de idempotencia post-refactor (sin cambiar output).  
6. Unificar tono: retrospective = principio + misconception + transfer (+ self-check); feedback = síntoma + porqué del fallo del starter.

### ok — no tocar prosa
T1-A-DEMO, T1-A-E3 (salvo micro-diff retro), T1-B-E3, T2-B-E1, T3-B-E1, T4-A-E2, T4-B-E1, **youDo**.

### Código / outputs
- **No** cambiar outputs canónicos ni mensajes de dominio de las soluciones.  
- Único cambio de código opcional: assert de idempotencia extra en T4-B-E2.

---

## Residual risks

1. **Piso de palabras vs bullets:** muchos preambles We Do en 4 viñetas tienen 40–55 palabras totales; el spec permite “4 short bullets”, así que **no** se marca fail por conteo global si las 4 casillas (contexto/meta/éxito/límites) están. El riesgo es **retro** y **why** en prosa corrida bajo 40.  
2. **Hints E1:** se permiten más directos; el Fixer no debe “suavizar” E1 hasta dejarlo opaco. Solo E2/E3.  
3. **Clones feedback/retro:** si el Fixer solo alarga el retro copiando el feedback, el jaccard sube. Reescribir con ángulo distinto (self-check, transfer, misconception).  
4. **Outputs frágiles:** `hint no valida en runtime`, formato `PASS` con espacios, `estrategia: raise + try por fila en el borde`, mensajes `err` / `email sin @`. No “mejorar” copy de salida.  
5. **Nombre de archivo `s05-oop.ts` / id `oop`:** sigue confuso para revisores externos; fuera de alcance de esta campaña de prosa.  
6. **Clave `nombres` en You Do:** coherente con starter; no renombrar.  
7. **Sin re-ejecución Pyodide en R2:** se asume `solutionCode.output` del fuente como verdad operativa.  
8. **Carga de 24 We Do:** al alargar retros, respetar techo ~80 palabras; no apilar ensayo encima de preamble + instruction.

---

## Summary scores (Round 2)

| Tipo | Unidades | Campos presentes | Calidad dominante residual | Severidad |
|------|----------|------------------|----------------------------|-----------|
| iDo  | 8        | preamble+retro en 8/8 | retros/`why` a menudo bajo piso | P2 |
| weDo | 24       | title+preamble+retro en 24/24 | clones fb/retro; hints E2; 2 éxitos vagos | P1/P2 |
| youDo| 1        | retrospective presente | defensa sólida | ok |

| Dimensión newbie | R1 | R2 actual |
|------------------|----|-----------|
| ¿Qué practico? | débil | **fuerte** (preambles) |
| ¿Por qué importa? | débil | **fuerte** (contexto intake/gate) |
| ¿Cómo sé que gané? | parcial (tests) | **fuerte** (éxito en preamble; 2 a afinar) |
| ¿Qué debe quedarme? | ausente | **presente**; a menudo corto o clon del feedback |

**Conclusión:** Round-1 Fix **cumplió** el checklist de aceptación de campos. Round-2 **no** es un sello automático: el residual es real pero acotado. Priorizar desclonar retrospectives, suavizar hints E2 y fijar dos éxitos exactos; el resto es calibrar longitudes al spec.

---

*Round 2 — hand review of current source only. No source edits. No bulk generation. No rubber-stamp of Round 1.*

Section 5 exercise pedagogy review complete. Ready for the Fixer prompt.
