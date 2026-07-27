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
- Sentences: **424** | Paragraphs: **266**
- Findings: **121** (high=0, medium=19, low=102)
- Mean quality score (0–10): **8.54**
- Mean Fernández-Huerta: **99.4** (muy fácil)
- Mean words/sentence: **10.52**
- LanguageTool enabled: **False**

## Section ranking (lowest quality first)

| Sec | Score | FH | WPS | Findings (H/M/L) | File |
|-----|------:|---:|----:|-----------------|------|
| S24 | 8.54 | 99.4 | 10.52 | 0/19/102 | `s24-rpa-advanced.ts` |

## Top failure rules (causes & improvements)

### `fragment` (n=90)
- **Cause:** Ver categoría de la regla (heurística o LanguageTool).
- **Improvement:** Revisar extractos en el informe por sección.

### `missing_terminal_punct` (n=15)
- **Cause:** Frases colgadas tras edición o plantillas.
- **Improvement:** Toda oración asertiva cierra con punto.

### `lowercase_after_period` (n=8)
- **Cause:** Ver categoría de la regla (heurística o LanguageTool).
- **Improvement:** Revisar extractos en el informe por sección.

### `repeated_word` (n=4)
- **Cause:** Typo o pegado doble.
- **Improvement:** Eliminar duplicado.

### `long_sentence` (n=2)
- **Cause:** Explicaciones densas sin cortes.
- **Improvement:** Corta en conectores causales/adversativos; mueve ejemplos a código.

### `comma_density` (n=1)
- **Cause:** Subordinación excesiva.
- **Improvement:** Listas o frases independientes.

### `missing_inverted_exclamation` (n=1)
- **Cause:** Ver categoría de la regla (heurística o LanguageTool).
- **Improvement:** Revisar extractos en el informe por sección.

## How to use

- Per-section JSON: `course-state/curriculum_hardening/audits/spanish_quality/SXX_SPANISH_QUALITY.json`
- Full findings embedded per section; worst sentences in `sentence_sample_worst`.
- Re-run: `python3 scripts/spanish_quality_audit.py` (add `--no-lt` offline).

