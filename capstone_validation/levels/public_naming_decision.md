# ADR — Public naming of curricular levels

> Status: accepted.
> Date: 2026-07-30.
> Governing spec: Section 4 (Level framework).
> Source of truth: `src/data/levels.ts` (`LEVELS[*].name`, `LEVELS[*].disclaimer`).

## Context

The four PyArcana levels must be **curricular proficiency bands**, not workplace
titles. Several adjacent curricula (and most recruitment marketing) use terms
like *senior*, *master*, *experto*, *job-ready*, *professional*, *lead*, or
*architect* as level labels. The Phase-1 research synthesis (Dreyfus, Bloom,
SOLO, Biggs constructive alignment) flagged that conflating curricular levels
with workplace seniority produces three harms:

1. **Misleading CV narrative** — a learner could write "Senior PyArcana" on a CV,
   implying workplace seniority the course cannot certify.
2. **Rubric drift** — workplace titles imply accountability for production
   systems the course never operates on; the rubric would have to either
   over-claim or silently under-deliver.
3. **Accessibility / equity** — workplace titles gate the curriculum for
   learners who do not see themselves as "senior" or "master" yet.

## Decision

The four levels are named **curricularly**, not professionally:

| Stable ID | English name | Spanish name | Section range |
|---|---|---|---|
| L1 | Guided Foundations | Fundaciones Guiadas | S01–S13 |
| L2 | Independent Applied Practice | Práctica Aplicada Independiente | S14–S26 |
| L3 | Advanced Integration and Evaluation | Integración y Evaluación Avanzadas | S27–S39 |
| L4 | Governed Production Systems | Sistemas de Producción Gobernados | S40–S52 |

The names:

- Describe the **kind of practice** (guided, independent, integrated, governed),
  not a workplace rank.
- Avoid *senior*, *master*, *experto*, *job-ready*, *professional*, *lead*,
  *architect* and similar workplace titles in both EN and ES.
- Pair with an explicit Dreyfus mapping that says *"curricular skill, not
  workplace rank"* in every level object.

## Disclaimer (rendered in the UI hero, in every level header, and in every
capstone brief)

> PyArcana curricular proficiency levels describe evidence demonstrated inside
> the course. They do not by themselves establish workplace seniority,
> professional licensure, employment level, or years of experience.

This disclaimer is **identical for all four levels** (see
`src/data/levels.ts`) and is rendered verbatim in:

- the hero amber callout (`src/app/page.tsx`),
- the level section header (collapsible under "Exit capabilities"),
- the level-exit-capabilities markdown mirror (`levels/level_exit_capabilities.md`).

## Consequences

- The CV-narrative critical criterion (`C — Communication and demonstration`,
  weight 0.06) and the CP-FINAL critical failure *"Unsupported claim that the
  learner prevented fraud, saved money, improved a real organisation, achieved
  production accuracy, or operated at enterprise scale"* are aligned with this
  decision.
- Renaming a level requires bumping only the `name` / `spanishName` fields (the
  `stableId` L1–L4 and `sectionRange` S01–S52 never change — see ADR-level-language
  and the backward-compatibility tests).
