# S09 Exercise Pedagogy Report (Round 1)

## Section
- **title:** Excepciones, debugging y logging seguro
- **id:** `visualization` (index 9; archivo histórico `s09-visualization.ts` — contenido es excepciones/logs/resiliencia, no gráficos)
- **source:** `src/lib/course/sections/s09-visualization.ts`
- **counts:** iDo 8, weDo 24 (8 subtemas × E1/E2/E3), youDo 1
- **subtopics:** T1-A tipos/raise/chaining · T1-B fronteras try/else/finally · T2-A traceback · T2-B minimal repro · T3-A logging estructurado · T3-B correlation_id + PII · T4-A fail-fast vs cuarentena · T4-B retry/idempotencia
- **story:** inicio **CP-N1-C**, job de intake sintético CASO-LIM-009, bridge desde ETL/manifest S08 hacia CLI S10

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` (preamble checklist, retrospective, E1→E2→E3 fade, length limits)
- Manually inspected every `iDo.steps[]`, `weDo.steps[]`, and `youDo` (código, starter, solution, output, instruction, hint(s), feedback, why)
- Cross-checked against section story (bitácora auditable, sin PII real, data|config|provider, local-python)
- No bulk generation, no scripts, no copy-paste across sections

## Global findings (before unit ledger)

| Gap | Where | Impact |
|-----|--------|--------|
| **Zero `preamble`** | All 8 iDo + all 24 weDo | Newbie no ve escenario → meta → éxito → límites antes del código |
| **Zero `retrospective`** | All iDo + weDo + youDo | Cierre metacognitivo ausente; no hay puente a la siguiente práctica ni defensa de portfolio |
| **Zero We Do `title`** | 24 weDo | Solo el prefijo “E1/E2/E3” implícito en el id; UI carece de encabezado corto legible |
| **Instructions = drill + fixture** | Most weDo | “Mapea / implementa / imprime X”; a menudo mezcla meta y pasos; poco andamiaje ordenado en E1 |
| **Feedback de una línea** | Most weDo | Suele nombrar el principio correcto, pero no repara el misconception típico del starter ni el *por qué* del contrato de salida |
| **`why` iDo corto y técnico** | 8 demos | Cumple rol técnico (40–90 palabras a veces por debajo); no sustituye preamble (antes) ni retrospective (después) |
| **youDo bien enmarcado** | context/objectives/requirements/rubric/starter | Fuerte para proyecto CP-N1-C; falta solo `retrospective` de defensa |
| **Código/outputs** | Casi todos | Pedagógicamente coherentes; defectos de starter bien nombrados en la mayoría de E1; contrato en `tests` es el oráculo real |
| **Fade E1→E2→E3** | 8 tríos | En general real (mapas → implementa → transfer); no son clones numéricos. E1 a veces aún suena a “tabla de mapeo” sin escena operativa |

**Severity default for this section:** systematic missing preamble+retrospective is **P0** on every We Do and **P1** on I Do (demos still have `description`+`why`+worked code). youDo retrospective alone is **P1**. Feedback/title polish is often **P2** if preamble/instruction/retrospective land. Ampliar `why` iDo muy telegráficos es **P2**.

---

## Unit ledger

### S09-T1-A-DEMO (iDo)
- **Diagnosis:** Worked example claro de `parse_monto` → `ValidationError` con `from e` y Decimal. `description` y `why` existen pero son telegráficos (“el chaining preserva la causa…”). No hay preamble que diga *qué mirar* (camino feliz C001 vs. N/A en C002, línea de `__cause__`) ni retrospective que ancle el hábito “mensaje con id de fila + causa encadenada”. Un newbie ve código y output sin saber por qué no basta un `except Exception` genérico.
- **Checklist:** context fail · goal partial (implícito en description) · success partial (output existe, no se nombra como criterio) · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  En el intake sintético CASO-LIM-009 una fila con monto `N/A` no debe tumbar el job con un mensaje opaco. Antes de tocar We Do, observa la demo: (1) `parse_monto` convierte texto con coma a `Decimal` y cuantiza a 0.01; (2) si el parse falla, lanza `ParseError` **from** la causa de stdlib; (3) `validate_intake` envuelve eso en `ValidationError` con `id` de fila. Sigue los dos caminos: C001 imprime el dict ok; C002 muestra tipo, mensaje y `cause ParseError…`. Datos sintéticos; no reescribas aún.
- **Proposed instruction/description improvements:**  
  Description OK o: “Validar monto de intake: Decimal + ParseError encadenado a ValidationError”. Ampliar `why` (~60 palabras): chaining deja `__cause__` legible en post mórtem; el mensaje de dominio lleva `id`; montos nunca pasan por `float`.
- **Proposed retrospective:**  
  Si puedes explicar por qué C002 imprime `ParseError` en la causa y no solo “error”, ya tienes el hábito de **capa + causa**. El error clásico es `raise ValidationError(...)` sin `from e` y perder el detalle de parse. En We Do T1-A mapearás tipos y escribirás el parse con mensaje accionable.
- **Code/output changes:** none
- **Validation notes:** Output actual es el éxito observable de la demo.

---

### S09-T1-A-E1 (weDo, guided)
- **Diagnosis:** Drill de mapeo “fallo sintético → tipo”. Starter fuerza todo a `ValueError` (defecto guiado claro). Instruction densa mezcla meta y lista de tipos; sin title/preamble/retrospective. Feedback bueno en una frase pero no ancla la escena del on-call ni el éxito de 5 líneas exactas como checklist de entrada. Para un newbie, “incluye ValidationError de dominio” llega sin decir *por qué* la regla de negocio no es un `ValueError` genérico de stdlib.
- **Checklist:** context fail · goal pass · success partial (en `tests`, no en preamble) · constraints partial (edgeCases) · retrospective fail
- **Severity:** P0
- **Proposed title:** Mapear fallos de intake a tipos de excepción
- **Proposed preamble:**  
  - **Contexto:** en el triage de CASO-LIM-009 el on-call necesita el **tipo** correcto, no un `Exception` genérico que lo obligue a leer el stack entero.  
  - **Meta:** asociar cada fallo sintético al tipo más adecuado (stdlib + un custom de dominio).  
  - **Éxito:** cinco líneas `fallo -> Tipo` en el orden del starter: ValueError, TypeError, KeyError, FileNotFoundError, ValidationError.  
  - **Límites:** no uses `Exception` para todos; no inventes un sexto tipo; solo stdlib + la clase `ValidationError` que declares.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: el bucle imprime siempre `ValueError`.  
  2. Declara `class ValidationError(Exception): pass` para la regla de negocio.  
  3. Asigna cada string del array al tipo correcto (tipo incorrecto ≠ valor ilegal ≠ clave ≠ I/O ≠ dominio).  
  4. Imprime `f"{fallo} -> {tipo}"` en el orden del array; sin texto extra.
- **Proposed feedback improvement:**  
  `int('x')` es valor ilegal (`ValueError`); sumar str+int es tipo (`TypeError`); dict sin clave es `KeyError`; archivo inexistente es `FileNotFoundError` (subclase de OSError). La regla monto &lt; 0 es de **dominio**: `ValidationError`, no otro ValueError opaco.
- **Proposed retrospective:**  
  El tipo es la primera señal operable del post mórtem. El error clásico es aplanar todo a `ValueError` “porque es común”. Siguiente (E2): implementar `parse_monto` con `Decimal` y mensajes que incluyan el raw.
- **Code/output changes:** none
- **Validation notes:** Starter defect is pedagogical and well-formed; solution output is the contract.

---

### S09-T1-A-E2 (weDo, independent)
- **Diagnosis:** Buen foco operativo (Decimal, no float; mensajes accionables). Instruction nombra el contrato pero suena a mini-spec de API sin escena de intake ni límites explícitos de “no float”. Starter defect (`float(raw)`) es excelente. Sin title/preamble/retrospective. Feedback apunta al float pero no cierra el misconception de NaN/Infinity silencioso.
- **Checklist:** context fail · goal pass · success partial · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Parsear monto con Decimal y mensajes claros
- **Proposed preamble:**  
  - **Contexto:** en el intake, un monto `12,50` o `N/A` no puede pasar por `float` (precisión y no-finitos).  
  - **Meta:** implementar `parse_monto(raw)` robusto con `Decimal` y raise `ValueError` accionable.  
  - **Éxito:** `10.5` → `10.50`; `3,25` → `3.25`; `abc` → mensaje con `monto no numérico`; `-1` → `monto negativo`; NaN/Infinity fallan.  
  - **Límites:** prohíbe `float()`; construye desde texto; solo stdlib `decimal`.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: usa `float` y no valida signo ni finitud.  
  2. Normaliza coma → punto, `quantize(Decimal('0.01'))`, rechaza no finitos.  
  3. Si no parsea: `ValueError` con el `raw` en el mensaje.  
  4. Si es negativo: otro `ValueError` explícito. Demuestra con el loop de la solución.
- **Proposed feedback improvement:**  
  Si usaste `float()`, rehazlo: la precisión de dinero y NaN/Infinity no son negociables. El mensaje debe incluir el raw para que el on-call vea *qué* llegó sin abrir el CSV completo.
- **Proposed retrospective:**  
  `Decimal` + mensaje con raw es el contrato de montos del pipeline. El error clásico es capturar `Exception` y devolver `0`. Luego (E3) envolverás un fallo de I/O en `DataLoadError` **from** la causa.
- **Code/output changes:** none
- **Validation notes:** Solution output matches tests contract.

---

### S09-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transferencia real (chaining `from e` en borde de carga). Instruction ya nombra el bug del starter (`raise` sin `from e`). Falta contexto de por qué el post mórtem necesita `__cause__` OSError, y cierre retrospectivo. Feedback correcto y corto. Superficie nueva (callable `path_fn`) bien alineada con transfer.
- **Checklist:** context fail · goal pass · success partial · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Encadenar OSError en DataLoadError
- **Proposed preamble:**  
  - **Contexto:** al cargar el CSV de intake, el I/O (`FileNotFoundError`/`OSError`) no debe llegar al CLI como “fallo misterioso” sin causa.  
  - **Meta:** definir `DataLoadError` y relanzar con `raise ... from e` capturando `OSError`.  
  - **Éxito:** stdout con `DataLoadError` + mensaje y segunda línea `OSError` + causa; `__cause__` no es `None`.  
  - **Límites:** captura `OSError` (cubre PermissionError); no dejes `raise` sin `from e`; sin PII en mensajes.
- **Proposed instruction/description improvements:**  
  1. El starter relanza `DataLoadError` sin `from e` y solo captura `FileNotFoundError`.  
  2. Amplía a `except OSError as e` y usa `from e`.  
  3. Imprime tipo y mensaje del error y de `__cause__`.  
  4. Usa un reader que lance `OSError` (como en la solución).
- **Proposed retrospective:**  
  Sin `from e`, el post mórtem pierde el I/O original. El borde de capa nombra el dominio (`DataLoadError`); la causa nombra el sistema de archivos. En T1-B practicarás fronteras try/else/finally y no tragar excepciones.
- **Code/output changes:** none
- **Validation notes:** Starter intentionally omits `from e` — correct transfer defect.

---

### S09-T1-B-DEMO (iDo)
- **Diagnosis:** Demo de `with` + else/finally + fail-fast de encoding. `why` denso y útil, pero sin preamble que ordene *qué línea* observar (camino feliz vs. `encoding=None`) ni retrospective sobre “finally siempre / else solo si no hubo except”. Un newbie puede confundir else de try con else de if.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El job de lote debe cerrar handles y dejar contadores listos **aunque** el camino sea fatal. Observa sin escribir: (1) `with StringIO` cierra el handle; (2) si `encoding` falta, `ConfigError` se propaga (fail-fast); (3) en el camino feliz, `else` imprime `ok` y `finally` siempre imprime contadores. Predice el orden de las líneas de salida antes de mirar el oráculo. Datos sintéticos de demo.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why` ligeramente: contrastar “else del try = camino feliz” vs. “else del if”; finally corre antes de propagar al llamador.
- **Proposed retrospective:**  
  Si sabes por qué `finally` corre también en el fallo de config, ya no confundes cleanup con “éxito”. El error clásico es `except Exception: pass` y mentir al on-call. We Do: cerrar estado en finally y clasificar recover vs fail-fast.
- **Code/output changes:** none

---

### S09-T1-B-E1 (weDo, guided)
- **Diagnosis:** Defecto guiado excelente (sin finally; closed False en fail; además el starter traga RuntimeError y devuelve `"err"`). Instruction nombra el flag pero no contextualiza cleanup de job. Sin title/preamble/retrospective. Feedback menciona “finally corre antes de propagar” — buen germen, falta scene.
- **Checklist:** context fail · goal pass · success pass (en tests) · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Cerrar estado en finally aunque falle
- **Proposed preamble:**  
  - **Contexto:** en un job de intake, el flag de “recurso cerrado / contadores listos” debe quedar True aunque la unidad falle.  
  - **Meta:** usar `try/finally` para marcar `state['closed']=True` siempre.  
  - **Éxito:** `ok {'closed': True}` y, tras capturar el fallo, `err {'closed': True}`.  
  - **Límites:** no tragues `RuntimeError` en el camino de fail; déjalo propagar y marca closed en finally.
- **Proposed instruction/description improvements:**  
  1. El starter no tiene finally y captura RuntimeError devolviendo `"err"`.  
  2. Quita ese except de “éxito falso”; usa solo try/finally.  
  3. En finally: `state["closed"] = True`.  
  4. Camino feliz: imprime el return y state; camino fail: captura fuera de `work` e imprime `err` + state.
- **Proposed feedback improvement:**  
  `finally` corre antes de que la excepción salga de la función: por eso `closed` es True también con RuntimeError. Si capturas y devuelves `"err"` dentro de `work`, escondes el fatal al llamador.
- **Proposed retrospective:**  
  Cleanup ≠ recuperación. Finally garantiza el flag; la política de si reintentas o abortas es otro borde. Siguiente (E2): clasificar errores en recover vs fail-fast.
- **Code/output changes:** none
- **Validation notes:** Solution correctly re-raises; starter swallow is the teaching defect.

---

### S09-T1-B-E2 (weDo, independent)
- **Diagnosis:** Clasificación operativa recover/fail-fast — núcleo de la sección. Instruction ya da la regla; falta escena de “multiplicar basura vs. cuarentenar una fila”. Sin title/preamble/retrospective. E2 debería fijar meta+éxito con menos migas; hoy aún lista los 6 casos en la instruction (aceptable si preamble carga el “por qué”).
- **Checklist:** context fail · goal pass · success partial · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Clasificar recover frente a fail-fast
- **Proposed preamble:**  
  - **Contexto:** el on-call de las 02:10 no puede tratar un delimiter vacío igual que un email mal formado.  
  - **Meta:** etiquetar cada error del starter como `fail-fast` o `recover`.  
  - **Éxito:** seis líneas `nombre: política` en el orden del array (tres fail-fast de config/secretos, tres recover de fila/parse/timeout de un record).  
  - **Límites:** recover ≠ silenciar (implica cuarentena o retry); no uses una sola política para todos.
- **Proposed instruction/description improvements:**  
  1. El starter marca todo como `recover`.  
  2. Config/schema/secretos ausentes → `fail-fast`.  
  3. Fila/parse/timeout de un record → `recover`.  
  4. Imprime `f"{e}: {política}"` sin reordenar.
- **Proposed retrospective:**  
  Config rota multiplica basura; fila sucia se cuarentena. El error clásico es “todo recover para no tumbar el job” y envenenar el manifest. Luego (E3) refactorizarás un handler que traga Exception genérico.
- **Code/output changes:** none

---

### S09-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Transferencia fuerte: contrastar bad_handler (swallow) vs good_handler (solo ValueError → quarantine). Instruction y tests claros. Falta preamble de riesgo de corrupción y retrospective. Feedback sólido. Starter deja good_handler idéntico a bad — defecto transfer correcto.
- **Checklist:** context fail · goal pass · success partial · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** No tragar RuntimeError de config
- **Proposed preamble:**  
  - **Contexto:** un `except Exception` en el borde del job convierte un fatal de config en “swallowed” y miente al reconcile.  
  - **Meta:** capturar solo `ValueError` (cuarentena) y dejar propagar el resto.  
  - **Éxito:** bad traga ambos; good_v → quarantine; good_r imprime `raised` con RuntimeError.  
  - **Límites:** no uses `except:` bare ni tragues Exception en good_handler; solo ValueError de datos.
- **Proposed instruction/description improvements:**  
  1. Deja `bad_handler` como anti-patrón (traga Exception).  
  2. En `good_handler`, captura solo `ValueError` → `("quarantine", str(e))`.  
  3. Demuestra con `v()` (ValueError) y `r()` (RuntimeError capturado fuera).  
  4. Imprime las etiquetas del contrato de tests.
- **Proposed retrospective:**  
  Tragar config es peor que crashear: el job “sale 0” con datos basura. Preferir tipos estrechos en el borde. En T2-A leerás el traceback para ubicar el frame útil sin volcar PII.
- **Code/output changes:** none

---

### S09-T2-A-DEMO (iDo)
- **Diagnosis:** Demo de filtrar frames de `traceback.format_exc` hacia `normalize_email` / `run_batch`. `why` corto. Sin preamble que diga “no empieces por la stdlib” ni retrospective sobre no imprimir el row completo al diagnosticar.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Una fila del batch sintético llega sin `email` y el job lanza `KeyError`. Observa cómo se imprime solo líneas del stack que mencionan *tu* código (`normalize_email`, `run_batch`) y el tipo de error — no el diccionario crudo del cliente. Predice cuál frame es el más útil (donde se indexa la clave). Datos `C00x` sintéticos; no reescribas.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: el frame útil es el de tu módulo; filtrar el texto del traceback evita ruido y reduce riesgo de filtrar locals con PII.
- **Proposed retrospective:**  
  Si localizas el bug en `normalize_email` sin leer todo el stack de la librería, ya tienes el hábito de triage. El error clásico es imprimir `row` entero en el except. We Do: anotar frames y simular “breakpoint” seguro.
- **Code/output changes:** none

---

### S09-T2-A-E1 (weDo, guided)
- **Diagnosis:** Parseo de traceback textual (sin re-ejecutar). Instruction clara; falta escena de on-call y title. Starter imprime solo la primera línea del tb — defecto guiado. Feedback menciona “most recent call last” bien.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Anotar tres frames del traceback
- **Proposed preamble:**  
  - **Contexto:** el on-call recibe un stack de texto en el canal; debe leer marcos de afuera hacia adentro sin re-correr el job.  
  - **Meta:** extraer tres nombres de función del traceback sintético.  
  - **Éxito:** `frame1 main`, `frame2 run`, `frame3 normalize`.  
  - **Límites:** no re-ejecutes el código original; parsea el string `tb`; no inventes frames de la stdlib.
- **Proposed instruction/description improvements:**  
  1. El starter solo imprime la primera línea del traceback.  
  2. Busca líneas con `, in ` y toma el nombre de función.  
  3. Imprime frame1–frame3 en orden (main → run → normalize).  
  4. Recuerda: “most recent call last” pone el frame profundo al final.
- **Proposed retrospective:**  
  El orden de frames es un mapa del call graph. El frame útil del bug de email suele ser el más profundo de **tu** código. Siguiente (E2): simular breakpoint con locals seguros.
- **Code/output changes:** none

---

### S09-T2-A-E2 (weDo, independent)
- **Diagnosis:** Simular breakpoint sin PII — alineado a T2-A/T3-B. Instruction y tests buenos. Starter no lanza KeyError (defecto claro). Sin preamble de por qué no volcar row. Feedback correcto.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Breakpoint seguro solo con id de fila
- **Proposed preamble:**  
  - **Contexto:** en demo/CI no siempre hay `pdb`; aun así debes inspeccionar **sin** filtrar email al log.  
  - **Meta:** si falta `email`, en DEBUG imprimir solo `id` y lanzar `KeyError('email')`.  
  - **Éxito:** `break locals id= C009` y `raised 'email'`; sin volcar el row.  
  - **Límites:** no imprimas email/teléfono/row completo; flag DEBUG controla el print de locals.
- **Proposed instruction/description improvements:**  
  1. El starter usa `row.get("email")` y no lanza.  
  2. Si la clave no está: opcional print DEBUG con solo `id`, luego `raise KeyError("email")`.  
  3. Si está: devuelve email en minúsculas.  
  4. Demuestra con `{"id": "C009"}` y captura el KeyError.
- **Proposed retrospective:**  
  Locals de debug ≠ dump del cliente. El mismo cuidado aplica al logging de ERROR. Luego (E3) resumirás la causa raíz en una frase a partir del texto del stack.
- **Code/output changes:** none

---

### S09-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Transferencia limpia: causa raíz en una frase desde texto de tb. Instruction y formato de éxito claros. Falta context/retrospective. Feedback repara bien “no culpes a cli.py”.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Frase de causa raíz desde el stack
- **Proposed preamble:**  
  - **Contexto:** en el post mórtem hace falta una línea accionable, no el tb completo en Slack.  
  - **Meta:** con solo el texto del traceback, imprimir la causa raíz.  
  - **Éxito:** una línea `causa_raiz=normalize falta clave email`.  
  - **Límites:** no re-ejecutes el código original; no culpes a `cli`/`app` si el index es en `normalize`.
- **Proposed instruction/description improvements:**  
  1. El starter imprime todo el tb.  
  2. Lee la línea `KeyError` y el frame de `normalize`.  
  3. Emite exactamente el formato del contrato.  
  4. No inventes otras causas.
- **Proposed retrospective:**  
  Causa raíz = función + condición (clave faltante), no “falló en prod”. Ese hábito alimenta el minimal repro de T2-B y el test de regresión.
- **Code/output changes:** none

---

### S09-T2-B-DEMO (iDo)
- **Diagnosis:** De lote de ~200 filas al minimal `'Solo'`. `why` de una línea (“permite un test de regresión”). Sin preamble que diga *por qué* recortar el lote ni retrospective sobre bugs silenciosos de 3+ tokens (teoría lo menciona; la demo no cierra).
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Un lote sintético de casi 200 nombres “ok” y dos incompletos hace ruidoso el debug. Observa cómo el demo cuenta fallos y reduce al **string más corto** que dispara el `ValueError` (`'Solo'`). Ese minimal repro es lo que irá al test de regresión — no el archivo completo. No reescribas; sigue total_fallos → minimal_repro → root_symptom.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: reducir a una entrada hace el assert de una línea y evita arrastrar PII/ruido; el bug silencioso de 3+ tokens (truncar) es otro repro distinto (hipótesis).
- **Proposed retrospective:**  
  Si puedes defender por qué el test usa `'Solo'` y no el CSV entero, ya internalizaste minimal repro. We Do: recortar fixtures de DNI, hipótesis de teléfono y rojo→verde en nombres latam.
- **Code/output changes:** none

---

### S09-T2-B-E1 (weDo, guided)
- **Diagnosis:** Recortar fixture al primer fail de `parse_dni`. Starter toma `fixture[0]` (siempre el ok). Instruction y tests claros. Falta escena y retrospective. Feedback bueno.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Recortar fixture al primer DNI inválido
- **Proposed preamble:**  
  - **Contexto:** al validar DNI peruano sintético (8 dígitos), el fixture mezcla válidos e inválidos.  
  - **Meta:** encontrar la primera entrada que hace fallar `parse_dni` y re-ejecutar solo esa.  
  - **Éxito:** `minimal= 123` y `dni inválido: '123'`.  
  - **Límites:** no re-proceses todo el fixture en el print final; datos sintéticos (no DNI real de persona).
- **Proposed instruction/description improvements:**  
  1. El starter fija `minimal = fixture[0]` (válido).  
  2. Recorre hasta el primer `ValueError`, guarda esa cadena y haz `break`.  
  3. Imprime `minimal=` y vuelve a llamar `parse_dni` solo con ese valor.  
  4. Captura e imprime el mensaje.
- **Proposed retrospective:**  
  El primer fallo basta para un repro de regresión; el resto del fixture es ruido. Siguiente (E2): hipótesis falsables sobre normalización de teléfono.
- **Code/output changes:** none

---

### S09-T2-B-E2 (weDo, independent)
- **Diagnosis:** Hipótesis sobre `+` vs dígitos `51` — puente a S07. Instruction densa; el starter “arregla” con strip de `+` pero no digits-only del todo de forma correcta conceptualmente (sí quita espacios y +). Solution usa solo dígitos y afirma dos flags. Falta preamble de “reporte de negocio vs. contrato técnico” y retrospective. Buen E2 de pensamiento, no solo de API.
- **Checklist:** context fail · goal pass · success partial · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Hipótesis: +51 no es perder el país
- **Proposed preamble:**  
  - **Contexto:** un reporte afirma que se “perdió el código de país +51”; el contrato de S07 es salida **solo dígitos**.  
  - **Meta:** distinguir quitar el símbolo `+` de borrar los dígitos `51`.  
  - **Éxito:** `with_country 51999111222`, `local 999111222`, `country_digits_preserved True`, `plus_symbol_expected False`.  
  - **Límites:** no inventes formato E.164 con `+` en la salida; solo dígitos; datos sintéticos.
- **Proposed instruction/description improvements:**  
  1. El starter quita espacios y `+` pero no deja el contrato explícito con asserts/flags.  
  2. Normaliza a solo dígitos.  
  3. Compara entrada con país vs. local.  
  4. Imprime las dos afirmaciones del contrato de tests.
- **Proposed retrospective:**  
  Hipótesis falsable + fixture mínimo evita pelear con el “reporte” sin evidencia. Retirar `+` no es perder el país si `51` permanece. Luego (E3): test rojo→verde de capitalización latam.
- **Code/output changes:** none

---

### S09-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Regression test bad_title vs good_title — transferencia cultural/técnica (partículas de/la). Instruction y feedback claros. Starter deja good_title = title(). Falta preamble de “documentar el bug con assert” y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Rojo a verde en nombres con de/la
- **Proposed preamble:**  
  - **Contexto:** `.title()` en nombres latam produce `De`/`La` y rompe el contrato de normalización del intake.  
  - **Meta:** documentar el bug en rojo y una `good_title` que preserve partículas.  
  - **Éxito:** líneas `RED`, `pass`, `GREEN` en ese orden.  
  - **Límites:** el assert espera `Juan de la Cruz`; no “arregles” solo el print sin assert.
- **Proposed instruction/description improvements:**  
  1. Deja `bad_title` con `.title()` para demostrar el fallo.  
  2. Implementa `good_title` que deje `de/del/la/...` en minúsculas si no son el primer token.  
  3. Un `test` con assert; captura AssertionError → imprime RED.  
  4. Corre good_title → pass y GREEN.
- **Proposed retrospective:**  
  El test rojo es documentación de causa raíz, no un “fallo de CI molesto”. En T3-A pasarás del print de debug al logger con niveles y campos estables.
- **Code/output changes:** none

---

### S09-T3-A-DEMO (iDo)
- **Diagnosis:** Logger con stage/record_id/duration_ms y reloj inyectado. `why` de una línea. Sin preamble que diga por qué no usar `print("ok")` ni retrospective hacia el oráculo de dos líneas INFO.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  En el pipeline de familiaridad el progreso del stage se consulta por campos, no por `print` suelto. Observa: logger de módulo, handler a buffer, `propagate=False`, y dos INFO con `stage=normalize record_id=C001` (start/done + duration_ms). El reloj es un iterador inyectado para oráculo estable (7 ms). No reescribas; predice el buffer.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: campos estables permiten filtrar en ops; el reloj inyectado hace el demo determinista (en prod, `perf_counter_ns`).
- **Proposed retrospective:**  
  Si puedes decir por qué duration_ms sale 7 sin mirar el código del reloj, entendiste oráculos estables. We Do: asignar niveles, armar el logger y separar RESULT de logs (preview S10).
- **Code/output changes:** none

---

### S09-T3-A-E1 (weDo, guided)
- **Diagnosis:** Mapeo de 6 eventos a niveles. Starter todo INFO. Instruction da la regla. Clásico drill de tabla sin escena de “ruido en el dashboard”. Feedback útil.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Asignar niveles DEBUG a ERROR a eventos
- **Proposed preamble:**  
  - **Contexto:** si todo es INFO/ERROR, el dashboard de ops entierra el incidente real.  
  - **Meta:** etiquetar cada evento del starter con el nivel correcto.  
  - **Éxito:** seis líneas `evento: NIVEL` (INFO, DEBUG, WARNING, ERROR, ERROR, INFO) en orden.  
  - **Límites:** WARNING si el job continúa con anomalía recuperable; no uses CRITICAL aquí salvo que el starter lo pida (usa ERROR para config ilegible).
- **Proposed instruction/description improvements:**  
  1. El starter imprime todo como INFO.  
  2. Progreso de job → INFO; detalle de loop → DEBUG.  
  3. Fila opcional rara → WARNING; parse/config ilegible → ERROR.  
  4. Imprime sin reordenar.
- **Proposed retrospective:**  
  Nivel = severidad operativa, no “cuánto texto quiero”. El error clásico es ERROR en cada fila de cuarentena esperable. Siguiente (E2): configurar el logger de módulo de verdad.
- **Code/output changes:** none

---

### S09-T3-A-E2 (weDo, independent)
- **Diagnosis:** Configurar logger + StreamHandler a StringIO — skill core. Starter usa print. Instruction y tests claros. Sin preamble/title/retrospective. Feedback bueno.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Logger de módulo a buffer StringIO
- **Proposed preamble:**  
  - **Contexto:** el job de ingest necesita bitácora con nivel, no `print` de progreso.  
  - **Meta:** armar logger de módulo, handler a `StringIO`, emitir un INFO estructurado.  
  - **Éxito:** una línea `INFO stage=ingest event=start`.  
  - **Límites:** `propagate=False`; limpia handlers en demos; no uses print como log de progreso (el print final solo vuelca el buffer).
- **Proposed instruction/description improvements:**  
  1. Elmina los print de “INFO/DEBUG” del starter.  
  2. `getLogger`, `setLevel(INFO)`, `StreamHandler(buf)`, formatter `%(levelname)s %(message)s`.  
  3. `log.info("stage=ingest event=start")`.  
  4. Imprime `buf.getvalue().strip()`.
- **Proposed retrospective:**  
  Logger de módulo + handler único es el entrypoint limpio que S10 empaquetará en CLI. Luego (E3): separar stream de datos de logs de progreso.
- **Code/output changes:** none

---

### S09-T3-A-E3 (weDo, transfer)
- **Diagnosis:** Transferencia a contrato CLI (RESULT vs LOGS) — excelente puente a S10. Instruction densa pero alineada. Starter deja good = print. Feedback menciona preview S10. Falta preamble de pipes y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** RESULT limpio y progreso en el logger
- **Proposed preamble:**  
  - **Contexto:** si mezclas “empezando/sumando” con el número de salida, rompes pipes y el contrato CLI de S10.  
  - **Meta:** progreso a logs estructurados; stdout de datos solo con `RESULT=…`.  
  - **Éxito:** `RESULT=3` y línea LOGS con `event=start` y `event=done`.  
  - **Límites:** no imprimas progreso en el stream de datos; logger a buffer para el resumen.
- **Proposed instruction/description improvements:**  
  1. El starter usa print para todo en `cli_stub_good`.  
  2. Loguea start/done; calcula resultado; imprime solo `RESULT=`.  
  3. Vuelca el buffer de logs en una segunda línea etiquetada.  
  4. Con n=2 el resultado es 3.
- **Proposed retrospective:**  
  Datos y diagnóstico son streams distintos: así el on-call filtra sin ensuciar el JSON/resultado. En T3-B añadirás correlation_id y máscaras de PII al ERROR path.
- **Code/output changes:** none (nota menor: solution imprime LOGS con trailing `|`; tests dicen “línea LOGS con event=start y event=done” — conservar oráculo actual)

---

### S09-T3-B-DEMO (iDo)
- **Diagnosis:** `log.exception` + mask_email + asserts de PII — demo estrella de la sección. `why` de una línea. Sin preamble de “Slack a las 02:10” ni retrospective sobre el assert `pii_completa_ausente`.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Un ERROR path del intake no puede filtrar `lucia.mendez@…` al canal de ops. Observa: `mask_email` antes del format string, `correlation_id` y `error_class=data`, `log.exception` adjunta stack, y los asserts verifican máscara + ausencia de PII completa. Solo la primera línea ERROR se imprime como oráculo legible. Datos sintéticos `ejemplo.pe`.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: redactar *antes* de formatear; exception une stack y campos sin segundo print del row.
- **Proposed retrospective:**  
  Si el assert de PII falla, es un incidente de cumplimiento disfrazado de “log útil”. We Do: helpers de máscara, correlation por capas y auditoría de plantillas inseguras.
- **Code/output changes:** none

---

### S09-T3-B-E1 (weDo, guided)
- **Diagnosis:** Implementar mask_email/phone con datos sintéticos pe. Starter devuelve raw. Instruction y tests claros. Falta escena de cumplimiento y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Enmascarar email y teléfono sintéticos
- **Proposed preamble:**  
  - **Contexto:** la bitácora de CP-N1-C solo puede mostrar PII parcialmente legible.  
  - **Meta:** implementar `mask_email` y `mask_phone` estables.  
  - **Éxito:** `c***@ejemplo.pe` y `***7666` con los fixtures del starter.  
  - **Límites:** no imprimas el raw; email sin @ → `***`; teléfono corto → `***`.
- **Proposed instruction/description improvements:**  
  1. El starter devuelve el string crudo.  
  2. Email: primer carácter del local + `***@` + dominio.  
  3. Phone: solo dígitos, `***` + últimos 4.  
  4. Imprime ambas máscaras, una por línea.
- **Proposed retrospective:**  
  Máscara estable = accionable sin filtrar. El mismo helper debe ser el **único** camino a logs. Siguiente (E2): propagar correlation_id por capas.
- **Code/output changes:** none

---

### S09-T3-B-E2 (weDo, independent)
- **Diagnosis:** Propagar correlation_id cli→service→repo. Starter no imprime el id. Instruction clara. Sin preamble de post mórtem ni retrospective. Feedback bueno.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Propagar correlation_id por tres capas
- **Proposed preamble:**  
  - **Contexto:** sin el mismo id en CLI, service y repo, el post mórtem no une WARNING y ERROR de la misma corrida.  
  - **Meta:** pasar `correlation_id` como argumento explícito (sin global).  
  - **Éxito:** tres líneas con `correlation_id=corr-42` (cli, service, repo id=C001).  
  - **Límites:** no uses variable global ni contextvars aquí; argumento explícito.
- **Proposed instruction/description improvements:**  
  1. El starter imprime etiquetas sin el corr.  
  2. Incluye `correlation_id={corr}` en cada print de capa.  
  3. Repo también imprime `id` del item.  
  4. Llama `cli_main("corr-42", {"id": "C001"})`.
- **Proposed retrospective:**  
  El id es el hilo del job en el agregador de logs. Luego (E3): auditar plantillas que aún piden `{email}`/`{phone}` crudos.
- **Code/output changes:** none

---

### S09-T3-B-E3 (weDo, transfer)
- **Diagnosis:** Auditoría de plantilla insegura sin re-filtrar PII — transferencia sutil y excelente. Instruction y hints fuertes. Starter formatea con raw. Feedback clava el misconception. Falta preamble/title/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Auditar plantilla de log sin filtrar PII
- **Proposed preamble:**  
  - **Contexto:** una auditoría de logging no debe reimprimir el email que intenta proteger.  
  - **Meta:** detectar placeholders inseguros en la plantilla y emitir solo el log redactado.  
  - **Éxito:** `detected_unsafe True` y `SAFE error en a***@ejemplo.pe tel=***1222`; stdout sin raw.  
  - **Límites:** escanea el string plantilla; no hagas `format` con el row crudo en el camino final; datos sintéticos.
- **Proposed instruction/description improvements:**  
  1. Detecta `"{email}"` y `"{phone}"` en `template_unsafe`.  
  2. Implementa máscaras reales (no TODO identity).  
  3. `safe_log` arma el mensaje solo con máscaras.  
  4. Imprime detected_unsafe y SAFE … sin volcar raw.
- **Proposed retrospective:**  
  Detectar el riesgo en la plantilla es más seguro que “probar el log con datos reales”. En T4-A unirás taxonomía data|config|provider con la política de abort del lote.
- **Code/output changes:** none

---

### S09-T4-A-DEMO (iDo)
- **Diagnosis:** process_batch con cuarentena + fail-fast de required_fields + assert reconcile. `why` telegráfico. Sin preamble ni retrospective que conecte con manifest S08.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El lote sintético trae C001 completa y C002 sin email. Observa la política: data → cuarentena con reason; config sin `required_fields` → abort RuntimeError. El assert `ok + quarantined == in` es el mismo espíritu del manifest de S08. Predice el dict y la línea `abort …` antes de mirar el output.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: éxito parcial es válido si el reconcile cuadra; config fatal no se cuarentena “como fila”.
- **Proposed retrospective:**  
  Si puedes explicar por qué una fila mala no debe tumbar el lote y un schema vacío sí, ya tienes la taxonomía operativa. We Do: clasificar 8 fallos, implementar process_batch y codificar should_abort.
- **Code/output changes:** none

---

### S09-T4-A-E1 (weDo, guided)
- **Diagnosis:** Taxonomía de 8 fallos data|config|provider. Starter todo data. Instruction y tests (incluye ROOT_PATH, sin flechas) muy precisos. Falta escena y retrospective. Feedback bueno.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Taxonomía data, config y provider
- **Proposed preamble:**  
  - **Contexto:** reintentar un NaN de CSV o cuarentenar un YAML corrupto son errores de política, no de sintaxis.  
  - **Meta:** etiquetar ocho fallos sintéticos como data, config o provider.  
  - **Éxito:** ocho líneas `fallo: clase` (dos puntos, no `->`) en el orden del starter.  
  - **Límites:** ROOT_PATH vacía es config; HTTP 503 y timeout S3 son provider; no uses Exception genérica.
- **Proposed instruction/description improvements:**  
  1. El starter marca todo como `data`.  
  2. Fila/CSV → data; arranque/schema/env → config; red/IO externo → provider.  
  3. Imprime `f"{f}: {c}"` sin reordenar ni flechas.  
  4. Incluye el caso ROOT_PATH.
- **Proposed retrospective:**  
  La clase dicta la política (cuarentena / abort / retry). El error clásico es tratar 503 igual que monto NaN. Siguiente (E2): process_batch con reconcile.
- **Code/output changes:** none

---

### S09-T4-A-E2 (weDo, independent)
- **Diagnosis:** process_batch con quarantined + reconcile — eco S08. Starter dropea filas sin registrar. Instruction y tests claros. Falta preamble de “no silencio” y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Cuarentena con reconcile del lote
- **Proposed preamble:**  
  - **Contexto:** tirar filas sin id en silencio rompe el manifest y miente al dashboard.  
  - **Meta:** `process_batch` devuelve ok, quarantined (con reason) e in; reconcile obligatorio.  
  - **Éxito:** 2 ok, 1 quarantined `data:missing_id`, `in=3`; assert in == len(ok)+len(q).  
  - **Límites:** no descartes filas sin reason; no mutes el contrato del dict de retorno.
- **Proposed instruction/description improvements:**  
  1. El starter filtra sin llenar quarantined.  
  2. Si falta id → append a q con reason.  
  3. Retorna ok, quarantined, in=len(rows).  
  4. Imprime el dict y deja el assert de reconcile.
- **Proposed retrospective:**  
  Cuarentena es registro, no olvido. El reconcile es el invariante que defenderás en el You Do. Luego (E3): política de abort multi-regla.
- **Code/output changes:** none

---

### S09-T4-A-E3 (weDo, transfer)
- **Diagnosis:** should_abort con config, ratio, provider, y “una fila data no basta” — transferencia de política operativa excelente. Starter aborta por cualquier quarantined≥1. Instruction densa pero justa para E3. Falta preamble/title/retrospective. Feedback de “función testeable” es de oro.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Política de abort multi-regla testeable
- **Proposed preamble:**  
  - **Contexto:** el on-call no adivina si abortar: el README y el código deben decir lo mismo.  
  - **Meta:** `should_abort(metrics)` con tres reglas y camino ok.  
  - **Éxito:** cuatro líneas case/abort/reason (config True, ratio_alto True, provider True, una_fila_data False reason=ok).  
  - **Límites:** orden config → ratio &gt; 0.5 → provider; in=0 evita división; umbral 0.5 es de lab.
- **Proposed instruction/description improvements:**  
  1. El starter aborta si quarantined ≥ 1 (demasiado agresivo).  
  2. Evalúa config_ok, ratio, provider_exhausted.  
  3. Una sola fila en 10 no aborta.  
  4. Imprime el formato exacto del contrato.
- **Proposed retrospective:**  
  Política codificada = post mórtem sin telepatía. En T4-B decidirás *qué* reintentar y con qué clave de idempotencia.
- **Code/output changes:** none

---

### S09-T4-B-DEMO (iDo)
- **Diagnosis:** Retry TimeoutError vs quarantine ValueError. `why` de una línea. Sin preamble de “reintentar monto no lo hace válido” ni retrospective.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Un fetch flaky del proveedor simula timeout dos veces y ok al tercero; un ValueError de monto va a cuarentena **sin** gastar reintentos. Observa las tuplas de retorno `('ok', 'payload')` vs `('quarantine', 'monto')` y el contador de attempts. No reescribas; predice por qué el segundo caso no llega a 3 intentos.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: transitorio ≠ dato ilegal; reintentar datos gasta cuota y ensucia ERROR.
- **Proposed retrospective:**  
  Si sabes por qué ValueError no entra al loop de retry, ya separas resiliencia de corrección de datos. We Do: tabla yes/no, retry_call y clave de idempotencia.
- **Code/output changes:** none

---

### S09-T4-B-E1 (weDo, guided)
- **Diagnosis:** Tabla retry yes/no de 5 tipos. Starter reintenta casi todo. Instruction clara. Falta escena de cuota de proveedor y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** ¿Qué errores merecen retry?
- **Proposed preamble:**  
  - **Contexto:** reintentar un KeyError de fila no arregla el schema; solo multiplica logs.  
  - **Meta:** marcar yes/no de retry para cinco tipos.  
  - **Éxito:** TimeoutError yes; ValueError no; ConnectionError yes; KeyError no; PermissionError no.  
  - **Límites:** solo transitorios de red aquí; no marques PermissionError como yes.
- **Proposed instruction/description improvements:**  
  1. El starter pone yes en ValueError/KeyError/PermissionError.  
  2. Solo TimeoutError y ConnectionError → yes.  
  3. El resto → no.  
  4. Imprime `error: yes|no` en el orden del dict.
- **Proposed retrospective:**  
  Retry es para el canal, no para el dato. Siguiente (E2): implementar el loop con tope de intentos.
- **Code/output changes:** none

---

### S09-T4-B-E2 (weDo, independent)
- **Diagnosis:** retry_call con max_attempts y flaky. Starter un solo attempt. Instruction y tests claros. Sin preamble de backoff/tope ni retrospective. Feedback correcto.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Reintentar TimeoutError hasta el tope
- **Proposed preamble:**  
  - **Contexto:** el provider flaky de lab falla dos veces y responde en el tercero.  
  - **Meta:** `retry_call(fn, max_attempts=3)` reintenta solo TimeoutError y relanza el último si agota.  
  - **Éxito:** `done calls 3`.  
  - **Límites:** no retries infinitos; max_attempts=1 no reintenta; otros errores no se piden aquí.
- **Proposed instruction/description improvements:**  
  1. El starter llama `fn()` una sola vez.  
  2. Bucle hasta max_attempts capturando TimeoutError.  
  3. Si agota, relanza el último.  
  4. Imprime resultado y contador de calls.
- **Proposed retrospective:**  
  Tope de intentos es parte de la resiliencia; un bucle eterno es un incidente. Luego (E3): clave de idempotencia para re-ingesta sin duplicar side-effects.
- **Code/output changes:** none

---

### S09-T4-B-E3 (weDo, transfer)
- **Diagnosis:** Clave de idempotencia source:id:vN:hash — eco manifest S08, transferencia de diseño. Starter solo usa id. Instruction y tests (12 hex) precisos. Falta preamble de “re-ingestar sin duplicar” y retrospective hacia You Do.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Clave de idempotencia para re-ingesta
- **Proposed preamble:**  
  - **Contexto:** reintentar un INSERT no idempotente duplica filas; el manifest de S08 ya te entrenó en conteos, ahora la clave de escritura.  
  - **Meta:** construir `idem_key` con source, record_id, version y hash del payload.  
  - **Éxito:** una línea `idem_key=banco_a:C001:v3:` + 12 hex del payload.  
  - **Límites:** hash estable (`sort_keys` en JSON); no uses solo el id; datos sintéticos.
- **Proposed instruction/description improvements:**  
  1. El starter imprime solo el id.  
  2. Serializa payload con `json.dumps(..., sort_keys=True)`, sha256, 12 hex.  
  3. Formato `source:id:v{version}:{hash}`.  
  4. Prefija con `idem_key=`.
- **Proposed retrospective:**  
  Misma clave + mismo payload = skip seguro; misma clave + payload distinto = conflicto. Ese diseño cierra la resiliencia de S09 y alimenta la bitácora del You Do (CP-N1-C).
- **Code/output changes:** none

---

### youDo — Bitácora auditable del pipeline (inicio CP-N1-C)
- **Diagnosis:** Proyecto bien enmarcado: context, objectives, requirements, rubric, starter con TODOs claros, portfolioNote. Es el mejor “frame” de la sección. **Falta `retrospective`** de defensa (metacognición post-build): invariantes, PII, frase de impacto. Sin eso el learner cierra el tab sin ensayar el pitch de 30 s del portfolio. No es un drill vacío; severity P1 (no P0) porque el andamiaje de entrada ya existe.
- **Checklist:** context pass · goal pass · success pass (rubric/requirements) · constraints pass · retrospective fail
- **Severity:** P1
- **Proposed title:** (ya existe) Bitácora auditable del pipeline (inicio CP-N1-C)
- **Proposed preamble:** N/A — `context` ya cumple rol de escena; no duplicar. Opcional: una línea en context que remita al éxito del assert de reconcile y a “cero PII completa en logs de demo”.
- **Proposed instruction/description improvements:**  
  Ninguno estructural. Asegurar que el Fixer no reemplace requirements; solo añade `retrospective`.
- **Proposed retrospective:**  
  Antes de marcar listo: (1) ¿qué invariante demuestras con el assert `in == ok + quarantined` y con un test de fail-fast de config? (2) ¿qué harías distinto con datos reales vs. sintéticos (PII, secretos en logs)? (3) En el README, una frase de impacto medible (p. ej. “antes: email completo en ERROR; después: máscara + correlation_id”) que puedas defender en 30 segundos en code review o entrevista. Si no puedes explicar por qué un timeout de provider no se trata como monto NaN, vuelve a T4-A/T4-B.
- **Code/output changes:** none
- **Validation notes:** Starter intentionally incomplete; portfolioNote already guides evidence.

---

## Priority order

### P0 (Fixer first — all We Do scaffolding)
1. Add `title` + `preamble` + `retrospective` to **all 24** weDo steps (proposed texts above).
2. Split fat instructions: keep **task steps only** in `instruction`; move context/success/constraints into `preamble` (especially E1 mapping drills and E3 dense specs).
3. Strengthen `feedback` where noted (T1-A-E1/E2, T1-B-E1, T2-A-E2, T3-B-E3, T4-A-E3) so it names the **starter misconception** and the reasoning, not only the rule.

### P1 (I Do + You Do close the loop)
4. Add `preamble` + `retrospective` to **all 8** iDo demos; expand ultra-short `why` (T1-A, T2-B, T3-A, T3-B, T4-A, T4-B) toward 40–90 words without essay length.
5. Add `retrospective` to **youDo** (defense / self-check triad above).

### P2 (Polish after fields land)
6. Optional We Do `title` length/consistency pass (4–12 words).
7. Ensure E1 instructions explicitly name the starter defect line when not already clear (most already do via “A corregir”).
8. Cross-link transfer cues in retrospectives (already drafted: each unit bridges next E or subtopic / S10 / You Do).
9. No code/output changes required for pedagogy in this section unless a Fixer discovers execute-and-diff drift (not observed in static review).

---

## Residual risks

- **Historical id `visualization`:** learners and tooling may misread the section as charts; pedagogy prose should keep saying “excepciones, logs, resiliencia” (title already correct). Fixer should not rename id in this round unless orchestrator asks.
- **Drill-heavy E1 maps** (exception types, recover/fail-fast, log levels, taxonomy, retry table): even with strong preambles, they remain classification tables — that is intentional skill practice, but retrospectives must carry the *operational* meaning or they feel like trivia.
- **Overlap T1-B-E2 vs T4-A-E1:** recover/fail-fast vs data|config|provider are related; proposed prose differentiates *policy* vs *taxonomy class* to avoid “three clones” feel.
- **T2-B-E2** depends on S07 phone contract; if a learner skipped S07, preamble must carry “solo dígitos” (included).
- **youDo scope:** starter + requirements are large for 19h section; retrospective should not add scope — only reflection.
- **Exact outputs:** preserve all solution `output` strings; tests already encode contracts. Do not “improve” hash of idempotency key or LOGS trailing format without re-running.
- **Anti-aberration:** Fixer must hand-apply fields unit-by-unit; no bulk template fill across the 24 We Do.

---

## Counts summary for Fixer

| Unit type | N | Missing preamble | Missing retrospective | Missing title |
|-----------|---|------------------|----------------------|---------------|
| iDo | 8 | 8 | 8 | N/A |
| weDo | 24 | 24 | 24 | 24 |
| youDo | 1 | context exists | 1 | title exists |

**Code/output changes required by pedagogy:** none identified.

Section 9 exercise pedagogy review complete. Ready for the Fixer prompt.
