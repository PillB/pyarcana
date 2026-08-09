# ADR-001 — Badge Taxonomy

**Status:** Accepted
**Date:** 2026-07-28T22:08:04Z (Phase 6 design); 2026-07-29T00:00:00Z (ADR retroactive, Phase 13)
**Decision maker:** `badge_architect` node (Phase 6); ratified by `reporter` node (Phase 13)
**Supersedes:** none
**Superseded by:** none
**References:**
- `industry_alignment/credential_architecture.md` §3 (badge families)
- `industry_alignment/badge_catalog.json` v1.0.0 (31 badges)
- `industry_alignment/badge_claim_register.md` (public claims)
- `industry_alignment/badge_dependency_graph.json` (87 edges, 8 topological levels)

## Context

PyArcana needed a badge system that would let learners signal
progress and capability to themselves, to peers, and (on the
dynamic LMS edition) to employers — without over-claiming.
The curriculum spans 52 sections across 5 role tracks (Data
Analyst, Data Scientist, RPA Automation Developer, AI/ML
Engineer, Production Python Engineer) and 4 capability
levels (foundation, independent practitioner, advanced
applied, integrated mastery).

The industry reality brief (`industry_reality_brief.md`)
recorded 13 recruiter complaints about bootcamp-issued
credentials: tutorial dependence, MCQ-only assessment,
"Senior"-inflated titles, leakage-prone ML, no reproducibility,
no SQL depth, no type safety, no defense under questioning.
Any badge system that repeated these patterns would amplify
the complaints rather than address them.

The design constraints (from `credential_architecture.md §2`)
were:

1. Never exceed the evidence collected from each learner.
2. Not imply occupational seniority.
3. Distinguish local achievements from verified credentials.
4. Require independent evidence (not just guided completion).
5. Non-compensatory critical competencies.
6. Conservative provisional floors.
7. Legacy course completion does NOT fabricate missing badge
   evidence.
8. Stephen Fry redaction (newbie-friendly descriptions).

## Decision

We adopt a **4-family × 3-credential-type taxonomy** yielding
31 badges:

### Four families

| Family | Credential type | Count | Verification mode | Expires |
|---|---|---:|---|---|
| 1. Progress achievements | `local_achievement` | 5 | `local_only` | No |
| 2. Applied-skill badges | `competency_badge` | 16 | `server_verified` | Yes (3 yrs) |
| 3. Cross-section capability badges | `competency_badge` | 5 | `server_verified` | Yes (3 yrs) |
| 4. Capstone credentials | `verified_credential` | 5 | `server_verified` | Yes (3 yrs) |

### Three credential types

| Type | Static edition | Dynamic LMS edition |
|---|---|---|
| `local_achievement` | Issued locally (localStorage) | Issued locally + mirrored to server |
| `competency_badge` | Eligibility preview only (NOT issued) | Server-verified with cryptographic signature |
| `verified_credential` | Refused (defense must be server-recorded) | Server-verified with cryptographic signature |

### Capability levels (curriculum-internal, NOT industry seniority)

| Level | Meaning | What it is NOT |
|---|---|---|
| `foundation` | Can apply with guidance | NOT "Junior" or "Entry-level" |
| `independent_practitioner` | Can apply independently within a pre-scoped problem | NOT "Mid-level" or "Senior" |
| `advanced_applied` | Can diagnose and design within an existing system | NOT "Senior", "Staff", or "Lead" |
| `integrated_mastery` | Can integrate multiple specialization areas into a defended synthesis | NOT "Principal" or "Distinguished" |

### Badge status lifecycle

Every badge in the catalog has a `status` field:
- `active` — fully designed, evidence-backed, issuable (22 badges)
- `pilot` — cites a gap-affected competency; requires supplementary exercise (9 badges)
- `retired` — deprecated; existing holders keep the credential (0 badges)
- `superseded` — replaced by a newer version (0 badges)

## Alternatives considered

### Alternative A — Single "course completion" badge

**Rejected.** A single completion badge would either (a) be
too easy to earn (issuing on section completion alone, which
the industry brief flags as the #1 complaint) or (b) be too
hard to earn (requiring full capstone defense, which
demotivates learners who can't commit 1000+ hours). The
4-family taxonomy lets learners earn meaningful credentials
at multiple granularities.

### Alternative B — Industry seniority titles ("Junior Data Scientist", "Senior ML Engineer")

**Rejected.** The industry brief explicitly warns against
this (complaint C2: "bootcamp grads call themselves Senior
after a 6-week course"). Industry seniority is a job-context
property, not a curriculum property. The capability-level
labels (`foundation` etc.) describe cognitive load, not
seniority, and the `badge_claim_register.md` explicitly
forbids using them as industry titles.

### Alternative C — Micro-badges per section (52 badges)

**Rejected.** 52 section-level badges would dilute the
signal. A recruiter facing 52 "section walked" badges learns
nothing about capability. The 4-family taxonomy concentrates
signal: 5 progress badges (motivation), 21 competency badges
(bounded skill), 5 capstone credentials (defended
synthesis).

### Alternative D — No badges, only a final credential

**Rejected.** A single final credential provides no
intermediate motivation, no early signal of
specialization, and no path for learners who stop before
the full curriculum. The 4-family taxonomy provides
meaningful credentials at every exit point.

## Consequences

### Positive

- **Granular signal.** Recruiters see exactly what a learner
  can do (applied-skill badge) vs. what they have walked
  through (progress badge) vs. what they have defended
  (capstone credential).
- **Honest separation.** Progress badges cannot be confused
  with competency badges because the credential types and
  verification modes differ.
- **Multiple exit points.** A learner can stop after Phase 0
  (foundation progress + foundation applied-skill badges)
  with a coherent credential set, or continue to Phase 3
  (integrated mastery capstone).
- **Pilot honesty.** Badges citing gap-affected competencies
  are marked `pilot` and gated; the system does not pretend
  to teach what it doesn't.

### Negative

- **Long deepest chain.** `evidence_grounded_ai_systems_capstone`
  (level 7) requires ≈20 prerequisite badges. This is a long
  road. Mitigated by the lattice structure (learners can stop
  at any level).
- **9 pilot badges blocked.** Until the P0 curriculum gaps
  close and supplementary exercises are authored, 9 badges
  cannot be issued. This is honest but may frustrate
  learners. Mitigated by the 22 `active` badges that ARE
  issuable.
- **3-year expiration.** Competency badges and capstone
  credentials expire. This requires a renewal path
  (re-defense) that is not yet implemented. Tracked as
  Phase 14+ work.

### Neutral

- **Catalog versioning.** The taxonomy is versioned
  (`badge_catalog.json` v1.0.0). Any structural change
  (adding a family, renaming a credential type) requires a
  version bump and a new release-gate review.

## Compliance

- **Constraint 1 (never exceed evidence):** Each badge's
  `required_activities`, `required_projects`, and
  `critical_competencies` cite specific evidence the engine
  verifies. ✅
- **Constraint 2 (no seniority):** No badge name contains
  "Senior", "Staff", "Lead", "Principal", or "Master". ✅
- **Constraint 3 (distinguish local vs verified):** The
  `credential_type` and `verification_mode` fields encode
  this. ✅
- **Constraint 4 (independent evidence):** Competency and
  capstone badges require tier-4 (You Do) evidence minimum;
  progress badges accept tier-3 (We Do). ✅
- **Constraint 5 (non-compensation):** See ADR-004. ✅
- **Constraint 6 (conservative floors):** See
  `assessment_validity_report.md §3`. ✅
- **Constraint 7 (legacy non-fabrication):** See
  `progress_migration_plan.md §3`. ✅
- **Constraint 8 (Stephen Fry redaction):** Every badge has
  a `newbie_friendly_description` with inline jargon
  explanations. Verified by Layer 3 test F2. ✅

## Ratification

This ADR retroactively documents the design decision made in
Phase 6 by the `badge_architect` node. The design has been
implemented (Phase 7-9), triple-validated (Phase 10), and
audited (Phase 12). The static-edition release gate is PASS.

---

*End of ADR-001. For the eligibility engine contract, see
ADR-002. For the static-vs-dynamic split, see ADR-003. For
the critical-competency non-compensation gate, see ADR-004.*
