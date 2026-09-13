# S44 quick reference — continuation 02

Generated: 2026-09-08T12:58:47-05:00

## Identity
- S44: CI/CD y seguridad de la cadena de suministro
- Canonical source: `src/lib/course/sections/s44-multimodal.ts`
- Main commit: `535bd4d7b603283af9a39a813a79f05afbc47b48`
- Blob: `eec61acc20c6a06558b4a13193522066152cbffb`
- Stable legacy id: `multimodal` (preserve; decouple from semantic playground content)

## Effective audit state
- Prior after patch-01: 48 findings = P0 1 / P1 35 / P2 12
- New patch-02: F49, F50, F51, F52
- Effective: **52 findings = P0 1 / P1 37 / P2 14**
- Score: 1.5/10
- Verdict: REPAIR_REQUIRED / release FAIL
- Unresolved live drift: public 20h vs canonical 9h

## New findings
### F49 P1 — permission scope contradiction
Theory allows narrowly scoped job-level write; We Do rejects any `write`.
Executed mutation: release job `contents:read + packages:write`, full SHA, no secret hit, dependency review green -> `REVOKE_AND_ROTATE`.
Invariant: **least privilege = minimum authority at minimum scope, not zero write everywhere.**

### F50 P2 — `conventional True`
T4-A I Do asks learner to predict a hard-coded, undefined green signal.
Default repair: remove it; only retain if Conventional Commits becomes a defined, measured objective.

### F51 P2 — SBOM "everything" overclaim
SBOM should be taught as software components/dependencies + information/relationships within declared scope, not every build input.
Invariant: **SBOM and provenance are complementary, not interchangeable.**

### F52 P1 — missing-first masks breach
Executed:
- T1-A lint false + supported missing -> REVIEW_MATRIX.
- T2-A write + @v4 + secret hit + review missing -> SECURITY_APPROVAL.
Invariant: **known breach wins/block; missing evidence is retained as a second reason.**

## Existing high-priority invariants retained
- F02: READY cannot be produced by learner-editable booleans.
- F48: a security-control label/comment/product name is not evidence that the control executed.
- Full SHA format is not enough by itself; preserve action repository/commit identity.
- Artifact/SBOM/provenance subject model must distinguish document hash from artifact subject.
- Promotion approval must be enforced evidence, not `bool(approved_by)`.
- Rollback must restore known-good state, not merely complete quickly.
- Legacy id `multimodal` is a stability key, not a semantic topic selector.

## Fix order
1. F02.
2. Authentic evidence cluster incl. F48.
3. Permission scope (F49 + F11/F46).
4. Mixed-state precedence (F52).
5. Digest/SBOM/provenance correctness.
6. Canary/rollback/state machine.
7. Cross-surface leaks/drift.
8. F50/F51 and remaining P2 wording/resources.

## Files
- `audit/lessons-only/sections/S44.patch-02.json`
- `audit/lessons-only/S44-full-scope-explorer-addendum-02.md`
- `audit/lessons-only/wiki/S44-20260908-continuation-02.md`
