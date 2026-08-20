# S04 pre-analysis UI repair — after screenshot forensics

Exact application candidate: `99380683`

Optimized production build URL: `http://127.0.0.1:3000/#functions-modules`

Authoritative green capture: `capture_003`

## Validation history

- Candidate `65fc7cf5` removed the 42-pixel page overflow by converting the signed-out mobile authentication control to a 44×44 icon button with the accessible name `Entrar`; the full text remains visible from the `sm` breakpoint upward.
- Earlier after-captures are preserved locally as RED evidence. They exposed development-server page errors, missing production `NEXTAUTH_SECRET` fixture configuration, and genuine fixed-control/content intersections.
- Candidate `99380683` adds explicit safe gutters around lesson-tab content while preserving the full-width section header and tab strip. It was built with the optimized production command before the authoritative capture.
- `capture_003` ran with local-only authentication fixture configuration. Both zero-retry Playwright tests passed.

## Exact forensic results

| Viewport | Tabs captured | Maximum document width | Horizontal-overflow elements | Fixed-control obstructions | Console errors | Page errors |
|---|---:|---:|---:|---:|---:|---:|
| desktop 1440×1000 | 5 | 1440 | 0 | 0 | 0 | 0 |
| mobile 390×844 | 5 | 390 | 0 | 0 | 0 | 0 |

All ten screenshot files are SHA-256-bound in their viewport manifests. The authoritative capture occupies approximately 8.4 MB locally and is retained under the section/pass/candidate path rather than silently replacing earlier captures.

## Before/after visual comparison

The desktop wordmark, sidebar, numbered section navigation, S04 title, progress controls, metadata, tab order, typography, colors, callout hierarchy, code syntax coloring, code/output ordering, exercise cards, portfolio rubric and eight-question quiz remain materially unchanged. The desktop lesson column is slightly narrower on the right, creating a clear gutter for the feedback control; no text or code is truncated because code panes retain intentional internal horizontal scrolling.

On mobile, the prior header ended at x=431.92 in a 390-pixel viewport and clipped the `Entrar` button. The after screenshots show a compact green sparkle icon with the accessible name `Entrar`; the entire header now fits within 390 pixels. The section badge, truncated title, progress ring, job/outcome controls and five icon tabs remain visible in their original order.

The theory and demonstration pages retain readable paragraph/callout rhythm and dark code panes. The exercise sequence retains distinct cards and solution controls. The portfolio page retains its context, objectives, requirements, starter code, guidance and rubric. The quiz retains eight unselected four-option questions and the disabled `Enviar respuestas (0/8)` boundary. No answer content appears before interaction.

The lesson body now keeps a 48-pixel safe gutter beside each fixed mobile navigation control. Text, tables, code cards and assessment options no longer sit underneath the previous/next or feedback controls. The narrower mobile text measure is still legible; code remains scrollable inside its own pane. Touch controls remain at least 44×44 pixels.

## Content and visual-aid judgment at this checkpoint

This UI repair changes no learner-facing curriculum prose, exercise answer, code example, assessment key or section ordering. No new screenshot, image or diagram has yet been accepted for S04 curriculum content: semantic learner/Supervisor review follows this pre-analysis gate. The captured UI screenshots are audit evidence, not learner-facing media.

## Gate decision

`UX-P1-MOBILE-HEADER-OVERFLOW` and the associated fixed-control obstruction are GREEN locally for exact application candidate `99380683`. Push is permitted after the evidence report and ledger transition are committed. Merge, deployment and live screenshot parity remain independently gated.
