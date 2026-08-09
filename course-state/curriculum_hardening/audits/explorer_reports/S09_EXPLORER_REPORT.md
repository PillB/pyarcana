# S09 Explorer Report — Excepciones, debugging y logging seguro

**Auditor role:** Curriculum Auditor · Pedagogical Analyst · Technical Editor  
**Method:** Stanford STORM + Graph Engineering + Loop Engineering + Harness Engineering  
**Platform section id:** `visualization`  
**Source file:** `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s09-visualization.ts`  
**Live site:** https://pillb.github.io/pyarcana/ (curriculum card S09 “Excepciones & logs”; SPA hash `#visualization`)  
**Date:** 2026-07-24  
**Scope rule:** Analysis only — no product/curriculum TS edits applied.

---

## 1. Section Identification & Scope

| Field | Value |
|-------|--------|
| Index | 9 |
| Platform id (hash) | `visualization` |
| Learner-facing title | Excepciones, debugging y logging seguro |
| shortTitle (UI) | Excepciones & logs |
| File | `s09-visualization.ts` → export `section09` |
| Level / phase | Intermedio · phase 0 |
| Estimated hours | 19 |
| Capstone thread | Inicio **CP-N1-C** (bitácora auditable, sin PII completa) |
| Subtopic graph | T1 Excepciones (A/B) → T2 Diagnóstico (A/B) → T3 Logging (A/B) → T4 Resiliencia (A/B) |
| Structural inventory | Theory map + 8 blocks · iDo 8 demos · weDo 24 exercises · youDo 1 · selfCheck 6 · resources docs/books/courses |

**Topic reality (critical for Fixer):** Despite the legacy filename and platform id `visualization`, V3 learner content is **exceptions, debugging, structured logging with PII redaction, fail-fast vs quarantine, retries/idempotency**. True data visualization lives later (curriculum card ~S19 “Viz accesible”). This report audits the **exceptions/logs** curriculum only.

**Sources consulted**
- Full section TS (`s09-visualization.ts`, ~2149 lines)
- Live homepage curriculum card for S09 (title/tagline alignment)
- Gold peers: `s01-setup.ts` (narrative depth), `s08-pandas.ts` (adjacent ETL/cuarentena)
- Gold-standard checklist: `course-state/curriculum_hardening/GOLD_STANDARD_CHECKLIST.md`
- Prior S09 dossiers (auto ranks ~9.55 treated as **non-authoritative** boilerplate)
- External pedagogy / domain: gradual release (I/W/Y), CS50P Week 3 Exceptions, Real Python logging path, PEP 3134, Python docs (errors, logging, traceback, pdb), OWASP Logging Cheat Sheet (PII / sensitive data)

---

## 2. Executive Summary of Quality

### Score: **7.3 / 10**

### Verdict
S09 is a **structurally complete, domain-relevant intermediate section** that correctly retargets the familiarity pipeline toward production hygiene: specific exceptions, chaining, traceback literacy, structured logs, PII masks, fail-fast vs quarantine, and transient retries. The I Do / We Do / You Do skeleton (8 / 24 / portfolio), learning outcomes, and ethical constraints (synthetic data, no fraud/parentesco claims) are strong and better aligned with junior data-engineering practice in Perú than a pure CS50-style “try/except” lecture.

However, the section **does not meet the gold bar (≥9.5)** for learner-facing polish:

1. **Developer / curriculum meta-leaks** are user-visible (V3 retematization, platform id `visualization`, “legado Netflix EDA”, “incremento V3”).
2. **Critical demo fidelity bug:** theory `structured_log.py` code and declared `output` describe different programs.
3. **Theory is dense but thin** vs S01: short paragraphs, weak narrative connective tissue from S08, map block is meta about curriculum migration rather than learner motivation.
4. **We Do quality variance:** many E1s are label-mapping tables; several instructions fall under the ~150-char gold bar; shared boilerplate `tests` strings weaken grading contracts.
5. **You Do is near-complete solution theater** — starter already implements masks, classify, process_batch, and redacted logging.
6. **Pedagogical gaps vs best practice:** `with`/context managers and `else` are claimed but barely demonstrated; no `logging.exception` / `exc_info`; T3-B-E3 jumps to bytecode (`__code__.co_consts`); resources omit OWASP Logging Cheat Sheet despite PII focus.

**Bottom line:** Fix meta-leaks + code/output mismatch first, then deepen theory connective tissue and harden exercise/youDo independence. Content *direction* is excellent; *redaction and fidelity* are not gold yet.

---

## 3. Detailed Issue Registry

Severity scale: **P0** blocks trust/learning · **P1** serious pedagogy/redaction · **P2** polish · **P3** nice-to-have

### ISSUE-01 · P0 · Meta-leak in jobRelevance (platform id / retematize)
- **Location:** `jobRelevance` (lines ~14–15)
- **Evidence:**  
  > “Esta sección (id de plataforma `visualization` conservado) retematiza S09 a **excepciones, debugging y logging seguro**… matplotlib/seaborn se difieren…”
- **Impact:** Learners see internal CMS/history notes. Breaks voice, confuses section purpose, looks like unreviewed AI/editor residue.
- **Pedagogy:** Extraneous cognitive load; undermines professional tone.

### ISSUE-02 · P0 · Meta-leak in theory map (V3 / not matplotlib / platform id)
- **Location:** Theory heading “De “Data Visualization” a excepciones…” + paragraphs 1–3
- **Evidence quotes:**  
  - “En V3, **S09 no es el path principal de matplotlib/seaborn/plotly**.”  
  - “Id de plataforma `visualization` se conserva; V3 es excepciones/logs, no charts.”
- **Impact:** Opening block teaches **curriculum migration**, not exceptions. Compare S01 map, which opens with a learner dictionary and workplace stakes.
- **Pedagogy:** Violates progressive disclosure of *domain* concepts; wastes the highest-attention moments of the section.

### ISSUE-03 · P0 · Code/output mismatch — `structured_log.py` (S09-T3-A theory)
- **Location:** Theory subtopic “Niveles y estructura de logging”, `code.title: structured_log.py`
- **Evidence — code logs:**
  ```python
  log.info("job_start")
  log.warning("fila sin email opcional")
  log.error("no se pudo parsear monto")
  ```
- **Evidence — declared output:**
  ```text
  INFO stage=normalize record_id=C001 event=start
  INFO stage=normalize record_id=C001 event=done duration_ms=7
  ```
- **Impact:** Output belongs to iDo `pipeline_logger.py`, not this theory demo. Learner trust in “run and compare” is broken exactly when structured fields are introduced.
- **Pedagogy:** High intrinsic load + broken extrinsic cue → misconception that logging “magically” produces key=value fields not present in code.

### ISSUE-04 · P1 · Meta-leak in youDo context / requirements / rubric
- **Location:** `youDo.context`, `youDo.requirements`, `youDo.rubric`
- **Evidence:**  
  - “Reemplaza el legado de visualización Netflix EDA.”  
  - “Sin matplotlib/seaborn en este incremento V3”  
  - Rubric criterion: “Alineación al gate V3 de la sección”
- **Impact:** Portfolio brief talks to curriculum authors, not trainees building a GitHub artifact.
- **Pedagogy:** youDo should state *deliverable evidence*, not migration history.

### ISSUE-05 · P1 · weDo intro meta (“Sin matplotlib”)
- **Location:** `weDo.intro`
- **Evidence:** “Sin matplotlib. Datos sintéticos; sin PII real.”
- **Impact:** Negative instruction about an untaught library is unnecessary for learners who never saw matplotlib in this path.
- **Pedagogy:** Prefer positive constraints (“solo stdlib + logging”).

### ISSUE-06 · P1 · Theory depth below gold narrative bar
- **Location:** All 8 subtopic theory blocks
- **Evidence:** Typically exactly 3 short paragraphs (~120–220 chars each). Gold checklist wants avg ≥~250 chars and Anchor → Mechanism → Worked case → Edge with Peru/synthetic *story*, not only bullet contracts.
- **Impact:** Mechanically correct but dry; weaker retention than S01–S03 gold peers.
- **Pedagogy:** Cognitive load is “jargon dense / narrative light” — experts read it fine; intermediates lose *why*.

### ISSUE-07 · P1 · Connective tissue S08 → S09 is thin
- **Location:** Map paragraphs; jobRelevance
- **Evidence:** Mentions “Integra el ETL de S08” once; does not walk a concrete handoff (e.g. “tu manifest de S08 ahora necesita error_class + correlation_id en cada fila en cuarentena”).
- **Impact:** Section feels like a topic island rather than the next operational gate after ETL.
- **Pedagogy:** Graph edge S08→S09 under-specified for progressive curriculum.

### ISSUE-08 · P1 · Claimed APIs not demonstrated (`else`, `with`)
- **Location:** S09-T1-B theory paragraphs
- **Evidence:** Prose teaches `try/except/else/finally` and `with` context managers; demos use manual `StringIO` + `finally: handle.close()` and never show `else` or `with`.
- **Impact:** Dual coding: learner reads one contract, practices another.
- **Pedagogy:** Example–rule mismatch increases germane load for the wrong reason.

### ISSUE-09 · P1 · Missing industry logging pattern `logging.exception` / `exc_info`
- **Location:** T3 theory + demos + selfCheck
- **Evidence:** Levels, Formatter, structured message fields taught; no `log.exception(...)` or `exc_info=True` while catching.
- **Impact:** Gaps vs Real Python / ops practice and vs OWASP “enough context for forensics” without dumping raw rows.
- **Pedagogy:** Incomplete mechanism for ERROR-path diagnosis (T2 traceback + T3 logging not fully joined).

### ISSUE-10 · P1 · Exercise S09-T4-A-E1 count mismatch (7 vs 8)
- **Location:** weDo `S09-T4-A-E1`
- **Evidence:** Instruction: “Clasifica **8** fallos…”; starter `fallos` list has **7** strings; solution `clase` dict has **8** (adds `variable de entorno ROOT_PATH vacía`).
- **Impact:** Honest learners cannot pass “8 items from starter”; solution invents a case.
- **Pedagogy:** Broken I/O contract; E1 should be the safest rung of the scaffold.

### ISSUE-11 · P1 · Many exercise instructions under gold length / weak `tests` oracles
- **Location:** Majority of E1/E3 `instruction` + shared `tests` string
- **Evidence:** e.g. “Mapea 5 fallos sintéticos al tipo de excepción más adecuado e imprime `fallo -> Tipo`.” (~90 chars). `tests` often identical boilerplate: “Contrato ejecutable: corre exactamente los casos visibles del starter…”
- **Impact:** Graders and learners lack exact pass strings; uneven transfer demands.
- **Pedagogy:** Guided exercises need explicit expected lines; transfer needs novel constraints, not just “compare con la solución”.

### ISSUE-12 · P1 · You Do starter is essentially the solution
- **Location:** `youDo.starterCode`
- **Evidence:** Full `mask_email`, `mask_phone`, `classify_error`, `process_batch` with redacted `log.error`, demo `__main__` already present.
- **Impact:** Portfolio work collapses to README writing / tiny tweaks → “print theater / complete solution” anti-pattern from gold checklist.
- **Pedagogy:** You Do should require synthesis (e.g. missing fail-fast config path, address redaction, README policy, reconcile counts, tests) not copy-run.

### ISSUE-13 · P1 · Progressive disclosure stretch — `S09-T3-B-E3` bytecode audit
- **Location:** weDo transfer `S09-T3-B-E3`
- **Evidence:** Solution uses `unsafe_log.__code__.co_consts` to “statically audit” without executing.
- **Impact:** Introduces code-object introspection never taught in S01–S09; fragile and mystifying for Intermedio.
- **Pedagogy:** Transfer should recombine taught ideas (regex/string scan of a *template string*, or AST-free substring checks on a constant message pattern), not CPython internals.

### ISSUE-14 · P2 · Theory `minimal_repro.py` uses `except Exception` while theory forbids it
- **Location:** S09-T2-B theory code
- **Evidence:** Loop `except Exception as e:` after paragraphs condemning broad catches.
- **Impact:** Hidden double standard; learners copy the demo pattern.
- **Pedagogy:** Model the rule you preach (`except ValueError`).

### ISSUE-15 · P2 · `# DEFECT:` comments in all starters are author meta
- **Location:** Every weDo starter (`# DEFECT: todo ValueError`, etc.)
- **Evidence:** Pattern `CASO-LIM-009 · …` + `# DEFECT: …`
- **Impact:** For guided E1, can be intentional scaffolding; still reads as developer annotation. Over-reveals the bug for E2/E3 independence.
- **Pedagogy:** Prefer learner-facing defect description in `instruction` / `hint`, not raw author tags (or limit DEFECT tags to E1 only).

### ISSUE-16 · P2 · Self-check coverage gaps
- **Location:** `selfCheck` (6 MCQs — count OK)
- **Evidence:** Strong on `raise from`, fail-fast config, mask_email, retry taxonomy, minimal repro, CLI stdout. Missing: bare `except`, `finally` guarantees, correlation_id purpose, CRITICAL vs ERROR, structured fields.
- **Impact:** Active recall incomplete relative to T1–T4 breadth.
- **Pedagogy:** Add 2–3 items to cover T1-B and T3-B gates.

### ISSUE-17 · P2 · Resources omit OWASP Logging Cheat Sheet
- **Location:** `resources.docs` / `courses`
- **Evidence:** Excellent Python docs + PEP 3134 + Real Python + CS50P + MIT; no OWASP despite PII/compliance framing and prior research dossier listing it.
- **Impact:** Missed authoritative external anchor for “never log full PII”.
- **Pedagogy:** Competitive bar (OWASP C9 / Logging Cheat Sheet) not linked for learners.

### ISSUE-18 · P2 · Filename / export mismatch debt (maintainer + residual confusion)
- **Location:** Repo path `s09-visualization.ts`, id `visualization`, title exceptions
- **Evidence:** SECTION_MAP and UI title correct; file name still says visualization; parallel dead file `s08-visualization.ts` exists in tree.
- **Impact:** Not always learner-visible, but fuels meta-leaks in prose and confuses Fixer/agents.
- **Pedagogy:** Indirect — encourages leaky “id conservado” sentences.

### ISSUE-19 · P2 · Grammar / redaction micro-issues (ES-PE)
- **Location:** Various
- **Evidence samples:**  
  - Heading with nested quotes awkward: `De “Data Visualization” a excepciones…`  
  - “triage del on-call” OK industry mix; “basura” for bad data is informal but PE-acceptable.  
  - “fail closed” / “thundering herd” without micro-gloss may overload.  
  - youDo: “Datos sintéticos only” mixes EN “only”.
- **Impact:** Minor tone inconsistency vs polished S01 Spanish.
- **Pedagogy:** Low; fix with redaction pass.

### ISSUE-20 · P2 · iDo `S09-T2-A-DEMO` output shows empty code lines
- **Location:** `keyerror_frames.py` declared output
- **Evidence:** `frame=<module> line=12 ->` with empty `fr.line` rendering
- **Impact:** Looks broken; teaches frame names but weak on “line content”.
- **Pedagogy:** Prefer `traceback.format_exception` filtered lines with visible source text (as theory demo does better).

### ISSUE-21 · P3 · Books resources lack URLs
- **Location:** `resources.books`
- **Evidence:** Fluent Python / Cookbook entries have `note` only.
- **Impact:** Minor discoverability.
- **Pedagogy:** Optional links or ISBN.

### ISSUE-22 · P3 · Prior automated audit points at wrong file
- **Location:** `course-state/curriculum_hardening/audits/S09_AUDIT.json`
- **Evidence:** `"file": "s09-sklearn.ts"` while SECTION_MAP maps S09 → `s09-visualization.ts`
- **Impact:** Historical false ACCEPT signal; not learner-facing but poisons process memory.
- **Pedagogy:** Process risk only — Fixer should ignore auto 9.52 mean rank.

---

## 4. Meta-Leak Report

Exact leaked / internal text that should **not** appear as learner-facing curriculum prose:

| # | Exact / near-exact text | Location |
|---|-------------------------|----------|
| M1 | `id de plataforma \`visualization\` conservado` / `retematiza S09` | `jobRelevance` |
| M2 | `En V3, **S09 no es el path principal de matplotlib/seaborn/plotly**` | Theory map P1 |
| M3 | `Ese material se reubica al tramo de reporting/visualización` | Theory map P1 |
| M4 | `Id de plataforma \`visualization\` se conserva; V3 es excepciones/logs, no charts.` | Theory map P3 |
| M5 | Heading `De “Data Visualization” a excepciones, debugging y logging (mapa)` | Theory[0].heading |
| M6 | `Reemplaza el legado de visualización Netflix EDA.` | `youDo.context` |
| M7 | `Sin matplotlib/seaborn en este incremento V3` | `youDo.requirements` |
| M8 | `Alineación al gate V3 de la sección` | `youDo.rubric[0]` |
| M9 | `Sin matplotlib.` (weDo intro) | `weDo.intro` |
| M10 | Repeated `# DEFECT: …` author tags in starterCode (borderline meta) | all weDo starters |
| M11 | `CASO-LIM-009 ·` author lab tags (acceptable if product convention; still editor-facing tone) | starters |

**Meta-leak count (strict user-facing leaks M1–M9):** **9**  
**Including DEFECT/CASO author tags (M10–M11):** **11** categories

**Pattern note:** S08 shows the same “En V3 / id de plataforma se conserva” pattern — systemic mid-curriculum leak, but **must still be fixed in S09** for gold.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do fidelity
| Phase | Design intent | S09 reality | Score |
|-------|---------------|-------------|-------|
| I Do | Full worked model + why | 8 demos, one per subtopic, with `why` strings; generally compute (not pure print theater) | **8.5/10** |
| We Do | Guided → independent → transfer | 24 exercises present; E1 often classification tables; E2 better (parse_monto, retry_call); E3 uneven (bytecode stretch, abort policy text) | **7.0/10** |
| You Do | Independent portfolio synthesis | Brief excellent ethically; starter over-complete; rubric has V3 meta | **6.0/10** |
| Self-check | Active recall ≥5 non-trivial | 6 solid MCQs; coverage holes on finally/bare-except/correlation_id | **7.5/10** |

Gradual release is **structurally** correct but **responsibility shift** is incomplete because youDo does not remove scaffolding.

### 5.2 Cognitive load & progressive disclosure
**Strengths**
- Clear T1→T4 sequencing: types → boundaries → diagnosis → logs → resilience.
- Synthetic Peru-flavored fixtures (`ejemplo.pe`, `+51`, `C00x`, montos `Decimal`) reduce irrelevant load.
- PII redaction as a first-class skill is excellent load management for “security without fear-mongering”.

**Weaknesses**
- Map block spends working memory on **curriculum history**.
- Multiple near-duplicate demos of chain/quarantine (theory + iDo + weDo) without escalating novelty enough.
- T3-B-E3 bytecode and T2-B-E2 “hypotheses” (good idea) sit at opposite quality poles — inconsistent transfer design.
- Logging structured fields introduced with a **wrong output** (extraneous load + error).

### 5.3 Connective tissue & narrative flow
- **Within section:** Subtopics are thematically ordered; callouts (No swallow, PII en logs, Idempotencia) are actionable.
- **Across curriculum:** S08 cuarentena/manifest → S09 error taxonomy/logging is the right story, but the prose rarely *narrates* a single continuous job (ingest → validate → log → quarantine → retry). Prefer a recurring “CASO-LIM-009 intake job” story spine in every theory block (S01-style continuity).
- **To S10:** Forward reference “handlers en entrypoint CLI (S10)” is OK as soft preview; keep it one clause.

### 5.4 Exercise & exam alignment
| Outcome (LO) | Exercised? |
|--------------|------------|
| Specific exceptions / raise / from | T1-A E1–E3, iDo, quiz | Strong |
| try/except/finally boundaries | T1-B E1–E3 | Medium (else/with weak) |
| Tracebacks / useful frame | T2-A | Strong |
| Minimal repro / hypothesis / regression | T2-B | Strong–mixed |
| Logging levels / structured fields | T3-A | Medium (output bug) |
| correlation_id + PII masks | T3-B | Strong (E3 overreach) |
| fail-fast vs quarantine taxonomy | T4-A | Strong (E1 count bug) |
| retries + idempotency | T4-B | Strong |

### 5.5 Comparison vs external best-in-class
| Source | What they do well | S09 vs them |
|--------|-------------------|-------------|
| **CS50P Week 3** | Interactive exceptions, raise, problem sets | S09 is **more ops-realistic** (pipeline, PII, quarantine); less playful / interactive debugger practice |
| **Real Python logging path** | Handlers, config, hierarchy | S09 covers module logger + levels; weaker on config dict/file and `exception()` |
| **PEP 3134 / Python tutorial** | Chaining semantics | S09 teaches `from e` well with demos | 
| **OWASP Logging Cheat Sheet** | Do-not-log sensitive data, enough context | S09 **implements** masks (strength); should **cite** OWASP in resources |
| **Gold S01** | Dictionary, long narrative, Peru workplace | S09 prose is telegraph style — needs S01-level connective tissue without losing density |

### 5.6 Domain / ethics / accessibility
- Excellent: no real PII; fraud/parentesco claims forbidden; Decimal for money continuity from earlier sections.
- Danger callout on full-row ERROR logs is gold-quality.
- Accessibility: text-first demos good (no chart dependence — ironic given id). Ensure code outputs remain plain text for screen readers (already true).

### 5.7 Redaction quality (Peruvian Spanish)
- Generally clear, professional-technical ES with acceptable English industry tokens (pipeline, retry, backoff, on-call).
- Needs pass for: meta-English (“only”, “V3”, “Netflix EDA”), nested English section titles in map heading, and lightly glossing “thundering herd” / “fail closed”.

---

## 6. Proposed GitHub-style Diffs

> Diffs are **proposals only** — not applied. Paths relative to repo root.

### Diff A — Strip meta from `jobRelevance` (ISSUE-01)

```diff
--- a/src/lib/course/sections/s09-visualization.ts
+++ b/src/lib/course/sections/s09-visualization.ts
@@
-  jobRelevance:
-    "En pipelines de familiaridad y data engineering junior en Perú, un crash opaco o un log con email completo te cuesta incidentes y cumplimiento. Esta sección (id de plataforma `visualization` conservado) retematiza S09 a **excepciones, debugging y logging seguro**: inicio de **CP-N1-C**. matplotlib/seaborn se difieren al tramo de visualización de datos.",
+  jobRelevance:
+    "En pipelines de familiaridad y data engineering junior en Perú, un crash opaco o un log con email completo te cuesta incidentes y cumplimiento. Aquí aprendes **excepciones específicas**, **diagnóstico con tracebacks**, **logging estructurado sin PII** y políticas de **fail-fast vs cuarentena**: es el inicio operativo de **CP-N1-C** sobre el ETL de S08.",
```

### Diff B — Rewrite theory map for learners (ISSUE-02, ISSUE-07)

```diff
--- a/src/lib/course/sections/s09-visualization.ts
+++ b/src/lib/course/sections/s09-visualization.ts
@@
-      heading: "De “Data Visualization” a excepciones, debugging y logging (mapa)",
+      heading: "Mapa: excepciones, diagnóstico, logs y resiliencia",
       paragraphs: [
-        "En V3, **S09 no es el path principal de matplotlib/seaborn/plotly**. Ese material se reubica al tramo de reporting/visualización. Aquí arranca **CP-N1-C**: el pipeline de familiaridad necesita **excepciones específicas**, **diagnóstico** y **logging sin PII** — sin claims de fraude ni parentesco.",
-        "El hilo conductor es un **pipeline de intake sintético** (clientes `C00x`, emails `ejemplo.pe`): validar filas, capturar fallos, **redactar PII** en logs y decidir **fail-fast vs cuarentena**. Entorno **local-python**. Integra el ETL de S08 y los normalizadores de S05–S07.",
-        "Orden: **T1 Excepciones** → **T2 Diagnóstico** → **T3 Logging** → **T4 Resiliencia**. Id de plataforma `visualization` se conserva; V3 es excepciones/logs, no charts.",
+        "En S08 dejaste un ETL con **cuarentena** y **manifest**. En producción eso no basta si el job muere con un traceback opaco o si el log de ERROR incluye el email completo del cliente. Esta sección arranca **CP-N1-C**: convertir fallos en **señales operables** — tipo de error, correlación y privacidad — sin claims de fraude ni parentesco.",
+        "Hilo conductor: un **pipeline de intake sintético** (clientes `C00x`, emails `ejemplo.pe`, montos con `Decimal`). Validar filas, encadenar causas, **redactar PII** en logs y decidir **fail-fast** (config) vs **cuarentena** (data). Entorno **local-python**. Reutiliza normalizadores de S05–S07 y los conteos reconciliados de S08.",
+        "Orden de aprendizaje: **T1 Excepciones** → **T2 Diagnóstico** → **T3 Logging** → **T4 Resiliencia**. Al final tendrás el vocabulario de bitácora que S10 empaquetará en CLI.",
       ],
```

### Diff C — Fix `structured_log.py` fidelity (ISSUE-03) — preferred: align code to structured output

```diff
--- a/src/lib/course/sections/s09-visualization.ts
+++ b/src/lib/course/sections/s09-visualization.ts
@@
-    log.info("job_start")
-    log.warning("fila sin email opcional")
-    log.error("no se pudo parsear monto")
-    return buf.getvalue()
-
-print(demo_logger())`,
-        output: `INFO stage=normalize record_id=C001 event=start
-INFO stage=normalize record_id=C001 event=done duration_ms=7`,
+    log.info("stage=normalize record_id=C001 event=start")
+    log.info("stage=normalize record_id=C001 event=done duration_ms=7")
+    log.warning("stage=normalize record_id=C002 event=missing_optional field=email")
+    log.error("stage=normalize record_id=C003 event=parse_fail field=monto")
+    return buf.getvalue()
+
+print(demo_logger())`,
+        output: `INFO stage=normalize record_id=C001 event=start
+INFO stage=normalize record_id=C001 event=done duration_ms=7
+WARNING stage=normalize record_id=C002 event=missing_optional field=email
+ERROR stage=normalize record_id=C003 event=parse_fail field=monto`,
```

### Diff D — youDo meta + incomplete starter (ISSUE-04, ISSUE-12)

```diff
--- a/src/lib/course/sections/s09-visualization.ts
+++ b/src/lib/course/sections/s09-visualization.ts
@@
-    context:
-      "Inicias **CP-N1-C**: una bitácora de pipeline que clasifica fallos (data|config|provider), emite logs estructurados con correlation_id y **nunca** registra PII completa. Datos sintéticos; sin claims de fraude. Reemplaza el legado de visualización Netflix EDA.",
+    context:
+      "Inicias **CP-N1-C**: una bitácora de pipeline que clasifica fallos (data|config|provider), emite logs estructurados con correlation_id y **nunca** registra PII completa. Usa solo datos sintéticos; sin claims de fraude ni parentesco.",
@@
-      "Sin matplotlib/seaborn en este incremento V3",
+      "Solo stdlib (logging, decimal si aplica); sin librerías de gráficos",
@@
-      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
+      { criterion: "Bitácora auditable: taxonomía + correlation_id + redaction verificable", weight: "25%" },
```

Also replace `youDo.starterCode` with a **scaffold** that has intentional gaps, e.g.:

```python
# TODO del estudiante:
# 1) mask_address
# 2) fail-fast si config["required_fields"] falta
# 3) errors_by_class + assert in == ok + quarantined
# 4) tests en test_audit_log.py (mínimo 3)
# Starter proves masks for email/phone only; process_batch incomplete.
```

### Diff E — weDo intro (ISSUE-05)

```diff
-    intro: "Andamiaje: **E1 guiado → E2 independiente → E3 transferencia** × 8 subtemas (24 ejercicios, 2 hints c/u). Ejecuta y compara. Sin matplotlib. Datos sintéticos; sin PII real.",
+    intro: "Andamiaje: **E1 guiado → E2 independiente → E3 transferencia** × 8 subtemas (24 ejercicios, 2 hints c/u). Ejecuta y compara con la solución. Solo stdlib; datos sintéticos; sin PII real.",
```

### Diff F — T4-A-E1 align 8 cases (ISSUE-10)

```diff
 fallos = [
     "monto NaN en CSV",
     "YAML de config corrupto",
     "timeout S3",
     "email vacío en fila",
     "required_fields no definido",
     "HTTP 503 del proveedor",
     "dni con letras",
+    "variable de entorno ROOT_PATH vacía",
 ]
```

### Diff G — Demonstrate `with` + avoid bare Exception in theory (ISSUE-08, ISSUE-14)

```diff
# boundaries.py — prefer:
with StringIO(text) as handle:
    return [ln.strip() for ln in handle if ln.strip()]

# minimal_repro.py loop:
-    except Exception as e:
+    except ValueError as e:
```

Add a short second snippet or extend `lote_finally` iDo to include:

```python
try:
    ...
except ConfigError:
    raise
else:
    print("lote legible")
finally:
    ...
```

### Diff H — Soften / replace T3-B-E3 bytecode (ISSUE-13)

```diff
# Instead of __code__.co_consts:
template_unsafe = "error en {email} tel={phone}"
detected = "{email}" in template_unsafe and "{phone}" in template_unsafe
print("detected_unsafe", detected)
print("SAFE", safe_log(row))
```

Or: scan a list of forbidden field names against an f-string *template constant* taught in the instruction.

### Diff I — Add `logging.exception` micro-demo (ISSUE-09)

```python
try:
    parse_monto("N/A")
except ValueError:
    log.exception(
        "correlation_id=%s stage=validate error_class=data email=%s",
        corr, mask_email(raw_email),
    )
```

### Diff J — Resources + selfCheck (ISSUE-16, ISSUE-17)

```diff
 docs: [
+  {
+    label: "OWASP Logging Cheat Sheet",
+    url: "https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html",
+    note: "Qué no loguear (PII, secretos) y contexto mínimo útil",
+  },
 ]
```

Add MCQs for: bare `except` harm; `finally` runs on success and failure; purpose of `correlation_id`.

### Diff K — Expand one theory subtopic to S01 narrative depth (ISSUE-06) — sketch for T3-B

Add a fourth paragraph example:

```text
Caso sintético CASO-LIM-009: el job `ingest_clientes` falla a las 02:10. Sin correlation_id, el on-call no une el WARNING de la fila C014 con el ERROR del provider. Con `corr-9c2e` y email `l***@ejemplo.pe`, el postmortem tarda minutos, no horas — y no filtra PII a Slack.
```

---

## 7. Recommended Priority Order for Fixing

| Priority | Issue IDs | Action | Effort |
|----------|-----------|--------|--------|
| **1** | ISSUE-03 | Fix `structured_log.py` code/output mismatch | XS |
| **2** | ISSUE-01, 02, 04, 05 | Purge all V3/platform-id/matplotlib/Netflix meta-leaks | S |
| **3** | ISSUE-10 | Align T4-A-E1 starter to 8 cases | XS |
| **4** | ISSUE-12 | Hollow out youDo starter; rewrite rubric criterion | M |
| **5** | ISSUE-13 | Replace bytecode E3 with taught-level static check | S |
| **6** | ISSUE-08, 14 | Demo `with`/`else`; narrow `except` in theory code | S |
| **7** | ISSUE-09, 16, 17 | `logging.exception` + quiz items + OWASP resource | S |
| **8** | ISSUE-06, 07, 11 | Narrative deepen + S08 bridge + exercise instruction/tests contracts | M–L |
| **9** | ISSUE-15, 19, 20, 21 | DEFECT tag policy, ES-PE polish, iDo frame output, book URLs | S |
| **10** | ISSUE-18, 22 | Process/filename debt (optional rename plan; fix stale AUDIT pointer) | S (process) |

**Suggested Fixer acceptance criteria**
- [ ] Zero learner-facing mentions of platform id `visualization`, “V3 retematiza”, “Netflix EDA”, “incremento V3”
- [ ] Every theory/iDo `code`/`output` pair is executable-consistent
- [ ] youDo starter fails at least 2 required behaviors until student implements them
- [ ] T4-A-E1 starter length matches instruction
- [ ] No `__code__` / bytecode APIs in weDo
- [ ] Resources include OWASP Logging Cheat Sheet
- [ ] Expert re-read vs S01 narrative bar for map + at least 2 subtopics

---

## 8. Graph Memory Update Notes

For shared context (`GRAPH_MEMORY.json` / summary / residual ledger):

```yaml
S09:
  platform_id: visualization
  file: src/lib/course/sections/s09-visualization.ts
  learner_topic: exceptions_debugging_secure_logging
  not_topic: matplotlib_seaborn_plotly  # deferred ~S19
  capstone: CP-N1-C_start
  edges:
    requires: [S05_normalizers, S06_collections, S07_text, S08_etl_quarantine_manifest]
    enables: [S10_cli_logging_entrypoint, S13_cp_n1_c_close]
  quality:
    explorer_score: 7.3
    auto_audit_s09_json: DO_NOT_TRUST  # points to s09-sklearn.ts
    paragraph_analysis_9_55: DO_NOT_TRUST  # uniform boilerplate ranks
  defects_open:
    - meta_leaks_v3_platform_id
    - structured_log_code_output_mismatch
    - youdo_starter_overcomplete
    - e1_taxonomy_7_vs_8
    - e3_bytecode_progressive_disclosure
    - theory_shallow_vs_s01
  strengths:
    - domain_ops_realism_pii_redaction
    - raise_from_chaining_demos
    - fail_fast_vs_quarantine_taxonomy
    - structural_8_8_24_complete
  systemic_note: >
    Same V3/platform-id meta pattern observed in S08 jobRelevance/map;
    consider curriculum-wide redaction sweep for "id de plataforma" / "En V3".
  explorer_status: complete
  next_agent: Fixer (apply diffs; do not broaden beyond S09 unless doing systemic meta sweep)
```

**Nodes to register**
- `S09.theory.structured_log` → edge `broken_oracle` → `S09.ido.pipeline_logger` (output copy-paste source)
- `S09.meta.platform_id_visualization` → edge `leaks_into` → `jobRelevance`, `theory[0]`, `youDo`
- `S09.youDo.starter` → edge `too_complete_for` → `independent_mastery`

---

## Competitive research anchors used

- Gradual release / scaffolding & cognitive load (I Do → We Do → You Do)
- CS50P Week 3 Exceptions (https://cs50.harvard.edu/python/weeks/3/)
- Real Python — Exception handling, logging & debugging learning path
- PEP 3134 Exception Chaining; Python docs errors / logging / traceback / pdb
- OWASP Logging Cheat Sheet — do not log sensitive PII; mask/pseudonymize
- Internal gold bar: S01 narrative depth + GOLD_STANDARD_CHECKLIST.md

---

This is the complete Explorer report for Section 9. Ready for the Fixer prompt.
