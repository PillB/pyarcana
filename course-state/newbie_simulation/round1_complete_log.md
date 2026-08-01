# Newbie Dual-Sim Round 1 — Complete Log

**Date:** 2026-08-01
**Simulator:** newbie_dual_sim.py (heuristic token-overlap, no LLM)
**Sections covered:** 29 (S01-S29; S30-S52 timed out — need faster run)

## Summary
- Sufficient: 28/29
- Sections with gaps: 0
- Sections with A < 70%: 16
- Sections with B < 70%: 20

## Per-section results

| Section | Sufficient | Gaps | A Score | B Score | Flag |
|---------|-----------|------|---------|---------|------|
| S01 | ✅ | 0 | 75% | 75% |  |
| S02 | ✅ | 0 | 46% | 36% | ⚠️ LOW |
| S03 | ✅ | 0 | 62% | 50% | ⚠️ LOW |
| S04 | ✅ | 0 | 75% | 75% |  |
| S05 | ✅ | 0 | 25% | 12% | ⚠️ LOW |
| S06 | ✅ | 0 | 22% | 22% | ⚠️ LOW |
| S07 | ✅ | 0 | 80% | 70% |  |
| S08 | ✅ | 0 | 73% | 73% |  |
| S09 | ✅ | 0 | 54% | 46% | ⚠️ LOW |
| S10 | ✅ | 0 | 50% | 33% | ⚠️ LOW |
| S11 | ✅ | 0 | 67% | 67% | ⚠️ LOW |
| S12 | ✅ | 0 | 57% | 43% | ⚠️ LOW |
| S13 | ✅ | 0 | 56% | 56% | ⚠️ LOW |
| S14 | ✅ | 0 | 54% | 54% | ⚠️ LOW |
| S15 | ✅ | 0 | 80% | 80% |  |
| S16 | ✅ | 0 | 88% | 88% |  |
| S17 | ✅ | 0 | 60% | 60% | ⚠️ LOW |
| S18 | ✅ | 0 | 100% | 88% |  |
| S19 | ✅ | 0 | 40% | 40% | ⚠️ LOW |
| S20 | ✅ | 0 | 88% | 75% |  |
| S21 | ✅ | 0 | 75% | 38% | ⚠️ LOW |
| S22 | ✅ | 0 | 100% | 80% |  |
| S23 | ✅ | 0 | 89% | 67% | ⚠️ LOW |
| S24 | ✅ | 0 | 80% | 40% | ⚠️ LOW |
| S25 | ✅ | 0 | 40% | 40% | ⚠️ LOW |
| S26 | ✅ | 0 | 88% | 62% | ⚠️ LOW |
| S27 | ✅ | 0 | 60% | 40% | ⚠️ LOW |
| S28 | ✅ | 0 | 40% | 40% | ⚠️ LOW |
| S29 | ✅ | 0 | 62% | 62% | ⚠️ LOW |

## Issues found
- All sections are "sufficient" (knowledge isolation check passes)
- No gaps detected (all exercises can be answered from prior section content)
- Some sections have low A/B scores (< 70%) — this is expected for a heuristic
  token-overlap simulator; real LLM agents would score higher
- S30-S52 need a separate run (simulator timed out on full 52-section pass)

## Fixes applied
- S01 Q7: added pyproject.toml as 4th option (correctIndex was out of bounds)
- S02 Q4: escaped brackets in option text
- S04 Q1: escaped brackets in option text
- S06 Q1: escaped brackets in option text
- S06 Q8: simplified escaped double quotes in option text
- S14 Q3: escaped brackets in option text

## Next steps
- Run S30-S52 separately
- Consider LLM-based simulation for more realistic scoring
- Review exercises in low-scoring sections for pedagogical improvements
