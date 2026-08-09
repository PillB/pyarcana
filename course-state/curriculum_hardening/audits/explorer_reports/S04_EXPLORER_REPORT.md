# S04 Explorer Report — Iteración y resúmenes transaccionales

**Auditor role:** Curriculum Auditor · Pedagogical Analyst · Technical Editor (STORM + Graph + Loop + Harness)  
**Run date:** 2026-07-24  
**Scope rule:** Section 4 only — analysis and proposed diffs; **no product files edited**.

---

## 1. Section Identification & Scope

| Field | Value |
|--------|--------|
| Section index | **4** |
| Platform section id (hash) | `functions-modules` |
| Live URL | https://pillb.github.io/pyarcana/#functions-modules |
| Repo source (workspace) | `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s04-functions-modules.ts` |
| Learner-facing title | Iteración y resúmenes transaccionales |
| shortTitle / tagline | Iteración & Resúmenes · for/while, contadores, comprehensions y cierre del Client Intake CP-N1-A |
| Level / phase / hours | Principiante · phase 0 · 18h |
| Capstone gate | **CP-N1-A** (Client Intake & Data Quality Script — batch/resumen) |
| Structural inventory | Theory map + **8** subtopics (T1–T4 × A/B) · **8** iDo demos · **24** weDo (E1/E2/E3) · youDo · 5 selfCheck · resources |

**Topic path (V3):** Iteration for transactional batch summaries — *not* legacy “Funciones & Módulos” (that path lives in S05/S10+).

**Sources used this run**

1. Live course shell: https://pillb.github.io/pyarcana/ (S04 card: *Iteración & Resúmenes*; method I Do / We Do / You Do).  
2. Full source read of `s04-functions-modules.ts` (~1731 lines).  
3. Gold bar: `course-state/curriculum_hardening/GOLD_STANDARD_CHECKLIST.md`.  
4. Prior automated artifacts (treated as **untrusted** for quality claims): `S04_AUDIT.json` (ACCEPT / empty issues), `S04_PARAGRAPHS.md` (claimed rank 9.55), `S04_RESEARCH.md`, `S04_DONE.md`.  
5. Peer framing: opening of `s02-basics.ts`, `s03-data-structures.ts` (same V3-retarget map pattern).  
6. External pedagogy anchors: [Python Tutorial — for](https://docs.python.org/3/tutorial/controlflow.html#for-statements), [enumerate](https://docs.python.org/3/library/functions.html#enumerate), [zip](https://docs.python.org/3/library/functions.html#zip), [list comprehensions](https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions), [Py4E Ch.5 Iterations](https://www.py4e.com/html3/05-iterations), [TimeComplexity wiki](https://wiki.python.org/moin/TimeComplexity), CS50P / MIT 6.100L (linked in section resources).

**Pedagogy pre-research (applicable bar for loops)**

- Gradual release (I Do → We Do → You Do) with one clear skill per cycle (Merrill / GRR).  
- Cognitive load: introduce **for** before **while**, counters before comprehensions, one control concept at a time (Sweller).  
- Worked examples must be **executable oracles**: claimed `output` must match running `code` (print theater / desync destroys trust).  
- Sentinel + iteration variable + termination proof before `while True` (Py4E pattern).  
- Domain transfer (batch intake rates, raw preservation) is a strength when examples are honest.

---

## 2. Executive Summary of Quality (1–10 + key verdict)

### Score: **6.2 / 10**

**Verdict:** Section 4 is **architecturally strong and roadmap-aligned** (T1 recorrido → T2 repetición → T3 patrones → T4 razonamiento; 8/8/24; CP-N1-A youDo; solid selfCheck and docs), but it **fails the gold bar on runnable integrity**. Across nearly all theory blocks and most iDo demos, the published `output` is a leftover narrative from a *different* code sample. One iDo demo (**S04-T2-B-DEMO**) contradicts its own description and claimed output on **break vs continue**. That class of defect is worse than thin prose: students who run the playground get a different story than the lesson text.

**What is already good**

- Clear learner outcomes (range exclusivity, enumerate/zip alignment, sentinels, rates with safe denominators, O(n) vs O(n²), tracing).  
- Strong workplace frame (Perú fintech/bank onboarding, synthetic data, no real PII).  
- We Do defect-fix starters (`CASO-LIM-004` + `# DEFECT`) generally match instructions; solutions’ outputs mostly honest.  
- youDo contracts `process_batch` / `tasa_reject is None` / raw conservation are gate-correct.  
- Resources are domain-honest (Python docs, Py4E, TimeComplexity, CS50P, MIT, Coursera, Kaggle).

**What blocks gold (≥ 9.5)**

1. Systematic **code ↔ output desynchronization** in theory + iDo (print theater / stale outputs).  
2. **Pedagogical contradiction** on break/continue in S04-T2-B-DEMO.  
3. Theory **T2-A** teaches *while/centinelas* with a **`for`+`break`** sample (wrong construct for the heading).  
4. Theory **T3-B** heading *Comprehensions* shows **`first_reject` for-loop**, not comprehensions.  
5. Early theory **T1-A** uses list comprehension before T3-B teaches them (progressive disclosure leak).  
6. Learner-facing **curriculum meta** (V3, legacy id `functions-modules`, “historial del repo”, reubicación a S10/S11).  
7. A few **starter ↔ instruction** mismatches (T4-A-E2, softened IndexError in T4-B-E2).  
8. Minor Spanish redaction (`desalinedas`).

**Comparison vs early peers / external gold**

- Same V3 map/meta pattern as S02/S03 — connective tissue is consistent, but meta-leak is **systemic**, not S04-only.  
- Below Py4E/CS50P on example honesty (those courses keep code and printed results aligned).  
- Above generic MOOCs on **domain situativity** (batch rates, zip desalineación, raw audit trail) *once demos are fixed*.  
- Automated `S04_AUDIT.json` ACCEPT / rank 9.55 is **rejected** as ground truth (matches GOLD checklist warning against length/rank oracles).

---

## 3. Detailed Issue Registry

Severity key: **P0** = blocks learning / wrong concept · **P1** = high trust or pedagogy damage · **P2** = medium polish / consistency · **P3** = low / optional.

| ID | Severity | Location | Evidence (quote / fact) | Pedagogical impact |
|----|----------|----------|-------------------------|--------------------|
| **I-01** | **P0** | Theory T1-A `for_registros.py` | Code: `filter_lima` + `print(filter_lima(filas)); print("ok", True)`. Output claims: `C001 → Lima` … `range(1, 4): [1, 2, 3]`. Real run: `[{'id':'C001',...}]` then `ok True`. | Student cannot reconcile text, code, and run; off-by-one / range lesson is not demonstrated by code. |
| **I-02** | **P0** | Theory T2-A `while_centinela.py` | Heading/paragraphs teach **`while` + centinela**; code uses **`for ln in lineas` + `break`**. Output claims `procesadas:` / `restante no leída:` but code prints list + `ok True`. | Core construct of the subtopic is not shown; “while” mental model never instantiated. |
| **I-03** | **P0** | Theory T2-B `break_continue.py` | Code returns `['C001|Lima','C002|Cusco']` + `ok True`. Output adds `iteraciones efectivas del for: 5` (not printed). | Trace of iterations is claimed but not taught by the demo. |
| **I-04** | **P0** | Theory T3-A `contadores_tasa.py` | Code: `print(count_statuses(...)); print("ok", True)` → dict. Output: `total 6 reject 2 tasa 0.3333` / `first_reject_idx 1`. | Rate/denominator (central gate skill) is **not computed** in the sample that claims it. |
| **I-05** | **P0** | Theory T3-B `comprehensions_resumen.py` | Heading: comprehensions. Code: `first_reject` for-loop. Output: `rejects [...]` / `codes [...]` / `by_id ...`. | Subtopic fails to demonstrate list/dict/set comps; confuses with search pattern (T3-A). |
| **I-06** | **P0** | Theory T4-A `traza_estado.py` | Code prints bare `i, m, total, n_pos` and `final (30, 2)` tuple form. Output shows table header `i \| m \| ...` and `final total= 30 n_pos= 2`. | Tracing pedagogy undermined when TRACE format ≠ run. |
| **I-07** | **P0** | Theory T4-B `costo_off_by_one.py` | Code only returns linear/quad counts. Output invents `last ok c` and `IndexError en len(xs)...`. | Off-by-one IndexError is promised but never executed; student never sees the exception pattern. |
| **I-08** | **P0** | iDo **S04-T1-A-DEMO** | Code: `mayores_igual_18` listcomp → ages ≥18. Output: `C001 edad= 30`…`range → [0,1,2]`. | Demo does not show `for`+`range` as description claims; uses comprehension early. |
| **I-09** | **P0** | iDo **S04-T2-A-DEMO** | Code returns list only; output adds `indice final 3`. | Partial desync; index-termination story is invisible in code. |
| **I-10** | **P0** | iDo **S04-T2-B-DEMO** | Description: *“continue salta vacíos; **break** corta en ERROR fatal”*. Code: `if not ln or ln.startswith("ERROR"): **continue**` — never breaks; keeps `ok:3`. Claimed output: `fatal, stop` / `kept ['ok:1','ok:2']`. Actual: `['ok:1','ok:2','ok:3']` + `ok True`. | **Wrong teaching of break vs continue** — high-severity conceptual bug at beginner level. |
| **I-11** | **P0** | iDo **S04-T3-A-DEMO** | Code prints tally dict only. Output claims `n 5 tasa_reject 0.4`. | Rate with correct denominator (LO + gate) not shown. |
| **I-12** | **P0** | iDo **S04-T3-B-DEMO** | Code: `ids_by_status(rows, "accept")` → `['C1']`. Output: `['C2','C3'] tasa 0.666...` (rejects + rate). | Output contradicts code and “rejects” story in `why`. |
| **I-13** | **P0** | iDo **S04-T4-A-DEMO** | Code prints bare triples; output has header `i flag n_ok` and `FINAL 3`. | TRACE format desync. |
| **I-14** | **P0** | iDo **S04-T4-B-DEMO** | Code: `print(steps(4))` → `(4,16)`. Output: `linear 4 quad 16` + `skipped_first [20,30]`. | Off-by-one `range(1,len)` lesson missing from code. |
| **I-15** | **P1** | Theory T1-A + iDo T1-A | List comprehensions appear before T3-B. E1 explicitly says “no uses comprehension todavía”. | Progressive disclosure breach; cognitive load spike; undermines later “when to use comprehension”. |
| **I-16** | **P1** | jobRelevance L15–16 | *“Id legacy `functions-modules` se conserva; el path V3 es…”* | Curriculum/dev meta in learner-facing job blurb. |
| **I-17** | **P1** | Theory map heading + paragraphs L28–32 | *“En V3, **S04 no es el path principal de decorators…”*; *“Esos temas viven en **S10**…”* | Students don’t need versioning history; dilutes “why iteration”. |
| **I-18** | **P1** | Callout L35–39 | *“Contenido reubicado conceptualmente”* · *“referencia histórica en el historial del repo”* · S10/S11 pointers | Explicit developer/redirection note in UI. |
| **I-19** | **P1** | weDo **S04-T4-A-E2** | Instruction: *“el contador `n` se incrementa **dos veces** por fila”*. Starter: single `n += 1` + **`print(99)` hardcode**; `# DEFECT: hardcode`. | Instruction and defect disagree; transfer of “double count” skill fails. |
| **I-20** | **P1** | weDo **S04-T4-B-E2** | Instruction: code *“hace IndexError”*. Starter: `print(data[i] if i < len(data) else "OOB")` — **never IndexError**. | Softened bug hides the failure mode the lesson names. |
| **I-21** | **P1** | youDo starter L1563+ | Repeated *“# Contrato: corrige el DEFECT del starter”* above `raise NotImplementedError` (no concrete DEFECT). | Template leftover; less actionable than real stub comments. |
| **I-22** | **P2** | weDo feedback L701 | *“columnas **desalinedas**”* | Typos in ES-PE; should be *desalineadas*. |
| **I-23** | **P2** | Theory T1-A vs gold depth | Paragraphs good; but code sample is too thin vs multi-paragraph claims (for + range + no-mutate). | Worked example under-delivers relative to prose. |
| **I-24** | **P2** | iDo T1-B | Code/output **aligned** (good control). Slight risk: `zip_strict` reinvented — acceptable with note for 3.10+. | Keep as gold pattern for other demos. |
| **I-25** | **P2** | Self-check coverage | 5 solid MCQs; no item on **centinela/while termination** or **enumerate start=1**. | Mild gap vs 8 subtopics; still fair for unlock. |
| **I-26** | **P2** | weDo starters all leak `# DEFECT: ...` | Intentional defect labels (CASO pattern). | Acceptable if course convention; optional soften to *“BUG: …”* without internal audit jargon. |
| **I-27** | **P3** | File name `s04-functions-modules.ts` vs title | Legacy filename vs V3 topic. | Not learner-visible; OK if id frozen; document only in graph memory. |
| **I-28** | **P2** | Cognitive density | 18h + 24 exercises + capstone close is heavy for pure loops. | Scaffolding E1→E3 helps; still long for Principiante if demos confuse. |
| **I-29** | **P1** | Trust vs prior audits | `S04_AUDIT.json` high_issue_count 0; PA rank 9.55 | False green may block fixer priority; Explorer overrides. |

**Issue count (actionable unique items for Fixer):** **24** primary (I-01…I-23, I-25, I-28–I-29 grouped as findings; code desyncs count as 14 P0 nodes + supporting).  
**For sidecar `issue_count`:** **24**.

---

## 4. Meta-Leak Report

Exact learner-facing strings that read as **developer / curriculum-version / repo** notes (not pure pedagogy):

| # | Location | Exact leaked / meta text | Recommendation |
|---|----------|--------------------------|----------------|
| M-1 | `jobRelevance` | `Id legacy \`functions-modules\` se conserva; el path V3 es **Iteración y resúmenes transaccionales** (for/while, enumerate/zip, conteos, complejidad).` | Rewrite as pure workplace value of batch processing; drop legacy id + V3. |
| M-2 | Theory map P1 | `En V3, **S04 no es el path principal de decorators, pathlib packaging ni datetime avanzado**. Esos temas viven en **S10** (módulos/CLI) y otras secciones.` | Replace with positive scope: “En esta sección dominas… Los decorators/CLI se ven más adelante.” Optional soft forward link without “V3/no es el path”. |
| M-3 | Callout title | `Contenido reubicado conceptualmente` | Rename e.g. `Alcance de esta sección` / `Qué aprenderás aquí`. |
| M-4 | Callout body | `Material legado de esta sección (decorators, pathlib packaging, datetime timezone, empaquetado profesional) **no es el camino del estudiante en S04 V3**. Se conserva como referencia histórica en el historial del repo.` | Delete “legado / historial del repo / V3”. Keep only: target = Client Intake CP-N1-A; modules/CLI later. |
| M-5 | Callout body (cont.) | `Decorators/CLI llegan conceptualmente en S10; OOP de dominio en S11.` | Soft “más adelante en el curso” without section numbers **or** keep S10/S11 only if the UI consistently cross-links (still avoid “legado”). |
| M-6 | youDo starter | `# Contrato: corrige el DEFECT del starter` (×3) | Replace with concrete TODOs per function (`# TODO: implementar validación tri-estado`, etc.). |

**Not counted as meta-leaks (intentional pedagogy / brand):**

- `CASO-LIM-004` lab id (consistent with S02/S03 case ids).  
- `# DEFECT:` in exercise starters when the exercise *is* a defect-fix (course convention).  
- Gate names `CP-N1-A` (learner-facing milestone).  
- Technical English terms (`zip`, `strict`, `O(n)`).

**meta_leak_count (sidecar):** **6** (M-1…M-6).

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 Connective tissue & narrative flow

**Strengths**

- Bridge S03 (per-record rules) → S04 (batch loop + rates) → S05 (functions/contracts) is explicit in youDo context and jobRelevance (once meta is stripped).  
- Pedagogical order T1→T4 matches industry loop curricula (Py4E: update → while → break/continue → for → counting/summing; then comps & complexity as extras).  
- Domain thread (synthetic client rows, accept/reject/review, raw conservation) is coherent and interview-relevant for LATAM data onboarding.

**Weaknesses**

- Opening map spends scarce beginner attention on **what the section is *not*** (decorators, packaging) rather than a worked micro-story of one batch.  
- Stale demo outputs break narrative continuity: theory claims “tasa 0.3333” while code never divides.  
- Title/id mismatch (`functions-modules`) is invisible on site card (good) but confuses maintainers and some deep links.

### 5.2 I Do / We Do / You Do fidelity

| Layer | Design intent | Actual fidelity |
|-------|---------------|-----------------|
| **I Do** | 8 demos, one per subtopic, browser-pyodide | Structure OK; **content integrity fail** on 7/8 demos (T1-B mostly clean). Descriptions/`why` often describe a *better* demo than the code. |
| **We Do** | E1 guided → E2 independent → E3 transfer × 8 | **Best layer of the section.** Hints, edgeCases, solution outputs largely honest. Exceptions: T4-A-E2, T4-B-E2. |
| **You Do** | Capstone close CP-N1-A | Strong contracts, rubric weights sensible, tests for empty batch & raw. Weak: NotImplemented + generic DEFECT comments; no sample expected summary numbers for the 3-row fixture (assert is loose on statuses). |

**Gradual release gap:** Because iDo outputs lie, students enter weDo without a trustworthy model → higher dependence on solutionCode (learning by copy).

### 5.3 Cognitive load & progressive disclosure

| Topic order (stated) | Risk |
|----------------------|------|
| for/range → enumerate/zip → while → break/continue → counters → comps → trace → complexity | Good macro order. |
| Comprehension in T1-A theory/iDo | **Too early** (I-15). |
| `def` wrappers throughout | Consistent with S02/S03 demos; acceptable if treated as “named recipe” not formal function theory (S05). Mention once: “por ahora solo empaquetamos el ejemplo en `def`”. |
| zip strict + ValueError | Appropriate after silent zip; keep. |
| O(n²) + IndexError in same subtopic | Fine if demos actually show both (currently IndexError missing). |

### 5.4 Grammar & redaction (español peruano)

- Overall tone: clear, imperative, professional ES-PE with industry English terms — **good**.  
- Fix: **desalinedas → desalineadas** (I-22).  
- Soften anglicized curriculum jargon in map (“path”, “V3”, “Id legacy”).  
- Prefer *tú* consistency (already mostly imperative: “Prefiere”, “No mutes”).  
- Avoid scare quotes around section titles unless needed.

### 5.5 Exercise & exam alignment

- Self-check items align with: range exclusive, zip silent truncate, tasa denominator, continue, O(n²).  
- Gaps: while/centinela, enumerate start=1, break vs continue (especially given iDo bug — **must fix demo before relying on quiz**).  
- weDo E3 transfers are mostly real (zip_strict, cola+PAUSE, rewrite O(n), dict+tasa).  
- T3-A-E2 solution uses `round(..., 4)` matching tests — good.

### 5.6 Consistency with roadmap & previous sections

- Live curriculum card order matches SECTION_MAP (S04 iteration; S05 functions).  
- Same V3 retarget callout pattern as S02/S03 → fixers should apply a **shared template** for map callouts across early sections (graph note).  
- Forward ref to S10 CLI is honest for packaging; still meta-heavy.

### 5.7 External comparison (honest)

| Source | S04 relative quality |
|--------|----------------------|
| Py4E Ch.5 | S04 richer domain; Py4E **much** cleaner code/output fidelity and pure while pedagogy. |
| CS50P loops | Cleaner problem sets; less workplace situativity. |
| Kaggle Learn Python | Shorter drills; S04 deeper batch/rate narrative. |
| Python official tutorial | Authoritative API notes; S04 should keep docs links (already does). |

### 5.8 Accessibility / other

- TRACE tables in text help non-visual reasoning if prints match.  
- No real PII — compliant.  
- Estimated 18h is ambitious if student re-debugs every desynced demo.

---

## 6. Proposed GitHub-style Diffs

> Paths relative to repo root. **Do not apply in this Explorer run.**  
> Prefer: (1) rewrite `code` to produce the story, **or** (2) rewrite `output` to match code — never leave them mismatched. Recommended: **rewrite both** so the demo teaches the subtopic fully.

### Diff group A — Meta-leak cleanup (I-16, I-17, I-18, M-1…M-5)

```diff
--- a/src/lib/course/sections/s04-functions-modules.ts
+++ b/src/lib/course/sections/s04-functions-modules.ts
@@ jobRelevance
-    "En onboarding de data en bancos, fintech y retail en Perú, el motor de reglas (S03) debe correr sobre **lotes**: cientos de filas, centinelas END, continue/break y resúmenes. Id legacy `functions-modules` se conserva; el path V3 es **Iteración y resúmenes transaccionales** (for/while, enumerate/zip, conteos, complejidad).",
+    "En onboarding de data en bancos, fintech y retail en Perú, el motor de reglas (S03) debe correr sobre **lotes**: cientos de filas, centinelas END, continue/break y resúmenes con tasas honestas. Aquí dominas for/while, enumerate/zip, conteos O(n) y el cierre del Client Intake CP-N1-A.",
@@ theory[0]
-      heading: "De “Funciones & Módulos” a iteración y resúmenes (mapa de la sección)",
+      heading: "Mapa de la sección: iteración y resúmenes por lotes",
       paragraphs: [
-        "En V3, **S04 no es el path principal de decorators, pathlib packaging ni datetime avanzado**. Esos temas viven en **S10** (módulos/CLI) y otras secciones. Aquí el estudiante domina lo que el **cierre de CP-N1-A** necesita: recorrer **múltiples registros**, acumular contadores, evitar loops infinitos y reportar **tasas con denominadores correctos**.",
+        "En esta sección dominas lo que el **cierre de CP-N1-A** necesita: recorrer **múltiples registros**, acumular contadores, evitar loops infinitos y reportar **tasas con denominadores correctos**. Temas de empaquetado, CLI y decorators se abordan más adelante en el curso.",
@@ callout
-        title: "Contenido reubicado conceptualmente",
-        content:
-          "Material legado de esta sección (decorators, pathlib packaging, datetime timezone, empaquetado profesional) **no es el camino del estudiante en S04 V3**. Se conserva como referencia histórica en el historial del repo. El target de entrega es el **Client Intake & Data Quality Script** (gate CP-N1-A). Decorators/CLI llegan conceptualmente en S10; OOP de dominio en S11.",
+        title: "Alcance de esta sección",
+        content:
+          "El target de entrega es el **Client Intake & Data Quality Script** (gate CP-N1-A): lotes, contadores y tasas. No cubrimos decorators ni packaging aquí; cuando llegues a módulos/CLI y OOP de dominio, reutilizarás estos bucles sobre el mismo hilo de intake.",
```

### Diff group B — Theory T1-A honest for/range (I-01, I-15)

```diff
--- a/src/lib/course/sections/s04-functions-modules.ts
+++ b/src/lib/course/sections/s04-functions-modules.ts
@@ theory S04-T1-A code
-        code: `def filter_lima(filas):
-    return [f for f in filas if f.get("region") == "Lima"]
-
-filas = [
-    {"id": "C001", "region": "Lima"},
-    {"id": "C002", "region": "Cusco"},
-]
-print(filter_lima(filas))
-print("ok", True)
-`,
-        output: `C001 → Lima
-C002 → Cusco
-C003 → Arequipa
-ids con range: ['C001', 'C002', 'C003']
-range(1, 4): [1, 2, 3]`,
+        code: `filas = [
+    {"id": "C001", "region": "Lima"},
+    {"id": "C002", "region": "Cusco"},
+    {"id": "C003", "region": "Arequipa"},
+]
+for reg in filas:
+    print(f"{reg['id']} → {reg['region']}")
+
+ids = []
+for i in range(len(filas)):
+    ids.append(filas[i]["id"])
+print("ids con range:", ids)
+print("range(1, 4):", list(range(1, 4)))
+`,
+        output: `C001 → Lima
+C002 → Cusco
+C003 → Arequipa
+ids con range: ['C001', 'C002', 'C003']
+range(1, 4): [1, 2, 3]`,
```

### Diff group C — Theory T2-A real while (I-02)

```diff
--- a/src/lib/course/sections/s04-functions-modules.ts
+++ b/src/lib/course/sections/s04-functions-modules.ts
@@ while_centinela.py
-        code: `def read_until_blank(lineas):
-    out = []
-    for ln in lineas:
-        if ln == "":
-            break
-        out.append(ln)
-    return out
-
-lineas = ["C001|Lima", "C002|Cusco", "", "C003|Piura"]
-print(read_until_blank(lineas))
-print("ok", True)
-`,
-        output: `procesadas: ['C001|Lima', 'C002|Cusco']
-restante no leída: ['C003|Piura']`,
+        code: `lineas = ["C001|Lima", "C002|Cusco", "", "C003|Piura"]
+i = 0
+procesadas = []
+while i < len(lineas):
+    ln = lineas[i]
+    i += 1
+    if ln == "":
+        break
+    procesadas.append(ln)
+print("procesadas:", procesadas)
+print("restante no leída:", lineas[i:])
+`,
+        output: `procesadas: ['C001|Lima', 'C002|Cusco']
+restante no leída: ['C003|Piura']`,
```

### Diff group D — Theory T2-B output align + iteration count (I-03)

```diff
--- a/src/lib/course/sections/s04-functions-modules.ts
+++ b/src/lib/course/sections/s04-functions-modules.ts
@@ break_continue.py
-        code: `def clean_lines(raw_lines, max_n=100):
-    kept = []
-    for ln in raw_lines:
-        if not ln.strip() or ln == "SKIP":
-            continue
-        if ln == "END":
-            break
-        kept.append(ln)
-        if len(kept) >= max_n:
-            break
-    return kept
-
-raw_lines = ["  ", "C001|Lima", "SKIP", "C002|Cusco", "END"]
-print(clean_lines(raw_lines))
-print("ok", True)
-`,
-        output: `['C001|Lima', 'C002|Cusco']
-iteraciones efectivas del for: 5`,
+        code: `def clean_lines(raw_lines, max_n=100):
+    kept = []
+    iters = 0
+    for ln in raw_lines:
+        iters += 1
+        if not ln.strip() or ln == "SKIP":
+            continue
+        if ln == "END":
+            break
+        kept.append(ln)
+        if len(kept) >= max_n:
+            break
+    return kept, iters
+
+raw_lines = ["  ", "C001|Lima", "SKIP", "C002|Cusco", "END"]
+kept, iters = clean_lines(raw_lines)
+print(kept)
+print("iteraciones efectivas del for:", iters)
+`,
+        output: `['C001|Lima', 'C002|Cusco']
+iteraciones efectivas del for: 5`,
```

### Diff group E — Theory T3-A rates + first reject (I-04)

```diff
--- a/src/lib/course/sections/s04-functions-modules.ts
+++ b/src/lib/course/sections/s04-functions-modules.ts
@@ contadores_tasa.py
-        code: `def count_statuses(statuses):
-    counts = {"accept": 0, "reject": 0, "review": 0}
-    for s in statuses:
-        if s in counts:
-            counts[s] += 1
-    return counts
-
-statuses = ["accept", "reject", "accept", "review", "reject", "accept"]
-print(count_statuses(statuses))
-print("ok", True)
-`,
-        output: `total 6 reject 2 tasa 0.3333
-first_reject_idx 1`,
+        code: `statuses = ["accept", "reject", "accept", "review", "reject", "accept"]
+n_total = n_reject = 0
+first_reject_idx = None
+for i, s in enumerate(statuses):
+    n_total += 1
+    if s == "reject":
+        n_reject += 1
+        if first_reject_idx is None:
+            first_reject_idx = i
+tasa = n_reject / n_total if n_total else None
+print("total", n_total, "reject", n_reject, "tasa", round(tasa, 4))
+print("first_reject_idx", first_reject_idx)
+`,
+        output: `total 6 reject 2 tasa 0.3333
+first_reject_idx 1`,
```

### Diff group F — Theory T3-B real comprehensions (I-05)

```diff
--- a/src/lib/course/sections/s04-functions-modules.ts
+++ b/src/lib/course/sections/s04-functions-modules.ts
@@ comprehensions_resumen.py
-        code: `def first_reject(results):
-    for r in results:
-        if r["status"] == "reject":
-            return r["id"]
-    return None
-
-results = [
-    {"id": "C001", "status": "accept"},
-    {"id": "C002", "status": "reject"},
-]
-print(first_reject(results))
-print("ok", True)
-`,
-        output: `rejects ['C002', 'C004']
-codes ['accept', 'reject', 'review']
-by_id C002 reject`,
+        code: `results = [
+    {"id": "C001", "status": "accept"},
+    {"id": "C002", "status": "reject"},
+    {"id": "C003", "status": "review"},
+    {"id": "C004", "status": "reject"},
+]
+rejects = [r["id"] for r in results if r["status"] == "reject"]
+codes = sorted({r["status"] for r in results})
+by_id = {r["id"]: r["status"] for r in results}
+print("rejects", rejects)
+print("codes", codes)
+print("by_id", "C002", by_id["C002"])
+`,
+        output: `rejects ['C002', 'C004']
+codes ['accept', 'reject', 'review']
+by_id C002 reject`,
```

### Diff group G — Theory T4-A TRACE format (I-06)

```diff
--- a/src/lib/course/sections/s04-functions-modules.ts
+++ b/src/lib/course/sections/s04-functions-modules.ts
@@ traza_estado.py
-        code: `def running_total(montos):
-    total = 0
-    n_pos = 0
-    for i, m in enumerate(montos):
-        if m > 0:
-            total += m
-            n_pos += 1
-        print(i, m, total, n_pos)
-    return total, n_pos
-
-print("final", running_total([10, 0, -5, 20]))
-print("ok", True)
-`,
-        output: `i | m | total | n_pos
-0 | 10 | 10 | 1
-1 | 0 | 10 | 1
-2 | -5 | 10 | 1
-3 | 20 | 30 | 2
-final total= 30 n_pos= 2`,
+        code: `montos = [10, 0, -5, 20]
+total = 0
+n_pos = 0
+print("i | m | total | n_pos")
+for i, m in enumerate(montos):
+    if m > 0:
+        total += m
+        n_pos += 1
+    print(f"{i} | {m} | {total} | {n_pos}")
+print("final total=", total, "n_pos=", n_pos)
+`,
+        output: `i | m | total | n_pos
+0 | 10 | 10 | 1
+1 | 0 | 10 | 1
+2 | -5 | 10 | 1
+3 | 20 | 30 | 2
+final total= 30 n_pos= 2`,
```

### Diff group H — Theory T4-B show IndexError (I-07)

```diff
--- a/src/lib/course/sections/s04-functions-modules.ts
+++ b/src/lib/course/sections/s04-functions-modules.ts
@@ costo_off_by_one.py
-        code: `def complexity_demo(xs):
-    linear = 0
-    for _ in xs:
-        linear += 1
-    quad = 0
-    for _ in xs:
-        for __ in xs:
-            quad += 1
-    return linear, quad
-
-print(complexity_demo(["a", "b", "c"]))
-print("ok", True)
-`,
-        output: `linear 3 quadratic 9
-last ok c
-IndexError en len(xs): list index out of range`,
+        code: `xs = ["a", "b", "c"]
+linear = 0
+for _ in xs:
+    linear += 1
+quad = 0
+for _ in xs:
+    for __ in xs:
+        quad += 1
+print("linear", linear, "quadratic", quad)
+print("last ok", xs[len(xs) - 1])
+try:
+    print(xs[len(xs)])  # off-by-one: índice n no existe
+except IndexError as e:
+    print("IndexError en len(xs):", e)
+`,
+        output: `linear 3 quadratic 9
+last ok c
+IndexError en len(xs): list index out of range`,
```

### Diff group I — iDo demos (I-08…I-14) — critical pack

```diff
--- a/src/lib/course/sections/s04-functions-modules.ts
+++ b/src/lib/course/sections/s04-functions-modules.ts
@@ S04-T1-A-DEMO
-          code: `def mayores_igual_18(lote):
-    return [r for r in lote if r["edad"] >= 18]
-
-lote = [
-    {"id": "C001", "edad": 30},
-    {"id": "C002", "edad": 17},
-    {"id": "C003", "edad": 22},
-]
-print(mayores_igual_18(lote))
-print("ok", True)
-`,
-          output: `C001 edad= 30
-C002 edad= 17
-C003 edad= 45
-n= 3 range → [0, 1, 2]`,
+          code: `lote = [
+    {"id": "C001", "edad": 30},
+    {"id": "C002", "edad": 17},
+    {"id": "C003", "edad": 45},
+]
+for reg in lote:
+    print(reg["id"], "edad=", reg["edad"])
+n = len(lote)
+print("n=", n, "range →", list(range(n)))
+`,
+          output: `C001 edad= 30
+C002 edad= 17
+C003 edad= 45
+n= 3 range → [0, 1, 2]`,
@@ S04-T2-A-DEMO
-          code: `def read_until_end(buf):
-    i = 0
-    out = []
-    while i < len(buf):
-        line = buf[i]
-        i += 1
-        if line == "END":
-            break
-        out.append(line)
-    return out
-
-print(read_until_end(["Ana|Lima", "Luis|Cusco", "END", "ignorada"]))
-print("ok", True)
-`,
-          output: `['Ana|Lima', 'Luis|Cusco']
-indice final 3`,
+          code: `buf = ["Ana|Lima", "Luis|Cusco", "END", "ignorada"]
+i = 0
+out = []
+while i < len(buf):
+    line = buf[i]
+    i += 1
+    if line == "END":
+        break
+    out.append(line)
+print(out)
+print("indice final", i)
+`,
+          output: `['Ana|Lima', 'Luis|Cusco']
+indice final 3`,
@@ S04-T2-B-DEMO  # FIX break vs continue (I-10)
-          code: `def keep_ok_lines(lines):
-    kept = []
-    for ln in lines:
-        if not ln or ln.startswith("ERROR"):
-            continue
-        kept.append(ln)
-    return kept
-
-print(keep_ok_lines(["", "ok:1", "", "ok:2", "ERROR", "ok:3"]))
-print("ok", True)
-`,
-          output: `fatal, stop
-kept ['ok:1', 'ok:2']`,
+          code: `lines = ["", "ok:1", "", "ok:2", "ERROR", "ok:3"]
+kept = []
+for ln in lines:
+    if not ln:
+        continue  # salta vacíos
+    if ln.startswith("ERROR"):
+        print("fatal, stop")
+        break  # corta el lote
+    kept.append(ln)
+print("kept", kept)
+`,
+          output: `fatal, stop
+kept ['ok:1', 'ok:2']`,
@@ S04-T3-A-DEMO
-          code: `def tally(statuses):
-    counts = {"accept": 0, "reject": 0, "review": 0}
-    for s in statuses:
-        if s in counts:
-            counts[s] += 1
-    return counts
-
-print(tally(["accept", "reject", "review", "accept", "reject"]))
-print("ok", True)
-`,
-          output: `{'accept': 2, 'reject': 2, 'review': 1}
-n 5 tasa_reject 0.4`,
+          code: `statuses = ["accept", "reject", "review", "accept", "reject"]
+counts = {"accept": 0, "reject": 0, "review": 0}
+for s in statuses:
+    if s in counts:
+        counts[s] += 1
+n = len(statuses)
+tasa_reject = counts["reject"] / n if n else None
+print(counts)
+print("n", n, "tasa_reject", tasa_reject)
+`,
+          output: `{'accept': 2, 'reject': 2, 'review': 1}
+n 5 tasa_reject 0.4`,
@@ S04-T3-B-DEMO
-          code: `def ids_by_status(rows, status):
-    return [r["id"] for r in rows if r["status"] == status]
-
-rows = [
-    {"id": "C1", "status": "accept"},
-    {"id": "C2", "status": "reject"},
-]
-print(ids_by_status(rows, "accept"))
-print("ok", True)
-`,
-          output: `['C2', 'C3'] tasa 0.6666666666666666`,
+          code: `rows = [
+    {"id": "C1", "status": "accept"},
+    {"id": "C2", "status": "reject"},
+    {"id": "C3", "status": "reject"},
+]
+rejects = [r["id"] for r in rows if r["status"] == "reject"]
+tasa = len(rejects) / len(rows)
+print(rejects, "tasa", tasa)
+`,
+          output: `['C2', 'C3'] tasa 0.6666666666666666`,
@@ S04-T4-A-DEMO
-          code: `def count_true(flags):
-    n_ok = 0
-    for i, f in enumerate(flags):
-        if f:
-            n_ok += 1
-        print(i, f, n_ok)
-    return n_ok
-
-print("n_ok", count_true([True, False, True, True]))
-print("ok", True)
-`,
-          output: `i flag n_ok
-0 True 1
-1 False 1
-2 True 2
-3 True 3
-FINAL 3`,
+          code: `flags = [True, False, True, True]
+n_ok = 0
+print("i flag n_ok")
+for i, f in enumerate(flags):
+    if f:
+        n_ok += 1
+    print(i, f, n_ok)
+print("FINAL", n_ok)
+`,
+          output: `i flag n_ok
+0 True 1
+1 False 1
+2 True 2
+3 True 3
+FINAL 3`,
@@ S04-T4-B-DEMO
-          code: `def steps(n):
-    steps_linear = sum(1 for _ in range(n))
-    steps_quad = sum(1 for _ in range(n) for __ in range(n))
-    return steps_linear, steps_quad
-
-print(steps(4))
-print("ok", True)
-`,
-          output: `linear 4 quad 16
-skipped_first [20, 30]`,
+          code: `n = 4
+steps_linear = sum(1 for _ in range(n))
+steps_quad = sum(1 for _ in range(n) for __ in range(n))
+print("linear", steps_linear, "quad", steps_quad)
+vals = [10, 20, 30]
+skipped_first = []
+for i in range(1, len(vals)):  # omite el índice 0 — off-by-one de negocio
+    skipped_first.append(vals[i])
+print("skipped_first", skipped_first)
+`,
+          output: `linear 4 quad 16
+skipped_first [20, 30]`,
```

### Diff group J — WeDo defect alignment (I-19, I-20, I-22)

```diff
--- a/src/lib/course/sections/s04-functions-modules.ts
+++ b/src/lib/course/sections/s04-functions-modules.ts
@@ S04-T1-B-E2 feedback
-        feedback: "Ver el truncamiento una vez evita bugs de columnas desalinedas.",
+        feedback: "Ver el truncamiento una vez evita bugs de columnas desalineadas.",
@@ S04-T4-A-E2 starter (double increment, not hardcode)
-          code: `# CASO-LIM-004 · conteo filas
-# DEFECT: hardcode
-filas = ["a", "b", "c"]
-n = 0
-for f in filas:
-    n += 1
-print(99)
-print('ok', True)
-`,
+          code: `# CASO-LIM-004 · conteo filas
+# DEFECT: n se incrementa dos veces por fila
+filas = ["a", "b", "c"]
+n = 0
+for f in filas:
+    n += 1
+    n += 1  # bug: doble conteo
+print(n)
+print('ok', True)
+`,
@@ S04-T4-B-E2 starter (real IndexError)
-          code: `# CASO-LIM-004 · off-by-one
-# DEFECT: range(1, len+1) IndexError
-data = ["r0", "r1", "r2"]
-for i in range(1, len(data) + 1):
-    print(data[i] if i < len(data) else "OOB")
-print('ok', True)
-`,
+          code: `# CASO-LIM-004 · off-by-one
+# DEFECT: range(1, len+1) provoca IndexError en el último índice
+data = ["r0", "r1", "r2"]
+for i in range(1, len(data) + 1):
+    print(data[i])
+print('ok', True)
+`,
```

### Diff group K — youDo starter comments (I-21, M-6)

```diff
--- a/src/lib/course/sections/s04-functions-modules.ts
+++ b/src/lib/course/sections/s04-functions-modules.ts
@@ validate_record / process_batch / format_report
-    # Contrato: corrige el DEFECT del starter
-    raise NotImplementedError
+    # TODO: devolver {status, fields} con accept|reject|review por campo (S03)
+    raise NotImplementedError
@@ process_batch
-    # Contrato: corrige el DEFECT del starter
-    raise NotImplementedError
+    # TODO: un solo for O(n); contadores; tasa_reject None si vacío; raw intacto
+    raise NotImplementedError
@@ format_report
-    # Contrato: corrige el DEFECT del starter
-    raise NotImplementedError
+    # TODO: texto stdout con n_total, contadores y tasa
+    raise NotImplementedError
```

### Diff group L — Optional selfCheck enrichment (I-25)

```diff
--- a/src/lib/course/sections/s04-functions-modules.ts
+++ b/src/lib/course/sections/s04-functions-modules.ts
@@ selfCheck.questions (append after existing or replace weakest)
+      {
+        question: "En un while con centinela \"END\", ¿qué debe pasar cada iteración para no colgarte?",
+        options: [
+          "Nada: Python corta solo",
+          "Actualizar el estado (p. ej. avanzar el índice) y comprobar el centinela",
+          "Usar solo continue",
+          "Multiplicar n_total por 2",
+        ],
+        correctIndex: 1,
+        explanation:
+          "Sin variable de control que cambie (o break en centinela), la condición puede quedar siempre verdadera → loop infinito.",
+      },
```

---

## 7. Recommended Priority Order for Fixing

| Priority | Items | Why |
|----------|-------|-----|
| **1 — Immediate (P0)** | **I-10** S04-T2-B-DEMO break/continue | Actively teaches the wrong control-flow semantics. |
| **2 — Immediate (P0)** | **I-01…I-09, I-11…I-14** all theory+iDo code/output pairs | Trust collapse; students who Run learn a different lesson. |
| **3 — High (P1)** | **I-02** theory while-with-for; **I-05** comps sample; **I-15** early listcomp | Subtopic fidelity + progressive disclosure. |
| **4 — High (P1)** | **I-16…I-18 / M-1…M-5** meta-leaks | User-facing redaction; same pattern as S02/S03. |
| **5 — High (P1)** | **I-19, I-20** weDo defect honesty | E2 tasks that don’t match the named bug. |
| **6 — Medium (P2)** | **I-21/M-6, I-22, I-25** youDo TODOs, typo, quiz gap | Polish after demos green. |
| **7 — Process** | **I-29** discard auto rank 9.55 / empty audit | Prevent premature “gold” in ledgers. |
| **8 — Optional** | **I-26–I-28** DEFECT jargon, filename legacy, hour density | After integrity green. |

**Fixer acceptance criteria (S04)**

1. For every theory `code` and every iDo `code`, executing the snippet yields **byte-for-byte** (or documented normalized) match to `output`.  
2. S04-T2-B-DEMO: empty → continue; ERROR → break; `ok:3` never kept.  
3. Theory T2-A uses `while`; T3-B shows comprehensions; T1 has no listcomp (or T3-B moved earlier with explicit bridge).  
4. No learner-visible “V3 / legacy id / historial del repo / contenido reubicado”.  
5. T4-A-E2 / T4-B-E2 starters match their defect stories.  
6. Re-run human skim of live hash `#functions-modules` after deploy.

---

## 8. Graph Memory Update notes

Suggested updates for shared graph / residual context (Explorer does not write product code):

```text
NODE section:S04
  id: functions-modules
  title: Iteración y resúmenes transaccionales
  gate: CP-N1-A
  quality_score_explorer: 6.2
  structural: 8 theory + 8 iDo + 24 weDo + youDo + 5 MCQ = PASS structure
  integrity: FAIL (theory+iDo code/output desync cluster)
  p0_cluster: code_output_desync_S04 (I-01..I-14, especially I-10 break/continue)
  meta_leaks: jobRelevance legacy id; V3 map; callout reubicación/repo history (pattern shared S02/S03)
  edges:
    S03.rules_engine → S04.batch_loop → S05.functions_contracts
    S04.tasa_denominator → CP-N1-A
    S04.zip_alignment → data_quality_tests
  anti_patterns_observed:
    - stale_output_from_prior_demo (print theater)
    - subtopic_heading_vs_code_mismatch (while taught with for; comps taught with search)
    - early_listcomp_before_T3B
    - auto_audit_false_green (S04_AUDIT ACCEPT, PA 9.55)
  fixer_entry: audits/explorer_reports/S04_EXPLORER_REPORT.md
  do_not_trust: dossiers/S04_DONE.md soft ranks; paragraph_analysis auto 9.55
```

**Residual ledger suggestion:** open residual `S04_CODE_OUTPUT_DESYNC` severity high; `S04_META_V3_MAP` medium (batch with S02/S03 map template).

**STORM note:** Prior STORM n=4 research sources are fine; **synthesis did not enforce executable oracle**. Next loop must include “run every snippet” as a gate.

---

## Appendix — Inventory (for Fixer navigation)

| Block | subtopicId | Notes |
|-------|------------|-------|
| Theory map | (none) | Meta-heavy |
| for/range | S04-T1-A | Desync + early comp |
| enumerate/zip | S04-T1-B | Theory+iDo mostly good |
| while/centinela | S04-T2-A | for instead of while |
| break/continue | S04-T2-B | iDo conceptual bug |
| contadores | S04-T3-A | Missing tasa in samples |
| comprehensions | S04-T3-B | Wrong sample code |
| traza | S04-T4-A | Format desync; E2 defect mismatch |
| costo/OBO | S04-T4-B | Missing IndexError; E2 softened |
| youDo | CP-N1-A | Strong contract, weak TODOs |
| selfCheck | 5 Q | Align after demo fixes |

---

This is the complete Explorer report for Section 4. Ready for the Fixer prompt.
