# ADR — Level language is curricular, not workplace

> Status: accepted.
> Date: 2026-07-30.
> Governing spec: Section 4 (Level framework).
> Source of truth: `src/data/levels.ts` (`LEVELS[*].name`,
> `LEVELS[*].spanishName`, `LEVELS[*].disclaimer`, `LEVELS[*].dreyfusMapping`).
> Sibling artefact: `levels/public_naming_decision.md`.

## Context

PyArcana levels must communicate **curricular proficiency bands**, not workplace
titles. The Phase-1 research synthesis (Dreyfus, Bloom, SOLO, Biggs) showed that
conflating curricular levels with workplace seniority harms CV narrative,
rubric fidelity, and accessibility/equity (see `levels/public_naming_decision.md`
for the full rationale).

## Decision

1. **Level names are curricular.** The four levels are named *Guided
   Foundations*, *Independent Applied Practice*, *Advanced Integration and
   Evaluation*, and *Governed Production Systems* (EN) / *Fundaciones Guiadas*,
   *Práctica Aplicada Independiente*, *Integración y Evaluación Avanzadas*, and
   *Sistemas de Producción Gobernados* (ES).

2. **No workplace titles.** The names avoid *senior*, *master*, *experto*,
   *job-ready*, *professional*, *lead*, *architect* and similar workplace titles
   in both EN and ES.

3. **Disclaimer present.** Every level object carries the same disclaimer:

   > PyArcana curricular proficiency levels describe evidence demonstrated
   > inside the course. They do not by themselves establish workplace
   > seniority, professional licensure, employment level, or years of
   > experience.

4. **Dreyfus mapping is explicit.** Every level's `dreyfusMapping` field ends
   with the phrase *"curricular skill, not workplace rank"*.

5. **The disclaimer is rendered in the UI** in three places: the hero amber
   callout, every level section header, and the level-exit-capabilities
   markdown mirror.

## Consequences

- The CV-narrative rubric criterion (`C — Communication and demonstration`) and
  the CP-FINAL critical failure *"Unsupported claim that the learner prevented
  fraud, saved money, improved a real organisation, achieved production
  accuracy, or operated at enterprise scale"* are aligned with this decision.
- Renaming a level requires bumping only `name` / `spanishName`; the `stableId`
  (L1–L4) and `sectionRange` (S01–S52) never change. The
  *Backward compatibility* test group enforces this.
- The disclaimer is mirrored into:
  - `levels/level_exit_capabilities.md`,
  - `levels/level_claim_matrix.json` (`disclaimer` field),
  - `levels/public_naming_decision.md`.
