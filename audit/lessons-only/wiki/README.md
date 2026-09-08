# PyArcana Curriculum Audit Wiki

## Purpose

Quick-reference memory for the `lessons-only-adversarial-20260903` curriculum-audit campaign. This wiki records the operating contract, evidence hierarchy, recurring audit heuristics, artifact locations, and campaign QA corrections so later Explorer/Fixer/QA work does not restart from memory or silently inherit stale assumptions.

This directory contains **audit memory, not curriculum truth by itself**. Current repository content at the audited `main` SHA remains the highest-priority source for current facts.

## Campaign operating contract

1. **One section per execution.** Resolve and audit only the assigned section before advancing the cursor.
2. **Canonical source before filename/slug.** Resolve section identity from the current course index/roadmap and source object. Historical filenames and IDs can remain stable URL/save/progress keys even when their semantic label is obsolete.
3. **`main` is read-only for Explorer.** Curriculum fixes are proposed as evidence-backed diffs; they are not applied during Explorer work. Audit artifacts live on `audit/lessons-only-adversarial-20260903`.
4. **Roadmap expectation is not evidence.** A declared prerequisite, outcome, gate, rubric or environment must be checked against what the learner actually sees, does and proves.
5. **ZERO_TECH / explicit-prerequisite baseline.** Do not smuggle domain knowledge into the learner. A term, tool or procedure can be assumed only when current/prior teaching actually established it or an explicit prerequisite contract permits it.
6. **Source-first, render-aware verification.** Read canonical source and shared rendering components; inspect live/deployed evidence where possible. If the public crawler is stale or cannot expose hydrated content, record uncertainty instead of converting drift into a confirmed defect.
7. **Preserve false-positive defenses.** A skeptical audit is not permission to invent defects. Every material suspicion receives Attack -> Defense -> Verdict.

## Anti-complacency decision rule

For each meaningful node (paragraph, code block, figure, I Do, We Do, You Do, assessment, resource, shared UI surface):

- **Attack:** construct the strongest plausible failure case: unexplained prerequisite, misleading mental model, incorrect code/output, weak evidence, cognitive overload, transfer failure, stale cross-section contract, or learner-facing leak.
- **Defense:** identify what the current content already does correctly and whether the suspected issue has a legitimate design reason.
- **Verdict:** `CONFIRMED_FINDING`, `REJECTED_FINDING`, or `UNRESOLVED`.

`SIN_CAMBIO_MATERIAL` has a high burden of proof. Before using it, attempt to falsify the content from novice comprehension, prerequisite graph, technical correctness, executable behavior, assessment alignment, cognitive load, cross-section consistency and live/rendered surfaces.

## Solarize adaptation for Explorer work

The campaign uses `PillB/solarize_skill` as a verifier-first loop, adapted so Explorer never patches the lesson:

1. **Research + memory query** — read current repo state, prior audit memory and authoritative external sources relevant to the section.
2. **RED / counterexample** — construct malformed, adversarial, missing-evidence and boundary cases that should fail; execute them when the learner code permits it.
3. **GREEN-equivalent proposal** — state the minimum coherent repair and proposed GitHub-style diff; do **not** mutate curriculum source.
4. **Refactor critique** — test whether the proposed repair introduces jargon, extra prerequisites, scope creep or weaker alignment.
5. **Independent verifier** — rescan shared UI, figures, roadmap, capstone, assessment and live surface rather than accepting the lesson file as the whole product.
6. **Convergence** — after the last new material finding, require two independent quiet rescans with no additional P0/P1 before closing the Explorer pass. P2 findings are still recorded.
7. **Memory + report** — append structured ledgers, update section wiki/index, and produce the strict Explorer report.

## Running JSON ledger standard

Coverage is hierarchical:

`section -> metadata/roadmap -> topic -> subtopic -> paragraph/component -> I Do -> We Do -> You Do -> self-check/exam -> resources -> shared surfaces`

At paragraph/element level retain, where applicable:

- `element_id` / location / source reference;
- `current_content`;
- intended learner function;
- observations / issues / widow terms / assumed knowledge;
- `attack`;
- `defense`;
- `verdict`;
- severity and finding IDs;
- executable counterexample or other evidence;
- `improved_version` / proposed repair;
- `justification` / pedagogical and technical reasoning;
- validation notes and unresolved dependencies.

Do not erase an earlier finding simply because a later artifact refines it. Record supersession/correction explicitly.

## Comprehension standard

A learner-facing explanation should make the causal chain recoverable with low effort: **what the thing is -> what input it receives -> where that input comes from -> what happens -> why the step exists -> what output/evidence is produced -> what can fail -> what the learner should do next**.

Treat unexplained terms as `widow terms` until the current/prior course actually supplies enough meaning. Necessary industry English is not banned in Peruvian Spanish; define it causally on first use and then use it consistently.

## Evidence invariants to test in every advanced section

These are **test heuristics, not automatic findings**:

- a learner-editable boolean/string can summarize evidence but is not sufficient proof that a real control occurred;
- code/output examples must survive malformed, missing, boundary and adversarial inputs appropriate to the taught contract;
- an authentic target environment should appear before independent assessment when the roadmap names that environment;
- I Do -> We Do -> You Do should fade support and change representation/context enough to test transfer, not worksheet-template memorization;
- learner-facing shared components can leak stale semantics even when the section source is current;
- figure/reference IDs must resolve through their registries;
- capstone labels, section labels and gate locations must be separated from legacy stable identifiers;
- a current live claim requires current live evidence; stale crawler data is `UNRESOLVED_LIVE_SOURCE_DRIFT`, not proof of deployment failure.

## Context refresh recovered from conversation ZIPs

The campaign refresh performed during S44 re-read two available conversation exports:

- `2026-09-04-2026-09-04-auditoría-s01-lección.zip`: reinforced source-first identity resolution, ZERO_TECH reasoning, prerequisite/concept ledgers, and the rule that roadmap declarations do not substitute for learner evidence.
- `2026-09-05-2026-09-07-s17-audit-summary.zip`: repeatedly reinforced skeptical/anti-complacent review and a running JSON hierarchy down to paragraph/element level with current content, observations, improved version, and justification.

Historical conversations inform the campaign method; they never override a fresher canonical source or current campaign evidence.

## Explorer / Fixer boundary

**Explorer:** finds, proves, rejects false positives, writes proposed diffs, and maintains audit memory.  
**Fixer:** applies accepted curriculum repairs with RED/GREEN regression tests and re-verification.  
**QA:** checks that the Fixer actually closed the accepted finding without regressions and that audit artifacts themselves remain internally consistent.

Do not describe a proposed Explorer repair as a curriculum fix that has already shipped.

## Current section index

### S44 — CI/CD y seguridad de la cadena de suministro

- Section wiki: `audit/lessons-only/wiki/S44.md`
- Full report: `audit/lessons-only/S44-full-scope-explorer.md`
- Full-scope index: `audit/lessons-only/sections/S44.full-scope-index.json`
- Solarize cycle: `audit/lessons-only/sections/S44.solarize-cycle.json`
- Base registry: `audit/lessons-only/sections/S44.json`
- Theory paragraphs: `S44.paragraphs-01.json` ... `S44.paragraphs-04.json`
- Practice: `S44.practice-audit-01.json`, `S44.practice-audit-02.json`
- Shared surfaces: `S44.components.json`
- Audit-artifact correction log: `S44.audit-corrections-20260907.json`
- Current curriculum verdict: **REPAIR_REQUIRED / FAIL**, score **1.5/10**, **47 confirmed findings (P0=1, P1=34, P2=12)**.

## Campaign QA rule

Audit artifacts are evidence and must be audited too. A counting, scope, source-SHA, finding-ID or status contradiction in an audit artifact is corrected/logged separately and **does not change the curriculum finding count unless new curriculum evidence supports a new finding**.

The S44 context-refresh pass found one such audit-only inconsistency: its full report scope sentence says `eight self-check questions`, while canonical S44 source, the practice ledger and full-scope index all contain **five**. See `S44.audit-corrections-20260907.json`.
