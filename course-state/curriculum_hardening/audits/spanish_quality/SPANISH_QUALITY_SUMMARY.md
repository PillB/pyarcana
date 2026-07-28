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
- Sentences: **429** | Paragraphs: **287**
- Findings: **103** (high=0, medium=3, low=100)
- Mean quality score (0–10): **9.22**
- Mean Fernández-Huerta: **91.0** (muy fácil)
- Mean words/sentence: **9.98**
- LanguageTool enabled: **False**

## Section ranking (lowest quality first)

| Sec | Score | FH | WPS | Findings (H/M/L) | File |
|-----|------:|---:|----:|-----------------|------|
| S46 | 9.22 | 91.0 | 9.98 | 0/3/100 | `s46-gpu-computing.ts` |

## Top failure rules (causes & improvements)

### `fragment` (n=87)
- **Cause:** Ver categoría de la regla (heurística o LanguageTool).
- **Improvement:** Revisar extractos en el informe por sección.

### `lowercase_after_period` (n=10)
- **Cause:** Ver categoría de la regla (heurística o LanguageTool).
- **Improvement:** Revisar extractos en el informe por sección.

### `comma_density` (n=1)
- **Cause:** Subordinación excesiva.
- **Improvement:** Listas o frases independientes.

### `unbalanced_delimiters` (n=1)
- **Cause:** Paréntesis/comillas abiertos en cortes de párrafo.
- **Improvement:** Validar emparejamiento en revisión.

### `missing_terminal_punct` (n=1)
- **Cause:** Frases colgadas tras edición o plantillas.
- **Improvement:** Toda oración asertiva cierra con punto.

### `missing_inverted_exclamation` (n=1)
- **Cause:** Ver categoría de la regla (heurística o LanguageTool).
- **Improvement:** Revisar extractos en el informe por sección.

### `space_before_punct` (n=1)
- **Cause:** Artefacto de formato.
- **Improvement:** Normalizar tipografía española (sin espacio antes de ,.).

### `repeated_word` (n=1)
- **Cause:** Typo o pegado doble.
- **Improvement:** Eliminar duplicado.

## How to use

- Per-section JSON: `course-state/curriculum_hardening/audits/spanish_quality/SXX_SPANISH_QUALITY.json`
- Full findings embedded per section; worst sentences in `sentence_sample_worst`.
- Re-run: `python3 scripts/spanish_quality_audit.py` (add `--no-lt` offline).

