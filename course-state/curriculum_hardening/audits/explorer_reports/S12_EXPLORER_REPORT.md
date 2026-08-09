# S12 Explorer Report — APIs, SQL y geodatos responsables

**Auditor role:** Curriculum Auditor · Pedagogical Analyst · Technical Editor  
**Principles:** Stanford STORM · Graph Engineering · Loop Engineering · Harness Engineering  
**Focus:** Section 12 only (`performance`)  
**Live site:** https://pillb.github.io/pyarcana/  
**Live hash target:** `#performance`  
**Repo source:** `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s12-performance.ts`  
**Gold peers:** `s01-setup.ts`, `s02-basics.ts` (+ structural bar in `GOLD_STANDARD_CHECKLIST.md`)  
**Prior automated audit note:** `S12_AUDIT.json` verdict ACCEPT / high_issue_count 0 — **overruled by this expert pass** (code/output oracles, meta-leaks, and We Do instruction corruption were not caught by rank scripts).

---

## 1. Section Identification & Scope

| Field | Value |
|-------|--------|
| Index | 12 |
| Platform id (hash) | `performance` |
| Title | APIs, SQL y geodatos responsables |
| shortTitle | APIs · SQL · Geo |
| Level / phase | Intermedio / phase 0 |
| estimatedHours | 19 |
| Icon | `Gauge` (legacy performance metaphor) |
| Capstone thread | Incremento **CP-N1-C** (adquisición + geoevidencia) → cierra en S13 dashboard |
| Structure present | Theory map + 8 subtopics (T1–T4 × A/B); iDo × 8; weDo × 24 (E1/E2/E3); youDo + rubric; selfCheck × 5; resources |

**Topic map (learner path):**
1. **T1 HTTP** — status/JSON; timeout, pagination, retry/backoff, rate limit  
2. **T2 Auth/cache/contracts** — env secrets, GET cache, provenance; contract tests + offline fallback  
3. **T3 SQL** — schema/CRUD/joins; parameterized queries, transactions, constraints, indexes  
4. **T4 Geo** — address normalize + authorized mock geocoder; coord validation, Haversine as **signal only**

**Out of learner path (explicitly stated, but with meta leakage):** multiprocessing, profiling, production logging (deferred to S37–S38 / systems track).

**Scope of this run:** Analyze only S12. Do **not** apply fixes. Propose GitHub-style diffs. Ground analysis in pedagogy (gradual release / GRR, cognitive load), technical writing (ES-PE), redaction, and competitive domain practice (HTTP status semantics, OWASP parameterized SQL, geodata egress policy).

**Live site note:** The public SPA home at https://pillb.github.io/pyarcana/ renders the curriculum catalog (S12 listed as “APIs · SQL · Geo” with correct tagline). Deep content for theory/I Do/We Do is loaded from the same section module as the repo TS; this report treats `s12-performance.ts` as the authoritative learner-facing source for section body, consistent with the harness brief.

---

## 2. Executive Summary of Quality

### Score: **6.4 / 10**

### Verdict
S12 has a **strong architectural skeleton** for a hard intermediate section: three professional domains (HTTP adapters, SQLite integrity, responsible geodata) woven into one CP-N1-C acquisition story with excellent ethics rails (no PII to public geocoders; distance ≠ kinship/fraud; secrets out of logs). Structural coverage matches the gold checklist shape (8 theory subtopics, 8 demos, 24 exercises, portfolio, 5 MCQ).

However, learner-facing **redaction quality is well below S01/S02 gold**:
- **Developer meta-text** about V3 retargeting, platform id conservation, and “legacy performance content” is first-class UI copy.
- **We Do instructions** are systematically polluted by a truncated template (scope bans mid-sentence, incomplete endings, and in two places the *entire task* is overwritten by stack boilerplate).
- **Several theory/I Do `output` blocks do not match the printed code** (broken oracles / print-theater residue).
- Theory is **telegraphic** (3 short paragraphs, no section dictionary) compared with early gold sections that teach terms before use.
- Platform branding still says **`performance` + Gauge**, which collides with the published title and with S37 (actual profiling section).

**Ready for Fixer:** yes — high-leverage fixes are mostly copy/oracle hygiene plus stripping meta-leaks; domain pedagogy does not need a full rewrite.

---

## 3. Detailed Issue Registry

Severity: **P0** blocker for trust/learning · **P1** high pedagogical/redaction impact · **P2** medium polish · **P3** low / optional.

| # | Sev | Area | Location | Evidence (quote / fact) | Pedagogical impact |
|---|-----|------|----------|-------------------------|-------------------|
| I-01 | P0 | Meta-leak | Theory map heading + paras + callout | Heading: `De "Performance & concurrency" a APIs…`; P1: `En V3, **S12 no es el path principal…** Ese material se reubica…`; callout title `Contenido reubicado conceptualmente`; body `Material legado de performance/concurrency… **no es el camino V3 del estudiante**` | Students receive a **changelog for authors**, not a learning map. Extraneous load + trust hit (“is this unfinished?”). |
| I-02 | P0 | Meta-leak | `jobRelevance` | `Esta sección (id de plataforma \`performance\` conservado) retematiza a V3 **APIs + SQL + geodatos**…` | Same: platform plumbing visible to learners. |
| I-03 | P0 | Meta-leak / garbled We Do | `S12-T1-A-E2` instruction | `…devuelva solo requests conceptual + sqlite3 + math haversine (S01–S12).` | **Task destroyed**: learner cannot know what `parse_entity` should return. Gradual release broken at E2. |
| I-04 | P0 | Meta-leak / garbled We Do | `S12-T4-A-E3` instruction | `…\`allowed_for_public_geocoder(payload)\` True solo requests conceptual + sqlite3 + math haversine (S01–S12).` | Egress checklist — a **core ethics skill** — is unreadable. |
| I-05 | P0 | Oracle mismatch | Theory `S12-T3-B` `params_tx.py` | Code `print(try_batch_unique_doc())` → real `('rolled_back', 0)`; stored output `rollback_ok IntegrityError\nrows_after_rollback 0\ninjection_safe None` | Teaches students to distrust course outputs; undermines SQL integrity lesson. |
| I-06 | P0 | Oracle mismatch | Theory `S12-T3-A` `sqlite_join.py` | Code prints `seed_and_join()` list of tuples; output `join ('Ana Demo', 'geo')` | Same oracle failure on first SQL demo. |
| I-07 | P0 | Oracle mismatch | iDo `S12-T2-A-DEMO` | Code `print(sorted(manifest.items()))` with keys `source_url, fetched_at, status_code, body_sha12, token_present`; output is JSON with `auth_scheme`, `token_logged False` | Provenance demo (security-critical) shows **false evidence**. |
| I-08 | P0 | Oracle mismatch | iDo `S12-T3-A-DEMO` | `case_join()` returns `('Ana', 120.5, 'geo')`; output `case_rows [('C001', 'T1', 'geo')]` | Wrong join story (ids vs name/amount/kind). |
| I-09 | P0 | Oracle mismatch | iDo `S12-T3-B-DEMO` | Returns `("atomic_rollback", 0)`; output `atomic_rollback True\ncount 0` | Atomicity message garbled. |
| I-10 | P1 | Meta-leak pattern | Many We Do `instruction`s | Boilerplate: `Concepto: S12-Tx-y (APIs, SQL y geodatos responsables). Entrada: fixture sintético… Conserva el contrato del starter… no RPA, no dashboard de S13…` often **truncated** (`no dashboard de.`, `no.`, `no borres asserts ni.`) | High extraneous load; Spanish incomplete sentences; reads as codegen residue. |
| I-11 | P1 | Connective tissue vs gold | Theory map vs S01/S02 | No **Diccionario de la sección**; opens with V3 negation rather than workplace story + term bank | Progressive disclosure weaker for mixed-level learners facing HTTP+SQL+geo in one week. |
| I-12 | P1 | Branding / roadmap consistency | `id`, `icon`, map heading | id=`performance`, icon=`Gauge`, map still names old performance track; real performance is **S37** | Navigation confusion on live catalog + mental model split. |
| I-13 | P1 | Cognitive load | Whole section | Three domains + ethics + CP-N1-C gates in 19h without a slow “dictionary → one thread demo” onboarding | Intrinsic load high; meta boilerplate adds **extraneous** load (Sweller). |
| I-14 | P1 | Pedagogy fidelity | iDo vs theory | Several iDo demos near-duplicate theory snippets rather than “think-aloud full pipeline step” | GRR “I Do” under-models expert reasoning; We Do then jumps to micro-defects. |
| I-15 | P1 | Exercise quality | `S12-T1-A-E3`, `S12-T2-B-E3` | Dict-fill theater: fix literals in `STATUS_ACTION` / `matrix` | Low transfer; active recall weak (anti-pattern in gold checklist #6). |
| I-16 | P1 | Conceptual inconsistency | Retry policy | Theory T1-B: retry on **transitorios (429, 503, timeouts)**; `STATUS_ACTION` maps **500→retry**; E `should_retry` only `{429,503}` | Learners get conflicting policies without a reconciliation note. |
| I-17 | P1 | Theory vs exercise contract | Address normalize | Theory T4-A uses `.title()`; E1 hint: `No uses title si no se pide; solo espacios.` | Split-brain contract between demonstration and graded task. |
| I-18 | P2 | Missing taught mechanism in code | T1-A theory | Mentions `json.JSONDecodeError` fail-closed; no demo handles invalid JSON | Claim without worked example. |
| I-19 | P2 | Timeout pedagogy | T1-B theory + E1 | Timeout taught as `cost_s` comparison; never shows `timeout=` on a real client API (even mock) | Transfer to production APIs weaker (Real Python / stdlib practice: always pass timeout). |
| I-20 | P2 | You Do vs rubric | `youDo.starterCode` | Stubs: token, retry, normalize, geocode, haversine; `build_db` empty; **no** provenance/cache/pagination integration | Rubric weights HTTP+SQL+geo 100%; starter under-scaffolds integration → abrupt release. |
| I-21 | P2 | selfCheck breadth | `selfCheck.questions` | Exactly 5 MCQs; no item on pagination, transactions, or Haversine formula tolerance | Meets minimum count; thin for 19h × 3 domains (active recall under-powered). |
| I-22 | P2 | Redaction / ES-PE | Callouts & terms | `Fail soft, trace hard`; heavy English compounds without first-use gloss (`provenance`, `egress`, `fail-closed`) | Gold bar: ES-PE primary with industry English **introduced**. |
| I-23 | P2 | Meta in resources | `resources.courses` last item | note: `curso desplegado; alinear con V3 S12.` | Internal editor instruction in learner resources. |
| I-24 | P2 | Dead import | Theory T1-B code | `import time` unused | Minor polish; signals incomplete edit. |
| I-25 | P3 | Truncated instructions | Multiple E1/E2/E3 | e.g. T2-A-E1 ends `no dashboard de.`; T3-B-E3 `no RPA, no.`; T4-B-E1 `no borres asserts ni.` | Grammar failure; same root as I-10. |
| I-26 | P3 | Comparative / competitive | vs external | Domain choices (mocks, OWASP SQL, MDN status, Haversine ethics) are competitive; packaging of prose is not | Content could rank high if redaction fixed. |
| I-27 | P3 | Accessibility | Code blocks | Dense single-file demos without “qué observar” bullets after some outputs | Mild; callouts partially compensate. |
| I-28 | P3 | Prior audit false green | `S12_AUDIT.json` | `high_issue_count: 0`, mean rank 9.52 | Harness risk: automated ranks miss oracle/meta failures → Explorer/Fixer must stay human-expert. |

**Issue count (registry rows):** 28  
**Meta-leak count (distinct learner-facing meta surfaces):** 6 primary (jobRelevance; map P1; map callout; resources V3 note; systematic We Do template; two fully garbled instructions) + N truncated variants of the same template.

---

## 4. Meta-Leak Report

Exact leaked / developer-facing text and locations in `s12-performance.ts`:

### 4.1 jobRelevance
> Esta sección (id de plataforma `performance` conservado) retematiza a V3 **APIs + SQL + geodatos** e incrementa **CP-N1-C** …

**Problem:** “id de plataforma conservado” + “retematiza a V3” = author ops.

### 4.2 Theory map — heading
> De “Performance & concurrency” a APIs, SQL y geodatos (mapa de la sección)

**Problem:** References retired curriculum name as the frame.

### 4.3 Theory map — paragraph 1
> En V3, **S12 no es el path principal de multiprocessing, profiling ni logging de producción**. Ese material se reubica al tramo de sistemas/ops.

### 4.4 Theory map — callout
- **title:** `Contenido reubicado conceptualmente`  
- **content:** `Material legado de performance/concurrency de este archivo **no es el camino V3 del estudiante en S12**. Target: adaptadores HTTP + SQL + geo para CP-N1-C. …`

### 4.5 We Do instruction template (systematic)
Recurring fragments (examples):
- `Concepto: S12-T1-A (APIs, SQL y geodatos responsables). Entrada: fixture sintético del starter (\`CASO\`/ids C00x) en APIs y geodatos.`
- `Conserva el contrato del starter (no borres asserts ni datos); no RPA, no dashboard de S13, no NumPy de S14; solo requests conceptual + sqlite3 + math haversine (S01–S12).`
- Truncations: `no dashboard de.`, `no RPA, no.`, `no borres asserts ni.`

### 4.6 Fully corrupted tasks
- **S12-T1-A-E2:** task replaced by stack string after “devuelva solo …”
- **S12-T4-A-E3:** same after “True solo …”
- **S12-T3-B-E2:** mid-sentence: `si todo el batch falla junto (usa un solo requests conceptual + sqlite3 + math haversine (S01–S12).` (unclosed paren + wrong insertion)

### 4.7 Resources
> note: `curso desplegado; alinear con V3 S12.`

### 4.8 Related branding (not prose leak but meta residue)
- `id: "performance"`, `icon: "Gauge"` while user title is APIs/SQL/Geo.

**Not meta-leaks (keep):** Legitimate domain vocabulary (provenance, CP-N1-C as capstone gate name if explained), synthetic case ids `CASO-LIM-012`, ethics rules about PII/kinship — these are product pedagogy, not author notes, **if** presented without “V3/legado/retematiza” framing.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 Pre-round research anchors (applied)

| Source practice | Implication for S12 |
|-----------------|---------------------|
| **GRR / I–We–You** (Fisher & Frey; Pearson & Gallagher) | Model full expert task → guided micro-skills → independent portfolio. S12 structure exists; I Do is thin and We Do copy is noisy. |
| **Cognitive load** (Sweller) | Three intrinsic domains need glossary + single narrative thread; meta/V3 text is pure extraneous load. |
| **HTTP teaching** (MDN status; RFC 7231; Real Python networking hygiene) | Status→action tables good; always-timeout and selective retry good; need one consistent policy table. |
| **SQL injection** (OWASP parameterized queries) | T3-B-E1 vulnerable→fixed is gold-standard pedagogy; oracle mismatch undercuts it. |
| **Geodata ethics** | Course differentiator vs generic HTTP/SQL courses: egress allowlist + signal≠kinship. Corrupted E3 on allowlist is high severity. |
| **Gold checklist** (repo) | Depth ≥3 paras with case; honest outputs; starter with one defect; no theater. S12 fails honest-output and instruction quality. |

### 5.2 Connective tissue & narrative flow

**Strengths:**
- Clear pipeline story: signals adapter → local SQLite case store → geo signal for S13.
- Explicit handoff to S13 (dashboard, relationship_signal_score) and back-reference to S11 domain types (`clients` / `evidence` / entity_id).
- Ethics spine is coherent across theory, demos, MCQ, and portfolio note.

**Weaknesses vs S01/S02 gold:**
- S01 opens with workplace Peru story + **Diccionario de la sección** before any command.
- S12 opens with **what this section is not (old performance)** — author-centric, not learner-centric.
- Transitions between T1→T2→T3→T4 are one sentence in the map (“Orden: T1 HTTP → …”) without micro-bridges (“ya tienes status; ahora el secreto y la traza…”).

### 5.3 I Do / We Do / You Do fidelity

| Layer | Fidelity | Notes |
|-------|----------|-------|
| **I Do** | Medium | 8 demos, each with `why` — good. But outputs wrong on 3 demos; several are copy-lite of theory rather than narrated construction. |
| **We Do** | Low–Medium | 24 exercises with DEFECT starters — structure excellent. Instructions often unreadable (I-03/I-04/I-10). Some E3s are dict edits (I-15). |
| **You Do** | Medium | Clear objectives/requirements/rubric/portfolioNote. Starter under-integrates relative to rubric (I-20). |
| **Self-check** | Medium | Fair MCQs, good explanations, ethics + SQL + secrets covered. Missing pagination/TX depth (I-21). |

### 5.4 Cognitive load & progressive disclosure

- **Intrinsic load:** High but justified for CP-N1-C integrator step before S13.
- **Extraneous load:** Meta V3 + template spam + oracle errors — **must cut**.
- **Germane load:** Haversine as signal-only, parameterized SQL, status→action are well-chosen germane challenges.
- **Progressive disclosure:** Mostly respects S01–S12 stack (mocks, sqlite3, math). Occasional forward-looking “dashboard S13” is OK as motivation if not framed as “do not do S13 here” in every exercise.

### 5.5 Exercise & exam alignment

| Subtopic | Alignment | Gap |
|----------|-----------|-----|
| T1-A status/JSON | E1/E3 good; E2 instruction broken | Fix E2 text |
| T1-B resilience | Timeout/paginate/retry solid | Align 500 vs 503 policy |
| T2-A secrets/cache/prov | Good micro-skills | iDo provenance oracle wrong |
| T2-B contracts/fallback | Good | E3 dict theater |
| T3-A CRUD/join | Good tasks | Theory/iDo outputs wrong |
| T3-B params/TX/index | OWASP-aligned E1 excellent | Theory output wrong; E2 instruction mid-corruption |
| T4-A normalize/geo/egress | Domain gold | E3 instruction destroyed; title() inconsistency |
| T4-B Haversine/signal | Excellent ethics | — |

### 5.6 Grammar & ES-PE redaction

- Base prose is competent professional Spanish with Peru/LatAm synthetic framing (Lima, Arequipa, Callao, soles context via domain).
- Failures are **truncation and template English fragments**, not accent issues.
- Prefer glossing: “**provenance** (procedencia/traza de origen)”, “**egress** (salida de datos hacia un proveedor externo)”, “**fail-closed** (si falta dato o contrato, se detiene; no inventa)”.

### 5.7 Comparison to best-in-class external materials

| External pattern | S12 status |
|------------------|------------|
| MDN / RFC mental model of status classes | Present and quiz-aligned |
| OWASP: never string-build SQL | Present; best exercise in section |
| Real Python: profile only after correctness | Correctly deferred (but explained via meta leak) |
| Production adapters: timeout always | Policy stated; API shape under-demoed |
| Privacy-preserving geocoding curricula | **Strong differentiator** when E3 readable |
| CS50P / MIT clarity of “one idea per demo” | Weaker — demos pack many ideas; theory denser than S01 |

### 5.8 Consistency with roadmap / S11 / S13

- Aligns with live catalog title and SECTION_MAP.tsv topic.
- Domain tables match S11 entity vocabulary.
- Correctly does **not** close CP-N1-C dashboard (S13).
- Platform id `performance` remains the main **cross-surface inconsistency** (hash, icon, legacy heading).

### 5.9 Graph nodes (Graph Engineering snapshot)

Key nodes and quality edges:

- `HTTP.status` —OK→ `adapter.action` (retry/use/fix)  
- `adapter.auth` —OK→ `env.secret` ; —BROKEN_ORACLE→ `iDo.provenance_output`  
- `SQL.placeholder` —OK→ `injection_safe` ; —BROKEN_ORACLE→ `theory.params_tx.output`  
- `geo.distance` —OK→ `relationship_signal` —FORBIDDEN→ `kinship/fraud`  
- `weDo.instruction_template` —LEAK→ `learner.extraneous_load`  
- `platform.id=performance` —CONFLICT→ `title=APIs/SQL/Geo` & `S37.profiling`

---

## 6. Proposed GitHub-style Diffs

> Apply later via Fixer only. Paths relative to repo root. Diffs are illustrative and may be grouped.

### Diff A — Strip map meta-leak; student-facing mapa (I-01, I-11, I-12 prose)

```diff
--- a/src/lib/course/sections/s12-performance.ts
+++ b/src/lib/course/sections/s12-performance.ts
@@
-      heading: "De “Performance & concurrency” a APIs, SQL y geodatos (mapa de la sección)",
+      heading: "Mapa de la sección: HTTP, SQL y geodatos responsables",
       paragraphs: [
-        "En V3, **S12 no es el path principal de multiprocessing, profiling ni logging de producción**. Ese material se reubica al tramo de sistemas/ops. Aquí construyes el **incremento CP-N1-C de adquisición y geoevidencia**: cliente HTTP síncrono resiliente, SQLite parametrizado y geocoder mock/autorizado **sin PII bancaria a servicios públicos**.",
-        "El hilo conductor es un **adaptador de señales sintéticas** (entidades, evidencias, coordenadas) con timeout, cache, provenance y fallback offline. Solo datos sintéticos latam (`example.com`, Lima/Arequipa, ids `C00x`). Si el schema del JSON o del SQL no cuadra, **falla cerrado** — no inventes filas. Stack: mocks/`urllib` conceptual + `sqlite3` + Haversine (`math`); sin RPA ni dashboard de S13.",
-        "Orden: **T1 HTTP** → **T2 Auth/cache/contracts** → **T3 SQL** → **T4 Geodatos responsables**. Métrica del gate: adaptador con status/retry selectivo + join local + geoseñal documentada. Nunca tokens en logs ni claims de parentesco/fraude."
+        "**Diccionario de la sección** (léelo antes de T1). **Status code:** código HTTP de la respuesta (2xx éxito, 4xx error de cliente, 5xx error de servidor). **Timeout:** tiempo máximo de espera por request. **Retry/backoff:** reintentar solo errores transitorios con espera creciente. **Provenance (traza de origen):** metadatos del fetch (`source_url`, `fetched_at`, `status_code`, `cache_hit`) **sin** secretos. **SQL parametrizado:** placeholders `?` en lugar de f-strings. **Geocoder autorizado/mock:** proveedor permitido o simulado; **egress:** qué campos pueden salir a un servicio externo. **Geoseñal:** distancia u otra métrica geo que alimenta un score de relación — **no** es parentesco ni fraude. **Fail-closed:** si el contrato falla, se detiene; no se inventan filas ni coordenadas.",
+        "El hilo conductor es un **adaptador de señales sintéticas** (entidades, evidencias, coordenadas) con timeout, cache, provenance y fallback offline. Construyes el incremento de **adquisición y geoevidencia del capstone CP-N1-C**: cliente HTTP síncrono resiliente, SQLite parametrizado y geocoder mock/autorizado **sin PII bancaria a servicios públicos**. Solo datos sintéticos latam (`example.com`, Lima/Arequipa, ids `C00x`). Si el schema del JSON o del SQL no cuadra, **falla cerrado**.",
+        "Orden: **T1 HTTP** → **T2 Auth/cache/contratos** → **T3 SQL** → **T4 Geodatos responsables**. Gate de la sección: adaptador con status/retry selectivo + join local de caso + geoseñal documentada. En S13 armarás el dashboard de evidencia; aquí no. Nunca tokens en logs ni claims de parentesco/fraude. (Profiling y concurrency de producción se tratan más adelante en el tramo de sistemas — no son el foco de esta semana.)"
       ],
       callout: {
-        type: "info",
-        title: "Contenido reubicado conceptualmente",
-        content:
-          "Material legado de performance/concurrency de este archivo **no es el camino V3 del estudiante en S12**. Target: adaptadores HTTP + SQL + geo para CP-N1-C. Conserva datos sintéticos; nunca PII real ni tokens en logs.",
+        type: "info",
+        title: "Qué entregas al final de S12",
+        content:
+          "Un adaptador HTTP + almacén SQLite + geocoder mock con provenance y política de egress. Datos sintéticos únicamente; nunca PII real ni tokens en logs.",
       },
```

### Diff B — jobRelevance without platform plumbing (I-02)

```diff
--- a/src/lib/course/sections/s12-performance.ts
+++ b/src/lib/course/sections/s12-performance.ts
@@
   jobRelevance:
-    "En onboarding, compliance y data quality en bancos, fintech y retail en Perú, necesitas **adaptadores HTTP resilientes**, **SQL parametrizado** y **geoevidencia controlada** sin filtrar PII bancaria a geocoders públicos. Esta sección (id de plataforma `performance` conservado) retematiza a V3 **APIs + SQL + geodatos** e incrementa **CP-N1-C** (adquisición + geoevidencia) con mocks locales y datos sintéticos.",
+    "En onboarding, compliance y data quality en bancos, fintech y retail en Perú, necesitas **adaptadores HTTP resilientes**, **SQL parametrizado** y **geoevidencia controlada** sin filtrar PII bancaria a geocoders públicos. Esta sección construye ese tramo del capstone **CP-N1-C** (adquisición + geoevidencia) con mocks locales y datos sintéticos: status y JSON, secretos fuera de código, SQLite con placeholders, y geocoding autorizado.",
```

### Diff C — Fix theory SQL outputs (I-05, I-06)

```diff
--- a/src/lib/course/sections/s12-performance.ts
+++ b/src/lib/course/sections/s12-performance.ts
@@
-        output: `join ('Ana Demo', 'geo')`,
+        output: `[('Ana Demo', 'geo')]`,
@@
-        output: `rollback_ok IntegrityError
-rows_after_rollback 0
-injection_safe None`,
+        output: `('rolled_back', 0)`,
```

### Diff D — Fix iDo oracles (I-07, I-08, I-09)

**Option D1 (preferred): make code produce the intended teaching output.**

```diff
--- a/src/lib/course/sections/s12-performance.ts
+++ b/src/lib/course/sections/s12-performance.ts
@@ S12-T2-A-DEMO
-def build_manifest(url, body, status=200):
-    return {
-        "source_url": url,
-        "fetched_at": "2026-07-20T15:00:00Z",
-        "status_code": status,
-        "body_sha12": hashlib.sha256(json.dumps(body, sort_keys=True).encode()).hexdigest()[:12],
-        "token_present": bool(os.environ.get("SIG_API_TOKEN")),
-    }
-
-os.environ["SIG_API_TOKEN"] = "syn-token-000"
-url = "https://api.example.com/v1/signals/C001"
-body = {"entity_id": "C001", "signals": ["geo"]}
-manifest = build_manifest(url, body)
-print(sorted(manifest.items()))`,
-          output: `{"auth_scheme": "bearer", "body_sha12": "5acbf63b7a4b", "fetched_at": "2026-07-20T15:00:00Z", "source_url": "https://api.example.com/v1/signals/C001", "status_code": 200, "token_present": true}
-token_logged False`,
+def build_manifest(url, body, status=200):
+    return {
+        "source_url": url,
+        "fetched_at": "2026-07-20T15:00:00Z",
+        "status_code": status,
+        "body_sha12": hashlib.sha256(json.dumps(body, sort_keys=True).encode()).hexdigest()[:12],
+        "token_present": bool(os.environ.get("SIG_API_TOKEN")),
+        "auth_scheme": "bearer",
+    }
+
+os.environ["SIG_API_TOKEN"] = "syn-token-000"
+url = "https://api.example.com/v1/signals/C001"
+body = {"entity_id": "C001", "signals": ["geo"]}
+manifest = build_manifest(url, body)
+# Nunca loguear el token: solo presencia booleana
+print(json.dumps(manifest, sort_keys=True))
+print("token_logged", False)`,
+          output: `{"auth_scheme": "bearer", "body_sha12": "5acbf63b7a4b", "fetched_at": "2026-07-20T15:00:00Z", "source_url": "https://api.example.com/v1/signals/C001", "status_code": 200, "token_present": true}
+token_logged False`,
@@ S12-T3-A-DEMO
-    return row
-
-print(case_join())`,
-          output: `case_rows [('C001', 'T1', 'geo')]`,
+    return row
+
+print("case_row", case_join())`,
+          output: `case_row ('Ana', 120.5, 'geo')`,
@@ S12-T3-B-DEMO
-print(atomic_batch([("C001", "DOC1"), ("C002", "DOC2"), ("C003", "DOC1")]))`,
-          output: `atomic_rollback True
-count 0`,
+status, n = atomic_batch([("C001", "DOC1"), ("C002", "DOC2"), ("C003", "DOC1")])
+print(status)
+print("count", n)`,
+          output: `atomic_rollback
+count 0`,
```

### Diff E — Repair critical We Do instructions (I-03, I-04, I-10 samples)

```diff
--- a/src/lib/course/sections/s12-performance.ts
+++ b/src/lib/course/sections/s12-performance.ts
@@ S12-T1-A-E2
-        instruction:
-          "E2 (independiente) — Dado un `payload` JSON-like dict de respuesta, implementa `parse_entity(payload)` que exija claves `id` y `region` y devuelva solo requests conceptual + sqlite3 + math haversine (S01–S12).",
+        instruction:
+          "E2 (independiente) — Dado un `payload` dict de respuesta, implementa `parse_entity(payload)` que exija las claves `id` y `region`. Si faltan o el tipo no es dict, devuelve `None`. Si están, devuelve un dict nuevo solo con esas dos claves (ignora extras). Caso: payload con extra → `{'id':'C001','region':'Lima'}`; payload incompleto → `None`.",
@@ S12-T4-A-E3
-        instruction:
-          "E3 (transferencia) — Checklist de egress: dado un payload dict, `allowed_for_public_geocoder(payload)` True solo requests conceptual + sqlite3 + math haversine (S01–S12).",
+        instruction:
+          "E3 (transferencia) — Checklist de egress: implementa `allowed_for_public_geocoder(payload)` que devuelve `True` solo si **todas** las claves del dict están en `ALLOWED = {\"address\", \"city\", \"country\"}`. `document_id` u otra PII debe dar `False`. Imprime ambos casos del starter.",
@@ S12-T3-B-E2
-        instruction:
-          "E2 (independiente) — Transacción: inserta C001 ok; segundo insert con mismo id debe rollback y dejar count=0 si todo el batch falla junto (usa un solo requests conceptual + sqlite3 + math haversine (S01–S12).",
+        instruction:
+          "E2 (independiente) — Transacción atómica: en un `BEGIN`, inserta `C001` y luego un segundo insert con el mismo id. Ante `IntegrityError`, haz `rollback` y deja `COUNT(*)==0`. Sin rollback, el primer insert quedaría huérfano.",
```

**Also required (same pattern, Fixer batch):** rewrite all We Do `instruction` fields to the short gold form:

`E{n} ({kind}) — {clear task}. Entrada: {fixture}. Salida esperada: {pass string}.`

Remove the repeated “Concepto: S12-… / no RPA / no NumPy / haversine stack ban” block from every exercise (scope belongs once in the We Do intro).

### Diff F — Align retry policy (I-16)

```diff
--- a/src/lib/course/sections/s12-performance.ts
+++ b/src/lib/course/sections/s12-performance.ts
@@ theory T1-B paragraph
-        "**Retry/backoff** solo en errores **transitorios** (429, 503, timeouts de red). Un **400** o **404** no se reintenta: reintentar no repara un id mal formado. Respeta `Retry-After` y un **max_retries** duro (p. ej. 3).",
+        "**Retry/backoff** solo en errores **transitorios**: **429**, **503** y timeouts de red en este curso (política N1). Otros **5xx** pueden reintentarse en producción con límite, pero aquí el contrato de ejercicios usa `{429, 503}` para forzar selectividad. Un **400** o **404** no se reintenta. Respeta `Retry-After` y un **max_retries** duro (p. ej. 3).",
@@ STATUS_ACTION solution (optional consistency)
-    500: "retry",
+    500: "fail_server",  # o documentar retry_optional; mantener E should_retry = {429,503}
```

(Pick one policy and make theory, E3 status table, and `should_retry` agree.)

### Diff G — Normalize address contract (I-17)

```diff
--- a/src/lib/course/sections/s12-performance.ts
+++ b/src/lib/course/sections/s12-performance.ts
@@ theory mock_geocode.py
 def normalize_address(s: str) -> str:
     s = re.sub(r"\\s+", " ", s.strip())
-    return s.title()
+    return s  # solo espacios; title-case es política opcional de proveedor
```

(Or teach `.title()` in theory **and** require it in E1 — do not split.)

### Diff H — Resources + dead import + optional branding (I-23, I-24, I-12)

```diff
--- a/src/lib/course/sections/s12-performance.ts
+++ b/src/lib/course/sections/s12-performance.ts
@@
-import time
-
 pages = {
@@
-        note: "curso desplegado; alinear con V3 S12.",
+        note: "Sitio público del curso para navegar S12 en contexto del roadmap.",
@@ optional branding (product decision)
-  icon: "Gauge",
+  icon: "Globe2", // or "Network" / "MapPin" — anything non-performance
```

Note: changing `id: "performance"` affects routing/progress keys — **Fixer must treat as product decision**, not silent rename. Prefer leaving id stable and fixing only learner-visible meta prose + icon.

### Diff I — JSONDecodeError micro-demo (I-18) — optional insert after T1-A code

```diff
+      // add short second example or extend mock:
+      # invalid body → fail-closed
+      def parse_json_body(text):
+          import json
+          try:
+              return json.loads(text)
+          except json.JSONDecodeError:
+              return None  # no inventar dict
```

### Diff J — You Do scaffold enrichment (I-20) — sketch

Add stubs (still `NotImplementedError` or minimal DEFECT) for:

- `cached_get` / provenance dict builder  
- `get_entity` + `should_retry` integration  
- `build_db` CREATE for clients/transactions/evidence + one JOIN smoke print in `main`

Keep progressive disclosure: no new libraries.

### Diff K — selfCheck +2 items (I-21) — sketch

1. Pagination: “¿Cuándo dejas de pedir la siguiente página?” → `next is None`  
2. Transacción: “IntegrityError a mitad de batch con BEGIN” → rollback, count 0  

---

## 7. Recommended Priority Order for Fixing

| Priority | Issues | Why first |
|----------|--------|-----------|
| **1** | I-03, I-04, I-10, I-25 (We Do instructions) | Learners cannot complete exercises; ethics E3 broken |
| **2** | I-05–I-09 (code/output oracles) | Trust + runnable honesty (gold anti-theater) |
| **3** | I-01, I-02, I-23 (meta-leaks V3/legacy/platform) | First-screen redaction |
| **4** | I-16, I-17 (policy consistency) | Prevent contradictory mental models |
| **5** | I-11, I-13, I-14 (dictionary + I Do depth) | Raise toward S01 gold narrative |
| **6** | I-20, I-21 (You Do + quiz breadth) | Capstone readiness |
| **7** | I-12, I-18, I-19, I-22, I-24 (branding, missing demos, ES gloss, polish) | Secondary |

**Do not** bulk-regenerate the section with scripts (GOLD_STANDARD rule). Human edit of instructions + oracles is enough for a large score jump (est. **6.4 → 8.5–9.0** if P0/P1 cleared; **≥9.5** needs dictionary depth + less dict-theater E3s + You Do integration).

---

## 8. Graph Memory Update notes

For shared context (`GRAPH_MEMORY.json` / summary — **notes only**, not applied here):

```yaml
section: 12
id: performance
file: s12-performance.ts
title: APIs, SQL y geodatos responsables
explorer_score: 6.4
explorer_status: complete
prior_auto_rank: 9.52  # REJECT as ground truth for redaction/oracles
structural_ok: true  # 8 theory subtopics, 8 iDo, 24 weDo, youDo, 5 MCQ
domain_ok: true      # HTTP + SQL + geo + ethics spine
redaction_ok: false
oracle_ok: false
meta_leaks:
  - jobRelevance platform id / V3 retematiza
  - theory map "Performance & concurrency" + V3 path negation
  - callout "Contenido reubicado conceptualmente"
  - We Do instruction template + truncations
  - resources note "alinear con V3 S12"
broken_oracles:
  - theory S12-T3-A sqlite_join output
  - theory S12-T3-B params_tx output
  - iDo S12-T2-A provenance
  - iDo S12-T3-A case_join
  - iDo S12-T3-B atomic_batch
garbled_exercises:
  - S12-T1-A-E2 parse_entity
  - S12-T4-A-E3 egress allowlist
  - S12-T3-B-E2 (partial)
edges:
  - S11 domain types → S12 tables clients/evidence
  - S12 acquisition → S13 evidence dashboard / CP-N1-C close
  - S12 NOT primary path for profiling (true owner S37) — explain without meta changelog
fixer_entry:
  - strip meta
  - repair instructions
  - align outputs to code
  - unify retry + normalize contracts
  - optional: dictionary para, You Do stubs, +2 MCQ
gold_gap_vs_s01:
  - missing section dictionary (until fixed)
  - thinner narrative warmth
  - higher template residue
```

**Comparative quality edge:** Domain ethics and OWASP-style SQL exercise are **above** many public short courses; packaging is **below** PyArcana S01 gold until P0/P1 fixed.

---

## Appendix A — Structure inventory (evidence)

| Component | Count / state |
|-----------|----------------|
| Theory blocks | 1 map + 8 subtopics (T1-A/B … T4-A/B) |
| Learning outcomes | 8 |
| iDo demos | 8 (`S12-T*-DEMO`) |
| weDo exercises | 24 (E1/E2/E3 × 8) |
| youDo | 1 portfolio + 5 rubric rows |
| selfCheck | 5 MCQ |
| resources docs | 8 |
| resources books | 2 |
| resources courses | 4 |

## Appendix B — Positive assets (do not “fix away”)

1. Selective retry teaching (400 ≠ 429).  
2. Provenance without logging tokens (intent).  
3. Offline fallback with `mode=offline` honesty.  
4. Parameterized SQL vs f-string injection demo.  
5. Atomic rollback narrative.  
6. Egress allowlist for geocoder.  
7. Haversine as `relationship_signal` with `kinship_verdict=None`.  
8. Synthetic Peru geography (Lima–Callao ~9 km) for grounded intuition.  
9. Official resource set (stdlib + OWASP + MDN + Real Python).  
10. Clear S13 boundary (no RPA/dashboard in S12) — keep as one intro sentence, not 24 exercise footers.

---

This is the complete Explorer report for Section 12. Ready for the Fixer prompt.
