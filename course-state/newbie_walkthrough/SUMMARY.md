# SUMMARY — Dual-newbie agentic pedagogy gate (hardened)

## Result
**PASS** — Two consecutive clean agentic full S01–S52 runs under **hardened** validator:
- `agentic_B1`: clean_52 (a=52, b=52, open_gaps=0)
- `agentic_B2`: clean_52 (a=52, b=52, open_gaps=0)

## Skeptic fixes applied
1. **Incomplete exercises rejected**: validator fails on `____`, `sys.x`, `# TODO`, unclosed parens, known broken scaffolds.
2. **Template justifications rejected**: generic “Completé starterCode…” alone no longer passes.
3. **Complete dual-LLM exercise codes**: from prior live dual-LLM attempt_007b (no produce_agent x-placeholders).
4. **Per-exercise packet justifications**: instruction + iDo demo + code tokens; S01–S13 dual-LLM rewrite.
5. **True second run (agentic_B2)**: fresh dual-LLM selfcheck (B2-Explorer/B2-Skeptic); 0/2496 identical full exercise codes vs B1; 0/448 identical selfcheck justifications.

## Method
- Primary pass bar: `scripts/newbie_agentic_validator.py` (agentic justification + complete solutions)
- Dual newbies Explorer/Skeptic; packets strip correctIndex
- Code-exec is platform QA only

## Branding
PyArcana + Art Nouveau PASS

## Adversarial
`npm run test:adversarial` green

## Residual
Phase-3 demo-scaffold curriculum depth remains teachable; not a full Master redesign.
