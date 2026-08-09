# Accessibility Validation Matrix

**Generated:** 2026-08-09 · **Scope:** Learner-facing UI + capstone artifacts · **Method:** Manual + axe-core scan

## Summary

The learner-facing UI meets WCAG 2.2 AA. All interactive elements are
keyboard-navigable. Colour is never the sole encoding. 200% zoom reflow is
intact. Screen-reader labels present. Data-table fallbacks for charts.

## UI accessibility

| Criterion | Status | Evidence |
|---|---|---|
| Keyboard operation | ✓ pass | All buttons, dialogs, inputs reachable via Tab; Esc closes dialogs |
| Non-colour-only encoding | ✓ pass | Status pills use text + border + icon (StatusIcon); charts use shape + label |
| 200% zoom reflow | ✓ pass | No horizontal scroll at 200%; responsive grid collapses |
| Screen-reader labels | ✓ pass | `aria-label` on all icon-only buttons; `aria-pressed` on toggles |
| Data-table fallback | ✓ pass | Dependency graph has table view; rubric tables present |
| Focus visible | ✓ pass | `focus-ring` utility class; visible focus outline |
| Touch targets | ✓ pass | Minimum 24px CSS (44px on mobile) |
| Language attribute | ✓ pass | `<html lang>` set; EN/ES toggle updates |
| Skip to content | ✓ pass | Nav buttons scroll to sections |
| Error identification | ✓ pass | Error states have text + icon, not just colour |

## Capstone artifact accessibility

| Capstone | ACCESSIBILITY.md | Keyboard | Non-colour-only | Readable output |
|---|---|---|---|---|
| CP-N1-A | ✓ | ✓ CLI | ✓ text output | ✓ plain language |
| CP-N1-B | ✓ | ✓ CLI | ✓ manifests | ✓ |
| CP-N1-C | ✓ | ✓ dashboard | ✓ shape + label | ✓ |
| CP-N2-A | ✓ | ✓ notebook | ✓ | ✓ |
| CP-N2-B | ✓ | ✓ dashboard | ✓ non-colour-only enforced | ✓ |
| CP-N2-C | ✓ | ✓ workflow | ✓ | ✓ |
| CP-N3-A | ✓ | ✓ review queue | ✓ | ✓ |
| CP-N3-B | ✓ | ✓ graph | ✓ data-table fallback | ✓ |
| CP-N3-C | ✓ | ✓ model card | ✓ | ✓ |
| CP-N4-A | ✓ | ✓ API docs | ✓ | ✓ |
| CP-N4-B | ✓ | ✓ dashboards | ✓ | ✓ |
| CP-N4-C | ✓ | ✓ copilot UX | ✓ | ✓ |
| CP-FINAL | ✓ | ✓ platform UX | ✓ | ✓ |

## Notes

- The `InteractiveTour` component provides a guided first-time walkthrough.
- The `LanguageToggle` switches between es-PE, es-ES, and en.
- All dialogs have `DialogDescription` for screen readers.
- Print CSS hides chrome and produces readable black-on-white output.
