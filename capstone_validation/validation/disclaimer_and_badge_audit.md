# Disclaimer Inventory + Badge Audit

**Auditor:** product/UX auditor (read-only)
**Commit SHA:** `53e32769da23dcce1326c812352515803b4e6258`
**Commit subject:** `fix(static): hide 'Crear cuenta gratis' on static build + bilingual notice`
**Date:** 2026-07-31
**Scope:** learner-facing source files under `src/app/`, `src/components/course/`, `src/lib/i18n.ts`; eligibility engine under `src/lib/eligibility/`; rubric and requirements catalogs under `industry_alignment/badge_rubrics/`, `industry_alignment/badge_requirements/`, `industry_alignment/badge_catalog.json`.

This is a **read-only audit**. No source file was modified.

---

## 1. Disclaimer inventory

### 1.1 How to read this table

`file:line` — path and starting line of the disclaimer.
`Text / i18n key` — exact copy (Spanish原文 unless stated) or the i18n key it resolves to. Where a string appears in three locales in `i18n.ts`, the line of the `es-PE` entry is cited and the `es-ES` / `en` lines are listed in parentheses.
`Classification` — one of: `essential-and-placed`, `essential-but-verbose`, `duplicated`, `negative-framing`, `legal-policy-centralizable`, `static-dynamic-boundary`, `privacy-consent`, `obsolete`, `contradictory`, `unsupported-claim`.
`Recommended action` — one of: `keep`, `shorten`, `remove-duplicate`, `centralize-to-policy`, `convert-to-positive`, `fix-contradiction`.

### 1.2 Inventory table

| # | file:line | Text / i18n key | Classification | Recommended action |
|---|-----------|-----------------|----------------|--------------------|
| 1 | `src/components/course/Dashboard.tsx:241-243` | "Right now, only in this browser (localStorage — esto es, una base de datos interna del navegador que tú controlas)." | static-dynamic-boundary | keep (canonical UX copy) |
| 2 | `src/components/course/Dashboard.tsx:245-247` | "If you create an account, your progress also syncs to our servers… We do not sell or share your data." | privacy-consent · duplicated | centralize-to-policy (link to `/privacy`, drop the inline re-statement) |
| 3 | `src/components/course/Dashboard.tsx:281-282` | "Browser-local progress remains the fast first read; the cloud copy is the source of truth when you switch devices." | static-dynamic-boundary | keep |
| 4 | `src/components/course/Dashboard.tsx:303-304` | "This page is a read-only snapshot hosted on GitHub Pages. Account creation and cloud sync are available when Firebase is configured; otherwise, your progress stays in this browser only." | static-dynamic-boundary · essential-and-placed | keep |
| 5 | `src/components/course/Dashboard.tsx:556-557` | "You practise with synthetic work scenarios and data; we never use real personal information, and we make no employment promises." | essential-and-placed · negative-framing (mild) | keep (the "make no employment promises" is necessary; the rest is positive) |
| 6 | `src/components/course/Dashboard.tsx:598-599` | "No credential guarantees employment; always verify requirements, current status, and cost on the official page before paying." | essential-and-placed | keep |
| 7 | `src/components/course/Dashboard.tsx:708-709` | "PyArcana is an educational project. Badges and section completions are markers of practice, not professional certifications or employment guarantees." | duplicated (re-stated in `/disclaimer`, `/badge-notice`, `LegalDisclaimer.tsx`, `tour.legal.body`) | centralize-to-policy (link to `/disclaimer` + `/badge-notice`; drop the inline re-statement) |
| 8 | `src/components/course/Dashboard.tsx:744-745` | "A badge is a small marker that you completed an exercise or section independently… it is not a professional certification." | duplicated (re-stated in `/badge-notice` §"Marcador de finalización vs insignia de competencia") | centralize-to-policy |
| 9 | `src/components/course/Dashboard.tsx:781-782` | "It is not a professional certification or accredited credential." | duplicated (re-stated in `/badge-notice` §"Lo que una insignia NO prueba") | remove-duplicate (keep the link to `/badge-notice`) |
| 10 | `src/components/course/Dashboard.tsx:786-787` | "It does not guarantee employment, interviews or salary." | duplicated (re-stated in `/disclaimer` §"Sin garantía de empleo") | remove-duplicate |
| 11 | `src/components/course/Dashboard.tsx:808-809` | "When you finish an exercise without an account, the badge is a local preview stored only in this browser. Nobody else can see or verify it." | static-dynamic-boundary · essential-and-placed | keep (canonical UX copy) |
| 12 | `src/components/course/Dashboard.tsx:839-840` | "See the full Badge and Credential Notice for criteria, limitations and revocation policy." | essential-and-placed | keep |
| 13 | `src/components/course/AuthModal.tsx:272-273` | "Firebase no está configurado en este despliegue. La edición pública guarda tu progreso solo en el navegador." | static-dynamic-boundary · essential-and-placed | keep |
| 14 | `src/components/course/AuthModal.tsx:554-555` | "Al crear una cuenta, tu progreso se sincroniza con nuestros servidores. No vendemos ni compartimos tus datos." | privacy-consent · duplicated (re-stated in `Dashboard.tsx:247`, `LegalDisclaimer.tsx:53-55`, `/privacy` page, `/cookies` page) | centralize-to-policy |
| 15 | `src/components/course/CapstonesPage.tsx:692` | "Estado de evidencia: Sin registrar. La rúbrica y el brief definen qué se espera; no constituyen por sí mismos una aprobación." | essential-and-placed | keep |
| 16 | `src/components/course/CapstonesPage.tsx:753` → `i18n.ts:262` (es-ES: `525`, en: `788`) | `capstones.disclaimer`: "Estos son niveles de competencia curricular de PyArcana. Describen evidencia demostrada dentro del curso y no establecen por sí mismos antigüedad laboral, licencia profesional, nivel de empleo ni certificación externa." | essential-and-placed | keep (canonical home for the curricular-levels-vs-employment disclaimer) |
| 17 | `src/components/course/LegalDisclaimer.tsx:43-45` | "Este curso es material educativo. No constituye asesoría profesional, legal ni financiera…" | duplicated (re-stated verbatim in `/disclaimer` page §"Naturaleza educativa") | centralize-to-policy (this component is a reusable 4-pillar block — keep it but ensure inline legal pages don't re-state the same content) |
| 18 | `src/components/course/LegalDisclaimer.tsx:53-55` | "Tus datos de progreso se almacenan localmente en tu navegador… No vendemos ni compartimos tus datos." | privacy-consent · duplicated | centralize-to-policy |
| 19 | `src/components/course/LegalDisclaimer.tsx:62-65` | "Las prácticas de seguridad mencionadas en este curso son puntos de partida, no auditorías completas. Para aplicaciones en producción, consulta con un especialista en seguridad." | duplicated (re-stated in `/disclaimer` page §"Prácticas de seguridad") | centralize-to-policy |
| 20 | `src/components/course/LegalDisclaimer.tsx:72-75` | "El código que escribes en este curso es tuyo. Los ejercicios y escenarios son educativos y no deben usarse en producción sin adaptación." | duplicated (re-stated in `/terms` §"3. Propiedad del código") | centralize-to-policy |
| 21 | `src/components/course/LegalDisclaimer.tsx:116-118` | "Estos avisos reflejan buenas prácticas de la industria (GDPR de la Unión Europea y CCPA de California para privacidad; OWASP y NIST para seguridad de software) y se ofrecen como punto de partida. Si tienes dudas sobre tu caso particular, consulta con un profesional acreditado." | essential-but-verbose · legal-policy-centralizable | shorten (the four standards can be a single line; "consulte con un profesional acreditado" is already in the footer of every legal page) |
| 22 | `src/components/course/ResourcesPage.tsx:1246` | "Base de datos pública de ocupaciones con tareas, habilidades y tecnologías. Esto es, lo que miras para entender qué pide el mercado sin que nadie te prometa empleo." | essential-and-placed (employment-expectation calibrator) | keep |
| 23 | `src/components/course/ResourcesPage.tsx:1980-1982` | "Esto es, una precaución estándar para que el sitio destino no pueda manipular tu pestaña de PyArcana. No controlamos el contenido externo… La inclusión de un recurso no implica respaldo; úsalo solo si encaja con tu objetivo." | duplicated (re-stated in `/external-resources` page) | centralize-to-policy |
| 24 | `src/components/course/ResourcesPage.tsx:2046` | `<LegalDisclaimer />` — invocation of the 4-pillar reusable block | essential-and-placed | keep |
| 25 | `src/components/course/PdfReport.tsx:289` (also `src/lib/i18n.ts:158` and `:421`) | "PDF con todas tus secciones, intentos de examen, scores, tiempo y gaps. Ideal para mostrar a empleadores." | unsupported-claim (the platform makes no employment promises elsewhere — see Dashboard `:556-557` and `:708-709`; telling the learner the PDF is "ideal para mostrar a empleadores" implies job-seeking utility) | convert-to-positive ("Ideal para tu portafolio personal" or "Ideal para tu registro de aprendizaje") |
| 26 | `src/components/course/PdfReport.tsx:608-610` | Certificate HTML body: "ha completado satisfactoriamente el curso PyArcana, demostrando dominio de Python para Data Analysis y Data Science con método pedagógico I Do / We Do / You Do." | unsupported-claim · contradictory (uses "dominio" — mastery — language; the badge catalog explicitly avoids "Mastery"/"dominio" for non-capstone credentials; this certificate is granted at ≥8 sections completed, far below any competency-badge floor of 85%; the badge-notice page §"Lo que una insignia NO prueba" disclaims exactly this kind of claim) | convert-to-positive + fix-contradiction (e.g. "ha completado N secciones del curso PyArcana con el método pedagógico I Do / We Do / You Do; este certificado es un registro de progreso, no una certificación profesional") |
| 27 | `src/components/course/PdfReport.tsx:619-624` | Certificate stats: "70h+ Contenido", "11 Proyectos" (hard-coded in the printable certificate template) | unsupported-claim (hard-coded numbers; not derivable from any source of truth; "11 Proyectos" does not match the 13 capstones or the badge-catalog project count) | shorten / remove (or compute from `data.progress`) |
| 28 | `src/lib/i18n.ts:274` (es-ES: `537`, en: `800`) | `tour.capstones.body`: "Aquí ves los capstones por nivel (L1 a L4) y el proyecto final que integra los doce anteriores. Son evaluaciones curriculares, no certificaciones laborales." | essential-and-placed · duplicated (restates `capstones.disclaimer` in shorter form) | keep (tour-length constraint justifies the short restatement) |
| 29 | `src/lib/i18n.ts:288` (es-ES: `551`, en: `814`) | `tour.legal.body`: "Privacidad, términos, cookies, aviso educativo, derechos ARCO y seguridad. PyArcana es un proyecto educativo, no certificación profesional." | essential-and-placed · duplicated (restates `capstones.disclaimer` and Dashboard `:708-709`) | keep (tour-length constraint justifies the short restatement) |
| 30 | `src/app/disclaimer/page.tsx:7` | "PyArcana es material educativo. No constituye asesoría profesional, legal ni financiera…" | legal-policy-centralizable · duplicated (same text in `LegalDisclaimer.tsx:43-45`) | keep (this is the canonical home; remove the duplicate in `LegalDisclaimer.tsx` OR vice-versa, but not both) |
| 31 | `src/app/disclaimer/page.tsx:10` | "Completar el curso no garantiza empleo, ascensos, admisión a programas académicos, aumento de salario ni resultados profesionales específicos…" | essential-and-placed (canonical home for the employment disclaimer) | keep |
| 32 | `src/app/disclaimer/page.tsx:13` | "Las insignias (badges) de PyArcana describen evidencia de ejercicios completados de forma independiente. No son equivalentes a certificaciones de Microsoft, AWS, Google, IBM, universidades ni ningún otro organismo externo…" | essential-and-placed (canonical home for the badge-≠-certification disclaimer) | keep |
| 33 | `src/app/disclaimer/page.tsx:16` | "No subas información confidencial, personal, regulada ni propiedad de tu empleador a los ejercicios…" | essential-and-placed · duplicated (re-stated in `/terms` §"2. Uso aceptable" and `/acceptable-use` page) | centralize-to-policy (cross-link `/acceptable-use`) |
| 34 | `src/app/disclaimer/page.tsx:19` | "Las prácticas de seguridad mencionadas en el curso son puntos de partida, no auditorías completas…" | duplicated (verbatim in `LegalDisclaimer.tsx:62-65`) | remove-duplicate (keep here; remove from `LegalDisclaimer.tsx`) |
| 35 | `src/app/disclaimer/page.tsx:22` | "Los proveedores externos controlan sus propios precios, requisitos, políticas y credenciales. Verifica siempre la información actual antes de registrarte o pagar." | duplicated (re-stated in `/external-resources` page and `ResourcesPage.tsx:1980-1982`) | centralize-to-policy |
| 36 | `src/app/badge-notice/page.tsx:7` | "Un marcador de finalización indica que viste o completaste una sección. No prueba que dominas el tema. Una insignia de competencia (badge) requiere completar ejercicios independientes sin ver la solución, alcanzar un puntaje mínimo y cumplir criterios específicos." | essential-and-placed (canonical home for the completion-vs-competency distinction) | keep |
| 37 | `src/app/badge-notice/page.tsx:10` | "En la edición pública (GitHub Pages), puedes ver una vista previa de tu elegibilidad para insignias. Esta vista previa se calcula en tu navegador y no constituye una insignia verificada. Una insignia verificada requiere autenticación (inicio de sesión) y evaluación en el servidor." | static-dynamic-boundary · essential-and-placed (canonical home for the preview-vs-verified distinction) | keep |
| 38 | `src/app/badge-notice/page.tsx:13` | "Una insignia de PyArcana prueba que completaste ejercicios independientes específicos, alcanzaste los puntajes mínimos establecidos y pasaste las puertas críticas de competencia (esto es, criterios que no pueden compensarse con un promedio alto en otras áreas)." | essential-and-placed (canonical home) | keep |
| 39 | `src/app/badge-notice/page.tsx:16` | "Una insignia de PyArcana NO es equivalente a una certificación profesional regulada. No garantiza competencia en producción, no reemplaza la experiencia laboral, no equivale a un título universitario y no constituye una evaluación independiente por un tercero autorizado." | essential-and-placed (canonical home) | keep |
| 40 | `src/app/badge-notice/page.tsx:19` | "Las insignias tienen versión. Si los criterios cambian, las insignias emitidas bajo criterios anteriores conservan su validez, pero pueden marcarse como 'versión anterior'…" | essential-and-placed | keep |
| 41 | `src/app/badge-notice/page.tsx:22` | "Una insignia puede revocarse si se descubre que la evidencia fue manipulada, si se encuentra que los criterios no se cumplieron genuinamente o si se identifica fraude. La revocación incluye un motivo registrado y auditable." | essential-and-placed | keep |
| 42 | `src/app/privacy/page.tsx:18-19` | English summary: "We store only the data needed to operate the course… We do not sell or share your data. You can delete it at any time." | privacy-consent · essential-and-placed (canonical home) | keep |
| 43 | `src/app/privacy/page.tsx:26-29` | "En la edición pública (GitHub Pages) guardamos tu progreso solo en tu navegador… No vendemos ni compartimos tus datos. Esto es, ninguno de los dos modos comparte tu información con terceros para publicidad." | privacy-consent · essential-and-placed (canonical home) | keep |
| 44 | `src/app/privacy/page.tsx:53` | "En tu navegador: cuando usas la edición pública o cuando no has iniciado sesión. Persisten hasta que borres los datos del sitio. Esto es, no hay copia en el servidor." | static-dynamic-boundary · essential-and-placed | keep |
| 45 | `src/app/terms/page.tsx:7` | "El curso no otorga títulos académicos, certificaciones profesionales reguladas ni garantiza resultados laborales." | essential-and-placed (canonical home for the terms-level employment disclaimer) | keep |
| 46 | `src/app/terms/page.tsx:10` | "Te comprometes a usar la plataforma con fines educativos. No debes subir información confidencial, personal, regulada o propiedad de tu empleador a los ejercicios…" | duplicated (re-stated in `/disclaimer` §"No subas información sensible" and `/acceptable-use`) | centralize-to-policy |
| 47 | `src/app/terms/page.tsx:13` | "El código que escribes en los ejercicios es tuyo. Los escenarios, enunciados y estructura del curso son propiedad de PyArcana y están protegidos por derechos de autor." | duplicated (the "el código es tuyo" half is re-stated in `LegalDisclaimer.tsx:72-75`) | centralize-to-policy |
| 48 | `src/app/terms/page.tsx:16` | "Completar el curso no garantiza empleo, ascensos, admisión a programas académicos ni equivalencia con certificaciones externas…" | duplicated (re-stated in `/disclaimer` §"Sin garantía de empleo") | remove-duplicate (keep in `/disclaimer`; cross-link from `/terms`) |
| 49 | `src/app/terms/page.tsx:19` | "La plataforma enlaza recursos externos (documentación, cursos, herramientas). No controlamos su disponibilidad, contenido, privacidad ni costo…" | duplicated (re-stated in `/external-resources` page) | centralize-to-policy |
| 50 | `src/app/terms/page.tsx:25` | "El servicio se ofrece 'tal cual'. No nos hacemos responsables de decisiones tomadas con base en el contenido educativo, ni de daños derivados del uso de código de ejemplo en producción sin adaptación adecuada." | essential-and-placed (canonical home for the limitation of liability clause) | keep |
| 51 | `src/app/cookies/page.tsx:7` | "PyArcana guarda tu progreso de aprendizaje en el almacenamiento local de tu navegador (localStorage)…" | static-dynamic-boundary · duplicated (re-stated in `Dashboard.tsx:241-243`, `LegalDisclaimer.tsx:53-55`, `/privacy` §1) | centralize-to-policy |
| 52 | `src/app/cookies/page.tsx:16` | "No usamos Google Analytics, Facebook Pixel ni otras cookies de seguimiento de terceros. No vendemos ni compartimos datos de navegación." | privacy-consent · duplicated (the "no vendemos ni compartimos" half is re-stated 5× elsewhere) | centralize-to-policy |
| 53 | `src/app/data-rights/page.tsx:7` | "Este documento es informativo. Para cuestiones formales, consulta con un profesional cualificado." | duplicated (the `LegalPage` wrapper at `LegalPage.tsx:39-41` ALREADY appends "Este documento es informativo y no constituye asesoría legal. Para cuestiones formales, consulta con un abogado." to every page that uses `LegalPage`) | remove-duplicate |
| 54 | `src/app/security/page.tsx:7` | "Este documento es informativo. Para cuestiones formales, consulta con un profesional cualificado." | duplicated (same as #53) | remove-duplicate |
| 55 | `src/app/acceptable-use/page.tsx:7` | "Este documento es informativo. Para cuestiones formales, consulta con un profesional cualificado." | duplicated (same as #53) | remove-duplicate |
| 56 | `src/app/external-resources/page.tsx:7` | "Este documento es informativo. Para cuestiones formales, consulta con un profesional cualificado." | duplicated (same as #53) | remove-duplicate |
| 57 | `src/components/legal/LegalPage.tsx:39-41` | "Este documento es informativo y no constituye asesoría legal. Para cuestiones formales, consulta con un abogado." | legal-policy-centralizable (wrapper-level footer — appropriate as a single canonical placement; the four short pages that also re-state it inline are the duplicates) | keep (this is the canonical wrapper copy) |
| 58 | `src/components/legal/LegalPageShell.tsx:108-109` | "Este documento es material educativo y no constituye asesoría legal. Para tu caso particular, consulta con un profesional acreditado." | legal-policy-centralizable (parallel wrapper for the long-form Privacy page; conceptually overlaps with `LegalPage.tsx:39-41` but uses slightly different copy) | shorten + centralize (pick one canonical wrapper copy and use it in both wrappers) |
| 59 | `src/app/page.tsx` | (no inline disclaimer; the home page only renders child components and the i18n footer) | n/a | n/a |
| 60 | `src/components/course/Sidebar.tsx` | (no inline disclaimer) | n/a | n/a |
| 61 | `src/components/course/SectionView.tsx` | (no inline disclaimer; the only "evidencia" matches are inside exercise briefs and code comments, not UX copy) | n/a | n/a |
| 62 | `src/components/course/ExamView.tsx` | (no inline disclaimer; relies on i18n keys `exam.antiPlagiarism` / `exam.antiPlagiarismDesc` which are anti-plagiarism notices, not credential disclaimers — out of scope) | n/a | n/a |
| 63 | `src/components/course/FamiliarityDashboard.tsx` | (no inline disclaimer) | n/a | n/a |
| 64 | `src/components/course/InteractiveTour.tsx` | (no inline disclaimer; all tour copy is sourced from `i18n.ts` tour.* keys, captured at items #28 and #29) | n/a | n/a |

**Total disclaimers inventoried (rows with classification):** 58 (rows 1–58).
**Out-of-scope confirmations (rows 59–64):** 6 (no inline disclaimers found).

### 1.3 Cross-cutting observations

1. **"No vendemos ni compartimos tus datos"** is the single most-duplicated sentence in the codebase: it appears verbatim or near-verbatim in **6 places** (rows 2, 14, 18, 43, 44, 52) plus the Privacy-page english summary. Recommend picking `/privacy` as the canonical home and replacing the inline copies with a one-line link: *"Tu progreso y tus datos: lee el [Aviso de Privacidad]."* This change alone would remove ~5 duplicates.

2. **"No constituye asesoría profesional / legal / financiera"** appears verbatim in **3 places** (`LegalDisclaimer.tsx:43-45`, `/disclaimer` page, `LegalPage.tsx:39-41` wrapper) plus a paraphrase in `LegalPageShell.tsx:108-109`. Recommend treating the `LegalPage` / `LegalPageShell` wrapper footer as canonical and dropping the inline re-statements in `/disclaimer` §"Naturaleza educativa" and `LegalDisclaimer.tsx` item 1.

3. **"No garantiza empleo"** is duplicated 4×: `Dashboard.tsx:708-709`, `Dashboard.tsx:786-787`, `/disclaimer` §"Sin garantía de empleo", `/terms` §"4. Sin garantía de resultados". The `/disclaimer` page is the canonical home; the other three should be replaced with a cross-link.

4. **Static-vs-dynamic boundary explanations** (where progress lives, what "preview" means, what "verified" means) are scattered across **9 places** (rows 1, 3, 4, 11, 13, 37, 44, 51, plus the `capstones.disclaimer` i18n string at row 16). This is the most legitimate form of duplication — each placement answers a different learner question ("where is my progress?" on Dashboard, "what does the badge mean?" on Capstones, "what is the difference between preview and verified?" on badge-notice). **Keep all of these**, but consider extracting the core sentence ("Tu progreso vive en este navegador; crear cuenta lo sincroniza con la nube") into a single i18n key.

5. **`PdfReport.tsx` certificate body (rows 26–27)** is the most serious issue in this audit. The printable certificate grants "dominio de Python para Data Analysis y Data Science" to any learner who completes ≥8 sections — a bar that is **far below** the 85% floor required by every competency badge in the catalog, and **uses mastery language the catalog explicitly disclaims**. This contradicts:
   - `Dashboard.tsx:708-709` ("Badges and section completions are markers of practice, not professional certifications")
   - `/badge-notice` page §"Lo que una insignia NO prueba"
   - `badge_catalog.json` design constraint #2: *"Not imply occupational seniority (no Senior/Staff/Master titles)"*
   - `progress_phase3_walked.non_claims`: *"Does not authorize use of the word 'Master' or 'Senior' in any occupational context"*

6. **`PdfReport.tsx:289`** ("Ideal para mostrar a empleadores") is a milder version of the same issue — it implies job-seeking utility that the rest of the platform disclaims.

---

## 2. Badge audit

### 2.1 Sources read

- `src/lib/eligibility/badge-specs.ts` (loader for `badge_catalog.json`)
- `src/lib/eligibility/badge_catalog.json` (canonical 31-badge catalog, version `1.0.0`, generated `2026-07-28T22:08:04Z`)
- `src/lib/eligibility/engine.ts` (deterministic eligibility engine)
- `src/lib/eligibility/types.ts` (type contract)
- `src/lib/eligibility/index.ts` (public API surface)
- `industry_alignment/badge_rubrics/*.json` (40 rubric files for the 31 badges — some badges have multiple rubric versions; 31 canonical rubrics)
- `industry_alignment/badge_requirements/*.md` (31 requirement docs, one per badge)
- `industry_alignment/badge_claim_register.md` (791-line public claim register)
- `industry_alignment/decisions/ADR-001-badge-taxonomy.md`, `ADR-002-eligibility-engine.md`, `ADR-003-static-vs-dynamic-credentials.md`, `ADR-004-critical-competency-gates.md` (referenced; not re-read in full for this audit)

### 2.2 Badge audit table

`Family` legend: **progress** = `progress_achievement` / `local_achievement`; **competency** = `applied_skill` / `cross_section_capability` / `competency_badge`; **verified** = `capstone_credential` / `verified_credential`.

`Claim strength` legend: **appropriate** = the public claim is bounded by the evidence collected; **too strong** = the public claim (or the badge name) implies more than the evidence supports; **too weak** = the public claim understates the evidence collected.

`Tamper resistance (static)` legend: **low** = localStorage manipulation can produce the badge state in the browser; **medium** = engine returns `eligible_pending_verification` (preview) but the badge is labeled as preview-only; **high** = engine refuses to issue on static and requires dynamic (server-signed) edition.

| # | badge_id | name | family | verification_mode | public claim (abridged) | required evidence (components, floors, critical competencies) | Claim strength | Tamper resistance (static) | Notes |
|---|----------|------|--------|-------------------|------------------------|---------------------------------------------------------------|----------------|----------------------------|-------|
| 1 | `progress_phase0_walked` | Phase 0 — Foundations Walked | progress | local_only | "completed all 13 sections of Phase 0… including the You Do project and self-check for each section" | 1 component (`section_completion`, 100%); 0 critical competencies; min-overall = 0 (n/a) | appropriate | low — `finalizeProgress()` returns `STATE_AWARDED` on static if YOUDO activities are present in localStorage | Non-claim explicitly says "motivational marker, NOT proof of proficiency" |
| 2 | `progress_phase1_walked` | Phase 1 — Independent Walked | progress | local_only | "completed all 13 sections of Phase 1… including the You Do project, self-check, and section exam for each section" | 1 component (`section_completion`); 0 critical competencies | appropriate | low | — |
| 3 | `progress_phase2_walked` | Phase 2 — Advanced Walked | progress | local_only | "completed all 13 sections of Phase 2…" | 1 component (`section_completion`); 0 critical competencies | appropriate | low | — |
| 4 | `progress_phase3_walked` | Phase 3 — **Mastery** Walked | progress | local_only | "completed all 13 sections of Phase 3 (Integrated **Mastery**)…" | 1 component (`section_completion`); 0 critical competencies | **too strong (name only)** — the badge NAME contains "Mastery", which the catalog's own non-claim disclaims: *"Does not authorize use of the word 'Master' or 'Senior' in any occupational context"* | low | The non-claim is internally consistent but the badge name itself leaks the very word the non-claim forbids the learner from using. Recommend renaming to "Phase 3 — Integrated Walked" or "Phase 3 — Synthesis Walked". |
| 5 | `progress_journey_completed` | PyArcana Journey Completed | progress | local_only | "walked all 52 sections of PyArcana and completed every You Do, self-check, and section exam, plus every phase-level capstone" | 1 component (`section_completion`); 0 critical competencies; prereqs = all 4 phase-walked badges | appropriate | low | — |
| 6 | `python_data_foundations` | Python Data Foundations | competency (applied_skill) | server_verified | "independently demonstrated bounded Python fundamentals — interpreter setup, version control with Git, modules and functions, idiomatic Python patterns, OOP basics, and a working test discipline — by passing section exams and completing section You Do projects above the provisional floor" | 4 components (`self_check`≥85%, `you_do_projects`≥80%, `section_exams`≥85%, `integrator_project`≥85%); 1 critical competency (`reproducibility_determinism`=100%); min-overall = 85%; non-compensatory gates | appropriate | medium — engine returns `STATE_ELIGIBLE_PENDING_VERIFICATION` (preview only) on static; `STATE_AWARDED` only on dynamic edition | — |
| 7 | `independent_data_preparation` | Independent Data Preparation | competency (applied_skill) | server_verified | "independently demonstrated data preparation competency…" | 4 components; 1 critical competency (`reproducibility_determinism`) | appropriate | medium | — |
| 8 | `applied_analytical_reasoning` | Applied Analytical Reasoning | competency (applied_skill) | server_verified | "independently demonstrated applied analytical reasoning…" | 4 components; 1 critical competency (`reproducibility_determinism`) | appropriate | medium | — |
| 9 | `reliable_automation_development` | Reliable Automation Development | competency (applied_skill) | server_verified | "independently demonstrated reliable browser-automation development…" | 4 components; 2 critical competencies (`selector_resilience`, `reproducibility_determinism`) | appropriate | medium | Non-claim explicitly scopes selector-resilience to "a documented UI change scenario, not against an enterprise-scale deployment" |
| 10 | `applied_sql_query_development` | Applied SQL Query Development | competency (applied_skill) · **pilot** | server_verified | "independently demonstrated applied SQL competency — SELECT/JOIN/GROUP BY, ORM-mapped queries, window functions and CTEs…" | 4 components; 1 critical competency (`sql_competency`); 1 gap-affected competency (`sql_competency`) → engine Gate 7 requires a supplementary exercise | appropriate — non-claim explicitly says "SQL performance tuning NOT included; pilot status until Phase 4 closes the gap" | medium | Engine enforces the supplementary-exercise gate at lines 383–408 |
| 11 | `production_python_delivery_foundations` | Production Python Delivery Foundations | competency (applied_skill) · **pilot** | server_verified | "independently demonstrated production-ready Python delivery foundations — packaging, CI/CD, FastAPI service design, and a working test discipline…" | 4 components; 2 critical competencies (`type_safety_production_hardening`, `reproducibility_determinism`); 1 gap-affected (`type_safety_production_hardening`) | appropriate — non-claim: "Does NOT include static type checking with mypy/Pyright" | medium | — |
| 12 | `responsible_machine_learning_evaluation` | Responsible Machine Learning Evaluation | competency (applied_skill) · **pilot** | server_verified | "independently demonstrated responsible ML evaluation…" | 4 components; 2 critical competencies (`leakage_prevention`, `reproducibility_determinism`); 1 gap-affected (`leakage_prevention`) | appropriate — non-claim: "Does NOT include data leakage prevention as a graded skill" | medium | The badge name contains "Responsible" but the curriculum admits leakage prevention is not yet graded. The non-claim discloses this; the claim is therefore bounded. Still, "Responsible ML Evaluation" with leakage prevention as a known gap is borderline — recommend renaming to "ML Evaluation Practice" until the gap closes. |
| 13 | `applied_rag_llm_service_development` | Applied RAG and LLM Service Development | competency (applied_skill) | server_verified | "independently demonstrated applied RAG and LLM service development…" | 4 components; 1 critical competency (`reproducibility_determinism`) | appropriate | medium | Non-claim: "Does not claim the LLM is 'safe' or 'aligned' — only that the service architecture is sound" |
| 14 | `reliable_async_python_development` | Reliable Async Python Development | competency (applied_skill) | server_verified | "independently demonstrated reliable async Python development…" | 4 components; 1 critical competency (`reproducibility_determinism`) | appropriate | medium | — |
| 15 | `applied_mlops_pipeline_delivery` | Applied MLOps Pipeline Delivery | competency (applied_skill) | server_verified | "independently demonstrated applied MLOps pipeline delivery…" | 4 components; 2 critical competencies (`mlops_fluency`, `reproducibility_determinism`); `mlops_fluency` is NOT in `GAP_AFFECTED_COMPETENCIES` (per `types.ts:92`) | appropriate | medium | Note: `mlops_fluency` is treated as a fully-graded competency (gap_affected = false) |
| 16 | `production_python_hardening_practice` | Production Python Hardening Practice | competency (applied_skill) · **pilot** | server_verified | "independently demonstrated production Python hardening…" | 4 components; 2 critical competencies (`type_safety_production_hardening`, `reproducibility_determinism`); 1 gap-affected (`type_safety_production_hardening`) | appropriate | medium | Non-claim explicitly disclaims Senior Engineer certification |
| 17 | `applied_deep_learning_practice` | Applied Deep Learning Practice | competency (applied_skill) · **pilot** | server_verified | "independently demonstrated applied deep-learning practice…" | 4 components; 2 critical competencies (`leakage_prevention`, `reproducibility_determinism`); 1 gap-affected (`leakage_prevention`) | appropriate | medium | — |
| 18 | `architecture_decision_practice` | Architecture Decision Practice | competency (applied_skill) | server_verified | "independently demonstrated architecture-decision practice — system design, DDD decisions, code-review literacy, and tradeoff articulation…" | 4 components; 3 critical competencies (`business_framing_judgment`, `communication_audience_tuned`, `reproducibility_determinism`) | appropriate | medium | Non-claim: "Does not certify the learner as a Senior Engineer, Staff Engineer, or Architect" |
| 19 | `llmops_production_delivery` | LLMOps Production Delivery | competency (applied_skill) | server_verified | "independently demonstrated LLMOps production delivery — fine-tuning, graph-RAG, drift monitoring, observability…" | 4 components; 2 critical competencies (`mlops_fluency`, `reproducibility_determinism`) | appropriate | medium | — |
| 20 | `container_platform_engineering_practice` | Container Platform Engineering Practice | competency (applied_skill) · **pilot** | server_verified | "independently demonstrated container-platform engineering practice — Docker, Kubernetes, CI/CD, cloud platforms, and GPU performance tuning…" | 4 components; 2 critical competencies (`type_safety_production_hardening`, `reproducibility_determinism`); 1 gap-affected (`type_safety_production_hardening`) | appropriate | medium | — |
| 21 | `ai_governance_code_review_practice` | AI Governance and Code Review Practice | competency (applied_skill) | server_verified | "independently demonstrated AI-governance and code-review practice…" | 4 components; 3 critical competencies (`business_framing_judgment`, `communication_audience_tuned`, `reproducibility_determinism`) | appropriate | medium | Non-claim: "Does not include formal legal/compliance sign-off authority" |
| 22 | `integrated_data_analyst_practice` | Integrated Data Analyst Practice | competency (cross_section_capability) | server_verified | "independently synthesized Python data foundations, independent data preparation, applied analytical reasoning, and applied SQL query development into a single integrated Data Analyst-style project…" | 4 components; 4 critical competencies (`sql_competency`, `reproducibility_determinism`, `communication_audience_tuned`, `business_framing_judgment`); prereqs include `applied_sql_query_development` (pilot) | **borderline too strong** — the badge name "Integrated Data Analyst Practice" uses the role title "Data Analyst"; the public claim mitigates this with "-style project", but the badge name does not. The non-claim says "Does not certify the learner as a Data Analyst at any seniority level" — so the name and the non-claim are in tension. | medium | Recommend renaming to "Integrated Data Analyst-style Practice" or "Integrated Data Analysis Practice" (drop the noun-of-role) |
| 23 | `integrated_data_science_practice` | Integrated Data Science Practice | competency (cross_section_capability) · **pilot** | server_verified | "independently synthesized Python data foundations, independent data preparation, applied analytical reasoning, applied SQL query development, and responsible ML evaluation into a single integrated Data-Science-style project…" | 4 components; 5 critical competencies (`sql_competency`, `leakage_prevention`, `reproducibility_determinism`, `communication_audience_tuned`, `business_framing_judgment`); 2 gap-affected (`sql_competency`, `leakage_prevention`) | borderline too strong (same role-noun issue as #22) | medium | Same recommendation as #22 |
| 24 | `integrated_ml_engineering_practice` | Integrated ML Engineering Practice | competency (cross_section_capability) · **pilot** | server_verified | "independently synthesized Python data foundations, applied analytical reasoning, responsible ML evaluation, RAG/LLM service development, and applied MLOps pipeline delivery into a single integrated ML-Engineering-style project…" | 4 components; 5 critical competencies (`leakage_prevention`, `mlops_fluency`, `reproducibility_determinism`, `communication_audience_tuned`, `business_framing_judgment`); 1 gap-affected (`leakage_prevention`) | borderline too strong (same role-noun issue) | medium | Same recommendation |
| 25 | `integrated_automation_engineering_practice` | Integrated Automation Engineering Practice | competency (cross_section_capability) | server_verified | "independently synthesized Python data foundations, reliable automation development, and RAG/LLM service development into a single integrated Automation-Engineering-style project…" | 4 components; 4 critical competencies (`selector_resilience`, `reproducibility_determinism`, `communication_audience_tuned`, `business_framing_judgment`); 1 gap-affected (`selector_resilience`) | borderline too strong (same role-noun issue) | medium | Same recommendation |
| 26 | `integrated_production_python_practice` | Integrated Production Python Practice | competency (cross_section_capability) · **pilot** | server_verified | "independently synthesized Python data foundations, production Python delivery foundations, reliable async Python development, and production Python hardening practice into a single integrated Production-Python-style service…" | 4 components; 4 critical competencies (`type_safety_production_hardening`, `reproducibility_determinism`, `communication_audience_tuned`, `business_framing_judgment`); 1 gap-affected (`type_safety_production_hardening`) | appropriate (the "-style service" qualifier plus the absence of a single industry role noun keeps this one appropriate) | medium | — |
| 27 | `integrated_python_ai_capstone_foundations` | Integrated Python and AI Capstone — Foundations | verified (capstone_credential) | server_verified | "completed and defended the three Phase 0 capstones (CP-N1-A, CP-N1-B, CP-N1-C) at rubric performance above the provisional floor, with a synthesis writeup demonstrating foundational-level capability across Python, data, automation, and visualization" | 5 components (`self_check`, `you_do_projects`, `section_exams`, `integrator_project`, **`defense`=100%**); 2 critical competencies (`reproducibility_determinism`, `communication_audience_tuned`); min-overall = 85% | appropriate | **high** — engine returns `STATE_ELIGIBLE_PENDING_VERIFICATION` with `eligible=false` on static; capstones cannot be earned on static edition (engine lines 457–471) | Foundational level explicitly defined as "can apply with guidance"; not "Junior" or "Entry-level" |
| 28 | `integrated_python_ai_capstone_independent` | Integrated Python and AI Capstone — Independent | verified (capstone_credential) | server_verified | "completed and defended the three Phase 1 capstones (CP-N2-A, CP-N2-B, CP-N2-C)…" | 5 components; 3 critical competencies (`reproducibility_determinism`, `communication_audience_tuned`, `business_framing_judgment`) | appropriate | high | Independent-practitioner level = "can apply independently within a pre-scoped problem" |
| 29 | `integrated_python_ai_capstone_advanced_applied` | Integrated Python and AI Capstone — Advanced Applied | verified (capstone_credential) | server_verified | "completed and defended the three Phase 2 capstones (CP-N3-A, CP-N3-B, CP-N3-C)…" | 5 components; 4 critical competencies (`reproducibility_determinism`, `communication_audience_tuned`, `business_framing_judgment`, `mlops_fluency`) | appropriate | high | Advanced-applied level = "can diagnose and design within an existing system" |
| 30 | `integrated_python_ai_capstone_integrated_mastery` | Integrated Python and AI Capstone — Integrated **Mastery** | verified (capstone_credential) | server_verified | "completed and defended the three Phase 3 capstones (CP-N4-A, CP-N4-B, CP-N4-C)… demonstrating integrated-mastery-level capability…" | 5 components; 4 critical competencies (`reproducibility_determinism`, `communication_audience_tuned`, `business_framing_judgment`, `mlops_fluency`) | **too strong (name only)** — the badge name contains "Mastery", which the catalog's own non-claim disclaims: *"'Integrated mastery' here is a curriculum-internal label… It is NOT an industry seniority title."*; the non-claim also says the learner must not be called "Master, Senior, Staff, Principal, or Distinguished Engineer" | high | Same recommendation as #4: rename to "Integrated Synthesis Capstone" or "Integrated Capstone — Synthesis". The non-claim is internally consistent, but the badge name leaks the very word the non-claim forbids the learner from using on a resume. |
| 31 | `evidence_grounded_ai_systems_capstone` | Evidence-Grounded AI Systems Capstone | verified (capstone_credential) | server_verified | "completed and defended CP-FINAL… at rubric performance above the provisional floor, with explicit evidence-grounded defense of every critical competency in the PyArcana stack: SQL, leakage prevention, selector resilience, type safety + production hardening, MLOps fluency, business framing, communication, and reproducibility" | 5 components; **8 critical competencies** (all of them); prereqs = 6 prior credentials (4 capstones + 2 integrated) | appropriate — the final capstone explicitly requires supplementary exercises for gap-affected competencies (per non-claim) | high | Non-claim: "Where the curriculum has known gaps… the learner must demonstrate the competency via a supplementary independent exercise specified in the badge rubric. The credential explicitly notes which competencies were assessed via curriculum evidence vs. supplementary exercise." Engine enforces the supplementary-exercise gate at lines 383–408, but ONLY for `spec.status === 'pilot'`; this badge is `active`, not `pilot` — so the engine does NOT automatically enforce the supplementary-exercise gate for the final capstone. **The supplementary-exercise enforcement is delegated to the rubric and the server-side badge service, not the engine itself.** This is a tamper-resistance gap if the server-side service is not yet implemented. |

### 2.3 Cross-cutting observations on the badge system

1. **Tamper-resistance model is well-designed for the static edition.** The engine returns `STATE_ELIGIBLE_PENDING_VERIFICATION` (preview only) for competency badges on static, and refuses to issue capstone credentials at all on static (engine lines 453–471). The catalog declares `verification_mode: server_verified` for all 26 non-progress badges, and the engine's static-edition behaviour matches that declaration. On the static edition, localStorage manipulation can produce a *preview* state but cannot produce an `awarded` state.

2. **Tamper-resistance gap on the dynamic edition.** The engine models the server-signed state by returning `STATE_AWARDED` whenever a dynamic caller passes all gates (engine lines 487–498). The actual cryptographic signing is delegated to a future `src/lib/badge/state_machine.ts` that is not yet present (per `src/lib/eligibility/index.ts:22-24` comment: *"future Phase"*). Until that service exists, a dynamic-edition caller can call `evaluate()` and receive `STATE_AWARDED` without any server-side signing. This is acceptable as an engine contract but means the tamper resistance of the dynamic edition is currently equal to the trust model of whatever API route calls the engine.

3. **Non-compensatory critical competencies are correctly enforced.** Engine Gate 6 (lines 331–381) requires every criterion of every critical competency to score 100%, with `passesFloor` using `roundDown` for conservative rounding. The `PROVISIONAL_FLOORS.critical_competency_pct = 100` constant matches the catalog. This is the strongest gate in the engine and is implemented correctly.

4. **Gap-affected competency gate is only enforced for `pilot` badges.** Engine Gate 7 (lines 383–408) requires a supplementary exercise for gap-affected competencies, but ONLY when `spec.status === 'pilot'`. The final capstone `evidence_grounded_ai_systems_capstone` (status = `active`) has 8 critical competencies, several of which are gap-affected (`sql_competency`, `leakage_prevention`, `selector_resilience`, `type_safety_production_hardening`), but the engine does NOT enforce supplementary exercises for it. The badge's own non-claim says the learner must complete supplementary exercises for these gaps; the enforcement is delegated to the rubric / server-side service. **This is a documented engine-vs-rubric contract gap** — if the server-side service naively trusts the engine's `eligible=true` for the final capstone, a learner could be awarded the credential without the supplementary exercises.

5. **`progress_phase3_walked` (badge #4) and `integrated_python_ai_capstone_integrated_mastery` (badge #30)** both contain the word "Mastery" in their names. The catalog's own non-claims explicitly disclaim "Mastery" / "Master" as an industry seniority title. The names are therefore in tension with the non-claims. The public claims themselves are appropriate (the body of the public claim does not use "mastery" in an industry-seniority sense), but the badge names leak the forbidden word. **Recommend renaming both badges** in a future catalog version. This is a claim-strength issue at the *name* level, not the *public-claim* level.

6. **Five cross-section-capability badges (#22–#26) use role nouns in their names** ("Data Analyst", "Data Science", "ML Engineering", "Automation Engineering", "Production Python"). The public claims mitigate this with the "-style project" qualifier, and the non-claims explicitly disclaim role certification. The names are therefore borderline appropriate — they are recognizable to learners and employers as a topical anchor, and the disclaimers are explicit. **Recommend keeping the names but adding the suffix "-style Practice" uniformly** (e.g. "Integrated Data Analyst-style Practice") to match the qualifier already used in the public claim.

7. **All 26 non-progress badges declare `verification_mode: server_verified`.** The engine honours this on the static edition (returns preview-only) and models it on the dynamic edition (returns `awarded`). There is **no badge in the catalog that is `competency_badge` or `verified_credential` with `verification_mode: local_only`** — the only `local_only` badges are the 5 `progress_achievement` markers. This is a clean taxonomy.

8. **All 26 non-progress badges use non-compensatory critical competencies** (at least one `critical_competency` per badge). The 5 progress badges have zero critical competencies, which is appropriate for motivational markers.

---

## 3. Summary

### 3.1 Disclaimer inventory summary

| Metric | Count |
|--------|-------|
| Total disclaimers inventoried (rows 1–58 with classification) | **58** |
| Rows confirmed out-of-scope (no inline disclaimer; rows 59–64) | 6 |
| `essential-and-placed` (canonical or appropriately placed) | 24 |
| `essential-but-verbose` | 1 (row 21 — `LegalDisclaimer.tsx:116-118`) |
| `duplicated` (re-stated in 2+ places, including the canonical home) | **27** rows are flagged `duplicated` (often alongside another classification) |
| `negative-framing` (mild; "make no employment promises" phrasing) | 1 (row 5) |
| `legal-policy-centralizable` (could be replaced with a cross-link to a single canonical legal page) | 9 (rows 7, 8, 17, 18, 19, 20, 21, 23, 30, 35, 46, 47, 49, 51, 52, 57, 58 — counted as the set of rows where this is the primary recommendation) |
| `static-dynamic-boundary` (legitimate per-context duplication) | 9 (rows 1, 3, 4, 11, 13, 37, 44, 51, plus row 16 i18n) |
| `privacy-consent` | 6 (rows 2, 14, 18, 43, 44, 52) |
| `obsolete` | 0 |
| `contradictory` | 0 (no two disclaimers contradict each other) |
| `unsupported-claim` | 3 (rows 25, 26, 27 — all in `PdfReport.tsx`) |
| **Recommend `centralize-to-policy`** | 16 rows |
| **Recommend `remove-duplicate`** | 6 rows (9, 10, 34, 48, 53, 54, 55, 56 — counting each duplicated inline "Este documento es informativo…" footer) |
| **Recommend `shorten`** | 2 rows (21, 58) |
| **Recommend `convert-to-positive`** | 2 rows (25, 26) |
| **Recommend `fix-contradiction`** | 1 row (26 — the certificate's "dominio" claim contradicts the badge-catalog's no-mastery design constraint) |
| **Recommend `keep`** | 30 rows |

**Headline metrics for the report-back:**
- Disclaimers inventoried: **58**
- Duplicated or verbose (i.e. rows with classification `duplicated` OR `essential-but-verbose`): **28** (27 duplicated + 1 verbose)
- Should be centralized (recommendation = `centralize-to-policy`): **16**
- Unsupported claims (rows 25, 26, 27 in `PdfReport.tsx`): **3**

### 3.2 Badge audit summary

| Metric | Count |
|--------|-------|
| Total badges audited | **31** |
| Family: progress_achievement (local_achievement) | 5 |
| Family: applied_skill (competency_badge) | 16 |
| Family: cross_section_capability (competency_badge) | 5 |
| Family: capstone_credential (verified_credential) | 5 |
| Claim strength: appropriate | 24 |
| Claim strength: **too strong (name only)** | 2 (`progress_phase3_walked`, `integrated_python_ai_capstone_integrated_mastery` — both leak "Mastery" in the badge name) |
| Claim strength: **borderline too strong (role-noun in name)** | 4 (`integrated_data_analyst_practice`, `integrated_data_science_practice`, `integrated_ml_engineering_practice`, `integrated_automation_engineering_practice` — role nouns mitigated by "-style project" in the public claim) |
| Claim strength: too weak | 0 |
| Tamper resistance: low (static; localStorage can produce) | 5 (all `progress_achievement`) |
| Tamper resistance: medium (static; preview-only; awarded on dynamic) | 21 (all `competency_badge`) |
| Tamper resistance: high (static; engine refuses to issue; awarded on dynamic only) | 5 (all `capstone_credential`) |
| Badges with non-compensatory critical competencies | 26 (all non-progress badges) |
| Badges with `verification_mode: server_verified` | 26 (all non-progress badges) |
| Badges with `verification_mode: local_only` | 5 (all progress badges) |
| Badges with `status: pilot` (gap-affected; supplementary-exercise gate enforced by engine) | 9 |
| Badges with `status: active` | 21 |
| Badges with `status: retired` or `superseded` | 0 |
| Engine-vs-rubric contract gaps identified | 1 (the final capstone `evidence_grounded_ai_systems_capstone` has 8 critical competencies, some gap-affected, but the engine does not enforce supplementary exercises for it because it is `active` not `pilot`; enforcement is delegated to the rubric / future server-side service) |

**Headline metrics for the report-back:**
- Badges audited: **31**
- Badges with claim-strength issues (too strong at the name level, despite appropriate public-claim text and non-claims): **6** (2 "Mastery" name leaks + 4 role-noun-in-name cases)
- Badges with engine-vs-rubric contract gaps (claim requires supplementary exercises that the engine does not enforce): **1** (`evidence_grounded_ai_systems_capstone`)

---

## 4. Recommended credential taxonomy mapping

The catalog already implements a clean 4-tier taxonomy. The mapping below clarifies which current badges fall into each tier, with the recommended **action** per badge to align name, public claim, and engine enforcement.

### Tier A — Milestone (local, motivational, browser-issued)

**Definition:** Marker that the learner walked a section/phase. No proficiency claim. Issued locally on both editions; never expires; no critical competencies.

| badge_id | Current name | Recommended action |
|----------|--------------|--------------------|
| `progress_phase0_walked` | Phase 0 — Foundations Walked | keep |
| `progress_phase1_walked` | Phase 1 — Independent Walked | keep |
| `progress_phase2_walked` | Phase 2 — Advanced Walked | keep |
| `progress_phase3_walked` | Phase 3 — **Mastery** Walked | **rename** to "Phase 3 — Integrated Walked" or "Phase 3 — Synthesis Walked" (the word "Mastery" leaks a seniority title the non-claim forbids) |
| `progress_journey_completed` | PyArcana Journey Completed | keep |

### Tier B — Assessed (competency, server-verified, single-skill)

**Definition:** Bounded competency badge requiring independent You Do projects, section exams, an integrator exercise, all above 85% (or 80% for You Do), with at least one non-compensatory critical competency at 100%. Server-verified; preview-only on static.

| badge_id | Current name | Recommended action |
|----------|--------------|--------------------|
| `python_data_foundations` | Python Data Foundations | keep |
| `independent_data_preparation` | Independent Data Preparation | keep |
| `applied_analytical_reasoning` | Applied Analytical Reasoning | keep |
| `reliable_automation_development` | Reliable Automation Development | keep |
| `applied_sql_query_development` | Applied SQL Query Development (pilot) | keep — pilot status and gap disclosure are correct |
| `production_python_delivery_foundations` | Production Python Delivery Foundations (pilot) | keep |
| `responsible_machine_learning_evaluation` | Responsible Machine Learning Evaluation (pilot) | **consider rename** to "ML Evaluation Practice" — the word "Responsible" is in tension with the leakage-prevention gap; the non-claim discloses the gap, but the name still implies a responsibility the curriculum cannot yet grade |
| `applied_rag_llm_service_development` | Applied RAG and LLM Service Development | keep |
| `reliable_async_python_development` | Reliable Async Python Development | keep |
| `applied_mlops_pipeline_delivery` | Applied MLOps Pipeline Delivery | keep |
| `production_python_hardening_practice` | Production Python Hardening Practice (pilot) | keep |
| `applied_deep_learning_practice` | Applied Deep Learning Practice (pilot) | keep |
| `architecture_decision_practice` | Architecture Decision Practice | keep |
| `llmops_production_delivery` | LLMOps Production Delivery | keep |
| `container_platform_engineering_practice` | Container Platform Engineering Practice (pilot) | keep |
| `ai_governance_code_review_practice` | AI Governance and Code Review Practice | keep |

### Tier C — Integrated (competency, server-verified, cross-section synthesis)

**Definition:** Cross-section synthesis project requiring 3–5 prerequisite Tier-B badges, 4 non-compensatory critical competencies, and a single integrator project with documented business framing, reproducibility, and audience-tuned writeup.

| badge_id | Current name | Recommended action |
|----------|--------------|--------------------|
| `integrated_data_analyst_practice` | Integrated Data Analyst Practice | **consider rename** to "Integrated Data Analyst-style Practice" (the role noun is mitigated by "-style project" in the public claim but not in the name) |
| `integrated_data_science_practice` | Integrated Data Science Practice (pilot) | **consider rename** to "Integrated Data-Science-style Practice" |
| `integrated_ml_engineering_practice` | Integrated ML Engineering Practice (pilot) | **consider rename** to "Integrated ML-Engineering-style Practice" |
| `integrated_automation_engineering_practice` | Integrated Automation Engineering Practice | **consider rename** to "Integrated Automation-Engineering-style Practice" |
| `integrated_production_python_practice` | Integrated Production Python Practice (pilot) | keep (no single role noun; "Production Python" is a topic, not a role) |

### Tier D — Verified (capstone credential, server-issued, defended synthesis)

**Definition:** Verified credential requiring 3 phase capstones (or the cross-curriculum CP-FINAL), a defense component at 100%, and 2–8 non-compensatory critical competencies. Cannot be earned on static edition; engine refuses and returns `eligible_pending_verification` with `eligible=false`. Server-signed on dynamic edition.

| badge_id | Current name | Recommended action |
|----------|--------------|--------------------|
| `integrated_python_ai_capstone_foundations` | Integrated Python and AI Capstone — Foundations | keep |
| `integrated_python_ai_capstone_independent` | Integrated Python and AI Capstone — Independent | keep |
| `integrated_python_ai_capstone_advanced_applied` | Integrated Python and AI Capstone — Advanced Applied | keep |
| `integrated_python_ai_capstone_integrated_mastery` | Integrated Python and AI Capstone — Integrated **Mastery** | **rename** to "Integrated Python and AI Capstone — Synthesis" or "Integrated Python and AI Capstone — Integrated" (the word "Mastery" leaks a seniority title the non-claim explicitly forbids) |
| `evidence_grounded_ai_systems_capstone` | Evidence-Grounded AI Systems Capstone | **close the engine-vs-rubric gap**: extend Gate 7 to enforce supplementary exercises for gap-affected critical competencies even when `spec.status === 'active'`, OR add an explicit `requires_supplementary_exercises: string[]` field to the spec and gate on it. Currently the engine trusts the rubric/server to enforce this, which is a tamper-resistance gap on the dynamic edition if the future `src/lib/badge/state_machine.ts` is not yet implemented. |

### Tier mapping summary

| Tier | Count | Verification | Engine gate | Tamper resistance (static) |
|------|-------|--------------|-------------|----------------------------|
| A — Milestone | 5 | local_only | activities present | low (acceptable for motivational markers) |
| B — Assessed | 16 | server_verified | 4 components + ≥1 critical competency @ 100% + overall ≥ 85% | medium (preview-only on static) |
| C — Integrated | 5 | server_verified | 4 components + 4–5 critical competencies @ 100% + overall ≥ 85% + 3–5 prereq Tier-B badges | medium (preview-only on static) |
| D — Verified | 5 | server_verified | 5 components (incl. defense @ 100%) + 2–8 critical competencies @ 100% + overall ≥ 85% + 2–6 prereqs (mix of Tier-A, B, C) | high (engine refuses on static; awarded only on dynamic) |

---

## 5. Next actions (prioritized)

1. **Highest priority — fix `PdfReport.tsx` certificate body (rows 26–27).** The printable certificate grants "dominio de Python para Data Analysis y Data Science" to any learner who completes ≥8 sections, which contradicts every other credential claim in the platform. Replace with bounded language ("registro de progreso", not "certificación profesional"; "completó N secciones con el método I Do / We Do / You Do", not "demostrando dominio"). Also remove the hard-coded "70h+ Contenido" / "11 Proyectos" stats (compute from `data.progress` or omit).

2. **High priority — fix `PdfReport.tsx:289` and `i18n.ts:158/421` (row 25).** Replace "Ideal para mostrar a empleadores" with "Ideal para tu portafolio personal" or "Ideal para tu registro de aprendizaje".

3. **High priority — rename two badges that leak "Mastery" (badge-audit rows 4 and 30).** `progress_phase3_walked` and `integrated_python_ai_capstone_integrated_mastery` both contain "Mastery" in their names, which the catalog's own non-claims forbid the learner from using. A catalog version bump (1.0.0 → 1.1.0) is required; the engine's `catalogVersion` check will prevent silent spec drift.

4. **Medium priority — close the engine-vs-rubric contract gap for `evidence_grounded_ai_systems_capstone` (badge-audit row 31).** Extend engine Gate 7 to enforce supplementary exercises for gap-affected critical competencies regardless of `spec.status`, or add a `requires_supplementary_exercises` field to `BadgeSpec` and gate on it.

5. **Medium priority — centralize the "no vendemos ni compartimos tus datos" duplication (disclaimer rows 2, 14, 18, 43, 44, 52).** Pick `/privacy` as the canonical home; replace the 5 inline copies with a one-line cross-link.

6. **Medium priority — remove the 4 inline "Este documento es informativo…" footers (disclaimer rows 53–56)** in `/data-rights`, `/security`, `/acceptable-use`, `/external-resources`. The `LegalPage` wrapper at `LegalPage.tsx:39-41` already appends this footer.

7. **Low priority — shorten the `LegalDisclaimer.tsx:116-118` standards list (disclaimer row 21).** The four standards (GDPR, CCPA, OWASP, NIST) can be a single line; the "consulta con un profesional acreditado" sentence is already in every legal-page footer.

8. **Low priority — consider renaming the 4 cross-section-capability badges that use role nouns (badge-audit rows 22–25)** to add the "-style Practice" suffix uniformly, matching the qualifier already used in the public claim. This is a cosmetic alignment, not a claim-strength fix (the non-claims already disclaim role certification).

9. **Low priority — unify the two legal-page wrapper footers (disclaimer rows 57 and 58).** `LegalPage.tsx:39-41` and `LegalPageShell.tsx:108-109` both append a "this document is informational" footer with slightly different copy. Pick one canonical sentence and use it in both wrappers.

---

**End of audit.**
