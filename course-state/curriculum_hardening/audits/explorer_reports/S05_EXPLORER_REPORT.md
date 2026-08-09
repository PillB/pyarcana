# S05 Explorer Report — Funciones, contratos y descomposición

**Auditor role:** Curriculum Auditor · Pedagogical Analyst · Technical Editor  
**Method:** Stanford STORM multi-pass + Graph Engineering + Loop Engineering  
**Date:** 2026-07-24  
**Scope constraint:** Section 5 only (no product file edits)

---

## 1. Section Identification & Scope

| Field | Value |
|-------|--------|
| Index | 5 |
| Platform section id (hash) | `oop` |
| Live URL | https://pillb.github.io/pyarcana/#oop |
| Repo source | `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s05-oop.ts` |
| Export symbol | `section05` |
| Title (learner-facing) | Funciones, contratos y descomposición |
| shortTitle | Funciones & Contratos |
| Tagline | def, defaults seguros, docstrings, pureza e inicio de normalizadores CP-N1-B |
| Level / phase / hours | Principiante · phase 0 · 18h |
| Capstone gate | Inicio **CP-N1-B** (normalizadores puros) |
| Legacy identity | File `s05-oop.ts` + id `oop` (OOP rethemed; real OOP → S11) |

**In-scope artifacts inspected**

- Theory: 1 map + 8 subtopics (`S05-T1-A` … `S05-T4-B`) with paragraphs, code+output, callouts
- iDo: 8 demos (`S05-T*-DEMO`)
- weDo: 24 exercises (E1 guided / E2 independent / E3 transfer × 8)
- youDo: `normalizers_pure.py` + rubric
- selfCheck: 5 MCQ
- resources: docs / books / courses
- Live site curriculum card for Sección 5 (matches shortTitle/tagline)
- Comparative peers: S01 (gold narrative), S02 (map pattern), S04 (same retheme/meta pattern), Python Tutorial §4.8–4.9, PEP 257, Py4E functions, CS50P, MIT 6.100L

**Out of scope:** Applying fixes; editing product TS; auditing other sections except for comparison.

**Pedagogical pre-research (brief)**

- Official Python docs make **mutable defaults**, **return None**, **keyword-only**, **docstrings**, and **LEGB** first-class teaching points — S05 aligns topically.  
- Gradual Release (I Do / We Do / You Do) and cognitive-load theory favor one new idea per layer, worked examples before transfer, and stable contracts before refactor.  
- Py4E / CS50P prioritize warm motivation + simple `def/return` before purity/DI; S05 is more “data-eng junior” and packs professional concerns earlier (correct for PyArcana identity, riskier for first-time abstraction load).

---

## 2. Executive Summary of Quality (1–10)

### Score: **7.8 / 10**

### Verdict

S05 is a **structurally complete, domain-coherent retheme** of a legacy OOP slot into a professional functions-and-contracts unit aimed at CP-N1-B normalizers. The skeleton meets the course gold structure (9 theory heads, 8/8/24 pedagogy, non-empty DEFECT starters, pure youDo with idempotence, solid resources). Technical teaching of mutable defaults, return-vs-print, purity, and composition is **evidence-based and production-relevant**.

It falls short of S01-class gold mainly because of:

1. **Learner-facing meta-leaks** about V3 retheming and “contenido reubicado / material legado”.  
2. **Contract drift** for `normalize_nombre` / `normalize_email` across theory → weDo → youDo.  
3. **One incorrect demo output** (missing third print line).  
4. **Thinner connective tissue** (avg paragraph ~196 chars; map lacks S01/S02-style **Diccionario**).  
5. **Short exercise instructions** (~137 char avg vs gold ~150+) and several thematically disconnected E1s.

Prior automated residual/PA scores (~9–9.55 “gold”) **overstate** redaction and narrative quality; this Explorer score prioritizes learner-visible rigor over structural green alone.

| Dimension | Sub-score | Note |
|-----------|-----------|------|
| Meta-leak / developer leakage | 5.5 | Explicit V3/legacy callout in learner theory |
| Grammar & ES-PE redaction | 8.0 | Mostly clean; few calques/awkward phrases |
| Connective tissue / narrative | 7.2 | Strong CP-N1-B thread; weak map dictionary vs S01/S02 |
| I/We/You fidelity | 8.5 | Full 8/8/24; DEFECT scaffolds good |
| Cognitive load / progressive disclosure | 7.5 | T3-B packs purity+DI+lambda; policy drift |
| Exercises & exam (selfCheck) | 7.8 | Solid oracles; short instructions; 5 MCQ only |
| Roadmap consistency | 8.5 | Correctly defers OOP→S11, packaging→S10; id `oop` confuses |
| External benchmark | 8.0 | Matches Python docs on defaults/return; less warm than Py4E/CS50P |
| Technical accuracy of demos | 7.5 | One broken output; LEGB phone edge dead-branch |

---

## 3. Detailed Issue Registry

Severity: **P0** ship-blocker · **P1** high trust/pedagogy · **P2** medium · **P3** polish.

### ISSUE-01 · P0/P1 — Meta-leak: curriculum-version and retheme narrative in learner theory

- **Location:** Theory map heading `De “OOP” a funciones y contratos (mapa de la sección)`, paragraphs[0]; callout title/content.  
- **Evidence:**
  - *“En V3, **S05 no es el path principal de clases, herencia ni dunders de sklearn**…”*
  - Callout title: *“Contenido reubicado conceptualmente a S11 / S10”*
  - *“Material legado de OOP (clases Perro, herencia, ABC, dunders) **no es el camino del estudiante en S05 V3**…”*
- **Pedagogical impact:** Student arrives expecting to learn functions; instead first message is about what was moved, version labels, and legacy class demos they never saw. Increases extraneous load, erodes trust, and leaks authoring process. Same anti-pattern as S04 map.  
- **Graph edge:** `theory.map` → `learner_confusion` · `meta_leak`.

### ISSUE-02 · P1 — Demo output incomplete: `pureza_idem.py` missing third print

- **Location:** Theory `S05-T3-B` code block `pureza_idem.py`.  
- **Evidence:** Code executes three prints (idempotence line, `process_line` digits, `process_line` with lambda lower); declared `output` only has two lines:
  ```
  999000111 999000111 idempotent= True
  012345678
  ```
  Missing expected third line: `a@b.com`.  
- **Pedagogical impact:** Students comparing local run vs site output lose trust in every subsequent oracle. Directly harms I Do credibility on purity/injection — a core T3-B idea.  
- **Graph edge:** `theory.T3-B.code` → `oracle_mismatch`.

### ISSUE-03 · P1 — Contract drift: `normalize_nombre` title-case policy

- **Locations:**
  - T1-A theory/demo: collapse only (`"QUISPE"` stays `"QUISPE"`).
  - T1-A-E2 hint: *“title() es opcional; aquí solo colapsar.”*
  - T3-A and later weDo: `.title()` appears.
  - T4-B-E3: *“mantén collapsar sin title”*.
  - youDo requirements: *“colapsa espacios y aplica title de palabras”* + assert `"María José"`.
- **Pedagogical impact:** Students who diligently internalized T1 policy fail youDo asserts. Undermines the section’s own “contrato = docstring + tests” lesson.  
- **Graph edge:** `policy.nombre` inconsistent across `theory↔weDo↔youDo`.

### ISSUE-04 · P1 — Contract drift: `normalize_email` validation policy

- **Locations:**
  - T2-A theory/demo/weDo E2: `ValueError` if missing `@`.
  - T3-A composition / T3-B I/O / T4-B refactor / T4-B-E1: strip+lower only, no `@` check.
  - youDo: requires error if no `@`.
- **Pedagogical impact:** “Contrato alineado al código” is taught while the course itself ships multiple competing email contracts. Learners copy the nearest demo and miss the gate.  
- **Graph edge:** `policy.email` inconsistent.

### ISSUE-05 · P2 — Map lacks learner “Diccionario”; thinner than S01/S02 gold narrative

- **Location:** Opening theory block (only 3 paragraphs + retheme callout; no map code contract).  
- **Evidence:** Residual metrics: `avg_para` ≈ 196 chars (S05) vs gold checklist target ~250+ and S01 multi-paragraph dictionary. S02 opens with **Diccionario de la sección**; S05 opens with V3 disclaimer.  
- **Pedagogical impact:** Terms *contrato, pureza, idempotencia, LEGB, keyword-only, orquestador* appear densely without a front-loaded glossary. Higher intrinsic load for Principiante.  
- **Graph edge:** `connective_tissue.map` weaker than `s01`/`s02`.

### ISSUE-06 · P2 — Exercise instructions often under gold length; weak I/O pass contracts

- **Location:** Multiple weDo `instruction` fields; residual `avg_instr` ≈ 137 (< ~150 gold).  
- **Examples:**
  - T1-A-E1: *“Escribe `def doble(n):` que retorne `n*2`. Imprime doble(21).”*
  - T2-A-E1: *“Añade docstring… imprime `area.__doc__`.”*
  - `tests` fields often soft: `"42"`, `"doc + 12"`, `"Cliente: / VIP:"`, `"PASS lines"`.  
- **Pedagogical impact:** Guided steps work with starters, but independent/transfer tasks lack explicit fixture id, pass string, and edge I/O in the instruction itself (gold bar).  
- **Graph edge:** `weDo.instruction` ↔ `grader_ambiguity`.

### ISSUE-07 · P2 — Thematic disconnect of early E1 scaffolds from normalizer spine

- **Location:** T1-A-E1 `doble`, T2-A-E1 `area`, T2-B-E1 `len_safe`.  
- **Pedagogical impact:** The section’s unique value is CP-N1-B normalizers; early guided tasks reset to toy math and dilute narrative glue. Acceptable micro-isolation pedagogically, but weaker than embedding the same skill in `normalize_*`.  
- **Graph edge:** `weDo.theme_drift`.

### ISSUE-08 · P2 — Cognitive packing in T3-B (pureza + I/O edge + DI + lambda)

- **Location:** Theory paragraphs + `pureza_idem.py` under `S05-T3-B`.  
- **Pedagogical impact:** Four mechanisms in one subtopic. Progressive disclosure prefers purity/idempotence first; inject/lambda can be a second beat or deferred tip. Increases load right before LEGB.  
- **Graph edge:** `T3-B` overload.

### ISSUE-09 · P2 — Technical dead-branch / misleading phone normalizer in LEGB demo

- **Location:** Theory `legb_closure.py` / related iDo.  
- **Evidence:** After `"".join(... isdigit())`, `d` never starts with `"+"`; branch `return prefix + d if not d.startswith("+") else d` is dead for digit-only strings. Input `"+51999000111"` becomes digits `"51999000111"` then strips country — works by coincidence, but the `+` branch teaches a false mechanism.  
- **Pedagogical impact:** Students “learn” a check that never runs; debugging later PE phone policies will be harder.  
- **Graph edge:** `T4-A.code` accuracy.

### ISSUE-10 · P2 — E3 “monstruo de 10 líneas” overpromises vs starter

- **Location:** `S05-T3-A-E3` instruction vs starter `normalize_all` (~5 lines, no real inline rules).  
- **Pedagogical impact:** Transfer task wording sets expectation of a painful decomposition; starter is nearly already decomposed incorrectly. Low struggle authenticity.  
- **Graph edge:** `weDo.E3.authenticity`.

### ISSUE-11 · P2 — Legacy id/hash `oop` vs learner title “Funciones & Contratos”

- **Location:** `id: "oop"`, file `s05-oop.ts`, live hash `#oop`; UI title correct.  
- **Pedagogical impact:** Bookmark/share URL says “oop”; syllabus says functions. Maintainers and advanced students may open wrong mental model (OOP). Acceptable for stable ids if map is clean — currently map *highlights* the mismatch.  
- **Graph edge:** `identity.legacy` × `meta_leak`.

### ISSUE-12 · P3 — ES-PE redaction nits

| Quote | Issue |
|-------|--------|
| *“en sites de llamada largos”* | Calque of “call sites”; prefer *en las llamadas* / *en los sitios de llamada*. |
| T2-B-E1 *“comentario mental”* | Vague; instruction should demand an explicit print string. |
| jobRelevance *“OOP de dominio llega en S11”* | Mild roadmap meta; OK if map is rewritten learner-first. |
| *“dunders de sklearn”* | Jargon pile-up for beginners in the first paragraph. |

### ISSUE-13 · P3 — youDo imports untaught surface

- **Location:** youDo starter: `from __future__ import annotations`, `Callable`.  
- **Pedagogical impact:** Minor. `Callable` is fair after T2-B; `__future__` annotations never explained. Prefer drop future import or one-line comment.  

### ISSUE-14 · P3 — selfCheck coverage gaps

- **Location:** 5 questions: None return, mutable default, pureza, LEGB, idempotencia.  
- **Missing:** docstring vs comment, keyword-only `*`, type hints no runtime, composition/orquestador.  
- **Impact:** Autocheck gate under-samples T2 contracts.  

### ISSUE-15 · P3 — Starter residue `print('ok', True)` in many exercises

- **Location:** Nearly all weDo starters end with `print('ok', True)` while solutions often drop it.  
- **Impact:** Soft theater / grader residue; students may keep printing false success. Pattern is course-wide but still learner-visible noise.

### Non-issues / strengths (for Fixer balance)

- Mutable default danger callout + demo is textbook-correct (matches Python Tutorial warning).  
- return vs print / None implícito taught early and re-tested in E3.  
- 24 DEFECT starters with clear comments — strong We Do design.  
- youDo is a real portfolio kernel for CP-N1-B with weighted rubric and idempotence helper.  
- Resources are real, section-specific, and aligned (Tutorial, PEP 257, typing, LEGB, Py4E, CS50P, MIT, Coursera, Kaggle).  
- Synthetic data / no PII discipline held.  
- Progressive deferral of pathlib/CLI/OOP classes is *conceptually* right (execution of messaging is the problem).

---

## 4. Meta-Leak Report

Exact learner-visible leaks in `s05-oop.ts`:

| # | Exact text (trimmed) | Location | Classification |
|---|----------------------|----------|----------------|
| M1 | `En V3, **S05 no es el path principal de clases, herencia ni dunders de sklearn**. Eso vive en **S11**…` | theory[0].paragraphs[0] | Version/roadmap authoring note |
| M2 | Callout title: `Contenido reubicado conceptualmente a S11 / S10` | theory[0].callout.title | Relocation changelog |
| M3 | `Material legado de OOP (clases Perro, herencia, ABC, dunders) **no es el camino del estudiante en S05 V3**…` | theory[0].callout.content | Legacy content inventory |
| M4 | Heading: `De “OOP” a funciones y contratos (mapa de la sección)` | theory[0].heading | Frames section as migration from OOP |
| M5 | File/id surface: `s05-oop.ts` / `id: "oop"` (URL `#oop`) while title is Funciones | metadata | Stable-id legacy; OK if invisible, leaky when map discusses OOP |

**Not counted as meta-leak (OK):** Forward references *when framed as learner roadmap* after a clean map (e.g. “en S08 verás archivos”; “clases de dominio en S11”) — these become leaks only when wrapped in “reubicado / legado / V3”.

**Count:** **5** meta-leak items (M1–M5); **3** high-visibility prose leaks (M1–M3).

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do fidelity

| Layer | Spec | Observed | Fidelity |
|-------|------|----------|----------|
| I Do | ≥8 demos, why, code, output | 8 demos, all with `why` and environment `browser-pyodide` | **High** |
| We Do | 24 = E1/E2/E3 × 8 | Present; kinds `guided`/`independent`/`transfer` correct | **High** |
| You Do | Independent portfolio + rubric | `normalizers_pure.py`, 6 rubric rows, tests in `__main__` | **High** |
| Self-check | ≥5 MCQ | 5 MCQ, fair indices | **Meet-min** |

Scaffold quality: starters encode **one DEFECT** (print-not-return, mutable default, missing lower/@, ignoring injected norm, etc.). This is excellent We Do craftsmanship and superior to empty TODOs.

Weakness: some E1s are skill micro-drills disconnected from the normalizer narrative (ISSUE-07); transfer authenticity uneven (ISSUE-10).

### 5.2 Connective tissue & narrative flow

**Spine (good):**  
`def/return` → safe params → pre/post docstrings → hints & domain errors → small functions/composition → pureza/idempotencia → LEGB/closures → examples/refactor → youDo four normalizers.

**Breaks:**

1. Opening is about **what this section is not** (OOP/V3) rather than **what you will build today**.  
2. Title-case and email-raise policies appear/disappear (ISSUE-03/04).  
3. No S01/S02-style dictionary for *contrato / pureza / idempotencia / LEGB / keyword-only*.  
4. Leap from `doble`/`area` toys back to bank-intake normalizers costs reactivation energy.

Compared to **S01 gold:** S01 sells workplace stakes in Perú with a readable dictionary; S05 jobRelevance is solid (ETL basura silenciosa, default mutable, fintech Perú) but theory voice is more telegraphic.

### 5.3 Cognitive load & progressive disclosure

| Subtopic | Load | Notes |
|----------|------|-------|
| T1-A def/return | Low–Med | Excellent None bug |
| T1-B defaults/keyword-only | Med | Mutable default is hard; well illustrated |
| T2-A docstrings pre/post | Med | Good; PEP 257-aligned |
| T2-B hints + result tuples | Med–High | Two error styles (raise vs tuple) — intentional but dense |
| T3-A composition | Med | Clear orquestador message |
| T3-B purity+DI+lambda | **High** | ISSUE-08 |
| T4-A LEGB/closures | Med–High | Factory pattern justified; code accuracy ISSUE-09 |
| T4-B asserts/refactor | Med | Professional habit; good |

Untaught APIs: largely avoided (stdlib only). Minor: `__future__` in youDo; `Tuple`/`Optional` introduced in-theory.

### 5.4 Grammar & ES-PE redaction

- Prose is largely correct Peruvian-leaning formal Spanish with intentional English technical terms (`return`, `docstring`, `default`, `pipeline`, `PR`).  
- Tone is professional, slightly dry; fewer colloquial connectors than S01.  
- Issues: calque *sites de llamada*; *comentario mental*; dense first-paragraph jargon (*dunders de sklearn*).  
- No vulgar/unsafe content; PII discipline good (`example.com`, synthetic phones).

### 5.5 Exercise & exam alignment

- Outcomes ↔ theory topics: well mapped (8 LOs ≈ 8 subtopics).  
- youDo directly exercises LO set (pureza, docstrings, hints, composition, idempotencia).  
- selfCheck aligns with T1/T3/T4; under-samples T2 docstrings/hints.  
- Soft `tests` strings may not match a strict automated grader if one exists beyond substring checks.

### 5.6 External benchmark

| Source | S05 alignment | Gap |
|--------|---------------|-----|
| Python Tutorial §4.8–4.9 | Mutable defaults, keyword-only, docstrings, annotations | Tutorial is warmer; S05 is domain-applied |
| PEP 257 | Docstring as contract | S05 could show multi-line PEP shape more often |
| Py4E Ch.4 | def/return first | S05 faster to purity/DI |
| CS50P | Functions as design | Less “meta curriculum” talk |
| MIT 6.100L | Abstraction & specs | S05 pre/post good; policy drift hurts |

### 5.7 Roadmap consistency

- Correctly positions CP-N1-B start; defers files (S08), packaging/CLI (S10), domain OOP (S11).  
- Legacy id `oop` is intentional stability; learner confusion only if map centers OOP absence.  
- After S04 iteration/intake, functions as decomposition of rules/normalization is the right sequence.

---

## 6. Proposed GitHub-style Diffs

> Do **not** apply in Explorer. Paths relative to repo root.

### Diff A — ISSUE-01 / Meta-leaks M1–M4: rewrite map for learners

```diff
--- a/src/lib/course/sections/s05-oop.ts
+++ b/src/lib/course/sections/s05-oop.ts
@@ theory map block
-      heading: "De “OOP” a funciones y contratos (mapa de la sección)",
+      heading: "Mapa de la sección: funciones con contrato",
       paragraphs: [
-        "En V3, **S05 no es el path principal de clases, herencia ni dunders de sklearn**. Eso vive en **S11** (OOP y modelo de dominio). Aquí el estudiante domina **funciones con contratos claros**: definición, parámetros seguros, docstrings, type hints graduales, pureza y un poco de LEGB — todo al servicio de **normalizadores** del inicio de **CP-N1-B**.",
+        "**Diccionario de la sección** (léelo antes de T1). **Función (`def`):** bloque reutilizable con nombre de verbo. **`return`:** entrega un valor al caller (sin return → `None`). **Contrato:** precondiciones + postcondiciones documentadas (docstring) y alineadas al código. **Default seguro:** no uses lista/dict mutable como valor por defecto. **Función pura:** mismo input → mismo output, sin I/O ni prints. **Idempotencia:** `f(f(x)) == f(x)` en el caso feliz. **Orquestador delgado:** combina normalizadores sin reimplementar reglas. **LEGB:** orden Local → Enclosing → Global → Builtin.",
         "El hilo conductor es un conjunto de **funciones puras** `normalize_nombre`, `normalize_email`, `normalize_telefono`, `normalize_direccion` que transforman texto sintético **sin** tocar disco ni red. La I/O se inyecta o se deja en el borde. Datos ficticios únicamente (`example.com`); **nunca** PII real. Caso de lab: inicio **CP-N1-B**.",
         "Orden pedagógico: **T1 Funciones** (def/return → params/defaults) → **T2 Contratos** (pre/post/docstrings → hints y errores de dominio) → **T3 Diseño** (funciones pequeñas → pureza/I/O) → **T4 Alcance** (LEGB/closures → tests y refactor). Cada normalizador debe ser **idempotente** en el caso feliz: `f(f(x)) == f(x)`.",
+        "Más adelante empaquetarás esto en CLI (S10) y modelarás registros con clases de dominio (S11). Hoy el objetivo es el **núcleo puro** que un ETL junior puede testear sin abrir archivos.",
       ],
       callout: {
-        type: "info",
-        title: "Contenido reubicado conceptualmente a S11 / S10",
-        content:
-          "Material legado de OOP (clases Perro, herencia, ABC, dunders) **no es el camino del estudiante en S05 V3**. El target es **normalizadores puros** con idempotencia demostrada. Packaging/CLI → S10; modelo de dominio OOP → S11.",
+        type: "tip",
+        title: "Qué entregas al cerrar S05",
+        content:
+          "Cuatro normalizadores puros + orquestador con docstring, hints graduales e idempotencia demostrada (inicio CP-N1-B). Sin clases todavía y sin leer CSV: eso llega cuando el core ya es confiable.",
       },
```

### Diff B — ISSUE-02: fix `pureza_idem.py` output

```diff
--- a/src/lib/course/sections/s05-oop.ts
+++ b/src/lib/course/sections/s05-oop.ts
@@ pureza_idem output
-        output: `999000111 999000111 idempotent= True
-012345678`,
+        output: `999000111 999000111 idempotent= True
+012345678
+a@b.com`,
```

### Diff C — ISSUE-03: stabilize `normalize_nombre` policy (recommend: title-case from T1)

```diff
--- a/src/lib/course/sections/s05-oop.ts
+++ b/src/lib/course/sections/s05-oop.ts
@@ T1-A theory code
-def normalize_nombre(raw: str) -> str:
-    return " ".join(raw.strip().split())
+def normalize_nombre(raw: str) -> str:
+    """Post: colapsa espacios y title-case por palabra (política CP-N1-B)."""
+    return " ".join(raw.strip().split()).title()
 
 print(normalize_nombre("  María   José  "))
 print(normalize_nombre("QUISPE"))
@@ expected output
-QUISPE
+Quispe
```

Also align T1-A-DEMO, T1-A-E2 instruction/hint/solution, and T4-B-E3 text to the same postcondition (“colapsa + `.title()`”), and keep youDo asserts as source of truth.

### Diff D — ISSUE-04: one email policy in all teaching demos

Pick **raise ValueError if `@` missing** as canonical (matches T2-A and youDo). Add a one-line note in composition demos:

```diff
 def norm_email(s: str) -> str:
-    return s.strip().lower()
+    s = s.strip().lower()
+    if "@" not in s:
+        raise ValueError("email sin @")
+    return s
```

For T4-B refactor examples that intentionally simplify, add comment: `# demo de refactor; el contrato de gate incluye validar '@' (ver T2-A / youDo)`.

### Diff E — ISSUE-06/07: deepen T1-A-E1 instruction + theme glue

```diff
-        instruction:
-          "E1 (guiado) — Escribe `def doble(n):` que retorne `n*2`. Imprime doble(21).",
+        instruction:
+          "E1 (guiado) — CASO-LIM-005. Corrige `doble(n)` para que **retorne** `n*2` (no imprima dentro). El caller debe ver `42` al hacer `print(doble(21))`. Pasa: línea de salida exacta `42`. Así evitas el None silencioso de los normalizadores.",
```

Analogous expansions for T2-A-E1 / T2-B-E1 with explicit pass strings.

### Diff F — ISSUE-08: split lambda/DI beat (optional structure)

- Keep purity + idempotence as main T3-B code.  
- Move `process_line(..., norm=...)` and lambda to callout “tip” or second short code block titled `inyeccion_norm.py` after the purity demo.

### Diff G — ISSUE-09: honest PE phone factory

```diff
 def make_phone_normalizer(prefix: str):
     def norm(raw: str) -> str:
-        d = "".join(c for c in raw if c.isdigit())
-        if d.startswith("51") and len(d) > 9:
-            d = d[2:]
-        return prefix + d if not d.startswith("+") else d
+        s = raw.strip()
+        if s.startswith("+"):
+            # ya trae prefijo internacional en el texto original
+            d = "".join(c for c in s if c.isdigit())
+            return "+" + d if not s.startswith("+") else "+" + d  # simplify carefully
+        d = "".join(c for c in s if c.isdigit())
+        if d.startswith("51") and len(d) > 9:
+            d = d[2:]
+        return prefix + d
     return norm
```

(Fixer should implement a single clear policy and matching `output`; Explorer only flags the dead `d.startswith("+")` after digit filter.)

### Diff H — ISSUE-10: authentic monster starter

```diff
 def normalize_all(n, e, t):
-    return {
-        'nombre': n.strip(),
-        'email': e,
-        'tel': t,
-    }
+    # monstruo: tres políticas inline (DEFECT a descomponer)
+    nombre = ' '.join(n.strip().split()).title()
+    email = e.strip().lower()
+    if '@' not in email:
+        raise ValueError('email')
+    tel = ''.join(c for c in t if c.isdigit())
+    return {'nombre': nombre, 'email': email, 'tel': tel}
```

### Diff I — ISSUE-13: youDo import minimalism

```diff
-from __future__ import annotations
-
 from typing import Callable
```

### Diff J — ISSUE-14: add 1–2 selfCheck items (optional)

Add MCQ on (a) docstring vs `#` comment / `__doc__`, (b) keyword-only after `*`.

### Diff K — ISSUE-12: redaction microfixes

```diff
-        "En llamadas, los keyword tras posicionales mejoran la lectura en sites de llamada largos y evitan invertir argumentos silenciosamente.",
+        "En llamadas, los keyword tras posicionales mejoran la lectura en sitios de llamada largos y evitan invertir argumentos silenciosamente.",
```

```diff
-          "E1 (guiado) — Anota `def len_safe(s: str) -> int` y retorna len. Imprime el resultado y un comentario mental de que el hint no valida en runtime.",
+          "E1 (guiado) — Anota `def len_safe(s: str) -> int` y retorna `len(s)`. Imprime el resultado y la línea exacta `hint no valida en runtime`.",
```

---

## 7. Recommended Priority Order for Fixing

| Order | Issue | Severity | Effort | Rationale |
|------:|-------|----------|--------|-----------|
| 1 | ISSUE-02 output `pureza_idem` | P1 | XS | Restores demo trust immediately |
| 2 | ISSUE-01 / Meta M1–M4 map rewrite | P0/P1 | S | Removes authoring leak; adds dictionary |
| 3 | ISSUE-03 nombre policy unify | P1 | M | youDo vs theory contradiction |
| 4 | ISSUE-04 email policy unify | P1 | M | Same family as 3; gate alignment |
| 5 | ISSUE-09 LEGB phone branch | P2 | S | Technical honesty |
| 6 | ISSUE-06/07 instruction depth + theme | P2 | M | Gold instruction bar + narrative |
| 7 | ISSUE-10 monster E3 authenticity | P2 | S | Transfer credibility |
| 8 | ISSUE-08 T3-B unpack | P2 | S–M | Cognitive load |
| 9 | ISSUE-12/13/14/15 polish | P3 | S | Redaction, selfCheck, starters |
| 10 | ISSUE-11 legacy id | P2 (docs only) | — | Keep stable `oop` id; do not rename without platform plan; fix messaging only |

**Suggested Fixer batching**

- **Batch 1 (ship):** Diff B + Diff A + policy notes in Diff C/D (minimum: document canonical policy in map + youDo already correct).  
- **Batch 2 (pedagogy):** C+D full alignment across demos/exercises + E + H.  
- **Batch 3 (polish):** F, G, I, J, K.

---

## 8. Graph Memory Update Notes

For shared context (`GRAPH_MEMORY.json` / summary consumers):

```yaml
section: S05
id: oop
file: s05-oop.ts
title: Funciones, contratos y descomposición
explorer_score: 7.8
status_explorer: complete
prior_auto_score_note: residual/PA ~9.0–9.55 overstated meta-redaction quality

nodes_flagged:
  - theory.map.meta_v3_retheme (P0/P1)
  - theory.T3-B.pureza_idem.output_missing_line (P1)
  - policy.normalize_nombre.title_drift (P1)
  - policy.normalize_email.raise_drift (P1)
  - theory.T4-A.phone_closure.dead_plus_branch (P2)
  - weDo.instructions.avg_len_under_gold (P2)
  - weDo.T3-A-E3.monster_underbuilt (P2)
  - identity.legacy_id_oop (info)

edges:
  - CP-N1-A (S04) -> CP-N1-B start (S05 normalizers) : strong
  - S05 pure core -> S08 files / S10 CLI / S11 domain OOP : deferred correctly
  - meta_leak.pattern shared_with: S04 map (and partially S02 "En V3")

fixer_entrypoints:
  - src/lib/course/sections/s05-oop.ts theory[0]
  - pureza_idem.py output
  - normalize_nombre / normalize_email policy sweep
  - weDo instruction strings for E1s

do_not:
  - rename id "oop" without platform migration
  - reintroduce class/ABC/dunder teaching in S05
  - claim gold ≥9.5 until meta-leaks + policy drift closed
```

**Comparative memory:** Early gold bar remains **S01** (dictionary + workplace stakes + paragraph depth). S05 matches structural completeness of peers but needs the same **learner-first map** treatment S01 already has (and S02 partially has).

---

This is the complete Explorer report for Section 5. Ready for the Fixer prompt.
