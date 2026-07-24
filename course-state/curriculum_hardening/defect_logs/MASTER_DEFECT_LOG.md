# Master defect log — analyze, RCA, fix, Playwright live flow

Generated: 2026-07-24

## Executive summary

| Class | Status | Notes |
|-------|--------|-------|
| TypeScript compile | **PASS** | `tsc --noEmit` clean |
| V3 structure/invariant/counts | **PASS** | 52 sections, 8 demos, 24 exercises structure |
| Course-complete gate | **PASS** | 1248 exercises, 416 demos, course_complete true |
| Adversarial suite | **PASS** | 71 OK, 1 skipped |
| Interaction catalog | **FIXED → PASS** | was 1080 exercises / ok:false → 1248 / ok:true |
| Section nav e2e | **FIXED → PASS** | aria/testid drift; 52/52 tabs |
| Demos+exercises e2e | **PASS** | all 4 shards × 13 = 52 sections |
| Mouse/keyboard flow | **FIXED → PASS** | Next.js dev overlay intercept; 4/4 |

**Pedagogical “DEFECT” markers in weDo starters** (NotImplementedError / CASO DEFECT) are **intentional** wrong-but-runnable scaffolds — not product bugs. Do not “fix” by implementing solutions into starters.

---

## DEFECT-001 — Catalog exercise undercount (1080 vs 1248)

### Symptom
`npm run test:e2e-max:catalog` → `ok: false`, exercises **1080**.

### Root cause
`export_interaction_catalog.mjs` weDo boundary regex required **exactly two spaces** before `youDo:`. S16–S21 and S36 use **single-space** top-level keys → weDo parse empty → 0 exercises × 7 sections = 168 missing (1248−168=1080).

### Why other gates still passed
`course_complete_gate.py` counts exercises via different structure checks, not this regex.

### Fix
```js
/weDo:\s*\{([\s\S]*?)\n[ \t]*youDo\s*:/
```

### Side effects / integration
- Unblocks e2e demos/exercises for S16–S21, S36.
- No curriculum content change.
- Risk of early cut on nested `youDo` string: not present in weDo bodies.

### Validation
Catalog ok:true, exercises 1248, demos 416.

---

## DEFECT-002 — Section prev/next not found in Playwright

### Symptom
`02_sections_tabs_52.spec.ts` failed after successful tab checks on every section: missing `button[aria-label="Sección anterior"]`.

### Root cause
- UI: `aria-label={tr('course.previousSection')}` → **"Anterior"** / **"Siguiente"** (i18n).
- Test: hard-coded **"Sección anterior"** / **"Sección siguiente"** (stale after HUD FAB redesign).

### Fix
1. i18n PE/ES → descriptive **Sección anterior/siguiente**; EN → Previous/Next section (WCAG: name the control).
2. `data-testid="section-prev|section-next"` on FABs.
3. E2E uses testids.

### Side effects
- Screen-reader labels clearer; visible FAB UI still icon-only.
- Dashboard hard-coded “Siguiente” text unchanged (different control).

### Validation
52/52 section×tab tests passed (~6.9m).

---

## DEFECT-003 — FAB click blocked by Next.js dev overlay

### Symptom
Mouse/keyboard flow S01: `section-prev` visible but click timeout; `nextjs-portal` intercepts pointer events.

### Root cause
`npm run dev` injects Next.js dev portal overlay covering fixed bottom FABs. **Production build does not include this portal.**

### Fix
In e2e: disable pointer-events on `nextjs-portal` + `click({ force: true })` on FABs; Escape first.

### Side effects
- Tests remain deterministic under dev server.
- No production UI change required.
- Alternative future: run e2e against `build:static`/`start` only.

### Validation
`13_mouse_keyboard_lesson_flow.spec.ts` → **4 passed**.

---

## Non-defects (explicit)

| Finding | Decision |
|---------|----------|
| 2152× `DEFECT` strings in section TS | Intentional CASO-LIM wrong starters |
| `raise NotImplementedError` in weDo | Intentional learner fix target |
| 5 orphan section files (s07-pandas, etc.) | Not imported; non-learner legacy — leave quarantine-style isolation |
| Single-space indent S16–S21/S36 | Style debt only; fixed at catalog boundary |

---

## Playwright live coverage (mouse/keyboard)

| Suite | Result |
|-------|--------|
| 01 chrome pages | 3 passed |
| 02 sections × 5 tabs × 52 | 52 passed |
| 03 demos+exercises shards 0–3 | 13×4 = 52 passed |
| 13 mouse/keyboard flow | 4 passed (retry) |

Logs: `course-state/curriculum_hardening/defect_logs/` and SCRATCH `defect_logs/`.

---

## Files changed

- `scripts/export_interaction_catalog.mjs` — weDo parse whitespace
- `src/lib/i18n.ts` — descriptive section nav aria labels
- `src/components/course/SectionView.tsx` — data-testids on FABs
- `scripts/e2e_max/02_sections_tabs_52.spec.ts` — testids
- `scripts/e2e_max/13_mouse_keyboard_lesson_flow.spec.ts` — new exhaustive mouse/keyboard flow + portal harden
