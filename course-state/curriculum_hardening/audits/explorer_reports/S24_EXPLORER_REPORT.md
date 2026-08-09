# S24 Explorer Report — OCR y Document AI (`rpa-advanced`)

**Auditor role:** Curriculum Auditor · Pedagogical Analyst · Technical Editor  
**Method:** Stanford STORM multipass + Graph Engineering + Loop Engineering  
**Scope constraint:** Section 24 only — analysis and proposed diffs; **no product edits applied**  
**Sources consulted:**
- Live catalog / SPA entry: https://pillb.github.io/pyarcana/ (section card S24 “OCR Document AI”; SPA body is client-rendered — deep content audited from source of truth)
- Repo source: `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s24-rpa-advanced.ts`
- Prior automated audit: `course-state/curriculum_hardening/audits/S24_AUDIT.json` (verdict ACCEPT, high_issue_count 0 — **boilerplate-only lens**, not pedagogy)
- Comparative gold: `s01-setup.ts` (early narrative depth); neighbor `s23-computer-vision.ts` (Browser RPA / CP-N2-C web adapter)
- External benchmarks: enterprise OCR/HITL field-level confidence practices; DeepLearning.AI / LandingAI Document AI progression (OCR → layout → agentic extraction)

---

## 1. Section Identification & Scope

| Field | Value |
|--------|--------|
| Index | 24 |
| Platform id (hash) | `rpa-advanced` |
| Live URL | https://pillb.github.io/pyarcana/#rpa-advanced |
| Source file | `src/lib/course/sections/s24-rpa-advanced.ts` |
| Title | OCR y Document AI |
| shortTitle | OCR Document AI |
| Tagline | extrae campos de documentos sintéticos, conserva bounding boxes/evidencia, abstiene bajo confidence y mide cada campo crítico |
| estimatedHours | 19 |
| level | Competente |
| phase | 1 |
| Capstone spine | Document intake **CP-N2-C** (between S23 Playwright web adapter and S25 IA endpoints) |

**In-scope content graph (nodes audited):**
- Metadata: jobRelevance, learningOutcomes (8), tagline
- Theory intro + **8 subtopics** (T1-A/B, T2-A/B, T3-A/B, T4-A/B) with paragraphs, code, callouts
- **I Do:** intro + 8 demos (one per subtopic)
- **We Do:** intro + **24 exercises** (guided / independent / transfer × 8)
- **You Do:** portfolio intake OCR sintético + rubric (6 criteria)
- **selfCheck:** 5 MCQs
- **resources:** docs (6), books (2), courses (4)
- **Absent nodes:** no `commonMistakes`, no `glossary`, no explicit bridge-from-S23 block, no multiarchivo real Tesseract lab in this TS module

**Out of scope this run:** fixing TS; S23/S25 content; runtime adapters outside this file.

---

## 2. Executive Summary of Quality

### Score: **6.8 / 10**

### Verdict
Section 24 is a **structurally complete, ethics-strong, spine-aligned** module for CP-N2-C document intake: synthetic image meta → preprocess → OCR confidence/bbox → schema → cross-field review queue → field-level golden metrics → hostile-file gates. The product narrative (“review ≠ fraud”, field-level abstention, real/fake adapter boundary) matches industry HITL document-processing practice and the course’s fail-closed culture.

However, quality is capped by:

1. **A domain-critical teaching bug** in `norm_total` that turns PE-style `"150,00"` into `15000.0` and presents that as the canonical demo output.  
2. **Systemic I Do I/O contract breakage** (declared `output` does not match what the printed code emits).  
3. **Visible curriculum/engineering meta-leaks** (legacy id, “path V3”, “Progressive disclosure”, rubric “gate V3”).  
4. **Exercise thinness** for *Competente* (many one-liners with identical boilerplate hints/feedback).  
5. **Weak connective tissue** from S23 (download/RPA handoff → OCR intake) and a title promise of “Document AI” that never shows layout-aware or commercial Document AI beyond resource links.

Automated `S24_AUDIT.json` ACCEPT (mean_visible_rank ~9.52) is **not** a pedagogy green light; it only confirms low boilerplate density.

**Learner impact if shipped as-is:** students can absorb the right *policy* (abstain, review queue, no fraud auto-label) while internalizing a **wrong monetary normalization**, distrusting demos whose printed output lies, and finishing 24 micro-exercises without assembling a coherent intake module until a under-specified You Do.

---

## 3. Detailed Issue Registry

Severity legend: **P0** blocker / wrong teaching · **P1** high pedagogical or trust damage · **P2** medium polish · **P3** nice-to-have

---

### ISSUE-01 — P0 — `norm_total` teaches incorrect PE amount parsing

**Location:** Theory `S24-T3-A` (`schema_norm.py`), lines ~197–217  
**Evidence quote:**
```python
def norm_total(s):
    s = s.replace(",", "").replace("PEN", "").strip()
    return float(s)

raw = {"ruc": "20.123456789", "total": "150,00", "fecha": "15/01/2026"}
# declared output: 'total': 15000.0
```
**Impact:** For a course situated in Perú, `"150,00"` is a two-decimal amount (150.00), not fifteen thousand. Stripping commas without treating comma-as-decimal (or declaring “US-only synthetic fixture”) **silently multiplies by 100**. Cross-field validation later compares line sums to total — a wrong total poisons the entire intake contract.  
**Graph edges:** T3-A → T3-B validate → T4-A golden field acc → You Do objectives → CP-N2-C package.  
**Pedagogy:** Violates progressive disclosure honesty: stdlib demo is fine; **wrong domain contract is not**.

---

### ISSUE-02 — P0 — I Do demos: declared `output` systematically mismatches runnable prints

**Location:** `iDo.steps[*].code.output` vs `code` for all 8 demos (esp. T1-A, T1-B, T3-A)  
**Evidence (T1-A):**
```python
print(preprocess({"w": 800, "h": 1000, "dpi": 72, "skew_deg": 2.0}))
print("min_dpi", 200)
print("ok", True)
# declared output: 200 True
# actual multi-line: full dict + "min_dpi 200" + "ok True"
```
**Evidence (T3-A):** `print(normalize_ruc(...))` returns a **tuple** `('20123456789', True)` but declared output is `20123456789 True`.  
**Impact:** Breaks learner trust in the “I Do” channel; graders and humans who mirror demos get confused. Pattern of trailing `print("ok", True)` suggests harness scaffolding that never aligned with the human-facing output field.  
**Pedagogy:** I Do fidelity failure (gradual release of responsibility requires *correct* model performance).

---

### ISSUE-03 — P1 — Meta-leak: legacy id + “path V3” in learner-facing jobRelevance

**Location:** `jobRelevance`  
**Evidence quote:**
> “Id legacy `rpa-advanced` se conserva; el path V3 es OCR/Document AI, no RPA de escritorio avanzado.”

**Impact:** Exposes curriculum migration / graph-id debt to the learner. Same pattern appears in S23 (`computer-vision` legacy). Confuses non-maintainers; clutters motivation with repo archaeology.  
**Meta-leak class:** developer ↔ learner channel bleed.

---

### ISSUE-04 — P1 — Meta-leak / jargon: “Progressive disclosure” as user-facing prose

**Location:** Theory intro first paragraph  
**Evidence quote:**
> “Progressive disclosure: demos stdlib; Tesseract solo si el runtime lo declara.”

**Impact:** Instructional-design term dumped without definition. The *policy* (stdlib first) is good; the meta label is not learner language. Prefer plain Spanish: “Primero demos con la biblioteca estándar; Tesseract solo si el entorno lo declara instalado.”

---

### ISSUE-05 — P1 — Meta-leak: You Do rubric “gate V3”

**Location:** `youDo.rubric[0]`  
**Evidence quote:**
> “Alineación al gate V3 de la sección” (25%)

**Impact:** Highest-weighted criterion is unintelligible without internal curriculum vocabulary. Students cannot self-score. Should map to observable outcomes (pipeline stages, golden metrics, policy review≠fraud).

---

### ISSUE-06 — P1 — Meta-leak: `# DEFECT labels cover…` in You Do starter

**Location:** `youDo.starterCode`  
**Evidence quote:**
```python
# DEFECT labels cover kv/schema/validate/metrics contracts
print("intake")
```
**Impact:** `DEFECT` comments in We Do starters are intentional “buggy seed” pedagogy; in You Do they read as author notes / incomplete scaffolding, not a clear student task. Undermines portfolio quality out of the box.

---

### ISSUE-07 — P1 — Narrative vs code contradiction on `coverage_auto`

**Location:** `S24-T4-A` paragraphs vs `golden_eval.py`  
**Evidence quote (prose):**
> “auto=7,review=3 → coverage 0.7”  
**Evidence quote (code):**
```python
coverage_auto = 0.5  # sintético
print("coverage_auto", coverage_auto)
# output: coverage_auto 0.5
```
**Impact:** Dual numbers for the same concept in one subtopic → cognitive dissonance; We Do later uses 7/3→0.7, so theory demo actively mis-teaches.

---

### ISSUE-08 — P1 — `denoise_binary` is pedagogically empty / tautological

**Location:** `S24-T1-B` `noise_orient.py`  
**Evidence quote:**
```python
return [0 if f == 1 and True else f for f in flags]  # “limpia” ruido marcado
```
**Impact:** `and True` is dead code; function simply maps every `1`→`0`. Teaches neither median filter, morphological open, nor “flag audit trail”. Risks cynicism (“this section fakes everything”) without labeling the *contract simulation* as clearly as FakeOcrAdapter is labeled.

---

### ISSUE-09 — P1 — Deskew ternary is a no-op both branches

**Location:** `S24-T1-A` `preprocess_meta`  
**Evidence quote:**
```python
out["skew_deg"] = 0.0 if abs(ang) < 0.5 else 0.0  # deskew simulado
```
**Impact:** Reads as a bug even if “deskew always zeros angle” is intentional. Confuses intermediate learners who just learned conditionals. Prefer `out["skew_deg"] = 0.0` + `deskew_applied = abs(ang) >= 0.5` with one explicit comment.

---

### ISSUE-10 — P1 — We Do exercises under-challenging for level Competente

**Location:** All 24 `weDo.steps`  
**Evidence examples:**
- E1 DPI: `print(max(dpi, 200))`
- E2 deskew: `print(abs(skew) >= 0.5)`
- E2 noise count: `print(sum(flags))`
- E1 golden: `print(correct / n)`

**Impact:** Scaffolding over-fragmented; transfer exercises rarely transfer. Cognitive load is *too low* on mechanics and *unstructured* on system integration (deferred entirely to thin You Do). Violates desirable difficulty / productive struggle for phase-1 Competente after Playwright RPA.

---

### ISSUE-11 — P1 — Identical boilerplate hints + feedback on every exercise

**Location:** every We Do step `hints` / `feedback`  
**Evidence quote (repeated 24×):**
```text
hints: ["contrato I/O en instruction", "compara output con solution", "datos sintéticos only"]
feedback: "Compara tu salida con la solución."
```
**Impact:** Zero adaptive scaffolding; no concept-specific misconceptions (e.g. “comma decimal”, “min conf not mean conf”, “bbox of value not label”). Harness residue visible as pedagogy.

---

### ISSUE-12 — P2 — Heading capitalization inconsistency

**Location:** Theory heading `ruido y orientación`  
**Evidence:** Other headings title-case-ish / sentence case starting capital; this one starts lowercase.  
**Impact:** Redaction polish; SPA ToC looks unprofessional.

---

### ISSUE-13 — P2 — Weak bridge from S23 (RPA download → OCR intake)

**Location:** Intro theory; jobRelevance; no reverse link  
**Evidence:** S23 closes web adapter / download; S24 opens mid-pipeline on synthetic image meta without stating handoff contract (`download_artifact` → `document_intake`).  
**Impact:** Graph edge CP-N2-C is implicit; learners may not see why S23 and S24 are sequential. Comparative: S01 spends multiple paragraphs on “why this section exists now.”

---

### ISSUE-14 — P2 — Self-check Q4 and Q5 overlap (mime/hostiles)

**Location:** `selfCheck.questions` indices 3 and 4  
**Evidence:** both test reject/allowlist of hostile or zip inputs.  
**Impact:** Missed coverage of orientation-before-OCR, bbox-on-value, schema versioning, coverage vs accuracy distinction, real vs fake adapter.

---

### ISSUE-15 — P2 — “Document AI” title vs content depth gap

**Location:** Section title + resources vs body  
**Evidence:** Body is synthetic token/KV heuristics; Azure/Google Document AI only in `resources.docs`. No layout reading-order exercise; tables only as `len(table)-1`.  
**Impact:** Title inflation vs DeepLearning.AI-style Document AI paths (layout → reading order → multimodal). Acceptable if progressive disclosure is *explained*, but see ISSUE-04. Recommend either (a) retitle shortTitle honesty “OCR intake sintético” or (b) one explicit “más allá del lab” callout mapping to Document AI processors.

---

### ISSUE-16 — P2 — Theory case numbers disagree across T3-B paragraphs and code

**Location:** `S24-T3-B`  
**Evidence prose:** “total 10.0 vs líneas 4+5”  
**Evidence code:** validates 150 vs [100,50] and 150 vs [100,40]  
**Impact:** Minor; still forces dual working memory sets.

---

### ISSUE-17 — P2 — Spanish redaction: English-heavy operational jargon without first-use gloss

**Location:** Throughout theory  
**Evidence tokens:** HITL (once expanded as idea not acronym consistently), fail-closed, coverage_auto, golden set, bbox, adapter, preflight, batch nocturno mixed with es-PE.  
**Impact:** Acceptable for Competente *if* first mention defines; several first uses assume S01–S16 vocabulary. Compared to S01 gold dictionary block, S24 has no mini-glosario de intake.

---

### ISSUE-18 — P2 — You Do under-specified relative to 19h claim / 8 outcomes

**Location:** `youDo`  
**Evidence:** starter is two lines; objectives list four bullets; no acceptance tests, no file layout, no sample golden JSON, no required CLI. Rubric weights generic.  
**Impact:** Portfolio variance huge; hard to assess “19h” including You Do. Outcomes promise preprocess/OCR/schema/validate/eval/privacy — starter only prints `"intake"`.

---

### ISSUE-19 — P3 — I Do `why` lines are telegraphic

**Location:** e.g. `why: "Low conf → abstenerse."`  
**Impact:** Missed chance for causal explanation in the demonstration channel (I Do should model expert thinking, not only slogans).

---

### ISSUE-20 — P3 — Resources: books lack URLs; Coursera query link is weak

**Location:** `resources.books`, `resources.courses[0]`  
**Impact:** Discoverability; not wrong, just low polish vs docs block.

---

### ISSUE-21 — P2 — Potential JS template-literal escape risk on `\D` in some starters

**Location:** We Do starters that use `r'\D'` inside backtick strings (vs `r'\\D'` in solutions)  
**Evidence:** T3-A-E3 starter `re.sub(r'\D','',raw)` vs solution `r'\\D'`.  
**Impact:** Depending on bundler/TS target, `\D` may not survive as Python `\D`. Risk of broken starters. Standardize on `r"\\D"` in all TS template literals.

---

### ISSUE-22 — P3 — Learning outcomes vs exercise map: layout/columns never practiced

**Location:** LO “Ejecutar OCR con idiomas, layout y confidence”; theory T2-A mentions columns; We Do never exercises reading order.  
**Impact:** Outcome overclaim relative to practice graph.

---

## 4. Meta-Leak Report

| # | Exact leaked / meta text | Location | Learner-visible? | Recommended disposal |
|---|--------------------------|----------|------------------|----------------------|
| M1 | `Id legacy \`rpa-advanced\` se conserva; el path V3 es OCR/Document AI, no RPA de escritorio avanzado.` | `jobRelevance` | Yes | Move to maintainer comment or SECTION_MAP note; rewrite jobRelevance as pure learner value prop |
| M2 | `Progressive disclosure: demos stdlib; Tesseract solo si el runtime lo declara.` | Theory intro §1 | Yes | Rephrase in plain es-PE without ID jargon |
| M3 | `Alineación al gate V3 de la sección` | `youDo.rubric[0]` | Yes | Replace with measurable criteria list |
| M4 | `# DEFECT labels cover kv/schema/validate/metrics contracts` | `youDo.starterCode` | Yes | Replace with TODO student checklist in Spanish |
| M5 | Repeated harness triad `contrato I/O en instruction` / `compara output con solution` / `datos sintéticos only` | All We Do `hints` | Yes | Per-exercise conceptual hints |
| M6 | Pattern `print("ok", True)` + mismatched `output` in I Do | All I Do demos | Yes (as broken demos) | Align harness prints with declared outputs or drop harness prints from learner view |

**meta_leak_count (strict user-facing curriculum/engineering leaks M1–M4): 4**  
**Expanded harness/meta patterns (M1–M6): 6**

No AI-to-developer monologues of the form “moved from section X” or “TODO fix later” beyond DEFECT/V3/legacy patterns above. Ethics fail-closed text is **product policy**, not meta-leak.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 Pre-round research (topic-relevant)

- Enterprise document pipelines emphasize **field-level confidence + HITL queues**, not document-global accuracy; validation rules catch business-impossible values even when OCR conf is high.  
- Modern Document AI curricula (e.g. DeepLearning.AI / LandingAI arc) sequence: classical OCR → layout/reading order → multimodal/agentic extraction. S24 correctly stays early in that arc if honest about scope.  
- Gradual release (I/We/You) requires: expert model correct → guided practice with fading support → independent performance with clear success criteria.  
- Cognitive load: extrinsic load rises when outputs lie, jargon unexplained, or exercises are pure busywork before a vague capstone.

### 5.2 I Do / We Do / You Do fidelity

| Channel | Structure | Fidelity assessment |
|---------|-----------|---------------------|
| I Do | 8 demos mapped 1:1 to subtopics | **Form complete, content broken** (ISSUE-02 outputs). Whys too short. |
| We Do | 24 = 3×8 guided→independent→transfer | **Form excellent, challenge weak** (ISSUE-10/11). Transfer often still one print. |
| You Do | Portfolio intake | **Under-scaffolded** (ISSUE-06/18). Weight 25% on opaque “gate V3”. |
| selfCheck | 5 MCQ | Ethics + field metrics good; **hostiles double-tested** (ISSUE-14). |

### 5.3 Connective tissue & narrative flow

**Strengths:** Explicit T1→T4 order in intro; repeated anti-fraud framing; PE synthetic cases (RUC, Lima backoffice); real/fake adapter callout.  
**Weaknesses:** No entrance bridge from S23 download; no exit bridge to S25 (OCR text as untrusted input / injection — S25 actually mentions OCR injection, S24 does not foreshadow). Paragraphs are dense “contract dumps” vs S01’s teaching prose.

### 5.4 Cognitive load & progressive disclosure

- **Good:** Simulating image ops as metadata avoids OpenCV install wall.  
- **Bad:** Simulation sometimes unmarked as toy (denoise); PE money bug adds *wrong* germane load.  
- Progressive disclosure of Tesseract is stated but never shown even as optional multi-file path *in this section file* (unlike S23 which references multiarchivo real API).

### 5.5 Exercise & exam alignment

| Outcome | Practiced? |
|---------|------------|
| Preprocess DPI/deskew/crop | Yes (thin) |
| Noise/orientation | Yes (thin; denoise fake) |
| OCR lang/layout/conf | conf yes; layout **no** |
| KV/tables | KV yes; tables count only |
| Schema normalize | Yes (**wrong total**) |
| Cross-field + queue | Yes (policy good) |
| Golden per field | Yes |
| Privacy/hostile/fallback | Yes |

selfCheck aligns with abstention, mismatch≠fraud, field accuracy, hostiles — not with orientation-first or schema versioning.

### 5.6 Roadmap consistency

- Aligns with CP-N2-C spine and S26 VP close messages (OCR does not emit fraud labels) — **strong**.  
- Legacy id mismatch (`rpa-advanced` vs title OCR) is roadmap debt; same class as S23 `computer-vision`.  
- Filename `s24-rpa-advanced.ts` vs title continues graph debt.

### 5.7 Comparison vs external gold & early course gold

| Benchmark | S24 vs benchmark |
|-----------|------------------|
| S01 narrative depth | S24 much thinner explanations; no dictionary block |
| S23 neighbor | S23 better at real-vs-CI dual path transparency; S24 weaker bridge |
| Enterprise HITL OCR guides | Ethics/confidence field design **aligned** |
| Document AI short courses | Missing layout/reading-order layer; resources partially compensate |

### 5.8 Redaction & es-PE grammar

Overall Spanish is competent professional es-LATAM. Issues: lowercase heading; English labels; “fancy” informal in I Do why (“modelo fancy”); mixed punctuation around em-dashes. No major grammar collapse. Currency pedagogy error is domain, not grammar.

### 5.9 Accessibility / motivation / other

- Motivation: strong job story (document intake) but diluted by meta-leaks.  
- Accessibility: bbox-for-reviewer is a strong a11y-adjacent practice for human UI; not named as such.  
- Privacy: excellent synthetic-only framing.

---

## 6. Proposed GitHub-style Diffs

> Diffs are **proposals only** — not applied. Paths relative to repo root.

### Diff A — ISSUE-01 fix `norm_total` (PE-aware didactic)

```diff
--- a/src/lib/course/sections/s24-rpa-advanced.ts
+++ b/src/lib/course/sections/s24-rpa-advanced.ts
@@
-def norm_total(s):
-    s = s.replace(",", "").replace("PEN", "").strip()
-    return float(s)
-
-raw = {"ruc": "20.123456789", "total": "150,00", "fecha": "15/01/2026"}
-print({
-    "ruc": norm_ruc(raw["ruc"]),
-    "total": norm_total(raw["total"]),
-    "fecha": norm_fecha(raw["fecha"]),
-    "schema": "invoice.v1",
-})`,
-        output: `{'ruc': '20123456789', 'total': 15000.0, 'fecha': '2026-01-15', 'schema': 'invoice.v1'}`,
+def norm_total(s):
+    # Fixture PE didáctica: "150,00" o "1.150,00" → float
+    s = s.replace("PEN", "").strip().replace(" ", "")
+    if "," in s and "." in s:
+        s = s.replace(".", "").replace(",", ".")
+    elif "," in s:
+        s = s.replace(",", ".")
+    return float(s)
+
+raw = {"ruc": "20.123456789", "total": "150,00", "fecha": "15/01/2026"}
+print({
+    "ruc": norm_ruc(raw["ruc"]),
+    "total": norm_total(raw["total"]),
+    "fecha": norm_fecha(raw["fecha"]),
+    "schema": "invoice.v1",
+})`,
+        output: `{'ruc': '20123456789', 'total': 150.0, 'fecha': '2026-01-15', 'schema': 'invoice.v1'}`,
```

Also add one sentence in T3-A paragraphs: normalizar montos PE (coma decimal) vs EN (punto), never strip commas blindly.

---

### Diff B — ISSUE-02 align I Do T1-A demo I/O (pattern for all 8)

```diff
--- a/src/lib/course/sections/s24-rpa-advanced.ts
+++ b/src/lib/course/sections/s24-rpa-advanced.ts
@@
-print(preprocess({"w": 800, "h": 1000, "dpi": 72, "skew_deg": 2.0}))
-print("min_dpi", 200)
-print("ok", True)
-`,
-          output: `200 True`,
+out = preprocess({"w": 800, "h": 1000, "dpi": 72, "skew_deg": 2.0})
+print(out["dpi"], out["deskew"])
+`,
+          output: `200 True`,
```

Repeat pattern: **one meaningful print** matching `output`; drop harness `ok` lines from learner-facing demos (or include them in `output` consistently).

T3-A example:

```diff
-print(normalize_ruc("20.123456789"))
-print("schema", True)
-print("ok", True)
-`,
-          output: `20123456789 True`,
+d, ok = normalize_ruc("20.123456789")
+print(d, ok)
+`,
+          output: `20123456789 True`,
```

---

### Diff C — ISSUE-03/04 jobRelevance + intro meta cleanup

```diff
--- a/src/lib/course/sections/s24-rpa-advanced.ts
+++ b/src/lib/course/sections/s24-rpa-advanced.ts
@@
-  jobRelevance:
-    "El **document intake** de CP-N2-C convierte imágenes sintéticas en campos con evidencia (bbox, confidence) y cola de revisión. OCR vía contrato común `real`/`fake`; abstenerse bajo confidence es control de calidad, no veredicto de fraude. Id legacy `rpa-advanced` se conserva; el path V3 es OCR/Document AI, no RPA de escritorio avanzado.",
+  jobRelevance:
+    "El **document intake** de CP-N2-C convierte imágenes sintéticas en campos con evidencia (bbox, confidence) y cola de revisión. OCR se expone con un contrato común `real`/`fake` para tests; abstenerse bajo confidence es control de calidad, no veredicto de fraude. En backoffice (p. ej. facturas sintéticas de Lima), el valor profesional es encolar bien — no «cerrar» por score.",
@@
-        "Aquí construyes el **document intake** de CP-N2-C: imagen sintética → preproceso → adapter OCR (confidence + bbox) → normalización a schema → validación cross-field → golden set por campo. En un backoffice sintético de facturas en Lima, el objetivo es encolar revisión, no “cerrar” casos por score. Progressive disclosure: demos stdlib; Tesseract solo si el runtime lo declara.",
+        "Aquí construyes el **document intake** de CP-N2-C: imagen sintética → preproceso → adapter OCR (confidence + bbox) → normalización a schema → validación cross-field → golden set por campo. En un backoffice sintético de facturas en Lima, el objetivo es encolar revisión, no “cerrar” casos por score. Primero practicamos con la biblioteca estándar y adapters simulados; un motor real (p. ej. Tesseract) solo entra si el entorno lo declara instalado.",
```

---

### Diff D — ISSUE-05/06 You Do rubric + starter

```diff
--- a/src/lib/course/sections/s24-rpa-advanced.ts
+++ b/src/lib/course/sections/s24-rpa-advanced.ts
@@
-    starterCode: `tokens = [{"text": "RUC: 20123456789", "conf": 0.9, "bbox": [0,0,1,1]}]
-# DEFECT labels cover kv/schema/validate/metrics contracts
-print("intake")
-`,
+    starterCode: `tokens = [{"text": "RUC: 20123456789", "conf": 0.9, "bbox": [0, 0, 1, 1]}]
+# TODO estudiante: preprocess → parse_kv → norm → validate → field_acc
+# Política: needs_review ≠ fraude; datos sintéticos only
+print("intake_ready")
+`,
@@
-      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
+      { criterion: "Pipeline completo: preproceso → OCR simulado → schema → validación → métricas por campo", weight: "25%" },
```

---

### Diff E — ISSUE-07 golden coverage demo

```diff
--- a/src/lib/course/sections/s24-rpa-advanced.ts
+++ b/src/lib/course/sections/s24-rpa-advanced.ts
@@
-coverage_auto = 0.5  # sintético
-print("coverage_auto", coverage_auto)`,
-        output: `acc_ruc 0.5
-acc_total 0.5
-coverage_auto 0.5`,
+auto, review = 7, 3
+coverage_auto = auto / (auto + review)
+print("coverage_auto", coverage_auto)`,
+        output: `acc_ruc 0.5
+acc_total 0.5
+coverage_auto 0.7`,
```

---

### Diff F — ISSUE-08/09 preprocess + denoise honesty

```diff
--- a/src/lib/course/sections/s24-rpa-advanced.ts
+++ b/src/lib/course/sections/s24-rpa-advanced.ts
@@
-    out["skew_deg"] = 0.0 if abs(ang) < 0.5 else 0.0  # deskew simulado
-    out["deskew_applied"] = abs(ang) >= 0.5
+    out["deskew_applied"] = abs(ang) >= 0.5
+    out["skew_deg"] = 0.0  # tras deskew simulado el ángulo queda corregido
@@
-def denoise_binary(flags):
-    # flags: lista 0/1 ruido
-    return [0 if f == 1 and True else f for f in flags]  # “limpia” ruido marcado
+def denoise_binary(flags):
+    # Simulación de contrato: píxeles marcados como ruido (1) se apagan (0).
+    # Un denoise real usaría filtros; aquí solo auditamos el flag.
+    return [0 if f == 1 else f for f in flags]
```

---

### Diff G — ISSUE-12 heading

```diff
-      heading: "ruido y orientación",
+      heading: "Ruido y orientación",
```

---

### Diff H — ISSUE-13 bridge paragraph (insert as new first sentence of intro or new short para)

```diff
+        "Llegas desde el adaptador web de S23: un download verificado (PDF/PNG sintético) es la entrada típica del intake. Aquí no re-scrapeas el portal — **consumes el artefacto** y lo conviertes en campos con evidencia.",
```

---

### Diff I — ISSUE-14 selfCheck diversification (replace Q5)

```diff
-      {
-        question: "Un documento hostil (zip o tamaño sobre cupo) debe…",
-        options: ["forzar OCR con más DPI", "etiquetarse fraude automáticamente", "aceptarse si el mime dice pdf en el nombre de archivo", "rechazarse en el gate de admisión antes del motor"],
-        correctIndex: 3,
-        explanation:
-          "Allowlist de mime/tamaño es defensa en profundidad; no se confía en la extensión sola.",
-      }
+      {
+        question: "Si los scores de orientación dan lo mejor en 180° con score 0.7, ¿cuándo corres OCR?",
+        options: [
+          "Antes de rotar, para ganar tiempo",
+          "Después de corregir orientación",
+          "Solo si conf media > 0.9",
+          "Nunca; se etiqueta fraude",
+        ],
+        correctIndex: 1,
+        explanation:
+          "Orientación incorrecta rompe layout y puede dar confidence alta en basura; corrige antes del motor.",
+      }
```

---

### Diff J — ISSUE-11 sample conceptual hints (one exercise; replicate pattern)

```diff
--- a/src/lib/course/sections/s24-rpa-advanced.ts
+++ b/src/lib/course/sections/s24-rpa-advanced.ts
@@ S24-T2-A-E3
-        hints: [
-          "contrato I/O en instruction",
-          "compara output con solution",
-          "datos sintéticos only",
-        ],
+        hints: [
+          "No promedies confidences: un campo débil tumba el auto-accept",
+          "min(confs) y luego compara con el umbral 0.8",
+          "Formato de impresión: número, espacio, status",
+        ],
+        feedback: "Si imprimiste 'auto' con min=0.75, estás ocultando el campo débil bajo un promedio mental.",
```

---

### Diff K — ISSUE-15 scope honesty callout (optional after intro)

```diff
+      callout: {
+        type: "info",
+        title: "Alcance de esta sección",
+        content:
+          "Aquí dominas el **contrato de intake** (evidencia, abstención, schema, golden por campo). Layout multi-columna y processors comerciales de Document AI quedan como lectura en Recursos y como extensión opcional cuando el runtime lo permita.",
+      },
```

---

### Diff L — ISSUE-21 standardize regex escapes in TS templates

```diff
-d=re.sub(r'\D','',raw)
+d=re.sub(r'\\D', '', raw)
```
Apply to every Python `\D` inside backtick strings in this file.

---

### Diff M — ISSUE-10 (directional, larger rewrite — not a minimal patch)

For at least **one transfer per topic**, expand to 8–15 line functions with multi-assert narrative (e.g. T3-B-E3: build full `validate` returning `(status, reasons)` for two docs). Keep guided one-liners if desired, but make transfer compose prior skills. Full rewrite omitted here to keep Fixer loops atomic; prioritize Diffs A–B first.

---

## 7. Recommended Priority Order for Fixing

| Priority | Issues | Rationale |
|----------|--------|-----------|
| **1 (ship blockers)** | ISSUE-01 (norm_total), ISSUE-02 (I Do outputs) | Wrong domain truth + broken trust in demos |
| **2 (meta hygiene)** | ISSUE-03, 04, 05, 06 | Remove curriculum engineering from learner surface |
| **3 (internal consistency)** | ISSUE-07, 08, 09, 16, 21 | Code/prose honesty and escape safety |
| **4 (pedagogy depth)** | ISSUE-10, 11, 18, 14, 19 | Challenge, hints, You Do, quiz coverage |
| **5 (narrative polish)** | ISSUE-12, 13, 15, 17, 20, 22 | Bridge, title honesty, redaction, LO map |

**Suggested Fixer loop budget:**  
- Loop 1: Diffs A, B (all I Do), C, D, E, F, G, L  
- Loop 2: Diffs H, I, J (sample then batch hints), K, expand 4 transfer exercises + You Do acceptance list  

Do **not** reintroduce ethics boilerplate tails (per global hardening rules). Keep anti-fraud product policy (short, once per topic max).

---

## 8. Graph Memory Update notes

For shared curriculum graph / future Explorer runs:

```yaml
section: 24
id: rpa-advanced
title: OCR y Document AI
file: src/lib/course/sections/s24-rpa-advanced.ts
spine: CP-N2-C document_intake
upstream_edge:
  from: S23 computer-vision (Playwright web adapter / download)
  relation: artifact_handoff (weakly documented — ISSUE-13)
downstream_edge:
  to: S25 streamlit-dashboards / IA endpoints
  relation: OCR_text_as_untrusted_input (foreshadow missing in S24)
  to: S26 integrator-phase1
  relation: no_fraud_label_from_OCR (aligned)
quality:
  explorer_score: 6.8
  automated_audit: ACCEPT (boilerplate lens only)
  p0_open: [norm_total_PE, iDo_output_mismatch]
  meta_leaks: [legacy_id_V3, progressive_disclosure_jargon, gate_V3_rubric, DEFECT_youDo]
strengths:
  - field_level_confidence_HITL
  - review_neq_fraud policy
  - real_fake_adapter framing
  - hostile_mime_size_gates
  - full 8-subtopic x guided/indep/transfer skeleton
fix_priority: [P0_norm_total, P0_iDo_IO, meta_strip, coverage_demo, exercise_depth]
nodes_missing:
  - commonMistakes
  - glossary_intake
  - bridge_S23
  - layout_reading_order_practice
```

**Comparative note for Graph Engineering:** S24 is an example of **high structural completeness + mid content correctness**. Future Explorers should always execute sample theory/I Do snippets mentally (or in REPL) against declared `output` — automated ACCEPT audits do not catch ISSUE-01/02.

---

## Quality multipass checklist (Loop Engineering)

| Pass | Focus | Residual open? |
|------|--------|----------------|
| 1 Surface scan | Structure, LOs, I/We/You present | No |
| 2 Pedagogy | I/We/You fidelity, load, outcomes map | Yes — thin We Do / You Do |
| 3 Redaction & grammar | es-PE, headings | Yes — minor |
| 4 Meta-leak | V3/legacy/DEFECT/hints | Yes until Fixer |
| 5 Comparative | vs S01/S23/external Document AI | Documented |
| 6 Diff architect | Ready-to-apply patches A–L | Ready |
| 7 Consistency re-loop | norm_total ↔ golden ↔ validate numbers | Flagged |

No significant issue class left unreported for Fixer consumption.

---

This is the complete Explorer report for Section 24. Ready for the Fixer prompt.
