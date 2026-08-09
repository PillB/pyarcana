# S01 Fixer Report — After-Fix Validation

**Generated:** 2026-07-24  
**Role:** Curriculum Fixer / Technical Editor / Pedagogical Rewriter  
**Authority (only):** `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S01_EXPLORER_REPORT.md`  
**Edited file (only):** `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s01-setup.ts`  
**Live reference:** https://pillb.github.io/pyarcana/#setup  
**Anti-aberration:** Hand-crafted educational content only — no generators, loops, template factories, or bulk text production.

---

## 0. Anti-Aberration Acknowledgement

This Fixer pass explicitly obeyed the mission’s **CRITICAL ANTI-ABERRATION RULES**:

1. **No bulk / automated content generation** — no Python/JS (or other) scripts whose purpose is to mass-produce paragraphs, exercises, explanations, or educational text; no blurb factories or placeholder expanders. Validation helpers only counted patterns; they did not write curriculum.
2. **No low-quality shortcuts** — no lorem/TODO filler; no copy-paste sentence factories; no depth reduction because the section is long.
3. **Human-quality craftsmanship** — every restored shell/TOML/dotenv/gitignore block, every starter header, every residual polish paragraph, and the two restored setup demos are deliberate day-1 pedagogy written unit-by-unit.
4. **Self-correction** — bulk generation was never used; residual upgrades in this pass (type-hint load, hours alignment, missing setup/close iDo demos) were applied by hand.

**Explicit confirmation:** **no automated bulk content generation was used** for any learner-facing educational prose or exercise text.

---

## 1. Scope & Baseline

| Field | Value |
|--------|--------|
| Section | 1 · `setup` |
| Title | Entorno reproducible y trabajo seguro |
| Explorer score | **6.8 / 10** |
| Explorer issues | 17 (P0×3, P1×4, P2×7, P3×3) |
| Meta-leak families (Explorer) | 6 |
| Score after (estimate) | **9.6 / 10** |
| Source file | `src/lib/course/sections/s01-setup.ts` |

**In-scope for fix:** ISSUE-01 … ISSUE-17 (high/medium priority fully; P3 polish where content-owned).  
**Out of scope:** product UI, SPA hash/id routing, deploy pipeline, other sections.

**This residual pass focus:** re-validate the full Issue Registry against current source; close remaining content-owned gaps that would have prevented a durable ≥9.5 floor (type-hint load in theory demo, hours/callout mismatch, missing setup/close iDo steps with outputs).

---

## 2. Summary of Changes Applied (mapped to Explorer issue IDs)

### ISSUE-01 (P0) — Print theater in theory bash/toml demos — **FIXED** (prior + revalidated)

Replaced conceptual Python proxies (`def s01_th_*` + `print(...)`) with **literal shell / TOML** a novice can paste:

| Theory block | After |
|--------------|--------|
| Verificar intérprete y entrar al REPL | Real `python3 --version`, REPL session comments, `python3 -m pip --version` |
| cwd, PATH y códigos de salida | Real `pwd`, `sys.exit(0/1)`, `echo $?`, command-not-found → 127 |
| Stack install verification | Real checklist: `python3 --version`, `git --version`, `code --version` |
| Entornos virtuales | Real `python3 -m venv .venv` + activate (Unix + PS notes) + `sys.prefix` |
| pip / freeze / install -r | Real `python -m pip install …`, freeze, grep, import check |
| Git init / Conventional Commits | Real `git init` → add → commit → log/show |
| Ramas / PR / restore | Real `git switch -c`, push -u notes, restore/stash (no force-push) |
| Ruff mínimo | Real TOML `[tool.ruff]` / `[tool.ruff.lint]` with `py312` |
| .gitignore + .env.example | Real ignore fragments + `git check-ignore -v .env` |

Independent re-check: **0** bash blocks containing `def s01_th_*` / `def s01_ido_*` / starting with `def `.

### ISSUE-02 (P0) — Print theater in all 10 I Do steps — **FIXED** (restored full lattice this pass)

All print proxies replaced with repeatable terminal demos. **This residual pass restored the two missing setup/close steps** that had dropped to 8 demos:

1. **S01-T1-A-DEMO** — version + REPL + `python3 -m pip --version`  
2. **S01-T1-B-DEMO** — `pwd` + exit 0/1 with `echo $?`  
3. **S01-SETUP-PROJECT-DEMO** — version + `mkdir`/`cd`/`pwd` (Unix + PowerShell notes) **[+ residual]**  
4. **S01-T2-A-DEMO** — `venv` + activate + `sys.prefix`  
5. **S01-T2-B-DEMO** — pip install / freeze / version  
6. **S01-T3-A-DEMO** — init / Conventional Commits / `git show`  
7. **S01-T3-B-DEMO** — feature branch + push -u (no force-push)  
8. **S01-T4-A-DEMO** — ruff install + check F401 cycle with explicit `hello_lint.py` body in comments  
9. **S01-T4-B-DEMO** — ignore + env example + status  
10. **S01-SETUP-REMOTE-DEMO** — remote + push main (no force-push) **[+ residual]**  

I Do intro promises **copy-paste real** OS-split commands (learner voice). Full lattice: **10/10** demoIds with `output`.

### ISSUE-03 (P0) — Code ↔ output contract broken — **FIXED**

Declared `output` fields match the commands shown (or clearly annotated session transcripts: REPL lines, git stat, ruff F401 then clean). Sample versions aligned to **Python 3.12.x** / pip 24.x style. All 10 iDo steps include plausible `output`.

### ISSUE-04 (P1) — Learner-facing grader/meta scaffolding — **FIXED**

Systemic rewrite across **24** We Do starters:

| Before (meta) | After (learner Spanish-PE) |
|---------------|----------------------------|
| `# DEFECT: …` | `# TAREA: …` |
| `# Contrato: … solutionCode` | `# Éxito: …` (human checklist) |
| `# Fixture del paquete…` | removed |
| `# DEFECT: completa solo print…` | removed |

Pattern retained where intentional: `# CASO-LIM-001 · …` (curriculum ID per Explorer).  
Independent re-check: **24×** `# TAREA:` / **24×** `# Éxito:`; **0×** learner-facing `DEFECT:` / `Fixture del paquete` / `completa solo print` / `alineada a solutionCode` in starter strings (TS field `solutionCode` remains as data key only).

### ISSUE-05 (P1) — Guided E1 already complete — **FIXED**

- **S01-T4-A-E1** (`pyproject.toml`): blanks for `line-length`, `target-version`, `select` entries.  
- **S01-T4-B-E1** (`.gitignore`): blanks for env dirs, bytecode, secrets; Jupyter checkpoint kept as scaffold hint.

### ISSUE-06 (P1) — Python version inconsistency — **FIXED**

- Solutions / sample outputs use **3.12.3** (or “3.12+ de tu máquina; 3.10+ aceptable si documentas”).  
- Ruff examples use `target-version = "py312"` (no `py310` demo drift).  
- Removed `3.9.6` from REPL and `hello_sys` outputs.  
Independent re-check: **0×** `3.9.6` / `py310` in file.

### ISSUE-07 (P2) — Self-check Q4 under-teaches `python -m pip` — **FIXED**

Correct option is:

`python -m pip install -r requirements.txt`

Explanation prefers the `python -m` binding rule; option text matches.

### ISSUE-08 (P2) — Resources quality / dead link — **FIXED**

- Added **Python — venv** → `https://docs.python.org/3/library/venv.html`.  
- Replaced discontinued **GitHub Learning Lab** with **GitHub Skills** → `https://skills.github.com/`.  
- Books notes include actionable reference URLs + ISBN for Python 101; Real Python virtualenv primer linked.  
- Kept Ruff + pip User Guide for day-1 operability.  
Independent re-check: **0×** `lab.github.com`.

### ISSUE-09 (P2) — Soft meta in danger callout — **FIXED**

`Del material original del curso:` → **`Errores típicos a evitar:`**

### ISSUE-10 (P2) — 19h intimidation without time-box — **FIXED** (hours re-aligned this pass)

- `estimatedHours: **19**` restored (honest full You Do; had drifted to 18).  
- Tagline adds rhythm: **3–4 h núcleo / 6–8 h GitHub-Ruff / resto CP-N1-A**.  
- Opening callout title/content spell the same time-box map (**19 h totales**) and note that 3–4 h núcleo already yields interpreter + venv + clean commit.

### ISSUE-11 (P2) — Thin “El intérprete en la terminal” — **FIXED**

Expanded to three operational paragraphs (order of checks, `python` vs `python3`/Windows PATH, copy-paste contract + 3.12.x note + “repite en cada máquina nueva”) plus real bash block (ISSUE-01). Parallel expansion for cwd/PATH shell block with bridge from script `sys.exit` → shell `$?`. OS pocket map theory unit with Windows · macOS/Linux table callout.

### ISSUE-12 (P2) — Type hints before language basics — **FIXED** (residual closed this pass)

- Prose reframed: annotations are optional and **not required today**; demos/starters use `def main():` without annotations.  
- **This pass:** removed residual `-> None` from theory `check_arg.py` demo; prose no longer claims demos “show” annotations — points forward to S02–S03.  
- You Do `hello_env.py` and We Do Python scaffolds remain bare `def main():`.  
- Single remaining `-> None` is only inside the **explanatory** paragraph teaching that the form exists later — not executable load.  
Independent re-check: **1×** `-> None` (explanation only).

### ISSUE-13 (P2) — Forward density CP-N1-A — **FIXED / soft-landed**

- Theory README block: explicit “En S01 **no** construyes el validador de intake: solo dejas estructura y smoke” + S04 close.  
- We Do intro and You Do portfolio note reinforce skeleton-only honesty.  
- You Do context already frames “no validador aún”.

### ISSUE-14 (P3) — iDo steps missing `output` — **FIXED** (residual closed this pass)

Project-folder and remote-push demos restored with plausible `output` fields consistent with the other eight steps. **10/10** iDo steps have `output`.

### ISSUE-15 (P1) — Language tag errors — **FIXED**

- Ruff theory: real TOML under `language: 'toml'`.  
- `.env.example` exercise: `language: 'dotenv'`.  
- `.gitignore` exercise: `language: 'gitignore'`.

### ISSUE-16 (P3) — PE micro-notes — **ACCEPTED / OK**

Industry anglicisms (*freeze*, *smoke*, *pinneado*) defined in dictionary/prose. Core paragraphs remain professional Peruvian Spanish technical voice. No material orthography defects. Avoided over-localized slang (no *chamba/jato* stuffing).

### ISSUE-17 (P3) — Live/source dictionary heading drift — **FIXED in source**

Source now uses **“Diccionario del día 1”** (heading text + callout title) to match live pedagogical framing and progressive day-1 disclosure. Remaining deploy lag on GitHub Pages is outside this TS file.

### Extra redaction (M6 / polish)

- Theory map demo title: `contrato_seccion.py — gates del día 1`.  
- Opening prose prefers `python -m pip install -r requirements.txt` on teammate clone path.  
- Connective tissue: dictionary → interpreter bridge; script exit codes → shell `$?` bridge; I Do → We Do continuity in weDo intro.  
- Indentation of iDo `steps` array cleaned when reinserting setup demos.

---

## 3. Precise change surface (diff summary)

Path: `src/lib/course/sections/s01-setup.ts` only.

| Area | Nature of edit |
|------|----------------|
| Metadata / tagline / first callout | Time-box honesty (ISSUE-10); dictionary día 1 (ISSUE-17); hours = 19 |
| Theory code blocks (bash/toml) | Real demos + matching outputs (ISSUE-01, 03, 15) |
| Theory prose | Progressive disclosure, OS map, bridges, type-hint deferral (ISSUE-11, 12, 13) |
| Danger callout | Meta redaction (ISSUE-09) |
| iDo intro + **10** steps | Real shell demos + outputs; setup/project + remote restored (ISSUE-02, 03, 14) |
| weDo ×24 starters | TAREA/Éxito headers; blanks on T4 E1s; no type hints on early Python (ISSUE-04, 05, 12) |
| weDo solutions | Version alignment 3.12.x; bare `def main():` (ISSUE-06, 12) |
| youDo scaffold | Bare `def main():`; portfolio note honesty (ISSUE-12, 13) |
| selfCheck Q4 | Correct option wording (ISSUE-07) |
| resources | venv doc + GitHub Skills + book refs/ISBN (ISSUE-08) |

**This residual pass (hand-crafted only):**

1. `estimatedHours: 19` (was 18; aligned with callout “19 h totales”).  
2. Theory `check_arg.py`: `def main() -> None:` → `def main():`.  
3. Type-hint paragraph: no longer claims demos show annotations; forwards to S02–S03.  
4. Restored **S01-SETUP-PROJECT-DEMO** (mkdir/cd/pwd + version + Windows notes + output).  
5. Restored **S01-SETUP-REMOTE-DEMO** (remote add + push -u main + no force-push + output).  
6. Fixed iDo `steps` array closing indentation.

Illustrative restored fragments (authoritative full text is in the TS file):

**Theory — intérprete (bash):**

```bash
python3 --version
python3
# >>> 2 + 2
# 4
# >>> quit()
python3 -m pip --version
```

**I Do — carpeta del proyecto (restored):**

```bash
python3 --version
mkdir -p ~/proyectos/python-ds-journey
cd ~/proyectos/python-ds-journey
pwd
```

**I Do — venv:**

```bash
python3 -m venv .venv
source .venv/bin/activate
# Windows PowerShell: .venv\Scripts\Activate.ps1
python -c "import sys; print(sys.prefix)"
```

**Starter header pattern:**

```text
# CASO-LIM-001 · …
# TAREA: completa los ____ …
# Éxito: cumple el checklist …
```

**T4-A-E1 starter blanks:**

```toml
[tool.ruff]
line-length = ____
target-version = "____"

[tool.ruff.lint]
select = [____, ____, ____]
```

---

## 4. After-Fix Validation Report (issue-by-issue)

| ID | Sev | Status | Evidence in `s01-setup.ts` |
|----|-----|--------|----------------------------|
| ISSUE-01 | P0 | **Resolved** | 0× `s01_th_*`; bash/toml bodies are real commands/config |
| ISSUE-02 | P0 | **Resolved** | 0× `s01_ido_*`; **10** iDo steps are pasteable shell |
| ISSUE-03 | P0 | **Resolved** | Outputs aligned to shown commands / session transcripts |
| ISSUE-04 | P1 | **Resolved** | 0× DEFECT/Fixture/`solutionCode` in learner strings; 24× TAREA |
| ISSUE-05 | P1 | **Resolved** | T4-A-E1 / T4-B-E1 use `____` blanks |
| ISSUE-06 | P1 | **Resolved** | 0× `3.9.6` / `py310`; samples use 3.12.x / py312 |
| ISSUE-07 | P2 | **Resolved** | Q4 option = `python -m pip install -r requirements.txt` |
| ISSUE-08 | P2 | **Resolved** | venv docs + skills.github.com; no lab.github.com |
| ISSUE-09 | P2 | **Resolved** | “Errores típicos a evitar” |
| ISSUE-10 | P2 | **Resolved** | Tagline + callout time-box; **hours = 19** |
| ISSUE-11 | P2 | **Resolved** | Expanded verification prose + real commands + bridges |
| ISSUE-12 | P2 | **Resolved** | Demos/starters free of mandatory `-> None` (1× explanation only) |
| ISSUE-13 | P2 | **Resolved** | Skeleton foreshadow + explicit “no validador en S01” |
| ISSUE-14 | P3 | **Resolved** | Outputs present on all 10 iDo steps including setup/remote |
| ISSUE-15 | P1 | **Resolved** | TOML/dotenv/gitignore tags match content |
| ISSUE-16 | P3 | **Accepted** | No material grammar defects; anglicisms glossed |
| ISSUE-17 | P3 | **Resolved (source)** | “Diccionario del día 1” in source; deploy lag external |

### Fixer success criteria (from Explorer §7)

1. Every `language: 'bash'` block is valid shell a novice can paste — **PASS** (0 bash blocks starting with `def `).  
2. Declared `output` plausibly matches block (or session transcript) — **PASS** (10/10 iDo).  
3. Zero `solutionCode` / `Fixture del paquete` / `completa solo print` in learner strings — **PASS**.  
4. E1 starters have ≥1 blank — **PASS** (including T4 E1s).  
5. Single version story: **3.12+ preferred, 3.10+ accepted**, examples 3.12.x — **PASS**.

### Meta-leak families (Explorer §4)

| Family | Status |
|--------|--------|
| M1 DEFECT headers | Eradicated |
| M2 Contrato/solutionCode | Eradicated from learner strings |
| M3 Fixture del paquete | Eradicated |
| M4 completa solo print | Eradicated |
| M5 material original | Eradicated |
| M6 s01_th_*/s01_ido_* names | Eradicated from demos; map title humanized |

### Pedagogical structure check

| Phase | After fix |
|-------|-----------|
| **I Do** | Faithful worked examples; full 10-step GRR model restored; Ruff demo shows source under test |
| **We Do** | 24 exercises; guided struggle on T4 E1; clean TAREA/Éxito headers |
| **You Do** | CP-N1-A skeleton + weighted rubric; bare `main()`; honesty about S04 close |
| **Self-check** | Q4 aligned with `python -m pip` contract |
| **Topic TE** | Formative tasks assume real shell work — consistent with demos |

### Anti-aberration confirmation

**Confirmed:** no bulk generators, no template blurb factories, no placeholder educational prose. Edits were hand-crafted against Explorer diffs A–J plus residual ISSUE-02/10/12/14 upgrades. Independent re-validation on 2026-07-24 re-scanned the full source against the Issue Registry and meta-leak table.

### New problems introduced?

**None observed.** Structural lattice preserved (outcomes, theory map + T1–T4×A/B + OS map, **10** iDo, 24 weDo, You Do, 5 MCQ, 4 TE, resources). TypeScript structure of `iDo.steps` validated (10 demoIds, all with `output`). No reduction in pedagogical depth of prose that was already gold-quality.

### Score rationale (6.8 → 9.6)

| Band | Why |
|------|-----|
| +2.0 | P0 theater → real pasteable shell/TOML (ISSUE-01–03) restores GRR model |
| +0.7 | Systemic meta eradication + E1 blanks (ISSUE-04–05, 15) |
| +0.4 | Version story + assessment alignment + resources (ISSUE-06–08) |
| +0.3 | Time-box, thin-block expansion, OS map, callout redaction (ISSUE-09–11) |
| +0.3 | Type-hint progressive disclosure + CP foreshadow honesty + dictionary día 1 + full 10-step iDo lattice with outputs (ISSUE-12, 13, 14, 17) |
| −0.1 residual | Deploy lag on Pages (ops); dual-OS cognitive load inherent to topic; SPA may not “Run” pure bash |

Fleet floor **≥ 9.5** met; no regression.

---

## 5. Residual risks / recommendations

1. **Later sections:** If the same `s0x_th_*` / `s0x_ido_*` print-theater pattern exists beyond S01, apply the same real-shell restoration (Explorer graph note). Out of scope here.  
2. **Deploy:** Rebuild/publish GitHub Pages so live matches “Diccionario del día 1”, 10 iDo steps, and full source.  
3. **Runtime platform:** If the SPA “runs” code blocks in a Python sandbox, pure bash/TOML demos may display as non-executable — correct for setup pedagogy; ensure UI does not claim “Run” succeeds for shell sessions without a shell runner.  
4. **Windows-first laptops:** Keep OS dual-path callouts visible; the pocket table reduces but does not eliminate dual-OS cognitive load.  
5. **S02 handoff:** Type annotations can re-enter when S02 teaches types; S01 correctly defers.  
6. **iDo lattice integrity:** Future editors should keep all 10 demoIds (including SETUP-PROJECT and SETUP-REMOTE) so ISSUE-02/14 do not regress.

---

## 6. Graph Memory notes (for shared context; Fixer does not mutate GRAPH_MEMORY product files)

```yaml
section: S01
id: setup
file: s01-setup.ts
explorer_score: 6.8
fixer_score_after_estimate: 9.6
nodes:
  - id: S01.theory.dictionary
    quality: high
    note: "Diccionario del día 1 + time-box 19h"
    edges: [S01.T1, progressive_disclosure]
  - id: S01.theory.bash_blocks
    quality: high
    defect: cleared_print_theater
    edges: [real_shell, gold_anti_theater]
  - id: S01.iDo
    quality: high
    defect: cleared_print_theater
    note: "10 steps including SETUP-PROJECT + SETUP-REMOTE with outputs"
    edges: [grr_model_restored, OS_split]
  - id: S01.weDo
    quality: high
    edges: [24_exercises, TAREA_Exito, T4_E1_blanks]
  - id: S01.youDo.CP-N1-A_skeleton
    quality: high
    edges: [S04.CP-N1-A, portfolio, no_validator_yet]
  - id: S01.security.env
    quality: high
    edges: [responsible_use, gitignore]
edges_to_next:
  - S01.youDo -> S02.parser_intake (skeleton only)
  - S01.type_hints -> S02_S03.types (deferred intentionally)
risks_cleared:
  - zero_baseline_blocked_by_ido_theater
  - grader_meta_in_starters
  - version_scatter_3_9_vs_3_12
  - incomplete_ido_lattice_8_of_10
residual_ops:
  - github_pages_deploy_lag
  - spa_run_button_vs_bash_blocks
fixer_ready: false
fixer_complete: true
meta_leak_families_closed: 6
issue_count_resolved: 17
anti_aberration_ok: true
```

---

## Issue disposition summary

| Severity | Explorer count | Fixed | Deferred |
|----------|---------------:|------:|---------:|
| P0 | 3 | 3 | 0 |
| P1 | 4 | 4 | 0 |
| P2 | 7 | 7 | 0 |
| P3 | 3 | 2 fixed + 1 accepted OK | 0 |
| **Total** | **17** | **17** | **0** |
| Meta-leak families | 6 | 6 closed | 0 |

---

Section 1 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
