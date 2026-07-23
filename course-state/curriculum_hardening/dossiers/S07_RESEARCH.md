# Research dossier — S07 Texto, Unicode y expresiones regulares

**Section file:** `src/lib/course/sections/s07-data-acquisition.ts`  
**Generated/updated:** 2026-07-23T00:31:40.634121+00:00  
**Action:** competitive research for gold-standard expansion (criterion 3)

## Competitive sources (all mandatory classes)

### Coursera / MOOC
- Google IT Automation with Python (Coursera) — string processing & regex modules
- Python for Everybody (University of Michigan / Coursera) — parsing text from files and APIs

### MIT
- MIT 6.0001 Introduction to Computer Science and Programming in Python — str methods, slicing, file I/O
- MIT OpenCourseWare 6.006 notes (string algorithms conceptual) — search cost intuition

### Harvard
- CS50x / CS50P (Harvard) — regular expressions week; Unicode awareness in modern CS50P

### Yale
- Yale CPSC 223 / programming courses (public notes on text processing) — defensive parsing

### Stanford
- Stanford CS106A (Python) — string processing assignments; caution on locale-dependent code

### GitHub (learners + teachers)
- python/cpython Lib/re.py docs examples; unicode HOWTO in CPython docs repo
- explosion/spaCy (tokenizer concepts only — progressive: not required APIs in S07)
- google/diff-match-patch (conceptual similarity; we teach Jaccard didactically)

### High-quality video / tutorials
- Corey Schafer — Python Regex YouTube series
- mCoding — Unicode pitfalls in Python talks

## Coverage gaps vs pre-expansion residual
Stub theory was slogan-level NFC/NFD; need operational contracts (normalize before ==), fail-closed fullmatch, review band for Jaccard without parentesco claims.

## Recommended depth decisions
≥3 paragraphs/heading with Peru synthetic names; 24 exercises with CASO fixtures; no fraud/parentesco from string scores.

## Pedagogy constraints (PyArcana)
- Español peruano primary; English technical terms OK.
- Progressive disclosure: only APIs taught through S07.
- Synthetic data only; ER/scores ≠ fraude/parentesco.
- Fail-closed gates where decisions affect people.

## Decision log
Research supports operational contracts + fixture-based weDo (S01/S40 style), not slogan theory or empty `# TODO` starters.
