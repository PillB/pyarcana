# S40 Exercise Pedagogy Report (Round 1)

## Section
- **title:** Arquitectura, DDD y decisiones técnicas
- **shortTitle:** Arquitectura y DDD
- **id:** `agentic-architecture`
- **index:** 40
- **source:** `src/lib/course/sections/s40-agentic-architecture.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades de práctica/demo)
- **subtemas:** S40-T1-A FR + quality attributes · T1-B trade-offs / residual · T2-A capas / cohesión · T2-B ports/adapters DIP · T3-A bounded contexts / ACL · T3-B entity / VO / servicio · T4-A C4 + ADR · T4-B evolución aditiva / deuda
- **hilo de caso:** dossier **CP-N4-A** (Red Andina, Lima sintético) con fixture **CASO-LIM-040**; mapa intake → ER → grafo → triage → reporting → IA auxiliar; trío **medida + dueño + consecuencia**; stdlib only; sin orquestación de agentes LLM ni PII real

## Method
- Leído `PEDAGOGY_EXERCISE_SPEC.md` (campos, longitudes 80–150 preamble / 40–80 retrospective / 40–100 instruction, checklist context/goal/success/constraints, fade E1→E2→E3).
- Inspeccionado manualmente cada `iDo.steps[]` (8 demos, ~353–576), `weDo.steps[]` (24 ejercicios, ~578–1914) y `youDo` (~1917–2037) en `s40-agentic-architecture.ts`.
- Contrastado con theory T1–T4: escenarios QA medibles → trade-off min_score → capas sin saltos → DIP → context map ACL → entity/VO → C4/ADR → consumer contract aditivo.
- **Sin** generadores, bucles, plantillas ni copy-paste mecánico entre unidades.
- Prosa propuesta en **español profesional peruano**, un objetivo primario por unidad.
- Nota: el andamiaje de *código* (DEFECT nombrados, fixtures CASO-LIM-040-*, outputs canónicos, fade E1 fix → E2 assess → E3 decide fail-closed) es maduro y alineado a theory; los campos `preamble` / `title` / `retrospective` **no existen** en el source (0 matches).

## Hallazgos transversales (antes del ledger)

| Campo / hábito | Estado actual en S40 |
|----------------|----------------------|
| I Do `preamble` | **Ausente** en las 8 demos |
| I Do `retrospective` | **Ausente** en las 8 demos |
| I Do `description` | Presente y técnica (qué calcula el demo); no sustituye preamble (escena + qué observar) |
| I Do `why` | Presente; ~1–3 frases densas; a menudo **bajo o al borde** del piso 40–90 palabras |
| We Do `title` | **Ausente** en los 24 |
| We Do `preamble` | **Ausente** en los 24 |
| We Do `retrospective` | **Ausente** en los 24 |
| We Do `instruction` | Densa y **técnicamente excelente**: nombra DEFECT, fixture, gate y salida exacta; **mezcla** contexto + meta + éxito + límites en un solo bloque — legible para quien ya diseña plataformas, **opaco** para un newbie sin escena de dossier |
| We Do `feedback` | Presente en los 24; nombra el contrato del gate (bien); a menudo 1 frase; poco *por qué importa en Red Andina / Lima* ni metacognición |
| Starter `# DEFECT:` | **Excelente** en todos; defectos bien nombrados (comparación invertida, max vs min, solape de glosarios, currency==entity_id, draft incompleto, subconjunto invertido) |
| Hints | E1 casi-solución (aceptable guiado); E2/E3 con menos migas; fade real de andamiaje de código |
| You Do marco | `context` / `objectives` / `requirements` / `rubric` / `portfolioNote` / starter con plantillas QA/context map/C4/ADRs **sólidos** y alineados a CP-N4-A |
| You Do `retrospective` | **Ausente** |
| Código / outputs | Coherentes con theory y CASO-LIM-040; **no** proponer cambios de output salvo notas puntuales |

**Patrón dominante:** el andamiaje de *código* (fixtures sintéticos, bugs nombrados, outputs canónicos, progresión E1 corrección de predicado → E2 tabla valid/invalid/missing → E3 CONTINUE/breach/REQUEST_*, gates con códigos de error de oficio) es de referencia para Master. El andamiaje *pedagógico verbal* (preamble → instruction solo-tarea → retrospective) no existe. Un true newbie no responde con claridad: qué practico, por qué importa en un dossier de arquitectura de Lima, cómo sé que gané, qué debe quedarme al cerrar la pestaña.

**Fade E1→E2→E3 (contenido):** progresión real por subtema (p. ej. T1-A: comparación observed≤target → assess de tres fixtures → decide CONTINUE/REJECT_QA_SCENARIO/REQUEST_QA_OWNER; T2-B: flag implements_port → assess DIP → DEFINE_PORT_CONTRACT). **No** son tres clones con números distintos. El fade de *prosa* no se ve porque no hay preambles diferenciados.

**Severity default:** missing title+preamble+retrospective en We Do = **P0**; I Do sin preamble/retrospective = **P1** (aún tienen description+why+código); youDo sin retrospective = **P1**; polish de feedback/why = **P2** si caen preamble/instruction/retrospective.

---

## Unit ledger

### S40-T1-A-DEMO (iDo)
- **Diagnosis:** Demo sólida de escenario QA: campos completos, `observed_ms` 250 ≤ `target_ms` 300, dueño `platform`, entorno `peak_lima`. La `description` nombra el skill; falta `preamble` que diga *qué observar* (umbral + dueño, no el adjetivo «rápido») y `retrospective` del misconception “un SLA se escribe con adjetivos”. El `why` es denso pero corto.
- **Checklist:** context fail · goal partial · success partial (output visible) · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Antes de promover un trade-off en el dossier de Red Andina (CASO-LIM-040), el arquitecto necesita un **escenario de quality attribute** auditable, no un adjetivo. En esta demo un pico de 100 req/s en intake de Lima sintético trae latencia p95 observada 250 ms frente a un target de 300, con dueño `platform`. No escribas aún: predice si el escenario sale `complete True` y por qué sin `owner` o sin umbral el gate no deja pasar. Observa las tres líneas de salida.
- **Proposed instruction/description improvements:**  
  Mantener description. Ampliar `why` (~50–70 palabras): un QA medible exige fuente, estímulo, entorno, respuesta, observed vs target y dueño contactable; «rápido» o «escalable» no son contratos; el gate de S40-T1-A rechaza escenarios incompletos; el caso es sintético sin PII. Puente a We Do: corregir la comparación invertida observed ≥ target.
- **Proposed retrospective:**  
  Si puedes explicar por qué un escenario sin dueño no es auditable sin mirar el código, ya tienes el hábito de medida + dueño. El error clásico es prometer «bajo latencia» sin umbral numérico. En We Do practicarás el predicado observed ≤ target y el rechazo del adverso.
- **Code/output changes:** none
- **Validation notes:** Output `complete True` / `attr latency_p95_ms` / `owner platform` alineado a theory T1-A.

---

### S40-T1-A-E1 (weDo, guided)
- **Diagnosis:** Drill guiado claro: starter invierte `observed_ms >= target_ms`. Instruction densa mezcla DEFECT, contrato y salida; sin title, preamble ni retrospective. Feedback nombra el PASS pero no ancla “por qué el dossier de Lima miente si la comparación va al revés”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Latencia en budget con dueño
- **Proposed preamble:**  
  - **Contexto:** en CASO-LIM-040-1A el dossier de Red Andina exige un escenario QA con latencia p95 bajo umbral y dueño de plataforma.  
  - **Meta:** corregir el predicado de contrato (observed ≤ target y owner truthy).  
  - **Éxito:** una línea `S40-T1-A PASS`.  
  - **Límites:** no mutes el fixture; no inventes PII; el DEFECT está en la comparación, no en los datos.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `meets_contract` usa `observed_ms >= target_ms` (DEFECT).  
  2. Cámbialo a `observed_ms <= target_ms` y exige `bool(owner)`.  
  3. Conserva el print de status.  
  4. Debe imprimir `S40-T1-A PASS`.
- **Proposed feedback improvement:**  
  Con observed 280 y target 300 el contrato es True solo si la comparación es ≤. Si invertiste a ≥, el happy path falla y el adverso de E2 «parece» válido: el gate de QA se vuelve inútil.
- **Proposed retrospective:**  
  Umbral medible + dueño contactable es el mínimo de un QA. El error clásico es invertir observed/target o omitir el owner. Siguiente (E2): enrutar válido, latencia rota y owner ausente.
- **Code/output changes:** none
- **Validation notes:** DEFECT bien nombrado; solution y output `S40-T1-A PASS` correctos.

---

### S40-T1-A-E2 (weDo, independent)
- **Diagnosis:** Independiente fuerte: tres rutas PASS / REJECT_QA_SCENARIO / MISSING:owner. Instruction ya lista salidas; falta escena de “schema antes que contenido” y cierre metacognitivo. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de escenario QA
- **Proposed preamble:**  
  - **Contexto:** el gate del dossier no solo mira el dict: primero exige campos, luego mide latencia.  
  - **Meta:** implementar `assess` que separe válido, adverso (410 ms) y sin owner.  
  - **Éxito:** `PASS REJECT_QA_SCENARIO MISSING:owner`.  
  - **Límites:** calcula `missing` antes de leer owner; no rellenes owner; datos sintéticos CASO-LIM-040-1A.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: PASS si `observed_ms >= target_ms` (DEFECT).  
  2. Corrige a observed ≤ target y owner truthy.  
  3. Conserva la rama MISSING por campos ausentes.  
  4. Imprime las tres salidas en orden.
- **Proposed retrospective:**  
  Schema (MISSING) se evalúa antes que contenido (REJECT). El error clásico es acceder a owner cuando falta y tumbar el flujo. Luego (E3): CONTINUE / REJECT / REQUEST en lugar de PASS genérico.
- **Code/output changes:** none
- **Validation notes:** E2 con menos migas que E1; output canónico intacto.

---

### S40-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transferencia real al fallo cerrado: CONTINUE / REJECT_QA_SCENARIO / REQUEST_QA_OWNER. Starter trata missing como CONTINUE y pred invertido. Instruction ya nombra las rutas; falta anclar reutilización en You Do y retrospective “ausencia ≠ breach”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Fail-closed: CONTINUE o REQUEST_QA_OWNER
- **Proposed preamble:**  
  - **Contexto:** en plataforma de Red Andina no se inventa un dueño de QA cuando falta: se pide evidencia.  
  - **Meta:** decidir CONTINUE / REJECT_QA_SCENARIO / REQUEST_QA_OWNER.  
  - **Éxito:** `CONTINUE REJECT_QA_SCENARIO REQUEST_QA_OWNER`.  
  - **Límites:** missing → REQUEST_QA_OWNER (no CONTINUE); no inventes owner; breach de latencia cierra con REJECT.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: missing devuelve CONTINUE y pred usa ≥.  
  2. En `decide`, missing → `REQUEST_QA_OWNER`.  
  3. Completos: CONTINUE solo si observed ≤ target y owner; si no → REJECT_QA_SCENARIO.  
  4. Imprime las tres decisiones en orden.
- **Proposed retrospective:**  
  REQUEST_* pide evidencia; REJECT_* cierra el breach; CONTINUE solo con escenario medible. El error clásico es tratar “falta owner” como OK. Pregunta: ¿por qué no rellenar `platform` por defecto en silencio?
- **Code/output changes:** none
- **Validation notes:** Transfer auténtico; alineado a callout REQUEST_QA_OWNER de theory T1-A.

---

### S40-T1-B-DEMO (iDo)
- **Diagnosis:** Worked example claro de trade-off: async score 2.2 vence a sync 3.8 bajo min_score; residual 2 aceptable. Description nombra costo ponderado; falta preamble de “menor es mejor” y retrospective del misconception “maximizo score como en ML”. El `why` es una frase densa.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  En mesas de arquitectura de fintech en LatAm no se elige «lo moderno»: se elige por **costo ponderado** (menor es mejor) y residual firmado. En esta demo, sync=3.8 y async=2.2 compiten bajo `min_score`; el residual 2 no supera el umbral. No escribas: predice `best`, la tabla de scores y si residual_ok es True. Observa por qué maximizar el score promovería la peor opción.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: score de costo ≠ utilidad de ML; residual sin dueño no se promociona; la tabla se versiona con el ADR; sin umbral el trade-off se reabre (REOPEN_TRADEOFF). Puente a We Do: cambiar max por min y exigir residual ≤ 2.
- **Proposed retrospective:**  
  Menor score de costo gana; residual ≤ umbral con dueño que firma. El error clásico es usar max “por costumbre de ranking”. We Do: trade-off medible con min y residual_ok.
- **Code/output changes:** none
- **Validation notes:** Output `best async` / scores / `residual_ok True` alineado a theory T1-B.

---

### S40-T1-B-E1 (weDo, guided)
- **Diagnosis:** Drill guiado: starter usa max en vez de min. Instruction densa y buena técnicamente; sin title/preamble/retrospective. Feedback nombra min_score pero no ancla residual firmado por arquitectura.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Elegir por min_score y residual
- **Proposed preamble:**  
  - **Contexto:** en CASO-LIM-040-1B el dueño `arquitectura` debe firmar un residual ≤ 2 al elegir async vs sync.  
  - **Meta:** corregir la selección (min de scores, no max) y exigir residual_risk ≤ 2.  
  - **Éxito:** `S40-T1-B PASS`.  
  - **Límites:** no mutes scores ni selected; no inventes residual; solo corrige el predicado.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: compara `selected` con `max(...)` (DEFECT).  
  2. Cámbialo a `min(record["scores"], key=...)` y añade residual ≤ 2.  
  3. Imprime `S40-T1-B` y el status.  
  4. Debe ser PASS con selected async.
- **Proposed feedback improvement:**  
  Score alto es peor costo. Con max el starter «valida» la opción cara; con min + residual ≤ 2 el trade-off es promocionable. Sin residual no hay decisión firmable.
- **Proposed retrospective:**  
  min_score + residual con umbral es el contrato de T1-B. El error clásico es maximizar “utilidad” o omitir residual_risk. Siguiente (E2): PASS / REOPEN / MISSING residual.
- **Code/output changes:** none
- **Validation notes:** Solution output `S40-T1-B PASS` correcto.

---

### S40-T1-B-E2 (weDo, independent)
- **Diagnosis:** Tres rutas PASS / REOPEN_TRADEOFF / MISSING:residual_risk. Buena independencia; falta preamble de “no inventes residual” y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Assess de trade-off en tres rutas
- **Proposed preamble:**  
  - **Contexto:** el gate reabre trade-offs elegidos por moda o con residual alto; sin residual_risk no hay schema completo.  
  - **Meta:** enrutar válido (async min), adverso (selected mal / residual 4) e incompleto.  
  - **Éxito:** `PASS REOPEN_TRADEOFF MISSING:residual_risk`.  
  - **Límites:** missing primero; no inventes residual; no uses max.
- **Proposed instruction/description improvements:**  
  1. Starter da PASS si selected es max (DEFECT).  
  2. Corrige a min + residual ≤ 2.  
  3. Conserva MISSING de residual_risk.  
  4. Imprime las tres salidas.
- **Proposed retrospective:**  
  REOPEN_TRADEOFF es breach de contenido; MISSING es schema. El error clásico es inventar residual=0 para “cerrar el ticket”. Luego (E3): ESCALATE_RESIDUAL_RISK ante incertidumbre.
- **Code/output changes:** none
- **Validation notes:** Output canónico intacto.

---

### S40-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Fail-closed CONTINUE / REOPEN_TRADEOFF / ESCALATE_RESIDUAL_RISK. Transfer real; falta escena de “el owner no firma a ciegas” y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Fail-closed: ESCALATE_RESIDUAL_RISK
- **Proposed preamble:**  
  - **Contexto:** si falta residual_risk, la mesa de arquitectura de Red Andina escala: no se firma un trade-off a ciegas.  
  - **Meta:** CONTINUE / REOPEN_TRADEOFF / ESCALATE_RESIDUAL_RISK.  
  - **Éxito:** `CONTINUE REOPEN_TRADEOFF ESCALATE_RESIDUAL_RISK`.  
  - **Límites:** missing → ESCALATE (no CONTINUE); pred con min y residual ≤ 2.
- **Proposed instruction/description improvements:**  
  1. DEFECT: missing→CONTINUE y max en pred.  
  2. missing → ESCALATE_RESIDUAL_RISK.  
  3. Completos: CONTINUE solo min_score + residual ≤ 2; si no → REOPEN_TRADEOFF.  
  4. Imprime las tres decisiones.
- **Proposed retrospective:**  
  ESCALAR residual ≠ reabrir trade-off por score malo. El error clásico es CONTINUE silencioso sin residual. Pregunta: ¿quién firma el residual en tu dossier You Do?
- **Code/output changes:** none
- **Validation notes:** Alineado a theory T1-B ESCALATE_RESIDUAL_RISK.

---

### S40-T2-A-DEMO (iDo)
- **Diagnosis:** Demo clara de grafo de capas: presentation→application→domain e infrastructure→domain permitidas; domain→infra y presentation→infra prohibidas. Falta preamble de “salto de capa es bug de arquitectura” y retrospective.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  En Red Andina la UI de intake no debe llamar al almacén ER directo: eso es un **salto de capa**. Esta demo valida un grafo con presentation→application→domain e infrastructure→domain (adapter hacia adentro). No escribas: predice `deps_ok` y `domain_pure`. Observa qué aristas están en FORBIDDEN y por qué infrastructure→domain sí es válida.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: evidencia = diagrama de dependencias, no conteo de módulos; presentation→infra y domain→infra son REDRAW_BOUNDARY; el dominio permanece puro de drivers SQL/web. Puente a We Do: corregir el predicado que exige todo hacia infrastructure.
- **Proposed retrospective:**  
  Flechas permitidas y prohibidas se demuestran en el grafo. El error clásico es “atar la UI al SQL por velocidad de sprint”. We Do: imprimir el grafo limpio y el PASS.
- **Code/output changes:** none
- **Validation notes:** Output layers / deps_ok True / domain_pure True correcto.

---

### S40-T2-A-E1 (weDo, guided)
- **Diagnosis:** Oficio de grafo: starter exige que toda arista apunte a infrastructure. Instruction fuerte en artefacto; sin title/preamble/retrospective. Feedback bueno técnicamente.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Grafo de capas sin saltos
- **Proposed preamble:**  
  - **Contexto:** CASO-LIM-040-2A pide un grafo legible de Red Andina sin domain→infra ni presentation→infra.  
  - **Meta:** validar aristas con conjunto forbidden e imprimir el grafo.  
  - **Éxito:** `S40-T2-A PASS` más línea `graph [...]`.  
  - **Límites:** no borres aristas del fixture; infrastructure→domain está permitido; layers[2] debe ser domain.
- **Proposed instruction/description improvements:**  
  1. DEFECT: `all(edge[1] == "infrastructure")`.  
  2. Define forbidden y exige que ninguna arista esté en él.  
  3. Añade check de layers[2] == "domain".  
  4. Imprime status y graph.
- **Proposed feedback improvement:**  
  El artefacto es el grafo impreso, no un booleano suelto. infrastructure→domain es el adapter hacia adentro; forzar todo hacia infrastructure es el anti-patrón del starter.
- **Proposed retrospective:**  
  Forbidden explícito > “sentir” las capas. El error clásico es dibujar UI→DB. Siguiente (E2): PASS / REDRAW / MISSING dependencies.
- **Code/output changes:** none
- **Validation notes:** Output de dos líneas alineado a solution.

---

### S40-T2-A-E2 (weDo, independent)
- **Diagnosis:** Tabla de tres rutas con saltos prohibidos en el adverso. Independencia OK; falta preamble y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Assess: grafo limpio o REDRAW
- **Proposed preamble:**  
  - **Contexto:** un dossier con domain→infrastructure no se promociona: se redibuja la frontera.  
  - **Meta:** assess válido / adverso con saltos / sin dependencies.  
  - **Éxito:** `PASS REDRAW_BOUNDARY MISSING:dependencies`.  
  - **Límites:** missing primero; no asumas grafo vacío como limpio.
- **Proposed instruction/description improvements:**  
  1. DEFECT: PASS si todo apunta a infrastructure.  
  2. Corrige con forbidden + layers[2]==domain.  
  3. Conserva MISSING de dependencies.  
  4. Imprime las tres salidas.
- **Proposed retrospective:**  
  REDRAW_BOUNDARY es breach de contenido; MISSING es ausencia de evidencia. El error clásico es PASS con grafo vacío. Luego (E3): REVIEW_LAYER_OWNER ante incertidumbre.
- **Code/output changes:** none
- **Validation notes:** Output canónico intacto.

---

### S40-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Fail-closed CONTINUE / REDRAW_BOUNDARY / REVIEW_LAYER_OWNER. Transfer real; falta anclar “incertidumbre ≠ breach”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Fail-closed: REVIEW_LAYER_OWNER
- **Proposed preamble:**  
  - **Contexto:** sin grafo de dependencias no se asume capas limpias: se pide revisión del dueño de capa.  
  - **Meta:** CONTINUE / REDRAW_BOUNDARY / REVIEW_LAYER_OWNER.  
  - **Éxito:** `CONTINUE REDRAW_BOUNDARY REVIEW_LAYER_OWNER`.  
  - **Límites:** missing → REVIEW_LAYER_OWNER; no CONTINUE silencioso.
- **Proposed instruction/description improvements:**  
  1. DEFECT: missing→CONTINUE y pred invertido.  
  2. missing → REVIEW_LAYER_OWNER.  
  3. Completos: CONTINUE solo grafo limpio; si no → REDRAW_BOUNDARY.  
  4. Imprime las tres decisiones.
- **Proposed retrospective:**  
  Ausencia de grafo no es “OK por defecto”. El error clásico es CONTINUE sin dependencies. Pregunta: ¿qué arista prohibida dibujarías primero en un audit de Red Andina?
- **Code/output changes:** none
- **Validation notes:** Alineado a theory T2-A.

---

### S40-T2-B-DEMO (iDo)
- **Diagnosis:** Demo hexagonal clara: Protocol CaseRepo, MemoryCaseRepo, open_case tipado al port. Falta preamble de “dominio no importa SQL” y retrospective del misconception “el nombre *Repository* ya es DIP”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  El dominio de triage de Red Andina no debe importar SQLAlchemy ni FastAPI: depende de un **port**. Esta demo tipa `open_case(repo: CaseRepo)` y pasa `MemoryCaseRepo` como adapter en memoria. No escribas: predice status, la flecha `domain<-adapters` y `implements_port`. Observa que puedes sustituir el adapter sin reescribir la regla.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: DIP se demuestra con Protocol + adapter intercambiable + imports de dominio vacíos + contract tests; el sufijo del nombre no es la regla; implements_port es checklist de lab. Puente a We Do: dejar de exigir adapter==port.
- **Proposed retrospective:**  
  Dependencia hacia el dominio, no hacia el framework. El error clásico es importar ORM en el núcleo “para ir más rápido”. We Do: checklist implements_port + imports vacíos + ≥3 tests.
- **Code/output changes:** none
- **Validation notes:** Output status open / dep / implements_port True correcto.

---

### S40-T2-B-E1 (weDo, guided)
- **Diagnosis:** Oficio DIP: starter exige adapter==port e imports no vacíos (anti-DIP). Instruction excelente; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** DIP con implements_port y tests
- **Proposed preamble:**  
  - **Contexto:** CASO-LIM-040-2B modela CaseRepository + MemoryCaseRepository; el dominio no debe importar infra.  
  - **Meta:** validar implements_port, domain_imports vacío y contract_tests ≥ 3.  
  - **Éxito:** `S40-T2-B PASS` y línea `dep domain<-adapters`.  
  - **Límites:** no uses igualdad de nombres como regla; no inventes imports.
- **Proposed instruction/description improvements:**  
  1. DEFECT: adapter==port y bool(domain_imports).  
  2. Predicado: implements_port is True and not domain_imports and contract_tests >= 3.  
  3. Imprime status y dep.  
  4. Debe ser PASS.
- **Proposed feedback improvement:**  
  El nombre del adapter no prueba DIP. Evidencia de lab: flag + imports vacíos + ≥3 contract tests. sqlalchemy en dominio es breach real en E2.
- **Proposed retrospective:**  
  implements_port + imports limpios + tests es el trío DIP del lab. El error clásico es confiar en el sufijo *Repository*. Siguiente (E2): PASS / INVERT / MISSING contract_tests.
- **Code/output changes:** none
- **Validation notes:** Output de dos líneas correcto.

---

### S40-T2-B-E2 (weDo, independent)
- **Diagnosis:** Tres rutas con adverso sqlalchemy. Independencia OK; falta preamble y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Assess hexagonal en tres rutas
- **Proposed preamble:**  
  - **Contexto:** un dominio con imports de sqlalchemy invierte la dependencia y no se promociona.  
  - **Meta:** assess válido / adverso (implements_port False + sqlalchemy) / sin contract_tests.  
  - **Éxito:** `PASS INVERT_DEPENDENCY MISSING:contract_tests`.  
  - **Límites:** missing primero; no uses endswith del nombre del adapter.
- **Proposed instruction/description improvements:**  
  1. DEFECT: PASS si adapter==port y domain_imports.  
  2. Corrige al trío DIP.  
  3. Conserva MISSING de contract_tests.  
  4. Imprime las tres salidas.
- **Proposed retrospective:**  
  INVERT_DEPENDENCY es breach de contenido; MISSING es schema de evidencia de contrato. El error clásico es PASS por nombre bonito. Luego (E3): DEFINE_PORT_CONTRACT.
- **Code/output changes:** none
- **Validation notes:** Output canónico intacto.

---

### S40-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Fail-closed CONTINUE / INVERT_DEPENDENCY / DEFINE_PORT_CONTRACT. Transfer real; instruction menciona “imprime meets_contract” de forma confusa (la solución imprime results) — nota menor.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Fail-closed: DEFINE_PORT_CONTRACT
- **Proposed preamble:**  
  - **Contexto:** sin contract_tests no se asume que el port está definido: se pide DEFINIR el contrato.  
  - **Meta:** CONTINUE / INVERT_DEPENDENCY / DEFINE_PORT_CONTRACT.  
  - **Éxito:** `CONTINUE INVERT_DEPENDENCY DEFINE_PORT_CONTRACT`.  
  - **Límites:** missing → DEFINE_PORT_CONTRACT; uncertainty ≠ breach.
- **Proposed instruction/description improvements:**  
  1. DEFECT: missing→CONTINUE y pred anti-DIP.  
  2. missing → DEFINE_PORT_CONTRACT.  
  3. Completos: CONTINUE solo trío DIP; si no → INVERT_DEPENDENCY.  
  4. Imprime las tres decisiones (no un booleano suelto).
- **Proposed retrospective:**  
  Falta de tests de contrato no es “dominio acoplado”: es incertidumbre de evidencia. El error clásico es CONTINUE sin contract_tests. Pregunta: ¿qué probarías al sustituir Memory por SQL?
- **Code/output changes:** none (opcional: alinear wording de instruction “meets_contract” con print de results — solo redacción)
- **Validation notes:** Output canónico `CONTINUE INVERT_DEPENDENCY DEFINE_PORT_CONTRACT`.

---

### S40-T3-A-DEMO (iDo)
- **Diagnosis:** Demo de ACL concreta: traduce ER→intake y oculta score. Buena y distinta del theory de sets disjuntos. Falta preamble y retrospective del misconception “repetir la palabra ‘case’ siempre está mal”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Entre intake y ER de Red Andina el **score de ER no debe filtrarse a la UI de recepción** sin traducción. Esta demo aplica un ACL: del paquete ER solo salen case_id y source; score queda fuera. No escribas: predice el packet y por qué `acl True` y `no_leak True`. Observa la función translate_to_intake.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: el error de oficio es mezclar modelos sin mapa, no “prohibir palabras repetidas” en abstracto; el ACL declara la traducción; en el lab de We Do se pedirá isdisjoint de tokens + case→record. Puente a We Do: context map con filas y ACL.
- **Proposed retrospective:**  
  ACL = frontera explícita de glosario. El error clásico es pintar score de ER en la pantalla de intake “porque ya está en el JSON”. We Do: mapa disjunto + traducción case→record.
- **Code/output changes:** none
- **Validation notes:** Output packet / acl True / no_leak True correcto; demo algo distinta del assess de sets (complementario, no conflictivo).

---

### S40-T3-A-E1 (weDo, guided)
- **Diagnosis:** Oficio de context map: starter trata intersección como éxito. Instruction excelente sobre artefacto; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Context map con ACL case→record
- **Proposed preamble:**  
  - **Contexto:** CASO-LIM-040-3A exige un mini context map intake/er con términos disjuntos y ACL case→record.  
  - **Meta:** corregir el predicado (isdisjoint + traducción) e imprimir el mapa.  
  - **Éxito:** `S40-T3-A PASS` y línea `map [...]`.  
  - **Límites:** en el lab, solape de tokens sin mapa es breach; no improvises el ACL; datos sintéticos.
- **Proposed instruction/description improvements:**  
  1. DEFECT: PASS si hay intersección de terms.  
  2. Exige isdisjoint y translations["case"]=="record".  
  3. Imprime status y map legible.  
  4. Debe ser PASS.
- **Proposed feedback improvement:**  
  El artefacto es el mapa (BC + términos + ACL), no un booleano. En DDD real un vocablo puede repetirse con significado local si el mapa lo declara; este lab simplifica con tokens disjuntos.
- **Proposed retrospective:**  
  Fronteras de lenguaje se demuestran con mapa + traducción. El error clásico es fusionar glosarios “porque case y record son lo mismo”. Siguiente (E2): PASS / SPLIT / MISSING translations.
- **Code/output changes:** none
- **Validation notes:** Output de dos líneas correcto.

---

### S40-T3-A-E2 (weDo, independent)
- **Diagnosis:** Tres rutas con adverso case en ambos lados. Independencia OK; falta preamble y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Assess: SPLIT_CONTEXTS o MISSING
- **Proposed preamble:**  
  - **Contexto:** token `case` en intake y en ER sin ACL es solape de modelos; sin translations no hay schema de mapa.  
  - **Meta:** assess válido / adverso solapado / sin translations.  
  - **Éxito:** `PASS SPLIT_CONTEXTS MISSING:translations`.  
  - **Límites:** missing primero; no inventes el ACL en silencio.
- **Proposed instruction/description improvements:**  
  1. DEFECT: PASS si intake ∩ er no vacío.  
  2. Corrige a isdisjoint + case→record.  
  3. Conserva MISSING de translations.  
  4. Imprime las tres salidas.
- **Proposed retrospective:**  
  SPLIT_CONTEXTS es breach de modelo; MISSING es falta de mapa. El error clásico es improvisar traducciones en la UI. Luego (E3): WORKSHOP_UBIQUITOUS_LANGUAGE.
- **Code/output changes:** none
- **Validation notes:** Output canónico intacto.

---

### S40-T3-A-E3 (weDo, transfer)
- **Diagnosis:** Fail-closed CONTINUE / SPLIT_CONTEXTS / WORKSHOP_UBIQUITOUS_LANGUAGE. Transfer real; falta escena de taller de lenguaje.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Fail-closed: taller de lenguaje ubicuo
- **Proposed preamble:**  
  - **Contexto:** sin mapa de traducciones no se asume frontera sana: se convoca taller de lenguaje ubicuo.  
  - **Meta:** CONTINUE / SPLIT_CONTEXTS / WORKSHOP_UBIQUITOUS_LANGUAGE.  
  - **Éxito:** `CONTINUE SPLIT_CONTEXTS WORKSHOP_UBIQUITOUS_LANGUAGE`.  
  - **Límites:** missing → WORKSHOP (no CONTINUE); no rellenes translations.
- **Proposed instruction/description improvements:**  
  1. DEFECT: missing→CONTINUE y pred de solape como éxito.  
  2. missing → WORKSHOP_UBIQUITOUS_LANGUAGE.  
  3. Completos: CONTINUE solo disjuntos + ACL; si no → SPLIT_CONTEXTS.  
  4. Imprime las tres decisiones.
- **Proposed retrospective:**  
  Ausencia de translations no es solape demostrado: es incertidumbre de glosario. El error clásico es CONTINUE sin mapa. Pregunta: ¿qué término de triage no debe colarse en intake?
- **Code/output changes:** none
- **Validation notes:** Alineado a theory T3-A.

---

### S40-T3-B-DEMO (iDo)
- **Diagnosis:** Demo táctica entity/VO/servicio: CASE-001, Money PEN, merge 0.7, vo_frozen. Falta preamble de identidad vs valor y retrospective de “vo_frozen no congela el dict por magia”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  En el modelo táctico de Red Andina, `CASE-001` se rastrea por **identidad** y 150 PEN se compara por **valor**. Esta demo muestra entity same, VO equal, merge_scores 0.7 y flags de lab vo_frozen / service_stateless. No escribas: predice cada print y por qué el servicio no guarda sesión. Observa que currency no es el id del caso.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: identidad ≠ atributos; VO igualdad por amount+currency; servicio sin estado; vo_frozen es assert de lab (en prod: NamedTuple/frozen dataclass). Puente a We Do: dejar de mezclar currency con entity_id.
- **Proposed retrospective:**  
  Tres herramientas tácticas, tres invariantes distintas. El error clásico es usar el id de la entity como “moneda” del VO. We Do: checklist de identidad + PEN + merge 0.7.
- **Code/output changes:** none
- **Validation notes:** Output de cinco líneas correcto.

---

### S40-T3-B-E1 (weDo, guided)
- **Diagnosis:** Oficio táctico: starter compara currency == entity_id. Instruction excelente; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Entity, Money VO y merge sin estado
- **Proposed preamble:**  
  - **Contexto:** CASO-LIM-040-3B trae CASE-001, dos VO 150 PEN y merge_scores(0.8, 0.6).  
  - **Meta:** validar identidad, igualdad de VO, currency PEN, vo_frozen, service_stateless y merged==0.7.  
  - **Éxito:** `S40-T3-B PASS` y línea entity_same/vo_equal/merged.  
  - **Límites:** no compares currency con entity_id; no mutes entidades en el servicio.
- **Proposed instruction/description improvements:**  
  1. DEFECT: meets_contract = currency == entity_a.  
  2. Arma el predicado completo (startswith CASE-, same_entity, same_money, PEN, flags, merged==0.7).  
  3. Imprime status y el resumen.  
  4. Debe ser PASS.
- **Proposed feedback improvement:**  
  Mezclar moneda con id rompe el modelo táctico. El artefacto es el contraste identidad vs valor + servicio stateless, no un flag suelto.
- **Proposed retrospective:**  
  Entity por id, VO por valor, servicio sin sesión. El error clásico del starter es el anti-patrón currency==entity_id. Siguiente (E2): PASS / REJECT / MISSING service_stateless.
- **Code/output changes:** none
- **Validation notes:** Output de dos líneas correcto.

---

### S40-T3-B-E2 (weDo, independent)
- **Diagnosis:** Tres rutas con adverso USD / id vacío. Independencia OK; falta preamble y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Assess del modelo táctico
- **Proposed preamble:**  
  - **Contexto:** id vacío, USD o vo_frozen False no pasan el gate de dominio de Red Andina.  
  - **Meta:** assess válido / adverso / sin service_stateless.  
  - **Éxito:** `PASS REJECT_DOMAIN_MODEL MISSING:service_stateless`.  
  - **Límites:** missing primero; currency debe ser PEN en el lab.
- **Proposed instruction/description improvements:**  
  1. DEFECT: PASS si currency==entity_id.  
  2. Corrige a startswith CASE- + PEN + vo_frozen + service_stateless.  
  3. Conserva MISSING de service_stateless.  
  4. Imprime las tres salidas.
- **Proposed retrospective:**  
  REJECT_DOMAIN_MODEL es breach de invariantes; MISSING es ausencia de bandera de servicio. El error clásico es asumir servicio stateless. Luego (E3): CLARIFY_INVARIANT.
- **Code/output changes:** none
- **Validation notes:** Output canónico intacto.

---

### S40-T3-B-E3 (weDo, transfer)
- **Diagnosis:** Fail-closed CONTINUE / REJECT_DOMAIN_MODEL / CLARIFY_INVARIANT. Transfer real; falta escena de “aclarar invariante”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Fail-closed: CLARIFY_INVARIANT
- **Proposed preamble:**  
  - **Contexto:** sin bandera de servicio no se inventa que es stateless: se aclara la invariante.  
  - **Meta:** CONTINUE / REJECT_DOMAIN_MODEL / CLARIFY_INVARIANT.  
  - **Éxito:** `CONTINUE REJECT_DOMAIN_MODEL CLARIFY_INVARIANT`.  
  - **Límites:** missing → CLARIFY_INVARIANT; no CONTINUE silencioso.
- **Proposed instruction/description improvements:**  
  1. DEFECT: missing→CONTINUE y pred currency==entity_id.  
  2. missing → CLARIFY_INVARIANT.  
  3. Completos: CONTINUE solo modelo sano; si no → REJECT_DOMAIN_MODEL.  
  4. Imprime las tres decisiones.
- **Proposed retrospective:**  
  Incertidumbre de invariante ≠ modelo roto demostrado. El error clásico es CONTINUE sin service_stateless. Pregunta: ¿qué inmutabilizarías de verdad en producción (NamedTuple vs flag)?
- **Code/output changes:** none
- **Validation notes:** Alineado a theory T3-B.

---

### S40-T4-A-DEMO (iDo)
- **Diagnosis:** Demo documental C4 context/container + ADR accepted con rollback. Falta preamble de “dibujo sin ADR es foto” y retrospective.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Un diagrama C4 de Red Andina sin ADR es una foto; un ADR sin rollback es promesa sin freno. Esta demo comprueba niveles context+container y campos decision/alternatives/consequences/rollback con status accepted. No escribas: predice c4_ok, adr_ok y status. Observa qué falta en un draft incompleto.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: rúbrica ADR (≥2 alternatives, residual, rollback ≤1 release, dueño); status accepted solo firmado; RETURN_ADR_TO_DRAFT si incompleto. Puente a We Do: dejar de aceptar draft con <3 campos.
- **Proposed retrospective:**  
  C4 mínimo + ADR accepted con rollback operable. El error clásico es un archivo con títulos vacíos. We Do: ensamblar ADR-001 accepted de oficio.
- **Code/output changes:** none
- **Validation notes:** Output c4_ok / adr_ok / status accepted correcto.

---

### S40-T4-A-E1 (weDo, guided)
- **Diagnosis:** Oficio C4+ADR: starter acepta draft incompleto. Instruction excelente; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Mini C4 y ADR-001 accepted
- **Proposed preamble:**  
  - **Contexto:** CASO-LIM-040-4A trae personas/cajas C4 y ADR-001 async con alternatives, consequences y feature_flag_off.  
  - **Meta:** validar need_c4 + need_adr + status accepted.  
  - **Éxito:** `S40-T4-A PASS` y `adr ADR-001 accepted`.  
  - **Límites:** no aceptes draft; no inventes campos vacíos; You Do reutilizará la plantilla.
- **Proposed instruction/description improvements:**  
  1. DEFECT: PASS si status draft y len(adr)<3.  
  2. need_c4 = context y container no vacíos; need_adr = decision/alternatives/consequences/rollback truthy; status==accepted.  
  3. Imprime status y adr id/status.  
  4. Debe ser PASS.
- **Proposed feedback improvement:**  
  El artefacto es el ADR relleno, no un set abstracto de nombres de campo. Un draft incompleto se devuelve a draft; no se promociona.
- **Proposed retrospective:**  
  Accepted = campos presentes + status firmable. El error clásico es PASS por tener un id ADR-001. Siguiente (E2): PASS / RETURN / MISSING adr_status.
- **Code/output changes:** none
- **Validation notes:** Output de dos líneas correcto.

---

### S40-T4-A-E2 (weDo, independent)
- **Diagnosis:** Tres rutas con adverso C4 incompleto. Independencia OK; falta preamble y retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Assess documental C4 y ADR
- **Proposed preamble:**  
  - **Contexto:** un ADR “accepted” sin alternatives o sin container no pasa el gate documental.  
  - **Meta:** assess válido / adverso incompleto / sin adr_status.  
  - **Éxito:** `PASS RETURN_ADR_TO_DRAFT MISSING:adr_status`.  
  - **Límites:** missing primero; no asumas accepted.
- **Proposed instruction/description improvements:**  
  1. DEFECT: PASS si draft y fields < 3.  
  2. Corrige a c4 context+container, adr fields mínimos y status accepted.  
  3. Conserva MISSING de adr_status.  
  4. Imprime las tres salidas.
- **Proposed retrospective:**  
  RETURN_ADR_TO_DRAFT es breach de contenido documental; MISSING es schema de status. El error clásico es asumir accepted. Luego (E3): REQUEST_ARCH_REVIEW.
- **Code/output changes:** none
- **Validation notes:** Output canónico intacto.

---

### S40-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Fail-closed CONTINUE / RETURN_ADR_TO_DRAFT / REQUEST_ARCH_REVIEW. Transfer real; falta escena de revisión de arquitectura.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Fail-closed: REQUEST_ARCH_REVIEW
- **Proposed preamble:**  
  - **Contexto:** sin adr_status no se inventa accepted: se pide revisión de arquitectura.  
  - **Meta:** CONTINUE / RETURN_ADR_TO_DRAFT / REQUEST_ARCH_REVIEW.  
  - **Éxito:** `CONTINUE RETURN_ADR_TO_DRAFT REQUEST_ARCH_REVIEW`.  
  - **Límites:** missing → REQUEST_ARCH_REVIEW; no CONTINUE silencioso.
- **Proposed instruction/description improvements:**  
  1. DEFECT: missing→CONTINUE y pred de draft incompleto como éxito.  
  2. missing → REQUEST_ARCH_REVIEW.  
  3. Completos: CONTINUE solo C4+ADR accepted completo; si no → RETURN_ADR_TO_DRAFT.  
  4. Imprime las tres decisiones.
- **Proposed retrospective:**  
  Falta de status ≠ ADR incompleto demostrado. El error clásico es CONTINUE sin status. Pregunta: ¿qué escribirías en rollback de tu ADR-001 del You Do?
- **Code/output changes:** none
- **Validation notes:** Alineado a theory T4-A.

---

### S40-T4-B-DEMO (iDo)
- **Diagnosis:** Demo de evolución aditiva v1 ⊆ v1.1 + deuda con owner y retire_on. Falta preamble y retrospective del misconception “borrar campos limpia el schema”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Evolucionar el payload de case en Red Andina sin romper consumidores: **aditivo**. Esta demo comprueba v1 ⊆ v11 (case_id, status + priority) y deuda del job async con owner platform y retire_on 2026-12-01. No escribas: predice additive, debt_owner y retire_on. Observa por qué borrar un campo de v1 sería breaking.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: consumer contract verde = campos previos conservados; BLOCK_BREAKING_CHANGE si se eliminan; deuda sin retire_on no se negocia a ciegas (NEGOTIATE_VERSION). Puente a We Do: invertir el subconjunto del starter.
- **Proposed retrospective:**  
  Aditivo + deuda fechada = evolución gobernada. El error clásico es “limpiar” v1 quitando status. We Do: v1 ⊆ v11 + vista del consumidor + debt.
- **Code/output changes:** none
- **Validation notes:** Output additive True / debt_owner / retire_on correcto.

---

### S40-T4-B-E1 (weDo, guided)
- **Diagnosis:** Oficio consumer contract: starter usa v11 < v1 (subconjunto invertido). Instruction excelente; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Evolución aditiva y deuda fechada
- **Proposed preamble:**  
  - **Contexto:** CASO-LIM-040-4B trae v1 {case_id, status}, v1.1 con priority y deuda del job async.  
  - **Meta:** validar v1 ⊆ v11, misma consumer_view y debt owner+retire_on.  
  - **Éxito:** `S40-T4-B PASS` más vistas y debt.  
  - **Límites:** no inviertas el subconjunto; no inventes retire_on.
- **Proposed instruction/description improvements:**  
  1. DEFECT: meets_contract = v11_fields < v1_fields.  
  2. Exige v1 ⊆ v11, consumer_view igual en v1 y v11, owner y retire_on truthy.  
  3. Imprime status, vistas y debt.  
  4. Debe ser PASS.
- **Proposed feedback improvement:**  
  El artefacto es consumer contract + deuda fechada. Pedir v11 ⊂ v1 disfraza un breaking como PASS. La vista del consumidor debe seguir leyendo case_id:status.
- **Proposed retrospective:**  
  v1 ⊆ v_next y deuda con fecha son el contrato de T4-B. El error clásico es invertir el subconjunto. Siguiente (E2): PASS / BLOCK / MISSING retire_on.
- **Code/output changes:** none
- **Validation notes:** Output de tres líneas correcto.

---

### S40-T4-B-E2 (weDo, independent)
- **Diagnosis:** Tres rutas con adverso que borra status de v11. Independencia OK; falta preamble y retrospective. Nota: solution usa `retire_on >= "2026-12-01"` (comparación lexicográfica de fechas ISO) — pedagógicamente aceptable si se documenta.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Assess: BLOCK_BREAKING_CHANGE
- **Proposed preamble:**  
  - **Contexto:** quitar status de v1.1 rompe el consumidor antiguo; sin retire_on no hay schema de deuda.  
  - **Meta:** assess válido / adverso breaking / sin retire_on.  
  - **Éxito:** `PASS BLOCK_BREAKING_CHANGE MISSING:retire_on`.  
  - **Límites:** missing primero; no inventes fecha de retiro.
- **Proposed instruction/description improvements:**  
  1. DEFECT: PASS si v11 < v1.  
  2. Corrige a v1 ⊆ v11 + debt_owner truthy + retire_on presente (y ≥ fecha del lab si aplica).  
  3. Conserva MISSING de retire_on.  
  4. Imprime las tres salidas.
- **Proposed retrospective:**  
  BLOCK_BREAKING_CHANGE es breach de compat; MISSING es falta de plan de retiro. El error clásico es negociar versión sin fecha. Luego (E3): NEGOTIATE_VERSION.
- **Code/output changes:** none
- **Validation notes:** Output canónico intacto; opcional aclarar en preamble la comparación de fechas ISO del lab.

---

### S40-T4-B-E3 (weDo, transfer)
- **Diagnosis:** Fail-closed CONTINUE / BLOCK_BREAKING_CHANGE / NEGOTIATE_VERSION. Transfer real; falta escena de negociación de versión.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Fail-closed: NEGOTIATE_VERSION
- **Proposed preamble:**  
  - **Contexto:** sin retire_on no se asume compat ni se promociona deuda: se negocia versión con evidencia.  
  - **Meta:** CONTINUE / BLOCK_BREAKING_CHANGE / NEGOTIATE_VERSION.  
  - **Éxito:** `CONTINUE BLOCK_BREAKING_CHANGE NEGOTIATE_VERSION`.  
  - **Límites:** missing → NEGOTIATE_VERSION; no CONTINUE silencioso.
- **Proposed instruction/description improvements:**  
  1. DEFECT: missing→CONTINUE y pred de subconjunto invertido.  
  2. missing → NEGOTIATE_VERSION.  
  3. Completos: CONTINUE solo aditivo + deuda; si no → BLOCK_BREAKING_CHANGE.  
  4. Imprime las tres decisiones.
- **Proposed retrospective:**  
  Negociar versión ≠ bloquear breaking ya demostrado. El error clásico es CONTINUE sin fecha de retiro. Pregunta: ¿qué campo aditivo propondrías en v1.1 de tu dossier sin romper v1?
- **Code/output changes:** none
- **Validation notes:** Alineado a theory T4-B.

---

### S40-youDo (youDo)
- **Diagnosis:** Proyecto de dossier bien enmarcado: context, objectives, requirements, rubric, portfolioNote y starter con plantillas QA / context_map / c4 / adrs_x2 y checklist que inicia en BLOCKED. Falta **retrospective** de defensa post-build (invariante, sintético vs real, impacto medible). El marco ya es fuerte; el gap es solo el cierre metacognitivo.
- **Checklist:** context pass · goal pass · success pass (rubric + READY/BLOCKED) · constraints pass · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (mantener title de youDo)
- **Proposed preamble:** N/A (context/objectives ya cubren; no duplicar essay)
- **Proposed instruction/description improvements:**  
  Mantener context/objectives/requirements/starter. Opcional P2: en portfolioNote, una línea que recuerde el trío medida+dueño+consecuencia al marcar evidence True.
- **Proposed retrospective:**  
  Antes de marcar listo: (1) ¿qué frontera del mapa demuestras con un caso normal, uno BLOCK_ARCHITECTURE y uno REVIEW_ADR? (2) ¿qué harías distinto con datos reales vs. sintéticos CASO-LIM-040 (PII, secretos fuera del repo)? (3) Escribe en el README una frase de impacto medible (antes/después: p. ej. trade-off sin residual → residual firmado) defendible en 30 segundos en una mesa de arquitectura.
- **Code/output changes:** none
- **Validation notes:** Starter y rubric alineados a CP-N4-A; evidence inicia en False a propósito.

---

## Priority order

### P0 (Fixer: primero — We Do verbal scaffolding)
1. Añadir `title` + `preamble` + `retrospective` a los **24** weDo (E1 guiado con defect nombrado; E2 meta+éxito menos migas; E3 transfer fail-closed con REQUEST_*/ESCALATE_*/etc.).
2. Separar `instruction` a **solo pasos de tarea** (40–100 palabras); mover escena/meta/éxito/límites al preamble.
3. Reforzar `feedback` donde sea 1 frase seca (razonamiento + por qué importa en Red Andina), sin reescribir tests.

Orden sugerido de subtemas para el Fixer (dependencias de aprendizaje):  
T1-A → T1-B → T2-A → T2-B → T3-A → T3-B → T4-A → T4-B (cada uno E1→E2→E3).

### P1 (I Do + You Do)
4. Añadir `preamble` + `retrospective` a las **8** demos iDo; ampliar `why` si queda bajo ~40 palabras.
5. Añadir `retrospective` al **youDo** (defensa de dossier: gate, sintético, impacto).

### P2 (polish)
6. Alinear wording de instruction en S40-T2-B-E3 (“meets_contract” vs print de results).
7. Opcional: una línea en portfolioNote del You Do sobre medida+dueño+consecuencia.
8. Opcional: en T4-B-E2/E3, aclarar en preamble la comparación de fechas ISO del lab si confunde al newbie.

---

## Residual risks
- **Prosa genérica si el Fixer bulk-genera:** las 24 preambles de We Do comparten el patrón assess/decide; el Fixer debe reescribir con el artefacto de cada subtema (QA, trade-off, grafo, DIP, ACL, entity/VO, ADR, consumer contract), no clonar tres párrafos con IDs distintos.
- **Nivel Master vs true newbie:** el vocabulario DDD/C4/ADR es denso; el preamble debe anclar en Red Andina/Lima sin diluir el contrato técnico.
- **Demo T3-A vs lab T3-A:** la demo enseña ACL por filtrado de score; el lab exige isdisjoint + case→record. No unificar código; sí alinear el puente verbal en retrospective de la demo.
- **You Do scope:** requirements piden relación/IA en context map; el starter solo muestra intake/er/triage/reporting — el retrospective puede pedir al learner que complete filas sin inventar PII.
- **No tocar outputs canónicos** salvo justificación execute-and-diff; los asserts y strings de gate son contratos de promoción CP-N4-A.
- **Anti-aberración:** este informe no editó `s40-agentic-architecture.ts`; solo reporta.

---

## Counts for Fixer acceptance (post-fix checklist)
- [ ] 8 iDo: `preamble` + `retrospective` (y `why` ≥ ~40 palabras si se amplía)
- [ ] 24 weDo: `title` + `preamble` + `instruction` solo-tarea + `retrospective` (+ feedback reforzado)
- [ ] 1 youDo: `retrospective`
- [ ] Outputs exactos preservados
- [ ] Español PE; sin PII real; sin generadores
- [ ] Sección compila en build estático

---

Section 40 exercise pedagogy review complete. Ready for the Fixer prompt.
