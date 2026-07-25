# S08 Exercise Pedagogy Report (Round 1)

## Section
- **title:** Archivos, CSV, JSON y contratos de ingesta
- **id:** `pandas` (index 8; archivo histórico `s08-pandas.ts` — contenido es pathlib/csv/json/hashlib/stdlib ETL, no pandas)
- **source:** `src/lib/course/sections/s08-pandas.ts`
- **counts:** iDo 8, weDo 24 (8 subtemas × E1/E2/E3), youDo 1
- **subtopics:** T1-A Path/UTF-8 · T1-B atomic/newlines · T2-A CSV dialect/cast · T2-B cuarentena · T3-A JSON/JSONL · T3-B schema/nulls · T4-A hash/backup · T4-B manifest/reconcile
- **gate:** CP-N1-B (clean + quarantine + manifest, fail-closed, solo datos sintéticos)

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` (preamble checklist, retrospective, E1→E2→E3 fade, length limits)
- Manually inspected every `iDo.steps[]`, `weDo.steps[]`, and `youDo` in the source (código, starter, solution, output, instruction, hint(s), feedback, why)
- Cross-checked against section story (ingesta confiable en stdlib, laboratorio sintético Perú, sin PII real, puente al You Do CP-N1-B)
- No bulk generation, no scripts, no copy-paste across sections

## Global findings (before unit ledger)

| Gap | Where | Impact |
|-----|--------|--------|
| **Zero `preamble`** | All 8 iDo + all 24 weDo | Newbie no ve escenario → meta → éxito → límites antes del código |
| **Zero `retrospective`** | All iDo + weDo + youDo | Cierre metacognitivo ausente; no hay principio + misconception + puente |
| **Zero We Do `title`** | 24 weDo | Solo el prefijo “E1/E2/E3 …” dentro de `instruction`; UI carece de encabezado corto |
| **Instructions = drill + fixture** | Most weDo | “Concepto + imprime X”; poco andamiaje ordenado en pasos para E1; poco fade E1→E3 |
| **Feedback de una línea** | Most weDo | No explica el *razonamiento* del error típico ni el porqué del patrón del gate |
| **`why` iDo corto y técnico** | 8 demos | Cumple rol técnico; no sustituye preamble (antes) ni retrospective (después) |
| **youDo bien enmarcado** | context/objectives/requirements/rubric/starter | Fuerte receta de ensamblaje y contratos; falta solo `retrospective` de defensa |
| **Código/outputs** | Casi todos | Pedagógicamente coherentes; defectos de starter bien nombrados (`# DEFECT: …`) |
| **Intro weDo con mapa puente** | weDo.intro | Excelente orientación de sección; no reemplaza preambles por unidad |

**Severity default for this section:** systematic missing preamble+retrospective is **P0** on every We Do and **P1** on I Do (demos still have `description`+`why`+worked code). youDo retrospective alone is **P1**. Feedback/title polish is often **P2** if preamble/instruction/retrospective land. Code/output changes are **none** unless noted.

---

## Unit ledger

### S08-T1-A-DEMO (iDo)
- **Diagnosis:** Demo clara de `Path` + `write_text`/`read_text` con tilde (`José`) y `encoding='utf-8'`. `description` y `why` existen pero son telegráficos. No hay preamble (qué observar: exists + relectura UTF-8) ni retrospective (mojibake/locale Windows). Un newbie ve código y `(True, 'cliente;José\n')` sin anclarlo al intake del gate.
- **Checklist:** context fail · goal partial · success partial (output existe, no se nombra como criterio) · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Antes de parsear CSV o JSON, el intake vive en disco. En esta demo creas un archivo sintético con tilde (`José`) usando `Path` y UTF-8 explícito. Observa sin escribir: (1) `write_text(..., encoding='utf-8')` deja bytes legibles; (2) `exists()` confirma que el path es real; (3) `read_text` devuelve el mismo texto. Si omites el encoding, en Windows el locale del SO puede romper tildes. Datos de demo únicamente; no hay PII real.
- **Proposed instruction/description improvements:**  
  Mantener description. Ampliar `why` (~60 palabras): Path unifica rutas; UTF-8 es contrato portable del gate; el resto del ETL (CSV, hash, manifest) hereda este ladrillo — sin él, mojibake y rutas frágiles contaminan clean y cuarentena.
- **Proposed retrospective:**  
  Si puedes explicar por qué `encoding='utf-8'` no es “detalle de estilo” sino contrato de ingesta, ya tienes el hábito del gate. El error clásico es confiar en el default del SO. En We Do T1-A practicarás exists, `with open` y el diagnóstico de `UnicodeDecodeError`.
- **Code/output changes:** none
- **Validation notes:** Output actual es el éxito observable de la demo.

---

### S08-T1-A-E1 (weDo, guided)
- **Diagnosis:** Drill mínimo: starter no escribe y `exists()` es False. Instruction mezcla meta y pass en una frase; sin preamble de contexto de intake ni title. Feedback de una línea no repara el misconception “crear el Path ya crea el archivo”.
- **Checklist:** context fail · goal partial · success pass · constraints partial (“Solo stdlib”) · retrospective fail
- **Severity:** P0
- **Proposed title:** Crear demo.txt y verificar con exists
- **Proposed preamble:**  
  - **Contexto:** en el ETL local, antes de leer un intake sintético debes **crearlo** y comprobar que el path existe.  
  - **Meta:** practicar `write_text` + `exists` con UTF-8.  
  - **Éxito:** imprimes un solo valor: `True`.  
  - **Límites:** solo stdlib (`pathlib`, `tempfile`); no uses open a ciegas sin haber escrito.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: se imprime `p.exists()` sin haber escrito nada (siempre False).  
  2. Escribe `'hola'` en `demo.txt` con `write_text(..., encoding='utf-8')`.  
  3. Imprime solo `p.exists()`.  
  4. No agregues texto extra en el `print`.
- **Proposed feedback improvement:**  
  Un `Path` es solo una ruta: no crea el archivo. `write_text` materializa el contenido; `exists()` confirma el artefacto antes de que el pipeline abra a ciegas. En el gate, este chequeo alimenta mensajes de error claros.
- **Proposed retrospective:**  
  Crear + verificar es el primer ladrillo de provenance: no asumas que el cwd o el IDE dejaron el archivo. Siguiente (E2): escribir y releer líneas con `with` sin dejar handles abiertos.
- **Code/output changes:** none
- **Validation notes:** Starter defect (`# DEFECT: no escribe`) es pedagógico y bien formado.

---

### S08-T1-A-E2 (weDo, independent)
- **Diagnosis:** Buen foco en `with path.open` + relectura. Instruction densa con éxito; sin preamble de por qué `with` importa en un ETL. Feedback correcto pero corto. E2 debería fijar meta+éxito con menos migas que E1 — hoy aún suena a mini-spec.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Escribir y releer tres líneas con with
- **Proposed preamble:**  
  - **Contexto:** el pipeline escribe salidas y relee inputs; un handle sin cerrar es deuda operativa.  
  - **Meta:** usar `with path.open` para escribir y leer tres líneas.  
  - **Éxito:** imprime `['a', 'b', 'c']`.  
  - **Límites:** encoding UTF-8; cierra con `with` (no dejes el archivo abierto a mano).
- **Proposed instruction/description improvements:**  
  1. En `lines.txt`, escribe `a`, `b` y `c` (una por línea) con `open('w', encoding='utf-8')`.  
  2. Reabre en lectura, aplica `strip` a cada línea y arma la lista.  
  3. Imprime solo la lista.  
  4. No uses `write_text` aquí: practicas el contexto `with`.
- **Proposed feedback improvement:**  
  `with` garantiza cierre aunque falle el cuerpo — patrón del gate al abrir CSV con `newline=''`. El error típico es olvidar el `\n` o no hacer `strip` y fallar el assert de la lista limpia.
- **Proposed retrospective:**  
  Abrir-escribir-cerrar y abrir-leer-cerrar es el ritmo de todo artifact del gate (clean, quarantine, manifest). Luego (E3) verás qué pasa cuando los bytes no son UTF-8 válido.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S08-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transferencia real (bytes inválidos → `UnicodeDecodeError` → acción de cuarentena). Instruction ya narra el bug; falta contexto de fail-closed del archivo completo y cierre retrospectivo. Starter “traga” con latin-1: defecto excelente. Feedback aceptable pero sin anclar al contrato “archivo a cuarentena, no parche a ojo”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Diagnosticar UTF-8 roto y cuarentenar
- **Proposed preamble:**  
  - **Contexto:** un export sintético llega con bytes que no son UTF-8; el gate no “arregla” tildes a ojo.  
  - **Meta:** capturar `UnicodeDecodeError` y nombrar una acción fail-closed.  
  - **Éxito:** primera línea `UnicodeDecodeError`; segunda, una acción (cuarentenar o reintentar con encoding documentado).  
  - **Límites:** no uses `latin-1` para “hacer que funcione”; no inventes PII real.
- **Proposed instruction/description improvements:**  
  1. El starter lee con `latin-1` y siempre “funciona”: es el defecto.  
  2. Intenta `read_text(encoding='utf-8')` dentro de `try`.  
  3. En `except UnicodeDecodeError`, imprime `type(e).__name__` y la acción.  
  4. No silencies la excepción con otro encoding mágico.
- **Proposed feedback improvement:**  
  Encoding roto es fallo de **archivo**, no de una celda: cuarentena del input o reintento con encoding **documentado** (p. ej. `utf-8-sig` si hay BOM). Tragar con latin-1 oculta mojibake y contamina el hash del crudo.
- **Proposed retrospective:**  
  Fail-closed en disco: si no puedes leer el contrato UTF-8, no inventes clean. El nombre de la excepción es evidencia. En T1-B el foco pasa a newlines y escritura atómica del artefacto de salida.
- **Code/output changes:** none
- **Validation notes:** Transfer surface (diagnóstico) distinta de E1/E2; good fade.

---

### S08-T1-B-DEMO (iDo)
- **Diagnosis:** Worked example excelente de `write_atomic` (tmp + `os.replace` + tmp gone). `why` técnico correcto; falta escena “por qué el consumidor del clean no debe ver truncado” y cierre metacognitivo.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  El clean del gate se relee por otros procesos o por ti en la siguiente corrida. Si escribes directo a `clean.csv` y el proceso muere a medias, el consumidor ve basura. Observa la demo: se escribe a `clean.csv.tmp`, luego `os.replace` al destino, y el tmp **desaparece**. Predice la salida (`id,nombre` / `C001,Ana` / `tmp gone True`) antes de contrastar. Contrato único del curso: `path.with_name(path.name + '.tmp')` en el mismo directorio.
- **Proposed instruction/description improvements:**  
  Description puede quedar “write_atomic: tmp + os.replace sin dejar basura”. Ampliar `why`: atomicidad del swap; mismo dir evita renames cross-device; este helper se reutiliza en You Do para clean, quarantine y manifest.
- **Proposed retrospective:**  
  Temp completo + replace = el destino solo cambia cuando el contenido está listo. No confundas “escribí el string” con “el consumidor ve el estado final”. We Do: detectar CRLF, implementar atomic y simular mid-write.
- **Code/output changes:** none
- **Validation notes:** Output muestra contrato tmp gone; conservar.

---

### S08-T1-B-E1 (weDo, guided)
- **Diagnosis:** Drill de bytes CRLF vs LF; starter busca solo `\n` (True en ambos). Instruction telegráfica; sin anclar a provenance/documentar origen Windows. Feedback de una línea.
- **Checklist:** context fail · goal partial · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Detectar CRLF en samples win y unix
- **Proposed preamble:**  
  - **Contexto:** exports de Excel en Windows suelen traer `\r\n`; documentar el origen ayuda al manifest/logs, sin reescribir el crudo.  
  - **Meta:** detectar presencia de `b'\r\n'` en samples sintéticos.  
  - **Éxito:** imprime `True` y luego `False`.  
  - **Límites:** solo bytes; no “arregles” el archivo ni conviertas newlines aquí.
- **Proposed instruction/description improvements:**  
  1. El starter usa `b'\n' in data` (True en win y unix): es el defecto.  
  2. Cambia a buscar `b'\r\n'`.  
  3. Imprime el booleano de `win` y el de `unix`.  
  4. No mutes los samples.
- **Proposed feedback improvement:**  
  `\n` aparece en ambos mundos; la firma de Windows es el par `\r\n`. Detectar no es normalizar: solo registra un hecho de provenance para depurar exports raros.
- **Proposed retrospective:**  
  Newlines son metadata del origen, no “error a silenciar”. Siguiente (E2): implementar `write_atomic` con el contrato tmp del curso.
- **Code/output changes:** none
- **Validation notes:** Output `True\nFalse` correcto.

---

### S08-T1-B-E2 (weDo, independent)
- **Diagnosis:** Pieza reutilizable del You Do; instruction nombra el contrato tmp pero sin preamble de riesgo mid-write. Starter escribe directo: defecto claro. Feedback corto pero alineado al gate.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Implementar write_atomic con tmp y replace
- **Proposed preamble:**  
  - **Contexto:** clean, quarantine y manifest del CP-N1-B deben publicarse sin estados a medias.  
  - **Meta:** implementar `write_atomic(path, text)` con el contrato del curso.  
  - **Éxito:** tras escribir `'ok\n'`, el contenido final es la línea `ok`.  
  - **Límites:** `tmp = path.with_name(path.name + '.tmp')` + `os.replace`; UTF-8; no dejes el tmp.
- **Proposed instruction/description improvements:**  
  1. El starter escribe directo al destino: corrígelo.  
  2. Escribe el texto completo al `.tmp` en el mismo directorio.  
  3. Haz `os.replace(tmp, path)`.  
  4. Escribe `'ok\n'`, relee e imprime el contenido (sin basura extra).
- **Proposed feedback improvement:**  
  El tmp debe vivir junto al destino para que `replace` sea atómico en el mismo filesystem. Escribir directo es el anti-patrón: un crash deja el clean truncado a consumidores.
- **Proposed retrospective:**  
  Esta función es la que reutilizarás en el You Do sin reabrir la solución. Principio: publicar solo el estado final. Luego (E3) contrastarás un mid-write parcial vs. el replace completo.
- **Code/output changes:** none (nota: solution usa `'ok\n'`; starter demo usaba `'FULL'` — coherente al fix)
- **Validation notes:** Contrato tmp alineado con teoría T1-B.

---

### S08-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Buena narrativa mid vs final; starter usa segundo write directo y etiqueta `end` en vez de `final`. Instruction densa; falta preamble de “qué ve el consumidor” y retrospective. Pequeña inconsistencia de labels en starter vs solution (pedagógica, OK).
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Simular mid-write y cerrar con atomic
- **Proposed preamble:**  
  - **Contexto:** un consumidor lee `f.txt` mientras el pipeline aún escribe.  
  - **Meta:** mostrar estado parcial y luego un replace atómico a estado completo.  
  - **Éxito:** `mid PARCIAL` y `final COMPLETO`.  
  - **Límites:** el segundo paso debe ser tmp + `os.replace`, no otro `write_text` directo.
- **Proposed instruction/description improvements:**  
  1. Deja el primer write de `'PARCIAL'` e imprime `mid …`.  
  2. Sustituye el segundo write directo por tmp + `os.replace` a `'COMPLETO'`.  
  3. Imprime `final` (no `end`) con el contenido final.  
  4. No borres el paso mid: es la evidencia del problema.
- **Proposed feedback improvement:**  
  Atomic no reescribe la historia del parcial: evita que el **siguiente** lector vea un estado intermedio. El label `final` documenta el contrato de salida del gate.
- **Proposed retrospective:**  
  Mid-write es el enemigo del clean compartido. Si puedes explicar por qué tmp+replace no “arregla” un crash anterior pero sí protege al consumidor, ya internalizaste T1-B. Siguiente tema: CSV con headers y Decimal.
- **Code/output changes:** none
- **Validation notes:** Transfer conceptual (riesgo) bien distinto de E2 (implementar helper).

---

### S08-T2-A-DEMO (iDo)
- **Diagnosis:** Demo sólida DictReader + Decimal quantize a string. `why` enlaza S02; falta preamble de “por qué no float en montos PEN sintéticos” y retrospective del contrato de columnas.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  El intake de clientes sintéticos trae montos como texto. Observa la demo: `DictReader` arma dicts por header; cada `monto` pasa por `Decimal(...).quantize(Decimal('0.01'))` y se guarda como **string** (`'10.50'`, `'20.00'`). La fecha queda ISO string. No escribas aún: predice la lista de dicts y contrástala. Si usaras `float`, el binario rompería cuadraturas y tests del gate.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: cast explícito; fallo iría a cuarentena (We Do E3); dialecto/default coma aquí, `;` en Latam se declara explícito en teoría.
- **Proposed retrospective:**  
  Dinero en texto → Decimal → texto: mismo contrato de S02, ahora sobre filas CSV. No confíes en “parece número”. We Do: DictReader, DictWriter con header y reject por `InvalidOperation`.
- **Code/output changes:** none
- **Validation notes:** Output con montos string quantizados; conservar.

---

### S08-T2-A-E1 (weDo, guided)
- **Diagnosis:** Starter con split manual es defecto clásico y bueno. Instruction corta; sin contexto de headers como contrato. Feedback de una línea.
- **Checklist:** context fail · goal partial · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Leer filas CSV con DictReader
- **Proposed preamble:**  
  - **Contexto:** el clean del gate trabaja por **nombre de columna**, no por posición frágil.  
  - **Meta:** usar `csv.DictReader` sobre un StringIO sintético.  
  - **Éxito:** imprime `{'id': 'C001', 'nombre': 'Ana'}`.  
  - **Límites:** solo stdlib; no hagas `split(',')` manual del cuerpo.
- **Proposed instruction/description improvements:**  
  1. El starter parte líneas a mano: rompe si hay comas en campos.  
  2. Envuélvelo en `io.StringIO` y recorre con `DictReader`.  
  3. Imprime cada fila (dict).  
  4. Confirma mentalmente que el header define las claves.
- **Proposed feedback improvement:**  
  `DictReader` usa la primera línea como fieldnames y entrega dicts. El split manual desalinea columnas y es el camino a métricas corruptas del gate.
- **Proposed retrospective:**  
  Header = contrato de columnas del intake. Siguiente (E2): escribir con `DictWriter` y `writeheader` para que el clean se pueda releer.
- **Code/output changes:** none
- **Validation notes:** Output dict C001 Ana correcto.

---

### S08-T2-A-E2 (weDo, independent)
- **Diagnosis:** Defecto sin `writeheader` es excelente (n=0 o basura). Instruction con pass claro; falta preamble de “clean re-leíble”. Feedback corto.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Escribir CSV con writeheader y releer
- **Proposed preamble:**  
  - **Contexto:** el artefacto clean debe reabrirse con `DictReader` en la siguiente etapa.  
  - **Meta:** escribir con `DictWriter` + `writeheader` y verificar relectura.  
  - **Éxito:** imprime `1` y luego `{'id': 'C001', 'nombre': 'Ana'}`.  
  - **Límites:** declara `fieldnames`; no omitas el header.
- **Proposed instruction/description improvements:**  
  1. El starter hace `writerow` sin `writeheader`: el reader no ve columnas.  
  2. Añade `writeheader` antes de la fila de Ana.  
  3. `seek(0)`, lee con `DictReader`, imprime `len` y `rows[0]`.  
  4. En disco real usarías `newline=''`; aquí basta StringIO.
- **Proposed feedback improvement:**  
  Sin header, `DictReader` interpreta la primera fila de datos como nombres de columna o devuelve vacío según el buffer — el clean deja de ser contrato. `writeheader` es parte del artefacto, no un adorno.
- **Proposed retrospective:**  
  Salida con header estable = contrato de clean. Luego (E3) el cast de monto decide clean vs reject con motivo.
- **Code/output changes:** none
- **Validation notes:** Output `1` + dict Ana correcto.

---

### S08-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Transferencia fuerte (float → Decimal + motivo `cast_monto`). Instruction densa con pass; falta anclar a cuarentena del gate y retrospective. Starter con `float` es el misconception correcto de S02/S08.
- **Checklist:** context fail · goal pass · success pass · constraints pass (“Sin float()”) · retrospective fail
- **Severity:** P0
- **Proposed title:** Cast Decimal con reject cast_monto
- **Proposed preamble:**  
  - **Contexto:** montos sintéticos del intake deben cuantizarse a céntimos; un valor basura no entra a clean.  
  - **Meta:** `Decimal` + quantize; fallos con motivo estable.  
  - **Éxito:** `ok 10.00` / `reject x motivo=cast_monto` / `ok 3.50`.  
  - **Límites:** sin `float()`; sin rellenar `0` silencioso.
- **Proposed instruction/description improvements:**  
  1. El starter usa `float` y no imprime motivo: corrígelo.  
  2. Para cada valor en `['10', 'x', '3.5']`, intenta Decimal quantize `0.01`.  
  3. Si `InvalidOperation`, imprime `reject`, valor y `motivo=cast_monto`.  
  4. Si ok, imprime `ok` y el monto quantizado.
- **Proposed feedback improvement:**  
  `float` “traga” o falla sin vocabulario de cuarentena. `InvalidOperation` + `reason` estable alimenta el contador del manifest. El `0` mágico es deuda que rompe reconcile y auditoría.
- **Proposed retrospective:**  
  Cast fallido = fila a cuarentena con motivo, no métrica inventada. Mismo patrón del You Do en `load_clients_csv`. Siguiente subtema: filas irregulares y archivo de cuarentena.
- **Code/output changes:** none
- **Validation notes:** Fade E1 reader → E2 writer → E3 cast/reject es sólido.

---

### S08-T2-B-DEMO (iDo)
- **Diagnosis:** Demo clara clean vs quarantine con `reason: col_count`. `why` bueno; falta preamble de invariante “toda fila termina en un lado” y retrospective hacia reconcile T4.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Filas con columnas de más o de menos no se “arreglan” en silencio. Observa: el header fija el largo esperado; `C002,Luis,EXTRA` y `badonly` van a cuarentena con `reason: 'col_count'` y raw conservado; solo `C001,Ana` entra a clean. Predice la tupla `(clean, quar)` antes de mirar la salida. Sin este split, T4 no puede reconciliar `n_in`.
- **Proposed instruction/description improvements:**  
  Description OK (“Separar good vs quarantine”). Ampliar `why`: vocabulario estable de `reason`; raw intacto; invariante por fuente del gate.
- **Proposed retrospective:**  
  Irregular ≠ “casi bien”: es rechazo con traza. El misconception es truncar o rellenar columnas a ciegas. We Do: booleano col_count, escribir quarantine.csv y resumir motivos.
- **Code/output changes:** none
- **Validation notes:** Output con dos quarantine rows; conservar.

---

### S08-T2-B-E1 (weDo, guided)
- **Diagnosis:** Micro-drill de `len(row) != len(header)`. Instruction mínima; sin anclar a por qué se chequea antes del zip. Feedback de una línea.
- **Checklist:** context fail · goal partial · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Detectar fila irregular por col_count
- **Proposed preamble:**  
  - **Contexto:** antes de armar el dict con `zip(header, row)`, el gate valida el largo.  
  - **Meta:** detectar mismatch de columnas.  
  - **Éxito:** imprime `True` para `row = ['C1','Ana','x']` con header de 2.  
  - **Límites:** no uses DictReader aquí; solo el booleano de irregularidad.
- **Proposed instruction/description improvements:**  
  1. El starter deja `irregular = False` fijo.  
  2. Asigna `irregular = len(row) != len(header)`.  
  3. Imprime solo el booleano.  
  4. No trunques `row` para “hacerla pasar”.
- **Proposed feedback improvement:**  
  Chequeo barato O(1) evita desalinear columnas con `zip` (que silencia el sobrante). `col_count` es el `reason` canónico de esta falla.
- **Proposed retrospective:**  
  Contar columnas es el portero de clean. Siguiente (E2): persistir la cuarentena en CSV con `raw` y `reason`.
- **Code/output changes:** none
- **Validation notes:** Output `True` correcto.

---

### S08-T2-B-E2 (weDo, independent)
- **Diagnosis:** Escribir quarantine.csv es pieza de primera clase del gate; instruction nombra fieldnames pero sin preamble de “archivo de evidencia”. Starter solo checa exists: defecto claro.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Escribir quarantine.csv con raw y reason
- **Proposed preamble:**  
  - **Contexto:** la cuarentena no es un print: es un artefacto que el auditor y el manifest cuentan.  
  - **Meta:** escribir una fila `{raw, reason}` y releer `reason`.  
  - **Éxito:** imprime `col_count`.  
  - **Límites:** `newline=''`, fieldnames `raw` y `reason`, encoding UTF-8; solo stdlib.
- **Proposed instruction/description improvements:**  
  1. El starter no escribe el CSV: solo imprime `exists`.  
  2. Abre `quarantine.csv` con `newline=''` y `DictWriter`.  
  3. `writeheader` + una fila de ejemplo (`raw` sintético, `reason='col_count'`).  
  4. Relee con `DictReader` e imprime `rows[0]['reason']`.
- **Proposed feedback improvement:**  
  Cuarentena es salida de primera clase del CP-N1-B, no un log tirado. Sin header y `newline=''`, el archivo se vuelve ilegible o se rompe en Windows.
- **Proposed retrospective:**  
  `{raw, reason}` es el contrato mínimo de rejects. Luego (E3) agregas contadores por motivo — insumos del manifest.
- **Code/output changes:** none
- **Validation notes:** Output `col_count` correcto.

---

### S08-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Counter sorted es transferencia útil al manifest; starter tiene el loop con `pass`. Instruction OK; falta contexto de dashboard de calidad y retrospective. Feedback de una línea.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Resumir motivos de cuarentena ordenados
- **Proposed preamble:**  
  - **Contexto:** el manifest y el README de calidad reportan **cuántos** rejects por `reason` estable.  
  - **Meta:** contar y listar motivos en orden.  
  - **Éxito:** tres líneas `cast_monto 1`, `col_count 2`, `schema 1`.  
  - **Límites:** vocabulario corto de reasons; no inventes frases largas distintas por script.
- **Proposed instruction/description improvements:**  
  1. El starter ya importa `Counter` pero no imprime: quita el `pass`.  
  2. Recorre `sorted(Counter(reasons).items())`.  
  3. Imprime `k v` por línea.  
  4. No reordenes a mano con listas fijas.
- **Proposed feedback improvement:**  
  Reasons estables (`col_count`, `cast_monto`, `schema`) permiten sumar entre corridas. Frases largas distintas en cada script rompen el contador del manifest.
- **Proposed retrospective:**  
  Resumen de motivos = calidad medible del intake. Si una reason crece, el contrato de la fuente está fallando. Siguiente tema: JSON array/JSONL y schema.
- **Code/output changes:** none
- **Validation notes:** Output sorted lexicográfico correcto.

---

### S08-T3-A-DEMO (iDo)
- **Diagnosis:** Demo clara array indentado + JSONL líneas. `why` distingue casos de uso; falta preamble “mismo list de dicts, dos formatos” y retrospective.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Las transacciones sintéticas salen del mismo `list[dict]`. Observa: `json.dumps(..., ensure_ascii=False, indent=2)` arma un array re-legible; JSONL une un `dumps` por fila con `\n` (append-friendly). La demo relee el array y las líneas del `.jsonl`. Predice la tupla de retorno antes de contrastar. Montos ya van como string del contrato Decimal.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: cuándo batch pequeño vs stream; UTF-8 al escribir a disco; puente a We Do loads/dumps/datetime.
- **Proposed retrospective:**  
  Formato de salida se elige por caso de uso, no por “cuál es más moderno”. JSONL no es un array roto: es un objeto por línea. We Do: loads, tildes legibles y datetime no serializable.
- **Code/output changes:** none
- **Validation notes:** Output dual array/JSONL; conservar.

---

### S08-T3-A-E1 (weDo, guided)
- **Diagnosis:** Starter con slice manual es defect divertido y pedagógico. Instruction corta; sin anclar a “parseo real del intake JSON”. Feedback loads vs load en una línea — bueno pero seco.
- **Checklist:** context fail · goal partial · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Parsear JSON con loads e id C001
- **Proposed preamble:**  
  - **Contexto:** `transactions.json` del gate llega como texto; el slice manual es frágil.  
  - **Meta:** usar `json.loads` y leer `id`.  
  - **Éxito:** imprime `C001`.  
  - **Límites:** solo stdlib; no indexar caracteres del string crudo.
- **Proposed instruction/description improvements:**  
  1. El starter hace `raw[7:11]`: se rompe al cambiar espacios o comillas.  
  2. Sustituye por `json.loads(...)`.  
  3. Imprime `obj['id']`.  
  4. No uses expresiones regulares sobre el JSON.
- **Proposed feedback improvement:**  
  `loads` parsea **string**; `load` parsea **file**. El slice asume posiciones fijas y falla en el primer cambio de formato del export.
- **Proposed retrospective:**  
  Parsear con la librería es el único camino auditable. Siguiente (E2): serializar tildes legibles para logs Latam.
- **Code/output changes:** none
- **Validation notes:** Output `C001` correcto.

---

### S08-T3-A-E2 (weDo, independent)
- **Diagnosis:** Foco `ensure_ascii=False` excelente para Perú/Latam. Instruction ya menciona José; falta preamble de logs/clean legibles y retrospective. Starter con `True` es el defecto correcto.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Serializar José legible con ensure_ascii
- **Proposed preamble:**  
  - **Contexto:** logs y clean del gate se leen en español; escapes `\u00e9` dificultan la revisión humana.  
  - **Meta:** `json.dumps` con tildes legibles.  
  - **Éxito:** imprime `{"nombre": "José"}` sin escapes Unicode.  
  - **Límites:** solo stdlib; no reescribas el string a mano.
- **Proposed instruction/description improvements:**  
  1. El starter usa `ensure_ascii=True` (default mental).  
  2. Cambia a `ensure_ascii=False`.  
  3. Imprime el string resultante.  
  4. Verifica visualmente que aparece `José`, no `\u00e9`.
- **Proposed feedback improvement:**  
  `ensure_ascii=False` deja UTF-8 legible en el texto JSON; el archivo en disco sigue yendo con `encoding='utf-8'`. Útil en onboarding Latam y en demos del portfolio.
- **Proposed retrospective:**  
  Legibilidad del JSON no pelea con corrección: es decisión de serialización. Luego (E3) verás tipos que **no** son JSON nativos (datetime).
- **Code/output changes:** none
- **Validation notes:** Output con José legible; conservar.

---

### S08-T3-A-E3 (weDo, transfer)
- **Diagnosis:** TypeError + isoformat es transferencia real. Starter con `default=str` oculta el error: excelente. Instruction densa; falta preamble de serialización explícita de tipos y retrospective hacia schema T3-B.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Arreglar datetime no serializable en JSON
- **Proposed preamble:**  
  - **Contexto:** un timestamp de corrida o de tx no entra solo a `json.dumps`.  
  - **Meta:** capturar `TypeError` y serializar con `.isoformat()`.  
  - **Éxito:** línea `TypeError` y luego `{"ts": "2026-01-15T10:00:00"}`.  
  - **Límites:** no uses `default=str` en la solución final; conversión explícita.
- **Proposed instruction/description improvements:**  
  1. El starter oculta el fallo con `default=str`.  
  2. Intenta `json.dumps(obj)` en `try` e imprime el nombre de `TypeError`.  
  3. Arma un dict con `ts` en isoformat y haz dumps.  
  4. Imprime ambos resultados en ese orden.
- **Proposed feedback improvement:**  
  `default=str` es un parche opaco: esconde qué tipos no son JSON. Convertir a ISO es contrato legible y estable para el manifest o campos de tiempo documentados.
- **Proposed retrospective:**  
  Tipos no-JSON se transforman **antes** de dumps, no con magia del encoder. Siguiente subtema: schema required, null explícito y defaults compatibles.
- **Code/output changes:** none
- **Validation notes:** Fade loads → dumps utf8 → datetime OK.

---

### S08-T3-B-DEMO (iDo)
- **Diagnosis:** Demo compacta de required + setdefault. `why` correcto; falta preamble de evolución de contrato sin romper productores y retrospective de null vs missing (se ve en output del email None como OK).
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  El schema mínimo del gate pide claves presentes, no “truthy”. Observa: `email: None` **pasa** required (la clave existe); falta `email` falla con `['email']`. Luego `setdefault('segment', 'standard')` añade un opcional sin pisar si ya viniera. Predice las tres salidas. Datos sintéticos `C1` / `a@ex.com` — sin PII real.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: required protege clean; defaults opcionales evolutivos; null explícito se profundiza en We Do E2.
- **Proposed retrospective:**  
  Required = presencia de clave; default = evolución compatible. No confundas “falta el campo” con “viene null”. We Do: implementar validate, inspeccionar None y setdefault sin pisar vip.
- **Code/output changes:** none
- **Validation notes:** Output triple correcto; conservar.

---

### S08-T3-B-E1 (weDo, guided)
- **Diagnosis:** Starter always-True es defecto guiado clásico. Instruction nombra el tuple de éxito; sin preamble de contrato de ingesta. Feedback de una línea.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** validate_schema con required y missing
- **Proposed preamble:**  
  - **Contexto:** cada tx/cliente del gate debe traer un mínimo de claves antes de entrar a clean.  
  - **Meta:** implementar `validate_schema(obj, required)`.  
  - **Éxito:** imprime `(False, ['email'])` para `{'id':'C1'}` con required `id,email`.  
  - **Límites:** no valides truthiness del valor aquí; solo presencia de clave.
- **Proposed instruction/description improvements:**  
  1. El starter siempre devuelve `(True, [])`.  
  2. Calcula `missing = [k for k in required if k not in obj]`.  
  3. Devuelve `(len(missing)==0, missing)`.  
  4. Imprime el resultado de la llamada del fixture.
- **Proposed feedback improvement:**  
  Schema mínimo del contrato de ingesta: sin claves required no hay clean. Separar “falta clave” de “valor inválido” mantiene reasons estables (`schema` vs `cast_monto`).
- **Proposed retrospective:**  
  Listar missing es evidencia accionable, no un booleano opaco. Siguiente (E2): null JSON con clave presente ≠ clave ausente.
- **Code/output changes:** none
- **Validation notes:** Output `(False, ['email'])` correcto.

---

### S08-T3-B-E2 (weDo, independent)
- **Diagnosis:** Excelente misconception (truthiness de None). Starter imprime `bool(obj.get('email'))` → False. Instruction ya nombra el matiz; falta preamble de por qué importa en validación y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Distinguir null explícito de clave ausente
- **Proposed preamble:**  
  - **Contexto:** en JSON, `"email": null` llega a Python como clave con `None`; no es lo mismo que omitir la clave.  
  - **Meta:** inspeccionar presencia y valor sin truthiness.  
  - **Éxito:** imprime `True` y luego `None`.  
  - **Límites:** no uses `bool(obj.get(...))` como proxy de “existe”.
- **Proposed instruction/description improvements:**  
  1. El starter confunde ausencia con falsy.  
  2. Imprime `'email' in obj`.  
  3. Imprime `obj['email']`.  
  4. No borres la clave ni la rellenes.
- **Proposed feedback improvement:**  
  `null` JSON → `None` con clave presente; required del demo T3-B lo trata como presente. Si tu validación usa truthiness, mandas a cuarentena filas que el contrato acepta como “email desconocido”.
- **Proposed retrospective:**  
  Presencia ≠ valor útil. Decide en el contrato del pipeline qué hacer con None (default, cuarentena o clean con null). Luego (E3): defaults con setdefault sin pisar valores reales.
- **Code/output changes:** none
- **Validation notes:** Output `True\nNone` correcto; pedago­gically core.

---

### S08-T3-B-E3 (weDo, transfer)
- **Diagnosis:** setdefault vs assignment que pisa vip: transferencia limpia. Instruction clara; falta preamble de evolución de schema y retrospective hacia provenance T4.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Default segment sin pisar vip
- **Proposed preamble:**  
  - **Contexto:** el contrato crece con un campo opcional `segment`; productores viejos no lo envían.  
  - **Meta:** aplicar default `'standard'` sin destruir `'vip'`.  
  - **Éxito:** `{'id': 'C1', 'segment': 'standard'}` y `{'id': 'C2', 'segment': 'vip'}`.  
  - **Límites:** usa `setdefault`; no asignes a ciegas `obj['segment'] = 'standard'`.
- **Proposed instruction/description improvements:**  
  1. El starter pisa `vip` con assignment.  
  2. En ambos dicts llama `setdefault('segment', 'standard')`.  
  3. Imprime `a` y `b`.  
  4. Verifica que C2 sigue en vip.
- **Proposed feedback improvement:**  
  `setdefault` escribe solo si falta la clave; assignment siempre pisa. Defaults compatibles no rompen productores viejos ni clientes VIP sintéticos del laboratorio.
- **Proposed retrospective:**  
  Evolucionar schema con defaults es mantenimiento de contrato, no “rellenar por si acaso”. Cierre de T3: schema + null + default. Siguiente: hash, backup y provenance del crudo.
- **Code/output changes:** none
- **Validation notes:** Output standard/vip correcto.

---

### S08-T4-A-DEMO (iDo)
- **Diagnosis:** Demo hash corto + backup exists. `why` ancla provenance; falta preamble de “por qué el hash es del crudo, no del clean” y retrospective.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  El auditor pregunta: “¿sobre qué bytes corriste esta ingesta?”. Observa: se escribe un CSV sintético, se copia a `.bak` con `shutil.copy2`, y se calcula `sha256` de `read_bytes`. La demo imprime 12 hex del digest y `True` si el backup existe. No mutes el crudo después de hashearlo sin registrar un nuevo run. Solo sintéticos.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: hash del **input** crudo; backup antes de mutar workspace; el manifest embebe este fingerprint.
- **Proposed retrospective:**  
  Provenance mínima = path + hash + (en We Do) bytes. El misconception es hashear el clean y decir “es el input”. We Do: sha256 completo, copy2 y dict de provenance.
- **Code/output changes:** none
- **Validation notes:** Prefijo `b776a3a39268` coincide con contenido `id\nC1\n` usado también en E3; conservar.

---

### S08-T4-A-E1 (weDo, guided)
- **Diagnosis:** Starter usa `hash()` builtin — misconception perfecto. Instruction con pass hex conocido; falta preamble de reproducibilidad entre máquinas y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** sha256 de archivo y longitud 64
- **Proposed preamble:**  
  - **Contexto:** el manifest del gate fija el fingerprint del input; debe ser estable entre corridas y máquinas.  
  - **Meta:** `hashlib.sha256` sobre bytes del archivo.  
  - **Éxito:** imprime `ba7816bf 64` (primeros 8 hex y largo del digest).  
  - **Límites:** no uses `hash()` builtin (no es portable ni criptográfico).
- **Proposed instruction/description improvements:**  
  1. El starter usa `hash(p.read_bytes())`: incorrecto para provenance.  
  2. Calcula `hashlib.sha256(...).hexdigest()`.  
  3. Imprime `dig[:8]` y `len(dig)`.  
  4. El contenido del temp sigue siendo `b'abc'`.
- **Proposed feedback improvement:**  
  `hash()` de Python no es estable entre procesos y no es SHA-256. El digest hex de 64 chars es el fingerprint que va al manifest y al portfolio del gate.
- **Proposed retrospective:**  
  Mismos bytes → mismo sha256. Si el export cambia una coma, el hash cambia y la corrida es otra. Siguiente (E2): backup byte-idéntico del crudo.
- **Code/output changes:** none
- **Validation notes:** `ba7816bf` es sha256('abc')[:8] canónico; OK.

---

### S08-T4-A-E2 (weDo, independent)
- **Diagnosis:** Backup con copy2; starter no copia. Instruction con pass `True`; falta preamble de “antes de mutar el workspace de entrada” y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Backup in.csv con copy2 e igualdad
- **Proposed preamble:**  
  - **Contexto:** antes de cualquier transformación, el gate preserva el crudo.  
  - **Meta:** copiar `in.csv` a `in.csv.bak` y verificar igualdad de bytes.  
  - **Éxito:** imprime `True`.  
  - **Límites:** `shutil.copy2`; comparar con `read_bytes`, no solo `exists`.
- **Proposed instruction/description improvements:**  
  1. El starter solo imprime `bak.exists()` (False).  
  2. Tras escribir `in.csv`, haz `shutil.copy2(src, bak)`.  
  3. Imprime `bak.read_bytes() == src.read_bytes()`.  
  4. No reescribas el bak a mano con otro contenido.
- **Proposed feedback improvement:**  
  `exists` no prueba igualdad. `copy2` preserva metadata útil; la comparación de bytes es la evidencia de que el backup es el crudo, no un archivo vacío.
- **Proposed retrospective:**  
  Backup es seguro de regresión y de auditoría: si el pipeline falla, aún tienes el input. Luego (E3): empaquetar path, sha256 y bytes en un dict de provenance.
- **Code/output changes:** none
- **Validation notes:** Output `True` correcto.

---

### S08-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Provenance dict es el puente al manifest; starter omite sha256/bytes. Instruction nombra pass parcial (`b776a3a3…`); falta preamble de “qué campos exige el gate por fuente” y retrospective hacia T4-B.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Dict de provenance path sha256 bytes
- **Proposed preamble:**  
  - **Contexto:** cada fuente del manifest carga provenance mínima del crudo.  
  - **Meta:** armar `{path, sha256, bytes}` para `clients.csv` sintético.  
  - **Éxito:** path `clients.csv`, sha256 completo que empieza en `b776a3a3…`, `bytes` 6.  
  - **Límites:** hashea `read_bytes` del archivo; `bytes` vía `stat().st_size` (o len de bytes leídos).
- **Proposed instruction/description improvements:**  
  1. El starter solo pone `path`.  
  2. Añade `sha256` hex completo y `bytes` del tamaño.  
  3. Imprime el dict (no solo keys parciales).  
  4. Contenido del fixture: `id\nC1\n` (6 bytes).
- **Proposed feedback improvement:**  
  Provenance por fuente amarra el run a bytes exactos. Omitir hash o tamaño deja un manifest ornamental. El path como `name` (no abs) es portable en demos del curso.
- **Proposed retrospective:**  
  Si el dict de provenance está completo, el manifest solo tiene que sumar conteos y reconcile. Siguiente: construir manifest multi-fuente y fallar cerrado si no cuadra.
- **Code/output changes:** none
- **Validation notes:** Hash completo en solution coincide con demo T4-A; conservar.

---

### S08-T4-B-DEMO (iDo)
- **Diagnosis:** Demo fuerte de manifest multi-fuente con reconcile_ok por fuente y totales. `why` excelente; falta preamble de “qué mirar en el print” (totales 5/4/1) y retrospective fail-closed.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Esta es la pieza final del gate antes del You Do. Observa: cada fuente trae name, sha256, conteos; se deriva `reconcile_ok` con `n_in == n_clean + n_quarantine`; el manifest suma totales y exige `all(...)`. Predice `n_in=5`, `n_clean=4`, `n_quarantine=1` y `reconcile_ok True`. Ninguna fuente puede esconder pérdidas detrás de otra.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: totales **derivados**, no hardcode; escritura JSON indentada; puente a E3 `run()` fail-closed.
- **Proposed retrospective:**  
  Manifest = evidencia de corrida. Si no cuadra por fuente, no hay “casi OK”. We Do: armar manifest, detectar compensación entre fuentes y publicar solo si todo reconcilia.
- **Code/output changes:** none
- **Validation notes:** Output largo pero correcto; conservar.

---

### S08-T4-B-E1 (weDo, guided)
- **Diagnosis:** Starter fuerza `reconcile_ok = True` y no arma totales: defecto de gate real. Instruction densa con pass; falta preamble de multi-fuente y retrospective. Feedback corto.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Manifest multi-fuente con totales derivados
- **Proposed preamble:**  
  - **Contexto:** clients.csv + transactions.json deben aparecer juntos en un solo run_id.  
  - **Meta:** derivar `reconcile_ok` y totales con `sum` (sin hardcode).  
  - **Éxito:** imprime `5 4 1`, ambas fuentes True, manifest True.  
  - **Límites:** no pongas `reconcile_ok = True` a ciegas; calcula la igualdad por fuente.
- **Proposed instruction/description improvements:**  
  1. Corrige el loop: `reconcile_ok = n_in == n_clean + n_quarantine`.  
  2. Arma el dict manifest con `run_id`, `sources` y totales sumados.  
  3. `reconcile_ok` global = `all` por fuente.  
  4. Imprime totales, lista (name, ok) y el booleano global.
- **Proposed feedback improvement:**  
  Hardcodear True es mentir al auditor. Los totales se **derivan** de sources para que una edición de conteos no deje el resumen inconsistente.
- **Proposed retrospective:**  
  El contrato conserva provenance (sha256) y conteos por fuente. Siguiente (E2): una función que rechaza errores **compensados** entre fuentes.
- **Code/output changes:** none
- **Validation notes:** Output multi-línea canónico; OK.

---

### S08-T4-B-E2 (weDo, independent)
- **Diagnosis:** `compensated_bad` es el insight pedagógico más importante de T4-B; starter always-True. Instruction ya nombra el caso; falta preamble más narrativo y retrospective. Feedback de una línea es demasiado corto para este concepto.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Reconciliar por fuente sin compensación
- **Proposed preamble:**  
  - **Contexto:** un sobrante en clients y un faltante en transactions pueden “cuadrar” en el total y mentir.  
  - **Meta:** `reconcile_sources` exige igualdad **por cada fuente** y en agregados.  
  - **Éxito:** `True` en good y `False` en compensated_bad.  
  - **Límites:** no baste `sum(n_in) == sum(n_clean)+sum(n_quarantine)` solo a nivel global.
- **Proposed instruction/description improvements:**  
  1. El starter devuelve siempre True.  
  2. Calcula `per_source` con `all(...)` por fila de sources.  
  3. Combina con la igualdad de totales derivados.  
  4. Prueba good y compensated_bad; imprime ambos booleanos.
- **Proposed feedback improvement:**  
  La igualdad agregada sola es insuficiente: errores compensados entre CSV y JSON ocultan filas perdidas. El gate exige per-source y totales; el caso compensated_bad es el test de entrevista junior.
- **Proposed retrospective:**  
  Si puedes explicar compensated_bad sin código, ya defendiste CP-N1-B. Luego (E3): el mini-`run()` que no publica OK si hay fuentes rotas — mismo if del You Do.
- **Code/output changes:** none
- **Validation notes:** compensated_bad (5+5 in, 5+4 clean, 1+0 quar) es pedagógicamente correcto.

---

### S08-T4-B-E3 (weDo, transfer)
- **Diagnosis:** Mini-ensamblaje pre–You Do bien etiquetado en instruction; starter always-OK. Falta preamble de fail-closed al consumidor del clean y retrospective de puente explícito al proyecto. Feedback casi bueno pero corto.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** run fail-closed con exit_code 0 o 1
- **Proposed preamble:**  
  - **Contexto:** el núcleo de salida del ETL publica clean solo si **todas** las fuentes reconcilian.  
  - **Meta:** implementar `run(sources)` fail-closed.  
  - **Éxito:** good → `OK` / `exit_code 0`; compensated_bad → `ERROR sources=clients.csv,transactions.json` / `exit_code 1`.  
  - **Límites:** reporta **todas** las fuentes rotas; no digas OK parcial.
- **Proposed instruction/description improvements:**  
  1. El starter siempre imprime OK.  
  2. Arma `broken` con nombres donde no cuadra `n_in`.  
  3. Si hay broken: ERROR con join por coma, exit 1.  
  4. Si no: OK, exit 0. Ejecuta good y bad en ese orden.
- **Proposed feedback improvement:**  
  Fail-closed protege consumidores del clean: un exit 0 mentiroso es peor que un fallo ruidoso. En el You Do, este if es el último paso de `run()` antes de `SystemExit`.
- **Proposed retrospective:**  
  Publicar solo si reconcilia es el cierre del gate. Reutiliza esta lógica sin mirar la solución al armar clean/quarantine/manifest en disco. Autochequeo: ¿qué imprimirías si solo una de dos fuentes falla?
- **Code/output changes:** none
- **Validation notes:** Output good then bad correcto; bridge al You Do explícito en intro weDo — reforzar en retrospective.

---

### S08-YouDo (youDo)
- **Diagnosis:** Proyecto bien enmarcado: `context` con receta de ensamblaje T1–T4, objectives, requirements contractuales (Decimal, write_atomic, newline='', reconcile por fuente), starter con `NotImplementedError` por pieza, rubric y portfolioNote de evidencia. **Falta `retrospective`** de defensa (invariantes, sintéticos vs real, frase de impacto). Para un newbie que termina el pipeline, no hay cierre metacognitivo post-build.
- **Checklist:** context pass · goal pass (objectives) · success pass (rubric + portfolioNote) · constraints pass (requirements) · retrospective **fail**
- **Severity:** P1
- **Proposed title:** N/A (ya tiene title de proyecto)
- **Proposed preamble:** N/A (context ya cumple rol de marco; no duplicar essay)
- **Proposed instruction/description improvements:**  
  Opcional menor: en `context`, una línea de éxito observable (“corrida demo: exit 0 con manifest reconcile_ok; corrida con fila irregular: exit 0 y n_quarantine≥1; corrida con conteos rotos: exit 1”). No reescribir requirements.
- **Proposed retrospective:**  
  Antes de marcar listo: (1) ¿qué invariante demuestras con el caso exit 1 (reconcile roto) y con al menos una fila en quarantine? (2) ¿qué cambiarías con datos reales vs sintéticos (PII, encodings, volumen)? (3) En el README, una frase de impacto medible (antes: “CSV a mano / sin traza”; después: “clean+quarantine+manifest con hash”) que puedas defender en 30 segundos ante un revisor junior de data.
- **Code/output changes:** none
- **Validation notes:** Starter contracts alineados con We Do; no tocar signatures en round de fix salvo bug. Empaquetado CLI diferido a S10 ya documentado.

---

## Priority order

### P0 (fix first — all 24 We Do)
Missing `title` + `preamble` + task-only `instruction` + stronger `feedback` + `retrospective` on:

1. **S08-T1-A-E1, E2, E3** — Path exists / with lines / UnicodeDecodeError  
2. **S08-T1-B-E1, E2, E3** — CRLF / write_atomic / mid-write  
3. **S08-T2-A-E1, E2, E3** — DictReader / DictWriter / Decimal reject  
4. **S08-T2-B-E1, E2, E3** — col_count / quarantine.csv / Counter reasons  
5. **S08-T3-A-E1, E2, E3** — loads / ensure_ascii / datetime  
6. **S08-T3-B-E1, E2, E3** — schema / null vs missing / setdefault  
7. **S08-T4-A-E1, E2, E3** — sha256 / backup / provenance  
8. **S08-T4-B-E1, E2, E3** — manifest / reconcile compensated / fail-closed run  

Within each trio, preserve fade: E1 nombra defecto y pasos; E2 meta+éxito con menos migas; E3 superficie nueva (diagnóstico, compensación, fail-closed).

### P1
- All **8 iDo**: add `preamble` + `retrospective`; lightly expand `why` where telegraphic  
- **youDo**: add defense `retrospective` only (context/requirements already strong)

### P2
- Polish remaining one-line `feedback` once preambles land (several units already have proposed feedback text above)  
- Optional youDo success-line in context  
- Hints already mostly OK; ensure they stay non-spoiling after instruction rewrite

---

## Residual risks

1. **Nombre de sección `pandas` vs contenido stdlib ETL** — confusión de expectativas del learner en UI/ruta; fuera de scope de prose de ejercicios pero afecta framing (jobRelevance ya aclara; no reabrir en fix de pedagogy fields salvo copy de intro).  
2. **Longitud del youDo context** — ya denso; al añadir retrospective, no inflar context.  
3. **E1 drills muy micro** (p. ej. T2-B-E1 booleano) — el riesgo es que el preamble sobre-prometa; mantener una meta única y output exacto.  
4. **S08-T4-B-E2/E3 conceptual load** — compensated_bad es abstracto; el fix debe conservar fixtures numéricos exactos del solution (no “simplificar” el caso).  
5. **Outputs canónicos y tests implícitos** — no cambiar outputs al añadir prose; varios digests (sha256) son golden.  
6. **Fade E1→E3** — hoy las instructions son uniformemente “E# (tipo) — drill”; al reescribir, evitar tres clones con números distintos.  
7. **Idioma** — learner-facing propuesto en español profesional peruano; mantener términos de contrato del curso (`reason`, `reconcile_ok`, `write_atomic`, `fail-closed`) como en teoría.

---

## Fixer handoff notes

- Schema fields to add: iDo `preamble`/`retrospective`; weDo `title`/`preamble`/`retrospective` (+ rewrite `instruction` to steps-only; strengthen `feedback`); youDo `retrospective`.  
- Do **not** alter solution `output` strings unless execute-and-diff proves a bug.  
- Starter `# DEFECT:` comments are pedagogical assets — keep.  
- weDo.intro map is good; leave unless a one-line cross-link to E3 T4-B helps.  
- After fix: static typecheck/build of section module; no generators for prose.

---

Section 8 exercise pedagogy review complete. Ready for the Fixer prompt.
