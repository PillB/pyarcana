# Newbie A (Explorer) — selfcheck batch S14–S26

**Agent:** `newbie_a_live` · persona **explorer**  
**Attempt:** `agentic_A1`  
**Method:** `llm_packet_only_no_generator`  
**Source allowed:** `quiz_batch_14_26.json` theory + iDo only (no solutions / `correctIndex` / attempt_007b / TypeScript)  
**Forbidden honored:** yes — zero Python outside packet for MCQ reasoning  
**Updated:** 2026-07-21 (UTC)

---

## Scope

Filled `selfcheck` on:

| Section | Title | Path |
|--------:|-------|------|
| 14 | NumPy y cómputo vectorizado | `section_14/newbie_a_live.json` |
| 15 | Pandas: ingesta, selección y tipos | `section_15/newbie_a_live.json` |
| 16 | Calidad, limpieza y contratos de datos | `section_16/newbie_a_live.json` |
| 17 | Joins, reshape, groupby y cierre analítico | `section_17/newbie_a_live.json` |
| 18 | EDA, estadística descriptiva e incertidumbre | `section_18/newbie_a_live.json` |
| 19 | Visualización y comunicación accesible | `section_19/newbie_a_live.json` |
| 20 | Automatización robusta de Excel | `section_20/newbie_a_live.json` |
| 21 | Documentos, plantillas y reportes trazables | `section_21/newbie_a_live.json` |
| 22 | Email, identidad y aprobación humana | `section_22/newbie_a_live.json` |
| 23 | Browser RPA con Playwright | `section_23/newbie_a_live.json` |
| 24 | OCR y Document AI | `section_24/newbie_a_live.json` |
| 25 | Endpoints de IA, Hugging Face y prompting evaluado | `section_25/newbie_a_live.json` |
| 26 | Orquestación y VP RPA + AI Analyst | `section_26/newbie_a_live.json` |

Each item: `{question_index, chosen_index, confidence, blocked_on: [], justification_from_packet}` quoting theory/iDo.

---

## Chosen indices (Explorer, packet-grounded)

| Sec | Q0 | Q1 | Q2 | Q3 | n |
|----:|---:|---:|---:|---:|--:|
| 14 | 1 | 1 | 1 | 1 | 4 |
| 15 | 1 | 1 | 1 | 1 | 4 |
| 16 | 1 | 0 | 1 | 1 | 4 |
| 17 | 1 | 0 | 1 | 1 | 4 |
| 18 | 1 | 1 | 1 | 1 | 4 |
| 19 | 1 | 1 | 1 | 1 | 4 |
| 20 | 1 | 1 | 1 | 1 | 4 |
| 21 | 1 | 1 | 1 | 1 | 4 |
| 22 | 1 | 2 | 1 | 1 | 4 |
| 23 | 1 | 2 | 1 | 1 | 4 |
| 24 | 2 | 1 | 1 | 1 | 4 |
| 25 | 1 | 1 | 1 | 1 | 4 |
| 26 | 1 | 1 | 1 | 1 | 4 |

**Totals:** 13 sections × 4 stems = **52** selfcheck answers · **0** blocked · exercises left as pre-existing (this pass = selfcheck only).

---

## Rationale highlights (by section)

### S14 NumPy
- **dtype** = homogeneous element type; shape/ndim/base are not.
- Boolean mask → filter/select (`a[mask]`).
- `axis=0` on 2D → aggregate **by column** (collapse rows).
- Simple slices are usually **views**; mutating can mutate the base.

### S15 Pandas
- **loc** = label selection; iloc = position.
- SettingWithCopy ↔ **chained assignment** / view-copy ambiguity.
- `errors='coerce'` → invalid → **NaN**.
- Export **manifest** ≥ rows, columns, provenance/hash (no PII/passwords).

### S16 Quality contracts
- **required** null → quarantine/fail gate (not silent 0-fill).
- **Conflict** = same key, different attributes (≠ exact dup).
- Quarantine **keeps rejected rows + reason**.
- Schema drift (missing required) → **fail with column name**.

### S17 Joins / groupby close CP-N2-A
- `validate='one_to_one'` → fail bad cardinality.
- Anti-join **left_only** = left orphans.
- `transform` reinjects aggregate to original shape.
- Temporal leakage = using post-cutoff info for past metrics.

### S18 EDA
- Typical ticket under outliers → **median (+IQR)**, not mean alone.
- Correlation = **observed association**, not causation.
- Data note ≥ origin, filters, n, coverage limits.
- Sample bias = sample ≠ population of interest.

### S19 Visualization
- Category magnitudes → **bars, baseline 0**.
- Accessible alternative repeats the **same key numbers**.
- “Lima is best region of Perú” from web sample = **sobreclaim**.
- Caption: unit + source + limitations.

### S20 Excel factory
- openpyxl does **not** auto-evaluate formulas (formula string / cache).
- Merged cells: write **top-left anchor**.
- Manifest audits batch / reconciliation / backups.
- Idempotence: same inputs → same logical result.

### S21 Reporting factory (close CP-N2-B)
- Separate Jinja presentation from Python metrics (audit/reuse).
- PDF with almost no text layer → **needs OCR**.
- Parity = same key metrics across dashboard / Excel / document.
- Closeout: provenance + visual checklist + traceable findings (no `section_passed` from this lane).

### S22 Email + human approval (start CP-N2-C)
- Gate: **sandbox drafts/.eml + human approval** (no real send).
- High email similarity = weak **contact evidence**, not fraud/kinship.
- OAuth **least privilege** (draft scopes, not mail.full).
- Idempotency key reuses same `draft_id` on retry.

### S23 Playwright RPA
- Prefer **get_by_role** (stable, accessible) over CSS nth-child.
- CAPTCHA → **stop + human handoff**.
- **API/export first** before browser RPA.
- Retry only **transient** failures (timeout/net), not captcha/403 business.

### S24 OCR Document AI
- Low field confidence (e.g. RUC 0.6) → **abstain + review queue**.
- Total vs line mismatch → review/correct (not proven fraud).
- Accuracy **per field** because critical fields can fail under good global.
- Hostile/wrong mime (e.g. zip on invoice intake) → reject/review gate.

### S25 HF / evaluated prompting
- Prefer **rules** when deterministic + auditability matters.
- Invalid generator JSON → discard / human review.
- Prompt injection from OCR text: treat as **untrusted**, don’t promote to system.
- AI assist **never auto-labels fraud** in this course — evidence for humans only.

### S26 VP orchestration + N2 regression
- DAG order: **approve before draft_email** (`[…, approve, draft_email]`).
- N2 regression = critical capstone tests + E2E + privacy/security controls.
- Send without approve = **P0 incident** (SLO: 0 sends without approve).
- `fraud_labels` automatic = **0** (human evidence only).

---

## Integrity / method notes

- Did **not** open solutions, `correctIndex`, attempt_007b artifacts, or TypeScript sources.
- Justifications are lexical hooks into theory headings/paragraphs and iDo demoIds from the quiz batch.
- `summary.n_selfcheck` set to 4 on each updated file; `blocked_on` empty on all stems.
- Exercises in these live files were **not** reworked in this batch (pre-existing placeholders remain).

---

## Handoff

Ready for dual-persona compare / validator fairness check once Newbie B completes the same batch. Offline keys remain FIXER-only for `chosen_index` scoring.
