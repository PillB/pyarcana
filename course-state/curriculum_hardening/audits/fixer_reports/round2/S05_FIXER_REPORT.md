# S05 Fixer Report (Round 2) — Funciones, contratos y descomposición

**Role:** Second-round Section Fixer · Technical Editor · Pedagogical Rewriter  
**Run date:** 2026-07-25  
**Task ID:** FIXER-R2-S05  
**Status:** `fixed_validated`

---

## 1. Section identification and sources reviewed

| Field | Value |
|--------|--------|
| Section number / title | **5** — Funciones, contratos y descomposición |
| Canonical file | `src/lib/course/sections/s05-oop.ts` |
| Live route | https://pillb.github.io/pyarcana/#oop |
| Internal ID | `oop` (legacy slug retained for progress/URLs) |
| Primary Explorer report | `course-state/curriculum_hardening/audits/explorer_reports/S05_EXPLORER_REPORT.md` |
| Expert report | `expert_audit/S05_report.md` |
| Spanish-quality JSON (pre-R2) | `course-state/curriculum_hardening/audits/spanish_quality/S05_SPANISH_QUALITY.json` (pre-fix snapshot **8.08**) |
| Grammar plan | `expert_audit/_GRAMMAR_SUBPLAN.md` |
| Campaign / fleet context | `expert_audit/CAMPAIGN_SUMMARY.md`, Spanish fleet summaries |
| Round-1 Fixer (context only) | `course-state/curriculum_hardening/audits/fixer_reports/S05_FIXER_REPORT.md` |
| Expert-2 audit | No dedicated S05 second-expert file under `expert_audit/expert_2_audit/` |
| Assessment surface | Public `selfCheck` (8 MCQs) in canonical file; authenticated exam bank key `oop` (not modified this pass) |
| Validation | Python execute-and-diff on **41** code↔output pairs; Spanish audit `--from 5 --to 5 --no-lt`; `tsc --noEmit` |

**Scope obeyed:** Only `s05-oop.ts` was edited. No `SectionView.tsx`, no other sections, no id/filename migration.

**Anti-aberration:** No scripts, generators, loops, templates, or bulk mechanisms manufactured educational prose. Python was used only to execute snippets, compare stdout, and measure Spanish metrics.

---

## 2. Summary of changes applied

### Reality check (Phase 2)

Round-1 Fixer already closed Explorer **ISSUE-01…ISSUE-15** (except deferred **ISSUE-11** legacy id): map meta-leaks removed, dictionary present, `normalize_nombre` / `normalize_email` policies locked, pureza/LEGB oracles honest, monster E3 authentic, 8 selfCheck items, no `print('ok', True)` residue.

Round-2 residual cluster was **expert + Spanish-quality redaction**, not structural pedagogy collapse:

| Class | Status before R2 |
|--------|------------------|
| Explorer ISSUE-01…10, 12…15 | **Already fixed** (R1) |
| Explorer ISSUE-11 (`id: "oop"`) | **Deferred by design** (platform migration) |
| Expert #2–#17 grammar/style | **Active** in live source |
| Spanish PREP_VERB `con colapsa` | **Active** |
| Spanish long sentences / weDo–youDo camelCase / DEFECT jargon | **Active** |
| Interactive editor OOP sample for `oop` | **Platform residual** (SectionView.tsx — out of section scope) |

### Resolution table

| Issue | Source | Status before R2 | Change applied | Validation |
|-------|--------|------------------|----------------|------------|
| ISSUE-01 / M1–M4 meta V3 | Explorer | Already fixed | Re-validated: 0 hits V3/reubicado/legado | Grep |
| ISSUE-02 pureza output | Explorer | Already fixed | R1 design: 2-line pureza_idem; oracle PASS | Exec |
| ISSUE-03 nombre title | Explorer | Already fixed | Policy collapsar+title locked | Manual sweep |
| ISSUE-04 email @ | Explorer | Already fixed | raise-if-no-@ locked | Manual sweep |
| ISSUE-05 dictionary map | Explorer | Already fixed | Improved: dictionary + policies + pedagogy as real lists | Read |
| ISSUE-06/07 instructions | Explorer | Already fixed | Kept; split longest residual E1 | Editorial |
| ISSUE-08 T3-B pack | Explorer | Already fixed | Tip injection rephrased (no `line line` FP) | Read |
| ISSUE-09 LEGB phone | Explorer | Already fixed | Oracle PASS | Exec |
| ISSUE-10 monster E3 | Explorer | Already fixed | Starter still authentic; prose “código inicial” | Read |
| ISSUE-11 legacy id `oop` | Explorer / Expert #1/#19 | Deferred | **Kept** stable hash; no rename | Residual |
| ISSUE-12…15 polish | Explorer | Already fixed | Re-validated | Grep |
| Expert #2 `los keyword` | Expert | **Active** | → `los **keyword arguments** tras los posicionales` | Read |
| Expert #3 COMMA_PERO + antipatrón | Expert | **Active** | `existen, pero` + `antipatrón` | Grep |
| Expert #4 PREP_VERB colapsa | Expert / SQ | **Active** | `con **colapso + title**` | Grep |
| Expert #5–6 jobRelevance | Expert | **Active** | Em-dash parenthetical on conditions | Editorial |
| Expert #7 long E1 hints | Expert / SQ | **Active** | Split colon-join into two sentences | Editorial |
| Expert #8–9 map lists | Expert | **Active** | Políticas + orden pedagógico as Markdown lists | Read |
| Expert #10 callout `raise` | Expert / SQ | **Active** | `Usa \`raise\` para API internas…` | Read |
| Expert #12 `al caller` | Expert | **Active** | Diccionario → `a quien llama`; feedback aligned | Grep |
| Expert #13–14 DEFECT jargon | Expert | **Active** | `# FALLO:` (24) + youDo “fallo del código inicial” (5) | Grep |
| Expert #15 anti-patrón | Expert | **Active** | → `antipatrón` (theory + feedback) | Grep |
| Expert #16 weDo/youDo prose | Expert | **Active** | → **Hacemos juntos** / **Tú haces** | Grep |
| Expert #17 email docstring case | Expert | **Active** | `"""Strip + lower…` | Read |
| Expert #13 selfCheck | Expert | **Active** | `side effects` → `efectos colaterales` | Read |
| Expert Diff 1 id rename | Expert | Out of scope | **Deferred** (compat + SectionView) | Residual |
| SQ double_space / WHITESPACE | Spanish JSON | Noise | Intentional multi-space fixtures in code strings | Triaged FP |
| SQ repeated_word campo/once/prefix | Spanish JSON | Noise | Code identifiers in backticks | Triaged FP |
| SQ MORFOLOGIK tech terms | Spanish JSON | Noise | Python identifiers | Triaged FP |
| Cross-cutting RichText Markdown | Campaign | Platform | **Not fixed** (global agent) | Residual |
| Cross-cutting wrong `oop` playground | Campaign / Expert #1 | Platform | **Not fixed** (SectionView.tsx) | Residual |

**Post-fix Spanish metrics (validation only):** quality_score **9.86** / FH **82.7** (was **8.08** / **83.0**); 16 residual findings, all false-positive or intentional code fixtures.

---

## 3. Full corrected content or precise complete diffs

Product file: `src/lib/course/sections/s05-oop.ts` only.

### Diff group R2-A — Map cognitive load + dictionary (Expert #8, #9, #12; ISSUE-05 polish)

- Diccionario converted to bullet list; `al caller` → `a quien llama`; `print`s backticked.
- Políticas canónicas converted to four bullets + short idempotency sentence.
- Orden pedagógico converted to four bullets + existing closing sentences.

### Diff group R2-B — Grammar / RAE / agreement (Expert #2–#4, #10, #15)

- `los keyword` → `los **keyword arguments** tras los posicionales`.
- `existen pero` → `existen, pero`; `anti-patrón` → `antipatrón` (theory + feedback).
- Callout: `Usa \`raise\` para API internas puras; devuelve tupla u objeto de resultado…`.
- T3-A-E2: `nombre con **colapso + title**; email con **strip + lower**…`.

### Diff group R2-C — Connective labels & Spanglish (Expert #16, callout T3-B)

- Theory `youDo` → bloque **Tú haces**.
- Theory `weDo y youDo` → **Hacemos juntos** y **Tú haces**.
- Code comment `T2-A / youDo` → `T2-A / Tú haces`.
- T3-B tip: `process_line(texto, …)`; “fake” → “sustituto”; “We Do E3” → “ejercicio E3 de **Hacemos juntos**”.
- T3-A-E3: “starter/inline/tel” softened to “código inicial / intercaladas / teléfono”.

### Diff group R2-D — Long sentences (Expert #5–#7; SQ long_sentence)

- `jobRelevance`: comma-spliced conditions → em-dash parenthetical.
- T3-B I/O paragraph: split injection vs hardcode sentences.
- T2-B-E1 instruction: colon-join → period after `normalize_*`.
- T2-A-E1 instruction: split before “Imprime…”.
- T1-B-E1 hint: terminal period + article (“El default…”).

### Diff group R2-E — Scaffold labels + youDo polish (Expert #13, #14, #17)

- All 24 starter `# DEFECT:` → `# FALLO:`.
- Five youDo `# Contrato: corrige el DEFECT del starter…` → `# Contrato: corrige el fallo del código inicial…`.
- `normalize_email` starter docstring: `"""Strip + lower…`.

### Diff group R2-F — Assessment redaction (Expert explanation)

- Self-check pureza explanation: `side effects` → `efectos colaterales`.
- Feedback parse: `vs` → `vs.`.
- Feedback return: `al caller` → `a quien llama`.
- Feedback default: full Spanish sentence with `antipatrón`.

### Not changed (justified)

| Item | Reason |
|------|--------|
| `id: "oop"` / filename `s05-oop.ts` | Compatibility with URL hash, progress keys, demos map; Explorer ISSUE-11 deferred by design; Expert Diff 1 needs Global Agent C + SectionView |
| SectionView interactive editor for `oop` | Global platform defect; out of hard scope |
| Authenticated exam bank | No section-local defect requiring rewrites; selfCheck already 8 balanced MCQs |
| Intentional multi-space test fixtures | Pedagogical; SQ false positives |

---

## 4. After-Fix Validation Report

### 4.1 Issue-by-issue confirmation

| Issue family | Disposition |
|--------------|-------------|
| Explorer ISSUE-01…10, 12…15 | **Already fixed** (R1) + re-validated |
| Explorer ISSUE-11 / Expert id rename | **Residual risk** (platform) |
| Expert grammar #2–#17 (actionable) | **Fixed** |
| Spanish PREP_VERB / long sentences / casing | **Fixed** or **FP triaged** |
| Meta-leaks V3/reubicado/legado | **Fixed** (0 hits) |
| Code↔output integrity | **41 / 41 PASS** |
| selfCheck keys | **8 MCQ**; correctIndex distribution **0:2, 1:2, 2:2, 3:2** |

### 4.2 Code-execution results

| Layer | Result |
|-------|--------|
| Theory + iDo + weDo solution oracles | **41 / 41 PASS** |
| FAIL / ERR | **0** |

### 4.3 Spanish-quality before / after

| Metric | Pre-R2 (audit JSON) | Post-R2 (`--no-lt`) |
|--------|---------------------|---------------------|
| quality_score_0_10 | 8.08 | **9.86** |
| Fernández-Huerta | 83.0 | **82.7** |
| findings_total | 86 (incl. LT noise) | **16** (no-lt; all FP/fixtures) |

### 4.4 Markdown rendering

Learner-facing `**bold**` remains in `jobRelevance`, callouts, instructions. **Platform RichText leak** (raw asterisks) is repository-wide; not fixed in this section pass.

### 4.5 Assessment-key validation

- 8 selfCheck questions with unique concept coverage (None return, mutable default, pureza, LEGB, idempotencia, docstring vs `#`, keyword-only, orquestador).
- Answer positions balanced (2 each of indices 0–3).
- No answer-key changes required beyond explanation redaction.

### 4.6 Live-render / continuity observations

- Live hash remains `#oop` (legacy). Title/tagline learner-facing are correct.
- Adjacent roadmap: S04 CP-N1-A → S05 CP-N1-B normalizers → S06 collections (not edited).
- Wrong interactive “clases y herencia” panel remains until Global SectionView fix for key `oop` or id migration.

### 4.7 Accessibility / continuity

- Progressive disclosure T1→T4 preserved.
- I Do 8 / We Do 24 / You Do 1 / Self-check 8 intact.
- No new stubs or print-theater residue.

### 4.8 Explicit anti-aberration statement

**No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content.** Automation was used only for mechanical validation (execute-and-diff oracles, Spanish-quality metrics, TypeScript check, greps). Terminology label `# DEFECT:` → `# FALLO:` was a deliberate section-local editorial convention applied by exact-string replace of the scaffold marker, not generated prose.

---

## 5. Residual risks and later recommendations

### Section-local residuals

1. **Spanish audit residual FPs** on intentional multi-space fixtures (`'  Ana   María  '`) and backtick code tokens — do not “normalize” those spaces.
2. **Spanglish register** (`default`, `hint`, `docstring`, etc.) remains by design for “español peruano técnico”.

### Repository-wide platform dependencies

1. **`SectionView.tsx` interactive editor** keyed by `oop` still teaches Animal/Perro OOP on the live S05 page — highest remaining learner-visible defect; assign Global Agent A/C.
2. **RichText Markdown** fields still risk raw `**` if renderer not fixed globally.
3. **Legacy id/filename** `oop` / `s05-oop.ts` — migration needs aliases for progress, seed, analytics, PdfReport.

### Deferred compatibility migrations

- Rename to `functions-contracts` only with coordinated index + SectionView editor + progress alias plan (Expert Diff 1).

### Adjacent-section recommendations

- S06+ must keep S05 gate policies: nombre collapsar+title; email strip+lower+`@`; tel digits; dirección collapsar+upper.
- S11 OOP should open learner-first (no V3 changelog) building on S05 pure functions.

---

## 6. Updated Graph Memory notes

```yaml
section: S05
id: oop
file: s05-oop.ts
title: Funciones, contratos y descomposición
explorer_score: 7.8
fixer_r1_score_estimate: 9.58
fixer_r2_status: fixed_validated
spanish_quality_post: 9.86
anti_aberration_ok: true

nodes_cleared_r2:
  - grammar.los_keyword_agreement
  - grammar.comma_pero
  - grammar.prep_verb_colapsa
  - redaction.weDo_youDo_camelcase_prose
  - redaction.defect_jargon_FALLO
  - redaction.side_effects_spanglish
  - structure.map_dictionary_lists
  - structure.policies_list
  - structure.pedagogy_order_list

nodes_deferred:
  - identity.legacy_id_oop
  - platform.sectionview_editor_oop_shows_classes
  - platform.richtext_markdown_leak

edges:
  - CP-N1-A (S04) -> CP-N1-B start (S05 normalizers) : strong
  - S05 pure core -> S08 files / S10 CLI / S11 domain OOP : deferred correctly
  - policy.nombre title + policy.email @ : locked gate contracts

retained_strengths:
  - 8/8/24 I/We/You fidelity
  - CASO-LIM-005 spine
  - pure youDo + idempotence helper
  - 41/41 executable oracles
```

---

## 7. Files changed

| File | Why |
|------|-----|
| `src/lib/course/sections/s05-oop.ts` | Sole product edit: expert/Spanish residual redaction, scaffold labels, map lists, assessment explanation |
| `course-state/curriculum_hardening/audits/spanish_quality/S05_SPANISH_QUALITY.json` | Regenerated by validation audit script |
| `course-state/curriculum_hardening/audits/fixer_reports/round2/S05_FIXER_REPORT.md` | This report |
| `expert_audit/worklog_entries_r2/S05.md` | Full worklog entry |
| `expert_audit/worklog.md` | Brief completion pointer FIXER-R2-S05 |

---

## 8. Worklog confirmation

- Full entry written to `expert_audit/worklog_entries_r2/S05.md`.
- Brief completion pointer **appended** to `expert_audit/worklog.md` with Task ID **FIXER-R2-S05**.

---

Section 5 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
