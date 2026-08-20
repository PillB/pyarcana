# S05 pre-analysis rendered forensics

- Outer pass: `01`
- Active section: `oop` — S05, “Funciones, contratos y descomposición”
- Tested source SHA: `35ee837f`
- Capture: `capture_001`
- Runtime: optimized local production build, with a local-only authentication fixture
- Viewports: desktop `1440×1000`; mobile `390×844`
- Tabs captured in both viewports: `theory`, `ido`, `wedo`, `youdo`, `quiz`

## Deterministic layout result

All ten rendered tab captures passed. Desktop remained exactly `1440/1440` CSS pixels and mobile `390/390`; the forensic gate found zero learner-visible horizontal-overflow elements, zero intersections between fixed HUD controls and lesson text/code/tables/headings, zero browser-console errors, and zero page errors. The mobile header uses the compact signed-out icon and stays within the 390 px viewport. Floating previous/next/feedback controls remain in the reserved side gutters rather than covering lesson content.

## Learner-visible frame

The persistent frame identifies “Sección 5 · Funciones & Contratos”, shows the five tabs in the expected I/We/You progression, retains the left course outline on desktop, and collapses navigation appropriately on mobile. Section identity, progress, project/familiarity/plan/glossary/repository entry points, previous/next controls, feedback control, and the signed-out entry control are present without obscuring the active material.

## Tab-by-tab content inspection

### Teoría

The tab begins with an explicit bridge from S04’s data traversal to named, bounded decisions. Before independent work it presents a section dictionary for function, `return`, contract, safe default, pure function, idempotence, thin orchestrator, LEGB, and keyword-only parameters. It then fixes the laboratory policies for four synthetic-data normalizers. Long-form explanations alternate with dark, syntax-highlighted code/output blocks and misconception callouts; the closing “Pruébalo tú mismo” playground supplies Reset/Run controls and an editable code area. Copy controls remain attached to their respective code blocks. Desktop preserves a readable central column; the tall mobile rendering wraps prose and contains code within its own horizontally scrollable/clipped block rather than widening the page.

### Yo hago

The guided demonstrations explicitly ask the learner to predict, trace values, execute, and explain the line that satisfies each promise. The sequence proceeds from `def`/`return` through mutable defaults, scope, keyword-only calls, docstrings/contracts, pure orchestration, idempotence, and safe refactoring. Each demonstration pairs explanatory prose with executable code and observed output, maintaining visual distinction between prediction prompts, code, output, and misconception feedback. No text or controls are clipped by the viewport or fixed navigation.

### Hacemos juntos

The guided-practice tab states its scaffold progression and renders 24 exercises with context, goal, exact success criterion, limits, ordered steps, and two optional hints. Exercise cards remain visually separated and their controls remain reachable. The substantial page height is expected from the exercise count; neither desktop nor mobile shows card overlap, truncation, or page-level horizontal overflow.

### Tú haces

The portfolio project card clearly names “Normalizadores puros (inicio CP-N1-B)”. It separates context, objectives, technical requirements, starter code, documentation expectations, post-project explanation prompts, and the weighted evaluation rubric. The starter deliberately contains `NotImplementedError` fill-in points and labels them as the contract the learner must repair, so they are intentional exercise blanks rather than production placeholders. On desktop the full code block, rubric, completion action, and footer remain unobstructed; on mobile they stack within the viewport with code contained inside the code panel.

### Autocheck

The self-check renders eight distinct questions covering `return`, mutable defaults, purity, LEGB, idempotence, docstrings, keyword-only parameters, and thin orchestration. Options and action controls are visually separated and remain inside both viewports. The capture did not reveal layout overlap or overflow; answer correctness and solution-boundary behavior remain semantic/deterministic-review concerns rather than screenshot conclusions.

## Visual-aid decision before semantic review

`VISUAL_AID_NOT_NEEDED` at this checkpoint. The section teaches abstract program relationships through short executable code, explicit input/output traces, prediction prompts, and a concrete normalizer pipeline. A decorative screenshot would not improve that mental model. A diagram should be reconsidered only if both constrained learners show the same difficulty tracing caller → function → returned value or normalizer → thin orchestrator; any accepted diagram would need equivalent nearby text and desktop/mobile accessibility checks.

## Gate decision

The rendered pre-analysis baseline is visually and structurally green, so the S05 constrained semantic learner review may proceed. This result is local production evidence for SHA `35ee837f`; it is not live GitHub Pages evidence and does not certify curriculum correctness.
