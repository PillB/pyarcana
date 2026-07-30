# ADR — Capstone cardinality (13 capstones)

> Status: accepted.
> Date: 2026-07-30.
> Governing spec: Section 3 (Cardinality invariant).
> Source of truth: `src/data/levels.ts` (`CARDINALITY`), `src/data/capstones.ts`
> (module-load invariant).

## Context

PyArcana must commit to a fixed number of capstones so that:

- Learner progress, badges, interfaces, and rubrics have stable anchors.
- The learner UI can render a deterministic grid (4 levels × 3 + 1 final).
- Contract tests can assert *exact* counts without flakiness.
- Backward compatibility (Section 11) is enforceable: a future curriculum change
  must be a migration, not a silent edit.

## Decision

The capstone system has **exactly 13 capstones**:

```
4 levels × 3 principal capstones per level  = 12 principal capstones
1 final transversal capstone (CP-FINAL)     =  1 final capstone
                                            ─────────────────────
                                              13 total capstones
```

### Per-level principal gates

| Level | Section range | Principal gates | Capstones |
|---|---|---|---|
| L1 | S01–S13 | S04, S08, S13 | CP-N1-A, CP-N1-B, CP-N1-C |
| L2 | S14–S26 | S17, S21, S26 | CP-N2-A, CP-N2-B, CP-N2-C |
| L3 | S27–S39 | S30, S34, S39 | CP-N3-A, CP-N3-B, CP-N3-C |
| L4 | S40–S52 | S43, S47, S51 | CP-N4-A, CP-N4-B, CP-N4-C |
| Final | S52 | S52 | CP-FINAL |

### N4-D decision

The N4-D request is **folded into CP-N4-C**. CP-N4-C v2.0.0 expands to include
the requested production multi-agent project via three sub-gates
(`CP-N4-C.1 · S49`, `CP-N4-C.2 · S50`, `CP-N4-C.3 · S51`). **No CP-N4-D principal
capstone is created.** This keeps the total at 13.

### CP-FINAL integration

S52 / CP-FINAL is the transversal final capstone. It is gated at S52 (inside the
level-4 section range) but is **not** counted as a level-4 principal capstone.
CP-FINAL integrates the **12 upstream principal capstones** via the 12
`FINAL_INTERFACES` contracts (see
`architecture/final_integration_contracts.json`).

## Invariant enforcement

The invariant is enforced in **three** places:

1. **Module load** (`src/data/capstones.ts`): `CAPSTONES.length !== 13` throws;
   per-level count ≠ 3 throws; `CP-FINAL` count ≠ 1 throws. The server-rendered
   page refuses to load if any check fails.
2. **Test suite** (`tests/capstones.test.ts`): the *Cardinality invariant*
   describe-block asserts the same counts at test time. There are also
   *Backward compatibility* tests asserting stable IDs (S01–S52, CP-N1-A …
   CP-N4-C, CP-FINAL, L1–L4, B-N1-A … B-FINAL).
3. **Mirror** (`capstone_validation/reality/roadmap_inventory.json`,
   `capstone_validation/reality/capstone_inventory.json`): the JSON mirror
   carries the same counts so reviewers can audit without running code.

## Consequences

- Any change to the capstone count requires a **migration** (see
  `architecture/migration_plan.md`) and a **rollback** path (see
  `architecture/rollback_plan.md`).
- The learner UI grid is deterministic: 4 level sections × 3 capstone cards, one
  final capstone card with the 12-interface side panel.
- The `RUBRICS` registry and `BADGES` array are 1:1 with `CAPSTONES` (13 each).
