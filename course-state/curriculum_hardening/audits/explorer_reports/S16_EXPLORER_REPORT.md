# S16 Explorer Report — Calidad, limpieza y contratos de datos

**Auditor role:** Curriculum Auditor · Pedagogical Analyst · Technical Editor  
**Method:** Stanford STORM multi-pass + Graph Engineering + Loop Engineering  
**Target only:** Section 16 (`wxpython-gui`)  
**Live site:** https://pillb.github.io/pyarcana/ (SPA; curriculum card + section metadata verified; full body is client-rendered from the same TS source)  
**Source of truth inspected:** `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s16-wxpython-gui.ts`  
**Seed quizzes:** `/Users/pabloillescas/Projects/PyArcana/prisma/seed.ts` key `'wxpython-gui'`  
**Prior automated audit:** `course-state/curriculum_hardening/audits/S16_AUDIT.json` (ACCEPT / no high structural issues) — this Explorer report goes deeper on pedagogy, meta-leaks, technical correctness, and exercise design.  
**Do not apply fixes in this pass.** Diffs below are proposals only.

---

## 1. Section Identification & Scope

| Field | Value |
| --- | --- |
| Index | 16 |
| Platform id (hash) | `wxpython-gui` |
| Title | Calidad, limpieza y contratos de datos |
| shortTitle (UI card) | Calidad y contratos |
| File | `src/lib/course/sections/s16-wxpython-gui.ts` |
| Level / phase / hours | Competente · phase 1 · 18 h |
| Icon / accent | `Monitor` · blue→indigo gradient |
| Capstone thread | CP-N2-A (quality gate) → feeds S17 portfolio |
| Subtopics | 8 (`S16-T1-A` … `S16-T4-B`) |
| Structure | theory×9 blocks (1 map + 8 topics) · iDo×8 · weDo×24 · youDo×1 · selfCheck×5 · resources |
| Live curriculum card | “suite de calidad que falla de forma explicable ante schema drift…” — **aligned** with source tagline |
| Out of scope this run | S15, S17, product/TS edits, applying diffs |

**Topic ownership (V3, as taught):**

1. **T1 Ausencia** — null policies required/optional; indicadores; cap de imputación  
2. **T2 Duplicados** — exactos vs conflictos; claves, cardinalidad, evidencia  
3. **T3 Normalización / outliers** — strings/números/fechas/cats + raw lateral; IQR vs dominio  
4. **T4 Contratos** — schema + cross-field; métricas, cuarentena, audit trail  

**Pre-round research (pedagogy & domain, condensed):**

- Data contracts / quality rules industry practice: versioned expectations on schema, nullability, cross-field rules, fail-or-quarantine rather than silent coercion (Soda, Great Expectations, dbt tests patterns).  
- Progressive disclosure (Nielsen): advanced or historical platform noise should not block the first-path learner.  
- Gradual release of responsibility (I Do / We Do / You Do): demos → guided defect-fix → independent transfer → portfolio integration.  
- Cognitive load: one contract idea per micro-exercise; raw-preserving transforms; explicit metrics on failure.  
- LatAm data cleaning: decimal comma vs thousands separator is a first-class contract, not an afterthought.

---

## 2. Executive Summary of Quality

### Score: **6.5 / 10**

### Verdict

S16 has a **strong conceptual spine** for a competent-level quality gate: fail-closed null policies, imputation caps with absence indicators, exact-vs-conflict duplicates, raw-preserving normalization, domain-over-IQR outliers, schema/cross-field contracts, and quarantine + metrics + append-only audit. The 8×3 We Do grid and 8 I Do demos map cleanly to subtopics; self-check and seed quizzes reinforce the same contracts. Privacy posture (synthetic Lima/Arequipa/Cusco, `S/`, `C00x`, no real PII) is consistent with the course.

However, the **student-facing surface still leaks curriculum engineering**: platform id `wxpython-gui`, “V3”, “retematiza”, “Material legado de wxPython”, rubric “gate V3”, and seed distractors about “GUI wx” / “wxPython”. That is **developer meta-text**, not learning content. There is also a **high-severity technical/pedagogical error** in money normalization (`"3,00"` → `300.0` while prose claims “decimal latino”). Several We Do transfer items are **oracle-misaligned** (starter fixture ≠ solution fixture, or starter already correct). You Do is a thin `NotImplementedError` stub without acceptance metrics shape. Prose density is high; scaffolding (hints) is often one telegraphic line. Compared with early gold-standard narrative (e.g. S01 dictionary + progressive vocabulary), S16 reads more like an internal quality runbook than a taught lesson.

**If meta-leaks, money bug, exercise oracle mismatches, and You Do acceptance criteria are fixed, this section can reach ~8.5–9 without rewriting the pedagogy.**

---

## 3. Detailed Issue Registry

Severity legend: **P0** = blocks learning / wrong content · **P1** = serious pedagogy or UX · **P2** = quality polish · **P3** = nice-to-have.

### ISSUE-01 — Student-facing V3 / platform-id / wxPython retarget map (meta-leak)
- **Severity:** P0 (meta-leak + cognitive intrusion)  
- **Location:** `jobRelevance`; theory map heading + paragraphs + callout (`lines ~14–38`)  
- **Evidence:**
  - “Esta sección (id `wxpython-gui` conservado) retematiza a V3…”
  - Heading: “De “GUI wxPython” a calidad y contratos de datos (mapa)”
  - “En V3, **S16 no es el path de wx.Frame ni sizers**. El id de plataforma `wxpython-gui` se conserva…”
  - Callout title “Contenido reubicado conceptualmente” / “Material legado de wxPython **no es el camino V3 en S16**.”
- **Pedagogical impact:** First contact with S16 teaches **curriculum migration**, not quality gates. Violates progressive disclosure; confuses beginners who never saw wxPython. Wastes working memory before T1.

### ISSUE-02 — Residual wxPython in icon + seed quiz distractors
- **Severity:** P1  
- **Location:** `icon: "Monitor"`; `prisma/seed.ts` options under `'wxpython-gui'`  
- **Evidence:**
  - Icon `Monitor` is a desktop-GUI metaphor for a data-quality section.  
  - Seed options include “Crear un GUI wx”, “Que el GUI crasheó”, “Solo sirve en wxPython”.  
- **Pedagogical impact:** Distractors reinforce the wrong domain. Even as “wrong answers,” they re-activate a deleted topic and look unprofessional.

### ISSUE-03 — Money parse teaches wrong “decimal latino” (technical falsehood)
- **Severity:** P0  
- **Location:** Theory T3-A `normalize.py` (`norm_money`, fixture `"3,00"`, expected output `300.0`)  
- **Evidence:**
  - Prose: “números (quitar `S/`, comas de miles, **decimal latino**)…”  
  - Code: `.replace(",", "")` then `float` on `"3,00"` → **300.0** (treats comma as thousands separator / digit removal).  
  - Expected output embeds the wrong value: `'monto': [10.5, 300.0, 4.0]`.  
  - Seed quiz explicitly warns: “Parsear montos con locale (coma decimal) incorrecto produce… Errores o valores sesgados” — **the theory demo commits that error**.  
- **Pedagogical impact:** Students in Perú copy a broken PEN parser into CP-N2-A. Direct contradiction between lesson and quiz. Undermines trust in “contratos de datos.”

### ISSUE-03b — Unused import / inconsistent demo shape in same block
- **Severity:** P2  
- **Evidence:** `import re` never used; T3-A theory code is a bare script while other theory blocks wrap `s16_th_N()`.  
- **Impact:** Minor consistency / linter noise if students copy the pattern.

### ISSUE-04 — Self-check Spanglish / redaction
- **Severity:** P2  
- **Location:** `selfCheck.questions[0]`  
- **Evidence:** “Un campo **marked** required con nulls debe:”  
- **Impact:** Breaks “español peruano profesional”; easy fix to “marcado como required” or “con política required”.

### ISSUE-05 — Rubric and resources still say “V3”
- **Severity:** P1 (meta-leak)  
- **Location:** `youDo.rubric[0]` “Alineación al gate **V3** de la sección”; resources course note “**V3** S16 quality gate”  
- **Impact:** Portfolio grading language exposes internal versioning.

### ISSUE-06 — We Do starters leak authoring tags + always print `ok True`
- **Severity:** P1  
- **Location:** All 24 `starterCode` blocks  
- **Evidence:** Lines like `# CASO-LIM-016 · …` / `# DEFECT: …` and final `print('ok', True)` even when the defect makes the primary answer wrong.  
- **Pedagogical impact:**
  - `# DEFECT:` is instructor meta (useful for authors, noisy for learners).  
  - Extra `print('ok', True)` can make automated “looks green” while primary metric is wrong — fights fail-closed culture the section teaches.  
  - Solutions correctly omit `ok`; good — but starters train a bad habit.

### ISSUE-07 — S16-T2-B-E3 oracle / fixture mismatch (cardinalidad)
- **Severity:** P0  
- **Location:** We Do `S16-T2-B-E3`  
- **Evidence:**
  - Starter fixture: `{"id": ["a", "a"], ...}` (duplicated key) always prints `"card_ok"`.  
  - Solution fixture: `{"id": ["a", "b"], ...}` (unique) with correct check → `"card_ok"`.  
  - A student who **only** fixes the logic on the starter data correctly prints `"card_bad"`, which **fails** the stated oracle `"card_ok"`.  
- **Impact:** Broken transfer exercise; random luck if student also rewrites the fixture.

### ISSUE-08 — S16-T2-A-E3 transfer does not require a fix
- **Severity:** P1  
- **Location:** We Do `S16-T2-A-E3`  
- **Evidence:** Starter is a single clean row and already prints `"clean"`; solution is also `"clean"`. Comment says `# DEFECT: siempre clean` but for this fixture “siempre clean” is correct.  
- **Impact:** Zero learning; teaches that “do nothing” can pass transfer.

### ISSUE-09 — S16-T3-B-E3 under-implements the stated concept
- **Severity:** P2  
- **Location:** We Do `S16-T3-B-E3`  
- **Evidence:** Instruction asks for labels `error` / `flag` / `ok` (domain vs stat vs ok). Solution only implements `error if val < 0 else ok` — never builds IQR/stat branch.  
- **Impact:** Concept of three-way classification is promised but not exercised.

### ISSUE-10 — Several E1s are below “Competente” demand
- **Severity:** P2  
- **Examples:**
  - `S16-T4-B-E1`: `print(rows_in - q)` → `7` (pure arithmetic).  
  - `S16-T1-A-E1`: flip `notna`→`isna`.  
  - `S16-T4-B-E2`: one `append` + `len`.  
- **Impact:** Fine as warm-ups, but density of micro-flips reduces transfer readiness for You Do quality suite. Hints are often a single token (`"isna().sum()."`) with little conceptual bridge.

### ISSUE-11 — You Do under-specified for portfolio / CP-N2-A
- **Severity:** P1  
- **Location:** `youDo`  
- **Evidence:** Context is rich; `starterCode` is only:
  ```python
  def run_quality_gate(...):
      raise NotImplementedError
  ```
  No required keys in return dict, no multi-check fixture pack, no sample metrics JSON, no “must fail on X / pass on Y” table, no file layout. Rubric is generic (20% privacy, 10% docs…) without section-specific gates.  
- **Impact:** Students cannot self-evaluate; Fixer/mentor feedback becomes subjective; weak bridge to S17 “dataset limpio + reconciliación”.

### ISSUE-12 — Connective tissue S15→S16→S17 present but buried under meta
- **Severity:** P2  
- **Evidence:** Good technical bridges exist (“no envenenes el EDA de S17”, “set limpio alimenta joins de S17”, “Solo pandas + stdlib de S01–S16”). Opening map spends equal or more ink on wxPython/V3 than on “vienes de ingesta tipada S15”.  
- **Impact:** Roadmap coherence is in the file but not in the first student-facing paragraph after the title.

### ISSUE-13 — Learning outcomes are thin vs gold-standard sections
- **Severity:** P3  
- **Evidence:** Outcomes are short verb phrases without success criteria (“Definir políticas de null por campo”) vs S01-style outcomes that include tools and verification.  
- **Impact:** Weaker self-monitoring and weaker alignment with You Do rubric.

### ISSUE-14 — Source formatting drift (single-space indent whole file)
- **Severity:** P2 (maintainability; not student-visible if TS parses)  
- **Evidence:** `s16-wxpython-gui.ts` uses 1-space indentation throughout; neighboring sections (e.g. S15) use standard 2-space.  
- **Impact:** Harder reviews/diffs; risk of merge pain. Not a pedagogy defect per se.

### ISSUE-15 — Theory claims fechas multi-formato / cat maps; demos barely cover them
- **Severity:** P2  
- **Evidence:** T3-A prose lists “fechas multi-formato, categorías con mapa de sinónimos (LIM→Lima)”; code only does strip/title + money parse. T4 uses dates only for cross-field. No synonym map demo.  
- **Impact:** Progressive disclosure incomplete for stated learning outcome “Normalizar strings/números/fechas/categorías”.

### ISSUE-16 — `fail-closed` and other anglicisms without first Spanish gloss
- **Severity:** P3  
- **Evidence:** jobRelevance and theory use fail-closed, schema drift, audit trail early; mostly OK for competent track but first definition is delayed or implicit.  
- **Impact:** Mild accessibility hit for learners whose English is weaker.

### ISSUE-17 — Seed/self-check overall alignment is good (positive edge; residual noise)
- **Severity:** P2 (noise only)  
- **Note:** Core questions on null policy, indicators, exact vs conflict, IQR vs domain, metrics-on-fail are **well aligned**. Keep them; only clean wx/GUI distractors and ensure theory code matches locale quiz.

### ISSUE-18 — I Do / We Do fidelity is structurally correct (positive, with density caveat)
- **Severity:** n/a (strength)  
- **Evidence:** 8 demos with `why`; 24 exercises kinds guided/independent/transfer per subtopic.  
- **Caveat:** Many “guided” items are one-line defect flips rather than multi-step co-construction; still valid GRR pattern at micro scale.

---

## 4. Meta-Leak Report

Exact leaked (or curriculum-engineering) text that should not remain as primary student-facing content:

| # | Exact / near-exact text | Location |
| --- | --- | --- |
| M1 | `(id \`wxpython-gui\` conservado) retematiza a V3 **calidad/limpieza/contratos**` | `jobRelevance` |
| M2 | `De “GUI wxPython” a calidad y contratos de datos (mapa)` | theory[0].heading |
| M3 | `En V3, **S16 no es el path de wx.Frame ni sizers**. El id de plataforma \`wxpython-gui\` se conserva…` | theory[0].paragraphs[0] |
| M4 | Callout title `Contenido reubicado conceptualmente` | theory[0].callout |
| M5 | `Material legado de wxPython **no es el camino V3 en S16**. Target: calidad y contratos para CP-N2-A.` | theory[0].callout.content |
| M6 | `Alineación al gate V3 de la sección` | youDo.rubric |
| M7 | `Curso desplegado; V3 S16 quality gate` | resources.courses note |
| M8 | All starter comments `# DEFECT: …` (authoring) | weDo ×24 |
| M9 | `corrige el DEFECT del starter` | youDo.starterCode comment |
| M10 | Seed distractors: `Crear un GUI wx`, `Que el GUI crasheó`, `Solo sirve en wxPython` | `prisma/seed.ts` |

**Meta-leak count (distinct surface items): 10** (M1–M10).  
**Note:** Platform id may remain in code for routing stability; it must **not** be taught as narrative. Internal “V3/retarget” belongs in `course-state/` worklogs, not the lesson.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 Meta-text / developer leakage
Dominant failure mode of S16 (shared with other retargeted mid-course sections). The opening theory block is essentially a **changelog for curriculum authors**. Student path should open with: *qué es un quality gate, por qué fail-closed, puente desde S15 ingesta tipada*.

### 5.2 Grammatical correctness & redaction (Peruvian Spanish)
- Overall: technical Spanish is readable and professional.  
- Issues: Spanglish in self-check (“marked required”); heavy unglossed English jargon early; “retematiza” is not learner Spanish.  
- Tone: slightly bureaucratic (“Contrato operativo”, “runbook”) — acceptable for competent track if softened with motivation.

### 5.3 Connective tissue & narrative flow
- **Strengths:** Explicit S17 bridges; ordered T1→T4 map; synthetic Perú fixtures throughout.  
- **Weaknesses:** First node is wxPython history; map paragraph is a compressed syllabus dump (high intrinsic load). Missing warm “story of a bad silent fillna that poisoned an executive KPI” anecdote that gold sections often use.

### 5.4 I Do / We Do / You Do fidelity
| Layer | Count | Fidelity |
| --- | --- | --- |
| I Do | 8 demos + `why` | Strong 1:1 with subtopics; short and runnable |
| We Do | 24 = 8×(E1/E2/E3) | Structure excellent; content quality uneven (ISSUE-07/08/09/10) |
| You Do | 1 portfolio stub | Intent clear; specification thin (ISSUE-11) |
| Autocheck | 5 in-section + seed battery | Conceptually aligned |

Gradual release is present at **topic** level, not always at **skill** level (some E3s do not transfer).

### 5.5 Cognitive load & progressive disclosure
- Good: one policy idea per theory block; callouts reinforce “no silent fix”.  
- Bad: retarget map + full T1–T4 dump + CP-N2-A + id conservation in the first screen.  
- Money block increases load *and* error by mixing thousands separators and decimal commas without a decision table.

### 5.6 Exercise & exam quality
- Defect-driven starters are a strong pattern when fixtures match oracles.  
- Broken: T2-B-E3 fixture swap; T2-A-E3 no-op transfer; T3-B-E3 incomplete labels.  
- Self-check options are mostly discriminative; fix language on Q1.  
- Seed residual GUI options should be replaced with plausible wrong quality strategies (e.g. “promediar conflictos sin log”).

### 5.7 Roadmap consistency
- Aligns with live curriculum card and S15/S17 chain (ingest → quality → joins/portfolio).  
- Platform id mismatch is **historical**; student-facing text should not re-litigate it.

### 5.8 Comparison with best-in-class external materials
| External pattern | S16 status |
| --- | --- |
| Great Expectations / Soda-style named expectations | Named in resources; code is hand-rolled pandas (appropriate level) |
| Explicit data contract (schema + nullability + cross-field) | Strong conceptual match |
| Quarantine + metrics on fail | Strong (T4-B) |
| Locale-aware numeric parsing | **Claimed, incorrectly demonstrated** |
| Pandera / pydantic models | Not needed at this level; optional later |
| Narrative teaching (Wes McKinney / analytics eng blogs) | Weaker than gold S01 prose |

### 5.9 Accessibility / motivation / other
- Privacy: excellent.  
- Motivation: jobRelevance lists banca/fintech/retail Perú — good, but currently contaminated by meta.  
- Icon `Monitor` is accessibility-neutral but semantically wrong. Prefer `ShieldCheck` / `ClipboardCheck` / `Filter` if available in icon set.

### Graph snapshot (nodes of concern)

```
[wxPython/V3 map] --meta-leak--> [student first contact]
[T3-A norm_money] --false-edge--> [decimal latino claim]
[seed locale quiz] --contradicts--> [T3-A demo]
[T2-B-E3 starter] --oracle-break--> [solution fixture]
[YouDo stub] --weak-edge--> [S17 clean dataset]
[T1..T4 contracts] --strong--> [CP-N2-A quality]
```

---

## 6. Proposed GitHub-style Diffs

> Do **not** apply in Explorer. Paths relative to repo root. Diffs are illustrative patches for the Fixer.

### Diff A — Strip student-facing meta from jobRelevance + theory map (ISSUE-01, M1–M5)

```diff
--- a/src/lib/course/sections/s16-wxpython-gui.ts
+++ b/src/lib/course/sections/s16-wxpython-gui.ts
@@
- jobRelevance:
- "Los equipos de datos en banca, fintech y retail en Perú necesitan **quality gates explicables**: null policies por campo, duplicados con evidencia, normalización con raw lateral, outliers con dominio y cuarentena con audit trail. Esta sección (id `wxpython-gui` conservado) retematiza a V3 **calidad/limpieza/contratos** e incrementa **CP-N2-A (quality)** — fail-closed, sin PII real, sin arreglos silenciosos.",
+ jobRelevance:
+ "Los equipos de datos en banca, fintech y retail en Perú necesitan **quality gates explicables**: políticas de null por campo, duplicados con evidencia, normalización con columna raw al lado, outliers con dominio y cuarentena con audit trail. Aquí construyes el gate de calidad de **CP-N2-A**: falla de forma cerrada (fail-closed: si el contrato se rompe, el job no “aprueba” en silencio), sin PII real y sin arreglos silenciosos. Parte de la ingesta tipada de S15 y deja un set limpio + métricas para S17.",
@@
- heading: "De “GUI wxPython” a calidad y contratos de datos (mapa)",
+ heading: "Mapa de la sección: del CSV tipado al quality gate",
  paragraphs: [
- "En V3, **S16 no es el path de wx.Frame ni sizers**. El id de plataforma `wxpython-gui` se conserva, pero el camino del estudiante es el **quality gate de CP-N2-A**: políticas de null, imputación limitada con indicadores, duplicados vs conflictos, normalización, outliers, contratos de schema/cross-field y cuarentena con audit trail.",
+ "En S15 leíste clientes y transacciones con dtypes controlados. En **S16** el foco es el **quality gate de CP-N2-A**: políticas de null, imputación limitada con indicadores, duplicados vs conflictos, normalización, outliers, contratos de schema/cross-field y cuarentena con audit trail.",
  "Regla de oro: **nunca “arreglar” silenciosamente**. Toda transformación deja métrica, indicador o rastro en cuarentena. Datos sintéticos de clientes y montos (regiones Lima/Arequipa/Cusco, prefijos `S/`, ids `C00x`); nunca PII real ni DNIs de personas.",
  "Orden pedagógico: **T1 Ausencia** … Solo pandas + stdlib de S01–S16.",
  ],
  callout: {
  type: "info",
- title: "Contenido reubicado conceptualmente",
- content:
- "Material legado de wxPython **no es el camino V3 en S16**. Target: calidad y contratos para CP-N2-A.",
+ title: "Regla de oro del gate",
+ content:
+ "Si no puedes explicar la transformación con una métrica o una fila en cuarentena, no la apliques. El set limpio de esta sección alimenta el portfolio de S17.",
  },
```

### Diff B — Fix decimal latino money parse (ISSUE-03)

```diff
--- a/src/lib/course/sections/s16-wxpython-gui.ts
+++ b/src/lib/course/sections/s16-wxpython-gui.ts
@@
- code: `import pandas as pd
-import re
-
-def norm_money(x):
- if pd.isna(x):
- return None
- s = str(x).strip().replace("S/", "").replace(",", "")
- return float(s)
-
-df = pd.DataFrame({
- "region_raw": [" lima ", "AREQUIPA", "Lima"],
- "monto_raw": ["S/ 10.50", "3,00", "4"],
-})
-df["region"] = df["region_raw"].str.strip().str.title()
-df["monto"] = df["monto_raw"].map(norm_money)
-print(df[["region", "monto"]].to_dict(orient="list"))`,
- output: `{'region': ['Lima', 'Arequipa', 'Lima'], 'monto': [10.5, 300.0, 4.0]}`,
+ code: `def s16_th_5():
+    import pandas as pd
+    import re
+
+    def norm_money(x):
+        if pd.isna(x):
+            return None
+        s = str(x).strip().replace("S/", "").strip()
+        # Contrato PE sintético: miles con espacio o punto; decimal con coma
+        # o punto si no hay coma. Documenta la regla; no adivines.
+        if "," in s and "." in s:
+            s = s.replace(".", "").replace(",", ".")
+        elif "," in s:
+            s = s.replace(",", ".")
+        else:
+            s = s.replace(" ", "")
+        return float(re.sub(r"[^0-9.\\-]", "", s) or "nan")
+
+    df = pd.DataFrame({
+        "region_raw": [" lima ", "AREQUIPA", "Lima"],
+        "monto_raw": ["S/ 10.50", "3,00", "1.250,5"],
+    })
+    df["region"] = df["region_raw"].str.strip().str.title()
+    df["monto"] = df["monto_raw"].map(norm_money)
+    print(df[["region", "monto"]].to_dict(orient="list"))
+
+s16_th_5()`,
+ output: `{'region': ['Lima', 'Arequipa', 'Lima'], 'monto': [10.5, 3.0, 1250.5]}`,
```

Also update theory paragraph to state the **documented** rule (when comma is decimal vs thousands) instead of implying a one-liner `replace(",", "")`.

### Diff C — Self-check language (ISSUE-04)

```diff
- question: "Un campo marked required con nulls debe:",
+ question: "Un campo con política required que tiene nulls debe:",
```

### Diff D — Rubric + resources V3 strip (ISSUE-05)

```diff
- { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
+ { criterion: "Alineación al quality gate de la sección (fail-closed + métricas)", weight: "25%" },
@@
- note: "Curso desplegado; V3 S16 quality gate",
+ note: "Curso desplegado; S16 quality gate",
```

### Diff E — Repair S16-T2-B-E3 oracle (ISSUE-07)

```diff
 # Starter: keep duplicated ids; force student to detect card_bad
 print("card_ok")  # DEFECT: siempre card_ok
 # Solution must use SAME fixture:
 df = pd.DataFrame({"id": ["a", "a"], "v": [1, 2]})
 print("card_ok" if df["id"].nunique() == len(df) else "card_bad")
 # output: card_bad
```

And change instruction Pass string to `card_bad` **or** keep `card_ok` but then starter fixture must already be unique and defect is inverted logic — pick one contract and stick to it.

### Diff F — Repair S16-T2-A-E3 transfer (ISSUE-08)

Use a fixture that is a **conflict** (same id, two regions); starter always prints `"clean"`; solution classifies `"conflict"`.

### Diff G — Expand T3-B-E3 to three labels (ISSUE-09)

Require computing both domain mask and IQR mask for a multi-row series; print label for a chosen index (e.g. 5000 → `flag`, -1 → `error`, 10 → `ok`).

### Diff H — You Do acceptance skeleton (ISSUE-11)

```diff
 starterCode: `import pandas as pd
 from typing import Any
 
 def run_quality_gate(df: pd.DataFrame, schema: dict) -> dict[str, Any]:
     """Retorna dict con claves mínimas:
     metrics: {rows_in, rows_clean, rows_quarantine, pass}
     quarantine: DataFrame o list[dict] con reason
     audit: list[dict] append-only
     No mutar df in-place sin copiar; no PII real.
     """
     raise NotImplementedError
 
 if __name__ == "__main__":
     df = pd.DataFrame({
         "cliente_id": ["C001", "C001", None, "C003"],
         "region": ["Lima", "Cusco", "Lima", "Arequipa"],
         "monto": [10.0, 10.0, 5.0, -1.0],
     })
     schema = {"cliente_id": "required", "monto": "required", "region": "optional"}
     report = run_quality_gate(df, schema)
     assert set(report) >= {"metrics", "quarantine", "audit"}
     assert "pass" in report["metrics"]
     print(report["metrics"])
 `,
```

Add objectives bullet: “Demo: al menos un fail explicable por null required, un conflicto de región y un domain_error de monto; métricas publicadas con pass=False.”

### Diff I — Seed distractor cleanup (ISSUE-02) — seed.ts only if Fixer scope allows

```diff
- 'Crear un GUI wx',
+ 'Ordenar el DataFrame por índice',
@@
- 'Que el GUI crasheó',
+ 'Que el export a CSV falló por encoding',
@@
- 'Solo sirve en wxPython',
+ 'Solo aplica a columnas categoricals',
```

### Diff J — Icon semantic fix (ISSUE-02)

```diff
- icon: "Monitor",
+ icon: "ShieldCheck",  # or ClipboardCheck / Filter — match lucide set used by app
```

### Diff K — Starter hygiene (ISSUE-06) — pattern for all 24 exercises

```diff
- # DEFECT: cuenta notna en vez de isna
+ # Pista de lab: el conteo de ausencias usa isna, no notna
@@
- print(int(df["id"].notna().sum()))
- print('ok', True)
+ print(int(df["id"].notna().sum()))
```

(Keep defect in code; soften or remove the word DEFECT; never auto-print success.)

---

## 7. Recommended Priority Order for Fixing

1. **P0 — ISSUE-03** Fix `norm_money` / decimal latino + expected output + align prose (blocks trust).  
2. **P0 — ISSUE-01 / Meta M1–M5** Rewrite opening map + jobRelevance without wxPython/V3/platform id.  
3. **P0 — ISSUE-07** Align T2-B-E3 starter/solution fixture and pass string.  
4. **P1 — ISSUE-08 / ISSUE-09** Repair weak/broken transfer exercises.  
5. **P1 — ISSUE-11** Specify You Do return contract + demo fixtures.  
6. **P1 — ISSUE-05 / ISSUE-02** Strip V3 from rubric/resources; clean seed GUI distractors; icon.  
7. **P1 — ISSUE-06** Remove `print('ok', True)` and soften `# DEFECT` authoring tags across We Do.  
8. **P2 — ISSUE-04 / ISSUE-15 / ISSUE-10** Redaction, date/cat map coverage, raise a few E1s toward “Competente”.  
9. **P2 — ISSUE-14** Reformat file to 2-space indent consistent with repo (mechanical).  
10. **P3 — ISSUE-13 / ISSUE-16** Richer learning outcomes; first-use Spanish glosses.

---

## 8. Graph Memory Update notes

For shared curriculum graph / Fixer context:

```yaml
section: 16
id: wxpython-gui
title: Calidad, limpieza y contratos de datos
file: src/lib/course/sections/s16-wxpython-gui.ts
explorer_score: 6.5
status: complete
edges:
  upstream: [s15-stdlib-deep]  # typed ingest → quality
  downstream: [s17-packaging]  # clean set + metrics → joins / CP-N2-A portfolio
  capstone: CP-N2-A-quality
strengths:
  - fail-closed quality narrative coherent
  - 8×3 GRR structure present
  - quarantine + audit + metrics pattern teachable
  - privacy / synthetic PE fixtures consistent
critical_nodes_to_fix:
  - meta_leak.wxpython_v3_map
  - theory.T3A.norm_money_decimal_latino
  - wedo.S16-T2-B-E3.oracle_mismatch
  - wedo.S16-T2-A-E3.noop_transfer
  - youdo.acceptance_underspecified
  - seed.gui_wx_distractors
do_not:
  - change platform id wxpython-gui (routing)
  - apply product edits in Explorer
gold_standard_delta: |
  Match S01 narrative clarity: open with student goal, not retarget changelog.
  Match industry data-contract demos: locale rules explicit and correct.
```

---

## Comparative quality (short)

| Dimension | S01 (gold-ish) | S16 (this run) |
| --- | --- | --- |
| Opening motivation | Strong, vocabulary first | Contaminated by retarget map |
| Technical correctness | High | High except money locale demo |
| GRR structure | Solid | Solid skeleton |
| Exercise oracle integrity | Generally careful | Several transfer bugs |
| Meta-leaks | Low | High (V3/wx/id) |
| You Do clarity | Clearer gates | Stub-level |

---

## Explorer process notes

- **Live site:** Homepage/curriculum listing for Sección 16 verified (title/tagline match). Full in-app lesson body is SPA-rendered; deep text audit used repository source `s16-wxpython-gui.ts` (same content the build ships) plus seed quiz battery.  
- **Passes completed:** surface scan → pedagogy → redaction → meta-leak hunt → external/best-practice comparison → exercise oracle inspection → diff architecture.  
- **No curriculum TS product files modified.**

---

This is the complete Explorer report for Section 16. Ready for the Fixer prompt.
