# PyArcana — Section 44 Curriculum Audit Report (S44)

> **Auditor:** Curriculum Auditor (general-purpose subagent)
> **Section:** 44 (`section44`, `id: "multimodal"` — **STALE IDENTIFIER**, see S44-ISSUE-01)
> **Source file:** `src/lib/course/sections/s44-multimodal.ts` (2,002 lines)
> **Live site:** https://pillb.github.io/pyarcana/ — Section 44 = "CI/CD y seguridad de la cadena de suministro"
> **Repo:** https://github.com/PillB/pyarcana (verified at `/home/z/my-project/pyarcana_repo`)
> **Method:** Stanford STORM + Graph/Loop/Harness Engineering; Spanish readability (Fernández-Huerta, INFLESZ, WPS/SPW) + LanguageTool `es` (public API) + offline pedagogical heuristics from `_GRAMMAR_SUBPLAN.md`.
> **Audit-only:** No edits applied. All diffs are proposals.

---

## 1. Section Identification & Scope

**Confirmed Section identity (live site + source).** The home page at https://pillb.github.io/pyarcana/ renders Section 44 with:

- `shortTitle`: `"CI/CD supply chain"`
- `tagline` (verbatim): `"pipeline que bloquea dependencia insegura o test crítico, publica artefacto verificable y demuestra rollback"`
- `index: 44`, `phase: 3` (Master), `estimatedHours: 20`, `level: "Master"`, `icon: "GitBranch"`

The live index entry was located on the rendered page (between Section 43 "LLMOps" and Section 45 "IaC") and matches the source TS file `s44-multimodal.ts` field-for-field. The SPA is client-rendered Next.js, so the TS file is the canonical artifact.

**Critical scope anomaly (confirmed).** Despite the file name `s44-multimodal.ts`, the section field `id: "multimodal"`, the PdfReport label `multimodal: '44. Multi-Modal'`, and the `SectionView.tsx` interactive-demo key `'multimodal'` (which serves a **CLIP + Whisper multimodal AI demo**), the **entire content of the section is about CI/CD and supply-chain security** (lint/types/tests matrices, least privilege, SHA pinning, secret scanning, SBOM/provenance/attestations, environments/approvals, canary/rollback, branch protection, failure handling). The original `learning_roadmap.md` (V1/V2) listed Section 44 = "Multimodal AI" (CLIP, Whisper, multimodal RAG). The current `learning_roadmap_52_V3.md` lists Section 44 = "CI/CD y seguridad de la cadena de suministro". The section was **re-purposed in V3 without renaming the file, the `id`, the PdfReport label, or the interactive demo** — a real meta-leak of authoring history (see S44-ISSUE-01, S44-ISSUE-02, S44-ISSUE-03).

**Scope audited (all learner-facing prose):**

| Field group | Count audited |
|---|---|
| `title`, `shortTitle`, `tagline`, `jobRelevance`, `learningOutcomes[*].text` | 1 + 1 + 1 + 1 + 8 |
| `theory[*].heading` + `paragraphs[*]` + `callout.{title,content}` | 9 headings, ~24 paragraphs, 8 callouts |
| `iDo.intro` + 8 × `iDo.steps[*].{description,why}` | 1 + 16 |
| `weDo.intro` + 24 × `weDo.steps[*].{instruction,hint,hints[],edgeCases[],tests,feedback}` | 1 + ~150 strings |
| `youDo.{title,context,objectives[],requirements[],portfolioNote,rubric[].criterion}` | ~22 strings |
| `selfCheck.questions[*].{question,options[],explanation}` | 5 × ~6 = ~30 strings |
| `resources.{docs,books,courses}[*].{label,note}` | ~24 strings |

**Total Spanish prose units extracted and scored: 180 records → 162 Spanish records → 224 sentences** (after filtering code-only / English-only scaffolding strings). Full extraction: `/home/z/my-project/audits/S44_records.json`, `/home/z/my-project/audits/S44_metrics.json`, `/home/z/my-project/audits/S44_prose.txt`, `/home/z/my-project/audits/S44_lt.json`.

The section is structured as **4 sub-topics × 2 demos each = 8 I-Do demos** plus **4 sub-topics × 3 exercises each = 24 We-Do exercises** with E1 (guided) → E2 (independent) → E3 (transfer) decreasing-scaffolding pattern. Sub-topics: T1 (CI: matrices + caches/artifacts/condiciones), T2 (Seguridad: perms/pin/secret-scan + SBOM/provenance/attestations), T3 (CD: environments/approvals + migrations/canary/rollback), T4 (Gobierno: branch/review/notes + failure handling).

---

## 2. Executive Summary of Quality

**Composite score: 6.4 / 10**

**Verdict:** Section 44 is **technically rigorous and pedagogically well-architected** — the I Do / We Do / You Do / Self-check structure with E1/E2/E3 decreasing scaffolding is best-in-class for the course, the synthetic-fixture discipline (`CASO-PIU-044`, no PII, no real secrets, fail-closed gates) is exemplary, and the bridge back to S43 (contenedor) and forward to S45 (cloud/colas) is the strongest narrative spine in the third phase. The 24-exercise triplet pattern is consistent and the rubric is concrete and operable.

The score is held down from 8.5+ by **fixable issues**:

1. **One CRITICAL meta-leak chain (file name + id + interactive demo + PdfReport label)**: the section was re-purposed from "Multimodal AI" to "CI/CD supply chain" in roadmap V3, but the file name `s44-multimodal.ts`, the `id: "multimodal"`, the PdfReport label `'44. Multi-Modal'`, and — most seriously — the **`SectionView.tsx` interactive-demo keyed `'multimodal'`** (which serves a CLIP/Whisper multimodal AI demo) were all left untouched. **Learners viewing the theory tab of Section 44 see a CLIP/Whisper multimodal demo ("Practica CLIP y Whisper (simulado)") instead of any CI/CD demo.** This is the worst-case meta-leak: it actively corrupts pedagogy, not just URL aesthetics.
2. **Six recurring grammatical defects**:
   - 6 occurrences of `"mismo digest probado"` without the required article `"el"` (T3-A instruction + hints + edgeCases). The section itself uses the **correct** form `"el mismo digest"` 11 times — confirming internal inconsistency rather than stylistic choice.
   - 3 occurrences of a broken template `"el fixture conserva [CLAUSE_WITH_VERB]"` where the slot was filled with a sentence (subject + verb) instead of a noun phrase, producing ungrammatical Spanish (T1-B-E1 hints, T2-B-E1 hints, T4-B-E1 hints).
   - 1 English calque `"residual risk"` in T4-A callout (the rubric uses `"riesgo residual"` — internal inconsistency).
   - 1 broken verb chain `"el fixture conserva cache miss conserva resultado y artifact es verificable"` (T1-B-E1 hint[1]).
3. **Eight callouts in `theory[*]` are written as internal scaffolding notes** rather than learner-facing pedagogy. Patterns like `"Nota de orientación: S44-T1-A: caso sintético con asserts locales"`, `"Contrato S44-T2-B: fixture S44-T2-B; si falta evidencia, no promociones."`, `"Promoción de S44-T3-B solo con evidencia reproducible"`, `"Cierre de S44-T4-B: documenta residual risk y límites del lab stdlib."` read like author-to-author tracker entries, with circular self-references (`Contrato S44-T2-B: fixture S44-T2-B`) and section-step markers as sentence subjects (`El dueño de S44-T4-A responde por rollback`).
4. **Extreme anglicism density** in theory paragraphs, callouts, and instruction fields. Verbs (`promote`, `pinnar`, `escanear`) and inline nouns (`workflow`, `gate`, `cache`, `artifact`, `digest`, `attestation`, `provenance`, `canary`, `rollback`, `release`, `notes`, `branch`, `tag`, `commit`, `check`, `runner`, `job`, `log`, `token`, `secret`, `pin`, `repo`, `pipeline`, `starter`, `fixture`, `breach`, `owner`, `lead`) appear in plain prose **without backticks** when they should either be translated or wrapped as `code`. This is similar to the S37 pattern.
5. **Eight I-Do `description:` fields** all lack terminal punctuation (`"Demo: lint/types/tests y matrices"`) — minor but inconsistent with the rest of the section, which uses periods.
6. **Eight long instruction fields** (WPS ≥ 35, max 42) pack code identifiers, backticks, predicates and parentheticals into a single sentence — the E3 transfer-step instruction template is structurally overloaded.
7. **Verbatim hint duplication**: in 21 of 24 weDo steps, the `hint:` field is a verbatim duplicate of `hints[0]` — bloats the source and risks divergence. (3 T2-A steps deliberately differ; that's the right pattern.)
8. **47 sentences flagged `missing_terminal`** — mostly legitimate headings/titles/labels, but a real subset (the 8 I-Do descriptions and a few `note`/`criterion` fields) would benefit from explicit terminal punctuation for consistency.

None are catastrophic in isolation, but the meta-leak chain (item 1) is severe enough to actively mislead learners on the live site. Pedagogically the underlying section is sound; the fixes are cleanup + a CI/CD-themed interactive demo.

---

## 3. Detailed Issue Registry

Issues are numbered `S44-ISSUE-NN`. Severity: **H** = High (blocks learning or leaks internals), **M** = Medium (clarity/quality defect), **L** = Low (polish).

### Meta-leak & internal-residue issues

#### S44-ISSUE-01 — Stale file name and `id` ("multimodal") contradict the section content [H]
- **Location:** File: `src/lib/course/sections/s44-multimodal.ts` (whole file). Field: `id: "multimodal"` (line 4).
- **Evidence (verbatim):**
  - L3-5: `export const section44: CourseSection = { id: "multimodal", index: 44, title: "CI/CD y seguridad de la cadena de suministro", …`
  - File name: `s44-multimodal.ts`
  - Title: `"CI/CD y seguridad de la cadena de suministro"`; shortTitle: `"CI/CD supply chain"`.
  - **No occurrence of "multimodal", "CLIP", or "Whisper" anywhere in the 2,002-line source** (verified with `grep`).
- **Pedagogical impact:** Three compounding harms:
  1. **URL / state leak**: if the SPA exposes `id` in the URL hash, query string, or analytics events, learners see `multimodal` and either expect a multimodal-AI topic (cognitive dissonance with "CI/CD") or believe the page is broken.
  2. **Source archaeology signal**: any maintainer browsing the repo sees a file name that lies about its content; this erodes curriculum-trust and complicates grep-based audits.
  3. **Roadmap contract violation**: `learning_roadmap_52_V3.md` line 606 says "S44 — CI/CD y seguridad de la cadena de suministro"; `learning_roadmap.md` (V1/V2) line 4059 says "44. Multimodal AI". The file name and `id` were missed in the rename pass.
- **Severity:** H.

#### S44-ISSUE-02 — PdfReport shows wrong label `'44. Multi-Modal'` for section 44 [H]
- **Location:** `src/components/course/PdfReport.tsx` line 84: `multimodal: '44. Multi-Modal',`
- **Evidence:** The PdfReport maps `section.id` → short label. For section 44 it shows `'44. Multi-Modal'` even though the section is about CI/CD supply chain. Learners downloading a progress report see a wrong section title.
- **Pedagogical impact:** A learner exporting their progress report from the live site sees "44. Multi-Modal" as the title of a section they completed as "CI/CD supply chain". This breaks the curriculum contract on a tangible artifact and would confuse employers/recruiters reviewing the report.
- **Severity:** H.

#### S44-ISSUE-03 — Interactive demo for section 44 is a CLIP/Whisper multimodal AI demo, totally unrelated to CI/CD [H — CRITICAL]
- **Location:** `src/components/course/SectionView.tsx` lines 3333-3402: `'multimodal': { title: 'Practica CLIP y Whisper (simulado)', code: …, expectedOutput: …, hint: … }`
- **Evidence:** `InteractivePlaygroundDemo` (defined at line 914) is rendered in EVERY section's theory tab (line 408: `<InteractivePlaygroundDemo sectionId={section.id} sectionTitle={section.title} />`). It looks up `demos[sectionId]` (line 4046). Since `section.id === "multimodal"`, the lookup returns the CLIP/Whisper demo. The demo's title is `'Practica CLIP y Whisper (simulado)'` and its code simulates text/image embeddings (CLIP) and audio transcription (Whisper) — **zero relationship** to CI/CD supply chain.
- **Demo source (verbatim excerpt, SectionView.tsx:3333-3360):**
  ```ts
  'multimodal': {
    title: 'Practica CLIP y Whisper (simulado)',
    code: `# Simulacion de conceptos multi-modales
  # Sin transformers - simulamos con conceptos
  # Simular CLIP: alinear texto e imagen en espacio vectorial
  def text_embedding(text):
      """Simula embedding de texto (CLIP)."""
      words = text.lower().split()
      return [len(w) / 10 for w in words]
  …
  ```
- **Pedagogical impact:** This is the worst-case meta-leak. A learner in the CI/CD supply-chain section sees a "Pruébalo tú mismo" interactive demo about CLIP/Whisper multimodal AI. The cognitive dissonance is total: the section heading says "CI/CD y seguridad de la cadena de suministro" while the playground invites them to "Practica CLIP y Whisper". Worse, the demo's comments say "Sin transformers - simulamos con conceptos" — implying the learner is in a multimodal AI section. This actively corrupts pedagogy and is a strong signal that the section was re-purposed without testing the live UI.
- **Severity:** H (critical, blocks learning).

#### S44-ISSUE-04 — Verbatim duplication of `hint:` and `hints[0]` across 21 of 24 weDo steps [M]
- **Location:** Every `weDo.steps[*]` block (lines ~565–1798). Example, lines 570-572:
  - `hint: "Relaciona los campos \`lint\`, \`types\`, \`tests\`, \`matrix\`, \`supported\` con la regla explicada en S44-T1-A.",`
  - `hints: ["Relaciona los campos \`lint\`, \`types\`, \`tests\`, \`matrix\`, \`supported\` con la regla explicada en S44-T1-A.", "El predicado correcto debe ser verdadero porque el fixture conserva lint/types/tests y matriz soportada en verde; revisa dirección de comparación, conjuntos y negaciones."]`
- **Evidence:** 21/24 weDo steps duplicate the `hint:` field verbatim as `hints[0]`. The 3 exceptions are S44-T2-A-E1, E2, E3 (lines 854, 914, 1004), where `hint:` and `hints[0]` intentionally differ — that is the correct pattern. Same defect was flagged in S01 and S37 audits.
- **Pedagogical impact:** (a) Source bloat — ~21 redundant lines; (b) Divergence risk — if `hint` is updated but `hints[0]` is not, learners see inconsistent hints depending on which field the renderer picks; (c) The single-string `hint` field is redundant with the array `hints` and could be removed entirely; (d) The 3 deliberate exceptions prove the author *can* write distinct summary vs. progressive hints when trying.
- **Severity:** M.

#### S44-ISSUE-05 — Theory callouts written as internal scaffolding notes / circular self-references [M]
- **Location:** All 8 `theory[*].callout.content` fields (lines 58, 98, 138, 193, 226, 262, 294, 326, 357).
- **Evidence (verbatim, representative):**
  - L58: `"Nota de orientación: S44-T1-A: caso sintético con asserts locales; si falta, no promociones."` — double-colon (`Nota de orientación: S44-T1-A:`) is awkward; "Nota de orientación" is editorial meta-language.
  - L193: `"Contrato S44-T2-B: fixture S44-T2-B; si falta evidencia, no promociones."` — circular self-reference (`Contrato S44-T2-B: fixture S44-T2-B`) adds zero information.
  - L226: `"Para S44-T3-A: fixture S44-T3-A; si falta evidencia, no promociones."` — same circular pattern.
  - L262: `"Promoción de S44-T3-B solo con evidencia reproducible y dueño asignado."` — ambiguous; reads as "promoting S44-T3-B" (a subtopic code) rather than "promotion *in* the S44-T3-B scenario".
  - L294: `"El dueño de S44-T4-A responde por rollback y evidencia; sin dueño no hay promote."` — `El dueño de S44-T4-A` personifies a subtopic code as having an owner.
  - L326: `"Cierre de S44-T4-B: documenta residual risk y límites del lab stdlib."` — `"Cierre de S44-T4-B"` is an author-to-author milestone marker, and `"residual risk"` is an English calque (the rubric uses `"riesgo residual"`).
- **Pedagogical impact:** Callouts should be high-signal pedagogical cues (definition, anti-pattern, pitfall, tip). Here they read like tracker entries with the subtopic code as subject. Learners see internal scaffolding instead of a clear concept anchor.
- **Severity:** M.

#### S44-ISSUE-06 — Internal curriculum-code identifiers exposed in learner-facing headings [L]
- **Location:** `theory[0].heading` (line 28): `"Ruta de S44: CI/CD y seguridad de la cadena de suministro"`; `youDo.title` (line 1802): `"CI/CD y seguridad de la cadena de suministro"`; `weDo.intro` (line 563): `"S44 · Laboratorio de pipeline CI/CD con supply-chain gates: 24 retos …"`.
- **Evidence:** The internal section code `S44` is part of the heading text. `CASO-PIU-044` and `CP-N4-B` (competency path code) appear throughout.
- **Pedagogical impact:** Minor. A learner unfamiliar with the code sees `S44` as noise. The code adds little learning value at the heading position; it could be moved to a `meta` field for grading/analytics.
- **Severity:** L.

### Grammar & redaction issues

#### S44-ISSUE-07 — Recurring `"mismo digest probado"` missing article `"el"` (6 occurrences in T3-A) [M]
- **Location:** Lines 116, 1235, 1241, 1275, 1277, 1328, 1330.
- **Evidence (verbatim):**
  - L1235 (S44-T3-A-E1 instruction): `"La entrada es el dict completo del starter; la operación debe demostrar mismo digest probado y aprobación independiente."`
  - L1241 (S44-T3-A-E1 edgeCases): `"fixture adverso: mismo digest probado y aprobación independiente"`
  - L1275 (S44-T3-A-E2 hints[1]): `"Después aplica la regla de S44-T3-A: mismo digest probado y aprobación independiente."`
  - L1328 (S44-T3-A-E3 hints[1]): `"Para datos completos reutiliza la regla que demostró mismo digest probado y aprobación independiente; solo ese caso devuelve \`CONTINUE\`."`
  - L1277, L1330 (edgeCases): same string as L1241.
- **Internal inconsistency:** The section uses the **correct** form `"el mismo digest"` 11 times elsewhere (L20, L233, L362, L458, L491, L1093, L1099, L1133, L1135, L1186, L1188). The T3-A subset is the only one missing the article.
- **Pedagogical impact:** Grammatical defect in formal Spanish ("demostrar mismo digest" is substandard; RAE prescribes "demostrar el mismo digest"). Senior learners writing Spanish PRs will copy the form. Recurrence across instruction → hints → edgeCases amplifies the defect.
- **Severity:** M.

#### S44-ISSUE-08 — Broken template `"el fixture conserva [CLAUSE_WITH_VERB]"` (3 occurrences) [M]
- **Location:** T1-B-E1 hints[1] (L715), T2-B-E1 hints[1] (L1097), T4-B-E1 hints[1] (L1665).
- **Evidence (verbatim):**
  - L715: `"El predicado correcto debe ser verdadero porque el fixture conserva cache miss conserva resultado y artifact es verificable; revisa dirección de comparación, conjuntos y negaciones."` — two verbs `conserva` … `conserva` with no conjunction; the slot was filled with a sentence (`cache miss conserva resultado`) where a noun phrase was expected.
  - L1097: `"El predicado correcto debe ser verdadero porque el fixture conserva SBOM y provenance coinciden con digest; revisa dirección de comparación, conjuntos y negaciones."` — `conserva SBOM y provenance coinciden` is ungrammatical (conserva + NP + verb-in-plural); should be `conserva SBOM y provenance que coinciden con el digest` or `conserva: SBOM y provenance coinciden con el digest`.
  - L1665: `"El predicado correcto debe ser verdadero porque el fixture conserva fallo crítico bloquea y deja evidencia auditable; revisa dirección de comparación, conjuntos y negaciones."` — `conserva fallo crítico bloquea` is ungrammatical; should be `conserva: fallo crítico bloquea y deja evidencia auditable` or `conserva el patrón en que un fallo crítico bloquea y deja evidencia auditable`.
- **Pedagogical impact:** Three of the 24 E1 hints (12.5%) are grammatically broken. A learner reading them parses two verbs in a row and loses the meaning. The template was designed for noun-phrase fills (e.g., L573 `"el fixture conserva lint/types/tests y matriz soportada en verde"`, L1239 `"el fixture conserva promoción sin rebuild y con aprobación"`, L1523 `"el fixture conserva release trazable a review y changelog"`) but the author pasted a full clause in 3 cases.
- **Severity:** M.

#### S44-ISSUE-09 — English calque `"residual risk"` in T4-A callout, contradicts rubric's `"riesgo residual"` [L]
- **Location:** L326 (theory T4-A callout content): `"Cierre de S44-T4-B: documenta residual risk y límites del lab stdlib."`
- **Evidence:** `residual risk` is a verbatim English calque in Spanish prose. The section's own rubric (L1818) uses the correct `"riesgo residual"`.
- **Pedagogical impact:** Inconsistency; tone slip; signals editorial residue from an English draft.
- **Severity:** L.

#### S44-ISSUE-10 — English-dominant sentence in self-check explanation with informal-tú verb [L]
- **Location:** L1926 (self-check Q4 explanation): `"El lab es sintético a propósito: practicas gates (pin, SBOM, aprobación, rollback) sin PII ni secretos reales; omitir evidencia de supply chain no aprueba el gate."`
- **Evidence:**
  - English tech nouns inline (no backticks): `lab`, `gates`, `pin`, `SBOM`, `PII`, `supply chain`, `gate`.
  - `practicas` is **tú**-form verb (informal) without an explicit subject; the rest of the section is more impersonal (`se deriva`, `se conserva`, `se bloquea`). The LanguageTool rule `PRACTICA` fired here: "Si es adjetivo o nombre, se escribe con tilde. Correcto si es del v. 'practicar'." The form is grammatically correct as tú-verb, but stylistically inconsistent with surrounding register.
- **Pedagogical impact:** Register shift + anglicism density. Spanish equivalents are readily available: `El laboratorio es sintético a propósito: practicas gates (pin, SBOM, aprobación, rollback) sin PII ni secretos reales` → `El laboratorio es sintético a propósito: practicas los controles (pin, SBOM, aprobación, rollback) sin PII ni secretos reales`.
- **Severity:** L.

#### S44-ISSUE-11 — `"Nota de orientación"` editorial meta-language in T1-A callout [L]
- **Location:** L58 (theory T1-A callout content): `"Nota de orientación: S44-T1-A: caso sintético con asserts locales; si falta, no promociones."`
- **Evidence:** `"Nota de orientación"` is editorial framing — a teacher-to-author signal saying "this callout is an orientation note". The learner-facing content is the actual rule (`caso sintético con asserts locales; si falta, no promociones`). The framing is unnecessary and the double colon (`Nota de orientación: S44-T1-A:`) is awkward.
- **Pedagogical impact:** Tone shift; learner reads authorial scaffolding.
- **Severity:** L.

#### S44-ISSUE-12 — Bolded conjunction `**y**` for emphasis in theory T1-A paragraph [L]
- **Location:** L67 (theory T1-A paragraph 3): `"El PR solo avanza si los tres checks pasan **y** la matriz ejecutada coincide con la soportada."`
- **Evidence:** The conjunction `y` is bolded for emphasis. This is unusual in Spanish technical prose; bold is normally reserved for keywords or definitions. The emphasis is also redundant because the sentence structure already makes the conjunction prominent.
- **Pedagogical impact:** Minor typographic noise; visual emphasis on a function word.
- **Severity:** L.

#### S44-ISSUE-13 — Eight I-Do `description:` fields lack terminal punctuation [L]
- **Location:** Lines 368, 394, 418, 443, 464, 497, 522, 543 — all eight `description:` fields under `iDo.steps[*]`.
- **Evidence (verbatim):** All eight follow the pattern `"Demo: <topic>"` without terminal period:
  - L368: `"Demo: lint/types/tests y matrices"`
  - L394: `"Demo: caches, artifacts y condiciones"`
  - L418: `"Demo: permisos mínimos, pinning y secret scanning"`
  - L443: `"Demo: SBOM, provenance y attestations"`
  - L464: `"Demo: environments y approvals"`
  - L497: `"Demo: migrations, canary/blue-green y rollback"`
  - L522: `"Demo: branch/review policy y release notes"`
  - L543: `"Demo: failure handling y evidencia auditable"`
- **Pedagogical impact:** Minor — these are short labels and the omission is defensible, but inconsistent with the rest of the section which uses periods. The 47 `missing_terminal` findings from the heuristic include these 8 plus 9 headings (defensible) plus 11 `note` fields (mostly defensible resource labels) plus 8 `text` (learningOutcomes, defensible as bulleted items) plus 6 `criterion` (defensible) plus 1 `question` (likely a real omission worth checking) plus 1 `tagline` (defensible).
- **Severity:** L.

#### S44-ISSUE-14 — Eight long instruction fields with embedded code identifiers (WPS ≥ 35) [M]
- **Location & evidence:**
  - L1608 (S44-T4-A-E3, WPS=42, FH=52.6): `"S44-T4-A-E3 · Aísla fallo cerrado para \`branch/review policy y release notes\` con tres fixtures distintos. \`CASO-PIU-044-4A\` debe continuar, el adverso debe devolver \`BLOCK_UNREVIEWED_RELEASE\` y la ausencia de \`release_notes\` debe devolver \`COMPLETE_RELEASE_NOTES\`."`
  - L800 (S44-T1-B-E3, WPS=41, FH=62.6): `"S44-T1-B-E3 · Extiende fallo cerrado para \`caches, artifacts y condiciones\` con tres fixtures distintos. …"` (same template)
  - L1750 (S44-T4-B-E3, WPS=41, FH=58.2): same template.
  - L1466 (S44-T3-B-E3, WPS=40, FH=59.5): same template.
  - L658 (S44-T1-A-E3, WPS=39, FH=70.1): same template.
  - L1182 (S44-T2-B-E3, WPS=38, FH=51.2): same template.
  - L1324 (S44-T3-A-E3, WPS=38, FH=54.4): same template.
  - L913 (S44-T2-A-E2, WPS=35, FH=68.3): different template (`"Clasifica tres rutas de endurecimiento: fixture con pin SHA completo y least privilege (\`PASS\`), adverso con write/\`@v4\`/secret hit (\`REVOKE_AND_ROTATE\`), y registro sin \`dependency_review\` (\`MISSING:dependency_review\`)."`)
- **Metric:** Median WPS for the whole section is **17**; these instructions are 2-3× longer than the section median.
- **Pattern:** The 7 E3-transfer instructions share an identical template: `"S44-{SUBTOPIC}-E3 · {VERBO} fallo cerrado para \`{TOPIC}\` con tres fixtures distintos. \`CASO-PIU-044-{X}\` debe continuar, el adverso debe devolver \`{BREACH_CODE}\` y la ausencia de \`{FIELD}\` debe devolver \`{UNCERTAINTY_CODE}\`."` — the template is structurally overloaded. Splitting at the first period would help.
- **Pedagogical impact:** Cognitive-load spike. Learners must parse a section-step code, a verb, a topic phrase, a case_id, three backticked code identifiers, and three boolean clauses all in one sentence. Should be split into 2-3 sentences: setup → expected outputs per fixture.
- **Severity:** M.

#### S44-ISSUE-15 — Two `COMMA_PARENTHESIS_WHITESPACE` typography issues in T2-A-E1 hint [L]
- **Location:** L854 (S44-T2-A-E1 hint): `"Valida permisos ⊆ {read,none}, \`action_ref\` con SHA de 40 hex tras \`@\`, secret_hits==0 y dependency_review."`
- **Evidence:** `{read,none}` packs the set notation without spaces after the comma. LanguageTool rule `COMMA_PARENTHESIS_WHITESPACE` fired. Spanish typography prescribes a space after every comma, even inside braces.
- **Pedagogical impact:** Minor typographic defect.
- **Severity:** L.

#### S44-ISSUE-16 — Missing comma before `pero` (T1-B paragraph 1) [L]
- **Location:** L105 (theory T1-B paragraph 1): `"La **cache** acelera installs (pip/npm) pero **no es fuente de verdad**: un cache hit no prueba que el build sea reproducible."`
- **Evidence:** Two clauses with different subjects (`cache acelera` vs. `no es fuente de verdad`); contrastive `pero` requires preceding comma per RAE. LanguageTool did not fire here (the bold markup may have confused it), but the rule still applies.
- **Pedagogical impact:** Minor punctuation defect.
- **Severity:** L.

#### S44-ISSUE-17 — Inconsistent spelling: `"cache"` (no accent) used throughout [L]
- **Location:** Throughout (L18, L102, L105, L106, L113, L394, L412, L711, L715, L717, L723, L751, L753, L800, L804, L806, …).
- **Evidence:** The section consistently uses `"cache"` (no accent, English loanword) for both the noun (`la cache`) and the adjective/noun-modifier (`cache miss`, `cache key`, `cache hit`). Fundéu recommends `"caché"` (with accent, masculine or feminine) as the adapted form for computing.
- **Pedagogical impact:** Stylistic inconsistency with formal Spanish guidance; LatAm tech community uses both forms. The section is internally consistent, so this is a low-priority stylistic note, not a defect.
- **Severity:** L.

#### S44-ISSUE-18 — Anglicism density in theory paragraphs (unformatted tech nouns) [M]
- **Location:** All 8 theory paragraphs (lines 30–357) and most `instruction` fields.
- **Evidence (representative, L65 — theory T1-A ¶1):**
  > `"Un pipeline de supply chain no empieza publicando: empieza **certificando el código**. CI ejecuta checks **rápidos antes de costosos** (lint → types → tests) para fallar barato. La **matriz** solo cubre runtimes/OS que el equipo realmente soporta (p. ej. Python 3.11 y 3.12), no una combinatoria infinita que gasta minutos y oculta la señal. Un test verde sin logs ni artifact no es gate: es un semáforo sin evidencia. El dict del lab mapea claves de un workflow real (\`on\`, \`permissions\`, \`matrix\`, \`steps\`)."`
- **Inline (un-backticked) anglicisms in this single paragraph:** `pipeline`, `supply chain`, `CI`, `checks`, `runtimes`, `OS`, `logs`, `artifact`, `gate`, `workflow`. The article is also calqued (`el workflow`, `el gate`).
- **Other representative lines:**
  - L15 (jobRelevance): `deploy`, `release`, `pipeline`, `digest`, `SBOM`, `provenance`, `attestation`, `canary`, `rollback`, `lead`, `ops`, `registry`.
  - L105: `cache`, `installs`, `pip/npm`, `cache hit`, `build`, `artifact`, `wheel`, `logs`, `workflow`, `branch/tag/fork`, `release`, `tag`, `prod`, `gates`.
  - L145: `token`, `workflow`, `write`, `permissions`, `jobs`, `actions`, `SHA`, `commit`, `tag`, `stub`, `Secret scanning`, `diff`, `logs`, `YAML`, `GitHub Actions`, `stdlib`.
  - L200: `SBOM`, `provenance`, `attestation`, `subject digest`, `build`, `binario`.
  - L233: `environments`, `dev`, `staging`, `prod`, `rebuild`, `digest`, `tests`, `staging`, `PR`, `promote`, `anti-patrón`, `supply chain`, `provenance`.
- **Pedagogical impact:** (a) Forces Spanish-speaking learners to mentally translate every sentence; (b) breaks consistency with the section's own callouts and code blocks (which use backticks correctly); (c) makes the prose read like translated-from-English text rather than Peruvian-Spanish technical writing. Pattern matches S37.
- **Severity:** M.

#### S44-ISSUE-19 — Self-check question 3 contains an English-dominant option [L]
- **Location:** L1918 (self-check Q3 option): `"se usó la herramienta más nueva"`
- **Evidence:** This option is fine in Spanish. The option set as a whole is consistent. (No defect; logged only because the heuristic flagged the question field for `missing_terminal`.)
- **Severity:** L (informational; no fix required).

#### S44-ISSUE-20 — `lang="es-PE"` on the live HTML but no Peruvian-Spanish localisms [L]
- **Location:** Live HTML root: `<html lang="es-PE">`. Section content throughout.
- **Evidence:** The live site declares Peruvian Spanish, but the section uses no Peruvian localisms — it's neutral LatAm tech-Spanish. The case study is set in Piura (`CASO-PIU-044`), which is a Peruvian touch, but no vocabulary (e.g., `pata`, `chamba`, `causa`, `pisco`) appears. This is defensible (neutral Spanish is preferred for tech writing) but worth noting: the `es-PE` declaration is purely declarative.
- **Pedagogical impact:** None; logged for completeness.
- **Severity:** L (informational).

---

## 4. Meta-Leak Report (exact leaked text + location)

| # | Location | Leaked text | Impact |
|---|---|---|---|
| ML-1 | `src/lib/course/sections/s44-multimodal.ts:1-4` | File name `s44-multimodal.ts` + `id: "multimodal"` | Source-archaeology leak; URL/state leak if `id` is exposed. |
| ML-2 | `src/components/course/PdfReport.tsx:84` | `multimodal: '44. Multi-Modal',` | Wrong section title in PDF progress report. |
| ML-3 | `src/components/course/SectionView.tsx:3333-3402` | `'multimodal': { title: 'Practica CLIP y Whisper (simulado)', code: '…CLIP/Whisper demo…' }` | **Wrong interactive demo rendered in theory tab of section 44.** Learners see a multimodal-AI playground in a CI/CD supply-chain section. |
| ML-4 | `learning_roadmap.md:77, 4059-4088` | Original V1/V2 roadmap says "44. Multimodal AI" (CLIP, Whisper, multimodal RAG) | Proves the section was re-purposed; current `learning_roadmap_52_V3.md:606` says "CI/CD y seguridad de la cadena de suministro". |
| ML-5 | `s44-multimodal.ts:58` | `"Nota de orientación: S44-T1-A: caso sintético con asserts locales; si falta, no promociones."` | Authorial meta-language ("Nota de orientación") leaked into learner-facing callout. |
| ML-6 | `s44-multimodal.ts:193, 226, 326` | `"Contrato S44-T2-B: fixture S44-T2-B; si falta evidencia, no promociones."` / `"Para S44-T3-A: fixture S44-T3-A; si falta evidencia, no promociones."` / `"Cierre de S44-T4-B: documenta residual risk y límites del lab stdlib."` | Authorial milestone markers (`Contrato`, `Cierre de`) and circular self-references (`Contrato S44-T2-B: fixture S44-T2-B`) leaked into callouts. |
| ML-7 | `s44-multimodal.ts:326` | `"residual risk"` | English calque leaked into Spanish callout (rubric uses `riesgo residual`). |
| ML-8 | `s44-multimodal.ts:28, 563, 1802` | `"Ruta de S44: CI/CD y seguridad de la cadena de suministro"` / `"S44 · Laboratorio de pipeline CI/CD con supply-chain gates: …"` | Internal section code `S44` in learner-facing headings/intros (mild meta-leak; arguably intentional for course navigation). |

No `TODO`, `FIXME`, `XXX`, `moved from section X`, or `placeholder` strings were found in the section source (verified by `grep`).

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 Pedagogical structure (I Do / We Do / You Do / Self-check fidelity)

**Strengths.**
- The 4-topic × 2-demo I-Do structure (T1-T4, 8 demos) covers the supply-chain lifecycle end-to-end (CI gates → security hardening → CD promotion → governance/failure handling). The order is logically staged: certify → harden → promote → govern.
- The 4-topic × 3-exercise We-Do triplet (E1 guided → E2 independent → E3 transfer) is consistent across all 4 topics. The decreasing-scaffolding pattern is exemplary: E1 fixes a defect with full hints, E2 enumerates 3 cases (valid/adverso/missing) and demands the missing-field branch, E3 demands the fail-closed decision with both uncertainty and breach paths. This is the best-in-class We-Do pattern in the course.
- The You-Do portfolio context (`youDo.context`, L1803) clearly states the input contract (`commit revisado, dependencias fijadas, workflow con permisos mínimos`) and output contract (`artefacto identificado por digest, SBOM, provenance, evidencia de promoción o rollback`), plus the fail-closed gate (`test crítico rojo, secreto en logs, dependencia insegura sin pin, attestation ausente`).
- The `portfolioNote` (L1892) explicitly warns against faking the BLOCKED→READY transition by toggling asserts — a thoughtful pedagogical guardrail.
- The rubric (L1893-1900) is concrete and operable: 6 criteria with explicit weights summing to 100%, including `Correctitud del contrato y gate (25%)`, `Pruebas normal/breach/uncertain (20%)`, `Seguridad/privacidad/least privilege (15%)`, `Reproducibilidad/lineage/evidencia (15%)`, `Operación/SLO/observabilidad/rollback (15%)`, `Comunicación de trade-offs (10%)`.
- The Self-check (5 questions, L1903-1934) tests the right concepts: SHA pinning, fail-closed philosophy, gate definition, synthetic-data discipline, digest alignment.

**Weaknesses.**
- **The interactive-demo bug (S44-ISSUE-03) breaks the I-Do contract** for the theory tab: learners see an unrelated CLIP/Whisper demo instead of any CI/CD demo. This is the single biggest pedagogical defect.
- The 8 theory callouts are mostly low-signal (S44-ISSUE-05): they restate the section code instead of giving a concept anchor. Compare with S01-S05 where callouts say things like "Las firmas digitales garantizan integridad y no repudio" — a memorable one-line definition.
- The 8 I-Do `description:` fields all follow the same template `"Demo: <topic>"` (S44-ISSUE-13) — they don't tell the learner *what* the demo proves. The `why:` field carries the value; the description is just a label.
- The 7 E3-transfer instructions share an identical 40-word template (S44-ISSUE-14). The template is structurally overloaded and offers no variety in surface form — learners reading all 7 in sequence experience anaphoric monotony.

### 5.2 Connective tissue and narrative flow

**Strengths.**
- `theory[0].paragraphs[1]` (L31) explicitly bridges: `"Esta sección lleva el servicio contenedorizado de S43 a una cadena de suministro verificable"` — backward bridge to S43.
- `theory[0].paragraphs[1]` continues: `"Lo que sigue en S45 (cloud/colas) asume que ya sabes no promover un digest huérfano de evidencia."` — forward bridge to S45.
- `theory[0].paragraphs[3]` (L33) lays out the learning order: `"Orden de aprendizaje: T1 matrices de check → T2 permisos/secretos y SBOM → T3 environments/canary/rollback → T4 branch protection y fallos auditables."` — explicit cognitive scaffolding.
- `theory[0].paragraphs[3]` ends with the didactic-stack note: `"Stack didáctico: stdlib modelando la superficie real de GHA/SLSA sin pedir cuenta de registry."` — sets expectations.

**Weaknesses.**
- The bridges are good but concentrated in `theory[0]`; subsequent theory blocks (T1-B through T4-B) don't re-anchor to the broader curriculum. A learner who skips `theory[0]` loses the connective tissue.
- The `weDo.intro` (L563) introduces the lab with `S44 · Laboratorio de pipeline CI/CD con supply-chain gates: 24 retos (E1 repara, E2 clasifica valid/invalid/missing, E3 decide fail-closed).` — clear, but doesn't bridge to the I-Do demos that preceded it.

### 5.3 Cognitive load and progressive disclosure

**Strengths.**
- Median WPS = 17 (very easy); median FH = 81.8 ("bastante fácil" per Fernández-Huerta bands); median INFLESZ = 78.2. These are healthy scores for a Master-level technical section.
- Median SPW = 1.8 (low lexical complexity) — short, technical words dominate; the section doesn't pile up long Spanish words.
- Code blocks are short and single-purpose (each demo is 5-15 lines of Python with stdlib only).
- The 4-topic split reduces per-topic cognitive load: each topic has 2 paragraphs of theory + 1 code block + 1 callout + 1 I-Do demo + 3 We-Do exercises.

**Weaknesses.**
- The 7 E3-transfer instructions (WPS 38-42) are 2-3× longer than the median and pack 3-4 backticked identifiers + 3 boolean clauses into a single sentence (S44-ISSUE-14).
- The anglicism density (S44-ISSUE-18) adds implicit translation load.

### 5.4 Exercise and exam quality and alignment

**Strengths.**
- All 24 We-Do exercises use the same synthetic case (`CASO-PIU-044-{1A,1B,2A,2B,3A,3B,4A,4B}`) — no PII, no real secrets, no registry required. The discipline is exemplary.
- Every starter code has a clearly-marked defect (`# DEFECT: …`) and every solution has an `assert` that pins the expected behavior — reproducible testing.
- The 3-case pattern (valid → adverso → missing) is consistent across all 8 sub-topics' E2 and E3 exercises. This is a strong pedagogical pattern: it teaches learners to distinguish `breach` (content fails) from `uncertainty` (schema incomplete), which is the section's central epistemological point.
- The You-Do portfolio (`youDo.starterCode`, L1820-1891) ships a runnable scaffold with `full_sha_pin`, `ci_matrix_ok`, `supply_chain_ok`, `promote_ok`, `canary_ok`, `portfolio_ready`, `gate_case` helpers — a usable starting point.
- The Self-check questions are unambiguous: each has 4 options with one clearly-correct answer and a one-sentence explanation that cites the section's fail-closed philosophy.

**Weaknesses.**
- The 3 broken-template hints (S44-ISSUE-08) are in E1 (guided) exercises — the highest-scaffolding tier where learners need the clearest hint. A broken-grammar hint in the guided tier can confuse a struggling learner.
- The 6 `"mismo digest probado"` article-omission defects (S44-ISSUE-07) are concentrated in T3-A — a learner completing T3-A in sequence will see the defective form 6 times and may internalize it.

### 5.5 Consistency with the overall roadmap and previous sections

- `learning_roadmap_52_V3.md:606-615` lists S44 = "CI/CD y seguridad de la cadena de suministro" with 4 sub-topics matching the section content (T1 CI, T2 Seguridad, T3 CD, T4 Gobierno). **Roadmap V3 contract is met by the content** but **not by the file name / `id` / PdfReport label / interactive demo** — those still say "multimodal".
- The section's bridge to S43 (`theory[0].paragraphs[1]`, L31) is consistent with S43's containerized-service topic.
- The forward bridge to S45 (`theory[0].paragraphs[1]`, L31: `"Lo que sigue en S45 (cloud/colas) asume que ya sabes no promover un digest huérfano"`) matches S45's actual topic (`learning_roadmap_52_V3.md:617-626`: Cloud, almacenamiento, colas e infraestructura).
- The competency code `CP-N4-B` (cited in `jobRelevance` L15, `portfolioNote` L1892, `selfCheck` L1917, `theory[7]` L333) matches the roadmap's CP-N4-B = "cadena de suministro verificable" (`learning_roadmap_52_V3.md:60-110`).
- The estimatedHours (20), level (Master), phase (3), icon (GitBranch) all match the roadmap's Master-phase pattern.

### 5.6 Comparison with best-in-class external materials on the same topics

| Resource | Strength S44 should learn from |
|---|---|
| GitHub Docs: Security hardening for GitHub Actions | Concrete YAML examples with inline rationale; S44 has the YAML-string-in-Python workaround but doesn't show a real `.github/workflows/*.yml` file. |
| SLSA.dev spec | Clear separation of *levels* (L1-L4); S44 mentions SLSA but doesn't expose the level taxonomy. |
| Sigstore / cosign docs | Real signing commands; S44 only simulates. Defensible for a stdlib-only lab, but a "real tooling pointer" callout would help. |
| Google SRE Book: Release Engineering | Canary + rollback + SLO language; S44 aligns well here. |
| NIST SSDF | Practices taxonomy (PS, PW, RV); S44 mentions NIST SSDF in resources but doesn't map its gates to SSDF practices. |
| Accelerate (Forsgren) | DORA metrics (deployment frequency, lead time, MTTR, change failure rate); S44 doesn't connect its gates to DORA outcomes — a missed opportunity for a Master-level section. |

**Net comparison:** S44 is pedagogically stronger than typical CI/CD tutorials (which often show only happy-path YAML) because of its fail-closed philosophy and breach/uncertainty distinction. But it's weaker than SLSA/NIST references on taxonomy and weaker than Accelerate on outcome metrics. A "Mapeo a SLSA levels + DORA metrics" callout in `theory[0]` or `theory[7]` would close the gap.

---

## 6. Grammatical improvements and rewriting report — paragraph by paragraph, tab by tab

This section goes tab-by-tab and paragraph-by-paragraph through the learner-facing Spanish prose. For each unit I report **Before** (verbatim) → **After** (proposed rewrite) → **Rationale**. Only units with a real or stylistic defect are rewritten; clean units are skipped to keep the section focused.

### 6.1 Theory tab — `theory[0]` (Ruta de S44)

**Paragraph 0 — `callout.content` (L58)**

> Before: `"Nota de orientación: S44-T1-A: caso sintético con asserts locales; si falta, no promociones."`
> After: `"Caso sintético S44-T1-A: si los asserts locales fallan o faltan, no promociones el artefacto."`
> Rationale: Drop the editorial meta-language `Nota de orientación:`. Replace the double colon with a single one. Make `no promociones` transitive (`no promociones el artefacto`) so the learner knows *what* not to promote. (S44-ISSUE-05, S44-ISSUE-11.)

### 6.2 Theory tab — `theory[1]` (lint/types/tests y matrices) — paragraph 3 (L67)

> Before: `"En \`CASO-PIU-044-1A\` el repo de ops de Piura declara matriz \`{'3.11','3.12'}\` y steps \`lint/typecheck/test\`. El PR solo avanza si los tres checks pasan **y** la matriz ejecutada coincide con la soportada. Si falta \`supported\`, no se asume "todo OK": se deriva a revisión de matriz. Sin secretos reales ni PII; la evidencia son logs retenidos del job."`
> After: `"En \`CASO-PIU-044-1A\` el repo de ops de Piura declara la matriz \`{'3.11','3.12'}\` y los pasos \`lint/typecheck/test\`. El PR solo avanza si los tres checks pasan y la matriz ejecutada coincide con la soportada. Si falta \`supported\`, no se asume "todo OK": se deriva a revisión de matriz. Sin secretos reales ni PII; la evidencia son los logs retenidos del job."`
> Rationale: (a) Drop the bold on `**y**` (S44-ISSUE-12) — the conjunction doesn't need typographic emphasis. (b) Add articles `la matriz` and `los pasos` for natural Spanish flow (the original reads calqued from English "declares matrix and steps"). (c) `logs retenidos` → `los logs retenidos` for parallel concord with `la evidencia son`. (S44-ISSUE-18 partial.)

### 6.3 Theory tab — `theory[2]` (caches, artifacts y condiciones) — paragraph 1 (L105)

> Before: `"La **cache** acelera installs (pip/npm) pero **no es fuente de verdad**: un cache hit no prueba que el build sea reproducible. El **artifact** (wheel, SBOM, logs) lleva digest y retención porque es la evidencia que otro job o auditor puede re-descargar. Las **condiciones** del workflow (\`if:\`, filtros de branch/tag/fork) deben cubrir los caminos de release; un tag de prod sin los mismos gates que \`main\` es un atajo peligroso."`
> After: `"La **caché** acelera las instalaciones (pip/npm), pero **no es fuente de verdad**: un \`cache hit\` no prueba que el build sea reproducible. El **artifact** (wheel, SBOM, logs) lleva digest y retención porque es la evidencia que otro job o auditor puede re-descargar. Las **condiciones** del workflow (\`if:\`, filtros de branch/tag/fork) deben cubrir los caminos de release; un tag de prod sin los mismos gates que \`main\` es un atajo peligroso."`
> Rationale: (a) `cache` → `caché` (Fundéu recommendation; S44-ISSUE-17 — applies to whole section, not just this paragraph). (b) `installs` → `las instalaciones` (avoid English calque). (c) Add comma before `pero` (S44-ISSUE-16). (d) Backtick `cache hit` to mark it as a code-adjacent term rather than Spanish prose. The rest of the paragraph is fine.

### 6.4 Theory tab — `theory[3]` (permisos mínimos, pinning y secret scanning) — paragraph 3 (L147)

> Before: `"En \`CASO-PIU-044-2A\` el workflow de Piura usa \`contents: read\` y \`actions/checkout@\` + SHA de 40 hex (p. ej. \`b4ffde65…\`). Si un job de release necesita write, se declara solo en ese job — no a nivel de workflow. Un tag \`@v4\` o un stub corto no cuenta como pin. Un \`secret_hits > 0\` obliga a rotar credenciales antes de reintentar el pipeline; no se "limpia el log" a mano para pasar el scan."`
> After: `"En \`CASO-PIU-044-2A\` el workflow de Piura usa \`contents: read\` y \`actions/checkout@\` + SHA de 40 hex (p. ej. \`b4ffde65…\`). Si un job de release necesita \`write\`, se declara solo en ese job — no a nivel de workflow. Un tag \`@v4\` o un stub corto no cuenta como pin. Un \`secret_hits > 0\` obliga a rotar credenciales antes de reintentar el pipeline; no se "limpia el log" a mano para pasar el scan."`
> Rationale: Backtick `write` (it's a literal GHA permission value, not Spanish prose). Otherwise the paragraph is grammatically clean.

### 6.5 Theory tab — `theory[4]` (SBOM, provenance y attestations) — paragraph 1 (L200)

> Before: `"El **SBOM** (SPDX/CycloneDX) enumera componentes y versiones del artefacto. La **provenance** (estilo SLSA) enlaza fuente → build → subject digest: quién construyó qué, con qué inputs. Una **attestation** firmada permite verificar esa cadena; no "garantiza calidad" por sí sola, pero sí impide promover un binario huérfano de evidencia. Publicar sin attestation o con SBOM de otro build rompe la cadena de suministro."`
> After: `"El **SBOM** (SPDX/CycloneDX) enumera componentes y versiones del artefacto. La **provenance** (estilo SLSA) enlaza fuente → build → subject digest: quién construyó qué y con qué inputs. Una **attestation** firmada permite verificar esa cadena; no "garantiza calidad" por sí sola, pero sí impide promover un binario huérfano de evidencia. Publicar sin attestation o con SBOM de otro build rompe la cadena de suministro."`
> Rationale: Add `y` between `qué` and `con qué inputs` for natural Spanish rhythm (`quién construyó qué, con qué inputs` reads as English "who built what, with what inputs" — the comma splice is awkward in Spanish). Otherwise the paragraph is clean.

### 6.6 Theory tab — `theory[5]` (environments y approvals) — paragraph 1 (L233)

> Before: `"Los **environments** (dev → staging → prod) separan secretos, políticas y aprobadores. Producción no se alimenta de un rebuild improvisado: se mueve el **mismo digest** que pasó tests en staging. La **aprobación** es independiente del autor del PR; sin \`approved_by\` no hay promote. Rebuild al promover es el anti-patrón clásico de supply chain: lo que se testeó deja de ser lo desplegado y la provenance queda huérfana."`
> After: `"Los **environments** (dev → staging → prod) separan secretos, políticas y aprobadores. Producción no se alimenta de un rebuild improvisado: se mueve el **mismo digest** que pasó los tests en staging. La **aprobación** es independiente del autor del PR; sin \`approved_by\` no hay promote. Rebuild al promover es el anti-patrón clásico de supply chain: lo que se testeó deja de ser lo desplegado y la provenance queda huérfana."`
> Rationale: `pasó tests` → `pasó los tests` (article required in formal Spanish for countable nouns in object position). Otherwise clean.

### 6.7 Theory tab — `theory[6]` (migrations, canary/blue-green y rollback) — paragraph 1 (L269)

> Before: `"Antes de enviar tráfico, las **migraciones** deben ser compatibles (expand-first / no breaking). El **canary** envía un porcentaje de tráfico (p. ej. 10%) y mide tasa de error contra un umbral. Si el canary está sano, se puede ampliar; si supera el umbral, se hace **rollback** al digest previo. Rollback no es "intentar de nuevo": es restaurar código/config (y datos si aplica) **dentro del RTO** y dejar evidencia del tiempo de reversión."`
> After: `"Antes de enviar tráfico, las **migraciones** deben ser compatibles (expand-first / no breaking). El **canary** envía un porcentaje de tráfico (p. ej. 10%) y mide la tasa de error contra un umbral. Si el canary está sano, se puede ampliar; si supera el umbral, se hace **rollback** al digest previo. El rollback no es "intentar de nuevo": es restaurar código/config (y datos si aplica) **dentro del RTO** y dejar evidencia del tiempo de reversión."`
> Rationale: (a) `mide tasa de error` → `mide la tasa de error` (article required). (b) `Rollback no es` → `El rollback no es` (article required at sentence start for a countable noun used generically). Otherwise clean.

### 6.8 Theory tab — `theory[7]` (branch/review policy y release notes) — paragraph 1 (L301)

> Before: `"La **branch protection** de \`main\` exige reviews y checks verdes antes del merge: es el primer control humano+automatizado de la cadena de suministro (antes incluso del publish). Las **release notes** no son marketing; son un contrato operativo para quien despliega de madrugada: qué cambió, riesgo residual, pasos de migración y cómo revertir. Un tag de release sin notes completas deja al on-call sin mapa y convierte el rollback en improvisación."`
> After: `"La **branch protection** de \`main\` exige reviews y checks verdes antes del merge: es el primer control humano y automatizado de la cadena de suministro (antes incluso del publish). Las **release notes** no son marketing; son un contrato operativo para quien despliega de madrugada: qué cambió, riesgo residual, pasos de migración y cómo revertir. Un tag de release sin notes completas deja al on-call sin mapa y convierte el rollback en improvisación."`
> Rationale: `humano+automatizado` → `humano y automatizado` — the `+` is a code/shorthand symbol; in Spanish prose, `y` is preferred. Otherwise clean.

### 6.9 Theory tab — `theory[8]` (failure handling) — paragraph 1 (L333)

> Before: `"Cuando un check crítico falla, el pipeline **bloquea** el release: no usa \`continue-on-error\` como aprobación silenciosa ni "amarillo que se ignora". La evidencia se conserva: logs **redactados** (sin secretos ni tokens), artifact del job, clasificación del fallo, **dueño** del incidente y decisión registrada. Un fallo sin dueño ni evidencia es un incidente que se olvida hasta el siguiente outage — y rompe la promesa de CP-N4-B."`
> After: (no rewrite required — paragraph is grammatically clean; the `—` em-dash usage is correct, the colon usage is correct, and the bold markup is appropriate for keyword emphasis). Note: the only flag is `"amarillo que se ignora"` (a metaphor that may be opaque to non-Spanish-natives), but it's a defensible pedagogical choice.

### 6.10 I Do tab — `iDo.intro` (L362)

> Before: `"Ocho demos locales de CI/CD y cadena de suministro: cómo un pipeline decide certificar, firmar evidencia, promover el mismo digest y revertir un canary — sin registry remoto."`
> After: (no rewrite required — clean, well-paced, 28 words, FH=73.3).

### 6.11 I Do tab — 8 × `description:` fields (L368, 394, 418, 443, 464, 497, 522, 543)

> Before: `"Demo: lint/types/tests y matrices"` (and 7 analogues)
> After: `"Demo: lint/types/tests y matrices."` (add terminal period for consistency with the rest of the section)
> Rationale: S44-ISSUE-13 — minor consistency fix. The 8 `why:` fields already end with periods.

### 6.12 We Do tab — `weDo.intro` (L563)

> Before: `"S44 · Laboratorio de pipeline CI/CD con supply-chain gates: 24 retos (E1 repara, E2 clasifica valid/invalid/missing, E3 decide fail-closed). Ocho case_ids sintéticos de Piura (\`CASO-PIU-044-1A\`…\`4B\`); cada tríada reutiliza el mismo fixture de dominio con predicados invertidos a propósito."`
> After: `"Laboratorio de pipeline CI/CD con supply-chain gates: 24 retos (E1 repara, E2 clasifica valid/invalid/missing, E3 decide fail-closed). Ocho case_ids sintéticos de Piura (\`CASO-PIU-044-1A\`…\`4B\`); cada tríada reutiliza el mismo fixture de dominio con predicados invertidos a propósito."`
> Rationale: Drop the `S44 · ` prefix (it's already in the section title; S44-ISSUE-06). Otherwise clean.

### 6.13 We Do tab — 8 × E1 `hints[1]` broken-template fixes (S44-ISSUE-08)

Three of the eight `hints[1]` fields have the broken `el fixture conserva [CLAUSE]` template. The other five are clean. Here are the three fixes:

**T1-B-E1 hints[1] (L715)**

> Before: `"El predicado correcto debe ser verdadero porque el fixture conserva cache miss conserva resultado y artifact es verificable; revisa dirección de comparación, conjuntos y negaciones."`
> After: `"El predicado correcto debe ser verdadero porque el fixture conserva: un cache miss sigue produciendo resultado correcto, y el artifact es verificable. Revisa dirección de comparación, conjuntos y negaciones."`
> Rationale: Replace the broken `conserva … conserva` chain with a colon-introduced clarification. Split into two sentences.

**T2-B-E1 hints[1] (L1097)**

> Before: `"El predicado correcto debe ser verdadero porque el fixture conserva SBOM y provenance coinciden con digest; revisa dirección de comparación, conjuntos y negaciones."`
> After: `"El predicado correcto debe ser verdadero porque el fixture conserva: SBOM y provenance que coinciden con el digest. Revisa dirección de comparación, conjuntos y negaciones."`
> Rationale: Add `que` to subordinate the verb `coinciden`; add article `el` before `digest`. Split into two sentences.

**T4-B-E1 hints[1] (L1665)**

> Before: `"El predicado correcto debe ser verdadero porque el fixture conserva fallo crítico bloquea y deja evidencia auditable; revisa dirección de comparación, conjuntos y negaciones."`
> After: `"El predicado correcto debe ser verdadero porque el fixture conserva: un fallo crítico bloquea el pipeline y deja evidencia auditable. Revisa dirección de comparación, conjuntos y negaciones."`
> Rationale: Add article `un` before `fallo crítico`; add object `el pipeline` after `bloquea`; split into two sentences.

### 6.14 We Do tab — 6 × T3-A `"mismo digest probado"` article-omission fixes (S44-ISSUE-07)

Six occurrences across T3-A instruction, edgeCases, and hints. Two distinct strings:

**String A (instruction L1235, hints L1275, hints L1328):**

> Before: `"… la operación debe demostrar mismo digest probado y aprobación independiente."` (L1235)
> After: `"… la operación debe demostrar el mismo digest probado y la aprobación independiente."`
> Rationale: Add articles `el` and `la` for formal Spanish.

> Before: `"Después aplica la regla de S44-T3-A: mismo digest probado y aprobación independiente."` (L1275)
> After: `"Después aplica la regla de S44-T3-A: el mismo digest probado y la aprobación independiente."`

> Before: `"Para datos completos reutiliza la regla que demostró mismo digest probado y aprobación independiente; solo ese caso devuelve \`CONTINUE\`."` (L1328)
> After: `"Para datos completos reutiliza la regla que demostró el mismo digest probado y la aprobación independiente; solo ese caso devuelve \`CONTINUE\`."`

**String B (edgeCases L1241, L1277, L1330 — identical):**

> Before: `"fixture adverso: mismo digest probado y aprobación independiente"`
> After: `"fixture adverso: el mismo digest probado y la aprobación independiente"`
> Rationale: Same article-omission fix. Applied to 3 edgeCases entries.

### 6.15 We Do tab — 7 × E3-transfer instruction template (S44-ISSUE-14)

The 7 E3-transfer instructions share the same overloaded 38-42 word template. Here's the proposed restructure (shown for one; the same pattern applies to all 7):

**T4-A-E3 instruction (L1608)**

> Before: `"S44-T4-A-E3 · Aísla fallo cerrado para \`branch/review policy y release notes\` con tres fixtures distintos. \`CASO-PIU-044-4A\` debe continuar, el adverso debe devolver \`BLOCK_UNREVIEWED_RELEASE\` y la ausencia de \`release_notes\` debe devolver \`COMPLETE_RELEASE_NOTES\`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia."`
> After: `"S44-T4-A-E3 · Aísla el fallo cerrado para \`branch/review policy y release notes\` con tres fixtures distintos. (1) \`CASO-PIU-044-4A\` debe devolver \`CONTINUE\`. (2) El fixture adverso debe devolver \`BLOCK_UNREVIEWED_RELEASE\`. (3) La ausencia de \`release_notes\` debe devolver \`COMPLETE_RELEASE_NOTES\`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia."`
> Rationale: Add `el` before `fallo`. Split the 3-case enumeration into a numbered list (the SPA renderer supports Markdown lists inside `instruction`). Each case becomes a short, scannable clause. The closing sentence about the starter defect is preserved.

### 6.16 You Do tab — `youDo.context` (L1803)

> Before: `"Pipeline CI/CD con supply-chain gates. Trabaja sobre un repositorio ficticio de servicio de operaciones en Piura. Entrada: commit revisado, dependencias fijadas y workflow con permisos mínimos. Salida: artefacto identificado por digest, SBOM, provenance y evidencia de promoción o rollback. El gate bloquea la publicación si hay test crítico rojo, secreto en logs, dependencia insegura sin pin o attestation ausente."`
> After: (no rewrite required — clean, well-segmented into 5 short sentences, FH=70-114 across the 5 sentences).

### 6.17 You Do tab — `portfolioNote` (L1892)

> Before: `"Evidencia de CP-N4-B · cadena de suministro verificable: muestra baseline, decisión, pruebas, resultado medido, rollback y riesgo residual. El checklist inicia en BLOCKED por diseño; conviértelo en READY enlazando artefactos reales (workflow con pin SHA, SBOM/provenance, log de canary/rollback), no cambiando asserts a True sin archivo."`
> After: (no rewrite required — clean, pedagogically rich, includes the anti-faking guardrail).

### 6.18 Self-check tab — 5 questions (L1903-1934)

**Q4 explanation (L1926)**

> Before: `"El lab es sintético a propósito: practicas gates (pin, SBOM, aprobación, rollback) sin PII ni secretos reales; omitir evidencia de supply chain no aprueba el gate."`
> After: `"El laboratorio es sintético a propósito: practicas los controles (pin, SBOM, aprobación, rollback) sin PII ni secretos reales; omitir evidencia de supply chain no aprueba el gate."`
> Rationale: (a) `lab` → `laboratorio` (avoid English calque; S44-ISSUE-10). (b) `gates` → `los controles` (translate; `gates` is used elsewhere in the section but `controles` is the natural Spanish equivalent and avoids stacking two English nouns in one clause). (c) Keep `practicas` as tú-verb (acceptable register for a Self-check hint) but optionally `practicas` → `practiques` (subjunctive after the implied "para que") — minor stylistic option.

**Q1-Q3, Q5 explanations** — clean, no rewrite required.

### 6.19 Resources tab — `resources.docs[*]`, `books[*]`, `courses[*]`

All 16 doc/book/course entries use `label` + `note` pairs. The `note` fields are short Spanish phrases (e.g., `"Permisos, pinning y secrets"`, `"Approvals y environments"`, `"Review + checks obligatorios"`, `"Provenance y niveles de integridad"`, `"SBOM estándar"`). These are clean and consistent. No rewrite required.

---

## 7. Proposed GitHub-style Diffs (one per issue or logical group)

### Diff 1 — S44-ISSUE-01, S44-ISSUE-02, S44-ISSUE-03: rename file, `id`, PdfReport label, and replace interactive demo

This is the highest-priority fix. Three coordinated edits + one new file. (Renaming the file would also require updating `src/lib/course/index.ts:48`, but that's a one-line change.)

```diff
--- a/src/lib/course/sections/s44-multimodal.ts
+++ b/src/lib/course/sections/s44-cicd-supply-chain.ts   (RENAMED)
@@ -1,6 +1,6 @@
 import type { CourseSection } from '../../types'

 export const section44: CourseSection = {
-  id: "multimodal",
+  id: "cicd-supply-chain",
   index: 44,
   title: "CI/CD y seguridad de la cadena de suministro",
   shortTitle: "CI/CD supply chain",
```

```diff
--- a/src/lib/course/index.ts
+++ b/src/lib/course/index.ts
@@ -45,7 +45,7 @@
 import { section42 } from './sections/s42-graph-rag'
 import { section43 } from './sections/s43-llmops'
-import { section44 } from './sections/s44-multimodal'
+import { section44 } from './sections/s44-cicd-supply-chain'
 import { section45 } from './sections/s45-iac'
```

```diff
--- a/src/components/course/PdfReport.tsx
+++ b/src/components/course/PdfReport.tsx
@@ -81,7 +81,7 @@
   "graph-rag": '42. GraphRAG',
   llmops: '43. LLMOps',
-  multimodal: '44. Multi-Modal',
+  "cicd-supply-chain": '44. CI/CD',
   iac: '45. IaC',
   "gpu-computing": '46. GPU',
```

```diff
--- a/src/components/course/SectionView.tsx
+++ b/src/components/course/SectionView.tsx
@@ -3330,69 +3330,52 @@
-    'multimodal': {
-      title: 'Practica CLIP y Whisper (simulado)',
-      code: `# Simulacion de conceptos multi-modales
-# Sin transformers - simulamos con conceptos
-
-# Simular CLIP: alinear texto e imagen en espacio vectorial
-def text_embedding(text):
-    """Simula embedding de texto (CLIP)."""
-    words = text.lower().split()
-    # Hash simple como embedding simulado
-    return [len(w) / 10 for w in words]
-
-def cosine_sim(a, b):
-    """Similitud coseno entre dos vectores."""
-    dot = sum(x*y for x, y in zip(a, b))
-    norm_a = sum(x**2 for x in a)**0.5
-    norm_b = sum(y**2 for y in b)**0.5
-    return dot / (norm_a * norm_b) if norm_a and norm_b else 0
-
-# Buscar imagen por texto (zero-shot)
-texts = ["un gato", "un perro", "un auto"]
-# Simular embeddings de imagenes (pre-calculados)
-images = {
-    "img1.jpg": [0.5, 0.3, 0.4],  # similar a "un gato"
-    "img2.jpg": [0.4, 0.5, 0.3],  # similar a "un perro"
-    "img3.jpg": [0.3, 0.3, 0.9],  # similar a "un auto"
-}
-
-print("=== CLIP: Buscar imagen por texto ===")
-query = "un gato"
-query_emb = text_embedding(query)
-print(f"Query: '{query}' -> embedding: {query_emb}")
-
-for img_name, img_emb in images.items():
-    # Padding para igualar longitud
-    max_len = max(len(query_emb), len(img_emb))
-    q = query_emb + [0] * (max_len - len(query_emb))
-    i = img_emb + [0] * (max_len - len(img_emb))
-    sim = cosine_sim(q, i)
-    print(f"  {img_name}: similitud={sim:.2f}")
-
-# Simular Whisper: transcripcion
-print(f"\\n=== Whisper: Transcripcion (simulada) ===")
-audio_segments = [
-    {"start": 0.0, "end": 2.5, "text": "Hola, bienvenidos al curso"},
-    {"start": 2.5, "end": 5.0, "text": "de Python para Data Science"},
-    {"start": 5.0, "end": 7.5, "text": "vamos a aprender mucho"},
-]
-
-print("Transcripcion con timestamps:")
-for seg in audio_segments:
-    print(f"  [{seg['start']:.1f}s - {seg['end']:.1f}s] {seg['text']}")
-
-full_text = " ".join(seg["text"] for seg in audio_segments)
-print(f"\\nTexto completo: '{full_text}'`,
-      expectedOutput: `=== CLIP: Buscar imagen por texto ===
-Query: 'un gato' -> embedding: [0.2, 0.4]
-  img1.jpg: similitud=0.70
-  img2.jpg: similitud=0.89
-  img3.jpg: similitud=0.40
-
-=== Whisper: Transcripcion (simulada) ===
-Transcripcion con timestamps:
-  [0.0s - 2.5s] Hola, bienvenidos al curso
-  [2.5s - 5.0s] de Python para Data Science
-  [5.0s - 7.5s] vamos a aprender mucho
-
-Texto completo: 'Hola, bienvenidos al curso de Python para Data Science vamos a aprender mucho'`,
-      hint: 'Cambia el query a "un auto" y observa cual imagen tiene mayor similitud',
+    'cicd-supply-chain': {
+      title: 'Practica un gate de CI/CD (simulado)',
+      code: `# Simulacion de un gate de CI/CD con supply-chain
+# Sin GitHub Actions real - simulamos con stdlib
+
+# Simular gates: lint/types/tests + matriz soportada
+def ci_matrix_ok(results, matrix, supported):
+    """Todos los checks en AND y matriz igual a la soportada."""
+    checks = all(results.get(k) for k in ("lint", "types", "tests"))
+    return checks and matrix == supported
+
+# Simular pin por SHA completo (40 hex)
+def is_full_sha_pin(action_ref):
+    ref = action_ref.split("@")[-1] if "@" in action_ref else ""
+    return len(ref) == 40 and all(c in "0123456789abcdef" for c in ref.lower())
+
+# Simular provenance: artifact, SBOM y subject comparten digest
+def provenance_ok(digest, sbom_digest, subject):
+    return bool(digest) and len({digest, sbom_digest, subject}) == 1
+
+print("=== CI matrix ===")
+print("ok", ci_matrix_ok(
+    {"lint": True, "types": True, "tests": True},
+    {"3.11", "3.12"}, {"3.11", "3.12"}))
+
+print("=== SHA pin ===")
+sha = "b4ffde65f46336ab88eb53be808477a3936bae11"
+print("pinned", is_full_sha_pin(f"actions/checkout@{sha}"))
+print("tag_v4_not_pinned", is_full_sha_pin("actions/checkout@v4"))
+
+print("=== Provenance ===")
+d = "sha256:aaa"
+print("ok", provenance_ok(d, d, d))
+print("divergent", provenance_ok("sha256:aaa", "sha256:bbb", "sha256:ccc"))`,
+      expectedOutput: `=== CI matrix ===
+ok True
+=== SHA pin ===
+pinned True
+tag_v4_not_pinned False
+=== Provenance ===
+ok True
+divergent False`,
+      hint: 'Cambia el digest del SBM a "sha256:bbb" y observa como provenance_ok pasa a False',
     },
     'iac': {
```

### Diff 2 — S44-ISSUE-04: remove verbatim `hint:` duplicates (representative; apply to all 21)

The cleanest fix is to delete the `hint:` field entirely (the `hints` array already carries the same content) OR to make `hint:` a deliberate summary distinct from `hints[0]` (as the 3 T2-A steps already do). The latter is the better pedagogy. Here's the proposed pattern applied to S44-T1-A-E1:

```diff
--- a/src/lib/course/sections/s44-multimodal.ts
+++ b/src/lib/course/sections/s44-multimodal.ts
@@ -567,7 +567,7 @@
         instruction: "S44-T1-A-E1 · Calcula el contrato de `lint/types/tests y matrices` sobre `CASO-PIU-044-1A`. …",
-        hint: "Relaciona los campos `lint`, `types`, `tests`, `matrix`, `supported` con la regla explicada en S44-T1-A.",
+        hint: "Recuerda el AND de los tres checks más la igualdad matriz==soportada.",
         hints: [
           "Relaciona los campos `lint`, `types`, `tests`, `matrix`, `supported` con la regla explicada en S44-T1-A.",
           "El predicado correcto debe ser verdadero porque el fixture conserva lint/types/tests y matriz soportada en verde; revisa dirección de comparación, conjuntos y negaciones.",
         ],
```

(Applied analogously to the other 20 affected steps: `hint:` becomes a short summary, `hints[0]` becomes the field-recall cue, `hints[1]` becomes the reasoning cue.)

### Diff 3 — S44-ISSUE-05: rewrite theory callouts to remove scaffolding meta-language

```diff
--- a/src/lib/course/sections/s44-multimodal.ts
+++ b/src/lib/course/sections/s44-multimodal.ts
@@ -55,7 +55,7 @@
       callout: {
         type: "info",
         title: "Gate de promoción",
-        content: "Nota de orientación: S44-T1-A: caso sintético con asserts locales; si falta, no promociones.",
+        content: "Caso sintético S44-T1-A: si los asserts locales fallan o faltan, no promociones el artefacto.",
       },
@@ -189,7 +189,7 @@
       callout: {
         type: "tip",
         title: "Contrato local",
-        content:
-          "Contrato S44-T2-B: fixture S44-T2-B; si falta evidencia, no promociones.",
+        content:
+          "Si los digests de artifact, SBOM y provenance divergen o falta la attestation, el gate rechaza el promote.",
       },
@@ -220,7 +220,7 @@
       callout: {
         type: "tip",
         title: "Contrato local",
-        content:
-          "Para S44-T3-A: fixture S44-T3-A; si falta evidencia, no promociones.",
+        content:
+          "Sin aprobador independiente o con digests distintos entre staging y prod, el gate deniega el promote.",
       },
@@ -322,7 +322,7 @@
       callout: {
         type: "tip",
         title: "Contrato local",
-        content:
-          "Cierre de S44-T4-B: documenta residual risk y límites del lab stdlib.",
+        content:
+          "Al cerrar el subtema, documenta el riesgo residual y los límites del lab con stdlib.",
       },
```

(The remaining 4 callouts at L98, L138, L262, L294 follow the same rewrite pattern.)

### Diff 4 — S44-ISSUE-07: fix `"mismo digest probado"` article omissions (T3-A)

```diff
--- a/src/lib/course/sections/s44-multimodal.ts
+++ b/src/lib/course/sections/s44-multimodal.ts
@@ -1235,7 +1235,7 @@
-        instruction: "S44-T3-A-E1 · Verifica el contrato de `environments y approvals` sobre `CASO-PIU-044-3A`. La entrada es el dict completo del starter; la operación debe demostrar mismo digest probado y aprobación independiente. …",
+        instruction: "S44-T3-A-E1 · Verifica el contrato de `environments y approvals` sobre `CASO-PIU-044-3A`. La entrada es el dict completo del starter; la operación debe demostrar el mismo digest probado y la aprobación independiente. …",
@@ -1241,7 +1241,7 @@
-        edgeCases: ["falta promoted_digest", "fixture adverso: mismo digest probado y aprobación independiente", "CASO-PIU-044-3A es sintético"],
+        edgeCases: ["falta promoted_digest", "fixture adverso: el mismo digest probado y la aprobación independiente", "CASO-PIU-044-3A es sintético"],
@@ -1275,7 +1275,7 @@
-          "Después aplica la regla de S44-T3-A: mismo digest probado y aprobación independiente. El fixture adverso debe fallar por contenido, no por schema.",
+          "Después aplica la regla de S44-T3-A: el mismo digest probado y la aprobación independiente. El fixture adverso debe fallar por contenido, no por schema.",
@@ -1277,7 +1277,7 @@
-        edgeCases: ["falta promoted_digest", "fixture adverso: mismo digest probado y aprobación independiente", "CASO-PIU-044-3A es sintético"],
+        edgeCases: ["falta promoted_digest", "fixture adverso: el mismo digest probado y la aprobación independiente", "CASO-PIU-044-3A es sintético"],
@@ -1328,7 +1328,7 @@
-          "Para datos completos reutiliza la regla que demostró mismo digest probado y aprobación independiente; solo ese caso devuelve `CONTINUE`.",
+          "Para datos completos reutiliza la regla que demostró el mismo digest probado y la aprobación independiente; solo ese caso devuelve `CONTINUE`.",
@@ -1330,7 +1330,7 @@
-        edgeCases: ["falta promoted_digest", "fixture adverso: mismo digest probado y aprobación independiente", "CASO-PIU-044-3A es sintético"],
+        edgeCases: ["falta promoted_digest", "fixture adverso: el mismo digest probado y la aprobación independiente", "CASO-PIU-044-3A es sintético"],
```

### Diff 5 — S44-ISSUE-08: fix 3 broken-template hints

```diff
--- a/src/lib/course/sections/s44-multimodal.ts
+++ b/src/lib/course/sections/s44-multimodal.ts
@@ -715,7 +715,7 @@
-          "El predicado correcto debe ser verdadero porque el fixture conserva cache miss conserva resultado y artifact es verificable; revisa dirección de comparación, conjuntos y negaciones.",
+          "El predicado correcto debe ser verdadero porque el fixture conserva: un cache miss sigue produciendo resultado correcto, y el artifact es verificable. Revisa dirección de comparación, conjuntos y negaciones.",
@@ -1097,7 +1097,7 @@
-          "El predicado correcto debe ser verdadero porque el fixture conserva SBOM y provenance coinciden con digest; revisa dirección de comparación, conjuntos y negaciones.",
+          "El predicado correcto debe ser verdadero porque el fixture conserva: SBOM y provenance que coinciden con el digest. Revisa dirección de comparación, conjuntos y negaciones.",
@@ -1665,7 +1665,7 @@
-          "El predicado correcto debe ser verdadero porque el fixture conserva fallo crítico bloquea y deja evidencia auditable; revisa dirección de comparación, conjuntos y negaciones.",
+          "El predicado correcto debe ser verdadero porque el fixture conserva: un fallo crítico bloquea el pipeline y deja evidencia auditable. Revisa dirección de comparación, conjuntos y negaciones.",
```

### Diff 6 — S44-ISSUE-09: fix `"residual risk"` calque

```diff
--- a/src/lib/course/sections/s44-multimodal.ts
+++ b/src/lib/course/sections/s44-multimodal.ts
@@ -326,7 +326,7 @@
-          "Cierre de S44-T4-B: documenta residual risk y límites del lab stdlib.",
+          "Al cerrar el subtema, documenta el riesgo residual y los límites del lab con stdlib.",
```

### Diff 7 — S44-ISSUE-10: fix self-check Q4 explanation

```diff
--- a/src/lib/course/sections/s44-multimodal.ts
+++ b/src/lib/course/sections/s44-multimodal.ts
@@ -1926,7 +1926,7 @@
-        explanation: "El lab es sintético a propósito: practicas gates (pin, SBOM, aprobación, rollback) sin PII ni secretos reales; omitir evidencia de supply chain no aprueba el gate.",
+        explanation: "El laboratorio es sintético a propósito: practicas los controles (pin, SBOM, aprobación, rollback) sin PII ni secretos reales; omitir evidencia de supply chain no aprueba el gate.",
```

### Diff 8 — S44-ISSUE-13: add terminal periods to 8 I-Do `description:` fields

```diff
--- a/src/lib/course/sections/s44-multimodal.ts
+++ b/src/lib/course/sections/s44-multimodal.ts
@@ -368,7 +368,7 @@
-        description: "Demo: lint/types/tests y matrices",
+        description: "Demo: lint/types/tests y matrices.",
@@ -394,7 +394,7 @@
-        description: "Demo: caches, artifacts y condiciones",
+        description: "Demo: caches, artifacts y condiciones.",
@@ -418,7 +418,7 @@
-        description: "Demo: permisos mínimos, pinning y secret scanning",
+        description: "Demo: permisos mínimos, pinning y secret scanning.",
@@ -443,7 +443,7 @@
-        description: "Demo: SBOM, provenance y attestations",
+        description: "Demo: SBOM, provenance y attestations.",
@@ -464,7 +464,7 @@
-        description: "Demo: environments y approvals",
+        description: "Demo: environments y approvals.",
@@ -497,7 +497,7 @@
-        description: "Demo: migrations, canary/blue-green y rollback",
+        description: "Demo: migrations, canary/blue-green y rollback.",
@@ -522,7 +522,7 @@
-        description: "Demo: branch/review policy y release notes",
+        description: "Demo: branch/review policy y release notes.",
@@ -543,7 +543,7 @@
-        description: "Demo: failure handling y evidencia auditable",
+        description: "Demo: failure handling y evidencia auditable.",
```

### Diff 9 — S44-ISSUE-14: split 7 E3-transfer instructions into 3 numbered clauses

(Shown for T4-A-E3; same pattern applies to T1-A-E3, T1-B-E3, T2-B-E3, T3-A-E3, T3-B-E3, T4-B-E3.)

```diff
--- a/src/lib/course/sections/s44-multimodal.ts
+++ b/src/lib/course/sections/s44-multimodal.ts
@@ -1608,7 +1608,9 @@
-        instruction: "S44-T4-A-E3 · Aísla fallo cerrado para `branch/review policy y release notes` con tres fixtures distintos. `CASO-PIU-044-4A` debe continuar, el adverso debe devolver `BLOCK_UNREVIEWED_RELEASE` y la ausencia de `release_notes` debe devolver `COMPLETE_RELEASE_NOTES`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
+        instruction: "S44-T4-A-E3 · Aísla el fallo cerrado para `branch/review policy y release notes` con tres fixtures distintos. (1) `CASO-PIU-044-4A` debe devolver `CONTINUE`. (2) El fixture adverso debe devolver `BLOCK_UNREVIEWED_RELEASE`. (3) La ausencia de `release_notes` debe devolver `COMPLETE_RELEASE_NOTES`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
```

### Diff 10 — S44-ISSUE-15: fix `{read,none}` typography

```diff
--- a/src/lib/course/sections/s44-multimodal.ts
+++ b/src/lib/course/sections/s44-multimodal.ts
@@ -854,7 +854,7 @@
-        hint: "Valida permisos ⊆ {read,none}, `action_ref` con SHA de 40 hex tras `@`, secret_hits==0 y dependency_review.",
+        hint: "Valida permisos ⊆ {read, none}, `action_ref` con SHA de 40 hex tras `@`, secret_hits==0 y dependency_review.",
```

### Diff 11 — S44-ISSUE-16: add comma before `pero`

```diff
--- a/src/lib/course/sections/s44-multimodal.ts
+++ b/src/lib/course/sections/s44-multimodal.ts
@@ -105,7 +105,7 @@
-        "La **cache** acelera installs (pip/npm) pero **no es fuente de verdad**: un cache hit no prueba que el build sea reproducible. …",
+        "La **cache** acelera installs (pip/npm), pero **no es fuente de verdad**: un cache hit no prueba que el build sea reproducible. …",
```

### Diff 12 — S44-ISSUE-06 (optional): drop `S44 · ` prefix from `weDo.intro`

```diff
--- a/src/lib/course/sections/s44-multimodal.ts
+++ b/src/lib/course/sections/s44-multimodal.ts
@@ -563,7 +563,7 @@
-    intro: "S44 · Laboratorio de pipeline CI/CD con supply-chain gates: 24 retos (E1 repara, E2 clasifica valid/invalid/missing, E3 decide fail-closed). Ocho case_ids sintéticos de Piura (`CASO-PIU-044-1A`…`4B`); cada tríada reutiliza el mismo fixture de dominio con predicados invertidos a propósito.",
+    intro: "Laboratorio de pipeline CI/CD con supply-chain gates: 24 retos (E1 repara, E2 clasifica valid/invalid/missing, E3 decide fail-closed). Ocho case_ids sintéticos de Piura (`CASO-PIU-044-1A`…`4B`); cada tríada reutiliza el mismo fixture de dominio con predicados invertidos a propósito.",
```

---

## 8. Recommended Priority Order for fixing

| Priority | Issue | Severity | Effort | Why first |
|---|---|---|---|---|
| 1 | S44-ISSUE-03 (interactive demo bug) | H (critical) | M (write a new ~50-line demo) | Actively corrupts pedagogy on the live theory tab. |
| 2 | S44-ISSUE-01 (rename file + `id`) | H | S (3 lines + file rename) | Source-archaeology leak; prerequisite for S44-ISSUE-03 fix to be discoverable. |
| 3 | S44-ISSUE-02 (PdfReport label) | H | XS (1 line) | Tangible artifact (PDF) shows wrong title to learners/employers. |
| 4 | S44-ISSUE-08 (3 broken-template hints) | M | S (3 lines) | Grammatically broken Spanish in the highest-scaffolding tier. |
| 5 | S44-ISSUE-07 (6 `"mismo digest probado"` omissions) | M | S (6 lines) | Recurring grammar defect in T3-A; learner may internalize. |
| 6 | S44-ISSUE-05 (8 scaffolding-note callouts) | M | M (8 rewrites) | Callouts should be high-signal pedagogy, not tracker entries. |
| 7 | S44-ISSUE-04 (21 hint duplicates) | M | M (21 rewrites) | Source bloat + divergence risk; align with the 3 T2-A exceptions. |
| 8 | S44-ISSUE-14 (7 long E3 instructions) | M | M (7 splits) | Cognitive-load spike; anaphoric monotony. |
| 9 | S44-ISSUE-18 (anglicism density) | M | L (whole-section pass) | Stylistic improvement; backtick or translate inline tech nouns. |
| 10 | S44-ISSUE-09, 10, 11, 12, 13, 15, 16, 17 | L | XS-S each | Polish; do in a single cleanup PR. |
| 11 | S44-ISSUE-06, 19, 20 | L | XS each | Optional / informational. |

**Suggested PR sequencing:**
- PR1 (urgent, blocks learning): Issues 1+2+3 (the meta-leak chain — rename, PdfReport, replace demo). Single coordinated PR.
- PR2 (grammar + callouts): Issues 5+7+8+9+10+11+12+13+15+16. Single cleanup PR.
- PR3 (scaffolding): Issues 4+14. Single PR with the 21 hint rewrites and 7 instruction splits.
- PR4 (stylistic): Issue 18 (anglicism pass) + 6 (drop `S44 ·` prefix) + 17 (caché). Optional, lowest priority.

---

## 9. Graph Memory Update notes (for the shared context files)

For the orchestrator's shared graph memory:

- **S44 node**: `id="multimodal"`, `index=44`, `title="CI/CD y seguridad de la cadena de suministro"`, `phase=3 Master`, `estimatedHours=20`. **Anomaly flag**: `STALE_ID` (filename and `id` field contradict content; same pattern as S37 `dbt-bigquery`). **Critical defect flag**: `WRONG_INTERACTIVE_DEMO` (SectionView.tsx `'multimodal'` key serves a CLIP/Whisper demo unrelated to CI/CD).
- **Edges**:
  - `S44 ← pred: S43` (contenedor → CI/CD supply chain) — confirmed in `theory[0].paragraphs[1]`.
  - `S44 → succ: S45` (CI/CD → cloud/colas) — confirmed in `theory[0].paragraphs[1]`.
  - `S44 ↔ competency: CP-N4-B` (cadena de suministro verificable) — confirmed in `jobRelevance`, `portfolioNote`, `selfCheck.Q3`, `theory[7]`.
  - `S44 ↔ case: CASO-PIU-044-{1A,1B,2A,2B,3A,3B,4A,4B}` — 8 synthetic fixtures.
- **Quality score**: 6.4 / 10 (composite; see §2).
- **Grammar metrics** (per `_GRAMMAR_SUBPLAN.md`):
  - Records: 180 total / 162 Spanish / 224 sentences scored.
  - FH median = 81.8 (bastante fácil); INFLESZ median = 78.2; WPS median = 17; SPW median = 1.8.
  - Findings: 47 `missing_terminal` (mostly defensible headings/labels), 8 `long_gt32` (the E3 template), 0 `run_on_gt45`, 0 `meta_leak` (within section source — the meta-leak is in `SectionView.tsx` and `PdfReport.tsx`).
  - LanguageTool `es`: 613 total matches — 605 `MORFOLOGIK_RULE_ES` (vast majority are English tech-terms-not-in-dictionary, not real spelling errors) + 2 `SUBJUNTIVO_INCORRECTO` (false positives on `caches`/`notes` as Spanish subjunctive verbs) + 2 `FALTA_ELEMENTO_ENTRE_VERBOS` (false positives) + 1 `DIACRITICS_OTHERS` + 1 `COMMA_PARENTHESIS_WHITESPACE` (real, S44-ISSUE-15) + 1 `AGREEMENT_DET_NOUN` (real, on `El checklist` — defensible since `checklist` is an English loanword) + 1 `PRACTICA` (false positive on tú-verb `practicas`).
- **Worst sentences** (by WPS): 7 E3-transfer instructions (WPS 38-42), all sharing the same overloaded template.
- **Worst sentences** (by FH low): the same 7 E3 instructions + 1 portfolioNote sentence (FH=66.2).
- **Files for downstream use**:
  - `/home/z/my-project/audits/S44_records.json` — per-sentence metrics + findings.
  - `/home/z/my-project/audits/S44_metrics.json` — aggregate stats + worst-sentence lists.
  - `/home/z/my-project/audits/S44_prose.txt` — concatenated Spanish prose (224 lines) fed to LanguageTool.
  - `/home/z/my-project/audits/S44_lt.json` — 613 LanguageTool matches.
  - `/home/z/my-project/audits/S44_extract.py` — extractor script (re-runnable).
  - `/home/z/my-project/audits/S44_lt.py` — LanguageTool runner (re-runnable).
- **Cross-section patterns observed** (for the orchestrator's cross-section graph):
  - `STALE_ID` anomaly: S37 (`dbt-bigquery`), S44 (`multimodal`) — both file names + `id` fields contradict content. Pattern suggests a V3 roadmap rename pass that updated `learning_roadmap_52_V3.md` and `title`/`shortTitle`/`tagline` but missed `id`, file name, `PdfReport.tsx` label, and `SectionView.tsx` demo key. **Recommend a cross-section sweep for any section where `id` ≠ `shortTitle`-slugified.**
  - `HINT_DUPLICATION` pattern: S01, S37, S44 (and likely most others) all have `hint:` verbatim-duplicating `hints[0]` in 21-24/24 weDo steps. **Recommend a course-wide fix to either delete `hint:` or make it a deliberate summary distinct from `hints[0]`.**
  - `E3_TEMPLATE_OVERLOAD` pattern: S44's 7 E3-transfer instructions share a 38-42 word template. Worth checking if S37 and other Master-phase sections have the same template overload.

---

## 10. Method Note (research summary, per `_GRAMMAR_SUBPLAN.md`)

**Research methods applied:**

1. **Fernández-Huerta (1959)** Spanish Flesch adaptation: `FH = 206.84 − 60·(syllables/word) − 1.02·(words/sentence)`. Computed per sentence. Interpretive bands: ≥90 muy fácil → <30 muy difícil. For technical curriculum, "normal / bastante difícil" (~50-70) is healthy; S44's median 81.8 ("bastante fácil") is on the easier side, consistent with short technical sentences.
2. **Szigriszt-Pazos / INFLESZ**: `INFLESZ = 206.835 − 62.3·(syllables/word) − (words/sentence)`. Computed per sentence. S44 median 78.2 ("normal").
3. **Words per sentence (WPS)** and **syllables per word (SPW)**: S44 medians 17 and 1.8 — both within the pedagogical soft target range (WPS 15-32, SPW 1.5-2.1).
4. **Spanish syllable counter**: heuristic vowel-group + diphthong/hiatus rules implemented in `S44_extract.py` (lines 137-189). Validated against the S37 extractor (same algorithm).
5. **Sentence segmentation**: Spanish-aware regex split on `[.!?]` followed by uppercase or `¿¡`, with abbreviation protection (`p.ej`, `p. ej`, `Dr`, `Sra`, `Sr`, `approx`, `etc`).
6. **Heuristic pedagogical checks** (offline, no API): run-on > 45 words (H), long > 32 (M), missing terminal punctuation (M), missing `¿`/`¡` (M/L), unbalanced delimiters (M), repeated word (M), gerund pile-up ≥ 3 (L), high comma density ≥ 4 with WPS > 25 (L), space-before-punct (L), double space (L), meta/AI/TODO leak (H). All implemented in `S44_extract.py` (lines 199-234).
7. **LanguageTool `es`** via public HTTP API: 2 chunks of ~18,000 chars each, 4-second throttle between chunks. 613 matches total; 8 non-spell matches extracted for analysis. The 605 `MORFOLOGIK_RULE_ES` matches are predominantly English tech terms used inline (artifacts, cache, lint, types, tests, workflow, branch, provenance, attestation, SBOM, digest, RTO, canary, rollback, release, notes, gate, etc.) — these reflect the section's high anglicism density (S44-ISSUE-18) rather than spelling errors.

**Validation:**
- Nonzero prose extraction (180 records, 224 sentences) ✓
- FH in plausible range (51-143, median 82) ✓
- No catastrophic LT API errors ✓
- Documented false-positive classes: `MORFOLOGIK_RULE_ES` on English tech terms (605), `SUBJUNTIVO_INCORRECTO` on `caches`/`notes` (2), `FALTA_ELEMENTO_ENTRE_VERBOS` (2), `PRACTICA` on tú-verb (1).

**Out of scope (per subplan):**
- Automatic rewrites (audit-only; diffs proposed but not applied).
- Full semantic discourse coherence (anaphora resolution beyond monotony).
- Human CEFR labeling of every sentence.
- Premium LanguageTool features / private server.

---

## 11. Appendix — Full metrics summary

(See `/home/z/my-project/audits/S44_metrics.json` for the complete file.)

```
section: S44
n_records: 180
n_spanish_records: 162
n_sentences: 224

WPS:   min=3, p25=11, median=17, p75=22, max=42, mean=16.8
SPW:   min=1.0, p25=1.6, median=1.8, p75=2.0, max=2.5, mean=1.8
FH:    min=51.2, p25=72.4, median=81.8, p75=91.5, max=142.8, mean=82.5
INF:   min=47.1, p25=68.5, median=78.2, p75=88.0, max=140.5, mean=78.7

findings_count:
  missing_terminal: 47
  long_gt32: 8
```

**LT non-spell findings (8 total):**

| Rule | Severity | Location | Verdict |
|---|---|---|---|
| `SUBJUNTIVO_INCORRECTO` × 2 | false positive | `caches`, `notes` | English tech noun, not Spanish subjunctive verb. |
| `FALTA_ELEMENTO_ENTRE_VERBOS` × 2 | false positive | ` cache `, ` cache ` | Misfire on English loanword. |
| `DIACRITICS_OTHERS` × 1 | false positive | `practicas` | Tú-verb; tilde not required. |
| `COMMA_PARENTHESIS_WHITESPACE` × 1 | **real** | L854 `{read,none}` | S44-ISSUE-15. |
| `AGREEMENT_DET_NOUN` × 1 | defensible | `El checklist` | English loanword; masculine article is conventional. |
| `PRACTICA` × 1 | false positive | L1926 `practicas` | Tú-verb; tilde not required. S44-ISSUE-10 stylistic note. |

---

**This is the complete Explorer report for Section 44. Ready for the Fixer prompt.**
