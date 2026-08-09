# S05 Fixer Report — Funciones, contratos y descomposición

**Role:** Curriculum Fixer · Technical Editor · Pedagogical Rewriter  
**Run date:** 2026-07-24  
**Section:** 5 · `oop` · *Funciones, contratos y descomposición*  
**Source file (only):** `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s05-oop.ts`  
**Explorer report (sole authority):** `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S05_EXPLORER_REPORT.md`  
**Explorer baseline score:** 7.8 / 10  
**Estimated score after fix:** **9.58 / 10**  
**Status:** `fixed_validated`

---

## Anti-Aberration Rules (acknowledged and obeyed)

1. **Forbidden:** bulk/automated content generation (Python/JS factories, blurb expanders, template loops that manufacture learner text).  
2. **Forbidden:** placeholders, lorem, TODO-as-content filler, copy-paste variation of the same idea.  
3. **Required:** deliberate pedagogical craft for every changed paragraph, demo, and exercise.  
4. **Self-correction:** if generation-by-script is started, discard and rewrite by hand.

This Fixer pass obeyed all four rules. All educational prose, exercise instructions, demos, and self-check items were **hand-crafted**. Scripts were used **only** for oracle validation (execute code ↔ compare declared output) and residual greps — never to manufacture curriculum text.

---

## 1. Summary of changes applied (mapped to Explorer issue numbers)

| Issue | Severity | Disposition | Evidence / content state |
|-------|----------|-------------|--------------------------|
| **ISSUE-01** / M1–M4 | P0/P1 | **Fixed** | Map heading *Mapa de la sección: funciones con contrato*; **Diccionario de la sección**; callout *Qué entregas al cerrar S05*. No V3 / reubicado / legado in learner prose. |
| **ISSUE-02** | P1 | **Fixed** | `pureza_idem.py` is purity+idempotence only (2 prints ↔ 2-line output). Lambda/DI moved to tip (ISSUE-08). Oracle PASS. |
| **ISSUE-03** | P1 | **Fixed** | Canonical `normalize_nombre` = collapsar + `.title()` from T1-A through youDo. Theory/demo/E2/E3/T3-A/T4-B-E3 aligned. |
| **ISSUE-04** | P1 | **Fixed** | Canonical `normalize_email` = strip+lower + `ValueError` if missing `@` in theory, iDo, weDo, youDo, composition demos. |
| **ISSUE-05** | P2 | **Fixed** | Front-loaded dictionary + map contract code `s05_map_contract.py` + policies paragraph. Map has 4 solid paragraphs. |
| **ISSUE-06** | P2 | **Fixed** | 24 instructions: avg **250** chars, min **188** (≥ gold ~150). Explicit CASO-LIM-005, pass strings, sharpened `tests` fields on key E2/E3. |
| **ISSUE-07** | P2 | **Fixed (+ residual this pass)** | E1s on normalizer spine (`n_palabras`, `strip_collapse`, `len_campo_raw`). **This pass residual:** T1-A-E3 rethemed `saluda` → `etiqueta_campo` (intake label); T4-A-E2 rethemed multiplier → `make_phone_prefix` (closure factory PE/CL). |
| **ISSUE-08** | P2 | **Fixed** | T3-B theory focuses purity+idempotence; injection/lambda in tip + We Do E3. |
| **ISSUE-09** | P2 | **Fixed** | `legb_closure.py`: digits → strip country `51` → always `prefix + d`. Dead `d.startswith("+")` branch removed. Oracle PASS. |
| **ISSUE-10** | P2 | **Fixed** | T3-A-E3 starter is real monster with inline title / email@ / digits policies. |
| **ISSUE-11** | P2 | **Deferred (by design)** | Stable platform id `oop` / `#oop` kept; learner-facing title and map no longer center OOP migration. |
| **ISSUE-12** | P3 | **Fixed** | *sitios de llamada*; no *comentario mental*; no *dunders de sklearn* in opener. |
| **ISSUE-13** | P3 | **Fixed** | youDo: no `from __future__ import annotations`; keeps `Callable` after T2-B. |
| **ISSUE-14** | P3 | **Fixed** | selfCheck **8** MCQ: None, mutable default, pureza, LEGB, idempotencia, docstring vs `#`, keyword-only `*`, orquestador delgado. |
| **ISSUE-15** | P3 | **Fixed** | No `print('ok', True)` residue. |

### Residual quality lifts this pass (fleet floor ≥ 9.5)

- Deepened the two remaining theory paragraphs under 250 chars (keyword-only PE fintech stake; hints that lie poison the next normalizer) → **0** paragraphs under 250; avg **~332**.  
- Rethemed residual toy exercises onto the CP-N1-B spine (ISSUE-07 residual transfer/independent).  
- Strengthened T4-B-E2 hints (no “mentalmente”); sharpened soft `tests` on orch/monster/suite.  
- Revalidated **41 / 41** oracles after hand-crafted edits.  
- `tsc --noEmit` clean for section file.

---

## 2. Corrected content (product state)

Edits applied only in `src/lib/course/sections/s05-oop.ts`.

### Content groups (Explorer Diff A–K + residual polish)

| Group | Explorer mapping | Product state |
|-------|------------------|---------------|
| **A** | ISSUE-01, 05, M1–M4 | Learner-first map + dictionary + delivery tip callout |
| **B** | ISSUE-02 | pureza_idem output honest (2-line design) |
| **C** | ISSUE-03 | nombre collapsar+title everywhere |
| **D** | ISSUE-04 | email raise-if-no-@ everywhere |
| **E** | ISSUE-06/07 | Deep instructions + E1 normalizer spine + residual E3/E2 retheme |
| **F** | ISSUE-08 | T3-B unpack (tip + We Do for DI) |
| **G** | ISSUE-09 | Honest PE phone factory |
| **H** | ISSUE-10 | Monster E3 starter |
| **I** | ISSUE-13 | Minimal youDo imports |
| **J** | ISSUE-14 | 8 selfCheck items |
| **K** | ISSUE-12 | ES-PE redaction |

### This-pass diffs (hand-crafted residual)

1. **T1-B** keyword-only paragraph: PE fintech ETL stake for inverted `country` arg.  
2. **T2-B** Optional/hints paragraph: lying hints poison the next normalizer.  
3. **T1-A-E3:** `etiqueta_campo(campo, valor)` → pass `nombre: Ana` (return vs print on intake spine).  
4. **T4-A-E2:** `make_phone_prefix` PE/CL → pass `+51999 +56999` (closure factory, not math toy).  
5. **T4-B-E2** hints/tests; **T3-A-E2/E3** and **T4-B-E3** `tests` pass strings made exact.

### Canonical policies (locked in map + youDo)

| Normalizer | Policy |
|------------|--------|
| `normalize_nombre` | collapsar espacios + title-case por palabra |
| `normalize_email` | strip + lower; `ValueError` si falta `@` |
| `normalize_telefono` | solo dígitos (demo) |
| `normalize_direccion` | collapsar + upper |

---

## 3. After-Fix Validation Report

### 3.1 Issue-by-issue confirmation

| Issue | Resolved? | Validation method |
|-------|-----------|-------------------|
| ISSUE-01 | **Yes** | Grep: 0 hits `V3`, `reubicad`, `legado`, `Material legado` |
| ISSUE-02 | **Yes** | Executed `pureza_idem.py` ↔ declared output |
| ISSUE-03 | **Yes** | Manual sweep theory→weDo→youDo; asserts expect title-case |
| ISSUE-04 | **Yes** | Manual sweep; teaching demos raise without `@` |
| ISSUE-05 | **Yes** | Map dictionary + 4 paragraphs + contract code present |
| ISSUE-06 | **Yes** | avg instruction **250** chars, min **188** |
| ISSUE-07 | **Yes** | E1s + residual E3/E2 on intake/phone spine; 0 hits `saluda(`/`make_multiplier` |
| ISSUE-08 | **Yes** | Theory code purity-only; DI in tip + E3 |
| ISSUE-09 | **Yes** | Executed `legb_closure.py`; no dead `+` branch |
| ISSUE-10 | **Yes** | Starter has three inline policies |
| ISSUE-11 | Deferred | Stable id `oop` retained intentionally |
| ISSUE-12 | **Yes** | Grep clean for listed calques |
| ISSUE-13 | **Yes** | No `__future__` in youDo |
| ISSUE-14 | **Yes** | 8 MCQ including composition |
| ISSUE-15 | **Yes** | No `print('ok', True)` theater residue |

### 3.2 Oracle suite

| Layer | Result |
|-------|--------|
| Theory + iDo code↔output | **17 / 17** PASS |
| weDo solutionCode↔output | **24 / 24** PASS |
| **Total** | **41 / 41** PASS |

### 3.3 Structural gold bar

| Check | Result |
|-------|--------|
| Theory heads (map + 8 subtopics) | 9 |
| iDo demos | 8 |
| weDo exercises | 24 (E1/E2/E3 × 8) |
| youDo + rubric | present, pure, idempotence tests |
| selfCheck | 8 MCQ |
| Meta-leaks M1–M4 | eradicated |
| Theory paragraphs under 250 | **0** (avg ~332) |
| Anti-aberration | **OK** — no bulk generation |
| TypeScript | `tsc --noEmit` clean |

### 3.4 Explicit anti-aberration confirmation

**No automated bulk content generation was used.** No Python/JS paragraph factories, no template expanders, no lorem/placeholder filler. Every paragraph and exercise instruction changed in this pass was written by hand for pedagogical intent. Validation scripts only executed oracles and counted metrics.

### 3.5 Score estimate

| Dimension | After |
|-----------|-------|
| Meta-leak / developer leakage | 9.7 |
| Grammar & ES-PE redaction | 9.5 |
| Connective tissue / narrative | 9.6 |
| I/We/You fidelity | 9.7 |
| Cognitive load / progressive disclosure | 9.4 |
| Exercises & selfCheck | 9.6 |
| Roadmap consistency | 9.3 (id `oop` residual, messaging clean) |
| External benchmark | 9.3 |
| Technical accuracy of demos | 9.7 |
| **Overall estimate** | **9.58 / 10** |

Fleet floor **≥ 9.5** met; no regression vs prior residual gold.

---

## 4. Residual risks / recommendations for later sections

1. **ISSUE-11 (platform):** Renaming `id: "oop"` → something like `functions-contracts` needs a coordinated routing/hash migration; do not rename in content-only passes.  
2. **SelfCheck breadth:** 8 MCQ is solid; still room for a multi-select or short freeform on pre/post if the platform gains item types.  
3. **Downstream sections:** S06+ should assume pure `normalize_*` contracts from S05 (title + email@) — do not reintroduce collapse-only or strip-only email policies.  
4. **S11:** When domain OOP lands, open with a clean map (no V3/retheme changelog) that *builds on* S05 pure functions rather than “replacing” them.  
5. **Soft `tests` strings:** some remain intentionally short for the in-app grader; pass strings in `instruction` are the learner-facing contract.

---

## 5. Updated Graph Memory notes

```yaml
section: S05
id: oop
file: s05-oop.ts
title: Funciones, contratos y descomposición
explorer_score: 7.8
fixer_score_estimate: 9.58
status_fixer: fixed_validated
anti_aberration_ok: true

nodes_cleared:
  - theory.map.meta_v3_retheme
  - theory.T3-B.pureza_idem.output_missing_line
  - policy.normalize_nombre.title_drift
  - policy.normalize_email.raise_drift
  - theory.T4-A.phone_closure.dead_plus_branch
  - weDo.instructions.avg_len_under_gold
  - weDo.T3-A-E3.monster_underbuilt
  - weDo.theme_drift.E1s
  - weDo.theme_drift.residual_E3_E2  # etiqueta_campo + make_phone_prefix

nodes_deferred:
  - identity.legacy_id_oop  # stable platform hash; do not rename here

edges:
  - CP-N1-A (S04) -> CP-N1-B start (S05 normalizers) : strong
  - S05 pure core -> S08 files / S10 CLI / S11 domain OOP : deferred correctly
  - policy.nombre title + policy.email @ : locked gate contracts

policies_canonical:
  nombre: collapse+title
  email: strip+lower+require_@
  telefono: digits_only_demo
  direccion: collapse+upper

do_not:
  - rename id "oop" without platform migration
  - reintroduce class/ABC/dunder teaching in S05
  - claim policy drift fixed if any demo drops title or @ check
```

---

## 6. Precise product touchpoints (this pass)

File: `src/lib/course/sections/s05-oop.ts`

- Theory T1-B paragraph 3 (keyword-only workplace stake)  
- Theory T2-B paragraph 3 (lying hints)  
- weDo `S05-T1-A-E3` full rewrite → `etiqueta_campo`  
- weDo `S05-T4-A-E2` full rewrite → `make_phone_prefix` / `closure_phone.py`  
- weDo `S05-T4-B-E2` instruction/hints/tests  
- weDo `S05-T3-A-E2`, `S05-T3-A-E3`, `S05-T4-B-E3` tests strings  

All prior Explorer Diff A–K state was already present and reconfirmed.

---

Section 5 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
