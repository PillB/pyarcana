# AGENTS.md — course sections

Applies when editing any file in this directory. The root `AGENTS.md` still binds; this
adds the rules that only matter for learner-facing content.

## Done means

```bash
npm run test:v3 && npm run test:adversarial:node && npm run test:adversarial:py
npm run test:python-content      # every snippet runs under .venv-content
npm run test:first-use-all && npm run test:no-identifiers
python3 scripts/concept_map.py   # no new never-explained or surprising concept
python3 scripts/prose_quality_audit.py SXX   # no rise in run-ons or nominalisation
```

## Structure

- Eight numbered subtopics per section, `SXX-T[1-4]-[AB]`. They are the spine demos and
  exercises attach to; `theory_tags` must equal `demo_subtopic_tags`, in order.
- A supporting explanatory block carries **no `subtopicId`**. The contract parser ignores
  it, so it may be as long as the concept needs. A new or duplicated id breaks the section.
- Never invent a strand. `SXX-T3-C` does not exist.
- Only the 52 files imported by `../index.ts` are active. Legacy duplicates stay; never
  edit or delete them.
- A code block's `output:` is what the code prints under `.venv-content`. Run it; do not
  write it by hand. After changing code, regenerate with `tools/fixer/sync_declared_output.py`;
  `npm run test:python-strict` compares every line. The runtime audit reads only the first.
- Tag shell as `language: 'bash'`. The runtime audit executes `python` blocks.
- Titles match `learning_roadmap_52_V3.md`, a protected path. Changing one needs the
  roadmap changed first, by a human.

## Concepts (D1, D3, D6)

Before touching a term the learner has not met, answer in order:

1. **Is this use necessary?** If throwaway, remove it or say it in plain words.
2. **Is this the right place to teach it?** If not, rewrite the use away and name the
   section that should teach it.

Then one action: `REMOVE` · `REPHRASE` · `GLOSS` (define inline at first use, including in
taglines and outcomes) · `TEACH` · `DEFER`.

`TEACH` is for a concept the learner must operate to do the section's work, and a
parenthesis is not teaching: what it is and why it exists, a worked example with real
values, a guided step, a check the learner can run.

## Content rules

- No Peruvian DNI or identifier-shaped value in synthetic data (D2). Use `CLI-0001`.
- Figures are inline SVG from the archetypes in `src/components/course/figures/`; motion
  honours `useReducedMotion`; no screenshots (D4). Each figure removes work the prose was
  doing badly, or it is not added (D5).
- Spanish follows `audit/fixer/writing_rules.md`. Repair the defect, not the paragraph.
- Structural counts are floors that catch loss, not ceilings on teaching (D6).

Decisions: `audit/fixer/decisions.md`. Goal and definition of done: `audit/fixer/GOAL.md`.
