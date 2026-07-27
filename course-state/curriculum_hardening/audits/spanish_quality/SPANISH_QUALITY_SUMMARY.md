# Spanish Grammar, Style & Structure Audit

Research-backed audit of learner-facing Spanish prose across active course sections.

## Methods

### Readability (Spanish-specific)
- **Fernández-Huerta (1959)**: `206.84 − 60·(syll/word) − 1.02·(words/sentence)` — Spanish Flesch adaptation.
- **Szigriszt-Pazos / INFLESZ**: `206.835 − 62.3·(syll/word) − (words/sentence)` — perspicuity scale used in Spanish education/health readability work.
- Bands (FH): muy fácil ≥90 … muy difícil <30.

### Structure & style heuristics
- Sentence length (run-on / long / fragment), terminal punctuation, ¿¡ pairing,
  delimiter balance, repeated words, rough DET–NOUN number cues, gerund pile-up,
  comma density, paragraph monotony, English-dominant lines, meta/AI leaks.

### Grammar engine
- **LanguageTool** public API (`language=es`) for agreement, spelling, style rules when enabled.

- Sections audited: **1**
- Sentences: **435** | Paragraphs: **278**
- Findings: **106** (high=0, medium=0, low=106)
- Mean quality score (0–10): **9.27**
- Mean Fernández-Huerta: **87.8** (fácil)
- Mean words/sentence: **11.08**
- LanguageTool enabled: **False**

## Section ranking (lowest quality first)

| Sec | Score | FH | WPS | Findings (H/M/L) | File |
|-----|------:|---:|----:|-----------------|------|
| S19 | 9.27 | 87.8 | 11.08 | 0/0/106 | `s19-databases-orm.ts` |

## Top failure rules (causes & improvements)

### `fragment` (n=96)
- **Cause:** Ver categoría de la regla (heurística o LanguageTool).
- **Improvement:** Revisar extractos en el informe por sección.

### `lowercase_after_period` (n=8)
- **Cause:** Ver categoría de la regla (heurística o LanguageTool).
- **Improvement:** Revisar extractos en el informe por sección.

### `space_before_punct` (n=2)
- **Cause:** Artefacto de formato.
- **Improvement:** Normalizar tipografía española (sin espacio antes de ,.).

## How to use

- Per-section JSON: `course-state/curriculum_hardening/audits/spanish_quality/SXX_SPANISH_QUALITY.json`
- Full findings embedded per section; worst sentences in `sentence_sample_worst`.
- Re-run: `python3 scripts/spanish_quality_audit.py` (add `--no-lt` offline).

