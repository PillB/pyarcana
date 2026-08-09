# S05 Exercise Pedagogy Report (Round 1)

## Section
- **title:** Funciones, contratos y descomposición
- **shortTitle:** Funciones & Contratos
- **id:** `oop` (archivo histórico `s05-oop.ts`; contenido = funciones puras / contratos, no clases)
- **index:** 5
- **source:** `src/lib/course/sections/s05-oop.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24**, youDo **1** (total **33** unidades de práctica/demo)
- **subtemas:** S05-T1-A, T1-B, T2-A, T2-B, T3-A, T3-B, T4-A, T4-B (× I Do + E1/E2/E3)
- **hilo de caso:** CASO-LIM-005 / inicio **CP-N1-B** (normalizadores puros de intake sintético)

## Method
- Leído `PEDAGOGY_EXERCISE_SPEC.md` (campos, longitudes, checklist preamble/retrospective, fade E1→E2→E3).
- Inspeccionado manualmente cada `iDo.steps[]`, `weDo.steps[]` y `youDo` en `s05-oop.ts` (líneas ~384–1648).
- Contrastado con schema en `src/lib/types.ts` (`preamble?`, `retrospective?`, We Do `title?`).
- **Sin** generadores, bucles, plantillas ni copy-paste mecánico entre unidades.
- Prosa propuesta en **español profesional peruano**, con un objetivo primario por unidad.

## Hallazgos transversales (antes del ledger)

| Campo / hábito | Estado actual en S05 |
|----------------|----------------------|
| I Do `preamble` | **Ausente** en las 8 demos |
| I Do `retrospective` | **Ausente** en las 8 demos |
| I Do `why` | Presente pero **muy corto** (1 frase; bajo el piso de 40–90 palabras del spec) |
| We Do `title` | **Ausente** en los 24 ejercicios (UI truncará `instruction`) |
| We Do `preamble` | **Ausente** en los 24 |
| We Do `retrospective` | **Ausente** en los 24 |
| We Do `instruction` | Estilo “**E_n (kind) — CASO-LIM-005. … Pasa: …**”: mezcla contexto mínimo + tarea; a menudo legible para quien ya sabe, **opaco** para newbie sin preámbulo |
| We Do `feedback` | Una línea; poco *razonamiento* correctivo |
| Starter `# FALLO:` | Buen hábito (defect naming) en casi todos los E1/E2/E3 |
| Hints | A menudo **casi-solución** (especialmente E1); en E3 a veces demasiado spoiling |
| You Do marco | `context` / `objectives` / `requirements` / `rubric` **sólidos** |
| You Do `retrospective` | **Ausente** |

**Patrón dominante:** andamiaje de *código* (starter defect + tests de salida) es decente; andamiaje *pedagógico verbal* (preamble → task-only instruction → retrospective) no existe. Un true newbie no responde con claridad: qué practico, por qué importa en el intake, cómo sé que gané, qué debe quedarme al cerrar la pestaña.

**Fade E1→E2→E3 (contenido):** en general hay progresión real de skill (return vs print → política gate → transfer a otra superficie). **No** son tres clones con números distintos. El fade de *prosa* no se ve porque no hay preambles diferenciados.

**Código/salida:** en general **no** proponer cambios de output canónico salvo notas puntuales (mensajes de error de dominio, prints de estrategia). Prioridad = campos de prosa.

---

## Unit ledger

### S05-T1-A-DEMO (iDo)
- **Diagnosis:** Demo correcta de `normalize_nombre` con política colapsa+title y tres samples. `description` técnica; sin `preamble` que diga *qué mirar* antes del código; `why` de una frase; sin `retrospective` que ancle return vs print ni puente a We Do. Un newbie ve “magia de strings” sin el contrato del gate.
- **Checklist:** context **fail** / goal **fail** / success **partial** (output visible) / constraints **fail** / retrospective **fail**
- **Severity:** **P1**
- **Proposed title:** N/A (iDo)
- **Proposed preamble:** Antes de tocar el CSV del intake, el junior define el **núcleo puro** de nombres. Aquí solo observas: una función `normalize_nombre` recibe texto sintético sucio y **retorna** la forma canónica del gate CP-N1-B (colapsar espacios + title-case por palabra). Sigue el `for` y el `repr`: espacios extremos, dobles espacios y mayúsculas se corrigen sin `print` dentro de la función. Datos ficticios (`Ana`, `María José`, `QUISPE`); sin PII real. No escribas aún; confirma que cada flecha del output coincide con la política.
- **Proposed instruction/description improvements:** Mantener description; enriquecer `why` a ~50–70 palabras: explicar `strip`+`split`+`join`+`title` como un solo contrato, y que el caller imprime el return (no la función).
- **Proposed retrospective:** Si puedes decir en voz alta por qué `"QUISPE"` → `"Quispe"` y por qué no se imprime dentro de `normalize_nombre`, ya tienes el hábito del normalizador puro. El error clásico es confundir “se ve bien en pantalla” con “el caller recibió un valor”. En We Do corregirás un helper que imprime y no retorna.
- **Code/output changes:** none
- **Validation notes:** Output canónico OK. `why` actual demasiado corto para el spec.

---

### S05-T1-A-E1 (weDo, guided)
- **Diagnosis:** Defect naming bueno (`print` dentro, caller ve `None`). Instruction es drill “corrige / Pasa: 2”. Sin title, preamble ni retrospective. Feedback de una línea. E1 bien elegido (casi completo).
- **Checklist:** context **partial** / goal **partial** / success **pass** (`2`) / constraints **partial** (no print dentro) / retrospective **fail**
- **Severity:** **P0**
- **Proposed title:** Contar palabras con `return` (no `print`)
- **Proposed preamble:**
  - **Contexto:** en el lote de intake a veces mides el campo *antes* de normalizar el nombre.
  - **Meta:** practicar que una función **entrega** el valor con `return`, no con `print` interno.
  - **Éxito:** una sola línea impresa por el caller: `2` (para `'  Ana   María  '`).
  - **Límites:** no imprimas dentro de `n_palabras`; no cambies el input de prueba.
- **Proposed instruction/description improvements:**
  1. Abre el starter: `n_palabras` imprime y no retorna (el caller ve `None`).
  2. Calcula tokens con `strip` + `split`.
  3. Devuelve ese entero con `return`.
  4. Deja el `print` solo en el caller; verifica la línea exacta `2`.
- **Proposed retrospective:** `return` es el contrato con quien llama; `print` es un efecto del borde. El mismo bug (`None` silencioso) rompe pipelines cuando encadenas normalizadores. Pregunta de cierre: si borras el `print` del caller, ¿sigue “funcionando” la función?
- **Code/output changes:** none
- **Validation notes:** Mejorar `feedback` (~40 palabras) explicando por qué el caller imprimía `None`.

---

### S05-T1-A-E2 (weDo, independent)
- **Diagnosis:** Política CP-N1-B real (`colapsa + title`). Instruction compacta con éxito claro; sin framing de por qué title-case importa en calidad de datos. Hint casi da la solución completa (aceptable en E1, pesado en E2).
- **Checklist:** context **fail** / goal **partial** / success **pass** / constraints **fail** / retrospective **fail**
- **Severity:** **P0**
- **Proposed title:** Normalizar nombre (colapsa + title)
- **Proposed preamble:**
  - **Contexto:** el gate CP-N1-B exige nombres canónicos para matching y reportes en fintech/retail.
  - **Meta:** implementar `normalize_nombre` con la política completa del caso, no solo `strip`.
  - **Éxito:** imprime `Juan Pérez` y `Quispe` en dos líneas.
  - **Límites:** no uses regex; no mutes strings con side-effects; datos sintéticos.
- **Proposed instruction/description improvements:**
  1. Revisa el fallo: solo `strip` deja dobles espacios y mayúsculas.
  2. Colapsa espacios con `split`/`join`.
  3. Aplica `.title()` por palabra (parte del contrato).
  4. Prueba los dos inputs del starter y compara salidas.
- **Proposed retrospective:** Title-case sin colapsar deja basura (`"Juan  Pérez"`). Colapsar sin title deja `"QUISPE"`. Ambos fallan el gate. Reusarás este patrón en el You Do y en el orquestador.
- **Code/output changes:** none
- **Validation notes:** Suavizar hint E2 (describir pasos sin pegar la one-liner completa).

---

### S05-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer legítimo (misma idea return vs print, nueva superficie `etiqueta_campo`). Instruction mezcla meta y éxito; sin preamble que diga “misma lección, otro rol en el borde”.
- **Checklist:** context **partial** / goal **partial** / success **pass** / constraints **partial** / retrospective **fail**
- **Severity:** **P0**
- **Proposed title:** Etiquetar campo sin devolver `None`
- **Proposed preamble:**
  - **Contexto:** en el borde del intake a veces armás una etiqueta legible para logs o UI, no el core del normalizador.
  - **Meta:** transferir el hábito `return` (no `print` interno) a una función de formato.
  - **Éxito:** línea exacta `nombre: Ana`.
  - **Límites:** no imprimas dentro de `etiqueta_campo`; no hardcodees el nombre del campo.
- **Proposed instruction/description improvements:**
  1. El starter imprime dentro y el caller vuelve a imprimir → `None`.
  2. Retorna el f-string `f'{campo}: {valor}'`.
  3. El único `print` visible debe ser el del caller.
  4. Verifica `nombre: Ana`.
- **Proposed retrospective:** El bug `None` reaparece cada vez que migrás de script a función. Si ves `None` en la consola tras un `print(fn(...))`, la primera sospecha es return faltante. En T1-B practicarás defaults y keywords con el mismo rigor de contrato.
- **Code/output changes:** none
- **Validation notes:** Feedback actual es bueno en espíritu; expandir con la heurística “print(fn) → None”.

---

### S05-T1-B-DEMO (iDo)
- **Diagnosis:** Contraste good/bad default mutable excelente en código. Sin preámbulo de *por qué* el default se evalúa una vez; `why` mínimo; sin retrospective hacia el antipatrón en PRs de normalización.
- **Checklist:** context **fail** / goal **fail** / success **pass** (output) / constraints **fail** / retrospective **fail**
- **Severity:** **P1**
- **Proposed title:** N/A
- **Proposed preamble:** Los defaults de Python se evalúan **una sola vez** al definir la función. En pipelines de intake, un `bucket=[]` compartido acumula basura entre filas y el bug se ve solo en el segundo o tercer registro. Observa `good` (None + lista local) frente a `bad` (lista mutable por defecto). Compara las dos líneas de salida: mismas llamadas, objetos distintos vs. compartidos. No escribas aún.
- **Proposed instruction/description improvements:** Expandir `why`: default mutable = objeto vivo reutilizado; None + creación local = aislamiento por llamada.
- **Proposed retrospective:** Si en un PR de normalización ves `def f(x, acc=[])`, es P1 de producción. La reparación mental es “defaults inmutables o None”. En We Do reescribirás el antipatrón a la versión segura.
- **Code/output changes:** none
- **Validation notes:** Output `good [1] [2]` / `bad [1, 2] [1, 2]` es el mensaje pedagógico; no tocarlo.

---

### S05-T1-B-E1 (weDo, guided)
- **Diagnosis:** Defect claro (hardcodea `"Cliente"`). Falta title/preamble/retrospective; instruction tipo drill.
- **Checklist:** context **fail** / goal **partial** / success **pass** / constraints **partial** / retrospective **fail**
- **Severity:** **P0**
- **Proposed title:** Default y keyword en `present`
- **Proposed preamble:**
  - **Contexto:** en reportes de cliente sintético el título (Cliente/VIP) es política de presentación, no del core de normalización.
  - **Meta:** usar el parámetro con default y el override por keyword.
  - **Éxito:** `Cliente: Quispe` y `VIP: Quispe`.
  - **Límites:** no hardcodees el prefijo en el f-string; usa la variable `titulo`.
- **Proposed instruction/description improvements:**
  1. El starter ignora `titulo` y fija `"Cliente"`.
  2. Arma `f'{titulo}: {nombre}'`.
  3. Llama sin segundo argumento (default) y con `titulo='VIP'`.
  4. Confirma las dos líneas exactas.
- **Proposed retrospective:** El keyword en el call site documenta la intención (`titulo='VIP'` se lee mejor que un posicional opaco). El default solo aplica si omites el argumento. Siguiente: el default **mutable**, que no se arregla con un f-string.
- **Code/output changes:** none
- **Validation notes:** —

---

### S05-T1-B-E2 (weDo, independent)
- **Diagnosis:** Tema crítico de producción. Instruction nombra el éxito bien; sin contexto de incidente ETL; sin retrospective.
- **Checklist:** context **fail** / goal **partial** / success **pass** / constraints **partial** / retrospective **fail**
- **Severity:** **P0**
- **Proposed title:** Default seguro con `None`
- **Proposed preamble:**
  - **Contexto:** un acumulador compartido entre llamadas en un normalizador de lote genera filas “contaminadas” sin excepción ruidosa.
  - **Meta:** reescribir el default mutable a la forma segura.
  - **Éxito:** dos líneas `[1]` y `[2]` (listas independientes).
  - **Límites:** no uses una lista literal como default; crea la lista dentro si `bucket is None`.
- **Proposed instruction/description improvements:**
  1. Identifica `bucket=[]` en la firma.
  2. Cámbialo a `bucket=None`.
  3. Si es `None`, asigna `[]` localmente.
  4. Dos `print` de llamadas separadas deben mostrar listas distintas.
- **Proposed retrospective:** El objeto default vive con la función, no con la llamada. Por eso `bad(1)` y `bad(2)` comparten memoria. En entrevistas y code review este es un filtro clásico de seniority junior+.
- **Code/output changes:** none
- **Validation notes:** Feedback actual (“antipatrón de producción”) es corto; ampliar con el porqué de una sola evaluación.

---

### S05-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Keyword-only bien alineado a política regional. Instruction densa; falta framing de *por qué* el `*` evita swaps de argumentos.
- **Checklist:** context **fail** / goal **partial** / success **pass** / constraints **partial** / retrospective **fail**
- **Severity:** **P0**
- **Proposed title:** Teléfono con flag keyword-only
- **Proposed preamble:**
  - **Contexto:** en un ETL de fintech en Perú, un flag de política (`digits_only`) no debe colarse como segundo posicional por error.
  - **Meta:** respetar `*` y ramificar la normalización según el flag.
  - **Éxito:** `999000` y `999-000`.
  - **Límites:** no elimines el `*`; no hardcodees siempre dígitos.
- **Proposed instruction/description improvements:**
  1. El starter siempre hace `strip` e ignora `digits_only`.
  2. Si el flag es True, deja solo dígitos; si False, solo strip.
  3. Demuestra ambas llamadas del starter.
  4. Compara las dos salidas exactas.
- **Proposed retrospective:** Keyword-only documenta política en el call site y evita invertir argumentos. El mismo patrón sirve para `country="PE"` en demos posteriores. No confundas “keyword-only” con “siempre hay que pasar el default”.
- **Code/output changes:** none (nota: output del starter usa `' 999-000 '` → `999000` / `999-000`; instruction dice `999000` y `999-000` — alineado)
- **Validation notes:** Instruction actual menciona `999000` sin el input exacto en una frase; el starter ya lo fija — preamble debe apuntar al starter.

---

### S05-T2-A-DEMO (iDo)
- **Diagnosis:** Contrato email + raise bien modelado. Sin preámbulo de pre/post; docstring mini; sin retrospective sobre alinear docstring y código.
- **Checklist:** context **fail** / goal **fail** / success **pass** / constraints **fail** / retrospective **fail**
- **Severity:** **P1**
- **Proposed title:** N/A
- **Proposed preamble:** Un normalizador de email del gate no es “solo lower”: tiene **precondiciones** (str usable), **postcondiciones** (strip+lower con `@`) y un **error de dominio** si falta `@`. Observa el docstring corto, el `raise ValueError` y el `try/except` de demo. El caso feliz y el fallo deben leerse como contrato de negocio, no como capricho de Python. Datos sintéticos (`X@Y.COM`, `x`).
- **Proposed instruction/description improvements:** Ampliar `why`: el raise es parte del contrato; el docstring no sustituye al código pero debe coincidir.
- **Proposed retrospective:** Si docstring dice “exige @” y el código no valida, gana el código y el revisor devuelve el PR. En We Do convertirás un comentario `#` en docstring real y alinearás pre/post.
- **Code/output changes:** none
- **Validation notes:** —

---

### S05-T2-A-E1 (weDo, guided)
- **Diagnosis:** Excelente foco en docstring vs `#` y `__doc__`. Drill sin framing de *por qué* el revisor mira `help()` / `__doc__`.
- **Checklist:** context **partial** / goal **partial** / success **pass** / constraints **partial** / retrospective **fail**
- **Severity:** **P0**
- **Proposed title:** Docstring real en `strip_collapse`
- **Proposed preamble:**
  - **Contexto:** `strip_collapse` es el helper base de varios normalizadores del caso LIM-005.
  - **Meta:** dejar un **docstring** (no un comentario `#`) legible en `__doc__`.
  - **Éxito:** imprime el texto del doc y luego `a b`.
  - **Límites:** triple comillas justo bajo `def`; no uses solo `#`.
- **Proposed instruction/description improvements:**
  1. El starter documenta con `#`; `__doc__` es `None`.
  2. Mueve la descripción a un docstring de una línea.
  3. Mantén el return que colapsa espacios.
  4. Imprime `__doc__` y el resultado de `'  a  b '`.
- **Proposed retrospective:** Solo el docstring carga `__doc__` y alimenta `help()` / herramientas. Un `#` bajo `def` es invisible para el contrato. Pregunta: si `__doc__` es `None`, ¿qué falló?
- **Code/output changes:** none
- **Validation notes:** Output del docstring debe permanecer una línea coherente con la solución.

---

### S05-T2-A-E2 (weDo, independent)
- **Diagnosis:** Alineado al gate email. Falta preamble de pre/post + éxito; feedback fino pero corto.
- **Checklist:** context **partial** / goal **partial** / success **pass** / constraints **partial** / retrospective **fail**
- **Severity:** **P0**
- **Proposed title:** Email con pre/post y `ValueError`
- **Proposed preamble:**
  - **Contexto:** política de gate: strip+lower y rechazo si no hay `@`.
  - **Meta:** alinear docstring, código y error de dominio.
  - **Éxito:** `a@b.com` y una línea `err ...`.
  - **Límites:** no tragues el error con un return silencioso; no uses PII real.
- **Proposed instruction/description improvements:**
  1. El starter hace strip pero no lower ni valida `@`.
  2. Normaliza con strip+lower.
  3. Si falta `@`, `raise ValueError` con mensaje en español.
  4. Prueba OK y el `try/except` del starter.
- **Proposed retrospective:** Pre/post en el docstring y `raise` en el cuerpo deben decir lo mismo. Separar “email malo de negocio” de un bug de Python evita logs confusos en el ETL.
- **Code/output changes:** none (mensaje `email sin @` es canónico de la solución)
- **Validation notes:** —

---

### S05-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Buena transferencia (postcondición testeable + title). Instruction densa; el assert de post es el valor pedagógico y está enterrado.
- **Checklist:** context **fail** / goal **partial** / success **pass** / constraints **partial** / retrospective **fail**
- **Severity:** **P0**
- **Proposed title:** Postcondición viva en `normalize_nombre`
- **Proposed preamble:**
  - **Contexto:** un contrato solo en prosa se pudre; un `assert` de ejemplo lo mantiene vivo.
  - **Meta:** implementar nombre (colapsa + title) y **verificar** la post con asserts.
  - **Éxito:** `Ana María` y `post OK`.
  - **Límites:** no borres los asserts; no cambies el expected del gate.
- **Proposed instruction/description improvements:**
  1. El starter solo hace `strip` (rompe dobles espacios y title).
  2. Implementa colapso + `.title()`.
  3. Deja los asserts de igualdad y de forma (sin extremos ni dobles espacios).
  4. Confirma `post OK`.
- **Proposed retrospective:** Contrato + assert de ejemplo = especificación ejecutable. Si mañana cambias la política, actualizas expected **a propósito**, no “para que pase en verde”. En T2-B verás hints y errores sin abortar el lote.
- **Code/output changes:** none
- **Validation notes:** —

---

### S05-T2-B-DEMO (iDo)
- **Diagnosis:** Tupla `(ok, value, err)` clara. Sin preámbulo de “lote no aborta”; `why` mínimo.
- **Checklist:** context **fail** / goal **fail** / success **pass** / constraints **fail** / retrospective **fail**
- **Severity:** **P1**
- **Proposed title:** N/A
- **Proposed preamble:** A veces el core no debe lanzar: el lote de teléfonos sintéticos debe **seguir** tras un valor inválido. Observa `norm_tel` con hints y retorno `(bool, Optional[str], Optional[str])`: éxito con 9 dígitos, fallo con mensaje, y guiones que se limpian. Los hints documentan la forma; no validan en runtime. Sigue las tres filas del `for`.
- **Proposed instruction/description improvements:** `why` ampliado: diferencia raise (contrato estricto) vs tupla (borde tolerante); hints como contrato para humanos/mypy.
- **Proposed retrospective:** Elegir raise o tupla es decisión de diseño del módulo: sé consistente. En We Do verás que el hint `-> int` no impide devolver un `str` por error.
- **Code/output changes:** none
- **Validation notes:** —

---

### S05-T2-B-E1 (weDo, guided)
- **Diagnosis:** Pedagogía sutil (hints no validan runtime) pero la instruction es larga y el “print la nota exacta” se siente artificial sin preamble. Defect `return str(len(s))` es bueno.
- **Checklist:** context **partial** / goal **partial** / success **pass** / constraints **fail** / retrospective **fail**
- **Severity:** **P0**
- **Proposed title:** Hints no validan en runtime
- **Proposed preamble:**
  - **Contexto:** anotar `-> int` en un helper de intake no convierte ni chequea tipos al ejecutar.
  - **Meta:** devolver un `int` real y dejar explícito que el hint es contrato estático.
  - **Éxito:** `3` y la línea exacta `hint no valida en runtime`.
  - **Límites:** no uses `isinstance` mágico “porque el hint lo pide”; no cambies el texto de la nota.
- **Proposed instruction/description improvements:**
  1. El starter retorna `str(len(s))` pese al hint `-> int`.
  2. Corrige el return a `len(s)`.
  3. Imprime el resultado de `'abc'`.
  4. Imprime la nota exacta pedida (demo de humildad del hint).
- **Proposed retrospective:** Los hints ayudan a humanos y typecheckers; la validación de dominio es código (`if`, `raise`, parse). Mentir en el hint (`-> str` cuando devuelves `None`) es peor que no anotar.
- **Code/output changes:** none (la frase exacta es parte del test — no cambiar)
- **Validation notes:** El print de la nota es un poco “teatro”; el preamble debe justificarlo como demostración, no como relleno.

---

### S05-T2-B-E2 (weDo, independent)
- **Diagnosis:** Buen ejercicio de dominio (0 válido, negativo no, no-int). Instruction no separa con claridad “error de parse” vs “regla de negocio”.
- **Checklist:** context **fail** / goal **partial** / success **pass** / constraints **fail** / retrospective **fail**
- **Severity:** **P0**
- **Proposed title:** Parsear monto con tupla de dominio
- **Proposed preamble:**
  - **Contexto:** montos sintéticos del intake pueden venir sucios; el lote no debe caerse en la primera basura.
  - **Meta:** devolver `(ok, value, err)` separando no-entero vs negativo.
  - **Éxito:** cuatro líneas para `0`, `10`, `-1`, `x` como en la solución.
  - **Límites:** `0` es válido; no uses `raise` aquí (estrategia tupla).
- **Proposed instruction/description improvements:**
  1. El starter acepta negativos y explota en no-enteros.
  2. `try/except` para parse a int.
  3. Si `n < 0`, error de dominio (no crash).
  4. Recorre los cuatro valores e imprime cada resultado.
- **Proposed retrospective:** ValueError de `int()` es fallo de forma; “negativo no permitido” es regla de negocio. Mezclarlos en un solo mensaje opaco complica el triage del ETL.
- **Code/output changes:** none (preservar mensajes de la solución canónica)
- **Validation notes:** —

---

### S05-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Diseño limpio core estricto + borde tolerante. Starter incompleto; instruction pide print de estrategia — sin preamble se siente cosmético.
- **Checklist:** context **partial** / goal **partial** / success **pass** / constraints **partial** / retrospective **fail**
- **Severity:** **P0**
- **Proposed title:** Raise en el core, SKIP en el borde
- **Proposed preamble:**
  - **Contexto:** el normalizador de email del gate es estricto; el **lote** debe tolerar filas malas sin abortar todo.
  - **Meta:** `raise` en el core + `try/except` por fila en el borde.
  - **Éxito:** línea de estrategia, `OK ok@ex.com` y `SKIP malo ...`.
  - **Límites:** no pongas el `try` dentro del normalizador puro; no inventes PII.
- **Proposed instruction/description improvements:**
  1. El starter no valida `@` y etiqueta todo como OK.
  2. En `normalize_email`, raise si falta `@`.
  3. En el loop, captura `ValueError` y marca SKIP.
  4. Documenta la estrategia en un print legible.
- **Proposed retrospective:** Core estricto + borde tolerante es un diseño limpio: tests del core no necesitan capturar stdout ni “filas hermanas”. El error de una fila no borra el lote.
- **Code/output changes:** none
- **Validation notes:** Texto de `estrategia: ...` debe coincidir con output canónico o actualizarse a la par si el Fixer lo unifica.

---

### S05-T3-A-DEMO (iDo)
- **Diagnosis:** Composición strip/email/orquestador clara. Sin preámbulo de “orquestador delgado”; `why` de una frase.
- **Checklist:** context **fail** / goal **fail** / success **pass** / constraints **fail** / retrospective **fail**
- **Severity:** **P1**
- **Proposed title:** N/A
- **Proposed preamble:** Cuando el registro sintético tiene varios campos, **no** metas todas las políticas en un solo bloque monstruoso. Observa piezas pequeñas (`strip_collapse`, `norm_email`) y un orquestador `normalize_pair` que solo compone y arma el dict. El orquestador no reimplementa reglas: llama. Sigue el print del par nombre/email ya canónico.
- **Proposed instruction/description improvements:** `why` con pureza por pieza + testabilidad.
- **Proposed retrospective:** Si el orquestador vuelve a copiar `strip/lower/title` inline, el PR se vuelve inmantenible. En We Do extraerás helpers y descompondrás un monstruo.
- **Code/output changes:** none
- **Validation notes:** —

---

### S05-T3-A-E1 (weDo, guided)
- **Diagnosis:** Extracción de helper bien acotada. Falta decir *por qué* testear `strip_collapse` solo.
- **Checklist:** context **fail** / goal **partial** / success **pass** / constraints **partial** / retrospective **fail**
- **Severity:** **P0**
- **Proposed title:** Extraer `strip_collapse` y componer
- **Proposed preamble:**
  - **Contexto:** el colapso de espacios se reutiliza en nombre, dirección y más.
  - **Meta:** extraer el helper y usarlo dentro de `normalize_nombre` + `.title()`.
  - **Éxito:** línea exacta `Ana María`.
  - **Límites:** no reimplementes el colapso dentro del normalizador; no omitas title.
- **Proposed instruction/description improvements:**
  1. Completa `strip_collapse` (hoy es identidad).
  2. `normalize_nombre` debe llamar al helper y luego `.title()`.
  3. No dejes solo `raw.strip().title()` (falla con dobles espacios).
  4. Verifica `Ana María`.
- **Proposed retrospective:** Piezas pequeñas se testean solas; el normalizador solo orquesta dos pasos. Composición > copy-paste de `join/split` en cinco sitios.
- **Code/output changes:** none
- **Validation notes:** —

---

### S05-T3-A-E2 (weDo, independent)
- **Diagnosis:** Orquestador delgado con helpers ya correctos — defect en que no los llama. Pedagógicamente fuerte; falta framing.
- **Checklist:** context **fail** / goal **partial** / success **pass** / constraints **partial** / retrospective **fail**
- **Severity:** **P0**
- **Proposed title:** Orquestador que solo llama helpers
- **Proposed preamble:**
  - **Contexto:** `normalize_contact` arma el dict de un registro sintético de contacto.
  - **Meta:** devolver el dict **solo** vía `norm_n` / `norm_e` (sin reimplementar).
  - **Éxito:** `{'nombre': 'Luis', 'email': 'l@e.com'}`.
  - **Límites:** no hagas `strip` manual en el orquestador; respeta el raise de email en el helper.
- **Proposed instruction/description improvements:**
  1. Los helpers ya implementan la política del gate.
  2. El fallo está en `normalize_contact`: no los invoca.
  3. Retorna el dict con ambas claves normalizadas.
  4. Imprime el resultado del print del starter.
- **Proposed retrospective:** Un orquestador delgado no “sabe” de title ni de `@`: delega. Así un cambio de política se toca en un solo helper.
- **Code/output changes:** none
- **Validation notes:** —

---

### S05-T3-A-E3 (weDo, transfer)
- **Diagnosis:** Monstruo a descomponer — buen E3. Instruction OK; sin preamble de code review / PR.
- **Checklist:** context **partial** / goal **partial** / success **pass** / constraints **partial** / retrospective **fail**
- **Severity:** **P0**
- **Proposed title:** Descomponer el monstruo de tres campos
- **Proposed preamble:**
  - **Contexto:** tres políticas (nombre, email, tel) mezcladas en un solo `def` son deuda que un revisor de CP-N1-B rechaza.
  - **Meta:** tres funciones + orquestador delgado, misma salida.
  - **Éxito:** dict `nombre`/`email`/`tel` canónicos.
  - **Límites:** no dejes reglas de negocio dentro del orquestador final.
- **Proposed instruction/description improvements:**
  1. Lee el monstruo: tres políticas inline.
  2. Extrae `n_nombre`, `n_email`, `n_tel` (nombres libres si son claros).
  3. `normalize_all` solo llama y arma el dict.
  4. Misma salida que el starter al imprimir.
- **Proposed retrospective:** Si el monstruo vuelve, el PR se rechaza: no por estética, sino porque no puedes testear ni reutilizar políticas. El You Do te pedirá el mismo diseño con cuatro campos.
- **Code/output changes:** none
- **Validation notes:** —

---

### S05-T3-B-DEMO (iDo)
- **Diagnosis:** Idempotencia enseñada con claridad en código. Falta anclar `f(f(x))==f(x)` en el gate antes de mirar el loop.
- **Checklist:** context **fail** / goal **fail** / success **pass** / constraints **fail** / retrospective **fail**
- **Severity:** **P1**
- **Proposed title:** N/A
- **Proposed preamble:** Un normalizador de teléfono del gate es **puro** (solo dígitos, sin I/O) e **idempotente**: aplicarlo dos veces no cambia el canónico. Observa `once` y `twice` en tres samples con guiones, paréntesis y ya-limpio. El flag `idem=` debe ser `True` en todos. No hay `print` dentro de la función.
- **Proposed instruction/description improvements:** `why` con definición formal de idempotencia y por qué importa re-procesar lotes.
- **Proposed retrospective:** Idempotencia es el test mínimo del gate: re-correr el ETL no debe “seguir transformando”. En We Do lo demostrarás con una línea `999000 True`.
- **Code/output changes:** none
- **Validation notes:** —

---

### S05-T3-B-E1 (weDo, guided)
- **Diagnosis:** Defect sutil (`replace` de espacios deja guiones; idempotencia “pasa” mal conceptualmente). Instruction densa; merece preamble de pureza.
- **Checklist:** context **partial** / goal **partial** / success **pass** / constraints **partial** / retrospective **fail**
- **Severity:** **P0**
- **Proposed title:** Teléfono puro e idempotente
- **Proposed preamble:**
  - **Contexto:** el gate pide dígitos-only en demo de teléfono e idempotencia demostrable.
  - **Meta:** función pura sin print interno + `f(f(x))==f(x)`.
  - **Éxito:** línea exacta `999000 True`.
  - **Límites:** no imprimas dentro de `normalize_tel`; no dejes guiones.
- **Proposed instruction/description improvements:**
  1. El starter solo quita espacios; deja guiones.
  2. Filtra con `isdigit` (o equivalente claro).
  3. Calcula `once` y compara con `normalize_tel(once)`.
  4. Imprime valor y booleano en el caller.
- **Proposed retrospective:** Idempotencia es el test mínimo del gate. Pureza (sin print/I/O) permite testear sin capturar stdout. Si `f(x)` aún tiene basura, `f(f(x))` puede “parecer” estable y aun así estar mal respecto a la política.
- **Code/output changes:** none
- **Validation notes:** El starter puede dar `999-000 True` (idempotente pero **incorrecto** de política) — el preamble debe avisar ese engaño.

---

### S05-T3-B-E2 (weDo, independent)
- **Diagnosis:** I/O al borde — skill central. Falta enmarcar “por qué el print en el core rompe tests”.
- **Checklist:** context **partial** / goal **partial** / success **pass** / constraints **partial** / retrospective **fail**
- **Severity:** **P0**
- **Proposed title:** Print al borde, email puro
- **Proposed preamble:**
  - **Contexto:** un `print` dentro del normalizador contamina tests y logs del ETL.
  - **Meta:** core puro (strip+lower + `@`) y reporte solo en `print_report`.
  - **Éxito:** `email= z@w.com`.
  - **Límites:** sin print en `normalize_email`; valida `@`.
- **Proposed instruction/description improvements:**
  1. Saca el print del core.
  2. Añade validación de `@` con raise.
  3. `print_report` imprime el valor retornado.
  4. Ejecuta el call del starter.
- **Proposed retrospective:** Efectos al borde, pureza al centro. El core se testea con asserts; el borde formatea. Ese hábito escala a CLI y a S08 (archivos) sin reescribir reglas.
- **Code/output changes:** none
- **Validation notes:** —

---

### S05-T3-B-E3 (weDo, transfer)
- **Diagnosis:** Inyección de dependencia simple — excelente E3. Instruction breve; falta el *por qué* de tests con fakes.
- **Checklist:** context **fail** / goal **partial** / success **pass** / constraints **fail** / retrospective **fail**
- **Severity:** **P0**
- **Proposed title:** Inyectar el normalizador
- **Proposed preamble:**
  - **Contexto:** a veces el procesador de línea no debe hardcodear la política: la recibe inyectada.
  - **Meta:** `process(line, norm=...)` usa la fn inyectada, no ignora el parámetro.
  - **Éxito:** `999` y `999-A`.
  - **Límites:** no llames siempre `normalize_tel` a mano dentro de `process`.
- **Proposed instruction/description improvements:**
  1. El starter recibe `norm` pero llama siempre a `normalize_tel`.
  2. Retorna `norm(line)`.
  3. Demuestra default (dígitos) y lambda upper+strip.
  4. Compara las dos salidas.
- **Proposed retrospective:** Inyectar la fn permite tests con fakes sin monkeypatch. Es el mismo espíritu de “orquestador delgado”: el borde elige política; la pieza hace el trabajo.
- **Code/output changes:** none
- **Validation notes:** —

---

### S05-T4-A-DEMO (iDo)
- **Diagnosis:** Closure factory clara. Sin preámbulo LEGB/enclosing; `why` mínimo.
- **Checklist:** context **fail** / goal **fail** / success **pass** / constraints **fail** / retrospective **fail**
- **Severity:** **P1**
- **Proposed title:** N/A
- **Proposed preamble:** A veces fijas una política regional (prefijo `+51`) **sin** clase ni global mutable. Observa `make_norm`: la función interna **cierra** `prefix` del enclosing scope y lo reutiliza en cada llamada. No hay `global`. Compara las dos salidas del mismo `pe` con raw distinto (con y sin guiones en dígitos).
- **Proposed instruction/description improvements:** `why` con LEGB y por qué el enclosing supera un global de configuración.
- **Proposed retrospective:** La interna recuerda el enclosing sin ensuciar el namespace global. En We Do verás primero que una asignación local no pisa el global, y luego armarás factories PE/CL.
- **Code/output changes:** none
- **Validation notes:** —

---

### S05-T4-A-E1 (weDo, guided)
- **Diagnosis:** LEGB local vs global; starter engañoso (imprime `in` con el global). Instruction OK; sin framing conceptual previo.
- **Checklist:** context **fail** / goal **partial** / success **pass** / constraints **fail** / retrospective **fail**
- **Severity:** **P0**
- **Proposed title:** Local no pisa el global
- **Proposed preamble:**
  - **Contexto:** confundir scope es una fuente clásica de bugs “imposibles” en scripts de normalización.
  - **Meta:** ver que asignar `x` dentro de `f` crea **local**; el global sigue en 1.
  - **Éxito:** `in 2` y `out 1`.
  - **Límites:** no uses `global x` (ese es otro camino, no el de este ejercicio).
- **Proposed instruction/description improvements:**
  1. El starter imprime dos veces el global tras `f()`.
  2. Imprime `in` **dentro** de `f` tras `x = 2`.
  3. Fuera, imprime `out` con el global.
  4. Confirma las dos líneas exactas.
- **Proposed retrospective:** Asignar dentro crea local; el global no cambia sin `global`. LEGB no es trivia de examen: evita mutar configuración de política desde helpers.
- **Code/output changes:** none
- **Validation notes:** —

---

### S05-T4-A-E2 (weDo, independent)
- **Diagnosis:** Closure PE/CL alineada al I Do. Falta job hook de prefijos regionales sintéticos.
- **Checklist:** context **fail** / goal **partial** / success **pass** / constraints **fail** / retrospective **fail**
- **Severity:** **P0**
- **Proposed title:** Factory de prefijo telefónico
- **Proposed preamble:**
  - **Contexto:** demos PE/CL con prefijos sintéticos (`+51`, `+56`) sin clases prematuras.
  - **Meta:** `make_phone_prefix` devuelve una fn que antepone el prefix a los dígitos.
  - **Éxito:** línea exacta `+51999 +56999`.
  - **Límites:** la interna debe cerrar `prefix`; no uses global.
- **Proposed instruction/description improvements:**
  1. El starter calcula dígitos pero olvida anteponer `prefix`.
  2. Retorna `prefix + d`.
  3. Crea `pe` y `cl`.
  4. Un solo print con ambos resultados.
- **Proposed retrospective:** Factories por closure evitan clases prematuras y fijan política regional por instancia de función. Cada factory cierra su propio prefix: no se pisan entre sí.
- **Code/output changes:** none
- **Validation notes:** —

---

### S05-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Factory multipolítica — buen transfer. Starter siempre lower; instruction con éxito claro.
- **Checklist:** context **fail** / goal **partial** / success **pass** / constraints **partial** / retrospective **fail**
- **Severity:** **P0**
- **Proposed title:** Factory multipolítica sin global
- **Proposed preamble:**
  - **Contexto:** a veces la misma fábrica entrega políticas distintas (`digits` vs `lower`) sin variable global de modo.
  - **Meta:** `make_normalizer(mode)` devuelve la fn adecuada cerrando la política.
  - **Éxito:** `12 hola`.
  - **Límites:** sin `global mode`; modes desconocidos pueden fallar con ValueError.
- **Proposed instruction/description improvements:**
  1. El starter ignora `digits` y siempre hace lower.
  2. Ramifica por `mode` y devuelve la fn correcta.
  3. Prueba `d` y `lo` del starter.
  4. Un print, dos resultados.
- **Proposed retrospective:** Config en el enclosing, no en global mutable. Así dos normalizadores conviven en el mismo proceso sin pisarse. Es el mismo espíritu de inyección de T3-B, con fábrica.
- **Code/output changes:** none
- **Validation notes:** —

---

### S05-T4-B-DEMO (iDo)
- **Diagnosis:** Rojo-verde-refactor con suite `examples` — oro pedagógico en código. Falta preámbulo del hábito profesional y retrospective de “no cambies política al refactorizar”.
- **Checklist:** context **fail** / goal **fail** / success **pass** / constraints **fail** / retrospective **fail**
- **Severity:** **P1**
- **Proposed title:** N/A
- **Proposed preamble:** Antes de “embellecer” un normalizador de dirección, fijas **ejemplos/asserts** que capturan la política (upper + colapso + idempotencia). Observa la misma suite en verde **antes y después** de un micro-refactor de implementación. Si el refactor cambiara upper por lower, los asserts gritan. Ese grito es bueno.
- **Proposed instruction/description improvements:** `why` con ciclo verde-refactor-verde y suite como contrato ejecutable.
- **Proposed retrospective:** Refactor sin suite es fe en la suerte. En We Do escribirás asserts de email, repararás un refactor que rompe upper, y armarás una tabla de casos para nombre.
- **Code/output changes:** none
- **Validation notes:** —

---

### S05-T4-B-E1 (weDo, guided)
- **Diagnosis:** “Ejemplos primero” diluido: la fn ya está completa y solo faltan asserts. Instruction lo dice; sin preamble el learner puede solo imprimir y “pasar” a ojo.
- **Checklist:** context **partial** / goal **partial** / success **pass** / constraints **partial** / retrospective **fail**
- **Severity:** **P0**
- **Proposed title:** Asserts de ejemplo para email
- **Proposed preamble:**
  - **Contexto:** el contrato de email del gate debe ser ejecutable, no solo docstring.
  - **Meta:** dos asserts (caso feliz + idempotencia) e imprimir `OK`.
  - **Éxito:** línea exacta `OK` (asserts en silencio).
  - **Límites:** no “arregles” expected a mayúsculas; no omitas idempotencia.
- **Proposed instruction/description improvements:**
  1. La función ya implementa la política.
  2. Añade assert de `'  A@B.COM '` → `'a@b.com'`.
  3. Añade assert de idempotencia.
  4. Imprime solo `OK` si todo pasa.
- **Proposed retrospective:** Ejemplos primero (o al menos junto al código) convierten la política en red de seguridad. Si un assert falla, discutes política — no “el print se veía bien”.
- **Code/output changes:** none
- **Validation notes:** —

---

### S05-T4-B-E2 (weDo, independent)
- **Diagnosis:** Defect excelente (segunda def usa `lower` y rompe política). Instruction avisa; merece preamble de “refactor ≠ cambiar contrato”.
- **Checklist:** context **partial** / goal **partial** / success **pass** / constraints **partial** / retrospective **fail**
- **Severity:** **P0**
- **Proposed title:** Refactor sin romper `upper`
- **Proposed preamble:**
  - **Contexto:** dirección del gate es colapsa + **upper**; un “refactor” a lower es un cambio de política disfrazado.
  - **Meta:** extraer `strip_collapse` y mantener asserts verdes.
  - **Éxito:** asserts de `AV 1` + idempotencia; línea final `JR 2`.
  - **Límites:** no cambies upper por lower; re-ejecuta asserts tras el cambio.
- **Proposed instruction/description improvements:**
  1. La segunda definición rompe la política a propósito.
  2. Extrae colapso a helper.
  3. `normalize_dir` = helper + `.upper()`.
  4. Deja asserts verdes y el print final.
- **Proposed retrospective:** Verde-refactor-verde es el hábito profesional. Si el assert se pone rojo, o el refactor falló o cambiaste el contrato sin documentarlo.
- **Code/output changes:** none
- **Validation notes:** Solución no re-asserta idempotencia tras el refactor (solo `AV 1`); opcionalmente el Fixer puede reinsertar el segundo assert post-refactor sin cambiar output.

---

### S05-T4-B-E3 (weDo, transfer)
- **Diagnosis:** Tabla de casos — cierre perfecto de sección. Starter declara `all PASS` a ciegas (defect pedagogicamente delicioso). Falta preamble de “expected es la política”.
- **Checklist:** context **partial** / goal **partial** / success **pass** / constraints **partial** / retrospective **fail**
- **Severity:** **P0**
- **Proposed title:** Suite tabla para `normalize_nombre`
- **Proposed preamble:**
  - **Contexto:** la política colapsa+title del gate se defiende con una tabla `(input, expected)`.
  - **Meta:** recorrer casos con `assert` e imprimir `PASS` por fila.
  - **Éxito:** `PASS ... → A B`, `PASS X → X`, `all PASS`.
  - **Límites:** no declares PASS sin assert; no cambies expected sin cambiar política a propósito.
- **Proposed instruction/description improvements:**
  1. El starter imprime `all PASS` sin recorrer `cases`.
  2. Loop `for inp, exp in cases`.
  3. Assert igualdad; imprime `PASS` con flecha.
  4. Cierra con `all PASS`.
- **Proposed retrospective:** Tabla de casos = contrato ejecutable del normalizador. Es el mismo espíritu del You Do (`_run_tests`). Si actualizas implementación y expected “para que pase”, estás mintiendo sobre el gate.
- **Code/output changes:** none (formato de `PASS` con espacios del input es sensible — no alterar)
- **Validation notes:** Output canónico tiene espacios visibles en `PASS   a  b  → A B`; el Fixer no debe “limpiarlo”.

---

### youDo — Normalizadores puros (inicio CP-N1-B)
- **Diagnosis:** Mejor unidad de framing de la sección: `context`, objetivos, requirements y rúbrica son accionables; starter con `NotImplementedError` y `_run_tests` guía bien. **Falta `retrospective`** de defensa/portafolio (spec §8.3). Sin ella el learner cierra el proyecto sin metacognición ni frase de impacto.
- **Checklist:** context **pass** / goal **pass** (objectives) / success **pass** (tests en starter) / constraints **pass** / retrospective **fail**
- **Severity:** **P1**
- **Proposed title:** (ya existe) Normalizadores puros (inicio CP-N1-B)
- **Proposed preamble:** N/A como campo nuevo obligatorio — el `context` actual cumple rol de preámbulo de proyecto. Opcional: una viñeta de éxito explícita (“`tests OK` + dict de `main` sin excepciones”) si el Fixer quiere unificar con We Do.
- **Proposed instruction/description improvements:** Ningún cambio estructural. Opcional: en `portfolioNote`, exigir demo de idempotencia pegada en el README (ya implícito en objectives).
- **Proposed retrospective:** Antes de marcar listo: (1) ¿qué assert demuestra idempotencia en **cada** normalizador, no solo en uno? (2) ¿dónde vivirían los `print` y la lectura de archivos si esto pasara a S08 — y por qué **no** están en el core hoy? (3) Escribe en el README una frase de impacto medible (p. ej. “cuatro políticas de CP-N1-B testeables sin abrir CSV”) que puedas defender en 30 segundos. Revisa también que el orquestador no reimplemente reglas.
- **Code/output changes:** none (preservar asserts del starter; nota: clave `nombres` en `normalize_record` vs narrativa “nombre” — no es bug pedagógico de prosa, pero el Fixer no debe “corregir” sin alinear tests)
- **Validation notes:** `normalize_record` usa clave `"nombres"` en el assert `set(r) >= {"nombres", ...}` — coherente con starter; no renombrar en esta campaña salvo decisión de producto.

---

## Priority order

### P0 (hacer primero — We Do sin andamiaje verbal)
Orden sugerido al Fixer (por dependencia pedagógica del hilo, no solo por id):

1. **T1-A E1 → E2 → E3** (return vs print → política nombre → transfer etiqueta)  
2. **T1-B E1 → E2 → E3** (default/keyword → default mutable → keyword-only)  
3. **T2-A E1 → E2 → E3** (docstring → email pre/post → postcondición nombre)  
4. **T2-B E1 → E2 → E3** (hints runtime → parse_monto → raise+borde)  
5. **T3-A E1 → E2 → E3** (extract → orch → monstruo)  
6. **T3-B E1 → E2 → E3** (idempotencia → I/O borde → inyección)  
7. **T4-A E1 → E2 → E3** (LEGB → closure PE/CL → factory multipolítica)  
8. **T4-B E1 → E2 → E3** (asserts email → refactor upper → suite tabla)

En cada We Do: añadir `title`, `preamble`, recortar `instruction` a pasos, `retrospective`, y enriquecer `feedback` (25–60 palabras) sin tocar outputs canónicos.

### P1 (I Do + You Do)
- Las **8 demos I Do**: `preamble` + `retrospective` + expandir `why` al rango del spec.  
- **You Do**: añadir `retrospective` de defensa (texto propuesto arriba).

### P2 (pulido)
- Suavizar hints que pegan la solución completa en E2/E3 (dejar E1 más guiado).  
- Unificar tono de `feedback` (razonamiento, no slogan).  
- Opcional: re-assert de idempotencia post-refactor en T4-B-E2.  
- Aviso pedagógico en T3-B-E1 sobre “idempotente pero política incorrecta”.

---

## Residual risks

1. **Nombre de archivo vs contenido:** `s05-oop.ts` / id `oop` confunde a revisores externos; no es defecto de ejercicios, pero puede desalinear expectativas de “clases”.
2. **Hints spoiling:** si solo se añaden preambles y no se reequilibra el fade de hints, E3 seguirá sabiendo a E1 con otro enunciado.
3. **Outputs frágiles:** varias pruebas dependen de strings exactos (`hint no valida en runtime`, formato `PASS`, mensajes `err`). El Fixer no debe “mejorar” copy de output sin re-ejecutar y actualizar `output`.
4. **Clave `nombres` en You Do:** divergencia menor con el resto de la sección (`nombre`); riesgo de confusión del learner — documentar, no renombrar a ciegas.
5. **Carga cognitiva de 24 We Do:** con preambles bien hechos baja la fricción; sin recortar instructions a “solo pasos”, el stack preamble+instruction largo puede saturar (respetar límites de palabras del spec).
6. **Sin ejecución en este round:** no se re-ejecutó Pyodide; se asume que `solutionCode.output` del fuente es la verdad operativa.

---

## Summary counts

| Tipo | Unidades | Sin preamble | Sin retrospective | Sin title (weDo) | Severidad dominante |
|------|----------|--------------|-------------------|------------------|---------------------|
| iDo  | 8        | 8            | 8                 | N/A              | P1                  |
| weDo | 24       | 24           | 24                | 24               | P0                  |
| youDo| 1        | N/A (context OK) | 1             | title OK         | P1                  |

**Código de ejercicios:** en general **no** requiere cambio pedagógico de lógica; el vacío es de **campos de prosa y metacognición**.

---

*Round 1 — hand review only. No source edits. No bulk generation.*

Section 5 exercise pedagogy review complete. Ready for the Fixer prompt.
