# Execute PyArcana Curriculum Audit v3

Repository: `PillB/pyarcana`

Use the active `.agents/skills/pyarcana-curriculum-audit/SKILL.md` and current `PillB/solarize_skill` methodology.

## Objective

Execute—not merely design—the complete PyArcana zero-prerequisite curriculum verification and repair campaign.

The primary question at every point is:

> Could a capable person who knows only ordinary computer use, basic arithmetic, everything PyArcana has genuinely taught up to this exact point, and their own verified prior learning understand what is being said and independently do what the course now asks—without guessing, future knowledge, answer leakage, external help, or hidden repository information?

Use two independent novice journeys, a skeptical Supervisor, a serialized Fixer, and a deterministic evidence harness.

The course goal includes not only S01–S52 lesson comprehension but the complete path to projects, capstones, defenses, skill badges, and credential claims. Audit the 31 badge/claim-evidence contracts as part of the same learning journey.

## Mandatory preflight before any new learner run

First review the latest repository state, PR #30, PR #31, all unresolved review threads, `AGENTS.md`, `AGENT_STATE.md`, `course-state/curriculum-agent/*`, `audit/safe-agent/*`, the current audit skill, the roadmap, active section graph, badge catalog, claim-evidence contracts, current tests, deployment workflow, and rendered/local/live evidence.

Do not count PR #30/#31 learner evidence as final merely because it was sealed.

Resolve or block on all harness defects before claiming admissible evidence. In particular, the next campaign must not start as admissible until:

- prior knowledge is bound to the same campaign, outer pass, journey, learner, and immediately preceding section;
- realistic execution uses per-attempt immutable execution receipts and learner output cannot fabricate `observed_output`;
- an admissible learner surface physically removes repository access, future files, web, skills, shell, patch/edit tools, and prior sessions;
- the audit harness mutation suite proves those controls fail RED when deliberately violated;
- the latest-head PR review has no unresolved P0/P1 findings.

If Codex CLI cannot provide a genuinely tool-free novice surface, use Codex as orchestrator and invoke the novice through a no-tools model/runtime. Codex-only instruction-constrained runs remain diagnostic and must be labeled as such.

## Ten-pass semantics

Perform up to 10 **complete outer passes**. A complete pass means the same campaign/pass lineage has sequentially evaluated landing -> S01 -> ... -> S52 -> projects/capstones -> badge/credential contracts.

A seven-section or ten-section delivery chunk is a checkpoint, not a completed outer pass.

Repairs invalidate affected downstream evidence and those sections must be rerun within the pass. Clean sections are verification-only.

Passes 9 and 10 should be fresh, complete, independent quiet passes. If pass 10 finds a substantive new defect, fix it and report `NOT_CONVERGED_AFTER_10_PASSES`.

## Learner behavior

Do not ask for private chain-of-thought.

Require structured:

- learner paraphrase / mental model;
- first-use confusion;
- evidence references to an allowlisted learner-visible reference catalog;
- exercise/self-check answer;
- concepts used;
- assumptions;
- confidence;
- questions/doubts;
- suspected missing prerequisites;
- execution requests when runtime evidence is required.

Reward `BLOCKED_NOT_TAUGHT`, `AMBIGUOUS`, `CANNOT_VERIFY`, and `BLOCKED_ENVIRONMENT` when truthful.

A correct answer that cannot be derived from learner-visible teaching is `PREMATURE_KNOWLEDGE`, not success.

Carry forward a verified belief-state snapshot including mastered concepts, partial understanding, misconceptions, uncertainty, and forgetting. Do not convert every learner claim into trusted knowledge automatically.

## Pedagogy and placement

For foundational concepts such as operating system, terminal/shell, interpreter, REPL, PATH, `pip`, environments, Git/GitHub, packages, APIs, data representations, statistics, correlation/causation, ML evaluation, testing, deployment, security, and responsible AI, test the mental model before procedural use.

When remediation is needed, decide the best just-in-time placement. Foundational/procedural concepts belong in the narrative before they are needed; tiny vocabulary may use inline definition + accessible hover/tap/focus + glossary.

Preserve and improve the I Do -> We Do -> You Do -> self-check progression. Use fading worked examples, PRIMM-style code reading/execution/modification where appropriate, retrieval/spacing, concrete examples, and misconception-focused feedback.

Do not over-scaffold You Do until it becomes copying.

## Correctness and assessment

Independently fact-check version-sensitive Python/tooling/API claims and domain-sensitive analytics/statistics/ML/security claims.

For every exercise, self-check, exam, project, and capstone verify:

- taught prerequisites;
- exact target outcome;
- solvability;
- starter/input fidelity;
- expected result;
- valid alternative answers;
- ambiguity;
- answer-key correctness;
- platform/version behavior;
- no placeholders;
- no hidden future dependencies;
- no accidental answer leakage;
- meaningful independent transfer.

## Projects, capstones, and badges

For every badge/credential contract trace:

`public claim -> required sections -> independent activities -> project/capstone -> critical competencies -> hidden/server evidence -> eligibility decision`

Verify the required evidence can actually be produced by the learner and that static GitHub Pages does not masquerade as server-authoritative credential evidence.

## Rendered product and Pages

Test the actual rendered course, not source text alone.

Use exact-SHA local builds and Playwright. Pass 1 and final passes 9/10 require full desktop/mobile rendered forensics across all sections and five learning tabs. Intermediate passes require a full automated DOM/geometry/accessibility sweep plus full screenshots for changed/risk-affected sections.

Test keyboard operation, focus order, touch/tap alternatives for hover, glossary behavior, solution boundaries, starter/code fidelity, console errors, overflow/occlusion, navigation, and relevant screen-reader semantics.

After an independently reviewed merge, verify `deployment.json` and a content/curriculum manifest against the exact tested SHA, then repeat required live checks. If current Pages cannot be independently reached/attested, say `LIVE_NOT_VERIFIED`.

## Merge discipline

Never merge a PR while its latest-head independent review contains an unresolved P0 or P1. Resolve or explicitly disposition P2s. Request a new independent review whenever the head changes after review.

Never count a PR description or author comment as evidence that review findings are fixed.

## Deliverables

Maintain machine-readable canonical campaign status, immutable correction ledger, concept/prerequisite graph, learner belief-state snapshots, execution receipts, mutation results, screenshot manifests, review findings, source/deployment attestations, and badge-evidence audit results.

At the end report:

- final status;
- completed outer-pass count;
- exact admissible learner count and evidence tier;
- open P0/P1/P2 issues;
- curriculum vs ordinary learner errors;
- repaired prerequisite/mental-model gaps;
- assessment/project/capstone/badge defects;
- harness defects fixed;
- files and tests changed;
- PR/review status;
- tested SHA and deployed SHA/content-manifest parity;
- full S01–S52+badge result;
- remaining items requiring human judgment.

Begin from current `main`. Do not ask for confirmation for normal evidence-backed repairs within this scope.
