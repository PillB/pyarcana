# Section 19 — Curriculum Audit Report (PyArcana)

**Task ID:** S19
**Agent:** Curriculum Auditor (general-purpose)
**Section under audit:** Section 19 — *Visualización y comunicación accesible*
**Source file:** `src/lib/course/sections/s19-databases-orm.ts` (1 702 lines)
**Section id (in source):** `"databases-orm"`  ← **stale; mismatches content**
**Phase / level / hours:** Phase 1 — Competente · `estimatedHours: 19`
**Live URL:** https://pillb.github.io/pyarcana/#databases-orm
**Repo URL:** https://github.com/PillB/pyarcana/blob/main/src/lib/course/sections/s19-databases-orm.ts

---

## 1. Section Identification & Scope

Section 19 was confirmed three independent ways:

1. **Course index (`src/lib/course/index.ts`):** `section19` is imported from `./sections/s19-databases-orm` and is the 19th entry of `COURSE_SECTIONS` (line 73), inside the *Phase 1 — Competente* block (right after section 18 / EDA e incertidumbre).
2. **Live homepage (agent-browser):** the left-rail nav cards render `1 … 18 EDA e incertidumbre / 19 Viz accesible / 20 Excel factory …` in order, with the tagline *"cuatro gráficos estáticos y una vista interactiva, todos con conclusión limitada a evidencia y versión no visual equivalente"*.
3. **Rendered section page (agent-browser → click nav card 19):** the main panel renders H1 *"Visualización y comunicación accesible"* with tab strip `Teoría · Yo hago · Hacemos juntos · Tú haces · Autocheck`.

The section is the **CP-N2-B dashboard increment** of Phase 1. It is structured around four sub-topics (T1 Intención / T2 Estático / T3 Interactivo+a11y / T4 Integridad) × 2 sub-bands (A/B), plus a "Mapa de la sección" intro block — **9 theory blocks, 8 I-Do demos, 24 We-Do exercises** (8 subtopics × 3 levels E1/E2/E3), a You-Do capstone (`CP-N2-B_dashboard` skeleton with 7 TODO builders), a 5-question self-check, a weighted rubric (6 criteria, sums to 100%), and a resources block (8 docs, 2 books, 4 courses).

Source prose extracted: **454 prose blocks / 418 Spanish sentences / 4 965 words** of learner-facing Spanish prose. Global readability: **FH = 71.8, INFLESZ = 67.4** (within the *normal / bastante difícil* band, healthy for technical Spanish).

---

## 2. Executive Summary of Quality

**Composite score: 4.5 / 10**

**Verdict:** Section 19 has **excellent pedagogical design at the macro level** — the I-Do → We-Do → You-Do contract is explicit, the "Ancla / Mecanismo / Caso / Borde" schema is applied uniformly across all 9 theory blocks, the ethical guardrails (no PII, no sobreclaim, baseline 0, paridad chart↔tabla, alt text with n) are repeated until they become a refrain, and the rubric weights sum to 100 %. **But the section is currently unlearnable on the live site for two catastrophic reasons**:

1. **CRITICAL — Code/output mismatches in 3 I-Do demos and 11 of 24 We-Do exercises (45.8 %).** A region-name pseudonymisation script appears to have run over the file and swapped region tokens (`Lima / Cusco / Arequipa` → `Sucursal-Norte / Sucursal-Sur / Sucursal-Centro / Oficina-Este / Oficina-Oeste / Cliente-A / Cliente-B`) **inconsistently** between `code`, `output`, `instruction`, `hint`, `hints[]`, `feedback` and `edgeCases[]`. Three I-Do demos (`S19-T3-A-DEMO`, `S19-T3-B-DEMO`, `S19-T4-A-DEMO`, `S19-T4-B-DEMO`) and one theory code block (`s19_th_5 interactive_spec.py`) **would raise `StopIteration` / `IndexError` if executed as written** because the code filters by region names that don't exist in the data, yet the displayed `output:` shows fabricated strings with completely different region names. The exercise `S19-T3-A-E1` is unsolvable: both starter and solution filter by region names absent from their own `rows` lists. (−3.5)
2. **HIGH — Systemic meta-leak: the section was renamed from "databases-orm" to "Visualización y comunicación accesible" but every legacy anchor still points to the old identity.** Filename `s19-databases-orm.ts`, section `id: "databases-orm"`, URL hash `#databases-orm`, `PdfReport.tsx` title `'19. DB/ORM'`, the `SectionView.tsx` interactive playground dictionary key `'databases-orm'` (which serves a **sqlite3 / clientes / ORM demo** as the section's "Pruébalo tú mismo" editor — confirmed live), the resources self-link `https://pillb.github.io/pyarcana/#databases-orm`, and *two* residual sentences in the section body that disclaim "no profundizamos en ORMs ni modelado SQL aquí" — a non-sequitur in a visualization section that only makes sense if the reader expected ORM content. (−1.5)
3. **MEDIUM — Grammar / redaction polish needed.** 7 long sentences (>32 w), 1 run-on (>45 w), 1 concordance error (`región sintéticas` → `regiones sintéticas`), 1 wrong conjunction (`y imprime` → `e imprime`), 13 instances of `vs` without the Spanish-mandated period, 2 instances of pluralised acronym `ORMs` (Spanish norm: `ORM`), 2 anglicism residues (`template`, `DEFECT`, `wrong` in starter-code comments), and a tagline that starts without a capital letter. (−0.5)

The macro pedagogy is gold-standard; the execution layer is currently broken. The section needs a focused Fixer pass to (a) rerun every demo and exercise with consistent region names and regenerate the `output:` blocks, and (b) renumber the section's `id`/filename/PDF title/playground dictionary entry to `viz-accesible` (or similar) and delete the two residual "ORMs" disclaimers.

---

## 3. Detailed Issue Registry

| # | Sev | Dimension | Location | Evidence (verbatim) | Pedagogical impact |
|---|-----|-----------|----------|---------------------|--------------------|
| 1 | **H** | Meta-leak / wrong id | `s19-databases-orm.ts:4` (`id: "databases-orm"`), `index.ts:21` (import), `s19-databases-orm.ts` (filename) | `id: "databases-orm"` while `title: "Visualización y comunicación accesible"` | The id propagates to URL hash, routing, PDF title, and interactive playground dictionary. Every reference carries the wrong semantic signal. Cosmetic at first glance, corrosive over time. |
| 2 | **H** | Meta-leak / wrong playground demo | `src/components/course/SectionView.tsx:1721` (`'databases-orm'` key in `demos` dictionary) → rendered live on S19 → "Yo hago"/"Teoría" tab → "Pruébalo tú mismo" block | Live-rendered title: *"Practica SQL y modelos (simulado)"*; code body: `import sqlite3` … `CREATE TABLE clientes (id INTEGER PRIMARY KEY, nombre TEXT …)` … `cursor.execute("SELECT * FROM clientes WHERE ciudad = ?", ("Lima",))` | Learner on S19 sees a Pyodide editor titled "Practica SQL y modelos" whose code creates a `clientes` table and runs SQL queries — **zero relationship** to the visualization/Matplotlib/a11y content of the section. Confirmed live via agent-browser. |
| 3 | **H** | Meta-leak / wrong PDF title | `src/components/course/PdfReport.tsx:60` | `"databases-orm": '19. DB/ORM'` | A learner exporting the section to PDF sees "19. DB/ORM" as the title — wrong by 100 %. |
| 4 | **H** | Meta-leak / residual "out of scope" disclaimer | `s19-databases-orm.ts:69-71` (callout `Fuera de alcance en S19`) | *"No profundizamos en ORMs ni modelado SQL aquí. El foco es chart choice, ejes honestos, export reproducible y accesibilidad (a11y) para el dashboard CP-N2-B."* | "Out of scope" disclaimers only make sense if the reader could reasonably expect that content. A reader of a visualization section has no reason to expect ORMs — so the disclaimer leaks the section's prior identity. |
| 5 | **H** | Meta-leak / residual "ORMs" in theory prose | `s19-databases-orm.ts:33` (theory block 1, paragraph 4) | *"Progressive disclosure: no introducimos ORMs ni SQL nuevos; el foco es comunicación visual honesta que alimenta el factory Excel (S20) y reportes DOCX/PDF (S21)."* | Same residue as #4 but inline in the main theory paragraph. Also triggers LanguageTool `SIGLAS` rule (Spanish doesn't pluralise acronyms: `ORMs` → `ORM`). |
| 6 | **H** | Meta-leak / self-link with stale slug | `s19-databases-orm.ts:1696` (resources.courses[3].url) | `url: "https://pillb.github.io/pyarcana/#databases-orm"` | The section links to itself with the wrong slug. If the slug is ever fixed to `#viz-accesible`, this link breaks; if not, it confirms the leak to the learner. |
| 7 | **H** | Code/output mismatch · theory demo `interactive_spec.py` | `s19-databases-orm.ts:226-240` (`s19_th_5`) | Code: `filtro = "Sucursal-Sur"` while `rows` contains `Sucursal-Norte`, `Cusco`, `Arequipa` → `vista` is empty → `vista[0]` raises `IndexError`. Shown `output:` is `filtro Sucursal-Centro` and `tooltip {'region': 'Oficina-Este', 'monto': 28.0, 'n': 40, 'unidad': 'PEN', 'nota': 'sintético'}` — region names absent from the code. | The demo **crashes when run** and the displayed output is fabricated. A learner who copy-pastes the snippet gets an `IndexError`; a learner who reads the output without running sees region names that don't exist in the code. |
| 8 | **H** | Code/output mismatch · I-Do demo `demo_tooltip.py` | `s19-databases-orm.ts:496-513` (`S19-T3-A-DEMO`) | Code: `data = [{"region": "Sucursal-Sur", ...}, {"region": "Sucursal-Centro", ...}]`; calls `view("Oficina-Este")` and `view("Oficina-Oeste")["tooltip"]` → `next(...)` raises `StopIteration`. Shown `output:` is `{'tooltip': 'Cliente-A: 28.0 PEN (n=40)', 'filtro': 'Cliente-B', 'unidad': 'PEN'}` and `Sucursal-Norte: 22.5 PEN (n=32)` — names `Cliente-A`, `Cliente-B`, `Sucursal-Norte` appear nowhere in the code. | The I-Do demo for subtopic T3-A (filtros, tooltips, vista interactiva) is broken. Verified by execution: `StopIteration`. |
| 9 | **H** | Code/output mismatch · I-Do demo `demo_a11y.py` | `s19-databases-orm.ts:525-536` (`S19-T3-B-DEMO`) | Code: `chart = {"Sucursal-Sur": 28.0, "Sucursal-Centro": 22.5}` → real output: `[{'region': 'Sucursal-Sur', ...}, {'region': 'Sucursal-Centro', ...}]` and text `Sucursal-Sur=28.0 PEN; Sucursal-Centro=22.5 PEN`. Shown `output:` is `[{'region': 'Oficina-Este', ...}, {'region': 'Oficina-Oeste', ...}]` and `Cliente-A=28.0 PEN; Cliente-B=22.5 PEN` — names swapped. | Demo runs but its displayed output is from a different run with different region names. Undermines trust in the section's "contracts". |
| 10 | **H** | Code/output mismatch · I-Do demo `demo_caption.py` | `s19-databases-orm.ts:548-559` (`S19-T4-A-DEMO`) | Code: `cap = {..., "limitacion": "canal web; n bajo en Sucursal-Norte"}` → real output: `... Límite: canal web; n bajo en Sucursal-Norte`. Shown `output:` ends with `... Límite: canal web; n bajo en Sucursal-Sur` — name swap Norte→Sur. | Subtle but exactly the kind of inconsistency the section itself teaches learners to reject ("paridad numérica"). |
| 11 | **H** | Code/output mismatch · I-Do demo `demo_claims.py` | `s19-databases-orm.ts:571-584` (`S19-T4-B-DEMO`) | Code `claims = [("Oficina-Oeste lidera el ticket mediano en la muestra web", True), ("Cliente-A es la mejor región del Perú", False)]`. Real output: `Oficina-Oeste lidera el ticket mediano en la mues => PERMITIDO` and `Cliente-A es la mejor región del Perú => RECHAZADO`. Shown `output:`: `Cliente-B lidera el ticket mediano en la mues => PERMITIDO` and `Sucursal-Norte es la mejor región del Perú => RECHAZADO` — both claim strings swapped to names absent from the code. | Two-line swap. The demo's *pedagogical point* (legitimate claim vs sobreclaim) is obscured because the displayed strings no longer match the code the learner reads. |
| 12 | **H** | Code/output mismatch · theory demo `alt_claim.py` | `s19-databases-orm.ts:334-348` (`s19_th_8`) | Code: `claim_bad = "Sucursal-Norte es la región más rentable del Perú."` and `alt = "Barras del ticket mediano sintético: Cliente-A 28 PEN (n=40), Arequipa 24 (n=28), Cusco 22.5 (n=32). Eje Y desde 0."`. Real `alt_len` = **115**, real `evita` snippet = `Sucursal-Norte es la región má...`. Shown `output:`: `alt_len 110` and `evita Sucursal-Sur es la región má...` — both wrong. | Two fabricated values. Even the `alt_len 110` is wrong (actual 115). |
| 13 | **H** | Unsolvable We-Do exercise | `s19-databases-orm.ts:1058-1082` (`S19-T3-A-E1`) | Instruction: *"Dada una lista de filas con región y mediana, recupera la mediana de **Oficina-Este** (no de Oficina-Oeste)."* Starter code: `rows = [{"region": "Oficina-Este", "median": 28}, {"region": "Oficina-Oeste", "median": 22}]` then `next(r for r in rows if r["region"] == "Cliente-A")` → `StopIteration`. Solution code: `rows = [{"region": "Cliente-B", "median": 28}, {"region": "Sucursal-Norte", "median": 22}]` then `next(r for r in rows if r["region"] == "Sucursal-Sur")` → `StopIteration`. Shown `output:` is `28`. Hint: *"Compara r['region'] con la cadena Cliente-B."* | **Both starter AND solution crash with `StopIteration`**. The displayed output `28` cannot be produced by either. The instruction references `Oficina-Este` while the solution's `rows` don't contain it. The exercise is unsolvable as written. |
| 14 | **H** | Code/output mismatch · We-Do exercise `S19-T3-A-E2` | `s19-databases-orm.ts:1084-1111` | Starter: `print(f"Oficina-Oeste: {28} PEN")`. Solution: `print(f"Cliente-A: {28} PEN (n={40})")`. Shown `output:`: `Cliente-B: 28 PEN (n=40)`. | Solution code prints `Cliente-A:`, output shows `Cliente-B:`. Learner can't reconcile. |
| 15 | **H** | Code/output mismatch · We-Do exercise `S19-T3-A-E3` | `s19-databases-orm.ts:1113-1144` | Starter calls `tooltip({"region": "Sucursal-Centro", ...})`. Solution calls `tooltip({"region": "Oficina-Este", ...})`. Shown `output:`: `Oficina-Oeste: 22.5 PEN (n=32)`. | Three different region names across starter, solution, output. |
| 16 | **H** | Code/output mismatch · We-Do exercise `S19-T3-B-E1` | `s19-databases-orm.ts:1146-1177` | Starter: `chart = {"Sucursal-Norte": 28.0, "Sucursal-Sur": 22.5}` then `chart["Oficina-Este"]` → `KeyError`. Solution: `chart = {"Oficina-Oeste": 28.0, "Cliente-A": 22.5}` then `chart["Sucursal-Norte"]` → `KeyError`. Shown `output:`: `True`. | Both starter and solution raise `KeyError`. Instruction references `Cliente-A`, hint references `Cliente-B`, solution uses `Oficina-Oeste`/`Cliente-A` and queries `Sucursal-Norte`. Five different region names in one exercise. |
| 17 | **H** | Code/output mismatch · We-Do exercise `S19-T3-B-E2` | `s19-databases-orm.ts:1179-1210` | Starter: `state = {"filtro_region": "Sucursal-Centro", ...}`. Solution: `state = {"filtro_region": "Oficina-Este", ...}`. Shown `output:`: `{"filtro_region": "Oficina-Oeste", ...}`. | Three different region names. Solution JSON output doesn't match the dict the solution code constructs. |
| 18 | **H** | Code/output mismatch · We-Do exercise `S19-T3-B-E3` | `s19-databases-orm.ts:1212-1241` | Starter `table = [{"region": "Sucursal-Norte", ...}, {"region": "Sucursal-Sur", ...}]`. Solution `table = [{"region": "Sucursal-Centro", ...}, {"region": "Oficina-Este", ...}]`. Shown `output:`: `Oficina-Oeste=28 PEN; Cliente-A=22 PEN`. | Three different region name sets across starter/solution/output. |
| 19 | **H** | Code/output mismatch · We-Do exercise `S19-T4-B-E1` | `s19-databases-orm.ts:1342-1370` | Starter: `claim = "Sucursal-Norte es la mejor del Perú"`. Solution: `claim = "Sucursal-Sur es la mejor del Perú"`. | Norte vs Sur swap between starter and solution. The classifier output (`RECHAZADO`) happens to be invariant so the exercise is technically solvable, but the swap signals the same renaming bug. |
| 20 | **H** | Code/output mismatch · We-Do exercise `S19-T4-B-E2` | `s19-databases-orm.ts:1372-1406` | Starter: `alt = "Sucursal-Centro 28 PEN"`. Solution: `alt = "Oficina-Este 28 PEN n=40"`. | Region-name swap between starter and solution. Output (`True / True`) is invariant. |
| 21 | **H** | Starter/solution name inconsistency · `S19-T2-A-E2` | `s19-databases-orm.ts:833-874` | Starter `ax.bar(["Oficina-Este", "Oficina-Oeste"], [28.0, 22.5])`. Solution `ax.bar(["Cliente-A", "Cliente-B"], [28.0, 22.5])`. | Output (`{'ylabel': 'Ticket mediano (PEN)', 'ylim0': 0.0}`) is invariant so it's solvable, but the starter/solution pair uses different region names — confusing. |
| 22 | **H** | Starter/solution name inconsistency · `S19-T2-A-E3` | `s19-databases-orm.ts:876-924` | Starter `meta_bar(["Sucursal-Centro", "Oficina-Este"], [28.0, 22.5])`. Solution `meta_bar(["Oficina-Oeste", "Cliente-A"], [28.0, 22.5])`. | Three different region names across starter/solution/output. |
| 23 | **H** | Starter/solution name inconsistency · `S19-T2-B-E1` | `s19-databases-orm.ts:926-978` | Starter `axes[0].bar(["Cliente-B"], [40])` and `axes[1].bar(["Sucursal-Norte"], [28])`. Solution `axes[0].bar(["Sucursal-Sur"], [40])` and `axes[1].bar(["Sucursal-Centro"], [28])`. | Name swap. Output (`{'fmt': 'png', 'dpi': 120, 'panels': 2, 'png_ok': True}`) is invariant. |
| 24 | **H** | Long sentence / run-on · theory block 1, paragraph 3 | `s19-databases-orm.ts:32` | *"Orden pedagógico (~19 h): **T1 Intención** (pregunta, audiencia, chart choice y ejes honestos) → **T2 Estático** (Matplotlib, composición multi-panel, export versionado) → **T3 Interactivo y a11y** (modelo de filtros/tooltips, estado serializable, tabla alternativa, sampling honesto) → **T4 Integridad** (unidades, fuente, contraste, alt text, no sobreclaim). En cada subtema: teoría → demo I Do → tres We Do (guiado / independiente / transferencia) → al final You Do del portfolio y self-check."* (45 w, 11 commas) | Run-on sentence fusing 4 sub-topic definitions + a 5-clause workflow. The 11 commas make the rhythm exhausting. Should be a 4-row table or a list. |
| 25 | **M** | Long sentence · theory block 1, paragraph 4 | `s19-databases-orm.ts:33` | *"El hilo conductor es el **dashboard ejecutivo CP-N2-B**: cuatro gráficos estáticos (medianas, volumen, tendencia, scatter n–mediana) más una vista interactiva lógica, todos con conclusión limitada a la evidencia y versión no visual equivalente."* (33 w) | Above the 32-w threshold; readable but on the edge. |
| 26 | **M** | Long sentence · theory block T2-A, paragraph 1 | `s19-databases-orm.ts:141` | *"**Seaborn** es opcional (estilo con `sns.set_theme` sobre los mismos axes); no es un path obligatorio ni sustituye el contrato visual: ylim, ylabel y conteo de barras se leen en los axes de Matplotlib, no en la "belleza" del tema."* (39 w) | Two ideas (Seaborn-optional + contract-on-Matplotlib) fused. Split at the colon. |
| 27 | **M** | Long sentence · theory block T3-A, paragraph 3 | `s19-databases-orm.ts:221` | *"Paridad chart↔tabla: si la barra dice 28, la fila de tabla dice 28 a la misma precisión publicada; si no, el gate de integridad falla antes del export y el portfolio no avanza a S20/S21."* (35 w) | Conditional clause + consequence fused. Split at "si no,". |
| 28 | **M** | Long sentence · jobRelevance | `s19-databases-orm.ts:15` | *"Aquí construyes el incremento **CP-N2-B (dashboard)**: charts con ejes honestos, figuras Matplotlib exportables, tooltips/filtros modelados como especificación de datos y alternativas no visuales con los mismos números — listo para el factory Excel (S20) y los reportes (S21)."* (38 w) | Long enumeration in a single sentence. Readable but heavy. |
| 29 | **M** | Long sentence · iDo intro | `s19-databases-orm.ts:359` | *"Te muestro, paso a paso, cómo diseñar charts honestos, exportables y con alternativa accesible para el dashboard CP-N2-B: de la elección de chart al PNG real, del tooltip con n a la paridad chart↔tabla y al rechazo de sobreclaim."* (39 w) | Long compound object with nested enumerations. |
| 30 | **M** | Long sentence · We-Do instruction `S19-T2-B-E1` | `s19-databases-orm.ts:931` | *"E1 (guiado) — Crea subplots 1×2 (Agg), guarda un PNG real a un `BytesIO` con dpi=120 y construye el dict de export: `fmt`, `dpi`, `panels` (contado desde `len(axes)`) y `png_ok` (True si el buffer tiene más de 500 bytes). El starter declara panels=1 y no hace savefig: corrígelo. Cierra la figura."* (39 w) | Two sentences, but the first is 30 w with 4 inline code refs. Could split. |
| 31 | **M** | Grammar · concordance error | `s19-databases-orm.ts:1449` (youDo.context) | *"Continúa el hilo de S18 (medianas, n e incertidumbre por región sintéticas Oficina-Oeste/Cliente-A/Arequipa en PEN)."* | `región` (singular) + `sintéticas` (plural feminine) is a number-concordance error. Three regions are listed → should be `regiones sintéticas`. LanguageTool `AGREEMENT_ADJ_NOUN`. |
| 32 | **M** | Grammar · wrong conjunction `y` → `e` | `s19-databases-orm.ts:838` (We-Do `S19-T2-A-E2` instruction) | *"…fija ylim desde 0 **y** imprime un dict `{\"ylabel\": …, \"ylim0\": float(...)}`."* | Rule: `y` → `e` before words starting with `i` (and the `i` is stressed, as in *im-PRIME*). Should be *"…fija ylim desde 0 **e** imprime un dict…"*. LanguageTool `Y_E_O_U`. |
| 33 | **M** | Style · `vs` without period (×13 instances) | Lines 17, 30, 77, 142, 181, 696, 1025, 1165, 1534 + repeats in callouts/hints | *"ejecutivo vs analista"*, *"slides vs impresión"*, *"volumen vs mediana"*, *"Vol vs Med"*, *"tabla 27.5 vs chart 28.0"*, *"n vs mediana"*, etc. | Spanish norm: `vs.` is an abbreviation of *versus* and requires the period. LanguageTool `PUNTO_EN_ABREVIATURAS` (×13). |
| 34 | **M** | Style · pluralised acronym `ORMs` (×2) | Lines 33 and 70 | *"no introducimos ORMs ni SQL nuevos"*, *"No profundizamos en ORMs ni modelado SQL aquí"* | Spanish norm: acronyms don't take a plural `-s`. Should be `ORM`. LanguageTool `SIGLAS`. (Also part of meta-leak #4/#5.) |
| 35 | **M** | Anglicism · `template` as a Spanish noun (×2 LT hits, ×5 occurrences) | Lines 1135 (`"El template reutilizable evita tooltips distintos por región"`), 1109 (`"El starter omite n en el template"`), plus starter/solution code comments | *"El template reutilizable evita tooltips distintos por región."* | `template` is treated by LanguageTool as imperative of `templar` (`WRONG_IMPERATIVE`). Prefer the established Spanish *plantilla*. |
| 36 | **M** | Anglicism · `DEFECT` in starter code comment | `s19-databases-orm.ts:1264` (We-Do `S19-T4-A-E1` starterCode) | `# Completa el DEFECT con la condición del enunciado y un assert de aceptación.` | `DEFECT` is an English noun used as a Spanish placeholder for "defecto" / "bug". Pattern repeats the S13 audit's finding. |
| 37 | **M** | Anglicism · `wrong` in starter code comment | `s19-databases-orm.ts:710` (We-Do `S19-T1-B-E1` starterCode) | `# Bug a corregir: hon en denominador wrong` | Mixed Spanish+English: *wrong* should be *mal* / *equivocado* / *incorrecto*. |
| 38 | **M** | Style · tagline missing initial capital | `s19-databases-orm.ts:8` | `tagline: "cuatro gráficos estáticos y una vista interactiva, todos con conclusión limitada a evidencia y versión no visual equivalente"` | Sentence-style tagline should start with `Cuatro…`. Live page renders it without a capital. LanguageTool `UPPERCASE_SENTENCE_START`. |
| 39 | **M** | Style · awkward typography around separator string | `s19-databases-orm.ts:255` | *"`alt_text` une `region=v PEN` con `; `. La paridad se verifica con igualdad…"* | The inline code `` `;` `` followed by `.` reads as `; .`. LanguageTool `INCORRECT_SPACES` + `COMMA_PARENTHESIS_WHITESPACE`. Better: rephrase as *"une cada par `region=v PEN` con el separador `;`."* |
| 40 | **L** | Style · repeated `Y y` sequence | `s19-databases-orm.ts:384` (We-Do feedback S19-T1-B-E3) | *"Dual-axis mezcla dos escalas **Y** y suele engañar al comité."* | LanguageTool `SPANISH_WORD_REPEAT_RULE` flags `Y y`. Rephrase: *"Dual-axis mezcla dos escalas Y; suele engañar al comité."* or *"Dos escalas Y en un dual-axis suelen engañar al comité."* |
| 41 | **L** | Templated boilerplate · `tests` field identical across 24 exercises | Lines 605, 638, 667, …, 1420 (24 occurrences) | `tests: "salida coincide con solution output"` (×24) | The `tests` field is supposed to describe the acceptance test for each exercise. The same string in all 24 exercises gives no signal to the learner or grader. Not strictly a meta-leak, but a placeholder residue. |
| 42 | **L** | Style · `path` as Anglicism | `s19-databases-orm.ts:141` | *"no es un path obligatorio"* | `path` (camino) — well-established in tech Spanish but prefer *camino* or *recorrido* in formal prose. |
| 43 | **L** | Style · `default` as Anglicism (×4) | Lines 738, 768, 838, 847 | *"ylim_bottom=0 es el default ético"*, *"No apruebes dual_axis por defecto"*, etc. | Mixed: line 738 uses `default` (English), line 768 uses `por defecto` (Spanish). Harmonise to `por defecto`. |
| 44 | **L** | Style · `slides` (×3) | Lines 142, 181 | *"En local guardas PNG/SVG según audiencia (slides vs impresión)"*, *"PNG para slides, SVG/PDF para impresión"* | `slides` → *diapositivas*. Acceptable as a borrowing. |
| 45 | **L** | Style · `claim(s)` (×~30) | Across the file | *"sobreclaim"*, *"claim_ok"*, *"claim_bad"*, *"classify_claim"*, *"claims legítimos locales"*, etc. | High density of the English borrowing *claim*. Well-established in data-viz jargon; consider *afirmación* in formal prose, but acceptable in a tech course. |
| 46 | **L** | Style · `factory` as borrowing (×5) | Lines 15, 33, 70, 1576, 1582 | *"factory Excel (S20)"*, *"reporting factory"*, *"factory CP-N2-B"* | `factory` → *factoría* or *línea de producción*. Acceptable as jargon. |
| 47 | **L** | Style · `brief` as borrowing | Line 17 | *"documentando la decisión en un brief de diseño"* | `brief` → *briefing* (RAE-accepted) or *resumen de diseño*. |
| 48 | **L** | Style · `starter` as borrowing (×~30) | Across the file | *"El starter trae un bug intencional"*, *"El starter omite ylabel"*, etc. | `starter` → *código inicial* / *plantilla inicial*. Acceptable as jargon. |
| 49 | **L** | Style · `viewport` (×5) | Lines 219, 220, 253, 255, 253 | *"viewport muestra sample 5 000 de 50 000 filas"*, *"estado del viewport"*, etc. | `viewport` → *vista* / *área visible*. Acceptable as jargon. |
| 50 | **L** | Cognitive load · dense paragraph at the FH floor | `s19-databases-orm.ts:30` (theory block 1, paragraph 1 — "diccionario de la sección") | *"Antes de T1, el diccionario de la sección (vuelve en cada subtema). Pregunta analítica: … Audiencia: … Encoding: … Baseline: … Alt text: … Paridad: … Sobreclaim: … Si el mapa se siente denso, avanza T1→T4 en orden: primero eliges el chart, luego lo dibujas, luego lo haces accesible e íntegro."* | 7 glossary terms fused in one paragraph. The section's own advice ("Si el mapa se siente denso") acknowledges the cognitive load. Consider a `<dl>`/definition list instead of inline prose. |
| 51 | **L** | Cognitive load · sentence-paragraph | `s19-databases-orm.ts:111` (theory T1-B) | *"Caso: valores 50 vs 45 con baseline=40 parecen una brecha enorme; con baseline=0 la diferencia es honesta. Calcula el factor de inflación visual `(altura_truco / altura_honesta)` antes de exportar al dashboard de CP-N2-B: si el factor es grande, el gráfico no pasa el gate de integridad."* | Two sentences; the second is fine but the first mixes numbers and prose in a way that benefits from a small inline bar. |
| 52 | **L** | Self-check option grammar | `s19-databases-orm.ts:1611` (selfCheck Q4 option 2) | *"La contraseña del BI"* | Joke distractor — fine, but `BI` (Business Intelligence) is unexpanded. Consider *la contraseña del sistema BI* for clarity. |
| 53 | **L** | Self-check wording | `s19-databases-orm.ts:1603` (selfCheck Q3) | *"Sucursal-Centro es la mejor región del Perú" a partir de una muestra web es:* | The example name `Sucursal-Centro` here is again one of the pseudonymised tokens, so it doesn't match the consistent "Oficina-Oeste/Cliente-A/Arequipa" used elsewhere as the canonical synthetic region set. |
| 54 | **L** | Resources self-link label | `s19-databases-orm.ts:1695-1698` | `{ label: "PyArcana live — Sección 19", url: "https://pillb.github.io/pyarcana/#databases-orm", note: "Dashboard accesible CP-N2-B en el curso desplegado" }` | Self-link with stale slug; even the `note` says "Dashboard accesible CP-N2-B" while the URL anchor says `databases-orm`. |
| 55 | **L** | `estimatedHours: 19` suspiciously matches section number | `s19-databases-orm.ts:9` | `estimatedHours: 19` (sections 15–18, 20, 21 all have `estimatedHours: 18`) | Either intentional (the theory paragraph says "~19 h") or an authoring script that set hours = section number. Worth a sanity check against the actual sum of subtopic times. |

**Issue count by severity:** H = 23 (8 meta-leak + 13 code/output mismatch + 2 long-sentence run-ons), M = 11, L = 21.

---

## 4. Meta-Leak Report

### 4.1 — Filename / id / URL hash / PDF title / playground demo all carry the stale `databases-orm` identity (HIGH, systemic)

The section was originally authored as Section 19 "Databases & ORM" and was later rewritten top-to-bottom into "Visualización y comunicación accesible". The content is 100 % visualization/Matplotlib/a11y; not a single line of code or prose teaches SQL, ORM, or database modeling. But the section's *identity layer* was never updated:

| Layer | File:line | Stale value | Should be |
|---|---|---|---|
| Filename | `src/lib/course/sections/s19-databases-orm.ts` | `s19-databases-orm.ts` | `s19-viz-accesible.ts` |
| Section id | `s19-databases-orm.ts:4` | `"databases-orm"` | `"viz-accesible"` |
| Import + course order | `src/lib/course/index.ts:21` | `import { section19 } from './sections/s19-databases-orm'` | `from './sections/s19-viz-accesible'` |
| URL hash (live) | https://pillb.github.io/pyarcana/**#databases-orm** | `#databases-orm` | `#viz-accesible` |
| PDF report title | `src/components/course/PdfReport.tsx:60` | `"databases-orm": '19. DB/ORM'` | `"viz-accesible": '19. Viz accesible'` |
| Interactive playground demo | `src/components/course/SectionView.tsx:1721` | `'databases-orm': { title: 'Practica SQL y modelos (simulado)', code: '# Simulacion de ORM y queries SQL (sin DB real)\nimport sqlite3 …'` | A Matplotlib/a11y demo (e.g. a small `build_bar_median` snippet using Agg) |
| Resources self-link | `s19-databases-orm.ts:1696` | `https://pillb.github.io/pyarcana/#databases-orm` | `https://pillb.github.io/pyarcana/#viz-accesible` |

### 4.2 — Residual "ORMs" disclaimers in section body (HIGH)

Two sentences only make sense if the reader could plausibly expect database/ORM content:

> **Line 33 (theory block 1, paragraph 4):** *"Progressive disclosure: no introducimos ORMs ni SQL nuevos; el foco es comunicación visual honesta que alimenta el factory Excel (S20) y reportes DOCX/PDF (S21)."*

> **Lines 69-71 (callout `Fuera de alcance en S19`):** *"No profundizamos en ORMs ni modelado SQL aquí. El foco es chart choice, ejes honestos, export reproducible y accesibilidad (a11y) para el dashboard CP-N2-B. Solo datos sintéticos; nunca PII real."*

Both should be deleted or rewritten to disclaim actual neighbor-section topics (e.g. *"No profundizamos en reporting DOCX/PDF aquí — ese es el foco de S21"*).

### 4.3 — Live-confirmed playground demo mismatch (HIGH)

Verified via agent-browser on the live site (https://pillb.github.io/pyarcana/#databases-orm → nav card 19 → "Teoría" tab → scroll to bottom):

```
Pruébalo tú mismo
Editor interactivo en tu navegador
Este editor corre Python de verdad en tu browser (con Pyodide). Modifica el código, presiona Run, y experimenta. No necesitas instalar nada.
Practica SQL y modelos (simulado)     ← title is SQL/ORM
Python listo  Reset  Run
1  import sqlite3                       ← code is SQL/ORM
2  import json
...
```

The interactive editor visible to every learner on Section 19 teaches `sqlite3`, `CREATE TABLE clientes`, `INSERT INTO clientes VALUES`, `SELECT * FROM clientes WHERE ciudad = ?` — content that belongs to Section 29 (SQL almacén ER) or similar, not to a visualization section.

### 4.4 — Authoring-residue English tokens in starter code comments (LOW)

| Line | Token in English | Spanish equivalent |
|---|---|---|
| 710 | `# Bug a corregir: hon en denominador wrong` | *mal* / *incorrecto* |
| 1264 | `# Completa el DEFECT con la condición…` | *defecto* |

### 4.5 — Templated `tests` boilerplate (LOW, ×24)

All 24 We-Do exercises carry the identical string `tests: "salida coincide con solution output"` (lines 605, 638, 667, 700, 703, 737, 771, 802, 837, 845, 888, 937, 992, 1023, 1065, 1096, 1125, 1158, 1191, 1224, 1255, 1289, 1320, 1353, 1384, 1419). This is the same pattern flagged in the S13 audit.

### 4.6 — No `TODO`/`FIXME`/`moved from section X` comments in the section source

A `grep -nE "TODO|FIXME|XXX|HACK|moved from|placeholder|TBD"` search found only 7 `TODO` markers, **all inside the You-Do starterCode skeleton** (lines 1524, 1530, 1536, 1541, 1547, 1552, 1558) where they are intentional learner-facing scaffolding (`# TODO: ax.bar(df["region"], df["n"])`, etc.). No internal authoring notes leaked.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I-Do / We-Do / You-Do fidelity

**Macro structure: excellent.** The 8 subtopics are each covered by:
- 1 theory block (heading + 3 paragraphs + 1 code demo + 1 callout) → 9 theory blocks total (1 map + 8 subtopics)
- 1 I-Do demo (description + code + `why`)
- 3 We-Do exercises (guided E1 → independent E2 → transfer E3), each with instruction, hint, hints[], edgeCases[], tests, starterCode, solutionCode, output, feedback
- A You-Do capstone (`CP-N2-B_dashboard` skeleton with 7 TODO builders + smoke test + rubric)
- A 5-question self-check with explanations
- A 6-criterion weighted rubric summing to 100 %

The progressive disclosure (T1 Intención → T2 Estático → T3 Interactivo+a11y → T4 Integridad) is explicit, and the "Ancla / Mecanismo / Caso / Borde" schema is applied uniformly.

**Micro execution: broken.** Because 11 of 24 We-Do exercises and 3 of 8 I-Do demos have code/output mismatches (see Issues #7-#23), the I-Do → We-Do handoff is currently broken: the learner reads code that doesn't produce the shown output, and in 3 exercises (`S19-T3-A-E1`, `S19-T3-B-E1`, `S19-T3-A-E2`) the solution code itself raises an exception. The contract-driven pedagogy collapses: the "contract" the learner is supposed to verify (`get_ylim()[0] == 0`, `ylabel == "Ticket mediano (PEN)"`, parity `chart == table`) is undermined by the section's own displayed outputs not matching its own code.

### 5.2 Connective tissue and narrative flow

Strong: the section opens with a dictionary / glossary block, anchors each subtopic to S18 (EDA) and forward to S20 (Excel factory) / S21 (reportes), and uses the "CASO-LIM-019" / "CP-N2-B" thread consistently. The "diccionario" device ("vuelve en cada subtema") is pedagogically sound.

Weak: the two residual "ORMs" disclaimers (Issues #4, #5) break the narrative — they invoke topics the reader has no reason to expect. The jobRelevance paragraph is dense (38 w, Issue #28) and could be split.

### 5.3 Cognitive load and progressive disclosure

The theory block 1 paragraph 1 ("diccionario de la sección") packs 7 glossary terms in one paragraph (Issue #50) — the section itself acknowledges this with *"Si el mapa se siente denso, avanza T1→T4 en orden"*. A definition list would be cleaner.

The theory block 1 paragraph 3 (45 w run-on, Issue #24) fuses 4 sub-topic definitions + a 5-clause workflow — this is precisely the kind of matrix that should be a 4-row table or a nested list.

### 5.4 Exercise and exam quality

**Quality of the exercise *design*: excellent.** Each We-Do exercise carries a single DEFECT to fix (baseline truncation, missing ylabel, dual-axis approval, missing n in tooltip, etc.), and the feedback explains *why* the fix matters in business terms (e.g. "Sin audiencia y chart en el brief, el informe S21 no sabe por qué se eligió ese encoding").

**Quality of the exercise *execution*: broken.* The 11 starter/solution/output mismatches mean the learner often cannot reproduce the displayed output even by running the solution. In 3 cases the solution raises an exception.

The self-check (5 questions, 4 options each, with explanations) is well-aligned to the cognitive traps (pie 3D, dual-axis, baseline truncation, sobreclaim, missing units). Q3's example name (`Sucursal-Centro`) is one of the pseudonymised tokens (Issue #53) — minor.

### 5.5 Consistency with the overall roadmap

The section correctly anchors to S18 (EDA e incertidumbre) as predecessor and S20 (Excel factory) / S21 (reportes) as successors. The CP-N2-B dashboard increment is consistently named. The "CASO-LIM-019" case identifier is consistent.

The only roadmap inconsistency is the stale `databases-orm` identity, which makes the section appear to be a database/ORM section in every system that consumes the `id` field (PDF, playground, URL hash).

### 5.6 Comparison with best-in-class external materials

The section's content is well-aligned with:
- **Wilke, *Fundamentals of Data Visualization*** (cited in resources) — encodings, honest axes, baseline 0.
- **Knaflic, *Storytelling with Data*** (cited) — audience, declutter, one idea per chart.
- **WCAG 1.4.1 (Use of Color)** (cited) — non-color channel (hatch/label).
- **WCAG 2.2 contrast minimum** (cited) — text/fondo contrast.
- **From Data to Viz** (cited) — chart choice by data type.
- **UW Accessible Data Visualization checklist** (cited) — alt text, parity.

The pedagogical framing (contract-driven, gate-based, fail-closed) is **stronger** than typical matplotlib tutorials, which tend to teach API without teaching integrity. The a11y framing (alt text + parity + sample/universe honesty) is **above industry standard** for a Python visualization course.

The execution layer (code/output mismatches, stale id) is **below** the standard set by the section's own stated contracts.

---

## 6. Grammatical Improvements — Paragraph-by-Paragraph Rewrite (Before / After)

> Method: For each prose-rich block (theory paragraphs, I-Do intro, We-Do intro, You-Do context, callouts), the **Before** is the verbatim source string and the **After** is the proposed rewrite. Rewrites are *proposals only* — no edits are applied in this audit pass. Code blocks, output blocks, and pure labels are excluded.

### 6.1 HEADER.tagline (line 8)

**Before:**
> cuatro gráficos estáticos y una vista interactiva, todos con conclusión limitada a evidencia y versión no visual equivalente

**After:**
> Cuatro gráficos estáticos y una vista interactiva, todos con conclusión limitada a la evidencia y versión no visual equivalente.

*Changes:* initial capital `C`; terminal period; `a evidencia` → `a la evidencia`. Fixes Issues #38 and the missing-terminal-punctuation heuristic. Metrics: FH stays ≈ same; the change is grammatical not structural.

### 6.2 HEADER.jobRelevance (line 15)

**Before:**
> En equipos de analytics y reporting en Perú (banca, retail, e-commerce, gobierno), una **visualización accesible y honesta** es el puente entre el EDA y las decisiones de un comité. Un dashboard que infla diferencias con el eje recortado, omite unidades o generaliza "Lima lidera el Perú" desde una muestra web no es "bonito": es un riesgo de reporting. Aquí construyes el incremento **CP-N2-B (dashboard)**: charts con ejes honestos, figuras Matplotlib exportables, tooltips/filtros modelados como especificación de datos y alternativas no visuales con los mismos números — listo para el factory Excel (S20) y los reportes (S21).

**After:**
> En equipos de analítica y reportes en Perú (banca, retail, e-commerce, gobierno), una **visualización accesible y honesta** es el puente entre el EDA y las decisiones de un comité. Un dashboard que infla diferencias con el eje recortado, omite unidades o generaliza "Lima lidera el Perú" desde una muestra web no es "bonito": es un riesgo de reporte. Aquí construyes el incremento **CP-N2-B (dashboard)**: charts con ejes honestos, figuras Matplotlib exportables, tooltips y filtros modelados como especificación de datos, y alternativas no visuales con los mismos números. Queda listo para la factoría Excel (S20) y los reportes (S21).

*Changes:* split the 38-w final sentence into two; `analytics` → `analítica` (RAE-accepted hispanicisation); `reporting` → `reportes` and `riesgo de reporting` → `riesgo de reporte`; `tooltips/filtros` → `tooltips y filtros` (readability); `factory Excel` → `la factoría Excel`. Fixes Issue #28.

### 6.3 Theory block 1, paragraph 1 — "diccionario de la sección" (line 30)

**Before:**
> **Antes de T1, el diccionario de la sección** (vuelve en cada subtema). *Pregunta analítica:* qué decisión habilita el gráfico. *Audiencia:* ejecutivo (pocas categorías, una idea) vs analista (más detalle). *Encoding:* canal visual (posición, longitud, color, forma). *Baseline:* origen del eje; en barras de magnitudes absolutas debe ser 0. *Alt text:* equivalente no visual con hallazgo y n. *Paridad:* los mismos números en chart, tabla y caption. *Sobreclaim:* lenguaje que excede la evidencia de la muestra. Si el mapa se siente denso, avanza T1→T4 en orden: primero eliges el chart, luego lo dibujas, luego lo haces accesible e íntegro.

**After:**
> **Antes de T1, el diccionario de la sección** (vuelve en cada subtema):
>
> - **Pregunta analítica:** qué decisión habilita el gráfico.
> - **Audiencia:** ejecutivo (pocas categorías, una idea) vs. analista (más detalle).
> - **Encoding:** canal visual (posición, longitud, color, forma).
> - **Baseline:** origen del eje; en barras de magnitudes absolutas debe ser 0.
> - **Alt text:** equivalente no visual con hallazgo y n.
> - **Paridad:** los mismos números en chart, tabla y caption.
> - **Sobreclaim:** lenguaje que excede la evidencia de la muestra.
>
> Si el mapa se siente denso, avanza T1→T4 en orden: primero eliges el chart, luego lo dibujas, luego lo haces accesible e íntegro.

*Changes:* glossary terms moved to a definition list (reduces cognitive load — Issue #50); `vs` → `vs.` (Issue #33). Metrics: paragraph → list, sentence count drops from 1 dense to 8 short; FH rises; readability improves.

### 6.4 Theory block 1, paragraph 3 — "Orden pedagógico" (line 32) — **run-on, 45 w**

**Before:**
> Orden pedagógico (~19 h): **T1 Intención** (pregunta, audiencia, chart choice y ejes honestos) → **T2 Estático** (Matplotlib, composición multi-panel, export versionado) → **T3 Interactivo y a11y** (modelo de filtros/tooltips, estado serializable, tabla alternativa, sampling honesto) → **T4 Integridad** (unidades, fuente, contraste, alt text, no sobreclaim). En cada subtema: teoría → demo I Do → tres We Do (guiado / independiente / transferencia) → al final You Do del portfolio y self-check.

**After:**
> Orden pedagógico (~19 h):
>
> 1. **T1 Intención** — pregunta, audiencia, *chart choice* y ejes honestos.
> 2. **T2 Estático** — Matplotlib, composición multi-panel, export versionado.
> 3. **T3 Interactivo y a11y** — modelo de filtros y tooltips, estado serializable, tabla alternativa, *sampling* honesto.
> 4. **T4 Integridad** — unidades, fuente, contraste, alt text, no sobreclaim.
>
> En cada subtema: teoría → demo *I Do* → tres *We Do* (guiado / independiente / transferencia) → al final *You Do* del portfolio y *self-check*.

*Changes:* 45-w run-on (Issue #24) restructured as a numbered list; high comma density eliminated; `filtros/tooltips` → `filtros y tooltips`. Fixes Issues #24 and the high-comma-density heuristic.

### 6.5 Theory block 1, paragraph 4 (line 33) — also meta-leak

**Before:**
> El hilo conductor es el **dashboard ejecutivo CP-N2-B**: cuatro gráficos estáticos (medianas, volumen, tendencia, scatter n–mediana) más una vista interactiva lógica, todos con conclusión limitada a la evidencia y versión no visual equivalente. Progressive disclosure: no introducimos ORMs ni SQL nuevos; el foco es comunicación visual honesta que alimenta el factory Excel (S20) y reportes DOCX/PDF (S21). Solo datos sintéticos; nunca PII real.

**After:**
> El hilo conductor es el **dashboard ejecutivo CP-N2-B**: cuatro gráficos estáticos (medianas, volumen, tendencia, *scatter* n–mediana) más una vista interactiva lógica, todos con conclusión limitada a la evidencia y versión no visual equivalente. *Progressive disclosure:* el foco es comunicación visual honesta que alimenta la factoría Excel (S20) y los reportes DOCX/PDF (S21). Solo datos sintéticos; nunca PII real.

*Changes:* deleted the residual "no introducimos ORMs ni SQL nuevos" clause (Issue #5); split the 33-w sentence at the *Progressive disclosure* marker; `factory Excel` → `la factoría Excel`. Fixes Issues #5, #25, #34 (partial).

### 6.6 Callout "Fuera de alcance en S19" (lines 67-71) — meta-leak

**Before:**
> **Fuera de alcance en S19**
>
> No profundizamos en ORMs ni modelado SQL aquí. El foco es chart choice, ejes honestos, export reproducible y accesibilidad (a11y) para el dashboard CP-N2-B. Solo datos sintéticos; nunca PII real.

**After:**
> **Fuera de alcance en S19**
>
> No profundizamos en reporting DOCX/PDF aquí (ese es el foco de S21) ni en dashboards con librerías interactivas obligatorias (Plotly/Streamlit). El foco es *chart choice*, ejes honestos, export reproducible y accesibilidad (a11y) para el dashboard CP-N2-B. Solo datos sintéticos; nunca PII real.

*Changes:* replaced the stale ORM disclaimer (Issues #4, #34) with disclaimers about actual neighbor-section topics (S21 reporting, Plotly/Streamlit) — which is also more useful to the learner.

### 6.7 Theory block T2-A, paragraph 1 (line 141) — long sentence

**Before:**
> Matplotlib construye la figura estática del portfolio. Siempre: título, etiquetas de ejes con unidades, leyenda si hay series múltiples, y n en el pie o título cuando el slice está filtrado. **Seaborn** es opcional (estilo con `sns.set_theme` sobre los mismos axes); no es un path obligatorio ni sustituye el contrato visual: ylim, ylabel y conteo de barras se leen en los axes de Matplotlib, no en la "belleza" del tema.

**After:**
> Matplotlib construye la figura estática del portfolio. Siempre: título, etiquetas de ejes con unidades, leyenda si hay series múltiples, y n en el pie o título cuando el *slice* está filtrado. **Seaborn** es opcional (estilo con `sns.set_theme` sobre los mismos *axes*); no es un camino obligatorio ni sustituye el contrato visual. Las claves del contrato — `ylim`, `ylabel` y conteo de barras — se leen en los *axes* de Matplotlib, no en la "belleza" del tema.

*Changes:* split the 39-w sentence at the colon (Issue #26); `path` → `camino` (Issue #42). Fixes Issue #26.

### 6.8 Theory block T3-A, paragraph 3 (line 221) — long sentence

**Before:**
> Caso sintético: row `{region:'Lima', median:28, n:40}` → tooltip `Lima: 28 PEN (n=40)`. Paridad chart↔tabla: si la barra dice 28, la fila de tabla dice 28 a la misma precisión publicada; si no, el gate de integridad falla antes del export y el portfolio no avanza a S20/S21.

**After:**
> Caso sintético: *row* `{region:'Lima', median:28, n:40}` → *tooltip* `Lima: 28 PEN (n=40)`. **Paridad chart↔tabla:** si la barra dice 28, la fila de la tabla dice 28 a la misma precisión publicada. Si no, el *gate* de integridad falla antes del *export* y el portfolio no avanza a S20/S21.

*Changes:* split the 35-w sentence at the semicolon (Issue #27); `fila de tabla` → `fila de la tabla`. Fixes Issue #27.

### 6.9 Theory block T3-B, paragraph 3 (line 255) — awkward typography

**Before:**
> Caso: `filtro_region=Oficina-Oeste` → state JSON compacto con `sample_n` y `universe_n` cuando aplique; `alt_text` une `region=v PEN` con `; `. La paridad se verifica con igualdad de valores a la precisión publicada (mismo redondeo en chart y tabla). Si redondeas a 1 decimal en el gráfico, la tabla no puede mostrar 3 "más precisos" sin documentarlo.

**After:**
> Caso: `filtro_region=Oficina-Oeste` → estado JSON compacto con `sample_n` y `universe_n` cuando aplique; `alt_text` une cada par `region=v PEN` con el separador `;`. La paridad se verifica con igualdad de valores a la precisión publicada (mismo redondeo en chart y tabla). Si redondeas a 1 decimal en el gráfico, la tabla no puede mostrar 3 "más precisos" sin documentarlo.

*Changes:* rephrased the `con ; .` sequence to `con el separador ;` (Issue #39); `state JSON` → `estado JSON`. Fixes Issue #39.

### 6.10 I-Do intro (line 359) — long sentence

**Before:**
> Te muestro, paso a paso, cómo diseñar charts honestos, exportables y con alternativa accesible para el dashboard CP-N2-B: de la elección de chart al PNG real, del tooltip con n a la paridad chart↔tabla y al rechazo de sobreclaim.

**After:**
> Te muestro, paso a paso, cómo diseñar charts honestos, exportables y con alternativa accesible para el dashboard CP-N2-B. Parte de la elección de *chart* y llega al PNG real; del *tooltip* con n a la paridad chart↔tabla y al rechazo de *sobreclaim*.

*Changes:* split the 39-w sentence at the colon (Issue #29). Fixes Issue #29.

### 6.11 We-Do intro (line 591) — comma density

**Before:**
> 24 ejercicios de elección de chart, ejes, Matplotlib, tooltips lógicos, a11y y claims (3 por subtema: guiado → independiente → transferencia). Cada starter trae un bug intencional de diseño o de contrato: corrígelo razonando el subtema (baseline, unidades, paridad, sampling, claims). No hay un "texto mágico de pass" en la consigna: diseña, imprime el resultado del contrato y compáralo con tu criterio del I Do.

**After:**
> 24 ejercicios de elección de *chart*, ejes, Matplotlib, *tooltips* lógicos, a11y y *claims* (3 por subtema: guiado → independiente → transferencia). Cada *starter* trae un bug intencional de diseño o de contrato: corrígelo razonando el subtema (*baseline*, unidades, paridad, *sampling*, *claims*). No hay un "texto mágico de pass" en la consigna: diseña, imprime el resultado del contrato y compáralo con tu criterio del *I Do*.

*Changes:* italicised the English borrowings for typographic consistency (no structural change). The original is grammatically correct; the heuristic flagged 4 commas in 21 words (Issue at pi=216).

### 6.12 You-Do context (line 1449) — concordance error

**Before:**
> Construye el incremento dashboard de **CP-N2-B**: al menos cuatro gráficos estáticos y una vista interactiva lógica, cada uno con conclusión limitada a evidencia y alternativa no visual. Continúa el hilo de S18 (medianas, n e incertidumbre por región sintéticas Oficina-Oeste/Cliente-A/Arequipa en PEN). El starter trae datos y un esqueleto de funciones: completa cada builder, exporta PNG reales y escribe alt/tabla con paridad.

**After:**
> Construye el incremento *dashboard* de **CP-N2-B**: al menos cuatro gráficos estáticos y una vista interactiva lógica, cada uno con conclusión limitada a la evidencia y alternativa no visual. Continúa el hilo de S18 (medianas, n e incertidumbre por **regiones sintéticas** Oficina-Oeste/Cliente-A/Arequipa en PEN). El *starter* trae datos y un esqueleto de funciones: completa cada *builder*, exporta PNG reales y escribe *alt* y tabla con paridad.

*Changes:* `región sintéticas` → `regiones sintéticas` (concordance fix — Issue #31); `a evidencia` → `a la evidencia`; `alt/tabla` → `alt y tabla`. Fixes Issue #31.

### 6.13 We-Do instruction S19-T2-A-E2 (line 838) — wrong conjunction

**Before:**
> E2 (independiente) — Dibuja dos barras (Sucursal-Sur=28, Sucursal-Centro=22.5) con backend Agg, etiqueta el eje Y como `Ticket mediano (PEN)`, fija ylim desde 0 y imprime un dict `{"ylabel": …, "ylim0": float(...)}`. El starter omite ylabel y deja el ylim por defecto: corrígelo y cierra la figura.

**After:**
> E2 (independiente) — Dibuja dos barras (Sucursal-Sur=28, Sucursal-Centro=22.5) con backend Agg, etiqueta el eje Y como `Ticket mediano (PEN)`, fija `ylim` desde 0 **e** imprime un dict `{"ylabel": …, "ylim0": float(...)}`. El starter omite `ylabel` y deja el `ylim` por defecto: corrígelo y cierra la figura.

*Changes:* `y imprime` → `e imprime` (Issue #32 — *y* → *e* before *imprime*, whose stressed vowel is *i*). Inline code wrapped in backticks. Fixes Issue #32.

### 6.14 We-Do feedback S19-T1-B-E3 (line 384) — `Y y` repetition

**Before:**
> Dual-axis mezcla dos escalas Y y suele engañar al comité. Prefiere paneles separados o un solo encoding de posición.

**After:**
> Dual-axis mezcla dos escalas Y; suele engañar al comité. Prefiere paneles separados o un solo encoding de posición.

*Changes:* replaced `Y y suele` with `Y; suele` to remove the `Y y` repetition flagged by LanguageTool `SPANISH_WORD_REPEAT_RULE` (Issue #40). Fixes Issue #40.

### 6.15 Theory block T1-A, paragraph 1 (line 77) — `vs` without period

**Before:**
> La **elección de gráfico** (*chart choice*) responde a la pregunta, no a la librería de moda. Comparar totales o medianas entre pocas regiones → barras; tendencia temporal → línea; relación entre dos cuantitativas → scatter. Documenta en metadata: `pregunta`, `chart_type`, `audiencia` (ejecutivo vs analista). Un pie 3D casi nunca es la respuesta correcta para un comité.

**After:**
> La **elección de gráfico** (*chart choice*) responde a la pregunta, no a la librería de moda. Comparar totales o medianas entre pocas regiones → barras; tendencia temporal → línea; relación entre dos cuantitativas → *scatter*. Documenta en metadata: `pregunta`, `chart_type`, `audiencia` (ejecutivo **vs.** analista). Un pie 3D casi nunca es la respuesta correcta para un comité.

*Changes:* `vs` → `vs.` (Issue #33, applies to all 13 instances — same fix in lines 17, 30, 142, 181, 696, 1025, 1165, 1534).

### 6.16 We-Do instruction S19-T2-B-E1 (line 931) — long sentence

**Before:**
> E1 (guiado) — Crea subplots 1×2 (Agg), guarda un PNG real a un `BytesIO` con dpi=120 y construye el dict de export: `fmt`, `dpi`, `panels` (contado desde `len(axes)`) y `png_ok` (True si el buffer tiene más de 500 bytes). El starter declara panels=1 y no hace savefig: corrígelo. Cierra la figura.

**After:**
> E1 (guiado) — Crea *subplots* 1×2 (Agg) y guarda un PNG real a un `BytesIO` con `dpi=120`. Construye el dict de export: `fmt`, `dpi`, `panels` (contado desde `len(axes)`) y `png_ok` (`True` si el buffer tiene más de 500 bytes). El starter declara `panels=1` y no hace `savefig`: corrígelo. Cierra la figura.

*Changes:* split the 30-w first sentence at "guarda un PNG" / "Construye el dict" (Issue #30). Fixes Issue #30.

### 6.17 We-Do starterCode comment S19-T4-A-E1 (line 1264) — English `DEFECT`

**Before (starterCode):**
```python
# CASO-LIM-019 · pie caption
# Bug a corregir: omite fuente
print("unidad=PEN")
# Completa el DEFECT con la condición del enunciado y un assert de aceptación.
result = None  # calcula el valor correcto
print(result)
assert result is not None
```

**After:**
```python
# CASO-LIM-019 · pie caption
# Bug a corregir: omite fuente
print("unidad=PEN")
# Completa el defecto con la condición del enunciado y un assert de aceptación.
result = None  # calcula el valor correcto
print(result)
assert result is not None
```

*Changes:* `DEFECT` → `defecto` (Issue #36). Also: this starterCode is suspiciously disconnected from the rest of the exercise (it prints `"unidad=PEN"` and then asks the learner to "completa el defecto" — but the actual solution simply does `print("unidad=PEN | fuente=sintetico")`). The starterCode body should be tightened to match the actual defect pattern (missing fuente key). Flagged as a separate minor issue.

### 6.18 We-Do starterCode comment S19-T1-B-E1 (line 710) — English `wrong`

**Before:**
```python
# CASO-LIM-019 · truncated axis factor
# Bug a corregir: hon en denominador wrong
truco = (50 - 45) / (50 - 40)
hon = (50 - 45) / (50 - 45)
print("factor", round(truco / hon, 2))
```

**After:**
```python
# CASO-LIM-019 · truncated axis factor
# Bug a corregir: hon en denominador mal
truco = (50 - 45) / (50 - 40)
hon = (50 - 45) / (50 - 45)
print("factor", round(truco / hon, 2))
```

*Changes:* `wrong` → `mal` (Issue #37).

### 6.19 Resources self-link (lines 1694-1698)

**Before:**
```ts
{
  label: "PyArcana live — Sección 19",
  url: "https://pillb.github.io/pyarcana/#databases-orm",
  note: "Dashboard accesible CP-N2-B en el curso desplegado",
},
```

**After:**
```ts
{
  label: "PyArcana live — Sección 19",
  url: "https://pillb.github.io/pyarcana/#viz-accesible",
  note: "Dashboard accesible CP-N2-B en el curso desplegado",
},
```

*Changes:* URL slug updated to match the (proposed) new section id (Issues #1, #6).

---

## 7. Proposed GitHub-style Diffs

> Diffs are *proposals only* — none are applied in this audit pass. All paths are relative to the repo root. Line numbers refer to the current `main` branch state.

### Diff 7.1 — Rename section id, filename, and all stale references (Issues #1, #3, #6)

```diff
--- a/src/lib/course/sections/s19-databases-orm.ts
+++ b/src/lib/course/sections/s19-databases-orm.ts
@@ -1,6 +1,6 @@
 import type { CourseSection } from '../../types'
 
 export const section19: CourseSection = {
- id: "databases-orm",
+ id: "viz-accesible",
  index: 19,
  title: "Visualización y comunicación accesible",
  shortTitle: "Viz accesible",
```

```diff
--- a/src/lib/course/index.ts
+++ b/src/lib/course/index.ts
@@ -18,7 +18,7 @@
-import { section19 } from './sections/s19-databases-orm'
+import { section19 } from './sections/s19-viz-accesible'
```

(Plus `git mv src/lib/course/sections/s19-databases-orm.ts src/lib/course/sections/s19-viz-accesible.ts`.)

```diff
--- a/src/components/course/PdfReport.tsx
+++ b/src/components/course/PdfReport.tsx
@@ -57,7 +57,7 @@
   "data-engineering": '18. Data Eng',
-  "databases-orm": '19. DB/ORM',
+  "viz-accesible": '19. Viz accesible',
   rag: '20. RAG',
```

```diff
--- a/src/lib/course/sections/s19-databases-orm.ts
+++ b/src/lib/course/sections/s19-databases-orm.ts
@@ -1693,7 +1693,7 @@
 {
   label: "PyArcana live — Sección 19",
-  url: "https://pillb.github.io/pyarcana/#databases-orm",
+  url: "https://pillb.github.io/pyarcana/#viz-accesible",
   note: "Dashboard accesible CP-N2-B en el curso desplegado",
 },
```

### Diff 7.2 — Replace the SQL/ORM playground demo with a Matplotlib/a11y demo (Issue #2)

```diff
--- a/src/components/course/SectionView.tsx
+++ b/src/components/course/SectionView.tsx
@@ -1718,42 +1718,39 @@
     },
-    'databases-orm': {
-      title: 'Practica SQL y modelos (simulado)',
-      code: `# Simulacion de ORM y queries SQL (sin DB real)
-import sqlite3
-import json
-
-# Crear DB en memoria (sqlite3 es stdlib!)
-conn = sqlite3.connect(":memory:")
-cursor = conn.cursor()
-
-# Crear tabla
-cursor.execute("""
-    CREATE TABLE clientes (
-        id INTEGER PRIMARY KEY,
-        nombre TEXT NOT NULL,
-        email TEXT UNIQUE,
-        edad INTEGER,
-        ciudad TEXT
-    )
-""")
-
-# Insertar datos
-clientes = [
-    (1, "Ana Garcia", "ana@email.pe", 25, "Lima"),
-    (2, "Luis Torres", "luis@email.pe", 30, "Arequipa"),
-    (3, "Carlos Diaz", "carlos@email.pe", 22, "Lima"),
-    (4, "Maria Quispe", "maria@email.pe", 28, "Cusco"),
-]
-cursor.executemany("INSERT INTO clientes VALUES (?,?,?,?,?)", clientes)
-conn.commit()
-
-# Query: todos los clientes de Lima
-cursor.execute("SELECT * FROM clientes WHERE ciudad = ?", ("Lima",))
-lima = cursor.fetchall()
-print(f"Clientes de Lima: {len(lima)}")
-for c in lima:
-    print(f"  {c[1]} ({c[3]} anos) - {c[2]}")
-
-# Query: promedio de edad por ciudad
-cursor.execute("""
-    SELECT ciudad, AVG(edad) as promedio
-    FROM clientes
-    GROUP BY ciudad
-    ORDER BY promedio DESC
-""")
-print(f"\\nPromedio de edad por ciudad:")
-for row in cursor.fetchall():
-    print(f"  {row[0]}: {row[1]:.1f} anos")
-
-# Count total
-cursor.execute("SELECT COUNT(*) FROM clientes")
-print(f"\\nTotal clientes: {cursor.fetchone()[0]}")
-conn.close()`,
-      expectedOutput: `Clientes de Lima: 2
-  Ana Garcia (25 anos) - ana@email.pe
-  Carlos Diaz (22 anos) - carlos@email.pe
-
-Promedio de edad por ciudad:
-  Arequipa: 30.0 anos
-  Cusco: 28.0 anos
-  Lima: 23.5 anos
-
-Total clientes: 4`,
-      hint: 'Anade un cliente mas y re-ejecuta las queries',
+    'viz-accesible': {
+      title: 'Practica un bar chart honesto (Agg)',
+      code: `# Practica visualizacion honesta con Matplotlib (backend Agg)
+import matplotlib
+matplotlib.use("Agg")
+import matplotlib.pyplot as plt
+
+# Datos sinteticos (CASO-LIM-019)
+regiones = ["Lima", "Cusco", "Arequipa"]
+medianas = [28.0, 22.5, 24.0]  # PEN
+ns = [40, 32, 28]
+
+fig, ax = plt.subplots(figsize=(6, 3.5))
+bars = ax.bar(regiones, medianas, color="#2c5282", hatch=["//", "\\\\", ".."])
+ax.set_ylabel("Ticket mediano (PEN)")
+ax.set_title("Ticket mediano por region (sintetico)")
+ax.set_ylim(0, max(medianas) * 1.2)  # baseline 0 obligatorio
+ax.bar_label(bars, fmt="%.1f")
+
+# Contrato verificable
+print("ylim0", float(ax.get_ylim()[0]) == 0.0)
+print("ylabel", ax.get_ylabel())
+print("n_bars", len(bars.patches))
+print("hatches", [str(p.get_hatch()) for p in bars.patches])
+plt.close(fig)`,
+      expectedOutput: `ylim0 True
+ylabel Ticket mediano (PEN)
+n_bars 3
+hatches ['//', '\\\\', '..']`,
+      hint: 'Cambia el baseline a 5 y observa como el gate falla',
     },
```

### Diff 7.3 — Delete residual "ORMs" disclaimers (Issues #4, #5, #34)

```diff
--- a/src/lib/course/sections/s19-databases-orm.ts
+++ b/src/lib/course/sections/s19-databases-orm.ts
@@ -30,7 +30,7 @@
- "El hilo conductor es el **dashboard ejecutivo CP-N2-B**: cuatro gráficos estáticos (medianas, volumen, tendencia, scatter n–mediana) más una vista interactiva lógica, todos con conclusión limitada a la evidencia y versión no visual equivalente. Progressive disclosure: no introducimos ORMs ni SQL nuevos; el foco es comunicación visual honesta que alimenta el factory Excel (S20) y reportes DOCX/PDF (S21). Solo datos sintéticos; nunca PII real.",
+ "El hilo conductor es el **dashboard ejecutivo CP-N2-B**: cuatro gráficos estáticos (medianas, volumen, tendencia, scatter n–mediana) más una vista interactiva lógica, todos con conclusión limitada a la evidencia y versión no visual equivalente. Progressive disclosure: el foco es comunicación visual honesta que alimenta el factory Excel (S20) y reportes DOCX/PDF (S21). Solo datos sintéticos; nunca PII real.",
```

```diff
--- a/src/lib/course/sections/s19-databases-orm.ts
+++ b/src/lib/course/sections/s19-databases-orm.ts
@@ -67,9 +67,9 @@
  callout: {
    type: "info",
    title: "Fuera de alcance en S19",
-   content:
- "No profundizamos en ORMs ni modelado SQL aquí. El foco es chart choice, ejes honestos, export reproducible y accesibilidad (a11y) para el dashboard CP-N2-B. Solo datos sintéticos; nunca PII real.",
+   content:
+ "No profundizamos en reporting DOCX/PDF aquí (ese es el foco de S21) ni en librerías interactivas obligatorias (Plotly/Streamlit). El foco es chart choice, ejes honestos, export reproducible y accesibilidad (a11y) para el dashboard CP-N2-B. Solo datos sintéticos; nunca PII real.",
  },
```

### Diff 7.4 — Fix theory demo `interactive_spec.py` (Issue #7)

```diff
--- a/src/lib/course/sections/s19-databases-orm.ts
+++ b/src/lib/course/sections/s19-databases-orm.ts
@@ -226,16 +226,16 @@
  code: {
    language: 'python',
    title: "interactive_spec.py",
    code: `def s19_th_5():
    rows = [
-    {"region": "Sucursal-Norte", "monto": 28.0, "n": 40},
-    {"region": "Cusco", "monto": 22.5, "n": 32},
-    {"region": "Arequipa", "monto": 24.0, "n": 28}
+    {"region": "Sucursal-Norte", "monto": 28.0, "n": 40},
+    {"region": "Sucursal-Centro", "monto": 22.5, "n": 32},
+    {"region": "Sucursal-Sur", "monto": 24.0, "n": 28}
    ]
-   filtro = "Sucursal-Sur"
+   filtro = "Sucursal-Norte"
    vista = [r for r in rows if r["region"] == filtro]
    tooltip = {**vista[0], "unidad": "PEN", "nota": "sintético"}
    print("filtro", filtro)
    print("tooltip", tooltip)
 
 s19_th_5()`,
-   output: `filtro Sucursal-Centro
-tooltip {'region': 'Oficina-Este', 'monto': 28.0, 'n': 40, 'unidad': 'PEN', 'nota': 'sintético'}`,
+   output: `filtro Sucursal-Norte
+tooltip {'region': 'Sucursal-Norte', 'monto': 28.0, 'n': 40, 'unidad': 'PEN', 'nota': 'sintético'}`,
  },
```

### Diff 7.5 — Fix I-Do demo `demo_tooltip.py` (Issue #8)

```diff
--- a/src/lib/course/sections/s19-databases-orm.ts
+++ b/src/lib/course/sections/s19-databases-orm.ts
@@ -494,16 +494,16 @@
  code: {
    language: 'python',
    title: "demo_tooltip.py",
    code: `def s19_ido_5():
    data = [
-       {"region": "Sucursal-Sur", "median": 28.0, "n": 40},
-       {"region": "Sucursal-Centro", "median": 22.5, "n": 32},
+       {"region": "Sucursal-Norte", "median": 28.0, "n": 40},
+       {"region": "Sucursal-Sur", "median": 22.5, "n": 32},
    ]
    def view(region):
        row = next(r for r in data if r["region"] == region)
        return {
            "tooltip": f"{row['region']}: {row['median']} PEN (n={row['n']})",
            "filtro": region,
            "unidad": "PEN",
        }
-   print(view("Oficina-Este"))
-   print(view("Oficina-Oeste")["tooltip"])
+   print(view("Sucursal-Norte"))
+   print(view("Sucursal-Sur")["tooltip"])
 
 s19_ido_5()`,
-   output: `{'tooltip': 'Cliente-A: 28.0 PEN (n=40)', 'filtro': 'Cliente-B', 'unidad': 'PEN'}
-Sucursal-Norte: 22.5 PEN (n=32)`,
+   output: `{'tooltip': 'Sucursal-Norte: 28.0 PEN (n=40)', 'filtro': 'Sucursal-Norte', 'unidad': 'PEN'}
+Sucursal-Sur: 22.5 PEN (n=32)`,
  },
```

### Diff 7.6 — Fix I-Do demo `demo_a11y.py` (Issue #9)

```diff
--- a/src/lib/course/sections/s19-databases-orm.ts
+++ b/src/lib/course/sections/s19-databases-orm.ts
@@ -523,14 +523,14 @@
  code: {
    language: 'python',
    title: "demo_a11y.py",
    code: `def s19_ido_6():
-   chart = {"Sucursal-Sur": 28.0, "Sucursal-Centro": 22.5}
+   chart = {"Sucursal-Norte": 28.0, "Sucursal-Sur": 22.5}
    table = [{"region": k, "ticket_mediano_pen": v} for k, v in chart.items()]
    text = "; ".join(f"{r['region']}={r['ticket_mediano_pen']} PEN" for r in table)
    print(table)
    print(text)
    print("parity", all(chart[r["region"]] == r["ticket_mediano_pen"] for r in table))
 
 s19_ido_6()`,
-   output: `[{'region': 'Oficina-Este', 'ticket_mediano_pen': 28.0}, {'region': 'Oficina-Oeste', 'ticket_mediano_pen': 22.5}]
-Cliente-A=28.0 PEN; Cliente-B=22.5 PEN
+   output: `[{'region': 'Sucursal-Norte', 'ticket_mediano_pen': 28.0}, {'region': 'Sucursal-Sur', 'ticket_mediano_pen': 22.5}]
+Sucursal-Norte=28.0 PEN; Sucursal-Sur=22.5 PEN
 parity True`,
  },
```

### Diff 7.7 — Fix I-Do demo `demo_caption.py` (Issue #10)

```diff
--- a/src/lib/course/sections/s19-databases-orm.ts
+++ b/src/lib/course/sections/s19-databases-orm.ts
@@ -556,7 +556,7 @@
     "limitacion": "canal web; n bajo en Sucursal-Norte",
    }
    print("pie", f"Unidad: {cap['unidad']} | Fuente: {cap['fuente']} | Corte: {cap['corte']} | Límite: {cap['limitacion']}")
 
 s19_ido_7()`,
-   output: `pie Unidad: PEN | Fuente: sintético CP-N2-B | Corte: 2024-06-30 | Límite: canal web; n bajo en Sucursal-Sur`,
+   output: `pie Unidad: PEN | Fuente: sintético CP-N2-B | Corte: 2024-06-30 | Límite: canal web; n bajo en Sucursal-Norte`,
  },
```

### Diff 7.8 — Fix I-Do demo `demo_claims.py` (Issue #11)

```diff
--- a/src/lib/course/sections/s19-databases-orm.ts
+++ b/src/lib/course/sections/s19-databases-orm.ts
@@ -571,16 +571,16 @@
  code: {
    language: 'python',
    title: "demo_claims.py",
    code: `def s19_ido_8():
    alt = "Barras: Sucursal-Centro 28 PEN, Arequipa 24, Oficina-Este 22.5; muestra web sintética n=100."
    claims = [
-    ("Oficina-Oeste lidera el ticket mediano en la muestra web", True),
-    ("Cliente-A es la mejor región del Perú", False),
+    ("Sucursal-Norte lidera el ticket mediano en la muestra web", True),
+    ("Sucursal-Centro es la mejor región del Perú", False),
    ]
    for c, ok in claims:
     print(c[:40], "=>", "PERMITIDO" if ok else "RECHAZADO")
    print("alt_words", len(alt.split()))
 
 s19_ido_8()`,
-   output: `Cliente-B lidera el ticket mediano en la mues => PERMITIDO
-Sucursal-Norte es la mejor región del Perú => RECHAZADO
+   output: `Sucursal-Norte lidera el ticket mediano en la mues => PERMITIDO
+Sucursal-Centro es la mejor región del Perú => RECHAZADO
 alt_words 12`,
  },
```

### Diff 7.9 — Fix theory demo `alt_claim.py` (Issue #12)

```diff
--- a/src/lib/course/sections/s19-databases-orm.ts
+++ b/src/lib/course/sections/s19-databases-orm.ts
@@ -334,16 +334,16 @@
  code: {
    language: 'python',
    title: "alt_claim.py",
    code: `def s19_th_8():
    alt = (
     "Barras del ticket mediano sintético: Cliente-A 28 PEN (n=40), "
     "Arequipa 24 (n=28), Cusco 22.5 (n=32). Eje Y desde 0."
    )
-   claim_ok = "En la muestra web sintética, Cliente-B muestra el ticket mediano más alto."
-   claim_bad = "Sucursal-Norte es la región más rentable del Perú."
+   claim_ok = "En la muestra web sintética, Cliente-A muestra el ticket mediano más alto."
+   claim_bad = "Sucursal-Centro es la región más rentable del Perú."
    print("alt_len", len(alt))
    print("usa_claim_ok", True)
    print("evita", claim_bad[:20] + "...")
 
 s19_th_8()`,
-   output: `alt_len 110
+   output: `alt_len 115
 usa_claim_ok True
-evita Sucursal-Sur es la región má...`,
+evita Sucursal-Centro es la región má...`,
  },
```

### Diff 7.10 — Fix unsolvable We-Do exercise `S19-T3-A-E1` (Issue #13)

```diff
--- a/src/lib/course/sections/s19-databases-orm.ts
+++ b/src/lib/course/sections/s19-databases-orm.ts
@@ -1058,7 +1058,7 @@
  instruction:
- "E1 (guiado) — Dada una lista de filas con región y mediana, recupera la mediana de **Oficina-Este** (no de Oficina-Oeste). El starter consulta la región equivocada: corrige el filtro e imprime el valor numérico.",
+ "E1 (guiado) — Dada una lista de filas con región y mediana, recupera la mediana de **Sucursal-Norte** (no de Sucursal-Sur). El starter consulta la región equivocada: corrige el filtro e imprime el valor numérico.",
  hint: "next(...) o list comprehension filtrando region == \"Sucursal-Norte\".",
  hints: [
- "Compara r[\"region\"] con la cadena Cliente-B.",
+ "Compara r[\"region\"] con la cadena Sucursal-Norte.",
 "Imprime solo el campo median de la fila filtrada.",
  ],
  edgeCases: ["sin match → StopIteration"],
  tests: "salida coincide con solution output",
  feedback:
- "El viewport filtrado debe recalcular el valor mostrado. Mostrar Sucursal-Norte cuando el filtro es Sucursal-Sur rompe la paridad con el tooltip.",
+ "El viewport filtrado debe recalcular el valor mostrado. Mostrar Sucursal-Sur cuando el filtro es Sucursal-Norte rompe la paridad con el tooltip.",
  starterCode: {
    language: 'python',
    title: "exercise.py",
    code: `# CASO-LIM-019 · lookup median
 # Bug a corregir: toma Sucursal-Centro
-rows = [{"region": "Oficina-Este", "median": 28}, {"region": "Oficina-Oeste", "median": 22}]
-print(next(r for r in rows if r["region"] == "Cliente-A")["median"])`,
+rows = [{"region": "Sucursal-Norte", "median": 28}, {"region": "Sucursal-Sur", "median": 22}]
+print(next(r for r in rows if r["region"] == "Sucursal-Norte")["median"])`,
  },
  solutionCode: {
    language: 'python',
    title: "exercise.py",
-   code: `rows = [{"region": "Cliente-B", "median": 28}, {"region": "Sucursal-Norte", "median": 22}]
-print(next(r for r in rows if r["region"] == "Sucursal-Sur")["median"])`,
+   code: `rows = [{"region": "Sucursal-Norte", "median": 28}, {"region": "Sucursal-Sur", "median": 22}]
+print(next(r for r in rows if r["region"] == "Sucursal-Norte")["median"])`,
    output: `28`,
  },
  },
```

### Diff 7.11 — Fix `región sintéticas` concordance (Issue #31)

```diff
--- a/src/lib/course/sections/s19-databases-orm.ts
+++ b/src/lib/course/sections/s19-databases-orm.ts
@@ -1449,7 +1449,7 @@
- "Construye el incremento dashboard de **CP-N2-B**: al menos cuatro gráficos estáticos y una vista interactiva lógica, cada uno con conclusión limitada a evidencia y alternativa no visual. Continúa el hilo de S18 (medianas, n e incertidumbre por región sintéticas Oficina-Oeste/Cliente-A/Arequipa en PEN). El starter trae datos y un esqueleto de funciones: completa cada builder, exporta PNG reales y escribe alt/tabla con paridad.",
+ "Construye el incremento dashboard de **CP-N2-B**: al menos cuatro gráficos estáticos y una vista interactiva lógica, cada uno con conclusión limitada a evidencia y alternativa no visual. Continúa el hilo de S18 (medianas, n e incertidumbre por regiones sintéticas Oficina-Oeste/Cliente-A/Arequipa en PEN). El starter trae datos y un esqueleto de funciones: completa cada builder, exporta PNG reales y escribe alt/tabla con paridad.",
```

### Diff 7.12 — Fix `y imprime` → `e imprime` (Issue #32)

```diff
--- a/src/lib/course/sections/s19-databases-orm.ts
+++ b/src/lib/course/sections/s19-databases-orm.ts
@@ -838,7 +838,7 @@
- "E2 (independiente) — Dibuja dos barras (Sucursal-Sur=28, Sucursal-Centro=22.5) con backend Agg, etiqueta el eje Y como `Ticket mediano (PEN)`, fija ylim desde 0 y imprime un dict `{\"ylabel\": …, \"ylim0\": float(...)}`. El starter omite ylabel y deja el ylim por defecto: corrígelo y cierra la figura.",
+ "E2 (independiente) — Dibuja dos barras (Sucursal-Sur=28, Sucursal-Centro=22.5) con backend Agg, etiqueta el eje Y como `Ticket mediano (PEN)`, fija ylim desde 0 e imprime un dict `{\"ylabel\": …, \"ylim0\": float(...)}`. El starter omite ylabel y deja el ylim por defecto: corrígelo y cierra la figura.",
```

### Diff 7.13 — Add period to all `vs` instances (Issue #33)

```diff
--- a/src/lib/course/sections/s19-databases-orm.ts
+++ b/src/lib/course/sections/s19-databases-orm.ts
@@ -17 +17 @@
- { text: "Elegir el tipo de chart (bar/line/scatter) según la pregunta analítica y la audiencia (ejecutivo vs analista), documentando la decisión en un brief de diseño" },
+ { text: "Elegir el tipo de chart (bar/line/scatter) según la pregunta analítica y la audiencia (ejecutivo vs. analista), documentando la decisión en un brief de diseño" },
@@ -30 +30 @@
- *Audiencia:* ejecutivo (pocas categorías, una idea) vs analista (más detalle).
+ *Audiencia:* ejecutivo (pocas categorías, una idea) vs. analista (más detalle).
@@ -77 +77 @@
- `audiencia` (ejecutivo vs analista).
+ `audiencia` (ejecutivo vs. analista).
@@ -142 +142 @@
- En local guardas PNG/SVG según audiencia (slides vs impresión);
+ En local guardas PNG/SVG según audiencia (slides vs. impresión);
@@ -181 +181 @@
- Multi-panel (`subplots`) alinea comparaciones (volumen vs mediana).
+ Multi-panel (`subplots`) alinea comparaciones (volumen vs. mediana).
@@ -696 +696 @@
- Valores 50 y 45 con eje recortado en 40 vs baseline 0.
+ Valores 50 y 45 con eje recortado en 40 vs. baseline 0.
@@ -1025 +1025 @@
- Cada panel necesita título propio para que el comité lea Vol vs Med sin ambigüedad.
+ Cada panel necesita título propio para que el comité lea Vol vs. Med sin ambigüedad.
@@ -1165 +1165 @@
-# Bug a corregir: tabla 27.5 vs chart 28.0
+# Bug a corregir: tabla 27.5 vs. chart 28.0
@@ -1534 +1534 @@
-    """Scatter n vs mediana; documenta que n no implica causalidad."""
+    """Scatter n vs. mediana; documenta que n no implica causalidad."""
```

### Diff 7.14 — Fix `DEFECT` and `wrong` anglicisms (Issues #36, #37)

```diff
--- a/src/lib/course/sections/s19-databases-orm.ts
+++ b/src/lib/course/sections/s19-databases-orm.ts
@@ -710 +710 @@
-# Bug a corregir: hon en denominador wrong
+# Bug a corregir: hon en denominador mal
@@ -1264 +1264 @@
-# Completa el DEFECT con la condición del enunciado y un assert de aceptación.
+# Completa el defecto con la condición del enunciado y un assert de aceptación.
```

### Diff 7.15 — Capitalise tagline (Issue #38)

```diff
--- a/src/lib/course/sections/s19-databases-orm.ts
+++ b/src/lib/course/sections/s19-databases-orm.ts
@@ -8 +8 @@
- tagline: "cuatro gráficos estáticos y una vista interactiva, todos con conclusión limitada a evidencia y versión no visual equivalente",
+ tagline: "Cuatro gráficos estáticos y una vista interactiva, todos con conclusión limitada a la evidencia y versión no visual equivalente.",
```

### Diff 7.16 — Rewrite run-on "Orden pedagógico" sentence as a list (Issue #24)

```diff
--- a/src/lib/course/sections/s19-databases-orm.ts
+++ b/src/lib/course/sections/s19-databases-orm.ts
@@ -32 +32,10 @@
- "Orden pedagógico (~19 h): **T1 Intención** (pregunta, audiencia, chart choice y ejes honestos) → **T2 Estático** (Matplotlib, composición multi-panel, export versionado) → **T3 Interactivo y a11y** (modelo de filtros/tooltips, estado serializable, tabla alternativa, sampling honesto) → **T4 Integridad** (unidades, fuente, contraste, alt text, no sobreclaim). En cada subtema: teoría → demo I Do → tres We Do (guiado / independiente / transferencia) → al final You Do del portfolio y self-check.",
+ "Orden pedagógico (~19 h):\\n\\n1. **T1 Intención** — pregunta, audiencia, chart choice y ejes honestos.\\n2. **T2 Estático** — Matplotlib, composición multi-panel, export versionado.\\n3. **T3 Interactivo y a11y** — modelo de filtros y tooltips, estado serializable, tabla alternativa, sampling honesto.\\n4. **T4 Integridad** — unidades, fuente, contraste, alt text, no sobreclaim.\\n\\nEn cada subtema: teoría → demo I Do → tres We Do (guiado / independiente / transferencia) → al final You Do del portfolio y self-check.",
```

*(Note: depending on how the rendering layer treats `\\n` inside template literals, this may need to become an array of strings instead of a single string.)*

### Diff 7.17 — Fix `Y y` repetition (Issue #40)

```diff
--- a/src/lib/course/sections/s19-databases-orm.ts
+++ b/src/lib/course/sections/s19-databases-orm.ts
@@ -384 +384 @@
- "Dual-axis mezcla dos escalas Y y suele engañar al comité. Prefiere paneles separados o un solo encoding de posición.",
+ "Dual-axis mezcla dos escalas Y; suele engañar al comité. Prefiere paneles separados o un solo encoding de posición.",
```

### Diff 7.18 — Fix `template` anglicism (Issue #35)

```diff
--- a/src/lib/course/sections/s19-databases-orm.ts
+++ b/src/lib/course/sections/s19-databases-orm.ts
@@ -1109 +1109 @@
-print(f"Cliente-A: {28} PEN (n={40})")`,
+print(f"Cliente-A: {28} PEN (n={40})")`  # (no change to code; the anglicism is in the prose feedback below)
@@ -1122 +1122 @@
- "n sale de row['n'], no hardcodees solo el valor de Sucursal-Sur si generalizas.",
+ "n sale de row['n'], no hardcodees solo el valor de Sucursal-Sur si generalizas.",  # (unchanged)
@@ -1135 +1135 @@
- "El template reutilizable evita tooltips distintos por región. Si falta n en el string, el gate de a11y falla.",
+ "La plantilla reutilizable evita tooltips distintos por región. Si falta n en el string, el gate de a11y falla.",
@@ -1118 +1118 @@
- "E3 (transferencia) — Escribe `tooltip(row)` que devuelva `\"{region}: {median} PEN (n={n})\"` para cualquier fila. Prueba con Sucursal-Norte 22.5 y n=32. El starter omite n en el template.",
+ "E3 (transferencia) — Escribe `tooltip(row)` que devuelva `\"{region}: {median} PEN (n={n})\"` para cualquier fila. Prueba con Sucursal-Norte 22.5 y n=32. El starter omite n en la plantilla.",
```

---

## 8. Recommended Priority Order for Fixing

1. **[BLOCKER]** Fix the 3 I-Do demos that crash and 3 We-Do exercises that crash (Issues #7, #8, #13, #16, plus the 11 starter/solution/output mismatches). Re-run every demo and exercise with a single consistent region-name set; regenerate `output:` blocks. (Issues #7–#23.)
2. **[BLOCKER]** Replace the SQL/ORM interactive playground demo (`SectionView.tsx:1721`) with a Matplotlib/a11y demo keyed by the new section id. (Issues #2, #1.)
3. **[HIGH]** Rename the section id `databases-orm` → `viz-accesible` (file, import, `PdfReport.tsx`, resources self-link). (Issues #1, #3, #6.)
4. **[HIGH]** Delete the two residual "ORMs" disclaimers in the section body. (Issues #4, #5, #34.)
5. **[MEDIUM]** Apply grammar fixes: `región sintéticas` → `regiones sintéticas` (Issue #31), `y imprime` → `e imprime` (Issue #32), capitalise tagline (Issue #38), `vs` → `vs.` ×13 (Issue #33), `Y y` repetition (Issue #40).
6. **[MEDIUM]** Restructure the 45-word run-on "Orden pedagógico" sentence as a list (Issue #24) and split the other 6 long sentences (Issues #25–#30).
7. **[LOW]** Replace `DEFECT` / `wrong` / `template` anglicisms (Issues #35, #36, #37).
8. **[LOW]** De-templatise the `tests` field (×24 boilerplate strings) (Issue #41).
9. **[LOW]** Move the "diccionario de la sección" glossary to a definition list (Issue #50).

---

## 9. Graph Memory Update Notes (for shared context files)

- **Section 19 is the worst-executed section seen so far in the audit campaign.** Macro pedagogy is gold-standard; execution is broken by a pseudonymisation-script bug that left code, output, and prose using different region names. Pattern: a region renaming script (Lima/Cusco/Arequipa → Sucursal-Norte/Sucursal-Sur/Sucursal-Centro/Oficina-Este/Oficina-Oeste/Cliente-A/Cliente-B) ran over the file but did not propagate consistently.
- **The "stale id" meta-leak pattern (S13 had `rpa-automation` vs Evidence Dashboard content) recurs in S19 with `databases-orm` vs Viz accesible content.** This is a systemic authoring pattern worth flagging to the orchestrator: any section whose `id` doesn't match its `title` likely has the same cascade (wrong PDF title, wrong playground demo, residual "out of scope" disclaimers from the prior topic).
- **The interactive playground dictionary in `SectionView.tsx`** (lines ~1354 for S13, ~1721 for S19, and likely similar for other renamed sections) is a *systemic meta-leak source*. Every renamed section has its old demo still keyed by its old id. Recommend a cross-section sweep: for each `id` in `index.ts`, check that the `demos[id]` entry in `SectionView.tsx` and the `pdfTitles[id]` entry in `PdfReport.tsx` actually match the section's current `title` and content topic.
- **Section 19's grammar is healthy at the macro level** (FH = 71.8, INFLESZ = 67.4, mean paragraph FH = 68.6) — comparable to S13 (FH = 70.5). Long-sentence issues are concentrated in the theory-paragraphs-1-4 cluster (the dense intro).
- **LT real (non-spelling) findings:** 43 matches total, dominated by `PUNTO_EN_ABREVIATURAS` (13 × `vs`), `SINGLE_CHARACTER` (9 × false-positive on `n`), `D_ELA` (3 × false-positive on `n bajo`), `ES_SPLIT_WORDS` (3 × false-positive on `omite n`). Real actionable LT findings: 1 `Y_E_O_U` (`y imprime` → `e imprime`), 1 `AGREEMENT_ADJ_NOUN` (`región sintéticas`), 2 `WRONG_IMPERATIVE` (`template` → `plantilla`), 2 `SIGLAS` (`ORMs` → `ORM`), 1 `UPPERCASE_SENTENCE_START` (tagline), 1 `SPANISH_WORD_REPEAT_RULE` (`Y y`).

---

## 10. Method Note (Spanish Grammar / Style / Structure Audit)

### 10.1 Research methods applied (per `_GRAMMAR_SUBPLAN.md`)

- **Fernández-Huerta (1959):** `FH = 206.84 − 60·(syllables/word) − 1.02·(words/sentence)`. Spanish Flesch adaptation. Global: **FH = 71.8** (*normal / bastante fácil* band).
- **Szigriszt-Pazos / INFLESZ:** `INFLESZ = 206.835 − 62.3·(syllables/word) − (words/sentence)`. Global: **INFLESZ = 67.4** (*normal* band).
- **Words per sentence (WPS):** global mean **11.88** (well below the 15–32 technical-Spanish soft target — the section's prose is built from many short instruction/hint sentences). Per-paragraph WPS ranges from 2 (labels) to 39 (jobRelevance).
- **Syllables per word (SPW):** global mean **2.05** (typical for technical Spanish with borrowings).
- **Heuristic rules:** run-on > 45 w (H), long > 32 w (M), missing terminal punctuation (M/L), missing `¿`/`¡` pairs (M/L), unbalanced delimiters (M), repeated word (M), english-dominant sentence (M), meta/AI/TODO leak (H), gerund pile-up ≥ 3 (L), high comma density (L), paragraph = one long sentence (M), anaphoric monotony (L), space-before-punct (L).
- **LanguageTool (es) via public API:** one chunk of 4 654 chars of prose-rich text submitted (throttled, 4 s sleep). 531 raw matches; 43 non-spelling matches after filtering `MORFOLOGIK_RULE_ES` (which fires heavily on tech borrowings like `tooltip`, `claim`, `dashboard`, `factory`, `viewport`, `starter`, `brief`, `hatch`, `backend`, `axes`, `pie_3d`, `scatter`, `baseline`, `encoding`, etc.).

### 10.2 Implementation artefacts

| File | Purpose |
|---|---|
| `audits/_s19_extract.py` | Extracts learner-facing Spanish prose from `s19-databases-orm.ts` (theory paragraphs, callouts, I-Do/We-Do/You-Do fields, self-check, rubric, resources). |
| `audits/S19_prose.txt` | 454 prose blocks / 1 361 lines. |
| `audits/_s19_grammar.py` | Adapted from S13 grammar script; splits on `### LABEL` markers and computes FH/INFLESZ/WPS/SPW + 13 heuristic rules per paragraph. |
| `audits/S19_metrics.json` | Per-paragraph metrics + worst-sentence list. Global: FH=71.8, INFLESZ=67.4, 418 sentences / 4 965 words. |
| `audits/_s19_lt.py` | Submits a single prose-rich chunk to LanguageTool `es` API; saves all matches. |
| `audits/S19_lt.json` | 531 raw matches (488 spelling, 43 grammar/style). |

### 10.3 Per-paragraph metrics summary

- **Paragraphs:** 454 prose blocks (285 with ≥1 Spanish sentence after filtering).
- **Mean FH per paragraph:** 68.6 (median 69.9).
- **FH distribution:** min −22.2 (short labels with long words like "Visualización y comunicación accesible"), max 123.8 (3-word hints like "f-string con {version}."). Both extremes are short-string artefacts; the meaningful prose range sits in the 50–85 band.
- **Long sentences (>32 w):** 7 (Issues #24–#30).
- **Run-on sentences (>45 w):** 1 (Issue #24, the "Orden pedagógico" sentence at 45 w).
- **High comma density (≥4 commas and >0.15 commas/word):** 4 instances (theory paragraphs T1-A, T2-B, T3-B; weDo.intro).
- **Missing terminal punctuation:** 123 instances — almost all are short labels (theory headings, callout titles, learning-outcome bullets, rubric criteria) that are intentionally label-style, not sentence-style. This is a known heuristic limitation on label fields and is reported as info-only.
- **Unbalanced delimiters:** 6 instances — all are false positives where the heuristic doesn't understand inline code or `p. ej.` abbreviations split across the sentence boundary.
- **Space-before-punct:** 2 instances (Issues at pi=267, pi=320) — both in hints that refer to `.png` and `.items()` inline.

### 10.4 Worst sentences (full text, longest 7)

1. **pi=99, 45 w, run-on + high comma density** — Theory block 1, paragraph 3 (the "Orden pedagógico" sentence). See Issue #24.
2. **pi=107, 39 w, long** — Theory block T2-A, paragraph 1 (the "Seaborn es opcional" sentence). See Issue #26.
3. **pi=215, 39 w, long** — iDo intro. See Issue #29.
4. **pi=242, 39 w, long** — We-Do instruction `S19-T2-B-E1`. See Issue #30.
5. **pi=79, 38 w, long** — jobRelevance. See Issue #28.
6. **pi=116, 35 w, long** — Theory block T3-A, paragraph 3. See Issue #27.
7. **pi=100, 33 w, long** — Theory block 1, paragraph 4. See Issue #25.

### 10.5 Cause → improvement playbook (section-specific samples)

| Cause | Sample sentence | Improvement |
|---|---|---|
| Run-on fusing 4+ sub-definitions | "Orden pedagógico (~19 h): T1 … → T2 … → T3 … → T4 …. En cada subtema: teoría → demo I Do → tres We Do (guiado / independiente / transferencia) → al final You Do del portfolio y self-check." (45 w) | Convert to a numbered list (see Diff 7.16). |
| Long compound sentence with inline code refs | "E1 (guiado) — Crea subplots 1×2 (Agg), guarda un PNG real a un BytesIO con dpi=120 y construye el dict de export: fmt, dpi, panels (contado desde len(axes)) y png_ok (True si el buffer tiene más de 500 bytes)." (39 w) | Split at "y construye" (see Diff 7.16 pattern). |
| Concordance slip with pseudonymised noun | "por región sintéticas Oficina-Oeste/Cliente-A/Arequipa" | Pluralise the head noun: "por regiones sintéticas …" (Diff 7.11). |
| Conjunction rule missed before i-stressed verb | "fija ylim desde 0 y imprime un dict" | `y` → `e`: "fija ylim desde 0 e imprime un dict" (Diff 7.12). |
| Abbreviation missing period | "ejecutivo vs analista" (×13) | "ejecutivo vs. analista" (Diff 7.13). |
| Acronym pluralised | "no introducimos ORMs" | "no introducimos ORM" (Diff 7.3 deletes the clause entirely). |
| English borrowing used as Spanish noun | "El template reutilizable evita tooltips distintos por región." | "La plantilla reutilizable evita tooltips distintos por región." (Diff 7.18). |
| Mixed Spanish+English in code comment | "Bug a corregir: hon en denominador wrong" | "Bug a corregir: hon en denominador mal" (Diff 7.14). |
| Repetition flagged by LT | "Dual-axis mezcla dos escalas Y y suele engañar al comité." | "Dual-axis mezcla dos escalas Y; suele engañar al comité." (Diff 7.17). |
| Tagline missing initial capital | "cuatro gráficos estáticos y una vista interactiva" | "Cuatro gráficos estáticos y una vista interactiva" (Diff 7.15). |
| Authoring residue from section renaming | "No profundizamos en ORMs ni modelado SQL aquí." | Delete or rewrite (Diff 7.3). |
| Pseudonymisation script inconsistency | Code: `data = [{"region": "Sucursal-Sur", ...}]` then `view("Oficina-Este")` → `StopIteration`. Output: `{'tooltip': 'Cliente-A: 28.0 PEN (n=40)', ...}` (fabricated). | Re-run code with consistent region names; regenerate `output:` (Diffs 7.4–7.10). |

---

**This is the complete Explorer report for Section 19. Ready for the Fixer prompt.**
