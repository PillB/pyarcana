# Data and progress compatibility requirements

Baseline captured mechanically at HEAD `7aa825ac` in
`CURRENT_REPO_BASELINE.json`.

## Frozen contract

```
storage_key      python-ds-progress
fields           completedSections, completedSubSteps, quizScores,
                 lastVisited, bookmarks, startDate, isHydratedFromServer
sub_steps        theory, ido, wedo, youdo, quiz
server identity  (userId, sectionId, subStep); bookmarks use subStep "bookmark"
sections         52 active, IDs and order fixed
exercises        24 per section, 1248 globally unique, all frozen
demos            8 per section, frozen
subtopics        8 per section, frozen
```

## Classification of every change in this campaign

| Change | Class | Reasoning |
|---|---|---|
| New S18 theory blocks | `COMPATIBLE_ADDITIVE` | New objects appended to an unconstrained array; no identity created or consumed |
| New S18 Autocheck questions | `COMPATIBLE_ADDITIVE` | `selfCheck` has no persisted identity. `quizScores[sectionId]` stores a **number**, and `setQuizScore` keeps `Math.max(new, old)` — an existing score can never be lowered by a longer quiz |
| S18 `youDo` objective/requirement wording | `COMPATIBLE_SEMANTIC_REFINEMENT` | The project's purpose (an honest EDA for CP-N2-B) is unchanged; the addition lets the learner *name* the design they used. A prior "completed youdo" still refers to the same competency |
| New S15 theory block | `COMPATIBLE_ADDITIVE` | As above |
| New glossary terms | `COMPATIBLE_ADDITIVE` | `GLOSSARY_TERMS` is a display-time array with no persisted identity |
| Exercise changes | **none made** | Would be `POTENTIALLY_BREAKING`; avoided by design |

Nothing in this campaign is `POTENTIALLY_BREAKING` or `BLOCKED_COMPATIBILITY`.

## The quiz-score subtlety, checked rather than assumed

Adding Autocheck questions changes the denominator a *future* attempt is scored
against. `progress-store.ts` stores `quizScores` as a single number per section
and merges with `Math.max`, so:

- an existing score is never reduced;
- a learner who scored 8/8 keeps their stored value;
- if the stored value is a percentage, 100 % remains 100 %.

The learner is never forced to re-take. This is the grandfathering rule from
`19_SAVE_PROGRESS_COMPATIBILITY.md` §3, satisfied by the existing implementation
rather than by a new migration.

## Honest-reporting rule

A pre-existing `completedSections` entry for `data-engineering` is preserved and
is **not** claimed as evidence that the learner mastered the experimentation
material added on 2026-08-21. Historical completion preserved and new-content
mastery demonstrated are different claims and are reported separately.

## Required proof before completion

1. Baseline JSON diffed before/after — section IDs, exercise IDs, subtopic IDs,
   demo IDs identical.
2. `node scripts/preservation_sentinel.mjs` passes.
3. `npm run test:preservation` passes.
4. A representative legacy `python-ds-progress` envelope injected into the built
   static app survives a page load with completion, bookmarks, quiz scores,
   `lastVisited` and `startDate` intact.
