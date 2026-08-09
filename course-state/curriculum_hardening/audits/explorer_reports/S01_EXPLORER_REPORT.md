# S01 Explorer Report — Curriculum Auditor

**Generated:** 2026-07-24  
**Auditor role:** Multi-agent Curriculum Auditor / Pedagogical Analyst / Technical Editor  
**Method:** Stanford STORM multi-pass + Graph Engineering + Loop Engineering  
**Scope lock:** Section 1 only — no product fixes applied  

---

## 1. Section Identification & Scope

| Field | Value |
|--------|--------|
| **Section index** | 1 |
| **Platform id (hash)** | `setup` |
| **Title** | Entorno reproducible y trabajo seguro |
| **Short title** | Entorno reproducible |
| **Source file** | `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s01-setup.ts` |
| **Live URL** | https://pillb.github.io/pyarcana/#setup |
| **Level / phase** | Principiante / phase 0 |
| **Estimated hours** | 19 |
| **Case id** | `CASO-LIM-001` |
| **Capstone link** | Esqueleto **CP-N1-A** (cierre formal en S04) |

### Scope covered in this run

- Metadata: `jobRelevance`, `learningOutcomes` (7)
- Theory: 11 blocks (mapa + T1–T4 × A/B + stack + quality files)
- I Do: 10 steps (demoIds S01-T1-A … S01-T4-B + setup/close steps)
- We Do: 24 exercises (8 subtopics × E1 guided / E2 independent / E3 transfer)
- You Do: esqueleto CP-N1-A + rúbrica ponderada
- Self-check: 5 MCQ
- Topic evaluations: 4 formativas (S01-T1 … T4)
- Resources: docs / books / courses
- Prior artifacts reviewed for context only: `S01_AUDIT.json`, `S01_PARAGRAPHS.md`, `GOLD_STANDARD_CHECKLIST.md`, `visible_paragraphs/s01_setup.json`, `MASTER_DEFECT_LOG.md`
- **Not in scope:** editing curriculum TS; auditing S02+

### Live vs source note

- Live SPA shell loads; full theory hydrate is partially captured in `visible_paragraphs/s01_setup.json`.
- Minor drift observed: live opener uses “Diccionario del día 1”; source uses “Diccionario de la sección”; live P4 omits the trailing `CASO-LIM-001` clause present in source. **Authoritative analysis below uses the workspace source file** unless noted as live-only.

### Pre-round research (pedagogy anchors)

- **Cognitive Load Theory (Sweller):** reduce *extraneous* load (mismatched labels, print-theater, grader meta in starters); keep *intrinsic* load of multi-tool setup chunked; protect *germane* load for schema building (venv = isolation; exit 0 = contract).
- **Gradual Release (I Do / We Do / You Do):** worked examples first, then guided blanks, then transfer — S01 structure matches; **demo fidelity** does not (see issues).
- **Progressive disclosure / onboarding:** day-1 setup benefits from real copy-paste commands and OS branches, not conceptual `print` proxies.
- **External gold peers:** CS50P Week 0 (real install/REPL), Python.org venv docs, Git Book ES, Conventional Commits, Ruff docs, pip User Guide.

---

## 2. Executive Summary of Quality

### Score: **6.8 / 10**

### Verdict

**Strong pedagogical prose and excellent structural completeness; critically weakened by print-theater demos, language/code mismatches, and grader-meta scaffolding in learner-facing starters.**

S01 is the **zero-baseline onboarding** section. Its Spanish-Peruvian narrative (job framing for banks/fintech, dictionary-first progressive disclosure, security hygiene, Conventional Commits, Ruff minimum, CP-N1-A skeleton) is among the best *written* openings in the curriculum and largely meets the gold structural bar (outcomes, 8 subtopics, 24 exercises, You Do rubric, self-check, resources).

However, for a section whose *job* is “open the terminal and do this,” the theory and I Do code blocks largely show **Python functions that print conceptual labels**, tagged as `language: 'bash'` (or even `toml`), with **outputs that do not match** the printed code. That is textbook **print theater** against the project’s own gold checklist and against best-in-class setup lessons (CS50P, official venv/pip docs). We Do exercises are stronger (real blanks, shell/Python/markdown scaffolds), but several E1 starters are already “solved,” and nearly every starter carries developer `# DEFECT` / `# Contrato … solutionCode` meta.

**Prior automated ranks (~9.5) and empty `S01_AUDIT.json` issues overstate quality** because they do not penalize demo theater or language mismatch. This Explorer pass is intentionally stricter on learner-visible executable fidelity.

### Strengths (keep)

1. Clear day-1 motivation + Peru stack realism (venv default, uv mentioned as non-standard).
2. Excellent conceptual teaching: REPL vs script, PATH vs cwd, `python -m pip`, freeze limits honesty, no force-push to main.
3. Full GRR lattice: T1–T4 × A/B + E1/E2/E3 + topic TE + You Do skeleton.
4. Security/responsible-use woven early (`.env`, synthetic data, `responsible_use` rubric).
5. Self-check explanations are accurate and instructional.

### Primary risks if shipped unchanged

- Novice copies I Do “bash” blocks into the terminal → syntax errors → loses trust on day 1.
- Learner cannot reproduce claimed outputs from shown code.
- Cognitive load spikes from meta comments (`DEFECT`, `solutionCode`) that are not part of the learning goal.

---

## 3. Detailed Issue Registry

Severity scale: **P0** (blocks learning / wrong contract) · **P1** (serious pedagogy/redaction) · **P2** (polish/consistency) · **P3** (nice-to-have).

---

### ISSUE-01 — Print theater in theory “bash/toml” demos  
**Severity:** P0  
**Dimension:** Cognitive load / gold anti-theater / I Do fidelity  
**Location:** `theory` blocks after “El intérprete en la terminal”, “cwd, PATH…”, “Entornos virtuales”, “pip, freeze…”, “Git…”, “Ramas…”, “VS Code y Ruff…”, “Archivos de calidad…”  

**Evidence (quote):**

```python
# language: 'bash', title: 'Verificar intérprete y entrar al REPL'
def s01_th_2():
    # REPL vs script: el intérprete responde a --version y a un one-liner
    import sys
    print("version", sys.version.split()[0])
    print("mode", "repl_then_script")
    print("check", sys.version_info >= (3, 10))

s01_th_2()
```

**Claimed output:** `Python 3.12.3  (ejemplo; …)` — **does not match** actual prints (`version 3.x.y`, `mode …`, `check True/False`).

Similarly `s01_th_4` … `s01_th_10`, and Ruff block labeled `toml` but containing Python `def s01_th_9()`.

**Pedagogical impact:** Extraneous load + broken worked-example effect. Learners need *literal* `python --version`, `source .venv/bin/activate`, `git commit -m "…"`. Conceptual proxies teach “reading about setup,” not setup.

---

### ISSUE-02 — Print theater in I Do demos (all 10 steps)  
**Severity:** P0  
**Dimension:** Pedagogical structure (I Do fidelity)  
**Location:** `iDo.steps[*].code`  

**Evidence:**

```python
# language: 'bash', title: 'Terminal — python -m venv .venv'
def s01_ido_4():
    print("venv_dir", ".venv")
    print("activate", "source .venv/bin/activate")

s01_ido_4()
```

Intro claims: *“Acompáñame con tu laptop abierta y repite cada paso.”* Shown code cannot be repeated as terminal steps.

**Pedagogical impact:** Collapses I Do into narrative-only. We Do then becomes the first real practice without a faithful model — inverted GRR.

---

### ISSUE-03 — Code ↔ output contract broken (multiple blocks)  
**Severity:** P0  
**Dimension:** Exercise/demo quality; technical honesty  
**Locations (non-exhaustive):**

| Block | Code produces | Declared `output` |
|--------|----------------|-------------------|
| s01_th_2 | `version …`, `mode …`, `check …` | `Python 3.12.3 (ejemplo…)` |
| s01_th_4 | `mkdir_ok exit 0 ok` etc. | `.../demo_ruta` / `0` / `1` / `127` |
| s01_th_5 | `executable …`, `prefer python -m pip` | paths under `.venv/bin/python3` |
| s01_th_6 | `.venv -> …`, `.env -> …` | `2.32.3` / `stdlib ok` |
| s01_ido_1 | `interpreter 3.x.y` | multi-line REPL session with `4`, `type`, pip path |
| s01_ido_2 | `exit 0 success True` | `ok` / `exit_ok=0` / paths |

**Pedagogical impact:** Undermines “reproducible environment” ethos on the very section that defines it.

---

### ISSUE-04 — Learner-facing grader/meta scaffolding in starters  
**Severity:** P1 (systemic; ~24 exercises)  
**Dimension:** Meta-text / redaction  
**Evidence (pattern in almost every `starterCode`):**

```text
# CASO-LIM-001 · …
# DEFECT: blanks ____ en transcript REPL incompleto
# Contrato: corrige el DEFECT; salida/checklist alineada a solutionCode
```

Also:

```text
# Fixture del paquete (conserva datos; no reescribas asserts)
# DEFECT: completa solo print/resultado del contrato (instruction + solution output)
```

**Note:** `MASTER_DEFECT_LOG.md` marks pedagogical DEFECT scaffolds as intentional product design. This Explorer still flags **wording and placement** as learner-hostile: “solutionCode”, “Fixture del paquete”, “asserts” are author/grader voice, not teacher-to-student Spanish-PE.

**Pedagogical impact:** Raises extraneous load; signals “this is a test harness,” not a lab notebook.

---

### ISSUE-05 — Guided E1 with no defect (already complete)  
**Severity:** P1  
**Dimension:** We Do / scaffolding  
**Locations:**

- `S01-T4-A-E1` (`pyproject.toml`) — starter already has full valid Ruff config; leftover comment “completa solo print/resultado” is nonsensical for TOML.
- `S01-T4-B-E1` (`.gitignore`) — starter already complete; same leftover DEFECT print comment.

**Pedagogical impact:** E1 should force productive struggle with blanks. Currently E1 ≈ “read the solution already pasted.”

---

### ISSUE-06 — Python version inconsistency (3.12+ vs 3.9.6)  
**Severity:** P1  
**Dimension:** Consistency / progressive disclosure  
**Evidence:**

- Theory/outcomes: “Python 3.12 o superior” / “3.12+”
- `hello_sys.py` solution output: `Python 3.9.6`
- REPL solution comment: `'3.9.6'`
- Ruff `target-version = "py312"` vs theory th_9 dict using `"py310"`

**Pedagogical impact:** Novices cannot tell if their 3.11/3.12 is “wrong” or if 3.9 is still OK. Undermines the verification habit the section teaches.

---

### ISSUE-07 — Self-check correct option under-teaches `python -m pip`  
**Severity:** P2  
**Dimension:** Alignment outcomes ↔ exam  
**Evidence:** Q4 correct option is `pip install -r requirements.txt` while explanation correctly prefers `python -m pip install -r …`. Theory spends significant space on the `python -m` binding rule.

**Pedagogical impact:** Assessment weakly contradicts the main operational contract.

---

### ISSUE-08 — Resource quality / possible dead link  
**Severity:** P2  
**Dimension:** External materials  
**Evidence:**

- `GitHub Learning Lab` → `https://lab.github.com/` (service long discontinued / redirected; poor day-1 resource).
- Books listed without URLs or ISBNs (`Python 101`, `Python Apprentice to Master`) — hard to act on.
- Missing explicit venv doc URL in `resources.docs` despite heavy venv teaching (venv is only in research dossier, not section resources array).

---

### ISSUE-09 — Soft meta voice in danger callout  
**Severity:** P2  
**Dimension:** Meta-leak / redaction  
**Evidence (Ramas callout):**

> “Del material original del curso: (1) subir `.venv/`…”

**Pedagogical impact:** Mild author-studio voice (“material original”) leaks into learner UI.

---

### ISSUE-10 — Estimated 19h for pure setup  
**Severity:** P2  
**Dimension:** Cognitive load / motivation  
**Evidence:** `estimatedHours: 19` for install + venv + git + ruff skeleton.

**Pedagogical impact:** Progressive onboarding research warns against front-loading too much before first value. 19h may be honest for full You Do quality, but without a time-box map (e.g. 3h core / 16h portfolio polish) it intimidates absolute beginners.

---

### ISSUE-11 — Thin theory block “El intérprete en la terminal”  
**Severity:** P2  
**Dimension:** Connective tissue / progressive disclosure  
**Evidence:** Single short paragraph + theatrical code; heading promises “comandos de verificación” but does not list them in prose.

**Pedagogical impact:** Breaks Anchor→Mechanism→Example chain; duplicates T1-A subtopicId without adding operational content.

---

### ISSUE-12 — Type hints introduced before language basics  
**Severity:** P2  
**Dimension:** Progressive disclosure / cognitive load  
**Evidence:** Theory paragraph on `-> None` / annotations in S01 before S02 types.

**Mitigation already present:** labeled “opcionales (pistas)” — good. Still early for zero-prior learners copying starters.

**Pedagogical impact:** Mild intrinsic overload; acceptable if demos stay free of mandatory hints (they currently use `-> None`).

---

### ISSUE-13 — Forward density: CP-N1-A / CASO-LIM-001  
**Severity:** P2  
**Dimension:** Connective tissue / roadmap  
**Evidence:** You Do and theory/README blocks reference CP-N1-A and data dictionary before learner has intake concepts (S02–S04).

**Pedagogical impact:** Acceptable as “skeleton foreshadowing” if always paired with “no validador aún” (You Do does this well). Theory `.gitignore` block dumps CP-N1-A structure mid-S01 — slightly heavy but purposeful.

---

### ISSUE-14 — iDo step without `output` / weaker why-code binding  
**Severity:** P3  
**Dimension:** Consistency  
**Evidence:** “Verificar instalación de Python…” and “Crear repo remoto…” steps lack `output` field unlike others.

---

### ISSUE-15 — Language tag errors beyond bash  
**Severity:** P1 (subset of ISSUE-01)  
**Evidence:**

- Ruff theory: `language: 'toml'` + Python function body.
- `.env.example` exercise: `language: 'bash'` for dotenv content (should be `dotenv`/`ini`/`plaintext`).

---

### ISSUE-16 — Redaction / Spanish-PE micro-notes  
**Severity:** P3  
**Dimension:** Grammar / tone  
**Notes:** Overall excellent PE Spanish technical voice. Minor:

- Anglicisms *pinneado*, *freeze*, *smoke* are industry-acceptable if first defined (mostly are).
- Em-dash and curly quotes consistent enough.
- No major orthography defects found in core paragraphs.

---

### ISSUE-17 — Live/source copy drift on dictionary heading  
**Severity:** P3  
**Dimension:** Deploy consistency  
**Evidence:** Live “Diccionario del día 1” vs source “Diccionario de la sección”; live omits trailing CASO clause on gold rule paragraph.

**Pedagogical impact:** Low if intentional A/B; otherwise signals stale GitHub Pages build relative to workspace.

---

## 4. Meta-Leak Report

### 4.1 Learner-visible (rendered in starter/solution UI)

| # | Exact leaked / meta text | Location | Severity |
|---|--------------------------|----------|----------|
| M1 | `# DEFECT: <description>` (× ~24) | All weDo `starterCode` | P1 systemic |
| M2 | `# Contrato: corrige el DEFECT; salida/checklist alineada a solutionCode` | Same | P1 |
| M3 | `# Fixture del paquete (conserva datos; no reescribas asserts)` | S01-T4-A-E1, S01-T4-B-E1 | P1 |
| M4 | `# DEFECT: completa solo print/resultado del contrato (instruction + solution output)` | S01-T4-A-E1, S01-T4-B-E1 (and similar) | P1 — especially harmful when no blank exists |
| M5 | `Del material original del curso:` | Theory callout danger “Errores típicos…” | P2 |
| M6 | Function names `s01_th_*`, `s01_ido_*` | Theory + iDo code | P2 (author scaffolding names, not natural lab code) |

**Not counted as leaks (intentional curriculum IDs):** `CASO-LIM-001`, `CP-N1-A`, `S01-T*-E*`, `demoId` values.

### 4.2 Source-only comments (not learner-facing if TS comments stripped)

```ts
// keep bash REPL demo as second visual via callout-adjacent; original bash block renamed below
// Evaluaciones formativas por tema (V3); render opcional en You Do tab
// Runtime prints today's date; ellipsis marks nondeterministic day.
```

These are fine as long as they never ship into the SPA. No fix required for M-source.

### 4.3 Meta-leak count (learner-facing classes)

- **Systemic pattern instances:** ~50+ DEFECT/Contrato lines (count as **1 systemic family** + 24 exercise instances for Fixer scoping)
- **Distinct meta-leak families:** **6** (M1–M6)
- **Hard meta-leak family count for sidecar:** **6**

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 Meta-text / developer leakage

Primary problem is **not** accidental AI chat paste (“moved from section X”); it is **industrialized grader harness language** inside every starter. Intentional per platform ops, still **pedagogically noisy** for day-1 humans. Prefer learner Spanish:

- `# TAREA: completa los ____`
- `# Éxito: cumple el checklist de la instrucción`

Avoid `solutionCode`, `asserts`, `Fixture del paquete`.

### 5.2 Grammatical correctness & redaction (Peruvian Spanish)

- High clarity, professional second-person, workplace framing (Interbank, BBVA, Caja Arequipa) without salary promises — good ethics.
- Technical terms kept in English where industry-standard (PATH, PR, freeze, Ruff) with Spanish glosses — aligned to gold bilingual bar.
- No significant grammar defects; redaction quality of **prose** ~9/10.

### 5.3 Connective tissue & narrative flow

**Strong:**

- Opens with dictionary → why setup → Peru stack → golden rule.
- Thread: interpreter → exit codes → stack components → venv → pip → git → branches → Ruff → ignore/secrets/README → You Do skeleton.
- Bridges to S02–S04 via CP-N1-A without claiming S04 skills.

**Weak:**

- “El intérprete en la terminal” and “cwd, PATH… en la shell” are thin split-offs of T1-A/T1-B that re-open the same subtopicId with theater code — feel like residual refactor seams.
- Stack install order is described well in prose but never demonstrated with real commands after promising “vamos a instalar 4 cosas, en este orden.”

### 5.4 Pedagogical structure (I Do / We Do / You Do)

| Phase | Structural fidelity | Content fidelity |
|--------|--------------------|------------------|
| **I Do** | 10 steps, reasons (`why`), demoIds | **Fail** — print theater, not repeatable demos |
| **We Do** | 24 = 8×(E1/E2/E3), hints, edgeCases, tests, feedback | **Pass** with exceptions (empty E1s, meta headers) |
| **You Do** | Clear skeleton, weighted rubric, portfolio note | **Pass** — best-aligned deliverable of the section |
| **Self-check** | 5 MCQ, solid explanations | **Pass-** (Q4 option wording) |

Gradual release is **architecturally** correct and **executionally** broken at the I Do layer.

### 5.5 Cognitive load & progressive disclosure

**Intrinsic load** of S01 is legitimately high (OS differences × Python × venv × pip × Git × GitHub × Ruff × secrets). Good mitigations already present:

- Dictionary-first
- Subtopic chunking T1–T4
- Callouts tip/warning/danger
- OS notes Windows vs Unix

**Extraneous load injectors:**

1. Language label lying about content type  
2. Output lying about runtime  
3. Meta DEFECT headers  
4. Complete-but-labeled-incomplete E1s  
5. Version number scatter  

**Germane load** (schemas worth building) is excellent when prose is trusted: isolation, exit codes as contracts, `python -m pip`, non-destructive Git recovery.

### 5.6 Exercise & exam quality / alignment

**We Do highlights:**

- Transfer tasks (diagnose PATH vs wrong interpreter; argue against global pip; PR markdown; restore vs force-push) are authentic and interview-grade.
- Edge cases often name real Windows execution policy and Store alias issues.
- Tests/checklists are observable.

**We Do problems:**

- Theater-free bash solutions exist in weDo (good) while iDo/theory do not (inconsistent models).
- S01-T4-A-E1 / T4-B-E1 lack blanks.
- Starter headers reference solution alignment meta.

**Self-check:** fair difficulty; distractors plausible; one alignment nit (ISSUE-07).

**Topic evaluations:** good formative design; depend on learners having done real shell work (undermined if they only copied theater).

### 5.7 Consistency with roadmap & previous sections

- No previous section (S01 is zero baseline) — correctly states `zero_prior_baseline: True` in map contract.
- Forward link to CP-N1-A matches V3 roadmap intent.
- Filename legacy (`s01-setup`) vs title OK per SECTION_MAP.

### 5.8 Comparison with external best-in-class

| Peer | What they do better | What S01 does better |
|------|---------------------|----------------------|
| **CS50P Week 0** | Real install screenshots/commands, REPL first minutes | Workplace Peru framing, security/.env, Conventional Commits |
| **Python.org venv docs** | Canonical commands only | Narrative motivation + conflict scenarios |
| **Git Book / GitHub Quickstart** | Literal CLI sequences | “Why not force-push” culture + restore/stash first |
| **Ruff docs** | Real TOML samples | “Don’t select ALL day 1” governance lesson |
| **Google IT Automation (setup modules)** | OS-split labs | Integrated portfolio skeleton CP-N1-A |

**Net:** S01 *explains* at senior-course level but *shows* commands at template-proxy level. External courses win on day-1 operability; S01 wins on professional culture + ethics.

### 5.9 Accessibility / other domain notes

- OS dual-path (Windows PowerShell vs Unix) is present but buried; a single callout table “Windows | macOS/Linux” for activate/PATH would help screen-reader and skimmers.
- Color/icon not audited (out of content TS).
- Synthetic PII policy clear and repeated — excellent.

---

## 6. Proposed GitHub-style Diffs

> Diffs are **proposals only** — do not apply in Explorer. Paths relative to repo root. Snippets illustrative; Fixer should expand to all listed blocks.

---

### Diff A — Restore real bash for theory “Verificar intérprete” (ISSUE-01/03)

```diff
--- a/src/lib/course/sections/s01-setup.ts
+++ b/src/lib/course/sections/s01-setup.ts
@@
       code: {
         language: 'bash',
         title: 'Verificar intérprete y entrar al REPL',
-        code: `def s01_th_2():
-    # REPL vs script: el intérprete responde a --version y a un one-liner
-    import sys
-    print("version", sys.version.split()[0])
-    print("mode", "repl_then_script")
-    print("check", sys.version_info >= (3, 10))
-
-s01_th_2()
-`,
-        output: 'Python 3.12.3  (ejemplo; tu versión puede variar si es 3.12+)',
+        code: `# Verifica el intérprete (usa python3 si python no responde)
+python3 --version
+# Python 3.12.3
+
+# Entra al REPL, prueba y sal
+python3
+# >>> 2 + 2
+# 4
+# >>> quit()
+
+# Ata pip al mismo intérprete
+python3 -m pip --version
+`,
+        output: `Python 3.12.3
+pip 24.0 from ... (python 3.12)`,
       },
```

---

### Diff B — Real iDo venv demo (ISSUE-02)

```diff
--- a/src/lib/course/sections/s01-setup.ts
+++ b/src/lib/course/sections/s01-setup.ts
@@
         code: {
           language: 'bash',
           title: 'Terminal — python -m venv .venv',
-          code: `def s01_ido_4():
-    print("venv_dir", ".venv")
-    print("activate", "source .venv/bin/activate")
-
-s01_ido_4()
-`,
-          output: `.../python-ds-journey/.venv/bin/python3
-.../python-ds-journey/.venv`,
+          code: `python3 -m venv .venv
+# macOS/Linux:
+source .venv/bin/activate
+# Windows PowerShell:
+# .venv\\Scripts\\Activate.ps1
+
+python -c "import sys; print(sys.prefix)"
+which python || where python
+`,
+          output: `.../python-ds-journey/.venv
+.../python-ds-journey/.venv/bin/python`,
         },
```

**Apply same pattern to all `s01_ido_1`…`s01_ido_10` and `s01_th_4`…`s01_th_10`.**

---

### Diff C — Real TOML for Ruff theory (ISSUE-15)

```diff
--- a/src/lib/course/sections/s01-setup.ts
+++ b/src/lib/course/sections/s01-setup.ts
@@
       code: {
         language: 'toml',
         title: 'pyproject.toml — Ruff mínimo',
-        code: `def s01_th_9():
-    # Ruff config mínima como dict (espejo de pyproject)
-    ruff = {"line-length": 88, "target-version": "py310", "select": ["E", "F", "I"]}
-    print("ruff", ruff)
-    print("day1_select_all", False)
-
-s01_th_9()
-`,
+        code: `[tool.ruff]
+line-length = 88
+target-version = "py312"
+
+[tool.ruff.lint]
+select = ["E", "F", "I"]
+`,
         output: 'All checks passed!  (tras corregir violaciones)',
       },
```

---

### Diff D — Learner-facing starter headers (ISSUE-04)

```diff
--- a/src/lib/course/sections/s01-setup.ts
+++ b/src/lib/course/sections/s01-setup.ts
@@
-# CASO-LIM-001 · REPL transcript suma/type/sys
-# DEFECT: blanks ____ en transcript REPL incompleto
-# Contrato: corrige el DEFECT; salida/checklist alineada a solutionCode
-# Completa las líneas marcadas con ____
+# CASO-LIM-001 · laboratorio REPL
+# TAREA: completa los ____ y reproduce la sesión en tu terminal real
+# Éxito: cumple el checklist de la instrucción (suma, type, sys.version, quit)
```

**Replace globally** (careful per-exercise task line):

- `# DEFECT:` → `# TAREA:` / keep short human description  
- Remove `# Contrato: … solutionCode`  
- Remove `# Fixture del paquete…`  
- Remove `# DEFECT: completa solo print/resultado…`

---

### Diff E — Put blanks back into T4 E1s (ISSUE-05)

```diff
--- a/src/lib/course/sections/s01-setup.ts
+++ b/src/lib/course/sections/s01-setup.ts
@@ S01-T4-A-E1 starter
 [tool.ruff]
-line-length = 88
-target-version = "py312"
+line-length = ____
+target-version = "____"

 [tool.ruff.lint]
-select = ["E", "F", "I"]
-# DEFECT: completa solo print/resultado del contrato (instruction + solution output)
+select = [____, ____, ____]
```

```diff
@@ S01-T4-B-E1 starter
 # Entornos
-.venv/
-venv/
+____/
+____/

 # Bytecode
-__pycache__/
-*.pyc
+____/
+____

 # Secretos
-.env
+____

 # Jupyter
-.ipynb_checkpoints/
-# DEFECT: completa solo print/resultado del contrato (instruction + solution output)
+.ipynb_checkpoints/
```

---

### Diff F — Version alignment (ISSUE-06)

```diff
--- a/src/lib/course/sections/s01-setup.ts
+++ b/src/lib/course/sections/s01-setup.ts
@@ hello_sys solution output
-Python 3.9.6
+Python 3.12.3
@@ REPL solution comment
-# '3.9.6'   # o la versión de tu máquina
+# '3.12.3'   # o la 3.12+ de tu máquina; 3.10+ aceptable si documentas
```

Also unify any `py310` examples to `py312` when teaching course default.

---

### Diff G — Self-check Q4 (ISSUE-07)

```diff
--- a/src/lib/course/sections/s01-setup.ts
+++ b/src/lib/course/sections/s01-setup.ts
@@
-        options: ['pip install pandas numpy', 'pip install -r requirements.txt', 'python -m venv venv', 'git clone https://github.com/usuario/repo.git'],
+        options: [
+          'pip install pandas numpy',
+          'python -m pip install -r requirements.txt',
+          'python -m venv venv',
+          'git clone https://github.com/usuario/repo.git',
+        ],
         correctIndex: 1,
```

---

### Diff H — Resources (ISSUE-08)

```diff
--- a/src/lib/course/sections/s01-setup.ts
+++ b/src/lib/course/sections/s01-setup.ts
@@ resources.docs
+      { label: 'Python — venv', url: 'https://docs.python.org/3/library/venv.html', note: 'Entornos virtuales oficiales' },
@@ resources.courses
-      { label: 'GitHub Learning Lab', url: 'https://lab.github.com/', note: 'Cursos interactivos gratuitos de Git/GitHub' },
+      { label: 'GitHub Skills', url: 'https://skills.github.com/', note: 'Labs interactivos oficiales de Git/GitHub (sucesor de Learning Lab)' },
```

---

### Diff I — Soft meta in danger callout (ISSUE-09)

```diff
-          'Del material original del curso: (1) subir `.venv/`/`venv/` a GitHub, (2) subir `.env` con secretos, (3) commits "cambios"/"wip", (4) trabajar solo en `main`. …
+          'Errores típicos a evitar: (1) subir `.venv/`/`venv/` a GitHub, (2) subir `.env` con secretos, (3) commits "cambios"/"wip", (4) trabajar solo en `main`. …
```

---

### Diff J — Time-box honesty (ISSUE-10) — optional metadata/prose

```diff
-  estimatedHours: 19,
+  estimatedHours: 19, // keep number but clarify in tagline or first callout
```

Add callout content proposal:

> **Ritmo sugerido:** 3–4 h núcleo (Python + venv + pip + git local), 6–8 h GitHub/PR/Ruff/ignore, resto para pulir el esqueleto CP-N1-A y checklist de máquina limpia.

---

## 7. Recommended Priority Order for Fixing

| Order | Issue IDs | Why first |
|------:|-----------|-----------|
| 1 | ISSUE-02 + ISSUE-03 (all iDo) | Day-1 “repeat after me” is the section’s contract |
| 2 | ISSUE-01 + ISSUE-15 (theory bash/toml demos) | Model code must match language + output |
| 3 | ISSUE-05 (T4 E1 blanks) | Quick win; restores guided struggle |
| 4 | ISSUE-04 (starter meta headers) | Systemic redaction; do with scripted careful replace |
| 5 | ISSUE-06 (versions 3.12 vs 3.9.6) | Consistency of the verification habit |
| 6 | ISSUE-07 (self-check pip) | Assessment alignment |
| 7 | ISSUE-08 (resources) | Dead Learning Lab + missing venv doc |
| 8 | ISSUE-09 (danger callout meta) | One-line redaction |
| 9 | ISSUE-11 (thin verification block) | Merge or flesh out with real commands |
| 10 | ISSUE-10 / 12 / 13 / 14 / 16 / 17 | Polish, load, deploy drift |

**Fixer success criteria (suggested):**

1. Every `language: 'bash'` block is valid shell a novice can paste.  
2. Every declared `output` is plausibly produced by that block (or clearly marked as “ejemplo de sesión” with matching transcript).  
3. Zero occurrences of `solutionCode` / `Fixture del paquete` / `completa solo print` in learner strings.  
4. E1 starters have ≥1 blank or intentional wrong line.  
5. Single story for Python version: **3.12+ preferred, 3.10+ accepted**, examples show 3.12.x.

---

## 8. Graph Memory Update notes

For shared context (`GRAPH_MEMORY.json` / summary — **notes only**, Explorer does not mutate product curriculum):

```yaml
section: S01
id: setup
file: s01-setup.ts
explorer_score: 6.8
prior_auto_rank_note: "S01_DONE/PA ~9.55 overstates executable fidelity; empty S01_AUDIT issues"
nodes:
  - id: S01.theory.dictionary
    quality: high
    edges: [S01.T1, S01.T2, progressive_disclosure]
  - id: S01.theory.bash_blocks
    quality: low
    defect: print_theater
    edges: [ISSUE-01, ISSUE-03, gold_anti_theater]
  - id: S01.iDo
    quality: low
    defect: print_theater_all_steps
    edges: [ISSUE-02, grr_broken_model]
  - id: S01.weDo
    quality: high_with_meta_noise
    edges: [24_exercises, ISSUE-04, ISSUE-05]
  - id: S01.youDo.CP-N1-A_skeleton
    quality: high
    edges: [S04.CP-N1-A, portfolio]
  - id: S01.security.env
    quality: high
    edges: [responsible_use, gitignore]
edges_to_next:
  - S01.youDo -> S02.parser_intake (skeleton only)
risks:
  - "Zero-baseline learners blocked if they trust iDo code as shell"
  - "Theater pattern may have been bulk-applied; check later sections only if same s0x_th_* proxy appears"
fixer_ready: true
meta_leak_families: 6
issue_count: 17
```

**Do not** mark residual theater as 0 after this report until Fixer restores real shell/TOML demos.

---

## Issue count summary

| Severity | Count |
|----------|------:|
| P0 | 3 (ISSUE-01, 02, 03) |
| P1 | 4 (ISSUE-04, 05, 06, 15) |
| P2 | 7 (ISSUE-07–13) |
| P3 | 3 (ISSUE-14, 16, 17) |
| **Total issues** | **17** |
| Meta-leak families | **6** |

---

This is the complete Explorer report for Section 1. Ready for the Fixer prompt.
