# 1. Section Identification & Scope

**Section:** S44 — CI/CD y seguridad de la cadena de suministro  
**Canonical source:** `src/lib/course/sections/s44-multimodal.ts`  
**Audited main commit:** `535bd4d7b603283af9a39a813a79f05afbc47b48`  
**Source blob:** `eec61acc20c6a06558b4a13193522066152cbffb`  
**Stable legacy id:** `multimodal` — preserve unless a migration is explicitly designed.  
**Prior overlay:** `audit/lessons-only/sections/S44.patch-01.json` / addendum-01.  
**This overlay:** `audit/lessons-only/sections/S44.patch-02.json`.

This continuation audits **S44 only**. It does not modify curriculum content. It re-opened the converged F48 state with new adversarial mutations and deduplicated candidate problems against the prior F01–F48 registry.

# 2. Executive Summary of Quality

**Score remains 1.5/10 — REPAIR_REQUIRED — release FAIL.**

**Effective registry after this pass: 52 confirmed findings: P0=1, P1=37, P2=14.** Four new material findings survived attack/defense:

- **F49 P1:** T2-A theory permits narrowly scoped job-level write, but We Do rejects every `write`; a legitimate release-job `packages: write` fixture is routed to `REVOKE_AND_ROTATE`.
- **F50 P2:** T4-A asks the learner to predict `conventional True`, but `conventional` is undefined and printed as a literal `True`.
- **F51 P2:** the opening says an SBOM inventories “todo lo que entró” in the artifact; authoritative definitions are narrower: software components/dependencies, their information and relationships.
- **F52 P1:** E3 classifiers route missing data before observable breaches. Missing evidence can therefore downgrade a known failure to a review state.

The prior P0 remains unchanged: final You Do still lets learner-editable booleans manufacture READY. The section is not releasable.

One live/source discrepancy remains **UNRESOLVED**, not promoted to a finding: canonical `estimatedHours` is 9 while the public S44 snapshot observed during this audit shows 20h. Resolve deployment provenance before editing either number.

# 3. Detailed Issue Registry

## S44-F49 — P1 — Least privilege is taught correctly, then contradicted in practice

**Evidence.** Theory says workflow-level defaults should be read/none and that a release job may receive only the write permission it needs. E2 then frames a “job de release” with `packages: write` as part of the breach and its solution accepts only permission values in `{read, none}`.

**RED counterexample executed.**  
`contents: read` + `packages: write` + full pinned checkout SHA + `secret_hits=0` + `dependency_review=True` → canonical assessor returns **`REVOKE_AND_ROTATE`**.

**Defense.** `token_permissions` might have meant workflow-level defaults.

**Verdict: CONFIRMED_FINDING.** The learner-facing preamble explicitly says **job de release**, and the record has no scope field. Current GitHub Actions semantics allow permissions at workflow or job scope, and `packages: write` is the capability used to upload/publish packages. The current exercise teaches the false heuristic “write anywhere = breach”.

**Learner failure.** A reasonable learner can remove necessary release/attestation write permissions to satisfy the course, or conclude that a secure publishing job cannot legitimately write.

**Minimum repair.** Represent `workflow_permissions` and `job_permissions` separately; keep default read/none; allow only the exact write capability needed by the publishing/attestation job; use an unrelated/broad write permission as the adversarial fixture.

## S44-F50 — P2 — `conventional True` is an orphan green signal

**Evidence.** T4-A I Do explicitly asks the learner to predict `conventional True`. The code executes `print("conventional", True)`. That value is not input to `release_ready`, is not defined in the surrounding theory, and is not explained by the demo rationale.

**Attack.** Search S44 for the term: the only learner-facing use is this prediction/output pair.

**Defense.** It may have intended Conventional Commits.

**Verdict: CONFIRMED_FINDING.** If that was the intent, the concept is still not introduced or measured. If not, the line is noise. Either way, a literal green value is not evidence.

**Minimum repair.** Remove the line. If Conventional Commits is a real objective, introduce the full concept and compute the result from a commit-message fixture instead.

## S44-F51 — P2 — SBOM scope is overstated as “everything”

**Evidence.** The opening describes an SBOM as “el inventario de todo lo que entró en tu artefacto”.

**Attack.** Current CISA/NTIA framing defines an SBOM as a formal/machine-readable inventory of **software components and dependencies**, associated information and relationships. It may aim for comprehensiveness within declared scope, but it is not synonymous with every build input, workflow decision, runner property or provenance fact.

**Defense.** The ingredients-label analogy is standard and useful.

**Verdict: CONFIRMED_FINDING.** The analogy survives; the absolute `todo` does not. It blurs the boundary the section later needs between SBOM and provenance.

**Minimum repair.** “inventario de componentes y dependencias de software incluidos en el artefacto, con información y relaciones entre ellos”; immediately contrast provenance as build-origin/process evidence.

## S44-F52 — P1 — Missing-first routing hides known breaches

**Evidence.** The E3 family returns review/inspection states immediately when required fields are missing.

Two executed mutations:
1. **T1-A:** `lint=False` + `supported` missing → `REVIEW_MATRIX`; the failed lint gate disappears.
2. **T2-A:** `contents: write` + `checkout@v4` + `secret_hits=1` + `dependency_review` missing → `SECURITY_APPROVAL`; multiple known breaches disappear.

**Defense.** Schema-first handling avoids `KeyError` and keeps uncertainty explicit.

**Verdict: CONFIRMED_FINDING.** Safe access does not require suppressing known evidence. The classifier should report known breaches independently from missing fields. Pure uncertainty deserves review only when no breach is already observable.

**Learner failure.** A learner can infer that deleting a field from an unsafe record weakens the decision from block to review.

**Minimum repair.** Compute violations that can be decided from present fields; if any breach is known, block and retain missing fields as secondary reasons; only route to REVIEW/INSPECT/APPROVAL when incompleteness is the only reason the decision cannot be made.

# 4. Meta-Leak Report

No new meta-leak is added in this pass. The prior learner-facing leak remains confirmed:

> `Practica CLIP y Whisper (simulado)`

The stable legacy id `multimodal` is still being used as a semantic playground key in shared `SectionView.tsx`. Preserve the stable id, but decouple it from obsolete CLIP/Whisper content.

F50 is **not** a developer meta-leak; it is an unexplained/decorative learner-facing status.

# 5. Pedagogical & Redaction Deep Dive

## Mental model

F49 is more damaging than a wording inconsistency because it breaks the learner's security model. Least privilege means **minimum authority for the task at the narrowest useful scope**, not “every permission must be read/none”. Publishing and attestation are exactly the cases where a scoped job may need narrowly elevated capability.

F52 exposes a state-machine teaching failure. The course repeatedly presents three exclusive states—valid, breach, uncertain—but real records can be both incomplete and already unsafe. Advanced production instruction should teach the learner to preserve multiple reasons, not overwrite them with the first branch that fires.

## Cognitive load and progressive disclosure

F50 adds extraneous load: the learner is explicitly told to predict a status that has no mechanism. Removing it is better than adding an unnecessary detour.

F51 is a one-phrase repair with high return. The current analogy is memorable; narrowing “todo” to “componentes y dependencias” prevents a later distinction from having to undo the learner's first model.

## Peruvian Spanish / technical writing

Prefer Spanish-first causal introductions:
- “permiso de escritura del job de publicación (`packages: write`)” before relying on the machine label;
- “inventario de componentes y dependencias” before the acronym SBOM is reused;
- “breach conocido” can be rendered as “incumplimiento ya comprobado” in explanatory prose, keeping machine gate codes unchanged.

Do not add a dictionary of English ops terms. Introduce each term at the point where its relationship matters.

## Assessment alignment

The repaired T2 assessment should ask learners to distinguish:
1. a workflow-level default with excessive write;
2. a release job with narrowly required `packages: write`;
3. an attestation job with only the permissions required for attestation;
4. an unrelated job with unjustified write.

For E3 transfer, include a mixed record that is both incomplete and breached and require the learner to report both facts.

# 6. Proposed GitHub-style Diffs

Explorer proposes only; it does not apply curriculum changes.

```diff
--- a/src/lib/course/sections/s44-multimodal.ts
+++ b/src/lib/course/sections/s44-multimodal.ts
@@
- "Contexto: un job de release ... con `packages: write` ... es breach."
+ "Contexto: el workflow mantiene `read`/`none` por defecto. El job que publica
+ paquetes puede recibir `packages: write` solo en ese job; un permiso de escritura
+ no relacionado o de alcance global sí viola least privilege."
@@
- set(record["token_permissions"].values()) <= {"read", "none"}
+ workflow_permissions_ok(record["workflow_permissions"]) \
+     and release_job_permissions_ok(record["release_job_permissions"])
```

```diff
@@ T4-A I Do
- "predice ... `conventional True`"
- print("conventional", True)
+ # Sin un objetivo explícito de Conventional Commits, no añadas un verde decorativo.
```

```diff
@@ opening SBOM paragraph
- "la SBOM es el inventario de todo lo que entró en tu artefacto"
+ "la SBOM es un inventario de los componentes y dependencias de software incluidos
+ en el artefacto, junto con información y relaciones entre ellos. La provenance
+ registra evidencia distinta sobre cómo y desde qué proceso se construyó."
```

```diff
@@ representative E3 classifier
- if missing:
-     return "SECURITY_APPROVAL"
- if known_breach:
-     return "REVOKE_AND_ROTATE"
+ if known_breach_from_present_fields(record):
+     return {"decision": "REVOKE_AND_ROTATE", "missing": missing}
+ if missing:
+     return {"decision": "SECURITY_APPROVAL", "missing": missing}
```

Apply the same precedence invariant to the other E3 classifiers without duplicating business logic blindly.

# 7. Recommended Priority Order for fixing

1. **P0 F02:** You Do must derive READY from real artifacts, not learner-editable booleans.
2. **Authentic-evidence cluster:** F03/F05/F14/F16/F19/F20/F25/F26/F28/F33/F36/F48.
3. **New F49 + existing F11/F46:** repair the permission model end-to-end with explicit workflow/job scope and narrowly required write capability.
4. **New F52:** redesign E3 routing so known breaches cannot be masked by missing fields.
5. **Supply-chain correctness:** F04/F13/F15/F17/F21 and related digest/provenance problems.
6. **Release safety:** canary, rollback, normal-vs-incident state machine.
7. **Cross-surface coherence:** CLIP/Whisper leak, CP-N4-B labels, dead figure, live 20h/9h drift.
8. **P2 comprehension cleanup:** F50, F51, Spanish-first terminology/resources/rubric distinctions.
9. **Regression:** rerun every stored counterexample plus the new permission-scope and mixed-state mutations.

# 8. Graph Memory Update notes

Add nodes:
- `S44-F49.permission_scope_contradiction`
- `S44-F50.conventional_hardcoded_signal`
- `S44-F51.sbom_scope_overclaim`
- `S44-F52.mixed_state_precedence`

Add edges:
- F49 → F11 (`SHARPENS_PERMISSION_MODEL_DEFECT`)
- F49 → F46 (`CONNECTS_JOB_WRITE_TO_ATTESTATION_PERMISSIONS`)
- F50 → F29 (`DECORATIVE_SIGNAL_FAMILY`)
- F51 → F15 (`SHARPENS_SBOM_PROVENANCE_BOUNDARY`)
- F52 → F34 (`ROOT_CAUSE_IN_REPEATED_E3_GRAMMAR`)
- F52 → F32 (`GENERALIZES_ROUTING_PRECEDENCE_DEFECT`)

Permanent Fixer/QA invariants:
1. Least privilege is scoped minimum authority, not “no write anywhere”.
2. Missing evidence cannot erase a breach already proven by present evidence.
3. A green status must be derived from taught inputs/evidence.
4. SBOM inventories software components/dependencies; provenance covers build-origin/process evidence.

**Effective S44 state:** 52 findings (P0=1, P1=37, P2=14), score 1.5/10, REPAIR_REQUIRED / FAIL. Public 20h vs canonical 9h remains unresolved pending deployment provenance.

This is the complete Explorer report for Section 44. Ready for the Fixer prompt.
