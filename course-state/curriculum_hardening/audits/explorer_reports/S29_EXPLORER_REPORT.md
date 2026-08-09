# Explorer Report — Section 29 (SQL avanzado y modelado relacional)

**Auditor role:** Curriculum Auditor · Pedagogical Analyst · Technical Editor  
**Method:** Stanford STORM + Graph Engineering + Loop Engineering + Harness Engineering (single-section deep pass)  
**Date:** 2026-07-24  
**Live site:** https://pillb.github.io/pyarcana/ (`#mlops` / UI “Sección 29 · SQL almacén ER”)  
**Source:** `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s29-mlops.ts`  
**Platform id (hash):** `mlops` (legacy filename `s29-mlops.ts`; V3 topic is relational SQL / ER warehouse, **not** MLOps serving)  
**Roadmap title:** SQL avanzado y modelado relacional  
**Live card title:** SQL almacén ER  
**Do not fix:** this report proposes diffs only; no curriculum TS was modified.

**Pre-round research anchors (pedagogy + domain):**
- Progressive disclosure (Nielsen / IxDF): show essential options first; bury advanced detail; avoid multi-layer dump of the same “contract” paste.  
- Gradual release of responsibility (I Do → We Do → You Do): demos must be trustworthy (code output matches execution); guided practice fixes a single defect; transfer requires new reasoning, not literal print.  
- SQLite foreign keys: **off by default**; require `PRAGMA foreign_keys = ON` per connection ([sqlite.org/foreignkeys.html](https://www.sqlite.org/foreignkeys.html)).  
- SQLite `EXPLAIN QUERY PLAN` as honest teaching of SCAN vs SEARCH ([sqlite.org/eqp.html](https://www.sqlite.org/eqp.html); Use The Index, Luke).  
- Competitive bar: Stanford CS145 / relational integrity materials; PostgreSQL constraints + windows docs; Karwin *SQL Antipatterns*; Kleppmann on transactions/history — section resources already cite several of these, but live exercises do not match that bar.  
- Gold peer in this repo: `s01-setup.ts` — long unique ES-PE prose, glossary-first, runnable demos whose `output` matches code, workplace framing without curriculum-internal IDs.

**Note on prior automated green lights:** `S29_AUDIT.json` (ACCEPT), `S29_PARAGRAPHS.md` (rank 9.55), and residual ledger score 10 **conflict** with expert reading. Gold checklist explicitly rejects template soup, identical “Contrato operativo” shells, and print-theater. This report overrides length/rank oracles with meaning-level evidence from source + live curriculum card.

---

## 1. Section Identification & Scope

| Field | Value |
|--------|--------|
| Index | 29 |
| id | `mlops` |
| File | `src/lib/course/sections/s29-mlops.ts` |
| Title (TS) | SQL avanzado y modelado relacional |
| shortTitle / live | SQL almacén ER |
| Level / phase / hours | Competente · phase 2 · 18h |
| Capstone link | CP-N3-A (ER warehouse of truth) |
| Fixture | `CASO-LIM-029` (`run_id=cpn3a-sql`) |
| Structure present | Theory overview + T1–T4 × A/B (9 blocks) · iDo 8 · weDo 24 · youDo · selfCheck 5 · resources |

**In scope this run:** learner-facing content of S29 only (theory, I Do, We Do, You Do, self-check, resources, metadata shown on site).  
**Out of scope:** applying fixes; other sections; renaming platform hash (document only).

**Graph nodes (high level):**  
`metadata` → `jobRelevance` / LO · `theory[T1–T4]` → `iDo[demoId]` → `weDo[E1–E3]` → `youDo` · `selfCheck` · `resources` · edges: *aligns_with*, *contradicts_output*, *boilerplate_copy*, *meta_leak*, *theater*.

---

## 2. Executive Summary of Quality

### Score: **4.6 / 10**

**Verdict:** Structural skeleton for an ER relational warehouse lab is present and thematically correct for V3 S29, but **pedagogical trust is broken**. Theory is dominated by copy-pasted ethics/contract shells that inflate length without teaching mechanism. **All 8 I Do demos ship code whose printed output does not match the declared `output` field** (and often not the `description`/`why`). We Do is largely **print-theater** with a uniform English-mixed instruction boilerplate and starters whose DEFECT narrative does not match the oracle solution. Meta-leaks expose curriculum engineering (`legacy mlops`, `gate V3`, `section_passed` / ledger). Automated gold claims for this section are **not** supported by expert review against `GOLD_STANDARD_CHECKLIST.md` and S01 depth.

| Dimension | Score (1–10) | One-line |
|-----------|--------------|----------|
| Meta-leak hygiene | 3 | Multiple learner-visible internal notes |
| ES-PE redaction | 5 | Mix of solid terms + English “only”, thin headings |
| Connective tissue | 4 | Map exists; paragraphs don’t deepen unique content |
| I/We/You fidelity | 3 | I Do untrustworthy; We Do theater; You Do OK-ish |
| Cognitive load / progressive disclosure | 4 | Same contract paste every block = fake depth |
| Exercise/exam quality | 3 | Many non-SQL string prints; starter≠solution |
| Roadmap consistency | 7 | Topic matches V3 ER store; id/filename legacy |
| External competitive bar | 4 | Docs list strong; exercises do not |
| Domain technical accuracy | 5 | Good ideas; SQLite FK pragma missing; some theater “fk_ok” |

**What works (preserve):**
- Correct V3 domain: ER warehouse tables, append-only decisions, anti-join review queue, ACID decision+evidence, upsert vs history, migrations/index, repository tests.  
- Ethics guardrails: no real PII; match ≠ fraud/parentesco.  
- Theory mini-labs (s29_th_*) are often more honest than iDo.  
- Resources point to SQLite language, EQP, FK, PG constraints/windows, Use The Index Luke, sqlite3.  
- Self-check items on canonical pair order, append-only, atomicity, repository, no_drop_without_backup are concept-aligned.

---

## 3. Detailed Issue Registry

Severity: **P0** = blocks learning trust / wrong oracle · **P1** = major pedagogy/redaction · **P2** = polish / consistency · **P3** = nice-to-have.

### P0 — Trust & oracles

**ISSUE-01 · All I Do demos: description / code / output misaligned**  
- **Severity:** P0  
- **Location:** `iDo.steps` · `S29-T1-A-DEMO` … `S29-T4-B-DEMO`  
- **Evidence (examples):**

| demoId | description / why claims | code actually does | declared `output` |
|--------|--------------------------|--------------------|-------------------|
| S29-T1-A-DEMO | pairs + CHECK entity_a < entity_b | only seeds `entities`, prints name | `0.5` / `ok True` |
| S29-T1-B-DEMO | append-only decisions history | `score_check_ok()` IntegrityError on 1.5 | `['review', 'match']` |
| S29-T2-A-DEMO | CTE + anti-join pending pairs | LEFT JOIN → should print `['p2']` + flags | `[('p1',)]` |
| S29-T2-B-DEMO | COUNT(*) vs COUNT(col) + card | `group by` dict of counts | `star 3` / `col 2` / `pairs 1`… |
| S29-T3-A-DEMO | rollback both empty | prints `rows_after_abort 0` + flags | `0 0` |
| S29-T3-B-DEMO | upsert name | prints `Ana` + flags | `Ana L` |
| S29-T4-A-DEMO | migration + index | prints version only | `1` + `indexed True` |
| S29-T4-B-DEMO | pending pairs without decision | counts `jobs` pending | `[('p2',)]` |

- **Pedagogical impact:** Gradual release collapses: learners cannot “observe a correct process” if the UI shows an output that the code never produces. Undermines every later We Do that says “compare with solution/demo.”

**ISSUE-02 · Theory demo claims FK success without enabling or testing FK**  
- **Severity:** P0 (domain honesty)  
- **Location:** theory `keys_constraints.py` (`s29_th_1`)  
- **Evidence:** `REFERENCES entities(id)` but no `PRAGMA foreign_keys = ON`; prints `fk_ok True` as a literal. SQLite does not enforce FK by default.  
- **Impact:** Teaches a false mental model of integrity; high-stakes for a section whose LO is “modelar claves y constraints correctos.”

**ISSUE-03 · We Do instruction vs starter DEFECT vs solution rewrite (systematic)**  
- **Severity:** P0  
- **Location:** all 24 `weDo.steps`  
- **Evidence pattern:** Instruction says *“implementa solo el DEFECT indicado sin reescribir datos ni asserts”* and *“pass string = salida del oráculo”*, but solutions often rewrite schema/data (e.g. S29-T1-A-E1 starter tries duplicate insert / wrong path; solution is clean create+insert+count `1`). S29-T1-B-E1 starter filters wrong set of rows; solution inserts different labels.  
- **Impact:** Learner cannot follow the stated contract; grader/oracle pedagogy is theater.

**ISSUE-04 · Print-theater and non-SQL “SQL” exercises**  
- **Severity:** P0  
- **Locations (non-exhaustive):**  
  - `S29-T2-A-E3` → `print('ranked')`  
  - `S29-T2-B-E2` → `print(None is None)` (Python, not SQL NULL semantics)  
  - `S29-T2-B-E3` → `print('SCAN')` without EXPLAIN  
  - `S29-T3-A-E2` → `print('A,C,I,D')`  
  - `S29-T3-B-E2` → dict status literal  
  - `S29-T4-A-E2` → index name string typo fix  
  - `S29-T4-A-E3` → `print('no_drop_without_backup')`  
  - `S29-T4-B-E2` → pool_size 5 literal  
  - `S29-T4-B-E3` → `print(pending_count)` after hardcoding  
- **Impact:** Violates gold anti-theater rules; no skill transfer to SQLite for ~40%+ of the bank; E3 “transfer” is often literal recall.

### P1 — Pedagogy, boilerplate, meta, redaction

**ISSUE-05 · Template soup: identical contract / fixture paste in nearly every theory paragraph**  
- **Severity:** P1  
- **Location:** `theory[*].paragraphs` (≈25+ occurrences of the same shells)  
- **Evidence (verbatim shells, repeated):**  
  - *“El modelo relacional es el contrato entre fuentes, candidatos y decisiones: sin historia, no hay auditoría del ER. Documenta evidencia y límites del fixture `CASO-LIM-029` (run_id=cpn3a-sql): sin PII real y sin auto-veredicto.”*  
  - *“Contrato operativo: entrada DDL/DML sobre fixture `CASO-LIM-029` (run_id=cpn3a-sql) → tablas con PK/FK y queries deterministas; fail-closed si falta llave o el join multiplica filas sin documentar fan-out.”*  
  - *“Caso sintético PE: warehouse de Red Andina en Lima…”* (near-clone)  
- **Impact:** Violates progressive disclosure and gold “template triplet” ban. Unique teaching content is often 1 short sentence per paragraph; residual avg_para ~329 is inflated by paste. Cognitive load rises without new schema knowledge.

**ISSUE-06 · Uniform We Do instruction boilerplate (ES/EN mix)**  
- **Severity:** P1  
- **Location:** every `instruction` ends with nearly identical:  
  `Fixture sintético \`CASO-LIM-029\` (run_id=cpn3a-sql, @example.pe): la entrada es el starter completo; implementa solo el DEFECT… Contrato I/O: … Datos sintéticos only; no etiqueta fraude ni parentesco.`  
- **Impact:** “only” is English; fixture text does not teach per-exercise I/O; drowns the actual task; same ethics line 24× (should live once in section intro).

**ISSUE-07 · Meta-leak in `jobRelevance`**  
- **Severity:** P1  
- **Evidence:** *“Id legacy `mlops` se conserva; el path V3 es SQL avanzado y modelado relacional, no MLOps de modelos.”*  
- **Impact:** Learner-facing curriculum engineering note; confuses title/id; not workplace framing (contrast S01 jobRelevance).

**ISSUE-08 · Meta-leak in `youDo.portfolioNote`**  
- **Severity:** P1  
- **Evidence:** *“No marcar section_passed ni tocar ledger/seed.”*  
- **Impact:** Internal harness instruction leaked to portfolio guidance.

**ISSUE-09 · Meta / internal rubric criterion**  
- **Severity:** P1  
- **Evidence:** rubric *“Alineación al gate V3 de la sección”* (25%)  
- **Impact:** Learners don’t know “gate V3”; should be observable deliverables (schema, tests, history).

**ISSUE-10 · Learning outcomes are slogan-thin vs S01**  
- **Severity:** P1  
- **Evidence:** e.g. *“Modelar claves y constraints correctos”* — no measurable verb+artifact; no mention of SQLite lab, CP-N3-A evidence, or EXPLAIN.  
- **Impact:** Weak self-assessment; weak interview framing.

**ISSUE-11 · Theory windows/CTE under-taught relative to heading**  
- **Severity:** P1  
- **Evidence:** T2-A claims ROW_NUMBER/RANK but only one compact query; no PARTITION BY example; We Do “window” is Python `sorted`.  
- **Impact:** Progressive disclosure skips mechanism; transfer exercises don’t use SQL windows.

**ISSUE-12 · Isolation levels named without demonstration**  
- **Severity:** P1  
- **Evidence:** T3-A mentions READ COMMITTED / SERIALIZABLE / BEGIN IMMEDIATE; code only shows single-connection rollback.  
- **Impact:** Cognitive overload + unearned vocabulary (gold: no untaught / undemoed APIs as if mastered).

**ISSUE-13 · Starter codes print `ok True` paths that conflict with solution single-line oracles**  
- **Severity:** P1  
- **Evidence:** Most starters end with `print('ok', True)` while solution output is a single token (`1`, `bad_score`, `True`, …).  
- **Impact:** If learner “fixes defect” but leaves starter tail, they fail oracle; if they copy solution wholesale, they never practice repair.

### P2 — Consistency, grammar, accessibility

**ISSUE-14 · Heading capitalization / mixed register**  
- **Severity:** P2  
- **Evidence:** headings like `claves, constraints y normalización`, `índices y migrations` (lowercase Spanish + English nouns).  
- **Impact:** Looks unfinished vs S01 title case / full Spanish.

**ISSUE-15 · Thin selfCheck explanations**  
- **Severity:** P2  
- **Evidence:** explanations are one short clause (e.g. “Orden canónico de extremos del par.”) without misconception repair.  
- **Impact:** Active recall without feedback depth.

**ISSUE-16 · youDo starter incomplete vs requirements**  
- **Severity:** P2  
- **Evidence:** starter has entities/pairs/decisions but omits `source_records`, `evidence`, migration table, repository class; context asks for all of them.  
- **Impact:** Acceptable as skeleton if rubric says “extend,” but portfolioNote doesn’t list acceptance tests.

**ISSUE-17 · Filename / icon / accent vs content**  
- **Severity:** P2  
- **Evidence:** file `s29-mlops.ts`, icon `Database` (OK), platform hash `mlops` while S47 is real MLOps.  
- **Impact:** SEO/search confusion; not learner-visible filename but hash is in URL `#mlops`.

**ISSUE-18 · Residual/audit false gold**  
- **Severity:** P2 (process debt)  
- **Evidence:** residual `score: 10`, PA rank 9.55, AUDIT ACCEPT vs expert 4.6.  
- **Impact:** Fixer may skip section if trusting oracles; graph memory must mark residual gold as **invalid** for S29 content quality.

**ISSUE-19 · Theory INSERT multi-value style / print-theater labels**  
- **Severity:** P2  
- **Evidence:** `print("check_score", True)` without attempting invalid score in that script (CHECK is only proven in other demos).  
- **Impact:** Weakens “observable practice” callout of the overview.

**ISSUE-20 · Spanish redaction nits**  
- **Severity:** P2  
- **Evidence:** “Datos sintéticos **only**”; “fail-closed” unglossed on first heavy use in every paste; “rankeados” informal. Prefer ES-PE: *solo datos sintéticos*, *fallo cerrado (fail-closed)*, *ordenados con ROW_NUMBER*.  
- **Impact:** Tone drift vs course brand.

**ISSUE-21 · S29-T2-B-E2 teaches wrong NULL analogy**  
- **Severity:** P1 (borderline P0)  
- **Evidence:** Exercise equates Python `None is None` → True with SQL NULL, but SQL `NULL = NULL` is unknown; theory correctly says use `IS NULL`.  
- **Impact:** Direct contradiction theory ↔ exercise.

### P3

**ISSUE-22 · Books lack URLs** (resources.books) — acceptable but weaker than docs.  
**ISSUE-23 · No worked ER diagram ASCII/schema map** in overview (cardinalities source→entity→pair→decision→evidence).  
**ISSUE-24 · Hours 18 may be optimistic** if content were fixed to real SQL depth (not a content bug).

---

## 4. Meta-Leak Report

| # | Exact leaked / internal text | Location | Learner-visible? | Recommended action |
|---|------------------------------|----------|------------------|--------------------|
| M1 | `Id legacy \`mlops\` se conserva; el path V3 es SQL avanzado y modelado relacional, no MLOps de modelos.` | `jobRelevance` | Yes | Delete; replace with workplace ER/SQL framing (banks, telcos, data platforms PE) |
| M2 | `No marcar section_passed ni tocar ledger/seed.` | `youDo.portfolioNote` | Yes | Delete; keep only portfolio artifact description |
| M3 | `Alineación al gate V3 de la sección` | `youDo.rubric[0]` | Yes | Replace with measurable: “Esquema CP-N3-A con historia append-only y tests en :memory:” |
| M4 | Heavy `CASO-LIM-029` / `run_id=cpn3a-sql` in every paragraph | theory + all instructions | Yes (fixture OK once) | Keep fixture **once** in overview; strip mechanical repetition (not a secret, but template leak smell) |
| M5 | Filename `s29-mlops.ts` / hash `mlops` | platform | URL hash yes | Document for maintainers; optional later rename with redirect (out of Fixer scope unless product allows) |

**meta_leak_count (strict learner-facing internal engineering):** **3** (M1–M3).  
M4 is boilerplate hygiene, not classic AI-to-dev note; M5 is platform debt.

No “moved from section X”, “TODO”, “FIXME”, or “STUB” strings found in learner prose beyond DEFECT comments in starters (acceptable as exercise framing if honest).

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 Connective tissue & narrative flow

Overview correctly states order **T1 Modelo → T2 Consulta → T3 Transacción → T4 Evolución** and links to CP-N3-A. That is good roadmap connective tissue after S27–S28 (pytest / data QA) and before S30 probabilistic ER.

However, **intra-section flow fails**: each subtopic restarts with the same “modelo relacional es el contrato…” thesis instead of carrying forward a single evolving schema (e.g. introduce full DDL once, then only add columns/indices). S01 builds a glossary then deepens; S29 pastes a compliance footer.

### 5.2 I Do / We Do / You Do fidelity

| Phase | Expected | S29 reality |
|-------|----------|-------------|
| I Do | Worked, runnable, output-true demos | **Broken outputs**; topics swapped across demos |
| We Do E1 guided | Fix one defect in scaffold | Starter/solution often different programs |
| We Do E2 independent | Same skill, less scaffolding | Often change a literal |
| We Do E3 transfer | New context | Frequently print the magic string |
| You Do | Portfolio integration | Decent narrative; meta rubric; thin starter |

**Cognitive load:** Extraneous load from repeated ethics/fixture text is high; germane load on SQL is low because many tasks avoid SQL.

**Progressive disclosure breach examples:** Isolation level names without lab; pooling “5” without connection lifecycle; window functions named then practiced via `sorted()`.

### 5.3 Exercise & exam alignment

Self-check is the **strongest** assessment block: five MCQs map to real LOs (canonical order, append-only, atomicity, repository, migration safety). Fixer should keep stems, expand explanations, and optionally add NULL/`IS NULL` and EXPLAIN SCAN/SEARCH items **after** theory/exercises teach them honestly.

We Do bank needs rebuild priority: at least one real SQL exercise per subtopic with deterministic multi-line output (as theory s29_th_* already models).

### 5.4 Consistency with roadmap & neighbors

- Aligns with live curriculum card S29 “SQL almacén ER” and SECTION_MAP.tsv.  
- S28 jobRelevance has the same **legacy id** pattern → systemic meta-leak family across phase-2 retargets.  
- S47 remains “MLOps serving” — reinforcing that S29 hash `mlops` is hazardous for learners sharing URLs.

### 5.5 Comparison with external high-quality materials

| External | Strength | Gap in S29 |
|----------|----------|------------|
| SQLite official FK + EQP docs | Mechanism + enablement | FK pragma omitted; SCAN exercise is print |
| Use The Index, Luke | Why indexes, how to read plans | Index exercise is naming string |
| PG window tutorial | PARTITION BY examples | No partitioned window lab |
| CS50P / MIT 6.100L | Graduated problem sets | E3 not a problem set |
| freeCodeCamp / serious SQL courses | End-to-end schema + queries | Schema split across theater fragments |
| S01 PyArcana gold | ES-PE depth, matching outputs | S29 fails both |

### 5.6 Accessibility & motivation

- Motivation (auditability of ER) is strong when not buried.  
- Callouts (orden A<B, UPDATE destruye historia, NOT EXISTS, NULL en join) are good micro-lessons — preserve and expand into paragraphs.  
- Missing: alt-text N/A for code; ensure code blocks remain copy-paste runnable after Fixer aligns outputs.

### 5.7 Grammatical / redaction notes (Peruvian Spanish)

- Prefer complete sentences over telegraphic LO fragments.  
- Normalize headings to Spanish sentence or title case.  
- Gloss English terms once: fail-closed, upsert, pooling, repository.  
- Avoid Spanglish “only”.  
- Keep industry terms (PRIMARY KEY, CTE, ACID) as in industry — already fine.

---

## 6. Proposed GitHub-style Diffs

> Diffs are **proposals for the Fixer**. Paths relative to repo root. Not applied in this run.

### Diff group A — Remove meta-leaks (M1–M3)

```diff
--- a/src/lib/course/sections/s29-mlops.ts
+++ b/src/lib/course/sections/s29-mlops.ts
@@ jobRelevance
-  jobRelevance:
-    "El **almacén de verdad del ER** guarda fuentes, entidades, pares, decisiones y evidencia con historia. La práctica usa SQLite de laboratorio (PK/FK, checks, joins, ACID, migraciones) como contrato del motor. Id legacy `mlops` se conserva; el path V3 es SQL avanzado y modelado relacional, no MLOps de modelos.",
+  jobRelevance:
+    "El **almacén de verdad del ER** guarda fuentes, entidades, pares, decisiones y evidencia con historia auditable. En equipos de datos (banca, telecom, retail en Perú y LATAM) un analista o ingeniero que modela PK/FK, temporalidad y consultas de cola de revisión en SQL reduce re-procesos y discusiones sin evidencia. La práctica de esta sección usa SQLite de laboratorio (constraints, joins, ACID, migraciones, repository) como contrato del motor antes de un warehouse corporativo.",
@@ portfolioNote
-    portfolioNote:
-      "Esquema de almacén ER con historia y repo testeable para CP-N3-A. No marcar section_passed ni tocar ledger/seed.",
+    portfolioNote:
+      "Publica un mini-repo o carpeta de portafolio: DDL del almacén ER, script de seed sintético CASO-LIM-029, tests de constraints/anti-join/append-only y README breve en español profesional.",
@@ rubric
-      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
+      { criterion: "Esquema CP-N3-A completo (fuentes, entidades, pares, decisiones append-only, evidencia) con constraints verificados", weight: "25%" },
```

### Diff group B — Theory: strip boilerplate; teach mechanism once

```diff
--- a/src/lib/course/sections/s29-mlops.ts
+++ b/src/lib/course/sections/s29-mlops.ts
@@ theory T1-A paragraphs (illustrative rewrite of paste)
-        "**PK/FK** anclan integridad: un par referencia dos entidades. **Constraints** CHECK (score 0..1), UNIQUE (source, external_id). El modelo relacional es el contrato entre fuentes, candidatos y decisiones: sin historia, no hay auditoría del ER. Documenta evidencia y límites del fixture `CASO-LIM-029` (run_id=cpn3a-sql): sin PII real y sin auto-veredicto.",
-        "Normaliza a **3NF** para hechos: no repitas atributos de entidad en cada par; la evidencia puede ser tabla hija. Contrato operativo: entrada DDL/DML sobre fixture `CASO-LIM-029` (run_id=cpn3a-sql) → tablas con PK/FK y queries deterministas; fail-closed si falta llave o el join multiplica filas sin documentar fan-out.",
-        "Ids sintéticos estables (`ent_…`, `pair_…`) facilitan tests. Caso sintético PE: warehouse de Red Andina en Lima con ids `ent-00N` y emails `@example.pe`; las consultas de candidatos se versionan con el run_id del pipeline. Documenta evidencia y límites del fixture `CASO-LIM-029` (run_id=cpn3a-sql): sin PII real y sin auto-veredicto.",
+        "**PK/FK** anclan integridad: cada `candidate_pairs` referencia dos `entities`. Añade **CHECK** (`score` entre 0 y 1) y **UNIQUE** natural de negocio (p. ej. `(source_system, external_id)` en registros fuente). En SQLite la FK solo se exige si habilitas `PRAGMA foreign_keys = ON` en **cada** conexión; sin eso el `REFERENCES` es documentación que no falla.",
+        "Normaliza a **3NF** para hechos del ER: no copies `canonical_name` en cada par; guarda atributos de entidad en `entities` y deja `evidence` como tabla hija del par o de la decisión. Si un join multiplica filas (fan-out), documenta la cardinalidad o el query está mal para auditoría.",
+        "Usa ids sintéticos estables (`ent-00N`, `pair-…`) y correos `@example.pe` del fixture CASO-LIM-029. Versiona consultas de candidatos con `run_id` del pipeline para reproducir la misma cola de review en tests.",
```

*(Apply the same anti-paste pattern to all theory blocks: overview keeps full fixture contract once; A/B blocks only add new mechanism + edge.)*

### Diff group C — Theory code: honest FK

```diff
--- a/src/lib/course/sections/s29-mlops.ts
+++ b/src/lib/course/sections/s29-mlops.ts
@@ keys_constraints.py
     con = sqlite3.connect(":memory:")
+    con.execute("PRAGMA foreign_keys = ON")
     con.executescript('''
     CREATE TABLE entities(
...
     con.execute("INSERT INTO candidate_pairs VALUES ('p1','e1','e2',0.82)")
+    fk_rejected = False
+    try:
+        con.execute("INSERT INTO candidate_pairs VALUES ('p_bad','e1','e_missing',0.5)")
+    except sqlite3.IntegrityError:
+        fk_rejected = True
     n = con.execute("SELECT COUNT(*) FROM candidate_pairs").fetchone()[0]
     print("pairs", n)
-    print("fk_ok", True)
-    print("check_score", True)
+    print("fk_ok", fk_rejected)
+    print("check_score", True)  # or attempt score 1.5 and catch
```

Align `output` to actual prints.

### Diff group D — Fix all I Do demos (pattern for T1-B; repeat per demo)

```diff
--- a/src/lib/course/sections/s29-mlops.ts
+++ b/src/lib/course/sections/s29-mlops.ts
@@ S29-T1-B-DEMO
-        description: "Inserta dos decisiones append-only para el mismo par y lista labels.",
+        description: "Inserta dos decisiones append-only para el mismo par y lista labels en orden.",
         code: {
           language: 'python',
           title: "prov_demo.py",
-          code: `import sqlite3
-
-def score_check_ok():
-    c = sqlite3.connect(":memory:")
-    c.execute("create table p(score real check(score between 0 and 1))")
-    try:
-        c.execute("insert into p values (1.5)")
-        return False
-    except sqlite3.IntegrityError:
-        return True
-
-print("check_rejects", score_check_ok())
-print("ok", True)
-`,
-          output: `['review', 'match']`,
+          code: `import sqlite3
+
+c = sqlite3.connect(":memory:")
+c.execute(
+    "create table decisions(id integer primary key, pair_id text, label text)"
+)
+c.execute("insert into decisions(pair_id,label) values ('p1','review')")
+c.execute("insert into decisions(pair_id,label) values ('p1','match')")
+labels = [r[0] for r in c.execute(
+    "select label from decisions where pair_id='p1' order by id"
+)]
+print(labels)
+print("append_only", True)
+`,
+          output: `['review', 'match']
+append_only True`,
```

**Required for Fixer:** rebuild **all 8** demos so that (1) description, (2) code, (3) `output`, (4) `why` describe the same artifact. Prefer aligning code to description (not description to broken code).

### Diff group E — We Do instruction template (once)

```diff
--- a/src/lib/course/sections/s29-mlops.ts
+++ b/src/lib/course/sections/s29-mlops.ts
@@ example S29-T1-A-E1 instruction
-          "S29-T1-A-E1 · Crea tabla entities(id TEXT PRIMARY KEY) en :memory: e inserta 'e1'; imprime count. Fixture sintético `CASO-LIM-029` (run_id=cpn3a-sql, @example.pe): la entrada es el starter completo; implementa solo el DEFECT indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
+          "S29-T1-A-E1 · En SQLite `:memory:`, crea `entities(id TEXT PRIMARY KEY)`, inserta `'e1'` y muestra `SELECT COUNT(*)`. Salida esperada: una línea `1`. Usa solo datos sintéticos del lab (sin PII real).",
```

And align starter so the single defect is: e.g. missing PRIMARY KEY or failed insert; solution output must match a minimal fix of **that** starter.

### Diff group F — Replace theater exercises with real SQL (examples)

```diff
--- a/src/lib/course/sections/s29-mlops.ts
+++ b/src/lib/course/sections/s29-mlops.ts
@@ S29-T2-B-E3 (was print SCAN)
-# DEFECT: INDEX sin evidencia
-print('INDEX')
+# DEFECT: consulta sin EXPLAIN; debe imprimir si el plan contiene SCAN
+import sqlite3
+c=sqlite3.connect(':memory:')
+c.execute('create table pairs(id text, block_key text)')
+c.execute("insert into pairs values ('p1','K')")
+plan='\\n'.join(str(r) for r in c.execute(
+  "explain query plan select * from pairs where block_key='K'"
+))
+print('SCAN' if 'SCAN' in plan.upper() else 'OTHER')
```

```diff
@@ S29-T2-B-E2 (NULL honesty)
-print(None is None)
+# En SQL, igualdad con NULL no es TRUE. Demuestra con sqlite:
+import sqlite3
+c=sqlite3.connect(':memory:')
+c.execute('create table t(x int)')
+c.execute('insert into t values (null)')
+eq = c.execute('select count(*) from t where x = null').fetchone()[0]
+isn = c.execute('select count(*) from t where x is null').fetchone()[0]
+print(eq, isn)  # expected: 0 1
```

### Diff group G — Headings & LOs polish

```diff
-      heading: "claves, constraints y normalización",
+      heading: "Claves, constraints y normalización",
-    { text: "Modelar claves y constraints correctos" },
+    { text: "Definir PK/FK/CHECK/UNIQUE en SQLite con `PRAGMA foreign_keys=ON` y demostrar violación con IntegrityError" },
```

### Diff group H — Self-check explanation enrichment (sample)

```diff
-        explanation:
-          "Orden canónico de extremos del par.",
+        explanation:
+          "Con entity_a < entity_b (orden canónico) el par (e1,e2) y (e2,e1) no coexisten. No implica fraude ni parentesco: solo evita duplicar el mismo candidato.",
```

---

## 7. Recommended Priority Order for Fixing

1. **P0 — Align all 8 I Do demos** (description ↔ code ↔ output ↔ why). Without this, no other fix restores trust.  
2. **P0 — Honest FK in theory lab** (`PRAGMA foreign_keys=ON` + real rejection).  
3. **P0 — Rebuild We Do bank**: remove pure print-theater E2/E3; every subtopic gets ≥1 real sqlite exercise; starter defect must match solution delta.  
4. **P0/P1 — Fix NULL exercise** so it does not contradict theory.  
5. **P1 — Strip theory boilerplate**; keep fixture/ethics once in overview.  
6. **P1 — Shorten We Do instructions**; ES-PE only; task-specific I/O.  
7. **P1 — Meta-leak removal** (jobRelevance, portfolioNote, rubric gate V3).  
8. **P1 — Expand LOs** to measurable artifacts.  
9. **P2 — Headings, selfCheck explanations, youDo starter completeness, optional schema diagram.**  
10. **P2 — Process:** mark residual/PA “gold” for S29 as **superseded** by this Explorer report; do not skip Fixer based on auto-rank 9.55.

**Suggested Fixer acceptance tests (manual):**
- Run every theory + iDo code block; stdout == `output` field.  
- For each weDo, applying minimal defect fix to starter yields solution output (no full rewrite required).  
- Zero learner-visible “legacy”, “V3 gate”, “ledger/seed”, “section_passed”.  
- Grep theory: each of the long contract shells appears ≤1–2 times in the section, not ≥20.

---

## 8. Graph Memory Update notes

```yaml
section: 29
id: mlops
file: s29-mlops.ts
v3_topic: "SQL avanzado y modelado relacional / almacén ER CP-N3-A"
explorer_score: 4.6
status_content_quality: not_gold
invalidates:
  - residual_ledger.json sections["29"].score=10
  - S29_AUDIT.json verdict ACCEPT as pedagogy signal
  - S29_PARAGRAPHS.md expert rank 9.55 (template-inflated)
edges:
  - { from: theory_boilerplate, type: copy_of, to: CASO_LIM_029_shell, weight: high }
  - { from: iDo_all_demos, type: contradicts_output, to: declared_output, weight: critical }
  - { from: weDo_E3_cluster, type: print_theater, to: gold_checklist_anti_stub, weight: high }
  - { from: jobRelevance, type: meta_leak, to: legacy_mlops_note }
  - { from: youDo.portfolioNote, type: meta_leak, to: section_passed_ledger }
  - { from: S29, type: roadmap_ok, to: CP-N3-A }
  - { from: S29, type: precedes, to: S30_probabilistic_ER }
  - { from: S29.hash, type: confusable_with, to: S47_mlops_serving }
preserve:
  - ethics: match_neq_fraud
  - resources: sqlite_eqp_fk_pg_windows_util
  - selfCheck_stems: mostly_good
  - theory_th_scripts: better_than_iDo_as_base_for_repair
fixer_ready: true
```

**Shared-context recommendation:** Treat phase-2 “Id legacy `…` se conserva; path V3…” as a **fleet-wide meta-leak pattern** (confirmed at least S28–S29); schedule a cross-section strip after per-section Fixers, or include in each Fixer prompt.

---

## Issue count summary

| Severity | Count |
|----------|------:|
| P0 | 4 (ISSUE-01–04; plus ISSUE-21 treated as P1/P0 boundary) |
| P1 | 9 |
| P2 | 7 |
| P3 | 3 |
| **Total registered issues** | **24** (ISSUE-01–24) |
| **Strict meta-leaks (M1–M3)** | **3** |

---

This is the complete Explorer report for Section 29. Ready for the Fixer prompt.
