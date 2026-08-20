# S07 pre-analysis rendered forensics

- Outer pass: `01`
- Active section: `data-acquisition` — S07, “Texto, Unicode y expresiones regulares”
- Exact source SHA: `9cb849cb`
- Authoritative capture: `capture_002` (`capture_001` was interrupted and is retained but inadmissible)
- Viewports: desktop `1440×1000`; mobile `390×844`
- Result: `2 passed (27.2s)`

## Deterministic layout and coverage

All five tabs were captured in lossless viewport tiles. Desktop coverage was theory `10,750 px/11 tiles`, Yo hago `10,005/11`, Hacemos juntos `27,975/28`, Tú haces `3,415/4`, and Autocheck `4,410/5`. Mobile coverage was theory `17,800/22`, Yo hago `17,377/21`, Hacemos juntos `44,009/53`, Tú haces `5,794/7`, and Autocheck `5,702/7`.

Every coverage sum equals the rendered body height. Desktop remained `1440/1440` and mobile `390/390`. The gate found zero learner-visible horizontal overflow, zero fixed-control obstruction, zero console errors, and zero page errors. Active panels were visible, nonempty, and contained learner-visible text before capture.

## Learner-visible frame and order

The frame clearly identifies “Sección 7 · Texto & Unicode” and the five-stage Teoría → Yo hago → Hacemos juntos → Tú haces → Autocheck sequence. The desktop outline and compact mobile navigation preserve the current section identity; fixed previous/next/feedback controls stay in their reserved gutters.

## Tab-by-tab inspection

### Teoría

The opening begins from an observable ordinary problem: two strings can look identical while containing different Unicode code points. It defines the safe processing path as preserve raw → normalize → compare → gather evidence → decide/review, then teaches NFC/NFD, `casefold`, Latin American name heuristics and their limits, string methods before regex, modest contact normalization, regex anchors/groups/extraction, token Jaccard, and false-positive/false-negative tradeoffs. Code, output, warning/tip callouts, and prose are visually distinct and contained.

### Yo hago

Eight demonstrations follow the T1→T4 path and explicitly ask for predictions before execution. The text explains that Pyodide is Python running in the browser, then uses synthetic inputs to contrast raw code points, normalized equality, name parsing, string-first cleanup, contact validation, disciplined `fullmatch`, compiled extraction, Jaccard evidence, and human review. No screenshot suggests truncation or code-panel escape.

### Hacemos juntos

Twenty-four exercises appear in guided/independent/transfer trios. Each card separates context, goal, exact success output, limits, ordered task, two hints, starter, and solution control. The mobile page is exceptionally long at 44,009 px but all 53 tiles remain nonblank and preserve card boundaries, readable inline code, and navigation clearance. Productive orientation/fatigue still requires learner/UX evidence.

### Tú haces

The project requires a raw/normalized/transforms record contract, Unicode/name/contact policies, synthetic Latin American cases, explicit review status for ambiguity, tests, and a README evidence table. The starter and requirements clearly classify learner implementation work; no production placeholder claim is made. The rubric and completion control remain reachable.

### Autocheck

Ten question cards test canonical equivalence, safe incomplete-name policy, string methods versus regex, particles, Jaccard interpretation, `fullmatch`, modest email policy, risky regex posture, `re.compile`, and Peruvian synthetic phone normalization. Desktop/mobile tiles visibly contain all cards and options.

## Visual-aid decision before learner review

`VISUAL_AID_CANDIDATE`: a compact accessible diagram showing visually identical “José” as composed NFC code points versus decomposed NFD base-plus-combining-mark code points could materially expose an otherwise invisible relationship. It should be accepted only if learner evidence shows the current ord/hex/code-output examples do not form a stable model. Decorative screenshots, regex cheat-sheet images, or identity-themed stock imagery are not justified.

## Gate decision

The local rendered baseline is visually/structurally GREEN, so S07 constrained semantic review may proceed. Assessment-key correctness, actual execution, keyboard/touch behavior, solution boundaries, and deployed Pages parity remain separate gates.
