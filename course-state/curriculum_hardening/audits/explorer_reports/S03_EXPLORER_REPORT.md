# S03 Explorer Report — Decisiones y reglas de validación

**Auditor role:** Multi-agent Curriculum Auditor (Explorer only; no content fixes applied)  
**Platform section id:** `data-structures`  
**Live URL:** https://pillb.github.io/pyarcana/#data-structures  
**Repo source:** `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s03-data-structures.ts`  
**Roadmap title (V3):** Decisiones y reglas de validación  
**UI shortTitle:** Decisiones & Reglas  
**Case fixture:** `CASO-LIM-003` · Capstone increment: CP-N1-A rules engine  
**Analysis date:** 2026-07-24  
**Methods:** Pre-round pedagogy research (GRR / I–We–You, cognitive load, Python conditionals best practices) · live site surface · full source read · gold-standard checklist · visible-paragraph capture · competitive benchmark (CS50P, Py4E, Python docs, PEP 636)

---

## 1. Section Identification & Scope

| Field | Value |
|--------|--------|
| Index | 3 |
| `id` (hash) | `data-structures` *(legacy slug; topic is control-flow / rules, not collections)* |
| Source file | `src/lib/course/sections/s03-data-structures.ts` |
| Title | Decisiones y reglas de validación |
| Tagline | Booleanos, control de flujo y reglas accept/reject/review sin confundir ausencia con falsy |
| Level / hours | Principiante · 18h |
| Phase | 0 (foundations) |
| Structural inventory | Theory map + **8** subtopics (T1–T4 × A/B) · **8** I Do demos · **24** We Do (E1/E2/E3) · You Do project · **5** selfCheck MCQs · resources (docs/books/courses) |

### Topic map (learner path)

1. **T1-A** Comparaciones y `in`  
2. **T1-B** Truthiness vs ausencia (`None` ≠ `0` ≠ `""`)  
3. **T2-A** `if` / `elif` / `else` (una rama dominante)  
4. **T2-B** Guard clauses y ramas muertas  
5. **T3-A** Rangos + allowlists (tri-estado)  
6. **T3-B** Decision tables y `match`/`case`  
7. **T4-A** Invariantes + ejemplos canónicos  
8. **T4-B** Mensajes accionables + tests por rama  

**Narrative spine:** motor de reglas de intake (`validate_field` / `validate_record`) sobre registro sintético de cliente → incremento CP-N1-A.

**Out of scope for this Explorer run:** sections other than S03; applying fixes; non-S03 product files.

**Live confirmation:** Curriculum card shows “Sección 3 · Decisiones & Reglas” with the validation-focused tagline. Visible theory paragraphs on the deployed capture (`visible_paragraphs/s03_data-structures.json`) match the TS theory prose (including V3/meta phrasing). SPA hash navigation does not expose a separate static HTML dump; source TS is treated as authoritative for exercises/I Do/You Do, with live theory cross-check via visible-paragraph export + homepage section listing.

---

## 2. Executive Summary of Quality

### Score: **7.5 / 10**

### Verdict

S03 is a **strong pedagogical redesign** of a historically misnamed “data structures” slot into a **workplace-authentic rules engine** (tri-estado accept/reject/review, `None` vs falsy, guards, decision tables). Structure meets the gold skeleton (9 theory blocks, 8/8/24, You Do + selfCheck + resources). Domain framing (Perú synthetic intake, CASO-LIM-003, CP-N1-A) and progressive I→We→You scaffolding are among the best early-section patterns in the course.

However, the section is **not gold-ready** for a Fixer pass without addressing:

1. **P0 integrity bugs:** at least three demos where **embedded `output` does not match `code`** — fatal for a course that insists “no inventes resultados.”  
2. **P1 meta-leak:** learner-facing text still talks about **V3 roadmap relocation**, **legacy Sales Log Parser**, and **gate V3** language.  
3. **P1 You Do shell:** starters raise `NotImplementedError` instead of a single runnable defect (gold anti-stub rule).  
4. **P2 exercise coherence:** dead-branch lab and nested-refactor lab send mixed signals vs. instructions.

**Comparative stance:** Ahead of CS50P/Py4E on *data-quality decisioning*; behind them on *demo honesty* when code≠output. Prior dossier claims of PA ≥ 9.55 are **overruled** by this Explorer’s evidence on demo desync and meta-text.

---

## 3. Detailed Issue Registry

Severity key: **P0** = trust/correctness blocker · **P1** = high pedagogy or redaction impact · **P2** = medium polish · **P3** = low / optional.

---

### ISSUE-01 — Theory T1-A code/output desync  
**Severity:** P0  
**Location:** `theory[1]` · `comparaciones_intake.py`  
**Evidence (code prints 3 values; output lists 6 `True` lines):**

```python
# code (abbreviated)
print("region_ok", region_ok(region, ALLOWED))
print("monto_pos", monto > 0)
print("ok", True)
```

```
# declared output
True
True
True
True
True
True
```

**Pedagogical impact:** Learner who runs the snippet (Pyodide/local) sees `region_ok True`, `monto_pos True`, `ok True` — not six bare booleans. Undermines “Observa la salida embebida; no inventes resultados.”  
**Dimension:** Exercise/demo integrity · Technical writing  

---

### ISSUE-02 — I Do S03-T1-A-DEMO code/output desync  
**Severity:** P0  
**Location:** `iDo.steps[0]` · `S03-T1-A-DEMO`  
**Evidence:** Code only executes:

```python
print("region == 'Lima'", region == "Lima")
print("checks", region_and_monto(region, monto, ALLOWED))
print("ok", True)
```

Declared `output` lists seven comparison lines (`region != 'Piura'`, `monto >= 1000`, membership, chained range, etc.) that **do not exist** in the code.  
**Pedagogical impact:** Demo is print-theater / ghost-output; “why” text promises four comparisons + two membership checks that the code never shows.  
**Dimension:** I Do fidelity · Cognitive trust  

---

### ISSUE-03 — I Do S03-T3-B-DEMO code/output desync  
**Severity:** P0  
**Location:** `iDo.steps[5]` · `S03-T3-B-DEMO`  
**Evidence:** Code implements only `status_if` and prints `c, "→", status_if(c)` plus `print("ok", True)`.  
Declared output is the dual-implementation format:

```
OK accept accept same= True
MISSING review review same= True
...
```

**Pedagogical impact:** Description says “Misma tabla en if/elif y en match”; code never runs `match` or a `same=` check. Learner cannot reconcile.  
**Dimension:** I Do fidelity · Progressive disclosure of `match`  

---

### ISSUE-04 — Map paragraph + callout leak curriculum versioning / relocation notes  
**Severity:** P1 (meta-leak)  
**Location:** `theory[0]` paragraphs + callout  
**Evidence quotes (learner-visible):**

> “En V3, **S03 no es el path principal de list/dict/CSV/JSON**…”

> Callout title: **“Contenido reubicado conceptualmente a S6”**  
> “…**no es el camino del estudiante en S03 V3**. Se conserva como referencia histórica en el historial del repo…”

Also heading: **“De ‘Data Structures’ a decisiones de validación”** — exposes internal rename.

**Pedagogical impact:** Breaks immersion; reads as release notes for authors. Beginners don’t need V3/repo-history. Same class of leak as S02’s “Fuera de alcance S02 V3” pattern.  
**Dimension:** Meta-text · Connective tissue  

---

### ISSUE-05 — “gate V3” internal product language in theory and We Do  
**Severity:** P1 (meta-leak / tone)  
**Location:** T1-B theory; We Do feedback T1-B-E3  
**Evidence:**

> “El error canónico del **gate V3**: **`if monto:` trata `0` como “no hay monto”**.”

> Feedback: “Reescribir el test de presencia con is None es el fix del **gate V3**.”

**Pedagogical impact:** “Gate V3” is internal curriculum engineering jargon. Prefer “error canónico del intake / CP-N1-A” without version tags.  
**Dimension:** Meta-text · Brand voice (ES-PE learner)  

---

### ISSUE-06 — You Do context still narrates legacy replacement  
**Severity:** P1 (meta-leak)  
**Location:** `youDo.context`  
**Evidence:**

> “**Reemplaza el legado “Sales Log Parser”** como entrega de S03…”

**Pedagogical impact:** Students never saw the old deliverable on the live V3 path; this is changelog prose. Weakens motivation frame.  
**Dimension:** Meta-text · You Do framing  

---

### ISSUE-07 — You Do starter is NotImplementedError shell (anti-gold stub)  
**Severity:** P1  
**Location:** `youDo.starterCode`  
**Evidence:** Four functions only `raise NotImplementedError` with comments “corrige el DEFECT del starter” but **no defective implementation**. Comments mention DEFECT without code to fix.  
**Pedagogical impact:** Gold checklist requires “Real scaffold with **one clear defect** to fix — not empty.” We Do uses excellent DEFECT starters; You Do regresses to empty shell → higher drop-off and weaker portfolio path.  
**Dimension:** Exercise quality · You Do  

---

### ISSUE-08 — Widespread `print('ok', True)` theater in We Do starters  
**Severity:** P2  
**Location:** Nearly all 24 starterCode blocks end with `print('ok', True)` while the body still contains the defect.  
**Evidence pattern:**

```python
# DEFECT: ...
...
print('ok', True)
```

**Pedagogical impact:** Gold anti-pattern: “print theater” / false success signal. Learners may think the exercise is “done” when output shows `ok True` before the fix.  
**Dimension:** Exercise quality · Cognitive honesty  

---

### ISSUE-09 — S03-T2-B-E3 dead-branch exercise is pedagogically self-contradictory  
**Severity:** P1  
**Location:** `weDo` id `S03-T2-B-E3`  
**Evidence:**

- Instruction: identify dead `elif` and fix so `x == 0` is reachable.  
- Starter comment: `# DEFECT: se alcanza, pero rama confusa` — admits the branch **is** reached.  
- Solution first prints that `elif x==0` **SÍ se alcanza**, then shows a *different* truly dead pattern (`if x >= 0` / `elif x > 5`).

**Pedagogical impact:** E3 (transfer) should crystallize the concept; here the starter’s “dead” branch is live, so the learning target moves mid-solution. High cognitive thrash.  
**Dimension:** Pedagogical structure · Cognitive load  

---

### ISSUE-10 — S03-T2-B-E2 “same semantics as nested” but solution rewrites nested semantics  
**Severity:** P2  
**Location:** `weDo` id `S03-T2-B-E2`  
**Evidence:** Starter nested maps `None → reject`, `0` via `m > 0` path → effectively **reject** for 0. Instruction: “misma semántica: None review … 0–10000 accept”. Solution **repairs nested first**, then guards — so learner cannot compare “guards == broken nested” as stated.  
**Pedagogical impact:** Good learning goal (refactor to guards) blurred by changing the oracle mid-air.  
**Dimension:** Exercise alignment  

---

### ISSUE-11 — Inconsistent result shapes across the section (str vs dict)  
**Severity:** P2  
**Location:** Cross-cutting theory/I Do/We Do  
**Evidence:** Mix of return types: `"accept"` strings, `"review: ausente"` free strings, `{"status","code"}`, full `{"status","code","message"}`. You Do finally standardizes on dict.  
**Pedagogical impact:** Intentional progression can work if framed; without an explicit “shape evolution” map, learners copy the wrong shape into the You Do.  
**Dimension:** Progressive disclosure · Consistency  

---

### ISSUE-12 — Platform id / filename still `data-structures`  
**Severity:** P2 (consistency / discoverability)  
**Location:** `id: 'data-structures'`, file `s03-data-structures.ts`, SECTION_MAP, live hash  
**Evidence:** Title and content are control-flow/rules; S06 owns collections. Hash `#data-structures` misleads anyone deep-linking from outside.  
**Pedagogical impact:** Not learner prose, but roadmap/UI consistency and external SEO/docs. Rename is larger product change; at minimum learner-facing map should not spotlight the old English title.  
**Dimension:** Roadmap consistency  

---

### ISSUE-13 — Theory T1-A under-teaches what the output claims  
**Severity:** P2  
**Location:** `theory[1]` code block (related to ISSUE-01)  
**Evidence:** Prose teaches chaining, `in`, `is` vs `==`; code only shows membership + `monto > 0` + dead `print("ok", True)`. No chained comparison demo in theory code.  
**Pedagogical impact:** Mechanism layer incomplete relative to paragraphs (Anchor without full Worked example).  
**Dimension:** Theory depth · Gold “computes the concept”  

---

### ISSUE-14 — Bloom taxonomy meta in learner feedback  
**Severity:** P3  
**Location:** `S03-T2-B-E3` feedback  
**Evidence:** “Detectar dead code en review es **Analizar (Bloom)**, no solo Aplicar sintaxis.”  
**Pedagogical impact:** Mild instructor-speak; optional strip for pure learner voice.  
**Dimension:** Meta-text (soft) · Tone  

---

### ISSUE-15 — English/tech mixed into DEFECT/comments without ES gloss  
**Severity:** P3  
**Location:** Multiple starters (`hardcode`, `maintainability` in feedback, `outlier`, `catch-all` in theory)  
**Evidence examples:** `# DEFECT: resultados invertidos / hardcode`; feedback “maintainability medible”.  
**Pedagogical impact:** Course allows industry English; “hardcode” / “maintainability” as sole tokens in ES prose slightly jar ES-PE redaction bar. Low severity.  
**Dimension:** Redaction · Bilingual policy  

---

### ISSUE-16 — Self-check covers core gates but omits guard-order / message quality  
**Severity:** P2  
**Location:** `selfCheck` (5 items)  
**Evidence:** Items cover `is None`, if/elif exclusivity, `or` return value, allowlist set, match vs if. **Missing:** zero-valid monto scenario (the section’s signature gate), guard-before-compare (`None` then `<`), actionable message shape.  
**Pedagogical impact:** Active recall under-samples the highest-stakes misconception the section claims to fix.  
**Dimension:** Exam alignment  

---

### ISSUE-17 — Dense production concepts in early Principiante (cognitive load)  
**Severity:** P2  
**Location:** Whole section (18h, codes, decision tables, match, invariants, tests)  
**Evidence:** Learner after S02 gets tri-estado QA policies, guard style, match (3.10+), test matrices, and portfolio README invariants in one section. External peers (CS50P W1, Py4E ch.3) stay on pure conditionals longer.  
**Pedagogical impact:** Excellent authenticity; risk of overload for true novices. Mitigated by 8 demos + 24 exercises but still high extrinsic load from simultaneous “syntax + QA policy.”  
**Dimension:** Cognitive load · Progressive disclosure  

---

### ISSUE-18 — `typing.Any` / `from __future__ import annotations` in You Do without teaching  
**Severity:** P3  
**Location:** `youDo.starterCode`  
**Evidence:** Imports and annotations appear without S03 theory on typing.  
**Pedagogical impact:** Mild progressive-disclosure stretch; often copy-paste noise for beginners. Prefer untyped or `object` if typing not taught.  
**Dimension:** Progressive disclosure  

---

### ISSUE-19 — Theory map lacks a runnable “section contract” mini-demo (S02 peer)  
**Severity:** P3  
**Location:** `theory[0]`  
**Evidence:** S02 map includes `section_contract()` code+output; S03 map is prose-only + meta callout.  
**Pedagogical impact:** Weaker anchor/worked-example layer at section open vs gold peer S02.  
**Dimension:** Comparative quality vs early gold sections  

---

### ISSUE-20 — Minor: theory `validate_edad` output prints unquoted `"25"`  
**Severity:** P3  
**Location:** T2-B theory output  
**Evidence:** Output line `25 → {'status': 'reject'...}` for input `"25"` (str) looks identical to int 25.  
**Pedagogical impact:** Ambiguous reading of type-reject case. Prefer `repr` in printed examples (as T1-B demo does).  
**Dimension:** Clarity  

---

### ISSUE-21 — Connective tissue: jobRelevance excellent; intra-section bridges thin  
**Severity:** P3  
**Location:** Between subtopics  
**Evidence:** Each block is strong in isolation; few explicit “ya viste X; ahora Y cierra el motor” sentences between T2→T3→T4 beyond the opening map.  
**Pedagogical impact:** Minor; spine is still clear via repeated validate_* motifs.  
**Dimension:** Connective tissue  

---

## 4. Meta-Leak Report

| # | Exact / near-exact leaked text | Location | Learner impact | Recommended disposition |
|---|--------------------------------|----------|----------------|-------------------------|
| M1 | “En V3, **S03 no es el path principal de list/dict/CSV/JSON**…” | theory[0] p1 | High — version/roadmap meta | Rewrite as learner-facing scope: “En esta sección no profundizamos en list/dict/CSV/JSON (eso viene en colecciones/archivos). Aquí…” |
| M2 | Callout **“Contenido reubicado conceptualmente a S6”** + “Material legado… historial del repo… S03 V3” | theory[0] callout | High — author changelog | Replace with short **“Fuera de alcance de esta sección”** without repo history |
| M3 | Heading **“De ‘Data Structures’ a decisiones de validación”** | theory[0] heading | Medium — old product name | Rename to e.g. “Mapa: de booleanos al motor de reglas” |
| M4 | “error canónico del **gate V3**” | T1-B theory | Medium | “error canónico del intake / CP-N1-A” |
| M5 | “fix del **gate V3**” | T1-B-E3 feedback | Medium | Same as M4 |
| M6 | “Reemplaza el legado **Sales Log Parser**…” | youDo.context | High | Drop legacy name; open with current mission only |
| M7 | “Analizar (**Bloom**)” | T2-B-E3 feedback | Low | Optional remove taxonomy label |
| M8 | Ubiquitous `# DEFECT:` markers | all We Do starters | Low–Medium | Keep if intentional scaffold **pattern** (consistent course-wide); else soften to `# BUG:` learner-facing. **Not** counted as fatal if documented as course convention — note for Fixer consistency with S01–S02 |

**meta_leak_count (hard learner-facing product meta): 6** (M1–M6). M7 soft; M8 convention.

**No findings:** AI-to-developer chat dumps, TODO/FIXME/STUB markers in learner prose, real PII, or placeholder “TBD” content.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 Pre-round research anchors (applied)

- **Gradual Release of Responsibility (I Do / We Do / You Do):** shift cognitive load from model → guided → independent; stretch across subtopics, not one rushed leap.  
- **Cognitive load (Sweller):** separate *syntax of if* from *policy of accept/reject/review* when possible; worked examples before free problem solving.  
- **Python conditionals pedagogy (CS50P W1, Py4E ch.3, Python docs truth-value testing):** booleans → comparisons → if/elif/else → boolean ops; truthiness and `is None` as explicit traps.  
- **PEP 636:** `match` for finite states, not a replacement for numeric ranges.

### 5.2 I Do / We Do / You Do fidelity

| Layer | Assessment |
|--------|------------|
| **I Do** | 8 demos, one per subtopic, with `why` — structure excellent. **Integrity fail** on T1-A and T3-B outputs (ISSUE-02, ISSUE-03). Several demos correctly compute from inputs (T1-B, T2-A/B, T3-A, T4-A/B). |
| **We Do** | 24 exercises, E1 guided / E2 independent / E3 transfer, dual hints, edgeCases, solutions with outputs — **gold skeleton**. DEFECT starters are mostly authentic repair tasks. Weak spots: T2-B-E3 coherence, print-ok theater, occasional instruction/solution drift. |
| **You Do** | Strong objectives, requirements, weighted rubric, portfolio note (invariants + why not `if monto:`). **Starter quality below We Do** (NotImplementedError shells). |

**Overall GRR:** Conceptually excellent release curve (booleans → control → rules → verification → portfolio). Execution defects punch holes in the “I Do” trust layer.

### 5.3 Cognitive load & progressive disclosure

**Strengths**

- Signature misconception (zero válido vs `None`) repeated across theory, demo, E3, You Do, selfCheck adjacency — good spacing practice.  
- Guard order (None → type → range → accept) is a memorable schema.  
- Synthetic Perú domains (Lima, DNI/CE/PAS lengths) without claiming official padrón.

**Risks**

- Simultaneous introduction of QA tri-estado + match + test design + actionable messaging.  
- `set`/`dict` used before S06 “Colecciones” — acceptable as literals + `in`, but O(1) complexity talk is early.  
- `match` requires 3.10+; course assumes 3.12+ (callout present — good).

### 5.4 Grammar & redaction (español peruano)

- Prose is largely clear, professional, and ES-PE friendly; technical terms (`status`, `code`, `allowlist`, `review`) are appropriately English.  
- Occasional density (long multi-clause sentences in T1-B) — still grammatical.  
- No major orthography failures found in theory paragraphs sampled.  
- Prefer “lista permitida (allowlist)” already used; keep consistency for `reject`/`review` as product vocabulary.

### 5.5 Connective tissue & roadmap

- **Backward:** Explicitly builds on S02 parser/types (`None`, int/str, Decimal context for money elsewhere). Good.  
- **Forward:** Prepares S04 iteration over records; CP-N1-A increment clear.  
- **Naming debt:** id `data-structures` vs content (ISSUE-12).  
- Opening map over-invests in “what this section is *not*” (legacy) vs “what you will *build*.”

### 5.6 Exercise & exam quality

| Item | Grade |
|------|--------|
| Alignment to LOs | High — comparisons, truthiness, if/elif, guards, allowlists, tables/match, invariants, messages/tests all exercised |
| E3 transfer | Mostly genuine (bug diagnosis, design choice if vs match, off-by-one) except T2-B-E3 muddle |
| SelfCheck fairness | Fair MCQs; correctIndex verified for listed items; **coverage gap** on zero-valid (ISSUE-16) |
| Data ethics | Strong synthetic-only, no PII, fail-open to review for unknown regions |

### 5.7 Comparison with best-in-class externals

| Source | Relative to S03 |
|--------|------------------|
| [CS50P Conditionals](https://cs50.harvard.edu/python/weeks/1/) | Cleaner pure-syntax ramp; S03 richer on workplace validation |
| [Py4E Conditional Execution](https://www.py4e.com/html3/03-conditional) | Gentler narrative; less production policy |
| [Python Truth Value Testing](https://docs.python.org/3/library/stdtypes.html#truth-value-testing) | S03 correctly operationalizes falsy list into business policy |
| [PEP 636](https://peps.python.org/pep-0636/) | S03 correctly scopes match to finite codes |
| Gold peer **S02** | S02 map demo + cleaner “out of scope” still meta; S03 content deeper but demo integrity weaker |

**Net:** Content ambition is course-differentiating and appropriate for a data career path; polish must match ambition.

### 5.8 Accessibility / other

- Code samples are keyboard-friendly plain text.  
- Messages teaching “campo + problema + acción” supports inclusive ops communication.  
- No color-only instruction dependencies in source.  
- 18h estimate is ambitious but justifiable if demos/exercises are trustworthy.

---

## 6. Proposed GitHub-style Diffs

> Diffs are **proposals only** — Explorer does not apply them. Paths relative to repo root. Snippets focus on the minimal fix; Fixer may expand.

### Diff A — ISSUE-01: Align theory T1-A code and output

```diff
--- a/src/lib/course/sections/s03-data-structures.ts
+++ b/src/lib/course/sections/s03-data-structures.ts
@@ theory T1-A code block
-        code: `def region_ok(region, allowed):
-    return region in allowed
-
-region = "Lima"
-monto = 1500
-ALLOWED = {"Lima", "Arequipa", "Cusco"}
-print("region_ok", region_ok(region, ALLOWED))
-print("monto_pos", monto > 0)
-print("ok", True)
-`,
-        output: `True
-True
-True
-True
-True
-True`,
+        code: `region = "Lima"
+monto = 1500
+ALLOWED = {"Lima", "Arequipa", "Cusco"}
+
+print("region == 'Lima' →", region == "Lima")
+print("region != 'Piura' →", region != "Piura")
+print("monto > 0 →", monto > 0)
+print("1000 <= monto <= 2000 →", 1000 <= monto <= 2000)
+print("region in ALLOWED →", region in ALLOWED)
+print("'Piura' not in ALLOWED →", "Piura" not in ALLOWED)
+`,
+        output: `region == 'Lima' → True
+region != 'Piura' → True
+monto > 0 → True
+1000 <= monto <= 2000 → True
+region in ALLOWED → True
+'Piura' not in ALLOWED → True`,
```

### Diff B — ISSUE-02: Align I Do T1-A-DEMO

```diff
--- a/src/lib/course/sections/s03-data-structures.ts
+++ b/src/lib/course/sections/s03-data-structures.ts
@@ iDo S03-T1-A-DEMO
-          code: `def region_and_monto(region, monto, allowed):
-    return region in allowed, monto > 0
-
-region = "Lima"
-monto = 1500
-ALLOWED = {"Lima", "Arequipa", "Cusco"}
-print("region == 'Lima'", region == "Lima")
-print("checks", region_and_monto(region, monto, ALLOWED))
-print("ok", True)
-`,
-          output: `region == 'Lima' → True
-region != 'Piura' → True
-monto >= 1000 → True
-monto < 500 → False
-region in ALLOWED → True
-'Piura' not in ALLOWED → True
-1000 <= monto <= 2000 → True`,
+          code: `region = "Lima"
+monto = 1500
+ALLOWED = {"Lima", "Arequipa", "Cusco"}
+
+print("region == 'Lima' →", region == "Lima")
+print("region != 'Piura' →", region != "Piura")
+print("monto >= 1000 →", monto >= 1000)
+print("monto < 500 →", monto < 500)
+print("region in ALLOWED →", region in ALLOWED)
+print("'Piura' not in ALLOWED →", "Piura" not in ALLOWED)
+print("1000 <= monto <= 2000 →", 1000 <= monto <= 2000)
+`,
+          output: `region == 'Lima' → True
+region != 'Piura' → True
+monto >= 1000 → True
+monto < 500 → False
+region in ALLOWED → True
+'Piura' not in ALLOWED → True
+1000 <= monto <= 2000 → True`,
```

### Diff C — ISSUE-03: Align I Do T3-B-DEMO (if + match + same)

```diff
--- a/src/lib/course/sections/s03-data-structures.ts
+++ b/src/lib/course/sections/s03-data-structures.ts
@@ iDo S03-T3-B-DEMO
-          code: `def status_if(code: str) -> str:
-    if code == "OK":
-        return "accept"
-    elif code in ("MISSING", "NEEDS_REVIEW"):
-        return "review"
-    elif code == "OUT_OF_RANGE":
-        return "reject"
-    else:
-        return "review"
-
-for c in ["OK", "MISSING", "OUT_OF_RANGE", "X"]:
-    print(c, "→", status_if(c))
-print("ok", True)
-`,
-          output: `OK accept accept same= True
-...`,
+          code: `def status_if(code: str) -> str:
+    if code == "OK":
+        return "accept"
+    elif code in ("MISSING", "NEEDS_REVIEW"):
+        return "review"
+    elif code in ("OUT_OF_RANGE", "NOT_IN_ALLOWLIST", "BAD_TYPE"):
+        return "reject"
+    else:
+        return "review"
+
+def status_match(code: str) -> str:
+    match code:
+        case "OK":
+            return "accept"
+        case "MISSING" | "NEEDS_REVIEW":
+            return "review"
+        case "OUT_OF_RANGE" | "NOT_IN_ALLOWLIST" | "BAD_TYPE":
+            return "reject"
+        case _:
+            return "review"
+
+for c in ["OK", "MISSING", "OUT_OF_RANGE", "FOO", "NEEDS_REVIEW"]:
+    a, b = status_if(c), status_match(c)
+    print(c, a, b, "same=", a == b)
+`,
+          output: `OK accept accept same= True
+MISSING review review same= True
+OUT_OF_RANGE reject reject same= True
+FOO review review same= True
+NEEDS_REVIEW review review same= True`,
```

### Diff D — ISSUE-04/M1–M3: Learner-facing map without V3/repo meta

```diff
--- a/src/lib/course/sections/s03-data-structures.ts
+++ b/src/lib/course/sections/s03-data-structures.ts
@@ theory[0]
-      heading: 'De “Data Structures” a decisiones de validación (mapa de la sección)',
+      heading: 'Mapa de la sección: del booleano al motor de reglas',
       paragraphs: [
-        'En V3, **S03 no es el path principal de list/dict/CSV/JSON**. Esos temas viven conceptualmente en **S06** (y módulos posteriores). Aquí el estudiante domina lo que el **motor de reglas de intake** necesita: booleanos, control de flujo y políticas **accept / reject / review** sobre un registro sintético de cliente — sin confundir `None` (ausente) con `0` o `""`.',
+        'Aquí dominas lo que el **motor de reglas de intake** necesita ahora: booleanos, control de flujo y políticas **accept / reject / review** sobre un registro sintético de cliente — sin confundir `None` (ausente) con `0` o `""`. Las colecciones avanzadas y archivos (list/dict profundos, CSV/JSON) se trabajan más adelante en el currículum de datos.',
@@ callout
-        title: 'Contenido reubicado conceptualmente a S6',
-        content:
-          'Material legado de esta sección (list/dict/set avanzados, CSV DictReader, JSON load/dump, pipeline ETL de ventas, Sales Log Parser) **no es el camino del estudiante en S03 V3**. Se conserva como referencia histórica en el historial del repo; el target de entrega es el **motor de reglas CP-N1-A**. Si necesitas estructuras y archivos, espera a S06 / secciones de datos.',
+        title: 'Fuera de alcance en esta sección',
+        content:
+          'No es entrega de esta sección: parsers CSV/JSON, ETL de ventas ni “Sales Log Parser”. El target es el **motor de reglas** del incremento **CP-N1-A** (validate por campo con accept/reject/review). Colecciones y archivos vienen en secciones posteriores de datos.',
```

### Diff E — ISSUE-05/M4–M5: Remove “gate V3”

```diff
-        'El error canónico del gate V3: **`if monto:` trata `0` como “no hay monto”**. ...
+        'El error canónico del intake: **`if monto:` trata `0` como “no hay monto”**. ...
@@ T1-B-E3 feedback
-        feedback: 'Reescribir el test de presencia con is None es el fix del gate V3.',
+        feedback: 'Reescribir el test de presencia con is None es el fix crítico del motor de reglas (CP-N1-A).',
```

### Diff F — ISSUE-06: You Do context without legacy changelog

```diff
-      'Reemplaza el legado “Sales Log Parser” como entrega de S03. Construyes el **motor de reglas** sobre el parser de intake de S02: ...
+      'Construyes el **motor de reglas** sobre el parser de intake de S02: ...
```

### Diff G — ISSUE-07: You Do scaffold with one clear defect (sketch)

```diff
 def validate_monto(valor: Any) -> dict:
-    """0 válido; None → review; negativo → reject; outlier opcional → review."""
-    # Contrato: corrige el DEFECT del starter
-    raise NotImplementedError
+    """0 válido; None → review; negativo → reject; outlier opcional → review."""
+    # DEFECT: truthiness rechaza 0 y trata None como reject
+    if not valor:
+        return {
+            "status": "reject",
+            "code": "BAD",
+            "message": "monto inválido",
+        }
+    if valor < 0:
+        return {
+            "status": "reject",
+            "code": "OUT_OF_RANGE",
+            "message": f"Campo 'monto_ingreso'={valor} negativo; usa ≥ 0.",
+        }
+    return {"status": "accept", "code": "OK", "message": "monto OK"}
```

*(Fixer should apply analogous defective-but-runnable bodies for `validate_edad`, `validate_region`, `validate_record`, and keep `_run_tests` as red→green oracle.)*

### Diff H — ISSUE-08: Strip false success prints from starters (pattern)

```diff
-print('ok', True)
-
```

Apply across We Do starters; success should only appear after the learner’s fix matches the solution contract.

### Diff I — ISSUE-09: Honest dead-branch starter

```diff
 def etiqueta_bug(x):
-    if x != 0:
-        if x > 0:
-            return "positivo"
-        return "negativo"
-    elif x == 0:  # DEFECT: se alcanza, pero rama confusa
-        return "cero?"
-    return "??"
+    if x >= 0:
+        return "no-negativo"
+    elif x > 5:  # DEFECT: rama muerta (nunca corre)
+        return "grande-positivo"
+    else:
+        return "negativo"
```

Update instruction + solution to match a single coherent dead-branch story; optional second function for clean rewrite.

### Diff J — ISSUE-16: Add selfCheck item for zero-valid monto

```diff
+      {
+        question:
+          'En un validador de monto de intake, ¿qué debe ocurrir con los valores None y 0 bajo la política del curso?',
+        options: [
+          'Ambos reject porque son falsy',
+          'None → review (ausente); 0 → accept si el invariante lo permite',
+          'Ambos accept siempre',
+          '0 → review; None → accept',
+        ],
+        correctIndex: 1,
+        explanation:
+          'None modela ausencia (review). 0 puede ser un monto válido; no uses if monto: para presencia.',
+      },
```

### Diff K — ISSUE-20: Use repr in theory T2-B loop print (optional polish)

```diff
-for e in [None, "25", -1, 15, 30]:
-    print(e, "→", validate_edad(e))
+for e in [None, "25", -1, 15, 30]:
+    print(repr(e), "→", validate_edad(e))
```

And align `output` lines accordingly (`'25' → ...`).

---

## 7. Recommended Priority Order for Fixing

| Priority | Issues | Rationale |
|----------|--------|-----------|
| **1 — P0 integrity** | 01, 02, 03 | Demo/theory outputs must equal runnable code before any polish |
| **2 — P1 meta-leaks** | 04, 05, 06 (+ M1–M6) | Learner-facing voice; remove V3/legacy/repo/gate jargon |
| **3 — P1 You Do scaffold** | 07 | Match We Do quality; gold anti-stub |
| **4 — P1 exercise coherence** | 09 | Dead-branch E3 currently confuses transfer goal |
| **5 — P2 exercise polish** | 08, 10, 11, 16 | ok-print theater, nested semantics, result-shape map, selfCheck gap |
| **6 — P2 platform naming** | 12 | Plan rename `data-structures` → e.g. `decisions-rules` (product/URL impact) |
| **7 — P2/P3 pedagogy polish** | 13, 17, 19, 20, 21 | Theory demo completeness, load framing, S02-like map code, repr prints, bridges |
| **8 — P3 redaction** | 14, 15, 18 | Bloom label, anglicisms, typing imports |

**Suggested Fixer acceptance tests**

1. For every theory/iDo/weDo solution `code` block: execute under Python 3.12 and assert stdout == declared `output` (normalize whitespace).  
2. Grep learner-facing strings for: `V3`, `legado`, `historial del repo`, `gate V3`, `Sales Log Parser`, `reubicado`, `Data Structures` (heading).  
3. You Do starter runs without `NotImplementedError` and fails `_run_tests` until fixed.  
4. Structural: still 8 demos / 24 exercises / ≥5 selfCheck.

---

## 8. Graph Memory Update Notes

For shared context files (`GRAPH_MEMORY.json` / summary / residual ledger) — **Explorer notes only**:

```yaml
section: S03
id: data-structures
title: Decisiones y reglas de validación
explorer_score: 7.5
status_explorer: complete
status_gold: false  # pending Fixer on P0/P1
edges:
  - S02_parser_types → S03_rules_engine (depends_on)
  - S03_rules_engine → S04_iteration_batch (prepares)
  - S03_rules_engine → CP-N1-A (increment)
  - S03_topic ≠ S06_collections (roadmap_disambiguation; id still legacy)
defects_open:
  - demo_output_desync: [T1-A theory, S03-T1-A-DEMO, S03-T3-B-DEMO]
  - meta_leaks: [V3_map, legacy_callout, gate_V3, sales_log_parser_youdo]
  - youdo_stub: NotImplementedError shells
  - exercise_coherence: [T2-B-E3 dead branch, T2-B-E2 nested semantics]
strengths:
  - tri_state_none_vs_zero signature gate
  - GRR 8/8/24 structure
  - workplace authentic messages + invariants
  - resources aligned (docs + CS50P + Py4E + PEP636)
prior_dossier_claim: PA≥9.55  # explorer overrides for integrity/meta
fixer_ready: true
```

**Nodes to mark “needs_redaction”:** theory[0] map+callout; T1-B “gate V3”; youDo.context legacy sentence.  
**Nodes to mark “needs_recompute_output”:** comparaciones_intake; S03-T1-A-DEMO; S03-T3-B-DEMO.

---

## Appendix A — Structural checklist (gold bar)

| Criterion | Status |
|-----------|--------|
| ≥9 theory headings (map + 8) | Pass |
| ≥3 paragraphs per subtopic | Pass |
| Callouts actionable | Pass (except meta callout content) |
| Theory code with output | Pass structure / **Fail honesty** on T1-A |
| 8 I Do demos | Pass structure / **Fail honesty** on 2 demos |
| 24 We Do E1/E2/E3 | Pass |
| You Do + rubric | Pass structure / **Fail starter quality** |
| ≥5 selfCheck | Pass (5) |
| Resources real URLs | Pass |
| No real PII | Pass |
| Progressive disclosure (major APIs) | Mostly pass; typing/match mild stretch |

## Appendix B — Research sources consulted (Explorer)

- Gradual Release / I–We–You literature (Fisher & Frey lineage; structural-learning / Edutopia GRR summaries)  
- Python docs: Truth Value Testing, comparisons, control flow  
- PEP 636 structural pattern matching  
- CS50P Week 1 Conditionals  
- Py4E Conditional Execution  
- PyArcana `GOLD_STANDARD_CHECKLIST.md`, `S03_RESEARCH.md`, `S03_STORM.json`, `S03_AUDIT.json`, visible paragraphs export  
- Live homepage curriculum listing for S03 card  

---

This is the complete Explorer report for Section 3. Ready for the Fixer prompt.
