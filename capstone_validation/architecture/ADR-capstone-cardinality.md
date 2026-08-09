# ADR — Capstone Cardinality (frozen)
**Status:** Accepted · **Date:** 2026-07-29

The cardinality contract is frozen at **thirteen capstones**: 4 levels × 3 + 1 final.
Exactly three principal capstones per level. One transversal final. **No CP-N4-D.**
The requested production multi-agent project is folded into CP-N4-C (see ADR-N4-C).
CP-FINAL integrates exactly twelve upstream capstones.

Enforced by `assertCardinalityInvariant()` in `src/lib/capstones/catalog.ts` and by
`tests/adversarial/test_capstone_cardinality.py`. A future CP-N4-D is permitted only
after an explicit ADR plus a complete migration of all references.
