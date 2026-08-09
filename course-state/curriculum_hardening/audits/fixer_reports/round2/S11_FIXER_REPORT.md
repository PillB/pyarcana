# S11 Fixer Report (Round 2) — OOP y modelo de dominio

**Role:** Curriculum Fixer · Technical Editor · Pedagogical Rewriter (second-round)  
**Date:** 2026-07-25  
**Task ID:** FIXER-R2-S11  
**Scope lock:** Section 11 only (`id: testing`)  
**Canonical source (only product file edited):** `src/lib/course/sections/s11-testing.ts`  
**Live:** https://pillb.github.io/pyarcana/#testing  

---

## 1. Section identification and sources reviewed

| Field | Value |
|--------|--------|
| Section # | **11** |
| Title | OOP y modelo de dominio |
| shortTitle | OOP dominio |
| Internal id | `testing` (legacy slug; rename deferred) |
| Canonical file | `src/lib/course/sections/s11-testing.ts` |
| Live route | `#testing` |
| Primary Explorer report | `course-state/curriculum_hardening/audits/explorer_reports/S11_EXPLORER_REPORT.md` |
| Expert report | `expert_audit/S11_report.md` |
| Spanish-quality JSON | `course-state/curriculum_hardening/audits/spanish_quality/S11_SPANISH_QUALITY.json` |
| Grammar plan | `expert_audit/_GRAMMAR_SUBPLAN.md` |
| Campaign summary | `expert_audit/CAMPAIGN_SUMMARY.md` |
| Shared worklog | `expert_audit/worklog.md` |
| Round-1 Fixer claim (re-audited) | `course-state/curriculum_hardening/audits/fixer_reports/S11_FIXER_REPORT.md` |
| Expert 2 audit | `expert_audit/expert_2_audit/deep-research-report-11.md` (inaccessible-content false positive; ignored for content edits) |
| Assessment | In-section `selfCheck` (6 MCQs); You Do oracle `test_domain()`; no separate question-bank file for S11 |
| Validation | Hand re-execution of 24 We Do solutions; Spanish-quality audit `--from 11 --to 11 --no-lt` |

### Anti-aberration acknowledgment

No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture educational prose. Automation was used only for mechanical validation (code execution, greps, Spanish-quality metrics).

---

## 2. Summary of changes applied

### Round-2 reality check

Round-1 Fixer already resolved Explorer **P0/P1** content issues: meta-leak purge (V3/retheme/`id testing` prose), truncated We Do instructions, canonical `ClientRecord`, slim You Do starter, composition typing, `internal_note` instead of password, harness-wrapper removal, ethics callouts.

Independent re-inspection against **expert audit S11 (score 8.0)** and **Spanish-quality snapshot (8.71)** found **residual polish still active**: `Person`/`PersonInfo` drift in Q5 and theory, English callout titles, long theory paragraphs, inline English “fixes”/“clamp”, `0..1` range notation, We Do intro Spanglish, `E1_relabel` opacity, Q3 Spanglish option, missing `WHEN_NOT`/`INTRODUCE` gloss.

### Resolution table

| Issue | Source | Status before R2 | Change applied | Validation |
|-------|--------|------------------|----------------|------------|
| Explorer I-01…I-05, I-07…I-21, I-24 | Explorer | Already fixed (R1) | Grep re-verify: 0 V3/retheme/churn/truncated instructions | PASS |
| Explorer I-06 id `testing` | Explorer | Deferred platform | Keep `id: "testing"`; no prose mention | Residual platform |
| Explorer I-12 print-heavy E3s | Explorer | Mitigated R1 | Confirmed code-transfer E3s present | PASS / residual density |
| Explorer I-22 density | Explorer | Mitigated | No structure cut; extraneous load reduced R1+R2 | Residual by design |
| Expert #1 Person vs PersonInfo | Expert P0 | **Active** | Q5 stem → `PersonInfo`; theory anti-pattern → `PersonInfo` | Grep |
| Expert #3a long P10 + fixes | Expert P1 | **Active** | Split validate/side-effects; “arreglos” | Manual + SQ |
| Expert #3b long P18 | Expert P1 | **Active** | Split entity_id rationale / frozen | Manual |
| Expert #3c long P21 + Person | Expert P1 | **Active** | Split has-a / no-force inheritance; PersonInfo | Manual |
| Expert #4 callout EN titles | Expert P3 | **Active** | “Falla al construir”; “Igualdad personalizada” | Grep |
| Expert #5 fixes/clamp EN | Expert P2 | **Active** | arreglos / recortes / recorta | Grep |
| Expert #6 `0..1` | Expert + SQ | **Active** | `[0, 1]` in theory, T2-A-E3, T4-B | Grep 0 `0..1` |
| Expert #7 plural siglas | Expert L | House style | Keep `ORMs`/`APIs` (tech PE speech); no global rename | Documented residual |
| Expert #8 We Do intro | Expert P7 | **Active** | “por 8 subtemas… 2 pistas cada uno…” | Manual |
| Expert #9 E1_relabel | Expert P4 | **Active** | Explicit ResolvedEntity(“E1”…) set example | Manual |
| Expert #10 Q3 Spanglish | Expert P5 | **Active** | “dobles de prueba y adaptadores” | Manual |
| Expert #11 callout homogenization | Expert L | Optional | Not force-homogenized; titles already Spanish after #4 | N/A residual style |
| Expert #12 `# DEFECT:` → DEFECTO | Expert L | Optional | Kept `# DEFECT:` (course-wide intentional scaffold) | Residual style |
| Expert #13 T3-A-E1 instruction | Expert P8 | **Active** | “campo person de tipo PersonInfo” | Manual |
| Expert #14 arrow spacing | Expert L | Partial | T1 → T4; PEN → USD in prose | Partial residual |
| Expert #15 WHEN_NOT gloss | Expert P10 | **Active** | Spanish gloss in instruction + feedback | Manual |
| SQ emails vacío agreement | Spanish high | **Active** | I Do why rephrased with “lista de emails está vacía” | Manual |
| SQ get/get space/repeat | Spanish med | **Active** | Repo E2 hints rephrased | Manual |
| SQ day_created long/repeat | Spanish med | **Active** | Instruction split; hint rephrased | Manual |
| SQ edgeCases terminal punct | Spanish med | **Active** | Several edgeCases closed with `.` | Manual |
| SQ vs → vs. | Grammar plan | Partial | Callout + E2 strip vs. casefold + resources | Grep |
| Expert2 deep-research-11 | expert_2 | N/A | Wrong site; no content action | N/A |
| Global RichText markdown | Cross-cutting | Platform | Not edited SectionView | Residual platform |

---

## 3. Full corrected content or precise complete diffs

**Authoritative full section after Round 2:**  
`src/lib/course/sections/s11-testing.ts`  

Key hand-crafted regions (not bulk rewrite):

### Theory
- **T1-B** — split `validate()` paragraph; side-effects with “arreglos”; callout **Falla al construir**.
- **T2-A** — score range `[0, 1]`; callout **Consulta vs. comando**.
- **T2-B** — split identity vs frozen; clarified PE set/`entity_id` relabel; callout **Igualdad personalizada**.
- **T3-A** — split composition bridge; `PersonInfo` anti-pattern; “recortes” silenciosos.
- **T4-B** — “recorta” instead of “clamp”; range `[0, 1]`.

### I Do
- T2-A `why`: agreement-safe Spanish for empty emails list.
- Intro: `T1 → T4` spacing.

### We Do
- Intro: Spanish “pistas”, “lista mutable”, “monto en float”.
- T2-A-E2: clearer instruction/hint for pure query + fail-closed.
- T2-A-E3: `[0, 1]` instead of `0..1`.
- T3-A-E1: composition instruction clarity + PersonInfo naming.
- T3-B-E2: strip **vs.** casefold.
- T3-B-E3: `WHEN_NOT` / `INTRODUCE` Spanish gloss.
- T4-A-E2: repo save/get hints rephrased.

### Self-check
- Q3 option: “dobles de prueba y adaptadores”.
- Q5 stem: `Client hereda de PersonInfo…`.

### You Do / resources
- Objective punctuation; `Protocols vs. ABC` note.
- You Do starter left as slim TODO shells (R1 fix preserved).

---

## 4. After-Fix Validation Report

| Check | Result |
|-------|--------|
| Explorer P0 I-07/I-08 truncated/broken instructions | **Already fixed** (R1); re-verified 0 hits |
| Explorer P1 meta-leaks M1–M9 | **Already fixed**; 0 V3/retheme/churn/id-testing prose |
| Expert #1 PersonInfo consistency | **Fixed** |
| Expert #3–#6, #8–#10, #13, #15 | **Fixed** |
| Expert #2 platform id rename | **Residual** (Option A: keep `testing`) |
| Expert #7/#11/#12 house style | **Documented residual / deferred** |
| We Do solutions code↔output | **24/24 PASS** |
| Theory/I Do sample code↔output (first 12 pairs) | **0 fails** |
| You Do starter independence | **Preserved** (TODO shells + failing oracle) |
| Meta-leak scan post-edit | **Clean** for editor/V3 language |
| Spanish-quality before (fleet snapshot) | **8.71** / 67 findings (with LT noise) |
| Spanish-quality after (`--no-lt`) | **9.87** / 10 findings (mostly code-token `repeated_word` FPs) |
| Markdown RichText platform leak | **Residual global** (not section-local) |
| Assessment keys (selfCheck) | **Valid** — Q5 correctIndex 2 unchanged; stem aligned |
| Live route continuity S10 → S11 → S12/S13 | **Preserved** in prose |
| Anti-aberration | **Pass** — manual edits only |

**Explicit statement:**  
No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content. Automation was used only for mechanical validation.

### Residual findings after SQ re-audit (not reworked)

- `repeated_word` on `day`/`day_created`, `Client`/`client_id`, `str`/`str`, `get`/`.get` — LanguageTool-style FPs on intentional code identifiers in Spanish instructions.
- `missing_inverted_exclamation` on tests field with `True False` — not an exclamation; false positive.
- `lowercase_after_period` after `vs.` + code token — expected after abbreviation.

---

## 5. Residual risks and later recommendations

### Section-local residuals
- Section density (8 subtopics × 24 exercises) remains high for first intermediate OOP exposure — structural, by design.
- Optional callout-title style homogenization (noun vs imperative) left for a course-wide style guide.
- `# DEFECT:` vs `# DEFECTO:` — keep English marker until course-wide convention is chosen.

### Repository-wide / platform
- **Identity:** `id: "testing"` + filename `s11-testing.ts` vs title OOP (Explorer I-06 / Expert #2). Requires coordinated migration of progress keys, hash, and any `demos['testing']` maps — **Global Agent C**.
- **RichText:** jobRelevance/callout/instruction markdown may still show raw `**` if SectionView does not route through `<RichText>` — **Global Agent A**.
- **Plural siglas** house style (`ORMs`/`APIs`) — course-wide decision.

### Adjacent sections
- S12 should continue Protocol/fake → real adapter story.
- S13 should consume the four CP-N1-C types as named in S11.

---

## 6. Updated Graph Memory notes

```yaml
section: 11
id: testing  # legacy; content = OOP domain
file: src/lib/course/sections/s11-testing.ts
title: OOP y modelo de dominio
round2_status: fixed_validated
score_estimate: 9.7+

nodes_keep:
  - ethics_no_fraud_no_family_verdict
  - decimal_pen_usd_invariants
  - frozen_entity_id_identity
  - protocol_port_for_fakes
  - self_check_alignment
  - t1_t4_skill_ladder
  - cp_n1_c_gate_requirements_list
  - personinfo_composition_canonical_name

nodes_resolved_r2:
  - person_vs_personinfo_drift
  - long_theory_paragraphs_p10_p18_p21
  - english_callout_titles
  - inline_fixes_clamp_english
  - score_range_0_dotdot_1
  - wedo_intro_spanglish
  - e1_relabel_opacity
  - q3_fakes_adapters_spanglish
  - when_not_introduce_gloss
  - emails_vacio_agreement

nodes_residual:
  - platform_id_testing_mismatch
  - density_19h_8_subtopics
  - plural_siglas_house_style
  - defect_marker_language
  - global_richtext_markdown

edges_positive:
  - S10_cli_package -> S11_domain_core
  - S11_protocol_fakes -> S12_sql_http_adapters
  - S11_domain_types -> S13_evidence_dashboard
```

---

## 7. Files changed

| File | Why |
|------|-----|
| `src/lib/course/sections/s11-testing.ts` | Only product source edited: expert residuals + Spanish polish |
| `course-state/curriculum_hardening/audits/fixer_reports/round2/S11_FIXER_REPORT.md` | This report |
| `expert_audit/worklog_entries_r2/S11.md` | Full worklog entry |
| `expert_audit/worklog.md` | Brief completion pointer (append) |
| `course-state/curriculum_hardening/audits/spanish_quality/S11_SPANISH_QUALITY.json` | Regenerated by validation script only |

No other section sources, no `SectionView.tsx`, no global platform files.

---

## 8. Worklog confirmation

- Full entry: `expert_audit/worklog_entries_r2/S11.md`
- Pointer appended to: `expert_audit/worklog.md` (Task ID: **FIXER-R2-S11**)

---

Section 11 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
