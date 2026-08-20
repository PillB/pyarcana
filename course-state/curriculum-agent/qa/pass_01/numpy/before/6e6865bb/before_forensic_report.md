# S06 pre-analysis rendered forensics

- Outer pass: `01`
- Active section: `numpy` — S06, “Colecciones y estructuras de datos”
- Exact source SHA: `6e6865bb`
- Capture: `capture_001`
- Runtime: optimized local production build
- Viewports: desktop `1440×1000`; mobile `390×844`
- Result: `2 passed (28.2s)`

## Deterministic layout and coverage

The lossless tiled gate captured every tab in both viewports. Desktop body heights/tile counts were theory `11,407/12`, Yo hago `11,970/12`, Hacemos juntos `27,689/28`, Tú haces `3,728/4`, and Autocheck `4,036/5`. Mobile was theory `17,840/22`, Yo hago `20,325/25`, Hacemos juntos `41,095/49`, Tú haces `5,757/7`, and Autocheck `4,912/6`.

All tabs remained exactly `1440/1440` desktop and `390/390` mobile. The gate recorded zero horizontal-overflow elements, zero fixed-control obstructions, zero console errors, and zero page errors. Active panels were visible, nonempty, and contained learner-visible text before capture.

## Learner-visible frame

The frame identifies “Sección 6 · Colecciones” and “Colecciones y estructuras de datos”, with the subtitle describing lists, dictionaries, sets, and nested structures. Desktop retains the course outline and five-tab progression; mobile collapses the outline while preserving section identity and top-level navigation. Previous, next, and feedback controls occupy the reserved gutters rather than covering cards or code.

## Tab-by-tab inspection

### Teoría

The first viewport motivates collection choice with three ordinary questions: preserve arrival order, locate a record by ID, and detect a repeated ID. It maps those needs to sequence, dictionary, and set before adding syntax. The content then moves through list/tuple/slicing, alias versus shallow/deep copy, dictionary indexes and conflict-preserving deduplication, nested `list[dict]`, missing versus empty values, stable sorting, and deterministic JSON. Explanation, code, output, and colored callouts remain distinct. The closing playground has reachable controls and the code editor retains its accessible name.

### Yo hago

Eight demonstrations use predict → locate cause → execute → explain. The learner traces preserved properties such as order, identity, relationships, and reproducible output rather than merely copying syntax. Dark code panels and their outputs are contained at both widths; the surrounding prompts explain what to watch before execution.

### Hacemos juntos

The guided-practice page presents 24 exercises in scaffolded trios. Each card separates context, goal, success criterion, limits, numbered work, two optional hints, type label, starter, and solution control. The 41,095 px mobile page is long but the tiled images visibly preserve card boundaries, hint panels, inline-code wrapping, and side-control clearance. Length and learner fatigue remain semantic/UX-review questions rather than geometric failures.

### Tú haces

The portfolio project names a complete in-memory tabular model and requires documented `list[dict]`, conflict-preserving deduplication, transaction flattening with `client_id`, safe nested access, deterministic export, and a synthetic edge-case matrix. The starter deliberately marks learner implementation points with `NotImplementedError`; these are classified exercise blanks, not production placeholders. The evaluation rubric and completion action remain reachable.

### Autocheck

Nine rendered questions cover slicing, aliasing, conflict policy, in-place sort return value, deterministic JSON, shallow-copy limits, set membership, safe dictionary access, and flattened relationship keys. Desktop and mobile tiles visibly contain question cards and choices; no raster is blank.

## Visual-aid decision before learner review

`VISUAL_AID_NOT_REQUIRED` provisionally. The opening “three questions → three structures” comparison, memory-arrow prompts in Yo hago, concrete nested-data examples, and deterministic input/output traces already externalize the important relationships. A small alias/shallow/deep-copy reference diagram could be justified if both constrained learners fail to explain shared nested identity; it should not be added decoratively or before such evidence.

## Gate decision

The local rendered baseline is visually and structurally GREEN, so the constrained S06 semantic learner analysis may proceed. This is not deployed GitHub Pages evidence and does not certify assessment keys or solution boundaries.
