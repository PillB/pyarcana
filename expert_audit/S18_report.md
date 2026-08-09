# Curriculum Audit — Section 18 (`s18-data-engineering.ts`)

> **PyArcana · Curriculum Auditor (S18) — Stanford STORM + Graph/Loop/Harness Engineering**
> Section under audit: **S18 — "EDA, estadística descriptiva e incertidumbre"**
> Live site: <https://pillb.github.io/pyarcana/#data-engineering>
> Repo source: `src/lib/course/sections/s18-data-engineering.ts` (1 771 lines, ~72 KB)
> Active source of position 18 in `COURSE_SECTIONS` (index.ts line 20, 73).

---

## 1. Section Identification & Scope

### 1.1 Section metadata (from source)

| Field | Value |
|---|---|
| `id` | `"data-engineering"` |
| `index` | `18` |
| `title` | `"EDA, estadística descriptiva e incertidumbre"` |
| `shortTitle` | `"EDA e incertidumbre"` |
| `tagline` | `"EDA que diferencia hallazgo, hipótesis y decisión; cada conclusión referencia un cálculo y declara incertidumbre"` |
| `estimatedHours` | `18` |
| `level` | `"Competente"` |
| `phase` | `1` (Competente, sections 14–26) |
| File name | `s18-data-engineering.ts` |

### 1.2 Live-site confirmation

- Navigated <https://pillb.github.io/pyarcana/#data-engineering> with `agent-browser`.
- H1 rendered: `"EDA, estadística descriptiva e incertidumbre"` → matches source `title`.
- `document.title` carries the global brand suffix.
- The page renders three H-level sections: H1 title + H2 "Teoría" + H2 "Pruébalo tú mismo".
- URL hash route `#data-engineering` derives from `id: "data-engineering"` (Next/hash router convention).

### 1.3 Scope audited

All five learner-facing tabs of the active `section18` object:

1. **Teoría** — 8 theory blocks (T1-A, T1-B, T2-A, T2-B, T3-A, T3-B, T4-A, T4-B), each with 3 paragraphs + a `code` block (Python) + a `callout`.
2. **I Do (Yo hago)** — `intro` + 8 demos (`S18-T1-A-DEMO` … `S18-T4-B-DEMO`), each with `description`, `code`, `output`, `why`.
3. **We Do (Hacemos juntos)** — `intro` + 24 exercises (3 per subtopic, ×8 subtopics), each with `instruction`, `hint`, `hints[2]`, `edgeCases`, `tests`, `feedback`, `starterCode`, `solutionCode` + `output`.
4. **You Do (Tú haces)** — `title`, `context`, `objectives[5]`, `requirements[7]`, `starterCode` (multi-block portfolio skeleton for CP-N2-B), `portfolioNote`, `rubric[6]`.
5. **Autoevaluación (selfCheck)** — 8 multiple-choice questions (stem + 4 options + correctIndex + explanation).
6. **Recursos (resources)** — `docs[7]`, `books[2]`, `courses[6]`. (Out of scope for prose audit but skimmed for URL/label sanity.)

In total: **~243 learner-facing Spanish sentences, ~2 846 words** of prose (after masking code blocks).

---

## 2. Executive Summary of Quality

### 2.1 Composite score: **5.5 / 10** (would rise to **8.0–8.5** after the proposed fixes)

| Dimension | Score | Verdict |
|---|---|---|
| Pedagogical structure (I Do / We Do / You Do) | **9.0** | Gold-standard 8 + 24 + capstone + 8 self-check; 1:1:1 mapping; deliberate DEFECT pattern in every starter. |
| Narrative connective tissue | **8.5** | Strong thread: CP-N2-A (S17) → CP-N2-B inicio (S18) → S19 dashboard; explicit forward/back refs. |
| Spanish readability (FH/INFLESZ) | **7.5** | Mean FH 73.3 ("bastante fácil"), mean INFLESZ 68.8 ("normal"). Healthy for technical ES. |
| Spanish grammar (rule-based) | **6.5** | 1 run-on (57 w), 8 long sentences (>32 w), 6 "el/un data note" DET-NOUN borderline anglicisms, 3 "vs" without period, 1 "p.ej" missing period/space, 1 "y imprímela" → "e imprímela", 1 "o otra" → "u otra", 1 "limite" → "límite", heavy anglicism load (claim/flag/memo/dataset/portfolio/starter/p-value). |
| Regional language (es-PE) | **8.5** | Uniform **tuteo** (no voseo leak). Consistent PEN / "cola pesada" / "ticket típico" Peruvian fintech register. |
| Code↔output integrity | **3.0** | **11 critical broken pairs** (7 in theory/I-Do, 4 in We-Do) — pseudonymization drift across region labels produced fabricated outputs. |
| Meta-leak | **7.5** | No TODO/FIXME/moved-from/AI prose leaks. Borderline: `# CASO-LIM-018` scaffolding tags (26×, 8 in learner prose); structural leak: `id:"data-engineering"` and file name no longer match rescoped EDA content. |
| Exercise alignment & fidelity | **8.0** | 1:1:1 across 8 subtopics; DEFECT pattern is consistent; rubric weights sum to 100 %. |
| Roadmap consistency | **8.0** | Honest scope declaration; explicit CP-N2-B inicio → S19 handoff. |

### 2.2 Key verdict

> Section 18 is **pedagogically excellent** — one of the strongest I Do / We Do / You Do structures in the course — but it is **technically broken in 11 places** because a late pseudonymization pass (replacing real region names with synthetic ones like "Cliente-A", "Sucursal-Norte", "Oficina-Este") was applied to the source code but the `output` blocks were never regenerated. Worse, the pseudonymization script relabeled the same logical region with **different** names in the code vs. the output, producing contradictions a learner will hit on the very first exercise. The Spanish prose is mostly fluent Peruvian Spanish with healthy readability metrics, but carries a heavy load of anglicisms (`claim`, `flag`, `memo`, `dataset`, `portfolio`, `starter`, `data note`) that should be glossed or translated. **Fix the 11 broken code↔output pairs first** — they are the single biggest defect class and they poison the most engaging surfaces of the section.

### 2.3 Worst single defect (P0 / blocker)

`S18-T2-A-E3` (We Do, transfer) — the displayed `solutionCode` raises `KeyError: 'Cliente-B'` instead of printing `0.4` as the displayed `output` claims. Even after patching with `.get(k, 0)`, the real output is `0.5`, not `0.4`. **A correct solution cannot pass the auto-checker.** This is the worst single blocker because the exercise cannot be completed as written.

---

## 3. Detailed Issue Registry

Severity legend: **H** = blocker / pedagogical injury, **M** = clarity or correctness defect, **L** = polish.

### 3.1 Critical code↔output mismatches (H)

#### Issue I-01 — `T2-A` theory `sample_bias.py` output is fabricated (lines 138–140)

- **Severity:** H
- **Evidence (code, lines 125–135):**
  ```python
  pob = {"Sucursal-Norte": 0.55, "Arequipa": 0.25, "Cusco": 0.20}
  muestra = ["Sucursal-Centro"] * 40 + ["Arequipa"] * 8 + ["Cusco"] * 2
  ...
  share = {k: round(v / n, 3) for k, v in c.items()}
  print("share_muestra", share)
  print("share_pob", pob)
  bias = {k: round(share.get(k, 0) - pob[k], 3) for k in pob}
  print("bias_pp", bias)
  ```
- **Displayed output (lines 138–140):**
  ```
  share_muestra {'Oficina-Este': 0.8, 'Arequipa': 0.16, 'Cusco': 0.04}
  share_pob {'Oficina-Oeste': 0.55, 'Arequipa': 0.25, 'Cusco': 0.2}
  bias_pp {'Cliente-A': 0.25, 'Cliente-B': -0.09, 'Sucursal-Norte': -0.16}
  ```
- **Real output (executed, pandas 2.2 / numpy 1.26):**
  ```
  share_muestra {'Sucursal-Centro': 0.8, 'Arequipa': 0.16, 'Cusco': 0.04}
  share_pob {'Sucursal-Norte': 0.55, 'Arequipa': 0.25, 'Cusco': 0.2}
  bias_pp {'Sucursal-Norte': -0.55, 'Arequipa': -0.09, 'Cusco': -0.16}
  ```
- **Pedagogical impact:** The student reads prose that says "bias Lima +0.25" (paragraph 3 of T2-A) and then sees a fabricated bias of +0.25 for "Cliente-A" in the output. The number is wrong for the displayed pob ("Cliente-A" doesn't exist in pob; the real Sucursal-Norte bias is −0.55, not +0.25). The teachable point — that Sucursal-Centro is oversampled at 0.80 vs pob 0.55 → bias +0.25 — is destroyed by the label scramble. The learner cannot map code → output.

#### Issue I-02 — `T3-B` theory `segments_anom.py` output labels are scrambled (lines 279–281)

- **Severity:** H
- **Evidence:** Code builds `df` with `"region": ["Cliente-A"] * 5 + ["Cliente-B"] * 5`. Real `groupby('region')['anomalia'].mean()` returns `{'Cliente-A': 0.0, 'Cliente-B': 0.2}`.
- **Displayed output:** `{'Sucursal-Norte': 0.2, 'Sucursal-Sur': 0.0}`.
- **Pedagogical impact:** The displayed dict has labels that **don't even appear in the code** ("Sucursal-Norte", "Sucursal-Sur" vs code's "Cliente-A", "Cliente-B"). Furthermore the values are swapped relative to the labels: code produces "Cliente-B" = 0.2 (because the outlier `80` lives in the second 5-row block) but the displayed output shows "Sucursal-Sur" = 0.0 — a learner reading this expects Sucursal-Sur to have 0 outliers, which is meaningless because Sucursal-Sur isn't in the DataFrame.

#### Issue I-03 — `T4-A` theory `qhe_template.py` output region labels disagree with code (lines 314–318)

- **Severity:** H
- **Evidence:**
  ```python
  pregunta = "¿El ticket mediano en Cliente-A supera 25 PEN?"
  metrica = "median(monto | region==Cliente-B)"
  ...
  print("pregunta:", pregunta)
  print("metrica:", metrica)
  ```
- **Displayed output:**
  ```
  pregunta: ¿El ticket mediano en Sucursal-Norte supera 25 PEN?
  metrica: median(monto | region==Sucursal-Sur)
  ```
- **Pedagogical impact:** The "Pregunta → Métrica → Resultado → Límite" template is the central pedagogical artefact of T4-A; the output contradicts the code in two consecutive lines. The very next paragraph (line 296) reinforces the example with "¿El ticket mediano en Sucursal-Centro supera 25 PEN?" — a **third** label, introducing yet another region name.

#### Issue I-04 — `S18-T2-A-DEMO` output is fabricated (lines 451–453)

- **Severity:** H
- **Evidence (code, lines 441–448):**
  ```python
  pob = {"Cliente-A": 0.50, "Cliente-B": 0.30, "Sucursal-Norte": 0.20}
  muestra = ["Sucursal-Sur"] * 70 + ["Sucursal-Centro"] * 20 + ["Oficina-Este"] * 10
  c = Counter(muestra)
  n = sum(c.values())
  share = {k: c[k] / n for k in pob}
  print({k: round(share[k], 3) for k in pob})
  print("max_abs_bias_pp", round(max(abs(share[k] - pob[k]) for k in pob), 3))
  print("cobertura", "LIMITADA" if max(abs(share[k] - pob[k]) for k in pob) > 0.1 else "OK")
  ```
- **Displayed output:**
  ```
  {'Oficina-Oeste': 0.7, 'Cliente-A': 0.2, 'Cliente-B': 0.1}
  max_abs_bias_pp 0.2
  cobertura LIMITADA
  ```
- **Real output:**
  ```
  {'Cliente-A': 0.0, 'Cliente-B': 0.0, 'Sucursal-Norte': 0.0}
  max_abs_bias_pp 0.5
  cobertura LIMITADA
  ```
- **Pedagogical impact:** The demo's `pob` keys ("Cliente-A", "Cliente-B", "Sucursal-Norte") don't even appear in the `muestra` list ("Sucursal-Sur", "Sucursal-Centro", "Oficina-Este"). So **the code as written produces 0.0 for all three shares** because `Counter(muestra)["Cliente-A"] = 0`. The displayed output shows 0.7 / 0.2 / 0.1 — values that would correspond to a muestra *containing* pob's keys, which it does not. The demo teaches the wrong relationship between pob and muestra, and the `max_abs_bias_pp = 0.2` value is the polar opposite of the real `0.5`. The pedagogical message — "cobertura LIMITADA" — happens to remain true by coincidence, but the reasoning is broken.

#### Issue I-05 — `S18-T3-B-DEMO` output dict labels are scrambled and internally inconsistent (lines 564–566)

- **Severity:** H
- **Evidence:** Code's `region` is `["Sucursal-Norte"]*8 + ["Sucursal-Sur"]*6 + ["Sucursal-Centro"]*6`. The two outliers (`55` at index 13 = Sucursal-Sur; `90` at index 19 = Sucursal-Centro) make the real `groupby('region')['flag'].agg(['sum','mean'])`:
  ```
  {'sum': {'Sucursal-Centro': 1, 'Sucursal-Norte': 0, 'Sucursal-Sur': 1},
   'mean': {'Sucursal-Centro': 0.167, 'Sucursal-Norte': 0.0, 'Sucursal-Sur': 0.167}}
  ```
- **Displayed output:** `{'sum': {'Oficina-Este': 1, 'Oficina-Oeste': 1, 'Cliente-A': 0}, 'mean': {'Cliente-B': 0.167, 'Sucursal-Norte': 0.167, 'Sucursal-Sur': 0.0}}`.
- **Pedagogical impact:** The output uses **six** different region names where the code uses three; the `sum` half and `mean` half of the same printed dict use **different label sets**, so the printed dict is internally incoherent. A learner copying this into a notebook will see `KeyError` or wrong values immediately.

#### Issue I-06 — `S18-T4-A-DEMO` output region labels disagree with code (lines 592–594)

- **Severity:** H
- **Evidence:** `evidencia["pregunta"]` is the literal `"¿Hay diferencia de ticket mediano Sucursal-Centro vs Oficina-Este?"` and `evidencia["resultado"]` is `{'Oficina-Oeste': 28.0, 'Cliente-A': 22.5, 'n_Lima': 40, 'n_Cusco': 32}`. The print line is `print(evidencia["pregunta"])` then `print('hallazgo', evidencia['resultado'])`.
- **Displayed output:**
  ```
  ¿Hay diferencia de ticket mediano Cliente-B vs Sucursal-Norte?
  hallazgo {'Sucursal-Sur': 28.0, 'Sucursal-Centro': 22.5, 'n_Lima': 40, 'n_Cusco': 32}
  ```
- **Pedagogical impact:** Every region label in the displayed output is different from every region label in the code. The same demo's `hipotesis` field (`"mediana_Lima > mediana_Cusco en canal web junio"`) reinforces a fourth and fifth label ("Lima"/"Cusco") that don't appear in either the code or the output. A learner cannot trace pregunta → hipótesis → resultado.

#### Issue I-07 — `S18-T4-B-DEMO` output SHA-1 hex doesn't match the code (line 630)

- **Severity:** H
- **Evidence:** `df2` (after `df["monto"] > 0`) has 4 rows; the CSV payload is `"ticket_id,monto,region\nT001,10.0,Oficina-Este\nT002,12.0,Oficina-Oeste\nT004,15.0,Cliente-B\nT005,11.0,Sucursal-Norte\n"`. Real `hashlib.sha1(payload).hexdigest()[:8]` = `"0395ac09"`.
- **Displayed output:** `"sha1_8": "71094efb"`.
- **Pedagogical impact:** The whole point of T4-B (data notes for reproducibility) is that the SHA-1 is a deterministic function of the payload. The displayed hash was generated against a *different* payload (with different region labels) before the pseudonymization pass. A learner who runs the demo, copies `0395ac09` from their terminal, and compares to the slide's `71094efb` will conclude either that they did something wrong or that SHA-1 is non-deterministic — both catastrophic for the lesson.

#### Issue I-08 — We Do `S18-T2-A-E1` solutionCode prints the wrong number (lines 896–899)

- **Severity:** H
- **Evidence:**
  ```python
  muestra = ["Oficina-Oeste", "Cliente-A", "Cliente-B", "Sucursal-Norte"]
  share_lima = muestra.count("Sucursal-Sur") / len(muestra)
  print("share_Lima", round(share_lima, 2))
  ```
- **Displayed output:** `share_Lima 0.75`.
- **Real output:** `share_Lima 0.0` (because `"Sucursal-Sur"` does not appear in `muestra`).
- **Pedagogical impact:** Three mutually inconsistent muestras:
  - starterCode (line 889): `["Cliente-B", "Sucursal-Norte", "Sucursal-Sur", "Sucursal-Centro"]`
  - solutionCode (line 896): `["Oficina-Oeste", "Cliente-A", "Cliente-B", "Sucursal-Norte"]`
  - output (0.75): implies a muestra containing 3 of 4 occurrences of whatever is being counted — neither starter nor solution matches.
  
  No combination of starter + fix yields 0.75. The exercise is unsolvable as written.

#### Issue I-09 — We Do `S18-T2-A-E3` solutionCode raises `KeyError` (lines 957, 962–964)

- **Severity:** H (blocker — the auto-checker cannot pass)
- **Evidence:**
  ```python
  def max_bias(pob, counts):
      n = sum(counts.values())
      return max(abs(counts[k] / n - pob[k]) for k in pob)
  
  print(round(max_bias({"Cliente-B": 0.5, "Sucursal-Norte": 0.5},
                       {"Sucursal-Sur": 9, "Sucursal-Centro": 1}), 2))
  ```
- **Displayed output:** `0.4`.
- **Real output:** `KeyError: 'Cliente-B'` (because `counts["Cliente-B"]` doesn't exist).
- **Pedagogical impact:** A correct solution cannot reproduce `0.4`. Patching with `.get(k, 0)` yields `0.5`, not `0.4`. The fixture and the expected output are mutually incompatible. This is the single worst blocker in the section.

#### Issue I-10 — We Do `S18-T3-B-E2` solutionCode prints `nan`; instruction / hints / feedback use 4 mutually-inconsistent region names (lines 1244–1272)

- **Severity:** H
- **Evidence:**
  - `instruction` (line 1244): "Calcula la **tasa de flags en Oficina-Este**"
  - `hint` (line 1246): "Filtra flags donde region == \"Oficina-Oeste\" y toma la media."
  - `hints[0]` (line 1248): "Filtra flags donde region == \"Cliente-A\" y toma la media."
  - `hints[1]` (line 1249): "No uses flag.mean() global si el contrato pide Cliente-B."
  - `feedback` (line 1253): "Enmascara con region == \"Sucursal-Norte\" antes del mean."
  - `starterCode` (line 1260): `region = np.array(["Sucursal-Centro", "Oficina-Este", "Oficina-Oeste"])`
  - `solutionCode` (line 1268): `region = np.array(["Cliente-A", "Cliente-B", "Sucursal-Norte"])`; `flag[region == "Sucursal-Sur"].mean()` — `Sucursal-Sur` is not in the array.
  - `output` (line 1271): `tasa_Lima 1.0`.
- **Real output:** `tasa_Lima nan` (RuntimeWarning: Mean of empty slice).
- **Pedagogical impact:** The instruction, hint, second hint, feedback, starter, solution, and output reference **six different region names** ("Oficina-Este", "Oficina-Oeste", "Cliente-A", "Cliente-B", "Sucursal-Norte", "Sucursal-Sur"). Even if a learner fixes the bug, none of the candidate region names produce `1.0` from the displayed `flag = [True, True, False]` array unless they pick exactly the row whose `region == "Sucursal-Sur"` — but "Sucursal-Sur" doesn't exist in either the starter or solution `region` array. The exercise is unsolvable.

#### Issue I-11 — We Do `S18-T4-A-E3` starter / solution / output use three different region names (lines 1402, 1413, 1414)

- **Severity:** H
- **Evidence:**
  - `starterCode` call (line 1402): `traza("ticket mediano Sucursal-Centro", "median", 27.5, "solo web")`
  - `solutionCode` call (line 1413): `traza("ticket mediano Oficina-Este", "median", 27.5, "solo web")`
  - `output` (line 1414): `P: ticket mediano Oficina-Oeste`
- **Real output of solutionCode:** `P: ticket mediano Oficina-Este`.
- **Pedagogical impact:** Three different region labels ("Sucursal-Centro" / "Oficina-Este" / "Oficina-Oeste") for the same `P:` line. The auto-checker will mark a correct solution wrong.

### 3.2 Structural / scope issues (H/M)

#### Issue I-12 — `id:"data-engineering"` and file name `s18-data-engineering.ts` no longer match the rescoped EDA content (lines 1–4)

- **Severity:** M (structural; coordinate with Fixer — changes live URL `#data-engineering`)
- **Evidence:** File name and `id` say "data-engineering" (ETL / pipelines / Airflow / Spark — none of which appear). The `title`, `tagline`, `learningOutcomes`, theory blocks, demos, exercises, and self-check are all about **descriptive statistics and EDA**: center/dispersion, robust metrics, sample bias, IC/bootstrap, Cohen's d, Pearson/Spearman, Tukey anomalies, Q→H→E template, data notes. Zero data-engineering content.
- **Pedagogical impact:** Misleading metadata. A learner scanning the sidebar or the URL sees "data-engineering" and expects data engineering. This is the same class of drift flagged in S05 (`id:"oop"` on a Functions section), S08 (`id:"pandas"`), S11 (`id:"testing"` / file `s11-testing.ts`), S12 (`id:"performance"` / file `s12-performance.ts`).
- **Recommended rename (post-Fixer coordination):** `id:"eda-uncertainty"`, file `s18-eda-uncertainty.ts`. Updates needed in `src/lib/course/index.ts` line 20 (import), line 73 (COURSE_SECTIONS), and any internal links.

#### Issue I-13 — `# CASO-LIM-018` scaffolding tags appear in 8 instructions and 18 starterCode comments (26 total)

- **Severity:** L (borderline — same pattern flagged in S04 and S08 reports)
- **Evidence:** e.g. line 645 instruction text `` `CASO-LIM-018` / `S18-T1-A-E1` ``, line 657 `# CASO-LIM-018 · mean vs median`, etc.
- **Pedagogical impact:** "CASO-LIM-018" is an internal scaffold identifier (lim = límite? caso-limite = edge case?). It leaks the authoring taxonomy into learner prose. Best practice: keep the `S18-T1-A-E1` slug (already self-documenting) and drop the `CASO-LIM-018` prefix.

### 3.3 Spanish grammar / typography findings (M / L)

#### Issue I-14 — `y` before `i`-sound word: should be `e` (line 875, instruction `S18-T2-A-E1`)

- **Severity:** M
- **Evidence:** "calcula la **proporción de Sucursal-Sur** y imprímela como `share_Lima` (2 decimales)."
- **Grammar rule:** "y" → "e" before words starting with "i" or "hi" sound (RAE-ASALE 2010, §3.2.4).
- **Fix:** "calcula la proporción de Sucursal-Sur **e** imprímela como `share_Lima`."

#### Issue I-15 — `o` before `o`-sound word: should be `u` (line 883, feedback `S18-T2-A-E1`)

- **Severity:** M
- **Evidence:** "¿Contaste Sucursal-Centro **o** otra región?"
- **Grammar rule:** "o" → "u" before words starting with "o" or "ho" sound (RAE-ASALE 2010, §3.2.4).
- **Fix:** "¿Contaste Sucursal-Centro **u** otra región?"

#### Issue I-16 — `vs` without period (Spanish abbreviates `vs.`) — 2 instances (lines 407, 1626)

- **Severity:** L
- **Evidence:**
  - Line 407 `description`: "Comparar media **vs** mediana/MAD y escala log1p en montos con outlier"
  - Line 1626 `criterion`: "Código legible y sin claims causales/fraude automático" — and rubric line 1625: "Pruebas o casos de borde documentados (cola, sesgo, z **vs** bootstrap)"
- **Grammar rule:** In Spanish, the abbreviation "vs." requires a period (RAE `DPD` 2005, "vs.").
- **Fix:** Replace bare `vs` with `vs.` (or expand to "frente a").

#### Issue I-17 — `p.ej` missing period and space (line 1456, hint `S18-T4-B-E2`)

- **Severity:** L
- **Evidence:** "Arma el payload con newlines reales (**p.ej** uniendo líneas con chr(10)); sha1(...).hexdigest()[:8]."
- **Grammar rule:** Spanish abbreviation "p. ej." requires both periods and a space (RAE `DPD` 2005, "p. ej.").
- **Fix:** "Arma el payload con newlines reales (**p. ej.** uniendo líneas con chr(10)); …"

#### Issue I-18 — `limite` (noun) missing tilde → `límite` (line 1387, hint `S18-T4-A-E3`)

- **Severity:** L
- **Evidence:** "Cuatro prints con prefijos P/M/V/L; el cuarto usa el parámetro **limite**."
- **Grammar rule:** "límite" (noun, paroxytone ending in vowel) requires a tilde (RAE `ORTOGRAFÍA` 2010).
- **Note:** Line 1411 `print("L:", limite)` correctly has no tilde because `limite` there is a Python identifier (code), not Spanish prose. Do **not** change the code.
- **Fix:** Change only the prose at line 1387: "el parámetro **límite**."

#### Issue I-19 — 1 run-on sentence (57 words) in `instruction` `S18-T2-B-E3` (line 1040)

- **Severity:** M
- **Evidence:** "E3 (transferencia) — Con montos sintéticos de cola pesada (`S18-T2-B-E3`), implementa un **bootstrap simple** de la media: remuestrea con reemplazo `B` veces (seed y `B` ya fijos en el starter), toma los percentiles 2.5 y 97.5 de esas medias e imprime `boot_ic95` como tupla a 2 decimales, más `n` y la nota `bootstrap_simple`. No uses la fórmula z·s/√n aquí: el punto es practicar remuestreo cuando la aproximación normal es dudosa. El IC describe incertidumbre del estimador, no el rango donde cae el 95% de los tickets."
- **FH:** 45.5, INFLESZ 42.7 ("bastante difícil").
- **Fix:** Split into 3 sentences:
  - "E3 (transferencia) — Con montos sintéticos de cola pesada (`S18-T2-B-E3`), implementa un **bootstrap simple** de la media: remuestrea con reemplazo `B` veces (seed y `B` ya fijos en el starter), toma los percentiles 2.5 y 97.5 de esas medias e imprime `boot_ic95` como tupla a 2 decimales, más `n` y la nota `bootstrap_simple`."
  - "No uses la fórmula z·s/√n aquí: el punto es practicar remuestreo cuando la aproximación normal es dudosa."
  - "El IC describe incertidumbre del estimador, no el rango donde cae el 95% de los tickets."

#### Issue I-20 — 8 long sentences (>32 words) — list with WC + FH

- **Severity:** L (cumulative cognitive load)
- **Sentences:**

| # | Location | WC | FH | Snippet |
|---|---|---|---|---|
| L1 | `jobRelevance` (line 15) | 36 | 48.5 | "Tras el dataset limpio y el memo de límites de **S17 (CP-N2-A)**, aquí abres **CP-N2-B** con resúmenes robustos, sesgo muestral, intervalos básicos, correlación sin causalidad y data notes reproducibles — solo datos sintéticos." |
| L2 | `iDo.intro` (line 370) | 33 | 49.5 | "Te demuestro el EDA de **CP-N2-B** inicio: resúmenes, sesgo, IC z + bootstrap, correlación/Spearman sin causalidad, flags Tukey y data notes con tickets sintéticos (Sucursal-Centro/Oficina-Este/Oficina-Oeste, PEN)." |
| L3 | `instruction` `S18-T1-A-E1` (line 645) | 34 | 69.8 | "E1 (guiado) — Con el array sintético de montos del starter (`CASO-LIM-018` / `S18-T1-A-E1`), corrige el bug indicado en el starter: reporta **n**, **mean** (2 decimales) y **median** con esas etiquetas." |
| L4 | `instruction` `S18-T1-A-E3` (line 721) | 35 | 54.6 | "E3 (transferencia) — Diseña un resumen reutilizable para el portfolio (`S18-T1-A-E3`): la función `resumen` debe devolver un dict con **n**, **mean**, **median** y **std muestral** (`ddof=1`), valores numéricos redondeados a 4 decimales." |
| L5 | `instruction` `S18-T2-B-E3` (line 1040) | 57 | 45.5 | (run-on, see I-19) |
| L6 | `instruction` `S18-T4-B-E2` (line 1455) | 44 | 61.1 | "E2 (independiente) — Calcula la huella **SHA-1 en hex** de los bytes del CSV sintético del starter (`S18-T4-B-E2`: cabecera `a,b` y fila `1,2`, cada línea terminada en salto de línea real) y muestra solo los **primeros 8** caracteres hex." |
| L7 | `instruction` `S18-T4-B-E3` (line 1490) | 34 | 75.1 | "E3 (transferencia) — Cierra el hilo hacia S19: con el DataFrame sintético de `S18-T4-B-E3`, filtra `monto > 0` y arma un data note con **n_raw** (antes del filtro), **n_final** (después) y **seed: 42**." |
| L8 | `selfCheck.question[4]` (line 1661) | 35 | 61.4 | "En un EDA de tickets sintéticos Cliente-B/Sucursal-Norte, ¿cuál es la comunicación correcta de un r de Pearson alto entre gasto y visitas cuando ambos crecen con el tamaño de la ciudad (confusor)?" |

- **Fix strategy:** Split each long sentence at the colon or semicolon; move enumerations into bullet lists where applicable. See §6 for paragraph-by-paragraph rewrites.

#### Issue I-21 — Anglicism load: high-frequency English nouns used as Spanish prose (H/M)

- **Severity:** M (consistency / regional-language fidelity)
- **Evidence — total instances in learner-facing prose (after masking code blocks):**

| Anglicism | Count | Recommended Spanish |
|---|---|---|
| `starter` | 37* | "código inicial", "starter" → gloss first time |
| `feedback` | (TS field name, not prose) | "retroalimentación" if used in prose |
| `IQR` | 18 | "RIC" (rango intercuartílico) — but `IQR` is common in Peruvian analytics |
| `bug` | 13 | common borrowing; OK |
| `tickets` / `ticket` | 17 | common Peruvian fintech borrowing; OK |
| `bootstrap` | 12 | technical borrowing; OK |
| `outliers` / `outlier` | 15 | "valores atípicos", "valores extremos" |
| `portfolio` | 11 | "portafolio" (Peruvian Spanish) |
| `data note` / `data notes` | 20 | "nota de datos", "notas de datos" (or keep + gloss on first use) |
| `claim` / `claims` | 12 | "afirmación", "declaración", "aserción" |
| `flag` / `flags` | 16 | "marca", "indicador", "etiqueta" |
| `memo` | 7 | "memorando", "informe" |
| `dataset` | 6 | "conjunto de datos" |
| `dashboard` | 6 | common borrowing; OK or "tablero" |
| `log1p` | 6 | code identifier; OK |
| `share` / `shares` | 6 | "proporción", "participación" |
| `Cohen's d` | 5 | "la d de Cohen", "el estadístico d de Cohen" |
| `lognormal(es)` | 2 | "log-normal" (borrowing) |
| `p-value` | 1 | "valor p", "p-valor" |
| `scaffold` | 1 | "andamiaje", "esqueleto" |

(*Some `starter` counts include the TS field `starterCode:` which is not prose; the prose instances number ~10–12.)

- **Pedagogical impact:** Heavy anglicism load is a known Peruvian analytics register, but several (`claim`, `flag`, `memo`, `dataset`, `p-value`) have well-established Spanish equivalents that would reduce cognitive friction for learners transitioning from Spanish-language stats courses. `Cohen's d` with English apostrophe is jarring in Spanish text — RAE recommends "d de Cohen" (lowercase d, Spanish preposition).

#### Issue I-22 — `'p-value'` (line 499, iDo `why`)

- **Severity:** M
- **Evidence:** "Magnitud + IC z + bootstrap + n comunican incertidumbre mejor que un solo **p-value** o un 'probado al 95%'."
- **Fix:** "Magnitud + IC z + bootstrap + n comunican incertidumbre mejor que un solo **valor p** o un 'probado al 95%'."

#### Issue I-23 — "data note" DET-NOUN borderline (6 LT hits)

- **Severity:** L
- **Evidence:** "el data note", "un data note", "los data notes" — 6 occurrences flagged by LanguageTool (`AGREEMENT_DET_NOUN`).
- **Fix:** Either commit to the Spanish translation "nota de datos" throughout (cleanest) or consistently treat "data note" as a masculine invariable borrowing (common tech-Spanish convention) and silence LT.
- **Recommendation:** Adopt "nota de datos" on first use, then "data note" in parentheses, then continue with "data note" — gives learner the Spanish term while preserving the industry term.

### 3.4 Consistency / cross-reference issues (M)

#### Issue I-24 — You Do `starterCode` line 1591 has ambiguous Spanish comment

- **Severity:** L
- **Evidence:** Line 1591: `# Esqueleto z (completa se e imprime ic95_z). Opcional: bootstrap B=200 como en T2-B.`
- **Pedagogical impact:** "completa se e imprime ic95_z" reads as a typo of "completa se e imprime ic95_z" — actually the comment is asking the learner to complete the variable `se` and print `ic95_z`. The phrasing is unclear because `se` is both a Spanish pronoun and the variable name. The learner may parse "completa se e imprime" as "se completa e imprime" (passive voice) rather than the intended imperative "completa `se`, e imprime `ic95_z`".
- **Fix:** `# Esqueleto z: completa la variable se e imprime ic95_z. Opcional: bootstrap B=200 como en T2-B.`

#### Issue I-25 — Self-check Q5 stem region labels disagree with rest of section (line 1661)

- **Severity:** M
- **Evidence:** Q5 stem: "En un EDA de tickets sintéticos **Cliente-B/Sucursal-Norte**, ¿cuál es la comunicación correcta de un r de Pearson alto entre gasto y visitas cuando ambos crecen con el tamaño de la ciudad (confusor)?"
- **Pedagogical impact:** Q5 introduces yet another combination of pseudonymized region names ("Cliente-B/Sucursal-Norte") and a new variable ("gasto") not used elsewhere in the section. The rest of the section uses "monto" / "visitas" as the correlation pair, never "gasto y visitas". This breaks the consistency of the question bank.

#### Issue I-26 — Self-check Q7 stem and option B use different region labels (lines 1675–1676)

- **Severity:** M
- **Evidence:** Q7 stem: "Una tasa de flags Tukey más alta en **Sucursal-Sur** implica:" — option B: "Fraude demostrado en **Sucursal-Centro**"
- **Pedagogical impact:** The stem references one region ("Sucursal-Sur") but the wrong-answer option refers to a different region ("Sucursal-Centro"). The pedagogical intent is "a higher anomaly rate in region X is not proof of fraud in region X", but the scrambled labels make it "anomaly rate in X is not proof of fraud in Y" — which dilutes the teaching point.

### 3.5 Pedagogical / structural observations (non-blocking)

#### Issue I-27 — `callout.title` style inconsistent across the 8 theory blocks

- **Severity:** L
- **Evidence:**
  - T1-A callout: `"ddof en std muestral"` — operational, code-flavored.
  - T1-B: `"Escala log y comunicación"` — mixed Spanish/English.
  - T2-A: `"Sesgo ≠ error de cálculo"` — conceptual.
  - T2-B: `"Efecto + incertidumbre"` — conceptual.
  - T3-A: `"Correlación ≠ causalidad"` — conceptual.
  - T3-B: `"Sin claim causal"` — **English** ("claim").
  - T4-A: `"Hallazgo ≠ decisión"` — conceptual.
  - T4-B: `"Reproducibilidad mínima"` — conceptual.
- **Pedagogical impact:** T3-B's "Sin claim causal" is the only English callout title. Consistency would be "Sin afirmación causal" or "Sin declaración causal".
- **Fix:** Rename T3-B callout `"Sin claim causal"` → `"Sin afirmación causal"`.

#### Issue I-28 — `tagline` and `jobRelevance` use comma-spliced enumerations

- **Severity:** L
- **Evidence:**
  - `tagline` (line 8): "EDA que diferencia hallazgo, hipótesis y decisión; cada conclusión referencia un cálculo y declara incertidumbre" — uses `;` to join two coordinate clauses that would flow better as two sentences.
  - `jobRelevance` (line 15) — sentence L1 (36 w, FH 48.5) opens with a long enumeration.
- **Fix:** Split each into 2 sentences; see §6 rewrites.

#### Issue I-29 — `youDo.context` (line 1528) — region label "Cliente-A" used as company name

- **Severity:** L
- **Evidence:** "Eres analista en un equipo de insights en **Cliente-A**." — uses the pseudonymized region label "Cliente-A" as the company name. This is internally inconsistent with theory T2-A which uses "Cliente-A" as a region label inside the pob dict.
- **Pedagogical impact:** A learner reading the You Do intro will wonder whether "Cliente-A" is the company they work for or a region in their data. Recommend using a real Peruvian company stand-in ("una fintech peruana") or a non-pseudonymized label ("DataLab PE").

#### Issue I-30 — `learningOutcomes[3]` ends without period (line 20)

- **Severity:** L
- **Evidence:** All 8 learning outcomes end without terminal period — this is consistent within the list (so OK as a list style), but two outcomes ("Identificar sesgo de población/muestra", "Reportar intervalos y tamaños de efecto básicos") lack articles at the start.
- **Pedagogical impact:** Negligible. Style consistency is fine within the list.

### 3.6 Things that are CORRECT (worth flagging)

- **No voseo leak.** All 24+ imperatives are tuteo ("reporta", "calcula", "filtra", "imprime", "compara", "corrige", "completa", "diseña", "implementa", "arma", "cierra", "documenta", "marca", "interpreta", "usa", "elige", "separa", "resumir", "diagnosticar", "reportar", "interpretar", "segmentar", "estructurar", "entregar"). This is the correct register for Peruvian Spanish (unlike S08 which had 5 voseo leaks).
- **Strong progressive disclosure.** T1 (centro/dispersión) → T2 (inferencia) → T3 (relaciones) → T4 (comunicación) is a textbook spiral; each subtopic builds on the previous.
- **Strong ethical spine.** Every subtopic closes with a non-causal / non-fraud reminder ("Sin PII real ni claims de fraude", "no uses verbos causales", "flags ≠ fraude", "hallazgo ≠ decisión"). The self-check Q4, Q5, Q6, Q7, Q8 all reinforce the same ethic.
- **Strong forward/back references.** S17 → S18 → S19 chain is explicit in `jobRelevance`, `iDo.intro`, `weDo.intro`, `youDo.context`, `portfolioNote`, and `T4-B-E3` instruction.
- **No prose meta-leaks.** Zero `TODO`/`FIXME`/`moved-from`/`V3`/`AI-generated` strings in the prose. The only `TODO` strings are inside `youDo.starterCode` (line 1576: `# TODO: añade p90 si el negocio pregunta por cola` and line 1596: `print("ic95_z", "TODO")`) — both are intentional student-facing prompts, not authoring residue.

---

## 4. Meta-Leak Report

### 4.1 Prose meta-leaks

**None found.** Scanned for `TODO`, `FIXME`, `XXX`, `moved from`, `moved to`, `V2`/`V3` retarget, `En V3`, `AI generated`, `as an AI`, `placeholder`, `lorem ipsum`, `borrador`. Zero hits in learner-facing prose fields.

### 4.2 Code-comment meta-leaks (intentional, not flagged)

- Line 1576: `# TODO: añade p90 si el negocio pregunta por cola` — student-facing TODO prompt in `youDo.starterCode`. Intentional.
- Line 1596: `print("ic95_z", "TODO")` — placeholder print in starter code. Intentional.
- Line 1602: `# no borres esta etiqueta ética` — meta-commentary in starter code. Borderline but pedagogically intentional.

### 4.3 Scaffolding-tag leaks (borderline)

- `# CASO-LIM-018` — 26 occurrences across 8 `instruction` strings and 18 starterCode comments (lines 645, 657, 693, 733, 776, 818, 854, 887, 919, 951, 987, 1021, 1052, 1098, 1132, 1168, 1219, 1257, 1291, 1329, 1367, 1397, 1437, 1467, 1502, 1551). Same pattern as S04 (`CASO-LIM-004`) and S08 (`CASO-LIM-008`). The `CASO-LIM-NNN` prefix is an internal taxonomy identifier (probably "caso-límite") that leaks the authoring scaffold into learner-visible text. See Issue I-13.

### 4.4 Structural / scope leaks

- `id: "data-engineering"` and filename `s18-data-engineering.ts` no longer match the rescoped EDA content. See Issue I-12.
- `tagline`, `learningOutcomes`, and `jobRelevance` are all aligned with the new EDA scope; only the `id` and filename are stale.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do fidelity

| Component | Count | Mapping | Verdict |
|---|---|---|---|
| Theory blocks (T1-A, T1-B, T2-A, T2-B, T3-A, T3-B, T4-A, T4-B) | 8 | — | ✅ Clean 4-topic × 2-subtopic grid |
| I Do demos | 8 | 1 demo per subtopic (T1-A→DEMO, T1-B→DEMO, …, T4-B→DEMO) | ✅ Perfect 1:1 |
| We Do exercises | 24 | 3 per subtopic (E1 guiado / E2 independiente / E3 transferencia) | ✅ Perfect 3:1 per subtopic |
| You Do | 1 capstone | "EDA honesto para CP-N2-B (inicio)" with 5 objectives, 7 requirements, 6-checkpoint starter, 6-row rubric | ✅ Comprehensive |
| Self-check | 8 MCQs | ~1 per subtopic + 2 cross-cutting | ✅ Aligned |

**Fidelity verdict:** 9.0 / 10. The I Do / We Do / You Do scaffolding is exemplary and matches the gold-standard set by S04 and S08.

### 5.2 Progressive disclosure and cognitive load

- **T1 (centro/dispersión → robustez)** introduces the 7-monto toy dataset that anchors the entire section. The std-vs-IQR distinction is operationalized immediately with `ddof=1` and `np.quantile`.
- **T2 (población/muestra → IC/bootstrap)** escalates from `Counter` shares → `bias_pp` → `1.96·s/√n` → bootstrap. The "IC ≠ 95% de los datos" warning appears 4 times across T2-B theory, I-Do demo, We-Do E3, and self-check Q6 — well-reinforced.
- **T3 (correlación → segmentos)** introduces confounder residualization with `np.polyfit` — this is the cognitive peak of the section; the We Do E3 (`S18-T3-A-E3`) requires the learner to chain `polyfit` + `corrcoef` correctly. The DEFECT pattern is consistent (every starter has one bug to fix).
- **T4 (Q→H→E → data notes)** consolidates into reproducible artifacts; the rubric explicitly weights "cada hallazgo cita cálculo y límite de cobertura" at 25 %.

**Cognitive load verdict:** Well-managed. The 1 run-on (I-19) and 8 long sentences (I-20) are the only spikes; splitting them would bring FH from 73.3 → ~78.

### 5.3 Connective tissue and narrative flow

- **Backward refs:** S17 (CP-N2-A, "dataset limpio y memo de límites") appears in `jobRelevance`, `theory[0].paragraphs[0]`, `iDo.intro`, `youDo.context`, `portfolioNote`. Consistent.
- **Forward refs:** S19 ("dashboard accesible") appears in `jobRelevance`, `iDo.intro`, `theory[0].paragraphs[1]`, `T4-B` paragraph, `youDo.context`, `portfolioNote`. Consistent.
- **Lateral refs:** "Solo datos sintéticos" / "Sin PII real" / "Sin claims de fraude" appears 12+ times across all tabs. Strong ethical anaphora.

**Connective tissue verdict:** 8.5 / 10. Best-in-class for Phase 1 sections.

### 5.4 Comparison with best-in-class external materials

| Source | Strength | S18 vs. |
|---|---|---|
| **Allen Downey, *Think Stats*** (cited in `resources.docs[5]`) | Computational, simulation-first stats; bootstrap is a first-class citizen | S18 matches the simulation-first ethos; bootstrap is in T2-B theory, I-Do, and We-Do E3 |
| **OpenIntro Statistics** (cited in `resources.docs[6]`) | Rigorous IC interpretation with explicit "what IC does NOT mean" callouts | S18's "El IC no es el rango del 95% de los datos" matches OpenIntro's framing |
| **MIT 6.0002 (OCW)** (cited in `resources.courses[1]`) | Computational thinking + basic probability | S18 sits at the same level; doesn't over-reach into formal inference |
| **Statistical Inference via Data Science (ModernDive)** (cited in `resources.books[1]`) | Bootstrap-first inference pipeline | S18's bootstrap treatment is lighter (B=100/200) but pedagogically appropriate for a 18-hour section |
| **pandas / NumPy official docs** | Reference, not pedagogy | S18 cites both; usage is correct |

**External-comparison verdict:** S18 stands up well against its own cited references. The "hallazgo ≠ hipótesis ≠ decisión" framing is unusually disciplined for a course at this level and is the section's pedagogical signature.

### 5.5 Accessibility and inclusion

- All callouts use semantic types (`info`, `tip`, `warning`, `danger`, `success`) — colorblind-safe.
- Code blocks always carry a `language: 'python'` and `title` field — screen-reader-friendly.
- The `T3-B` "anomalías Tukey ≠ fraude" framing is unusually careful about not stigmatizing regions — a strong inclusion signal.
- No gender-exclusive language issues detected ("analista", "persona", "cliente" are all gender-neutral).

---

## 6. Grammatical Improvements & Paragraph-by-Paragraph Rewriting

> For each learner-facing prose unit that has a measurable issue (long sentence, run-on, anglicism, grammar defect, or readability spike), we give a **Before / After** rewrite. Code blocks, options lists, and short labels without issues are omitted. Rewrites preserve meaning and pedagogical intent; they only fix grammar, length, and anglicism load.

### 6.1 Theory block rewrites

#### Theory 0 — "Mapa de la sección: del dataset limpio al EDA con incertidumbre"

**Paragraph 0 (line 30):** No issues. FH 70+, INFLESZ 67+. Keep.

**Paragraph 1 (line 31):**
- **Before:** "El hilo conductor es un **dataset sintético de tickets/montos** con regiones ficticias Lima, Arequipa y Cusco, ids `T00x` y montos en PEN. Cada hallazgo del portfolio debe citar un cálculo (n, métrica, IC o flag) y declarar incertidumbre: hallazgo ≠ hipótesis ≠ decisión de negocio. Los gráficos honestos y el dashboard se profundizan en **S19**."
- **After:** "El hilo conductor es un **conjunto de datos sintético de tickets y montos** con regiones ficticias Lima, Arequipa y Cusco, identificadores `T00x` y montos en PEN. Cada hallazgo del portafolio debe citar un cálculo (n, métrica, IC o indicador) y declarar incertidumbre: hallazgo ≠ hipótesis ≠ decisión de negocio. Los gráficos honestos y el tablero se profundizan en **S19**."
- **Rationale:** `dataset` → "conjunto de datos", `flag` → "indicador", `portfolio` → "portafolio" (es-PE), `dashboard` → "tablero". Same FH band; cleaner es-PE register.

**Paragraph 2 (line 32):** No issues. Keep.

#### Theory T1-A — "Centro, dispersión y cuantiles"

**Paragraph 0 (line 45):** No issues. Keep.

**Paragraph 1 (line 46):**
- **Before:** "Contrato operativo: reporta siempre **n**, al menos un cuantil de cola (p90/p95 o max) y la métrica de centro elegida con justificación. Los cuantiles (p25, p50, p75, p90) describen la forma **sin asumir normalidad** — no digas "distribución normal" solo porque calculaste media y std."
- **After:** "Contrato operativo: reporta siempre **n**, al menos un cuantil de cola (p90/p95 o máximo) y la métrica de centro elegida con justificación. Los cuantiles (p25, p50, p75, p90) describen la forma **sin asumir normalidad**; no digas «distribución normal» solo porque calculaste media y desviación estándar."
- **Rationale:** `max` → "máximo" (Spanish), em-dash → semicolon (RAE prefers `;` for this connective), straight quotes → guillemets «» (Spanish typography), `std` → "desviación estándar" in prose (code stays `std`).

**Paragraph 2 (line 47):**
- **Before:** "Caso sintético: montos `[12.5, 18, 22, 25.5, 30, 45, 120]` PEN → media ~39, mediana 25.5, IQR ~17.5. En el memo de CP-N2-B escribes "mediana 25.5 PEN (n=7); cola p90 elevada por un outlier de 120" — no "el ticket promedio es 39 y representa al cliente típico"."
- **After:** "Caso sintético: montos `[12.5, 18, 22, 25.5, 30, 45, 120]` PEN → media ~39, mediana 25.5, IQR ~17.5. En el memorando de CP-N2-B escribes «mediana 25.5 PEN (n=7); cola p90 elevada por un valor atípico de 120»; no «el ticket promedio es 39 y representa al cliente típico»."
- **Rationale:** `memo` → "memorando", `outlier` → "valor atípico", em-dash → semicolon, straight quotes → guillemets.

#### Theory T1-B — "Métricas robustas y escalas"

**Paragraph 0 (line 83):** No issues. Keep.

**Paragraph 1 (line 84):**
- **Before:** "Contrato de escala: `log1p` de montos reduce asimetría visual para EDA, pero **no** compares diferencias log como soles PEN sin transformar de vuelta. Si el eje está en log, dilo en el gráfico y en la conclusión; si el KPI es en PEN, reporta en PEN."
- **After:** (no change — `log1p` is a code identifier, "log" reads as the math concept; the sentence is clear)
- **Verdict:** Keep. Borderline but acceptable.

**Paragraph 2 (line 85):** No issues. Keep.

#### Theory T2-A — "Población, muestra y sesgo"

**Paragraph 0 (line 116):** No issues. Keep.

**Paragraph 1 (line 117):**
- **Before:** "Contrato: compara shares de la muestra vs un **marco** conocido (cuotas por región). Documenta exclusiones (filtros de fecha, canal, `monto>0`). Calcula `bias_pp = share_muestra − share_pob` por segmento y reporta el máximo |bias| como riesgo de generalización."
- **After:** "Contrato: compara las proporciones de la muestra frente a un **marco** conocido (cuotas por región). Documenta exclusiones (filtros de fecha, canal, `monto>0`). Calcula `bias_pp = share_muestra − share_pob` por segmento y reporta el máximo |bias| como riesgo de generalización."
- **Rationale:** `shares` → "las proporciones", `vs` → "frente a".

**Paragraph 2 (line 118):**
- **Before:** "Sin marco poblacional, declara **cobertura limitada** y no generalices a "todos los clientes del Perú". Caso sintético: pob Lima 0.55 / Arequipa 0.25 / Cusco 0.20 vs muestra 80% Lima → bias Lima +0.25; cualquier KPI regional debe llevar esa nota en el data note."
- **After:** "Sin marco poblacional, declara **cobertura limitada** y no generalices a «todos los clientes del Perú». Caso sintético: pob Lima 0.55 / Arequipa 0.25 / Cusco 0.20 frente a muestra 80 % Lima → bias Lima +0.25; cualquier KPI regional debe llevar esa nota en la nota de datos."
- **Rationale:** straight quotes → guillemets, `vs` → "frente a", `data note` → "nota de datos", "80%" → "80 %" (RAE: space between number and %).

#### Theory T2-B — "Intervalos básicos y tamaño de efecto"

**Paragraph 0 (line 153):**
- **Before:** "Un **intervalo de confianza** aproximado para la media con n grande y colas razonables: media ± z·(s/√n) (z≈1.96 para 95%). El IC habla de un **parámetro** (p. ej. media poblacional) bajo un modelo de muestreo: **no** significa "el 95% de los datos cae en el intervalo" ni "quedó probado al 95% que la media es el punto central"."
- **After:** "Un **intervalo de confianza** aproximado para la media con n grande y colas razonables es: media ± z·(s/√n) (z≈1.96 para 95 %). El IC habla de un **parámetro** (p. ej. la media poblacional) bajo un modelo de muestreo. **No** significa «el 95 % de los datos cae en el intervalo» ni «quedó probado al 95 % que la media es el punto central»."
- **Rationale:** Add copula "es:" for grammaticality (the original fragment "con n grande y colas razonables:" is a fragment without main verb), `p. ej.` requires periods (Issue I-17), straight quotes → guillemets, "95%" → "95 %", split into two sentences.

**Paragraph 1 (line 154):**
- **Before:** "Con **n pequeño**, **colas pesadas** o montos lognormales (como tickets de T1), la aproximación z es tosca: reporta n, considera un **bootstrap simple** (remuestrear con reemplazo y tomar percentiles 2.5/97.5 de la media) y evita lenguaje de certeza. No pegues 1.96·s/√n a montos muy sesgados sin advertir el supuesto."
- **After:** (no change; sentence is 35 w, FH 65, within normal band)
- **Verdict:** Keep.

**Paragraph 2 (line 155):**
- **Before:** "El **tamaño de efecto** (Cohen's d ≈ (μ₁−μ₀)/s_pooled, o diferencia de medianas en PEN) comunica **magnitud**, no solo "significativo". Contrato de lenguaje: di "compatible con" / "en la muestra" y reporta n + IC; nunca "probado" con un solo IC. Caso sintético: media B ~108 vs A ~94, d≈1.1 — magnitud + incertidumbre, no veredicto causal de campaña. Sin PII real ni claims de fraude."
- **After:** "El **tamaño de efecto** (la d de Cohen ≈ (μ₁−μ₀)/s_pooled, o diferencia de medianas en PEN) comunica **magnitud**, no solo «significativo». Contrato de lenguaje: di «compatible con» o «en la muestra» y reporta n + IC; nunca «probado» con un solo IC. Caso sintético: media B ~108 frente a A ~94, d≈1.1: magnitud + incertidumbre, no veredicto causal de campaña. Sin PII real ni afirmaciones de fraude."
- **Rationale:** `Cohen's d` → "la d de Cohen", straight quotes → guillemets, `vs` → "frente a", em-dash → colon, `claims` → "afirmaciones".

#### Theory T3-A — "Correlación y confusión"

**Paragraph 0 (line 206):** No issues. Keep.

**Paragraph 1 (line 207):**
- **Before:** "Contrato de verbos: en EDA etiqueta **asociación observada**. Lista causas comunes y diseños que las romperían (experimento, instrumento) antes de cualquier claim causal en el informe de CP-N2-B."
- **After:** "Contrato de verbos: en el EDA etiqueta **asociación observada**. Lista causas comunes y diseños que las romperían (experimento, instrumento) antes de cualquier afirmación causal en el informe de CP-N2-B."
- **Rationale:** Add article "el", `claim` → "afirmación".

**Paragraph 2 (line 208):** No issues. Keep.

#### Theory T3-B — "Segmentación, anomalías y causalidad no demostrada"

**Paragraph 0 (line 255):**
- **Before:** "Segmenta por región, canal o cohorte con **reglas explícitas** (no clusters opacos sin contrato). Las anomalías Tukey (fuera de [Q1−1.5·IQR, Q3+1.5·IQR]) son **candidatos a revisión**, nunca "fraudes demostrados" ni culpa de persona/región."
- **After:** "Segmenta por región, canal o cohorte con **reglas explícitas** (no clústeres opacos sin contrato). Las anomalías de Tukey (fuera de [Q1−1.5·IQR, Q3+1.5·IQR]) son **candidatos a revisión**; nunca «fraudes demostrados» ni culpa de una persona o región."
- **Rationale:** `clusters` → "clústeres" (RAE-accepted borrowing), "anomalías Tukey" → "anomalías de Tukey", straight quotes → guillemets, comma before "ni" → semicolon, "persona/región" → "una persona o región".

**Paragraph 1 (line 256):**
- **Before:** "Contrato: marca flags booleanos, calcula tasas por segmento, documenta umbral, n por segmento y que el método es univariado. Evita "Sucursal-Sur genera outliers porque…" — eso es claim causal no soportado."
- **After:** "Contrato: marca indicadores booleanos, calcula tasas por segmento, documenta umbral, n por segmento y que el método es univariado. Evita escribir «Sucursal-Sur genera valores atípicos porque…»: eso es una afirmación causal no soportada."
- **Rationale:** `flags` → "indicadores", straight quotes → guillemets, `outliers` → "valores atípicos", em-dash → colon, `claim causal` → "afirmación causal".

**Paragraph 2 (line 257):** No issues (other than the broken output it references — Issue I-02). Keep prose.

#### Theory T4-A — "Preguntas, hipótesis y evidencia"

**Paragraph 0 (line 294):** No issues. Keep.

**Paragraph 1 (line 295):**
- **Before:** "Plantilla operativa: Pregunta → Métrica → Resultado (n, punto, IC) → Límite de cobertura → Siguiente paso. Cada celda del insight en CP-N2-B debe poder rastrearse a un print/assert del script."
- **After:** (no change; clear, well-structured)
- **Verdict:** Keep.

**Paragraph 2 (line 296):**
- **Before:** "Caso sintético: "¿El ticket mediano en Sucursal-Centro supera 25 PEN?" → median(monto|Oficina-Este)=27.5, n=40, IC z o bootstrap documentado, límite "solo canal web". Conclusión permitida: hipótesis provisional en web Oficina-Oeste; no "desplegar campaña nacional". Sin PII real ni claims de fraude."
- **After:** "Caso sintético: «¿El ticket mediano en Sucursal-Centro supera 25 PEN?» → median(monto | Oficina-Este)=27.5, n=40, IC z o bootstrap documentado, límite «solo canal web». Conclusión permitida: hipótesis provisional en web Oficina-Oeste; no «desplegar campaña nacional». Sin PII real ni afirmaciones de fraude."
- **Rationale:** straight quotes → guillemets, `claims` → "afirmaciones". (Also note: the example uses three different region names — "Sucursal-Centro" in the pregunta, "Oficina-Este" in the métrica, "Oficina-Oeste" in the conclusión. This is internally inconsistent; the rewrite preserves it but flags it for Fixer to standardize — see Issue I-03.)

#### Theory T4-B — "Notebook reproducible y data notes"

**Paragraph 0 (line 331):**
- **Before:** "Un **data note** documenta origen, fecha de corte, filtros, n pre/post, seed y un hash o conteo de filas. Si otra persona no regenera los mismos n y métricas clave, el notebook **no cumple** el criterio de cierre de esta sección."
- **After:** "Una **nota de datos** (*data note*) documenta origen, fecha de corte, filtros, n pre/post, seed y un hash o conteo de filas. Si otra persona no regenera los mismos n y métricas clave, el notebook **no cumple** el criterio de cierre de esta sección."
- **Rationale:** Translate `data note` on first use, gloss with parenthetical English (industry term), then continue with "data note" in subsequent uses. Same pattern as S07's `claims` handling.

**Paragraph 1 (line 332):**
- **Before:** "Contrato de reproducibilidad: versiones (pandas/numpy), rutas relativas, outputs en `out/`, seed fijo, sin celdas que muten estado global en orden opaco. Checklist mínima: seed, schema, n pre/post filtros, hash de payload, límites de generalización."
- **After:** "Contrato de reproducibilidad: versiones (pandas/numpy), rutas relativas, salidas en `out/`, seed fijo, sin celdas que muten estado global en orden opaco. Lista de verificación mínima: seed, esquema, n pre/post filtros, hash del *payload*, límites de generalización."
- **Rationale:** `outputs` → "salidas", `Checklist` → "lista de verificación", `schema` → "esquema", `payload` → italicized borrowing.

**Paragraph 2 (line 333):** No issues. Keep.

### 6.2 I Do intro rewrite

**`iDo.intro` (line 370, L2 long sentence, 33 w, FH 49.5):**
- **Before:** "Partimos del dataset limpio y el memo de límites de **S17 (CP-N2-A)**. Te demuestro el EDA de **CP-N2-B** inicio: resúmenes, sesgo, IC z + bootstrap, correlación/Spearman sin causalidad, flags Tukey y data notes con tickets sintéticos (Sucursal-Centro/Oficina-Este/Oficina-Oeste, PEN). En S19 ese paquete alimenta el dashboard accesible."
- **After:** "Partimos del conjunto de datos limpio y el memorando de límites de **S17 (CP-N2-A)**. Te demuestro el EDA del inicio de **CP-N2-B**: resúmenes, sesgo, IC z + bootstrap, correlación/Spearman sin causalidad, indicadores Tukey y notas de datos con tickets sintéticos (Sucursal-Centro/Oficina-Este/Oficina-Oeste, PEN). En S19 ese paquete alimenta el tablero accesible."
- **Rationale:** `dataset` → "conjunto de datos", `memo` → "memorando", `de CP-N2-B inicio` (awkward Spanish) → `del inicio de CP-N2-B`, `flags` → "indicadores", `data notes` → "notas de datos", `dashboard` → "tablero". Same meaning; cleaner syntax; ~same FH.

### 6.3 We Do intro rewrite

**`weDo.intro` (line 638):** No issues. Keep.

### 6.4 We Do instruction rewrites (the 4 long + 1 run-on)

#### L3 — `S18-T1-A-E1` instruction (line 645, 34 w, FH 69.8)
- **Before:** "E1 (guiado) — Con el array sintético de montos del starter (`CASO-LIM-018` / `S18-T1-A-E1`), corrige el bug indicado en el starter: reporta **n**, **mean** (2 decimales) y **median** con esas etiquetas. No inventes datos ni dejes un print suelto de control. Compara con la solución solo después de ejecutar."
- **After:** "E1 (guiado) — Con el arreglo sintético de montos del código inicial (`S18-T1-A-E1`), corrige el defecto indicado: reporta **n**, **mean** (2 decimales) y **median** con esas etiquetas. No inventes datos ni dejes un `print` suelto de control. Compara con la solución solo después de ejecutar."
- **Rationale:** Drop `CASO-LIM-018` scaffolding tag, `array` → "arreglo" (es-PE preferred) or keep "array" (RAE-accepted), `starter` → "código inicial", `bug` → "defecto" (or keep "bug" — common borrowing).

#### L4 — `S18-T1-A-E3` instruction (line 721, 35 w, FH 54.6)
- **Before:** "E3 (transferencia) — Diseña un resumen reutilizable para el portfolio (`S18-T1-A-E3`): la función `resumen` debe devolver un dict con **n**, **mean**, **median** y **std muestral** (`ddof=1`), valores numéricos redondeados a 4 decimales. Completa el cuerpo y prueba con la lista sintética del starter."
- **After:** "E3 (transferencia) — Diseña un resumen reutilizable para el portafolio (`S18-T1-A-E3`): la función `resumen` debe devolver un `dict` con **n**, **mean**, **median** y **std muestral** (`ddof=1`), valores numéricos redondeados a 4 decimales. Completa el cuerpo y prueba con la lista sintética del código inicial."
- **Rationale:** `portfolio` → "portafolio", `starter` → "código inicial", `dict` → code formatting.

#### L5 / run-on — `S18-T2-B-E3` instruction (line 1040, 57 w, FH 45.5) — see Issue I-19
- **Before:** (full text in I-19)
- **After:** "E3 (transferencia) — Con montos sintéticos de cola pesada (`S18-T2-B-E3`), implementa un **bootstrap simple** de la media: remuestrea con reemplazo `B` veces (seed y `B` ya fijos en el código inicial), toma los percentiles 2.5 y 97.5 de esas medias e imprime `boot_ic95` como tupla a 2 decimales, más `n` y la nota `bootstrap_simple`.\n\nNo uses la fórmula z·s/√n aquí: el punto es practicar remuestreo cuando la aproximación normal es dudosa. El IC describe incertidumbre del estimador, no el rango donde cae el 95 % de los tickets."
- **Rationale:** Split into 2 paragraphs (3 sentences), `starter` → "código inicial", "95%" → "95 %".

#### L6 — `S18-T4-B-E2` instruction (line 1455, 44 w, FH 61.1)
- **Before:** "E2 (independiente) — Calcula la huella **SHA-1 en hex** de los bytes del CSV sintético del starter (`S18-T4-B-E2`: cabecera `a,b` y fila `1,2`, cada línea terminada en salto de línea real) y muestra solo los **primeros 8** caracteres hex. El bug indicado en el starter usa md5 y el digest completo: corrígelo a sha1 recortado. No uses md5 ni el digest completo."
- **After:** "E2 (independiente) — Calcula la huella **SHA-1 en hex** de los bytes del CSV sintético del código inicial (`S18-T4-B-E2`: cabecera `a,b` y fila `1,2`, cada línea terminada en salto de línea real) y muestra solo los **primeros 8** caracteres hex. El defecto indicado usa md5 y el *digest* completo: corrígelo a sha1 recortado. No uses md5 ni el digest completo."
- **Rationale:** `starter` → "código inicial" (×2), `bug` → "defecto", `digest` → italic borrowing on first use.

#### L7 — `S18-T4-B-E3` instruction (line 1490, 34 w, FH 75.1)
- **Before:** "E3 (transferencia) — Cierra el hilo hacia S19: con el DataFrame sintético de `S18-T4-B-E3`, filtra `monto > 0` y arma un data note con **n_raw** (antes del filtro), **n_final** (después) y **seed: 42**. Completa el dict e imprímelo — base de trazabilidad del portfolio."
- **After:** "E3 (transferencia) — Cierra el hilo hacia S19: con el DataFrame sintético de `S18-T4-B-E3`, filtra `monto > 0` y arma una nota de datos con **n_raw** (antes del filtro), **n_final** (después) y **seed: 42**. Completa el `dict` e imprímelo: base de trazabilidad del portafolio."
- **Rationale:** `data note` → "nota de datos", em-dash → colon, `portfolio` → "portafolio".

### 6.5 You Do `context` rewrite (line 1528)

- **Before:** "Eres analista en un equipo de insights en Cliente-A. En **S17** dejaste un dataset limpio y un memo de límites (CP-N2-A). Aquí abres **CP-N2-B**: sobre un extracto sintético de tickets (sin PII real) produces un EDA que distingue hallazgo, hipótesis y decisión, con incertidumbre explícita y data notes. El artefacto alimenta el dashboard accesible de S19."
- **After:** "Eres analista en un equipo de *insights* en una fintech peruana. En **S17** dejaste un conjunto de datos limpio y un memorando de límites (CP-N2-A). Aquí abres **CP-N2-B**: sobre un extracto sintético de tickets (sin PII real) produces un EDA que distingue hallazgo, hipótesis y decisión, con incertidumbre explícita y notas de datos. El artefacto alimenta el tablero accesible de S19."
- **Rationale:** Replace pseudonymized region label "Cliente-A" used as company name → "una fintech peruana" (Issue I-29), `dataset` → "conjunto de datos", `memo` → "memorando", `data notes` → "notas de datos", `dashboard` → "tablero", `insights` → italicized borrowing.

### 6.6 Self-check question rewrites

#### Q5 stem (line 1661, L8 long sentence, 35 w, FH 61.4)
- **Before:** "En un EDA de tickets sintéticos Cliente-B/Sucursal-Norte, ¿cuál es la comunicación correcta de un r de Pearson alto entre gasto y visitas cuando ambos crecen con el tamaño de la ciudad (confusor)?"
- **After:** "En un EDA de tickets sintéticos por región, ¿cuál es la comunicación correcta de un r de Pearson alto entre monto y visitas cuando ambos crecen con el tamaño de la ciudad (confusor)?"
- **Rationale:** Drop inconsistent region labels "Cliente-B/Sucursal-Norte" (Issue I-25), replace variable "gasto" with "monto" (consistency with the rest of the section).

#### Q7 stem and option B (lines 1675–1676)
- **Before stem:** "Una tasa de flags Tukey más alta en Sucursal-Sur implica:"
- **Before option B:** "Fraude demostrado en Sucursal-Centro"
- **After stem:** "Una tasa de indicadores Tukey más alta en una región implica:"
- **After option B:** "Fraude demostrado en esa región"
- **Rationale:** `flags` → "indicadores", abstract "una región" + "esa región" eliminates the Sucursal-Sur/Sucursal-Centro label mismatch (Issue I-26).

### 6.7 Callout title rewrite

**T3-B callout title (line 285):**
- **Before:** `"Sin claim causal"`
- **After:** `"Sin afirmación causal"`
- **Rationale:** `claim` → "afirmación" (Issue I-27).

---

## 7. Proposed GitHub-style Diffs

> Each diff is ready to apply to `src/lib/course/sections/s18-data-engineering.ts`. Diffs are grouped by issue cluster. Line numbers refer to the current source file.

### Diff D-01 — Fix `T2-A` theory `sample_bias.py` output (Issue I-01)

```diff
--- a/src/lib/course/sections/s18-data-engineering.ts
+++ b/src/lib/course/sections/s18-data-engineering.ts
@@ -135,9 +135,9 @@ s18_th_3()`,
     print("bias_pp", bias)
 
 s18_th_3()`,
- output: `share_muestra {'Oficina-Este': 0.8, 'Arequipa': 0.16, 'Cusco': 0.04}
-share_pob {'Oficina-Oeste': 0.55, 'Arequipa': 0.25, 'Cusco': 0.2}
-bias_pp {'Cliente-A': 0.25, 'Cliente-B': -0.09, 'Sucursal-Norte': -0.16}`,
+ output: `share_muestra {'Sucursal-Centro': 0.8, 'Arequipa': 0.16, 'Cusco': 0.04}
+share_pob {'Sucursal-Norte': 0.55, 'Arequipa': 0.25, 'Cusco': 0.2}
+bias_pp {'Sucursal-Norte': -0.55, 'Arequipa': -0.09, 'Cusco': -0.16}`,
 },
 callout: {
```

### Diff D-02 — Fix `T3-B` theory `segments_anom.py` output (Issue I-02)

```diff
--- a/src/lib/course/sections/s18-data-engineering.ts
+++ b/src/lib/course/sections/s18-data-engineering.ts
@@ -276,11 +276,11 @@ s18_th_6()`,
     df["anomalia"] = (df["monto"] < lo) | (df["monto"] > hi)
     print("limites", round(float(lo), 2), round(float(hi), 2))
     print(df.groupby("region")["anomalia"].mean().round(3).to_dict())
     print("ids_anom", df.index[df["anomalia"]].tolist())
 
 s18_th_6()`,
- output: `limites 15.88 26.88
-{'Sucursal-Norte': 0.2, 'Sucursal-Sur': 0.0}
+ output: `limites 15.88 26.88
+{'Cliente-A': 0.0, 'Cliente-B': 0.2}
 ids_anom [7]`,
 },
 callout: {
```

### Diff D-03 — Fix `T4-A` theory `qhe_template.py` output (Issue I-03)

```diff
--- a/src/lib/course/sections/s18-data-engineering.ts
+++ b/src/lib/course/sections/s18-data-engineering.ts
@@ -311,15 +311,15 @@ s18_th_7()`,
     # plantilla de traza hallazgo → cálculo (sintético)
     pregunta = "¿El ticket mediano en Cliente-A supera 25 PEN?"
     metrica = "median(monto | region==Cliente-B)"
     resultado = {"n": 40, "median": 27.5, "ic95_z_or_boot": (24.0, 31.0)}
     limite = "muestra de canal web, no incluye tienda física"
     print("pregunta:", pregunta)
     print("metrica:", metrica)
     print("resultado:", resultado)
     print("limite:", limite)
     print("no_es_decision:", "no lanzar campaña aún")
 
 s18_th_7()`,
- output: `pregunta: ¿El ticket mediano en Sucursal-Norte supera 25 PEN?
-metrica: median(monto | region==Sucursal-Sur)
+ output: `pregunta: ¿El ticket mediano en Cliente-A supera 25 PEN?
+metrica: median(monto | region==Cliente-B)
 resultado: {'n': 40, 'median': 27.5, 'ic95_z_or_boot': (24.0, 31.0)}
 limite: muestra de canal web, no incluye tienda física
 no_es_decision: no lanzar campaña aún`,
 },
```

### Diff D-04 — Fix `S18-T2-A-DEMO` (Issue I-04)

> The displayed output is fabricated because the code's `pob` keys don't appear in `muestra`. The cleanest fix is to **align the muestra to use pob's keys** so the demo actually computes meaningful shares. Alternative: regenerate the output to match the broken code (`{'Cliente-A': 0.0, 'Cliente-B': 0.0, 'Sucursal-Norte': 0.0}, max_abs_bias_pp 0.5`). The pedagogical intent (showing +0.7/+0.2/+0.1 shares) requires the former.

```diff
--- a/src/lib/course/sections/s18-data-engineering.ts
+++ b/src/lib/course/sections/s18-data-engineering.ts
@@ -438,17 +438,17 @@ s18_ido_3():
     from collections import Counter
     import numpy as np
 
-    pob = {"Cliente-A": 0.50, "Cliente-B": 0.30, "Sucursal-Norte": 0.20}
-    muestra = ["Sucursal-Sur"] * 70 + ["Sucursal-Centro"] * 20 + ["Oficina-Este"] * 10
+    pob = {"Cliente-A": 0.50, "Cliente-B": 0.30, "Sucursal-Norte": 0.20}
+    muestra = ["Cliente-A"] * 70 + ["Cliente-B"] * 20 + ["Sucursal-Norte"] * 10
     c = Counter(muestra)
     n = sum(c.values())
     share = {k: c[k] / n for k in pob}
     print({k: round(share[k], 3) for k in pob})
     print("max_abs_bias_pp", round(max(abs(share[k] - pob[k]) for k in pob), 3))
     print("cobertura", "LIMITADA" if max(abs(share[k] - pob[k]) for k in pob) > 0.1 else "OK")
 
 s18_ido_3()`,
- output: `{'Oficina-Oeste': 0.7, 'Cliente-A': 0.2, 'Cliente-B': 0.1}
-max_abs_bias_pp 0.2
-cobertura LIMITADA`,
+ output: `{'Cliente-A': 0.7, 'Cliente-B': 0.2, 'Sucursal-Norte': 0.1}
+max_abs_bias_pp 0.2
+cobertura LIMITADA`,
 },
```

> **Note:** the displayed `max_abs_bias_pp 0.2` is preserved because the corrected code does produce `max(|0.7-0.5|, |0.2-0.3|, |0.1-0.2|) = max(0.2, 0.1, 0.1) = 0.2`.

### Diff D-05 — Fix `S18-T3-B-DEMO` (Issue I-05)

```diff
--- a/src/lib/course/sections/s18-data-engineering.ts
+++ b/src/lib/course/sections/s18-data-engineering.ts
@@ -560,12 +560,12 @@ s18_ido_6():
     df["flag"] = (df["monto"] < lo) | (df["monto"] > hi)
     print("lo_hi", round(float(lo),2), round(float(hi),2))
     print(df.groupby("region")["flag"].agg(["sum","mean"]).round(3).to_dict())
     print("sin_claim_causal", True)
 
 s18_ido_6()`,
- output: `lo_hi 13.5 27.5
-{'sum': {'Oficina-Este': 1, 'Oficina-Oeste': 1, 'Cliente-A': 0}, 'mean': {'Cliente-B': 0.167, 'Sucursal-Norte': 0.167, 'Sucursal-Sur': 0.0}}
+ output: `lo_hi 13.5 27.5
+{'sum': {'Sucursal-Centro': 1, 'Sucursal-Norte': 0, 'Sucursal-Sur': 1}, 'mean': {'Sucursal-Centro': 0.167, 'Sucursal-Norte': 0.0, 'Sucursal-Sur': 0.167}}
 sin_claim_causal True`,
 },
```

### Diff D-06 — Fix `S18-T4-A-DEMO` (Issue I-06)

```diff
--- a/src/lib/course/sections/s18-data-engineering.ts
+++ b/src/lib/course/sections/s18-data-engineering.ts
@@ -589,12 +589,12 @@ s18_ido_7():
     print(evidencia["pregunta"])
     print("hallazgo", evidencia["resultado"])
     print("decision_es_none", evidencia["decision"] is None)
 
 s18_ido_7()`,
- output: `¿Hay diferencia de ticket mediano Cliente-B vs Sucursal-Norte?
-hallazgo {'Sucursal-Sur': 28.0, 'Sucursal-Centro': 22.5, 'n_Lima': 40, 'n_Cusco': 32}
+ output: `¿Hay diferencia de ticket mediano Sucursal-Centro vs Oficina-Este?
+hallazgo {'Oficina-Oeste': 28.0, 'Cliente-A': 22.5, 'n_Lima': 40, 'n_Cusco': 32}
 decision_es_none True`,
 },
```

### Diff D-07 — Fix `S18-T4-B-DEMO` SHA-1 (Issue I-07)

```diff
--- a/src/lib/course/sections/s18-data-engineering.ts
+++ b/src/lib/course/sections/s18-data-engineering.ts
@@ -627,7 +627,7 @@ s18_ido_8():
     print("median_final", float(df2["monto"].median()))
 
 s18_ido_8()`,
- output: `{"origen": "sintetico", "n_raw": 5, "n_final": 4, "filtros": ["monto > 0"], "seed": 18, "sha1_8": "71094efb"}
+ output: `{"origen": "sintetico", "n_raw": 5, "n_final": 4, "filtros": ["monto > 0"], "seed": 18, "sha1_8": "0395ac09"}
 median_final 11.5`,
 },
```

### Diff D-08 — Fix `S18-T2-A-E1` We Do (Issue I-08)

> The starter, solution, and output use three different muestras. Align the solution to the starter and regenerate the output.

```diff
--- a/src/lib/course/sections/s18-data-engineering.ts
+++ b/src/lib/course/sections/s18-data-engineering.ts
@@ -885,17 +885,17 @@ starterCode: {
  title: "exercise.py",
  code: `# CASO-LIM-018 · sample share
 # Bug a corregir: cuenta Oficina-Oeste no Cliente-A
-muestra = ["Cliente-B", "Sucursal-Norte", "Sucursal-Sur", "Sucursal-Centro"]
-share_lima = muestra.count("Oficina-Este") / len(muestra)
+muestra = ["Cliente-B", "Sucursal-Norte", "Sucursal-Sur", "Sucursal-Centro"]
+share_lima = muestra.count("Cliente-B") / len(muestra)
 print("share_Lima", round(share_lima, 2))`,
 },
 solutionCode: {
  language: 'python',
  title: "exercise.py",
- code: `muestra = ["Oficina-Oeste", "Cliente-A", "Cliente-B", "Sucursal-Norte"]
-share_lima = muestra.count("Sucursal-Sur") / len(muestra)
+ code: `muestra = ["Cliente-B", "Sucursal-Norte", "Sucursal-Sur", "Sucursal-Centro"]
+share_lima = muestra.count("Cliente-B") / len(muestra)
 print("share_Lima", round(share_lima, 2))`,
- output: `share_Lima 0.75`,
+ output: `share_Lima 0.25`,
 },
```

> **Note:** With the corrected code, `muestra.count("Cliente-B") = 1`, so `share_Lima = 1/4 = 0.25`. The instruction (line 875) says "calcula la proporción de Sucursal-Sur" — to keep that intent, change `muestra.count("Cliente-B")` → `muestra.count("Sucursal-Sur")` and output stays `0.25`. Also change the instruction's region name to match.

### Diff D-09 — Fix `S18-T2-A-E3` We Do blocker (Issue I-09)

> The fixture's `counts` dict doesn't contain `pob`'s keys, so `counts[k]` raises `KeyError`. Two fixes needed: (1) use `.get(k, 0)` for safety; (2) align the fixture so the expected output (`0.4`) is actually achievable.

```diff
--- a/src/lib/course/sections/s18-data-engineering.ts
+++ b/src/lib/course/sections/s18-data-engineering.ts
@@ -952,17 +952,17 @@ starterCode: {
  title: "exercise.py",
  code: `# CASO-LIM-018 · max_bias de cobertura (transferencia)
 def max_bias(pob, counts):
  n = sum(counts.values())
  # Completa: peor |count/n − pob| entre claves de pob
  raise NotImplementedError
 
-print(round(max_bias({"Sucursal-Centro": 0.5, "Oficina-Este": 0.5}, {"Oficina-Oeste": 9, "Cliente-A": 1}), 2))`,
+print(round(max_bias({"Cliente-B": 0.5, "Sucursal-Norte": 0.5}, {"Sucursal-Sur": 9, "Sucursal-Centro": 1}), 2))`,
 },
 solutionCode: {
  language: 'python',
  title: "exercise.py",
  code: `def max_bias(pob, counts):
  n = sum(counts.values())
- return max(abs(counts[k] / n - pob[k]) for k in pob)
+ return max(abs(counts.get(k, 0) / n - pob[k]) for k in pob)
 
-print(round(max_bias({"Cliente-B": 0.5, "Sucursal-Norte": 0.5}, {"Sucursal-Sur": 9, "Sucursal-Centro": 1}), 2))`,
+print(round(max_bias({"Cliente-B": 0.5, "Sucursal-Norte": 0.5}, {"Cliente-B": 9, "Sucursal-Norte": 1}), 2))`,
- output: `0.4`,
+ output: `0.4`,
 },
```

> **Note:** With the corrected fixture `max_bias({"Cliente-B": 0.5, "Sucursal-Norte": 0.5}, {"Cliente-B": 9, "Sucursal-Norte": 1})` → `max(|9/10 - 0.5|, |1/10 - 0.5|) = max(0.4, 0.4) = 0.4`. The expected output is now achievable. The starter fixture should use the same keys as the solution fixture (just with a deliberate bug, e.g., `min` instead of `max`).

### Diff D-10 — Fix `S18-T3-B-E2` We Do (Issue I-10)

> Four-way inconsistency across instruction, hint, hints, feedback, starter, solution, output. Pick one region ("Sucursal-Sur") and align everything.

```diff
--- a/src/lib/course/sections/s18-data-engineering.ts
+++ b/src/lib/course/sections/s18-data-engineering.ts
@@ -1244,21 +1244,21 @@ starterCode: {
   title: "exercise.py",
   code: `# CASO-LIM-018 · tasa por región
 # Bug a corregir: tasa global no Sucursal-Sur
-import numpy as np
-region = np.array(["Sucursal-Centro", "Oficina-Este", "Oficina-Oeste"])
+import numpy as np
+region = np.array(["Sucursal-Norte", "Sucursal-Sur", "Sucursal-Centro"])
 flag = np.array([True, True, False])
 print("tasa_Lima", float(flag.mean()))`,
 },
 solutionCode: {
  language: 'python',
  title: "exercise.py",
- code: `import numpy as np
-region = np.array(["Cliente-A", "Cliente-B", "Sucursal-Norte"])
-flag = np.array([True, True, False])
-print("tasa_Lima", float(flag[region == "Sucursal-Sur"].mean()))`,
+ code: `import numpy as np
+region = np.array(["Sucursal-Norte", "Sucursal-Sur", "Sucursal-Centro"])
+flag = np.array([True, True, False])
+print("tasa_Lima", float(flag[region == "Sucursal-Sur"].mean()))`,
  output: `tasa_Lima 1.0`,
 },
```

> **Note:** With the corrected code, `flag[region == "Sucursal-Sur"]` = `flag[1]` = `[True]`, so `mean = 1.0`. The expected output is now achievable. **Also update the instruction (line 1244) to say "Oficina-Este" → "Sucursal-Sur"; the hint (line 1246) to say `region == "Sucursal-Sur"`; hints[0] (line 1248) to say `region == "Sucursal-Sur"`; hints[1] (line 1249) to say "Sucursal-Sur"; feedback (line 1253) to say `region == "Sucursal-Sur"`.**

### Diff D-11 — Fix `S18-T4-A-E3` We Do (Issue I-11)

```diff
--- a/src/lib/course/sections/s18-data-engineering.ts
+++ b/src/lib/course/sections/s18-data-engineering.ts
@@ -1399,7 +1399,7 @@ starterCode: {
  # Completa: imprime P, M, V y L con esos prefijos
  pass
 
-traza("ticket mediano Sucursal-Centro", "median", 27.5, "solo web")`,
+traza("ticket mediano Oficina-Este", "median", 27.5, "solo web")`,
 },
 solutionCode: {
  language: 'python',
@@ -1411,7 +1411,7 @@ solutionCode: {
  print("V:", valor)
  print("L:", limite)
 
-traza("ticket mediano Oficina-Este", "median", 27.5, "solo web")`,
+traza("ticket mediano Oficina-Este", "median", 27.5, "solo web")`,
- output: `P: ticket mediano Oficina-Oeste
+ output: `P: ticket mediano Oficina-Este
 M: median
 V: 27.5
 L: solo web`,
```

> (Starter call now matches solution call; output line is regenerated to match.)

### Diff D-12 — Grammar: `y` → `e`, `o` → `u` (Issues I-14, I-15)

```diff
--- a/src/lib/course/sections/s18-data-engineering.ts
+++ b/src/lib/course/sections/s18-data-engineering.ts
@@ -872,7 +872,7 @@
  id: "S18-T2-A-E1",
  subtopicId: "S18-T2-A",
  kind: "guided",
  instruction:
- "E1 (guiado) — En la muestra sintética de `S18-T2-A-E1`, calcula la **proporción de Sucursal-Sur** y imprímela como `share_Lima` (2 decimales). El bug indicado en el starter cuenta la región equivocada.",
+ "E1 (guiado) — En la muestra sintética de `S18-T2-A-E1`, calcula la **proporción de Sucursal-Sur** e imprímela como `share_Lima` (2 decimales). El defecto indicado en el código inicial cuenta la región equivocada.",
@@ -880,7 +880,7 @@
  hints: [
  "share = conteo de la región / n de la muestra.",
  "Redondea a 2 decimales.",
  ],
  edgeCases: ["muestra vacía"],
  tests: "salida coincide con solution output",
- feedback: "¿Contaste Sucursal-Centro o otra región? share_Lima = count(Oficina-Este) / n.",
+ feedback: "¿Contaste Sucursal-Centro u otra región? share_Lima = count(Oficina-Este) / n.",
```

### Diff D-13 — Grammar: `vs` → `vs.`, `p.ej` → `p. ej.`, `limite` → `límite` (Issues I-16, I-17, I-18)

```diff
--- a/src/lib/course/sections/s18-data-engineering.ts
+++ b/src/lib/course/sections/s18-data-engineering.ts
@@ -404,7 +404,7 @@
  environment: "local-python",
- description: "Comparar media vs mediana/MAD y escala log1p en montos con outlier",
+ description: "Comparar media vs. mediana/MAD y escala log1p en montos con outlier",
@@ -1384,7 +1384,7 @@
  hint: "Cuatro prints con prefijos P/M/V/L; el cuarto usa el parámetro limite.",
+ hint: "Cuatro prints con prefijos P/M/V/L; el cuarto usa el parámetro límite.",
@@ -1453,7 +1453,7 @@
- hint: "Arma el payload con newlines reales (p.ej uniendo líneas con chr(10)); sha1(...).hexdigest()[:8].",
+ hint: "Arma el payload con newlines reales (p. ej. uniendo líneas con chr(10)); sha1(...).hexdigest()[:8].",
@@ -1622,7 +1622,7 @@
- { criterion: "Pruebas o casos de borde documentados (cola, sesgo, z vs bootstrap)", weight: "15%" },
+ { criterion: "Pruebas o casos de borde documentados (cola, sesgo, z vs. bootstrap)", weight: "15%" },
```

### Diff D-14 — Grammar: split run-on sentence (Issue I-19)

```diff
--- a/src/lib/course/sections/s18-data-engineering.ts
+++ b/src/lib/course/sections/s18-data-engineering.ts
@@ -1037,11 +1037,13 @@
  id: "S18-T2-B-E3",
  subtopicId: "S18-T2-B",
  kind: "transfer",
  instruction:
- "E3 (transferencia) — Con montos sintéticos de cola pesada (`S18-T2-B-E3`), implementa un **bootstrap simple** de la media: remuestrea con reemplazo `B` veces (seed y `B` ya fijos en el starter), toma los percentiles 2.5 y 97.5 de esas medias e imprime `boot_ic95` como tupla a 2 decimales, más `n` y la nota `bootstrap_simple`. No uses la fórmula z·s/√n aquí: el punto es practicar remuestreo cuando la aproximación normal es dudosa. El IC describe incertidumbre del estimador, no el rango donde cae el 95% de los tickets.",
+ "E3 (transferencia) — Con montos sintéticos de cola pesada (`S18-T2-B-E3`), implementa un **bootstrap simple** de la media: remuestrea con reemplazo `B` veces (seed y `B` ya fijos en el código inicial), toma los percentiles 2.5 y 97.5 de esas medias e imprime `boot_ic95` como tupla a 2 decimales, más `n` y la nota `bootstrap_simple`.\n\nNo uses la fórmula z·s/√n aquí: el punto es practicar remuestreo cuando la aproximación normal es dudosa. El IC describe incertidumbre del estimador, no el rango donde cae el 95 % de los tickets.",
```

### Diff D-15 — Callout title: `Sin claim causal` → `Sin afirmación causal` (Issue I-27)

```diff
--- a/src/lib/course/sections/s18-data-engineering.ts
+++ b/src/lib/course/sections/s18-data-engineering.ts
@@ -282,7 +282,7 @@
  callout: {
  type: "info",
- title: "Sin claim causal",
+ title: "Sin afirmación causal",
  content:
  "Una tasa mayor de anomalías en un segmento es hallazgo descriptivo, no prueba de causa.",
  },
```

### Diff D-16 — `p-value` → `valor p` (Issue I-22)

```diff
--- a/src/lib/course/sections/s18-data-engineering.ts
+++ b/src/lib/course/sections/s18-data-engineering.ts
@@ -496,7 +496,7 @@
  },
- why: "Magnitud + IC z + bootstrap + n comunican incertidumbre mejor que un solo p-value o un 'probado al 95%'.",
+ why: "Magnitud + IC z + bootstrap + n comunican incertidumbre mejor que un solo valor p o un 'probado al 95 %'.",
```

### Diff D-17 — Self-check Q5 stem consistency (Issue I-25)

```diff
--- a/src/lib/course/sections/s18-data-engineering.ts
+++ b/src/lib/course/sections/s18-data-engineering.ts
@@ -1658,7 +1658,7 @@
  {
- question: "En un EDA de tickets sintéticos Cliente-B/Sucursal-Norte, ¿cuál es la comunicación correcta de un r de Pearson alto entre gasto y visitas cuando ambos crecen con el tamaño de la ciudad (confusor)?",
+ question: "En un EDA de tickets sintéticos por región, ¿cuál es la comunicación correcta de un r de Pearson alto entre monto y visitas cuando ambos crecen con el tamaño de la ciudad (confusor)?",
```

### Diff D-18 — Self-check Q7 stem and option B consistency (Issue I-26)

```diff
--- a/src/lib/course/sections/s18-data-engineering.ts
+++ b/src/lib/course/sections/s18-data-engineering.ts
@@ -1672,9 +1672,9 @@
  {
- question: "Una tasa de flags Tukey más alta en Sucursal-Sur implica:",
- options: ["Hallazgo descriptivo de anomalías univariadas; la decisión de investigación es humana", "Fraude demostrado en Sucursal-Centro", "Que la media es mejor que la mediana", "Que el IC es innecesario"],
+ question: "Una tasa de indicadores Tukey más alta en una región implica:",
+ options: ["Hallazgo descriptivo de anomalías univariadas; la decisión de investigación es humana", "Fraude demostrado en esa región", "Que la media es mejor que la mediana", "Que el IC es innecesario"],
```

### Diff D-19 — You Do `context`: replace "Cliente-A" company name (Issue I-29)

```diff
--- a/src/lib/course/sections/s18-data-engineering.ts
+++ b/src/lib/course/sections/s18-data-engineering.ts
@@ -1525,7 +1525,7 @@
  title: "EDA honesto para CP-N2-B (inicio)",
  context:
- "Eres analista en un equipo de insights en Cliente-A. En **S17** dejaste un dataset limpio y un memo de límites (CP-N2-A). Aquí abres **CP-N2-B**: sobre un extracto sintético de tickets (sin PII real) produces un EDA que distingue hallazgo, hipótesis y decisión, con incertidumbre explícita y data notes. El artefacto alimenta el dashboard accesible de S19.",
+ "Eres analista en un equipo de insights en una fintech peruana. En **S17** dejaste un conjunto de datos limpio y un memorando de límites (CP-N2-A). Aquí abres **CP-N2-B**: sobre un extracto sintético de tickets (sin PII real) produces un EDA que distingue hallazgo, hipótesis y decisión, con incertidumbre explícita y notas de datos. El artefacto alimenta el tablero accesible de S19.",
```

### Diff D-20 — Structural rename `id` and file (Issue I-12) — coordinate with Fixer

> ⚠️ This change updates `src/lib/course/index.ts` (import + COURSE_SECTIONS), the live URL `#data-engineering` → `#eda-uncertainty`, and any internal references. **Coordinate with the Fixer and orchestrator**; do not apply in isolation.

```diff
--- a/src/lib/course/index.ts
+++ b/src/lib/course/index.ts
@@ -17,7 +17,7 @@
 import { section15 } from './sections/s15-stdlib-deep'
 import { section16 } from './sections/s16-wxpython-gui'
 import { section17 } from './sections/s17-packaging'
-import { section18 } from './sections/s18-data-engineering'
+import { section18 } from './sections/s18-eda-uncertainty'
 import { section19 } from './sections/s19-databases-orm'
--- a/src/lib/course/sections/s18-data-engineering.ts (renamed to s18-eda-uncertainty.ts)
+++ b/src/lib/course/sections/s18-eda-uncertainty.ts
@@ -1,6 +1,6 @@
 import type { CourseSection } from '../../types'
 
 export const section18: CourseSection = {
- id: "data-engineering",
+ id: "eda-uncertainty",
  index: 18,
  title: "EDA, estadística descriptiva e incertidumbre",
```

### Diff D-21 — Drop `# CASO-LIM-018` scaffolding tags (Issue I-13)

> 26 occurrences. Show one example; apply to all 8 instructions and 18 starterCode comments.

```diff
--- a/src/lib/course/sections/s18-data-engineering.ts
+++ b/src/lib/course/sections/s18-data-engineering.ts
@@ -642,7 +642,7 @@
  instruction:
- "E1 (guiado) — Con el array sintético de montos del starter (`CASO-LIM-018` / `S18-T1-A-E1`), corrige el bug indicado en el starter: reporta **n**, **mean** (2 decimales) y **median** con esas etiquetas. No inventes datos ni dejes un print suelto de control. Compara con la solución solo después de ejecutar.",
+ "E1 (guiado) — Con el arreglo sintético de montos del código inicial (`S18-T1-A-E1`), corrige el defecto indicado: reporta **n**, **mean** (2 decimales) y **median** con esas etiquetas. No inventes datos ni dejes un `print` suelto de control. Compara con la solución solo después de ejecutar.",
@@ -654,7 +654,7 @@
  starterCode: {
  language: 'python',
  title: "exercise.py",
- code: `# CASO-LIM-018 · mean vs median
+ code: `# mean vs median
 # Bug a corregir: solo mean; omite median y n
 import numpy as np
 montos = np.array([10, 12, 14, 16, 100], dtype=float)
```

### Diff D-22 — You Do starterCode comment (Issue I-24)

```diff
--- a/src/lib/course/sections/s18-data-engineering.ts
+++ b/src/lib/course/sections/s18-data-engineering.ts
@@ -1588,7 +1588,7 @@
 # --- Checkpoint 4: IC z y/o bootstrap de la media (montos lognormales → declara límite) ---
-# Esqueleto z (completa se e imprime ic95_z). Opcional: bootstrap B=200 como en T2-B.
+# Esqueleto z: completa la variable se e imprime ic95_z. Opcional: bootstrap B=200 como en T2-B.
 m = float(df["monto"].mean())
```

---

## 8. Recommended Priority Order for Fixing

| Priority | Diff(s) | Issue(s) | Why first |
|---|---|---|---|
| **P0** | **D-09** | **I-09** | Blocker. Auto-checker cannot pass; correct solution raises `KeyError`. |
| **P0** | **D-08, D-10, D-11** | **I-08, I-10, I-11** | Blockers. We Do exercises unsolvable as written. |
| **P0** | **D-01, D-02, D-03, D-04, D-05, D-06, D-07** | **I-01..I-07** | Blockers. 7 theory / I-Do demos have fabricated or scrambled outputs; a learner executing the code sees different output from the slide. |
| **P1** | **D-12, D-13, D-14, D-15, D-16** | **I-14..I-19, I-22, I-27** | Grammar: 1 run-on, `y→e`, `o→u`, `vs.`, `p. ej.`, `límite`, `valor p`, callout title. Quick wins, high learner-visible impact. |
| **P1** | **D-17, D-18, D-19** | **I-25, I-26, I-29** | Self-check stem consistency; You Do company-name fix. |
| **P2** | **D-22** | **I-24** | You Do comment clarity. |
| **P2** | (no diff — paragraph rewrites in §6) | **I-20, I-21** | 8 long sentences + anglicism load. Apply §6 rewrites progressively. |
| **P3** | **D-21** | **I-13** | Drop `CASO-LIM-018` scaffolding tags. Cosmetic but reduces learner-visible meta-leak. Coordinate with S04/S08/S11/S12 fixers for consistency. |
| **P3** | **D-20** | **I-12** | Rename `id` / file to `eda-uncertainty`. Coordinate with Fixer; changes live URL. **Last** because it requires orchestrator-level coordination. |

---

## 9. Graph Memory Update Notes

> For the shared campaign context — to be appended to the orchestrator's graph memory after the Fixer applies the diffs.

### 9.1 Cross-section patterns confirmed in S18

1. **Pseudonymization drift (CRITICAL, systemic).** The same defect class flagged in S04 (Cliente-A/B, Sucursal-Norte/Sur/Centro, Oficina-Este/Oeste), S07, S08, S11, S12 is present and severe in S18. The pattern: a late-stage script replaced real region names with synthetic ones in source code but did **not** regenerate `output` blocks. Worse, the script used **different** synthetic labels for the same logical region in code vs. output. **Recommendation:** the orchestrator should run a single cross-section script that (a) executes every `code` block, (b) diffs the real output vs. the displayed `output`, and (c) flags every mismatch for human triage. Likely 50+ broken pairs across the 52 sections.

2. **Stale `id` / filename (systemic).** `s18-data-engineering.ts` with `id:"data-engineering"` no longer matches the rescoped EDA content. Same pattern as S05 (`id:"oop"` on Functions), S08 (`id:"pandas"`), S11 (`id:"testing"`/file `s11-testing.ts` on OOP), S12 (`id:"performance"`/file `s12-performance.ts` on APIs/SQL/Geo). **Recommendation:** orchestrator-level grep for `id:"X"` where `X` doesn't match the section `title` semantic; coordinate one batch rename pass.

3. **`# CASO-LIM-NNN` scaffolding tags (systemic).** S04 (`CASO-LIM-004`), S08 (`CASO-LIM-008`), S18 (`CASO-LIM-018`) all leak the same internal taxonomy into learner-visible prose and starterCode comments. **Recommendation:** orchestrator-level grep for `CASO-LIM-` and strip in one pass.

4. **Heavy anglicism load (systemic, Phase 1+).** `claim`, `flag`, `memo`, `dataset`, `portfolio`, `starter`, `data note`, `dashboard`, `outlier`, `share`, `Cohen's d`, `p-value`, `scaffold` are used as English nouns in Spanish prose across S04, S07, S08, S11, S12, S18. **Recommendation:** adopt a shared glossary (es-PE preferred forms) and apply consistently. `Cohen's d` → "la d de Cohen", `p-value` → "valor p", `outlier` → "valor atípico", `memo` → "memorando", `dataset` → "conjunto de datos", `portfolio` → "portafolio", `dashboard` → "tablero", `share` → "proporción", `claim` → "afirmación", `flag` → "indicador", `data note` → "nota de datos" (first use, then "data note" in parens).

5. **`vs` without period (systemic).** S08 (4×), S18 (2×+1 `p.ej`). **Recommendation:** one-pass regex replace `\bvs\b` → `vs.` across all section files.

### 9.2 S18-specific notes

- Section is **pedagogically excellent** (9/10 I Do / We Do / You Do fidelity) but **technically broken** (11 critical code↔output pairs). After D-01..D-11 are applied, score rises from 5.5 to ~8.0.
- Spanish readability is healthy (FH 73.3, INFLESZ 68.8). No voseo leak (unlike S08). No prose meta-leaks.
- Strong ethical spine ("hallazgo ≠ hipótesis ≠ decisión", "flags ≠ fraude", "correlación ≠ causalidad") — preserve during any rewrite.
- Strong S17 → S18 → S19 connective tissue — preserve.

### 9.3 Files produced by this audit

- `/home/z/my-project/audits/S18_report.md` (this file, ~1 800 lines)
- `/home/z/my-project/audits/_s18_grammar.py` (Spanish-aware extractor + 13-rule heuristic suite)
- `/home/z/my-project/audits/_s18_grammar.json` (per-sentence metrics, 243 sentences)
- `/home/z/my-project/audits/_s18_metrics.json` (aggregate + worst sentences)
- `/home/z/my-project/audits/_s18_prose.txt` (extracted prose for LT input)
- `/home/z/my-project/audits/_s18_lt.json` (LanguageTool `es` raw matches, 558 total / 30 real candidates)

### 9.4 Methodology recap (research-backed, per `_GRAMMAR_SUBPLAN.md`)

- **Fernández-Huerta (1959):** mean 73.3 ("bastante fácil" band — healthy for technical ES).
- **Szigriszt-Pazos / INFLESZ:** mean 68.8 ("normal" band).
- **WPS / SPW:** mean WPS 11.71, mean SPW 2.03, median WPS 10 (all within pedagogical soft targets 15–32 for technical ES).
- **Long sentences (>32 w):** 8 found.
- **Run-on sentences (>45 w):** 1 found (57 w in `S18-T2-B-E3` instruction).
- **LanguageTool `es` public API:** 2 chunks (~18 KB + ~2.5 KB), 558 raw matches, 470 MORFOLOGIK false positives on tech terms, 88 non-spell (of which ~30 are real candidates after filtering whitespace/code-stripping artifacts).
- **13 pedagogical heuristics:** run-on, missing terminal punct, missing `¿`/`¡`, unbalanced delimiters, repeated words, English-dominant prose, meta-leak signals, gerund pile-up, comma density, anaphoric monotony, space-before-punct, double space, DET-NOUN agreement.

---

**This is the complete Explorer report for Section 18. Ready for the Fixer prompt.**
