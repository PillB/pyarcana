# Decision Log — product_hardening

**Format:** Sequential decisions (D-001, D-002, …). Each entry records the decision, the alternatives considered, the trigger that may re-open it, and the primary-source citations that justified it.

---

## D-001 — Prisma is the authoritative data store; Firestore is an optional write-only mirror

- **Date:** 2026-07-29
- **Phase:** 0
- **Status:** Accepted
- **Decision owner:** `product_hardening` agent
- **Trigger to re-open:** Any future proposal to (a) make Firestore authoritative for any subset of data, (b) introduce a second relational store without a superseding ADR, or (c) add a Firestore read path.
- **Full ADR:** `product_hardening/architecture/ADR-authoritative-data-store.md`
- **Primary sources:** `prisma/schema.prisma`, `src/lib/firebase/{admin,sync}.ts`, `firestore.rules`, `src/lib/eligibility/types.ts`
- **Alternatives considered:**
  - A. Firestore authoritative — rejected (eventual consistency, Spark-tier limits, deny-all client rules).
  - B. Dual-authoritative last-write-wins — rejected (always drifts; loses awards/cohort state).
  - C. SQLite-only, retire Firestore now — deferred (mirror is ~140 lines; revisit in Phase 3+ if no read path emerges).
  - D. Postgres from day one — deferred (Prisma makes the migration a one-day exercise when the SQLite write bottleneck appears).
- **Compliance gates:**
  1. No new Firestore read paths without a superseding ADR.
  2. No new authoritative state in `localStorage`.
  3. No new in-memory-only badge awards (must persist via Prisma `BadgeAward` once introduced).
  4. Every new Prisma model ships with a migration (`prisma migrate`, not `db push` in CI/prod).
  5. Firebase sync helpers may extend only to mirror new Prisma models, never to substitute for them.

---

## D-002 — Phase 1 badge revalidation bases claim_strength on the industry reality brief, not on aspirational roadmap claims

- **Date:** 2026-07-29
- **Phase:** 1
- **Status:** Accepted
- **Decision owner:** `product_hardening` agent
- **Trigger to re-open:** A new industry research wave that materially changes any of the 62 skill nodes or 8 critical competencies in `industry_skill_graph.json`.
- **Primary sources:** `industry_alignment/industry_reality_brief.md` (2,279 lines), `industry_alignment/curriculum_gap_matrix.md` (41 gaps), `industry_alignment/industry_skill_graph.json` (62 skill nodes), `src/lib/eligibility/badge_catalog.json` (31 badges).
- **Rule:** A badge is `overclaimed` if its `public_claim` asserts a skill or competency that the curriculum does not teach at the required level (i.e., is blocked by a P0/P1 gap), or if its `roles_aligned` lists a role whose `role_skill_taxonomy.json` requires a skill absent from the badge's `skill_nodes`. A badge is `underclaimed` if its `skill_nodes` cover more role-required skills than its `public_claim` discloses. Otherwise `defensible`.

---

## D-003 — Phase 1 decisions are limited to retain / rename / strengthen / split / merge / retire; no source-code edits in this phase

- **Date:** 2026-07-29
- **Phase:** 1
- **Status:** Accepted
- **Decision owner:** `product_hardening` agent
- **Trigger to re-open:** Phase 3+ implementation sprint.
- **Rule:** The output of Phase 1 is a claim matrix and gap report. Catalog edits, schema changes, and engine patches are deferred. A decision of `retire` does not execute a retirement — it records the recommendation with the evidence required to act on it later.
