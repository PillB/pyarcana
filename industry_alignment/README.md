# PyArcana — Industry Alignment Campaign

## What this directory is

`industry_alignment/` is the Graph Memory and durable evidence store for the
**industry alignment** curriculum-hardening campaign on the PyArcana course
(repository: https://github.com/PillB/pyarcana, live site:
https://pillb.github.io/pyarcana/).

It is the single source of truth for:

1. **Source registry** — every canonical file, schema, persistence key,
   assessment authority, and deployment mechanism that the campaign relies on
   (`source_registry.json`).
2. **Execution ledger** — the per-phase, per-cycle progress of the
   orchestrator and its subagents (`execution_ledger.json`).
3. **Evidence registry** — append-only JSONL of every verifiable artifact
   (git SHAs, line ranges, file hashes, screenshots, test outputs) that backs
   any audit claim, badge award, or decision (`evidence_registry.jsonl`).
4. **Per-section audits** — one dossier per section under `section_audits/`,
   cross-referenced to existing `expert_audit/SNN_report.md` and
   `course-state/sNN_phase*.json` artifacts.
5. **Badge requirements and rubrics** — the industry-alignment rubric
   scaffolding (`badge_requirements/`, `badge_rubrics/`).
6. **Decisions log** — durable records of every accepted, rejected, or
   deferred hypothesis (`decisions/`).
7. **Memory** — notes, cycle logs, and two rejection ledgers
   (`memory/notes/`, `memory/cycles/`, `memory/rejected_hypotheses.jsonl`,
   `memory/rejected_badge_claims.jsonl`).
8. **Worklog** — the orchestrator's running narrative (`worklog.md`).

## How it relates to existing repositories of record

| Existing artifact | Owner | Relationship to `industry_alignment/` |
|---|---|---|
| `course-state/` | V3 hardening pipeline (parallel production) | Read-only input. `industry_alignment/` consumes its ledgers but never overwrites them. |
| `expert_audit/` | Stanford STORM + Graph/Loop/Harness auditor fleet (Round 1) + Independent Fixer Campaign (Round 2) | Read-only input. `industry_alignment/section_audits/SNN_*.md` cross-reference the corresponding `expert_audit/SNN_report.md` and add an industry-alignment lens. |
| `learning_roadmap_52_V3.md` | Owner | Primary curriculum contract. `industry_alignment/` treats this as canonical. |
| `el_arte_de_python_roadmap_maestro_52_secciones.md` | Owner | Master roadmap. Complementary to V3. |
| `src/lib/course/sections/sNN-*.ts` | Course authors | Runtime section source. `industry_alignment/section_audits/SNN_*.md` reads these as the live content. |
| `prisma/schema.prisma` | Engineering | Persistence authority. `industry_alignment/source_registry.json` records it as the canonical schema. |

## Phase plan (preview — not committed)

The campaign follows a phased hardening schedule. Phase 0 is the only phase
that has been executed so far; subsequent phases will be planned from the
Phase 0 inventory.

- **Phase 0** — Bootstrap and Repository Reality Check (this directory's
  initial seed).
- **Phase 1+** — to be planned from the Phase 0 gate check.

## Non-goals

- `industry_alignment/` does NOT modify curriculum content. It only reads,
  audits, and writes audit/decision artifacts.
- It does NOT duplicate `course-state/` or `expert_audit/` content. It
  cross-references them.
- It does NOT propose changes during Phase 0. Phase 0 is pure inventory.

## Phase 0 gate check

The Phase 0 gate is recorded in `execution_ledger.json#gate_check` and
reproduced in `phase0_bootstrap_report.md`. As of 2026-07-28T20:27:00Z all
seven gate criteria are met:

- [x] all 52 canonical sections located
- [x] persistence and assessment authorities identified
- [x] static and dynamic behavior distinguished
- [x] legacy progress formats documented
- [x] existing automated and human validation artifacts identified
- [x] live/repository divergences recorded
- [x] no major repository assumption remains unverified

Five divergences were discovered and recorded (`DIV-001` through `DIV-005`),
the most significant being `DIV-001`: section 40's ID in the Prisma seed file
(`agentic-architecture`) does not match the section source file
(`architecture-ddd-decisions`), which silently breaks section 40 exams on the
dynamic LMS.
