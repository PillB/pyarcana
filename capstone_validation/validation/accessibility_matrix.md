# Accessibility matrix

> Governing spec Section 10 (Accessibility) and Section 13 (Harness Artifacts /
> Validation).
> Source of truth: `src/app/page.tsx` (UI), `src/data/levels.ts`
> (per-capstone `accessibilityRequirements`), `src/data/rubrics.ts`
> (`AC` critical criterion for CP-N2-B; `COMMON_CRITICAL_FAILURES` includes
> *"Inaccessible core workflow (no keyboard operation, colour-only encoding)"*).

## 1. Keyboard operation

- All interactive primitives (buttons, dialogs, accordions, tabs, dropdowns,
  tooltips) come from `shadcn/ui`, which wraps Radix UI — keyboard-operable by
  default (Tab / Shift+Tab / Enter / Space / Esc / Arrow keys).
- The N4-C harness dialog and the CP-FINAL integration dialog are operable
  without a pointer: open with Enter, navigate with Tab, approve with Enter,
  close with Esc.
- The sections grid and the badges grid are focusable tiles; each tile's
  interactive element is reachable in tab order.

## 2. 200%-zoom reflow

- The page uses Tailwind responsive grids: `md:grid-cols-3`, `lg:grid-cols-3`,
  `md:grid-cols-2`, `md:grid-cols-4`.
- At 200% zoom (effectively halving the viewport width), the grids collapse to
  one column, and all text remains legible (no horizontal scroll on the main
  content).
- The sticky header's nav buttons wrap gracefully (flex-wrap on small viewports).

## 3. Non-colour-only encoding

- The `Pill` component renders a **text label plus a border** in addition to its
  colour, so status is never conveyed by colour alone. Examples:
  - `CP-FINAL · S52` Pill uses a `warn` variant with text.
  - Level pills `L1`–`L4` carry the level number as text.
  - Principal-gate pills carry the section ID (e.g. `S04`) as text plus a Flag
    icon.
- Status icons (`CheckCircle2`, `XCircle`, `AlertTriangle`, `Lock`) accompany
  status text — never colour alone.

## 4. EN/ES parity

- Every visible string is keyed through `STRINGS[lang][key]` in
  `src/data/i18n.ts`. The `useLang()` hook flips `lang` between `"en"` and
  `"es"` via a single toggle button.
- Every `LEVELS[*]` has both `name` and `spanishName`.
- Every `SECTIONS[*]` has both `title` and `spanishTitle`.
- Every `BADGES[*]` has both `name` and `spanishName`.
- The disclaimer is rendered verbatim in both languages.

## 5. Screen-reader labels

- The sticky header's nav buttons use visible text labels (Levels, Capstones,
  Sections, Invariant, EN/ES toggle).
- Icons paired with text (GraduationCap + appName, Globe + languageToggle,
  Crown + finalCapstone).
- Dialog titles use `DialogTitle`, content uses `DialogDescription` — Radix
  wires ARIA roles automatically.
- Tooltip primitives (`Tooltip`, `TooltipContent`, `TooltipTrigger`) provide
  accessible descriptions where icon-only buttons are used.

## 6. Data-table fallbacks for traces

- The N4-C harness dialog surfaces the redacted trace as a monospace block with
  line breaks; the same data is also exposed as structured fields
  (`retrieval[]`, `proposedTool`, `verifier`, `budget`) so an assistive
  technology can read them as labelled rows rather than as a flat code block.
- The CP-FINAL integration dialog lists the 12 interfaces as labelled rows
  (`capstoneId` + `interfaceName`) rather than as a colour-coded matrix.

## 7. Per-capstone accessibility requirements

- CP-N2-B has a critical `AC` rubric criterion (*Accessibility — keyboard,
  non-colour-only, 200% zoom*). The capstone's `accessibilityRequirements`
  explicitly requires the same.
- CP-N4-C's `accessibilityRequirements` requires *Accessible UX (keyboard,
  200%-zoom, screen-reader labels)* and *Data-table fallbacks for traces*.
- `COMMON_CRITICAL_FAILURES` includes *"Inaccessible core workflow (no keyboard
  operation, colour-only encoding)"* — automatic fail for every capstone.
