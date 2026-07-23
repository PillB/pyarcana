# Research dossier — S10 Módulos, packaging y CLI profesional

**Section file:** `src/lib/course/sections/s10-sklearn.ts`  
**Generated/updated:** 2026-07-23T00:31:40.634121+00:00  
**Action:** competitive research for gold-standard expansion (criterion 3)

## Competitive sources (all mandatory classes)

### Coursera / MOOC
- Google IT Automation with Python — packaging scripts & CLI tools
- Meta Back-End Developer (Coursera) — modules and packaging overview

### MIT
- MIT 6.0001 modules; 6.031 Software Construction (concepts of interfaces)

### Harvard
- CS50P libraries & modules; packaging notes in CS50 beyond

### Yale
- Yale software engineering short courses — CLI UX conventions

### Stanford
- Stanford CS41 / practical Python packaging talks (public)

### GitHub (learners + teachers)
- pypa/sampleproject — pyproject.toml layout
- pypa/packaging.python.org examples
- tiangolo/typer & argparse stdlib CLIs

### High-quality video / tutorials
- mCoding packaging series; Real Python __main__ / entry points

## Coverage gaps vs pre-expansion residual
Emphasize if __name__, argv contracts, exit codes, secrets not in git.

## Recommended depth decisions
CLI pass strings + synthetic config; no full PyPI publish required.

## Pedagogy constraints (PyArcana)
- Español peruano primary; English technical terms OK.
- Progressive disclosure: only APIs taught through S10.
- Synthetic data only; ER/scores ≠ fraude/parentesco.
- Fail-closed gates where decisions affect people.

## Decision log
Research supports operational contracts + fixture-based weDo (S01/S40 style), not slogan theory or empty `# TODO` starters.
