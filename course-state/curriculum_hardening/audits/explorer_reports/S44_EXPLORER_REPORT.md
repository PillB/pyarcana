# S44 Explorer Report — CI/CD y seguridad de la cadena de suministro

**Auditor role:** Curriculum Auditor · Pedagogical Analyst · Technical Editor  
**Method:** Stanford STORM multi-pass + Graph Engineering + Loop Engineering  
**Scope lock:** Section 44 only (`id: multimodal`)  
**Sources:**  
- Live catalog: https://pillb.github.io/pyarcana/ (S44 listed as «CI/CD supply chain»; SPA hash `#multimodal` is client-rendered; body content audited from source of truth)  
- Source: `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s44-multimodal.ts`  
- Map: `SECTION_MAP.tsv` row 44 · `multimodal` · `s44-multimodal`  
- Adjacent gold / phase peers for comparison: S01 (`s01-setup.ts`), S43 (`s43-llmops.ts`)  
- Prior automated redaction audit: `S44_AUDIT.json` (verdict ACCEPT — **does not** supersede this pedagogical depth audit)

**Pre-round pedagogy notes (CI/CD supply-chain teaching):**  
Gradual release of responsibility (I Do → We Do → You Do) and progressive disclosure are appropriate for Master-level ops. Industry materials (GitHub Actions security hardening, SLSA provenance, SHA-pinning of actions, SBOM/attestation labs) teach **concrete YAML contracts**, least-privilege `permissions:`, immutable action SHAs, and verifiable promote/rollback evidence — not only boolean dict predicates. Cognitive load research favors *varied* practice over 24 near-isomorphic predicate-flip drills. Domain transfer (ER fraud/parentesco language) is harmful off-topic scaffolding.

---

## 1. Section Identification & Scope

| Field | Value |
|--------|--------|
| Index | **44** |
| Platform id (hash) | `multimodal` |
| Title | CI/CD y seguridad de la cadena de suministro |
| shortTitle | CI/CD supply chain |
| File | `src/lib/course/sections/s44-multimodal.ts` |
| Phase / level | Phase 3 · Master · 20h |
| Capstone gate | CP-N4-B · cadena de suministro verificable |
| Case id (intended) | `CASO-PIU-044` (Piura ops sintético) |
| Structure present | theory (1 route + 8 subtopics T1–T4 A/B) · iDo (8 demos) · weDo (24 E1/E2/E3) · youDo · selfCheck (5) · resources |
| Icon | `Image` (legacy multimodal visual, not CI/CD) |
| Explicit non-scope | Vision multimodal / LLM — repeatedly denied in meta notes |

**Subtopic graph (nodes):**  
S44-T1-A lint/types/tests matrix · S44-T1-B caches/artifacts/conditions · S44-T2-A min perms/pin/secret scan · S44-T2-B SBOM/provenance/attest · S44-T3-A envs/approvals · S44-T3-B migrations/canary/rollback · S44-T4-A branch/review/notes · S44-T4-B failure/audit evidence.

**Roadmap edges:** S43 containers → **S44 supply-chain CI/CD** → S45 cloud/queues. Content correctly positions post-container artifact promotion; **id/icon still scream “multimodal”**.

**Out of scope this run:** fixing TS, other sections, product UI.

---

## 2. Executive Summary of Quality

### Score: **5.5 / 10**

### Verdict
S44 is a **structurally complete Master scaffold** (route map, 8 subtopics, 8 demos, 24 fail-closed weDo drills, portfolio youDo, selfCheck, strong external resource list) that **successfully renames the curriculum from multimodal vision to CI/CD supply chain**. The fail-closed E1→E2→E3 pattern (domain AND-gate → valid/invalid/missing → CONTINUE/breach/uncertainty) is pedagogically coherent and aligned with CP-N4-B.

However, the section is **heavily template-stamped**: thin one-sentence “theory,” copy-pasted “Contrato operativo” and Piura application paragraphs, wrong-domain **fraude/parentesco/ER** boilerplate, **developer meta-leaks** (`Id legacy multimodal`, `path V3`), **CASO-LIM-044** comments on every starter while fixtures are `CASO-PIU-044`, a **broken T3-B canary demo** (prints contradict function results), **action-code vocabulary drift** (`STOP_PIPELINE` vs per-subtopic codes), and **Master-level depth far below** industry GHA/SLSA teaching and far below early gold-standard narrative (S01). Automated `S44_AUDIT.json` ACCEPT reflects low structural redaction flags, **not** teaching quality.

**Key strengths**
- Correct product story: S43 service → verifiable digest/SBOM/provenance → approval → rollback demo.
- Dictionary upfront; explicit synthetic case; no real secrets required.
- weDo defect inversion teaches fail-closed gates consistently.
- Resources (GHA hardening, Environments, branch protection, SLSA, CycloneDX/SPDX, Sigstore, in-toto, NIST SSDF, pip secure installs, Accelerate, SRE) are excellent.

**Key weaknesses**
- User-facing meta about legacy id / V3 curriculum rewrite.
- Domain-leak ER language in CI/CD.
- Theory + iDo too shallow for 20h Master (almost no real workflow surface).
- Template fatigue across 7/8 theory blocks and all 24 exercises.
- Code correctness bug in T3-B theory sample.

---

## 3. Detailed Issue Registry

Severity: **P0** blocker / **P1** high / **P2** medium / **P3** polish.

### Issue 01 — Meta-leak: legacy id + V3 path in `jobRelevance`
- **Severity:** P1  
- **Location:** `jobRelevance` (lines ~15)  
- **Evidence:**  
  > `Id legacy \`multimodal\` se conserva; el path V3 es supply-chain CI/CD, no visión multimodal/LLM.`  
- **Pedagogical impact:** Breaks learner immersion; exposes curriculum migration notes meant for maintainers. Student should never need “V3 path” language.  
- **Graph edge:** meta-node → jobRelevance surface.

### Issue 02 — Meta-leak: legacy id + V3 + pedagogy scaffolding in route theory
- **Severity:** P1  
- **Location:** theory[0] paragraph 4 (lines ~33)  
- **Evidence:**  
  > `Teoría medible, iDo que calcula el contrato, weDo E1/E2/E3 con un defecto de pipeline por ejercicio. Id legacy \`multimodal\` no implica multimodalidad; V3 es CI/CD supply chain del control plane.`  
- **Pedagogical impact:** Mixes internal curriculum engineering labels with student instruction; dilutes the route map.

### Issue 03 — Meta-leak: `multimodal_vision_topic: False` in student-facing map code
- **Severity:** P1  
- **Location:** theory[0] code `s44_map_contract.py`  
- **Evidence:**  
  ```python
  "multimodal_vision_topic": False,
  ...
  print("multimodal_vision_topic", c["multimodal_vision_topic"])
  ```  
- **Pedagogical impact:** Forces every learner to print a denial of a topic they never signed up for. Prefer positive gate keys (`supply_chain_cicd: True`) only.

### Issue 04 — Meta-leak / case id pollution: `CASO-LIM-044` on all weDo starters
- **Severity:** P1  
- **Location:** every weDo `starterCode` comment header (24×), e.g. `# CASO-LIM-044 · CI lint/types/tests matrix`  
- **Evidence:** Comments say **LIM** (Lima template); fixtures and narrative say **`CASO-PIU-044*`** (Piura).  
- **Pedagogical impact:** Undermines case continuity, confuses portfolio evidence tags, signals bulk generation without human QA.

### Issue 05 — Wrong-domain boilerplate: fraude / parentesco / intención (ER leak)
- **Severity:** P1  
- **Location:** theory application paragraphs for T1-A, T1-B, T2-A, T3-A, T3-B, T4-A, T4-B (~7 blocks)  
- **Evidence (repeated):**  
  > `una señal incierta se deriva y nunca prueba fraude, parentesco o intención.`  
- **Pedagogical impact:** Cognitive interference: CI/CD gates have nothing to do with entity-resolution fraud claims. Students encode wrong ethical frame for the section.  
- **Also:** selfCheck Q4 explanation:  
  > `ER solo propone correspondencia de entidad y no prueba fraude, parentesco ni riesgo.`  
  — correct for ER sections, **off-topic** for S44 (option about “inferir fraude…” is a distractor that re-teaches S11–S30, not supply chain).

### Issue 06 — Theory template fatigue (“Contrato operativo” clone)
- **Severity:** P1  
- **Location:** T1-A, T1-B, T2-A, T3-A, T3-B, T4-A, T4-B second paragraphs  
- **Evidence pattern:** nearly identical  
  > `Contrato operativo. Entrada: commit revisado, dependencias fijadas y workflow con permisos mínimos. … Error: test crítico, secreto, dependencia insegura o attestación ausente… Criterio de éxito: el pipeline reproduce el artefacto…`  
  with only “Salida de este subtema” swapped.  
- **Pedagogical impact:** Progressive disclosure fails: 8 topics collapse into one mega-gate. No topic-specific threat model, no “why this gate exists,” no worked failure story unique to the subtopic. (T2-B is the positive outlier with a real digest integrity contract.)

### Issue 07 — Application paragraph clone (Piura stamp)
- **Severity:** P2  
- **Location:** same subtopics as Issue 06, third paragraphs  
- **Evidence pattern:**  
  > `Aplicación de \`{heading}\` al caso peruano sintético \`CASO-PIU-044\`: un repositorio ficticio de servicio de operaciones en Piura. La evidencia esperada es {X}. No contiene PII…`  
- **Pedagogical impact:** Zero narrative variety; situating “Peru” becomes wallpaper rather than motivation (contrast S01’s concrete Interbank/BBVA day-1 story).

### Issue 08 — Broken theory demo T3-B (canary code ≠ output logic)
- **Severity:** P0 (correctness)  
- **Location:** theory subtopic `S44-T3-B` code `migrations_canary_rollback.py`  
- **Evidence:**  
  ```python
  phase, pct, _ = canary_action(0.0)  # → ("canary", 0, "hold")
  print(phase)          # canary  ✓
  print(10)             # hardcoded; ignores pct (0)
  print("prev_version") # contradicts success path; function would yield "hold"
  ```  
  Declared output:  
  ```
  canary
  10
  prev_version
  ```  
- **Pedagogical impact:** Students who run the code get `canary` / `0` / missing third print logic if they follow the function; printed lab “10%” and `prev_version` invent a story the code never computes. Teaches **non-reproducible demos** in a section whose gate is reproducibility.  
- **Related conceptual tension:** “evidencia esperada” / callout stress **canary fallido → rollback**, while valid weDo fixtures PASS on **healthy canary under threshold**. Both are valid skills but are conflated without explanation.

### Issue 09 — Theory depth insufficient for Master / 20h claim
- **Severity:** P1  
- **Location:** all theory first paragraphs (often one short sentence) + all iDo demos  
- **Evidence examples:**  
  - T1-B: `Caches son optimización no fuente de verdad; artifacts llevan digest/retención y condiciones de workflow no omiten gates en forks o tags.` (one sentence for an entire subtopic)  
  - iDo demos are 4–8 line boolean toys (`gates_green`, `cache_key`, `secret_scan_policy`) without a single illustrative workflow fragment.  
- **Pedagogical impact:** Under-prepares for youDo requirements (real matrix, pinning, SBOM, canary). Violates progressive disclosure *upward*: concept named, not shown. External best practice shows pin-by-SHA, `permissions:`, environments, attest actions — section only hints via resources links.

### Issue 10 — Pinning heuristic too weak / slightly misleading
- **Severity:** P2  
- **Location:** theory T2-A code `min_perms_pin_secret_scan.py`  
- **Evidence:**  
  ```python
  pinned = "@" in action_ref and len(action_ref.split("@")[-1]) >= 7
  ...
  "actions/checkout@a1b2c3d"  # 7-char stub, not full SHA
  ```  
- **Pedagogical impact:** Industry guidance: pin to **full-length commit SHA** (immutable), not short tags/stubs. Lab accepts 7-char pseudo-hash as “pinned,” which under-teaches a core supply-chain control (and conflicts with linked GHA hardening docs).

### Issue 11 — Action vocabulary drift (STOP_PIPELINE vs per-topic codes)
- **Severity:** P2  
- **Location:** selfCheck Q2; youDo requirements; weDo per-subtopic codes  
- **Evidence:**  
  - selfCheck: `emitir STOP_PIPELINE y conservar evidencia`  
  - youDo: `breach (\`STOP_PIPELINE\`)` and `incierto (\`MANUAL_APPROVAL\`)`  
  - weDo uses: `FAIL_CI_GATE`, `DISCARD_PIPELINE_RESULT`, `REVOKE_AND_ROTATE`, `REJECT_ATTESTATION`, `DENY_PROMOTION`, `ROLLBACK_RELEASE`, `BLOCK_UNREVIEWED_RELEASE`, `STOP_SILENT_FAILURE`, plus missing-path codes (`REVIEW_MATRIX`, `SECURITY_APPROVAL`, …)  
- **Pedagogical impact:** Learners cannot form a stable mental model of “the breach code.” Quiz may pass without mapping to exercised vocabulary.

### Issue 12 — youDo context grammar / syntax break
- **Severity:** P2  
- **Location:** `youDo.context`  
- **Evidence:**  
  > `El gate se bloquea ante: test crítico, secreto, dependencia insegura o attestación ausente impide publicar.`  
- **Pedagogical impact:** Broken Spanish (colon + finite verb clause); unclear whether “impide publicar” is the gate rule or a list item. Harms redaction quality claim (español peruano profesional).

### Issue 13 — weDo intro overclaim / fixture accounting
- **Severity:** P3  
- **Location:** `weDo.intro`  
- **Evidence:**  
  > `24 retos locales. … con ocho fixtures peruanos sintéticos distintos.`  
- **Pedagogical impact:** 24 exercises reuse **8 case_ids** (1A…4B) with near-identical payloads across E1/E2/E3 — “distintos” is weak. Not false, but oversells variety.

### Issue 14 — Learning outcomes too telegraphic for Master portfolio
- **Severity:** P3  
- **Location:** `learningOutcomes`  
- **Evidence:** fragments like `Corre lint/types/tests en matrices` without measurable evidence language (contrast S01 outcomes that define terms).  
- **Pedagogical impact:** Weak alignment to youDo rubric criteria; outcomes read as topic labels, not observable competencies.

### Issue 15 — Icon / id legacy surface (`Image`, `multimodal`)
- **Severity:** P2  
- **Location:** metadata `id`, `icon`  
- **Evidence:** `id: "multimodal"`, `icon: "Image"` while title is CI/CD supply chain.  
- **Pedagogical impact:** UI affordance mismatch (catalog may still feel “vision”); reinforces Issue 01–03. Hash stability may force keeping id; **icon and student-facing prose** need not leak it.

### Issue 16 — iDo intro meta density
- **Severity:** P3  
- **Location:** `iDo.intro`  
- **Evidence:** `Te muestro 8 demos de S44 … alineadas a CP-N4-B (inicio).`  
- **Pedagogical impact:** “(inicio)” is internal phase marking; student needs a human goal (“cómo un pipeline decide promover”).

### Issue 17 — SelfCheck distractors / explanation not section-specific enough
- **Severity:** P2  
- **Location:** selfCheck Q2, Q4  
- **Evidence:** Q2 teaches `STOP_PIPELINE` (Issue 11). Q4 ER fraud option + explanation.  
- **Pedagogical impact:** Active recall fails to lock **section-specific** schemas (digest match, pin, approval without rebuild).

### Issue 18 — Comparative gap vs best-in-class external materials
- **Severity:** P2 (quality bar)  
- **Location:** section-wide pedagogy  
- **Evidence (external bar):** GHA hardening (permissions, pin-by-SHA), SLSA provenance generation/verification labs, Sigstore/cosign attest, environment protection rules — typically include **sample workflow YAML**, fork safety, and promote-same-digest stories.  
- **Pedagogical impact:** S44 resources point to gold material but **lesson body never shows a minimal annotated workflow**. Master learners practicing only inverted booleans will struggle to transfer to real GHA.

### Issue 19 — Consistency with S43: case city/id style OK; meta pattern repeated
- **Severity:** P3 (fleet note)  
- **Location:** jobRelevance pattern mirrors S43’s `Id legacy llmops…`  
- **Pedagogical impact:** Fleet-wide meta pattern; still must be purged from user-facing strings in S44.

### Issue 20 — Callout / theory “evidencia esperada” vs PASS predicate mismatch (T3-B)
- **Severity:** P2  
- **Location:** T3-B paragraphs + callout + weDo valid fixture  
- **Evidence:** callout demands demo of failed canary rollback; valid fixture has `canary_error_rate: 0.004 < max` (healthy path).  
- **Pedagogical impact:** Students “pass” by encoding healthy canary, not the advertised rollback evidence skill.

---

## 4. Meta-Leak Report

| # | Exact leaked / internal text | Location | User-facing? | Fix direction |
|---|------------------------------|----------|--------------|---------------|
| M1 | `Id legacy \`multimodal\` se conserva; el path V3 es supply-chain CI/CD, no visión multimodal/LLM.` | `jobRelevance` | Yes | Delete; keep product value only |
| M2 | `Id legacy \`multimodal\` no implica multimodalidad; V3 es CI/CD supply chain del control plane.` | theory route ¶4 | Yes | Delete; keep stack didáctico sentence if useful |
| M3 | `Teoría medible, iDo que calcula el contrato, weDo E1/E2/E3 con un defecto de pipeline por ejercicio.` | theory route ¶4 | Yes | Rewrite as student journey, not curriculum schema |
| M4 | `"multimodal_vision_topic": False` + prints | `s44_map_contract.py` | Yes | Replace with positive contract keys only |
| M5 | `# CASO-LIM-044 · …` (×24) | all weDo starter comments | Yes | `CASO-PIU-044` (or drop city code in comments) |
| M6 | `nunca prueba fraude, parentesco o intención` (×7) | theory application ¶s | Yes | Domain-specific residual risk language for CI/CD |
| M7 | ER fraud explanation in selfCheck Q4 | selfCheck | Yes | Rewrite for synthetic pipeline / no real secrets |
| M8 | `CP-N4-B (inicio)` | iDo.intro | Mild | Drop “(inicio)” or expand for humans |
| M9 | `icon: "Image"` + id `multimodal` | metadata | UI | Prefer CI/CD-appropriate icon; keep id only if hash-stable |

**Meta-leak count (distinct classes):** **9** (M1–M9).  
**Instances if counting every CASO-LIM / fraude line:** **24 + 7 + others ≈ 35+ surface occurrences**.

No classic “TODO: fix later for Fixer” or “moved from section X” strings found beyond V3/legacy and template stamps.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do fidelity
| Phase | Fidelity | Notes |
|-------|----------|-------|
| **I Do** | Partial | 8 demos exist and map 1:1 to subtopics; each `why` states observable evidence. But demos are **contract calculators**, not demonstrations of a pipeline. Gradual release assumes a *complete worked example* first — here the complete example never appears (no end-to-end promote story in iDo). |
| **We Do** | Strong structure / weak depth | E1 guided invert-predicate → E2 assess three paths → E3 decide fail-closed is excellent **schema practice**. Hints scaffold well. Content is isomorphic: same bug class 8 times. High *procedural* load, low *conceptual* growth after E1 of T1-A. |
| **You Do** | Aligned goals / thin starter | Requirements correctly demand matrix, pinning, SBOM, canary/rollback, normal/breach/uncertain. Starter is a checklist of booleans (`readiness`) — good gate metaphor, but does not bridge from weDo toys to a mini-repo layout. Portfolio note correctly forbids assert-hacking. |

### 5.2 Cognitive load & progressive disclosure
- **Positive:** Dictionary first; gates named; synthetic only; stdlib-first avoids registry accounts.  
- **Negative:** After the dictionary, disclosure does **not** deepen — it **repeats** the same entrada/error/criterio.  
- **Extraneous load:** fraud/parentesco, multimodal denials, LIM vs PIU, STOP_PIPELINE vs local codes.  
- **Germane load underused:** no comparison of cache as optimization vs artifact as truth; no fork PR trust boundary; no “rebuild on promote” anti-pattern story beyond one field equality.

### 5.3 Connective tissue & narrative flow
- Route map T1→T4 is clear and matches exercise topology.  
- Soft link to S43 containers is good.  
- Missing connective tissue: *why* Piura ops service needs SBOM before promote; *what* failed in a realistic incident; *how* evidence looks in a log/artifact layout.  
- vs S01 gold: S01 motivates, defines, works an example, warns failure modes. S44 stamps.

### 5.4 Grammar & redaction (español peruano)
- Mostly grammatical short sentences; tone is neutral-professional.  
- Broken: youDo.context colon+verb (Issue 12).  
- Register is more “contract Spanish” than spoken Peruvian instructional voice of early sections.  
- Anglicisms (SBOM, canary, digest, pinning) are acceptable for Master ops if defined (dictionary helps).  
- Agreement/list awkwardness: repeated `test crítico, secreto, dependencia insegura o attestación ausente impide publicar` is dense and slightly clunky.

### 5.5 Exercise & exam (selfCheck) quality
- **weDo:** High alignment to local callout codes; solutions and outputs consistent; asserts present on E1/E3.  
- **Risk:** Students can pattern-match “invert the OR” without understanding GHA.  
- **selfCheck:** 5 items, correct indices sensible; coverage skewed to process ethics and one digest question; under-samples SBOM, pin, canary RTO, branch notes.  
- No separate multi-question exam object (course norm) — OK.

### 5.6 Roadmap consistency
- Title/tagline/catalog match CI/CD.  
- Capstone CP-N4-B naming consistent with portfolio note.  
- Legacy id/icon and multimodal_vision flag **break** the public story of the V3 roadmap even while text denies multimodal.

### 5.7 Accessibility / motivation / other
- Synthetic data & no mandatory remote registry: good access.  
- Motivation thin (no operator story).  
- 20h estimate inflated relative to actual unique conceptual content (~4–6h of unique ideas expanded by 24 drills).

---

## 6. Proposed GitHub-style Diffs

> Diffs are **proposals only** — do not apply in Explorer. Paths relative to repo root. Line numbers approximate from current `s44-multimodal.ts`.

### Diff A — Issue 01: clean `jobRelevance` (remove meta)

```diff
--- a/src/lib/course/sections/s44-multimodal.ts
+++ b/src/lib/course/sections/s44-multimodal.ts
@@
   jobRelevance:
-    "En equipos de plataforma y producto, **CI/CD y seguridad de la cadena de suministro** convierten el servicio contenedorizado (S43) en un artefacto verificable: digest, SBOM, provenance y gates de promoción. Se promociona solo cuando el pipeline reproduce el artefacto, exige aprobación y demuestra rollback en staging. Id legacy `multimodal` se conserva; el path V3 es supply-chain CI/CD, no visión multimodal/LLM.",
+    "En equipos de plataforma y producto, **CI/CD y seguridad de la cadena de suministro** convierten el servicio contenedorizado (S43) en un artefacto verificable: digest, SBOM, provenance y gates de promoción. Se promociona solo cuando el pipeline reproduce el artefacto, exige aprobación y demuestra rollback en staging. En el lab usamos contratos al estilo GitHub Actions/SLSA modelados en Python (stdlib), sin registry remoto obligatorio.",
```

### Diff B — Issue 02/03: route theory + map contract positive keys

```diff
--- a/src/lib/course/sections/s44-multimodal.ts
+++ b/src/lib/course/sections/s44-multimodal.ts
@@
-        "Orden: T1 matrices de check → T2 permisos/secretos y SBOM → T3 environments/canary/rollback → T4 branch protection y fallos auditables. Teoría medible, iDo que calcula el contrato, weDo E1/E2/E3 con un defecto de pipeline por ejercicio. Id legacy `multimodal` no implica multimodalidad; V3 es CI/CD supply chain del control plane. Stack didáctico: **stdlib** (dicts) modelando contratos GHA/SLSA sin registry remoto.",
+        "Orden de aprendizaje: T1 matrices de check → T2 permisos/secretos y SBOM → T3 environments/canary/rollback → T4 branch protection y fallos auditables. Primero observas el contrato en demos locales; luego reparas predicados fallidos (E1–E3); al final armas el pipeline de portafolio con evidencia de promote/rollback. Stack didáctico: **stdlib** (dicts) modelando contratos GHA/SLSA sin registry remoto.",
@@
-def section_contract():
-    return {
-        "case": "CASO-PIU-044",
-        "gates": ["critical_tests_green", "sbom_provenance", "approval_then_rollback_demo"],
-        "multimodal_vision_topic": False,
-        "unpinned_vuln_dep_ok": False,
-    }
-
-c = section_contract()
-print("case", c["case"])
-print("multimodal_vision_topic", c["multimodal_vision_topic"])
-print("unpinned_vuln_dep_ok", c["unpinned_vuln_dep_ok"])
+def section_contract():
+    return {
+        "case": "CASO-PIU-044",
+        "gates": ["critical_tests_green", "sbom_provenance", "approval_then_rollback_demo"],
+        "supply_chain_cicd": True,
+        "unpinned_vuln_dep_ok": False,
+    }
+
+c = section_contract()
+print("case", c["case"])
+print("supply_chain_cicd", c["supply_chain_cicd"])
+print("unpinned_vuln_dep_ok", c["unpinned_vuln_dep_ok"])
@@
-        output: `case CASO-PIU-044
-multimodal_vision_topic False
-unpinned_vuln_dep_ok False`,
+        output: `case CASO-PIU-044
+supply_chain_cicd True
+unpinned_vuln_dep_ok False`,
```

### Diff C — Issue 05 sample: replace ER boilerplate (apply to all 7 application paragraphs)

```diff
--- a/src/lib/course/sections/s44-multimodal.ts
+++ b/src/lib/course/sections/s44-multimodal.ts
@@
-        "Aplicación de `lint/types/tests y matrices` al caso peruano sintético `CASO-PIU-044`: un repositorio ficticio de servicio de operaciones en Piura. La evidencia esperada es matriz `['3.11','3.12']` + steps `lint/typecheck/test` en verde. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
+        "Aplicación de `lint/types/tests y matrices` al caso peruano sintético `CASO-PIU-044`: repositorio ficticio de operaciones en Piura. Evidencia mínima: matriz `['3.11','3.12']` y steps `lint/typecheck/test` en verde con logs retenidos. Sin secretos reales; si falta la matriz soportada, el gate va a revisión (`REVIEW_MATRIX`), no a promoción silenciosa.",
```

*(Fixer: rewrite each subtopic’s third paragraph with **topic-specific** residual risk, not ER ethics.)*

### Diff D — Issue 06 sample: unique contract for T1-A (pattern for other subtopics)

```diff
--- a/src/lib/course/sections/s44-multimodal.ts
+++ b/src/lib/course/sections/s44-multimodal.ts
@@
-        "Contrato operativo. Entrada: commit revisado, dependencias fijadas y workflow con permisos mínimos. Salida de este subtema: lint/types/tests y matriz soportada en verde. Error: test crítico rojo, secreto en logs, dependencia insegura o attestación ausente impide publicar. Criterio de éxito: el pipeline reproduce el artefacto, exige aprobación y demuestra rollback en staging sintético.",
+        "Contrato de CI rápido. Entrada: commit con lockfile y lista de runtimes soportados. Salida: `lint`, `types` y `tests` en **AND** sobre exactamente la matriz soportada (p. ej. 3.11 y 3.12). Error de gate: un check rojo o una versión fuera de matriz → `FAIL_CI_GATE`. Incertidumbre: falta el campo `supported` → `REVIEW_MATRIX`. Este subtema no publica artefactos; solo certifica que el código es apto para pasos costosos de supply chain.",
```

### Diff E — Issue 08: fix T3-B canary demo + align evidence story

```diff
--- a/src/lib/course/sections/s44-multimodal.ts
+++ b/src/lib/course/sections/s44-multimodal.ts
@@
-        code: `def canary_action(error_rate: float, threshold: float = 0.05) -> tuple:
-    if error_rate > threshold:
-        return "prev_version", int(error_rate * 100), "rollback"
-    return "canary", int(error_rate * 100), "hold"
-
-phase, pct, _ = canary_action(0.0)
-print(phase)
-print(10)  # 10% traffic slice in the lab
-print("prev_version")`,
-        output: `canary
-10
-prev_version`,
+        code: `def canary_action(error_rate: float, threshold: float = 0.05, traffic_pct: int = 10) -> tuple:
+    if error_rate > threshold:
+        return "prev_version", traffic_pct, "rollback"
+    return "canary", traffic_pct, "hold"
+
+# Lab: canary al 10% supera umbral → rollback al digest previo
+phase, pct, decision = canary_action(0.08, threshold=0.05, traffic_pct=10)
+print(phase)
+print(pct)
+print(decision)`,
+        output: `prev_version
+10
+rollback`,
```

And align callout / “evidencia esperada” with either (a) healthy-canary PASS contract used in weDo **or** (b) failed-canary rollback demo above — pick one primary story per block and name the other as secondary path.

### Diff F — Issue 04: CASO-LIM → CASO-PIU in all starter comments

```diff
--- a/src/lib/course/sections/s44-multimodal.ts
+++ b/src/lib/course/sections/s44-multimodal.ts
@@
-# CASO-LIM-044 · CI lint/types/tests matrix
+# CASO-PIU-044 · CI lint/types/tests matrix
```

*(Apply `replace_all` for `# CASO-LIM-044` → `# CASO-PIU-044` across the file.)*

### Diff G — Issue 10: full-SHA pinning teaching

```diff
--- a/src/lib/course/sections/s44-multimodal.ts
+++ b/src/lib/course/sections/s44-multimodal.ts
@@
-def workflow_security(perms: dict, action_ref: str) -> dict:
-    pinned = "@" in action_ref and len(action_ref.split("@")[-1]) >= 7
-    return {"min_perms": perms, "pinned": pinned, "secret_scan": True}
-
-s = workflow_security({"contents": "read"}, "actions/checkout@a1b2c3d")
+def workflow_security(perms: dict, action_ref: str) -> dict:
+    # Pinning profesional: digest SHA completo (40 hex), no solo un tag corto
+    ref = action_ref.split("@")[-1] if "@" in action_ref else ""
+    pinned = len(ref) == 40 and all(c in "0123456789abcdef" for c in ref.lower())
+    return {"min_perms": perms, "pinned": pinned, "secret_scan": True}
+
+s = workflow_security(
+    {"contents": "read"},
+    "actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11",
+)
```

*(Update `output` `pinned True` remains valid with full SHA.)*

### Diff H — Issue 11/17: align selfCheck + youDo codes with weDo vocabulary

```diff
--- a/src/lib/course/sections/s44-multimodal.ts
+++ b/src/lib/course/sections/s44-multimodal.ts
@@
-        question: "Si ocurre la condición de error de S44, ¿qué respuesta preserva seguridad y auditabilidad?",
-        options: ["continuar y ocultar el warning", "emitir STOP_PIPELINE y conservar evidencia", "inventar evidencia faltante", "borrar el trace para reducir ruido"],
-        correctIndex: 1,
-        explanation: "El contrato falla cerrado con STOP_PIPELINE; no convierte incertidumbre o breach en éxito.",
+        question: "Si un test crítico falla o falta attestation, ¿qué respuesta preserva seguridad y auditabilidad?",
+        options: ["continuar y ocultar el warning", "bloquear el release (p. ej. FAIL_CI_GATE / REJECT_ATTESTATION) y conservar evidencia", "inventar evidencia faltante", "borrar el trace para reducir ruido"],
+        correctIndex: 1,
+        explanation: "S44 falla cerrado con códigos de breach por subtema y retiene logs/artifacts; incertidumbre va a revisión humana, no a éxito silencioso.",
@@
-      "Automatiza un caso normal, uno de breach (`STOP_PIPELINE`) y uno incierto (`MANUAL_APPROVAL`).",
+      "Automatiza un caso normal (PASS/CONTINUE), uno de breach (código de gate del subtema, p. ej. FAIL_CI_GATE o REJECT_ATTESTATION) y uno incierto (revisión humana, p. ej. REQUEST_RELEASE_APPROVAL).",
```

### Diff I — Issue 12: fix youDo.context Spanish

```diff
--- a/src/lib/course/sections/s44-multimodal.ts
+++ b/src/lib/course/sections/s44-multimodal.ts
@@
-    context: "Pipeline CI/CD con supply-chain gates. Trabaja sobre un repositorio ficticio de servicio de operaciones en Piura. Entrada: commit revisado, dependencias fijadas y workflow con permisos mínimos. Salida: artefacto identificado por digest, SBOM, provenance y evidencia de promoción o rollback. El gate se bloquea ante: test crítico, secreto, dependencia insegura o attestación ausente impide publicar.",
+    context: "Pipeline CI/CD con supply-chain gates. Trabaja sobre un repositorio ficticio de servicio de operaciones en Piura. Entrada: commit revisado, dependencias fijadas y workflow con permisos mínimos. Salida: artefacto identificado por digest, SBOM, provenance y evidencia de promoción o rollback. El gate bloquea la publicación si hay test crítico rojo, secreto en logs, dependencia insegura sin pin o attestation ausente.",
```

### Diff J — Issue 15: icon (keep id if hash-stable)

```diff
--- a/src/lib/course/sections/s44-multimodal.ts
+++ b/src/lib/course/sections/s44-multimodal.ts
@@
-  icon: "Image",
+  icon: "GitBranch",  // or "Shield" / "Package" — any CI/CD-aligned lucide key used by the app
```

*(Fixer must verify icon enum in the UI component map.)*

### Diff K — Issue 09 (content expansion sketch, not full text)

```diff
--- a/src/lib/course/sections/s44-multimodal.ts
+++ b/src/lib/course/sections/s44-multimodal.ts
@@
   # For each theory block, expand first paragraph to 3–5 sentences:
   # (1) threat / failure mode, (2) control, (3) evidence artifact,
   # (4) common anti-pattern, (5) link to CASO-PIU-044.
   # Optionally add one fenced "workflow sketch" as a Python multiline
   # string representing YAML (stdlib-only progressive disclosure).
```

### Diff L — Issue 07 sample: Piura narrative without stamp (T2-B already better)

Prefer rewriting T3-A application as:

```text
En CASO-PIU-044-3A el equipo de Piura no reconstruye la imagen al promover:
staging aprobó digest sha256:abc y production solo se mueve si approved_by
está presente y promoted_digest == tested_digest. Rebuild en promote es
anti-patrón (rompe la cadena de evidencia).
```

---

## 7. Recommended Priority Order for Fixing

| Priority | Issues | Rationale |
|----------|--------|-----------|
| **1. P0 correctness** | 08 (T3-B canary demo) | Students must be able to trust printed outputs. |
| **2. P1 meta-leaks** | 01, 02, 03, 04, 05 (+ M-table) | User-facing integrity; removes curriculum/ER pollution. |
| **3. P1 pedagogy depth** | 06, 09, 20 | Unique contracts + one real worked story per subtopic; resolve canary evidence vs PASS. |
| **4. P2 vocabulary & quiz** | 11, 12, 17 | Align codes; fix Spanish; section-specific recall. |
| **5. P2 technical accuracy** | 10 (full SHA), 15 (icon), 18 (optional YAML sketch in theory/iDo) | Match linked GHA/SLSA best practices. |
| **6. P3 polish** | 07, 13, 14, 16, 19 | Outcomes wording, intro claims, fleet meta pattern note. |

**Suggested fixer batching**
1. Meta purge + CASO-LIM replace_all + fraude purge.  
2. Fix T3-B code/output + align callout/weDo story.  
3. Rewrite 7 “Contrato operativo” + application paragraphs (use T2-B quality bar).  
4. selfCheck/youDo vocabulary + youDo.context grammar.  
5. Pinning SHA + icon + optional iDo enrichment.

**Do not** expand scope to rename platform id `multimodal` without a coordinated routing migration plan — strip **user-visible** legacy talk first.

---

## 8. Graph Memory Update notes

For shared curriculum graph / future explorers:

```yaml
section: 44
id: multimodal
title: CI/CD y seguridad de la cadena de suministro
file: src/lib/course/sections/s44-multimodal.ts
capstone_gate: CP-N4-B
case_primary: CASO-PIU-044
case_comment_pollution: CASO-LIM-044  # FIX required
legacy_id_visible: true  # multimodal in jobRelevance/theory/code
phase_edge:
  from: S43 containers (CASO-TRU-043, CP-N4-A)
  to: S45 cloud/queues
quality_score_explorer: 5.5
auto_audit_S44_AUDIT: ACCEPT  # redaction-only; not pedagogical depth
template_family: master_phase_contract_drill_v3
known_good_pattern_in_section:
  - T2-B unique integrity contract (digest match)
  - E1/E2/E3 fail-closed triad
  - resources list (GHA, SLSA, Sigstore, SSDF)
known_bad_patterns:
  - jobRelevance "Id legacy … path V3"
  - multimodal_vision_topic: False in student code
  - ER fraud/parentesco stamp on non-ER sections
  - CASO-LIM comments with CASO-PIU fixtures
  - Contrato operativo mega-gate clone ×7
  - T3-B canary hardcoded prints
  - STOP_PIPELINE vs per-topic breach codes
  - icon Image for CI/CD
gold_benchmark: S01 narrative + term progressive disclosure
external_benchmark: GHA security hardening + SLSA provenance labs (pin full SHA, permissions, environments)
fixer_ready: true
```

**Fleet signal:** Same “Id legacy X / path V3” meta appears in S43 (`llmops`). Explorers for S40–S52 should treat this as a **systematic leak class**, not one-off.

---

## Dimension checklist (required coverage)

| # | Dimension | Covered |
|---|-----------|---------|
| 1 | Meta-text / developer leakage | §4 + Issues 01–05, 15–16 |
| 2 | Grammar / redaction (ES-PE) | §5.4 + Issue 12 |
| 3 | Connective tissue / narrative flow | §5.3 + Issues 06–07 |
| 4 | Pedagogical structure I/W/Y | §5.1 |
| 5 | Cognitive load / progressive disclosure | §5.2 + Issue 09 |
| 6 | Exercise & exam quality | §5.5 + Issues 11, 13, 17, 20 |
| 7 | Roadmap / previous sections | §5.6 + Issue 19 |
| 8 | External best-in-class comparison | §5.7 / Issue 18 + pre-round notes |
| 9 | Other (clarity, motivation, a11y, icon) | Issues 14–15, §5.7 |

---

This is the complete Explorer report for Section 44. Ready for the Fixer prompt.
