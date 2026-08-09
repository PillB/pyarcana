# S44 Exercise Pedagogy Report (Round 2)

## Section
- **title:** CI/CD y seguridad de la cadena de suministro
- **shortTitle:** CI/CD supply chain
- **id:** `multimodal`
- **index:** 44
- **source:** `src/lib/course/sections/s44-multimodal.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades)
- **subtemas:** T1-A lint/types/tests y matrices · T1-B caches/artifacts/condiciones · T2-A permisos/pinning/secret scan · T2-B SBOM/provenance/attestations · T3-A environments/approvals · T3-B migrations/canary/rollback · T4-A branch/review/release notes · T4-B failure handling/evidencia
- **hilo:** ops sintético **CASO-PIU-044** (Piura); servicio contenedorizado de S43 → cadena de suministro verificable; gate **CP-N4-B**; stdlib modelando GHA/SLSA; sin registry remoto obligatorio, secretos reales ni PII
- **Round 1 context:** `round1/S44_EXERCISE_PEDAGOGY_REPORT.md` (solo contraste; **no** rubber-stamp)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (preamble/retrospective checklists, E1→E3 fade, length targets, anti-aberration).
- Manually re-inspected **current** source for every `iDo.steps[]` (8), `weDo.steps[]` (24) y `youDo` (title, preamble, instruction, feedback, retrospective, starter DEFECT, solution output, why).
- Measured word counts only as gates (no bulk prose generation).
- Scored for a **true newbie** (qué / por qué / éxito / qué queda), independent of Round-1 proposals.
- Verified integrity traps (starter predicate wrong vs solution right) on all 8 E1s and representative E2/E3 per subtema.
- No generators, bulk templates, or source edits.

## Global findings (post Round-1 fix)

| Area | Status | Residual impact |
|------|--------|-----------------|
| **Field coverage** | Complete: 8 iDo con `preamble`+`why`+`retrospective`; 24 weDo con `title`+`preamble`+`instruction`+`feedback`+`retrospective`; youDo con `retrospective` + marco sólido | Round-1 P0 “cero campos” **cerrado** |
| **We Do titles** | Presentes, 4–7 palabras, español PE, alineados al skill | Pass |
| **Preamble shape** | weDo en bullets contexto/meta/éxito/límites; iDo narrativos con predicción + “no escribas” | Pass en estructura; bullets weDo ~41–65 w (aceptable por “4 short bullets”); iDo narrativos ~45–67 w (varios bajo piso 80; legibles) |
| **Instruction = steps** | Solo-tarea, ordenados; E1 nombra DEFECT; E2/E3 menos migas | Pass — varias ~19–36 w (bajo piso 40; no bloquear si preamble cubre meta/éxito) |
| **E1→E2→E3 fade** | Superficies distintas: AND+matrix → assess PASS/FAIL/MISSING → CONTINUE/FAIL/REVIEW_*; cache/artifact → DISCARD/INSPECT; pin SHA → REVOKE/SECURITY; digests → REJECT/REBUILD; promote → DENY/REQUEST; canary → ROLLBACK/PAUSE; branch/notes → BLOCK/COMPLETE; critical fail → STOP/ASSIGN | Pass — **no** clones numéricos |
| **Feedback vs retrospective** | Feedback suele razonar el bug; en **~16** unidades E2/E3 el retro **eco** del feedback (misma primera frase; retro = feedback + “error clásico” o “Pregunta:”) | Residual **P2** sistemático |
| **Retrospective length** | weDo mediana ≈13–35 w (spec 40–80); peores: T4-B-E2 (~13), T4-A-E2 (~15), T3-A-E1 (~16), T2-B-E1 (~18); iDo varias 21–36 w | Residual **P2** |
| **Feedback length** | Mayoría ≥21 w; ~8 unidades ~20–24 w (piso 25); peores: T4-A-E1 (~21), T4-A-E2 (~21), T4-B-E2 (~20), T2-A-E2 (~23) | Residual **P2** leve |
| **iDo why** | 4/8 en rango ≥40 w; **bajo piso:** T2-B (~33), T3-A (~33), T4-A (~31), T4-B (~29) | Residual **P2** |
| **Código/outputs** | Coherentes con theory y CASO-PIU-044; DEFECT `# DEFECT:` excelente; **wrong ≠ right** en traps E1 verificados | **Sin** hueco de integridad |
| **youDo frame** | context CP-N4-B, objectives, requirements, starter BLOCKED→READY, rubric, portfolioNote, retrospective de defensa (~72 w) | Pass |
| **T1-B demo vs We Do** | Demo usa prefijo `pip-` en `cache_key`; theory/weDo exigen `lock-` | Residual **P2** (consistencia de contrato) |

**Net:** Round 1 cerró el vacío sistemático de prosa verbal. Round 2 **no** es rubber-stamp: la sección está **lista para learner** en la gran mayoría de unidades. Residuales son **calidad** (eco feedback/retro en E2/E3, retros cortas sin metacognición distinta, `why` iDo bajo piso en T2-B/T3-A/T4, prefijo cache demo vs lab). **No** hay defectos de integridad wrong≈right ni campos ausentes. Prioridad del Fixer R2 = **P2 polish**, no reescritura estructural.

## Scoring key
| Score | Meaning |
|-------|---------|
| **A** | Newbie responde qué / por qué / éxito / qué queda; sin fix residual obligatorio |
| **B** | Usable; residual menor (eco, longitud, polish) |
| **C** | Parcial; residual R2 debería arreglarse (claridad, metacognición fina, integridad leve) |
| **D** | Falla el test de true-newbie en un ítem crítico (éxito invisible, wrong≈right) |

Checklist: **context · goal · success · constraints · retrospective** → pass / partial / fail.

---

## Unit ledger

### S44-T1-A-DEMO (iDo) — **A**
- **Diagnosis:** Worked example sólido del AND de lint/types/tests y `matrix == supported`. Preamble pide predicción (`gates_green`, check rojo, 3.10 fuera). `why` (~57 w) en rango; puente a We Do OR débil. Retro (~52 w) repara “tests pasaron, el resto es opcional” y puente FAIL_CI_GATE / REVIEW_MATRIX.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S44-T1-A-E1 (weDo, guided) — **A**
- **Diagnosis:** Title claro; bullets con éxito `S44-T1-A PASS` y límites anti-OR. Instruction nombra DEFECT OR; feedback razona typecheck rojo con OR; retro distinta (primer eslabón supply chain + puente E2). Starter OR → solution AND+matrix (discrimina).
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: retro ~34 w → +self-check “¿qué check rojo aprobaría el OR del starter?”)
- **Proposed residual:** none required
- **Code/output changes:** none

### S44-T1-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Independiente fuerte: PASS / FAIL_CI_GATE / MISSING:supported. Preamble ancla “schema antes que contenido”. Feedback y retro comparten la primera frase (eco); retro ~28 w sin self-check distinto.
- **Checklist:** all pass; feedback/retro partial (eco + longitud)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Primero schema, después contenido: un `KeyError` por leer `supported` ausente no es “CI roja”, es un bug del assessor. El error clásico es mezclar “falta el campo” con “types False y 3.10 fuera de matriz”. Pregunta: si el adverso tuviera los tres checks verdes pero matriz `{3.10}`, ¿qué código devuelves y por qué no es MISSING? Luego (E3): CONTINUE / FAIL_CI_GATE / REVIEW_MATRIX.
- **Code/output changes:** none

### S44-T1-A-E3 (weDo, transfer) — **B**
- **Diagnosis:** Transfer real fail-closed. Instruction clara. Feedback y retro casi idénticos (REVIEW_*/FAIL_*/CONTINUE + “falta supported”). Retro ~35 w; self-check presente (rellenar matriz por defecto) — el eco es el problema principal.
- **Checklist:** all pass; feedback/retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  En plataforma no se inventa la matriz soportada: se pide dueño y se detiene el promote del PR. El error clásico es tratar `REVIEW_MATRIX` como “casi PASS” y rellenar `{3.11, 3.12}` en silencio. Pregunta: si el adverso y el missing llegaran el mismo día, ¿qué código cierras primero y por qué no rellenas `supported`? Ese hábito se reutiliza en You Do al declarar runtimes reales del portfolio.
- **Proposed feedback (if touched):** mantener razonamiento actual; no duplicar la pregunta del retro.
- **Code/output changes:** none

---

### S44-T1-B-DEMO (iDo) — **B**
- **Diagnosis:** Demo clara cache vs artifact; preamble predice `cache_key True` / `artifact True`. **Inconsistencia:** demo usa prefijo `pip-` mientras theory y We Do exigen `lock-` — un newbie puede copiar `pip-` al lab y fallar. Retro (~33 w) corta; repara “cache hit = build OK”.
- **Checklist:** context/goal/success pass; constraints partial (prefijo); retro partial (longitud)
- **Severity residual:** P2
- **Proposed residual:**  
  1) Alinear demo a `lock-` (preferido: un carácter en `cache_key` y print) **o** una frase en preamble: “en el lab We Do el prefijo del contrato es `lock-`; aquí `pip-` solo ilustra ligadura al lockfile”.  
  2) Expandir retrospective:
- **Proposed retrospective (expand):**  
  Cache acelera; el artifact con digest y retención es lo que un auditor re-descarga. El error clásico es tratar un cache hit como «build OK» o publicar `latest` con retención 0. Pregunta: si el miss de cache aún produce el wheel, ¿por qué eso es señal de robustez y no de fallo? We Do: predicado `lock-` + sha256 + retención ≥7 + tags cubiertos.
- **Code/output changes:** opcional alinear `pip-` → `lock-` en demo (output `cache_key True` se preserva)

### S44-T1-B-E1 (weDo, guided) — **A**
- **Diagnosis:** Guiado sólido; DEFECT invierte miss/conditions; feedback razona happy path; retro con principio evidencia + puente E2. Discrimina bien.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S44-T1-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Tres rutas correctas. Eco fuerte feedback/retro (“adverso falla por contenido global/latest…”). Retro ~27 w.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Schema y breach no se mezclan: falta `conditions_cover_tags` no es lo mismo que tags en False con cache `global` y digest `latest`. El error clásico es devolver DISCARD cuando falta el campo o inventar `True` para “cerrar el job”. Pregunta: ¿qué evidencia mínima retiene el artifact si el cache miss pasó? Luego: CONTINUE vs INSPECT_WORKFLOW_CONDITION.
- **Code/output changes:** none

### S44-T1-B-E3 (weDo, transfer) — **B**
- **Diagnosis:** Transfer limpio INSPECT/DISCARD/CONTINUE. Eco casi total entre feedback y retro (j≈0.79); retro ya trae self-check bueno sobre tag de prod.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Sin saber si los tags de release comparten gates con main, no se publica: se inspecciona el workflow. El error clásico es rellenar `conditions_cover_tags=True` porque “siempre lo cubrimos en main”. Pregunta: ¿por qué un tag de prod sin gates es peor que un job lento? Lleva esa respuesta al You Do al documentar condiciones de release.
- **Code/output changes:** none

---

### S44-T2-A-DEMO (iDo) — **A−**
- **Diagnosis:** Demo de gitleaks block + pin 40 hex + least privilege. Preamble “token = atacante”. Retro (~36 w) repara pin por tag; un poco bajo piso.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Least privilege + pin SHA + cero secretos en logs es el suelo de hardening. El error clásico es pin por tag flotante `@v4` o “limpiar el log” en lugar de rotar. Pregunta: si `secret_hits == 1`, ¿qué haces antes de reintentar el pipeline? We Do: calcular el pin del string `action_ref`, no de un booleano mágico.
- **Code/output changes:** none

### S44-T2-A-E1 (weDo, guided) — **A**
- **Diagnosis:** DEFECT premia write/secret; solution `full_sha_pin` es el patrón de portfolio. Feedback y retro distintos (calcular pin vs SHA inmutable). Buen modelo post-fix.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: retro ~24 w al piso 40)
- **Proposed residual:** none required
- **Code/output changes:** none

### S44-T2-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Tres rutas con `@v4`+write. Eco feedback/retro (“Schema ≠ breach / hay un action_ref”). Instruction muy corta (~19 w) pero preamble cubre éxito.
- **Checklist:** all pass; feedback/retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Un `@v4` no es “casi pinneado”: el tag se mueve y el SHA no. Falta `dependency_review` es schema; write + secret hits + tag es breach de contenido. El error clásico es marcar PASS si el string `action_ref` “existe”. Pregunta: ¿qué extraes después de `@` y cuántos caracteres hex exige el gate? Luego: SECURITY_APPROVAL en incertidumbre.
- **Code/output changes:** none

### S44-T2-A-E3 (weDo, transfer) — **B**
- **Diagnosis:** Transfer CONTINUE/REVOKE/SECURITY. Eco máximo (j≈0.88): retro ≈ feedback + pregunta sobre `@v4`.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Sin dependency_review el lead no inventa un True: pide aprobación de seguridad y detiene el publish. El error clásico es “promover” `@v4` a pin con un comentario en el YAML. Pregunta: si hay write amplio **y** falta review, ¿qué código aplica primero y por qué no es CONTINUE? Ese criterio alimenta el workflow pinneado del You Do.
- **Code/output changes:** none

---

### S44-T2-B-DEMO (iDo) — **B**
- **Diagnosis:** Tres digests alineados. Preamble “binario huérfano”. `why` (~33 w) bajo piso; retro (~28 w) corta pero repara copiar SBOM del build anterior.
- **Checklist:** all pass; why/retro partial (longitud)
- **Severity residual:** P2
- **Proposed why (expand):**  
  La longitud del set de digests == 1 es el contrato medible: artifact, SBOM y subject de provenance deben ser el mismo subject. Divergencia → `REJECT_ATTESTATION`. Sin `attestation_valid` no se inventa un verde: se reconstruye provenance (`REBUILD_PROVENANCE`). En We Do el starter exige len > 1 (invertido a propósito).
- **Proposed retrospective (expand):**  
  Mismo subject en artifact, SBOM y provenance: esa es la cadena. El error clásico es reutilizar el SBOM de ayer «porque casi es el mismo». Pregunta: si el wheel es `sha256:aaa` y el SBOM apunta a `bbb`, ¿qué dice el gate aunque el README diga OK? We Do: alinear digests + `attestation_valid`.
- **Code/output changes:** none

### S44-T2-B-E1 (weDo, guided) — **A−**
- **Diagnosis:** DEFECT len>1; solution len==1 + attestation. Feedback fuerte; retro (~18 w) demasiado corta y sin self-check.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Integridad medible por igualdad de digests, no por narrativa del README. El error clásico es creer que tres digests “parecidos” son suficientes. Pregunta: ¿por qué `attestation_valid` no basta si el set de digests tiene más de un elemento? Siguiente: valid / divergente / sin flag de attestation.
- **Code/output changes:** none

### S44-T2-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Rutas aaa/bbb/ccc correctas. Eco feedback/retro sobre schema vs breach de digests.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Falta el flag de attestation → schema; digests distintos → breach. El error clásico es devolver PASS si «hay algún digest» aunque el set tenga tres valores. Pregunta: en el adverso con aaa/bbb/ccc, ¿qué campo miras primero después del schema? Luego: REBUILD_PROVENANCE.
- **Code/output changes:** none

### S44-T2-B-E3 (weDo, transfer) — **B**
- **Diagnosis:** Transfer REBUILD limpio. Eco j≈0.89; self-check de copiar SBOM es bueno pero no justifica duplicar la primera frase del feedback.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Sin saber si la attestation es válida, Piura reconstruye provenance: no inventa un check verde ni copia el SBOM del release anterior. El error clásico es CONTINUE cuando falta el flag. Pregunta: ¿por qué copiar el SBOM del release anterior rompe CP-N4-B aunque el código «casi no cambió»?
- **Code/output changes:** none

---

### S44-T3-A-DEMO (iDo) — **B**
- **Diagnosis:** Excelente anti-patrón rebuild (`ok True` vs `rebuild_denied False`). `why` (~33 w) bajo piso; retro (~21 w) muy corta.
- **Checklist:** all pass; why/retro partial
- **Severity residual:** P2
- **Proposed why (expand):**  
  Source staging, target prod, `approved_by` truthy, digests iguales y prefijo sha256. Rebuild al promover produce otro digest, huérfana la provenance y el gate niega el promote. En We Do el starter marca PASS sin approval o con digests distintos.
- **Proposed retrospective (expand):**  
  Mismo digest + aprobación independiente = promote defendible. El error clásico es «reconstruir para estar seguros». Pregunta: si tested es `sha256:abc` y promoted `sha256:new` con el mismo lead, ¿qué imprime el predicado y por qué no es un atajo de confianza? We Do: `DENY_PROMOTION` y `REQUEST_RELEASE_APPROVAL`.
- **Code/output changes:** none

### S44-T3-A-E1 (weDo, guided) — **B**
- **Diagnosis:** DEFECT invertido sólido. Retro (~16 w) es solo puente sin misconception ni self-check.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Promote mueve el subject testeado, no un binario nuevo. El error clásico es PASS sin `approved_by` o con digests distintos “porque el lead confía”. Pregunta: ¿por qué staging→production importa y no basta un promote desde dev con el mismo digest? Siguiente: tres rutas con dev/sin approval/digest new.
- **Code/output changes:** none

### S44-T3-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Tres rutas correctas. Eco feedback/retro sobre dev/digest distinto.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Promover desde dev o con digest distinto es breach de contenido, no un “warning de README”. El error clásico es inventar `promoted_digest` para cerrar el ticket. Pregunta: ¿qué le muestras al lead de Piura en 30 segundos además del aprobador? Luego: REQUEST_RELEASE_APPROVAL.
- **Code/output changes:** none

### S44-T3-A-E3 (weDo, transfer) — **B**
- **Diagnosis:** Transfer REQUEST limpio; self-check de evidencia 30 s presente. Eco moderado con feedback.
- **Checklist:** all pass; retro partial (eco leve)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Sin `promoted_digest` no se inventa uno: se solicita aprobación de release y se detiene el promote. El error clásico es CONTINUE “mientras llega el digest”. Pregunta: ¿qué evidencia le das al lead de Piura en 30 segundos para decir «sí, mismo digest»? Eso cierra el gate de promoción del You Do.
- **Code/output changes:** none

---

### S44-T3-B-DEMO (iDo) — **A−**
- **Diagnosis:** Dual canary sano/fallido + migrate expand_first. Preamble pide predicción de tres líneas y aclara RTO. Retro (~33 w) repara ampliar tráfico con error alto; un poco corta.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: retro al piso 40 w)
- **Proposed residual:** none required
- **Code/output changes:** none

### S44-T3-B-E1 (weDo, guided) — **A−**
- **Diagnosis:** DEFECT premia error alto; solution camino sano completo. Feedback bueno; retro (~22 w) solo umbral + puente sin self-check.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Umbral medible + ensayo de rollback ≤ RTO son el contrato dual del canary. El error clásico es ampliar tráfico con error alto «para ver si se estabiliza». Pregunta: con 0.4% de error y rollback 75 s ≤ RTO 120, ¿por qué PASS no es lo mismo que “hold a ciegas”? Siguiente: adverso con 8% error y 500 s de rollback.
- **Code/output changes:** none

### S44-T3-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Tres rutas correctas. Eco schema vs breach de canary.
- **Checklist:** all pass; retro partial (eco + ~19 w)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Breach de canary/rollback no es falta de RTO: el adverso con 8% error y rollback no ensayado es incidente; sin `rto_seconds` es schema. El error clásico es ampliar tráfico sin RTO medible. Pregunta: si error está bajo umbral pero `rollback_seconds` es 500 y RTO 120, ¿PASS o ROLLBACK? Luego: PAUSE_CANARY.
- **Code/output changes:** none

### S44-T3-B-E3 (weDo, transfer) — **B**
- **Diagnosis:** Transfer PAUSE limpio; eco feedback/retro; self-check de log de portfolio bueno.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Sin `rto_seconds` no sabes si el ensayo de rollback fue a tiempo: pausas el canary. El error clásico es CONTINUE “porque el error aún no superó el umbral”. Pregunta: ¿qué log mínimo demuestras en el portfolio de canary/rollback de CP-N4-B?
- **Code/output changes:** none

---

### S44-T4-A-DEMO (iDo) — **B**
- **Diagnosis:** Reviews + notes operables. `why` (~31 w) bajo piso; retro (~30 w) repara notes de marketing.
- **Checklist:** all pass; why partial
- **Severity residual:** P2
- **Proposed why (expand):**  
  Branch protection + ≥1 review + checks + notes ⊇ {change, risk, migration, rollback}. Merge sin protección o notes solo con `change` → `BLOCK_UNREVIEWED_RELEASE`. En We Do el starter marca PASS sin protección o con reviews==0.
- **Proposed retrospective (expand):**  
  Review humano + notes operables = primer control de supply chain antes del publish. El error clásico es un tag con un párrafo de «mejoras». Pregunta: ¿qué falta si el set solo tiene `change`? We Do: `BLOCK_UNREVIEWED_RELEASE` y `COMPLETE_RELEASE_NOTES`.
- **Code/output changes:** none

### S44-T4-A-E1 (weDo, guided) — **B**
- **Diagnosis:** DEFECT sin protección; feedback ~21 w (piso); retro ~19 w solo fórmula + puente.
- **Checklist:** all pass; feedback/retro partial (longitud)
- **Severity residual:** P2
- **Proposed feedback (expand):**  
  El happy path tiene branch protegida y notes completas: si tu pred premia lo opuesto, el PASS real se vuelve BLOCK_UNREVIEWED_RELEASE. El adverso de E2 (sin protección, notes solo con `change`) debe fallar aunque el dict “se vea de release”.
- **Proposed retrospective (expand):**  
  Trazabilidad de release = protección + reviews + notes operables. El error clásico es merge directo a main “porque el CI ya pasó”. Pregunta: ¿por qué `required_checks` no basta sin el set de notes? Siguiente: adverso sin protección y notes solo con change.
- **Code/output changes:** none

### S44-T4-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Tres rutas correctas. Retro (~15 w) casi solo repite “notes solo con change” del feedback.
- **Checklist:** all pass; retro partial (eco + longitud)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Notes solo con `change` son breach de contenido, no «casi completas»: el on-call a las 02:00 necesita risk, migration y rollback. El error clásico es inventar el set en el assessor cuando falta el mapa. Pregunta: si falta `release_notes` del todo, ¿qué código devuelves antes de mirar reviews? Luego: COMPLETE_RELEASE_NOTES.
- **Code/output changes:** none

### S44-T4-A-E3 (weDo, transfer) — **B**
- **Diagnosis:** Transfer COMPLETE limpio. Eco feedback/retro; self-check de frase de rollback bueno.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Sin el mapa `release_notes` no se inventa un set: se exige completar notes antes de liberar. El error clásico es CONTINUE “mientras el PM escribe el changelog”. Pregunta: ¿qué frase de rollback escribiste en las notes que el on-call pueda ejecutar a las 02:00?
- **Code/output changes:** none

---

### S44-T4-B-DEMO (iDo) — **B**
- **Diagnosis:** Critical → block + evidencia. `why` (~29 w) y retro (~21 w) bajo piso; repara continue-on-error.
- **Checklist:** all pass; why/retro partial
- **Severity residual:** P2
- **Proposed why (expand):**  
  Critical + `pipeline_blocked` + logs_redacted + owner + evidence_retained. Breach silencioso (crítico sin bloqueo) → `STOP_SILENT_FAILURE`; sin evidencia → `ASSIGN_INCIDENT_OWNER`. En We Do el starter marca PASS si critical y **no** blocked.
- **Proposed retrospective (expand):**  
  Fallo crítico = block + dueño + evidencia redactada. El error clásico es re-lanzar con continue-on-error como aprobación silenciosa. Pregunta: si el test crítico falla a las 02:10, ¿qué tres piezas de evidencia retienes antes de reabrir el tag? We Do: `STOP_SILENT_FAILURE` y `ASSIGN_INCIDENT_OWNER`.
- **Code/output changes:** none

### S44-T4-B-E1 (weDo, guided) — **A−**
- **Diagnosis:** DEFECT critical && not blocked; solution AND completo. Feedback bueno; retro (~17 w) solo lista piezas + puente.
- **Checklist:** all pass; retro partial
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Auditabilidad = dueño + logs redactados + artifact retenido, no solo “el job falló”. El error clásico es PASS si critical y el pipeline sigue verde (continue-on-error). Pregunta: ¿por qué `logs_redacted` importa tanto como `pipeline_blocked`? Siguiente: adverso sin bloqueo, sin redaction, owner vacío.
- **Code/output changes:** none

### S44-T4-B-E2 (weDo, independent) — **B**
- **Diagnosis:** Tres rutas correctas. Retro (~13 w) la más corta de la sección; eco del feedback.
- **Checklist:** all pass; retro partial (eco + longitud crítica)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Breach silencioso (sin bloqueo/redaction/owner) no es lo mismo que falta del flag `evidence_retained`. El error clásico es inventar owner para «cerrar el ticket» del incidente. Pregunta: en el adverso con `pipeline_blocked=False` y owner vacío, ¿qué código devuelves y por qué no es MISSING? Luego: ASSIGN_INCIDENT_OWNER.
- **Code/output changes:** none

### S44-T4-B-E3 (weDo, transfer) — **B**
- **Diagnosis:** Cierre We Do → You Do. Eco feedback/retro casi literal; self-check de portfolio presente.
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Sin `evidence_retained` no se reintenta a ciegas: se asigna dueño de incidente y se retiene el rastro. El error clásico es CONTINUE o continue-on-error cuando falta evidencia. Pregunta de You Do: ¿qué owner y qué artifact retienes cuando el test crítico de tu portfolio falla?
- **Code/output changes:** none

---

### youDo (youDo) — **A**
- **Diagnosis:** Marco de proyecto sólido: context con entrada/salida/gate, objectives medibles, requirements (matriz, pin SHA, SBOM, canary, tres casos normal/breach/uncertain), starter con helpers y checklist BLOCKED→READY por diseño, portfolioNote de CP-N4-B, rúbrica 6 criterios, retrospective de defensa (~72 w) con invariante / sintético vs real / frase de impacto 30 s. No tocar evidence True del starter.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

---

## Priority order

### P0
Ninguno. Campos presentes; integridad de predicados OK; sin wrong≈right.

### P1
Ninguno bloqueante para learner. (Opcional P1-lite: alinear prefijo `pip-` vs `lock-` en T1-B demo si se toca código.)

### P2 (polish — Fixer R2)
1. **Eco feedback/retrospective en E2/E3** (prioridad alta de prosa): T1-A-E2/E3, T1-B-E2/E3, T2-A-E2/E3, T2-B-E2/E3, T3-A-E2/E3, T3-B-E2/E3, T4-A-E2/E3, T4-B-E2/E3 — reescribir retro con principio + misconception *distinto* + transfer/self-check (textos propuestos en ledger).
2. **Retrospectives cortas E1** (expandir, no clonar feedback): T2-B-E1, T3-A-E1, T3-B-E1, T4-A-E1, T4-B-E1.
3. **iDo why bajo piso:** T2-B-DEMO, T3-A-DEMO, T4-A-DEMO, T4-B-DEMO.
4. **iDo retrospectives cortas:** T1-B, T2-A, T2-B, T3-A, T4-A, T4-B.
5. **T1-B demo prefijo `pip-` vs lab `lock-`:** alinear o aclarar en preamble.
6. **Hints genéricos E1** (“Relaciona los campos… revisa dirección de comparación”): opcional endurecer con una miga de dominio sin spoiler; no expandir a solución.

---

## Residual risks

1. **Homogeneidad residual de prosa E2/E3:** el patrón assess/decide es pedagógico; el eco feedback≈retro en ~16 unidades es el mayor residual de *calidad verbal* post-fix R1. El Fixer debe **reescribir a mano** unit por unit, no search-replace de un template de “error clásico”.
2. **Audience Master vs true newbie:** preambles ya traducen jerga (attestation, RTO, least privilege) en una frase; no diluir rigor del gate al alargar retros.
3. **Outputs canónicos:** no alterar strings (`S44-T*-* PASS`, triples assess/decide); alinear `pip-`→`lock-` en demo preserva `cache_key True`.
4. **You Do BLOCKED por diseño:** no “arreglar” evidence a True; retrospective ya refuerza READY = archivos reales.
5. **id interno `multimodal`:** nombre histórico; no renombrar en este round.
6. **Instructions cortas (~19–30 w):** aceptables con preamble bullets; no hinchar a essay — si se tocan, solo +1 miga en E2 “contrato T*-*” cuando el DEFECT no nombra el campo.

---

## Fixer handoff notes (Round 2)

- **No** reintroducir missing fields; ya están.
- Priorizar: desacoplar **retrospective** de **feedback** en E2/E3; alargar retros E1 e iDo `why`/retro bajo piso.
- Usar textos “Proposed *” del ledger como base; reescribir a mano, no copiar en bloque entre subtemas.
- Preservar exact outputs y comentarios `# DEFECT:`.
- Español profesional peruano; CASO-PIU-044 sintético; sin PII ni secretos reales.
- Opcional: unificar prefijo de cache demo con We Do (`lock-`).
- Sin generadores; polish unidad por unidad.

---

Section 44 exercise pedagogy review complete. Ready for the Fixer prompt.
