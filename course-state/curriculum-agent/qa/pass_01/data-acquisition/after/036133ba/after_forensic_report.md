# S07 after-fix forensic report — `036133ba`

## Admissible capture

`capture_003` is the successful zero-retry capture against the optimized local production server at exact candidate `036133ba`. `capture_001` failed because Chromium could not start inside the filesystem sandbox; `capture_002` failed closed on missing local NextAuth configuration. Both failed capture IDs remain preserved and are not credited.

Playwright produced 2/2 passing journeys: desktop 1440×1000 and narrow/mobile 390×844. Each journey opened all five tabs and required a visible, nonempty active panel. Lossless PNG tiles cover each complete document with hashes recorded in the viewport manifests.

## Geometry and runtime evidence

| Viewport | Theory | Yo hago | Hacemos juntos | Tú haces | Autocheck |
|---|---:|---:|---:|---:|---:|
| Desktop body height / tiles | 10,889 / 11 | 10,005 / 11 | 27,975 / 28 | 3,463 / 4 | 4,410 / 5 |
| Mobile body height / tiles | 17,963 / 22 | 17,377 / 21 | 44,009 / 53 | 5,917 / 8 | 5,702 / 7 |

For every tab, document width equals viewport width (1440/1440 or 390/390). The deterministic DOM review found zero overflow elements and zero fixed-control obstructions. Both viewport manifests record zero console errors and zero uncaught page errors.

## Forensic content review

The Theory tab retains the learner-facing sequence from the ordinary problem of visually identical text through Unicode representation, normalization, string operations, regex, token similarity, and evidence-aware decisions. The repaired first Unicode block now visibly says one code-point box for composed `é` and two for decomposed `e` plus combining mark. Its dark code panel defines `code_points`, prints the exact sequences `['U+00E9']` and `['U+0065', 'U+0301']`, and then demonstrates equality after NFC. The output is adjacent to the code, so the invisible distinction is exposed before guided or independent use.

At desktop width the lesson sidebar, top navigation, heading, paragraphs, code panel, output panel, callout, and floating previous/next/feedback controls remain separated. Text and code are legible; the repaired lines do not collide with the copy control or output. At mobile width the prose wraps within the 390-pixel document. The code panel intentionally scrolls horizontally inside its own bounded region; it does not widen the document. Fixed circular controls remain outside the content column and do not cover the repaired paragraph or code/output block.

The Tú haces tab renders the clarified five-field contract—`raw`, `normalized`, `transforms`, `status`, and `review_reasons`—in the objective, requirements, and starter comments. The change adds the location of required review evidence without revealing an implementation. The other tabs preserve their established card hierarchy, code/output contrast, exercise controls, quiz options, and section navigation.

## Before/after decision

The authoritative before capture `capture_002` at `9cb849cb` is valid only for the pre-fix state. The expected deltas are confined to the first Unicode prediction/worked example and the independent return contract. The after metrics remain width-safe and error-free. No unexplained layout, clipping, overlap, navigation, or answer-visibility regression was found in the captured initial states.

Static screenshots do not prove keyboard order, screen-reader reading order, glossary tap/Escape behavior, attempt sealing, hidden client-payload secrecy, or learner fatigue across the 44,009-pixel mobile guided-practice page. These remain registered limitations rather than inferred passes.

## Visual-aid decision

`VISUAL_AID_NOT_REQUIRED`. Two independent epistemic learners already formed and applied the composed-versus-combining-mark mental model, including diagnosing the corrupted pre-fix starter. The repaired worked example now makes the exact U+ relationship visible in text, code, and output before practice. A responsive diagram is optional P3 enrichment, but is not an evidence-backed material repair in this pass.
