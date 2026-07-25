# S23 Pedagogy Fixer Report (Round 2)

## Section
- **title:** Browser RPA con Playwright
- **id:** `computer-vision` (contenido = browser RPA / mental model Playwright)
- **index:** 23
- **source:** `src/lib/course/sections/s23-computer-vision.ts`
- **round2 review:** `round2/S23_EXERCISE_PEDAGOGY_REPORT.md`
- **counts:** iDo 8, weDo 24, youDo 1 (33 units)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` and Round-2 residual ledger.
- Applied **hand-written** residual prose only in Section 23 source.
- **No** generators, bulk templates, or cross-section paste.
- Measurement-only word counts after edits; typecheck clean (`tsc --noEmit`).
- Canonical solution **outputs** and starter defects left intact.

## Round-2 residuals addressed

### P0 / P1
- **Ninguno** en el review R2 (cobertura de campos completa; sin wrong≈right).

### P2 — eco feedback↔retrospective (reemplazar retro) — done
| Unit | Action |
|------|--------|
| **T1-A-E2** | Retro reescrita: orden de intento = contrato de producto (no `sorted`); self-check `data-testid` vs XPath |
| **T1-B-E2** | Retro reescrita: timeout como resultado de negocio + evidencia T3; self-check ticket ×3; no eco de “for siempre ok” |
| **T2-B-E2** | Retro reescrita: guard = **gate** del adaptador; self-check log on-call; puente E3 sin clonar feedback |
| **T3-A-E1** | Retro reescrita (eco fuerte): **forma** del paquete vs texto volátil; self-check key `download_report` |
| **T3-B-E1** | Retro reescrita: `should_retry` como runbook; anti-patrón ético captcha; self-check 403 |
| **T4-A-E1** | Retro expandida: ifs = política api→export→rpa→human; self-check reunión ops |
| **T4-A-E2** | Retro reescrita: export = plan A; hardcode rpa ignora cascada; self-check runbook si solo RPA |
| **T4-B-E1** | Title → `CAPTCHA dispara handoff humano`; retro con ambos caminos + self-check evidencia ops |

### P2 — feedback corto (&lt;25 w) — done
| Unit | Action |
|------|--------|
| **T2-A-E2** | Feedback + frase runbook CP-N2-C; retro + puente OCR S24 + self-check digest |
| **T2-A-E3** | Feedback + flakes / tiempo de suite |
| **T2-B-E2** | Feedback ≥25 w (runbook + on-call) |
| **T2-B-E3** | Feedback + contaminación del run CP-N2-C |
| **T3-A-E2** | Feedback + filtrar antes de escalar / Trace Viewer |
| **T4-A-E2** | Feedback + ToS / UI frágil |
| **T4-A-E3** | Feedback + reunión de ops |
| **T4-B-E1** | Feedback aclara ambos casos True/False |
| **T4-B-E2** | Feedback + ToS gana sobre handoff y captcha |

### P2 — iDo longitud leve — done
| Unit | Action |
|------|--------|
| **T1-B-DEMO** | Preamble + frase “en local Playwright auto-espera usabilidad del control” |
| **T3-B-DEMO** | Retro expandida con nombres de skills We Do (`should_retry`, stale/timeout, `next_step` / checkpoint) |
| **T2-B-DEMO** | Sin cambio obligatorio (preamble ya mapea a `LoginPage.submit` local) |

### Left unchanged (by design)
- **You Do** — already A; no residual
- Units scored A with no residual (T1-A-E1/E3, T1-B-E1/E3, T2-A-E1, T2-B-E1, T3-A-E3, T3-B-E2/E3, T4-A-DEMO, T4-B-DEMO/E3, etc.)
- All `solutionCode.output` and starter `# Arregla:` defects
- Structure E1→E2→E3, tests, edgeCases
- Optional E3 hint softening (T3-B-E3) — non-blocking; left as guided transfer hints

## Unit change ledger (summary)

### I Do
- **T1-B-DEMO** — preamble: lab sin Chromium + puente Playwright real
- **T3-B-DEMO** — retrospective: principle + misconception + We Do bridge explícito

### We Do — retrospectives desacopladas / expandidas
| Unit | Change |
|------|--------|
| T1-A-E2 | Desacoplar (contrato de producto, no sort) + self-check |
| T1-B-E2 | Desacoplar (timeout + evidencia T3) + self-check |
| T2-A-E2 | Feedback + retro (hash cierra step → S24 OCR) + self-check |
| T2-B-E2 | Desacoplar (gate auth) + self-check on-call |
| T2-B-E3 | Feedback floor (auth fantasma / CP-N2-C) |
| T3-A-E1 | Desacoplar eco fuerte (forma del paquete) + self-check |
| T3-A-E2 | Feedback floor (señal / Trace Viewer) |
| T3-B-E1 | Desacoplar (runbook ético, no “cualquier excepción”) + self-check 403 |
| T4-A-E1 | Expand (política de integración + self-check ops) |
| T4-A-E2 | Desacoplar (export plan A / hardcode rpa) + self-check |
| T4-A-E3 | Feedback floor (ticket reemplazo API) |
| T4-B-E1 | Title polish + retro (ambos caminos) + self-check evidencia |
| T4-B-E2 | Feedback floor (ToS gana) |
| T2-A-E3 | Feedback floor (flakes) |

### Code / outputs
- **none** — no execute-and-diff required; traps wrong≠right preserved

## Acceptance checklist (Round 2 Fixer)

- [x] Every non-trivial unit still has `preamble` + `retrospective` (no field regressions)
- [x] We Do `title` present; T4-B-E1 title now 4 words PE
- [x] `instruction` remains task-only (not rewritten as essay)
- [x] Exact outputs preserved; starters intact
- [x] Spanish PE; synthetic portal / demo credentials; no real PII
- [x] No generators; hand-written residual prose only
- [x] Section source typechecks (`tsc --noEmit` clean)
- [x] Feedback ↔ retrospective desacoplados en los 8 pares P2 prioritarios
- [x] Feedback floors ≥ ~25 w en unidades listadas; retros prioritarias con principle + misconception + transfer/self-check

## Residual risks (post-fix)
1. **Modelo dict ≠ Playwright real:** preambles siguen anclando lab sin Chromium; T1-B-DEMO ahora menciona auto-wait real en local. El learner aún debe instalar runtime fuera del grader.
2. **Ética CAPTCHA/ToS:** no diluida; T3-B-E1 y T4-B-* refuerzan stop condition y `abort` contractual.
3. **Outputs canónicos frágiles (repr):** no tocados.
4. **Hints E3 spoiling (T3-B-E3):** residual opcional no bloqueante; fade transfer se priorizó sobre reescritura de hints.
5. **Id de sección `computer-vision` vs contenido RPA:** fuera de scope de prosa de ejercicio.

## Files touched
1. `src/lib/course/sections/s23-computer-vision.ts` — residual P2 pedagogy prose only  
2. `course-state/curriculum_hardening/audits/pedagogy_exercise/round2/S23_PEDAGOGY_FIXER_REPORT.md` — this report  

---

Section 23 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
