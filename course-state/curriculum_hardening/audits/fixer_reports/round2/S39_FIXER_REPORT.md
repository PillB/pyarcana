# S39 Fixer Report (Round 2) — Responsible ML Case Triage y cierre de nivel

**Role:** Curriculum Fixer · Technical Editor · Pedagogical Rewriter (second-round)  
**Date:** 2026-07-25  
**Task ID:** FIXER-R2-S39  
**Scope lock:** Section 39 only (`id: integrator-phase2`)  
**Canonical source (only product file edited):** `src/lib/course/sections/s39-integrator-phase2.ts`  
**Live:** https://pillb.github.io/pyarcana/#integrator-phase2  

---

## 1. Section identification and sources reviewed

| Field | Value |
|--------|--------|
| Section # | **39** |
| Title | Responsible ML Case Triage y cierre de nivel |
| shortTitle | Case Triage N3 |
| Internal id | `integrator-phase2` |
| Canonical file | `src/lib/course/sections/s39-integrator-phase2.ts` |
| Live route | `#integrator-phase2` |
| Primary Explorer report | `course-state/curriculum_hardening/audits/explorer_reports/S39_EXPLORER_REPORT.md` |
| Expert report | `expert_audit/S39_report.md` |
| Expert 2 audit | `expert_audit/expert_2_audit/Section 39 Quality Audit.docx` |
| Spanish-quality JSON | `course-state/curriculum_hardening/audits/spanish_quality/S39_SPANISH_QUALITY.json` |
| Grammar plan | `expert_audit/_GRAMMAR_SUBPLAN.md` |
| Campaign summary | `expert_audit/CAMPAIGN_SUMMARY.md` |
| Shared worklog | `expert_audit/worklog.md` |
| Assessment | In-section `selfCheck` (5 MCQs); We Do 24 exercises; You Do CP-N3-C |
| Validation | Manual greps; execute-and-diff (41 theory/iDo + 24 solutions + You Do); `scripts/spanish_quality_audit.py --from 39 --to 39 --no-lt` |

### Anti-aberration acknowledgment

No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content. Automation was used only for mechanical validation (grep, code execution, Spanish-quality metrics).

---

## 2. Summary of changes applied

### Round-2 reality check

Prior work already removed most Explorer **P0 meta-leaks** (autoría / lane / ledger / seed / `section_passed` / platform-id language), rewrote self-check Q2, fixed iDo demos to compute from structures, used threshold in You Do triage, split `REQUEST_ACTIONS` from empty root_cause, and aligned feature_set to semver `3.0.0`.

Round 2 closed **remaining active** expert Spanish/redaction issues, starter taxonomy headers, theory run-ons, and **Expert-2 critical You Do safety defects** (`human_only` auto-skip, non-idempotent bundle, wrapper-only hash, missing demo paths).

### Resolution table

| Issue | Source | Status before R2 | Change applied | Validation |
|-------|--------|------------------|----------------|------------|
| I01–I05 meta autoría/lane/ledger | Explorer | **Already fixed** | Confirmed learner-facing promotion language only | Grep 0 `lane de autor` / `section_passed` / `ledger` |
| I06 iDo print theater | Explorer | **Already fixed** | Demos derive values from structures | 8/8 iDo outputs match |
| I07 calibración claim | Explorer | Partial | T2-A threshold/load micro-check retained; You Do uses threshold + OOD | Exec PASS |
| I08 Contrato template shell | Explorer | Soft residual | Left intentional Entrada/Salida/Error pattern; not stamped bulk rewrite | Documented residual |
| I09 E3 three routes | Explorer | Partial | T4-B-E3 four fixtures; You Do three demo paths | Source inspect |
| I10 REQUEST_ACTIONS | Explorer | **Already fixed** | Distinct token for empty actions | Solution assert PASS |
| I11 heading polish | Explorer | Active → fixed | Slight heading clarity (SemVer, post mórtem, etc.) | Manual |
| I12 feature_set fs-v3 | Explorer | **Already fixed** | `3.0.0` | Grep |
| I13 dead threshold | Explorer | **Already fixed** | Used in triage; human_only path fixed | Exec |
| I14 DEFECTO / solutionCode comments | Explorer + Expert M-10 | Partial → fixed | Removed author `Contrato…solutionCode` style; kept pedagogical `# DEFECTO:` | Grep 0 `Contrato: corrige` |
| I15 V3 rubric | Explorer | **Already fixed** | CP-N3-C wording | Source |
| M1–M14 meta map | Explorer §4 | **Already fixed** | Confirmed | Grep |
| H-1 demo CI/CD drift | Expert | **Platform residual** | Not section-owned (`SectionView.tsx`) | Documented |
| H-2 PDF Capstone P2 | Expert | **Platform residual** | Not section-owned (`PdfReport.tsx`) | Documented |
| H-3 / H-4 T1-A run-ons | Expert | Active → fixed | Split 53-/48-word sentences; determiner `la misma entidad` | Manual + SQ |
| M-1 auto-declarar / auto-fraude | Expert + SQ | Active → fixed | `autodeclarar` / `autofraude` throughout prose | Grep 0 hyphen forms |
| M-2 postmortem | Expert + SQ | Active → fixed | Spanish noun → `post mórtem`; code IDs/URL keep English | Grep |
| M-3 misma entidad | Expert | Active → fixed | `la misma entidad` | Grep |
| M-4 Checklist firmado | Expert + SQ | Active → fixed | Full sentence with articles | Manual |
| M-5 long sentences | Expert | Active → fixed | T1-A, T2-A, T3-A, intros, You Do context | SQ FH 80.6 |
| M-6 CASO-LIM-039 · headers | Expert | Active → fixed | 8× `# Tarea: …` learner headers | Grep 0 |
| M-7 (F,F) spacing | Expert | Active → fixed | `(F, F) = normal; …` | Source |
| M-8 conceptuales | Expert | Active → fixed | plural agreement | Source |
| M-9 vs | Expert | Active → fixed | `frente a` / `vs.` where needed | Grep |
| L-1 URLs | Expert | Active → fixed | invariable `URL` in T3-A | Source |
| L-2 incl. | Expert | Active → fixed | `incluyendo` | Grep 0 `incl.` |
| L-4 / L-5 intros & scope | Expert | Active → fixed | iDo/weDo intros split; S27–S38 + autoinclude S27–S39 | Manual |
| E2-1 human_only skip | Expert-2 Critical | Active → fixed | `queued_for_human`, score=None, never auto-skip | Exec assert |
| E2-2 JSONL newlines | Expert-2 Critical | **False positive** | TS `"\\n"` correctly becomes Python `\n` at runtime | Real newlines confirmed |
| E2-3 non-idempotent run | Expert-2 High | Active → fixed | Clean dir per run + `run_id` | Exec |
| E2-4 hash only manifest | Expert-2 High | Active → fixed | `artifact_sha256` + `bundle_sha256` over digests | Exec |
| E2-5 missing demo paths | Expert-2 High | Active → fixed | happy / override / ood_abstain in bundle | Exec 3 audit lines |
| SQ score | Spanish quality | 7.26 → **10.0** | Hand Spanish + structure | Audit script |

---

## 3. Full corrected content or precise complete diffs

**Authoritative full section after Round 2:**  
`src/lib/course/sections/s39-integrator-phase2.ts`

### Representative corrections

**T1-A theory (H-3 / H-4 / M-3):**

```text
El flujo canónico N3 es una cadena con fronteras claras entre etapas.
**Intake** normaliza los registros sintéticos y **ER** decide si dos registros
son la misma entidad (no familia ni culpa). …
Por qué importa este orden: si ER se ejecuta después del grafo, …
```

**You Do `triage` human_only (Expert-2 critical):**

```python
if human_only:
    packet = EvidencePacket(..., score=None, ...)
    action = human_action or "queued_for_human"
    return packet, action, human_action is not None
```

**You Do bundle integrity:**

- Clean output directory per run (`shutil.rmtree` then mkdir).
- Three demo cases: happy, override (`human_action=skip`), ood_abstain.
- Per-artifact SHA-256 + `bundle_sha256` over the digest map.
- Audit events carry `run_id`, `demo_path`, `override`, `human_only`.

**Orthography (RAE / grammar plan):**

- `auto-declarar*` → `autodeclarar*`; `auto-fraude` → `autofraude`.
- Prose `postmortem` → `post mórtem` (code identifiers and external URL labels unchanged).
- Starter headers `# CASO-LIM-039 · …` → `# Tarea: …`.

---

## 4. After-Fix Validation Report

| Check | Result |
|-------|--------|
| Explorer I01–I18 | Fixed / already fixed / platform residual (H-1/H-2 class via SectionView/PdfReport) |
| Expert H/M/L | Section-local fixed; H-1/H-2 platform deferred |
| Expert-2 critical You Do | human_only, idempotence, digests, demo paths fixed; JSONL escape confirmed OK |
| Theory + iDo code↔output | **41/41 PASS** |
| We Do solutionCode | **24/24 PASS** |
| You Do runtime | human_only→`queued_for_human`; OOD→`ood_abstain`; override→skip; clean rerun; digests present |
| Spanish quality | **7.26 → 10.0** (--no-lt); FH ~80.6; 8 low residual FPs only |
| Meta-leak greps | 0 for autoría/lane/ledger/section_passed/auto-declar/auto-fraude/CASO-LIM-039 · |
| TypeScript | No new S39 errors (pre-existing unrelated S25 parse error in repo) |
| Markdown RichText | Platform residual (global) — bold markers may show raw in some fields |

**Explicit statement:**  
No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content. Automation was used only for mechanical validation.

---

## 5. Residual risks and later recommendations

### Section-local residuals (low)

- “Contrato operativo Entrada/Salida/Error” middle-paragraph pattern remains (intentional scaffolding; Explorer I08 soft residual).
- Self-check still 5 items (adequate; Expert-2 wanted broader system coverage — optional future expansion without manufacturing volume).
- Cards metrics in model-card remain illustrative lab numbers (honest as synthetic), not computed live from a production window.

### Platform / global (out of scope)

- `SectionView.tsx` `demos['integrator-phase2']` still may load off-topic CI/CD playground (Expert H-1).
- `PdfReport.tsx` may still label `39. Capstone P2` (Expert H-2).
- Global RichText Markdown leak for some fields.
- Legacy id `integrator-phase2` retained for URL/progress compatibility.

### Adjacent sections

- No edits to S38/S40. Continuity language S27–S38 assembly + S27–S39 regression smoke remains coherent.

---

## 6. Updated Graph Memory notes

| Node | Notes |
|------|--------|
| Section | S39 · `integrator-phase2` · Case Triage N3 · CP-N3-C |
| Concepts corrected | human_only = force human review (not auto-skip); artifact digests; demo path triad; RAE autofraude/autodeclarar/post mórtem |
| Prerequisites | S27–S38 (ER, graph, features, ranking, calibración S34, explicación S35, ops) |
| Forward | CF-3 external review; Phase 3 agentic (S40+) |
| Strengths retained | Ethics spine (score ≠ fraude/parentesco), fail-closed tokens, 8×3 We Do ladder, synthetic Lima fintech |
| Defects resolved | Meta autoría (R1), T1-A run-ons, taxonomy starter headers, You Do safety/idempotence |
| Remaining risks | Platform demo/PDF drift; optional self-check expansion |
| Compatibility | id/filename/hash `integrator-phase2` unchanged |
| Assessment | selfCheck 5 domain MCQs aligned; no separate exam bank edit required this pass |

---

## 7. Files changed

| File | Why |
|------|-----|
| `src/lib/course/sections/s39-integrator-phase2.ts` | Only product content edit: theory, intros, Spanish, starters, You Do, self-check glosses, resources notes |
| `course-state/curriculum_hardening/audits/fixer_reports/round2/S39_FIXER_REPORT.md` | This report |
| `expert_audit/worklog_entries_r2/S39.md` | Full worklog entry |
| `expert_audit/worklog.md` | Append-only completion pointer FIXER-R2-S39 |
| `course-state/curriculum_hardening/audits/spanish_quality/S39_SPANISH_QUALITY.json` | Regenerated by validation script |

---

## 8. Worklog confirmation

Completion pointer appended to `expert_audit/worklog.md` with Task ID **FIXER-R2-S39**.  
Full entry written to `expert_audit/worklog_entries_r2/S39.md`.

---

Section 39 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
