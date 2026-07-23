# Research dossier — S08 Archivos, CSV, JSON y contratos de ingesta

**Section file:** `src/lib/course/sections/s08-pandas.ts`  
**Generated/updated:** 2026-07-23T00:31:40.634121+00:00  
**Action:** competitive research for gold-standard expansion (criterion 3)

## Competitive sources (all mandatory classes)

### Coursera / MOOC
- IBM Data Engineering / Python Project for Data Engineering (Coursera) — CSV/JSON ingestion patterns
- Google Data Analytics (Coursera) — dirty data, schemas, documentation

### MIT
- MIT 6.0001 file I/O lab patterns; MIT Open Learning data wrangling primers

### Harvard
- CS50P File I/O; CS50 SQL intro for schema thinking (conceptual)

### Yale
- Yale Stat computing primers — reproducible data paths

### Stanford
- Stanford CS102 / data science workshop materials — CSV hygiene

### GitHub (learners + teachers)
- pandas-dev/pandas — read_csv dtype/na_values docs examples
- frictionlessdata/frictionless-py — schema validation concepts
- great-expectations/great_expectations — expectation catalogs (patterns only)

### High-quality video / tutorials
- Keith Galli pandas file IO; Data School missing data series

## Coverage gaps vs pre-expansion residual
Need atomic write, quarantine irregular rows, n_in==n_clean+n_quarantine fail-closed.

## Recommended depth decisions
Operational contracts + Peru synthetic regions; progressive disclosure without GE runtime dependency.

## Pedagogy constraints (PyArcana)
- Español peruano primary; English technical terms OK.
- Progressive disclosure: only APIs taught through S08.
- Synthetic data only; ER/scores ≠ fraude/parentesco.
- Fail-closed gates where decisions affect people.

## Decision log
Research supports operational contracts + fixture-based weDo (S01/S40 style), not slogan theory or empty `# TODO` starters.
