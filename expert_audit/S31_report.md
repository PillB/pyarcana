# Section 31 — Curriculum Audit Report (S31)

> Pyarcana course audit · Section 31 · Live: https://pillb.github.io/pyarcana/ · Repo:
> https://github.com/PillB/pyarcana · Source file:
> `src/lib/course/sections/s31-streaming-data.ts` (2046 lines).

**Confirmed section number:** **31**.

The 31st item in `src/lib/course/index.ts` is `section31`, imported from
`./sections/s31-streaming-data`. The live site renders Section 31 with the
title **"Grafos y evidencia"** (short title) and full title **"Grafos y
evidencia relacional"**, tagline *"grafo temporal que responde cómo están
conectados con camino reproducible y no convierte centralidad en culpabilidad"*,
placed between Section 30 ("Entity resolution probabilístico" / Motor ER) and
Section 32 ("Features sin leakage"). The source `index: 31`, `phase: 2`,
`level: "Competente a experto"`, `estimatedHours: 18`.

**Notable naming inconsistency (low severity):** The filename
`s31-streaming-data.ts` does **not** match the section's actual content (graph
modelling, provenance, centrality, ego-subgraphs). The "streaming-data" name
appears to be a leftover from an earlier roadmap iteration. The live-rendered
title is correct; only the source filename is misleading. See Issue #16.

---

## 1. Section Identification & Scope

| Field | Value |
|---|---|
| Section ID | `streaming-data` (file) / `31` (course index) |
| Title (full) | Grafos y evidencia relacional |
| Short title | Grafos y evidencia |
| Tagline | grafo temporal que responde cómo están conectados con camino reproducible y no convierte centralidad en culpabilidad |
| Phase / Level | Phase 2 / Competente a experto |
| Estimated hours | 18 |
| Capstone marker | Inicio CP-N3-B (puente hacia S34 workbench) |
| Job relevance | Research on entity relations (banca, BPO, compliance in Peru) |
| Sub-topics | T1 Modelo · T2 Construcción · T3 Algoritmos · T4 Calidad y privacidad (8 sub-IDs `S31-T1-A`, `S31-T1-B`, `S31-T2-A`, `S31-T2-B`, `S31-T3-A`, `S31-T3-B`, `S31-T4-A`, `S31-T4-B`) |
| Pedagogical blocks present | theory (8 entries) · iDo (8 demos) · weDo (24 exercises: 8 sub-topics × 3 each) · youDo (1 capstone brief) · selfCheck (10 questions) · resources |
| Synthetic fixture | `CASO-LIM-031` (`run_id=cpn3b-01`, `@example.pe`, Lima / Red Andina) |

Scope audited: every learner-facing Spanish string in the section — title,
tagline, jobRelevance, learningOutcomes, theory paragraphs, callouts, iDo intro
+ step `description` + `why`, weDo intro + 24 exercise `instruction` / `hint` /
`hints` / `edgeCases` / `tests` / `feedback`, youDo `title` / `context` /
`objectives` / `requirements` / `portfolioNote` / `rubric`, selfCheck
`question` / `options` / `explanation`, and resources `label` / `note`.
Excluded (per `_GRAMMAR_SUBPLAN.md`): code blocks (`code`, `output`,
`starterCode`, `solutionCode`), id-only strings, English-only labels.

---

## 2. Executive Summary of Quality

**Composite score: 8.4 / 10**

**Verdict:** Section 31 is a **high-quality, technically rigorous, ethically
well-calibrated** graph-theory section that successfully bridges S30 (Entity
Resolution) → S31 (evidence graph) → S34 (workbench). The I Do / We Do / You Do
/ Self Check structure is exemplary: 8 demos map 1-to-1 to 8 sub-topics; 24
exercises are organized 3-per-sub-topic in the prescribed `guided → independent
→ transfer` progression; the You Do capstone is fully scaffolded with a
realistic contract; the self-check has 10 well-formed MCQs with explanations.
The non-culpability / non-fraud / non-parentesco ethic is *relentlessly*
reinforced (counted 30+ explicit disclaimers) — appropriate for the sensitive
domain (banking, BPO, compliance in Peru).

**Strengths**
- Excellent connective tissue: every theory block opens with a bridge
  ("En S30 respondiste… Aquí **inicias CP-N3-B**…", "Tras el ER de S30…",
  "Hilo S29 → S30 → S31…" implied via "puente hacia el workbench de S34").
- Strong progressive disclosure: T1 (model) → T2 (build) → T3 (algorithms) →
  T4 (quality/privacy); each sub-topic opens a single concept.
- Spanish readability metrics land in the *healthy-for-technical* band:
  **FH mean 63.7** (Fernández-Huerta "normal"), **INFLESZ mean 58.8**,
  **WPS mean 10.3** (well below the 15–32 target). The prose is generally
  *clear, short-sentenced, and pedagogically dense*.
- No meta-leaks / AI-to-developer residue / "moved from section X" notes.
- No PII real: `@example.pe` and `CASO-LIM-031` fixture consistently applied.
- Code-quality is high: every demo and solution runs and prints the declared
  `output`; idempotence, provenance, and disclaimer are baked into contracts.

**Weaknesses (ranked)**
1. **One genuine run-on sentence (53 words)** in the visualisation storyboard
   (line 369) — splits into a numbered list (it already *is* a list in
   prose form).
2. **Five more long sentences (35–48 words)** in theory and exercise
   instructions that benefit from splitting (lines 283, 317, 367, 408, 123,
   730, 1392, 1656).
3. **One real gender-agreement issue**: *"transfer es dirigida"* (line 1957) —
   English loan noun with feminine adjective; pick a gender and apply it
   consistently.
4. **Stylistic inconsistency on "vs"**: appears as `vs` (no period) and
   `vs.` interchangeably; pick one (RAE prefers `vs.` but `vs` is accepted in
   tech context).
5. **Title vs tagline concept mismatch**: title says *"Grafos y evidencia
   **relacional**"* but tagline says *"grafo **temporal**"*. Both adjectives
   describe the graph; pick the dominant framing (relational is more accurate
   for the section's content; temporal is one feature among several).
6. **Filename mismatch**: `s31-streaming-data.ts` vs. content. Cosmetic but
   confusing for repo navigation.
7. **High comma density in some headings** (e.g. *"Visualización,
   escalabilidad, privacidad y evidencia por arista"*) — fine as a heading
   but produces a low Fernández-Huerta score that *looks* alarming but is
   actually a benign list-like title. (Documented as a known false-positive
   class in the subplan.)

**Re-daction quality:** Professional Peruvian Spanish (`es-PE`) register is
consistent. Use of code-switching (`path`, `hub`, `hop limit`, `seed`, `ego-k`,
`workbench`, `ledger`, `compliance`) is appropriate for the technical audience
and is consistently glossed on first use (e.g. *"hop limit (máximo de
saltos)"*, *"seed (semilla del caso)"*).

---

## 3. Detailed Issue Registry

> Severity scale: **H** = high (blocks learning or violates redaction
> standards), **M** = medium (noticeable style/pedagogy issue), **L** = low
> (cosmetic / consistency / pedantic). All line numbers refer to
> `src/lib/course/sections/s31-streaming-data.ts`.

### Issue #1 — Run-on storyboard sentence (53 words, line 369) — **M**
**Evidence:**
> "**Evidencia por arista — storyboard del revisor (CASO-LIM-031):** (1) abre el caso con seed `E1`; (2) expande ego k=2 y localiza el hop `E1 → ph:900 → E2`; (3) al hacer clic en cada hop ve `records`, `ts` y `source`; (4) lee el disclaimer de centralidad del hub de contacto; (5) **no** recibe auto-label de fraude ni parentesco — solo hipótesis con evidencia para la cola humana. Ese contrato alimenta CP-N3-B y el workbench de S34."

**Metrics:** w=53, FH=35.0, INFLESZ=23.0 — classifies as **RUNON** (>45 words).

**Pedagogical impact:** A high-value narrative (the "storyboard del revisor")
is buried inside one paragraph that contains two distinct ideas (the 5-step
storyboard *and* the bridge statement). Splitting it visually improves scan
readability and makes the 5-step protocol feel like a checklist — exactly the
affordance the workbench contract wants.

### Issue #2 — Long sentence: Centralidad con betweenness/closeness (38 words, line 283) — **M**
**Evidence:**
> "**Degree centrality** (grado normalizado) mide **cuántos vecinos** tiene un nodo: es **estructura**, no culpa. Un hub puede ser un procesador de pagos legítimo o un teléfono de call center compartido. *Betweenness* (cuántos caminos cortos pasan por el nodo) y *closeness* (qué tan cerca está del resto) existen en NetworkX; en S31 dominas **degree + interpretación** y dejas las otras para la documentación enlazada — sin fingir que ya las calculaste."

The third sentence is 38 words and packs three concepts (betweenness def,
closeness def, scope-of-section boundary). **Metrics:** w=38, FH=37.0.

**Pedagogical impact:** Three concepts in one sentence forces re-reading. The
section correctly de-scopes betweenness/closeness; that boundary should get
its own short sentence for emphasis.

### Issue #3 — Long sentence: Extrae un subgrafo de caso (35 words, line 317) — **M**
**Evidence:**
> "Extrae un **subgrafo de caso** (*ego-subgraph* o *ego-k*): el **seed** (semilla del caso — p. ej. la entidad bajo revisión) más vecinos a **k hops** (saltos), con filtros de tipo y/o ventana temporal. El revisor trabaja sobre ese recorte; no navega el grafo completo del banco."

First sentence = 35 words. **Metrics:** w=35, FH=64.9.

**Pedagogical impact:** Acceptable readability (FH 64.9 is "normal"), but the
parenthetical glosses inside a parenthetical make it hard to read on first
pass. Pull the gloss into a second sentence.

### Issue #4 — Long sentence: SNAP scale policy (37 words, line 367) — **M**
**Evidence:**
> "Visualiza **subgrafos acotados**; no intentes dibujar 100k nodos en el navegador del revisor. A escala tipo SNAP (miles o millones de nodos), la política correcta es: **ego-k o componente del caso** para explorar, y **resumir** (top hubs, tamaños de componentes, conteos por etype) cuando `n_nodes` supera un umbral de render. Renderizar todo no es "más transparente": es ruido e inoperable."

Second sentence = 37 words. **Metrics:** w=37, FH=49.1.

**Pedagogical impact:** The three-sentence paragraph is well-structured
(claim, policy, slogan) but the middle sentence crams the policy + threshold
into one. Splitting the threshold clause improves the cadence.

### Issue #5 — Long sentence: iDo intro (34 words, line 408) — **L**
**Evidence:**
> "Te muestro el inicio de CP-N3-B paso a paso: modelo tipado, multiaristas con provenance, proyección tablas→grafo, agregación con detalle, path con hop limit, degree con disclaimer, ego-k y vista redactada."

**Metrics:** w=34, FH=43.3. Just over the 32-word long threshold.

**Pedagogical impact:** This is an enumerated preview, so a long list-like
sentence is pedagogically appropriate. The fix is optional — split into two
chunks (model/build vs. analysis/viz) for cadence.

### Issue #6 — Long sentence: Construyes el grafo desde tablas (24 words, line 123) — **L**
**Evidence:**
> "Construyes el grafo desde tablas: **entidades** (nodos persona/organización), **cuentas**, **transacciones** (aristas dirigidas) y **contactos** (email/teléfono/dirección como nodos o como aristas tipadas). Cada fila de tabla se proyecta a nodos y/o aristas con un etype del schema canónico."

First sentence is 24 words (within healthy range). The second sentence
(`Cada fila de tabla se proyecta…`) is 14 words. **Metrics:** overall
paragraph FH=14.9 — driven down because of *list-like* density (5 commas in
29 words of paragraph). The low FH is misleading here; this is a **list-as-prose
paragraph** and the comma density is structurally justified. (Known false
positive per subplan.)

### Issue #7 — Gender agreement on English loan noun (line 1957) — **M**
**Evidence (selfCheck option, line 1957):**
> "dirigida con etype transfer y peso en PEN (u otra unidad documentada)"

LanguageTool flags `CONCORDANCIAS_ATRIBUTO`: *"transfer es dirigida"*
(appears in the explanation, line 1957: *"transfer es dirigida; owns es
entidad→cuenta; shared_phone es hecho de contacto."*).

**Issue:** "transfer" is an English loan. When used as a Spanish noun, gender
is ambiguous; the author chose feminine ("dirigida") but "transfer" reads
masculine (parallel to "el transfer" / "el edge" / "el path" used throughout
the rest of the section).

**Pedagogical impact:** Inconsistency with the rest of the section's
masculine treatment of code-nouns (`el path`, `el hub`, `el hop`, `el seed`,
`el ego-k`, `el builder`, `el ledger`). Spanish readers process these as
masculine by default. Either switch to *"transfer es dirigido"* (matches
section voice) or replace with the Spanish feminine *"la transferencia es
dirigida"*.

### Issue #8 — "vs" without period (5+ occurrences) — **L**
LanguageTool flags `PUNTO_EN_ABREVIATURAS` 5 times for `vs` (lines 46, 1441,
1967, etc.). The section also uses `vs.` with period in some places (e.g.
line 46 *"Dirigido vs no dirigido"* without period; elsewhere with period).

**Pedagogical impact:** Stylistic inconsistency. RAE accepts both `vs.` and
`vs`; pick one and apply throughout.

### Issue #9 — Title vs tagline adjective mismatch — **L**
- Title (line 6): *"Grafos y evidencia **relacional**"*
- Tagline (line 8): *"grafo **temporal** que responde cómo están conectados…"*

Both adjectives describe the graph; the section teaches both temporal
(`ts`/windowing) and relational (typed edges) aspects. The tagline's "temporal"
is the weaker of the two framings — the section's central novelty is the
*evidencia por arista* + *provenance*, not time-windowing per se.

**Pedagogical impact:** Confusing first impression. Recommend aligning the
tagline to *"grafo de evidencia relacional con camino reproducible…"* or
dropping the adjective from the tagline.

### Issue #10 — Filename mismatch (`s31-streaming-data.ts`) — **L**
The filename implies a streaming/Kafka/Flink-style section. Actual content is
graph theory + provenance + centrality + ego-subgraphs. Compare to neighbours:
`s30-security-infra.ts` (entity resolution — also misleading filename),
`s22-rapidfuzz-entity.ts` (email — also misleading). The repo has a systemic
filename drift; not a per-section blocker.

**Pedagogical impact:** Zero for the learner (filename is invisible). Negative
for repo navigability and future maintainers.

### Issue #11 — Job relevance first sentence (29 words, FH 22.1, line 15) — **M**
**Evidence:**
> "En investigación de relaciones entre entidades (banca, BPO, compliance en Perú), necesitas un **grafo de evidencia**: nodos, aristas tipadas, agregados y caminos explicables para la cola de revisión humana."

**Metrics:** w=29, FH=22.1, INFLESZ=16.7, comma_density=5/29=0.17 (high).

**Pedagogical impact:** This is the *very first* learner-facing sentence of
the section (after the title). 5 commas + 1 colon + an inline list of 4 nouns
in 29 words creates a wall of qualifications before the reader has a mental
model. Splitting the parenthetical out, and moving the list of ingredients to
a second sentence, would dramatically improve the opening.

### Issue #12 — "re-ejecución" and "re-runs" (lines 1656, 1660, 1824, etc.) — **L** (false positive to note)
LanguageTool flags `NO_SEPARADO` for `re-ejecución` and `re-runs`. **Both are
correct Spanish per RAE**: prefix `re-` + base starting with `e` requires the
hyphen ("re-ejecución", "re-elección"). `re-runs` is an English loan and is
fine in technical context.

**Pedagogical impact:** None. No action needed beyond flagging as a known
LanguageTool false positive (consistent with `_GRAMMAR_SUBPLAN.md` §D risk
mitigation).

### Issue #13 — "testeable" tilde suggestion (lines 318, 1108 area) — **L** (false positive)
LanguageTool flags `DIACRITICS_OTHERS` for "testeable". RAE: word is *grave
(esdrújula? no — grave) ending in -able (vowel)*, so it does **not** take a
tilde. The author's spelling "testeable" is correct.

### Issue #14 — "filas de tabla" (line 124) vs suggested "filas de tablas" — **L** (false positive)
LanguageTool `NOUN_PLURAL2` flags `tabla` (singular) after `filas de` (plural
partitive). Spanish allows both *"filas de tabla"* (generic class reading,
"table-rows") and *"filas de tablas"* (specific plural, "rows of [multiple]
tables"). The author's choice is the generic class reading — appropriate and
correct.

### Issue #15 — Inconsistent use of arrows `→` vs `-->` vs `→` — **L**
Section uses `→` (Unicode arrow) for transitions (`T1 Modelo → T2 Construcción
→ T3 Algoritmos → T4 Calidad y privacidad`, `entity —owns→ account`,
`tablas→grafo`). Some inline code uses ASCII `->` (e.g. `out_strength(edges)
→ dict src→suma` in hint text). Unicode arrows render fine in MDX but the
mixed style is mildly inconsistent.

### Issue #16 — Tagline lacks terminal period (line 8) — **L** (intentional)
Taglines typically omit terminal punctuation; flagging only for completeness.

### Issue #17 — Hint strings that start with code (lowercase) trigger LT UPPERCASE_SENTENCE_START — **L** (false positive)
Many hint strings start with code (`f = [e for e in edges if e['ts'] >= ...]`,
`m[v].add(e) por cada (e, v).`) — LanguageTool flags 27 instances of
"Esta frase no empieza con mayúscula". These are all hint-style fragments,
not full sentences, and the lowercase opening is appropriate to the code-first
style. False positives.

### Issue #18 — Repeated boilerplate suffix in 24 exercise instructions — **L** (style consistency, not error)
23 of 24 weDo exercises end with one of:
- *"Fixture `CASO-LIM-031`."*
- *"Fixture `CASO-LIM-031`; sin PII real; sin etiquetar fraude ni parentesco."*
- *"Fixture `CASO-LIM-031` (run_id=cpn3b-01, @example.pe); datos sintéticos solo; sin fraude ni parentesco."*

The disclaimer is *valuable* (ethics + privacy), but the exact phrasing varies
in 4+ ways. A canonical one-liner (e.g. *"Fixture sintético CASO-LIM-031;
@example.pe; sin PII real; sin etiquetar fraude ni parentesco."*) would feel
more like a deliberate contract and less like authoring drift.

### Issue #19 — Self-check question 6 (line 1939) starts with "¿Por qué…" but no accent on "Por qué" inside quote — **L**
The question text is *"¿Por qué modelar un multigrafo en transferencias
E1→E2?"* — correctly uses `¿…?` and accented `Por qué`. No action needed;
flagged to confirm correctness (it is correct).

### Issue #20 — Some `why` fields are very short fragments (no terminal period) — **L**
Examples (lines 441, 474, 511, 547, 588, 618, 655, 676): *"Dirección y peso
son parte del contrato del grafo, no adornos."* / *"Tablas → grafo con tipos
estables del schema canónico."* / *"Camino acotado y ordenado =
reproducible."* All ≤11 words; all but two end in `.`; the very short ones
(FH < 0 because of the syllable penalty on few-word sentences) are pedagogically
fine — they're punchlines, not paragraphs. No action needed; flagged to
explain the alarming FH_min numbers in the metrics section below.

### Issue #21 — Resources `note` field for NetworkX centrality (line 1995) — **L**
> *"Degree (dominio S31); betweenness/closeness para profundizar"*

13 words, no terminal period, fragment-style. Acceptable as a metadata note;
the slash `betweenness/closeness` is fine in technical context.

### Issue #22 — youDo `requirements` array uses English label "render vs summarize" (line 1827) — **L**
> *"README es-PE: schema, hop limit, política render vs summarize, centralidad = estructura no culpa"*

Mixing English (`render`, `summarize`) inside an es-PE README requirement is
acceptable since these are code-noun concepts already established in the
section. Stylistic preference only.

### Issue #23 — "shared-contact" (English, line 169) — **L**
> *"Modelar el valor de contacto como nodo facilita detectar shared-contact sin inventar parentesco ni fraude…"*

Uses `shared-contact` (English, hyphenated) where the rest of the section uses
`shared_phone` / `shared_email` (snake_case) or "contacto compartido". Pick
the Spanish "contacto compartido" for prose, or use `shared_phone`/`shared_email`
when referring to the etype.

### Issue #24 — weDo exercise `S31-T1-A-E2` instruction is 48 words (line 730) — **M**
**Evidence:**
> "S31-T1-A-E2 · Dada una lista de aristas dirigidas (src, dst, weight en PEN), calcula el **peso total saliente** por nodo (*out-strength*: suma de pesos de aristas que salen del nodo) e imprime el nodo con mayor out-strength, su valor y cuántos nodos tienen salida. Fixture `CASO-LIM-031`; datos sintéticos solo; sin fraude automático."

First sentence = 48 words. **Metrics:** w=48, FH=54.1. Single-sentence
instruction with two parenthetical glosses (the `*out-strength*` definition
and the inline list of inputs). Splitting improves readability.

### Issue #25 — weDo exercise `S31-T3-B-E1` instruction is 32 words (line 1392) — **L**
Just over the 32-word soft limit. Acceptable for an instruction; flag for
consistency.

### Issue #26 — weDo exercise `S31-T4-A-E3` instruction is 32 words (line 1656) — **L**
Same as above.

### Issue #27 — youDo `portfolioNote` is 32 words (line 1889) — **L**
> "Inicio CP-N3-B: entrega un grafo temporal con evidencia, tests mínimos, política de escala documentada y una vista de path redactada lista para portafolio (puente natural hacia el workbench de S34)."

Just at the 32-word threshold; the parenthetical bridge clause can be a
separate sentence for emphasis.

### Issue #28 — "muéstrame las transacciones" appears bare inside `danger` callout content (line 211) — **L**
> "Mostrar solo sum(amount) sin records impide contestar 'muéstrame las transacciones'."

The single-quoted `'muéstrame las transacciones'` is the *user's voice* (a
revisor asking the system). Readable, but Spanish typically uses `«…»` for
quoted speech. Cosmetic.

### Issue #29 — youDo `requirements` items are sentence-fragments without terminal punctuation (lines 1820–1828) — **L**
Eight fragment-requirements, e.g. *"Datos sintéticos únicamente; sin PII real
(`@example.pe`, fixture conceptual CASO-LIM-031 / run_id conceptual cpn3b-01)"*.
List-style is fine; the semicolon chains inside fragments are slightly dense.
Acceptable for a rubric-style requirements list.

### Issue #30 — youDo `context` paragraph (line 1812) opens with 26-word sentence — **M**
> "Tras el ER de S30, construye un grafo sintético entity/account/contact/tx (fixture conceptual `CASO-LIM-031`, `@example.pe`) con multiaristas, provenance y consulta de camino reproducible con hop limit."

**Metrics:** w=26, FH=48.8. Two inline code glosses in one sentence; the
slash-list `entity/account/contact/tx` is dense. Splitting the glosses out
improves readability.

---

## 4. Meta-Leak Report

**Result: NO meta-leaks detected.**

Searched for: `TODO|FIXME|XXX|HACK|@author|@reviewer|moved from|moved to|
borrador|placeholder|TBD|WIP|lorem|ipsum|@dev|@review|@todo|@note|@internal|
@pedagogy|meta|leak|developer note|design note|authoring|scaffold note|esto es
un|esta sección es|placeholder|inventado|de mentira`.

**Findings:**
- 24 occurrences of `# TODO:` inside `weDo[...].starterCode.code` and 1 inside
  `youDo.starterCode` (lines 701, 743, 794, 854, 894, 938, 985, 1021, 1063,
  1103, 1141, 1190, 1248, 1290, 1350, 1405, 1450, 1509, 1565, 1625, 1669,
  1709, 1747, 1785, 1860). **These are intentional learner-facing scaffolds**
  (fill-in-the-blank exercise starters), NOT meta-leaks. They follow the
  pedagogical pattern: `# TODO: <imperative>` → student replaces with working
  code. This matches the I Do / We Do / You Do contract.
- Zero occurrences of `moved from`, `section X` (as authoring residue),
  `borrador` (as draft marker), `placeholder`, `lorem`, `ipsum`, `@dev`,
  `@review`, `@internal`, or any AI-to-developer comment patterns.
- Zero design notes, zero internal instructions.

**Conclusion:** Section 31 is clean of developer meta-text. The authoring
discipline here matches the best early sections (S01–S05).

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do fidelity — **STRONG**

**I Do (8 demos, lines 407–679):** Every demo has a `subtopicId` mapping 1:1
to a theory sub-topic (S31-T1-A through S31-T4-B), a clear `description`, a
working `code` block with declared `output`, and a one-line `why`. The intro
(line 408) previews all 8 demos and ties them to the We Do contract. **Fidelity
to the gradual-release model: excellent.**

**We Do (24 exercises, lines 680–1807):** Organized as 8 sub-topics × 3
exercises each, in the prescribed order:
- E1 = `guided` (scaffolded starter + solution)
- E2 = `independent` (scaffolded starter + solution, less guidance in hints)
- E3 = `transfer` (applies the concept to a related scenario)

Every exercise includes `instruction`, `hint` (one-liner), `hints` (2-step
progressive), `edgeCases`, `tests` (expected output contract), `feedback`,
`starterCode`, `solutionCode` with declared `output`. This is **gold-standard
scaffolding** — identical in rigour to S30 and clearly modelled on the same
template.

**You Do (1 capstone, lines 1809–1899):** A single rich brief with `title`,
`context`, 5 `objectives`, 8 `requirements`, a 50-line `starterCode` skeleton
with 4 `NotImplementedError` stubs (`build_from_tables`,
`aggregate_keep_detail`, `ego`, `redact_label`, `path_view`), a `portfolioNote`
linking to S34, and an 8-criterion `rubric` (one bonus, one privacy gate).
**Pedagogically excellent.** The `path + provenance and disclaimer of
centralidad` criterion is a `bonus checklist` — appropriately motivates the
ethic without making it a pass/fail gate (the gate is a separate
`criterio de privacidad`).

**Self Check (10 MCQs, lines 1901–1973):** 10 well-formed 4-option multiple
choice questions with `explanation` for each. Coverage:
- Q1: Centralidad ≠ culpa ✓
- Q2: Provenance purpose ✓
- Q3: Aggregate vs detail ✓
- Q4: Shared phone ≠ parentesco ✓
- Q5: Path = hipótesis con evidencia ✓
- Q6: Multigrafo motivation ✓
- Q7: Hop limit purpose ✓
- Q8: Schema (transfer dirigida) ✓
- Q9: ego-k = seed + 1 hop ✓
- Q10: Weight units in schema ✓

Each distractor is plausible (e.g. *"NetworkX lo corrige solo"* for Q10, *"Para
borrar el detalle y dejar un solo peso"* for Q6). **Strong item design.**

### 5.2 Connective tissue & narrative flow — **STRONG**

The section opens with an explicit bridge to S30 ("En S30 respondiste **¿misma
entidad?** Aquí **inicias CP-N3-B**…", line 30) and to S34 (line 369: *"Ese
contrato alimenta CP-N3-B y el workbench de S34"*; line 1889: *"puente natural
hacia el workbench de S34"*). The S30 → S31 hand-off is reinforced in callouts
(line 38 *"Puente desde S30"*; line 176 *"tras el ER colapsa ids canónicos…
reescribir aristas sin perder trazabilidad del matching de S30"*).

The four-topic spine (T1 Modelo → T2 Construcción → T3 Algoritmos → T4
Calidad y privacidad) is announced in the first theory block (line 32) and
followed strictly by the theory, demos, and exercises. **Internal narrative
coherence is excellent.**

### 5.3 Cognitive load & progressive disclosure — **STRONG**

Each theory block opens a single concept:
- T1-A: nodes/edges/direction/weight
- T1-B: multigraph/time/provenance
- T2-A: tables → graph projection
- T2-B: dedup/aggregation without detail loss
- T3-A: degree/components/paths
- T3-B: centrality with bounded interpretation
- T4-A: subgraphs and tests
- T4-B: viz/scalability/privacy/evidence-per-edge

The section *deliberately* de-scopes betweenness/closeness (line 283: *"en S31
dominas degree + interpretación y dejas las otras para la documentación
enlazada — sin fingir que ya las calculaste"*) — exemplary progressive
disclosure. NetworkX is mentioned as a production bridge, not required
knowledge. **Cognitive load management: gold standard.**

### 5.4 Exercise & exam alignment — **STRONG**

The 24 exercises cover exactly the 8 sub-topics × 3 levels (guided /
independent / transfer). The expected `tests` outputs are unambiguous (e.g.
*"salida: n_nodes 3 / n_edges 2 / n_directed 1"*) and the `solutionCode`
prints exactly that. Every exercise reinforces the ethic (`sin PII real; sin
etiquetar fraude ni parentesco`) without becoming a parody.

The self-check questions sample all four topics (T1: Q2, Q6, Q8; T2: Q3, Q4;
T3: Q1, Q7, Q10; T4: Q5, Q9). **Coverage is balanced.**

### 5.5 Consistency with the overall roadmap — **STRONG**

The section correctly identifies itself as the start of CP-N3-B (capstone
project 3, phase B). It bridges from S30 (CP-N3-A close — ER motor) and points
to S34 (workbench). It reuses the synthetic-data conventions
(`@example.pe`, `CASO-LIM-0NN`, `run_id=cpnNb-NN`) consistently with S22 and
S30. The non-culpability ethic is identical to S22 / S30 and forms a coherent
curriculum-wide stance.

### 5.6 Comparison with best-in-class external materials

| Reference | What it does well | S31 verdict |
|---|---|---|
| NetworkX tutorial (official) | API-first, no pedagogy | S31 is **more pedagogical**: builds the algorithm in pure Python first, then mentions NetworkX as production bridge. ✓ |
| Easley & Kleinberg, *Networks, Crowds, and Markets* | Conceptual depth, interpretation | S31 matches the interpretive rigour (centralidad ≠ culpa) and adds the privacy/provenance dimension E&K lack. ✓ |
| Stanford SNAP | Scale-aware policy | S31 distills the scale policy into a 3-line heuristic (ego-k for explore, summarize for >500 nodes). ✓ |
| W3C PROV | Provenance model | S31 uses a simplified 3-field provenance (`source_system`, `run_id`, `record_id`) — appropriate for the level. ✓ |
| Neo4j graph data modeling | Typed edges, schemas | S31 mirrors this (canonical schema `owns · transfer · shared_phone · shared_email · has_phone · has_email`) and adds the multigraph-temporal layer Neo4j tutorials often omit. ✓ |

**Verdict:** S31 holds its own against external best-in-class materials and
exceeds them on the privacy/ethics dimension. The pure-Python-first approach
(pedagogical clarity) before mentioning NetworkX is the correct pedagogical
ordering.

### 5.7 Accessibility & motivation

- **Motivation:** The opening `jobRelevance` (line 15) anchors the section in
  Peruvian banking/BPO/compliance. Excellent local grounding.
- **Accessibility:** Heavy use of inline code (`record_id`, `ts`, `path`,
  `ego-k`) is standard for the audience (post-S22 level). Each code-noun is
  glossed on first use.
- **Visual hierarchy:** Callouts are well-typed (`info` for bridges, `tip` for
  best practice, `warning` for caution, `danger` for hard rule). The
  `"danger"` callouts consistently carry the non-culpability message.

---

## 6. Grammatical Improvements & Rewriting Report (paragraph by paragraph)

> Method note (per `_GRAMMAR_SUBPLAN.md`): Spanish readability formulas
> applied — **Fernández-Huerta (1959)** `206.84 − 60·(syl/word) − 1.02·(words/sent)`,
> **Szigriszt-Pazos / INFLESZ** `206.835 − 62.3·(syl/word) − (words/sent)`,
> **WPS** (mean words per sentence), **SPW** (mean syllables per word). Plus
> rule-based heuristics (run-on >45 w, long >32 w, missing terminal punct,
> missing `¿`/`¡`, unbalanced delimiters, repeated words, gerund pile-up,
> high comma density, anaphoric monotony, space-before-punct). Plus
> LanguageTool (`language=es`) public API via 2 chunks (402 + 226 = 628 raw
> matches; 59 non-MORFOLOGIK; ~28 of those are real-prose false positives on
> code-prefixed hint strings).
>
> Aggregate metrics (288 paragraphs, 384 sentences):
> - FH mean 63.7, median 64.6, min −37.2 (4-word heading), max 142.8 (very
>   short sentence).
> - INFLESZ mean 58.8.
> - WPS mean 10.3, max 53 (run-on storyboard).
> - SPW mean 2.21.
> - Long sentences (>32 w): 6. Run-on (>45 w): 1.
> - Missing terminal punct: 113 (mostly labels/fragments; 15 with ≥15 words,
>   of which 8 are tagline/fragments and 7 are real but low-priority).
> - Missing `¿`/`¡`: 1 (false positive inside a code hint).
> - Unbalanced delimiters: 0.
> - High comma density: 49 sentences (mostly list-like headings/callouts).
> - Anaphora (≥3 same sentence-start in a paragraph): 0.
> - Repeated word (`de de`, etc.): 0.
> - Gerund pile-up: 0.
> - Double space: 0.
> - Space-before-punct: 1 (false positive inside code hint).

### 6.1 Theory tabs (paragraph-by-paragraph before / after)

#### Theory T1-A intro, ¶1 (line 30)
**Before** (1 sentence, w=39, FH≈25):
> "En S30 respondiste **¿misma entidad?** Aquí **inicias CP-N3-B**: modelar **cómo están conectadas** las entidades resueltas con caminos reproducibles y **evidencia por arista**. El grafo *explica* conexiones auditables; **no** etiqueta fraude ni parentesco."

(Note: 39 words across 2 sentences; first sentence = 28 w.)

**After** (3 sentences):
> "En S30 respondiste **¿misma entidad?** Aquí **inicias CP-N3-B** y pasas a modelar **cómo están conectadas** las entidades resueltas. Los caminos son reproducibles y cada arista lleva **evidencia por arista**. El grafo *explica* conexiones auditables; **no** etiqueta fraude ni parentesco."

**Why:** Splits the long first sentence at the natural semantic break
(`CP-N3-B` announcement vs. `cómo están conectadas` framing). The third
sentence (the ethical boundary) gets its own line for emphasis.

#### Theory T1-A intro, ¶2 (line 31)
**Before** (w=37, FH≈49):
> "Hilo conductor: contactos, cuentas y transferencias **sintéticas** del fixture `CASO-LIM-031` (`run_id=cpn3b-01`, `@example.pe`, Lima / Red Andina). Contrato: filas → grafo con tipos, pesos y provenance; error tipificado si falta `record_id` o el schema de arista."

**After** (3 sentences):
> "Hilo conductor: contactos, cuentas y transferencias **sintéticas** del fixture `CASO-LIM-031` (`run_id=cpn3b-01`, `@example.pe`, Lima / Red Andina). Contrato: filas → grafo con tipos, pesos y provenance. Si falta `record_id` o el schema de arista, el builder lanza un error tipificado."

**Why:** Splits the contract sentence (claim vs. failure mode). Makes the
typed-error rule explicit as a separate sentence.

#### Theory T1-A intro, ¶3 (line 32)
**Before** (w=37, FH≈49):
> "Orden: **T1 Modelo** → **T2 Construcción** → **T3 Algoritmos** → **T4 Calidad y privacidad**. El revisor ve **path + evidencia**, nunca un auto-veredicto. Schema canónico de aristas en esta sección: `owns` · `transfer` · `shared_phone` · `shared_email` · `has_phone` · `has_email`."

**After:** Acceptable as-is; the enumerated preview is appropriately compact.
Optional: separate the schema list to its own line for visual weight.

#### Theory T1-A second block, ¶1 (line 45)
**Before** (w=28, FH≈30):
> "Un **nodo** es una entidad del caso (cliente, cuenta, email o teléfono sintético). Una **arista** es un **hecho relacional** con tipo (`etype`), y opcionalmente **dirección** y **peso** (monto en PEN, frecuencia o score de confianza). Sin tipos estables, el path del revisor no se puede filtrar ni auditar."

(Note: middle sentence = 28 w with 3 commas.)

**After** (3 sentences):
> "Un **nodo** es una entidad del caso: cliente, cuenta, email o teléfono sintético. Una **arista** es un **hecho relacional** con tipo (`etype`), y opcionalmente **dirección** y **peso**. El peso puede ser monto en PEN, frecuencia o score de confianza. Sin tipos estables, el path del revisor no se puede filtrar ni auditar."

**Why:** Moves the parenthetical gloss of "peso" to its own sentence; the
colon in the first sentence replaces the inline parenthetical, reducing
comma density.

#### Theory T1-A second block, ¶2 (line 46)
**Before** (w=29, FH≈34):
> "Dirigido vs no dirigido: las transferencias son **dirigidas**; "comparte teléfono/dirección" suele modelarse **no dirigido** (o con dos aristas simétrica si tu store lo exige). Elige una convención, documéntala en el schema y no la mezcles en el mismo etype."

(Note: typo — "simétrica" should be "simétricas" agreeing with "dos aristas".)

**After** (3 sentences):
> "Dirigido vs. no dirigido: las transferencias son **dirigidas**. "Comparte teléfono/dirección" suele modelarse **no dirigido** (o con dos aristas simétricas si tu store lo exige). Elige una convención, documéntala en el schema y no la mezcles en el mismo etype."

**Why:** (a) Fixes `simétrica → simétricas` agreement; (b) splits the
semicolon-joined first sentence; (c) normalizes `vs → vs.` (consistent with
rest of section after fix).

#### Theory T1-A second block, ¶3 (line 47)
**Before** (w=24, FH≈55):
> "El **peso** es evidencia cuantitativa (**no** veredicto). Declara **unidades** en el schema: `PEN`, `count` o `score`. Mezclar unidades en el mismo campo rompe agregaciones y rankings posteriores del workbench."

**After:** Acceptable as-is. Three tight sentences, clear ethical framing,
good cadence.

#### Theory T1-B, ¶1 (line 85)
**Before** (w=29, FH≈57):
> "Un **multigrafo** permite **varias aristas** entre el mismo par (varias transferencias, varios contactos). **No** colapses a una sola arista sin guardar el detalle fuente: el revisor necesita los `record_id` para auditar cada hecho."

**After:** Acceptable as-is.

#### Theory T1-B, ¶2 (line 86)
**Before** (w=37, FH≈42):
> "**Tiempo**: cada arista lleva `ts` o intervalo. Caminos y agregados **filtran por ventana** cuando el caso lo exija; no mezcles 2019 con 2026 sin documentarlo. Si falta `record_id`, el builder debe fallar de forma tipificada (rechazo explícito, no arista "huérfana" silenciosa)."

**After** (3 sentences):
> "**Tiempo**: cada arista lleva `ts` o intervalo. Caminos y agregados **filtran por ventana** cuando el caso lo exija; no mezcles 2019 con 2026 sin documentarlo. Si falta `record_id`, el builder debe fallar de forma tipificada: rechazo explícito, no arista "huérfana" silenciosa."

**Why:** Replace internal parenthetical with a colon to demote the gloss from
parenthetical to apposition; reads as a punchier contract.

#### Theory T1-B, ¶3 (line 87)
**Before** (w=29, FH≈46):
> "**Provenance** (`source_system`, `run_id`, `record_id`) responde "¿de dónde salió esta arista?". El revisor de CP-N3-B abre un hop y debe poder saltar al registro fuente en el ledger o CRM sintético. Sin provenance el grafo es solo layout: no sirve para auditoría ni para la cola humana."

**After:** Acceptable as-is.

#### Theory T2-A, ¶1 (line 123)
**Before** (w=24, FH≈15 — low because of comma density):
> "Construyes el grafo desde tablas: **entidades** (nodos persona/organización), **cuentas**, **transacciones** (aristas dirigidas) y **contactos** (email/teléfono/dirección como nodos o como aristas tipadas). Cada fila de tabla se proyecta a nodos y/o aristas con un etype del schema canónico."

**After** (3 sentences):
> "Construyes el grafo desde cuatro tablas. **Entidades** → nodos persona u organización; **cuentas** → nodos; **transacciones** → aristas dirigidas; **contactos** → email, teléfono o dirección como nodos o como aristas tipadas. Cada fila de tabla se proyecta a nodos y/o aristas con un etype del schema canónico."

**Why:** Converts the dense 4-item inline list into a bullet-style enumeration
(after the intro sentence). Reduces comma density from 5/24 to ~0/24 in the
first sentence. The list semicolon structure is standard Spanish
enumeration style.

#### Theory T2-A, ¶2 (line 124)
**Before** (w=31, FH≈49):
> "Patrón habitual: entity —`owns`→ account; account —`transfer`→ account; entity —`has_phone`/`has_email`→ valor de contacto. Cuando dos entidades apuntan al mismo valor, el revisor ve un **hecho de contacto compartido** — no parentesco ni fraude. El valor de contacto como **nodo** facilita detectar ese hecho sin inventar una arista persona–persona opaca."

**After:** Acceptable as-is. The first sentence is a deliberate schema-pattern
gloss; splitting it would break the parallel structure.

#### Theory T2-A, ¶3 (line 125)
**Before** (w=24, FH≈55):
> "Usa ids **sintéticos estables** (`ent-001`, `acc-1`) y dominios demo (`@example.pe`). Ids estables hacen la construcción **idempotente** (mismas filas → mismo grafo ordenado). Nunca cargues PII real en ejercicios del curso."

**After:** Acceptable as-is. Excellent 3-sentence rhythm.

#### Theory T2-B, ¶1 (line 176)
**Before** (w=29, FH≈49):
> "**Deduplicar nodos** tras el ER colapsa ids canónicos; conserva el mapa `raw_id → canonical_id` para reescribir aristas sin perder trazabilidad del matching de S30. Sin ese mapa, dos raw del mismo canónico generan aristas fantasmas o rompen el path del revisor."

**After:** Acceptable as-is.

#### Theory T2-B, ¶2 (line 177)
**Before** (w=27, FH≈50):
> "**Agregar aristas**: suma montos, cuenta eventos, min/max `ts` — y guarda una **capa de detalle** (lista de `record_id` o punteros a las filas fuente). El agregado acelera filtros y dashboards; el detalle responde "muéstrame las transacciones de este hop"."

**After:** Acceptable as-is.

#### Theory T2-B, ¶3 (line 178)
**Before** (w=24, FH≈54):
> "Si solo dejas el agregado, el revisor no puede explicar el camino con evidencia. El workbench de investigación (y el inicio de CP-N3-B) necesita **ambas capas**: sumario para priorizar y fuente para auditar."

**After:** Acceptable as-is.

#### Theory T3-A, ¶1 (line 218)
**Before** (w=30, FH≈46):
> "**Grado** (degree): número de vecinos (in/out en dirigidos). Sirve para filtrar **hubs** (nodos de alto grado) y priorizar exploración — **no** para culpar a un nodo. En grafos dirigidos, reporta in-degree y out-degree por separado cuando el flujo importa (p. ej. transferencias)."

**After:** Acceptable as-is.

#### Theory T3-A, ¶2 (line 219)
**Before** (w=18, FH≈19):
> "**Componentes conexas**: partición del grafo no dirigido subyacente. Un caso de revisión suele vivir en un **subgrafo acotado**; componentes aisladas ayudan a acotar ruido y a no mezclar islas irrelevantes en la misma vista."

(Note: second sentence = 24 w.)

**After:** Acceptable as-is. Low FH is driven by short first sentence (heading
gloss); not a real readability issue.

#### Theory T3-A, ¶3 (line 220)
**Before** (w=31, FH≈58):
> "**Caminos**: BFS/DFS con **límite de profundidad** (*hop limit*, máximo de saltos). El path **reproducible** lista nodos en orden estable (vecinos sorted) y, en producción, aristas + evidencia. Sin límite, caminos largos son caros y poco accionables para la cola humana."

**After** (3 sentences):
> "**Caminos**: BFS/DFS con **límite de profundidad** (*hop limit*, máximo de saltos). El path **reproducible** lista nodos en orden estable (vecinos sorted) y, en producción, incluye aristas y evidencia. Sin límite, los caminos largos son caros y poco accionables para la cola humana."

**Why:** (a) Replace `aristas + evidencia` (English-plus style) with `aristas
y evidencia` (Spanish conjunction); (b) add article `los` before `caminos
largos` for grammatical completeness.

#### Theory T3-B, ¶1 (line 283) — **Issue #2**
**Before** (w=38, FH≈37):
> "**Degree centrality** (grado normalizado) mide **cuántos vecinos** tiene un nodo: es **estructura**, no culpa. Un hub puede ser un procesador de pagos legítimo o un teléfono de call center compartido. *Betweenness* (cuántos caminos cortos pasan por el nodo) y *closeness* (qué tan cerca está del resto) existen en NetworkX; en S31 dominas **degree + interpretación** y dejas las otras para la documentación enlazada — sin fingir que ya las calculaste."

**After** (4 sentences):
> "**Degree centrality** (grado normalizado) mide **cuántos vecinos** tiene un nodo: es **estructura**, no culpa. Un hub puede ser un procesador de pagos legítimo o un teléfono de call center compartido. *Betweenness* mide cuántos caminos cortos pasan por el nodo; *closeness*, qué tan cerca está del resto. Ambas existen en NetworkX, pero en S31 dominas **degree + interpretación** y dejas las otras para la documentación enlazada — sin fingir que ya las calculaste."

**Why:** Splits the 38-word third sentence at the `NetworkX` boundary. The
two definitions now form their own sentence; the de-scoping decision gets its
own sentence for emphasis.

#### Theory T3-B, ¶2 (line 284)
**Before** (w=29, FH≈47):
> "Interpreta con contexto antes de priorizar: **tipo de arista** (¿solo `transfer` o también `shared_phone`?), **ventana temporal** (¿el grado creció en un pico reciente?) y si el nodo es **infraestructura** (`INF-…`) vs **persona** (`PER-…`). Un score alto solo ordena la cola de revisión humana; no cierra el caso."

**After:** Acceptable as-is. The parallel questions inside parens are
rhetorically effective.

#### Theory T3-B, ¶3 (line 285)
**Before** (w=27, FH≈44):
> "Nunca automatices "alta centralidad → fraude". Eso viola el espíritu de CP-N3-B y del workbench de S34: la métrica **informa** la investigación; el revisor **decide** con path + records + contexto de negocio. Reporta siempre métrica + tipos de arista + disclaimer de no-culpabilidad."

**After** (3 sentences):
> "Nunca automatices "alta centralidad → fraude". Eso viola el espíritu de CP-N3-B y del workbench de S34: la métrica **informa** la investigación; el revisor **decide** con path + records + contexto de negocio. Reporta siempre la métrica, los tipos de arista y el disclaimer de no-culpabilidad."

**Why:** Replace `+` with Spanish conjunctions `y`/`,` for grammatical
correctness (`métrica + tipos + disclaimer` reads as English-plus style).

#### Theory T4-A, ¶1 (line 317) — **Issue #3**
**Before** (w=35, FH≈65):
> "Extrae un **subgrafo de caso** (*ego-subgraph* o *ego-k*): el **seed** (semilla del caso — p. ej. la entidad bajo revisión) más vecinos a **k hops** (saltos), con filtros de tipo y/o ventana temporal. El revisor trabaja sobre ese recorte; no navega el grafo completo del banco."

**After** (3 sentences):
> "Extrae un **subgrafo de caso** (*ego-subgraph* o *ego-k*): el **seed** (semilla del caso) más vecinos a **k hops** (saltos). El **seed** suele ser la entidad bajo revisión. Puedes aplicar filtros de tipo y/o ventana temporal sobre el recorte. El revisor trabaja sobre ese recorte; no navega el grafo completo del banco."

**Why:** Removes the nested parenthetical `p. ej. la entidad bajo revisión`
inside the outer parenthetical `semilla del caso — …`. Spreads the definition
across two short sentences. The fourth sentence (the contrast) stays
emphatic.

#### Theory T4-A, ¶2 (line 318)
**Before** (w=26, FH≈47):
> "Prueba invariantes de construcción: sin self-loops basura, pesos ≥ 0, provenance presente en toda arista de evidencia, y construcción **idempotente** (mismas filas → mismo grafo ordenado). Cada bug (arista invertida, nodo huérfano, `record_id` perdido) merece un test de regresión con fixture sintético."

**After:** Acceptable as-is. The two-sentence rhythm (invariants → tests) is
clear.

#### Theory T4-A, ¶3 (line 319)
**Before** (w=33, FH≈49):
> "Tests típicos: cardinalidades, path existe/no existe, componente esperada, `ego(seed, k)` no incluye nodos fuera del radio. Mini-caso: seed `E1`, k=1 incluye el teléfono compartido `ph:900`; k=2 ya alcanza `E2` por ese contacto. El path `E1 → ph:900 → E2` es **hipótesis con evidencia**, no veredicto de fraude ni parentesco."

**After:** Acceptable as-is.

#### Theory T4-B, ¶1 (line 367) — **Issue #4**
**Before** (w=37, FH≈49):
> "Visualiza **subgrafos acotados**; no intentes dibujar 100k nodos en el navegador del revisor. A escala tipo SNAP (miles o millones de nodos), la política correcta es: **ego-k o componente del caso** para explorar, y **resumir** (top hubs, tamaños de componentes, conteos por etype) cuando `n_nodes` supera un umbral de render. Renderizar todo no es "más transparente": es ruido e inoperable."

**After** (4 sentences):
> "Visualiza **subgrafos acotados**; no intentes dibujar 100k nodos en el navegador del revisor. A escala tipo SNAP (miles o millones de nodos), la política correcta se divide en dos modos. Para explorar, usa **ego-k o la componente del caso**. Cuando `n_nodes` supera un umbral de render, **resume** con top hubs, tamaños de componentes y conteos por etype. Renderizar todo no es "más transparente": es ruido e inoperable."

**Why:** Splits the 37-word policy sentence into a 2-mode announcement + 2 mode
descriptions. The closing slogan stays as a punchline.

#### Theory T4-B, ¶2 (line 368)
**Before** (w=18, FH≈46):
> "**Privacidad**: enmascara PII en labels de la vista (email parcial, teléfono parcial). Los roles ven solo lo necesario para la revisión. Un layout bonito con PII completa es un **incidente de compliance**, no un entregable de portafolio."

**After:** Acceptable as-is.

#### Theory T4-B, ¶3 (line 369) — **Issue #1** (run-on, 53 words)
**Before** (1 paragraph, 2 sentences; second sentence = 53 w):
> "**Evidencia por arista — storyboard del revisor (CASO-LIM-031):** (1) abre el caso con seed `E1`; (2) expande ego k=2 y localiza el hop `E1 → ph:900 → E2`; (3) al hacer clic en cada hop ve `records`, `ts` y `source`; (4) lee el disclaimer de centralidad del hub de contacto; (5) **no** recibe auto-label de fraude ni parentesco — solo hipótesis con evidencia para la cola humana. Ese contrato alimenta CP-N3-B y el workbench de S34."

**After** (paragraph + numbered list + bridge):
> "**Evidencia por arista — storyboard del revisor (CASO-LIM-031):** el revisor abre el caso con seed `E1` y recorre cinco pasos:\n\n1. Expande ego k=2 y localiza el hop `E1 → ph:900 → E2`.\n2. Al hacer clic en cada hop, ve `records`, `ts` y `source`.\n3. Lee el disclaimer de centralidad del hub de contacto.\n4. **No** recibe auto-label de fraude ni parentesco, solo hipótesis con evidencia para la cola humana.\n5. Ese contrato alimenta CP-N3-B y el workbench de S34."

**Why:** Converts the run-on enumeration into an actual Markdown numbered list
(renders as `<ol>` on the live site). The 5-step protocol becomes a
checklist, exactly the affordance the workbench contract wants. The bridge
statement becomes step 5, preserving the CP-N3-B / S34 link.

#### Theory T4-B, callout (line 401)
**Before:**
> "Redacta labels por defecto. Muestra records del hop al revisor autorizado; nunca PII completa en capturas de portafolio."

**After:** Acceptable as-is.

### 6.2 I Do tab

#### iDo intro (line 408) — **Issue #5**
**Before** (2 sentences, first = 34 w):
> "Te muestro el inicio de CP-N3-B paso a paso: modelo tipado, multiaristas con provenance, proyección tablas→grafo, agregación con detalle, path con hop limit, degree con disclaimer, ego-k y vista redactada. Observa la salida de cada demo: es el contrato que luego practicarás en We Do."

**After** (3 sentences):
> "Te muestro el inicio de CP-N3-B paso a paso. Primero el modelo tipado, las multiaristas con provenance y la proyección tablas→grafo. Luego la agregación con detalle, el path con hop limit, el degree con disclaimer, el ego-k y la vista redactada. Observa la salida de cada demo: es el contrato que luego practicarás en We Do."

**Why:** Splits the 8-item enumeration into two thematic groups (construcción
vs. análisis). Reduces first-sentence length from 34 w to ~17 w.

#### iDo step descriptions (lines 414, 447, 480, 517, 553, 593, 624, 661)
Each is ≤14 words, single-sentence, with a clear verb. Acceptable as-is.

#### iDo step `why` fields (lines 441, 474, 511, 547, 588, 618, 655, 676)
All ≤11 words, single-sentence punchlines. Acceptable as-is. (Lowest FH = −14
on "Métrica estructural con interpretación limitada." — false alarm driven by
short length + syllable count.)

### 6.3 We Do tab

#### weDo intro (line 681)
**Before** (1 sentence, w=22):
> "24 ejercicios guiados → independientes → transferencia (T1–T4). Cada starter deja un hueco real de construcción o validación: completa el contrato de salida con el fixture sintético `CASO-LIM-031` (sin PII real; sin etiquetar fraude ni parentesco)."

**After:** Acceptable as-is. The first sentence (a count + arrow diagram) is
intentionally compact.

#### weDo exercise instructions — overview
24 instructions, each ~30–48 words. Most use the canonical structure:
> "S31-T{topic}-{letter}-E{n} · <imperative task>. <Output contract>. Fixture `CASO-LIM-031`{; <ethic>}."

This is **excellent consistency**. The 48-word `S31-T1-A-E2` instruction
(line 730) is the longest (Issue #24). Recommended rewrite:

**Before:**
> "S31-T1-A-E2 · Dada una lista de aristas dirigidas (src, dst, weight en PEN), calcula el **peso total saliente** por nodo (*out-strength*: suma de pesos de aristas que salen del nodo) e imprime el nodo con mayor out-strength, su valor y cuántos nodos tienen salida. Fixture `CASO-LIM-031`; datos sintéticos solo; sin fraude automático."

**After** (2 sentences):
> "S31-T1-A-E2 · Dada una lista de aristas dirigidas (`src`, `dst`, `weight` en PEN), calcula el **peso total saliente** por nodo (*out-strength*: la suma de pesos de las aristas que salen del nodo). Imprime el nodo con mayor out-strength, su valor y cuántos nodos tienen salida. Fixture `CASO-LIM-031`; datos sintéticos solo; sin fraude automático."

**Why:** Splits at the natural break (definition → output contract).

#### weDo hints
Most hints are short, code-prefixed fragments. Acceptable as-is. The
LanguageTool `UPPERCASE_SENTENCE_START` flags (27 instances) are false
positives because the hints deliberately open with code (`f = …`, `m[v].add(e)
por cada (e, v).`). No action needed beyond documentation.

### 6.4 You Do tab

#### youDo `context` (line 1812) — **Issue #30**
**Before** (3 sentences; first = 26 w):
> "Tras el ER de S30, construye un grafo sintético entity/account/contact/tx (fixture conceptual `CASO-LIM-031`, `@example.pe`) con multiaristas, provenance y consulta de camino reproducible con hop limit. El revisor debe poder abrir un path (p. ej. `E1 → ph:900 → E2`), ver records por hop y un disclaimer de centralidad — sin auto-label de fraude ni parentesco. Reporta degree solo como estructura."

**After** (4 sentences):
> "Tras el ER de S30, construye un grafo sintético con entidades, cuentas, contactos y transacciones. Usa el fixture conceptual `CASO-LIM-031` con `@example.pe`. El grafo debe tener multiaristas, provenance y consulta de camino reproducible con hop limit. El revisor debe poder abrir un path (p. ej. `E1 → ph:900 → E2`), ver records por hop y un disclaimer de centralidad — sin auto-label de fraude ni parentesco. Reporta degree solo como estructura."

**Why:** Splits the 26-word opener; removes the slash-list
`entity/account/contact/tx` in favour of Spanish `entidades, cuentas,
contactos y transacciones`; separates the fixture declaration from the
graph-construction requirement.

#### youDo `portfolioNote` (line 1889) — **Issue #27**
**Before** (1 sentence, w=32):
> "Inicio CP-N3-B: entrega un grafo temporal con evidencia, tests mínimos, política de escala documentada y una vista de path redactada lista para portafolio (puente natural hacia el workbench de S34)."

**After** (2 sentences):
> "Inicio CP-N3-B: entrega un grafo temporal con evidencia, tests mínimos y política de escala documentada. La vista de path redactada es la pieza lista para portafolio y el puente natural hacia el workbench de S34."

**Why:** Splits at the parenthetical bridge clause; promotes the S34 link to
its own sentence.

#### youDo `requirements` (lines 1820–1828)
Eight fragment-requirements. Acceptable as-is (rubric style). Optional: end
each fragment with a terminal period for consistency (currently mixed).

#### youDo `rubric` (lines 1891–1899)
Eight criteria with weights. Acceptable as-is.

### 6.5 Self Check tab

#### Questions Q1–Q10 (lines 1903–1972)

**Q8** has the gender-agreement issue (Issue #7):
- Option 4 (line 1955): *"dirigida con etype transfer y peso en PEN (u otra unidad documentada)"*
- Explanation (line 1957): *"transfer es dirigida; owns es entidad→cuenta; shared_phone es hecho de contacto."*

**After:**
- Option 4: *"dirigida con etype `transferencia` y peso en PEN (u otra unidad documentada)"*
- Explanation: *"`transfer` (o `transferencia`) es dirigida; `owns` es entidad→cuenta; `shared_phone` es un hecho de contacto."*

**Why:** Resolves the gender ambiguity by either using the Spanish feminine
`transferencia` (agrees with `dirigida`) or by treating `transfer` as a
masculine loan and switching to `dirigido`. The rewrite above uses
`transferencia` for elegance; the alternative is *"transfer es dirigido"*.

All other self-check questions and explanations are grammatically clean and
pedagogically well-formed.

### 6.6 jobRelevance (line 15) — **Issue #11**
**Before** (2 sentences; first = 29 w, FH 22.1):
> "En investigación de relaciones entre entidades (banca, BPO, compliance en Perú), necesitas un **grafo de evidencia**: nodos, aristas tipadas, agregados y caminos explicables para la cola de revisión humana. Tras el ER de S30, el grafo responde *cómo están conectadas* las entidades — no *quién es culpable*."

**After** (3 sentences):
> "En investigación de relaciones entre entidades — banca, BPO y compliance en Perú — necesitas un **grafo de evidencia**. Ese grafo se compone de nodos, aristas tipadas, agregados y caminos explicables para la cola de revisión humana. Tras el ER de S30, el grafo responde *cómo están conectadas* las entidades — no *quién es culpable*."

**Why:** Replaces the comma-heavy parenthetical with em-dashes for the
qualifier, splits the "necesitas X: A, B, C, D" into two sentences
(necesitas X / X se compone de…). First-sentence FH jumps from 22.1 → ~55.

### 6.7 tagline (line 8) — **Issue #9**
**Before:**
> "grafo temporal que responde cómo están conectados con camino reproducible y no convierte centralidad en culpabilidad"

**After:**
> "grafo de evidencia relacional: responde cómo están conectados con camino reproducible y sin convertir centralidad en culpabilidad"

**Why:** (a) Aligns the tagline adjective with the section title
(`relacional` instead of `temporal`); (b) uses a colon for the definition
instead of the loose `que responde` relative clause; (c) replaces `y no
convierte` with `y sin convertir` for tighter prose. Note: still no terminal
period (tagline style).

---

## 7. Proposed GitHub-style Diffs

> Diffs are against `src/lib/course/sections/s31-streaming-data.ts`.
> Line numbers refer to the *current* file; reviewers should re-locate by
> content match.

### Diff 1 — Issue #1: split run-on storyboard (line 369)

```diff
-        "**Evidencia por arista — storyboard del revisor (CASO-LIM-031):** (1) abre el caso con seed `E1`; (2) expande ego k=2 y localiza el hop `E1 → ph:900 → E2`; (3) al hacer clic en cada hop ve `records`, `ts` y `source`; (4) lee el disclaimer de centralidad del hub de contacto; (5) **no** recibe auto-label de fraude ni parentesco — solo hipótesis con evidencia para la cola humana. Ese contrato alimenta CP-N3-B y el workbench de S34.",
+        "**Evidencia por arista — storyboard del revisor (CASO-LIM-031):** el revisor abre el caso con seed `E1` y recorre cinco pasos:\n\n1. Expande ego k=2 y localiza el hop `E1 → ph:900 → E2`.\n2. Al hacer clic en cada hop, ve `records`, `ts` y `source`.\n3. Lee el disclaimer de centralidad del hub de contacto.\n4. **No** recibe auto-label de fraude ni parentesco: solo hipótesis con evidencia para la cola humana.\n5. Ese contrato alimenta CP-N3-B y el workbench de S34.",
```

### Diff 2 — Issue #2: split T3-B paragraph (line 283)

```diff
-        "**Degree centrality** (grado normalizado) mide **cuántos vecinos** tiene un nodo: es **estructura**, no culpa. Un hub puede ser un procesador de pagos legítimo o un teléfono de call center compartido. *Betweenness* (cuántos caminos cortos pasan por el nodo) y *closeness* (qué tan cerca está del resto) existen en NetworkX; en S31 dominas **degree + interpretación** y dejas las otras para la documentación enlazada — sin fingir que ya las calculaste.",
+        "**Degree centrality** (grado normalizado) mide **cuántos vecinos** tiene un nodo: es **estructura**, no culpa. Un hub puede ser un procesador de pagos legítimo o un teléfono de call center compartido. *Betweenness* mide cuántos caminos cortos pasan por el nodo; *closeness*, qué tan cerca está del resto. Ambas existen en NetworkX, pero en S31 dominas **degree + interpretación** y dejas las otras para la documentación enlazada — sin fingir que ya las calculaste.",
```

### Diff 3 — Issue #3: split T4-A paragraph (line 317)

```diff
-        "Extrae un **subgrafo de caso** (*ego-subgraph* o *ego-k*): el **seed** (semilla del caso — p. ej. la entidad bajo revisión) más vecinos a **k hops** (saltos), con filtros de tipo y/o ventana temporal. El revisor trabaja sobre ese recorte; no navega el grafo completo del banco.",
+        "Extrae un **subgrafo de caso** (*ego-subgraph* o *ego-k*): el **seed** (semilla del caso) más vecinos a **k hops** (saltos). El **seed** suele ser la entidad bajo revisión. Puedes aplicar filtros de tipo y/o ventana temporal sobre el recorte. El revisor trabaja sobre ese recorte; no navega el grafo completo del banco.",
```

### Diff 4 — Issue #4: split T4-B scale-policy paragraph (line 367)

```diff
-        "Visualiza **subgrafos acotados**; no intentes dibujar 100k nodos en el navegador del revisor. A escala tipo SNAP (miles o millones de nodos), la política correcta es: **ego-k o componente del caso** para explorar, y **resumir** (top hubs, tamaños de componentes, conteos por etype) cuando `n_nodes` supera un umbral de render. Renderizar todo no es "más transparente": es ruido e inoperable.",
+        "Visualiza **subgrafos acotados**; no intentes dibujar 100k nodos en el navegador del revisor. A escala tipo SNAP (miles o millones de nodos), la política correcta se divide en dos modos. Para explorar, usa **ego-k o la componente del caso**. Cuando `n_nodes` supera un umbral de render, **resume** con top hubs, tamaños de componentes y conteos por etype. Renderizar todo no es "más transparente": es ruido e inoperable.",
```

### Diff 5 — Issue #7: gender agreement in self-check Q8 (lines 1955 & 1957)

```diff
-        options: ["no dirigida con etype owns", "sin tipo, solo con layout visual", "siempre como shared_phone", "dirigida con etype transfer y peso en PEN (u otra unidad documentada)"],
+        options: ["no dirigida con etype `owns`", "sin tipo, solo con layout visual", "siempre como `shared_phone`", "dirigida con etype `transferencia` y peso en PEN (u otra unidad documentada)"],
         correctIndex: 3,
         explanation:
-          "transfer es dirigida; owns es entidad→cuenta; shared_phone es hecho de contacto.",
+          "`transfer` (o `transferencia`) es dirigida; `owns` es entidad→cuenta; `shared_phone` es un hecho de contacto.",
```

### Diff 6 — Issue #8: normalize `vs` → `vs.` (multiple lines)

```diff
-        "Dirigido vs no dirigido: las transferencias son **dirigidas**; "comparte teléfono/dirección" suele modelarse **no dirigido** (o con dos aristas simétrica si tu store lo exige). Elige una convención, documéntala en el schema y no la mezcles en el mismo etype.",
+        "Dirigido vs. no dirigido: las transferencias son **dirigidas**. "Comparte teléfono/dirección" suele modelarse **no dirigido** (o con dos aristas simétricas si tu store lo exige). Elige una convención, documéntala en el schema y no la mezcles en el mismo etype.",
```
(Note: also fixes `simétrica → simétricas` agreement and splits the
semicolon-joined first sentence. Apply the same `vs → vs.` normalization at
lines 46, 1441, 1967 — see Issue #8 inventory.)

### Diff 7 — Issue #9: tagline alignment (line 8)

```diff
-  tagline: "grafo temporal que responde cómo están conectados con camino reproducible y no convierte centralidad en culpabilidad",
+  tagline: "grafo de evidencia relacional: responde cómo están conectados con camino reproducible y sin convertir centralidad en culpabilidad",
```

### Diff 8 — Issue #10: rename file (out-of-section, repo-wide)

```diff
- src/lib/course/sections/s31-streaming-data.ts
+ src/lib/course/sections/s31-graph-evidence.ts
```
Plus update `src/lib/course/index.ts`:
```diff
-import { section31 } from './sections/s31-streaming-data'
+import { section31 } from './sections/s31-graph-evidence'
```

### Diff 9 — Issue #11: split jobRelevance first sentence (line 15)

```diff
-  jobRelevance:
-    "En investigación de relaciones entre entidades (banca, BPO, compliance en Perú), necesitas un **grafo de evidencia**: nodos, aristas tipadas, agregados y caminos explicables para la cola de revisión humana. Tras el ER de S30, el grafo responde *cómo están conectadas* las entidades — no *quién es culpable*.",
+  jobRelevance:
+    "En investigación de relaciones entre entidades — banca, BPO y compliance en Perú — necesitas un **grafo de evidencia**. Ese grafo se compone de nodos, aristas tipadas, agregados y caminos explicables para la cola de revisión humana. Tras el ER de S30, el grafo responde *cómo están conectadas* las entidades — no *quién es culpable*.",
```

### Diff 10 — Issue #24: split weDo S31-T1-A-E2 instruction (line 730)

```diff
-        instruction:
-          "S31-T1-A-E2 · Dada una lista de aristas dirigidas (src, dst, weight en PEN), calcula el **peso total saliente** por nodo (*out-strength*: suma de pesos de aristas que salen del nodo) e imprime el nodo con mayor out-strength, su valor y cuántos nodos tienen salida. Fixture `CASO-LIM-031`; datos sintéticos solo; sin fraude automático.",
+        instruction:
+          "S31-T1-A-E2 · Dada una lista de aristas dirigidas (`src`, `dst`, `weight` en PEN), calcula el **peso total saliente** por nodo (*out-strength*: la suma de pesos de las aristas que salen del nodo). Imprime el nodo con mayor out-strength, su valor y cuántos nodos tienen salida. Fixture `CASO-LIM-031`; datos sintéticos solo; sin fraude automático.",
```

### Diff 11 — Issue #30: split youDo context (line 1812)

```diff
-    context:
-      "Tras el ER de S30, construye un grafo sintético entity/account/contact/tx (fixture conceptual `CASO-LIM-031`, `@example.pe`) con multiaristas, provenance y consulta de camino reproducible con hop limit. El revisor debe poder abrir un path (p. ej. `E1 → ph:900 → E2`), ver records por hop y un disclaimer de centralidad — sin auto-label de fraude ni parentesco. Reporta degree solo como estructura.",
+    context:
+      "Tras el ER de S30, construye un grafo sintético con entidades, cuentas, contactos y transacciones. Usa el fixture conceptual `CASO-LIM-031` con `@example.pe`. El grafo debe tener multiaristas, provenance y consulta de camino reproducible con hop limit. El revisor debe poder abrir un path (p. ej. `E1 → ph:900 → E2`), ver records por hop y un disclaimer de centralidad — sin auto-label de fraude ni parentesco. Reporta degree solo como estructura.",
```

### Diff 12 — Issue #27: split youDo portfolioNote (line 1889)

```diff
-    portfolioNote:
-      "Inicio CP-N3-B: entrega un grafo temporal con evidencia, tests mínimos, política de escala documentada y una vista de path redactada lista para portafolio (puente natural hacia el workbench de S34).",
+    portfolioNote:
+      "Inicio CP-N3-B: entrega un grafo temporal con evidencia, tests mínimos y política de escala documentada. La vista de path redactada es la pieza lista para portafolio y el puente natural hacia el workbench de S34.",
```

### Diff 13 — Issue #5: split iDo intro (line 408)

```diff
-    intro: "Te muestro el inicio de CP-N3-B paso a paso: modelo tipado, multiaristas con provenance, proyección tablas→grafo, agregación con detalle, path con hop limit, degree con disclaimer, ego-k y vista redactada. Observa la salida de cada demo: es el contrato que luego practicarás en We Do.",
+    intro: "Te muestro el inicio de CP-N3-B paso a paso. Primero el modelo tipado, las multiaristas con provenance y la proyección tablas→grafo. Luego la agregación con detalle, el path con hop limit, el degree con disclaimer, el ego-k y la vista redactada. Observa la salida de cada demo: es el contrato que luego practicarás en We Do.",
```

### Diff 14 — Issue #23: replace English "shared-contact" (line 169)

```diff
-          "Modelar el valor de contacto como nodo facilita detectar shared-contact sin inventar parentesco ni fraude: es un hecho de contacto compartido a revisar, no un veredicto.",
+          "Modelar el valor de contacto como nodo facilita detectar contactos compartidos sin inventar parentesco ni fraude: es un hecho de contacto compartido a revisar, no un veredicto.",
```

### Diff 15 — Theory T3-A ¶3: replace English `+` with `y` (line 220)

```diff
-        "**Caminos**: BFS/DFS con **límite de profundidad** (*hop limit*, máximo de saltos). El path **reproducible** lista nodos en orden estable (vecinos sorted) y, en producción, aristas + evidencia. Sin límite, caminos largos son caros y poco accionables para la cola humana.",
+        "**Caminos**: BFS/DFS con **límite de profundidad** (*hop limit*, máximo de saltos). El path **reproducible** lista nodos en orden estable (vecinos sorted) y, en producción, incluye aristas y evidencia. Sin límite, los caminos largos son caros y poco accionables para la cola humana.",
```

### Diff 16 — Theory T3-B ¶3: replace English `+` with `y` (line 285)

```diff
-        "Nunca automatices "alta centralidad → fraude". Eso viola el espíritu de CP-N3-B y del workbench de S34: la métrica **informa** la investigación; el revisor **decide** con path + records + contexto de negocio. Reporta siempre métrica + tipos de arista + disclaimer de no-culpabilidad.",
+        "Nunca automatices "alta centralidad → fraude". Eso viola el espíritu de CP-N3-B y del workbench de S34: la métrica **informa** la investigación; el revisor **decide** con path, records y contexto de negocio. Reporta siempre la métrica, los tipos de arista y el disclaimer de no-culpabilidad.",
```

### Diff 17 — Theory T2-A ¶1: convert dense inline list (line 123)

```diff
-        "Construyes el grafo desde tablas: **entidades** (nodos persona/organización), **cuentas**, **transacciones** (aristas dirigidas) y **contactos** (email/teléfono/dirección como nodos o como aristas tipadas). Cada fila de tabla se proyecta a nodos y/o aristas con un etype del schema canónico.",
+        "Construyes el grafo desde cuatro tablas. **Entidades** → nodos persona u organización; **cuentas** → nodos; **transacciones** → aristas dirigidas; **contactos** → email, teléfono o dirección como nodos o como aristas tipadas. Cada fila de tabla se proyecta a nodos y/o aristas con un etype del schema canónico.",
```

### Diff 18 — Theory T1-A ¶1: split first sentence (line 30)

```diff
-        "En S30 respondiste **¿misma entidad?** Aquí **inicias CP-N3-B**: modelar **cómo están conectadas** las entidades resueltas con caminos reproducibles y **evidencia por arista**. El grafo *explica* conexiones auditables; **no** etiqueta fraude ni parentesco.",
+        "En S30 respondiste **¿misma entidad?** Aquí **inicias CP-N3-B** y pasas a modelar **cómo están conectadas** las entidades resueltas. Los caminos son reproducibles y cada arista lleva **evidencia por arista**. El grafo *explica* conexiones auditables; **no** etiqueta fraude ni parentesco.",
```

### Diff 19 — Theory T1-A ¶2: split first sentence and fix `simétrica` (line 46)

```diff
-        "Dirigido vs no dirigido: las transferencias son **dirigidas**; "comparte teléfono/dirección" suele modelarse **no dirigido** (o con dos aristas simétrica si tu store lo exige). Elige una convención, documéntala en el schema y no la mezcles en el mismo etype.",
+        "Dirigido vs. no dirigido: las transferencias son **dirigidas**. "Comparte teléfono/dirección" suele modelarse **no dirigido** (o con dos aristas simétricas si tu store lo exige). Elige una convención, documéntala en el schema y no la mezcles en el mismo etype.",
```

---

## 8. Recommended Priority Order for Fixing

Ranked by (pedagogical impact × ease of fix):

| Priority | Issue # | Fix | Effort | Impact |
|---|---|---|---|---|
| **P0** | #1 | Split run-on storyboard (line 369) into numbered list | S | H — unlocks the 5-step protocol as a checklist |
| **P0** | #7 | Fix gender agreement in self-check Q8 (`transfer es dirigida` → `transfer es dirigido` or `transferencia`) | S | M — grammatical correctness in exam |
| **P1** | #2 | Split T3-B 38-word sentence (line 283) | S | M — readability of central definitional paragraph |
| **P1** | #4 | Split T4-B 37-word scale-policy sentence (line 367) | S | M — clarity of the viz policy |
| **P1** | #11 | Split jobRelevance 29-word opener (line 15) | S | M — first-impression readability |
| **P1** | #3 | Split T4-A 35-word sentence (line 317) | S | M — clarity of ego-k definition |
| **P1** | #24 | Split weDo S31-T1-A-E2 48-word instruction (line 730) | S | M — exercise readability |
| **P2** | #30 | Split youDo context 26-word opener (line 1812) | S | L-M — capstone brief clarity |
| **P2** | #5, #27 | Split iDo intro and portfolioNote | S | L — cadence polish |
| **P2** | #9 | Align tagline adjective with title | S | L — first-impression consistency |
| **P2** | #23 | Replace English `shared-contact` with Spanish | S | L — code-switch consistency |
| **P2** | #15, #16, #17 | Replace English `+` and dense inline lists with Spanish `y`/enumeration | S | L — grammatical consistency |
| **P2** | #18, #19 | Split T1-A intro and T1-A ¶2 (also fixes `simétrica` agreement) | S | L — readability polish |
| **P3** | #8 | Normalize `vs` → `vs.` across the section | S | L — stylistic consistency |
| **P3** | #10 | Rename file `s31-streaming-data.ts` → `s31-graph-evidence.ts` (requires index update) | M | L — repo navigability |
| **P3** | #28 | Replace `'…'` with `«…»` for quoted speech (Spanish typography) | S | L — typographic correctness |
| **Skip** | #12, #13, #14, #17, #20, #21, #22 | LanguageTool false positives and intentional fragments | — | No action |

Legend: Effort S = small (<5 min), M = medium (5–30 min). Impact H/M/L per
pedagogical literature (Mayer's segmenting principle for split runs-on; RAE
gender-agreement for issue #7; first-impression hook for jobRelevance).

---

## 9. Graph Memory Update Notes (for shared context files)

These notes are intended for the orchestrator's shared context (graph memory)
so downstream Fixer agents and other section auditors can reuse the findings.

### Section-level graph nodes (S31)

- **S31 (node)**: phase 2, capstone CP-N3-B (start), 18h, level "Competente a
  experto". Topic: typed-edge evidence graphs with provenance, multigraph
  temporal, ego-subgraphs, centrality with bounded interpretation, privacy.
  Ethics gate: `centralidad ≠ culpa`, `shared_contact ≠ parentesco`, no
  auto-fraud labels.
- **Edges (curriculum graph)**:
  - `S30 → S31`: ER (canonical ids) feeds graph nodes; S30's Union-Find
    clusters become node sets.
  - `S31 → S34`: evidence graph feeds the workbench (path + records + disclaimer).
  - `S31 → S29` (conceptual): graph evidence lives in SQL store (re-used in
    S29 ORM).
  - `S31 ↔ S22` (ethic): same non-culpability stance (`matching ≠ fraude` →
    `centralidad ≠ culpa`).

### Quality edges (this audit)

- **S31 — quality_score → 8.4/10** (composite: 10 − 1.0 [run-on + gender issue]
  − 0.4 [6 long sentences] − 0.2 [style consistency] = 8.4).
- **S31 — has_no_meta_leaks → true**.
- **S31 — uses_synthetic_fixture → CASO-LIM-031 / @example.pe / run_id=cpn3b-01**.
- **S31 — pedagogical_pattern → I-Do-8-demos × We-Do-24-exercises × You-Do-capstone × Self-Check-10-MCQ**.
- **S31 — readability → FH=63.7, INFLESZ=58.8, WPS=10.3 (all healthy for technical)**.

### Reusable patterns observed (for cross-section consistency)

1. **Synthetic-fixture convention** `CASO-LIM-0NN` + `@example.pe` + `run_id=cpnNb-NN` — consistent across S22, S30, S31. **Recommend**: future sections (S32+) follow the same convention.
2. **Ethics disclaimer boilerplate** (S31 uses 4+ phrasings for the same
   idea — "sin PII real; sin etiquetar fraude ni parentesco", "sin fraude
   automático", "datos sintéticos solo; sin fraude ni parentesco", "Fixture
   `CASO-LIM-031` (run_id=cpn3b-01, @example.pe); datos sintéticos solo; sin
   fraude ni parentesco"). **Recommend**: define a canonical one-liner in a
   shared constant (e.g. `ETHIC_NOTE_31`) and reuse verbatim. See Issue #18.
3. **Code-noun gender convention**: S31 inconsistently genders English loan
   nouns (`el path`, `el hub`, `el hop`, `el seed`, `el ego-k`, `el builder`,
   `el ledger` — masculine; `transfer es dirigida` — feminine exception).
   **Recommend**: default to masculine for English loan nouns, document in
   repo style guide. See Issue #7.
4. **`vs` vs. `vs.`**: pick one. RAE prefers `vs.`. **Recommend**: enforce
   `vs.` in repo-wide lint. See Issue #8.
5. **Filename drift**: S30 (`s30-security-infra.ts` = ER) and S31
   (`s31-streaming-data.ts` = graphs) both have legacy filenames that don't
   match content. **Recommend**: a one-time repo-wide rename pass; consider
   adding a guard test that asserts `sNN-{slug}.ts` filename matches
   `sectionNN.title`.

### False-positive catalogue (for downstream grammar auditors)

When running LanguageTool on similar Phase-2 sections, the following rule IDs
produce mostly false positives on this material:

- `MORFOLOGIK_RULE_ES` — fires on every English/code token (`NetworkX`,
  `transfer`, `record_id`, `cpn3b-01`). Filter out.
- `UPPERCASE_SENTENCE_START` — fires on hint strings that start with code
  (`f = [e for e in edges if e['ts'] >= '2026-02-01'].`). Filter out
  when the sentence starts with a backtick/code variable.
- `PUNTO_EN_ABREVIATURAS` — fires on `vs` (acceptable without period in tech
  context).
- `NUMBERS_IN_WORDS` — fires on fixture IDs (`CASO-LIM-031`, `cpn3b-01`).
  Filter out.
- `NO_SEPARADO` — fires on `re-ejecución`, `re-runs` (both *correct* per RAE
  when prefix `re-` precedes a base starting with `e`).
- `DIACRITICS_OTHERS` on `testeable` — false positive; `testeable` is a grave
  word ending in vowel, no tilde per RAE.
- `NOUN_PLURAL2` on `filas de tabla` — false positive; singular generic
  reading is correct.
- `SINGLE_CHARACTER` on `n`, `b`, `k`, `v` — fires on single-letter code
  variables inside hint strings. Filter out.

Real-rule findings worth acting on (apply this shortlist as the "signal"):
- `CONCORDANCIAS_ATRIBUTO` (verb-noun agreement) — 1 real instance (Issue #7).
- `AGREEMENT_ADJ_NOUN` — usually false positive on English loan nouns.
- `ES_SPLIT_WORDS` — verify case-by-case; usually false positive on imperatives.
- `WHITESPACE_RULE` — usually inside code docstrings; verify.

### Hand-off to Fixer

The Fixer prompt should apply Diffs 1–19 in priority order (P0 → P3). All
diffs are localized to `src/lib/course/sections/s31-streaming-data.ts` (plus
`src/lib/course/index.ts` for the optional filename rename, Diff 8). No other
section files need to be touched. After fixes, re-run the metrics pipeline
(`_s31_metrics.py`) and confirm: WPS_max drops from 53 to <40, run-on count
drops from 1 to 0, long-sentence count drops from 6 to ≤3, and the
self-check Q8 explanation passes LanguageTool without `CONCORDANCIAS_ATRIBUTO`.

---

## 10. Method Note (research summary)

Per `_GRAMMAR_SUBPLAN.md`:

**Surface metrics (Spanish readability formulas):**
- **Fernández-Huerta (1959)**: `206.84 − 60·(syllables/word) − 1.02·(words/sentence)` — Spanish Flesch adaptation. Bands: ≥90 muy fácil; 70–89 fácil; 60–69 normal; 50–59 bastante difícil; 30–49 difícil; <30 muy difícil. For *technical* curriculum, "normal / bastante difícil" (~50–70) is healthy.
- **Szigriszt-Pazos / INFLESZ**: `206.835 − 62.3·(syllables/word) − (words/sentence)`. Similar bands.
- **WPS** (words per sentence): pedagogy soft target 15–32 for technical Spanish.
- **SPW** (syllables per word): lexical complexity proxy.

**Syllable counter** uses Spanish vowel-group heuristic: consecutive strong+strong = 2 syllables; accented vowel + adjacent = 2 (hiato); strong+weak or weak+strong diphthong = 1.

**Heuristic rules (per sentence and per paragraph):**
- Long >32 words → flag `LONG`. Run-on >45 words → flag `RUNON`.
- Missing terminal `.?!`, missing `¿`/`¡`, unbalanced `()[]«»`, double space, space-before-punct.
- Gerund pile-up ≥3, high comma density >0.12, repeated word `\b(\w+)\s+\1\b`, anaphoric monotony (≥3 same sentence-start in a paragraph).

**Rule-based grammar engine:** LanguageTool (`language=es`) public API, 2 chunks (18k chars each), 4s throttle. 628 raw matches; 569 MORFOLOGIK (filtered as mostly false positives on English/code); 59 non-MORFOLOGIK, of which ~28 are real-prose false positives (code-prefixed hint strings, fixture IDs, technical loans). 1 real rule finding: `CONCORDANCIAS_ATRIBUTO` on `transfer es dirigida` (Issue #7).

**Composite section score:** Start at 10; subtract weighted H/M/L findings; light penalty if FH extreme. S31: 10 − 1.0 (H: run-on + gender agreement) − 0.4 (M: 6 long sentences) − 0.2 (L: style consistency) = **8.4**.

**Validation:** Nonzero prose extraction (288 paragraphs, 384 sentences). FH in plausible range (min −37 on a 4-word heading, max 142 on a 5-word sentence, mean 63.7 — all consistent with formula behaviour). Documented false-positive classes per the catalogue above.

**Risks & mitigations:** LT rate-limit avoided by chunking + 4s sleep; false positives on code/tech nouns filtered by severity "low" or by catalogue; template strings with `${}` not present (S31 uses static literals).

**Out of scope (this pass):** Auto-editing (audit-only, propose diffs not apply); full semantic discourse coherence; human CEFR labeling; premium LT features.

---

**This is the complete Explorer report for Section 31. Ready for the Fixer prompt.**
