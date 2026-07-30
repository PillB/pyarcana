# Learner UI inventory — `/` route

> Governing spec Section 13 — Harness Artifacts / Reality.
> Mirrors `src/app/page.tsx`. The TSX is canonical; this is an inventory of the
> rendered UI regions.

The learner-facing page (`src/app/page.tsx`, Next.js 16 client component) renders
the following regions, top to bottom:

## 1. Sticky header
- App name + tagline (i18n-keyed).
- In-page navigation buttons: Levels · Capstones · Sections · Invariant.
- **EN/ES language toggle** (single button flips `lang` between `"en"` and `"es"`).

## 2. Hero section
- Page title: *PyArcana Capstones*.
- Tagline.
- Amber-tinted **level disclaimer** callout (the curricular-not-workplace
  disclaimer from `LEVELS[*].disclaimer`).

## 3. Cardinality invariant panel (`#invariant`)
- Five stat cards: levels (4) · principal capstones per level (3) · principal
  capstones (12) · final capstones (1) · **total (13)**.
- N4-D decision note: *folded into CP-N4-C*.
- Three sub-gate cards for `CP-N4-C.1 / .2 / .3` (S49 / S50 / S51).

## 4. Four level sections (`#levels`), each containing:
- Level pill (`L1`…`L4`) + learner-facing name (EN/ES).
- Section range (e.g. `S01–S13`) and Dreyfus mapping.
- Principal-gate pills (`S04 S08 S13`, etc.).
- Collapsible **Exit capabilities** list.
- **3 capstone cards** (`#capstones` grid, `md:grid-cols-3`) — each card opens a
  detail dialog (brief, prerequisites, dataset, I-Do/We-Do/You-Do, assessment,
  rubric, evidence, remediation, security).

## 5. Final capstone block
- `CP-FINAL · S52` card with a violet emphasis frame.
- Side-by-side panel listing the **12 final-integration interfaces** from
  `FINAL_INTERFACES` (each row: capstoneId + interfaceName).

## 6. Sections mapping grid (`#sections`)
- All **52 canonical sections** S01–S52 in a responsive grid.
- Each tile: sectionId, capstoneId, EN/ES title, artifactAdded (line-clamped).

## 7. Badges grid (`#badges`)
- All **13 badges** with lucide icon, name (EN/ES), id, capstone id, description.

## 8. N4-C interactive harness dialog
- Triggered from the `CP-N4-C` capstone card.
- Lets the learner pick a **provider mode** (`no-key` / `local` /
  `commercial-test` / `commercial-approved`), enter a task, and run the harness.
- Surfaces retrieval hits, proposed tool, **approval gate** (must be clicked for
  sensitive side effects), verifier result, **budget meter**, **redacted OTel
  trace**, and **cited output**.
- Calls `runCopilotHarness()` from `src/lib/copilot-harness.ts` (synchronous
  deterministic path; no network in the demo).

## 9. CP-FINAL integration dialog
- Triggered from the `CP-FINAL` card.
- Shows the **12 upstream dependencies**, the **versioned interface contracts**,
  the **rollback drill** requirement and the **personal contribution statement**
  requirement.

## 10. Sticky footer
- Footer note (i18n) + app name + year.

## Accessibility affordances

- Keyboard-operable dialogs and accordions (shadcn/ui primitives).
- Status pills use **text + border**, not colour alone (Pills carry a label).
- 200%-zoom reflow is supported by the responsive grid.
- Data-table fallbacks for traces (harness dialog).
- EN/ES parity across every visible string (`src/data/i18n.ts`).
