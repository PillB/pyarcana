# S07 Explorer Report — Texto, Unicode y expresiones regulares

**Generated:** 2026-07-24  
**Auditor mode:** Stanford STORM + Graph Engineering + Loop Engineering + Harness Engineering  
**Scope lock:** Section 7 only (`data-acquisition`)  
**Live site:** https://pillb.github.io/pyarcana/ (SPA; section hash `data-acquisition`)  
**Source of truth analyzed:** `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s07-data-acquisition.ts`  
**Comparative anchors:** S05 (`s05-oop.ts` gold-style We Do instructions), live curriculum card “Sección 7 · Texto & Unicode”, external best practices (Python Unicode HOWTO, re HOWTO, GRR / I–We–You, anti-overvalidation of emails)

---

## 1. Section Identification & Scope

| Field | Value |
| --- | --- |
| Platform section id (hash) | `data-acquisition` |
| Curriculum index | 7 |
| Title (metadata) | Texto, Unicode y expresiones regulares |
| shortTitle (live card) | Texto & Unicode |
| Source file | `src/lib/course/sections/s07-data-acquisition.ts` |
| estimatedHours | 18 |
| level | Intermedio |
| phase | 0 |
| Capstone thread | CP-N1-B (normalizador de registro: raw / normalized / transforms) |
| Theory blocks | 9 (1 map + 8 subtopics T1-A…T4-B) |
| I Do demos | 8 (`S07-T*-DEMO`) |
| We Do exercises | 24 (E1/E2/E3 × 8 subtopics) |
| You Do | `latam_normalize.py` portfolio (NotImplementedError skeleton) |
| Self-check | 5 MCQ |
| Resources | docs + books + courses (Python stdlib, RegexOne, CS50P, MIT 6.100L, etc.) |

**In scope this run:** theory, callouts, I Do, We Do, You Do, selfCheck, resources, jobRelevance, learningOutcomes, tagline — all in `s07-data-acquisition.ts` and the corresponding live curriculum surface for S07.  
**Out of scope:** applying fixes; editing product TS; auditing S06/S08.

**Live vs source note:** GitHub Pages is a client SPA; hash `#data-acquisition` does not server-render section body HTML. Content audit is therefore grounded in the TypeScript course object that the app hydrates. The public curriculum list correctly shows **Sección 7 · Texto & Unicode · “Unicode latam, strings y regex sin sobrevalidar” · 18h · Intermedio**, matching source metadata (title/tagline), not the legacy filesystem name `data-acquisition`.

---

## 2. Executive Summary of Quality (1–10 score + key verdict)

### Score: **6.4 / 10**

### Verdict

S07 is **conceptually strong and professionally differentiated**: progressive order Unicode → `str` methods → modest contact validation → regex with fullmatch discipline → Jaccard + FP/FN + ethics of non-claims. That sequence matches cognitive-load best practice (simple → complex; str before regex) and Latam product reality better than most intro-regex units in CS50P / RegexOne alone. The You Do (`normalize_record` with raw/normalized/transforms) is a coherent CP-N1-B increment.

However, **learner-facing quality is undermined by systematic developer meta-leak, copy-paste boilerplate, truncated exercise instructions, and repeated theory filler**. Compared with S05 gold We Do instructions (short, task-first, no curriculum IDs), S07 exercises bury the real task behind ~40–60 words of harness text, several of which are **cut mid-sentence**. Grammar/typos (`extración`, `Política modestas`) and at least one **pedagogically misleading DEFECT claim** (that `lower()` fails on Ñ/ñ) reduce trust. Self-check is thin (5 items) for an 18h intermediate section with 8 LOs.

**Bottom line for Fixer:** treat as **redaction + connective-tissue + exercise instruction rewrite** priority, not a content rewrite from scratch. Keep the technical spine; delete curriculum archaeology; restore S05-style task prose.

---

## 3. Detailed Issue Registry

Severity legend: **P0** ship-blocker for learner trust · **P1** high pedagogy/redaction impact · **P2** medium polish · **P3** nice-to-have

### Issue 01 — Meta-leak: curriculum V3 / legacy path in learner theory
- **Severity:** P0  
- **Location:** theory[0] map paragraphs + callout “Contenido reubicado”  
- **Evidence:**  
  > “En V3, **S07 no es el path principal de scraping, SQL ni APIs**. Esos temas se reubican.”  
  > “Scraping/API/SQL del **legado** de esta sección **no son el camino V3 en S07**.”  
- **Pedagogical impact:** Students never saw “V3” or the old scraping path. This is author-to-author archaeology that increases extraneous cognitive load and implies the course is unstable.  
- **Dimension:** Meta-text; connective tissue (false negative motivation).

### Issue 02 — Meta-leak: preserved platform id in jobRelevance
- **Severity:** P0  
- **Location:** `jobRelevance`  
- **Evidence:**  
  > “Esta sección (**id `data-acquisition` conservado**) enseña Unicode…”  
- **Pedagogical impact:** Internal migration note; useless for learners; confuses the mental model of “what is this section about?” vs hash slug.  
- **Dimension:** Meta-text.

### Issue 03 — Meta-leak: “incremento V3” in You Do requirements
- **Severity:** P1  
- **Location:** `youDo.requirements`  
- **Evidence:**  
  > “Sin scraping/API en este **incremento V3**”  
- **Pedagogical impact:** Same archaeology; can be “Sin scraping ni APIs en este proyecto.”  
- **Dimension:** Meta-text.

### Issue 04 — Systematic We Do instruction boilerplate (curriculum harness)
- **Severity:** P0  
- **Location:** ~18 of 24 `weDo.steps[].instruction` strings  
- **Evidence (pattern):**  
  > “Concepto: S07-T1-A (Texto, Unicode y regex). Entrada: fixture sintético del starter (\`CASO\`/ids C00x) en texto y similaridad. Tarea: … Conserva el contrato del starter (no borres asserts ni datos); no pandas, no APIs de S08+; solo stdlib str/unicodedata/re (S01–S07).”  
- **Pedagogical impact:** Violates progressive disclosure and GRR clarity. S05 gold style is task-first: *“E1 (guiado) — Escribe `def doble(n):`…”*. Here the learner must filter IDs, section ranges, and anti-stack bans before finding the verb. Extraneous load (Sweller) is high across 24 items.  
- **Dimension:** Cognitive load; redaction; consistency with early gold sections.

### Issue 05 — Truncated / broken exercise instructions
- **Severity:** P0  
- **Locations & evidence:**  
  - `S07-T1-B-E3`: ends with `…solo stdlib str/unicodedata/re (S01–S07).` OK, but also: `…no pandas, no APIs de.` (**incomplete**)  
  - `S07-T3-A-E3`: `…Conserva el contrato del.` (**truncated**)  
  - `S07-T4-A-E3`: `…no pandas, no APIs.` (**truncated**)  
  - `S07-T4-B-E2`: `…(no borres asserts ni.` (**truncated**)  
  - `S07-T4-B-E3`: `…(no borres asserts.` (**truncated**)  
- **Pedagogical impact:** Looks unfinished; undermines trust; auto-check tools may parse broken pass criteria (“salida exacta del solution output del starter”).  
- **Dimension:** Redaction; exercise quality.

### Issue 06 — Repeated theory filler paragraph (copy-paste graph edge)
- **Severity:** P1  
- **Locations:** T1-B, T4-A, T4-B (and partial echo elsewhere)  
- **Evidence (verbatim thrice):**  
  > “En texto y similaridad, el *porqué* es operativo: reduce ambigüedad en pipelines locales, deja rastro auditable y alimenta normalización NFC + evidencia textual (CP-N1-A/B) sin inventar hechos sobre personas reales.”  
- **Also repeated:** “Fail-closed si el schema no cuadra; no rellenes en silencio.” / “Caso sintético Perú: nombres sintéticos José/Quispe…”  
- **Pedagogical impact:** Narrative flatness; student skips paragraphs; real connective tissue (why *this* subtopic now) is diluted. Graph Engineering: three nodes with identical content = zero new information edges.  
- **Dimension:** Connective tissue; redaction; cognitive load.

### Issue 07 — Typo: “extración”
- **Severity:** P2  
- **Location:** T3-B theory paragraph  
- **Evidence:**  
  > “útil en demos de **extración**, no en overvalidation de email.”  
- **Fix:** extracción  
- **Dimension:** Grammar (Peruvian Spanish / standard Spanish orthography).

### Issue 08 — Grammar: “Política modestas”
- **Severity:** P2  
- **Location:** `S07-T2-B-E2` feedback  
- **Evidence:**  
  > “**Política modestas** de dígitos > regex de formato rígido.”  
- **Fix:** “Políticas modestas…” or “Una política modesta…”  
- **Dimension:** Grammar.

### Issue 09 — Misleading DEFECT narrative on `lower()` vs `casefold()` for Ñ
- **Severity:** P1  
- **Location:** `S07-T1-A-E2` starter comment + instruction framing  
- **Evidence:**  
  > `# DEFECT: compara lower (falla con Ñ/ñ en algunos locales)`  
  In CPython 3, `'MAÑANA'.lower() == 'mañana'.lower()` is **True**. The classic `casefold` win is German ß / special casing, not Spanish ñ.  
- **Pedagogical impact:** Teaches a false failure mode; students who experiment will “disprove” the lesson and lose trust in casefold guidance (which is still *good* practice for case-insensitive matching generally).  
- **Dimension:** Technical accuracy; pedagogy.

### Issue 10 — Pipeline inconsistency: Jaccard without NFC
- **Severity:** P1  
- **Locations:** T4-A theory `tokens()` / `token_jaccard`; I Do T4-A replaces `.` but still no NFC; T4-A-E1 norm omits NFC though theory pipeline is “NFC → strip/collapse → casefold”  
- **Evidence:** Theory map and T1 insist NFC before compare; T4 equality path often uses only `casefold`+collapse.  
- **Pedagogical impact:** Student can pass exercises while producing FN on José vs José; You Do requires NFC on names but matching demos don’t compose the full pipeline.  
- **Dimension:** Consistency; progressive disclosure; exercise alignment.

### Issue 11 — `\w` named-group demo under-teaches Latam names
- **Severity:** P2  
- **Location:** T3-A-E2 pattern `r'^(?P<nom>\w+) (?P<ap>\w+)$'` on `'Ana Quispe'`  
- **Note:** Python 3 `re` is Unicode-aware so accented letters often match `\w`, but particles/spaces (`María del Carmen`) and the earlier “str first” doctrine make this a weak Latam transfer. Risk of students overusing `\w+` for names after the section warned against US first/last.  
- **Dimension:** Exercise quality; consistency with T1-B.

### Issue 12 — Self-check too thin for 18h / 8 LOs
- **Severity:** P2  
- **Location:** `selfCheck.questions` (n=5)  
- **Gaps vs LOs:** no item on `compile`/`findall`, catastrophic backtracking caution, email modest contract, particles, phone digits-only policy.  
- **Pedagogical impact:** Active recall under-samples the section; gate to S08 may pass without regex or contact-normalization fluency.  
- **Dimension:** Exam quality; GRR closure.

### Issue 13 — Missing end-of-section bridge to S08
- **Severity:** P2  
- **Location:** end of theory / after You Do / no closing callout  
- **Evidence:** CSV-like note points forward to `csv` in S08 mid-section, but there is no closing “próximo paso” node (archivos, encoding on disk, manifest).  
- **Pedagogical impact:** Weaker roadmap continuity than early sections that foreshadow the next deliverable.  
- **Dimension:** Connective tissue; roadmap consistency.

### Issue 14 — You Do “Regex responsable” rubric vs skeleton without regex
- **Severity:** P2  
- **Location:** `youDo.rubric` 15% “Regex responsable” vs starter that only needs str/unicodedata for core fields  
- **Pedagogical impact:** Student may invent forced regex for score, contradicting “str primero”. Rubric should weight NFC/nombres/email/tel/transforms, with regex optional only if student extracts a code.  
- **Dimension:** Exercise/You Do alignment.

### Issue 15 — Anglicism / hybrid Spanish in exercise copy
- **Severity:** P3  
- **Evidence:** “campos **strippeados**”; mixed “match/score/review” OK as technical loans but “strippeados” is awkward.  
- **Fix:** “campos recortados con `strip`” or “campos sin espacios laterales”.  
- **Dimension:** Redaction (Peruvian Spanish register).

### Issue 16 — I Do demo: “Jiron” missing accent
- **Severity:** P3  
- **Location:** S07-T2-A-DEMO output `Jiron de la Unión 450`  
- **Note:** Demo intentionally does literal replace; still a small Latam authenticity miss (`Jirón`). Optional comment that replace is literal and may leave imperfect orthography.  
- **Dimension:** Domain authenticity.

### Issue 17 — Cognitive pile-on: ethics + metrics + regex limits in T3-B/T4
- **Severity:** P2  
- **Evidence:** T3-B introduces catastrophic backtracking; T4 adds Jaccard formula, decision thresholds, FP/FN table, and compliance language in one stretch.  
- **Pedagogical impact:** Intrinsic load is high for Intermedio if We Do E3s are also “print policy” rather than code transfer. Prefer one worked ethics packet and shorter backtracking warning.  
- **Dimension:** Cognitive load; progressive disclosure.

### Issue 18 — jobRelevance density / double duty
- **Severity:** P2  
- **Evidence:** Long paragraph mixes product risk, parentesco/fraude, score-as-evidence, CP-N1-B, and id leak.  
- **Pedagogical impact:** Motivation is good but multi-clause sentence is hard for first read. Split motivation vs learning promise.  
- **Dimension:** Redaction; accessibility.

### Issue 19 — Starter `# DEFECT` + `print('ok', True)` harness residue
- **Severity:** P3 (section-wide pattern; milder than boilerplate)  
- **Note:** Also present in S05; treat as platform convention. Still, when combined with S07’s long instructions, it adds noise. Prefer S02-style “Contrato: corrige el DEFECT…” inside code only, not duplicated in prose.  
- **Dimension:** Consistency; meta-adjacent.

### Issue 20 — External comparison gap: no encoding/bytes on the wire or disk
- **Severity:** P3 (scope-acceptable if S08 owns it)  
- **External norm:** Python Unicode HOWTO and real Latam ETL always pair NFC with **UTF-8 vs latin-1 mis-decode**. S07 stays in pure `str` (correct for progressive disclosure) but never foreshadows mojibake.  
- **Pedagogical impact:** Students may think “Unicode problems = NFC only.” One callout pointing to S08 encodings would close the graph edge.  
- **Dimension:** Comparative quality; roadmap.

### Issue 21 — Pass criteria phrasing refers to “solution output del starter”
- **Severity:** P2  
- **Locations:** several E3 instructions  
- **Evidence:**  
  > “Salida/pass: salida exacta del solution output del starter.”  
- **Pedagogical impact:** Learners do not see solution until after attempt; “starter” ≠ solution. Should name expected prints or fields.  
- **Dimension:** Exercise quality; clarity.

### Issue 22 — Theory phone contract vs optional “9 dígitos locales”
- **Severity:** P3  
- **Evidence:** T2-B says optionally review 9 local digits; code only `isdigit()` join; PE mobiles often 9 starting with 9; `+51` kept as digits `51…`. Internally consistent enough; document that validation of length is **out of band / review**, not raise.  
- **Dimension:** Clarity.

---

## 4. Meta-Leak Report

Exact leaked / developer-facing text that should not appear as student-facing curriculum prose:

| # | Exact leaked text (quote) | Location |
| --- | --- | --- |
| M1 | `id \`data-acquisition\` conservado` | `jobRelevance` |
| M2 | `En V3, **S07 no es el path principal de scraping, SQL ni APIs**. Esos temas se reubican.` | theory[0].paragraphs[0] |
| M3 | `Scraping/API/SQL del legado de esta sección **no son el camino V3 en S07**.` | theory[0].callout.content |
| M4 | Callout title `Contenido reubicado` | theory[0].callout |
| M5 | `Sin scraping/API en este incremento V3` | youDo.requirements |
| M6 | `Concepto: S07-T*-* (Texto, Unicode y regex). Entrada: fixture sintético del starter (\`CASO\`/ids C00x) en texto y similaridad.` | multiple weDo.instruction |
| M7 | `Conserva el contrato del starter (no borres asserts ni datos); no pandas, no APIs de S08+; solo stdlib str/unicodedata/re (S01–S07).` | multiple weDo.instruction |
| M8 | Truncated harness fragments: `no APIs de.` / `contrato del.` / `borres asserts ni.` | T1-B-E3, T3-A-E3, T4-A-E3, T4-B-E2, T4-B-E3 |
| M9 | Repeated internal slogan `el *porqué* es operativo… (CP-N1-A/B)` as filler (author template residue) | T1-B, T4-A, T4-B theory |
| M10 | Heading `De “Adquisición multi-fuente” a texto Unicode y regex (mapa)` — assumes knowledge of old section name | theory[0].heading |

**Meta-leak count (distinct surface classes): 10**  
**Approximate student-visible occurrences: 25+** (mostly M6/M7 repeated).

**Not counted as leaks (intentional pedagogy markers):** `# DEFECT:` in starters if framed as “hay un defecto a corregir”; technical terms FP/FN/NFC; synthetic `CASO-LIM-007` case ids inside code comments (borderline — acceptable if instructions don’t expand them).

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 Pre-round research anchors (applied)

- **Gradual Release of Responsibility (I Do / We Do / You Do):** model → guided → independent; scaffold then remove support. S07 structure matches (8 demos → 24 scaffolded exercises → portfolio). Weakness: We Do *prose* is not scaffolded—it is templated noise.  
- **Cognitive load:** reduce extraneous load (meta, repetition); manage intrinsic load (Unicode then str then regex).  
- **Unicode teaching:** normalize before compare (NFC); casefold for caseless match (real wins beyond Spanish orthography).  
- **Regex teaching:** raw strings, compile for reuse, fullmatch vs search, avoid overvalidation and catastrophic backtracking.  
- **Product ethics (course-specific strength):** score ≠ identity/parentesco — better than most regex modules.

### 5.2 I Do / We Do / You Do fidelity

| Phase | Fidelity | Notes |
| --- | --- | --- |
| I Do | **High** | 8 demos aligned to 8 subtopics; each has `why`; browser-pyodide stdlib-only is correct. |
| We Do | **Medium–Low prose / High structure** | E1→E2→E3 kinds present; hints×2; solutions with outputs. Instruction quality far below S05. Several E3s are “print policy” (transfer of judgment) rather than code transfer—OK for T4 ethics, weak for T3-B if overused. |
| You Do | **High concept / Medium scaffold** | Excellent contract (`raw`, `normalized`, `transforms`). Skeleton clear. Rubric regex weight slightly misaligned. portfolioNote good for GitHub evidence. |
| Self-check | **Low coverage** | 5 solid items; expand. |

### 5.3 Progressive disclosure

**Strengths:** T1 Unicode → T2 str/contact → T3 regex → T4 similarity/ethics is the right order. Explicit “str primero” callouts match industry and teaching research.

**Weaknesses:** Opening map dumps V3 relocation + CP-N1-B schema language before any code point is shown. NFC code demo is excellent but follows meta paragraph. Matching pipeline stated in T1 is not enforced in T4 code samples.

### 5.4 Connective tissue vs gold early sections

S05 map also has a “reubicado” callout (OOP→S11), so S07 is **not unique**—but S07’s student value proposition is *harder* to grasp if the first thing they read is “this is not scraping.” Prefer: *problem of Latam names and false negatives* → *what you will build* → optional one-line “APIs y archivos vienen en S08/S12.”

Repeated “porqué operativo” paragraph is the opposite of connective tissue: it is **disconnected tissue**.

### 5.5 Grammar & Peruvian Spanish redaction

- Overall tone is technical-professional Spanish with PE toponyms (Lima, Arequipa, Miraflores, Jr. de la Unión) — good situating.  
- Issues: typos (extración), agreement (Política modestas), anglicisms (strippeados), truncated sentences (P0).  
- Loanwords (review, match, score, pipeline, fail-closed) are consistent with the rest of the course; keep, but define fail-closed once in plain Spanish on first use in S07 (“si falta evidencia, no completes campos inventados”).

### 5.6 Comparative quality (external)

| Source | What S07 does better | What external does better / S07 should steal |
| --- | --- | --- |
| Python Unicode HOWTO | Hands-on NFC equality demo with José | Explicit encodings / UTF-8 bridge |
| re HOWTO / Corey Schafer-style intros | fullmatch discipline + anti-overvalidation | Cleaner progressive pattern catalog without ethics overload in same breath |
| RegexOne | Moderation warning; integrated into intake | Interactive graded pattern drills (optional resource already linked) |
| CS50P validate | Modest email vs hyper-strict | Shorter exercises, clearer pass lines |
| Typical US name parsers | Two-apellido + particles + review | — |

**Net:** Domain content is **above average** for Latam DE juniors; **delivery polish** is below S05 internal gold.

### 5.7 Accessibility & motivation

- Motivation (fraude/parentesco risk) is strong but dense.  
- Synthetic data policy is excellent and repeated enough.  
- Risk: fear-based compliance language every third paragraph may fatigue; keep one sharp danger callout (already have “Sin claims de identidad”).

---

## 6. Proposed GitHub-style Diffs

> Diffs are **proposals only** — do not apply in Explorer. Paths relative to repo root. Unified diff against current `s07-data-acquisition.ts` intent.

### Diff A — jobRelevance: remove id leak; split motivation (Issues 02, 18)

```diff
--- a/src/lib/course/sections/s07-data-acquisition.ts
+++ b/src/lib/course/sections/s07-data-acquisition.ts
@@
-  jobRelevance:
-    "Los datasets de clientes en Latam rompen normalizadores pensados para ASCII/US: tildes, ñ, dos apellidos y partículas. Si tu matching afirma identidad, parentesco o fraude por un score, creas riesgo de producto y cumplimiento: un score es **evidencia para revisión**, nunca prueba automática. Esta sección (id `data-acquisition` conservado) enseña Unicode, str antes que regex, y evidencia sin overvalidation — tramo central de **CP-N1-B**.",
+  jobRelevance:
+    "Los datasets de clientes en Latam rompen normalizadores pensados para ASCII/US: tildes, ñ, dos apellidos y partículas. Si tu matching afirma identidad, parentesco o fraude por un score, creas riesgo de producto y cumplimiento: un score es **evidencia para revisión**, nunca prueba automática. Aquí dominas Unicode, métodos `str` antes que regex, y normalización con evidencia — tramo central de **CP-N1-B**.",
```

### Diff B — theory map: student-facing opening without V3 archaeology (Issues 01, M2–M4, M10)

```diff
--- a/src/lib/course/sections/s07-data-acquisition.ts
+++ b/src/lib/course/sections/s07-data-acquisition.ts
@@
     {
-      heading: "De “Adquisición multi-fuente” a texto Unicode y regex (mapa)",
+      heading: "Mapa de la sección: texto latinoamericano y matching con evidencia",
       paragraphs: [
-        "En V3, **S07 no es el path principal de scraping, SQL ni APIs**. Esos temas se reubican. Aquí el estudiante domina **texto latinoamericano**: normalización Unicode, nombres con dos apellidos, métodos `str` antes de regex, y matching con evidencia **sin afirmar parentesco**.",
-        "El incremento CP-N1-B es un **normalizador de registro** que conserva `raw`, produce `normalized` y lista `transforms`. Datos sintéticos peruanos/latam; sin PII real. Fail-closed si el schema no cuadra; no rellenes en silencio.",
-        "Orden: **T1 Unicode** → **T2 str ops y contacto** → **T3 regex** → **T4 similitud y FP/FN**. Caso sintético Perú: nombres sintéticos José/Quispe, emails/teléfonos ficticios, Lima/Arequipa. Nunca PII real ni inferencia automática de parentesco/fraude.",
+        "En esta sección dominas **texto latinoamericano**: normalización Unicode, nombres con dos apellidos, métodos `str` antes que regex, y matching con evidencia **sin afirmar parentesco**. Scraping, SQL y APIs públicas se abordan más adelante (p. ej. archivos/ETL en S08 y servicios en S12).",
+        "El incremento **CP-N1-B** es un **normalizador de registro** que conserva `raw`, produce `normalized` y lista `transforms`. Solo datos sintéticos peruanos/latam; sin PII real. Si el schema no cuadra o falta evidencia, **no completes campos en silencio** (fail-closed).",
+        "Orden: **T1 Unicode** → **T2 str y contacto** → **T3 regex** → **T4 similitud y FP/FN**. Casos sintéticos: José/Quispe, emails/teléfonos ficticios, Lima/Arequipa.",
       ],
       callout: {
         type: "info",
-        title: "Contenido reubicado",
+        title: "Alcance de S07",
         content:
-          "Scraping/API/SQL del legado de esta sección **no son el camino V3 en S07**. Target: normalización latinoamericana. APIs reaparecen más adelante en el roadmap.",
+          "El foco es normalización de texto latam y evidencia de matching. No implementes scraping, clientes HTTP ni SQL aquí; esos caminos llegan en secciones posteriores.",
       },
     },
```

### Diff C — dedupe theory filler (Issue 06)

```diff
--- a/src/lib/course/sections/s07-data-acquisition.ts
+++ b/src/lib/course/sections/s07-data-acquisition.ts
@@ T1-B
-        "En Perú y Latam es común **nombre(s) + apellido1 + apellido2**. No fuerces el formato US (first/last único). Conserva el **raw** siempre. En texto y similaridad, el *porqué* es operativo: reduce ambigüedad en pipelines locales, deja rastro auditable y alimenta normalización NFC + evidencia textual (CP-N1-A/B) sin inventar hechos sobre personas reales.",
+        "En Perú y Latam es común **nombre(s) + apellido1 + apellido2**. No fuerces el formato US (first/last único). Conserva el **raw** siempre: es tu única fuente si la heurística se equivoca.",
@@ T4-A
-        "Matching de texto en intake: primero **igualdad normalizada** (NFC + casefold + collapse). Si no, **similitud por tokens** (Jaccard) como señal débil. En texto y similaridad, el *porqué* es operativo: reduce ambigüedad en pipelines locales, deja rastro auditable y alimenta normalización NFC + evidencia textual (CP-N1-A/B) sin inventar hechos sobre personas reales.",
+        "Matching de texto en intake: primero **igualdad normalizada** (NFC + casefold + collapse). Si no alcanza, **similitud por tokens** (Jaccard) como señal débil para revisión humana.",
@@ T4-B
-        "**FP** (false positive): el sistema dice match y no debería. **FN**: debería matchear y no lo hizo. En nombres latam, tildes y partículas mueven ambos. En texto y similaridad, el *porqué* es operativo: reduce ambigüedad en pipelines locales, deja rastro auditable y alimenta normalización NFC + evidencia textual (CP-N1-A/B) sin inventar hechos sobre personas reales.",
+        "**FP** (false positive): el sistema dice match y no debería. **FN**: debería matchear y no lo hizo. En nombres latam, tildes y partículas mueven ambos lados de la matriz.",
```

### Diff D — typo extración (Issue 07)

```diff
-        "`re.compile` reutiliza el patrón en loops (claridad + micro-ahorro). `findall` / `finditer` extraen múltiples matches de un log sintético — útil en demos de extración, no en overvalidation de email.",
+        "`re.compile` reutiliza el patrón en loops (claridad + micro-ahorro). `findall` / `finditer` extraen múltiples matches de un log sintético — útil en demos de extracción, no en overvalidation de email.",
```

### Diff E — feedback grammar (Issue 08)

```diff
-        feedback: "Política modestas de dígitos > regex de formato rígido.",
+        feedback: "Una política modesta de dígitos supera a una regex de formato rígido.",
```

### Diff F — casefold exercise honesty (Issue 09)

```diff
--- starter S07-T1-A-E2
-# DEFECT: compara lower (falla con Ñ/ñ en algunos locales)
-a, b = 'MAÑANA', 'mañana'
-match = a.lower() == b.lower()
+# DEFECT: usa lower por hábito; política del curso = casefold para matching
+a, b = 'MAÑANA', 'mañana'
+match = a.lower() == b.lower()  # funciona aquí; preferimos casefold por contrato
@@ instruction hint
-          "lower también funciona en este caso; prefiere casefold en matching.",
+          "Para este par, lower también da True; escribe casefold porque es la política de matching del normalizador.",
```

Optional stronger demo (Fixer choice): use a German ß pair *or* keep Spanish and frame casefold as **policy**, not as “lower is broken for ñ”.

### Diff G — Jaccard / exact path includes NFC (Issue 10)

```diff
 def tokens(s: str) -> set[str]:
-    return set(s.casefold().split())
+    import unicodedata
+    s = unicodedata.normalize("NFC", s)
+    return set(s.casefold().split())

 def norm(s):
-    return ' '.join(s.split()).casefold()
+    import unicodedata
+    return ' '.join(unicodedata.normalize("NFC", s).split()).casefold()
```

Apply analogously to I Do T4-A and We Do T4-A-E1/E2 solutions.

### Diff H — rewrite We Do instructions to S05 gold style (Issues 04, 05, 15, 21)

Pattern for **all** templated exercises (example T1-A-E1):

```diff
-        instruction:
-          "E1 (guiado) — Concepto: S07-T1-A (Texto, Unicode y regex). Entrada: fixture sintético del starter (`CASO`/ids C00x) en texto y similaridad. Tarea: Normaliza a NFC la lista `['José', 'Jose\\u0301', '']` e imprime cada resultado. El vacío permanece vacío. Salida/pass: `'José' | 'José' | ''`. Conserva el contrato del starter (no borres asserts ni datos); no pandas, no APIs de S08+; solo stdlib str/unicodedata/re (S01–S07).",
+        instruction:
+          "E1 (guiado) — Normaliza a NFC la lista `['José', 'Jose\\u0301', '']` e imprime cada resultado con `repr`. El vacío permanece vacío. Salida esperada: tres líneas `'José'`, `'José'`, `''`.",
```

Further truncated ones — full replacements:

```diff
# S07-T1-B-E3
-          "E3 (transferencia) — Concepto: S07-T1-B … no pandas, no APIs de.",
+          "E3 (transferencia) — Si hay menos de 3 tokens, `status='review'` y no inventes apellido2. Prueba `'Madonna'` y `'Luis Quispe Huamán'`. Imprime el dict de cada caso.",

# S07-T3-A-E3
+          "E3 (transferencia) — Contrasta `search` vs `fullmatch` del patrón `\\d{8}` sobre `'DNI 12345678'`. Imprime ambos booleanos y una línea: cuándo usarías cada uno.",

# S07-T4-A-E3
+          "E3 (transferencia) — Si score ∈ [0.4, 1.0) → `review`; si 1.0 → `exact`; si <0.4 → `no_match`. Con score 0.67 imprime: `review Juan Perez Juan P Perez 0.67`.",

# S07-T4-B-E2
+          "E2 (independiente) — Empaqueta evidencia `dict(raw_a, raw_b, score, decision, reason)` para el par Juan Perez / Juan P Perez (score 0.67, decision review) e imprímelo.",

# S07-T4-B-E3
+          "E3 (transferencia) — En 2–3 `print`, explica por qué el pipeline no afirma parentesco ni identidad legal a partir de Jaccard.",
```

Also replace “strippeados” → “sin espacios laterales” in T2-A-E1.

### Diff I — You Do requirements & rubric (Issues 03, 14)

```diff
-      "Sin scraping/API en este incremento V3",
+      "Sin scraping, HTTP ni SQL en este proyecto",
@@ rubric
-      { criterion: "Regex responsable", weight: "15%" },
-      { criterion: "Sin overvalidation", weight: "15%" },
+      { criterion: "Email/tel con validación modesta (sin overvalidation)", weight: "20%" },
+      { criterion: "Regex solo si aporta (opcional y justificada)", weight: "10%" },
```

### Diff J — expand selfCheck (Issue 12) — additive sketch

```diff
+      {
+        question: "¿Qué hace `re.fullmatch(r'\\d{8}', 'DNI 12345678')` frente a `search`?",
+        options: [
+          "Ambos fallan",
+          "fullmatch no coincide; search sí encuentra los 8 dígitos",
+          "fullmatch coincide; search no",
+          "Lanza excepción",
+        ],
+        correctIndex: 1,
+        explanation: "fullmatch exige que toda la cadena cumpla el patrón; search busca un subtring.",
+      },
+      {
+        question: "Política modesta de email en este curso exige…",
+        options: [
+          "Regex que solo acepte .com",
+          "Exactamente un @, local y dominio no vacíos, sin espacios",
+          "Verificar que el buzón exista por SMTP",
+          "Rechazar plus addressing",
+        ],
+        correctIndex: 1,
+        explanation: "Validación estructural mínima; plus addressing permitido; sin fingir entregabilidad.",
+      },
+      {
+        question: "Ante un patrón con cuantificadores anidados ambiguos, la postura del curso es…",
+        options: [
+          "Usarlo siempre por elegancia",
+          "Preferir patrones simples, str methods o timeouts; evitar catastrophic backtracking",
+          "Confiar en que Python optimiza todo",
+          "Solo importa en JavaScript",
+        ],
+        correctIndex: 1,
+        explanation: "Regex aburridas y límites claros son feature de producto.",
+      },
```

### Diff K — closing bridge callout after T4-B (Issues 13, 20)

```diff
+    {
+      heading: "Cierre y puente a S08",
+      paragraphs: [
+        "Ya puedes normalizar texto en memoria con contrato auditable. El siguiente cuello de botella real aparece al **leer y escribir archivos**: encodings (UTF-8 vs latin-1), CSV con comillas, JSON y cuarentena de filas rotas.",
+        "Lleva a S08 tu `normalize_record` mental: raw se conserva, transforms se documentan, y un decode incorrecto se trata como error visible — no como tildes “misteriosas”.",
+      ],
+      callout: {
+        type: "tip",
+        title: "Siguiente sección",
+        content: "S08 · Archivos & ETL: pathlib, CSV/JSON, manifest de ingesta. El módulo `csv` reemplaza el split ingenuo de esta sección.",
+      },
+    },
```

### Diff L — optional `\w` caveat in T3-A-E2 feedback (Issue 11)

```diff
-        feedback: "Grupos nombran campos sin índices mágicos.",
+        feedback: "Grupos nombran campos sin índices mágicos. Para nombres latam con partículas, prefiere tokenización `str` (T1-B), no un solo `\\w+`.",
```

---

## 7. Recommended Priority Order for Fixing

| Priority | Issue IDs | Action | Effort |
| --- | --- | --- | --- |
| **1** | 05, 04 | Fix truncated instructions; strip harness boilerplate to S05 style across 24 We Do items | M–L |
| **2** | 01, 02, 03, Meta M1–M5, M10 | Remove V3/legado/id-conservado from all learner surfaces | S |
| **3** | 06 | Dedupe repeated “porqué operativo” / caso sintético spam; write subtopic-specific connective sentences | S |
| **4** | 09, 10 | Correct casefold narrative; compose NFC into matching helpers | S–M |
| **5** | 07, 08, 15 | Grammar/typos/anglicisms | S |
| **6** | 12, Diff J | Expand selfCheck to ≥8 items covering LOs | S |
| **7** | 13, 20, Diff K | Add S08/encoding bridge | S |
| **8** | 14, 11, 17, 18 | Rubric, `\w` caveat, load smoothing, jobRelevance split | S–M |
| **9** | 16, 19, 22 | Micro polish | S |

**Do not** rewrite the technical curriculum spine (Unicode → str → regex → Jaccard/ethics) unless Fixer finds factual errors beyond Issue 09/10.

---

## 8. Graph Memory Update notes

For shared curriculum-hardening context:

```yaml
section: S07
id: data-acquisition
title: Texto, Unicode y expresiones regulares
file: src/lib/course/sections/s07-data-acquisition.ts
score_1_to_10: 6.4
status: explorer_complete

nodes:
  strengths:
    - progressive_order: unicode → str → contact → regex → similarity/ethics
    - latam_name_model: two_apellidos + particles + review_if_short
    - anti_overvalidation: modest email; digits phone; no kinship claims
    - i_do_coverage: 8/8 subtopics with why
    - you_do_contract: raw + normalized + transforms (CP-N1-B)
    - resources: stdlib + RegexOne + CS50P aligned
  defects:
    - meta_leak_class: V3_legacy_relocation (theory map, callout, youDo)
    - meta_leak_class: platform_id_in_jobRelevance
    - meta_leak_class: weDo_harness_boilerplate (S07-T*, CASO, S01–S07 stack bans)
    - redaction: truncated_instructions (P0)
    - redaction: copy_paste_theory_filler (porqué operativo ×3)
    - tech_accuracy: lower_vs_casefold_ñ_false_claim
    - consistency: NFC_missing_in_jaccard_path
    - assessment: selfCheck_n5_under_samples_LOs
    - connective: weak_bridge_to_S08_encodings

edges:
  - from: S05
    to: S07
    type: cp_n1_b_continues
    note: S05 opens pure normalizer functions; S07 deepens Unicode/regex/evidence
  - from: S07
    to: S08
    type: should_bridge
    note: csv module, pathlib, encodings/mojibake foreshadow underbuilt
  - from: S07
    to: S05_weDo_style
    type: quality_regression
    note: S05 instructions task-first; S07 instructions template-first

fixer_hints:
  - preserve_technical_spine: true
  - rewrite_all_templated_weDo_instructions: true
  - delete_student_visible_V3_legacy: true
  - keep_synthetic_PE_fixtures: true
  - keep_ethics_no_parentesco: true
  - do_not_reintroduce_scraping_as_core_path: true
```

**Comparative gold bar:** Early sections (esp. S05 We Do) = short imperative instructions, no section-id prefixes, no “no borres asserts” essays. S07 should match that bar.

**External gold bar:** Prefer CodeSignal/Unicode-normalization lesson pattern (normalize before match) + Google Python Class regex minimalism + course-specific Latam ethics (already a differentiator—keep).

---

This is the complete Explorer report for Section 7. Ready for the Fixer prompt.
