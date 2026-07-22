# SUMMARY — Dual-newbie agentic pedagogy gate (hardened)

## Result
**NOT PASSED** — authoritative clean-run count is **0**.

The former B1/B2 claims are tainted: both runs declare copied/rebuilt sources and contain rebuild reports, so they are not fresh, independent direct-live learner transcripts. S01–S13 content and packet isolation also changed afterward, making every earlier result stale.

Two fresh independent S01–S52 runs after final content freeze remain required.

## Skeptic fixes applied
1. **Incomplete exercises rejected**: validator fails on `____`, `sys.x`, `# TODO`, unclosed parens, known broken scaffolds.
2. **Template justifications rejected**: generic “Completé starterCode…” alone no longer passes.
3. **Complete dual-LLM exercise codes**: from prior live dual-LLM attempt_007b (no produce_agent x-placeholders).
4. **Per-exercise packet justifications**: instruction + iDo demo + code tokens; S01–S13 dual-LLM rewrite.
5. **Provenance correction**: copied/rebuilt artifacts never count, regardless of textual diversity.

## Method
- Primary pass bar: `scripts/newbie_agentic_validator.py` (agentic justification + complete solutions)
- Dual newbies Explorer/Skeptic; packets strip correctIndex
- Code-exec is platform QA only

## Branding
PyArcana + Art Nouveau PASS

## Adversarial
`npm run test:adversarial` green

## Residual
Fresh dual-live runs, full platform/adversarial validation, deployment and push remain pending.
