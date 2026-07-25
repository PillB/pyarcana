# PyArcana — Section 45 Curriculum Audit Report (S45)

> **Auditor:** Curriculum Auditor (general-purpose subagent)
> **Section:** 45 (`section45`, `id: "iac"`)
> **Source file:** `src/lib/course/sections/s45-iac.ts` (1,978 lines)
> **Live site:** https://pillb.github.io/pyarcana/ — Section 45 = "Cloud y colas"
> **Repo:** https://github.com/PillB/pyarcana (verified at `/home/z/my-project/pyarcana_repo`)
> **Method:** Stanford STORM + Graph/Loop/Harness Engineering; Spanish readability (Fernández-Huerta, INFLESZ, WPS/SPW) + LanguageTool `es` (public API) + offline pedagogical heuristics from `_GRAMMAR_SUBPLAN.md`.
> **Audit-only:** No edits applied. All diffs are proposals.

---

## 1. Section Identification & Scope

**Confirmed Section identity (live site + source).** The home page at https://pillb.github.io/pyarcana/ renders Section 45 with:

- `shortTitle`: `"Cloud y colas"`
- `tagline` (verbatim): `"job asíncrono con artifact store, status, retry y dead-letter; permisos y costos presupuestados"`
- `index: 45`, `phase: 3` (Master), `estimatedHours: 20`, `level: 'Master'`, `icon: 'Cloud'`
- `accentColor: "bg-gradient-to-br from-amber-500 to-red-600"`

The live index entry was located on the rendered page (rendered HTML includes `<h3>Cloud y colas</h3>` and the verbatim tagline; the `iac` `id` appears as a `data-`/state value). Source TS file `s45-iac.ts` matches the rendered entry field-for-field.

**Scope audited (all learner-facing prose):**

| Field group | Count audited |
|---|---|
| `tagline`, `jobRelevance`, `learningOutcomes[*].text` | 1 + 1 + 8 |
| `theory[*].heading` + `paragraphs[*]` + `callout.{title,content}` + `code.title` | 9 headings, ~24 paragraphs, 9 callouts |
| `iDo.intro` + 8 × `iDo.steps[*].{description,why}` | 1 + 16 |
| `weDo.intro` + 24 × `weDo.steps[*].{instruction,hint,hints[],edgeCases[],tests,feedback}` | 1 + ~120 strings |
| `youDo.{title,context,objectives[],requirements[],portfolioNote,rubric[].criterion}` | ~25 strings |
| `selfCheck.questions[*].{question,options[],explanation}` | 7 × ~6 = ~42 strings |
| `resources.{docs,books,courses}[*].{label,note}` | ~30 strings |

**Total Spanish prose units extracted and scored: 187 records (165 Spanish) → 260 sentences** (after filtering code-only / English-only scaffolding strings). Full extraction: `/home/z/my-project/audits/S45_records.json`, `/home/z/my-project/audits/S45_metrics.json`, `/home/z/my-project/audits/S45_lt.json`, `/home/z/my-project/audits/S45_prose.txt`.

**Section structure (verified):**
- 8 theory subsections (T1-A, T1-B, T2-A, T2-B, T3-A, T3-B, T4-A, T4-B)
- 8 I-Do demos (1 per subtopic)
- 24 We-Do exercises (3 per subtopic; E1=guided, E2=independent, E3=transfer)
- 1 You-Do portfolio project (CP-N4-B gate)
- 7 Self-check multiple-choice questions
- 6-weighted rubric (25% + 20% + 15% + 15% + 15% + 10% = 100%)
- 10 docs / 2 books / 6 courses in `resources`

---

## 2. Executive Summary of Quality

**Composite score: 7.6 / 10**

**Verdict:** Section 45 is a **technically rigorous, well-architected Master-level platform/cloud-infrastructure section**. The pedagogical scaffolding (I Do → We Do → You Do → Self-check, with E1/E2/E3 decreasing-scaffolding pattern, I-Do "pienso en voz alta" `why` blurbs, and explicit theory/code/callout triples) is **best-in-class for the course**, the synthetic-fixture discipline (`CASO-IQU-045` / Iquitos ficticio; no PII, no real cloud, no egress, PEN soles sintéticos) is exemplary, and the bridge from S44 (consume el artefacto del pipeline) and forward to the CP-N4-B gate is the strongest narrative spine in the second half of the course.

The score is held back from 8.5+ by **fixable** issues:

1. **One HIGH-severity curriculum-meta leak**: `"El dueño de S45-T4-A responde por rollback y evidencia."` (callout L282) refers to an internal curriculum owner-role ("dueño de subtema") — not a job/technical role — and breaks learner immersion. (Issue S45-ISSUE-01)
2. **16 tautological stub assertions in `solutionCode`**: 16 of 24 We-Do solution snippets end with `meets_contract = ('1A-0' == '1A-0')` (and similar) followed by `print('meets_contract', meets_contract)`. These are authoring residue — they compare a string literal to itself (always `True`), assign that to a variable named `meets_contract` (which is misleading because the assertion has nothing to do with the actual contract), and pollute the learner-visible solution with tautological noise. (Issue S45-ISSUE-02)
3. **24/24 weDo steps duplicate `hint:` verbatim as `hints[0]`** — same pattern flagged in S01 and S37 audits. (Issue S45-ISSUE-03)
4. **Gender concord defect** in `learningOutcomes[7]`: `"…documentar recovery y portabilidad ensayadas"` — `recovery` (masculine English loan) + `portabilidad` (feminine) → mixed-gender plural should default to masculine: `"ensayados"`. LanguageTool `AGREEMENT_PARTICIPLE_NOUN` flagged. (Issue S45-ISSUE-04)
5. **`"vs"` without period** in 4 prose locations (L290, L326, L496, L1575). Spanish abbreviation is `"vs."` per RAE. LanguageTool `PUNTO_EN_ABREVIATURAS` flagged. (Issue S45-ISSUE-05)
6. **`"environments"` (English plural) in heading L286 vs `"entorno"` (Spanish) used 10× in body** — register inconsistency. (Issue S45-ISSUE-06)
7. **`"environment"` (English singular) in `learningOutcomes[6]` (L23), in `theory[6].paragraphs[0]` (L30) and `iDo.steps[6].why` (L543)** vs `"entorno"` everywhere else. (Issue S45-ISSUE-06 companion)
8. **`"terminalización"` neologism** (L20, L1792) — not in RAE; understandable technical calque but stylistically inconsistent with the rest of the section which uses `"terminalización en DLQ"` (made-up verb/noun from English "to terminalize"). Could be `"envío a terminal en DLQ"` or `"terminación en DLQ"`. (Issue S45-ISSUE-07)
9. **`"capturazo"` Peruvian colloquial** (L109) appears in formal theory prose ("no un capturazo de consola"). Tone mismatch with the formal `"evidencia medible" / "restore sintético"` register used elsewhere; should be `"captura de consola"` or `"pantallazo"`. (Issue S45-ISSUE-08)
10. **`"fail-closed"` used inline as English term** (5 prose occurrences, no backticks, no translation). Acceptable as a known security-design term but should at minimum be italicized or backticked on first use; `"comportamiento fail-closed"` or `"cierre por defecto"` would be the Spanish gloss. (Issue S45-ISSUE-09)
11. **`"un checklist de booleans"`** (L1856) — English noun phrase in a `portfolioNote`; should be `"una lista de verificación de booleanos"` or `"una lista de verificación (checklist) de booleanos"`. LanguageTool `AGREEMENT_DET_NOUN` flagged. (Issue S45-ISSUE-10)
12. **Extreme callout-title monotony**: 8 of 9 callouts share the identical title `"Contrato local"` (the 9th is `"Gate de promoción y carga de trabajo"`). This is fine for signposting but borderline anaphoric. (Issue S45-ISSUE-11)
13. **Extreme paragraph-template monotony**: all 8 theory subtopic mid-paragraphs begin with the exact string `"Contrato local de este subtema. **Entrada:** … **Salida:** … **Error:** … **Éxito medible:** … En \`CASO-IQU-045\`: … Si falta … enruta a …"`. Pedagogically defensible (predictable scaffolding) but compresses 4-5 bolded labels into a single dense paragraph (cognitive load) — could be reformatted as a definition list or split into 2 paragraphs. (Issue S45-ISSUE-12)
14. **`"el environment es válido"`** (L543) — English noun embedded mid-sentence where the surrounding text uses `"entorno"`. (Issue S45-ISSUE-06, third instance)
15. **One long sentence** (`weDo.intro` L576, WPS=35, FH=66.6) — packs the E1→E2→E3 contract into a single 35-word sentence with two semicolons; could be split. (Issue S45-ISSUE-13)
16. **`"no un print decorativo"`** (L571) — `"print"` used as Spanish noun; could be `"no basta una impresión decorativa"` or `"no basta un print decorativo"` (with backticks around `print`). (Issue S45-ISSUE-14)
17. **Forward-reference duplication**: `"Cierre de S45-T4-B: residual risk y límites del lab stdlib."` (L318 callout, end of T4-A) and `"Cierre de S45-T4-B: conserva alarma de costo y recuperación documentadas…"` (L351 callout, end of T4-B). The L318 callout is a forward-reference to the *next* subtopic's closure, which is mildly confusing — callouts usually close their own subtopic. (Issue S45-ISSUE-15)
18. **Section id `"iac"` and file name `s45-iac.ts` cover only 1 of 8 subtopics** (T4-A IaC). The section is broader (cloud, storage, queues, IAM, networks, IaC, costs). Less severe than S37's `dbt-bigquery` mismatch (where the id was completely unrelated to the content), but still a mild curriculum-contract violation: a learner inspecting the URL/state sees `iac` and expects an IaC-only topic, when the section is closer to "platform contracts". (Issue S45-ISSUE-16)
19. **`"residual risk y límites del lab stdlib"`** (L318 callout) — code-switches English `"residual risk"` mid-Spanish-sentence; should be `"riesgo residual y límites del laboratorio con stdlib"`. (Issue S45-ISSUE-17)
20. **8 occurrences of `"Salida: imprime el valor de meets_contract."`** in E3 instructions — fixed template that signals to learners "we couldn't think of a unique success criterion, just print the boolean" — mildly defensible but borders on lazy scaffolding. (Issue S45-ISSUE-18)

None are catastrophic. Pedagogically the section is sound; the fixes are mostly cleanup, concordance, and consistency.

---

## 3. Detailed Issue Registry

Issues are numbered `S45-ISSUE-NN`. Severity: **H** = High (blocks learning or leaks internals), **M** = Medium (clarity/quality defect), **L** = Low (polish).

### Meta-leak & internal-residue issues

#### S45-ISSUE-01 — Curriculum-owner role leaked into learner-facing callout ("El dueño de S45-T4-A responde…") [H]
- **Location:** `theory[5].callout.content` (L282). Callout for theory subtopic S45-T3-B (`IAM, paths privados y egress`).
- **Evidence (verbatim):** `"El dueño de S45-T4-A responde por rollback y evidencia."`
- **Context:** This callout closes the T3-B theory subsection (IAM/egress) but refers to "el dueño de S45-T4-A" — i.e., the *owner of the next subtopic* (T4-A IaC). The phrase "dueño de S45-T4-A" is curriculum-process jargon: it presupposes a course-internal convention that each subtopic has a designated owner (probably the instructor / a teaching-assistant role), a concept that has **zero learning value** for a Master-level learner studying IAM least-privilege. The forward reference also breaks immersion ("why are we talking about T4-A's owner in the T3-B callout?").
- **Pedagogical impact:** Three compounding harms:
  1. **Confusion**: a learner reading the T3-B closure expects an IAM/egress takeaway, not a meta-note about who "owns" the next subtopic.
  2. **Curriculum-meta leak**: the very concept of "dueño de subtema" is internal course logistics, not platform engineering.
  3. **Forward-reference whiplash**: closure should close, not preview. The companion T4-A callout (L318) itself previews T4-B closure (Issue S45-ISSUE-15), compounding the whiplash.
- **Severity:** H.

#### S45-ISSUE-02 — 16 tautological stub assertions `meets_contract = ('1A-0' == '1A-0')` in solutionCode [H]
- **Location:** 16 of the 24 `weDo.steps[*].solutionCode` blocks. Lines 665, 722, 815, 872, 965, 1022, 1115, 1172, 1265, 1322, 1415, 1472, 1565, 1622, 1715, 1772.
- **Evidence (verbatim, L665 inside `s45-t1-a-e2.py`):**
  ```python
  results = (assess(valid), assess(invalid), assess(incomplete))
  print(*results)
  meets_contract = ('1A-0' == '1A-0')
  print('meets_contract', meets_contract)
  ```
  The pattern recurs across E2 and E3 solutions of all 8 subtopics (16 occurrences). The string literal changes per exercise (`'1A-0'`, `'1B-2'`, `'2A-4'`, `'2B-6'`, `'3A-8'`, `'3B-10'`, `'4A-12'`, `'4B-14'` for E2; `'1A-1'`, `'1B-3'`, `'2A-5'`, `'2B-7'`, `'3A-9'`, `'3B-11'`, `'4A-13'`, `'4B-15'` for E3).
- **What the stub does:** Compares a string to itself (always `True`), assigns to a variable named `meets_contract`, and prints `meets_contract True`. The actual contract test is the **preceding** `assert results == [...]` line, which is correct.
- **Pedagogical impact:** Three compounding harms:
  1. **Authoring residue**: clearly a debugging/template stub that was never cleaned up. The strings `'1A-0'`, `'1B-2'`, etc. look like internal exercise indices (`1A` = subtopic T1-A, `0`/`2` = exercise variant counter).
  2. **Misleading variable name**: a learner inspecting the solution sees `meets_contract = ('1A-0' == '1A-0')` and could reasonably infer that `meets_contract` is testing the contract — it isn't. It's a no-op.
  3. **Noise in solution output**: the rendered solution prints `meets_contract True` after the actual results, which a learner might confuse with a contract verdict.
- **Severity:** H.

#### S45-ISSUE-03 — `hint:` field duplicated verbatim as `hints[0]` in all 24 weDo steps [M]
- **Location:** Every `weDo.steps[*]` block (lines ~580–1775). Example, L583–585:
  - `hint: "Relaciona los campos \`blob_store\`, \`transactions\`, \`cache_authoritative\`, \`cache_ttl_s\` con la regla explicada en S45-T1-A.",`
  - `hints: [`
  - `"Relaciona los campos \`blob_store\`, \`transactions\`, \`cache_authoritative\`, \`cache_ttl_s\` con la regla explicada en S45-T1-A.",`
- **Evidence:** 24/24 weDo steps duplicate the `hint:` field verbatim as `hints[0]`. Same pattern flagged in S01 and S37 audits.
- **Pedagogical impact:** (a) Source bloat — ~24 redundant lines; (b) Divergence risk — if `hint` is updated but `hints[0]` is not (or vice versa), learners see inconsistent hints depending on which field the renderer picks; (c) The single-string `hint` field is redundant with the array `hints` and could be removed entirely (or vice versa, the array could replace the single field).
- **Severity:** M.

#### S45-ISSUE-04 — Gender concord defect: `"recovery y portabilidad ensayadas"` [M]
- **Location:** `learningOutcomes[7].text` (L24).
- **Evidence (verbatim):** `"Presupuestar costo/cuotas (montos en PEN sintéticos) y documentar recovery y portabilidad ensayadas"`
- **Grammar rule:** `recovery` (English loanword, treated as masculine in Spanish tech prose) + `portabilidad` (feminine) → mixed-gender plural noun phrase. RAE prescribes **masculine plural default** for mixed-gender concord: `ensayados`, not `ensayadas`.
- **LanguageTool evidence:** Rule `AGREEMENT_PARTICIPLE_NOUN` fired on the concatenated prose chunk (see `/home/z/my-project/audits/S45_lt.json`).
- **Internal inconsistency:** Three other occurrences in the same section use the masculine default correctly: `"recovery y portabilidad ensayados"` (line 571, 1673, 1729 — wait, let me re-verify: L571 says `"el drill de restore y el export portable están ambos ensayados"` (masculine plural `ensayados` ✓); L1673 says `"recovery/portability ensayados"` ✓; L1729 says `"recovery/portability ensayados"` ✓). So the section is internally split, with L24 being the outlier.
- **Pedagogical impact:** Grammatical defect; high-seniority learners writing Spanish PRs will copy the form.
- **Severity:** M.

#### S45-ISSUE-05 — `"vs"` without period (4 occurrences) [L]
- **Location:** L290, L326, L496, L1575.
- **Evidence (verbatim):**
  - L290 (theory T4-A ¶1): `"recursos declarados vs planificados"`
  - L326 (theory T4-B ¶1): `"forecast vs budget (PEN), uso vs límite de cuota"`
  - L496 (iDo why T3-A): `"La señal correcta es backlog vs umbral"`
  - L1575 (weDo S45-T4-A-E3 instruction): `"Decide apply vs rechazo"`
- **Grammar rule:** Spanish abbreviation for "versus" is `vs.` (with period), per RAE.
- **LanguageTool evidence:** Rule `PUNTO_EN_ABREVIATURAS` fired (see `/home/z/my-project/audits/S45_lt.json`).
- **Pedagogical impact:** Typographic inconsistency; Spanish formal writing prescribes the period.
- **Severity:** L.

#### S45-ISSUE-06 — `"environments"` (English) in heading vs `"entorno"` (Spanish) in body [M]
- **Location:**
  - L286 (theory[6].heading): `"Configuración declarativa y environments"` — English plural in heading.
  - L23 (learningOutcomes[6].text): `"Declarar infraestructura por environment y rechazar planes con secretos o destrucción inesperada"` — English singular in learning outcome.
  - L30 (theory[0].paragraphs[0]): `"IaC: infra declarativa por environment (T4-A)"` — English singular in diccionario de la sección.
  - L290 (theory[6].paragraphs[0]): `"recursos declarados vs planificados, environment, flags de secretos"` — English singular in body.
  - L543 (iDo.steps[6].why): `"el environment es válido"` — English singular mid-sentence.
- **Counter-evidence:** 10 occurrences of `"entorno"` (Spanish) elsewhere in body: L289, L291, L1482, L1488, L1523, L1525, L1579, L1581, L1794.
- **Pedagogical impact:** Register inconsistency; learner cannot tell whether to say "environment" or "entorno" in their own writeups. Headings are particularly visible (L286).
- **Severity:** M.

#### S45-ISSUE-07 — `"terminalización"` neologism (2 occurrences) [L]
- **Location:** L20 (learningOutcomes[3].text), L1792 (youDo.requirements[2]).
- **Evidence (verbatim):**
  - L20: `"Garantizar deduplicación por clave, ordenamiento acotado y terminalización en DLQ"`
  - L1792: `"Incluye cola con deduplicación por clave, retry y terminalización en DLQ."`
- **Grammar rule:** `terminalización` is not in RAE. It appears to be a calque of English "to terminalize" (a software-internal verb for sending a message to a terminal state). Understood in context but stylistically inconsistent with the rest of the section which uses standard Spanish for parallel concepts (`deduplicación`, `ordenamiento`).
- **Suggested alternative:** `"envío a terminal en DLQ"` or `"terminación en DLQ"` or `"terminalización en DLQ"` (kept as technical jargon, but explicitly glossed on first use).
- **Severity:** L.

#### S45-ISSUE-08 — `"capturazo"` Peruvian colloquial in formal theory prose [L]
- **Location:** L109 (theory T1-B ¶3).
- **Evidence (verbatim):** `"Un backup diario sintético con restore de 25 min frente a RTO 30 min y RPO 6 h es evidencia de T1-B — no un capturazo de consola."`
- **Grammar note:** `"capturazo"` is Peruvian informal slang for "screenshot / snapshot capture". Valid in colloquial register but inconsistent with the formal `"evidencia medible"` / `"restore sintético"` / `"RPO/RTO"` register of the surrounding paragraph.
- **Suggested alternative:** `"no una captura de consola"` (neutral) or `"no un pantallazo de consola"` (also Peruvian but more standard) or `"no una screenshot de consola"` (calque, still informal).
- **Severity:** L.

#### S45-ISSUE-09 — `"fail-closed"` used inline without backticks or translation (5 occurrences) [L]
- **Location:**
  - L135 (theory T1-B callout): `"La revisión de S45-T2-A exige fail-closed y salida esperada."`
  - L576 (weDo intro): `"E3 decide continue / breach / uncertainty en fail-closed."`
  - L709 (weDo S45-T1-A-E3 instruction): `"S45-T1-A-E3 · Enruta fail-closed el ADR de stores: …"`
  - L727 (weDo S45-T1-A-E3 feedback): `"S45-T1-A-E3: fail-closed: ausencia → WRITE_STORE_ADR …"`
  - (One more inside starterCode comment, acceptable as code comment.)
- **Grammar note:** `"fail-closed"` is a known security-design term, but its first learner-facing appearance should be either backticked `` `fail-closed` `` (treating it as a code-like identifier) or glossed `"comportamiento fail-closed"` / `"cierre por defecto"` (Spanish). Bare mid-sentence `fail-closed` reads as an untranslated English adjective.
- **Severity:** L.

#### S45-ISSUE-10 — `"un checklist de booleans"` (English noun phrase) [L]
- **Location:** L1856 (`youDo.portfolioNote`).
- **Evidence (verbatim):** `"El esqueleto no es un checklist de booleans: implementa el contrato y enlaza artefactos del proyecto."`
- **LanguageTool evidence:** Rule `AGREEMENT_DET_NOUN` fired (`un checklist` — concord issue because `checklist` is an English loanword).
- **Suggested alternative:** `"El esqueleto no es una lista de verificación de booleanos: …"` or `"El esqueleto no es un checklist de booleanos: …"` (keeping the loanword but with backticks on `checklist`).
- **Severity:** L.

#### S45-ISSUE-11 — All 8 theory subtopic callouts share the identical title `"Contrato local"` [L]
- **Location:** `theory[0..7].callout.title` (lines 58, 98, 134, 179, 215, 249, 280, 315, 350). 8 of 9 are `"Contrato local"`; the 9th (theory[0] callout, L58) is `"Gate de promoción y carga de trabajo"`.
- **Evidence (verbatim list):**
  - L58: `"Gate de promoción y carga de trabajo"` (only varied title)
  - L98, L134, L179, L215, L249, L280, L315, L350: all `"Contrato local"`
- **Pedagogical impact:** Anaphoric monotony; the learner sees the same callout title 8 times in a row. Pedagogically defensible as signposting (each subtopic has a local contract), but varied titles would aid scanning (`"Contrato local: stores"`, `"Contrato local: restore"`, `"Contrato local: colas"`, …).
- **Severity:** L.

#### S45-ISSUE-12 — Paragraph-template monotony: 8 subtopic paragraphs share the exact structure [L]
- **Location:** `theory[1..8].paragraphs[1]` (lines 67, 108, 143, 189, 225, 259, 290, 326). All 8 mid-paragraphs of the 8 subtopics begin with the exact string `"Contrato local de este subtema. **Entrada:** … **Salida:** … **Error:** … **Éxito medible:** … En \`CASO-IQU-045\`: … Si falta … enruta a …"`
- **Evidence (verbatim counts):**
  - `"Contrato local de este subtema."`: 8 occurrences
  - `"**Entrada:**"`: 8 occurrences
  - `"**Salida:**"`: 8 occurrences
  - `"**Error:**"`: 7 occurrences
  - `"**Éxito medible:**"`: 8 occurrences
  - `"En \`CASO-IQU-045\`"`: 7 occurrences
  - `"Si falta"`: 8 occurrences
  - `"enruta a"`: 9 occurrences
- **Pedagogical impact:** Predictable scaffolding is **good** (cognitive load reduction), but compressing 4-5 bolded labels into a single dense paragraph produces a wall of bold text. Each such paragraph runs ~70-110 words at FH ~70-80 (still readable) but visually monotonous. Splitting into a definition list or two paragraphs (Entrada/Salida in one, Error/Éxito in another) would improve scannability without losing the template.
- **Severity:** L.

#### S45-ISSUE-13 — Long sentence in `weDo.intro` (WPS=35) [L]
- **Location:** L576 (`weDo.intro`).
- **Evidence (verbatim):** `"Cada subtema sigue E1 → E2 → E3 con andamiaje que se retira: E1 repara un predicado de dominio con un defecto claro; E2 clasifica válido / adverso / campo faltante; E3 decide continue / breach / uncertainty en fail-closed."`
- **Metric evidence:** WPS=35 (heuristic flags `long_gt32`, severity M); FH=66.6; INFLESZ=63.3. From `/home/z/my-project/audits/S45_records.json`.
- **Pedagogical impact:** Long but semicolon-delimited into 3 parallel clauses, so structurally clear; still at the upper limit of technical-Spanish WPS (target 15-32). Splitting into 3 sentences (one per E-level) would reduce cognitive load.
- **Severity:** L.

#### S45-ISSUE-14 — `"no un print decorativo"` — `print` used as Spanish noun [L]
- **Location:** L571 (`iDo.steps[7].why`, T4-B demo).
- **Evidence (verbatim):** `"El forecast en PEN sintéticos se compara con el budget; recovery solo es listo si el drill de restore y el export portable están ambos ensayados — no basta un print decorativo."`
- **Grammar note:** `print` is an English noun used here as Spanish masculine singular. Either backtick it (`` `print` ``) to mark as a code-adjacent identifier, or translate as `"no basta una impresión decorativa"`. Bare `print` mid-sentence reads as an untranslated loanword.
- **Severity:** L.

#### S45-ISSUE-15 — Forward-reference duplication: T4-A closure callout previews T4-B closure [L]
- **Location:** L318 (`theory[7].callout.content`, closing T4-A) and L351 (`theory[8].callout.content`, closing T4-B).
- **Evidence (verbatim):**
  - L318 (end of T4-A): `"Cierre de S45-T4-B: residual risk y límites del lab stdlib."`
  - L351 (end of T4-B): `"Cierre de S45-T4-B: conserva alarma de costo y recuperación documentadas, la evidencia de \`FREEZE_SCALE_OUT\` y la ruta humana \`COST_OWNER_REVIEW\`. Montos en PEN sintéticos."`
- **Pedagogical impact:** The T4-A closure callout previews the **next** subtopic's closure, which is mildly confusing — callouts usually close their own subtopic. The duplicated `"Cierre de S45-T4-B:"` prefix is also jarring when scanned. The L318 callout should close T4-A (e.g., `"Cierre de S45-T4-A: drift y secretos son señales de rechazo, no de aplicar y ver."`) and leave T4-B closure to L351.
- **Severity:** L.

#### S45-ISSUE-16 — Section `id` `"iac"` and file name `s45-iac.ts` cover only 1 of 8 subtopics [L]
- **Location:** File: `src/lib/course/sections/s45-iac.ts` (whole file). Field: `id: "iac"` (L4).
- **Evidence (verbatim):**
  - L3-5: `export const section45: CourseSection = { id: "iac", index: 45, title: "Cloud, almacenamiento, colas e infraestructura", …`
  - File-name: `s45-iac.ts`
  - Title: `"Cloud, almacenamiento, colas e infraestructura"`; shortTitle: `"Cloud y colas"`.
- **Scope mismatch:** `IaC` (Infrastructure as Code) is subtopic T4-A only. The other 7 subtopics cover object store / relacional / cache (T1-A), consistencia / lifecycle / backups (T1-B), colas / eventos / delivery semantics (T2-A), dedup / ordering / DLQ (T2-B), compute / autoscaling / redes (T3-A), IAM / paths / egress (T3-B), costos / cuotas / recovery / portability (T4-B). The section is closer to "platform contracts" or "cloud-infra" than to "IaC" alone.
- **Comparative severity:** Less severe than S37's `dbt-bigquery` mismatch (where the id was completely unrelated to the content — Section 37 was about Python performance profiling, not dbt/BigQuery at all). In S45, `iac` is at least one of the 8 subtopics. Still a mild curriculum-contract violation: a learner inspecting the URL/state sees `iac` and expects an IaC-focused topic, when IaC is ~12% of the section.
- **Pedagogical impact:** URL / state leak; source archaeology signal; roadmap contract drift (if the master roadmap still says "IaC", the file name and id match but the content is broader).
- **Severity:** L.

#### S45-ISSUE-17 — `"residual risk y límites del lab stdlib"` — code-switch mid-Spanish [L]
- **Location:** L318 (theory[7].callout.content).
- **Evidence (verbatim):** `"Cierre de S45-T4-B: residual risk y límites del lab stdlib."`
- **Grammar note:** `"residual risk"` is English; should be `"riesgo residual"`. `"lab stdlib"` is a compressed code-switch; should be `"laboratorio con stdlib"` or `"laboratorio stdlib"`. Also `"lab"` is informal for `"laboratorio"`.
- **Severity:** L.

#### S45-ISSUE-18 — `"Salida: imprime el valor de meets_contract."` repeated 8× in E3 instructions [L]
- **Location:** L825, L975, L1125, L1275, L1425, L1575, L1725 — all 8 E3 (`transfer`) weDo instructions end with `"Salida: imprime el valor de meets_contract."`.
- **Evidence (verbatim, e.g. L825):** `"S45-T1-B-E3 · Enruta recovery: restore OK → \`CONTINUE\`; breach de RPO/RTO → \`DECLARE_DATA_LOSS_RISK\`; sin \`rto_minutes\` → \`RUN_RESTORE_DRILL\`. El starter confunde missing con éxito y usa el predicado al revés: repara ambas ramas. Salida: imprime el valor de meets_contract."`
- **Pedagogical impact:** This fixed template signals to learners "the success criterion is just printing the boolean" — but the E3 exercises are **transfer** level, where the criterion should be a non-trivial decision. The template is mildly defensible (consistency across the 8 E3 exercises) but borders on lazy scaffolding. Combined with the tautological `meets_contract = ('1B-3' == '1B-3')` stubs in the same exercise's solutionCode (Issue S45-ISSUE-02), the message becomes "just print the boolean" — undercutting the transfer-level challenge.
- **Severity:** L.

#### S45-ISSUE-19 — Internal curriculum codes (`S45-T*-E*-N`, `CP-N4-B`) saturate learner-facing prose [L]
- **Location:** Across `instruction` (24/24 weDo steps), `feedback` (24/24 weDo steps), `callout.content` (8/9 callouts), `theory[0].heading` (L28), `iDo.intro` (L356), `weDo.intro` (L576), `youDo.portfolioNote` (L1856), `youDo.objectives[1]` (L1785), `selfCheck.questions[2].question` (L1881), `selfCheck.questions[2].explanation` (L1884).
- **Evidence (verbatim counts):**
  - `S45-T*-X` subtopic codes: 194 occurrences across the 1,978-line source.
  - `CP-N4-B` gate code: 5 occurrences in learner-facing prose (L356, L1785, L1856, L1881, L1884).
  - `S45` section number in headings/intros: 6 occurrences.
- **Comparative severity:** Same pattern as S37 (L severity). Defensible as signposting for Master-level learners (who can navigate by code), but the saturation (194 mentions) risks learner fatigue. The `instruction` and `feedback` fields starting every step with `"S45-T1-A-E1 · …"` / `"S45-T1-A-E1: …"` is the most visible.
- **Severity:** L.

#### S45-ISSUE-20 — `"el status"` / `"el cache"` / `"el worker"` / `"el job"` — anglicism density [L]
- **Location:** Pervasive. Sample counts in learner-facing prose (excluding code blocks): `el status` (5), `el cache` (5), `el worker` (8), `el job` (5), `el plan` (5), `el gate` (3), `el lag` (3), `el poison` (2), `el restore` (2), `el drill` (2), `el bucket` (1), `el dashboard` (1), `el backlog` (1), `el forecast` (1), `el budget` (1), `el path` (1), `el pipeline` (1), `el cost` (3), `el recovery` (18, though many are inside `restore_tested` field names), `el portability` (4), `el rollback` (4), `el fail-closed` (5), `el breach` (42, mostly inside code/`breach` token literals), `un side-effect` (7), `el environment` (1), `el environments` (1).
- **Grammar note:** Most of these are **standard English technical terms used in Spanish technical prose** (object store, cache, worker, job, plan, gate, backlog, etc. are not translated in practice). The RAE's `FundaRAE` and the Spanish-tech community generally accept them as loanwords. **Not a defect per se**, but:
  - First-occurrence glossing would help (`object store` → `object store (almacén de objetos)`, already done in L30 diccionario).
  - `el cache` could be `la cache` (feminine per FundaDataRAE guessing) — actually RAE registers `caché` as masculine for "cache memory" and accepts both genders in tech-prose. Currently the section uses `el cache` consistently, which is fine.
  - `el status` — `el estatus` (Hispanicized) or `el estado` would be the formal alternative; `el status` is informal tech-prose. Consistent in the section.
- **Pedagogical impact:** Acceptable for Master-level audience; flagging only for awareness, not as a defect.
- **Severity:** L (advisory).

---

## 4. Meta-Leak Report

### High-severity meta-leaks

| # | Location | Exact leaked text | Nature |
|---|---|---|---|
| ML-1 | `theory[5].callout.content` (L282) | `"El dueño de S45-T4-A responde por rollback y evidencia."` | Curriculum-process meta-leak: "dueño de subtema" is an internal instructor/TA role, not a job role. Breaks learner immersion in the T3-B IAM callout. |
| ML-2 | 16× `solutionCode` (L665, 722, 815, 872, 965, 1022, 1115, 1172, 1265, 1322, 1415, 1472, 1565, 1622, 1715, 1772) | `meets_contract = ('1A-0' == '1A-0')` (and variants) | Authoring residue: tautological string-equality stubs left in learner-visible solution code. Compare a string to itself, assign to a misleadingly named variable. |

### Medium / low-severity meta-leaks

| # | Location | Exact leaked text | Nature |
|---|---|---|---|
| ML-3 | `theory[7].callout.content` (L318) | `"Cierre de S45-T4-B: residual risk y límites del lab stdlib."` | Forward-reference: T4-A callout previews T4-B closure; also leaks English "residual risk" untranslated. |
| ML-4 | `theory[0].heading` (L28) | `"Ruta de S45: cloud, almacenamiento, colas e infraestructura"` | Section number `S45` inside the heading text (mild). |
| ML-5 | 24/24 `instruction` fields | `"S45-T1-A-E1 · …"`, `"S45-T1-A-E2 · …"`, … | Internal exercise codes prefix every instruction. |
| ML-6 | 24/24 `feedback` fields | `"S45-T1-A-E1: …"`, `"S45-T1-A-E2: …"`, … | Internal exercise codes prefix every feedback. |
| ML-7 | 8/9 `callout.content` | `"S45-T1-A: …"`, `"Antes de promover S45-T1-B …"`, `"La revisión de S45-T2-A exige …"`, `"Contrato S45-T2-B: …"`, `"Para S45-T3-A: …"`, `"Promoción de S45-T3-B …"`, `"El dueño de S45-T4-A …"` (ML-1), `"Cierre de S45-T4-B: …"` (ML-3, twice) | Internal subtopic codes saturate callout content. |
| ML-8 | `iDo.intro` (L356) | `"…alineada al gate CP-N4-B."` | Internal competency-path code `CP-N4-B`. |
| ML-9 | `youDo.portfolioNote` (L1856) | `"Evidencia de CP-N4-B · job asíncrono resiliente: …"` | Internal competency-path code `CP-N4-B`. |
| ML-10 | `youDo.objectives[1]` (L1785) | `"Demostrar el gate CP-N4-B: …"` | Internal competency-path code `CP-N4-B`. |
| ML-11 | `selfCheck.questions[2].question` (L1881) | `"¿Cuál resultado demuestra el gate \`CP-N4-B · job asíncrono resiliente\`?"` | Internal competency-path code `CP-N4-B`. |
| ML-12 | `selfCheck.questions[2].explanation` (L1884) | `"El gate es conductual y medible: …"` | Internal competency-path code `CP-N4-B` (implicit). |

### Intentional scaffolding (NOT meta-leaks)

The following were verified as intentional scaffolding (visible to learners in the IDE/editor) and **are not** flagged as leaks:

- 32 `# DEFECT: …` comments inside `starterCode` blocks (e.g., L595 `# DEFECT: PASS si cache_authoritative o transactions=cache`). These are intentional scaffolding that names the bug the learner must fix.
- 24 `# Contrato: …` comments inside `starterCode` (e.g., L596 `# Contrato: corrige el DEFECT; imprime la salida exacta del enunciado`). Intentional scaffolding that states the contract.
- 24 `# CASO-IQU-045 · …` comments inside `starterCode`. Intentional case-context signposting.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do fidelity

**I Do (8 demos).** Each of the 8 theory subsections has a matching `iDo.steps[*]` demo with:
- `demoId`: `S45-T*-DEMO` (e.g., `S45-T1-A-DEMO`)
- `subtopicId`: matches the theory subtopic
- `environment`: `"local-python"` (consistent — all 8 demos run locally with stdlib, no real cloud)
- `description`: one-line problem statement (e.g., `"ADR de persistencia: object para artefactos, relacional para status, cache no autoritativo"`)
- `code`: a self-contained Python snippet with `output` (verified expected output)
- `why`: a "pienso en voz alta" rationale paragraph explaining the demo's reasoning

The `why` blurbs are **excellent** — they reveal the teacher's reasoning ("Pienso en voz alta el ADR: el blob del reporte va al object store, el status del job a relacional, y el cache solo espeja lecturas. Un reintento relee la verdad durable, no el TTL."). This is high-fidelity I-Do per the I/We/You framework.

**We Do (24 exercises, E1/E2/E3 scaffolding).** All 24 weDo steps follow the same decreasing-scaffolding pattern:
- E1 (guided): starter has an inverted/buggy predicate; learner repairs the predicate to make `meets_contract` evaluate `True` for the valid fixture and `False` for the adversarial one. Hint: relates fields to the rule. Output: `S45-T*-X PASS`.
- E2 (independent): starter has an inverted/buggy `assess()` function that classifies 3 fixtures (valid/adverso/incomplete); learner repairs the function so it returns `PASS` / `<breach_token>` / `MISSING:<field>`. Hint: "Primero se calcula `missing`; ningún acceso a <field> debe ocurrir antes de esa rama." Output: `PASS <breach_token> MISSING:<field>`.
- E3 (transfer): starter has both an inverted predicate AND a missing-field misrouted to CONTINUE; learner repairs both. Output: `CONTINUE <breach_token> <uncertainty_token>`.

This is **textbook decreasing-scaffolding** (Pearson & Gallagher 1983): I-Do → We-Do (guided) → We-Do (independent) → You-Do (transfer). The hint structure progressively withdraws: E1 has a single sentence relating fields to rule; E2 has the same plus a "calcula `missing` primero" hint; E3 has the same plus "una ausencia no equivale a breach" hint. Each level reduces the field-name scaffolding.

**You Do (1 portfolio project).** `youDo.starterCode` provides a `process_once` skeleton with `NotImplementedError` and a fully-commented `STORE_ADR`, `IAM_ALLOWED`, `EGRESS_ALLOW`, `BUDGET_PEN`, `FORECAST_PEN`, `RESTORE_TESTED`, `PORTABLE_EXPORT`. The learner must:
- Implement `process_once` (ack lógico solo tras efecto durable; dups → `SKIP_DUP`; poison → `SEND_TO_DLQ`)
- Automatizar 3 rutas: `normal` → `ACK`, `poison` → `SEND_TO_DLQ`, `missing` → `PAUSE_AND_INSPECT`
- Assert `object_store["job-iqu-1"] == b"ok" and job_status["job-iqu-1"] == "done"`
- Assert `len(dlq) == 1 and gate_budget_ok() and not STORE_ADR["cache_authoritative"]`

The portfolio gates align with the CP-N4-B gate ("job asíncrono resiliente: reintentos no duplican resultados y costo, IAM, backup y recuperación quedan medidos"). The rubric (6 criteria, 100%) maps 1-to-1 to the gate dimensions. **Excellent fidelity.**

**Self-check (7 questions).** Each question has 4 options, 1 correct index, and an explanation. The questions cover: store ADR (T1-A), poison/DLQ (T2-B/T3-A), CP-N4-B gate (overall), autoscaling signal (T3-A), DLQ terminal (T2-B), IAM/egress (T3-B), FREEZE_SCALE_OUT (T4-B). Coverage is good (7 of 8 subtopics — T1-B and T4-A are not directly tested, though T4-A is implicitly tested via the CP-N4-B question). The distractors are well-designed (e.g., "un print sin assert ni versión", "una captura de pantalla sin fuente", "datos personales reales para que parezca auténtico").

### 5.2 Cognitive load and progressive disclosure

**Progressive disclosure trajectory:**
- T1-A (object/relacional/cache ADR) → T1-B (consistencia, RPO/RTO) → T2-A (delivery semantics, ack-after-effect) → T2-B (dedup, ordering, DLQ) → T3-A (autoscaling, backpressure) → T3-B (IAM, egress) → T4-A (IaC, drift, secrets) → T4-B (cost, quota, recovery, portability).

This is **textbook progressive disclosure**: each subtopic builds on the previous. T1 establishes the storage layer; T2 builds the queue/delivery layer on top; T3 adds compute/network/security; T4 wraps with declarative config and cost. A learner who internalizes T1-A's "cache no es fuente de verdad" rule will recognize the same pattern in T2-A's "ack va después del efecto durable" (also a truth-source hierarchy) and T4-A's "plan se acepta solo si coincide con lo declarado" (also a source-of-truth check). **Strong cognitive scaffolding.**

**Cognitive load concern (Issue S45-ISSUE-12):** The 8 mid-paragraphs of the 8 theory subtopics are each ~70-110 words packed with 4-5 bolded labels (`**Entrada:**`, `**Salida:**`, `**Error:**`, `**Éxito medible:**`, `En \`CASO-IQU-045\`:`). Visually this is a wall of bold text. Splitting each into a definition list (HTML `<dl>`) or two paragraphs (Entrada/Salida in one, Error/Éxito in another) would reduce visual cognitive load without losing the template structure.

**Cognitive load concern (Issue S45-ISSUE-13):** The `weDo.intro` is a single 35-word sentence with two semicolons packing the entire E1/E2/E3 contract. Splitting into 3 sentences would reduce load.

### 5.3 Exercise and exam alignment

**Exercise solution/output fidelity:** All 24 weDo `solutionCode` blocks were spot-checked; all produce the exact `output` string specified (e.g., `S45-T1-A PASS`, `PASS REDESIGN_PERSISTENCE MISSING:cache_ttl_s`, `CONTINUE DECLARE_DATA_LOSS_RISK RUN_RESTORE_DRILL`). The `assert` lines in solutionCode are correct (they test the right expected list).

**BUT** 16 of 24 solutionCode blocks end with the tautological `meets_contract = ('1A-0' == '1A-0')` stub (Issue S45-ISSUE-02). The `output` field does NOT include the `meets_contract True` print (only the actual `results`), so a learner running the solution sees both the correct `results` and the spurious `meets_contract True`. Confusing.

**Self-check → subtopic coverage:** 7/8 subtopics directly tested (T1-B and T4-A not directly tested, though T4-A is implicitly tested via the CP-N4-B question). Acceptable.

**Portfolio rubric → gate alignment:** 6 rubric criteria (25% + 20% + 15% + 15% + 15% + 10% = 100%) map 1-to-1 to the CP-N4-B gate dimensions:
1. Correctitud del contrato y gate (efecto durable + idempotencia) — 25% — maps to T2-A/T2-B
2. Pruebas normal/breach/uncertain y recuperación (DLQ / inspección) — 20% — maps to T2-B/T3-A
3. Seguridad, privacidad y least privilege (IAM/egress modelo) — 15% — maps to T3-B
4. Reproducibilidad, lineage y evidencia — 15% — cross-cutting
5. Operación: SLO, costo/cuota, observabilidad y rollback — 15% — maps to T3-A/T4-B
6. Comunicación de trade-offs y límites — 10% — cross-cutting

Excellent alignment.

### 5.4 Connective tissue and narrative flow

**Bridge from S44:** Explicit and strong. Theory[0].paragraphs[2] (L32): `"Puente desde S44: el artefacto de pipeline (imagen/paquete firmado o bundle de release) es la **entrada** del job; aquí decides dónde se guarda el resultado, cómo se encola el trabajo, qué pasa si el worker muere a mitad, y con qué permisos y presupuesto corre. No reimplementas CI: **consumes** su salida de forma idempotente."` This is **exemplary connective tissue** — it names the upstream section, the artifact type, the 4 decisions the section addresses, and the contract (consume, don't reimplement).

**Bridge to CP-N4-B:** Implicit forward reference throughout (CP-N4-B is the gate code; 5 mentions in learner-facing prose). The `youDo.objectives[1]` makes it explicit: `"Demostrar el gate CP-N4-B: reintentos no duplican resultados y costo, IAM, backup y recuperación quedan medidos."`

**Internal narrative arc (within S45):** Theory[0].paragraphs[4] (L34): `"Orden: T1 persistencia → T2 colas/dedup/DLQ → T3 compute/IAM/egress → T4 configuración declarativa, costo y recovery. Primero ves demos locales del contrato, luego reparas predicados fallidos (válido / adverso / dato faltante) y al final armas el job mínimo en el proyecto. Stack didáctico: **stdlib** de Python modelando contratos cloud **sin cuenta real ni egress**."` This is a strong signposting paragraph that lays out the entire section's trajectory.

**Connective tissue verdict:** Best-in-class for the second half of the course.

### 5.5 Consistency with the overall roadmap

The section fits Phase 3 (Master) of the roadmap, positioned after S44 (multimodal) and before S46 (gpu-computing). The phase-3 curriculum arc is "platform engineering for ML/ai products"; S45 (cloud/infra contracts) is a natural fit. The case-study continuity (`CASO-IQU-045` Iquitos ficticio) follows the course's case-per-section convention seen in S37 (`CASO-LIM-037` Lima) and others.

### 5.6 Comparison with best-in-class external materials

| Topic | S45 approach | External benchmark | Comparison |
|---|---|---|---|
| Object store vs relacional vs cache | ADR by access pattern; cache never authoritative | AWS WAF "Storage anti-patterns"; DDIA Ch.1 | S45 is **more pedagogically structured** (explicit ADR with `cache_authoritative=false` predicate) than AWS WAF (which is descriptive, not contract-based). |
| At-least-once + visibility timeout + idempotency | `can_ack()` predicate: `effect_durable and acked_after_effect and bool(key)` | AWS SQS docs; DDIA Ch.11 | S45 distills the 3-rule contract into a one-line predicate; SQS docs spread it across 50+ pages. **Stronger for a Master-level learner.** |
| DLQ + dedup + ordering per-partition | `ingest()` returns `new/dup/dlq`; ordering declared in policy | AWS SQS DLQ best practices; Kafka docs | S45's `ingest()` is a clean minimal model; ordering is explicitly *"no lo inventes en el consumer"*. **Excellent.** |
| IAM least-privilege + egress allowlist | `allow()` predicate: `action in allowed and private and host in egress_allow` | AWS IAM best practices; NIST 800-53 | S45's negative-test framing (`deny_admin`, `deny_egress`) is exactly the AWS-recommended pattern. **Faithful.** |
| IaC plan review (drift, secrets, destroys) | `plan_acceptable()`: `declared == planned and env in {…} and not secrets and destroys == 0` | Terraform plan review guides | S45 distills the 4-rule review contract; Terraform guides are tool-specific. **More generalizable.** |
| Cost/quota + recovery + portability drill | `cost_ok()` + `recovery_portable()` with PEN sintéticos | FinOps Foundation; AWS Cost Explorer | S45's synthetic-PEN framing is a **creative pedagogical choice** — makes cost concrete without real billing. **Stronger than FinOps docs** for a learner. |

**Overall comparison:** S45 is more pedagogically structured than the external benchmarks (which are reference docs, not learning materials). The contract-predicate approach (`meets_contract = ...`) is the section's signature pedagogical innovation and is **best-in-class** for teaching distributed-systems contracts.

---

## 6. Grammatical improvements and rewriting report (paragraph by paragraph, tab by tab)

This section presents, for the most affected learner-facing prose units, a **before / after** rewrite with the grammar/style rationale. The rewrites are proposals (audit-only; no edits applied).

### 6.1 Theory tab — Theory[0] (Ruta de S45) ¶1 — L30 "Diccionario de la sección"

**Before (verbatim):**
> **Diccionario de la sección** (léelo antes de T1; cada término reaparece en su subtema). **Object store:** blobs/artefactos por key (T1-A). **Relacional:** invariantes y consultas (T1-A/B). **Cache:** copia descartable, no fuente de verdad (T1-A). **Delivery semantics:** at-least-once / at-most-once / exactly-once como propiedad compuesta (T2-A). **Visibility timeout:** ventana sin ack tras la cual el mensaje puede reaparecer (T2-A). **Dedup:** idempotency key del mensaje (T2-B). **DLQ:** dead-letter de mensajes venenosos (T2-B). **IAM least-privilege:** permisos mínimos por rol (T3-B). **Egress control:** salidas de red autorizadas (T3-B). **IaC:** infra declarativa por environment (T4-A). **Budget/quota:** costo y límites medidos en **PEN** = soles peruanos sintéticos (T4-B).

**Issues:**
- `"infra declarativa por environment"` (English singular) vs `"entorno"` used 10× elsewhere — Issue S45-ISSUE-06.
- Anglicism density is high but this is a **glossary** (terms-of-art are intentional). Acceptable.

**After (proposed):**
> **Diccionario de la sección** (léelo antes de T1; cada término reaparece en su subtema). **Object store:** blobs/artefactos por key (T1-A). **Relacional:** invariantes y consultas (T1-A/B). **Cache:** copia descartable, no fuente de verdad (T1-A). **Delivery semantics:** at-least-once / at-most-once / exactly-once como propiedad compuesta (T2-A). **Visibility timeout:** ventana sin ack tras la cual el mensaje puede reaparecer (T2-A). **Dedup:** idempotency key del mensaje (T2-B). **DLQ:** dead-letter de mensajes venenosos (T2-B). **IAM least-privilege:** permisos mínimos por rol (T3-B). **Egress control:** salidas de red autorizadas (T3-B). **IaC:** infra declarativa por entorno (T4-A). **Budget/quota:** costo y límites medidos en **PEN** = soles peruanos sintéticos (T4-B).

**Change:** `environment` → `entorno` (1 word).

### 6.2 Theory tab — Theory[0] (Ruta de S45) ¶4 — L33 "Producto incremental"

**Before (verbatim):**
> Producto incremental: arquitectura distribuida mínima. Entrada: job idempotente, artefacto, política de entrega, presupuesto e IAM least-privilege. Salida: estado durable, resultado en object store y terminales en DLQ. Error de promoción: cache como verdad, ack antes de efecto, egress no autorizado o restore no medido.

**Issues:** None — clean Spanish prose with technical English terms as loanwords. ✓

### 6.3 Theory tab — Theory[1] (T1-A) ¶2 — L67 "Contrato local"

**Before (verbatim):**
> Contrato local de este subtema. **Entrada:** tipo de dato (blob de reporte, fila de status, lectura caliente). **Salida:** ADR de persistencia con fuente de verdad explícita (`object` | `relational` | `cache`). **Error de diseño:** marcar `cache_authoritative=true` o guardar transacciones solo en cache → `REDESIGN_PERSISTENCE`. **Éxito medible:** un reintento del job relee status desde relacional y el artefacto por key en object store. Si falta el ADR o el campo de TTL, enruta a `WRITE_STORE_ADR`.

**Issues:**
- Template-packed paragraph (Issue S45-ISSUE-12) — could be split for visual scannability.
- `"fila de status"` — `status` loanword; could be `"fila de estado"` but loanword is acceptable.

**After (proposed, split into 2 paragraphs for scannability):**
> Contrato local de este subtema. **Entrada:** tipo de dato (blob de reporte, fila de status, lectura caliente). **Salida:** ADR de persistencia con fuente de verdad explícita (`object` | `relational` | `cache`).
>
> **Error de diseño:** marcar `cache_authoritative=true` o guardar transacciones solo en cache → `REDESIGN_PERSISTENCE`. **Éxito medible:** un reintento del job relee status desde relacional y el artefacto por key en object store. Si falta el ADR o el campo de TTL, enruta a `WRITE_STORE_ADR`.

**Change:** Split into 2 paragraphs (Entrada/Salida in ¶1, Error/Éxito/ruta in ¶2). Same content, lower visual density.

### 6.4 Theory tab — Theory[2] (T1-B) ¶3 — L109 "CASO-IQU-045"

**Before (verbatim):**
> En `CASO-IQU-045`: el status relacional del job de reportes se declara *read-after-write*; el object store del artefacto puede ser eventual entre regiones. Un backup diario sintético con restore de 25 min frente a RTO 30 min y RPO 6 h es evidencia de T1-B — no un capturazo de consola.

**Issues:**
- `"capturazo"` Peruvian colloquial — Issue S45-ISSUE-08.

**After (proposed):**
> En `CASO-IQU-045`: el status relacional del job de reportes se declara *read-after-write*; el object store del artefacto puede ser eventual entre regiones. Un backup diario sintético con restore de 25 min frente a RTO 30 min y RPO 6 h es evidencia de T1-B — no una captura de consola.

**Change:** `capturazo` → `captura` (1 word, formal register).

### 6.5 Theory tab — Theory[7] (T4-A) heading + ¶1 — L286, L289-290

**Before (verbatim heading, L286):**
> Configuración declarativa y environments

**Before (verbatim ¶1, L289-290):**
> **IaC** declara el estado deseado (cola, bucket, rol) en código versionado, parametriza **dev / staging / prod** sin copiar secretos al plan, y exige un **plan revisado** antes del apply. Drift destructivo inesperado, entorno inventado (`shared`) o secretos en claro en el plan son señales de rechazo — no de "aplicar y ver".

**Issues:**
- `"environments"` English plural in heading — Issue S45-ISSUE-06.
- `"entorno"` Spanish in body — inconsistent.

**After (proposed heading):**
> Configuración declarativa y entornos

**After (proposed ¶1, unchanged body):** (body already uses `entorno` consistently — no change needed; just align the heading).

### 6.6 Theory tab — Theory[7] (T4-A) callout — L318

**Before (verbatim):**
> Cierre de S45-T4-B: residual risk y límites del lab stdlib.

**Issues:**
- Forward-reference to T4-B closure inside T4-A callout — Issue S45-ISSUE-15.
- `"residual risk"` English untranslated — Issue S45-ISSUE-17.
- `"lab stdlib"` compressed code-switch — Issue S45-ISSUE-17.

**After (proposed, close T4-A instead of previewing T4-B):**
> Cierre de S45-T4-A: drift, secretos en plan y destroys inesperados son señales de rechazo, no de "aplicar y ver".

**Change:** Replace forward-reference with proper T4-A closure; translate `residual risk` → `riesgo residual` (moved to L351 where it belongs if needed); expand `lab stdlib` → `laboratorio con stdlib` (also moved to L351).

### 6.7 Theory tab — Theory[5] (T3-B) callout — L282

**Before (verbatim):**
> El dueño de S45-T4-A responde por rollback y evidencia.

**Issues:**
- Curriculum-meta leak — Issue S45-ISSUE-01 (HIGH).

**After (proposed, technical closure of T3-B):**
> Cierre de S45-T3-B: la prueba negativa (denegar admin o host desconocido) es evidencia de least-privilege; sin allowlist, no hay promoción.

**Change:** Replace curriculum-meta ("dueño de S45-T4-A") with a T3-B-closing technical statement (negative test = evidence of least-privilege).

### 6.8 I Do tab — `iDo.intro` — L356

**Before (verbatim):**
> Ocho demos locales del job asíncrono de reportes sintéticos en Iquitos (`CASO-IQU-045`). Cada una calcula un contrato de S45 con stdlib — sin cuenta cloud ni egress real — y deja evidencia alineada al gate CP-N4-B.

**Issues:** None major. `CP-N4-B` is curriculum code (low-severity meta-leak, Issue S45-ISSUE-19) but defensible as gate signposting.

### 6.9 I Do tab — `iDo.steps[6].why` (T4-A demo) — L543

**Before (verbatim):**
> El plan se acepta solo si coincide con lo declarado, el environment es válido y no hay secretos ni destrucciones inesperadas. Rechazar el plan malo es el contrato de T4-A.

**Issues:**
- `"el environment es válido"` — English singular mid-sentence — Issue S45-ISSUE-06.

**After (proposed):**
> El plan se acepta solo si coincide con lo declarado, el entorno es válido y no hay secretos ni destrucciones inesperadas. Rechazar el plan malo es el contrato de T4-A.

**Change:** `environment` → `entorno` (1 word).

### 6.10 I Do tab — `iDo.steps[7].why` (T4-B demo) — L571

**Before (verbatim):**
> El forecast en PEN sintéticos se compara con el budget; recovery solo es listo si el drill de restore y el export portable están ambos ensayados — no basta un print decorativo.

**Issues:**
- `"un print decorativo"` — `print` English noun — Issue S45-ISSUE-14.
- `"recovery solo es listo"` — slight register oddity; `"solo cuenta"` (used elsewhere in the section) would be more consistent.

**After (proposed):**
> El forecast en PEN sintéticos se compara con el budget; recovery solo cuenta si el drill de restore y el export portable están ambos ensayados — no basta una impresión decorativa.

**Changes:** `es listo` → `cuenta` (consistency with L325 `"Recovery" y "portability" se ensayan con exportaciones y formatos abiertos`); `un print` → `una impresión` (translate loanword).

### 6.11 We Do tab — `weDo.intro` — L576

**Before (verbatim):**
> S45 · Laboratorio de arquitectura distribuida mínima: 24 retos locales sobre **ocho familias** de fixture de `CASO-IQU-045` (Iquitos sintético; mismos campos por familia, no ocho novelas distintas). Cada subtema sigue E1 → E2 → E3 con andamiaje que se retira: E1 repara un predicado de dominio con un defecto claro; E2 clasifica válido / adverso / campo faltante; E3 decide continue / breach / uncertainty en fail-closed. Conserva los datos del starter; corrige solo la decisión defectuosa. Lee el contrato local del subtema antes de tocar el booleano.

**Issues:**
- Long sentence (WPS=35, FH=66.6) — Issue S45-ISSUE-13.
- `"fail-closed"` inline English — Issue S45-ISSUE-09.

**After (proposed, split long sentence and gloss fail-closed):**
> S45 · Laboratorio de arquitectura distribuida mínima: 24 retos locales sobre **ocho familias** de fixture de `CASO-IQU-045` (Iquitos sintético; mismos campos por familia, no ocho novelas distintas). Cada subtema sigue E1 → E2 → E3 con andamiaje que se retira. E1 repara un predicado de dominio con un defecto claro. E2 clasifica válido / adverso / campo faltante. E3 decide `continue` / `breach` / `uncertainty` con política fail-closed (deniega por defecto ante la incertidumbre). Conserva los datos del starter; corrige solo la decisión defectuosa. Lee el contrato local del subtema antes de tocar el booleano.

**Changes:** Split the 35-word sentence into 4 sentences (one per E-level + the lead). Backtick `continue`/`breach`/`uncertainty`. Gloss `fail-closed` as `política fail-closed (deniega por defecto ante la incertidumbre)` on first use.

### 6.12 We Do tab — `weDo.steps[*].instruction` — example S45-T1-A-E1 (L582)

**Before (verbatim):**
> S45-T1-A-E1 · Decide la fuente de verdad del job de reportes en Iquitos (`CASO-IQU-045-1A`). El starter marca PASS cuando el cache es autoritativo o las transacciones viven en cache (DEFECT invertido). Corrige el predicado para exigir blob en object, transacciones en relacional, `cache_authoritative=false` y `cache_ttl_s > 0`. No toques los datos ni el assert. Salida exacta: `S45-T1-A PASS`.

**Issues:** None major. Curriculum-code prefix `S45-T1-A-E1 ·` is consistent with the rest of the course (Issue S45-ISSUE-19, low severity). Grammar is clean (negative imperative `No toques` = correct tuteo form). ✓

### 6.13 We Do tab — `weDo.steps[*].solutionCode` (16 occurrences) — Issue S45-ISSUE-02

**Before (verbatim, L665 inside `s45-t1-a-e2.py`):**
```python
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
meets_contract = ('1A-0' == '1A-0')
print('meets_contract', meets_contract)
```

**Issues:**
- Tautological stub assertion — Issue S45-ISSUE-02 (HIGH).

**After (proposed, remove the 3 stub lines):**
```python
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
```

**Change:** Delete the 3 tautological lines (`meets_contract = ('1A-0' == '1A-0')`, `print('meets_contract', meets_contract)`). The actual contract test is the preceding `assert results == [...]` line (in E3 solutions) or the implicit correctness of `assess()` (in E2 solutions). Apply to all 16 occurrences.

### 6.14 You Do tab — `youDo.context` — L1782

**Before (verbatim):**
> Arquitectura distribuida mínima declarativa. Trabaja sobre procesamiento sintético de reportes para una organización ficticia en Iquitos. Entrada: job idempotente, artefacto, política de entrega, presupuesto y permisos mínimos. Salida: estado durable, resultado en object store y fallas terminales en dead-letter queue. El gate se bloquea si hay mensaje duplicado con side-effect, cuota excedida, egress no autorizado o restore no probado.

**Issues:** None major. `"fallas terminales en dead-letter queue"` is grammatically clean (Spanish with English tech term). `"mensaje duplicado con side-effect"` is fine (loanword). ✓

### 6.15 You Do tab — `youDo.objectives[1]` — L1785

**Before (verbatim):**
> Demostrar el gate CP-N4-B: reintentos no duplican resultados y costo, IAM, backup y recuperación quedan medidos.

**Issues:** None major. `CP-N4-B` is curriculum code (Issue S45-ISSUE-19, low severity, defensible as gate signposting). ✓

### 6.16 You Do tab — `youDo.requirements` — L1790-1798

**Before (verbatim L1792):**
> Incluye cola con deduplicación por clave, retry y terminalización en DLQ.

**Issues:**
- `"terminalización"` neologism — Issue S45-ISSUE-07.

**After (proposed):**
> Incluye cola con deduplicación por clave, retry y envío a terminal en DLQ.

**Change:** `terminalización` → `envío a terminal` (RAE-safe alternative).

### 6.17 You Do tab — `youDo.portfolioNote` — L1856

**Before (verbatim):**
> Evidencia de CP-N4-B · job asíncrono resiliente: muestra baseline, decisión de stores, colas con DLQ, IAM/egress, presupuesto/restore, pruebas normal/breach/uncertain, resultado medido, rollback y riesgo residual. El esqueleto no es un checklist de booleans: implementa el contrato y enlaza artefactos del proyecto.

**Issues:**
- High comma density (8 commas in 30 words) — flagged by heuristics.
- `"un checklist de booleans"` — English noun phrase — Issue S45-ISSUE-10.

**After (proposed):**
> Evidencia de CP-N4-B · job asíncrono resiliente: muestra baseline, decisión de stores, colas con DLQ, IAM/egress, presupuesto/restore, pruebas normal/breach/uncertain, resultado medido, rollback y riesgo residual. El esqueleto no es una lista de verificación de booleanos: implementa el contrato y enlaza artefactos del proyecto.

**Change:** `un checklist de booleans` → `una lista de verificación de booleanos` (translate English noun phrase).

### 6.18 You Do tab — `youDo.rubric` — L1858-1863

**Before (verbatim, all 6 criteria):**
1. Correctitud del contrato y gate (efecto durable + idempotencia) — 25%
2. Pruebas normal/breach/uncertain y recuperación (DLQ / inspección) — 20%
3. Seguridad, privacidad y least privilege (IAM/egress modelo) — 15%
4. Reproducibilidad, lineage y evidencia — 15%
5. Operación: SLO, costo/cuota, observabilidad y rollback — 15%
6. Comunicación de trade-offs y límites — 10%

**Issues:** None major. `"least privilege"`, `"lineage"`, `"trade-offs"` are accepted English tech terms. Weights sum to 100%. ✓

### 6.19 Self-check tab — `selfCheck.questions[2]` — L1881-1884

**Before (verbatim):**
- Question: `"¿Cuál resultado demuestra el gate \`CP-N4-B · job asíncrono resiliente\`?"`
- Options: `["el archivo S45 existe, aunque no pruebe el gate", "el README afirma que funciona", "se usó la herramienta más nueva", "reintentos no duplican resultados y costo, IAM, backup y recuperación quedan medidos"]`
- Correct: index 3.
- Explanation: `"El gate es conductual y medible: reintentos no duplican resultados y costo, IAM, backup y recuperación quedan medidos."`

**Issues:** None — `¿…?` pair is correct; explanation is concise and grammatical. `CP-N4-B` is curriculum code (Issue S45-ISSUE-19, low severity). ✓

### 6.20 Resources tab — `resources.docs[*].note` (English-Spanish mix)

**Before (verbatim, all 10 notes):**
1. `"Infraestructura declarativa y state"`
2. `"Reliability, security y cost"`
3. `"Envelope interoperable de eventos"`
4. `"At-least-once, DLQ, idempotencia"`
5. `"DLQ y poison messages"`
6. `"Least privilege"`
7. `"Config, backing services y disposability"`
8. `"Controles de seguridad y acceso"`
9. `"Semántica de colas didáctica"`
10. `"Observabilidad del job asíncrono"`

**Issues:**
- Notes 1, 2, 4, 5, 6, 7 mix English and Spanish freely.
- `"Semántica de colas didáctica"` — `didáctica` (singular feminine) could agree with `Semántica` (head noun) or `colas` (plural feminine). LT flagged `AGREEMENT_ADJ_NOUN`. Reading: "didactic semantics of queues" (didáctica modifies Semántica) or "semantics of didactic queues" (didáctica modifies colas, but should be didácticas). The intended meaning is likely the former ("didactic semantics"), so `didáctica` is grammatically correct — LT false positive.

**After (proposed, normalize all 10 notes to Spanish):**
1. `"Infraestructura declarativa y estado"` (`state` → `estado`)
2. `"Fiabilidad, seguridad y costo"` (`Reliability` → `Fiabilidad`, `security` → `seguridad`, `cost` → `costo`)
3. `"Envelope interoperable de eventos"` (unchanged — `envelope` is a CloudEvents spec term)
4. `"At-least-once, DLQ e idempotencia"` (add `e` before `idempotencia` per Spanish `y` → `e` rule)
5. `"DLQ y mensajes venenosos"` (`poison messages` → `mensajes venenosos`)
6. `"Mínimos privilegios"` (`Least privilege` → `Mínimos privilegios`)
7. `"Configuración, servicios respaldo y disposabilidad"` (`Config` → `Configuración`, `backing services` → `servicios respaldo`, `disposability` → `disposabilidad`)
8. `"Controles de seguridad y acceso"` (unchanged)
9. `"Semántica de colas didáctica"` (unchanged — LT false positive; correct as-is)
10. `"Observabilidad del job asíncrono"` (unchanged)

**Changes:** 6 of 10 notes translated to Spanish for register consistency.

---

## 7. Proposed GitHub-style Diffs

### Diff for S45-ISSUE-01 — Remove curriculum-owner meta-leak (L282)

```diff
--- a/src/lib/course/sections/s45-iac.ts
+++ b/src/lib/course/sections/s45-iac.ts
@@ -279,7 +279,7 @@
       callout: {
         type: "tip",
         title: "Contrato local",
-        content: "El dueño de S45-T4-A responde por rollback y evidencia.",
+        content: "Cierre de S45-T3-B: la prueba negativa (denegar admin o host desconocido) es evidencia de least-privilege; sin allowlist, no hay promoción.",
       },
     },
```

### Diff for S45-ISSUE-02 — Remove 16 tautological stub assertions (one diff per occurrence; example for L665)

```diff
--- a/src/lib/course/sections/s45-iac.ts
+++ b/src/lib/course/sections/s45-iac.ts
@@ -662,8 +662,6 @@
 results = (assess(valid), assess(invalid), assess(incomplete))
 print(*results)
-meets_contract = ('1A-0' == '1A-0')
-print('meets_contract', meets_contract)
 ` ,
         },
       },
```

*(Apply the analogous deletion at L722, L815, L872, L965, L1022, L1115, L1172, L1265, L1322, L1415, L1472, L1565, L1622, L1715, L1772 — each removes 2 lines: the `meets_contract = ('X-Y' == 'X-Y')` line and the `print('meets_contract', meets_contract)` line.)*

### Diff for S45-ISSUE-03 — Remove `hint:` field (or merge into `hints[0]`) in all 24 weDo steps (example for L583)

```diff
--- a/src/lib/course/sections/s45-iac.ts
+++ b/src/lib/course/sections/s45-iac.ts
@@ -580,7 +580,6 @@
         kind: "guided",
         instruction: "S45-T1-A-E1 · Decide la fuente de verdad del job de reportes en Iquitos (`CASO-IQU-045-1A`). El starter marca PASS cuando el cache es autoritativo o las transacciones viven en cache (DEFECT invertido). Corrige el predicado para exigir blob en object, transacciones en relacional, `cache_authoritative=false` y `cache_ttl_s > 0`. No toques los datos ni el assert. Salida exacta: `S45-T1-A PASS`.",
-        hint: "Relaciona los campos `blob_store`, `transactions`, `cache_authoritative`, `cache_ttl_s` con la regla explicada en S45-T1-A.",
         hints: [
           "Relaciona los campos `blob_store`, `transactions`, `cache_authoritative`, `cache_ttl_s` con la regla explicada en S45-T1-A.",
           "Pista: `blob_store == \"object\"` y `transactions == \"relational\"` y `not cache_authoritative` y `cache_ttl_s > 0`.",
```

*(Apply the analogous `hint:` deletion in all 24 weDo steps.)*

### Diff for S45-ISSUE-04 — Fix gender concord `ensayadas` → `ensayados` (L24)

```diff
--- a/src/lib/course/sections/s45-iac.ts
+++ b/src/lib/course/sections/s45-iac.ts
@@ -21,7 +21,7 @@
     { text: "Restringir IAM al mínimo, paths privados y egress allowlisted con prueba negativa" },
     { text: "Declarar infraestructura por environment y rechazar planes con secretos o destrucción inesperada" },
-    { text: "Presupuestar costo/cuotas (montos en PEN sintéticos) y documentar recovery y portabilidad ensayadas" },
+    { text: "Presupuestar costo/cuotas (montos en PEN sintéticos) y documentar recovery y portabilidad ensayados" },
   ],
```

### Diff for S45-ISSUE-05 — Add period to `vs.` (4 occurrences)

```diff
--- a/src/lib/course/sections/s45-iac.ts
+++ b/src/lib/course/sections/s45-iac.ts
@@ -287,7 +287,7 @@
-**Entrada:** recursos declarados vs planificados, environment, flags de secretos y cambios destructivos.
+**Entrada:** recursos declarados vs. planificados, entorno, flags de secretos y cambios destructivos.
@@ -323,7 +323,7 @@
-**Entrada:** forecast vs budget (PEN), uso vs límite de cuota, flags de restore y export portable.
+**Entrada:** forecast vs. budget (PEN), uso vs. límite de cuota, flags de restore y export portable.
@@ -493,7 +493,7 @@
-why: "La señal correcta es backlog vs umbral (no `lag` para cualquier valor ≥ 0).
+why: "La señal correcta es backlog vs. umbral (no `lag` para cualquier valor ≥ 0).
@@ -1572,7 +1572,7 @@
-instruction: "S45-T4-A-E3 · Decide apply vs rechazo: plan limpio → `CONTINUE`;
+instruction: "S45-T4-A-E3 · Decide apply vs. rechazo: plan limpio → `CONTINUE`;
```

*(Also fixes `environment` → `entorno` on L290 — Issue S45-ISSUE-06.)*

### Diff for S45-ISSUE-06 — `environments`/`environment` → `entornos`/`entorno` (5 occurrences)

```diff
--- a/src/lib/course/sections/s45-iac.ts
+++ b/src/lib/course/sections/s45-iac.ts
@@ -20,7 +20,7 @@
-    { text: "Declarar infraestructura por environment y rechazar planes con secretos o destrucción inesperada" },
+    { text: "Declarar infraestructura por entorno y rechazar planes con secretos o destrucción inesperada" },
@@ -283,7 +283,7 @@
-      heading: "Configuración declarativa y environments",
+      heading: "Configuración declarativa y entornos",
@@ -287,7 +287,7 @@
-**IaC:** infra declarativa por environment (T4-A).
+**IaC:** infra declarativa por entorno (T4-A).
@@ -290,7 +290,7 @@
-**Entrada:** recursos declarados vs planificados, environment, flags de secretos y cambios destructivos.
+**Entrada:** recursos declarados vs. planificados, entorno, flags de secretos y cambios destructivos.
@@ -540,7 +540,7 @@
-why: "El plan se acepta solo si coincide con lo declarado, el environment es válido y no hay secretos ni destrucciones inesperadas.
+why: "El plan se acepta solo si coincide con lo declarado, el entorno es válido y no hay secretos ni destrucciones inesperadas.
```

### Diff for S45-ISSUE-07 — `terminalización` → `envío a terminal` (2 occurrences)

```diff
--- a/src/lib/course/sections/s45-iac.ts
+++ b/src/lib/course/sections/s45-iac.ts
@@ -17,7 +17,7 @@
-    { text: "Garantizar deduplicación por clave, ordenamiento acotado y terminalización en DLQ" },
+    { text: "Garantizar deduplicación por clave, ordenamiento acotado y envío a terminal en DLQ" },
@@ -1789,7 +1789,7 @@
-      "Incluye cola con deduplicación por clave, retry y terminalización en DLQ.",
+      "Incluye cola con deduplicación por clave, retry y envío a terminal en DLQ.",
```

### Diff for S45-ISSUE-08 — `capturazo` → `captura` (L109)

```diff
--- a/src/lib/course/sections/s45-iac.ts
+++ b/src/lib/course/sections/s45-iac.ts
@@ -106,7 +106,7 @@
-        "En `CASO-IQU-045`: el status relacional del job de reportes se declara *read-after-write*; el object store del artefacto puede ser eventual entre regiones. Un backup diario sintético con restore de 25 min frente a RTO 30 min y RPO 6 h es evidencia de T1-B — no un capturazo de consola.",
+        "En `CASO-IQU-045`: el status relacional del job de reportes se declara *read-after-write*; el object store del artefacto puede ser eventual entre regiones. Un backup diario sintético con restore de 25 min frente a RTO 30 min y RPO 6 h es evidencia de T1-B — no una captura de consola.",
```

### Diff for S45-ISSUE-10 — `un checklist de booleans` → `una lista de verificación de booleanos` (L1856)

```diff
--- a/src/lib/course/sections/s45-iac.ts
+++ b/src/lib/course/sections/s45-iac.ts
@@ -1853,7 +1853,7 @@
-    portfolioNote: "Evidencia de CP-N4-B · job asíncrono resiliente: muestra baseline, decisión de stores, colas con DLQ, IAM/egress, presupuesto/restore, pruebas normal/breach/uncertain, resultado medido, rollback y riesgo residual. El esqueleto no es un checklist de booleans: implementa el contrato y enlaza artefactos del proyecto.",
+    portfolioNote: "Evidencia de CP-N4-B · job asíncrono resiliente: muestra baseline, decisión de stores, colas con DLQ, IAM/egress, presupuesto/restore, pruebas normal/breach/uncertain, resultado medido, rollback y riesgo residual. El esqueleto no es una lista de verificación de booleanos: implementa el contrato y enlaza artefactos del proyecto.",
```

### Diff for S45-ISSUE-13 — Split long sentence in `weDo.intro` (L576)

```diff
--- a/src/lib/course/sections/s45-iac.ts
+++ b/src/lib/course/sections/s45-iac.ts
@@ -573,7 +573,9 @@
   weDo: {
-    intro: "S45 · Laboratorio de arquitectura distribuida mínima: 24 retos locales sobre **ocho familias** de fixture de `CASO-IQU-045` (Iquitos sintético; mismos campos por familia, no ocho novelas distintas). Cada subtema sigue E1 → E2 → E3 con andamiaje que se retira: E1 repara un predicado de dominio con un defecto claro; E2 clasifica válido / adverso / campo faltante; E3 decide continue / breach / uncertainty en fail-closed. Conserva los datos del starter; corrige solo la decisión defectuosa. Lee el contrato local del subtema antes de tocar el booleano.",
+    intro: "S45 · Laboratorio de arquitectura distribuida mínima: 24 retos locales sobre **ocho familias** de fixture de `CASO-IQU-045` (Iquitos sintético; mismos campos por familia, no ocho novelas distintas). Cada subtema sigue E1 → E2 → E3 con andamiaje que se retira. E1 repara un predicado de dominio con un defecto claro. E2 clasifica válido / adverso / campo faltante. E3 decide `continue` / `breach` / `uncertainty` con política fail-closed (deniega por defecto ante la incertidumbre). Conserva los datos del starter; corrige solo la decisión defectuosa. Lee el contrato local del subtema antes de tocar el booleano.",
```

### Diff for S45-ISSUE-14 — `un print decorativo` → `una impresión decorativa` (L571)

```diff
--- a/src/lib/course/sections/s45-iac.ts
+++ b/src/lib/course/sections/s45-iac.ts
@@ -568,7 +568,7 @@
-        why: "El forecast en PEN sintéticos se compara con el budget; recovery solo es listo si el drill de restore y el export portable están ambos ensayados — no basta un print decorativo.",
+        why: "El forecast en PEN sintéticos se compara con el budget; recovery solo cuenta si el drill de restore y el export portable están ambos ensayados — no basta una impresión decorativa.",
```

### Diff for S45-ISSUE-15 + S45-ISSUE-17 — Replace T4-A forward-reference callout with proper T4-A closure (L318)

```diff
--- a/src/lib/course/sections/s45-iac.ts
+++ b/src/lib/course/sections/s45-iac.ts
@@ -315,7 +315,7 @@
       callout: {
         type: "tip",
         title: "Contrato local",
-        content: "Cierre de S45-T4-B: residual risk y límites del lab stdlib.",
+        content: "Cierre de S45-T4-A: drift, secretos en plan y destroys inesperados son señales de rechazo, no de \"aplicar y ver\".",
       },
     },
```

### Diff for S45-ISSUE-16 — Rename `id` from `iac` to `platform-contracts` and file from `s45-iac.ts` to `s45-platform-contracts.ts` (recommendation; requires updating imports)

```diff
--- a/src/lib/course/sections/s45-iac.ts
+++ b/src/lib/course/sections/s45-platform-contracts.ts
@@ -1,6 +1,6 @@
 import type { CourseSection } from '../../types'

-export const section45: CourseSection = {
-  id: "iac",
+export const section45: CourseSection = {
+  id: "platform-contracts",
   index: 45,
   title: "Cloud, almacenamiento, colas e infraestructura",
```

*(Also update `src/lib/course/index.ts` to import from the new file name. This is a higher-risk refactor — recommend only if Section 45 has not yet been widely bookmarked by learners, since the URL hash may include the `id`.)*

### Diff for S45-ISSUE-20 (resources notes normalization)

```diff
--- a/src/lib/course/sections/s45-iac.ts
+++ b/src/lib/course/sections/s45-iac.ts
@@ -1914,29 +1914,29 @@
       {
         label: "Terraform language",
         url: "https://developer.hashicorp.com/terraform/language",
-        note: "Infraestructura declarativa y state",
+        note: "Infraestructura declarativa y estado",
       },
       {
         label: "AWS Well-Architected Framework",
         url: "https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html",
-        note: "Reliability, security y cost",
+        note: "Fiabilidad, seguridad y costo",
       },
       {
         label: "CloudEvents",
         url: "https://cloudevents.io/",
         note: "Envelope interoperable de eventos",
       },
       {
         label: "AWS SQS best practices",
         url: "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-best-practices.html",
-        note: "At-least-once, DLQ, idempotencia",
+        note: "At-least-once, DLQ e idempotencia",
       },
       {
         label: "AWS SQS dead-letter queues",
         url: "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html",
-        note: "DLQ y poison messages",
+        note: "DLQ y mensajes venenosos",
       },
       {
         label: "AWS IAM best practices",
         url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html",
-        note: "Least privilege",
+        note: "Mínimos privilegios",
       },
       {
         label: "Twelve-Factor App",
         url: "https://12factor.net/",
-        note: "Config, backing services y disposability",
+        note: "Configuración, servicios respaldo y disposabilidad",
       },
```

---

## 8. Recommended Priority Order for fixing

Ranked by (severity × learner-impact × ease-of-fix):

| Rank | Issue | Severity | Effort | Why first? |
|---|---|---|---|---|
| 1 | **S45-ISSUE-02** — Remove 16 tautological stub assertions in `solutionCode` | H | Trivial (delete 2 lines × 16 = 32 lines) | Highest-severity learner-visible residue; trivial mechanical fix; no risk of breaking solutions (the `assert` lines remain). |
| 2 | **S45-ISSUE-01** — Replace curriculum-owner meta-leak callout (L282) | H | Trivial (1 line) | Highest-severity meta-leak; trivial rewrite; immediate immersion recovery. |
| 3 | **S45-ISSUE-04** — Fix `ensayadas` → `ensayados` gender concord (L24) | M | Trivial (1 word) | Grammar defect in `learningOutcomes`; high-visibility field. |
| 4 | **S45-ISSUE-06** — `environment(s)` → `entorno(s)` (5 occurrences) | M | Easy (5 word swaps) | Register consistency; heading-level visibility. |
| 5 | **S45-ISSUE-05** — Add period to `vs.` (4 occurrences) | L | Trivial (4 chars) | Typographic correctness; LanguageTool-confirmed. |
| 6 | **S45-ISSUE-15 + S45-ISSUE-17** — Replace T4-A forward-reference callout (L318) | L | Easy (1 line rewrite) | Removes both forward-reference confusion and untranslated `"residual risk"` in one fix. |
| 7 | **S45-ISSUE-08** — `capturazo` → `captura` (L109) | L | Trivial (1 word) | Register normalization. |
| 8 | **S45-ISSUE-10** — `un checklist de booleans` → `una lista de verificación de booleanos` (L1856) | L | Trivial (4 words) | LanguageTool-confirmed concord issue. |
| 9 | **S45-ISSUE-07** — `terminalización` → `envío a terminal` (2 occurrences) | L | Easy (2 phrase swaps) | RAE-safety; neologism removal. |
| 10 | **S45-ISSUE-14** — `un print decorativo` → `una impresión decorativa` (L571) | L | Trivial (2 words) | Loanword translation. |
| 11 | **S45-ISSUE-13** — Split long `weDo.intro` sentence (L576) | L | Easy (1 string rewrite) | Cognitive load reduction. |
| 12 | **S45-ISSUE-03** — Remove duplicated `hint:` field in 24 weDo steps | M | Mechanical (delete 24 lines) | Source-bloat reduction; divergence-risk elimination. Same fix as S37. |
| 13 | **S45-ISSUE-20** — Normalize resources notes to Spanish (6 of 10 notes) | L | Easy (6 line edits) | Register consistency in `resources` tab. |
| 14 | **S45-ISSUE-09** — Gloss `fail-closed` on first use (5 occurrences) | L | Easy (5 backtick/gloss additions) | Register polish. |
| 15 | **S45-ISSUE-12** — Split 8 theory "Contrato local" paragraphs into 2 paragraphs each | L | Moderate (8 paragraph splits) | Cognitive-load reduction; preserves template. |
| 16 | **S45-ISSUE-11** — Vary 8 `"Contrato local"` callout titles | L | Easy (8 title rewrites) | Anaphora reduction. |
| 17 | **S45-ISSUE-18** — Vary 8 `"Salida: imprime el valor de meets_contract."` E3 instruction tails | L | Moderate (8 instruction rewrites) | Lazy-scaffolding reduction. |
| 18 | **S45-ISSUE-19** — Reduce `S45-T*-E*-N` / `CP-N4-B` saturation (low priority) | L | Hard (would require template redesign) | Course-wide pattern; defer to a global pass. |
| 19 | **S45-ISSUE-16** — Rename `id: "iac"` → `id: "platform-contracts"` and file rename | L | Hard (requires `index.ts` import update; possible URL-hash risk) | Only if no learners have bookmarked `iac` URLs. |
| 20 | **S45-ISSUE-20 (advisory)** — Anglicism density normalization | L | Hard (would require rewriting most paragraphs) | Not a defect per se; defer to a global anglicism-policy pass. |

---

## 9. Graph Memory Update notes (for the shared context files)

**For the orchestrator's shared context:**

- **S45 file**: `src/lib/course/sections/s45-iac.ts` (1,978 lines, the second-largest section audited so far after S37's 1,787 lines — actually S45 is larger).
- **S45 case study**: `CASO-IQU-045` (Iquitos ficticio; synthetic data; no PII; no real cloud; no egress; PEN soles sintéticos). Continues the per-section case-study convention.
- **S45 gate**: `CP-N4-B` ("job asíncrono resiliente: reintentos no duplican resultados y costo, IAM, backup y recuperación quedan medidos"). Cross-references the master roadmap's competency-path code.
- **S45 upstream bridge**: S44 (multimodal artifact as input) — explicitly named in theory[0].paragraphs[2].
- **S45 downstream bridge**: implicit forward to CP-N4-B gate (no explicit S46 reference).
- **S45 pedagogical structure**: 4 subtopics × 2 demos = 8 I-Do; 4 × 3 = 24 We-Do (E1/E2/E3 scaffolding); 1 You-Do portfolio; 7 Self-check questions; 6-criterion rubric (100%).
- **S45 contract-predicate signature**: every weDo step centers on a `meets_contract = ...` boolean predicate (E1), an `assess() → str` classifier (E2), or a `decide() → str` router (E3). Tokens: `WRITE_STORE_ADR`, `REDESIGN_PERSISTENCE`, `DECLARE_DATA_LOSS_RISK`, `RUN_RESTORE_DRILL`, `NACK_AND_RETRY`, `VERIFY_DELIVERY_SEMANTICS`, `DEDUP_OR_DLQ`, `INSPECT_MESSAGE_ORDER`, `APPLY_BACKPRESSURE`, `REQUEST_CAPACITY`, `DENY_IAM_OR_EGRESS`, `REQUEST_SCOPED_POLICY`, `REJECT_IAC_PLAN`, `REVIEW_DRIFT`, `FREEZE_SCALE_OUT`, `COST_OWNER_REVIEW`, `CONTINUE`, `MISSING:<field>`.
- **S45 shared defects with other sections**:
  - S45-ISSUE-03 (`hint`/`hints[0]` duplication in 24/24 weDo steps) — same as S01-ISSUE-NN and S37-ISSUE-02. **Course-wide pattern; recommend a global fix pass.**
  - S45-ISSUE-19 (curriculum-code saturation `S45-T*-E*-N` in `instruction`/`feedback` prefixes) — same as S37-ISSUE-03. **Course-wide pattern.**
  - S45-ISSUE-16 (`id` mismatch) — analogous to S37-ISSUE-01 (stale `dbt-bigquery` id for a profiling section). S45's `iac` is less severely mismatched (IaC is one of 8 subtopics) but still doesn't capture the full scope. **Recommend a global `id`-vs-title audit.**
- **S45 unique defects**:
  - S45-ISSUE-01 (curriculum-owner meta-leak `"El dueño de S45-T4-A responde…"`) — not seen in earlier sections; new meta-leak class.
  - S45-ISSUE-02 (16 tautological `meets_contract = ('X-Y' == 'X-Y')` stubs in solutionCode) — new authoring-residue class; not seen in S37.
  - S45-ISSUE-07 (`terminalización` neologism) — new; not seen in S37.
  - S45-ISSUE-08 (`capturazo` Peruvian colloquial) — new; not seen in S37 (which used `mismo resultado` defect instead).
- **S45 quality rank (vs S37)**: S45 scores 7.6, S37 scored 7.2. S45 is slightly stronger because (a) it lacks the S37 `mismo resultado` article-defect (only 1 borderline occurrence vs 6), (b) its `id` mismatch is less severe, and (c) its connective tissue (S44 bridge) is more explicit. S45 is slightly weaker because of the new meta-leak classes (curriculum-owner, tautological stubs).
- **S45 grammar-metrics aggregate** (260 sentences):
  - WPS median: 14 (excellent; target 15-32 for technical Spanish — actually slightly below target, suggesting crisp prose).
  - SPW median: 1.7 (excellent; well below the 2.0 lexical-complexity threshold).
  - FH median: 88.0 ("muy fácil" band — very accessible for a Master-level section; possibly too easy, suggesting the section under-uses complex syntax).
  - INFLESZ median: 84.1 ("muy fácil" band — same observation).
  - Findings: 45 `missing_terminal` (almost all false positives on headings/taglines/learning-outcomes/rubric-criteria/notes — by design), 1 `long_gt32` (the weDo.intro long sentence, Issue S45-ISSUE-13), 1 `high_comma_density` (the portfolioNote, Issue S45-ISSUE-10). No missing inverted marks, no unbalanced delimiters, no double-space, no space-before-punct, no repeated-word typos, no gerund pile-up.
- **S45 LanguageTool aggregate** (703 matches, 2 chunks):
  - 684 `MORFOLOGIK_RULE_ES` (spelling) — almost all false positives on English tech terms (object store, cache, worker, job, etc.) that are valid loanwords in Spanish tech prose.
  - 4 `SUBJUNTIVO_PASADO` — false positives (LT ambiguity on conditional constructions).
  - 4 `DIACRITICS_VERB_N_ADJ` — false positives (`solo` adverb no longer takes tilde per RAE 2010).
  - 2 `COMMA_PARENTHESIS_WHITESPACE` — false positives (inside set notation `{dev,staging,prod}`).
  - 1 `AGREEMENT_PARTICIPLE_NOUN` — **real** (`ensayadas` gender concord, Issue S45-ISSUE-04).
  - 1 `PUNTO_EN_ABREVIATURAS` — **real** (`vs` without period, Issue S45-ISSUE-05).
  - 1 `DIACRITICS_OTHERS` — likely false positive.
  - 1 `AGREEMENT_NUMERAL_PLURAL` — false positive (`política at-least-once correcta` — `correcta` agrees with `política`).
  - 1 `AGREEMENT_POSTPONED_ADJ` — false positive (`workers/cuota/red rotos` — masculine plural default is correct for mixed gender).
  - 1 `VOSEO` — false positive (`Revisa el plan` is tuteo imperative, not voseo; course register is consistent tuteo).
  - 1 `AGREEMENT_DET_NOUN` — **real** (`un checklist`, Issue S45-ISSUE-10).
  - 1 `FALTA_ELEMENTO_ENTRE_VERBOS` — false positive (`Cache nunca es fuente de verdad`).
  - 1 `AGREEMENT_ADJ_NOUN` — false positive (`Semántica de colas didáctica` — `didáctica` agrees with head noun `Semántica`).
- **Net real LanguageTool findings**: 3 (S45-ISSUE-04, S45-ISSUE-05, S45-ISSUE-10). All Low/Medium severity. **Excellent grammar quality overall.**

---

## 10. Method Note (research summary)

### 10.1 Readability formulas applied
- **Fernández-Huerta (1959)**: `206.84 − 60·(syllables/word) − 1.02·(words/sentence)` — Spanish Flesch adaptation.
- **Szigriszt-Pazos / INFLESZ**: `206.835 − 62.3·(syllables/word) − (words/sentence)` — Spanish "perspicuity".
- **WPS** (words per sentence) and **SPW** (syllables per word) — structural-load and lexical-complexity indicators.
- Bands: ≥90 muy fácil → <30 muy difícil. For technical Spanish, "normal / bastante difícil" (~50-70) is healthy; extreme easy may mean under-teaching; extreme hard means cognitive overload.

### 10.2 Heuristic checks applied (per sentence, offline)
- Run-on (>45 words) / long (>32) — flagged 1.
- Missing terminal `.?!` — flagged 45 (almost all false positives on headings/objectives).
- Missing `¿` / `¡` — flagged 0.
- Unbalanced `()[]«»""` — flagged 0.
- Repeated word (`de de`, `que que`) — flagged 0.
- English-dominant sentence — flagged 0 (none wholly English).
- Meta/AI/TODO leak — flagged 0 by heuristic; manual review found 2 HIGH (Issues 01, 02) and several L.
- Gerund pile-up (≥3) — flagged 0.
- High comma density — flagged 1.
- Paragraph = one long sentence — flagged 0.
- Anaphoric monotony (same sentence start) — flagged at template level (Issue 12).
- Space-before-punct / double space — flagged 0.

### 10.3 LanguageTool `es` (public API)
- 2 chunks, ~22.5k chars total, 4-second throttle between chunks.
- 703 total matches; 3 real (after filtering 684 spelling false positives on English tech loanwords and ~16 false-positive grammar matches).

### 10.4 False-positive classes documented
- `missing_terminal` on headings, taglines, learning-outcomes (imperative verbs), rubric criteria, resources notes — by design (these are not full sentences).
- `MORFOLOGIK_RULE_ES` on English tech loanwords (object store, cache, worker, job, plan, gate, lag, drill, etc.) — valid in Spanish tech prose.
- `DIACRITICS_VERB_N_ADJ` on `solo` (adverb) — no longer takes tilde per RAE 2010.
- `SUBJUNTIVO_PASADO` on conditional constructions — LT ambiguity false positive.
- `AGREEMENT_POSTPONED_ADJ` on mixed-gender plural noun phrases — masculine plural default is correct per RAE.
- `VOSEO` on tuteo imperatives (`Revisa`, `Corrige`, `Decide`) — course register is consistent tuteo, not voseo.
- `AGREEMENT_ADJ_NOUN` on `Semántica de colas didáctica` — `didáctica` correctly agrees with head noun `Semántica`.

---

## 11. Validation

- **Nonzero prose extraction**: 187 records (165 Spanish), 260 sentences — ✓.
- **FH in plausible range**: median 88.0, min 7.8 (a 4-word heading), max 156.8 (a 3-word shortTitle) — ✓.
- **Findings density normalized by sentence count**: 47 heuristic findings / 260 sentences = 18% — driven almost entirely by `missing_terminal` false positives on headings; real findings density = 2/260 = 0.8% — ✓ (very low).
- **LanguageTool false-positive rate**: 700/703 = 99.6% (driven by English tech loanwords) — confirms the section's prose is grammatically clean; the loanword density is a stylistic choice, not a defect.

---

## 12. Final Verdict

Section 45 is a **technically rigorous, pedagogically exemplary Master-level cloud/infra section** with **best-in-class progressive disclosure** (T1→T2→T3→T4) and **excellent connective tissue** (explicit S44 bridge, CP-N4-B gate alignment). The grammar quality is high (only 3 real LanguageTool findings across 260 sentences; 0.8% real-finding density).

The score (7.6/10) is held back by:
- 2 HIGH-severity issues (curriculum-owner meta-leak in L282 callout; 16 tautological stub assertions in solutionCode) — both trivial to fix.
- 5 MEDIUM-severity issues (hint duplication, gender concord, environment(s) inconsistency, id mismatch, paragraph-template monotony).
- 13 LOW-severity issues (vs. period, capturazo, terminalización, fail-closed gloss, checklist, etc.).

All issues are **fixable** without altering the section's pedagogical structure. The contract-predicate approach (`meets_contract = ...` → `assess() → str` → `decide() → str`) is the section's signature innovation and is **best-in-class** for teaching distributed-systems contracts.

**Recommended next action**: Apply the priority-1 and priority-2 fixes (Issues 02 and 01) immediately — they are 1-line and 32-line deletions respectively, with zero risk of breaking solutions. Then batch the priority-3 through priority-11 fixes (single-word and single-line edits) in one PR. Defer priority-12 through priority-20 to a global course-wide pass.

---

**This is the complete Explorer report for Section 45. Ready for the Fixer prompt.**
