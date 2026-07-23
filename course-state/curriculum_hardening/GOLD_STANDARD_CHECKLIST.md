# PyArcana Gold-Standard Checklist (derived from S01 + strong early peers)

**Peers:** `s01-setup.ts` (primary), `s02-basics.ts`, `s03-data-structures.ts`  
**Brand/voice:** PyArcana · Art Nouveau · español peruano prioritario, English technical terms where natural  
**Progressive disclosure:** only prior + current section knowledge for exercises/self-check  

## Structure bar (must match early peers)

| Area | Gold bar (from S01/S02) |
|------|-------------------------|
| Theory blocks | ≥ 9 headings; map/overview + 8 subtopic blocks |
| Theory depth | Avg paragraph ≥ ~250 chars; ≥ 2–3 paragraphs per subtopic with *why*, *contract*, *Peru/synthetic case* |
| Callouts | info/tip/warning/danger with operational criteria |
| Code demos in theory | Runnable mini-demo with `language`, `title`, `code`, `output` where concept is code-native |
| iDo | ≥ 8 demo steps with demoId, description, why, code, output |
| weDo | 24 exercises (E1 guided / E2 independent / E3 transfer per subtopic pair) |
| Exercise instructions | ≥ ~120–150 chars: concept named, input/output contract, fixture id, exact pass string when graded |
| starterCode | Real scaffold with one clear defect/TODO—not empty; not pure “print this target” |
| solutionCode | Aligned with iDo/demo contract; honest grader oracle |
| youDo | Independent challenge + checklist |
| selfCheck | ≥ 4–5 MCQ with explanation; options non-trivial; correctIndex fair |
| jobRelevance | Explicit workplace framing |
| learningOutcomes | 6–10 measurable outcomes |
| Capstone/gates | Links to CP-N* / CF-* when in Master/Integrator phases |

## Pedagogy bar

1. **I Do → We Do → You Do** gradual release is explicit.
2. **No untaught APIs** in exercises of section Sx (only S01…Sx).
3. **Synthetic data only**—no real PII; ER/scores ≠ fraud/parentesco claims.
4. **Fail-closed / human review** language where decisions affect people.
5. **Bilingual**: primary ES-PE prose; English IDs/terms (API, SLA, PR) as in industry.

## Anti-stub patterns (must be eliminated)

- One-line theory paragraphs only (“Anomalía ≠ culpa.” as sole content)
- Generic “completa el print del demo iDo” without domain contract
- Empty or near-empty starterCode
- Copy-demo tasks with no independent reasoning
- Placeholder/planned/TBD/STUB markers in learner-facing text
- Byte-identical theory across adjacent Master sections (must be section-specific)

## Verification-only rule

If residual ledger marks **gold** (score ≥ 8) and master-curriculum tests pass, reverse walk is **verification-only** unless critical inconsistency vs roadmap/live site.
