# S23 Exercise Pedagogy Report (Round 2)

## Section
- **title:** Browser RPA con Playwright
- **shortTitle:** Playwright RPA
- **id:** `computer-vision` (archivo `s23-computer-vision.ts`; contenido = browser RPA / mental model Playwright, **no** visión por computador clásica)
- **index:** 23
- **source:** `src/lib/course/sections/s23-computer-vision.ts`
- **live:** https://pillb.github.io/pyarcana/
- **counts:** iDo **8**, weDo **24** (8 subtemas × E1/E2/E3), youDo **1** (total **33** unidades)
- **subtemas:** T1-A locators · T1-B auto-wait/assertions · T2-A forms/download/sesión · T2-B Page Objects/auth · T3-A trace/evidencia · T3-B retries/recovery/checkpoint · T4-A API-first · T4-B CAPTCHA/ToS/handoff
- **hilo:** CASO-LIM-023 / incremento **CP-N2-C** (adaptador web tras S22; puente OCR S24 sobre binario verificado)
- **Round 1 context:** `round1/S23_EXERCISE_PEDAGOGY_REPORT.md` (solo contraste; **no** rubber-stamp)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` (preamble/retrospective checklists, E1→E3 fade, length targets, anti-aberration).
- Manually re-inspected **current** source for every `iDo.steps[]` (8), `weDo.steps[]` (24) y `youDo` (title, preamble, instruction, feedback, retrospective, starter DEFECT, solution output, why).
- Verified integrity traps live (starter ≠ solution stdout) for representative units: T1-A-E1 (`None` vs `n1`), T1-B-E1 (`3` vs `2`), T1-B-E2 (`ok` vs `timeout`), T2-A-E2 (md5 `8d777f38` vs sha256 `3a6eb079`), T3-A-E1 (values vs keys), T4-A-E1 (`rpa` vs `api`), T4-B-E2 (`human_handoff` vs `abort`).
- Scored for a **true newbie** (qué / por qué / éxito / qué queda), independent of Round-1 proposals.
- Word counts measured only as gates (no bulk prose generation).
- No generators, bulk templates, or source edits.

## Global findings (post Round-1 fix)

| Area | Status | Residual impact |
|------|--------|-----------------|
| **Field coverage** | Complete: 8 iDo con `preamble`+`why`+`retrospective`; 24 weDo con `title`+`preamble`+`instruction`+`feedback`+`retrospective`; youDo con `retrospective` + marco sólido | Round-1 P0 “cero campos” **cerrado** |
| **We Do titles** | Presentes, 3–7 palabras, español PE, alineados al skill | Pass (T4-B-E1 con 3 palabras: leve bajo el piso 4) |
| **Preamble shape** | weDo en bullets contexto/meta/éxito/límites; iDo narrativos con predicción + “no escribas” | Pass en estructura; bullets a menudo &lt;80 w (aceptable por spec “4 short bullets”); iDo narrativos ~59–80 w |
| **Instruction = steps** | Solo-tarea, ordenados; E1 nombra DEFECT; E2/E3 menos migas | Pass — muchas ~20–39 w (bajo piso 40; legibles; no bloquear) |
| **E1→E2→E3 fade** | Superficies distintas por subtema (role+name → order → need_testid; ready i → timeout → assert combinado; form → hash → session_mode; PO auth → denied → estados; keys → ERR → trace en falla; should_retry → recover stale → next_step; api→export→method/reason; captcha→ToS abort→payload) | Pass — **no** clones numéricos |
| **Feedback vs retrospective** | Feedback suele razonar el bug; en **~6–8** unidades el retro **eco** del feedback (misconception duplicado, sin metacognición extra) | Residual **P2** sistemático |
| **Retrospective length** | Mediana weDo ≈26–39 w (spec 40–80); principio + puente suelen estar; a menudo falta self-check o misconception *distinto* del feedback | Residual **P2** |
| **iDo why** | Todos en rango 40–90 (~62–78 w) | Pass |
| **iDo preamble/retro** | Completos; T3-B retro ~38 w (leve bajo 40); varios preambles narrativos 59–69 w | Residual **P2** leve (expandir solo si se toca la unidad) |
| **Código/outputs** | Coherentes con theory y hilo sintético; DEFECT `# Arregla:` excelente; **wrong ≠ right** en traps verificados | **Sin** hueco de integridad tipo wrong≈right |
| **youDo frame** | context CP-N2-C, objectives, requirements éticos, starter casi completo (hueco intencional `LoginPage.submit`), rubric 6 criterios, portfolioNote, retrospective de defensa | Pass |
| **Hints E3** | Algunos casi spoilean (p. ej. T3-B-E3 “si login, siguiente es form”); aceptable como andamiaje mínimo | Residual **P2** opcional |

**Net:** Round 1 cerró el vacío sistemático de prosa verbal. Round 2 **no** es rubber-stamp: la sección está **lista para learner** en la gran mayoría de unidades. Residuales son **calidad** (eco feedback/retro, retros cortas sin self-check, feedback &lt;25 w en ~10 unidades). **No** hay defectos de integridad wrong≈right. Prioridad del Fixer R2 = **P2 polish**, no reescritura estructural.

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

### S23-T1-A-DEMO (iDo) — **A**
- **Diagnosis:** Worked example sólido: DOM con Enviar/Cancelar; `by_role` por role+name; flags `locators role_first`. Preamble pide predicción sobre `nth-child` y ancla lab sin Chromium. `why` (~78 w) en rango: ARIA, LookupError ruidoso, puente We Do. Retro repara “primer button” y apunta a E1–E3.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none required
- **Code/output changes:** none

### S23-T1-A-E1 (weDo, guided) — **A**
- **Diagnosis:** Modelo We Do post-fix: title claro; bullets con éxito `n1`; instruction nombra bug `role=='button'`; feedback razona setup roto vs clic al logo; retro distinta (contrato role+name + CSS DevTools) y puente E2. Starter imprime `None` → solution `n1` (discrimina).
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: retro ~36 w → +self-check “¿qué falla si el name es ‘inicio’ en minúsculas?”)
- **Proposed residual:** none required
- **Code/output changes:** none

### S23-T1-A-E2 (weDo, independent) — **A−**
- **Diagnosis:** `sorted(strats)` alfabético vs política role/testid/css — defecto excelente. Preamble ancla UI del portal. Feedback y retro se solapan en “política ≠ alfabético”, pero retro añade “accesible primero / CSS último” y puente E3.
- **Checklist:** all pass; retro partial (eco leve)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  El orden de intento es un contrato de producto, no un sort de strings: role para estabilidad y a11y, testid cuando el equipo lo expone, CSS solo si no hay mejor semántica. Si confundes `sorted` con prioridad, el robot se casa con el layout. Pregunta: ¿pedirías `data-testid` al frontend antes de un XPath? Luego (E3) fallas cerrado sin control usable.
- **Code/output changes:** none

### S23-T1-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Transfer real: logo `img` → `need_testid`. Éxito exacto; límites anti-`nodes[0]`; feedback y retro distintos (señal a frontend vs fail-closed + self-check). Fade auténtico desde E1/E2.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S23-T1-B-DEMO (iDo) — **A−**
- **Diagnosis:** Auto-wait al intento 3; preamble motiva condición vs sleep 5 s; `why` en rango; retro repara “última i del for” y misconception “más sleep = más estable”. Preamble ~65 w (leve bajo 80 narrativo).
- **Checklist:** all pass; preamble partial (longitud)
- **Severity residual:** P2
- **Proposed preamble (expand ~+15 w):**  
  El portal demo a veces tarda en habilitar el botón de export. En esta demo un reloj simulado solo está listo en el intento 3: el robot espera una **condición**, no un `sleep` fijo. No escribas: predice qué valor de `visible` sale y por qué un sleep de 5 s fallaría en CI lento y desperdiciaría tiempo en CI rápido. Datos sintéticos, sin browser real; en local Playwright auto-espera usabilidad del control.
- **Code/output changes:** none

### S23-T1-B-E1 (weDo, guided) — **A**
- **Diagnosis:** Bug clásico `pass` + print final → i=3 vs break en ready → 2. Instruction nombra el defecto; feedback razona wait distinto en CI; retro esqueleto de auto-wait + puente E2. Discrimina bien.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S23-T1-B-E2 (weDo, independent) — **B**
- **Diagnosis:** for-else con `print('ok')` en else — excelente. Feedback y retro comparten “timeout = postcondición / no siempre ok al final del for” (eco).
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  El camino de timeout es un resultado de negocio del wait: el portal no cumplió el contrato a tiempo y el runbook debe registrar evidencia (T3), no un `ok` decorativo. El error clásico es “el for terminó, entonces pasó”. Pregunta: ¿qué adjuntarías al ticket si ves `timeout` tres veces seguidas? Luego (E3) combinas título y controles en una assertion web-first.
- **Code/output changes:** none

### S23-T1-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** `assert_ready` título + buttons≥1; dos páginas good/empty; feedback y retro alineados pero no idénticos; self-check sobre fila de tabla / download started. Transfer fuerte.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S23-T2-A-DEMO (iDo) — **A**
- **Diagnosis:** Fill periodo + sha256 truncado de `b"data"`; preamble “éxito = binario”; puente S24 OCR; `why` y retro en rango con misconception “clic no falló = step OK”.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S23-T2-A-E1 (weDo, guided) — **A**
- **Diagnosis:** Periodo comentado; éxito dict exacto; preamble ancla S24; feedback y retro relacionados pero retro eleva a “bug de contrato de negocio”. DEFECT claro.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: feedback ya suficiente)
- **Proposed residual:** none required
- **Code/output changes:** none

### S23-T2-A-E2 (weDo, independent) — **B**
- **Diagnosis:** MD5 vs SHA-256 discrimina (`8d777f38` ≠ `3a6eb079`). Feedback corto (~22 w, bajo piso 25); retro corta (~30 w) y se queda en “el clic funcionó” sin self-check.
- **Checklist:** all pass; feedback/retro partial (longitud)
- **Severity residual:** P2
- **Proposed feedback (expand):**  
  El algoritmo del contrato importa para auditoría: MD5 y SHA-256 dan digests distintos. Debiste usar sha256 de `b'data'` truncado a 8: `3a6eb079`. Un hash “cualquiera” no cierra el step del runbook CP-N2-C.
- **Proposed retrospective (replace):**  
  El hash cierra el step de download: evidencia reproducible del binario que alimentará OCR en S24. El error clásico es “el clic funcionó”. Pregunta: ¿qué harías si el digest no coincide con el del runbook? Luego (E3) reusas sesión con storage_state conceptual en vez de re-loguear siempre.
- **Code/output changes:** none

### S23-T2-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** `session_mode` token → reuse / vacío → login; self-check “token expirado”; feedback corto pero correcto. Transfer alineado a storage_state.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: feedback ~23 → +1 frase sobre flakes)
- **Proposed residual:** none required
- **Code/output changes:** none

### S23-T2-B-DEMO (iDo) — **A−**
- **Diagnosis:** PO mínimo muta `ctx`; preamble credenciales demo/sandbox; `why` en rango; retro misconception “auth en self”. Preamble ~60 w un poco corto.
- **Checklist:** all pass; preamble partial (longitud)
- **Severity residual:** P2
- **Proposed residual:** none obligatorio; si se toca: +1 frase “en local mapearás a `LoginPage.submit` con Playwright”.
- **Code/output changes:** none

### S23-T2-B-E1 (weDo, guided) — **A**
- **Diagnosis:** `pass` sin setear auth; éxito `True`; límites anti-secretos reales y estado en ctx; feedback razona contexto vacío; retro puente a denied. Sólido.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S23-T2-B-E2 (weDo, independent) — **B**
- **Diagnosis:** PermissionError sin capturar → `denied`. Feedback y retro clonan “seguir ciego / timeout opaco / decisión de negocio” (jaccard ~0.35).
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  El guard de auth es un **gate** del adaptador: convierte `PermissionError` en señal legible (`denied`) antes de tocar el export. Así el runbook no confunde “portal lento” con “nunca hubo sesión”. Pregunta: ¿dónde loguearías `denied` para el on-call? Luego (E3) modelas anonymous → authenticated sin auth fantasma.
- **Code/output changes:** none

### S23-T2-B-E3 (weDo, transfer) — **B+**
- **Diagnosis:** Transfer de estados; self-check `mfa_pending`; feedback muy corto (~19 w). Output discrimina `authenticated` / `anonymous`.
- **Checklist:** all pass; feedback partial (longitud)
- **Severity residual:** P2
- **Proposed feedback (expand):**  
  login_ok True avanza a authenticated; False deja anonymous. Auth fantasma dejaría pasar el guard del reporte con sesión inventada y contaminaría el run de CP-N2-C.
- **Code/output changes:** none

### S23-T3-A-DEMO (iDo) — **A**
- **Diagnosis:** Paquete de falla + keys ordenadas; preamble on-call Lima 2 a.m.; `why` keys vs values; retro “print del error no basta”. Completo.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S23-T3-A-E1 (weDo, guided) — **B**
- **Diagnosis:** values vs keys — trap limpio. **Eco fuerte** feedback/retro (jaccard ~0.49): ambos repiten “keys ordenadas / dump de values / CI”.
- **Checklist:** all pass; retro partial (eco fuerte)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Comparar la **forma** del paquete (keys) es el contrato del grader y del runbook; el texto del error puede cambiar entre corridas. El error clásico es dump de values con paths volátiles. Pregunta: ¿qué key mínima añadirías si el step es `download_report`? Siguiente (E2): filtrar ruido de logs para ver ERR.
- **Code/output changes:** none

### S23-T3-A-E2 (weDo, independent) — **A−**
- **Diagnosis:** Filtro `'ERR' in l`; éxito `['ERR timeout']`; feedback y retro relacionados (ticket vs Trace Viewer) pero retro eleva al flujo de diagnóstico. Feedback ~24 w leve bajo.
- **Checklist:** all pass
- **Severity residual:** P2 opcional (feedback +1 frase)
- **Proposed residual:** none required
- **Code/output changes:** none

### S23-T3-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** Trace solo si `ok=False`; path determinista; self-check retención de traces; fade desde keys/logs. Transfer de política de disco.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S23-T3-B-DEMO (iDo) — **A−**
- **Diagnosis:** Retry selectivo timeout→ok / captcha→handoff; preamble ética; `why` en rango. Retro ~38 w (leve bajo 40) pero repara misconception y puente We Do.
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  Si puedes separar “timeout reintentable” de “captcha no reintentable” sin mirar el código, ya tienes la política de recovery del adaptador. El error clásico es reintentar cualquier excepción. We Do: codificar `should_retry`, recovery distinta para stale vs timeout, y `next_step` tras checkpoint `last_ok_step`.
- **Code/output changes:** none

### S23-T3-B-E1 (weDo, guided) — **B**
- **Diagnosis:** captcha en set reintentable — crítico ético. Feedback fuerte (frontera ética). Retro corta (~26 w) y genérica (“cualquier excepción → retry”) sin self-check.
- **Checklist:** all pass; retro partial (longitud + genérica)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  `should_retry` es el runbook en una función: solo transitorios (`timeout`, `429`). Incluir captcha en el set no es un detalle del grader — es un anti-patrón ético que castiga al portal. Pregunta: ¿por qué un 403 de negocio tampoco debería reintentarse? Siguiente (E2): recovery distinta para stale DOM vs timeout.
- **Code/output changes:** none

### S23-T3-B-E2 (weDo, independent) — **A**
- **Diagnosis:** stale→goto_home vs timeout→retry; feedback y retro **distintos** (acciones vs “igual de rojos en el log”). Pedagogía excelente.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S23-T3-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** Checkpoint `last_ok_step=login` → `form`; self-check si last es el último step; alineado a You Do. Hints casi spoilean el índice (aceptable en transfer mínimo).
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: suavizar hint 2 de “el siguiente es form”)
- **Proposed residual:** none required
- **Code/output changes:** none

### S23-T4-A-DEMO (iDo) — **A**
- **Diagnosis:** Cascada export con rpa=True; preamble “dato verificado ≠ trofeo del clic”; `why` y retro en rango. Modelo claro de diseño de canal.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S23-T4-A-E1 (weDo, guided) — **A−**
- **Diagnosis:** rpa primero (anti-patrón clásico); feedback excelente (“músculo del clic”); retro corta (~28 w) pero distinta (orden de ifs = política).
- **Checklist:** all pass; retro partial (longitud)
- **Severity residual:** P2
- **Proposed retrospective (expand):**  
  El orden de los ifs **es** la política de integración del adaptador: api → export → rpa → human. El error clásico es “si hay RPA, RPA” porque la skill de browser está caliente. Pregunta: con los tres flags en True, ¿qué canal defiendes en la reunión de ops? Siguiente (E2): misma cascada cuando api falta y export existe.
- **Code/output changes:** none

### S23-T4-A-E2 (weDo, independent) — **B**
- **Diagnosis:** Hardcode `c='rpa'` con flags export; discrimina. Feedback y retro comparten “skill caliente / plan A export” (eco).
- **Checklist:** all pass; retro partial (eco)
- **Severity residual:** P2
- **Proposed retrospective (replace):**  
  Export es el plan A cuando no hay API: mismo reporte, menos UI frágil y menos superficie de ToS. Hardcodear rpa ignora la cascada aunque `export=True`. Pregunta: ¿qué documentarías en el runbook si solo queda RPA? Luego (E3) empaquetas method + reason para el ticket de reemplazo.
- **Code/output changes:** none

### S23-T4-A-E3 (weDo, transfer) — **A**
- **Diagnosis:** `decide` con method/reason; dos dicts rpa/no_api y export/export_ok; self-check export_stale; transfer de gobernanza. Feedback corto (~22) pero usable.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: feedback +reason)
- **Proposed residual:** none required
- **Code/output changes:** none

### S23-T4-B-DEMO (iDo) — **A**
- **Diagnosis:** captcha → human_handoff; preamble “no es otro timeout”; `why` ToS gana y payload mínimo; retro ética del robot. Completo.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S23-T4-B-E1 (weDo, guided) — **B**
- **Diagnosis:** Ternaria invertida + un solo print — doble defecto bien diseñado. Title 3 palabras (leve bajo 4). Feedback fuerte (“defecto más grave”). Retro corta (~26 w).
- **Checklist:** all pass; title/retro partial
- **Severity residual:** P2
- **Proposed title:** CAPTCHA dispara handoff humano  
  (o mantener; polish opcional)
- **Proposed retrospective (replace):**  
  Handoff es política del adapter, no vergüenza del automatizador: captcha=True detiene; captcha=False permite continue. El error clásico es invertir la ternaria o solo probar el happy path. Pregunta: ¿qué evidencia mínima adjuntarías al ticket de ops? Siguiente (E2): ToS gana sobre captcha/handoff.
- **Code/output changes:** none

### S23-T4-B-E2 (weDo, independent) — **A−**
- **Diagnosis:** Prioridad ToS → abort aunque captcha; feedback y retro alineados (prohibición contractual) sin clonar frase a frase. Feedback ~22 w leve bajo.
- **Checklist:** all pass
- **Severity residual:** P2 opcional
- **Proposed feedback (expand):**  
  Con `tos_forbidden` la action es `abort`. Pasar a un humano “para que decida el ToS” no repara una prohibición contractual del canal: ToS gana sobre handoff y sobre captcha.
- **Code/output changes:** none

### S23-T4-B-E3 (weDo, transfer) — **A**
- **Diagnosis:** Payload keys sorted + step; self-check periodo de reporte; límites anti-secretos; alinea You Do on_blocker + evidence. Transfer de evidencia actuable.
- **Checklist:** all pass
- **Severity residual:** none
- **Proposed residual:** none
- **Code/output changes:** none

### S23-YOU-DO (youDo) — **A**
- **Diagnosis:** Marco de proyecto maduro: context CP-N2-C (portal sintético, hash, retry, evidencia, last_ok_step, puente S24); objectives y requirements éticos; starter casi completo con hueco intencional `LoginPage.submit`; corrida de aceptación con prints de contrato; rubric 6 criterios; portfolioNote; retrospective de defensa (invariantes, portal real vs dicts, frase medible 30 s). Un true newbie sabe qué construir y cómo defenderlo.
- **Checklist:** all pass
- **Severity residual:** none (P2 opcional: en starter, comentar la salida esperada de `auth True` / `retry_captcha False` como checklist de auto-verificación — no cambiar grader)
- **Proposed residual:** none required
- **Code/output changes:** none

---

## Priority order (Round 2 Fixer)

### P0
- **Ninguno.** Cobertura de campos completa; sin wrong≈right; outputs canónicos intactos.

### P1
- **Ninguno obligatorio.** No hay fallas de true-newbie en éxito observable ni en ética crítica mal formulada (T3-B-E1 / T4-B-* ya enseñan bien; solo polish de retro).

### P2 (calidad — tocar solo si el Fixer entra a la unidad)
1. **Eco feedback↔retrospective (reemplazar retro):**  
   T3-A-E1 (eco fuerte) · T2-B-E2 · T1-B-E2 · T4-A-E2 · T1-A-E2 · T3-B-E1 · T4-B-E1 · T4-A-E1 (expandir)
2. **Feedback corto (&lt;25 w):**  
   T2-B-E3 · T2-A-E2 · T4-A-E3 · T4-B-E2 · T2-A-E3 · T3-A-E3 · T4-A-E2 · T3-A-E2 · T2-B-E2 · T4-B-E1
3. **iDo preamble/retro leve longitud:**  
   T1-B-DEMO · T2-B-DEMO · T3-B-DEMO (retro)
4. **Title polish opcional:** T4-B-E1 (3 palabras → “CAPTCHA dispara handoff humano”)
5. **Hints E3 spoiling (opcional):** suavizar T3-B-E3 hint 2 y similares — no bloquear

**No tocar:** solutionCode, outputs canónicos, starters (DEFECT bien nombrados), structure E1→E3, youDo rubric/starter salvo comentario de auto-check.

---

## Residual risks

1. **Modelo dict ≠ Playwright real:** el learner puede creer que “ya sabe Playwright” sin instalar runtime. Mitigado en iDo intro + theory sketch; mantener mención “lab sin Chromium” en preambles al editar.
2. **Ética CAPTCHA/ToS:** el grader se pasa con un fix de ternaria; el hábito se graba en retrospective/selfCheck. T3-B-E1 y T4-B-* ya cargan el mensaje; no diluir al expandir retros.
3. **Outputs canónicos frágiles (repr de listas/dicts):** el Fixer R2 **no** cambia outputs salvo execute-and-diff justificado (ninguno requerido aquí).
4. **You Do sin autograder de prints:** la retrospective empuja verificación manual de la corrida de aceptación y del runbook — suficiente; el hueco `LoginPage.submit` es intencional.
5. **Id de sección `computer-vision` vs contenido RPA:** confusión de navegación en el producto; fuera de scope de campos pedagógicos de ejercicio, pero afecta contexto del newbie.
6. **Sobre-andamiaje hints E3:** residual menor; preferir suavizar hint antes de reescribir instruction.

---

## Counts summary (post Round-1; residual R2)

| Tipo | N | preamble | retrospective | title (weDo) | residual R2 focus |
|------|---|----------|---------------|--------------|-------------------|
| iDo | 8 | 8/8 | 8/8 | N/A | 3 pre/retro longitud leve |
| weDo | 24 | 24/24 | 24/24 | 24/24 | ~8 ecos retro; ~10 feedback cortos |
| youDo | 1 | N/A (context OK) | 1/1 | exists | none |
| **Integridad wrong≈right** | 0 | — | — | — | traps verificados OK |

Código/starter/solution/output: **preservar**. Round 2 Fixer = prosa residual P2 only.

---

Section 23 exercise pedagogy review complete. Ready for the Fixer prompt.
