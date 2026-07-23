# DONE — S22 Email, identidad y aprobación humana

**File:** `src/lib/course/sections/s22-rapidfuzz-entity.ts`  
**Platform id preserved:** `rapidfuzz-entity`  
**Order:** reverse walk S22 → S21 → S20 → S19 → S18  

## Before → after (content metrics)

| Metric | Before (residual) | After |
|--------|-------------------|--------|
| avg_para | ~119.4 | **~425.0** |
| thin_para_ratio (<120) | ~0.11 | **0.0** |
| avg_instr | ~85.0 | **~301.9** |
| selfcheck_q | 4 | **5** |
| kb | ~49.3 | **~65.9** |
| tier target | partial (score 7) | **gold bar** (depth ≥ S16/S17) |

## What changed
- Theory: 9 blocks × 3 paragraphs — MIME, sanitización HTML, OAuth scopes mínimos, drafts/expiración, resolución de destinatarios, CC/BCC y mínima divulgación, state machine de aprobación, idempotencia y audit log.
- weDo: 24 instructions expanded (E1/E2/E3) with concept, fixture id, I/O contract, exact pass string.
- Starters: thin scaffolds enriched from solution fixtures + single TODO; solutions/oracles preserved.
- selfCheck: 5th MCQ on governance/operational criterion.
- Capstone framing: **inicio CP-N2-C**; fail-closed / synthetic-only / no untaught APIs.
- Progressive disclosure: email.mime, html.escape, hashlib, datetime (stdlib); adaptadores sandbox de draft — sin SMTP real ni RapidFuzz avanzado.

## Research
See `S22_RESEARCH.md`.

## Verification
- Imports via `tsx` OK; structure 9 theory / 8 iDo / 24 weDo / youDo / 5 selfCheck.
- `tsc --noEmit` clean for section modules path.
- Metrics meet avg_para≥250, avg_instr≥150, thin_para_ratio≤0.2.
