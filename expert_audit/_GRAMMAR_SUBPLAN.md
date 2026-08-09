# Plan: Spanish Grammar, Style & Structure Audit (S01–S52)

This is the shared **grammar-audit subplan** that every section auditor (S01–S52)
must apply for the "research online and find heuristics and ways to measure if a
sentence is a correct grammar and style and structure in spanish" dimension of
the verbatim Curriculum Auditor instructions.

## Goal
Research-backed measurement of whether learner-facing Spanish in each course
section is grammatically correct, stylistically sound, and structurally
clear—**per paragraph and per sentence**—then report failures, root causes, and
concrete improvements.

## Research findings (methods we will use)

### A. Spanish readability / structure formulas (surface metrics)
| Metric | Formula / idea | What it measures |
|--------|----------------|------------------|
| **Fernández-Huerta (1959)** | `206.84 − 60·(syllables/word) − 1.02·(words/sentence)` | Spanish Flesch adaptation: ease of reading |
| **Szigriszt-Pazos / INFLESZ** | `206.835 − 62.3·(syllables/word) − (words/sentence)` | Spanish "perspicuity"; used in education/health readability literature |
| **Words per sentence (WPS)** | mean length | Structural load; pedagogy soft target ~15–32 for technical ES |
| **Syllables per word (SPW)** | rough Spanish vowel-group heuristic | Lexical complexity |

**FH interpretive bands (classic):** ≥90 muy fácil → <30 muy difícil. For
*technical* curriculum, "normal / bastante difícil" (~50–70) is often healthy;
extreme easy may mean under-teaching; extreme hard means cognitive overload.

Sources: Spanish readability formula surveys (Fernández-Huerta,
Szigriszt-Pazos/INFLESZ), LanguageTool Spanish grammar tooling, general style
guidance on sentence length and punctuation pairing in Spanish.

### B. Rule-based grammar & style engine
- **LanguageTool** (`language=es`) via public HTTP API — agreement, spelling,
  typography, style rules.
- Rate limits (free public API): ~20 req/min, ~20k chars/request → batch **one
  or few chunks per section** with sleep, not one request per sentence.

### C. Pedagogical Spanish heuristics (curriculum-specific)
Applied to **every sentence** and **every paragraph** offline (no API cost):

| Rule | Severity | Cause signal | Improvement |
|------|----------|--------------|-------------|
| Run-on (>45 words) / long (>32) | H/M | Dense subordination, lists inside prose | Split; move examples to code/lists |
| Missing terminal `.?!` | M | Editing fragments | Close sentences deliberately |
| Missing `¿` / `¡` | M/L | English calque | Pair Spanish inverted marks |
| Unbalanced `()[]«»""` | M | Cut/paste / markdown | Rebalance delimiters |
| Repeated word (`de de`) | M | Typo | Delete duplicate |
| Rough DET–NOUN number cue | L | Concordance slip (false positives on tech terms) | Manual verify gender/number |
| English-dominant sentence | M | Residual EN titles | Translate; keep EN only as `code` |
| Meta/AI/TODO leak | H | Authoring residue | Pure teacher voice |
| Gerund pile-up (≥3) | L | Generated style | Prefer finite verbs |
| High comma density | L | Hypotaxis | Lists / shorter clauses |
| Paragraph = one long sentence | M | No pedagogical segmentation | 2–4 sentences, one focus each |
| Anaphoric monotony (same sentence start) | L | Template rhythm | Vary openings |
| Space-before-punct / double space | L | Format noise | Normalize Spanish typography |

### D. Composite section score (0–10)
Start at 10; subtract weighted high/medium/low findings; light penalty if FH is
extreme; density-normalize by sentence count. Used for ranking sections, **not**
as a claim of absolute linguistic truth.

## Scope of text
- **Active 52 sections** from `src/lib/course/index.ts` only (ignore dual
  inactive files).
- Extract learner-facing prose fields: `intro`, `why`, `instruction`,
  `description`, `hint(s)`, `feedback`, `heading`, `edgeCases`,
  objectives/takeaways, callout `content`/`label`, etc.
- **Exclude** pure code blocks, `starterCode`/`solutionCode` bodies, id-only
  strings.
- Spanish signal filter: require Spanish function-word markers or accents so
  English-only scaffolding is skipped or flagged as `english_dominant`.

## Implementation (for the grammar dimension of your audit)
You may implement a lightweight helper or compute by hand. Pipeline per section:
1. Parse TS string/template literals for prose keys.
2. Split into paragraphs → sentences (Spanish-aware: `¿¡`, light abbreviation
   protection).
3. For each unit: compute FH, SP, WPS, SPW + heuristic findings.
4. Optionally concatenate section prose → LanguageTool chunk(s) (`es`) with
   throttling (if API is reachable; otherwise heuristic-only is acceptable).
5. Record metrics + findings + worst sentences in your section report.

## Deliverables (within your section report)
1. Method note (research summary).
2. Per-sentence / per-paragraph metrics and finding lists for the section.
3. Cause → improvement playbook with section-specific samples.
4. No automatic rewrites in this pass (audit-only; propose diffs, do not apply).

## Out of scope (this pass)
- Auto-editing the section.
- Full semantic discourse coherence (anaphora resolution beyond monotony).
- Human CEFR labeling of every sentence.
- Premium LanguageTool features / private server.

## Validation
- Nonzero prose extraction, FH in plausible range.
- Document known false-positive classes (tech terms, code-adjacent Spanish).

## Risks & mitigations
| Risk | Mitigation |
|------|------------|
| LT rate limit / downtime | Chunk + sleep; heuristic-only fallback; cache errors as info findings |
| False positives on code/tech nouns | Filter code fields; severity "low" on rough DET–NOUN |
| Template strings with `${}` | Strip interpolations before analysis |

## Success criteria
- Research methods documented in the section report.
- Every extracted sentence/paragraph scored with structure metrics.
- Findings include severity, cause, improvement, excerpt.
