# Content matrix — per-capstone contract completeness

> Governing spec Section 6 (Capstone Contract schema) and Section 13 (Harness
> Artifacts / Validation).
> Source of truth: `src/data/capstones.ts` (13 `CapstoneContract` objects).
> Each ✓ is verified at runtime by the *Content* test group in
> `tests/capstones.test.ts` and re-verified by `scripts/mirror.mjs`.

| Capstone | brief | prereqs | dataset | I-Do | We-Do | You-Do | assessment | rubric | evidence | remediation | security | final-integration |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| CP-N1-A | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| CP-N1-B | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| CP-N1-C | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| CP-N2-A | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| CP-N2-B | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| CP-N2-C | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| CP-N3-A | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| CP-N3-B | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| CP-N3-C | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| CP-N4-A | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| CP-N4-B | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| CP-N4-C | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| CP-FINAL | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

## Field key

- **brief** — non-empty `problemStatement` (Stephen Fry register, EN/ES redaction ≥ 2 passes).
- **prereqs** — non-empty `prerequisites[]`.
- **dataset** — `syntheticDataContract` populated (generator, schema, size, license, piiRisk).
- **I-Do / We-Do / You-Do** — every `sectionContribution` has non-empty `iDo`, `weDo`, `youDo`.
- **assessment** — every `sectionContribution` has a non-empty `assessment`.
- **rubric** — `rubric` object present (versioned, passThreshold, criteria[], criticalFailures[]).
- **evidence** — non-empty `requiredEvidence[]`.
- **remediation** — non-empty `remediationPaths[]`.
- **security** — non-empty `securityRequirements[]`.
- **final-integration** — non-empty `finalIntegrationInterfaces[]` and a matching entry in `FINAL_INTERFACES`.

## Total

**13 / 13 capstones × 12 fields = 156 ✓.** No cell is empty.
