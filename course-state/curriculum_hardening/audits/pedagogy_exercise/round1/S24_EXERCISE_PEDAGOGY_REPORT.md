# S24 Exercise Pedagogy Report (Round 1)

## Section
- **title:** OCR y Document AI
- **shortTitle:** OCR Document AI
- **id:** `rpa-advanced` (archivo `s24-rpa-advanced.ts`; contenido = document intake OCR/Document AI, no RPA de escritorio clásico)
- **index:** 24
- **source:** `src/lib/course/sections/s24-rpa-advanced.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades de práctica/demo)
- **subtemas:** S24-T1-A DPI/deskew/crop · T1-B ruido/orientación · T2-A idiomas/layout/confidence · T2-B texto/tablas/KV · T3-A schema/normalización PE · T3-B cross-field/cola HITL · T4-A golden/accuracy/cobertura · T4-B privacidad/hostiles/fallback
- **hilo de caso:** document intake **CP-N2-C** (backoffice sintético de facturas/boletas Lima; artefacto S23 → preproceso → OCR conf+bbox → schema → validación → golden; `needs_review ≠ fraude`)

## Method
- Leído `PEDAGOGY_EXERCISE_SPEC.md` (campos, longitudes, checklist preamble/retrospective, fade E1→E2→E3).
- Inspeccionado manualmente cada `iDo.steps[]`, `weDo.steps[]` y `youDo` en `s24-rpa-advanced.ts` (demos ~369–525, weDo ~527–1399, youDo ~1401–1492).
- Contrastado con el hilo de la sección: facturas sintéticas PE, RUC 11 dígitos, montos con coma decimal, abstención por campo crítico, gate mime/size, sin PII real, sin label de fraude.
- **Sin** generadores, bucles, plantillas ni copy-paste mecánico entre unidades.
- Prosa propuesta en **español profesional peruano**, un objetivo primario por unidad.

## Hallazgos transversales (antes del ledger)

| Campo / hábito | Estado actual en S24 |
|----------------|----------------------|
| I Do `preamble` | **Ausente** en las 8 demos |
| I Do `retrospective` | **Ausente** en las 8 demos |
| I Do `description` | Presente y técnica (qué hace el demo); no sustituye preamble formal |
| I Do `why` | Presente; a menudo **1 frase** (bajo el piso 40–90 palabras del spec) |
| We Do `title` | **Ausente** en los 24 |
| We Do `preamble` | **Ausente** en los 24 |
| We Do `retrospective` | **Ausente** en los 24 |
| We Do `instruction` | Estilo denso “Contexto técnico + fixture + Pass: …” embebido: meta, éxito y a veces límites mezclados en un solo párrafo; legible para quien ya opera intake, **opaco** para newbie sin escena de backoffice |
| We Do `feedback` | 1–2 frases; nombra el bug (bien); poco *por qué importa al revisor HITL / al SLO de RUC* |
| Starter `# DEFECT:` | **Excelente** hábito en todos; defectos bien nombrados y alineados a la solución |
| Hints | E1 casi-solución (aceptable); E3 a veces da la fórmula casi completa (andamiaje mínimo OK) |
| You Do marco | `context` / `objectives` / `requirements` / `rubric` / `portfolioNote` / starter **sólidos** y con política fail-closed |
| You Do `retrospective` | **Ausente** |
| Código / outputs | Coherentes con theory y CP-N2-C; **no** proponer cambios de output salvo notas puntuales |

**Patrón dominante:** el andamiaje de *código* (metadata sintética, bugs nombrados, outputs canónicos, fade real E1→E3 por subtema, política `review_not_fraud`) es maduro y alineado al intake. El andamiaje *pedagógico verbal* (preamble → instruction solo-tarea → retrospective) no existe. Un true newbie no responde con claridad: qué practico, por qué importa en un batch nocturno de boletas en Lima, cómo sé que gané, qué debe quedarme al cerrar la pestaña.

**Fade E1→E2→E3 (contenido):** progresión real por subtema (p. ej. T1-A: eleva DPI → flag deskew → `preprocess_meta` compuesto; T2-A: umbral token → orden bbox → gate min-conf por campo; T3-B: mismatch simple → append reason → `validate` dual + política). **No** son tres clones con números distintos. El fade de *prosa* no se ve porque no hay preambles diferenciados.

**Severity default:** missing preamble+title+retrospective en We Do = **P0**; I Do sin preamble/retrospective = **P1** (aún tienen description+why+código); youDo sin retrospective = **P1**; polish de feedback/why = **P2** si caen preamble/instruction/retrospective.

---

## Unit ledger

### S24-T1-A-DEMO (iDo)
- **Diagnosis:** Demo sólida de preproceso sobre metadata (`dpi=72`→200, `deskew=True` con skew 2.0°). La `description` nombra el skill; falta `preamble` que diga *qué observar* (piso 200 antes del motor) y `retrospective` del misconception “el OCR solo falla por el modelo”. El `why` es una frase.
- **Checklist:** context fail · goal partial · success partial (output visible) · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Antes de culpar al motor OCR, el intake de CP-N2-C decide si la página sintética está en condiciones. En esta demo un dict de metadata (no OpenCV real) eleva el DPI al piso del lab (≥200) y marca deskew si el sesgo supera 0.5°. No escribas aún: predice `dpi` y el booleano `deskew` para un escaneo a 72 DPI con 2° de inclinación; luego compara con la salida. Si saltas el preproceso, el RUC se rompe “en el modelo” por una causa que era barata de evitar.
- **Proposed instruction/description improvements:**  
  Mantener description. Ampliar `why` (~50–70 palabras): el preproceso del lab opera sobre metadata auditable (`dpi`, `deskew`); eleva con `max` sin inventar tipografía real; el flag queda en el log para el revisor; un skew casi nulo no debe forzar deskew “por si acaso”. Puente a We Do: elevar DPI, corregir el umbral de deskew y componer crop.
- **Proposed retrospective:**  
  Si puedes explicar por qué 72 DPI se convierte en 200 *antes* de llamar al OCR, ya tienes el hábito de preflight. El error clásico es cambiar de motor sin mirar DPI/sesgo. En We Do practicarás el piso 200, el flag de deskew y el contrato compuesto de crop.
- **Code/output changes:** none
- **Validation notes:** Output `200 True` alineado a theory T1-A.

---

### S24-T1-A-E1 (weDo, guided)
- **Diagnosis:** Drill guiado claro: starter deja `dpi=96` e imprime 96. Instruction densa mezcla escena, meta y Pass; sin title, preamble ni retrospective. Feedback nombra el bug pero no ancla “por qué el batch nocturno se llena de basura”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Elevar DPI al piso de calidad 200
- **Proposed preamble:**  
  - **Contexto:** en el intake de boletas sintéticas de Lima, un escaneo a 96 DPI confunde “8” con “B” en el RUC.  
  - **Meta:** elevar el DPI efectivo al piso del lab con `max(dpi, 200)`.  
  - **Éxito:** una sola línea con el entero `200`.  
  - **Límites:** no inventes tipografía real; no imprimas etiquetas extra; no dejes 96.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: imprime `dpi` crudo (bug: deja 96).  
  2. Aplica `max(dpi, 200)`.  
  3. Imprime solo el entero resultante.  
  4. Recuerda: upscaling de metadata no crea detalle óptico real.
- **Proposed feedback improvement:**  
  `max(96, 200)` eleva al piso de OCR del lab. Dejar 96 envía tipografía pequeña rota al motor y llena la cola de RUC ilegibles; no es “falta de modelo”, es preflight omitido.
- **Proposed retrospective:**  
  El piso de DPI es barato frente a re-correr OCR. El error clásico es culpar al adapter sin mirar 96 DPI. Siguiente (E2): marcar deskew solo cuando el sesgo lo exige.
- **Code/output changes:** none
- **Validation notes:** DEFECT bien nombrado; solution y output `200` correctos.

---

### S24-T1-A-E2 (weDo, independent)
- **Diagnosis:** Bug de operador invertido (`<` vs `>=`) excelente para independiente. Instruction ya nombra umbral 0.5° y abs; falta escena de auditoría y cierre metacognitivo.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Flag deskew con umbral 0.5°
- **Proposed preamble:**  
  - **Contexto:** el revisor del batch necesita saber si se aplicó (o debió aplicar) corrección de inclinación.  
  - **Meta:** calcular `deskew_applied = abs(skew) >= 0.5` sobre skew sintético 1.2°.  
  - **Éxito:** imprime exactamente `True`.  
  - **Límites:** usa valor absoluto (sesgo negativo también cuenta); no inviertas el operador; umbral 0.5° es didáctico del lab, no norma ISO.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: `abs(skew) < 0.5` (operador invertido).  
  2. Cambia a `>= 0.5`.  
  3. Imprime solo el booleano.  
  4. No alteres el valor de `skew`.
- **Proposed retrospective:**  
  Deskew solo cuando el sesgo lo justifica; un flag falso ensucia la auditoría. Confundir `<` con `>=` es un bug silencioso de calidad. Luego (E3) unes DPI + deskew + crop en un solo contrato.
- **Code/output changes:** none
- **Validation notes:** E2 con menos migas que E1; éxito observable intacto.

---

### S24-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transferencia real a `preprocess_meta` compuesto (DPI, deskew, crop m=0.05). Instruction ya lista el Pass completo; falta anclar reutilización en el You Do y retrospective de “un solo dict auditable”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** preprocess_meta: DPI, deskew y crop
- **Proposed preamble:**  
  - **Contexto:** el document intake no llama tres scripts sueltos: necesita un dict de preproceso que el log y el test puedan auditar.  
  - **Meta:** componer elevación de DPI, flag deskew y `crop_box` con margen 5%.  
  - **Éxito:** `200 True (50, 50, 950, 950)` en una línea.  
  - **Límites:** solo metadata (no inventes píxeles); m=0.05; no dejes crop (0,0,w,h).
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: dpi crudo, deskew False, crop con m=0.  
  2. Calcula `dpi = max(..., 200)` y `deskew` con `|skew|>=0.5`.  
  3. Arma crop `(int(m*w), int(m*h), int((1-m)*w), int((1-m)*h))`.  
  4. Imprime dpi, deskew y crop en ese orden.
- **Proposed retrospective:**  
  Un contrato unificado de preproceso es lo que reutilizas en CP-N2-C. El error clásico es olvidar el crop o el flag y “arreglar” solo el DPI. Pregunta: ¿por qué el crop se registra aunque el lab no abra OpenCV?
- **Code/output changes:** none
- **Validation notes:** Transfer auténtico; alineado a theory T1-A y You Do `preprocess`.

---

### S24-T1-B-DEMO (iDo)
- **Diagnosis:** Worked example claro: `best_orientation` elige 180° por score máximo. Description OK; falta preamble de “OCR al revés con confidence alta” y retrospective del misconception “el score alto ya garantiza texto útil”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Si la página está al revés, el layout se rompe y —peor— el motor puede devolver basura con confidence engañosamente alta. En esta demo eliges la rotación de mayor score entre 0/90/180. No escribas: predice qué key gana con scores `{0:0.2, 180:0.75, 90:0.05}` y por qué no miras solo el score numérico aislado del orden pre-OCR.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: orientar es preflight obligatorio; `max(..., key=scores.get)` devuelve grados, no el score; OCR “al revés para ahorrar un paso” llena HITL de basura cara. Puente a We Do: max vs min, conteo de ruido y gate manual_orient.
- **Proposed retrospective:**  
  Orientación correcta *antes* del motor evita RUC permutados. El error clásico es confiar en conf alta de una página mal rotada. We Do: elegir max, auditar ruido y decidir auto vs manual_orient.
- **Code/output changes:** none
- **Validation notes:** Output `180` alineado a theory T1-B.

---

### S24-T1-B-E1 (weDo, guided)
- **Diagnosis:** Starter usa `min` a propósito — defect guiado perfecto. Instruction telegráfica; sin escena de batch nocturno. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Rotación de mayor score (no min)
- **Proposed preamble:**  
  - **Contexto:** el preflight de orientación del intake elige la rotación más probable antes del OCR.  
  - **Meta:** devolver la *key* (grados) del score máximo.  
  - **Éxito:** el entero `90` (no el score 0.8).  
  - **Límites:** no uses `min`; no imprimas el score; imprime solo grados.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `min(s, key=s.get)` (bug).  
  2. Cambia a `max(s, key=s.get)`.  
  3. Imprime la key entera.  
  4. Verifica mentalmente: 0.8 > 0.1 → 90°.
- **Proposed retrospective:**  
  Max score = mejor orientación candidata. Min envía la peor rotación al motor. Siguiente (E2): contar flags de ruido para el runbook de preflight.
- **Code/output changes:** none
- **Validation notes:** DEFECT claro; Pass `90` correcto.

---

### S24-T1-B-E2 (weDo, independent)
- **Diagnosis:** Bug `len` vs `sum` sobre flags de ruido — buen contrato de auditoría (no filtro real). Instruction ya advierte que no es denoise real; falta preamble de “qué mide el runbook”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Contar flags de ruido (sum, no len)
- **Proposed preamble:**  
  - **Contexto:** el runbook del batch registra cuántos píxeles sintéticos están marcados como ruido (1), no el largo del vector.  
  - **Meta:** contar flags en 1 con `sum`.  
  - **Éxito:** el entero `2` con `flags=[0,1,1,0]`.  
  - **Límites:** no uses `len(flags)`; aquí solo auditas el flag (denoise real usaría mediana/morfología).
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: imprime `len(flags)` (=4).  
  2. Cambia a `sum(flags)`.  
  3. Imprime solo el conteo.  
  4. No mutes la lista.
- **Proposed retrospective:**  
  `sum` sobre 0/1 es el contador de ruido marcado; `len` confunde longitud con calidad. Luego (E3): preflight completo con umbral de score y action.
- **Code/output changes:** none
- **Validation notes:** Contrato didáctico bien delimitado vs. filtro de imagen real.

---

### S24-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer de preflight: best rotación + score + action auto/manual_orient. Starter fuerza `ocr_now` — anti-patrón excelente. Falta preamble de fail-closed y retrospective “OCR solo después de orientar”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Preflight: rotación, score y action
- **Proposed preamble:**  
  - **Contexto:** si el mejor score de orientación es bajo, el intake prefiere un humano que gire la página antes de quemar OCR.  
  - **Meta:** elegir best + score; si score&lt;0.5 → `manual_orient`, si no `auto`.  
  - **Éxito:** `180 0.7 auto` en una línea.  
  - **Límites:** no uses min; no imprimas `ocr_now`; con score 0.7 aún rotas *antes* del motor.
- **Proposed instruction/description improvements:**  
  1. Corrige el DEFECT: `min` y action `ocr_now`.  
  2. `best = max(scores, key=scores.get)`; `score = scores[best]`.  
  3. `action = "manual_orient" if score < 0.5 else "auto"`.  
  4. Imprime best, score, action.
- **Proposed retrospective:**  
  Fail-closed de calidad: score débil → humano, no auto-OCR. Forzar OCR sin rotar llena HITL de basura. Pregunta: ¿por qué “auto” aún exige rotar a 180° antes del motor?
- **Code/output changes:** none
- **Validation notes:** Transfer alineado a theory T1-B (scores 180:0.7).

---

### S24-T2-A-DEMO (iDo)
- **Diagnosis:** Demo clara de filtro low-conf (token `20X` a 0.55). Description nombra umbral; falta preamble del anti-patrón “promediar con FACTURA 0.99” y retrospective de abstención por campo crítico.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  En el intake, un RUC a 0.55 no se “salva” porque la cabecera FACTURA tenga 0.99. Esta demo lista tokens bajo el umbral 0.85 sin inventar dígitos. Observa la salida: solo el token débil entra a low_conf. No escribas aún; predice si promediar confidences ocultaría el fallo.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: abstención por campo crítico es control de calidad; umbral didáctico 0.85; promediar oculta el dígito débil; nunca rellenes caracteres corruptos del OCR. Puente a We Do: filtrar, ordenar por bbox y gate min-conf.
- **Proposed retrospective:**  
  Low-conf se encola; no se inventa. El error clásico es promediar o “corregir” RUC a mano en el parser. We Do: umbral 0.85, orden de lectura y status review por min conf.
- **Code/output changes:** none
- **Validation notes:** Output con `20X` 0.55 correcto.

---

### S24-T2-A-E1 (weDo, guided)
- **Diagnosis:** Starter con umbral 0.5 deja pasar basura — defecto guiado ideal. Instruction mezcla umbral y list comp; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Filtrar tokens con conf ≥ 0.85
- **Proposed preamble:**  
  - **Contexto:** la autoaceptación del lab no debe tragar tokens con confidence floja.  
  - **Meta:** quedarte solo con textos cuyo conf ≥ 0.85.  
  - **Éxito:** `['A']` (B con 0.5 se filtra).  
  - **Límites:** no uses umbral 0.5; no mutes las confidences; imprime lista de text.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: filtro `>=0.5` (bug).  
  2. Cambia el umbral a `0.85`.  
  3. Imprime la list comprehension de `t['text']`.  
  4. No alteres los dicts de tokens.
- **Proposed retrospective:**  
  Umbral bajo = basura en auto. 0.85 es el contrato didáctico del lab para autoaceptación de tokens. Siguiente (E2): ordenar por bbox, no por orden de llegada del motor.
- **Code/output changes:** none
- **Validation notes:** Pass `['A']` correcto.

---

### S24-T2-A-E2 (weDo, independent)
- **Diagnosis:** Orden de lectura por `(y0,x0)` — skill real de layout. Instruction densa ya nombra el Pass; falta escena “no concatenes columnas a ciegas”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Orden de lectura por bbox (y0, x0)
- **Proposed preamble:**  
  - **Contexto:** el motor puede devolver tokens desordenados; concatenar a ciegas mezcla Total de la derecha con ítems de la izquierda.  
  - **Meta:** ordenar por `(y0, x0)` e imprimir la lista de text.  
  - **Éxito:** `['FACTURA', 'RUC', '20123456789']`.  
  - **Límites:** no uses el orden de llegada; multi-columna real necesitaría col id — aquí una columna sintética.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: imprime en orden de lista (valor primero).  
  2. Ordena con `sorted(..., key=lambda t: (t['bbox'][1], t['bbox'][0]))`.  
  3. Imprime solo los text en ese orden.  
  4. No mutes los bbox.
- **Proposed retrospective:**  
  Lectura = geometría de la página, no orden del array del adapter. Sin bbox, el parser inventa narrativa. Luego (E3): gate por min conf de campos críticos.
- **Code/output changes:** none
- **Validation notes:** Alineado a theory T2-A ordered tokens.

---

### S24-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer excelente: min conf + status + weak names; starter promedia y miente “auto”. Falta preamble del anti-patrón de dashboard verde y retrospective de “un campo débil tumba autoaceptación”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Gate por min conf y lista weak
- **Proposed preamble:**  
  - **Contexto:** en CP-N2-C un total a 0.75 no se esconde detrás de un RUC a 0.9; el intake reporta el eslabón más débil.  
  - **Meta:** calcular min conf, status review/auto y nombres weak bajo thr=0.8.  
  - **Éxito:** `0.75 review ['total']`.  
  - **Límites:** no promedies confidences; no dejes weak vacío si m&lt;thr.
- **Proposed instruction/description improvements:**  
  1. Elimina el promedio del starter.  
  2. `m = min(f['conf'] for f in fields)`.  
  3. status según m vs thr; weak = nombres con conf&lt;thr.  
  4. Imprime m, status, weak.
- **Proposed retrospective:**  
  Min (o revisión campo a campo) protege críticos; el promedio miente. Pregunta: si subes thr, ¿qué pasa con coverage_auto y con acc_ruc? Puente a T2-B: evidencia KV con bbox.
- **Code/output changes:** none
- **Validation notes:** Anti-patrón del starter pedagogically fuerte.

---

### S24-T2-B-DEMO (iDo)
- **Diagnosis:** Parse KV con strip — worked example limpio. Falta preamble de “unidad mínima de evidencia” y retrospective del espacio residual que rompe golden.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Del OCR salen líneas “Clave: valor” que alimentan el schema. En esta demo parseas RUC y Total con `split(':', 1)` y strip. Observa el dict resultante: sin strip, el valor lleva espacio y falla la comparación con el golden y la normalización. No escribas; predice las claves y valores limpios.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: el KV es la unidad mínima antes del schema; strip en ambos lados; split una vez para valores con “:”. Puente a We Do: strip, filas de tabla y evidencia con bbox del valor.
- **Proposed retrospective:**  
  Evidencia textual limpia es el puente al schema. El espacio residual es un bug silencioso de golden. We Do: parse con strip, contar filas de datos y adjuntar bbox.
- **Code/output changes:** none
- **Validation notes:** Output dict RUC/Total correcto.

---

### S24-T2-B-E1 (weDo, guided)
- **Diagnosis:** Starter sin strip — defecto clásico y útil. Instruction ya nombra el Pass; sin title/preamble/retrospective ni ancla al golden.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Parse KV con strip en clave y valor
- **Proposed preamble:**  
  - **Contexto:** una línea OCR `Total: 12.5` no debe dejar el valor con espacio inicial.  
  - **Meta:** separar con `split(':', 1)`, strip y imprimir clave y valor.  
  - **Éxito:** `Total 12.5` (sin dos puntos ni espacio residual).  
  - **Límites:** no omitas strip; corta solo en el primer `:`.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `print(k, v)` sin strip.  
  2. Aplica `k.strip()` y `v.strip()`.  
  3. Imprime k y v.  
  4. No rearmes la línea con `:` en la salida.
- **Proposed retrospective:**  
  Sin strip, normalización y golden fallan por un espacio invisible. Siguiente (E2): no contar el header de tabla como ítem de factura.
- **Code/output changes:** none
- **Validation notes:** Pass `Total 12.5` correcto.

---

### S24-T2-B-E2 (weDo, independent)
- **Diagnosis:** `len(t)-1` vs `len(t)` — bug de negocio silencioso (infla sumas vs total). Instruction correcta; falta escena de validación cross-field.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Filas de datos sin contar el header
- **Proposed preamble:**  
  - **Contexto:** en la validación `sum(líneas)≈total`, contar el header como ítem infla la suma y manda a revisión por error de parsing.  
  - **Meta:** reportar filas de datos = `len(t)-1`.  
  - **Éxito:** el entero `1` con tabla de header + una fila.  
  - **Límites:** no cuentes la fila 0; no imprimas 2.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: `len(t)` incluye header.  
  2. Cambia a `len(t)-1`.  
  3. Imprime solo ese entero.  
  4. No mutes la tabla.
- **Proposed retrospective:**  
  Header ≠ ítem de negocio. Confundirlos crea `total_mismatch` falsos. Luego (E3): armar fields con bbox del valor para el revisor.
- **Code/output changes:** none
- **Validation notes:** Alineado a theory T2-B `n_data_rows`.

---

### S24-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer de evidencia: (name, value, bbox) ordenado; starter solo valores. Falta preamble “el revisor resalta el rectángulo del valor” y retrospective de evidencia mínima.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Fields KV con bbox del valor
- **Proposed preamble:**  
  - **Contexto:** en HITL el humano necesita el rectángulo del *número*, no solo el label “RUC” en negrita.  
  - **Meta:** parsear líneas, adjuntar bbox del valor y listar tuplas ordenadas por name.  
  - **Éxito:** `[('RUC', '20123456789', [0, 0, 10, 10]), ('Total', '150.00', [0, 20, 40, 30])]`.  
  - **Límites:** no omitas bbox; no desordenes; no inventes coords si falta clave.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: solo imprime valores strip.  
  2. Por cada línea: split, strip, append `(k, v, bboxes[k])`.  
  3. Ordena por name e imprime.  
  4. No uses solo el bbox del label.
- **Proposed retrospective:**  
  Evidencia = valor + bbox + (luego) conf. Sin bbox el revisor no resalta. Pregunta: ¿qué se pierde si guardas solo el texto del label? Puente a T3: normalizar al schema PE.
- **Code/output changes:** none
- **Validation notes:** Contrato de evidencia alineado a callout theory T2-B.

---

### S24-T3-A-DEMO (iDo)
- **Diagnosis:** Normalización RUC a dígitos + ok longitud 11. Description clara; falta preamble de “no rellenar ceros” y retrospective del misconception “cualquier 11 dígitos es RUC válido”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  El schema del intake no acepta `20.123456789` crudo: limpia separadores y valida longitud 11. En esta demo ves el par `(dígitos, ok)`. Observa que no se inventan ceros si faltan dígitos. No escribas; predice el string limpio y si `ok` es True.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: schema canónico evita basura en validación y golden; len≠11 es fallo, no pad; (nota: esta demo no rechaza letras — la theory y E3 sí con `None`). Puente a We Do: limpieza, fecha PE e ISO, y norm_total con coma decimal.
- **Proposed retrospective:**  
  Solo dígitos + longitud fija es el contrato mínimo de RUC. Inventar dígitos es el anti-patrón prohibido. We Do: limpiar, formatear fecha day-first y montos PE.
- **Code/output changes:** none (opcional nota Fixer: demo no cubre letras→None; theory sí — coherente con E1 parcial vs E3 completo)
- **Validation notes:** Output `20123456789 True` correcto para el scope del demo.

---

### S24-T3-A-E1 (weDo, guided)
- **Diagnosis:** Limpieza parcial de guiones sin validar len 11 — scope E1 correcto. Instruction densa; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Limpiar no-dígitos del RUC parcial
- **Proposed preamble:**  
  - **Contexto:** el OCR devuelve guiones y puntos en identificadores; el parser limpia antes del schema completo.  
  - **Meta:** dejar solo dígitos con `re.sub(r'\D', '', s)`.  
  - **Éxito:** `20123` a partir de `20-123`.  
  - **Límites:** aquí no validas longitud 11; no imprimas el string con guiones.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: imprime `s` crudo.  
  2. Aplica `re.sub(r'\D', '', s)`.  
  3. Imprime el string limpio.  
  4. No añadas validación de len en este ejercicio.
- **Proposed retrospective:**  
  Separadores benignos se quitan; la validación de 11 dígitos viene después. Siguiente (E2): fechas de boleta PE day-first → ISO.
- **Code/output changes:** none
- **Validation notes:** Scope E1 bien acotado vs. E3.

---

### S24-T3-A-E2 (weDo, independent)
- **Diagnosis:** Formato US vs PE en fecha — defecto de dominio excelente. Instruction ya nombra el Pass; falta escena “día 15 inválido como mes”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Fecha boleta PE a ISO (day-first)
- **Proposed preamble:**  
  - **Contexto:** en boletas peruanas `15/01/2026` es día/mes/año; el formato US invierte o falla.  
  - **Meta:** parsear con `%d/%m/%Y` y emitir ISO `YYYY-MM-DD`.  
  - **Éxito:** `2026-01-15`.  
  - **Límites:** no uses `%m/%d/%Y`; no hardcodees la cadena ISO.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: `strptime` con formato US (bug).  
  2. Cambia a `%d/%m/%Y`.  
  3. Encadena `.date().isoformat()`.  
  4. Imprime solo la fecha ISO.
- **Proposed retrospective:**  
  Locale de fecha es contrato de schema, no detalle cosmético. Mes 15 no existe: el bug US revienta o miente. Luego (E3): RUC 11 + total PE en un solo paso.
- **Code/output changes:** none
- **Validation notes:** Defecto US→PE muy alineado a theory T3-A.

---

### S24-T3-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer de dominio PE: norm_ruc + norm_total; starter borra comas a ciegas (15000.0). Falta preamble del veneno contable y retrospective “coma ≠ miles”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Schema PE: RUC 11 y total con coma
- **Proposed preamble:**  
  - **Contexto:** `150,00` en una factura peruana es ciento cincuenta soles, no quince mil.  
  - **Meta:** normalizar RUC a 11 dígitos (o None) y total PE a float.  
  - **Éxito:** `20123456789 150.0`.  
  - **Límites:** no uses `replace(',', '')` a ciegas; no padees ceros en RUC; letras → None (política del lab).
- **Proposed instruction/description improvements:**  
  1. Corrige el DEFECT de borrar comas del total.  
  2. Implementa `norm_ruc` (letras→None; len==11).  
  3. Implementa `norm_total` PE: coma→punto (y miles+decimal si aplica).  
  4. Imprime ruc y total normalizados.
- **Proposed retrospective:**  
  Locale PE en montos es gate de calidad del intake. Borrar comas envenena cross-field y golden. Pregunta: ¿por qué `None` en RUC corrupto es mejor que 11 dígitos “plausibles”?
- **Code/output changes:** none
- **Validation notes:** Starter anti-patrón 15000.0 pedagogically excelente.

---

### S24-T3-B-DEMO (iDo)
- **Diagnosis:** Cross-field simple total vs líneas → `ok`. Description nombra needs_review; falta preamble “el producto es la cola, no la acusación” y retrospective del anti-label fraud.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Cuando la suma de líneas no cuadra con el total, el intake no acusa fraude: encola revisión. En esta demo la comparación con tolerancia 0.01 devuelve `ok` para 150 vs [100, 50]. Observa el contrato: status de calidad, no veredicto legal. No escribas; predice qué devolverías si las líneas sumaran 140.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: tolerancia monetaria 0.01; status ok/needs_review; nunca `auto_fraud` desde OCR; el producto es HITL con reasons. Puente a We Do: mismatch, append de reasons y validate completo.
- **Proposed retrospective:**  
  Discrepancia contable ≠ fraude. El error clásico es emitir label de riesgo desde un mismatch de OCR. We Do: status condicional, reasons[] y política review_not_fraud.
- **Code/output changes:** none
- **Validation notes:** Output `ok` correcto; scope reducido vs. theory multi-reason.

---

### S24-T3-B-E1 (weDo, guided)
- **Diagnosis:** Starter siempre `auto` — anti-patrón de producto. Instruction ya prohíbe fraud; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Mismatch de total → needs_review
- **Proposed preamble:**  
  - **Contexto:** 4+5=9 frente a total 10 es una discrepancia que el batch debe encolar, no autoaceptar.  
  - **Meta:** comparar `abs(sum(lines)-total)` con umbral 0.01.  
  - **Éxito:** la cadena `needs_review`.  
  - **Límites:** nunca imprimas `fraud`; no fuerces siempre `auto`.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: imprime `'auto'` fijo (bug).  
  2. Calcula si la diferencia supera 0.01.  
  3. Imprime `needs_review` o `auto` según el caso.  
  4. Con el fixture dado debe ser needs_review.
- **Proposed retrospective:**  
  Autoaceptar siempre es el anti-patrón del starter. La cola es el producto de calidad. Siguiente (E2): acumular reasons sin crashear el batch.
- **Code/output changes:** none
- **Validation notes:** Pass `needs_review` correcto.

---

### S24-T3-B-E2 (weDo, independent)
- **Diagnosis:** Append `ruc_missing` — skill de traza HITL. Instruction correcta; falta escena “excepción vs reasons[]”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Acumular reason ruc_missing
- **Proposed preamble:**  
  - **Contexto:** el revisor necesita una lista de reasons, no un crash del worker nocturno.  
  - **Meta:** si `ruc is None`, append `'ruc_missing'` e imprimir la lista.  
  - **Éxito:** `['ruc_missing']`.  
  - **Límites:** no lances excepción; no dejes `[]` vacío; no inventes otros codes aquí.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: imprime `reasons` vacío.  
  2. Añade el `if ruc is None: reasons.append(...)`.  
  3. Imprime la lista.  
  4. No uses `raise`.
- **Proposed retrospective:**  
  Reasons[] es la traza auditable del documento. Silenciar con lista vacía oculta el fallo. Luego (E3): varias rules + status + política explícita.
- **Code/output changes:** none
- **Validation notes:** Alineado a fail-closed de batch throughput.

---

### S24-T3-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer fuerte: validate dual docs + `review_not_fraud`; starter etiqueta fraud tres veces. Falta preamble de política de producto y retrospective de conf ausente vs low conf.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** validate dual y política review_not_fraud
- **Proposed preamble:**  
  - **Contexto:** CP-N2-C exige status + reasons por documento y una política escrita: revisión ≠ fraude.  
  - **Meta:** implementar `validate` (total_mismatch, ruc_missing, ruc_low_conf / ruc_conf_missing) sobre d1 y d2.  
  - **Éxito:** tres líneas — `('auto', [])`, needs_review con tres reasons, y `review_not_fraud`.  
  - **Límites:** conf ausente no es 1.0; nunca imprimas fraud; acumula reasons.
- **Proposed instruction/description improvements:**  
  1. Reemplaza los tres `print("fraud")`.  
  2. Implementa `validate(doc)` con las rules del lab.  
  3. Evalúa d1 (cuadra) y d2 (mismatch + ruc None + conf 0.5).  
  4. Imprime la política `review_not_fraud` al final.
- **Proposed retrospective:**  
  Acumular reasons y encolar es el contrato de producto. Etiquetar fraud desde OCR es el anti-patrón prohibido del curso. Pregunta: ¿qué reason usas si falta `conf_ruc` del todo?
- **Code/output changes:** none
- **Validation notes:** Output canónico de tres líneas alineado a theory T3-B.

---

### S24-T4-A-DEMO (iDo)
- **Diagnosis:** field_accuracy 0.5 sobre mini golden. Description OK; falta preamble “accuracy por campo ≠ coverage_auto” y retrospective del dashboard verde engañoso.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Un golden sintético de dos predicciones (una acierta, una falla) produce accuracy 0.5. Esta demo mide pred==true por fila, no un accuracy global opaco. Observa: no se reporta cobertura HITL aquí — son métricas distintas. No escribas; predice el float de salida.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: exact match por campo crítico; un accuracy global esconde fallos de RUC; coverage_auto se mide aparte. Puente a We Do: accuracy, field_acc RUC y par acc+coverage.
- **Proposed retrospective:**  
  Mide el campo caro (RUC/total), no solo “el modelo se ve bien”. We Do: correct/n, acc por campo y el par 0.5 / 0.7 del lab.
- **Code/output changes:** none
- **Validation notes:** Output `0.5` correcto.

---

### S24-T4-A-E1 (weDo, guided)
- **Diagnosis:** Starter calcula error rate en vez de accuracy — defecto conceptual limpio. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints fail · retrospective fail
- **Severity:** P0
- **Proposed title:** Accuracy = correct / n (no error rate)
- **Proposed preamble:**  
  - **Contexto:** el lab reporta exactitud de campo, no la tasa de error, para el dashboard de CP-N2-C.  
  - **Meta:** imprimir `correct/n` como float.  
  - **Éxito:** `0.75` con correct=3, n=4.  
  - **Límites:** no uses `(n-correct)/n`; no hardcodees sin dividir.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: imprime la tasa de error.  
  2. Cambia a `correct / n`.  
  3. Imprime el float.  
  4. No alteres correct ni n.
- **Proposed retrospective:**  
  Accuracy y error rate suman 1, pero el contrato del lab pide accuracy. Confundirlas miente al SLO. Siguiente (E2): medir por filas de RUC pred vs true.
- **Code/output changes:** none
- **Validation notes:** Pass `0.75` correcto (ejemplo abstracto, no el golden de 2 docs).

---

### S24-T4-A-E2 (weDo, independent)
- **Diagnosis:** Hardcode 1.0 vs medir golden — anti-patrón de dashboard. Instruction correcta; falta anclar honestidad de métrica.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Accuracy de RUC sobre filas del golden
- **Proposed preamble:**  
  - **Contexto:** hardcodear 1.0 “porque el OCR se ve bien” miente al reporte de CP-N2-C.  
  - **Meta:** fracción de filas con `ruc_pred == ruc_true`.  
  - **Éxito:** `0.5` (1 de 2).  
  - **Límites:** no hardcodees 1.0; mide el golden del starter.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: `print(1.0)`.  
  2. Cuenta coincidencias pred/true y divide por `len(rows)`.  
  3. Imprime el float.  
  4. No mutes las filas.
- **Proposed retrospective:**  
  La métrica se calcula sobre el golden, no se declara. Luego (E3): reportar acc_ruc *y* coverage_auto juntos.
- **Code/output changes:** none
- **Validation notes:** Alineado a callout “reporta el par”.

---

### S24-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Transfer del par métrico del lab (0.5 0.7); starter hardcodea acc y usa review rate. Falta preamble del anti-patrón “subir coverage bajando umbral”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Par acc_ruc y coverage_auto
- **Proposed preamble:**  
  - **Contexto:** coverage alta con RUC basura en auto es un dashboard verde mentiroso.  
  - **Meta:** calcular acc_ruc sobre golden de 2 filas y coverage_auto = auto/(auto+review).  
  - **Éxito:** `0.5 0.7` en una línea.  
  - **Límites:** no uses review rate; no hardcodees acc; no sustituyas accuracy por cobertura.
- **Proposed instruction/description improvements:**  
  1. Elimina el hardcode 1.0 y el `review/(auto+review)`.  
  2. Mide acc_ruc con pred==true.  
  3. `coverage_auto = auto / (auto + review)`.  
  4. Imprime ambos floats.
- **Proposed retrospective:**  
  Accuracy de críticos y cobertura HITL son métricas hermanas, no intercambiables. Pregunta: si bajas el umbral de conf, ¿qué pasa con cada una? Puente a T4-B: gate hostil antes del motor.
- **Code/output changes:** none
- **Validation notes:** Mismos números que theory golden_eval (acc 0.5, coverage 0.7).

---

### S24-T4-B-DEMO (iDo)
- **Diagnosis:** Gate mime+size acepta PDF pequeño. Description OK; falta preamble “capa 1 antes del motor” y retrospective de spoof de extensión.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed preamble:**  
  Antes de gastar CPU en OCR, el intake admite o rechaza por mime allowlist y tope de bytes (capa 1). En esta demo un PDF de 100 bytes pasa. Observa: no es antivirus ni capa 2 de firmas mágicas. No escribas; predice el status `ok` y qué pasaría con un zip.
- **Proposed instruction/description improvements:**  
  Ampliar `why`: allowlist pdf/png/jpeg; tope 5e6; mime del caller es spoofable en prod; capa 1 ≠ seguridad completa. Puente a We Do: reject zip, reject size, fallback human_rescan.
- **Proposed retrospective:**  
  Gate temprano protege al worker. Confiar en la extensión del nombre es frágil. We Do: reject mime, reject size y ocr_fail → human_rescan.
- **Code/output changes:** none
- **Validation notes:** Output `ok` correcto.

---

### S24-T4-B-E1 (weDo, guided)
- **Diagnosis:** Ramas invertidas aceptan zip — defect de seguridad didáctico excelente. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Rechazar mime zip en el gate
- **Proposed preamble:**  
  - **Contexto:** un zip en el intake de facturas no debe llegar al worker OCR.  
  - **Meta:** fail-closed si mime no está en {pdf, png, jpeg}.  
  - **Éxito:** la cadena `reject`.  
  - **Límites:** no confíes en la extensión del archivo; no inviertas las ramas ok/reject.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: imprime `ok` cuando mime *no* está en allowed (bug).  
  2. Invierte la lógica: `reject` si `mime not in allowed`.  
  3. Imprime solo el status.  
  4. No cambies el set allowed.
- **Proposed retrospective:**  
  Zip fuera de allowlist = reject en admisión. Aceptar hostiles quema el worker. Siguiente (E2): tope de tamaño 5e6.
- **Code/output changes:** none
- **Validation notes:** Anti-patrón de ramas invertidas muy claro.

---

### S24-T4-B-E2 (weDo, independent)
- **Diagnosis:** Umbral de tamaño invertido — paralelo al E1 de mime. Instruction correcta; falta escena DoS/zip-bomb.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Rechazar archivo sobre el tope 5e6
- **Proposed preamble:**  
  - **Contexto:** 6_000_000 bytes superan el tope didáctico y amenazan al worker (DoS / zip-bomb).  
  - **Meta:** imprimir `reject` si n supera 5_000_000.  
  - **Éxito:** `reject`.  
  - **Límites:** no inviertas ok/reject; no cambies el tope del lab.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: `ok` cuando n es grande (bug).  
  2. Cambia a `reject` si `n > 5_000_000`.  
  3. Imprime el status.  
  4. No uses otro umbral.
- **Proposed retrospective:**  
  Size cap es capa 1 de admisión, barata y obligatoria. Invertir el umbral abre la puerta al abuso. Luego (E3): componer mime + size + fallback ocr_fail.
- **Code/output changes:** none
- **Validation notes:** Alineado a theory MAX_BYTES.

---

### S24-T4-B-E3 (weDo, transfer)
- **Diagnosis:** Transfer de pipeline de admisión + fallback; starter imprime `continue` siempre. Falta preamble de orden de gates y retrospective “no reintentar 100 veces un PDF roto”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Gate mime/size y fallback human_rescan
- **Proposed preamble:**  
  - **Contexto:** el intake aplica admisión antes del motor; si el OCR falla sobre un binario corrupto, cae a reescaneo humano.  
  - **Meta:** zip→reject; pdf 9e6→reject; pdf 100k con ocr_fail→human_rescan.  
  - **Éxito:** tres líneas `reject` / `reject` / `human_rescan`.  
  - **Límites:** no imprimas `continue`; no reintentes OCR en bucle; orden mime → size → fallback.
- **Proposed instruction/description improvements:**  
  1. Reemplaza el loop que imprime `continue`.  
  2. Si mime no allowed → reject.  
  3. Elif n > MAX_N → reject.  
  4. Elif status_ocr == ocr_fail → human_rescan; else ok.
- **Proposed retrospective:**  
  Hostiles se cortan en admisión; ocr_fail no se castiga con reintentos infinitos. Pregunta de cierre: ¿por qué human_rescan es mejor que “seguir el batch a ciegas”? Puente al You Do: gate_file ya scaffolded.
- **Code/output changes:** none
- **Validation notes:** Output de tres líneas canónico; alineado a theory T4-B.

---

### youDo (You Do project)
- **Diagnosis:** Marco de proyecto **sólido**: context con pasos 1–5, objectives, requirements (PE, bbox, review≠fraude, conf ausente), rubric, starter con stubs y política. Falta `retrospective` de defensa post-build (spec §8.3). Un newbie que termina el script no se le pide explicitar invariantes, PII sintético vs real, ni frase de impacto medible.
- **Checklist:** context pass · goal pass · success pass (criterio de aceptación en context) · constraints pass · retrospective **fail**
- **Severity:** P1
- **Proposed title:** (ya existe) Intake OCR sintético (document intake CP-N2-C)
- **Proposed preamble:** N/A — `context` ya cubre escena y criterios; no duplicar ensayo. Opcional micro-refuerzo en Fixer solo si se unifica schema de campos.
- **Proposed instruction/description improvements:**  
  Mantener context/objectives/requirements/rubric. Asegurar que el Fixer no diluya: bbox del valor, norm_total PE, norm_ruc letras→None, conf_ruc ausente→ruc_conf_missing, sin label fraud.
- **Proposed retrospective:**  
  Antes de marcar listo: (1) ¿qué invariante demuestras con un print o test (p. ej. `150,00`→150.0 y RUC con letra→None)? (2) ¿qué harías distinto con PDFs reales de clientes vs. fixtures sintéticos (PII, minimización, gate)? (3) Escribe en el README una frase de impacto medible (p. ej. “acc_ruc X, coverage_auto Y, N docs en needs_review sin label de fraude”) que puedas defender en 30 segundos en entrevista de backoffice/ops data.
- **Code/output changes:** none
- **Validation notes:** Starter y rúbrica ya alineados a CP-N2-C; solo falta cierre metacognitivo.

---

## Priority order

### P0 (We Do: title + preamble + instruction solo-tarea + retrospective; feedback si queda corto)
1. **S24-T1-A-E1, E2, E3** — preproceso DPI / deskew / preprocess_meta  
2. **S24-T1-B-E1, E2, E3** — orientación max / ruido / preflight action  
3. **S24-T2-A-E1, E2, E3** — umbral conf / orden bbox / gate min+weak  
4. **S24-T2-B-E1, E2, E3** — strip KV / filas datos / evidencia bbox  
5. **S24-T3-A-E1, E2, E3** — limpia RUC / fecha PE / schema PE total  
6. **S24-T3-B-E1, E2, E3** — mismatch / reasons / validate + review_not_fraud  
7. **S24-T4-A-E1, E2, E3** — accuracy / field RUC / par acc+coverage  
8. **S24-T4-B-E1, E2, E3** — mime / size / gate+human_rescan  

### P1
- **Todas las 8 iDo demos:** añadir `preamble` + `retrospective`; alargar `why` al rango 40–90 palabras.  
- **youDo:** añadir `retrospective` de defensa (invariante, PII, frase de impacto).

### P2
- Pulir `feedback` We Do hacia *razonamiento de producto* (HITL, SLO RUC, fail-closed) donde quede en 1 frase telegráfica tras el fix P0.  
- Revisar hints E3 que casi dan la solución completa (opcional: una miga menos sin romper el transfer).  
- Nota de coherencia: demo T3-A no modela letras→None (sí theory/E3); documentar en Fixer si se unifica el demo.

---

## Residual risks

1. **Carga verbal en transfer E3:** las instructions actuales ya son densas; el Fixer debe *mover* contexto al preamble e *acortar* instruction a pasos, no apilar otro ensayo encima.  
2. **Política fraud:** el contenido de código ya la enseña bien; sin retrospective el hábito “mismatch = fraude” puede sobrevivir en la cabeza del newbie.  
3. **Locale PE en montos:** E3 T3-A es el único que fuerza el bug 15000.0; si el Fixer acorta mal la instruction, se pierde el mensaje de dominio.  
4. **Capa 1 vs seguridad real:** el gate mime es spoofable; preambles deben mantener la honestidad “capa 1 didáctica”, no vender antivirus.  
5. **You Do sin retrospective:** el proyecto es el artefacto de portafolio; sin cierre de defensa, el learner no ensaya el pitch de entrevista.  
6. **Sin cambios de output propuestos:** el Fixer no debe “mejorar” prints canónicos sin execute-and-diff; el andamiaje de código está sano.

---

## Summary counts

| Tipo | N | Con preamble hoy | Con retrospective hoy | Con title hoy | Severidad dominante |
|------|---|------------------|----------------------|---------------|---------------------|
| iDo  | 8 | 0 | 0 | N/A | P1 |
| weDo | 24 | 0 | 0 | 0 | P0 |
| youDo | 1 | N/A (context OK) | 0 | OK | P1 |

**Código/starter/solutions:** maduros; campaña de Round 1 Fix = campos pedagógicos, no reescritura de lógica.

---

Section 24 exercise pedagogy review complete. Ready for the Fixer prompt.
