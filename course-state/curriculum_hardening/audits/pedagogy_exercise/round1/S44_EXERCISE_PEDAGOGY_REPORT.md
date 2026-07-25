# S44 Exercise Pedagogy Report (Round 1)

## Section
- **title:** CI/CD y seguridad de la cadena de suministro
- **shortTitle:** CI/CD supply chain
- **id:** `multimodal`
- **index:** 44
- **source:** `src/lib/course/sections/s44-multimodal.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades de práctica/demo)
- **subtemas:** S44-T1-A lint/types/tests y matrices · T1-B caches/artifacts/condiciones · T2-A permisos/pinning/secret scan · T2-B SBOM/provenance/attestations · T3-A environments/approvals · T3-B migrations/canary/rollback · T4-A branch/review/release notes · T4-B failure handling/evidencia
- **hilo de caso:** ops sintético **CASO-PIU-044** (Piura); servicio contenedorizado de S43 llevado a cadena de suministro verificable; gate **CP-N4-B**; stdlib modelando GHA/SLSA; sin registry remoto obligatorio, secretos reales ni PII

## Method
- Leído `PEDAGOGY_EXERCISE_SPEC.md` (campos, longitudes 80–150 preamble / 40–80 retrospective / 40–100 instruction, checklist context/goal/success/constraints, fade E1→E2→E3).
- Inspeccionado manualmente cada `iDo.steps[]` (8 demos, ~361–560), `weDo.steps[]` (24 ejercicios, ~562–1798) y `youDo` (~1801–1901) en `s44-multimodal.ts`.
- Contrastado con theory T1–T4: matriz CI → evidencia cache/artifact → least privilege/pin SHA → SBOM/provenance → promote mismo digest → canary/RTO → branch protection/notes → fallo crítico con evidencia.
- **Sin** generadores, bucles, plantillas ni copy-paste mecánico entre unidades.
- Prosa propuesta en **español profesional peruano**, un objetivo primario por unidad.
- Nota: el andamiaje de *código* (DEFECT nombrados, fixtures CASO-PIU-044-*, outputs canónicos, fade E1 fix → E2 assess → E3 decide fail-closed) es maduro y alineado a theory; los campos pedagógicos `preamble` / We Do `title` / `retrospective` **no existen** en el source (0 matches de campo de ejercicio; solo titles de archivos de código y el title del youDo).

## Hallazgos transversales (antes del ledger)

| Campo / hábito | Estado actual en S44 |
|----------------|----------------------|
| I Do `preamble` | **Ausente** en las 8 demos |
| I Do `retrospective` | **Ausente** en las 8 demos |
| I Do `description` | Presente y técnica (qué calcula el demo); no sustituye preamble (escena Piura + qué observar) |
| I Do `why` | Presente; ~1 frase densa; a menudo **bajo** del piso 40–90 palabras |
| We Do `title` | **Ausente** en los 24 |
| We Do `preamble` | **Ausente** en los 24 |
| We Do `retrospective` | **Ausente** en los 24 |
| We Do `instruction` | Densa y **técnicamente excelente**: nombra DEFECT, fixture, gate y salida exacta; **mezcla** contexto + meta + éxito + límites en un solo bloque — legible para quien ya opera pipelines, **opaco** para un newbie sin escena de release en Piura |
| We Do `feedback` | Presente en los 24; nombra el contrato del gate (bien); a menudo 1 frase meta (“explica qué campo…”); poco *por qué importa en ops de Piura* ni metacognición concreta |
| Starter `# DEFECT:` | **Excelente** en todos; defectos bien nombrados (OR débil, pred invertido, missing→CONTINUE, write/secret, digests divergentes, rebuild al promover, canary roto, branch sin reviews, crítico sin bloqueo) |
| Hints | E1 casi-solución (aceptable guiado); E2/E3 con menos migas; fade real de andamiaje de código |
| You Do marco | `context` / `objectives` / `requirements` / `rubric` / `portfolioNote` / starter con helpers de pin/CI/SBOM/promote/canary y checklist BLOCKED→READY **sólidos** y alineados a CP-N4-B |
| You Do `retrospective` | **Ausente** |
| Código / outputs | Coherentes con theory y CASO-PIU-044; **no** proponer cambios de output salvo notas puntuales |

**Patrón dominante:** el andamiaje de *código* (fixtures sintéticos, bugs nombrados, outputs canónicos, progresión E1 corrección de predicado → E2 tabla valid/invalid/missing → E3 CONTINUE/breach/REQUEST_*, gates con códigos de error de oficio) es de referencia para Master. El andamiaje *pedagógico verbal* (preamble → instruction solo-tarea → retrospective) no existe. Un true newbie no responde con claridad: qué practico, por qué importa en un release de ops en Piura, cómo sé que gané, qué debe quedarme al cerrar la pestaña.

**Fade E1→E2→E3 (contenido):** progresión real por subtema (p. ej. T1-A: AND de lint/types/tests + matrix==supported → assess PASS/FAIL_CI_GATE/MISSING:supported → decide CONTINUE/FAIL_CI_GATE/REVIEW_MATRIX; T2-A: pin SHA 40 hex + least privilege → assess → SECURITY_APPROVAL). **No** son tres clones con números distintos. El fade de *prosa* no se ve porque no hay preambles diferenciados.

**Severity default:** missing title+preamble+retrospective en We Do = **P0**; I Do sin preamble/retrospective = **P1** (aún tienen description+why+código); youDo sin retrospective = **P1**; polish de feedback/why = **P2** si caen preamble/instruction/retrospective.

---

## Unit ledger

### S44-T1-A-DEMO (iDo)
- **Diagnosis:** Demo sólida del AND de lint/types/tests y de la igualdad matriz==soportada. La `description` nombra el skill; falta `preamble` que diga *qué observar* (tres checks en AND, no OR; matriz exacta) y `retrospective` del misconception “un test verde basta”. El `why` es una frase densa, bajo el piso de longitud.
- **Checklist:** context fail · goal partial · success partial (output visible) · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Antes de gastar minutos en SBOM o publish, el repo de ops de Piura (CASO-PIU-044) debe **certificar el código**. En esta demo tres checks verdes y la matriz `{3.11, 3.12}` coinciden con lo soportado. No escribas aún: predice si `gates_green` devuelve `True` y por qué un solo check rojo o Python 3.10 fuera de matriz tumbaría el gate. Observa las tres líneas: `ok`, `n 3` y `matrix_ok`.
- **Proposed instruction/description improvements:**  
  Mantener description. Ampliar `why` (~50–70 palabras): lint → types → tests en AND es barato antes de lo costoso; la matriz solo cubre runtimes reales; un semáforo verde sin igualdad matriz==soportada miente; sin secretos ni registry. Puente a We Do: el starter usa OR débil en lugar de AND + igualdad de conjuntos.
- **Proposed retrospective:**  
  Si puedes explicar por qué tres checks en OR no son un gate de CI sin mirar el código, ya tienes el hábito de certificar antes de publicar. El error clásico es “tests pasaron, el resto es opcional”. En We Do repararás el predicado y el fallo cerrado con `FAIL_CI_GATE` / `REVIEW_MATRIX`.
- **Code/output changes:** none
- **Validation notes:** Output `True` / `n 3` / `matrix_ok True` alineado a theory T1-A.

---

### S44-T1-A-E1 (weDo, guided)
- **Diagnosis:** Drill guiado claro: starter aprueba con OR de lint|types|tests y **omite** la igualdad matrix==supported. Instruction densa mezcla DEFECT, contrato y salida; sin title, preamble ni retrospective. Feedback meta (“explica qué campo…”) sin anclar el riesgo de promover un PR con typecheck rojo.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres checks en AND y matriz exacta
- **Proposed preamble:**  
  - **Contexto:** en CASO-PIU-044-1A el PR de ops de Piura solo avanza si lint, types y tests pasan **todos** y la matriz ejecutada es la soportada.  
  - **Meta:** corregir el predicado (AND de los tres checks + `matrix == supported`).  
  - **Éxito:** una línea `S44-T1-A PASS`.  
  - **Límites:** no mutes el fixture; no uses OR; el DEFECT está en la expresión, no en los datos.
- **Proposed instruction/description improvements:**  
  1. Abre el starter: `meets_contract` usa `lint or types or tests` (DEFECT).  
  2. Cámbialo a `all(...)` de lint/types/tests **y** `matrix == supported`.  
  3. Conserva el print de status.  
  4. Debe imprimir `S44-T1-A PASS`.
- **Proposed feedback improvement:**  
  Con los tres checks en True y matriz idéntica, solo el AND + igualdad devuelve PASS. El OR aprueba un typecheck rojo si lint pasó: el gate de CI deja de ser fail-closed.
- **Proposed retrospective:**  
  Certificar en AND barato → caro es el primer eslabón de supply chain. El error clásico es OR parcial o ignorar una versión fuera de matriz. Siguiente (E2): enrutar válido, adverso y sin `supported`.
- **Code/output changes:** none
- **Validation notes:** DEFECT bien nombrado; solution y output `S44-T1-A PASS` correctos.

---

### S44-T1-A-E2 (weDo, independent)
- **Diagnosis:** Independiente fuerte: tres rutas PASS / FAIL_CI_GATE / MISSING:supported. Instruction ya lista salidas; falta escena de “schema antes que contenido” y cierre metacognitivo. Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas del gate de CI
- **Proposed preamble:**  
  - **Contexto:** el job de Piura no inventa una matriz cuando falta `supported`: primero valida campos, luego mide contenido.  
  - **Meta:** implementar `assess` que separe válido, adverso (types False + 3.10) y sin `supported`.  
  - **Éxito:** `PASS FAIL_CI_GATE MISSING:supported`.  
  - **Límites:** calcula `missing` antes de leer `supported`; no rellenes la matriz; datos sintéticos CASO-PIU-044-1A.
- **Proposed instruction/description improvements:**  
  1. Revisa el starter: PASS si OR de lint/types/tests (DEFECT).  
  2. Corrige a AND + matrix==supported.  
  3. Conserva la rama MISSING por campos ausentes.  
  4. Imprime las tres salidas en orden.
- **Proposed retrospective:**  
  Schema (MISSING) se evalúa antes que breach (FAIL_CI_GATE). El error clásico es acceder a `supported` cuando falta y tumbar el flujo. Luego (E3): CONTINUE / FAIL_CI_GATE / REVIEW_MATRIX.
- **Code/output changes:** none
- **Validation notes:** E2 con menos migas que E1; output canónico intacto.

---

### S44-T1-A-E3 (weDo, transfer)
- **Diagnosis:** Transferencia real al fallo cerrado: CONTINUE / FAIL_CI_GATE / REVIEW_MATRIX. Starter trata missing como CONTINUE y pred con OR. Instruction ya nombra las rutas; falta anclar reutilización en You Do y retrospective “ausencia ≠ breach”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Fail-closed: REVIEW_MATRIX o FAIL_CI_GATE
- **Proposed preamble:**  
  - **Contexto:** en plataforma de Piura no se asume “todo OK” si falta la matriz soportada: se deriva a revisión humana.  
  - **Meta:** decidir CONTINUE / FAIL_CI_GATE / REVIEW_MATRIX.  
  - **Éxito:** `CONTINUE FAIL_CI_GATE REVIEW_MATRIX`.  
  - **Límites:** missing → REVIEW_MATRIX (no CONTINUE); no inventes `supported`; breach de checks cierra con FAIL_CI_GATE.
- **Proposed instruction/description improvements:**  
  1. Lee el DEFECT: missing devuelve CONTINUE y pred usa OR.  
  2. En `decide`, missing → `REVIEW_MATRIX`.  
  3. Completos: CONTINUE solo si AND + matrix==supported; si no → FAIL_CI_GATE.  
  4. Imprime las tres decisiones en orden.
- **Proposed retrospective:**  
  REVIEW_* pide evidencia de matriz; FAIL_* cierra el breach; CONTINUE solo con CI certificada. El error clásico es tratar “falta supported” como éxito silencioso. Pregunta: ¿por qué no rellenar `{3.11, 3.12}` por defecto sin dueño?
- **Code/output changes:** none
- **Validation notes:** Transfer auténtico; alineado a callout REVIEW_MATRIX de theory T1-A.

---

### S44-T1-B-DEMO (iDo)
- **Diagnosis:** Worked example claro: cache_key prefijada por lock y artifact con sha256 + retención ≥7. Falta preamble que separe “cache hit ≠ evidencia” y retrospective del misconception “si la cache pegó, el wheel es confiable”. El `why` es corto.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  En CASO-PIU-044 la caché de pip acelera el job, pero **no prueba** que el build sea reproducible. En esta demo la clave empieza por `pip-` (derivada del lock) y el artifact `sha256:def` con 14 días de retención es publicable. No escribas: predice `cache_key True`, `artifact True` y la condición `main_and_tags`. Observa por qué un digest `latest` o retención 0 no contarían como evidencia.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: la cache es optimización ligada al lockfile; el artifact con digest y retención es lo que un auditor re-descarga; tags de release sin los mismos gates que main se descartan. Puente a We Do: el starter invierte cache_miss_passes y conditions.
- **Proposed retrospective:**  
  Cache acelera; artifact verificable es la fuente de verdad del job. El error clásico es tratar un cache hit como “build OK”. We Do: predicado lock- + sha256 + retención + tags cubiertos.
- **Code/output changes:** none
- **Validation notes:** Output alineado a theory T1-B.

---

### S44-T1-B-E1 (weDo, guided)
- **Diagnosis:** Starter invierte el contrato (PASS si cache_miss no pasa o conditions incompletas). Instruction densa sin title/preamble/retrospective. Feedback genérico de “explica qué campo”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Artifact verificable, no solo cache
- **Proposed preamble:**  
  - **Contexto:** en CASO-PIU-044-1B el wheel de Piura solo se adjunta si el miss de cache aún produce resultado y el digest es verificable.  
  - **Meta:** corregir el predicado (prefijo `lock-`, miss pasa, sha256, retención ≥7, tags cubiertos).  
  - **Éxito:** `S44-T1-B PASS`.  
  - **Límites:** no mutes el fixture; no publiques con digest `latest`; DEFECT en la expresión booleana.
- **Proposed instruction/description improvements:**  
  1. El starter marca PASS con `not cache_miss_passes or not conditions_cover_tags` (DEFECT).  
  2. Reemplaza por AND de startswith lock-, miss True, sha256, retention ≥7, conditions True.  
  3. Conserva el print.  
  4. Debe imprimir `S44-T1-B PASS`.
- **Proposed feedback improvement:**  
  Un cache miss que sigue produciendo el wheel es señal de robustez, no de fallo. Invertir esa flag convierte el happy path en DISCARD_PIPELINE_RESULT y el adverso de E2 “parece” válido.
- **Proposed retrospective:**  
  Evidencia = digest + retención + condiciones de release, no velocidad de install. El error clásico es confiar en cache global sin lock. Siguiente: tres rutas con DISCARD y MISSING de conditions.
- **Code/output changes:** none
- **Validation notes:** Solution y output correctos.

---

### S44-T1-B-E2 (weDo, independent)
- **Diagnosis:** Tabla valid/invalid/incomplete sólida. Sin escena ni retrospective; instruction mezcla essay + tarea.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de evidencia de build
- **Proposed preamble:**  
  - **Contexto:** el pipeline de Piura descarta un job si la cache es global, el digest es `latest` o los tags no tienen gates.  
  - **Meta:** `assess` con PASS / DISCARD_PIPELINE_RESULT / MISSING:conditions_cover_tags.  
  - **Éxito:** exactamente esas tres cadenas en una línea.  
  - **Límites:** missing antes de leer conditions; no inventes cobertura de tags; fixture sintético.
- **Proposed instruction/description improvements:**  
  1. Starter: PASS con pred invertido (DEFECT).  
  2. Aplica el contrato completo de T1-B sobre datos completos.  
  3. Conserva MISSING por schema.  
  4. Imprime `PASS DISCARD_PIPELINE_RESULT MISSING:conditions_cover_tags`.
- **Proposed retrospective:**  
  El adverso falla por **contenido** (global/latest/retención 0), no por schema. El error clásico es mezclar “falta el campo” con “el campo está mal”. Luego: CONTINUE vs INSPECT_WORKFLOW_CONDITION.
- **Code/output changes:** none
- **Validation notes:** Output canónico intacto.

---

### S44-T1-B-E3 (weDo, transfer)
- **Diagnosis:** Fail-closed con CONTINUE / DISCARD_PIPELINE_RESULT / INSPECT_WORKFLOW_CONDITION. Starter missing→CONTINUE y pred invertido. Sin preamble de incertidumbre ni retrospective de “no rellenar evidencia”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Fail-closed: inspeccionar condiciones del workflow
- **Proposed preamble:**  
  - **Contexto:** si no sabes si los tags de release de Piura comparten gates con main, **pausas a revisar el workflow**, no inventas True.  
  - **Meta:** decide CONTINUE / DISCARD_PIPELINE_RESULT / INSPECT_WORKFLOW_CONDITION.  
  - **Éxito:** `CONTINUE DISCARD_PIPELINE_RESULT INSPECT_WORKFLOW_CONDITION`.  
  - **Límites:** missing ≠ breach; no rellenes conditions; no publiques digest huérfano.
- **Proposed instruction/description improvements:**  
  1. DEFECT: missing → CONTINUE; pred invertido.  
  2. missing → INSPECT_WORKFLOW_CONDITION.  
  3. Completos: CONTINUE solo con contrato T1-B; si no → DISCARD.  
  4. Imprime en orden valid, invalid, uncertain.
- **Proposed retrospective:**  
  INSPECT_* reabre el workflow; DISCARD_* tira el resultado; CONTINUE solo con artifact defendible. Pregunta: ¿por qué un tag de prod sin gates es peor que un job lento?
- **Code/output changes:** none
- **Validation notes:** Alineado a theory T1-B.

---

### S44-T2-A-DEMO (iDo)
- **Diagnosis:** Demo de secret_scan block + pin SHA 40 hex + least privilege. Excelente anti-patrón de tag flotante implícito. Falta preamble “el token es atacante” y retrospective del misconception “@v4 es pin profesional”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  El token del workflow de Piura es un **atacante en potencia** si tiene write amplio. En esta demo hay 1 hit de secreto (debe bloquear), permisos least y un checkout pinneado con SHA de 40 hex. No escribas: predice `gitleaks block`, `perms least` y `pin True`. Observa que un `@v4` no pasaría `is_full_sha_pin`.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: pin inmutable = 40 hex; tags se mueven; secret_hits > 0 obliga a rotar, no a “limpiar el log”; contents:read es el default defendible. Puente a We Do: el starter aprueba write o secret hits.
- **Proposed retrospective:**  
  Least privilege + pin SHA + cero secretos en logs es el suelo de hardening. El error clásico es pin por tag flotante. We Do: calcular el pin del string `action_ref`, no de un booleano mágico.
- **Code/output changes:** none
- **Validation notes:** Output `gitleaks block` / `perms least` / `pin True` correcto.

---

### S44-T2-A-E1 (weDo, guided)
- **Diagnosis:** DEFECT fuerte (PASS si write o secret_hits>0; ignora pin real). Instruction ya menciona SHA 40 hex; sin title/preamble/retrospective. Feedback un poco mejor que el resto (nombra pin real) pero aún meta.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Pin SHA y least privilege
- **Proposed preamble:**  
  - **Contexto:** en CASO-PIU-044-2A el workflow de Piura usa `contents: read` y checkout con SHA real de 40 hex.  
  - **Meta:** implementar least privilege + `full_sha_pin` + secret_hits==0 + dependency_review.  
  - **Éxito:** `S44-T2-A PASS`.  
  - **Límites:** no mutes el PIN; no aceptes `@v4`; no cambies el assert; sin secretos reales.
- **Proposed instruction/description improvements:**  
  1. Starter: PASS si write o secret_hits>0 (DEFECT invertido).  
  2. Extrae el ref tras `@` y valida len 40 hex.  
  3. AND con permisos ⊆ {read, none}, secret_hits==0 y dependency_review.  
  4. Imprime `S44-T2-A PASS`.
- **Proposed feedback improvement:**  
  El pin se **calcula** del string, no se asume. Un predicado que premia write o secret hits revoca la confianza del token: el adverso de E2 debe activar REVOKE_AND_ROTATE.
- **Proposed retrospective:**  
  SHA inmutable cierra supply chain de actions; write amplio y secretos en logs obligan a rotar. Siguiente: clasificar tag `@v4` como breach de contenido.
- **Code/output changes:** none
- **Validation notes:** Solution con `full_sha_pin` es el patrón a reutilizar en You Do.

---

### S44-T2-A-E2 (weDo, independent)
- **Diagnosis:** Tres rutas con inválido write+@v4+secret. Instruction ya pide no usar booleano actions_pinned. Sin preamble/title/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de endurecimiento del workflow
- **Proposed preamble:**  
  - **Contexto:** un job de release en Piura con `packages: write` y checkout@v4 no es “casi pinneado”: es breach.  
  - **Meta:** assess PASS / REVOKE_AND_ROTATE / MISSING:dependency_review.  
  - **Éxito:** `PASS REVOKE_AND_ROTATE MISSING:dependency_review`.  
  - **Límites:** missing antes del dominio; pin calculado; no inventes dependency_review.
- **Proposed instruction/description improvements:**  
  1. Starter aprueba write/secret (DEFECT).  
  2. Reutiliza full_sha_pin y least privilege.  
  3. Conserva MISSING.  
  4. Imprime las tres salidas.
- **Proposed retrospective:**  
  Schema (falta review) ≠ breach (write/tag/secret). El error clásico es marcar PASS si “hay un action_ref” sin validar el SHA. Luego: SECURITY_APPROVAL en incertidumbre.
- **Code/output changes:** none
- **Validation notes:** Inválido con dependency_review False sigue siendo REVOKE por contenido cuando el campo está presente — correcto en solution.

---

### S44-T2-A-E3 (weDo, transfer)
- **Diagnosis:** Fail-closed CONTINUE / REVOKE_AND_ROTATE / SECURITY_APPROVAL. Starter missing→CONTINUE y pred invertido. Sin ancla de “aprobación de seguridad no es inventar pin”.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Fail-closed: rotar o pedir SECURITY_APPROVAL
- **Proposed preamble:**  
  - **Contexto:** sin dependency_review el lead de ops en Piura no inventa un True: pide **aprobación de seguridad**.  
  - **Meta:** decide CONTINUE / REVOKE_AND_ROTATE / SECURITY_APPROVAL.  
  - **Éxito:** `CONTINUE REVOKE_AND_ROTATE SECURITY_APPROVAL`.  
  - **Límites:** missing ≠ CONTINUE; no apruebes tag flotante; sin secretos reales.
- **Proposed instruction/description improvements:**  
  1. DEFECT: missing→CONTINUE; pred premia write/secret.  
  2. missing → SECURITY_APPROVAL.  
  3. Completos: CONTINUE solo con contrato T2-A; si no → REVOKE_AND_ROTATE.  
  4. Imprime en orden.
- **Proposed retrospective:**  
  REVOKE_* implica rotación de credenciales; SECURITY_APPROVAL es incertidumbre, no breach silencioso. Pregunta: ¿por qué `@v4` no se “promueve” a pin con un comentario en el YAML?
- **Code/output changes:** none
- **Validation notes:** Transfer alineado a theory T2-A.

---

### S44-T2-B-DEMO (iDo)
- **Diagnosis:** Demo de tres digests idénticos y attestation implícita (verifiable/spdx True). Falta preamble del “binario huérfano” y retrospective del misconception “copiar el SBOM del build anterior”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Una attestation no “garantiza calidad”: impide promover un binario **huérfano de evidencia**. En esta demo artifact, SBOM y subject de provenance comparten `sha256:abc`. No escribas: predice `attest True` y por qué un SBOM del build de ayer con otro digest fallaría. Observa las tres salidas.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: len del set de digests == 1 es el contrato medible; divergencia → REJECT_ATTESTATION; sin attestation_valid se reconstruye provenance. Puente a We Do: el starter exige len > 1 (invertido).
- **Proposed retrospective:**  
  Mismo subject en artifact, SBOM y provenance: esa es la cadena. El error clásico es reutilizar SBOM “porque casi es el mismo”. We Do: alinear digests + attestation_valid.
- **Code/output changes:** none
- **Validation notes:** Output alineado a theory T2-B.

---

### S44-T2-B-E1 (weDo, guided)
- **Diagnosis:** DEFECT claro (PASS si digests divergen). Instruction densa; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Un solo digest en la cadena
- **Proposed preamble:**  
  - **Contexto:** en CASO-PIU-044-2B el wheel de Piura, su SBOM y el subject de provenance deben ser el **mismo** digest.  
  - **Meta:** corregir a len(set)==1 y attestation_valid.  
  - **Éxito:** `S44-T2-B PASS`.  
  - **Límites:** no mutes digests del fixture; no copies SBOM de otro build; DEFECT en la comparación.
- **Proposed instruction/description improvements:**  
  1. Starter: PASS si len({...}) > 1 (DEFECT).  
  2. Cámbialo a == 1 **y** attestation_valid.  
  3. Conserva print/status.  
  4. Debe imprimir `S44-T2-B PASS`.
- **Proposed feedback improvement:**  
  Tres digests distintos no son “casi alineados”: la attestation miente. Con len==1 y attestation True el happy path es PASS; el adverso de E2 activa REJECT_ATTESTATION.
- **Proposed retrospective:**  
  Integridad medible por igualdad de digests, no por narrativa del README. Siguiente: valid / divergente / sin attestation_valid.
- **Code/output changes:** none
- **Validation notes:** Solution correcta.

---

### S44-T2-B-E2 (weDo, independent)
- **Diagnosis:** Tres rutas con digests aaa/bbb/ccc en adverso. Sin escena de auditoría ni retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de attestation
- **Proposed preamble:**  
  - **Contexto:** el auditor de supply chain en Piura rechaza digests divergentes aunque el README diga OK.  
  - **Meta:** assess PASS / REJECT_ATTESTATION / MISSING:attestation_valid.  
  - **Éxito:** `PASS REJECT_ATTESTATION MISSING:attestation_valid`.  
  - **Límites:** missing antes de leer attestation_valid; no inventes True; sintético.
- **Proposed instruction/description improvements:**  
  1. Starter: PASS con digests divergentes (DEFECT).  
  2. Corrige a len==1 y attestation_valid.  
  3. Conserva MISSING.  
  4. Imprime las tres salidas.
- **Proposed retrospective:**  
  Falta el flag de attestation → schema; digests distintos → breach. El error clásico es devolver PASS si “hay algún digest”. Luego: REBUILD_PROVENANCE.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S44-T2-B-E3 (weDo, transfer)
- **Diagnosis:** Fail-closed CONTINUE / REJECT_ATTESTATION / REBUILD_PROVENANCE. Starter missing→CONTINUE y pred invertido.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Fail-closed: rebuild de provenance
- **Proposed preamble:**  
  - **Contexto:** sin saber si la attestation es válida, Piura **reconstruye provenance**, no inventa un check verde.  
  - **Meta:** decide CONTINUE / REJECT_ATTESTATION / REBUILD_PROVENANCE.  
  - **Éxito:** `CONTINUE REJECT_ATTESTATION REBUILD_PROVENANCE`.  
  - **Límites:** missing ≠ CONTINUE; no rellenes attestation_valid; no promuevas digest huérfano.
- **Proposed instruction/description improvements:**  
  1. DEFECT: missing→CONTINUE; pred len>1.  
  2. missing → REBUILD_PROVENANCE.  
  3. Completos: CONTINUE solo si digests alineados + attestation; si no → REJECT.  
  4. Imprime en orden.
- **Proposed retrospective:**  
  REJECT cierra la cadena rota; REBUILD pide rehacer evidencia. Pregunta: ¿por qué copiar el SBOM del release anterior rompe CP-N4-B aunque el código “casi no cambió”?
- **Code/output changes:** none
- **Validation notes:** Alineado a theory T2-B.

---

### S44-T3-A-DEMO (iDo)
- **Diagnosis:** Demo excelente del anti-patrón rebuild al promover (ok True vs rebuild_denied False). Falta preamble de “mismo subject” y retrospective del misconception “rebuild para estar seguros”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Producción en Piura no se alimenta de un rebuild improvisado: se mueve el **mismo digest** que pasó staging. En esta demo staging→prod con `sha256:abc` y aprobador `lead` es OK; el rebuild a `sha256:new` se niega. No escribas: predice `next prod`, `ok True` y `rebuild_denied False`. Observa la igualdad tested==promoted.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: source staging, target prod, approved_by truthy, digests iguales y prefijo sha256; rebuild al promover huérfana la provenance. Puente a We Do: starter PASS sin approval o con digests distintos.
- **Proposed retrospective:**  
  Mismo digest + aprobación independiente = promote defendible. El error clásico es “reconstruir para estar seguros”. We Do: DENY_PROMOTION y REQUEST_RELEASE_APPROVAL.
- **Code/output changes:** none
- **Validation notes:** Output de tres líneas alineado a theory T3-A.

---

### S44-T3-A-E1 (weDo, guided)
- **Diagnosis:** DEFECT: PASS si no approved_by o digests distintos. Instruction densa; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Mismo digest y aprobación independiente
- **Proposed preamble:**  
  - **Contexto:** en CASO-PIU-044-3A staging aprobó `sha256:abc`; production solo se mueve con `release-owner` y el **mismo** digest.  
  - **Meta:** corregir a staging→production + approved_by + digests idénticos.  
  - **Éxito:** `S44-T3-A PASS`.  
  - **Límites:** no mutes digests; no promuevas desde dev; DEFECT en el predicado.
- **Proposed instruction/description improvements:**  
  1. Starter: PASS con not approved_by o digests != (DEFECT).  
  2. Exige source staging, target production, bool(approved_by), tested==promoted.  
  3. Conserva print.  
  4. `S44-T3-A PASS`.
- **Proposed feedback improvement:**  
  Invertir el predicado hace que el happy path (aprobado y digests iguales) falle. Rebuild a otro digest con el mismo aprobador sigue siendo DENY en E2.
- **Proposed retrospective:**  
  Promote mueve el subject testeado, no un binario nuevo. Siguiente: tres rutas con dev/sin approval/digest new.
- **Code/output changes:** none
- **Validation notes:** Solution correcta.

---

### S44-T3-A-E2 (weDo, independent)
- **Diagnosis:** Inválido desde dev, sin approved_by, digest new. Sin escena de mesa de release.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de promoción
- **Proposed preamble:**  
  - **Contexto:** el lead de ops en Piura pregunta “¿podemos promover?”: la respuesta es digests y aprobador, no el README.  
  - **Meta:** assess PASS / DENY_PROMOTION / MISSING:promoted_digest.  
  - **Éxito:** `PASS DENY_PROMOTION MISSING:promoted_digest`.  
  - **Límites:** missing antes de leer promoted_digest; no inventes digest; sintético.
- **Proposed instruction/description improvements:**  
  1. Starter: PASS con pred invertido (DEFECT).  
  2. Aplica contrato T3-A completo.  
  3. Conserva MISSING.  
  4. Imprime las tres salidas.
- **Proposed retrospective:**  
  Promover desde dev o con digest distinto es breach de contenido. El error clásico es inventar promoted_digest para “cerrar el ticket”. Luego: REQUEST_RELEASE_APPROVAL.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S44-T3-A-E3 (weDo, transfer)
- **Diagnosis:** Fail-closed CONTINUE / DENY_PROMOTION / REQUEST_RELEASE_APPROVAL. Starter missing→CONTINUE.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Fail-closed: pedir aprobación de release
- **Proposed preamble:**  
  - **Contexto:** sin `promoted_digest` no se inventa uno: se **solicita aprobación de release** y se detiene el promote.  
  - **Meta:** decide CONTINUE / DENY_PROMOTION / REQUEST_RELEASE_APPROVAL.  
  - **Éxito:** `CONTINUE DENY_PROMOTION REQUEST_RELEASE_APPROVAL`.  
  - **Límites:** missing ≠ CONTINUE; no rellenes digest; no rebuild al promover.
- **Proposed instruction/description improvements:**  
  1. DEFECT: missing→CONTINUE; pred invertido.  
  2. missing → REQUEST_RELEASE_APPROVAL.  
  3. Completos: CONTINUE solo con contrato T3-A; si no → DENY.  
  4. Imprime en orden.
- **Proposed retrospective:**  
  REQUEST_* es incertidumbre humana; DENY_* cierra el anti-patrón. Pregunta: ¿qué evidencia le das al lead de Piura en 30 segundos para decir “sí, mismo digest”?
- **Code/output changes:** none
- **Validation notes:** Alineado a theory T3-A y CP-N4-B.

---

### S44-T3-B-DEMO (iDo)
- **Diagnosis:** Demo dual canary sano (hold_healthy) vs fallido (rollback) más migrate expand_first. Falta preamble de RTO y retrospective del misconception “canary es marketing de porcentaje”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  El canary de Piura al 10% **mide** error contra umbral y tiene rollback ensayado dentro del RTO. En esta demo migración compatible, 0.4% de error bajo 1% → hold; 8% sobre 5% → rollback. No escribas: predice las tres líneas de salida. Observa que rollback_s 75 ≤ rto 120 en el camino fallido aún devuelve `rollback` (no “hold”).
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: contrato dual PASS (sano + rollback listo) vs incidente (error sobre umbral → rollback); sin rto_seconds no se mide el ensayo. Puente a We Do: starter PASS si error alto o rollback no tested.
- **Proposed retrospective:**  
  Canary sano = hold; canary roto = rollback al digest previo dentro del RTO. El error clásico es ampliar tráfico con error alto “para ver si se estabiliza”. We Do: ROLLBACK_RELEASE y PAUSE_CANARY.
- **Code/output changes:** none
- **Validation notes:** Output `migration expand_first` / `healthy hold_healthy` / `failed rollback` correcto.

---

### S44-T3-B-E1 (weDo, guided)
- **Diagnosis:** DEFECT: PASS si error_rate > max o not rollback_tested (invierte el camino sano). Sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Canary bajo umbral y rollback en RTO
- **Proposed preamble:**  
  - **Contexto:** en CASO-PIU-044-3B el servicio de jobs de Piura canariza con 0.4% de error (umbral 1%) y rollback ensayado en 75 s (RTO 120).  
  - **Meta:** migración compatible + error ≤ umbral + rollback_tested + segundos ≤ RTO.  
  - **Éxito:** `S44-T3-B PASS`.  
  - **Límites:** no mutes tasas; no ignores RTO; DEFECT en el predicado.
- **Proposed instruction/description improvements:**  
  1. Starter: PASS con error alto o sin rollback (DEFECT).  
  2. Invierte a AND del camino sano completo.  
  3. Conserva print.  
  4. `S44-T3-B PASS`.
- **Proposed feedback improvement:**  
  El happy path tiene error bajo y rollback listo: si tu pred premia lo opuesto, el PASS real se convierte en ROLLBACK_RELEASE y el adverso de E2 “parece” sano.
- **Proposed retrospective:**  
  Umbral medible + ensayo de rollback ≤ RTO son el contrato dual. Siguiente: adverso con 8% error y 500 s de rollback.
- **Code/output changes:** none
- **Validation notes:** Solution correcta.

---

### S44-T3-B-E2 (weDo, independent)
- **Diagnosis:** Tres rutas con adverso migration False, error 0.08, rollback no tested, 500 s. Sin escena de incidente.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de canary y rollback
- **Proposed preamble:**  
  - **Contexto:** un canary de Piura al 8% de error con rollback no ensayado no se “hold”: se clasifica como release a revertir.  
  - **Meta:** assess PASS / ROLLBACK_RELEASE / MISSING:rto_seconds.  
  - **Éxito:** `PASS ROLLBACK_RELEASE MISSING:rto_seconds`.  
  - **Límites:** missing antes de rto_seconds; no inventes RTO; sintético.
- **Proposed instruction/description improvements:**  
  1. Starter: PASS con pred invertido (DEFECT).  
  2. Aplica contrato T3-B completo.  
  3. Conserva MISSING.  
  4. Imprime las tres salidas.
- **Proposed retrospective:**  
  Breach de canary/rollback ≠ falta de RTO (schema). El error clásico es ampliar tráfico sin RTO medible. Luego: PAUSE_CANARY.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S44-T3-B-E3 (weDo, transfer)
- **Diagnosis:** Fail-closed CONTINUE / ROLLBACK_RELEASE / PAUSE_CANARY. Starter missing→CONTINUE.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Fail-closed: pausar canary sin RTO
- **Proposed preamble:**  
  - **Contexto:** sin `rto_seconds` no sabes si el ensayo de rollback de Piura fue a tiempo: **pausas el canary**, no continúas el release.  
  - **Meta:** decide CONTINUE / ROLLBACK_RELEASE / PAUSE_CANARY.  
  - **Éxito:** `CONTINUE ROLLBACK_RELEASE PAUSE_CANARY`.  
  - **Límites:** missing ≠ CONTINUE; no inventes RTO; no ignores error alto.
- **Proposed instruction/description improvements:**  
  1. DEFECT: missing→CONTINUE; pred invertido.  
  2. missing → PAUSE_CANARY.  
  3. Completos: CONTINUE solo con contrato sano; si no → ROLLBACK_RELEASE.  
  4. Imprime en orden.
- **Proposed retrospective:**  
  PAUSE_* es incertidumbre operativa; ROLLBACK_* es incidente medible. Pregunta: ¿qué log mínimo demuestras en el portfolio de canary/rollback de CP-N4-B?
- **Code/output changes:** none
- **Validation notes:** Alineado a theory T3-B.

---

### S44-T4-A-DEMO (iDo)
- **Diagnosis:** Demo de reviews + notes operables (change/risk/migration/rollback). Falta preamble de “notas para el on-call a las 2 a.m.” y retrospective del misconception “release notes = marketing”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Las release notes de Piura no son marketing: son el mapa del on-call a las 02:00. En esta demo 2 reviews y el set {change, risk, migration, rollback} dejan el release listo. No escribas: predice `reviews 2`, `release_notes True` y `conventional True`. Observa por qué un set solo con `change` fallaría.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: branch protection + ≥1 review + checks + notes ⊇ cuádruple operativo; merge sin protección → BLOCK_UNREVIEWED_RELEASE. Puente a We Do: starter PASS sin protección o con reviews==0.
- **Proposed retrospective:**  
  Review humano + notes operables = primer control de supply chain antes del publish. El error clásico es un tag con un párrafo de “mejoras”. We Do: BLOCK y COMPLETE_RELEASE_NOTES.
- **Code/output changes:** none
- **Validation notes:** Output alineado a theory T4-A.

---

### S44-T4-A-E1 (weDo, guided)
- **Diagnosis:** DEFECT: PASS si not protected_branch o reviews==0. Instruction densa; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Branch protegida y notes operables
- **Proposed preamble:**  
  - **Contexto:** en CASO-PIU-044-4A main de Piura exige 2 reviews, checks de CI y notes con cambio, riesgo, migración y rollback.  
  - **Meta:** protected_branch + reviews ≥1 + required_checks + set de notes completo.  
  - **Éxito:** `S44-T4-A PASS`.  
  - **Límites:** no mutes el set de notes; no aceptes notes solo con `change`; DEFECT en el pred.
- **Proposed instruction/description improvements:**  
  1. Starter: PASS sin protección o reviews==0 (DEFECT).  
  2. Exige protected True, reviews ≥1, checks True, notes ⊇ {change, risk, migration, rollback}.  
  3. Conserva print.  
  4. `S44-T4-A PASS`.
- **Proposed feedback improvement:**  
  El happy path tiene branch protegida y notes completas: si tu pred premia lo opuesto, el PASS real se vuelve BLOCK_UNREVIEWED_RELEASE.
- **Proposed retrospective:**  
  Trazabilidad de release = protección + reviews + notes operables. Siguiente: adverso sin protección y notes solo con change.
- **Code/output changes:** none
- **Validation notes:** Solution correcta.

---

### S44-T4-A-E2 (weDo, independent)
- **Diagnosis:** Tres rutas con invalid notes incompletas. Sin escena de merge sin review.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de release trazable
- **Proposed preamble:**  
  - **Contexto:** merge directo a main sin protección o notes incompletas deja al on-call de Piura sin mapa.  
  - **Meta:** assess PASS / BLOCK_UNREVIEWED_RELEASE / MISSING:release_notes.  
  - **Éxito:** `PASS BLOCK_UNREVIEWED_RELEASE MISSING:release_notes`.  
  - **Límites:** missing antes de release_notes; no inventes el set; sintético.
- **Proposed instruction/description improvements:**  
  1. Starter: PASS con pred invertido (DEFECT).  
  2. Aplica contrato T4-A completo.  
  3. Conserva MISSING.  
  4. Imprime las tres salidas.
- **Proposed retrospective:**  
  Notes solo con `change` son breach de contenido, no “casi completas”. Luego: COMPLETE_RELEASE_NOTES en incertidumbre.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S44-T4-A-E3 (weDo, transfer)
- **Diagnosis:** Fail-closed CONTINUE / BLOCK_UNREVIEWED_RELEASE / COMPLETE_RELEASE_NOTES. Starter missing→CONTINUE.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Fail-closed: completar release notes
- **Proposed preamble:**  
  - **Contexto:** sin el mapa `release_notes` no se inventa un set: se exige **completar notes** antes de liberar.  
  - **Meta:** decide CONTINUE / BLOCK_UNREVIEWED_RELEASE / COMPLETE_RELEASE_NOTES.  
  - **Éxito:** `CONTINUE BLOCK_UNREVIEWED_RELEASE COMPLETE_RELEASE_NOTES`.  
  - **Límites:** missing ≠ CONTINUE; no rellenes notes; no merges sin protección.
- **Proposed instruction/description improvements:**  
  1. DEFECT: missing→CONTINUE; pred invertido.  
  2. missing → COMPLETE_RELEASE_NOTES.  
  3. Completos: CONTINUE solo con contrato T4-A; si no → BLOCK.  
  4. Imprime en orden.
- **Proposed retrospective:**  
  COMPLETE_* pide evidencia operativa; BLOCK_* cierra merge inseguro. Pregunta: ¿qué frase de rollback escribiste en las notes que el on-call pueda ejecutar a las 02:00?
- **Code/output changes:** none
- **Validation notes:** Alineado a theory T4-A.

---

### S44-T4-B-DEMO (iDo)
- **Diagnosis:** Demo de critical → block + evidencia (log, artifact) + audit trail. Falta preamble del continue-on-error silencioso y retrospective del misconception “amarillo que se ignora”.
- **Checklist:** context fail · goal partial · success partial · constraints fail · retrospective fail
- **Severity:** P1
- **Proposed title:** N/A (iDo)
- **Proposed preamble:**  
  Cuando un test crítico del servicio de jobs de Piura falla a las 02:10, el pipeline **bloquea** el release y retiene evidencia: no usa continue-on-error como aprobación silenciosa. En esta demo critical True → `on_fail block`, 2 piezas de evidencia y audit trail. No escribas: predice las tres líneas. Observa que warn no es el camino de un fallo crítico.
- **Proposed instruction/description improvements:**  
  Description OK. Ampliar `why`: critical + pipeline_blocked + logs_redacted + owner + evidence_retained; breach silencioso → STOP_SILENT_FAILURE; sin evidencia → ASSIGN_INCIDENT_OWNER. Puente a We Do: starter PASS si critical y **no** blocked.
- **Proposed retrospective:**  
  Fallo crítico = block + dueño + evidencia redactada. El error clásico es re-lanzar con continue-on-error. We Do: STOP_SILENT_FAILURE y ASSIGN_INCIDENT_OWNER.
- **Code/output changes:** none
- **Validation notes:** Output alineado a theory T4-B.

---

### S44-T4-B-E1 (weDo, guided)
- **Diagnosis:** DEFECT: PASS si critical y pipeline **no** blocked. Instruction densa; sin title/preamble/retrospective.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Fallo crítico bloquea con evidencia
- **Proposed preamble:**  
  - **Contexto:** en CASO-PIU-044-4B un test de integración crítico falla: el workflow marca block, retiene log+artifact, owner `release` y logs redactados.  
  - **Meta:** critical + blocked + redacted + owner truthy + evidence_retained.  
  - **Éxito:** `S44-T4-B PASS`.  
  - **Límites:** no mutes el fixture; no borres el trace; DEFECT en el pred.
- **Proposed instruction/description improvements:**  
  1. Starter: PASS si critical y not pipeline_blocked (DEFECT).  
  2. Exige AND de blocked, redacted, owner, evidence.  
  3. Conserva print.  
  4. `S44-T4-B PASS`.
- **Proposed feedback improvement:**  
  Un crítico sin bloqueo es el anti-patrón de aprobación silenciosa. Con el pred correcto el happy path (blocked + evidencia) es PASS; el adverso de E2 activa STOP_SILENT_FAILURE.
- **Proposed retrospective:**  
  Auditabilidad = dueño + logs redactados + artifact retenido. Siguiente: adverso sin bloqueo, sin redaction, owner vacío.
- **Code/output changes:** none
- **Validation notes:** Solution correcta.

---

### S44-T4-B-E2 (weDo, independent)
- **Diagnosis:** Tres rutas con invalid critical sin block, logs no redacted, owner vacío. Sin escena de incidente olvidado.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Tres rutas de fallo auditable
- **Proposed preamble:**  
  - **Contexto:** un fallo sin dueño ni evidencia en Piura es un incidente que se olvida hasta el siguiente outage.  
  - **Meta:** assess PASS / STOP_SILENT_FAILURE / MISSING:evidence_retained.  
  - **Éxito:** `PASS STOP_SILENT_FAILURE MISSING:evidence_retained`.  
  - **Límites:** missing antes de evidence_retained; no inventes owner; sintético.
- **Proposed instruction/description improvements:**  
  1. Starter: PASS con critical y not blocked (DEFECT).  
  2. Aplica contrato T4-B completo.  
  3. Conserva MISSING.  
  4. Imprime las tres salidas.
- **Proposed retrospective:**  
  Breach silencioso (sin bloqueo/redaction/owner) ≠ falta del flag de evidencia (schema). Luego: ASSIGN_INCIDENT_OWNER.
- **Code/output changes:** none
- **Validation notes:** Output canónico correcto.

---

### S44-T4-B-E3 (weDo, transfer)
- **Diagnosis:** Fail-closed CONTINUE / STOP_SILENT_FAILURE / ASSIGN_INCIDENT_OWNER. Starter missing→CONTINUE. Cierra la sección We Do hacia You Do / CP-N4-B.
- **Checklist:** context fail · goal pass · success pass · constraints partial · retrospective fail
- **Severity:** P0
- **Proposed title:** Fail-closed: asignar dueño del incidente
- **Proposed preamble:**  
  - **Contexto:** sin `evidence_retained` no se reintenta a ciegas: se **asigna dueño de incidente** y se retiene el rastro.  
  - **Meta:** decide CONTINUE / STOP_SILENT_FAILURE / ASSIGN_INCIDENT_OWNER.  
  - **Éxito:** `CONTINUE STOP_SILENT_FAILURE ASSIGN_INCIDENT_OWNER`.  
  - **Límites:** missing ≠ CONTINUE; no inventes evidencia; no continue-on-error.
- **Proposed instruction/description improvements:**  
  1. DEFECT: missing→CONTINUE; pred de crítico sin bloqueo.  
  2. missing → ASSIGN_INCIDENT_OWNER.  
  3. Completos: CONTINUE solo con contrato T4-B; si no → STOP_SILENT_FAILURE.  
  4. Imprime en orden.
- **Proposed retrospective:**  
  ASSIGN_* es incertidumbre de ownership; STOP_* cierra el silencioso. Pregunta de You Do: ¿qué owner y qué artifact retienes cuando el test crítico de tu portfolio falla?
- **Code/output changes:** none
- **Validation notes:** Transfer final alineado a theory T4-B y portfolio CP-N4-B.

---

### youDo (youDo)
- **Diagnosis:** Marco de proyecto **sólido**: context con entrada/salida/gate, objectives medibles, requirements (matriz, pin SHA, SBOM, canary, tres casos normal/breach/uncertain), starter con helpers y checklist BLOCKED→READY por diseño, portfolioNote de CP-N4-B y rúbrica. **Falta** `retrospective` de defensa post-build (invariante, sintético vs real, frase de impacto 30 s). El title del youDo es el de la sección (aceptable) pero no hay cierre metacognitivo.
- **Checklist:** context pass · goal pass · success partial (rúbrica sí; no self-check post) · constraints pass · retrospective fail
- **Severity:** P1
- **Proposed title:** (ya existe) CI/CD y seguridad de la cadena de suministro — mantener
- **Proposed preamble:** N/A como campo nuevo obligatorio; el `context` ya cumple rol de escena. Opcional: una línea al final de context que recuerde “empieza BLOCKED hasta enlazar archivos reales”.
- **Proposed instruction/description improvements:**  
  Ningún cambio estructural de requirements. En Fixer, añadir `retrospective` (abajo). Opcional P2: en portfolioNote, una pregunta de defensa oral (“muéstrame el digest testeado == promovido”).
- **Proposed retrospective:**  
  Antes de marcar listo: (1) ¿qué invariante demuestras (mismo digest, pin SHA de 40 hex, o canary ≤ umbral con rollback ≤ RTO)? (2) ¿qué harías distinto con registry y secretos reales vs. CASO-PIU-044 sintético (sin subir tokens)? (3) Escribe en el README una frase de impacto medible (antes: promote sin attestation / después: gate fail-closed + rollback ensayado) que puedas defender en 30 segundos ante un lead de ops en Piura.
- **Code/output changes:** none (starter ya inicia evidence en False a propósito)
- **Validation notes:** Alineado a jobRelevance y learningOutcomes; no tocar outputs del lab sintético del starter.

---

## Priority order

### P0 (We Do: title + preamble + instruction solo-tarea + retrospective; feedback más concreto)
1. **S44-T1-A-E1, E2, E3** — matriz CI; FAIL_CI_GATE / REVIEW_MATRIX  
2. **S44-T1-B-E1, E2, E3** — cache vs artifact; DISCARD / INSPECT_WORKFLOW_CONDITION  
3. **S44-T2-A-E1, E2, E3** — pin SHA + least privilege; REVOKE / SECURITY_APPROVAL  
4. **S44-T2-B-E1, E2, E3** — digests alineados; REJECT_ATTESTATION / REBUILD_PROVENANCE  
5. **S44-T3-A-E1, E2, E3** — mismo digest + aprobación; DENY / REQUEST_RELEASE_APPROVAL  
6. **S44-T3-B-E1, E2, E3** — canary/RTO; ROLLBACK_RELEASE / PAUSE_CANARY  
7. **S44-T4-A-E1, E2, E3** — branch + notes; BLOCK / COMPLETE_RELEASE_NOTES  
8. **S44-T4-B-E1, E2, E3** — fallo crítico + evidencia; STOP_SILENT_FAILURE / ASSIGN_INCIDENT_OWNER  

### P1 (I Do preamble + retrospective + why ampliado; You Do retrospective)
9. **S44-T1-A-DEMO … S44-T4-B-DEMO** (8 demos)  
10. **youDo** retrospective de defensa  

### P2 (polish)
11. Feedback We Do: sustituir la meta-frase genérica “explica qué campo cambió…” por 1–2 oraciones de razonamiento ancladas al caso Piura (propuestas en el ledger como *Proposed feedback improvement* donde aplica).  
12. Hints E1: ya son ricos; no expandir (riesgo de spoiler). Solo alinear lenguaje a preamble si el Fixer unifica tono.

---

## Residual risks

1. **Homogeneidad de plantilla de código E1/E2/E3:** el patrón assess/decide es intencional y pedagogicamente sano; el Fixer debe **diferenciar preambles** por dominio (matriz vs pin vs canary) y no clonar “CASO-PIU-044 + predicado” en 24 copias casi idénticas de prosa.  
2. **Audience Master vs true newbie:** S44 asume familiaridad con GHA/SLSA; preambles deben traducir jerga (attestation, RTO, least privilege) en una frase concreta sin diluir el rigor del gate.  
3. **Outputs canónicos:** no alterar strings de salida (`S44-T*-* PASS`, triples de assess/decide); el risk es que un Fixer “mejore” prints y rompa tests del playground.  
4. **You Do BLOCKED por diseño:** no “arreglar” el starter poniendo evidence True; el retrospective debe reforzar que READY = archivos reales enlazados.  
5. **id interno `multimodal`:** nombre histórico del archivo/id; no confunde al learner en UI (title correcto), pero el Fixer no debe renombrar el id en este round.  
6. **Feedback actual casi idéntico en las 24 unidades** (“explica qué campo…, por qué el adverso…, por qué faltar X exige Y”): es el mayor residual de *prosa débil* además de missing fields; prioritario en P2 tras P0.

---

## Fixer handoff notes

- Añadir campos schema: `preamble`, `retrospective` en iDo steps y weDo steps; `title` en weDo; `retrospective` en youDo.  
- Separar instruction: **solo pasos** (40–100 palabras); mover escena a preamble.  
- Preservar exact outputs y DEFECT comments en starters.  
- Español profesional peruano; CASO-PIU-044 sintético; sin PII ni secretos reales.  
- Fade: E1 nombra línea/DEFECT; E2 menos migas; E3 transfer fail-closed — ya está en código; reflejarlo en prose.  
- No generadores; reescritura manual unidad por unidad usando este ledger.

---

Section 44 exercise pedagogy review complete. Ready for the Fixer prompt.
