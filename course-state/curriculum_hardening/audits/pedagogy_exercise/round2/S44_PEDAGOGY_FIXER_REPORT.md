# S44 Pedagogy Fixer Report (Round 2)

## Section
- **title:** CI/CD y seguridad de la cadena de suministro
- **shortTitle:** CI/CD supply chain
- **id:** `multimodal` (archivo `s44-multimodal.ts`; contenido = CI/CD + supply chain — **no** “multimodal”)
- **source:** `src/lib/course/sections/s44-multimodal.ts`
- **review input:** `round2/S44_EXERCISE_PEDAGOGY_REPORT.md`
- **scope residual:** P2 polish only (eco feedback/retro, retros cortas, why iDo bajo piso, prefijo cache demo); **0 P0 / 0 P1**

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the Round-2 unit ledger.
- Hand-edited pedagogical prose in `s44-multimodal.ts` **unit by unit** — no bulk replace of templates across units.
- **No** generators, loops, or scripts to manufacture educational prose (measurement-only scripts for word/echo checks allowed by spec).
- Code change limited to T1-B demo: `pip-` → `lock-` (output `cache_key True` preserved).
- Validated with `tsc --noEmit` and measurement of echo / lengths.

## Acceptance checklist

- [x] Every non-trivial unit has `preamble` + `retrospective` (coverage from R1; quality tightened in R2)
- [x] We Do has short `title` (unchanged)
- [x] `instruction` is task-only (unchanged)
- [x] Exact outputs preserved (T1-B demo output strings identical after `lock-` align)
- [x] Spanish PE; no real PII; CASO-PIU-044 sintético
- [x] No generators used
- [x] Section source typechecks (`tsc --noEmit` clean)

## What changed (Round 2 residual only)

### Pattern applied
- **E2/E3 retros:** principle + misconception *distinct from feedback* + transfer/self-check (`Pregunta:`).
- **E1 retros cortas:** expanded with misconception + self-check (not a clone of feedback).
- **iDo why/retro:** expanded where under floor; demo T1-B aligned to lab contract `lock-`.

### I Do (8 demos touched for polish; T1-A left strong)
| Unit | Change |
|------|--------|
| S44-T1-B-DEMO | Code/preamble: `pip-` → `lock-` (align We Do/theory); retro expanded (cache hit ≠ build OK + self-check miss) |
| S44-T2-A-DEMO | Retro expanded: `@v4` / rotar secretos + self-check `secret_hits` |
| S44-T2-B-DEMO | Why expanded (set digests == 1); retro expanded (SBOM de ayer + self-check aaa/bbb) |
| S44-T3-A-DEMO | Why + retro expanded (rebuild huérfano + self-check abc/new) |
| S44-T3-B-DEMO | Retro expanded (self-check 8% → rollback) |
| S44-T4-A-DEMO | Why + retro expanded (notes solo `change` + self-check) |
| S44-T4-B-DEMO | Why + retro expanded (continue-on-error + self-check 02:10) |
| S44-T1-A-DEMO | Unchanged (R2 score A) |

### We Do E2/E3 — eco feedback/retro (16 units)
| Unit | Change |
|------|--------|
| S44-T1-A-E2 | Retro rewrite: schema vs contenido; self-check matriz `{3.10}` |
| S44-T1-A-E3 | Retro rewrite: no inventar matriz; self-check orden adverso/missing |
| S44-T1-B-E2 | Retro rewrite: DISCARD vs MISSING; self-check evidencia post-miss |
| S44-T1-B-E3 | Retro rewrite: INSPECT sin rellenar True; self-check tag prod |
| S44-T2-A-E2 | Retro rewrite: `@v4` ≠ pin; self-check hex tras `@` |
| S44-T2-A-E3 | Retro rewrite: SECURITY_APPROVAL; self-check write+missing |
| S44-T2-B-E2 | Retro rewrite: un subject; self-check adverso aaa/bbb/ccc |
| S44-T2-B-E3 | Retro rewrite: REBUILD sin copiar SBOM; self-check CP-N4-B |
| S44-T3-A-E2 | Retro rewrite: digests + aprobador; self-check lead 30 s |
| S44-T3-A-E3 | Retro rewrite: no inventar digest; self-check evidencia promote |
| S44-T3-B-E2 | Retro rewrite: 8% incidente vs MISSING RTO; self-check 500 s |
| S44-T3-B-E3 | Retro rewrite: PAUSE sin RTO; self-check log portfolio |
| S44-T4-A-E2 | Retro rewrite: on-call 02:00; self-check MISSING notes |
| S44-T4-A-E3 | Retro rewrite: no inventar set; self-check frase rollback |
| S44-T4-B-E2 | Retro rewrite: silencioso ≠ MISSING evidencia; self-check adverso |
| S44-T4-B-E3 | Retro rewrite: ASSIGN dueño; self-check You Do owner/artifact |

### We Do E1 — retros cortas + feedback T4-A
| Unit | Change |
|------|--------|
| S44-T2-A-E1 | Retro expand: stub corto / hex + puente E2 |
| S44-T2-B-E1 | Retro expand: digests «parecidos» + self-check attestation |
| S44-T3-A-E1 | Retro expand: PASS sin approval + self-check staging≠dev |
| S44-T3-B-E1 | Retro expand: hold a ciegas + self-check 0.4%/75 s |
| S44-T4-A-E1 | Feedback expand (adverso E2); retro expand (CI pasó ≠ merge libre) |
| S44-T4-B-E1 | Retro expand: continue-on-error + self-check logs_redacted |
| S44-T1-A-E1 / T1-B-E1 | Left (R2 none required; already principle + transfer) |

### Explicit non-goals (honored)
- No rename of `id: multimodal` / filename
- No canonical solution output or assert edits (except demo `lock-` with same True print)
- No You Do starter evidence True “fix”
- No E1–E3 code fade rewrite
- Hints E1 genéricos left (optional P2; Master-tolerant)
- Feedback lengths ~20–24 w on some E2/E3 left (R2 “leve”; retro was primary residual)

## Code/output integrity
| Area | Action |
|------|--------|
| T1-B demo `cache_key` | `pip-` → `lock-`; output still `cache_key True` |
| All weDo `solutionCode.output` | **Unchanged** |
| Starter `# DEFECT:` traps | **Unchanged** |
| You Do starter / rubric | **Unchanged** |
| Theory block `lock-` | Already aligned; no further code edit |

## Validation
- Echo feedback/retro (first 5 words equal): **0** after fix (was ~16 units)
- Expanded/replaced retros: **iDo 7** + **weDo ~22** (E2/E3 all + short E1s + T2-A-E1)
- `npx tsc --noEmit`: clean (exit 0)
- Measurement-only word counts: weDo retros targeted units ≥40 w; short leftover only T1-A-E1 / T1-B-E1 (R2 none required)
- No generators used for prose

## Residual risks (post R2 fix)
1. **Code pattern E1→E3 still regular** (invert → assess → decide): mitigated by distinct retros/self-checks; not a structural rewrite this round.
2. **Some feedback still ~20–24 w** (spec floor 25): optional; not the R2 primary residual once retro ≠ feedback.
3. **Id `multimodal`** still mismatches content; out of exercise-pedagogy scope.
4. **Instructions cortas** (~19–36 w) remain acceptable with preamble bullets.

## Files touched
1. `src/lib/course/sections/s44-multimodal.ts`
2. This report: `round2/S44_PEDAGOGY_FIXER_REPORT.md`

Section 44 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
