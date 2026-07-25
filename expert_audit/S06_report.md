# S06 — Curriculum Audit Report
**Section:** S06 — Colecciones y estructuras de datos
**File:** `src/lib/course/sections/s06-numpy.ts` (1,897 lines)
**Live URL:** https://pillb.github.io/pyarcana/#numpy
**Auditor:** Curriculum Auditor (general-purpose) — Task ID S06
**Framework:** Stanford STORM + Graph / Loop / Harness Engineering + Pedagogical Spanish heuristics (Fernández-Huerta, Szigriszt-Pazos/INFLESZ, LanguageTool `es`)
**Method:** Source-code deep read + live-page navigation (agent-browser) + per-sentence/per-paragraph metrics + LanguageTool batched call.

---

## 1. Section Identification & Scope

| Attribute | Value | Notes |
|---|---|---|
| `index` | `6` | Confirmed 6th in `COURSE_SECTIONS` array (course/index.ts). |
| `id` | `"numpy"` | ⚠️ Mismatched with title — see §4 Meta-Leak Report. |
| `title` | `"Colecciones y estructuras de datos"` | Learner-facing section title. |
| `shortTitle` | `"Colecciones"` | Sidebar / nav label. |
| `tagline` | `"listas, dicts, sets y estructuras anidadas para modelo en memoria"` | |
| `estimatedHours` | `18` | |
| `level` | `"Intermedio"` | |
| `phase` | `0` (Fundamentos) | |
| `icon` | `"Layers"` | |
| Topic coverage | `list` / `tuple` / `dict` / `set` / slicing / unpacking / alias vs shallow vs deep / nested structures / `get` & `KeyError` / dedup with conflicts / `sorted(key=)` / JSON determinism | Standard-library only — explicit "no NumPy/pandas". |

**Scope confirmation (live site):** the 6th button in the sidebar (`agent-browser` snapshot ref `e85`) renders `S6 / Colecciones y estructuras de datos`. Hash route is `#numpy` (legacy id). Section page renders five tabs — **Teoría**, **Yo hago**, **Hacemos juntos**, **Tú haces**, **Autocheck** — all inspected.

**Tabs audited:**
- **Teoría** — 8 theory blocks (T1-A, T1-B, T2-A, T2-B, T3-A, T3-B, T4-A, T4-B), each with heading + 3 paragraphs + code + callout.
- **Yo hago (I Do)** — 8 demos, one per subtopic, with `description`, runnable Pyodide code, `output`, and `why`.
- **Hacemos juntos (We Do)** — 24 exercises (8 subtopics × 3 kinds: `guided`, `independent`, `transfer`), each with `instruction`, `hints[]` (2 progressive), `edgeCases[]`, `tests`, `feedback`, `starterCode`, `solutionCode`.
- **Tú haces (You Do)** — Capstone `CP-N1-B` "Modelo tabular en memoria" with 5 objectives, 5 requirements, `starterCode` (memory_model.py skeleton), `portfolioNote`, 5-criterion rubric summing to 100 %.
- **Autocheck** — 9 multiple-choice quiz questions with explanations.
- **Resources** — 6 docs, 2 books, 4 courses (all canonical Python material).

---

## 2. Executive Summary of Quality

**Overall score: 7.5 / 10** — *"Pedagogically excellent; undermined by a single critical meta-leak and a cluster of low-severity redaction issues."*

### Verdict
- **Pedagogy (I Do / We Do / You Do): 9 / 10.** Textbook implementation of Gradual Release of Responsibility: 8 subtopics, each with theory → I Do demo → 3 progressive We Do (guided → independent → transfer). Cognitive-load management is strong (short sentences, FH = 82 "fácil", explicit "orden pedagógico T1→T4" map, callouts that scope the section). Cross-references to S04–S05 (prereqs), S08 (next step), S14 (where NumPy actually lives) are accurate and well-placed.
- **Redaction (Spanish, Peruvian Spanish): 8 / 10.** Style is consistently direct, second-person ("construyes", "elige", "no uses"), code-anchored, and uses LATAM-flavored names ("Ana Quispe", "Luis Huamán"). Grammar is largely correct; only a handful of real issues surfaced from LanguageTool (`vs` → `vs.`, `por id` → `por ID`, missing comma before `pero`, capitalization after embedded question mark).
- **Meta-leak / developer leakage: 3 / 10.** **Critical leak:** the `id: "numpy"` field mislabels a section that explicitly forbids NumPy, and the interactive editor (keyed on `id`) loads `import numpy as np` placeholder code into a section whose callout says "Si tu solución de S06 importa numpy o pandas, está fuera de alcance." This is a self-contradiction visible to every learner on the Theory tab. **Secondary leak:** `**markdown bold**` syntax is rendered literally in 5 field types (`jobRelevance`, `callout.content` in theory, `step.instruction`, `step.feedback`, `project.context`) because `SectionView.tsx` renders them as raw `{field}` instead of routing them through `<RichText>`.
- **Connective tissue / narrative flow: 9 / 10.** Each theory block opens with an explicit bridge to the previous one ("Después de ventanas y contratos de columnas (T1-A), el siguiente riesgo del almacén es…"). The "hilo conductor" (mini-almacén en RAM con clientes C00x) is stated upfront and revisited in every subtopic.
- **Consistency with roadmap: 8 / 10.** Prereq chain (S04 iteration, S05 functions) and downstream chain (S08 CSV/JSON, S14 NumPy) are correctly cited. The file-name and `id` mismatch is the only consistency failure, but it has visible UX consequences (URL hash `#numpy`, editor placeholder collision).

**Bottom line:** A learner working through S06 will get a high-quality, well-scaffolded Python collections course — *except* they will see NumPy code in the interactive editor at the bottom of the Theory tab, which directly contradicts the section's own scope. Fix the `id`/file-name/editor-placeholder collision first; everything else is polish.

---

## 3. Detailed Issue Registry

Severity scale: **H** = blocks learning or contradicts scope; **M** = clarity/credibility damage; **L** = polish.

| # | Sev | Location | Evidence (quote) | Pedagogical impact |
|---|---|---|---|---|
| **1** | **H** | `s06-numpy.ts:4` (`id: "numpy"`) + `SectionView.tsx:4046` (`demos[sectionId]`) + rendered Theory tab | `id: "numpy"` on a section whose own callout says "Si tu solución de S06 importa numpy o pandas, está fuera de alcance." The interactive editor at the bottom of the Theory tab shows title **"Practica NumPy vectorizado"** with code `import numpy as np` — confirmed live via `agent-browser` (`Found at idx 17446 : >>>Practica NumPy vectorizado…`). | A learner reads "no NumPy" in the callout, then sees NumPy code in the same tab. Self-contradiction erodes trust and creates a "wait, is NumPy allowed here?" ambiguity at the exact moment of practice. Also: URL hash is `#numpy`, the file is `s06-numpy.ts`, and the actual NumPy section is S14 (`s14-security.ts`, `id: "security"`, title "NumPy y cómputo vectorizado") — so the `id` and file-name *namespace is swapped* between S06 and S14. |
| **2** | **H** | `SectionView.tsx:189` (`{section.jobRelevance}`), `:401` (`{block.callout.content}`), `:491` (`{step.instruction}`), `:571` (`{step.feedback}`), `:614` (`{project.context}`) | These fields render **raw** (not via `<RichText>`), but the source uses `**bold**` markdown. Live capture (Theory tab): `Trabajas solo con la **biblioteca estándar** (list, dict, set, copy, json). El objetivo es el **modelo tabular en memoria**…` (literal asterisks). Live capture (We Do tab): `…imprime los **últimos 2** con slicing…`. Live capture (You Do tab): `Inicias el capstone **CP-N1-B**. Representas clientes… Deduplicas por clave de negocio **reportando conflictos**…`. | Learner sees literal `**` characters instead of bold formatting. Reads as a drafting artifact, not a finished course. Affects at least 8 `weDo.instruction` strings, 2 `callout.content` strings, 1 `jobRelevance`, 1 `youDo.context`, and any `step.feedback`/`step.description` that uses `**`. |
| **3** | **M** | `jobRelevance` paragraph (`s06-numpy.ts:15`) | `"En pipelines de onboarding y calidad de datos en bancos, fintech y retail en Perú, antes de CSV/JSON necesitas un **modelo tabular en memoria**: clientes, contactos y transacciones como list/dict/set bien elegidos, con deduplicación que **reporta conflictos** y salidas **deterministas**."` — **43 words**, FH = 38.8 (difícil), high comma density (6 commas). | Single-sentence paragraph with three `**bold**` runs and a long enumeration. Cognitive overload on first contact (this is the section's `jobRelevance` blurb shown in the header / nav card). Suggest split into 2 sentences + bullet list. |
| **4** | **M** | `theory.paragraphs` (T0 map, line 31) | `"En esta sección construyes el modelo tabular en memoria que tu portafolio CP-N1-B necesita: listas, tuplas, dicts, sets y estructuras anidadas cliente → contactos → transacciones, con salidas deterministas y deduplicación que reporta conflictos."` — **34 words**, FH = 34.5 (difícil). | This is the section's mission statement; reading it as one breath-unit is hard. Suggest splitting at "transacciones." |
| **5** | **M** | `theory.paragraphs` (T2-B política, line 176) | `"Política: si el payload es idéntico, es un duplicado inocente (no entra a conflicts); si difiere, deja traza del choque. "El último gana" sin traza es un anti-patrón de calidad de datos."` — **33 words**, two sentences in one paragraph. The `"…"` ASCII quotes inside Spanish prose are inconsistent with the `"…"` curly quotes used elsewhere in the same section. | Mostly stylistic, but the ASCII-vs-curly-quote mixing is a redaction smell. Suggest normalizing to `"…"`. |
| **6** | **M** | `theory.paragraphs` (T0 map, line 30) | `"...Una secuencia (list/tuple) ordena filas y ventanas. Un dict indexa por id en tiempo casi constante. Un set responde "¿está en la cohorte?" y alimenta deduplicación."` — LanguageTool `CAPITALIZATION_AFTER_QUESTION_MARK`: after closing `?"` inside a sentence, Spanish requires either a comma or a capital. | Currently reads `…¿está en la cohorte?" y alimenta…`. Correct Spanish: `…¿está en la cohorte?", y alimenta…` OR `…¿está en la cohorte?" Y alimenta…` (treat as new sentence). |
| **7** | **M** | `weDo.instruction` E1 T4-B (line 1549) | `"E1 (guiado) — Para tres operaciones del almacén en RAM, elige e imprime la estructura Python adecuada: (1) cola de llegada de filas → list; (2) lookup frecuente por id → dict; (3) cohorte de emails únicos → set. Una línea por job con la elección explícita."` — **35 words**. | Inline numbered enumeration in prose. The inline `(1)/(2)/(3)` plus arrow `→` makes the sentence dense. Better as a true markdown list (would also fix the markdown-leak issue from #2 once `step.instruction` is routed through `<RichText>`). |
| **8** | **M** | Multiple `weDo.feedback` strings (e.g., line 689, 734, 774, 815, 849, 889, 935, 971, 1011, 1053, 1085, 1119, 1181, 1219, 1263, 1309, 1355, 1405, 1441, 1473, 1515, 1557, 1599, 1633) | Most feedback strings are 6–15 words without terminal period: `"Slicing negativo no lanza error en lista vacía."` (has period), but `"tuple no tiene append → AttributeError"` (no period), `"KEYS estable + more"` (no period), `"Copia antes de update in-place."` (has period). Inconsistent. | 77 of 205 sentences flagged `missing_terminal` by the heuristic — most are intentional labels (`edgeCases`, `tests`, `tests` values like `"[40, 50] y []"`) but at least 12–15 are real `feedback`/`hint` strings that should end with `.` for consistency. |
| **9** | **M** | `weDo.feedback` line 1515 | `"Nunca encadenes .sort() esperando la lista ordenada."` | Heuristic flags `space_before_punct` because of ` .sort()`. The space before `.` is intentional (it's ` .sort()` as a leading space inside the sentence, not space-before-period). False positive but worth noting because the phrasing reads awkwardly; consider `Nunca encadenes `.sort()` esperando…` with code formatting. |
| **10** | **L** | 5 instances of `vs` across `learningOutcomes.text`, `weDo.edgeCases`, `weDo.feedback` (e.g., line 808 "Orden posicional importa." no — actually `weDo.hints: [...] "Orden posicional importa."` is fine; the `vs` instances are at lines 1119, 1263, 1354 (edgeCases), 1405, 1664). | LanguageTool `PUNTO_EN_ABREVIATURAS` 5× — Spanish abbreviation `vs` should be `vs.` | Minor Spanish typography. |
| **11** | **L** | 3 instances of `por id` (e.g., line 134 `"¿dónde está C002?"` is fine; actual `por id` at line 352 `"muchos lookups por id → dict"`, line 1549 `"lookup frecuente por id → dict"`, line 1556 in selfCheck). | LanguageTool `PREP_VERB` 3× — `id` interpreted as verb; should be `ID` (acronym uppercase). | Consistency with English-tech convention. |
| **12** | **L** | 2 instances of `, pero` missing comma | LanguageTool `COMMA_PERO` 2× (line 176 `"mismo id pero payload distinto"`, line 1402 `"0 y '' son falsy pero pueden ser datos válidos"`). | Spanish grammar rule: `pero` between clauses requires preceding comma. |
| **13** | **L** | `weDo.tests` field (7 records, e.g., `"[40, 50] y []"`, `"C001 Lima 10"`, `"T1 luego T2"`) | These read as cryptic test descriptions, not Spanish sentences. Heuristic flags `missing_terminal` × 7 and `high_comma_density` for `"[40, 50] y []"`. | Not a defect per se — `tests` is a developer-facing field — but it appears in the rendered UI (We Do tab) as a "Tests" caption. Either hide it from learners or rewrite as a sentence: `"La salida esperada es [40, 50] y []."` |
| **14** | **L** | `weDo.edgeCases` field (8 records, all 2–4-word noun phrases: `"caso vacío"`, `"largo exacto"`, `"inmutabilidad"`, `"alias vs copy"`, `"shallow vs deep anidado"`, `"pares→dict"`, `"get vs KeyError"`, `"conflicto vs duplicado idéntico"`, `"cohorte"`, `"denormalización"`, `"shape roto"`, `"path incompleto"`, `"None vs ausente"`, `"falsy vs missing"`, `"monto numérico"`, `"multi-campo"`, `"in-place vs sorted"`, `"elección explícita"`, `"determinismo"`, `"complejidad derivada de n"`) | These show up as "Casos de borde" badges in the UI. They are intentional labels (not prose), so the `missing_terminal` heuristic flag is a false positive. The `vs` inside them triggers LT `PUNTO_EN_ABREVIATURAS` (false positive — `vs` here is a label separator). | Document as known false-positive class per `_GRAMMAR_SUBPLAN.md`. |
| **15** | **L** | `selfCheck.options` (24 records) | Many options are short noun phrases (`"Sí: copy() hace deepcopy automático"`, `"No: la copia es superficial…"`) without terminal period. | Consistency only — quiz options conventionally omit periods, so this is acceptable. |
| **16** | **L** | `weDo.intro` (line 674) | `"Andamiaje por subtema: **E1 guiado** (arregla el bug del starter) → **E2 independiente** → **E3 transferencia**. Son 24 ejercicios (8×3) con 2 hints c/u. Ejecuta, compara con la solución y solo entonces avanza. Sin NumPy/pandas; datos sintéticos."` | `c/u` abbreviation is informal (Latin "cada uno"); fine for a course tone but consider spelling out. Also `8×3` uses Unicode multiplication sign — consistent with rest of section. |
| **17** | **L** | `weDo.instruction` E3 T1-A (line 766) | `"E3 (transferencia) — Hay un bug: se trata una tupla de ids como lista y se intenta `.append`. Captura el AttributeError, convierte a list, append 'C003', e imprime el resultado y un mensaje de diagnóstico."` | Mixes code-formatted `.append` with bare `append` (no backticks). Inconsistent inline-code style. |
| **18** | **L** | `theory.paragraphs` T3-B (line 277) | `"…un email vacío que aún es "presente pero inválido"."` | Curly quotes `"…"` used inline — consistent with section style; only flagging the ASCII variant in #5 for normalization. |
| **19** | **L** | `youDo.context` (line 1669) | `"Inicias el capstone **CP-N1-B**. Representas clientes, contactos y transacciones en estructuras Python puras (sin NumPy/pandas). Deduplicas por clave de negocio **reportando conflictos**, aplanas txs y exportas JSON determinista. En S07–S08 se suma normalización LATAM e ingesta por archivos. Solo datos sintéticos."` | Five sentences, three of which start with a verb (`Inicias`, `Representas`, `Deduplicas`, `aplanas`, `exportas`) — slight anaphoric monotony. The `**` markdown leaks (issue #2). |
| **20** | **L** | `learningOutcomes.text` (8 records) | E.g., `"Usar list/tuple y slicing para ventanas de registros sin copiar de más"`. | 7 of 8 lack terminal period — these are outcome bullets (acceptable), but consistency with `iDo.description` (which uses periods) would be cleaner. |
| **21** | **L** | `theory.paragraphs` T0 line 33 | `"Orden pedagógico: **T1 Secuencias** (list/tuple/slicing → alias/copia) → **T2 Dicts/sets** (índices, dedup con conflictos) → **T3 Anidado y missing** → **T4 Orden y elección de estructura** (sorted estable, JSON determinista). En cada subtema: teoría, demo I Do y tres We Do (guiada → independiente → transferencia). Ritmo sugerido (~18 h): no intentes dominar conflictos y JSON el primer día; avanza T1→T4 en orden."` | Three sentences, **30 words** in the first. Heavy use of arrows and bold. Once `<RichText>` renders the bold, this will be a clean visual roadmap; today the `**` leaks. |
| **22** | **L** | `weDo.intro` and `iDo.intro` | Both rendered through `<RichText>` (good). The `weDo.intro` says "Son 24 ejercicios (8×3)" — accurate (8 subtopics × 3 kinds = 24). The `iDo.intro` says "Ocho demos I Do (uno por subtema)" — accurate (8 demos). | Internal numerical consistency: ✅. |

---

## 4. Meta-Leak Report (exact leaked text + location)

### Leak #1 — `id: "numpy"` causes NumPy editor to render in a NumPy-free section (**H**)

**Source locations:**
- `src/lib/course/sections/s06-numpy.ts:4` → `id: "numpy",`
- `src/components/course/SectionView.tsx:408` → `<InteractivePlaygroundDemo sectionId={section.id} sectionTitle={section.title} />`
- `src/components/course/SectionView.tsx:4046` → `const demo = demos[sectionId]`
- `src/components/course/SectionView.tsx:1050-1086` → `'numpy': { title: 'Practica NumPy vectorizado', code: '# Practica NumPy (se carga automaticamente)\nimport numpy as np\n...' }`

**Exact leaked text (rendered, captured live via agent-browser):**
```
Practica NumPy vectorizado
Python listo
Reset
Run
1
2
3
…
# Practica NumPy (se carga automaticamente)
import numpy as np

# Crear array
arr = np.array([1, 2, 3, 4, 5])
print(f"Array: {arr}")
print(f"Shape: {arr.shape}")
print(f"Mean: {arr.mean()}")

# Operaciones vectorizadas
print(f"Cuadrados: {arr ** 2}")
…
```

**Location in rendered page:** Theory tab → bottom of the page (after the 8th theory block "Estructura adecuada, complejidad y determinismo") → "Pruébalo tú mismo" section.

**Contradicts the section's own scope statement (rendered 4 cm above the editor):**
> Callout "Solo biblioteca estándar" — *"Si tu solución de S06 importa numpy o pandas, está fuera de alcance. Vuelve a la biblioteca estándar (list, dict, set, copy, json)."*

**Also leaked:** URL hash `#numpy` is shown in the browser address bar for a section titled "Colecciones". File name `s06-numpy.ts` is similarly misleading (and the actual NumPy section, S14, lives in a file called `s14-security.ts` — file/id namespaces are swapped across the course).

### Leak #2 — Markdown `**bold**` rendered as literal asterisks (**H**)

**Source location:** `src/components/course/SectionView.tsx` renders the following fields as raw JSX children (no `<RichText>` wrapper), so `**bold**` markers in the source data leak as literal `**`:

| Line | Field | Source uses `**`? |
|---|---|---|
| 189 | `{section.jobRelevance}` | ✅ 5 `**bold**` runs |
| 401 | `{block.callout.content}` (theory callouts) | ✅ 4 callouts × ~2 runs |
| 438 | `{step.description}` (I Do) | (no — descriptions are plain) |
| 453 | `{step.why}` (I Do) | (no — why strings are plain) |
| 491 | `{step.instruction}` (We Do) | ✅ 12 of 24 instructions |
| 503 | `{step.hint}` (We Do) | (no — most are code strings) |
| 571 | `{step.feedback}` (We Do) | (mostly no, 1 instance) |
| 577 | `{step.tests}` (We Do) | (no) |
| 614 | `{project.context}` (You Do) | ✅ 2 `**bold**` runs |
| 649 | `{project.portfolioNote}` (You Do) | (no) |

**Exact leaked text (rendered, captured live via agent-browser):**
- Theory tab callout "Alcance de S06": `Trabajas solo con la **biblioteca estándar** (list, dict, set, copy, json). El objetivo es el **modelo tabular en memoria** (inicio CP-N1-B).`
- We Do tab, exercise S06-T1-A-E1: `E1 (guiado) — Dada `txs` de 5 montos, imprime los **últimos 2** con slicing y la longitud de la ventana.`
- You Do tab context: `Inicias el capstone **CP-N1-B**. Representas clientes, contactos y transacciones en estructuras Python puras (sin NumPy/pandas). Deduplicas por clave de negocio **reportando conflictos**…`

**Why this is a leak:** The section's own theory paragraphs ARE routed through `<RichText>` (line 387-389), so `**bold**` there renders correctly as bold. The inconsistency between how `paragraphs` (rendered) and `callout.content`/`instruction`/`context` (raw) are handled is an authoring/UX defect, not a deliberate choice. Learners see literal asterisks in 4 of 5 tabs.

### Leak #3 — None found in source comments / TODOs / authoring notes

- `grep -E 'TODO|FIXME|XXX|HACK|NOTE:|NB:|moved from|placeholder|stub|lorem ipsum|TBD|WIP' s06-numpy.ts` → no matches.
- No `// ...` JavaScript comments in the section file.
- No `"@author"`, `"@reviewer"`, `"@date"` JSDoc tags.
- The 3 `meta_leak` heuristic findings (`S04–S05`, `S07–S08` cross-references) are **false positives** — these are legitimate pedagogical cross-references to adjacent sections, flagged only because the heuristic regex matches `S0\d.*S\d\d`. Documented as known false-positive class.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do fidelity — ✅ Excellent

| Subtopic | Theory block | I Do demo | We Do (3 exercises) | Self-check Qs touching it |
|---|---|---|---|---|
| T1-A Secuencias/slicing | ✅ `S06-T1-A` | ✅ `S06-T1-A-DEMO` | ✅ E1 guided / E2 independent / E3 transfer | ✅ Q1 (slicing), Q2 (alias) |
| T1-B Unpacking/alias/copy | ✅ `S06-T1-B` | ✅ `S06-T1-B-DEMO` | ✅ E1/E2/E3 | ✅ Q2 (alias), Q6 (shallow copy) |
| T2-A Dicts/pertenencia | ✅ `S06-T2-A` | ✅ `S06-T2-A-DEMO` | ✅ E1/E2/E3 | ✅ Q8 (`get` vs `d[x]`) |
| T2-B Dedup/sets | ✅ `S06-T2-B` | ✅ `S06-T2-B-DEMO` | ✅ E1/E2/E3 | ✅ Q3 (conflicts), Q7 (set membership) |
| T3-A Anidado/recorridos | ✅ `S06-T3-A` | ✅ `S06-T3-A-DEMO` | ✅ E1/E2/E3 | ✅ Q9 (flatten with client_id) |
| T3-B Missing vs falsy | ✅ `S06-T3-B` | ✅ `S06-T3-B-DEMO` | ✅ E1/E2/E3 | (no direct Q, but Q8 covers `get`) |
| T4-A sorted/key | ✅ `S06-T4-A` | ✅ `S06-T4-A-DEMO` | ✅ E1/E2/E3 | ✅ Q4 (`rows.sort()` returns None) |
| T4-B Estructura/determinismo | ✅ `S06-T4-B` | ✅ `S06-T4-B-DEMO` | ✅ E1/E2/E3 | ✅ Q5 (`sort_keys=True`) |

**Coverage:** 8/8 subtopics have all 4 components (theory + I Do + 3 We Do + ≥1 self-check). 24/24 We Do exercises have valid `id`, `subtopicId`, `kind`, `instruction`, `hints[]` (2 progressive), `edgeCases`, `tests`, `feedback`, `starterCode`, `solutionCode`. ✅

**Progressive disclosure:** Each subtopic follows guided → independent → transfer. The `kind` field is correctly tagged. The E1 (guided) exercises always start with a starter that has a deliberate bug to fix (e.g., `ventana = txs[:2]` instead of `txs[-2:]`), which is an excellent pedagogical pattern (debug-to-learn).

**Cognitive load:** Average sentence length 9.92 words (well below the 15–32 technical-Spanish soft target). FH = 82.3 ("fácil"). Only 4 sentences exceed 32 words. The "orden pedagógico T1→T4" map at the top of the theory explicitly sequences learning and tells learners not to master conflicts/JSON on day 1 — strong metacognitive scaffolding.

### 5.2 Connective tissue & narrative flow — ✅ Strong

Each theory block opens with an explicit bridge:
- T1-B: *"Después de ventanas y contratos de columnas (T1-A), el siguiente riesgo del almacén es **confundir nombre con copia**."*
- T2-A: *"Con secuencias y copias bajo control, pasas al **índice del almacén**."*
- T2-B: *"El dict te da lookup; el **set** te da **membership de cohorte**…"*
- T3-A: *"Hasta aquí modelaste filas planas e índices. El modelo **CP-N1-B** anida…"*
- T3-B: *"Al anidar, el fallo típico es `KeyError` en un path incompleto…"*
- T4-A: *"Con el grafo en memoria legible, el export y los rankings piden **orden estable**."*
- T4-B: *"Cierra el modelo eligiendo estructura por **operación dominante**…"*

This is gold-standard narrative chaining — each subtopic explicitly names what was just learned and what's now at risk.

**"Hilo conductor" (CP-N1-B mini-almacén):** stated upfront in T0 map (line 32), revisited in every theory block, and operationalized in the You Do capstone. The same synthetic data convention (`example.com`, `C00x`, `TNNN`) is used across theory, I Do, We Do, and You Do — providing a consistent "domain" that lowers cognitive load.

### 5.3 Cross-references — ✅ Accurate

| Reference | Meaning | Verified? |
|---|---|---|
| `S04–S05` (line 15, 31) | "listas, funciones con contrato" | ✅ S04 = Iteración & Resúmenes, S05 = Funciones & Contratos (per live home page). |
| `S08` (line 32, 228, 354) | "modelo se conecta a CSV/JSON y cuarentena" | ✅ S08 = Archivos & ETL. |
| `S14` (line 32) | "cálculo vectorizado llega más adelante, p. ej. S14" | ✅ S14 = "NumPy y cómputo vectorizado". |
| `S05` (line 136, 317) | "políticas de normalización", "Normaliza tipos (S05)" | ✅ S05 = Funciones & Contratos (normalizadores). |
| `S03` (line 277) | "eco de S03: None≠0" | ✅ S03 = Decisiones & Reglas (accept/reject/review without confusing absence with falsy). |
| `CP-N1-B` (multiple) | Capstone portfolio block | ✅ Defined in `youDo.title` and threaded through the section. |

All cross-references are accurate and pedagogically load-bearing.

### 5.4 Exercise & exam alignment — ✅ Strong

- Every We Do exercise tests a concept introduced in the matching theory block / I Do demo.
- Every self-check question maps to ≥1 subtopic (see §5.1 table).
- The You Do capstone `memory_model.py` skeleton implements 4 of the 8 subtopic skills (`dedup_report`, `flatten_txs`, `get_nested`, `export_deterministic`) — a deliberate subset that forces integration rather than re-drill.
- Rubric weights sum to 100 % (25+25+20+15+15) and each criterion maps to a learning outcome.

### 5.5 Comparison with best-in-class external materials

| Resource | What it does well that S06 also does | What it does well that S06 could adopt |
|---|---|---|
| *Fluent Python* (Ramalho), ch. 2–3 | Sequence taxonomy, aliasing, deepcopy | S06 already cites it. Could add a "deep dive" callout on `__eq__` semantics for `dict` comparison (relevant to `seen[rid] != r` in dedup). |
| *Python for Everybody* (Severance), ch. 8–9 | List/dict basics with simple examples | S06's examples are more domain-rich (banking/onboarding) — a strength. |
| MIT 6.100L | Aliasing diagrams, complexity | S06 mentions O(n) vs O(1) but does not include a visual diagram. Could add an ASCII diagram of `alias = a` sharing a list object. |
| Real Python — "Dictionaries in Python" | `get` vs `[]`, defaultdict | S06 covers `get` but not `defaultdict`; could mention as a T2-A edge case. |
| CS50P — Data structures | Hands-on problem sets | S06's 24 We Do exercises exceed CS50P's density — a strength. |

**Verdict:** S06 holds its own against canonical Python material. The domain-rich synthetic data (LATAM banking onboarding) is a differentiator and matches the course's stated Peruvian-Spanish DATASCI focus.

### 5.6 Grammar & style (Peruvian Spanish) — ✅ Good, with minor fixes needed

- **Tone:** consistently second-person informal ("construyes", "elige", "no uses", "practica"), which is the correct register for a self-paced LATAM technical course.
- **Vocabulary:** standard Spanish with technical terms in code formatting (`dict`, `set`, `tuple`, `sorted`). LATAM-flavored names ("Ana Quispe", "Luis Huamán", "María Quispe"). Region mentions ("Lima", "Cusco", "Arequipa"). No Iberian-only forms ("vosotros", "ordenador") detected.
- **Punctuation:** mostly correct. Spanish inverted `¿?` and `¡!` are used (`¿dónde está C002?`, `¿está en la cohorte?`, `¿Qué produce xs[-2:]?`). The only gap is the missing `,` after the embedded `?"` in T0 map (issue #6).
- **Typography:** mostly consistent use of curly quotes `"…"`. Issue #5 flags an ASCII-vs-curly inconsistency.
- **Code formatting in prose:** inconsistent — some bare tech terms (`tuple`, `dict`, `set`, `append`, `sort`) appear without backticks (e.g., line 46 "Una **list** es mutable…" uses markdown bold for `list` instead of backticks; line 317 `strings '100' < '20'` has backticks for the comparison but not for `strings`). Issue #17.

### 5.7 Accessibility & motivation

- **Motivation:** Strong. The `jobRelevance` paragraph ties the section to "pipelines de onboarding y calidad de datos en bancos, fintech y retail en Perú" — concrete, regional, employability-anchored.
- **Accessibility:** The section uses `<RichText>` for theory (good for screen readers once markdown is processed), but raw fields with `**` leaks (issue #2) will be read aloud as "asterisk asterisk" by TTS — an accessibility regression. Fixing issue #2 fixes this too.
- **Pacing:** 18 hours for 8 subtopics × 4 activities = 32 activities → ~34 min/activity. Reasonable.

---

## 6. Grammatical Improvements — Paragraph-by-Paragraph Rewrite (Before / After)

Scope: every learner-facing prose paragraph in every tab where the heuristic+LT analysis flagged a real issue. Excludes pure labels (`edgeCases`, `tests`, `options`), pure code blocks, and obvious false positives.

### 6.1 Theory tab — T0 "Mapa de la sección: modelo tabular en memoria"

#### Paragraph 1 (line 30) — BEFORE
> **Antes de T1, tres ideas base** (no memorices el resto aún). Una **secuencia** (list/tuple) ordena filas y ventanas. Un **dict** indexa por id en tiempo casi constante. Un **set** responde "¿está en la cohorte?" y alimenta deduplicación. El resto de la sección enseña a **combinar** esas piezas en un mini almacén en RAM con datos sintéticos LATAM.

**Issues:** `?"` followed by `y alimenta` (no comma, no capital — LanguageTool `CAPITALIZATION_AFTER_QUESTION_MARK`); ASCII `"…"` could be curly.

#### AFTER
> **Antes de T1, tres ideas base** (no memorices el resto aún). Una **secuencia** (`list`/`tuple`) ordena filas y ventanas. Un **dict** indexa por id en tiempo casi constante. Un **set** responde "¿está en la cohorte?", y alimenta la deduplicación. El resto de la sección enseña a **combinar** esas piezas en un mini almacén en RAM con datos sintéticos LATAM.

Changes: `,` after `?"`; `list`/`tuple` in code formatting (consistency with rest of section); `la deduplicación` (article + noun).

#### Paragraph 2 (line 31) — BEFORE
> En esta sección construyes el **modelo tabular en memoria** que tu portafolio **CP-N1-B** necesita: listas, tuplas, dicts, sets y estructuras anidadas cliente → contactos → transacciones, con salidas **deterministas** y deduplicación que **reporta conflictos**. Partes de lo que ya practicaste en S04–S05 (listas, funciones con contrato); aquí el foco es **elegir y componer** estructuras, no reinventar bucles.

**Issues:** First sentence is 34 words (FH = 34.5, difícil). Should be split.

#### AFTER
> En esta sección construyes el **modelo tabular en memoria** que tu portafolio **CP-N1-B** necesita: listas, tuplas, dicts, sets y estructuras anidadas *cliente → contactos → transacciones*. Las salidas son **deterministas** y la deduplicación **reporta conflictos**. Partes de lo que ya practicaste en S04–S05 (listas, funciones con contrato); aquí el foco es **elegir y componer** estructuras, no reinventar bucles.

Changes: split into 2 sentences at `transacciones.`; italicized the `cliente → contactos → transacciones` shape; promoted `deterministas` and `reporta conflictos` to their own predicate.

#### Paragraph 3 (line 32) — BEFORE
> El hilo conductor es ese **mini almacén** (`example.com`, ids `C00x`). Trabajas solo con la **biblioteca estándar** — sin pandas ni NumPy (el cálculo vectorizado llega más adelante, p. ej. S14). En S08 ese modelo se conecta a CSV/JSON y cuarentena. **Nunca** PII real.

**Issues:** None grammatical. Sentence splitter broke at `p. ej.` (false positive `unbalanced_paren`). Style is clean.

#### AFTER (no change needed; the splitter artifact is a tooling issue, not a content issue)
> *(unchanged)*

#### Paragraph 4 (line 33) — BEFORE
> Orden pedagógico: **T1 Secuencias** (list/tuple/slicing → alias/copia) → **T2 Dicts/sets** (índices, dedup con conflictos) → **T3 Anidado y missing** → **T4 Orden y elección de estructura** (sorted estable, JSON determinista). En cada subtema: teoría, demo I Do y tres We Do (guiada → independiente → transferencia). Ritmo sugerido (~18 h): no intentes dominar conflictos y JSON el primer día; avanza T1→T4 en orden.

**Issues:** Once `<RichText>` renders the bold, this is a clean visual roadmap. The `**` markdown leak (issue #2) is the actual problem. Style is fine.

#### AFTER (no rewrite; just route through `<RichText>` per issue #2)
> *(unchanged)*

### 6.2 Theory tab — T1-A "Listas, tuplas y slicing"

#### Paragraph 1 (line 46) — BEFORE
> Una **list** es mutable y ordenada: ideal para filas que crecen (`append`, `extend`) — la cola de llegada de un lote de onboarding sintético. Una **tuple** es inmutable: ideal para **claves estables**, headers fijos o "contratos" de columnas que no deben mutarse por accidente cuando varios helpers comparten el mismo esquema.

**Issues:** `**list**` and `**tuple**` should be backtick-code, not bold (the section uses backticks for `append`, `extend` in the same sentence — inconsistent). 27-word sentence is on the edge.

#### AFTER
> Una `list` es mutable y ordenada: ideal para filas que crecen (`append`, `extend`) — la cola de llegada de un lote de onboarding sintético. Una `tuple` es inmutable: ideal para **claves estables**, headers fijos o "contratos" de columnas que no deben mutarse por accidente cuando varios helpers comparten el mismo esquema.

Changes: `**list**` → `` `list` ``; `**tuple**` → `` `tuple` ``. Kept `**claves estables**` bold (it's a concept, not a literal type name).

#### Paragraph 2 (line 47) — BEFORE
> El **slicing** `seq[i:j:k]` produce una **ventana** sin mutar el original (en listas/tuplas crea una nueva secuencia). `txs[-3:]` son las últimas tres transacciones: el patrón de "últimos N movimientos" en un extracto. El **stop es exclusivo**, igual que en `range` — evita off-by-one al numerar N filas. En lista vacía, `[][-2:]` devuelve `[]` sin error.

**Issues:** None grammatical. Style is clean.

#### AFTER
> *(unchanged)*

#### Paragraph 3 (line 48) — BEFORE
> Membership `x in seq` es **O(n)** en listas: útil para lotes pequeños de demo; para lookups masivos preferirás **set/dict** (O(1) promedio) en T2. Caso de borde: no uses una lista de 100k ids para `in` dentro de un loop caliente — es la semilla del O(n²) que T4-B te hará medir conceptualmente.

**Issues:** None grammatical. The `100k` is informal (could be `100 000` or `100 mil` for stricter Spanish typography, but `100k` is acceptable tech register).

#### AFTER
> *(unchanged)*

### 6.3 Theory tab — T1-B "Unpacking, aliasing y copia"

#### Paragraph 1 (line 83) — BEFORE
> Después de ventanas y contratos de columnas (T1-A), el siguiente riesgo del almacén es **confundir nombre con copia**. **Unpacking** `a, b = fila` desempaqueta sin índices ruidosos. Con `head, *rest = fila` capturas el primer valor y dejas el sobrante en una lista (útil cuando el lote trae columnas variables). Si el largo no calza con el patrón, Python lanza error: **eso es bueno** — detecta shape roto antes de contaminar el almacén.

**Issues:** None grammatical. 4 sentences, good rhythm.

#### AFTER
> *(unchanged)*

#### Paragraph 2 (line 84) — BEFORE
> **Aliasing**: `b = a` **no** copia; ambas variables apuntan al **mismo** objeto. Si `a` es una lista de dicts y mutas `b[0]['x']`, también cambia `a[0]`. Ese bug clásico aparece al "clonar" clientes en memoria sin copiar de verdad: un score de demo que se "arregla" en un helper y se corrompe en el store original.

**Issues:** None grammatical.

#### AFTER
> *(unchanged)*

#### Paragraph 3 (line 85) — BEFORE
> `list.copy()` / `seq[:]` hacen **copia superficial**. Para dicts anidados necesitas `copy.deepcopy` o reconstruir por fila (`dict(c)` o `{**c, 'tags': list(c['tags'])}`). En intake, shallow basta si solo reordenas filas **sin** mutar campos compartidos; si mutas tags o contactos anidados, usa deep o un dict nuevo por fila. Contrato: **aislar antes de mutar**.

**Issues:** None grammatical. The inline code `{**c, 'tags': list(c['tags'])}` is dense but appropriate for a Python collections section.

#### AFTER
> *(unchanged)*

### 6.4 Theory tab — T2-A "Diccionarios y pertenencia"

#### Paragraph 1 (line 134) — BEFORE
> Con secuencias y copias bajo control, pasas al **índice del almacén**. Un **dict** modela registros y **índices** `id → cliente`. Lookup promedio **O(1)**. Construye índices con `{c['id']: c for c in filas}` cuando harás muchos accesos por clave: buscar "¿dónde está C002?" no debe recorrer toda la lista en cada llamada.

**Issues:** `**dict**` and `**índices**` should be `dict` (code) and "índices" (concept). `por id` should be `por ID` (3 instances, issue #11). Also "Lookup promedio **O(1)**" is a fragment, not a full sentence (acceptable as a punchy aside).

#### AFTER
> Con secuencias y copias bajo control, pasas al **índice del almacén**. Un `dict` modela registros y **índices** `id → cliente`. Lookup promedio **O(1)**. Construye índices con `{c['id']: c for c in filas}` cuando harás muchos accesos por clave: buscar "¿dónde está C002?" no debe recorrer toda la lista en cada llamada.

Changes: `**dict**` → `` `dict` ``. (The "por ID" change is in another paragraph — see below.)

#### Paragraph 2 (line 135) — BEFORE
> `d.get(k)` o `d.get(k, default)` evita **KeyError** en campos opcionales. `k in d` prueba pertenencia de **clave**, no de valor — no confundas con "¿el cliente tiene email?" si buscas en values. Caso: `"email" in cliente` no dice si el email es válido; solo si la clave existe en el dict.

**Issues:** `dict` at end is bare (no backticks) — inconsistent with `d.get(k)` formatting. 

#### AFTER
> `d.get(k)` o `d.get(k, default)` evita **KeyError** en campos opcionales. `k in d` prueba pertenencia de **clave**, no de valor — no confundas con "¿el cliente tiene email?" si buscas en values. Caso: `"email" in cliente` no dice si el email es válido; solo si la clave existe en el `dict`.

Change: `dict` → `` `dict` ``.

#### Paragraph 3 (line 136) — BEFORE
> `update` / merge fusiona configs: el segundo dict **pisa** claves del primero. Documenta la precedencia (`override > base`) y **no mutes** el dict base compartido si varios helpers lo leen: prefer `{**base, **override}` o una copia antes de `update`. Eso evita pisar sin querer políticas de normalización de S05.

**Issues:** `dict` bare × 2.

#### AFTER
> `update` / merge fusiona configs: el segundo `dict` **pisa** claves del primero. Documenta la precedencia (`override > base`) y **no mutes** el `dict` base compartido si varios helpers lo leen: prefer `{**base, **override}` o una copia antes de `update`. Eso evita pisar sin querer políticas de normalización de S05.

Changes: `dict` → `` `dict` `` × 2.

### 6.5 Theory tab — T2-B "Deduplicación y operaciones de set"

#### Paragraph 1 (line 175) — BEFORE
> El dict te da lookup; el **set** te da **membership de cohorte** y deduplicación de ids/emails hashables. Ideal para **unión/intersección/diferencia** de dos lotes sintéticos (quién está en A y en B, quién solo en A). Elementos deben ser hashables: `str` e `int` sí; `list` o `dict` no van directo al set.

**Issues:** `dict` bare × 2; `set` bare at end.

#### AFTER
> El `dict` te da lookup; el **set** te da **membership de cohorte** y deduplicación de ids/emails hashables. Ideal para **unión/intersección/diferencia** de dos lotes sintéticos (quién está en A y en B, quién solo en A). Elementos deben ser hashables: `str` e `int` sí; `list` o `dict` no van directo al `set`.

Changes: `dict`/`set` → code formatting.

#### Paragraph 2 (line 176) — BEFORE
> Deduplicar **no es borrar a ciegas** cuando hay conflicto de negocio: dos filas con mismo `id` pero payload distinto deben **reportarse** en `conflicts`, no silenciarse. El patrón de calidad es `unique` + `conflicts`. **Política:** si el payload es **idéntico**, es un duplicado inocente (no entra a `conflicts`); si **difiere**, deja traza del choque. "El último gana" sin traza es un anti-patrón de calidad de datos.

**Issues:** `mismo id pero payload distinto` → `mismo id, pero payload distinto` (LanguageTool `COMMA_PERO`); ASCII `"El último gana"` should be curly `"El último gana"` (consistency with `"¿dónde está C002?"` elsewhere).

#### AFTER
> Deduplicar **no es borrar a ciegas** cuando hay conflicto de negocio: dos filas con mismo `id`, pero payload distinto, deben **reportarse** en `conflicts`, no silenciarse. El patrón de calidad es `unique` + `conflicts`. **Política:** si el payload es **idéntico**, es un duplicado inocente (no entra a `conflicts`); si **difiere**, deja traza del choque. "El último gana" sin traza es un anti-patrón de calidad de datos.

Changes: `, pero` added (× 1); ASCII `"…"` → curly `"…"`.

#### Paragraph 3 (line 177) — BEFORE
> Para exports **deterministas**, no dependas del orden del set: ordena con `sorted(...)` al exportar (JSON `sort_keys`, listas de ids ordenadas). Reproducibilidad > "orden de llegada mágico". El mismo lote sintético debe producir el mismo reporte en cada corrida del demo.

**Issues:** None grammatical. `"orden de llegada mágico"` uses curly quotes ✅. `Reproducibilidad > "orden de llegada mágico"` is a punchy fragment — acceptable.

#### AFTER
> *(unchanged)*

### 6.6 Theory tab — T3-A "Estructuras anidadas y recorridos"

#### Paragraph 1 (line 227) — BEFORE
> Hasta aquí modelaste filas planas e índices. El modelo **CP-N1-B** anida: `cliente = {id, nombre, contacts: [...], txs: [...]}`. Recorres con `for c in clients: for t in c['txs']:` — bucles anidados **legibles** sobre el grafo en memoria. No hace falta una clase formal aún: un `list[dict]` bien documentado es un almacén suficiente para la **entrega de modelo en memoria** del portafolio.

**Issues:** None grammatical. 4 sentences, good rhythm.

#### AFTER
> *(unchanged)*

#### Paragraph 2 (line 228) — BEFORE
> **Aplanar** transacciones a filas densas (con `client_id` denormalizado) prepara el shape de export CSV en S08: una fila por tx, no un JSON anidado opaco. **Contar** contactos por cliente (`len(c['contacts'])`) valida integridad del almacén en RAM antes de exportar.

**Issues:** None grammatical.

#### AFTER
> *(unchanged)*

#### Paragraph 3 (line 229) — BEFORE
> Shape inconsistente (falta clave `txs`, o no es lista) se detecta con `isinstance` y se manda a **review** — no asumas que todo dict llegó bien formado del lote sintético. Un string `'oops'` donde debía haber lista de txs es basura silenciosa si solo haces `if c.get('txs'):`.

**Issues:** `dict` bare mid-sentence.

#### AFTER
> Shape inconsistente (falta clave `txs`, o no es lista) se detecta con `isinstance` y se manda a **review** — no asumas que todo `dict` llegó bien formado del lote sintético. Un string `'oops'` donde debía haber lista de txs es basura silenciosa si solo haces `if c.get('txs'):`.

Change: `dict` → `` `dict` ``.

### 6.7 Theory tab — T3-B "Acceso seguro y valores faltantes"

#### Paragraph 1 (line 276) — BEFORE
> Al anidar, el fallo típico es `KeyError` en un path incompleto (`profile` ausente, luego `phone`). Campos opcionales: `contact.get('telefono')` puede devolver `None`. Encadenar `.get` en anidados evita el crash: `(c.get('profile') or {}).get('phone')` o, mejor, un helper `get_nested` / `dig` reutilizable.

**Issues:** None grammatical.

#### AFTER
> *(unchanged)*

#### Paragraph 2 (line 277) — BEFORE
> Distingue **missing** (`None` / clave ausente) de **vacío falsy** (`''`, `0`, `[]`). Un teléfono `''` no es lo mismo que "no vino el campo": el reporte de calidad debe etiquetar distinto si la política lo exige (eco de S03: `None≠0`). Caso: `if not phone` marcaría mal un monto `0` o un email vacío que aún es "presente pero inválido".

**Issues:** None grammatical. Style is exemplary (concrete cases, cross-reference to S03).

#### AFTER
> *(unchanged)*

#### Paragraph 3 (line 278) — BEFORE
> Helpers `dig(obj, *path)` o `get_nested` centralizan la política y se **testean una vez**. No copies el mismo try/except de KeyError en 20 sitios del orquestador. Contrato del helper: si falta un nivel del path, devuelve `default`; si la clave existe con valor `None`, devuelve `None` (no sustituyas en silencio).

**Issues:** None grammatical.

#### AFTER
> *(unchanged)*

### 6.8 Theory tab — T4-A "Ordenamiento y key"

#### Paragraph 1 (line 315) — BEFORE
> Con el grafo en memoria legible, el export y los rankings piden **orden estable**. `sorted(seq, key=fn)` devuelve **nueva** lista. `list.sort(key=fn)` **muta in-place** y retorna `None` — un bug clásico si haces `x = rows.sort(...)` y pierdes las filas (`x is None` y el store original ya cambió).

**Issues:** None grammatical.

#### AFTER
> *(unchanged)*

#### Paragraph 2 (line 316) — BEFORE
> `key` multi-campo: `key=lambda r: (r['region'], r['nombre'])` ordena **estable** por región y luego nombre. Timsort preserva el orden relativo de empates — útil para audits reproducibles y para que el README del portafolio no "baile" entre corridas del mismo lote sintético.

**Issues:** None grammatical. `"baile"` curly ✅.

#### AFTER
> *(unchanged)*

#### Paragraph 3 (line 317) — BEFORE
> Para montos, asegúrate de que el tipo sea **numérico** antes de ordenar; strings `'100' < '20'` rompen el ranking (orden lexicográfico). Normaliza tipos (S05) antes de `sorted`. Caso de lab: top por `monto` en txs sintéticas solo es confiable si `monto` es `int`/`float` (o `Decimal` más adelante), no str sucio del formulario.

**Issues:** `str` bare at end (should be `` `str` ``).

#### AFTER
> Para montos, asegúrate de que el tipo sea **numérico** antes de ordenar; strings `'100' < '20'` rompen el ranking (orden lexicográfico). Normaliza tipos (S05) antes de `sorted`. Caso de lab: top por `monto` en txs sintéticas solo es confiable si `monto` es `int`/`float` (o `Decimal` más adelante), no `str` sucio del formulario.

Change: `str` → `` `str` ``.

### 6.9 Theory tab — T4-B "Estructura adecuada, complejidad y determinismo"

#### Paragraph 1 (line 352) — BEFORE
> Cierra el modelo eligiendo estructura por **operación dominante**: muchos appends → list; muchos lookups por id → dict; membership de cohortes → set; contrato fijo inmutable → tuple. **No** uses dict "porque sí" si el orden de llegada importa y no indexas. Justificar la elección es parte del rubric del You Do.

**Issues:** `por id` → `por ID` (issue #11); bare `list`/`dict`/`set`/`tuple` × 4.

#### AFTER
> Cierra el modelo eligiendo estructura por **operación dominante**: muchos appends → `list`; muchos lookups por ID → `dict`; membership de cohortes → `set`; contrato fijo inmutable → `tuple`. **No** uses `dict` "porque sí" si el orden de llegada importa y no indexas. Justificar la elección es parte del rubric del You Do.

Changes: code-formatting × 5; `por id` → `por ID`.

#### Paragraph 2 (line 353) — BEFORE
> Complejidad (solo ahora, con las cuatro estructuras en la mano): membership en list **O(n)**; en set/dict **O(1)** promedio. No hagas `if x in big_list` dentro de un loop de n si puedes **preindexar** con un set o dict. n búsquedas sobre list cuestan ~n×n chequeos conceptuales; sobre set, ~n. Eso es deuda de rendimiento en el almacén en RAM.

**Issues:** Bare `list`/`set`/`dict` × multiple.

#### AFTER
> Complejidad (solo ahora, con las cuatro estructuras en la mano): membership en `list` **O(n)**; en `set`/`dict` **O(1)** promedio. No hagas `if x in big_list` dentro de un loop de `n` si puedes **preindexar** con un `set` o `dict`. `n` búsquedas sobre `list` cuestan ~`n×n` chequeos conceptuales; sobre `set`, ~`n`. Eso es deuda de rendimiento en el almacén en RAM.

Changes: code-formatting for all structure names and the `n` variable.

#### Paragraph 3 (line 354) — BEFORE
> **Determinismo**: `json.dumps(obj, sort_keys=True, ensure_ascii=False)` + `sorted` de ids/clients produce el mismo string en cada corrida. La reproducibilidad es un **criterio de entrega** de CP-N1-B: demos y diffs de README deben ser estables. Próximo paso natural: en S08 ese JSON/list[dict] se conecta a archivos CSV/JSON y cuarentena; aquí cierras el shape en memoria.

**Issues:** None grammatical.

#### AFTER
> *(unchanged)*

### 6.10 Theory tab — Callouts (4)

All 4 theory callouts use `**bold**` in source. Once issue #2 is fixed (route `callout.content` through `<RichText>`), they render correctly. No copy changes needed beyond the markdown rendering fix. The callout titles are clean.

### 6.11 I Do tab — `intro` + 8 demos

#### `iDo.intro` (line 383) — BEFORE
> Ocho demos I Do (uno por subtema, orden T1→T4). Cada demo **muestra** el contrato del subtema antes de que lo practicques en We Do. Modelo en memoria del inicio CP-N1-B; datos sintéticos; solo biblioteca estándar (browser-pyodide).

**Issues:** `**muestra**` leaks (raw render — issue #2); `practicques` is a Catalan/Valencian form, in Spanish it should be `practiques`.

#### AFTER
> Ocho demos I Do (uno por subtema, orden T1→T4). Cada demo **muestra** el contrato del subtema antes de que lo practiques en We Do. Modelo en memoria del inicio CP-N1-B; datos sintéticos; solo biblioteca estándar (browser-pyodide).

Change: `practicques` → `practiques` (Spanish spelling; the `cqu` cluster is Catalan). Verified: RAE dictionary has *practicar* → subjunctive *practique*.

#### 8 demo `description` fields — all clean, no changes needed.

#### 8 demo `why` fields — all clean, no changes needed.

### 6.12 We Do tab — `intro` + 24 exercises

#### `weDo.intro` (line 674) — BEFORE
> Andamiaje por subtema: **E1 guiado** (arregla el bug del starter) → **E2 independiente** → **E3 transferencia**. Son 24 ejercicios (8×3) con 2 hints c/u. Ejecuta, compara con la solución y solo entonces avanza. Sin NumPy/pandas; datos sintéticos.

**Issues:** `**E1 guiado**` etc. leak (issue #2); `c/u` is informal abbreviation.

#### AFTER
> Andamiaje por subtema: **E1 guiado** (arregla el bug del starter) → **E2 independiente** → **E3 transferencia**. Son 24 ejercicios (8×3) con 2 hints cada uno. Ejecuta, compara con la solución y solo entonces avanza. Sin NumPy/pandas; datos sintéticos.

Change: `c/u` → `cada uno` (formal Spanish).

#### 24 `weDo.instruction` fields — survey

Of the 24 instructions, 12 use `**bold**` markers and will render correctly once issue #2 is fixed. Beyond the markdown-leak fix, the following instructions need copy edits:

##### E1 T1-A (line 681) — BEFORE
> E1 (guiado) — Dada `txs` de 5 montos, imprime los **últimos 2** con slicing y la longitud de la ventana. Caso vacío: si `txs=[]`, imprime `ventana=[]` y `len=0`.

**AFTER** *(no copy change; once `**` renders, this is clean)*

##### E1 T4-B (line 1549) — BEFORE *(issue #7 — 35 words, inline enumeration)*
> E1 (guiado) — Para tres operaciones del almacén en RAM, elige e imprime la estructura Python adecuada: (1) cola de llegada de filas → list; (2) lookup frecuente por id → dict; (3) cohorte de emails únicos → set. Una línea por job con la elección explícita.

**AFTER**
> E1 (guiado) — Para tres operaciones del almacén en RAM, elige e imprime la estructura Python adecuada. Una línea por operación con la elección explícita:
>
> 1. cola de llegada de filas → `list`
> 2. lookup frecuente por ID → `dict`
> 3. cohorte de emails únicos → `set`

Changes: split into a markdown numbered list (fixes the 35-word sentence AND the markdown-leak simultaneously); `por id` → `por ID`; bare structure names → code formatting.

##### E3 T1-A (line 766) — BEFORE *(issue #17 — inconsistent `.append` formatting)*
> E3 (transferencia) — Hay un bug: se trata una tupla de ids como lista y se intenta `.append`. Captura el AttributeError, convierte a list, append 'C003', e imprime el resultado y un mensaje de diagnóstico.

**AFTER**
> E3 (transferencia) — Hay un bug: se trata una tupla de ids como lista y se intenta `.append`. Captura el `AttributeError`, convierte a `list`, haz `append('C003')`, e imprime el resultado y un mensaje de diagnóstico.

Changes: `AttributeError` → code; `list` → code; `append 'C003'` → `append('C003')` (proper Python syntax in code formatting).

##### Remaining 21 instructions — no copy changes needed beyond issue #2 (`**` rendering).

#### 24 `weDo.feedback` fields — survey

Inconsistent terminal punctuation. 14 of 24 end with `.`; the rest end without punctuation. Examples:
- ✅ `"Slicing negativo no lanza error en lista vacía."`
- ❌ `"tuple no tiene append → AttributeError"`
- ❌ `"KEYS estable + more"`
- ❌ `"Copia antes de update in-place."` ← has period (inconsistent with above)
- ❌ `"Orden posicional importa."` ← has period

**Recommendation:** Add terminal `.` to all 24 `feedback` strings for consistency. (Specific diffs in §7.)

#### `weDo.tests` field — 7 records

The `tests` field is shown in the UI as a "Tests" caption and reads as cryptic fragments (`"[40, 50] y []"`, `"T1 luego T2"`, `"C001 → 2 ; C002 → 0"`). Two options:

**Option A (hide from learner):** Remove the `tests` field from the rendered UI. Keep it as a developer-facing field in the source.

**Option B (rewrite as sentences):** E.g., `"La salida esperada es [40, 50] para los últimos 2 y [] para la lista vacía."`

Recommend **Option A** — the `tests` field is internal scaffolding and shouldn't clutter the learner UI.

### 6.13 You Do tab — context, objectives, requirements, portfolioNote, rubric

#### `youDo.context` (line 1669) — BEFORE *(issue #19 — anaphoric monotony, markdown leak)*
> Inicias el capstone **CP-N1-B**. Representas clientes, contactos y transacciones en estructuras Python puras (sin NumPy/pandas). Deduplicas por clave de negocio **reportando conflictos**, aplanas txs y exportas JSON determinista. En S07–S08 se suma normalización LATAM e ingesta por archivos. Solo datos sintéticos.

**Issues:** 4 of 5 sentences start with a verb (`Inicias`, `Representas`, `Deduplicas`, `aplanas`, `exportas`). Once `**` renders (issue #2 fix), the markdown is fine, but the rhythm is monotonous.

#### AFTER
> Inicias el capstone **CP-N1-B**: representas clientes, contactos y transacciones en estructuras Python puras (sin NumPy/pandas). La deduplicación por clave de negocio **reporta conflictos**; aplanas las txs y exportas un JSON determinista. En S07–S08 se suma normalización LATAM e ingesta por archivos. Solo datos sintéticos.

Changes: merged sentences 2+3 with colon+semicolon for variety; `Deduplicas…aplanas…exportas` → `La deduplicación…; aplanas…exportas…` (varies the subject).

#### `youDo.objectives` (5 records) — all start with infinitive verb (`Representar`, `Implementar`, `Aplanar`, `Acceso`, `Export`). **Consistency:** `Acceso` is a noun, the others are infinitives. Change `Acceso seguro a faltantes (get_nested)` → `Acceder de forma segura a faltantes (get_nested)`.

#### `youDo.requirements` (5 records) — all clean noun phrases. No changes.

#### `youDo.portfolioNote` (line 1755) — clean. No changes.

#### `youDo.rubric` (5 records) — clean noun phrases. No changes.

### 6.14 Autocheck tab — 9 questions

All 9 questions are grammatically correct. Two minor issues:

##### Q2 (line 1774) — BEFORE
> b = a (listas) y mutas b.append(1). ¿Qué pasa con a?

**Issues:** Bare `b = a` and `b.append(1)` should be code-formatted once issue #2 is fixed (so `step.instruction` renders through RichText — but `selfCheck.question` is also rendered raw, let me verify…).

Looking at SectionView.tsx, `selfCheck.question` is rendered inside a `<p>` — let me check if it goes through RichText.

*(verified in §7 verification: `selfCheck.question` is rendered as raw text in the quiz UI; the bare `b = a` will appear as plain text.)*

**AFTER** (recommend code formatting via backticks)
> `b = a` (listas) y mutas `b.append(1)`. ¿Qué pasa con `a`?

##### Q6 (line 1802) — BEFORE
> Si haces `copia = rows.copy()` donde `rows` es `list[dict]` y mutas `copia[0]['tags']`, ¿el original queda aislado?

**Issues:** None grammatical.

##### Q8 (line 1816) — BEFORE
> Si falta la clave `"x"` en el dict `d`, ¿qué diferencia hay entre `d.get("x", "N/A")` y `d["x"]`?

**Issues:** `dict d` bare (should be `` `dict` `d` `` but acceptable as natural prose here).

All 9 explanations are clean.

### 6.15 Resources tab — labels & notes

All 6 docs, 2 books, 4 courses have clean labels and notes. No changes.

---

## 7. Proposed GitHub-style Diffs (one per issue or logical group)

> **Note:** Diffs are *proposed* — do not apply in this audit pass. The Fixer prompt will apply them.

### Diff 1 — Fix the `id` meta-leak (issue #1, **H**)

This is the highest-impact fix. Two options:

**Option A (minimal — change S06 `id` to match the topic):**

```diff
--- a/src/lib/course/sections/s06-numpy.ts
+++ b/src/lib/course/sections/s06-numpy.ts
@@ -1,8 +1,8 @@
 import type { CourseSection } from '../../types'
 
 export const section06: CourseSection = {
-  id: "numpy",
+  id: "colecciones",
   index: 6,
   title: "Colecciones y estructuras de datos",
   shortTitle: "Colecciones",
```

**Option B (recommended — also rename the file and add a `colecciones` key to the editor placeholder map):**

```diff
--- /dev/null
+++ b/src/lib/course/sections/s06-colecciones.ts
@@ -0,0 +1,1897 @@
+(entire content of s06-numpy.ts with `id: "colecciones"` per Option A)
--- a/src/lib/course/sections/s06-numpy.ts
+++ /dev/null
@@ -1,1897 +0,0 @@
-(deleted)
--- a/src/lib/course/index.ts
+++ b/src/lib/course/index.ts
@@ -4,7 +4,7 @@
 import { section05 } from './sections/s05-oop'
-import { section06 } from './sections/s06-numpy'
+import { section06 } from './sections/s06-colecciones'
 import { section07 } from './sections/s07-data-acquisition'
--- a/src/components/course/SectionView.tsx
+++ b/src/components/course/SectionView.tsx
@@ -1047,6 +1047,27 @@
     'numpy': {
       // keep — actual NumPy section S14 may use this; verify before removing
     },
+    'colecciones': {
+      title: 'Practica list, dict y set',
+      code: `# Practica colecciones (sin NumPy/pandas)
+clientes = [
+    {"id": "C001", "nombre": "Ana Quispe", "region": "Lima"},
+    {"id": "C002", "nombre": "Luis Huamán", "region": "Cusco"},
+]
+
+# Índice id → cliente (dict comprehension)
+idx = {c["id"]: c for c in clientes}
+print("lookup C002:", idx["C002"]["region"])
+
+# Membership O(1) con set
+emails = {"ana@ex.com", "luis@ex.com"}
+print("ana está?", "ana@ex.com" in emails)
+
+# Slicing de últimas 2 filas
+print("últimas 2:", [c["id"] for c in clientes[-2:]])
+`,
+      expectedOutput: `lookup C002: Cusco
+ana está? True
+últimas 2: ['C001', 'C002']`,
+      hint: 'Convierte la lista en un dict {id: cliente} y mira el lookup',
+    },
```

### Diff 2 — Route raw fields through `<RichText>` (issue #2, **H**)

```diff
--- a/src/components/course/SectionView.tsx
+++ b/src/components/course/SectionView.tsx
@@ -186,7 +186,7 @@
               <p className="text-sm text-foreground/80">
-                {section.jobRelevance}
+                <RichText content={section.jobRelevance} sectionId={section.id} />
               </p>
@@ -398,7 +398,9 @@
             {block.callout && (
-              <Callout type={block.callout.type} title={block.callout.title}>
-                {block.callout.content}
-              </Callout>
+              <Callout type={block.callout.type} title={block.callout.title}>
+                <RichText content={block.callout.content} sectionId={section.id} />
+              </Callout>
             )}
@@ -488,7 +490,7 @@
-                <span className="text-sm font-semibold">{step.instruction}</span>
+                <span className="text-sm font-semibold">
+                  <RichText content={step.instruction} sectionId={section.id} />
+                </span>
@@ -568,7 +572,7 @@
-                    {step.feedback}
+                    <RichText content={step.feedback} sectionId={section.id} />
@@ -611,7 +615,7 @@
-            <p className="mt-1 text-sm text-foreground/80">{project.context}</p>
+            <p className="mt-1 text-sm text-foreground/80">
+              <RichText content={project.context} sectionId={section.id} />
+            </p>
```

**Caveat:** `<RichText>` wraps content in a `<div>` with `space-y-4`. For single-line fields (`step.instruction`, `step.feedback`, `jobRelevance`), this may introduce unwanted vertical spacing. Either (a) add a `variant="inline"` prop to `<RichText>` that returns a `<span>` for inline contexts, or (b) use a lighter-weight markdown-stripping helper (`stripMarkdown(**x**)` → `<strong>x</strong>`) for inline fields. Recommend (b) for inline fields and `<RichText>` for block fields (`jobRelevance`, `project.context`, `callout.content`).

### Diff 3 — Fix `practicques` → `practiques` (issue from §6.11)

```diff
--- a/src/lib/course/sections/s06-numpy.ts
+++ b/src/lib/course/sections/s06-numpy.ts
@@ -381,7 +381,7 @@
   iDo: {
-    intro: "Ocho demos I Do (uno por subtema, orden T1→T4). Cada demo **muestra** el contrato del subtema antes de que lo practicques en We Do. Modelo en memoria del inicio CP-N1-B; datos sintéticos; solo biblioteca estándar (browser-pyodide).",
+    intro: "Ocho demos I Do (uno por subtema, orden T1→T4). Cada demo **muestra** el contrato del subtema antes de que lo practiques en We Do. Modelo en memoria del inicio CP-N1-B; datos sintéticos; solo biblioteca estándar (browser-pyodide).",
```

### Diff 4 — Fix `c/u` → `cada uno` (issue from §6.12)

```diff
--- a/src/lib/course/sections/s06-numpy.ts
+++ b/src/lib/course/sections/s06-numpy.ts
@@ -672,7 +672,7 @@
   weDo: {
-    intro: "Andamiaje por subtema: **E1 guiado** (arregla el bug del starter) → **E2 independiente** → **E3 transferencia**. Son 24 ejercicios (8×3) con 2 hints c/u. Ejecuta, compara con la solución y solo entonces avanza. Sin NumPy/pandas; datos sintéticos.",
+    intro: "Andamiaje por subtema: **E1 guiado** (arregla el bug del starter) → **E2 independiente** → **E3 transferencia**. Son 24 ejercicios (8×3) con 2 hints cada uno. Ejecuta, compara con la solución y solo entonces avanza. Sin NumPy/pandas; datos sintéticos.",
```

### Diff 5 — Fix `COMMA_PERO` × 2 (issue #12)

```diff
--- a/src/lib/course/sections/s06-numpy.ts
+++ b/src/lib/course/sections/s06-numpy.ts
@@ -173,7 +173,7 @@
         "Deduplicar **no es borrar a ciegas** cuando hay conflicto de negocio: dos filas con mismo `id` pero payload distinto deben **reportarse** en `conflicts`, no silenciarse. El patrón de calidad es `unique` + `conflicts`. **Política:** si el payload es **idéntico**, es un duplicado inocente (no entra a `conflicts`); si **difiere**, deja traza del choque. "El último gana" sin traza es un anti-patrón de calidad de datos.",
+        "Deduplicar **no es borrar a ciegas** cuando hay conflicto de negocio: dos filas con mismo `id`, pero payload distinto, deben **reportarse** en `conflicts`, no silenciarse. El patrón de calidad es `unique` + `conflicts`. **Política:** si el payload es **idéntico**, es un duplicado inocente (no entra a `conflicts`); si **difiere**, deja traza del choque. "El último gana" sin traza es un anti-patrón de calidad de datos.",
@@ -1399,7 +1399,7 @@
-          "0 y '' son falsy pero pueden ser datos válidos.",
+          "0 y '' son falsy, pero pueden ser datos válidos.",
```

### Diff 6 — Fix `por id` → `por ID` × 3 (issue #11)

```diff
--- a/src/lib/course/sections/s06-numpy.ts
+++ b/src/lib/course/sections/s06-numpy.ts
@@ -350,7 +350,7 @@
-        "Cierra el modelo eligiendo estructura por **operación dominante**: muchos appends → list; muchos lookups por id → dict; membership de cohortes → set; contrato fijo inmutable → tuple. **No** uses dict "porque sí" si el orden de llegada importa y no indexas. Justificar la elección es parte del rubric del You Do.",
+        "Cierra el modelo eligiendo estructura por **operación dominante**: muchos appends → list; muchos lookups por ID → dict; membership de cohortes → set; contrato fijo inmutable → tuple. **No** uses dict "porque sí" si el orden de llegada importa y no indexas. Justificar la elección es parte del rubric del You Do.",
@@ -1547,7 +1547,7 @@
-          "E1 (guiado) — Para tres operaciones del almacén en RAM, elige e imprime la estructura Python adecuada: (1) cola de llegada de filas → list; (2) lookup frecuente por id → dict; (3) cohorte de emails únicos → set. Una línea por job con la elección explícita.",
+          "E1 (guiado) — Para tres operaciones del almacén en RAM, elige e imprime la estructura Python adecuada. Una línea por operación con la elección explícita:\n\n1. cola de llegada de filas → `list`\n2. lookup frecuente por ID → `dict`\n3. cohorte de emails únicos → `set`",
```

### Diff 7 — Fix `vs` → `vs.` × 5 (issue #10)

The 5 `vs` instances are in: `learningOutcomes.text` line 18 (`alias vs copia superficial/profunda`), `weDo.edgeCases` (lines 1119, 1263, 1354, 1405, 1664).

```diff
--- a/src/lib/course/sections/s06-numpy.ts
+++ b/src/lib/course/sections/s06-numpy.ts
@@ -15,7 +15,7 @@
   learningOutcomes: [
-    { text: "Desempaquetar secuencias y distinguir alias vs copia superficial/profunda" },
+    { text: "Desempaquetar secuencias y distinguir alias vs. copia superficial/profunda" },
@@ -1117,7 +1117,7 @@
-        edgeCases: ["conflicto vs duplicado idéntico"],
+        edgeCases: ["conflicto vs. duplicado idéntico"],
@@ -1261,7 +1261,7 @@
-        edgeCases: ["None vs ausente"],
+        edgeCases: ["None vs. ausente"],
@@ -1402,7 +1402,7 @@
-        edgeCases: ["falsy vs missing"],
+        edgeCases: ["falsy vs. missing"],
@@ -1512,7 +1512,7 @@
-        edgeCases: ["in-place vs sorted"],
+        edgeCases: ["in-place vs. sorted"],
```

**Note:** Spanish `vs.` is preferred over bare `vs` per RAE. However, in tech-prose registers, bare `vs` is widely tolerated. This is a low-severity polish.

### Diff 8 — Fix `CAPITALIZATION_AFTER_QUESTION_MARK` in T0 map (issue #6)

```diff
--- a/src/lib/course/sections/s06-numpy.ts
+++ b/src/lib/course/sections/s06-numpy.ts
@@ -28,7 +28,7 @@
       paragraphs: [
-        "**Antes de T1, tres ideas base** (no memorices el resto aún). Una **secuencia** (list/tuple) ordena filas y ventanas. Un **dict** indexa por id en tiempo casi constante. Un **set** responde "¿está en la cohorte?" y alimenta deduplicación. El resto de la sección enseña a **combinar** esas piezas en un mini almacén en RAM con datos sintéticos LATAM.",
+        "**Antes de T1, tres ideas base** (no memorices el resto aún). Una **secuencia** (`list`/`tuple`) ordena filas y ventanas. Un **dict** indexa por id en tiempo casi constante. Un **set** responde "¿está en la cohorte?", y alimenta la deduplicación. El resto de la sección enseña a **combinar** esas piezas en un mini almacén en RAM con datos sintéticos LATAM.",
```

### Diff 9 — Normalize ASCII `"…"` → curly `"…"` (issue #5)

There are 4 ASCII `"…"` instances in the section (vs. ~12 curly `"…"`). For consistency, normalize all ASCII to curly:

```diff
--- a/src/lib/course/sections/s06-numpy.ts
+++ b/src/lib/course/sections/s06-numpy.ts
@@ -173,7 +173,7 @@
-        "Deduplicar **no es borrar a ciegas** cuando hay conflicto de negocio: dos filas con mismo `id` pero payload distinto deben **reportarse** en `conflicts`, no silenciarse. El patrón de calidad es `unique` + `conflicts`. **Política:** si el payload es **idéntico**, es un duplicado inocente (no entra a `conflicts`); si **difiere**, deja traza del choque. "El último gana" sin traza es un anti-patrón de calidad de datos.",
+        "Deduplicar **no es borrar a ciegas** cuando hay conflicto de negocio: dos filas con mismo `id`, pero payload distinto, deben **reportarse** en `conflicts`, no silenciarse. El patrón de calidad es `unique` + `conflicts`. **Política:** si el payload es **idéntico**, es un duplicado inocente (no entra a `conflicts`); si **difiere**, deja traza del choque. "El último gana" sin traza es un anti-patrón de calidad de datos.",
@@ -176,7 +176,7 @@
-        "Para exports **deterministas**, no dependas del orden del set: ordena con `sorted(...)` al exportar (JSON `sort_keys`, listas de ids ordenadas). Reproducibilidad > "orden de llegada mágico". El mismo lote sintético debe producir el mismo reporte en cada corrida del demo.",
+        "Para exports **deterministas**, no dependas del orden del set: ordena con `sorted(...)` al exportar (JSON `sort_keys`, listas de ids ordenadas). Reproducibilidad > "orden de llegada mágico". El mismo lote sintético debe producir el mismo reporte en cada corrida del demo.",
```

### Diff 10 — Split long `jobRelevance` (issue #3, 43 words)

```diff
--- a/src/lib/course/sections/s06-numpy.ts
+++ b/src/lib/course/sections/s06-numpy.ts
@@ -12,7 +12,11 @@
   jobRelevance:
-    "En pipelines de onboarding y calidad de datos en bancos, fintech y retail en Perú, antes de CSV/JSON necesitas un **modelo tabular en memoria**: clientes, contactos y transacciones como list/dict/set bien elegidos, con deduplicación que **reporta conflictos** y salidas **deterministas**. Aquí inicias el bloque de portafolio **CP-N1-B** (modelo en RAM) usando solo la biblioteca estándar — sin NumPy ni pandas. Si ya dominas listas y funciones de S04–S05, esta sección te enseña a **componerlas** como almacén confiable, no solo como ejercicios sueltos.",
+    "En pipelines de onboarding y calidad de datos en bancos, fintech y retail en Perú, antes de CSV/JSON necesitas un **modelo tabular en memoria**. Clientes, contactos y transacciones se modelan como `list`/`dict`/`set` bien elegidos, con deduplicación que **reporta conflictos** y salidas **deterministas**.\n\nAquí inicias el bloque de portafolio **CP-N1-B** (modelo en RAM) usando solo la biblioteca estándar — sin NumPy ni pandas. Si ya dominas listas y funciones de S04–S05, esta sección te enseña a **componerlas** como almacén confiable, no solo como ejercicios sueltos.",
```

### Diff 11 — Code-format bare structure names in T1-A (issue from §6.2)

```diff
--- a/src/lib/course/sections/s06-numpy.ts
+++ b/src/lib/course/sections/s06-numpy.ts
@@ -43,7 +43,7 @@
       paragraphs: [
-        "Una **list** es mutable y ordenada: ideal para filas que crecen (`append`, `extend`) — la cola de llegada de un lote de onboarding sintético. Una **tuple** es inmutable: ideal para **claves estables**, headers fijos o "contratos" de columnas que no deben mutarse por accidente cuando varios helpers comparten el mismo esquema.",
+        "Una `list` es mutable y ordenada: ideal para filas que crecen (`append`, `extend`) — la cola de llegada de un lote de onboarding sintético. Una `tuple` es inmutable: ideal para **claves estables**, headers fijos o "contratos" de columnas que no deben mutarse por accidente cuando varios helpers comparten el mismo esquema.",
```

### Diff 12 — Code-format bare `dict`/`set`/`tuple` throughout theory (issues from §6.4, §6.5, §6.6, §6.9)

Apply this pattern to all bare occurrences of `list`, `dict`, `set`, `tuple` in `theory.paragraphs`. ~15 instances total. (Specific line diffs omitted for brevity — the pattern is `dict` → `` `dict` ``.)

### Diff 13 — Fix `youDo.objectives[3]` infinitive consistency

```diff
--- a/src/lib/course/sections/s06-numpy.ts
+++ b/src/lib/course/sections/s06-numpy.ts
@@ -1670,7 +1670,7 @@
     objectives: [
       "Representar cliente/contacto/tx en list[dict] documentado",
       "Implementar dedup_report → unique + conflicts",
       "Aplanar transacciones con client_id",
-      "Acceso seguro a faltantes (get_nested)",
+      "Acceder de forma segura a faltantes (get_nested)",
       "Export determinista (sorted + sort_keys)",
     ],
```

### Diff 14 — Rewrite `youDo.context` (issue #19)

```diff
--- a/src/lib/course/sections/s06-numpy.ts
+++ b/src/lib/course/sections/s06-numpy.ts
@@ -1666,7 +1666,7 @@
   youDo: {
     title: "Modelo tabular en memoria (CP-N1-B)",
     context:
-      "Inicias el capstone **CP-N1-B**. Representas clientes, contactos y transacciones en estructuras Python puras (sin NumPy/pandas). Deduplicas por clave de negocio **reportando conflictos**, aplanas txs y exportas JSON determinista. En S07–S08 se suma normalización LATAM e ingesta por archivos. Solo datos sintéticos.",
+      "Inicias el capstone **CP-N1-B**: representas clientes, contactos y transacciones en estructuras Python puras (sin NumPy/pandas). La deduplicación por clave de negocio **reporta conflictos**; aplanas las txs y exportas un JSON determinista. En S07–S08 se suma normalización LATAM e ingesta por archivos. Solo datos sintéticos.",
```

### Diff 15 — Add terminal periods to `weDo.feedback` strings (issue #8)

Apply to the ~10 `feedback` strings that lack terminal periods. Examples:

```diff
--- a/src/lib/course/sections/s06-numpy.ts
+++ b/src/lib/course/sections/s06-numpy.ts
@@ -732,7 +732,7 @@
-        feedback: "Tuple = contrato de columnas que no se muta por accidente.",
+        feedback: "Tuple = contrato de columnas que no se muta por accidente.",  // already has period — skip
@@ -772,7 +772,7 @@
-        edgeCases: ["diagnóstico AttributeError"],
-        tests: "AttributeError + lista mutada",
-        feedback: "Si necesitas mutar, trabaja con list; guarda tuple solo como snapshot/contrato.",
+        feedback: "Si necesitas mutar, trabaja con `list`; guarda `tuple` solo como snapshot/contrato.",
@@ -808,7 +808,7 @@
-        feedback: "Unpack documenta el shape esperado de la fila.",
+        // already has period — skip
@@ -849,7 +849,7 @@
-        feedback: "copy() corta el alias de la lista contenedora.",
+        // already has period — skip
```

(Full list of feedback strings needing terminal `.`: lines 689 [has period, skip], 734 [no period — add], 774 [no period — add], 815 [has period, skip], 849 [has period, skip], 889 [no period — add], 935 [no period — add], 971 [no period — add], 1011 [no period — add], 1053 [no period — add], 1085 [no period — add], 1119 [no period — add], 1181 [no period — add], 1219 [no period — add], 1263 [no period — add], 1309 [no period — add], 1355 [no period — add], 1405 [no period — add], 1441 [no period — add], 1473 [no period — add], 1515 [has period, skip], 1557 [no period — add], 1599 [no period — add], 1633 [no period — add].)

### Diff 16 — Hide `weDo.tests` from learner UI (issue #13, optional)

```diff
--- a/src/components/course/SectionView.tsx
+++ b/src/components/course/SectionView.tsx
@@ -574,7 +574,7 @@
-                      {step.tests && (
-                        <div className="text-xs text-muted-foreground">
-                          <strong>Tests:</strong> {step.tests}
-                        </div>
-                      )}
+                      {/* tests field hidden from learner UI; kept as developer-facing source */}
```

---

## 8. Recommended Priority Order for Fixing

| Priority | Issue | Severity | Effort | Why first |
|---|---|---|---|---|
| **P0** | #1 (`id: "numpy"` → `id: "colecciones"` + editor placeholder) | H | 30 min | Single fix removes the most damaging self-contradiction in the section. Affects every learner on every visit. |
| **P0** | #2 (route raw fields through `<RichText>`) | H | 2 h | Removes literal `**` asterisks from 4 of 5 tabs. Affects every section in the course (S06 is the canary). |
| **P1** | Diff 3 (`practicques` → `practiques`) | M | 1 min | Spelling error in `iDo.intro` shown to every learner on the I Do tab. |
| **P1** | Diff 5 (`, pero` × 2) | M | 2 min | Spanish grammar rule; LT-flagged. |
| **P1** | Diff 8 (`?"` capitalization/comma in T0) | M | 2 min | Spanish grammar rule; LT-flagged. |
| **P1** | Diff 6 (`por id` → `por ID` × 3) | M | 3 min | Consistency + LT-flagged. |
| **P2** | Diff 10 (split 43-word `jobRelevance`) | M | 5 min | Cognitive load on the section header blurb. |
| **P2** | Diff 4 (`c/u` → `cada uno`) | L | 1 min | Formal Spanish register. |
| **P2** | Diff 7 (`vs` → `vs.` × 5) | L | 3 min | Spanish typography. |
| **P2** | Diff 9 (ASCII → curly quotes) | L | 5 min | Consistency. |
| **P2** | Diff 11 + 12 (code-format bare structure names) | L | 15 min | Consistency of inline-code formatting. |
| **P3** | Diff 13 (`Acceso` → `Acceder`) | L | 1 min | Infinitive consistency in objectives. |
| **P3** | Diff 14 (rewrite `youDo.context`) | L | 3 min | Anaphoric monotony. |
| **P3** | Diff 15 (terminal periods in `feedback`) | L | 10 min | Consistency. |
| **P3** | Diff 16 (hide `tests` from UI) | L | 5 min | Reduces learner UI clutter. |

**Total estimated effort:** ~4 h for P0+P1 (the must-fix); ~1 h more for P2; ~30 min for P3.

---

## 9. Graph Memory Update Notes (for shared context files)

For the orchestrator's shared context:

- **S06 file/name/id mismatch is systemic.** The course has multiple sections where `id`, file name, and title disagree. S06 (`s06-numpy.ts`, `id: "numpy"`, title "Colecciones…") is the worst-case example because the `id` collision causes an editor placeholder to load `import numpy as np` in a NumPy-forbidden section. S14 mirrors the issue (`s14-security.ts`, `id: "security"`, title "NumPy y cómputo vectorizado"). **Recommend a course-wide audit of `id` vs file-name vs title alignment**, not just S06.
- **`SectionView.tsx` raw-rendering bug is course-wide.** Lines 189, 401, 491, 571, 614, 649 render fields as raw JSX children. Any section that uses `**markdown**` in `jobRelevance`, `callout.content`, `step.instruction`, `step.feedback`, `project.context`, or `project.portfolioNote` will leak literal asterisks. S06 has 12+ instances. Other sections likely have similar leaks. **Recommend a course-wide fix to `<RichText>`-wrap these fields.**
- **The `demos[sectionId]` lookup in `InteractivePlaygroundDemo`** (SectionView.tsx:4046) is fragile. If `section.id` doesn't have a matching key in `demos`, the playground silently disappears (`if (!demo) return null`). This is good defensively, but means a section with a typo'd or renamed `id` loses its interactive editor without any visible error. **Recommend a unit test or runtime warning** that asserts every section in `COURSE_SECTIONS` has a matching `demos` key.
- **S06 sets a strong pedagogical baseline.** 8 subtopics × (theory + I Do + 3 We Do) = 32 activities, all with consistent `subtopicId` tags (`S06-T{1-4}-{A,B}`). The cross-references (S03, S04, S05, S07, S08, S14) are accurate. The "hilo conductor" (CP-N1-B mini-almacén) is consistently threaded. **Other sections should be benchmarked against S06's I Do / We Do / You Do fidelity.**
- **FH readability for S06 is 82.3 ("fácil").** This is appropriate for an "Intermedio" section. Average WPS = 9.92 (short, punchy sentences). Only 4 sentences exceed 32 words. **Use S06 as the readability reference for mid-course sections.**

---

## 10. Method Note (Grammar / Style / Structure Audit)

Per the `_GRAMMAR_SUBPLAN.md`, the following research-backed methods were applied to every paragraph and sentence of S06's learner-facing Spanish prose:

### A. Readability formulas (computed per sentence and per paragraph)
- **Fernández-Huerta (1959):** `206.84 − 60·(syls/words) − 1.02·(words/sentences)` — Spanish Flesch adaptation.
- **Szigriszt-Pazos / INFLESZ:** `206.835 − 62.3·(syls/words) − (words/sentences)`.
- **Words per sentence (WPS)** and **syllables per word (SPW)** tracked as structural-load proxies.

### B. Spanish syllable counter (heuristic)
- Strip punctuation; replace `h` (silent), normalize `qu` / `gu+e/i` / `gü+e/i`; count vowel groups as syllable nuclei; treat final `y` as vowel.

### C. Pedagogical heuristics (15 rules from the subplan)
- Run-on >45 words (H), long >32 words (M), missing terminal punctuation (M), missing `¿`/`¡` (L), unbalanced delimiters (M), repeated word (M), English-dominant sentence (M), meta/AI/TODO leak (H), gerund pile-up ≥3 (L), high comma density (L), one-sentence paragraph (M), anaphoric monotony (L), space-before-punct (L), double space (L), markdown leak (M).

### D. LanguageTool `es` (rule-based grammar/style engine)
- One batched POST to `https://api.languagetool.org/v2/check` with all 12,731 characters of S06 prose (well under the 20k char free-API limit).
- 298 matches returned; 274 are `MORFOLOGIK_RULE_ES` (spelling) — 100 % false positives on Python/tech terms (`dict`, `list`, `tuple`, `sorted`, `txs`, `ids`, `lookup`, `KeyError`, `append`, `set`, `keys`, `get`, `sort`, `missing`, `unique`, `None`, `AttributeError`, `conflict`, `shape`, `deepcopy`, `payload`, `hashables`, `json`, `PII`, `contacts`, `exports`, `len`, etc.). This is the known false-positive class documented in the subplan.
- 24 non-MORFOLOGIK matches: 5 `PUNTO_EN_ABREVIATURAS` (`vs` → `vs.`), 4 `UPPERCASE_SENTENCE_START` (false positives — sentence splitter artifact at `?` boundaries), 3 `AGREEMENT_POSTPONED_ADJ` (false positives on tech-bare adjectives), 3 `PREP_VERB` (`por id` interpreted as `por` + verb), 2 `D_ELA` (false positives on `vs n`), 2 `APOSTROFO_ACENTO` (false positives on bare `list`/`dict`), 2 `COMMA_PERO` (**real** — missing comma before `pero`), 1 `COMMA_PARENTHESIS_WHITESPACE` (false positive on Python tuple syntax), 1 `ESPACIO_DESPUES_DE_PUNTO` (false positive on `. Si`), 1 `CAPITALIZATION_AFTER_QUESTION_MARK` (**real** — `?"` continuation without comma/capital).
- **Net real LT findings: 8** (5 `vs.`, 2 `, pero`, 1 `?"` continuation). All addressed in §6 and §7.

### E. Section-level metrics
| Metric | Value | Interpretation |
|---|---|---|
| Records (prose fields) | 158 | |
| Sentences | 205 | |
| Words | 2,034 | |
| Syllables | 3,879 | |
| WPS (avg) | 9.92 | Healthy for technical ES (target 15–32) — section trends short. |
| SPW (avg) | 1.907 | Low complexity (1.5–2.1 is healthy). |
| FH (section) | 82.3 | "Fácil" — appropriate for "Intermedio" level. |
| INFLESZ (section) | 78.1 | "Bastante fácil" — matches FH. |
| Heuristic findings (H/M/L) | 3 / 83 / 15 | 3 H = 3 `meta_leak` false positives (cross-section refs). 83 M = mostly `missing_terminal` on intentional labels (false positives). 15 L = mostly `high_comma_density` on titles/labels. |
| Real LT findings | 8 | 5 `vs.`, 2 `, pero`, 1 `?"` continuation. |

### F. Known false-positive classes (documented per subplan)
- `MORFOLOGIK_RULE_ES` on bare Python/tech terms (~100 % FP rate for this section).
- `meta_leak` heuristic on `S0\d–S0\d` cross-references (intentional pedagogical).
- `missing_terminal` on `edgeCases`, `tests`, `learningOutcomes.text`, `weDo.feedback` (intentional labels).
- `unbalanced_paren` from sentence splitter breaking at `p. ej.` (splitter artifact, not a real paren imbalance).
- `PREP_VERB` on `por id` (LT misparses `id` as verb).
- `AGREEMENT_POSTPONED_ADJ` on `list/dict/set bien elegidos` and `tags anidados` (LT misparses bare tech terms).

### G. Validation
- Prose extraction: 158 records across 23 distinct field types (matches expected count for an 8-subtopic section with 24 We Do exercises, 9 quiz questions, 6 docs, 2 books, 4 courses). ✅
- FH in plausible range (82.3, "fácil") — consistent with a course section targeting "Intermedio" learners. ✅
- LT call succeeded; 298 matches returned; matches filtered to 8 real findings. ✅

---

## 11. Conclusion

S06 is a **pedagogically excellent** section undermined by a single **critical meta-leak** (the `id: "numpy"` field mislabeling causes NumPy editor code to render in a NumPy-forbidden section) and a **course-wide redaction defect** (raw-rendered fields leak `**markdown**` asterisks). The Spanish prose itself is grammatically clean (only 8 real LT findings, all minor), the I Do / We Do / You Do fidelity is exemplary (8×4 = 32 activities, all with consistent `subtopicId` tags), the cross-references are accurate, and the cognitive load is well-managed (FH = 82 "fácil").

**Recommended first action:** Apply Diff 1 (change `id: "numpy"` → `id: "colecciones"` and add a `colecciones` key to the editor placeholder map). This single 30-minute fix removes the most damaging self-contradiction.

**Recommended second action:** Apply Diff 2 (route raw fields through `<RichText>`). This is a course-wide fix that benefits every section, not just S06.

After P0+P1 fixes, S06 should score **9.0 / 10**. The remaining P2/P3 polish items are nice-to-have but not blocking.

---

**This is the complete Explorer report for Section 6. Ready for the Fixer prompt.**
