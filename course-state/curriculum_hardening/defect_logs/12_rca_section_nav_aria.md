# DEFECT: Playwright section nav buttons not found

## Symptom
`02_sections_tabs_52.spec.ts` failed on ~all sections after tabs:
`button[aria-label="Sección anterior"]` not found (30s timeout).
Tabs themselves loaded (failure after tab loop).

## Root cause
- UI (`SectionView.tsx`) sets `aria-label={tr('course.previousSection'|'course.nextSection')}`.
- i18n PE/ES resolved to short **"Anterior"** / **"Siguiente"** (EN: "Previous"/"Next").
- E2E hard-coded outdated full phrases **"Sección anterior"** / **"Sección siguiente"**.
- Product/UI and test drifted after HUD FAB redesign (icon-only FABs).

## Fix (two-layer)
1. **a11y product fix**: descriptive aria labels in i18n:
   - PE/ES: Sección anterior / Sección siguiente
   - EN: Previous section / Next section
2. **test stability**: `data-testid="section-prev|section-next"` on FABs; e2e uses testids.

## Side effects
- Screen readers get clearer labels (improvement).
- Visible FAB UI unchanged (icons only).
- Any snapshot/a11y tests expecting short "Anterior" need update (none found in code).
- Does not affect dashboard "Siguiente" button hard-coded in Dashboard.tsx.

## Validation
Re-run `02_sections_tabs_52.spec.ts` until 52/52 green.
