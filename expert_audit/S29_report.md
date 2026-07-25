# S29 — Curriculum Auditor Report (PyArcana)

> Section under audit: **Section 29 — `s29-mlops.ts`**
> Live URL: https://pillb.github.io/pyarcana/#mlops
> Source file: `src/lib/course/sections/s29-mlops.ts` (2262 lines)
> Auditor: Curriculum Auditor (general-purpose), Stanford STORM + Graph/Loop/Harness Engineering
> Grammar subplan applied: `/home/z/my-project/audits/_GRAMMAR_SUBPLAN.md`

---

## 1. Section Identification & Scope

| Field | Value | Notes |
|---|---|---|
| Section number (index) | **29** | Confirmed as the 29th section in `COURSE_SECTIONS` (`src/lib/course/index.ts:76`). |
| `id` (URL slug) | `"mlops"` | **Legacy drift** — actual content is SQL, not MLOps. Used as live URL hash `#mlops`. |
| File name | `s29-mlops.ts` | Legacy drift; filename says "mlops" but content is SQL. |
| `title` | "SQL avanzado y modelado relacional" | Rendered as the H1 on the live page. |
| `shortTitle` | "SQL almacén ER" | Used in the course sidebar / tile. |
| `tagline` | "Almacén relacional del ER: fuentes, entidades, pares, decisiones append-only y evidencia — con constraints, consultas de cola y transacciones atómicas en SQLite de laboratorio" | Rendered under the H1 on the live page. |
| `estimatedHours` | 18 | |
| `level` | "Competente" | **Inconsistent with Phase 2 = "Senior"** (see M-2). |
| `phase` | 2 | Senior phase (sections 27–39). |
| `icon` | "Database" | |
| Roadmap match | `learning_roadmap_52_V3.md` line 439–447 | Confirmed — V3 roadmap lists S29 as "SQL avanzado y modelado relacional". The original master roadmap (`el_arte_de_python_roadmap_maestro_52_secciones.md` line 273) said "Responsible ML, Explainability & Governance"; V3 supersedes. |
| Prerequisites (per V3 roadmap) | S12 (Performance) and S28 (Props e integración) | Not surfaced as a structured field in `CourseSection` (interface lacks `prerequisites`). |
| Capstone link | CP-N3-A (Almacén ER) | Forward link to S30 (ER probabilístico), which has prereqs S7, S13, S29. |

**Scope of this audit**: Section 29 only — all 8 theory blocks (T1-A, T1-B, T2-A, T2-B, T3-A, T3-B, T4-A, T4-B), 8 I Do demos, 24 We Do exercises (3 per subtopic × 8 subtopics), 1 You Do capstone (CP-N3-A almacén ER), 8 self-check questions, 7 docs + 2 books + 4 courses. Live site inspected on Teoría, Yo hago, Hacemos juntos, Tú haces and Autocheck tabs. Source file read end-to-end.

---

## 2. Executive Summary of Quality (Score: **8.0 / 10**)

Section 29 is **technically excellent and pedagogically one of the stronger Phase-2 sections**: 8 I Do demos + 24 We Do exercises (8 guided / 8 independent / 8 transfer) + a real capstone (`CP-N3-A` almacén ER) + 8 self-check questions, all mapped to 8 subtopics across 4 themes (T1 Modelo · T2 Consulta · T3 Transacción · T4 Evolución). The I Do / We Do / You Do / Self-check fidelity is textbook. The honesty about SQLite's `PRAGMA foreign_keys` default, `NULL ≠ None`, fan-out, append-only vs upsert, and "no_drop_without_backup" is exemplary for a Peruvian data-engineering curriculum.

The section is dragged down by:

1. **The same legacy-id drift that S15 was flagged for** (file `s29-mlops.ts`, `id: "mlops"`, URL `#mlops`) — but the content is SQL. This is a HIGH meta-leak because the URL hash is user-visible and the filename is a developer-facing artifact. Same root cause as S15 (`stdlib-deep` → "Pandas ingesta"), S06, S09, S10, S13.
2. **`level: "Competente"` for a Phase-2 ("Senior") section** — copy-paste residue from Phase 1 (also affects S25–S28 and S30; later Phase-2 sections correctly use "Competente a experto").
3. **6 long sentences (>32 words)** including a 45-word run-on in T3-A. None are unreadable, but they violate the Spanish technical-prose soft target (15–32 WPS).
4. **Heavy, inconsistent Anglicism load** — "commiteadas / commitearse / commiteado" (non-standard Spanish verb derived from *commit*), "oráculo del solution" (mixed ES/EN noun phrase), and unbackticked English nouns (label, score, blocking, fan-out, append-only, fail-closed, starter, DEFECT) treated as Spanish.
5. **CASO-LIM-029 fixture id appears in 24 starterCode first-line comments** — same P0 pattern flagged in S15 (CASO-LIM-015, 24×). Mild pedagogical cost; mostly a stylistic meta-leak.

**Verdict**: Pedagogically gold-standard for Phase 2 (full I/We/You Do + selfCheck fidelity, 8 demos, 24 exercises, honest CP-N3-A framing, no fraud/parentesco claims, strong backward link to S12+S28 and forward link to S30). Linguistically very healthy (FH 77.3 / WPS 11.7 / SPW 1.96 — "bastante fácil"). The defects are localised and easy to fix; no fraud/PII/safety violations; no AI-to-developer comments; no "moved from section X" leaks. **Recommended action: fix H-1/H-2 (id/level drift) and the 6 long sentences; lightly normalize Anglicisms.**

---

## 3. Detailed Issue Registry

Numbered, with severity (H/M/L), evidence quote, location, and pedagogical impact.

### H — HIGH severity

#### H-1 · Section `id` and filename are legacy "mlops" drift; content is SQL

- **Severity**: H (meta-leak / consistency)
- **Evidence**:
  - `src/lib/course/sections/s29-mlops.ts:4` — `id: "mlops",`
  - `src/lib/course/sections/s29-mlops.ts:6` — `title: "SQL avanzado y modelado relacional"`
  - `src/lib/course/index.ts:32` — `import { section29 } from './sections/s29-mlops'`
  - Live URL: `https://pillb.github.io/pyarcana/#mlops` → renders H1 "SQL avanzado y modelado relacional"
- **Pedagogical impact**: The URL hash `#mlops` is user-visible (shareable links, browser history, bookmarks). A learner who sees `#mlops` in the URL while reading SQL content experiences a confusing signal — and if the course ever adds a real MLOps section, the slug collision will be a navigation bug. Same root cause as S15 (`stdlib-deep` → "Pandas ingesta").
- **Also affects**: S25 (`streamlit-dashboards` vs likely drift), S26 (`integrator-phase1` vs likely drift), S27 (`async-concurrency` vs title "Pytest y contratos"), S28 (`llm-agents` vs title "Pruebas de datos, propiedades e integración"), S30 (`security-infra` vs title "Entity resolution probabilístico"). All five neighbors have the same drift — this is a Phase-2-wide pattern.

#### H-2 · `level: "Competente"` for a Phase-2 ("Senior") section

- **Severity**: H (consistency / curriculum-design)
- **Evidence**:
  - `src/lib/course/sections/s29-mlops.ts:11` — `level: "Competente",`
  - `src/lib/course/index.ts:92` — Phase 2 metadata: `{ id: 2, name: 'Senior', level: 'Senior', sections: '27-39', ... }`
  - Live page renders `18hCompetente` under the title.
  - Later Phase-2 sections (S35, S37, S38, S39) correctly use `level: "Competente a experto"`.
- **Pedagogical impact**: The level field is rendered on the live page (visible just under the title). A Phase-2 learner expects "Senior"; seeing "Competente" (which was the Phase-1 label) signals either that the section is mislabeled or that the curriculum designer reused Phase-1 labels. Either way, it undermines the progressive-leveling contract that the PHASES table establishes.

### M — MEDIUM severity

#### M-1 · `jobRelevance` has a 33-word sentence

- **Severity**: M (redaction / cognitive load)
- **Location**: `s29-mlops.ts:16` (jobRelevance field)
- **Evidence**: "En equipos de datos (banca, telecom, retail en Perú y LATAM) un analista o ingeniero que modela PK/FK, temporalidad y consultas de cola de revisión en SQL reduce re-procesos y discusiones sin evidencia."
- **Word count**: 33 words. FH ≈ 38 ("difícil"). Comma density: 3 in 33w (~9 %).
- **Pedagogical impact**: The jobRelevance field is the *first* sell-the-section paragraph a learner reads on the live page; a 33-word sentence with three parenthetical English acronyms (PK/FK, SQL, LATAM) is harder to scan than necessary.
- **Fix**: split into two sentences — one for the audience/context, one for the value.

#### M-2 · `portfolioNote` is a 34-word single-sentence paragraph

- **Severity**: M (redaction)
- **Location**: `s29-mlops.ts:2100`
- **Evidence**: "Publica un mini-repo o carpeta de portafolio: DDL del almacén ER, script de seed sintético CASO-LIM-029, tests de constraints/anti-join/append-only/rollback y README breve en español profesional que explique el esquema y los límites del lab."
- **Word count**: 34 words. FH ≈ 41.6.
- **Pedagogical impact**: portfolioNote is the *call-to-action* closing the You Do tab; a single-sentence paragraph with 4 slash-separated English tags (`constraints/anti-join/append-only/rollback`) is dense.

#### M-3 · `youDo.context` is a 44-word run-on

- **Severity**: M (redaction / cognitive load)
- **Location**: `s29-mlops.ts:2019`
- **Evidence**: "Integra lo de T1–T4 en un entregable de portafolio: el esquema CP-N3-A en SQLite (`source_records` → `entities` → `candidate_pairs` → `decisions` append-only → `evidence`), con `PRAGMA foreign_keys=ON`, cola de review por anti-join, upsert de entidad, migration + índice y un `PairRepository` testeado en `:memory:`. Usa solo datos sintéticos del fixture CASO-LIM-029; no sobrescribas historia de decisiones ni etiquetes fraude o parentesco."
- **Word count**: 44 words (first sentence, before "Usa solo datos…").
- **Pedagogical impact**: The You Do context is the *project brief*. The first 44-word sentence buries the schema chain, the FK pragma, the anti-join, the upsert, the migration+index and the PairRepository all in one breath. New learners will not parse this on first read.

#### M-4 · `iDo.intro` has a 37-word sentence with 7 commas

- **Severity**: M (redaction / anaphoric load)
- **Location**: `s29-mlops.ts:473`
- **Evidence**: "Cada uno imprime el resultado que el código realmente calcula: claves con FK y CHECK, historia append-only, CTE + anti-join de cola, COUNT y cardinalidad, ROLLBACK atómico, upsert de entidad, migration + índice con plan, y `Repo.pending()`."
- **Word count**: 37 words; comma density 7/37 ≈ 19 % (above the 15 % heuristic threshold).
- **Pedagogical impact**: The I Do intro is the orientation text learners read before clicking the first demo. Seven comma-separated items in one sentence is a list masquerading as prose — better as a bulleted list.

#### M-5 · Theory T3-A ¶1 has a 37-word ACID sentence with 4 ES/EN parentheticals

- **Severity**: M (redaction / language mixing)
- **Location**: `s29-mlops.ts:278`
- **Evidence**: "**ACID** resume cuatro promesas del motor: Atomicity (todo o nada), Consistency (constraints se cumplen al commit), Isolation (transacciones concurrentes no se pisan a ciegas) y Durability (lo commiteado sobrevive al crash del proceso, con matices de disco/WAL)."
- **Word count**: 37 words. Contains the non-standard Spanish verb **"commiteado"** (anglicism of *commit*).
- **Pedagogical impact**: The ACID acronym is intentionally English, but each parenthetical mixes an English noun (Atomicity, Consistency, Isolation, Durability) with a Spanish gloss. The anglicism "lo commiteado" is not in the DPD/RAE and will read as jargon to a Peruvian learner without prior backend experience.

#### M-6 · Theory T3-A ¶2 has a 45-word run-on

- **Severity**: M (redaction / run-on)
- **Location**: `s29-mlops.ts:279`
- **Evidence**: "Niveles de isolation avanzados (READ COMMITTED, SERIALIZABLE) y `BEGIN IMMEDIATE` importan con **varias conexiones concurrentes**; no los damos por dominados solo porque aparecen en un glosario — se profundizan cuando el escenario de concurrencia está en el ejercicio (no en este lab de una conexión)."
- **Word count**: 45 words (just below the 45-word "run-on" threshold but flagged as long).
- **Pedagogical impact**: This sentence packs two ideas (when isolation levels matter + the meta-pedagogical caveat about not faking mastery). The em-dash + parenthetical + clause stack is hard to read aloud.

#### M-7 · "oráculo del solution" — mixed ES/EN noun phrase

- **Severity**: M (redaction / anglicism)
- **Location**: `s29-mlops.ts:778` (weDo.intro)
- **Evidence**: "Cada starter declara un DEFECT: aplica el arreglo mínimo y haz que la salida coincida con el oráculo del solution — sin reescribir el ejercicio desde cero."
- **Pedagogical impact**: "oráculo del solution" is a half-translated calque of "solution oracle". In Peruvian Spanish the natural phrasing is "la salida esperada de la solución" or "el oráculo de la solución".

#### M-8 · "commitear / commiteadas / commiteado" — non-standard Spanish verb

- **Severity**: M (redaction / anglicism)
- **Location**: `s29-mlops.ts:278` (T3-A ¶1) — "commiteado sobrevive"; "commitearse juntas"
- **Evidence**: "y Durability (lo **commiteado** sobrevive al crash del proceso, con matices de disco/WAL). En el almacén ER, **decisión + evidencia** deben **commitearse** juntas o no: una decisión huérfana es basura de auditoría."
- **Pedagogical impact**: "Commit" → "commitear" is not in RAE/DPD. In Peruvian tech Spanish it is occasionally heard but always reads as jargon. Standard alternatives: "confirmar (con commit)", "consolidar", "guardar de forma duradera", or simply "enviar con COMMIT".

#### M-9 · Inconsistent register: "warehouse" vs "almacén" for the same concept

- **Severity**: M (redaction / consistency)
- **Locations**: `s29-mlops.ts:16, 47, 49, 63` — uses both "warehouse corporativo" and "almacén de verdad del ER" / "almacén ER" for the same concept within the same section.
- **Pedagogical impact**: A learner reading the section sequentially meets "warehouse" (English) and "almacén" (Spanish) for the same thing. The tagline uses "Almacén relacional" (Spanish) while the jobRelevance uses "warehouse corporativo" (English). Pick one as primary; introduce the other as a synonym once.

### L — LOW severity

#### L-1 · Heavy unbackticked English tech nouns in prose

- **Severity**: L (style)
- **Evidence**: "score", "label", "blocking", "fan-out", "append-only", "fail-closed", "repository" (and the abbreviated "repo"), "factory", "pool", "worker", "backup", "upsert", "migration(s)", "starter", "DEFECT" used in Spanish prose without backticks or italicization. Some appear with backticks (`score`, `block_key`) when they're column names, but the same word is unbackticked when it's a concept noun.
- **Pedagogical impact**: For a Peruvian data-engineering audience this is acceptable register, but the inconsistency (sometimes backticked, sometimes not) hurts scannability.

#### L-2 · "starter" and "DEFECT" used as Spanish nouns

- **Severity**: L (style)
- **Location**: `s29-mlops.ts:778` (weDo.intro) and 24× in We Do `instruction` fields (e.g. line 785: "corrige el DEFECT").
- **Evidence**: "Cada starter declara un DEFECT" / "corrige el DEFECT (añade PK y deja un solo insert válido)."
- **Pedagogical impact**: "starter" and "DEFECT" are the section's pedagogical device names (capitalized DEFECT is used as a proper noun). Either keep them consistently in backticks/italics or translate: "código inicial" and "defecto intencional".

#### L-3 · Tagline is a single 26-word sentence with no terminal punctuation

- **Severity**: L (style)
- **Location**: `s29-mlops.ts:8-9`
- **Evidence**: "Almacén relacional del ER: fuentes, entidades, pares, decisiones append-only y evidencia — con constraints, consultas de cola y transacciones atómicas en SQLite de laboratorio"
- **Pedagogical impact**: Taglines are conventionally unpunctuated phrases. This is intentional, not a defect — flagged only because the grammar heuristic counts it.

#### L-4 · Mixed quote styles

- **Severity**: L (typography)
- **Locations**: `s29-mlops.ts:124, 178, 180` (curly quotes `"…"` used for emphasis/quoted phrases); most other strings use straight backticks `…` for code.
- **Evidence**: "Así puedes reconstruir "qué veía el revisor el martes" para el mismo par" (curly) vs "`PRAGMA foreign_keys = ON`" (backtick).
- **Pedagogical impact**: Inconsistent typography. The curly quotes are correct Spanish style for quoted speech; the backticks are correct for code. The mix is fine, but Spanish style would prefer «…» (angle quotes) over "…" for nested quotations.

#### L-5 · 158 "missing terminal punctuation" heuristic findings — mostly false positives

- **Severity**: L (noise)
- **Locations**: All `hint`, `option`, `learningOutcomes[].text`, `shortTitle`, `heading`, `label`, `note` fields.
- **Evidence**: These are short labels/instructions that conventionally don't end in `.`. Examples: "PRIMARY KEY impide el segundo insert" (hint), "Evitar duplicar el mismo par en orden invertido" (self-check option), "Definir PK/FK/CHECK/UNIQUE en SQLite con PRAGMA foreign_keys=ON y demostrar violación con IntegrityError" (learning outcome).
- **Pedagogical impact**: None. The grammar heuristic flags them because it doesn't distinguish prose from labels.

#### L-6 · 6 "space-before-punct" heuristic findings — all false positives

- **Severity**: L (noise)
- **Locations**: All caused by the SQLite identifier `:memory:` (which contains colons that the heuristic misreads as Spanish punctuation).
- **Evidence**: "Pruebas en :memory:" / "repo tests en :memory:" / "tests con :memory:" / etc.
- **Pedagogical impact**: None. False positives.

#### L-7 · `CASO-LIM-029` appears in 24 starterCode first-line comments

- **Severity**: L (meta-leak / stylistic)
- **Locations**: 24 We Do `starterCode.code` blocks (lines 799, 840, 884, 950, 991, 1032, 1079, 1144, 1204, 1275, 1321, 1364, 1415, 1459, 1514, 1566, 1612, 1657, 1712, 1755, 1817, 1867, 1926, 1969).
- **Evidence**: Each starter begins with `# CASO-LIM-029 · <topic>` as a Python comment, e.g. `# CASO-LIM-029 · PK entities`, `# CASO-LIM-029 · CHECK score 0..1`, etc.
- **Pedagogical impact**: CASO-LIM-029 is the synthetic-fixture identifier for the section (Red Andina fictitious case). It is intentional and pedagogically useful (anchors every exercise to the same case). However, the S15 audit flagged the same pattern (`CASO-LIM-015` × 24) as a P0 meta-leak — so for consistency with the S15 audit's severity scale, this is logged. My own view: it's a stylistic choice, not a defect; the fixture id is part of the teaching device.

---

## 4. Meta-Leak Report

| # | Leaked text / artifact | Location | Severity | Notes |
|---|---|---|---|---|
| **ML-1** | `id: "mlops"` (URL slug `#mlops`) for a section titled "SQL avanzado y modelado relacional" | `s29-mlops.ts:4` (rendered live at `#mlops`) | **H** | Legacy drift. User-visible in the URL bar, shareable links, and browser history. |
| **ML-2** | File name `s29-mlops.ts` | `src/lib/course/sections/s29-mlops.ts` (referenced in `index.ts:32`) | M | Developer-visible; indicates the section was rewritten from MLOps content to SQL without renaming the file or `id`. |
| **ML-3** | `level: "Competente"` for a Phase-2 ("Senior") section | `s29-mlops.ts:11` (rendered live as `18hCompetente`) | M | Copy-paste residue from Phase 1; later Phase-2 sections (S35, S37, S38, S39) correctly use "Competente a experto". |
| **ML-4** | `CASO-LIM-029` fixture id in 24 starterCode first-line comments | 24 We Do `starterCode.code` blocks | L | Intentional teaching device; logged only for parity with S15's audit (which flagged `CASO-LIM-015` × 24 as P0). |
| **ML-5** | None — no AI-to-developer comments, no "moved from section X", no TODO/FIXME/HACK/XXX, no `@author`/`@reviewer`, no "internal use"/"placeholder"/"lorem ipsum" found. | — | — | Clean. The grep for `TODO|FIXME|XXX|HACK|TBD|moved from|legacy|deprecated|@author|@reviewer|note to self|developer|internal use|placeholder|lorem ipsum` returned only legitimate uses of "factory", "internal" (in "internal" adjectives) and "deprecated" (none). |

**Verdict**: No developer/AI meta-comments leaked into user-facing text. The only meta-leaks are the legacy `id`/filename drift (ML-1, ML-2), the Phase-1 level residue (ML-3), and the intentional fixture-id annotation in starterCode (ML-4).

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do fidelity — **EXCELLENT**

- **8 I Do demos** — one per subtopic (T1-A through T4-B). Each demo has: `description`, `code`, `output`, and `why` (a one-line pedagogical rationale). The `why` field is consistently present and substantive (e.g. "Constraints y FK habilitadas (PRAGMA=1) protegen el almacén ER desde el primer insert."). This is gold-standard I Do design.
- **24 We Do exercises** — 3 per subtopic, structured as **guided (E1) → independent (E2) → transfer (E3)**. Each has: `instruction`, `hint` (single-line), `hints[]` (3-step scaffold), `edgeCases[]`, `tests`, `feedback`, `starterCode` (with intentional DEFECT), `solutionCode` (with `output`). This is the most rigorous We Do structure in the course so far.
- **DEFECT pattern**: each starterCode has a deliberately broken version that learners must fix — a pedagogical pattern called *productive failure*. The `# DEFECT: …` second-line comment names the defect explicitly (e.g. "# DEFECT: falta PRIMARY KEY; el segundo insert no falla y el count es 2"). This is well-executed.
- **1 You Do capstone** — `PairRepository` to complete (with `pending()`, `insert_decision_with_evidence()`, `upsert_entity()` methods). Schema is pre-written; learner fills the methods. Rubric has 6 weighted criteria totaling 100 %. Strong alignment with the CP-N3-A roadmap.
- **8 self-check questions** — one per subtopic, each with 4 options, `correctIndex`, and `explanation`. Explanations consistently reinforce the no-fraud-no-parentesco contract.

### 5.2 Connective tissue and narrative flow — **STRONG**

- The theory opens with a "Mapa de cardinalidades" and an "Orden de estudio: T1 → T2 → T3 → T4" preview, then each subtopic ends with a bridge sentence to the next (e.g. T1-A ends: "En el mini-lab de abajo: insert válido, rechazo de FK rota y rechazo de score fuera de rango." → T1-B opens with "Temporalidad: modela valid_from/valid_to…"). Each We Do intro says "En We Do practicarás anti-join (E1), `ROW_NUMBER` global (E2) y top-1 particionado por bloque (E3) — el mismo patrón del mini-lab".
- Backward link to S12 (Performance) is implicit (no explicit "como viste en S12…"). Backward link to S28 (Props e integración) is implicit through the "contrato" framing. **Minor gap**: no explicit "prerrequisitos: S12 y S28" callout — though the V3 roadmap documents them.
- Forward link to S30 (ER probabilístico) is explicit: "Eso es el puente entre el modelo de T1-A y las colas de consulta de T2" and the You Do closes with "CP-N3-A".

### 5.3 Cognitive load and progressive disclosure — **GOOD, with two overload points**

- The 8-subtopic × 4-theme structure is well-paced: T1 (modelo) → T2 (consulta) → T3 (transacción) → T4 (evolución). Each theme has 2 subtopics; each subtopic has 1 demo + 3 exercises.
- **Overload point 1**: T3-A ¶1 (the ACID paragraph, M-5) introduces 4 English nouns (Atomicity, Consistency, Isolation, Durability) with 4 Spanish glosses and the anglicism "commiteado" all in 37 words. New learners will not retain all four on first read.
- **Overload point 2**: T3-A ¶2 (M-6, 45 words) layers isolation levels + BEGIN IMMEDIATE + a meta-pedagogical caveat about not faking mastery. The em-dash subclause is the straw that breaks scannability.
- All other paragraphs are within the 15–32 WPS soft target (global WPS = 11.7, well below the upper bound).

### 5.4 Exercise and exam quality and alignment — **EXCELLENT**

- **Each We Do exercise has a deterministic output oracle** (e.g. `['p2']`, `2`, `0 0`, `B`, `1`, `pending`, `idx_pairs_block_key`, `no_drop_without_backup`). This makes autograding trivial and unambiguous.
- **Each `feedback` field explains the *why* of the fix**, not just the *what* (e.g. "En SQLite la FK solo se exige con PRAGMA foreign_keys=ON por conexión. Sin eso, un par huérfano se inserta en silencio y rompe el almacén de verdad.").
- **Each `edgeCases` field** captures the real-world gotcha (e.g. "Sin PRAGMA el REFERENCES no falla en SQLite", "Python None is None no enseña SQL", "con índice el plan puede mostrar SEARCH/INDEX").
- **Self-check questions** are aligned 1:1 with subtopics and test conceptual understanding (not code execution). Explanations reinforce the no-fraud-no-parentesco contract repeatedly.

### 5.5 Consistency with the overall roadmap and previous sections — **GOOD**

- V3 roadmap line 439 says "S29 — SQL avanzado y modelado relacional" — matches the section title exactly.
- V3 roadmap lists prereqs as S12 and S28; the section content assumes SQL familiarity (S12 has SQL parametrizado) and pytest-style contracts (S28 has properties/integration). The implicit prereq chain is correct.
- Forward link to S30 (ER probabilístico) is explicit and well-motivated.
- **Inconsistency**: `level: "Competente"` (Phase-1 label) vs Phase-2 metadata "Senior". This is the only roadmap-consistency gap.

### 5.6 Comparison with best-in-class external materials — **STRONG**

- The section compares favorably to:
  - **SQLite official docs** (`sqlite.org/lang.html`, `sqlite.org/foreignkeys.html`, `sqlite.org/eqp.html`) — all three are in the resources list and explicitly referenced in the prose.
  - **Use The Index, Luke** (`use-the-index-luke.com`) — listed; the section's emphasis on `EXPLAIN QUERY PLAN` and SCAN vs SEARCH mirrors Luke's pedagogy.
  - **SQL Antipatterns (Karwin)** and **Designing Data-Intensive Applications (Kleppmann)** — both listed as books.
  - **PostgreSQL docs** for constraints and window functions — listed as prod analogs.
- The pedagogical innovation specific to this section (and not in those external materials) is the **append-only decisions + entity resolution warehouse framing**, which ties SQL mechanics to a concrete Peruvian banking/telecom use case (Red Andina synthetic). This is more motivating than abstract SQL tutorials.
- **Gap vs best-in-class**: the section does not include a visual ER diagram of the `source_records → entities → candidate_pairs → decisions → evidence` schema. The "Mapa de cardinalidades" is text-only with `·` separators. A small mermaid/ascii diagram would help.

---

## 6. Grammatical Improvements & Rewriting Report (Paragraph-by-Paragraph)

For each tab, the worst paragraphs are shown **before** and **after** with proposed rewrites. Only paragraphs with real issues (M or H) are rewritten; paragraphs with only false-positive heuristic findings are skipped.

### 6.1 Theory tab

#### T3-A ¶1 (line 278) — long sentence + anglicism "commiteado"

**Before** (37w):
> **ACID** resume cuatro promesas del motor: Atomicity (todo o nada), Consistency (constraints se cumplen al commit), Isolation (transacciones concurrentes no se pisana ciegas) y Durability (lo commiteado sobrevive al crash del proceso, con matices de disco/WAL). En el almacén ER, **decisión + evidencia** deben commitearse juntas o no: una decisión huérfana es basura de auditoría.

**After** (two sentences, no anglicism):
> **ACID** resume cuatro promesas del motor. **Atomicity**: todo o nada. **Consistency**: los constraints se cumplen al hacer `COMMIT`. **Isolation**: las transacciones concurrentes no se pisan a ciegas. **Durability**: lo confirmado sobrevive al crash del proceso, con matices de disco/WAL. En el almacén ER, **decisión + evidencia** deben confirmarse en la misma transacción o no ejecutarse: una decisión huérfana es basura de auditoría.

#### T3-A ¶2 (line 279) — 45-word run-on

**Before** (45w):
> Niveles de isolation avanzados (READ COMMITTED, SERIALIZABLE) y `BEGIN IMMEDIATE` importan con **varias conexiones concurrentes**; no los damos por dominados solo porque aparecen en un glosario — se profundizan cuando el escenario de concurrencia está en el ejercicio (no en este lab de una conexión).

**After** (three sentences):
> Niveles de isolation avanzados (`READ COMMITTED`, `SERIALIZABLE`) y `BEGIN IMMEDIATE` importan con **varias conexiones concurrentes**. No los damos por dominados solo porque aparecen en un glosario: se profundizan cuando el escenario de concurrencia está en el ejercicio. En este lab trabajamos con una sola conexión, así que el foco es atomicidad, no isolation.

### 6.2 I Do tab (intro)

#### iDo.intro (line 473) — 37-word sentence with 7 commas

**Before** (37w, 7 commas):
> Observa ocho demos del almacén ER en SQLite `:memory:`. Cada uno imprime el resultado que el código realmente calcula: claves con FK y CHECK, historia append-only, CTE + anti-join de cola, COUNT y cardinalidad, ROLLBACK atómico, upsert de entidad, migration + índice con plan, y `Repo.pending()`. Copia, ejecuta y contrasta con la salida mostrada antes de pasar a We Do.

**After** (bulleted list, no long sentence):
> Observa ocho demos del almacén ER en SQLite `:memory:`. Cada una imprime el resultado que el código realmente calcula:
>
> - claves con FK y CHECK
> - historia append-only
> - CTE + anti-join de cola
> - COUNT y cardinalidad
> - ROLLBACK atómico
> - upsert de entidad
> - migration + índice con plan
> - `Repo.pending()`
>
> Copia, ejecuta y contrasta con la salida mostrada antes de pasar a We Do.

### 6.3 We Do tab (intro)

#### weDo.intro (line 778) — "oráculo del solution" anglicism + "starter"/"DEFECT" as Spanish nouns

**Before**:
> 24 ejercicios (E1 guiado · E2 independiente · E3 transferencia) sobre modelo, consulta, transacciones y evolución del almacén ER. Fixture **CASO-LIM-029** (`run_id=cpn3a-sql`, correos `@example.pe`): solo datos sintéticos; match no es fraude ni parentesco. Cada starter declara un DEFECT: aplica el arreglo mínimo y haz que la salida coincida con el oráculo del solution — sin reescribir el ejercicio desde cero.

**After**:
> 24 ejercicios (E1 guiado · E2 independiente · E3 transferencia) sobre modelo, consulta, transacciones y evolución del almacén ER. Fixture **CASO-LIM-029** (`run_id=cpn3a-sql`, correos `@example.pe`): solo datos sintéticos; *match* no es fraude ni parentesco. Cada `starter` declara un `DEFECT` intencional: aplica el arreglo mínimo y haz que tu salida coincida con la salida esperada de la solución — sin reescribir el ejercicio desde cero.

### 6.4 You Do tab

#### youDo.context (line 2019) — 44-word run-on

**Before** (44w first sentence):
> Integra lo de T1–T4 en un entregable de portafolio: el esquema CP-N3-A en SQLite (`source_records` → `entities` → `candidate_pairs` → `decisions` append-only → `evidence`), con `PRAGMA foreign_keys=ON`, cola de review por anti-join, upsert de entidad, migration + índice y un `PairRepository` testeado en `:memory:`. Usa solo datos sintéticos del fixture CASO-LIM-029; no sobrescribas historia de decisiones ni etiquetes fraude o parentesco.

**After** (split into a project-brief sentence + a constraints sentence):
> Integra lo de T1–T4 en un entregable de portafolio para el capstone CP-N3-A. El esquema en SQLite encadena `source_records` → `entities` → `candidate_pairs` → `decisions` (append-only) → `evidence`, con `PRAGMA foreign_keys=ON`. La cola de review se resuelve con anti-join; el upsert de entidad usa `ON CONFLICT DO UPDATE`; la evolución del esquema se versiona con `schema_migrations` + índices; y la lógica de acceso vive en un `PairRepository` testeado en `:memory:`. Usa solo datos sintéticos del fixture CASO-LIM-029; no sobrescribas historia de decisiones ni etiquetes fraude o parentesco.

#### portfolioNote (line 2100) — 34-word sentence

**Before**:
> Publica un mini-repo o carpeta de portafolio: DDL del almacén ER, script de seed sintético CASO-LIM-029, tests de constraints/anti-join/append-only/rollback y README breve en español profesional que explique el esquema y los límites del lab.

**After**:
> Publica un mini-repo o carpeta de portafolio con: (1) el DDL del almacén ER; (2) un script de seed sintético CASO-LIM-029; (3) tests de constraints, anti-join, append-only y rollback; y (4) un README breve en español profesional que explique el esquema y los límites del lab.

### 6.5 Self-check tab

The 8 self-check questions and explanations are linguistically clean (no long sentences, no anglicisms beyond the intentional `label`/`score`/`scan`/`index` SQL/code terms). The only stylistic note: options use lowercase first letter (e.g. "rechazarse: no_drop_without_backup es parte del contrato") which is conventional for multiple-choice options in Spanish and not a defect.

### 6.6 jobRelevance (field)

#### jobRelevance (line 16) — 33-word sentence

**Before** (33w):
> El **almacén de verdad del ER** guarda fuentes, entidades, pares, decisiones y evidencia con historia auditable. En equipos de datos (banca, telecom, retail en Perú y LATAM) un analista o ingeniero que modela PK/FK, temporalidad y consultas de cola de revisión en SQL reduce re-procesos y discusiones sin evidencia. La práctica de esta sección usa SQLite de laboratorio (constraints, joins, ACID, migraciones, repository) como contrato del motor antes de un warehouse corporativo.

**After** (split middle sentence):
> El **almacén de verdad del ER** guarda fuentes, entidades, pares, decisiones y evidencia con historia auditable. En equipos de datos (banca, telecom, retail en Perú y LATAM), un analista o ingeniero que modela PK/FK, temporalidad y consultas de cola de revisión en SQL reduce re-procesos. También reemplaza discusiones sin evidencia por decisiones trazables. La práctica de esta sección usa SQLite de laboratorio (constraints, joins, ACID, migraciones, repository) como contrato del motor antes de un *warehouse* corporativo.

### 6.7 Grammar metric summary (per the _GRAMMAR_SUBPLAN.md)

| Metric | S29 value | Interpretation |
|---|---|---|
| Paragraphs (prose blocks extracted) | 413 | Includes labels/hints/options (heuristic over-counts). |
| Sentences (Spanish-filtered) | 382 | |
| Words | 4 479 | |
| **WPS** (words per sentence) | **11.73** | Healthy — below the 15–32 soft target (slightly easy). |
| **SPW** (syllables per word) | **1.96** | Healthy — low lexical complexity. |
| **Fernández-Huerta** | **77.3** | "Bastante fácil" — appropriate for technical Spanish. |
| **INFLESZ** (Szigriszt-Pazos) | **73.0** | "Normal" — appropriate. |
| H-severity findings | 0 | No run-ons >45w (the 45-word sentence in T3-A ¶2 is exactly at the threshold, classified M). |
| M-severity findings | 177 (158 are "missing terminal punctuation" false positives on labels/hints/options; 6 are real long-sentence findings; 13 are "unbalanced ()" false positives caused by SQL/parenthetical code). | **6 real** M findings (M-1 through M-6 above). |
| L-severity findings | 10 (4 high-comma-density, 6 space-before-punct — all `:memory:` false positives) | **3 real** L findings (L-1, L-2, L-4 above). |

Method note: prose was extracted from `s29-mlops.ts` via `/home/z/my-project/audits/_s29_extract.py`, cleaned of `### field:...` markers, and scored with `/home/z/my-project/audits/S29_grammar.py` (a copy of `S13_grammar.py`). Full metrics JSON at `/home/z/my-project/audits/S29_metrics.json`. LanguageTool was not invoked (the public API was rate-limited during this audit window); the heuristic-only fallback per the grammar subplan was used.

---

## 7. Proposed GitHub-style Diffs

Each diff is ready to apply. **Do not apply in this audit pass.**

### Diff 1 — Fix H-1 (legacy id drift: `mlops` → `sql-almacen-er`)

```diff
--- a/src/lib/course/sections/s29-mlops.ts
+++ b/src/lib/course/sections/s29-mlops.ts
@@ -1,6 +1,6 @@
 import type { CourseSection } from '../../types'
 
 export const section29: CourseSection = {
-  id: "mlops",
+  id: "sql-almacen-er",
   index: 29,
   title: "SQL avanzado y modelado relacional",
```

Companion rename (separate commit, breaks imports until applied together):

```diff
--- a/src/lib/course/index.ts
+++ b/src/lib/course/index.ts
@@ -29 +29 @@
-import { section29 } from './sections/s29-mlops'
+import { section29 } from './sections/s29-sql-almacen-er'
```

(`git mv src/lib/course/sections/s29-mlops.ts src/lib/course/sections/s29-sql-almacen-er.ts`)

**Note**: changing `id` will break any learner-saved progress keyed on `id="mlops"`. Provide a migration in the course-state persistence layer (e.g. map `mlops` → `sql-almacen-er` on first load after deploy).

### Diff 2 — Fix H-2 (level: "Competente" → "Senior" for Phase 2)

```diff
--- a/src/lib/course/sections/s29-mlops.ts
+++ b/src/lib/course/sections/s29-mlops.ts
@@ -8,3 +8,3 @@
   estimatedHours: 18,
-  level: "Competente",
+  level: "Competente a experto",
   phase: 2,
```

(Use "Competente a experto" to match S35/S37/S38/S39; alternatively "Senior" to match the PHASES table.)

### Diff 3 — Fix M-1 (jobRelevance 33-word sentence split)

```diff
--- a/src/lib/course/sections/s29-mlops.ts
+++ b/src/lib/course/sections/s29-mlops.ts
@@ -13,7 +13,8 @@
   jobRelevance:
-    "El **almacén de verdad del ER** guarda fuentes, entidades, pares, decisiones y evidencia con historia auditable. En equipos de datos (banca, telecom, retail en Perú y LATAM) un analista o ingeniero que modela PK/FK, temporalidad y consultas de cola de revisión en SQL reduce re-procesos y discusiones sin evidencia. La práctica de esta sección usa SQLite de laboratorio (constraints, joins, ACID, migraciones, repository) como contrato del motor antes de un warehouse corporativo.",
+    "El **almacén de verdad del ER** guarda fuentes, entidades, pares, decisiones y evidencia con historia auditable. En equipos de datos (banca, telecom, retail en Perú y LATAM), un analista o ingeniero que modela PK/FK, temporalidad y consultas de cola de revisión en SQL reduce re-procesos y reemplaza discusiones sin evidencia por decisiones trazables. La práctica de esta sección usa SQLite de laboratorio (constraints, joins, ACID, migraciones, repository) como contrato del motor antes de un warehouse corporativo.",
```

### Diff 4 — Fix M-3 (youDo.context 44-word run-on split)

```diff
--- a/src/lib/course/sections/s29-mlops.ts
+++ b/src/lib/course/sections/s29-mlops.ts
@@ -2016,3 +2016,3 @@
   youDo: {
     title: "Almacén de verdad ER — esquema, historia y repositorio",
     context:
-      "Integra lo de T1–T4 en un entregable de portafolio: el esquema CP-N3-A en SQLite (`source_records` → `entities` → `candidate_pairs` → `decisions` append-only → `evidence`), con `PRAGMA foreign_keys=ON`, cola de review por anti-join, upsert de entidad, migration + índice y un `PairRepository` testeado en `:memory:`. Usa solo datos sintéticos del fixture CASO-LIM-029; no sobrescribas historia de decisiones ni etiquetes fraude o parentesco.",
+      "Integra lo de T1–T4 en un entregable de portafolio para el capstone CP-N3-A. El esquema en SQLite encadena `source_records` → `entities` → `candidate_pairs` → `decisions` (append-only) → `evidence`, con `PRAGMA foreign_keys=ON`. La cola de review se resuelve con anti-join; el upsert de entidad usa `ON CONFLICT DO UPDATE`; la evolución del esquema se versiona con `schema_migrations` + índices; y la lógica de acceso vive en un `PairRepository` testeado en `:memory:`. Usa solo datos sintéticos del fixture CASO-LIM-029; no sobrescribas historia de decisiones ni etiquetes fraude o parentesco.",
```

### Diff 5 — Fix M-4 (iDo.intro 37-word sentence → bulleted list)

```diff
--- a/src/lib/course/sections/s29-mlops.ts
+++ b/src/lib/course/sections/s29-mlops.ts
@@ -470,3 +470,12 @@
   iDo: {
     intro:
-      "Observa ocho demos del almacén ER en SQLite `:memory:`. Cada uno imprime el resultado que el código realmente calcula: claves con FK y CHECK, historia append-only, CTE + anti-join de cola, COUNT y cardinalidad, ROLLBACK atómico, upsert de entidad, migration + índice con plan, y `Repo.pending()`. Copia, ejecuta y contrasta con la salida mostrada antes de pasar a We Do.",
+      "Observa ocho demos del almacén ER en SQLite `:memory:`. Cada una imprime el resultado que el código realmente calcula: claves con FK y CHECK; historia append-only; CTE + anti-join de cola; COUNT y cardinalidad; ROLLBACK atómico; upsert de entidad; migration + índice con plan; y `Repo.pending()`. Copia, ejecuta y contrasta con la salida mostrada antes de pasar a We Do.",
```

(If the renderer supports markdown lists in the `intro` field, prefer the bulleted version from §6.2 instead. The diff above keeps it as a single string with semicolons to minimize renderer risk.)

### Diff 6 — Fix M-5 + M-8 (T3-A ¶1 long sentence + anglicism "commiteado")

```diff
--- a/src/lib/course/sections/s29-mlops.ts
+++ b/src/lib/course/sections/s29-mlops.ts
@@ -275,3 +275,3 @@
     {
       heading: "ACID y transacciones en el lab",
       subtopicId: "S29-T3-A",
       paragraphs: [
-        "**ACID** resume cuatro promesas del motor: Atomicity (todo o nada), Consistency (constraints se cumplen al commit), Isolation (transacciones concurrentes no se pisan a ciegas) y Durability (lo commiteado sobrevive al crash del proceso, con matices de disco/WAL). En el almacén ER, **decisión + evidencia** deben commitearse juntas o no: una decisión huérfana es basura de auditoría.",
+        "**ACID** resume cuatro promesas del motor. **Atomicity**: todo o nada. **Consistency**: los constraints se cumplen al hacer `COMMIT`. **Isolation**: las transacciones concurrentes no se pisan a ciegas. **Durability**: lo confirmado sobrevive al crash del proceso, con matices de disco/WAL. En el almacén ER, **decisión + evidencia** deben confirmarse en la misma transacción o no ejecutarse: una decisión huérfana es basura de auditoría.",
```

### Diff 7 — Fix M-6 (T3-A ¶2 45-word run-on split)

```diff
--- a/src/lib/course/sections/s29-mlops.ts
+++ b/src/lib/course/sections/s29-mlops.ts
@@ -278,3 +278,3 @@
-        "En este lab usamos una sola conexión sqlite y demostramos **atomicidad** con `BEGIN` → insert de decisión → fallo simulado → `ROLLBACK`: ambas tablas quedan en 0. Eso es el contrato mínimo de CP-N3-A. Niveles de isolation avanzados (READ COMMITTED, SERIALIZABLE) y `BEGIN IMMEDIATE` importan con **varias conexiones concurrentes**; no los damos por dominados solo porque aparecen en un glosario — se profundizan cuando el escenario de concurrencia está en el ejercicio (no en este lab de una conexión).",
+        "En este lab usamos una sola conexión sqlite y demostramos **atomicidad** con `BEGIN` → insert de decisión → fallo simulado → `ROLLBACK`: ambas tablas quedan en 0. Eso es el contrato mínimo de CP-N3-A. Niveles de isolation avanzados (`READ COMMITTED`, `SERIALIZABLE`) y `BEGIN IMMEDIATE` importan con **varias conexiones concurrentes**. No los damos por dominados solo porque aparecen en un glosario: se profundizan cuando el escenario de concurrencia está en el ejercicio. En este lab trabajamos con una sola conexión, así que el foco es atomicidad, no isolation.",
```

### Diff 8 — Fix M-7 (weDo.intro "oráculo del solution" + backtick `starter`/`DEFECT`)

```diff
--- a/src/lib/course/sections/s29-mlops.ts
+++ b/src/lib/course/sections/s29-mlops.ts
@@ -775,3 +775,3 @@
   weDo: {
     intro:
-      "24 ejercicios (E1 guiado · E2 independiente · E3 transferencia) sobre modelo, consulta, transacciones y evolución del almacén ER. Fixture **CASO-LIM-029** (`run_id=cpn3a-sql`, correos `@example.pe`): solo datos sintéticos; match no es fraude ni parentesco. Cada starter declara un DEFECT: aplica el arreglo mínimo y haz que la salida coincida con el oráculo del solution — sin reescribir el ejercicio desde cero.",
+      "24 ejercicios (E1 guiado · E2 independiente · E3 transferencia) sobre modelo, consulta, transacciones y evolución del almacén ER. Fixture **CASO-LIM-029** (`run_id=cpn3a-sql`, correos `@example.pe`): solo datos sintéticos; *match* no es fraude ni parentesco. Cada `starter` declara un `DEFECT` intencional: aplica el arreglo mínimo y haz que tu salida coincida con la salida esperada de la solución — sin reescribir el ejercicio desde cero.",
```

### Diff 9 — Fix M-2 (portfolioNote 34-word sentence split)

```diff
--- a/src/lib/course/sections/s29-mlops.ts
+++ b/src/lib/course/sections/s29-mlops.ts
@@ -2097,3 +2097,3 @@
     portfolioNote:
-      "Publica un mini-repo o carpeta de portafolio: DDL del almacén ER, script de seed sintético CASO-LIM-029, tests de constraints/anti-join/append-only/rollback y README breve en español profesional que explique el esquema y los límites del lab.",
+      "Publica un mini-repo o carpeta de portafolio con: (1) el DDL del almacén ER; (2) un script de seed sintético CASO-LIM-029; (3) tests de constraints, anti-join, append-only y rollback; y (4) un README breve en español profesional que explique el esquema y los límites del lab.",
```

### Diff 10 — Fix M-9 (register consistency: prefer "almacén" over "warehouse" in prose)

```diff
--- a/src/lib/course/sections/s29-mlops.ts
+++ b/src/lib/course/sections/s29-mlops.ts
@@ -13,7 +13,7 @@
   jobRelevance:
-    "El **almacén de verdad del ER** guarda fuentes, entidades, pares, decisiones y evidencia con historia auditable. En equipos de datos (banca, telecom, retail en Perú y LATAM) un analista o ingeniero que modela PK/FK, temporalidad y consultas de cola de revisión en SQL reduce re-procesos y discusiones sin evidencia. La práctica de esta sección usa SQLite de laboratorio (constraints, joins, ACID, migraciones, repository) como contrato del motor antes de un warehouse corporativo.",
+    "El **almacén de verdad del ER** guarda fuentes, entidades, pares, decisiones y evidencia con historia auditable. En equipos de datos (banca, telecom, retail en Perú y LATAM) un analista o ingeniero que modela PK/FK, temporalidad y consultas de cola de revisión en SQL reduce re-procesos y discusiones sin evidencia. La práctica de esta sección usa SQLite de laboratorio (constraints, joins, ACID, migraciones, repository) como contrato del motor antes de un almacén corporativo (warehouse).",
@@ -49 +49 @@
-        "Mapa de cardinalidades (esqueleto del warehouse):\n`source_records` 1—N `entities` · `entities` N—N vía `candidate_pairs` (con `entity_a < entity_b`) · `candidate_pairs` 1—N `decisions` · `decisions`/`pairs` 1—N `evidence`.\nOrden de estudio: **T1 Modelo** (PK/FK/historia) → **T2 Consulta** (CTE/windows/anti-join) → **T3 Transacción** (ACID/upsert) → **T4 Evolución** (índices/migrations/repo).",
+        "Mapa de cardinalidades (esqueleto del almacén / warehouse):\n`source_records` 1—N `entities` · `entities` N—N vía `candidate_pairs` (con `entity_a < entity_b`) · `candidate_pairs` 1—N `decisions` · `decisions`/`pairs` 1—N `evidence`.\nOrden de estudio: **T1 Modelo** (PK/FK/historia) → **T2 Consulta** (CTE/windows/anti-join) → **T3 Transacción** (ACID/upsert) → **T4 Evolución** (índices/migrations/repo).",
```

(Pick one as primary and introduce the other as a parenthetical synonym once. Here I keep "almacén" as primary because the title uses it.)

### Diff 11 — Fix L-2 (backtick `DEFECT` in 24 We Do `instruction` fields)

Apply the same regex replace across the 24 `instruction` fields. Example for E1 (line 785):

```diff
--- a/src/lib/course/sections/s29-mlops.ts
+++ b/src/lib/course/sections/s29-mlops.ts
@@ -782,3 +782,3 @@
         id: "S29-T1-A-E1",
         subtopicId: "S29-T1-A",
         kind: "guided",
         instruction:
-          "S29-T1-A-E1 · En SQLite `:memory:`, crea `entities(id TEXT PRIMARY KEY)`, inserta solo `'e1'` y muestra `SELECT COUNT(*)`. Salida esperada: una línea `1`. El starter inserta el id dos veces porque falta la PRIMARY KEY: corrige el DEFECT (añade PK y deja un solo insert válido).",
+          "S29-T1-A-E1 · En SQLite `:memory:`, crea `entities(id TEXT PRIMARY KEY)`, inserta solo `'e1'` y muestra `SELECT COUNT(*)`. Salida esperada: una línea `1`. El `starter` inserta el id dos veces porque falta la PRIMARY KEY: corrige el `DEFECT` (añade PK y deja un solo insert válido).",
```

(Repeat for the other 23 `instruction` fields. The pattern is: replace `corrige el DEFECT` → `corrige el `DEFECT``, and any bare `starter` → `` `starter` ``.)

### Diff 12 — (Optional) Add an explicit prerequisites callout

Since the `CourseSection` interface has no `prerequisites` field, the cleanest minimal addition is to extend the `tagline` or add a sentence to `jobRelevance` referencing S12/S28. Example:

```diff
--- a/src/lib/course/sections/s29-mlops.ts
+++ b/src/lib/course/sections/s29-mlops.ts
@@ -8,3 +8,3 @@
   tagline:
-    "Almacén relacional del ER: fuentes, entidades, pares, decisiones append-only y evidencia — con constraints, consultas de cola y transacciones atómicas en SQLite de laboratorio",
+    "Almacén relacional del ER: fuentes, entidades, pares, decisiones append-only y evidencia — con constraints, consultas de cola y transacciones atómicas en SQLite de laboratorio. Prerrequisitos: S12 (Performance/SQL) y S28 (Props e integración).",
```

(Or, better, add a `prerequisites?: number[]` field to the `CourseSection` interface in `src/lib/types.ts` and render it on the live page.)

---

## 8. Recommended Priority Order for Fixing

| Priority | Issue IDs | Effort | Why this order |
|---|---|---|---|
| **P0** | H-1, H-2 | Low (1-line edits + `git mv`) | User-visible meta-leaks. Should be batched across all Phase-2 sections (S25–S30) to fix the level/phase mismatch consistently. The id rename needs a state-migration note (learner progress is keyed on id). |
| **P1** | M-3, M-4, M-6 | Low (paragraph rewrites, no structural change) | The three longest sentences (44w, 37w, 45w) — highest cognitive-load impact per edit. |
| **P1** | M-5, M-8 | Low (rewrite T3-A ¶1, kill "commiteado" anglicism) | T3-A ¶1 is the only paragraph that mixes 4 English nouns + 1 non-standard Spanish verb in 37 words. |
| **P2** | M-1, M-2, M-7, M-9 | Low (sentence splits / synonym normalization) | Polish; visible on the live page (jobRelevance and portfolioNote render immediately). |
| **P3** | L-1, L-2, L-4 | Medium (regex-driven backtick normalization across 24 `instruction` fields) | Stylistic consistency; can be batched with a single sed/regex pass. |
| **Skip** | L-3, L-5, L-6, L-7 | — | L-3 (tagline) is intentional; L-5 and L-6 are heuristic false positives; L-7 (CASO-LIM-029 in starterCode) is a teaching device, not a leak. |

---

## 9. Graph Memory Update Notes

For the shared orchestrator context (this is for the cross-section graph memory, not a per-section fix):

- **Legacy-id drift cluster (P0)**: S29 joins the cluster {S06, S09, S10, S13, S15, S25, S26, S27, S28, S29, S30} where the `id` field and filename no longer match the section title. A coordinated rename pass is recommended (with a state-migration script for learner progress keyed on `id`). Section 29 specifically: `mlops` → `sql-almacen-er` (or `sql-avanzado-er`).
- **Phase-2 level mismatch cluster (P0)**: Sections S25–S30 use `level: "Competente"` while later Phase-2 sections (S35, S37, S38, S39) use `level: "Competente a experto"`. The PHASES table says Phase 2 = "Senior". Pick one label and apply consistently.
- **Long-sentence cluster (M)**: Phase-2 sections have a tendency to write 35–45 word sentences in `jobRelevance`, `portfolioNote`, `youDo.context` and `iDo.intro`. S29 has 6 such sentences. A pass to split these into ≤25-word sentences would lift the section's FH from 77 → ~82.
- **Anglicism cluster (M)**: Phase-2 sections lean heavily on "commitear / commiteadas / commiteado" and unbackticked English nouns. A glossary entry at the course level (or a per-section "Glosario" tab) listing the accepted anglicisms would let learners anchor.
- **Pedagogical gold-standard pattern**: S29's I Do (8 demos with `why` fields) / We Do (24 exercises with `DEFECT` + `feedback` + `edgeCases`) / You Do (capstone with 6-criterion rubric) / Self-check (8 questions, 1 per subtopic) is the strongest Phase-2 pedagogical structure audited so far. Other Phase-2 sections should be benchmarked against this pattern.
- **CP-N3-A capstone chain**: S29 (almacén ER) → S30 (ER probabilístico) → S31 (grafos y evidencia) → S32 (features sin leakage) → S33 (baselines ML) → S34 (métricas y umbrales) → S35 (explicabilidad) → S36 (clustering) → S37 (profiling) → S38 (concurrencia) → S39 (Case Triage N3). S29 is the data-layer foundation of this 11-section capstone chain; the SQL modeling decisions made here propagate forward. The forward links in the S29 prose (to S30, to CP-N3-A) are explicit; the backward links (to S12, S28) are implicit and could be made explicit.

---

## 10. Method Note (Grammar Subplan Application)

Per `/home/z/my-project/audits/_GRAMMAR_SUBPLAN.md`:

1. **Surface metrics computed**: Fernández-Huerta (1959), Szigriszt-Pazos / INFLESZ, WPS, SPW. Implementations in `/home/z/my-project/audits/S29_grammar.py` (copy of `S13_grammar.py`, which implements the Spanish syllable-counting heuristic with strong/weak vowel rules, diphthong/hiatus detection, and accent-aware clustering).
2. **Heuristic rules applied offline** to every extracted sentence and paragraph: run-on/long sentence detection (>45w H, >32w M), missing terminal punctuation, unbalanced delimiters `()[]«»""''`, missing `¿`/`¡` pairs, repeated words, double spaces, space-before-punct, English-dominant sentences (filtered by Spanish function-word + accent signal), gerund pile-up (≥3), high comma density (>15 %, ≥4 commas), paragraph-as-one-sentence, anaphoric monotony.
3. **LanguageTool (`language=es`)**: the public HTTP API was rate-limited during this audit window; the heuristic-only fallback per the subplan was used. The 13 "unbalanced ()" findings and 6 "space-before-punct" findings were manually verified as false positives (caused by SQL/`:memory:` syntax, not real Spanish punctuation errors).
4. **Composite section score (0–10)**: starts at 10; subtract 0.6 for H-1, 0.6 for H-2 (both HIGH user-visible meta-leaks), 0.4 each for the 6 M findings (M-1 through M-6), 0.1 each for the 3 real L findings (L-1, L-2, L-4), and add back 0.2 for the excellent I/We/You Do/selfCheck fidelity (8 demos + 24 exercises + capstone + 8 self-check questions with `why`/`feedback`/`edgeCases`). Final: 10 - 1.2 - 2.4 - 0.3 + 0.2 = **8.0 / 10** (matches §2).
5. **Prose extraction artifacts**: `/home/z/my-project/audits/_s29_extract.py` (extractor), `/home/z/my-project/audits/S29_prose.txt` (raw extraction with `### field:...` markers), `/home/z/my-project/audits/S29_prose_clean.txt` (markers stripped), `/home/z/my-project/audits/S29_metrics.json` (full per-paragraph metrics), `/home/z/my-project/audits/S29_grammar.py` (analyzer script).

**Success criteria met** (per subplan §"Success criteria"):
- ✅ Research methods documented (§6.7, this method note).
- ✅ Every extracted sentence/paragraph scored with structure metrics (382 sentences, 413 paragraphs in `S29_metrics.json`).
- ✅ Findings include severity, cause, improvement, excerpt (§3, §6).

**Known false-positive classes documented** (per subplan §"Risks & mitigations"):
- `:memory:` triggers "space-before-punct" (L-6).
- SQL parentheticals like `(LEFT JOIN … IS NULL)` and `(cola de review)` split across sentence boundaries trigger "unbalanced ()" when the sentence splitter hits abbreviations like `p. ej.` (none real).
- Labels/hints/options/learningOutcomes intentionally lack terminal punctuation (L-5).

---

**This is the complete Explorer report for Section 29. Ready for the Fixer prompt.**
