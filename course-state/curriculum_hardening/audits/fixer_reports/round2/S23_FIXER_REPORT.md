# S23 Fixer Report (Round 2) — Browser RPA con Playwright

**Role:** Curriculum Fixer · Technical Editor · Pedagogical Rewriter (second-round)  
**Date:** 2026-07-25  
**Task ID:** FIXER-R2-S23  
**Scope lock:** Section 23 only (`id: computer-vision`)  
**Canonical source (only product file edited):** `src/lib/course/sections/s23-computer-vision.ts`  
**Live:** https://pillb.github.io/pyarcana/#computer-vision  

---

## 1. Section identification and sources reviewed

| Field | Value |
|--------|--------|
| Section # | **23** |
| Title | Browser RPA con Playwright |
| shortTitle | Playwright RPA |
| Internal id | `computer-vision` |
| Canonical file | `src/lib/course/sections/s23-computer-vision.ts` |
| Live route | `#computer-vision` |
| Primary Explorer report | `course-state/curriculum_hardening/audits/explorer_reports/S23_EXPLORER_REPORT.md` |
| Expert report | `expert_audit/S23_report.md` |
| Spanish-quality JSON | `course-state/curriculum_hardening/audits/spanish_quality/S23_SPANISH_QUALITY.json` |
| Grammar plan | `expert_audit/_GRAMMAR_SUBPLAN.md` |
| Campaign summary | `expert_audit/CAMPAIGN_SUMMARY.md` |
| Shared worklog | `expert_audit/worklog.md` |
| Round-1 Fixer claim (re-audited) | `course-state/curriculum_hardening/audits/fixer_reports/S23_FIXER_REPORT.md` |
| Expert 2 audit | `expert_audit/expert_2_audit/Auditoría de Calidad de Playwright RPA.docx` |
| Assessment | In-section `selfCheck` (9 MCQs); We Do 24; You Do CP-N2-C web adapter |
| Validation | Manual greps; execute-and-diff spot-checks; `scripts/spanish_quality_audit.py --from 23 --to 23 --no-lt`; `tsc --noEmit` |

### Anti-aberration acknowledgment

No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content. Automation was used only for mechanical validation (grep, code execution, TypeScript check, Spanish-quality metrics).

---

## 2. Summary of changes applied

### Round-2 reality check

Round-1 Fixer had already resolved Explorer **I-01…I-24** structural/pedagogy defects (I Do stdout parity, meta-leaks, Playwright sketch, Diccionario, unique scaffolding, 9 self-check items, `# Arregla:` / `# Completa:` frames, S22→S24 connective tissue, icon `Monitor`). Independent re-check confirmed:

- 0 hard meta-leaks (`Id legacy`, `auditoría de snippets`, `gate V3`, `# DEFECT:`)
- 8 I Do demos with full stdout contracts
- `playwright_sketch.py` with real `from playwright.sync_api import …`
- 9 self-check MCQs; 24 We Do exercises
- Icon `Monitor` (not Camera)

Round 2 focused on **still-active expert grammar/style residuals** (H-3…H-5, M-1…M-7, L-1…L-4) and Spanish-quality high findings (agreement, `PRIMER_PRIMERA`, `AGREEMENT_POSTPONED_ADJ`).

Expert-2 critical finding (section completable without real Playwright runtime) is **acknowledged as residual architecture** — progressive disclosure + dual-mode practice already ship; converting all graded labs to live Chromium is out of section-local scope (grader/CI platform decision).

### Resolution table

| Issue | Source | Status before R2 | Change applied | Validation |
|-------|--------|------------------|----------------|------------|
| I-01…I-04 Demo stdout | Explorer | **Already fixed (R1)** | Confirmed full multi-line outputs | Exec spot-check PASS |
| I-05…I-08 Meta-leaks | Explorer | **Already fixed (R1)** | Confirmed clean jobRelevance / callout / rubric / starter | Grep 0 |
| I-09…I-12 Sketch, dict-mode honesty, glossary, T2-B-E1 API | Explorer | **Already fixed (R1)** | Confirmed | Source inspect |
| I-13…I-24 Pedagogy depth / a11y / resources | Explorer | **Already fixed (R1)** | Confirmed | Source inspect |
| I-16 Legacy id | Explorer | **Partial (by design)** | id kept `computer-vision` (platform routing / progress keys) | Residual platform |
| C-1 Off-topic playground | Expert | **Global dependency** | Not section-owned; id migration deferred | Residual platform |
| H-3 `primer/último i` | Expert + SQ high | **Active → fixed** | `primera/última \`i\`` + code spans | Grep 0 wrong form |
| H-4 `logs entero` | Expert + SQ high | **Active → fixed** | `los logs enteros` | Grep |
| H-5 Article + download Q | Expert | **Active → fixed** | `¿qué valida la integridad…?`; `una descarga` | Source |
| M-1 `5s` spacing | Expert + SQ | **Active → fixed** | `5 s` (3 theory/We Do sites; iDo already correct) | Grep |
| M-2 re- prefixes | Expert | **Active → fixed** | renavegar / renavegación / reobtienes; `re-render` kept as tech noun | Grep |
| M-3 `click` noun → `clic` | Expert + SQ CLICK_CLIC | **Active → fixed** | Prose nouns → `clic`; API `.click()` preserved | Grep bare `click` only in API |
| M-4 `decision dict del run` | Expert | **Active → fixed** | `dict de decisión de la corrida` | Source |
| M-5 `doble-submit*` | Expert | **Active → fixed** | `doble envío` / `enviar dos veces el formulario` | Grep 0 |
| M-6 `accionable` / `actionable` | Expert | **Active → fixed** | `interactuable` / `actuable` / `habilitado` | Grep 0 |
| M-7 `role y name` prose | Expert | **Active → fixed** | hint → `rol y nombre` | Source |
| L-1 step ms | Expert | **Active → fixed** | `un intervalo (\`step\`) en ms` | Source |
| L-2 `sleep` mágicos | Expert | **Active → fixed** | `sleeps` mágicos | Source |
| L-3 login / re-loguear verbs | Expert | **Active → fixed** | `iniciar sesión` / `volver a iniciar sesión` | Grep |
| L-4 `bypassear` distractors | Expert | **Active → fixed** | `evadir el CAPTCHA…` | Grep 0 bypassear |
| jobRelevance bypassea / click | Expert style | **Active → fixed** | evade / clic | Source |
| ToS forbidden / Recovery / adapter Spanglish | Expert §6 | **Active → fixed** | ToS prohíbe; Recuperación; adaptador / capacidades / alcance | Source |
| on-call first gloss | Expert M-8 | **Active → fixed** | `on-call (equipo de guardia)` at first theory + iDo | Source |
| iDo intro concordance | Expert 6.2 | **Active → fixed** | una por subtema / Cada una | Source |
| SQ high AGREEMENT_* | Spanish quality | **Active → fixed** | Same H-3/H-4 repairs | Audit re-run |
| E2 Issue 1 real Playwright graded path | Expert 2 | **Residual (deferred)** | Dual-mode honesty already present; no grader rewrite | Documented |

---

## 3. Full corrected content or precise complete diffs

**Authoritative full section after Round 2:**  
`src/lib/course/sections/s23-computer-vision.ts`  

**This pass:** targeted hand edits across meta, theory, I Do, We Do, You Do, and self-check (~50 localized string replacements) — not a bulk rewrite.

### Representative corrections (post-R2)

**Theory T1-B (actionable / 5 s / step):**

```text
Playwright **auto-espera** a que el elemento sea interactuable (visible, estable, habilitado, recibe eventos).
… un sleep de 5 s **falla en CI lento** y **desperdicia** tiempo en CI rápido.
… con un intervalo (`step`) en ms hasta timeout
```

**Theory T3-B (re- prefixes + doble envío):**

```text
Recuperación ante DOM inestable: … o renavegar al listado …
Tras la renavegación, reobtienes el locator …
Eso evita el doble envío del login/form …
```

**We Do T1-B-E1 concordance (H-3):**

```text
… usa la última `i` del `for`.
Stdout exacto: `2` (primera `i` con ready). No la última `i` del `for` sin `break`.
Debiste imprimir 2 … no la última `i`.
```

**Self-check Q7 (H-5) + Q8/Q9 Spanglish:**

```text
Tras una descarga en el portal demo, ¿qué valida la integridad del archivo?
… no solo el clic.
… evitando el doble envío del login
… no volver a iniciar sesión en cada caso
```

**Kept intentionally:**

- `id: "computer-vision"` (progress/hash compatibility)
- Dict-based graded labs + optional local Playwright sketch (CI reproducibility contract)
- API identifiers: `.click()`, `role`/`name` inside code, `re-render` as technical noun
- Ethics spine (ToS/CAPTCHA/handoff, no farms)

---

## 4. After-Fix Validation Report

### Issue-by-issue confirmation

| Cluster | Status |
|---------|--------|
| Explorer I-01…I-24 | **Already fixed (R1)** — re-verified |
| Expert H-3, H-4, H-5 | **Fixed** |
| Expert M-1…M-7 | **Fixed** |
| Expert L-1…L-4 | **Fixed** |
| Expert C-1 playground / PdfReport | **Residual platform** (not section-owned) |
| Expert H-6 code↔output trust | **Already true**; spot-checks PASS |
| Spanish-quality high agreement | **Fixed** |
| Spanish-quality low CASO-LIM / fragment FPs | **Accepted residual** (code-adjacent grader instructions) |
| Expert-2 real-Playwright-required | **Residual deferred** (platform grader architecture) |
| Global RichText Markdown | **Residual platform** |

### Mechanical validation

| Check | Result |
|-------|--------|
| Code exec spot-checks (hashes, by_role, retry, loop break) | **PASS** |
| TypeScript `tsc --noEmit` | **PASS** (exit 0) |
| Spanish quality `--from 23 --to 23 --no-lt` | **9.61 / 10**, findings **33** (was fleet baseline **7.95 / 10**, **116** findings with LT on prior audit) |
| Meta-leak scan | **0** hard leaks |
| Residual Spanglish scan (`doble-submit`, `bypassear`, `5s`, `accionable`, wrong `i` gender) | **0** |
| Self-check `correctIndex` distribution | 2,0,1,3,2,0,1,3,2 — **unchanged**, no positional bias |
| Markdown ** in learner fields | Still present; depends on platform RichText fix |
| Live SPA body | Hash SPA; source is render source of truth |

Explicit statement:

**No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content. Automation was used only for mechanical validation.**

---

## 5. Residual risks and later recommendations

### Section-local residuals (accepted)

1. Remaining Spanish-quality **low** findings are mostly CASO-LIM telegraphic instructions and code tokens (`pass`, `fail`, `login`, `goto_home`) — intentional grader contracts, not prose failures.
2. `hint` duplex with `hints[0]` schema pattern remains (systemic).
3. MIT 6.100L / CS50P as cross-cutting resources (Expert L-11) — optional later swap for Playwright-specific courses; low impact.

### Platform / deferred

1. **Legacy id `computer-vision`** + filename + InteractivePlaygroundDemo CV demo in `SectionView.tsx` + PdfReport `"23. CV"` — Global Agent C migration with aliases.
2. **RichText Markdown leak** in SectionView — Global Agent A.
3. **Expert-2:** graded real Playwright against fixture server — curriculum product decision; would require CI browser runtime, not a section-only prose fix. Current dual-mode honesty is the correct interim contract.

### Adjacent sections

- Do not retarget S22/S24 from this pass. Connective tissue S22→S23→S24 already present and preserved.

---

## 6. Updated Graph Memory notes

| Node | Notes |
|------|--------|
| Section node | S23 Browser RPA / Playwright; id `computer-vision` (legacy) |
| Corrected concept nodes | Unit spacing (`5 s`); RAE `clic`; re- prefix; concordance `i` feminine; doble envío; dict de decisión; interactuable/actuable; iniciar sesión |
| Prerequisite edges | S22 CP-N2-C email/approval → web adapter |
| Forward edges | S23 verified download → S24 OCR/Document AI |
| Retained strengths | Ethics (ToS/CAPTCHA/handoff); API-first; 8×(I Do+3 We Do); CASO-LIM-023; PE synthetic context; progressive disclosure dict↔Playwright |
| Resolved defect nodes | H-3…H-5, M-1…M-7, L-1…L-4 active residuals |
| Remaining risks | Platform playground/PDF label; optional real-browser graded path |
| Compatibility | Keep `id: computer-vision` until global migration |
| Assessment coverage | 9 MCQs include locators, CAPTCHA, API-first, retry, evidence, PO, hash, checkpoint, storage_state |

---

## 7. Files changed

| File | Why |
|------|-----|
| `src/lib/course/sections/s23-computer-vision.ts` | Only product file: hand-crafted Spanish/style/pedagogy residual fixes |
| `course-state/curriculum_hardening/audits/fixer_reports/round2/S23_FIXER_REPORT.md` | This report |
| `expert_audit/worklog_entries_r2/S23.md` | Full worklog entry |
| `expert_audit/worklog.md` | Brief completion pointer FIXER-R2-S23 |
| `course-state/curriculum_hardening/audits/spanish_quality/S23_SPANISH_QUALITY.json` | Regenerated by validation audit script (`--no-lt`) |

---

## 8. Worklog confirmation

Completion entry written to:

- `expert_audit/worklog_entries_r2/S23.md` (full)
- `expert_audit/worklog.md` (append pointer, Task ID: **FIXER-R2-S23**)

---

Section 23 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
