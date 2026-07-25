# S51 Exercise Pedagogy Report (Round 2)

## Section
- **title:** Observabilidad, gobernanza y UX del copiloto
- **shortTitle:** Obs y UX copiloto
- **id:** `integrator-final`
- **index:** 51
- **source:** `src/lib/course/sections/s51-integrator-final.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades)
- **subtemas:** S51-T1-A traces/PII · T1-B tokens/costo/latencia/redacción · T2-A registry pin · T2-B dual-control/audit · T3-A multi-SLI/drift/owner · T3-B incidente/rollback/RTO · T4-A UX incertidumbre/citas/confirmación · T4-B a11y/corrección/apelación
- **hilo de caso:** entidad ficticia de **Moquegua** · `CASO-MOQ-051` — **Auditable AI Operations Copilot** y freeze **CF-5**; stdlib + fixtures sintéticos; sin PII real
- **Round 1 context:** `round1/S51_EXERCISE_PEDAGOGY_REPORT.md` (solo contraste; **no** rubber-stamp)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (preamble/retrospective checklists, E1→E3 fade, length targets 80–150 preamble / 40–80 retro / 40–100 instruction / 40–90 why / 25–60 feedback, anti-aberration).
- Manually re-inspected **current** source for every `iDo.steps[]` (8), `weDo.steps[]` (24) y `youDo` (title, preamble, instruction, feedback, retrospective, starter `# DEFECT`, solution output, why).
- Integrity traps checked live:
  1. **Starters invertidos sobre fixture válido:** E1 de cada subtema falla el PASS canónico (predicado al revés: PII/spans, total==0 o p95 alto, latest/mutable, self-approve, SLI invertido, sin contención, sin confirmación, solo-mouse/contraste). Correcto: el learner ve breach y repara.
  2. **E2/E3 reutilizan el predicado de dominio** y cambian la **superficie** (tabla assess vs. códigos de acción). Fade de *código* es estructuralmente repetitivo; fade de *decisión* es real (PASS/breach/MISSING → CONTINUE/breach/restore).
  3. **missing → CONTINUE en starters E3** en los 8 subtemas — defecto de promote silencioso bien nombrado; solution enruta RESTORE/FIX/REGISTER/REQUEST/TRIAGE/CONVENE/ASK/ROUTE.
  4. **missing ≠ breach** coherente en E2 (clave ausente) vs. adverso con contenido roto (PII True, total descuadrado, `latest`, self-approve, owner vacío, etc.).
- Scored for a **true newbie to AI ops** (qué / por qué / éxito / qué queda), independent of Round-1 proposals. S51 es Master: no se diluye rigor; sí se exige escena y éxito observable.
- Word counts measured only as gates (no bulk prose generation).
- No generators, bulk templates, or source edits.

## Global findings (post Round-1 fix)

| Area | Status | Residual impact |
|------|--------|-----------------|
| **Field coverage** | Complete: 8 iDo con `preamble`+`why`+`retrospective`; 24 weDo con `title`+`preamble`+`instruction`+`feedback`+`retrospective`; youDo con `retrospective` + marco sólido | Round-1 P0 “cero campos” **cerrado** |
| **We Do titles** | Presentes, 5–9 palabras, español PE, alineados al skill del subtema | Pass |
| **Preamble shape** | weDo en bullets contexto/meta/éxito/límites (≈38–75 w; spec permite “4 short bullets”); iDo narrativos con predicción pedida (≈55–81 w; varios bajo 80 narrativo) | Pass en estructura; iDo T2-A/T4-A algo cortos vs 80–150 |
| **Instruction = steps** | Solo-tarea, ordenados; E1 nombra el defect del starter; E2/E3 con menos migas de “por qué” | Pass; varias E2 ~14–21 w (bajo piso 40 — OK por independent/minimal) |
| **E1→E2→E3 fade** | Superficies distintas: predicado → assess PASS/breach/MISSING → decide CONTINUE/breach/rama. Escenas diferenciadas por artefacto del copiloto | Pass — no tres clones de *contenido*; residual **esqueleto de prosa** E1/E2 muy homogéneo entre subtemas |
| **Feedback vs retrospective** | Feedback razona principio + ancla auditor/CF-5/Moquegua; en **~14/24** weDo el retro **eco** del feedback (mismo principio + “siguiente E2/E3”) sin self-check en E1/E2 | Residual **P2** sistemático |
| **Retrospective length** | weDo mediana ≈23–35 w (spec 40–80); E3 suelen tener pregunta self-check (mejor); E1 a menudo solo “principio + error clásico + siguiente”. iDo demos ~26–47 w (solo T1-A en rango pleno) | Residual **P2** (pocos **P1** de metacognición en temas de alto riesgo: PII export, dual-control, IR order, a11y gate) |
| **iDo why** | Todos en o cerca del rango 40–90; anclan contrato y puente a We Do | Pass |
| **Código/outputs** | Coherentes con theory y CF-5; DEFECT bien nombrados; outputs canónicos preservados; starters fallan el fixture válido | none required |
| **youDo frame** | context CF-5 + CP-N4-C, objectives, requirements, rubric, portfolioNote (BLOCKED→READY), starter con helpers de dominio, retrospective de defensa (~78 w) | Pass — fuerte |
| **Hints E1** | Casi-solución (aceptable guided) | Residual **P2** opcional |
| **Hints E2/E3** | Dan la regla casi completa (andamiaje mínimo OK para Master) | Residual **P2** opcional |
| **Acumulación producto** | Preambles anclan eslabones (traza → métricas → pin → change → SLI → IR → UX → a11y) hacia youDo | Pass — R1 risk #6 mitigado |

**Net:** Round 1 cerró el vacío sistemático de prosa verbal (title/preamble/instruction/retrospective) y amplió `why`/feedback. Round 2 no es rubber-stamp: la sección está **lista para learner** en la gran mayoría de unidades; residuales son **calidad** (retros cortas, eco feedback/retro, esqueleto E1/E2 homogéneo, preambles iDo ligeramente cortos). **No hay P0** de cobertura ni defectos que invaliden outputs canónicos.

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

### S51-T1-A-DEMO (iDo) — **A**
- **Diagnosis:** Worked example de traza padre/hijo con predicción pedida (dict PASS + `REDACT_AND_QUARANTINE_TRACE`). Preamble ancla ticket Moquegua y “no limpiar después del export”. `why` en rango (árbol, `tr-`, fail-closed, puente We Do). Retrospective repara “answer sin retrieval” y export-PII; ~47 w, en rango.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective pass
- **Severity residual:** none
- **Proposed residual:** none required (opcional P2: self-check “¿por qué `pii=True` no imprime el dict de spans?”)
- **Code/output changes:** none

### S51-T1-A-E1 (weDo, guided) — **B**
- **Diagnosis:** Title claro; bullets con éxito exacto `S51-T1-A PASS`; instruction nombra el bug `not trace_id or pii_in_trace`. Feedback ancla auditor/cuarentena. Retro (~33 w) eco parcial + puente a E2; sin self-check.
- **Checklist:** all pass; retro partial (longitud + eco)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Traza auditable = `tr-` + cuatro spans + versiones pinneadas + cero PII a la vez. El starter aprueba basura porque invierte el booleano: el auditor de Moquegua vería “PASS” justo cuando hay que cuarentenar. Pregunta: si solo existe el span `answer`, ¿qué falta para reconstruir la decisión? Siguiente (E2): PASS / cuarentena / MISSING:pii_in_trace.
- **Code/output changes:** none

### S51-T1-A-E2 (weDo, independent) — **A−**
- **Diagnosis:** Fade real a tres rutas. Preamble “missing ≠ cuarentena de PII” excelente. Feedback y retro alineados pero no idénticos (schema vs contenido). Retro ~40 w en piso del rango.
- **Checklist:** all pass
- **Severity residual:** none (opcional P2: self-check “¿falta de clave = email en el sink?”)
- **Proposed residual:** none required
- **Code/output changes:** none

### S51-T1-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Transfer auténtico a CONTINUE / cuarentena / RESTORE. Starter missing→CONTINUE y helpers invertidos (promote silencioso). Retro con pregunta cuarentena vs RESTORE — metacognición usable. Fade real desde E1/E2.
- **Checklist:** all pass
- **Severity residual:** none (hints casi dan la regla — P2 opcional)
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S51-T1-B-DEMO (iDo) — **B**
- **Diagnosis:** Demo clara 1500 tokens / 0.003 / p95 / `[REDACTED]`. Preamble en rango (~81 w) con predicción. `why` sólido. Retro telegráfica (~27 w): principio + error media + We Do; sin self-check ni ancla de costo = f(tokens).
- **Checklist:** all pass; retro partial (longitud / self-check)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Costo creíble = tokens reconciliados por etapa + p95 (no media) + sink limpio. El error clásico es promediar picos de latencia o exportar email “para depurar”. Pregunta: si el total miente, ¿por qué el costo en USD también miente? We Do: predicado, tres rutas y helpers de compute/redacción.
- **Code/output changes:** none

### S51-T1-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Starter aprueba total 0 o p95 > SLO — excelente. Instruction guiada. Feedback con escena on-call. Retro corta (~24 w) sin self-check.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Dashboard sano = suma por etapa == total + p95 ≤ SLO + al menos un campo redactado. El starter celebra un dashboard vacío o lento. Pregunta: ¿un total “bonito” de 1500 sin sumar etapas prueba reconciliación? Siguiente (E2): PASS / ALERT / MISSING:redacted_fields.
- **Code/output changes:** none

### S51-T1-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Tres rutas sólidas; feedback ya ancla “en E3 será FIX_REDACTION_PIPELINE”. Retro (~27 w) repite ese puente casi palabra por palabra.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  MISSING de redacción es incertidumbre de export, no un p95 alto. Total descuadrado o redacted_fields=0 es ALERT por contenido. El error clásico es inventar `redacted_fields=1` para forzar PASS. Pregunta: ¿en qué orden evalúas schema vs suma de tokens? Luego (E3): CONTINUE / ALERT / FIX_REDACTION_PIPELINE.
- **Code/output changes:** none

### S51-T1-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** Helpers `reconcile_tokens` / `estimate_cost_usd` / `export_clean`; assert 0.003. Retro con self-check p95 vs media. Fuerte.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S51-T2-A-DEMO (iDo) — **B**
- **Diagnosis:** Pin `copilot-7` vs `latest`/mutable con tres salidas a predecir. Preamble corto (~55 w) pero legible. Retro (~27 w) thin; misconception “CI actualiza latest” está bien nombrado.
- **Checklist:** all pass; pre/retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Release auditable = pin de cada artefacto + inmutabilidad. El error clásico es confiar en `latest` “porque el CI lo actualiza”. Pregunta: si el post mortem no puede nombrar modelo y prompt del día del incidente, ¿qué falló en el registry? We Do: predicado, tres rutas y helpers de pin.
- **Code/output changes:** none

### S51-T2-A-E1 (weDo, guided) — **B**
- **Diagnosis:** Title y bullets claros; instruction breve pero defect nombrado. Feedback ancla CF-5. Retro (~27 w) eco “solo mirar el número de release”.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Pin = reproducibilidad del post mortem y del system card. El starter aprueba mutable o `latest`. Pregunta: ¿basta el string `copilot-7` si el modelo es `latest`? Siguiente (E2): PASS / FREEZE / MISSING:immutable.
- **Code/output changes:** none

### S51-T2-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Tres rutas; feedback alinea MISSING vs FREEZE y puente E3. Retro eco del feedback (~23 w).
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Falta de flag `immutable` no es lo mismo que bundle con `latest`: una es incertidumbre de registro, la otra es breach de prod. El error clásico es inventar `immutable=True` para pasar la tabla. Pregunta: ¿por qué no evalúas pins si falta la clave? Luego (E3): CONTINUE / FREEZE / REGISTER_MISSING_VERSION.
- **Code/output changes:** none

### S51-T2-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Helpers pin/inmutable; starter missing→CONTINUE. Retro con self-check system card vs `latest`. Fuerte.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S51-T2-B-DEMO (iDo) — **B+**
- **Diagnosis:** Dual-control con predicción PASS/REJECT. Preamble sólido (~69 w). Retro (~31 w) con misconception “owner de vacaciones”; casi en rango.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Dual-control = dos personas + scope `-read` + retención acotada + audit append-only. El error clásico es autoaprobar “porque el owner está de vacaciones”. Pregunta: ¿un wiki editable de aprobaciones es audit append-only? We Do: predicado, tres rutas y helpers SoD/policy.
- **Code/output changes:** none

### S51-T2-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Starter self-approve/admin — claro. Feedback razona SoD. Retro (~33 w) sin self-check formal.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Gobernanza operable = SoD + least privilege + TTL ≤30 + audit append-only. El starter celebra self-approve. Pregunta: si hay un “aprobador” en el ticket pero es la misma persona que el autor, ¿hay dual-control? Siguiente (E2): PASS / REJECT / MISSING:audit_append_only.
- **Code/output changes:** none

### S51-T2-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Adverso rico (self-approve, risk unknown, admin, 3650 días). Retro eco del puente REQUEST (~23 w).
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  MISSING de audit no es REJECT por SoD: aún no sabes si el rastro es append-only. Self-approve o `global-admin` sí son REJECT por contenido. Pregunta: ¿retención 3650 días es “más seguro” o más exposición de PII en ops? Luego (E3): CONTINUE / REJECT / REQUEST_INDEPENDENT_APPROVAL.
- **Code/output changes:** none

### S51-T2-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** Helpers `sod_ok` / `access_policy_ok`. Retro con self-check retención eterna. Fuerte.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S51-T3-A-DEMO (iDo) — **B**
- **Diagnosis:** Multi-SLI + burn 0.2 + incidente por faithfulness. Preamble con predicción. Retro (~27 w) thin sobre thumbs-down.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Señal accionable = multi-SLI + umbral + owner del runbook. El error clásico es reentrenar por thumbs-down sin slice ni baseline. Pregunta: ¿por qué un burn de 0.2 aún no es “quemar el presupuesto” en ventana 100? We Do: predicado, tres rutas y burn.
- **Code/output changes:** none

### S51-T3-A-E1 (weDo, guided) — **B**
- **Diagnosis:** Starter invierte availability/drift. Instruction pide faithfulness + owner. Retro corta (~23 w).
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Un solo float de uptime no basta para un copiloto: faithfulness y drift también cuentan, y sin owner no hay runbook. El starter marca PASS cuando el slice está roto. Pregunta: ¿inventas un owner para “cerrar el gate”? Siguiente (E2): PASS / OPEN / MISSING:owner.
- **Code/output changes:** none

### S51-T3-A-E2 (weDo, independent) — **A−**
- **Diagnosis:** Distingue bien owner vacío en adverso (OPEN) vs clave ausente (MISSING). Feedback y retro útiles; retro corta pero no puro eco.
- **Checklist:** all pass
- **Severity residual:** none (opcional P2: alargar self-check)
- **Proposed residual:** none required
- **Code/output changes:** none

### S51-T3-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Burn + `sli_ok` + TRIAGE. Retro con self-check burn 0.2. Fuerte; assert 0.2 en solution.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S51-T3-B-DEMO (iDo) — **B+**
- **Diagnosis:** Orden contener→rollback→comunicar→post mortem con predicción. Preamble fuerte (~78 w). Retro (~30 w) con “seguir investigando en prod”.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  IR de IA = timeline con reloj (RTO) y dueños, no un chat de culpas. El error clásico es debatir la causa en prod sin congelar el release. Pregunta: si el rollback tardó 90 min con RTO 10, ¿qué imprime el gate y por qué no es “casi PASS”? We Do: predicado, tres rutas y helpers RTO/IR.
- **Code/output changes:** none

### S51-T3-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Starter sin contención o fuera de RTO. Feedback sólido. Retro la más corta del set E1 (~19 w) — metacognición débil para un tema de alto riesgo.
- **Checklist:** all pass; retro partial (longitud — **borde P1**)
- **Severity residual:** P1
- **Proposed retrospective (expand):**  
  Contener primero, explicar después: contención + pin `copilot-*` + minutos ≤ RTO + ≥1 acción + owners. El starter aprueba un simulacro sin contención o con reloj quemado. Pregunta: ¿un post mortem de 4 acciones sin `contained=True` cierra el incidente? Siguiente (E2): PASS / ROLLBACK / MISSING:owners_assigned.
- **Code/output changes:** none

### S51-T3-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Tres rutas claras. Retro eco CONVENE vs ROLLBACK (~26 w).
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Falta de `owners_assigned` es incertidumbre de roles; sin contención es breach de respuesta. El post mortem no sustituye la contención inmediata. Pregunta: ¿por qué no inventas `owners_assigned=True` para “cerrar” la tabla? Luego (E3): CONTINUE / ROLLBACK / CONVENE_INCIDENT_REVIEW.
- **Code/output changes:** none

### S51-T3-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** Helpers `within_rto` / `ir_complete`. Retro con self-check blameless vs “el on-call falló”. Fuerte.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S51-T4-A-DEMO (iDo) — **B**
- **Diagnosis:** UX con PASS / BLOCK. Preamble ~60 w (bajo 80). Retro ~29 w; misconception auto-ejecutar tools bien nombrado.
- **Checklist:** all pass; pre/retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  UX contestable = incertidumbre visible + citas resolubles + efecto explícito + OK humano cuando se exige. El error clásico es auto-ejecutar tools de escritura. Pregunta: ¿“prepara borrador” es el mismo side-effect que “envía a producción”? We Do: predicado, tres rutas y helpers de evidencia/confirmación.
- **Code/output changes:** none

### S51-T4-A-E1 (weDo, guided) — **B**
- **Diagnosis:** Starter invierte uncertainty/citations/confirmed. Instruction muy breve (~20 w) pero steps 1–4 legibles. Retro (~27 w) con buen ancla “prepara borrador ≠ envía a producción”.
- **Checklist:** all pass; instruction/retro partial (longitud)
- **Severity residual:** P2
- **Proposed residual:** none obligatorio; opcional expandir instruction paso 2 con `effect_summary` explícito si el Fixer toca la unidad (solution ya lo exige).
- **Code/output changes:** none

### S51-T4-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Tres rutas; instruction mínima (~14 w). Retro distingue ASK vs BLOCK — bien. Preamble OK.
- **Checklist:** all pass; instruction partial (muy corta)
- **Severity residual:** P2
- **Proposed instruction (optional expand):**  
  1. Starter: PASS si falta incertidumbre/citas/`confirmed` (bug invertido).  
  2. Primero `missing` de required; si hay → `MISSING:…`.  
  3. Luego evidence + (not confirmation_required or confirmed).  
  4. Imprime la tripleta en orden.
- **Code/output changes:** none

### S51-T4-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Helpers evidence/confirm; starter missing→CONTINUE. Retro con self-check effect_summary en audit T2. Fuerte.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S51-T4-B-DEMO (iDo) — **B**
- **Diagnosis:** a11y + appeal con predicción. Preamble ~62 w. Retro ~26 w thin; “banner sin teclado” es buen misconception.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Contestabilidad completa = WCAG AA (teclado, labels, contraste ≥4.5) + corrección del dato + apelación humana. El error clásico es un banner de disclaimer en un panel solo-mouse. Pregunta: si el contraste es 5.1 pero no hay `appeal_to_human`, ¿cierra CF-5? We Do: predicado, tres rutas y helper WCAG.
- **Code/output changes:** none

### S51-T4-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Starter solo-mouse/contraste/appeal invertidos. Feedback ancla portfolio. Retro (~26 w) sin self-check.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Accesibilidad es gate de producto CF-5, no polish final. El starter aprueba paneles ilegibles o sin teclado. Pregunta: ¿comparas contraste con `>=` o con igualdad exacta, y por qué importa 5.1 vs 4.5? Siguiente (E2): PASS / FAIL / MISSING:appeal_to_human.
- **Code/output changes:** none

### S51-T4-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Tres rutas; retro eco ROUTE vs FAIL. Usable.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  MISSING de appeal es incertidumbre de ruta humana; contraste 2.1 o teclado incompleto es FAIL de contenido. El error clásico es promocionar un panel “bonito” que el usuario no puede operar. Pregunta: ¿por qué no evalúas contraste si falta la clave de appeal? Luego (E3): CONTINUE / FAIL / ROUTE_CONTESTATION.
- **Code/output changes:** none

### S51-T4-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** `meets_wcag_aa` completo; starter missing→CONTINUE e ignora labels/corrección. Retro con self-check enlace appeal↔trace_id/release. Cierra el hilo T1→T4. Fuerte.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

---

### youDo (portafolio CF-5) — **A**
- **Diagnosis:** Marco de proyecto **sólido**: context CF-5 + CP-N4-C, objectives, requirements, rubric, portfolioNote y starter con helpers de dominio que ensamblan T1–T4. Checklist inicia BLOCKED con dicts vacíos — anti-trampa intacta. Retrospective de defensa (~78 w) con tres preguntas (reconstrucción, PII real vs sintético, frase de impacto 30 s). No duplica el context en un segundo ensayo.
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective pass
- **Severity residual:** none
- **Proposed residual:** none required (no “arreglar” el starter BLOCKED)
- **Code/output changes:** none

---

## Priority order

### P0
- **Ninguno.** Cobertura de campos y outputs canónicos están en verde.

### P1 (metacognición en tema de alto riesgo)
1. **S51-T3-B-E1** — retrospective ~19 w; expandir contención-antes-de-explicar + self-check (texto propuesto arriba).

### P2 (polish de calidad; batch opcional por subtema)
1. **iDo retros cortas** (expandir con self-check): T1-B, T2-A, T2-B, T3-A, T3-B, T4-A, T4-B demos (T1-A ya OK).
2. **weDo E1 retros** (expandir principio + self-check, no solo “siguiente E2”): T1-A/B, T2-A/B, T3-A, T4-A/B E1.
3. **weDo E2 retros eco** (reemplazar para distinguir schema vs contenido sin repetir feedback): T1-B-E2, T2-A-E2, T2-B-E2, T3-B-E2, T4-B-E2 (y similares).
4. **Instructions E2 muy cortas** (opcional, p. ej. T4-A-E2 ~14 w): añadir un paso que nombre el defect del starter sin ensayo.
5. **Hints E1:** mantener guided; si se reescribe, evitar pegar la expresión booleana completa de la solution.
6. **Esqueleto homogéneo E1/E2 entre subtemas:** al expandir retros, variar el ancla de rol (auditor / on-call / revisor de plataforma / usuario final) para no sonar a plantilla.

### Leave as-is (A / A−)
- E3 de los 8 subtemas (transfer + self-check en la mayoría).
- T1-A-DEMO, T1-A-E2, youDo.
- Código, outputs, starters DEFECT, portfolio BLOCKED-by-design.

---

## Residual risks

1. **Retros telegráficas:** el learner cierra la pestaña con el print PASS pero sin poder responder “qué debe quedarme” en 30 s — especialmente IR (T3-B) y a11y (T4-B). Fix: expandir P1/P2 propuestos, no añadir teoría nueva.
2. **Eco feedback ≈ retrospective en E2:** refuerza el mismo párrafo dos veces; el self-check se pierde. Preferir retro que *contraste* missing vs breach.
3. **Homogeneidad de esqueleto** entre subtemas: el código ya hace fade real; el riesgo residual es prosa que se siente copy-paste de “error clásico + siguiente E2”. Variar anclas de rol/producto.
4. **Vocabulario de acciones:** no renombrar outputs (`REDACT_AND_QUARANTINE_TRACE`, `FREEZE_RELEASE_BUNDLE`, `ROLLBACK_AND_CONTAIN`, etc.) — solo envolver pedagogía.
5. **Master-level vs newbie:** no diluir rigor de dual-control/RTO/WCAG; sí mantener escena Moquegua y éxito exacto imprimible.
6. **You Do anti-trampa:** no rellenar dicts del starter ni asignar `True` a mano en helpers.
7. **PII sintético:** mantener `example.pe` / sin PII real en cualquier prosa nueva.
8. **Sobre-fix R2:** no reescribir preambles que ya pasan checklist; priorizar retros E1 de IR y demos iDo thin.

---

## Fixer acceptance hints (Round 2)

- [ ] Sin cambios de output canónico ni de DEFECT de starters salvo bug de ejecución demostrado  
- [ ] Priorizar **S51-T3-B-E1** retrospective (P1)  
- [ ] Expandir retros iDo thin y E1/E2 eco (P2) con self-check donde falte  
- [ ] No tocar youDo starter BLOCKED  
- [ ] Español PE; fixtures `CASO-MOQ-051`; sin generadores  
- [ ] Section compila en static build  

---

Section 51 exercise pedagogy review complete. Ready for the Fixer prompt.
