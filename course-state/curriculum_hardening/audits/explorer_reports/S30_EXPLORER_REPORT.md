# S30 Explorer Report — Entity resolution probabilístico (`security-infra`)

**Auditor role:** Curriculum Auditor · Pedagogical Analyst · Technical Editor  
**Method:** Stanford STORM multi-pass + Graph Engineering + Loop Engineering  
**Scope:** Section 30 only (no content fixes applied)  
**Sources:** Live site catalog + repo source `src/lib/course/sections/s30-security-infra.ts` + related UI labels in `SectionView.tsx` / `PdfReport.tsx`  
**Pre-round research:** Fellegi–Sunter / Splink theory guides, blocking recall tradeoffs, gradual release of responsibility (I/We/You Do), cognitive load & progressive disclosure

---

## 1. Section Identification & Scope

| Field | Value |
|--------|--------|
| **Index** | 30 |
| **Platform id (hash)** | `security-infra` |
| **Live URL** | https://pillb.github.io/pyarcana/#security-infra |
| **Source file** | `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s30-security-infra.ts` |
| **Title (metadata)** | Entity resolution probabilístico |
| **shortTitle / catalog** | ER probabilístico |
| **Tagline** | Testable Entity Resolution Engine con benchmark etiquetado, blocking medido, comparadores explicables y cola de revisión |
| **Level / phase / hours** | Competente · phase 2 · 18h |
| **Capstone role** | Cierre **CP-N3-A** (motor ER testeable) |
| **Adjacent path** | S29 SQL almacén ER → **S30 ER probabilístico** → S31 grafos y evidencia (CP-N3-B) |
| **Legacy mismatch** | File/id still named `security-infra`; product UI still carries Zero Trust / “Sec/Infra” residue |

**In-scope content nodes audited**

- Metadata: `jobRelevance`, 8 learning outcomes  
- Theory: intro + 8 subtopics (`S30-T1-A` … `S30-T4-B`) with code, outputs, callouts  
- I Do: intro + 8 demos  
- We Do: intro + 24 exercises (guided / independent / transfer × 8)  
- You Do: portfolio, starter, rubric, portfolioNote  
- Self-check: 5 MCQs  
- Resources: docs / books / courses  
- Cross-file UI: `SectionView.tsx` demo keyed by `security-infra`; `PdfReport.tsx` label  

**Out of scope:** Applying fixes; editing product TS; other sections except comparative references.

---

## 2. Executive Summary of Quality

### Score: **4.2 / 10**

### Verdict

S30 has a **sound conceptual spine** for probabilistic entity resolution (comparators → blocking → weights/thresholds → evaluation) and a **strong ethical contract** (ER = same entity; scores prioritize clerical review; never auto-fraud). That spine aligns with S29 (SQL store) and S31 (graphs) and with industry practice (blocking + candidate recall, grey-zone review, entity-level split to avoid identity leakage).

However, the **student-facing delivery is severely degraded** by:

1. **Broken I Do fidelity** — multiple demos declare `output` strings that do not match the code that would run.  
2. **Meta / harness leakage** — “DEFECT”, “oráculo”, “gate V3”, “lane califica PASS”, seed/checkpoint/ledger language, and explicit legacy-id V3 notes appear in learner text.  
3. **Boilerplate flood** — the same safety/fixture paragraphs are copy-pasted into nearly every theory block, drowning progressive disclosure.  
4. **We Do shallow / oracle-driven** — many “exercises” are inverted one-liners or pure string prints, not ER design practice.  
5. **Product residue of the old security section** — `SectionView` still ships a **Zero Trust** playground under `security-infra`; PDF label is still **“30. Sec/Infra”**.

Compared with gold-standard early sections (e.g. S02 narrative density and code/output honesty), S30 feels like a **compressed gate checklist** rather than a taught chapter. Automated `S30_AUDIT.json` marked ACCEPT with zero high issues — that pass measures surface boilerplate rank, **not** demo correctness or pedagogical depth. Explorer verdict overrides that for Fixer priority.

**Strengths to preserve:** ethics framing; T1–T4 map; theory blocking demo that *shows* accent-fold failure (if reframed); resources pointing to Splink / Christen / RapidFuzz; self-check conceptual targets.

---

## 3. Detailed Issue Registry

Severity: **P0** = blocks learning or trust · **P1** = major pedagogy/quality · **P2** = polish / consistency · **P3** = nice-to-have

### ISSUE-01 — I Do code ≠ declared output (blocking demo)
- **Severity:** P0  
- **Location:** `iDo.steps` · `S30-T2-A-DEMO`  
- **Evidence:** Code prints `block_sizes(recs)`, `"blocking" True`, `"ok" True`. Declared `output` is `recall 1.0 ncand 1`.  
- **Pedagogical impact:** Learner “runs” the demo (mentally or in playground) and cannot reconcile result with lesson. Undermines trust in every subsequent demo.  
- **Graph edge:** T2-A theory (candidate recall) ↛ I Do node (broken fidelity).

### ISSUE-02 — I Do code ≠ declared output (cost / impossible pairs)
- **Severity:** P0  
- **Location:** `S30-T2-B-DEMO`  
- **Evidence:** Code: `print("cost", pair_cost([5, 20]))` → `cost 200`; `print("impossible_all_pairs", pair_cost([1000]))` → large integer; `print("ok", True)`. Output claims `cost 200` / `impossible True`.  
- **Pedagogical impact:** Demo never teaches the impossible-pair filter it describes; second line is mislabeled.

### ISSUE-03 — I Do code ≠ declared output (thresholds)
- **Severity:** P0  
- **Location:** `S30-T3-A-DEMO`  
- **Evidence:** Code only prints weighted score + flags; never calls `decide`. Output: `0.94 auto_match`.  
- **Pedagogical impact:** Core CP-N3-A decision policy (auto/review/non) is claimed but not demonstrated.

### ISSUE-04 — I Do code ≠ declared output (entity split)
- **Severity:** P0  
- **Location:** `S30-T4-A-DEMO`  
- **Evidence:** `print(entity_split(...))` → `(2, 1)` plus extra flags; output string `train 2 test 1`.  
- **Pedagogical impact:** Format mismatch confuses automated/self-check habits taught in S27–S28.

### ISSUE-05 — I Do code ≠ declared output (metrics)
- **Severity:** P0  
- **Location:** `S30-T4-B-DEMO`  
- **Evidence:** `pr_metrics` returns two floats; code never builds error indices. Output invents `1.0 0.5 [1]`.  
- **Pedagogical impact:** Error-slice story in theory T4-B is not shown in I Do.

### ISSUE-06 — Stale Zero Trust playground still keyed to `security-infra`
- **Severity:** P0  
- **Location:** `src/components/course/SectionView.tsx` ≈ lines 2408–2458 (`'security-infra': { title: 'Practica Zero Trust y logging', ... }`)  
- **Evidence:** Entire demo is authZ / structlog / SHA256 integrity — **security hardening**, not ER.  
- **Pedagogical impact:** If this playground surfaces for S30, learners practice the **wrong domain** while the section claims entity resolution. Contradicts jobRelevance note that path V3 is not server hardening.

### ISSUE-07 — PDF / report label still “Sec/Infra”
- **Severity:** P1  
- **Location:** `src/components/course/PdfReport.tsx` line 70: `"security-infra": '30. Sec/Infra'`  
- **Evidence:** Catalog and section title say ER probabilístico; report label says security.  
- **Pedagogical impact:** Portfolio/PDF artifacts misname the capstone for employers and for the student.

### ISSUE-08 — Learner-facing legacy / V3 meta in jobRelevance
- **Severity:** P1  
- **Location:** `jobRelevance`  
- **Evidence:** *“Id legacy `security-infra` se conserva; el path V3 es entity resolution probabilístico, no hardening de servidores.”*  
- **Pedagogical impact:** Internal curriculum migration note shown as career framing. Breaks immersion; confuses onboarding.

### ISSUE-09 — “En V3” developer framing in theory intro
- **Severity:** P1  
- **Location:** first theory block, first paragraph  
- **Evidence:** *“En V3, **S30 cierra CP-N3-A**…”*  
- **Pedagogical impact:** Versioning meta belongs in maintainer docs, not the lesson opening.

### ISSUE-10 — Mass theory boilerplate (safety + fixture + PE case repeated)
- **Severity:** P1  
- **Location:** nearly all paragraphs in T1-B … T4-B  
- **Evidence (recurring templates):**  
  - *“Un score de matching solo prioriza revisión humana: ER responde ¿misma entidad?…”*  
  - *“Contrato operativo: entrada pares sintéticos `CASO-LIM-030` (run_id=cpn3a-er) → decisión auto_match|review|non_match…”*  
  - *“Caso PE / Caso sintético PE: contactos Lima `@example.pe` en cola clerical… Union-Find…”*  
  - Often **Documenta evidencia y límites del fixture…** twice in the same subtopic.  
- **Count:** ≥21 paste-like occurrences of these templates in theory alone.  
- **Pedagogical impact:** Extreme **extraneous cognitive load** (Sweller). Progressive disclosure collapses: every subtopic restarts the same policy sermon instead of deepening one idea. Early gold sections (S02) state policy once and then teach.

### ISSUE-11 — We Do instruction template is harness meta, not teaching voice
- **Severity:** P1  
- **Location:** all 24 `weDo.steps[].instruction`  
- **Evidence (uniform tail):** *“…implementa solo el DEFECT indicado… pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.”*  
- **Pedagogical impact:** Students learn oracle-harness jargon (DEFECT, oráculo, pass string) instead of a natural We Do prompt. Spanglish “only”. Reduces transfer to interview/portfolio language.

### ISSUE-12 — Starter `# DEFECT:` comments and multi-print starters vs single-line solutions
- **Severity:** P1  
- **Location:** all We Do starters vs solutions  
- **Evidence:** Starters typically print 2–3 lines (`policy` / `want` / `ok`); solutions print **one** line matching `output`. Instruction says match solution output exactly.  
- **Pedagogical impact:** If the student only flips the defective expression but leaves extra prints, they “fail” despite correct concept. Teaches copy-paste of solution, not understanding.

### ISSUE-13 — We Do exercises often too shallow for “Competente / 18h / CP-N3-A”
- **Severity:** P1  
- **Location:** multiple E3 / transfer steps  
- **Evidence examples:**  
  - `S30-T1-B-E3`: print `'informative_missing'`  
  - `S30-T2-B-E3`: print `'filter_before_score'`  
  - `S30-T3-B-E3`: print `'ER_only_same_entity'`  
  - `S30-T4-A-E3`: print `'entity_split'`  
  - `S30-T4-B-E3`: print `['missing_phone']`  
  - `S30-T1-A-E1`: invert boolean for exact match on `'a'=='a'`  
  - `S30-T1-A-E3`: `date` compared to itself  
- **Pedagogical impact:** Bloom’s taxonomy stuck at **recall of labels**, not apply/analyze. 24 exercises create illusion of volume without skill building. Transfer kinds do not transfer.

### ISSUE-14 — Theory blocking demo shows recall 0.0 without explicit “bug lesson” framing
- **Severity:** P2  
- **Location:** theory `S30-T2-A` code  
- **Evidence:** `Ana López` vs `ANA lopez` → keys `lópez|lim` vs `lopez|lim` → `candidate_recall 0.0`. Callout only says measure recall.  
- **Pedagogical impact:** Excellent potential *failure case* for accent folding / normalization, but under-explained; learners may think the blocking design is correct and the metric is broken.

### ISSUE-15 — `exact` theory claims post-normalization but code is raw `==`
- **Severity:** P2  
- **Location:** theory T1-A paragraph vs `exact` function  
- **Evidence:** Text: *“Exact: igualdad post-normalización (`casefold`+espacios)”*; code: `return 1.0 if a == b else 0.0` with already-identical emails only.  
- **Pedagogical impact:** Concept/code gap; I Do T1-A uses `.lower()` inconsistently with theory `casefold`.

### ISSUE-16 — Fellegi–Sunter reduced to weighted average without m/u clarity
- **Severity:** P2  
- **Location:** theory T3-A; frequency_weight in T1-B  
- **Evidence:** Mentions “m/u” and “u-probability” lightly; implementation is `sum(sim*w)/sum(w)`. External gold (Splink / Linacre) treats match weight as log₂(m/u) with prior λ.  
- **Pedagogical impact:** Acceptable if clearly labeled “didactic simplification,” but risk of **false confidence** that students “know FS.” Frequency weight `base/f` is not FS u-probability.

### ISSUE-17 — You Do / rubric meta-leak (lanes, gates, seed/ledger)
- **Severity:** P1  
- **Location:** `youDo.context`, `portfolioNote`, `rubric[0]`  
- **Evidence:**  
  - *“No editar seed/checkpoint/ledger ni marcar passed.”*  
  - *“Otra lane califica PASS del gate; esta autoría no escribe checkpoint/ledger/seed.”*  
  - Rubric: *“Alineación al gate V3 de la sección”* (25%)  
- **Pedagogical impact:** Internal multi-agent / harness process leaks into portfolio brief. Student-facing rubric should describe *deliverable quality*, not gate versioning.

### ISSUE-18 — Self-check thin explanations and small item bank
- **Severity:** P2  
- **Location:** `selfCheck.questions` (n=5)  
- **Evidence:** Explanations like *“ER ≠ relación ≠ riesgo.”*, *“Banda gris = humanos.”*  
- **Pedagogical impact:** Active recall exists but feedback does not re-teach. Missing items: missing≠disagree, OR vs AND blocking, cluster metrics vs pairwise, impossible pairs.

### ISSUE-19 — Resource quality: NIST TRECVID link is wrong domain
- **Severity:** P2  
- **Location:** `resources.docs` NIST entry  
- **Evidence:** URL `https://www.nist.gov/itl/iad/image-group/trecvid-entity-detection` is **video/entity detection in images**, not record linkage ER.  
- **Pedagogical impact:** Misdirects independent study; damages credibility next to good Splink/Christen links.

### ISSUE-20 — Filename / id / icon / accent vs content (consistency debt)
- **Severity:** P2  
- **Location:** `s30-security-infra.ts`, `id: "security-infra"`, icon `GitMerge` (ok-ish), catalog short title OK  
- **Evidence:** SECTION_MAP and prompts acknowledge rename; product surface still half-migrated (Issues 06–08).  
- **Pedagogical impact:** Maintainers and students navigate by conflicting names; search “security” finds ER chapter.

### ISSUE-21 — Connective tissue weak between theory paragraphs (local)
- **Severity:** P2  
- **Location:** each T*-* block after first unique sentence  
- **Evidence:** Second and third paragraphs rarely advance the first idea; they restate global contract.  
- **Pedagogical impact:** Narrative flow of early sections (motivation → micro-concept → trap → code) is replaced by **policy sandwich**.

### ISSUE-22 — You Do starter too thin for stated objectives
- **Severity:** P1  
- **Location:** `youDo.starterCode`  
- **Evidence:** Only `normalize`, `block_key`, `decide` skeleton; objectives demand comparators, measured blocking recall, review queue, Union-Find, entity split, P/R, slices, S27–S29 tests.  
- **Pedagogical impact:** Scaffolding gap → high germane load without support; risk of incomplete portfolio vs 18h claim.

### ISSUE-23 — Mixed register: English tokens vs Peruvian Spanish teaching voice
- **Severity:** P3  
- **Location:** throughout  
- **Evidence:** “missingness”, “review”, “blocking”, “gold”, “only”, “pass string”; uneven es-PE polish.  
- **Pedagogical impact:** Acceptable for API terms if glossed once; currently unglossed flood.

### ISSUE-24 — Learning outcomes are telegraphic fragments
- **Severity:** P3  
- **Location:** `learningOutcomes`  
- **Evidence:** e.g. *“Comparar exact/edit/token/fecha”* without observable verb+object+criteria.  
- **Pedagogical impact:** Harder self-assessment than S02-style outcomes (*Identificar… y explicar…*).

### ISSUE-25 — Cluster metrics promised, not implemented
- **Severity:** P2  
- **Location:** theory T4-B text vs code  
- **Evidence:** Mentions pair completeness/quality; code only pairwise P/R/F1 + error indices.  
- **Pedagogical impact:** Incomplete progressive disclosure of cluster evaluation for a section that unions clusters with Union-Find.

---

## 4. Meta-Leak Report

Exact or near-exact learner-visible strings that belong to **authors / harness / migration**, not students:

| # | Leaked text (quote) | Location |
|---|---------------------|----------|
| M1 | `Id legacy \`security-infra\` se conserva; el path V3 es entity resolution probabilístico, no hardening de servidores.` | `jobRelevance` |
| M2 | `En V3, **S30 cierra CP-N3-A**.` | theory intro |
| M3 | `implementa solo el DEFECT indicado` | all 24 We Do instructions |
| M4 | `pass string = salida del oráculo` | all 24 We Do instructions |
| M5 | `# DEFECT: …` | all 24 starter code blocks |
| M6 | `Datos sintéticos only` | all 24 We Do instructions |
| M7 | `No editar seed/checkpoint/ledger ni marcar passed.` | `youDo.context` |
| M8 | `Otra lane califica PASS del gate; esta autoría no escribe checkpoint/ledger/seed.` | `portfolioNote` |
| M9 | `Alineación al gate V3 de la sección` | `rubric[0]` |
| M10 | Zero Trust / security playground still bound to section id | `SectionView.tsx` `security-infra` |
| M11 | PDF label `30. Sec/Infra` | `PdfReport.tsx` |

**Meta-leak count (sidecar):** **11** distinct leak classes (M1–M11); instance volume much higher because M3–M6 repeat ×24.

**Not counted as leak (domain OK):** technical terms auto_match/review/non_match; fixture id `CASO-LIM-030` as case name; “CP-N3-A” as capstone name if framed for students as portfolio gate (prefer plain Spanish once).

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 Pre-round research anchors (applied)

- **Gradual release (I/We/You):** I Do must be runnable truth; We Do guided practice with declining support; You Do authentic performance. S30 has structure labels but broken I Do truth and We Do that does not practice the skill.  
- **Cognitive load:** Intrinsic load of ER is already high (comparators, blocking, FS, clusters, metrics). Extraneous load from repeated fixture sermons and harness jargon is excessive.  
- **Record linkage practice (Splink / FS):** Prior λ, m/u, match weights, dual thresholds, blocking vs recall — S30 names these ideas but demos weighted averages and string policies.  
- **Ethics / dual-use:** Strong and appropriate for a relationship-investigation course; must stay **once per section**, not every paragraph.

### 5.2 I Do / We Do / You Do fidelity

| Phase | Structural presence | Quality |
|-------|---------------------|---------|
| **I Do** | 8 demos mapped to 8 subtopics | **Fail** on fidelity (Issues 01–05); several demos print flags instead of teaching moves |
| **We Do** | 24 steps, 3 kinds each | **Form without function**: defect-flip micro-oracles |
| **You Do** | Capstone brief + thin starter | **Ambition ≫ scaffold** (Issue 22) |
| **Self-check** | 5 items, 70% unlock pattern (platform) | Conceptually aligned, feedback anemic |

### 5.3 Progressive disclosure map (intended vs actual)

**Intended (good):** T1 comparators → T2 blocking/cost → T3 score/review/clusters → T4 eval/splits.  
**Actual:** Each node re-injects global CP-N3-A contract; local concept gets 1 sentence of unique content + 2 paragraphs of paste.

### 5.4 Redaction / Peruvian Spanish

- Tone oscillates between professional es-PE and English harness-speak.  
- Prefer: *“arregla el error del starter”* over *DEFECT*; *“la salida esperada”* over *oráculo*; *“solo datos sintéticos”* over *only*.  
- Keep English API tokens (`auto_match`) with first-use gloss.  
- Grammar: mostly acceptable short clauses; main failure is **clarity by redundancy**, not conjugation errors.

### 5.5 Consistency with roadmap

| Link | Status |
|------|--------|
| S13 deterministic ER / no probabilistic | Correctly deferred; S30 is the probabilistic closure |
| S27–S29 tests / props / SQL store | Named in intro/objectives; **not exercised** in We Do beyond slogans |
| S31 graphs after ER | Logical; S30 clusters via Union-Find prepares entity nodes |
| Ethics: no fraud labels | Consistent and valuable |

### 5.6 Comparison with external best-in-class

| Source | What gold does | S30 gap |
|--------|----------------|---------|
| **Splink FS guide** | λ, m, u, match weights, waterfall | Weighted avg only; m/u name-dropped |
| **Linacre interactive FS** | Build intuition step-by-step | No interactive narrative; boilerplate instead |
| **Christen *Data Matching*** | Blocking design with measured recall | Theory shows recall 0 bug; We Do only divides two integers |
| **dedupe / active learning** | Clerical labeling loop | Review queue reduced to print action list |
| **S02 PyArcana (internal gold)** | Code/output honesty, dense explanation | S30 fails honesty on multiple I Dos |

### 5.7 Accessibility / motivation

- Motivation for PE synthetic case is good but over-repeated.  
- No visual of match-weight waterfall or blocking Venn.  
- Transfer exercises that only print policy tokens exclude students who need computational practice to encode concepts.

### 5.8 Graph memory snapshot (nodes / edges)

```
[CP-N3-A Gate] --closes--> [S30 ER Engine]
[S30-T1 Comparators] --> [S30-T2 Blocking] --> [S30-T3 Match/Review] --> [S30-T4 Eval]
[Ethics: no fraud] --over-linked--> every theory paragraph (noise edge)
[Harness DEFECT/oracle] --pollutes--> We Do practice edge
[I Do broken outputs] --breaks--> trust edge to learner
[SectionView Zero Trust] --orphan legacy--> false domain edge
[S29 SQL store] --feeds--> candidate_pairs / decisions tables
[S30 clusters] --feeds--> [S31 evidence graph]
```

---

## 6. Proposed GitHub-style Diffs

> Diffs are **proposals only** — not applied. Paths relative to repo root.

### Diff A — Fix I Do T2-A demo (ISSUE-01)

```diff
--- a/src/lib/course/sections/s30-security-infra.ts
+++ b/src/lib/course/sections/s30-security-infra.ts
@@ S30-T2-A-DEMO code/output
-          code: `from collections import defaultdict
-
-def block_key(last, city):
-    return f"{last}|{city}"
-
-def block_sizes(recs):
-    b = defaultdict(list)
-    for rid, last, city in recs:
-        b[block_key(last, city)].append(rid)
-    return {k: len(v) for k, v in b.items()}
-
-recs = [("r1", "lopez", "lima"), ("r2", "lopez", "lima"), ("r3", "perez", "cusco")]
-print(block_sizes(recs))
-print("blocking", True)
-print("ok", True)
-`,
-          output: `recall 1.0 ncand 1`,
+          code: `from collections import defaultdict
+
+def block_key(last, city):
+    return f"{last}|{city}"
+
+recs = [("r1", "lopez", "lima"), ("r2", "lopez", "lima"), ("r3", "perez", "cusco")]
+buckets = defaultdict(list)
+for rid, last, city in recs:
+    buckets[block_key(last, city)].append(rid)
+gold = {frozenset(("r1", "r2"))}
+candidates = set()
+for ids in buckets.values():
+    for i in range(len(ids)):
+        for j in range(i + 1, len(ids)):
+            candidates.add(frozenset((ids[i], ids[j])))
+recall = len(gold & candidates) / len(gold)
+print("recall", recall)
+print("ncand", len(candidates))
+`,
+          output: `recall 1.0
+ncand 1`,
```

### Diff B — Fix I Do T2-B demo (ISSUE-02)

```diff
--- a/src/lib/course/sections/s30-security-infra.ts
+++ b/src/lib/course/sections/s30-security-infra.ts
@@ S30-T2-B-DEMO
-          code: `def pair_cost(sizes):
-    return sum(n * (n - 1) // 2 for n in sizes)
-
-print("cost", pair_cost([5, 20]))
-print("impossible_all_pairs", pair_cost([1000]))
-print("ok", True)
-`,
-          output: `cost 200
-impossible True`,
+          code: `def pair_cost(sizes):
+    return sum(n * (n - 1) // 2 for n in sizes)
+
+def impossible(a, b):
+    return a.get("type") != b.get("type")
+
+print("cost", pair_cost([5, 20]))
+print("impossible", impossible({"type": "person"}, {"type": "org"}))
+`,
+          output: `cost 200
+impossible True`,
```

### Diff C — Fix I Do T3-A demo (ISSUE-03)

```diff
--- a/src/lib/course/sections/s30-security-infra.ts
+++ b/src/lib/course/sections/s30-security-infra.ts
@@ S30-T3-A-DEMO
-          code: `def weighted_score(sims, w):
-    return sum(sims[k] * w[k] for k in w) / sum(w.values())
-
-sims = {"name": 0.9, "email": 1.0}
-w = {"name": 0.6, "email": 0.4}
-print(round(weighted_score(sims, w), 3))
-print("thresholds", True)
-print("ok", True)
-`,
-          output: `0.94 auto_match`,
+          code: `def weighted_score(sims, w):
+    return sum(sims[k] * w[k] for k in w) / sum(w.values())
+
+def decide(score, t_high=0.9, t_low=0.5):
+    if score >= t_high:
+        return "auto_match"
+    if score <= t_low:
+        return "non_match"
+    return "review"
+
+sims = {"name": 0.9, "email": 1.0}
+w = {"name": 0.6, "email": 0.4}
+s = weighted_score(sims, w)
+print(round(s, 3), decide(s))
+`,
+          output: `0.94 auto_match`,
```

### Diff D — Fix I Do T4-A / T4-B demos (ISSUE-04, ISSUE-05)

```diff
--- a/src/lib/course/sections/s30-security-infra.ts
+++ b/src/lib/course/sections/s30-security-infra.ts
@@ S30-T4-A-DEMO
-print(entity_split(pairs, train_e))
-print("no_leak", True)
-print("ok", True)
-`,
-          output: `train 2 test 1`,
+tr, te = entity_split(pairs, train_e)
+print("train", tr, "test", te)
+`,
+          output: `train 2 test 1`,

@@ S30-T4-B-DEMO
-def pr_metrics(yt, yp):
-    tp = sum(t == 1 and p == 1 for t, p in zip(yt, yp))
-    fp = sum(t == 0 and p == 1 for t, p in zip(yt, yp))
-    fn = sum(t == 1 and p == 0 for t, p in zip(yt, yp))
-    prec = tp / (tp + fp) if tp + fp else 0.0
-    rec = tp / (tp + fn) if tp + fn else 0.0
-    return round(prec, 2), round(rec, 2)
-
-print(pr_metrics([1, 1, 0, 0], [1, 0, 0, 0]))
-print("not_fraud", True)
-print("ok", True)
-`,
-          output: `1.0 0.5 [1]`,
+def pr_metrics(yt, yp):
+    tp = sum(t == 1 and p == 1 for t, p in zip(yt, yp))
+    fp = sum(t == 0 and p == 1 for t, p in zip(yt, yp))
+    fn = sum(t == 1 and p == 0 for t, p in zip(yt, yp))
+    prec = tp / (tp + fp) if tp + fp else 0.0
+    rec = tp / (tp + fn) if tp + fn else 0.0
+    errors = [i for i, (t, p) in enumerate(zip(yt, yp)) if t != p]
+    return round(prec, 2), round(rec, 2), errors
+
+p, r, err = pr_metrics([1, 1, 0, 0], [1, 0, 0, 0])
+print(p, r, err)
+`,
+          output: `1.0 0.5 [1]`,
```

### Diff E — Remove Zero Trust playground for S30 (ISSUE-06)

```diff
--- a/src/components/course/SectionView.tsx
+++ b/src/components/course/SectionView.tsx
@@
-    'security-infra': {
-      title: 'Practica Zero Trust y logging',
-      code: `# Simulacion de Zero Trust: verificar cada request
-... entire security demo ...
-      hint: 'Que pasa si cambias el contenido del archivo? El hash cambia',
-    },
+    'security-infra': {
+      title: 'Practica blocking y candidate recall',
+      code: `from collections import defaultdict
+
+def block_key(last: str, city: str) -> str:
+    return f"{last.casefold()}|{city.casefold()[:3]}"
+
+recs = [
+    ("r1", "López", "Lima"),
+    ("r2", "Lopez", "Lima"),
+    ("r3", "Díaz", "Cusco"),
+]
+# Demo: normaliza acentos en una versión mejorada del key
+def fold(s: str) -> str:
+    return s.casefold().replace("á","a").replace("é","e").replace("í","i").replace("ó","o").replace("ú","u")
+
+buckets = defaultdict(list)
+for rid, last, city in recs:
+    buckets[f"{fold(last)}|{fold(city)[:3]}"].append(rid)
+print(dict(buckets))
+print("candidate_pairs", sum(len(v)*(len(v)-1)//2 for v in buckets.values()))
+`,
+      expectedOutput: `{'lopez|lim': ['r1', 'r2'], 'diaz|cus': ['r3']}
+candidate_pairs 1`,
+      hint: 'Sin plegar acentos, López y Lopez caen en bloques distintos y el recall de matching baja a 0',
+    },
```

### Diff F — PDF label (ISSUE-07)

```diff
--- a/src/components/course/PdfReport.tsx
+++ b/src/components/course/PdfReport.tsx
-  "security-infra": '30. Sec/Infra',
+  "security-infra": '30. ER probabilístico',
```

### Diff G — jobRelevance without legacy meta (ISSUE-08)

```diff
--- a/src/lib/course/sections/s30-security-infra.ts
+++ b/src/lib/course/sections/s30-security-infra.ts
-    "Cierras **CP-N3-A** con un **Testable Entity Resolution Engine**: comparadores, blocking con recall medido, pesos/umbrales y métricas P/R. Scores priorizan cola de revisión; no etiquetan fraude. Id legacy `security-infra` se conserva; el path V3 es entity resolution probabilístico, no hardening de servidores.",
+    "Cierras **CP-N3-A** con un **motor de entity resolution testeable**: comparadores, blocking con recall medido, pesos/umbrales y métricas de precisión/recall. Los scores solo priorizan la cola de revisión clerical; nunca etiquetan fraude, parentesco ni colusión.",
```

### Diff H — Theory intro: student voice + single ethics callout (ISSUE-09, partial ISSUE-10)

```diff
--- a/src/lib/course/sections/s30-security-infra.ts
+++ b/src/lib/course/sections/s30-security-infra.ts
-        "En V3, **S30 cierra CP-N3-A**. Entregas un motor **testeable**: benchmark etiquetado sintético, **blocking con recall medido**, comparadores explicables y cola de revisión clerical. Un score de matching **solo prioriza** revisión humana.",
+        "**S30 cierra CP-N3-A.** Entregas un motor **testeable**: benchmark etiquetado sintético, **blocking con recall medido**, comparadores explicables y cola de revisión clerical.",
```

And for each T1-B…T4-B block: **delete** the pasted sentences that only restate ethics/fixture/PE case; keep **one** section-level callout (already present as Gate CP-N3-A) plus a single short PE case sentence in the intro only.

Example reduction for T1-B paragraph 1:

```diff
-        "**Missingness**: un campo vacío no es desacuerdo fuerte ni acuerdo. Usa estado `missing` en la comparación. Un score de matching solo prioriza revisión humana: ER responde *¿misma entidad?* y no infiere colusión, parentesco ni fraude. Documenta evidencia y límites del fixture `CASO-LIM-030` (run_id=cpn3a-er): sin PII real y sin auto-veredicto.",
+        "**Missingness**: un campo vacío no es desacuerdo fuerte ni acuerdo. Usa el estado `missing` en la comparación (no lo trates como `disagree`).",
```

### Diff I — We Do instruction template (ISSUE-11, ISSUE-12)

```diff
--- a/src/lib/course/sections/s30-security-infra.ts
+++ b/src/lib/course/sections/s30-security-infra.ts
-          "S30-T1-A-E1 · Exact: imprime 1.0 si 'a'=='a' else 0.0. Fixture sintético `CASO-LIM-030` (run_id=cpn3a-er, @example.pe): la entrada es el starter completo; implementa solo el DEFECT indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
+          "S30-T1-A-E1 · Comparador exacto: con `a = b = 'a'`, imprime `1.0` si son iguales y `0.0` si no. El starter tiene la condición invertida; corrígela. Usa solo datos sintéticos del caso `CASO-LIM-030`.",
```

Align each starter to print **exactly** the solution lines (remove `print('ok', True)` / `want` / `policy` noise) **or** expand solution outputs to include the same lines — prefer **minimal honest prints**.

### Diff J — Replace hollow transfer exercises (ISSUE-13) — representative

```diff
--- a/src/lib/course/sections/s30-security-infra.ts
+++ b/src/lib/course/sections/s30-security-infra.ts
@@ S30-T2-B-E3 (transfer): replace print-string with real filter-before-score mini pipeline
-# DEFECT: score_first en vez de filter_before_score
-print('score_first')
+pairs = [({"type":"person","s":1.0},{"type":"org","s":1.0}), ({"type":"person","s":0.2},{"type":"person","s":0.2})]
+# Cuenta cuántos pares sobreviven al filtro impossible y tendrían score
+kept = [1 for a,b in pairs if a["type"]==b["type"]]
+print(sum(kept))
+print("filter_before_score")
```

(With matching solution output designed so students implement the filter, not a slogan.)

### Diff K — You Do meta cleanup (ISSUE-17)

```diff
--- a/src/lib/course/sections/s30-security-infra.ts
+++ b/src/lib/course/sections/s30-security-infra.ts
-      "Implementa el motor ER sintético de cierre de **CP-N3-A**: ... Benchmark etiquetado sintético only. ER = misma entidad; **no** relación ni riesgo/fraude. No editar seed/checkpoint/ledger ni marcar passed.",
+      "Implementa el motor ER sintético de cierre de **CP-N3-A**: comparadores explicables, blocking con candidate recall medido, scorer con umbrales auto/review/non, cola clerical, clusters (Union-Find) y evaluación pairwise con split por entidad y error slices. Solo benchmark sintético. ER responde «¿misma entidad?»; no infiere relación ni riesgo/fraude.",
-    portfolioNote:
-      "Cierre CP-N3-A: motor ER testeable con blocking medido, review y métricas. Otra lane califica PASS del gate; esta autoría no escribe checkpoint/ledger/seed.",
+    portfolioNote:
+      "Cierre CP-N3-A: documenta en el README del repo el candidate recall, P/R en el split por entidad y un ejemplo de ítem de cola clerical con explicación por campo.",
-      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
+      { criterion: "Motor completo: comparadores, blocking medido, umbrales, review y métricas", weight: "25%" },
```

### Diff L — Expand You Do starter skeleton (ISSUE-22)

```diff
--- a/src/lib/course/sections/s30-security-infra.ts
+++ b/src/lib/course/sections/s30-security-infra.ts
@@ youDo.starterCode
+# TODO estudiante: exact / token_jaccard / edit_sim / date_sim
+# TODO: compare_field con missing; frequency_weight
+# TODO: candidate_recall(gold, candidates)
+# TODO: pair_score + decide + explain dict
+# TODO: UnionFind + review_queue item
+# TODO: entity_split + prf + error_slices
+# Incluye 3 tests pytest mínimos (importables) alineados a S27
```

### Diff M — Theory T2-A callout for accent failure (ISSUE-14)

```diff
-        content:
-          "Sin gold sintético no sabes si tu regla deja fuera verdaderos matches.",
+        content:
+          "Aquí el recall es 0.0 a propósito: `López` vs `lopez` no comparten clave sin plegado de acentos. Primero normaliza; luego mide recall con gold sintético.",
```

### Diff N — exact() matches prose (ISSUE-15)

```diff
-def exact(a, b):
-    return 1.0 if a == b else 0.0
+def exact(a, b):
+    na = " ".join(a.casefold().split())
+    nb = " ".join(b.casefold().split())
+    return 1.0 if na == nb else 0.0
```

### Diff O — Replace bad NIST resource (ISSUE-19)

```diff
-      {
-        label: "NIST — entity resolution concepts",
-        url: "https://www.nist.gov/itl/iad/image-group/trecvid-entity-detection",
-        note: "Evaluación y entidades (contexto)",
-      },
+      {
+        label: "Robin Linacre — Interactive Fellegi–Sunter",
+        url: "https://www.robinlinacre.com/intro_to_probabilistic_linkage/",
+        note: "Intuición de prior, m/u y match weights",
+      },
```

### Diff P — Self-check enrich explanations (ISSUE-18) — sample

```diff
-        explanation:
-          "ER ≠ relación ≠ riesgo.",
+        explanation:
+          "Entity resolution solo decide si dos registros apuntan a la misma entidad del mundo real. Parentesco, colusión o fraude son tareas distintas (más adelante en el path de investigación).",
```

---

## 7. Recommended Priority Order for Fixing

| Priority | Issues | Rationale |
|----------|--------|-----------|
| **1 · P0 trust** | 01–05 (I Do code/output) | Broken demos destroy learning before any rewrite |
| **2 · P0 domain** | 06 (Zero Trust playground), 07 (PDF label) | Wrong domain on live product surface |
| **3 · P1 meta** | 08, 09, 11, 12, 17 | Remove harness/migration voice from learner text |
| **4 · P1 pedagogy** | 10 (boilerplate), 13 (shallow We Do), 22 (You Do scaffold) | Restore progressive disclosure and practice quality |
| **5 · P2 technical teaching** | 14, 15, 16, 25 | Align theory code with claims; honest FS simplification |
| **6 · P2 assessment/resources** | 18, 19 | Self-check + external links |
| **7 · P2/P3 consistency** | 20, 21, 23, 24 | Naming, outcomes, register |

**Suggested Fixer batches**

1. **Batch A (mechanical truth):** Diffs A–D + E + F  
2. **Batch B (voice):** Diffs G, H, I, K  
3. **Batch C (depth):** Diffs J, L, M, N, O, P + systematic We Do redesign for at least one transfer per topic  

**Do not** rename platform id `security-infra` in the same PR as content fixes unless routing/progress migration is planned (hash stability). Prefer UI label fixes while keeping id.

---

## 8. Graph Memory Update notes

For shared curriculum hardening context:

```yaml
section: 30
id: security-infra
title: Entity resolution probabilístico
file: src/lib/course/sections/s30-security-infra.ts
explorer_score: 4.2
status: needs_fixer
capstone: CP-N3-A_close
depends_on: [S27-tests, S28-props, S29-sql-er-store]
feeds: [S31-graphs-evidence]
preserve:
  - ethics_ER_not_fraud
  - T1_to_T4_topic_map
  - theory_blocking_accent_failure_example  # reframe, don't delete
  - resources_splink_christen_rapidfuzz
critical_edges_broken:
  - iDo_code_output_fidelity (T2-A, T2-B, T3-A, T4-A, T4-B)
  - sectionview_demo_domain (Zero Trust residue)
  - pdf_label_SecInfra
noise_edges:
  - theory_boilerplate_ethics_fixture_xN
  - weDo_DEFECT_oracle_template_x24
  - youDo_lane_seed_ledger_meta
quality_vs_S02_gold: much_lower_narrative_and_fidelity
quality_vs_external_splink: conceptual_names_ok_implementation_shallow
prior_auto_audit: S30_AUDIT.json ACCEPT — insufficient; explorer overrides
fixer_entrypoints:
  - s30-security-infra.ts
  - SectionView.tsx (security-infra key)
  - PdfReport.tsx (label)
```

**Comparative quality rank (internal):** below mid-course polished sections; content intent strong, execution of demos/exercises weak.

---

## Coverage checklist (required dimensions)

| # | Dimension | Covered |
|---|-----------|---------|
| 1 | Meta-text / developer leakage | §4, Issues 08–09, 11–12, 17 |
| 2 | Grammar / redaction (es-PE) | §5.4, Issue 23 |
| 3 | Connective tissue / narrative flow | §5.3, Issues 10, 21 |
| 4 | Pedagogical structure I/We/You | §5.2, Issues 01–05, 13, 22 |
| 5 | Cognitive load / progressive disclosure | §5.1, Issue 10 |
| 6 | Exercise and exam quality | Issues 11–13, 18 |
| 7 | Roadmap consistency | §5.5, Issue 20 |
| 8 | External best-in-class comparison | §5.6 |
| 9 | Other (accessibility, motivation, product residue) | Issues 06–07, 19, 22 |

---

This is the complete Explorer report for Section 30. Ready for the Fixer prompt.
