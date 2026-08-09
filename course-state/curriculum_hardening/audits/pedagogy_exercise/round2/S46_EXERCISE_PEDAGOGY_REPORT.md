# S46 Exercise Pedagogy Report (Round 2)

## Section
- **title:** Ingeniería de datos y orquestación de producción
- **shortTitle:** Data eng producción
- **id:** `gpu-computing` (archivo `s46-gpu-computing.ts`; el **contenido** es pipeline de datos de producción — watermarks, late policy, DAG, backfill, contratos, lineage, merge incremental, SLI/SLO — **no** “GPU computing”)
- **index:** 46
- **source:** `src/lib/course/sections/s46-gpu-computing.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades)
- **subtemas:** T1-A event-time/watermarks · T1-B exactly-once + late policy · T2-A DAG acíclico · T2-B backfill/checkpoint · T3-A contratos/freshness · T3-B lineage/ownership · T4-A merge incremental · T4-B SLI/SLO/RTO
- **hilo:** clínica ficticia **CASO-HYO-046** (Huancayo sintético); gate **CP-N4-B** (backfill idempotente, freshness SLO, lineage, sin DAG cíclico); **missing ≠ breach**; late data nunca se mezcla en silencio
- **Round 1 context:** `round1/S46_EXERCISE_PEDAGOGY_REPORT.md` (solo contraste; **no** rubber-stamp)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (preamble/retrospective checklists, E1→E3 fade, length targets 80–150 preamble / 40–80 retro / 40–100 instruction / 40–90 why / 25–60 feedback, anti-aberration).
- Manually re-inspected **current** source for every `iDo.steps[]` (8), `weDo.steps[]` (24) y `youDo` (title, preamble, instruction, feedback, retrospective, starter `# DEFECT`, solution output, why).
- Integrity traps checked live:
  1. **Starters invertidos sobre fixture válido:** E1 de cada subtema falla el PASS canónico (p. ej. T1-A-E1 aprueba late/out-of-window; T1-B-E1 usa `len` o policy vacía; T2-A-E1 no verifica ciclos; T2-B-E1 invierte solape; T3-A-E1 invierte schema/lag y omite owner; T4-A-E1 invierte keys/delta; T4-B-E1 invierte sli/rto). Correcto: el learner ve breach y repara el predicado.
  2. **E2/E3 reutilizan el bug de dominio** y cambian la **superficie** (assess tres rutas → decide CONTINUE/breach/incertidumbre). Fade de *código* isomorfo por diseño; fade de *decisión* es real.
  3. **Missing → CONTINUE en starters E3** (promote silencioso) en todos los subtemas — defect didáctico correcto.
  4. **Tautologías** `meets_contract = ('…' == '…')` en 16 solutionCode E2/E3: print-theater menor; tokens de salida intactos.
- Scored for a **true newbie** (qué / por qué / éxito / qué queda), independent of Round-1 proposals.
- Word counts measured only as gates (no bulk prose generation).
- No generators, bulk templates, or source edits.

## Global findings (post Round-1 fix)

| Area | Status | Residual impact |
|------|--------|-----------------|
| **Field coverage** | Complete: 8 iDo con `preamble`+`why`+`retrospective`; 24 weDo con `title`+`preamble`+`instruction`+`feedback`+`retrospective`; youDo con `retrospective` + marco sólido | Round-1 P0 “cero campos” **cerrado** |
| **We Do titles** | Presentes, 5–9 palabras, español PE, alineados al skill; E3 a veces omite el 3er token en el título (p. ej. “CONTINUE o WAIT” sin SIDE_OUTPUT) | Pass; polish P2 opcional en títulos E3 |
| **Preamble shape** | weDo en bullets contexto/meta/éxito/límites (≈38–61 w; spec permite “4 short bullets”); iDo narrativos con predicción pedida (≈51–89 w; T1-A en rango 80+; resto a menudo bajo piso 80 pero legibles) | Pass en estructura |
| **Instruction = steps** | Solo-tarea, ordenados; E1 nombra el DEFECT; E2/E3 con menos migas | Pass; muchas 20–35 w (bajo piso 40; no bloquear en Master transfer) |
| **E1→E2→E3 fade** | Superficies distintas: predicado de dominio → assess PASS/breach/MISSING → decide CONTINUE/breach/rama operativa. Escenas por subtema (ventana, sink, DAG, backfill, contrato, lineage, merge, ops) | Pass — **no** clones numéricos |
| **Feedback vs retrospective** | Feedback razona bug + impacto Huancayo/promote; en **~12–16/24** weDo el retro **eco** del feedback (mismo principio, poco self-check en E1/E2; E3 suele traer pregunta) | Residual **P2** sistemático; peores = **P1** de metacognición |
| **Retrospective length** | weDo mediana ≈19–33 w (spec 40–80); peores: T3-B-E2 (~15), T3-A-E1 (~19), T4-B-E2 (~19), T4-A-E2 (~20). iDo demos ~24–49 w (solo T1-A cerca del piso 40) | Residual **P2** (pocos **P1** por telegráficos) |
| **Feedback length** | ~10–12 unidades &lt;25 w (piso); peores ~19–21 w en varios E2/E3 | Residual **P2** |
| **iDo why** | 8/8 en rango ~45–73 w; anclan principio + puente We Do | Pass |
| **Código/outputs** | Coherentes con theory y CP-N4-B; DEFECT bien nombrados; outputs canónicos preservados; starters fallan el fixture válido | none required |
| **youDo frame** | context CP-N4-B, objectives, requirements, rubric 6 criterios, portfolioNote, starter con labels/accepted/unique_batch, retrospective de defensa (~70 w) | Pass — fuerte |
| **Hints E1** | Casi-solución (aceptable guided) | Residual **P2** opcional |
| **Hints E2/E3** | Dan la regla casi completa (andamiaje mínimo OK para Master) | Residual **P2** opcional |
| **Id archivo vs contenido** | `gpu-computing` / `s46-gpu-computing.ts` vs título real | No es gap de ejercicio; otra campaña |

**Net:** Round 1 cerró el vacío sistemático de prosa verbal (title/preamble/instruction/retrospective) y amplió `why`/feedback. Round 2 no es rubber-stamp: la sección está **lista para learner** en la gran mayoría de unidades; residuales son **calidad** (ecos feedback/retro, retros E1/E2 cortas sin self-check, feedback bajo piso, tautologías `meets_contract`). **No hay P0** de cobertura ni defectos que invaliden outputs canónicos. Prioridad del Fixer R2 = **P1 selectivo + P2 polish**, no reescritura estructural.

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

### S46-T1-A-DEMO (iDo) — **A**
- **Diagnosis:** Worked example fuerte: stream → wm 110, etiquetas 112/100/105. Preamble (~89 w) en rango, pide predicción y repara *processing time* vs *event time*. `why` (~73 w) ancla watermark como aserción y gracia post-wm. Retro (~49 w) con self-check implícito (“si puedes explicar…”) y puente We Do.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S46-T1-A-E1 (weDo, guided) — **A−**
- **Diagnosis:** Title claro; bullets con éxito exacto `S46-T1-A PASS` y límites anti bound inventado. Instruction nombra bug invertido y da la fórmula (guided OK). Feedback razona basura en dashboard; retro (~33 w) principio + error clásico + puente E2, sin self-check.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Aceptación de ventana = en ventana y no demasiado late (ON_TIME o ALLOWED_LATE). El starter trataba late/out-of-window como éxito: eso materializa basura. El error clásico es mezclar *processing time* o inventar un “mínimo” de event time. Pregunta: con et=105, wm=110 y gracia=5, ¿por qué aún es ALLOWED_LATE y no LATE? Siguiente (E2): tres rutas válido / late / missing de gracia.
- **Code/output changes:** none

### S46-T1-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Fade real a tres payloads. Preamble “missing ≠ aceptar” excelente. Feedback y retro se solapan en “no rellenar allowed_lateness”; retro ~28 w.
- **Checklist:** all pass; retro partial (eco + longitud)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Missing es incertidumbre de **política** (aún no sabes la gracia); late es breach de frescura de evento ya medible. El error clásico es rellenar `allowed_lateness=∞` para forzar PASS y “no perder filas”. Pregunta: si el revisor inventa la gracia, ¿qué miente en el dashboard de Huancayo? Luego (E3): CONTINUE / SIDE_OUTPUT / WAIT_FOR_WATERMARK.
- **Code/output changes:** none (tautología `meets_contract` en solution = P2 opcional)

### S46-T1-A-E3 (weDo, transfer) — **A−**
- **Diagnosis:** Transfer auténtico; starter missing→CONTINUE. Retro ya trae self-check WAIT vs SIDE_OUTPUT. Instruction corta (~36 w) aceptable en transfer. Title omite SIDE_OUTPUT (menor).
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: title “CONTINUE / SIDE_OUTPUT / WAIT”)
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S46-T1-B-DEMO (iDo) — **B**
- **Diagnosis:** first/retry/late/sink_keys claro. Preamble (~63 w) ancla “no es switch del middleware”. Retro (~33 w) telegráfica: principio + misconception + “We Do:…” sin self-check.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Exactly-once compuesto se demuestra con reintento que no reescribe y late que no se mezcla en silencio — no con un flag del broker. El error clásico es “la cola dice exactly-once ⇒ el dashboard no duplica”. Pregunta: si `retry` devolviera True sobre `e1`, ¿qué métrica de atenciones se infla? We Do: set equality (no `len`), tres rutas y CHOOSE_LATE_POLICY.
- **Code/output changes:** none

### S46-T1-B-E1 (weDo, guided) — **A−**
- **Diagnosis:** Fixture con retry de e1 fuerza set equality — excelente. Feedback explica len 3 vs set 2. Retro (~26 w) corta pero distinta del feedback.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Dedup por set + checkpoint + policy es una **cadena**, no un booleano mágico. Confiar en `len(event_ids)==len(sink_ids)` aprueba reintentos como si fueran eventos nuevos. El error clásico es policy vacía “porque el sink ya se ve lleno”. Pregunta: ¿qué eslabón falla si checkpoint=0 aunque las keys coincidan? Siguiente (E2): PASS / REPLAY / MISSING:late_policy.
- **Code/output changes:** none

### S46-T1-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Tres rutas claras; adverso multi-falla. Feedback y retro ambos “REPLAY vs MISSING” (eco moderado).
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  REPLAY asume que ya conoces la política y el sink está roto; MISSING es “aún no hay regla de late”. Colapsar ambas en un solo “falló” manda al on-call a reprocesar sin política. Pregunta: el viernes a las 18:00, ¿abres replay o eliges policy primero? Luego (E3): CHOOSE_LATE_POLICY vs REPLAY.
- **Code/output changes:** none

### S46-T1-B-E3 (weDo, transfer) — **B**
- **Diagnosis:** Transfer limpio; retro con pregunta de viernes 18:00. Feedback (~21 w) eco parcial de la retro. Instruction muy corta (~25 w).
- **Checklist:** all pass; feedback partial (longitud + eco)
- **Severity residual:** P2
- **Proposed feedback (expand if touched):**  
  Distinguir “no sé la política” (CHOOSE_LATE_POLICY) de “el sink está corrupto” (REPLAY_IDEMPOTENTLY) evita reprocesar a ciegas el viernes a las 18:00 en Huancayo. CONTINUE solo con set + checkpoint + policy en catálogo.
- **Proposed residual on retro:** none if feedback expands (retro ya tiene self-check)
- **Code/output changes:** none

---

### S46-T2-A-DEMO (iDo) — **B**
- **Diagnosis:** Kahn line True / cycle False. Preamble repara “solo self-loop”. Retro (~27 w) telegráfica sin self-check.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Acíclico se **calcula** (p. ej. Kahn: `seen == len(nodes)`), no se afirma. El error clásico es “no hay self-loop ⇒ DAG OK” y dejar pasar raw↔clean. Pregunta: si el plan de backfill de Huancayo entra en reejecuciones infinitas, ¿qué miras primero en el grafo? We Do: typed_io + is_acyclic, REJECT_DAG y DECLARE_ASSET_DEPENDENCY.
- **Code/output changes:** none

### S46-T2-A-E1 (weDo, guided) — **A−**
- **Diagnosis:** Starter aprueba not typed_io o self-edge — defect real. Feedback ancla gate `no_cyclic_dag`. Retro (~26 w) corta pero puente E2 claro.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  `typed_io` y aciclicidad son condiciones **independientes**: un grafo “tipado” con ciclo A→B→A sigue sin orden topológico. El error clásico es confiar en el dibujo del grafo o solo en `a != b`. Pregunta: ¿por qué `seen < len(nodes)` en Kahn prueba un ciclo residual? Siguiente (E2): PASS / REJECT_DAG / MISSING:typed_io con ciclo real.
- **Code/output changes:** none

### S46-T2-A-E2 (weDo, independent) — **C**
- **Diagnosis:** Adverso ciclo real con typed_io True — excelente. **Eco fuerte** feedback≈retro (“self-loop decorativo… ciclo que el orquestador no ordena”). Retro ~28 w.
- **Checklist:** all pass; retro fail (eco casi literal)
- **Severity residual:** P1
- **Proposed retrospective (replace):**  
  Tipado no salva el ciclo: el planificador de Huancayo necesita orden topológico, no solo I/O declarado. El error clásico es “typed_io True ⇒ confío y materializo”. Pregunta: si raw→clean→raw, ¿qué asset “termina primero” en el backfill? Luego (E3): DECLARE_ASSET_DEPENDENCY vs REJECT_DAG.
- **Proposed feedback (keep/light touch):**  
  El adverso ya no es self-loop decorativo: es un ciclo real que el orquestador no puede ordenar, aunque typed_io diga True. MISSING:typed_io es otra rama (incertidumbre de diseño).
- **Code/output changes:** none

### S46-T2-A-E3 (weDo, transfer) — **B**
- **Diagnosis:** Transfer CONTINUE/REJECT/DECLARE. Retro con self-check de self-loop. Feedback (~19 w) eco del principio DECLARE vs REJECT.
- **Checklist:** all pass; feedback partial
- **Severity residual:** P2
- **Proposed feedback (expand):**  
  DECLARE_ASSET_DEPENDENCY es incertidumbre de diseño (falta tipado); REJECT_DAG es breach de topología. Mezclarlos publica un plan de backfill sin edges tipados o rechaza cuando aún falta declarar la dependencia. CONTINUE solo con grafo limpio.
- **Code/output changes:** none

---

### S46-T2-B-DEMO (iDo) — **B**
- **Diagnosis:** ok / overlap / bad_resume claros. Preamble “cron ≠ permiso”. Retro (~30 w) sin self-check.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Backfill seguro = intervalos half-open **sin solape** + `resume_from == checkpoint`. El error clásico es confiar en un flag `overlap` del ticket. Pregunta: si solapas con el job de las 12:00, ¿qué partición de atenciones se corrompe aunque el schedule “diga que toca”? We Do: solape calculado, STOP y RECOVER_CHECKPOINT.
- **Code/output changes:** none

### S46-T2-B-E1 (weDo, guided) — **A−**
- **Diagnosis:** Bug invertido (PASS si hay solape) — didáctico. Instruction ya dice “calcula, no flag”. Retro corta (~28 w).
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Plan de backfill = intervalos no solapados + resume consistente. El starter aprobaba lo que debería STOP: double-write disfrazado de reintento. El error clásico es leer un booleano del payload. Pregunta: en half-open, ¿por qué tocar en el borde (`end==start` siguiente) es OK y `end > start` siguiente no? Siguiente (E2): solape 3–4 y resume “start”.
- **Code/output changes:** none

### S46-T2-B-E2 (weDo, independent) — **C**
- **Diagnosis:** Adverso [[1,4],[3,6]] excelente. Retro (~19 w) casi solo eco del feedback sobre solape 3–4; sin misconception propio ni self-check.
- **Checklist:** goal/success pass; retro partial (muy corta + eco)
- **Severity residual:** P1
- **Proposed retrospective (replace):**  
  El solape se **mide** en los números half-open; mirar solo `resume_from` o un flag del ticket es teatro de orquestación. STOP_OVERLAPPING_BACKFILL protege la partición viva de Huancayo. El error clásico es “el ticket dice no overlap”. Pregunta: ¿qué rango se pisa entre [1,4] y [3,6]? Luego (E3): RECOVER_CHECKPOINT cuando falta estado.
- **Code/output changes:** none

### S46-T2-B-E3 (weDo, transfer) — **B**
- **Diagnosis:** CONTINUE/STOP/RECOVER. Retro con pregunta de partición 12:00. Feedback (~21 w) eco.
- **Checklist:** all pass; feedback partial
- **Severity residual:** P2
- **Proposed feedback (expand):**  
  RECOVER_CHECKPOINT es incertidumbre de **estado** (no hay resume ejecutable); STOP es breach de **plan** (solape o resume ≠ checkpoint). CONTINUAR sin resume reescribe la partición de las 12:00 en Huancayo como si fuera un reintento limpio.
- **Code/output changes:** none

---

### S46-T3-A-DEMO (iDo) — **B**
- **Diagnosis:** PASS / drift / lag — dos motivos de cuarentena. Retro (~30 w) telegráfica.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Schema correcto con dato de ayer sigue siendo breach de frescura. Drift y lag son dos QUARANTINE distintos; un solo `if` que los mezcla “arregla” lo incorrecto. El error clásico es publicar con warning. Pregunta: si el tipo de `case_id` ya está roto, ¿sirve bajar el lag a 10 min? We Do: fail-closed, tres rutas y PAGE_DATA_OWNER.
- **Code/output changes:** none

### S46-T3-A-E1 (weDo, guided) — **C**
- **Diagnosis:** Starter omite owner e invierte predicado — doble defecto bueno. Retro (~19 w) telegráfica (“Contrato = schema + lag + owner”) sin anclar impacto ni self-check.
- **Checklist:** context/goal/success pass; retro fail (metacognición mínima)
- **Severity residual:** P1
- **Proposed retrospective (replace):**  
  Contrato publicable = schema exacto **y** lag ≤ SLO **y** owner real. El starter invertía igualdad/lag y olvidaba el dueño: publicar “casi bien” manda basura al dashboard de operaciones. El error clásico es warning en vez de fail-closed. Pregunta: si el schema coincide pero owner="", ¿a quién pagina el on-call? Siguiente (E2): cuarentena vs MISSING:owner.
- **Code/output changes:** none

### S46-T3-A-E2 (weDo, independent) — **C**
- **Diagnosis:** Tres rutas OK. **Eco fuerte** feedback≈retro (cuarentena vs MISSING / data-ops por defecto).
- **Checklist:** all pass; retro fail (eco)
- **Severity residual:** P1
- **Proposed retrospective (replace):**  
  Cuarentena es breach de **contenido** (drift o frescura); MISSING:owner es schema de **control** incompleto. Tratar owner ausente como “data-ops por defecto” inventa un dueño y publica sin accountability. Pregunta: ¿por qué no conviertes MISSING en QUARANTINE automáticamente? Luego (E3): PAGE_DATA_OWNER.
- **Code/output changes:** none

### S46-T3-A-E3 (weDo, transfer) — **B**
- **Diagnosis:** CONTINUE/QUARANTINE/PAGE. Retro con self-check lag+drift. Feedback (~19 w) eco.
- **Checklist:** all pass; feedback partial
- **Severity residual:** P2
- **Proposed feedback (expand):**  
  PAGE_DATA_OWNER es incertidumbre de ownership; QUARANTINE_DATASET es breach de contrato. Asumir `data-ops` publica basura al dashboard sin dueño real. CONTINUE solo con schema exacto, lag ≤ SLO y owner presente.
- **Code/output changes:** none

---

### S46-T3-B-DEMO (iDo) — **B**
- **Diagnosis:** Facet + page False. Preamble “qué corrida produjo esta fila”. Retro (~25 w) telegráfica.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Lineage es un facet reconstruible (run + IO + métricas + owner), no un log suelto. El error clásico es “arreglar a ciegas” sin inputs ni run_id. Pregunta: si `null_rate` es 0.01 pero `run` no empieza por `run-`, ¿por qué igual se pagina? We Do: PASS / OPEN_QUALITY_INCIDENT / TRACE_LINEAGE.
- **Code/output changes:** none

### S46-T3-B-E1 (weDo, guided) — **A−**
- **Diagnosis:** Predicado de cinco eslabones; feedback ancla post mortem. Retro (~24 w) sin self-check.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Un solo eslabón roto basta para abrir incidente: run mal formado, IO vacío, null_rate alto u owner vacío. El error clásico es mirar solo `null_rate` y declarar “calidad OK”. Pregunta: ¿qué pones en el ticket de Huancayo si no hay inputs? Siguiente (E2): adverso multi-eslabón vs MISSING:owner.
- **Code/output changes:** none

### S46-T3-B-E2 (weDo, independent) — **C**
- **Diagnosis:** Retro (~15 w) la más corta de la sección: solo contraste MISSING≠INCIDENT + “Luego E3”. Sin principio de hábito ni self-check.
- **Checklist:** goal/success pass; retro fail (telegráfica)
- **Severity residual:** P1
- **Proposed retrospective (replace):**  
  MISSING:owner es incertidumbre de **control** (aún no sabes a quién paginar); OPEN_QUALITY_INCIDENT asume un facet documentado pero roto. El adverso rompe varios eslabones a la vez: cualquiera basta. El error clásico es abrir un incidente vacío de ownership. Pregunta: si solo falta owner, ¿por qué no abres OPEN de inmediato? Luego (E3): TRACE_LINEAGE recupera contexto.
- **Code/output changes:** none

### S46-T3-B-E3 (weDo, transfer) — **C**
- **Diagnosis:** Transfer real. **Eco fuerte** feedback≈retro (“TRACE recupera… OPEN asume…”).
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P1
- **Proposed retrospective (replace):**  
  TRACE_LINEAGE es el runbook cuando falta evidencia de ownership; OPEN_QUALITY_INCIDENT es cuando ya sabes qué se rompió en el facet. El error clásico es ticket de incidente sin run_id ni inputs. Pregunta: ¿qué tres campos del facet copias al post mortem antes de “arreglar” clean-v3? Ese hábito alimenta el youDo y CP-N4-B.
- **Proposed feedback (keep distinct):**  
  TRACE recupera contexto; OPEN asume que ya sabes qué se rompió. Un incidente vacío de ownership no sirve en el post mortem de Huancayo — no lo disfraces de CONTINUE.
- **Code/output changes:** none

---

### S46-T4-A-DEMO (iDo) — **B**
- **Diagnosis:** first 2 / second 0 / keys. Preamble CP-N4-B. Retro (~30 w) sin self-check.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Idempotencia se **mide** en cambios del segundo run, no en un flag `no_dup_rerun`. Full rewrite ciego infla conteos y storage del reporte diario. Pregunta: si second_run_changes=2 con el mismo batch, ¿qué prueba del gate CP-N4-B falló? We Do: predicado de partición, REBUILD y REVIEW_INCREMENTAL_KEY.
- **Code/output changes:** none

### S46-T4-A-E1 (weDo, guided) — **A−**
- **Diagnosis:** Tres conjunciones keys/delta/small_files. Feedback razona función del batch. Retro (~27 w) corta.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  El segundo run con cero cambios es la prueba del gate de partición. Solo mirar keys deja pasar delta&gt;0 o small files fuera de techo. El error clásico es “las keys coinciden ⇒ merge OK”. Pregunta: ¿por qué small_files también entra al contrato y no solo el conteo de filas? Siguiente (E2): drift + delta + small files altos.
- **Code/output changes:** none

### S46-T4-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Adverso partition "all" multi-falla. Retro (~20 w) telegráfica; feedback más rico.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  REBUILD_PARTITION responde a un sink que ya no es función del batch (keys drift, delta en re-run o higiene rota). MISSING:max_small_files es incertidumbre de **diseño** del techo, no un rebuild automático. El error clásico es reconstruir sin saber el límite. Pregunta: ¿qué evidencia imprime el revisor antes de REBUILD? Luego (E3): REVIEW_INCREMENTAL_KEY.
- **Code/output changes:** none

### S46-T4-A-E3 (weDo, transfer) — **C**
- **Diagnosis:** **Eco fuerte** feedback≈retro (REVIEW vs REBUILD). Self-check en retro salva algo de metacognición.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P1
- **Proposed retrospective (replace):**  
  REVIEW_INCREMENTAL_KEY es incertidumbre de diseño (falta max_small_files o clave mal elegida); REBUILD es breach **materializado** en el sink. Rebuild a ciegas no arregla el contrato del portfolio ni el gate CP-N4-B. Pregunta: ¿qué prueba el `second_run_changes==0` en 30 segundos de defensa? Ese número es la evidencia del youDo.
- **Proposed feedback (keep distinct):**  
  REVIEW no es un rebuild automático: primero cierras el límite de diseño. REBUILD asume que el merge ya corrompió o dejó basura de small files. CONTINUE solo con keys alineadas, delta 0 y techo respetado.
- **Code/output changes:** none

---

### S46-T4-B-DEMO (iDo) — **B**
- **Diagnosis:** PASS vs DECLARE + nota sli_vs_slo. Retro (~24 w) telegráfica.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  SLI es la **medida**; SLO es el **objetivo**. El error clásico es prometer frescura en el README sin simulacro de RTO y post mortem. Pregunta: si sli=0.995 y rto=90 con target 30, ¿qué código de ops debe salir y por qué no basta el SLI “bonito”? We Do: predicado, DECLARE y ACTIVATE_RECOVERY_RUNBOOK.
- **Code/output changes:** none

### S46-T4-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Cuatro eslabones; starter omite actions/owner. Feedback (~23 w) en piso; retro (~20 w).
- **Checklist:** all pass; feedback/retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Cuatro eslabones: sli ≥ slo, rto ≤ target, ≥1 acción de post mortem y owner. Mirar solo el porcentaje de frescura es teatro operativo. El error clásico es PASS con `postmortem_actions=0`. Pregunta: ¿qué demuestra un simulacro sin acciones concretas? Siguiente (E2): adverso multi-indicador.
- **Proposed feedback (expand if touched):**  
  SLO de datos se demuestra con desigualdades y dueño, no con un README. Un simulacro sin acciones de post mortem o con RTO por encima del target es teatro: el on-call de Huancayo no tiene runbook ejecutable.
- **Code/output changes:** none

### S46-T4-B-E2 (weDo, independent) — **C**
- **Diagnosis:** Retro (~19 w) telegráfica; eco parcial con feedback sobre “se declara con números”.
- **Checklist:** all pass; retro fail (mínima)
- **Severity residual:** P1
- **Proposed retrospective (replace):**  
  El incidente se declara con **evidencia numérica** (SLI, RTO, acciones), no por “anda lento”. Un solo indicador roto basta para DECLARE. MISSING:owner es otra rama: no abras un incidente vacío de ownership. Pregunta: si sli=0.8 y actions=0 a la vez, ¿necesitas dos tickets o uno con ambos hechos? Luego (E3): ACTIVATE_RECOVERY_RUNBOOK.
- **Code/output changes:** none

### S46-T4-B-E3 (weDo, transfer) — **C**
- **Diagnosis:** Cierra T4-B y alimenta youDo. **Eco fuerte** feedback≈retro (runbook vs incidente). Self-check RTO en retro.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P1
- **Proposed retrospective (replace):**  
  ACTIVATE_RECOVERY_RUNBOOK responde a incertidumbre operativa (sin owner); DECLARE_DATA_INCIDENT asume owner y métricas rotas. El error clásico es DECLARE sin dueño — nadie ejecuta el recovery. Pregunta de cierre: ¿qué RTO mides en el simulacro de Huancayo y dónde lo dejas escrito para el portfolio CP-N4-B?
- **Proposed feedback (keep distinct):**  
  El runbook no es un incidente vacío: es la rama cuando falta ownership. DECLARE sin dueño no activa recovery real. CONTINUE solo si sli, RTO, acciones y owner cierran el simulacro.
- **Code/output changes:** none

---

### S46-youDo (youDo) — **A**
- **Diagnosis:** Capstone sólido: EVENTS sintéticos, watermark, merge con re-run, DAG, backfill, stubs de lineage/ops, prints de evidencia. `context` / `objectives` / `requirements` / `rubric` / `portfolioNote` maduros. **Retrospective** (~70 w) con (1) invariantes CP-N4-B, (2) datos reales vs sintéticos/PII, (3) frase de impacto medible y riesgo residual stdlib≠Flink — cumple el patrón de defensa del spec.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: una línea en context recordando “missing ≠ breach” si el learner salta weDo E2/E3)
- **Proposed residual:** none required
- **Code/output changes:** none

---

## Priority order

### P0
- **Ninguno.** Cobertura de campos y outputs canónicos están cerrados post Round-1.

### P1 (metacognición / eco severo — tocar primero si hay presupuesto de prosa)
1. **S46-T2-A-E2** — retro ≈ feedback (ciclo / typed_io); reescribir retro
2. **S46-T2-B-E2** — retro ~19 w telegráfica + eco solape 3–4
3. **S46-T3-A-E1** — retro ~19 w sin impacto ni self-check
4. **S46-T3-A-E2** — eco cuarentena/MISSING/data-ops
5. **S46-T3-B-E2** — retro ~15 w (peor de la sección)
6. **S46-T3-B-E3** — eco TRACE/OPEN
7. **S46-T4-A-E3** — eco REVIEW/REBUILD
8. **S46-T4-B-E2** — retro ~19 w
9. **S46-T4-B-E3** — eco runbook/incidente

Para cada P1: **reemplazar** `retrospective` (40–80 w: principio distinto del feedback + misconception + transfer/self-check). Ajustar `feedback` solo si hace falta desacoplar el eco (25–60 w).

### P2 (polish de longitud / eco leve / higiene de código)
- **iDo retros** T1-B … T4-B: expandir al piso 40 w + self-check (textos propuestos arriba).
- **weDo retros** E1 restantes y E2/E3 con eco moderado: +1 frase de self-check o impacto Huancayo sin repetir el feedback.
- **Feedback &lt;25 w:** T1-B-E3, T2-A-E2/E3, T2-B-E2/E3, T3-A-E2/E3, T4-A-E3, T4-B-E1/E2/E3 — expandir con “por qué importa al promote / dashboard / post mortem”.
- **Instruction &lt;40 w:** no bloquear; opcional enriquecer E1 con un paso de verificación de print exacto.
- **Títulos E3:** opcional incluir el 3er token (SIDE_OUTPUT, CHOOSE, DECLARE, RECOVER, PAGE, TRACE, REVIEW, RUNBOOK).
- **16 tautologías** `meets_contract = ('x' == 'x')` en solutionCode E2/E3: reemplazar por assert del predicado real **sin** cambiar tokens impresos.
- **Naming** `gpu-computing` / `s46-gpu-computing.ts`: fuera de scope del Fixer de prosa.

---

## Residual risks
1. **Homogeneidad E1/E2/E3:** el *código* isomorfo es deliberado; el riesgo anti-aberration es que el Fixer R2 copie las mismas 3 frases de retro entre subtemas. Cada P1 debe anclar su dominio (watermark ≠ DAG ≠ merge ≠ SLO) y un verbo de Huancayo distinto.
2. **Carga cognitiva Master:** 33 unidades densas; no alargar código ni hints hasta spoiler total — solo prosa de cierre.
3. **Simplificación watermark/gracia:** el lab no es Flink completo; las retros no deben overclaim “esto es producción Beam”.
4. **Tautologías meets_contract:** enseñan mal el hábito de assert; prioridad baja frente a eco feedback/retro.
5. **youDo scope:** integra casi todos los subtemas; la retro ya cubre defensa — no reescribir el scaffold.
6. **True newbie en Master:** el vocabulario (watermark, Kahn, SLI) es del dominio; los preambles ya anclan escena clínica. No “infantilizar”; sí desacoplar eco y completar metacognición.

---

## Fixer R2 handoff checklist (no implementar aquí)
- [ ] P1: reescribir retros de T2-A-E2, T2-B-E2, T3-A-E1, T3-A-E2, T3-B-E2, T3-B-E3, T4-A-E3, T4-B-E2, T4-B-E3 (textos propuestos arriba)
- [ ] P2: expandir iDo retros cortas; desacoplar feedback/retro en eco leve; feedback al piso 25 w
- [ ] P2 opcional: tautologías meets_contract; títulos E3 con 3 tokens
- [ ] Preservar outputs exactos y tokens operativos (SIDE_OUTPUT_LATE_EVENT, REPLAY_IDEMPOTENTLY, REJECT_DAG, STOP_OVERLAPPING_BACKFILL, QUARANTINE_DATASET, OPEN_QUALITY_INCIDENT, REBUILD_PARTITION, DECLARE_DATA_INCIDENT, etc.)
- [ ] Español profesional peruano; sin PII real; fixtures CASO-HYO-046
- [ ] Sin generadores ni bulk replace de prosa
- [ ] Fade E1→E2→E3 visible en la prosa (predicado → tres rutas → decide), no solo en el código

---

## Score summary (Round 2)

| Score | Units (approx.) |
|-------|-----------------|
| **A / A−** | T1-A-DEMO, T1-A-E1, T1-A-E3, T1-B-E1, T2-A-E1, T2-B-E1, T3-B-E1, T4-A-E1, youDo (+ varios B altos) |
| **B** | Mayoría de iDo demos y weDo E1/E3 “sanos” |
| **C** | T2-A-E2, T2-B-E2, T3-A-E1, T3-A-E2, T3-B-E2, T3-B-E3, T4-A-E3, T4-B-E2, T4-B-E3 |
| **D** | **0** |

**Verdict:** Section 46 is **learner-ready** after Round-1. Round-2 residual work is **quality polish** (metacognitive retros, de-echo feedback, length floors) — not structural reintroduction of preambles.

Section 46 exercise pedagogy review complete. Ready for the Fixer prompt.
