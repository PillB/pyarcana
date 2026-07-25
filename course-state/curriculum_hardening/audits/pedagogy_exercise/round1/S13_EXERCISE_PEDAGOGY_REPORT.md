# S13 Exercise Pedagogy Report (Round 1)

## Section
- **title:** Familiarity Evidence Dashboard y cierre de nivel
- **id:** `rpa-automation` (index 13; archivo `s13-rpa-automation.ts` — contenido es evidencia de familiaridad / ER N1, no RPA de browser)
- **source:** `src/lib/course/sections/s13-rpa-automation.ts`
- **counts:** iDo 8, weDo 24 (8 subtemas × E1/E2/E3), youDo 1
- **subtopics:** T1-A normalización/blocking/ER · T1-B precision/recall/cola clerical · T2-A señales de relación · T2-B graphlet txs · T3-A ficha/uncertainty · T3-B umbrales/ops · T4-A dashboard/mapa · T4-B CF-1/ops/regresión

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` (preamble checklist, retrospective, E1→E2→E3 fade, length limits)
- Manually inspected every `iDo.steps[]`, `weDo.steps[]`, and `youDo` in the source (código, starter, solution, output, instruction, hint(s), feedback, why)
- Cross-checked against section story (CP-N1-C: entity_resolution_score ≠ relationship_signal_score; fail-closed; sin `is_family`/`auto_fraud`; datos sintéticos PE; CF-1 + regresión S01–S13)
- No bulk generation, no scripts, no copy-paste across sections

## Global findings (before unit ledger)

| Gap | Where | Impact |
|-----|--------|--------|
| **Zero `preamble`** | All 8 iDo + all 24 weDo | Newbie no ve escenario de mesa de riesgo → meta → éxito → límites antes del código |
| **Zero `retrospective`** | All iDo + weDo + youDo | Cierre metacognitivo ausente; no hay puente E1→E2→E3 ni al You Do / portfolio N1 |
| **Zero We Do `title`** | 24 weDo | Solo el prefijo “E1/E2/E3 …” dentro de `instruction`; UI carece de encabezado corto |
| **Instructions = drill + fixture** | Most weDo | Plantilla repetida “Concepto: S13-T… Entrada: fixture… Conserva el contrato…”; el DEFECT se nombra bien en el starter, no en la voz pedagógica |
| **Feedback de una línea** | Most weDo | Nombra el síntoma o el principio en 1 frase; rara vez repara el *razonamiento* del anti-patrón (FP=fraude, signal=parentesco, fusionar scores) |
| **`why` iDo corto y técnico** | 8 demos | Cumple rol técnico; no sustituye preamble (antes) ni retrospective (después) |
| **youDo bien enmarcado** | context/objectives/requirements/rubric + starter con `DECISION_MATRIX` y DEFECTS | Fuerte para cierre N1; falta solo `retrospective` de defensa de portfolio |
| **Código/outputs** | Casi todos | Pedagógicamente coherentes; defectos de starter bien etiquetados (`# DEFECT: …`); outputs canónicos claros; E1→E3 fade real en el *código* (no en la prosa) |
| **Story alignment** | Strong | CASO-LIM-013, Lima/Cusco/Arequipa, `C00x`/CASE-n, stdlib only, sin PII real, política ética visible en E3s |

**Severity default for this section:** systematic missing preamble+retrospective is **P0** on every We Do and **P1** on I Do (demos still have `description`+`why`+worked code). youDo retrospective alone is **P1**. Feedback/title polish is often **P2** if preamble/instruction/retrospective land. Code/output changes are almost never required.

---

## Unit ledger

### S13-T1-A-DEMO (iDo)
- **Diagnosis:** Worked example sólido: dos registros sintéticos con doc y bloque normalizados producen `entity_resolution_score` 1.0. `description` y `why` existen pero son telegráficos: el newbie no recibe “qué mirar antes de ejecutar” (casefold + blocking paterno) ni “qué principio se lleva” (ER ≠ parentesco). Sin preamble se ve solo como “si el print da True, listo”.
- **Checklist:** context fail · goal partial · success partial (output existe) · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  En la mesa de onboarding sintético, la primera pregunta es *¿son la misma persona en dos filas?*, no *¿son familia?*. Observa cómo `norm_doc` unifica `D-7788` y `d7788`, y cómo `block_key` toma el **segundo** token del nombre + región. No escribas aún: predice `block`, `match` y el score antes de mirar la salida. Solo datos sintéticos; stdlib.
- **Proposed instruction/description improvements:**  
  Description: “Emparejar dos registros sintéticos: doc normalizado + bloque paterno\|región”. Ampliar `why` (~60 palabras): las reglas son auditables; blocking acota pares antes de reglas finas; el score de ER no se mezcla con señales de relación.
- **Proposed retrospective:**  
  Si puedes explicar por qué `D-7788` y `d7788` son el mismo doc sin mirar el código, ya tienes el hábito de normalizar antes de comparar. El error clásico es usar el apellido materno (último token) como bloque. En We Do arreglarás `norm_*`, `blocking_key` y el score 1.0/0.5/0.0.
- **Code/output changes:** none
- **Validation notes:** Output canónico es el éxito observable de la demo.

---

### S13-T1-A-E1 (weDo, guided)
- **Diagnosis:** Defecto guiado excelente (`norm_name` sin casefold/colapso de espacios; `norm_doc` sin limpiar puntuación). Instruction densa tipo mini-spec con plantilla “Concepto: S13-T1-A…”; sin title, preamble ni retrospective. Feedback de una línea es correcto pero no ancla *cuándo* duele (mismas personas, docs distintos en string).
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Normalizar nombre y documento sintético
- **Proposed preamble:**  
  - **Contexto:** en el pipeline de ER del dashboard, sin normalización ` Ana  QUISPE ` y `D-12.34` no se unen a su par.  
  - **Meta:** implementar `norm_name` y `norm_doc` estables (casefold, espacios, solo alfanuméricos en doc).  
  - **Éxito:** dos líneas — `ana quispe` y `d1234`.  
  - **Límites:** solo stdlib + `re`; no borres el fixture; sin PII real.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `norm_name` solo hace `strip`; `norm_doc` devuelve el string crudo — ese es el DEFECT.  
  2. En nombre: `casefold`, colapsa espacios con `re.sub`.  
  3. En doc: `casefold` y deja solo `[a-z0-9]`.  
  4. Imprime las dos salidas (sin `ok` extra si el test solo mira las líneas de valor).
- **Proposed feedback improvement:**  
  Si `D-12.34` y `d1234` siguen distintos, la normalización no limpia puntuación o no hace casefold. Sin esta base, el score ER miente aunque el blocking sea correcto.
- **Proposed retrospective:**  
  Normalizar *antes* de comparar es el 80 % del ER por reglas. El mismo hábito aplica a emails y teléfonos en T2. Siguiente: armar la clave de blocking paterno\|región.
- **Code/output changes:** none (el starter imprime `ok True`; si el harness solo compara las dos líneas de valor, documentar; no cambiar output canónico de la solution)
- **Validation notes:** Solution output es `ana quispe` / `d1234`.

---

### S13-T1-A-E2 (weDo, independent)
- **Diagnosis:** Foco independiente bueno: `blocking_key` devuelve el nombre completo en vez de `apellido|región`. Instruction aún suena a checklist densa; E2 debería fijar meta+éxito con menos migas. Falta preamble de “por qué no usamos el materno” y cierre. Feedback correcto en una frase.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Blocking key paterno y región
- **Proposed preamble:**  
  - **Contexto:** el producto cartesiano de pares es inviable; blocking acota candidatos en el fixture sintético.  
  - **Meta:** construir `apellido_paterno|region` en casefold (segundo token; si hay uno solo, ese).  
  - **Éxito:** una línea `huamán|cusco` para `Luis Huamán Soto` / Cusco.  
  - **Límites:** no uses el último token (materno); solo stdlib; no inventes tokens.
- **Proposed instruction/description improvements:**  
  1. El starter devuelve `rec["name"]` crudo — corrige a clave de bloque.  
  2. Parte el nombre en casefold; toma `parts[1]` si hay ≥2 tokens.  
  3. Concatena con `region` en casefold y `|`.  
  4. Imprime solo la clave.
- **Proposed retrospective:**  
  Blocking no es veredicto de identidad: solo reduce el espacio. Confundir paterno con materno rompe el contrato N1 del memo. Siguiente: combinar doc + bloque en un score 1.0/0.5/0.0.
- **Code/output changes:** none
- **Validation notes:** Output canónico `huamán|cusco`.

---

### S13-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transferencia real: `er_score` hardcodeado a 1.0; el learner debe combinar doc + block con tres resultados distintos. Instruction ya narra el contrato; falta contexto de “migración de región / error de bloque → 0.5” y retrospective. Es el cierre natural de T1-A hacia evaluación.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Score ER 1.0, 0.5 o 0.0
- **Proposed preamble:**  
  - **Contexto:** en la ficha del dashboard el revisor necesita un `entity_resolution_score` auditable, no un “siempre match”.  
  - **Meta:** implementar `er_score(a,b)` con el contrato N1: doc+block → 1.0; solo doc → 0.5; resto → 0.0.  
  - **Éxito:** tres números en una línea — `1.0 0.5 0.0` (pares A-B, A-C, A-D del fixture).  
  - **Límites:** solo stdlib; blocking paterno `parts[1]`; no inventes evidencia fuera del fixture.
- **Proposed instruction/description improvements:**  
  1. El starter siempre devuelve `1.0` — ese es el DEFECT.  
  2. Compara `norm_doc` y `bkey` (ya dados).  
  3. Aplica la cascada 1.0 / 0.5 / 0.0.  
  4. Imprime los tres scores del fixture sin reescribir los dicts.
- **Proposed retrospective:**  
  Un score de tres niveles documenta *por qué* un par es dudoso (doc ok, bloque distinto). No es parentesco ni fraude. En T1-B medirás si la regla ayuda con precision/recall y cola clerical.
- **Code/output changes:** none
- **Validation notes:** Fixture A/B/C/D bien diseñado para los tres caminos.

---

### S13-T1-B-DEMO (iDo)
- **Diagnosis:** Demo clara de TP/FP/FN, precision/recall y cola clerical `P4/P9/P15`. `why` corto. Falta escena “por qué precision importa más que accuracy en crédito/compliance” y cierre metacognitivo (FP ≠ delito).
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Sin etiquetas sintéticas no sabes si tu regla de ER ayuda o daña. Esta demo arma 20 pares con seed fijo, calcula precision/recall y lista la **cola clerical** (scores en [0.4, 0.7]). Observa que precision alta no borra los FN, y que la banda gris va a humano — no a auto-merge. Predice la cola antes de leer la salida.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: métricas + cola cierran el loop de calidad; un FP es colisión de matching, no fraude; la banda intermedia nunca auto-mergea.
- **Proposed retrospective:**  
  Si puedes decir por qué un score 0.55 no debe auto-aceptarse, ya internalizaste human-in-the-loop. We Do: formulas precision/recall, cola inclusive y reporte ético `fp_not_fraud`.
- **Code/output changes:** none

---

### S13-T1-B-E1 (weDo, guided)
- **Diagnosis:** Defecto clásico y excelente: formulas invertidas (precision usa fn, recall usa fp). Instruction densa; sin preamble de “qué mide cada métrica en mesa de riesgo” ni retrospective. Feedback telegráfico.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Precision y recall sin invertir
- **Proposed preamble:**  
  - **Contexto:** en el gate N1 reportas si el matching sintético es confiable antes de ensanchar reglas.  
  - **Meta:** calcular precision y recall a partir de tp/fp/fn (sin invertir denominadores).  
  - **Éxito:** `precision 0.8` y `recall 0.8` con tp=8, fp=2, fn=2.  
  - **Límites:** solo stdlib; redondeo a 3 decimales; no uses sklearn.
- **Proposed instruction/description improvements:**  
  1. El starter invierte las formulas — ese es el DEFECT.  
  2. precision = tp/(tp+fp); recall = tp/(tp+fn).  
  3. Imprime con `round(..., 3)` y las etiquetas del solution.  
  4. No cambies los conteos del fixture.
- **Proposed feedback improvement:**  
  Si precision “baja” al subir FN o recall al subir FP, invertiste los denominadores. Precision castiga falsos match; recall castiga matches perdidos — en alto riesgo sueles priorizar precision y empujar duda a la cola.
- **Proposed retrospective:**  
  Métricas simples bastan para N1 si son correctas y auditables. El error clásico es confiar en “accuracy alto” sin TP/FP/FN. Siguiente: la cola clerical de la banda gris.
- **Code/output changes:** none

---

### S13-T1-B-E2 (weDo, independent)
- **Diagnosis:** DEFECT bien elegido: cola = scores ≥ high (banda de accept) en vez de [low, high]. Instruction aún plantilla; falta escena de “qué revisa el humano” y retrospective. E2 independent: ok con meta+éxito y menos pasos.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Cola clerical en banda de duda
- **Proposed preamble:**  
  - **Contexto:** el dashboard no decide solo: la **cola clerical** es la bandeja humana de scores intermedios.  
  - **Meta:** devolver ids con score en [0.4, 0.7] **inclusive**.  
  - **Éxito:** `['P2', 'P3']` (P1=0.2 fuera; P4=0.9 fuera).  
  - **Límites:** no encoles la banda de accept; orden estable del fixture; solo stdlib.
- **Proposed instruction/description improvements:**  
  1. El filtro actual usa `score >= high` — corrígelo a `low <= score <= high`.  
  2. Conserva el orden de aparición de `pairs`.  
  3. Imprime la lista de ids.  
  4. No borres P1–P4 del fixture.
- **Proposed retrospective:**  
  Human-in-the-loop es un filtro de banda, no “todo lo alto”. Encolar accept desperdicia al revisor; ignorar 0.7 pierde el borde. Siguiente: unir métricas y límites éticos en un mismo report.
- **Code/output changes:** none

---

### S13-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Transferencia fuerte: PR + texto ético + `ops_action=needs_review` (starter afirma delito y `auto_fraud`). Instruction densa con textos exactos (necesario para tests); falta preamble de “números y ética viajan juntos” y retrospective. Es el E3 ético de T1-B.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Reporte PR sin convertir FP en fraude
- **Proposed preamble:**  
  - **Contexto:** un revisor de compliance lee el reporte de evaluación del matching sintético; un FP no es veredicto de delito.  
  - **Meta:** calcular precision/recall (tp=5, fp=1, fn=2) y adjuntar disclaimer + `ops_action=needs_review`.  
  - **Éxito:** cuatro líneas — precision 0.833, recall 0.714, frase exacta `fp_not_fraud`, y `ops_action: needs_review`.  
  - **Límites:** no `auto_fraud`; texto exacto del solution; solo stdlib.
- **Proposed instruction/description improvements:**  
  1. El starter deja PR en 0.0 y trata FP como delito — corrige ambos.  
  2. Calcula PR con round 3.  
  3. Texto exacto: *False positive de matching no es evidencia de delito*.  
  4. `ops_action` debe ser `needs_review`, no `auto_fraud`.
- **Proposed retrospective:**  
  El artefacto de gate une **número** y **límite ético**. Tratar FP como fraude es el error más grave de N1. En T2 practicarás señales de relación con el mismo espíritu: señal ≠ parentesco.
- **Code/output changes:** none
- **Validation notes:** Textos exactos son contrato de test; no “mejorar” la prosa del disclaimer en el código.

---

### S13-T2-A-DEMO (iDo)
- **Diagnosis:** Demo de señales canónicas 0.5/0.3/0.2 con phone+geo+surname y `kinship_verdict None`. `why` corto. Falta escena de “tres bullets en ficha” y el principio *señal ≠ parentesco*.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  La segunda pregunta del dashboard es *¿hay indicios de familiaridad operativa?*, no *¿son parientes?*. Sigue cómo se arman las señales (teléfono compartido, km≤2 bilateral, apellido) y el peso canónico 0.5/0.3/0.2. Observa `kinship_verdict=None` al final: el producto **no** cierra parentesco. Predice el score antes de la salida.
- **Proposed instruction/description improvements:**  
  Description: “Señales phone + geo + surname y score de relación sin veredicto de parentesco”. Ampliar `why`: explicación lista para ficha; pesos fijos del memo; fail-closed si falta km.
- **Proposed retrospective:**  
  Si puedes listar las tres señales sin mirar el código, ya tienes traza legible. We Do: email compartido sin vacíos, variante geo+apellido, y disclaimer adjunto al score.
- **Code/output changes:** none

---

### S13-T2-A-E1 (weDo, guided)
- **Diagnosis:** DEFECT sutil y bueno: `''==''` cuenta como shared. Instruction plantilla; falta preamble de “contacto compartido es señal fuerte pero no identidad legal”. Feedback de una línea no repara el caso vacío.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Email compartido sin vacíos
- **Proposed preamble:**  
  - **Contexto:** en señales de relación, un email igual y no vacío empuja familiaridad operativa en el fixture sintético.  
  - **Meta:** `shared_email(a,b)` con casefold y rechazo de strings vacíos.  
  - **Éxito:** tres booleanos — `True`, `False`, `False` (match, vacío-vacío, distintos).  
  - **Límites:** solo stdlib; `''` no es shared; sin PII real.
- **Proposed instruction/description improvements:**  
  1. El starter usa `a == b` y trata `''==''` como True — DEFECT.  
  2. Si falta o está vacío cualquiera de los dos, retorna False.  
  3. Compara en casefold.  
  4. Imprime los tres casos del starter.
- **Proposed feedback improvement:**  
  Dos vacíos iguales no son un contacto real: son ausencia de dato. Si no filtras, inflas señales y engañas la ficha del revisor.
- **Proposed retrospective:**  
  Shared contact es señal fuerte, no identidad legal ni parentesco. El mismo rigor (no inventar True) aplica a teléfono y dirección. Siguiente: combinar geo + apellido con pesos documentados.
- **Code/output changes:** none

---

### S13-T2-A-E2 (weDo, independent)
- **Diagnosis:** Variante de práctica (0.6 geo + 0.4 jaccard) bien etiquetada vs canónico 0.5/0.3/0.2 — pedagogía honesta. Instruction ya aclara la variante; falta preamble de “por qué documentar pesos” y retrospective. DEFECT: ignora km.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Combinar geo y apellido (variante)
- **Proposed preamble:**  
  - **Contexto:** en práctica de T2 usas una **variante** geo+apellido (0.6/0.4); el canónico de tres señales queda para la ficha y E3.  
  - **Meta:** `rel_score(km, surname_jaccard)` con geo si km≤2.0 inclusive.  
  - **Éxito:** `0.8` (km=1.2, j=0.5) y `0.2` (km=5.0, j=0.5).  
  - **Límites:** no uses la fórmula de tres señales aquí; documenta pesos; solo stdlib.
- **Proposed instruction/description improvements:**  
  1. El starter solo devuelve el jaccard — añade el término geo.  
  2. geo = 1.0 si km ≤ 2, si no 0.0.  
  3. score = round(0.6*geo + 0.4*jaccard, 3).  
  4. Imprime ambos casos del fixture.
- **Proposed retrospective:**  
  Pesos documentados permiten auditar el score. Confundir variante de práctica con canónico de producto rompe el memo del curso. Siguiente: score canónico + disclaimer de no parentesco.
- **Code/output changes:** none
- **Validation notes:** Mantener la etiqueta “variante” en instruction/preamble para no contradecir teoría.

---

### S13-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Transferencia ética + fórmula canónica: starter hardcodea score y afirma parentesco. Instruction con texto exacto del disclaimer; falta preamble de “número y límite en el mismo dict” y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Score de relación con disclaimer
- **Proposed preamble:**  
  - **Contexto:** la ficha de caso muestra `relationship_signal_score` **junto** a un disclaimer; el revisor no debe leer “1.0” como parentesco.  
  - **Meta:** calcular rel canónico 0.5·phone + 0.3·geo + 0.2·surname y adjuntar el disclaimer exacto.  
  - **Éxito:** `score 1.0` y la frase *relationship_signal_score no implica parentesco ni colusión*.  
  - **Límites:** no hardcodees parentesco legal; pesos fijos; solo stdlib.
- **Proposed instruction/description improvements:**  
  1. Calcula `rel` con los tres factores del starter (todos 1.0).  
  2. Arma el dict de ficha con score y disclaimer.  
  3. Texto exacto del solution (tests de portfolio).  
  4. Imprime score y disclaimer en dos líneas.
- **Proposed retrospective:**  
  Señal ≠ parentesco: si el disclaimer no viaja con el número, la UI miente por omisión. En T2-B el mismo principio aplica a contrapartes comunes y colusión.
- **Code/output changes:** none

---

### S13-T2-B-DEMO (iDo)
- **Diagnosis:** Graphlet mínimo A↔B + common counterparty vía D con `collusion_claim False`. `why` telegráfico. Falta escena de “evidencia, no acusación” y qué mirar en la estructura (`type`, `via`).
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  En el grafo sintético de txs, el producto **organiza evidencia** (quién pagó a quién) y **nunca** acusa de colusión. Observa el graphlet: arista directa A–B y contraparte común D entre A y C. Predice la lista de objetos y el flag `collusion_claim False`. Sin redes ni sklearn; solo listas de triples.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: graphlet mínimo con disclaimers operativos; reutiliza el espíritu de RelationshipEvidence de S11; `via` no es `shared` ambiguo.
- **Proposed retrospective:**  
  Si puedes decir por qué common counterparty no prueba cartel, ya internalizaste el límite de N1. We Do: txs bidireccionales, intersección de vecinos y disclaimers de no colusión/no parentesco.
- **Code/output changes:** none

---

### S13-T2-B-E1 (weDo, guided)
- **Diagnosis:** DEFECT claro: solo dirección A→B omite el monto 5 de B→A. Instruction plantilla; falta preamble de “bidireccional = misma arista no dirigida” y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Transferencias directas en ambas direcciones
- **Proposed preamble:**  
  - **Contexto:** en la ficha de relación operativa, A→B y B→A son la misma evidencia de par.  
  - **Meta:** listar montos de txs directas entre a y b sin importar el sentido.  
  - **Éxito:** `[10, 5]` sobre el fixture del starter.  
  - **Límites:** no inventes txs; conserva orden de aparición; solo stdlib.
- **Proposed instruction/description improvements:**  
  1. El filtro `x == a and y == b` es el DEFECT (pierde B→A).  
  2. Usa igualdad de conjuntos de endpoints `{x,y} == {a,b}`.  
  3. Devuelve los montos en orden del fixture.  
  4. Imprime la lista.
- **Proposed feedback improvement:**  
  Si solo ves `[10]`, estás modelando dirección, no par. La evidencia `direct_tx` es simétrica en N1.
- **Proposed retrospective:**  
  El patrón de sets de endpoints reaparece en tests de grafo y en el You Do. Siguiente: contrapartes comunes por intersección de vecinos.
- **Code/output changes:** none

---

### S13-T2-B-E2 (weDo, independent)
- **Diagnosis:** DEFECT clásico: unión `|` en vez de intersección `&`. Instruction breve; buena para E2 independent. Falta preamble de “qué significa via” y retrospective. Feedback menciona top-k de forma un poco desconectada.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Contrapartes comunes por intersección
- **Proposed preamble:**  
  - **Contexto:** A y C “se tocan” si comparten un nodo D en el grafo sintético de pagos.  
  - **Meta:** devolver la lista ordenada de contrapartes comunes (intersección de vecinos).  
  - **Éxito:** `['D']` (E y F no son comunes).  
  - **Límites:** intersección, no unión; solo stdlib; no inventes nodos.
- **Proposed instruction/description improvements:**  
  1. El starter usa `|` — cámbialo a `&`.  
  2. Reutiliza `neighbors` del starter.  
  3. Ordena con `sorted`.  
  4. Imprime el resultado para A y C.
- **Proposed feedback improvement:**  
  Unión lista a todo el mundo “conectado a alguien”; intersección responde *quién es puente entre ambos*. Ese es el `via` de la ficha.
- **Proposed retrospective:**  
  Common counterparty es traza operativa, no cartel. El error clásico es union o hardcodear `via=['D']` sin calcular. Siguiente: adjuntar disclaimers al objeto de evidencia.
- **Code/output changes:** none

---

### S13-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Transferencia doble: calcula `via` mal (A∩B en vez de A∩C) **y** afirma colusión/parentesco. Instruction con textos exactos; falta preamble y retrospective de “evidencia + límite en el mismo objeto”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Evidencia de grafo sin acusación
- **Proposed preamble:**  
  - **Contexto:** el revisor ve `via` y debe leer al lado que **no** prueba acuerdo ilícito ni parentesco.  
  - **Meta:** calcular `via` = vecinos(A) ∩ vecinos(C) y adjuntar dos disclaimers exactos.  
  - **Éxito:** `via ['D']` más las dos frases `no_collusion` / `no_kinship` del solution.  
  - **Límites:** no hardcodees colusión; textos exactos; solo stdlib.
- **Proposed instruction/description improvements:**  
  1. Corrige `neighbors("B")` → `neighbors("C")`.  
  2. Arma el dict `type=common_counterparty` con `via` y disclaimers.  
  3. Textos: *no prueba acuerdo ilícito* / *no prueba parentesco*.  
  4. Imprime via y las dos líneas de disclaimer.
- **Proposed retrospective:**  
  Evidencia de grafo y límites de inferencia viajan juntos: si solo imprimes `via`, alguien “completa” la acusación. En T3 pasarás a ficha con uncertainty y bullets honestos.
- **Code/output changes:** none

---

### S13-T3-A-DEMO (iDo)
- **Diagnosis:** Ficha con evidence_score 0.708, uncertainty med y 3 bullets. `why` corto (“artefacto humano”). Falta escena de “si no puedes listar 3 bullets, no publiques el score”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  La ficha de caso es lo que lee un humano en cinco minutos. Observa la combinación 0.6·ER + 0.4·REL, la banda de uncertainty (falta `email` → med) y los tres bullets. No escribas aún: predice si el gap |0.88−0.45| dispara high (no: el umbral es >0.5). Solo stdlib; sin maquillar el score.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: tres salidas viajan juntas (score, uncertainty, bullets); audit `rules_version` en teoría; fail-closed si faltan campos.
- **Proposed retrospective:**  
  Si puedes recalcular 0.708 a mano, confías en la ficha. We Do: plantilla de bullets, bandas low/med/high y caso conflictivo sin maquillaje.
- **Code/output changes:** none

---

### S13-T3-A-E1 (weDo, guided)
- **Diagnosis:** DEFECT simple y guiado: omite bullet de `missing`. Instruction plantilla; falta preamble de “explicación primero” y retrospective. Feedback OK pero seco.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres bullets de explicación de ficha
- **Proposed preamble:**  
  - **Contexto:** sin bullets el revisor ve un número huérfano en el dashboard.  
  - **Meta:** devolver exactamente 3 strings: ER, REL y missing.  
  - **Éxito:** lista con `entity_resolution_score=0.9`, `relationship_signal_score=0.4` y `missing=['phone']`.  
  - **Límites:** no omitas missing; no inventes campos; solo stdlib.
- **Proposed instruction/description improvements:**  
  1. El starter devuelve solo 2 bullets — añade missing.  
  2. Usa f-strings con los tres inputs.  
  3. No reformatees nombres de claves.  
  4. Imprime la lista completa.
- **Proposed retrospective:**  
  Plantilla de tres bullets es reutilizable en el You Do y en el portfolio. El error clásico es esconder missing para “verse más limpio”. Siguiente: la banda de uncertainty.
- **Code/output changes:** none

---

### S13-T3-A-E2 (weDo, independent)
- **Diagnosis:** DEFECT: siempre `low`. Instruction nombra la cascada; E2 independent bien acotado. Falta preamble de “uncertainty honestifica el score” y retrospective. Orden de ifs es el learning goal.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Banda de incertidumbre low/med/high
- **Proposed preamble:**  
  - **Contexto:** un evidence_score sin uncertainty engaña al revisor en la cola.  
  - **Meta:** `uncertainty_band(missing, conflict)` — high si conflicto o ≥2 missing; med si hay missing; low si no.  
  - **Éxito:** cuatro líneas — `low`, `med`, `high`, `high`.  
  - **Límites:** conflicto gana aunque missing esté vacío; solo stdlib.
- **Proposed instruction/description improvements:**  
  1. Reemplaza el return fijo `"low"`.  
  2. Orden: conflict o len≥2 → high; luego si missing → med; else low.  
  3. Imprime los cuatro casos del starter.  
  4. No cambies los argumentos de prueba.
- **Proposed feedback improvement:**  
  Si un conflicto queda en low, el orden de ifs está mal o ignoras el flag. Uncertainty high fuerza revisión aunque el número se vea “bonito”.
- **Proposed retrospective:**  
  Incertidumbre es honestidad operativa, no un adorno. El mismo contrato alimenta `decide_ops_status` en T3-B. Siguiente: caso conflictivo ER vs REL sin maquillar el score.
- **Code/output changes:** none

---

### S13-T3-A-E3 (weDo, transfer)
- **Diagnosis:** Transferencia clara: er=0.9, rel=0.1 → score 0.58, uncertainty high, note de señales conflictivas. Starter deja uncertainty low y note “ok”. Falta preamble de “no maquilles hacia el centro” y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Conflicto ER vs REL sin maquillaje
- **Proposed preamble:**  
  - **Contexto:** identidad fuerte y relación muy débil es una **tensión** que el revisor debe ver, no un promedio cosmético.  
  - **Meta:** imprimir evidence_score 0.6/0.4, uncertainty high si |er−rel|>0.5, y note `señales conflictivas`.  
  - **Éxito:** `evidence_score 0.58`, `uncertainty high`, `note señales conflictivas`.  
  - **Límites:** no inventes campos; no suavices el score; solo stdlib.
- **Proposed instruction/description improvements:**  
  1. Mantén el cálculo del score del starter.  
  2. Detecta conflicto con `abs(er - rel) > 0.5`.  
  3. Cambia uncertainty y note según el solution.  
  4. Imprime las tres líneas etiquetadas.
- **Proposed retrospective:**  
  Explicación honesta > score cosmético. Si maquillas hacia 0.5, rompes auditoría. En T3-B traducirás score+uncertainty a estados operativos sin `auto_fraud`.
- **Code/output changes:** none

---

### S13-T3-B-DEMO (iDo)
- **Diagnosis:** Matriz de decisión con needs_review / accept_pair / abstain / invalid_input y flags `auto_fraud`/`is_family` siempre False. `why` de política corto. Falta escena de “orden de evaluación y límites exactos 0.40/0.80”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El dashboard no decide culpables: clasifica el **par de evidencia** (invalidar, abstenerse, revisar, aceptar par). Sigue el orden: input inválido → high unc → abstain <0.4 → review <0.8 → accept. Observa que 0.85 con high **no** acepta, y que NaN es `invalid_input`. Predice cada línea; nunca `auto_fraud`/`is_family` true.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: política de abstención protege al estudiante y al usuario final; límites 0.40 y 0.80 exactos; matriz total sin huecos.
- **Proposed retrospective:**  
  Si puedes explicar por qué 0.4 es review y 0.399 abstain, ya tienes el contrato de umbrales. We Do: config externalizable, `decide_ops_status` completo y strip de claves prohibidas.
- **Code/output changes:** none

---

### S13-T3-B-E1 (weDo, guided)
- **Diagnosis:** DEFECT excelente y visual: umbrales invertidos (accept 0.4, review 0.8) rompen el assert de orden. Instruction densa; falta preamble de “tres intervalos contiguos” y retrospective. Feedback bueno.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Umbrales review_low y accept_min
- **Proposed preamble:**  
  - **Contexto:** umbrales mágicos enterrados en ifs no se auditan en el portfolio N1.  
  - **Meta:** config dict con `review_low=0.4` y `accept_min=0.8` (orden correcto).  
  - **Éxito:** `sorted(items)` → `[('accept_min', 0.8), ('review_low', 0.4)]` y assert de orden.  
  - **Límites:** review_low < accept_min; sin huecos conceptuales; solo stdlib.
- **Proposed instruction/description improvements:**  
  1. El starter tiene los valores intercambiados — DEFECT.  
  2. Corrige a accept_min=0.8 y review_low=0.4.  
  3. Conserva el assert de orden.  
  4. Imprime `sorted(thresholds.items())`.
- **Proposed retrospective:**  
  Dos límites forman tres intervalos (abstain / review / accept). Config fuera de “números sueltos” facilita el You Do. Siguiente: implementar la matriz completa con validación de input.
- **Code/output changes:** none

---

### S13-T3-B-E2 (weDo, independent)
- **Diagnosis:** Ejercicio central de la sección: matriz total de 7 filas con validación, high unc y bordes 0.4/0.8. Starter acepta NaN y high→accept. Instruction muy densa (casi spec completa) — apropiado para E2 complejo, pero sin preamble de “estados de par, no veredictos” ni retrospective. Feedback corto.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Matriz decide_ops_status sin huecos
- **Proposed preamble:**  
  - **Contexto:** el runbook N1 exige que todo score finito y toda uncertainty caigan en **exactamente un** estado operativo.  
  - **Meta:** implementar `decide_ops_status(score, unc, th)` con validación, high→review, y umbrales del dict.  
  - **Éxito:** las 7 líneas del solution (de invalid_input a nan invalid_input).  
  - **Límites:** sin `auto_fraud`/`is_family`; bool no es score válido; solo stdlib + `isfinite`.
- **Proposed instruction/description improvements:**  
  1. El starter no valida y prioriza accept — reescribe la cascada.  
  2. Orden: invalid (tipo/bool/rango/unc) → high → score < review_low → score < accept_min → accept_pair.  
  3. Imprime cada fila del loop del starter.  
  4. No cambies `th` ni la lista de casos.
- **Proposed feedback improvement:**  
  Si 0.9/high acepta, high no gana sobre el score. Si NaN cae en abstain, falta `isfinite`. Los bordes 0.4 y 0.8 son inclusivos hacia review/accept según el contrato (`score <` en el código canónico).
- **Proposed retrospective:**  
  Estados operativos de par ≠ veredictos legales. Esta función es el corazón del You Do (`DECISION_MATRIX` de 9 filas). Siguiente: auditoría que borra `is_family`/`auto_fraud` de la salida.
- **Code/output changes:** none
- **Validation notes:** Outputs canónicos exactos; no “aproximar” 0.799.

---

### S13-T3-B-E3 (weDo, transfer)
- **Diagnosis:** Transferencia de política: strip de claves prohibidas. Instruction simple; DEFECT deja is_family/auto_fraud. Falta preamble de “grep de portfolio” y retrospective. Feedback de una línea.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Quitar is_family y auto_fraud de la salida
- **Proposed preamble:**  
  - **Contexto:** en auditoría de portfolio N1, cualquier path que emita `is_family` o `auto_fraud` cierra mal el gate.  
  - **Meta:** limpiar un dict de salida dejando solo claves permitidas.  
  - **Éxito:** `['score', 'status']` (sorted keys).  
  - **Límites:** elimina ambas claves si existen; no inventes campos; solo stdlib.
- **Proposed instruction/description improvements:**  
  1. El starter copia `out` sin filtrar — DEFECT.  
  2. Filtra con set de forbidden o `pop`.  
  3. Imprime `sorted(clean.keys())`.  
  4. No dejes rastros de las claves prohibidas.
- **Proposed retrospective:**  
  Política N1 se demuestra en código, no solo en el README. El mismo checklist aparece en el You Do y en CF-1. En T4 pasarás a UI pseudonimizada y artefactos de ops.
- **Code/output changes:** none

---

### S13-T4-A-DEMO (iDo)
- **Diagnosis:** Scaffold de 3 casos con scores separados y coords Lima/Arequipa. `why` corto de producto. Falta escena de “revisor en 5 minutos” y por qué no fusionar ER/REL.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El gate de producto N1 no pide un design system: pide **tres fichas** + puntos de mapa sintéticos con scores **etiquetados**. Observa CASE-1/2/3: ER y REL viajan separados; el nombre se muestra como `A*** Q***`. Predice los tres prints. Sin geocoder público ni PII real.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: producto mínimo auditable; tooltips de geoseñal en teoría; fusión de scores sin etiqueta rompe el gate ético.
- **Proposed retrospective:**  
  Si puedes decir qué historia cuenta CASE-2 (ER medio, REL alto) sin autoetiqueta de parentesco, ya lees la ficha como revisor. We Do: pseudonimizar, case_sheet con claves canónicas y tooltip con `source=`.
- **Code/output changes:** none

---

### S13-T4-A-E1 (weDo, guided)
- **Diagnosis:** DEFECT trivial pero correcto para E1: devuelve nombre completo. Instruction plantilla; falta preamble de privacidad en demo y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Pseudonimizar nombre en la vista
- **Proposed preamble:**  
  - **Contexto:** en demos y capturas de portfolio, el nombre completo no debe lucir en pantalla.  
  - **Meta:** `pseudonymize` → primer carácter + `***` por token.  
  - **Éxito:** `A*** Q*** R***` para `Ana Quispe Rojas`.  
  - **Límites:** solo stdlib; no inventes un nombre real; no dejes el string crudo.
- **Proposed instruction/description improvements:**  
  1. El starter devuelve `name` intacto — DEFECT.  
  2. Parte por espacios y transforma cada token.  
  3. Une con espacio.  
  4. Imprime el resultado.
- **Proposed retrospective:**  
  Vista pseudonimizada reduce exposición en capturas. El mismo helper alimenta el You Do y CASE-1/2/3. Siguiente: ficha con dos scores etiquetados (no `er`/`rel` opacos ni `is_family`).
- **Code/output changes:** none

---

### S13-T4-A-E2 (weDo, independent)
- **Diagnosis:** DEFECT pedagógico fuerte: claves wrong names **y** `is_family` por umbral. Instruction nombra claves canónicas; falta preamble de “dos constructos, dos campos” y retrospective. Feedback bueno.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Ficha con ER y REL separados
- **Proposed preamble:**  
  - **Contexto:** si la UI muestra un solo “0.7” sin etiqueta, el revisor no sabe si es identidad o familiaridad.  
  - **Meta:** `case_sheet(er, rel)` con claves canónicas y **sin** `is_family`.  
  - **Éxito:** dict exacto con `entity_resolution_score` 0.9 y `relationship_signal_score` 0.4.  
  - **Límites:** no fusionar; no añadir veredictos; solo stdlib.
- **Proposed instruction/description improvements:**  
  1. Sustituye claves `er`/`rel` por nombres canónicos.  
  2. Elimina `is_family`.  
  3. Imprime el dict.  
  4. No inventes campos extra.
- **Proposed feedback improvement:**  
  Claves cortas y un booleano de parentesco son el anti-patrón de producto N1. La ficha educa al revisor solo si los dos scores se leen por separado.
- **Proposed retrospective:**  
  Dos scores, dos historias: el mismo principio del callout de teoría. En el You Do la ficha y el mapa deben respetarlo. Siguiente: tooltip de mapa con provenance.
- **Code/output changes:** none

---

### S13-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Transferencia de provenance S12→S13: tooltip con lat/lon/km/source. DEFECT omite km y source. Instruction breve; falta preamble de “trazabilidad del mapa” y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tooltip de mapa con source
- **Proposed preamble:**  
  - **Contexto:** el mapa del dashboard hereda la política de egress de S12: geoseñal **trazable**, no PII cruda a geocoders públicos.  
  - **Meta:** `map_tooltip(lat, lon, km, source)` en una línea legible.  
  - **Éxito:** `lat=-12.04,lon=-77.04,geo_distance_km=1.2,source=mock`.  
  - **Límites:** incluye `source=`; no inventes coords reales de domicilio; solo stdlib.
- **Proposed instruction/description improvements:**  
  1. Amplía el f-string del starter con km y source.  
  2. Formato exacto del solution (orden de campos).  
  3. Imprime una sola línea.  
  4. No llames APIs externas.
- **Proposed retrospective:**  
  Tooltip sin `source` no se audita: el revisor no sabe si el km es mock o un egress real. En T4-B cierras con privacy sheet, demo y runbook de incidente.
- **Code/output changes:** none

---

### S13-T4-B-DEMO (iDo)
- **Diagnosis:** Runbook de 7 pasos + demo cmd + `demo_writes_course_progress False`. `why` ya menciona gate formal vs demo. Falta preamble de CF-1 como paquete y retrospective hacia el You Do.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Sin operación documentada, el dashboard es un prototipo de laptop, no un cierre de nivel. Observa el runbook: setup, fixtures sintéticos, ER+señales, dashboard, cola, regresión S01–S13 y artefactos CF-1. Nota el comando de un solo shot y que la demo **no** escribe “aprobado” en el ledger del curso. Predice las líneas finales.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why` ligeramente: CF-1 = privacy + demo + runbook; regresión level-1 en ~30 min; el gate formal es proceso aparte.
- **Proposed retrospective:**  
  Si puedes listar los artefactos CF-1 sin mirar el código, ya sabes qué entregar. We Do: privacy sheet, demo command sintético y playbook de incidente + nota de regresión.
- **Code/output changes:** none

---

### S13-T4-B-E1 (weDo, guided)
- **Diagnosis:** DEFECT claro: `production` + `pii_real True`. Instruction plantilla; falta preamble de “sin privacy sheet no cierra CF-1” y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Privacy sheet synthetic_only
- **Proposed preamble:**  
  - **Contexto:** CF-1 exige declarar clase de datos y que no hay PII real en el demo N1.  
  - **Meta:** dict con `data_class=synthetic_only`, `pii_real=False`, roles viewer/reviewer.  
  - **Éxito:** keys ordenadas + `False` en pii_real.  
  - **Límites:** no marques production; no roles inventados; solo stdlib.
- **Proposed instruction/description improvements:**  
  1. Corrige `data_class` y `pii_real` del starter.  
  2. Conserva roles canónicos.  
  3. Imprime `sorted(keys)` y el valor de pii_real.  
  4. No borres campos del contrato.
- **Proposed retrospective:**  
  Privacy sheet es artefacto, no un print decorativo. Si `pii_real` queda True, el portfolio se rechaza aunque el score “se vea bonito”. Siguiente: el comando de demo reproducible.
- **Code/output changes:** none

---

### S13-T4-B-E2 (weDo, independent)
- **Diagnosis:** DEFECT ético fuerte: `--live-pii` en vez de `--synthetic`. Instruction simple; buena para independent. Falta preamble de “un comando, cero fricción de revisión” y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Demo de un comando sintético
- **Proposed preamble:**  
  - **Contexto:** el revisor de nivel debe reproducir el producto en máquina limpia con un solo comando.  
  - **Meta:** `demo_command()` → string fijo con `--synthetic`.  
  - **Éxito:** `python -m demo_n1_dashboard --synthetic`.  
  - **Límites:** nunca `--live-pii`; no inventes flags; solo stdlib.
- **Proposed instruction/description improvements:**  
  1. Sustituye el flag del starter.  
  2. Conserva el módulo `demo_n1_dashboard`.  
  3. Imprime el string exacto.  
  4. No añadas argumentos extra.
- **Proposed feedback improvement:**  
  Un demo con PII real no es “más realista”: es un fail de CF-1. El flag `--synthetic` es contrato de runbook y de gate.
- **Proposed retrospective:**  
  Reproducibilidad de un comando reduce fricción de revisión de nivel. El mismo string aparece en el I Do y en el You Do. Siguiente: incidente PII en log + regresión S01–S13.
- **Code/output changes:** none

---

### S13-T4-B-E3 (weDo, transfer)
- **Diagnosis:** Transferencia ops: playbook de incidente + nota de regresión level-1. Starter “ignore|continue” y “skip”. Instruction densa con textos exactos; falta preamble de “incidente no cierra el nivel sin re-check” y retrospective hacia You Do.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Incidente PII y regresión N1
- **Proposed preamble:**  
  - **Contexto:** si un token o nombre aparece en un log del demo, la respuesta es playbook — no “seguir como si nada”.  
  - **Meta:** tres acciones en orden (`rotate_secret`, `redact_logs`, `postmortem`) y nota de re-check S01–S13.  
  - **Éxito:** `rotate_secret|redact_logs|postmortem` y la línea exacta de `level1_regression`.  
  - **Límites:** orden fijo; no `ignore`; solo stdlib.
- **Proposed instruction/description improvements:**  
  1. Reemplaza la lista `ignore/continue`.  
  2. Une con `|` en el orden del solution.  
  3. Segundo print: texto exacto de regresión level-1.  
  4. No inventes pasos extra.
- **Proposed retrospective:**  
  Incidente y regresión forman parte del cierre N1: no basta con que el dashboard “corra otra vez”. En el You Do ensamblas ER, REL, matriz de decisión, privacy y las 13 filas de regresión en un solo entregable.
- **Code/output changes:** none

---

### youDo (You Do)
- **Diagnosis:** Marco de proyecto **fuerte**: context, objectives, requirements, rubric, portfolioNote y starter con DEFECTS intencionales + `DECISION_MATRIX` (9 filas) + `LEVEL1_REGRESSION_MATRIX` (13 filas). Un newbie ambicioso puede ejecutar, pero falta el cierre metacognitivo de **defensa**: qué invariante demuestras, qué no harías con PII real, y la frase de impacto medible para el gate. Sin `retrospective` el You Do se siente “terminar asserts” más que “defender portfolio N1”.
- **Checklist:** context pass · goal pass · success pass (rubric + oráculos) · constraints pass · retrospective **fail**
- **Severity:** P1
- **Proposed title:** (ya existe) Familiarity Evidence Dashboard — cierre CP-N1-C + regresión nivel 1 + CF-1
- **Proposed preamble:** N/A — `context` ya cubre el rol de preamble; no duplicar. Opcional: 2–3 oraciones de “antes de codear, orden de corrección del starter” ya están en el docstring; mantener.
- **Proposed instruction/description improvements:**  
  Ninguno estructural. Opcional (P2): en `portfolioNote`, pedir captura con CASE-ids visibles y ER/REL etiquetados (ya casi dicho). Mantener el orden sugerido 1–4 del docstring del starter.
- **Proposed retrospective:**  
  Antes de marcar listo: (1) ¿qué invariante demuestras con las 9 filas de `DECISION_MATRIX` y los scores ER≠REL del par demo? (2) ¿qué harías distinto con datos reales vs. sintéticos (PII, egress, roles viewer/reviewer)? (3) En el README, una frase de impacto medible (antes/después: cola clerical, precision reportada, demo de un comando) que puedas defender en 30 segundos en el gate N1. No declares el nivel cerrado solo porque `main()` imprime `decision_matrix_ok`.
- **Code/output changes:** none (starter DEFECTS son intencionales y correctos)
- **Validation notes:** Pair demo esperado er=1.0, rel=1.0, pseudo=`A*** Q***` tras correcciones; no alterar oráculos.

---

## Priority order

### P0 (Fixer first — every We Do)
All 24 We Do units need, in order of learner impact:
1. **`title`** corto (4–12 palabras)  
2. **`preamble`** con context / goal / success / constraints (80–150 palabras o 4 bullets)  
3. **`instruction`** reescrita como pasos de tarea (sin la plantilla “Concepto: S13-T… Entrada: fixture…”)  
4. **`retrospective`** 40–80 palabras (principio + misconception + transfer)  
5. **`feedback`** ampliado a 25–60 palabras donde hoy es un eslogan (prioridad: T1-B-E1/E3, T2-A-E1, T2-B-E2, T3-A-E2, T3-B-E2, T4-A-E2, T4-B-E2)

Suggested Fixer wave order (story dependency):  
**T1-A → T1-B → T2-A → T2-B → T3-A → T3-B → T4-A → T4-B** (E1 then E2 then E3 within each).

Highest-stakes We Do (policy / gate):  
- `S13-T1-B-E3` (FP ≠ fraude)  
- `S13-T2-A-E3` / `S13-T2-B-E3` (disclaimers)  
- `S13-T3-B-E2` (matriz de decisión)  
- `S13-T3-B-E3` (strip forbidden)  
- `S13-T4-B-E1`–`E3` (CF-1)

### P1
- All 8 **I Do**: add `preamble` + `retrospective`; expand `why` where <40 words  
- **youDo**: add `retrospective` de defensa de portfolio (context/rubric ya bastan como marco)

### P2
- Uniformar tono de hints (ya útiles; no spoilean en exceso)  
- Feedback de una línea en ejercicios “mecánicos” (E1 de pseudonymize, demo_cmd) si preamble/retrospective ya cargan la pedagogía  
- Opcional: alinear description iDo a estilo “verbo + artefacto + criterio”  
- Documentar en Fixer notes si el harness de tests ignora `print('ok', True)` del starter

---

## Residual risks

1. **Plantilla residual en instruction:** si el Fixer solo *añade* preamble y deja “Concepto: S13-T… Conserva el contrato…”, la UI seguirá leyéndose como drill. Hay que **reemplazar** instruction por pasos.  
2. **Textos exactos de test:** varios E3 dependen de strings fijos (`fp_not_fraud`, disclaimers, demo cmd, level1_regression). Preamble/retrospective pueden parafrasear; **no** “mejorar” esos strings en `solutionCode`/`tests`.  
3. **Variante vs canónico (T2-A-E2):** la prosa debe seguir etiquetando la fórmula 0.6/0.4 como variante de práctica para no contradecir teoría 0.5/0.3/0.2.  
4. **Id del archivo vs contenido:** `s13-rpa-automation` / id `rpa-automation` no describe el contenido (Evidence Dashboard). Fuera de scope del Fixer de pedagogía de ejercicios, pero confunde a agentes y a learners en URLs internas.  
5. **Carga cognitiva del You Do:** 5 DEFECTS + 9 filas + 13 de regresión es correcto para cierre N1; el retrospective debe empujar *defensa*, no más features.  
6. **Anti-aberration en Fix:** cada unidad debe reescribirse a mano; no copiar preambles entre E1/E2/E3 del mismo subtema sin recontextualizar el fade.

---

## Counts summary for Fixer

| Block | Units | preamble | title | retrospective | feedback expand |
|-------|-------|----------|-------|---------------|-----------------|
| iDo | 8 | add all | N/A | add all | N/A (expand why) |
| weDo | 24 | add all | add all | add all | ~12 priority |
| youDo | 1 | N/A (context OK) | exists | add | N/A |
| **Code/output** | — | **none required** | | | |

---

Section 13 exercise pedagogy review complete. Ready for the Fixer prompt.
