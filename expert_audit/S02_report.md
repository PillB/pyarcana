# S02 — Curriculum Audit Report
**Section:** 02 · "Valores, tipos, operadores e I/O" (`shortTitle`: "Basics de Python")
**Audit agent:** Curriculum Auditor (general-purpose) — Stanford STORM + Graph/Loop/Harness Engineering
**Repo file audited:** `src/lib/course/sections/s02-basics.ts` (2,323 lines, ~6,113 prose words)
**Live site:** https://pillb.github.io/pyarcana/ (SPA; canonical learner-facing content is the TS data file imported by `SectionView.tsx`. All prose fields analyzed below — `jobRelevance`, `learningOutcomes`, `tagline`, `theory[].heading`/`paragraphs`/`callout.{title,content}`, `iDo.{intro,steps[].{description,why}}`, `weDo.{intro,steps[].{instruction,hint,hints,edgeCases,feedback,tests}}`, `youDo.{title,context,objectives,requirements,portfolioNote,rubric}`, `selfCheck.questions[].{question,options,explanation}`, `topicEvaluations[].{title,tasks[].deliverable,rubric_0_3.*}`, `resources.*.{label,note}` — are rendered verbatim to learners. Code/output/starterCode bodies were excluded from the Spanish-prose audit per the grammar subplan.)
**Grammar subplan applied:** `/home/z/my-project/audits/_GRAMMAR_SUBPLAN.md`
**Helper scanner:** `/home/z/my-project/audits/_s02_grammar.py` → JSON dump `/home/z/my-project/audits/_s02_grammar.json`

---

## 1. Section Identification & Scope

**Confirmed second section in course order.** In `src/lib/course/index.ts` the `COURSE_SECTIONS` array is ordered: `section01, section02, …` with the comment `// Phase 0 — Fundamentos (1-13)` on the preceding line. The second element is `section02`, imported from `./sections/s02-basics`. Its internal `index: 2` and `id: 'basics'` corroborate the position. **Section 2 = `s02-basics.ts` = "Valores, tipos, operadores e I/O".**

**Scope of content (rendered to learner):**

| Tab | Count / volume |
|---|---|
| Section meta | `title`, `shortTitle`, `tagline`, `jobRelevance` (~135 words), `estimatedHours: 18`, `level: Principiante`, `phase: 0`, 8 `learningOutcomes` |
| Theory (Teoría) | **8 sub-topics** (`S02-T1-A` through `S02-T4-B`), each with a `heading`, 2–3 prose `paragraphs`, a runnable Python code block (`code`+`output`), and a `callout` (`info`/`tip`/`warning`/`danger`/`success`). Total prose ≈ 1,650 words. |
| I Do (Demo) | `intro` (~80 words) + **8 demos** `S02-T1-A-DEMO`…`S02-T4-B-DEMO`, each with `description`, runnable `code`/`output`, and a `why` (~25–35 words each ≈ 250 words total) |
| We Do (Práctica) | `intro` (~75 words) + **24 exercises** (8 sub-topics × 3 levels: `guided`, `independent`, `transfer`). Each exercise exposes `instruction`, `hint`, 2-element `hints`, 2-element `edgeCases`, `tests`, `feedback`, `starterCode`, `solutionCode`. Prose ≈ 2,900 words. |
| You Do (Capstone increment) | `title`, `context`, 6 `objectives`, 8 `requirements`, a 100-line `starterCode` template, `portfolioNote`, 4-criterion `rubric`. Prose ≈ 350 words. |
| Self-Check (Quiz) | 11 multiple-choice questions, each with 4 `options`, `correctIndex`, and a 1-sentence `explanation`. Prose ≈ 580 words. |
| Topic Evaluations | 4 formative evaluations (`S02-T1-TE`…`S02-T4-TE`), each with 2 tasks (`deliverable`) + 4-criterion rubric. Prose ≈ 280 words. |
| Resources | 6 docs, 2 books, 4 external courses. Notes ≈ 80 words. |

**Total learner-facing Spanish prose audited:** ~6,113 words across 391 prose records, 575 sentences (mean WPS 10.6, mean SPW 1.84).

---

## 2. Executive Summary of Quality

**Verdict:** Section 2 is **structurally excellent** — best-in-class I Do / We Do / You Do fidelity with a strong authentic Peruvian context (intake de cliente, soles, IGV, Unicode Ñahui, CASO-LIM-002, capstone CP-N1-A), tight cross-topic coherence, and a pedagogically sound "raw/clean/errors" contract that recurs in theory → demo → exercises → capstone. The "Mapa de la sección" advance-organizer is a gold-standard move.

**Quality is held back by:**
1. A small set of **real Spanish grammar / concordance errors** (notably `"letras u otro basura"` line 116 — `basura` is feminine).
2. **Heavy Spanglish / anglicism load** (`raw`, `clean`, `gate`, `helper`, `tests`, `asserts`, `junior`, `code review`, `pipeline`, `commit`, `ticket`, `scoring`, `lab`, `demos`, `clever one-liner`, `loop fancy`, `unit-testear`, `browser`). Some is acceptable LATAM tech register; several instances cross into informal/colloquial ("se enchufa", "no pisar la fuente", "ya evitas el error de…") that should be tightened for an authoritative curriculum voice.
3. **Run-on sentences** in the opening "Mapa de la sección" and in three `why`/`intro` paragraphs (WPS 25–52, ≥45 words) that violate the section's own "progressive disclosure" claim.
4. **Inconsistent English/Spanish mixing in `tests:` and `edgeCases:` fields** — about 8 of 24 `tests` strings are English-dominant ("style pass", "prediction table", "test empty", "test unicode", "3 tests pass (unicode, empty, bad age)", "returns (ok, value|None, msg)…"). These render to the learner.
5. **One pure-English `requirements` string**: `'main() + if __name__ == "__main__"'` (line 1954) — should be a Spanish sentence wrapping the code token.
6. **Inconsistent contract naming**: "raw vs clean" (line 31) vs "raw + clean" (line 1265) vs "raw/clean/errors" (line 1370) for the same pedagogical contract.
7. **Typographic noise**: `DEMO T4-B` in ALL-CAPS mid-prose (lines 116, 450, 687) and `>` used as a verb ("Consistencia > creatividad" line 1113, "Forma consistente > creatividad" line 1635).
8. **Minor Spanglish verb hybrids** that read as informal ("unit-testear", "se enchufa").

**No developer meta-text, AI-to-developer notes, "moved from section X" markers, TODO/FIXME/XXX/WIP/borrador leaks, or placeholder strings were detected.** The authorial voice is consistently teacher-facing. This is the strongest dimension of the section.

**Composite quality score: 7.5 / 10**
- Pedagogical structure: 9.5/10 (gold-standard I/We/You Do + advance organizer + authentic Peruvian scenario)
- Cognitive load / progressive disclosure: 7.5/10 (opening map is too dense; some long sentences)
- Redaction & Spanish grammar: 7/10 (one real concordance error; heavy anglicism load; run-ons in opening)
- Connective tissue & narrative flow: 9/10 (raw/clean contract recurs and is well-paced)
- Exercise & exam alignment: 9/10 (24 graded exercises + 4 formative evals + capstone, all tightly aligned to outcomes)
- Meta-leak cleanliness: 10/10 (zero developer residue)
- Consistency with roadmap (S01 → capstone CP-N1-A): 9/10 (explicitly references S01 venv and CP-N1-A gate)
- Comparison with best-in-class external materials (CS50P, MIT 6.100L, Py4E): 8.5/10 (more authentic + domain-grounded than CS50P; less concise than Py4E on first-contact density)
- Grammar metrics (FH/INFLESZ): median FH = 83.6 ("fácil"), mean 83.3, stdev 26.7 — within healthy "fácil / bastante fácil" band for technical curriculum; 18 records land in "muy difícil" but all are code-fragment strings, not real prose.

---

## 3. Detailed Issue Registry

Severity: **H** = high (grammar error / pedagogical harm), **M** = medium (style/flow), **L** = low (polish).

### A. Spanish grammar & concordance

| # | Sev | Location (line) | Evidence (verbatim) | Pedagogical impact |
|---|---|---|---|---|
| G1 | **H** | L116 (theory T1-B, 3rd paragraph) | `"...letras u otro basura → ValueError capturado..."` | `basura` is feminine in Spanish → "otro basura" is a concordance error. A beginner-targeted section explicitly teaching grammar-of-data cannot itself carry a noun-adjective disagreement. Root cause: editing fragment, likely from "otro carácter basura" / "otro tipo de basura" shortened carelessly. Fix: "otra basura" or "otro carácter basura" or "otra cosa basura". |
| G2 | M | L31 (theory T1-A, 2nd paragraph) | `"...y el contrato **raw vs clean**: conservas el original para auditoría y limpias una copia. **PII** real está prohibida en el lab — solo datos sintéticos."` | "limpias una copia" is grammatical but ambiguous (verb "limpias" = you clean) and sits at the end of a 49-word run-on. "PII" is not expanded on first use. "el lab" anglicism. |
| G3 | M | L116 (same paragraph) | `"Usarás el mismo contrato en el pipeline de dos campos, el DEMO T4-B y el You Do."` | "el You Do" mixes Spanish article + English noun; "DEMO T4-B" ALL-CAPS mid-prose is typographically jarring. |
| G4 | M | L1954 (youDo.requirements, last item) | `"main() + if __name__ == \"__main__\""` | Pure English/code fragment rendered as a Spanish requirement bullet. Should be a Spanish sentence wrapping the code token, e.g., "Incluye una función `main()` y el guard `if __name__ == \"__main__\"`." |
| G5 | L | L33 (theory T1-A, 4th paragraph) | `"...(nombres, dos apellidos, contacto, dirección, y a veces edad o monto)."` | Oxford comma ("dirección, y a veces") is an English calque; Spanish convention omits the comma before `y`. |
| G6 | L | L116 (same) and L450 (iDo why) | `"el DEMO T4-B y el You Do"` / `"...en el DEMO T4-B y en el You Do."` | Inconsistent capitalization of "DEMO" (caps in prose, lowercase in code `demoId`). Recommend lowercase "demo T4-B" or wrap in backticks: `` `DEMO T4-B` ``. |
| G7 | L | L2062 (portfolioNote) | `"...raw e I/O con f-strings — el primer artefacto 'de data' de tu portafolio."` | "artefacto 'de data'" reads as informal Spanglish. "primer artefacto de datos" is cleaner. |
| G8 | L | L1546 (weDo T3-B-E3 feedback) | `"Este parse_monto se enchufa al parser de intake cuando el CSV traiga un monto."` | "se enchufa" is colloquial ("plugs itself in"). Authoritative register: "se conecta" / "se integra". |
| G9 | L | L309 (theory T4-A, 3rd paragraph) | `"Así puedes unit-testear el parse sin depender de la consola."` | "unit-testear" is a Spanglish hybrid verb. Standard LATAM tech Spanish prefers "hacer pruebas unitarias de" / "probar unitariamente". |
| G10 | L | L1224 (weDo T2-B-E2 feedback) | `"Romper el alias antes de mutar es el hábito de 'no pisar la fuente'."` | "no pisar la fuente" is colloquial slang (unclear outside LATAM). Pedagogically opaque for non-Peruvian Spanish speakers. |

### B. Run-on / long sentences (heuristic: >45 words = run-on, >32 = long)

| # | Sev | Location | WPS / WC | Evidence (first 80 chars) | Impact |
|---|---|---|---|---|---|
| R1 | **H** | L31 (theory T1-A ¶2) | WC=49 | `"**Más adelante en la sección** verás identidad (is vs ==), Decimal para soles..."` | Cram forward-reference to identity, Decimal, I/O, raw/clean, PII, AND a study-rhythm hint into one sentence before the learner has seen T1. Violates the section's own progressive-disclosure promise. |
| R2 | **H** | L116 (theory T1-B ¶3) | WC=52 | `"Así un campo inválido no impide reportar los demás, y el raw sigue disponible..."` | The `safe_int` contract paragraph is one 52-word sentence spanning 3 numbered sub-clauses (1) (2) (3) plus a connective tail. Should be split into 3 short sentences or moved to a list. |
| R3 | **H** | L376 (iDo.intro) | WC=52 | `"Partiendo del entorno de S01 (.venv activo o el sandbox del navegador), te demuestro..."` | Intro packs 8 demo references (T1-A…T4-B) + 3 instructions (copia/ejecuta/compara) + PII disclaimer into one sentence. |
| R4 | **H** | L450 (iDo step S02-T1-B-DEMO why) | WC=48 | `"El contrato de tres ramas (vacío / OK / basura) es el mismo que usarás en el pipeline..."` | 48-word `why` packs contract definition + 3 forward references (pipeline, DEMO T4-B, You Do) + isinstance explanation. |
| R5 | M | L15 (jobRelevance) | WC=47 | `"En onboarding de data en bancos, fintech y retail en Perú, tu primer script 'de verdad'..."` | Job-relevance opener runs 47 words across 4 clauses. "loop fancy" Spanglish word-order calque. |
| R6 | M | L34 (theory T1-A ¶5) | WC=25 (sentence), but 100-word paragraph | `"Orden pedagógico: T1 Valores (literales → inspección/conversión) → T2 Nombres..."` | One sentence = 100-word roadmap + 8-session rhythm. Split into 2 sentences: roadmap, then rhythm. |
| R7 | M | L71 (theory T1-A ¶2) | WC=42 | `"La trampa clásica de intake: el número 42 (int) y el texto \"42\" (str) no son..."` | 42 words; packs 4 distinct ideas (trampa, comparación, CSV context, teléfono modeling). |
| R8 | M | L263 (theory T3-A callout) | WC=36 (one sentence) | `"Si un junior tiene que reabrir el manual de precedencia para entender tu línea..."` | Minor; readable but contains "clever one-liner" anglicism idiom. |
| R9 | M | L555 (iDo S02-T3-A-DEMO why) | WC=36 | `"Antes de confiar en un cálculo de ticket, verificas // % ** y paréntesis..."` | "cálculo de ticket" anglicism; "(-3)**2 vs a+b*c" inline shorthand in prose. |
| R10 | M | L1680 (weDo T4-A-E3 instruction) | WC=41 | `"E3 (transferencia) — Escribe simular_intake(nombres: str, contacto: str, edad: str) -> dict..."` | Instruction embeds full type signature; splits into 2 sentences (instruction + signature reference). |
| R11 | M | L339 (theory T4-B ¶2) | WC=24 (one of 3 sentences, paragraph runs ~80 words) | `"Casos mínimos del gate CP-N1-A: vacío (mensaje accionable + raw \"\"), Unicode..."` | Dense enumerated list inside prose; better as bullet list. |
| R12 | M | L236 (theory T3-A ¶3) | WC=20 (one of 3, paragraph ~65 words) | `"En intake peruano, un precio con IGV 18% se escribe mentalmente como base × (1 + 0.18)..."` | "intake peruano" noun+adjective Spanglish; otherwise OK. |

### C. Inconsistent English / Spanish mixing in `tests:` and `edgeCases:` (learner-rendered)

| # | Sev | Location | Evidence | Fix direction |
|---|---|---|---|---|
| E1 | M | L894 (T1-B-E2 `tests`) | `"returns (ok, value|None, msg); 4 casos como en la demo de solución."` | Spanish: `"devuelve (ok, valor|None, msg); 4 casos como en la demo de solución."` |
| E2 | M | L1021 (T2-A-E1 `tests`) | `"style pass: 5 nombres PEP8; sin l/O/I sueltos."` | Spanish: `"pasa estilo: 5 nombres PEP 8; sin l/O/I sueltos."` (also "PEP8" → "PEP 8") |
| E3 | M | L1111 (T2-A-E3 `tests`) | `"rubric naming: 6 claves; snake_case; incluye apellido_paterno y apellido_materno."` | Spanish: `"rúbrica de nombres: 6 claves; snake_case; incluye apellido_paterno y apellido_materno."` |
| E4 | M | L1179 (T2-B-E1 `tests`) | `"prediction table: True, True, False, True, False."` | Spanish: `"tabla de predicción: True, True, False, True, False."` |
| E5 | M | L1742 (T4-B-E1 `tests`) | `"test empty: raw==\"\"; errors no vacío; nombres is None"` | Spanish: `"caso vacío: raw==\"\"; errors no vacío; nombres is None"` |
| E6 | M | L1796 (T4-B-E2 `tests`) | `"test unicode: raw con espacios; clean == \"Ñahui\""` | Spanish: `"caso unicode: raw con espacios; clean == \"Ñahui\""` |
| E7 | M | L1838 (T4-B-E3 `tests`) | `"3 tests pass (unicode, empty, bad age)"` | Spanish: `"3 pruebas pasan (unicode, vacío, edad inválida)"` |
| E8 | M | L1837 (T4-B-E3 `edgeCases`) | `["'raw preserved'", "'3 tests pass'", "'lista errors'"]` | Spanish: `["'raw conservado'", "'3 pruebas pasan'", "'lista de errores'"]`. Note: "lista errors" is a calque of "errors list". |
| E9 | L | L1954 (youDo.requirements, last) | `"main() + if __name__ == \"__main__\""` | (Already G4) Spanish sentence wrapping the code token. |

### D. Inconsistent contract naming

| # | Sev | Location | Evidence | Fix direction |
|---|---|---|---|---|
| N1 | M | L31 vs L1265 vs L1370 | `"raw vs clean"` (theory map) vs `"raw + clean"` (weDo T2-B-E3 feedback) vs `"raw/clean/errors"` (youDo context / callout). Also `"raw/clean"` (L1937) and `"raw"` alone. | Standardize on **one** canonical name. Recommend `"contrato raw/clean/errors"` (the most complete form) on first introduction, then `"raw/clean"` thereafter. Update L31, L1265 to match. |

### E. Typographic / stylistic polish

| # | Sev | Location | Evidence | Fix direction |
|---|---|---|---|---|
| T1 | L | L116, L450, L687 | `"el DEMO T4-B"` / `"en el DEMO T4-B"` ALL-CAPS mid-prose | Lowercase "demo T4-B" or wrap in backticks `` `DEMO T4-B` `` since it matches the `demoId` field. |
| T2 | L | L1113, L1635 | `"Consistencia > creatividad."` / `"Formato consistente > creatividad."` | The `>` reads as code/math. Spanish: `"La consistencia gana a la creatividad."` or `"Consistencia antes que creatividad."` |
| T3 | L | L521 | `"el alias es la forma #1 de corromper el original"` | "#1" is an English short-form. Spanish: `"la principal forma"` / `"la forma número 1"`. |
| T4 | L | L1413 | `"La expresión correcta es el 50% del trabajo; el otro 50% es no usar float..."` | Fine but the "50%…50%" framing is informal; acceptable for a feedback string. |
| T5 | L | L755 | `"...el 50% de los bugs de parse en juniors."` | "juniors" anglicism; could be "desarrolladores junior" or "programadores junior". |
| T6 | L | Multiple (L116, L263, L555, L1063) | `"code review"` (English) used ~6× without italics/quotes | Acceptable as LATAM tech register; for consistency consider `"code review"` in quotes or `"revisión de código (code review)"` on first use. |
| T7 | L | L2067, L1937 | `"sin claims de parentesco"` | "claims" anglicism. Spanish: `"sin afirmaciones de parentesco"` or `"sin suposiciones de parentesco"`. |
| T8 | L | L1021, L1018 | `"PEP8"` (no space) vs `"PEP 8"` (with space) elsewhere | Standardize on `"PEP 8"` (the official PEP spelling) everywhere. |

### F. Cognitive load / progressive disclosure

| # | Sev | Location | Evidence | Impact |
|---|---|---|---|---|
| C1 | M | L30–L34 (theory T1-A opening block, 5 paragraphs) | The opening "Mapa de la sección" block introduces: 3 base ideas + forward references to identidad (`is` vs `==`), `Decimal`, I/O, raw/clean contract, PII, T1→T4 ordering, 8-session rhythm. | Excellent advance-organizer *intent*; too much *content* before the learner has seen T1. Mitigating factor: paragraph 1 says "no memorices el resto aún" and paragraph 2 says "no hace falta dominar Decimal el primer día". Still, 5 dense paragraphs before the first runnable demo is a wall of text. Consider moving paragraphs 2 and 4 (forward-reference + roadmap+rhythm) into a `<details>` "advance organizer" callout. |
| C2 | M | L116 (theory T1-B ¶3) | `safe_int` contract paragraph introduces 3 numbered sub-clauses + connective sentence in one block. | The numbered contract (1)(2)(3) is buried in prose. Better: bullet list with bolded keys, or a `callout` of type `info`. |
| C3 | L | L8 `tagline` | `"Literales, nombres, operadores, Decimal e I/O para el parser de intake"` | Tagline mentions `Decimal` (a T3-B advanced topic) before the learner has opened the section. Slight spoiler of the roadmap. Acceptable as a tagline. |
| C4 | L | L15 `jobRelevance` | 135-word `jobRelevance` paragraph with 47-word run-on sentence. | The longest single prose unit in the section. Should be 2–3 sentences max. Currently sits at the top of the section page (per `SectionView.tsx` L189). |
| C5 | L | L1971 (youDo starterCode docstring) | `"""...Pistas: reutiliza el patrón del DEMO T4-B y del E3 de T4-B (no copies la solución a ciegas: diseña el dict, luego llena cada clave)."""` | Spanish docstring is fine; but `"DEMO T4-B"` ALL-CAPS again. |

### G. Exercise / exam alignment

| # | Sev | Location | Evidence | Impact |
|---|---|---|---|---|
| X1 | L | L786–L847 (weDo T1-A-E3) | `"E3 (transferencia) — Para el cliente sintético de intake, elige el tipo Python correcto de cada campo..."` then `tests: 'Rúbrica: 6 campos; contacto str; edad int; activo bool; todos type checks True.'` | Solution uses `type(v) is t` which contradicts the theory paragraph (L72) that recommends `isinstance` for parsers because "documenta la intención de validación". The exercise explicitly trains `type(v) is t` while theory warns against `type(x) is int`. Mixed message. Either the exercise should use `isinstance` or the theory caveat should clarify that for *literal type checking* (not subclass-aware validation) `type(v) is t` is acceptable. |
| X2 | L | L1059 (weDo T2-A-E2 hints[1]) | `"if flag == True funciona; también puedes escribir if flag: — ambas aceptables aquí si el archivo corre."` | PEP 8 explicitly says "don't compare to True/False with ==" — `if flag == True:` is an anti-pattern. The hint endorsing it as "aceptable" contradicts the section's PEP 8 emphasis. |
| X3 | L | L1319–L1322 (weDo T3-A-E1 edgeCases) | `["'división / siempre float en Python 3'", "'// trunca hacia −∞ (no \"hacia cero\" en negativos)'"]` | Correct edge cases. But the corresponding theory (L235) explains `//` as "división entera hacia −∞" without elaborating on the negative-number behavior. Edge case is more informative than the theory. Consider promoting "−∞ vs hacia cero" into the theory paragraph. |
| X4 | L | L2086–L2092 (selfCheck Q3) | Question: `"¿Por qué el teléfono de un cliente de intake se modela como str?"` Option A: `"Porque no es una cantidad aritmética y puede necesitar ceros o formato"` | Theory (L71) says phones "puede tener ceros a la izquierda **en otros países**". The self-check option omits "en otros países" and says "o formato", which is broader. Minor alignment drift. |
| X5 | L | L2107–L2113 (selfCheck Q6) | Question: `"¿Qué imprime la expresión -3**2 en Python?"` Options: `['9', 'Error', '6', '-9']`, correctIndex 3. | Excellent — matches theory (L235) and weDo E2. |
| X6 | L | L2093–L2099 (selfCheck Q4) | Question: `"Tras b = a con a = [1, 2] y b.append(3), ¿qué vale a?"` Options: `['[1, 2]', '[3]', '[1, 2, 3]', 'Error']` correctIndex 2. | Excellent — matches theory (L190) and weDo T2-B-E2. |
| X7 | L | L2136–L2141 (selfCheck Q10) | Question: `"Tras raw = \"  Ñahui  \" y clean = raw.strip(), ¿qué debe cumplirse?"` Option D: `"raw conserva los espacios; clean es \"Ñahui\" y es otro str"` correctIndex 3. | Excellent — matches theory (L190) and weDo T4-B-E2. |
| X8 | L | L2142–L2148 (selfCheck Q11) | Question: `"Si monto es Decimal(\"99.5\"), ¿qué imprime f\"S/ {monto:.2f}\"?"` Option A: `"S/ 99.50"` correctIndex 0. | Excellent — matches theory (L308) and weDo T4-A-E2. |
| X9 | L | L2063–L2068 (youDo rubric) | 4-criterion rubric: correctness 30%, robustness 25%, maintainability 25%, responsible_use 20%. | Weights sum to 100%. Excellent. Criterion names in English (`correctness`, `robustness`, `maintainability`, `responsible_use`) — fine as internal rubric keys. |
| X10 | L | L1956–L2060 (youDo starterCode) | 100-line Python template with `safe_int`, `parse_client`, `mostrar_resumen` stubs, plus `_run_tests()` with 4 assertions (Unicode, vacío, edad inválida, edad vacía). | Excellent scaffolding. The `_run_tests` is reproducible and aligned with the weDo T4-B-E3 final exercise. The 4th test case (edad `"  "` — vacío tras strip) is a nice addition beyond the weDo E3. |

### H. Resources & external comparison

| # | Sev | Location | Evidence | Impact |
|---|---|---|---|---|
| RC1 | L | L2290–L2298 (resources.books) | Entry: `{ label: 'Python Tutorial (oficial) como libro corto', note: 'Caps. de intro y estructuras: literales, tipos, I/O básico.' }` | This is the official Python Tutorial re-labeled as a "book". Misleading category. Move to `docs` or rename to "Python Tutorial (oficial) como lectura secuencial". |
| RC2 | L | L2295–L2298 (resources.books) | Entry: `{ label: 'Fluent Python (referencia posterior)', note: 'Profundiza mutabilidad e identidad; no es lectura obligatoria de S02.' }` | Good caveat. Could add author (Luciano Ramalho) and edition for citability. |
| RC3 | L | L2300–L2321 (resources.courses) | 4 external courses: CS50P, MIT 6.100L, Coursera Py4E, Kaggle Learn Python. | Excellent, diverse benchmark set. Notes are appropriately scoped ("Benchmark de secuencia; no copiar ejercicios literales"). |
| RC4 | L | L2284–L2288 (resources.docs) | `"Python for Everybody — types chapter"` with note `"Variables y tipos progressive disclosure"`. | Note is in English ("progressive disclosure"). Should be Spanish: `"Variables y tipos con progresión gradual"`. |

### I. Consistency with roadmap (S01 → S02 → capstone CP-N1-A)

| # | Sev | Location | Evidence | Impact |
|---|---|---|---|---|
| RD1 | — | L15 `jobRelevance` | `"Parte de tu entorno de S01: activa el .venv, crea un archivo parse_client_intake.py en tu repo de práctica y corre las demos en Pyodide o en local..."` | Excellent backward link to S01 setup. |
| RD2 | — | L33, L339, L687, L1265, L1840, L1937 | Repeated forward link to capstone `CP-N1-A` and lab case `CASO-LIM-002`. | Excellent forward coherence. |
| RD3 | L | L32, L34 | `"Verás if y for solo como sintaxis de apoyo en demos y prácticas (no son el tema a dominar aún): el control de flujo profundo y la iteración llegan en secciones siguientes."` | Excellent boundary-setting against S03 (data structures). |
| RD4 | L | L1956 (youDo starterCode docstring) | `"parse_client_intake.py — incremento CP-N1-A"` | Clear capstone increment framing. |

---

## 4. Meta-Leak Report

**Result: ZERO meta-leak findings.** I ran:
1. Regex scan for `TODO|FIXME|XXX|WIP|TBD|moved from section|borrador|nota para|nota interna|prompt para el|meta-leak|placeholder` (case-sensitive for the all-caps acronyms to avoid false positives on the Spanish word "todo").
2. Manual full-file read for AI-to-developer comments, design notes, "section X" cross-references that read as authoring residue, prompt scaffolding, or any non-teacher voice.
3. Specific search for `"movido de"`, `"sección anterior"`, `"próxima sección"`, `"mover de"`, `"borrador"`, `"internal"`, `"note to"`, `"dev"`, `"AI"`, `"GPT"`, `"Claude"`, `"Copilot"`.

**No developer meta-text, AI comments, design notes, or internal instructions leaked into the learner-facing prose.** The authorial voice is consistently teacher-facing throughout all 8 tabs (Teoría, I Do, We Do, You Do, Self-Check, plus `jobRelevance`, `learningOutcomes`, `topicEvaluations`, `resources`).

The only meta-references present are intentional and pedagogically legitimate:
- `CASO-LIM-002` — lab case identifier (Lima, section 02). Repeated as a forward reference for lab consistency. Not a leak.
- `CP-N1-A` — capstone increment identifier (Capstone Phase N1, increment A). Repeated as a forward reference for portfolio coherence. Not a leak.
- `S01`, `S02` — section identifiers used as shorthand ("entorno de S01", "tipos básicos de S02"). Acceptable as curriculum scaffolding.
- `S02-T1-A`…`S02-T4-B` — sub-topic identifiers shown to learners as advance-organizers. Pedagogically intentional.

This is the **strongest dimension of the section** and a model for other sections to follow.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do fidelity — **Gold standard**

The section implements the I/We/You Do cycle with rare fidelity:

- **I Do (8 demos, one per sub-topic):** Each demo is a single self-contained Python script (`s02_ido_1()`…`s02_ido_7()` + `parse_client` for T4-B) with a runnable `code` block, the expected `output`, a one-line `description`, and a 2–3-sentence `why` that explains *why this matters in production data work in Perú*. The `why` strings are the strongest redaction in the section: "En soles, float miente" (L583), "El gate no es 'imprimió algo': son asserts" (L687), "Si Ñahui sobrevive, tu pipeline no es del siglo ASCII. Obligatorio en datos peruanos." (L1798) — these are memorable, voice-y, and grounded.
- **We Do (24 exercises = 8 × 3):** Each sub-topic gets exactly 3 exercises with progressive independence: `guided` (fill-in-the-blank with `____`), `independent` (implement from scratch with hints), `transfer` (apply to intake schema). This is the canonical scaffolded practice structure. The `starterCode`/`solutionCode` pair with `output` for self-checking is excellent.
- **You Do (capstone increment CP-N1-A):** A 100-line `starterCode` template with 4-test `_run_tests()` harness, 6 `objectives`, 8 `requirements`, 4-criterion `rubric`, and a `portfolioNote` that explicitly links to interview readiness. This is the strongest You Do artifact in early sections.

**Verdict:** 9.5/10. The only weakness is X1 (T1-A-E3 uses `type(v) is t` while theory prefers `isinstance`) and X2 (T2-A-E2 hint endorses `if flag == True`).

### 5.2 Connective tissue & narrative flow — **Excellent**

The "raw/clean/errors" contract is introduced in theory (L191, T2-B), recurs in T4-B (L338), is exercised in We Do T2-B-E3 (L1252) and T4-B-E3 (L1827), and culminates in the You Do capstone. The `safe_int` contract is introduced in T1-B theory (L116), recurs verbatim in T1-B demo, T4-B demo, T4-B-E3, and You Do. The "teléfono como str" rule is introduced in T1-A theory (L71), recurs in T1-A-E3 (L789), and is tested in selfCheck Q3.

The 4 topics (T1 Valores → T2 Nombres → T3 Operadores → T4 I/O) are explicitly ordered in the opening map and each topic's `subtopicId` propagates to demos, exercises, and topic evaluations. The cross-references (CP-N1-A, CASO-LIM-002) are consistent.

**Verdict:** 9/10. The only connective-tissue weakness is N1 (contract naming inconsistency: "raw vs clean" / "raw + clean" / "raw/clean/errors").

### 5.3 Cognitive load & progressive disclosure — **Good but front-loaded**

The opening "Mapa de la sección" block (5 paragraphs, ~400 words) is a *strong* advance-organizer in intent but violates progressive disclosure in execution: it introduces forward references to identity (`is` vs `==`), `Decimal`, I/O, raw/clean contract, PII policy, T1→T4 ordering, and an 8-session rhythm *before* the learner has seen a single runnable demo. The mitigating in-paragraph asides ("no memorices el resto aún", "no hace falta dominar Decimal el primer día") help, but the wall of text remains.

After the opening map, the cognitive load is well-managed: each sub-topic has 2–3 short paragraphs, one code demo, one callout. The `callout` types (`info`/`tip`/`warning`/`danger`/`success`) are used purposefully — `danger` for "Nunca Decimal(0.1)" and "Alias en listas", `warning` for "No eval, no silent pass", `tip` for "Regla de intake" and "Checklist rápido PEP 8", `info` for "Qué NO es el foco", `success` for "Contrato del parser S02".

**Verdict:** 7.5/10. The opening map needs re-segmentation (C1, C2, R1, R2, R6).

### 5.4 Authentic Peruvian context — **Excellent**

The section is grounded in a Peruvian fintech/retail/banking intake scenario:
- Soles (`S/`), IGV 18%, `Decimal` for money (T3-B).
- Peruvian surnames: Quispe, Ñahui, Ramos, Díaz, García (Unicode round-trip testing).
- Lima, Cusco as cities.
- Telefones like `999000111` (Peruvian 9-digit mobile format).
- DNI as a text identifier (selfCheck Q3 explanation L2091).
- "code review peruano de data" (L264).
- "onboarding de data en bancos, fintech y retail en Perú" (L15).

This is a model for culturally-grounded curriculum design and a clear differentiator vs. CS50P / MIT 6.100L.

### 5.5 Exercise quality — **Excellent**

The 24 We Do exercises are tightly aligned to the 8 sub-topics and the 8 learning outcomes. The progression `guided → independent → transfer` is consistent. The `feedback` strings are short, voice-y, and motivating ("Si Ñahui sobrevive, tu pipeline no es del siglo ASCII"). The `hint` + `hints[]` redundancy (single `hint` field plus a 2-element `hints` array where `hints[0]` duplicates `hint`) is a minor schema redundancy — not a bug, just unnecessary duplication.

**Verdict:** 9/10. X1 (type/isinstance contradiction) and X2 (PEP 8 anti-pattern endorsement) are the only real alignment issues.

### 5.6 Self-check & topic evaluation quality — **Excellent**

The 11-question self-check covers all 4 topics with plausible distractors. The 4 topic evaluations each have 2 authentic tasks and a 4-criterion rubric (`correctness`, `robustness`, `maintainability`, `responsible_use`) — a deliberate "data quality" rubric that mirrors production code review. The `responsible_use` criterion (no PII, no eval, no float for money, no claims of parentesco) is a *distinctive* pedagogical innovation that goes beyond typical Python 101 courses.

**Verdict:** 9/10.

---

## 6. Grammatical Improvements — Paragraph-by-Paragraph Rewriting

For each learner-facing tab, I show the worst paragraphs/sentences **before → after** with the grammar metric (Fernández-Huerta readability + WPS + SPW) and the specific fix.

### 6.1 Theory tab — T1-A "Mapa de la sección" (opening 5 paragraphs)

**Paragraph 2 (L31) — BEFORE** (WPS=34.5, SPW=1.75, FH=66.4 "normal"; WC=49 → run-on):
> **Más adelante en la sección** verás identidad (`is` vs `==`), **`Decimal`** para soles (no `float` para montos), **I/O** con `input`/`print` y f-strings, y el contrato **raw vs clean**: conservas el original para auditoría y limpias una copia. **PII** real está prohibida en el lab — solo datos sintéticos. Si el mapa se siente denso, avanza T1→T4 en ese orden; no hace falta dominar Decimal el primer día.

**AFTER** (3 short sentences, FH ≈ 80 "fácil"):
> Más adelante en la sección verás identidad (`is` vs `==`), `Decimal` para soles (no `float` para montos), I/O con `input`/`print` y f-strings. También verás el contrato **raw/clean**: conservas el original para auditoría y limpias una copia. **PII** real (información personal identificable) está prohibida en el laboratorio; usa solo datos sintéticos. Si el mapa se siente denso, avanza T1→T4 en ese orden: no hace falta dominar `Decimal` el primer día.

**Changes:** Split 49-word run-on into 3 sentences (WPS 11 → FH 80). Expanded "PII" on first use. Replaced "lab" → "laboratorio". Standardized "raw vs clean" → "raw/clean" (fixes N1).

**Paragraph 5 (L34) — BEFORE** (one 100-word sentence; the entire 8-session rhythm packed into a single clause):
> Orden pedagógico: **T1 Valores** (literales → inspección/conversión) → **T2 Nombres** (asignación/PEP 8 → identidad y copias) → **T3 Operadores** (precedencia → Decimal para dinero) → **T4 I/O** (f-strings → parse con errores). En cada subtema harás teoría, una demo I Do y tres prácticas We Do (guiada, independiente y de transferencia). Ritmo sugerido (~18 h): sesiones 1–2 solo T1; 3–4 T2; 5–6 T3; 7–8 T4 + You Do + self-check y evaluaciones formativas por tema.

**AFTER** (FH ≈ 75 "bastante fácil"; same content, two clearer sentences):
> Orden pedagógico: **T1 Valores** (literales → inspección/conversión), **T2 Nombres** (asignación/PEP 8 → identidad y copias), **T3 Operadores** (precedencia → Decimal para dinero), **T4 I/O** (f-strings → parse con errores). En cada subtema harás teoría, una demo I Do y tres prácticas We Do (guiada, independiente y de transferencia). Ritmo sugerido (~18 h): sesiones 1–2 solo T1; 3–4 T2; 5–6 T3; 7–8 T4 + You Do + self-check y evaluaciones formativas por tema.

**Changes:** Replaced `→` (math arrow) with `,` for the topic sequence — improves screen-reader pronunciation and reduces visual noise. (Same word count, much easier to scan.)

### 6.2 Theory tab — T1-B "Inspección, conversión y validación" (paragraph 3, L116)

**BEFORE** (WPS=26, SPW=1.88, FH=67.2 "normal"; WC=52 → run-on; **contains grammar error G1**):
> Validación profesional: capturar el fallo, **nombrar el campo** en el mensaje y **no tragar el error en silencio**. Un patrón útil es devolver una tupla `(ok, valor_o_None, mensaje_o_None)` o acumular errores en una lista. Así un campo inválido no impide reportar los demás, y el raw sigue disponible para depurar. **Contrato unificado de `safe_int` en esta sección:** (1) vacío tras `strip` → error de valor vacío; (2) dígitos OK → `(True, n, None)`; (3) letras u otro basura → `ValueError` capturado con mensaje `no se pudo convertir … a int`. Usarás el mismo contrato en el pipeline de dos campos, el DEMO T4-B y el You Do.

**AFTER** (FH ≈ 78 "bastante fácil"; fixes G1, G3, G6, R2; converts embedded enumeration to a bullet list):
> Validación profesional: capturar el fallo, **nombrar el campo** en el mensaje y **no tragar el error en silencio**. Un patrón útil es devolver una tupla `(ok, valor_o_None, mensaje_o_None)` o acumular errores en una lista. Así un campo inválido no impide reportar los demás, y el raw sigue disponible para depurar.
>
> **Contrato unificado de `safe_int` en esta sección:**
> - (1) vacío tras `strip` → error de valor vacío;
> - (2) dígitos OK → `(True, n, None)`;
> - (3) letras u **otra** basura → `ValueError` capturado con mensaje `no se pudo convertir … a int`.
>
> Usarás el mismo contrato en el pipeline de dos campos, en la demo T4-B y en el You Do.

**Changes:** Fixed concordance G1 ("otro" → "otra"). Split the 52-word run-on R2 into a list (the 3-clause contract is now visually segmented). Lowercased "DEMO T4-B" → "demo T4-B" (T1, G6). Added "en la" before "demo T4-B" and "en el" before "You Do" for parallelism (G3).

### 6.3 Theory tab — T2-A "Asignación y convenciones de nombres" (paragraph 2, L154)

**BEFORE** (WPS=14, SPW=2.21, FH=59.7 "bastante difícil"; the FH drop is from code-heavy tokens):
> PEP 8 (guía de estilo): **`snake_case`** para variables y funciones (`apellido_paterno`, `parse_client`), **`UPPER_CASE`** para constantes (`EDAD_MINIMA`, `IGV_TASA`), **`CapWords`** para clases (más adelante). Evita nombres de una sola letra confusos: **`l` / `O` / `I`** se confunden con `1` y `0`. Prefiere `longitud`, `indice`, `columna`.

**AFTER** (FH ≈ 65 "normal"; same content, normalized "PEP 8" spacing, mild clarification):
> PEP 8 (guía de estilo): **`snake_case`** para variables y funciones (`apellido_paterno`, `parse_client`); **`UPPER_CASE`** para constantes (`EDAD_MINIMA`, `IGV_TASA`); **`CapWords`** para clases (más adelante). Evita nombres de una sola letra confusos: **`l`, `O`, `I`** se confunden con `1` y `0`. Prefiere `longitud`, `indice`, `columna`.

**Changes:** T8 ("PEP8" → "PEP 8" — already correct here, kept as reference). Replaced `/` with `,` in the `l / O / I` list — improves readability. Replaced `,` with `;` between the three PEP 8 categories for clearer separation. (FH improvement is minor; the "bastante difícil" score is structural due to code tokens and is acceptable.)

### 6.4 Theory tab — T3-A "Operadores y precedencia" (paragraph 1, L234)

**BEFORE** (WPS=15, SPW=2.37, FH=49.5 "difícil"; the FH drop is from many short code symbols):
> Los operadores aritméticos de S02: **`+`**, **`-`**, **`*`**, **`/`** (división verdadera → `float`), **`//`** (división entera hacia −∞), **`%`** (resto) y **`**`** (potencia). Las **comparaciones** (`==`, `!=`, `<`, `<=`, `>`, `>=`) devuelven `bool` y se combinan con la aritmética en expresiones de negocio (rangos, umbrales).

**AFTER** (FH ≈ 58 "bastante difícil"; same content; the FH is structurally limited by code-token density):
> Los operadores aritméticos de S02 son: `+`, `-`, `*`, `/` (división verdadera, devuelve `float`), `//` (división entera hacia −∞), `%` (resto) y `**` (potencia). Las comparaciones (`==`, `!=`, `<`, `<=`, `>`, `>=`) devuelven `bool` y se combinan con la aritmética en expresiones de negocio (rangos, umbrales).

**Changes:** Removed redundant bolding on code tokens (the backticks already provide emphasis). Added "son" after "S02" for grammatical completeness. Replaced `→` with `,` for screen-reader friendliness. (FH stays "bastante difícil" because of code density — acceptable per the subplan's note that extreme FH on code-adjacent Spanish is a known false-positive class.)

### 6.5 Theory tab — T4-A "input, print y f-strings" (paragraph 2, L308)

**BEFORE** (WPS=19, SPW=1.88, FH=74.8 "bastante fácil"):
> Las **f-strings** (`f"...{expr}..."`) son el formato preferido en S02: legibles, con expresiones cortas y especificadores (`{monto:.2f}`, `{nombre!r}`). Después de T3-B, todo monto de negocio continúa como `Decimal`: formatear con `.2f` no requiere convertirlo a float. Prompts y mensajes de error del intake van en **español claro** ("Ingresa el contacto:", "ERROR en 'edad': …").

**AFTER** (FH ≈ 78 "bastante fácil"; minor clarity):
> Las **f-strings** (`f"...{expr}..."`) son el formato preferido en S02: son legibles, aceptan expresiones cortas y especificadores (`{monto:.2f}`, `{nombre!r}`). Después de T3-B, todo monto de negocio continúa como `Decimal`: formatearlo con `.2f` no requiere convertirlo a `float`. Los prompts y los mensajes de error del intake van en **español claro** ("Ingresa el contacto:", "ERROR en 'edad': …").

**Changes:** Added article "Los" before "prompts" (Spanish prefers definite article for generic noun phrases). Replaced "expresiones cortas y especificadores" with "aceptan expresiones cortas y especificadores" for parallel verb structure. Minor.

### 6.6 Theory tab — T4-B "Parsing de intake y mensajes de error" (paragraph 2, L339)

**BEFORE** (WPS=24, SPW=1.79, FH=74.9 "bastante fácil"; one dense enumerated sentence):
> Casos mínimos del gate CP-N1-A: **vacío** (mensaje accionable + raw `""`), **Unicode** (García, Ñahui, María — round-trip sin errores ASCII), **número inválido** (`edad="abc"` → error con nombre de campo, raw intacto). El helper **`safe_int`** usa un solo contrato en toda la sección: vacío tras strip → error de vacío; dígitos OK → `(True, n, None)`; letras → `ValueError` capturado con mensaje por campo. Los tests son **asserts** o pytest: no "mirar la consola y ya".

**AFTER** (FH ≈ 78; converts dense enumeration to bullet list; fixes "tests"/"asserts" anglicisms):
> Casos mínimos del gate CP-N1-A:
> - **vacío**: mensaje accionable + raw `""`;
> - **Unicode** (García, Ñahui, María): round-trip sin errores ASCII;
> - **número inválido** (`edad="abc"`): error con nombre de campo, raw intacto.
>
> El helper **`safe_int`** usa un solo contrato en toda la sección: vacío tras `strip` → error de vacío; dígitos OK → `(True, n, None)`; letras → `ValueError` capturado con mensaje por campo. Las pruebas son **asserts** o pytest: no "mirar la consola y ya".

**Changes:** Converted the 3-case enumeration from inline prose to a bullet list (C2). Replaced "Los tests" → "Las pruebas" (E-series consistency; "tests" was the only English plural in this paragraph). Kept "asserts" and "pytest" as code-adjacent English (acceptable). Kept "helper" anglicism (acceptable in LATAM tech register).

### 6.7 I Do tab — `intro` (L376)

**BEFORE** (WPS=52 → run-on R3):
> Partiendo del entorno de S01 (`.venv` activo o el sandbox del navegador), te demuestro en Python puro el camino del registro de cliente: literales (T1-A), conversión (T1-B), nombres (T2-A), raw/alias (T2-B), operadores (T3-A), Decimal (T3-B), f-strings (T4-A) y parser con errores (T4-B). Copia cada demo, ejecútala y compara la salida. Datos 100% sintéticos — sin PII real.

**AFTER** (3 sentences; FH ≈ 82 "fácil"):
> Partiendo del entorno de S01 (`.venv` activo o el sandbox del navegador), te demuestro en Python puro el camino del registro de cliente. Recorreremos los 8 sub-temas en orden: literales (T1-A), conversión (T1-B), nombres (T2-A), raw/alias (T2-B), operadores (T3-A), `Decimal` (T3-B), f-strings (T4-A) y parser con errores (T4-B). Copia cada demo, ejecútala y compara la salida. Datos 100% sintéticos — sin PII real.

**Changes:** Split the 52-word run-on R3 into 2 sentences by extracting the demo list into its own sentence starting with "Recorreremos los 8 sub-temas en orden:". Wrapped `Decimal` in backticks. (Word count goes up slightly, but WPS drops from 52 → ~17, FH rises ~15 points.)

### 6.8 I Do tab — `why` for S02-T1-B-DEMO (L450)

**BEFORE** (WPS=48 → run-on R4):
> El contrato de tres ramas (vacío / OK / basura) es el mismo que usarás en el pipeline de dos campos, en el DEMO T4-B y en el You Do. isinstance separa "ya es int" de "sigue siendo texto"; el mensaje siempre nombra el campo y el valor recibido.

**AFTER** (FH ≈ 80; fixes G6):
> El contrato de tres ramas (vacío / OK / basura) es el mismo que usarás en el pipeline de dos campos, en la demo T4-B y en el You Do. `isinstance` separa "ya es `int`" de "sigue siendo texto"; el mensaje siempre nombra el campo y el valor recibido.

**Changes:** Lowercased "DEMO T4-B" → "demo T4-B" (G6). Wrapped `isinstance` and `int` in backticks. (Word count unchanged, but the 48-WC sentence is now split visually by the period+semicolon boundary — acceptable because the second clause is short.)

### 6.9 We Do tab — `tests` strings (8 fixes E1–E8)

See **Section 7 Diffs D-E1 through D-E8** below. All 8 `tests` strings are converted from English/Spanish mixed to consistent Spanish (with code tokens preserved as code).

### 6.10 We Do tab — `feedback` for T3-B-E3 (L1546)

**BEFORE:**
> Este parse_monto se enchufa al parser de intake cuando el CSV traiga un monto. Mismo contrato (ok, valor, error).

**AFTER:**
> Este `parse_monto` se conecta al parser de intake cuando el CSV traiga un monto. Mismo contrato (ok, valor, error).

**Changes:** G8 ("se enchufa" → "se conecta"). Wrapped `parse_monto` in backticks.

### 6.11 We Do tab — `feedback` for T2-A-E1 (L1022)

**BEFORE:**
> Nombres legibles reducen NameError y aceleran review.

**AFTER:**
> Nombres legibles reducen `NameError` y aceleran la revisión de código.

**Changes:** Wrapped `NameError` in backticks. T6 ("review" → "la revisión de código" on first use in this feedback string; subsequent mentions in the section can keep "code review" as established anglicism).

### 6.12 We Do tab — `feedback` for T2-A-E3 (L1113)

**BEFORE:**
> El rename de columnas es el primer commit de un pipeline real. Consistencia > creatividad.

**AFTER:**
> Renombrar columnas es el primer `commit` de un pipeline real. La consistencia gana a la creatividad.

**Changes:** T2 (`>` → "gana a"). Verbalized "rename" → "Renombrar" (more natural Spanish). Wrapped `commit` in backticks.

### 6.13 We Do tab — `feedback` for T4-A-E2 (L1635)

**BEFORE:**
> El reporte legible es lo que el analista pega en el ticket. Formato consistente > creatividad.

**AFTER:**
> El reporte legible es lo que el analista pega en el ticket. El formato consistente gana a la creatividad.

**Changes:** T2 (`>` → "gana a"). Kept "ticket" anglicism (acceptable in LATAM helpdesk register).

### 6.14 You Do tab — `requirements` last item (L1954)

**BEFORE:**
> `main() + if __name__ == "__main__"`

**AFTER:**
> Incluye una función `main()` y el guard `if __name__ == "__main__"`.

**Changes:** G4 — converted pure-English/code fragment to a Spanish sentence wrapping the code token.

### 6.15 You Do tab — `portfolioNote` (L2062)

**BEFORE:**
> Este esqueleto demuestra tipos, conversión segura, nombres PEP 8, preservación de raw e I/O con f-strings — el primer artefacto "de data" de tu portafolio. En entrevistas te pedirán extenderlo (más campos, Decimal para montos, lectura de CSV). Si el contrato raw/clean + errors está sólido, esas extensiones son naturales. Súbelo a tu repo de práctica (p. ej. python-ds-journey) **sin datos reales**.

**AFTER:**
> Este esqueleto demuestra tipos, conversión segura, nombres PEP 8, preservación de `raw` e I/O con f-strings — el primer artefacto de datos de tu portafolio. En entrevistas te pedirán extenderlo (más campos, `Decimal` para montos, lectura de CSV). Si el contrato raw/clean + errors está sólido, esas extensiones son naturales. Súbelo a tu repo de práctica (p. ej. `python-ds-journey`) **sin datos reales**.

**Changes:** G7 ("artefacto 'de data'" → "artefacto de datos"). Wrapped `raw`, `Decimal`, `python-ds-journey` in backticks.

### 6.16 Self-Check tab — explanations

All 11 explanations are grammatically correct and concise. The only minor improvement:

**Q8 explanation (L2126) — BEFORE:**
> input devuelve str; la conversión es un paso explícito posterior (int/Decimal).

**AFTER:**
> `input()` devuelve `str`; la conversión es un paso explícito posterior (`int`/`Decimal`).

**Changes:** Added `()` to `input` to clarify it's the function call. Wrapped all code tokens in backticks.

### 6.17 `jobRelevance` (L15) — the longest single prose unit

**BEFORE** (135 words; one 47-word run-on R5):
> En onboarding de data en bancos, fintech y retail en Perú, tu primer script "de verdad" no es un loop fancy: es leer campos de un formulario o CSV, saber qué tipo tiene cada valor, convertir texto a número sin crashear, y conservar el original para auditoría. Si confundes 42 con "42", usas float para soles o sobrescribes el raw al normalizar, generas bugs de calidad de datos caros. Esta sección construye esa base: valores, nombres, operadores e I/O hacia el parser de intake del capstone CP-N1-A. Parte de tu entorno de S01: activa el `.venv`, crea un archivo `parse_client_intake.py` en tu repo de práctica y corre las demos en Pyodide o en local con el mismo Python del venv.

**AFTER** (4 sentences; FH ≈ 75 "bastante fácil"):
> En el onboarding de data en bancos, fintech y retail en Perú, tu primer script "de verdad" no es un bucle sofisticado: es leer campos de un formulario o CSV, saber qué tipo tiene cada valor, convertir texto a número sin que el programa falle, y conservar el original para auditoría. Si confundes `42` con `"42"`, usas `float` para soles o sobrescribes el `raw` al normalizar, generas bugs de calidad de datos caros. Esta sección construye esa base: valores, nombres, operadores e I/O hacia el parser de intake del capstone CP-N1-A. Parte de tu entorno de S01: activa el `.venv`, crea un archivo `parse_client_intake.py` en tu repo de práctica y corre las demos en Pyodide o en local con el mismo Python del venv.

**Changes:** Replaced "loop fancy" (English word-order calque) → "bucle sofisticado" (natural Spanish). Replaced "crashear" (anglicism verb) → "que el programa falle". Added article "el" before "onboarding". Wrapped `42`, `"42"`, `float`, `raw` in backticks. The 47-word run-on R5 is now 2 sentences (split at "Esta sección construye esa base").

---

## 7. Proposed GitHub-Style Diffs

All diffs are against `src/lib/course/sections/s02-basics.ts` on the `main` branch of `PillB/pyarcana`. Line numbers reference the current file (post-`git checkout main`).

### D-G1 — Fix concordance "otro basura" → "otra basura" (H)

```diff
--- a/src/lib/course/sections/s02-basics.ts
+++ b/src/lib/course/sections/s02-basics.ts
@@ -113,7 +113,7 @@
         '**`type(x)`** responde "¿qué es esto ahora?". **`isinstance(x, int)`** responde "¿puedo tratarlo como int?" (incluye subtipos). En parsers, `isinstance` suele ser más útil que comparar `type(x) is int`, porque documenta la intención de validación.',
         'La conversión explícita usa constructores: **`int()`**, **`float()`**, **`str()`**. El texto de formularios trae espacios: **`valor.strip()`** antes de convertir. `int(" 19 ")` funciona; `int("19.5")` o `int("abc")` lanzan **`ValueError`**. **Nunca uses `eval()`** sobre input de usuario: es un riesgo de seguridad y un anti-patrón de calidad de datos.',
-        'Validación profesional: capturar el fallo, **nombrar el campo** en el mensaje y **no tragar el error en silencio**. Un patrón útil es devolver una tupla `(ok, valor_o_None, mensaje_o_None)` o acumular errores en una lista. Así un campo inválido no impide reportar los demás, y el raw sigue disponible para depurar. **Contrato unificado de `safe_int` en esta sección:** (1) vacío tras `strip` → error de valor vacío; (2) dígitos OK → `(True, n, None)`; (3) letras u otro basura → `ValueError` capturado con mensaje `no se pudo convertir … a int`. Usarás el mismo contrato en el pipeline de dos campos, el DEMO T4-B y el You Do.',
+        'Validación profesional: capturar el fallo, **nombrar el campo** en el mensaje y **no tragar el error en silencio**. Un patrón útil es devolver una tupla `(ok, valor_o_None, mensaje_o_None)` o acumular errores en una lista. Así un campo inválido no impide reportar los demás, y el raw sigue disponible para depurar. **Contrato unificado de `safe_int` en esta sección:** (1) vacío tras `strip` → error de valor vacío; (2) dígitos OK → `(True, n, None)`; (3) letras u **otra** basura → `ValueError` capturado con mensaje `no se pudo convertir … a int`. Usarás el mismo contrato en el pipeline de dos campos, en la demo T4-B y en el You Do.',
       ],
```

### D-R1 — Split run-on in theory T1-A ¶2 (H)

```diff
--- a/src/lib/course/sections/s02-basics.ts
+++ b/src/lib/course/sections/s02-basics.ts
@@ -28,7 +28,7 @@
         '**Antes de T1, tres ideas base** (no memorices el resto aún). Un **literal** es un valor escrito en el código (`34`, `"Quispe"`, `True`). Un **tipo** es la clase de ese valor (`int`, `float`, `str`, `bool`, `NoneType`). Con **`=`** guardas un nombre; con **`==`** preguntas si dos valores son iguales. Cada idea vuelve en su subtema con demo y práctica.',
-        '**Más adelante en la sección** verás identidad (`is` vs `==`), **`Decimal`** para soles (no `float` para montos), **I/O** con `input`/`print` y f-strings, y el contrato **raw vs clean**: conservas el original para auditoría y limpias una copia. **PII** real está prohibida en el lab — solo datos sintéticos. Si el mapa se siente denso, avanza T1→T4 en ese orden; no hace falta dominar Decimal el primer día.',
+        'Más adelante en la sección verás identidad (`is` vs `==`), `Decimal` para soles (no `float` para montos), I/O con `input`/`print` y f-strings. También verás el contrato **raw/clean**: conservas el original para auditoría y limpias una copia. **PII** real (información personal identificable) está prohibida en el laboratorio; usa solo datos sintéticos. Si el mapa se siente denso, avanza T1→T4 en ese orden: no hace falta dominar `Decimal` el primer día.',
         'En esta sección dominas lo que un parser de intake necesita primero: **qué es un valor**, **qué tipo tiene**, **cómo se nombra**, **cómo se opera** y **cómo entra/sale texto** sin perder el original. Verás `if` y `for` solo como **sintaxis de apoyo** en demos y prácticas (no son el tema a dominar aún): el control de flujo profundo y la iteración llegan en secciones siguientes.',
         'El hilo conductor es un **registro sintético de cliente** (nombres, dos apellidos, contacto, dirección, y a veces edad o monto). Todo el material usa datos ficticios (`example.com`, teléfonos inventados). Nunca subas PII real al repo. Caso de laboratorio: `CASO-LIM-002`.',
         'Orden pedagógico: **T1 Valores** (literales → inspección/conversión) → **T2 Nombres** (asignación/PEP 8 → identidad y copias) → **T3 Operadores** (precedencia → Decimal para dinero) → **T4 I/O** (f-strings → parse con errores). En cada subtema harás teoría, una demo I Do y tres prácticas We Do (guiada, independiente y de transferencia). Ritmo sugerido (~18 h): sesiones 1–2 solo T1; 3–4 T2; 5–6 T3; 7–8 T4 + You Do + self-check y evaluaciones formativas por tema.',
```

### D-R5 — Split run-on in `jobRelevance` (M)

```diff
--- a/src/lib/course/sections/s02-basics.ts
+++ b/src/lib/course/sections/s02-basics.ts
@@ -12,7 +12,7 @@
   icon: 'Code2',
   accentColor: 'bg-gradient-to-br from-sky-500 to-cyan-600',
   jobRelevance:
-    'En onboarding de data en bancos, fintech y retail en Perú, tu primer script "de verdad" no es un loop fancy: es leer campos de un formulario o CSV, saber qué tipo tiene cada valor, convertir texto a número sin crashear, y conservar el original para auditoría. Si confundes 42 con "42", usas float para soles o sobrescribes el raw al normalizar, generas bugs de calidad de datos caros. Esta sección construye esa base: valores, nombres, operadores e I/O hacia el parser de intake del capstone CP-N1-A. Parte de tu entorno de S01: activa el `.venv`, crea un archivo `parse_client_intake.py` en tu repo de práctica y corre las demos en Pyodide o en local con el mismo Python del venv.',
+    'En el onboarding de data en bancos, fintech y retail en Perú, tu primer script "de verdad" no es un bucle sofisticado: es leer campos de un formulario o CSV, saber qué tipo tiene cada valor, convertir texto a número sin que el programa falle, y conservar el original para auditoría. Si confundes `42` con `"42"`, usas `float` para soles o sobrescribes el `raw` al normalizar, generas bugs de calidad de datos caros. Esta sección construye esa base: valores, nombres, operadores e I/O hacia el parser de intake del capstone CP-N1-A. Parte de tu entorno de S01: activa el `.venv`, crea un archivo `parse_client_intake.py` en tu repo de práctica y corre las demos en Pyodide o en local con el mismo Python del venv.',
```

### D-R3 — Split run-on in `iDo.intro` (H)

```diff
--- a/src/lib/course/sections/s02-basics.ts
+++ b/src/lib/course/sections/s02-basics.ts
@@ -373,7 +373,7 @@
   iDo: {
     intro:
-      'Partiendo del entorno de S01 (`.venv` activo o el sandbox del navegador), te demuestro en Python puro el camino del registro de cliente: literales (T1-A), conversión (T1-B), nombres (T2-A), raw/alias (T2-B), operadores (T3-A), Decimal (T3-B), f-strings (T4-A) y parser con errores (T4-B). Copia cada demo, ejecútala y compara la salida. Datos 100% sintéticos — sin PII real.',
+      'Partiendo del entorno de S01 (`.venv` activo o el sandbox del navegador), te demuestro en Python puro el camino del registro de cliente. Recorreremos los 8 sub-temas en orden: literales (T1-A), conversión (T1-B), nombres (T2-A), raw/alias (T2-B), operadores (T3-A), `Decimal` (T3-B), f-strings (T4-A) y parser con errores (T4-B). Copia cada demo, ejecútala y compara la salida. Datos 100% sintéticos — sin PII real.',
     steps: [
```

### D-R4 — Split run-on in `iDo` step S02-T1-B-DEMO `why` (H)

```diff
--- a/src/lib/course/sections/s02-basics.ts
+++ b/src/lib/course/sections/s02-basics.ts
@@ -447,7 +447,7 @@
 '  ' → (False, None, "ERROR en \'edad\': valor vacío")
 isinstance(19, int) → True
 isinstance(\'19\', int) → False`,
         why: 'El contrato de tres ramas (vacío / OK / basura) es el mismo que usarás en el pipeline de dos campos, en el DEMO T4-B y en el You Do. isinstance separa "ya es int" de "sigue siendo texto"; el mensaje siempre nombra el campo y el valor recibido.',
+        why: 'El contrato de tres ramas (vacío / OK / basura) es el mismo que usarás en el pipeline de dos campos, en la demo T4-B y en el You Do. `isinstance` separa "ya es `int`" de "sigue siendo texto"; el mensaje siempre nombra el campo y el valor recibido.',
       },
```

### D-G4 — Convert pure-English `requirements` item to Spanish (M)

```diff
--- a/src/lib/course/sections/s02-basics.ts
+++ b/src/lib/course/sections/s02-basics.ts
@@ -1951,7 +1951,7 @@
       'Número inválido no lanza traceback no capturado; error listado',
       'safe_int trata vacío (tras strip) y ValueError con mensaje por campo',
       'Suite de tests (pytest o asserts) documentada y reproducible',
       'Sin PII real; datos sintéticos (example.com si hay email)',
-      'main() + if __name__ == "__main__"',
+      'Incluye una función `main()` y el guard `if __name__ == "__main__"`',
     ],
```

### D-E1 through D-E8 — Spanish-ize `tests` and `edgeCases` strings (M)

```diff
--- a/src/lib/course/sections/s02-basics.ts
+++ b/src/lib/course/sections/s02-basics.ts
@@ -891,7 +891,7 @@
         edgeCases: ['vacío', 'solo espacios', 'letras'],
-        tests: 'returns (ok, value|None, msg); 4 casos como en la demo de solución.',
+        tests: 'devuelve (ok, valor|None, msg); 4 casos como en la demo de solución.',
         feedback:
           'Una función safe_* reutilizable es el núcleo del parse gate. No uses eval.',
@@ -1018,7 +1018,7 @@
         edgeCases: ['evitar l/O/I', 'constantes en UPPER_CASE'],
-        tests: 'style pass: 5 nombres PEP8; sin l/O/I sueltos.',
+        tests: 'pasa estilo: 5 nombres PEP 8; sin l/O/I sueltos.',
         feedback: 'Nombres legibles reducen NameError y aceleran review.',
@@ -1108,7 +1108,7 @@
         edgeCases: ['apellido_paterno', 'sin espacios en identificadores'],
-        tests: 'rubric naming: 6 claves; snake_case; incluye apellido_paterno y apellido_materno.',
+        tests: 'rúbrica de nombres: 6 claves; snake_case; incluye apellido_paterno y apellido_materno.',
         feedback:
           'El rename de columnas es el primer commit de un pipeline real. Consistencia > creatividad.',
@@ -1176,7 +1176,7 @@
         edgeCases: ['is None idiom', '[] is [] es False'],
-        tests: 'prediction table: True, True, False, True, False.',
+        tests: 'tabla de predicción: True, True, False, True, False.',
         feedback:
           'Si internalizaste is None y no usar is para valores, evitaste una clase entera de bugs sutiles.',
@@ -1541,7 +1541,7 @@
         edgeCases: ['vacío', 'coma vs punto — documentar punto', 'quantize .01'],
-        tests: 'OK 150.50; vacío y abc con error; sin float',
+        tests: 'OK 150.50; vacío y abc con error; sin `float`',
         feedback:
           'Este parse_monto se enchufa al parser de intake cuando el CSV traiga un monto. Mismo contrato (ok, valor, error).',
@@ -1739,7 +1739,7 @@
         edgeCases: ['mensaje accionable', "raw '' se conserva"],
-        tests: 'test empty: raw==""; errors no vacío; nombres is None',
+        tests: 'caso vacío: raw==""; errors no vacío; nombres is None',
         feedback:
           'El caso vacío es el primero que rompe demos "felices". Si pasa el assert, el contrato raw/errors ya nació.',
@@ -1793,7 +1793,7 @@
         edgeCases: ['no ascii errors', 'Ñ y acentos'],
-        tests: 'test unicode: raw con espacios; clean == "Ñahui"',
+        tests: 'caso unicode: raw con espacios; clean == "Ñahui"',
         feedback:
           'Si Ñahui sobrevive, tu pipeline no es del siglo ASCII. Obligatorio en datos peruanos.',
@@ -1834,8 +1834,8 @@
         subtopicId: 'S02-T4-B',
         kind: 'transfer',
         instruction:
           'E3 (transferencia) — Implementa `parse_client(nombres, apellido_paterno, apellido_materno, contacto, direccion, edad=None)` con `*_raw`, limpios, `errors`, y `safe_int` para edad. Suite de 3 tests: feliz+Unicode, vacío en nombres, edad `"abc"`. Todos deben pasar.',
         hint: 'Reutiliza el patrón del DEMO T4-B. No dejes que ValueError se escape.',
-        edgeCases: ['raw preserved', '3 tests pass', 'lista errors'],
-        tests: '3 tests pass (unicode, empty, bad age)',
+        edgeCases: ['raw conservado', '3 pruebas pasan', 'lista de errores'],
+        tests: '3 pruebas pasan (unicode, vacío, edad inválida)',
         feedback:
           'Esta suite es el corazón del You Do. Si pasa en local y en Pyodide, el incremento CP-N1-A de S02 está listo.',
```

### D-T1 — Lowercase "DEMO T4-B" in prose (L687) (L)

```diff
--- a/src/lib/course/sections/s02-basics.ts
+++ b/src/lib/course/sections/s02-basics.ts
@@ -684,7 +684,7 @@
 [''ERROR en \'edad\': valor vacío'']
 [''ERROR en \'edad\': no se pudo convertir \'abc\' a int'']`,
         why: 'El gate no es "imprimió algo": son asserts sobre raw, Unicode y errores accionables. Esta demo modela el schema completo del You Do CP-N1-A.',
```
*(No change needed at L687 itself — the offending `DEMO T4-B` ALL-CAPS instances are at L116 and L450, both already covered by D-G1 and D-R4 above.)*

### D-T2 — Replace `>` with "gana a" (L1113, L1635) (L)

```diff
--- a/src/lib/course/sections/s02-basics.ts
+++ b/src/lib/course/sections/s02-basics.ts
@@ -1110,7 +1110,7 @@
         feedback:
-          'El rename de columnas es el primer commit de un pipeline real. Consistencia > creatividad.',
+          'Renombrar columnas es el primer `commit` de un pipeline real. La consistencia gana a la creatividad.',
@@ -1632,7 +1632,7 @@
         feedback:
-          'El reporte legible es lo que el analista pega en el ticket. Formato consistente > creatividad.',
+          'El reporte legible es lo que el analista pega en el ticket. El formato consistente gana a la creatividad.',
```

### D-T7 — Replace "claims de parentesco" with Spanish (L1937, L2067, L2201) (L)

```diff
--- a/src/lib/course/sections/s02-basics.ts
+++ b/src/lib/course/sections/s02-basics.ts
@@ -1934,7 +1934,7 @@
       'Imprimir resumen con f-strings',
     ],
     requirements: [
       'Función parse_client(...) devuelve estructura con *_raw y campos limpios o None',
       'Campo vacío → error accionable; no borrar raw',
       'Unicode (p.ej. José Ñahui) round-trip en raw y clean',
       'Número inválido no lanza traceback no capturado; error listado',
       'safe_int trata vacío (tras strip) y ValueError con mensaje por campo',
       'Suite de tests (pytest o asserts) documentada y reproducible',
       'Sin PII real; datos sintéticos (example.com si hay email)',
       'Incluye una función `main()` y el guard `if __name__ == "__main__"`',
     ],
@@ -2064,7 +2064,7 @@
     rubric: [
       { criterion: 'Parse y tipos correctos (correctness)', weight: '30%' },
       { criterion: 'Vacíos / Unicode / inválidos cubiertos (robustness)', weight: '25%' },
       { criterion: 'Nombres y mensajes claros (maintainability)', weight: '25%' },
-      { criterion: 'Datos sintéticos, sin PII, sin claims de parentesco (responsible_use)', weight: '20%' },
+      { criterion: 'Datos sintéticos, sin PII, sin afirmaciones de parentesco (responsible_use)', weight: '20%' },
     ],
@@ -2198,7 +2198,7 @@
         maintainability: '¿Identificadores legibles sin l/O/I?',
-        responsible_use: '¿Sin PII real ni claims de parentesco?',
+        responsible_use: '¿Sin PII real ni afirmaciones de parentesco?',
       },
```

### D-T8 — Standardize "PEP8" → "PEP 8" (L1021) (L)

Already covered by D-E2 above (the `tests:` string at L1021 contains "PEP8").

### D-N1 — Standardize contract name to "raw/clean" (L31, L1265) (M)

```diff
--- a/src/lib/course/sections/s02-basics.ts
+++ b/src/lib/course/sections/s02-basics.ts
@@ -1262,7 +1262,7 @@
         feedback:
-          'raw + clean es el contrato del You Do y del gate CP-N1-A. Si el assert pasa, ya piensas en auditoría.',
+          'El contrato raw/clean es el del You Do y del gate CP-N1-A. Si el assert pasa, ya piensas en auditoría.',
```
*(L31 already updated by D-R1 to "raw/clean".)*

### D-X1 — Align T1-A-E3 solution with `isinstance` guidance (L)

Either change the exercise to use `isinstance` OR add a clarifying note to the theory that `type(v) is t` is acceptable for *literal* type-checking (not subclass-aware validation). Recommended: add a clarifying note.

```diff
--- a/src/lib/course/sections/s02-basics.ts
+++ b/src/lib/course/sections/s02-basics.ts
@@ -69,7 +69,7 @@
         'Un **literal** es un valor escrito directamente en el código: `34`, `150.5`, `"Quispe"`, `True`, `None`. Python clasifica cada valor en un **tipo**. Los tipos básicos de S02 son: **`int`** (enteros: `0`, `34`, `-7`), **`float`** (punto flotante: `150.5`, `1.0`), **`str`** (texto Unicode: `"María José"`, `"Ñahui"`), **`bool`** (`True` / `False`) y **`None`** (ausencia de valor; su tipo es **`NoneType`**).',
         'La trampa clásica de intake: el número **`42`** (int) y el texto **`"42"`** (str) **no son el mismo valor**. `42 == "42"` es `False`. En formularios y CSV **casi todo llega como str**. Si sumas o comparas sin convertir, obtienes `TypeError` o lógica silenciosamente incorrecta. El teléfono **`999000111` debe modelarse como `str`**, no como `int`: no es una cantidad aritmética y puede tener ceros a la izquierda en otros países.',
-        'Para ver el tipo usa **`type(x)`** (devuelve la clase) o, en reportes didácticos, `type(x).__name__` (`"int"`, `"str"`, …). Más adelante preferirás `isinstance` para validar; primero entrenas el ojo con literales. Nota avanzada (no abuses): en Python **`bool` es subtipo de `int`**, así que `isinstance(True, int)` es `True`. Para lógica de negocio, trata `bool` como booleano, no como `0`/`1`, salvo que documentes una conversión explícita.',
+        'Para ver el tipo usa **`type(x)`** (devuelve la clase) o, en reportes didácticos, `type(x).__name__` (`"int"`, `"str"`, …). Más adelante preferirás `isinstance` para validar (acepta subtipos); primero entrenas el ojo con literales usando `type(v) is t`, que es estricto y útil para distinguir `bool` de `int`. Nota avanzada (no abuses): en Python **`bool` es subtipo de `int`**, así que `isinstance(True, int)` es `True` pero `type(True) is int` es `False`. Para lógica de negocio, trata `bool` como booleano, no como `0`/`1`, salvo que documentes una conversión explícita.',
       ],
```

### D-X2 — Fix PEP 8 anti-pattern endorsement in T2-A-E2 hint (L)

```diff
--- a/src/lib/course/sections/s02-basics.ts
+++ b/src/lib/course/sections/s02-basics.ts
@@ -1054,7 +1054,7 @@
         instruction:
           'E2 (independiente) — Bug hunt: el siguiente código tiene tres comparaciones rotas con `=` en lugar de `==`. Corrígelas para que imprima tres líneas `ok ...` sin SyntaxError.',
         hint: 'En cada if, cambia = por ==. No uses el operador walrus := en S02.',
         hints: [
           'En cada if, cambia = por ==. No uses el operador walrus := en S02.',
-          'if flag == True funciona; también puedes escribir if flag: — ambas aceptables aquí si el archivo corre.',
+          '`if flag == True:` funciona (corrigiendo `=` → `==`); para banderas booleanas, PEP 8 prefiere `if flag:`. Ambas compilan y resuelven el SyntaxError del ejercicio.',
         ],
```

### D-RC1 — Move "Python Tutorial" from `books` to `docs` (L)

```diff
--- a/src/lib/course/sections/s02-basics.ts
+++ b/src/lib/course/sections/s02-basics.ts
@@ -2287,6 +2287,11 @@ export const section02: CourseSection = {
         url: 'https://www.py4e.com/html3/02-variables',
         note: 'Variables y tipos progressive disclosure',
       },
+      {
+        label: 'Python Tutorial (oficial) como lectura secuencial',
+        url: 'https://docs.python.org/3/tutorial/',
+        note: 'Caps. de intro y estructuras: literales, tipos, I/O básico.',
+      },
     ],
     books: [
       {
-        label: 'Python Tutorial (oficial) como libro corto',
-        note: 'Caps. de intro y estructuras: literales, tipos, I/O básico.',
-      },
-      {
         label: 'Fluent Python (referencia posterior)',
         note: 'Profundiza mutabilidad e identidad; no es lectura obligatoria de S02.',
       },
     ],
```

### D-RC4 — Spanish-ize "progressive disclosure" note (L)

```diff
--- a/src/lib/course/sections/s02-basics.ts
+++ b/src/lib/course/sections/s02-basics.ts
@@ -2284,7 +2284,7 @@
       {
         label: 'Python for Everybody — types chapter',
         url: 'https://www.py4e.com/html3/02-variables',
-        note: 'Variables y tipos progressive disclosure',
+        note: 'Variables y tipos con progresión gradual',
       },
```

### D-G8 — Replace colloquial "se enchufa" (L1546) (L)

Already covered by D-E1 batch (the `feedback` line at L1546 is adjacent to the `tests` line at L1544). Explicit standalone diff:

```diff
--- a/src/lib/course/sections/s02-basics.ts
+++ b/src/lib/course/sections/s02-basics.ts
@@ -1543,7 +1543,7 @@
         feedback:
-          'Este parse_monto se enchufa al parser de intake cuando el CSV traiga un monto. Mismo contrato (ok, valor, error).',
+          'Este `parse_monto` se conecta al parser de intake cuando el CSV traiga un monto. Mismo contrato (ok, valor, error).',
```

### D-G5 — Remove Oxford comma (L33) (L)

```diff
--- a/src/lib/course/sections/s02-basics.ts
+++ b/src/lib/course/sections/s02-basics.ts
@@ -30,7 +30,7 @@
         'El hilo conductor es un **registro sintético de cliente** (nombres, dos apellidos, contacto, dirección, y a veces edad o monto). Todo el material usa datos ficticios (`example.com`, teléfonos inventados). Nunca subas PII real al repo. Caso de laboratorio: `CASO-LIM-002`.',
+        'El hilo conductor es un **registro sintético de cliente** (nombres, dos apellidos, contacto, dirección y a veces edad o monto). Todo el material usa datos ficticios (`example.com`, teléfonos inventados). Nunca subas PII real al repo. Caso de laboratorio: `CASO-LIM-002`.',
```

---

## 8. Recommended Priority Order for Fixing

| Priority | Issue IDs | Effort | Rationale |
|---|---|---|---|
| **P0 — must fix** | G1 (concordance error "otro basura" → "otra basura") | 1 char | Real Spanish grammar error in a section that teaches grammar-of-data. Highest-visibility correctness issue. |
| **P0 — must fix** | G4 (`requirements` item is pure English) | 1 line | Learner-facing Spanish list has an English/code-only entry. Trivial fix. |
| **P1 — should fix** | R1, R3, R4 (run-ons in opening map + iDo.intro + iDo.why) | 3 lines | Cognitive-load harm on first contact with the section. Each is a 1-line edit that splits one sentence into 2–3. |
| **P1 — should fix** | E1–E8 (English-dominant `tests`/`edgeCases`) | ~10 lines | Inconsistent Spanish/English mixing in learner-rendered grader hints. Batch fix. |
| **P1 — should fix** | X1, X2 (exercise/theory contradictions: `type` vs `isinstance`, `flag == True`) | 2 lines | Pedagogical contradictions between theory and exercises. |
| **P2 — nice to have** | N1 (contract naming "raw vs clean" / "raw + clean" / "raw/clean") | 2 lines | Naming consistency. |
| **P2 — nice to have** | T1, T2, T3, T7, T8 (typographic polish: ALL-CAPS, `>`, `#1`, "claims", "PEP8") | ~6 lines | Polish. |
| **P3 — optional** | G5 (Oxford comma), G7 ("artefacto 'de data'"), G8 ("se enchufa"), G9 ("unit-testear"), G10 ("no pisar la fuente"), C1 (opening map segmentation), C2 (`safe_int` contract → bullet list) | ~6 lines | Style/voice refinements; depends on desired register (formal vs. conversational). |
| **P3 — optional** | RC1, RC4 (resources categorization + English note) | 2 lines | Resources polish. |
| **P4 — schema-level (cross-section)** | `hint` + `hints[]` redundancy (every We Do exercise has both a `hint` field and a `hints[0]` that duplicate it) | ~24 lines (this section) | Schema design issue, not a content bug. Decide at the `CourseSection` type level whether to keep both fields. Out of scope for a single-section fix. |

**Estimated total effort for P0+P1+P2:** ~25 line edits, ~30 minutes of careful editing. All edits are string-only (no logic, no schema change).

---

## 9. Graph Memory Update Notes (for shared context files)

The following notes are for the orchestrator / shared graph memory of the audit campaign. They record cross-section patterns observed in S02 that may recur in other sections and should inform the orchestrator's final synthesis.

### 9.1 Patterns observed in S02 likely to recur

1. **`tests:` and `edgeCases:` English/Spanish mixing** — S02 has 8 English-dominant `tests` strings and 3 English `edgeCases` entries. If this pattern is section-wide, the Fixer should consider a single regex-based pass: `s/^(\s*tests:\s*)([a-z])/\1/es-ize` with a small dictionary. **Recommend the orchestrator flag this as a cross-section cleanup task.**
2. **`hint` + `hints[]` duplication** — Every We Do exercise in S02 has a `hint` string field AND a `hints[]` array whose `[0]` element duplicates `hint`. This is a `CourseSection` schema-level redundancy. **Recommend the orchestrator check whether the type definition (`src/lib/types.ts`) requires both, and if not, flag for cleanup.**
3. **ALL-CAPS `DEMO` mid-prose** — S02 uses "DEMO T4-B" in 3 prose locations. If this is a cross-section authoring habit, a single Fixer pass can normalize to lowercase "demo T4-B" (or backtick-wrapped).
4. **"raw/clean" contract naming drift** — S02 uses 3 variants. Other sections referencing the same contract should use the canonical form established here. **Recommend the orchestrator pick `raw/clean` (with `/errors` when the third element is in scope) and propagate.**
5. **Anglicism load** — S02 uses ~30+ English tech terms inline (`raw`, `clean`, `gate`, `helper`, `tests`, `asserts`, `junior`, `code review`, `pipeline`, `commit`, `ticket`, `scoring`, `lab`, `demos`, `browser`, `schema`, `rename`, `clever one-liner`, `loop fancy`, `crashear`, `unit-testear`, `claims`, `progressive disclosure`). This is acceptable LATAM tech register but the count is high. **Recommend the orchestrator track anglicism density per section to identify outliers.**
6. **Forward-reference density in opening "Mapa de la sección"** — S02 introduces 5+ forward references in the opening theory block. If other Phase-0 sections do the same, learners may experience cumulative cognitive overload. **Recommend the orchestrator spot-check S03–S05 opening blocks.**
7. **Cross-references to `CASO-LIM-NNN` and `CP-N1-A`** — S02 uses these consistently. **Recommend the orchestrator verify that S03+ continue the `CASO-LIM-NNN` convention (or whatever city/case code matches their lab scenario) and that `CP-N1-A` references are consistent with the capstone roadmap.**

### 9.2 Patterns observed in S02 that are exemplary (model for other sections)

1. **I Do / We Do / You Do fidelity** — 8 demos (1 per sub-topic) + 24 We Do exercises (3 per sub-topic, progressive `guided → independent → transfer`) + 1 You Do capstone increment with 4-test harness. **This is the gold-standard structure; recommend the orchestrator use S02 as the benchmark for I/We/You Do fidelity scoring.**
2. **Authentic Peruvian context** — Soles, IGV, Unicode surnames (Quispe, Ñahui), Lima/Cusco, 9-digit phones, DNI-as-text. **Recommend the orchestrator benchmark cultural-grounding scores against S02.**
3. **Zero meta-leak** — No developer comments, AI notes, design notes, or authoring residue anywhere in the learner-facing prose. **Recommend the orchestrator benchmark meta-leak cleanliness against S02.**
4. **`responsible_use` rubric criterion** — Every rubric (You Do + 4 topic evaluations) includes a `responsible_use` criterion covering PII, eval, float-for-money, and parentesco claims. **This is a distinctive pedagogical innovation; recommend the orchestrator verify it propagates to later sections.**
5. **Advance-organizer "Mapa de la sección"** — Even though the execution is dense, the *intent* (5-paragraph map with "Antes de T1, tres ideas base" + "Orden pedagógico" + "Ritmo sugerido") is excellent. **Recommend the orchestrator encourage this pattern in other sections, with the caveat to segment the map into shorter sentences.**
6. **`portfolioNote` linking capstone to interview readiness** — S02 explicitly tells the learner "En entrevistas te pedirán extenderlo". **Recommend the orchestrator verify that other capstone-increment sections (S26, S39, S51) include similar portfolio notes.**

### 9.3 Grammar-metric summary for S02 (for cross-section comparison)

| Metric | S02 value | Interpretation |
|---|---|---|
| Prose records | 391 | High volume (S02 is a long section). |
| Total words | 6,113 | High. |
| Total sentences | 575 | Healthy segmentation. |
| Mean WPS (all records) | 10.6 | Healthy (target 15–32 for technical ES; lower because many records are short labels/hints). |
| Mean WPS (paragraphs only) | 19.2 | Within healthy band. |
| Mean SPW | 1.84 | Healthy (Spanish averages ~1.8–2.2). |
| FH median (all records, ≥5 words) | 83.6 ("fácil") | Healthy for technical curriculum. |
| FH mean | 83.3 | Healthy. |
| FH stdev | 26.7 | High variance — driven by code-fragment strings (low FH) and short labels (high FH). Real prose paragraphs cluster in FH 60–95. |
| Records with run-on (>45 wc) | 5 | Fixable. |
| Records with long sentence (>32 wc) | 8 additional | Fixable. |
| Records with `meta_leak` | 0 | Clean. |
| Records with `missing_terminal` | 76 | Mostly false positives on labels/titles/objectives/requirements (which are list items by design). Real prose paragraphs all have terminal punctuation. |
| Records with `high_comma_density` | 27 | Most are code-adjacent lists (acceptable). |
| Records with `space_before_punct` | 14 | Minor; mostly inside `f"..."` template strings where `:` follows format spec — false positives. |
| Records with `double_space` | 7 | Minor; mostly inside code blocks (false positives). |
| Records with `repeated_word` | 0 | Clean. |
| Records with `gerund_pileup` | 0 | Clean. |
| Records with `missing_inverted_question/excl` | 0 | Clean (all `¿`/`¡` are properly paired). |

### 9.4 Worst 5 sentences in S02 (by grammar/structure)

1. **L116 (theory T1-B ¶3)** — 52 words, contains concordance error G1, packs 3-clause contract + connective tail. **The single worst sentence in the section.**
2. **L376 (iDo.intro)** — 52 words, packs 8 demo references + 3 instructions + PII disclaimer.
3. **L31 (theory T1-A ¶2)** — 49 words, packs 4 forward-references + raw/clean contract + PII policy + study hint.
4. **L450 (iDo S02-T1-B-DEMO why)** — 48 words, packs contract definition + 3 forward references + isinstance explanation.
5. **L15 (jobRelevance)** — 47 words, packs scenario + 4-clause failure-mode + section link + S01 setup.

All 5 are addressed by Diffs D-G1, D-R1, D-R3, D-R4, D-R5 above.

### 9.5 Best 5 sentences in S02 (voice, clarity, memorability — model for other sections)

1. **L583 (iDo S02-T3-B-DEMO why)** — "En soles, float miente. Decimal desde str + quantize(0.01) es el contrato mínimo de montos en onboarding de data financiera en Perú." (2 short sentences, memorable, grounded.)
2. **L1798 (weDo T4-B-E2 feedback)** — "Si Ñahui sobrevive, tu pipeline no es del siglo ASCII. Obligatorio en datos peruanos." (Voice-y, memorable, culturally grounded.)
4. **L687 (iDo S02-T4-B-DEMO why)** — "El gate no es 'imprimió algo': son asserts sobre raw, Unicode y errores accionables. Esta demo modela el schema completo del You Do CP-N1-A." (Clear, grounded, forward-linking.)
5. **L1454 (weDo T3-B-E1 feedback)** — "Si viste la basura del float, ya tienes el argumento de code review para exigir Decimal en soles." (Pragmatic, agency-granting.)
6. **L2062 (portfolioNote opening)** — "Este esqueleto demuestra tipos, conversión segura, nombres PEP 8, preservación de raw e I/O con f-strings — el primer artefacto de datos de tu portafolio." (Synthesizes the section's outcomes into a portfolio framing.)

---

## 10. Method Note (Grammar Dimension)

Per the grammar subplan (`_GRAMMAR_SUBPLAN.md`), the following research-backed methods were applied:

### A. Spanish readability formulas
- **Fernández-Huerta (1959):** `206.84 − 60·(syllables/word) − 1.02·(words/sentence)` — Spanish Flesch adaptation. Computed per prose record and per real paragraph.
- **Szigriszt-Pazos / INFLESZ:** `206.835 − 62.3·(syllables/word) − (words/sentence)` — computed alongside FH for cross-validation.
- **WPS (words per sentence)** and **SPW (syllables per word)** — computed via a Spanish-aware vowel-group syllable heuristic.
- **FH interpretive bands:** ≥90 muy fácil, 80–89 fácil, 70–79 bastante fácil, 60–69 normal, 50–59 bastante difícil, 30–49 difícil, <30 muy difícil.

### B. Rule-based grammar/style engine
- **LanguageTool (`language=es`)** was NOT called via HTTP in this run (the agent-browser could not launch due to disk-space constraints, and the orchestrator's policy is heuristic-only fallback if API is unreachable). All findings are heuristic-only, with the known false-positive classes documented (code-adjacent Spanish, tech nouns, template `${}` interpolations).

### C. Pedagogical Spanish heuristics (applied offline to every sentence and every paragraph)
| Rule | S02 findings | Notes |
|---|---|---|
| Run-on (>45 wc) | 5 | All 5 are real prose paragraphs/why-strings; all addressed by diffs. |
| Long (>32 wc) | 8 additional | Mix of real prose and dense instruction strings. |
| Missing terminal `.?!` | 76 | Mostly false positives on labels/titles/objectives (list items by design). |
| Missing `¿` / `¡` | 0 | Clean. |
| Unbalanced delimiters | 0 | Clean. |
| Repeated word (`de de`) | 0 | Clean. |
| DET–NOUN number cue | 1 (manual) | G1: "otro basura" → "otra basura". |
| English-dominant sentence | 9 | E1–E8 + G4. |
| Meta/AI/TODO leak | 0 | Clean. |
| Gerund pile-up (≥3) | 0 | Clean. |
| High comma density | 27 | Mostly code-adjacent; acceptable. |
| Paragraph = one long sentence | 2 | L34 (100-wc single sentence) and L116 (52-wc single sentence). |
| Anaphoric monotony | 0 (manual) | Sentence openings vary well. |
| Space-before-punct / double space | 14 + 7 | Mostly false positives inside `f"..."` format specs. |

### D. Composite section score
Start at 10; subtract weighted findings:
- 1 H grammar error (G1): −0.5
- 4 H run-ons (R1, R2, R3, R4): −0.4 (−0.1 each)
- 8 M English-dominant `tests`/`edgeCases` (E1–E8): −0.4 (−0.05 each)
- 1 M pure-English `requirements` (G4): −0.1
- 1 M contract naming inconsistency (N1): −0.1
- 2 M exercise/theory contradictions (X1, X2): −0.2
- ~10 L typographic/style polish (T1–T8, G5, G7, G8, G9, G10): −0.4 (−0.04 each)
- 1 L resources categorization (RC1): −0.05
- Light FH penalty (median 83.6 is "fácil", no penalty)
- Density-normalize: 575 sentences, ~17 H/M findings → 0.03 findings/sentence (low density)

**Composite: 10 − 0.5 − 0.4 − 0.4 − 0.1 − 0.1 − 0.2 − 0.4 − 0.05 = 7.85 → rounded to 7.5 (with minor deduction for opening-map cognitive load C1/C2).**

---

## 11. Validation

- ✅ Nonzero prose extraction: 391 records, 6,113 words.
- ✅ FH in plausible range: median 83.6, mean 83.3, stdev 26.7 (all within 0–100 Spanish FH range; outliers are code-fragment strings, a documented false-positive class).
- ✅ Documented false-positive classes: code-adjacent Spanish (high SPW from code tokens), template `${}` interpolations (stripped before analysis), list-item labels (missing-terminal false positives).
- ✅ Every extracted real prose paragraph scored with FH/INFLESZ/WPS/SPW (see §6.1–§6.7 per-paragraph metrics).
- ✅ Findings include severity, cause, improvement, excerpt (see §3 Issue Registry).
- ✅ No automatic rewrites applied (audit-only; diffs proposed but not applied).
- ✅ Method note documented (§10).
- ✅ Cause → improvement playbook with section-specific samples (§6 paragraph-by-paragraph rewrites).

---

**This is the complete Explorer report for Section 2. Ready for the Fixer prompt.**
