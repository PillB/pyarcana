# Implementation status — relative to this package

**Written:** 2026-08-22  
**Campaign:** `content-campaign-c04`  
**Branch:** `audit/content-campaign-c04-20260821`  
**Open PR:** [#37](https://github.com/PillB/pyarcana/pull/37)  
**This file is additive.** It does not rewrite the original research reports in this directory. Those remain a 2026-08-21 snapshot against SHA `8b8bfc38`.

## What this package asked for

`00_EXECUTIVE_REPORT.md` and `05_SOURCED_CONTENT_DIFF.md` proposed three content units and forbade a course redesign:

| Candidate | Package verdict | Current status |
|---|---|---|
| S18 experimental / causal literacy | EXPAND HIGH | **Shipped in C03** (PR #33 lineage). Randomised comparison, effect + interval, p-value language, guardrails. |
| S33 temporal validation | EXPAND HIGH, then `ALREADY_FIXED` on re-read | **Shipped residual in C04**: rolling-origin, seasonal-naive, MAE, `as_of` boundary. S32–S34 already had leakage / group CV. |
| S15/S46 columnar execution | EXPAND MEDIUM | **Shipped in C03/C04**. Projection/filter pushdown and row-group pruning in S15; S46 reconnects partition strategy. |
| Neural / deep-learning bridge | OPTIONAL, do not displace the three above | **Not implemented.** Still optional. |

Hard constraints from `19_SAVE_PROGRESS_COMPATIBILITY.md` still hold: 52 sections, 1248 exercise IDs, 416 subtopics, `python-ds-progress` fields untouched.

## What C04 added on top of the package

The package did not ask for these. They were defects the honest content gate then exposed:

1. Runtime audit made honest (`-I` hid site-packages; extraction dropped backslashes; `DEFECT` was an unknown marker).
2. S41 crashing reference solutions; S19 Lima/Madrid contradiction; S11 hash-seed nondeterminism.
3. Pedagogy gates: support fading and answer leakage.
4. Glossary / anglicism first-use.
5. Declared teaching environment + CI content-gates job.
6. All 52 section intros rewritten; authoring metadata folded into one collapsed *Contrato de la sección (referencia)* block.
7. **Pandas 3 re-teach in S15** (this pass): inferred text is `str`, schema ids are nullable `string`, `object` means mixed types. Pin moved to pandas 3.0.5 / numpy 2.2.6.
8. **Phase E harness validation** of S15: packet builder + learner firewall, sha256-pinned. See `audit/content-campaign-c04/evidence/phase_e_s15_firewall.json`.

## Still open relative to this package

- `LENGTH_TELL` in 21 self-checks: recorded, not repaired.
- Live GitHub Pages attestation of the C04 SHA: not claimed here.
- Neural/deep-learning optional enrichment: still out of scope.
- Phase E ran the learner-firewall / packet-builder harness on S15 (packet_sha pinned). It is not a second human editor and not a full E2 learner journey.

## Do not treat as current truth

- The package baseline SHA `8b8bfc38` is historical. Main has moved (PRs #30–#36 merged; #37 open).
- `04_CURRENT_S01_S52_RECONCILIATION.md` must be re-read against HEAD before any new content unit.
- Prompt files (`11_`, `12_`, `CLAUDE_SCAFFOLD/`) are pre-execution design. They are not six real Claude Code runs.
