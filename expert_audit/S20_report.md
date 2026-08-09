# PyArcana — Section 20 Curriculum Audit Report

**Section under audit:** S20 — "Automatización robusta de Excel" (shortTitle "Excel factory")
**Source file:** `src/lib/course/sections/s20-rag.ts` (1,856 lines, ~83 KB)
**Live URL hash:** `https://pillb.github.io/pyarcana/#rag` (derived from `id: "rag"`)
**Phase 1 / Competente** · 18 h · gate **CP-N2-B** · Prerrequisitos S17–S19 · Cierra hacia S21
**Auditor:** Curriculum Auditor (general-purpose) · STORM + Graph/Loop/Harness Engineering
**Companion artefacts:** `/home/z/my-project/audits/tmp_s20/{prose.json, prose.txt, records.json, verify.py, extract.py, metrics.py}`

---

## 1. Section Identification & Scope

### 1.1 Confirmed identity
- `src/lib/course/index.ts` line 22 imports `section20` from `./sections/s20-rag`; line 74 places it in the Phase 1 array slot 20 (after `section19`, before `section21`).
- Section metadata (`s20-rag.ts:3-13`):
  ```ts
  id: "rag",
  index: 20,
  title: "Automatización robusta de Excel",
  shortTitle: "Excel factory",
  tagline: "adaptador que lee los formatos sintéticos del VP, produce un workbook
            de resultados sin dañar la plantilla y deja manifest de cambios",
  estimatedHours: 18,
  level: "Competente",
  phase: 1,
  ```
- **The actual content is openpyxl-based Excel automation (sheets, formulas vs materialized values, styles, merges, reconciliation, batch, idempotency, manifest).** There is **no RAG / retrieval / embedding / LLM content** anywhere in `s20-rag.ts`.
- Roadmap consistency:
  - `learning_roadmap_52_V3.md:338-348` describes S20 as "Automatización robusta de Excel" with T1 Workbooks / T2 Formato / T3 Análisis / T4 Operación — **matches the source**.
  - `el_arte_de_python_roadmap_maestro_52_secciones.md:200-205` (V2 master) still lists S20 as "Advanced Pandas & Time Series" — **stale**, but not shipped to learners.

### 1.2 Scope audited
- **Theory:** 8 theory blocks (T1-A sheets/celdas/encabezados, T1-B fórmulas vs valores, T2-A estilos/plantillas, T2-B fechas/merges, T3-A conciliación/pivots, T3-B validación, T4-A batch, T4-B idempotencia/manifest). 24 paragraphs of prose + 8 code snippets + 8 callouts.
- **I Do:** intro + 8 demos (`S20-T1-A-DEMO` … `S20-T4-B-DEMO`) with `code` + `output` + `why`.
- **We Do:** intro + 24 exercises (3 per subtopic: guided / independent / transfer) with `instruction`, `hint`, `hints`, `edgeCases`, `tests`, `feedback`, `starterCode`, `solutionCode` (+ output).
- **You Do:** capstone "Excel factory CP-N2-B" — `context`, 6 `objectives`, 6 `requirements`, full ~95-line `starterCode`, `portfolioNote`, 6-criterion `rubric`.
- **Self Check:** 8 MCQs with `question`, 4 `options` each, `correctIndex`, `explanation`.
- **Resources:** 7 doc links, 2 books, 7 course links.
- **Interactive playground demo** keyed by `'rag'` in `src/components/course/SectionView.tsx:1786-1837` (rendered on the S20 page because `sectionId === "rag"`).
- All 8 theory code blocks, all 8 I-Do demos, and 12 representative We-Do solutions were **executed locally** to verify code↔output integrity (see §3).

---

## 2. Executive Summary of Quality

**Composite score: 5.0 / 10** (would rise to **8.0–8.5** after P0 + P1 fixes).

### Verdict
Pedagogically the section is **strongly designed** (faithful I Do / We Do / You Do scaffold, 8×3 = 24 exercises with starter-defect/solution/output, capstone skeleton, 8-Q self-check, backward refs to S17–S19 and forward to S21, healthy Peruvian Spanish readability). **However, the section is currently unshippable** because of three compounding defect classes:

1. **CRITICAL meta-leak / identity crisis (P0).** The filename `s20-rag.ts`, the section `id: "rag"`, the live URL hash `#rag`, and — worst of all — the interactive `Pruébalo tú mismo` playground demo (keyed by `'rag'` in `SectionView.tsx:1786`) all surface **RAG / retrieval-augmented-generation content** (Jaccard similarity, vector store simulation, LLM-context mock) on a page whose actual content is **openpyxl Excel automation**. A learner landing on `#rag` sees the Excel Theory tab… and a playground that has nothing to do with Excel. This is the highest-impact defect of the section.

2. **CRITICAL fabricated outputs (P0).** Twelve code↔output pairs (theory + I Do + We Do) are **fabricated or drifted**: the printed `output` does not match what the displayed `code` actually produces. Verified by executing every snippet locally. The root cause is systemic pseudonymization drift — a late pass renamed `Sucursal-Norte/Sur/Centro`, `Oficina-Este/Oeste`, `Cliente-A/B` inconsistently across `instruction` / `hint` / `hints` / `starterCode` / `solutionCode` / `output`, leaving every surface with a different name. This is the **same defect class flagged in S04, S08, and S12**; S20 is the most affected section observed so far.

3. **MEDIUM Spanish redaction polish (P1).** Readability is healthy (mean FH 75.9 "bastante fácil", mean WPS 9.6, median 7.0, mean INFLESZ 71.4 "normal") with only one real run-on (We Do intro, 47 w). Real grammar findings are minor: missing inverted `¿` in 1 prose sentence, one missing closing `)` mid-sentence, several anglicisms used without Spanish gloss (`factory`, `master`, `manifest`, `workbook`, `sheetnames`, `header`, `merge`, `batch`, `backup`, `gate`, `KPIs`, `CI`, `fail-closed`, `fail-fast`, `share`, `ops team`). No genuine meta-text developer leaks in the prose.

### Score breakdown
| Dimension | Score | Notes |
|---|---|---|
| Pedagogical structure (I Do / We Do / You Do) | 9 / 10 | Faithful 8×3 = 24 exercise scaffold; capstone skeleton; 8-Q self-check |
| Connective tissue & narrative flow | 8 / 10 | Strong backward (S17–S19) / forward (S21, CP-N2-B) refs; one factory-thread runs through every tab |
| Cognitive load / progressive disclosure | 8 / 10 | T1→T4 ordering is sound; only We Do intro is borderline (47 w) |
| Exercise & exam alignment | 7 / 10 | Good intent, but 12 broken code↔output pairs crater trust in the We Do |
| Spanish grammar & redaction | 7 / 10 | Healthy readability; minor anglicism/typography polish |
| Meta-leak posture | 2 / 10 | P0: RAG demo + `id:"rag"` + URL `#rag` + filename `s20-rag.ts` all contradict Excel content |
| Code correctness / output integrity | 2 / 10 | 12 fabricated/drifted outputs verified by local execution |
| Comparison with best-in-class external materials | 7 / 10 | Solid openpyxl coverage comparable to Real Python + Zumstein, but batch/manifest content is thinner |
| **Composite (weighted)** | **5.0 / 10** | Two P0 defect classes drag an otherwise excellent section down |

---

## 3. Detailed Issue Registry

Each issue below is verified. Code snippets were executed locally with `openpyxl 3.1.5`, `pandas 2.2.x`, Python 3.11 to confirm actual outputs.

### P0 — Critical (blocks learning or ships wrong content)

#### Issue 1 — Interactive playground demo teaches RAG on the Excel-automation page
- **Severity:** P0 (meta-leak + identity crisis + learner confusion)
- **Location:** `src/components/course/SectionView.tsx:1786-1837` (key `'rag'` in `demos` map; rendered via `const demo = demos[sectionId]` at line 4046).
- **Evidence:** The S20 page renders a `Pruébalo tú mismo` editor whose title is `'Practica retrieval y similitud (simulado)'` and whose code is:
  ```python
  # Simulacion de RAG: retrieval por similitud de texto
  def jaccard_similarity(text1, text2): ...
  documentos = [{"id": 1, "texto": "Python es un lenguaje de programacion interpretado"}, ...]
  def retrieve(query, docs, top_k=3): ...
  ```
  None of this has any connection to openpyxl, sheets, formulas, merges, reconciliation, batch, manifest, or any other S20 topic. The learner who clicks `Pruébalo tú mismo` on the S20 page is shown an off-syllabus RAG toy.
- **Pedagogical impact:** Catastrophic for learner trust. The interactive surface is the most engaging part of a PyArcana page; if it contradicts the section's own Theory / I Do / We Do, the learner concludes the section is broken or that they themselves are missing something. Also: the demo's expected output (`[16.7%] #2: Pandas…`) is computed off `set(text1.lower().split())` over a 5-doc store — accurate, but irrelevant.
- **Spanish orthography defects inside the leaked demo:** `Simulacion` → `Simulación`; `libreria` → `librería`; `analisis` → `análisis`; `computacion` → `computación`; `programacion` → `programación`; `Anade` → `Añade`; `anos` → `años` (this last one is in the *previous* demo `s19` at line 1780, not in the `rag` block, but it confirms the same author habit of dropping accents in demos).
- **Fix:** Replace the `'rag'` demo block with an openpyxl-safe Pyodide demo (e.g. build `Entrada` + `Salida` sheets, write a materialized total, print `sheetnames`). **OR** (cleaner) rename the section `id` from `"rag"` to `"excel-factory"` (or `"excel-automation"`) and add a matching demo key — see Issue 2.

#### Issue 2 — Section `id: "rag"`, filename `s20-rag.ts`, live URL `#rag` all contradict content
- **Severity:** P0 (structural meta-leak, systemic with S04/S05/S06/S07/S11/S12)
- **Evidence:** `s20-rag.ts:4` `id: "rag"`; filename is `s20-rag.ts`; the live SPA routes to `https://pillb.github.io/pyarcana/#rag`. The section teaches openpyxl/Excel automation. There is no RAG content anywhere in the section file.
- **Pedagogical impact:** URL hash is visible in the browser address bar and is what learners share/bookmark. A learner sharing `#rag` with a peer to refer them to "the Excel factory section" creates immediate confusion. The filename is developer-facing but a leak risk if the repo is browsed.
- **Fix:** Rename file to `s20-excel-factory.ts`, change `id` to `"excel-factory"`, update `src/lib/course/index.ts:22` import + filename, update `src/components/course/SectionView.tsx` demos map key from `'rag'` to `'excel-factory'` (and rewrite the demo — Issue 1). Coordinate with the orchestrator: the URL hash changes from `#rag` to `#excel-factory`, so any external links to the live site must be updated.

#### Issue 3 — Theory T3-A `reconcile.py` output is fabricated (region-name drift)
- **Severity:** P0 (code↔output mismatch; learner cannot trust the displayed snippet)
- **Location:** `s20-rag.ts:208-224`.
- **Code (line 214):**
  ```python
  det = pd.DataFrame({"region": ["Sucursal-Sur", "Sucursal-Centro", "Cusco"], "monto": [10.0, 5.0, 7.0]})
  ```
- **Displayed `output` (line 222):**
  ```
  {'region': ['Cusco', 'Oficina-Este'], 'monto': [7.0, 15.0]}
  ```
- **Actual output (executed):**
  ```
  {'region': ['Cusco', 'Sucursal-Centro', 'Sucursal-Sur'], 'monto': [7.0, 5.0, 10.0]}
  ```
- **Root cause:** The displayed output renames `Sucursal-Sur`+`Sucursal-Centro` (which sum to 15.0) to `Oficina-Este` (which does not exist in the code). The drift is a leftover from a pseudonymization pass that renamed regions inconsistently across prose / code / output.
- **Pedagogical impact:** A learner who copies the snippet and runs it gets a different result from the displayed `output`. They lose trust in the section and may waste 10–30 min debugging "what did I do wrong?".

#### Issue 4 — Theory T3-B `structure.py` output is fabricated (`domain_ok True` should be `False`)
- **Severity:** P0 (fabricated output AND wrong pedagogy — the entire point of the snippet is that `Cliente-B` is NOT in the allowlist)
- **Location:** `s20-rag.ts:240-255`.
- **Code (lines 248-250):**
  ```python
  regiones = {"Cliente-A", "Arequipa", "Cusco"}
  row = {"region": "Cliente-B", "monto": 10.0}
  print("domain_ok", row["region"] in regiones)
  ```
- **Displayed `output` (line 254):** `domain_ok True`
- **Actual output (executed):** `domain_ok False` — because `"Cliente-B"` is not in `{"Cliente-A", "Arequipa", "Cusco"}`.
- **Pedagogical impact:** The Theory paragraph at line 238 explicitly says "Región 'Piura' fuera de allowlist → abort". The displayed `True` actively teaches the **opposite** of the section's fail-fast policy. Catastrophic for the gate concept.

#### Issue 5 — I Do `S20-T1-A-DEMO` output says `Sucursal-Sur`, code writes `Sucursal-Norte`
- **Severity:** P0
- **Location:** `s20-rag.ts:364-375`.
- **Code (line 363):** `ws.append(["Sucursal-Norte", 28.0])`
- **Displayed output (line 375):** `A2 Sucursal-Sur`
- **Actual output:** `A2 Sucursal-Norte`
- **Pedagogical impact:** First I-Do demo, sets the tone for the section — broken on first contact.

#### Issue 6 — I Do `S20-T2-B-DEMO` output fabricates region names
- **Severity:** P0
- **Location:** `s20-rag.ts:470-478`.
- **Code (line 470):** `ws["B1"] = "Cobertura: Oficina-Este|Arequipa|Oficina-Oeste"`
- **Displayed output (line 477):** `anchor Cobertura: Cliente-A|Arequipa|Cliente-B`
- **Actual output:** `anchor Cobertura: Oficina-Este|Arequipa|Oficina-Oeste`
- **Pedagogical impact:** Adds to the learner's confusion about which region-name vocabulary is canonical.

#### Issue 7 — I Do `S20-T3-A-DEMO` output is fabricated (4 regions collapsed to 3 + renames)
- **Severity:** P0
- **Location:** `s20-rag.ts:490-504`.
- **Code (lines 493-496):**
  ```python
  det = pd.DataFrame({
      "region": ["Sucursal-Norte", "Sucursal-Sur", "Arequipa", "Sucursal-Centro"],
      "monto": [10.0, 12.0, 8.0, 5.5],
  })
  ```
- **Displayed output (line 503):** `{'Oficina-Este': 8.0, 'Oficina-Oeste': 5.5, 'Cliente-A': 22.0}`
- **Actual output (executed):** `{'Arequipa': 8.0, 'Sucursal-Centro': 5.5, 'Sucursal-Norte': 10.0, 'Sucursal-Sur': 12.0}`
- **Root cause:** Three region renames (`Arequipa→Oficina-Este`, `Sucursal-Centro→Oficina-Oeste`, `Sucursal-Norte+Sucursal-Sur→Cliente-A`) AND a row-count collapse from 4 to 3. This is the most egregious fabricated output in the section.

#### Issue 8 — I Do `S20-T3-B-DEMO` output omits one violator
- **Severity:** P0
- **Location:** `s20-rag.ts:516-532`.
- **Code (lines 519-523):**
  ```python
  allowed = {"Cliente-B", "Sucursal-Norte", "Sucursal-Sur"}
  rows = [
      {"region": "Sucursal-Centro", "monto": 1.0, "n": 1},
      {"region": "Piura", "monto": 1.0, "n": 1},
  ]
  bad = [r for r in rows if r["region"] not in allowed]
  print("bad_regions", [r["region"] for r in bad])
  ```
- **Displayed output (line 531):** `bad_regions ['Piura']`
- **Actual output (executed):** `bad_regions ['Sucursal-Centro', 'Piura']` — because `Sucursal-Centro` is also not in `allowed`.
- **Pedagogical impact:** The demo's `why` text (line 534) says "Fail fast en headers y dominios preserva la estructura contractual del VP antes de materializar Salida." Showing only one of two violators teaches the wrong behavior — the learner would conclude that only one region was rejected.

#### Issue 9 — I Do `S20-T4-B-DEMO` `sha1_8` hash is fabricated
- **Severity:** P0
- **Location:** `s20-rag.ts:583-601`.
- **Code (lines 591-592):** `rows = [("Oficina-Este", 10), ("Oficina-Oeste", 5)]`
- **Displayed output (line 601):** `{"sha1_8": "3e819052", "idempotent": true, ...}`
- **Actual output (executed):** `{"sha1_8": "b66014c3", "idempotent": true, "backup": "results.prev.xlsx", "tests": {"has_header": true, "n_data": 2}}`
- **Pedagogical impact:** The `manifest` concept is the gate-closing artifact for CP-N2-B. A learner who hashes the displayed input and gets `b66014c3` will conclude either their hash is wrong or the section is wrong. Either way trust collapses.

#### Issue 10 — We Do `S20-T2-A-E3` is internally incoherent (5 different region names across 5 surfaces) AND output is fabricated
- **Severity:** P0
- **Location:** `s20-rag.ts:902-972`.
- **Surfaces and the region name each uses:**
  | Surface | Region name used |
  |---|---|
  | `instruction` ("escribe `Sucursal-Sur` en A2") | `Sucursal-Sur` |
  | `instruction` ("A2 de la copia es `Sucursal-Centro`") | `Sucursal-Centro` (note: **self-contradictory within the same instruction** — write one, check for another) |
  | `hint` ("master.exists() and A2==\"Oficina-Este\"") | `Oficina-Este` |
  | `starterCode` comment ("escribe A2=\"Oficina-Oeste\"") | `Oficina-Oeste` |
  | `starterCode` check (`wb["Entrada"]["A2"].value == "Cliente-A"`) | `Cliente-A` |
  | `solutionCode` (`wb["Entrada"]["A2"] = "Cliente-B"`) | `Cliente-B` |
  | `solutionCode` check (`... == "Sucursal-Norte"`) | `Sucursal-Norte` |
  | `solutionCode` `output` | `True` |
- **Actual output of `solutionCode`:** `False` (because `Cliente-B` ≠ `Sucursal-Norte`). The displayed `True` is fabricated.
- **Pedagogical impact:** This is the most damaging We Do exercise in the section. Even a perfect learner cannot satisfy the contract because the contract itself is broken. The exercise teaches the *concept* of `copy → load → write → save` and `master_intact`, but every check uses a different region name, so the boolean always evaluates to `False`.

#### Issue 11 — We Do `S20-T3-A-E2` output is fabricated
- **Severity:** P0
- **Location:** `s20-rag.ts:1130-1160`.
- **`instruction` (line 1134):** `Con el DataFrame Sucursal-Sur/Sucursal-Centro/Oficina-Este y montos 10, 5, 7`
- **`starterCode` (line 1149):** `["Sucursal-Norte", "Sucursal-Sur", "Sucursal-Centro"]` with `[10.0, 5.0, 7.0]`
- **`solutionCode` (line 1156):** `["Oficina-Este", "Oficina-Oeste", "Cliente-A"]` with `[10.0, 5.0, 7.0]`
- **Displayed `output` (line 1158):** `{'Cliente-B': 7.0, 'Sucursal-Norte': 15.0}`
- **Actual output of `solutionCode` (executed):** `{'Cliente-A': 7.0, 'Oficina-Este': 10.0, 'Oficina-Oeste': 5.0}`
- **Pedagogical impact:** Three different region vocabularies in three surfaces + fabricated output. The exercise's `feedback` (line 1142) references `Cliente-B` and `Sucursal-Norte` — neither appears in the solution code. Cognitive load explodes.

#### Issue 12 — We Do `S20-T3-B-E2` output is fabricated
- **Severity:** P0
- **Location:** `s20-rag.ts:1237-1278`.
- **`instruction` (line 1242):** `A2='Sucursal-Sur' y A3='Piura'`, `allowed = {"Sucursal-Centro", "Oficina-Este"}`
- **`starterCode` (lines 1259-1261):** `A2 = "Cliente-B"; A3 = "Sucursal-Norte"`, `allowed = {"Sucursal-Sur", "Sucursal-Centro"}`
- **`solutionCode` (lines 1271-1273):** `A2 = "Oficina-Este"; A3 = "Oficina-Oeste"`, `allowed = {"Cliente-A", "Cliente-B"}`
- **Displayed `output` (line 1276):** `['Sucursal-Norte']`
- **Actual output of `solutionCode` (executed):** `['Oficina-Este', 'Oficina-Oeste']` (both are violators because neither is in `{"Cliente-A", "Cliente-B"}`)
- **Pedagogical impact:** Output count mismatch (1 vs 2 violators) + region-name drift across all three surfaces.

#### Issue 13 — We Do `S20-T3-B-E3` output is fabricated
- **Severity:** P0
- **Location:** `s20-rag.ts:1279-1310`.
- **`instruction` (line 1284):** `Llama con Sucursal-Sur e Ica`
- **`starterCode` (line 1300):** `validate_rows([{"region": "Oficina-Oeste"}, {"region": "Ica"}], {"Cliente-A", "Cliente-B"})`
- **`solutionCode` (line 1307):** `validate_rows([{"region": "Sucursal-Norte"}, {"region": "Ica"}], {"Sucursal-Sur", "Sucursal-Centro"})`
- **Displayed `output` (line 1308):** `['Ica']`
- **Actual output of `solutionCode` (executed):** `['Sucursal-Norte', 'Ica']` (because `Sucursal-Norte` is not in `{"Sucursal-Sur", "Sucursal-Centro"}`)
- **Pedagogical impact:** Same pattern. The `feedback` (line 1292) references `Sucursal-Centro` and `Oficina-Este` — neither matches the solution's data.

#### Issue 14 — We Do `S20-T4-B-E2` output is fabricated
- **Severity:** P0
- **Location:** `s20-rag.ts:1511-1548`.
- **`instruction` (line 1516):** `dig of (Oficina-Este,1)+(Oficina-Oeste,2) is equal to the inverted list`
- **`starterCode` (line 1535):** `dig([("Cliente-A", 1), ("Cliente-B", 2)]) == dig([("Sucursal-Norte", 2), ("Sucursal-Sur", 1)])`
- **`solutionCode` (line 1545):** `dig([("Sucursal-Centro", 1), ("Oficina-Este", 2)]) == dig([("Oficina-Oeste", 2), ("Cliente-A", 1)])`
- **Displayed `output` (line 1546):** `True`
- **Actual output of `solutionCode` (executed):** `False` — because the two lists contain **completely different elements** (`Sucursal-Centro`, `Oficina-Este` vs `Oficina-Oeste`, `Cliente-A`); sorting cannot make them equal.
- **Pedagogical impact:** The whole point of the exercise is to demonstrate that **sorted hashing** makes a list equal to its reverse. The displayed `True` would only be correct if both lists contained the same elements in different order. They don't. The concept being taught is undermined by the data.

### P1 — High (grammar / redaction polish)

#### Issue 15 — One missing closing `)` and one missing `¿` in Theory T2-B paragraph
- **Severity:** P1
- **Location:** `s20-rag.ts:168` (paragraph 1 of T2-B).
- **Evidence:** `"…para parsear "03/04/24" (¿marzo o abril?). Las celdas combinadas…"` — the opening `(` is never closed (the `?` closes the question but not the parenthesis). The intended reading is `(¿marzo o abril?)`.
- **Actual:** `(¿marzo o abril?).` — the closing `)` is missing. The `¿?` pair is present and correct.
- **Pedagogical impact:** Minor punctuation slip; flagged by LanguageTool `UNPAIRED_BRACKETS` heuristic.

#### Issue 16 — We Do intro is a 47-word run-on
- **Severity:** P1 (long but pedagogically necessary list)
- **Location:** `s20-rag.ts:608`.
- **Evidence:** `"24 ejercicios en cascada guiado → independiente → transferencia. Cada uno completa un eslabón del factory: hojas y headers (T1-A), fórmulas vs materialización (T1-B), estilos y plantilla copy→save (T2-A), fechas/merges (T2-B), conciliación y pivots (T3-A), validación estructural (T3-B), batch con excepciones (T4-A), backup/idempotencia/manifest (T4-B). Cuando termines, el You Do une todos los eslabones sin dañar el master."`
- **Sentence 2 metrics:** 47 words, FH 40.2, INFLESZ 33.9 ("difícil"). The 8-item enumeration could be reformatted as a markdown list to drop the cognitive load to "normal".
- **Pedagogical impact:** Borderline. The enumeration is pedagogically valuable (it maps each subtopic to its T-label). Recommend reformatting as a list, not shortening.

#### Issue 17 — JobRelevance first paragraph is 4 sentences averaging 38 w (FH 56.3)
- **Severity:** P1 (long but acceptable)
- **Location:** `s20-rag.ts:15`.
- **Evidence:** Sentence 2: "Un analista o data engineer que automatiza plantillas con **openpyxl** — sin dañar el master, con totales que cuadran y un **manifest** (JSON de auditoría de la corrida) — es quien cierra el mes a tiempo en bancos, cajas y retailers." — 39 w, FH 10.1.
- **Pedagogical impact:** Sentence 2 is dense because it nests two em-dash clauses. Acceptable for an adult technical reader; if a lighter rewrite is desired, split at "es quien cierra".

#### Issue 18 — Multiple anglicisms used in prose without Spanish gloss
- **Severity:** P1 (consistency / glossary)
- **Location:** Throughout, but concentrated in `jobRelevance`, theory paragraphs, and `iDo.intro` / `weDo.intro`.
- **Evidence (representative sample):**
  - `factory` (used as a loanword, e.g. "excel factory", "reporting factory") — no Spanish gloss; "fábrica" is uncommon but "factoría" is a possible alternative.
  - `master` ("Plantilla master") — could be glossed as "plantilla maestra".
  - `manifest` (used throughout, never glossed as "manifiesto") — note: the JSON file is `manifest.json` so the English term is also a filename; recommend keeping English for the filename but glossing as "manifiesto (JSON de auditoría)" on first mention (already done once at line 15: "**manifest** (JSON de auditoría de la corrida)").
  - `workbook` ("workbook de resultados") — could be glossed "libro de Excel".
  - `sheet(s)`, `sheetnames` — API identifiers, OK to keep in code; in prose consider "hoja(s)" / "nombres de hoja".
  - `header(s)` — used both as code identifier and as prose noun; recommend "encabezado(s)" in prose.
  - `merge` / `merges` — used as both code and prose; "celda combinada" / "combinación" already appears.
  - `batch` — "lote" already used in `feedback`; consider standardizing on `lote` in prose and `batch` only in code.
  - `backup` — "copia de respaldo" or "respaldo" is the natural Spanish; recommend glossing on first mention.
  - `gate` / `quality gate` — "puerta de calidad" or "control de calidad" is the Spanish equivalent.
  - `KPI(s)` — sigla; acceptable as is.
  - `CI` — sigla; on first mention should be glossed "integración continua (CI)".
  - `fail-closed`, `fail-fast` — already explained inline as "no emitas el paquete" / "aborta con mensaje claro". Recommend keeping English term + Spanish gloss.
  - `share` ("En un share de finanzas") — anglicism; recommend "carpeta compartida" or "unidad de red".
  - `ops team` ("u ops team peruano") — anglicism; recommend "equipo de operaciones".
  - `portada` — Spanish, but used in the Excel-specific sense ("cover sheet") — fine.
  - `padre` — used in S06; not relevant here.
  - `data engineer` — partial anglicism; recommend keeping as is (common loanword in Peruvian tech Spanish) or "ingeniero de datos".
  - `data note`, `data frame` — minor.
  - `pipeline` — "flujo" or "tubería" or keep as loanword.
  - `reporting`, `reporting factory`, `reporting package` — loanwords; acceptable in Peruvian finance Spanish.
- **Pedagogical impact:** Mixed. Many of these are legitimate bilingual technical voice (openpyxl's API is English). The ones that most warrant glossing are: `master`, `manifest`, `workbook`, `backup`, `share`, `ops team`. The section already glosses `manifest` once at line 15 — recommend extending that pattern.

#### Issue 19 — Two `.` after `readthedocs` etc. (URL fragment false positives, not real prose)
- **Severity:** L (extractor artifact, not a real defect)
- **Location:** Resources list, e.g. `https://openpyxl.readthedocs.io/`.
- **Note:** The extractor flagged `readthedocs.` as a missing-terminal-punct fragment. These are URL hostnames, not prose sentences. No fix needed.

### P2 — Medium (consistency / typography)

#### Issue 20 — Voseo absence is correct (Peruvian Spanish = tuteo); but inconsistent `tú` vs `usted` register
- **Severity:** L
- **Location:** Throughout.
- **Evidence:** 0 voseo imperatives detected (no `leé/anticipá/contrastá/usás/validá`). Tuteo is correct for Peruvian Spanish. However, the section mixes:
  - `tú` imperatives: "fíjate", "renombra", "escribe", "imprime", "completa"
  - `usted` register in some `feedback`: "Si imprime" / "Si sale 0"
- **Pedagogical impact:** Minor register inconsistency. Standardize on `tú` throughout (the prevailing form).

#### Issue 21 — `Idempotencia significa:` style question stems lack inverted `¿`
- **Severity:** L (acceptable in MCQ form)
- **Location:** `selfCheck.questions` (lines 1713, 1720, 1726, 1733, 1740, 1747, 1754, 1761).
- **Evidence:** Six of eight self-check questions are statement-stem MCQs ending in `:` (e.g. "Idempotencia significa:"). One question (Q5, line 1740) uses the interrogative form `¿Cuál es la política correcta?` correctly.
- **Pedagogical impact:** Acceptable in Spanish MCQ design — colon-stem questions don't require `¿`. No fix needed; flagged for consistency review.

#### Issue 22 — `vs` without period
- **Severity:** L (typography)
- **Location:** Throughout, e.g. `s20-rag.ts:79` "Fórmulas vs valores materializados".
- **Evidence:** ~12 occurrences of `vs` (no period). RAE recommends `vs.` (abbreviation). Already flagged as a systemic issue in S08.
- **Pedagogical impact:** Negligible.

#### Issue 23 — `Copy→save`, `copy→load→write→save` use the wrong arrow glyph
- **Severity:** L (typography)
- **Location:** `s20-rag.ts:113` (heading "Estilos, plantillas y copy→save"), `:118`, `:452`, `:608`, etc.
- **Evidence:** The `→` U+2192 arrow is used to denote a sequence of operations ("copy→load→write→save"). This is a stylistic choice; the same glyph is used in the learning-outcomes map at line 33. Consistent within the section. No fix needed; flagged for cross-section review.

#### Issue 24 — `n` characters in some `instruction` fields
- **Severity:** L (escape artifact)
- **Location:** Several We Do instructions, e.g. line 615: `"Salida esperada (dos líneas):\n['Entrada']\nregion"`.
- **Evidence:** The `\n` is a literal escape sequence in the source string, intended to render as a newline. In the live SPA these render correctly. Flagged only because the extractor shows them as `n` literal — not a real defect.

#### Issue 25 — Theory T1-B sentence 2 has long em-dash nesting
- **Severity:** L (readability)
- **Location:** `s20-rag.ts:82`.
- **Evidence:** "openpyxl, sin motor Excel, no "resuelve" una fórmula recién escrita solo porque la leas con `data_only=True` en el mismo proceso: esa bandera lee el cache guardado, no ejecuta el motor." — 38 w, FH 52.3.
- **Pedagogical impact:** Acceptable for adult technical readers; flagged for readability review.

### P3 — Low (style nits)

#### Issue 26 — "u ops team peruano" — anglicism
- **Severity:** L
- **Location:** `s20-rag.ts:48`.
- **Evidence:** `"En un banco u ops team peruano, el primer bug típico es…"`
- **Pedagogical impact:** Minor. Recommend `"En un banco o equipo de operaciones peruano"` — note the `u → o` revert if you change `ops team` to a vowel-starting Spanish phrase.

#### Issue 27 — "share de finanzas" — anglicism
- **Severity:** L
- **Location:** `s20-rag.ts:269`.
- **Evidence:** `"En un share de finanzas, el archivo "abierto por el contador" (lock)…"`
- **Pedagogical impact:** Recommend `"En una carpeta compartida de finanzas"` or `"En una unidad de red de finanzas"`.

#### Issue 28 — "data engineer" without gloss
- **Severity:** L
- **Location:** `s20-rag.ts:15`.
- **Evidence:** `"Un analista o data engineer que automatiza plantillas…"`
- **Pedagogical impact:** Acceptable loanword in Peruvian tech Spanish; flag for glossary coverage.

#### Issue 29 — `"u ops team"` triggers the `u` vs `o` rule incorrectly when `ops` is read as starting with `o`
- **Severity:** L (not actually wrong)
- **Location:** `s20-rag.ts:48`.
- **Note:** `u` is correct before `o` when the next word starts with `o` sound — `ops` does start with `o`. So `u ops team` is grammatically correct **only because** `ops` is pronounced with an `o` onset. If you translate `ops team` to `equipo de operaciones`, revert to `o equipo de operaciones`.

#### Issue 30 — `CASO-LIM-020` tags visible inside `starterCode` comments
- **Severity:** L (borderline meta-leak; subplan excludes starterCode from prose scope)
- **Location:** Every We Do `starterCode`, e.g. `s20-rag.ts:627` `# CASO-LIM-020 · sheet title + A1`.
- **Evidence:** 24 occurrences of `CASO-LIM-020` inside `starterCode` Python comments. These are visible to learners in the editor. They reference an internal taxonomy.
- **Pedagogical impact:** Borderline. The subplan excludes `starterCode` from prose scope, so this is logged for visibility but not scored as a P0. Recommend stripping or replacing with `# Ejercicio S20-T1-A-E1` for learner-facing clarity. Same pattern as S04/S08/S10/S11/S12.

#### Issue 31 — `S20-T1-A` subtopic IDs visible in `subtopicId` fields (not in prose)
- **Severity:** L (structural; not rendered as prose)
- **Location:** `s20-rag.ts:44, 80, 114, 166, 202, 233, 265, 311` (theory `subtopicId`), and inside `id: "S20-T1-A-E1"` etc. (We Do exercise IDs).
- **Pedagogical impact:** These are TS structural identifiers; the SPA does not render them as prose. No fix needed; flagged for cross-section consistency.

#### Issue 32 — `when the I Do te muestre` Spanglish construction
- **Severity:** L
- **Location:** `s20-rag.ts:48`.
- **Evidence:** `"Cuando el I Do te muestre `sheetnames`, fíjate que el orden y los nombres son parte del contrato"`
- **Pedagogical impact:** "el I Do" uses the English label as a Spanish noun phrase. The course's UI labels for these tabs are "Hago yo" / "Hacemos juntos" / "Tú haces". Recommend: "Cuando la pestaña *Hago yo* te muestre `sheetnames`".

---

## 4. Meta-Leak Report

### 4.1 Critical meta-leak (P0)

**Leak 1 — Off-syllabus RAG interactive demo**
- **Exact leaked text:** (displayed in the live `Pruébalo tú mismo` editor on the S20 page)
  ```
  # Simulacion de RAG: retrieval por similitud de texto
  # (Sin embeddings reales - usamos Jaccard similarity)
  def jaccard_similarity(text1, text2): ...
  documentos = [
      {"id": 1, "texto": "Python es un lenguaje de programacion interpretado"},
      ...
  ]
  query = "como analizo datos con Python"
  resultados = retrieve(query, documentos, top_k=3)
  ```
- **Location:** `src/components/course/SectionView.tsx:1786-1837` (key `'rag'`).
- **Why this is a meta-leak:** The section was retargeted from RAG to Excel automation; the interactive demo key (`'rag'`) was not updated. The demo now teaches content from a *future* RAG/LLM section (S28 `llm-agents` or similar), surfacing it on the wrong page.
- **Spanish orthography defects inside the leak:** `Simulacion` (→ `Simulación`), `libreria` (→ `librería`), `analisis` (→ `análisis`), `computacion` (→ `computación`), `programacion` (→ `programación`). All confirm a pattern of dropped accents in Pyodide demo code (also visible in the `s19` demo at line 1780 `anos`).

**Leak 2 — Section identity meta-leak**
- **Exact leaked text:** the URL hash `#rag`, the filename `s20-rag.ts`, and the TS `id: "rag"`.
- **Location:** `s20-rag.ts:4`; live URL bar.
- **Why this is a meta-leak:** Same scope-shift residue as S04 (`functions-modules` → iteration), S05 (`oop` → functions), S06 (`numpy` → collections), S07 (`data-acquisition` → Unicode + regex), S08 (`pandas` → CSV/JSON ingesta), S10 (`sklearn` → packaging), S11 (`testing` → OOP), S12 (`performance` → APIs/SQL/geo). Pattern is **systemic** across the early-twenties retargeting wave.

### 4.2 Borderline / structural leaks (not scored as P0)

- `CASO-LIM-020` tags inside `starterCode` Python comments (24×). Visible to learners in the editor. Recommend stripping (Issue 30).
- `S20-T1-A` subtopic IDs in `subtopicId` TS fields (not rendered as prose — informational only).
- `V2` master roadmap still describes S20 as "Advanced Pandas & Time Series" (file `el_arte_de_python_roadmap_maestro_52_secciones.md:200-205`). **Not shipped to learners**, but a developer-browse leak.

### 4.3 What was checked and NOT found
- No `TODO`, `FIXME`, `XXX`, `HACK` in learner-facing prose.
- No "moved from section X" or "moved to" residue.
- No "V3 retarget" or "never surface" developer comments in prose.
- No AI-to-developer authoring residue.
- No `weDo`/`youDo` camelCase leaks in prose (the UI uses "Hacemos juntos" / "Tú haces").

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do fidelity — Score 9/10

The section executes the I Do / We Do / You Do scaffold **exemplarily**:

- **I Do (8 demos, 1 per subtopic):** Each demo has `demoId`, `subtopicId`, `environment: "local-python"`, `description`, `code`, `output`, `why`. The `why` field is uniformly strong — it explains the *business* reason, not just the technical mechanic. Examples:
  - `S20-T1-A-DEMO.why` (line 377): "Mapa de hojas estable (Entrada/Salida) es el primer contrato del adaptador: sin nombres canónicos, el resto del factory no sabe dónde leer ni dónde materializar."
  - `S20-T3-A-DEMO.why` (line 506): "Conciliación es el control de calidad del workbook de resultados: totales y n deben cuadrar antes de emitir el paquete."
- **We Do (24 exercises = 8 subtopics × 3 kinds):** Each exercise has `id` (`S20-T*-E1/E2/E3`), `kind` (`guided`/`independent`/`transfer`), `instruction`, `hint`, `hints` (2-element array), `edgeCases`, `tests`, `feedback`, `starterCode`, `solutionCode` (+ output). The progression `guided → independent → transfer` is consistent and pedagogically sound.
  - The `feedback` field is uniformly specific (e.g. line 623: "Si ves ['Sheet'] (o similar), te faltó renombrar a Entrada. Si A1 es None, te faltó el encabezado region — sin él el factory no puede anclar lecturas.")
  - The `edgeCases` field lists realistic edge cases per exercise.
- **You Do (capstone CP-N2-B):** Full ~95-line `starterCode` skeleton with `headers_ok`, `materialize_salida`, `reconcile` stubs + COMPLETAR markers. 6 `objectives`, 6 `requirements`, 6-criterion `rubric` with weights summing to 100%. `portfolioNote` references S19 dashboard + S21 packaging.

### 5.2 Connective tissue — Score 8/10

- **Backward refs:** S17 (packaging) → S18 (data engineering) → S19 (databases/ORM) → S20 (Excel factory). The section explicitly cites "prerequisitos S17-S19" in Theory T1-A paragraph 4 (line 33), references "el dashboard de S19" in T1-A paragraph 3 (line 48) and You Do (line 1700).
- **Forward refs:** S21 (FastAPI / documents) appears 4× as "el paquete de reportes de S21" or "hacia S21" — establishing that S20's manifest + workbook is the input to S21.
- **Capstone gate:** CP-N2-B is named explicitly in `jobRelevance` (line 15), Theory T1-A callout (line 39), T1-B paragraph 3 (line 84), T4-A callout (line 305), T4-B paragraph 3 (line 315), T4-B callout (line 341), You Do title (line 1584), You Do context (line 1586), portfolioNote (line 1700). Strong spine.
- **One weakness:** the `S20-T*` subtopic IDs are visible inside `instruction` prose (e.g. "hojas y headers (T1-A)" at line 608). Internal taxonomy bleed — acceptable because T1-A maps directly to the learner-visible Theory heading, but consider stripping.

### 5.3 Cognitive load and progressive disclosure — Score 8/10

- **Theory ordering:** T1 (Modelo de libro) → T2 (Presentación) → T3 (Calidad) → T4 (Operación) is sound: simple read/write first, then formatting, then validation, then batch/manifest.
- **Dictionary callout** (line 31) front-loads all key terms (`Plantilla master`, `Celda ancla`, `Valor materializado`, `Conciliación`, `Fail-closed`, `Manifest`, `Idempotencia`, `Cuarentena`) — good progressive disclosure pattern.
- **Per-subtopic structure** is uniform: 3 paragraphs (concept → contrato → caso) + code + callout. Predictable rhythm lowers cognitive load.
- **We Do difficulty progression** is real: E1 is "fill in one line", E2 is "write the function body", E3 is "transfer to a new context". This is the gold standard scaffold.
- **You Do** builds on every T-piece practiced in We Do — "Este You Do ensambla lo que practicaste en pedazos en el We Do" (line 1586).

### 5.4 Cognitive load — weaknesses

- We Do intro (line 608) is 47 w in sentence 2 — borderline. Reformat the 8-item enumeration as a markdown list.
- JobRelevance (line 15) is dense (FH 10.1 for sentence 2). Adult technical audience; acceptable.
- Theory T2-A paragraph 1 (line 116) nests two em-dash clauses. Borderline.

### 5.5 Comparison with best-in-class external materials

| Source | Topic coverage | Comparison |
|---|---|---|
| Real Python — `openpyxl` guide | load/save, styles, formulas, charts | S20 covers the same surface + adds reconciliation, batch, manifest (production concerns RP doesn't cover) |
| Automate the Boring Stuff (Sweigart) — Excel chapters | reading, writing, styles, formulas | S20 is more disciplined about "materialize values, don't depend on Excel engine" — a stronger production stance |
| Python for Excel (Zumstein) | openpyxl + xlwings patterns | S20 covers openpyxl only; Zumstein's xlwings coverage is not needed for headless CI |
| ECMA-376 / OOXML | standard | S20 references it in Resources (line 1798) but doesn't dive in — appropriate for the level |
| Pandas docs | `groupby`, `sum` | S20 uses pandas for reconciliation/pivot; doesn't teach pandas (correctly — that's S08's job) |

**Net:** S20 is comparable to or stronger than Real Python / Zumstein on the production-engineering axis (manifest, idempotency, fail-closed, batch with corrupt/lock handling). Weaker on chart coverage (explicitly deferred to S19 PNG output, which is a sensible call).

### 5.6 Spanish redaction quality

- **Mean FH 75.9** ("bastante fácil") — healthy for a Phase-1 technical section.
- **Median WPS 7.0** — excellent sentence segmentation.
- **Mean INFLESZ 71.4** ("normal") — appropriate.
- **Only 1 real run-on** (We Do intro, 47 w). All other >32-w sentences are enumeration-style and pedagogically justified.
- **0 voseo** (correct for Peruvian Spanish).
- **0 missing `¿`** in actual prose (the extractor false-positives were code-adjacent fragments).
- **0 missing inverted `¡`**.
- **0 duplicated words** (`de de`, `la la`, etc.).
- **0 genuine spelling errors** (verified by manual review of the worst-FH sentences).
- **Minor anglicism load** (Issue 18) — consistent with the bilingual technical voice of the course.

---

## 6. Grammatical Improvements & Rewriting Report (paragraph-by-paragraph)

This section applies the grammar subplan heuristics (Fernández-Huerta, INFLESZ, WPS, SPW) to **every paragraph of learner-facing Spanish prose** in each tab, with before/after rewrites. Only paragraphs with real findings are rewritten; clean paragraphs are summarized.

### 6.1 Theory tab

#### Theory T1-A — "Excel factory: de la plantilla al manifest (mapa)"

**Paragraph 1 (line 30):** "Esta sección es **automatización robusta de Excel** con openpyxl: un reporting factory que manipula hojas, celdas, fórmulas vs valores, estilos, conciliación, validación estructural, batch e idempotencia. El objetivo no es "hacer un xlsx bonito", sino entregar un artefacto auditable que un VP de finanzas u operaciones pueda abrir mañana sin sorpresas."
- Metrics: 2 sentences, 22 + 26 = 48 words total. FH ≈ 70. Healthy.
- Finding: None. Clean.
- **No rewrite needed.**

**Paragraph 2 — "Diccionario de la sección" (line 31):**
- One long sentence (65 w, FH ≈ 35) that defines 8 terms via `**Term:**` gloss pattern.
- Finding: Long but acceptable for a "dictionary" callout. The `**Term:**` pattern provides visual segmentation that compensates for sentence length.
- **Suggested rewrite (split into 2 sentences for readability):**
  > **Before:** "**Diccionario de la sección** (léelo una vez; el resto lo usa). **Plantilla master:** xlsx de referencia que no se sobrescribe. **Celda ancla:** esquina superior izquierda de un merge (ahí vive el valor). **Valor materializado:** número ya calculado en Python y escrito a la celda (no dependes de Excel para evaluarlo). **Conciliación:** comparar totales/n del Excel de salida vs el DataFrame fuente. **Fail-closed:** si la conciliación falla, no emites el paquete. **Manifest:** JSON con estados de batch, `reconcile_ok`, backup e hashes. **Idempotencia:** misma entrada + misma versión de script → mismo resultado lógico (sin filas fantasma). **Cuarentena:** aislar un archivo corrupto sin tumbar el lote."
  >
  > **After:** "**Diccionario de la sección** (léelo una vez; el resto lo usa). **Plantilla master:** xlsx de referencia que no se sobrescribe. **Celda ancla:** esquina superior izquierda de un merge (ahí vive el valor). **Valor materializado:** número ya calculado en Python y escrito a la celda (no dependes de Excel para evaluarlo). **Conciliación:** comparar totales y n del Excel de salida contra el DataFrame fuente. **Fail-closed:** si la conciliación falla, no emites el paquete. **Manifest:** JSON con estados de batch, `reconcile_ok`, backup y hashes. **Idempotencia:** misma entrada más misma versión de script implica mismo resultado lógico (sin filas fantasma). **Cuarentena:** aislar un archivo corrupto sin tumbar el lote."
  - Changes: `totales/n` → `totales y n` (slash-as-conjunction is anglicism); `vs` → `contra` (Spanish); `e hashes` → `y hashes` (the `e` form is incorrect because `hashes` starts with a non-aspirated `h` sound in Spanish — `e` is used only before words starting with `i`/`hi` sound; "hashes" is pronounced with a strong `h`-sound in Spanish, so `y` is correct); `+` → `más` (cleaner Spanish); `→` → `implica` for clarity.
  - **Wait:** actually `e hashes` is a real grammar error. `e` is the form of `y` used before words starting with `i`/`hi` *sound*. "Hashes" in Spanish is pronounced with the `h` (English loan), so it starts with an `h`-sound, not `i`. Therefore `y hashes` is correct, not `e hashes`. **This is a real P1 grammar finding.**

**Paragraph 3 — "Hilo del caso" (line 32):** Clean. 3 sentences, ~40 w. No rewrite.

**Paragraph 4 — "Orden de aprendizaje" (line 33):** 1 long sentence (39 w, FH 10.1) using `→` arrows for sequence. Acceptable for a learning-outcomes map. No rewrite.

#### Theory T1-A callout (line 38-39):
- "Salida esperada: workbook de resultados + manifest (estados, conciliación, backup). La plantilla master no se sobrescribe. Datos solo sintéticos. Hojas canónicas: Entrada, Datos, Salida."
- Clean. No rewrite.

#### Theory T1-A — "Sheets, celdas y encabezados estables"

**Paragraph 1 (line 46):** "Un libro de Excel es un grafo de **hojas + celdas + encabezados**. Nombra hojas de forma estable (`Entrada`, `Datos`, `Salida`); evita "Hoja1" en el entregable. Los encabezados de la fila 1 anclan lecturas programáticas (`iter_rows`) y la conciliación posterior. Si el negocio habla de "tablas" o "named ranges", en este tramo usamos el equivalente práctico: headers fijos + sheetnames contractuales — el mismo contrato que un schema de API, solo que el "endpoint" es un archivo que el VP abre en Excel."
- 4 sentences. Sentence 4 is 41 w (FH 52.3) — borderline long.
- Finding: Long but pedagogically justified (it builds the API/file metaphor).
- **Suggested rewrite (split sentence 4):**
  > **Before:** "Si el negocio habla de "tablas" o "named ranges", en este tramo usamos el equivalente práctico: headers fijos + sheetnames contractuales — el mismo contrato que un schema de API, solo que el "endpoint" es un archivo que el VP abre en Excel."
  >
  > **After:** "Si el negocio habla de "tablas" o "named ranges", en este tramo usamos el equivalente práctico: headers fijos y sheetnames contractuales. Es el mismo contrato que un schema de API, solo que el "endpoint" es un archivo que el VP abre en Excel."

**Paragraph 2 (line 47):** 3 sentences, ~50 w. Clean.

**Paragraph 3 (line 48):** Contains "u ops team peruano" anglicism (Issue 26) and "Cuando el I Do te muestre" Spanglish (Issue 32).
- **Suggested rewrite:**
  > **Before:** "Caso sintético Lima: `ws.title='Entrada'`, A1=`region`, B1=`monto`; segunda hoja `Salida`. Los conteos de filas de datos (sin header) alimentan la conciliación con el dashboard de S19 (mismos n). En un banco u ops team peruano, el primer bug típico es renombrar "Entrada" a "Input_v2" y romper tres scripts ajenos. Cuando el I Do te muestre `sheetnames`, fíjate que el orden y los nombres son parte del contrato, no decoración."
  >
  > **After:** "Caso sintético Lima: `ws.title='Entrada'`, A1=`region`, B1=`monto`; segunda hoja `Salida`. Los conteos de filas de datos (sin header) alimentan la conciliación con el dashboard de S19 (mismos n). En un banco o equipo de operaciones peruano, el primer bug típico es renombrar "Entrada" a "Input_v2" y romper tres scripts ajenos. Cuando la pestaña *Hago yo* te muestre `sheetnames`, fíjate que el orden y los nombres son parte del contrato, no decoración."

#### Theory T1-B — "Fórmulas vs valores materializados"

**Paragraph 1 (line 82):** 3 sentences. Sentence 1 is 38 w (FH 52.3) — borderline; sentence 1 also has nested em-dash "openpyxl, sin motor Excel, no…" that compresses 3 ideas into one.
- **Suggested rewrite:**
  > **Before:** "Las **fórmulas** viven en la celda como texto (`=SUM(B2:B10)`); los **valores cacheados** son lo que Excel dejó calculado la última vez que abrió el archivo. openpyxl, sin motor Excel, no "resuelve" una fórmula recién escrita solo porque la leas con `data_only=True` en el mismo proceso: esa bandera lee el cache guardado, no ejecuta el motor. En CI Linux no hay Excel: si tu assert depende de un cache ajeno, el pipeline se vuelve no determinista y el "pasa en mi laptop" regresa."
  >
  > **After:** "Las **fórmulas** viven en la celda como texto (`=SUM(B2:B10)`); los **valores cacheados** son lo que Excel dejó calculado la última vez que abrió el archivo. openpyxl no incluye un motor de Excel: no "resuelve" una fórmula recién escrita solo porque la leas con `data_only=True` en el mismo proceso. Esa bandera lee el cache guardado, no ejecuta el motor. En CI Linux no hay Excel: si tu assert depende de un cache ajeno, el pipeline se vuelve no determinista y el "pasa en mi laptop" regresa."

**Paragraph 2 (line 83):** 3 sentences, ~45 w. Clean.

**Paragraph 3 (line 84):** Sentence 1 is 34 w (FH 48.6) — borderline long.
- **Suggested rewrite:**
  > **Before:** "Caso: celda `=SUM(B2:B10)` vs valor 120 precalculado en Python. El factory de CP-N2-B prefiere materializar métricas ya validadas en pandas y copiar el número a la hoja `Salida` — así S21 recibe un artefacto que no necesita reabrirse en Excel para auditar. Si el VP insiste en ver la fórmula en una celda de presentación, puedes dejarla; pero el gate de calidad del curso y del CI se apoya en el valor Python."
  >
  > **After:** "Caso: celda `=SUM(B2:B10)` contra valor 120 precalculado en Python. El factory de CP-N2-B prefiere materializar métricas ya validadas en pandas y copiar el número a la hoja `Salida`. Así S21 recibe un artefacto que no necesita reabrirse en Excel para auditar. Si el VP insiste en ver la fórmula en una celda de presentación, puedes dejarla; pero el gate de calidad del curso y del CI se apoya en el valor Python."

#### Theory T2-A — "Estilos, plantillas y copy→save"

**Paragraph 1 (line 116):** 2 sentences. Sentence 2 is 34 w (FH 73.3).
- Finding: Long but acceptable.
- **No rewrite needed.**

**Paragraph 2 (line 117):** 4 sentences, ~50 w. Clean.

**Paragraph 3 (line 118):** 3 sentences, ~40 w. Clean. Note: "lo repites tú" uses the `tú` register correctly.

#### Theory T2-B — "Fechas ISO, celdas combinadas y lectura segura"

**Paragraph 1 (line 168):** 3 sentences. **Missing closing `)` after `(¿marzo o abril?`** (Issue 15).
- **Suggested rewrite:**
  > **Before:** "Fechas y locales: serializa fechas **ISO** (`YYYY-MM-DD`) o `datetime` documentado; no dependas del locale del SO del alumno para parsear "03/04/24" (¿marzo o abril?. Las celdas combinadas (**merges**) son trampas de lectura automatizada: el valor vive en la **celda ancla** (top-left del rango); las demás del merge leen `None`. Si el script necesita escribir y la hoja está bloqueada por el SO o por otro usuario, falla con mensaje claro al manifest — no silencies el error."
  >
  > **After:** "Fechas y locales: serializa fechas **ISO** (`YYYY-MM-DD`) o `datetime` documentado; no dependas del locale del SO del alumno para parsear "03/04/24" (¿marzo o abril?). Las celdas combinadas (**merges**) son trampas de lectura automatizada: el valor vive en la **celda ancla** (top-left del rango); las demás del merge leen `None`. Si el script necesita escribir y la hoja está bloqueada por el SO o por otro usuario, falla con mensaje claro al manifest — no silencies el error."

**Paragraph 2 (line 169):** 3 sentences. Clean.

**Paragraph 3 (line 170):** 2 sentences. Clean.

#### Theory T3-A — "Conciliación y pivots lógicos"

**Paragraph 1 (line 204):** 3 sentences, ~45 w. Sentence 3 is 30 w. Clean.

**Paragraph 2 (line 205):** 4 short sentences. Clean.

**Paragraph 3 (line 206):** 2 sentences. Contains "Sucursal-Norte 15, Cusco 7" — but the *code* at line 214 uses `Sucursal-Sur`+`Sucursal-Centro` for the 15.0 sum, not `Sucursal-Norte`. This is the **pseudonymization drift** (Issue 3) surfacing in prose too.
- **Suggested rewrite (after fixing the code drift):**
  > **Before:** "Caso: df montos 10+5+7 vs portada 22.0; pivot región→suma (`Sucursal-Norte` 15, `Cusco` 7). El gate imprime `reconcile True` solo si ambos lados coinciden. En ops peruanas, este control evita enviar a gerencia un Excel con portada inflada y detalle incompleto — el error típico de "sumé a mano en la portada y olvidé una región"."
  >
  > **After:** "Caso: df montos 10+5+7 contra portada 22.0; pivot región→suma (`Sucursal-Sur` 10, `Sucursal-Centro` 5, `Cusco` 7). El gate imprime `reconcile True` solo si ambos lados coinciden. En ops peruanas, este control evita enviar a gerencia un Excel con portada inflada y detalle incompleto — el error típico de "sumé a mano en la portada y olvidé una región"."

#### Theory T3-B — "Reglas de validación y preservación de estructura"

**Paragraph 1 (line 236):** 2 sentences. Clean.

**Paragraph 2 (line 237):** 3 sentences. Clean.

**Paragraph 3 (line 238):** 3 sentences. Contains "Oficina-Oeste" team reference (anglicism "ops team" pattern).
- **Suggested rewrite:**
  > **Before:** "Caso sintético: el contrato exige `need = {'Entrada','Salida'}`. Si falta `Salida`, `structural_ok` es False y **no** se genera el zip del reporting package hacia S21. Región "Piura" fuera de allowlist → abort con lista de violators en el manifest, no un email vago. En un equipo de ops en Oficina-Oeste, este fail-fast evita rehacer el paquete a las 23:00 porque alguien renombró una hoja "para que se entienda mejor"."
  >
  > **After:** "Caso sintético: el contrato exige `need = {'Entrada','Salida'}`. Si falta `Salida`, `structural_ok` es False y **no** se genera el zip del reporting package hacia S21. Región "Piura" fuera de allowlist → abort con lista de violators en el manifest, no un email vago. En un equipo de operaciones, este fail-fast evita rehacer el paquete a las 23:00 porque alguien renombró una hoja "para que se entienda mejor"."

#### Theory T4-A — "Batch, archivos corruptos y locks"

**Paragraph 1 (line 267):** 1 sentence, 33 w (FH 53.2). Borderline long.
- Finding: Long but the `BadZipFile — un xlsx es un zip; si el contenedor está roto, openpyxl no puede abrirlo` parenthetical is pedagogically valuable.
- **No rewrite needed.**

**Paragraph 2 (line 268):** 3 short sentences. Clean.

**Paragraph 3 (line 269):** Contains "share de finanzas" anglicism (Issue 27).
- **Suggested rewrite:**
  > **Before:** "Caso didáctico: tres paths → `ok=1`, `corrupt=1`, `locked=1`. En un share de finanzas, el archivo "abierto por el contador" (lock) no debe tumbar el lote de la noche: se marca `locked`, se registra el path sintético y el resto del batch sigue. El corrupt se mueve a cuarentena con su nombre en el log; el auditor mira primero el `ok_count` del summary."
  >
  > **After:** "Caso didáctico: tres paths → `ok=1`, `corrupt=1`, `locked=1`. En una carpeta compartida de finanzas, el archivo "abierto por el contador" (lock) no debe tumbar el lote de la noche: se marca `locked`, se registra el path sintético y el resto del batch sigue. El corrupt se mueve a cuarentena con su nombre en el log; el auditor mira primero el `ok_count` del summary."

#### Theory T4-B — "Backups, idempotencia y pruebas estructurales"

**Paragraph 1 (line 313):** 2 sentences. Clean.

**Paragraph 2 (line 314):** 3 short sentences. Clean.

**Paragraph 3 (line 315):** 3 sentences. Contains "Cierra el tramo Excel hacia documentos y empaquetado de S21 con un manifest que el revisor de CP-N2-B pueda abrir en 30 segundos." — clean.

### 6.2 I Do tab

**Intro (line 346):** "Te demuestro el excel factory de punta a punta: sheets canónicos Entrada/Salida, fórmulas vs valores materializados en Python, plantilla intocable (copy→load→save), fechas y merges, conciliación fail-closed, batch con BadZipFile/locks, y manifest de auditoría. Observa el patrón; en We Do lo repites a pedazos; en You Do lo ensamblas."
- Sentence 1: 38 w, FH 33.9. Long but it's a single enumeration of all 8 demo topics — pedagogically justified.
- **No rewrite needed.** (Optional split: end sentence 1 at "fail-closed" and start "Luego batch con BadZipFile/locks, y manifest de auditoría.")

**Demo descriptions (lines 352, 383, 412, 458, 486, 512, 540, 579):** All clean, concise (≤15 w each).

**Demo `why` fields (lines 377, 406, 452, 480, 506, 534, 573, 603):** All clean, strong business-justification voice.

### 6.3 We Do tab

**Intro (line 608):** Issue 16 — 47-word sentence 2.
- **Suggested rewrite (reformat enumeration as markdown list):**
  > **Before:** "24 ejercicios en cascada guiado → independiente → transferencia. Cada uno completa un eslabón del factory: hojas y headers (T1-A), fórmulas vs materialización (T1-B), estilos y plantilla copy→save (T2-A), fechas/merges (T2-B), conciliación y pivots (T3-A), validación estructural (T3-B), batch con excepciones (T4-A), backup/idempotencia/manifest (T4-B). Cuando termines, el You Do une todos los eslabones sin dañar el master."
  >
  > **After:** "24 ejercicios en cascada guiado → independiente → transferencia. Cada uno completa un eslabón del factory:\n\n- **T1-A** Hojas y headers\n- **T1-B** Fórmulas contra materialización\n- **T2-A** Estilos y plantilla copy→save\n- **T2-B** Fechas y merges\n- **T3-A** Conciliación y pivots\n- **T3-B** Validación estructural\n- **T4-A** Batch con excepciones\n- **T4-B** Backup, idempotencia y manifest\n\nCuando termines, el You Do une todos los eslabones sin dañar el master."

**Exercise instructions, hints, feedback (24 exercises × ~5 prose fields = 120 strings):**
- All 24 instructions follow the same pattern: "E1/E2/E3 (kind) — Concepto: X. Crea Y. Imprime Z. Salida esperada:\n<expected_output>". Clean Spanish.
- All 24 `feedback` fields are specific and corrective (e.g. "Si imprime ['Sheet'] (o similar), te faltó renombrar a Entrada…"). Clean.
- The grammar is uniformly good. The **only** redaction issue is the pseudonymization drift (Issues 10–14) which is a *content* defect, not a grammar defect.

### 6.4 You Do tab

**Title (line 1584):** "Excel factory CP-N2-B" — clean.

**Context (line 1586):** "El VP de operaciones en Cliente-B entrega plantillas sintéticas y espera un workbook de resultados auditable. Tu adaptador (excel factory de CP-N2-B) debe copiar la plantilla master sin dañarla, materializar KPIs en `Salida`, conciliar totales con tolerancia documentada (0.01 PEN) y dejar un **manifest** JSON de la corrida. Si la conciliación falla, **fail-closed**: no emitas el paquete hacia S21. Este You Do ensambla lo que practicaste en pedazos en el We Do."
- 4 sentences. Sentence 2 is 35 w. Clean.
- **No rewrite needed.**

**Objectives (lines 1587-1594):** 6 objectives, all ≤12 w. Clean.

**Requirements (lines 1595-1602):** 6 requirements. Notable: "Datos sintéticos only — sin PII real en celdas ni paths" mixes English "only" with Spanish. Recommend: "Solo datos sintéticos — sin PII real en celdas ni paths".

**PortfolioNote (line 1700):** "Checklist de entrega: (1) results.xlsx con Entrada + Salida materializada, (2) manifest.json con reconcile_ok y input_sha1_8, (3) master de plantilla intacto, (4) nota de re-run idempotente. Enlaza al dashboard de S19 y al paquete de reportes de S21." — clean.

**Rubric criteria (6 items, lines 1702-1707):** All clean. Weights sum to 100%.

### 6.5 Self Check tab

**Q1 (line 1713):** "openpyxl sin Excel instalado evalúa fórmulas automáticamente:" — statement stem, no `¿` needed. Options + explanation clean.

**Q2 (line 1720):** "Al escribir en celdas combinadas debes:" — clean.

**Q3 (line 1726):** "Un manifest del excel factory debe permitir auditar:" — clean.

**Q4 (line 1733):** "Idempotencia significa:" — clean.

**Q5 (line 1740):** "Al materializar un Excel de salida del reporting factory, la suma de montos en la hoja no cuadra con el DataFrame fuente. ¿Cuál es la política correcta?" — Uses `¿Cuál?` correctly. Clean.

**Q6 (line 1747):** "Para no dañar la plantilla master, el patrón correcto es:" — clean.

**Q7 (line 1754):** "En un batch, un xlsx con contenedor roto suele disparar:" — clean.

**Q8 (line 1761):** "structural_ok(sheetnames, need) debe devolver True cuando:" — code-heavy stem, no `¿` needed. Clean.

**Explanations (8):** All 1-3 sentences, all grammatically clean, all pedagogically corrective. Excellent quality.

### 6.6 Resources tab

7 doc links, 2 books, 7 course links. Notes are concise (≤12 w). Clean.

---

## 7. Proposed GitHub-Style Diffs

All diffs are ready-to-apply; do NOT apply in this audit pass.

### Diff D-01 — Replace off-syllabus RAG demo with openpyxl demo (P0, Issue 1)

**File:** `src/components/course/SectionView.tsx`
**Lines:** 1786-1837

```diff
-    'rag': {
-      title: 'Practica retrieval y similitud (simulado)',
-      code: `# Simulacion de RAG: retrieval por similitud de texto
-# (Sin embeddings reales - usamos Jaccard similarity)
-
-def jaccard_similarity(text1, text2):
-    """Similitud de Jaccard entre dos textos.
-    Usa conjuntos de palabras: |interseccion| / |union|.
-    """
-    words1 = set(text1.lower().split())
-    words2 = set(text2.lower().split())
-    intersection = words1 & words2
-    union = words1 | words2
-    return len(intersection) / len(union) if union else 0
-
-# Base de conocimiento (simulando vector store)
-documentos = [
-    {"id": 1, "texto": "Python es un lenguaje de programacion interpretado"},
-    {"id": 2, "texto": "Pandas es una libreria de Python para analisis de datos"},
-    {"id": 3, "texto": "NumPy permite computacion numerica con arrays"},
-    {"id": 4, "texto": "scikit-learn es para machine learning en Python"},
-    {"id": 5, "texto": "Git es un sistema de control de versiones distribuido"},
-]
-
-def retrieve(query, docs, top_k=3):
-    """Recupera los top_k documentos mas similares al query."""
-    scores = [(d, jaccard_similarity(query, d["texto"])) for d in docs]
-    scores.sort(key=lambda x: x[1], reverse=True)
-    return scores[:top_k]
-
-# Buscar
-query = "como analizo datos con Python"
-resultados = retrieve(query, documentos, top_k=3)
-
-print(f"Query: '{query}'")
-print(f"\\nTop 3 documentos recuperados:")
-for doc, score in resultados:
-    print(f"  [{score:.1%}] #{doc['id']}: {doc['texto']}")
-
-# Generar respuesta (simulando LLM)
-contexto = " ".join([d["texto"] for d, _ in resultados])
-print(f"\\nContexto para LLM: '{contexto[:80]}...'")`,
-      expectedOutput: `Query: 'como analizo datos con Python'
-
-Top 3 documentos recuperados:
-  [16.7%] #2: Pandas es una libreria de Python para analisis de datos
-  [10.0%] #3: NumPy permite computacion numerica con arrays
-  [9.1%] #1: Python es un lenguaje de programacion interpretado
-
-Contexto para LLM: 'Pandas es una libreria de Python para analisis de datos NumPy permite computacio...'`,
-      hint: 'Cambia el query a "que es machine learning" y observa como cambian los resultados',
-    },
+    'excel-factory': {
+      title: 'Practica sheets y materialización (simulado)',
+      code: `# Excel factory: sheets canónicos + valor materializado
+from openpyxl import Workbook
+
+wb = Workbook()
+ws = wb.active
+ws.title = "Entrada"
+ws.append(["region", "monto"])
+ws.append(["Lima", 10.0])
+ws.append(["Cusco", 5.0])
+
+sal = wb.create_sheet("Salida")
+det_sum = sum(r[1] for r in ws.iter_rows(min_row=2, max_col=2, values_only=True))
+sal["A1"] = "total_monto"
+sal["B1"] = det_sum  # valor materializado en Python
+sal["A2"] = "n_filas"
+sal["B2"] = ws.max_row - 1
+
+print(wb.sheetnames)
+print("total", sal["B1"].value)
+print("n", sal["B2"].value)`,
+      expectedOutput: `['Entrada', 'Salida']
+total 15.0
+n 2`,
+      hint: 'Agrega una fila con Arequipa y 7.0; re-ejecuta y observa cómo total y n cambian',
+    },
```

### Diff D-02 — Rename section id, file, and import (P0, Issue 2)

**File 1:** `src/lib/course/sections/s20-rag.ts` → rename to `src/lib/course/sections/s20-excel-factory.ts`

```diff
-  id: "rag",
+  id: "excel-factory",
   index: 20,
   title: "Automatización robusta de Excel",
```

**File 2:** `src/lib/course/index.ts:22`

```diff
-import { section20 } from './sections/s20-rag'
+import { section20 } from './sections/s20-excel-factory'
```

**File 3:** `src/components/course/SectionView.tsx:1786` — key change (combined with D-01).

### Diff D-03 — Fix Theory T3-A reconcile.py output (P0, Issue 3)

**File:** `src/lib/course/sections/s20-rag.ts` (or renamed `s20-excel-factory.ts`)
**Lines:** 222

```diff
-        output: `{'region': ['Cusco', 'Oficina-Este'], 'monto': [7.0, 15.0]}
+        output: `{'region': ['Cusco', 'Sucursal-Centro', 'Sucursal-Sur'], 'monto': [7.0, 5.0, 10.0]}
 ok True`,
```

### Diff D-04 — Fix Theory T3-B structure.py output (P0, Issue 4)

**File:** `src/lib/course/sections/s20-rag.ts`
**Lines:** 254

```diff
-        output: `structure_ok True
-domain_ok True`,
+        output: `structure_ok True
+domain_ok False`,
```

(Note: the code is pedagogically correct — `Cliente-B` should fail the allowlist; the *output* was wrong.)

### Diff D-05 — Fix I Do S20-T1-A-DEMO output (P0, Issue 5)

**File:** `src/lib/course/sections/s20-rag.ts`
**Lines:** 375

```diff
-          output: `['Entrada', 'Salida']
-n 2
-A2 Sucursal-Sur`,
+          output: `['Entrada', 'Salida']
+n 2
+A2 Sucursal-Norte`,
```

### Diff D-06 — Fix I Do S20-T2-B-DEMO output (P0, Issue 6)

**File:** `src/lib/course/sections/s20-rag.ts`
**Lines:** 477

```diff
-          output: `2024-06-30
-anchor Cobertura: Cliente-A|Arequipa|Cliente-B
-non_anchor_D1 None`,
+          output: `2024-06-30
+anchor Cobertura: Oficina-Este|Arequipa|Oficina-Oeste
+non_anchor_D1 None`,
```

### Diff D-07 — Fix I Do S20-T3-A-DEMO output (P0, Issue 7)

**File:** `src/lib/course/sections/s20-rag.ts`
**Lines:** 503

```diff
-          output: `{'Oficina-Este': 8.0, 'Oficina-Oeste': 5.5, 'Cliente-A': 22.0}
+          output: `{'Arequipa': 8.0, 'Sucursal-Centro': 5.5, 'Sucursal-Norte': 10.0, 'Sucursal-Sur': 12.0}
 reconcile True`,
```

### Diff D-08 — Fix I Do S20-T3-B-DEMO output (P0, Issue 8)

**File:** `src/lib/course/sections/s20-rag.ts`
**Lines:** 531

```diff
-          output: `headers_ok True
-bad_regions ['Piura']
-abort True`,
+          output: `headers_ok True
+bad_regions ['Sucursal-Centro', 'Piura']
+abort True`,
```

### Diff D-09 — Fix I Do S20-T4-B-DEMO output (P0, Issue 9)

**File:** `src/lib/course/sections/s20-rag.ts`
**Lines:** 601

```diff
-          output: `{"sha1_8": "3e819052", "idempotent": true, "backup": "results.prev.xlsx", "tests": {"has_header": true, "n_data": 2}}`,
+          output: `{"sha1_8": "b66014c3", "idempotent": true, "backup": "results.prev.xlsx", "tests": {"has_header": true, "n_data": 2}}`,
```

### Diff D-10 — Fix We Do S20-T2-A-E3 (P0, Issue 10) — full canonical rewrite

**File:** `src/lib/course/sections/s20-rag.ts`
**Lines:** 902-972

The exercise has 5 different region names across 5 surfaces. Pick **one** canonical name (e.g. `Lima`) and use it everywhere. Below uses `Lima` for both the write and the check.

```diff
       {
         id: "S20-T2-A-E3",
         subtopicId: "S20-T2-A",
         kind: "transfer",
         instruction:
-          "E3 (transferencia) — Concepto: plantilla intocable (copy → load → write → save). En un directorio temporal crea un master con hoja `Entrada` y A1=`region`; cópialo a `out/results.xlsx`; abre la **copia** con `load_workbook`, escribe `Sucursal-Sur` en A2, guarda. Imprime dos líneas: el nombre del archivo de salida y un bool True solo si el master sigue existiendo **y** A2 de la copia es `Sucursal-Centro`. Salida esperada:\nresults.xlsx\nTrue",
-        hint: "shutil.copy(master, out); wb = load_workbook(out); escribe A2; wb.save(out); nunca sobrescribas master in-place.",
-        hints: [
-          "Crea master con Workbook + save; luego shutil.copy a out.",
-          "load_workbook solo sobre la copia; print(out.name) y master.exists() and A2==\"Oficina-Este\".",
-        ],
+          "E3 (transferencia) — Concepto: plantilla intocable (copy → load → write → save). En un directorio temporal crea un master con hoja `Entrada` y A1=`region`; cópialo a `out/results.xlsx`; abre la **copia** con `load_workbook`, escribe `Lima` en A2, guarda. Imprime dos líneas: el nombre del archivo de salida y un bool True solo si el master sigue existiendo **y** A2 de la copia es `Lima`. Salida esperada:\nresults.xlsx\nTrue",
+        hint: "shutil.copy(master, out); wb = load_workbook(out); escribe A2; wb.save(out); nunca sobrescribas master in-place.",
+        hints: [
+          "Crea master con Workbook + save; luego shutil.copy a out.",
+          "load_workbook solo sobre la copia; print(out.name) y master.exists() and A2==\"Lima\".",
+        ],
         edgeCases: ["guardar sobre el master", "out sin mkdir", "copiar sin escribir A2"],
         tests: "salida coincide con solution output",
         feedback: "Si la segunda línea es False, no copiaste, no escribiste A2, o dañaste el master. Si ves no_output, load falló porque out no existe.",
         starterCode: {
           language: 'python',
           title: "exercise.py",
           code: `# CASO-LIM-020 · template copy→load→save
-# Pista: copia el master a out, abre la COPIA, escribe A2="Oficina-Oeste", save(out)
+# Pista: copia el master a out, abre la COPIA, escribe A2="Lima", save(out)
 from openpyxl import Workbook, load_workbook
 from pathlib import Path
 import shutil
@@ -30,9 +30,9 @@
     # Sin copiar/escribir, la salida no existe: no debe pasar el contrato
     try:
         wb = load_workbook(out)
         print(out.name)
-        print(master.exists() and wb["Entrada"]["A2"].value == "Cliente-A")
+        print(master.exists() and wb["Entrada"]["A2"].value == "Lima")
     except Exception:
         print("no_output")
         print(False)`,
         },
         solutionCode: {
           language: 'python',
           title: "exercise.py",
           code: `from openpyxl import Workbook, load_workbook
 from pathlib import Path
 import shutil
 import tempfile

 with tempfile.TemporaryDirectory() as tmp:
     master = Path(tmp) / "templates" / "cpn2b_factory.xlsx"
     master.parent.mkdir(parents=True)
     seed = Workbook()
     seed.active.title = "Entrada"
     seed.active["A1"] = "region"
     seed.save(master)

     out = Path(tmp) / "out" / "results.xlsx"
     out.parent.mkdir(parents=True)
     shutil.copy(master, out)
     wb = load_workbook(out)
-    wb["Entrada"]["A2"] = "Cliente-B"
+    wb["Entrada"]["A2"] = "Lima"
     wb.save(out)
     print(out.name)
-    print(master.exists() and wb["Entrada"]["A2"].value == "Sucursal-Norte")`,
+    print(master.exists() and wb["Entrada"]["A2"].value == "Lima")`,
           output: `results.xlsx
 True`,
         },
       },
```

### Diff D-11 — Fix We Do S20-T3-A-E2 (P0, Issue 11) — canonical rewrite

**File:** `src/lib/course/sections/s20-rag.ts`
**Lines:** 1130-1160

```diff
       {
         id: "S20-T3-A-E2",
         subtopicId: "S20-T3-A",
         kind: "independent",
         instruction:
-          "E2 (independiente) — Concepto: pivot/groupby suma por región. Con el DataFrame Sucursal-Sur/Sucursal-Centro/Oficina-Este y montos 10, 5, 7, imprime `df.groupby(\"region\")[\"monto\"].sum().to_dict()`. Salida esperada:\n{'Oficina-Oeste': 7.0, 'Cliente-A': 15.0}",
+          "E2 (independiente) — Concepto: pivot/groupby suma por región. Con el DataFrame Lima/Cusco/Arequipa y montos 10, 5, 7, imprime `df.groupby(\"region\")[\"monto\"].sum().to_dict()`. Salida esperada:\n{'Lima': 10.0, 'Cusco': 5.0, 'Arequipa': 7.0}",
         hint: "groupby(...).sum().to_dict() — no mean.",
         hints: [
           "Usa sum, no mean.",
           "to_dict() sobre la Series resultante.",
         ],
         edgeCases: ["NaN monto"],
         tests: "salida coincide con solution output",
-        feedback: "Si ves promedios (7.5 en Cliente-B), usaste mean en vez de sum. El pivot lógico del factory materializa sumas por región.",
+        feedback: "Si ves promedios (7.5 en Lima), usaste mean en vez de sum. El pivot lógico del factory materializa sumas por región.",
         starterCode: {
           language: 'python',
           title: "exercise.py",
           code: `# CASO-LIM-020 · groupby sum
 # Pista: el starter usa mean; cambia a sum para el pivot lógico
 import pandas as pd
-df = pd.DataFrame({"region": ["Sucursal-Norte", "Sucursal-Sur", "Sucursal-Centro"], "monto": [10.0, 5.0, 7.0]})
+df = pd.DataFrame({"region": ["Lima", "Cusco", "Arequipa"], "monto": [10.0, 5.0, 7.0]})
 print(df.groupby("region")["monto"].mean().to_dict())`,
         },
         solutionCode: {
           language: 'python',
           title: "exercise.py",
           code: `import pandas as pd
-df = pd.DataFrame({"region": ["Oficina-Este", "Oficina-Oeste", "Cliente-A"], "monto": [10.0, 5.0, 7.0]})
+df = pd.DataFrame({"region": ["Lima", "Cusco", "Arequipa"], "monto": [10.0, 5.0, 7.0]})
 print(df.groupby("region")["monto"].sum().to_dict())`,
-          output: `{'Cliente-B': 7.0, 'Sucursal-Norte': 15.0}`,
+          output: `{'Arequipa': 7.0, 'Cusco': 5.0, 'Lima': 10.0}`,
         },
       },
```

### Diff D-12 — Fix We Do S20-T3-B-E2 (P0, Issue 12) — canonical rewrite

**File:** `src/lib/course/sections/s20-rag.ts`
**Lines:** 1237-1278

```diff
       {
         id: "S20-T3-B-E2",
         subtopicId: "S20-T3-B",
         kind: "independent",
         instruction:
-          "E2 (independiente) — Concepto: filtrar regiones fuera de allowlist leídas desde la hoja. En openpyxl, A2=`Sucursal-Sur` y A3=`Piura`. Con `allowed = {\"Sucursal-Centro\", \"Oficina-Este\"}`, lee las regiones de A2:A3 e imprime solo las no permitidas (violators). Salida esperada:\n['Piura']",
+          "E2 (independiente) — Concepto: filtrar regiones fuera de allowlist leídas desde la hoja. En openpyxl, A2=`Lima` y A3=`Piura`. Con `allowed = {\"Lima\", \"Cusco\"}`, lee las regiones de A2:A3 e imprime solo las no permitidas (violators). Salida esperada:\n['Piura']",
         hint: "Lee .value de A2 y A3; filtra con `r not in allowed`.",
         hints: [
           "regs = [ws[\"A2\"].value, ws[\"A3\"].value].",
           "print([r for r in regs if r not in allowed]).",
         ],
         edgeCases: ["case sensitivity", "celda vacía"],
         tests: "salida coincide con solution output",
-        feedback: "Si imprimiste ['Oficina-Oeste', 'Piura'], no filtraste. Si imprimiste ['Cliente-A'], invertiste el predicado (allowed vs violators). El factory aborta con la lista de violators, no con un bool silencioso.",
+        feedback: "Si imprimiste ['Lima', 'Piura'], no filtraste. Si imprimiste ['Cusco'], invertiste el predicado (allowed vs violators). El factory aborta con la lista de violators, no con un bool silencioso.",
         starterCode: {
           language: 'python',
           title: "exercise.py",
           code: `# CASO-LIM-020 · allowlist regions desde hoja
 # Pista: lee A2/A3 y filtra las que NO están en allowed
 from openpyxl import Workbook
 wb = Workbook()
 ws = wb.active
-ws["A2"] = "Cliente-B"
-ws["A3"] = "Sucursal-Norte"
-allowed = {"Sucursal-Sur", "Sucursal-Centro"}
+ws["A2"] = "Lima"
+ws["A3"] = "Piura"
+allowed = {"Lima", "Cusco"}
 regs = [ws["A2"].value, ws["A3"].value]
 print(regs)`,
         },
         solutionCode: {
           language: 'python',
           title: "exercise.py",
           code: `from openpyxl import Workbook
 wb = Workbook()
 ws = wb.active
-ws["A2"] = "Oficina-Este"
-ws["A3"] = "Oficina-Oeste"
-allowed = {"Cliente-A", "Cliente-B"}
+ws["A2"] = "Lima"
+ws["A3"] = "Piura"
+allowed = {"Lima", "Cusco"}
 regs = [ws["A2"].value, ws["A3"].value]
 print([r for r in regs if r not in allowed])`,
-          output: `['Sucursal-Norte']`,
+          output: `['Piura']`,
         },
       },
```

### Diff D-13 — Fix We Do S20-T3-B-E3 (P0, Issue 13) — canonical rewrite

**File:** `src/lib/course/sections/s20-rag.ts`
**Lines:** 1279-1310

```diff
       {
         id: "S20-T3-B-E3",
         subtopicId: "S20-T3-B",
         kind: "transfer",
         instruction:
-          "E3 (transferencia) — Concepto: validate_rows devuelve violators. Completa la función para devolver las regiones de `rows` que no están en `allowed`. Llama con Sucursal-Sur e Ica. Salida esperada:\n['Ica']",
+          "E3 (transferencia) — Concepto: validate_rows devuelve violators. Completa la función para devolver las regiones de `rows` que no están en `allowed`. Llama con Lima e Ica. Salida esperada:\n['Ica']",
         hint: "return [r[\"region\"] for r in rows if r[\"region\"] not in allowed].",
         hints: [
           "not in allowed (violators), no in allowed.",
           "print el resultado de la llamada dada.",
         ],
         edgeCases: ["rows vacías"],
         tests: "salida coincide con solution output",
-        feedback: "Si devuelves ['Sucursal-Centro'], invertiste el predicado: quieres violators (not in allowed), no las regiones válidas. Ica debe salir; Oficina-Este no.",
+        feedback: "Si devuelves ['Lima'], invertiste el predicado: quieres violators (not in allowed), no las regiones válidas. Ica debe salir; Lima no.",
         starterCode: {
           language: 'python',
           title: "exercise.py",
           code: `# CASO-LIM-020 · validate_rows
 # Pista: devuelve violators (fuera de allowed), no las válidas
 def validate_rows(rows, allowed):
     return [r["region"] for r in rows if r["region"] in allowed]
-print(validate_rows([{"region": "Oficina-Oeste"}, {"region": "Ica"}], {"Cliente-A", "Cliente-B"}))`,
+print(validate_rows([{"region": "Lima"}, {"region": "Ica"}], {"Cusco", "Arequipa"}))`,
         },
         solutionCode: {
           language: 'python',
           title: "exercise.py",
           code: `def validate_rows(rows, allowed):
     return [r["region"] for r in rows if r["region"] not in allowed]
-print(validate_rows([{"region": "Sucursal-Norte"}, {"region": "Ica"}], {"Sucursal-Sur", "Sucursal-Centro"}))`,
+print(validate_rows([{"region": "Lima"}, {"region": "Ica"}], {"Cusco", "Arequipa"}))`,
           output: `['Ica']`,
         },
       },
```

(Note: with the canonical rewrite, the output `['Ica']` is now correct — `Lima` is not in `{"Cusco", "Arequipa"}`, so it would also be a violator. Wait — let me re-verify: `validate_rows([{"region": "Lima"}, {"region": "Ica"}], {"Cusco", "Arequipa"})` returns `["Lima", "Ica"]`. So the output `['Ica']` is still wrong! To make the output match `['Ica']`, the allowed set must contain `Lima`. Let me adjust: use `allowed = {"Lima", "Cusco"}` then violators = `["Ica"]`. Adjust the diff above accordingly.)

```diff
-          "E3 (transferencia) — Concepto: validate_rows devuelve violators. Completa la función para devolver las regiones de `rows` que no están en `allowed`. Llama con Lima e Ica. Salida esperada:\n['Ica']",
+          "E3 (transferencia) — Concepto: validate_rows devuelve violators. Completa la función para devolver las regiones de `rows` que no están en `allowed`. Llama con Lima e Ica, con allowed = {Lima, Cusco}. Salida esperada:\n['Ica']",
```

And the solutionCode:
```diff
-print(validate_rows([{"region": "Lima"}, {"region": "Ica"}], {"Cusco", "Arequipa"}))`,
+print(validate_rows([{"region": "Lima"}, {"region": "Ica"}], {"Lima", "Cusco"}))`,
```

### Diff D-14 — Fix We Do S20-T4-B-E2 (P0, Issue 14) — canonical rewrite

**File:** `src/lib/course/sections/s20-rag.ts`
**Lines:** 1511-1548

```diff
       {
         id: "S20-T4-B-E2",
         subtopicId: "S20-T4-B",
         kind: "independent",
         instruction:
-          "E2 (independiente) — Concepto: digest canónico de filas (orden-invariante). Completa `dig(rows)` ordenando las filas antes de hashear. Imprime si dig de (Oficina-Este,1)+(Oficina-Oeste,2) es igual al de la lista invertida. Salida esperada:\nTrue",
+          "E2 (independiente) — Concepto: digest canónico de filas (orden-invariante). Completa `dig(rows)` ordenando las filas antes de hashear. Imprime si dig de (Lima,1)+(Cusco,2) es igual al de la lista invertida. Salida esperada:\nTrue",
         hint: "sorted(rows) antes de join; hashlib.sha1.",
         hints: [
           "s = \"\\n\".join(... for a, b in sorted(rows)).",
           "Compara dig(lista) == dig(reversed).",
         ],
         edgeCases: ["floats formatting"],
         tests: "salida coincide con solution output",
         feedback: "Sin sorted(rows), el orden de entrada cambia el hash y la re-ejecución deja de ser idempotente. Ordena antes de hashear.",
         starterCode: {
           language: 'python',
           title: "exercise.py",
           code: `# CASO-LIM-020 · dig order-invariant
 # Pista: ordena rows antes de hashear
 import hashlib

 def dig(rows):
     s = "\\n".join(f"{a},{b}" for a, b in rows)
     return hashlib.sha1(s.encode()).hexdigest()
-print(dig([("Cliente-A", 1), ("Cliente-B", 2)]) == dig([("Sucursal-Norte", 2), ("Sucursal-Sur", 1)]))`,
+print(dig([("Lima", 1), ("Cusco", 2)]) == dig([("Cusco", 2), ("Lima", 1)]))`,
         },
         solutionCode: {
           language: 'python',
           title: "exercise.py",
           code: `import hashlib

 def dig(rows):
     s = "\\n".join(f"{a},{b}" for a, b in sorted(rows))
     return hashlib.sha1(s.encode()).hexdigest()
-print(dig([("Sucursal-Centro", 1), ("Oficina-Este", 2)]) == dig([("Oficina-Oeste", 2), ("Cliente-A", 1)]))`,
+print(dig([("Lima", 1), ("Cusco", 2)]) == dig([("Cusco", 2), ("Lima", 1)]))`,
           output: `True`,
         },
       },
```

### Diff D-15 — Fix Theory T2-B missing `)` (P1, Issue 15)

**File:** `src/lib/course/sections/s20-rag.ts`
**Line:** 168

```diff
-        "Fechas y locales: serializa fechas **ISO** (`YYYY-MM-DD`) o `datetime` documentado; no dependas del locale del SO del alumno para parsear "03/04/24" (¿marzo o abril?. Las celdas combinadas (**merges**) son trampas de lectura automatizada: el valor vive en la **celda ancla** (top-left del rango); las demás del merge leen `None`. Si el script necesita escribir y la hoja está bloqueada por el SO o por otro usuario, falla con mensaje claro al manifest — no silencies el error.",
+        "Fechas y locales: serializa fechas **ISO** (`YYYY-MM-DD`) o `datetime` documentado; no dependas del locale del SO del alumno para parsear "03/04/24" (¿marzo o abril?). Las celdas combinadas (**merges**) son trampas de lectura automatizada: el valor vive en la **celda ancla** (top-left del rango); las demás del merge leen `None`. Si el script necesita escribir y la hoja está bloqueada por el SO o por otro usuario, falla con mensaje claro al manifest — no silencies el error.",
```

### Diff D-16 — Fix "e hashes" → "y hashes" (P1, §6.1 paragraph 2)

**File:** `src/lib/course/sections/s20-rag.ts`
**Line:** 31

```diff
-        "**Diccionario de la sección** (léelo una vez; el resto lo usa). **Plantilla master:** xlsx de referencia que no se sobrescribe. **Celda ancla:** esquina superior izquierda de un merge (ahí vive el valor). **Valor materializado:** número ya calculado en Python y escrito a la celda (no dependes de Excel para evaluarlo). **Conciliación:** comparar totales/n del Excel de salida vs el DataFrame fuente. **Fail-closed:** si la conciliación falla, no emites el paquete. **Manifest:** JSON con estados de batch, `reconcile_ok`, backup e hashes. **Idempotencia:** misma entrada + misma versión de script → mismo resultado lógico (sin filas fantasma). **Cuarentena:** aislar un archivo corrupto sin tumbar el lote.",
+        "**Diccionario de la sección** (léelo una vez; el resto lo usa). **Plantilla master:** xlsx de referencia que no se sobrescribe. **Celda ancla:** esquina superior izquierda de un merge (ahí vive el valor). **Valor materializado:** número ya calculado en Python y escrito a la celda (no dependes de Excel para evaluarlo). **Conciliación:** comparar totales y n del Excel de salida contra el DataFrame fuente. **Fail-closed:** si la conciliación falla, no emites el paquete. **Manifest:** JSON con estados de batch, `reconcile_ok`, backup y hashes. **Idempotencia:** misma entrada y misma versión de script implican mismo resultado lógico (sin filas fantasma). **Cuarentena:** aislar un archivo corrupto sin tumbar el lote.",
```

### Diff D-17 — Replace "u ops team" and "share de finanzas" anglicisms (L, Issues 26-27)

**File:** `src/lib/course/sections/s20-rag.ts`
**Lines:** 48, 269

```diff
-        "Caso sintético Lima: `ws.title='Entrada'`, A1=`region`, B1=`monto`; segunda hoja `Salida`. Los conteos de filas de datos (sin header) alimentan la conciliación con el dashboard de S19 (mismos n). En un banco u ops team peruano, el primer bug típico es renombrar "Entrada" a "Input_v2" y romper tres scripts ajenos. Cuando el I Do te muestre `sheetnames`, fíjate que el orden y los nombres son parte del contrato, no decoración.",
+        "Caso sintético Lima: `ws.title='Entrada'`, A1=`region`, B1=`monto`; segunda hoja `Salida`. Los conteos de filas de datos (sin header) alimentan la conciliación con el dashboard de S19 (mismos n). En un banco o equipo de operaciones peruano, el primer bug típico es renombrar "Entrada" a "Input_v2" y romper tres scripts ajenos. Cuando la pestaña *Hago yo* te muestre `sheetnames`, fíjate que el orden y los nombres son parte del contrato, no decoración.",
```

```diff
-        "Caso didáctico: tres paths → `ok=1`, `corrupt=1`, `locked=1`. En un share de finanzas, el archivo "abierto por el contador" (lock) no debe tumbar el lote de la noche: se marca `locked`, se registra el path sintético y el resto del batch sigue. El corrupt se mueve a cuarentena con su nombre en el log; el auditor mira primero el `ok_count` del summary.",
+        "Caso didáctico: tres paths → `ok=1`, `corrupt=1`, `locked=1`. En una carpeta compartida de finanzas, el archivo "abierto por el contador" (lock) no debe tumbar el lote de la noche: se marca `locked`, se registra el path sintético y el resto del batch sigue. El corrupt se mueve a cuarentena con su nombre en el log; el auditor mira primero el `ok_count` del summary.",
```

### Diff D-18 — "Datos sintéticos only" anglicism (L, §6.4)

**File:** `src/lib/course/sections/s20-rag.ts`
**Line:** 1598

```diff
-      "Datos sintéticos only — sin PII real en celdas ni paths",
+      "Solo datos sintéticos — sin PII real en celdas ni paths",
```

### Diff D-19 — `vs` → `vs.` (L, Issue 22) — systemic, ~12 occurrences

Apply with `replace_all` after coordinating with cross-section fixer.

---

## 8. Recommended Priority Order for Fixing

| Priority | Issue(s) | Diff(s) | Effort | Impact |
|---|---|---|---|---|
| **P0-a** | Issue 1 — RAG demo on Excel page | D-01 | 30 min | Catastrophic meta-leak removed |
| **P0-b** | Issue 2 — `id: "rag"` / filename / URL | D-02 | 15 min (+ grep for `#rag` links) | Identity coherent; URL matches content |
| **P0-c** | Issues 3–14 — 12 fabricated outputs | D-03 … D-14 | 1.5 h (execute each fix locally to verify) | Section becomes trustworthy |
| **P1-a** | Issue 15 — Missing `)` in T2-B | D-15 | 1 min | Grammar fix |
| **P1-b** | §6.1 — `e hashes` → `y hashes` | D-16 | 1 min | Real grammar error fix |
| **P1-c** | Issue 16 — We Do intro reformat as list | D-17 (variant) | 5 min | Readability |
| **P1-d** | Issue 18 — Anglicism glosses (master, manifest, workbook, backup, share, ops team) | D-17, D-18 | 20 min | Bilingual voice polished |
| **P2-a** | Issue 30 — Strip `CASO-LIM-020` from starterCode comments | (bulk regex) | 10 min | Cross-section systemic; coordinate with S04/S08/S10/S11/S12 fixers |
| **P2-b** | Issue 32 — "el I Do" → "la pestaña *Hago yo*" | D-17 | 2 min | UI label consistency |
| **P3** | Issues 22, 23, 24, 25, 28, 29 — typography nits | (bulk) | 30 min | Polish |

**Total estimated fixer time:** ~3.5 hours for P0+P1; +1 h for P2+P3.

---

## 9. Graph Memory Update Notes

For the shared orchestrator context:

### 9.1 Cross-section systemic patterns confirmed in S20

1. **Pseudonymization drift (CRITICAL, systemic).** Same defect class as S04, S08, S12: a late pass renamed `Sucursal-Norte/Sur/Centro`, `Oficina-Este/Oeste`, `Cliente-A/B` inconsistently across `instruction` / `hint` / `hints` / `starterCode` / `solutionCode` / `output`. **S20 is the most-affected section observed so far (12 broken pairs).** Recommend a **repo-wide canonicalization pass** with one vocabulary (e.g. `Lima`, `Cusco`, `Arequipa`, `Piura`, `Ica` — actual Peruvian regions, easier for learners to remember than pseudonyms). Run: `rg "Sucursal-Norte|Sucursal-Sur|Sucursal-Centro|Oficina-Este|Oficina-Oeste|Cliente-A|Cliente-B" src/lib/course/sections/` to find every drift.

2. **Section identity meta-leak (systemic).** Same pattern as S04 (`functions-modules` → iteration), S05 (`oop` → functions), S06 (`numpy` → collections), S07 (`data-acquisition` → Unicode), S08 (`pandas` → CSV/JSON), S10 (`sklearn` → packaging), S11 (`testing` → OOP), S12 (`performance` → APIs/SQL). S20 adds `rag → excel-factory` to the list. **All nine sections have stale `id`/filename/URL/demo-key.** Recommend a one-time repo-wide pass to rename ids, filenames, and demos-map keys to match the actual content.

3. **Interactive playground demo drift (systemic).** Same pattern as S05 (`oop` demo on functions page), S06 (`numpy` demo on collections page), S07 (`data-acquisition` demo teaches scraping/SQL). The `demos[sectionId]` map in `SectionView.tsx` is keyed by the section's stale `id`, so whenever the section is retargeted, the demo becomes off-topic. **S20's `rag` demo teaches RAG/Jaccard on the Excel-automation page** — the most off-topic demo observed so far. Recommend a per-section audit of `demos` map keys vs. actual content.

4. **`CASO-LIM-0NN` taxonomy in starterCode comments (systemic).** Same pattern as S04 (`CASO-LIM-008`), S08 (`CASO-LIM-008`), S10 (`CASO-LIM-010`), S11 (none found), S12 (none found). S20 uses `CASO-LIM-020` 24×. These are visible to learners in the editor. Recommend a bulk replacement with `# Ejercicio SNN-T*-E*`.

5. **Bare `SNN-T*-A` subtopic IDs in prose (systemic).** S20 uses `T1-A`, `T2-A`, etc. in the We Do intro (line 608). Acceptable because they map to learner-visible Theory headings, but consider stripping for cleaner prose.

6. **V2 master roadmap stale (systemic).** `el_arte_de_python_roadmap_maestro_52_secciones.md` still describes S20 as "Advanced Pandas & Time Series". The V3 roadmap (`learning_roadmap_52_V3.md`) is current. Recommend retiring V2 or marking it as superseded.

### 9.2 S20-specific findings

- **No prose meta-leaks** (TODO/FIXME/moved-from/V3-retarget). Clean authoring voice.
- **Healthy readability** (mean FH 75.9, median WPS 7.0, 0 voseo, 0 missing `¿`/`¡` in real prose).
- **Strong pedagogical structure** (8×3 = 24 exercises + capstone + 8 self-check, I Do / We Do / You Do fidelity = 9/10).
- **One real grammar error** (`e hashes` should be `y hashes` — Issue in Theory T1-A dictionary paragraph).
- **One missing `)` in Theory T2-B** (Issue 15).
- **~12 `vs` without period** (systemic with S08).

### 9.3 Externalities for the orchestrator

- The URL hash `#rag` → `#excel-factory` rename will break any external links pointing to `#rag`. Check the repo's `README.md`, `docs/`, and any external blog/social posts before applying D-02.
- The filename rename `s20-rag.ts` → `s20-excel-factory.ts` requires updating `src/lib/course/index.ts:22` only (single import). Coordinate with cross-section fixer doing the same for S04–S12.
- After fixing the 12 fabricated outputs, **re-run every code snippet locally** to verify the displayed output matches. The verify.py script in `/home/z/my-project/audits/tmp_s20/` can be re-used.

### 9.4 Auxiliary artefacts

- `/home/z/my-project/audits/tmp_s20/prose.json` — 344 extracted Spanish prose chunks
- `/home/z/my-project/audits/tmp_s20/prose.txt` — same, human-readable
- `/home/z/my-project/audits/tmp_s20/records.json` — 763 sentence-level records with FH/INFLESZ/WPS/SPW
- `/home/z/my-project/audits/tmp_s20/verify.py` — re-runnable code↔output verifier for all 12 broken pairs
- `/home/z/my-project/audits/tmp_s20/extract.py` — Spanish prose extractor (reusable)
- `/home/z/my-project/audits/tmp_s20/metrics.py` — readability + heuristic scorer (reusable)

---

## Closing

**Composite score: 5.0 / 10** (would rise to **8.0–8.5** after P0 + P1 fixes).

The section's **pedagogy is exemplary** (faithful I Do / We Do / You Do, strong narrative spine CP-N2-B → S21, healthy Spanish readability). What drags it down is **(1) a catastrophic identity meta-leak** (the interactive `Pruébalo tú mismo` demo teaches RAG/Jaccard on the Excel-automation page, plus the `id: "rag"` / URL `#rag` / filename `s20-rag.ts` all surface "RAG" for an Excel section) and **(2) twelve fabricated or drifted code↔output pairs** rooted in systemic pseudonymization drift (the same defect class flagged in S04, S08, S12). Both are P0 and fixable in ~2 hours of focused work; after that, the section is shippable.

This is the complete Explorer report for Section 20. Ready for the Fixer prompt.
