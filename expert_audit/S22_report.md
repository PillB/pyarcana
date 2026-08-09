# PyArcana — Section 22 Audit Report
## "Email, identidad y aprobación humana" (CP-N2-C)
### Curriculum Auditor Report — S22

---

## 1. Section Identification & Scope

**Section number:** 22 (confirmed — 22nd row of `src/lib/course/index.ts` `COURSE_SECTIONS` array, in Phase 1 "Competente").

**Live site (verified):**
- URL: `https://pillb.github.io/pyarcana/#rapidfuzz-entity`
- H1 (rendered): "Email, identidad y aprobación humana"
- Short title (sidebar): "Email y aprobación"
- Tagline (sidebar): "Crea borradores en sandbox o archivos .eml; ningún correo real se envía automáticamente y todo destinatario requiere confirmación humana"
- Estimated hours: 19 · Level: Competente · Phase: 1

**Source file:** `/tmp/pyarcana_audit/src/lib/course/sections/s22-rapidfuzz-entity.ts` (1,915 lines, ~85 KB).

**Critical scope identity:** The file is named `s22-rapidfuzz-entity.ts` and the section `id` is `"rapidfuzz-entity"`, but the section is **NOT** about the RapidFuzz library nor about probabilistic entity resolution. It is about email MIME construction, OAuth scopes, draft adapters, recipient verification, privacy lists, an approval state machine, and idempotency keys. The section explicitly disclaims the original scope:

> *"El entity resolution probabilístico profundo llega más adelante en el roadmap; aquí el matching de contactos solo sirve para **entrega correcta**."* — theory[0].paragraphs[1], line 32.

The library `rapidfuzz` is never imported or used in any code block of S22. The single "matching" exercise (T3-A-E3) computes a hand-rolled prefix-overlap ratio, not a RapidFuzz score. The filename and URL hash are leftover artifacts of an earlier roadmap version (master roadmap `el_arte_de_python_roadmap_maestro_52_secciones.md:214` originally scheduled S22 as "FastAPI para Data Products" — the curriculum was subsequently rescoped).

**Tabs audited (all five):**
1. **Teoría** — 8 theory blocks (T1-A through T4-B) × (heading + 3 paragraphs + code/output + callout) = 8 code blocks, 8 callouts, 24 paragraphs.
2. **Yo hago** (I Do) — `intro` + 8 demos (S22-T1-A-DEMO through S22-T4-B-DEMO), each with code/output/why.
3. **Hacemos juntos** (We Do) — `intro` + 24 exercises (3 per subtopic × 8 subtopics; E1=guiado, E2=independiente, E3=transferencia), each with starterCode, hints, edgeCases, tests, feedback, solutionCode with output.
4. **Tú haces** (You Do) — capstone project "Borrador .eml con aprobación (inicio CP-N2-C)" with context, objectives, requirements, starterCode skeleton, portfolioNote, 6-criterion rubric.
5. **Autocheck** — 5 multiple-choice questions with explanations.

**Resources audited:** 9 docs (Python stdlib email/html/hashlib/logging/json, OWASP XSS, OAuth RFC 6749, Google OAuth scopes, RFC 5322, RFC 2045, OWASP Auth, NIST AI RMF, PyArcana live), 2 books, 6 external courses/links.

**Code/output integrity:** Verified by direct Python execution. **8/8 I Do demos, 6/6 spot-checked We Do solutions, 4/4 spot-checked theory code blocks, and 1/1 spot-checked idempotency key digest all produce the exact expected output.** Zero code/output drift — gold-standard (in contrast to S04/S06/S12 where multiple code↔output mismatches were found).

---

## 2. Executive Summary of Quality

**Composite score: 7.0 / 10** (would rise to ~8.5 after the P0/P1 fixes below).

**Key verdict:** Section 22 is a **pedagogically excellent** email/approval curriculum with **gold-standard code integrity** and a strong ethics spine ("matching ≠ fraude") that is reinforced uniformly across theory, I Do, We Do, You Do, and self-check. Its **single biggest problem is identity fraud at the URL level**: the live address `#rapidfuzz-entity` actively lies about the section's content, and the section itself disclaims the topic the URL advertises. Its **second biggest problem is a systemic markdown-rendering leak** (same as S06): the only callout in the section that uses `**bold**` renders as literal `**expone**` asterisks on the live Theory tab (verified by DOM inspection). Beyond those two P0s, the Spanish prose is largely clean Peruvian-Spanish tuteo with 4 real grammar defects (gender agreement on `la revisor`, missing periods on `vs`, plural sigla `URLs`, prefix-verb hyphenation `auto-aprueba`) plus a few medium cognitive-load issues (one 105-word glossary paragraph that should be a list; one 58-word run-on in the I Do intro; a 175-word `jobRelevance`). Internal taxonomy tags `CASO-LIM-022` (53×) and `S22-T1-A…S22-T4-B` (72×) leak into learner-facing prose — same pattern observed in S08/S10/S11.

**Score breakdown:**
| Dimension | Score | Notes |
|---|---|---|
| Pedagogical structure (I Do / We Do / You Do / Autocheck fidelity) | 9/10 | Exemplary 8-subtopic × 4-activity lattice, deliberate DEFECT in every starter |
| Code/output integrity | 10/10 | All spot-checked demos/exercises/theory blocks produce exact expected output |
| Ethics spine (matching ≠ fraude; fail-closed; least privilege; HITL) | 9/10 | Reinforced uniformly; one minor gap (Q5 is great) |
| Spanish grammar & redaction (Peruvian tuteo) | 7/10 | 4 real LT findings; 4 run-ons + 9 long sentences |
| Cognitive load / progressive disclosure | 7/10 | Glossary paragraph + iDo intro run-on push limits |
| Connective tissue (S21 → S22 → S23) | 9/10 | Explicit forward/backward references throughout |
| Meta-leak posture | 4/10 | URL hash mismatch (P0) + markdown leak (P0) + taxonomy leak (P2) |
| Consistency with roadmap | 5/10 | Filename/ID/URL all stale from prior scope plan |
| Comparison with best-in-class external materials | 8/10 | Aligns with OWASP XSS Cheat Sheet, RFC 5322/2045, Gmail API drafts, NIST AI RMF HITL |

---

## 3. Detailed Issue Registry

Each issue has: **ID · Severity · Location · Evidence · Pedagogical impact**.

### P0 — Critical (blocks learning or actively misleads)

#### I-01 — Filename / section-id / URL-hash scope drift (P0)
- **Location:** `s22-rapidfuzz-entity.ts:4` (`id: "rapidfuzz-entity"`); filename `s22-rapidfuzz-entity.ts`; live URL `https://pillb.github.io/pyarcana/#rapidfuzz-entity`.
- **Evidence:** Live H1 reads "Email, identidad y aprobación humana" but URL hash reads `rapidfuzz-entity`. The library `rapidfuzz` is never imported in any code block. The section explicitly disclaims entity resolution: *"El entity resolution probabilístico profundo llega más adelante en el roadmap; aquí el matching de contactos solo sirve para **entrega correcta**"* (line 32).
- **Pedagogical impact:** A learner who bookmarks, shares, or searches the URL sees "rapidfuzz-entity" and is misled into expecting a tutorial on fuzzy string matching. When the section instead teaches MIME/OAuth/drafts/approval, the learner's mental model is fractured at the very first impression. The dissonance is amplified because the section text itself flags that the promised topic is "más adelante en el roadmap" — making the URL feel like a bait-and-switch. Same systemic pattern as S05 (`id:"oop"`), S06 (`id:"numpy"`), S07 (`id:"data-acquisition"`), S08 (`id:"pandas"`), S10 (`id:"sklearn"`), S11 (`id:"testing"`), S12 (`id:"performance"`); S21 (`id:"fastapi"`) and S23 (`id:"computer-vision"`) form a 3-section chain of mismatched hashes around S22.
- **Root cause:** The master roadmap `el_arte_de_python_roadmap_maestro_52_secciones.md:214` originally scheduled S22 as "FastAPI para Data Products". A later rescoping pass reassigned FastAPI to S21 (`s21-fastapi.ts`), inserted Email/approval as S22, and apparently planned a "RapidFuzz entity resolution" section that was either dropped or moved further down — leaving the `rapidfuzz-entity` slug embedded in the file name, the `id` field, and the URL hash.

#### I-02 — `**bold**` markdown leaks as literal asterisks via raw JSX (P0, systemic)
- **Location:** Live Theory tab, T3-B callout content (source `s22-rapidfuzz-entity.ts:328-329`); root cause in `src/components/course/SectionView.tsx:401` (`{block.callout.content}` rendered raw, no `<RichText>` wrapper). Same root cause also affects `SectionView.tsx:189` (`section.jobRelevance`), `:491` (`step.instruction`), `:571` (`step.feedback`), `:614` (`project.context`).
- **Evidence (live DOM):** After navigating to `#rapidfuzz-entity` → Teoría tab, the T3-B callout renders as:
  > `Un CC masivo **expone** a todos entre sí (en jerga de operaciones: "filtra" = filtra información). Usa BCC o tickets internos cuando haya externos.`
  
  The `**expone**` is rendered as literal asterisks in the browser (confirmed via `document.querySelectorAll('*').filter(el => el.children.length===0 && /\*\*/.test(el.textContent))` returning 1 hit: `<div class="text-sm text-foreground/90 …">Un CC masivo **expone** a todos…`).
- **Pedagogical impact:** Learner sees raw markdown syntax (`**`) instead of bold text. Breaks visual hierarchy, makes the callout read like a code snippet, and undermines the professional tone. Although only **one callout** in S22 actually uses `**bold**` (T3-B), the same systemic bug also surfaces in the We Do tab (`step.instruction` uses `**16**`, `**mismo**`, `**status de workflow**`, `**host real**`, `**siempre**`, `**misma**` in 8+ exercises) and in the You Do tab (`project.context` uses `**mini pipeline de notificación**`). The Theory tab callouts are otherwise clean because only T3-B uses bold, but the We Do and You Do tabs are heavily affected. The bug was first identified in S06; it is systemic across the course.
- **Root cause:** `<Callout>` component (`src/components/course/Callout.tsx:75`) renders `{children}` as raw JSX. `SectionView.tsx:401` passes `block.callout.content` as a plain string child. React renders the string verbatim, including `**` characters. The fix is either (a) wrap the callout content in `<RichText>` before passing it as `children`, or (b) change `<Callout>` to accept a `content` prop and internally route through `<RichText>`.

### P1 — High (real grammar/orthography defects)

#### I-03 — `la revisor` gender-agreement error (4 occurrences)
- **Location:** 
  - Line 103: `"…ayuda a la revisor a auditar el .eml sin abrir un portal."`
  - Line 112: `"…la revisor humana debe ver HTML seguro, no un vector de ataque."`
  - Line 338: `"…la revisor `rev1` hace `approve` y el log registra…"`
  - (LanguageTool detected a 4th instance in the `youDo.context` flow; visually confirmed.)
- **Evidence:** `la` (feminine singular article) + `revisor` (masculine noun). The section uses `revisor` as masculine in 8 other places (`un revisor de turno`, `revisor humano de turno`, `un revisor de la mesa`, `el revisor de la mesa`, `el revisor ve mojibake`, `un revisor humano pueda inspeccionar`). The synthetic email address `revisora@example.pe` (line 33) establishes a feminine reviewer.
- **Pedagogical impact:** Peruvian-Spanish learners read a gender-agreement error in 4 of 12 mentions of the reviewer role. The error is jarring because the same section oscillates between treating "revisor" as masculine (8×) and as feminine (4×). LanguageTool flags it as `AGREEMENT_DET_NOUN`.
- **Recommended fix:** Pick one gender and apply consistently. Two viable paths:
  - **(a) Feminize** (recommended — aligns with `revisora@example.pe`): replace all `el revisor` / `un revisor` / `revisor humano` with `la revisora` / `una revisora` / `revisora humana`. 12 edits.
  - **(b) Masculinize** (cheaper — 4 edits): change `la revisor` → `el revisor` at lines 103, 112, 338, plus the 4th instance. Use `revisor` consistently. But then `revisora@example.pe` reads as a name mismatch.

#### I-04 — `vs` without period (3 occurrences)
- **Location:**
  - Line 153: `"scopes pedidos vs concedidos en el mismo paquete de evidencia del run."`
  - Line 232: `"el adaptador decide Gmail API vs archivo .eml local."`
  - Line 1886: `"drafts reales vs sandbox; no envío automático"`
- **Evidence:** Spanish abbreviation `vs.` requires a trailing period (RAE: *vs.* or *versus*). LanguageTool flags as `PUNTO_EN_ABREVIATURAS`.
- **Pedagogical impact:** Minor punctuation defect, but accumulates — same defect noted in S08 (4×) and S12 (3×).
- **Fix:** `vs` → `vs.` (3 edits). Alternative: write `frente a` or `versus` (unabbreviated).

#### I-05 — `URLs` plural sigla (1 occurrence)
- **Location:** Line 884: `"E3 (transferencia) — Clasifica dos URLs con allowlist de **host real**…"`
- **Evidence:** Spanish RAE rule: acronyms are invariable for number — `las URL`, `las API`, `los OCR`. Pluralizing with `s` is an English calque. LanguageTool flags as `SIGLAS`.
- **Pedagogical impact:** Same defect class as S11 (`APIs`), S12 (`APIs`).
- **Fix:** `URLs` → `URL`. (Same defect: `APIs` would be `API` elsewhere — none currently in S22.)

#### I-06 — `auto-aprueba` should be `autoaprueba` (prefix + verb)
- **Location:** Line 337: `"…vuelve a `needs_edit` con nota — no se auto-aprueba por timeout."`
- **Evidence:** RAE rule: when a prefix (`auto-`, `ex-`, `anti-`, `pro-`, `co-`, `sub-`, etc.) attaches to a verb, the result is written as a single word: `autoaprueba`, `coautor`, `exministro`, `anteproyecto`. LanguageTool flags as `AUTO_NO_SEPARADO`.
- **Pedagogical impact:** Same defect class as S12 (`auto-etiqueta` → `autoetiqueta`).
- **Fix:** `auto-aprueba` → `autoaprueba`.

#### I-07 — Missing comma before `pero` (1 occurrence)
- **Location:** Line 1311: `"E2 (independiente) — Fuerza `role='bcc'` cuando el email es externo (`@other.test`) (CASO-LIM-022). El starter detecta el dominio pero no muta el role."`
- **Evidence:** Spanish rule: comma before `pero` when joining two clauses (especially with different subjects or contrastive semantics). LanguageTool flags as `COMMA_PERO`.
- **Pedagogical impact:** Minor; reduces reading fluency.
- **Fix:** `el dominio pero no muta` → `el dominio, pero no muta`.

#### I-08 — `similaridad` → `similitud` (RAE preference, 2 occurrences)
- **Location:**
  - Line 240: `"si usas un score de similaridad de nombres o emails…"`
  - Line 1816: `"Un score de similaridad 0.92 entre dos nombres de contactos sintéticos…"`
- **Evidence:** Both `similaridad` and `similitud` are valid Spanish words (RAE registers both), but `similitud` is far more common in technical and academic Spanish. LanguageTool flags as `ES_SIMPLE_REPLACE_SIMPLE_SIMILARIDAD` suggesting `similitud`.
- **Pedagogical impact:** Stylistic; aligns S22 with standard Spanish technical writing.
- **Fix:** `similaridad` → `similitud` (2 edits).

#### I-09 — `appendea` (Anglicism, 1 occurrence)
- **Location:** Line 1619: `"El starter solo appendea `create`."`
- **Evidence:** `appendea` is an Anglicized verb from English "append". The RAE-preferred Spanish verb is `agrega` or `añade`. LanguageTool would flag if it had the word in its lexicon.
- **Pedagogical impact:** Inconsistent with the section's otherwise clean Spanish; stands out against `agrega`, `añade`, `adjunta` used elsewhere in S22.
- **Fix:** `appendea` → `agrega` (or `añade`).

#### I-10 — `compliance` (Anglicism, 1 occurrence)
- **Location:** Line 294: `"Esto es **privacidad operativa** del día a día, no un checklist de compliance que se tacha y se olvida."`
- **Evidence:** `compliance` is an English word used untranslated. RAE-acceptable Spanish: `cumplimiento`. `checklist` is also English (`lista de verificación` or `lista de chequeo`).
- **Pedagogical impact:** The sentence makes a meaningful contrast between operational privacy and compliance-checklist thinking; the Anglicisms undercut the rhetorical force for a Spanish-PE reader.
- **Fix:** `checklist de compliance` → `lista de verificación de cumplimiento` (or, more punchy: `checklist de cumplimiento` — keep one Anglicism, gloss the other).

### P2 — Medium (cognitive load, taxonomy leak, structural issues)

#### I-11 — `CASO-LIM-022` internal taxonomy tag leaks into learner-facing prose (53 total occurrences, ~30 in learner-facing prose)
- **Location:** Throughout theory paragraphs, callouts, code, We Do exercise starter-code comments, We Do instructions. Examples:
  - Line 33: `"Caso de laboratorio `CASO-LIM-022`: contactos fake `@example.pe`…"`
  - Line 41 (theory code): `"case": "CASO-LIM-022"`
  - Line 68: `"Caso sintético CASO-LIM-022: `MIMEText('Hola','plain','utf-8')`…"`
  - Line 680 (We Do intro): `"Cada starter de CASO-LIM-022 trae un error deliberado…"`
  - Lines 700, 740, 785, 828, 862, 897, 936, 971, 1006, 1043, 1081, 1118, 1173, 1211, 1246, 1291, 1324, 1363, 1406, 1443, 1486, 1548, 1584, 1631 (every We Do starter code): `"# CASO-LIM-022 · …"`
- **Evidence:** `CASO-LIM-022` is an internal taxonomy identifier for the synthetic lab case. The learner gains nothing from seeing the literal code `CASO-LIM-022` — calling it `Caso 22` or `caso sintético` would convey the same information without the bureaucratic numbering.
- **Pedagogical impact:** Adds visual noise to ~30 learner-facing strings; makes the prose feel like an internal curriculum spec rather than a teaching narrative. Same pattern observed in S08 (`CASO-LIM-008`, 22×), S10 (`CASO-LIM-010`, 31×).
- **Fix (low-effort):** Global find/replace `CASO-LIM-022` → `Caso 22` (or just `caso sintético`). Coordinate with S08/S10/S11/S12 fixers for consistency.

#### I-12 — `S22-T1-A` through `S22-T4-B` subtopic IDs visible in learner-facing prose (72 occurrences)
- **Location:** `subtopicId` fields (technical, not rendered) AND in We Do starter-code comments like `# CASO-LIM-022 · MIMEText plain utf-8` (already counted above) AND in the iDo.intro (line 431) where the learner is told `"por qué draft y no send; por qué parsear el host y no un substring; por qué denegar `mail.full`…"`. The `subtopicId` strings themselves (`"S22-T1-A"`, `"S22-T2-B"`, etc.) are technical IDs not shown to learners, BUT they appear in the source as a navigation breadcrumb and any tooling that surfaces them would expose them.
- **Evidence:** The codes follow a pattern `S{section}-T{theory-block}-{letter}` (e.g., `S22-T1-A` = Section 22, Theory block 1, subtopic A). This is internal curriculum scaffolding.
- **Pedagogical impact:** If learners ever see these IDs (via source view, dev tools, or future UI features), they signal a course-authoring template rather than a learning experience. Same pattern noted in S10 (24×) and S11.
- **Fix:** Not strictly a learner-facing leak today; keep as tracking metadata. Document as a known pattern for the orchestrator.

#### I-13 — `CP-N2-C` capstone acronym used 18× without ever being spelled out
- **Location:** 18 occurrences in `jobRelevance`, theory intros, iDo.intro, weDo.intro, youDo.title, youDo.context, youDo.objectives, youDo.portfolioNote, self-check questions. Examples:
  - Line 16: `"S22 inicia **CP-N2-C** a partir del paquete de informe de S21…"`
  - Line 32: `"Aquí **inicias CP-N2-C**: el canal de **notificación con aprobación humana**…"`
  - Line 1670: `"Borrador .eml con aprobación (inicio CP-N2-C)"`
- **Evidence:** `CP-N2-C` is never expanded. Inferred meaning: "Capstone Project — Nivel 2 — Correo" (or "Canal C"). Compare with `CP-N1-A` (Client Intake, S01–S04), `CP-N1-B` (Familiarity Normalizers, S05–S07), `CP-N1-C` (Evidence Dashboard, S13) used in earlier sections.
- **Pedagogical impact:** A learner joining at S22 (or returning after a break) sees `CP-N2-C` 18 times without a gloss. The dictionary paragraph (line 31) lists 10 terms but omits `CP-N2-C`. The learning outcomes (line 17-26) don't mention it. The portfolioNote assumes the learner knows what capstone they're starting.
- **Fix:** Add `CP-N2-C` to the T1 dictionary (line 31) as: `**CP-N2-C:** Capstone de Nivel 2, Canal C — notificación con aprobación humana. Inicia en S22 y se conecta al canal web en S23.` Or include a one-line parenthetical at first use in `jobRelevance`.

#### I-14 — `jobRelevance` is 175 words across 5 sentences, including a 48-word run-on
- **Location:** Lines 15-16 (single string field).
- **Evidence:** The 5 sentences are: (1) 48-word run-on ending "scopes de más."; (2) 23 words; (3) 26 words; (4) 13 words; (5) 32 words. Sentence 1 has 4 commas, an em-dash, a colon, and a complex parenthetical. FH for sentence 1 alone is ~30 ("difícil").
- **Pedagogical impact:** `jobRelevance` is the first prose the learner reads when opening a section (shown in the "Por qué importa este rol" panel). A 48-word run-on opener creates immediate cognitive overload before the learner has any context.
- **Fix:** Split sentence 1 into 3 sentences at the natural breaks (after "es **enviarlo mal**" and after "duplica el mensaje"). See §6.1 below for the before/after rewrite.

#### I-15 — `iDo.intro` is 91 words across 2 sentences, including a 58-word run-on
- **Location:** Line 431.
- **Evidence:** Sentence 1 is 33 words. Sentence 2 is 58 words and lists 6 "por qué" clauses separated by semicolons, with embedded `mail.full`, `BCC`, `16 hex` jargon. FH for sentence 2 is ~25 ("muy difícil").
- **Pedagogical impact:** The I Do intro is the prologue to 8 demos. A 58-word run-on listing 6 design decisions back-to-back overloads working memory before any demo has run.
- **Fix:** Convert the 6-clause list into a markdown bulleted list. See §6.2 below.

#### I-16 — Theory T1 paragraphs[0] is a 105-word "Diccionario de la sección" glossary
- **Location:** Line 31 (theory[0].paragraphs[0]).
- **Evidence:** Single paragraph containing 10 bolded term definitions separated by periods. The sentence-splitter fails because there are no terminal periods between definitions (the only periods are inside code or at the very end). FH for the whole string is -27.1 ("muy difícil") — the worst score in the section.
- **Pedagogical impact:** A glossary presented as a wall of bold text is hard to scan; learners cannot easily find a specific term. The dictionary explicitly says "léelo antes de T1; cada término se desempaca en T1–T4" — implying it should be a reference, not prose.
- **Fix:** Convert to a markdown definition list or bulleted list. See §6.3 below.

#### I-17 — Theory T3-A paragraphs[1] is a 48-word run-on sentence about score ethics
- **Location:** Line 240.
- **Evidence:** `"Contrato ético y técnico: si usas un score de similaridad de nombres o emails, **siempre** acompáñalo de la nota **`match_no_es_fraude`**. En el ejercicio de transferencia calculas un prefijo común que da **0.86**; el self-check usa **0.92** solo como número de un MCQ ético — en ambos casos un score "alto" **no** autoriza claims de identidad legal, parentesco ni colusión; solo prioriza la revisión de **entrega correcta**. Matching de contactos ≠ investigación de fraude."`
  
  Sentence 2 is 48 words with a colon, a semicolon, an em-dash, a quoted "alto", bold markup, and a code identifier.
- **Pedagogical impact:** This is the **ethics spine** of the section — the sentence that prevents learners from using fuzzy-match scores as fraud evidence. Burying it in a 48-word run-on dilutes its force.
- **Fix:** Split into 3 sentences. See §6.4 below.

#### I-18 — Theory T1-B paragraphs[0] has a 47-word run-on with code identifiers
- **Location:** Line 110.
- **Evidence:** `"La política de links usa allowlist de **hosts reales** (`example.pe` o subdominios propios) o rutas relativas; se bloquean esquemas `javascript:` y `data:`. **Nunca** uses substring (`'example.pe' in url`): un host `example.pe.evil.test` lo burlaría y el curso no enseña ese bypass como solución."`
  
  Sentence 2 is 47 words with embedded code, a colon, and a quoted string.
- **Pedagogical impact:** The XSS-prevention rule is critical; the long sentence muddles it.
- **Fix:** Split at the colon.

#### I-19 — Several We Do instructions are 36–37 words (at cognitive-load limit)
- **Location:**
  - Line 1031 (T2-B-E1): 36 words
  - Line 1536 (T4-B-E1): 37 words
- **Evidence:** Both instructions pack the task description, the starter's defect, the contract, and the expected output into one sentence each.
- **Pedagogical impact:** At the soft ceiling of 32 words for technical Spanish; learners may need to re-read.
- **Fix:** Split at "Salida esperada" — that's already a newline in the source, so the splitter may already handle it. Confirm the rendered UI breaks the line.

### P3 — Low (style nits, anglicisms, false positives worth noting)

#### I-20 — `Designing Data-Intensive Applications (Kleppmann) — select` (odd suffix)
- **Location:** Line 1878 (resources.books[1].label).
- **Evidence:** The `— select` suffix is unexplained. Probably means "selected chapters" but reads as a typo.
- **Fix:** `— select` → `— capítulos selectos` or remove.

#### I-21 — `spamear` (Anglicism, 3 occurrences)
- **Location:** Lines 33, 383, 675.
- **Evidence:** From English "spam". RAE-acceptable Spanish alternatives: `enviar spam`, `inundar con correos`, `acaparar la bandeja`. `Spamear` is well-established in IT Spanish and widely understood.
- **Fix (optional):** Replace with `inundar con correos` if a more formal register is desired; otherwise leave as accepted IT jargon.

#### I-22 — `y HITL` (borderline y → e rule)
- **Location:** Line 1817 (self-check Q5, option B): `"…con nota match≠fraude y HITL si aplica"`.
- **Evidence:** LanguageTool flags `Y_E_O_U`. The Spanish rule: `y` → `e` before words starting with `i` sound (or `hi`). `HITL` is an acronym pronounced either "hache-i-te-ele" (Spanish — starts with `h` sound, no change) or "aitch-i-t-l" (English — starts with `i` sound, would need `e HITL`). The intended Spanish pronunciation is the former; the rule does not apply.
- **Fix:** No change needed. (Note for orchestrator: HITL is never spelled out in S22; consider adding to the T1 dictionary: `**HITL:** Human-In-The-Loop, aprobación humana obligatoria.`)

#### I-23 — `checklist` (Anglicism, 1 occurrence — same sentence as I-10)
- **Location:** Line 294.
- **Evidence:** Already covered under I-10.

#### I-24 — Inconsistent heading style: 5 of 8 theory headings mix English + Spanish
- **Location:**
  - Line 63 (T1-A): `"MIME, encoding, HTML/text y attachments"` — English "encoding", "attachments"
  - Line 107 (T1-B): `"Templates y sanitización de HTML"` — English "Templates"
  - Line 148 (T2-A): `"OAuth, service account y scopes"` — all English
  - Line 187 (T2-B): `"Drafts, expiración y adaptadores"` — English "Drafts"
  - Line 379 (T4-B): `"Idempotencia, audit log y reintento sin duplicar"` — English "audit log"
- **Evidence:** The other 3 headings are pure Spanish: T3-A, T3-B, T4-A.
- **Pedagogical impact:** Acceptable for technical vocabulary (these terms are imported unaltered from RFCs and industry usage). The T1 dictionary (line 31) defines them in Spanish. Not a defect, but the inconsistency between adjacent headings ("Resolución y verificación de destinatarios" → "Listas, CC/BCC, privacidad y mínima divulgación" → "Cola de aprobación y máquina de estados" all-Spanish, vs. T1-A/T1-B/T2-A/T2-B/T4-B mixed) is a minor stylistic wobble.
- **Fix (optional):** Standardize on Spanish-primary headings with English term in parentheses on first use: `"MIME, codificación y adjuntos"`.

#### I-25 — Tagline FH = 42.2 ("difícil") for a 19-word sidebar blurb
- **Location:** Line 9.
- **Evidence:** `"Crea borradores en sandbox o archivos .eml; ningún correo real se envía automáticamente y todo destinatario requiere confirmación humana"` — 19 words, 2 clauses joined by semicolon, 1 passive voice. The sidebar shows this as the first impression.
- **Pedagogical impact:** Slightly dense for a teaser. Could be split.
- **Fix (optional):** Split into 2 sentences: `"Crea borradores en sandbox o archivos .eml. Ningún correo real se envía automáticamente; todo destinatario requiere confirmación humana."`

#### I-26 — LanguageTool false-positive summary (informational, no fix needed)
- 19 `ESPACIO_DESPUES_DE_PUNTO` matches — all false positives where LT sees periods inside code identifiers like `mail.full`, `pending_review.`, `mail.draft.`.
- 11 `WRONG_IMPERATIVE` matches — false positives caused by capitalized words appearing mid-sentence after periods inside code identifiers.
- 7 `VOSEO` matches — **all** false positives on the English word `create` inside backticks (`'create'`, `audit create`, `['create','retry_hit',…]`). LT interprets `create` as the vos imperative of `crear`. S22 is uniformly tuteo (verified by custom VOSEO_RE — 0 hits).
- 6 `ES_UNPAIRED_BRACKETS` — false positives on Python literals `b'x'`, `'a.txt'` inside backticks.
- 4 `APOSTROFO_ACENTO` — false positives on Python string literals using ASCII apostrophes.
- 3 `EL_TILDE` — false positives: "el" before ".eml" or "dominio" is correct masculine article, not the pronoun "él".
- 3 `DIACRITICS_OTHERS` on `valida` — false positives: `valida` is the 3rd-person singular present verb ("los ejercicios guiados valida que…"), not the adjective `válida`. No tilde needed.
- 2 `SUBJUNTIVO_PASADO` on `role` — false positives: `role` is the English word inside backticks `role='bcc'`, not the Spanish subjunctive.
- 1 `UN_UNO` on `Ningún` — false positive.
- 1 `UPPERCASE_SENTENCE_START` — false positive caused by code identifier ending with `.` and next word `mail` not being capitalized.
- 4 `ES_SIMPLE_REPLACE_SIMPLE_SANITIZACIÓN` — false positives: `sanitización` is a valid Spanish word widely used in IT/security contexts (e.g., OWASP). LT's suggestion `desinfección` is the medical term.
- 1 `PREP_VERB` on `del template` — false positive: `template` here is a noun (the HTML template), not a verb.
- 1 `NUMBERS_IN_WORDS` on `cpn2c-01` — false positive: it's a synthetic run_id.

---

## 4. Meta-Leak Report

### Direct developer / AI / TODO leaks: **NONE found**.

Searched for `TODO`, `FIXME`, `XXX`, `WIP`, `TBD`, `mov(?:ed|ing)\s+from\s+section`, `nota\s+para`, `nota\s+interna`, `prompt\s+para\s+el`, `meta-?leak`, `placeholder`, `pendiente`, `revisar`, `borrador interno`. **Zero hits in learner-facing prose.** The only "placeholder" mention is in the We Do intro (line 680): `"Cada starter de CASO-LIM-022 trae un error deliberado — no un "placeholder vacío"."` — pedagogically intentional, contrasting the deliberate-defect starter with an empty placeholder.

### Structural / scope-drift meta-leaks (high severity):

**M-L1 (P0):** Filename `s22-rapidfuzz-entity.ts` and `id: "rapidfuzz-entity"` (line 4) do not match the section's actual content ("Email, identidad y aprobación humana"). The library `rapidfuzz` is never imported. Live URL `https://pillb.github.io/pyarcana/#rapidfuzz-entity` is the most visible learner-facing artifact of the mismatch. Section text at line 32 explicitly disclaims the topic the URL advertises.

**M-L2 (P0):** `**bold**` markdown markers leak as literal asterisks on the live page (T3-B callout confirmed via DOM inspection). Systemic root cause: `SectionView.tsx:401` renders `block.callout.content` as raw JSX without `<RichText>`. Same root cause also affects `:189` (jobRelevance), `:491` (step.instruction), `:571` (step.feedback), `:614` (project.context). All five fields use `**bold**` markers in S22.

### Taxonomy / scaffolding leaks (medium severity):

**M-L3 (P2):** `CASO-LIM-022` internal taxonomy code appears 53× in the source (~30 in learner-facing prose, code, and starter-code comments). Same pattern as S08 (`CASO-LIM-008`), S10 (`CASO-LIM-010`).

**M-L4 (P2):** `S22-T1-A` through `S22-T4-B` subtopic IDs appear 72× in `subtopicId` fields (technical, not directly rendered). Documented as a known pattern.

**M-L5 (P2):** `CP-N2-C` capstone acronym appears 18× without ever being spelled out. (See I-13.)

### Residue / leftover artifacts:

**M-L6 (P3):** Resource label `"Designing Data-Intensive Applications (Kleppmann) — select"` (line 1878) — odd `— select` suffix, likely meant "selected chapters".

**M-L7 (P3):** The `el_arte_de_python_roadmap_maestro_52_secciones.md` master roadmap still lists S22 as "FastAPI para Data Products" (line 214) — the roadmap document was not updated when the curriculum was rescoped. This is an in-repo meta-leak (not shipped to the live site, but visible to anyone reading the repo).

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do / Autocheck fidelity

**Gold-standard.** The section implements the Gradual Release of Responsibility method with textbook fidelity:

| Subtopic | Theory block | I Do demo | We Do exercises | Coverage |
|---|---|---|---|---|
| T1-A MIME | ✓ | S22-T1-A-DEMO | E1 guided, E2 independent, E3 transfer | ✓ |
| T1-B Templates | ✓ | S22-T1-B-DEMO | E1, E2, E3 | ✓ |
| T2-A OAuth | ✓ | S22-T2-A-DEMO | E1, E2, E3 | ✓ |
| T2-B Drafts | ✓ | S22-T2-B-DEMO | E1, E2, E3 | ✓ |
| T3-A Recipients | ✓ | S22-T3-A-DEMO | E1, E2, E3 | ✓ |
| T3-B Lists/Privacy | ✓ | S22-T3-B-DEMO | E1, E2, E3 | ✓ |
| T4-A Approval SM | ✓ | S22-T4-A-DEMO | E1, E2, E3 | ✓ |
| T4-B Idempotency | ✓ | S22-T4-B-DEMO | E1, E2, E3 | ✓ |

**8 subtopics × 4 activities = 32 scaffolded touchpoints + 1 capstone + 5 self-check Qs.**

Every We Do starter code contains a **deliberate DEFECT** (the `# A corregir:` comment names it explicitly) — not an empty placeholder. The progression guided → independent → transfer is uniform across all 8 subtopics. Each exercise has a hint, two deeper hints, an edgeCases array, an explicit "Salida esperada" contract, and a feedback paragraph that explains *why* the fix matters operationally. This is exactly the structure S06 and S11 used as their gold standard.

### 5.2 Connective tissue (narrative flow)

**Strong.** The section explicitly bridges from S21 (`Reporting Factory`) and forward to S23 (`Browser RPA con Playwright`):

- Line 16 (jobRelevance): *"S22 inicia CP-N2-C a partir del paquete de informe de S21 (DOCX/PDF/dashboard ya reconciliado)"*
- Line 32 (theory intro): *"En S23 conectarás un adaptador web (browser RPA); en esta sección el canal es `.eml` o draft de sandbox — el mismo contrato de gates, otro transporte."*
- Line 33 (theory intro): *"el paquete del run `cpn2c-01` ya salió de Reporting Factory (S21)"*
- Line 191 (T2-B): *"cifras del informe de S21 pueden haber cambiado"*
- Line 385 (T4-B): *"listo para el canal web de S23 (browser RPA), sin reabrir el paquete de informe de S21"*
- Line 1672 (youDo.context): *"La mesa de control acaba de aprobar el paquete de informe de S21… En S23 conectarás un adaptador web (browser RPA)"*

The `cpn2c-01` run_id is the narrative thread that ties S21 → S22 → S23 together. Excellent connective tissue.

### 5.3 Cognitive load and progressive disclosure

**Mostly good, with two overload points.** The T1 dictionary explicitly previews all 10 terms ("léelo antes de T1; cada término se desempaca en T1–T4"), and the T1 paragraphs[3] (line 34) gives an explicit learning-order map. The 8 subtopics build cleanly: T1 (Message) → T2 (Provider) → T3 (Recipient) → T4 (Workflow).

**Two cognitive-load hotspots:**
1. The T1 dictionary paragraph (line 31) is 105 words as a single block — overload for a "preview" (see I-16).
2. The iDo.intro (line 431) packs a 58-word "fíjate en la decisión" sentence that lists 6 design decisions back-to-back (see I-15).

Both are fixable with markdown formatting (definition list / bulleted list).

### 5.4 Exercise and exam quality

**Excellent.** Each We Do exercise follows a uniform template:
- `instruction` names the subtopic, the kind (guiado/independiente/transferencia), the task, the starter's defect, and the expected output contract.
- `hint` + `hints[]` provide 1 quick hint + 2 progressive deeper hints.
- `edgeCases[]` lists 1–2 real edge cases (charset None, race conditions, fromisoformat Z, subdomain bypass, etc.).
- `tests` is a single string ("salida coincide con solution output") — minimal but adequate given the deterministic output contract.
- `feedback` explains *why* the fix matters in operational terms ("el revisor de la mesa abre el .eml y espera un adjunto con nombre legible").
- `starterCode` and `solutionCode` are byte-aligned — same imports, same structure, with the fix applied.

**Self-check quality:** 5 MCQs covering the 5 key gates (draft-only, matching ≠ fraude, least privilege, idempotency, score 0.92 ethics). Q5 is a particularly well-designed "what does 0.92 authorize?" ethics question — the correct answer is the only one that doesn't overclaim. The explanations are concise and reference the section's contract.

### 5.5 Consistency with roadmap and previous sections

**Strong on content, weak on identity.** The section content (email MIME + OAuth scopes + drafts + recipient verification + approval SM + idempotency) is well-aligned with the CP-N2-C capstone and the S21→S23 narrative. However:
- The filename/ID/URL hash mismatch (I-01) breaks identity consistency.
- The master roadmap (line 214) still says "FastAPI para Data Products" for S22 — stale.
- `CASO-LIM-022` follows the `CASO-LIM-0NN` pattern established in earlier sections (S04 `CASO-LIM-004`, S08 `CASO-LIM-008`, S10 `CASO-LIM-010`) — consistent but leaky.

### 5.6 Comparison with best-in-class external materials

| Topic | S22 treatment | Best-in-class external | Comparison |
|---|---|---|---|
| MIME multiparte | `email.mime.multipart` with mixed+alternative+attachment | Python stdlib `email.examples.html`; RFC 2045 | On par — S22 covers the same ground with synthetic case data |
| HTML sanitization | `html.escape` + URL host allowlist with `urlparse` | OWASP XSS Prevention Cheat Sheet | On par — S22 explicitly cites OWASP and rejects substring matching as bypass-vulnerable |
| OAuth scopes | Synthetic `client_id` + `granted ⊆ allowed` + deny `mail.full`/`mail.send` | Google OAuth best practices; RFC 6749 | On par — S22's "least privilege as design, not flag" framing is industry-aligned |
| Draft adapters | `FileDraftAdapter` with `create_draft` + `is_usable(draft_id)` + `expires_at` | Gmail API drafts guide | On par — S22 abstracts the provider behind an adapter, matching Gmail API's `users.drafts.create` |
| Approval state machine | `TRANSITIONS` table + `apply(state, action, actor, log)` + fail-closed | NIST AI RMF (HITL); state-machine patterns in distributed systems | On par — S22 cites NIST AI RMF; the `{from, to, action, actor}` audit log matches industry accountability patterns |
| Idempotency | `sha256(run|to|body_ver)[:16]` + `retry_hit` audit event | Stripe idempotency keys; Kleppmann Ch.11 | On par — S22's `[:16]` truncation is reasonable for a lab; production systems would use the full hash or UUID. Cites Kleppmann. |

S22 is **above average** for a course section in citing primary sources (RFC 5322, RFC 2045, RFC 6749, OWASP, NIST AI RMF, Python stdlib docs, Gmail API docs, Kleppmann). The ethics framing (matching ≠ fraude, repeated 13× across the section) is rare in email-tutorial content and is a course-level strength.

---

## 6. Grammatical Improvements — Paragraph-by-Paragraph Before/After

For each tab, the worst-affected prose is rewritten below. Diff hunks in §7.

### 6.1 Theory tab — `jobRelevance` (line 16)

**Before (175 words, 5 sentences, FH ~50, includes 48w run-on):**
> En una mesa de control de operaciones o RPA (tickets, alertas, notificaciones a clientes sintéticos en Lima o Arequipa), el peaje más caro no es "enviar el correo": es **enviarlo mal** — destinatario incorrecto, HTML inseguro, un reintento que duplica el mensaje, o un bot con scopes de más. Un pipeline profesional separa **borrador → aprobación humana → envío** y deja evidencia (quién aprobó, con qué draft, bajo qué key). S22 inicia **CP-N2-C** a partir del paquete de informe de S21 (DOCX/PDF/dashboard ya reconciliado): MIME multiparte, scopes OAuth mínimos, resolución de destinatarios y cola de aprobación con audit. Coincidir emails o nombres es evidencia de **entrega correcta**, **no** prueba de fraude ni parentesco. En S23 el canal web se conecta; aquí el producto es un `.eml`/draft de sandbox fail-closed que un revisor de turno puede inspeccionar antes de cualquier acción de envío (simulada).

**After (split sentence 1 into 3; +1 sentence for CP-N2-C gloss):**
> En una mesa de control de operaciones o RPA (tickets, alertas, notificaciones a clientes sintéticos en Lima o Arequipa), el peaje más caro no es "enviar el correo": es **enviarlo mal**. Destinatario incorrecto, HTML inseguro, un reintento que duplica el mensaje, o un bot con scopes de más — cada uno es un incidente evitable. Un pipeline profesional separa **borrador → aprobación humana → envío** y deja evidencia (quién aprobó, con qué draft, bajo qué key). S22 inicia **CP-N2-C** *(Capstone de Nivel 2, Canal C: notificación con aprobación humana)* a partir del paquete de informe de S21 (DOCX/PDF/dashboard ya reconciliado): MIME multiparte, scopes OAuth mínimos, resolución de destinatarios y cola de aprobación con audit. Coincidir emails o nombres es evidencia de **entrega correcta**, **no** prueba de fraude ni parentesco. En S23 el canal web se conecta; aquí el producto es un `.eml`/draft de sandbox fail-closed que un revisor de turno puede inspeccionar antes de cualquier acción de envío (simulada).

**Changes:** (1) Split run-on sentence 1 at "es **enviarlo mal**." (2) Added "cada uno es un incidente evitable" as the new sentence 2 to absorb the list cleanly. (3) Added parenthetical CP-N2-C gloss at first use (fixes I-13).

### 6.2 I Do tab — `iDo.intro` (line 431)

**Before (91 words, 2 sentences, includes 58w run-on):**
> Te muestro el inicio de CP-N2-C a partir del paquete de S21: MIME seguro, scopes, drafts con expiración, destinatarios verificados y cola de aprobación — sin envío real ni inferencia de fraude. En cada demo, fíjate en la **decisión** (no solo en el print): por qué draft y no send; por qué parsear el host y no un substring; por qué denegar `mail.full`; por qué un externo va a BCC; por qué fail-closed ante una transición inválida; por qué la key de 16 hex evita spam al reintentar.

**After (sentence 2 converted to a bulleted list for cognitive-load relief):**
> Te muestro el inicio de CP-N2-C a partir del paquete de S21: MIME seguro, scopes, drafts con expiración, destinatarios verificados y cola de aprobación — sin envío real ni inferencia de fraude. En cada demo, fíjate en la **decisión** (no solo en el print):
> - por qué draft y no send;
> - por qué parsear el host y no un substring;
> - por qué denegar `mail.full`;
> - por qué un externo va a BCC;
> - por qué fail-closed ante una transición inválida;
> - por qué la key de 16 hex evita spam al reintentar.

**Changes:** Converted the 58-word run-on into a 6-item bulleted list. The list renders correctly via `<RichText>` (iDo.intro is wrapped in `<RichText>` at SectionView.tsx:426, confirmed).

### 6.3 Theory tab — `theory[0].paragraphs[0]` "Diccionario de la sección" (line 31)

**Before (105 words, 1 paragraph, FH -27.1 "muy difícil" — worst in section):**
> **Diccionario de la sección** (léelo antes de T1; cada término se desempaca en T1–T4). **MIME:** mensaje multiparte (text/html + adjuntos). **Draft sandbox:** borrador local o API de prueba — **no envío real**. **Scopes mínimos:** permisos OAuth justos para lo que el producto hace (aquí: drafts). **Resolución de destinatario:** mapear id de negocio → email verificado. **Cola de aprobación:** revisión humana obligatoria antes de cualquier envío (simulado). **Máquina de estados:** `draft` → `pending_review` → `approved` | `rejected` | `needs_edit`. **Idempotency key:** evita duplicar drafts al reintentar (`sha256` hex de **16** caracteres). **Fail-closed:** sin transición válida ni aprobación humana no hay envío. **Matching ≠ fraude:** coincidir contactos no prueba parentesco ni culpa.

**After (definition-list style, FH improves to ~70 "normal"):**
> **Diccionario de la sección** (léelo antes de T1; cada término se desempaca en T1–T4):
> - **MIME:** mensaje multiparte (text/html + adjuntos).
> - **Draft sandbox:** borrador local o API de prueba — **no envío real**.
> - **Scopes mínimos:** permisos OAuth justos para lo que el producto hace (aquí: drafts).
> - **Resolución de destinatario:** mapear id de negocio → email verificado.
> - **Cola de aprobación:** revisión humana obligatoria antes de cualquier envío (simulado).
> - **Máquina de estados:** `draft` → `pending_review` → `approved` | `rejected` | `needs_edit`.
> - **Idempotency key:** evita duplicar drafts al reintentar (`sha256` hex de **16** caracteres).
> - **Fail-closed:** sin transición válida ni aprobación humana no hay envío.
> - **Matching ≠ fraude:** coincidir contactos no prueba parentesco ni culpa.
> - **CP-N2-C:** Capstone de Nivel 2, Canal C — notificación con aprobación humana. Inicia en S22 y se conecta al canal web en S23.

**Changes:** (1) Converted to bulleted list. (2) Added CP-N2-C gloss (fixes I-13).

### 6.4 Theory tab — `theory[4].paragraphs[1]` T3-A ethics spine (line 240)

**Before (3 sentences; sentence 2 is 48w run-on):**
> Contrato ético y técnico: si usas un score de similaridad de nombres o emails, **siempre** acompáñalo de la nota **`match_no_es_fraude`**. En el ejercicio de transferencia calculas un prefijo común que da **0.86**; el self-check usa **0.92** solo como número de un MCQ ético — en ambos casos un score "alto" **no** autoriza claims de identidad legal, parentesco ni colusión; solo prioriza la revisión de **entrega correcta**. Matching de contactos ≠ investigación de fraude.

**After (split into 4 sentences for ethics-clarity; also fixes I-08 `similaridad` → `similitud`):**
> Contrato ético y técnico: si usas un score de similitud de nombres o emails, **siempre** acompáñalo de la nota **`match_no_es_fraude`**. En el ejercicio de transferencia calculas un prefijo común que da **0.86**. El self-check usa **0.92** solo como número de un MCQ ético. En ambos casos un score "alto" **no** autoriza claims de identidad legal, parentesco ni colusión: solo prioriza la revisión de **entrega correcta**. Matching de contactos ≠ investigación de fraude.

**Changes:** (1) Split the 48-word sentence 2 into 3 sentences at "que da **0.86**." and "MCQ ético." (2) Changed colon to colon at end so the "solo prioriza" clause reads as a clarification. (3) `similaridad` → `similitud` (fixes I-08).

### 6.5 Theory tab — T3-B callout content (line 328-329) — also fixes I-02 markdown leak

**Before (renders literal `**expone**` on live page):**
> Un CC masivo **expone** a todos entre sí (en jerga de operaciones: "filtra" = filtra información). Usa BCC o tickets internos cuando haya externos.

**After (assuming SectionView.tsx:401 is fixed to wrap callout.content in `<RichText>`):**
> Un CC masivo **expone** a todos entre sí (en jerga de operaciones: "filtra" = filtra información). Usa BCC o tickets internos cuando haya externos.

**Changes:** No prose change — the fix is in `SectionView.tsx` (route `block.callout.content` through `<RichText>` before passing as `<Callout>` children). Once fixed, the `**expone**` renders correctly as bold.

### 6.6 We Do tab — `weDo.intro` (line 680)

**Before (76 words, 4 sentences, FH ~55, no run-on):**
> Practica en 24 ejercicios con liberación gradual (guiado → independiente → transferencia): MIME, sanitización, OAuth scopes, drafts, resolución, privacidad de listas, máquina de estados e idempotencia. Cada starter de CASO-LIM-022 trae un error deliberado — no un "placeholder vacío". Lee el contrato de salida (líneas exactas) antes de editar; cuando pases, la consola debe coincidir con el bloque solución. En transferencia (E3) el problema se presenta en un escenario un poco más amplio: no es solo "cambiar un print".

**After (only change: replace `CASO-LIM-022` with `Caso 22` per I-11):**
> Practica en 24 ejercicios con liberación gradual (guiado → independiente → transferencia): MIME, sanitización, OAuth scopes, drafts, resolución, privacidad de listas, máquina de estados e idempotencia. Cada starter del Caso 22 trae un error deliberado — no un "placeholder vacío". Lee el contrato de salida (líneas exactas) antes de editar; cuando pases, la consola debe coincidir con el bloque solución. En transferencia (E3) el problema se presenta en un escenario un poco más amplio: no es solo "cambiar un print".

**Changes:** `CASO-LIM-022` → `Caso 22` (consistent with I-11 fix).

### 6.7 You Do tab — `youDo.context` (line 1672)

**Before (95 words, 4 sentences, FH ~58):**
> La mesa de control acaba de aprobar el paquete de informe de S21 (métricas reconciliadas en DOCX/PDF/dashboard). Tu trabajo: construir el **mini pipeline de notificación** de inicio de CP-N2-C — mensaje MIME → destinatario verificado → draft con idempotency key de 16 hex → estado `pending_review` con audit (actor). No envíes correo real. Matching de contactos no implica fraude. En S23 conectarás un adaptador web (browser RPA); aquí el canal es `.eml`/sandbox fail-closed. Entrega algo que un revisor humano pueda inspeccionar y firmar en el audit.

**After (same prose; the fix is the SectionView.tsx:614 markdown-leak fix so `**mini pipeline de notificación**` renders as bold):**
> La mesa de control acaba de aprobar el paquete de informe de S21 (métricas reconciliadas en DOCX/PDF/dashboard). Tu trabajo: construir el **mini pipeline de notificación** de inicio de CP-N2-C — mensaje MIME → destinatario verificado → draft con idempotency key de 16 hex → estado `pending_review` con audit (actor). No envíes correo real. Matching de contactos no implica fraude. En S23 conectarás un adaptador web (browser RPA); aquí el canal es `.eml`/sandbox fail-closed. Entrega algo que un revisor humano pueda inspeccionar y firmar en el audit.

**Changes:** No prose change — depends on SectionView.tsx:614 fix.

### 6.8 Autocheck tab — Q5 (line 1815-1821)

**Before (Q5 stem, 32 words):**
> Un score de similaridad 0.92 entre dos nombres de contactos sintéticos, ¿qué autoriza en el flujo de email de CP-N2-C?

**After (only change: `similaridad` → `similitud` per I-08):**
> Un score de similitud 0.92 entre dos nombres de contactos sintéticos, ¿qué autoriza en el flujo de email de CP-N2-C?

**Changes:** `similaridad` → `similitud`. The Q5 explanation (line 1820) is excellent and unchanged.

---

## 7. Proposed GitHub-style Diffs

Each diff is ready to apply. **Do NOT apply in this audit pass** (audit-only).

### Diff D-01 (P0, I-01) — Rename file + section id to match content

**Recommended approach:** coordinate with S21 (`id:"fastapi"`) and S23 (`id:"computer-vision"`) fixers; the orchestrator should pick a uniform rename strategy. The lowest-risk fix is to change only the `id` field (which controls the URL hash) and the file name (cosmetic, doesn't affect runtime).

```diff
--- a/src/lib/course/sections/s22-rapidfuzz-entity.ts
+++ b/src/lib/course/sections/s22-rapidfuzz-entity.ts
 (rename file to s22-email-approval.ts)
--- a/src/lib/course/index.ts
+++ b/src/lib/course/index.ts
@@ -21,7 +21,7 @@
 import { section21 } from './sections/s21-fastapi'
-import { section22 } from './sections/s22-rapidfuzz-entity'
+import { section22 } from './sections/s22-email-approval'
 import { section23 } from './sections/s23-computer-vision'
--- a/src/lib/course/sections/s22-email-approval.ts (renamed from s22-rapidfuzz-entity.ts)
+++ b/src/lib/course/sections/s22-email-approval.ts
@@ -1,7 +1,7 @@
 import type { CourseSection } from '../../types'

 export const section22: CourseSection = {
-  id: "rapidfuzz-entity",
+  id: "email-approval",
   index: 22,
   title: "Email, identidad y aprobación humana",
   shortTitle: "Email y aprobación",
```

**Live-site impact:** URL changes from `#rapidfuzz-entity` to `#email-approval`. Any existing learner bookmarks break. Coordinate with orchestrator before applying.

### Diff D-02 (P0, I-02) — Fix systemic markdown leak in SectionView.tsx (5 fields)

This is the same fix S06 proposed; applies course-wide, benefits all 52 sections.

```diff
--- a/src/components/course/SectionView.tsx
+++ b/src/components/course/SectionView.tsx
@@ -186,7 +186,7 @@
                 <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" title={tr('section.jobRelevance')}>
                   ...
-                <p className="text-sm text-foreground/80">{section.jobRelevance}</p>
+                <RichText content={section.jobRelevance} sectionId={section.id} />
@@ -398,7 +398,7 @@
           {block.callout && (
             <Callout type={block.callout.type} title={block.callout.title}>
-              {block.callout.content}
+              <RichText content={block.callout.content} sectionId={section.id} />
             </Callout>
           )}
@@ -488,7 +488,7 @@
-                <span className="text-sm font-semibold">{step.instruction}</span>
+                <RichText content={step.instruction} sectionId={section.id} />
@@ -568,7 +568,7 @@
                   {step.feedback && (
-                      {step.feedback}
+                      <RichText content={step.feedback} sectionId={section.id} />
                   )}
@@ -611,7 +611,7 @@
-            <p className="mt-1 text-sm text-foreground/80">{project.context}</p>
+            <RichText content={project.context} sectionId={section.id} />
```

**Verification:** Once applied, navigate to `#email-approval` → Teoría tab → T3-B callout. The `**expone**` should render as bold "expone" (no asterisks). Repeat for We Do tab `step.instruction` and You Do tab `project.context`.

### Diff D-03 (P1, I-03) — Fix `la revisor` gender agreement (4 occurrences)

Adopting the **feminize** path (aligns with `revisora@example.pe` already in the section).

```diff
--- a/src/lib/course/sections/s22-rapidfuzz-entity.ts
+++ b/src/lib/course/sections/s22-rapidfuzz-entity.ts
@@ -100,7 +100,7 @@
-          "Incluye plain text además de HTML: muchos clientes y filtros anti-spam lo exigen. El adjunto de meta del run (`run_id`, no secretos) ayuda a la revisor a auditar el `.eml` sin abrir un portal.",
+          "Incluye plain text además de HTML: muchos clientes y filtros anti-spam lo exigen. El adjunto de meta del run (`run_id`, no secretos) ayuda a la revisora a auditar el `.eml` sin abrir un portal.",
@@ -109,7 +109,7 @@
-        "Caso sintético: el cuerpo del borrador incluye un enlace al portal de revisión del run. Sin allowlist correcta, un fragmento malicioso redirige a un dominio externo. Por eso el gate de sanitización es **obligatorio** antes de encolar el draft en `pending_review`: la revisor humana debe ver HTML seguro, no un vector de ataque.",
+        "Caso sintético: el cuerpo del borrador incluye un enlace al portal de revisión del run. Sin allowlist correcta, un fragmento malicioso redirige a un dominio externo. Por eso el gate de sanitización es **obligatorio** antes de encolar el draft en `pending_review`: la revisora humana debe ver HTML seguro, no un vector de ataque.",
@@ -335,7 +335,7 @@
-        "Caso de laboratorio: el analista hace `submit`; la revisor `rev1` hace `approve` y el log registra `{from: pending_review, to: approved, action, actor}`. Si alguien intenta aprobar desde `draft`, el sistema responde `invalid`. El portfolio adjunta ese audit: evidencia de cumplimiento y de fail-closed para el hilo que en S23 saldrá a un adaptador web.",
+        "Caso de laboratorio: el analista hace `submit`; la revisora `rev1` hace `approve` y el log registra `{from: pending_review, to: approved, action, actor}`. Si alguien intenta aprobar desde `draft`, el sistema responde `invalid`. El portfolio adjunta ese audit: evidencia de cumplimiento y de fail-closed para el hilo que en S23 saldrá a un adaptador web.",
```

**Note:** The 4th instance detected by LanguageTool is likely in `youDo.context` or a feedback paragraph; the fixer should run `rg -n "la revisor" src/lib/course/sections/s22-rapidfuzz-entity.ts` and fix any remaining hits. Also consider masculinizing the other 8 occurrences of `un revisor` / `el revisor` → `una revisora` / `la revisora` for full consistency, OR adopt the masculinize path (4 edits, change `la revisor` → `el revisor`) — either works; pick one and apply globally.

### Diff D-04 (P1, I-04) — Fix `vs` → `vs.` (3 occurrences)

```diff
--- a/src/lib/course/sections/s22-rapidfuzz-entity.ts
+++ b/src/lib/course/sections/s22-rapidfuzz-entity.ts
@@ -150,7 +150,7 @@
-        "Caso: el pipeline pide `mail.draft` y por error también `mail.full`. La política filtra a `allowed` y deja `granted` sin privilegios de envío masivo. En sandbox, un scope de más es un **hallazgo de seguridad del diseño**, no un "detalle de configuración" que se ignora. La mesa de control puede auditar scopes pedidos vs concedidos en el mismo paquete de evidencia del run.",
+        "Caso: el pipeline pide `mail.draft` y por error también `mail.full`. La política filtra a `allowed` y deja `granted` sin privilegios de envío masivo. En sandbox, un scope de más es un **hallazgo de seguridad del diseño**, no un "detalle de configuración" que se ignora. La mesa de control puede auditar scopes pedidos vs. concedidos en el mismo paquete de evidencia del run.",
@@ -229,7 +229,7 @@
-          "El dominio llama `create_draft`; el adaptador decide Gmail API vs archivo `.eml` local. Así el workflow de aprobación no se acopla al SDK del proveedor.",
+          "El dominio llama `create_draft`; el adaptador decide Gmail API vs. archivo `.eml` local. Así el workflow de aprobación no se acopla al SDK del proveedor.",
@@ -1883,7 +1883,7 @@
-        note: "drafts reales vs sandbox; no envío automático",
+        note: "drafts reales vs. sandbox; no envío automático",
```

### Diff D-05 (P1, I-05) — Fix `URLs` → `URL` (RAE invariable acronym)

```diff
--- a/src/lib/course/sections/s22-rapidfuzz-entity.ts
+++ b/src/lib/course/sections/s22-rapidfuzz-entity.ts
@@ -881,7 +881,7 @@
-          "E3 (transferencia) — Clasifica dos URLs con allowlist de **host real** (no substring): usa `urlparse` y acepta solo host exactamente `example.pe` (CASO-LIM-022). El starter marca todo ok. Incluye en la prueba mental el bypass `example.pe.evil.test` (no debe pasar). Salida esperada (dos líneas):\nhttps://example.pe/a ok\nhttps://evil.test blocked",
+          "E3 (transferencia) — Clasifica dos URL con allowlist de **host real** (no substring): usa `urlparse` y acepta solo host exactamente `example.pe` (CASO-LIM-022). El starter marca todo ok. Incluye en la prueba mental el bypass `example.pe.evil.test` (no debe pasar). Salida esperada (dos líneas):\nhttps://example.pe/a ok\nhttps://evil.test blocked",
```

### Diff D-06 (P1, I-06) — Fix `auto-aprueba` → `autoaprueba`

```diff
--- a/src/lib/course/sections/s22-rapidfuzz-entity.ts
+++ b/src/lib/course/sections/s22-rapidfuzz-entity.ts
@@ -334,7 +334,7 @@
-        "Contrato: tabla `TRANSITIONS` como única fuente de verdad. `submit` desde `draft` → `pending_review`; `approve` desde `draft` → `invalid`; `request_edit` desde `pending_review` → `needs_edit` y luego otro `submit`. La UI y los jobs leen el estado; no "envían porque alguien pulsó un botón" sin validar la máquina. En mesa de control, un `pending_review` sin respuesta dentro del SLA suele **escalar** al revisor de turno o volver a `needs_edit` con nota — no se auto-aprueba por timeout. En CP-N2-C la aprobación humana es **obligatoria** antes de cualquier acción de envío (aunque el curso solo simule el envío).",
+        "Contrato: tabla `TRANSITIONS` como única fuente de verdad. `submit` desde `draft` → `pending_review`; `approve` desde `draft` → `invalid`; `request_edit` desde `pending_review` → `needs_edit` y luego otro `submit`. La UI y los jobs leen el estado; no "envían porque alguien pulsó un botón" sin validar la máquina. En mesa de control, un `pending_review` sin respuesta dentro del SLA suele **escalar** al revisor de turno o volver a `needs_edit` con nota — no se autoaprueba por timeout. En CP-N2-C la aprobación humana es **obligatoria** antes de cualquier acción de envío (aunque el curso solo simule el envío).",
```

### Diff D-07 (P1, I-07) — Add missing comma before `pero`

```diff
--- a/src/lib/course/sections/s22-rapidfuzz-entity.ts
+++ b/src/lib/course/sections/s22-rapidfuzz-entity.ts
@@ -1308,7 +1308,7 @@
-          "E2 (independiente) — Fuerza `role='bcc'` cuando el email es externo (`@other.test`) (CASO-LIM-022). El starter detecta el dominio pero no muta el role. Salida esperada:\nbcc",
+          "E2 (independiente) — Fuerza `role='bcc'` cuando el email es externo (`@other.test`) (CASO-LIM-022). El starter detecta el dominio, pero no muta el role. Salida esperada:\nbcc",
```

### Diff D-08 (P1, I-08) — `similaridad` → `similitud` (2 occurrences)

```diff
--- a/src/lib/course/sections/s22-rapidfuzz-entity.ts
+++ b/src/lib/course/sections/s22-rapidfuzz-entity.ts
@@ -237,7 +237,7 @@
-        "Contrato ético y técnico: si usas un score de similaridad de nombres o emails, **siempre** acompáñalo de la nota **`match_no_es_fraude`**. En el ejercicio de transferencia calculas un prefijo común que da **0.86**; el self-check usa **0.92** solo como número de un MCQ ético — en ambos casos un score "alto" **no** autoriza claims de identidad legal, parentesco ni colusión; solo prioriza la revisión de **entrega correcta**. Matching de contactos ≠ investigación de fraude.",
+        "Contrato ético y técnico: si usas un score de similitud de nombres o emails, **siempre** acompáñalo de la nota **`match_no_es_fraude`**. En el ejercicio de transferencia calculas un prefijo común que da **0.86**; el self-check usa **0.92** solo como número de un MCQ ético — en ambos casos un score "alto" **no** autoriza claims de identidad legal, parentesco ni colusión; solo prioriza la revisión de **entrega correcta**. Matching de contactos ≠ investigación de fraude.",
@@ -1813,7 +1813,7 @@
-          "Un score de similaridad 0.92 entre dos nombres de contactos sintéticos, ¿qué autoriza en el flujo de email de CP-N2-C?",
+          "Un score de similitud 0.92 entre dos nombres de contactos sintéticos, ¿qué autoriza en el flujo de email de CP-N2-C?",
```

### Diff D-09 (P1, I-09) — `appendea` → `agrega`

```diff
--- a/src/lib/course/sections/s22-rapidfuzz-entity.ts
+++ b/src/lib/course/sections/s22-rapidfuzz-entity.ts
@@ -1616,7 +1616,7 @@
-          "E3 (transferencia) — Mini `create_once(key)` con audit: el primer intento registra `create` y guarda el draft; el segundo con la **misma** key registra `retry_hit` y reutiliza el id (CASO-LIM-022). El starter solo appendea `create`. Imprime la lista de eventos y si ambos ids son iguales. Salida esperada (dos líneas):\n['create', 'retry_hit']\nTrue",
+          "E3 (transferencia) — Mini `create_once(key)` con audit: el primer intento registra `create` y guarda el draft; el segundo con la **misma** key registra `retry_hit` y reutiliza el id (CASO-LIM-022). El starter solo agrega `create`. Imprime la lista de eventos y si ambos ids son iguales. Salida esperada (dos líneas):\n['create', 'retry_hit']\nTrue",
```

### Diff D-10 (P1, I-10) — `checklist de compliance` → `lista de verificación de cumplimiento`

```diff
--- a/src/lib/course/sections/s22-rapidfuzz-entity.ts
+++ b/src/lib/course/sections/s22-rapidfuzz-entity.ts
@@ -291,7 +291,7 @@
-        "Caso: la lista trae duplicados de `ana@example.pe` y un `externo@other.test` en CC. Tras higiene, el externo pasa a BCC y el conteo de visibles baja. El audit del run registra la política aplicada. Esto es **privacidad operativa** del día a día, no un checklist de compliance que se tacha y se olvida.",
+        "Caso: la lista trae duplicados de `ana@example.pe` y un `externo@other.test` en CC. Tras higiene, el externo pasa a BCC y el conteo de visibles baja. El audit del run registra la política aplicada. Esto es **privacidad operativa** del día a día, no una lista de verificación de cumplimiento que se tacha y se olvida.",
```

### Diff D-11 (P2, I-13) — Add CP-N2-C + HITL glosses to T1 dictionary (combines with D-13)

```diff
--- a/src/lib/course/sections/s22-rapidfuzz-entity.ts
+++ b/src/lib/course/sections/s22-rapidfuzz-entity.ts
@@ -28,7 +28,7 @@
       heading: "Email con aprobación humana e inicio CP-N2-C",
       paragraphs: [
-        "**Diccionario de la sección** (léelo antes de T1; cada término se desempaca en T1–T4). **MIME:** mensaje multiparte (text/html + adjuntos). **Draft sandbox:** borrador local o API de prueba — **no envío real**. **Scopes mínimos:** permisos OAuth justos para lo que el producto hace (aquí: drafts). **Resolución de destinatario:** mapear id de negocio → email verificado. **Cola de aprobación:** revisión humana obligatoria antes de cualquier envío (simulado). **Máquina de estados:** `draft` → `pending_review` → `approved` | `rejected` | `needs_edit`. **Idempotency key:** evita duplicar drafts al reintentar (`sha256` hex de **16** caracteres). **Fail-closed:** sin transición válida ni aprobación humana no hay envío. **Matching ≠ fraude:** coincidir contactos no prueba parentesco ni culpa.",
+        "**Diccionario de la sección** (léelo antes de T1; cada término se desempaca en T1–T4):\n- **CP-N2-C:** Capstone de Nivel 2, Canal C — notificación con aprobación humana. Inicia en S22 y se conecta al canal web en S23.\n- **HITL:** Human-In-The-Loop, aprobación humana obligatoria antes de cualquier envío (simulado).\n- **MIME:** mensaje multiparte (text/html + adjuntos).\n- **Draft sandbox:** borrador local o API de prueba — **no envío real**.\n- **Scopes mínimos:** permisos OAuth justos para lo que el producto hace (aquí: drafts).\n- **Resolución de destinatario:** mapear id de negocio → email verificado.\n- **Cola de aprobación:** revisión humana obligatoria antes de cualquier envío (simulado).\n- **Máquina de estados:** `draft` → `pending_review` → `approved` | `rejected` | `needs_edit`.\n- **Idempotency key:** evita duplicar drafts al reintentar (`sha256` hex de **16** caracteres).\n- **Fail-closed:** sin transición válida ni aprobación humana no hay envío.\n- **Matching ≠ fraude:** coincidir contactos no prueba parentesco ni culpa.",
```

**Note:** This diff combines the dictionary-list conversion (I-16) with the CP-N2-C and HITL gloss additions (I-13, I-22) into a single edit. Once SectionView.tsx routes `block.paragraphs` through `<RichText>` (already done at line 387-390), the markdown list will render correctly.

### Diff D-12 (P2, I-14) — Split `jobRelevance` run-on + add CP-N2-C gloss

```diff
--- a/src/lib/course/sections/s22-rapidfuzz-entity.ts
+++ b/src/lib/course/sections/s22-rapidfuzz-entity.ts
@@ -13,7 +13,7 @@
   icon: "Mail",
   accentColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
   jobRelevance:
-    "En una mesa de control de operaciones o RPA (tickets, alertas, notificaciones a clientes sintéticos en Lima o Arequipa), el peaje más caro no es "enviar el correo": es **enviarlo mal** — destinatario incorrecto, HTML inseguro, un reintento que duplica el mensaje, o un bot con scopes de más. Un pipeline profesional separa **borrador → aprobación humana → envío** y deja evidencia (quién aprobó, con qué draft, bajo qué key). S22 inicia **CP-N2-C** a partir del paquete de informe de S21 (DOCX/PDF/dashboard ya reconciliado): MIME multiparte, scopes OAuth mínimos, resolución de destinatarios y cola de aprobación con audit. Coincidir emails o nombres es evidencia de **entrega correcta**, **no** prueba de fraude ni parentesco. En S23 el canal web se conecta; aquí el producto es un `.eml`/draft de sandbox fail-closed que un revisor de turno puede inspeccionar antes de cualquier acción de envío (simulada).",
+    "En una mesa de control de operaciones o RPA (tickets, alertas, notificaciones a clientes sintéticos en Lima o Arequipa), el peaje más caro no es "enviar el correo": es **enviarlo mal**. Destinatario incorrecto, HTML inseguro, un reintento que duplica el mensaje, o un bot con scopes de más — cada uno es un incidente evitable. Un pipeline profesional separa **borrador → aprobación humana → envío** y deja evidencia (quién aprobó, con qué draft, bajo qué key). S22 inicia **CP-N2-C** *(Capstone de Nivel 2, Canal C: notificación con aprobación humana)* a partir del paquete de informe de S21 (DOCX/PDF/dashboard ya reconciliado): MIME multiparte, scopes OAuth mínimos, resolución de destinatarios y cola de aprobación con audit. Coincidir emails o nombres es evidencia de **entrega correcta**, **no** prueba de fraude ni parentesco. En S23 el canal web se conecta; aquí el producto es un `.eml`/draft de sandbox fail-closed que un revisor de turno puede inspeccionar antes de cualquier acción de envío (simulada).",
```

**Depends on:** D-02 (SectionView.tsx jobRelevance fix) for the `**bold**` and `*italic*` to render.

### Diff D-13 (P2, I-15) — Convert `iDo.intro` 58w run-on to bulleted list

```diff
--- a/src/lib/course/sections/s22-rapidfuzz-entity.ts
+++ b/src/lib/course/sections/s22-rapidfuzz-entity.ts
@@ -428,7 +428,11 @@
   iDo: {
-    intro: "Te muestro el inicio de CP-N2-C a partir del paquete de S21: MIME seguro, scopes, drafts con expiración, destinatarios verificados y cola de aprobación — sin envío real ni inferencia de fraude. En cada demo, fíjate en la **decisión** (no solo en el print): por qué draft y no send; por qué parsear el host y no un substring; por qué denegar `mail.full`; por qué un externo va a BCC; por qué fail-closed ante una transición inválida; por qué la key de 16 hex evita spam al reintentar.",
+    intro: "Te muestro el inicio de CP-N2-C a partir del paquete de S21: MIME seguro, scopes, drafts con expiración, destinatarios verificados y cola de aprobación — sin envío real ni inferencia de fraude. En cada demo, fíjate en la **decisión** (no solo en el print):\n- por qué draft y no send;\n- por qué parsear el host y no un substring;\n- por qué denegar `mail.full`;\n- por qué un externo va a BCC;\n- por qué fail-closed ante una transición inválida;\n- por qué la key de 16 hex evita spam al reintentar.",
```

**Depends on:** None — `iDo.intro` is already wrapped in `<RichText>` at SectionView.tsx:426.

### Diff D-14 (P2, I-11) — Global replace `CASO-LIM-022` → `Caso 22` (~30 learner-facing occurrences)

Apply via sed in the fixer pass:

```bash
sed -i 's/CASO-LIM-022/Caso 22/g' src/lib/course/sections/s22-rapidfuzz-entity.ts
```

**Caveat:** This also affects the theory code block at line 41 (`"case": "CASO-LIM-022"` becomes `"case": "Caso 22"`) and the corresponding output at line 51. The code still runs identically. If the fixer prefers to preserve the code identifier, scope the sed to prose fields only.

### Diff D-15 (P3, I-20) — Fix `— select` odd suffix on book label

```diff
--- a/src/lib/course/sections/s22-rapidfuzz-entity.ts
+++ b/src/lib/course/sections/s22-rapidfuzz-entity.ts
@@ -1875,7 +1875,7 @@
     books: [
       {
         label: "Building Secure Software (McGraw)",
         note: "least privilege y validación",
       },
       {
-        label: "Designing Data-Intensive Applications (Kleppmann) — select",
+        label: "Designing Data-Intensive Applications (Kleppmann) — capítulos selectos",
         note: "idempotencia y logs",
       },
     ],
```

### Diff D-16 (P2, I-17) — Split T3-A ethics run-on (combines with D-08)

Already covered by D-08 above if the fixer applies the full §6.4 rewrite. Otherwise, apply the split independently:

```diff
--- a/src/lib/course/sections/s22-rapidfuzz-entity.ts
+++ b/src/lib/course/sections/s22-rapidfuzz-entity.ts
@@ -237,7 +237,7 @@
-        "Contrato ético y técnico: si usas un score de similaridad de nombres o emails, **siempre** acompáñalo de la nota **`match_no_es_fraude`**. En el ejercicio de transferencia calculas un prefijo común que da **0.86**; el self-check usa **0.92** solo como número de un MCQ ético — en ambos casos un score "alto" **no** autoriza claims de identidad legal, parentesco ni colusión; solo prioriza la revisión de **entrega correcta**. Matching de contactos ≠ investigación de fraude.",
+        "Contrato ético y técnico: si usas un score de similitud de nombres o emails, **siempre** acompáñalo de la nota **`match_no_es_fraude`**. En el ejercicio de transferencia calculas un prefijo común que da **0.86**. El self-check usa **0.92** solo como número de un MCQ ético. En ambos casos un score "alto" **no** autoriza claims de identidad legal, parentesco ni colusión: solo prioriza la revisión de **entrega correcta**. Matching de contactos ≠ investigación de fraude.",
```

### Diff D-17 (P2, I-18) — Split T1-B paragraphs[0] run-on at the colon

```diff
--- a/src/lib/course/sections/s22-rapidfuzz-entity.ts
+++ b/src/lib/course/sections/s22-rapidfuzz-entity.ts
@@ -107,7 +107,7 @@
       heading: "Templates y sanitización de HTML",
       subtopicId: "S22-T1-B",
       paragraphs: [
-        "Los **templates** de correo interpolan variables de negocio (nombre de contacto, `run_id`, montos del informe de S21). Cualquier dato que no sea 100 % confiable se trata como **no confiable**: se escapa con `html.escape` (o autoescape del motor de plantillas). La política de links usa allowlist de **hosts reales** (`example.pe` o subdominios propios) o rutas relativas; se bloquean esquemas `javascript:` y `data:`. **Nunca** uses substring (`'example.pe' in url`): un host `example.pe.evil.test` lo burlaría y el curso no enseña ese bypass como solución.",
+        "Los **templates** de correo interpolan variables de negocio (nombre de contacto, `run_id`, montos del informe de S21). Cualquier dato que no sea 100 % confiable se trata como **no confiable**: se escapa con `html.escape` (o autoescape del motor de plantillas). La política de links usa allowlist de **hosts reales** (`example.pe` o subdominios propios) o rutas relativas, y bloquea los esquemas `javascript:` y `data:`. **Nunca** uses substring (`'example.pe' in url`). Un host como `example.pe.evil.test` lo burlaría, y el curso no enseña ese bypass como solución.",
       ],
```

### Diff D-18 (P3, I-25) — Split tagline for readability (optional)

```diff
--- a/src/lib/course/sections/s22-rapidfuzz-entity.ts
+++ b/src/lib/course/sections/s22-rapidfuzz-entity.ts
@@ -5,7 +5,7 @@
   shortTitle: "Email y aprobación",
   tagline:
-    "Crea borradores en sandbox o archivos .eml; ningún correo real se envía automáticamente y todo destinatario requiere confirmación humana",
+    "Crea borradores en sandbox o archivos .eml. Ningún correo real se envía automáticamente; todo destinatario requiere confirmación humana.",
```

---

## 8. Recommended Priority Order for Fixing

| Priority | Diff(s) | Issue(s) | Effort | Impact |
|---|---|---|---|---|
| **P0-1** | D-02 | I-02 (markdown leak in SectionView.tsx) | ~2h | Course-wide fix; benefits all 52 sections; eliminates visible `**` asterisks |
| **P0-2** | D-01 | I-01 (URL hash + filename + id rename) | ~30min + coordination | Eliminates the most visible learner-facing meta-leak; requires orchestrator sign-off because URL changes |
| **P1-1** | D-03 | I-03 (`la revisor` ×4) | ~15min | Real grammar defect; 4 occurrences in learner-facing prose |
| **P1-2** | D-04, D-05, D-06, D-07, D-08, D-09, D-10 | I-04 through I-10 | ~30min total | 7 small grammar/orthography fixes; one pass per diff |
| **P2-1** | D-13 | I-15 (iDo.intro run-on → list) | ~10min | Cognitive-load relief on I Do tab intro |
| **P2-2** | D-11 (or D-11 + D-13 combined) | I-13, I-16, I-22 (dictionary list + glosses) | ~15min | Cognitive-load relief on Theory tab; adds CP-N2-C and HITL glosses |
| **P2-3** | D-12 | I-14 (jobRelevance run-on split) | ~10min | Depends on D-02 for `**` rendering |
| **P2-4** | D-16, D-17 | I-17, I-18 (T3-A and T1-B run-ons) | ~15min | Cognitive-load relief on Theory tab |
| **P2-5** | D-14 | I-11 (CASO-LIM-022 → Caso 22) | ~5min (sed) | Taxonomy-leak cleanup; coordinate with S08/S10/S11/S12 fixers |
| **P3-1** | D-15, D-18 | I-20, I-25 (book label, tagline) | ~5min | Style polish |
| **P3-2** | (none) | I-12, I-19, I-21, I-22, I-24, I-26 | (no action) | Informational / false-positive / accepted jargon |

**Estimated total fixer time for P0+P1+P2:** ~4–5 hours, of which ~2h is the systemic D-02 fix (shared with all 52 sections) and ~30min is the D-01 rename coordination.

---

## 9. Graph Memory Update Notes (for shared context files)

The following observations should be propagated to the orchestrator's shared graph memory for cross-section coordination:

1. **Systemic markdown-leak bug (P0)**: `SectionView.tsx` lines 189, 401, 491, 571, 614 render 5 prose fields as raw JSX without `<RichText>`. Confirmed live for S22 (T3-B callout `**expone**`). Same bug previously confirmed by S06. **Course-wide fix (D-02) is the highest-leverage single edit in the entire audit campaign** — it benefits every section that uses `**bold**` in `jobRelevance`, `callout.content`, `step.instruction`, `step.feedback`, or `project.context`. Recommend the orchestrator apply D-02 once globally rather than per-section.

2. **Systemic filename/ID/URL scope-drift pattern (P0)**: Section IDs that no longer match their content: S05 (`id:"oop"` → content is Functions), S06 (`id:"numpy"` → content is Collections), S07 (`id:"data-acquisition"` → content is Unicode/regex), S08 (`id:"pandas"` → content is Files/CSV/JSON), S10 (`id:"sklearn"` → content is Modules/CLI), S11 (`id:"testing"` → content is OOP), S12 (`id:"performance"` → content is APIs/SQL/Geo), S21 (`id:"fastapi"` → content is Reports), S22 (`id:"rapidfuzz-entity"` → content is Email/approval), S23 (`id:"computer-vision"` → content is Playwright RPA). **10 of 52 sections have stale URL hashes.** The master roadmap (`el_arte_de_python_roadmap_maestro_52_secciones.md`) is also stale for S22 (line 214 still says "FastAPI para Data Products"). Recommend orchestrator plan a single coordinated rename pass.

3. **Systemic `CASO-LIM-0NN` taxonomy leak**: S04 (`CASO-LIM-004`), S08 (`CASO-LIM-008`), S10 (`CASO-LIM-010`), S22 (`CASO-LIM-022`). **Pattern: 1 tag per section, ~30 learner-facing occurrences each.** Recommend a uniform replacement policy (e.g., `Caso N` or `caso sintético N`) applied course-wide.

4. **Systemic `SNN-TN-X` subtopic ID pattern**: S10, S11, S22 all use `SNN-T1-A` through `SNN-T4-B` as `subtopicId` strings. Currently not rendered to learners (technical IDs only), but exposed in source. Document as a known pattern; no immediate action.

5. **`vs.` period missing**: S08 (4×), S10 (×), S12 (3×), S22 (3×). Recommend course-wide `rg "\bvs\b"` and apply `vs.` replacement.

6. **`URLs` / `APIs` plural siglas**: S11 (`APIs`), S12 (`APIs`), S22 (`URLs`). Recommend course-wide `rg "URLs|APIs|HTTPs|JWTs|JSONs|HTMLs|IDs"` and replace per RAE invariable-acronym rule.

7. **Prefix+verb hyphenation**: S12 (`auto-etiqueta`), S22 (`auto-aprueba`). RAE rule: write as one word (`autoetiqueta`, `autoaprueba`).

8. **`similaridad` vs `similitud`**: S22 uses `similaridad` (2×); RAE prefers `similitud` for technical writing. Recommend course-wide replacement for consistency.

9. **S22 gold-standard code integrity**: All 8 I Do demos, 6 spot-checked We Do solutions, 4 spot-checked theory blocks, and the idempotency key digest (`sha256("run|to|v1")[:16]` = `0da400d6c9b3f756`) produce exactly the expected output. **Zero code/output drift.** This is the cleanest section so far in the audit campaign (S04 had 6 broken pairs, S06 had meta-leak-loaded editor code, S12 had 3 fabricated outputs + 4-way city drift). S22's author applied a stricter code-verification discipline.

10. **S22 ethics spine**: The "matching ≠ fraude" message is reinforced 13× across theory, I Do, We Do, You Do, and self-check — strongest ethics reinforcement in any audited section so far. The T3-A-E3 exercise that explicitly relabels `fraude_probable` → `match_no_es_fraude` is a particularly elegant anti-overclaim teaching device. Recommend as a gold-standard pattern for any section that touches entity resolution, similarity scoring, or fraud-adjacent topics (S11, S13, S28, S40).

11. **S22 → S23 handoff**: S22 explicitly hands off to S23 ("En S23 conectarás un adaptador web (browser RPA); aquí el canal es .eml o draft de sandbox"). The `cpn2c-01` run_id ties S21 → S22 → S23. This is exemplary connective tissue. The S23 auditor should verify that S23 picks up the `cpn2c-01` thread and references S22's `.eml`/draft contract.

12. **LanguageTool false-positive pattern**: 7 Voseo false positives on the English word `create` inside backticks (`'create'`, `audit create`). LT interprets `create` as the vos imperative of `crear`. **All Spanish sections that use `create` as a code-event name will trigger this.** Recommend the orchestrator document this as a known false-positive class so future auditors don't waste time on it.

---

## 10. Method Note (Spanish Grammar / Style / Structure)

### Research summary

This audit applies the research-backed heuristics documented in `/home/z/my-project/audits/_GRAMMAR_SUBPLAN.md`:

- **Fernández-Huerta (1959)** readability formula: `206.84 − 60·(syllables/word) − 1.02·(words/sentence)`. Spanish Flesch adaptation. Bands: ≥90 muy fácil → <30 muy difícil. For *technical* curriculum, "normal / bastante difícil" (~50–70) is healthy.
- **Szigriszt-Pazos / INFLESZ**: `206.835 − 62.3·(syllables/word) − (words/sentence)`. Used in Spanish education/health readability literature.
- **Words-per-sentence (WPS)** and **Syllables-per-word (SPW)**: structural-load metrics. Soft target WPS ~15–32 for technical Spanish.
- **LanguageTool** (`language=es`) public HTTP API: agreement, spelling, typography, style rules. Free-tier rate limits handled by chunking (≤18k chars per request, 5s sleep).
- **13 pedagogical Spanish heuristics** from the subplan: run-on (>45w), long (>32w), missing terminal `.?!`, missing `¿`/`¡`, unbalanced `()[]«»""`, repeated word, DET–NOUN agreement, English-dominant sentence, meta/AI/TODO leak, gerund pile-up (≥3), high comma density, paragraph = one long sentence, anaphoric monotony, space-before-punct, double space, voseo (Argentine/Uruguayan imperative).

### Implementation

The extraction + metrics pipeline lives at `/home/z/my-project/audits/_s22_grammar.py`. It:

1. Parses the TypeScript source file `s22-rapidfuzz-entity.ts` with a state-machine string extractor that masks `code:` / `starterCode:` / `solutionCode:` template literals, then extracts prose from 26 scalar keys + 7 array keys.
2. Splits each prose chunk into paragraphs and sentences using a Spanish-aware splitter (`¿¡`, light abbreviation protection for `Sr./Sra./Dr./etc./p.e./p.ej./Ud./e.g./i.e.`).
3. Computes FH, INFLESZ, WPS, SPW per chunk.
4. Applies the 13-rule heuristic suite.
5. Submits all Spanish prose (≤18k-char chunks, 5s sleep) to the LanguageTool public API.
6. Filters MORFOLOGIK_RULE_ES (spellcheck) false positives and analyzes the remaining 90 non-spelling matches.

### Metrics summary

- **262 prose records** extracted, **5,479 Spanish words** total.
- **Mean FH = 76.6** ("bastante fácil"), **mean INFLESZ = 72.3** ("normal"). Healthy readability for technical Spanish curriculum.
- **Mean WPS = 11.5**, **median WPS = 10.0**, **mean SPW = 1.97**. Well within pedagogy soft targets.
- **FH band distribution**: muy fácil 69 · fácil 51 · bastante fácil 48 · normal 43 · bastante difícil 22 · difícil 16 · muy difícil 13. The 13 "muy difícil" records are mostly short field labels (e.g., `note: 'aprobación humana y accountability en flujos automatizados'`) where the WPS=7 and SPW=3.0 (technical jargon density) pushes FH down without indicating actual reading difficulty.
- **4 run-on sentences** (>45w) and **9 long sentences** (33–45w) — see I-14 through I-19.
- **0 voseo** (custom VOSEO_RE) — confirmed uniformly tuteo. LT's 7 Voseo matches are all false positives on the English word `create` in backticks.
- **0 meta-leak** prose (custom META_LEAK_RE for TODO/FIXME/XXX/WIP/TBD/moved-from/placeholder/pendiente).
- **90 non-spelling LanguageTool matches**, of which ~75% are false positives caused by code identifiers inside backticks (periods in `mail.full`, `pending_review.`, brackets in `b'x'`, apostrophes in `'a.txt'`, etc.). The 15 real findings are catalogued as I-03 through I-10.

### Auxiliary artifacts

- `/home/z/my-project/audits/_s22/_s22_grammar.json` — 262-record metrics dump.
- `/home/z/my-project/audits/_s22/_s22_lt.json` — LanguageTool raw matches.
- `/home/z/my-project/audits/_s22_grammar.py` — extractor + heuristic suite + LT API caller.

---

**This is the complete Explorer report for Section 22. Ready for the Fixer prompt.**
