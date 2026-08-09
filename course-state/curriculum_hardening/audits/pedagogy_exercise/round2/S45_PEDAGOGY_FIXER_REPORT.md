# S45 Pedagogy Fixer Report (Round 2)

## Section
- **title:** Cloud, almacenamiento, colas e infraestructura
- **shortTitle:** Cloud y colas
- **id:** `iac`
- **source:** `src/lib/course/sections/s45-iac.ts`
- **review input:** `round2/S45_EXERCISE_PEDAGOGY_REPORT.md`
- **scope residual:** P2 polish only (length floors, anti-echo metacognition); **0 P0 / 0 P1**

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the Round-2 unit ledger (priority: weDo E2/E3 retros cortas o en eco; feedback &lt;25 w; iDo retros T1-B…T4-B; preambles iDo cortos opcionales).
- Hand-edited pedagogical strings in `s45-iac.ts` unit by unit — **no** bulk replace of a single template across the 8 subtemas.
- Each subtema kept a distinct anchor (stores / RPO-RTO / VT-ack / set-DLQ / lag-cuota / IAM-egress / plan-drift / PEN-recovery).
- **No** generators, loops, or scripts to manufacture prose.
- **No** code, starter, solution, assert, or output changes.
- Validated: all 24 weDo canonical outputs present; `tsc --noEmit` clean.

## Acceptance checklist

- [x] Every non-trivial unit has `preamble` + `retrospective` (coverage from R1 preserved; quality tightened)
- [x] We Do has short `title` (unchanged)
- [x] `instruction` is task-only (unchanged)
- [x] Exact outputs preserved
- [x] Spanish PE; no real PII; montos PEN sintéticos
- [x] No generators used
- [x] Section source typechecks (`tsc --noEmit` clean)

## What changed (Round 2 residual only)

### Pattern applied
- **Retrospective:** principle + misconception *distinct from feedback* + transfer/self-check (`Pregunta:` where useful).
- **Feedback:** expanded under floor with “por qué importa al revisor / reintento / portfolio” without cloning the retro.
- **iDo preamble (optional):** +1 frase de escena Iquitos / gate CP-N4-B where R2 flagged short preambles.

### I Do (7 demos touched; T1-A left A)

| Unit | Change |
|------|--------|
| S45-T1-B-DEMO | Retro expand: RPO edad / RTO minutos + self-check restore 45 min vs RTO 30 |
| S45-T2-A-DEMO | Retro expand: ack al leer pierde efecto + self-check VT 45/30 redelivery window |
| S45-T2-B-DEMO | Preamble + gate CP-N4-B si se borra poison; retro + self-check `len==processed` miente con dos m1 |
| S45-T3-A-DEMO | Preamble + pico Iquitos; retro + self-check capacity_ok backlog 80 / 4 workers |
| S45-T3-B-DEMO | Preamble + least_privilege decorativo sin denegaciones; retro + dos pruebas negativas portfolio |
| S45-T4-A-DEMO | Preamble + no «aplicar y ver»; retro + self-check planned={bucket} pierde queue |
| S45-T4-B-DEMO | Retro expand: under budget sin export/restore + self-check scale-out con restore_tested=False |

Left as-is (R2 score A / none residual): **S45-T1-A-DEMO**.

### We Do — feedback / retrospective polish

| Unit | Change |
|------|--------|
| S45-T1-A-E2 | Feedback expand schema-then-content; retro replace: incertidumbre ≠ breach + self-check status solo en cache |
| S45-T1-A-E3 | Retro tighten: WRITE_STORE_ADR vs REDESIGN + puente youDo `cache_authoritative` |
| S45-T1-B-E2 | Retro replace: MISSING:rto ≠ DECLARE «por precaución» + self-check backup fresco sin minutos |
| S45-T1-B-E3 | Feedback expand: «backup daily» sin números no cierra gate |
| S45-T2-A-E2 | Feedback expand revisor no inventa backoff; retro replace: missing ≠ NACK + riesgo de asumir backoff=True |
| S45-T2-A-E3 | Feedback expand VERIFY vs NACK vs «seguir con suerte» |
| S45-T2-B-E2 | Retro replace: terminal_in_dlq missing ≠ DEDUP + evidencia antes de replay DLQ |
| S45-T2-B-E3 | Feedback expand contención ≠ reintento eterno |
| S45-T3-A-E2 | Retro replace: REQUEST ≠ APPLY + self-check private_network=False en cuota |
| S45-T3-A-E3 | Feedback expand REQUEST planificación vs APPLY contención de status |
| S45-T3-B-E2 | Retro replace: DENY a ciegas vs pedir allowlist + self-check qué pedir a seguridad |
| S45-T3-B-E3 | Feedback expand no skip para «desbloquear el demo» |
| S45-T4-A-E2 | Retro replace: drift no medido ≠ REJECT ciego + mirar secretos/env además de destroys |
| S45-T4-A-E3 | Feedback expand REJECT (secretos/shared/destroy) + REVIEW previo al apply |
| S45-T4-B-E1 | Feedback expand recovery incompleto bloquea CP-N4-B; retro + self-check monto vs falta de export |
| S45-T4-B-E2 | Feedback expand MISSING export; retro replace: FREEZE automático vs COST_OWNER_REVIEW |

### Explicit non-goals (honored)

- No canonical output or assert edits (24 weDo outputs + 8 iDo outputs verified present).
- No DEFECT / fixture / starter logic changes.
- No theory, selfCheck, resources, or id `iac` edits.
- No youDo starter/rubric rewrite (R2 score A).
- No structural E1→E2→E3 rewrite; fade and containment tokens preserved.
- Instruction E3 left telegráfica (optional P2; transfer-tolerant).
- E1 units scored A left untouched (T1-A/B-E1, T2-A/B-E1, T3-A/B-E1, T4-A-E1; T4-B-E3 A; youDo A).

## Code/output integrity

| Area | Action |
|------|--------|
| All demo / `solutionCode.output` | **Unchanged** |
| Starter `# DEFECT:` + fixtures CASO-IQU-045-* | **Unchanged** |
| You Do starter / rubric / retrospective | **Unchanged** |
| `instruction` / `title` / `why` | **Unchanged** (except iDo preambles where listed) |

## Validation

- Pedagogical strings touched: **~28** units (7 iDo + ~21 weDo fields across feedback/retro; some units both).
- Self-check `Pregunta:` present across expanded iDo retros T1-B…T4-B and key weDo E2/E3 retros.
- All expected weDo solution outputs present (script check).
- `npx tsc --noEmit`: clean (exit 0).
- No generators used; prose hand-written with subtema-specific anchors.

## Residual after Fix R2

- Instruction E3 word counts remain short by design (transfer); optional only if a future review reopens.
- Some E1 retros still ~20–30 w (R2 marked none required) — not expanded to avoid mechanical “alargar todo”.
- Vocabulary Master (VT, RPO/RTO, DLQ, least privilege) unchanged and consistent with theory.

**Verdict:** Section 45 exercise pedagogy P2 polish applied by hand. Learner-ready; no integrity gaps.

Section 45 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
