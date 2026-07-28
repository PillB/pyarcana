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
- Sentences: **401** | Paragraphs: **255**
- Findings: **106** (high=0, medium=0, low=106)
- Mean quality score (0–10): **9.01**
- Mean Fernández-Huerta: **96.1** (muy fácil)
- Mean words/sentence: **10.02**
- LanguageTool enabled: **False**

## Section ranking (lowest quality first)

| Sec | Score | FH | WPS | Findings (H/M/L) | File |
|-----|------:|---:|----:|-----------------|------|
| S36 | 9.01 | 96.1 | 10.02 | 0/0/106 | `s36-ai-apis-advanced.ts` |

## Top failure rules (causes & improvements)

### `fragment` (n=93)
- **Cause:** Ver categoría de la regla (heurística o LanguageTool).
- **Improvement:** Revisar extractos en el informe por sección.

### `lowercase_after_period` (n=6)
- **Cause:** Ver categoría de la regla (heurística o LanguageTool).
- **Improvement:** Revisar extractos en el informe por sección.

### `long_sentence` (n=3)
- **Cause:** Explicaciones densas sin cortes.
- **Improvement:** Corta en conectores causales/adversativos; mueve ejemplos a código.

### `missing_inverted_exclamation` (n=2)
- **Cause:** Ver categoría de la regla (heurística o LanguageTool).
- **Improvement:** Revisar extractos en el informe por sección.

### `space_before_punct` (n=1)
- **Cause:** Artefacto de formato.
- **Improvement:** Normalizar tipografía española (sin espacio antes de ,.).

### `possible_plural_det_singular_noun` (n=1)
- **Cause:** Posible desacuerdo de número (heurística).
- **Improvement:** Verificar concordancia determinante–sustantivo.

## How to use

- Per-section JSON: `course-state/curriculum_hardening/audits/spanish_quality/SXX_SPANISH_QUALITY.json`
- Full findings embedded per section; worst sentences in `sentence_sample_worst`.
- Re-run: `python3 scripts/spanish_quality_audit.py` (add `--no-lt` offline).

