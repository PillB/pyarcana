# S22 Exercise Pedagogy Report (Round 1)

## Section
- **title:** Email, identidad y aprobación humana
- **shortTitle:** Email y aprobación
- **id:** `rapidfuzz-entity` (archivo `s22-rapidfuzz-entity.ts`; contenido = MIME, scopes, drafts, destinatarios, HITL, idempotencia — **no** entity resolution probabilístico profundo)
- **index:** 22
- **source:** `src/lib/course/sections/s22-rapidfuzz-entity.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades de práctica/demo)
- **subtemas:** S22-T1-A MIME multiparte · T1-B templates/sanitización · T2-A OAuth/scopes · T2-B drafts/adaptadores · T3-A resolución/verificación · T3-B listas/CC-BCC/privacidad · T4-A cola de aprobación/SM · T4-B idempotencia/audit/reintento
- **hilo de caso:** Caso 22 / inicio **CP-N2-C** (Canal C: notificación con aprobación humana; paquete de informe S21 → `.eml`/draft sandbox → puente web S23)

## Method
- Leído `PEDAGOGY_EXERCISE_SPEC.md` (campos, longitudes, checklist preamble/retrospective, fade E1→E2→E3).
- Inspeccionado manualmente cada `iDo.steps[]` (8), `weDo.steps[]` (24) y `youDo` en `s22-rapidfuzz-entity.ts` (iDo ~430–677, weDo ~679–1667, youDo ~1669–1782).
- Contrastado con el hilo de la sección: mesa de control, contactos `@example.pe`, draft-only, HITL, match ≠ fraude, key `sha256[:16]`, estados `pending_review` / `needs_edit`.
- **Sin** generadores, bucles, plantillas ni copy-paste mecánico entre unidades.
- Prosa propuesta en **español profesional peruano**, un objetivo primario por unidad.

## Hallazgos transversales (antes del ledger)

| Campo / hábito | Estado actual en S22 |
|----------------|----------------------|
| I Do `preamble` | **Ausente** en las 8 demos |
| I Do `retrospective` | **Ausente** en las 8 demos |
| I Do `description` | Presente y alineada al skill; no sustituye preamble formal |
| I Do `why` | Presente y **útil** (enmarca la *decisión* operativa: draft vs send, host real, BCC, fail-closed); a menudo 1 frase densa — suele quedar bajo el piso 40–90 palabras del spec |
| We Do `title` | **Ausente** en los 24 (solo prefijo “E1/E2/E3 …” dentro de `instruction`) |
| We Do `preamble` | **Ausente** en los 24 |
| We Do `retrospective` | **Ausente** en los 24 |
| We Do `instruction` | Mejor que un drill vacío: nombra defect, Caso 22 y salida exacta; **mezcla** meta + pasos + contrato en un solo bloque; opaca para newbie sin escena de negocio separada |
| We Do `feedback` | Presente en los 24; a menudo nombra el *porqué* del hábito (MIME, XSS, least privilege, match≠fraude). A veces 1 frase corta; poco metacognitivo |
| Starter `# A corregir:` / `# Contrato:` | **Excelente** hábito en casi todos; defectos bien nombrados y alineados a la solución |
| Hints | Progresivos y útiles; E1 casi-spoiling (aceptable guiado); E3 con pistas mínimas |
| You Do marco | `context` / `objectives` / `requirements` / `rubric` / `portfolioNote` / starter **sólidos** y alineados a CP-N2-C |
| You Do `retrospective` | **Ausente** |
| Código / outputs | Coherentes con theory y hilo sintético; **no** proponer cambios de output salvo notas puntuales |

**Patrón dominante:** el andamiaje de *código* (starters con bug nombrado, outputs canónicos, fade real E1→E3 por subtema, gates de seguridad y ética de matching) es maduro y alineado a CP-N2-C. El andamiaje *pedagógico verbal* (preamble → instruction solo-tarea → retrospective) no existe. Un true newbie no responde con claridad: qué practico, por qué importa en una mesa de control de notificaciones, cómo sé que gané, qué debe quedarme al cerrar la pestaña.

**Fade E1→E2→E3 (contenido):** progresión real por subtema (p. ej. T1-A: MIMEText plain → Disposition filename → árbol alternative anidado; T3-A: regex email → dominio allowlisted → score + nota ética; T4-B: key 16 hex → create idempotente → audit create/retry_hit). **No** son tres clones con números distintos. El fade de *prosa* no se ve porque no hay preambles diferenciados.

**Severity default:** missing title+preamble+retrospective en We Do = **P0**; I Do sin preamble/retrospective = **P1** (aún tienen description+why+código); youDo sin retrospective = **P1**; polish de feedback/why = **P2** si caen preamble/instruction/retrospective.

---

## Unit ledger

### S22-T1-A-DEMO (iDo)
- **Diagnosis:** Demo sólida de MIME `mixed` + `alternative` (plain+HTML) + adjunto `run.json` sintético. La `description` nombra el skill; el `why` ancla la decisión “revisor inspecciona `.eml`”. Falta `preamble` que diga *qué observar* (árbol de partes, UTF-8, sin secretos) y `retrospective` del misconception “un string HTML suelto ya es un correo profesional”.
- **Checklist:** context fail · goal partial · success partial (output visible) · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Antes de encolar un borrador de CP-N2-C, el analista debe *ver* un mensaje como árbol MIME, no como un string suelto. En esta demo se arma `mixed` con `alternative` (texto plano + HTML) y un adjunto de meta del run (`run.json`, sin secretos). No escribas aún: sigue los `print` y comprueba que el serializado contiene el adjunto y UTF-8. Si confundes “pegar HTML” con un correo multiparte, el revisor de la mesa no puede auditar el `.eml` con claridad.
- **Proposed instruction/description improvements:**  
  Mantener description. Ampliar `why` (~50–70 palabras): plain+HTML cubre clientes y filtros; el adjunto de meta enlaza el run de S21; `as_string()` permite inspeccionar antes de guardar; nunca tokens ni DNI en cuerpo ni filename; puente a We Do donde se corrigen subtype, Disposition y anidado.
- **Proposed retrospective:**  
  Si puedes explicar por qué un correo de mesa lleva plain y HTML en `alternative` dentro de `mixed`, ya tienes el hábito de árbol MIME. El error clásico es un solo `MIMEText` HTML sin meta del run. En We Do practicarás plain UTF-8, filename legible y el conteo de `Content-Type`.
- **Code/output changes:** none
- **Validation notes:** Output canónico `ok True` / `n_headers_subj 1` alineado a theory T1-A.

---

### S22-T1-A-E1 (weDo, guided)
- **Diagnosis:** Drill guiado claro: starter usa subtype `html` e imprime `'ascii'` hardcodeado. Instruction nombra defect y salida exacta, pero mezcla meta/pasos; sin title, preamble ni retrospective. Feedback de una línea no repara “¿por qué plain primero?”.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** MIMEText plain con charset UTF-8
- **Proposed preamble:**  
  - **Contexto:** el cuerpo mínimo de un borrador de Caso 22 debe ser legible en español peruano y auditable en el `.eml`.  
  - **Meta:** construir un `MIMEText` en texto plano con charset UTF-8 (no HTML ni ascii inventado).  
  - **Éxito:** dos líneas exactas: `text/plain` y `utf-8`.  
  - **Límites:** no uses subtype `html` en este ejercicio; no hardcodees el charset en el segundo print.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `MIMEText(..., 'html', ...)` e imprime `'ascii'` (bug nombrado).  
  2. Cambia el subtype a `'plain'`.  
  3. Imprime `get_content_type()` y `str(get_charset())`.  
  4. No alteres el cuerpo `'Hola'`.
- **Proposed feedback improvement:**  
  `text/plain` + `utf-8` es el cuerpo mínimo legible en español peruano. Si dejas `html` o imprims `ascii`, el revisor ve un tipo incorrecto o mojibake en el `.eml` de laboratorio.
- **Proposed retrospective:**  
  El cuerpo plain con UTF-8 es la base del árbol multiparte. El error clásico es “solo HTML” o un charset hardcodeado. Siguiente (E2): adjunto con `Content-Disposition` y filename legible.
- **Code/output changes:** none
- **Validation notes:** DEFECT bien nombrado; solution y output correctos.

---

### S22-T1-A-E2 (weDo, independent)
- **Diagnosis:** Buen foco independiente: adjunto sin `Name` ni Disposition. Instruction densa pero correcta sobre “Name no basta”. Falta anclar por qué la mesa de control necesita filename legible. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Adjunto con filename en Disposition
- **Proposed preamble:**  
  - **Contexto:** la revisora abre el `.eml` y espera un adjunto con nombre legible, no bytes anónimos.  
  - **Meta:** armar `MIMEMultipart('mixed')` con adjunto y `Content-Disposition` que declare `filename="a.txt"`.  
  - **Éxito:** un solo `True` al buscar `filename="a.txt"` en `as_string()`.  
  - **Límites:** el parámetro `Name` del Content-Type no sustituye la disposición; no inventes otro filename.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: `MIMEApplication(b'x')` sin nombre (bug).  
  2. Pasa `Name='a.txt'` al construir el adjunto.  
  3. Asigna `Content-Disposition` con `filename="a.txt"`.  
  4. Deja el print de contención en el serializado.
- **Proposed retrospective:**  
  Los clientes leen el filename en la disposición; el `Name` del tipo no es el contrato de entrega. Confundir ambos deja adjuntos “sin nombre” en la mesa. Luego (E3) anidas `alternative` y cuentas los `Content-Type`.
- **Code/output changes:** none
- **Validation notes:** E2 con menos migas que E1; edge case de Name vs Disposition bien documentado.

---

### S22-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transferencia real al árbol mixed→alternative→plain+html y conteo de headers. Instruction ya da el número 4; falta escena de “prueba rápida de anidado” y cierre metacognitivo. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Contar Content-Type del árbol anidado
- **Proposed preamble:**  
  - **Contexto:** un borrador profesional no pega plain suelto en `mixed`; anida `alternative` para plain+HTML.  
  - **Meta:** construir mixed → alternative → plain+html y validar el árbol contando headers `Content-Type:`.  
  - **Éxito:** un entero `4`.  
  - **Límites:** no adjuntes solo plain al mixed; orden plain antes de html recomendado; no envíes SMTP.
- **Proposed instruction/description improvements:**  
  1. El starter adjunta solo plain al mixed (bug).  
  2. Crea `MIMEMultipart('alternative')` y adjunta plain + html.  
  3. Adjunta `alt` al `mixed`.  
  4. Imprime `as_string().count('Content-Type:')`.
- **Proposed retrospective:**  
  Contar `Content-Type` es la prueba rápida de que el anidado quedó bien (raíz, alt, plain, html). El error clásico es un solo attach sin capa alternative. Pregunta de cierre: ¿qué faltaría para el adjunto de meta del run en el You Do?
- **Code/output changes:** none
- **Validation notes:** Transfer auténtico; alineado a demo T1-A y theory.

---

### S22-T1-B-DEMO (iDo)
- **Diagnosis:** Worked example claro: escape + allowlist de host real; bloquea `evil.test` y el bypass `example.pe.evil.test`. Description OK; falta preamble que motive XSS/phishing interno y retrospective del misconception “si contiene example.pe ya es seguro”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Un template de correo interpola datos de negocio; cualquier fragmento no confiable es un vector. En esta demo se escapa HTML y se valida el **host real** de cada URL (no un substring). Observa tres destinos: un host malicioso, `example.pe` legítimo y el bypass `example.pe.evil.test`. No escribas: predice qué queda como enlace y qué se bloquea. Si confías en `'example.pe' in url`, el phishing interno gana.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: escape contextual es el primer control; parsear host evita el bypass de subdominio malicioso; el curso rechaza substring como solución; puente a We Do (escape, interpolación, allowlist con `urlparse`).
- **Proposed retrospective:**  
  Host real + escape es el hábito anti-XSS del canal de correo. El error clásico es confiar en substring del dominio. We Do: escapar script, saludar con nombre seguro y clasificar URLs con igualdad exacta de host.
- **Code/output changes:** none

---

### S22-T1-B-E1 (weDo, guided)
- **Diagnosis:** Bug simple (print crudo vs `html.escape`) bien diseñado. Instruction telegráfica; no ancla el riesgo XSS en el cuerpo del borrador. Sin preamble/title/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Escapar fragmento con html.escape
- **Proposed preamble:**  
  - **Contexto:** un fragmento de usuario o de OCR no debe convertirse en markup activo dentro del correo de Caso 22.  
  - **Meta:** aplicar `html.escape` antes de mostrar el fragmento.  
  - **Éxito:** una línea `&lt;script&gt;x&lt;/script&gt;`.  
  - **Límites:** no imprimes el crudo; no uses un sanitizador inventado; datos sintéticos.
- **Proposed instruction/description improvements:**  
  1. El starter imprime `raw` sin escape (bug).  
  2. Importa `html` (ya está).  
  3. Imprime `html.escape` del fragmento con script.  
  4. No alteres el string de prueba.
- **Proposed retrospective:**  
  `html.escape` es el primer control obligatorio del template. El error clásico es confiar en el string “porque viene del directorio”. Siguiente (E2): interpolar el nombre solo después de escapar.
- **Code/output changes:** none

---

### S22-T1-B-E2 (weDo, independent)
- **Diagnosis:** Interpolación sin escape — patrón correcto de E2. Feedback bueno (“trátarlo como no confiable”). Falta preamble de escena y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Saludar con nombre ya escapado
- **Proposed preamble:**  
  - **Contexto:** el nombre del destinatario puede traer tags de un OCR o de un campo sucio; el saludo no debe activar markup.  
  - **Meta:** interpolar `<b>Ana</b>` solo después de `html.escape`.  
  - **Éxito:** `Hola &lt;b&gt;Ana&lt;/b&gt;`.  
  - **Límites:** no concatenes el name crudo; evita doble escape si el template ya escapa (aquí no).
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: `'Hola ' + name` sin escape (bug).  
  2. Escapa `name` con `html.escape`.  
  3. Concatena e imprime solo la línea pedida.  
  4. No uses f-string con HTML crudo.
- **Proposed retrospective:**  
  Escapa primero, saluda después: orden del hábito, no detalle de estilo. Confundir “nombre del directorio = confiable” abre XSS en el cuerpo. Luego (E3) clasificas URLs con host real, no con substring.
- **Code/output changes:** none

---

### S22-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Transferencia ética/técnica fuerte: allowlist de host con `urlparse`; menciona mentalmente el bypass `example.pe.evil.test`. Starter marca todo ok. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Allowlist de host real con urlparse
- **Proposed preamble:**  
  - **Contexto:** un enlace en el borrador de revisión puede ser phishing si el host no está en la allowlist del laboratorio.  
  - **Meta:** clasificar URLs aceptando solo host exactamente `example.pe` vía `urlparse`.  
  - **Éxito:** dos líneas — `https://example.pe/a ok` y `https://evil.test blocked`.  
  - **Límites:** igualdad exacta de host (no `'example.pe' in url`); el bypass `example.pe.evil.test` no debe pasar en tu prueba mental.
- **Proposed instruction/description improvements:**  
  1. El starter imprime siempre `ok` (bug).  
  2. Obtén `urlparse(u).hostname`.  
  3. Imprime `ok` solo si host == `'example.pe'`; si no, `blocked`.  
  4. No uses substring del URL completo.
- **Proposed retrospective:**  
  Parsear el host real cierra el bypass de subdominio malicioso. El error clásico es substring del dominio. Pregunta de cierre: ¿por qué `example.pe.evil.test` engañaría a un `in url` y no a `hostname ==`?
- **Code/output changes:** none
- **Validation notes:** Alineado a demo T1-B y callout danger de theory.

---

### S22-T2-A-DEMO (iDo)
- **Diagnosis:** Demo clara de least privilege: filtra requested a policy_max y deniega send/full. Description OK; `why` corto pero decidido. Falta preamble de “token filtrado” y retrospective del misconception “más scopes = bot más capaz y mejor”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Un bot de notificaciones de CP-N2-C solo necesita crear drafts, no enviar ni administrar. En esta demo se piden scopes sintéticos (`mail.draft`, `mail.send`, `mail.full`) y una política máxima de laboratorio filtra lo concedido. No escribas: predice qué queda en `granted` y qué se deniega. Si dejas `mail.full` “por si acaso”, un token filtrado multiplica el daño en la mesa de control.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: least privilege es diseño de producto; en Gmail real los URI de scope no magizan “solo draft”; el fail-closed de envío sigue siendo HITL + política de aplicación.
- **Proposed retrospective:**  
  Granted debe ser la intersección con lo permitido, no la lista soñada. El error clásico es pedir `mail.full` “para no fallar después”. We Do: filtrar a allowed, `isdisjoint` con peligrosos y clasificar tokens por expiración.
- **Code/output changes:** none

---

### S22-T2-A-E1 (weDo, guided)
- **Diagnosis:** Intersección requested∩allowed con bug de print completo. Instruction clara en salida; sin escena de seguridad. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Filtrar scopes a la intersección allowed
- **Proposed preamble:**  
  - **Contexto:** el pipeline de Caso 22 pidió scopes de más; la política de laboratorio debe dejar solo lo permitido.  
  - **Meta:** filtrar `requested` a la intersección con `allowed`.  
  - **Éxito:** una línea `['mail.draft']`.  
  - **Límites:** no imprimes la lista completa; no inventes scopes; datos sintéticos (no OAuth real).
- **Proposed instruction/description improvements:**  
  1. El starter imprime `requested` sin filtrar (bug).  
  2. Construye la lista de scopes que están en `allowed`.  
  3. Imprime solo esa lista.  
  4. No borres `mail.full` del requested a mano: filtra con membership.
- **Proposed retrospective:**  
  Least privilege se demuestra con la intersección, no con un comentario en el README. El error clásico es “devolver requested completo”. Siguiente (E2): comprobar que granted no toca scopes peligrosos.
- **Code/output changes:** none

---

### S22-T2-A-E2 (weDo, independent)
- **Diagnosis:** Bug de lógica invertida en `isdisjoint` — excelente para E2. Feedback nombra el falso “seguro”. Falta preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** isdisjoint frente a scopes peligrosos
- **Proposed preamble:**  
  - **Contexto:** un hallazgo de seguridad del diseño es `mail.full` o `admin` en `granted` de un bot de drafts.  
  - **Meta:** comprobar con `set.isdisjoint` que `granted` no solapa el conjunto peligroso.  
  - **Éxito:** un solo `True`.  
  - **Límites:** no inviertas la lógica con `not`; no mutes `granted`.
- **Proposed instruction/description improvements:**  
  1. El starter usa `not bad.isdisjoint(granted)` (bug).  
  2. Imprime `bad.isdisjoint(granted)` sin negar.  
  3. Deja los sets del fixture.  
  4. Interpreta True = sin intersección peligrosa.
- **Proposed retrospective:**  
  `isdisjoint True` es evidencia de least privilege, no un detalle de set. Invertir la lógica da un falso “seguro” cuando hay solape. Luego (E3) clasificas credenciales por `expires_at` vs now.
- **Code/output changes:** none

---

### S22-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Transferencia a expiración de token/draft (refresh vs valid). Starter invierte comparación. Bien alineado a adaptadores. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Clasificar expires_at: refresh o valid
- **Proposed preamble:**  
  - **Contexto:** un token o draft caducado no debe entrar a la cola de envío simulada de CP-N2-C.  
  - **Meta:** clasificar dos `expires_at` sintéticos frente a `now` UTC: caducado → `refresh`, vigente → `valid`.  
  - **Éxito:** dos líneas `refresh` luego `valid`.  
  - **Límites:** `exp < now` → refresh; no inviertas la comparación; sin SMTP.
- **Proposed instruction/description improvements:**  
  1. El starter imprime `valid` cuando `exp < now` (bug).  
  2. Invierte la condición: caducado → `refresh`.  
  3. Conserva el orden del for (pasado, futuro).  
  4. No hardcodees las dos strings fuera del if.
- **Proposed retrospective:**  
  Comparar al revés deja pasar credenciales expiradas. El hábito es “caducado = refresh, no valid”. Pregunta de cierre: ¿por qué un draft caducado tampoco se promueve aunque el token OAuth siga vivo?
- **Code/output changes:** none
- **Validation notes:** Nota: el subtema es OAuth/scopes; el E3 transfiere a expiración (útil y coherente con T2-B, pero el Fixer puede anclar en preamble que el mismo reloj aplica a token y draft).

---

### S22-T2-B-DEMO (iDo)
- **Diagnosis:** Demo de adaptador con create + expired. Description y why anclan regeneración por cifras de S21. Falta preamble de patrón adaptador y retrospective del misconception “si el draft existe, se puede enviar”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El workflow de aprobación no debe acoplarse al SDK de Gmail: llama `create_draft` y pregunta si el borrador sigue usable. En esta demo un adaptador en memoria crea un draft con expiración y reporta si ya caducó. No escribas: observa id, `expired` y el tamaño del store. Si promueves un draft viejo, la revisora aprueba cifras del informe que ya no existen en S21.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: expiración fuerza regenerar y reaprobar; el adaptador es dueño del ciclo de vida; solo `.eml`/sandbox en el curso.
- **Proposed retrospective:**  
  Draft usable = status draft y `now < expires_at`. El error clásico es reutilizar un id caducado “porque ya está en el store”. We Do: status vs key del store, comparación de usable y mini adaptador con ids secuenciales.
- **Code/output changes:** none

---

### S22-T2-B-E1 (weDo, guided)
- **Diagnosis:** Excelente bug conceptual: confunde key del store (`d001`) con status de workflow (`draft`). Instruction ya lo nombra; falta preamble que separe “id vs estado”. Sin title/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Status de workflow, no la key del store
- **Proposed preamble:**  
  - **Contexto:** la cola de aprobación lee el **status** del draft (`draft`, `pending_review`…), no el id del diccionario.  
  - **Meta:** registrar un borrador sintético e imprimir status y subject del valor, no las keys.  
  - **Éxito:** dos líneas — `draft` y `Informe sintético CP-N2-C`.  
  - **Límites:** no imprimes `list(store.keys())`; no inventes otro id.
- **Proposed instruction/description improvements:**  
  1. El starter imprime dos veces la key del store (bug).  
  2. Lee `store['d001']['status']` y `['subject']`.  
  3. Imprime en ese orden.  
  4. No borres el dict del starter.
- **Proposed retrospective:**  
  El id identifica el registro; el status mueve la máquina de estados. Confundirlos rompe la cola humana. Siguiente (E2): decidir usable con `now < expires_at`.
- **Code/output changes:** none

---

### S22-T2-B-E2 (weDo, independent)
- **Diagnosis:** Comparación invertida de usable. Feedback bueno. Sin preamble/title/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Draft usable solo si no expiró
- **Proposed preamble:**  
  - **Contexto:** el draft de Caso 22 expiró hace 1 s; no debe promoverse a envío simulado.  
  - **Meta:** decidir usable con `now < expires_at`.  
  - **Éxito:** un solo `False`.  
  - **Límites:** no uses `now > expires_at` como “usable”; no regeneres el draft aquí.
- **Proposed instruction/description improvements:**  
  1. El starter imprime `now > expires_at` (bug: True cuando ya expiró).  
  2. Cambia a `now < expires_at`.  
  3. Deja el fixture de 1 s en el pasado.  
  4. Imprime solo el booleano.
- **Proposed retrospective:**  
  Usable es una pregunta de reloj, no de existencia del id. El error clásico es invertir la comparación y “validar” lo caducado. Luego (E3) implementas create con ids secuenciales y expires_at.
- **Code/output changes:** none

---

### S22-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Mini adaptador: ids secuenciales, expires_at, usable. Starter reutiliza d001 y reporta usable al revés — transferencia real. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Adaptador: ids d001/d002 y usable
- **Proposed preamble:**  
  - **Contexto:** el adaptador es el único dueño del ciclo de vida del draft en el laboratorio de CP-N2-C.  
  - **Meta:** implementar `create_draft()` con ids `d{len+1:03d}`, status `draft` y `expires_at = now+1h`; reportar usable del segundo.  
  - **Éxito:** `d001 d002` y `usable True`.  
  - **Límites:** no reutilices siempre `d001`; no inventes SMTP; thread-safety fuera de alcance.
- **Proposed instruction/description improvements:**  
  1. El starter fija `d001`, no guarda expiración e imprime usable False (bugs).  
  2. Genera id con `f"d{len(store)+1:03d}"`.  
  3. Guarda status y expires_at.  
  4. Imprime ambos ids y `usable` del segundo con `now < expires_at` y status draft.
- **Proposed retrospective:**  
  Ids secuenciales + expires_at en el store separan adaptador de workflow. El error clásico es un id fijo que colisiona al reintentar. Pregunta de cierre: ¿quién debe llamar `is_usable`, el job de envío o el adaptador?
- **Code/output changes:** none

---

### S22-T3-A-DEMO (iDo)
- **Diagnosis:** Demo de verified/rejected/unresolved + disclaimer match≠fraude. Why sólido. Falta preamble de fail-closed sin verified y retrospective del misconception “email similar = culpable”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Antes de poner un `To:` en el borrador, el pipeline resuelve y verifica al destinatario sintético. En esta demo tres ids: dominio allowlisted, dominio externo y no encontrado. Observa los estados `verified` / `rejected` / `unresolved` y el disclaimer final. No escribas: predice qué id puede entrar al draft. Matching de nombres o emails no prueba fraude ni parentesco — solo prioriza entrega correcta.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: sin verified, fail-closed; dominio allowlisted es gate de laboratorio; disclaimer anti-claim es parte del producto, no un comentario opcional.
- **Proposed retrospective:**  
  Solo contactos verificados entran al To. El error clásico es tratar un match alto como prueba de identidad o fraude. We Do: formato de email, dominio allowlisted y score con nota `match_no_es_fraude`.
- **Code/output changes:** none

---

### S22-T3-A-E1 (weDo, guided)
- **Diagnosis:** Regex de formato con starter que siempre True. Feedback bueno. Sin preamble/title/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Validar formato básico de email
- **Proposed preamble:**  
  - **Contexto:** sin `@` y dominio no hay `To:` que verificar en Caso 22.  
  - **Meta:** validar formato con `re.match` sobre `ana@example.pe` y `bad`.  
  - **Éxito:** dos líneas `… True` y `… False`.  
  - **Límites:** no valida DNS real; no marques siempre True; datos sintéticos.
- **Proposed instruction/description improvements:**  
  1. El starter imprime siempre True (bug).  
  2. Usa el patrón ya definido con `re.match`.  
  3. Imprime email y `bool` del match.  
  4. No cambies las dos direcciones de prueba.
- **Proposed retrospective:**  
  Formato básico es el primer filtro, no la verificación completa. El error clásico es hardcodear True “porque el fixture se ve bien”. Siguiente (E2): resolver id y chequear dominio allowlisted.
- **Code/output changes:** none

---

### S22-T3-A-E2 (weDo, independent)
- **Diagnosis:** Resolver C001 sin chequear dominio — buen E2. Feedback fail-closed claro. Sin preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Verificar dominio allowlisted de C001
- **Proposed preamble:**  
  - **Contexto:** resolver el id del directorio no basta: el email debe vivir en `@example.pe` de laboratorio.  
  - **Meta:** marcar `verified` solo si existe y el dominio está allowlisted.  
  - **Éxito:** una línea `verified`.  
  - **Límites:** no marques verified solo por `dict.get`; sin PII real.
- **Proposed instruction/description improvements:**  
  1. El starter verifica solo existencia de email (bug).  
  2. Exige `endswith('@example.pe')` (o split del dominio).  
  3. Imprime `verified` o `rejected`.  
  4. No inventes otros contactos.
- **Proposed retrospective:**  
  Resolve + dominio allowlisted es el contrato de entrega del lab. El error clásico es “si está en el directorio, ya está”. Luego (E3) un score de similitud con nota ética obligatoria.
- **Code/output changes:** none

---

### S22-T3-A-E3 (weDo, transfer)
- **Diagnosis:** **Unidad ética crítica:** score 0.86 con etiqueta `fraude_probable` en el starter — transferencia real de producto. Feedback excelente. Falta preamble que separe score de claim y retrospective formal.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Score de match con nota no-fraude
- **Proposed preamble:**  
  - **Contexto:** dos emails sintéticos se parecen; un score alto solo prioriza revisión de **entrega**, nunca claims de fraude.  
  - **Meta:** calcular prefijo común, redondear a 2 decimales y anexar siempre `match_no_es_fraude`.  
  - **Éxito:** `0.86 match_no_es_fraude`.  
  - **Límites:** nunca `fraude_probable`; score alto ≠ identidad legal ni parentesco.
- **Proposed instruction/description improvements:**  
  1. El starter etiqueta `fraude_probable` (bug ético).  
  2. Conserva el cálculo del prefijo con `zip`.  
  3. Imprime `round(score, 2)` y la nota correcta.  
  4. No cambies los dos emails del fixture.
- **Proposed retrospective:**  
  Matching alimenta prioridad de entrega, no investigación de fraude. El error clásico es automatizar un claim con un umbral. Pregunta de cierre: ¿qué gate humano sigue siendo obligatorio aunque el score sea 0.99?
- **Code/output changes:** none
- **Validation notes:** Alineado a theory T3-A y self-check (0.92 ético / 0.86 del ejercicio).

---

### S22-T3-B-DEMO (iDo)
- **Diagnosis:** Dedupe + externos a BCC. Why claro sobre privacidad operativa. Falta preamble de “CC expone la lista de trabajo” y retrospective.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  En operaciones, un CC masivo **expone** quién trabaja el caso; BCC oculta la lista a los demás. En esta demo hay duplicados de `ana@example.pe` y un partner externo en CC. Observa cómo queda la lista limpia y por qué el externo termina en BCC. No escribas: predice el orden y los roles finales. Datos sintéticos, sin PII real.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: dedupe preserva primera aparición; dominio externo → BCC; mínima divulgación es hábito diario de la mesa, no checklist de cumplimiento olvidable.
- **Proposed retrospective:**  
  Higiene de listas = dedupe + BCC a externos + contar visibles. El error clásico es CC “por comodidad”. We Do: orden estable, forzar BCC y conteo de visibles tras la política.
- **Code/output changes:** none

---

### S22-T3-B-E1 (weDo, guided)
- **Diagnosis:** Dedupe con `set` que pierde orden. Feedback bueno sobre `dict.fromkeys`. Sin preamble/title/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Deduplicar emails preservando orden
- **Proposed preamble:**  
  - **Contexto:** en una lista To/CC de Caso 22, el orden de primera aparición es parte del contrato de higiene.  
  - **Meta:** deduplicar sin perder ese orden.  
  - **Éxito:** `['a@x', 'b@x']`.  
  - **Límites:** no uses `set` como solución final; no reordenes a mano.
- **Proposed instruction/description improvements:**  
  1. El starter usa `list(set(xs))` (bug de orden).  
  2. Aplica `dict.fromkeys` (o equivalente estable).  
  3. Imprime la lista resultante.  
  4. No alteres el fixture de tres elementos.
- **Proposed retrospective:**  
  `dict.fromkeys` preserva la primera aparición; `set` no es contrato de lista de destinatarios. Siguiente (E2): forzar BCC a un externo que vino en CC.
- **Code/output changes:** none

---

### S22-T3-B-E2 (weDo, independent)
- **Diagnosis:** Detecta externo pero no muta role — buen defect. Feedback de mínima divulgación. Sin preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Forzar BCC a destinatarios externos
- **Proposed preamble:**  
  - **Contexto:** un partner en `@other.test` no debe ver ni exponer la lista de trabajo en CC.  
  - **Meta:** forzar `role='bcc'` cuando el email es externo.  
  - **Éxito:** una línea `bcc`.  
  - **Límites:** no dejes `pass` sin mutar; BCC no es cifrado, solo oculta la lista a los demás.
- **Proposed instruction/description improvements:**  
  1. El starter detecta el dominio pero hace `pass` (bug).  
  2. Asigna `r['role'] = 'bcc'`.  
  3. Imprime el role final.  
  4. No cambies el email del fixture.
- **Proposed retrospective:**  
  Externos en CC exponen la lista del caso. Forzar BCC (o envíos individuales) es mínima divulgación operativa. Luego (E3) mueves externos y cuentas solo visibles to+cc.
- **Code/output changes:** none

---

### S22-T3-B-E3 (weDo, transfer)
- **Diagnosis:** Política completa: BCC externos + conteo de visibles. Starter no mueve el externo. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Contar visibles tras política BCC
- **Proposed preamble:**  
  - **Contexto:** el audit del run debe registrar cuántos emails quedan **visibles** (to+cc) después de la política de privacidad.  
  - **Meta:** mover externos a bcc y contar solo visibles.  
  - **Éxito:** `1 ['a@example.pe']`.  
  - **Límites:** si el externo sigue en cc, el conteo miente; BCC no cifra el cuerpo.
- **Proposed instruction/description improvements:**  
  1. El starter cuenta el externo en cc (bug de política).  
  2. Si el dominio es externo, reasigna role a `bcc` antes de contar.  
  3. Visibles = to + cc tras la política.  
  4. Imprime `len(vis)` y la lista.
- **Proposed retrospective:**  
  Tras la política, solo to+cc son visibles. El error clásico es contar antes de reasignar roles. Pregunta de cierre: ¿por qué un conteo de 2 con un externo en cc es un hallazgo de privacidad y no un “detalle de UI”?
- **Code/output changes:** none

---

### S22-T4-A-DEMO (iDo)
- **Diagnosis:** Máquina de estados con audit y actor `rev1`. Why excelente sobre fail-closed. Falta preamble de HITL obligatorio y retrospective del anti-patrón “approve desde draft en el código”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  La cola de aprobación es el corazón human-in-the-loop de CP-N2-C: `draft` → `pending_review` → `approved` | `rejected` | `needs_edit`. En esta demo el analista hace `submit` y la revisora `rev1` hace `approve`; el log guarda from/to/action/actor. No escribas: sigue el trail y el último actor. Si alguien “aprueba” desde draft sin pasar por la tabla, no hay audit ni fail-closed — y el destinatario sintético queda desprotegido.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: solo `submit` mueve draft→pending_review; el actor en el audit es accountability; estados canónicos `pending_review`/`needs_edit` (nunca atajo `pending`).
- **Proposed retrospective:**  
  El estado es la verdad; el botón no envía sin la máquina. El error clásico es hardcodear `approved`. We Do: transición submit, fail-closed invalid y apply con actor en el log.
- **Code/output changes:** none

---

### S22-T4-A-E1 (weDo, guided)
- **Diagnosis:** Starter salta a `approved` — anti-patrón perfecto para E1. Feedback bueno. Sin preamble/title/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** submit de draft a pending_review
- **Proposed preamble:**  
  - **Contexto:** en Caso 22, el analista no puede autoaprobar: debe encolar revisión humana.  
  - **Meta:** aplicar la transición `submit` desde `draft` usando la tabla.  
  - **Éxito:** una línea `pending_review`.  
  - **Límites:** no hardcodees `approved`; no inventes atajos `pending`.
- **Proposed instruction/description improvements:**  
  1. El starter asigna `state = 'approved'` (bug).  
  2. Lee `T[state]['submit']` (o equivalente).  
  3. Imprime el estado final.  
  4. Conserva la tabla del starter.
- **Proposed retrospective:**  
  `submit` es la única puerta de draft a pending_review. Saltar a approved en el código es anti-patrón de mesa de control. Siguiente (E2): approve desde draft debe ser `invalid`.
- **Code/output changes:** none

---

### S22-T4-A-E2 (weDo, independent)
- **Diagnosis:** Fail-closed con `.get`; starter imprime `ok` cuando falta transición. Feedback excelente. Sin preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** approve inválido desde draft
- **Proposed preamble:**  
  - **Contexto:** fail-closed protege al destinatario cuando la acción no existe en la tabla.  
  - **Meta:** intentar `approve` desde `draft` y obtener `invalid`.  
  - **Éxito:** una línea `invalid`.  
  - **Límites:** no inventes un `ok` cuando `nxt` es None; no silencies el hallazgo.
- **Proposed instruction/description improvements:**  
  1. El starter imprime `'ok'` si falta la transición (bug).  
  2. Usa `.get` en la tabla.  
  3. Si no hay `nxt`, imprime `invalid`.  
  4. No agregues approve a draft “para que pase”.
- **Proposed retrospective:**  
  Falta de transición = invalid, no éxito silencioso. El error clásico es un else amable que miente al audit. Luego (E3) implementas `apply` con actor y filtras el evento de approve.
- **Code/output changes:** none

---

### S22-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Transferencia fuerte: `apply` completo + filtro del evento approve con actor `rev1`. Starter incompleto. Instruction densa pero correcta. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** apply con audit y actor en approve
- **Proposed preamble:**  
  - **Contexto:** el portfolio de CP-N2-C adjunta el audit: quién aprobó, desde qué estado, con qué acción.  
  - **Meta:** implementar `apply` sobre la máquina canónica; ejecutar submit y approve; imprimir solo el evento de approve.  
  - **Éxito:** lista con un dict `from pending_review → approved`, action `approve`, actor `rev1`.  
  - **Límites:** consulta TRANSITIONS; no hardcodees approved en apply; estados canónicos.
- **Proposed instruction/description improvements:**  
  1. El starter no usa TRANSITIONS ni guarda actor/action (bug).  
  2. Completa `apply`: resuelve `nxt`, falla si no hay, append con from/to/action/actor.  
  3. Ejecuta submit (analyst) y approve (rev1).  
  4. Imprime la lista filtrada por action == approve.
- **Proposed retrospective:**  
  Sin actor no hay accountability; sin TRANSITIONS no hay fail-closed. El error clásico es un log incompleto que “solo guarda el to”. Pregunta de cierre: ¿qué imprimirías si alguien intenta approve desde draft?
- **Code/output changes:** none

---

### S22-T4-B-DEMO (iDo)
- **Diagnosis:** Idempotency key 16 hex + once con same id. Why claro anti-spam. Falta preamble de doble clic/reintento de red y retrospective.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Un reintento de red o un doble clic del operador no debe spamear al destinatario sintético. En esta demo la key es `sha256(...).hexdigest()[:16]` del payload del run; la segunda llamada a `once` devuelve el mismo draft y marca duplicado. No escribas: predice si `a==b` y qué flags de duplicado salen. Si cada reintento crea un draft nuevo, la mesa multiplica notificaciones y rompe el contrato de CP-N2-C.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: 16 hex es el contrato único de S22 (teoría, ejercicios, You Do); retry ≠ reenviar; cambiar body_ver genera key nueva.
- **Proposed retrospective:**  
  Misma key → mismo draft_id. El error clásico es “crear siempre” por miedo a un KeyError. We Do: construir la key, create idempotente y audit create/retry_hit.
- **Code/output changes:** none

---

### S22-T4-B-E1 (weDo, guided)
- **Diagnosis:** Separador incorrecto y slice [:6] — defectos bien nombrados y output canónico fijo. Feedback corto. Sin preamble/title/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Idempotency key sha256 de 16 hex
- **Proposed preamble:**  
  - **Contexto:** la key firma el triple run | destinatario | versión del cuerpo en Caso 22 y en el You Do.  
  - **Meta:** unir con `|`, codificar, sha256 y tomar **16** hex.  
  - **Éxito:** `0da400d6c9b3f756`.  
  - **Límites:** separador es `|` (no `-`); slice `[:16]` (no 6 ni 8).
- **Proposed instruction/description improvements:**  
  1. El starter usa `-` y `[:6]` (bugs).  
  2. Arma `f'{run_id}|{to}|{body_ver}'.encode()`.  
  3. Imprime `sha256(...).hexdigest()[:16]`.  
  4. No cambies los valores del fixture (`run`, `to`, `v1`).
- **Proposed retrospective:**  
  16 hex es el contrato único de S22. El error clásico es acortar la key “para que se lea mejor”. Siguiente (E2): create que reutiliza el id cuando la key ya existe.
- **Code/output changes:** none
- **Validation notes:** Output canónico depende del payload exacto; no alterar fixture.

---

### S22-T4-B-E2 (weDo, independent)
- **Diagnosis:** Create que siempre pisa el store — bug real de reintento. Feedback anti-spam. Sin preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** create idempotente por la misma key
- **Proposed preamble:**  
  - **Contexto:** la segunda llamada con la misma key no debe inventar un segundo draft.  
  - **Meta:** `create(key)` reutiliza el draft_id existente; solo la primera crea.  
  - **Éxito:** `True` y `1` (same id y un solo registro).  
  - **Límites:** no pises el store en cada llamada; condiciones de carrera fuera del lab.
- **Proposed instruction/description improvements:**  
  1. El starter siempre asigna un id nuevo (bug).  
  2. Si `key in store`, devuelve el guardado.  
  3. Si no, crea y guarda.  
  4. Deja los dos `create('k')` y los prints.
- **Proposed retrospective:**  
  Misma key → mismo draft_id y un solo registro. El error clásico es “siempre factory()”. Luego (E3) el reintento se registra como `retry_hit` en el audit.
- **Code/output changes:** none

---

### S22-T4-B-E3 (weDo, transfer)
- **Diagnosis:** Audit create + retry_hit con same_id — cierre perfecto del subtema y del inicio CP-N2-C. Starter solo append create. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Audit create y retry_hit sin duplicar
- **Proposed preamble:**  
  - **Contexto:** en la mesa de control el reintento es evidencia de cumplimiento, no un segundo mensaje al destinatario.  
  - **Meta:** mini `create_once`: primer intento `create`, segundo `retry_hit` reutilizando el id.  
  - **Éxito:** `['create', 'retry_hit']` y `True`.  
  - **Límites:** no borres el audit al reintentar; no crees un segundo draft; timestamp/actor en prod (fuera de este drill).
- **Proposed instruction/description improvements:**  
  1. El starter siempre hace append `create` y pisa el store (bug).  
  2. Si la key ya está, append `retry_hit` y reutiliza el id.  
  3. Si no, guarda draft y append `create`.  
  4. Imprime eventos y igualdad de ids.
- **Proposed retrospective:**  
  El reintento es un evento de auditoría, no un segundo draft. El error clásico es duplicar notificaciones “porque el job falló a medias”. Pregunta de cierre: ¿qué cambia en la key si actualizas el cuerpo del informe de S21?
- **Code/output changes:** none
- **Validation notes:** Cierra el hilo T4-B y prepara el You Do de CP-N2-C.

---

### youDo — Borrador .eml con aprobación (inicio CP-N2-C)
- **Diagnosis:** Marco de proyecto **fuerte**: context de mesa de control post-S21, objectives claros, requirements con gates (draft-only, verified, key 16, pending_review, sin SMTP, match≠fraude), starter semi-guiado con huecos MIME/HTML/adjunto/submit, rubric ponderada y portfolioNote. **Falta** `retrospective` de defensa/reflexión post-build (spec You Do). El learner no tiene un cierre metacognitivo de 30 s para el portfolio.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective **fail**
- **Severity:** P1
- **Proposed title:** (ya existe) Borrador .eml con aprobación (inicio CP-N2-C)
- **Proposed preamble:** N/A — el `context` ya cumple rol de escena; no duplicar. Opcional: una línea al final del context recordando los prints de aceptación.
- **Proposed instruction/description improvements:**  
  Mantener starter y requirements. Asegurar que el Fixer no diluya los prints de aceptación (`verified True`, `key_len 16`, `draft_id`, `state pending_review`, `audit_n ≥ 1`).
- **Proposed retrospective:**  
  Antes de marcar listo: (1) ¿qué gate demuestras con los prints de aceptación (verified, key_len 16, pending_review, audit con actor)? (2) ¿qué harías distinto con destinatarios reales vs. `@example.pe` (PII, opt-out, BCC)? (3) Escribe en el README una frase de impacto medible — p. ej. “cero envíos automáticos; 100 % de drafts pasan por `pending_review`” — que puedas defender en 30 segundos ante la mesa. En S23 el canal web reutilizará este contrato; no reabras el paquete de S21 ni relajes el fail-closed.
- **Code/output changes:** none
- **Validation notes:** Starter y rubric ya alineados a learning outcomes; solo falta cierre metacognitivo.

---

## Priority order

### P0 (We Do: title + preamble + instruction solo-tarea + retrospective)
1. **S22-T1-A-E1, E2, E3** — MIME plain, Disposition, árbol Content-Type  
2. **S22-T1-B-E1, E2, E3** — escape, interpolación, allowlist host  
3. **S22-T2-A-E1, E2, E3** — scopes, isdisjoint, expires_at  
4. **S22-T2-B-E1, E2, E3** — status vs key, usable, adaptador  
5. **S22-T3-A-E1, E2, E3** — formato, dominio, **match_no_es_fraude** (prioridad ética alta en E3)  
6. **S22-T3-B-E1, E2, E3** — dedupe, BCC, visibles  
7. **S22-T4-A-E1, E2, E3** — submit, invalid, apply+actor  
8. **S22-T4-B-E1, E2, E3** — key 16, create idempotente, audit retry_hit  

### P1 (I Do + You Do)
9. **S22-T1-A-DEMO … S22-T4-B-DEMO** (8) — añadir `preamble` + `retrospective`; ampliar `why` al piso del spec donde quede en una frase  
10. **youDo** — añadir `retrospective` de defensa de portfolio  

### P2 (polish)
11. Alinear longitudes de `feedback` (25–60 palabras) donde queden en una frase telegráfica  
12. En E3 de T2-A, anclar en preamble que el reloj de `expires_at` aplica a token y a draft (puente T2-B)  
13. Opcional: reforzar en feedback de T3-A-E3 el vínculo al self-check 0.92 (sin cambiar el output 0.86)

---

## Residual risks

- **Nombre de archivo / id vs contenido:** el archivo se llama `s22-rapidfuzz-entity.ts` e id `rapidfuzz-entity`, pero el contenido es email/HITL/MIME, no RapidFuzz profundo. El Fixer no debe “corregir” el curriculum hacia entity resolution en esta ronda; solo puede anotar el desfase si el orchestrator lo pide. En preambles, anclar **Caso 22 / CP-N2-C**, no “fuzzy matching de fraudes”.  
- **Ética de matching:** si el Fixer acorta el E3 de T3-A, se pierde el anti-patrón `fraude_probable`. Mantener etiqueta y nota.  
- **Contrato de key 16 hex:** fixture de T4-B-E1 es frágil a cambios de separador/payload; no “mejorar” el ejemplo sin re-ejecutar el hash.  
- **You Do semi-guiado:** el starter ya resuelve `domain_ok`, `idem_key` y `TRANSITIONS`; el learner completa MIME HTML, adjunto y `submit`. No vaciar el starter en la fix de prosa.  
- **Sobrecarga de longitud:** 24 preambles + 8 iDo + 1 youDo; respetar límites del spec (80–150 / 40–80) para no bloat.  
- **Fade:** el contenido ya fadea bien; el riesgo es que preambles de E1/E2/E3 se clonen. Cada uno debe variar escena y nivel de andamiaje (guiado nombra defect; transfer plantea superficie nueva).

---

## Fixer acceptance hints (no implementar en Round 1)

- [ ] Cada iDo step: `preamble` + `retrospective` (y `why` ≥ ~40 palabras si se toca)  
- [ ] Cada weDo step: `title`, `preamble`, `instruction` solo-tarea, `retrospective`; conservar `feedback`/hints/tests/outputs  
- [ ] youDo: `retrospective` de defensa  
- [ ] Español PE; sin PII real; outputs canónicos intactos salvo execute-and-diff justificado  
- [ ] Sin generadores ni copy-paste entre secciones  

---

Section 22 exercise pedagogy review complete. Ready for the Fixer prompt.
