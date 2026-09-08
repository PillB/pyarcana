# PyArcana Audit Wiki — S44 continuation 2026-09-08

## Status overlay

This page is an append-only overlay for `audit/lessons-only/wiki/S44.md`. It does not replace the historical page; when the two disagree on the finding count, **this overlay is newer and authoritative**.

- Section: **S44 — CI/CD y seguridad de la cadena de suministro**
- Canonical source: `src/lib/course/sections/s44-multimodal.ts`
- Audited main: `535bd4d7b603283af9a39a813a79f05afbc47b48`
- Source blob: `eec61acc20c6a06558b4a13193522066152cbffb`
- Stable legacy id: `multimodal` — preserve as URL/progress identity; never use it as a current semantic selector without an override.
- Effective score/verdict: **1.5/10 — REPAIR_REQUIRED / FAIL**
- Effective confirmed findings: **48**
- Severity: **P0=1, P1=35, P2=12**
- Unresolved live drift: **1** (`20h` stale public crawl vs `9h` canonical source)
- Curriculum source modified by Explorer: **no**

## What changed after the 47-finding convergence checkpoint

The earlier continuation checkpoint (`S44.audit-run-20260908.json`) concluded at 47 findings. A later Solarize RED mutation targeted a verifier path that was not in that regression set: the T2-A secret-scanner detector.

Canonical learner-facing workflow fragment:

```yaml
- name: secret-scan
  run: echo gitleaks-stub-ok
```

Canonical verifier fragment:

```python
secret_scan = "secret-scan" in yaml_text or "gitleaks" in yaml_text
```

The verifier returns `secret_scan=True` when there is **no scanner execution at all**, including these mutations:

1. keep `name: secret-scan`, run only `echo nothing`;
2. use an ordinary step containing only comment `# secret-scan`;
3. run only `echo gitleaks`;
4. use the canonical `echo gitleaks-stub-ok`.

All four are scanner-free but satisfy the lesson's scanner-presence gate.

## S44-F48 — P1 — Scanner name/token is treated as scan evidence

**Status:** `CONFIRMED_FINDING`

**Location:** Theory → S44-T2-A → `MINI_WORKFLOW` + `workflow_security`.

**Root defect:** the workflow uses a success-looking echo stub and the validator checks raw substring presence rather than scanner configuration/execution/result.

**Learner failure:** a diligent learner can conclude that a step named `secret-scan` or any appearance of the word `gitleaks` proves scanning occurred. A pipeline that never inspects repository content can therefore pass the taught security gate.

**Defense considered:** a stub may reduce setup burden in an early pedagogical scaffold.

**Verdict:** the defense fails here because the stub is not quarantined as non-evidence and the same surface is presented as a hardening/gate example. The verifier itself turns decoration into evidence.

**Minimum coherent repair invariant:**

- run an actual approved secret scanner in controlled CI **or** a deterministic local scanner fixture;
- retain/inspect structured scan evidence or exit status;
- validate the scanner step structurally rather than by raw token occurrence;
- include a clean synthetic case that passes;
- include a clearly synthetic/test-secret case that blocks;
- never use a real credential in course material.

GitHub's secret-scanning/push-protection model and Gitleaks' own documentation both describe tools that actually inspect content and generate detection/blocking outcomes. A label/comment/echo cannot substitute for execution evidence.

## Registry reconciliation: F47 was already real, but missing from compact S44.json

The compact base registry `S44.json` ends at F46 with 46 findings. The cross-surface ledger `S44.components.json`, full-scope index and Explorer report already contain **S44-F47**: declared figure `S44-permission-scope` is missing from both figure registries, so `FigureFrame` returns `null`.

Do not rewrite `S44.json`. `S44.patch-01.json` makes the append-only chain explicit:

- base S44.json = 46;
- + existing cross-surface F47 = 47;
- + new F48 = **48**.

## Audit-artifact QA memory

A separate audit-only error remains corrected by `S44.audit-corrections-20260907.json`: the Markdown report's scope sentence says **eight self-check questions**, while canonical S44 has **five**. This is not a curriculum finding and does not change the 48 count.

## New regression invariant for Fixer/QA

Add to the permanent S44 regression set:

> **A security-control label, comment or product name is not evidence that the control executed.**

At minimum, these must fail:

```text
name: secret-scan + echo nothing
# secret-scan + echo nothing
echo gitleaks
```

An authentic scanner fixture should pass only when its configured execution ran and returned the expected clean result. A synthetic secret fixture must produce a blocking result.

## Relationship to existing findings

F48 is not a duplicate of:

- **F10**, which concerns remediation/classification after a scan hit;
- **F11**, which concerns permission parsing/effective job permissions;
- **F36**, which concerns I Do's overall local-simulation mismatch.

F48 is narrower and independently falsifiable: **the T2-A scanner verifier can be green when no scan exists**. It reinforces F03/F36 but has its own code-level gate and counterexample.

## Files to consult in order

1. `audit/lessons-only/sections/S44.json` — historical base F01–F46.
2. `audit/lessons-only/sections/S44.components.json` — cross-surface evidence including F47.
3. `audit/lessons-only/sections/S44.full-scope-index.json` — 47-finding pre-F48 consolidated index.
4. `audit/lessons-only/sections/S44.audit-corrections-20260907.json` — audit-only self-check-count correction.
5. `audit/lessons-only/sections/S44.audit-run-20260908.json` — pre-F48 47-finding continuation checkpoint.
6. **`audit/lessons-only/sections/S44.patch-01.json` — authoritative delta to 48 findings.**
7. `audit/lessons-only/S44-full-scope-explorer.md` — original complete report (read together with the addendum).
8. `audit/lessons-only/S44-full-scope-explorer-addendum-01.md` — post-F48 Explorer overlay.

## Release rule remains unchanged

S44 remains `REPAIR_REQUIRED / FAIL`. The target is not more prose. The Fixer must replace self-attested/decorative security evidence with observable evidence while preserving beginner comprehension and the stable identity contract.
