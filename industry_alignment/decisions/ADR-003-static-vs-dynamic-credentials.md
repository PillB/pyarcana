# ADR-003 — Static vs Dynamic Credentials

**Status:** Accepted
**Date:** 2026-07-28T22:08:04Z (Phase 6 design); 2026-07-29T00:00:00Z (ADR retroactive, Phase 13)
**Decision maker:** `badge_architect` node (Phase 6); ratified by `reporter` node (Phase 13)
**Supersedes:** none
**Superseded by:** none
**References:**
- `industry_alignment/credential_architecture.md` §4 (credential types and issuance)
- `industry_alignment/eligibility_state_machine.md` (state transitions)
- `src/lib/eligibility/types.ts` (`EDITION_STATIC`, `EDITION_DYNAMIC`)
- `src/lib/runtime-mode.ts` (`IS_STATIC_SITE`)
- `industry_alignment/progress_migration_plan.md` (legacy data migration)
- `industry_alignment/security_privacy_threat_model.md` (STRIDE threats)

## Context

PyArcana is deployed in two editions:

1. **Static edition** — a pre-built Next.js static export
   hosted on GitHub Pages at
   https://pillb.github.io/pyarcana/. No server, no
   database, no authentication. The only persistent store
   is the browser's `localStorage`. Built from `main` on
   every push via GitHub Actions
   (`.github/workflows/deploy.yml`).
2. **Dynamic LMS edition** — a full Next.js server with
   Prisma + PostgreSQL, NextAuth authentication, server-side
   rubric scoring, and (planned, Phase 14+) cryptographic
   badge signing. Not yet deployed; out of scope for
   Phases 0-13.

The static edition is the *public face* of PyArcana. Anyone
with a browser can use it for free. The dynamic edition is
the *credential-issuing* face — it requires an account and
can verify evidence server-side.

The badge system must work coherently across both editions.
A learner who walks through the curriculum on the static
edition must be able to see meaningful progress, and must
NOT be able to fake a credential. A learner who moves to
the dynamic edition must be able to carry their progress
forward and earn real credentials.

## Decision

We adopt a **strict edition split** for credential issuance:

### 1. Progress badges (Family 1, `local_achievement`)

| Edition | Issued? | Where stored |
|---|---|---|
| Static | **YES** — issued locally | `localStorage['pyarcana-badges']` (planned) |
| Dynamic | YES — issued locally + mirrored to server | `localStorage` + Prisma `Badge` table |

Progress badges are motivational markers. They require only
tier-3 (We Do) evidence, which the static edition can
record (via the existing `python-ds-progress` localStorage).
The engine's `EDITION_STATIC` path returns `awarded` for
progress badges.

### 2. Competency badges (Families 2 & 3, `competency_badge`)

| Edition | Issued? | What the learner sees |
|---|---|---|
| Static | **NO** — preview only | `eligible_pending_verification` state; UI banner: "Verification unavailable on the static edition. Sign in to the LMS to issue this credential." |
| Dynamic | YES — server-verified with cryptographic signature | `awarded` state; signed badge in Prisma `Badge` table |

The static edition cannot verify tier-4 (You Do) evidence
because it has no server to grade rubrics. It can show the
learner their *eligibility preview* (which gates pass,
which fail) but must not issue the credential. The engine's
`EDITION_STATIC` path returns
`eligible_pending_verification` for competency badges that
pass all other gates.

### 3. Capstone credentials (Family 4, `verified_credential`)

| Edition | Issued? | What the learner sees |
|---|---|---|
| Static | **NO** — refused entirely | `eligible_pending_verification` state; UI banner: "This capstone credential can't be earned on the static edition. Please sign in to the LMS to record your defense and earn the credential." |
| Dynamic | YES — server-verified with cryptographic signature; defense recording required | `awarded` state; signed credential in Prisma `Badge` table with defense record |

Capstone credentials require a defense (tier-6 evidence).
A defense is an oral or written examination recorded by a
reviewer. The static edition has no reviewer, no server,
no way to record a defense. It must refuse capstone
issuance entirely. The engine's `EDITION_STATIC` path
returns `eligible_pending_verification` (with `eligible: false`)
for capstones that pass all other gates.

### 4. Legacy data migration

The static edition's existing `python-ds-progress`
localStorage payload is migrated into the new badge system
per `progress_migration_plan.md §3`:

- Legacy section completion → tier-1 (theory) evidence,
  `legacy_only: true`.
- Legacy exam scores ≥85% → tier-1 evidence with the score
  recorded (for progress badges only).
- Legacy exam scores 70-84% → tier-1 evidence, flagged
  `exam_below_badge_floor`.
- Legacy exam scores <70% → no evidence recorded.

**Crucially:** legacy data NEVER satisfies a competency
badge's tier-4 requirement. A learner who completed every
section on the static edition has tier-1 evidence only;
they cannot earn a competency badge without fresh
tier-4 (You Do) evidence graded against a rubric. This is
enforced by the engine's evidence-tier gate (Gate 3,
ADR-002).

### 5. State machine across editions

The full state machine (in `eligibility_state_machine.md`)
applies to the dynamic edition. The static edition
implements only the `not_started → in_progress → eligible →
provisional (preview)` path for competency badges, and the
`not_started → verified` path for progress badges. The
`verified → expired`, `verified → revoked`, and
`verified → superseded` transitions are server-side only.

## Alternatives considered

### Alternative A — Static edition issues competency badges with a "self-reported" tag

**Rejected.** A "self-reported" competency badge is a
contradiction. The industry brief specifically flags
self-reported credentials as worthless (complaint C8:
"bootcamp grads self-report skills they can't demonstrate").
The static edition cannot grade a You Do rubric; any
"competency badge" it issued would be a self-report. The
strict split (static = preview only) preserves the
credibility of the competency badge.

### Alternative B — Static edition issues competency badges with a cryptographic signature from a client-side key

**Rejected.** A client-side key is trivially extractable
(anyone can read the JavaScript bundle). A "signed" badge
from a client-side key is forgeable. Only a server-side
key, never exposed to the client, can produce a
non-forgeable signature.

### Alternative C — No static edition; dynamic LMS only

**Rejected.** The static edition is PyArcana's public face.
It lets anyone try the curriculum for free, without an
account. Removing it would drastically reduce access. The
strict split lets the static edition serve its purpose
(free access, progress tracking, motivational badges)
without compromising credential integrity.

### Alternative D — Static edition issues competency badges but they "upgrade" on the dynamic edition

**Rejected (for now).** This was considered seriously. A
learner earns a "preview" competency badge on the static
edition; when they sign in to the dynamic edition, the
badge "upgrades" to a signed credential if the server
re-verifies the evidence.

The problem: the static edition cannot record tier-4
evidence (no rubric grading). So there is nothing to
"upgrade" — the learner would still need to submit fresh
You Do evidence on the dynamic edition. The "upgrade"
framing is misleading; the learner is actually re-earning
the badge with proper evidence.

The `pending_upgrade` edge type in the badge dependency
graph (9 edges) is reserved for a future version of this
design where the dynamic edition can accept a static-edition
preview as *prima facie* evidence and re-grade only the
critical competencies. This is Phase 14+ work.

### Alternative E — Static edition refuses to show any badge UI

**Rejected.** Learners on the static edition need to see
their progress to stay motivated. The eligibility preview
(showing which gates pass, which fail, what evidence is
missing) is a useful learning tool even without issuance.
Refusing to show any badge UI would remove a key
motivational mechanism.

## Consequences

### Positive

- **Credential integrity.** Competency and capstone
  credentials are only issued where they can be verified
  (dynamic edition with server-side rubric grading and
  cryptographic signing). The static edition cannot
  issue a forgeable credential.
- **Free access preserved.** The static edition remains
  free and account-less. Learners can walk the entire
  curriculum and earn progress badges without signing up.
- **Clear upgrade path.** The static edition's "sign in to
  the LMS" message tells learners exactly what they need
  to do to earn the credential they're previewing.
- **Honest legacy migration.** Existing learner progress
  is preserved (as tier-1 evidence for progress badges)
  but cannot fabricate competency evidence.

### Negative

- **Two code paths.** The engine has `EDITION_STATIC` and
  `EDITION_DYNAMIC` branches. This is more complex than a
  single path. Mitigated by the edition check being the
  *last* gate (Gate 9); all other gates are
  edition-independent.
- **Learner confusion risk.** A learner on the static
  edition might not understand why their "earned" badge is
  only a preview. Mitigated by the clear UI banner and the
  newbie-friendly blocking reason ("Verification
  unavailable on the static edition. Sign in to the LMS
  to issue this credential.").
- **No capstone on static.** A learner who completes
  Phase 3 on the static edition cannot earn the capstone
  credential without moving to the dynamic edition. This
  is honest (capstones require defense) but may
  disappoint. Mitigated by the progress badges (Phase 3
  walked) that ARE issued on static.

### Neutral

- **Phase 14+ work.** The dynamic edition's cryptographic
  signing path (`src/lib/badge/state_machine.ts`) is not
  yet implemented. The engine models the signed state by
  returning `awarded` on `EDITION_DYNAMIC`; the actual
  signing is a separate server-side concern.

## Compliance

- **Constraint 1 (never exceed evidence):** The static
  edition cannot verify tier-4 evidence; it returns
  preview. ✅
- **Constraint 3 (distinguish local vs verified):** The
  edition split makes this explicit. ✅
- **Constraint 7 (legacy non-fabrication):** Legacy data
  is tier 1; cannot satisfy competency gates. ✅
- **Security (STRIDE):** The static edition has no server,
  so no server-side threats apply. The dynamic edition's
  threats (signing key management, rubric tampering) are
  Phase 14+ concerns. ✅ for static.

## Test coverage

- **Layer 1 test 14:** Static edition returns
  `eligible_pending_verification` for competency badges.
- **Layer 1 test 15:** Capstone credentials blocked on
  static edition.
- **Layer 1 test 17:** Progress badges ARE awarded on
  static edition.
- **Layer 3 simulation A3:** Progress badge awarded on
  static.
- **Layer 3 simulation B5:** Capstone blocked on static.
- **Layer 3 simulation B4:** Tampered localStorage cannot
  fabricate competency evidence on static.

## Ratification

This ADR retroactively documents the design decision made
in Phase 6. The strict edition split has been implemented
(Phase 7-9), triple-validated (Phase 10), and the
static-edition release gate is PASS. The dynamic-edition
release gate is CONDITIONAL (Phase 14+ signing path
required).

---

*End of ADR-003. For the badge taxonomy, see ADR-001. For
the eligibility engine, see ADR-002. For the
critical-competency non-compensation gate, see ADR-004.*
