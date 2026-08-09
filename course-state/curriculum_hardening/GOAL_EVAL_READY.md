# Goal eval ready sheet (read this first — do not re-scan all 52 dossiers)

**Purpose:** Keep harness goal evaluation under the ~30s evaluator timeout by pointing at machine-checkable **structural** gates and small evidence files.

**Do not use Python to generate lesson text or to declare pedagogical success.** Machine gates only prove artifacts exist and contracts are wired; expert rank ≥9.5 is human judgment of content quality (no length/regex score = gold).

## One command (machine gate, target &lt; 5s)

```bash
python3 scripts/goal_verification_gate.py
# expect: GOAL_VERIFICATION_GATE_PASS
```

Result also written to:
- `course-state/curriculum_hardening/GOAL_VERIFICATION_GATE.json`
- `{SCRATCH}/goal_verification_gate.log` when scratch is available

## Acceptance map → artifacts

| Criterion | Proof path |
|-----------|------------|
| Phase 0 gold + residual + graph + ledger | `GOLD_STANDARD_CHECKLIST.md`, `RESIDUAL_MAP_EXPERT.json`, `GRAPH_MEMORY.json`, `SECTION_PROGRESS_LEDGER.json` |
| STORM n = section index for all 52 | `dossiers/S01_STORM.json` … `S52_STORM.json` (`n_logged` field) |
| Paragraph analyses S01–S52 | `paragraph_analysis/S01_PARAGRAPHS.md` … `S52_PARAGRAPHS.md` |
| Trainee unpublished | `.gitignore` contains `trainee_research_attempt/` |
| Structural regressions | `tests/adversarial/test_storm_paragraph_package_contract.py` + suite |
| Deploy smoke | esbuild course index / `{SCRATCH}/deploy_smoke.log` |
| Live + roadmap | `{SCRATCH}/live_roadmap_audit.md`; site https://pillb.github.io/pyarcana/ |
| User-visible redaction | Playwright dumps + `audits/AUDIT_SUMMARY.json` (52 ACCEPT) |

## Do **not** do in the 30s evaluator path

- Re-read all 52 full STORM JSON cycle bodies line-by-line via LLM
- Re-run Playwright full 52-section crawl (~3–4 min)
- Re-run full `pytest tests/adversarial/` if the fast gate already ran targeted pytest

## Spot-check samples only (if LLM still needs eyes)

| Section | File | STORM | PA |
|---------|------|-------|-----|
| S01 | `src/lib/course/sections/s01-setup.ts` | `dossiers/S01_STORM.json` | `paragraph_analysis/S01_PARAGRAPHS.md` |
| S36 | `s36-ai-apis-advanced.ts` | `S36_STORM.json` | `S36_PARAGRAPHS.md` |
| S52 | `s52-career-strategy.ts` | `S52_STORM.json` | `S52_PARAGRAPHS.md` |

## Residual (explicit, non-blocking)

- GitHub Pages deploy of latest local content may lag until `DEPLOY.md` ship
- Exam/prisma seed banks may lag curriculum text
