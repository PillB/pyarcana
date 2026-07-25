# S36 Pedagogy Fixer Report (Round 2)

## Section
- **title:** Clustering, anomalías y validación temporal
- **id:** `ai-apis-advanced`
- **index:** 36
- **source:** `src/lib/course/sections/s36-ai-apis-advanced.ts`
- **Round-2 review:** `round2/S36_EXERCISE_PEDAGOGY_REPORT.md`
- **counts:** iDo 8 · weDo 24 · youDo 1

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and Round-2 residual ledger.
- Hand-edited only residual units listed below (no generators, no bulk prose templates, no theory/selfCheck rewrites).
- Preserved all solution outputs and ethics prints (`verdict` / `misconduct` / `auto_guilt` / `sanction_from_metric`).
- Validated: `tsc --noEmit` clean; T1-A-E2 solution still prints `2.0` / `safe_sd 2` / `ok True`.

## Anti-aberration
- Every retrospective/instruction change was unit-specific and hand-written against the R2 proposal text.
- No cross-section paste; no script-manufactured paragraphs for learners (edits applied via exact-string replace of pre-authored copy).

## Fixes applied

### P0 / P1
- None required (R2: section already learner-ready).

### P2 — iDo retros (short → principle + self-check + bridge)
| Unit | Change |
|------|--------|
| S36-T1-B-DEMO | Expanded retrospective (~58 w): acuerdo de k ≠ ARI; self-check seeds divergen; puente We Do. |
| S36-T2-A-DEMO | Expanded retrospective (~49 w): pesos fijos vs sklearn; self-check exploratory/decision_model; puente batch. |
| S36-T2-B-DEMO | Expanded retrospective (~53 w): far → cola no culpa; self-check far+legítimo; puente guards/ready. |
| S36-T3-B-DEMO | Expanded `why` (piso ~40 w: parámetro ≠ prevalencia) + retrospective (~44 w) con self-check de overflow. |

### P2 — weDo retros (eco feedback → self-check + transfer cue)
| Unit | Change |
|------|--------|
| S36-T1-A-E1 | Retro: media=centroide; vacío≠0.0; self-check update vacío. |
| S36-T1-A-E2 | Retro: scale-first + self-check `sd=0` → `safe_sd=1.0`. |
| S36-T1-B-E1 | Retro: max vs min; self-check “un seed no basta”. |
| S36-T1-B-E2 | Retro: gate ético (métrica ≠ sanción); self-check `stable False`. |
| S36-T2-A-E1 | Retro: producto punto documentado; self-check 5.0 vs 10. |
| S36-T2-A-E2 | Retro: no invertir w en batch; self-check w=(1,0). |
| S36-T2-B-E1 | Retro: higiene de dossier; self-check `auto_label`. |
| S36-T2-B-E2 | Retro: ready derivado; self-check features constantes. |
| S36-T3-A-E1 | Retro: z=3 vs saturar; self-check por qué `ref=xs[:3]`. |
| S36-T3-B-E1 | Retro: producto = carga; self-check 20 vs 200.1. |
| S36-T3-B-E2 | Retro: overflow de capacidad; self-check no subir contamination. |
| S36-T4-A-E1 | Retro: leakage de magnitud; self-check flag si 50 entra al train. |
| S36-T4-A-E2 | Retro: leakage de mes; self-check has_leakage. |
| S36-T4-B-E1 | Retro: k del contrato; self-check print `k 2` (float no-discriminante). |

### P2 — integrity / fade (code + instruction)
| Unit | Change | Output |
|------|--------|--------|
| **S36-T1-A-E2** | Starter alineado al contrato de prints: DEFECT explícito en return `(z, safe_sd)`, unpack y print de `safe_sd` devuelto (no `sd` crudo). | **Preserved** `2.0` / `safe_sd 2` / `ok True` |
| **S36-T1-B-E2** | Instruction reorientada: objetivo = gate ético (`stable` + `sanction_from_metric False`), no re-drill puro de argmax. Bug `min`→`max` sin tocar. | **Preserved** |
| **S36-T3-A-E3** | Instruction reordenada: μ/σ ya correctos → z=3 → **route `human_review`** (meta transfer) → `auto_sanction False`. | **Preserved** |
| **S36-T2-A-E3** | Paso 4 mental (“Maneja mentalmente mass=0”) → paso de implementación (“No hardcodees 0.8”). | **Preserved** |
| **S36-T4-A-E3** | Paso 4 mental → criterio verificable (rates constantes ⇒ spike False). | **Preserved** |

### Not changed (by design)
- youDo prose/starter (R2: pass; starter generoso aceptable).
- Units already **A** without residual (T1-A-DEMO, T1-A-E3, T2-B-E3, T3-B-E3, T4-B-E3, etc.).
- Solution codes / canonical outputs for all 24 weDo + 8 iDo demos.
- Theory, selfCheck, resources.
- T1-B-E1/E2 shared bug `min`→`max` (prose fade only; no silent output rewrite).

## Validation
| Check | Result |
|-------|--------|
| `tsc --noEmit` | Pass (exit 0) |
| T1-A-E2 solution execute | `2.0` / `safe_sd 2` / `ok True` |
| Ethics prints still present | `verdict False`, `misconduct False`, `auto_guilt False`, `sanction_from_metric False`, `auto_sanction False` |
| Retros touched | ~18 units; word counts ≈44–66 (within/near 40–80 target) with self-check |
| Generators used for learner prose | **No** |

## Residual after Fixer
1. T1-B-E1/E2 still share the same code defect (`min`→`max`); preambles + E2 instruction now make goals distinct — acceptable for R2.
2. T3-A-E3 starter still multi-defects z + route + auto_sanction; instruction now prioritizes route (transfer meta).
3. youDo starter remains generous — mitigated by retrospective + gate (documented, not emptied).
4. Minor optional eco remains on units already **A−** with self-check (e.g. T1-B-E3, T2-A-E3) — not expanded to avoid bloat.

## Summary
Round-2 residual quality work for Section 36 is complete: short/echo retros expanded with metacognition, T1-A-E2 starter print contract aligned, T1-B-E2 ethical-gate instruction reinforced, T3-A-E3 instruction reordered for transfer. No P0. Canonical outputs preserved.

---

Section 36 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
