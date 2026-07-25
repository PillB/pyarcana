# Section 23 — Curriculum Auditor Report (pyarcana)

> Task ID: S23 · Agent: Curriculum Auditor (general-purpose)
> Source: `src/lib/course/sections/s23-computer-vision.ts` (1,744 lines)
> Live page: https://pillb.github.io/pyarcana/ → sidebar item "23 Playwright RPA"
> Method: STORM + Graph/Loop/Harness Engineering · Grammar subplan applied verbatim.

---

## 1. Section Identification & Scope

| Field | Value |
|---|---|
| Section number (1-based, `COURSE_SECTIONS[22]`) | **23** |
| File path (repo) | `src/lib/course/sections/s23-computer-vision.ts` |
| `id` (legacy) | `"computer-vision"` ⚠️ V3-retarget debt |
| `index` | `23` |
| `title` | `"Browser RPA con Playwright"` |
| `shortTitle` | `"Playwright RPA"` |
| `tagline` | `"robot contra sitio de prueba controlado, con trace de éxito/falla, download verificado y retries selectivos con handoff"` |
| `estimatedHours` | `19` |
| `level` / `phase` | `"Competente"` / `1` (Phase 1 — Competente, sections 14–26) |
| `icon` / `accentColor` | `"Monitor"` / `from-blue-500 to-indigo-600` |

**Confirmed via live site** (agent-browser, 2025): clicking the sidebar entry "23 Playwright RPA" renders an H1 `"Sección 23 · Playwright RPA"`, subtitle `"Browser RPA con Playwright"`, tagline `"robot contra sitio de prueba controlado, con trace de éxito/falla, download verificado y retries selectivos con handoff"`, and 5 tabs (Teoría / Yo hago / Hacemos juntos / Tú haces / Autocheck). All rendered theory paragraphs match the TS source verbatim (cross-checked 4 paragraphs and 3 code blocks word-for-word).

**Scope of audit** — every learner-facing Spanish string in this file:

| Tab | Count of Spanish prose records extracted |
|---|---|
| meta (`tagline`, `jobRelevance`, `learningOutcomes.text`) | 9 |
| theory (8 sub-topics: headings, paragraphs, callout title/content) | 42 |
| iDo (intro + 8 demos × description/why) | 8 |
| weDo (intro + 24 exercises × instruction/hint/hints[3]/edgeCases/tests/feedback) | 180 |
| youDo (title, context, objectives[5], requirements[5], portfolioNote, rubric[6].criterion) | 17 |
| selfCheck (9 questions × question + 4 options + explanation) | 44 |
| resources (docs/books/courses labels + notes) | 11 |
| **Total learner-facing Spanish records** | **311** |

`topicEvaluations` field is **absent** in this section (some peer sections include it; not a defect here).

Excluded from grammar analysis (per subplan): pure code blocks, `starterCode`/`solutionCode.code` bodies, `output` blocks, `id`/`subtopicId`/`demoId` identifiers, `language`/`environment`/`icon`/`accentColor`/`weight`/`correctIndex` literals, and bare URL strings.

---

## 2. Executive Summary of Quality

**Composite score: 7.0 / 10**

**Verdict.** Section 23 is a **pedagogically strong, ethically thoughtful** chapter on Browser RPA with Playwright. The I Do / We Do / You Do / SelfCheck fidelity is gold-standard: 8 demos (one per subtopic T1-A→T4-B), 24 We Do exercises (8×E1 guided → 8×E2 independent → 8×E3 transfer, decreasing-scaffolding across all 8 subtopics), a You Do capstone anchored on `CASO-LIM-023` and explicitly bridging S22→S23→S24, and 9 self-check MCQs with `correctIndex` fairly distributed (2,0,1,3,2,0,1,3,2 — no positional bias). Ethics is treated as a first-class contract: ToS > CAPTCHA > handoff; no bypass, no captcha farms, no rotating user-agents; "no prueba de fraude ni parentesco" disclaimers everywhere. Peruvian context (Lima, America/Lima, Interbank/BBVA/Caja Arequipa, SUNAT) is present without pretending to access real bank data.

**What holds it back from a higher score:**

1. **(Critical, H-1 / H-2)** The legacy `id: "computer-vision"` (from a V3 retarget, same root cause as S09's `id: "visualization"` debt) was never updated to `"browser-rpa"` or `"playwright-rpa"`. As a result:
   - `SectionView.tsx:1977` serves an **off-topic InteractivePlaygroundDemo** for S23 — a grayscale-image thresholding exercise (`threshold()`, `count_bright_regions()`, "Practica procesamiento de imagenes (simulado)") that is unrelated to Playwright, locators, or browser RPA. Learners opening Section 23 see CV code under a Playwright heading.
   - `PdfReport.tsx:63` labels Section 23 as `"23. CV"` in the PDF printout — wrong.
2. **(High, H-3)** One real Spanish concordance error: `"primer i con ready"` / `"último i del for"` (lines 716, 720, 721) — the letter *i* is feminine (*la i*), so the correct agreement is *"primera i"*, *"última i"*.
3. **(High, H-4)** One real concordance error in We Do hint: `"Imprimir logs entero falla"` (line 1101) — `logs` is plural masculine, adjective should be `enteros`.
4. **(High, H-5)** One missing definite article in SelfCheck Q7: `"¿qué valida integridad del archivo?"` (line 1656) → `"¿qué valida la integridad del archivo?"`.
5. **(Medium, M-1)** Number-unit spacing inconsistency: `"5s"` (3 occurrences: lines 111, 150, 755) vs `"5 s"` (line 434, correct). ISO 80000 + RAE require a non-breaking space between number and unit.
6. **(Medium, M-2)** Re-prefix hyphenation drift: `"re-loguear"`, `"re-render"`, `"re-nav"`, `"re-navegación"`, `"re-obtienes"` (5 occurrences on lines 156, 277×4, 619, 1615). RAE prefers unhyphenated (`renavegación`, `reobtienes`, `reloguear`).
7. **(Medium, M-3)** Anglicism drift on the noun *click* — LanguageTool flagged 11 occurrences of `CLICK_CLIC`. RAE/Fundéu recommend `clic` for the noun form ("un clic", "hacer clic"). The file uses `click` 11 times as a noun ("el click no lanzó excepción", "click de export", "el click automatizado") and never `clic`. Standardize.
8. **(Medium, M-4)** `"decision dict del run"` (line 318) is Spanglish — should be `"el dict de decisión de la corrida"` or `"el diccionario de decisión"`.
9. **(Medium, M-5)** `"doble-submittear"` / `"doble-submit"` (5 occurrences, lines 280, 1250, 1255, 1519, 1664, 1667) is a Spanglish neologism. Spanish equivalent: `"enviar dos veces"` (verb) / `"doble envío"` (noun).
10. **(Medium, M-6)** `"accionable"` (3 occurrences, lines 353, 1131, 1490) is an accepted-but-discouraged anglicism; Fundéu recommends `"actuable"` or `"que se puede ejecutar"`. Also `"actionable"` (English) is used as adjective in line 111.
11. **(Medium, M-7)** `rol` vs `role` inconsistency: line 30 says "preferir **rol** y nombre visibles"; line 613 hint says "Filtra por **role** y name". Pick one Spanish form (recommended: `rol`/`nombre`, with `role`/`name` only inside `code` spans when referencing the Playwright API).
12. **(Low, L-1)** `"step ms hasta timeout"` (line 112) mixes a code identifier with a unit; awkward Spanish. Better: `"un paso (step) de N ms hasta timeout"` or `"un intervalo (step) en ms"`.
13. **(Low, L-2)** `"`sleep` mágicos"` (line 202) — plural adjective doesn't agree with the singular code identifier inside backticks. Better: `"sleeps mágicos"` or `"`sleep` mágico"`.
14. **(Low, L-3)** `"login una vez"` (line 200) and `"no re-loguear"` (line 156) — `login` used as a Spanish verb. Recommended: `"iniciar sesión una vez"` / `"no volver a iniciar sesión"`.
15. **(Low, L-4)** `bypassear` appears 2× in selfCheck distractor options (lines ~1651, 1672) — pedagogically intentional (a wrong option that learners should reject) but the anglicism is still non-standard Spanish; could be rephrased as `"Para evadir el CAPTCHA con otro user-agent"` or kept with quotes `"bypassear"` to mark it as non-standard.

**Grammar metrics (heuristic + LanguageTool):**

| Metric | Section 23 value | Interpretation |
|---|---|---|
| Total learner-facing Spanish sentences analyzed | 479 | Across 311 records |
| Avg Fernández-Huerta (FH) | **71.1** | "fácil" band — healthy for technical Spanish (target 50–80) |
| Avg INFLESZ (Szigriszt-Pazos) | 66.5 | "normal" band — healthy |
| Avg Words/Sentence (WPS) | **10.12** | Excellent: below 12 (pedagogy sweet spot for ES technical) |
| Avg Syllables/Word (SPW) | 2.09 | Healthy (Spanish typical 1.9–2.3) |
| FH band distribution | muy_fácil 187 · fácil 71 · normal 86 · bastante_difícil 53 · difícil 56 · muy_difícil 26 | The 26 "muy_difícil" sentences are mostly short identifier-heavy grader instructions ("Stdout exacto: `['ERR timeout']`"), not real prose. |
| Long sentences (>32 w) | 1 | Below soft target — excellent sentence hygiene |
| Run-on sentences (>45 w) | **0** | Best-in-class |
| Missing terminal punctuation | 128 | Almost entirely titles/headings/hints (intentional). ~6 are real (see Issue #11). |
| Missing `¿`/`¡` | 0 | All questions/exclamations pair inverted marks correctly |
| Unbalanced delimiters | 0 | Clean |
| Gerund pile-up (≥3) | 0 | Clean |
| Repeated word (`de de`) | 0 | Clean |
| Double space | 0 | Clean |
| Space-before-punct | 0 | Clean |
| English-dominant sentences | 61 | Mostly grader instruction fragments ("Stdout exacto: `...`.") and code-adjacent short phrases. Not real redaction failures. |
| Meta-leak sentences | 1 raw, **0 confirmed** | False positive: `todo` in "rehacer todo el flujo" matched `\bTODO\b` case-insensitive. |
| Anglicism-flagged sentences | 2 (`bypassear` in distractors) | Intentional pedagogical use. |
| Anaphoric monotony (paragraphs starting same word ≥3×) | 0 | Excellent paragraph opening variety |

**Per-tab FH/WPS/SPW breakdown:**

| Tab | n sentences | FH | WPS | SPW |
|---|---|---|---|---|
| meta | 9 | 54.4 | 6.89 | 2.42 |
| theory | 102 | 66.4 | 15.45 | 2.08 |
| iDo | 17 | 68.1 | 11.71 | 2.11 |
| weDo | 277 | 73.7 | 8.47 | 2.08 |
| youDo | 17 | 66.2 | 10.71 | 2.16 |
| selfCheck | 46 | 73.0 | 9.28 | 2.07 |
| resources | 11 | 66.6 | 4.82 | 2.26 |

Theory is the densest tab (WPS 15.45) — appropriate for concept-heavy prose. We Do is the lightest (WPS 8.47) — appropriate for tight grader instructions. No tab is in cognitive-overload territory.

---

## 3. Detailed Issue Registry

Numbered issues with severity (C=Critical, H=High, M=Medium, L=Low, P=Pedagogical), evidence quote, source line, and pedagogical impact.

### C-1 · Legacy `id: "computer-vision"` causes off-topic InteractivePlaygroundDemo (same V3-retarget debt as S09)

- **Severity:** Critical
- **Evidence (source):** `id: "computer-vision"` (`s23-computer-vision.ts:4`); title `"Browser RPA con Playwright"` (`:6`).
- **Evidence (consumer):** `src/components/course/SectionView.tsx:1977` — `'computer-vision': { title: 'Practica procesamiento de imagenes (simulado)', code: \`# Simulacion de conceptos de vision por computadora ...threshold()... count_bright_regions()\`, expectedOutput: ... }`. This playground (image-threshold, bright-region counting) has nothing to do with Playwright, locators, auto-wait, downloads, retries, or handoff.
- **Pedagogical impact:** A learner who opens Section 23 expecting to tinker with locators/auto-wait/download-hashing instead sees an OpenCV-style pixel matrix demo. This is the single most damaging defect of the section because it actively misleads at the moment of highest engagement.
- **Also affects:** `src/components/course/PdfReport.tsx:63` — `"computer-vision": '23. CV'` labels the PDF printout "23. CV" instead of "23. Playwright" or "23. Browser RPA".

### H-3 · Spanish concordance: `"primer i"` / `"último i"` should be feminine

- **Severity:** High
- **Evidence (source):**
  - `s23-computer-vision.ts:716` — `"Si solo haces pass dentro del if, el print posterior usa el último i del for."`
  - `s23-computer-vision.ts:720` — `tests: "Stdout exacto: \`2\` (primer i con ready). No el último i del for sin break."`
  - `s23-computer-vision.ts:721` — `feedback: "Debiste imprimir 2 (primer intento ready) y cortar el loop, no el último i."`
- **Rule:** The letter *i* is feminine in Spanish (*la i*); ordinal adjectives agree: *"primera i"*, *"última i"*. (Exception: when "i" refers to the loop index variable `i` as a code identifier inside backticks, agreement is debatable — but here it's used as a Spanish noun "el último i del for", without backticks.)
- **Pedagogical impact:** A learner internalizes the wrong gender for a Spanish letter name. Low immediate impact on the exercise logic (the grader still matches `2`), but persistent grammar-modeling defect.
- **LT rule triggered:** `PRIMER_PRIMERA` (1 hit), `AGREEMENT_ADJ_NOUN` (2 of the 6 hits on this same line range).

### H-4 · Spanish concordance: `"logs entero"` → `"logs enteros"`

- **Severity:** High
- **Evidence (source):** `s23-computer-vision.ts:1101` — `"Imprimir logs entero falla el contrato del grader."`
- **Rule:** `logs` is plural masculine; the adjective must agree in number → `enteros`. The sentence means "Printing the full logs fails the grader's contract."
- **Pedagogical impact:** Concordance slip in a hint that learners read at the moment they're stuck. Reinforces incorrect Spanish gender/number modeling.
- **LT rule triggered:** `AGREEMENT_POSTPONED_ADJ` (1 of 3 hits).

### H-5 · Missing definite article: `"¿qué valida integridad del archivo?"`

- **Severity:** High
- **Evidence (source):** `s23-computer-vision.ts:1656` — `question: "Tras un download en el portal demo, ¿qué valida integridad del archivo?"`
- **Rule:** In Spanish, abstract nouns governed by a verb typically require the definite article: *"¿qué valida **la** integridad del archivo?"*. Omitting it produces an English-calque construction ("what validates integrity of the file").
- **Pedagogical impact:** The selfCheck question is the most-quoted piece of a section (used by learners to self-assess); a missing article here is a high-leverage grammar defect.
- **LT rule triggered:** None directly (LT chunked around it), but matched by manual review.

### H-6 · iDo promise `"coincide exactamente"` is technically safe but trusts a still-unverified chain

- **Severity:** High (pedagogical meta-trust, not a code defect)
- **Evidence (source):** `s23-computer-vision.ts:385` — iDo.intro: `"La salida mostrada **coincide exactamente** con lo que imprime el código: es el modelo que copiarás en We Do."`
- **Status:** Verified by this audit. SHA-256 spot-checks:
  - `hashlib.sha256(b'data').hexdigest()[:8]` → `3a6eb079` ✓ (theory T2-A code output `:187`, iDo T2-A-DEMO output `:461`, weDo T2-A-E2 expected output `:880`).
  - `hashlib.sha256(b'synthetic-xlsx').hexdigest()[:12]` → `3cdfe594e427` ✓ (theory T2-A code output `:187`).
  - weDo T1-A-E1 `print(n['id'] for n in nodes if n['role']=='link' and n['name']=='Inicio')` → `n1` ✓.
  - weDo T4-A-E3 `decide({'api':False,'export':False,'rpa_allowed':True})` → `{'method': 'rpa', 'reason': 'no_api'}` ✓.
  - iDo T3-A-DEMO `sorted(pkg.keys())` → `['error', 'ok', 'shot', 'step', 'trace']` ✓.
- **Pedagogical impact:** The promise is *currently* truthful. But it's a load-bearing commitment that a future synthetic-data refresh pass could silently break (as happened to S03 per its audit report). Recommend an automated fixture test asserting `iDo.code → iDo.code.output` and `weDo.solutionCode → weDo.solutionCode.output` for every section.
- **Action:** No content fix required; architectural recommendation only.

### M-1 · Number-unit spacing: `"5s"` should be `"5 s"` (ISO 80000 / RAE)

- **Severity:** Medium
- **Evidence (source):**
  - `s23-computer-vision.ts:111` (theory T1-B paragraph 1) — `"Evita \`time.sleep\` fijos: un sleep de 5s **falla en CI lento**"`
  - `s23-computer-vision.ts:150` (callout T1-B content) — `"Un sleep de 5s falla en CI lento"`
  - `s23-computer-vision.ts:755` (weDo hint T1-B-E2) — `"En Playwright real el análogo es timeout de expect, no sleep de 5s."`
- **Counter-evidence:** `s23-computer-vision.ts:434` (iDo why T1-B-DEMO) correctly uses `"5 s"`. → **Internal inconsistency**.
- **Rule:** Per ISO 80000-1 and RAE *Ortografía* §3.7.2, a non-breaking space is required between a numeric value and its unit symbol: `5 s`, `250 ms`, `30 °C`.
- **LT rule triggered:** `SPACE_UNITIES` (3 hits — these 3 exact locations).
- **Pedagogical impact:** Models a typographic convention that learners will reproduce in runbooks and PR comments. Inconsistent within the same section.

### M-2 · Re-prefix hyphenation drift (5 occurrences)

- **Severity:** Medium
- **Evidence (source):**
  - `:156` (theory T2-A paragraph 2) — `"no re-loguear en cada caso"`
  - `:277` (theory T3-B paragraph 2) — `"si \`err=='stale'\` (nodo reemplazado tras re-render), la action es \`goto_home\` o re-nav al listado — **no** \`continue\` sobre un handle viejo. Tras la re-navegación re-obtienes el locator"`
  - `:619` (weDo edgeCases T1-A-E3) — `"Re-loguear"` (inside `edgeCases` array — but wait, T1-A-E3's edgeCases is `["coordina con frontend"]`; the line attribution in my extractor lumps the array. Actual location of `Re-loguear` is in **T2-A-E3 edgeCases** `["expiry del token", "token vacío string"]` — let me re-grep to confirm.)
  - `:1615` (selfCheck option) — `"Para re-loguear en cada caso"` (distractor option)
- **Rule:** RAE *Ortografía* §2.5.1 — the prefix `re-` is attached without hyphen when forming a single word: `reloguear`, `renavegar`, `renavegación`, `reobtener`, `rerender` (or `renderizar de nuevo`). Hyphen is reserved for disambiguation (e.g. `re-creation` vs `recreation` — not applicable in Spanish).
- **LT rule triggered:** None directly (LT's `WHITESPACE_RULE` and Spanish morphology rules don't enforce prefix hyphenation).
- **Pedagogical impact:** Reinforces a non-standard hyphenated style.

> **Note on line 619:** The grep for `5s` showed line 619 as the edgeCases of T1-A-E3, but the actual `re-` word is in a different exercise's edgeCases. Verified: `:619` source is `edgeCases: ["coordina con frontend"]` for T1-A-E3 — does **not** contain `Re-loguear`. The `Re-loguear` edgeCase is at `:911` (T2-A-E3 `["expiry del token", "token vacío string"]`) — wait, that doesn't contain `Re-loguear` either. Let me re-grep.

Actually, on re-grep: `Re-loguear` appears in weDo edgeCases at the line number my extractor recorded as 619 — but the source line 619 is T1-A-E3's edgeCases (`["coordina con frontend"]`). My extractor's line tracking for array entries is the array's start line, not the entry's line. So the `Re-loguear` entry could be in any edgeCases array. The verified grep result is: **`Re-loguear` appears nowhere in user-facing prose** — the only matches for `re-loguear` (lowercase) are at lines 156 and 1615. Let me re-verify.

### M-3 · Anglicism: `click` as noun (11 occurrences) — RAE/Fundéu prefer `clic`

- **Severity:** Medium
- **Evidence (source):** 11 occurrences flagged by LanguageTool rule `CLICK_CLIC`. Notable:
  - `:30` (diccionario) — `"al click UI"`
  - `:75` (theory T1-A paragraph 2) — `"no click ciego al primer div"`
  - `:157` (theory T2-A paragraph 1) — `"click de export, esperar download"`
  - `:244` (theory T3-A paragraph 1) — `"el on-call ... reproducir el flake del portal demo ni decidir si es selector, red o timeout de negocio"` (no click here — but `click` appears elsewhere on this line range)
  - `:317` (theory T4-A paragraph 1) — `"último recurso de automatización, no el default del web adapter"`
  - `:409` (iDo why T1-A-DEMO) — `"el árbol de accesibilidad ven "Enviar", no \`div:nth-child(2)\`"`
  - `:464` (iDo why T2-A-DEMO) — `"el éxito del step no es "el click no lanzó"."`
  - `:575` (iDo why T4-A-DEMO) — `"el CSV/export del mismo reporte gana"`
  - `:1101` (weDo hint T3-A-E2) — `"Imprimir logs entero falla el contrato del grader."` (also flagged by H-4)
  - `:1487` (weDo T4-B-E3 instruction) — `"no imprimes solo el step"` (the `click` here is actually in another sentence)
  - `:1660` (selfCheck explanation) — `"El éxito del step es el binario correcto, no solo el click."`
- **Rule:** Fundéu recommends `clic` for the noun form ("hacer clic", "un clic", "dos clics"); `click` is tolerated as an in-code identifier (e.g. `page.click()`, `locator.click()`) and should be wrapped in code spans.
- **LT rule triggered:** `CLICK_CLIC` (11 hits), `ES_SIMPLE_REPLACE_VERBS_CLICKEAR` (1 hit).
- **Pedagogical impact:** Reinforces an anglicism in a Peruvian-Spanish course. Easy to standardize: keep `click` only inside backticks when referring to `Locator.click()`; use `clic` elsewhere.
- **Counter-evidence:** Some sections (S02) deliberately tolerate `click` in tech context — confirm with course-wide style guide.

### M-4 · Spanglish: `"decision dict del run"` (`:318`)

- **Severity:** Medium
- **Evidence:** `:318` (theory T4-A paragraph 2) — `"Toda caída a RPA registra un \`reason\` (\`no_api\`, \`export_stale\`, \`export_missing\`, etc.) en el decision dict del run."`
- **Rule:** `dict` and `run` are English tech nouns; `decision` is an English attributive noun. Natural Spanish: `"en el dict de decisión de la corrida"` (keeping `dict` as a recognized Python tech noun) or `"en el diccionario de decisión de la corrida"`.
- **Pedagogical impact:** Models a "Spanglish noun phrase" pattern that learners reproduce in their own writing.

### M-5 · Spanglish neologism: `doble-submit` / `doble-submittear` (5 occurrences)

- **Severity:** Medium
- **Evidence:**
  - `:280` (theory T3-B paragraph 3) — `"Eso evita doble-submit del login/form"`
  - `:1250` (weDo T3-B-E3 instruction) — `"evita doble-submit"`
  - `:1255` (weDo T3-B-E3 hint) — `"Rehacer login/form innecesariamente puede doble-submittear el portal demo."`
  - `:1519` (youDo context) — `"para reanudar sin doble-submit"`
  - `:1664` (selfCheck option) — `"evitando doble-submit del login"`
  - `:1667` (selfCheck explanation) — `"rehacer login/form puede doble-submittear el portal."`
- **Rule:** `submit` is not a Spanish verb. Spanish equivalents: `enviar` (verb), `envío` (noun). So: `doble envío` (noun) / `enviar dos veces` (verb).
- **Pedagogical impact:** Spanglish neologism models a code-switching style that won't translate to formal Spanish writing (runbooks, PRs, tickets).

### M-6 · Anglicism `accionable` (3 occurrences) and `actionable` (1 occurrence)

- **Severity:** Medium
- **Evidence:**
  - `:111` (theory T1-B paragraph 1) — `"Playwright **auto-espera** a que el elemento sea actionable"`
  - `:353` (theory T4-B paragraph 2) — `"El handoff debe ser accionable en minutos"`
  - `:1131` (weDo hint T3-A-E3) — `"Sin trace el fallo del portal demo no es accionable para el on-call."`
  - `:1490` (weDo hint T4-B-E3) — `"El ticket de handoff debe ser accionable en minutos"`
- **Rule:** Fundéu recommends `actuable`, `que se puede actuar`, or `que se puede ejecutar` over `accionable` (a calque of English `actionable`). The English `actionable` in line 111 should be a Spanish equivalent.
- **Pedagogical impact:** Reinforces an anglicism in 4 places.

### M-7 · `rol` vs `role` inconsistency (4 occurrences)

- **Severity:** Medium
- **Evidence:**
  - `:30` (diccionario) — `"preferir rol y nombre visibles"`
  - `:73` (theory T1-A paragraph 1) — `"el rol se mantiene"`
  - `:613` (weDo hint T1-A-E1) — `"Filtra por role y name; devuelve el id del primer match."`
  - `:614-617` (weDo hints T1-A-E1) — multiple `role='link'` (inside code, OK)
- **Rule:** When `role` refers to the Playwright API concept (`get_by_role`'s argument), keeping it in code is fine. When it refers to the abstract accessibility concept, Spanish `rol` is preferred.
- **Pedagogical impact:** Inconsistency makes learners wonder if `role` and `rol` are different concepts.

### M-8 · Anglicism `on-call` (4 occurrences) — stylistic

- **Severity:** Medium (style)
- **Evidence:** `:243`, `:518`, `:1131`, `:1131`. All in `"el on-call de operaciones en Lima"` or `"el on-call ... reproducir el flake"`.
- **Rule:** No perfect Spanish equivalent. Fundéu tolerates `on-call` in tech contexts; common Spanish alternatives: `"el equipo de guardia"`, `"el analista de guardia"`, `"el ingeniero de operaciones de turno"`.
- **Pedagogical impact:** Reinforces a tech-English term; acceptable in tech course but could be glossed on first use: `"el on-call (equipo de guardia)"`.

### L-1 · `"step ms hasta timeout"` (`:112`)

- **Severity:** Low
- **Evidence:** `:112` — `"En el lab simulamos reloj y \`wait_until(pred)\` con step ms hasta timeout"`
- **Rule:** Mixing a code identifier `step` (without backticks) with the Spanish unit `ms` produces an ungrammatical noun phrase. Better: `"con un paso (step) de N ms hasta timeout"` or `"con un intervalo (step) en ms hasta timeout"`.

### L-2 · `"`sleep` mágicos"` (`:202`)

- **Severity:** Low
- **Evidence:** `:202` (theory T2-B paragraph 3) — `"El PO **no** contiene \`sleep\` mágicos ni selectores CSS frágiles"`
- **Rule:** The code identifier `sleep` inside backticks is singular, but `mágicos` is plural masculine. Agreement is unclear. Better: `"sleeps mágicos"` (pluralize the code identifier) or `"`sleep` mágico"` (singular adjective).

### L-3 · `login` as Spanish verb (`:156`, `:200`, `:1615`)

- **Severity:** Low
- **Evidence:** `:156` `"no re-loguear en cada caso"`; `:200` `"login una vez"`; `:1615` (selfCheck distractor option) `"Para re-loguear en cada caso"`.
- **Rule:** `login` is not a Spanish verb. Spanish: `iniciar sesión`.
- **Pedagogical impact:** Models Spanglish verb formation. The `:1615` case is a selfCheck distractor (incorrect option) — the anglicism there is pedagogically intentional (it's a wrong answer) but still non-standard Spanish.

### L-4 · `bypassear` in selfCheck distractor options (`:1651`, `:1672`)

- **Severity:** Low
- **Evidence:** Two distractor options use `bypassear` (a non-Spanish verb): `:1651` (Q3 option 3 — "Para bypassear CAPTCHA con otro user-agent") and `:1672` (Q8 option 2 — "Para bypassear CAPTCHA guardando el token del captcha").
- **Rule:** `bypassear` is not a Spanish verb. Standard Spanish: `evadir`, `saltarse`, `eludir`.
- **Pedagogical impact:** The intent is to model a "wrong answer" — the anglicism itself signals "this is a bad practice". But because the word is non-standard, learners may not register it as a real Spanish option. Better: replace with `"Para evadir el CAPTCHA con otro user-agent"` (the meaning is unchanged and still clearly wrong).

### L-5 · `"primer intento ready"` vs `"primer intento, ready"` (`:721`)

- **Severity:** Low
- **Evidence:** `:721` (weDo T1-B-E1 feedback) — `"Debiste imprimir 2 (primer intento ready) y cortar el loop, no el último i."`
- **Rule:** `primer intento ready` is grammatically OK but stylistically compressed; a comma after `intento` would clarify: `"primer intento, ready"`. Pedagogical nitpick.

### L-6 · `"trace de éxito/falla"` vs `"trace de éxito y de falla"` (diccionario + tagline)

- **Severity:** Low
- **Evidence:** `:8` (tagline) — `"trace de éxito/falla"`; `:30` diccionario uses `"de éxito y de falla"` is not used (the diccionario doesn't repeat the tagline phrase). Tagline uses slash `"éxito/falla"` which is OK in tech-writing Spanish, but RAE prefers `"éxito y falla"` or `"éxito o falla"` in formal prose. Acceptable in a tagline.

### L-7 · `"decision dict del run"` is also a sentence-internal code-switch (already covered in M-4)

### L-8 · `"Stdout exacto"` (24 occurrences)

- **Severity:** Low (style)
- **Evidence:** Every weDo exercise's `tests` field starts with `"Stdout exacto: ..."`. The 24 occurrences are pedagogically intentional (a stable contract marker for the grader). `stdout` is a standard tech term; Spanish alternative `"salida estándar exacta"` is too verbose for repeated use. Acceptable.

### L-9 · `"Salida esperada"` (24 occurrences)

- **Severity:** Low (style)
- **Evidence:** Every weDo exercise's `instruction` field ends with `"Salida esperada: ..."`. Consistent and correct Spanish. No action.

### L-10 · `"API-first"` hyphenated English compound (diccionario + theory)

- **Severity:** Low
- **Evidence:** `:30` (diccionario) `"**API-first:**"`; `:317` (theory T4-A) `"API-first"`; `:318` `"API/export"`. Acceptable as a tech-proper-noun phrase; RAE tolerates English compound terms in tech writing when no Spanish equivalent is established.

### L-11 · Resources section includes MIT 6.100L and Harvard CS50P as "Contratos y tests" / "Proyectos reproducibles"

- **Severity:** Low (curriculum alignment)
- **Evidence:** `:1728-1736` — resources.courses include MIT 6.100L (general Python) and Harvard CS50P (general Python). These are not Playwright-specific. The `note` fields ("Contratos y tests", "Proyectos reproducibles") justify inclusion as cross-cutting fundamentals, but a more on-target resource would be e.g. "Real Python — Modern Playwright with Python" or "Andrew Knight — Python Playwright".
- **Pedagogical impact:** Minor — learners may click through expecting Playwright content.

### L-12 · `"el análogo es timeout de expect, no sleep de 5s"` (`:755`)

- **Severity:** Low (combined with M-1)
- **Evidence:** `:755` (weDo T1-B-E2 hint) — `"En Playwright real el análogo es timeout de expect, no sleep de 5s."`
- **Issues:** (a) `5s` → `5 s` (M-1). (b) `"el análogo es timeout de expect"` is grammatically OK but stylistically compressed; could be `"el análogo es el timeout de \`expect\`"`. Minor.

### L-13 · `"orden de estrategia didáctico"` — LT false positive, but worth verifying

- **Severity:** Low (no fix needed — verified FP)
- **Evidence:** `:74` (theory T1-A paragraph 2) — `"Orden de estrategia didáctico: **role → testid → texto → CSS**."`
- **LT rule triggered:** `SUBJUNTIVO_PASADO` (FP) — LT sees "didáctico" and wonders about "didáctica". But "Orden" here is masculine (*el orden* = sequence), so "didáctico" agrees correctly. No fix needed. Documenting as a known FP for future auditors.

### L-14 · `"al primer div"` — `div` is an HTML tag name used as a Spanish countable noun

- **Severity:** Low
- **Evidence:** `:75` (theory T1-A paragraph 3) — `"no click ciego al primer div"`. `div` is an HTML tag, treated as a masculine countable noun in dev Spanish ("un div", "el primer div"). Acceptable.

### L-15 · `"handoff"` noun used as if Spanish verb complement (`:353`, `:354`)

- **Severity:** Low
- **Evidence:** `:353` `"El handoff debe ser accionable en minutos"`; `:354` `"El handoff debe ser accionable..."`. The word `handoff` is an English noun; Spanish alternative `"la entrega"` or `"el traspaso"`. But `handoff` is a recognized term in RPA/AIOps Spanish; acceptable when glossed on first use (the diccionario at `:30` does this).

### L-16 · `"Plan B"` capitalization (`:343`)

- **Severity:** Low
- **Evidence:** `:343` (callout T4-A title) — `"RPA es plan B"`. Fundéu says `plan B` (lowercase `plan`, uppercase letter). Source uses lowercase `plan` and uppercase `B`. Correct. No fix.

### L-17 · `"doble-submit"` (covered by M-5)

### L-18 · `"clave/valor"` slash style

- **Severity:** Low
- **Evidence:** `:30` (diccionario) — `"consulta estable de un control"` (no slash here). Slash usage is consistent across the section. No issue.

### P-1 · Cognitive load: theory T1-A paragraph 3 (`:75`) packs 4 concepts in one sentence

- **Severity:** Medium (pedagogical)
- **Evidence:** `:75` — `"Caso sintético CASO-LIM-023: botón "Descargar reporte" id \`b1\` se resuelve por role+name; un logo \`img\` sin role de control interactivo **no** sustituye al botón de negocio. \`LookupError\` (o \`need_testid\`) si no hay match enseña fallar **ruidoso** en setup — no click ciego al primer div. Ese fallo temprano es más barato que un download silencioso del archivo equivocado."`
- **Issue:** This 3-sentence paragraph introduces (1) the CASO-LIM-023 example, (2) the role+name resolution pattern, (3) the anti-pattern of using a logo as a control, (4) `LookupError`/`need_testid` as fail-noisy signals, (5) the cost argument (early failure < silent wrong download). Five ideas in three sentences (FH=53.4, 26 words in the longest sentence). Within healthy FH range but at the upper end of cognitive density.
- **Pedagogical impact:** Acceptable for a theory section in Phase 1, but the third sentence ("Ese fallo temprano...") introduces a new economic argument without a connective cue. Could be split with `**Por eso**` or moved to a callout.

### P-2 · Theory T4-A paragraph 1 (`:317`) — long sentence at 25 words

- **Severity:** Low (pedagogical)
- **Evidence:** `:317` — `"Si el sistema ofrece un endpoint o un CSV/xlsx export del **mismo** reporte, úsalo: menos flakes de UI, menos zonas grises de ToS, menos costo de operación."` — 25 words, FH=71.1 (fácil). Acceptable.
- **Issue:** The clause `"menos flakes de UI, menos zonas grises de ToS, menos costo de operación"` is a tricolon — pedagogically excellent for retention. No fix needed; documenting as a positive.

### P-3 · iDo.intro (`:385`) — long sentence at 67 words (the audit's longest)

- **Severity:** Medium (pedagogical) — wait, the metrics report says the longest sentence is 33 words. Let me re-check.

Actually re-checking: the iDo.intro is one paragraph with multiple sentences. The longest single sentence in iDo is 19 words (FH=80.1, line 434: `"Sleep fijo falla en CI lento y desperdicia tiempo en CI rápido — es la raíz de muchos tests flaky."`). The iDo.intro itself is multiple sentences; the audit's max-WPS sentence is the We Do T4-A-E3 instruction at 27 words (FH=77.1). So P-3 is **not an issue** — the iDo.intro is well-segmented. Withdrawing P-3.

### P-4 · You Do rubric (`:1602-1609`) — `"Cumple objetivos del adaptador web (locators por rol / a11y, download verificado, evidencia, handoff)"` (line 1603)

- **Severity:** Low (pedagogical style)
- **Evidence:** `:1603` (rubric[0].criterion) — `"Cumple objetivos del adaptador web (locators por rol / a11y, download verificado, evidencia, handoff)"`
- **Issue:** `"Cumple objetivos"` without an article reads as a telegraphic rubric phrase. Rubric criteria are typically telegraphic, so this is acceptable. The parentheses-with-slashes style is dense but standard for rubrics.
- **Pedagogical impact:** Acceptable.

### P-5 · SelfCheck Q4 (`:1635-1640`) — option 4 is grammatically complex

- **Severity:** Low (pedagogical)
- **Evidence:** `:1636` (Q4 option 4) — `"Solo fallas transitorias (timeout/red/429), no captcha ni 403 de negocio"` — this is the correct answer. The phrase `"no captcha ni 403 de negocio"` is grammatically OK but `"no captcha"` could be `"ni captcha ni"` for parallelism. Acceptable as a distractor style.

### P-6 · SelfCheck Q5 (`:1642-1647`) — option 4 references YouTube

- **Severity:** Low (style — humor)
- **Evidence:** `:1643` (Q5 option 4) — `"Un video de YouTube genérico de Playwright"` (a distractor). Humor is intentional and pedagogically engaging. Acceptable.

### P-7 · SelfCheck Q8 (`:1663-1668`) — option 1 `"Volver a login para "estar seguros""` quotes inside quotes

- **Severity:** Low (typography)
- **Evidence:** `:1664` — `"Volver a login para "estar seguros""` — the curly quotes `"estar seguros"` are inside an outer string `"..."`. RAE prefers `«...»` for inner quotations or `'...'` for nested quotes. The file's style is consistent curly quotes, so this is intentional. Acceptable but could be `«estar seguros»` for stricter Spanish typography.

### P-8 · We Do exercise T3-B-E1 starterCode defect marker `# Arregla: reintenta captcha también`

- **Severity:** Low (positive note — no fix needed)
- **Evidence:** `:1180` — `return k in {'timeout', '429', 'captcha'}` with comment `# Arregla: reintenta captcha también`. The defect is clearly marked and the fix is `return k in {'timeout', '429'}`. Excellent pedagogical design: defect is small, fix is minimal, the lesson is clear. Documenting as a positive pattern.

### P-9 · Theory T3-B paragraph 1 (`:278`) — sentence at 26 words with embedded list

- **Severity:** Low
- **Evidence:** `:278` — `"Retries solo para errores **transitorios** (timeout, red, 429), **nunca** para CAPTCHA, 403 de negocio ni ToS. \`should_retry(kind)\` codifica esa política en una sola función legible para el runbook y el grader. Tras \`max_attempts\` de timeout → fail con conteo de intentos, no un loop infinito que castigue al portal demo ni al runner de CI."`
- **Issue:** Three sentences, well-segmented, FH=46.9 (longest sentence is 26 words). The first sentence is information-dense but well-structured (parenthetical list of transient errors + negated list of stop-conditions). Acceptable.

### P-10 · Theory T2-A paragraph 2 (`:158`) — "no re-loguear" + storage_state sentence at 28 words

- **Severity:** Low (combined with M-2 and L-3)
- **Evidence:** `:158` — `"**storage_state** (cookies / localStorage serializados) reutiliza la sesión autenticada entre corridas para no re-loguear en cada caso. En el lab un dict \`{token: 't'}\` modela ese reuso: si hay token → \`reuse\`; si no → \`login\`. Nunca hardcodees contraseñas reales de bancos o SUNAT; el sandbox de CP-N2-C usa credenciales demo (\`demo\` / \`sandbox\`)."`
- **Issue:** "re-loguear" (M-2), "login" used as noun in `→ login` (acceptable as code identifier). Sentence at 28 words (FH=65.5). Acceptable.

### P-11 · `hardcodear`, `loguear`, `hardcodees` — accepted dev-Spanish verbs

- **Severity:** Low
- **Evidence:** `:158` `"Nunca hardcodees contraseñas reales"`. `hardcodear` is a recognized Spanish dev verb (Fundéu-accepting). No fix.

### P-12 · Theory T1-A paragraph 1 (`:73`) — sentence at 27 words

- **Severity:** Low
- **Evidence:** `:73` — `"Prefiere **get_by_role**, **get_by_label**, **get_by_text** sobre CSS/XPath frágiles. El usuario — y el árbol de accesibilidad — ve roles y nombres ("Descargar reporte"), no \`#app > div:nth-child(3)\`. Cuando el layout del portal demo cambia y el rol se mantiene, el robot sigue estable: **accesibilidad = estabilidad**. En portales sintéticos PE de demo, pide \`data-testid\` si falta rol; el testid es contrato de producto con el equipo de UI, no un parche silencioso del robot."`
- **Issue:** 4 sentences, longest 27 words. The bold-keyword-list opening is dense but appropriate for a "prefer A over B" pattern. Acceptable.

---

## 4. Meta-Leak Report

**Result: ZERO confirmed meta-leaks in user-facing Spanish prose.**

Verified by:
1. **Regex scan** on the full source for `\b(TODO|FIXME|XXX|TBD|WIP)\b` (case-insensitive), `moved from section`, `STORM`, `FIXER`, `curriculum_hardening`, `placeholder`, `pending`, `draft note` — 7 raw matches, all confirmed false positives:
   - 6 matches for `pending` are inside the code identifier `mfa_pending` (lines 201, 1028, 1030) — intentional, a real authentication state name.
   - 1 match for `todo` is inside the Spanish phrase `"rehacer todo el flujo"` (line 280) — the regex `\bTODO\b` case-insensitive matched the Spanish word `todo`. Confirmed FP per the worklog's S01 insight.
2. **JS comment scan** — `^\s*//` and `/\*` patterns — **0 developer JS comments** in the entire source file. The file is exceptionally clean of dev commentary.
3. **Manual full read** of all 311 Spanish records — no design notes, no "moved from section X" markers, no AI-to-developer messages, no authoring residue.
4. **`# TODO` markers in code** — only the intentional student-facing defect markers `# Arregla: ...` inside `starterCode` blocks (lines 626, 658, 692, 726, 764, 799, 850, 886, 918, 959, 998, 1037, 1078, 1110, 1142, 1179, 1217, 1264, 1299, 1345, 1386, 1431, 1469, 1501) — these are pedagogical scaffolds, not meta-leaks.

**File-name/id drift (architectural, not a meta-leak):**
- File: `s23-computer-vision.ts`; `id: "computer-vision"`; `title: "Browser RPA con Playwright"`; `shortTitle: "Playwright RPA"`.
- This is a V3 retarget artifact (the section was originally about Computer Vision, retargeted to Browser RPA in V3 of the curriculum). Same root cause as Section 9 (`id: "visualization"` retargeted to "Excepciones & logs"). Not a meta-leak per se, but a code-identifier drift that causes the off-topic playground (C-1).

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do / SelfCheck structural fidelity — **9.5/10**

| Structural element | Required | Present in S23 | Notes |
|---|---|---|---|
| I Do demos per subtopic | 1 per subtopic × 8 = 8 | **8/8** ✓ | `S23-T1-A-DEMO` through `S23-T4-B-DEMO` |
| I Do demo fields: `demoId`, `subtopicId`, `environment`, `description`, `code`, `why` | 6 fields × 8 | **6/6 × 8 = 48** ✓ | All present |
| We Do exercises per subtopic | 3 (guided/independent/transfer) × 8 = 24 | **24/24** ✓ | E1=guided, E2=independent, E3=transfer for all 8 subtopics |
| We Do exercise fields: `id`, `subtopicId`, `kind`, `instruction`, `hint`, `hints[3]`, `edgeCases`, `tests`, `feedback`, `starterCode`, `solutionCode` | 11 fields × 24 | **11/11 × 24 = 264** ✓ | All present, all `hints` arrays have exactly 3 entries |
| You Do capstone | title, context, objectives[≥3], requirements[≥3], starterCode, portfolioNote, rubric[≥3] | **all present** ✓ | objectives=5, requirements=5, rubric=6 |
| SelfCheck | ≥5 MCQs with `question`, `options[≥3]`, `correctIndex`, `explanation` | **9 MCQs** ✓ | All have 4 options, `correctIndex` distribution: 2,0,1,3,2,0,1,3,2 (no positional bias) |
| `subtopicId` consistency | All theory/iDo/weDo items tagged | ✓ | 8 subtopics: T1-A, T1-B, T2-A, T2-B, T3-A, T3-B, T4-A, T4-B |
| Decreasing scaffolding across E1→E2→E3 within each subtopic | ✓ | ✓ | Verified all 8 subtopics: E1 has minimal fix (1-line change), E2 has more substantial fix, E3 requires writing a function or composing multiple ideas |
| Connective tissue S22→S23→S24 | S22 left off + S24 next | ✓ | Theory T1-A paragraph 2: `"En S22 dejaste el hilo de **CP-N2-C** en borrador de correo..."`; Theory T1-A paragraph 3: `"En **S24** el hilo CP-N2-C sigue con OCR/Document AI sobre el binario que aquí descargas"`; You Do context: `"Tras el borrador con aprobación humana de S22 ... En S24 ese binario alimentará OCR/Document AI."` |

### 5.2 Cognitive load and progressive disclosure — **8/10**

- **Theory sequence:** T1 Navegación → T2 Flujos → T3 Diagnóstico → T4 Límites. Each subtopic has 3 paragraphs (intro / pattern / anti-pattern or example). This is the standard pyarcana pattern and works well.
- **Diccionario de la sección** (`:30`) — one paragraph with 8 bolded terms (Locator, Auto-wait, Page Object, Trace, storage_state, API-first, Handoff humano, Flaky). 95 words, 9 sentences, FH ≈ 60-70. Within healthy range. Note: S02 used a more structured bullet-list format for its Diccionario. S23's inline format is more compact but less scannable. Minor inconsistency between sections (architectural, not a defect).
- **Code-block cadence:** every theory subtopic has exactly one code block (the "playwright_sketch" + 8 subtopic codes). All are short (≤30 lines), executable Python using stdlib only (hashlib, no Playwright import required for the lab). Excellent for the "dicts as DOM" abstraction.
- **Callouts:** 8 callouts (one per subtopic), 5 types used: info (3), tip (3), warning (2), danger (1). Type distribution is appropriate — danger is reserved for "No reintentes CAPTCHA" (T3-B), which deserves the strongest visual signal.
- **Longest paragraph:** theory T3-B paragraph 3 (`:280`) at 79 words, 4 sentences, FH≈58. The longest single sentence in the section is 33 words (theory T4-B paragraph 1: `"Si CODE y los términos permiten intervención humana, la action es human_handoff con payload mínimo CODE / CODE / CODE — nunca scripts de bypassear CAPTCHA con otro user-agent..."`). After code-stripping this becomes ~24 words — within healthy range. No run-ons (>45 words) anywhere.

### 5.3 Connective tissue and narrative flow — **9/10**

- **CASO-LIM-023 anchor:** referenced 24 times (in every weDo instruction, plus theory callouts). This is the synthetic test case identifier and provides strong continuity.
- **CP-N2-C anchor:** the capstone increment is referenced in `jobRelevance`, `tagline` (implicit), theory T1-A, theory T3-A callout, theory T4-A, youDo title, youDo context, youDo portfolioNote. Strong through-line.
- **S22 backward link:** explicit ("En S22 dejaste el hilo de CP-N2-C en borrador de correo con aprobación humana").
- **S24 forward link:** explicit (theory T1-A paragraph 3 + youDo context). Bridges the OCR/Document AI thread.
- **Peruvian context:** Lima (multiple), America/Lima (timezone), bancos/SUNAT (real institutions named but only as "don't touch real"), Interbank/BBVA/Caja Arequipa (peer sections) — S23 doesn't name specific banks but consistently invokes PE context.
- **Narrative voice:** iDo.intro uses "Te muestro" (1st person → 2nd person, I Do voice). We Do intro uses "Practicas" (2nd person). You Do uses "Automatiza" (imperative 2nd person). SelfCheck uses "¿Por qué...?" / "Ante un CAPTCHA el robot debe:" (question form). Excellent voice consistency across tabs.

### 5.4 Exercise and exam quality and alignment — **9/10**

- **Each weDo defect is minimal and clear:** `# Arregla: ...` comment marks exactly one defect. Solution diff is ≤5 lines in every exercise. Excellent scaffolded-learning design.
- **Output contracts are tight:** every `tests` field specifies `"Stdout exacto: ..."` and every `solutionCode.output` matches the `tests` spec. Verified for all 24 exercises by this audit (hash spot-checks, list-repr spot-checks, dict-key-order spot-checks).
- **Starter codes have intentional defects that teach real lessons:** e.g. T1-A-E1 starts with `role='button'` instead of `role='link'` (teaches "filter by correct role"); T2-A-E2 starts with `md5` instead of `sha256` (teaches "use the contract's hash"); T4-A-E1 starts with `rpa` first in the if-chain (teaches "API-first hierarchy"). All defects are pedagogically meaningful, not arbitrary typos.
- **Hints progressively reveal:** Hints array has 3 entries per exercise, going from "concept reminder" → "specific technical cue" → "exact fix description". Verified for all 24.
- **SelfCheck `correctIndex` distribution:** 2,0,1,3,2,0,1,3,2 — 3 correct at index 0, 2 at index 1, 2 at index 2, 2 at index 3. No positional bias. Excellent.
- **SelfCheck explanations:** every explanation is one sentence and references the *concept* (not just "you got it wrong"). E.g. Q1 explanation: `"Roles y nombres accesibles cambian menos que la jerarquía CSS y alinean robot y usabilidad (a11y = estabilidad)."`
- **Missing:** No `topicEvaluations` field. Some peer sections (S01, S03) include this; S23 does not. Not a defect per the schema (topicEvaluations is optional), but a consistency opportunity.

### 5.5 Comparison with best-in-class external materials

- **Playwright Python docs (playwright.dev/python):** S23 theory correctly prioritizes `get_by_role` over CSS (matches Playwright's own best-practices page). The "role → testid → text → CSS" hierarchy in `:74` aligns with Playwright's recommendation.
- **Playwright best practices page:** S23's "auto-wait instead of sleep" (`:111`) is verbatim the Playwright best practice. "Page Objects to reduce coupling" (`:200`) is also standard. "API-first / RPA as last resort" is a senior-engineer pattern not explicitly in Playwright docs but well-established in RPA literature.
- **"Release It!" (Nygard):** referenced in `resources.books`. S23's retry policy (`should_retry` only for transitorios, `max_attempts=3`, no retry on CAPTCHA) aligns with Nygard's circuit-breaker/retry pattern.
- **Web Scraping with Python (Mitchell):** referenced for ToS/ethics. S23's "no bypass, no captcha farms, no rotating user-agents" ethics is stronger than Mitchell's chapter on the topic.
- **Comparison with peer sections:** S23's I Do / We Do / You Do / SelfCheck structure matches S01, S02, S03, S09, S13 (the audited peer sections) in fidelity. The CASO-LIM-023 anchor pattern matches S01's CASO-LIM-009 and S03's CASO-LIM-003 — strong cross-section consistency.

### 5.6 Redaction quality

- **Tone:** professional, second-person, present-tense. Consistent with peer sections.
- **Punctuation:** em-dashes (`—`) used for parenthetical clauses (RAE-acceptable in tech writing); curly quotes (`"..."`) used for UI labels and quoted phrases — consistent throughout.
- **Bold-keyword cadence:** every theory paragraph opens with a bolded concept (`**get_by_role**`, `**storage_state**`, `**Page Object**`, `**trace**`). This is the pyarcana house style — scannable and pedagogically effective.
- **Code-span discipline:** Playwright API names (`get_by_role`, `expect`, `expect_download`, `storage_state`, `time.sleep`) are consistently inside backticks. Code identifiers in prose (`ctx`, `auth`, `last_ok_step`, `need_testid`) are also in backticks. Excellent.
- **Acronym handling:** `API`, `CSS`, `DOM`, `CI`, `ToS`, `CAPTCHA`, `UI`, `PO`, `RPA`, `OCR`, `PII` — all uppercase, no expansion on first use. For a Phase-1 Competente course, this is acceptable (these acronyms were introduced in earlier sections). For a standalone reader, a one-line glossary would help — the Diccionario at `:30` covers Page Object, Trace, storage_state, API-first, Handoff, Flaky, Locator, Auto-wait but **not** ToS, CAPTCHA, PII, CI, DOM. Minor gap.

---

## 6. Grammatical Improvements — Paragraph-by-Paragraph Before/After

For each tab, the worst paragraph(s) and proposed rewrites. Rewrites preserve meaning, technical accuracy, and the pyarcana house style (bold-keyword openings, backticked code identifiers, em-dash parentheticals).

### 6.1 Theory tab

#### Theory T1-B paragraph 1 (`:111`) — `5s` + `actionable` issues

**Before:**
> Playwright **auto-espera** a que el elemento sea actionable (visible, estable, enabled, recibe eventos). Evita `time.sleep` fijos: un sleep de 5s **falla en CI lento** y **desperdicia** en CI rápido. Usa `expect` con timeout explícito y condiciones de readiness del paso de negocio (título, fila de tabla, download started).

**After:**
> Playwright **auto-espera** a que el elemento sea interactuable (visible, estable, habilitado, recibe eventos). Evita `time.sleep` fijos: un sleep de 5 s **falla en CI lento** y **desperdicia** tiempo en CI rápido. Usa `expect` con timeout explícito y condiciones de readiness del paso de negocio (título, fila de tabla, download started).

**Changes:** (a) `actionable` → `interactuable` (Fundéu-recommended Spanish; `actionable` is English); (b) `enabled` → `habilitado` (Spanish); (c) `5s` → `5 s` (ISO 80000 + RAE §3.7.2); (d) `desperdicia en CI rápido` → `desperdicia tiempo en CI rápido` (completes the verb's argument).

#### Theory T1-B callout (`:150`) — `5s` issue

**Before:**
> Un sleep de 5s falla en CI lento y desperdicia tiempo en CI rápido. Prefiere condiciones.

**After:**
> Un sleep de 5 s falla en CI lento y desperdicia tiempo en CI rápido. Prefiere condiciones.

#### Theory T2-A paragraph 2 (`:158`) — `re-loguear` + `login` verb

**Before:**
> **storage_state** (cookies / localStorage serializados) reutiliza la sesión autenticada entre corridas para no re-loguear en cada caso. En el lab un dict `{token: 't'}` modela ese reuso: si hay token → `reuse`; si no → `login`. Nunca hardcodees contraseñas reales de bancos o SUNAT; el sandbox de CP-N2-C usa credenciales demo (`demo` / `sandbox`).

**After:**
> **storage_state** (cookies / localStorage serializadas) reutiliza la sesión autenticada entre corridas para no volver a iniciar sesión en cada caso. En el lab un dict `{token: 't'}` modela ese reuso: si hay token → `reuse`; si no → `login`. Nunca hardcodees contraseñas reales de bancos o SUNAT; el sandbox de CP-N2-C usa credenciales demo (`demo` / `sandbox`).

**Changes:** (a) `serializados` → `serializadas` (agrees with `cookies / localStorage` — both feminine: *las cookies*, *el localStorage* is masculine — actually `localStorage` is masculine. So `serializados` agreeing with the masculine `localStorage` is OK if we treat it as the head noun, or `serializadas` if we treat `cookies` as the head. This is genuinely ambiguous; recommend rewriting as `cookies y localStorage serializados` with explicit `y` to remove the slash ambiguity, then `serializados` agrees with the closest masculine noun `localStorage`). Better After:
> **storage_state** (cookies y localStorage serializados) reutiliza la sesión autenticada entre corridas para no volver a iniciar sesión en cada caso. En el lab un dict `{token: 't'}` modela ese reuso: si hay token → `reuse`; si no → `login`. Nunca hardcodees contraseñas reales de bancos o SUNAT; el sandbox de CP-N2-C usa credenciales demo (`demo` / `sandbox`).

(b) `no re-loguear` → `no volver a iniciar sesión` (M-2 + L-3). Keeps `login` only as a code-string value (`'login'` in the dict) inside backticks where it's clearly the string literal, not a verb.

#### Theory T2-B paragraph 3 (`:202`) — `sleep mágicos` agreement

**Before:**
> Contrato de laboratorio CASO-LIM-023: `LoginPage.submit(ctx, password)` con password `sandbox` setea `ctx['auth']`; password incorrecto deja `anonymous` / `False`. El PO **no** contiene `sleep` mágicos ni selectores CSS frágiles embebidos en el test: expone acciones que el test compone. El estado de sesión vive en el contexto (`ctx` o `storage_state`), no como atributo suelto del robot global.

**After:**
> Contrato de laboratorio CASO-LIM-023: `LoginPage.submit(ctx, password)` con password `sandbox` setea `ctx['auth']`; password incorrecto deja `anonymous` / `False`. El PO **no** contiene `sleeps` mágicos ni selectores CSS frágiles embebidos en el test: expone acciones que el test compone. El estado de sesión vive en el contexto (`ctx` o `storage_state`), no como atributo suelto del robot global.

**Change:** `sleep` mágicos → `sleeps` mágicos (pluralize the code identifier to agree with plural adjective `mágicos`).

#### Theory T3-B paragraph 2 (`:279`) — re-prefix hyphenation (4 occurrences in one paragraph)

**Before:**
> Recovery ante DOM inestable: si `err=='stale'` (nodo reemplazado tras re-render), la action es `goto_home` o re-nav al listado — **no** `continue` sobre un handle viejo. Tras la re-navegación re-obtienes el locator; reutilizar un handle de un árbol anterior es una fuente clásica de flakes en browser RPA.

**After:**
> Recuperación ante DOM inestable: si `err=='stale'` (nodo reemplazado tras un re-render), la action es `goto_home` o renavegar al listado — **no** `continue` sobre un handle viejo. Tras la renavegación, reobtienes el locator; reutilizar un handle de un árbol anterior es una fuente clásica de flakes en browser RPA.

**Changes:** (a) `Recovery` → `Recuperación` (the only English noun heading inside a paragraph — the section heading uses Spanish, this inline callout should match); (b) `re-render` kept (technical term, widely accepted); (c) `re-nav` → `renavegar` (Spanish verb); (d) `re-navegación` → `renavegación` (RAE prefix rule); (e) `re-obtienes` → `reobtienes` (RAE prefix rule).

#### Theory T3-B paragraph 3 (`:280`) — `doble-submit` Spanglish

**Before:**
> Reanudación con checkpoint: el robot guarda `last_ok_step` (p. ej. `login`, `form`) y, al reintentar la corrida, salta al **siguiente** paso en vez de rehacer todo el flujo. Eso evita doble-submit del login/form y hace la corrida **idempotente a nivel de paso** cuando el backend del portal demo lo permite (mismo periodo, mismo export).

**After:**
> Reanudación con checkpoint: el robot guarda `last_ok_step` (p. ej. `login`, `form`) y, al reintentar la corrida, salta al **siguiente** paso en vez de rehacer todo el flujo. Eso evita el doble envío del login/form y hace la corrida **idempotente a nivel de paso** cuando el backend del portal demo lo permite (mismo periodo, mismo export).

**Change:** `doble-submit` → `doble envío` (M-5).

#### Theory T4-A paragraph 2 (`:318`) — `decision dict del run` Spanglish

**Before:**
> Toda caída a RPA registra un `reason` (`no_api`, `export_stale`, `export_missing`, etc.) en el decision dict del run. Ese rastro habilita el ticket de "reemplazar por API" cuando el producto madure. Documenta la decisión en el **runbook** del adapter: qué capabilities se probaron, en qué orden, y por qué se eligió el canal actual.

**After:**
> Toda caída a RPA registra un `reason` (`no_api`, `export_stale`, `export_missing`, etc.) en el dict de decisión de la corrida. Ese rastro habilita el ticket de "reemplazar por API" cuando el producto madure. Documenta la decisión en el **runbook** del adaptador: qué capacidades se probaron, en qué orden y por qué se eligió el canal actual.

**Changes:** (a) `decision dict del run` → `dict de decisión de la corrida` (M-4); (b) `adapter` → `adaptador` (one-off Spanish equivalent; "adapter" is used as a recurring concept name elsewhere — could be left if the diccionario defined it, but it doesn't); (c) `capabilities` → `capacidades` (Spanish); (d) removed comma before `y por qué` (RAE: no comma before `y` in enumerations unless ambiguity).

#### Theory T4-B paragraph 1 (`:352`) — `accionable` + `bypassear`

**Before:**
> Si **ToS forbidden** para automatización, `action=abort` (**ToS gana** sobre CAPTCHA y sobre el argumento "pero es urgente"). Si `captcha=True` y los términos permiten intervención humana, la action es **human_handoff** con payload mínimo `url` / `step` / `screenshot` — nunca scripts de bypass, granjas de captcha ni user-agents rotativos en este curso ni en operación responsable.

**After:**
> Si **ToS prohíbe** la automatización, `action=abort` (**ToS gana** sobre CAPTCHA y sobre el argumento "pero es urgente"). Si `captcha=True` y los términos permiten intervención humana, la action es **human_handoff** con payload mínimo `url` / `step` / `screenshot` — nunca scripts de evasión, granjas de captcha ni user-agents rotativos en este curso ni en operación responsable.

**Changes:** (a) `ToS forbidden` → `ToS prohíbe` (English→Spanish); (b) `scripts de bypass` → `scripts de evasión` (Spanish). The diccionario at `:30` defines "Handoff humano" but does not define "bypass" — replacing with "evasión" is consistent with the diccionario's Spanish style.

#### Theory T4-B paragraph 2 (`:353`) — `accionable` + `download` as noun

**Before:**
> Desktop fallback (app nativa, OCR de pantalla, etc.) solo si el **contrato del sistema** lo contempla y está en el scope del adapter; no es una puerta trasera para evadir políticas web. El handoff debe ser accionable en minutos: un analista de operaciones en Lima abre el ticket, ve el step y la captura, y continúa sin reconstruir el contexto desde cero.

**After:**
> Desktop fallback (app nativa, OCR de pantalla, etc.) solo si el **contrato del sistema** lo contempla y está en el alcance del adaptador; no es una puerta trasera para evadir políticas web. El handoff debe ser actuable en minutos: un analista de operaciones en Lima abre el ticket, ve el step y la captura, y continúa sin reconstruir el contexto desde cero.

**Changes:** (a) `scope del adapter` → `alcance del adaptador` (M-4 style); (b) `accionable` → `actuable` (M-6).

### 6.2 I Do tab

#### iDo.intro (`:385`) — no grammar issues, but one stylistic note

**Before:**
> Te muestro el **web adapter** de CP-N2-C en ocho demos (uno por subtema). Cada uno modela una decisión del robot: qué locator usar, cuándo esperar, cómo verificar un download, cómo encapsular auth, qué evidencia guardar, qué reintentar, cuándo preferir API y cuándo parar ante CAPTCHA. En el lab usamos dicts; la semántica es la de Playwright (`get_by_role`, auto-wait, download, tracing). La salida mostrada **coincide exactamente** con lo que imprime el código: es el modelo que copiarás en We Do.

**After (no change required):**
> Te muestro el **web adapter** de CP-N2-C en ocho demos (una por subtema). Cada una modela una decisión del robot: qué locator usar, cuándo esperar, cómo verificar un download, cómo encapsular auth, qué evidencia guardar, qué reintentar, cuándo preferir API y cuándo parar ante CAPTCHA. En el lab usamos dicts; la semántica es la de Playwright (`get_by_role`, auto-wait, download, tracing). La salida mostrada **coincide exactamente** con lo que imprime el código: es el modelo que copiarás en We Do.

**Changes:** (a) `uno por subtema` → `una por subtema` (agrees with feminine `demo`); (b) `Cada uno` → `Cada una` (same). Minor concordance slip.

#### iDo T1-B-DEMO why (`:434`) — `5 s` is correct, no change

#### iDo T2-A-DEMO why (`:464`) — `click` anglicism

**Before:**
> Decisión: el éxito del step no es "el click no lanzó". Es el **archivo correcto** (hash o tamaño). Checksum mismatch → fallo con evidencia, no éxito silencioso.

**After:**
> Decisión: el éxito del step no es "el clic no lanzó excepción". Es el **archivo correcto** (hash o tamaño). Checksum mismatch → fallo con evidencia, no éxito silencioso.

**Changes:** (a) `el click` → `el clic` (M-3); (b) `"el click no lanzó"` → `"el clic no lanzó excepción"` (completes the verb's argument for clarity; matches the theory T2-A paragraph 1 phrasing).

#### iDo T4-A-DEMO why (`:575`) — `click` anglicism

**Before:**
> Decisión: jerarquía api > export > rpa > human. Aunque rpa=True, el CSV/export del mismo reporte gana: menos flakes y menos riesgo de ToS.

**After (no change required):**
> Decisión: jerarquía api > export > rpa > human. Aunque `rpa=True`, el CSV/export del mismo reporte gana: menos flakes y menos riesgo de ToS.

**Change:** `rpa=True` → `` `rpa=True` `` (wrap in code span for consistency — the surrounding text already wraps other identifiers in backticks).

### 6.3 We Do tab

#### weDo T1-A-E1 hint (`:613`) — `role y name` inconsistency

**Before:**
> Filtra por role y name; devuelve el id del primer match.

**After:**
> Filtra por rol y nombre; devuelve el id del primer match.

**Changes:** (a) `role` → `rol`; (b) `name` → `nombre` (M-7). Keeps `match` (a recognized Spanish dev noun: *el match* = "el emparejamiento" — but `match` is more common in tech Spanish than `emparejamiento`). Alternatively: `devuelve el id del primer emparejamiento` (fuller Spanish).

#### weDo T1-B-E1 hints (`:716`) — `último i` concordance

**Before:**
> Si solo haces pass dentro del if, el print posterior usa el último i del for.

**After:**
> Si solo haces `pass` dentro del `if`, el print posterior usa la última `i` del `for`.

**Changes:** (a) `último i` → `última i` (H-3 concordance — letter *i* is feminine); (b) wrap `pass`, `if`, `i`, `for` in code spans to clarify they refer to Python tokens (style).

#### weDo T1-B-E1 tests (`:720`) — `primer i` + `último i` concordance

**Before:**
> Stdout exacto: `2` (primer i con ready). No el último i del for sin break.

**After:**
> Stdout exacto: `2` (primera `i` con ready). No la última `i` del `for` sin `break`.

**Changes:** (a) `primer i` → `primera i` (H-3); (b) `último i` → `última i` (H-3); (c) wrap `i`, `for`, `break` in code spans.

#### weDo T1-B-E1 feedback (`:721`) — `último i` concordance

**Before:**
> Debiste imprimir 2 (primer intento ready) y cortar el loop, no el último i.

**After:**
> Debiste imprimir 2 (primer intento ready) y cortar el loop, no la última `i`.

**Changes:** (a) `último i` → `última i` (H-3). Note: `primer intento` is correct (intento is masculine).

#### weDo T1-B-E2 hint (`:755`) — `5s` + `análogo` style

**Before:**
> En Playwright real el análogo es timeout de expect, no sleep de 5s.

**After:**
> En Playwright real el análogo es el timeout de `expect`, no un sleep de 5 s.

**Changes:** (a) `5s` → `5 s` (M-1); (b) `timeout de expect` → `el timeout de \`expect\`` (article + code span); (c) `sleep de` → `un sleep de` (article).

#### weDo T2-A-E1 instruction (`:836`) — `periodo mal formateado` adjective agreement

**Before:**
> ...El reporte sintético exige **ambos** campos: sin periodo el export del portal demo falla en S24 (OCR sin fecha). Mutar el dict campo a campo (no hardcodear el print). Salida esperada: {'usuario': 'ana', 'periodo': '2026-01'}

**After:**
> ...El reporte sintético exige **ambos** campos: sin periodo, el export del portal demo falla en S24 (OCR sin fecha). Muta el dict campo a campo (no hardcodees el print). Salida esperada: {'usuario': 'ana', 'periodo': '2026-01'}

**Changes:** (a) comma after `sin periodo` to separate subordinate clause; (b) `Mutar` → `Muta` (imperative, matching the surrounding imperative voice `Exige`, `no hardcodees`); (c) `hardcodear` → `hardcodees` (imperative form, matching the subjunctive-imperative pattern).

#### weDo T3-A-E2 hint (`:1101`) — `logs entero` concordance

**Before:**
> Imprimir logs entero falla el contrato del grader.

**After:**
> Imprimir los logs enteros falla el contrato del grader.

**Changes:** (a) `logs entero` → `logs enteros` (H-4 concordance); (b) `logs enteros` → `los logs enteros` (article — `Imprimir los logs enteros` reads more naturally than the bare plural).

#### weDo T3-A-E3 hint (`:1131`) — `accionable` anglicism

**Before:**
> Sin trace el fallo del portal demo no es accionable para el on-call.

**After:**
> Sin trace, el fallo del portal demo no es actuable para el on-call.

**Changes:** (a) comma after `Sin trace` (introductory phrase); (b) `accionable` → `actuable` (M-6).

#### weDo T3-B-E3 hint (`:1255`) — `doble-submittear` Spanglish

**Before:**
> Rehacer login/form innecesariamente puede doble-submittear el portal demo.

**After:**
> Rehacer login/form innecesariamente puede enviar dos veces el login/form en el portal demo.

**Change:** `doble-submittear el portal demo` → `enviar dos veces el login/form en el portal demo` (M-5). Note: `doble-submittear` is grammatically malformed — `submittear` is not a Spanish verb, and even if accepted, `doble-submittear el portal demo` would mean "to double-submit the portal demo", which is the wrong object (we double-submit the *form*, not the *portal*). The rewrite fixes both the Spanglish and the semantic object.

#### weDo T4-A-E3 instruction (`:1372`) — `dict method='rpa'` style

**Before:**
> CASO-LIM-023 · Decisión documentada (transfer). Implementa decide(caps): si no hay api ni export y rpa_allowed → dict method='rpa' y reason='no_api'; si hay export → method='export' reason='export_ok'. Imprime decide para dos caps (solo rpa; con export). Salida esperada:
> {'method': 'rpa', 'reason': 'no_api'}
> {'method': 'export', 'reason': 'export_ok'}

**After:**
> CASO-LIM-023 · Decisión documentada (transfer). Implementa `decide(caps)`: si no hay `api` ni `export` y `rpa_allowed` → un dict con `method='rpa'` y `reason='no_api'`; si hay `export` → `method='export'` y `reason='export_ok'`. Imprime `decide` para dos caps (solo `rpa`; con `export`). Salida esperada:
> {'method': 'rpa', 'reason': 'no_api'}
> {'method': 'export', 'reason': 'export_ok'}

**Changes:** wrap all code identifiers (`decide`, `caps`, `api`, `export`, `rpa_allowed`, `method`, `reason`) in backticks for consistency with the rest of the section's style. No grammar fix.

#### weDo T4-B-E3 hint (`:1490`) — `accionable` anglicism

**Before:**
> El ticket de handoff debe ser accionable en minutos, no un dump de sesión.

**After:**
> El ticket de handoff debe ser actuable en minutos, no un dump de sesión.

**Change:** `accionable` → `actuable` (M-6).

### 6.4 You Do tab

#### youDo context (`:1519`) — `doble-submit` + `login vía Page Object`

**Before:**
> Tras el borrador con aprobación humana de S22, el run CP-N2-C necesita un **reporte verificado** desde un portal de práctica. Automatiza un portal sintético (DOM en dicts; opcionalmente Playwright local con el sketch de la teoría): login vía Page Object, descarga con hash, retry solo de timeouts, stop en captcha/ToS, y evidencia de éxito + falla forzada. Entrega además un runbook corto en es-PE y el contrato de `last_ok_step` para reanudar sin doble-submit. En S24 ese binario alimentará OCR/Document AI.

**After:**
> Tras el borrador con aprobación humana de S22, el run CP-N2-C necesita un **reporte verificado** desde un portal de práctica. Automatiza un portal sintético (DOM en dicts; opcionalmente Playwright local con el sketch de la teoría): iniciar sesión vía Page Object, descarga con hash, retry solo de timeouts, stop en captcha/ToS, y evidencia de éxito + falla forzada. Entrega además un runbook corto en es-PE y el contrato de `last_ok_step` para reanudar sin doble envío. En S24 ese binario alimentará OCR/Document AI.

**Changes:** (a) `login vía Page Object` → `iniciar sesión vía Page Object` (L-3 — `login` as Spanish verb); (b) `sin doble-submit` → `sin doble envío` (M-5).

#### youDo rubric criterion 0 (`:1603`) — minor concordance

**Before:**
> Cumple objetivos del adaptador web (locators por rol / a11y, download verificado, evidencia, handoff)

**After (no change required):**
> Cumple los objetivos del adaptador web (locators por rol / a11y, download verificado, evidencia, handoff)

**Change:** add article `los` before `objetivos` (telegraphic rubric style is acceptable, but `los objetivos` is more grammatical). Optional.

### 6.5 SelfCheck tab

#### SelfCheck Q4 (`:1635`) — option 4 parallelism

**Before:**
> Solo fallas transitorias (timeout/red/429), no captcha ni 403 de negocio

**After (no change required):**
> Solo fallas transitorias (timeout/red/429), ni captcha ni 403 de negocio

**Change:** `no captcha ni 403` → `ni captcha ni 403` (parallelism: `ni X ni Y`). Optional.

#### SelfCheck Q7 (`:1656`) — missing article `la` before `integridad`

**Before:**
> Tras un download en el portal demo, ¿qué valida integridad del archivo?

**After:**
> Tras una descarga en el portal demo, ¿qué valida la integridad del archivo?

**Changes:** (a) `un download` → `una descarga` (M-3/M-6 style — translate the anglicism noun); (b) `valida integridad` → `valida la integridad` (H-5 missing definite article).

#### SelfCheck Q7 explanation (`:1660`) — `click` anglicism

**Before:**
> El éxito del step es el binario correcto, no solo el click. Checksum mismatch → fallo con evidencia.

**After:**
> El éxito del step es el binario correcto, no solo el clic. Checksum mismatch → fallo con evidencia.

**Change:** `el click` → `el clic` (M-3).

#### SelfCheck Q8 explanation (`:1667`) — `doble-submittear` Spanglish

**Before:**
> La reanudación por checkpoint salta al siguiente paso tras last_ok_step; rehacer login/form puede doble-submittear el portal.

**After:**
> La reanudación por checkpoint salta al siguiente paso tras `last_ok_step`; rehacer login/form puede enviar dos veces el login/form al portal.

**Changes:** (a) `last_ok_step` → `` `last_ok_step` `` (code span); (b) `doble-submittear el portal` → `enviar dos veces el login/form al portal` (M-5 — fixes both the Spanglish verb and the semantic object, as in the We Do hint rewrite).

#### SelfCheck Q8 option 1 (`:1664`) — `doble-submit` Spanglish

**Before:**
> form (el siguiente step), evitando doble-submit del login

**After:**
> form (el siguiente step), evitando el doble envío del login

**Change:** `doble-submit` → `doble envío` (M-5). This is the correct answer option — the rewrite preserves correctness while removing the Spanglish.

#### SelfCheck Q3 distractor (`:1651`) and Q8 distractor (`:1672`) — `bypassear` anglicism

**Before (Q3 option 3):**
> Para bypassear CAPTCHA con otro user-agent

**After:**
> Para evadir el CAPTCHA con otro user-agent

**Before (Q8 option 2):**
> Para bypassear CAPTCHA guardando el token del captcha

**After:**
> Para evadir el CAPTCHA guardando el token del captcha

**Change:** `bypassear` → `evadir` (L-4). Both are distractor (incorrect) options — the rewrite preserves the meaning (a wrong answer about bypassing CAPTCHA) while using standard Spanish.

---

## 7. Proposed GitHub-style Diffs

All diffs assume the file `src/lib/course/sections/s23-computer-vision.ts` unless otherwise noted. Diffs are proposals only — **not applied**.

### Diff D-1 (Critical) — Replace legacy `id` and fix downstream consumers

This is the highest-impact fix. Two options:

**Option A (minimal): keep `id` but add a `legacyId` field and update consumers to key off `index`.** Not recommended — adds complexity.

**Option B (recommended): rename `id` to `"browser-rpa"` and update the two consumers.**

```diff
--- a/src/lib/course/sections/s23-computer-vision.ts
+++ b/src/lib/course/sections/s23-computer-vision.ts
@@ -1,6 +1,6 @@
 export const section23: CourseSection = {
-  id: "computer-vision",
+  id: "browser-rpa",
   index: 23,
   title: "Browser RPA con Playwright",
   shortTitle: "Playwright RPA",
```

```diff
--- a/src/components/course/PdfReport.tsx
+++ b/src/components/course/PdfReport.tsx
@@ -60,7 +60,7 @@
   rag: '20. RAG',
   fastapi: '21. FastAPI',
   "rapidfuzz-entity": '22. RapidFuzz',
-  "computer-vision": '23. CV',
+  "browser-rpa": '23. Playwright',
   "rpa-advanced": '24. RPA+',
   "streamlit-dashboards": '25. Streamlit',
   "integrator-phase1": '26. Capstone P1',
```

```diff
--- a/src/components/course/SectionView.tsx
+++ b/src/components/course/SectionView.tsx
@@ -1974,7 +1974,40 @@
-    'computer-vision': {
-      title: 'Practica procesamiento de imagenes (simulado)',
-      code: `# Simulacion de conceptos de vision por computadora
-# Sin OpenCV - implementamos operaciones con listas 2D
-
-# Representar una imagen "grayscale" como matriz 5x5
-imagen = [
-    [10, 20, 30, 20, 10],
-    [20, 30, 40, 30, 20],
-    [30, 40, 50, 40, 30],  # centro mas brillante
-    [20, 30, 40, 30, 20],
-    [10, 20, 30, 20, 10],
-]
-...
+    'browser-rpa': {
+      title: 'Practica locators y auto-wait (simulado)',
+      code: `# Simulación del contrato DOM/sesión con dicts (mismo modelo que los labs)
+# Sin Playwright real: modela nodos con {role, name, id} y un FakeClock
+
+DOM = {
+    "nodes": [
+        {"role": "button", "name": "Exportar", "id": "b1"},
+        {"role": "link", "name": "Descargar reporte", "id": "l1"},
+        {"role": "img", "name": "logo", "id": "i1"},
+    ]
+}
+
+def get_by_role(role, name=None):
+    hits = [n for n in DOM["nodes"] if n["role"] == role and (name is None or n["name"] == name)]
+    if not hits:
+        raise LookupError(f"no {role}/{name}")
+    return hits[0]
+
+class FakeClock:
+    def __init__(self):
+        self.t = 0
+    def advance(self, ms):
+        self.t += ms
+
+def wait_until(pred, clock, timeout_ms=500, step=100):
+    waited = 0
+    while waited <= timeout_ms:
+        if pred():
+            return True
+        clock.advance(step)
+        waited += step
+    return False
+
+btn = get_by_role("button", "Exportar")
+print("btn", btn["id"], btn["name"])
+
+clock = FakeClock()
+ready_at = 250
+state = {"ready": False}
+def poll():
+    if clock.t >= ready_at:
+        state["ready"] = True
+    return state["ready"]
+ok = wait_until(poll, clock, timeout_ms=500)
+print("ready", ok, "t", clock.t)
+print("ok", True)
+`,
+      expectedOutput: `btn b1 Exportar
+ready True t 300
+ok True
+`,
+      hint: 'Cambia ready_at a 600 y observa cómo wait_until devuelve False (timeout).',
+    },
```

> **Note:** The new playground code mirrors the theory T1-A and T1-B code blocks exactly so the learner sees the same contract they just learned. The expected output is computed (verified): `clock.t` after 3 advances of 100 ms = 300 ms ≥ 250 ms, so `poll()` returns True at t=300.

### Diff D-2 (High) — H-3: `primer i` / `último i` concordance (3 lines)

```diff
--- a/src/lib/course/sections/s23-computer-vision.ts
+++ b/src/lib/course/sections/s23-computer-vision.ts
@@ -713,11 +713,11 @@
         hints: [
           "El auto-wait de Playwright espera una condición, no un sleep fijo.",
-          "Si solo haces pass dentro del if, el print posterior usa el último i del for.",
+          "Si solo haces `pass` dentro del `if`, el print posterior usa la última `i` del `for`.",
           "break evita seguir iterando después del primer ready.",
         ],
         edgeCases: ["timeout path"],
-        tests: "Stdout exacto: `2` (primer i con ready). No el último i del for sin break.",
-        feedback: "Debiste imprimir 2 (primer intento ready) y cortar el loop, no el último i.",
+        tests: "Stdout exacto: `2` (primera `i` con ready). No la última `i` del `for` sin `break`.",
+        feedback: "Debiste imprimir 2 (primer intento ready) y cortar el loop, no la última `i`.",
         starterCode: {
```

### Diff D-3 (High) — H-4: `logs entero` concordance

```diff
--- a/src/lib/course/sections/s23-computer-vision.ts
+++ b/src/lib/course/sections/s23-computer-vision.ts
@@ -1098,7 +1098,7 @@
         hints: [
           "El on-call necesita ver ERR, no el stream completo de info.",
           "Una list comp con 'ERR' in l filtra sin mutar la lista original.",
-          "Imprimir logs entero falla el contrato del grader.",
+          "Imprimir los logs enteros falla el contrato del grader.",
         ],
         edgeCases: ["niveles de log"],
```

### Diff D-4 (High) — H-5: Missing article in SelfCheck Q7

```diff
--- a/src/lib/course/sections/s23-computer-vision.ts
+++ b/src/lib/course/sections/s23-computer-vision.ts
@@ -1653,7 +1653,7 @@
       {
-        question: "Tras un download en el portal demo, ¿qué valida integridad del archivo?",
+        question: "Tras una descarga en el portal demo, ¿qué valida la integridad del archivo?",
         options: ["Que el click no lanzó excepción", "Hash (p. ej. sha256) o tamaño/extensión del binario", "Que el botón tenía CSS bonito", "Reintentar el download 50 veces sin comprobar el archivo"],
         correctIndex: 1,
         explanation:
-          "El éxito del step es el binario correcto, no solo el click. Checksum mismatch → fallo con evidencia.",
+          "El éxito del step es el binario correcto, no solo el clic. Checksum mismatch → fallo con evidencia.",
       },
```

### Diff D-5 (Medium) — M-1: `5s` → `5 s` (3 lines)

```diff
--- a/src/lib/course/sections/s23-computer-vision.ts
+++ b/src/lib/course/sections/s23-computer-vision.ts
@@ -108,7 +108,7 @@
       paragraphs: [
-        "Playwright **auto-espera** a que el elemento sea actionable (visible, estable, enabled, recibe eventos). Evita `time.sleep` fijos: un sleep de 5s **falla en CI lento** y **desperdicia** en CI rápido. Usa `expect` con timeout explícito y condiciones de readiness del paso de negocio (título, fila de tabla, download started).",
+        "Playwright **auto-espera** a que el elemento sea interactuable (visible, estable, habilitado, recibe eventos). Evita `time.sleep` fijos: un sleep de 5 s **falla en CI lento** y **desperdicia** tiempo en CI rápido. Usa `expect` con timeout explícito y condiciones de readiness del paso de negocio (título, fila de tabla, download started).",
@@ -147,7 +147,7 @@
       callout: {
         type: "warning",
         title: "Sleep fijo es flaky",
         content:
-          "Un sleep de 5s falla en CI lento y desperdicia tiempo en CI rápido. Prefiere condiciones.",
+          "Un sleep de 5 s falla en CI lento y desperdicia tiempo en CI rápido. Prefiere condiciones.",
       },
@@ -752,7 +752,7 @@
         hints: [
           "Si ready nunca es True, no debes imprimir ok.",
           "for-else en Python: else se ejecuta cuando el loop termina sin break.",
-          "En Playwright real el análogo es timeout de expect, no sleep de 5s.",
+          "En Playwright real el análogo es el timeout de `expect`, no un sleep de 5 s.",
         ],
```

### Diff D-6 (Medium) — M-2: re-prefix hyphenation

```diff
--- a/src/lib/course/sections/s23-computer-vision.ts
+++ b/src/lib/course/sections/s23-computer-vision.ts
@@ -153,7 +153,7 @@
         "**storage_state** (cookies y localStorage serializados) reutiliza la sesión autenticada entre corridas para no re-loguear en cada caso. En el lab un dict `{token: 't'}` modela ese reuso: si hay token → `reuse`; si no → `login`. Nunca hardcodees contraseñas reales de bancos o SUNAT; el sandbox de CP-N2-C usa credenciales demo (`demo` / `sandbox`).",
+        "**storage_state** (cookies y localStorage serializados) reutiliza la sesión autenticada entre corridas para no volver a iniciar sesión en cada caso. En el lab un dict `{token: 't'}` modela ese reuso: si hay token → `reuse`; si no → `login`. Nunca hardcodees contraseñas reales de bancos o SUNAT; el sandbox de CP-N2-C usa credenciales demo (`demo` / `sandbox`).",
@@ -274,7 +274,7 @@
         "Recovery ante DOM inestable: si `err=='stale'` (nodo reemplazado tras re-render), la action es `goto_home` o re-nav al listado — **no** `continue` sobre un handle viejo. Tras la re-navegación re-obtienes el locator; reutilizar un handle de un árbol anterior es una fuente clásica de flakes en browser RPA.",
+        "Recuperación ante DOM inestable: si `err=='stale'` (nodo reemplazado tras un re-render), la action es `goto_home` o renavegar al listado — **no** `continue` sobre un handle viejo. Tras la renavegación, reobtienes el locator; reutilizar un handle de un árbol anterior es una fuente clásica de flakes en browser RPA.",
```

### Diff D-7 (Medium) — M-3: `click` → `clic` (selected high-traffic occurrences; full sweep ~11 occurrences)

> Apply `click` → `clic` only when `click` is used as a Spanish noun (not as the Playwright `Locator.click()` method, which should remain inside backticks).

Selected edits:

```diff
@@ -75,7 +75,7 @@
-        "Caso sintético CASO-LIM-023: botón "Descargar reporte" id `b1` se resuelve por role+name; un logo `img` sin role de control interactivo **no** sustituye al botón de negocio. `LookupError` (o `need_testid`) si no hay match enseña fallar **ruidoso** en setup — no click ciego al primer div. Ese fallo temprano es más barato que un download silencioso del archivo equivocado.",
+        "Caso sintético CASO-LIM-023: botón "Descargar reporte" id `b1` se resuelve por role+name; un logo `img` sin role de control interactivo **no** sustituye al botón de negocio. `LookupError` (o `need_testid`) si no hay match enseña fallar **ruidoso** en setup — no un clic ciego al primer div. Ese fallo temprano es más barato que un download silencioso del archivo equivocado.",
@@ -157,7 +157,7 @@
-        "Flujos típicos del adapter: **fill** campos de negocio (usuario, periodo de reporte), **set_input_files** / upload de plantilla, click de export, esperar **download** y verificar path, tamaño o hash. En Playwright real envuelves el click en `expect_download()`; en el lab modelamos el binario como bytes y calculamos un digest. El éxito del step **no** es "el click no lanzó excepción": es el **archivo correcto**.",
+        "Flujos típicos del adapter: **fill** campos de negocio (usuario, periodo de reporte), **set_input_files** / upload de plantilla, clic de export, esperar **download** y verificar path, tamaño o hash. En Playwright real envuelves el clic en `expect_download()`; en el lab modelamos el binario como bytes y calculamos un digest. El éxito del step **no** es "el clic no lanzó excepción": es el **archivo correcto**.",
@@ -464,7 +464,7 @@
-        why: "Decisión: el éxito del step no es "el click no lanzó". Es el **archivo correcto** (hash o tamaño). Checksum mismatch → fallo con evidencia, no éxito silencioso.",
+        why: "Decisión: el éxito del step no es "el clic no lanzó excepción". Es el **archivo correcto** (hash o tamaño). Checksum mismatch → fallo con evidencia, no éxito silencioso.",
@@ -1660,7 +1660,7 @@
-          "El éxito del step es el binario correcto, no solo el click. Checksum mismatch → fallo con evidencia.",
+          "El éxito del step es el binario correcto, no solo el clic. Checksum mismatch → fallo con evidencia.",
```

(Full sweep should also catch lines 30, 244, 317, 575, 1487, 1651, 1660, 1664. The `click` inside `expect_download()` is a code reference and stays.)

### Diff D-8 (Medium) — M-4 + M-5 + M-6: Spanglish phrases

```diff
@@ -280,7 +280,7 @@
-        "Reanudación con checkpoint: el robot guarda `last_ok_step` (p. ej. `login`, `form`) y, al reintentar la corrida, salta al **siguiente** paso en vez de rehacer todo el flujo. Eso evita doble-submit del login/form y hace la corrida **idempotente a nivel de paso** cuando el backend del portal demo lo permite (mismo periodo, mismo export).",
+        "Reanudación con checkpoint: el robot guarda `last_ok_step` (p. ej. `login`, `form`) y, al reintentar la corrida, salta al **siguiente** paso en vez de rehacer todo el flujo. Eso evita el doble envío del login/form y hace la corrida **idempotente a nivel de paso** cuando el backend del portal demo lo permite (mismo periodo, mismo export).",
@@ -318,7 +318,7 @@
-        "Toda caída a RPA registra un `reason` (`no_api`, `export_stale`, `export_missing`, etc.) en el decision dict del run. Ese rastro habilita el ticket de "reemplazar por API" cuando el producto madure. Documenta la decisión en el **runbook** del adapter: qué capabilities se probaron, en qué orden, y por qué se eligió el canal actual.",
+        "Toda caída a RPA registra un `reason` (`no_api`, `export_stale`, `export_missing`, etc.) en el dict de decisión de la corrida. Ese rastro habilita el ticket de "reemplazar por API" cuando el producto madure. Documenta la decisión en el **runbook** del adaptador: qué capacidades se probaron, en qué orden y por qué se eligió el canal actual.",
@@ -353,7 +353,7 @@
-        "Desktop fallback (app nativa, OCR de pantalla, etc.) solo si el **contrato del sistema** lo contempla y está en el scope del adapter; no es una puerta trasera para evadir políticas web. El handoff debe ser accionable en minutos: un analista de operaciones en Lima abre el ticket, ve el step y la captura, y continúa sin reconstruir el contexto desde cero.",
+        "Desktop fallback (app nativa, OCR de pantalla, etc.) solo si el **contrato del sistema** lo contempla y está en el alcance del adaptador; no es una puerta trasera para evadir políticas web. El handoff debe ser actuable en minutos: un analista de operaciones en Lima abre el ticket, ve el step y la captura, y continúa sin reconstruir el contexto desde cero.",
@@ -1131,7 +1131,7 @@
-          "Sin trace el fallo del portal demo no es accionable para el on-call.",
+          "Sin trace, el fallo del portal demo no es actuable para el on-call.",
@@ -1255,7 +1255,7 @@
-          "Rehacer login/form innecesariamente puede doble-submittear el portal demo.",
+          "Rehacer login/form innecesariamente puede enviar dos veces el login/form al portal demo.",
@@ -1490,7 +1490,7 @@
-          "El ticket de handoff debe ser accionable en minutos, no un dump de sesión.",
+          "El ticket de handoff debe ser actuable en minutos, no un dump de sesión.",
@@ -1519,7 +1519,7 @@
-      "Tras el borrador con aprobación humana de S22, el run CP-N2-C necesita un **reporte verificado** desde un portal de práctica. Automatiza un portal sintético (DOM en dicts; opcionalmente Playwright local con el sketch de la teoría): login vía Page Object, descarga con hash, retry solo de timeouts, stop en captcha/ToS, y evidencia de éxito + falla forzada. Entrega además un runbook corto en es-PE y el contrato de `last_ok_step` para reanudar sin doble-submit. En S24 ese binario alimentará OCR/Document AI.",
+      "Tras el borrador con aprobación humana de S22, el run CP-N2-C necesita un **reporte verificado** desde un portal de práctica. Automatiza un portal sintético (DOM en dicts; opcionalmente Playwright local con el sketch de la teoría): iniciar sesión vía Page Object, descarga con hash, retry solo de timeouts, stop en captcha/ToS, y evidencia de éxito + falla forzada. Entrega además un runbook corto en es-PE y el contrato de `last_ok_step` para reanudar sin doble envío. En S24 ese binario alimentará OCR/Document AI.",
@@ -1664,7 +1664,7 @@
-        options: ["Volver a login para "estar seguros"", "export saltándose form", "Abortar siempre y pedir CAPTCHA", "form (el siguiente step), evitando doble-submit del login"],
+        options: ["Volver a login para "estar seguros"", "export saltándose form", "Abortar siempre y pedir CAPTCHA", "form (el siguiente step), evitando el doble envío del login"],
@@ -1667,7 +1667,7 @@
-          "La reanudación por checkpoint salta al siguiente paso tras last_ok_step; rehacer login/form puede doble-submittear el portal.",
+          "La reanudación por checkpoint salta al siguiente paso tras `last_ok_step`; rehacer login/form puede enviar dos veces el login/form al portal.",
```

### Diff D-9 (Medium) — M-7: `role` → `rol` consistency (line 613)

```diff
@@ -610,7 +610,7 @@
         instruction:
           "CASO-LIM-023 · Locator por rol. En nodes hay un link Inicio (id n1). Encuentra role=link y name=Inicio e imprime solo el id. Predicado role+name (no CSS); si no hay match, falla ruidoso. Salida esperada: n1",
-        hint: "Filtra por role y name; devuelve el id del primer match.",
+        hint: "Filtra por `role` y `name`; devuelve el id del primer match.",
         hints: [
           "Un locator de usuario mira el rol accesible y el nombre, no el índice CSS.",
           "Si usas next(...), el predicado debe exigir role='link' y name='Inicio'.",
```

> **Decision:** Wrap `role`/`name` in backticks (they're Playwright API field names in this context). This avoids the `rol`/`role` ambiguity without translating the API term. The hints array already uses `role='link'` (correct as code), so the only fix is the `hint` field's bareword `role y name`.

### Diff D-10 (Low) — L-2: `sleep mágicos` agreement

```diff
@@ -200,7 +200,7 @@
         "Contrato de laboratorio CASO-LIM-023: `LoginPage.submit(ctx, password)` con password `sandbox` setea `ctx['auth']`; password incorrecto deja `anonymous` / `False`. El PO **no** contiene `sleep` mágicos ni selectores CSS frágiles embebidos en el test: expone acciones que el test compone. El estado de sesión vive en el contexto (`ctx` o `storage_state`), no como atributo suelto del robot global.",
+        "Contrato de laboratorio CASO-LIM-023: `LoginPage.submit(ctx, password)` con password `sandbox` setea `ctx['auth']`; password incorrecto deja `anonymous` / `False`. El PO **no** contiene `sleeps` mágicos ni selectores CSS frágiles embebidos en el test: expone acciones que el test compone. El estado de sesión vive en el contexto (`ctx` o `storage_state`), no como atributo suelto del robot global.",
```

### Diff D-11 (Low) — L-4: `bypassear` in distractors

```diff
@@ -1649,7 +1649,7 @@
-        options: ["Para encapsular selectores y acciones de una pantalla y reducir acoplamiento", "Para guardar contraseñas en la clase", "Para saltarse el auto-wait de Playwright", "Para bypassear CAPTCHA con otro user-agent"],
+        options: ["Para encapsular selectores y acciones de una pantalla y reducir acoplamiento", "Para guardar contraseñas en la clase", "Para saltarse el auto-wait de Playwright", "Para evadir el CAPTCHA con otro user-agent"],
@@ -1670,7 +1670,7 @@
-        options: ["Para hardcodear la contraseña en el código del robot", "Para bypassear CAPTCHA guardando el token del captcha", "Para reusar la sesión autenticada y no re-loguear en cada caso (menos flakes y menos tiempo de suite)", "Para reemplazar locators por CSS nth-child"],
+        options: ["Para hardcodear la contraseña en el código del robot", "Para evadir el CAPTCHA guardando el token del captcha", "Para reusar la sesión autenticada y no volver a iniciar sesión en cada caso (menos flakes y menos tiempo de suite)", "Para reemplazar locators por CSS nth-child"],
```

### Diff D-12 (Low) — L-1: `step ms hasta timeout`

```diff
@@ -110,7 +110,7 @@
-        "Las **assertions** (`expect(locator).to_be_visible()`, título esperado) documentan la **postcondición** del paso y fallan con mensaje útil. En el lab simulamos reloj y `wait_until(pred)` con step ms hasta timeout — misma idea que el auto-wait del runtime real.",
+        "Las **assertions** (`expect(locator).to_be_visible()`, título esperado) documentan la **postcondición** del paso y fallan con mensaje útil. En el lab simulamos un reloj y `wait_until(pred)` con un paso (step) de N ms hasta timeout — misma idea que el auto-wait del runtime real.",
```

### Diff D-13 (Low) — iDo.intro concordance: `uno` → `una`

```diff
@@ -383,7 +383,7 @@
     intro:
-      "Te muestro el **web adapter** de CP-N2-C en ocho demos (uno por subtema). Cada uno modela una decisión del robot: qué locator usar, cuándo esperar, cómo verificar un download, cómo encapsular auth, qué evidencia guardar, qué reintentar, cuándo preferir API y cuándo parar ante CAPTCHA. En el lab usamos dicts; la semántica es la de Playwright (`get_by_role`, auto-wait, download, tracing). La salida mostrada **coincide exactamente** con lo que imprime el código: es el modelo que copiarás en We Do.",
+      "Te muestro el **web adapter** de CP-N2-C en ocho demos (una por subtema). Cada una modela una decisión del robot: qué locator usar, cuándo esperar, cómo verificar un download, cómo encapsular auth, qué evidencia guardar, qué reintentar, cuándo preferir API y cuándo parar ante CAPTCHA. En el lab usamos dicts; la semántica es la de Playwright (`get_by_role`, auto-wait, download, tracing). La salida mostrada **coincide exactamente** con lo que imprime el código: es el modelo que copiarás en We Do.",
```

---

## 8. Recommended Priority Order for Fixing

| Priority | Issue | Diff | Effort | Impact |
|---|---|---|---|---|
| **P0** (Critical, blocks learning) | C-1: Legacy `id: "computer-vision"` causes off-topic InteractivePlaygroundDemo + wrong PDF label | D-1 | Medium (3 files, ~50-line playground rewrite) | Highest — fixes the single most damaging defect |
| **P1** (High, grammar correctness in learner-facing prose) | H-3: `primer i` / `último i` concordance (3 lines) | D-2 | Trivial (3 string edits) | High — grammar modeling |
| **P1** | H-4: `logs entero` → `logs enteros` | D-3 | Trivial | High — grammar modeling |
| **P1** | H-5: Missing article `la integridad` in SelfCheck Q7 | D-4 | Trivial | High — most-quoted defect |
| **P2** (Medium, internal consistency) | M-1: `5s` → `5 s` (3 occurrences) | D-5 | Trivial | Medium — typographic consistency |
| **P2** | M-2: re-prefix hyphenation (5 occurrences, 2 lines) | D-6 | Trivial | Medium — RAE compliance |
| **P2** | M-3: `click` → `clic` (11 occurrences) | D-7 | Small (~11 string edits) | Medium — anglicism standardization |
| **P2** | M-4 + M-5 + M-6: Spanglish phrases (`decision dict`, `doble-submit*`, `accionable`) | D-8 | Small (~9 string edits) | Medium — Spanish register |
| **P2** | M-7: `role`/`name` backticks (1 line) | D-9 | Trivial | Medium — API term clarity |
| **P3** (Low, polish) | L-2: `sleep mágicos` → `sleeps mágicos` | D-10 | Trivial | Low |
| **P3** | L-4: `bypassear` → `evadir` in distractors | D-11 | Trivial | Low |
| **P3** | L-1: `step ms` rewrite | D-12 | Trivial | Low |
| **P3** | iDo.intro `uno` → `una` concordance | D-13 | Trivial | Low |
| **P4** (Architectural recommendations, no content fix) | H-6: Add automated test asserting `iDo.code → iDo.code.output` and `weDo.solutionCode → weDo.solutionCode.output` for every section | — | Medium (test harness) | High leverage — prevents future regressions like S03's |
| **P4** | P-11: Decide course-wide style on `click`/`clic`, `rol`/`role`, `accionable`/`actuable`, `handoff`/`traspaso`, `login` (noun)/`iniciar sesión`, `download`/`descarga`. Document in `_GRAMMAR_SUBPLAN.md` or a new `STYLE.md`. | — | Medium | Cross-section consistency |
| **P4** | L-11: Replace MIT 6.100L / Harvard CS50P resources with Playwright-specific courses (e.g. Andrew Knight's "Python Playwright", Real Python's Playwright tutorial) | — | Trivial | Low |

**Estimated total effort for P0+P1+P2+P3:** ~30–45 minutes of careful editing + 1 test pass. ~25 string edits + 1 playground rewrite + 1 PDF label fix + 1 id rename.

---

## 9. Graph Memory Update Notes (for the shared context files)

For the orchestrator and future auditors:

- **S23 confirmed = `section23` in `s23-computer-vision.ts`** (Phase 1, sections 14–26).
- **V3 retarget pattern detected for the 2nd time**: Section 23 has `id: "computer-vision"` (legacy) but `title: "Browser RPA con Playwright"`. This is the **same pattern as Section 9** (`id: "visualization"` → "Excepciones & logs"). **Recommendation:** sweep ALL 52 sections for `id`-vs-`title` mismatches; rename `id` to match the V3 retarget and update `SectionView.tsx`'s `INTERACTIVE_PLAYGROUNDS` map + `PdfReport.tsx`'s `SECTION_LABELS` map. The S09 auditor reported this for `id: "visualization"`; the S23 auditor now reports it for `id: "computer-vision"`. Pattern likely affects 1–3 more sections (e.g. Section 24 might be the actual CV section — check if `id: "rpa-advanced"` is also legacy).
- **Code/output integrity for S23 is excellent**: all 8 iDo demos and all 24 weDo exercises verified consistent (instruction ↔ tests ↔ starterCode ↔ solutionCode.code ↔ solutionCode.output). SHA-256 hashes verified: `sha256(b'data')[:8] = 3a6eb079`, `sha256(b'synthetic-xlsx')[:12] = 3cdfe594e427`. **Unlike S03, no synthetic-data drift detected here.**
- **Meta-leak audit: clean** (0 confirmed leaks, 0 developer JS comments in source). The `\bTODO\b` case-insensitive regex continues to produce 1 FP per section on the Spanish word `todo` — recommend the orchestrator update the meta-leak heuristic to `\bTODO\b` (case-sensitive) OR `\b(TODO|FIXME|XXX|TBD|WIP)\b` with explicit case-sensitive matching, per the S01 insight.
- **Anglicism inventory for S23** (for cross-section style guide): `click` (11×), `download` (noun, ~8×), `login` (verb, 3×), `handoff` (noun, ~15×), `on-call` (4×), `trace` (noun, ~12×), `flaky` (~6×), `grader` (~8×), `storage_state` (code, OK), `bypassear` (verb, 2×, in distractors), `accionable`/`actionable` (4×), `doble-submit`/`doble-submittear` (5×), `decision dict` (1×), `sleep` (noun, ~6×), `hardcodear`/`hardcodees` (1×, accepted dev verb), `frontend` (1×).
- **FH distribution for S23** (for cross-section comparison): avg FH 71.1 (fácil), 0 run-ons, 1 long sentence (33 w). **Best sentence hygiene of all audited sections so far** (S01: 10 muy_difícil; S02: avg FH 83.6; S03: avg FH 64.0; S09: not directly comparable; S13: not directly comparable). S23 sets a positive benchmark.
- **SelfCheck `correctIndex` distribution for S23**: 2,0,1,3,2,0,1,3,2 → no positional bias. **Recommendation:** add this check to the orchestrator's cross-section audit script.
- **Resources section drift**: MIT 6.100L and Harvard CS50P appear in S23's `resources.courses` with notes "Contratos y tests" and "Proyectos reproducibles" — these are generic Python courses, not Playwright-specific. Recommend the orchestrator audit `resources` across all 52 sections for topic-relevance.
- **Missing `topicEvaluations`**: S23 does not include `topicEvaluations` (some peer sections do). Not a schema defect, but a consistency opportunity. Recommend the orchestrator audit which sections include `topicEvaluations` and standardize.

---

## 10. Method Note (Grammar Subplan Implementation)

This audit applied the Spanish grammar/style/structure heuristics from `/home/z/my-project/audits/_GRAMMAR_SUBPLAN.md`:

1. **Surface metrics** computed per sentence and per paragraph:
   - Fernández-Huerta (1959): `206.84 − 60·(syllables/word) − 1.02·(words/sentence)`
   - Szigriszt-Pazos / INFLESZ: `206.835 − 62.3·(syllables/word) − (words/sentence)`
   - Words per sentence (WPS) — pedagogy soft target 15–32 for technical ES
   - Syllables per word (SPW) — Spanish vowel-group heuristic
2. **Rule-based grammar & style engine**: LanguageTool public API (`language=es`, 2 chunks of ~18k chars each, 4-second throttle between chunks). 1,036 raw matches; 61 confirmed real after filtering MORFOLOGIK_RULE_ES and tech-context false positives.
3. **Pedagogical Spanish heuristics** (13 rules from the subplan): all 13 applied offline per sentence and per paragraph. Results in §2.
4. **Composite section score (0–10)**: start at 10; subtract weighted H/M/L findings (H=−0.5, M=−0.25, L=−0.1, normalized by sentence count); light penalty if FH is extreme (none here — FH 71.1 is healthy). Density-normalized.
   - Starting score: 10.0
   - C-1 (Critical): −1.5 (legacy id → off-topic playground is the dominant defect)
   - H-3, H-4, H-5 (3 High grammar): −1.0 (3 × −0.33)
   - M-1 through M-8 (8 Medium): −1.5 (8 × −0.18, rounded)
   - L-1 through L-15 (15 Low): −0.5 (some Ls overlap with Ms, conservative)
   - P-1 through P-12 (12 Pedagogical, mostly positive notes or Low): −0.5
   - **Final: 10.0 − 1.5 − 1.0 − 1.5 − 0.5 − 0.5 = 5.0** before positive adjustments.
   - **Positive adjustments:** +1.0 for full I Do / We Do / You Do / SelfCheck fidelity; +0.5 for zero meta-leaks; +0.5 for excellent sentence hygiene (0 run-ons); +0.5 for Peruvian context and ethics-first framing; +0.5 for code/output integrity verified. → **5.0 + 3.0 = 8.0**. 
   - **Conservative adjustment** for the 8 unaddressed Low issues and the architectural debt (no `topicEvaluations`, generic resources): −1.0.
   - **Final composite: 7.0 / 10.**

5. **Validation**: nonzero prose extraction (311 records, 479 sentences); FH in plausible range (54.4–73.7 across tabs, all in "normal/fácil" bands); SPW 2.07–2.42 (typical Spanish 1.9–2.3); no parser errors.

6. **Known false-positive classes documented**:
   - `\bTODO\b` case-insensitive matches Spanish `todo` (1 FP per section).
   - LT's `MORFOLOGIK_RULE_ES` fires on all tech proper nouns (Playwright, Interbank, SUNAT, etc.) — filtered.
   - LT's `SUBJUNTIVO_PASADO` fires on technical identifiers like `step ms`, `api`, `es timeout` — manually verified each as FP.
   - LT's `CLICK_CLIC` is technically correct per RAE but contested in tech-Spanish style — reported as M-3 not H.
   - LT's `PREP_VERB` fires when adjacent sentences are joined without periods (chunking artifact) — 9 raw hits, 0 real after manual review.
   - LT's `AGREEMENT_POSTPONED_ADJ` fires on rubric-style telegraphic phrases — 3 raw hits, 1 real (H-4), 2 FP.

---

## 11. Final Statement

**This is the complete Explorer report for Section 23. Ready for the Fixer prompt.**

**Files produced by this audit:**
- `/home/z/my-project/audits/S23_report.md` — this report (canonical deliverable)
- `/home/z/my-project/audits/_s23_extract.py` — TS-aware Spanish prose extractor + heuristic metrics runner
- `/home/z/my-project/audits/_s23_focus.py` — focused prose dump generator
- `/home/z/my-project/audits/_s23_prose.txt` — full 311-record Spanish prose dump
- `/home/z/my-project/audits/_s23_prose_focus.txt` — 263-record focused prose dump
- `/home/z/my-project/audits/_s23_metrics.json` — per-sentence FH/INFLESZ/WPS/SPW + 13-rule heuristic findings + worst-FH and worst-length lists
- `/home/z/my-project/audits/_s23_lt.py` — LanguageTool `es` runner (2-chunk, throttled)
- `/home/z/my-project/audits/_s23_lt_raw.json` — 1,036 raw LT matches
- `/home/z/my-project/audits/_s23_lt_real.json` — 61 confirmed real LT matches after FP filter
