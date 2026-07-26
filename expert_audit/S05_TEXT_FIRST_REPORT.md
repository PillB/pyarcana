# S05 Text-First Independent Report

**Date:** 2026-07-26
**Branch:** `agent/text-s05-r2`
**Baseline:** `d557599`
**Scope:** Section 5 only

## Canonical identity and evidence

The current learner-facing section is **Section 5 · Funciones, contratos y
descomposición**, exported as `section05` under stable compatibility id/hash
`oop` in `src/lib/course/sections/s05-oop.ts`.

This pass independently inspected:

- the current source and all map/Theory/I Do/We Do/You Do/self-check surfaces;
- the authenticated S05 bank in `prisma/seed.ts`;
- the live `oop` playground and PDF mappings;
- current Explorer, expert, Spanish and exercise-pedagogy audits;
- the grammar plan, research dossier and prior reports as leads only.

No prior agent completion claim counted as evidence. The attached
`deep-research-report-5.md` says S05 was unavailable; current canonical source
and mappings directly contradict that claim, so the attachment was recorded as
a source mismatch and not used to certify the section.

## Independent diagnosis

The baseline was technically strong: its policies were consistent, its
examples were truthful, the gradual-release graph was complete and the
authenticated bank was balanced. Its learner-visible writing still relied too
heavily on accurate declarations:

- Theory stated rules without enough prerequisite bridges, causal models or
  active retrieval.
- I Do usually asked learners to observe rather than predict.
- Many We Do retrospectives repeated the successful output instead of
  diagnosing a plausible misconception and transferring the principle.
- You Do moved from parts to full assembly without a planning/tracing model.
- Self-check explanations named the key rule but rarely repaired distractors.

## Coverage ledger

| Surface | Coverage | Material change |
|---|---:|---|
| Relevance + map | complete | Added international use contexts, an S04 bridge, a promise-based function model and a question that threads through T1–T4. |
| Theory | 8/8 | Each subtopic now begins with a concrete causal bridge and ends in prediction, tracing, misconception separation or evidence review. |
| I Do | 8/8 | Every demo now requires a specific pre-execution prediction and a causal explanation after comparison. |
| We Do | 24/24 | Every retrospective was hand-rewritten to distinguish cause from symptom, repair a novice misconception and transfer the contract. |
| You Do | complete | Added a six-column contract-planning table, staged implementation order, evidence-led portfolio guidance and five transfer questions. |
| Public self-check | 8/8 | Every explanation rejects its distractor family and teaches the underlying mental model. |
| Authenticated assessment | 24/24 | Eight concepts × three variants, 6/6/6/6 answer-position balance and existing explanations reviewed and preserved. |
| Playground + PDF | 2/2 | Functions playground and `5. Funciones` label verified and preserved under `oop`. |

## Before/after evidence

### Theory map

- **Before:** a dictionary followed by the four-topic sequence.
- **After:** “En S04 aprendiste a recorrer datos y resumir decisiones; ahora
  debes poner nombre y límites a esas decisiones… Una función no es una caja
  misteriosa: es una promesa pequeña con una puerta de entrada, una regla
  interna y una salida.”

### I Do · defaults

- **Before:** “Observa `good` frente a `bad`. Compara las dos líneas.”
- **After:** “Predicción: dibuja cuántas listas existen en las dos llamadas a
  `good` y cuántas en las dos llamadas a `bad`; luego escribe ambas líneas de
  salida.”

### We Do · pureza e idempotencia

- **Before:** “Idempotencia es el test mínimo del gate… puede parecer estable y
  aun así estar mal.”
- **After:** “`once == '999000'` prueba la política; `f(once) == once` prueba
  estabilidad… el starter puede aprobar la segunda mientras fracasa la
  primera, una elegante forma de estar consistentemente equivocado.”

### You Do

- **Before:** pedía cuatro normalizadores, un orquestador y la suite
  directamente.
- **After:** antes de programar, el learner dibuja `función / entrada / salida /
  error / efecto permitido / prueba de idempotencia`, recorre un caso feliz y
  un email inválido y después implementa en orden.

### Self-check · pureza

- **Before:** “Pureza = determinismo + sin efectos colaterales.”
- **After:** distingue resultado determinista, I/O, mutación global y el
  distractor de que una función pura deba vivir en una clase.

## Preservation and packet contract

- All 65 `code` blocks and all 41 declared `output` blocks are byte-for-byte
  unchanged from baseline.
- All 24 exercise IDs, 8 demo IDs and 8 canonical subtopic IDs retain the same
  values and order.
- No hint contract, expected output, authenticated item/key, bank balance,
  playground or PDF mapping changed.
- Existing `id`/`kind` metadata moved next to each `instruction` so expanded
  preambles remain inside the learner packet parser’s bounded lookback. The
  parser now sees 24/24 ordered unique S05 exercise IDs instead of 20/24.

## Validation evidence

- New text-first guard: **6/6 pass**.
- Existing S05 curriculum integrity: **4/4 pass**.
- Learner packet: **24/24** ordered unique S05 exercise IDs.
- Scoped runtime: **65/65** artifacts; fail=0, skip=0, P0=0, P1=0.
- Structure/V3: 8 subtopics, 8 demos, 24 exercises; counts and invariants pass.
- Exam audit: 1,248 questions / 416 concepts; P0=0, P1=0.
- TypeScript and repository-wide ESLint: pass.
- Node adversarial: **54/54 pass**.
- Static export: compile/type-check pass; local HTTP **200**; built bundle
  contains the rewritten map and independent-project prose.
- Fresh Spanish heuristic audit: **9.23/10**, Fernández-Huerta **86.7**
  (“fácil”), 101 low findings, no medium/high findings.
- Broad Python suite: **80 inherited failures**, reduced from 81 because S05
  left the packet failure set; remaining failure headings belong to untouched
  sections.
- Generated runtime, assessment and Spanish snapshots restored before staging.

Ready for the next section.
