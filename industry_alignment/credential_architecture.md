# PyArcana Credential Architecture

**Generated:** 2026-07-28T22:08:04Z  
**Catalog version:** 1.0.0  
**Issuer:** PyArcana Industry Alignment Campaign (issuer of record: PyArcana maintainers)

## 1. Purpose
This document is the canonical architecture for PyArcana's badge
and credential system. It specifies:

- The four badge families and their distinct evidentiary roles.
- The three credential types and where each is issued.
- The non-compensatory critical-competency regime.
- The conservative provisional floors.
- The static vs. dynamic edition contract.
- The legacy-progress migration contract.
- The Stephen Fry redaction (newbie-friendly descriptions).

It is the reference for Phase 7 (implementation) and for any
external audit of the credential system.
## 2. Design constraints (from Phase 6 specification)
1. **Never exceed the evidence collected from each learner.** A
   badge cannot claim a skill the learner has no evidence for.
2. **Not imply occupational seniority.** No 'Senior Data
   Scientist', 'Staff AI Engineer', or 'Master Software
   Engineer' badges. Capability levels are curriculum-internal
   labels.
3. **Distinguish local achievements from verified credentials.**
   Local achievements are motivational markers; verified
   credentials are server-signed and externally auditable.
4. **Require independent evidence (not just guided completion).**
   Theory, I Do demos, and We Do exercises never count toward
   competency badges. Only You Do projects, exams, integrator
   projects, and defenses count.
5. **Have non-compensatory critical competencies.** A single
   critical-competency failure blocks the credential, regardless
   of strength elsewhere.
6. **Conservative provisional floors.** self_check >=85%, You Do
   >=80%, project rubric >=85%, critical competency =100%.
7. **Legacy course completion does NOT fabricate missing badge
   evidence.** Existing learner progress contributes to progress
   badges only.
8. **Stephen Fry redaction.** All learner-facing badge
   descriptions are newbie-friendly with inline jargon
   explanations.
## 3. Badge families
| Family | Credential type | Count | Verification mode | Expires |
|---|---|---:|---|---|
| 1. Progress achievements | `local_achievement` | 5 | `local_only` | No |
| 2. Applied-skill badges | `competency_badge` | 16 | `server_verified` | Yes (3 yrs) |
| 3. Cross-section capability badges | `competency_badge` | 5 | `server_verified` | Yes (3 yrs) |
| 4. Capstone credentials | `verified_credential` | 5 | `server_verified` | Yes (3 yrs) |
| **Total** | | **31** | | |
**Family 1 — Progress achievements** are motivational markers.
They record that the learner walked through a phase of the
curriculum. They are NOT proof of proficiency and they do not
require independent exercise performance above the
section-level self-check floor. They are issued on both the
static GitHub Pages edition (local_only) and the dynamic LMS
edition (server-mirrored).

**Family 2 — Applied-skill badges** are narrow, evidence-based
badges proving a bounded skill bundle. Each maps to 1-3
sections' worth of curriculum plus a bounded independent
exercise. They are server-verified on the dynamic LMS edition
and visible as eligibility previews only on the static edition.

**Family 3 — Cross-section capability badges** require multiple
sections' skills plus an integrated synthesis project. They are
server-verified only.

**Family 4 — Capstone credentials** are the broadest
credentials. They require phase-capstone completion, a
synthesis document, and an oral or written defense. They are
server-verified only and cryptographically signed.
## 4. Credential types and issuance
| Credential type | Static edition | Dynamic LMS edition |
|---|---|---|
| `local_achievement` | Issued locally (localStorage). Visible in learner's local progress view. | Issued locally + mirrored to server. Visible in learner's profile. |
| `competency_badge` | Eligibility preview only. NOT issued. UI banner: "Verification unavailable on the static edition." | Server-verified issuance with cryptographic signature. |
| `verified_credential` | NOT issued. UI banner: "Sign in to the LMS to earn this credential." | Server-verified issuance with cryptographic signature + defense recording. |

The static edition is a read-only learning surface. It can
render the curriculum, accept You Do submissions to
`localStorage`, and display eligibility previews for
competency and verified credentials. It cannot issue
competency or verified credentials because issuance requires
server-side cryptographic signing and rubric verification.
## 5. Non-compensatory critical competencies
The 8 critical competencies from `industry_skill_graph.json`
are non-compensatory. Each is graded against a 4-criterion
rubric; all four criteria must score 100% (full credit) for
the competency to pass. A single failing criterion blocks the
badge.

| Competency ID | Skills covered | Gap? |
|---|---|---|
| `sql_competency` | sql_fundamentals, sql_window_ctes, sql_performance_tuning | sql_performance_tuning is a curriculum gap (Phase 3 §7). Badges requiring this competency are at `pilot` status with a supplementary exercise. |
| `leakage_prevention` | leakage_prevention, model_evaluation | leakage_prevention is a curriculum gap. Badges requiring this competency are at `pilot` status with a supplementary exercise. |
| `selector_resilience` | selector_design, exception_handling_rpa, reframework | reframework is out-of-current-scope (PyArcana's RPA track is Python-based by design). Assessed on Python-based selectors. |
| `type_safety_production_hardening` | python_type_safety, observability, ci_cd, packaging_reproducibility | python_type_safety is a curriculum gap. Badges requiring this competency are at `pilot` status with a supplementary exercise. |
| `mlops_fluency` | model_deployment, mlops_pipelines, drift_monitoring, system_design | No gap. |
| `business_framing_judgment` | business_framing, metric_design, tradeoff_articulation | No gap. |
| `communication_audience_tuned` | written_communication, oral_communication, stakeholder_translation | No gap. |
| `reproducibility_determinism` | packaging_reproducibility, git_workflow, testing_discipline | No gap. |

Badges at `pilot` status (8 of 31) are technically attainable
today, but the learner must complete a supplementary
independent exercise for the gap-affected competency. Once
Phase 4 closes the curriculum gap, the badge is upgraded to
`active` status; existing holders do not need to re-test
(their supplementary exercise evidence is preserved as
equivalent).
## 6. Provisional floors
The provisional floors are conservative (stricter than the
existing exam pass@70 threshold):

| Component | Floor |
|---|---:|
| self_check aggregate | 85% |
| you_do project rubric | 80% |
| section exam (server-graded MCQ) | 85% |
| integrator project rubric | 85% |
| critical competency | 100% |
| minimum overall (weighted average) | 85% |

These floors are the *issuance* floor, not a separate
provisional tier. The dynamic LMS does not issue "provisional"
vs. "full" credentials; it issues the credential when all
floors are met. The static edition renders an "eligibility
preview" when the floors are met in localStorage, but does
not issue.
## 7. Static vs. dynamic edition contract
| Behavior | Static edition (`NEXT_PUBLIC_STATIC_SITE=1`) | Dynamic LMS edition |
|---|---|---|
| Render curriculum | Yes | Yes |
| Accept You Do submissions | To `localStorage` only | To server (Prisma + SQLite) + mirror to `localStorage` |
| Section exam scoring | Local only (UI preview); NOT authoritative | Server-side via `gradeExamAnswers()`; authoritative |
| Issue progress badges | Yes (local_only) | Yes (server-mirrored) |
| Issue competency badges | No (eligibility preview only) | Yes (server-verified) |
| Issue capstone credentials | No (UI banner only) | Yes (server-verified + defense recording) |
| Evidence persistence | `localStorage` keys `python-ds-progress`, `python-ds-lang` | Prisma models: `Progress`, `ExamAttempt`, `ExerciseAttempt`, `FeedbackReport`; plus `BadgeRecord` (new, Phase 7) |
| Cryptographic signature | n/a | Ed25519 over the badge record (issuer private key) |
| Revocation | n/a | Server-side; flips `BadgeRecord.status` to `revoked` |
| Renewal | n/a | Server-side; learner re-defends; new `expires_at` set |

The static edition is for self-study and for learners who
cannot or will not sign in. It can show what they would be
eligible for if they signed in to the LMS. It cannot issue
credentials that an employer could verify, because there is
no server-side signing key.
## 8. Legacy-progress migration
See `progress_migration_plan.md` for the full migration plan.
Summary:

1. Legacy `python-ds-progress` localStorage is read on first
   load of the new badge UI.
2. Each legacy completed section is recorded as
   `activity_completed` for that section's You Do, self-check,
   and exam (if a score is present).
3. Progress badges (`progress_phase0_walked` through
   `progress_journey_completed`) are evaluated against the
   legacy data. If the legacy data shows all 13 sections of a
   phase completed, the corresponding progress badge is issued
   locally (and mirrored to the server on the dynamic edition).
4. Competency badges and capstone credentials are NOT issued
   from legacy data. The learner's eligibility is computed
   against the badge's stricter floors:
   - Legacy exam scores >=85% are accepted as evidence for the
     section exam component.
   - Legacy exam scores in the 70-84% range do NOT satisfy
     the badge floor; a fresh exam attempt is required.
   - Legacy You Do projects must be re-evaluated against the
     current badge rubric; the legacy rubric outcome is not
     accepted as-is.
   - Legacy capstone completion does NOT satisfy any capstone
     credential defense; the defense must be re-done.
5. The learner is shown a clear "legacy migration" panel
   explaining what carried over, what did not, and what they
   need to do to earn each credential.
## 9. Stephen Fry redaction (newbie-friendly descriptions)
Every learner-facing badge description in this architecture
has a `newbie_friendly_description` field with inline jargon
explanations. Examples:

- "BI = Business Intelligence; tools like Tableau, Power BI,
  or Looker turn data into interactive views for non-technical
  stakeholders"
- "RAG = Retrieval-Augmented Generation; it means: when the
  LLM is asked a question, first search a knowledge base for
  relevant context, then feed that context to the LLM so its
  answer is grounded in your data instead of made up"
- "MLOps (Machine Learning Operations) is the engineering
  discipline of running ML in production"
- "Drift = the data the model sees in production slowly
  changing until predictions become wrong"

The redaction is enforced by a lint rule (to be implemented in
Phase 7): any learner-facing string in the badge UI must not
contain an undefined acronym (an acronym not previously
expanded in the same string or in a glossary section).
## 10. Cryptographic issuance (Phase 7 implementation)
Each verified credential is signed with the issuer's Ed25519
private key. The signature covers:

- `badge_id`
- `version`
- `learner_id`
- `issued_at`
- `expires_at`
- `evidence_map` (JSON-canonicalized)
- `critical_competency_scores`

The signature is detached and stored alongside the badge
record. Any third party can verify the signature with the
issuer's public key (published at
`https://pillb.github.io/pyarcana/keys/badge-issuer-public.pem`
on the static edition and at
`https://lms.pyarcana.example/keys/badge-issuer-public.pem`
on the dynamic edition — actual URLs TBD in Phase 7).

The issuer private key is stored in a server-side secret
manager (e.g., AWS Secrets Manager, GCP Secret Manager) and
rotated annually. Old signatures remain valid against the
archived public key.
## 11. Audit and revocation
The audit trail lives in `evidence_registry.jsonl` (already
established in Phase 0). Every state transition (see
`eligibility_state_machine.md`) appends a line. The trail is
append-only and cryptographically chained (each line includes
a SHA-256 of the previous line).

Revocation is a server-side action. It flips the
`BadgeRecord.status` to `revoked`, sets `revoked_at`,
`revocation_reason`, and `revocation_evidence_pointer`. The
badge is removed from the public claim register. The learner
is notified with appeal instructions.

See `revocation_policy` in each badge's catalog entry for the
full trigger list.
## 12. Open items for Phase 7
1. Implement `src/lib/badge/state_machine.ts` per
   `eligibility_state_machine.md`.
2. Add `BadgeRecord` model to `prisma/schema.prisma` with
   fields: `id`, `learner_id`, `badge_id`, `version`, `status`,
   `issued_at`, `expires_at`, `evidence_map` (JSON),
   `critical_competency_scores` (JSON), `signature`, `revoked_at`,
   `revocation_reason`, `revocation_evidence_pointer`,
   `superseded_at`, `successor_badge_id`.
3. Add API routes:
   - `POST /api/badge/eligibility` — compute eligibility for a
     learner+badge pair.
   - `POST /api/badge/issue` — issue a verified credential
     (admin or self-issue with server verification).
   - `POST /api/badge/revoke` — admin-only.
   - `GET /api/badge/verify/:signature` — public verification
     endpoint.
4. Generate the issuer Ed25519 key pair; publish the public
   key; store the private key in a secret manager.
5. Implement the static-edition eligibility preview UI
   (`src/components/badge/EligibilityPreview.tsx`) with a
   clear "Verification unavailable on the static edition"
   banner.
6. Implement the legacy-progress migration script
   (`scripts/migrate_legacy_progress.mjs`) per
   `progress_migration_plan.md`.
7. Implement the Stephen Fry redaction lint rule
   (`scripts/lint_badge_descriptions.mjs`).
8. Address `DIV-001` (section 40 ID mismatch in
   `prisma/seed.ts`) — this blocks the
   `architecture_decision_practice` badge on the dynamic LMS
   because section 40's exam activity is unattainable.

