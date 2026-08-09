# PyArcana Gold-Standard Checklist (Phase 0 — skeptical, live-repo derived)

**Primary peers (live active modules):** `s01-setup.ts`, `s02-basics.ts`, `s03-data-structures.ts`  
**Secondary depth peers:** `s07-data-acquisition.ts`, `s08-pandas.ts`, `s10-sklearn.ts` (when content is domain-real, not only long)  
**Brand/voice:** PyArcana · Art Nouveau · **español peruano prioritario**, English technical terms where industry-standard  
**Progressive disclosure:** exercises/self-check may use only knowledge from S01…current section  
**Live site:** https://pillb.github.io/pyarcana/  
**Authoritative roadmap:** `learning_roadmap_52_V3.md` (titles/topics override legacy file ids)

## Expert quality bar (must all hold; target rank ≥ 9.5)

**Operating rule (mandatory):** Do **not** generate curriculum prose/code via bulk Python rewriters, and do **not** treat Python scripts as success oracles for pedagogy. Length counters, regex “ranks,” and auto-append tails produce boilerplate (ethics paste, identical “Contrato operativo” shells). Quality is **expert judgment** of meaning, progressive disclosure, and learner-visible redaction (read the site / section TS with human eyes or Playwright only as a view helper). Structural tests may still check files exist and demos/exercises are present.

Structural green alone is **not** gold. Prior `residual_ledger.json` `all_gold: true` is **rejected** as ground truth when theory/demos are template soup or print-theater.

| Area | Gold bar (from live S01) |
|------|--------------------------|
| Theory blocks | ≥ 9 headings; overview map + 8 subtopic blocks (T1–T4 × A/B) |
| Theory depth | Avg paragraph ≥ ~250 chars; **≥ 3 paragraphs** per subtopic with (1) concept + why, (2) operational contract, (3) Peru/synthetic case + edge |
| Progressive pedagogy | Four-layer idea where possible: Anchor → Mechanism → Worked example → Edge case (MIT/Kaggle pattern) |
| Callouts | info/tip/warning/danger with **actionable** criteria (not slogans alone) |
| Theory code | Runnable mini-demo: `language`, `title`, `code`, `output`; **computes** the concept (functions preferred) |
| iDo | ≥ 8 demos with `demoId`, description, why, code, output; not hardcoded `print` of the answer without derivation |
| weDo | 24 exercises (E1 guided / E2 independent / E3 transfer per subtopic) |
| Exercise instructions | ≥ ~150 chars: concept named, I/O contract, fixture id, exact pass string when graded |
| starterCode | Real scaffold with **one clear defect** to fix — not empty; not pure “print this target” |
| solutionCode | Aligned with demo contract; honest grader oracle; preferred `def` + predicate |
| youDo | Independent challenge + weighted rubric |
| selfCheck | ≥ 5 MCQ with non-trivial options + explanation; fair `correctIndex` |
| jobRelevance | Explicit workplace framing (Peru/LatAm stack when natural) |
| learningOutcomes | 6–10 measurable outcomes |
| resources | Real URLs (docs + courses + books); section-specific |
| Capstone/gates | Links to CP-N* / CF-* when in integrator/master phases |

## Anti-stub / anti-theater patterns (must be eliminated)

1. One-line theory slogans as sole content (“Anomalía ≠ culpa.” alone)
2. Template triplet only: generic “Contrato operativo” + “Aplicación a CASO-LIM” with no mechanism teaching
3. **Print theater:** demos that only `print` precomputed literals without computing from inputs
4. Generic “completa el print del demo iDo” / “completa solo print/resultado”
5. Empty or near-empty starterCode (`# TODO` only)
6. Copy-demo tasks with no independent reasoning (E3 must transfer)
7. Placeholder/planned/TBD/STUB markers in learner-facing text
8. Byte-identical theory across adjacent Master sections
9. Forward references to untaught APIs (progressive disclosure breach)
10. Real PII; ER/scores treated as fraud/parentesco proof

## Competitive research bar (every section)

Mandatory competitive families (document with direct links in STORM dossiers):

- Coursera / deeplearning.ai (Python, DS, DE specializations as applicable)
- MIT OCW (6.0001 / 6.100L / ML as applicable)
- Harvard CS50P / related
- Yale / Stanford (CS106A, CS229, system design as applicable)
- Best GitHub learner/teacher repos
- High-quality videos (official course or StatQuest-class clarity)
- Named objective anchors when relevant: py4e.com, Python for Everybody, Awesome-Python-Learning, etc.

**STORM cycles:** for section Sx, log **n = x** full cycles (research → synthesize → critique → expand scope → re-synthesize). Findings must map to content decisions (Theory + Evidence).

## Bilingual & pedagogy bar

1. **I Do → We Do → You Do** gradual release is explicit.
2. **No untaught APIs** in exercises of section Sx (only S01…Sx + stdlib unless section introduces the library).
3. **Synthetic data only** — no real PII; signals ≠ guilt.
4. **Fail-closed / human review** where decisions affect people.
5. **ES-PE primary prose**; English IDs/terms (API, SLA, PR, PCA, LOF) as in industry.

## Trainee research policy (Henry Ford harvest)

- Path `trainee_research_attempt/` is **local only — never publish to GitHub**.
- Treat “done / complete / gold” claims as **unverified** until contrasted with live `src/lib/course/sections` + roadmaps + site.
- Harvest best patterns (research caches, model-card examples, exercise depth) only when they match **V3 roadmap topic** for that section index.
- Example reject: trainee S36 FastAPI streaming is **wrong topic** for V3 S36 (clustering/anomalies).

## Verification rule

- Expert rank ≥ 9.5 required to mark section complete in **this** goal’s ledger.
- Structural tests (8/8/24, no banned markers) are **necessary but not sufficient**.
- Rank below 9.5 → re-enter quality loop (research → expand → analyze → validate → fix).
