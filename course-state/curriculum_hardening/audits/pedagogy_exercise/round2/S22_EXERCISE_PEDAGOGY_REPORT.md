# S22 Exercise Pedagogy Report (Round 2)

## Section
- **title:** Email, identidad y aprobación humana
- **shortTitle:** Email y aprobación
- **id:** `rapidfuzz-entity` (archivo `s22-rapidfuzz-entity.ts`; contenido = MIME, scopes, drafts, destinatarios, HITL, idempotencia — **no** entity resolution probabilístico profundo)
- **index:** 22
- **source:** `src/lib/course/sections/s22-rapidfuzz-entity.ts` (re-leído **después** del fix Round-1)
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades)
- **subtemas:** T1-A MIME multiparte · T1-B templates/sanitización · T2-A OAuth/scopes · T2-B drafts/adaptadores · T3-A resolución/verificación · T3-B listas/CC-BCC/privacidad · T4-A cola de aprobación/SM · T4-B idempotencia/audit/reintento
- **hilo:** Caso 22 / inicio **CP-N2-C** (Canal C: notificación con aprobación humana; paquete S21 → `.eml`/draft sandbox → puente web S23)
- **Round 1 context:** `round1/S22_EXERCISE_PEDAGOGY_REPORT.md` (solo contraste; **no** rubber-stamp)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (roles de campo, longitudes, checklists preamble/retrospective, fade E1→E3, anti-aberration).
- Manually re-inspected **every** `iDo.steps[]`, `weDo.steps[]`, and `youDo` in the **current** source: title, preamble, instruction, feedback, retrospective, starter DEFECT, solution/output, why.
- Scored residual quality for a **true newbie** (what / why / success / what sticks) — field *presence* alone is not acceptance.
- Word counts measured only as gates (no generators of prose). Round-1 used only to avoid re-diagnosing the old “zero shell” crisis.
- **No** source edits in this round. Hand-crafted residual proposals only.

## Round-1 fix verification (schema shell)

| Expectation after R1 | Status in current source |
|----------------------|--------------------------|
| All iDo have `preamble` + `retrospective` | **Met** (8/8); `why` now ~43–65 words (floor OK) |
| All We Do have `title` + `preamble` + task-style `instruction` + `retrospective` | **Met** (24/24) |
| We Do `instruction` is ordered steps (not essay) | **Met** |
| You Do has `retrospective` of defense | **Met** (~83w; strong) |
| E1→E2→E3 fade preserved (surfaces, not number clones) | **Met** |
| Starters, solutions, canonical outputs intact | **Met** (no execute-and-diff needed) |
| R1 P2: T2-A-E3 bridge token/draft; T3-A-E3 feedback links self-check 0.92 | **Met** |
| Spanish PE; synthetic `@example.pe`; no real PII | **Met** |

**Verdict:** Round-1 closed the systemic P0 “missing pedagogy shell.” Round-2 finds **no missing-field crisis**. Residual work is **quality**: section-wide short retrospectives (under the 40–80 floor), feedback↔retrospective echo on several pairs, thin feedback on 1–2 drills, soft E3 hint spoiling, and iDo retros that often stop at “error clásico + lista We Do” without a sticky self-check.

---

## Global residual findings

| Residual gap | Evidence | Impact | Severity |
|--------------|----------|--------|----------|
| **We Do retrospectives short** | **23/24** under 40w (measured ≈23–39); only T1-A-E3 (42) and T3-B-E3 (41) clear the floor | Metacognition thin; learner closes tab without sticky self-test | **P1** (section theme: expand worst ~12; not every unit needs a novel essay) |
| **I Do retrospectives short** | **7/8** under 40w (T1-B 37 … T4-B 26); only T1-A-DEMO (50) is comfortable | Demo → We Do bridge exists, but “misconception repaired” is often one clause + task list | **P2** (expand the thinnest 4: T4-B, T4-A, T3-A, T3-B) |
| **Feedback ≈ retrospective** | Worst pairs (Jaccard ≥0.45 on content words ≥5): **T4-A-E1** (0.65), **T3-B-E2** (0.56), **T1-B-E2** (0.50), **T2-A-E3** (0.45), **T3-B-E1** (0.43) | Deliberate-practice loop collapses; retro loses distinct job | **P1** on worst pairs / **P2** elsewhere |
| **E3 transfer hint spoiling** | T2-B-E3 and T4-B-E3 hints give near-complete algorithms (`f"d{len…}"`, full if/else retry_hit); T4-A-E3 hint 2 dumps dict shape | Transfer becomes “type the hint” not judgment | **P1** (T2-B-E3, T4-B-E3); **P2** (T4-A-E3) |
| **Feedback under 25w** | T1-B-E3 ≈22; T2-B-E2 ≈24 | Corrective loop thin | **P2** |
| **I Do preambles under 80w** | 7/8 at 58–67w (T1-A 79 borderline); still answer what-to-watch | Mild cognitive-load risk; not blocking | **P2** optional |
| **You Do** | context + objectives + requirements + rubric + starter + retrospective of defense **strong** | No P0/P1 residual | — |
| **Code/outputs** | Coherent with theory and CP-N2-C gates | Do **not** change pass outputs | — |

**Section severity theme (Round 2):** solid shell; residual is **length + role separation + soft spoiling**, not redesign. A true newbie *can* answer what/why/success from preambles; the gap is **what sticks after the tab closes** and **not being spoon-fed on transfer**.

### Scoring key
| Score | Meaning |
|-------|---------|
| **A** | Newbie answers what / why / success / what sticks; no required residual |
| **B** | Usable; residual polish (length, eco, soft spoiler) |
| **C** | Partial; R2 Fixer should tighten (integrity or metacognition) |
| **D** | Fails true-newbie on a critical item |

Checklist: **context · goal · success · constraints · retrospective** → pass / partial / fail.

When **Proposed residual: none required**, Fixer may leave the unit unchanged.

---

## Unit ledger

### S22-T1-A-DEMO (iDo) — **A**
- **Scores:** preamble **Strong** (~79w) · why **Strong** (~65w) · retrospective **Strong** (~50w)
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective pass
- **Diagnosis:** R1 prose landed. Tree MIME, no-secrets, “no escribas aún”, misconception HTML suelto, bridge to We Do — model unit.
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S22-T1-A-E1 (weDo, guided) — **B**
- **Scores:** title Strong · preamble Strong (4 bullets) · instruction Strong · feedback Strong (~30w) · retrospective **short** (~29w)
- **Checklist:** all pass structure; retro partial (under floor, no self-check)
- **Diagnosis:** Named defect (html + ascii) excellent. Feedback already separates type vs mojibake. Retro stops at bridge to E2.
- **Severity residual:** P1 (retro length)
- **Proposed retrospective (replace):**  
  El cuerpo plain con UTF-8 es la base del árbol multiparte que la mesa audita en el `.eml`. “Solo HTML” o un charset inventado en el print miente al revisor. Pregunta: si el cuerpo tiene acentos peruanos, ¿qué falla primero — el subtype o el charset? Siguiente (E2): adjunto con `Content-Disposition` y filename legible.
- **Code/output changes:** none

### S22-T1-A-E2 (weDo, independent) — **B**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong · retrospective **borderline** (~35w)
- **Checklist:** all pass; retro light self-check missing
- **Diagnosis:** Independent fade correct (Name ≠ Disposition). Feedback already mesa-facing. Retro needs one sticky question.
- **Severity residual:** P2 (optional expand retro)
- **Proposed residual retrospective (optional):**  
  Los clientes leen el filename en la disposición; el `Name` del Content-Type no es el contrato de entrega. Confundir ambos deja adjuntos “sin nombre” en la mesa. Pregunta: si el revisor solo ve `application/octet-stream`, ¿qué header mirarías primero? Luego (E3) anidas `alternative` y cuentas los `Content-Type`.
- **Code/output changes:** none

### S22-T1-A-E3 (weDo, transfer) — **A−**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong · retrospective **Adequate** (~42w, has self-check)
- **Diagnosis:** Authentic transfer. Retro already asks about meta adjunto for You Do. Hints near-complete but acceptable if E1/E2 done.
- **Severity residual:** P2 optional (soften second hint to “dos MIMEText dentro de alt; alt al mixed”)
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S22-T1-B-DEMO (iDo) — **B**
- **Scores:** preamble Strong (~64w, slightly under 80) · why Strong · retrospective **short** (~37w)
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective partial
- **Diagnosis:** Bypass `example.pe.evil.test` is crystal clear. Retro is principle + error + We Do list without self-check.
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Host real + escape es el hábito anti-XSS del canal de correo. El error clásico es confiar en substring del dominio. Pregunta: sin mirar el código, ¿por qué `example.pe.evil.test` engaña a un `in` y no a igualdad de host? We Do: escapar script, saludar con nombre seguro y clasificar URLs con `urlparse`.
- **Code/output changes:** none

### S22-T1-B-E1 (weDo, guided) — **B**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong · retrospective **short** (~29w)
- **Diagnosis:** Minimal guided escape drill. Feedback already names XSS. Retro needs self-check.
- **Severity residual:** P1 (retro)
- **Proposed retrospective (replace):**  
  `html.escape` es el primer control obligatorio del template: sin él, un fragmento de OCR o directorio se vuelve markup activo. El error clásico es confiar en el string “porque viene del sistema”. Pregunta: ¿escape sustituye a un sanitizador de producción, o solo es el primer gate? Siguiente (E2): interpolar el nombre solo después de escapar.
- **Code/output changes:** none

### S22-T1-B-E2 (weDo, independent) — **C**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong · retrospective short + **echo** with feedback (J≈0.50: escapa/saluda/orden/hábito)
- **Checklist:** structure pass; retro/feedback role separation **fail**
- **Diagnosis:** Skill correct. Feedback and retro both preach “escapa primero, saluda después” — deliberate-practice loop collapses.
- **Severity residual:** P1 (desacoplar retro del feedback)
- **Proposed feedback (keep or minor polish):** keep current (orden del hábito / OCR).
- **Proposed retrospective (replace — distinct job):**  
  Un nombre “del directorio” no es confiable: el hábito es tratar todo campo de negocio como no confiable hasta escaparlo. El error clásico es un f-string con HTML crudo “porque se ve bien en la consola”. Pregunta: si el template del motor ya autoescape, ¿qué riesgo introduce un segundo `html.escape`? Luego (E3) clasificas URLs con host real, no con substring.
- **Code/output changes:** none

### S22-T1-B-E3 (weDo, transfer) — **B**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback **thin** (~22w) · retrospective short (~31w, has self-check)
- **Diagnosis:** Transfer ethics/tech strong. Feedback under floor; retro already has the right self-check question (reuse/expand).
- **Severity residual:** P2 (feedback floor) + P2 (retro expand slightly)
- **Proposed feedback (replace):**  
  Parsea el host real (`urlparse.hostname`). Un substring `'example.pe' in url` aceptaría `example.pe.evil.test` — el curso lo trata como bypass de phishing interno, no como solución de allowlist.
- **Proposed residual:** none further required if feedback expanded; retro OK with existing self-check
- **Code/output changes:** none

---

### S22-T2-A-DEMO (iDo) — **B**
- **Scores:** preamble Strong · why Strong · retrospective **short** (~35w)
- **Diagnosis:** Least privilege demo clear. Retro needs sticky question on token blast radius.
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Granted debe ser la intersección con lo permitido, no la lista soñada. El error clásico es pedir `mail.full` “para no fallar después”. Pregunta: si el token se filtra, ¿qué daño extra abre `mail.send` frente a solo `mail.draft`? We Do: filtrar a allowed, `isdisjoint` con peligrosos y clasificar por `expires_at`.
- **Code/output changes:** none

### S22-T2-A-E1 (weDo, guided) — **B**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong · retrospective short (~30w)
- **Severity residual:** P1 (retro)
- **Proposed retrospective (replace):**  
  Least privilege se demuestra con la intersección impresa, no con un comentario en el README. El error clásico es devolver `requested` completo “porque el proveedor ya filtrará”. Pregunta: ¿quién debe aplicar el filtro — el adaptador, la política de app, o ambos? Siguiente (E2): comprobar que granted no toca scopes peligrosos.
- **Code/output changes:** none

### S22-T2-A-E2 (weDo, independent) — **B**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong · retrospective short (~29w)
- **Diagnosis:** Inverted `isdisjoint` is excellent E2. Mild feedback/retro thematic overlap (both about False seguro) but not clone-level.
- **Severity residual:** P2 (retro expand + light desacoplar)
- **Proposed retrospective (replace):**  
  `isdisjoint True` es evidencia de least privilege en el paquete de auditoría. Invertir con `not` da un falso “seguro” cuando hay solape con `mail.full`/`admin`. Pregunta: si granted incluye `mail.send` y el producto es draft-only, ¿qué imprime el gate y qué haces en la mesa? Luego (E3) clasificas credenciales por `expires_at` vs now.
- **Code/output changes:** none

### S22-T2-A-E3 (weDo, transfer) — **B− / C**
- **Scores:** title Strong · preamble Strong (token/draft bridge **present**) · instruction Strong · feedback Strong · retrospective short + **echo** (J≈0.45: caducado/revés/refresh/valid)
- **Diagnosis:** Transfer surface good; feedback and retro both lead with “comparar al revés”. Role separation needed.
- **Severity residual:** P1 (desacoplar)
- **Proposed feedback (keep spine):** keep clock gate wording.
- **Proposed retrospective (replace):**  
  El reloj es un gate de producto: caducado = refresh (o regenerar draft), no “valid por existir en el store”. Pregunta de cierre: ¿por qué un draft caducado no se promueve aunque el token OAuth siga vivo? Eso enlaza T2-A con el adaptador de T2-B.
- **Code/output changes:** none

---

### S22-T2-B-DEMO (iDo) — **B**
- **Scores:** preamble Strong · why Strong · retrospective short (~37w)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Draft usable = status `draft` y `now < expires_at`. El error clásico es reutilizar un id caducado “porque ya está en el store”. Pregunta: si las cifras de S21 cambiaron, ¿qué debe regenerarse antes de un nuevo `pending_review`? We Do: status vs key, usable y mini adaptador con ids secuenciales.
- **Code/output changes:** none

### S22-T2-B-E1 (weDo, guided) — **C**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong · retrospective **very short** (~23w, thinnest We Do)
- **Diagnosis:** Conceptual defect (key vs status) is excellent. Feedback already carries the HITL lesson; retro is a two-sentence restatement.
- **Severity residual:** P1
- **Proposed retrospective (replace):**  
  El id identifica el registro en el store; el status mueve la máquina de estados que lee la cola humana. Confundirlos rompe el HITL: la UI creería “todo draft” o imprimiría keys en el audit. Pregunta: si ves `d001` en consola, ¿sabes si está en `pending_review`? Siguiente (E2): decidir usable con `now < expires_at`.
- **Code/output changes:** none

### S22-T2-B-E2 (weDo, independent) — **B**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback thin (~24w) · retrospective short (~31w)
- **Severity residual:** P2 (feedback floor + retro)
- **Proposed feedback (replace):**  
  Usable solo si `now < expires_at`. Un draft caducado no se promueve: regeneras el mensaje y vuelves a la cola humana con cifras frescas del informe de S21 — no “aprovechas” el id viejo.
- **Proposed residual retrospective (optional):**  
  Usable es una pregunta de reloj y de status, no de existencia del id. El error clásico es invertir la comparación y “validar” lo caducado. Pregunta: ¿qué imprime el gate si `expires_at` está 1 s en el pasado? Luego (E3) implementas create con ids secuenciales y expires_at.
- **Code/output changes:** none

### S22-T2-B-E3 (weDo, transfer) — **C**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong · retrospective borderline · **hints spoil** transfer
- **Diagnosis:** Mini-adapter transfer is authentic. Hints give `f"d{len(store)+1:03d}"` and full usable formula — E3 becomes type-the-hint.
- **Severity residual:** P1 (soften hints)
- **Proposed residual hints (replace array):**  
  1. `"id secuencial a partir de len(store); no reutilices un literal fijo"`  
  2. `"guarda expires_at; usable combina reloj y status draft"`  
  (Leave the exact f-string and comparison to the learner after E1/E2.)
- **Proposed residual retrospective (optional expand):** keep self-check “¿quién llama is_usable?”; OK as-is if hints fixed
- **Code/output changes:** none

---

### S22-T3-A-DEMO (iDo) — **B**
- **Scores:** preamble Strong · why Strong · retrospective **short** (~32w)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Solo contactos verificados entran al `To`. El error clásico es tratar un match alto como prueba de identidad o fraude. Pregunta: sin `verified`, ¿el pipeline encola `pending_review` o hace fail-closed? We Do: formato, dominio allowlisted y score con nota `match_no_es_fraude`.
- **Code/output changes:** none

### S22-T3-A-E1 (weDo, guided) — **B**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong · retrospective short (~30w)
- **Severity residual:** P1 (retro)
- **Proposed retrospective (replace):**  
  Formato básico es el primer filtro, no la verificación completa ni DNS real. El error clásico es hardcodear `True` “porque el fixture se ve bien”. Pregunta: ¿`bad` falla por dominio o por forma? Siguiente (E2): resolver id y chequear dominio allowlisted.
- **Code/output changes:** none

### S22-T3-A-E2 (weDo, independent) — **B**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong · retrospective short (~32w)
- **Severity residual:** P2
- **Proposed residual retrospective (optional):**  
  Resolve + dominio allowlisted es el contrato de entrega del lab. El error clásico es “si está en el directorio, ya está”. Pregunta: si `C001` existiera con dominio externo, ¿qué estado imprimirías? Luego (E3) un score de similitud con nota ética obligatoria.
- **Code/output changes:** none

### S22-T3-A-E3 (weDo, transfer) — **A− / B+**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong (0.92 link **present**) · retrospective short but has ethical self-check (~33w)
- **Diagnosis:** **Unidad ética crítica** still intact (`fraude_probable` defect). Expand retro slightly without diluting the anti-pattern.
- **Severity residual:** P2 (retro to floor)
- **Proposed retrospective (replace):**  
  Matching alimenta prioridad de entrega, no investigación de fraude. El error clásico es automatizar un claim con un umbral. Pregunta de cierre: ¿qué gate humano sigue siendo obligatorio aunque el score sea 0.99? (HITL + verified + draft-only.) Mantén la etiqueta `match_no_es_fraude` en el print canónico.
- **Code/output changes:** none — **do not** change output `0.86 match_no_es_fraude`

---

### S22-T3-B-DEMO (iDo) — **B**
- **Scores:** preamble Strong · why Strong · retrospective short (~32w)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Higiene de listas = dedupe + BCC a externos + contar visibles. El error clásico es CC “por comodidad” cuando hay partners. Pregunta: BCC oculta la lista a los demás — ¿cifra el cuerpo? We Do: orden estable, forzar BCC y conteo de visibles tras la política.
- **Code/output changes:** none

### S22-T3-B-E1 (weDo, guided) — **C**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong · retrospective **short** (~24w) + **echo** (J≈0.43: dict.fromkeys / primera aparición)
- **Diagnosis:** Feedback and retro both sell `dict.fromkeys` vs `set` — collapse.
- **Severity residual:** P1
- **Proposed feedback (keep):** keep order/contract wording.
- **Proposed retrospective (replace):**  
  En To/CC el orden de primera aparición es parte del contrato de higiene de la mesa, no un detalle cosmético. El error clásico es “un set ya quita duplicados” y perder quién era el primer `to`. Pregunta: si el fixture es a, b, a, ¿qué lista defiendes en el audit? Siguiente (E2): forzar BCC a un externo que vino en CC.
- **Code/output changes:** none

### S22-T3-B-E2 (weDo, independent) — **C**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback ≈ retrospective (**J≈0.56** worst after T4-A-E1)
- **Diagnosis:** Almost the same two sentences in both fields. Must desacoplar.
- **Severity residual:** P1
- **Proposed feedback (keep spine):** keep “exponen lista / BCC no es cifrado”.
- **Proposed retrospective (replace):**  
  Detectar el dominio externo sin mutar el role deja el partner en CC: el bug del starter. Mínima divulgación operativa es cambiar el role (o enviar individual), no solo “saber” que es externo. Pregunta: si imprimes el role y sigue `cc`, ¿el test de privacidad pasó? Luego (E3) mueves externos y cuentas solo visibles to+cc.
- **Code/output changes:** none

### S22-T3-B-E3 (weDo, transfer) — **B**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong · retrospective Adequate (~41w, self-check) · mild echo with feedback
- **Diagnosis:** Transfer authentic. Mild thematic echo on “hallazgo de privacidad”; acceptable if other pairs fixed first.
- **Severity residual:** P2 optional
- **Proposed residual:** none required
- **Code/output changes:** none

---

### S22-T4-A-DEMO (iDo) — **B**
- **Scores:** preamble Strong · why Strong · retrospective short (~31w)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  El estado es la verdad; el botón no envía sin la máquina. El error clásico es hardcodear `approved` o el atajo `pending`. Pregunta: ¿quién aparece como actor en el último evento del trail de la demo? We Do: transición submit, fail-closed invalid y apply con actor en el log.
- **Code/output changes:** none

### S22-T4-A-E1 (weDo, guided) — **C**
- **Scores:** title Strong · preamble **thin** (~39w) · instruction Strong · feedback ≈ retrospective (**J≈0.65** worst pair in section)
- **Diagnosis:** Anti-pattern starter excellent. Feedback and retro nearly clone “submit es la única puerta… Saltar a approved…”.
- **Severity residual:** P1 (desacoplar + expand retro)
- **Proposed feedback (keep):** keep anti-patrón mesa wording.
- **Proposed retrospective (replace):**  
  La tabla `TRANSITIONS` es la única fuente de verdad: `submit` mueve `draft` → `pending_review`. Asignar `approved` a mano borra el rastro y salta el HITL. Pregunta: si el starter “pasa” con un string hardcodeado, ¿qué falla en el audit del portfolio? Siguiente (E2): approve desde draft debe ser `invalid`.
- **Code/output changes:** none

### S22-T4-A-E2 (weDo, independent) — **B**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong · retrospective short (~31w)
- **Severity residual:** P2
- **Proposed residual retrospective (optional):**  
  Falta de transición = `invalid`, no éxito silencioso. El error clásico es un else amable que miente al audit. Pregunta: ¿agregarías `approve` a `draft` “para que el test pase”, o dejas el fail-closed? Luego (E3) implementas `apply` con actor y filtras el evento de approve.
- **Code/output changes:** none

### S22-T4-A-E3 (weDo, transfer) — **B**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong · retrospective short with self-check · hint 2 near-complete
- **Diagnosis:** Strong transfer. Hint 2 dumps full append/filter shape — soft spoil.
- **Severity residual:** P2 (soften hint 2)
- **Proposed residual hints:**  
  1. keep TRANSITIONS / needs_edit reminder  
  2. `"resuelve nxt con la tabla; append from/to/action/actor; filtra el approve al imprimir"`  
  (Avoid pasting the list comprehension verbatim.)
- **Proposed residual:** none further if hint softened
- **Code/output changes:** none

---

### S22-T4-B-DEMO (iDo) — **B−**
- **Scores:** preamble Strong · why Strong · retrospective **shortest iDo** (~26w)
- **Diagnosis:** Demo clear. Retro is two sentences without self-check.
- **Severity residual:** P2 (priority among iDo thins)
- **Proposed retrospective (replace):**  
  Misma key → mismo draft_id. El error clásico es “crear siempre” por miedo a un KeyError y spamear al destinatario sintético. Pregunta: si el segundo `once` devolviera `draft-002`, ¿qué gate de CP-N2-C se rompió? We Do: construir la key de 16 hex, create idempotente y audit create/retry_hit.
- **Code/output changes:** none

### S22-T4-B-E1 (weDo, guided) — **B**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong · retrospective short (~32w)
- **Diagnosis:** Dual defect (`-` and `[:6]`) excellent; output hash fragile — do not touch fixture.
- **Severity residual:** P1 (retro)
- **Proposed retrospective (replace):**  
  16 hex es el contrato único de S22 (teoría, ejercicios y You Do). El error clásico es acortar la key “para que se lea mejor” o cambiar el separador. Pregunta: si usas `-` en vez de `|`, ¿puedes reutilizar el hash del contrato? Siguiente (E2): create que reutiliza el id cuando la key ya existe.
- **Code/output changes:** none — **do not** change output `0da400d6c9b3f756` or fixture `run|to|v1`

### S22-T4-B-E2 (weDo, independent) — **B**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong · retrospective short (~26w)
- **Severity residual:** P1 (retro)
- **Proposed retrospective (replace):**  
  Misma key → mismo draft_id y un solo registro en el store. El error clásico es “siempre factory()” y pisar el mapa. Pregunta: tras dos `create('k')`, ¿cuántos ids distintos y qué `len(store)` defiendes? Luego (E3) el reintento se registra como `retry_hit` en el audit.
- **Code/output changes:** none

### S22-T4-B-E3 (weDo, transfer) — **C**
- **Scores:** title Strong · preamble Strong · instruction Strong · feedback Strong · retrospective borderline (~39w, self-check) · **hints spoil** full algorithm
- **Diagnosis:** Perfect close of CP-N2-C thread. Hints literally give if-key-in-store → retry_hit else create — transfer collapse.
- **Severity residual:** P1 (hints)
- **Proposed residual hints (replace array):**  
  1. `"reintento: no inventes un segundo draft; registra el evento correcto en audit"`  
  2. `"primera vez create; segunda vez reutiliza id y marca el hit — sin borrar el log"`  
- **Proposed residual retrospective:** keep body_ver self-check; OK if hints fixed
- **Code/output changes:** none

---

### youDo — Borrador .eml con aprobación (inicio CP-N2-C) — **A**
- **Scores:** context **Strong** · objectives/requirements/rubric **Strong** · starter semi-guided **Strong** · retrospective of defense **Strong** (~83w)
- **Checklist:** context pass · goal pass · success pass · constraints pass · retrospective pass
- **Diagnosis:** R1 retrospective landed: three defense questions, impact phrase, S23 bridge, fail-closed. Prints de aceptación explícitos. No residual required.
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none
- **Validation notes:** Do **not** empty starter helpers (`domain_ok`, `idem_key`, `TRANSITIONS`); learner fills MIME HTML, attachment, store raw, and `submit`.

---

## Priority order (Round-2 Fixer)

### P1 — do first (metacognition + role separation + transfer integrity)
1. **Expand We Do retrospectives** under floor — priority worst first:  
   **T2-B-E1** (23w), **T3-B-E1** (24w), **T4-B-E2** (26w), **T1-A-E1**, **T1-B-E1**, **T2-A-E1**, **T2-A-E2**, **T3-A-E1**, **T4-A-E1**, **T4-B-E1** (and any other still &lt;40w after the desacoples below).
2. **Desacoplar feedback↔retrospective** on echo pairs:  
   **T4-A-E1** (J 0.65) → **T3-B-E2** (0.56) → **T1-B-E2** (0.50) → **T2-A-E3** (0.45) → **T3-B-E1** (0.43).
3. **Soften E3 transfer hints:** **T2-B-E3**, **T4-B-E3** (and optionally **T4-A-E3**).

### P2 — polish
4. Expand thinnest **iDo** retrospectives: **T4-B-DEMO**, **T4-A-DEMO**, **T3-A-DEMO**, **T3-B-DEMO** (then T1-B / T2-A / T2-B if time).
5. Feedback floor: **T1-B-E3**, **T2-B-E2**.
6. Optional: lift iDo preambles toward 80w where still 58–67w (not blocking if what-to-watch is clear).
7. Optional expand remaining We Do retros with one self-check each (pattern already in E3s).

### Do not
- Change canonical solution **outputs** (esp. T4-B-E1 hash, T3-A-E3 `0.86 match_no_es_fraude`).
- “Fix” filename/id `rapidfuzz-entity` toward entity resolution in this round.
- Empty You Do starter or dilute gates (draft-only, verified, key 16, pending_review, no SMTP).
- Use generators or bulk paste of the same retrospective skeleton.

---

## Residual risks

- **Ética de matching:** T3-A-E3 still carries `fraude_probable` defect — protect label and note when expanding retro.
- **Key 16 hex:** T4-B-E1 fixture is hash-fragile; prose-only fixes.
- **Hint over-softening:** E1 guided may keep near-spoiling; only E3 needs fade of breadcrumbs.
- **Length bloat:** Expand to ~40–60w retros, not essays; keep instruction task-only.
- **Echo while expanding:** when lengthening retros, rewrite from principle/self-check, do not paste feedback.

---

## Fixer acceptance hints (Round 2)

- [ ] No new missing-field regressions (title/preamble/instruction/retrospective still present everywhere)
- [ ] Worst P1 retros ≥ ~40 words with principle + misconception + transfer/self-check
- [ ] Echo pairs rewritten so feedback = immediate corrective; retro = metacognitive close
- [ ] T2-B-E3 / T4-B-E3 hints no longer dump full algorithms
- [ ] Outputs and starters intact; Spanish PE; no real PII
- [ ] No generators; hand-written residual prose only

---

Section 22 exercise pedagogy review complete. Ready for the Fixer prompt.
