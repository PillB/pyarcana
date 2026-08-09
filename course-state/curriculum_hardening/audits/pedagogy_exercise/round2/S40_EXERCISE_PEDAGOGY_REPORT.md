# S40 Exercise Pedagogy Report (Round 2)

## Section
- **title:** Arquitectura, DDD y decisiones técnicas
- **shortTitle:** Arquitectura y DDD
- **id:** `agentic-architecture`
- **index:** 40
- **source:** `src/lib/course/sections/s40-agentic-architecture.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades)
- **subtemas:** T1-A QA scenarios · T1-B trade-offs/residual · T2-A capas/grafo · T2-B ports/DIP · T3-A bounded contexts/ACL · T3-B entity/VO/servicio · T4-A C4+ADR · T4-B evolución aditiva/deuda
- **hilo:** dossier **CP-N4-A** (Red Andina, Lima sintético) fixture **CASO-LIM-040**; trío **medida + dueño + consecuencia**; stdlib only; sin orquestación LLM ni PII real
- **Round 1 context:** `round1/S40_EXERCISE_PEDAGOGY_REPORT.md` (solo contraste; **no** rubber-stamp)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (checklists preamble/retrospective, fade E1→E3, longitudes, anti-aberración).
- Manually re-inspected **current** source for every `iDo.steps[]`, `weDo.steps[]`, and `youDo` (title, preamble, instruction, feedback, retrospective, why, DEFECT, solution output).
- Integrity traps checked live: (1) **T1-A-E1** `observed >= target` invertido y fixture 280≤300 → defect visible; (2) **T1-B-E1** `max` en lugar de `min` con selected async; (3) **T2-A-E1** `all(edge[1]=="infrastructure")` anti-patrón; (4) **T2-B-E1** `adapter==port and bool(domain_imports)`; (5) **T3-A-E1** intersección como éxito; (6) **T3-B-E1** `currency==entity_id`; (7) **T4-A-E1** draft incompleto como PASS; (8) **T4-B-E1** `v11 < v1` subconjunto invertido; (9) E3 missing→CONTINUE en todos los transfer.
- Scored for a **true newbie** (qué / por qué / éxito / qué queda), independent of Round-1 proposals.
- Word counts measured only as gates (no bulk prose generation).
- No generators, bulk templates, or source edits.

## Global findings (post Round-1 fix)

| Area | Status | Residual impact |
|------|--------|-----------------|
| **Field coverage** | Complete: 8 iDo con `preamble`+`why`+`retrospective`; 24 weDo con `title`+`preamble`+`instruction`+`feedback`+`retrospective`; youDo con `retrospective` + marco sólido | Round-1 P0 “cero campos” **cerrado** |
| **We Do titles** | Presentes, 4–7 palabras, español PE; E3 usan patrón `Fail-closed: TOKEN` | Pass; P2 opcional: “Fail-closed” es jerga (aclarar en preamble ya lo hace) |
| **Preamble shape** | weDo en bullets contexto/meta/éxito/límites (≈31–59 w; spec permite “4 short bullets”); iDo narrativos con predicción | Pass en estructura |
| **Instruction = steps** | Solo-tarea, ordenados; E1 nombra DEFECT; E2/E3 menos migas de escena | Pass; instructions ~22–38 w (bajo piso 40, pero claridad alta) |
| **E1→E2→E3 fade** | Superficies distintas: E1 repara predicado/oficio; E2 tri-ruta PASS/BREACH/MISSING; E3 fail-closed CONTINUE/BREACH/REQUEST_*|ESCALATE_*|… | Pass — no clones numéricos; códigos de gate diferenciados por subtema |
| **Feedback vs retrospective** | Feedback ancla Red Andina/artefacto en E1; en E2 muchos pares repiten “contenido vs schema” y a veces el **mismo** error clásico (residual=0, grafo vacío, nombre bonito) | Residual **P2** sistemático en eco E2 |
| **Retrospective length** | **24/24** weDo retros < 40 palabras (mediana ≈23–30 w; spec 40–80). iDo: T1-A OK (~48 w); peores T4-A (~24 w), T4-B (~26 w), T1-B (~30 w) | Residual **P2** global; **P1** donde falta self-check y el retro solo anuncia “siguiente E2” |
| **iDo why** | Todos en o sobre el piso (~45–60 w) | Pass |
| **Código/outputs** | Coherentes con theory y CASO-LIM-040; DEFECT bien nombrados; outputs canónicos intactos | none residual de integridad |
| **youDo frame** | context, objectives, requirements, rubric, portfolioNote (trío medida+dueño+consecuencia), retrospective de defensa (~62 w) | Pass — fuerte |
| **Hints E1** | Mayoría apuntan al DEFECT; **T1-A-E1** hint genérico de campos (menos preciso que el resto) | Residual **P2** |

**Net:** Round 1 cerró el vacío sistemático de prosa verbal y separó instruction de escena. Round 2 no es rubber-stamp: la sección está **lista para learner** en cobertura y en la gran mayoría de unidades; residuales son **calidad** (retros cortas en 24/24 weDo, eco feedback/retro en E2, self-check ausente en varios E1, un hint genérico). No hay P0 de cobertura ni defectos que invaliden outputs canónicos.

## Scoring key
| Score | Meaning |
|-------|---------|
| **A** | Newbie responde qué / por qué / éxito / qué queda; sin fix residual obligatorio |
| **B** | Usable; residual menor (eco, longitud, polish) |
| **C** | Parcial; residual R2 debería arreglarse (claridad, metacognición fina, integridad) |
| **D** | Falla el test de true-newbie en un ítem crítico (éxito invisible, wrong≈right total) |

Checklist: **context · goal · success · constraints · retrospective** → pass / partial / fail.

---

## Unit ledger

### S40-T1-A-DEMO (iDo) — **A**
- **Diagnosis:** Worked example sólido: complete True / attr / owner platform. Preamble pide predicción y ancla “QA ≠ adjetivo”. `why` (~55 w) en rango. Retrospective repara “bajo latencia” sin umbral y puente a We Do.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S40-T1-A-E1 (weDo, guided) — **B**
- **Diagnosis:** Title claro; bullets con éxito `S40-T1-A PASS`; instruction nombra DEFECT `>=`→`<=` + owner; feedback ancla dossier de Lima. Retro (~30 w) repite el principio del feedback y solo añade “siguiente E2”; sin self-check. Hint 1 es genérico de campos (no apunta a la dirección de la comparación).
- **Checklist:** all pass; retro partial (longitud + eco leve)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Umbral medible + dueño contactable es el mínimo de un QA auditable. Invertir observed/target no “arregla” el adverso de E2: lo disfraza de válido. Pregunta: con 280 vs 300, ¿qué imprime el gate si usas `>=` y por qué el happy path miente? Siguiente (E2): tres rutas schema / contenido / missing.
- **Proposed hint (optional):**  
  Reemplazar hint 1 por: “El DEFECT está en la dirección de la comparación (`>=` vs `<=`); no en los números del fixture.”
- **Code/output changes:** none

### S40-T1-A-E2 (weDo, independent) — **B+**
- **Diagnosis:** Tri-ruta limpia; éxito canónico. Feedback y retro alineados (schema antes que contenido) sin clonar frases enteras. Retro ~33 w (bajo piso).
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Schema (MISSING) se evalúa antes que contenido (REJECT). Acceder a `owner` cuando falta tumba el flujo; rellenar `platform` en silencio es otro anti-patrón. Pregunta: ¿por qué 410 ms con owner no es `MISSING`? Luego (E3): CONTINUE / REJECT / REQUEST en fail-closed.
- **Code/output changes:** none

### S40-T1-A-E3 (weDo, transfer) — **A−**
- **Diagnosis:** Fail-closed con REQUEST_QA_OWNER bien diferenciado de E2. Feedback y retro distinguen REQUEST vs REJECT; self-check “¿por qué no rellenar platform?” es excelente. Retro ~31 w (leve bajo piso).
- **Checklist:** all pass
- **Severity residual:** P2 opcional (alargar retro ~+10 w sin repetir feedback)
- **Proposed residual:** none required
- **Code/output changes:** none

### S40-T1-B-DEMO (iDo) — **B**
- **Diagnosis:** min_score + residual_ok claros. Preamble de “menor es mejor” fuerte. Retrospective corta (~30 w) sin self-check.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Menor score de costo gana; residual ≤ umbral con dueño que firma. El error clásico es maximizar “por costumbre de ranking” de ML. Pregunta: si usas `max`, ¿qué opción “gana” entre sync=3.8 y async=2.2 y por qué es la peor? We Do: trade-off medible con min y residual_ok.
- **Code/output changes:** none

### S40-T1-B-E1 (weDo, guided) — **B**
- **Diagnosis:** DEFECT max→min + residual ≤ 2 bien nombrado. Feedback ancla Red Andina. Retro (~27 w) eco del feedback sin self-check.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  min_score + residual con umbral es el contrato de T1-B. El starter con `max` “valida” la opción cara y deja el residual fuera del predicado. Pregunta: ¿por qué residual=2 con async min es PASS y residual=4 no? Siguiente (E2): PASS / REOPEN / MISSING residual.
- **Code/output changes:** none

### S40-T1-B-E2 (weDo, independent) — **B−**
- **Diagnosis:** Tri-ruta correcta. **Eco claro:** feedback y retro comparten “inventar residual=0 / cerrar el ticket”. Retro ~23 w.
- **Checklist:** all pass; retro partial (eco + longitud)
- **Severity residual:** P2 (eco merece reescritura del retro)
- **Proposed retrospective (replace):**  
  REOPEN_TRADEOFF es breach de **contenido** (score o residual mal); MISSING es **schema** (falta residual_risk). No son el mismo ticket en la mesa. Pregunta: si selected es max y residual=4, ¿por qué no basta con “arreglar” solo el residual? Luego (E3): ESCALATE_RESIDUAL_RISK ante incertidumbre.
- **Code/output changes:** none

### S40-T1-B-E3 (weDo, transfer) — **A−**
- **Diagnosis:** Transfer real ESCALATE vs REOPEN. Self-check “¿quién firma el residual en You Do?” excelente. Retro ~26 w.
- **Checklist:** all pass
- **Severity residual:** P2 opcional
- **Proposed residual:** none required
- **Code/output changes:** none

### S40-T2-A-DEMO (iDo) — **B+**
- **Diagnosis:** FORBIDDEN + infrastructure→domain permitida. Preamble de “salto de capa” fuerte. Retro ~31 w sin self-check.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Flechas permitidas y prohibidas se demuestran en el grafo, no “en la cabeza”. El error clásico es atar UI al SQL por velocidad de sprint. Pregunta: ¿por qué infrastructure→domain no es el mismo breach que domain→infrastructure? We Do: imprimir el grafo limpio y el PASS.
- **Code/output changes:** none

### S40-T2-A-E1 (weDo, guided) — **B**
- **Diagnosis:** Oficio de grafo + print de artefacto. Feedback fuerte. Retro muy corta (~20 w): solo principio + “siguiente E2”.
- **Checklist:** all pass; retro fail (demasiado corta / sin self-check)
- **Severity residual:** P1
- **Proposed retrospective (replace):**  
  Forbidden explícito gana a “sentir” las capas. El starter que exige todo hacia infrastructure es el anti-patrón del lab, no un atajo de sprint. Pregunta: si borramos la arista infrastructure→domain del print, ¿sigue siendo un grafo de Red Andina defendible? Siguiente (E2): PASS / REDRAW / MISSING dependencies.
- **Code/output changes:** none

### S40-T2-A-E2 (weDo, independent) — **B−**
- **Diagnosis:** Tri-ruta sólida. Eco “grafo vacío” entre feedback y retro. Retro ~23 w.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  REDRAW_BOUNDARY es breach de **contenido** (arista prohibida presente); MISSING es **ausencia de evidencia** (sin lista dependencies). Un grafo vacío no “demuestra” capas limpias. Pregunta: ¿qué imprime assess si dependencies=[] y layers están bien? Luego (E3): REVIEW_LAYER_OWNER.
- **Code/output changes:** none

### S40-T2-A-E3 (weDo, transfer) — **B+**
- **Diagnosis:** Fail-closed REVIEW_LAYER_OWNER. Self-check de arista prohibida bueno. Feedback corto (~17 w, bajo piso 25).
- **Checklist:** all pass; feedback partial (longitud)
- **Severity residual:** P2
- **Proposed feedback (expand):**  
  CONTINUE solo con capas limpias; saltos → REDRAW_BOUNDARY; grafo ausente → REVIEW_LAYER_OWNER. Incertidumbre no es breach demostrado: no inventes un grafo “por defecto” en el dossier de Red Andina.
- **Code/output changes:** none

### S40-T2-B-DEMO (iDo) — **B+**
- **Diagnosis:** Protocol + MemoryCaseRepo + implements_port. Preamble anti-SQLAlchemy clara. Retro ~31 w.
- **Checklist:** all pass; retro partial (longitud leve)
- **Severity residual:** P2 opcional
- **Proposed residual:** none required
- **Code/output changes:** none

### S40-T2-B-E1 (weDo, guided) — **B+**
- **Diagnosis:** Trío DIP bien enseñado; feedback y retro distinguen “nombre vs evidencia”. Retro ~29 w.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  implements_port + imports limpios + ≥3 tests es el trío DIP del lab. El error clásico es confiar en el sufijo *Repository*. Pregunta: ¿por qué adapter==port falla siempre en este fixture aunque el diseño sea hexagonal? Siguiente (E2): PASS / INVERT / MISSING contract_tests.
- **Code/output changes:** none

### S40-T2-B-E2 (weDo, independent) — **B−**
- **Diagnosis:** Adverso sqlalchemy excelente. Eco “PASS por nombre bonito” en feedback y retro. Retro ~23 w.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  INVERT_DEPENDENCY es breach de **contenido** (imports de infra o implements_port False); MISSING es schema de **evidencia de contrato**. No son el mismo ticket. Pregunta: con implements_port=True y domain_imports=[sqlalchemy], ¿qué debe devolver assess y por qué? Luego (E3): DEFINE_PORT_CONTRACT.
- **Code/output changes:** none

### S40-T2-B-E3 (weDo, transfer) — **A−**
- **Diagnosis:** DEFINE_PORT_CONTRACT vs INVERT bien diferenciados. Self-check “¿qué probarías al sustituir Memory por SQL?” excelente. Instruction ya aclara “no un booleano suelto” (cerró nota R1).
- **Checklist:** all pass
- **Severity residual:** P2 opcional
- **Proposed residual:** none required
- **Code/output changes:** none

### S40-T3-A-DEMO (iDo) — **A−**
- **Diagnosis:** ACL por filtrado de score (complementario al lab de sets). Preamble y why explican la diferencia con isdisjoint del We Do — puente verbal de R1 **presente**. Retro ~32 w.
- **Checklist:** all pass
- **Severity residual:** P2 opcional (self-check: “¿qué campo del JSON ER no debe llegar a intake?”)
- **Proposed residual:** none required
- **Code/output changes:** none

### S40-T3-A-E1 (weDo, guided) — **B+**
- **Diagnosis:** Context map + ACL case→record. Feedback aclara DDD real vs lab disjunto (excelente para newbie Master). Retro ~30 w.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Fronteras de lenguaje se demuestran con mapa + traducción. El starter trata intersección como éxito: eso fusiona glosarios. Pregunta: si case y record “parecen lo mismo” en negocio, ¿por qué el lab exige isdisjoint + ACL en lugar de un solo set? Siguiente (E2): PASS / SPLIT / MISSING translations.
- **Code/output changes:** none

### S40-T3-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Tri-ruta con case en ambos lados. Feedback y retro alineados sin eco literal fuerte. Retro ~22 w (corta).
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  SPLIT_CONTEXTS es breach de **modelo**; MISSING es falta de **mapa**. Improvisar traducciones en la UI de recepción no es un ACL. Pregunta: ¿por qué un translations={} con glosarios disjuntos no es PASS? Luego (E3): WORKSHOP_UBIQUITOUS_LANGUAGE.
- **Code/output changes:** none

### S40-T3-A-E3 (weDo, transfer) — **A−**
- **Diagnosis:** WORKSHOP vs SPLIT claros. Self-check de término de triage en intake excelente. Feedback y retro comparten “ausencia ≠ solape” de forma útil (no eco vacío).
- **Checklist:** all pass
- **Severity residual:** P2 opcional
- **Proposed residual:** none required
- **Code/output changes:** none

### S40-T3-B-DEMO (iDo) — **B+**
- **Diagnosis:** Entity/VO/merge/flags. Preamble “currency no es id”. Retro ~30 w.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Tres herramientas tácticas, tres invariantes. El error clásico es usar el id de la entity como “moneda” del VO. Pregunta: ¿por qué 150 PEN = 150 PEN aunque sean dos dicts distintos en memoria? We Do: checklist de identidad + PEN + merge 0.7.
- **Code/output changes:** none

### S40-T3-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Anti-patrón currency==entity_id excelente. Feedback ancla Red Andina. Retro ~26 w sin self-check.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Entity por id, VO por valor, servicio sin sesión. El starter “pasa” si currency==entity_id — un PASS imposible en el happy path real. Pregunta: ¿qué partes del predicado completo fallarían si solo arreglas el booleano y dejas merge sin calcular? Siguiente (E2): PASS / REJECT / MISSING service_stateless.
- **Code/output changes:** none

### S40-T3-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Adverso USD / id vacío. Retro ~22 w formulaica contenido/schema.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  REJECT_DOMAIN_MODEL es breach de **invariantes** (id, moneda, flags); MISSING es ausencia de bandera de servicio. No asumas service_stateless. Pregunta: con currency=USD y vo_frozen=False, ¿por qué no es MISSING? Luego (E3): CLARIFY_INVARIANT.
- **Code/output changes:** none

### S40-T3-B-E3 (weDo, transfer) — **A−**
- **Diagnosis:** CLARIFY_INVARIANT vs REJECT. Self-check NamedTuple vs flag excelente (ancla prod vs lab).
- **Checklist:** all pass
- **Severity residual:** P2 opcional
- **Proposed residual:** none required
- **Code/output changes:** none

### S40-T4-A-DEMO (iDo) — **B**
- **Diagnosis:** C4 + ADR accepted. Preamble “foto vs freno” memorable. Retro muy corta (~24 w).
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  C4 mínimo + ADR accepted con rollback operable. El error clásico es un archivo con títulos vacíos. Pregunta: si status=accepted pero falta rollback, ¿c4_ok y adr_ok pueden mentir por separado? We Do: ensamblar ADR-001 accepted de oficio.
- **Code/output changes:** none

### S40-T4-A-E1 (weDo, guided) — **B**
- **Diagnosis:** Oficio ADR+C4. Feedback “artefacto relleno” fuerte. Retro ~25 w.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Accepted = campos presentes + status firmable. El error clásico es PASS por tener un id ADR-001. Pregunta: ¿por qué el starter con status draft y len(adr)<3 nunca pasa con el fixture real del lab? Siguiente (E2): PASS / RETURN / MISSING adr_status.
- **Code/output changes:** none

### S40-T4-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Adverso C4 incompleto + “accepted” falso. Feedback ~19 w (bajo piso). Retro ~20 w.
- **Checklist:** all pass; feedback/retro partial (longitud)
- **Severity residual:** P2
- **Proposed feedback (expand):**  
  C4+ADR accepted completo → PASS; draft o campos incompletos → RETURN_ADR_TO_DRAFT; sin adr_status → MISSING. No asumas accepted por tener un id en el dossier de Red Andina.
- **Proposed retrospective (expand):**  
  RETURN_ADR_TO_DRAFT es breach de **contenido documental**; MISSING es schema de status. El error clásico es asumir accepted. Pregunta: ¿por qué un ADR con solo decision no es PASS aunque diga accepted? Luego (E3): REQUEST_ARCH_REVIEW.
- **Code/output changes:** none

### S40-T4-A-E3 (weDo, transfer) — **A−**
- **Diagnosis:** REQUEST_ARCH_REVIEW vs RETURN. Self-check de rollback en You Do excelente.
- **Checklist:** all pass
- **Severity residual:** P2 opcional
- **Proposed residual:** none required
- **Code/output changes:** none

### S40-T4-B-DEMO (iDo) — **B**
- **Diagnosis:** v1 ⊆ v11 + deuda fechada. Retro corta (~26 w).
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Aditivo + deuda fechada = evolución gobernada. El error clásico es “limpiar” v1 quitando status. Pregunta: si v11 = {case_id, priority}, ¿additive_ok es True o False y por qué el consumidor antiguo se rompe? We Do: v1 ⊆ v11 + vista del consumidor + debt.
- **Code/output changes:** none

### S40-T4-B-E1 (weDo, guided) — **B+**
- **Diagnosis:** Subconjunto invertido bien enseñado; feedback de consumer_view case_id:status claro. Retro ~27 w.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  v1 ⊆ v_next y deuda con fecha son el contrato de T4-B. El error clásico es invertir el subconjunto (breaking disfrazado de PASS). Pregunta: ¿por qué consumer_view debe ser igual en v1 y v11 si priority es aditivo? Siguiente (E2): PASS / BLOCK / MISSING retire_on.
- **Code/output changes:** none

### S40-T4-B-E2 (weDo, independent) — **B+**
- **Diagnosis:** Breaking al quitar status; preamble ya aclara comparación lexicográfica de fechas ISO (cerró P2 R1). Retro ~23 w.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  BLOCK_BREAKING_CHANGE es breach de **compat**; MISSING es falta de plan de retiro. El error clásico es negociar versión sin fecha. Pregunta: con retire_on vacío y v1 ⊆ v11, ¿qué imprime assess y por qué no es PASS? Luego (E3): NEGOTIATE_VERSION.
- **Code/output changes:** none

### S40-T4-B-E3 (weDo, transfer) — **A−**
- **Diagnosis:** NEGOTIATE vs BLOCK bien diferenciados. Self-check de campo aditivo en dossier excelente.
- **Checklist:** all pass
- **Severity residual:** P2 opcional
- **Proposed residual:** none required
- **Code/output changes:** none

### S40-youDo (youDo) — **A**
- **Diagnosis:** Marco de proyecto sólido (context/objectives/requirements/rubric). portfolioNote recuerda trío medida+dueño+consecuencia y BLOCKED por diseño. Retrospective de defensa en 3 preguntas (~62 w) alineada al patrón del spec. Starter con plantillas QA/context_map/C4/ADRs y evidence False a propósito.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective pass
- **Severity residual:** none
- **Proposed residual:** none required (opcional P2: una línea en retrospective que pida filas de relación/IA en el context map del requirements, sin inventar PII — el starter aún muestra 4 BC)
- **Code/output changes:** none

---

## Priority order (Round 2 Fixer)

### P0
- **Ninguno.** Cobertura de campos y outputs canónicos están en verde.

### P1 (metacognición fina)
1. **S40-T2-A-E1** — expandir retrospective (~20 w → 40–60 w con self-check); es el E1 más “cortado” del grafo de capas.
2. Opcional en el mismo lote: cualquier E1 cuyo retro solo diga “Siguiente (E2): …” sin pregunta de auto-chequeo (**T1-A-E1, T1-B-E1, T3-B-E1, T4-A-E1**).

### P2 (polish sistemático)
3. **Alargar retrospectives de los 24 weDo** hacia el piso ~40–80 palabras (hoy 24/24 están bajo 40). Priorizar las más cortas: T2-A-E1 (~20), T4-A-E2 (~20), T3-A-E2 / T3-B-E2 / T2-A-E2 / T1-B-E2 / T4-B-E2 (~22–23).
4. **Romper eco feedback↔retro en E2:** especialmente **T1-B-E2** (residual=0), **T2-A-E2** (grafo vacío), **T2-B-E2** (nombre bonito). Feedback = corrección inmediata; retro = principio + misconception distinto + transfer + self-check.
5. **iDo retros cortas:** T4-A-DEMO, T4-B-DEMO, T1-B-DEMO (+ self-check).
6. **Feedback bajo piso:** T2-A-E3 (~17 w), T4-A-E2 (~19 w).
7. **Hint T1-A-E1:** apuntar a la dirección de comparación, no solo a la lista de campos.
8. Opcional: youDo retrospective — una mención a completar filas relación/IA del requirements.

Orden sugerido para el Fixer: P1 (T2-A-E1) → lote de retros E1 cortas → lote E2 eco → iDo demos cortas → feedback cortos → hint T1-A.

---

## Residual risks
- **Plantilla assess/decide:** las 24 unidades comparten esqueleto E2/E3; si el Fixer alarga retros con un párrafo genérico “contenido vs schema”, el eco empeora. Cada retro debe nombrar el **artefacto** del subtema (QA, residual, grafo, DIP, ACL, entity/VO, ADR, consumer contract).
- **Nivel Master vs true newbie:** vocabulario DDD/C4/ADR es denso; preambles ya anclan Red Andina — no diluir contratos al expandir retros.
- **Demo T3-A vs lab T3-A:** puente verbal presente (why + retro de demo); no unificar código ACL-filtro vs isdisjoint.
- **You Do scope:** requirements piden relación/IA; starter tiene 4 BC — el learner debe ampliar; no bajar la rúbrica.
- **No tocar outputs canónicos** salvo execute-and-diff justificado.
- **Anti-aberración:** este informe no editó `s40-agentic-architecture.ts`; solo reporta.

---

## Counts for Fixer acceptance (post Round-2 fix)

- [ ] P1: retrospective de **T2-A-E1** (y E1 cortos si se tocan) con principle + misconception + transfer + self-check; ≥ ~40 palabras
- [ ] P2: retros weDo prioritarias alargadas sin clonar feedback
- [ ] P2: eco E2 (T1-B / T2-A / T2-B) roto
- [ ] P2 opcional: iDo demos T4-A/B y T1-B; feedback T2-A-E3 / T4-A-E2; hint T1-A-E1
- [ ] Outputs exactos preservados
- [ ] Español PE; sin PII real; sin generadores
- [ ] Sección compila en build estático

---

## Score snapshot (Round 2)

| Band | Units (approx.) |
|------|-----------------|
| **A / A−** | Demos fuertes (T1-A, T3-A); transfers E3 con self-check (T1-A/B, T2-B, T3-A/B, T4-A/B); youDo |
| **B / B+** | Mayoría de E1 y E2 usables; demos restantes |
| **B−** | E2 con eco explícito (T1-B-E2, T2-A-E2, T2-B-E2) |
| **C / D** | **Ninguno** en cobertura ni integridad de código |

**Veredicto:** listo para learner; Round-2 Fix es **tighten** (retros + eco), no reescritura de scaffolding.

---

Section 40 exercise pedagogy review complete. Ready for the Fixer prompt.
