# S02 Explorer Report — Section 2: Valores, tipos, operadores e I/O

**Auditor role:** Curriculum Auditor · Pedagogical Analyst · Technical Editor  
**Method:** Stanford STORM multi-pass + Graph Engineering + Loop Engineering  
**Date:** 2026-07-24  
**Scope lock:** Section 2 only (`id: basics`)  
**Live URL:** https://pillb.github.io/pyarcana/#basics  
**Source of truth:** `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s02-basics.ts`  
**Note on live render:** The GitHub Pages app is a client-side SPA; hash-routed section body is not fully server-rendered to static HTML. Full content audit was performed against the authoritative TS section module (what the live app loads), cross-checked against the public homepage curriculum card for S02 and against gold-standard peers (`s01-setup.ts`, GOLD_STANDARD_CHECKLIST.md).

---

## 1. Section Identification & Scope

| Field | Value |
|--------|--------|
| Index | 2 |
| Platform id (hash) | `basics` |
| Title | Valores, tipos, operadores e I/O |
| shortTitle (UI) | Basics de Python |
| tagline | Literales, nombres, operadores, Decimal e I/O para el parser de intake |
| estimatedHours | 18 |
| level | Principiante |
| phase | 0 |
| Case id | `CASO-LIM-002` |
| Capstone thread | Incremento de **CP-N1-A** (parser de intake) |
| Subtopics | 8: S02-T1-A/B, T2-A/B, T3-A/B, T4-A/B |
| Structure inventory | theory map + 8 theory blocks · 8 I Do demos · 24 We Do (E1/E2/E3) · You Do · selfCheck (5 MCQ) · resources |

**In-scope topics (declared):** literales y tipos (`int/float/str/bool/None`), `type`/`isinstance`, conversión segura, nombres PEP 8, identidad vs igualdad, mutabilidad/copias, operadores y precedencia, `Decimal` + `quantize` para soles, `input`/`print`/f-strings, parser mínimo raw/clean/errors.

**Declared out-of-scope (V3 path):** condicionales profundos, `for`/`while` como núcleo, `*args/**kwargs`, list comprehensions; material legado “calculadora de propinas / budget calculator”.

**Analyzed artifacts only:** `s02-basics.ts` (+ comparative glances at `s01-setup.ts` and course homepage for consistency). No product files edited.

---

## 2. Executive Summary of Quality

### Score: **7.2 / 10**

### Verdict

S02 is a **strong conceptual and professional core** for early Python-for-data: the intake-parser throughline (`CASO-LIM-002` → CP-N1-A), the raw/clean/errors contract, Decimal-for-soles, and the 8×(theory + I Do + E1/E2/E3) skeleton are gold-standard *architecture*. Technical accuracy of core demos (42 vs `"42"`, `is None`, `-3**2`, float vs `Decimal("0.1")`) is high and aligned with CS50P / py4e / official docs on types and I/O.

It is **not yet gold-redaction quality**. Student-facing text still carries **curriculum-version meta (“En V3”)**, **legacy-migration notes**, and a **system-wide `DEFECT` / “Fixture del paquete” scaffold language** that reads as harness generator output, not teacher voice. Several E1s devolve into **print-theater** (“completa solo print/resultado”). The **You Do starter is essentially the full solution**, with a **weak assert** that can pass without a clean happy path. **Self-check covers only ~T1–T2** (5 items); T3 Decimal, T3 operators, T4 I/O/parse are unassessed. Scope claims (“no condicionales/loops como path”) **contradict** demos and exercises that freely use `if`, `for`, `def`, `try/except`, and even a dict comprehension—raising cognitive load for post-S01 beginners without an honest “syntax preview” frame.

**Bottom line for Fixer:** Keep the intake narrative and Decimal/raw-clean pedagogy; **purge meta-leaks and DEFECT scaffolding**, **reopen You Do as a real challenge**, **rebalance progressive disclosure / scope honesty**, and **expand assessment** to match the eight learning outcomes.

---

## 3. Detailed Issue Registry

Severity legend: **P0** blocker / learner-facing leak or false assessment · **P1** high pedagogical damage · **P2** medium clarity/consistency · **P3** polish.

### Issue 01 — Curriculum version meta “En V3” (learner-facing)
- **Severity:** P0 (meta-leak)
- **Location:** theory[0] paragraph 2; callout title “Fuera de alcance S02 V3…”
- **Evidence:**
  > `En V3, **S02 no cubre condicionales, loops...**`
  > title: `Fuera de alcance S02 V3 (no es el path del estudiante)`
- **Pedagogical impact:** Students do not care about curriculum version labels. “V3” and “path del estudiante” are authoring jargon that break immersion and signal unfinished redaction.
- **Graph edges:** meta-leak → trust → early-section narrative quality (critical vs S01 tone)

### Issue 02 — Legacy migration callout exposed to students
- **Severity:** P0 (meta-leak)
- **Location:** theory[0] callout content; youDo.context
- **Evidence:**
  > `Si ves material legado con “calculadora de propinas” o budget calculator, está **reemplazado**...`
  > You Do: `en lugar de una calculadora de presupuesto, construyes el **esqueleto de un parser de intake**`
- **Pedagogical impact:** References non-existent concurrent material and English “budget calculator.” Confuses first-time learners; belongs in CHANGELOG/git history, not lesson prose.

### Issue 03 — Systemic `DEFECT` / package-fixture scaffold in all We Do starters
- **Severity:** P0 (meta-leak + redaction)
- **Location:** every `weDo.steps[*].starterCode` (≈24 files)
- **Evidence (pattern):**
  ```text
  # DEFECT: corrige: ...
  # Contrato: corrige el DEFECT; salida alineada a solutionCode
  # Fixture del paquete (conserva datos; no reescribas asserts
  # DEFECT: completa solo print/resultado del contrato (instruction + solution output)
  ```
- **Pedagogical impact:** Violates gold-standard anti-theater #4–#5 and teacher voice. Truncated lines (`InvalidOperati`, `typ`, unclosed parens in comments) look broken. Learners interpret “DEFECT” as broken curriculum, not a learning task.
- **Count:** dozens of occurrences (systemic)

### Issue 04 — Print-theater / near-complete E1s
- **Severity:** P1
- **Location:** T1-B-E1, T3-A-E1, T3-B-E1, T4-A-E1 (and similar “solo print” scaffolds)
- **Evidence (T1-B-E1 starter):** almost full solution with comments telling student to only complete print; computation already done:
  ```python
  raw = " 21 "
  edad = int(raw.strip())
  # DEFECT: completa solo print/resultado del contrato ...
  ```
- **Pedagogical impact:** Guided practice should still require a *decision*. These E1s fail gradual release: I Do already showed the idea; E1 should re-enact with a blank, not re-print theater.

### Issue 05 — You Do starter is the complete reference solution
- **Severity:** P0/P1 (assessment integrity)
- **Location:** `youDo.starterCode` (~lines 1956–2081)
- **Evidence:** Full `safe_int`, `parse_client` with all fields, `mostrar_resumen`, `_run_tests`, `main` — ready to run as-is. Student can submit without designing.
- **Pedagogical impact:** Destroys You Do (transfer) fidelity. Portfolio becomes copy-paste of course solution, not evidence of skill. Conflicts with gold bar “Independent challenge”.

### Issue 06 — Weak / tautological assert in You Do happy path
- **Severity:** P1
- **Location:** `_run_tests` inside youDo.starterCode
- **Evidence:**
  ```python
  assert r["errors"] == [] or isinstance(r["errors"], list)
  ```
- **Pedagogical impact:** If `errors` is any list (including non-empty), second clause passes. Happy-path Unicode case does **not** require `errors == []`. False confidence in “tests OK”.

### Issue 07 — Developer noise in student starter (`type: ignore`)
- **Severity:** P2 (meta-leak lite)
- **Location:** youDo.starterCode `errors.append(err)  # type: ignore[arg-type]`
- **Pedagogical impact:** mypy suppressions are authoring residue; beginners have no type-checker context yet.

### Issue 08 — Scope honesty failure: “no loops/conditionals” vs heavy use
- **Severity:** P1
- **Location:** theory map claim vs nearly all demos/exercises
- **Evidence:** Theory says conditionals/loops/comprehensions are not the student path; meanwhile I Do uses `for`, theory/I Do use `if`, exercises use `try/except`, T4-A solution uses dict comprehension `{k: type(v).__name__ for k, v in datos.items()}`.
- **Pedagogical impact:** Cognitive dissonance + unacknowledged prerequisites. S03/S04 are sold as the homes of decisions/iteration, but S02 already demands them. Better: “preview mínimo con `if`/`for` de lectura” or simplify early demos to linear scripts.

### Issue 09 — Progressive disclosure breach: Decimal before T3-B
- **Severity:** P1
- **Location:** T1-B-E3 transfer (`pipeline` with `safe_decimal`)
- **Evidence:** E3 of *inspection/conversion* requires `Decimal`, `InvalidOperation`, `quantize` before theory T3-B teaches money.
- **Pedagogical impact:** Violates gold rule “no untaught APIs.” Students either freeze or copy solution without understanding quantize/ROUND.

### Issue 10 — Self-check under-coverage of outcomes
- **Severity:** P1
- **Location:** `selfCheck.questions` (exactly 5)
- **Coverage map:**
  | Outcome cluster | Assessed? |
  |-----------------|-----------|
  | Literales / NoneType / 42 vs "42" / teléfono str | Yes |
  | Alias mutabilidad | Yes |
  | `is None` | Yes |
  | Operadores / precedencia `-3**2` | **No** |
  | Decimal / no float for soles | **No** |
  | input→str / f-strings | **No** |
  | raw/clean/errors parse | **No** |
- **Pedagogical impact:** Active recall gate (70% unlock) can pass without T3–T4 mastery. Misaligned with 8 LOs and 18h claim.

### Issue 11 — Missing topicEvaluations present in S01 gold peer
- **Severity:** P2
- **Location:** end of section (absent)
- **Evidence:** `s01-setup.ts` has `topicEvaluations` blocks per theme; S02 ends at `resources` with no formative topic tasks.
- **Pedagogical impact:** Inconsistent evaluation architecture across Phase 0; weaker formative checkpoints before You Do.

### Issue 12 — I Do T4-B demo signature incomplete vs You Do contract
- **Severity:** P2
- **Location:** `S02-T4-B-DEMO`
- **Evidence:** `parse_client(nombres, apellido_materno, edad=None)` — missing paterno, contacto, dirección required by LO #8 and You Do.
- **Pedagogical impact:** Demo under-models the target schema; transfer jump to full parse is larger than necessary (though T4-B-E3 does full schema).

### Issue 13 — Inconsistent `safe_int` contracts across section
- **Severity:** P2
- **Location:** T1-B-E2 vs T4-B-DEMO/You Do
- **Evidence:** T1-B-E2 treats empty/`"  "` as explicit vacío error; You Do/T4-B `safe_int` only catches `ValueError` (`int("")` → generic convert error, no empty branch).
- **Pedagogical impact:** Students learn two slightly different professional patterns without reconciliation note.

### Issue 14 — Misleading “versiones modernas” for `if x = 1`
- **Severity:** P3
- **Location:** theory T2-A
- **Evidence:** `En versiones modernas de Python, if x = 1: es SyntaxError`
- **Pedagogical impact:** Bare assignment in `if` was always SyntaxError; modern novelty is walrus `:=`. Slight historical inaccuracy.

### Issue 15 — Map heading residual English “Absolute Basics”
- **Severity:** P3
- **Location:** theory[0] heading
- **Evidence:** `De “Absolute Basics” a valores y tipos (mapa de la sección)`
- **Pedagogical impact:** English leftover title; Spanish-first brand prefers pure ES-PE headings.

### Issue 16 — Cognitive density of opening dictionary
- **Severity:** P2
- **Location:** theory[0] first paragraph (single mega-definition dump)
- **Evidence:** Literal, tipo, = vs ==, is vs ==, Decimal, I/O, raw/clean, PII all in one block before any demo.
- **Pedagogical impact:** High intrinsic load for day-2 Python. S01 dictionary is long but more sequential; S02 front-loads the whole section contract.

### Issue 17 — Lists introduced for mutability without collection section
- **Severity:** P2
- **Location:** T2-B theory + demos
- **Evidence:** Uses `list`, `append`, `copy()` while “Colecciones” is S06 in V3 map.
- **Pedagogical impact:** Acceptable if framed as minimal preview; currently not framed as temporary/minimal structure API.

### Issue 18 — estimatedHours 18 vs assessment thinness
- **Severity:** P3 (planning consistency)
- **Evidence:** 18h, 24 exercises, full parser — but 5 MCQ only, You Do pre-solved.
- **Pedagogical impact:** Time budget implies depth; assessment stack does not verify that depth.

### Issue 19 — Truncated / broken comments in starters
- **Severity:** P2
- **Examples:**
  - T1-A-E3: `# Completa valor y tipo esperado (int, float, str, bool, typ`
  - T3-B-E3: `InvalidOperati`
  - T4-A-E3: `def simular_intake(...) -` (cut off)
- **Pedagogical impact:** Looks like file corruption; erodes trust in early sections.

### Issue 20 — Theory map claims “ocho subtemas están completos” (meta-self-audit)
- **Severity:** P3
- **Evidence:** `Los **ocho subtemas** están completos: theory + I Do + E1/E2/E3 por cada uno.`
- **Pedagogical impact:** Author checklist language (“completos”) is not student value; soft meta.

### Issue 21 — Optional: no explicit bridge from S01 → S02 first action
- **Severity:** P3
- **Evidence:** jobRelevance jumps to banks/fintech; weak “open your venv from S01 and create `casos/lim_002/`” step.
- **Pedagogical impact:** Lost connective tissue opportunity; S01 built environment habits that S02 barely activates in prose (demos are pure Pyodide functions).

---

## 4. Meta-Leak Report

Exact learner-visible (or starter-visible) leaked authoring text:

| # | Exact / near-exact text | Location |
|---|-------------------------|----------|
| M1 | `En V3, **S02 no cubre condicionales, loops, funciones avanzadas ni comprehensions** como camino principal del estudiante.` | theory map ¶2 |
| M2 | Callout title: `Fuera de alcance S02 V3 (no es el path del estudiante)` | theory[0].callout |
| M3 | `Si ves material legado con “calculadora de propinas” o budget calculator, está **reemplazado** por el esqueleto del **parser de intake**. Puedes recordar esos ejemplos para más adelante; no los uses como entrega de esta sección.` | theory[0].callout.content |
| M4 | `en lugar de una calculadora de presupuesto, construyes el **esqueleto de un parser de intake**` | youDo.context |
| M5 | Pattern: `# DEFECT: corrige: ...` / `# Contrato: corrige el DEFECT; salida alineada a solutionCode` / `# Fixture del paquete (conserva datos; no reescribas asserts` | all weDo starters |
| M6 | `# DEFECT: completa solo print/resultado del contrato (instruction + solution output)` | several E1 starters |
| M7 | `errors.append(err)  # type: ignore[arg-type]` | youDo.starterCode |
| M8 | Soft: `Los **ocho subtemas** están completos: theory + I Do + E1/E2/E3 por cada uno.` | theory map ¶4 |

**Meta-leak count (clusters): 8** (M5 alone is ~24× instances).

**No findings of:** AI chain-of-thought dumps, “moved from section X” file paths, or raw system prompts.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 Pre-round research anchors (best practices applied)

- **Gradual release (I Do / We Do / You Do):** teacher models → guided scaffold → independent transfer (Fisher & Frey / GRR). S02 *structure* matches; You Do *content* does not (pre-solved).
- **Cognitive load:** introduce one schema at a time; avoid untaught APIs in early exercises (gold checklist #9). Decimal in T1-B-E3 and full try/except stacks early raise germane load before T3/T4.
- **CS50P / py4e / official tutorial:** types, variables, input/print early; exceptions and money precision later. S02 wisely emphasizes types-before-ops and money as Decimal—better than many MOOCs that leave float for “currency.”
- **Data quality pedagogy:** raw preservation + actionable field errors is industry-aligned (ETL fail-soft reporting)—a distinctive PyArcana strength vs generic “print your name” intros.
- **Active recall:** spaced MCQs should sample all major LOs; current selfCheck does not.

### 5.2 Connective tissue & narrative flow

**Strengths**
- Single thread: synthetic client record → parser → CP-N1-A.
- Ordered map T1→T4 is clear and repeated in intros.
- Peru-situated jobRelevance (banks/fintech/retail, soles, apellidos paterno/materno, PII ban) is excellent and consistent with course brand.
- Callouts (tip/warning/danger/success) reinforce operational rules (no `eval`, no silent `pass`, Decimal from str).

**Weaknesses**
- Opening dump of entire glossary + out-of-scope + legacy migration + contract code is three purposes in one block.
- Weak explicit S01→S02 handoff (venv, repo layout, “reuse `print` from S01”).
- English island “Absolute Basics” and “budget calculator”.
- Scope disclaimer fights the actual syntax load.

### 5.3 I Do / We Do / You Do fidelity

| Layer | Fidelity | Notes |
|-------|----------|-------|
| I Do | **High** | 8 demos, each with `why`, runnable code, honest outputs (incl. float IGV basura). Slight redundancy with theory code (near-duplicates) but acceptable for dual modality. |
| We Do E1 | **Mixed** | Some true guided blanks; several print-theater / DEFECT shells. |
| We Do E2 | **High** | Bug-hunt `=`/`==`, copy vs alias, propina Decimal, safe_int variants—good independent practice. |
| We Do E3 | **High intent / mixed load** | Transfer to intake schema is excellent; T1-B-E3 jumps ahead on Decimal. |
| You Do | **Low as assessment** | Objectives/rubric excellent; starter = solution. |
| Self-check | **Partial** | Quality items, incomplete LO map. |

### 5.4 Cognitive load & progressive disclosure

```
T1-A literales ──► T1-B conversión ──► T2 nombres ──► T2 identity/raw
        │                  │
        │                  └── E3 Decimal early ⚠
        ▼
T3 ops (float IGV) ──► T3 Decimal ──► T4 I/O ──► T4 parse ──► You Do full parse
```

- **Good:** float pain *before* Decimal cure (T3-A-E3 output `94.39999999999999` is pedagogically honest).
- **Good:** telephone as `str`, Unicode Ñahui/María throughout.
- **Risk:** `def` + type hints + `try/except` + lists + optional params in section 2 after only setup.
- **Risk:** comprehension in solution of T4-A-E3 while comprehensions “out of scope.”

### 5.5 Exercise & exam quality / alignment

- **Alignment of We Do to LOs:** generally strong; each subtopic has three progressive kinds (`guided` / `independent` / `transfer`).
- **Edge cases documented** in many exercises (`edgeCases[]`)—good graph nodes.
- **Exam/selfCheck gap:** no Decimal, no precedence, no parse contract, no f-string.
- **No topicEvaluations** unlike S01.
- **Grader honesty:** solution outputs mostly match claims; You Do happy assert is the main honesty bug.

### 5.6 Consistency with roadmap & S01

- Homepage card matches tagline/hours/level.
- SECTION_MAP.tsv row matches id/title/file.
- Capstone naming CP-N1-A consistent with later N1 sections narrative.
- S01 is warmer, more sequential glossary, has topicEvaluations; S02 is denser, more “contract/gate” voice and more scaffold residue.
- Prior auto-auditor `S02_AUDIT.json` verdict ACCEPT / rank 9.51 is **not** adopted here: structural completeness ≠ redaction/pedagogy gold (per GOLD_STANDARD_CHECKLIST operating rule).

### 5.7 Comparison with external best-in-class

| Source | How S02 compares |
|--------|------------------|
| [CS50P](https://cs50.harvard.edu/python) functions/variables/types | CS50P is slower on money precision; S02 is stronger on data-intake professionalism. CS50P cleaner on scaffold language. |
| [Python Tutorial — Informal Intro](https://docs.python.org/3/tutorial/introduction.html) | Same core types; S02 adds enterprise data contracts earlier. |
| [decimal docs](https://docs.python.org/3/library/decimal.html) | S02 correctly teaches str construction + quantize — gold. |
| [py4e variables](https://www.py4e.com/html3/02-variables) | gentler progressive disclosure; S02 denser but more job-relevant. |
| PEP 8 | Naming exercises well aligned. |

**Net:** content concept quality ≈ top-tier specialized DS intro; **surface redaction and assessment design lag** CS50P cleanliness.

### 5.8 Grammar & redaction (Peruvian Spanish)

- Overall Spanish is natural, technical, and Peru-aware (soles, IGV 18%, apellidos, Lima/Cusco synthetic).
- Issues: English leftovers (Absolute Basics, budget calculator, path del estudiante), truncated comments, hybrid DEFECT English/Spanish labels.
- Minor accuracy: “versiones modernas” for `if x = 1`.
- Tone occasionally authorial (“ya no son el núcleo”) rather than coaching.

### 5.9 Accessibility & motivation

- Synthetic data and PII ban repeatedly stated — ethical strength.
- Motivation via onboarding realism is high.
- No alt-text concerns in TS (code-first); browser-pyodide path good for zero-install demos.
- Risk: 18h + dense contracts may intimidate absolute beginners without pacing notes (“sesión 1: solo T1…”).

### 5.10 Graph memory (nodes worth tracking)

High-value nodes: `literal`, `type/str_vs_int`, `safe_int`, `raw_clean`, `is_None`, `alias_vs_copy`, `precedence_-3**2`, `Decimal_soles`, `fstring_report`, `parse_client`, `CASO-LIM-002`, `CP-N1-A`.  
Toxic edges: `meta_V3` → all theory[0]; `DEFECT_scaffold` → all weDo; `youDo_full_solution` → assessment_integrity.

---

## 6. Proposed GitHub-style Diffs

> Diffs are **proposals only** — do not apply in Explorer. Paths relative to repo root. Snippets show intent; Fixer should apply carefully with full context.

### Diff 01 — Remove V3 / path meta from map paragraph

```diff
--- a/src/lib/course/sections/s02-basics.ts
+++ b/src/lib/course/sections/s02-basics.ts
@@
-        'En V3, **S02 no cubre condicionales, loops, funciones avanzadas ni comprehensions** como camino principal del estudiante. Esos temas se posponen a secciones posteriores. Aquí dominas lo que un parser de intake necesita primero: **qué es un valor**, **qué tipo tiene**, **cómo se nombra**, **cómo se opera** y **cómo entra/sale texto** sin perder el original.',
+        'En esta sección dominas lo que un parser de intake necesita primero: **qué es un valor**, **qué tipo tiene**, **cómo se nombra**, **cómo se opera** y **cómo entra/sale texto** sin perder el original. Verás `if` y `for` solo como **sintaxis de apoyo** en demos (no son el tema a dominar aún): el control de flujo profundo y la iteración llegan en secciones siguientes.',
```

### Diff 02 — Rewrite out-of-scope callout (no legacy / no V3)

```diff
--- a/src/lib/course/sections/s02-basics.ts
+++ b/src/lib/course/sections/s02-basics.ts
@@
       callout: {
         type: 'info',
-        title: 'Fuera de alcance S02 V3 (no es el path del estudiante)',
+        title: 'Qué NO es el foco de esta sección',
         content:
-          'Condicionales profundos, for/while, *args/**kwargs y list comprehensions ya no son el núcleo de S02. Si ves material legado con “calculadora de propinas” o budget calculator, está **reemplazado** por el esqueleto del **parser de intake**. Puedes recordar esos ejemplos para más adelante; no los uses como entrega de esta sección.',
+          'No profundizamos aún en condicionales complejos, bucles como herramienta principal, *args/**kwargs ni comprehensions. La entrega de esta sección es el **esqueleto del parser de intake** (tipos, nombres, operadores, Decimal e I/O con raw/clean/errors), no una calculadora genérica de propinas.',
       },
```

### Diff 03 — You Do context without legacy contrast

```diff
--- a/src/lib/course/sections/s02-basics.ts
+++ b/src/lib/course/sections/s02-basics.ts
@@
     context:
-      'Incremento del capstone CP-N1-A: en lugar de una calculadora de presupuesto, construyes el **esqueleto de un parser de intake** para un cliente sintético (...).',
+      'Incremento del capstone CP-N1-A: construyes el **esqueleto de un parser de intake** para un cliente sintético (nombres, apellido paterno, apellido materno, contacto, dirección). Conservas valores originales, normalizas con strip, validas al menos un campo numérico opcional (edad) con mensaje claro, y reportas con f-strings. Solo datos ficticios — sin PII real.',
```

### Diff 04 — Heading ES-PE + soften “completos” meta

```diff
--- a/src/lib/course/sections/s02-basics.ts
+++ b/src/lib/course/sections/s02-basics.ts
@@
-      heading: 'De “Absolute Basics” a valores y tipos (mapa de la sección)',
+      heading: 'Mapa de la sección: de literales al parser de intake',
@@
-        'Orden pedagógico: **T1 Valores** ... Los **ocho subtemas** están completos: theory + I Do + E1/E2/E3 por cada uno.',
+        'Orden pedagógico: **T1 Valores** (literales → inspección/conversión) → **T2 Nombres** (asignación/PEP 8 → identidad y copias) → **T3 Operadores** (precedencia → Decimal para dinero) → **T4 I/O** (f-strings → parse con errores). En cada subtema harás teoría, una demo I Do y tres prácticas We Do (guiada, independiente y de transferencia).',
```

### Diff 05 — Purge DEFECT scaffold (example: T1-A-E1; apply pattern to all 24)

```diff
--- a/src/lib/course/sections/s02-basics.ts
+++ b/src/lib/course/sections/s02-basics.ts
@@
         starterCode: {
           language: 'python',
           title: 'clasificar_literales.py',
           code: `# CASO-LIM-002 · T1-A-E1
-# DEFECT: corrige: literales = [0, 3.14, "Lima", False, None]
-# Contrato: corrige el DEFECT; salida alineada a solutionCode
+# Completa el cuerpo del bucle: imprime repr(lit) y el nombre del tipo.
 literales = [0, 3.14, "Lima", False, None]
 
 for lit in literales:
-    # DEFECT: imprime repr y nombre del tipo
     print(____, "→", ____)`,
         },
```

### Diff 06 — Fix print-theater E1 (T1-B-E1 example)

```diff
--- a/src/lib/course/sections/s02-basics.ts
+++ b/src/lib/course/sections/s02-basics.ts
@@
           code: `# CASO-LIM-002 · T1-B-E1
-# DEFECT: corrige: # Fixture del paquete (conserva datos; no reescribas asserts
-# Contrato: corrige el DEFECT; salida alineada a solutionCode
-# Fixture del paquete (conserva datos; no reescribas asserts)
+# Construye edad a partir de raw con strip + int, luego imprime valor y tipo.
 raw = " 21 "
-edad = int(raw.strip())
-# DEFECT: completa solo print/resultado del contrato (instruction + solution output)
-# forma esperada (referencia): print(edad, type(edad).__name__)
+edad = ____
+print(edad, type(edad).__name__)
 `,
```

### Diff 07 — Move Decimal out of T1-B-E3 (progressive disclosure)

**Intent:** T1-B-E3 should only do multi-field int (+ optional float as *bad* intermediate) or two int fields; introduce `safe_decimal` in T3-B-E3 only (already exists). Replace pipeline monto Decimal with second int field (e.g. `anios_antiguedad`) **or** keep monto as raw str without Decimal until T3.

```diff
--- a/src/lib/course/sections/s02-basics.ts
+++ b/src/lib/course/sections/s02-basics.ts
@@ instruction T1-B-E3
-          'E3 (transferencia) — Pipeline de 2 campos: `edad` (`int`) y `monto` (`Decimal` cuantizado a céntimos) desde texto. ...',
+          'E3 (transferencia) — Pipeline de 2 campos: `edad` e `anios_cliente` (ambos `int`) desde texto. Devuelve dict con `raw`, `clean` y `errors`. Si un campo falla, el otro puede seguir OK; raw siempre conserva los strings. (El parse de montos con Decimal llega en T3-B.)',
```

*(Full solutionCode rewrite required in same change set.)*

### Diff 08 — You Do: scaffold with blanks + honest tests

```diff
--- a/src/lib/course/sections/s02-basics.ts
+++ b/src/lib/course/sections/s02-basics.ts
@@ youDo.starterCode (conceptual replacement)
 """parse_client_intake.py — incremento CP-N1-A (S02)
 Datos sintéticos únicamente.
 """
 from __future__ import annotations
 
 def safe_int(campo: str, valor: str) -> tuple[bool, int | None, str | None]:
-    """... full impl ..."""
-    try:
-        return True, int(valor.strip()), None
-    except ValueError:
-        return False, None, f"ERROR en '{campo}': ..."
+    # TODO estudiante: strip + int; (ok, n|None, msg|None)
+    raise NotImplementedError
 
 def parse_client(...) -> dict:
-    # full impl
+    # TODO: *_raw, clean_required, edad opcional, errors
+    raise NotImplementedError
 
 def mostrar_resumen(resultado: dict) -> None:
-    # full impl
+    # TODO: f-strings con raw y errors
+    ...
 
 def _run_tests() -> None:
     r = parse_client("María José", "Quispe", "Ñahui", "999000111", "Av. Ejemplo 123, Lima", edad="34")
     assert r["apellido_materno_raw"] == "Ñahui"
-    assert r["errors"] == [] or isinstance(r["errors"], list)
+    assert r["errors"] == []
+    assert r["apellido_materno"] == "Ñahui"
     ...
```

Keep a **separate** `solutionCode` or hidden reference for mentors if the platform supports it; do not ship full solution as starter.

### Diff 09 — Expand selfCheck (add ≥5 items for T3–T4)

```diff
--- a/src/lib/course/sections/s02-basics.ts
+++ b/src/lib/course/sections/s02-basics.ts
@@ selfCheck.questions (append)
+      {
+        question: '¿Qué imprime la expresión -3**2 en Python?',
+        options: ['9', '-9', 'Error', '6'],
+        correctIndex: 1,
+        explanation: '** tiene mayor precedencia que el unario -: se evalúa 3**2=9 y luego el signo → -9. Usa (-3)**2 para 9.',
+      },
+      {
+        question: '¿Cuál es la forma correcta de construir dinero en soles con Decimal?',
+        options: ['Decimal(0.1)', 'Decimal("0.1")', 'float("0.1")', 'round(0.1, 2) como tipo Decimal'],
+        correctIndex: 1,
+        explanation: 'Decimal desde str evita heredar el error binario del float. Luego quantize a 0.01.',
+      },
+      {
+        question: '¿Qué tipo devuelve siempre input()?',
+        options: ['int si escribiste dígitos', 'str siempre', 'float', 'None'],
+        correctIndex: 1,
+        explanation: 'input devuelve str; la conversión es un paso explícito posterior (int/Decimal).',
+      },
+      {
+        question: 'En el parser de intake, si edad="abc", ¿qué debe ocurrir?',
+        options: [
+          'El programa termina con traceback no capturado',
+          'Se borra edad_raw para ocultar el fallo',
+          'errors lista el campo; edad_raw sigue siendo "abc"',
+          'Se convierte silenciosamente a 0',
+        ],
+        correctIndex: 2,
+        explanation: 'Contrato S02: raw siempre presente, error accionable, sin tragar excepciones en silencio.',
+      },
```

### Diff 10 — Fix “versiones modernas” accuracy

```diff
--- a/src/lib/course/sections/s02-basics.ts
+++ b/src/lib/course/sections/s02-basics.ts
@@
-        '**`=` asigna** ... En versiones modernas de Python, `if x = 1:` es **SyntaxError** (el walrus `:=` es otro tema y no es el default de S02). ...',
+        '**`=` asigna** ... `if x = 1:` es **SyntaxError** (asignación no es expresión). El operador morsa `:=` existe en Python reciente pero **no** es el default de S02: aquí usas `==` para comparar. ...',
```

### Diff 11 — Align I Do T4-B signature with full schema (optional but recommended)

```diff
-def parse_client(nombres: str, apellido_materno: str, edad=None) -> dict:
+def parse_client(nombres: str, apellido_paterno: str, apellido_materno: str, contacto: str, direccion: str, edad=None) -> dict:
```
*(Update body, asserts, and expected output accordingly — mirror T4-B-E3/You Do fields.)*

### Diff 12 — Unify safe_int empty handling (document one contract)

Prefer T1-B-E2 behavior in You Do:

```diff
 def safe_int(campo: str, valor: str):
     texto = valor.strip()
     if texto == "":
         return False, None, f"ERROR en '{campo}': valor vacío"
     try:
         return True, int(texto), None
     except ValueError:
         return False, None, f"ERROR en '{campo}': no se pudo convertir {valor!r} a int"
```

### Diff 13 — Add S01 connective tissue sentence to jobRelevance or map

```diff
+        'Parte de tu entorno de S01: activa el `.venv`, crea un archivo `parse_client_intake.py` en tu repo de práctica y corre las demos en Pyodide o en local con el mismo Python del venv.',
```

### Diff 14 — Avoid comprehension in student-facing solution if declared out of scope

```diff
-        "types": {k: type(v).__name__ for k, v in datos.items()},
+        "types": {
+            "nombres": type(nombres).__name__,
+            "contacto": type(contacto).__name__,
+            "edad": type(edad).__name__,
+        },
```

---

## 7. Recommended Priority Order for Fixing

| Priority | Issues | Rationale |
|----------|--------|-----------|
| **1. Immediate P0** | 01, 02, 03, 05, 06 | Meta-leaks + assessment integrity; first impression of Phase 0 |
| **2. High P1** | 04, 08, 09, 10 | Pedagogy: theater E1s, scope honesty, Decimal timing, exam coverage |
| **3. Medium P2** | 07, 11, 12, 13, 16, 17, 19 | Consistency with S01, schema demos, load, truncated comments |
| **4. Polish P3** | 14, 15, 18, 20, 21 | Accuracy nits, hours narrative, bridges |

**Suggested Fixer batches**
1. **Redaction batch:** M1–M8 purge + ES headings + callout rewrite.  
2. **Scaffold batch:** regenerate all 24 starters without DEFECT/package language; fix theater E1s.  
3. **You Do batch:** open scaffold + honest asserts + optional mentor solution split.  
4. **Disclosure batch:** T1-B-E3 without Decimal; scope paragraph honesty; drop comprehension from S02 solutions.  
5. **Assessment batch:** expand selfCheck; optionally port `topicEvaluations` pattern from S01 for T1–T4.

---

## 8. Graph Memory Update Notes

For shared context (`GRAPH_MEMORY.json` / summary — **notes only**, Explorer does not write product curriculum):

```yaml
section: S02
id: basics
file: s02-basics.ts
score_explorer: 7.2
status_explorer: complete

nodes_add_or_refresh:
  - CASO-LIM-002
  - CP-N1-A_intake_parser
  - raw_clean_errors_contract
  - decimal_soles_quantize
  - literal_42_vs_str_42
  - is_None_idiom
  - alias_vs_copy
  - precedence_unary_pow
  - phone_as_str
  - meta_leak_V3_cluster
  - scaffold_DEFECT_language
  - youDo_overcomplete_starter

edges:
  - S01.venv -> S02.local_run (weak_in_prose; strengthen)
  - S02.types -> S03.decisions (declared; but if used early)
  - S02.ops_float_pain -> S02.Decimal (strong)
  - S02.parse_skeleton -> S04.CP-N1-A_close (roadmap)
  - meta_V3 -toxic-> learner_trust
  - DEFECT_scaffold -toxic-> weDo_clarity
  - full_youDo_starter -toxic-> assessment_validity

gold_gaps_vs_S01:
  - missing topicEvaluations
  - denser dictionary dump
  - more harness residue in starters

do_not_regress:
  - Decimal from str + quantize + IGV/soles framing
  - Unicode names Ñahui/María
  - no eval / no silent except
  - synthetic-only PII policy
  - 8 subtopics × E1/E2/E3 structure
```

**Residual risk if unfixed:** Early learners copy You Do solution, pass 5 MCQs without Decimal/parse mastery, and carry raw-overwrite bugs into CP-N1-A while associating the course with “broken DEFECT comments.”

---

## Closing

This is the complete Explorer report for Section 2. Ready for the Fixer prompt.
