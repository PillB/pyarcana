# S41 Explorer Report — APIs con FastAPI y contratos HTTP

**Auditor role:** Curriculum Auditor · Pedagogical Analyst · Technical Editor  
**Method:** Stanford STORM multi-pass + Graph Engineering + Loop Engineering  
**Date:** 2026-07-24  
**Scope rule:** Analysis only — no curriculum edits applied.

---

## 1. Section Identification & Scope

| Field | Value |
|-------|--------|
| **Section index** | 41 |
| **Platform id (hash)** | `llm-finetuning` *(legacy; V3 topic is HTTP/FastAPI)* |
| **Live title (UI)** | APIs FastAPI / *APIs con FastAPI y contratos HTTP* |
| **Live URL** | https://pillb.github.io/pyarcana/#llm-finetuning |
| **Repo source** | `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s41-llm-finetuning.ts` |
| **Export symbol** | `section41` |
| **Level / phase / hours** | Master · phase 3 · 20h |
| **Gate** | CP-N4-A · API HTTP gobernada |
| **Case id** | `CASO-ARE-041` (oficina ficticia en Arequipa) |
| **Upstream** | S40 Arquitectura/DDD (fronteras → endpoints) |
| **Downstream** | S42 Schemas, seguridad y privacidad de servicios |
| **Structural counts** | Theory map + 8 subtopics (T1–T4 × A/B) · 8 iDo · 24 weDo · youDo · 5 selfCheck · resources |

**In-scope artifacts reviewed**

1. Live curriculum card and section metadata on https://pillb.github.io/pyarcana/ (S41 titled **APIs FastAPI**, tagline matches source).
2. Full TypeScript section module `s41-llm-finetuning.ts` (theory, iDo, weDo, youDo, selfCheck, resources).
3. Gold bar: `course-state/curriculum_hardening/GOLD_STANDARD_CHECKLIST.md` (S01 peers).
4. Prior automated signals (not trusted as ground truth): `S41_AUDIT.json` ACCEPT/9.52; residual ledger score 10; `S41_PARAGRAPHS.md` / `S41_STORM.json` (template analysis claims).
5. External pedagogy & domain anchors: Gradual Release of Responsibility (I/We/You Do); Cognitive Load Theory; FastAPI tutorial; Stripe Idempotency-Key; RFC 9110 / 9457; OpenAPI; OWASP API Top 10.

**Out of scope:** Applying fixes; editing product TS; auditing S40/S42 beyond connective-tissue checks.

**Topic identity note (critical for Fixer):** The **learner-facing topic is correct for V3** (FastAPI + HTTP contracts). The **module filename and hash id remain `llm-finetuning`**, and that mismatch is repeatedly explained *to the learner* — which is meta-leak, not curriculum content.

---

## 2. Executive Summary of Quality

### Score: **5.0 / 10**

### Verdict

**Structurally green, pedagogically undercooked “contract theater.”**  
S41 has the full Master skeleton (glossary map, 8 subtopics, 8 demos, 24 defect labs, portfolio youDo, MCQ, excellent resource list) and a coherent product story: *versioned jobs API, Idempotency-Key, no PII in errors, read compatibility → CP-N4-A*. That scaffolding is real work.

However, against the **expert gold bar** (not residual counters), the section fails the spirit of teaching FastAPI/HTTP:

- Theory paragraphs 2–3 of nearly every subtopic are **byte-class template clones** (“Contrato operativo…” / “Aplicación de … CASO-ARE-041 … nunca prueba fraude…”).
- Demos and theory code are largely **print-theater or predicate shells** with almost **zero FastAPI, Pydantic, TestClient, or OpenAPI artifacts** despite the title and resources.
- weDo is a **24× isomorphic boolean-repair factory** (invert one predicate; same E1→E2→E3 shape) that trains fail-closed labeling more than API design skill.
- youDo is a **boolean readiness checklist**, not a service implementation.
- Developer/legacy vocabulary (`Id legacy llm-finetuning`, `V3`, `llm_finetuning_topic: False`) **leaks into learner-facing prose and demo code**.

Prior automated rank **9.55–10 “gold” is rejected** for this section under the project’s own rule: *structural green alone is not gold when theory/demos are template soup or print-theater* (`GOLD_STANDARD_CHECKLIST.md`).

| Dimension | Score (1–10) | One-line |
|-----------|-------------:|----------|
| Meta-text / leakage | 3 | Legacy id & V3 path explained to learners; demo flag `llm_finetuning_topic` |
| Grammar & ES-PE redaction | 6 | Mostly correct Spanish; telegraphic outcomes; lowercase headings; small typos |
| Connective tissue / narrative | 5 | S40→S41 link exists; weak mechanism story vs S01 |
| I/We/You Do fidelity | 4 | Labels present; gradual release of *skill* is shallow |
| Cognitive load / progressive disclosure | 4 | High extrinsic template noise; low germane API skill |
| Exercises / exam alignment | 5 | Defects are clear but monomorphic; MCQ process-heavy |
| Roadmap consistency | 7 | V3 title, gate CP-N4-A, S42 handoff OK; id/filename legacy |
| External best-in-class gap | 3 | Far from FastAPI official tutorial / Stripe-depth practice |
| **Overall** | **5.0** | Fixer-ready: rewrite theory mechanisms + real contract demos |

---

## 3. Detailed Issue Registry

Severity: **P0** blocker for learner trust / correctness · **P1** major pedagogy · **P2** quality · **P3** polish.

### P0 / P1 — Critical & major

#### ISS-01 · P0 — Meta-leak: legacy id / V3 path in learner-facing prose  
**Location:** `jobRelevance` (L15); theory map paragraph 4 (L33).  
**Evidence:**
> “Id legacy `llm-finetuning` se conserva; el path V3 es HTTP/API, no fine-tuning de LLMs.”  
> “Id legacy `llm-finetuning` no implica fine-tuning; V3 es API gobernada del control plane.”

**Impact:** Breaks fourth wall; introduces internal roadmap jargon (`V3`, `legacy`) that confuses learners and signals unfinished retargeting.  
**Pedagogy:** Extraneous cognitive load unrelated to HTTP skills.

#### ISS-02 · P0 — Meta-leak / print theater in map demo code  
**Location:** `s41_map_contract.py` (L36–53).  
**Evidence:** Field `"llm_finetuning_topic": False` printed to the learner as section contract output.  
**Impact:** Demo is about curriculum genealogy, not the API gate. Same pattern as S40’s `agent_orchestration_topic: False`.

#### ISS-03 · P1 — Template-soup theory (anti-gold pattern #2)  
**Location:** Subtopics S41-T1-A through S41-T4-B (except partial depth on T1-B).  
**Evidence (repeated shell):**
> “Contrato operativo. Entrada: solicitudes HTTP versionadas con identidad sintética e idempotency key. Salida de este subtema: [slot]. Error: payload inválido, timeout, duplicado conflictivo o límite excedido produce un error tipado y observable. Criterio de éxito: crear el mismo job con la misma clave no duplica efectos y consultar conserva compatibilidad.”

And:
> “Aplicación de `[topic]` al caso peruano sintético `CASO-ARE-041`: un servicio local de jobs sintéticos para una oficina ficticia en Arequipa. La evidencia esperada es [slot]. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.”

**Impact:** Paragraphs look long (avg ~283 chars) but **do not teach mechanisms**. Ethics/ER tail (“fraude, parentesco”) is **off-topic paste** for an HTTP API section.  
**Pedagogy:** Violates Anchor→Mechanism→Worked example→Edge; increases *extrinsic* load while starving *germane* load (CLT).

#### ISS-04 · P1 — Concept paragraphs are slogans, not instruction  
**Location:** First paragraph of T1-B, T2-A, T2-B, T3-A, T3-B, T4-A, T4-B.  
**Evidence examples:**
> “La idempotencia liga una clave al hash de la solicitud y al resultado; cursor estable y versión explícita evitan duplicados y paginación cambiante.”  
> “FastAPI separa routing, dependencias y modelos: el handler coordina, la dependencia provee capacidades y el dominio conserva reglas.”  
> “Pydantic valida entrada antes del dominio…”

**Impact:** Mentions FastAPI/Pydantic/async without showing *how* (no path operation, no `Depends`, no model, no lifespan). Learner cannot reconstruct practice from theory.  
**Compare:** FastAPI official “First Steps” teaches import → app → decorator → function → `/docs` in one worked path.

#### ISS-05 · P1 — Print-theater / non-computational demos (anti-gold #3)  
**Locations (representative):**

| Artifact | Problem |
|----------|---------|
| T1-B theory code | `print("idempotency_key", "Idempo-Key")` — literal + typo; pagination computed but idempotency not |
| T2-A | Returns hardcoded dep names; no DI simulation of swap/fail |
| T2-B | `print("openapi", True)` / `print("serialize", "json")` |
| T3-A iDo | `print("async", True)` after enqueue — does not show event-loop boundary |
| T3-B iDo | `print("limit", 100)` unrelated to budget logic |
| T4-B iDo | `print("rate", "token_bucket")` without modeling 429 |

**Impact:** iDo fails “I Do” (model *thinking* and derivation). Gradual release collapses into “watch prints, then flip booleans.”

#### ISS-06 · P1 — Title promises FastAPI; progressive disclosure never shows FastAPI  
**Location:** Title, resources, theory claims vs all `code` blocks.  
**Evidence:** Every runnable block is pure stdlib dicts/functions. Resources correctly cite FastAPI, TestClient, Pydantic, OpenAPI — but **no bridge snippet** (even optional / “forma profesional”) appears.  
**Impact:** Master-level learners finishing S41 may still never open `FastAPI()` or TestClient. Progressive disclosure is valid *as constraint*, but then the section must either (a) teach stdlib *isomorphism* with crystal-clear mapping tables to FastAPI APIs, or (b) introduce minimal FastAPI after the contract idea. Currently it does neither deeply.

#### ISS-07 · P1 — weDo monomorphism (24× same defect genre)  
**Location:** All `weDo.steps` S41-T*-E1/E2/E3.  
**Pattern:**
1. E1: invert a boolean on one fixture → print `S41-T* PASS`
2. E2: same predicate in `assess` with MISSING branch
3. E3: same predicate with CONTINUE / breach / uncertainty tokens

**Impact:** Excellent for fail-closed discipline; **poor transfer to HTTP design**. After one subtopic the learner has learned the *exercise format*, not new API concepts. E3 is not true transfer (same fields, same three fixtures).

#### ISS-08 · P1 — youDo is checklist theater, not a portfolio service  
**Location:** `youDo.starterCode` (L1665–1681).  
**Evidence:** `evidence = { ...: False }` → flip flags to `READY`.  
**Impact:** Requirements list real deliverables (OpenAPI, create/status, tests) but starter trains “set booleans true.” Portfolio note admits BLOCKED-by-design, yet provides no scaffold of routes, schemas, or tests. Fails You Do as *independent performance of the skill*.

### P2 — Quality & consistency

#### ISS-09 · P2 — Case id inconsistency `CASO-LIM-041` vs `CASO-ARE-041`  
**Location:** Comments in every starterCode (`# CASO-LIM-041 · …`) while fixtures and prose use `CASO-ARE-041-*`.  
**Impact:** Confuses case lineage (Lima vs Arequipa); looks like bulk-generator residue (see `git_restore_decision_s41_s42.md` mentioning CASO-LIM-041 labeling).

#### ISS-10 · P2 — Typo / truncated header name `Idempo-Key`  
**Location:** T1-B theory code output/print (L111–115).  
**Evidence:** `print("idempotency_key", "Idempo-Key")`  
**Impact:** Learns wrong header name vs industry `Idempotency-Key` (Stripe docs) and section glossary.

#### ISS-11 · P2 — Status code pedagogy gap: 400 vs 422  
**Location:** T1-A theory lists 400 for validation; T2-B exercises treat invalid input as **422**.  
**Impact:** FastAPI/Pydantic commonly use 422 Unprocessable Entity; never explained. Learners cannot justify either choice.

#### ISS-12 · P2 — Learning outcomes telegraphic vs S01 gold  
**Location:** `learningOutcomes` (L17–25).  
**Evidence:** “Diseña recursos HTTP y status”, “Verifica compat, rate limit y obs”.  
**Impact:** Not measurable SMART outcomes; abbreviations (“obs”, “compat”) hurt ES-PE accessibility. S01 expands terms in-line.

#### ISS-13 · P2 — Self-check weakly aligned to HTTP mechanisms  
**Location:** `selfCheck` Q1–Q4 heavily process/meta; only Q5 is solid idempotency.  
**Evidence:** Q2 uses `REJECT_REQUEST` while weDo uses topic-specific tokens (`RETURN_CORRECT_HTTP_STATUS`, `THIN_THE_HANDLER`, …).  
**Impact:** Assessment does not verify routing/DI, OpenAPI fidelity, timeout cascade, or 429 semantics taught (nominally) in theory titles.

#### ISS-14 · P2 — iDo `why` strings are template clones  
**Location:** All 8 demos’ `why` fields.  
**Pattern:** “Hace observable `[topic]` con un caso local pequeño y deja como evidencia [slot]; el demo modela el contrato, no un servicio externo.”  
**Impact:** No think-aloud of *why this line*, violating GRR “I Do = model thinking.”

#### ISS-15 · P2 — Icon / filename legacy residue  
**Location:** `icon: "Cpu"`; file `s41-llm-finetuning.ts`.  
**Impact:** Cpu suggests ML/compute, not HTTP APIs. Filename confuses maintainers and search. (Id retention may be intentional for deep links; icon is free to fix.)

#### ISS-16 · P2 — Gate success criterion copy-pasted into every subtopic contract  
**Location:** Nearly all “Contrato operativo” paragraphs.  
**Impact:** T3-A (async boundaries) success criterion is still “same job + key no duplicate / read compat” instead of a **local** measurable criterion for event-loop safety. Dilutes progressive gates.

#### ISS-17 · P2 — Misleading edgeCases wording  
**Location:** e.g. T1-A edgeCases: `"fixture adverso: método, recurso y 201 coherentes"`.  
**Impact:** Adverse fixture is the *incoherent* case; wording reads as if adverse *is* coherent. Generator artifact.

#### ISS-18 · P2 — youDo context grammar glitch  
**Location:** `youDo.context` (L1648).  
**Evidence:** “El gate se bloquea ante: payload inválido, timeout… produce un error…” (colon + finite verb mismatch).  
**Impact:** Minor redaction defect in high-visibility portfolio blurb.

### P3 — Polish

#### ISS-19 · P3 — Headings start lowercase  
**Evidence:** `"recursos, métodos y status"`, `"idempotencia, paginación y versionado"`, …  
**Impact:** Inconsistent with S01 title case / Spanish heading norms; looks machine-generated.

#### ISS-20 · P3 — jobRelevance dense run-on  
**Impact:** One long paragraph packs workplace claim + gate + meta-legacy disclaimer. Split for scannability.

#### ISS-21 · P3 — Residual/STORM false gold risk  
**Location:** `residual_ledger.json` score 10; `S41_PARAGRAPHS.md` every para 9.55 with identical analysis boilerplate.  
**Impact:** For Fixer/Graph Memory: **do not treat prior gold claims as closed**. This Explorer report supersedes automated ranks for pedagogy.

#### ISS-22 · P3 — Missing worked OpenAPI/error example  
**Impact:** Resources cite RFC 9457 Problem Details, but no theory example of `{ "type", "title", "status", "trace_id" }` without PII.

#### ISS-23 · P3 — Pagination taught only as list slice  
**Location:** T1-B `page([...])`.  
**Impact:** No stable cursor vs offset discussion in depth (prose mentions cursor; code only shows int offset). Industry interviews expect cursor/keyset trade-offs.

---

## 4. Meta-Leak Report

| # | Exact leaked / internal text | Location | Learner-visible? | Recommended handling |
|---|------------------------------|----------|------------------|----------------------|
| M1 | `Id legacy \`llm-finetuning\` se conserva; el path V3 es HTTP/API, no fine-tuning de LLMs.` | `jobRelevance` | Yes | Remove; keep silent id stability in repo only |
| M2 | `Id legacy \`llm-finetuning\` no implica fine-tuning; V3 es API gobernada del control plane.` | Theory map P4 | Yes | Replace with learner roadmap: “S41 construye la API del control plane sobre las fronteras de S40” |
| M3 | `"llm_finetuning_topic": False` + printed | Map code + output | Yes | Replace with gate flags only (`idempotent_create`, `no_pii_in_errors`, `read_compat`) |
| M4 | Filename `s41-llm-finetuning.ts` | Repo | Devs only | Optional rename later; **do not** explain to learners |
| M5 | `# CASO-LIM-041` comments while case is ARE | All weDo starters | Yes (in code comments) | Align to `CASO-ARE-041` |
| M6 | Generator ethics tail “fraude, parentesco o intención” on pure HTTP topics | Theory P3 shells | Yes | Drop or rephrase to “no PII / no claim of fraud from job status” only where relevant |
| M7 | Internal action codes as pedagogy (`THIN_THE_HANDLER`, `MOVE_WORK_OFF_EVENT_LOOP`, …) | Theory callouts + weDo | Yes (by design) | Keep as **lab tokens** if intentional, but introduce them as “códigos de lab” once in map; avoid sounding like production error enums without OpenAPI mapping |

**Meta-leak count (strict user-facing internal process):** **3 primary** (M1–M3) + **2 secondary labeling** (M5–M6) → report **meta_leak_count: 5**.

No raw “TODO/FIXME/moved from section X / AI prompt” strings found beyond the legacy/V3 and generator shells above.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 Pre-round research synthesis (applied)

1. **Gradual Release (I/We/You Do):** Model → guided practice → independent performance. S41 labels the stages but **models labels**, not craft; weDo is guided *predicate repair*; youDo does not perform independent API building.  
2. **Cognitive Load Theory:** Template triplets and meta-legacy text raise **extraneous** load; thin mechanisms starve **germane** load.  
3. **HTTP/API teaching (FastAPI docs, RFC 9110, Stripe):** Best materials show one vertical slice: resource + method + status + validation + docs + test. S41 fragments titles correctly but never assembles a slice.  
4. **Idempotency myths:** Industry emphasis is *same side effect*, not identical body always, and key+body conflict — T1-B prose is directionally right; code under-teaches conflict path (only weDo invalid fixture encodes hash mismatch).

### 5.2 Graph Engineering snapshot (nodes)

```
S40 boundaries ──implements──► S41 HTTP resources /v1/jobs
       │                              │
       │                              ├─ Idempotency-Key store
       │                              ├─ OpenAPI public view
       │                              ├─ DI thin handler
       │                              ├─ async vs background
       │                              ├─ timeout cascade
       │                              ├─ test pyramid
       │                              └─ 429 + trace no PII
       ▼                              ▼
   CP-N4-A gate ◄──────────── evidence (currently mostly boolean tokens)
       │
       └──► S42 authz / schemas (downstream)
```

**Broken edges:** Theory title nodes → runnable FastAPI nodes (missing); iDo → weDo skill transfer (weak); weDo → youDo portfolio service (missing).

### 5.3 STORM passes performed

| Pass | Finding |
|------|---------|
| Surface scan | Full structure; correct V3 title on live site; legacy hash |
| Deep pedagogy | Template soup; monomorphic labs; checklist youDo |
| Redaction / ES-PE | Mostly clean; telegraphic LOs; lowercase heads; LIM/ARE mix |
| Meta-leak | Legacy id / V3 / llm_finetuning_topic |
| Comparative | Far below FastAPI tutorial + Stripe idempotency depth; below S01 narrative quality |
| Loop | Re-checked all 24 exercises for variance — none beyond field names/tokens |

### 5.4 I Do / We Do / You Do fidelity

| Stage | Present? | Quality |
|-------|----------|---------|
| **I Do** | 8 demos with ids | Low: compute thin; why-templates; no think-aloud of HTTP decisions |
| **We Do** | 24 with starter/solution | Medium structure / Low skill transfer: clear defects, same genre |
| **You Do** | Rubric + requirements | Low execution scaffold: boolean READY machine |
| **Self-check** | 5 MCQ | Medium: safety culture OK; technical depth thin |

### 5.5 Progressive disclosure assessment

- **Positive:** No forced cloud cluster; synthetic case; no real PII; stdlib runnable in browser/lab.  
- **Negative:** “FastAPI-style” is asserted, not mapped. A progressive path could be: (1) pure HTTP matrix in dicts → (2) pseudo-`Depends` injection → (3) optional FastAPI TestClient snippet in resources lab. Only (1) exists, and poorly.

### 5.6 Redaction (Peruvian Spanish)

- Tone generally professional and Peru-situated (Arequipa office — good).  
- Prefer **“observabilidad”** over “obs”; expand outcomes.  
- Capitalize headings.  
- Fix `Idempo-Key`, youDo context sentence, CASO labels.  
- Remove developer genealogy from jobRelevance.

### 5.7 Comparison with gold / external

| Reference | S41 vs reference |
|-----------|------------------|
| **S01 setup (gold peer)** | S01 defines terms, shows commands, explains failure modes; S41 defines dictionary then starves mechanism |
| **FastAPI tutorial** | Real path operations + auto OpenAPI; S41 never shows `@app.post` |
| **Stripe idempotency** | Key storage, conflict on body mismatch, TTL; S41 iDo shows store dict well, theory code print fails |
| **RFC 9457** | Cited; not exemplified |
| **Prior residual “10 gold”** | **Rejected** for pedagogy |

### 5.8 What is already strong (preserve)

1. Product narrative: versioned jobs API + evidence + CP-N4-A gates.  
2. Dictionary block on map (resource, status, Idempotency-Key, OpenAPI, DI, compat, no PII).  
3. T1-B iDo `idempotent_create` is a **good** mini-model (created/replay/len==1).  
4. T2-B public_view redaction idea is correct.  
5. weDo always separates valid / adverse / missing — fail-closed culture.  
6. Resources list is **best-in-class** for the course (FastAPI, RFCs, Stripe, OWASP, Pydantic, pytest).  
7. Live UI title matches V3 topic (not “LLM fine-tuning”).

---

## 6. Proposed GitHub-style Diffs

> Diffs are **proposals only** — not applied. Paths relative to repo root.  
> Fixer should prefer full paragraph rewrites over micro-patches for ISS-03/04/07/08.

### Diff group A — Meta-leak removal (ISS-01, ISS-02, M1–M3)

```diff
--- a/src/lib/course/sections/s41-llm-finetuning.ts
+++ b/src/lib/course/sections/s41-llm-finetuning.ts
@@ jobRelevance
-  jobRelevance:
-    "En equipos de plataforma y producto, **APIs con FastAPI y contratos HTTP** convierten las fronteras de S40 en endpoints versionados con evidencia operativa. La práctica entrega respuestas OpenAPI sin PII (status, evidencia, errores tipados) y se promueve solo cuando crear el mismo job con la misma clave no duplica side effects y consultar conserva compatibilidad. Id legacy `llm-finetuning` se conserva; el path V3 es HTTP/API, no fine-tuning de LLMs.",
+  jobRelevance:
+    "En equipos de plataforma y producto, **APIs con FastAPI y contratos HTTP** convierten las fronteras de S40 en endpoints versionados con evidencia operativa. La práctica entrega respuestas OpenAPI sin PII (status, evidencia, errores tipados) y se promueve solo cuando crear el mismo job con la misma Idempotency-Key no duplica side effects y consultar conserva compatibilidad de lectura para clientes v1.",

@@ theory map paragraph (orden)
-        "Orden: T1 recursos/status e idempotencia → T2 routing/deps y validación → T3 sync/async y errores → T4 tests, rate limit y observabilidad. Teoría con criterio medible, iDo que calcula el contrato, weDo E1/E2/E3 con un defecto HTTP por ejercicio. Id legacy `llm-finetuning` no implica fine-tuning; V3 es API gobernada del control plane. Stack didáctico: **stdlib** (dicts, funciones) modelando contratos FastAPI sin cluster.",
+        "Orden: T1 recursos/status e idempotencia → T2 routing/deps y validación → T3 sync/async y errores → T4 tests, rate limit y observabilidad. Cada tema deja un artefacto medible (matriz HTTP, replay, handler delgado, vista pública, boundary async, timeout cascade, pirámide de tests, 429+trace). Stack didáctico: **stdlib** primero (dicts y funciones) para modelar el contrato; los recursos enlazan el equivalente en FastAPI/OpenAPI sin exigir un cluster.",

@@ s41_map_contract.py
-        "llm_finetuning_topic": False,
-        "duplicate_side_effect_ok": False,
+        "duplicate_side_effect_ok": False,
+        "pii_in_errors_ok": False,
...
-print("llm_finetuning_topic", c["llm_finetuning_topic"])
-print("duplicate_side_effect_ok", c["duplicate_side_effect_ok"])
+print("gates", c["gates"])
+print("duplicate_side_effect_ok", c["duplicate_side_effect_ok"])
```

### Diff group B — Fix T1-B typo + real idempotency print (ISS-05, ISS-10)

```diff
--- a/src/lib/course/sections/s41-llm-finetuning.ts
+++ b/src/lib/course/sections/s41-llm-finetuning.ts
@@ idempotency_pagination_versioning.py
 def page(items, cursor, size=2):
     chunk = items[cursor:cursor + size]
     nxt = cursor + size if cursor + size < len(items) else None
     return {"data": chunk, "next": nxt}

+def replay_label(store, key, body):
+    if key in store:
+        return "replay" if store[key] == body else "conflict"
+    store[key] = body
+    return "created"
+
+store = {}
+print(replay_label(store, "idem-are-1", {"name": "job"}))
+print(replay_label(store, "idem-are-1", {"name": "job"}))
 print(page([0, 1, 2, 3], 0, 2))
-print("idempotency_key", "Idempo-Key")
-print("version", "v1")
+print("header", "Idempotency-Key")
+print("version", "v1")
```

### Diff group C — Theory mechanism rewrite template (ISS-03, ISS-04, ISS-16)

*Illustrative rewrite for S41-T2-A only; Fixer should repeat pattern for all subtopics.*

```diff
--- a/src/lib/course/sections/s41-llm-finetuning.ts
+++ b/src/lib/course/sections/s41-llm-finetuning.ts
@@ S41-T2-A paragraphs
-        "FastAPI separa routing, dependencias y modelos: el handler coordina, la dependencia provee capacidades y el dominio conserva reglas.",
-        "Contrato operativo. Entrada: solicitudes HTTP versionadas con identidad sintética e idempotency key. Salida de este subtema: handler delgado con dependencia sustituible. Error: payload inválido, timeout, duplicado conflictivo o límite excedido produce un error tipado y observable. Criterio de éxito: crear el mismo job con la misma clave no duplica efectos y consultar conserva compatibilidad.",
-        "Aplicación de `routing, dependencies y modelos` al caso peruano sintético `CASO-ARE-041`: un servicio local de jobs sintéticos para una oficina ficticia en Arequipa. La evidencia esperada es handler delgado con dependencia sustituible. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
+        "En FastAPI (y en nuestro modelo stdlib) el **path operation** solo orquesta: parsea el request, llama dependencias y devuelve una vista. La **dependency** (`Depends` en FastAPI) inyecta capacidades sustituibles — p. ej. un `JobStore` en memoria en lab y un adaptador SQL en prod — sin que el dominio importe HTTP. El **modelo** (`JobCreate`) declara el contrato de entrada; el dominio recibe tipos ya validados, no `Request` crudo.",
+        "Contrato local de S41-T2-A. Entrada: función handler + fábrica `get_store` inyectable. Salida: handler ≤ ~5 líneas de orquestación, dominio invocado, `domain_imports_http == False`. Error de diseño: handler con I/O, SQL y reglas mezclados, o dominio que importa status codes. Criterio local: al sustituir `get_store` por un fake, el mismo handler crea el job sintético sin reescribir la ruta.",
+        "Caso `CASO-ARE-041-2A` (oficina ficticia en Arequipa): `POST /v1/jobs` usa `get_db`/`get_store` inyectado; el dominio `create_job(store, body)` no conoce FastAPI. Evidencia: test que monta el handler con un store fake y aserta un solo side effect. Sin PII ni secretos en el body de ejemplo.",
```

### Diff group D — Replace print-theater T2-B theory code (ISS-05)

```diff
 def public_view(body: dict, allow: set) -> dict:
     return {k: v for k, v in body.items() if k in allow}

+def reject_if_invalid(body: dict) -> tuple[int, dict]:
+    required = {"name", "priority"}
+    if not required <= body.keys():
+        return 422, {"error": "validation_error", "fields": sorted(required - body.keys())}
+    return 200, public_view(body, {"name", "priority"})
+
 raw = {"name": "er-run", "priority": "normal", "internal_key": "x"}
-print(public_view(raw, {"name", "priority"}))
-print("openapi", True)
-print("serialize", "json")
+print(reject_if_invalid(raw))
+print(reject_if_invalid({"name": "er-run"}))  # missing priority → 422
+print("internal_key_leaked", "internal_key" in public_view(raw, {"name", "priority"}))
```

### Diff group E — Learning outcomes (ISS-12)

```diff
   learningOutcomes: [
-    { text: "Diseña recursos HTTP y status" },
-    { text: "Versiona, pagina e idempotiza" },
-    { text: "Estructura routing y dependencies" },
-    { text: "Valida, serializa y documenta" },
-    { text: "Separa sync/async y background" },
-    { text: "Maneja errores, timeouts y lifecycle" },
-    { text: "Prueba unit/contract/integration" },
-    { text: "Verifica compat, rate limit y obs" },
+    { text: "Diseñar recursos versionados (`/v1/jobs`) con métodos y status semánticos (201/200/4xx/5xx)" },
+    { text: "Implementar Idempotency-Key, paginación con cursor estable y compatibilidad de lectura" },
+    { text: "Separar routing, dependency injection y reglas de dominio en handlers delgados" },
+    { text: "Validar entrada, redactar respuestas y alinear el comportamiento con OpenAPI" },
+    { text: "Elegir boundary sync/async/background sin bloquear el event loop ni perder durabilidad" },
+    { text: "Presupuestar timeouts en cascada, errores tipados sin PII y lifecycle de recursos" },
+    { text: "Construir pirámide unit/contract/integration que detecte un fallo sembrado en el nivel correcto" },
+    { text: "Probar compatibilidad de consumidores, rate limit (429) y trazas sin PII" },
   ],
```

### Diff group F — Case comment alignment (ISS-09)

```diff
-# CASO-LIM-041 · HTTP method+status create
+# CASO-ARE-041 · HTTP method+status create
```
*(apply to all 24 starter comment headers)*

### Diff group G — youDo scaffold direction (ISS-08) — design intent, not full rewrite

```diff
--- a/src/lib/course/sections/s41-llm-finetuning.ts
+++ b/src/lib/course/sections/s41-llm-finetuning.ts
@@ youDo.starterCode (conceptual)
-# boolean checklist only
+# Minimal contract lab (stdlib stand-in for FastAPI):
+# - ROUTES: POST/GET /v1/jobs
+# - store + idempotency map
+# - public response view (no internal keys)
+# - tests: create, replay, invalid→typed error
+# readiness() remains, but True only when functions pass assertions below
```

Fixer should replace pure flag flips with functions the learner implements, leaving `readiness` as a secondary gate.

### Diff group H — Self-check technical depth (ISS-13)

Add/replace at least two items, e.g.:

```diff
+      {
+        question: "En un POST de creación, ¿qué status semántico corresponde a creación exitosa con cuerpo del nuevo job?",
+        options: ["200", "201", "204", "202 siempre, aunque el job sea síncrono"],
+        correctIndex: 1,
+        explanation: "201 Created comunica que se creó un recurso; 200 es lectura/OK genérico.",
+      },
+      {
+        question: "Si reenvías la misma Idempotency-Key con un body distinto al original, el servicio debe…",
+        options: [
+          "crear un segundo job en silencio",
+          "devolver conflicto / error de idempotencia sin segundo side effect",
+          "ignorar el body y siempre hacer replay",
+          "responder 200 vacío",
+        ],
+        correctIndex: 1,
+        explanation: "La clave liga un hash canónico del request; body distinto es conflicto, no replay.",
+      },
```

### Diff group I — Headings capitalization (ISS-19)

```diff
-      heading: "recursos, métodos y status",
+      heading: "Recursos, métodos y status",
```
*(repeat for all eight subtopic headings)*

### Diff group J — Icon (ISS-15)

```diff
-  icon: "Cpu",
+  icon: "Globe",  // or "Server" / "Network" — match design system available icons
```

---

## 7. Recommended Priority Order for Fixing

| Order | Issue IDs | Rationale |
|------:|-----------|-----------|
| 1 | ISS-01, ISS-02, M1–M3 | Remove meta-leak before any content polish |
| 2 | ISS-03, ISS-04, ISS-16 | Rewrite theory mechanisms; kill template triplets |
| 3 | ISS-05, ISS-10, ISS-14 | Make iDo/theory code compute real contracts |
| 4 | ISS-06 | Explicit FastAPI mapping table or minimal optional snippet |
| 5 | ISS-07 | Diversify ≥1 exercise genre per topic (e.g. implement `idempotent_create`, not only score it) |
| 6 | ISS-08 | youDo service scaffold + tests |
| 7 | ISS-09, ISS-17, ISS-18 | Case labels, edgeCases wording, youDo grammar |
| 8 | ISS-11, ISS-13, ISS-22, ISS-23 | 422 pedagogy, MCQ depth, Problem Details, cursor pagination |
| 9 | ISS-12, ISS-15, ISS-19, ISS-20 | Outcomes, icon, headings, jobRelevance density |
| 10 | ISS-21 | Update residual/graph memory so false “gold 10” does not block Fixer |

**Suggested Fixer acceptance bar (post-fix):**

- [ ] Zero learner-facing “legacy id / V3 / llm_finetuning_topic”  
- [ ] Each subtopic has unique mechanism paragraph (no shared Error/Criterio shell)  
- [ ] ≥6/8 demos compute non-trivial state transitions  
- [ ] youDo requires implementing create+replay+error path, not only booleans  
- [ ] ≥2 selfCheck items on status/idempotency/OpenAPI/redaction  
- [ ] Expert judgment ≥ 8.5 vs S01 bar (not residual counters)

---

## 8. Graph Memory Update Notes

For shared context / fleet memory files:

```yaml
section: 41
id: llm-finetuning
v3_title: APIs con FastAPI y contratos HTTP
file: src/lib/course/sections/s41-llm-finetuning.ts
explorer_score: 5.0
status: complete_explorer
false_gold_prior:
  - residual_ledger score 10 REJECTED
  - S41_AUDIT ACCEPT/9.52 REJECTED as pedagogy ground truth
  - S41_PARAGRAPHS uniform 9.55 boilerplate REJECTED
primary_failure_modes:
  - template_soup_theory
  - print_theater_demos
  - monomorphic_weDo_boolean_repair
  - checklist_youDo
  - meta_leak_legacy_id_v3
preserve:
  - CP-N4-A gate framing
  - CASO-ARE-041 Arequipa narrative
  - resource list (FastAPI, RFC9110, RFC9457, Stripe, OWASP, Pydantic)
  - T1-B iDo idempotent_create model
  - fail-closed E2/E3 shape (valid/adverse/missing)
edges:
  - S40_boundaries -> S41_http_contracts (present, thin)
  - S41_http_contracts -> S42_security_schemas (named in roadmap; not taught here)
  - theory_titles -X-> fastapi_runnable_examples (MISSING)
  - weDo_skills -X-> youDo_portfolio_service (MISSING)
fixer_entrypoints:
  - strip meta-leak first
  - rewrite 8 subtopic P1–P3 mechanisms
  - recompute demos
  - diversify exercises
  - rebuild youDo scaffold
meta_leak_count: 5
issue_count: 23
```

**Comparative fleet note:** S40 exhibits the same “Id legacy … V3” pattern (`agentic-architecture`). Fixer should consider a **shared Master-section redaction rule**: never surface legacy hash retargeting in learner prose.

---

## Appendix A — Structural inventory (for Fixer checklists)

| Component | Count | Notes |
|-----------|------:|-------|
| Theory headings | 9 | map + 8 subtopics |
| iDo demos | 8 | S41-T1-A…T4-B DEMO |
| weDo exercises | 24 | E1 guided / E2 independent / E3 transfer × 8 |
| youDo | 1 | checklist starter |
| selfCheck | 5 | residual_ledger incorrectly said 4 |
| Resources docs | 10 | strong |
| Books | 2 | DDIA, SRE |
| Courses | 5 | mixed relevance |

## Appendix B — Action token map (lab codes)

| Subtopic | Breach token | Uncertainty token |
|----------|--------------|-------------------|
| T1-A | `RETURN_CORRECT_HTTP_STATUS` | `REVIEW_RESOURCE_SEMANTICS` |
| T1-B | `RETURN_IDEMPOTENCY_CONFLICT` | `REPLAY_STORED_RESPONSE` |
| T2-A | `THIN_THE_HANDLER` | `REVIEW_DEPENDENCY_BOUNDARY` |
| T2-B | `REJECT_AND_REDACT` | `REGENERATE_OPENAPI` |
| T3-A | `MOVE_WORK_OFF_EVENT_LOOP` | `CHOOSE_BACKGROUND_BOUNDARY` |
| T3-B | `CANCEL_AND_CLOSE` | `RECALCULATE_TIMEOUT_BUDGET` |
| T4-A | `BLOCK_UNTESTED_CONTRACT` | `ADD_MISSING_TEST_LEVEL` |
| T4-B | `THROTTLE_AND_REDACT` | `INSPECT_COMPATIBILITY` |
| youDo/selfCheck | `REJECT_REQUEST` | `RETRY_OR_ESCALATE` |

*Note:* youDo/selfCheck tokens are **not** the same vocabulary as weDo — Fixer should unify or teach both maps.

---

This is the complete Explorer report for Section 41. Ready for the Fixer prompt.
