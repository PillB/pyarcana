# S05 post-fix rendered forensics

- Outer pass: `01`
- Section: `oop` — S05, “Funciones, contratos y descomposición”
- Exact tested source SHA: `3612a4ec`
- Optimized build: `npm run build` passed
- Capture: `capture_001`
- Viewports: desktop `1440×1000`; mobile `390×844`
- Result: `2 passed (32.1s)`

## RED evidence addressed

The pre-fix single-image approach was not trustworthy for this unusually tall section. Mobile “Hacemos juntos” was 43,458 CSS pixels high and its JPEG dimensions wrapped in downstream tooling; the desktop quiz JPEG appeared blank even though the DOM forensic record contained eight questions. An intermediate document-coordinate clipping attempt also failed closed with “Clipped area is either empty or outside the resulting image.” None of those captures counts as GREEN evidence.

## GREEN capture design

The final gate first requires the active tab panel to be visible, nonempty, and contain learner-visible text. It then scrolls through the real viewport and saves lossless PNG tiles, each with its own SHA-256, declared coverage range, and actual scroll position. The sum of declared tile coverage must equal the complete rendered body height.

Desktop coverage: theory `12,959 px / 13 tiles`; Yo hago `9,623 / 10`; Hacemos juntos `28,031 / 29`; Tú haces `4,312 / 5`; Autocheck `3,662 / 4`.

Mobile coverage: theory `21,163 px / 26 tiles`; Yo hago `17,973 / 22`; Hacemos juntos `43,458 / 52`; Tú haces `6,763 / 9`; Autocheck `4,682 / 6`.

Every coverage sum equals its body height. Desktop remained `1440/1440` and mobile `390/390`; all tabs recorded zero horizontal-overflow elements, zero fixed-control obstructions, zero console errors, and zero page errors.

## Forensic visual inspection

The desktop Autocheck tiles now visibly show the question cards and choices rather than a blank raster. The mobile guided-practice tiles visibly preserve card boundaries, ordered task steps, hint panels, readable inline code, and the reserved gutters around previous/next/feedback controls. The compact mobile header remains inside 390 px. Code stays inside its dark code surface; prose and assessment controls wrap rather than widening the page.

The playground textarea is now exposed as “Editor de código Python”. The S05-visible `pipeline` hint now reads “Serie ordenada de pasos: la salida de un paso pasa al siguiente hasta producir el resultado,” removing premature references to models, data leakage, and scikit-learn while retaining a useful local micro-definition.

## Content and visual-aid conclusion

No S05 lesson prose, exercise, key, or expected output was changed. Both admissible epistemic learners solved 25/25 exercises and eight self-checks with no unclear concepts or blockers. `VISUAL_AID_NOT_REQUIRED`: existing executable traces support the relational mental models. A compact accessible flow diagram remains optional P3 only; it is not an evidence-backed requirement in this pass.

## Gate decision

Local optimized rendering for exact SHA `3612a4ec` is GREEN. S05 is not fully verified: the two realistic-student attempts are inadmissible because no execution receipts exist, and live GitHub Pages validation cannot occur until an authorized merge/deployment exposes the tested revision.
