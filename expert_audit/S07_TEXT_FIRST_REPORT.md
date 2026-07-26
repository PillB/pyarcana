# S07 Text-First Independent Report

**Date:** 2026-07-26
**Branch:** `agent/text-s07-r2`
**Baseline:** `48a7965`
**Scope:** Section 7 only

## Canonical identity and evidence

The active learner-facing section is **Section 7 · Texto, Unicode y expresiones
regulares**, exported as `section07` from
`src/lib/course/sections/s07-data-acquisition.ts`. Its stable compatibility
id/hash remains `data-acquisition`; the separate `s07-pandas.ts` file is not
the canonical section imported by the course index.

This pass independently inspected:

- the current source and its map, eight Theory lanes and S08 bridge;
- all 8 I Do demonstrations, all 24 We Do exercises and the You Do project;
- all 10 public self-checks and all 24 authenticated assessment questions;
- the active learner-packet parser, locality gate, playground and PDF mapping;
- current Explorer, expert, Spanish, exercise-pedagogy and research artifacts.

Prior completion reports were treated only as leads. The attached
`deep-research-report-7.md` says the S07 source was unavailable; the current
course index, source and live mappings directly contradict that claim, so the
attachment was recorded as a source mismatch and not accepted as evidence.

## Independent diagnosis

The baseline was structurally and technically sound: its Unicode, regex,
similarity and evidence policies agreed; examples and outputs were truthful;
the authenticated bank was balanced; and the runtime mappings were on topic.
The remaining defect was learner-visible reasoning depth:

- Theory explained correct facts but rarely asked the learner to predict a
  boundary, trace evidence or choose a tool.
- I Do often said “sigue” or “observa” without requiring a concrete,
  checkable prediction before execution.
- Most We Do retrospectives restated the answer or next topic rather than
  connecting symptom, cause, misconception and transfer.
- You Do moved from requirements to implementation without a planning and
  tracing artifact.
- Public self-check explanations named the right rule but did not consistently
  repair the plausible distractors.

## Coverage ledger

| Surface | Coverage | Material change |
|---|---:|---|
| Relevance + map | complete | Added international consequences, an S06 bridge and the decision pipeline `raw → normalize → compare → evidence → decide/review`. |
| Theory | map + 8/8 lanes + S08 bridge | Added one active boundary check per lane and a transfer diagnosis distinguishing mojibake from Unicode normalization. |
| I Do | 8/8 | Every demo now requires a concrete pre-execution prediction and a causal comparison with the observed output. |
| We Do | 24/24 | Every retrospective was hand-rewritten to diagnose cause, repair a novice misconception and transfer the contract beyond the fixture. |
| You Do | complete | Added a five-column planning table, happy/ambiguous traces, staged implementation and international transfer review. |
| Public self-check | 10/10 | Every explanation now rejects its distractor family and teaches the underlying decision boundary. |
| Authenticated assessment | 24/24 | Eight concepts × three variants, 6/6/6/6 overall positions and 2/2/2/2 per attempt slice; reviewed and preserved. |
| Playground + PDF | 2/2 | Unicode/regex/evidence playground and `7. Texto & Unicode` label verified and preserved under `data-acquisition`. |

## Before/after evidence

### Map and Theory

- **Before:** the map listed T1–T4 and the record fields accurately.
- **After:** it begins from S06 collections and gives the learner a reusable
  decision pipeline: “conservar `raw` → normalizar → comparar → reunir
  evidencia → decidir o enviar a `review`.”
- Each Theory lane now ends with a concrete action: predict code points, test
  the name heuristic, choose `str` or regex, separate normalization from
  verification, trace pattern scope, audit backtracking risk, expose Jaccard
  sets or price FP/FN errors.

### I Do · Jaccard

- **Before:** “Sigue la demo: se normaliza, se calcula el score (~0.667) y la
  decisión cae en `review`.”
- **After:** “Escribe ambos conjuntos de tokens, su intersección y su unión;
  calcula la fracción antes de ejecutar.” The learner must explain the score,
  not merely observe it.
- Explicit pre-execution prediction prompts improved from **0/8 to 8/8**.

### We Do · evidence package

- **Before:** “raw + score + decision + reason es el contrato de matching del
  curso. Luego (E3): la política ética de no-parentesco.”
- **After:** explains why a bare boolean erases uncertainty, asks the learner
  to transfer the evidence package to another rule and preserves the boundary
  against logging unnecessary real PII.
- Retrospective depth improved from **19–47 words** (median 32) to **50–61
  words** (median 57), with a causal-repair and transfer check on all 24.

### You Do

- **Before:** requirements led directly into the implementation skeleton.
- **After:** the learner first builds
  `campo | raw | transformación prevista | normalized esperado |
  decisión/review`, traces a happy and ambiguous case, and then implements
  field by field. The close asks where the heuristic fails on another naming
  convention.

### Public self-check

- **Before:** explanations ranged from 9–23 words and often restated the key.
- **After:** all ten explanations are 41–46 words and explicitly distinguish
  the correct boundary from the tempting alternatives: NFC versus `casefold`,
  normalization versus existence, extraction versus validation, and score
  versus identity.

## Preservation and active contracts

- All **64 executable code payloads**, **40 expected-output payloads** and the
  You Do starter are byte-for-byte unchanged from baseline.
- All 27 stable `id` values, 8 `demoId` values and 40 `subtopicId` references
  retain their exact values and order.
- The active learner-packet parser still resolves **24/24 ordered unique**
  practice IDs.
- No instruction, hint, edge-case oracle, assessment item/key, bank position,
  playground or PDF mapping changed.
- The exact locality logic reports **12** Peruvian city tokens in free prose
  (cap 55) and no banned slang.

## Validation evidence

- New S07 text-first quality contract: **7/7 pass**.
- Existing S07 contract: **6/6 pass**.
- Scoped Python runtime: **64/64** artifacts; fail=0, skip=0, P0=0, P1=0.
- Structure/V3: 8 subtopics, 8 demos, 24 exercises; counts and invariants pass.
- Exam audit: 1,248 questions / 416 concepts; P0=0, P1=0.
- TypeScript and repository-wide ESLint: pass.
- Node adversarial: **54/54 pass**.
- Offline Spanish audit (`--no-lt`): **9.23/10**, Fernández-Huerta **83.6**
  (“fácil”); 95 low and 4 medium heuristic findings. The medium findings are
  false positives on deliberately paired tokens such as `MAÑANA/mañana`,
  `Ana`/`' Ana '` and repeated method names. The external LanguageTool mode
  was not used because it would disclose course prose to a public service.
- Static production export: compile and type-check pass; local export HTTP
  **200**; built bundle contains the new Theory and You Do prose.
- Broad Python suite: **76 inherited failures / 1 skip**; every failure heading
  belongs to untouched sections or fleet debt, and S07 has no failure heading.
- Repository-wide runtime audit: 22 inherited failures in untouched sections;
  S07 itself is 64/64.
- Generated runtime, exam and Spanish audit snapshots were restored before
  staging.

Ready for the next section.
