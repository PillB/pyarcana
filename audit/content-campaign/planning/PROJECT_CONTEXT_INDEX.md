# Project context index — content campaign C03

**Captured:** 2026-08-21
**HEAD at discovery:** `7aa825ac9595d5813d28e8a8421aa43ce194678a`
**Branch:** `audit/campaign-c02-s01-s05-20260820`
**origin/main:** `8f018c63` (merge of PR #32, which merged this branch — HEAD is an ancestor of origin/main)
**Working tree at discovery:** 3 modified `course-state/*` report artifacts (generated), 1 untracked reference folder.

This file exists so the campaign can be resumed after context compaction without
re-reading the repository from scratch. It records what was actually inspected,
not what was assumed.

---

## 1. CAMPAIGN_REFERENCE_DIR resolution

Two candidate folders were present in the repository root.

| Candidate | Signature match | Decision |
|---|---|---|
| `PyArcana_Claude_Code_Content_System_2026-08-21_v2/` | Contains **all** the signature files named in the task (`00_EXECUTIVE_REPORT.md`, `03_…`, `04_…`, `05_…`, `10_…`, `11_…`, `12_…`, `19_…`, `CLAUDE_SCAFFOLD/`, `reference/`), plus `source_registry.json` and `MANIFEST.sha256.json` | **SELECTED** |
| `PyArcana_Curriculum_Audit_v3_bundle/` | 5 files; a prior *audit skill/prompt* bundle dated 2026-08-20. No `00_EXECUTIVE_REPORT.md`, no `CLAUDE_SCAFFOLD/`, no reconciliation table | Not the campaign package. Retained as secondary historical reference. |

`CAMPAIGN_REFERENCE_DIR = PyArcana_Claude_Code_Content_System_2026-08-21_v2/`

It is untracked and is treated as **read-only evidence**. It is not staged, not
committed, and not modified. Its conclusions are SHA-bound to `8b8bfc38`, which
is *one commit behind* the discovery HEAD, so every claim in it was re-verified
against the current bodies rather than trusted.

---

## 2. Read in full

**Repository governance**
- `AGENTS.md` — safe-agent policy. Binding. Supplies the protected-path list, the
  zero deletion budget, the preservation-sentinel requirement, and the explicit
  pointer to the canonical writing protocol.
- `docs/policies/HANDCRAFTED_WRITING_PROTOCOL.md` (1151 lines) — canonical text.
  `AGENTS.md` §MUST-10 declares this authoritative and the root `.docx` a
  human-distribution copy, so the Markdown was read rather than the DOCX.
  Sections 3 (editorial standard), 4 (anti-aberration), 5 (anti-bulk-generation),
  10 (0–3 rubric), 13 (hard-failure conditions), 14 (definition of done) govern
  every learner-facing sentence written in this campaign.

**Campaign package**
- `00_EXECUTIVE_REPORT.md`, `04_CURRENT_S01_S52_RECONCILIATION.md`,
  `05_SOURCED_CONTENT_DIFF.md`, `07_PRACTICE_SELFCHECK_PROJECT_MAP.md`,
  `19_SAVE_PROGRESS_COMPATIBILITY.md`.

**Curriculum source (structural, all 52)**
- `src/lib/course/index.ts` — the authoritative import graph.
- `src/lib/types.ts` — the full content data model.

**Curriculum source (body-level, deep read)**
- `s18-data-engineering.ts` — theory T2-B/T3-A/T3-B/T4-A, `youDo`, `selfCheck` (all 8 questions), resources.
- `s36-ai-apis-advanced.ts` — theory T4-A (`Splits, backtests y ventanas temporales`).
- `s32-microservices.ts` — theory T4-A (`Split por entidad, grupo y tiempo`), T4-B.
- `s33-advanced-models.ts` — theory T1-A (`Unidad, target y horizonte`), T4-B (`Validación cruzada por entidad`).
- `s15-stdlib-deep.ts` — theory T4-A (`CSV, Excel y contrato Parquet`).

**Gates and invariants**
- `scripts/v3_regression_counts.test.mjs`, `scripts/check_section_structure.py`,
  `scripts/v3_invariant_validator.py` — read in full; they define the hard
  structural contract (52 / 8 subtopics / 8 demos / 24 exercises per section).
- `scripts/python_content_runtime_audit.py` — extraction logic read far enough to
  confirm that **theory `code` blocks are executed** and classified alongside
  demos. Any code added by this campaign must genuinely run.
- `scripts/glossary_coverage_audit.py`, `scripts/glossary_intro_audit.py` — read
  to understand the SSOT term contract before introducing new terminology.

---

## 3. Sampled (structure inspected, body not exhaustively read)

- All 52 active section files: `index`, `id`, `title`, and the full sets of
  `subtopicId` / `demoId` / exercise-`id` values were extracted mechanically into
  `CURRENT_REPO_BASELINE.json`.
- Theory headings for S15, S32, S33, S36, S46 (used for the reconciliation).
- `src/lib/progress-store.ts` — field and sub-step contract confirmed by grep.
- `src/lib/glossary/terms.ts` — schema and `firstSectionId` mechanism.
- `tests/adversarial/` (60+ files), `scripts/` (70 entries) — inventoried by name;
  the ones relevant to content mutation were read.

## 4. Deliberately excluded from ingestion

`.git/`, `node_modules/`, `.next/`, `out/`, `test-results/`, `tool-results/`,
`expert_audit/` (124 dirs of historical evidence), `worklog.md` (519 KB),
`learning_roadmap.md` (292 KB), `bun.lock`, `tsconfig.tsbuildinfo`,
`reference/PyArcana_previous_research_reference.zip`.

Rationale: these are generated, historical, or superseded. The active import
graph and the current bodies are the authority for implementation facts, and
`AGENTS.md` explicitly warns that historical filenames mislead. That warning is
literally true here — see §5.

## 5. The filename trap (verified, not assumed)

Section **filenames do not describe their content**. The mapping drifted at some
point in the project's history and was never renamed, because renaming would
churn the import graph.

| File | Semantic section it actually holds |
|---|---|
| `s18-data-engineering.ts` | S18 — *EDA, estadística descriptiva e incertidumbre* |
| `s36-ai-apis-advanced.ts` | S36 — *Clustering, anomalías y validación temporal* |
| `s33-advanced-models.ts` | S33 — *ML supervisado y baselines responsables* |
| `s32-microservices.ts` | S32 — *Feature engineering y pipelines sin leakage* |
| `s15-stdlib-deep.ts` | S15 — *Pandas: ingesta, selección y tipos* |
| `s46-gpu-computing.ts` | S46 — *Ingeniería de datos y orquestación de producción* |

Additionally, the exported `id` field is legacy (`section18.id === 'data-engineering'`)
and is a **persisted progress key**. It is not an editorial label and must never
be "corrected" to match the title.

Five files exist on disk but are **not imported**: `s07-pandas.ts`,
`s08-visualization.ts`, `s09-sklearn.ts`, `s10-testing.ts`, `s11-advanced-topics.ts`.
They are `INACTIVE_PRESERVED` under `AGENTS.md` and must not be deleted. Grep hits
inside them are **not** evidence that the active curriculum teaches something —
this mattered directly during reconciliation (see `SOURCE_AUTHORITY_MAP.md` §4).

## 6. Baseline gate results at HEAD (before any mutation)

| Gate | Result |
|---|---|
| `test:v3-counts` | **ok** — 52 sections, 24 setup exercises, 8 demos |
| `test:v3-structure` | **ok** — 8 subtopics / 8 demos / 24 exercises |
| `test:v3-invariant` | **ok** — 0 failures, 52 v3-tagged |
| `test:exam-pedagogy` | **ok** — 1248 seed questions, 416 concepts, p0=0, p1=0 |
| `test:glossary-intro` | **FAIL (pre-existing)** — 2 × P2 forward refs: `Streamlit`, `Embedding` both appear in `rpa-automation` before their declared `firstSectionId` |
| `test:glossary-coverage` | **FAIL (pre-existing)** — 46 P1 terms introduced without a prose hit |

The two glossary failures existed **before** this campaign and are outside its
scope. They are recorded so that a later failure is not misattributed to content
work, and so the campaign can prove it did not worsen them.

## 7. Structural facts that constrain every content decision

From `CURRENT_REPO_BASELINE.json`, generated mechanically at HEAD:

- 52 active sections, exactly 24 exercise IDs each, **1248 globally unique** IDs.
- 8 subtopic IDs and 8 demo IDs per section, all 52 conforming.
- Theory **blocks** are *not* count-constrained; only the distinct `subtopicId`
  set is. Adding a theory block that reuses an existing `subtopicId` keeps the
  set at 8 and is therefore structurally additive.

This is the single most important discovery for implementation strategy: it is
the only mechanism by which substantial new teaching can enter a section without
touching a tracked identity.

## 8. Unresolved at time of writing

Tracked in `OPEN_QUESTIONS_AND_DOUBTS.jsonl`. Nothing here blocks the first
implementation unit.
