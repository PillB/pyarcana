# Current Task — PyArcana Zero-Prerequisite Curriculum Verification and Repair

## Authority and method

Audit repository `PillB/pyarcana` from its current checked-out state. Apply the active `pyarcana-curriculum-audit` skill and use current `PillB/solarize_skill` principles as a curriculum method: research → RED evidence → minimal GREEN repair → refactor → independent validation → immutable ledger → report.

The repository, rendered application, deployed GitHub Pages site, current `AGENTS.md`, `README.md`, `AGENT_STATE.md`, active S01–S52 import graph, and fresh execution evidence are authoritative. Preserve unrelated work and historical evidence.

## Objective

Determine whether a capable learner with ordinary computer-use skills and no ungranted technical knowledge can progress sequentially from S01 through S52 using only the landing/onboarding experience, current and prior learner-visible course material, exposed assets, and that learner's own sealed prior knowledge.

Repair demonstrated curriculum, assessment, technical, packet/provenance, or rendered-product defects without answer leakage, future knowledge, fabricated evidence, test weakening, bulk rewriting, or unnecessary visual media.

## Required architecture

- Run up to 10 outer passes.
- Use two independent learner identities in epistemic and realistic-student modes.
- Keep learners sequential within a journey and read-only across course source.
- Use one skeptical read-only Supervisor and one serialized Fixer.
- Treat instruction-constrained learner runs as diagnostic only while `LIMIT-CODEX-CORE-TOOL-EXPOSURE` remains open; never mislabel them as physically isolated evidence.
- Bind every packet and output to immutable manifests, complete learner-visible content hashes, fresh run IDs, receipts, and exact source/deployment SHAs.
- Preserve stale runs and mark them invalidated; never overwrite them or count them toward convergence.

## Section protocol

For each section S01–S52, strictly perform:

1. Refresh repository status, active source identity, prior learner state, packet SHA, and relevant existing evidence.
2. Start the rendered application from the exact candidate SHA.
3. Before semantic analysis or edits, use zero-retry Playwright to capture baseline screenshots at minimum:
   - desktop viewport;
   - narrow/mobile viewport;
   - all five section tabs;
   - relevant expanded glossary, exercise, solution-boundary, code, terminal, diagram, image, and navigation states.
4. Store screenshots under an immutable section/pass/before directory with a manifest containing SHA, URL, viewport, tab/state, timestamp, and image hash.
5. Perform a forensic baseline review. Describe visible headings, paragraphs, controls, images, diagrams, code, terminal output, exercises, feedback, navigation and glossary elements. Check exact content/order, clipping, truncation, overlap, horizontal overflow, occlusion, broken wrapping, unreadable labels, missing assets, inconsistent spacing, focus visibility, touch targets, contrast, accessible names, unexpected answer visibility, and console/network errors. Record evidence rather than merely stating “looks correct.”
6. Build fresh cumulative learner packets. Verify that every learner-visible field required at that moment—preambles, instructions, edge cases, hints, code, outputs, starter files and landing copy—is present in correct display order and that hidden solutions/keys remain absent.
7. Run two independent learners in both modes using their own prior sealed knowledge state. Record structured paraphrases, attempts, confidence, assumptions, observable output and honest blockers; never request private reasoning.
8. Run deterministic prerequisite, concept graph, assessment, runtime, packet-fidelity and provenance gates.
9. Supervisor diagnoses causal issues and ordinary learner errors separately. For every section explicitly record either a justified visual-aid issue or `VISUAL_AID_NOT_NEEDED`.
10. For an accepted defect, preserve a failing RED regression before editing. Use the Handcrafted Writing and Editorial Quality Protocol for learner-facing prose. Make the smallest coherent fix and preserve I/We/You independence.
11. If a screenshot, annotated screenshot, diagram or image materially clarifies a spatial UI path, multi-step relationship, system boundary, data flow or difficult comparison, add it only after the learner attempt is sealed and the issue accepted. Require instructional purpose, accurate current content, redaction, provenance/license/version/date, useful alt text, equivalent text for complex visuals, responsive readability and regression coverage. Never use a decorative-media quota.
12. Run targeted GREEN tests and fresh skeptical learner validation. Invalidate all affected downstream evidence.
13. Before any push, rebuild/restart the exact candidate and capture a second Playwright screenshot set using the same viewport/tab/state matrix under an immutable after directory.
14. Compare before/after screenshots and repeat the full forensic review. Confirm intended content changed, unrelated content did not, and no overlap, overflow, clipping, asset, focus, accessibility, solution-leak, console or navigation regression exists. Any unexplained visual delta blocks the push.
15. Run relevant static, unit, contract, preservation, build and zero-retry Playwright gates. Inspect the complete diff and scan the commit for secrets.
16. Commit the section checkpoint with explicit paths and push it to the PR. Never bypass required independent review.
17. After approval and merge, deploy only the exact tested SHA. Require the live Pages deployment to attest that SHA/content manifest, repeat the screenshot/state matrix against the deployed URL, compare it with the tested candidate, and fail closed on mismatch. A local pass is never production proof.

Clean sections are verification-only checkpoints; do not invent edits.

## Pedagogical decision standard

At every learner-visible first use ask whether the learner can explain what the concept is, why it exists, when to use it, what it is confused with, and apply it independently from current/prior teaching. Foundational or procedural concepts require motivation, definition, demonstration, guided practice and transfer before independent assessment. Small vocabulary may use an inline definition plus accessible tooltip/tap/glossary treatment.

Verify alignment across learning outcome → explanation → worked example → guided practice → independent practice → self-check → diagnostic feedback. Test ambiguity, alternate valid answers, key correctness, future dependency, answer leakage, platform/version behavior, starter fidelity and meaningful transfer.

## Evidence and convergence

Use RED → GREEN → independent validation for every accepted P0/P1 and practical P2. Mutation-test the auditing system using isolated defects. Maintain the immutable correction ledger and concept graph. A content or global packet change resets affected evidence and quiet-pass counting.

Aim for fresh quiet passes 9 and 10. If pass 10 exposes a substantive defect, repair and validate it but report `NOT_CONVERGED_AFTER_10_PASSES`. Never substitute positive prose for a failed gate.

## Process corrections learned in S01–S07

Apply these controls before starting the next ten-section chunk:

- Treat instruction-only learner isolation as diagnostic evidence. Keep `LIMIT-CODEX-CORE-TOOL-EXPOSURE` open until an external harness can physically remove tools and repository access.
- A realistic learner with execution disabled must return `CANNOT_VERIFY` or `BLOCKED_ENVIRONMENT`, leave `observed_output` empty, and never receive journey-completion credit.
- Derive the authoritative exercise catalog from the sealed packet. Reject missing, duplicate, invented, or noncanonical IDs before sealing, including the independent You Do task.
- Decode learner-visible TypeScript string escapes with JavaScript semantics. Mutation-test Unicode escapes, escaped backslashes, newlines, and arrays so packet extraction cannot silently change starter code.
- Use lossless, bounded, overlapping PNG tiles for long pages. A single extremely tall JPEG is not admissible visual evidence. Assert nonblank content and contiguous full-document coverage for every tab and viewport.
- Give interrupted or failed captures a new immutable capture ID. Never complete or reinterpret a partial directory as a successful capture.
- Invalidate screenshot evidence after every content, tooltip, component, or layout edit. Rebuild the exact candidate and repeat the full after-capture matrix before push.
- Review global glossary aliases at the current section boundary. A technically correct future-specific definition can still leak concepts or distort the learner's present mental model.
- Resolve visual-aid proposals with learner evidence: add a diagram only for an accepted obstacle that prose/code communicates less effectively; otherwise record it as optional P3 or `VISUAL_AID_NOT_REQUIRED`.
- Runtime audits currently refresh tracked aggregate reports. Until they accept an immutable per-run output directory, preserve the console result but do not stage overwritten historical summaries as new proof.
- The first delivery checkpoint covers S01–S07 because it includes the repaired audit harness. After merge and exact-SHA live validation, evaluate subsequent lessons in ten-lesson chunks while retaining section-level RED/GREEN and screenshot gates.

## Known limitations at the S01–S07 checkpoint

- `LIMIT-CODEX-CORE-TOOL-EXPOSURE`: physical tool removal is unavailable in the current learner execution surface. Prompt restrictions are defense in depth only, so these runs cannot establish the final knowledge-firewall gate.
- `LIMIT-REALISTIC-RUNTIME-RECEIPTS`: realistic learners do not yet receive a student-visible isolated Python runtime with command, stdout, stderr, exit-status, and runtime hashes bound to each attempt.
- `LIMIT-DEPLOYED-SHA-ATTESTATION`: GitHub Pages validation is inadmissible until the protected PR is independently approved, merged, deployed, and the live content is bound to the exact tested SHA.
- Long-page screenshots establish pixel coverage and geometry, not fatigue, orientation, focus recovery, keyboard-only behavior, screen-reader order, or solution secrecy in serialized client payloads. Dedicated behavioral tests remain required.

## Final report

Report final status; exact admissible learner/provenance status; issues fixed and unresolved by severity/category; mental-model improvements; corrected exercises/self-checks; visual-aid decisions and assets; files and tests changed; commands/results; before/after/local/live screenshot manifests and forensic findings; final fresh S01–S52 result; correction-ledger location; deployed SHA parity; and only recommendations requiring human judgment.
