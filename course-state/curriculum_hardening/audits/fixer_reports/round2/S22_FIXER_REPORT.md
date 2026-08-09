# S22 Fixer Report (Round 2) — Email, identidad y aprobación humana

**Role:** Second-round Section Fixer · Technical Editor · Pedagogical Rewriter  
**Run date:** 2026-07-25  
**Task ID:** FIXER-R2-S22  
**Status:** `fixed_validated`

---

## 1. Section identification and sources reviewed

| Field | Value |
|--------|--------|
| Section number / title | **22** — Email, identidad y aprobación humana |
| Canonical file | `src/lib/course/sections/s22-rapidfuzz-entity.ts` |
| Live route | https://pillb.github.io/pyarcana/#rapidfuzz-entity |
| Internal ID | `rapidfuzz-entity` (legacy slug retained for progress/URLs; content is email + HITL, **not** RapidFuzz) |
| Primary Explorer report | `course-state/curriculum_hardening/audits/explorer_reports/S22_EXPLORER_REPORT.md` |
| Expert report | `expert_audit/S22_report.md` |
| Expert-2 audit | `expert_audit/expert_2_audit/Section 22 Quality Audit.docx` |
| Spanish-quality JSON (pre) | `course-state/curriculum_hardening/audits/spanish_quality/S22_SPANISH_QUALITY.json` (pre-fix score **8.22**) |
| Grammar plan | `expert_audit/_GRAMMAR_SUBPLAN.md` |
| Campaign / fleet context | `expert_audit/CAMPAIGN_SUMMARY.md`, Spanish fleet summaries |
| Round-1 Fixer (context only) | `course-state/curriculum_hardening/audits/fixer_reports/S22_FIXER_REPORT.md` |
| Assessment surface | Public `selfCheck` (5 MCQs) in canonical file; authenticated exam bank keyed `rapidfuzz-entity` not modified this pass |
| Validation | Python contract checks (idempotency `[:16]`, SM trail, host allowlist, theory contract); Spanish audit `--from 22 --to 22 --no-lt` |

**Scope obeyed:** Only `s22-rapidfuzz-entity.ts` was edited. No `SectionView.tsx`, no other sections, no id/filename migration.

**Anti-aberration:** No scripts, generators, loops, templates, or bulk mechanisms manufactured educational prose. Automation was used only for mechanical validation (Spanish metrics, contract execution, residual greps). The single token replace `CASO-LIM-022` → `Caso 22` was a mechanical identity cleanup of a taxonomy tag, not prose generation.

---

## 2. Summary of changes applied

### Reality check (Phase 2)

Round-1 Fixer had already resolved nearly all Explorer P0/P1 pedagogical defects (V3/RapidFuzz meta-leaks, SM vocabulary, Pass-string alignment, host allowlist via real host, humanized We Do instructions, You Do rubric, icon `Mail`, S21→S23 connective tissue). Expert report score **7.0/10** reflected remaining Spanish/orthography, cognitive-load, taxonomy-leak, and platform residuals.

Expert-2 raised provider-truth issues (synthetic OAuth names, `@example.pe` not RFC-reserved, escape vs. “full sanitization”) that were partially active and were addressed surgically without breaking the lab capability model.

### Resolution table

| Issue | Source | Status before R2 | Change applied | Validation |
|-------|--------|------------------|----------------|------------|
| Exp 01 / M1 V3 RapidFuzz disclaimer | Explorer | Already fixed | Re-validated CP-N2-C intro without V3/id freeze | Grep |
| Exp 02 / M2 `rapidfuzz_er_topic` | Explorer | Already fixed | Contract prints `gates 4` only | Exec |
| Exp 03 / M3 gate V3 rubric | Explorer | Already fixed | Student-facing safety/MIME/privacy criteria | Read |
| Exp 04 / M4 V3 resources | Explorer | Already fixed | “sección de email y aprobación humana” | Read |
| Exp 05 / M6 DEFECT factory ×24 | Explorer | Already fixed | Human instructions + `# A corregir` | Read |
| Exp 06 weDo leak | Explorer | Already fixed | “ejercicios guiados” | Grep |
| Exp 07 Pass vs multi-line output | Explorer | Already fixed | Multi-line “Salida esperada” contracts | Spot |
| Exp 08 SM vocab | Explorer | Already fixed | `pending_review` / `needs_edit` end-to-end | Grep/exec |
| Exp 09 key length `[:16]` | Explorer | Already fixed | Theory/I Do/We Do/You Do unified | Exec `0da400d6c9b3f756` |
| Exp 10 score 0.86 vs 0.92 | Explorer | Already fixed | Explicit bridge in ethics prose | Read |
| Exp 11 substring allowlist as solution | Explorer | Already fixed | `urlparse` / `host_ok`; substring as anti-pattern | Exec |
| Exp 12–18, 20 pedagogy polish | Explorer | Mostly fixed R1 | Preserved; no regression | Editorial |
| Exp 15 / Exp 19 id + hours | Explorer | Product debt | **Preserved** `id: "rapidfuzz-entity"`; hours 19 | Residual |
| Expert I-01 id/filename/URL | Expert | Structural | Deferred (compatibility migration) | Residual |
| Expert I-02 RichText markdown | Expert | Platform | **Not fixed** (`SectionView.tsx` global) | Residual |
| Expert I-03 `la revisor` | Expert + SQ high | **Active** | → `la revisora` (3×) | Grep clean |
| Expert I-04 `vs` | Expert + SQ | **Active** | → `vs.` (3×) | Grep 0 bare `vs` |
| Expert I-05 `URLs` | Expert | **Active** | → `URL` | Read |
| Expert I-06 `auto-aprueba` | Expert | **Active** | → `autoaprueba` | Grep |
| Expert I-07 comma before `pero` | Expert | **Active** | Added comma (T3-B-E2) | Read |
| Expert I-08 `similaridad` | Expert | **Active** | → `similitud` (theory + Q5) | Grep |
| Expert I-09 `appendea` | Expert | **Active** | → `agrega` | Grep |
| Expert I-10 `checklist de compliance` | Expert | **Active** | → `lista de verificación de cumplimiento` | Grep |
| Expert I-11 `CASO-LIM-022` | Expert | **Active** | → `Caso 22` (prose, comments, contract case) | Grep 0 |
| Expert I-12 subtopic IDs | Expert | Metadata only | Retained technical `S22-T*` | N/A |
| Expert I-13 CP-N2-C + HITL gloss | Expert | **Active** | Dictionary + jobRelevance gloss | Read |
| Expert I-14 jobRelevance run-on | Expert + SQ | **Active** | Split opener; incident list as own sentence | Editorial |
| Expert I-15 iDo.intro run-on | Expert + SQ | **Active** | 6-item decision list | Editorial |
| Expert I-16 dictionary wall | Expert + SQ | **Active** | Bulleted definition list | Editorial |
| Expert I-17 ethics run-on | Expert | **Active** | Split 0.86 / 0.92 / claims | Editorial |
| Expert I-18 T1-B run-on | Expert | **Active** | Split host-bypass sentence | Editorial |
| Expert I-19 long We Do instructions | Expert | Soft limit | Left (contracts need multi-line outputs) | Residual low |
| Expert I-20 Kleppmann `— select` | Expert | **Active** | → `capítulos selectos` | Read |
| Expert I-21–I-26 optional/FP | Expert | Mixed | `filtra` gloss clarified; voseo FP ignored | Editorial |
| Expert I-25 tagline density | Expert | Optional | Split into two sentences | Read |
| Expert2 OAuth fictional scopes | Expert-2 P1 | **Active** | Lab capabilities vs. real Gmail URI scopes; `gmail.compose` can send | Editorial |
| Expert2 `@example.pe` | Expert-2 P1 | **Active** | Gate callout: course allowlist, not RFC non-routable | Editorial |
| Expert2 “sanitization” overclaim | Expert-2 | Partial | Named **escape contextual** as first control, not full prod sanitizer | Editorial |
| Expert2 approval↔message hash | Expert-2 | Active depth | **Residual** (would enlarge SM/You Do contract) | Deferred |
| Expert2 5 vs 8 public MCQ | Expert-2 | Roadmap delta | **Residual** (5 strong ethics/gates MCQs retained; bank has 24 variants) | Residual |
| SQ repeated_word run/run_id | Spanish JSON | Medium FP | Rephrased callout “meta (campo `run_id`…)” | SQ |
| SQ missing_terminal_punct edgeCases | Spanish JSON | Medium | Periods + full sentences on key edgeCases | SQ |
| SQ filtra filtra | Spanish JSON | Medium | Reworded jerga gloss | SQ |
| Cross-cutting RichText | Campaign | Platform | **Not fixed** | Residual |

**Post-fix Spanish metrics (validation only):** quality_score **10.0** / FH **73.8** (was 8.22 / 74.1); findings 26, all **low** (style/structure noise and intentional code tokens under `--no-lt`).

---

## 3. Full corrected content or precise complete diffs

Product file: `src/lib/course/sections/s22-rapidfuzz-entity.ts` (single authority; ~1915 lines after R2).

### Diff group R2-A — Spanish orthography and agreement (Expert I-03…I-10)

- `la revisor` → `la revisora` (callout T1-A; theory T1-B; theory T4-A)
- `vs` → `vs.` (theory T2-A; callout T2-B; resources Gmail note)
- `URLs` → `URL` (T1-B-E3 instruction)
- `auto-aprueba` → `autoaprueba` (theory T4-A)
- Comma before `pero` (T3-B-E2 instruction)
- `similaridad` → `similitud` (theory T3-A; self-check Q5)
- `appendea` → `agrega` (T4-B-E3 instruction)
- `checklist de compliance` → `lista de verificación de cumplimiento` (theory T3-B)
- Kleppmann label: `— select` → `— capítulos selectos`

### Diff group R2-B — Cognitive load and glossary (Expert I-13…I-18, I-25)

**Tagline**

```text
Crea borradores en sandbox o archivos .eml. Ningún correo real se envía automáticamente; todo destinatario requiere confirmación humana.
```

**jobRelevance** — split “enviarlo mal” run-on; added CP-N2-C parenthetical gloss.

**Dictionary (theory[0])** — markdown list with CP-N2-C + HITL entries first.

**iDo.intro** — six decision bullets under “fíjate en la **decisión**”.

**T3-A ethics** — three sentences separating 0.86 exercise, 0.92 MCQ, and claim boundary.

**T1-B host policy** — split never-substring rule from bypass example; named escape contextual.

### Diff group R2-C — Taxonomy leak (Expert I-11)

All learner-visible and code-comment occurrences of `CASO-LIM-022` → `Caso 22`, including theory contract:

```python
"case": "Caso 22"
# output:
# case Caso 22
# gates 4
# auto_send_ok False
```

We Do intro: “Cada starter del Caso 22…” (removed “placeholder vacío” meta phrasing).

### Diff group R2-D — Expert-2 technical honesty (OAuth / domains / escape)

- T2-A paragraphs: lab **capacidades sintéticas** vs. real Gmail URI scopes; note that `gmail.compose` can send; draft-only = app policy + least privilege.
- T2-A callout: lab deny `mail.send`/`mail.full`; real Gmail requires reading the URI.
- Gates callout: `@example.pe` is course allowlist, not RFC-reserved non-routable.
- T1-B: `html.escape` framed as **escape contextual**, first control, not full production sanitizer.

### Diff group R2-E — Edge-case redaction (Spanish medium)

Terminal punctuation and full sentences on host-bypass, draft status, SM invalid approve, key body_ver, race conditions, audit retry edgeCases.

### Structure preserved

- 9 theory blocks, 8 I Do demos, 24 We Do exercises, You Do + 6-criterion rubric, 5 self-check MCQs, resources.
- Safety invariants: draft-only, human approval, synthetic lab recipients, match≠fraude, least privilege (lab + provider honesty), idempotent retry `[:16]`.
- Platform id `rapidfuzz-entity` and filename retained for progress/URL compatibility.

---

## 4. After-Fix Validation Report

| Check | Result |
|-------|--------|
| Explorer ISSUE-01…20 disposition | All fixed in R1 or this R2 pass, except id migration (deferred) and platform RichText (global) |
| Expert I-01…I-26 disposition | Fixed, already fixed, optional no-op, or residual documented |
| Expert-2 OAuth/domain/escape | Fixed surgically; message-hash bind + 8 MCQ deferred |
| Spanish quality before → after | **8.22 → 10.0** (FH 74.1 → 73.8; findings 111 → 26 low-only) |
| Idempotency key `sha256(b'run\|to\|v1')[:16]` | `0da400d6c9b3f756` matches section contract |
| Theory contract output | `case Caso 22` / `gates 4` / `auto_send_ok False` |
| Host allowlist E3 contract | `example.pe` ok; `evil.test` blocked |
| SM trail submit→approve | `['pending_review', 'approved']` |
| Residual greps | 0 hits: `CASO-LIM-022`, `similaridad`, `auto-aprueba`, `appendea`, `checklist de compliance`, `la revisor `, `En V3`, `rapidfuzz_er`, `gate V3`, bare `vs` |
| Markdown `**bold**` in callouts/jobRelevance | Still present as Markdown source; **renders as literal asterisks** until Global RichText fix (documented residual) |
| Authenticated exam bank | Not modified; key remains `rapidfuzz-entity` |
| Previous/next continuity | S21 package → S22 draft/HITL → S23 web adapter prose intact (`cpn2c-01`) |
| Accessibility | Synthetic data; no real SMTP; lists improve scan of dictionary and I Do decisions |

**Explicit statement:**  
No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content. Automation was used only for mechanical validation.

---

## 5. Residual risks and later recommendations

### Section-local residuals

- **We Do transfer depth** remains deliberately compact (micro-contracts). Optional future: one deeper SM transfer that binds approve to a body hash.
- **Public self-check** has 5 MCQs (strong ethics coverage); roadmap/Expert-2 “8 items” may be satisfied by authenticated bank (24 variants) — confirm with assessment agent.
- **Gender of “revisor”**: agreement errors fixed (`la revisora`); some generic masculine role nouns remain for readability (common in technical Spanish).

### Repository-wide / platform

- **`SectionView.tsx` RichText** for `jobRelevance`, `callout.content`, `step.instruction`, `step.feedback`, `project.context` — Global Agent A.
- **Legacy id/filename** `rapidfuzz-entity` / `s22-rapidfuzz-entity.ts` — Global Agent C migration with aliases.
- **Master roadmap** still listing FastAPI for S22 — docs debt outside section file.

### Deferred product migrations

- Do not rename `id` without progress key aliases and exam-bank key migration.

---

## 6. Updated Graph Memory notes

```yaml
section: S22
id: rapidfuzz-entity   # compatibility; content = email + HITL
title: Email, identidad y aprobación humana
fixer_r2_status: fixed_validated
fixer_r2_task: FIXER-R2-S22
scores:
  explorer_baseline: 7.2
  expert_baseline: 7.0
  spanish_pre: 8.22
  spanish_post: 10.0
capstone_edge:
  - S21.ReportingFactory.package_approved -> S22.EmailDraft.pending_review (STRONG)
  - S22.EmailDraft -> S23.WebAdapter (STRONG, cpn2c-01 thread)
safety_invariants:
  draft_only_no_auto_send: STRONG
  human_approval: STRONG
  match_neq_fraude: STRONG
  synthetic_lab_recipients: STRONG  # example.pe = course allowlist (not RFC-reserved)
  least_privilege_scopes: STRONG_LAB  # synthetic capabilities + Gmail URI honesty note
  idempotent_retry_16hex: STRONG
resolved_defect_nodes:
  - spanish_la_revisor
  - vs_period
  - similaridad_similitud
  - caso_lim_taxonomy_leak
  - dictionary_and_ido_runons
  - oauth_lab_vs_provider_honesty
  - example_pe_disclaimer
  - escape_vs_sanitizer_framing
remaining_risks:
  - platform_richtext_markdown_leak
  - legacy_id_rapidfuzz_entity
  - optional_message_hash_on_approve
  - public_mcq_count_vs_roadmap_8
preserve:
  - ethics_matching_disclaimer_x13
  - code_output_integrity_gold
  - eight_subtopic_lattice
  - no_real_smtp_happy_path
```

---

## 7. Files changed

| File | Why |
|------|-----|
| `src/lib/course/sections/s22-rapidfuzz-entity.ts` | Only product edit: Spanish, cognitive load, taxonomy, Expert-2 technical honesty, edgeCase polish |
| `course-state/curriculum_hardening/audits/spanish_quality/S22_SPANISH_QUALITY.json` | Regenerated by validation script only |
| `course-state/curriculum_hardening/audits/fixer_reports/round2/S22_FIXER_REPORT.md` | This report |
| `expert_audit/worklog_entries_r2/S22.md` | Full worklog entry |
| `expert_audit/worklog.md` | Append-only completion pointer FIXER-R2-S22 |

---

## 8. Worklog confirmation

Completion entry written to:

- `expert_audit/worklog_entries_r2/S22.md` (full)
- `expert_audit/worklog.md` (append pointer Task ID: **FIXER-R2-S22**)

---

Section 22 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
