# S08 Explorer Report — Archivos, CSV, JSON y contratos de ingesta

**Auditor role:** Curriculum Auditor / Pedagogical Analyst / Technical Editor (STORM + Graph Engineering + Loop Engineering)  
**Section file:** `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s08-pandas.ts`  
**Platform id (hash):** `pandas`  
**Live URL:** https://pillb.github.io/pyarcana/#pandas  
**Repo path (workspace):** `src/lib/course/sections/s08-pandas.ts`  
**Analysis date:** 2026-07-24  
**Scope rule honored:** Section 8 only — no curriculum fixes applied.

**Sources of evidence**
- Full read of `s08-pandas.ts` (theory × 9 blocks, iDo × 8, weDo × 24, youDo, selfCheck × 5, resources).
- Live site navigation: home/curriculum card for S08 confirms public titles (“Archivos & ETL”, tagline pathlib/CSV/JSON/cuarentena/manifest); SPA deep content is driven by the same TS source (hash `#pandas`).
- Comparative reads: S02 (`s02-basics.ts`) as early gold-standard narrative; S05–S07 map/meta patterns as peer rebranded sections.
- Pre-round pedagogy: Gradual Release of Responsibility (I Do / We Do / You Do), cognitive load shifting, progressive disclosure for file I/O + data contracts; external practice alignment (UTF-8 explícito, `newline=''` for csv, atomic replace).

---

## 1. Section Identification & Scope

| Field | Value |
|--------|--------|
| Index | 8 |
| Platform `id` | `pandas` (legacy hash; **does not match content**) |
| Title | Archivos, CSV, JSON y contratos de ingesta |
| shortTitle (UI card) | Archivos & ETL |
| Tagline | pathlib, CSV/JSON, cuarentena y manifest de ingesta |
| Level / hours / phase | Intermedio · 18h · phase 0 |
| File name | `s08-pandas.ts` (filename still “pandas”) |
| Gate | **CP-N1-B** (close of local ETL: clean / quarantine / manifest) |
| Stack declared | stdlib: pathlib, csv, json, hashlib, shutil, Decimal — **no pandas, no requests** |
| Subtopics | S08-T1-A/B, T2-A/B, T3-A/B, T4-A/B (8) |
| I Do | 8 demos (`S08-T*-*-DEMO`) |
| We Do | 24 exercises (E1 guided / E2 independent / E3 transfer × 8) |
| You Do | Client/Transaction ETL Pipeline (CP-N1-B) |
| Self-check | 5 MCQs |
| Resources | pathlib, csv, json, hashlib, os.replace, decimal + books/courses |

**In-scope analysis nodes (graph)**  
Map intro · T1 path/UTF-8 · T1 atomic/newlines · T2 dialect/cast · T2 quarantine · T3 JSON/JSONL · T3 schema/nulls · T4 hash/backup · T4 manifest/reconcile · I Do chain · We Do scaffolding · You Do starter · SelfCheck · jobRelevance · learningOutcomes · platform id mismatch.

**Explicitly out of scope for this run**  
S09+ content, applying diffs, product UI code, other section TS files (read only for comparison).

---

## 2. Executive Summary of Quality

### Score: **5.5 / 10**

**Verdict:**  
S08 has a **strong professional thesis** (stdlib ingestion contracts, fail-closed quarantine, per-source reconciliation, CP-N1-B portfolio gate) and a **complete GRR skeleton** (8× I Do, 24 We Do, serious You Do). Relative to many intro courses that only show `open()` + `pandas.read_csv`, the *curriculum design intent* is superior and job-relevant for junior data/analytics engineering in Perú.

However, **execution quality undercuts trust**: a large fraction of theory and I Do **code blocks do not match their claimed `output`**, several We Do **instructions are truncated or garbled**, and **meta-curriculum language** (“En V3…”, “Id de plataforma `pandas` se conserva”, “pandas EDA se difiere”) leaks into learner-facing copy. Compared with early gold-standard S02 (clear dictionary, coherent demos, narrative warmth), S08 is **telegraphic, repetitive (PII/C00x boilerplate), and demo-unreliable**.

**Without fixing code↔output and instruction integrity, the section is not ready as a trustworthy autonomous learning path.** Architecture: keep. Surface quality: major redaction + demo repair pass required.

| Dimension | Grade (1–10) | One-line note |
|-----------|--------------|---------------|
| Meta-leak / identity honesty | 3.5 | V3 + platform id `pandas` + reubicación talk |
| Grammar / redaction (ES-PE) | 6.0 | Mostly OK; template spam + truncations |
| Connective tissue / flow | 5.5 | Map exists but dense; repeated boilerplate |
| I Do / We Do / You Do fidelity | 6.5 | Structure good; demo fidelity poor |
| Cognitive load / progressive disclosure | 6.0 | T1→T4 logical; 24+8+project is heavy |
| Exercises / exam alignment | 5.0 | Good skill map; broken instructions/tests |
| Roadmap consistency | 7.0 | CP-N1-B arc S05–S08 solid |
| External best-practice parity | 7.5 | Atomic write, UTF-8, Decimal, reconcile |
| Overall | **5.5** | Intent high, artifact quality medium-low |

---

## 3. Detailed Issue Registry

Severity key: **P0** blocks trust/learning · **P1** high pedagogical damage · **P2** medium polish · **P3** nice-to-have.

---

### ISSUE-01 — P0 — Theory `path_utf8.py`: code ≠ output

**Location:** `theory[1]` S08-T1-A · `code.title: path_utf8.py`  
**Evidence (code):**
```python
p.write_text("línea1\nlínea2\n", encoding="utf-8")
return p.exists(), p.read_text(encoding="utf-8").splitlines()
print(demo_path_write())
```
**Evidence (output):**
```
True ['línea1', 'josé']
línea1
josé
extra
```
**Impact:** First hands-on theory demo trains the student that “what the course prints” may be fiction. Undermines every later trust claim about manifests and exact contracts.  
**Pedagogy:** Violates worked-example fidelity (Sweller/GRR: models must be accurate).

---

### ISSUE-02 — P0 — Theory `csv_dict.py`: code ≠ output (and type contract conflict)

**Location:** S08-T2-A theory  
**Code** quantizes to `str(Decimal(...))` and returns a **list** via single `print(parse_monto_rows(raw))`.  
**Output** shows two separate lines with **`Decimal('10.50')` objects**, not strings, and not a list repr.  
**Impact:** Students learning “never float; use Decimal” cannot reconcile string serialization policy (later JSON says montos as strings) with this output.  
**Related:** I Do `S08-T2-A-DEMO` has the same class of mismatch (`print(load_csv_monto(raw))` vs line-oriented `C001 10.50 Decimal ...`).

---

### ISSUE-03 — P0 — Theory `quarantine_rows.py`: reason strings and labels ≠ code

**Location:** S08-T2-B theory  
**Code** uses `reason: "col_count"` and returns `(clean, quar)`; print is a single tuple.  
**Output:**
```
good [{'id': 'C001', 'nombre': 'Ana'}]
bad [{'raw': [...], 'reason': 'cols 3!=2'}, ...]
```
**Impact:** Reason vocabulary must be stable for manifest/counter exercises (E3 T2-B expects `col_count`). Conflicting demos teach two dialects.

---

### ISSUE-04 — P0 — Theory `json_ser.py`: phantom second print line

**Code** only `print(dump_rows(data))` → one JSON array string.  
**Output** includes a second line `T1` with no corresponding print.  
**Impact:** Same trust failure; also key order in output (`día` before `id`) may not match `dumps` without `sort_keys`.

---

### ISSUE-05 — P0 — Theory `hash_backup.py`: output shape and `bytes` count ≠ code

**Code** returns one dict and prints it once.  
**Output** multi-line narrative (`sha256 206bcfb...`, `bak exists True`, `provenance {... 'bytes': 19}`).  
Content `"id\nC1\n"` is **6 bytes**, not 19. Hash shown elsewhere for same content is `b776a3a3...` (E3 solution), not `206bcfb...`.  
**Impact:** Fingerprinting lesson is the heart of provenance; wrong bytes/hash destroys the learning objective.

---

### ISSUE-06 — P0 — Theory `manifest.py`: output is a different program

**Code:** `print(json.dumps(build_manifest(sources), ...))` where return is `(sources, totals)`.  
**Output:**
```
reconcile_ok True
[('clients.csv', True), ('transactions.json', True)]
```
Source names in fixture are `tx.json` vs output `transactions.json`.  
**Impact:** Gate closing lesson (reconcile) cannot be “run in the head” against the snippet.

---

### ISSUE-07 — P0 — I Do demos systematically desynced from code

| demoId | Problem |
|--------|---------|
| S08-T1-A-DEMO | Code returns `(exists, text)` of `"cliente;José\n"`; output invents `José Quispe`, `exists True size 21` |
| S08-T1-B-DEMO | Code OK-ish; output has blank line after Ana then `tmp gone True` — code prints only content + tmp gone (extra blank may be from `\\n` in string literal confusion) |
| S08-T2-A-DEMO | List of dicts vs `C001 10.50 Decimal 2026-01-10` lines |
| S08-T2-B-DEMO | Tuple print vs `good`/`quarantine` labels + trailing CSV dump not in code |
| S08-T3-A-DEMO | Code writes array JSON only; output claims JSONL lines too |
| S08-T4-A-DEMO | Returns `(dig[:12], bak.exists())` → should be short prefix + bool; output full 64-char hex + `backup_ok True` |
| S08-T4-B-DEMO | Writes `{"sources": sources}` only; output invents top-level totals, `run_id`, renamed `transactions.json` |

**Impact:** I Do is the “focused instruction” phase of GRR; broken models collapse We Do transfer.  
**Cognitive load:** Students waste working memory reconciling contradictions instead of learning pathlib/csv.

---

### ISSUE-08 — P0 — We Do instruction truncations / garbling

**S08-T1-B-E1 instruction (broken mid-sentence):**
> “…Imprime True para sample Windows y False para solo pathlib, csv, json, open/with (S01–S08).”

Should contrast CRLF True/False for win vs unix samples; template boilerplate ate the sentence.

**Other truncated instructions (non-exhaustive):**
- S08-T2-A-E2 ends: `no requests de S12;.`
- S08-T3-A-E3: `no requests de S12 solo pathlib` (missing punctuation)
- S08-T3-B-E3: `no borres.` (cut off)
- S08-T4-A-E3: `no borres asserts ni.` (cut off)
- S08-T4-B-E2 / E3: end with `no.`

**Impact:** Guided practice becomes unreadable; accessibility failure for self-paced learners; looks like generator meta residue.

---

### ISSUE-09 — P1 — Exercise instruction template spam (cognitive load)

Nearly every E1/E2 repeats the same long block:
> “Concepto: S08-T*-* (Archivos, CSV, JSON e ingesta). Entrada: fixture sintético del starter (`CASO`/ids C00x) en ingesta de archivos. … Conserva el contrato del starter … no pandas de S15, no requests de S12; solo pathlib…”

**Impact:** Intrinsic load of the *task* is drowned by germane-looking but useless *meta constraints* repeated 20+ times. Gold-standard S02 uses shorter, task-focused instructions.  
**Also:** “fixture sintético del starter (`CASO`/ids C00x)” is often **false** — many starters use generic `demo.txt` / `'abc'` / no CASO ids.

---

### ISSUE-10 — P1 — Meta-curriculum leakage in jobRelevance + map

**jobRelevance (user-facing):**
> “Id de plataforma `pandas` se conserva; el contenido V3 es stdlib + contratos de ingesta (pandas EDA se difiere al nivel 2).”

**theory map:**
> “En V3, **S08 no es el path principal de pandas groupby/merge/EDA**. Ese material se reubica al nivel 2 de data.”

**Impact:** Speaks to curriculum maintainers, not learners. Raises anxiety (“did I miss pandas?”) without a clean student-facing scope card. Peer pattern exists in S05–S07 but remains a product smell; S08 is worse because **id and filename still say pandas** while UI title says Archivos & ETL.

---

### ISSUE-11 — P1 — Platform identity split: `id: "pandas"` vs title/file narrative

- URL hash: `#pandas`
- Source file: `s08-pandas.ts`
- UI shortTitle: Archivos & ETL  
- Content: no pandas API

**Impact:** Bookmarks, support chat, and “jump to pandas” mental model all conflict. S15 is the real pandas section (`stdlib-deep` id historically — separate problem). For S08 learners, opening “pandas” and getting pathlib is a first-minute trust hit.

---

### ISSUE-12 — P1 — Atomic write API inconsistency across theory / demo / youDo

- Theory `atomic_write.py`: `tmp = path.with_suffix(path.suffix + ".tmp")` → `clean.csv` → `clean.tmp`  
- I Do T1-B: `path.with_name(path.name + ".tmp")` → `clean.csv.tmp`  
- You Do leaves `write_atomic` as NotImplemented without specifying which convention  

**Impact:** Subtle production bug class (wrong temp sibling). Course should pick **one** contract (`dest.with_name(dest.name + ".tmp")` is usually clearer for multi-dot names).

---

### ISSUE-13 — P1 — JSONL taught in callout but not executed in theory/demo code

Callout T3-A: “Para append-friendly logs de txs: una línea = un json.dumps(row).”  
S08-T3-A-DEMO output fabricates `jsonl lines [...]` without writing JSONL.  
**Impact:** JSONL is a LO-relevant skill (“Serializar/deserializar JSON (array y JSONL)”) without a faithful worked example.

---

### ISSUE-14 — P1 — Starter `print('ok', True)` anti-pattern

Many We Do starters end with:
```python
print('ok', True)
```
while the real task print is wrong/empty. Learners (and any weak autochecker) may treat `ok True` as success.  
**Impact:** Undermines fail-closed culture the section preaches.

---

### ISSUE-15 — P1 — S08-T1-A-E3 starter “DEFECT” vs behavior

Starter reads with `encoding='latin-1'` (always succeeds on arbitrary bytes). Solution uses utf-8 + UnicodeDecodeError. Instruction prose is also messy (“Simula UnicodeDecodeError leyendo bytes latinos como utf-8 strict si es latin-1 content… Mejor: …”).  
**Impact:** Transfer exercise is high-value (encoding quarantine) but poorly staged.

---

### ISSUE-16 — P2 — Theory paragraph boilerplate repetition

Nearly every theory block ends with variants of:
> “Caso sintético: `C00x` / montos PEN — **nunca** PII real ni claims de fraude.”

Plus repeated “Fail-closed si el schema no cuadra; no rellenes en silencio.” and long identical “En ingesta de archivos, el *porqué* es operativo…” sentences in T4-A and T4-B.  
**Impact:** Habituation / banner blindness; S02 achieves safety messaging with less copy-paste.

---

### ISSUE-17 — P2 — Self-check too thin vs LOs and gate

5 questions cover: UTF-8, atomic write, irregular row, reconcile equation, fail-closed.  
**Missing active recall:** JSONL vs array, null vs missing, `newline=''`, Decimal vs float, sha256 of input not clean, per-source vs aggregate reconcile, ensure_ascii.  
**Impact:** 70% unlock may pass without T3/T4 depth; weak spacing for hard concepts.

---

### ISSUE-18 — P2 — You Do excellent but steep integration cliff

You Do starter is well-designed (typed stubs, clear contracts, Decimal, fail exit codes).  
Gap: We Do drills are **micro** (often 3–10 lines); You Do expects a full multi-source ETL. No intermediate “assemble two functions” bridge exercise.  
**Impact:** Classic GRR failure mode — jump from guided micro-skills to independent system without collaborative “you do it together” integration.

---

### ISSUE-19 — P2 — CSV dialect / Excel Latam under-taught relative to claim

Theory mentions `;` vs `,` and “no asumas Excel latam”, but no demo with `delimiter=';'` or `utf-8-sig` BOM (common Excel “CSV UTF-8”). External best practice strongly recommends encoding + newline + dialect explicitness.  
**Impact:** Perú/LATAM workplace transfer incomplete.

---

### ISSUE-20 — P2 — Redaction / tone (español peruano)

- Generally correct Spanish; technical anglicisms (fail-closed, gate, stack, manifest) are acceptable if defined once.  
- “latam” vs “Latam” inconsistency.  
- Telegraphic fragments: “No truncate a medias”, “Cast controlado”, “tmp gone”.  
- jobRelevance “archivos reales de negocio (aunque sean sintéticos)” is slightly paradoxical — clearer: “archivos con forma de negocio, sintéticos en el curso”.  
- Mixed second person (“debes poder”) vs impersonal — minor.

---

### ISSUE-21 — P2 — Learning outcomes vs map intro density

8 solid LOs. Map packs V3 rebrand + gate + stack + data dirs + ethics + topic order into three dense paragraphs — high extrinsic load at section open. S02 opens with a **dictionary** then scope; S08 opens with **curriculum politics** then gate.

---

### ISSUE-22 — P3 — Resources quality

Official docs (pathlib, csv, json, hashlib, os.replace, decimal) are excellent.  
Books: “Data Engineering practices (genérico)” is vague.  
Courses: deeplearning.ai DE specialization is heavy relative to N1 stdlib gate; Real Python / CS50P / MIT better aligned.  
**Impact:** Low; optional polish.

---

### ISSUE-23 — P3 — Self-check question wording

Q2 “Escritura atómica típica es…” — incomplete stem (missing “:” or “cuál de las siguientes”). Options still workable.  
Q5 option “Convertir a pandas automáticamente” is humorous meta-nod to id mismatch — mildly reinforcing the pandas ghost.

---

### ISSUE-24 — P1 — `tests` fields often non-executable strings

Examples: `tests: "True"`, `tests: "Contrato exacto: ok 10.00; reject x..."`, `tests: "conteos por reason"`.  
If the platform uses these for autocheck, many cannot drive real assertions; if human-only, still inconsistent with “contrato exacto” language in stronger E3s (T2-A-E3, T4-B-*).  
**Impact:** Alignment between “pass criteria” and solution `output` is uneven.

---

### ISSUE-25 — P2 — S08-T2-A theory cast keeps reject dict shape inconsistent with clean rows

`out.append({"reject": r.get("id"), "reason": "cast_monto"})` vs quarantine pattern `{raw, reason}` used elsewhere.  
**Impact:** Students may implement three quarantine schemas before You Do.

---

## 4. Meta-Leak Report

Exact learner-facing strings that read as **developer / curriculum-ops notes** rather than student instruction:

| # | Exact / near-exact leaked text | Location |
|---|--------------------------------|----------|
| M1 | `Id de plataforma \`pandas\` se conserva; el contenido V3 es stdlib + contratos de ingesta (pandas EDA se difiere al nivel 2).` | `jobRelevance` |
| M2 | `En V3, **S08 no es el path principal de pandas groupby/merge/EDA**. Ese material se reubica al nivel 2 de data.` | theory map ¶1 |
| M3 | Heading: `De “Pandas EDA” a archivos, CSV/JSON y gate CP-N1-B (mapa)` | theory[0].heading |
| M4 | File/export identity: `s08-pandas.ts`, `id: "pandas"` while titles say Archivos/ETL | module export / section meta |
| M5 | Repeated exercise clause `no pandas de S15, no requests de S12` (scope OK if once; as boilerplate = ops template) | most We Do `instruction`s |
| M6 | Truncation fragments (`no borres.`, `no.`, `False para solo pathlib...`) look like **prompt/template cutoffs**, not intentional pedagogy | We Do instructions |
| M7 | Starter comments `# DEFECT: ...` — acceptable as exercise design **if** framed; still “author voice” | all starters |
| M8 | Identical long provenance sentence copy-pasted in T4-A and T4-B (generator fingerprint) | theory T4 paragraphs |

**Meta-leak count (strict student-harmful):** **6** primary (M1–M6); M7–M8 secondary style.

**Not counted as leaks (OK):**  
- Gate codes CP-N1-B, CASO-LIM-008 as lab case ids.  
- “stdlib only” as stack constraint.  
- Ethical “nunca PII real” (product policy, student-facing).

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 Pre-round principles applied

- **GRR (I Do / We Do / You Do):** Focused modeling → guided practice → independent performance. Success requires accurate I Do models.  
- **Cognitive load:** Reduce extraneous load (template spam, meta V3 talk); manage intrinsic load by progressive disclosure (path → csv → json → provenance).  
- **Data contracts teaching:** Fail-closed, quarantine with reason, reconcile counts, hash inputs — aligns with industry data engineering literacy better than pure syntax tours.  
- **Encoding/CSV practice:** Explicit UTF-8, `newline=''`, dialect awareness match common professional guidance.

### 5.2 What S08 does well

1. **Gate narrative CP-N1-B** connects S05–S07 normalizers + S06 in-memory model into a portfolio ETL — strong roadmap glue.  
2. **Fail-closed + per-source reconcile** (including compensated error case in T4-B-E2/E3) is advanced and correct.  
3. **Decimal for money** continuity from S02 is excellent.  
4. **You Do starter** is professional: `sha256_file`, `write_atomic`, dual loaders, `build_manifest`, `run` exit codes.  
5. **Resources** point at primary stdlib docs.  
6. **Ethics/PII** stance consistent with course public claims.  
7. **I Do coverage matrix** maps 1:1 to 8 subtopics (good graph coverage).

### 5.3 Connective tissue

| Transition | Quality |
|------------|---------|
| S07 text/Unicode → S08 files | Implicit (encoding errors) — could be explicit one sentence |
| T1 → T2 (path → csv) | Adequate |
| T2 → T3 (csv → json) | Adequate |
| T3 → T4 (schema → provenance) | Strong conceptually |
| We Do → You Do | **Weak** (micro → system cliff) |
| S08 → S09 exceptions/logs | Mentioned lightly (UnicodeDecodeError) — OK |

S02-style **section dictionary** is missing. A student glossary (Path, dialect, quarantine, manifest, reconcile, JSONL, provenance, fail-closed) would cut load.

### 5.4 Progressive disclosure

Order T1 Archivos → T2 CSV → T3 JSON → T4 Provenance is correct.  
Problem: **within** each theory block, three dense paragraphs restates gate ethics + stack bans, leaving little space for “why this line exists” narrative on the actual snippet.

### 5.5 I Do / We Do / You Do fidelity

| Phase | Fidelity |
|-------|----------|
| I Do | Structure 9/10; **executable truth 2/10** (outputs) |
| We Do | E1→E2→E3 design 8/10; **instruction integrity 4/10** |
| You Do | Design 8.5/10; scaffold readiness 5/10 |

### 5.6 Comparison to gold-standard early section (S02)

| Aspect | S02 | S08 |
|--------|-----|-----|
| Opening dictionary | Yes | No |
| Code↔output | Generally careful | Frequently broken |
| Instruction length | Task-focused | Template-heavy |
| Meta V3 language | Present but softer | + platform id confession |
| Emotional/clarity tone | Warmer, example-rich | Telegraphic ops manual |
| Capstone alignment | CP-N1-A parser | CP-N1-B ETL (stronger job story if demos work) |

### 5.7 External materials (same topics)

- **CS50P / MIT intro:** simpler file+CSV; less contract rigor than S08 *intent*.  
- **Real Python files:** pathlib pedagogy clearer.  
- **Professional DE blogs:** UTF-8, `newline=''`, BOM/`utf-8-sig`, atomic writes — S08 claims these but under-demos BOM/dialect.  
S08 *could* be best-in-class for “ingestion contracts in stdlib” if demos and instructions are repaired.

### 5.8 Accessibility

- Truncated instructions harm screen-reader and non-native Spanish readers disproportionately.  
- No alt narrative for visual-only UI assumptions (N/A for code-first).  
- Quiz-only assessment path is thin for 18h claim.

### 5.9 Redaction pass notes (ES-PE)

Priority redactions: delete V3/platform-id confessions from student prose; replace with:
> “En esta sección trabajas **solo con la biblioteca estándar** (pathlib, csv, json, hashlib). **pandas** llega en el nivel de datos (S15+). Aquí cierras el gate de **ingesta local CP-N1-B**.”

Normalize quarantine schema to `{raw, reason}` everywhere. Pick one atomic temp naming rule. Align every `output` by literally running snippets in a tempdir policy matching the course.

---

## 6. Proposed GitHub-style Diffs

> **Do not apply in Explorer run.** Fixer owns application. Paths relative to repo root. Diffs are illustrative patches; Fixer should re-verify by executing Python.

### Diff A — jobRelevance + map (meta-leak cleanup) · ISSUE-10, M1–M3

```diff
--- a/src/lib/course/sections/s08-pandas.ts
+++ b/src/lib/course/sections/s08-pandas.ts
@@ jobRelevance
-    "El gate **CP-N1-B** se cierra cuando puedes **ingerir archivos reales de negocio** (aunque sean sintéticos en el curso): CSV de clientes, JSON de transacciones, cuarentena con motivo, hashes, backup y **manifest reconciliado**. En junior data/analytics engineering en Perú esto pesa más que un groupby de demo. Id de plataforma `pandas` se conserva; el contenido V3 es stdlib + contratos de ingesta (pandas EDA se difiere al nivel 2).",
+    "El gate **CP-N1-B** se cierra cuando puedes ingerir **archivos con forma de negocio** (sintéticos en el curso): CSV de clientes, JSON de transacciones, cuarentena con motivo, hashes, backup y **manifest reconciliado**. En junior data/analytics engineering en Perú esto pesa más que un groupby de demo. Aquí usas **solo stdlib** (pathlib, csv, json, hashlib); el análisis tabular con **pandas** llega más adelante en el nivel de datos.",
@@ theory map heading
-      heading: "De “Pandas EDA” a archivos, CSV/JSON y gate CP-N1-B (mapa)",
+      heading: "Mapa de la sección: archivos, CSV/JSON y gate CP-N1-B",
@@ theory map ¶1
-        "En V3, **S08 no es el path principal de pandas groupby/merge/EDA**. Ese material se reubica al nivel 2 de data. Aquí cierras el gate **CP-N1-B**: ingesta **CSV + JSON** con **pathlib**, **cuarentena**, **hashes**, **manifest** y reconciliación de conteos — en **stdlib**.",
+        "En S08 cierras el gate **CP-N1-B**: ingesta **CSV + JSON** con **pathlib**, **cuarentena**, **hashes**, **manifest** y reconciliación de conteos — todo en **stdlib**. No necesitas pandas todavía; ese camino se abre en el bloque de datos intermedio.",
```

### Diff B — Fix theory `path_utf8.py` output · ISSUE-01

```diff
--- a/src/lib/course/sections/s08-pandas.ts
+++ b/src/lib/course/sections/s08-pandas.ts
@@ path_utf8 output
-        output: `True ['línea1', 'josé']
-línea1
-josé
-extra
-`,
+        output: `True ['línea1', 'línea2']
+`,
```

### Diff C — Align `csv_dict.py` code + output (string montos, list print) · ISSUE-02

```diff
--- a/src/lib/course/sections/s08-pandas.ts
+++ b/src/lib/course/sections/s08-pandas.ts
@@ csv_dict output
-        output: `{'id': 'C001', 'nombre': 'Ana', 'monto': Decimal('10.50')}
-{'id': 'C002', 'nombre': 'Luis', 'monto': Decimal('20.00')}`,
+        output: `[{'id': 'C001', 'nombre': 'Ana', 'monto': '10.50'}, {'id': 'C002', 'nombre': 'Luis', 'monto': '20.00'}]`,
```

*(Alternatively change code to print per-row and keep Decimal objects — but then conflict with “serialize as string” LO; prefer string monito + list.)*

### Diff D — Align quarantine theory · ISSUE-03

```diff
-        output: `good [{'id': 'C001', 'nombre': 'Ana'}]
-bad [{'raw': ['C002', 'Luis', 'EXTRA'], 'reason': 'cols 3!=2'}, {'raw': ['C003'], 'reason': 'cols 1!=2'}]`,
+        output: `([{'id': 'C001', 'nombre': 'Ana'}], [{'raw': ['C002', 'Luis', 'EXTRA'], 'reason': 'col_count'}, {'raw': ['C003'], 'reason': 'col_count'}])`,
```

### Diff E — json_ser output · ISSUE-04

```diff
-        output: `[{"día": "2026-01-15", "id": "T1"}]
-T1`,
+        output: `[{"id": "T1", "día": "2026-01-15"}]`,
```
*(Or add `sort_keys=True` in code and match sorted keys.)*

### Diff F — hash_backup: make print match teaching output OR fix output to dict · ISSUE-05

Preferred (minimal): fix output to actual return value of current code (recompute hash after freeze of content). Example shape:

```diff
-        output: `sha256 206bcfbde4f213a5...
-bak exists True
-provenance {'path': 'clients.csv', 'sha256': '206bcfbde4f213a5b89c4d88b9a63d7b9c436b3b7c13db84e63445d1574f7eba', 'bytes': 19}`,
+        output: `{'path': 'clients.csv', 'sha256': '<sha256 of b\"id\\nC1\\n\">', 'bytes': 6, 'bak_ok': True}`,
```

*(Fixer must paste real hex from `hashlib.sha256(b"id\nC1\n").hexdigest()`.)*

### Diff G — manifest theory code+output consistency · ISSUE-06

```diff
 def build_manifest(sources):
     for s in sources:
         s["reconcile_ok"] = s["n_in"] == s["n_clean"] + s["n_quarantine"]
-    totals = {
-        "n_in": sum(s["n_in"] for s in sources),
-        "n_clean": sum(s["n_clean"] for s in sources),
-        "n_quarantine": sum(s["n_quarantine"] for s in sources),
-    }
-    return sources, totals
+    return {
+        "sources": sources,
+        "n_in": sum(s["n_in"] for s in sources),
+        "n_clean": sum(s["n_clean"] for s in sources),
+        "n_quarantine": sum(s["n_quarantine"] for s in sources),
+        "reconcile_ok": all(s["reconcile_ok"] for s in sources),
+    }
 ...
-    {"name": "tx.json", "sha256": "def", "n_in": 2, "n_clean": 2, "n_quarantine": 0},
+    {"name": "transactions.json", "sha256": "def", "n_in": 2, "n_clean": 2, "n_quarantine": 0},
 ...
-print(json.dumps(build_manifest(sources), ensure_ascii=False))`,
-        output: `reconcile_ok True
-[('clients.csv', True), ('transactions.json', True)]`,
+print(json.dumps(build_manifest(sources), ensure_ascii=False, sort_keys=True))`,
+        output: `{"n_clean": 7, "n_in": 8, "n_quarantine": 1, "reconcile_ok": true, "sources": [...]}`,
```

### Diff H — Rebuild all 8 I Do outputs from executed code · ISSUE-07

Pattern for each demo: **either** change `output` to `repr` of actual prints **or** change `code` to produce the narrative output. Recommendation: **prefer simple code; honest output**.

Example T1-A-DEMO:

```diff
-          output: `cliente;José Quispe
-exists True size 21`,
+          output: `(True, 'cliente;José\n')`,
```

Example T3-A-DEMO — add real JSONL or drop JSONL from output:

```diff
+    jl = td / "tx.jsonl"
+    jl.write_text("\n".join(json.dumps(r, ensure_ascii=False) for r in rows) + "\n", encoding="utf-8")
+    return json.loads(p.read_text(encoding="utf-8")), jl.read_text(encoding="utf-8").splitlines()
```

Example T4-B-DEMO — extend `write_manifest` to compute totals + run_id so output is honest.

### Diff I — Repair garbled We Do instructions · ISSUE-08, ISSUE-09

**Template for shortened instructions** (apply across E1/E2):

```diff
-          "E1 (guiado) — Concepto: S08-T1-B (Archivos, CSV, JSON e ingesta). Entrada: fixture sintético del starter (`CASO`/ids C00x) en ingesta de archivos. Tarea: Detecta si un `bytes` sample contiene CRLF `\\r\\n`. Imprime True para sample Windows y False para solo pathlib, csv, json, open/with (S01–S08).",
+          "E1 (guiado) — Detecta CRLF: con samples `win = b'a\\r\\nb\\r\\n'` y `unix = b'a\\nb\\n'`, imprime si cada uno contiene `b'\\r\\n'` (True luego False). Solo stdlib.",
```

**T1-A-E3 cleanup:**

```diff
-          "E3 (transferencia) — Simula UnicodeDecodeError leyendo bytes latinos como utf-8 strict si es latin-1 content… Mejor: escribe bytes no-UTF8 y captura UnicodeDecodeError al read_text utf-8. Imprime tipo de error y sugiere encoding o quarantine.",
+          "E3 (transferencia) — Escribe bytes no válidos en UTF-8 (`write_bytes`), intenta `read_text(encoding='utf-8')`, captura `UnicodeDecodeError`, imprime el nombre de la excepción y una acción (cuarentenar o reintentar con encoding documentado).",
```

Remove trailing cutoffs on T3-B-E3, T4-A-E3, T4-B-E2/E3 similarly.

### Diff J — Remove starter success lies · ISSUE-14

```diff
-print(p.exists())
-print('ok', True)`,
+print(p.exists())`,
```
Apply to all We Do starters that print unconditional `ok True`.

### Diff K — Unify `write_atomic` · ISSUE-12

```diff
-    tmp = path.with_suffix(path.suffix + ".tmp")
+    tmp = path.with_name(path.name + ".tmp")
```
in theory `atomic_write.py`, matching I Do and documenting the same rule in You Do docstring.

### Diff L — Expand selfCheck · ISSUE-17

Add 3–5 items (JSONL, null vs missing, Decimal not float, hash of input, per-source reconcile). Example:

```diff
+      {
+        question: "En el manifest de ingesta, el sha256 debe calcularse sobre…",
+        options: [
+          "El archivo clean final",
+          "El archivo de entrada crudo",
+          "Solo el header CSV",
+          "La suma de n_clean",
+        ],
+        correctIndex: 1,
+        explanation: "La provenance fija el input; si el crudo cambia, el hash cambia.",
+      },
```

### Diff M — Optional platform id (product decision) · ISSUE-11

```diff
-  id: "pandas",
+  id: "files-ingest", // BREAKING for saved progress / URLs — only with migration plan
```

**Explorer recommendation:** do **not** rename id without a migration note in Graph Memory; instead fix **student-facing** copy (Diff A) and leave hash stable unless product owns redirect `#pandas` → new id.

### Diff N — Quarantine schema consistency · ISSUE-25

In `csv_dict` reject branch:

```diff
-            out.append({"reject": r.get("id"), "reason": "cast_monto"})
+            out.append({"raw": dict(r), "reason": "cast_monto"})
```

### Diff O — Theory map callout student-facing · ISSUE-21

```diff
       callout: {
         type: "info",
         title: "Gate CP-N1-B",
         content:
-          "Al finalizar S08 debes poder demostrar ETL local con clean/quarantine/manifest. CLI instalable se difiere a S10. Sin PII real ni claims de fraude/parentesco.",
+          "Al finalizar S08 demuestras un ETL local: clean + quarantine + manifest reconciliado. El CLI instalable llega en S10. Solo datos sintéticos; sin PII real ni claims de fraude o parentesco.",
       },
```

---

## 7. Recommended Priority Order for Fixing

| Priority | Issues | Rationale |
|----------|--------|-----------|
| **1. P0 demos** | 01–07 | Broken worked examples destroy GRR |
| **2. P0/P1 instructions** | 08, 09, 14, 15 | We Do unusable / misleading |
| **3. P1 meta + identity copy** | 10, 11 (copy only), M1–M6 | Trust + reduced anxiety |
| **4. P1 contracts** | 12, 13, 25 | One atomic rule; real JSONL; one quarantine shape |
| **5. P2 pedagogy polish** | 16, 17, 18, 19, 20, 21, 24 | Boilerplate, quiz, bridge exercise, dialect/BOM |
| **6. P3** | 22, 23 | Resources + minor quiz wording |
| **7. Product** | id rename | Only with progress/URL migration |

**Suggested Fixer batches**
1. Batch A: Execute-and-sync all theory + I Do `code`/`output`.  
2. Batch B: Rewrite We Do instructions (short) + strip `print('ok', True)`.  
3. Batch C: Meta-leak redaction + schema/atomic/JSONL consistency.  
4. Batch D: Quiz expansion + optional “mini-integration” We Do before You Do.

**Acceptance criteria for “S08 fixed”**
- [ ] Every theory/I Do snippet’s `output` matches a real run.  
- [ ] No truncated exercise instructions.  
- [ ] No student-facing “Id de plataforma pandas” / “En V3… reubica”.  
- [ ] Single `write_atomic` convention documented.  
- [ ] Self-check ≥ 8 items covering T1–T4.  
- [ ] You Do still closes CP-N1-B with reconcile fail-closed.

---

## 8. Graph Memory Update notes

```yaml
section: 8
id: pandas
file: src/lib/course/sections/s08-pandas.ts
title: Archivos, CSV, JSON y contratos de ingesta
explorer_score: 5.5
status: explorer_complete
gate: CP-N1-B
stack: [pathlib, csv, json, hashlib, shutil, decimal]
depends_on: [S05-normalizers, S06-in-memory-model, S07-unicode-text]
feeds: [S09-exceptions-logs, S10-cli-packaging]
identity_debt:
  - platform_id_pandas_vs_files_etl
  - filename_s08-pandas_ts
quality_edges:
  - broken_code_output_edges: [T1-A, T2-A, T2-B, T3-A, T4-A, T4-B, most_iDo]
  - meta_leak_nodes: [jobRelevance, theory_map, exercise_template]
  - strong_nodes: [youDo_etl_starter, T4_reconcile_per_source, decimal_money_continuity]
  - weak_nodes: [jsonl_demo, weDo_to_youDo_bridge, selfCheck_coverage]
issue_count: 25
meta_leak_count: 6
p0_count: 8
fixer_entry: |
  Start with execute-and-sync of all outputs; then instruction truncation;
  then strip V3/platform meta from student prose without renaming id unless product migrates.
comparison:
  vs_S02: weaker narrative and demo fidelity; stronger job-gate story if fixed
  vs_external_CS50P: deeper contracts; worse snippet reliability currently
shared_pattern_with_S05_S07: "En V3..." map openers + legacy id retained
```

**Nodes for shared context files (if maintainers append):**
- `S08.identity.pandas_hash` → content files-etl  
- `S08.gate.CP-N1-B` → clean/quarantine/manifest  
- `S08.defect.class` → code≠output epidemic  
- `S08.instruction.class` → truncated generator boilerplate  

---

## Appendix A — Structure inventory (evidence)

| Block | Count | Notes |
|-------|-------|-------|
| theory headings | 9 | 1 map + 8 subtopics |
| iDo.steps | 8 | one per subtopic |
| weDo.steps | 24 | E1/E2/E3 × 8 |
| youDo | 1 project | CP-N1-B ETL |
| selfCheck.questions | 5 | thin |
| resources.docs | 6 | strong |
| learningOutcomes | 8 | aligned to T1–T4 |

## Appendix B — Live site note

Home curriculum card for Sección 8 shows **Archivos & ETL** / pathlib-CSV-JSON-cuarentena-manifest, confirming public branding matches title—not pandas EDA. Deep section body is client-rendered from the same TS module; Explorer grounding is therefore the source file plus curriculum card, not a separate CMS.

---

This is the complete Explorer report for Section 8. Ready for the Fixer prompt.
