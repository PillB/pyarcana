# S23 Exercise Pedagogy Report (Round 1)

## Section
- **title:** Browser RPA con Playwright
- **shortTitle:** Playwright RPA
- **id:** `computer-vision` (archivo `s23-computer-vision.ts`; contenido = browser RPA / Playwright mental model, no visión por computador clásica)
- **index:** 23
- **source:** `src/lib/course/sections/s23-computer-vision.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades de práctica/demo)
- **subtemas:** S23-T1-A locators · T1-B auto-wait/assertions · T2-A forms/download/sesión · T2-B Page Objects/auth · T3-A trace/evidencia · T3-B retries/recovery/checkpoint · T4-A API-first · T4-B CAPTCHA/ToS/handoff
- **hilo de caso:** CASO-LIM-023 / incremento **CP-N2-C** (adaptador web tras borrador S22; puente a OCR S24 sobre el binario descargado)

## Method
- Leído `PEDAGOGY_EXERCISE_SPEC.md` (campos, longitudes, checklist preamble/retrospective, fade E1→E2→E3).
- Inspeccionado manualmente cada `iDo.steps[]` (8 demos ~386–600), `weDo.steps[]` (24 ejercicios ~607–1513) y `youDo` (~1516–1610) en `s23-computer-vision.ts`.
- Contrastado con el hilo de la sección: portal demo sintético (dicts equivalentes a Playwright), locators por rol, auto-wait, download+hash, Page Object sandbox `demo`/`sandbox`, paquete de evidencia, retries selectivos, cascada api>export>rpa, handoff/abort ético.
- **Sin** generadores, bucles, plantillas ni copy-paste mecánico entre unidades.
- Prosa propuesta en **español profesional peruano**, un objetivo primario por unidad.

## Hallazgos transversales (antes del ledger)

| Campo / hábito | Estado actual en S23 |
|----------------|----------------------|
| I Do `preamble` | **Ausente** en las 8 demos |
| I Do `retrospective` | **Ausente** en las 8 demos |
| I Do `description` | Presente y clara (qué hace el demo); no sustituye preamble formal |
| I Do `why` | Presente pero **corto** (1–2 frases; bajo el piso 40–90 palabras del spec) |
| We Do `title` | **Ausente** en los 24 (solo prefijo “CASO-LIM-023 · …” dentro de `instruction`) |
| We Do `preamble` | **Ausente** en los 24 |
| We Do `retrospective` | **Ausente** en los 24 |
| We Do `instruction` | Estilo “**CASO-LIM-023 · Concepto. Fixture… Salida esperada:**”: meta + éxito + a veces contexto mezclados; legible para quien ya hace RPA, **opaco** para newbie sin escena de negocio |
| We Do `feedback` | Una línea; nombra el bug o el output, poco *razonamiento* de por qué el hábito importa en CP-N2-C |
| Starter `# Arregla:` | **Excelente** hábito en casi todos; defectos bien nombrados y alineados a la solución |
| Hints | Útiles; E1 casi-solución (aceptable); E3 a veces spoiling suave (aceptable como andamiaje mínimo) |
| You Do marco | `context` / `objectives` / `requirements` / `rubric` / `portfolioNote` / starter **sólidos** |
| You Do `retrospective` | **Ausente** |
| Código / outputs | Coherentes con theory y hilo sintético; **no** proponer cambios de output salvo notas puntuales |

**Patrón dominante:** el andamiaje de *código* (DOM en dicts, bugs nombrados, outputs canónicos, fade real E1→E3 por subtema, ética CAPTCHA/ToS) es maduro y alineado a CP-N2-C. El andamiaje *pedagógico verbal* (preamble → instruction solo-tarea → retrospective) no existe. Un true newbie no responde con claridad: qué practico, por qué importa en un adaptador web de backoffice sintético, cómo sé que gané, qué debe quedarme al cerrar la pestaña.

**Fade E1→E2→E3 (contenido):** progresión real por subtema (p. ej. T1-A: role+name → prioridad role/testid/css → need_testid sin control; T3-B: should_retry → recover stale → next_step por checkpoint; T4-A: api gana → export cae → decide con reason). **No** son tres clones con números distintos. El fade de *prosa* no se ve porque no hay preambles diferenciados.

**Severity default:** missing preamble+title+retrospective en We Do = **P0**; I Do sin preamble/retrospective = **P1** (aún tienen description+why+código); youDo sin retrospective = **P1**; polish de feedback/why = **P2** si caen preamble/instruction/retrospective.

---

## Unit ledger

### S23-T1-A-DEMO (iDo)
- **Diagnosis:** Demo sólida de locator por role+name sobre dos botones (Enviar/Cancelar). La `description` nombra el skill; falta `preamble` que diga *qué observar* (el nombre accesible, no el índice) y `retrospective` del misconception “el CSS es más preciso”. El `why` es una frase densa.
- **Checklist:** context fail · goal partial · success partial (output visible) · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Antes de automatizar el export del portal demo de CP-N2-C, el robot debe *ver* el control como lo ve un usuario (y el árbol de accesibilidad). En esta demo un DOM sintético tiene dos botones; resolvemos “Enviar” por `role` + `name`, no por posición. No escribas aún: predice qué fallaría si el layout reordena los botones y el robot usara `nth-child`. Observa la salida y el flag `locators role_first`.
- **Proposed instruction/description improvements:**  
  Mantener description. Ampliar `why` (~50–70 palabras): el usuario y ARIA ven el nombre, no la jerarquía CSS; si el layout cambia y el rol se mantiene, el robot sigue estable (a11y = estabilidad); `LookupError` ruidoso es preferible a clic ciego; puente a We Do donde se corrigen predicados invertidos y prioridades.
- **Proposed retrospective:**  
  Si puedes explicar por qué “Enviar” por role+name sobrevive un reorden de columnas y un CSS frágil no, ya tienes el hábito de locator de usuario. El error clásico es clicar el primer `button` del DOM. En We Do practicarás role correcto, orden de estrategias y fail-closed sin control usable.
- **Code/output changes:** none
- **Validation notes:** Output canónico alineado a theory T1-A.

---

### S23-T1-A-E1 (weDo, guided)
- **Diagnosis:** Drill guiado claro: starter busca `button` en vez de `link` Inicio. Instruction nombra fixture y éxito pero mezcla meta/pasos; sin title, preamble ni retrospective. Feedback de una línea no repara “¿por qué el rol importa en el portal demo?”.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Localizar link Inicio por role+name
- **Proposed preamble:**  
  - **Contexto:** en el portal sintético CASO-LIM-023 el menú expone un link “Inicio” (id `n1`); un CSS por índice rompe al rediseñar la barra.  
  - **Meta:** practicar el predicado de locator de usuario: role + name exactos.  
  - **Éxito:** imprimes una sola línea `n1`.  
  - **Límites:** no uses CSS ni el primer nodo a ciegas; si no hay match, el fallo ruidoso es correcto (no inventes un id).
- **Proposed instruction/description improvements:**  
  1. Abre el starter: el predicado busca `role=='button'` (bug nombrado).  
  2. Cambia a `role=='link'` y `name=='Inicio'`.  
  3. Imprime solo el `id` del match.  
  4. Sin prints extra ni el dict completo.
- **Proposed feedback improvement:**  
  El link “Inicio” se resuelve por rol accesible, no por “el primer botón del header”. Si el predicado pide button, `next` no encuentra y devuelves None o fallas: en producción eso es un setup roto, no un clic al logo.
- **Proposed retrospective:**  
  Role + name es el contrato mínimo de un locator estable. El error clásico es copiar el selector del DevTools (CSS frágil). Siguiente (E2): ordenar la política role → testid → css cuando hay varias estrategias.
- **Code/output changes:** none
- **Validation notes:** DEFECT bien nombrado; solution y output `n1` correctos.

---

### S23-T1-A-E2 (weDo, independent)
- **Diagnosis:** Buen foco independiente: `sorted(strats)` alfabético vs. política role/testid/css. Instruction densa; falta anclar por qué la política no es “lo que suene bonito” sino estabilidad + a11y. Sin preamble/title/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Priorizar role, testid y CSS
- **Proposed preamble:**  
  - **Contexto:** el equipo de UI del portal demo a veces deja solo testid o CSS; el adaptador necesita un orden de intento, no el orden alfabético del string.  
  - **Meta:** ordenar estrategias con `order` (role primero, css al final).  
  - **Éxito:** `['role', 'testid', 'css']` exacto.  
  - **Límites:** no uses `sorted(strats)` sin `key`; no reordenes a mano el literal.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: `sorted(strats)` sin key (bug).  
  2. Usa `key=lambda s: order[s]`.  
  3. Imprime la lista resultante.  
  4. No alteres el dict `order`.
- **Proposed retrospective:**  
  La política role → testid → css codifica “accesible primero, contrato de producto después, CSS como último recurso”. Confundir orden alfabético con prioridad de negocio produce robots frágiles. Luego (E3) fallas cerrado cuando no hay control usable.
- **Code/output changes:** none
- **Validation notes:** E2 con menos migas que E1; éxito observable intacto.

---

### S23-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transferencia real: logo `img` no es control de negocio → `need_testid`. Instruction ya lista el contrato; falta escena de coordinación con frontend y cierre metacognitivo. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Fallar si no hay control usable
- **Proposed preamble:**  
  - **Contexto:** en setup del robot, un logo decorativo no sustituye al botón “Descargar reporte”; clicar el primer nodo contamina el run de CP-N2-C.  
  - **Meta:** fallar cerrado: si no hay `button`, imprimir `need_testid` (señal para el equipo de UI).  
  - **Éxito:** una línea `need_testid`.  
  - **Límites:** no imprimas el name del `img`; no asumas `nodes[0]`.
- **Proposed instruction/description improvements:**  
  1. Filtra `hits` por `role=='button'` (el starter ya lo prepara).  
  2. Si `hits` vacío → imprime `need_testid`; si no, el name del button.  
  3. Deja de imprimir `nodes[0]['name']`.  
  4. Sin inventar un botón fake en el DOM.
- **Proposed retrospective:**  
  Fail-closed en setup es más barato que un download silencioso del archivo equivocado. El error clásico es “algo clicó, debe estar bien”. Pregunta de cierre: ¿qué pedirías al frontend si solo hay CSS frágil?
- **Code/output changes:** none
- **Validation notes:** Transfer auténtico; alineado a theory T1-A (need_testid).

---

### S23-T1-B-DEMO (iDo)
- **Diagnosis:** Worked example claro de sondeo hasta `ready_at=3`. Description OK; falta preamble que motive “condición vs. sleep de 5 s” y retrospective del misconception “más sleep = más estable”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El portal demo a veces tarda en habilitar el botón de export. En esta demo un reloj simulado solo está listo en el intento 3: el robot espera una **condición**, no un `sleep` fijo. No escribas: predice qué valor de `visible` sale y por qué un sleep de 5 s fallaría en CI lento y desperdiciaría tiempo en CI rápido. Datos sintéticos, sin browser real.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: auto-wait de Playwright espera usabilidad del control; sleep fijo es raíz de flakes; el lab modela el mismo contrato con un contador de intentos; puente a We Do (imprimir i al ready, timeout, assertion combinada).
- **Proposed retrospective:**  
  Si puedes explicar por qué devolver el intento en que se cumplió la condición (no la última i del for) importa, ya tienes el hábito de wait por postcondición. We Do: break al ready, for-else timeout y assert de título + botones.
- **Code/output changes:** none

---

### S23-T1-B-E1 (weDo, guided)
- **Diagnosis:** Bug clásico bien diseñado: `pass` en el if y `print(i)` fuera → última i del for. Instruction telegráfica; no ancla el hábito al auto-wait de Playwright. Sin preamble/title/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Imprimir el intento cuando ready
- **Proposed preamble:**  
  - **Contexto:** en el adaptador, “el control ya es usable” es la señal de seguir; imprimir la última i del bucle miente sobre cuándo se volvió ready.  
  - **Meta:** al primer `ready`, imprimir `i` y salir del loop.  
  - **Éxito:** una línea `2`.  
  - **Límites:** no uses `time.sleep`; no imprimas todas las i.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: dentro del `if ready` solo hay `pass` y el print está fuera.  
  2. Dentro del if: `print(i)` y `break`.  
  3. Quita el `print(i)` final.  
  4. No cambies el rango ni la condición `i >= 2`.
- **Proposed feedback improvement:**  
  El primer ready es el intento 2. Si imprimes la última i del for, reportas “listo” en el 3 aunque la condición se cumplió antes: en CI eso parece un wait distinto al real.
- **Proposed retrospective:**  
  Esperar una condición y cortar al cumplirse es el esqueleto del auto-wait. El error clásico es sleep fijo o imprimir el índice final. Siguiente (E2): qué hacer cuando ready nunca llega.
- **Code/output changes:** none
- **Validation notes:** DEFECT `# Arregla:` claro; output `2`.

---

### S23-T1-B-E2 (weDo, independent)
- **Diagnosis:** for-else con `print('ok')` en el else (anti-patrón). Instruction nombra timeout; falta escena de “no reintentar infinito” y por qué `timeout` es un resultado de negocio, no un crash opaco. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Timeout si nunca hay ready
- **Proposed preamble:**  
  - **Contexto:** si el botón de export no aparece, el robot debe fallar con `timeout` y adjuntar evidencia (T3), no fingir `ok`.  
  - **Meta:** con `ready=False` fijo, tras 3 intentos imprimir `timeout`.  
  - **Éxito:** una línea `timeout`.  
  - **Límites:** no imprimas `ok`; no uses un while infinito.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: el `else` del for imprime `ok` (bug).  
  2. Cámbialo a `print('timeout')`.  
  3. Deja el cuerpo del if listo por si ready fuera True.  
  4. Sin alterar `ready = False`.
- **Proposed retrospective:**  
  Timeout es una postcondición legítima del wait: documenta que el portal no cumplió el contrato a tiempo. El error clásico es “al final del for siempre ok”. Luego (E3) combinas título y controles en una assertion web-first.
- **Code/output changes:** none
- **Validation notes:** for-else didáctico; output exacto.

---

### S23-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Transferencia a `assert_ready` con predicado combinado (título + buttons≥1). Starter solo mira title. Instruction ya da dos páginas y salida de dos líneas; falta preamble de “postcondición completa” y retrospective. Sin title.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Assert de portal listo (título y botones)
- **Proposed preamble:**  
  - **Contexto:** antes de descargar el CSV sintético, el adaptador debe afirmar que el portal demo está listo: título correcto **y** al menos un control usable.  
  - **Meta:** implementar `assert_ready(page)` con predicado combinado.  
  - **Éxito:** dos líneas `pass` luego `fail` (página buena vs. vacía con buttons=0).  
  - **Límites:** no hardcodees `pass` siempre; no ignores `buttons`.
- **Proposed instruction/description improvements:**  
  1. Completa `assert_ready`: título == `'Portal demo'` **y** `buttons >= 1`.  
  2. Mantén las dos llamadas (good / empty).  
  3. Imprime solo el resultado de cada una.  
  4. Función reutilizable, no un if suelto en el main.
- **Proposed retrospective:**  
  Una assertion web-first documenta la postcondición del paso de negocio, no un solo campo. El error clásico es “el título dice Portal demo, basta”. Pregunta de cierre: ¿qué otra señal de readiness pedirías en un reporte real (fila de tabla, download started)?
- **Code/output changes:** none
- **Validation notes:** Transfer auténtico; alineado a theory T1-B.

---

### S23-T2-A-DEMO (iDo)
- **Diagnosis:** Demo de fill de periodo + sha256 truncado. Description y why buenos en espíritu; falta preamble “éxito = archivo correcto” y retrospective del misconception “si el clic no falló, el step OK”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El adaptador de CP-N2-C no termina cuando el botón deja de lanzar excepción: termina cuando el **binario** del reporte es el esperado. Esta demo rellena un form de periodo y calcula un sha256 truncado de `b"data"`. No escribas: mira el dict filled y el `sha`; en el lab el checksum mismatch debe fallar con evidencia, no con éxito silencioso.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: fill de campos de negocio; download modelado como bytes; hash o tamaño como postcondición; puente a S24 (OCR sobre el archivo verificado).
- **Proposed retrospective:**  
  Si puedes decir en una frase “el step OK es el archivo correcto, no el clic”, ya tienes el contrato de integridad. We Do: fill completo, SHA-256 (no MD5) y reuso de sesión.
- **Code/output changes:** none

---

### S23-T2-A-E1 (weDo, guided)
- **Diagnosis:** Starter rellena solo usuario; periodo comentado. Instruction ya menciona S24 y ambos campos — de las más ricas del set — pero sigue sin title/preamble/retrospective formales; mezcla contexto en la instruction.
- **Checklist:** context partial · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Completar form usuario y periodo
- **Proposed preamble:**  
  - **Contexto:** el export del portal demo exige usuario **y** periodo (`2026-01`); sin fecha, el binario que llega a S24 (OCR) no es usable para el mes del reporte.  
  - **Meta:** mutar el dict form campo a campo (análogo a fill de Playwright).  
  - **Éxito:** `{'usuario': 'ana', 'periodo': '2026-01'}`.  
  - **Límites:** no hardcodees el dict en el print; no dejes periodo comentado.
- **Proposed instruction/description improvements:**  
  1. Descomenta o escribe `form['periodo'] = '2026-01'`.  
  2. Mantén `form['usuario'] = 'ana'`.  
  3. Imprime `form` al final.  
  4. Corrige solo el defecto marcado.
- **Proposed retrospective:**  
  Un fill incompleto es un bug de contrato de negocio, no “casi listo”. El error clásico es autenticar y olvidar el periodo del reporte. Siguiente (E2): verificar el binario con hash correcto.
- **Code/output changes:** none
- **Validation notes:** Instruction actual ya es fuerte; el Fixer debe *mover* contexto a preamble y dejar steps solo-tarea.

---

### S23-T2-A-E2 (weDo, independent)
- **Diagnosis:** MD5 vs SHA-256 bien diseñado. Instruction corta de terminal drill; falta anclar por qué el algoritmo del contrato importa para auditoría del download. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Hash SHA-256 del download
- **Proposed preamble:**  
  - **Contexto:** en CP-N2-C el runbook fija SHA-256 (truncado a 8 en el lab) para comparar el archivo del portal demo; MD5 no es el contrato del grader ni el hábito del curso.  
  - **Meta:** calcular digest de `b'data'` con sha256 y truncar a 8 hex.  
  - **Éxito:** `3a6eb079`.  
  - **Límites:** no uses `md5`; no imprimas el digest completo.
- **Proposed instruction/description improvements:**  
  1. Cambia `hashlib.md5` por `hashlib.sha256`.  
  2. Mantén `.hexdigest()[:8]`.  
  3. Imprime solo ese string.  
  4. No alteres el blob de prueba.
- **Proposed retrospective:**  
  El hash cierra el step de download: evidencia reproducible del binario. El error clásico es “el clic funcionó”. Luego (E3) reusas sesión con storage_state conceptual en vez de re-loguear siempre.
- **Code/output changes:** none
- **Validation notes:** Output canónico compartido con demo T2-A.

---

### S23-T2-A-E3 (weDo, transfer)
- **Diagnosis:** `session_mode` con token → reuse / sin token → login. Transfer claro; instruction ya nombra storage_state. Falta preamble de costo de re-login y retrospective. Sin title.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Reusar sesión o forzar login
- **Proposed preamble:**  
  - **Contexto:** re-loguear en cada caso multiplica flakes y tiempo de suite; Playwright guarda `storage_state` para reusar cookies entre corridas.  
  - **Meta:** implementar `session_mode(state)`: con token → `reuse`, sin token → `login`.  
  - **Éxito:** dos líneas `reuse` luego `login`.  
  - **Límites:** no siempre `login`; no hardcodees el resultado de las dos llamadas.
- **Proposed instruction/description improvements:**  
  1. Completa el cuerpo de `session_mode` (starter siempre devuelve login).  
  2. Usa `state.get('token')` para decidir.  
  3. Mantén los dos `print` de prueba.  
  4. Función reutilizable sobre el dict.
- **Proposed retrospective:**  
  Reuso de sesión es setup de auth, no test de negocio: separa “tengo cookie válida” de “exporto el reporte”. El error clásico es login en cada test. Pregunta de cierre: ¿qué harías si el token expiró a mitad de suite?
- **Code/output changes:** none
- **Validation notes:** Transfer alineado a theory T2-A storage_state.

---

### S23-T2-B-DEMO (iDo)
- **Diagnosis:** Page Object mínimo `Login().go(ctx)` setea auth. Description OK; falta preamble de “estado en ctx, acción en el PO” y retrospective del misconception “auth en self del robot global”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Cuando el label del botón Login cambia, no quieres reescribir veinte tests de reporte. Esta demo encapsula el login en un Page Object que muta el **contexto** de sesión. No escribas: observa que `auth` vive en `ctx`, no como atributo suelto del robot. Mismo patrón que mapearás a `LoginPage.submit` en local con Playwright.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: PO reduce acoplamiento; un cambio de selector toca un método; estado de sesión en ctx/storage_state; puente a We Do (submit sandbox, guard denied, transición de estados).
- **Proposed retrospective:**  
  Si el estado vive en el contexto y la acción en el PO, la suite de negocio no copia fill de usuario. We Do: autenticar con password sandbox, denegar sin sesión y modelar anonymous → authenticated.
- **Code/output changes:** none

---

### S23-T2-B-E1 (weDo, guided)
- **Diagnosis:** `submit` con `pass` no setea `ctx['auth']`. Instruction clara; falta title/preamble/retrospective y anclar sandbox (nunca secretos reales de bancos/SUNAT).
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** LoginPage.setea auth en el contexto
- **Proposed preamble:**  
  - **Contexto:** el sandbox de CP-N2-C autentica solo con password `sandbox` (credencial demo, no banco ni SUNAT).  
  - **Meta:** en `LoginPage.submit`, setear `ctx['auth'] = (password == 'sandbox')`.  
  - **Éxito:** imprime `True` tras submit con sandbox.  
  - **Límites:** no hardcodees secretos reales; el estado va en `ctx`, no en `self.auth`.
- **Proposed instruction/description improvements:**  
  1. Dentro de `submit`, asigna `ctx['auth']` con la comparación de password.  
  2. No cambies la firma ni el print final.  
  3. Llama ya existente con `'sandbox'`.  
  4. Corrige solo el cuerpo del método.
- **Proposed feedback improvement:**  
  El PO encapsula la acción; el print solo lee `ctx['auth']`. Si dejas `pass`, el contexto queda vacío y el test de reporte creería que no hay sesión.
- **Proposed retrospective:**  
  Auth en el contexto permite reusar el mismo PO en varios tests sin copiar selectores. El error clásico es mutar un atributo global del robot. Siguiente (E2): denegar el reporte si no hay sesión.
- **Code/output changes:** none
- **Validation notes:** Credencial sandbox alineada a theory.

---

### S23-T2-B-E2 (weDo, independent)
- **Diagnosis:** Starter lanza PermissionError sin capturar. Instruction nombra denied; falta escena de “no seguir ciego al download”. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Denegar reporte sin autenticación
- **Proposed preamble:**  
  - **Contexto:** sin sesión, el adaptador no debe continuar al download del reporte sintético; el guard es parte del contrato, no un detalle de UI.  
  - **Meta:** capturar `PermissionError` e imprimir `denied`.  
  - **Éxito:** una línea `denied`.  
  - **Límites:** no dejes la excepción sin capturar; no imprimas `ok` sin auth.
- **Proposed instruction/description improvements:**  
  1. Envuelve el `if not auth` / raise en `try/except PermissionError`.  
  2. En el except: `print('denied')`.  
  3. El path con auth imprimiría `ok` (fuera de este fixture).  
  4. No cambies `ctx={'auth':False}`.
- **Proposed retrospective:**  
  Guard de auth convierte un error técnico en decisión de negocio legible para el runbook. El error clásico es seguir al export y fallar más tarde con un timeout opaco. Luego (E3) modelas la transición de estados anonymous/authenticated.
- **Code/output changes:** none
- **Validation notes:** try/except didáctico; output `denied`.

---

### S23-T2-B-E3 (weDo, transfer)
- **Diagnosis:** `apply_login` siempre devuelve authenticated. Transfer de máquina de estados mínima. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Transición anonymous a authenticated
- **Proposed preamble:**  
  - **Contexto:** los estados de página guían qué acciones son legales en el adaptador; un login fallido no debe fingir sesión.  
  - **Meta:** `apply_login(state, login_ok)` avanza solo si `login_ok` y state es `anonymous`.  
  - **Éxito:** `authenticated` luego `anonymous` (True / False).  
  - **Límites:** no siempre `authenticated`; no inventes estado MFA aquí.
- **Proposed instruction/description improvements:**  
  1. Si `login_ok` y `state == 'anonymous'` → devuelve `'authenticated'`.  
  2. Si no, devuelve el `state` original.  
  3. Mantén los dos prints.  
  4. Función pura y reutilizable.
- **Proposed retrospective:**  
  La transición honesta evita “auth fantasma” que deja pasar el guard del reporte. El error clásico es setear authenticated en cualquier submit. Pregunta de cierre: ¿dónde pondrías `mfa_pending` en un sistema real?
- **Code/output changes:** none
- **Validation notes:** Transfer alineado a theory T2-B estados.

---

### S23-T3-A-DEMO (iDo)
- **Diagnosis:** Paquete de falla con keys estables. Description y why (on-call Lima) buenos; falta preamble formal y retrospective del misconception “un print del error basta”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Cuando el export del portal demo hace timeout a las 2 a.m., el on-call en Lima necesita un paquete actuable: step, path de trace, screenshot y error tipado. Esta demo construye ese dict y lista las keys ordenadas. No escribas: predice por qué las keys estables importan más que el texto libre del error para diffs de CI.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: trío mínimo trace+shot+error; keys para forma estable; sin PII en screenshots; puente a We Do (keys vs values, filtro ERR, adjuntar trace solo en falla).
- **Proposed retrospective:**  
  Evidencia reproducible es parte del adaptador, no un extra de “cuando haya tiempo”. We Do: forma del paquete, señal en logs y path determinista por step.
- **Code/output changes:** none

---

### S23-T3-A-E1 (weDo, guided)
- **Diagnosis:** Starter imprime values ordenados en vez de keys. Drill de forma del paquete; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Keys del paquete de evidencia
- **Proposed preamble:**  
  - **Contexto:** en CI se compara la **forma** del paquete de falla (keys), no el texto volátil del error de cada corrida.  
  - **Meta:** imprimir `sorted(ev.keys())`.  
  - **Éxito:** `['error', 'screenshot', 'trace']`.  
  - **Límites:** no imprimas values ni paths sueltos.
- **Proposed instruction/description improvements:**  
  1. Cambia `sorted(ev.values())` por `sorted(ev.keys())`.  
  2. Deja el dict `ev` intacto.  
  3. Un solo print.  
  4. Corrige solo el defecto marcado.
- **Proposed retrospective:**  
  Keys ordenadas hacen el contrato del grader y del runbook determinista. El error clásico es dump completo de values con paths que cambian. Siguiente (E2): filtrar el ruido de logs para ver ERR.
- **Code/output changes:** none
- **Validation notes:** Output exacto de lista de keys.

---

### S23-T3-A-E2 (weDo, independent)
- **Diagnosis:** Filtro de console por `'ERR' in l`. Instruction de drill; falta anclar al on-call y al noise de info. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Filtrar logs con ERR
- **Proposed preamble:**  
  - **Contexto:** el stream de info/nav ok oculta el timeout del botón; el on-call necesita solo las líneas de error.  
  - **Meta:** filtrar `logs` a las que contienen `ERR`.  
  - **Éxito:** `['ERR timeout']`.  
  - **Límites:** no imprimas la lista completa; no mutes el original si no hace falta.
- **Proposed instruction/description improvements:**  
  1. Reemplaza `print(logs)` por una list comp con `'ERR' in l`.  
  2. Mantén el array de entrada.  
  3. Un solo print del resultado.  
  4. Sin regex obligatoria.
- **Proposed retrospective:**  
  Filtrar señal de error es el primer paso antes de abrir el Trace Viewer. El error clásico es pegar el log entero en el ticket. Luego (E3) adjuntas path de trace solo cuando ok es False.
- **Code/output changes:** none
- **Validation notes:** List comp simple; output exacto.

---

### S23-T3-A-E3 (weDo, transfer)
- **Diagnosis:** Adjuntar `trace` cuando `ok=False`. Starter no muta pkg. Transfer de política de disco. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Adjuntar trace solo en falla
- **Proposed preamble:**  
  - **Contexto:** en falla del step `s1` el adaptador debe adjuntar un path determinista `traces/s1.zip`; en éxito no se llena el disco por defecto.  
  - **Meta:** si `not ok`, setear `pkg['trace']` e imprimir el dict.  
  - **Éxito:** `{'step': 's1', 'trace': 'traces/s1.zip'}`.  
  - **Límites:** no adjuntes trace con ok True en este ejercicio; path fijo por step.
- **Proposed instruction/description improvements:**  
  1. Tras crear `pkg`, si `not ok` asigna el path de trace.  
  2. Luego imprime `pkg`.  
  3. No cambies `ok=False` ni el step.  
  4. Path exacto del contrato.
- **Proposed retrospective:**  
  Trace en falla + path determinista = evidencia actuable y CI predecible. El error clásico es solo un print del error. Pregunta de cierre: ¿cuántos días retendrías traces en el runner del lab?
- **Code/output changes:** none
- **Validation notes:** Transfer alineado a demo T3-A y theory.

---

### S23-T3-B-DEMO (iDo)
- **Diagnosis:** Retry selectivo: timeout→ok, captcha→human_handoff. Why ético fuerte; falta preamble y retrospective formales.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  No todos los errores merecen un reintento. Esta demo recorre kinds: un timeout se reintenta y llega a ok en el intento 2; un captcha va directo a `human_handoff`. No escribas: predice qué sale en cada `print` y por qué un loop infinito ante captcha es a la vez flaky y antiético.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: retries solo transitorios; CAPTCHA es stop condition del contrato del adapter; handoff no es fracaso de carrera, es política; puente a We Do (should_retry, recover stale, checkpoint).
- **Proposed retrospective:**  
  Si puedes separar “timeout reintentable” de “captcha no reintentable” sin mirar el código, ya tienes la política de recovery del adaptador. We Do: codificar should_retry, recovery por tipo de error y next_step tras last_ok_step.
- **Code/output changes:** none

---

### S23-T3-B-E1 (weDo, guided)
- **Diagnosis:** Starter incluye captcha en el set reintentable. Instruction ya da las tres líneas de salida; falta title/preamble/retrospective y refuerzo ético en feedback.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Reintentar solo timeout y 429
- **Proposed preamble:**  
  - **Contexto:** en el portal demo, timeout y 429 son transitorios; CAPTCHA es stop condition ética — no se “reintenta con otro user-agent”.  
  - **Meta:** `should_retry(k)` True solo para `timeout` y `429`.  
  - **Éxito:** tres líneas `timeout True`, `captcha False`, `429 True`.  
  - **Límites:** no incluyas captcha ni 403 de negocio en el set.
- **Proposed instruction/description improvements:**  
  1. Quita `'captcha'` del set en `should_retry`.  
  2. Mantén el loop de impresión sobre timeout, captcha, 429.  
  3. No reordenes las tres líneas.  
  4. Corrige solo la política.
- **Proposed feedback improvement:**  
  captcha False no es un detalle del grader: es la frontera ética del robot. Timeout y 429 pueden reintentarse; reintentar captcha castiga al portal y viola la política del curso.
- **Proposed retrospective:**  
  Una función `should_retry` legible es el runbook en código. El error clásico es “cualquier excepción → retry”. Siguiente (E2): recovery distinta para stale DOM vs timeout.
- **Code/output changes:** none
- **Validation notes:** Política alineada a theory T3-B / T4-B.

---

### S23-T3-B-E2 (weDo, independent)
- **Diagnosis:** `recover('stale')` devuelve continue (anti-patrón). Instruction nombra goto_home; falta escena de handle viejo tras re-render. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Recover stale con goto_home
- **Proposed preamble:**  
  - **Contexto:** tras un re-render, un handle de locator viejo hace clic mal o lanza stale; seguir con `continue` perpetúa el flake.  
  - **Meta:** `recover(err)`: stale → `goto_home`, timeout → `retry`.  
  - **Éxito:** dos líneas `goto_home` luego `retry`.  
  - **Límites:** no uses continue para stale; no unifiques todo en retry.
- **Proposed instruction/description improvements:**  
  1. En la rama stale, devuelve `'goto_home'` (no `'continue'`).  
  2. Mantén timeout → retry.  
  3. Imprime recover de stale y de timeout.  
  4. No agregues ramas extra.
- **Proposed retrospective:**  
  Stale y timeout se sienten “igual de rojos” en el log, pero piden acciones distintas: renavegar vs reintentar el paso. El error clásico es un solo retry ciego. Luego (E3) reanudas por checkpoint sin rehacer login.
- **Code/output changes:** none
- **Validation notes:** Recovery map claro; output exacto.

---

### S23-T3-B-E3 (weDo, transfer)
- **Diagnosis:** Checkpoint: last_ok_step=login → siguiente form. Starter imprime steps[0]. Transfer de reanudación idempotente. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Siguiente step tras el checkpoint
- **Proposed preamble:**  
  - **Contexto:** si el run se cortó tras login OK, rehacer login/form puede **doble enviar** el formulario del portal demo.  
  - **Meta:** con `last_ok_step='login'`, imprimir el **siguiente** step (`form`).  
  - **Éxito:** una línea `form`.  
  - **Límites:** no reimprimas `login`; no saltes a export.
- **Proposed instruction/description improvements:**  
  1. Localiza el índice de `last_ok_step` en `steps`.  
  2. Imprime `steps[i + 1]`.  
  3. Quita el `print(steps[0])`.  
  4. No mutes la lista de steps.
- **Proposed retrospective:**  
  Checkpoint `last_ok_step` hace la corrida idempotente a nivel de paso y protege al backend del portal. El error clásico es “desde el principio por si acaso”. Pregunta de cierre: ¿qué documentarías en el runbook si last_ok_step es el último step?
- **Code/output changes:** none
- **Validation notes:** Transfer clave para You Do y rubric de reanudación.

---

### S23-T4-A-DEMO (iDo)
- **Diagnosis:** Cascada elige export aunque rpa=True. Description y why fuertes; falta preamble/retrospective formales.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El valor de negocio del adaptador es el **dato verificado**, no el trofeo de haber automatizado el clic. Esta demo elige canal con jerarquía api > export > rpa; con export disponible e api ausente gana export aunque rpa esté permitido. No escribas: predice la salida y por qué RPA no es el default del web adapter de CP-N2-C.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: menos flakes y menos riesgo de ToS con export/API; documentar reason al caer a RPA; puente a We Do (orden de ifs, cascada, decide con reason).
- **Proposed retrospective:**  
  Si puedes defender api > export > rpa > human en una reunión de ops, ya tienes el criterio de diseño del canal. We Do: invertir anti-patrones de orden y documentar method/reason.
- **Code/output changes:** none

---

### S23-T4-A-E1 (weDo, guided)
- **Diagnosis:** Starter evalúa rpa primero (anti-patrón clásico). Instruction ya explica la cascada; falta title/preamble/retrospective formales.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Elegir api antes que rpa
- **Proposed preamble:**  
  - **Contexto:** con api, export y rpa disponibles, el adaptador debe tomar **api**; el starter pregunta rpa primero y “gana” el clic por costumbre.  
  - **Meta:** cascada `api > export > rpa` (luego human).  
  - **Éxito:** una línea `api`.  
  - **Límites:** no elijas rpa solo porque rpa=True; no hardcodees el print.
- **Proposed instruction/description improvements:**  
  1. Invierte el orden de los `if/elif`: api primero.  
  2. Mantén export y rpa como siguientes.  
  3. Imprime solo el string del canal.  
  4. Corrige solo el orden de evaluación.
- **Proposed feedback improvement:**  
  Evaluar rpa primero es el defecto típico de quien acaba de aprender browser automation: el músculo del clic opaca el contrato de negocio. Con api=True la respuesta correcta es api.
- **Proposed retrospective:**  
  El orden de los ifs **es** la política de integración. El error clásico es “si hay RPA, RPA”. Siguiente (E2): misma cascada cuando api falta y export existe.
- **Code/output changes:** none
- **Validation notes:** Defecto de orden muy didáctico.

---

### S23-T4-A-E2 (weDo, independent)
- **Diagnosis:** Hardcode `c='rpa'` con flags que deberían dar export. Instruction corta; falta anclar “export cubre el mismo reporte sin UI frágil”. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Cascada cae a export
- **Proposed preamble:**  
  - **Contexto:** api=False, export=True, rpa=True: el CSV/xlsx del mismo reporte gana al browser RPA.  
  - **Meta:** implementar la cascada y devolver/imprimir `export`.  
  - **Éxito:** una línea `export`.  
  - **Límites:** no hardcodees rpa; no saltes a human.
- **Proposed instruction/description improvements:**  
  1. Reemplaza el hardcode `c='rpa'` por if/elif sobre `f`.  
  2. Orden: api → export → rpa → human.  
  3. Imprime `c`.  
  4. Mantén los flags del starter.
- **Proposed retrospective:**  
  Export es el “plan A” cuando no hay API: mismo dato, menos UI. El error clásico es elegir rpa porque la skill está caliente. Luego (E3) documentas method + reason para el ticket de reemplazo.
- **Code/output changes:** none
- **Validation notes:** Independiente; mismo principio que demo T4-A.

---

### S23-T4-A-E3 (weDo, transfer)
- **Diagnosis:** `decide` siempre rpa/no_api; debe preferir export cuando existe. Transfer de decisión documentada. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Decidir canal con method y reason
- **Proposed preamble:**  
  - **Contexto:** sin reason, el equipo no sabe si RPA es temporal; `no_api` habilita el ticket de “reemplazar por API”.  
  - **Meta:** `decide(caps)` → dict method/reason; export gana sobre rpa cuando export=True.  
  - **Éxito:** dos dicts: rpa/no_api luego export/export_ok.  
  - **Límites:** no siempre rpa; evalúa api y export antes.
- **Proposed instruction/description improvements:**  
  1. Si api → method api reason api_ok (fuera de los prints de prueba, pero en la función).  
  2. Si export → export / export_ok.  
  3. Si rpa_allowed → rpa / no_api.  
  4. Mantén los dos prints del starter.
- **Proposed retrospective:**  
  Documentar method+reason es el artefacto de gobernanza del adaptador. El error clásico es RPA silencioso sin ticket de reemplazo. Pregunta de cierre: ¿qué reason pondrías si el export existe pero está stale?
- **Code/output changes:** none
- **Validation notes:** Transfer alineado a theory T4-A reason.

---

### S23-T4-B-DEMO (iDo)
- **Diagnosis:** Handoff ante captcha. Why ético claro; falta preamble y retrospective formales.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  CAPTCHA y ToS no son “otro timeout”. Esta demo, ante `captcha: True`, detiene el robot y devuelve `human_handoff` — sin bypass ni granja. No escribas: observa que handoff es parte del **contrato** del adapter, no un fracaso de carrera. El curso y la operación responsable no resuelven captcha con bots.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: stop conditions éticas; abort por ToS gana sobre handoff; payload mínimo para el analista; puente a We Do (decide captcha, abort ToS, keys del payload).
- **Proposed retrospective:**  
  Si puedes explicar por qué handoff no se “arregla” con más retries, ya tienes la ética del robot. We Do: ternaria correcta, prioridad ToS y payload actuable sin secretos.
- **Code/output changes:** none

---

### S23-T4-B-E1 (weDo, guided)
- **Diagnosis:** Ternaria invertida y un solo caso impreso. Instruction nombra ambos casos; falta title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** CAPTCHA dispara human_handoff
- **Proposed preamble:**  
  - **Contexto:** en el portal demo, captcha=True es stop condition: handoff humano con evidencia, nunca continue.  
  - **Meta:** `decide(captcha)` → handoff si True, continue si False; probar **ambos** casos.  
  - **Éxito:** dos líneas `human_handoff` luego `continue`.  
  - **Límites:** no inviertas la ternaria; no omitas el caso False.
- **Proposed instruction/description improvements:**  
  1. Corrige la ternaria: handoff si captcha, continue si no.  
  2. Añade `print(decide(False))`.  
  3. Mantén `print(decide(True))` primero.  
  4. Sin bypass ni servicios externos.
- **Proposed feedback improvement:**  
  continue con captcha activo es el defecto más grave del adaptador: silencia una frontera legal/ética. Ambos casos deben quedar en el contrato del grader.
- **Proposed retrospective:**  
  Handoff es política, no vergüenza del automatizador. El error clásico es invertir la condición o solo probar el happy path. Siguiente (E2): ToS gana sobre captcha/handoff.
- **Code/output changes:** none
- **Validation notes:** Doble defecto (ternaria + un solo print) bien diseñado para E1.

---

### S23-T4-B-E2 (weDo, independent)
- **Diagnosis:** Starter imprime handoff cuando tos_forbidden (prioridad invertida). Instruction nombra abort > handoff; falta preamble de por qué ToS no se “arregla” con un humano en la cola. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** ToS prohíbe y aborta el run
- **Proposed preamble:**  
  - **Contexto:** si los términos prohíben automatizar, un handoff no repara la prohibición contractual: la action es `abort`.  
  - **Meta:** con `tos_forbidden=True` (aunque captcha=True), imprimir `abort`.  
  - **Éxito:** una línea `abort`.  
  - **Límites:** no elijas human_handoff; ToS gana.
- **Proposed instruction/description improvements:**  
  1. Invierte la ternaria del starter: abort si tos_forbidden.  
  2. No cambies el dict `sig`.  
  3. Un solo print.  
  4. Corrige solo la prioridad.
- **Proposed retrospective:**  
  abort > handoff cuando el contrato legal cierra el canal. El error clásico es “pasar a un humano y que él decida el ToS”. Luego (E3) el payload de handoff (cuando sí aplica) es actuable y sin secretos.
- **Code/output changes:** none
- **Validation notes:** Prioridad ToS alineada a theory T4-B.

---

### S23-T4-B-E3 (weDo, transfer)
- **Diagnosis:** Payload de handoff: keys sorted + step. Starter solo imprime step. Transfer de evidencia mínima. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Payload de handoff actuable
- **Proposed preamble:**  
  - **Contexto:** el ticket de handoff debe permitir a un analista de ops en Lima continuar en minutos: url, step y screenshot — sin cookies ni passwords.  
  - **Meta:** imprimir keys ordenadas del payload y el step.  
  - **Éxito:** `['screenshot', 'step', 'url'] export`.  
  - **Límites:** no imprimas solo el step; no agregues secretos al payload.
- **Proposed instruction/description improvements:**  
  1. Imprime `sorted(payload.keys())` y `payload['step']` en un print.  
  2. Mantén el dict del starter.  
  3. No filtres keys a mano.  
  4. Contrato exacto del grader (espacio entre lista y step).
- **Proposed retrospective:**  
  Payload mínimo actuable cierra el circuito humano-robot sin filtrar PII de sesión. El error clásico es dump de storage_state en el ticket. Pregunta de cierre: ¿qué campo añadirías si el analista debe reanudar en el mismo periodo de reporte?
- **Code/output changes:** none
- **Validation notes:** Transfer alinea con You Do on_blocker + evidence.

---

### S23-YOU-DO (youDo)
- **Diagnosis:** Marco de proyecto **maduro**: context CP-N2-C, objectives (locators, hash, retry, evidencia, last_ok_step), requirements éticos, starter casi completo (solo falta LoginPage.submit), rubric y portfolioNote. Falta el campo `retrospective` de defensa/reflexión post-build del spec. Sin ese cierre, el newbie puede marcar “listo” sin articular invariantes ni límites éticos en 30 segundos.
- **Checklist:** context pass · goal pass · success pass (rubric) · constraints pass · retrospective **fail**
- **Severity:** P1
- **Proposed title:** (ya existe) Robot de prueba con trace (web adapter CP-N2-C)
- **Proposed preamble:** N/A — el `context` actual cumple rol de escena de proyecto; no duplicar como preamble de We Do.
- **Proposed instruction/description improvements:**  
  Opcional P2: en el starter, una línea de comentario sobre “completa LoginPage.submit y verifica la corrida de aceptación” ya está; no hace falta reescribir objectives. Si el Fixer toca copy, acortar `context` 1–2 frases y mover la reflexión al retrospective.
- **Proposed retrospective:**  
  Antes de marcar listo: (1) ¿qué invariante demuestras con la corrida de aceptación (auth, hash, retry_captcha=False, evidence con trace en falla, resume_after_login=form)? (2) ¿qué harías distinto con un portal real vs. dicts sintéticos (ToS, PII en screenshots, secretos)? (3) En el runbook es-PE, una frase de impacto medible (p. ej. “download verificado + handoff sin bypass”) y el puente a OCR en S24 que puedas defender en 30 segundos.
- **Code/output changes:** none (starter y contrato de prints de aceptación se mantienen)
- **Validation notes:** Completar LoginPage es el único hueco de código intencional; outputs de la corrida de aceptación deben documentarse en el runbook del estudiante, no en el grader de We Do.

---

## Priority order

### P0 (We Do: title + preamble + instruction solo-tarea + retrospective; feedback si está anémico)
1. **S23-T1-A-E1, E2, E3** — locators (base de todo el adapter)
2. **S23-T1-B-E1, E2, E3** — auto-wait / timeout / assert_ready
3. **S23-T2-A-E1, E2, E3** — form, hash, session_mode
4. **S23-T2-B-E1, E2, E3** — Page Object, guard, estados
5. **S23-T3-A-E1, E2, E3** — evidencia y logs
6. **S23-T3-B-E1, E2, E3** — retry, recover, checkpoint (crítico ético + operativo)
7. **S23-T4-A-E1, E2, E3** — API-first y reason
8. **S23-T4-B-E1, E2, E3** — CAPTCHA / ToS / payload (crítico ético)

### P1
- **S23-T1-A-DEMO … S23-T4-B-DEMO** (8): añadir `preamble` + `retrospective`; alargar `why` al rango 40–90 palabras
- **S23-YOU-DO**: añadir `retrospective` de defensa post-build

### P2
- Enriquecer `feedback` de We Do (25–60 palabras) donde el Fixer ya toque la unidad
- Revisar que `instruction` quede **solo pasos** tras mover escena a `preamble` (especialmente T2-A-E1 y T4-A-E1, hoy densas)
- Opcional: alinear naming del archivo `computer-vision` vs. título Playwright en docs internos (fuera de scope de campos pedagógicos)

---

## Residual risks

1. **Modelo dict ≠ Playwright real:** el learner puede creer que “ya sabe Playwright” sin instalar el runtime. Mitigar en I Do preamble: “misma semántica, lab sin Chromium; sketch de teoría para local”.
2. **Ética CAPTCHA/ToS:** si solo se “pasa el grader” sin retrospective, el hábito no se graba. Priorizar T3-B-E1 y T4-B-* en el Fixer.
3. **Outputs canónicos frágiles:** varios contratos son repr de listas/dicts; el Fixer no debe cambiar outputs salvo execute-and-diff justificado.
4. **You Do sin grader automático de prints:** el retrospective debe empujar verificación manual de la corrida de aceptación y del runbook.
5. **Id de sección `computer-vision` vs. contenido RPA:** confusión de navegación en el producto; no es defect de ejercicio pero afecta contexto del newbie.
6. **Sobre-andamiaje en hints E3:** algunos hints casi spoilean la solución; aceptable en Round 1 si preamble/instruction/retrospective cargan el aprendizaje; Round 2 puede suavizar hints E3.

---

## Counts summary for Fixer

| Tipo | N | preamble | retrospective | title (weDo) |
|------|---|----------|---------------|--------------|
| iDo | 8 | 0/8 | 0/8 | N/A |
| weDo | 24 | 0/24 | 0/24 | 0/24 |
| youDo | 1 | N/A (context OK) | 0/1 | exists |
| **Total gaps** | **33** | **32** fields missing (8+24) | **33** | **24** |

Código/starter/solution/output: **preservar** salvo que un execute-and-diff demuestre divergencia (no se ejecutó en este review).

---

Section 23 exercise pedagogy review complete. Ready for the Fixer prompt.
