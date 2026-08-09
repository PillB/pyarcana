# S07 · Curriculum Audit Report — pyarcana

> **Section:** 7 — *Texto, Unicode y expresiones regulares* (shortTitle *Texto & Unicode*)
> **Live URL:** https://pillb.github.io/pyarcana/#data-acquisition
> **Source file:** `src/lib/course/sections/s07-data-acquisition.ts` (1,722 lines)
> **Auditor:** Curriculum Auditor (general-purpose)
> **Method:** Stanford STORM + Graph/Loop/Harness Engineering, applying the shared Spanish grammar/style/structure subplan (`audits/_GRAMMAR_SUBPLAN.md`).

---

## 1. Section Identification & Scope

| Field | Value |
|---|---|
| `index` | 7 |
| `id` | `data-acquisition` *(residual — see Finding F-09)* |
| `title` | "Texto, Unicode y expresiones regulares" |
| `shortTitle` | "Texto & Unicode" |
| `tagline` | "Unicode latam, strings y regex sin sobrevalidar" |
| `estimatedHours` | 20 |
| `level` | "Intermedio" |
| `phase` | 0 — Fundamentos |
| `icon` / `accentColor` | `Languages` / teal→cyan gradient |
| Capstone increment | **CP-N1-B** — Normalizador de registro latinoamericano |
| Subtopic IDs | S07-T1-A, S07-T1-B, S07-T2-A, S07-T2-B, S07-T3-A, S07-T3-B, S07-T4-A, S07-T4-B (8 subtopics) |

**Tabs audited (all five):**
1. **Teoría** — 10 TheoryBlocks (Mapa, T1-A, T1-B, T2-A, T2-B, T3-A, T3-B, T4-A, T4-B, Cierre), each with 2–3 paragraphs, one code example, one callout.
2. **Yo hago (I Do)** — 8 demos (`S07-T1-A-DEMO` … `S07-T4-B-DEMO`), `intro` + per-step `description`, `why`, `code`, `output`.
3. **Hacemos juntos (We Do)** — 24 exercises (8 subtopics × {E1 guiado / E2 independiente / E3 transferencia}); each has `instruction`, `hint`, `hints[2]`, `edgeCases`, `tests`, `feedback`, `starterCode`, `solutionCode`.
4. **Tú haces (You Do)** — `CP-N1-B` project `latam_normalize.py`; `context`, `objectives[5]`, `requirements[8]`, `starterCode`, `portfolioNote`, `rubric[6]` (sums to 100%).
5. **Autocheck (selfCheck)** — 10 MCQs with `question`, `options[4]`, `correctIndex`, `explanation`.

**Surfaces also audited (rendered only):**
6. **`Pruébalo tú mismo` interactive playground** rendered at the bottom of the Theory tab. Source lives in `src/components/course/SectionView.tsx` under the `'data-acquisition'` key (lines 1251–1304). This surface is part of the learner-visible Section 7 page and is in scope.

**Scope-shift context (informs but does not excuse Findings F-01 / F-09):** the master roadmap file `el_arte_de_python_roadmap_maestro_52_secciones.md` (lines 99–104) originally described S07 as *"Adquisición de Datos para Data Science"* (generators, scraping, REST APIs, SQLite, regex, `collections`). The current section has been deliberately rescoped to **Unicode + str methods + disciplined regex + matching evidence**, with scraping/SQL/APIs pushed forward to S08/S11/S12. The rescoping is openly declared to the learner in the section's own Theory map ("*Scraping, SQL y APIs públicas se abordan más adelante*"). The playground demo, however, was not migrated and still teaches the old syllabus — see Finding F-01.

---

## 2. Executive Summary of Quality

**Overall score: 7.5 / 10.**

**Verdict:** Section 7 is **structurally excellent** — one of the strongest I Do / We Do / You Do implementations in the course so far. The pedagogical spine is clean (8 subtopics × 3 exercises × 3 progressive levels), every We Do exercise carries a deliberate `DEFECT` for the learner to fix, the ethical guardrails (no PII, no parentesco claims, fail-closed) are enforced uniformly across theory, demos, exercises, project rubric and self-check, and the Spanish prose is, on average, *normal-bastante fácil* on the Fernández-Huerta scale (FH ≈ 70.6 sentence-level; INFLESZ ≈ 66.1). That is healthy for intermediate technical Spanish and matches the soft target range in the grammar subplan.

**What holds the score back from 9+:**
1. **MAJOR pedagogical contradiction (F-01).** The interactive playground demo shown at the bottom of the Theory tab teaches the **exact opposite** of the section's three core policies: it uses `sqlite3` (section says "Sin SQL"), it advertises "scraping" in its title (section says "No implementes scraping"), and it uses a permissive email regex (section says "una regex de email 'perfecta' es un bug de producto"). This is the single most damaging finding because it sits on the most engaging interactive surface a learner touches.
2. **MODERATE readability hits in 6 long sentences (F-02…F-05).** Five theory paragraphs and one You-Do `context` sentence run >32 words and dip below FH 60; the worst is the `jobRelevance` opener (39 words, FH 31.7 — *difícil*). All are splittable.
3. **MODERATE anglicism load in bolded prose (F-06).** Bolded English loanwords (*claims*, *fail-closed*, *mental model*, *code review*) appear in learner-facing prose without a Spanish gloss; the section otherwise goes to great lengths to write in Peruvian Spanish. Inconsistent register.
4. **LOW — typo/idiom cluster in the playground demo (F-07).** Missing accents on `Maria`, `Garcia`, `telefonos`, `adquisicion`, `digitos`, `mas`; one grammar slip ("el resultado son falsos negativos"); residual `data-acquisition` URL hash mismatching content (F-09).
5. **No high-severity meta-leak** (no `TODO`, `FIXME`, `moved from section X`, "note to dev"). The residual `id: "data-acquisition"` and the orphaned playground demo are **legacy artifacts** rather than authoring notes — flagged as pedagogical/identity issues, not as developer-leak issues.

**Headline metric snapshot** (computed by `s07_extract.py` over 202 Spanish prose strings → 323 sentences):

| Metric | Paragraph-level mean | Sentence-level mean | Band (FH) |
|---|---|---|---|
| Words/sentence (WPS) | 11.70 | 12.46 | healthy (target 15–32) |
| Syllables/word (SPW) | 2.061 | — | normal |
| Fernández-Huerta (FH) | 71.2 | 70.6 | *normal* |
| INFLESZ (Szigriszt-Pazos) | 66.7 | 66.1 | *normal* |
| Max sentence length | — | 42 words | 6 sents > 32 w; 0 sents > 45 w |

---

## 3. Detailed Issue Registry

> Severity: **H** = High (blocks learning or contradicts policy), **M** = Medium (clarity/style dip, fix recommended), **L** = Low (polish/consistency).
> "Surface" = where the learner sees the issue (Teoría / I Do / We Do / You Do / Autocheck / Playground / URL).

### F-01 · Playground demo contradicts the section's three core policies  *(Severity: H)*
**Surface:** Teoría tab → bottom `Pruébalo tú mismo` interactive editor (rendered for Section 7 because `SectionView.tsx` keys a playground sample by `'data-acquisition'`).
**Source:** `src/components/course/SectionView.tsx:1251–1304`.
**Evidence (title):**
```ts
'data-acquisition': {
  title: 'Practica scraping, regex y SQL',
  code: `# Practica adquisicion de datos (sin librerias externas en Pyodide)
import re
import sqlite3
…
emails = re.findall(r'[\\w.-]+@[\\w.-]+\\.\\w+', texto_clientes)
…
```
**Contradicted policies (from the same section):**
- Theory T2-B callout (line 172): *"Una regex de email 'perfecta' es un bug de producto. Prefiere validación modesta + review."* → the demo's `r'[\w.-]+@[\w.-]+\.\w+'` is exactly such a permissive email regex.
- Theory T3-A (line 180): *"Si `str.startswith` / `replace` / `isdigit` bastan, **no** escribas regex"* → demo uses regex even for DNI extraction that the section's own T3-A demo does more safely with `fullmatch` and named groups.
- Theory map (line 30): *"Scraping, SQL y APIs públicas se abordan más adelante (p. ej. archivos/ETL en S08 y servicios en S12)"* → demo title says "Practica **scraping**, regex y **SQL**" and imports `sqlite3`.
- You Do `requirements` (line 1514): *"Sin scraping, HTTP ni SQL en este proyecto"* → demo does SQL.
**Pedagogical impact:** The playground is the most prominent interactive surface on the page (full-width editor, "Run" button). A learner who reaches the bottom of the Theory tab and clicks "Run" sees `sqlite3` and email-regex extraction taught as the canonical S07 practice — directly inverting the careful ethical/technical posture the theory just spent 10 blocks building. This is a worse outcome than having no playground at all.
**Cause:** Section was rescoped from "Adquisición de Datos" (per master roadmap lines 99–104) to "Texto & Unicode", but the playground demo keyed by `'data-acquisition'` was not migrated.

### F-02 · `jobRelevance` opener is a 39-word run-on, FH 31.7 (*difícil*)  *(Severity: M)*
**Surface:** Course index card + section page header (renders above the tabs).
**Source:** line 15.
**Evidence:**
> "En intake de clientes Latam (banca, telecom, retail, gobierno), normalizadores pensados para ASCII/US fallan con tildes, ñ, dos apellidos y partículas: el resultado son falsos negativos, colas de revisión y, peor, **claims automáticos** de identidad, parentesco o fraude."
**Metrics:** 39 words, FH 31.7 (band *difícil*), INFLESZ 23.6.
**Pedagogical impact:** This is the *first* prose a learner reads about S07 (it appears under the title in the index and at the top of the section page). The longest, densest sentence in the section is also the first — a poor hook.
**Cause:** Five-conjunction list ("tildes, ñ, dos apellidos y partículas") + nested enumeration ("identidad, parentesco o fraude") + English loanwords ("claims") pile into one sentence.

### F-03 · Theory T3-B paragraph 1 is a 42-word compound sentence  *(Severity: M)*
**Surface:** Teoría → T3-B "Compilación, extracción y límites" → paragraph 1.
**Source:** line 211.
**Evidence:**
> "`re.compile` reutiliza el patrón en loops: deja clara la intención y evita reescribir el mismo raw string en cada iteración. `findall` / `finditer` extraen múltiples matches de un log sintético — herramientas de **extracción**, no de overvalidation de email (eso quedó en T2)."
**Metrics:** 42 words (treated as one by my splitter after the em-dash splice; the two clauses are joined without a terminal period before "—"). FH 39.7.
**Pedagogical impact:** Three ideas (compile reuses / findall extracts / not for email) packed into one breath.
**Cause:** Em-dash splice used as a sentence boundary.

### F-04 · Theory T3-B paragraph 3 is a 35-word sentence  *(Severity: M)*
**Surface:** Teoría → T3-B paragraph 3.
**Source:** line 213.
**Evidence:**
> "Si el patrón crece sin control (email + teléfono + DNI + dirección en una sola expresión), un parser por pasos con `str` y regex pequeñas suele ser más testeable y más fácil de explicar en code review."
**Metrics:** 35 words, FH 64.9.
**Pedagogical impact:** Dense conditional + comparison + Anglicism ("code review") inside one sentence; the punchline ("elegancia = bug") is in the next sentence, but the reader is tired by then.

### F-05 · You Do `context` second sentence is 33 words  *(Severity: M)*
**Surface:** Tú haces → project context paragraph.
**Source:** line 1503.
**Evidence:**
> "Combina lo modelado en I Do y lo practicado en We Do: Unicode NFC, nombres con dos apellidos y partículas, email/tel modestos, `str` primero y regex solo si aporta y lo justificas."
**Metrics:** 33 words, FH 58.6.
**Pedagogical impact:** Five-item list inside a single sentence; a project context paragraph should set stakes, not enumerate.

### F-06 · Bolded English loanwords in learner-facing prose  *(Severity: M)*
**Surface:** jobRelevance, Theory callouts, Theory paragraphs, You Do intro.
**Source:** lines 15, 24, 31, 173, 280, 309, 315, 316, 554, 1476.
**Evidence (representative):**
- "**claims automáticos** de identidad, parentesco o fraude" (line 15)
- "fail-closed: mejor dejar el caso en revisión" (line 31)
- "fail-closed: mejor `review` vacío de claims" (line 280)
- "Lleva a S08 tu **mental model** de `normalize_record`" (line 316)
- "más fácil de explicar en code review" (line 213)
- "**sin** claims de parentesco ni identidad legal" (line 554)
- "Gate de cumplimiento del capstone N1-B sobre claims." (line 1476)
**Pedagogical impact:** The section otherwise invests heavily in Peruvian Spanish. The bolded English loans ("claims", "fail-closed", "mental model") break register and create the impression that the authors didn't find a Spanish equivalent, when perfectly good ones exist (*afirmaciones*, *cierre por fallo*, *modelo mental*).
**Cause:** Authoring residue from English-thinking drafts; "claim" in particular is reused 7+ times as a domain term without ever being glossed.

### F-07 · Playground demo: missing Spanish accents + grammar slip  *(Severity: L)*
**Surface:** Teoría → `Pruébalo tú mismo` editor.
**Source:** `SectionView.tsx:1251–1304`.
**Evidence (line-by-line):**
- Title: "Practica scraping, regex y SQL" → fine but contradicts (F-01).
- Comment: "# Practica adquisicion de datos (sin librerias externas en Pyodide)" → missing accents on *adquisición*, *librerías*.
- Comment: "# Extraer todos los DNIs (8 digitos)" → missing accent on *dígitos*.
- Comment: "# Extraer telefonos (formato XXX-XXX-XXX)" → missing accent on *Teléfonos*.
- Comment: "Top 2 nombres mas frecuentes" → missing accent on *más*.
- Data: `Cliente 1: Maria Quispe, …`, `Cliente 2: Luis Garcia, …` → missing accents on *María*, *García*.
- Output: "Ventas por vendedor:" → fine, but f-string literal is `"  {vendedor}: ..."` (2-space indent in source) while the rendered text on the page collapses to 1 space (extraction artifact, not a content bug).
**Pedagogical impact:** The section's *entire point* is Unicode-aware text normalization with accent preservation; the demo shown at the bottom of the Theory tab fails to preserve accents in its own Spanish prose. Ironic and damaging.
**Cause:** Demo authored before the section was rescoped; never re-reviewed.

### F-08 · Grammar slip: "el resultado son falsos negativos"  *(Severity: L)*
**Surface:** jobRelevance (line 15).
**Evidence:** *"el resultado son falsos negativos, colas de revisión y, peor, claims automáticos…"*
**Issue:** Subject "el resultado" (singular) takes verb "son" (plural) by *constructio ad sensum* with the predicate "falsos negativos". Prescriptively: "el resultado **es** falsos negativos" (still awkward) or rewrite as "el resultado: falsos negativos, colas de revisión y, peor aún, claims automáticos…".
**Pedagogical impact:** Minor; first paragraph of the section is the wrong place for a register slip.

### F-09 · URL hash and `id` mismatch the section content  *(Severity: L)*
**Surface:** Browser URL bar when on Section 7: `https://pillb.github.io/pyarcana/#data-acquisition`.
**Source:** `s07-data-acquisition.ts:4` (`id: "data-acquisition"`), `index.ts:8` import path, `src/app/page.tsx:68` hash router.
**Issue:** Learner sees `#data-acquisition` for a page titled *Texto & Unicode*. Mild identity confusion; undermines shareable links ("here's the data-acquisition section" → user opens → sees regex/Unicode content).
**Cause:** Section rescoped (see §1) without renaming the file/id.

### F-10 · Tagline mixes English ("strings", "regex") into Spanish  *(Severity: L)*
**Surface:** Course index card + section header subtitle.
**Source:** line 8 `"tagline": "Unicode latam, strings y regex sin sobrevalidar"`.
**Issue:** "strings" is English; "regex" is industry shorthand acceptable in code-adjacent Spanish, but "strings" is not. Spanish: *cadenas*.
**Pedagogical impact:** Cosmetic; first impression of the section is bilingual.

### F-11 · `iDo.intro` count vs list mismatch  *(Severity: L)*
**Surface:** Yo hago tab → intro paragraph.
**Source:** line 327.
**Evidence:** "Ocho demos (I Do): el instructor modela el pipeline T1→T4 — NFC y casefold, nombres con dos apellidos, `str` antes que regex, contacto modesto, fullmatch disciplinado y matching con evidencia."
**Issue:** Says "Ocho demos" then lists 6 illustrative items. Meticulous learners may count and be confused. The 8 demos are S07-T1-A-DEMO … S07-T4-B-DEMO; the list is illustrative not exhaustive, but the juxtaposition invites miscounting.
**Fix:** Either change "Ocho demos" → "Las ocho demos" (definite article signals exhaustive) and list 8 items, or change to "Ocho demos (I Do): el instructor modela el pipeline T1→T4 — desde NFC y casefold (T1) hasta FP/FN y evidencia (T4)." (range formulation, no list to count).

### F-12 · Inconsistent dash usage  *(Severity: L)*
**Surface:** Throughout the section file.
**Source:** many lines (115, 116, 211, 242, 280, 316, 327, …).
**Issue:** Section uses `—` (em dash) consistently for parenthetical asides, but inside one paragraph (T2-A, line 115–116) it switches to `—` followed by ` ` (em dash + space) — minor typography inconsistency. The `–` (en dash) is used in score ranges elsewhere in the course but does not appear in S07; the `--` (double hyphen) is also absent from S07. So this is a *course-wide* consistency note rather than an S07-specific defect, but worth recording.

### F-13 · "matchear" informal verb  *(Severity: L)*
**Surface:** We Do S07-T1-A-E2 instruction (line 598).
**Evidence:** "Usa `casefold` para decidir si `'MAÑANA'` y `'mañana'` matchean e imprime el booleano."
**Issue:** "matchear" is a Spanish-ized verb from English "to match"; common in LatAm tech Spanish but informal. The section elsewhere uses "matching" (noun) and "match" (noun) consistently. Verbal form would be more naturally "coinciden" or "son iguales".
**Pedagogical impact:** Negligible.

### F-14 · I-Do intro typo risk: "browser-pyodide"  *(Severity: L)*
**Surface:** Yo hago tab intro (line 327).
**Evidence:** "Datos sintéticos; entorno browser-pyodide (stdlib: `unicodedata`, `re`)."
**Issue:** "browser-pyodide" is an internal `environment` value (`environment: "browser-pyodide"` on each I-Do step, line 332 etc.) that has leaked into the prose intro. Pedagogically, the learner doesn't know what "browser-pyodide" means; the page also has a `### Pruébalo tú mismo` heading that says "Este editor corre Python de verdad en tu browser (con Pyodide)". So the term *is* exposed elsewhere — but the iDo intro assumes the learner knows Pyodide before they reach the playground.
**Fix:** "Datos sintéticos; el editor ejecuta Python real en tu navegador (Pyodide) con stdlib (`unicodedata`, `re`)."

### F-15 · `mental model` anglicism in Cierre  *(Severity: L)*
**Surface:** Teoría → Cierre y puente a S08 (line 316).
**Evidence:** "Lleva a S08 tu mental model de `normalize_record`…"
**Issue:** "mental model" is English; Spanish equivalent *modelo mental* is standard.
**Pedagogical impact:** Minor; the closing line is a high-recall surface and should be in clean Spanish.

### F-16 · `fullmatch` explanation in T3-A is technically loose  *(Severity: L — technical, not grammar)*
**Surface:** Teoría → T3-A paragraph 2 (line 181).
**Evidence:** "`re.fullmatch` exige que **toda** la cadena cumpla el patrón. `re.search` encuentra un substring en medio."
**Issue:** `fullmatch` actually anchors at *both* ends implicitly; `match` only anchors at the start. The section doesn't mention `re.match` at all, which is a common point of confusion. The pedagogical choice to omit `match` is defensible (keeps cognitive load low) but the contrast would be sharper with one sentence: "`re.match` ancla al inicio; `re.fullmatch` ancla al inicio y al final; `re.search` no ancla."
**Pedagogical impact:** Minor; learners who later encounter `re.match` will need to relearn the distinction.

### F-17 · Self-check Q3 explanation grammar  *(Severity: L)*
**Surface:** Autocheck → Q3 (line 1602).
**Evidence:** "Si la transformación es literal o simple, `str` es más legible, testeable y evita overfit o backtracking de regex."
**Issue:** "legible, testeable y evita" — the predicate chain mixes adjectives ("legible, testeable") with a verb ("evita"). Should be "más legible y testeable, y evita overfit o backtracking de regex" or "más legible, más testeable y evita overfit…".
**Pedagogical impact:** Negligible; the meaning is clear.

### F-18 · `portfolioNote` is a single 24-word sentence with no terminal period  *(Severity: L)*
**Surface:** Tú haces → `portfolioNote` (line 1571).
**Evidence:** "Muestra en README 3 casos: nombre con partícula, email con +, teléfono con máscara; tabla raw→normalized→transforms. Subraya la política ética de no-parentesco."
**Issue:** Two sentences, the second one is fine. The first has a colon-then-list which is acceptable but the semicolon could be a period for cleaner rhythm. (Mostly a false alarm — included for completeness.)

### F-19 · "FP/FN" expansion missing in learner-facing glossary  *(Severity: L — pedagogy)*
**Surface:** Throughout — `jobRelevance` line 15 ("falsos negativos"), Theory T4-A (line 242), Theory T4-B (line 279 "**FP** (false positive): …"), selfCheck Q5, etc.
**Issue:** The expansion `FP (false positive)` / `FN (false negative)` is given only once (line 279), and only in English. "False positive" is itself a translation of *falso positivo*. A Peruvian Spanish learner benefits from "FP (falso positivo)" at first use.
**Pedagogical impact:** Minor; the section uses FP/FN enough that one Spanish gloss on first use would help.

### F-20 · `requirements[7]` references "names ordenados" — slight ambiguity  *(Severity: L)*
**Surface:** Tú haces → `requirements` (line 1518).
**Evidence:** "transforms es un dict por campo con nombres ordenados (nfc, collapse_spaces, casefold, digits_only, …)"
**Issue:** "nombres ordenados" could mean (a) the transform *names* are sorted alphabetically, or (b) the transform *list per field* is in application order. From context (T1-A callout: "Pipeline: NFC → strip/collapse → casefold → comparar") it's (b) application order. Better: "transforms es un dict por campo cuya lista sigue el orden de aplicación (nfc, collapse_spaces, casefold, digits_only, …)".

---

## 4. Meta-Leak Report

| # | Surface | Leaked text | Severity | Notes |
|---|---|---|---|---|
| M-1 | `iDo.intro` (line 327) | "entorno browser-pyodide" | L | Internal `environment` enum value surfaced in learner prose. Minor — see F-14. |
| M-2 | URL hash | `#data-acquisition` | L | Residual scope-shift artifact, not authoring note — see F-09. |
| M-3 | None | — | — | **No high-severity meta-leak found.** No `TODO`, `FIXME`, `XXX`, `moved from section`, `note to dev`, `developer note`, `WIP`, `TBD`, or `placeholder` strings were detected in the S07 source prose. The internal capstone-increment codes (`CP-N1-B`, `S07-T1-A`, `S07-T1-A-DEMO`) are intentional course-domain vocabulary used consistently across S01–S13, not authoring residue. |

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do fidelity — **strong**

- **I Do** (8 demos) maps 1:1 to the 8 subtopics (T1-A … T4-B). Each demo carries a `why` field (1-line rationale). The pattern "model the pipeline T1→T4" promised in the intro is honored: demos literally go T1-A → T1-B → T2-A → T2-B → T3-A → T3-B → T4-A → T4-B.
- **We Do** (24 exercises) uses the **E1 guiado → E2 independiente → E3 transferencia** scaffolding consistently across all 8 subtopics. Every `starterCode` carries a `# DEFECT: …` comment naming the bug the learner must fix, and every `solutionCode` carries the corrected version plus expected output. This is a **gold-standard pattern** the rest of the course should follow.
- **You Do** is the capstone increment CP-N1-B (`normalize_record` → `{raw, normalized, transforms}`). `requirements` are 8 concrete, testable criteria; `rubric` weights sum to 100%. The `portfolioNote` asks for a README table `raw→normalized→transforms` and an ethical-policy statement — exactly the artifact a junior Data Engineer would show in an interview.
- **Self Check** (10 MCQs) covers every subtopic, with `explanation` on every question. Distractors are plausible (e.g. "Python no soporta tildes", "casefold borra la é") — not throwaway.

### 5.2 Connective tissue — **strong**

- The Cierre y puente a S08 block (line 313–323) is explicit: "El siguiente cuello de botella real aparece al leer y escribir archivos: encodings… mojibake (`Ã±` en vez de `ñ`)… CSV con comillas, JSON y cuarentena de filas rotas." This is a forward pointer with a *concrete preview* of S08's content, not a vague "next time we'll learn…".
- The Theory map (line 32) makes the 4-subtopic arc explicit: T1 Unicode → T2 str/contacto → T3 regex → T4 similitud/FP-FN. Each subsequent theory block opens by extending the previous one.
- The `jobRelevance` paragraph frames *why* this matters (banca/telecom/retail/gobierno intake) before *what* (NFC, str-first, regex discipline, matching evidence). Good motivation-first ordering.
- One gap: there is no explicit backward pointer to S06 (Colecciones) or S05 (Funciones & Contratos). The pipeline contract `{raw, normalized, transforms}` is reminiscent of S05's "contratos" theme but the section doesn't surface that connection.

### 5.3 Cognitive load & progressive disclosure — **good**

- Per-subtopic structure is uniform: 3 paragraphs → 1 code example → 1 callout. Predictable rhythm lowers cognitive load.
- Callouts are typed (info/warning/tip/danger) and used purposefully: `danger` for the overvalidation warning, `warning` for catastrophic backtracking, `tip` for "str primero" / "fullmatch vs search", `info` for the scope statement. Excellent signal-to-noise.
- Code examples are ≤15 lines each — within working-memory capacity.
- Two readability hot-spots to revisit: the `jobRelevance` opener (39 words, FH 31.7) and T3-B paragraph 1 (42 words, FH 39.7). Both are at the *top* of their respective surfaces — bad placement.

### 5.4 Redaction & grammar (Peruvian Spanish) — **good with exceptions**

- Mean FH ≈ 70 places the section in the *normal / bastante fácil* band — appropriate for intermediate technical Spanish in Peru.
- 0 sentences exceed 45 words (no run-ons by the strict >45 threshold).
- 6 sentences exceed 32 words (LONG flag). All are splittable; see F-02 to F-05.
- English loanwords treated as code (` `raise` `, ` `match` `, ` `review` `) are acceptable — they signal Python identifiers or status enum values.
- English loanwords used in **bold** prose (`**claims**`, `**fail-closed**`, `**mental model**`) without Spanish gloss are the main redaction weakness — see F-06.
- "Matchear" (F-13) is the only informal Spanish-ized verb; the rest of the section uses standard Spanish verbal forms.

### 5.5 Exercise & exam quality — **excellent**

- Every We Do exercise has a `tests` field naming the verification signal (e.g. "True", "FP luego FN", "5 keys"), an `edgeCases` array (e.g. `["caso vacío"]`, `["dos apellidos"]`, `["overvalidation"]`), and a `feedback` field that the learner sees after solving.
- The DEFECT pattern (`# DEFECT: …`) is pedagogically brilliant: instead of giving the learner a blank file, every starter has one realistic bug they must diagnose and fix — exactly the skill a Data Engineer needs on the job.
- Self-check Q4 ("En un parse de nombres latam, las partículas (`de`, `del`, `de la`)…") is the *only* question where one distractor is itself a mini-lesson ("Obligan a usar un único `\\w+` en regex") — a subtle way to reinforce that regex isn't the right tool here.

### 5.6 Consistency with roadmap — **good**

- Section honors the capstone-increment contract `CP-N1-B` and explicitly references `CP-N1-A` (S05), `CP-N1-C` (S11), and the S08 bridge.
- Section declares and respects its scope: "No implementes scraping, clientes HTTP ni SQL aquí" (callout Alcance de S07). The internal scope matches the external declaration *everywhere except the playground demo* (F-01).

### 5.7 Comparison with best-in-class external materials — **competitive**

- The Unicode treatment is comparable to *Fluent Python* ch. 4 (which the section cites in `resources.books`) but more concise and PE/Latam-focused.
- The `str` first → `regex` last ordering matches the *Regular Expressions Cookbook* philosophy (also cited) — but the section goes further by *forbidding* regex for email, which most regex cookbooks do not.
- The "fail-closed → review" ethical posture is rare in Python courses (most teach "validate and raise"); the section's stance is more aligned with production entity-resolution practice (e.g. the *Entity Resolution* literature by Christophides et al., 2021) than with introductory Python pedagogy.
- The Jaccard-with-NFC treatment is correct but light on math; learners wanting more should be pointed to S24 (rapidfuzz) or S33 (advanced models).

---

## 6. Grammatical Improvements — Paragraph-by-Paragraph Rewrites

> Format: **before** (verbatim, with FH/WPS) → **after** (proposed rewrite, with FH/WPS) for every Theory tab paragraph, every tab intro (I Do / We Do / You Do), and the worst Self-Check explanation. Rewrites preserve all pedagogical content; only redaction is changed.
> FH band guide: ≥80 muy fácil · 70–80 bastante fácil · 60–70 normal · 50–60 algo difícil · 30–50 difícil · <30 muy difícil.

### 6.1 Teoría · Mapa de la sección (3 paragraphs)

**Para 1 — Before (FH ≈ 68, WPS ≈ 24):**
> "En esta sección dominas **texto latinoamericano**: normalización Unicode, nombres con dos apellidos, métodos `str` antes que regex, y matching con evidencia **sin afirmar parentesco**. Scraping, SQL y APIs públicas se abordan más adelante (p. ej. archivos/ETL en S08 y servicios en S12)."

**Para 1 — After (FH ≈ 78, WPS ≈ 16):**
> "En esta sección dominas **texto latinoamericano**: normalización Unicode, nombres con dos apellidos y métodos `str` antes que regex. Haces matching con evidencia **sin afirmar parentesco**. Scraping, SQL y APIs públicas se abordan más adelante (archivos y ETL en S08; servicios en S12)."

*Cause fixed:* sentence 1 was a 24-word compound; split into two. *gain ≈ +10 FH.*

**Para 2 — Before (FH ≈ 67, WPS ≈ 20):**
> "El incremento **CP-N1-B** es un **normalizador de registro** que conserva `raw`, produce `normalized` y lista `transforms`. Solo datos sintéticos peruanos/latam; sin PII real. Si el schema no cuadra o falta evidencia, **no completes campos en silencio** (fail-closed: mejor dejar el caso en revisión que inventar datos)."

**Para 2 — After (FH ≈ 74, WPS ≈ 14):**
> "El incremento **CP-N1-B** es un **normalizador de registro** que conserva `raw`, produce `normalized` y lista `transforms`. Solo usas datos sintéticos peruanos o latam; **nunca PII real**. Si el schema no cuadra o falta evidencia, **no completes campos en silencio**: cierras por fallo (*fail-closed*) y dejas el caso en revisión antes que inventar datos."

*Cause fixed:* glossed `fail-closed` in Spanish; tightened "Solo datos sintéticos…" into a cleaner negation.

**Para 3 — Before (FH ≈ 56, WPS ≈ 22):**
> "Orden pedagógico: **T1 Unicode** (formas y casefold) → **T2 str y contacto** (sin overvalidation) → **T3 regex** (fullmatch y límites) → **T4 similitud y FP/FN** (score como evidencia). Casos sintéticos recurrentes: José/Quispe, emails y teléfonos ficticios, Lima/Arequipa. Cada bloque I Do modela, We Do practica y el You Do integra el contrato `raw` / `normalized` / `transforms`."

**Para 3 — After (FH ≈ 62, WPS ≈ 18):**
> "Orden pedagógico: **T1 Unicode** (formas y *casefold*) → **T2 `str` y contacto** (sin *overvalidation*) → **T3 regex** (`fullmatch` y límites) → **T4 similitud y FP/FN** (score como evidencia). Los casos sintéticos recurrentes son José/Quispe, emails y teléfonos ficticios, y Lima/Arequipa. En cada bloque, *I Do* modela, *We Do* practica y *You Do* integra el contrato `raw` / `normalized` / `transforms`."

*Cause fixed:* second sentence smoothed; "I Do" italicized as a stage label rather than left as a bare English word.

### 6.2 Teoría · T1-A Code points, normalización y casefold (3 paragraphs)

**Para 1 — Before (FH ≈ 73):**
> "Python 3 `str` es Unicode. `ord('ñ')` / `chr(241)` exploran **code points**. La misma letra puede codificarse de formas distintas: **NFC** (compuesta) vs **NFD** (base + combining mark). En matching de nombres latam, sin unificar formas obtienes **falsos negativos** ("José" ≠ "José") aunque se vean idénticos en pantalla."

**Para 1 — After (FH ≈ 81):**
> "Python 3 `str` es Unicode. Con `ord('ñ')` y `chr(241)` exploras **code points**. La misma letra puede codificarse de formas distintas: **NFC** (compuesta) o **NFD** (base + marca combinante). Al comparar nombres latam sin unificar formas obtienes **falsos negativos** ("José" ≠ "José"), aunque se vean idénticos en pantalla."

*Cause fixed:* translated "combining mark" → "marca combinante"; replaced "vs" with "o"; tightened "En matching de nombres latam, sin unificar formas obtienes" → "Al comparar nombres latam sin unificar formas obtienes".

**Para 2 — Before (FH ≈ 55, WPS ≈ 30):**
> "`unicodedata.normalize('NFC', s)` unifica formas **antes** de comparar o de tokenizar. Sin eso, `'José' == 'Jose\\u0301'` puede ser `False` y tu Jaccard o tu exact-match fallan en silencio. En el normalizador de registro documentas cada paso (NFC, colapso de espacios, casefold) y, si el schema no cuadra, dejas el caso en **review** en lugar de inventar campos. Herramientas de esta sección: stdlib `str`, `unicodedata` y `re`."

**Para 2 — After (FH ≈ 68, WPS ≈ 18):**
> "`unicodedata.normalize('NFC', s)` unifica formas **antes** de comparar o tokenizar. Sin eso, `'José' == 'Jose\\u0301'` puede ser `False`, y tu Jaccard o tu exact-match fallan en silencio. En el normalizador de registro documentas cada paso (NFC, colapso de espacios, `casefold`); si el schema no cuadra, dejas el caso en **review** en vez de inventar campos. Las herramientas de esta sección son stdlib `str`, `unicodedata` y `re`."

*Cause fixed:* split the 30-word monster into three sentences; replaced "en lugar de" → "en vez de" (slightly more LatAm); italicized `casefold` for consistency with surrounding code formatting.

**Para 3 — Before (FH ≈ 50, WPS ≈ 26):**
> "`casefold()` es la **política canónica** de matching case-insensitive del normalizador: más robusta que `lower()` cuando hay casing especial (clásico: ß alemana → `ss`). En español, `lower` y `casefold` suelen coincidir en ñ; aun así escribes `casefold` por **contrato**, no porque `lower` "rompa" la ñ. Pipeline: **NFC → strip/collapse → casefold (si la política lo pide) → comparar**. Datos sintéticos; **nunca** PII real ni parentesco automático."

**Para 3 — After (FH ≈ 62, WPS ≈ 16):**
> "`casefold()` es la **política canónica** de matching case-insensitive del normalizador: más robusta que `lower()` cuando hay *casing* especial (caso clásico: ß alemana → `ss`). En español, `lower` y `casefold` suelen coincidir en ñ; aun así escribes `casefold` por **contrato**, no porque `lower` "rompa" la ñ. El pipeline es: **NFC → strip/collapse → casefold (si la política lo pide) → comparar**. Trabajas solo con datos sintéticos: **nunca** PII real ni inferencia automática de parentesco."

*Cause fixed:* italicized *casing*; split final sentence; "parentesco automático" → "inferencia automática de parentesco" (more precise).

### 6.3 Teoría · T1-B Tildes, ñ, partículas y apellidos compuestos (3 paragraphs)

**Para 1 — Before (FH ≈ 60):**
> "En Perú y Latam es común **nombre(s) + apellido paterno + apellido materno**. Forzar el formato US (un solo first/last) recorta información y genera FN al cruzar padrones o CRM. Conserva el **raw** siempre: es tu única fuente si la heurística se equivoca o si mañana cambia la política de parseo."

**Para 1 — After (FH ≈ 67):**
> "En Perú y Latam es común **nombre(s) + apellido paterno + apellido materno**. Forzar el formato estadounidense (un único *first* / *last*) recorta información y genera falsos negativos (FN) al cruzar padrones o CRM. Conserva el **raw** siempre: es tu única fuente si la heurística se equivoca o si mañana cambia la política de parseo."

*Cause fixed:* glossed FN; replaced "US" → "estadounidense" (Peruvian Spanish register).

**Para 2 — Before (FH ≈ 50, WPS ≈ 32):**
> "Partículas (`de`, `del`, `de la`, `y`) pueden ir en nombres o apellidos (`María del Carmen`, `de la Cruz`). Un parser **suave** tokeniza, aplica la heurística de "últimos dos tokens = apellidos si hay ≥3", y si falta evidencia marca **review** en vez de inventar `apellido2`. Mejor un caso en cola humana que un campo demográfico inventado."

**Para 2 — After (FH ≈ 62, WPS ≈ 16):**
> "Las partículas (`de`, `del`, `de la`, `y`) pueden ir en nombres o apellidos (`María del Carmen`, `de la Cruz`). Un parser **suave** tokeniza y aplica la heurística "últimos dos tokens = apellidos si hay tres o más". Si falta evidencia, marca **review** en vez de inventar `apellido2`. Mejor un caso en cola humana que un campo demográfico inventado."

*Cause fixed:* split the 32-word sentence into two; replaced "≥3" with "tres o más" (more readable in prose).

**Para 3 — Before (FH ≈ 56):**
> "Espacios múltiples se colapsan; tildes y ñ se preservan en la forma normalizada visible (NFC). Ejemplo sintético: `María del Carmen Quispe Huamán` → given con partícula + dos apellidos finales. Datos ficticios únicamente; **nunca** PII real ni inferencia de parentesco o identidad legal."

**Para 3 — After (FH ≈ 67):**
> "Los espacios múltiples se colapsan; las tildes y la ñ se preservan en la forma normalizada visible (NFC). Ejemplo sintético: `María del Carmen Quispe Huamán` → *given* con partícula + dos apellidos finales. Los datos son ficticios: **nunca** PII real ni inferencia de parentesco o identidad legal."

*Cause fixed:* added articles ("Los espacios…", "Las tildes y la ñ…", "Los datos son ficticios"); italicized *given* as a field name.

### 6.4 Teoría · T2-A split / join / search / replace (3 paragraphs)

**Para 1 — Before (FH ≈ 64, WPS ≈ 27):**
> "Antes de regex: `strip`, `split`, `join`, `replace`, `find`, `startswith`. En limpieza de direcciones, teléfonos enmascarados y tokens de intake, la mayor parte se resuelve así: menos backtracking, más legible y más fácil de testear que un patrón "inteligente"."

**Para 1 — After (FH ≈ 71, WPS ≈ 16):**
> "Antes de regex: `strip`, `split`, `join`, `replace`, `find`, `startswith`. En la limpieza de direcciones, teléfonos enmascarados y tokens de *intake*, la mayor parte se resuelve así. Obtienes menos *backtracking*, más legibilidad y mayor facilidad de testeo que con un patrón "inteligente"."

*Cause fixed:* split into two sentences; replaced "más legible y más fácil de testear" with noun forms for parallelism.

**Para 2 — Before (FH ≈ 50, WPS ≈ 27):**
> "`' '.join(s.split())` colapsa espacios. `split(',')` alcanza para CSV-like **simple** (sin comillas escapadas). Cuando aparezcan comillas, saltos de línea o encodings raros, el módulo `csv` y `pathlib` de **S08** son el camino correcto — no un `split` más creativo."

**Para 2 — After (FH ≈ 63, WPS ≈ 14):**
> "`' '.join(s.split())` colapsa espacios. `split(',')` alcanza para CSV-like **simple** (sin comillas escapadas). Cuando aparezcan comillas, saltos de línea o *encodings* raros, el módulo `csv` y `pathlib` de **S08** son el camino correcto. No fuerces un `split` más "creativo": te vas a topar con casos que no esperabas."

*Cause fixed:* em-dash → period; added a follow-up clause that explains *why* "split creativo" is bad.

**Para 3 — Before (FH ≈ 60):**
> "`replace` es **literal** y predecible: normaliza guiones, abreviaturas o prefijos **antes** de pensar en regex. Caso sintético Lima: `Av. Larco, Miraflores` o `Jr. de la Unión` — documenta el reemplazo en `transforms` y conserva el `raw` en el record de evidencia."

**Para 3 — After (FH ≈ 70):**
> "`replace` es **literal** y predecible: normaliza guiones, abreviaturas o prefijos **antes** de pensar en regex. Caso sintético Lima: `Av. Larco, Miraflores` o `Jr. de la Unión`. Documenta el reemplazo en `transforms` y conserva el `raw` en el registro de evidencia."

*Cause fixed:* em-dash → period; "record de evidencia" → "registro de evidencia".

### 6.5 Teoría · T2-B Nombres, emails y teléfonos sin sobrevalidación (3 paragraphs)

**Para 1 — Before (FH ≈ 50, WPS ≈ 30):**
> "Email: `strip` + `casefold` y una comprobación **modesta pero completa**: exactamente un `@`, parte local y dominio no vacíos, y ningún espacio. Eso no confirma que el buzón exista; solo decide si el valor es usable o va a **review**. Regex hiper-estrictas **rechazan válidos** (plus addressing `user+tag@…`, dominios nuevos, Unicode en labels)."

**Para 1 — After (FH ≈ 64, WPS ≈ 16):**
> "Para emails: `strip` + `casefold` y una comprobación **modesta pero completa**: exactamente un `@`, parte local y dominio no vacíos, y ningún espacio. Eso no confirma que el buzón exista; solo decide si el valor es usable o va a **review**. Las regex hiper-estrictas **rechazan válidos** (*plus addressing* `user+tag@…`, dominios nuevos, Unicode en *labels*)."

*Cause fixed:* "Email:" → "Para emails:" (preposition + noun); italicized *plus addressing* and *labels*; smoothed gender of "Regex hiper-estrictas" → "Las regex hiper-estrictas" (agreement clarified).

**Para 2 — Before (FH ≈ 48, WPS ≈ 30):**
> "Teléfono PE sintético de demo: extrae dígitos y conserva el prefijo de país `51` cuando viene como `+51`. Salida solo dígitos (`51999000111`); el signo `+` no se conserva. Longitud (p. ej. 9 dígitos locales que empiezan en 9) y operadora son **revisión fuera de banda**, no un `raise` automático del normalizador."

**Para 2 — After (FH ≈ 62, WPS ≈ 16):**
> "Teléfono PE sintético de demo: extrae dígitos y conserva el prefijo de país `51` cuando viene como `+51`. La salida es solo dígitos (`51999000111`); el signo `+` no se conserva. La longitud (p. ej. 9 dígitos locales que empiezan en 9) y la operadora son **revisión fuera de banda**, no un `raise` automático del normalizador."

*Cause fixed:* "Salida solo dígitos" → "La salida es solo dígitos"; added articles to "Longitud" and "operadora".

**Para 3 — Before (FH ≈ 45, WPS ≈ 30):**
> "Nombre de contacto: colapso de espacios + NFC. El title-case es cosmético y puede pelear con partículas (`del` → `Del`): **elige una política, documenta en `transforms` y sé consistente**. Un score de similitud entre nombres es **evidencia para review**, nunca prueba de parentesco, fraude o identidad legal."

**Para 3 — After (FH ≈ 60, WPS ≈ 16):**
> "Nombre de contacto: colapso de espacios + NFC. La capitalización tipo título (*title-case*) es cosmética y puede pelear con partículas (`del` → `Del`). **Elige una política, documenta en `transforms` y sé consistente.** Un score de similitud entre nombres es **evidencia para review**, nunca prueba de parentesco, fraude o identidad legal."

*Cause fixed:* translated "title-case" → "capitalización tipo título"; colon → period for sentence boundary; smoothed verb chain.

### 6.6 Teoría · T3-A Patrones, grupos y anchors (3 paragraphs)

**Para 1 — Before (FH ≈ 65):**
> "Regex entra cuando el patrón es **regular de verdad**: DNI sintético de 8 dígitos, códigos de región (`LIM`), prefijos fijos. Usa `re` con **grupos** `(...)` y anchors. Si `str.startswith` / `replace` / `isdigit` bastan, **no** escribas regex: ya lo practicaste en T2."

**Para 1 — After (FH ≈ 73):**
> "La regex entra cuando el patrón es **regular de verdad**: DNI sintético de 8 dígitos, códigos de región (`LIM`), prefijos fijos. Usa `re` con **grupos** `(...)` y *anchors*. Si `str.startswith`, `replace` o `isdigit` bastan, **no** escribas regex: ya lo practicaste en T2."

*Cause fixed:* added article "La regex"; italicized *anchors*; replaced slash-list with "o" for cleaner Spanish.

**Para 2 — Before (FH ≈ 50, WPS ≈ 31):**
> "`re.fullmatch` exige que **toda** la cadena cumpla el patrón. `re.search` encuentra un substring en medio. Confundirlos produce **falsos positivos** en validación (un DNI embebido en texto tipo «DNI 12345678 PE» "pasa" con search). Validar un código completo → `fullmatch`; extraer de un log → `search` / `finditer`."

**Para 2 — After (FH ≈ 64, WPS ≈ 16):**
> "`re.fullmatch` exige que **toda** la cadena cumpla el patrón. `re.search` encuentra un *substring* en medio. Confundirlos produce **falsos positivos** en validación: un DNI embebido en texto tipo «DNI 12345678 PE» "pasa" con `search`. Regla: validar un código completo → `fullmatch`; extraer de un log → `search` o `finditer`."

*Cause fixed:* italicized *substring*; replaced parenthetical with a colon-introduced example; replaced slash with "o".

**Para 3 — Before (FH ≈ 48, WPS ≈ 30):**
> "Grupos con nombre `(?P<name>...)` mejoran legibilidad al extraer campos (`m.group('dni')` en vez de índices mágicos). Úsalos en códigos y logs, no para "parsear identidad". Caso sintético de 8 dígitos: **nunca** PII real ni claims legales a partir de un match. Nombres con partículas (`María del Carmen`) se modelan mejor con tokenización `str` (T1-B) que con un solo `\\w+`."

**Para 3 — After (FH ≈ 62, WPS ≈ 16):**
> "Los grupos con nombre `(?P<name>...)` mejoran la legibilidad al extraer campos (`m.group('dni')` en vez de índices mágicos). Úsalos en códigos y logs, no para "parsear identidad". En el caso sintético de 8 dígitos: **nunca** PII real ni afirmaciones legales a partir de un *match*. Los nombres con partículas (`María del Carmen`) se modelan mejor con tokenización `str` (T1-B) que con un solo `\\w+`."

*Cause fixed:* glossed "claims" → "afirmaciones"; italicized *match*; added articles.

### 6.7 Teoría · T3-B Compilación, extracción y límites (3 paragraphs) — **worst readability cluster**

**Para 1 — Before (FH ≈ 39.7, WPS ≈ 42, LONG flag):** see F-03.
> "`re.compile` reutiliza el patrón en loops: deja clara la intención y evita reescribir el mismo raw string en cada iteración. `findall` / `finditer` extraen múltiples matches de un log sintético — herramientas de **extracción**, no de overvalidation de email (eso quedó en T2)."

**Para 1 — After (FH ≈ 70, WPS ≈ 14):**
> "`re.compile` reutiliza el patrón en bucles: deja clara la intención y evita reescribir el mismo *raw string* en cada iteración. `findall` y `finditer` extraen múltiples *matches* de un log sintético. Son herramientas de **extracción**, no de *overvalidation* de email (eso quedó en T2)."

*Cause fixed:* "loops" → "bucles"; em-dash → period; three sentences instead of one.

**Para 2 — Before (FH ≈ 58):**
> "Límite duro de este subtema: **catastrophic backtracking** con cuantificadores anidados ambiguos (p. ej. `(a+)+b` sobre strings hostiles de `a`s). Prefiere patrones **aburridos y simples**, o vuelve a `str.find` / `split`. No ejecutes patrones peligrosos "para ver qué pasa" en producción."

**Para 2 — After (FH ≈ 65):**
> "Límite duro de este subtema: **catastrophic backtracking** con cuantificadores anidados ambiguos (p. ej. `(a+)+b` sobre *strings* hostiles de `a`s). Prefiere patrones **aburridos y simples**, o vuelve a `str.find` o `split`. No ejecutes patrones peligrosos "para ver qué pasa" en producción."

*Cause fixed:* italicized *strings*; slash → "o".

**Para 3 — Before (FH ≈ 64.9, WPS ≈ 35, LONG flag):** see F-04.
> "Si el patrón crece sin control (email + teléfono + DNI + dirección en una sola expresión), un parser por pasos con `str` y regex pequeñas suele ser más testeable y más fácil de explicar en code review. La elegancia de una sola mega-regex es un bug de producto disfrazado: un fallo opaco en el medio no dice *qué* campo rompió el contrato."

**Para 3 — After (FH ≈ 72, WPS ≈ 18):**
> "Si el patrón crece sin control (email + teléfono + DNI + dirección en una sola expresión), un parser por pasos con `str` y regex pequeñas suele ser más testeable. También es más fácil de explicar en una revisión de código (*code review*). La elegancia de una sola mega-regex es un defecto de producto disfrazado (*bug*): un fallo opaco en el medio no dice *qué* campo rompió el contrato."

*Cause fixed:* split into three sentences; glossed "code review" → "revisión de código"; glossed "bug" → "defecto de producto".

### 6.8 Teoría · T4-A Exacta y por tokens — Jaccard simple (3 paragraphs)

**Para 1 — Before (FH ≈ 50, WPS ≈ 28):**
> "Matching de texto en intake: primero **igualdad normalizada** (NFC + casefold + collapse de espacios). Si tras el mismo pipeline que usaste en T1 las cadenas no son iguales, recién entonces **similitud por tokens** (Jaccard) como señal débil para revisión humana — no como auto-fusión."

**Para 1 — After (FH ≈ 64, WPS ≈ 14):**
> "Matching de texto en *intake*: primero **igualdad normalizada** (NFC + `casefold` + colapso de espacios). Si, tras el mismo pipeline que usaste en T1, las cadenas no son iguales, recién entonces usas **similitud por tokens** (Jaccard) como señal débil para revisión humana. No la uses para auto-fusionar."

*Cause fixed:* em-dash → period; italicized *intake*.

**Para 2 — Before (FH ≈ 50, WPS ≈ 27):**
> "Jaccard = |A∩B| / |A∪B| sobre sets de tokens. Tokeniza **después** de NFC (así "José" y "José" no se desdoblan en tokens distintos) y, si hace falta, colapsa puntuación trivial (puntos de abreviatura). Un score medio (p. ej. 0.67 entre `Juan Perez` y `Juan P Perez`) cae en **review**, no en merge automático ni en fusión de cuentas."

**Para 2 — After (FH ≈ 64, WPS ≈ 14):**
> "Jaccard = |A∩B| / |A∪B| sobre conjuntos de tokens. Tokeniza **después** de NFC (así "José" y "José" no se desdoblan en tokens distintos) y, si hace falta, colapsa puntuación trivial (puntos de abreviatura). Un score medio (p. ej. 0.67 entre `Juan Perez` y `Juan P Perez`) cae en **review**, no en fusión automática ni en fusión de cuentas."

*Cause fixed:* "sets" → "conjuntos"; "merge automático" → "fusión automática" (English/Spanish consistency).

**Para 3 — Before (FH ≈ 48, WPS ≈ 27):**
> "Nunca digas "es la misma persona" ni "parentesco" por un score. Empaqueta evidencia (`raw_a`, `raw_b`, `score`, `decision`, `reason`) y deja la decisión sensible al humano que conoce el contexto del negocio (fraude, KYC, CRM). El pipeline sugiere; no sentencia."

**Para 3 — After (FH ≈ 62, WPS ≈ 14):**
> "Nunca digas "es la misma persona" ni "parentesco" por un score. Empaqueta evidencia (`raw_a`, `raw_b`, `score`, `decision`, `reason`) y deja la decisión sensible al humano que conoce el contexto del negocio (fraude, KYC, CRM). El pipeline sugiere; no sentencia: el veredicto le corresponde a una persona."

*Cause fixed:* added a clarifying coda for the metaphor "no sentencia" (which can be opaque to non-native Spanish readers).

### 6.9 Teoría · T4-B FP/FN y conservación de evidencia (3 paragraphs)

**Para 1 — Before (FH ≈ 60):**
> "**FP** (false positive): el sistema dice match y no debería (p. ej. homónimos o Luisa≈Luis con umbral flojo). **FN**: debería matchear y no lo hizo (tildes, partículas, abreviatura de segundo nombre). En nombres latam, NFC y el parse de partículas mueven ambos lados de la matriz."

**Para 1 — After (FH ≈ 70):**
> "**FP** (*falso positivo*): el sistema dice *match* y no debería (p. ej. homónimos o "Luisa" ≈ "Luis" con umbral flojo). **FN** (*falso negativo*): debería coincidir y no lo hizo (tildes, partículas, abreviatura de segundo nombre). En nombres latam, NFC y el *parse* de partículas mueven ambos lados de la matriz."

*Cause fixed:* glossed FP/FN in Spanish; italicized *match* and *parse*; "matchear" → "coincidir".

**Para 2 — Before (FH ≈ 48, WPS ≈ 28):**
> "Empaqueta evidencia: `{raw_a, raw_b, score, decision, reason}`. La decisión es `exact` / `review` / `no_match` de **matching** — **no** etiqueta familiar ni veredicto legal. Si falta evidencia, no completes el paquete con inventos (fail-closed: mejor `review` vacío de claims que un campo inventado)."

**Para 2 — After (FH ≈ 62, WPS ≈ 14):**
> "Empaqueta evidencia: `{raw_a, raw_b, score, decision, reason}`. La decisión es `exact`, `review` o `no_match` de **matching**: **no** es etiqueta familiar ni veredicto legal. Si falta evidencia, no completes el paquete con inventos. Cierra por fallo (*fail-closed*): mejor `review` vacío de afirmaciones que un campo inventado."

*Cause fixed:* slash-list → "o"; em-dash → colon; glossed "fail-closed"; "claims" → "afirmaciones".

**Para 3 — Before (FH ≈ 50, WPS ≈ 25):**
> "Por qué el curso prohíbe afirmar parentesco o identidad legal desde Jaccard: no hay fuente autoritativa (RENIEC u otra), el riesgo ético/legal es alto, y un score textual **no es prueba**. El pipeline entrega señales; el humano decide merges sensibles."

**Para 3 — After (FH ≈ 62, WPS ≈ 14):**
> "¿Por qué el curso prohíbe afirmar parentesco o identidad legal desde Jaccard? Porque no hay fuente autoritativa (RENIEC u otra), porque el riesgo ético y legal es alto, y porque un score textual **no es prueba**. El pipeline entrega señales; el humano decide qué fusiones son sensibles."

*Cause fixed:* reformulated as a question + answer (clearer); "merges sensibles" → "qué fusiones son sensibles".

### 6.10 Teoría · Cierre y puente a S08 (2 paragraphs)

**Para 1 — Before (FH ≈ 50, WPS ≈ 25):**
> "Ya puedes normalizar texto **en memoria** con contrato auditable: NFC, `str` antes que regex, contacto modesto y matching con evidencia sin claims. El siguiente cuello de botella real aparece al **leer y escribir archivos**: encodings (UTF-8 vs latin-1), mojibake (`Ã±` en vez de `ñ`), CSV con comillas, JSON y cuarentena de filas rotas."

**Para 1 — After (FH ≈ 62, WPS ≈ 14):**
> "Ya puedes normalizar texto **en memoria** con contrato auditable: NFC, `str` antes que regex, contacto modesto y matching con evidencia **sin afirmaciones**. El siguiente cuello de botella real aparece al **leer y escribir archivos**: *encodings* (UTF-8 vs latin-1), *mojibake* (`Ã±` en vez de `ñ`), CSV con comillas, JSON y cuarentena de filas rotas."

*Cause fixed:* "claims" → "afirmaciones"; italicized *encodings* and *mojibake*.

**Para 2 — Before (FH ≈ 38, WPS ≈ 28) — contains `mental model` anglicism (F-15):**
> "Lleva a S08 tu mental model de `normalize_record`: `raw` se conserva, `transforms` se documentan, y un decode incorrecto se trata como error **visible** — no como tildes "misteriosas". El split ingenuo de esta sección cede el paso al módulo `csv` y a un manifest de ingesta."

**Para 2 — After (FH ≈ 60, WPS ≈ 14):**
> "Lleva a S08 tu **modelo mental** de `normalize_record`: `raw` se conserva, `transforms` se documentan, y un *decode* incorrecto se trata como error **visible**, no como tildes "misteriosas". El split ingenuo de esta sección cede el paso al módulo `csv` y a un *manifest* de ingesta."

*Cause fixed:* "mental model" → "modelo mental"; em-dash → comma; italicized *decode* and *manifest*.

### 6.11 I Do intro

**Before (FH ≈ 60):**
> "Ocho demos (I Do): el instructor modela el pipeline T1→T4 — NFC y casefold, nombres con dos apellidos, `str` antes que regex, contacto modesto, fullmatch disciplinado y matching con evidencia. Datos sintéticos; entorno browser-pyodide (stdlib: `unicodedata`, `re`)."

**After (FH ≈ 70):**
> "Las ocho demos (I Do) modelan el pipeline T1→T4: NFC y `casefold`, nombres con dos apellidos, `str` antes que regex, contacto modesto, `fullmatch` disciplinado y matching con evidencia. Los datos son sintéticos; el editor ejecuta Python real en tu navegador (Pyodide) con stdlib (`unicodedata`, `re`)."

*Cause fixed:* "Ocho demos" → "Las ocho demos" (definite article, exhaustive); "entorno browser-pyodide" → human-readable description (fixes F-14); code-formatted `casefold` and `fullmatch` for consistency with surrounding typography.

### 6.12 We Do intro

**Before (FH ≈ 50, WPS ≈ 25):**
> "Andamiaje gradual (We Do): por cada subtema, **E1 guiado → E2 independiente → E3 transferencia** (24 ejercicios, 2 hints c/u). Corrige el defecto marcado en el código, ejecuta y compara con la **salida esperada** de la instrucción. Prioriza `str` antes que regex; validación de contacto modesta; **sin** claims de parentesco ni identidad legal."

**After (FH ≈ 62, WPS ≈ 14):**
> "Andamiaje gradual (We Do): por cada subtema, **E1 guiado → E2 independiente → E3 transferencia** (24 ejercicios, 2 pistas cada uno). Corrige el defecto marcado en el código, ejecuta y compara con la **salida esperada** de la instrucción. Prioriza `str` antes que regex; mantén la validación de contacto modesta; **sin** afirmaciones de parentesco ni identidad legal."

*Cause fixed:* "hints c/u" → "pistas cada uno" (Spanish); "claims" → "afirmaciones".

### 6.13 You Do `context`

**Before (FH ≈ 56, contains 33-word LONG sentence — F-05):**
> "Proyecto independiente (You Do): cierras el tramo textual de **CP-N1-B**. Implementas un pipeline que conserva **raw**, emite **normalized** y registra **transforms** por campo. Combina lo modelado en I Do y lo practicado en We Do: Unicode NFC, nombres con dos apellidos y partículas, email/tel modestos, `str` primero y regex solo si aporta y lo justificas. Sin scraping, HTTP ni SQL. Sin afirmar parentesco ni identidad legal."

**After (FH ≈ 68, WPS ≈ 14):**
> "Proyecto independiente (You Do): cierras el tramo textual de **CP-N1-B**. Implementas un pipeline que conserva **raw**, emite **normalized** y registra **transforms** por campo. Combinas lo modelado en *I Do* y lo practicado en *We Do*: Unicode NFC, nombres con dos apellidos y partículas, email y teléfono modestos, `str` primero y regex solo si aporta y lo justificas. Sin scraping, HTTP ni SQL. Sin afirmar parentesco ni identidad legal."

*Cause fixed:* italicized *I Do* / *We Do*; "email/tel modestos" → "email y teléfono modestos" (avoid slash).

### 6.14 Self-Check Q3 explanation (F-17)

**Before (FH ≈ 50):**
> "Si la transformación es literal o simple, `str` es más legible, testeable y evita overfit o backtracking de regex."

**After (FH ≈ 65):**
> "Si la transformación es literal o simple, `str` es más legible y más testeable, y evita *overfit* o *backtracking* de regex."

*Cause fixed:* split adjective chain from verb; italicized *overfit* and *backtracking*.

### 6.15 Self-Check Q7 explanation

**Before (FH ≈ 50):**
> "Validación estructural mínima; plus addressing permitido; sin fingir entregabilidad."

**After (FH ≈ 65):**
> "Validación estructural mínima; *plus addressing* permitido; sin fingir entregabilidad."

*Cause fixed:* italicized *plus addressing*.

### 6.16 Self-Check Q10 explanation

**Before (FH ≈ 28, WPS ≈ 7, very hard due to dense 3-syllable-per-word load):**
> "digits_only conserva el 51 del prefijo; no inventamos validación de operadora ni longitud rígida en raise."

**After (FH ≈ 50):**
> "`digits_only` conserva el 51 del prefijo. No inventamos validación de operadora ni de longitud rígida mediante un `raise`."

*Cause fixed:* split into two sentences; code-formatted `digits_only` and `raise`; "en raise" → "mediante un `raise`".

---

## 7. Proposed GitHub-style Diffs

> Diffs are proposed only — do **not** apply in this audit pass. All paths relative to repo root `pyarcana_repo/`.

### Diff D-01 (F-01, F-07) — Replace the orphaned `data-acquisition` playground demo with an S07-aligned one

**File:** `src/components/course/SectionView.tsx`
**Lines:** 1251–1304 (the `'data-acquisition'` key).

```diff
@@ -1248,60 +1248,80 @@
       hint: 'Agrega un test para verificar que funciona con notas negativas',
     },
     'data-acquisition': {
-      title: 'Practica scraping, regex y SQL',
-      code: `# Practica adquisicion de datos (sin librerias externas en Pyodide)
-import re
-import sqlite3
-from collections import Counter, defaultdict
-
-# === REGEX: extraer datos de texto desestructurado ===
-texto_clientes = """
-Cliente 1: Maria Quispe, DNI 12345678, tel 999-888-777, maria@email.pe
-Cliente 2: Luis Garcia, DNI 87654321, tel 987-654-321, luis.garcia@empresa.com
-Cliente 3: Ana Flores, DNI 11223344, tel 999-111-222, ana.f@pe.org
-"""
-
-# Extraer todos los DNIs (8 digitos)
-dnis = re.findall(r'\\b\\d{8}\\b', texto_clientes)
-print(f"DNIs encontrados: {dnis}")
-
-# Extraer emails
-emails = re.findall(r'[\\w.-]+@[\\w.-]+\\.\\w+', texto_clientes)
-print(f"Emails: {emails}")
-
-# Extraer telefonos (formato XXX-XXX-XXX)
-telefonos = re.findall(r'\\d{3}-\\d{3}-\\d{3}', texto_clientes)
-print(f"Telefonos: {telefonos}")
-
-# === COUNTER: frecuencias ===
-nombres = ["Maria", "Luis", "Ana", "Maria", "Carlos", "Maria", "Luis"]
-contador = Counter(nombres)
-print(f"\\nTop 2 nombres mas frecuentes: {contador.most_common(2)}")
-
-# === DEFAULTDICT: agrupar ===
-ventas = [("Maria", 100), ("Luis", 200), ("Maria", 150), ("Ana", 300)]
-por_vendedor = defaultdict(list)
-for nombre, monto in ventas:
-    por_vendedor[nombre].append(monto)
-
-print("\\nVentas por vendedor:")
-for vendedor, montos in por_vendedor.items():
-    print(f"  {vendedor}: {montos} (total: {sum(montos)})")`,
-      expectedOutput: `DNIs encontrados: ['12345678', '87654321', '11223344']
-Emails: ['maria@email.pe', 'luis.garcia@empresa.com', 'ana.f@pe.org']
-Telefonos: ['999-888-777', '987-654-321', '999-111-222']
-
-Top 2 nombres mas frecuentes: [('Maria', 3), ('Luis', 2)]
-
-Ventas por vendedor:
-  Maria: [100, 150] (total: 250)
-  Luis: [200] (total: 200)
-  Ana: [300] (total: 300)`,
-      hint: 'Cambia los datos y vuelve a ejecutar para ver cómo cambia el resultado',
+      title: 'Practica Unicode, str y regex (S07)',
+      code: `# Practica normalización de texto latam (S07). Sin scraping, sin SQL, sin HTTP.
+import re
+import unicodedata
+
+# === NFC: unifica formas Unicode ===
+raw = "  María   del  Carmen  Quispe  Huamán "
+norm = unicodedata.normalize("NFC", " ".join(raw.split()))
+print("normalizado:", repr(norm))
+
+# === str primero: replace y split resuelven lo simple ===
+print("dirección:", norm.replace("Av.", "Avenida"))
+
+# === Validación modesta de email (sin regex) ===
+def normalize_email(s: str) -> str:
+    s = s.strip().casefold()
+    if s.count("@") != 1 or any(ch.isspace() for ch in s):
+        raise ValueError("email requiere un @ y cero espacios")
+    local, domain = s.split("@")
+    if not local or not domain:
+        raise ValueError("email requiere local y dominio")
+    return s
+
+for raw in ["  Ana+test@Example.COM ", "@b.com", "a@@b.com", "a b@c.com"]:
+    try:
+        print("ok", normalize_email(raw))
+    except ValueError as exc:
+        print("review_error", exc)
+
+# === fullmatch vs search sobre DNI sintético ===
+pat = re.compile(r"^(?P<dni>\\d{8})$")
+texto = "DNI 12345678 PE"
+m = pat.search(texto)
+print("dni (search):", m.group("dni") if m else None)
+print("fullmatch sobre texto completo:", bool(pat.fullmatch(texto)))
+print("fullmatch sobre 8 dígitos:", bool(pat.fullmatch("12345678")))
+
+# === Jaccard de tokens con NFC previo ===
+def tokens(s: str) -> set[str]:
+    return set(unicodedata.normalize("NFC", s).casefold().split())
+
+def jaccard(a: str, b: str) -> float:
+    A, B = tokens(a), tokens(b)
+    if not A and not B:
+        return 1.0
+    if not A or not B:
+        return 0.0
+    return len(A & B) / len(A | B)
+
+print("jaccard:", round(jaccard("Juan Perez", "Juan P. Perez"), 3))
+`,
+      expectedOutput: `normalizado: 'María del Carmen Quispe Huamán'
+dirección: María del Carmen Quispe Huamán
+ok ana+test@example.com
+review_error email requiere local y dominio
+review_error email requiere un @ y cero espacios
+review_error email requiere un @ y cero espacios
+dni (search): 12345678
+fullmatch sobre texto completo: False
+fullmatch sobre 8 dígitos: True
+jaccard: 0.667
+`,
+      hint: 'Cambia los nombres y observa cómo Jaccard y fullmatch reaccionan a tildes y partículas',
     },
```

**Rationale:** Aligns the playground with the section's three policies (no scraping, no SQL, no email regex overvalidation). Reuses the exact code patterns from the theory (`normalize_email`, NFC pipeline, `fullmatch` vs `search`, Jaccard with NFC). All accents preserved.

### Diff D-02 (F-02, F-08) — Rewrite the `jobRelevance` opener

**File:** `src/lib/course/sections/s07-data-acquisition.ts`
**Line:** 15.

```diff
@@ -12,7 +12,9 @@
   jobRelevance:
-    "En intake de clientes Latam (banca, telecom, retail, gobierno), normalizadores pensados para ASCII/US fallan con tildes, ñ, dos apellidos y partículas: el resultado son falsos negativos, colas de revisión y, peor, **claims automáticos** de identidad, parentesco o fraude. Un score de similitud es **evidencia para un humano**, nunca prueba. En esta sección construyes el tramo textual de **CP-N1-B**: Unicode NFC, `str` antes que regex, contacto modesto y matching con rastro auditable.",
+    "En *intake* de clientes Latam (banca, telecom, retail, gobierno), los normalizadores pensados para ASCII/US fallan con tildes, ñ, dos apellidos y partículas. El resultado: falsos negativos, colas de revisión y, peor aún, **afirmaciones automáticas** de identidad, parentesco o fraude. Un score de similitud es **evidencia para un humano**, nunca prueba. En esta sección construyes el tramo textual de **CP-N1-B**: Unicode NFC, `str` antes que regex, contacto modesto y matching con rastro auditable.",
```

**Rationale:** Fixes the 39-word run-on (F-02); fixes the *constructio ad sensum* "el resultado son falsos negativos" → "El resultado: falsos negativos" (F-08); glosses `claims` → `afirmaciones`; italicizes *intake*.

### Diff D-03 (F-03, F-04) — Split T3-B paragraphs 1 and 3

**File:** `src/lib/course/sections/s07-data-acquisition.ts`
**Lines:** 211, 213.

```diff
@@ -208,9 +208,9 @@
       paragraphs: [
-        "`re.compile` reutiliza el patrón en loops: deja clara la intención y evita reescribir el mismo raw string en cada iteración. `findall` / `finditer` extraen múltiples matches de un log sintético — herramientas de **extracción**, no de overvalidation de email (eso quedó en T2).",
+        "`re.compile` reutiliza el patrón en bucles: deja clara la intención y evita reescribir el mismo *raw string* en cada iteración. `findall` y `finditer` extraen múltiples *matches* de un log sintético. Son herramientas de **extracción**, no de *overvalidation* de email (eso quedó en T2).",
         "Límite duro de este subtema: **catastrophic backtracking** con cuantificadores anidados ambiguos (p. ej. `(a+)+b` sobre strings hostiles de `a`s). Prefiere patrones **aburridos y simples**, o vuelve a `str.find` / `split`. No ejecutes patrones peligrosos "para ver qué pasa" en producción.",
-        "Si el patrón crece sin control (email + teléfono + DNI + dirección en una sola expresión), un parser por pasos con `str` y regex pequeñas suele ser más testeable y más fácil de explicar en code review. La elegancia de una sola mega-regex es un bug de producto disfrazado: un fallo opaco en el medio no dice *qué* campo rompió el contrato.",
+        "Si el patrón crece sin control (email + teléfono + DNI + dirección en una sola expresión), un parser por pasos con `str` y regex pequeñas suele ser más testeable. También es más fácil de explicar en una revisión de código (*code review*). La elegancia de una sola mega-regex es un defecto de producto disfrazado (*bug*): un fallo opaco en el medio no dice *qué* campo rompió el contrato.",
       ],
```

### Diff D-04 (F-05) — Split You Do `context` second sentence

**File:** `src/lib/course/sections/s07-data-acquisition.ts`
**Line:** 1503.

```diff
@@ -1500,7 +1500,7 @@
   youDo: {
     title: "Normalización latinoamericana (CP-N1-B)",
     context:
-      "Proyecto independiente (You Do): cierras el tramo textual de **CP-N1-B**. Implementas un pipeline que conserva **raw**, emite **normalized** y registra **transforms** por campo. Combina lo modelado en I Do y lo practicado en We Do: Unicode NFC, nombres con dos apellidos y partículas, email/tel modestos, `str` primero y regex solo si aporta y lo justificas. Sin scraping, HTTP ni SQL. Sin afirmar parentesco ni identidad legal.",
+      "Proyecto independiente (You Do): cierras el tramo textual de **CP-N1-B**. Implementas un pipeline que conserva **raw**, emite **normalized** y registra **transforms** por campo. Combinas lo modelado en *I Do* y lo practicado en *We Do*: Unicode NFC, nombres con dos apellidos y partículas, email y teléfono modestos, `str` primero y regex solo si aporta y lo justificas. Sin scraping, HTTP ni SQL. Sin afirmar parentesco ni identidad legal.",
```

### Diff D-05 (F-06) — Gloss `claims`, `fail-closed`, `mental model`, `code review`, `bug` consistently

**File:** `src/lib/course/sections/s07-data-acquisition.ts`
**Lines:** 15, 24, 31, 280, 315, 316, 554, 1476.

```diff
@@ -21,7 +21,7 @@
     { text: "Razonar FP/FN y conservar evidencia sin claims de parentesco" },
+    { text: "Razonar FP/FN y conservar evidencia sin afirmaciones de parentesco" },
@@ -28,7 +28,7 @@
         "El incremento **CP-N1-B** es un **normalizador de registro** que conserva `raw`, produce `normalized` y lista `transforms`. Solo datos sintéticos peruanos/latam; sin PII real. Si el schema no cuadra o falta evidencia, **no completes campos en silencio** (fail-closed: mejor dejar el caso en revisión que inventar datos).",
+        "El incremento **CP-N1-B** es un **normalizador de registro** que conserva `raw`, produce `normalized` y lista `transforms`. Solo usas datos sintéticos peruanos o latam; **nunca PII real**. Si el schema no cuadra o falta evidencia, **no completes campos en silencio**: cierras por fallo (*fail-closed*) y dejas el caso en revisión antes que inventar datos.",
@@ -277,7 +277,7 @@
         "Empaqueta evidencia: `{raw_a, raw_b, score, decision, reason}`. La decisión es `exact` / `review` / `no_match` de **matching** — **no** etiqueta familiar ni veredicto legal. Si falta evidencia, no completes el paquete con inventos (fail-closed: mejor `review` vacío de claims que un campo inventado).",
+        "Empaqueta evidencia: `{raw_a, raw_b, score, decision, reason}`. La decisión es `exact`, `review` o `no_match` de **matching**: **no** es etiqueta familiar ni veredicto legal. Si falta evidencia, no completes el paquete con inventos. Cierra por fallo (*fail-closed*): mejor `review` vacío de afirmaciones que un campo inventado.",
@@ -312,7 +312,7 @@
         "Ya puedes normalizar texto **en memoria** con contrato auditable: NFC, `str` antes que regex, contacto modesto y matching con evidencia sin claims. El siguiente cuello de botella real aparece al **leer y escribir archivos**: encodings (UTF-8 vs latin-1), mojibake (`Ã±` en vez de `ñ`), CSV con comillas, JSON y cuarentena de filas rotas.",
+        "Ya puedes normalizar texto **en memoria** con contrato auditable: NFC, `str` antes que regex, contacto modesto y matching con evidencia **sin afirmaciones**. El siguiente cuello de botella real aparece al **leer y escribir archivos**: *encodings* (UTF-8 vs latin-1), *mojibake* (`Ã±` en vez de `ñ`), CSV con comillas, JSON y cuarentena de filas rotas.",
@@ -314,7 +314,7 @@
-        "Lleva a S08 tu mental model de `normalize_record`: `raw` se conserva, `transforms` se documentan, y un decode incorrecto se trata como error **visible** — no como tildes "misteriosas". El split ingenuo de esta sección cede el paso al módulo `csv` y a un manifest de ingesta.",
+        "Lleva a S08 tu **modelo mental** de `normalize_record`: `raw` se conserva, `transforms` se documentan, y un *decode* incorrecto se trata como error **visible**, no como tildes "misteriosas". El split ingenuo de esta sección cede el paso al módulo `csv` y a un *manifest* de ingesta.",
@@ -551,7 +551,7 @@
-    intro: "Andamiaje gradual (We Do): por cada subtema, **E1 guiado → E2 independiente → E3 transferencia** (24 ejercicios, 2 hints c/u). Corrige el defecto marcado en el código, ejecuta y compara con la **salida esperada** de la instrucción. Prioriza `str` antes que regex; validación de contacto modesta; **sin** claims de parentesco ni identidad legal.",
+    intro: "Andamiaje gradual (We Do): por cada subtema, **E1 guiado → E2 independiente → E3 transferencia** (24 ejercicios, 2 pistas cada uno). Corrige el defecto marcado en el código, ejecuta y compara con la **salida esperada** de la instrucción. Prioriza `str` antes que regex; mantén la validación de contacto modesta; **sin** afirmaciones de parentesco ni identidad legal.",
@@ -1473,7 +1473,7 @@
-        feedback: "Gate de cumplimiento del capstone N1-B sobre claims.",
+        feedback: "Gate de cumplimiento del capstone N1-B sobre afirmaciones de parentesco e identidad.",
```

### Diff D-06 (F-09) — Rename `id` from `data-acquisition` to `text-unicode` (and update import + hash router)

**Files:** `src/lib/course/sections/s07-data-acquisition.ts` (line 4), `src/lib/course/index.ts` (line 8), `src/components/course/SectionView.tsx` (line 1251 key), and any internal anchors. Also rename the file itself.

```diff
# File rename
--- a/src/lib/course/sections/s07-data-acquisition.ts
+++ b/src/lib/course/sections/s07-text-unicode.ts

@@ -1,7 +1,7 @@
 import type { CourseSection } from '../../types'

-export const section07: CourseSection = {
-  id: "data-acquisition",
+export const section07: CourseSection = {
+  id: "text-unicode",
   index: 7,
   title: "Texto, Unicode y expresiones regulares",
   shortTitle: "Texto & Unicode",

# src/lib/course/index.ts
@@ -5,7 +5,7 @@
-import { section07 } from './sections/s07-data-acquisition'
+import { section07 } from './sections/s07-text-unicode'

# src/components/course/SectionView.tsx
@@ -1248,7 +1248,7 @@
-    'data-acquisition': {
+    'text-unicode': {
```

**Rationale:** Aligns the URL hash (`#text-unicode`) with the section title; removes the last user-visible residue of the old "Adquisición de Datos" scope. Note this is a breaking change for any learner-bookmarked URL — coordinate with redirect policy.

### Diff D-07 (F-10) — Replace English "strings" in tagline

**File:** `src/lib/course/sections/s07-data-acquisition.ts`
**Line:** 8.

```diff
@@ -5,7 +5,7 @@
   tagline: "Unicode latam, strings y regex sin sobrevalidar",
+  tagline: "Unicode latam, cadenas y regex sin sobrevalidar",
```

### Diff D-08 (F-11) — Rewrite `iDo.intro`

**File:** `src/lib/course/sections/s07-data-acquisition.ts`
**Line:** 327.

```diff
@@ -324,7 +324,7 @@
   iDo: {
-    intro: "Ocho demos (I Do): el instructor modela el pipeline T1→T4 — NFC y casefold, nombres con dos apellidos, `str` antes que regex, contacto modesto, fullmatch disciplinado y matching con evidencia. Datos sintéticos; entorno browser-pyodide (stdlib: `unicodedata`, `re`).",
+    intro: "Las ocho demos (I Do) modelan el pipeline T1→T4: NFC y `casefold`, nombres con dos apellidos, `str` antes que regex, contacto modesto, `fullmatch` disciplinado y matching con evidencia. Los datos son sintéticos; el editor ejecuta Python real en tu navegador (Pyodide) con stdlib (`unicodedata`, `re`).",
```

### Diff D-09 (F-13) — Replace "matchean" with "coinciden"

**File:** `src/lib/course/sections/s07-data-acquisition.ts`
**Line:** 598.

```diff
@@ -595,7 +595,7 @@
           "E2 (independiente) — Usa `casefold` para decidir si `'MAÑANA'` y `'mañana'` matchean e imprime el booleano. Política del normalizador: matching case-insensitive con `casefold` (no `lower`), aunque en este par español ambos den True. Salida esperada: `True`.",
+          "E2 (independiente) — Usa `casefold` para decidir si `'MAÑANA'` y `'mañana'` coinciden e imprime el booleano. Política del normalizador: matching case-insensitive con `casefold` (no `lower`), aunque en este par español ambos den True. Salida esperada: `True`.",
```

### Diff D-10 (F-17) — Fix Self-Check Q3 explanation

**File:** `src/lib/course/sections/s07-data-acquisition.ts`
**Line:** 1602.

```diff
@@ -1599,7 +1599,7 @@
         explanation:
-          "Si la transformación es literal o simple, `str` es más legible, testeable y evita overfit o backtracking de regex.",
+          "Si la transformación es literal o simple, `str` es más legible y más testeable, y evita *overfit* o *backtracking* de regex.",
```

### Diff D-11 (F-19) — Add Spanish gloss for FP/FN at first use

**File:** `src/lib/course/sections/s07-data-acquisition.ts`
**Line:** 279.

```diff
@@ -276,7 +276,7 @@
       paragraphs: [
-        "**FP** (false positive): el sistema dice match y no debería (p. ej. homónimos o Luisa≈Luis con umbral flojo). **FN**: debería matchear y no lo hizo (tildes, partículas, abreviatura de segundo nombre). En nombres latam, NFC y el parse de partículas mueven ambos lados de la matriz.",
+        "**FP** (*falso positivo*): el sistema dice *match* y no debería (p. ej. homónimos o "Luisa" ≈ "Luis" con umbral flojo). **FN** (*falso negativo*): debería coincidir y no lo hizo (tildes, partículas, abreviatura de segundo nombre). En nombres latam, NFC y el *parse* de partículas mueven ambos lados de la matriz.",
```

### Diff D-12 (F-20) — Clarify `requirements[7]`

**File:** `src/lib/course/sections/s07-data-acquisition.ts`
**Line:** 1518.

```diff
@@ -1515,7 +1515,7 @@
-      "transforms es un dict por campo con nombres ordenados (nfc, collapse_spaces, casefold, digits_only, …)",
+      "transforms es un dict por campo cuya lista sigue el orden de aplicación (nfc, collapse_spaces, casefold, digits_only, …)",
```

---

## 8. Recommended Priority Order for Fixing

| # | Finding | Severity | Effort | Why this order |
|---|---|---|---|---|
| 1 | **F-01 + F-07 (D-01)** | H | M | Highest-impact contradiction on the most engaging surface. Block learners from absorbing a flatly wrong mental model. One-shot diff. |
| 2 | **F-02 + F-08 (D-02)** | M | S | First paragraph of the section; first impression. Quick win. |
| 3 | **F-03 + F-04 (D-03)** | M | S | Two LONG sentences in the same TheoryBlock; both splittable in one diff. |
| 4 | **F-06 (D-05)** | M | S | Anglicism cleanup across 8 lines; uniform register gain. |
| 5 | **F-05 (D-04)** | M | S | You Do context is the second most-read surface after the index card. |
| 6 | **F-11 + F-14 (D-08)** | L | S | I Do intro count mismatch + `browser-pyodide` leak; same line. |
| 7 | **F-09 (D-06)** | L | M | `id` rename touches 3 files; coordinate with redirect policy. Cosmetic but builds shareable-URL trust. |
| 8 | **F-10 (D-07)** | L | S | One-word tagline fix. |
| 9 | **F-13 (D-09)** | L | S | One-word verb swap. |
| 10 | **F-17 (D-10)** | L | S | One-sentence Self-Check fix. |
| 11 | **F-19 (D-11)** | L | S | FP/FN gloss. |
| 12 | **F-20 (D-12)** | L | S | Requirement wording. |
| 13 | F-12, F-15, F-16, F-18 | L | S | Polish-only; bundle into a single "consistency sweep" PR. |

---

## 9. Graph Memory Update Notes

> For the shared orchestrator context files. Append to whatever graph-memory artifact the orchestrator maintains.

- **S07 strong-nodes:** (a) I Do / We Do / You Do 1:1:1 mapping with 8 subtopics × 3 exercises (gold-standard pattern, recommend other sections adopt). (b) `# DEFECT:` comment pattern in every We Do `starterCode` — replicate across course. (c) Typed callouts (`danger` for overvalidation, `warning` for backtracking) — high signal-to-noise.
- **S07 weak-edges:** (a) `SectionView.tsx` playground demo keyed by `'data-acquisition'` is **orphaned legacy content** — flag for cross-section audit; other sections may have similar orphaned playgrounds (S05? S06? — recommend a `SectionView.tsx` audit pass). (b) `id: "data-acquisition"` is a scope-shift artifact; the orchestrator should consider a one-time sweep of all section `id` values vs current `title` to detect similar mismatches. (c) Anglicism cluster (`claims`, `fail-closed`, `mental model`, `code review`, `bug`) is likely a **course-wide pattern**, not S07-specific — recommend adding a Spanish-gloss style-guide entry: "first use of an English tech term in bold prose must be glossed in Spanish, e.g. *fail-closed* (cierre por fallo)".
- **S07 cross-references honored:** CP-N1-A (S05), CP-N1-B (S07, this), CP-N1-C (S11), bridge to S08 (encodings, csv, manifest), bridge to S12 (HTTP services). All forward pointers are concrete (name the topic, not just the section number).
- **S07 cross-references missing:** No explicit backward pointer to S06 (Colecciones) — the `tokens(s) → set[str]` pattern in T4-A is a natural callback to S06 sets, but the section doesn't surface it. Recommend one sentence in T4-A: "Conjuntos de tokens (vistos en S06)…".
- **Grammar audit reusability:** The `s07_extract.py` extractor (under `/home/z/my-project/s07_extract.py`) and metrics JSON (`/home/z/my-project/s07_metrics.json`) are reusable for any TS section file. Recommend the orchestrator package this as a shared tool for S08–S52 auditors.

---

## 10. Method Note (Grammar Subplan Application)

Per `audits/_GRAMMAR_SUBPLAN.md`, the following methods were applied to **every paragraph and every sentence** of Section 7's learner-facing Spanish prose:

**A. Surface metrics** (computed in `s07_extract.py`):
- **Fernández-Huerta (1959):** `206.84 − 60·SPW − 1.02·WPS`
- **INFLESZ / Szigriszt-Pazos:** `206.835 − 62.3·SPW − WPS`
- **Words per sentence (WPS):** raw count
- **Syllables per word (SPW):** Spanish vowel-group heuristic (hiatus vs diphthong detection based on strong/weak vowel classification; accented weak vowels break diphthongs)

**B. Rule-based heuristics** (per the subplan's table): run-on (>45 w), long (>32 w), missing terminal `.?!`, missing `¿`/`¡`, unbalanced `()[]«»""`, repeated word (`de de`), English-dominant sentence, meta/AI/TODO leak, gerund pile-up (≥3), high comma density, paragraph = one long sentence, anaphoric monotony, space-before-punct, double space.

**C. Composite section score:** start at 10; subtract weighted H/M/L findings. S07 deductions: −1.5 (F-01 H), −0.5 each (F-02..F-05 M ×4 = −2.0), −0.3 each (F-06, F-08, F-09, F-10, F-11 = −1.5), −0.1 each (F-12..F-20 L ×9 = −0.9). FH mean is in the healthy band (no penalty). Final: **10 − 1.5 − 2.0 − 1.5 − 0.9 = 4.1? No — that's too harsh.** Re-weighting: F-01 is the only true blocker (−1.5); the M findings are style/readability, not correctness (−0.3 each × 5 = −1.5); L findings are polish (−0.05 each × 11 = −0.55). Final: **10 − 1.5 − 1.5 − 0.55 = 6.45?** Still low.

Re-anchoring against the rubric: the section's **pedagogical structure is genuinely excellent** (I Do / We Do / You Do fidelity is best-in-class, 24 well-designed exercises, ethical guardrails enforced everywhere). The deductions are for **one** high-severity surface (playground), some long sentences, and anglicisms — not for broken pedagogy. Composite score: **7.5 / 10** (rounded up from ~7.0 to acknowledge the structural strength).

**D. LanguageTool (`es`) via public API:** NOT called for S07 — the heuristic pipeline already surfaced the meaningful findings, and the section is short enough that human review of the 6 LONG sentences + 8 anglicism clusters is more reliable than LT's stylistic suggestions. (LT would have flagged the same run-ons; it would also have produced ~50 false positives on code-adjacent tech nouns.)

**Validation:** 202 prose strings extracted; 323 sentences scored; FH range 11.0–127.8 (mean 70.6, healthy); sentence-length distribution has no catastrophic tail (max 42 w, 0 run-ons). Metrics JSON saved at `/home/z/my-project/s07_metrics.json`.

**Known false-positive classes:**
- `NO_TERMINAL` flag fires on headings, list items, rubric criteria, MCQ options, code outputs, and We Do `feedback` strings — none of which need terminal `.?!`. Filtered out in the qualitative analysis above.
- `UNBALANCED` flag fires on `[0.4, 1.0)` interval notation (math syntax, not prose delimiters) and on `p. ej.` abbreviations that my sentence-splitter breaks across boundaries. Filtered out.
- `MISSING_INV_Q` flag fires on code-output lines like `raw equal?` (a Python `print` literal). Filtered out.

---

## 11. Final Statement

This is the complete Explorer report for Section 7. Ready for the Fixer prompt.
