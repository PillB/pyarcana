# S12 Exercise Pedagogy Report (Round 1)

## Section
- **title:** APIs, SQL y geodatos responsables
- **shortTitle:** APIs · SQL · Geo
- **id:** `performance` (archivo histórico `s12-performance.ts`; contenido = HTTP mock + SQLite + geoevidencia, no profiling de sistemas)
- **index:** 12
- **source:** `src/lib/course/sections/s12-performance.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades de práctica/demo)
- **subtemas:** S12-T1-A status/JSON · T1-B timeout/paginación/retry · T2-A auth/caché/provenance · T2-B contract/fallback · T3-A esquema/CRUD/join · T3-B parámetros/tx/índices · T4-A normalize/geocoder/egress · T4-B coords/Haversine/señal
- **hilo de caso:** CASO-LIM-012 / incremento **CP-N1-C** (adquisición HTTP + almacén SQLite + geoevidencia; puente a dashboard S13)

## Method
- Leído `PEDAGOGY_EXERCISE_SPEC.md` (campos, longitudes, checklist preamble/retrospective, fade E1→E2→E3).
- Inspeccionado manualmente cada `iDo.steps[]`, `weDo.steps[]` y `youDo` en `s12-performance.ts` (demos ~402–654, weDo ~656–1697, youDo ~1699–1838).
- Contrastado con el hilo de la sección: adaptador de señales sintéticas, política N1 de retry (solo 429/503), placeholders `?`, MockGeocoder, Haversine como geoseñal no parentesco.
- **Sin** generadores, bucles, plantillas ni copy-paste mecánico entre unidades.
- Prosa propuesta en **español profesional peruano**, un objetivo primario por unidad.

## Hallazgos transversales (antes del ledger)

| Campo / hábito | Estado actual en S12 |
|----------------|----------------------|
| I Do `preamble` | **Ausente** en las 8 demos |
| I Do `retrospective` | **Ausente** en las 8 demos |
| I Do `description` | Presente y a menudo **rica** (piensa en voz alta, qué observar); no sustituye preamble formal |
| I Do `why` | Presente pero **corto** (1 frase; bajo el piso 40–90 palabras del spec) |
| We Do `title` | **Ausente** en los 24 (solo prefijo “E1/E2/E3 …” dentro de `instruction`) |
| We Do `preamble` | **Ausente** en los 24 |
| We Do `retrospective` | **Ausente** en los 24 |
| We Do `instruction` | Estilo “**E_n (kind) — implementa X. Fixture… Salida/pass: …**”: meta + éxito mezclados; legible para quien ya domina HTTP/SQL, **opaco** para newbie sin escena |
| We Do `feedback` | Una línea; poco *razonamiento* del error típico |
| Starter `# DEFECT:` | **Excelente** hábito en casi todos; defectos bien nombrados y alineados a la solución |
| Hints | A menudo casi-solución en E1 (aceptable como andamiaje); en E3 a veces spoiling |
| You Do marco | `context` / `objectives` / `requirements` / `rubric` / `portfolioNote` **sólidos** |
| You Do `retrospective` | **Ausente** |
| Código / outputs | Coherentes con theory y política N1; **no** proponer cambios de output salvo notas puntuales |

**Patrón dominante:** el andamiaje de *código* (mock sin red, DEFECT, output canónico, fade de skill real E1→E3) es de los más maduros del tramo intermedio. El andamiaje *pedagógico verbal* (preamble → instruction solo-tarea → retrospective) no existe. Un true newbie no responde con claridad: qué practico, por qué importa en CP-N1-C, cómo sé que gané, qué debe quedarme al cerrar la pestaña.

**Fade E1→E2→E3 (contenido):** progresión real por subtema (p. ej. T1-A: get status → parse keys → tabla status_action; T3-B: safe SQL → rollback → índice). **No** son tres clones con números distintos. El fade de *prosa* no se ve porque no hay preambles diferenciados.

**Severity default:** missing preamble+title+retrospective en We Do = **P0**; I Do sin preamble/retrospective = **P1** (aún tienen description+why+código); youDo sin retrospective = **P1**; polish de feedback/why = **P2** si caen preamble/instruction/retrospective.

---

## Unit ledger

### S12-T1-A-DEMO (iDo)
- **Diagnosis:** Demo sólida de mock HTTP: status 200, `count=2`, kinds `shared_phone`/`geo`. La `description` ya guía “status primero, body después”, pero no hay `preamble` formal ni `retrospective`. El `why` es una frase y no repara el misconception “si hay JSON, confío”. Un newbie ve el mock y no internaliza el orden experto del adaptador.
- **Checklist:** context partial · goal partial · success partial (output visible) · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Antes de tocar red real, el adaptador de señales del caso sintético `CASO-LIM-012` debe **leer el status y solo entonces** confiar en el JSON. En esta demo un `MockResponse` devuelve 200 con dos señales (`shared_phone`, `geo`) sin internet. No escribas aún: predice `status`, `count` y la lista de `kinds`, luego compara con la salida. Si el status no fuera 2xx, el body no sería “la verdad del caso”.
- **Proposed instruction/description improvements:**  
  Mantener el tono de “piensa en voz alta”. Ampliar `why` (~50–70 palabras): el mock aísla el contrato status+JSON; el orden status→parse evita consumir un body de error como si fuera items; puente a We Do donde `get_entity` devuelve tuplas (status, body).
- **Proposed retrospective:**  
  Si puedes explicar por qué miras `status_code` antes de `json()`, ya tienes el hábito del adaptador. El error clásico es asumir siempre 200. En We Do T1-A practicarás 200/404 y la tabla status→acción de la política N1.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto y alineado a theory T1-A.

---

### S12-T1-A-E1 (weDo, guided)
- **Diagnosis:** Drill guiado claro: starter siempre devuelve `(200, {})`. Instruction nombra fixture y éxito pero mezcla meta/pasos; sin title, preamble ni retrospective. Feedback de una línea no repara “lanzar excepción en 404”.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Status 200 o 404 sin excepción
- **Proposed preamble:**  
  - **Contexto:** el adaptador de entidades del caso sintético debe devolver status explícito, no tumbar el pipeline con `KeyError`.  
  - **Meta:** implementar `get_entity(store, entity_id)` que devuelva `(status, body)`.  
  - **Éxito:** `C001` → `(200, {'id': 'C001', 'region': 'Lima'})`; `C999` → `(404, {'error': 'not_found'})`.  
  - **Límites:** no lances excepción en 404; no uses red real; solo el `store` del fixture.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: siempre devuelve `200` y `{}` (DEFECT).  
  2. Si `entity_id` no está en `store`, devuelve `404` y el body de error.  
  3. Si existe, devuelve `200` y el dict del store.  
  4. Imprime ambos casos del fixture (sin texto extra).
- **Proposed feedback improvement:**  
  El 404 es un resultado válido del adaptador, no un crash. El caller traduce status→acción (missing, retry, etc.). Devolver tupla `(status, body)` evita try/except ruidosos en cada llamada.
- **Proposed retrospective:**  
  Status explícito es el contrato del adaptador: el body solo se usa si la acción es `use_body`. No confundas “no encontrado” con “error de red”. Siguiente (E2): parse estricto del payload 200.
- **Code/output changes:** none
- **Validation notes:** DEFECT bien nombrado; solution y output correctos.

---

### S12-T1-A-E2 (weDo, independent)
- **Diagnosis:** Buen foco independiente (whitelist de keys `id`/`region`, extras fuera, incompleto → `None`). Instruction densa tipo mini-spec; sin escena de por qué el parse estricto protege el almacén. Feedback corto.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Parse estricto de entidad (solo id y region)
- **Proposed preamble:**  
  - **Contexto:** tras un 200, el JSON del proveedor puede traer basura (`extra`) o faltar claves; el dashboard de S13 no debe tragar basura.  
  - **Meta:** validar y proyectar solo `id` y `region`.  
  - **Éxito:** payload completo con extra → `{'id':'C001','region':'Lima'}`; incompleto → `None`.  
  - **Límites:** no mutes el payload original; si no es `dict`, devuelve `None`.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: devuelve el payload crudo sin validar.  
  2. Exige tipo `dict` y claves `id` y `region`.  
  3. Construye un dict **nuevo** solo con esas dos claves.  
  4. Imprime el caso con extra y el incompleto.
- **Proposed retrospective:**  
  Parse estricto = fail-closed sobre el contrato de entidad. Ignorar extras evita que un campo del proveedor contamine el score. Luego (E3) la tabla status→acción cierra el lado HTTP antes del body.
- **Code/output changes:** none
- **Validation notes:** E2 con menos migas que E1 en instrucción propuesta; éxito observable intacto.

---

### S12-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transferencia real a la política N1 (tabla status→acción). Starter confunde 429/500 y omite 503. Instruction ya lista el mapa; falta anclar *por qué* 500 no es retry en este curso y cierre metacognitivo.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Tabla status→acción (política N1)
- **Proposed preamble:**  
  - **Contexto:** el adaptador no “reintenta a ciegas”; traduce cada status a una acción de runbook.  
  - **Meta:** implementar `status_action(code)` según política N1 del curso.  
  - **Éxito:** líneas `200 use_body`, `404 missing`, `429 retry`, `400 fix_client`, `500 fail_server`, `503 retry`.  
  - **Límites:** 500 **no** es retry en N1; códigos no listados → `unknown`.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: 429 y 500 caen en `fail_client`; 503 no está.  
  2. Corrige el mapa: 429/503 → `retry`; 500 → `fail_server`; 400 → `fix_client`.  
  3. Recorre `[200, 404, 429, 400, 500, 503]` e imprime código y acción.  
  4. No inventes acciones fuera de la política N1.
- **Proposed retrospective:**  
  Retry solo en errores transitorios (429/503) protege cuota y no “arregla” un id mal formado. Pregunta de cierre: ¿por qué un 400 no se reintenta? Puente a T1-B: timeout y `should_retry`.
- **Code/output changes:** none
- **Validation notes:** Transfer auténtico; alinear mentalmente con E3 de T1-B (`should_retry`).

---

### S12-T1-B-DEMO (iDo)
- **Diagnosis:** Worked example de paginación con `next` y contador de pausas (sin sleep real). Description buena; falta preamble que diga *por qué* `rate_limit_pauses=2` y no 3, y retrospective del misconception “siempre hay 3 páginas”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El proveedor lista señales en páginas; traer todo de un golpe llena memoria y quema cuota. Sigue la demo: el bucle avanza mientras `next` no es `None`, acumula items 1…5 y cuenta **pausas entre páginas** (no un sleep al final). Predice `items` y `rate_limit_pauses` antes de mirar la salida. Sin red real: el dict `API` es el contrato del proveedor.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: el fin de colección lo marca el proveedor (`next is None`), no un contador mágico; las pausas modelan rate-limit entre páginas para tests deterministas.
- **Proposed retrospective:**  
  Si sabes por qué hay 2 pausas con 3 páginas, entiendes “pausa al pasar a la siguiente”, no “sleep por página leída”. We Do: simular timeout, aplanar páginas y política `should_retry`.
- **Code/output changes:** none

---

### S12-T1-B-E1 (weDo, guided)
- **Diagnosis:** Timeout simulado con comparación invertida en el starter — defect guiado excelente. Instruction telegráfica; no ancla “timeout obligatorio del cliente real” al smoke de CP-N1-C. Sin preamble/title/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Timeout simulado: cost vs límite
- **Proposed preamble:**  
  - **Contexto:** un socket colgado congela el pipeline de adquisición; el cliente real siempre lleva `timeout=`.  
  - **Meta:** modelar timeout con dos números (`timeout_s`, `cost_s`) sin red.  
  - **Éxito:** `fetch(2.0, 0.5)` → `ok`; `fetch(1.0, 3.0)` → `timeout`.  
  - **Límites:** no uses red ni `time.sleep`; si `cost_s > timeout_s` es timeout (igualdad cuenta ok).
- **Proposed instruction/description improvements:**  
  1. El starter compara al revés (`cost < timeout` devuelve timeout).  
  2. Invierte la condición: costo **mayor** que el límite → `'timeout'`.  
  3. En caso contrario devuelve `'ok'`.  
  4. Imprime los dos casos del fixture.
- **Proposed feedback improvement:**  
  Sin timeout, un request colgado bloquea workers y demos. Aquí no hay red: solo comparas costos. El mismo hábito se traduce a `urlopen(..., timeout=5)` o al SDK del proveedor.
- **Proposed retrospective:**  
  Timeout es parte del contrato del adaptador, no un “extra de producción”. El misconception es reintentar timeouts sin tope. Siguiente: paginar hasta `next is None` (E2).
- **Code/output changes:** none

---

### S12-T1-B-E2 (weDo, independent)
- **Diagnosis:** Paginación a lista plana; starter solo toma la primera página. Instruction procedural con éxito claro; falta contexto de full-sync sintético y constraints (no hardcodear 2 páginas).
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Paginar hasta next is None
- **Proposed preamble:**  
  - **Contexto:** el full-sync de señales del caso no cabe en un solo GET; el proveedor pagina.  
  - **Meta:** aplanar todas las páginas en una lista de items.  
  - **Éxito:** con el fixture del starter, `['a', 'b', 'c']`.  
  - **Límites:** termina solo cuando `next is None`; no hardcodes “siempre 2 páginas”.
- **Proposed instruction/description improvements:**  
  1. El starter devuelve solo `api[1]["items"]`.  
  2. Parte de `page = 1` y acumula en un bucle.  
  3. En cada paso: extiende con `items` y avanza a `next`.  
  4. Imprime la lista plana (sin texto extra).
- **Proposed retrospective:**  
  El contrato del proveedor manda: si mañana hay 10 páginas, el mismo bucle sirve. No copies “páginas=2” del fixture al código. Luego (E3): qué status merecen reintento.
- **Code/output changes:** none

---

### S12-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Transferencia limpia a `should_retry` (solo 429/503). Starter reintenta todo `>= 400` — misconception profesional real. Falta preamble ético/cuota y retrospective que una con `status_action` de T1-A-E3.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Retry solo 429 y 503 (N1)
- **Proposed preamble:**  
  - **Contexto:** reintentar un 400 o 404 multiplica basura y quema cuota; solo errores **transitorios** reintentan en N1.  
  - **Meta:** `should_retry(status)` → `True` únicamente para 429 y 503.  
  - **Éxito:** `400 False`, `404 False`, `429 True`, `503 True`, `200 False`.  
  - **Límites:** no reintentes 500 aquí (política de ejercicios N1); no uses rangos `>= 400`.
- **Proposed instruction/description improvements:**  
  1. El starter marca retry en todo status ≥ 400.  
  2. Cambia a pertenencia en el conjunto `{429, 503}`.  
  3. Imprime status y booleano para la lista del fixture.  
  4. Comprueba mentalmente que 200 y 4xx de cliente son False.
- **Proposed retrospective:**  
  `should_retry` y `status_action` deben contar la misma historia. El error clásico es “cualquier error se reintenta tres veces”. En T2 proteges el secreto y la traza del fetch.
- **Code/output changes:** none

---

### S12-T2-A-DEMO (iDo)
- **Diagnosis:** Provenance sin token — demo profesionalmente excelente. Description ya dice “nunca loguear el token”; falta preamble de escena (auditoría de adquisición) y retrospective del misconception “logueo el token para depurar 5 minutos”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Tras un fetch de señales, el auditor necesita **traza de origen** (url, timestamp, status, hash del body, esquema de auth) sin el valor del secreto. Observa el demo: `token_present` es booleano; al final `token_logged False`. El token vive en env (`SIG_API_TOKEN`), no en el JSON impreso. No reescribas: predice las claves del manifest y si el string del token aparece.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: provenance alimenta el entregable CP-N1-C y el README del portafolio; `body_sha12` prueba integridad sin volcar PII; nunca Authorization en logs.
- **Proposed retrospective:**  
  Si el manifest no contiene el token y sí `token_present`, ya internalizaste “secreto fuera de la traza”. We Do: exigir token, caché GET y armar provenance mínima.
- **Code/output changes:** none

---

### S12-T2-A-E1 (weDo, guided)
- **Diagnosis:** `require_token` con fail-closed; starter devuelve `""` — defect clásico. Instruction OK en fixture; sin contexto de “llamadas anónimas” ni retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Exigir API_TOKEN o fallar cerrado
- **Proposed preamble:**  
  - **Contexto:** un adaptador sin token no debe enviar requests “por si acaso” ni hardcodear demo en el repo.  
  - **Meta:** leer `API_TOKEN` del dict `env` y fallar si falta o está vacío.  
  - **Éxito:** env con token → `abc`; env vacío → mensaje `API_TOKEN missing`.  
  - **Límites:** lanza `ValueError` (no devuelvas `""`); no imprimas el token en logs reales.
- **Proposed instruction/description improvements:**  
  1. El starter usa `get(..., "")` y nunca lanza.  
  2. Obtén el token; si es falsy, `raise ValueError('API_TOKEN missing')`.  
  3. Si existe, devuélvelo.  
  4. Deja el try/except del runner para ver el mensaje.
- **Proposed feedback improvement:**  
  Devolver cadena vacía disfraza la falla y produce 401 en cascada. Fail-closed con mensaje claro es más barato de depurar y evita llamadas anónimas accidentales.
- **Proposed retrospective:**  
  El secreto se lee de env/secret store, no del código. Pregunta: ¿qué imprime el demo de provenance, el valor o la presencia? Siguiente: caché de GET (E2).
- **Code/output changes:** none

---

### S12-T2-A-E2 (weDo, independent)
- **Diagnosis:** Clase `Cache` get/set; starter always-miss. Instruction clara; falta anclar a latencia/cuota del proveedor y constraint de no cachear escrituras (mencionar como límite conceptual).
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Caché GET: hit y miss
- **Proposed preamble:**  
  - **Contexto:** demos repetidas del mismo URL de señales no deben “pegarle” al mock cada vez.  
  - **Meta:** `set(url, body)` y `get(url)` → `(body, cache_hit)`.  
  - **Éxito:** tras set de `u1`, get → `({'ok': True}, True)`; url desconocido → `(None, False)`.  
  - **Límites:** dict interno; no inventes TTL aquí (solo hit/miss); no mutes el body del caller de forma sorpresiva.
- **Proposed instruction/description improvements:**  
  1. El starter: `get` siempre miss y `set` es no-op.  
  2. Guarda el body bajo la clave url.  
  3. En get, si existe devuelve `(body, True)`; si no, `(None, False)`.  
  4. Imprime hit de `u1` y miss de `missing`.
- **Proposed retrospective:**  
  Caché de GET reduce latencia y cuota; no es licencia para cachear POST ni errores 5xx sin política. Luego (E3): provenance mínima con `cache_hit` honesto.
- **Code/output changes:** none

---

### S12-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer a dict de provenance de 4 campos; starter omite status y cache_hit. Instruction técnica; falta escena de auditoría y constraint “nunca token”.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Provenance mínima sin secretos
- **Proposed preamble:**  
  - **Contexto:** el capstone pide evidencia de adquisición; el auditor lee un manifest, no el header Authorization.  
  - **Meta:** `min_provenance(url, status, cache_hit)` con cuatro campos fijos de reloj de demo.  
  - **Éxito:** `sorted(...items())` muestra `cache_hit`, `fetched_at`, `source_url`, `status_code` (sin token).  
  - **Límites:** `fetched_at` fijo `'2026-07-20T00:00:00Z'`; **nunca** incluyas el token.
- **Proposed instruction/description improvements:**  
  1. El starter solo devuelve url y timestamp.  
  2. Agrega `status_code` y `cache_hit` desde los parámetros.  
  3. Imprime `sorted(...items())` del caso del starter.  
  4. Verifica mentalmente que no hay clave de secreto.
- **Proposed retrospective:**  
  Provenance honesta (`cache_hit` real) es parte del entregable, no un print decorativo. En T2-B blindas el schema del geocoder y el modo offline.
- **Code/output changes:** none

---

### S12-T2-B-DEMO (iDo)
- **Diagnosis:** Contract + fallback online/offline con mismas coords Lima — excelente. Falta preamble que diga qué observar en `mode` y retrospective “fail soft, trace hard”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Cuando el geocoder online cae, el pipeline puede usar precalculados locales **sin mentir**. Observa: `mode=online` vs `mode=offline_fallback`, mismas lat/lon de Lima, traza distinta. El contract exige `lat`/`lon`/`provider`. No escribas: predice las tres líneas de salida y el valor de `contract_precalc`.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: el contrato falla antes del dashboard de S13; el fallback marca el modo para el auditor; demos de entrevista no dependen de internet.
- **Proposed retrospective:**  
  Falla suave, traza dura: sigues con datos locales pero no reescribes el origen a “online”. We Do: assert de claves, fallback 5xx y runbook live/local.
- **Code/output changes:** none

---

### S12-T2-B-E1 (weDo, guided)
- **Diagnosis:** `assert_keys` con mensaje sorted; starter always-pass. Instruction nombra éxito; sin escena de rotura de proveedor ni retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Contract test: claves obligatorias
- **Proposed preamble:**  
  - **Contexto:** si el proveedor renombra `lon` a `longitude`, el mapa de S13 se llena de huecos silenciosos.  
  - **Meta:** `assert_keys(payload, required)` lanza si faltan claves.  
  - **Éxito:** payload completo → imprime `ok`; sin `lon` → `missing keys: ['lon']`.  
  - **Límites:** mensaje con lista **sorted**; no inventes valores por defecto.
- **Proposed instruction/description improvements:**  
  1. El starter siempre retorna True.  
  2. Calcula `missing = set(required) - set(payload)`.  
  3. Si hay missing, `raise AssertionError` con el formato pedido.  
  4. Deja el runner: ok primero, luego el try del payload incompleto.
- **Proposed retrospective:**  
  Un assert rojo en CI es más barato que un dashboard mudo. No “rellenes” `lon=0`. Siguiente: degradar a body local en 5xx (E2).
- **Code/output changes:** none

---

### S12-T2-B-E2 (weDo, independent)
- **Diagnosis:** Fallback 5xx → offline; starter always online. Instruction correcta; falta anclar “demo del dashboard vivo” y constraint de no fingir online.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Fallback offline ante 5xx
- **Proposed preamble:**  
  - **Contexto:** un 503 del proveedor no debe tumbar la demo del caso; usas coordenadas locales y marcas el modo.  
  - **Meta:** `fetch_with_fallback(status, local_body)` elige body y modo.  
  - **Éxito:** 200 → `({'online': True}, 'online')`; 503 → `(local_body, 'offline')`.  
  - **Límites:** solo status ≥ 500 dispara offline; no reescribas el status a 200.
- **Proposed instruction/description improvements:**  
  1. El starter ignora status y siempre devuelve online.  
  2. Si `status >= 500`, devuelve `(local_body, 'offline')`.  
  3. En caso contrario, body online y modo `'online'`.  
  4. Imprime ambos casos del starter.
- **Proposed retrospective:**  
  El modo offline es la verdad del origen, no un detalle de UI. En E3 formalizas el runbook `live_api` / `local_file` para el flag de operación.
- **Code/output changes:** none

---

### S12-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer simple a `operation_mode(bool)` — skill delgado pero válido como runbook. Riesgo: se sienta trivial sin preamble de “feature flag offline obligatorio en CP-N1-C”. Starter always live.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Runbook: live_api o local_file
- **Proposed preamble:**  
  - **Contexto:** entrevistas y CI no pueden depender de internet; un flag decide la fuente de verdad.  
  - **Meta:** `operation_mode(online)` → `'live_api'` o `'local_file'`.  
  - **Éxito:** `True live_api` y `False local_file`.  
  - **Límites:** la función decide; no hardcodes solo los prints.
- **Proposed instruction/description improvements:**  
  1. El starter siempre devuelve `live_api`.  
  2. Si `online` es False, devuelve `local_file`.  
  3. Recorre `(True, False)` e imprime flag y modo.  
  4. No dejes un print fijo sin función.
- **Proposed retrospective:**  
  El runbook online/offline cierra el bloque de adquisición resiliente. En T3 las señales dejan de vivir solo en RAM: SQLite local del caso.
- **Code/output changes:** none  
- **Validation notes:** Ejercicio corto; preamble debe cargar el peso del “por qué”, no alargar el código.

---

### S12-T3-A-DEMO (iDo)
- **Diagnosis:** Join triple clients/transactions/evidence → `case_row ('Ana', 120.5, 'geo')`. Description fuerte; falta preamble de “ficha para S13” y retrospective del misconception de olvidar `entity_id`/`client_id`.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Las señales del adaptador se **persisten** para el caso: tres tablas locales y un JOIN arman la ficha mínima (nombre, monto, kind de evidencia). Observa el demo en `:memory:` sin servidor. Predice la tupla `case_row` y nota que `geo` llega por `entity_id=C001`, no por magia. Ese join es lo que el dashboard de S13 consumirá.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: placeholders desde el primer INSERT (aunque aquí los valores estén fijos en el demo); la ficha no es un string suelto sino tupla de columnas; puente a We Do de CREATE/CRUD/JOIN filtrado.
- **Proposed retrospective:**  
  Si puedes dibujar las tres FKs lógicas (`client_id`, `entity_id`) sin mirar el SQL, ya tienes el modelo del almacén. We Do: esquema evidence, CRUD de client y join solo de C001.
- **Code/output changes:** none

---

### S12-T3-A-E1 (weDo, guided)
- **Diagnosis:** CREATE + INSERT + COUNT; starter sin PK y sin insert. Instruction OK; falta contexto de “esquema mínimo de evidencias” y constraint NOT NULL.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Crear tabla evidence e insertar una fila
- **Proposed preamble:**  
  - **Contexto:** el almacén local del caso necesita evidencias enlazadas a entidad antes del join.  
  - **Meta:** crear `evidence` con PK y NOT NULL, insertar `E1/C001/geo` y contar.  
  - **Éxito:** `COUNT(*)` imprime `1`.  
  - **Límites:** SQLite `:memory:`; usa placeholders `?` en el INSERT; no dejes la tabla vacía.
- **Proposed instruction/description improvements:**  
  1. El starter crea tabla débil y no inserta.  
  2. Añade `PRIMARY KEY` y `NOT NULL` en `entity_id` y `kind`.  
  3. Inserta `('E1', 'C001', 'geo')` con `?`.  
  4. Imprime solo el count (un entero).
- **Proposed retrospective:**  
  El esquema documenta el modelo aunque aún no actives FOREIGN KEY de SQLite. Siguiente: ciclo UPDATE/DELETE de un client (E2).
- **Code/output changes:** none

---

### S12-T3-A-E2 (weDo, independent)
- **Diagnosis:** CRUD completo con placeholders; starter omite UPDATE/DELETE. Instruction lista el orden; falta escena de “corrección de nombre en ficha” y constraints.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** CRUD de client con placeholders
- **Proposed preamble:**  
  - **Contexto:** en el caso sintético corriges el nombre de `C001` y luego limpias la fila de prueba.  
  - **Meta:** INSERT → UPDATE → SELECT name → DELETE → COUNT, todo con `?`.  
  - **Éxito:** imprime `Ana Q` y luego `0`.  
  - **Límites:** sin f-strings en SQL; no dejes la fila tras el delete.
- **Proposed instruction/description improvements:**  
  1. El starter inserta e imprime el name original y un count sin borrar.  
  2. Haz `UPDATE ... SET name=? WHERE id=?` a `'Ana Q'`.  
  3. Imprime el name; borra por id; imprime count.  
  4. Cierra la conexión al final.
- **Proposed retrospective:**  
  CRUD parametrizado es la base del almacén local: misma disciplina que en el SELECT del join. Luego (E3): unir clients y evidence sin mezclar C002.
- **Code/output changes:** none

---

### S12-T3-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer fuerte: starter hace SELECT de toda evidence (incluye C002). Instruction nombra éxito `['geo','phone']`. Falta preamble de ficha de caso y retrospective del misconception “ORDER BY basta sin JOIN/WHERE”.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** JOIN de evidencias solo de C001
- **Proposed preamble:**  
  - **Contexto:** la ficha del caso no puede mezclar evidencias de otro entity_id.  
  - **Meta:** JOIN `clients` + `evidence` filtrado a `C001`, kinds ordenados.  
  - **Éxito:** `['geo', 'phone']` (sin el geo de C002).  
  - **Límites:** `WHERE c.id = ?` con param; no filtres solo en Python si puedes en SQL.
- **Proposed instruction/description improvements:**  
  1. El starter lista todos los kinds de evidence (mezcla C002).  
  2. Reescribe con JOIN `ON c.id = e.entity_id`.  
  3. Filtra `C001` y ordena por kind.  
  4. Imprime la lista de strings (no tuplas crudas).
- **Proposed retrospective:**  
  El join por `entity_id` es el corazón del almacén del dashboard. Si ves tres kinds, olvidaste el WHERE. En T3-B: inyección, atomicidad e índices.
- **Code/output changes:** none

---

### S12-T3-B-DEMO (iDo)
- **Diagnosis:** Batch atómico con UNIQUE roto → rollback y count 0. Description excelente; falta preamble de “estado parcial en compliance” y retrospective del misconception “al menos quedaron 2 filas”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Un batch de clientes con `document_id` UNIQUE no puede quedar “a medias” si el tercer insert choca. Sigue el demo: BEGIN → tres INSERT → IntegrityError en DOC1 duplicado → ROLLBACK → `count 0`. Predice `atomic_rollback` y el count. En compliance, dos filas huérfanas son peor que un fallo ruidoso.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: `executemany` + transacción; el status `atomic_rollback` es la promesa de atomicidad; reporta la fila ofensora en log de app, no interpolada en SQL.
- **Proposed retrospective:**  
  Si ves count 2, olvidaste el rollback. Atomicidad = todo o nada. We Do: placeholders contra inyección, rollback manual y CREATE INDEX.
- **Code/output changes:** none

---

### S12-T3-B-E1 (weDo, guided)
- **Diagnosis:** SQL injection clásico con f-string; input `C001' OR '1'='1'`. Pedagógicamente oro. Instruction nombra éxito `None`; falta escena OWASP/compliance y constraint “nunca f-string con input”.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** SELECT seguro con placeholder ?
- **Proposed preamble:**  
  - **Contexto:** un id sintético malicioso no debe devolver filas ajenas; en banca esto es falla de control.  
  - **Meta:** reescribir el SELECT con `?` y tupla de params.  
  - **Éxito:** el input `C001' OR '1'='1` imprime `None` (sin match literal).  
  - **Límites:** **prohibido** f-string / concat con `user_id`; solo placeholder.
- **Proposed instruction/description improvements:**  
  1. El starter interpola `user_id` en el SQL (vulnerable).  
  2. Cambia a `WHERE id = ?` y pasa `(user_id,)`.  
  3. Imprime el `fetchone()` (debe ser `None`).  
  4. No “sanitices” a mano con replace de comillas.
- **Proposed feedback improvement:**  
  Con f-string, el OR abre todas las filas. El placeholder trata el input como **dato**, no como SQL. Ese hábito vale más que cualquier checklist verbal de “no confíes en el usuario”.
- **Proposed retrospective:**  
  Placeholders matan la inyección clásica aunque el id “parezca sintético”. Pregunta: ¿qué imprime el starter vulnerable vs la solución? Siguiente: rollback tras IntegrityError (E2).
- **Code/output changes:** none

---

### S12-T3-B-E2 (weDo, independent)
- **Diagnosis:** Transacción con doble INSERT mismo id; starter traga el error sin rollback (count 1). Instruction clara; falta anclar a “filas huérfanas” del demo.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Rollback total tras IntegrityError
- **Proposed preamble:**  
  - **Contexto:** si el segundo INSERT del batch choca, el primero no debe quedar solo en la DB del caso.  
  - **Meta:** en `except IntegrityError`, hacer `rollback` y dejar count 0.  
  - **Éxito:** imprime `0`.  
  - **Límites:** no hagas `pass` silencioso; no commits parciales a mano.
- **Proposed instruction/description improvements:**  
  1. El starter captura IntegrityError y no revierte.  
  2. Dentro del `except`, llama `con.rollback()`.  
  3. Imprime `COUNT(*)` (debe ser 0).  
  4. Compara mentalmente con el demo `atomic_batch`.
- **Proposed retrospective:**  
  Atomicidad evita filas huérfanas: compliance prefiere fallo ruidoso a estado “casi ok”. Luego (E3): índice en `document_id` para lookups del caso.
- **Code/output changes:** none

---

### S12-T3-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer a `CREATE INDEX` + `PRAGMA index_list`. Instruction nombra output sorted; falta por qué el índice importa en ER lookups y constraint de nombre exacto `idx_document_id`.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Índice idx_document_id y PRAGMA
- **Proposed preamble:**  
  - **Contexto:** el lookup por documento del caso se acelera y se documenta con un índice explícito.  
  - **Meta:** crear `idx_document_id` y listar índices con `PRAGMA index_list`.  
  - **Éxito:** `['idx_document_id', 'sqlite_autoindex_clients_1']` (ordenados).  
  - **Límites:** nombre exacto del índice; no borres el autoindex de la PK.
- **Proposed instruction/description improvements:**  
  1. El starter lista índices sin crear el de document_id.  
  2. Ejecuta `CREATE INDEX idx_document_id ON clients(document_id)`.  
  3. Lee nombres con PRAGMA y haz `sorted`.  
  4. Imprime la lista completa.
- **Proposed retrospective:**  
  El índice es modelo + rendimiento: documenta cómo buscas en el caso. En T4 la geoevidencia cierra el incremento: normalize, mock y política de egress.
- **Code/output changes:** none

---

### S12-T4-A-DEMO (iDo)
- **Diagnosis:** MockGeocoder Lima/Arequipa/Iquitos→None. Description menciona fail-closed y sin PII; falta preamble de ética de egress y retrospective del misconception “inventa un punto para no romper el mapa”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  La geoevidencia del caso usa un geocoder **autorizado/mock**, offline y sin PII bancaria. Observa: Lima y Arequipa devuelven lat/lon fijos; Iquitos → `None` (fail-closed). No se inventa un pin en el mapa. Predice las tres líneas y nota `provider=authorized_mock`. Datos de demo únicamente.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: interfaz intercambiable permite swap a proveedor real con la misma firma; ciudad desconocida no es “cerca de Lima”; puente a normalize y allowlist en We Do.
- **Proposed retrospective:**  
  Fail-closed en geocode desconocido evita basura en el score de S13. We Do: normalizar espacios, implementar el mock y bloquear `document_id` en egress.
- **Code/output changes:** none

---

### S12-T4-A-E1 (weDo, guided)
- **Diagnosis:** normalize strip+colapsar; starter solo strip. Instruction prohíbe `.title()` — bien. Falta contexto de misses del geocoder y constraint N1 de solo espacios.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Normalizar dirección: espacios, no title
- **Proposed preamble:**  
  - **Contexto:** direcciones sintéticas llegan con espacios dobles; el geocoder mock falla si no normalizas.  
  - **Meta:** `strip` + colapsar espacios con `re.sub` (contrato N1).  
  - **Éxito:** `repr(...)` de la dirección del fixture → `'Jr. de la Unión 100'`.  
  - **Límites:** **no** uses `.title()` aquí; no inventes distrito/ubigeo.
- **Proposed instruction/description improvements:**  
  1. El starter solo hace `strip` y deja espacios dobles.  
  2. Aplica `re.sub(r'\s+', ' ', s.strip())`.  
  3. Imprime con `repr` para ver espacios exactos.  
  4. No cambies capitalización.
- **Proposed retrospective:**  
  Normalize reduce misses sin inventar campos. El title-case es política del proveedor, no del contrato N1 de S12. Siguiente: MockGeocoder con fail-closed (E2).
- **Code/output changes:** none

---

### S12-T4-A-E2 (weDo, independent)
- **Diagnosis:** MockGeocoder; starter siempre Lima. Instruction nombra éxito lat y None de Cusco. Falta escena de interfaz intercambiable y constraint de tabla fija.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** MockGeocoder: Lima/Arequipa o None
- **Proposed preamble:**  
  - **Contexto:** demos offline necesitan coords fijas por ciudad autorizada, sin red.  
  - **Meta:** `geocode(city)` → dict con lat/lon/provider o `None`.  
  - **Éxito:** lat de Lima `-12.0464`; Cusco → `None`.  
  - **Límites:** solo claves de la tabla DB; no rellenes coords “por defecto”.
- **Proposed instruction/description improvements:**  
  1. El starter ignora la ciudad y siempre usa Lima.  
  2. Si `city` no está en `DB`, devuelve `None`.  
  3. Si está, arma el dict con `provider='mock'`.  
  4. Imprime lat de Lima y el resultado de Cusco.
- **Proposed retrospective:**  
  Interfaz estable permite swap a proveedor autorizado real después. Inventar coords de Cusco es peor que `None`. Luego (E3): allowlist de egress bloquea PII.
- **Code/output changes:** none

---

### S12-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer ético fuerte: allowlist de claves; starter always True. Instruction nombra `document_id` → False. Este es un P0 de **contenido de riesgo** además de prosa: la preamble debe cargar la política CP-N1-C.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Allowlist de egress al geocoder público
- **Proposed preamble:**  
  - **Contexto:** mandar `document_id` bancario a un geocoder gratis es falla de egress y de cumplimiento.  
  - **Meta:** `allowed_for_public_geocoder(payload)` solo si **todas** las claves están en `{address, city, country}`.  
  - **Éxito:** payload limpio → `True`; con `document_id` → `False`.  
  - **Límites:** no envíes montos, cuentas ni nombres si la política lo prohíbe; datos sintéticos únicamente.
- **Proposed instruction/description improvements:**  
  1. El starter siempre devuelve True.  
  2. Usa inclusión de conjuntos: `set(payload) <= ALLOWED`.  
  3. Imprime ambos casos del starter.  
  4. No “filtres” solo document_id a mano con un if suelto si el set basta.
- **Proposed feedback improvement:**  
  La allowlist es el control: cualquier clave extra (aunque sea `note`) bloquea. Egress se gobierna por política, no por “confío en el mock de hoy”.
- **Proposed retrospective:**  
  Política de egress es requisito CP-N1-C, no un tip opcional. Pregunta: ¿qué campos salen al proveedor en tu You Do? En T4-B validas coords y empaquetas Haversine como señal, no parentesco.
- **Code/output changes:** none

---

### S12-T4-B-DEMO (iDo)
- **Diagnosis:** Haversine Lima–Callao ~8.95 km empaquetado como geoseñal con `verdict=None`. Description y disclaimer excelentes; falta preamble ética y retrospective del misconception `is_family=True` por cercanía.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  La distancia entre Lima y Callao alimenta un **score de relación**, no un veredicto de parentesco o fraude. Observa el demo: `haversine_km` ≈ 8.95, el dict lleva `type`/`value`/`verdict: None` y el disclaimer `signal != kinship`. No escribas: predice el dict y el texto del disclaimer. Juicio humano intacto.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: R=6371 del curso; el paquete de señal es el contrato hacia S13; nunca autoetiquetes `is_family` ni fraude por km.
- **Proposed retrospective:**  
  Si puedes defender en 20 segundos por qué 1.2 km no es parentesco, ya tienes la línea ética del capstone. We Do: validar lat/lon, fórmula Haversine y empaquetar señal.
- **Code/output changes:** none

---

### S12-T4-B-E1 (weDo, guided)
- **Diagnosis:** `valid_lat_lon`; starter no chequea lon. Instruction lista cuatro pares; falta escena “no corrijas a 0,0” y constraint de rangos.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Validar lat/lon antes del mapa
- **Proposed preamble:**  
  - **Contexto:** coords inválidas (91°, lon 181) no entran al mapa ni al Haversine del caso.  
  - **Meta:** `valid_lat_lon` con rangos WGS84.  
  - **Éxito:** `(0,0) True`, `(91,0) False`, `(0,181) False`, `(-12.04,-77.04) True`.  
  - **Límites:** no “corrijas” a 0,0; no uses redondeos mágicos.
- **Proposed instruction/description improvements:**  
  1. El starter solo valida lat.  
  2. Agrega `-180 <= lon <= 180`.  
  3. Recorre los cuatro pares e imprime par y booleano.  
  4. No conviertas inválidos a cero.
- **Proposed feedback improvement:**  
  Validar **antes** de Haversine o de pintar evita el clásico pin en el Golfo de Guinea (0,0 “arreglado”). Fail-closed: rechaza el par.
- **Proposed retrospective:**  
  Rangos de lat/lon son el primer gate de calidad geo. Siguiente: fórmula Haversine con tolerancia (E2).
- **Code/output changes:** none

---

### S12-T4-B-E2 (weDo, independent)
- **Diagnosis:** Haversine real vs aproximación euclídea*111 en el starter. Instruction nombra ~111.19 y `tolerance_ok`. Falta anclar R=6371 y el uso como señal (no solo “pasar el assert”).
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Haversine con R=6371 y tolerancia
- **Proposed preamble:**  
  - **Contexto:** la geoseñal del caso usa distancia esférica WGS84, no un atajo euclídeo.  
  - **Meta:** implementar `haversine_km` y verificar ~111.19 km entre (0,0) y (0,1).  
  - **Éxito:** `111.19` y `tolerance_ok` si `abs(d-111.19) < 1`.  
  - **Límites:** R=6371.0; usa `math.radians` / sin / cos / asin / sqrt; no dejes el atajo *111.
- **Proposed instruction/description improvements:**  
  1. El starter multiplica diferencia de lon por 111 (no es Haversine).  
  2. Implementa la fórmula del I Do / theory.  
  3. Imprime `round(d, 2)` y, si pasa la tolerancia, `tolerance_ok`.  
  4. Conserva el assert del starter.
- **Proposed retrospective:**  
  El test de tolerancia evita regresiones de fórmula en el capstone. Un atajo *111 solo “casi funciona” en el ecuador. Luego (E3): empaquetar km como señal sin kinship.
- **Code/output changes:** none

---

### S12-T4-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer ético: starter pone `kinship_verdict: True`. Instruction y feedback ya nombran el riesgo. Falta preamble de score S13 y retrospective de defensa en entrevista.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Distancia como geoseñal, no parentesco
- **Proposed preamble:**  
  - **Contexto:** 1.2 km entre entidades sintéticas alimenta `relationship_signal_score` en S13; **no** es veredicto familiar ni de fraude.  
  - **Meta:** `as_relationship_signal(km)` con `type`, `value` y `kinship_verdict=None`.  
  - **Éxito:** dict para `1.2` con verdict `None` (nunca `True`).  
  - **Límites:** no setees `is_family`; no inventes campos de fraud score aquí.
- **Proposed instruction/description improvements:**  
  1. El starter fuerza `kinship_verdict: True` (DEFECT ético).  
  2. Cambia a `None`.  
  3. Imprime el dict completo.  
  4. Mantén `type='geo_distance_km'` y `value=km`.
- **Proposed feedback improvement:**  
  Cercanía geográfica es **señal**, no prueba. Autoetiquetar parentesco colapsa el juicio humano y rompe la ética del capstone.
- **Proposed retrospective:**  
  Si puedes defender `verdict=None` en 30 segundos en una entrevista, cerraste el hilo geo de S12. El You Do integra HTTP + SQL + esta señal en un solo smoke path.
- **Code/output changes:** none

---

### S12-youDo (youDo)
- **Diagnosis:** Proyecto bien enmarcado: context denso de CP-N1-C, objectives, requirements, starter con stubs `NotImplemented`, smoke `main()`, rubric por pesos, portfolioNote con tres capturas. **Falta solo `retrospective`** de defensa/reflexión post-build. Sin ella el learner cierra el script sin preguntas de metacognición ni puente explícito a S13.
- **Checklist:** context pass · goal pass (objectives) · success partial (rubric + smoke, sin self-check de cierre) · constraints pass (requirements) · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (ya existe title de proyecto)
- **Proposed preamble:** N/A — el `context` actual cumple rol de escena; no duplicar. Opcional micro-mejora del context: una línea al final “antes de marcar listo, responde las tres preguntas de la retrospectiva”.
- **Proposed instruction/description improvements:**  
  Mantener starter y smoke path. Asegurar en portfolioNote (ya bueno) que las tres capturas se alinean a la retrospectiva: provenance sin token, join de caso, geoseñal con disclaimer.
- **Proposed retrospective:**  
  Antes de marcar listo: (1) ¿qué status de la política N1 demuestras con un print o test (`should_retry` / `get_entity`)? (2) ¿el manifest de provenance puede pegarse en un README sin filtrar secreto? (3) Escribe una frase de impacto medible (p. ej. “join C001 + 8.95 km como señal, sin kinship”) que puedas defender en 30 segundos frente a S13. Datos solo sintéticos; egress sin PII bancaria.
- **Code/output changes:** none (stubs y main ya son el andamiaje correcto)
- **Validation notes:** No tocar outputs del smoke salvo que un Fixer ejecute y descubra drift; fuera de alcance Round 1 review.

---

## Priority order

### P0 (Fixer primero — We Do: title + preamble + instruction task-only + retrospective; feedback si está vacío de razonamiento)
1. **S12-T1-A-E1, E2, E3** — status/JSON y política N1 (base del adaptador)
2. **S12-T1-B-E1, E2, E3** — timeout, paginación, retry selectivo
3. **S12-T2-A-E1, E2, E3** — token, caché, provenance
4. **S12-T2-B-E1, E2, E3** — contract, fallback, runbook
5. **S12-T3-A-E1, E2, E3** — esquema, CRUD, join
6. **S12-T3-B-E1, E2, E3** — SQL seguro, rollback, índice (E1 es alto impacto ético)
7. **S12-T4-A-E1, E2, E3** — normalize, mock, **egress** (E3 crítico de cumplimiento)
8. **S12-T4-B-E1, E2, E3** — valid coords, Haversine, geoseñal sin kinship (E3 ético)

### P1
- **8 iDo demos:** añadir `preamble` + `retrospective`; expandir `why` a 40–90 palabras donde quede en una frase
- **youDo:** añadir solo `retrospective` de defensa (context/rubric ya sólidos)

### P2
- Enriquecer `feedback` de una línea a 25–60 palabras con misconception típico (prioridad en T1-A-E1, T1-B-E3, T3-B-E1, T4-A-E3, T4-B-E3)
- Revisar hints E1 que son casi-solución: mantener andamiaje pero no pegar la fórmula completa en E2/E3 si el Fixer toca hints

---

## Residual risks

1. **Carga cognitiva del You Do:** 12+ stubs en un solo script; sin retrospective, el learner “completa prints” sin armar narrativa de portafolio. Mitigar con retrospective + portfolioNote (ya existe).
2. **T2-B-E3 delgado:** `operation_mode` es trivial en código; si el Fixer no carga el “por qué” en preamble, se siente relleno. No borrar: sirve de runbook; la prosa debe justificarlo.
3. **Alineación N1 500 vs retry:** theory y ejercicios fuerzan “500 no reintenta”; un learner con experiencia de producción puede dudar. Preamble/retrospective deben decir “contrato de ejercicios N1”, no “verdad absoluta de ops”.
4. **Doble naming de verdict:** demo usa `verdict`, E3 usa `kinship_verdict`. No es bug de tests si cada unit es autocontenida; el Fixer no debe unificar outputs sin re-ejecutar. Mencionar en retrospective del You Do si se desea consistencia de vocabulario hacia S13.
5. **Hints spoiling:** varios E1/E2 casi entregan la solución; aceptar en E1, endurecer solo si Round 2 ve dependencia excesiva.
6. **Sin campos en schema runtime:** el Fixer debe confirmar que `preamble` / `retrospective` / We Do `title` ya están en `types.ts` y se renderizan (como en gold S26/S30); no inventar nombres de campo.

---

## Summary for Fixer

| Block | Acción |
|-------|--------|
| 24 weDo | Añadir `title`, `preamble` (80–150 palabras o 4 bullets), partir `instruction` a pasos solo-tarea, añadir `retrospective` (40–80 palabras); opcional enriquecer `feedback` |
| 8 iDo | Añadir `preamble` + `retrospective`; alargar `why` si queda en 1 frase |
| 1 youDo | Añadir `retrospective` de defensa; no reescribir context/rubric/starter salvo micro-gancho |
| Código/output | **Preservar** salvo justificación execute-and-diff; DEFECT y solutions están bien |

**No** se editó código fuente en este round. Prosa propuesta lista para implementación manual unidad por unidad.

---

Section 12 exercise pedagogy review complete. Ready for the Fixer prompt.
