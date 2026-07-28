# Security and Privacy Threat Model — Eligibility Engine

**Generated:** 2026-07-28T22:35:00Z
**Catalog version:** 1.0.0
**Authors:** integration_architect node (Phase 8) + assessment_validity_architect node (Phase 7)
**Scope:** The eligibility engine (`src/lib/eligibility/`), its inputs
(learner progress, assessment attempts, project results), and its
outputs (eligibility reports, badge records).

---

## 1. Purpose

This document is the security and privacy threat model for the
PyArcana eligibility engine. It enumerates the threats the engine
must defend against, the controls in place, and the residual risk
after controls. It is the reference for any security review of the
credential system.

The model uses a STRIDE-style decomposition (Spoofing, Tampering,
Repudiation, Information disclosure, Denial of service, Elevation
of privilege) plus a privacy-specific lens (GDPR / FERPA-style
learner-data protections).

---

## 2. Trust boundaries

The eligibility engine operates across three trust boundaries:

1. **Client → Engine (static edition).** The static GitHub Pages
   edition runs the engine in the learner's browser. All inputs come
   from `localStorage`; all outputs are rendered to the same browser.
   The learner fully controls this boundary.
2. **Client → Server → Engine (dynamic edition).** The dynamic LMS
   edition runs the engine server-side. The client sends a request
   (`POST /api/badge/eligibility`); the server loads learner progress
   from Prisma, runs the engine, and returns the report.
3. **Server → Issuer (signature).** When the engine returns
   `eligible_pending_verification`, the LMS badge service signs the
   badge record with the issuer's Ed25519 private key. The signed
   record is the credential.

The engine itself is **deterministic and stateless**. It does not
write to the database; it only reads learner progress and computes
a report. All writes (awarding, revoking, expiring) happen in the
LMS badge service, not in the engine. This separation is the
engine's primary defense against tampering.

---

## 3. Assets

The assets the engine protects:

| Asset | Sensitivity | Where stored |
|---|---|---|
| Learner progress (completed activities, scores) | Private to learner + LMS admins | Prisma `Progress`, `ExamAttempt`, `ExerciseAttempt` (LMS); `localStorage` (static) |
| Critical-competency rubric scores | Private to learner + LMS admins + reviewers | Prisma `BadgeRecord.critical_competency_scores` (LMS) |
| Project rubric scores | Private to learner + LMS admins + reviewers | Prisma `BadgeRecord.evidence_map` (LMS) |
| Eligibility reports | Private to learner | Computed on demand; not persisted except in `evidence_registry.jsonl` audit trail |
| Badge records (awarded) | Public claim (after issuance) | Prisma `BadgeRecord` (LMS); `localStorage` mirror (static) |
| Issuer private key | Critical | Server-side secret manager (AWS / GCP); never on client |
| Audit trail (`evidence_registry.jsonl`) | Append-only, sensitive | Server filesystem + replicated backup |

---

## 4. STRIDE threats and controls

### 4.1 Spoofing

| Threat | Vector | Control |
|---|---|---|
| Learner impersonation on the LMS | Stolen session cookie | Existing NextAuth session hardening (`src/lib/auth.ts`); HTTPS-only cookies; session rotation on privilege change. |
| Reviewer impersonation | Stolen reviewer credentials | Reviewer role is server-side only; reviewer actions require a second factor (TBD in Phase 10). |
| Issuer impersonation | Stolen Ed25519 private key | Private key in secret manager with IAM-gated access; annual rotation; archived public keys for old signatures. |
| Static-edition "I am eligible" claim | Learner edits `localStorage` to fake progress | **The static edition never issues.** Competency and capstone badges show "eligibility preview" only; the LMS re-computes eligibility server-side before signing. |

**Residual risk:** Low. The static edition cannot issue credentials,
so client-side spoofing has no credential impact. LMS spoofing is
mitigated by NextAuth + HTTPS.

### 4.2 Tampering

| Threat | Vector | Control |
|---|---|---|
| Learner edits `localStorage` to inflate scores | Direct `localStorage` mutation | The engine's contract is: "client state is a preview, not a source of truth." The LMS re-loads all scores from Prisma before signing. |
| Learner submits a modified rubric score | Man-in-the-middle on the LMS API | All LMS API routes are HTTPS; rubric scores are written by the reviewer (server-side), not by the learner. |
| Reviewer submits a modified rubric score | Reviewer account compromise | Reviewer actions are logged to `evidence_registry.jsonl` with the reviewer's signature; audit trail is append-only. |
| Catalog tampering | Modified `badge_catalog.json` | Catalog is versioned (`version: 1.0.0`); the engine refuses to evaluate against a mismatched catalog. Catalog changes are reviewed via PR. |
| Engine code tampering | Modified `src/lib/eligibility/engine.ts` | Engine code is reviewed via PR; the Python reference implementation in `tests/adversarial/test_eligibility_engine.py` is the executable specification. Any change to the engine must keep the Python tests green. |
| Threshold tampering (e.g., change 85 → 70 to make a badge easier) | Modified catalog floors | Floors are encoded in the catalog and reflected in the engine; both are versioned. Floor changes require a catalog version bump and a re-evaluation of all learner eligibility. |

**Residual risk:** Low for LMS learners (server-side enforcement).
Medium for static-edition learners (they can edit `localStorage`
freely, but this only affects their own preview — no credential
impact).

### 4.3 Repudiation

| Threat | Vector | Control |
|---|---|---|
| Learner denies submitting an activity | "I didn't submit that" | Every activity submission is logged to `evidence_registry.jsonl` with a timestamp and the learner's session ID. |
| Learner denies receiving a badge | "I never got that badge" | Badge issuance is logged with the cryptographic signature; the learner can verify the signature with the issuer's public key. |
| Reviewer denies scoring a rubric | "I didn't grade that" | Every rubric score is logged with the reviewer's signature. |
| Issuer denies signing a badge | "We didn't issue that" | The cryptographic signature is the non-repudiable proof. |

**Residual risk:** Low. The audit trail is append-only and
cryptographically chained (each line includes a SHA-256 of the
previous line — see `evidence_registry.jsonl`).

### 4.4 Information disclosure

| Threat | Vector | Control |
|---|---|---|
| Learner A views Learner B's progress | IDOR on the LMS API | All LMS API routes enforce `session.user.id === requested_learner_id` (or admin role). The eligibility endpoint takes a `learner_id` from the session, not from the request body. |
| Learner views their own sensitive rubric feedback | n/a (intended) | The learner can always view their own data. |
| Reviewer views unrelated learner data | Reviewer role overuse | Reviewer role is scoped to specific badges / sections; the LMS enforces row-level access. |
| Public viewer sees an unissued badge | Public claim register leak | The public claim register only lists `awarded` badges. `eligible_pending_verification` and `in_progress` states are private to the learner. |
| Static-edition `localStorage` leaks to a third party | Browser extension / shared computer | The static edition does not store sensitive data (only completion flags and self-check scores). Capstone defense recordings are server-only. |
| Issuer private key leak | Secret manager compromise | Key rotation (annual); archived public keys; HMAC-chained audit trail detects forged signatures. |

**Residual risk:** Medium. The LMS API routes need ongoing review
for IDOR. The static edition is low-risk because it stores no
sensitive data.

### 4.5 Denial of service

| Threat | Vector | Control |
|---|---|---|
| Learner floods the eligibility endpoint | `POST /api/badge/eligibility` × 1000 | Rate limiting per session (existing LMS rate limiter). The engine itself is fast (<1ms per evaluation). |
| Learner submits a malformed `LearnerProgress` | Missing fields, huge arrays | The engine validates inputs; missing fields are treated as `null` / empty. The Python tests exercise malformed inputs (`test_legacy_progress_doesnt_fabricate_evidence`). |
| Catalog grows unbounded | New badges added without bound | The catalog is versioned; old versions are archived. The engine loads the catalog once at construction. |

**Residual risk:** Low. The engine is stateless and fast; DoS risk
is bounded by the LMS rate limiter.

### 4.6 Elevation of privilege

| Threat | Vector | Control |
|---|---|---|
| Learner awards themselves a badge | Direct `POST /api/badge/issue` | The LMS badge service requires admin or self-issue with server verification. The engine itself never issues — it only computes eligibility. The actual signing is server-side. |
| Learner promotes themselves to reviewer | Role escalation | Roles are server-side; the LMS enforces role checks on every admin / reviewer route. |
| Static-edition learner mints a fake "awarded" badge | Forged `localStorage` entry | The static edition's `awarded` badges are local-only. Forged entries are not signed and cannot be verified by a third party. The LMS re-issues any real badge from server-side data. |
| Learner bypasses the critical-competency gate | Modified engine code | The Python tests assert that the critical-competency gate is non-compensatory (`test_blocked_when_critical_competency_fails`). Any change to the engine must keep this test green. |

**Residual risk:** Low. The engine has no privilege surface — it
only computes eligibility. The LMS badge service is the privilege
boundary.

---

## 5. Privacy threats and controls

### 5.1 Learner data minimization

The engine processes the minimum data necessary to compute
eligibility:

- `learner_id` (pseudonymous; not the learner's email or name)
- `awarded_badges` (badge IDs only — no PII)
- `activities` (activity IDs + scores — no PII)
- `critical_competency_scores` (competency IDs + scores — no PII)
- `project_results` (project IDs + scores — no PII)

The engine never sees the learner's name, email, country, or any
other PII. The LMS API route maps the session to a `learner_id`
before calling the engine.

### 5.2 Learner data retention

| Data | Retention | Rationale |
|---|---|---|
| `localStorage` progress (static edition) | Until learner clears browser data | Learner-controlled. |
| Prisma `Progress`, `ExamAttempt`, `ExerciseAttempt` | 3 years after the learner's last activity | Matches the credential expiration window; supports renewal. |
| `BadgeRecord` (awarded) | Indefinite (the credential is the learner's record) | The learner earned it; we don't delete earned credentials. |
| `evidence_registry.jsonl` audit trail | Indefinite (append-only) | Required for audit; cannot be edited or deleted. |
| Reviewer signatures | Indefinite | Non-repudiation. |

### 5.3 Learner data subject rights

- **Right to access:** The learner can view all their data via the
  LMS dashboard. The static edition shows the `localStorage` data.
- **Right to rectification:** The learner can re-attempt activities
  and re-submit projects; the engine uses the best score. The
  learner cannot edit historical attempts (audit trail is append-only).
- **Right to erasure:** The learner can delete their LMS account;
  the LMS deletes their Prisma rows. The audit trail retains
  anonymized records (the `learner_id` is pseudonymous, so the
  audit trail cannot be re-identified after account deletion).
- **Right to portability:** The learner can export their badge
  records (with cryptographic signatures) via the existing LMS
  export endpoint.

### 5.4 Cross-border data transfer

The static edition stores all data in the learner's browser — no
cross-border transfer. The dynamic LMS edition stores data in its
hosting region (TBD; the deployment target is documented in
`DEPLOY.md`). Learners are informed of the hosting region at
registration.

---

## 6. Static-edition-specific threats

The static edition is the highest-risk surface because the learner
fully controls the client. The engine defends by **never issuing
credentials from client state**:

| Threat | Control |
|---|---|
| Learner edits `localStorage` to mark all sections complete | The engine computes eligibility from `localStorage`, but the resulting state is `eligible_pending_verification` (preview) — never `awarded`. The UI banner says "Verification unavailable on the static edition." |
| Learner edits `localStorage` to fake a high exam score | Same — preview only. The LMS re-grades the exam server-side before signing. |
| Learner edits `localStorage` to fake a critical-competency score | Same — preview only. Critical-competency rubric evaluations are server-side. |
| Learner edits `localStorage` to fake an `awarded` badge | The static edition's `awarded` entries are local-only. A third party verifying the badge will see "no record found" because the badge was never signed by the issuer. |
| Learner shares a screenshot of a fake `awarded` badge | A third party verifying the badge must use the issuer's public key. A fake badge has no valid signature. |

The Python test `test_static_mode_shows_preview_not_awarded`
encodes this contract: a competency badge on the static edition
must reach `eligible_pending_verification`, never `awarded`.

---

## 7. Dynamic-edition-specific threats

The dynamic LMS edition is server-authoritative. The engine's role
is to compute eligibility; the LMS badge service signs and issues.

| Threat | Control |
|---|---|
| Race condition between eligibility check and issuance | The LMS badge service re-verifies all gates at issuance time (the engine is re-run with the latest Prisma data). |
| Issuance after evidence was revoked | The LMS badge service checks for `revoked` evidence pointers before signing. |
| Issuer key compromise | Annual key rotation; archived public keys for old signatures; HMAC-chained audit trail detects forged signatures. |
| Insider threat (admin mints badges) | Admin actions are logged to `evidence_registry.jsonl` with the admin's signature. Admin can issue but cannot forge a learner's evidence trail. |
| Reviewer collusion (inflated rubric scores) | Reviewer independence (the rubric is gradeable without inferring intent); audit trail; spot-check by a second reviewer for capstone defenses. |

---

## 8. Residual risk summary

| Threat category | Residual risk | Notes |
|---|---|---|
| Spoofing | Low | NextAuth + HTTPS + issuer key rotation. |
| Tampering | Low (LMS) / Medium (static) | Static edition's `localStorage` is fully learner-controlled, but cannot issue credentials. |
| Repudiation | Low | Append-only audit trail + cryptographic signatures. |
| Information disclosure | Medium | LMS API routes need ongoing IDOR review. Static edition stores no sensitive data. |
| Denial of service | Low | Engine is stateless and fast; LMS rate limiter bounds request volume. |
| Elevation of privilege | Low | Engine has no privilege surface; LMS badge service is the privilege boundary. |
| Privacy | Low | Data minimization (pseudonymous `learner_id`); learner-controlled retention on static edition. |

---

## 9. Open security items for Phase 10+

1. **Reviewer second factor.** Reviewer actions on capstone defenses
   should require a TOTP or hardware second factor.
2. **Issuance re-verification.** The LMS badge service must re-run
   the engine at issuance time (not trust a cached eligibility
   report) to defend against evidence-revocation races.
3. **Public verification endpoint.** `GET /api/badge/verify/:signature`
   must be implemented to allow third parties to verify a badge
   without revealing the learner's identity.
4. **Rate limiting on the eligibility endpoint.** Per-session rate
   limiting (`X requests per minute`) to bound DoS.
5. **Audit trail replication.** `evidence_registry.jsonl` must be
   replicated to a write-once-read-many (WORM) target (e.g., AWS
   S3 Object Lock) for tamper-evidence.
6. **GDPR / FERPA review.** A formal privacy review of the LMS data
   flow, especially the cross-border transfer path.
7. **Fuzz testing.** The engine should be fuzz-tested with
   malformed `LearnerProgress` inputs to confirm no crashes and
   no false positives.
8. **Stephen Fry redaction lint.** A lint rule that flags any
   learner-facing string in the engine or LMS badge service that
   contains an undefined acronym.

---

**End of threat model.**
