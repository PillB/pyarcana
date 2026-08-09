# S25 Pedagogy Fixer Report (Round 2)

## Section
- **title:** Endpoints de IA, Hugging Face y prompting evaluado
- **id:** `streamlit-dashboards` (archivo histórico `s25-streamlit-dashboards.ts`; contenido = stack IA / mock HF / prompting / evals)
- **index:** 25
- **source:** `src/lib/course/sections/s25-streamlit-dashboards.ts`
- **round2 review:** `round2/S25_EXERCISE_PEDAGOGY_REPORT.md`
- **counts:** iDo 8, weDo 24, youDo 1 (33 units)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` and Round-2 residual ledger.
- Applied **hand-written** residual prose only in Section 25 source.
- **No** generators, bulk templates, or cross-section paste.
- Measurement-only word counts after edits; `tsc --noEmit` clean.
- Canonical solution **outputs**, starter `# Bug` defects, and code blocks left intact.

## Round-2 residuals addressed

### P1 — feedback ≠ retrospective (learning integrity) — done
| Unit | Action |
|------|--------|
| **S25-T1-B-E2** | Rewrote feedback (inverted branch diagnosis) + retrospective (desk choice + DPA self-check + E3 bridge) |
| **S25-T1-B-E3** | Rewrote feedback (hardcode vs license/`not_for`); reordered retro to drop opening paste |
| **S25-T3-B-E2** | Rewrote feedback (append/`len` diagnosis) + retrospective (audit + shell_rm self-check) |
| **S25-T4-A-E1** | Rewrote feedback (compute exact/schema_ok) + retrospective (hardcode misconception + schema≠exact self-check) |
| **S25-T4-A-E3** | Rewrote feedback (all required incl. mediana → human_review); reordered retro open |
| **S25-T4-B-E1** | Rewrote feedback (two starter bugs) + retrospective (telemetría vs control + self-check) |
| **S25-T4-B-E2** | Rewrote feedback (`return payload` bug) + retrospective (exfiltración + absent key self-check) |

### P2 — length, thin feedback, mild echo, soft E2 hints — done
| Residual | Action |
|----------|--------|
| **S25-T3-A-DEMO** retrospective | Expanded (~20w → ~55w): principle + misconception + mediana self-check + We Do bridge |
| **S25-T1-A-E3** feedback | Expanded: diagnoses conditional `auto_fraud` bug (~14w → ~40w) |
| **S25-T2-B-E3** feedback | Expanded: count failure + OPEN_AFTER decision |
| Short We Do retros | Expanded: **T1-A-E1**, **T2-A-E1**, **T2-A-E2**, **T2-B-E1**, **T2-B-E2**, **T3-A-E1**, **T3-A-E2**, **T3-B-E1** |
| Mild echo **T1-A-E2** | Distinct feedback (starter still at 1000) vs retro (umbral = contrato de lab) |
| E2 first hints softened | **T1-A-E2**, **T2-A-E2**, **T3-A-E2**, **T4-A-E2** — progressive, non-paste |
| Optional I Do retros | **T1-B-DEMO**, **T2-A-DEMO**, **T3-B-DEMO** — misconception + self-check |

### Left unchanged (by design)
- Units scored Strong with “none required”: T1-A-DEMO, T2-B-DEMO, T4-A-DEMO, T4-B-DEMO, T1-B-E1, T2-A-E3, T3-A-E3, T3-B-E3, T4-B-E3, youDo
- All `solutionCode` / `output` strings and starter defects
- We Do 4-bullet preambles (valid spec alternative; not padded to 80 words)
- Theory blocks, filename/id `streamlit-dashboards`
- Two output contracts (clasificador vs narrativo) kept separate in prose

## Unit change ledger

### I Do
| Unit | Change |
|------|--------|
| T3-A-DEMO | **P2** retro expand (schema first + constrained decoding + mediana self-check) |
| T1-B-DEMO | Optional retro + Apache misconception + blocks_fraud self-check |
| T2-A-DEMO | Optional retro + label suelto / narrativo misconception + “Hola mundo” self-check |
| T3-B-DEMO | Optional retro + shell_rm-as-ok misconception + allow/think self-check |
| T1-A / T2-B / T4-A / T4-B DEMO | No change |

### We Do — P1 desacoples
| Unit | Change |
|------|--------|
| T1-B-E2 | feedback + retro desacoplados (PII/exfiltración paste) |
| T1-B-E3 | feedback rewrite; retro reorder (gate compuesto paste) |
| T3-B-E2 | feedback + retro desacoplados (log/contador paste) |
| T4-A-E1 | feedback + retro desacoplados (hardcodear métricas paste) |
| T4-A-E3 | feedback rewrite; retro reorder (fail-closed paste) |
| T4-B-E1 | feedback + retro desacoplados (telemetría/control paste) |
| T4-B-E2 | feedback + retro desacoplados (minimización paste) |

### We Do — P2 polish
| Unit | Change |
|------|--------|
| T1-A-E1 | retro expand (self-check needs_language sin validator) |
| T1-A-E2 | feedback/retro mild echo fix; first hint softened |
| T1-A-E3 | feedback expand (conditional auto_fraud diagnosis) |
| T2-A-E1 | retro expand (string label + model_id vs model) |
| T2-A-E2 | retro expand; first hint softened |
| T2-B-E1 | retro expand (cache miss write + third-call self-check) |
| T2-B-E2 | retro expand (precio por mil vs por token) |
| T2-B-E3 | feedback expand (failures += 1 + OPEN_AFTER) |
| T3-A-E1 | retro expand (loads + flag) |
| T3-A-E2 | retro expand; first hint softened |
| T3-B-E1 | retro expand (string suelto / ok-deny invertido) |
| T4-A-E2 | first hint softened only |

### Measurement spot-check (edited prose, measurement only)
| Unit | ~words |
|------|--------|
| T1-B-E2 feedback | 29 |
| T1-B-E2 retro | 49 |
| T1-B-E3 feedback | 27 |
| T3-B-E2 feedback | 28 |
| T3-B-E2 retro | 39 |
| T4-A-E1 feedback | 39 |
| T4-A-E1 retro | 39 |
| T4-A-E3 feedback | 28 |
| T4-B-E1 feedback | 33 |
| T4-B-E1 retro | 43 |
| T4-B-E2 feedback | 30 |
| T4-B-E2 retro | 43 |
| T3-A-DEMO retro | 53 |
| T1-A-E3 feedback | 29 |
| T2-B-E3 feedback | 34 |
| T2-A-E1 retro | 37 |
| T2-A-E2 retro | 46 |
| T1-A-E1 retro | 47 |
| T1-B-DEMO retro | 60 |
| T2-A-DEMO retro | 57 |
| T3-B-DEMO retro | 52 |

## Acceptance checklist (Round 2 Fixer)

- [x] No missing-field regressions (title / preamble / instruction / retrospective present on all exercise units)
- [x] All 7 P1 role-collapse pairs desacoplados: feedback = diagnosis of failed attempt; retro = principle + misconception + transfer/self-check
- [x] P2 thin feedbacks expanded (T1-A-E3, T2-B-E3); worst I Do retro (T3-A) expanded
- [x] Short We Do retros expanded with misconception and/or self-check where reported
- [x] E2 first hints softened (no full solution line paste)
- [x] Outputs and starters intact; Spanish PE; synthetic fixtures; no real PII
- [x] No generators; hand-written residual prose only
- [x] Section source typechecks (`tsc --noEmit` clean)

## Residual risks (post-fix)
1. **Filename vs content:** `s25-streamlit-dashboards.ts` / id `streamlit-dashboards` still misnames IA endpoints content — navigation risk outside exercise prose scope.
2. **Two output contracts:** clasificador `{model,label,score}` vs narrativo `{hallazgo,…}` remain separated; future edits must not collapse them.
3. **E1 hints** still near-complete (acceptable guided fade); E2 first hints now progressive.
4. **4-bullet preambles** not padded to 80 words (spec alternative; intentional).
5. Canonical outputs untouched — no execute-and-diff needed.

## Files touched
1. `src/lib/course/sections/s25-streamlit-dashboards.ts` — residual feedback / retrospective / hint prose only
2. `course-state/curriculum_hardening/audits/pedagogy_exercise/round2/S25_PEDAGOGY_FIXER_REPORT.md` — this report

---

Section 25 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
