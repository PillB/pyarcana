# S04 pre-analysis screenshot forensics

Candidate application SHA: `cd2a1326`

Rendered route: `#functions-modules`

Displayed section: `S4 · Iteración y resúmenes transaccionales`
Viewports: desktop `1440×1000`; mobile `390×844`

## Capture integrity

- `capture_001` is preserved RED evidence: the initial harness expected a nonexistent `selfcheck` test ID instead of the rendered `quiz` tab.
- `capture_002` covered all five desktop tabs and exposed document-level mobile overflow (`scrollWidth=432` with a `390`-pixel viewport).
- `capture_003` corrected the tab contract and localized the mobile overflow to the top-header authentication cluster.

## Desktop forensic description

The persistent desktop frame contains the PyArcana wordmark, course subtitle, left navigation with numbered sections and five S04 substeps, top navigation, section badge, title, progress ring, job-relevance control, learning-outcomes control, five-tab strip, feedback button and previous/next floating navigation. No header, sidebar, tab or floating-control overlap is visible at `1440×1000`.

### Theory

The page begins with `Teoría`, followed by the section map and an extended narrative about iteration, sentinels, counters, rates and transactional summaries. Eight instructional blocks alternate readable paragraphs, dark syntax-highlighted Python panes, explicit output panes, and colored callouts. The visible examples cover `for`, `range`, `enumerate`, strict alignment, `while`, `break`, `continue`, counters, comprehensions, complexity and an integrated playground. Code panes retain whitespace and copy controls. The full-page screenshot is very long but the hierarchy remains continuous; no card or prose collision is visible.

### Yo hago

Eight numbered demonstration cards use a stable sequence: contextual explanation, prediction prompt, code/output, misconception note and green retrospective. Card borders, headings and code panes remain aligned. The instructional sequence visibly moves from loop basics through counters and transaction-safe summaries. No solution or unrelated learner answer is exposed.

### Hacemos juntos

The rendered page contains 24 exercise cards. Each card visibly separates context/meta/limits, learner instruction, starter code, hints/feedback controls and the solution-reveal boundary. The page is exceptionally long but card boundaries remain distinct and controls are consistently positioned. Before interaction, expected solution content is not visibly rendered.

### Tú haces

The portfolio card is titled `Client Intake & Data Quality Script (cierre CP-N1-A)`. It visibly contains context, five objectives, auditable requirements, a dark `starter.py` pane, portfolio guidance, consolidation guidance and a six-row weighted rubric. The starter retains intentional classified TODOs. The final submission button is separate from the rubric and is not occluded by floating navigation.

### Autocheck

Eight question cards are rendered with four labeled options each. The introductory retrieval-practice callout, disabled `Enviar respuestas (0/8)` action and question ordering are visible. No correct answer, explanation or selected state is leaked before an attempt.

Desktop element inventory across the five tabs:

| Tab | Headings | Paragraph/list elements | Controls | Images/SVG/canvas | Code/pre elements |
|---|---:|---:|---:|---:|---:|
| theory | 2 | 38 | 18 | 25 | 102 |
| ido | 1 | 25 | 10 | 35 | 89 |
| wedo | 1 | 247 | 63 | 123 | 275 |
| youdo | 2 | 14 | 2 | 12 | 9 |
| quiz | 1 | 8 | 33 | 3 | 0 |

## Mobile forensic failure

At `390×844`, the section body, tabs and theory prose wrap legibly, and dark code panes are visually clipped within their intended horizontal-scroll containers. However, the page itself is 432 pixels wide. The top-right header group extends beyond the viewport:

- containing header cluster: `x=141.64`, width `290.28`, right edge `431.92`;
- `Entrar` button: `x=349.64`, width `82.28`, right edge `431.92`.

The right portion of the green `Entrar` control is visibly cut off. This creates horizontal page scrolling and makes a primary authentication action partially inaccessible. The defect is global rather than S04 prose-specific.

## Decision

- Accepted issue: compact the signed-out mobile authentication control while preserving the full desktop label and an accessible name.
- Visual-aid decision for the section is deferred until semantic review; the baseline itself contains no learner-facing image or diagram whose absence has yet been demonstrated as a learning defect.
- Push is blocked until an immutable after-capture shows `scrollWidth <= viewportWidth`, all five tabs render at both viewports, and no new console/page error appears.
