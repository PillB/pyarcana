# S07 Exercise Pedagogy Report (Round 1)

## Section
- **title:** Texto, Unicode y expresiones regulares
- **id:** `data-acquisition` (index 7)
- **source:** `src/lib/course/sections/s07-data-acquisition.ts`
- **counts:** iDo 8, weDo 24 (8 subtemas × E1/E2/E3), youDo 1
- **subtopics:** T1-A Unicode NFC/casefold · T1-B nombres latam/partículas · T2-A str methods · T2-B contacto modesto · T3-A regex grupos/anchors · T3-B compile/extracción/límites · T4-A Jaccard/exact · T4-B FP/FN y evidencia

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` (preamble checklist, retrospective, E1→E2→E3 fade, length limits)
- Manually inspected every `iDo.steps[]`, `weDo.steps[]`, and `youDo` in the source (código, starter, solution, output, instruction, hint(s), feedback, why)
- Cross-checked against section story (tramo textual CP-N1-B: `raw` / `normalized` / `transforms`, datos sintéticos latam, sin PII real, sin afirmaciones de parentesco, `str` antes que regex)
- No bulk generation, no scripts, no copy-paste across sections

## Global findings (before unit ledger)

| Gap | Where | Impact |
|-----|--------|--------|
| **Zero `preamble`** | All 8 iDo + all 24 weDo | Newbie no ve escenario de intake latam → meta → éxito → límites antes del código |
| **Zero `retrospective`** | All iDo + weDo + youDo | Cierre metacognitivo ausente; no hay puente a la siguiente práctica ni al normalizador CP-N1-B |
| **Zero We Do `title`** | 24 weDo | Solo el prefijo “E1/E2/E3 …” dentro de `instruction`; UI carece de encabezado corto |
| **Instructions = drill + fixture** | Most weDo | “Concepto + datos + imprime X”; poco andamiaje ordenado en pasos para E1; E2/E3 a veces siguen tan densos como E1 |
| **Feedback de una línea** | Most weDo | No explica el *razonamiento* del error típico (NFD residual, overvalidation, search vs fullmatch, Jaccard como evidencia) |
| **`why` iDo corto y técnico** | 8 demos | Cumple rol técnico; no sustituye preamble (antes) ni retrospective (después) |
| **youDo bien enmarcado** | context/objectives/requirements/rubric | Fuerte para proyecto CP-N1-B; falta solo `retrospective` de defensa |
| **Código/outputs** | Casi todos | Pedagógicamente coherentes; defectos de starter bien nombrados; outputs canónicos claros |
| **Starter `print('ok', True)`** | Muchos weDo | Ruido de verificación residual; el Fixer puede limpiarlo al alinear con solution (no es defecto conceptual) |

**Severity default for this section:** systematic missing preamble+retrospective is **P0** on every We Do and **P1** on I Do (demos still have `description`+`why`+worked code). youDo retrospective alone is **P1**. Feedback/title polish is often **P2** if preamble/instruction/retrospective land.

**E1→E2→E3 fade note:** Los defectos de starter están bien diferenciados (p. ej. T1-A: sin NFC → lower en vez de casefold → diagnóstico NFD). La prosa de instruction no refleja ese fade: E1, E2 y E3 se leen igual de “spec corta”. El Fixer debe bajar migas en E2 y maximizar superficie nueva en E3.

---

## Unit ledger

### S07-T1-A-DEMO (iDo)
- **Diagnosis:** Demo sólida de igualdad cruda vs NFC y `casefold` sobre “mañANA”. `description` y `why` existen pero son telegráficos. No hay preamble (qué mirar: code points distintos, luego NFC) ni retrospective (principio + misconception “se ven iguales → son iguales”). Un newbie ve hex de `ord` sin saber por qué importa en un CRM latam.
- **Checklist:** context fail · goal partial · success partial (output existe) · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  En intake de clientes peruanos, “José” pegado desde un PDF a veces llega descompuesto (base + tilde). Antes de escribir, sigue la demo: (1) sin normalizar, `a == b` es `False` y los code points difieren; (2) con `unicodedata.normalize("NFC", …)` la igualdad pasa; (3) `casefold` unifica mayúsculas de forma más robusta que `lower` en el contrato del normalizador. Datos sintéticos; no reescribas aún — predice cada `print`.
- **Proposed instruction/description improvements:**  
  Description OK o: “Igualdad de ‘José’ vs forma NFD y casefold de mañANA”. Ampliar `why` (~50–70 palabras): NFC alinea formas visualmente idénticas; sin eso el matching de nombres produce FN silenciosos en padrones/CRM.
- **Proposed retrospective:**  
  Si puedes explicar por qué dos strings “iguales en pantalla” fallan `==`, ya internalizaste el primer gate Unicode. El error clásico es comparar raw y culpar al dato. En We Do T1-A practicarás NFC, `casefold` y el diagnóstico NFD.
- **Code/output changes:** none
- **Validation notes:** Output canónico es el éxito observable de la demo.

---

### S07-T1-A-E1 (weDo, guided)
- **Diagnosis:** Drill guiado claro: starter imprime `repr(n)` sin NFC; lista incluye vacío. Instruction nombra salida esperada pero mezcla meta y pasos; sin preamble de pipeline de nombres ni retrospective. Feedback de una línea no repara el misconception “el vacío no hay que normalizarlo / NFC no aplica a `''`”.
- **Checklist:** context fail · goal partial · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Normalizar nombres a NFC con `repr`
- **Proposed preamble:**  
  - **Contexto:** el primer paso del normalizador de nombres latam es unificar formas Unicode antes de indexar o comparar.  
  - **Meta:** aplicar NFC a cada elemento de una lista sintéica (incluida la cadena vacía).  
  - **Éxito:** tres líneas con `repr`: `'José'`, `'José'`, `''`.  
  - **Límites:** solo `unicodedata`; no mutes la lista original; no uses regex; datos sintéticos.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: el bucle imprime el raw sin normalizar.  
  2. Para cada `n` en `names`, normaliza con `unicodedata.normalize('NFC', n)`.  
  3. Imprime `repr(...)` de cada resultado (el vacío sigue vacío).  
  4. Quita el `print('ok', True)` residual si no aporta a la salida canónica.
- **Proposed feedback improvement:**  
  NFC no “arregla” el contenido semántico: solo unifica code points. El vacío permanece `''` — normalizar no inventa texto. Sin NFC, `'José'` y `'Jose\u0301'` se verían distintos en `repr` y romperían el matching.
- **Proposed retrospective:**  
  NFC es el primer eslabón del pipeline: unifica, no interpreta. El error clásico es comparar sin normalizar y marcar FN. Siguiente: matching case-insensitive con `casefold` (E2).
- **Code/output changes:** none (output canónico correcto); opcional limpiar `print('ok', True)` del starter al alinear
- **Validation notes:** Defect “imprime raw sin NFC” es guiado y bien nombrado.

---

### S07-T1-A-E2 (weDo, independent)
- **Diagnosis:** Buen foco de política (`casefold` vs hábito de `lower`). Instruction ya advierte que en este par español ambos dan True; es pedagogía sutil y valiosa. Falta preamble (por qué el contrato pide casefold en el normalizador) y retrospective. Feedback bueno pero no cierra el auto-chequeo.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Matching case-insensitive con `casefold`
- **Proposed preamble:**  
  - **Contexto:** el normalizador de registro fija una política de comparación sin mayúsculas para campos de nombre/token.  
  - **Meta:** usar `casefold` (no `lower`) aunque en este par español el resultado coincida.  
  - **Éxito:** un solo booleano `True` al comparar `'MAÑANA'` y `'mañana'`.  
  - **Límites:** no uses `lower` en la solución; no importes librerías externas; no afirmes nada legal sobre el token.
- **Proposed instruction/description improvements:**  
  1. Parte de `a, b = 'MAÑANA', 'mañana'`.  
  2. Compara con `a.casefold() == b.casefold()`.  
  3. Imprime solo el booleano.  
  4. (Menos migas que E1: no se detalla el defecto línea a línea.)
- **Proposed feedback improvement:**  
  Aquí `lower` también da `True`, pero el contrato del curso es `casefold`: más robusto ante casing especial (p. ej. ß → `ss`). Escribir `casefold` por política, no porque la ñ “rompa” con `lower`.
- **Proposed retrospective:**  
  `casefold` es contrato de matching, no un truco de ñ. Si en un par español `lower` “funciona”, igual codificas `casefold` para no bifurcar políticas. Luego (E3) diagnosticarás mismatch por formas NFD residuales.
- **Code/output changes:** none
- **Validation notes:** Starter con `lower` es el defecto correcto para E2 independiente.

---

### S07-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transferencia real: diagnosticar, no solo aplicar NFC. Instruction pide tres líneas de salida; starter deja `nfc` igual a raw y `causa: ???`. Falta contexto de origen del bug (PDF/OS/copy-paste) y cierre retrospectivo. Feedback aceptable pero sin misconception explícito (“si se ven iguales, el bug está en mi código de negocio”).
- **Checklist:** context fail · goal pass · success partial · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Diagnosticar mismatch NFD vs NFC
- **Proposed preamble:**  
  - **Contexto:** en datos copiados de PDF o de otros SO, la misma “José” puede llegar en forma compuesta o con combining mark.  
  - **Meta:** contrastar igualdad cruda vs igualdad tras NFC e identificar la causa.  
  - **Éxito:** `raw False`, `nfc True`, y una línea que nombre formas Unicode distintas (compuesta vs combining mark).  
  - **Límites:** no ejecutes patrones peligrosos; no inventes parentesco; solo `unicodedata` + prints.
- **Proposed instruction/description improvements:**  
  1. Compara `a == b` en crudo e imprime `raw …`.  
  2. Compara tras `normalize('NFC', …)` en ambos lados e imprime `nfc …`.  
  3. Escribe una línea `causa: …` que nombre el desajuste de formas.  
  4. Superficie nueva: el mensaje de diagnóstico, no solo aplicar NFC en silencio.
- **Proposed retrospective:**  
  Ver igual ≠ ser igual en Unicode. El bug de matching por NFD es real en pipelines de intake. En T1-B el riesgo sube: parsear nombres con dos apellidos y partículas sin inventar campos.
- **Code/output changes:** none (mensaje de causa puede variar levemente; solution canónica es referencia)
- **Validation notes:** Starter `print('nfc', a == b)` es el defect de transferencia correcto.

---

### S07-T1-B-DEMO (iDo)
- **Diagnosis:** Worked example claro de heurística últimos-2-tokens = apellidos, con NFC + colapso y conservación de `raw`. `why` es una frase; falta escena (por qué no forzar first/last US) y cierre (heurística ≠ identidad legal).
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  En Perú es habitual nombre(s) + apellido paterno + materno, a menudo con partículas (`del`, `de la`). Sigue la demo sin escribir: colapsa espacios, NFC, tokeniza, y toma los **últimos dos** tokens como apellidos; el resto es *given* (puede incluir “del Carmen”). Observa que se imprime el `raw` original: es la única fuente si la heurística falla. Datos sintéticos; sin afirmar identidad legal.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: la heurística es práctica de modelado, no prueba de parentesco; si faltan tokens, el pipeline real marca review (We Do E3).
- **Proposed retrospective:**  
  Dos apellidos finales + given con partículas es el patrón base latam del curso. No es convención universal: documenta límites y conserva `raw`. We Do: split feliz, partículas, y fail-closed cuando hay pocos tokens.
- **Code/output changes:** none

---

### S07-T1-B-E1 (weDo, guided)
- **Diagnosis:** Defect claro (`given = toks[0]`). Instruction nombra salida pero no ordena pasos ni ancla al parse latam del CP-N1-B. Feedback telegráfico.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Extraer given y dos apellidos
- **Proposed preamble:**  
  - **Contexto:** el normalizador de nombres latam necesita *given* + apellido1 + apellido2 sin forzar formato US.  
  - **Meta:** aplicar la heurística “últimos dos tokens = apellidos”.  
  - **Éxito:** línea 1 `Ana María`; línea 2 `Quispe Huamán`.  
  - **Límites:** no inventes campos; no uses regex; no afirmes parentesco; datos sintéticos.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: `given = toks[0]` corta el segundo nombre.  
  2. Haz `given = ' '.join(toks[:-2])` y apellidos con `toks[-2]`, `toks[-1]`.  
  3. Imprime given y luego `ap1 ap2`.  
  4. Confirma mentalmente que hay ≥3 tokens en este caso feliz.
- **Proposed feedback improvement:**  
  Con cuatro tokens, `toks[0]` deja fuera “María”. Los últimos dos son apellidos; todo lo anterior es given. Es heurística, no RENIEC.
- **Proposed retrospective:**  
  El shape “≥3 tokens → dos apellidos finales” es el mismo del demo. El error clásico es tomar solo el primer token como nombre. Siguiente: partículas en given (E2).
- **Code/output changes:** none
- **Validation notes:** Defect bien nombrado en comentario DEFECT.

---

### S07-T1-B-E2 (weDo, independent)
- **Diagnosis:** Mismo defecto estructural que E1 (`given = toks[0]`) sobre superficie con partícula — buena repetición con variación. Instruction aún suena a E1 (nombra el fixture y el éxito). Falta fade de prosa (menos “cómo”, más “qué lograr”) y preamble de por qué las partículas importan en FN.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Preservar partículas en el given
- **Proposed preamble:**  
  - **Contexto:** nombres como “María del Carmen …” pierden información si el parser se queda con el primer token.  
  - **Meta:** dejar la partícula dentro de *given* con la misma heurística de apellidos finales.  
  - **Éxito:** `María del Carmen` / `Quispe Ríos`.  
  - **Límites:** no borres tokens del medio “porque son partículas”; no uses un mega-regex de nombres.
- **Proposed instruction/description improvements:**  
  1. Partiendo de `'María del Carmen Quispe Ríos'`, obtén given y dos apellidos.  
  2. Given debe incluir `del Carmen`.  
  3. Imprime given y apellidos en dos líneas.  
  4. Menos migas: no se señala la línea exacta del defecto (E2).
- **Proposed retrospective:**  
  Con esta heurística simple, las partículas del nombre se quedan en given al cortar solo los dos apellidos finales. No resuelve todos los casos de “de la Cruz” como apellido; por eso más adelante hay `review`. Luego (E3): fail-closed con pocos tokens.
- **Code/output changes:** none
- **Validation notes:** Casi gemelo de E1 en defect — pedagógicamente OK si la prosa de E2 deja de ser un clon de pasos.

---

### S07-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Excelente transferencia ética/técnica: Madonna → review; Luis con dos apellidos → ok. Starter siempre `status='ok'` e inventa apellidos con índices frágiles. Instruction densa pero rica; falta preamble de fail-closed y retrospective. Feedback de una línea es el mensaje correcto pero no enseña el empaquetado.
- **Checklist:** context fail · goal pass · success partial (dict shape en solution) · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Review si faltan tokens de apellido
- **Proposed preamble:**  
  - **Contexto:** un nombre monónimo o incompleto no debe fabricar `apellido2` en silencio (demografía inventada).  
  - **Meta:** si hay menos de 3 tokens, `status='review'` y conserva `raw`.  
  - **Éxito:** dict de Madonna con `review` y `ap1`/`ap2` en `None`; Luis Quispe Huamán con `ok` y apellidos correctos.  
  - **Límites:** no inventes apellidos vacíos “para que pase”; no afirmes identidad legal; solo datos sintéticos.
- **Proposed instruction/description improvements:**  
  1. Implementa `parse_nombre` con rama `len(toks) < 3 → review`.  
  2. En el caso ok (≥3), given = join de `[:-2]`, ap1/ap2 finales.  
  3. Imprime el dict de `'Madonna'` y de `'Luis Quispe Huamán'`.  
  4. Superficie nueva: política de status, no solo el split feliz.
- **Proposed feedback improvement:**  
  Inventar `apellido2` cuando no hay tokens es peor que dejar el caso en cola humana. `review` + `raw` es fail-closed demográfico: el sistema no completa en silencio.
- **Proposed retrospective:**  
  Review > inventar campos. Es el mismo espíritu del gate CP-N1-B. En T2-A vuelves a `str` puro: split/join/replace antes de tocar regex.
- **Code/output changes:** none (output de dicts canónico)
- **Validation notes:** Solution shape es la referencia de tests mentales.

---

### S07-T2-A-DEMO (iDo)
- **Diagnosis:** Demo limpia de strip + colapso + replace literal + find. `why` mínimo. Falta anclar “str primero” al intake de direcciones limeñas y cerrar con el puente a “no escribas regex aún”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Antes de regex, la limpieza de direcciones sintéticas (Jr. de la Unión, espacios dobles) se resuelve con `strip`, `split`/`join`, `replace` y `find`. Sigue la demo: colapsa espacios, expande la abreviatura `Jr.` de forma **literal**, y localiza “Unión”. Observa que no hay patrón “inteligente”: menos backtracking, más testeo. Datos de Lima ficticios.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: replace es predecible; documentar el paso en `transforms` del normalizador.
- **Proposed retrospective:**  
  Si `replace`/`split` bastan, no escribas regex. We Do T2-A: CSV-like con strip, `join` estable, y dígitos de teléfono sin `re`.
- **Code/output changes:** none

---

### S07-T2-A-E1 (weDo, guided)
- **Diagnosis:** Defect clásico (`split` sin `strip` por campo). Instruction nombra éxito; no contextualiza “CSV-like simple ≠ módulo csv”. Feedback ya anticipa S08 — bueno — pero sin preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Split CSV-like con strip por campo
- **Proposed preamble:**  
  - **Contexto:** líneas simples tipo `id, nombre, ciudad` llegan con espacios laterales en el intake.  
  - **Meta:** partir por coma y limpiar cada campo con `strip`.  
  - **Éxito:** `['C001', 'Ana', 'Lima']`.  
  - **Límites:** sin comillas escapadas aquí; no uses el módulo `csv` aún (S08); no regex.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: `split(',')` deja espacios en `' Ana '`.  
  2. Aplica `strip` a cada parte (list comprehension o bucle).  
  3. Imprime la lista limpia.  
  4. No agregues comillas ni lógica de escape.
- **Proposed feedback improvement:**  
  `split` no recorta espacios: `' Ana '` ≠ `'Ana'`. Este truco alcanza para CSV-like sin comillas; con comillas/newlines, en S08 usas `csv`.
- **Proposed retrospective:**  
  Strip por campo es el mínimo de higiene antes de normalizar. Siguiente: `join` con separadores estables (E2).
- **Code/output changes:** none

---

### S07-T2-A-E2 (weDo, independent)
- **Diagnosis:** Meta simple (join con espacio y con guion). Starter solo imprime el join con espacio. Instruction clara; falta contexto de por qué el separador es contrato de salida y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Unir tokens con espacio y guion
- **Proposed preamble:**  
  - **Contexto:** tras tokenizar una dirección, reconstruyes el string con un separador estable para logs o keys.  
  - **Meta:** practicar `str.join` con dos separadores distintos.  
  - **Éxito:** `Jr. Unión 450` y `Jr.-Unión-450`.  
  - **Límites:** no concatenes con `+` en bucle; no insertes separador al inicio/final a mano.
- **Proposed instruction/description improvements:**  
  1. Con `toks = ['Jr.', 'Unión', '450']`, une con espacio.  
  2. Une el mismo orden con `'-'`.  
  3. Imprime ambas líneas.  
  4. (E2: sin señalar el defecto línea a línea.)
- **Proposed retrospective:**  
  `join` es el inverso idiomático de `split`: el separador no se pega al borde. Luego (E3): normalizar un teléfono sucio solo con `str`, sin regex.
- **Code/output changes:** none

---

### S07-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Transferencia “str primero” sobre teléfono con puntos y guiones. Starter deja el guion y usa `isalnum` (deja letras si las hubiera). Instruction pide dos líneas `999000111`. Buen E3; falta preamble de por qué no regex aquí y retrospective hacia contacto modesto T2-B.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Solo dígitos con replace o isdigit
- **Proposed preamble:**  
  - **Contexto:** un teléfono sintético llega con máscaras (`.` y `-`); el normalizador debe quedarse con dígitos **sin** abrir regex.  
  - **Meta:** obtener `999000111` por dos caminos (`replace` encadenado y filtro `isdigit`).  
  - **Éxito:** dos líneas idénticas `999000111`.  
  - **Límites:** sin `re`; no valides operadora ni longitud aquí.
- **Proposed instruction/description improvements:**  
  1. Partiendo de `'999.000-111'`, elimina puntos y guiones (o filtra dígitos).  
  2. Imprime el resultado de `replace` y el de `isdigit`.  
  3. Ambos deben coincidir.  
  4. Superficie: elegir herramienta `str` correcta (`isdigit` vs `isalnum`).
- **Proposed feedback improvement:**  
  `isalnum` deja letras; para teléfono quieres solo dígitos. Un `replace` controlado es más legible que un patrón “listo”.
- **Proposed retrospective:**  
  Replace/isdigit evitan regex prematura en contacto. En T2-B elevas el listón: email modesto con fail-closed y teléfono PE conservando el 51.
- **Code/output changes:** none
- **Validation notes:** Starter `isalnum` es un defect sutil y valioso para transferencia.

---

### S07-T2-B-DEMO (iDo)
- **Diagnosis:** Demo excelente: email con plus, teléfono a dígitos, y contraste de overfit regex. `why` corto. Falta preamble que diga *qué observar* en el tercer print (rejected plus) y retrospective ética de overvalidation.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  El contacto del intake no exige verificar buzones reales. Sigue la demo: `normalize_email` hace strip+casefold y un contrato mínimo (un `@`, local/dominio, sin espacios); el teléfono se reduce a dígitos conservando el 51. Luego una regex “perfecta” `^[a-z]+@…\.com$` **rechaza** un plus-addressing válido. Predice cada salida antes de ejecutar. Datos sintéticos.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: overvalidation de email es bug de producto; review posterior > rechazo de válidos.
- **Proposed retrospective:**  
  Validación modesta + cola de review supera a la regex hiper-estricta. We Do: implementar el contrato de email, dígitos de teléfono, y demostrar el rechazo del overfit.
- **Code/output changes:** none

---

### S07-T2-B-E1 (weDo, guided)
- **Diagnosis:** E1 rico: varios casos (ok, local vacío, doble @, espacios). Starter solo strip+lower. Instruction larga y casi completa; se solapa con lo que debería ir en preamble. Feedback bueno. Falta title/preamble estructurado y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** `normalize_email` modesto con fail-closed
- **Proposed preamble:**  
  - **Contexto:** el campo email del registro sintético debe ser usable o ir a review, sin fingir que el buzón existe.  
  - **Meta:** implementar strip+casefold, un `@`, local/dominio no vacíos, cero espacios.  
  - **Éxito:** `ok a@b.com` y tres líneas `review_error …` para `@b.com`, `a@@b.com`, `a b@c.com`.  
  - **Límites:** no regex; no exijas `.com`; plus addressing debe seguir válido en el contrato (aunque no se prueba en este loop).
- **Proposed instruction/description improvements:**  
  1. Reescribe `normalize_email`: el starter no valida `@` ni espacios.  
  2. Usa `casefold` (no solo `lower`) por contrato del normalizador.  
  3. Lanza `ValueError` con mensaje claro en fallos.  
  4. Mantén el loop try/except e imprime `ok` / `review_error`.
- **Proposed feedback improvement:**  
  Un `@` al inicio deja local vacío; dos `@` rompen el conteo; un espacio en medio es inválido. No estás verificando entregabilidad: solo estructura mínima.
- **Proposed retrospective:**  
  El contrato modesto evita el falso rigor. El error clásico es aceptar cualquier string con strip. Siguiente: teléfono a dígitos conservando 51 (E2).
- **Code/output changes:** none (output canónico de cuatro líneas)
- **Validation notes:** Mensajes de error deben alinearse con solution para el learner que compare.

---

### S07-T2-B-E2 (weDo, independent)
- **Diagnosis:** Defect claro (deja `+()`). Instruction nombra éxito. Similar a T2-A-E3 pero con prefijo país — refuerzo deliberado. Falta contextualizar “no valides operadora” en preamble y cerrar retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Teléfono PE a solo dígitos (+51)
- **Proposed preamble:**  
  - **Contexto:** el teléfono sintético peruano llega enmascarado; el normalizador conserva dígitos del prefijo `51` sin inferir operadora.  
  - **Meta:** filtrar solo dígitos desde `'(+51) 999-000-111'`.  
  - **Éxito:** `51999000111`.  
  - **Límites:** no valides longitud ni operadora; no `raise` por formato; sin regex.
- **Proposed instruction/description improvements:**  
  1. Parte del raw enmascarado.  
  2. Conserva únicamente caracteres `isdigit`.  
  3. Imprime el string de dígitos.  
  4. (E2: el learner identifica solo el filtro incorrecto.)
- **Proposed retrospective:**  
  Política de dígitos > regex de formato rígido. Longitud/operadora son revisión fuera de banda. Luego (E3): demostrar que el overfit de email rechaza válidos.
- **Code/output changes:** none

---

### S07-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Transferencia conceptual fuerte (política vs overfit). Starter invierte `rejected` e imprime política incorrecta. Instruction ya trae la política exacta — bien para E3 — pero falta preamble de producto y retrospective hacia T3 regex disciplinada.
- **Checklist:** context fail · goal pass · success partial · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Overvalidation que rechaza plus-addressing
- **Proposed preamble:**  
  - **Contexto:** una regex “elegante” de email es un bug de producto: rechaza direcciones válidas (plus tags, dominios nuevos).  
  - **Meta:** demostrar el rechazo del patrón overfit y enunciar la política modesta del curso.  
  - **Éxito:** `rejected_by_overfit True` y una línea de política (un `@`, local/dominio, cero espacios; sin entregabilidad).  
  - **Límites:** no propongas la regex overfit como solución; no verifiques buzones reales.
- **Proposed instruction/description improvements:**  
  1. Evalúa `fullmatch` del patrón estricto sobre `user+tag@example.com`.  
  2. Imprime si fue rechazado (`True` esperado).  
  3. Imprime la política modesta en una línea clara.  
  4. Superficie: razonamiento de producto, no solo código de normalización.
- **Proposed feedback improvement:**  
  El starter imprimía `not rejected` y una política falsa. Rechazar válidos es peor que mandar un caso dudoso a review después.
- **Proposed retrospective:**  
  Overvalidation ≠ calidad. En T3 usas regex solo cuando el patrón es regular de verdad (códigos, DNI sintético), con `fullmatch` disciplinado.
- **Code/output changes:** none
- **Validation notes:** Texto exacto de política puede admitir paráfrasis; solution es canónica para output compare.

---

### S07-T3-A-DEMO (iDo)
- **Diagnosis:** Demo clara de grupo nombrado + contraste search (implícito en fullmatch con/sin prefijo). `why` telegráfico. Falta decir al learner qué predice antes de ejecutar y cerrar con la regla fullmatch=validar / search=extraer.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Cuando el patrón es regular (DNI sintético de 8 dígitos en un log), regex aporta. Sigue la demo: un patrón con grupo `(?P<dni>…)` extrae de texto con `search`; `fullmatch` de solo dígitos acepta `"12345678"` y rechaza `"DNI 12345678"`. Observa la diferencia: validar el campo completo vs hallar un substring. Datos sintéticos; nunca PII real.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: grupos nombran capturas; confundir search/fullmatch genera FP de validación.
- **Proposed retrospective:**  
  Grupo nombrado > índice mágico. fullmatch para el campo exacto; search/finditer para logs. We Do: región de 3 letras, groupdict, y el contraste search vs fullmatch.
- **Code/output changes:** none

---

### S07-T3-A-E1 (weDo, guided)
- **Diagnosis:** Defect excelente: `search` con patrón sin anchors deja pasar “Lima” (subcadena `Lim`… en realidad el defect es search de `[A-Z]{3}` que en 'Lima' puede matchear 'Lim'). Instruction pide fullmatch + anchors. Feedback corto.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** `fullmatch` de código de región
- **Proposed preamble:**  
  - **Contexto:** códigos de región de 3 letras mayúsculas (`LIM`) se validan como campo completo, no como substring.  
  - **Meta:** usar `re.fullmatch` con patrón anclado `^[A-Z]{3}$`.  
  - **Éxito:** `True` para `'LIM'`, `False` para `'Lima'`.  
  - **Límites:** case-sensitive según patrón; no uses `search` en la solución; datos sintéticos.
- **Proposed instruction/description improvements:**  
  1. El starter usa `search` y un patrón sin anclar bien el campo.  
  2. Cambia a `fullmatch` con `^[A-Z]{3}$` (o confía en fullmatch + patrón equivalente).  
  3. Imprime bool de `'LIM'` y de `'Lima'`.  
  4. No agregues flags de ignorecase.
- **Proposed feedback improvement:**  
  `search` encuentra un trozo en medio; “Lima” no es un código de tres mayúsculas completas. `fullmatch` exige que **toda** la cadena cumpla el patrón.
- **Proposed retrospective:**  
  Validar código completo → fullmatch. El error clásico es copiar un patrón de extracción a un gate de validación. Siguiente: grupos nombrados y `groupdict` (E2).
- **Code/output changes:** none
- **Validation notes:** Verificar mentalmente: con `search` y `[A-Z]{3}`, 'Lima' puede dar True por 'Lim' — eso refuerza el defect pedagógico.

---

### S07-T3-A-E2 (weDo, independent)
- **Diagnosis:** Defect de grupos posicionales cruzados + falta de nombres. Instruction ya advierte que nombres con partículas no van con un solo `\w+` — excelente constraint. Falta preamble y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** `groupdict` con nom y ap
- **Proposed preamble:**  
  - **Contexto:** al extraer campos simples de un patrón, los grupos con nombre evitan índices mágicos.  
  - **Meta:** `fullmatch` de `'Ana Quispe'` con `(?P<nom>…)` y `(?P<ap>…)` e imprimir `groupdict()`.  
  - **Éxito:** `{'nom': 'Ana', 'ap': 'Quispe'}`.  
  - **Límites:** no uses este patrón para “María del Carmen…” (ahí va tokenización `str` de T1-B).
- **Proposed instruction/description improvements:**  
  1. Compila el patrón con grupos nombrados y anchors.  
  2. Haz `fullmatch` sobre `'Ana Quispe'`.  
  3. Imprime `m.groupdict()` (o `None` si no hay match).  
  4. (E2: corrige el cruce nom/ap del starter sin guía línea a línea.)
- **Proposed feedback improvement:**  
  El starter invertía `group(1)`/`group(2)`. Los nombres del grupo documentan el contrato del campo; `groupdict` lo hace explícito.
- **Proposed retrospective:**  
  Grupos nombrados son legibilidad en code review. No sustituyen el parse latam de partículas. Luego (E3): contrastar search vs fullmatch sobre el mismo DNI embebido.
- **Code/output changes:** none

---

### S07-T3-A-E3 (weDo, transfer)
- **Diagnosis:** Transferencia conceptual: starter invierte search/fullmatch **y** el mensaje de política. Instruction nombra la salida esperada. Falta preamble de costo de FP y retrospective hacia compile/finditer.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Search vs fullmatch en DNI embebido
- **Proposed preamble:**  
  - **Contexto:** un DNI sintético aparece dentro de un log (`DNI 12345678`); confusión search/fullmatch cambia los falsos positivos de validación.  
  - **Meta:** medir ambos y enunciar el uso correcto.  
  - **Éxito:** `search True`, `fullmatch False`, y la línea de política (search=extraer; fullmatch=validar campo exacto).  
  - **Límites:** no uses PII real; no afirmes identidad legal por un match.
- **Proposed instruction/description improvements:**  
  1. Sobre `'DNI 12345678'`, evalúa `search` y `fullmatch` del patrón `\d{8}`.  
  2. Imprime ambos booleanos con las etiquetas pedidas.  
  3. Corrige el mensaje de uso (el starter lo tiene al revés).  
  4. Superficie: política + código, no solo un bool.
- **Proposed feedback improvement:**  
  El starter llamaba fullmatch donde iba search y viceversa, y enseñaba la política invertida. Elegir mal el API de `re` es un FP de validación en producción.
- **Proposed retrospective:**  
  search/finditer = extracción; fullmatch = gate del campo. En T3-B reutilizas patrones compilados y extraes múltiples señales de un log.
- **Code/output changes:** none

---

### S07-T3-B-DEMO (iDo)
- **Diagnosis:** Demo findall + finditer con spans y nota de backtracking. `why` corto. Falta preamble de “extracción ≠ overvalidation de email” y retrospective.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  En un log sintético de llamadas, quieres **extraer** celulares que empiezan en 9, no revalidar emails. Sigue la demo: `re.compile` una vez, `findall` lista matches, `finditer` da posición. Observa el mensaje final: evita cuantificadores anidados ambiguos. No reescribas; predice las dos apariciones y sus índices.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: compile aclara reutilización; finditer aporta span para evidencia en logs.
- **Proposed retrospective:**  
  Extracción multi-match ≠ gate de email. Regex aburrida es feature. We Do: compile+reuse, findall de códigos, y política de backtracking sin ejecutar strings hostiles.
- **Code/output changes:** none

---

### S07-T3-B-E1 (weDo, guided)
- **Diagnosis:** Defect sutil (`\d{9}` sin anclar el 9 inicial). Instruction nombra patrón y salida. Feedback telegráfico. Falta preamble de reutilización en bucle de logs.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Compilar y reusar patrón de celular
- **Proposed preamble:**  
  - **Contexto:** en un lote de logs sintéticos buscas celulares 9xxxxxxxx con word boundaries.  
  - **Meta:** `compile` una vez y `findall` en dos textos.  
  - **Éxito:** `tel 999000111 → ['999000111']` y `no match 123 → []`.  
  - **Límites:** patrón `\b9\d{8}\b`; no overvalides email aquí; datos sintéticos.
- **Proposed instruction/description improvements:**  
  1. El starter compila `\b\d{9}\b` (cualquier 9 dígitos).  
  2. Cambia a celulares que **empiezan en 9**.  
  3. Reusa el mismo objeto `pat` en el bucle.  
  4. Imprime `texto → lista` como en la salida esperada.
- **Proposed feedback improvement:**  
  Nueve dígitos cualquiera no es la política de demo de celular PE. El `9` inicial y los boundaries reducen basura del log.
- **Proposed retrospective:**  
  compile + reuse documenta intención y evita reescribir el raw string. Siguiente: findall de códigos de región-número (E2).
- **Code/output changes:** none
- **Validation notes:** Nota: instruction solution imprime con flecha; starter también — alinear formato exacto.

---

### S07-T3-B-E2 (weDo, independent)
- **Diagnosis:** Defect de case (`[a-z]` vs `[A-Z]`). Simple y claro. Instruction corta tipo drill. Falta contexto de extracción multi-match y retrospective hacia límites de backtracking.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** `findall` de códigos LIM-01 / CUS-02
- **Proposed preamble:**  
  - **Contexto:** un log de operaciones marca regiones con códigos `AAA-99` en mayúsculas.  
  - **Meta:** extraer **todas** las apariciones con un patrón simple.  
  - **Éxito:** `['LIM-01', 'CUS-02']`.  
  - **Límites:** patrón aburrido; no inventes validación de región real; sin backtracking exótico.
- **Proposed instruction/description improvements:**  
  1. Sobre el log dado, usa `findall` con el patrón de 3 mayúsculas, guion y 2 dígitos.  
  2. Imprime la lista completa.  
  3. (E2: corrige el case del starter sin tutorial.)
- **Proposed retrospective:**  
  findall lista todas las apariciones en orden. El error de case es silencioso: lista vacía “sin excepción”. Luego (E3): documentar el riesgo de backtracking sin ejecutarlo.
- **Code/output changes:** none

---

### S07-T3-B-E3 (weDo, transfer)
- **Diagnosis:** E3 de prosa/política (no de algoritmo): starter recomienda el patrón peligroso. Instruction prohíbe ejecutar strings hostiles — excelente. Falta preamble de por qué importa en intake y retrospective hacia matching T4.
- **Checklist:** context fail · goal pass · success partial · constraints pass (no ejecutar hostiles) · retrospective fail
- **Severity:** P0
- **Proposed title:** Riesgo de catastrophic backtracking
- **Proposed preamble:**  
  - **Contexto:** en pipelines de intake, un patrón “listo” con cuantificadores anidados puede colgar el proceso ante input hostil.  
  - **Meta:** explicar el riesgo de `(a+)+b` y la mitigación sin ejecutar el caso hostil.  
  - **Éxito:** 3–4 prints: patrón peligroso, riesgo (CPU/hang), mitigación (patrones simples / str / timeouts), preferencia por validación por pasos.  
  - **Límites:** **no** ejecutes el patrón sobre strings largos de `a`; solo documenta.
- **Proposed instruction/description improvements:**  
  1. Reescribe los prints del starter (hoy recomiendan el anti-patrón).  
  2. Nombra catastrophic backtracking en lenguaje claro.  
  3. Propón mitigaciones concretas (`a+b`, `str.find`/`split`, timeouts).  
  4. Superficie: juicio de ingeniería, no un match más.
- **Proposed feedback improvement:**  
  “Regex aburrida” es una feature de producto. El starter decía que el riesgo era cero: eso es el misconception a reparar.
- **Proposed retrospective:**  
  Prefiere patrones simples o vuelve a `str`. En T4-A el matching de nombres usa igualdad normalizada y Jaccard — otra vez evidencia, no magia.
- **Code/output changes:** none (texto de prints puede admitir paráfrasis controlada)
- **Validation notes:** Output compare es frágil en ejercicios de prosa; el Fixer debe fijar frases canónicas cortas.

---

### S07-T4-A-DEMO (iDo)
- **Diagnosis:** Demo de Jaccard con colapso de puntos y decisión `review`. `why` bueno en una frase. Falta preamble de “primero exact normalizado, luego score débil” y retrospective anti auto-fusión.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Tras NFC y tokenizar, un score Jaccard medio entre “Juan Perez” y “Juan P. Perez” **no** es fusión automática. Sigue la demo: se normaliza, se calcula el score (~0.667) y la decisión cae en `review`. Observa que el punto de “P.” se trata como espacio al tokenizar. Datos sintéticos; sin afirmar identidad.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: score medio → review; exact solo con igualdad plena tras el mismo pipeline.
- **Proposed retrospective:**  
  Score = evidencia para humano, no veredicto. We Do: exact match normalizado, implementación de Jaccard, y umbrales de decisión.
- **Code/output changes:** none

---

### S07-T4-A-E1 (weDo, guided)
- **Diagnosis:** Defect clásico (solo strip+lower, sin NFC ni colapso de espacios internos). Instruction nombra el pipeline. Feedback corto. Falta preamble de “primera línea de matching”.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Exact match con NFC, colapso y casefold
- **Proposed preamble:**  
  - **Contexto:** antes de Jaccard, el matching de intake intenta igualdad tras el mismo pipeline de normalización.  
  - **Meta:** NFC + colapsar espacios + casefold y comparar.  
  - **Éxito:** `True` para `'  Juan  PEREZ '` vs `'juan perez'`.  
  - **Límites:** no uses Jaccard aquí; no auto-fusionar; datos sintéticos.
- **Proposed instruction/description improvements:**  
  1. Reescribe `norm`: el starter no hace NFC ni colapsa espacios internos.  
  2. Pipeline: `normalize('NFC', s)` → `' '.join(...split())` → `casefold()`.  
  3. Imprime el booleano de igualdad.  
  4. No agregues scores.
- **Proposed feedback improvement:**  
  `strip().lower()` no colapsa dobles espacios ni unifica formas Unicode. Sin el pipeline completo, el “exact” miente.
- **Proposed retrospective:**  
  Exact normalizado es la primera línea; barata y auditable. Siguiente: Jaccard cuando el exact falla (E2).
- **Code/output changes:** none

---

### S07-T4-A-E2 (weDo, independent)
- **Diagnosis:** Defect doble: usa `min(len)` en vez de unión y omite NFC. Instruction nombra 0.667. Feedback menciona review. Falta preamble de definición Jaccard y retrospective anti “score alto = misma persona”.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Jaccard de tokens con NFC
- **Proposed preamble:**  
  - **Contexto:** si el exact normalizado falla, un score de solapamiento de tokens es señal **débil** para review.  
  - **Meta:** implementar Jaccard |A∩B|/|A∪B| tras NFC + casefold + split.  
  - **Éxito:** `0.667` redondeado a 3 decimales para Juan Perez / Juan P Perez.  
  - **Límites:** no uses `min` de longitudes; no auto-fusionar; no afirmes identidad.
- **Proposed instruction/description improvements:**  
  1. Tokeniza con NFC previo.  
  2. Corrige el denominador: unión de conjuntos, no `min`.  
  3. Maneja vacíos (ambos vacíos → 1.0; uno vacío → 0.0) como en el contrato de la demo.  
  4. Imprime `round(..., 3)`.
- **Proposed feedback improvement:**  
  `min(len)` infla el score (Dice-like). Jaccard usa la unión. Sin NFC, formas visualmente iguales se desdoblan en tokens distintos.
- **Proposed retrospective:**  
  Score parcial → review en el pipeline, no merge. Luego (E3): codificar umbrales exact/review/no_match.
- **Code/output changes:** none
- **Validation notes:** Con tokens {juan,perez} vs {juan,p,perez}, |∩|=2, |∪|=3 → 0.667 — canónico.

---

### S07-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Transferencia de umbrales: starter marca `exact` con score ≥ 0.5. Instruction da la política correcta. Falta preamble de honestidad ante ambigüedad y retrospective hacia FP/FN.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Umbrales exact / review / no_match
- **Proposed preamble:**  
  - **Contexto:** el pipeline de matching emite una decisión de **proceso**, no un veredicto legal.  
  - **Meta:** aplicar umbrales: 1.0 → exact; [0.4, 1.0) → review; &lt;0.4 → no_match.  
  - **Éxito:** `review Juan Perez Juan P Perez 0.67`.  
  - **Límites:** no auto-merge en review; no digas “es la misma persona”.
- **Proposed instruction/description improvements:**  
  1. Con score `0.67`, corrige la rama que hoy cae en `exact`.  
  2. Exact solo si `score == 1.0`.  
  3. Imprime `decision a b score` en una línea.  
  4. Superficie: política de umbrales, no el cálculo de Jaccard.
- **Proposed feedback improvement:**  
  Un umbral flojo que convierte 0.67 en `exact` fabrica fusiones. Review es el default honesto ante ambigüedad.
- **Proposed retrospective:**  
  Decisiones de matching ≠ etiquetas familiares. En T4-B nombras FP/FN y empaquetas evidencia para el humano.
- **Code/output changes:** none

---

### S07-T4-B-DEMO (iDo)
- **Diagnosis:** Tabla de TP/FP/FN con pares latam sintéticos; mensaje ético final. `why` corto. Falta preamble de por qué importa tunear umbrales y retrospective de “evidencia se conserva”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Matching de nombres latam mueve FP y FN: homónimos o “Luis”/“Luisa” (FP), tildes y partículas (FN). Sigue la demo: cada par sintético se etiqueta TP/FP/FN/TN según pred vs truth de **ejercicio de métricas**, no de registro civil. Observa la nota final: se conserva evidencia; no se afirma parentesco. No reescribas; clasifica mentalmente cada fila antes del print.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: nombrar el error es el primer paso a tunear umbrales y políticas de review.
- **Proposed retrospective:**  
  FP y FN tienen costo de negocio distinto. We Do: clasificar a mano, empaquetar evidencia, y enunciar por qué no hay parentesco automático.
- **Code/output changes:** none

---

### S07-T4-B-E1 (weDo, guided)
- **Diagnosis:** Defect invertido FP/FN — perfecto para guiado. Instruction densa con definición. Feedback corto. Falta preamble de matriz de confusión en lenguaje de intake.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Etiquetar FP y FN en dos casos
- **Proposed preamble:**  
  - **Contexto:** al tunear umbrales de matching necesitas nombrar el error, no solo el score.  
  - **Meta:** pred match + truth no → FP; pred no + truth match → FN.  
  - **Éxito:** `FP` luego `FN`.  
  - **Límites:** casos sintéticos de métricas; no son veredictos legales ni de parentesco.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: las etiquetas FP/FN están cruzadas.  
  2. Corrige las ramas del `if`.  
  3. Imprime una etiqueta por caso.  
  4. No agregues scores ni razones aún (eso es E2).
- **Proposed feedback improvement:**  
  FP = el sistema dijo match y no debía; FN = debía coincidir y no lo hizo. Invertirlos entrena mal el umbral.
- **Proposed retrospective:**  
  Nombrar el error precede a mover el umbral. Siguiente: empaquetar evidencia estructurada (E2).
- **Code/output changes:** none

---

### S07-T4-B-E2 (weDo, independent)
- **Diagnosis:** Defect de producto: `decision='match'` y falta `reason`. Instruction pide 5 claves. Feedback menciona ETL — bueno. Falta preamble de por qué el paquete sobrevive al log y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Empaquetar evidencia de matching
- **Proposed preamble:**  
  - **Contexto:** el log del ETL debe conservar qué se comparó y por qué quedó en review, no solo un booleano.  
  - **Meta:** dict con `raw_a`, `raw_b`, `score`, `decision`, `reason`.  
  - **Éxito:** dict completo; decision `review`; reason en español que mencione revisión humana / similitud parcial.  
  - **Límites:** no digas “misma persona” ni “familia”; datos sintéticos.
- **Proposed instruction/description improvements:**  
  1. Completa el dict del starter (falta `reason`; `decision` incorrecta).  
  2. Usa score 0.67 y decision `review`.  
  3. Escribe un `reason` claro en español.  
  4. Imprime el dict completo.
- **Proposed feedback improvement:**  
  Evidencia estructurada sobrevive al log; un `match` sin reason no se audita. Review + reason es el paquete honesto.
- **Proposed retrospective:**  
  raw + score + decision + reason es el contrato de matching del curso. Luego (E3): la política ética de no-parentesco.
- **Code/output changes:** none (reason canónico en solution; paráfrasis puede romper output compare — Fixer fija frase)
- **Validation notes:** Alinear frase de `reason` con tests si los hay.

---

### S07-T4-B-E3 (weDo, transfer)
- **Diagnosis:** Cierre ético de la sección en forma de E3. Starter afirma parentesco e identidad legal. Instruction da los tres puntos. Excelente transferencia; falta preamble de cumplimiento CP-N1-B y retrospective hacia You Do.
- **Checklist:** context fail · goal pass · success partial · constraints pass · retrospective fail
- **Severity:** P0
- **Proposed title:** Sin afirmaciones de parentesco ni identidad
- **Proposed preamble:**  
  - **Contexto:** el gate de cumplimiento del capstone N1-B prohíbe convertir un score textual en veredicto familiar o legal.  
  - **Meta:** en 2–3 prints, explicar por qué el pipeline no afirma parentesco ni identidad legal.  
  - **Éxito:** líneas que cubran: score ≠ prueba familiar; falta fuente autoritativa; solo evidencia para humano.  
  - **Límites:** no inventes veredictos; no cites RENIEC como si el código lo consultara.
- **Proposed instruction/description improvements:**  
  1. Reescribe los tres prints del starter (hoy afirman lo prohibido).  
  2. Cubre parentesco, identidad legal y rol del humano.  
  3. Mantén lenguaje claro y profesional.  
  4. Superficie: política, no un score más.
- **Proposed feedback improvement:**  
  Jaccard no es RENIEC. El misconception es “score alto = familia/identidad”. El sistema empaqueta señales; la persona decide fusiones sensibles.
- **Proposed retrospective:**  
  Evidencia > etiqueta. Llevas este gate al You Do: `normalize_record` con raw/normalized/transforms y, si hay matching, sin parentesco automático.
- **Code/output changes:** none
- **Validation notes:** Como T3-B-E3, output de prosa — fijar frases canónicas en el Fix.

---

### youDo — Normalización latinoamericana (CP-N1-B)
- **Diagnosis:** Proyecto bien enmarcado: `context`, `objectives`, `requirements`, `rubric`, `starterCode` con contratos por función, `portfolioNote`. Un newbie puede construir el pipeline. **Falta `retrospective`** de defensa post-build (metacognición + checklist de listo). No hay huecos graves de scope; el riesgo es entregar sin poder explicar fail-closed, transforms ordenados y no-parentesco en 30 segundos.
- **Checklist:** context pass · goal pass · success pass (rúbrica) · constraints pass · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (ya existe title de proyecto)
- **Proposed preamble:** N/A (context ya cumple el rol de escena; no duplicar essay)
- **Proposed instruction/description improvements:**  
  Ninguno obligatorio. Opcional en `portfolioNote` o objectives: recordar que el README defiende 3 casos (partícula, plus email, +51) con tabla raw→normalized→transforms.
- **Proposed retrospective:**  
  Antes de marcar listo: (1) ¿cada campo documenta `transforms` en orden real de aplicación y conserva `raw`? (2) ¿qué caso va a `review` en vez de inventar apellido/email? (3) Si agregaste matching, ¿el paquete de evidencia evita parentesco e identidad legal? Escribe en el README una frase de impacto medible (antes/después de NFC + contacto modesto) que puedas defender en 30 segundos. Puente: en S08 conectarás este normalizador con archivos, encodings y manifest de ingesta.
- **Code/output changes:** none
- **Validation notes:** Starter con `NotImplementedError` es correcto para proyecto; no rellenar solución en el reporte.

---

## Priority order

### P0 (We Do — preamble + title + instruction fade + retrospective; feedback razonado)
1. **T1-A** E1 → E2 → E3 (NFC, casefold, diagnóstico NFD)  
2. **T1-B** E1 → E2 → E3 (apellidos, partículas, review fail-closed)  
3. **T2-A** E1 → E2 → E3 (CSV-like, join, dígitos sin regex)  
4. **T2-B** E1 → E2 → E3 (email modesto, teléfono, overvalidation)  
5. **T3-A** E1 → E2 → E3 (fullmatch región, groupdict, search vs fullmatch)  
6. **T3-B** E1 → E2 → E3 (compile, findall, backtracking note)  
7. **T4-A** E1 → E2 → E3 (exact norm, Jaccard, umbrales)  
8. **T4-B** E1 → E2 → E3 (FP/FN, evidencia, no-parentesco)

### P1
- Las 8 demos **iDo**: añadir `preamble` + `retrospective`; opcional ampliar `why` a 40–90 palabras  
- **youDo**: añadir solo `retrospective` de defensa  

### P2
- Acortar/reordenar `instruction` para que sea task-only cuando el preamble absorba contexto  
- Enriquecer `feedback` a 25–60 palabras con misconception  
- Limpiar `print('ok', True)` residual de starters al alinear con solutions  
- Fijar frases canónicas en E3 de prosa (T3-B-E3, T4-B-E3) si hay output compare estricto  

---

## Residual risks

1. **Output compare en ejercicios de prosa** (T3-B-E3, T4-B-E3, reason de T4-B-E2, causa de T1-A-E3): el Fixer debe anclar frases cortas canónicas o documentar tolerancia.  
2. **Fade E1/E2/E3**: T1-B-E1 y E2 comparten el mismo defect (`given = toks[0]`); la prosa debe diferenciar andamiaje o el learner percibe clones.  
3. **Doble refuerzo teléfono** (T2-A-E3 y T2-B-E2): intencional (str general → contacto PE); preambles deben no sonar idénticos.  
4. **No tocar outputs canónicos** salvo execute-and-diff justificado; la mayoría ya son correctos.  
5. **Ámbito S07**: no introducir scraping/HTTP/SQL en propuestas; el Fixer debe mantener el muro con S08/S12.  
6. **Ética**: cualquier copy de matching debe repetir “evidencia ≠ identidad/parentesco” sin volverse un sermon en cada unidad — una mención fuerte en T4-B y youDo basta si T4-A ya dice “review, no merge”.

---

## Counts summary for Fixer

| Kind | Units | preamble | retrospective | title (weDo) |
|------|-------|----------|---------------|--------------|
| iDo | 8 | 0 → add all | 0 → add all | N/A |
| weDo | 24 | 0 → add all | 0 → add all | 0 → add all |
| youDo | 1 | context OK | 0 → add | exists |

**No source files were modified in this review round.**

Section 7 exercise pedagogy review complete. Ready for the Fixer prompt.
