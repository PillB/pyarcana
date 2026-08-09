# S43 Explorer Report — Contenedores y reproducibilidad operativa

**Auditor role:** Curriculum Auditor · Pedagogical Analyst · Technical Editor  
**Method:** Stanford STORM multipass + Graph Engineering + Loop Engineering + Harness Engineering  
**Scope restriction:** Section 43 only (no curriculum TS edits applied)  
**Date:** 2026-07-24  

**Live:** https://pillb.github.io/pyarcana/#llmops  
**Source:** `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s43-llmops.ts`  
**Platform id (legacy hash):** `llmops`  
**V3 title:** Contenedores y reproducibilidad operativa  
**Phase / level:** Phase 3 · Master · ~20h · CP-N4-A  

**Pre-round research anchors (pedagogy + domain):**
- Gradual release of responsibility (I Do → We Do → You Do) and cognitive-load management for technical skills.
- Docker official best practices: layer order / cache, multi-stage builds, pin base images, non-root `USER`, minimal attack surface.  
  https://docs.docker.com/build/building/best-practices/
- 12-Factor App (config as env, disposable processes), OWASP Docker Security Cheat Sheet, NIST SP 800-190.
- Gold-standard internal bar: `course-state/curriculum_hardening/GOLD_STANDARD_CHECKLIST.md` (S01 prose depth, anti-template, anti–print-theater).
- External competitors: Docker docs tutorials, OWASP container hardening, Coursera Docker intros, CS50P/Py4E progressive disclosure patterns.

---

## 1. Section Identification & Scope

| Field | Value |
|-------|--------|
| Index | 43 |
| id | `llmops` (legacy; topic is containers/ops, not LLMOps fine-tuning) |
| File | `src/lib/course/sections/s43-llmops.ts` (~1796 lines) |
| Short title (UI) | Contenedores |
| Product frame | Governed Python Service Platform · CASO-TRU-043 (Trujillo sintético) |
| Theory | 9 blocks (map + T1–T4 × A/B) |
| iDo | 8 demos (`S43-T*-*-DEMO`) |
| weDo | 24 exercises (E1 guided / E2 independent / E3 transfer × 8 subtopics) |
| youDo | CP-N4-A portfolio scaffold + weighted rubric |
| selfCheck | 5 MCQ |
| resources | 10 docs + 2 books + 5 courses |
| Stack claim | stdlib modeling Dockerfile/Compose contracts “sin cluster real” |

**In scope this run:** live section surface (curriculum card + full TS content that the SPA renders for `#llmops`), source file, prior S43 audit/fixer residues, comparison to early gold (S01) and adjacent Master pattern (S42).  

**Out of scope:** applying fixes; other sections; product UI chrome beyond content fidelity.

---

## 2. Executive Summary of Quality

### Score: **6.7 / 10**

**Verdict:** Structurally complete Master section with a correct V3 topic map (Dockerfile layers → non-root → secrets/volumes → health/signals → Compose stack → migrations → locks/multi-stage → scan/limits) and a disciplined fail-closed exercise grammar (PASS / breach code / MISSING / CONTINUE / uncertainty). However, **pedagogical depth and learner-facing redaction fall well below the S01 gold bar and below external Docker teaching quality**. Theory is dominated by **cross-subtopic template soup** (“Contrato operativo…” + “Aplicación de `…` al caso peruano sintético…” + fraud/parentesco ethics tail that is **off-domain** for containers). Demos and exercises mostly **predicate over synthetic dicts** rather than teaching real Dockerfile/Compose syntax, layer cache mechanics, or signal handling—acceptable as progressive disclosure *only if* theory first shows real artifacts; it largely does not. Multiple **meta-leaks** (legacy id `llmops`, “path V3”, authoring recipe “iDo/weDo E1/E2/E3”, pedagogical jargon “progressive disclosure”) appear in user-facing prose. Case branding is **split** (`CASO-TRU-043` narrative vs `CASO-LIM-043` comments in every starter). Automated `S43_AUDIT.json` ACCEPT / mean_rank ~9.5 is **not** endorsed as pedagogical gold (checklist anti-pattern: structural green ≠ expert gold).

**Key strengths**
- Clear promotion gate CP-N4-A: repeatable build, non-root, no baked secrets, resource limits, clean shutdown.
- Explicit disclaimer that legacy id ≠ LLM fine-tuning (good curriculum honesty—but currently written as developer meta).
- Full 8/8/24 skeleton with one intentional inverted defect per exercise.
- Resources are domain-honest (Docker docs, multi-stage, Compose, OCI, OWASP, NIST, Trivy, signals).
- Connects S41–S42 service to container packaging and points forward to S44 CI/CD supply chain.

**Key weaknesses**
- Template triplets replace mechanism teaching for T1-B…T4-B (only T1-A has a somewhat specific “Contrato de cache”).
- Print/dict theater: many demos do not compute the claimed evidence (esp. T1-B “non-root” demo that only picks slim/distroless by MB).
- Meta-text and authoring notes leak to learners.
- CASO-LIM vs CASO-TRU inconsistency; edgeCases text often describes the *good* contract as the adverse fixture.
- Self-check Q2/Q4 gate vocabulary and ER/fraud framing are misaligned with S43 domain.
- Learning outcomes are telegraphic vs S01 measurability.
- Headings/grammar: uncapitalized “bases…”, Spanglish “migrations”, run-on youDo context.

---

## 3. Detailed Issue Registry

Severity scale: **P0** blocker for gold · **P1** high learner impact · **P2** medium · **P3** polish.

### Issue 1 — Meta-leak: legacy id + V3 path in jobRelevance  
- **Severity:** P1  
- **Location:** `jobRelevance` (lines ~15)  
- **Evidence:**  
  > `Id legacy \`llmops\` se conserva; el path V3 es contenedores/ops, no pipelines de fine-tuning LLM.`  
- **Impact:** Learners see curriculum versioning and migration notes; confuses focus (“am I doing LLMOps?”). The *clarification* is pedagogically useful; the *wording* is developer-facing.  
- **Graph node:** `meta.jobRelevance.legacy_id`

### Issue 2 — Meta-leak: authoring recipe + progressive disclosure + V3 in map theory  
- **Severity:** P1  
- **Location:** theory map, paragraph 4 (~33)  
- **Evidence:**  
  > `Teoría medible, iDo que calcula el contrato, weDo E1/E2/E3 con un defecto ops por ejercicio. Id legacy \`llmops\` no implica LLMOps de modelos; V3 es reproducibilidad… progressive disclosure con dicts…`  
- **Impact:** Exposes internal pedagogy pipeline and version control language; “progressive disclosure” is instructor jargon in ES-PE course voice.  
- **Graph node:** `meta.theory.map.authoring_recipe`

### Issue 3 — Template soup: identical “Contrato operativo” shell ×7  
- **Severity:** P0 (gold bar anti-pattern #2)  
- **Location:** theory T1-B…T4-B paragraph 2 (~97, 126, 156, 184, 217, 245, 278)  
- **Evidence (shared stem):**  
  > `Contrato operativo. Entrada: código fijado, locks, configuración no secreta y secretos inyectados en runtime. … Error: imagen mutable, proceso root, health check falso o migración no reversible bloquea release. Criterio de éxito: build repetible, usuario no root, límites de recursos y shutdown limpio pasan en entorno nuevo.`  
  Only “Salida de este subtema: …” varies.  
- **Impact:** High cognitive boredom + zero progressive mechanism teaching; same section-level gate repeated instead of subtopic-specific contracts (cache invalidation, USER/capabilities, secret refs, readiness vs liveness, depends_on vs retries, expand/contract, multi-stage COPY, CVE policy). Violates GOLD_STANDARD “template triplet only”.  
- **Graph node:** `boilerplate.contract_operativo.s43`

### Issue 4 — Template soup: identical “Aplicación… fraude/parentesco” shell ×7  
- **Severity:** P0  
- **Location:** theory T1-B…T4-B paragraph 3  
- **Evidence:**  
  > `Aplicación de \`…\` al caso peruano sintético \`CASO-TRU-043\`: API, worker, base y cache locales de una plataforma ficticia en Trujillo. La evidencia esperada es …. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.`  
- **Impact:** Ethics sentence is **domain-wrong** for containers (copied from ER/ML triage sections). Wastes attention; dilutes real container risks (escape, secrets in layers, root, CVE).  
- **Graph node:** `boilerplate.aplicacion_fraude_parentesco.s43`

### Issue 5 — Thin mechanism paragraphs (T1-B…T4-B P1)  
- **Severity:** P1  
- **Location:** first paragraph of each subtopic after T1-A  
- **Evidence examples:**  
  - T1-B: single dense sentence on base mínima / UID / capabilities—no worked USER snippet, no distroless vs slim trade-off.  
  - T2-B: “readiness expresa capacidad… liveness bloqueo…” without HTTP codes, probe failure modes, or SIGTERM drain sequence.  
  - T3-A: mentions `depends_on` vs retries but no Compose excerpt.  
- **Impact:** Master learners leave without transferable Docker mental models; external courses (Docker docs) teach with concrete Dockerfile/Compose fragments.  
- **Graph node:** `pedagogy.mechanism_thin`

### Issue 6 — Print / dict theater vs claimed evidence (iDo misalignment)  
- **Severity:** P1  
- **Location:** iDo demos, esp. T1-B, T2-B, T3-A, T4-B  
- **Evidence:**  
  - T1-B demo `choose_base(40)` → distroless; **why** claims evidence “proceso non-root verificado” but code never checks UID/USER.  
  - T2-B prints hardcoded `"graceful", True` without simulating SIGTERM.  
  - T4-B `block_deploy(0)` only checks CVE count; ignores OOM/limits claimed in theory.  
  - Theory T1-A `layer_order` does not model digest equality (only index order).  
- **Impact:** Violates anti–print-theater bar; learners cannot map demo → gate evidence.  
- **Graph node:** `theater.ido_evidence_mismatch`

### Issue 7 — Exercise monotony / low transfer authenticity  
- **Severity:** P1  
- **Location:** all 24 weDo steps  
- **Evidence:** Same scaffold: invert boolean / assess missing / decide CONTINUE|BREACH|UNCERTAIN over pre-labeled dict fields. Instructions are long and domain-named, but cognitive skill is “fix inverted predicate,” not write Dockerfile layer order or Compose healthcheck. E3 is structural transfer, not task transfer to ops artifacts.  
- **Impact:** Gradual release appears formal but collapses to one micro-skill ×24; weak portfolio signal for containers roles.  
- **Graph node:** `pedagogy.wedo_predicate_monoculture`

### Issue 8 — CASO-LIM-043 vs CASO-TRU-043 branding split  
- **Severity:** P1  
- **Location:** every starter comment `# CASO-LIM-043 · …` vs fixtures `CASO-TRU-043-*` and narrative Trujillo  
- **Evidence:** 24× starter lines e.g. `# CASO-LIM-043 · Dockerfile layer cache order` with `case_id: "CASO-TRU-043-1A"`. Prior VERIFY dossier still says fixtures `CASO-LIM-043`.  
- **Impact:** Learner/geo consistency broken; looks like incomplete city migration (Lima→Trujillo). Meta residue of rewrite.  
- **Graph node:** `consistency.caso_lim_vs_tru`

### Issue 9 — edgeCases wording inverted / unhelpful  
- **Severity:** P2  
- **Location:** each exercise `edgeCases` array  
- **Evidence:**  
  > `"fixture adverso: layer de dependencias reutilizable y digest estable"`  
  That phrase describes the *valid* contract, not the adverse fixture (which has `dependency_layer_reused:False`, rebuilds 6, etc.).  
- **Impact:** Hints mislead; quality smell of bulk generation.  
- **Graph node:** `redaction.edgeCases_inverted`

### Issue 10 — Theory vs exercises UID rule inconsistency  
- **Severity:** P2  
- **Location:** theory `nonroot_user` uses `uid >= 1000`; exercises use `uid != 0`  
- **Evidence:** `nonroot: uid >= 1000` vs `record["uid"] != 0`.  
- **Impact:** UID 1–999 would pass exercises but fail theory definition; imperfect contract teaching.  
- **Graph node:** `consistency.nonroot_threshold`

### Issue 11 — T4-B predicate: zero limits pass size check  
- **Severity:** P2  
- **Location:** T4-B solutions  
- **Evidence:** `memory_limit_mb <= 512 and cpu_limit <= 1.0` treats `0` as valid (0 ≤ bound). Invalid fixture fails via CVEs/debug, not zero limits. Domain intent “límites definidos” is not encoded.  
- **Impact:** Silent wrong mental model: unlimited/zero can “pass” if other fields clean.  
- **Graph node:** `logic.t4b_limits_predicate`

### Issue 12 — Gate vocabulary inconsistency (selfCheck / youDo / weDo)  
- **Severity:** P2  
- **Location:** selfCheck Q2; youDo requirements; weDo breach codes  
- **Evidence:**  
  - weDo: `REORDER_DOCKERFILE`, `REBUILD_NONROOT`, `REMOVE_BAKED_SECRET`, … `QUARANTINE_IMAGE`  
  - selfCheck Q2: `BLOCK_IMAGE`  
  - youDo: `BLOCK_IMAGE` and `QUARANTINE_BUILD`  
- **Impact:** Active recall tests a code that exercises never use; portfolio codes differ again.  
- **Graph node:** `consistency.gate_codes`

### Issue 13 — Self-check Q4 off-topic (ER / fraude / parentesco)  
- **Severity:** P2  
- **Location:** selfCheck question 4  
- **Evidence:** options about ER proving fraud/parentesco—domain of S30–S34, not containers.  
- **Impact:** Assessment misalignment; wastes one of only five MCQs.  
- **Graph node:** `assessment.off_topic_q4`

### Issue 14 — Grammar / redaction (ES-PE)  
- **Severity:** P2  
- **Locations / evidence:**  
  - Heading `"bases, usuarios no root y tamaño"` — missing initial capital.  
  - Heading/prose `"dependencias, migrations y datos efímeros"` — Spanglish; should be *migraciones* (or keep English only if consistently technical).  
  - youDo context:  
    > `El gate se bloquea ante: imagen mutable, proceso root, health check falso o migración no reversible bloquea release.`  
    Double finite verb / broken list grammar.  
  - selfCheck explanations: “La teoría exige dos builds producen…” missing *que*.  
  - Callouts like “conserva vulnerabilidad crítica y OOM simulados bloquean” — telegraphic / hard to parse.  
  - “debugguea” in learning outcomes — nonstandard; prefer *depura* or *debuggea*.  
- **Impact:** Lowers professional ES-PE polish expected at Master.  
- **Graph node:** `redaction.grammar_es_pe`

### Issue 15 — Learning outcomes telegraphic vs S01 gold  
- **Severity:** P2  
- **Location:** `learningOutcomes`  
- **Evidence:** e.g. `"Optimiza Dockerfile y layers"` without measurable verb+artifact (compare S01 multi-clause outcomes).  
- **Impact:** Weak self-assessment checklist for 20h Master block.  
- **Graph node:** `pedagogy.outcomes_thin`

### Issue 16 — youDo scaffold is checklist theater relative to requirements  
- **Severity:** P1  
- **Location:** youDo `starterCode`  
- **Evidence:** Boolean readiness over four keys; requirements ask multi-stage Dockerfile, Compose API/worker/DB/cache, runbook, three cases. Starter never models those artifacts.  
- **Impact:** Portfolio entry under-scaffolds Master claim “un comando”; learners may flip bools to READY without containers evidence (portfolioNote warns, but scaffold still invites checkbox gaming).  
- **Graph node:** `pedagogy.youdo_checklist_theater`

### Issue 17 — No learner-visible Dockerfile/Compose artifact in theory code blocks  
- **Severity:** P1  
- **Location:** all theory `code` blocks  
- **Evidence:** Every theory sample is Python dict/function; section never shows a minimal multi-stage Dockerfile or compose YAML (even as fenced reference). Resources link out, but I Do does not demonstrate.  
- **Impact:** Against Docker pedagogy best practice (order of instructions *is* the lesson). Progressive disclosure via stdlib is a valid *exercise* strategy, not a substitute for showing the real contract once.  
- **Graph node:** `domain.missing_real_artifacts`

### Issue 18 — Connective tissue: S42→S43 OK; internal narrative weak after T1-A  
- **Severity:** P2  
- **Location:** map vs subtopics  
- **Evidence:** Map glossary + product incremental is strong; thereafter paragraphs do not reference prior subtopic outputs (e.g. T2 does not say “given non-root image from T1-B…”).  
- **Impact:** Feels like eight parallel cards, not one platform story.  
- **Graph node:** `flow.connective_tissue`

### Issue 19 — Cognitive load: jargon front-load without worked example  
- **Severity:** P2  
- **Location:** map dictionary paragraph  
- **Evidence:** SBOM/scan, readiness, multi-stage, resource limits all defined in one bullet wall before any demo.  
- **Impact:** Glossary is good, but Master section still needs one full vertical slice early (e.g. mini Dockerfile walkthrough) to ground terms—currently deferred to pure abstraction.  
- **Graph node:** `pedagogy.cognitive_load`

### Issue 20 — Icon/accent mismatch (minor)  
- **Severity:** P3  
- **Location:** metadata `icon: "BarChart3"`  
- **Evidence:** Chart icon for containers/ops section.  
- **Impact:** UI affordance mismatch only.  
- **Graph node:** `ui.icon_mismatch`

### Issue 21 — Residual dossier drift  
- **Severity:** P3 (process, not learner-facing)  
- **Location:** `dossiers/S43_VERIFY.md` still cites CASO-LIM fixtures and rank 8.9; paragraph analysis claims 9.55 and STORM 43 cycles with templated analysis text.  
- **Impact:** Harness memory pollution if Fixer trusts dossiers blindly.  
- **Graph node:** `process.dossier_drift`

---

## 4. Meta-Leak Report

| # | Exact leaked text (or stem) | Location | Classification |
|---|----------------------------|----------|----------------|
| M1 | `Id legacy \`llmops\` se conserva; el path V3 es contenedores/ops…` | jobRelevance | Curriculum migration note |
| M2 | `Id legacy \`llmops\` no implica LLMOps de modelos; V3 es reproducibilidad del servicio en contenedor` | theory map P4 | Legacy/version meta |
| M3 | `Teoría medible, iDo que calcula el contrato, weDo E1/E2/E3 con un defecto ops por ejercicio` | theory map P4 | Authoring recipe |
| M4 | `progressive disclosure con dicts y checks stdlib` | theory map P2 | Instructor pedagogy jargon |
| M5 | `# CASO-LIM-043 · …` on all starters while narrative is TRU | weDo starters ×24 | Migration residue / geo leak |
| M6 | `DEFECT: …` / `Contrato: corrige el DEFECT; salida alineada a solutionCode` | starters | Acceptable exercise authoring if intentional; borderline meta if over-repeated as factory stamp |
| M7 | Fraud/parentesco ethics paste in containers “Aplicación” | theory T1-B…T4-B | Cross-section boilerplate leak (wrong domain) |

**Meta-leak count (learner-facing material issues):** **7** clusters (M1–M7); M1–M5 are clear developer→learner leaks; M6 is borderline factory stamp; M7 is domain-inappropriate paste.

**Not counted as leak (good):** Gate codes as learner contracts; “stdlib modeling without real cluster” as deliberate scope (should be rewritten in learner voice, not removed).

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do fidelity

| Layer | Structural | Pedagogical fidelity |
|-------|------------|----------------------|
| **I Do** | 8 demos with id, why, code, output | Low–medium: demos are contract calculators, not worked ops demos. Several `why` claims overstate evidence. |
| **We Do** | 24 = guided → independent → transfer | Formally correct gradual release; content skill is almost only “repair inverted gate predicate.” Hints repeat. Feedback templates identical per subtopic trio. |
| **You Do** | Rubric + requirements rich | Starter is readiness checklist; gap between requirements (real Dockerfile/Compose/runbook) and scaffold is large. |
| **Self-check** | 5 MCQ, 70% gate implied by product | 3/5 aligned; Q2 code mismatch; Q4 ER ethics off-topic. |

**Gradual release verdict:** Surface structure matches product pedagogy; **responsibility transfer is shallow** because theory never models real container artifacts learners must eventually produce for CP-N4-A.

### 5.2 Cognitive load & progressive disclosure

- **Positive:** Explicit map order T1→T4; synthetic lab without mandatory remote registry/cluster.  
- **Negative:** Section-level success criteria repeated 7×; ethics non sequitur adds extraneous load; dictionary dumps terms before any vertical example.  
- **Progressive disclosure claim** (“dicts not Docker daemon”) is valid for CI-less browsers, but **must still teach Docker semantics** via text/code samples learners can later run locally. Currently disclosure is *too* progressive: concepts stay symbolic.

### 5.3 Connective tissue & roadmap

- **Backward:** S41–S42 “control plane / servicio seguro” → container packaging is correct for Master Phase 3.  
- **Forward:** Natural handoff to S44 CI/CD supply chain (scan, artifact, rollback)—hinted via scan gates but not narrated as bridge.  
- **Legacy id `llmops`:** Correctly not teaching LLMOps (that lives nearer S47/S48); must be learner-clarified without “V3/legacy” speak.

### 5.4 Comparison to gold-standard early sections (S01)

| Dimension | S01 | S43 |
|-----------|-----|-----|
| Paragraph depth | Multi-sentence teaching, worked why | Often 1–2 template shells |
| Code authenticity | Real `python`/`venv`/Git workflows | Abstract dicts only |
| Outcomes | Measurable multi-clause | Short slogans |
| Voice | Warm ES-PE workplace | Contract-ops industrial + meta |
| Exercise variety | Domain tasks evolve | Same three shapes ×8 |

### 5.5 Comparison to external best-in-class (Docker)

Docker docs emphasize: cache-sensitive instruction order, pin digests, multi-stage, non-root USER, `.dockerignore`, rebuild often, one concern per container. S43 **names** these topics accurately and points to official resources, but **does not teach them by showing Dockerfile instructions**. Relative to OWASP container hardening, secrets-in-image and non-root are correctly gated in exercises, but learners practice booleans not `USER 10001` / secret mounts.

### 5.6 Exercise & exam quality alignment

- **Aligned:** Layer cache fields, non-root, baked secrets, health/grace, compose health set equality, expand migration, lock hash, CVE+debug shell.  
- **Misaligned:** selfCheck Q2/Q4; edgeCases labels; UID thresholds; T4-B zero limits.  
- **Strength of fail-closed pattern:** Distinguishing MISSING/INSPECT vs BREACH is excellent for ops maturity—keep pattern, diversify *what* is assessed (e.g. parse a mini Dockerfile string, validate compose service names, simulate probe statuses).

### 5.7 Accessibility / motivation

- Trujillo synthetic platform is good situating; jobRelevance is strong until meta tail.  
- Accent/icon minor.  
- 20h estimate is ambitious if content stays abstract (learners may finish “predicate drills” fast but leave unable to write a production Dockerfile).

### 5.8 Redaction pass (Peruvian Spanish)

Prioritize: capitalize headings; *migraciones*; fix youDo run-on; remove fraud/parentesco paste; rewrite “bloquea release” fragments into full clauses; replace developer V3/legacy with learner-facing “el identificador técnico de esta sección en la app es `llmops`, pero el tema es contenedores…”.

---

## 6. Proposed GitHub-style Diffs

> Diffs are **proposals only** — Explorer does not apply them. Paths relative to repo root. Snippets illustrative; Fixer should expand consistently across all seven template subtopics.

### Diff A — Strip jobRelevance meta (Issue 1)

```diff
--- a/src/lib/course/sections/s43-llmops.ts
+++ b/src/lib/course/sections/s43-llmops.ts
@@ jobRelevance
-    "En equipos de plataforma y producto, **contenedores y reproducibilidad operativa** empaquetan el control plane (S41–S42) en un servicio que se levanta con un comando: imagen mínima, non-root, health/readiness y shutdown limpio. Se promueve solo cuando el build es repetible en entorno nuevo, no hay secretos horneados y los límites de recursos/CVE críticos están bajo control. Id legacy `llmops` se conserva; el path V3 es contenedores/ops, no pipelines de fine-tuning LLM.",
+    "En equipos de plataforma y producto, **contenedores y reproducibilidad operativa** empaquetan el servicio de S41–S42 en algo que se levanta con un comando: imagen mínima, non-root, health/readiness y shutdown limpio. Se promociona solo cuando el build es repetible en un entorno nuevo, no hay secretos horneados y los límites de recursos y CVE críticos están bajo control. Esta sección no cubre pipelines de fine-tuning de modelos: el foco es empaquetar y operar el servicio Python de forma reproducible.",
```

### Diff B — Rewrite map P2/P4 learner voice (Issues 2, 4 partial)

```diff
--- a/src/lib/course/sections/s43-llmops.ts
+++ b/src/lib/course/sections/s43-llmops.ts
@@ theory map paragraphs
-        "Esta sección empaqueta el servicio seguro de S42 en **contenedores reproducibles** sin cluster real: contratos al estilo Dockerfile/Compose (referencia Docker; progressive disclosure con dicts y checks stdlib). El caso `CASO-TRU-043` (plataforma ficticia en Trujillo) es sintético: sin secretos reales ni registro remoto obligatorio.",
+        "Esta sección empaqueta el servicio seguro de S42 en **contenedores reproducibles** sin exigir un cluster: aprendes los contratos de Dockerfile y Compose (referencia Docker oficial) y los verificas primero con modelos en Python/stdlib que puedes correr en el navegador o en local. El caso `CASO-TRU-043` (plataforma ficticia en Trujillo) es sintético: sin secretos reales ni registro remoto obligatorio.",
-        "Orden: T1 Dockerfile/non-root → T2 config/secrets/signals → T3 compose y migraciones → T4 locks, multi-stage, scan y límites. Teoría medible, iDo que calcula el contrato, weDo E1/E2/E3 con un defecto ops por ejercicio. Id legacy `llmops` no implica LLMOps de modelos; V3 es reproducibilidad del servicio en contenedor. Stack didáctico: **stdlib** modelando contratos Docker/Compose sin cluster real.",
+        "Orden de aprendizaje: T1 Dockerfile y non-root → T2 config, secretos y señales → T3 Compose y migraciones → T4 locks, multi-stage, scan y límites. En cada bloque verás el contrato, una demo que lo calcula y ejercicios que fallan cerrado si el build no es reproducible. Stack de práctica: **stdlib** para modelar el contrato; en el youDo documentas los artefactos reales (Dockerfile/Compose) listos para un entorno con Docker.",
```

### Diff C — Replace template “Contrato operativo” for T1-B (Issue 3 pattern)

```diff
--- a/src/lib/course/sections/s43-llmops.ts
+++ b/src/lib/course/sections/s43-llmops.ts
@@ S43-T1-B
-        "Contrato operativo. Entrada: código fijado, locks, configuración no secreta y secretos inyectados en runtime. Salida de este subtema: proceso non-root verificado. Error: imagen mutable, proceso root, health check falso o migración no reversible bloquea release. Criterio de éxito: build repetible, usuario no root, límites de recursos y shutdown limpio pasan en entorno nuevo.",
-        "Aplicación de `bases, usuarios no root y tamaño` al caso peruano sintético `CASO-TRU-043`: API, worker, base y cache locales de una plataforma ficticia en Trujillo. La evidencia esperada es proceso non-root verificado. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
+        "Contrato de base y usuario. Entrada: tag o digest de base, UID planificado (≥1000), capabilities y techo de tamaño runtime. Salida: imagen con base fijada (no `latest` suelto), proceso con UID non-root y sin capabilities extras, runtime bajo el presupuesto de MB. Error de promoción: UID 0, `CAP_SYS_ADMIN`, base mutable o imagen inflada sin justificación. Criterio local: `USER`/`uid` y tamaño se auditan antes de publicar.",
+        "En `CASO-TRU-043-T1B` (API de la plataforma ficticia en Trujillo) eliges `python:3.12-slim` (o distroless en runtime multi-stage) con digest, creas `appuser` 10001 y verificas non-root. No se usan secretos ni PII; el riesgo a documentar es superficie de ataque y privilegio, no fraude ni parentesco.",
```

*(Fixer: apply analogous subtopic-specific contracts for T2-A…T4-B — secrets, probes, compose, migrations, locks, scan.)*

### Diff D — Capitalize heading + migraciones (Issue 14)

```diff
-      heading: "bases, usuarios no root y tamaño",
+      heading: "Bases, usuarios no root y tamaño",
-      heading: "dependencias, migrations y datos efímeros",
+      heading: "Dependencias, migraciones y datos efímeros",
```

### Diff E — Align T1-B demo with non-root evidence (Issue 6)

```diff
--- a/src/lib/course/sections/s43-llmops.ts
+++ b/src/lib/course/sections/s43-llmops.ts
@@ S43-T1-B-DEMO
-          code: `def choose_base(size_mb: int) -> tuple:
-    base = "slim" if size_mb <= 80 else "full"
-    smaller = "distroless" if size_mb <= 50 else base
-    return smaller, size_mb, base
-
-smaller, mb, base = choose_base(40)
-print("smaller", smaller)
-print("mb", mb)
-print("base", base)`,
-          output: `smaller distroless
-mb 40
-base slim`,
+          code: `def audit_runtime(base: str, uid: int, caps: set, runtime_mb: int, max_mb: int) -> dict:
+    nonroot = uid >= 1000
+    slim_ok = runtime_mb <= max_mb
+    ok = base != "latest" and nonroot and not caps and slim_ok
+    return {"base": base, "uid": uid, "nonroot": nonroot, "ok": ok}
+
+r = audit_runtime("python:3.12-slim@sha256:demo", 10001, set(), 118, 150)
+print("nonroot", r["nonroot"])
+print("uid", r["uid"])
+print("ok", r["ok"])`,
+          output: `nonroot True
+uid 10001
+ok True`,
```

### Diff F — Unify CASO branding in starters (Issue 8)

```diff
-# CASO-LIM-043 · Dockerfile layer cache order
+# CASO-TRU-043 · Dockerfile layer cache order
```

*(replace_all across weDo starters in this file.)*

### Diff G — Fix edgeCases for T1-A (Issue 9 pattern)

```diff
-        edgeCases: ["falta digest_stable", "fixture adverso: layer de dependencias reutilizable y digest estable", "CASO-TRU-043-1A es sintético"],
+        edgeCases: ["falta digest_stable → INSPECT_CACHE_INVALIDATION", "adverso: source antes de lock / deps no reutilizadas / rebuilds altos → REORDER_DOCKERFILE", "CASO-TRU-043-1A es sintético"],
```

### Diff H — Align UID and T4-B limits (Issues 10–11)

```diff
-    return "PASS" if record["base_pinned"] and record["uid"] != 0 and not record["capabilities"] and record["runtime_mb"] <= record["max_mb"] else "REBUILD_NONROOT"
+    return "PASS" if record["base_pinned"] and record["uid"] >= 1000 and not record["capabilities"] and record["runtime_mb"] <= record["max_mb"] else "REBUILD_NONROOT"
```

```diff
-    return "PASS" if record["critical_cves"] == 0 and record["memory_limit_mb"] <= 512 and record["cpu_limit"] <= 1.0 and not record["debug_shell"] and record["logs_redacted"] else "QUARANTINE_IMAGE"
+    return "PASS" if record["critical_cves"] == 0 and 0 < record["memory_limit_mb"] <= 512 and 0 < record["cpu_limit"] <= 1.0 and not record["debug_shell"] and record["logs_redacted"] else "QUARANTINE_IMAGE"
```

*(mirror in E1/E3 solutions and invalid fixtures as needed.)*

### Diff I — Self-check realignment (Issues 12–13)

```diff
-        question: "Si ocurre la condición de error de S43, ¿qué respuesta preserva seguridad y auditabilidad?",
-        options: ["emitir BLOCK_IMAGE y conservar evidencia", "continuar y ocultar el warning", "inventar evidencia faltante", "borrar el trace para reducir ruido"],
-        correctIndex: 0,
-        explanation: "El contrato falla cerrado con BLOCK_IMAGE; no convierte incertidumbre o breach en éxito.",
+        question: "Si el health check no prueba readiness real o el proceso corre como root, ¿qué respuesta preserva seguridad y auditabilidad?",
+        options: ["emitir el código de breach del subtema (p. ej. REBUILD_NONROOT o DRAIN_AND_ISOLATE) y conservar evidencia", "continuar y ocultar el warning", "inventar evidencia faltante", "borrar el trace para reducir ruido"],
+        correctIndex: 0,
+        explanation: "Cada subtema falla cerrado con su código de breach; la incertidumbre usa rutas de inspección, no éxito silencioso.",
```

```diff
-        question: "¿Qué tratamiento de `CASO-TRU-043` respeta el alcance del curso?",
-        options: ["reemplazarlo por datos reales sin consentimiento", "subir secretos para facilitar la demo", "inferir fraude o parentesco desde ER", "mantenerlo sintético, mínimo, trazable y sujeto a revisión humana"],
-        correctIndex: 3,
-        explanation: "Los casos son sintéticos; ER solo propone correspondencia de entidad y no prueba fraude, parentesco ni riesgo.",
+        question: "¿Qué tratamiento de secretos en la imagen de `CASO-TRU-043` respeta el alcance del curso?",
+        options: ["hornear la API key en una capa ENV del Dockerfile", "subir `.env` con secretos al repositorio público", "inyectar secretos solo en runtime y verificar que la imagen no los contiene", "imprimir secretos en logs de health para depurar más rápido"],
+        correctIndex: 2,
+        explanation: "Los secretos se inyectan en runtime; la imagen e inspección no deben contener valores secretos horneados.",
```

### Diff J — youDo context grammar + starter depth note (Issues 14, 16)

```diff
-    context: "Governed Python Service Platform reproducible. Trabaja sobre API, worker, base y cache locales de una plataforma ficticia en Trujillo. Entrada: código fijado, locks, configuración no secreta y secretos inyectados en runtime. Salida: imágenes mínimas, servicios sanos y recuperación documentada con un comando. El gate se bloquea ante: imagen mutable, proceso root, health check falso o migración no reversible bloquea release.",
+    context: "Governed Python Service Platform reproducible. Trabaja sobre API, worker, base y cache locales de una plataforma ficticia en Trujillo. Entrada: código fijado, locks, configuración no secreta y secretos inyectados en runtime. Salida: imágenes mínimas, servicios sanos y recuperación documentada con un comando. El gate se bloquea si hay imagen mutable, proceso root, health check falso o migración no reversible.",
```

```diff
     starterCode: `CASE_ID = "CASO-TRU-043"
 REQUIRED = ['dockerfile_multi_stage_fijado', 'compose_con_api_worker_db_cache_y_health_checks', 'config_secrets_volumes_documentados', 'runbook_de_migracion_senales_limites_y_recuperacion']
 evidence = {
@@
 def readiness(bundle: dict[str, bool]) -> tuple[str, list[str]]:
     missing = [name for name in REQUIRED if bundle.get(name) is not True]
     return ("READY", []) if not missing else ("BLOCKED", missing)
+
+# Extiende: parsea rutas a artefactos (Dockerfile, compose.yaml, runbook.md),
+# valida gates normal / breach (p. ej. REBUILD_NONROOT) / incierto (QUARANTINE_BUILD)
+# y no marques True sin archivo o checklist firmado.
```

### Diff K — Optional: add one real Dockerfile fragment in T1-A theory (Issue 17)

```diff
+      // Prefer a second callout or code block language: 'dockerfile' if CourseSection allows;
+      // otherwise a triple-quoted string constant parsed by a Python helper that checks layer order.
```

```dockerfile
# Illustrative learner-facing fragment (to embed via allowed code language)
FROM python:3.12-slim@sha256:REPLACE
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY src/ ./src/
USER 10001
CMD ["python", "-m", "app"]
```

*(If the TS type only allows `python`/`bash`, keep as Python string + checker that validates instruction order tokens.)*

### Diff L — Learning outcomes expansion (Issue 15)

```diff
-    { text: "Optimiza Dockerfile y layers" },
+    { text: "Ordenar layers de un Dockerfile (base → deps/lock → app → USER/CMD) y explicar cuándo se invalida el cache" },
-    { text: "Usa non-root y reduce tamaño" },
+    { text: "Elegir base parchable con digest, ejecutar como UID ≥1000 sin capabilities extras y acotar tamaño runtime" },
```

*(expand remaining six similarly.)*

---

## 7. Recommended Priority Order for Fixing

| Priority | Issues | Rationale |
|---------:|--------|-----------|
| **1** | 3, 4 (template + fraud paste) | Highest learner-visible quality failure; gold-bar blocker |
| **2** | 1, 2 (meta V3/legacy/authoring) | Trust and clarity of Master path |
| **3** | 6, 17 (demo evidence + real artifacts) | Teach actual container contracts |
| **4** | 7, 16 (weDo/youDo authenticity) | Portfolio and gradual release substance |
| **5** | 8, 9, 10, 11, 12, 13 (consistency/logic/exam) | Prevent wrong gates and branding |
| **6** | 14, 15, 18, 19 (grammar, outcomes, flow, load) | Polish after structural rewrite |
| **7** | 20, 21 (icon, dossiers) | Housekeeping |

**Suggested Fixer loop budget:** 2 passes — (1) strip/rewrite theory templates + meta; (2) align demos/exercises/selfCheck/youDo + CASO-TRU unify.

**Do not:** bulk-regex append new ethics tails; claim gold from auditor mean_rank alone.

---

## 8. Graph Memory Update notes

```yaml
section: 43
id: llmops
file: src/lib/course/sections/s43-llmops.ts
title_v3: Contenedores y reproducibilidad operativa
explorer_score: 6.7
status: explorer_complete
structural:
  theory_blocks: 9
  ido: 8
  wedo: 24
  youdo: true
  selfcheck: 5
  resources: ok_domain
quality_edges:
  - from: theory.T1B_T4B
    to: boilerplate.contract_operativo
    type: near_duplicate_shell
  - from: theory.aplicacion
    to: ethics.fraude_parentesco
    type: off_domain_paste
  - from: jobRelevance
    to: meta.legacy_llmops_v3
    type: developer_leak
  - from: wedo.starters
    to: caso.LIM_vs_TRU
    type: branding_split
  - from: ido.T1B
    to: evidence.nonroot
    type: claim_code_mismatch
  - from: selfCheck.Q4
    to: domain.ER
    type: off_topic_assessment
  - from: S42
    to: S43
    type: roadmap_ok_service_to_containers
  - from: S43
    to: S44
    type: natural_next_cicd_supply_chain
anti_patterns_hit:
  - template_triplet_contract_aplicacion
  - print_theater_partial
  - meta_leak_legacy_v3
  - ethics_boilerplate_wrong_domain
prior_auditor:
  S43_AUDIT.json: ACCEPT mean_rank~9.5
  explorer_override: structural_green_not_gold
fixer_hints:
  - rewrite_seven_subtopic_contracts_specific
  - remove_fraude_parentesco_from_containers
  - unify_CASO_TRU_in_starters
  - show_one_dockerfile_fragment_in_theory
  - diversify_at_least_E3_toward_artifact_validation
nodes_to_preserve:
  - fail_closed_E1_E2_E3_pattern
  - CP-N4-A_gates
  - resources_docker_owasp_nist_trivy
  - synthetic_no_remote_registry_requirement
```

---

## Research notes (STORM multipass summary)

1. **Surface scan:** Complete Master shell; UI card matches shortTitle/tagline; live curriculum lists Section 43 Contenedores.  
2. **Pedagogical critique:** Formal I/W/Y present; mechanism teaching thin; exercise monoculture.  
3. **Redaction:** ES-PE issues; meta leaks; CASO split.  
4. **Meta-leak detection:** legacy/V3/authoring/progressive disclosure/CASO-LIM.  
5. **Comparative:** Below S01 prose; below Docker docs artifact teaching; resources competitive.  
6. **Loop refine:** Confirmed template counts (7× contract, 7× fraud paste, 24× CASO-LIM); T4-B zero-limit logic; UID mismatch.

---

This is the complete Explorer report for Section 43. Ready for the Fixer prompt.
