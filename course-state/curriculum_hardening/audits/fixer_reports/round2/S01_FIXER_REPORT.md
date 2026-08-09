# S01 Fixer Report (Round 2) — Entorno reproducible y trabajo seguro

**Role:** Curriculum Fixer · Technical Editor · Pedagogical Rewriter (second-round)  
**Date:** 2026-07-25  
**Task ID:** FIXER-R2-S01  
**Scope lock:** Section 1 only (`id: setup`)  
**Canonical source (only product file edited):** `src/lib/course/sections/s01-setup.ts`  
**Live:** https://pillb.github.io/pyarcana/#setup  

---

## 1. Section identification and sources reviewed

| Field | Value |
|--------|--------|
| Section # | **1** |
| Title | Entorno reproducible y trabajo seguro |
| shortTitle | Entorno reproducible |
| Internal id | `setup` |
| Canonical file | `src/lib/course/sections/s01-setup.ts` |
| Live route | `#setup` |
| Primary Explorer report | `course-state/curriculum_hardening/audits/explorer_reports/S01_EXPLORER_REPORT.md` |
| Expert report | `expert_audit/S01_report.md` |
| Spanish-quality JSON | `course-state/curriculum_hardening/audits/spanish_quality/S01_SPANISH_QUALITY.json` |
| Grammar plan | `expert_audit/_GRAMMAR_SUBPLAN.md` |
| Campaign summary | `expert_audit/CAMPAIGN_SUMMARY.md` |
| Shared worklog | `expert_audit/worklog.md` |
| Round-1 Fixer claim (re-audited) | `course-state/curriculum_hardening/audits/fixer_reports/S01_FIXER_REPORT.md` |
| Expert 2 audit | No S01-specific file under `expert_2_audit/` |
| Assessment | In-section `selfCheck` (now 8 MCQs); topicEvaluations (4); You Do CP-N1-A skeleton |
| Validation | Manual greps; execute-and-diff for `check_arg` / section contract; `scripts/spanish_quality_audit.py --from 1 --to 1 --no-lt`; `tsc --noEmit` |

### Anti-aberration acknowledgment

No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content. Automation was used only for mechanical validation (grep, code execution, TypeScript check, Spanish-quality metrics).

---

## 2. Summary of changes applied

### Round-2 reality check

Round-1 Fixer had already restored **real bash/TOML demos**, learner-facing `# TAREA:` / `# Éxito:` headers, T4 E1 blanks, Python **3.12.x** alignment, self-check Q4 `python -m pip install -r`, resources (venv + GitHub Skills), and danger-callout redaction. Independent re-check confirmed those Explorer P0/P1 items **already fixed**.

Round 2 focused on **still-active expert and Spanish-quality residuals**: meta-leaks (`responsible_use`), dictionary cognitive load, hours inconsistency, anglicized verbs, run-ons, developer comments, self-check coverage gaps, and orthography.

### Resolution table

| Issue | Source | Status before R2 | Change applied | Validation |
|-------|--------|------------------|----------------|------------|
| ISSUE-01 Theory bash theater | Explorer | **Already fixed (R1)** | Confirmed real `python3 --version` / REPL / pip blocks | Grep 0 `def s01_th_` |
| ISSUE-02 I Do print theater | Explorer | **Already fixed (R1)** | 8 real shell demos (T1–T4 × A/B) with outputs | Grep 0 `def s01_ido_` |
| ISSUE-03 Code↔output contract | Explorer | **Already fixed (R1)** | Outputs match session transcripts / 3.12.x | Manual sample + exec |
| ISSUE-04 DEFECT/solutionCode starters | Explorer | **Already fixed (R1)** | 24× `# TAREA:` / `# Éxito:` | Grep 0 `DEFECT:` |
| ISSUE-05 T4 E1 blanks | Explorer | **Already fixed (R1)** | `____` in pyproject / gitignore | Source inspect |
| ISSUE-06 Version 3.9 vs 3.12 | Explorer | **Already fixed (R1)** | Examples 3.12.3 / py312 | Grep 0 `3.9.6`/`py310` |
| ISSUE-07 Self-check Q4 pip | Explorer | **Already fixed (R1)** | Correct option `python -m pip install -r …` | Source inspect |
| ISSUE-08 Resources | Explorer | **Already fixed (R1)** | venv doc + GitHub Skills | Grep 0 `lab.github` |
| ISSUE-09 “material original” | Explorer | **Already fixed (R1)** | “Errores típicos a evitar” | Source inspect |
| ISSUE-10 Hours / time-box | Explorer + Expert-25 | **Partial** (18 vs 19 callout) | Callout title/content → **18 h totales**; tagline time-box retained; `estimatedHours: 18` | Grep 0 `19 h` |
| ISSUE-11 Thin verification block | Explorer | **Already fixed (R1)** | Operational 3-paragraph block + real bash | Source inspect |
| ISSUE-12 Type hints early | Explorer | **Partial** | Removed residual `-> None` from theory `check_arg.py`; prose only shows form as optional | Grep 1× explanatory only |
| ISSUE-13 CP-N1-A foreshadow | Explorer | Soft-landed | You Do + README prose clarify skeleton-only | Manual |
| ISSUE-14 iDo outputs / 10 steps | Explorer | **8 demos OK** | All 8 have `output`; setup/remote demos not required (covered in T2/T3) | Residual low |
| ISSUE-15 Language tags | Explorer | **Already fixed (R1)** | toml / gitignore / dotenv | Source inspect |
| ISSUE-16/17 PE + live drift | Explorer | OK | “Diccionario del día 1” kept; PE polish in R2 | Manual |
| S01-ISSUE-01 `responsible_use` leak | Expert + SQ | **Active → fixed** | Callout + edgeCase → “uso responsable de los datos” | Grep: only schema keys in `rubric_0_3` |
| S01-ISSUE-02/03/04 dev comments | Expert | **Active → fixed** | Removed 3 author JS comments | Grep 0 |
| S01-ISSUE-05 Diccionario mega-para | Expert + SQ | **Active → fixed** | Split into 5 short paragraphs by T1/T2/T3 clusters; removed hover promise | Manual |
| S01-ISSUE-06 jobRelevance density | Expert | **Active → fixed** | Slimmed vocabulary packing; `90 %`; “usarlas” agreement | Manual |
| S01-ISSUE-07 Ritmo run-on | Expert + SQ | **Active → fixed** | Split recall + ritmo + reassurance; 18 h | Manual |
| S01-ISSUE-08 `ultra rápido` | Expert | **Active → fixed** | `ultrarrápido`; “linter y formateador”; “revisión de código” | Grep |
| S01-ISSUE-10/11 Anglicisms | Expert | **Active → fixed** | trackear/trackeado/trackeaste → rastrear/versionado; paniquear → entrar en pánico; transferes → trasladas; stagear → `git add`/staging; commitear family → hacer commit / sin commit | Grep |
| S01-ISSUE-12 hover promise | Expert | **Active → fixed** | “Vuelve a este bloque…” | Manual |
| S01-ISSUE-13/22 Quotes + runtime | Expert | **Active → fixed** | «…»; `tiempo de ejecución` | Manual |
| S01-ISSUE-16 Long check_arg E2 | Expert | **Active → fixed** | Numbered contract (1)/(2) | Manual |
| S01-ISSUE-19 Self-check coverage | Expert | **Active → fixed** | +3 MCQs: exit codes, Ruff/`pyproject.toml`, force-push a main | 8 questions |
| S01-ISSUE-15 hint≡hints[0] | Expert | **Accepted residual** | Schema requires `hint`; keep both in sync | Documented |
| S01-ISSUE-14 E1/E2/E3 prefix monotony | Expert | **No action** (wayfinding) | Intentional | N/A |
| SQ space_before_punct / `$?` FPs | Spanish quality | Mostly FPs | Code paths / shell vars — no false “fix” | Documented |
| Global RichText Markdown | Cross-cutting | Platform | Not section-owned | Residual platform |

---

## 3. Full corrected content or precise complete diffs

**Authoritative full section after Round 2:**  
`src/lib/course/sections/s01-setup.ts`  

**This pass:** ~98 lines changed (60 insertions / 38 deletions) — targeted hand edits, not a bulk rewrite.

### Representative corrections (post-R2)

**Dictionary (S01-ISSUE-05/12):**

```text
**Diccionario del día 1.** Léelo antes de seguir; el resto de la sección profundiza cada término.
**Intérprete y terminal (T1):** *Intérprete* — … *Terminal (shell)* — …
**Entornos (T2):** *Entorno virtual (`venv`)* — … *pip* — … *requirements.txt* — …
**Git (T3):** *Repo* — … *Clonar* — … *Commit* — … *Pull Request (PR)* — …
Vuelve a este bloque cuando veas una palabra en negrita y no la recuerdes.
```

**Meta-leak (S01-ISSUE-01):**

```diff
- responsible_use en la rúbrica es tan importante como "que el script corra".
+ El uso responsable de los datos pesa en la rúbrica tanto como "que el script corra".

- Olvidar responsible_use (PII real)
+ Olvidar el uso responsable de los datos (PII real)
```

**We Do intro (S01-ISSUE-11):**

```diff
- aquí rellenas blanks, diagnosticas y transferes a escenarios de equipo.
+ aquí rellenas huecos, diagnosticas y trasladas lo aprendido a escenarios de equipo.
```

**Self-check additions (S01-ISSUE-19):** three new items covering exit codes, Ruff config file, and force-push prohibition (correctIndex 1, 2, 1 respectively).

**Hours alignment:** callout title/content use **18 h totales**, matching `estimatedHours: 18` and the tagline time-box.

---

## 4. After-Fix Validation Report

| Check | Result |
|--------|--------|
| Explorer ISSUE-01…17 disposition | Fixed (R1) or fixed (R2) or residual documented |
| Expert S01-ISSUE-01…25 disposition | Blocking/meta/cognitive items fixed; P3 monotony/hint-dup residual documented |
| Spanish-quality actionable high items | Meta `responsible_use`, run-on ritmo, dense dictionary — fixed |
| `def s01_th_*` / `def s01_ido_*` | **0** |
| Learner `DEFECT:` / `Fixture del paquete` / `solutionCode` prose | **0** (TS key `solutionCode` remains schema) |
| Learner-facing `responsible_use` | **0** (only `rubric_0_3` schema keys) |
| `# TAREA:` count | **24** |
| demoId count | **8** (all with `output`) |
| Self-check questions | **8** |
| Code execution: `check_arg` 1-arg / 0-arg | exit 0 / exit 1 — **PASS** |
| Code execution: section_contract prints | match declared output — **PASS** |
| TypeScript `tsc --noEmit` | **PASS** (exit 0) |
| Spanish quality `--no-lt` **before (fleet JSON)** | score **7.28**, findings **222**, FH **79.5** |
| Spanish quality `--no-lt` **after R2** | score **8.71**, findings **88**, FH **79.8** |
| Markdown raw `**` in jobRelevance | Platform RichText residual (global) |
| Previous/next continuity | S01 zero-baseline → S02; no adjacent edits |
| Assessment keys | Self-check correctIndex values reviewed (0/2/3/1/0/1/2/1) — no all-same-position |

**Explicit statement:**  
No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content. Automation was used only for mechanical validation.

---

## 5. Residual risks and later recommendations

### Section-local residuals

1. **`hint` ≡ `hints[0]`** on 24 exercises — required by `WeDoStep.hint` in `types.ts`; UI may use either. Do not drop `hint` without a schema migration.
2. **Some long instructions** remain above ~32 words (transfer tasks, PR body) — acceptable for multi-part contracts; split further only if learners report load spikes.
3. **Industry loanwords retained:** freeze, smoke, pinneado, PATH, REPL, PR, staging (as noun with Spanish verbs) — defined in context.
4. **I Do has 8 demos** (one per subtopic), not 10 — R1 report claimed 10 including SETUP-PROJECT/REMOTE; current lattice covers T1–T4 × A/B with real commands. Optional future: restore project-mkdir / remote-push as extra steps if product wants 10.
5. **Spanish SQ still reports medium findings** driven largely by shell snippets (`$?`, paths, repeated `venv` tokens in code lists) — false positives for day-1 setup content.

### Repository-wide / deferred

- **RichText / raw Markdown** in some SectionView fields — Global Agent A.
- **Legacy id `setup`** is intentional and stable; no rename.
- **topicEvaluations** rendering is platform-dependent; content kept coherent if/when rendered.

### Adjacent sections

- None edited. S02 should continue assuming venv + `python -m pip` + Conventional Commits + force-push ban as course invariants.

---

## 6. Updated Graph Memory notes

```yaml
section: S01
id: setup
file: s01-setup.ts
round: 2
explorer_score_baseline: 6.8
expert_score_baseline: 8.2
spanish_quality_before: 7.28
spanish_quality_after_r2: 8.71
nodes:
  - id: S01.theory.dictionary
    quality: high  # split clusters; no hover claim
  - id: S01.theory.bash_blocks
    quality: high  # real shell/TOML (R1 + revalidated)
  - id: S01.iDo
    quality: high  # 8 real demos
  - id: S01.weDo
    quality: high  # TAREA/Éxito; blanks on T4 E1; anglicisms cleaned
  - id: S01.youDo.CP-N1-A_skeleton
    quality: high
  - id: S01.security.env
    quality: high  # no responsible_use schema leak in prose
edges_to_next:
  - S01.youDo -> S02 (skeleton only)
invariants_established:
  - venv/.venv canonical
  - python -m pip
  - Python 3.12+ (3.10+ if documented)
  - Conventional Commits
  - no force-push to main
  - CP-N1-A closes in S04
resolved_defect_nodes:
  - print_theater
  - grader_meta_starters
  - responsible_use_leak
  - dictionary_cognitive_overload
  - hours_18_vs_19
remaining_risks:
  - hint_hints0_schema_dup
  - platform_richtext_markdown
compatibility:
  - id: setup
  - progress keys unchanged
```

---

## 7. Files changed

| File | Why |
|------|-----|
| `src/lib/course/sections/s01-setup.ts` | Only product curriculum file in scope — R2 prose/meta/assessment fixes |
| `course-state/curriculum_hardening/audits/fixer_reports/round2/S01_FIXER_REPORT.md` | This report |
| `expert_audit/worklog_entries_r2/S01.md` | Full worklog entry |
| `expert_audit/worklog.md` | Append completion pointer FIXER-R2-S01 |
| `course-state/curriculum_hardening/audits/spanish_quality/S01_SPANISH_QUALITY.json` (regen) | Validation script output only |

---

## 8. Worklog confirmation

- Full entry: `expert_audit/worklog_entries_r2/S01.md`
- Pointer appended to: `expert_audit/worklog.md` with Task ID **FIXER-R2-S01**

---

Section 1 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
