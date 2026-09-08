# 1. Section Identification & Scope

**Section:** S44 — CI/CD y seguridad de la cadena de suministro  
**Canonical source:** `src/lib/course/sections/s44-multimodal.ts`  
**Audited main commit:** `535bd4d7b603283af9a39a813a79f05afbc47b48`  
**Source blob:** `eec61acc20c6a06558b4a13193522066152cbffb`  
**Stable legacy id:** `multimodal` — preserve unless a URL/progress migration is explicitly designed.  
**Base report:** `audit/lessons-only/S44-full-scope-explorer.md`  
**Append-only delta:** `audit/lessons-only/sections/S44.patch-01.json`

This addendum audits **S44 only** and supersedes the base report only where stated. The canonical curriculum source has not changed since the full-scope audit, so the prior 47 findings remain valid unless explicitly reconciled here. This continuation re-read the current Solarize and PyArcana curriculum-audit skills, refreshed the available conversation-ZIP operating contracts, revalidated the current audit-branch checkpoint/wiki, and executed a new adversarial mutation against the T2-A secret-scanner verifier.

One audit-artifact correction remains in force: canonical S44 has **five** self-check questions, not eight. See `S44.audit-corrections-20260907.json`.

# 2. Executive Summary of Quality

**Updated score: 1.5/10 — REPAIR_REQUIRED — release FAIL.**

**Updated registry: 48 confirmed curriculum findings: P0=1, P1=35, P2=12; plus one unresolved live-hours drift.**

The central S44 diagnosis is unchanged but becomes even stronger: the lesson repeatedly lets a statement about evidence stand in for evidence. The newly proven P1, **S44-F48**, shows this at the secret-scanning boundary. The canonical workflow does not run Gitleaks or any scanner; it runs `echo gitleaks-stub-ok`. The canonical verifier then sets `secret_scan=True` when the raw YAML merely contains `secret-scan` or `gitleaks`.

A RED mutation proved that a label, a comment, or an echoed product name all pass. Therefore a workflow that never inspects a single file can satisfy the taught scanner gate. GitHub's secret-scanning/push-protection model and Gitleaks' official usage both require an actual detection mechanism; the current lesson instead validates decorative text.

The continuation also reconciles an audit-ledger inconsistency: compact `S44.json` ends at F46, while `S44.components.json`, the full-scope index and base report already contain F47 (missing `S44-permission-scope` figure). The historical base is preserved; `S44.patch-01.json` makes the chain explicit: 46 + F47 + F48 = 48.

# 3. Detailed Issue Registry

The base report's F01–F47 remain authoritative. The only new curriculum finding in this continuation is:

## S44-F48 — P1 — Secret-scanner name/token is treated as execution evidence

**Location:** Theory → `S44-T2-A` → `MINI_WORKFLOW` + `workflow_security`.

**Evidence quote:**

```yaml
- name: secret-scan
  run: echo gitleaks-stub-ok
```

and:

```python
secret_scan = "secret-scan" in yaml_text or "gitleaks" in yaml_text
```

**Attack.** Remove every real scanner invocation while preserving only superficial text. Four executed cases remain green:

1. canonical `echo gitleaks-stub-ok` → `secret_scan=True`;
2. `name: secret-scan` + `echo nothing` → `True`;
3. ordinary step + comment `# secret-scan` + `echo nothing` → `True`;
4. ordinary step + `echo gitleaks` → `True`.

None scans repository content.

**Defense.** A dependency-free stub can be a reasonable first scaffold if clearly labeled as simulation and excluded from the security gate.

**Verdict: `CONFIRMED_FINDING`.** The defense does not fit the actual surface. The example is embedded in the hardening contract and the verifier reports a successful `secret_scan`. The learner is not told that the scan is fake/non-evidence, and the gate itself cannot distinguish a scan from a comment.

**Pedagogical impact.** S44's principal lesson is that secure promotion needs verifiable evidence. F48 teaches the opposite at a critical control boundary: naming a control is accepted as proof that the control ran. This creates a dangerous transfer error because learners may later review workflows by labels rather than execution/configuration/results.

**Minimum repair.** Run an actual approved scanner in controlled CI or a deterministic local scanner fixture; preserve the scanner's result/exit status; validate the step structurally; test one clean synthetic fixture and one clearly synthetic/test-secret fixture that must block; never put a real credential in course material.

### Audit-registry reconciliation, not a new curriculum defect

**F47** was already a confirmed P2 in `S44.components.json` and the full-scope index/report: `S44-permission-scope` is absent from both figure registries, so `FigureFrame` returns `null`. The compact `S44.json` omitted it. `S44.patch-01.json` repairs the **audit evidence chain** append-only; it does not create a second figure finding.

# 4. Meta-Leak Report

The base report's learner-facing meta-leak remains confirmed:

> `Practica CLIP y Whisper (simulado)`

It is selected because shared `SectionView.tsx` uses the stable legacy id `multimodal` as a semantic demo key. The correct repair is to preserve the stable id and replace/decouple the semantic mapping.

F48 is not classified as a meta-leak. It is a **security-evidence/verifier defect**: the token `gitleaks-stub-ok` exposes that a simulated control is being represented as successful evidence.

Source-only developer comments remain a rejected false positive because they are not learner-facing.

# 5. Pedagogical & Redaction Deep Dive

## Pedagogy / authentic practice

F48 reinforces F03 and F36 but is independently falsifiable. The broader issue was already that S44 targets controlled CI/cloud while I Do/We Do rely overwhelmingly on local Python models. F48 shows why that abstraction boundary is not benign: once authentic execution is removed, the lesson starts verifying names and booleans rather than procedures and artifacts.

A simple local model may still be pedagogically useful, but the progression must be:

`mental model -> authentic controlled execution -> retained evidence -> diagnosis/transfer`.

Current S44 too often stops at `mental model -> boolean/string predicate`.

## Cognitive load / progressive disclosure

Replacing the stub does not require dumping a full production security stack on the learner. A minimal authentic scanner fixture can keep load controlled:

1. show what is being scanned;
2. run one scanner command/action;
3. show clean exit/report;
4. introduce one synthetic test secret;
5. rerun and observe block;
6. connect the result to the promotion gate.

That sequence reduces rather than increases extraneous load because it gives causal meaning to `secret scanning`, `hit`, `block`, and `evidence`.

## Redaction / Peruvian Spanish

The base F44 language finding remains. F48's repair should use Spanish-first causal phrasing rather than adding another unexplained English product name. For example: explain that **un escáner de secretos inspecciona el contenido del repositorio buscando patrones que parecen credenciales y devuelve un resultado que el pipeline puede usar para bloquear**, then identify Gitleaks as one implementation.

Do not imply that every hit is a confirmed live credential; F10 remains important. Detection, classification and remediation are distinct stages.

## Assessment alignment

Any future topic assessment for T2 should distinguish:

- a step merely named `secret-scan`;
- a scanner actually configured and executed;
- a clean result;
- a detected synthetic secret;
- a false-positive/test-secret disposition;
- whether publication remains blocked until policy is satisfied.

Recognition of the word `gitleaks` is not Level-4 evidence.

# 6. Proposed GitHub-style Diffs

These are proposals only; Explorer did not apply them.

```diff
--- a/src/lib/course/sections/s44-multimodal.ts
+++ b/src/lib/course/sections/s44-multimodal.ts
@@
-      - name: secret-scan
-        run: echo gitleaks-stub-ok
+      # Ejemplo ejecutable del lab: usa el scanner aprobado y conserva su resultado.
+      # En producción, fija también la herramienta/action según la política enseñada.
+      - name: secret-scan
+        run: gitleaks git --redact --exit-code 1 .
@@
-    secret_scan = "secret-scan" in yaml_text or "gitleaks" in yaml_text
+    # No aceptar nombres, comentarios ni menciones como prueba de ejecución.
+    # El ejercicio debe validar estructura/configuración y evidencia de resultado.
+    secret_scan = scanner_step_is_configured(yaml_text) and scan_result_is_verified(scan_evidence)
```

The exact implementation should fit the repo's controlled teaching fixture and avoid requiring a commercial credential. If a real Gitleaks Action is used, its action reference must also satisfy S44's own pinning policy rather than introducing a new floating-tag contradiction.

Add a RED regression test conceptually equivalent to:

```diff
+assert scanner_gate("name: secret-scan\nrun: echo nothing") is False
+assert scanner_gate("# secret-scan\nrun: echo nothing") is False
+assert scanner_gate("run: echo gitleaks") is False
+assert scanner_gate(clean_scan_fixture) is True
+assert scanner_gate(synthetic_secret_fixture) is False
```

Existing proposed diffs for F01–F47 in the base report remain in force.

# 7. Recommended Priority Order for fixing

1. **P0 F02 first:** final You Do must not produce READY from learner-editable booleans.
2. **Evidence authenticity cluster:** F03/F05/F14/F16/F19/F20/F25/F26/F28/F33/F36 and new **F48**. Replace claims/stubs with observable artifacts/results.
3. **Supply-chain correctness:** malformed digests, SBOM/provenance subject model, action pin verification, attestation permissions/identity.
4. **Release safety:** canary domains/window, last-known-good rollback, healthy/incident state separation.
5. **Pedagogical transfer:** diversify I Do/We Do and add four authentic topic assessments.
6. **Cross-surface coherence:** CLIP/Whisper leak, CP-N4-B labels/gate wording, dead figure.
7. **Language/resources/P2 polish:** Spanish-first definitions, targeted primary resources, rubric bridge, terminology consistency.
8. **QA after Fixer:** rerun every stored counterexample including the new scanner-token mutations and capture fresh live browser evidence for the 20h/9h unresolved drift.

# 8. Graph Memory Update notes

Append these graph nodes/edges to S44 memory:

- node `S44-T2-A.secret_scan_stub`;
- node `S44-T2-A.workflow_security.secret_scan_substring_gate`;
- node `S44-F48`;
- `secret_scan_stub -> F48` (`PROVES`);
- `substring_gate -> F48` (`PROVES`);
- `F48 -> F03` (`REINFORCES_AUTHENTIC_ENVIRONMENT_GAP`);
- `F48 -> F36` (`REINFORCES_WORKED_EXAMPLE_AUTHENTICITY_GAP`).

Permanent Fixer/QA invariant:

> **A security-control label, comment or product name is not evidence that the control executed.**

Authoritative current overlay artifacts:

- `audit/lessons-only/sections/S44.patch-01.json`
- `audit/lessons-only/wiki/S44-20260908-continuation.md`
- `audit/lessons-only/S44-full-scope-explorer-addendum-01.md`

Together with the original full-scope ledger/report, the effective S44 state is **48 confirmed findings (P0=1, P1=35, P2=12), score 1.5/10, REPAIR_REQUIRED / FAIL**.

This is the complete Explorer report for Section 44. Ready for the Fixer prompt.
