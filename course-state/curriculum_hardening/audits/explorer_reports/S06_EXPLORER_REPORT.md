# S06 Explorer Report — Colecciones y estructuras de datos

**Auditor role:** Curriculum Auditor · Pedagogical Analyst · Technical Editor  
**Method:** Stanford STORM + Graph Engineering + Loop Engineering + Harness Engineering  
**Scope:** Section 6 only (platform id `numpy`)  
**Live site:** https://pillb.github.io/pyarcana/ (currículum · Sección 6 · Colecciones)  
**Live deep-link / hash:** https://pillb.github.io/pyarcana/#numpy  
**Source file:** `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s06-numpy.ts`  
**Audit date:** 2026-07-24  
**Status:** COMPLETE — Explorer only (no product files modified)

---

## 1. Section Identification & Scope

| Field | Value |
|-------|--------|
| Section index | **6** |
| Platform id (hash) | `numpy` (legacy id retained) |
| Learner-facing title | **Colecciones y estructuras de datos** |
| shortTitle | Colecciones |
| tagline | listas, dicts, sets y estructuras anidadas para modelo en memoria |
| estimatedHours | 18 |
| level | Intermedio |
| phase | 0 |
| V3 topic (authoritative) | Colecciones / modelo tabular en memoria (inicio **CP-N1-B**) |
| Explicitly out of scope (V3) | NumPy arrays, broadcasting, pandas (retomados ~S14+) |
| Source module | `src/lib/course/sections/s06-numpy.ts` (~1847 lines) |
| Live UI label | Sección 6 · Colecciones · 18h · Intermedio |

### Inventory (structural nodes)

| Layer | Count / shape | Notes |
|-------|----------------|-------|
| Theory headings | **9** (1 mapa + 8 subtemas T1–T4 × A/B) | Gold bar: ≥9 ✓ |
| Theory code demos | **8** (+ mapa sin code) | Runnable + `output` ✓ |
| I Do demos | **8** (`S06-T*-DEMO`) | `browser-pyodide` · stdlib ✓ |
| We Do exercises | **24** (E1 guided / E2 independent / E3 transfer × 8) | Gold bar ✓ |
| You Do | 1 portfolio (**Modelo tabular en memoria**) + rubric 5 criterios | ✓ |
| Self-check MCQ | **5** | Gold minimum ✓ |
| Resources | 6 docs + 2 books + 4 courses | Domain-aligned ✓ |
| Learning outcomes | **8** | Measurable ✓ |

### Subtopic graph (learner path)

```
T1-A Listas/tuplas/slicing ──► T1-B Unpacking/alias/copia
        │                              │
        ▼                              ▼
T2-A Dicts / índices / get ──► T2-B Sets / dedup / conflictos
        │                              │
        ▼                              ▼
T3-A Anidado cliente→contacts/txs ──► T3-B Acceso seguro / missing≠falsy
        │                              │
        ▼                              ▼
T4-A sorted + key ──► T4-B Elección estructura + JSON determinista
                              │
                              ▼
                    You Do · CP-N1-B memory model
```

### Pre-round research anchors (pedagogy + domain)

- **Gradual release (I/We/You Do):** demonstration → scaffolded practice → independent transfer; S06 implements this at section level and again inside each subtopic (E1→E3).
- **Cognitive load / progressive disclosure:** introduce one dominant operation per structure (append/window → lookup → membership → nest → sort → export); avoid teaching NumPy in the same cognitive slot.
- **MIT 6.100L / CS50P:** aliasing, mutable default-adjacent bugs, shallow vs deep copy as high-transfer concepts.
- **Python Tutorial · Data Structures / TimeComplexity wiki:** list O(n) membership vs set/dict O(1); `sorted(key=)`; sets as cohort ops.
- **Data-quality pedagogy (course-specific advantage):** dedup that **reports conflicts** beats “set and forget”; missing ≠ falsy (echo S03); deterministic JSON for reproducible demos.
- **Competitive peers:** Py4E lists/dicts, Real Python data structures, Kaggle Learn Python, Harvard CS50P — S06 is stronger on **business-shaped nested stores** and weaker on pure ADT breadth (stacks/queues), which is intentional for CP-N1-B.

---

## 2. Executive Summary of Quality (1–10)

### Score: **7.6 / 10**

**Verdict:**  
S06 is a **substantively strong intermediate section** on Python collections applied to a synthetic in-memory client store. The core teaching spine (sequences → maps/sets → nested model → sort/determinism), the **conflict-aware dedup** pattern, missing-vs-falsy continuity from S03, and the 8/8/24 pedagogical skeleton are real strengths and competitive with high-quality external intro courses on collections.

It is **not gold-standard learner redaction** yet. The opening theory and `jobRelevance` still read as **curriculum migration notes** (V3 retheme, legacy NumPy, platform id conservation). Every We Do starter exposes internal QA markup (`# CASO-LIM-006`, `# DEFECT:`). The public hash `#numpy` and filename `s06-numpy.ts` contradict the learner title “Colecciones”. A few theory–code gaps, one weak transfer exercise, an incomplete You Do harness (`get_nested` not exercised in `main`), and light Spanish redaction debt keep the section below the expert bar (≥9.5).

Prior automated/dossier ranks (~9.55) and residual “gold closed” claims **overstate** quality by under-weighting learner-visible meta-leak and URL/id dissonance. Independent Explorer judgment: **ship-worthy after redaction pass**, not “done forever”.

| Dimension | Score | Comment |
|-----------|------:|---------|
| 1. Meta-text / developer leakage | 4.5 | Systemic V3/legado/DEFECT/id leaks |
| 2. Grammar & redaction (ES-PE) | 8.0 | Mostly clear; some imperative mood + jargon density |
| 3. Connective tissue & narrative flow | 7.5 | Strong mid-body; weak opening (anti-map) |
| 4. Pedagogical structure I/We/You | 8.7 | Faithful gradual release; good defect starters |
| 5. Cognitive load & progressive disclosure | 8.0 | Good sequencing; meta + O-notation add load |
| 6. Exercise & exam quality | 8.2 | Solid; a few theater/edge gaps |
| 7. Roadmap consistency | 8.5 | Correct V3 topic; id/filename debt |
| 8. External best-in-class comparison | 8.0 | Domain-situated advantage; less ADT breadth |
| 9. Other (a11y, motivation, clarity) | 7.8 | Motivation buried under retheme language |

---

## 3. Detailed Issue Registry

Severity: **P0** blocker for learner trust · **P1** high pedagogical/redaction impact · **P2** medium polish · **P3** nice-to-have.

### ISSUE-01 — Platform id / URL hash `#numpy` vs title “Colecciones”
- **Severity:** P0 (learner orientation) / P1 (cannot rename id without migration)
- **Evidence:** `id: "numpy"`; live hash `https://pillb.github.io/pyarcana/#numpy`; UI title “Colecciones”.
- **Quote (jobRelevance):**  
  > `Esta sección (id de plataforma \`numpy\` conservado) retematiza a colecciones V3…`
- **Pedagogical impact:** Students bookmarking or sharing “NumPy” land on lists/dicts. Undermines trust and search (“dónde está NumPy?” → S14). Cognitive dissonance at first contact.
- **Graph edge:** `id:numpy` —contradicts→ `title:Colecciones` —conflicts→ `S14:NumPy vectorizado`.

### ISSUE-02 — Opening theory is curriculum archaeology, not learner motivation
- **Severity:** P1
- **Evidence:** First theory block heading and paragraphs:
  > `De “NumPy vectorizado” a colecciones en memoria (mapa de la sección)`  
  > `En V3, **S06 no es el path principal de NumPy arrays ni broadcasting**. Ese material se reubica conceptualmente hacia el bloque numérico/DS (p. ej. S14+).`
- **Pedagogical impact:** Leads with what the section is **not**. Violates progressive disclosure and motivation principles (Anchor should be the mini RAM store / workplace need). Forces the learner to process migration history before learning slicing.
- **Best practice conflict:** STORM / gold bar “Anchor → Mechanism → Worked example → Edge”, not “Legacy → Disclaimer → Target”.

### ISSUE-03 — Callout “Contenido reubicado conceptualmente” is pure developer meta
- **Severity:** P1
- **Evidence:**
  > `Material legado NumPy de este archivo **no es el camino V3 del estudiante en S06**. El target es el **modelo tabular en memoria** (inicio CP-N1-B).`
- **Pedagogical impact:** Exposes internal file/version decisions. Student does not need “este archivo” or “legado”. Same pattern as S03–S05; systemic.
- **Fix direction:** Replace with learner-facing scope callout: “En S06 usamos solo stdlib… NumPy llega en S14”.

### ISSUE-04 — jobRelevance leaks platform engineering details
- **Severity:** P1
- **Evidence:**  
  > `id de plataforma \`numpy\` conservado) retematiza a colecciones V3 e inicia el bloque **CP-N1-B** sin NumPy/pandas.`
- **Pedagogical impact:** Workplace framing is good (Perú banks/fintech) until the parenthetical turns into a migration changelog. Dilutes motivation.

### ISSUE-05 — We Do starters expose `# CASO-LIM-006` and `# DEFECT:` QA markup (×24)
- **Severity:** P1
- **Evidence (representative):**
  ```python
  # CASO-LIM-006 · slicing ventana
  # DEFECT: usa txs[:2] (primeras) en vez de últimas; empty mal indexado
  ```
  Pattern repeats for all 24 exercises (lines ~658–1625).
- **Pedagogical impact:** Students see internal defect catalog IDs and spoiler-ish defect labels. Gold bar wants “one clear defect” **in the code behavior**, not a developer comment announcing the defect. Also breaks immersion and Spanish pedagogical voice.
- **Note:** Same family as S05 `CASO-LIM-005` — curriculum-wide, but in-scope for S06 Fixer.

### ISSUE-06 — You Do starter comments say “corrige el DEFECT del starter”
- **Severity:** P2
- **Evidence:**
  ```python
  # Contrato: corrige el DEFECT del starter (no dejes NotImplemented)
  raise NotImplementedError
  ```
  (×4 functions)
- **Pedagogical impact:** “DEFECT” is auditor jargon. Prefer contract language: “Implementa según docstring; no dejes NotImplementedError”.

### ISSUE-07 — Theory T2-B talks about conflicts; theory **code** only shows set ops
- **Severity:** P2
- **Evidence:** Paragraph:  
  > `Deduplicar **no es borrar a ciegas**… deben **reportarse** en \`conflicts\`… El patrón del gate es \`unique\` + \`conflicts\`.`  
  Code title `sets_cohortes.py` only: `cohort_ops`, `unique_sorted` — **no** conflict report.
- **Pedagogical impact:** Theory–demo mismatch. Conflict pattern appears later in I Do / We Do E3, but the theory block’s “I Do at paragraph level” fails to compute the key claim.
- **Gold bar:** “Theory code computes the concept”.

### ISSUE-08 — I Do T3-B (`dig`) flag logic is redundant / incomplete empty case
- **Severity:** P2
- **Evidence:**
  ```python
  flag = "ok" if phone != "MISSING" and phone else ("empty" if phone == "" else "missing")
  if phone == "MISSING":
      flag = "missing"
  ```
  Fixtures never include `phone: ""`; second assignment overrides complexity.
- **Pedagogical impact:** Students may copy messy branching; theory promise “missing vs empty” is not fully demonstrated in this demo’s output (`ok` / `missing` only).

### ISSUE-09 — You Do `main()` never calls `get_nested`
- **Severity:** P1
- **Evidence:** `main()` uses `flatten_txs`, `export_deterministic`, `dedup_report` but not `get_nested`. Rubric still weights “Acceso seguro a faltantes” at 15%.
- **Pedagogical impact:** Learner can leave `get_nested` as `NotImplementedError` and still get a “green” looking `main()` run. Assessment misalignment.

### ISSUE-10 — Grammar: “no confundes” (indicative) instead of instructional “no confundas”
- **Severity:** P2
- **Evidence (T2-A):**  
  > `k in d` prueba pertenencia de **clave**, no de valor — **no confundes** con “¿el cliente tiene email?”…
- **Pedagogical impact:** Minor ES correctness; instructional Spanish prefers subjunctive/imperative (“no confundas”).

### ISSUE-11 — Inconsistent casing “latam” vs brand “LATAM/LatAm”
- **Severity:** P3
- **Evidence:** `datos sintéticos latam` (theory map, youDo requirements).
- **Pedagogical impact:** Minor polish; early gold sections often use “LATAM” or “LatAm”.

### ISSUE-12 — Self-check is thin relative to theory breadth (5 MCQ, recall-heavy)
- **Severity:** P2
- **Evidence:** Questions cover slicing, alias, conflicts policy, `list.sort`→None, `sort_keys`. Missing: nested flatten, set ops, `get` vs KeyError, shallow vs deep, structure choice.
- **Pedagogical impact:** Active recall under-samples T3/T4; risk of unlocking next section without nested-model fluency.

### ISSUE-13 — S06-T4-B-E3 is near print-theater for complexity
- **Severity:** P2
- **Evidence (solution):**
  ```python
  print('list membership: O(n) por chequeo')
  print('set membership: O(1) promedio')
  ```
- **Pedagogical impact:** Gold anti-pattern “print precomputed literals without computing from inputs”. The `in set` check is real; complexity strings are slogans. Transfer claim is weak vs E3 bar.

### ISSUE-14 — Cognitive overload packing: V3 + CP-N1-B + O-notation + four structures in one intro
- **Severity:** P2
- **Evidence:** Map paragraphs + jobRelevance combine migration, capstone gate ids, complexity foreshadowing, and full structure roadmap.
- **Pedagogical impact:** Extraneous load (Sweller) for Intermedio jump from S05 Principiante. Fix by stripping meta and staging complexity only at T4-B.

### ISSUE-15 — Unpacking with `*rest` mentioned once, never demoed
- **Severity:** P3
- **Evidence:** T1-B: `` `a, b = fila` o `head, *rest = fila` `` — no I Do / We Do for starred unpack.
- **Pedagogical impact:** Dead concept node; either demo briefly or drop to reduce noise.

### ISSUE-16 — Level label jump Principiante (S05) → Intermedio (S06) without soft landing
- **Severity:** P3
- **Evidence:** Metadata `level: "Intermedio"`; first contact still dense.
- **Pedagogical impact:** Acceptable if opening reassures (“stdlib only, building on lists from S04”), but current opening raises threat (NumPy, V3, gates).

### ISSUE-17 — Callout “Sin NumPy aquí” still frames via absence
- **Severity:** P3 (borderline OK as scope fence)
- **Evidence:** T4-B callout:  
  > `Si tu solución de S06 importa numpy/pandas, está fuera del incremento V3. Vuelve a stdlib.`
- **Pedagogical impact:** Useful boundary; “incremento V3” is meta. Prefer: “Fuera de alcance: no importes numpy/pandas en S06.”

### ISSUE-18 — Requirements line “Sin NumPy/pandas en este incremento V3”
- **Severity:** P2
- **Evidence:** youDo.requirements.
- **Pedagogical impact:** Same meta token “incremento V3”.

### ISSUE-19 — Theory paragraphs slightly under gold depth on some blocks
- **Severity:** P3
- **Evidence:** Gold wants ~≥250 chars × 3 with Anchor/Mechanism/Contract/Case. Several paras are dense and good; some are short mechanism-only (e.g. unpacking P1). Case/edge often pushed entirely into code.
- **Pedagogical impact:** Workable for motivated learners; less self-explanatory offline than S01 gold prose.

### ISSUE-20 — Filename `s06-numpy.ts` misleads contributors (and tooling)
- **Severity:** P2 (repo hygiene; secondary learner impact via hash)
- **Evidence:** Path vs SECTION_MAP title “Colecciones y estructuras de datos”.
- **Pedagogical impact:** Future editors may reintroduce NumPy content into S06 by filename habit. Rename is a migration project (imports, SECTION_MAP, tests) — document for Fixer backlog.

### ISSUE-21 — Duplicate identical emails treated as non-conflict (document policy)
- **Severity:** P3
- **Evidence:** `dedup_with_conflicts`: `elif seen[rid] != r` — identical duplicate rows produce no conflict entry.
- **Pedagogical impact:** Correct for many DQ policies, but never stated. Learner may wonder why third identical C001 vanished from conflicts. One sentence of policy would close the gap.

### ISSUE-22 — Prior “gold / PA 9.55 / residual closed” overconfidence
- **Severity:** P1 (process / graph memory, not learner text)
- **Evidence:** `S06_PARAGRAPHS.md` uniform 9.55 boilerplate analysis; `S06_DONE.md` PA≥9.55; residual claims gold.
- **Pedagogical impact:** Risk that Fixer skips S06. Explorer overrides: **not fully gold** until meta-leak pass.

---

## 4. Meta-Leak Report

Exact learner-visible (or starter-visible) leaked / developer-oriented text:

| # | Location | Exact / near-exact leaked text | Class |
|---|----------|--------------------------------|-------|
| M1 | `jobRelevance` | `id de plataforma \`numpy\` conservado` · `retematiza a colecciones V3` | Platform/migration |
| M2 | Theory map P1 | `En V3, **S06 no es el path principal de NumPy arrays ni broadcasting**` · `se reubica conceptualmente` | Version archaeology |
| M3 | Theory map callout | `Material legado NumPy de este archivo **no es el camino V3 del estudiante en S06**` | File/legacy note |
| M4 | Theory map heading | `De “NumPy vectorizado” a colecciones en memoria` | Legacy frame |
| M5 | T4-B callout | `fuera del incremento V3` | Version jargon |
| M6 | iDo intro | Acceptable if trimmed; currently packs `CP-N1-B` densely (borderline project id OK) | Gate id density |
| M7 | All weDo starters | `# CASO-LIM-006 · …` | Internal case id |
| M8 | All weDo starters | `# DEFECT: …` | Auditor defect label |
| M9 | youDo starter | `# Contrato: corrige el DEFECT del starter` | Auditor jargon |
| M10 | youDo requirements | `Sin NumPy/pandas en este incremento V3` | Version jargon |
| M11 | Live URL hash | `#numpy` while UI says Colecciones | Identity leak |

**meta_leak_count (distinct classes / sites):** **11** (M1–M11); starter DEFECT/CASO lines are 24× instances of M7/M8.

**What is NOT a leak (keep):**  
- Project name **CP-N1-B** as portfolio framing (if explained as “tu entrega de modelo en memoria”).  
- “Sin NumPy/pandas” as scope fence once V3 wording removed.  
- Synthetic ids `C00x`, `example.com`.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do fidelity

| Phase | Fidelity | Notes |
|-------|----------|-------|
| **I Do** | High | 8 demos, one per subtopic; `why` present; most compute rather than print answers. |
| **We Do** | High structure, medium redaction | E1→E2→E3 gradient real; starters have behavioral defects; spoiled by CASO/DEFECT comments. |
| **You Do** | High intent, medium harness | Clear objectives/rubric; starter is honest scaffold; `get_nested` orphan in `main`. |
| **Self-check** | Adequate minimum | 5 fair MCQs; uneven coverage. |

Gradual release **within** subtopics is excellent (guided fix → independent → transfer). Section-level narrative is weaker only at the **first 30 seconds** (meta map).

### 5.2 Connective tissue

| Link | Quality |
|------|---------|
| S03 missing≠falsy → T3-B | Explicit, excellent |
| S04 iteration/comprehensions → flatten | Implicit, good |
| S05 functions/contracts → pure helpers | Good (functions as API of memory model) |
| S06 → S08 CSV/JSON | Explicit bridge (“shape listo para S08”) |
| S06 → S14 NumPy | Present but **over-exposed** as opening frame |

Recommendation: keep S08 bridge; demote S14/NumPy to a single end-of-section “Próximos pasos” sentence.

### 5.3 Cognitive load & progressive disclosure

**Strengths:**  
- Structures ordered by operation need.  
- Complexity O(n)/O(1) delayed until T1 membership hint + T4-B.  
- No pandas/numpy APIs in exercises (disclosure-safe).  
- Nested model after flat dict/set skills.

**Weaknesses:**  
- Extraneous load from V3/legacy/id language.  
- CP-N1-B gate jargon without a one-line expansion for new learners.  
- T4-B-E3 complexity as slogans.

### 5.4 Redaction & ES-PE

- Tone is professional technical Spanish with Peru/LatAm synthetic names (Quispe, Huamán, Lima, Cusco) — brand-aligned.  
- Imperative mood slip: “no confundes”.  
- Occasional anglicized packing (“gate”, “incremento V3”, “override”) — “override” OK as code term; “gate/incremento V3” less so.  
- Dense bolding works for scanning; opening still feels like release notes.

### 5.5 Exercise & exam alignment

| Outcome (abbrev.) | Taught | Practiced | Assessed |
|-------------------|:------:|:---------:|:--------:|
| list/tuple/slicing | ✓ | ✓ E1–E3 T1-A | MCQ1 |
| unpacking / alias / copy | ✓ | ✓ T1-B | MCQ2 (alias only) |
| dict index / get | ✓ | ✓ T2-A | partial |
| set dedup + conflicts | ✓ | ✓ T2-B + You Do | MCQ3 |
| nested flatten | ✓ | ✓ T3-A | weak |
| safe access / missing | ✓ | ✓ T3-B | weak (You Do orphan) |
| sorted key | ✓ | ✓ T4-A | MCQ4 |
| structure choice + JSON det. | ✓ | ✓ T4-B | MCQ5 |

### 5.6 Comparison to external materials

| Source | S06 vs peer |
|--------|-------------|
| [Python Tutorial — Data structures](https://docs.python.org/3/tutorial/datastructures.html) | Peer broader on comprehensions; S06 stronger on nested business model. |
| [copy module docs](https://docs.python.org/3/library/copy.html) | S06 applies shallow/deep to client rows — excellent transfer. |
| [Sorting HOWTO](https://docs.python.org/3/howto/sorting.html) | S06 covers multi-key + sort-vs-sorted bug — aligned. |
| [Py4E lists](https://www.py4e.com/html3/08-lists) | Peer more progressive for absolute beginners; S06 assumes S01–S05. |
| CS50P / MIT 6.100L | Aliasing pedagogy comparable; S06 adds DQ conflict reporting. |
| Real Python data structures | Peer covers stacks/queues/ADTs; S06 correctly stays product-scoped. |

**Net:** Domain-situated collections curriculum is a **differentiator**. Redaction/meta and URL identity are the main gaps vs polished external courses.

### 5.7 Comparative quality vs early “gold” sections (S01–S03)

S01–style gold tends to open with **learner job story**, not “this file used to be X”. S06’s middle and exercises are closer to gold than its map block. Exercise defect-in-starter pattern is good (S01 spirit) but S06 over-labels defects in comments (anti-gold).

### 5.8 Accessibility & motivation

- Code-first learners well served.  
- Motivation (Perú pipelines) present but interrupted by retheme.  
- No PII; synthetic ethics OK.  
- Hash `#numpy` is an accessibility/orientation failure for screen-reader users who hear “numpy” then read “Colecciones”.

---

## 6. Proposed GitHub-style Diffs

> Diffs are **proposals only** — not applied. Paths relative to repo root.

### Diff A — jobRelevance: remove platform/migration meta (ISSUE-04, M1)

```diff
--- a/src/lib/course/sections/s06-numpy.ts
+++ b/src/lib/course/sections/s06-numpy.ts
@@
   jobRelevance:
-    "En pipelines de onboarding y calidad de datos en bancos, fintech y retail en Perú, antes de CSV/JSON necesitas un **modelo tabular en memoria**: clientes, contactos y transacciones como list/dict/set bien elegidos, con deduplicación que **reporta conflictos** y salidas **deterministas**. Esta sección (id de plataforma `numpy` conservado) retematiza a colecciones V3 e inicia el bloque **CP-N1-B** sin NumPy/pandas.",
+    "En pipelines de onboarding y calidad de datos en bancos, fintech y retail en Perú, antes de CSV/JSON necesitas un **modelo tabular en memoria**: clientes, contactos y transacciones como list/dict/set bien elegidos, con deduplicación que **reporta conflictos** y salidas **deterministas**. Aquí inicias el bloque de portafolio **CP-N1-B** (modelo en RAM) usando solo la biblioteca estándar — sin NumPy ni pandas.",
```

### Diff B — Theory map: learner-first opening (ISSUE-02, ISSUE-03, M2–M4)

```diff
--- a/src/lib/course/sections/s06-numpy.ts
+++ b/src/lib/course/sections/s06-numpy.ts
@@
   theory: [
     {
-      heading: "De “NumPy vectorizado” a colecciones en memoria (mapa de la sección)",
+      heading: "Mapa de la sección: modelo tabular en memoria",
       paragraphs: [
-        "En V3, **S06 no es el path principal de NumPy arrays ni broadcasting**. Ese material se reubica conceptualmente hacia el bloque numérico/DS (p. ej. S14+). Aquí construyes el **modelo tabular en memoria** que CP-N1-B necesita: listas, tuplas, dicts, sets y estructuras anidadas **cliente → contactos → transacciones** con salidas **deterministas**.",
-        "El hilo conductor es un **mini almacén en RAM** con datos sintéticos latam (`example.com`, ids `C00x`). **Sin** pandas ni NumPy en este incremento. En S08 ese modelo se conecta a CSV/JSON y cuarentena. Caso de lab: inicio **CP-N1-B**.",
+        "En esta sección construyes el **modelo tabular en memoria** que tu portafolio CP-N1-B necesita: listas, tuplas, dicts, sets y estructuras anidadas **cliente → contactos → transacciones**, con salidas **deterministas** y deduplicación que **reporta conflictos**.",
+        "El hilo conductor es un **mini almacén en RAM** con datos sintéticos LATAM (`example.com`, ids `C00x`). **Sin** pandas ni NumPy aquí (el cálculo vectorizado llega más adelante, p. ej. S14). En S08 ese modelo se conecta a CSV/JSON y cuarentena.",
         "Orden: **T1 Secuencias** (list/tuple/slicing → alias/copia) → **T2 Dicts/sets** (índices, dedup con conflictos) → **T3 Anidado y missing** → **T4 Orden y elección de estructura** (sorted estable, JSON determinista). **Nunca** PII real.",
       ],
       callout: {
         type: "info",
-        title: "Contenido reubicado conceptualmente",
+        title: "Alcance de S06",
         content:
-          "Material legado NumPy de este archivo **no es el camino V3 del estudiante en S06**. El target es el **modelo tabular en memoria** (inicio CP-N1-B). NumPy/vectorización se retoma en el tramo DS. Conserva datos sintéticos; nunca PII real.",
+          "Trabajas solo con la **biblioteca estándar** (list, dict, set, copy, json). El objetivo es el **modelo tabular en memoria** (inicio CP-N1-B). NumPy y vectorización se retoman en el tramo de datos/DS. Solo datos sintéticos; nunca PII real.",
       },
     },
```

### Diff C — Grammar fix T2-A (ISSUE-10)

```diff
--- a/src/lib/course/sections/s06-numpy.ts
+++ b/src/lib/course/sections/s06-numpy.ts
@@
-        "`d.get(k)` o `d.get(k, default)` evita **KeyError** en campos opcionales. `k in d` prueba pertenencia de **clave**, no de valor — no confundes con “¿el cliente tiene email?” si buscas en values.",
+        "`d.get(k)` o `d.get(k, default)` evita **KeyError** en campos opcionales. `k in d` prueba pertenencia de **clave**, no de valor — no confundas con “¿el cliente tiene email?” si buscas en values.",
```

### Diff D — Theory T2-B code includes conflict report (ISSUE-07)

```diff
--- a/src/lib/course/sections/s06-numpy.ts
+++ b/src/lib/course/sections/s06-numpy.ts
@@
       code: {
         language: 'python',
-        title: "sets_cohortes.py",
+        title: "sets_y_conflictos.py",
         code: `def cohort_ops(a, b):
     """Intersección y diferencia de cohortes (sets de ids)."""
     return sorted(a & b), sorted(a - b)
 
-def unique_sorted(items):
-    """Dedup determinista con set + sorted."""
-    return sorted(set(items))
+def dedup_with_conflicts(rows, key="id"):
+    """Primera vista en unique; payload distinto → conflicts (no silenciar)."""
+    seen, unique, conflicts = {}, [], []
+    for r in rows:
+        rid = r[key]
+        if rid not in seen:
+            seen[rid] = r
+            unique.append(r)
+        elif seen[rid] != r:
+            conflicts.append({"id": rid, "kept": seen[rid], "other": r})
+    return unique, conflicts
 
 lote_a = {"C001", "C002", "C003"}
 lote_b = {"C002", "C003", "C004"}
 inter, solo_a = cohort_ops(lote_a, lote_b)
 print("intersección:", inter)
 print("solo A:", solo_a)
-emails = ["a@ex.com", "b@ex.com", "a@ex.com"]
-print("únicos:", unique_sorted(emails))`,
-        output: `intersección: ['C002', 'C003']
+rows = [
+    {"id": "C001", "email": "a@ex.com"},
+    {"id": "C001", "email": "a@ex.com"},  # duplicado idéntico: no es conflicto de payload
+    {"id": "C001", "email": "otro@ex.com"},
+]
+unique, conflicts = dedup_with_conflicts(rows)
+print("unique ids:", [r["id"] for r in unique])
+print("n_conflicts:", len(conflicts))`,
+        output: `intersección: ['C002', 'C003']
 solo A: ['C001']
-únicos: ['a@ex.com', 'b@ex.com']`,
+unique ids: ['C001']
+n_conflicts: 1`,
       },
```

### Diff E — Strip CASO/DEFECT comments from We Do starters (ISSUE-05, M7–M8)

Pattern for **all 24** starters (example T1-A-E1):

```diff
--- a/src/lib/course/sections/s06-numpy.ts
+++ b/src/lib/course/sections/s06-numpy.ts
@@
         starterCode: {
           language: 'python',
           title: "slice_n.py",
-          code: `# CASO-LIM-006 · slicing ventana
-# DEFECT: usa txs[:2] (primeras) en vez de últimas; empty mal indexado
-txs = [10, 20, 30, 40, 50]
+          code: `# Ventana de las últimas transacciones (corrige el slicing).
+txs = [10, 20, 30, 40, 50]
 ventana = txs[:2]
 print(ventana)
 print(len(ventana)
```

**Fixer rule:** Delete lines matching `^\s*# CASO-LIM-006` and `^\s*# DEFECT:`; optionally one neutral Spanish cue. Keep the buggy code itself.

### Diff F — You Do starter + main harness (ISSUE-06, ISSUE-09, M9–M10)

```diff
--- a/src/lib/course/sections/s06-numpy.ts
+++ b/src/lib/course/sections/s06-numpy.ts
@@
     requirements: [
       "Tipos list[dict] o índices dict documentados",
       "dedup_report(rows, key_fn) sin borrar conflictos",
       "sorted determinista en exports",
-      "Datos sintéticos latam (example.com)",
-      "Sin NumPy/pandas en este incremento V3",
+      "Datos sintéticos LATAM (example.com)",
+      "Sin importar NumPy ni pandas en esta entrega",
     ],
@@
 def dedup_report(rows: list[dict], key_fn: Callable[[dict], Any]) -> dict:
     """Devuelve {unique, conflicts} sin borrar traza de conflictos."""
-    # Contrato: corrige el DEFECT del starter (no dejes NotImplemented)
+    # TODO: implementa según el docstring (no dejes NotImplementedError)
     raise NotImplementedError
@@
 def flatten_txs(clients: list[dict]) -> list[dict]:
     """Aplana txs anidadas a filas con client_id."""
-    # Contrato: corrige el DEFECT del starter (no dejes NotImplemented)
+    # TODO: implementa según el docstring (no dejes NotImplementedError)
     raise NotImplementedError
@@
 def get_nested(d: dict, *keys: str, default=None):
-    # Contrato: corrige el DEFECT del starter (no dejes NotImplemented)
+    # TODO: implementa acceso seguro por ruta de claves
     raise NotImplementedError
@@
 def export_deterministic(clients: list[dict]) -> str:
     """JSON estable: sort por id + sort_keys."""
-    # Contrato: corrige el DEFECT del starter (no dejes NotImplemented)
+    # TODO: implementa según el docstring (no dejes NotImplementedError)
     raise NotImplementedError
@@
 def main() -> None:
     store = build_demo_store()
     print("n_clients", len(store))
     print("flat", flatten_txs(store))
     print(export_deterministic(store))
+    print("phone C002", get_nested(store[1], "contacts", default=[]))
+    print("missing path", get_nested(store[0], "profile", "phone", default="MISSING"))
     rows = [
```

### Diff G — I Do T3-B clean missing/empty demo (ISSUE-08)

```diff
--- a/src/lib/course/sections/s06-numpy.ts
+++ b/src/lib/course/sections/s06-numpy.ts
@@
 c1 = {"id": "C001", "profile": {"phone": "999111222"}}
 c2 = {"id": "C002", "profile": {}}
-c3 = {"id": "C003"}
-for c in (c1, c2, c3):
+c3 = {"id": "C003", "profile": {"phone": ""}}
+c4 = {"id": "C004"}
+for c in (c1, c2, c3, c4):
     phone = dig(c, "profile", "phone", default="MISSING")
-    flag = "ok" if phone != "MISSING" and phone else ("empty" if phone == "" else "missing")
-    if phone == "MISSING":
+    if phone == "MISSING":
         flag = "missing"
+    elif phone == "":
+        flag = "empty"
+    else:
+        flag = "ok"
     print(c["id"], phone, flag)`,
-          output: `C001 999111222 ok
+          output: `C001 999111222 ok
 C002 MISSING missing
-C003 MISSING missing`,
+C003  empty
+C004 MISSING missing`,
```

### Diff H — T4-B callout + E3 less theater (ISSUE-13, ISSUE-17)

```diff
--- a/src/lib/course/sections/s06-numpy.ts
+++ b/src/lib/course/sections/s06-numpy.ts
@@
       callout: {
         type: "info",
         title: "Sin NumPy aquí",
         content:
-          "Si tu solución de S06 importa numpy/pandas, está fuera del incremento V3. Vuelve a stdlib.",
+          "Si tu solución de S06 importa numpy o pandas, está fuera de alcance. Vuelve a la biblioteca estándar.",
       },
```

```diff
--- a/src/lib/course/sections/s06-numpy.ts
+++ b/src/lib/course/sections/s06-numpy.ts
@@
         solutionCode: {
           language: 'python',
           title: "tradeoff.py",
-          code: `ids = ['C001', 'C002', 'C003', 'C004', 'C005']
-print('list membership: O(n) por chequeo')
-print('set membership: O(1) promedio')
-s = set(ids)
-print('C003 in set', 'C003' in s)
-print('preindexar set/dict evita O(n²) en loops anidados')`,
-          output: `list membership: O(n) por chequeo
-set membership: O(1) promedio
-C003 in set True
-preindexar set/dict evita O(n²) en loops anidados`,
+          code: `ids_list = ['C001', 'C002', 'C003', 'C004', 'C005']
+ids_set = set(ids_list)
+needle = 'C003'
+# Misma pregunta, distinta estructura: list recorre; set hashea.
+print('in list', needle in ids_list)
+print('in set', needle in ids_set)
+# En un loop de n búsquedas: list ~ n*n chequeos; set ~ n chequeos.
+n = len(ids_list)
+print('costo_conceptual_list', n * n)
+print('costo_conceptual_set', n)`,
+          output: `in list True
+in set True
+costo_conceptual_list 25
+costo_conceptual_set 5`,
         },
```

### Diff I — Expand self-check by 2–3 items (ISSUE-12) — sketch

Add MCQs (correctIndex to set carefully):

1. `copy()` de `list[dict]` ¿aísla tags anidados? → No (shallow).  
2. ¿Qué estructura para membership masivo de emails? → set.  
3. `d.get("x", "N/A")` vs `d["x"]` cuando falta clave.

### Diff J — Identity backlog (ISSUE-01, ISSUE-20) — do **not** hot-fix without migration plan

```text
Backlog (separate PR):
1. Decide stable public id: prefer `collections` or `data-structures-memory`.
2. Migration: SECTION_MAP, router hash, progress localStorage keys, tests, imports.
3. Rename s06-numpy.ts → s06-collections.ts after id migration.
4. Until then: never mention “id numpy conservado” in learner text (Diff A).
```

---

## 7. Recommended Priority Order for Fixing

| Order | Issue(s) | Effort | Impact |
|------:|----------|--------|--------|
| 1 | ISSUE-02, 03, 04 · Diff A+B | S | Removes curriculum archaeology; biggest first-impression win |
| 2 | ISSUE-05 · Diff E (×24 starters) | M | Removes systemic DEFECT/CASO leak |
| 3 | ISSUE-09, 06, 18 · Diff F | S | Aligns You Do harness + rubric |
| 4 | ISSUE-07 · Diff D | S | Theory computes conflict claim |
| 5 | ISSUE-08 · Diff G | S | Clean missing/empty pedagogy |
| 6 | ISSUE-10, 11, 17 · Diff C + polish | S | ES-PE + casing + callout |
| 7 | ISSUE-13 · Diff H (E3) | S | Anti-theater |
| 8 | ISSUE-12 · Diff I | M | Self-check coverage |
| 9 | ISSUE-15, 16, 19, 21 | S–M | Depth / soft landing / policy note |
| 10 | ISSUE-01, 20 · Diff J | L | Id/filename migration (planned) |
| 11 | ISSUE-22 | Process | Update graph memory after Fixer verifies |

**Suggested Fixer acceptance bar for S06:**  
- Zero learner-visible `V3` / `legado` / `este archivo` / `id de plataforma` / `CASO-LIM` / `# DEFECT:` strings.  
- Theory T2-B demonstrates conflicts.  
- `main()` exercises `get_nested`.  
- Re-score Explorer dimensions 1 and 3 ≥ 8.5; overall ≥ 9.0 before claiming gold.

---

## 8. Graph Memory Update Notes

For shared context files (`GRAPH_MEMORY*.md/json`, residual ledger, section progress):

```yaml
section: 6
id: numpy
title: Colecciones y estructuras de datos
file: src/lib/course/sections/s06-numpy.ts
explorer_score: 7.6
status: explorer_complete_not_gold
explorer_report: course-state/curriculum_hardening/audits/explorer_reports/S06_EXPLORER_REPORT.md
meta_sidecar: course-state/curriculum_hardening/audits/explorer_reports/S06_EXPLORER_META.json

nodes_flagged:
  - node: jobRelevance
    edges: [meta_leak_platform_id, migration_changelog]
  - node: theory[0] map
    edges: [meta_leak_V3, anti_motivation_open, legacy_numpy_frame]
  - node: weDo.starterCode[*]
    edges: [meta_leak_CASO_LIM, meta_leak_DEFECT_comment]
  - node: theory[T2-B].code
    edges: [theory_code_gap_conflicts]
  - node: youDo.main
    edges: [rubric_misalign_get_nested]
  - node: platform.id
    edges: [contradicts_title, hash_numpy_ux]

edges_quality_positive:
  - S03_missing_falsy -> S06_T3_B
  - S05_functions -> S06_helpers
  - S06_flat_list_dict -> S08_csv_json
  - conflict_aware_dedup -> CP-N1-B_gate

override_prior_claims:
  - S06_DONE PA≥9.55: SUPERSEDED_BY_EXPLORER_7_6
  - residual_ledger gold: DO_NOT_TREAT_AS_LEARNER_REDACTION_GREEN
  - recommended_next: FIXER_S06 using this report

issue_count: 22
meta_leak_count: 11
```

### Graph Engineering summary (nodes)

| Node type | Count audited | High-risk nodes |
|-----------|--------------:|-----------------|
| Theory paragraphs | ~27 | Map P1–P2, callout legado |
| Theory codes | 8 | T2-B (gap) |
| I Do demos | 8 | T3-B flag logic |
| We Do exercises | 24 | All starters (CASO/DEFECT) |
| You Do | 1 | main harness |
| Self-check | 5 | Coverage holes |
| Resources | 12 | Clean |
| Metadata | id/title/jobRelevance | id≠title |

### Loop Engineering note

Passes executed: (1) surface structure scan, (2) pedagogical I/We/You critique, (3) redaction/ES-PE, (4) meta-leak sweep, (5) comparative external + S01 gold bar, (6) exercise/exam alignment, (7) diff architecture. No unreported P0/P1 left except optional full id migration (tracked as backlog, not silent).

---

## Closing

This is the complete Explorer report for Section 6. Ready for the Fixer prompt.
