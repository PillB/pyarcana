# Decision log — PyArcana capstone system

> Governing spec Section 13 (Harness Artifacts).
> This log records the key design decisions encoded in the canonical TypeScript
> source of truth. Each decision cites its ADR or worklog entry.

## D1 — 13-capstone invariant

- **Decision.** The capstone system has exactly 13 capstones: 4 levels × 3
  principal capstones + 1 final transversal capstone.
- **Enforcement.** Module-load invariant in `src/data/capstones.ts`; test group
  *Cardinality invariant* in `tests/capstones.test.ts`; JSON mirror in
  `reality/roadmap_inventory.json` and `reality/capstone_inventory.json`.
- **Cited in.** `architecture/ADR-capstone-cardinality.md`, `/home/z/my-project/worklog.md`
  (Cardinality invariant locked).

## D2 — N4-D fold into CP-N4-C

- **Decision.** The requested production multi-agent project is folded into
  `CP-N4-C` (v1 → v2.0.0) as three sub-gates (`CP-N4-C.1 · S49`,
  `CP-N4-C.2 · S50`, `CP-N4-C.3 · S51`). No `CP-N4-D` principal capstone is
  created.
- **Enforcement.** `CARDINALITY.n4dDecision === "fold_into_n4c"`; test
  *CP-N4-C preserved (not renamed to CP-N4-D)* in the *Backward compatibility*
  group.
- **Cited in.** `architecture/ADR-N4-C-agentic-harness.md`,
  `architecture/migration_plan.md`, `/home/z/my-project/worklog.md` (N4-D decision).

## D3 — S52 integrates 12 upstream capstones

- **Decision.** `CP-FINAL` is gated at `S52` (inside the level-4 section range)
  but is **not** counted as a level-4 principal capstone. It integrates the 12
  upstream principal capstones via 12 versioned interface contracts
  (`FINAL_INTERFACES`).
- **Enforcement.** Test group *CP-FINAL integration* (12 dependencies present,
  every interface has a versioned contract, contract compatibility, dependency
  graph, rollback evidence, system card, contribution statement).
- **Cited in.** `architecture/ADR-capstone-cardinality.md`,
  `architecture/final_integration_contracts.json`.

## D4 — Level names are curricular, not workplace

- **Decision.** The four levels are named *Guided Foundations*, *Independent
  Applied Practice*, *Advanced Integration and Evaluation*, *Governed
  Production Systems* (EN) / *Fundaciones Guiadas*, *Práctica Aplicada
  Independiente*, *Integración y Evaluación Avanzadas*, *Sistemas de Producción
  Gobernados* (ES). The names avoid *senior / master / experto / job-ready /
  professional / lead / architect*. Every level carries an identical disclaimer.
- **Enforcement.** `LEVELS[*].disclaimer` and `LEVELS[*].dreyfusMapping`
  (each ends with *"curricular skill, not workplace rank"*); rendered in the UI
  hero, every level header, and the exit-capabilities markdown mirror.
- **Cited in.** `levels/public_naming_decision.md`,
  `architecture/ADR-level-language.md`.

## D5 — Stephen Fry register for briefs and theory

- **Decision.** Capstone briefs are handcrafted in the Stephen Fry register:
  elegant, warm, expansive, opening with an international anecdote that raises
  the question the capstone answers. No bulk generation. No placeholders. EN/ES
  redaction ≥ 2 passes (tracked in `redactionPasses`).
- **Enforcement.** `CAPSTONES[*].redactionPasses === { en: 2, es: 2,
  lastUpdated: "2026-07-30" }`; the i18n table in `src/data/i18n.ts` carries
  the register across both languages.
- **Cited in.** `/home/z/my-project/worklog.md` (Build plan item 4).

## D6 — No-key deterministic path

- **Decision.** The CP-N4-C harness always provides a no-key deterministic
  double (`noKeyAdapter`) so the basic validation suite runs without a paid key.
  A missing paid key never blocks the basic flow; it falls back to the
  deterministic double.
- **Enforcement.** `adapterFor()` returns `noKeyAdapter` for `no-key` and as the
  fallback for `local` / `commercial-test`; the rubric critical failure *"No-key
  path missing; mandatory paid key for the basic validation suite"*.
- **Cited in.** `architecture/ADR-N4-C-agentic-harness.md`,
  `reality/runtime_inventory.md`, `validation/runtime_matrix.md`.

## D7 — Critical criteria are non-compensatory

- **Decision.** Rubric criteria with `critical: true` cannot be compensated by
  high scores elsewhere. The base rubric marks `D`, `T`, `R`, `S`, `U` as
  critical; every capstone adds its own critical extras.
- **Enforcement.** `RUBRICS[*].criteria[*].critical === true` +
  `RUBRICS[*].criticalFailures[]` (common + per-capstone).
- **Cited in.** `rubrics/assessment_validity_report.md`,
  `rubrics/critical_failure_matrix.json`.

## D8 — localStorage cannot forge a verified award

- **Decision.** Learner progress in `localStorage` is a UX affordance only;
  assessment is server-side. A `localStorage` edit cannot produce a
  server-verified badge record.
- **Enforcement.** The disclaimer in `src/app/page.tsx`; the `/api/copilot/run`
  route is the only server-side execution path for CP-N4-C.
- **Cited in.** `rubrics/assessment_validity_report.md`,
  `architecture/rollback_plan.md`.
