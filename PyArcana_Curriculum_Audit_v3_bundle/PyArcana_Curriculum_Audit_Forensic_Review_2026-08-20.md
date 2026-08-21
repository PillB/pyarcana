# PyArcana PR #30/#31 Curriculum Audit — Forensic Review

Date: 2026-08-20

## Executive conclusion

PR #30 was a productive but partial curriculum-audit checkpoint. It found and repaired real curriculum, packet, UI, assessment, and technical-content defects, and it substantially improved provenance infrastructure. It did **not** complete outer pass 1, because only S01-S07 were examined and no physically isolated admissible learner journey exists.

PR #31 fixed three review findings from #30, but the latest-head review then found two new P1 provenance defects and the PR was merged anyway. Those defects remain architecturally material:

1. prior learner state is not bound to the current campaign/pass/journey lineage;
2. a global execution capability can permit free-text `observed_output` without a per-attempt runtime receipt.

The next independent campaign should not begin as admissible until those two defects and the Codex tool-exposure limitation are resolved or the novice runner is moved to a truly no-tools surface.

## What PR #30 did well

- Canonical full learner-visible packet SHA.
- Immutable attempt/evidence behavior.
- Staged learner context manifests.
- Recursive stage integrity checks after review.
- Treating course content as untrusted data.
- Deployment SHA attestation mechanism.
- Pre/post solution visibility Playwright assertions.
- Desktop/mobile all-tab forensic screenshots and geometry.
- S01 GitHub remote/PR onboarding repair.
- Packet parser repairs for long starter blocks, theory code, preamble/edge cases and JS/TS escapes.
- Exercise catalog admission gate including You Do.
- Mobile header and fixed-control geometry repair.
- Glossary boundary repairs.
- S07 Unicode code-point correction and You Do review contract clarification.
- Append-only correction evidence rather than silently rewriting history.

## What the run empirically exposed

The harness itself generated many P0/P1 defects: tool exposure, packet omissions, starter truncation, rerun collision, escape corruption, catalog omissions, execution provenance, and screenshot-evidence problems. This is useful hardening evidence, but it means the campaign was primarily stabilizing its measuring instrument.

A measurement system cannot count evidence collected before the measuring instrument is known-valid as final proof.

## PR #31 defect pattern

PR #31's body said it addressed the three unresolved #30 threads. It did. However the independent review of its own head found two new P1 issues. The process then merged the PR rather than returning to RED/GREEN/re-review.

This proves the process needs an explicit latest-head review gate. A PR description, author reply, or previous review completion cannot substitute for an unresolved-thread query against the current head.

## State-management defects

There are at least three different state narratives:

- root `AGENT_STATE.md` still describes a July 22 checkpoint;
- `CURRENT_TASK.md` describes the August 20 S01-S07 campaign;
- `known_limitations.json` is older than `CURRENT_TASK.md` and does not contain all limitations currently named there.

Additionally `audit/safe-agent/release-decision.json` is scoped to an older Safe-Agent release and must not be mistaken for curriculum-audit readiness.

Create one machine-readable canonical `STATUS.json`, bind it to source SHA/campaign/scope, and treat all prose status files as derived or historical.

## Skill deviations from original requirements

The v2 skill strongly improved evidence handling but missed or underspecified:

- full project/capstone/badge/credential journey;
- exact campaign/pass/journey/turn lineage;
- per-attempt runtime receipt binding;
- canonical belief state that preserves misconceptions/forgetting;
- evidence-reference allowlist and entailment validation;
- self-check catalog admission parity with exercise catalog;
- hard latest-head PR review gate;
- state freshness/precedence;
- outer-pass semantics (partial chunks vs full S01-S52 traversal);
- physical learner runtime preflight;
- skill freeze during a campaign;
- domain-specialist correctness lanes;
- audit artifacts' scope/expiry;
- full live deployment/content-manifest parity.

## Pages assessment

The repository now has a strong exact-SHA design: deployment workflow passes `github.sha` into the static exporter, the exporter writes a full SHA to `deployment.json`, and the static Playwright suite can assert `EXPECTED_DEPLOY_SHA`.

That proves the **mechanism**, not the current live state. Current curriculum evidence still records live exact-SHA verification as a limitation after the S01-S07 checkpoint. Treat current Pages as `LIVE_NOT_VERIFIED` until the served deployment is independently fetched, its SHA/content manifest matches the tested candidate, and the live rendered matrix passes.

## Pedagogy improvements

The next skill should explicitly test mental-model acquisition and not merely define-before-use. For foundational concepts, use familiar problem -> motivation -> concept -> precise definition -> example -> misconception -> guided practice -> independent transfer. For programming, PRIMM and faded worked examples are appropriate where they improve understanding. Retrieval and spacing should be verified across later sections.

The canonical learner belief state should preserve misconceptions and uncertainty so the Supervisor can observe whether later teaching repairs them.

## Evidence model improvement

Use evidence tiers:

- E0 deterministic tests;
- E1 instruction-constrained diagnostic model runs;
- E2 physically tool-free semantic novice runs;
- E3 per-attempt execution-receipt learner evidence;
- E4 exact-SHA live product evidence;
- E5 optional human calibration.

This prevents an E1 diagnostic run from being rhetorically promoted into final learner proof.

## Immediate hard blockers before the next admissible campaign

1. Fix cross-pass/cross-journey prior-state acceptance.
2. Replace free-text observed runtime output with receipt references and harness-filled output.
3. Provide a physically tool-free novice runtime; if Codex CLI cannot, use Codex only as orchestrator and a no-tools learner runner.
4. Add mutation tests for the above.
5. Add a latest-head unresolved-review-thread merge gate.
6. Reconcile `STATUS.json`/AGENT_STATE/CURRENT_TASK/known limitations.
7. Extend audit scope to projects, capstones, badge catalog, and 31 claim-evidence contracts.
8. Re-run full preflight before any new evidence is called admissible.

The accompanying v3 system prompt, user prompt, and skill implement these corrections.
