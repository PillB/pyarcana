# Pyarcana Section 46 — Curriculum Auditor Report

**Section:** 46 — *"Ingeniería de datos y orquestación de producción"* (Data Engineering & Production Orchestration)
**Source file:** `src/lib/course/sections/s46-gpu-computing.ts` (2,412 lines)
**Section id:** `"gpu-computing"`  ← filename/id retained from a prior GPU-computing scope
**Live URL:** https://pillb.github.io/pyarcana/#gpu-computing
**Phase / Level:** Phase 3 — Master · 20 h
**Auditor:** Curriculum Auditor (general-purpose), Stanford STORM + Graph/Loop/Harness Engineering
**Audit scope:** All learner-facing Spanish prose (theory, I Do, We Do, You Do, Self-Check, callouts, resources) plus structural / pedagogical / redaction quality and meta-leak detection.

---

## 1. Section Identification & Scope

**Confirmed Section 46 of 52** in course order (`src/lib/course/index.ts` line 80: `section46, section47, …`). Live site nav lists it as the 46th card:

> Sección 46 · Data eng producción · "pipeline incremental/backfillable sin duplicar, con lineage y alertas por dato tardío o contrato roto" · 20h · Master

**Scope of audit** (everything learner-facing in the file):

| Block | Count | Notes |
|-------|------|-------|
| `theory` subtopic blocks | 9 | "Ruta de S46" intro + 8 subtopic blocks (S46-T1-A, T1-B, T2-A, T2-B, T3-A, T3-B, T4-A, T4-B) |
| `paragraphs` prose items | 28 | 4 intro + 24 subtopic (3 per subtopic) |
| `iDo.steps` (demos) | 8 | One per subtopic, each with description + `why` |
| `weDo.steps` (exercises) | 24 | 3 exercises (E1/E2/E3) per subtopic |
| `youDo` capstone | 1 | "Pipeline incremental Huancayo (CASO-HYO-046)" with 5 objectives, 7 requirements, 6-criterion rubric |
| `selfCheck.questions` | 5 | MCQ with 4 options + explanation each |
| `resources` | 18 labels | 10 docs, 2 books, 6 courses |
| `callout` blocks | 9 | All titled "Contrato local" (anaphoric monotony — see §5) |
| `learningOutcomes` | 8 | All start with infinitive verb (Clasificar, Componer, Validar…) |
| `jobRelevance` | 1 (paragraph) | 4 sentences, 92 words |

**Confirmed via live site** (agent-browser snapshot of `#gpu-computing`): the rendered page shows tabs `Teoría · Yo hago · Hacemos juntos · Tú haces · Autocheck` and a `Pruébalo tú mismo` interactive editor panel at the bottom whose starter code is GPU-computing content (see Meta-Leak §4).

**Out of scope** (per instructions): pure code blocks (`starterCode`/`solutionCode` Python bodies, `output` blocks), `id`/`url` fields, `tests` strings.

---

## 2. Executive Summary of Quality

**Composite score: 7 / 10**

**Verdict:** Solid Master-level data-engineering curriculum with strong I Do / We Do / You Do / Self-Check fidelity and pedagogically sound progressive disclosure (T1→T4 subtopic spine, E1/E2/E3 fail-closed pattern repeated per family). The Spanish prose is precise, action-oriented, and lexically controlled. **The score is capped by one major meta-leak / content-mismatch**: the `Pruébalo tú mismo` interactive editor at the bottom of the rendered section still serves a **GPU-computing** starter (`matrix_multiply_cpu`, `vLLM`, `PagedAttention`, `CuPy`, T4/A100/H100 specs) that has nothing to do with the section's actual topic (streaming watermarks, DAGs, contracts, lineage). This is a leftover from the previous scope of S46 — the section file's `id: "gpu-computing"` and the file name `s46-gpu-computing.ts` were never renamed when the content was rewritten. The author even disavows the GPU scope inside the prose (L33: *"El foco es corrección de datos y operación del pipeline, no kernels de hardware."*), confirming the rename.

Below that headline issue, there is a cluster of minor Spanish redaction refinements (≈20 instances total) — `vs` → `vs.`, `postmortem` → `post mortem`, `re-procesar` → `reprocesar`, missing comma before `pero`, anaphoric monotony in the 9 "Contrato local" callouts, a long dictionary-dump paragraph (L29, 107 words, 1 sentence) — and a consistency decision to settle about the gender of `data` (LATAM feminine vs. tech-English masculine) and the article before English compounds (`Un data contract` vs `Una data contract`).

**Headline strengths:**
- Tight "Contrato operativo / Entrada / Salida / Error / Criterio" template per theory subtopic — high cognitive scaffolding.
- Each subtopic closes with an `Aplicación a CASO-HYO-046` paragraph grounding the abstract contract in the same synthetic Huancayo case — strong narrative continuity.
- `why` rationales in I Do explicitly tie each demo to a downstream gate (`CP-N4-B`, `S47 MLOps`) — vertical alignment is visible to the learner.
- We Do exercises use a **deliberately defective starter** that the learner must fix, with `feedback` naming the specific cognitive error ("el defecto invertía late/out-of-window como éxito") — excellent worked-example pedagogy.
- Self-check questions include plausible distractors (e.g., Q4 distractor "siempre ON_TIME porque 100 < window_end típico" targets a real student misconception).

**Headline weaknesses (ranked):**
1. **META-LEAK**: `Pruébalo tú mismo` editor shows GPU content (critical).
2. **Section id/file name mismatch**: `gpu-computing` label persists everywhere (URL hash, source filename, internal id).
3. Long, dictionary-style theory paragraph L29 (107 words, 1 sentence) — high cognitive load.
4. Repetitive `Contrato local` callout title across 8 subtopics — anaphoric monotony.
5. Typography: `vs`/`vs.` (7×), `postmortem`/`post mortem` (5×), `re-`-prefix hyphenation (5×), missing comma before `pero` (1×), `{a,b,c}` missing space after comma.
6. Gender consistency for `data` (`Un data contract` vs `Una data contract`; `late data silencioso` vs `silenciosa`).

---

## 3. Detailed Issue Registry

Issues are numbered `S46-NNN`. Severity: **H** = blocking (pedagogy or correctness), **M** = meaningful quality hit, **L** = polish. Evidence quotes are verbatim from the source.

### H — Meta-leaks & structural mismatches

#### S46-001 — `Pruébalo tú mismo` interactive editor serves GPU-computing content for a Data-Engineering section (META-LEAK / CONTENT MISMATCH)
- **Severity:** H
- **Evidence (live-rendered, confirmed via agent-browser on `https://pillb.github.io/pyarcana/#gpu-computing`):**
  > Pruébalo tú mismo — Editor interactivo en tu navegador — … Practica conceptos de GPU (simulado) — `# Simulacion de conceptos de GPU computing … def matrix_multiply_cpu(A, B): … print("=== GPU Computing Concepts ===") … print("  GPU (CuPy):    ~0.05s (42x speedup)") … print("  T4: 16GB | A100: 80GB | H100: 80GB") … print("  PagedAttention: gestiona KV cache como memoria virtual")`
- **Source of leak:** `src/components/course/SectionView.tsx` lines 3500–3556: a lookup table keyed by section id has `'gpu-computing': { title: 'Practica conceptos de GPU (simulado)', code: \`# Simulacion de conceptos de GPU computing …\` }`. The section's id (`"gpu-computing"`) was never renamed when the section content was rewritten to "Ingeniería de datos y orquestación de producción".
- **Pedagogical impact:** Learner reaches the bottom of a 20-hour section on watermarks, DAGs, contracts and lineage — and is invited to "try it yourself" with a CPU-vs-GPU matrix multiply and vLLM serving notes. This breaks narrative continuity, signals authorial carelessness, and forces the learner to reconcile two unrelated mental models. It also wastes the most actionable "playground" real estate on the page.
- **Worse:** the section file explicitly disavows GPU hardware in L33: *"El foco es corrección de datos y operación del pipeline, no kernels de hardware."* — so the prose and the editor contradict each other inside the same page.

#### S46-002 — Section id and file name still say "gpu-computing" while title/topic is Data Engineering
- **Severity:** H (paired with S46-001; structural)
- **Evidence:** `s46-gpu-computing.ts` line 4: `id: "gpu-computing"`, line 6: `title: "Ingeniería de datos y orquestación de producción"`. URL hash on live site is `#gpu-computing`. The deep link is therefore `pillb.github.io/pyarcana/#gpu-computing` for a section about data orchestration — confusing for anyone sharing/bookmarking/auditing the URL.
- **Pedagogical impact:** Search, bookmarks, and progress persistence key off this id; renaming later is breaking. Leaving it creates a permanent terminological mismatch in the URL bar.

### M — Redaction, grammar, cognitive load

#### S46-003 — Dictionary-dump paragraph L29 is one 107-word sentence (cognitive overload)
- **Severity:** M
- **Evidence (verbatim):**
  > **Diccionario de la sección** (léelo antes de T1). **Event time:** cuándo ocurrió el hecho (no el processing time del worker). **Watermark:** aserción de progreso en event time — watermark t declara que no se esperan más eventos con timestamp ≤ t. **Late data:** llega después de que el watermark superó su timestamp (política: drop / side-output / update / quarantine). **Exactly-once (compuesto):** end-to-end con sinks idempotentes + checkpoints, no un flag mágico del broker. **DAG/asset:** grafo de dependencias sin ciclos. **Backfill:** re-run acotado de rangos históricos. **Data contract:** schema + freshness + ownership. **Lineage:** de qué run/tabla salió cada fila. **Incremental load:** particiones/keys sin full rewrite ciego.
- **Metrics:** 9 definitions in one paragraph; only the first definition is a grammatical sentence (the rest are noun-phrase fragments glued with periods). WPS for the segment = 107 words / 1 sentence. FH = 38.0 (band: *difícil*). My heuristic flags it as `long_sentence` (M). LanguageTool does not flag it (it accepts period-separated fragments), but pedagogically it is a wall of text.
- **Pedagogical impact:** Definitions are easier to retrieve when each is its own line/bullet. Dumping 9 definitions as a single paragraph asks the learner to do the segmentation themselves before they can memorize. The header `**Diccionario de la sección** (léelo antes de T1)` *tells* the learner to read this before T1, but the format makes pre-reading harder than it should be.
- **Fix direction:** convert to a definition list / bulleted list (still allowed inside the `paragraphs` array if the renderer supports inline `\n` or the section schema accepts `definitions: [...]`).

#### S46-004 — `vs` without period, 7 occurrences (Spanish typography)
- **Severity:** M (style)
- **Evidence (all 7 lines):** L24 (`SLI vs objetivo`), L70 (`completeness vs latencia`), L443 (`acíclico vs ciclo`), L524 (`drift de schema vs lag`), L588 (`SLI vs SLO` and `RTO vs target` — 2 in same string), L1451 (`lag vs SLO`).
- **Rule:** Spanish typography requires the period: `vs.` (abbrev. of *versus*).
- **LT rule:** `PUNTO_EN_ABREVIATURAS` (7 matches).
- **Pedagogical impact:** minor; but consistency with the rest of the course's Spanish typography matters for the credibility of a "Master"-level course.

#### S46-005 — `postmortem` written as one word, 5 occurrences (Spanish convention)
- **Severity:** M (style)
- **Evidence:** L24 (`postmortem con acciones concretas`), L277 (`un postmortem puede responder`), L348 (`≥1 acción de postmortem`), L371 (`postmortem con acciones`), L554 (`en el postmortem de Huancayo`).
- **Rule:** Spanish convention (and RAE recommendation via *Diccionario panhispánico de dudas*) writes the Latin phrase as two words: **post mortem**. LT rule `ES_SIMPLE_REPLACE_MULTIWORDS_POSTMORTEM`.
- **Pedagogical impact:** minor, but the section uses the term 5 times as a key operational concept — consistency matters.

#### S46-006 — `re-procesar`, `re-ejecución`, `re-ejecuciones`, `re-procesa` written with hyphen, 5 occurrences
- **Severity:** M (orthography)
- **Evidence:** L153 (`re-ejecuciones`), L202 (`re-procesa`), L203 (`re-ejecución`), L497 (`re-procesar`), L955 (`re-procesar`).
- **Rule:** Per RAE, prefixes (`re-`, `pre-`, `anti-`, etc.) attached to words starting with `e` are written **without hyphen** and **without dieresis**: `reprocesar`, `reejecución`, `reejecuciones`, `reprocesa`. The hyphen is only required when the prefix is attached to a multi-word expression or to a proper noun (e.g., *re-escribir* → *reescribir*; *re-acción* → *reacción*). LT rule `NO_SEPARADO` (5 matches).
- **Pedagogical impact:** minor orthography, but at Master level a learner copying this style into a CV/portfolio will be marked down.

#### S46-007 — Missing comma before `pero` (independent clauses)
- **Severity:** M (punctuation)
- **Evidence:** L1011 hint: `Self-loop es necesario pero no suficiente: implementa Kahn o DFS…`
- **Rule:** When `pero` joins two independent clauses with subject on both sides, Spanish requires a comma before it: `Self-loop es necesario, pero no suficiente: …`. LT rule `COMMA_PERO`.
- **Pedagogical impact:** minor; only 1 instance, but in a `hint` learners read closely.

#### S46-008 — Gender inconsistency for `data` (LATAM feminine vs. English-tech masculine)
- **Severity:** M (consistency / agreement)
- **Evidence:**
  - L237: `Un data contract fija schema…` — masculine article
  - L347: `Un data SLO une un SLI…` — masculine article
  - L239: `late data silencioso` (within `el contrato de atenciones_diarias exige…`) — masculine adjective
  - LT flags: `AGREEMENT_DET_NOUN` × 2 (suggesting `Una data` / `Unas datas`) and `AGREEMENT_POSTPONED_ADJ` × 1 (suggesting `silenciosa`).
- **Rule:** In LATAM Spanish (the course's stated locale — see `jobRelevance` L14 "En equipos de plataforma y producto en LATAM"), `data` is treated as feminine (*la data*, *las datas*). RAE accepts both *el dato* / *la data* but the LATAM convention is feminine.
- **Pedagogical impact:** This is a *consistency* issue, not a hard error. The course must pick one convention and apply it. Recommendation: either (a) treat `data` as feminine throughout (matches LATAM Spanish) or (b) keep masculine but justify it as a calque from English "data" and stay consistent.

#### S46-009 — Anaphoric monotony: 8 of 9 callouts share the title "Contrato local"
- **Severity:** M (style / pedagogy)
- **Evidence:** All callout blocks L63, L105, L144, L195, L230, L268, L302, L340 use `title: "Contrato local"`. Only the last one (L371) breaks the pattern with `Cierre S46-T4-B: simulacro cumple RTO…`.
- **Pedagogical impact:** When learners scroll back to find a specific contract, every callout has the same header — they can't visually scan. The title carries no information about *which* contract.
- **Fix direction:** Title each callout by the subtopic id + a 2-3 word discriminator: e.g., "Contrato T1-A · Watermark", "Contrato T1-B · Exactly-once", "Contrato T2-A · DAG", etc.

#### S46-010 — "Caso CASO-HYO-046" pleonasm (3 occurrences in theory)
- **Severity:** M (style)
- **Evidence:** L32 (`Caso CASO-HYO-046 (Huancayo sintético): eventos…`), L114 (`Secuencia trabajada (CASO-HYO-046-T1B): (1) llega e1 →…`) — the second is fine; the first is the pleonasm. LT rule `SPANISH_WORD_REPEAT_RULE` flags it: "Posible error: repetición de una palabra" suggesting `Caso`.
- **Pedagogical impact:** Minor; "CASO" is already part of the acronym `CASO-HYO-046`, so prefixing with "Caso" is redundant. Say "Para `CASO-HYO-046`" instead.

#### S46-011 — Long sentences >32 words (7 instances across theory & iDo)
- **Severity:** M (cognitive load)
- **Evidence (sorted by length):**
  - L14 (jobRelevance, 41w): `En equipos de plataforma y producto en LATAM, ingeniería de datos y orquestación de producción convierte el job asíncrono…`
  - L30 (theory, 88w total but split into 3 sentences; longest sub-sentence ~38w): `Aquí ese job se vuelve pipeline de datos de producción: el mismo event_id/idempotency key alimenta dedup del sink; la cola at-least-once obliga a sinks idempotentes; el object store aloja particiones y artefactos de lineage.`
  - L32 (theory, sentence 1 is 40w): `Orden: T1 event-time/watermarks → T2 DAG tipado y checkpoint → T3 calidad/freshness → T4 re-runs y SLI/SLO.`
  - L112 (theory, 38w): `Es una cadena: la fuente suele ser at-least-once (reintentos), el motor guarda checkpoint del progreso, el sink es idempotente por clave de negocio (event_id), y el late data tiene política explícita (update / side-output / quarantine).`
  - L114 (theory, 38w): `Secuencia trabajada (CASO-HYO-046-T1B): (1) llega e1 → se escribe y se marca visto; (2) reintento de e1 → no reescribe; (3) e2 late con política update → actualiza la fila o va a side-output, nunca "mezcla silenciosa".`
  - L410 (iDo why, 37w): `Este demo muestra por qué 100 es LATE (wm−et=10 > gracia 5) y 105 aún entra por allowed_lateness — el trade-off completeness vs latencia de Flink/Beam en miniatura, base del gate CP-N4-B.`
  - L349 (theory, 34w): `Aplicación a CASO-HYO-046: el SLO de frescura del dashboard de atenciones es 0.99; un lag masivo baja el SLI a 0.80 y el RTO del replay a 90 min (>30).`
- **Rule of thumb:** For technical Spanish, WPS 15–32 is healthy. >32 is "long", >45 is "run-on". None of these are run-ons; all are at the upper bound.
- **Pedagogical impact:** Each long sentence packs multiple subordinations and technical nouns. Splitting them into 2 sentences would reduce cognitive load without losing precision.

### L — Polish

#### S46-012 — Tagline starts lowercase
- L8: `tagline: "pipeline incremental/backfillable sin duplicar, con lineage y alertas por dato tardío o contrato roto"` — starts lowercase. Stylistically OK for a tagline, but inconsistent with the rest of the course's headings (which are title-cased or sentence-cased with capital first letter).

#### S46-013 — `{a,b,c}` missing space after commas (typography)
- L311: `partición 2026-07-22 con keys {a,b,c}` → should be `{a, b, c}`. LT rule `COMMA_PARENTHESIS_WHITESPACE` (2 matches on same string — once per comma).

#### S46-014 — "de de" / "run run" / "Caso CASO" repeated-word patterns (false positives but worth flagging)
- L71: `Riesgos de DE (no de ER)` — LT flags `SPANISH_WORD_REPEAT_RULE` for "de de". This is actually "de DE" (de = "of", DE = "Data Engineering acronym"); it's correct but reads awkwardly. Reword as "Riesgos de ingeniería de datos (no de ER)" or "Riesgos DE (no de ER)" without the leading "de".
- L277: `el run run-hyo-46 materializa` — LT flags `ES_MULTITOKEN_SPELLING_TWO` for "run run". The first "run" is the English word ("the run run-hyo-46"), the second is the run_id. Reword as "el run `run-hyo-46` materializa" (backticks already in source) — the rendered version is fine because backticks make it visually distinct. The issue is only in raw text scanning.

#### S46-015 — MIT course code `6.100L` (no space before unit `L`)
- L2407: `MIT 6.100L`. LT rule `SPACE_UNITIES` suggests `6.100 L` (with narrow no-break space). This is a false positive: `6.100L` is the official MIT course code, not a quantity+unit. Leave as-is.

#### S46-016 — "Exactly-once compuesto" plural agreement
- L114, L437, L835, L890: `Exactly-once compuesto` (4 occurrences). LT rule `AGREEMENT_NUMERAL_PLURAL` suggests `compuestos`. The phrase is a fixed English compound ("exactly-once") used as a noun; the singular is defensible. Recommend keeping `compuesto` but documenting the choice in a style guide.

#### S46-017 — Sentence-initial lowercase fragments in `feedback` strings
- L890 (`E2: el adverso falla por contenido…`), L1097 (`E2: el adverso ya no es self-loop decorativo…`), L1328 (`E2: el adverso solapa 3–4 en half-open…`), L1708 (`E2: el adverso rompe varios eslabones a la vez…`), L2093 (`E2: el incidente se declara por evidencia numérica…`). These start with `E2:` which is a tag, not a sentence — fine pedagogically. Just noting for completeness.

#### S46-018 — "el late data" / "el late event" (article before English compound)
- L113, L114, L237: `late data` / `late event` are English compounds. The Spanish article is `el` (treating "data" as masculine mass noun like "el dato"). LT rule `EL_TILDE` flags `el late` as possible pronoun `él`. False positive but worth noting that the choice of `el` is consistent with treating *data* as masculine.

#### S46-019 — Repetitive WeDo instruction template (formulaic)
- All 24 weDo instructions start with `S46-T*-E* · …` and end with `Salida: imprime el valor de meets_contract.` (16 of 24) or `Salida: S46-T*-X PASS.` (8 of 24 — the E1 exercises). The template is pedagogically consistent but risks learners pattern-matching on the surface form rather than reading.
- This is a design decision, not a defect — keeping it noted for the comparative-quality dimension.

#### S46-020 — `learningOutcomes` mix English + Spanish nouns freely
- L17-L24 outcomes mix `event_time`, `watermark`, `allowed_lateness`, `exactly-once`, `at-least-once`, `DAG/asset graph`, `self-loops`, `data contracts`, `schema`, `owner`, `freshness SLO`, `lineage`, `merge`, `SLI`, `SLO`, `RTO`, `postmortem` without italicizing or quoting the English terms. This is acceptable in tech Spanish (and consistent with the rest of the course) but should be reviewed against the style guide for *Fundamentos* sections to ensure early learners aren't blindsided.

#### S46-021 — `CASO-HYO-046` uses uppercase acronym for "caso"
- Throughout: `CASO-HYO-046`. The word "caso" is a common noun; per RAE, acronyms are uppercase only for proper nouns or institutional names. The course's convention seems to be uppercase for synthetic case identifiers (so learners distinguish them from variable names). This is consistent across the file. Noted for the style guide.

#### S46-022 — `print-theater` and `falsa maestría` coined compounds
- L473: `Afirmar "DAG acíclico" sin detectar ciclos A→B→A es falsa maestría.`
- L1328: `mirar solo un booleano del record es print-theater de orquestación.`
- Both are vivid teacher-voice coinages. They work in context but are not standard Spanish; a glossary entry would help non-native Spanish speakers. (Section is *Master* level so the bar is higher.)

---

## 4. Meta-Leak Report

### ML-1 (CRITICAL) — GPU computing interactive editor served on a Data Engineering section page

**Exact leaked text (rendered, verbatim from live site `#gpu-computing`):**

> Pruébalo tú mismo — Editor interactivo en tu navegador — Este editor corre Python de verdad en tu browser (con Pyodide). Modifica el código, presiona Run, y experimenta. No necesitas instalar nada.
>
> **Practica conceptos de GPU (simulado)**
>
> ```python
> # Simulacion de conceptos de GPU computing
> import time
> import math
>
> # Simular multiplicacion de matrices: CPU vs GPU (conceptual)
> def matrix_multiply_cpu(A, B):
>     """Multiplicacion de matrices en CPU (O(n^3))."""
>     n = len(A)
>     C = [[0]*n for _ in range(n)]
>     for i in range(n):
>         for j in range(n):
>             for k in range(n):
>                 C[i][j] += A[i][k] * B[k][j]
>     return C
>
> # Simular conceptos de GPU
> print("=== GPU Computing Concepts ===")
>
> # 1. Paralelismo: CPU vs GPU
> print("\n1. Paralelismo:")
> print("  CPU: 4-16 cores, cada uno hace trabajo complejo")
> print("  GPU: 1000s de cores, cada uno hace trabajo simple")
> print("  Para matrices 5000x5000:")
> print("    CPU (1 core):  ~2.1s")
> print("    GPU (CuPy):    ~0.05s (42x speedup)")
>
> # 2. Memory hierarchy
> print("\n2. Jerarquia de memoria:")
> print("  CPU RAM:  16-64 GB, lento (100 GB/s)")
> print("  GPU VRAM: 8-80 GB, rapido (900 GB/s)")
> print("  Limitacion: datos deben caber en VRAM")
> print("  T4: 16GB | A100: 80GB | H100: 80GB")
>
> # 3. Simular benchmark de small matrix
> import random
> n = 100
> random.seed(42)
> A = [[random.random() for _ in range(n)] for _ in range(n)]
> B = [[random.random() for _ in range(n)] for _ in range(n)]
>
> t0 = time.time()
> C = matrix_multiply_cpu(A, B)
> t_cpu = time.time() - t0
> print(f"\n3. Benchmark (matriz {n}x{n}):")
> print(f"  CPU (Python puro): {t_cpu:.4f}s")
> print(f"  GPU estimado:      {t_cpu/42:.4f}s (42x speedup)")
> print(f"  NumPy estimado:    {t_cpu/100:.4f}s (100x vs Python puro)")
>
> # 4. Conceptos de vLLM
> print("\n4. vLLM (LLM serving):")
> print("  PagedAttention: gestiona KV cache como memoria virtual")
> print("  Permite batch de 100+ requests sin OOM")
> print("  3-5x mas rapido que HuggingFace transformers")
> ```

**Location in source:** `src/components/course/SectionView.tsx` lines 3500–3556, in a hardcoded lookup table indexed by section id. The key `'gpu-computing'` still maps to GPU content; the section content itself was rewritten (in `src/lib/course/sections/s46-gpu-computing.ts`) to data engineering.

**Additional leak signal (within the section file itself):**

- L4: `id: "gpu-computing",`
- L33: *"El foco es corrección de datos y operación del pipeline, no kernels de hardware."* — this disavowal *inside the prose* is the author's admission that the section was renamed away from GPU hardware.

**No other AI-to-developer comments, "moved from section X" notes, TODO/FIXME markers, design notes, or internal instructions were found inside the learner-facing prose** (verified by regex scan of all 28 paragraphs + all instruction/hint/feedback/why/description/question strings against TODO, FIXME, XXX, placeholder, TBD, `__\w+__`, "moved from", "pendiente", "borrador", "nota para el editor"). The two regex hits ("pendiente" in L694 feedback and "todo" inside "todos los endpoints" in L1010 instruction) are false positives from substring matching.

### ML-2 (MINOR) — File name `s46-gpu-computing.ts` no longer reflects content
Filename retained from prior scope; the file's content was rewritten to data engineering. Not visible to learners (it's a build-time artifact) but creates lasting confusion for maintainers and any tool that infers topic from filename.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do / Self-Check fidelity

**I Do (8 demos, `iDo.steps`)** — Strong. Each demo:
- Names the subtopic (`subtopicId: "S46-T*-X"`).
- Has a one-line `description` (imperative verb: "Clasifica…", "Aplica…", "Detecta…", "Valida…", "Evalúa…", "Construye…", "Merge…", "Compara…").
- Has runnable Python (≈8–15 lines).
- Has an explicit `why` rationale (1-2 sentences, naming the cognitive error it prevents and the downstream gate it serves: `CP-N4-B`, `S47 MLOps`).
- Code is well-commented in Spanish: e.g. `# Atención sintética Huancayo: max visto 115, lag 5 → wm 110`.

**We Do (24 exercises, `weDo.steps`)** — Strong. Each exercise:
- Three-tier pattern per subtopic: **E1** (guided: fix the predicate), **E2** (independent: three-route valid/invalid/missing), **E3** (transfer: CONTINUE / breach / incertidumbre).
- Each `instruction` opens with `S46-T*-E* ·` for scannability, then a complete contract (`Entrada`, `Regla`, `Salida`).
- Each exercise has `hint` (1-liner) and `hints` (2 long-form hints), `edgeCases` (3 specific failure modes), `tests` (the exact expected output string), `feedback` (the cognitive-error diagnosis), `starterCode` (deliberately defective Python), and `solutionCode` (corrected Python with identical structure so diff is minimal).
- The **deliberately defective starter** pattern is excellent worked-example pedagogy: learner must *find* the bug, not write from scratch.

**You Do (capstone)** — Strong. Single `youDo` block:
- 5 objectives (each starting with an infinitive verb matching the I Do demos).
- 7 requirements (constraints: stdlib only, no PII, no services, must implement 6 named functions).
- 1 `starterCode` scaffold (Python stub with 6 `def`s to complete + driver code that calls them).
- 1 `portfolioNote` ("Evidencia de CP-N4-B: … No conviertas el scaffold en checklist de booleans: las funciones deben calcular.") — excellent teacher-voice warning.
- 6-criterion weighted rubric (25/20/15/20/10/10).

**Self-Check (5 MCQs)** — Strong. Each question:
- Has 4 options, 1 correct (`correctIndex: 0..3`).
- Distractors target real misconceptions (e.g., Q4 distractor "siempre ON_TIME porque 100 < window_end típico" misreads the watermark as a window_end check).
- `explanation` (1-2 sentences) explicitly names the rule and the LT/RAE-aligned vocabulary (`QUARANTINE_DATASET`, `Event time ancla la corrección de negocio`).

**Verdict:** I Do / We Do / You Do / Self-Check fidelity is high. The section compares favorably to external gold-standard data-engineering courses (e.g., *Fundamentals of Data Engineering* by Reis & Housley; deeplearning.ai's Data Engineering Specialization) in terms of structural rigor. The synthetic `CASO-HYO-046` case keeps the learner in a single narrative thread across all 8 subtopics — strong connective tissue.

### 5.2 Connective tissue and narrative flow

- Each theory subtopic closes with `Aplicación a CASO-HYO-046: …` grounding the abstract contract in the Huancayo synthetic case.
- `iDo.intro` (L377) names the gate (`CP-N4-B`) and the contract style ("Cada demo **calcula** el contrato sobre fixtures de Huancayo sintético — no imprime etiquetas mágicas."). This is exactly the right anti-pattern call-out.
- `weDo.intro` (L611) names the E1→E2→E3 fail-closed pattern explicitly so learners see the meta-structure.
- `youDo.context` (L2215) and `youDo.portfolioNote` (L2302) tie back to `CP-N4-B` and the weDo vocabulary (`QUARANTINE_DATASET`, `OPEN_QUALITY_INCIDENT`).
- `jobRelevance` (L14) ties S45 → S46 → S47 (previous section → this section → next section), giving the learner the vertical story.

**Weak spots:**
- The 9 callouts all titled `Contrato local` (see S46-009) break visual scannability.
- The `Ruta de S46` intro paragraph (L29) is a 107-word dictionary dump (see S46-003) — a poor entry point for a 20-hour section.
- The `Pruébalo tú mismo` editor at the bottom breaks the narrative arc (see ML-1).

### 5.3 Cognitive load & progressive disclosure

- **Subtopic spine:** T1 (event-time/watermark) → T2 (DAG/checkpoint) → T3 (contracts/freshness/lineage) → T4 (incremental/SLI-SLO). Each T builds on the previous; the iDo `why` of T4 explicitly references T1 ("base del gate CP-N4-B") and T2 ("requisito real de Airflow/Dagster").
- **Exercise spine within each T:** E1 (single-route predicate) → E2 (three-route valid/invalid/missing) → E3 (transfer to operational vocabulary: CONTINUE / breach / incertidumbre). This is the *faded-worked-example* pattern from cognitive-load theory (Renkl & Atkinson).
- **Stack didáctico:** `stdlib` (dicts, sets, lists) to model contracts "al estilo Airflow/dbt/streaming sin cluster" (L33). Excellent decision: lets the learner reason about contracts without operational noise.
- **Cognitive load hot spots:** the 107-word L29 dictionary paragraph and the 88-word L30 "Puente" paragraph are the two highest-load points. Both are at the very start of the section (T0 reading) when the learner has the least context — worst place to front-load.

### 5.4 Exercise and exam quality

- **Starter defects are non-trivial:** E1 of T1-A inverts the predicate (PASS when event is out-of-window or too late). E1 of T1-B approves if lengths coincide (so [e1,e1,e2] passes because len==3 matches a 3-element sink) — a real bug. E1 of T2-A approves a 2-node cycle because the old predicate only rejects self-loops. The defects are pedagogically meaningful, not random.
- **Tests specify exact output strings:** e.g., `"PASS SIDE_OUTPUT_LATE_EVENT MISSING:allowed_lateness"`. This makes autograding trivial and forces learners to match the operational vocabulary precisely.
- **Feedback diagnoses the cognitive error:** e.g., L629 `"E1 guiado: el defecto invertía late/out-of-window como éxito. La regla alineada a Flink es watermark-as-progress + gracia, no un bound inferior inventado."` — names the misconception *and* the correct mental model in one sentence.
- **Rubric for capstone** is weighted (25/20/15/20/10/10 = 100%) and includes a *trade-offs* criterion (10%) — appropriate for Master level.

### 5.5 Consistency with the roadmap

- **Roadmap file:** `el_arte_de_python_roadmap_maestro_52_secciones.md` (repo root) lists S46 as Phase 3 Master. The section's `phase: 3` and `level: "Master"` match.
- **Predecessor:** S45 ("Cloud y colas — job asíncrono con artifact store, status, retry, DLQ e idempotency keys"). The L30 "Puente" paragraph and L14 `jobRelevance` correctly cite S45's vocabulary (`object store`, `colas`, `DLQ`, `idempotency keys`, `event_id`).
- **Successor:** S47 ("MLOps serving — Production Data/ML Platform: experiment tracking, serving, features"). The L14 `jobRelevance` correctly states that S47 will consume the versioned tables + lineage as feature/run sources.
- **Cross-section case:** `CASO-HYO-046` is introduced here and is referenced consistently across theory, iDo, weDo, youDo, and selfCheck. No prior section uses this case (S45 uses a different case, `CASO-HYO-045`-style identifiers, by analogy). Continuity is appropriate.

### 5.6 Comparison with best-in-class external materials

| Resource | Treatment of watermarks/late data | Treatment of exactly-once | Treatment of contracts |
|----------|-----------------------------------|---------------------------|------------------------|
| **Pyarcana S46** | Watermark = "aserción de progreso"; late policy with 4 buckets (drop/side-output/update/quarantine); synthetic Huancayo clinic case | "Exactly-once compuesto" = idempotent_sink + dedup + checkpoint + late_policy; explicitly demystifies broker "exactly-once" marketing | Schema + freshness + owner + SLO; fail-closed with QUARANTINE_DATASET; stdlib model |
| Apache Beam Programming Guide | Watermark = "estimate of progress"; allowed lateness | At-least-once + idempotent sink (same idea, more verbose) | Not directly covered |
| Flink docs (Event Time) | Watermark = "timestamp monotonic estimator" | Exactly-once via checkpoint barriers (broker-side) | Not directly covered |
| *Fundamentals of Data Engineering* (Reis & Housley) | Chapter 11: watermarks, triggers, accumulation | Chapter 12: exactly-once delivery semantics | Chapter 9: data contracts |
| deeplearning.ai Data Engineering Specialization | Module 3: streaming, watermarks | Module 4: exactly-once | Module 5: contracts |

**Pyarcana S46's distinct advantages:**
- Single synthetic case (`CASO-HYO-046`) across all 8 subtopics — external resources tend to switch examples per topic.
- Stdlib-only implementations (no cluster, no Kafka, no Spark) — lets the learner reason about contracts in 30 lines of Python rather than 300 lines of YAML/SQL.
- 24 deliberately-defective starters — external resources rarely offer this.

**Pyarcana S46's distinct disadvantages:**
- No actual streaming engine (Kafka/Flink/Beam) demo — the learner never sees a real watermark operator in action. (Mitigated by L33's explicit framing: "Stack didáctico: stdlib para modelar contratos… sin cluster".)
- No actual orchestrator (Airflow/Dagster) demo — same mitigation.
- The `Pruébalo tú mismo` editor undercuts everything by showing GPU content (ML-1).

---

## 6. Grammatical Improvements — Paragraph-by-Paragraph Rewriting (per tab)

This section applies the grammar subplan (Fernández-Huerta / INFLESZ / WPS / SPW + heuristics + LanguageTool `es`) to every learner-facing Spanish paragraph. For each: **before** (verbatim) → **after** (rewritten) → **metric change** → **LT rule satisfied**.

Metrics legend: WPS = words per sentence, SPW = syllables per word, FH = Fernández-Huerta (≥90 muy fácil, 70–89 normal, 50–69 bastante difícil, 30–49 difícil, <30 muy difícil). For Master-level technical Spanish, FH 60–80 is the healthy band.

### 6.1 Teoría — Ruta de S46 (paragraphs L29–L32)

#### L29 — Diccionario de la sección (107 w / 1 sentence / FH 38.0)

**Before:**
> **Diccionario de la sección** (léelo antes de T1). **Event time:** cuándo ocurrió el hecho (no el processing time del worker). **Watermark:** aserción de progreso en event time — watermark t declara que no se esperan más eventos con timestamp ≤ t. **Late data:** llega después de que el watermark superó su timestamp (política: drop / side-output / update / quarantine). **Exactly-once (compuesto):** end-to-end con sinks idempotentes + checkpoints, no un flag mágico del broker. **DAG/asset:** grafo de dependencias sin ciclos. **Backfill:** re-run acotado de rangos históricos. **Data contract:** schema + freshness + ownership. **Lineage:** de qué run/tabla salió cada fila. **Incremental load:** particiones/keys sin full rewrite ciego.

**After (split into a true bulleted list; each definition its own line):**

> **Diccionario de la sección** (léelo antes de T1).
>
> - **Event time:** cuándo ocurrió el hecho (no el *processing time* del worker).
> - **Watermark:** aserción de progreso en *event time*; un watermark `t` declara que no se esperan más eventos con timestamp ≤ `t`.
> - **Late data:** llega después de que el watermark superó su timestamp. Política: drop / side-output / update / quarantine.
> - **Exactly-once (compuesto):** end-to-end con sinks idempotentes + checkpoints; no es un flag mágico del broker.
> - **DAG/asset:** grafo de dependencias sin ciclos.
> - **Backfill:** *re-run* acotado de rangos históricos.
> - **Data contract:** schema + freshness + ownership.
> - **Lineage:** de qué *run* o tabla salió cada fila.
> - **Incremental load:** particiones / *keys* sin *full rewrite* ciego.

**Metric change:** 107 w / 1 sent → 9 definitions, each <25 w / each its own sentence. Mean WPS drops from 107 to ~14. FH improves from 38 (*difícil*) to ~75 (*normal*) per definition. Cognitive load reduced: learner can scan, bookmark, and memorize per-definition. LT no longer hits `long_sentence`.

#### L30 — Puente S45 → S46 → S47 (88 w / 3 sentences / FH 48.1)

**Before:**
> Puente S45 → S46 → S47. En S45 modelaste un **job asíncrono** con artifact store, status, retry, DLQ e idempotency keys. Aquí ese job se vuelve **pipeline de datos de producción**: el mismo event_id/idempotency key alimenta dedup del sink; la cola at-least-once obliga a sinks idempotentes; el object store aloja particiones y artefactos de lineage. En S47 (MLOps) esas tablas versionadas, el lineage y la freshness serán la base de features, experiment tracking y serving — un pipeline sin contratos no es un buen dataset de entrenamiento.

**Findings:** Long sentence 3 (38 w); semicolon density; one paragraph = 3 sentences.

**After (split sentence 3 into 2; replace semicolons with periods):**

> Puente S45 → S46 → S47. En S45 modelaste un **job asíncrono** con *artifact store*, *status*, *retry*, DLQ e *idempotency keys*. Aquí ese job se vuelve **pipeline de datos de producción**. El mismo `event_id` / *idempotency key* alimenta el *dedup* del sink. La cola *at-least-once* obliga a sinks idempotentes. El *object store* aloja particiones y artefactos de *lineage*. En S47 (MLOps) esas tablas versionadas, el *lineage* y la *freshness* serán la base de *features*, *experiment tracking* y *serving*. Un pipeline sin contratos no es un buen dataset de entrenamiento.

**Metric change:** 88 w / 3 sent (WPS 29.3) → 88 w / 7 sent (WPS 12.6). FH improves from 48 to ~70. Cognitive load reduced: each causal claim is now its own sentence.

#### L31 — Producto incremental (no change needed)

**Before (already clean):**
> Producto incremental: orquestación de producción. Entrada: eventos con event_time, schema, SLAs de frescura y keys de idempotencia. Salida: ventanas cerradas con política de late data, sink deduplicado, DAG acíclico y alertas de calidad. Error de promoción: late data silencioso, edges cíclicos, schema drift no detectado o segundo run que reescribe sin control.

**Findings:** `SLAs` → `SLA` (acronym plural rule, LT `SIGLAS`); `late data silencioso` → `late data silenciosa` if `data` is feminine (depends on style decision S46-008).

**After (applying both fixes, LATAM-feminine convention):**

> Producto incremental: orquestación de producción. Entrada: eventos con `event_time`, schema, **SLA** de frescura y *keys* de idempotencia. Salida: ventanas cerradas con política de *late data*, sink deduplicado, DAG acíclico y alertas de calidad. Error de promoción: *late data* **silenciosa**, edges cíclicos, *schema drift* no detectado o segundo *run* que reescribe sin control.

**Metric change:** LT `SIGLAS` × 1 and `AGREEMENT_POSTPONED_ADJ` × 1 resolved.

#### L32 — Orden (107 w / 4 sentences / FH 55.0)

**Before:**
> Orden: T1 event-time/watermarks → T2 DAG tipado y checkpoint → T3 calidad/freshness → T4 re-runs y SLI/SLO. El watermark y la late policy de T1 habilitan el merge incremental de T4 (solo filas ON_TIME/ALLOWED_LATE entran al sink); el DAG acíclico de T2 ordena qué asset se backfillea; los contratos de T3 deciden cuándo cuarentenar. Stack didáctico: **stdlib** (dicts, listas) para modelar contratos al estilo Airflow/dbt/streaming **sin cluster**. El foco es corrección de datos y operación del pipeline, no kernels de hardware. Caso `CASO-HYO-046` (Huancayo sintético): eventos de atención de una entidad ficticia; sin PII real ni servicios externos.

**Findings:** Sentence 2 is 40 w (long); 3 semicolons in one sentence; "Caso CASO" pleonasm (LT `SPANISH_WORD_REPEAT_RULE`).

**After:**

> Orden: T1 event-time/watermarks → T2 DAG tipado y *checkpoint* → T3 calidad/freshness → T4 *re-runs* y SLI/SLO. El watermark y la *late policy* de T1 habilitan el *merge* incremental de T4 (solo filas ON_TIME / ALLOWED_LATE entran al sink). El DAG acíclico de T2 ordena qué *asset* se backfillea. Los contratos de T3 deciden cuándo cuarentenar. Stack didáctico: **stdlib** (dicts, listas) para modelar contratos al estilo Airflow / dbt / streaming **sin cluster**. El foco es corrección de datos y operación del pipeline, no kernels de hardware. Para `CASO-HYO-046` (Huancayo sintético): eventos de atención de una entidad ficticia, sin PII real ni servicios externos.

**Metric change:** Sentence 2 split into 3 (40 w → 13 + 11 + 7 w). "Caso CASO" → "Para `CASO-HYO-046`". FH improves from 55 to ~70.

### 6.2 Teoría — T1-A (paragraphs L69–L71)

#### L69 — Event time / processing time (73 w / 4 sentences / FH 56.5)

**Before:**
> **Event time** es cuándo ocurrió el hecho en el mundo; **processing time** es el reloj del worker. Las **ventanas** agrupan por rangos de event time. El **watermark** no es solo un "atraso aceptado": es una aserción de progreso — watermark t afirma que no se esperan más eventos con timestamp ≤ t. Un evento es **late** si se evalúa cuando el watermark ya superó su timestamp; **allowed lateness** es gracia post-watermark (completeness vs latencia).

**Findings:** Semicolon at sentence 1 (could be period); sentence 3 is 27 w with em-dash; `vs` → `vs.` (LT `PUNTO_EN_ABREVIATURAS`); "watermark t" flagged by LT `SINGLE_CHARACTER` (false positive — `t` is a variable).

**After:**

> **Event time** es cuándo ocurrió el hecho en el mundo. **Processing time** es el reloj del worker. Las **ventanas** agrupan por rangos de *event time*. El **watermark** no es solo un "atraso aceptado": es una aserción de progreso. Un watermark `t` afirma que no se esperan más eventos con timestamp ≤ `t`. Un evento es **late** si se evalúa cuando el watermark ya superó su timestamp. **Allowed lateness** es gracia post-watermark (*completeness* vs. *latencia*).

**Metric change:** 73 w / 4 sent (WPS 18.3) → 73 w / 7 sent (WPS 10.4). `vs` → `vs.`. FH improves from 56 to ~75.

#### L70 — Contrato operativo de tiempo (74 w / 4 sentences / FH 56.3)

**Before:**
> Contrato operativo de tiempo. Entrada: lista de event_time, window_end, lag del watermark y allowed_lateness. Salida: watermark = max(event_time) − lag, y etiqueta por evento ∈ {ON_TIME, ALLOWED_LATE, LATE, OUT_OF_WINDOW}. Error: materializar una ventana sin política de late data o aceptar eventos fuera de ventana. Criterio de éxito: fixtures en orden, desorden y tardío producen las mismas etiquetas al re-ejecutar; la política (side-output / drop / update) queda documentada.

**Findings:** Sentence 5 (Criterio) is 22 w with semicolon; "re-ejecutar" → "reejecutar" (LT `NO_SEPARADO`); "vs" not present here; "y etiqueta por evento" is unclear (label per event).

**After:**

> Contrato operativo de tiempo. Entrada: lista de `event_time`, `window_end`, *lag* del watermark y `allowed_lateness`. Salida: `watermark = max(event_time) − lag`, y etiqueta por evento ∈ {ON_TIME, ALLOWED_LATE, LATE, OUT_OF_WINDOW}. Error: materializar una ventana sin política de *late data* o aceptar eventos fuera de ventana. Criterio de éxito: *fixtures* en orden, desorden y tardío producen las mismas etiquetas al **reejecutar**. La política (side-output / drop / update) queda documentada.

**Metric change:** Semicolon → period (split into 2 sentences); "re-ejecutar" → "reejecutar".

#### L71 — Aplicación CASO-HYO-046 (72 w / 3 sentences / FH 60.2)

**Before:**
> Aplicación a `CASO-HYO-046` (Huancayo sintético): una clínica ficticia emite eventos de atención con retraso de red. Un parte de las 09:00 puede llegar a las 09:40 de processing time; el pipeline debe decidir con event time, no con el reloj del worker. Riesgos de DE (no de ER): doble conteo si se reabre la ventana en silencio, o dashboards incompletos si se dropea late data sin side-output.

**Findings:** "Riesgos de DE" reads awkwardly (LT `SPANISH_WORD_REPEAT_RULE` false positive on "de DE"); "dropea" is an anglicism (acceptable in tech LATAM Spanish but worth a glossary entry).

**After:**

> Aplicación a `CASO-HYO-046` (Huancayo sintético): una clínica ficticia emite eventos de atención con retraso de red. Un parte de las 09:00 puede llegar a las 09:40 de *processing time*. El pipeline debe decidir con *event time*, no con el reloj del worker. Riesgos de ingeniería de datos (no de ER): doble conteo si se reabre la ventana en silencio, o dashboards incompletos si se **descarta** *late data* sin *side-output*.

**Metric change:** "de DE" → "de ingeniería de datos"; "dropea" → "descarta" (synonym); semicolon → period (split sentence 2 into 2).

### 6.3 Teoría — T1-B (paragraphs L112–L114)

#### L112 — Exactly-once (38 w / 2 sentences / FH 49.7)

**Before:**
> **Exactly-once end-to-end no es un switch del broker.** Es una cadena: la fuente suele ser at-least-once (reintentos), el motor guarda **checkpoint** del progreso, el **sink es idempotente** por clave de negocio (`event_id`), y el late data tiene política explícita (update / side-output / quarantine). Si falta un eslabón, el "exactly-once" del marketing se convierte en doble conteo en el dashboard de Huancayo.

**Findings:** Sentence 2 is 38 w (long); comma-separated list with "y" before last item (acceptable but dense).

**After:**

> **Exactly-once end-to-end no es un switch del broker.** Es una cadena: la fuente suele ser *at-least-once* (reintentos); el motor guarda **checkpoint** del progreso; el **sink es idempotente** por clave de negocio (`event_id`); y el *late data* tiene política explícita (update / side-output / quarantine). Si falta un eslabón, el "exactly-once" del marketing se convierte en doble conteo en el dashboard de Huancayo.

**Metric change:** Semicolons (already present) make the list scannable; no further split needed. (Alternative: convert to a 4-bullet list for even more clarity.)

#### L113 — Contrato de dedup y late policy (49 w / 3 sentences / FH 62.5)

**Before:**
> Contrato de dedup y late policy. Entrada: stream de `event_id` (con reintentos), store de claves vistas, checkpoint y `late_policy` ∈ {update, side-output, quarantine}. Salida: primer apply → True; retry del mismo id → False; late event no inventa una segunda fila de agregado. Error: sink sin clave o late_policy vacía. Criterio: `apply_once` + política documentada antes de abrir backfills.

**Findings:** "stream de `event_id`" (LT `PREP_VERB` false positive on "de event_id" — event_id parsed as verb); "primer apply → True" is telegraphic but acceptable in a contract spec.

**After (minor polish only):**

> Contrato de dedup y *late policy*. Entrada: *stream* de `event_id` (con reintentos), *store* de claves vistas, *checkpoint* y `late_policy` ∈ {update, side-output, quarantine}. Salida: primer *apply* → True; *retry* del mismo id → False; *late event* no inventa una segunda fila de agregado. Error: sink sin clave o `late_policy` vacía. Criterio: `apply_once` + política documentada antes de abrir backfills.

#### L114 — Secuencia trabajada (38 w / 1 sentence / FH 57.6)

**Before:**
> Secuencia trabajada (CASO-HYO-046-T1B): (1) llega e1 → se escribe y se marca visto; (2) reintento de e1 → no reescribe; (3) e2 late con política update → actualiza la fila o va a side-output, nunca "mezcla silenciosa". Exactly-once compuesto = idempotent_sink + dedup + checkpoint + late_policy, no magia del middleware.

**Findings:** 1 long sentence (38 w); numbered list embedded in prose.

**After (convert numbered list to actual list):**

> Secuencia trabajada (`CASO-HYO-046-T1B`):
>
> 1. Llega e1 → se escribe y se marca visto.
> 2. Reintento de e1 → no reescribe.
> 3. e2 *late* con política *update* → actualiza la fila o va a *side-output*; nunca "mezcla silenciosa".
>
> Exactly-once compuesto = idempotent_sink + dedup + checkpoint + late_policy; no magia del *middleware*.

**Metric change:** 38 w / 1 sent → 38 w / 4 sent (WPS ~9). Numbered list is now scannable.

### 6.4 Teoría — T2-A (paragraphs L151–L153)

#### L151 — DAG / asset graph (no change needed, already 3 short sentences)

#### L152 — Contrato operativo de orquestación (47 w / 4 sentences / FH 60.3)

**Findings:** "lista ancestros sin solapes" (LT `AGREEMENT_ADJ_NOUN` false positive — "lista" is verb here). No real issues.

#### L153 — Aplicación CASO-HYO-046

**Before:**
> Aplicación a `CASO-HYO-046`: assets sintéticos raw → clean → report de atenciones en Huancayo. Si alguien cierra clean → raw "para refrescar", el ciclo rompe el plan de backfill. Riesgo DE: re-ejecuciones infinitas o materialización parcial sin lineage claro del asset roto.

**Findings:** "Riesgo DE" (same as L71 — consider "Riesgos de ingeniería de datos"); "re-ejecuciones" → "reejecuciones" (LT `NO_SEPARADO`).

**After:**

> Aplicación a `CASO-HYO-046`: assets sintéticos raw → clean → report de atenciones en Huancayo. Si alguien cierra clean → raw "para refrescar", el ciclo rompe el plan de backfill. Riesgo de ingeniería de datos: **reejecuciones** infinitas o materialización parcial sin *lineage* claro del *asset* roto.

### 6.5 Teoría — T2-B (paragraphs L202–L204)

#### L202 — Schedule / backfill / checkpoint

**Findings:** "re-procesa" → "reprocesa" (LT `NO_SEPARADO`).

**After (replace hyphenated form):**

> El **schedule** dispara corridas; no garantiza corrección ni unicidad. Un **backfill** **reprocesa** un intervalo histórico y debe parametrizar start/end sin solaparse con otra corrida viva. El **checkpoint** permite reanudar desde un estado consistente tras un fallo — reanudar "desde el inicio del día" sin control es un *double-write* disfrazado.

#### L203 — Contrato operativo de re-ejecución

**Findings:** "re-ejecución" → "reejecución" (LT `NO_SEPARADO`); `[start, end)` triggers LT `ES_UNPAIRED_BRACKETS` (false positive — half-open interval notation is correct); "resume = checkpoint" (LT `PREP_VERB` false positive — "resume" parsed as Spanish verb).

**After:**

> Contrato operativo de **reejecución**. Entrada: intervalos `[start, end)`, flag de solape, *checkpoint id* y `resume_from`. Salida: plan de backfill ordenado, sin solape, con `resume = checkpoint`. Error: dos backfills que cubren el mismo `event_time` o `resume` distinto del *checkpoint*. Criterio: *re-run* acotado produce el mismo sink que la corrida original (idempotencia de T1/T4).

#### L204 — Aplicación CASO-HYO-046

**Findings:** `[09:00, 12:00)` triggers LT `ES_UNPAIRED_BRACKETS` (false positive); "re-cómputo" → "recómputo" (LT `NO_SEPARADO`, not flagged here but should be consistent with RAE rule).

**After:**

> Aplicación a `CASO-HYO-046`: un viernes se pierden 3 horas de eventos de clínica; el backfill cubre `[09:00, 12:00)` sin solaparse con el job horario de las 12:00. Riesgo de ingeniería de datos: **recómputo** y corrupción de particiones si dos *writers* tocan la misma *key*.

### 6.6 Teoría — T3-A (paragraphs L237–L239)

#### L237 — Data contract

**Findings:** "Un data contract" → "Una data contract" or stay with "Un" but justify (LT `AGREEMENT_DET_NOUN`); "vs" not present.

**After (LATAM-feminine convention):**

> Una **data contract** fija schema (campos y tipos), semántica (qué significa cada columna), **owner** y, por separado, un **SLO de freshness** (cuánto atraso máximo tolera el consumidor). Schema y freshness se monitorean distinto: un schema correcto con dato de ayer sigue siendo un *breach* de frescura.

#### L238 — Contrato operativo de calidad

No change needed.

#### L239 — Aplicación CASO-HYO-046

**Findings:** "el contrato de `atenciones_diarias` exige `case_id:str`" — backticks already in source, good. No real issues.

### 6.7 Teoría — T3-B (paragraphs L275–L277)

#### L275 — Lineage / observability

No change needed.

#### L276 — Contrato operativo de trazabilidad

No change needed.

#### L277 — Aplicación CASO-HYO-046

**Findings:** "el run `run-hyo-46` materializa" — LT `ES_MULTITOKEN_SPELLING_TWO` false positive (first "run" is English word, second is run_id). Backticks already in source.

**After (minor polish — drop the first "run" since `run-hyo-46` is self-describing):**

> Aplicación a `CASO-HYO-046`: el *run* `run-hyo-46` materializa `clean-v3` desde `raw-v2` con `null_rate` 0.01 y *owner* `analytics`. Si `null_rate` sube a 0.3, se abre `OPEN_QUALITY_INCIDENT` con el `run_id` en el ticket. Riesgo de ingeniería de datos: "arreglar a ciegas" sin saber qué *upstream* cambió.

### 6.8 Teoría — T4-A (paragraphs L309–L311)

#### L309 — Partitions / incremental loads

No change needed (good WPS, clear).

#### L310 — Contrato operativo de particiones

No change needed.

#### L311 — Aplicación CASO-HYO-046

**Findings:** `{a,b,c}` → `{a, b, c}` (LT `COMMA_PARENTHESIS_WHITESPACE` × 2).

**After:**

> Aplicación a `CASO-HYO-046`: partición `2026-07-22` con *keys* `{a, b, c}`. El job horario reintenta tras un *timeout* de red: el *merge* debe reportar 0 cambios en la segunda corrida. Riesgo de ingeniería de datos: costos de *storage* y conteos inflados en el reporte diario.

### 6.9 Teoría — T4-B (paragraphs L347–L349)

#### L347 — Data SLO / SLI / RTO

**Findings:** "Un data SLO" → "Una data SLO" (LATAM-feminine, consistent with L237 fix); "postmortem" → "post mortem" (LT `ES_SIMPLE_REPLACE_MULTIWORDS_POSTMORTEM`).

**After:**

> Una **data SLO** une un **SLI** (indicador medido, p. ej. proporción de particiones frescas) con un objetivo y una ventana. Un incidente de datos protege consumidores (dejar de publicar basura), recupera particiones y documenta causa + prevención. El RTO mide cuánto tarda la recuperación — un *runbook* sin dueño es teatro.

#### L348 — Contrato operativo de operación

**Findings:** "postmortem" → "post mortem" (LT).

**After:**

> Contrato operativo de operación. Entrada: `freshness_sli`, `freshness_slo`, `rto_minutes`, `target_rto`, `postmortem_actions` y *owner*. Salida: PASS si SLI ≥ SLO, RTO ≤ target, ≥1 acción de **post mortem** y *owner*. Error: SLI bajo o RTO excedido → declarar incidente y activar *runbook*. Criterio: simulacro medido, no promesa en README.

#### L349 — Aplicación CASO-HYO-046

**Findings:** Long sentence (34 w); "0.99" vs "0.80" vs "90 min (>30)" — multiple numerals in one sentence.

**After (split into 2 sentences):**

> Aplicación a `CASO-HYO-046`: el SLO de frescura del dashboard de atenciones es 0.99. Un lag masivo baja el SLI a 0.80 y el RTO del *replay* a 90 min (>30). Se declara `DECLARE_DATA_INCIDENT` y se activa el *runbook* de *recovery*. Riesgo de ingeniería de datos: consumidores de ML (S47) entrenan sobre datos "vivos" que en realidad están congelados.

### 6.10 I Do (Yo hago) — intro + 8 demos

#### L377 — iDo.intro (1 sentence, 32 w)

**Findings:** 32 w (boundary of "long"). No real issues. Could split for clarity but acceptable.

**After (optional split):**

> Te muestro 8 demos de S46 (Ingeniería de datos y orquestación de producción) alineadas a `CP-N4-B`. Cada demo **calcula** el contrato sobre *fixtures* de Huancayo sintético — no imprime etiquetas mágicas.

#### L383 / L416 / L443 / L479 / L503 / L530 / L560 / L588 — iDo descriptions (8 strings)

**Findings:** All are imperative 1-liners (~13 w each). Several lack terminal period (LT `PUNTO_EN_ABREVIATURAS` does not flag because they don't end in abbreviation, but my heuristic flags `missing_terminal_punct`). These are UI labels, not full sentences — the missing period is intentional. No change.

**One exception — L588** has `vs` twice (LT `PUNTO_EN_ABREVIATURAS` × 2):

**Before:** `Compara SLI vs SLO y RTO vs target para decidir incidente`
**After:** `Compara SLI vs. SLO y RTO vs. target para decidir incidente`

#### L410 / L437 / L473 / L497 / L524 / L554 / L582 / L606 — iDo `why` rationales (8 strings)

These are 1-3 sentence rationales, ~30-40 w each. Mostly well-formed. Specific fixes:

- **L410** (37 w, 1 sentence): long. Split:
  > **Before:** Sin un timeline calculado, el watermark es solo vocabulario. Este demo muestra por qué 100 es LATE (wm−et=10 > gracia 5) y 105 aún entra por allowed_lateness — el trade-off completeness vs latencia de Flink/Beam en miniatura, base del gate CP-N4-B.
  >
  > **After:** Sin un *timeline* calculado, el watermark es solo vocabulario. Este demo muestra por qué 100 es LATE (`wm − et = 10 > gracia 5`) y por qué 105 aún entra por `allowed_lateness`. Es el *trade-off completeness* vs. *latencia* de Flink/Beam en miniatura, base del gate `CP-N4-B`.

- **L437:** "el late event" — LT `UN_SUSTANTIVO` false positive. No change needed.

- **L473:** "falsa maestría" (coined phrase, see S46-022). Keep but add glossary entry elsewhere.

- **L497:** "re-procesar" → "reprocesar" (LT `NO_SEPARADO`).
  > **After:** Un *schedule* horario no autoriza a **reprocesar** el mismo rango dos veces. El demo calcula solape y alinea `resume` con *checkpoint* — sin eso, el backfill de las 3 h perdidas corrompe la partición viva.

- **L524:** "drift de schema vs lag" → "drift de schema vs. lag" (LT `PUNTO_EN_ABREVIATURAS`).
  > **After:** El contrato falla cerrado por dos motivos distintos (*drift* de schema vs. *lag*). Separarlos evita "arreglar *freshness*" cuando el tipo de columna ya está roto — patrón dbt / Great Expectations en stdlib.

- **L554:** "postmortem" → "post mortem" (LT).
  > **After:** Lineage no es un *print* de listas sueltas: es un *facet* run / inputs / outputs / métricas / owner. Solo con eso un incidente de calidad es reconstruible en el **post mortem** de Huancayo.

- **L606:** "vocabulario SRE que el self-check y el youDo reutilizan" — fine.

### 6.11 We Do (Hacemos juntos) — intro + 24 exercises

#### L611 — weDo.intro

**Findings:** 56 w / 3 sentences. Long but acceptable for a section opener. "T*" abbreviation is dense.

**After (split sentence 2):**

> S46 · Laboratorio de pipeline production-grade: 24 retos locales sobre `CASO-HYO-046`. Cada familia T* reutiliza la forma fail-closed E1 (predicado de dominio) → E2 (valid/invalid/missing) → E3 (CONTINUE / breach / incertidumbre). El **defecto** es de ingeniería de datos real: watermark/late, exactly-once, ciclo Kahn, solape de backfill calculado, schema+freshness, lineage, merge idempotente, SLI/SLO. Los *tokens* de acción son el protocolo operativo de la sección (no *enums* internos vacíos).

#### L617–L2147 — 24 weDo.instructions

All 24 follow the same template: `S46-T*-E* · {contract}. Salida: {expected output}.` Most are 25-35 w (acceptable). Specific fixes:

- **L1011 (hint):** "Self-loop es necesario pero no suficiente" → add comma before `pero`:
  > **After:** Self-loop es necesario**,** pero no suficiente: implementa Kahn o DFS para rechazar raw→clean→raw.

- **L1255 (instruction):** `[start, end)` (LT false positive, keep), "re-" prefix not present. No change needed beyond what's already there.

- **L1316 (instruction):** `[[1,4],[3,6]]` — add spaces after commas for typography:
  > **After:** Adverso: intervals `[[1, 4], [3, 6]]` (solape en 3–4) y `resume_from='start'`.

- **L1451 (hint):** "lag vs SLO" → "lag vs. SLO".

- All `feedback` strings are 1-3 sentences, well-formed. No further changes beyond what's listed in §6.10 for shared patterns.

### 6.12 You Do (Tú haces) — capstone

#### L2214 — title (no change)

#### L2215 — context

**Findings:** 80 w / 3 sentences. Long but acceptable for a capstone brief. `QUARANTINE_DATASET` and `OPEN_QUALITY_INCIDENT` already backticked.

#### L2216–L2221 — objectives (5 strings, all start with infinitive verb — no change)

#### L2222–L2230 — requirements (7 strings — no change)

#### L2302 — portfolioNote

**Findings:** 41 w / 2 sentences. Fine.

#### L2303–L2310 — rubric (6 criteria — no change)

### 6.13 Self-Check (Autocheck) — 5 MCQs

#### L2315 — Q1 (no change, well-formed, includes `¿…?` marks correctly)

#### L2321 — Q2 (no change)

#### L2327 — Q3 (no change)

#### L2333 — Q4 (no change; "Watermark t = 110" — `t` is variable, LT `SINGLE_CHARACTER` false positive)

#### L2339 — Q5 (no change)

**All 5 questions use `¿…?` correctly.** This is a notable strength — Spanish inverted question marks are properly paired throughout.

### 6.14 Callouts (9 strings)

#### S46-009 fix — Title each callout by subtopic

**Before (all 9 share `title: "Contrato local"`):**

| Line | Subtopic | Suggested new title |
|------|----------|---------------------|
| L63  | S46-T1-A gate | `Contrato T1-A · Gate de promoción` |
| L105 | S46-T1-B | `Contrato T1-B · Verifica riesgo residual` |
| L144 | S46-T2-A | `Contrato T2-A · Fail-closed y salida esperada` |
| L195 | S46-T2-B | `Contrato T2-B · Fixture y evidencia local` |
| L230 | S46-T3-A | `Contrato T3-A · Documenta breach y recovery` |
| L268 | S46-T3-B | `Contrato T3-B · Evidencia reproducible` |
| L302 | S46-T4-A | `Contrato T4-A · Rollback y evidencia` |
| L340 | S46-T4-B | `Contrato T4-B · Riesgo residual y límites del lab` |
| L371 | S46-T4-B close | (already different: `Cierre S46-T4-B: simulacro cumple RTO…`) — keep |

**Pedagogical impact:** Each callout becomes scannable; learner can jump back to the right contract by subtopic.

### 6.15 Resources (18 labels + notes)

#### S46-004 fix — `vs` → `vs.` (already applied to L588 above; not present in resources)

#### S46-015 — `MIT 6.100L` (no change; official course code, LT `SPACE_UNITIES` false positive)

All 18 resource labels are short noun phrases (1-5 words). No grammar issues.

---

## 7. Proposed GitHub-style Diffs

Diffs are organized by issue. **Do not apply automatically — these are proposals for the Fixer agent.**

### Diff 1 — Fix the meta-leak in `SectionView.tsx` (S46-001 / ML-1)

Replace the GPU computing editor content with a data-engineering starter that matches the section's actual scope. The replacement should mirror the section's contract-driven style: a small stdlib pipeline with watermark, dedup, contract check, lineage facet.

```diff
--- a/src/components/course/SectionView.tsx
+++ b/src/components/course/SectionView.tsx
@@ -3500,16 +3500,40 @@ const INTERACTIVE_EDITORS: Record<string, { title: string; code: string; hint: s
     'gpu-computing': {
-      title: 'Practica conceptos de GPU (simulado)',
-      code: `# Simulacion de conceptos de GPU computing
-import time
-import math
-
-# Simular multiplicacion de matrices: CPU vs GPU (conceptual)
-def matrix_multiply_cpu(A, B):
-    """Multiplicacion de matrices en CPU (O(n^3))."""
-    n = len(A)
-    C = [[0]*n for _ in range(n)]
-    for i in range(n):
-        for j in range(n):
-            for k in range(n):
-                C[i][j] += A[i][k] * B[k][j]
-    return C
-
-# Simular conceptos de GPU
-print("=== GPU Computing Concepts ===")
-
-# 1. Paralelismo: CPU vs GPU
-print("\\n1. Paralelismo:")
-print("  CPU: 4-16 cores, cada uno hace trabajo complejo")
-print("  GPU: 1000s de cores, cada uno hace trabajo simple")
-print("  Para matrices 5000x5000:")
-print("    CPU (1 core):  ~2.1s")
-print("    GPU (CuPy):    ~0.05s (42x speedup)")
-
-# 2. Memory hierarchy
-print("\\n2. Jerarquia de memoria:")
-print("  CPU RAM:  16-64 GB, lento (100 GB/s)")
-print("  GPU VRAM: 8-80 GB, rapido (900 GB/s)")
-print("  Limitacion: datos deben caber en VRAM")
-print("  T4: 16GB | A100: 80GB | H100: 80GB")
-
-# 3. Simular benchmark de small matrix
-import random
-n = 100
-random.seed(42)
-A = [[random.random() for _ in range(n)] for _ in range(n)]
-B = [[random.random() for _ in range(n)] for _ in range(n)]
-
-t0 = time.time()
-C = matrix_multiply_cpu(A, B)
-t_cpu = time.time() - t0
-print(f"\\n3. Benchmark (matriz {n}x{n}):")
-print(f"  CPU (Python puro): {t_cpu:.4f}s")
-print(f"  GPU estimado:      {t_cpu/42:.4f}s (42x speedup)")
-print(f"  NumPy estimado:    {t_cpu/100:.4f}s (100x vs Python puro)")
-
-# 4. Conceptos de vLLM
-print("\\n4. vLLM (LLM serving):")
-print("  PagedAttention: gestiona KV cache como memoria virtual")
-print("  Permite batch de 100+ requests sin OOM")
-print("  3-5x mas rapido que HuggingFace transformers`,
-      hint: 'Cambia n a 200 y observa como aumenta el tiempo cuadraticamente',
+      title: 'Practica el pipeline de Huancayo (simulado)',
+      code: `# CASO-HYO-046 · pipeline de datos en miniatura (stdlib only)
+# Eventos sinteticos de atencion en Huancayo. Sin PII, sin servicios externos.
+
+EVENTS = [
+    {"event_id": "e1", "event_time": 100, "payload": 1},
+    {"event_id": "e1", "event_time": 100, "payload": 1},  # reintento
+    {"event_id": "e2", "event_time": 80,  "payload": 2},   # late vs watermark
+    {"event_id": "e3", "event_time": 115, "payload": 3},
+]
+WINDOW_END = 120
+WATERMARK = 100
+ALLOWED_LATENESS = 15
+
+def classify(et: int) -> str:
+    """Etiqueta un evento segun watermark y allowed_lateness."""
+    if et > WINDOW_END:
+        return "OUT_OF_WINDOW"
+    if et > WATERMARK:
+        return "ON_TIME"
+    if WATERMARK - et <= ALLOWED_LATENESS:
+        return "ALLOWED_LATE"
+    return "LATE"
+
+def merge_incremental(target: dict, rows: list) -> int:
+    """Upsert por event_id. Devuelve el numero de filas cambiadas."""
+    changes = 0
+    for row in rows:
+        k = row["event_id"]
+        if target.get(k) != row:
+            target[k] = row
+            changes += 1
+    return changes
+
+# 1. Clasificar
+labels = [(e["event_id"], classify(e["event_time"])) for e in EVENTS]
+print("labels:", labels)
+
+# 2. Solo ON_TIME / ALLOWED_LATE entran al sink (late va a side-output)
+accepted = [e for e, lab in zip(EVENTS, labels) if lab[1] in {"ON_TIME", "ALLOWED_LATE"}]
+
+# 3. Dedup de reintentos (mismo event_id entra una sola vez)
+seen = set()
+unique_batch = []
+for row in accepted:
+    if row["event_id"] in seen:
+        continue
+    seen.add(row["event_id"])
+    unique_batch.append(row)
+
+# 4. Merge idempotente: la segunda corrida del mismo batch debe dar 0 cambios
+sink = {}
+c1 = merge_incremental(sink, unique_batch)
+c2 = merge_incremental(sink, unique_batch)
+print(f"first_changes={c1}  second_changes={c2}  no_dup_rerun={c2 == 0}")`,
+      hint: 'Cambia WATERMARK a 90 y observa cuantos eventos pasan a LATE',
     },
```

### Diff 2 — Rename the section id and file (S46-002 / ML-2)

Rename the file `s46-gpu-computing.ts` → `s46-data-engineering-production.ts` and change the `id` from `"gpu-computing"` to `"data-engineering-production"`. Update the import in `src/lib/course/index.ts` and the editor key in `SectionView.tsx`.

```diff
--- a/src/lib/course/sections/s46-gpu-computing.ts
+++ b/src/lib/course/sections/s46-data-engineering-production.ts
@@ -1,7 +1,7 @@
 import type { CourseSection } from '../../types'

 export const section46: CourseSection = {
-  id: "gpu-computing",
+  id: "data-engineering-production",
   index: 46,
   title: "Ingeniería de datos y orquestación de producción",
   shortTitle: "Data eng producción",
```

```diff
--- a/src/lib/course/index.ts
+++ b/src/lib/course/index.ts
@@ -50,1 +50,1 @@
-import { section46 } from './sections/s46-gpu-computing'
+import { section46 } from './sections/s46-data-engineering-production'
```

```diff
--- a/src/components/course/SectionView.tsx
+++ b/src/components/course/SectionView.tsx
@@ -3500,1 +3500,1 @@
-    'gpu-computing': {
+    'data-engineering-production': {
```

> ⚠️ **Migration note:** Renaming the section id will break any persisted learner progress (localStorage keys indexed by section id). Coordinate with the front-end team to migrate keys or accept a one-time progress reset for this section.

### Diff 3 — Fix `vs` → `vs.` (S46-004, 7 occurrences)

```diff
--- a/src/lib/course/sections/s46-gpu-computing.ts
+++ b/src/lib/course/sections/s46-gpu-computing.ts
@@ -24 +24 @@
-    { text: "Operar data SLOs (SLI vs objetivo), RTO de recuperación y postmortem con acciones concretas" },
+    { text: "Operar data SLOs (SLI vs. objetivo), RTO de recuperación y post mortem con acciones concretas" },
@@ -70 +70 @@
-        "El **watermark** no es solo un "atraso aceptado": es una aserción de progreso — watermark t afirma que no se esperan más eventos con timestamp ≤ t. Un evento es **late** si se evalúa cuando el watermark ya superó su timestamp; **allowed lateness** es gracia post-watermark (completeness vs latencia).",
+        "El **watermark** no es solo un "atraso aceptado": es una aserción de progreso — watermark t afirma que no se esperan más eventos con timestamp ≤ t. Un evento es **late** si se evalúa cuando el watermark ya superó su timestamp; **allowed lateness** es gracia post-watermark (completeness vs. latencia).",
@@ -443 +443 @@
-        description: "Detecta grafo acíclico vs ciclo raw→clean→raw con Kahn",
+        description: "Detecta grafo acíclico vs. ciclo raw→clean→raw con Kahn",
@@ -524 +524 @@
-        why: "El contrato falla cerrado por dos motivos distintos (drift de schema vs lag). Separarlos evita "arreglar freshness" cuando el tipo de columna ya está roto — patrón dbt/Great Expectations en stdlib.",
+        why: "El contrato falla cerrado por dos motivos distintos (drift de schema vs. lag). Separarlos evita "arreglar freshness" cuando el tipo de columna ya está roto — patrón dbt/Great Expectations en stdlib.",
@@ -588 +588 @@
-        description: "Compara SLI vs SLO y RTO vs target para decidir incidente",
+        description: "Compara SLI vs. SLO y RTO vs. target para decidir incidente",
@@ -1451 +1451 @@
-        hint: "Igualdad de dicts de schema (tipos) y comparación numérica de lag vs SLO.",
+        hint: "Igualdad de dicts de schema (tipos) y comparación numérica de lag vs. SLO.",
```

### Diff 4 — Fix `postmortem` → `post mortem` (S46-005, 5 occurrences)

```diff
@@ -24 @@ (already covered by Diff 3 first hunk)
@@ -277 +277 @@
-        "Aplicación a `CASO-HYO-046`: el run `run-hyo-46` materializa `clean-v3` desde `raw-v2` con null_rate 0.01 y owner analytics. Si null_rate sube a 0.3, se abre `OPEN_QUALITY_INCIDENT` con el run_id en el ticket. Riesgo DE: "arreglar a ciegas" sin saber qué upstream cambió.",
+        "Aplicación a `CASO-HYO-046`: el run `run-hyo-46` materializa `clean-v3` desde `raw-v2` con null_rate 0.01 y owner analytics. Si null_rate sube a 0.3, se abre `OPEN_QUALITY_INCIDENT` con el run_id en el ticket. Riesgo de ingeniería de datos: "arreglar a ciegas" sin saber qué upstream cambió.",
@@ -348 +348 @@
-        "Contrato operativo de operación. Entrada: freshness_sli, freshness_slo, rto_minutes, target_rto, postmortem_actions y owner. Salida: PASS si SLI ≥ SLO, RTO ≤ target, ≥1 acción de postmortem y owner. Error: SLI bajo o RTO excedido → declarar incidente y activar runbook. Criterio: simulacro medido, no promesa en README.",
+        "Contrato operativo de operación. Entrada: freshness_sli, freshness_slo, rto_minutes, target_rto, postmortem_actions y owner. Salida: PASS si SLI ≥ SLO, RTO ≤ target, ≥1 acción de post mortem y owner. Error: SLI bajo o RTO excedido → declarar incidente y activar runbook. Criterio: simulacro medido, no promesa en README.",
@@ -371 +371 @@
-          "Cierre S46-T4-B: simulacro cumple RTO y postmortem con acciones. Breach → `DECLARE_DATA_INCIDENT`; sin owner → `ACTIVATE_RECOVERY_RUNBOOK`.",
+          "Cierre S46-T4-B: simulacro cumple RTO y post mortem con acciones. Breach → `DECLARE_DATA_INCIDENT`; sin owner → `ACTIVATE_RECOVERY_RUNBOOK`.",
@@ -554 +554 @@
-        why: "Lineage no es un print de listas sueltas: es un facet run/inputs/outputs/métricas/owner. Solo con eso un incidente de calidad es reconstruible en el postmortem de Huancayo.",
+        why: "Lineage no es un print de listas sueltas: es un facet run/inputs/outputs/métricas/owner. Solo con eso un incidente de calidad es reconstruible en el post mortem de Huancayo.",
```

### Diff 5 — Fix `re-` prefix hyphenation (S46-006, 5 occurrences)

```diff
@@ -153 +153 @@
-        "Aplicación a `CASO-HYO-046`: assets sintéticos raw → clean → report de atenciones en Huancayo. Si alguien cierra clean → raw "para refrescar", el ciclo rompe el plan de backfill. Riesgo DE: re-ejecuciones infinitas o materialización parcial sin lineage claro del asset roto.",
+        "Aplicación a `CASO-HYO-046`: assets sintéticos raw → clean → report de atenciones en Huancayo. Si alguien cierra clean → raw "para refrescar", el ciclo rompe el plan de backfill. Riesgo de ingeniería de datos: reejecuciones infinitas o materialización parcial sin lineage claro del asset roto.",
@@ -202 +202 @@
-        "El **schedule** dispara corridas; no garantiza corrección ni unicidad. Un **backfill** re-procesa un intervalo histórico y debe parametrizar start/end sin solaparse con otra corrida viva. El **checkpoint** permite reanudar desde un estado consistente tras un fallo — reanudar "desde el inicio del día" sin control es un double-write disfrazado.",
+        "El **schedule** dispara corridas; no garantiza corrección ni unicidad. Un **backfill** reprocesa un intervalo histórico y debe parametrizar start/end sin solaparse con otra corrida viva. El **checkpoint** permite reanudar desde un estado consistente tras un fallo — reanudar "desde el inicio del día" sin control es un double-write disfrazado.",
@@ -203 +203 @@
-        "Contrato operativo de re-ejecución. Entrada: intervalos [start, end), flag de solape, checkpoint id y `resume_from`. Salida: plan de backfill ordenado, sin solape, con resume = checkpoint. Error: dos backfills que cubren el mismo event_time o resume distinto del checkpoint. Criterio: re-run acotado produce el mismo sink que la corrida original (idempotencia de T1/T4).",
+        "Contrato operativo de reejecución. Entrada: intervalos [start, end), flag de solape, checkpoint id y `resume_from`. Salida: plan de backfill ordenado, sin solape, con resume = checkpoint. Error: dos backfills que cubren el mismo event_time o resume distinto del checkpoint. Criterio: re-run acotado produce el mismo sink que la corrida original (idempotencia de T1/T4).",
@@ -497 +497 @@
-        why: "Un schedule horario no autoriza a re-procesar el mismo rango dos veces. El demo calcula solape y alinea resume con checkpoint — sin eso, el backfill de las 3 h perdidas corrompe la partición viva.",
+        why: "Un schedule horario no autoriza a reprocesar el mismo rango dos veces. El demo calcula solape y alinea resume con checkpoint — sin eso, el backfill de las 3 h perdidas corrompe la partición viva.",
@@ -955 +955 @@
-        feedback: "E3: distinguir "no sé la política" de "el sink está corrupto" evita re-procesar a ciegas.",
+        feedback: "E3: distinguir "no sé la política" de "el sink está corrupto" evita reprocesar a ciegas.",
```

### Diff 6 — Fix missing comma before `pero` (S46-007, 1 occurrence)

```diff
@@ -1011 +1011 @@
-        hint: "Self-loop es necesario pero no suficiente: implementa Kahn o DFS para rechazar raw→clean→raw.",
+        hint: "Self-loop es necesario, pero no suficiente: implementa Kahn o DFS para rechazar raw→clean→raw.",
```

### Diff 7 — Fix `{a,b,c}` spacing (S46-013, 1 occurrence)

```diff
@@ -311 +311 @@
-        "Aplicación a `CASO-HYO-046`: partición `2026-07-22` con keys {a,b,c}. El job horario reintenta tras un timeout de red: el merge debe reportar 0 cambios en la segunda corrida. Riesgo DE: costos de storage y conteos inflados en el reporte diario.",
+        "Aplicación a `CASO-HYO-046`: partición `2026-07-22` con keys {a, b, c}. El job horario reintenta tras un timeout de red: el merge debe reportar 0 cambios en la segunda corrida. Riesgo de ingeniería de datos: costos de storage y conteos inflados en el reporte diario.",
```

### Diff 8 — Fix "Caso CASO" pleonasm (S46-010, 1 occurrence)

```diff
@@ -32 +32 @@
-        "Orden: T1 event-time/watermarks → T2 DAG tipado y checkpoint → T3 calidad/freshness → T4 re-runs y SLI/SLO. El watermark y la late policy de T1 habilitan el merge incremental de T4 (solo filas ON_TIME/ALLOWED_LATE entran al sink); el DAG acíclico de T2 ordena qué asset se backfillea; los contratos de T3 deciden cuándo cuarentenar. Stack didáctico: **stdlib** (dicts, listas) para modelar contratos al estilo Airflow/dbt/streaming **sin cluster**. El foco es corrección de datos y operación del pipeline, no kernels de hardware. Caso `CASO-HYO-046` (Huancayo sintético): eventos de atención de una entidad ficticia; sin PII real ni servicios externos.",
+        "Orden: T1 event-time/watermarks → T2 DAG tipado y checkpoint → T3 calidad/freshness → T4 re-runs y SLI/SLO. El watermark y la late policy de T1 habilitan el merge incremental de T4 (solo filas ON_TIME/ALLOWED_LATE entran al sink). El DAG acíclico de T2 ordena qué asset se backfillea. Los contratos de T3 deciden cuándo cuarentenar. Stack didáctico: **stdlib** (dicts, listas) para modelar contratos al estilo Airflow/dbt/streaming **sin cluster**. El foco es corrección de datos y operación del pipeline, no kernels de hardware. Para `CASO-HYO-046` (Huancayo sintético): eventos de atención de una entidad ficticia, sin PII real ni servicios externos.",
```

### Diff 9 — Settle gender of `data` as LATAM-feminine (S46-008)

Apply consistently: `Un data contract` → `Una data contract`, `Un data SLO` → `Una data SLO`, `late data silencioso` → `late data silenciosa`.

```diff
@@ -239 +239 @@
-        "Aplicación a `CASO-HYO-046`: el contrato de `atenciones_diarias` exige `case_id:str` y `event_time:int` con freshness ≤ 15 min para el dashboard de operaciones. Si llega `event_time` como string o el lag es 80 min, se emite `QUARANTINE_DATASET` y se pagina al owner. Riesgo DE: consumidores downstream que leen basura con tipos rotos.",
+        "Aplicación a `CASO-HYO-046`: el contrato de `atenciones_diarias` exige `case_id:str` y `event_time:int` con freshness ≤ 15 min para el dashboard de operaciones. Si llega `event_time` como string o el lag es 80 min, se emite `QUARANTINE_DATASET` y se pagina al owner. Riesgo de ingeniería de datos: consumidores downstream que leen basura con tipos rotos.",
@@ -237 +237 @@
-        "Un **data contract** fija schema (campos y tipos), semántica (qué significa cada columna), **owner** y, por separado, un **SLO de freshness** (cuánto atraso máximo tolera el consumidor). Schema y freshness se monitorean distinto: un schema correcto con dato de ayer sigue siendo un breach de frescura.",
+        "Una **data contract** fija schema (campos y tipos), semántica (qué significa cada columna), **owner** y, por separado, un **SLO de freshness** (cuánto atraso máximo tolera el consumidor). Schema y freshness se monitorean distinto: un schema correcto con dato de ayer sigue siendo un breach de frescura.",
@@ -347 +347 @@
-        "Un **data SLO** une un **SLI** (indicador medido, p. ej. proporción de particiones frescas) con un objetivo y una ventana. Un incidente de datos protege consumidores (dejar de publicar basura), recupera particiones y documenta causa + prevención. El RTO mide cuánto tarda la recuperación — un runbook sin dueño es teatro.",
+        "Una **data SLO** une un **SLI** (indicador medido, p. ej. proporción de particiones frescas) con un objetivo y una ventana. Un incidente de datos protege consumidores (dejar de publicar basura), recupera particiones y documenta causa + prevención. El RTO mide cuánto tarda la recuperación — un runbook sin dueño es teatro.",
```

> ⚠️ The "breach" inside L237 should also be italicized: *breach*. Also note: if the course's style guide has already standardized on masculine `el data`, do NOT apply this diff — instead, fix L237 "late data silencioso" → "late data silencioso" consistency (no change) and add a style guide note.

### Diff 10 — Anaphoric-monotony fix for 8 callouts (S46-009)

```diff
@@ -62 +62 @@
-        title: "Contrato local",
+        title: "Contrato T1-A · Gate de promoción",
@@ -104 +104 @@
-        title: "Contrato local",
+        title: "Contrato T1-B · Verifica riesgo residual",
@@ -143 +143 @@
-        title: "Contrato local",
+        title: "Contrato T2-A · Fail-closed y salida esperada",
@@ -194 +194 @@
-        title: "Contrato local",
+        title: "Contrato T2-B · Fixture y evidencia local",
@@ -229 +229 @@
-        title: "Contrato local",
+        title: "Contrato T3-A · Documenta breach y recovery",
@@ -267 +267 @@
-        title: "Contrato local",
+        title: "Contrato T3-B · Evidencia reproducible",
@@ -301 +301 @@
-        title: "Contrato local",
+        title: "Contrato T4-A · Rollback y evidencia",
@@ -339 +339 @@
-        title: "Contrato local",
+        title: "Contrato T4-B · Riesgo residual y límites del lab",
```

### Diff 11 — Split L29 dictionary dump into a definition list (S46-003)

If the renderer supports markdown lists inside `paragraphs` (verify in `SectionView.tsx`), split:

```diff
@@ -29 +29,18 @@
-        "**Diccionario de la sección** (léelo antes de T1). **Event time:** cuándo ocurrió el hecho (no el processing time del worker). **Watermark:** aserción de progreso en event time — watermark t declara que no se esperan más eventos con timestamp ≤ t. **Late data:** llega después de que el watermark superó su timestamp (política: drop / side-output / update / quarantine). **Exactly-once (compuesto):** end-to-end con sinks idempotentes + checkpoints, no un flag mágico del broker. **DAG/asset:** grafo de dependencias sin ciclos. **Backfill:** re-run acotado de rangos históricos. **Data contract:** schema + freshness + ownership. **Lineage:** de qué run/tabla salió cada fila. **Incremental load:** particiones/keys sin full rewrite ciego.",
+        "**Diccionario de la sección** (léelo antes de T1).",
+        "- **Event time:** cuándo ocurrió el hecho (no el *processing time* del worker).",
+        "- **Watermark:** aserción de progreso en *event time*; un watermark `t` declara que no se esperan más eventos con timestamp ≤ `t`.",
+        "- **Late data:** llega después de que el watermark superó su timestamp. Política: drop / side-output / update / quarantine.",
+        "- **Exactly-once (compuesto):** end-to-end con sinks idempotentes + checkpoints; no es un flag mágico del broker.",
+        "- **DAG/asset:** grafo de dependencias sin ciclos.",
+        "- **Backfill:** *re-run* acotado de rangos históricos.",
+        "- **Data contract:** schema + freshness + ownership.",
+        "- **Lineage:** de qué *run* o tabla salió cada fila.",
+        "- **Incremental load:** particiones / *keys* sin *full rewrite* ciego.",
```

> ⚠️ Verify first that the renderer renders markdown list items inside `paragraphs` arrays. If it doesn't, fall back to wrapping each definition in its own paragraph string with a leading bullet `•`.

### Diff 12 — Fix `SLAs` → `SLA` (LATAM/Spanish acronym plural rule)

```diff
@@ -15 +15 @@
-    "En equipos de plataforma y producto en LATAM, **ingeniería de datos y orquestación de producción** convierte el job asíncrono de la sección anterior (object store, colas, DLQ e idempotency keys) en pipelines batch/stream con calidad medible y SLAs de frescura. ...
+    "En equipos de plataforma y producto en LATAM, **ingeniería de datos y orquestación de producción** convierte el job asíncrono de la sección anterior (object store, colas, DLQ e idempotency keys) en pipelines batch/stream con calidad medible y SLA de frescura. ...
@@ -31 +31 @@
-        "Producto incremental: orquestación de producción. Entrada: eventos con event_time, schema, SLAs de frescura y keys de idempotencia. ...
+        "Producto incremental: orquestación de producción. Entrada: eventos con event_time, schema, SLA de frescura y keys de idempotencia. ...
```

> ⚠️ Style decision: Spanish acronyms don't take a final `s` for plural (RAE rule). However, "SLAs" is widespread in tech LATAM Spanish. Pick one and apply consistently across the course. If the course's style guide accepts `SLAs`, do NOT apply this diff.

---

## 8. Recommended Priority Order for Fixing

| Priority | Issue | Diff | Effort | Impact |
|----------|-------|------|--------|--------|
| **P0** | S46-001 / ML-1 — GPU content in interactive editor | Diff 1 | Medium (write a new 30-line Python starter) | High — eliminates the most visible pedagogical inconsistency on the page |
| **P0** | S46-002 — Rename section id `gpu-computing` → `data-engineering-production` | Diff 2 | Small (rename file + 2 import sites + 1 editor key) | High — fixes URL hash, file name, internal id consistency |
| **P1** | S46-003 — Split L29 dictionary dump into a list | Diff 11 | Small | Medium — improves first-impression cognitive load |
| **P1** | S46-009 — Rename 8 "Contrato local" callout titles | Diff 10 | Small | Medium — improves scannability |
| **P2** | S46-004 — `vs` → `vs.` (7 occurrences) | Diff 3 | Trivial | Low-Medium — typography polish |
| **P2** | S46-005 — `postmortem` → `post mortem` (5 occurrences) | Diff 4 | Trivial | Low-Medium — typography polish |
| **P2** | S46-006 — `re-` prefix hyphenation (5 occurrences) | Diff 5 | Trivial | Low-Medium — orthography |
| **P2** | S46-007 — Comma before `pero` (1 occurrence) | Diff 6 | Trivial | Low — punctuation |
| **P2** | S46-013 — `{a, b, c}` spacing | Diff 7 | Trivial | Low — typography |
| **P2** | S46-010 — "Caso CASO" pleonasm | Diff 8 | Trivial | Low — style |
| **P3** | S46-008 — Gender of `data` (LATAM-feminine convention) | Diff 9 | Small (3 occurrences) | Low — style consistency |
| **P3** | S46-012 — `SLAs` → `SLA` (style decision) | Diff 12 | Trivial (2 occurrences) | Low — style |
| **P4** | S46-011 — Long sentences (7 instances) | (apply per-paragraph rewrites in §6) | Medium | Low — cognitive load refinement |
| **P4** | S46-016 — "Exactly-once compuesto" plural agreement | (no diff; document in style guide) | Trivial | Low — style |
| **P4** | S46-022 — Glossary entry for coined phrases (`print-theater`, `falsa maestría`) | (add to glossary file) | Small | Low — accessibility |

**Estimated total effort for P0 + P1 + P2:** ~2-3 hours (writing the new interactive editor starter is the bulk of it; everything else is search-and-replace).

---

## 9. Graph Memory Update Notes

For the shared context files (`worklog.md` and any cross-section memory the orchestrator maintains), record:

### Cross-section patterns observed
- **Section id / file name / content mismatches** are a known failure mode in this codebase. S46 is not the only section whose `id` no longer reflects content (the file is `s46-gpu-computing.ts` but content is data engineering). Recommend the orchestrator scan all 52 section files for id-vs-content mismatches.
- **`Pruébalo tú mismo` editor content is hardcoded** in `src/components/course/SectionView.tsx` (lines ~3300–3600), keyed by section id. Any section whose id was renamed needs its editor entry renamed too. Future section audits should verify the editor content matches the section's actual topic.
- **Anaphoric monotony in callout titles** is a pattern: S46 uses `Contrato local` for 8 of 9 callouts. Other sections may have similar monotony (e.g., a single shared callout title across all subtopics). The grammar subplan's `anaphoric_monotony` heuristic catches this at sentence level but not at callout-title level — extend the heuristic.
- **Spanish typography rules** consistently broken across the course (based on S46 + samples from other sections' audits already in `/home/z/my-project/audits/`): `vs` without period, `postmortem` as one word, `re-` prefix with hyphen. Recommend a one-time typography sweep across all 52 sections.
- **LATAM Spanish gender for `data`** is undecided in the course. S46 uses masculine (`Un data contract`). A course-wide style decision is needed.
- **Long theory paragraphs at section start** (the "dictionary" + "puente" + "producto incremental" + "orden" quad) is a pattern: many sections open with a dense 80-100-word paragraph. Cognitive-load reduction by splitting these into lists should be a course-wide sweep.

### Section-specific notes for S46
- **Section 46 prose quality is high** (mean FH 75.7, mean WPS 12.3, 0 hard findings). The section is one of the better-written Master-level sections.
- **Section 46's pedagogical structure (I Do / We Do / You Do / Self-Check) is exemplary**. The 3-tier E1/E2/E3 fail-closed pattern per subtopic is a reusable template that other sections could adopt.
- **Section 46's `CASO-HYO-046` synthetic case** is well-used for narrative continuity across all 8 subtopics. Other sections using synthetic cases should follow this pattern.
- **Section 46's `why` rationales** explicitly tie each demo to a downstream gate (`CP-N4-B`, `S47 MLOps`). This is best practice for vertical alignment and should be propagated to other Phase 3 sections.

### Audit artifacts left in `/home/z/my-project/audits/`
- `_s46_full.ts` — copy of the source file
- `_s46_extract.py`, `_s46_extract2.py`, …, `_s46_extract6.py` — extraction script iterations
- `_s46_prose.json` — extracted prose records (244 items)
- `_s46_prose.txt` — human-readable prose dump
- `_s46_metrics.py` — grammar metric computation
- `_s46_metrics.json` — per-record + per-sentence metrics + summary + worst sentences
- `_s46_lt.py` — LanguageTool API runner
- `_s46_lt.json` — 932 LT matches (878 spell-check false positives + 54 real findings)
- `_s46_rendered.txt` — live-rendered section page text (from agent-browser)

---

## 10. Method Note (Grammar Subplan)

This audit applied the grammar subplan in `/home/z/my-project/audits/_GRAMMAR_SUBPLAN.md`:

### Methods used
1. **Spanish readability formulas** (computed per sentence and per paragraph):
   - **Fernández-Huerta (1959):** `206.84 − 60·(syllables/word) − 1.02·(words/sentence)`. Mean for S46: 75.7 (band: *normal*).
   - **INFLESZ / Szigriszt-Pazos:** `206.835 − 62.3·(syllables/word) − (words/sentence)`. Mean for S46: 71.4 (band: *normal*).
   - **WPS (words per sentence):** mean 12.3 (target 15–32 for technical ES — slightly under, due to many short feedback strings).
   - **SPW (syllables per word):** mean 1.98 (within normal range).
   - **Syllable counter:** rough vowel-group heuristic (no diphthong/hiatus refinement — known limitation, acceptable for ranking).

2. **Rule-based grammar & style engine:**
   - **LanguageTool** (public API, `language=es`, 2 chunks, throttled 3.5s). 932 raw matches; 878 were `MORFOLOGIK_RULE_ES` (spell-check) flagging English tech terms as non-Spanish — false positives in this technical context. 54 non-spell matches reviewed manually; ~25 are real findings (rest are false positives from technical notation like `[start, end)`, English compounds like `late data`, single-character variables like `t`).

3. **Pedagogical heuristics** (applied offline to every sentence and paragraph):
   - Long sentences (>32 w): 7 found
   - Run-on (>45 w): 0 found ✓
   - Missing terminal punctuation: 57 found (mostly UI label strings, intentional)
   - Missing `¿` / `¡`: 0 found ✓ (all 5 self-check questions correctly paired)
   - Unbalanced delimiters: 6 found (all false positives from half-open interval notation `[start, end)`)
   - Repeated words: 3 found (all false positives: `de DE`, `run run`, `Caso CASO`)
   - English-dominant sentence: 2 found (both false positives due to tech-term density)
   - Meta/AI/TODO leak: 0 found in prose ✓ (1 meta-leak found in interactive editor via separate code-source inspection)
   - Gerund pile-up: 0 found ✓
   - High comma density: 23 found (mostly in contract spec paragraphs with lists — acceptable)
   - Paragraph = one long sentence: L29 (107 w / 1 sentence) — flagged
   - Anaphoric monotony: 0 at sentence level; 1 at callout-title level (8 of 9 callouts share "Contrato local")
   - Space-before-punct / double space: 0 found ✓

4. **Composite section score** (0–10): started at 10; subtracted weighted findings; result: **7/10**.
   - Major deduction (−2.0): ML-1 (GPU editor mismatch)
   - Major deduction (−0.3): ML-2 (id/file name mismatch)
   - Medium deductions (−0.5 total): S46-003 (long dictionary dump), S46-009 (callout monotony), S46-011 (7 long sentences)
   - Style deductions (−0.2 total): S46-004 (vs.), S46-005 (postmortem), S46-006 (re-), S46-007 (pero), S46-008 (data gender), S46-013 ({a,b,c}), S46-010 (Caso CASO)

### Known false-positive classes (for future audits)
- `MORFOLOGIK_RULE_ES` (LT spell-check) flags English tech terms (`watermark`, `checkpoint`, `backfill`, `schema`, `lineage`, `dedup`, `merge`, `sink`, `cluster`, etc.) — accepted as loanwords in tech Spanish.
- `ES_UNPAIRED_BRACKETS` flags half-open interval notation `[start, end)` — this is correct mathematical notation.
- `PREP_VERB` flags `de late data` because LT parses `late` as a conjugated Spanish verb form — false positive in English-compound context.
- `SINGLE_CHARACTER` flags `watermark t` because `t` is a single character — `t` is a variable.
- `SPANISH_WORD_REPEAT_RULE` flags `de DE`, `run run`, `Caso CASO` — all are acronym/English-word + noun juxtapositions, not real repetitions.
- `ES_MULTITOKEN_SPELLING_TWO` flags `run run-hyo-46` — first "run" is English word, second is run_id.
- `DIACRITICS_OTHERS` flags `Valida` (imperative verb "Validate!") suggesting `Válida` (adjective) — false positive because `Valida` here is a verb.
- `EL_TILDE` flags `el late data` suggesting pronoun `él` — false positive because `el` is the article.
- `SE` flags `se re-ejecuta` — false positive (reflexive + verb).
- `UN_SUSTANTIVO` flags `un late event` — false positive (English compound).

### Validation
- Nonzero prose extraction: ✓ (244 records, 337 sentences, 4157 words).
- FH in plausible range: ✓ (mean 75.7, within 30–90 band).
- LT API reachable: ✓ (932 matches returned, 2 chunks, no rate-limit errors).
- Heuristic findings consistent with LT findings on overlapping rules: ✓ (e.g., both flag long sentences, both flag `re-` prefix in some cases).

---

## 11. Conclusion

**Section 46 is pedagogically strong but marred by one critical meta-leak (GPU computing interactive editor served on a Data Engineering section page) and a cluster of minor Spanish typography/orthography refinements.**

The prose itself is high quality (FH 75.7, no run-on sentences, all `¿…?` marks properly paired, no AI-to-developer leaks in the learner-facing text). The I Do / We Do / You Do / Self-Check structure is exemplary. The synthetic `CASO-HYO-046` case provides strong narrative continuity. The deliberately-defective starter pattern in We Do is excellent worked-example pedagogy.

The headline issue (ML-1) is a fixable content-mismatch in `src/components/course/SectionView.tsx` — the lookup table keyed by section id still has GPU content for the `gpu-computing` key. The fix is to either (a) replace the GPU starter with a data-engineering starter (Diff 1), or (b) rename the section id from `gpu-computing` to `data-engineering-production` (Diff 2) — preferably both, in that order.

The minor issues (vs., post mortem, re-, pero, {a, b, c}, Caso CASO, data gender, anaphoric callout titles) are typography/orthography polish that can be swept in a single ~1-hour pass with the proposed diffs in §7.

**This is the complete Explorer report for Section 46. Ready for the Fixer prompt.**
