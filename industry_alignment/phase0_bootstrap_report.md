# Phase 0 — Bootstrap and Repository Reality Check

**Project:** PyArcana industry-alignment campaign
**Orchestrator node:** phase0-orchestrator
**Phase started:** 2026-07-28T20:10:00Z
**Phase completed:** 2026-07-28T20:30:00Z
**Repository:** /home/z/my-project/pyarcana_repo
**Live site:** https://pillb.github.io/pyarcana/

This is a pure inventory report. No curriculum content was modified. Every
claim below is backed by an evidence artifact in
`industry_alignment/evidence_registry.jsonl` (entries `EV-P0-0001` through
`EV-P0-0027`).

---

## 1. Repository state

### Current commit and branch

| Field | Value | Evidence |
|---|---|---|
| Local branch (HEAD) | `fixer-wave-s01-s09-remediation` | `git rev-parse --abbrev-ref HEAD` |
| Local HEAD SHA | `84aa9e4da8c905b1ac4bad7d6916ccf23a3498ae` | `git rev-parse HEAD` |
| Local `main` SHA | `84aa9e4da8c905b1ac4bad7d6916ccf23a3498ae` (1 commit behind origin/main) | `git rev-parse main` |
| Remote `origin` URL | `https://github.com/PillB/pyarcana.git` | `git remote -v` |
| `origin/main` SHA | `316fc145d7199545c1836484fa15646f4cbb7564` | `git rev-parse origin/main` |
| Live site SHA (estimated) | `316fc145d7199545c1836484fa15646f4cbb7564` (matches `origin/main`) | deploy.yml builds on push to main |
| Recent local commits | `84aa9e4 fix(S07)…`, `0b8f71f fix(S08-S09)…`, `e29a6b7 fix(S04-S06)…`, `79da13d fix(S01-S03)…`, `eec0335 Merge pull request #16 …` | `git log -5 --oneline` |

### Live site / repository synchronization

The live site is **1 merge commit ahead** of the local checkout. The local
HEAD branch `fixer-wave-s01-s09-remediation` was merged into `origin/main`
via **PR #17** ("Merge pull request #17 from PillB/fixer-wave-s01-s09-remediation",
SHA `316fc14`). The local `main` branch was not fast-forwarded to that merge
commit.

Concretely:

```
git log --oneline HEAD..origin/main
316fc14 Merge pull request #17 from PillB/fixer-wave-s01-s09-remediation
```

```
git log --oneline origin/main..HEAD
(empty)
```

Implication for any subsequent phase: changes made from this checkout must
rebase onto or merge from `origin/main` to align with what users currently
see at the live URL.

### Deployment mechanism

| Item | Value | Source |
|---|---|---|
| Host | GitHub Pages | `.github/workflows/deploy.yml` |
| Workflow trigger | `push` to `main` + `workflow_dispatch` | `deploy.yml` lines 3-6 |
| Build runner | `ubuntu-latest`, Node 22, Bun 1.3.4 | `deploy.yml` lines 19-31 |
| Build command | `bun run build:static` | `deploy.yml` line 37 |
| Build env | `NEXT_PUBLIC_BASE_PATH=/pyarcana` | `deploy.yml` line 39 |
| Artifact upload | `actions/upload-pages-artifact@v3`, path `./out` | `deploy.yml` lines 41-44 |
| Deploy action | `actions/deploy-pages@v4` | `deploy.yml` lines 53-55 |
| Concurrency | `group: pages`, `cancel-in-progress: true` | `deploy.yml` lines 13-15 |
| Permissions | `contents: read`, `pages: write`, `id-token: write` | `deploy.yml` lines 8-11 |

The static export is built by `scripts/build_static_export.mjs` in a
disposable `mkdtempSync` workspace. The disposable copy's `src/app/api`
directory is removed with `rmSync` (line 37) so that Next.js cannot attempt
to compile server routes into the static export. The tracked working tree is
**never mutated** — only the disposable copy. This contract is enforced by
`tests/adversarial/test_static_export_guard.py`, which fails the CI build if
the static-export script ever uses `renameSync`, sets `ignoreBuildErrors`,
references `z-cdn.chatglm.cn`, or omits the `mkdtempSync` + `rmSync(api)`
pair.

A separate CI workflow (`.github/workflows/tests.yml`) runs on push to
`main`/`develop` and on PRs to `main`. It has six jobs: `lint`, `typecheck`,
`adversarial-unit`, `platform-builds` (matrix: `dynamic` + `static`),
`regression-content`, and `regression-browser`.

---

## 2. Curriculum sources — all 52 canonical sections

### Canonical course index

`src/lib/course/index.ts` (95 lines) imports exactly 52 section objects:

- Lines 2-56: `import { section01 } from './sections/s01-setup'` …
  `import { section52 } from './sections/s52-career-strategy'`.
- Line 63: `COURSE_META.totalSections: 52`.
- Lines 68-81: `COURSE_SECTIONS` array contains all 52 section constants,
  grouped by phase (Phase 0 = S01-S13, Phase 1 = S14-S26, Phase 2 = S27-S39,
  Phase 3 = S40-S52).
- Line 64: `totalHours: 1040`.

### Per-section metadata

All 52 canonical section files are importable and live under
`src/lib/course/sections/`. The table below records the canonical metadata
extracted from each file's `sectionNN` export (lines 4-13 of each file
declare: `id`, `index`, `title`, `shortTitle`, `tagline`, `estimatedHours`,
`level`, `phase`, `icon`).

| # | filename | id | title | shortTitle | phase | level | estimatedHours |
|---|---|---|---|---|---|---|---|
| 1 | s01-setup.ts | setup | Entorno reproducible y trabajo seguro | Entorno reproducible | 0 | Principiante | 18 |
| 2 | s02-basics.ts | basics | Valores, tipos, operadores e I/O | Valores y tipos | 0 | Principiante | 18 |
| 3 | s03-data-structures.ts | data-structures | Decisiones y reglas de validación | Decisiones & Reglas | 0 | Principiante | 18 |
| 4 | s04-functions-modules.ts | functions-modules | Iteración y resúmenes transaccionales | Iteración & Resúmenes | 0 | Principiante | 18 |
| 5 | s05-oop.ts | oop | Funciones, contratos y descomposición | Funciones & Contratos | 0 | Principiante | 18 |
| 6 | s06-numpy.ts | numpy | Colecciones y estructuras de datos | Colecciones | 0 | Intermedio | 18 |
| 7 | s07-data-acquisition.ts | data-acquisition | Texto, Unicode y expresiones regulares | Texto & Unicode | 0 | Intermedio | 20 |
| 8 | s08-pandas.ts | pandas | Archivos, CSV, JSON y contratos de ingesta | Archivos & ETL | 0 | Intermedio | 18 |
| 9 | s09-visualization.ts | visualization | Excepciones, debugging y logging seguro | Excepciones & logs | 0 | Intermedio | 19 |
| 10 | s10-sklearn.ts | sklearn | Módulos, packaging y CLI profesional | Módulos & CLI | 0 | Intermedio | 18 |
| 11 | s11-testing.ts | testing | OOP y modelo de dominio | OOP dominio | 0 | Intermedio | 19 |
| 12 | s12-performance.ts | performance | APIs, SQL y geodatos responsables | APIs · SQL · Geo | 0 | Intermedio | 19 |
| 13 | s13-rpa-automation.ts | rpa-automation | Familiarity Evidence Dashboard y cierre de nivel | Evidence Dashboard | 0 | Intermedio | 19 |
| 14 | s14-security.ts | security | NumPy y cómputo vectorizado | NumPy vectorizado | 1 | Competente | 18 |
| 15 | s15-stdlib-deep.ts | stdlib-deep | Pandas: ingesta, selección y tipos | Pandas ingesta | 1 | Competente | 18 |
| 16 | s16-wxpython-gui.ts | wxpython-gui | Calidad, limpieza y contratos de datos | Calidad y contratos | 1 | Competente | 18 |
| 17 | s17-packaging.ts | packaging | Joins, reshape, groupby y cierre analítico | Joins · groupby · cierre | 1 | Competente | 18 |
| 18 | s18-data-engineering.ts | data-engineering | EDA, estadística descriptiva e incertidumbre | EDA e incertidumbre | 1 | Competente | 18 |
| 19 | s19-databases-orm.ts | databases-orm | Visualización y comunicación accesible | Viz accesible | 1 | Competente | 19 |
| 20 | s20-rag.ts | rag | Automatización robusta de Excel | Excel factory | 1 | Competente | 18 |
| 21 | s21-fastapi.ts | fastapi | Documentos, plantillas y reportes trazables | Reportes trazables | 1 | Competente | 18 |
| 22 | s22-rapidfuzz-entity.ts | rapidfuzz-entity | Email, identidad y aprobación humana | Email y aprobación | 1 | Competente | 19 |
| 23 | s23-computer-vision.ts | computer-vision | Browser RPA con Playwright | Playwright RPA | 1 | Competente | 19 |
| 24 | s24-rpa-advanced.ts | rpa-advanced | OCR y Document AI | OCR Document AI | 1 | Competente | 19 |
| 25 | s25-streamlit-dashboards.ts | streamlit-dashboards | Endpoints de IA, Hugging Face y prompting evaluado | IA endpoints y prompts | 1 | Competente | 19 |
| 26 | s26-integrator-phase1.ts | integrator-phase1 | Orquestación y VP RPA + AI Analyst | VP RPA + AI Analyst | 1 | Competente | 19 |
| 27 | s27-async-concurrency.ts | async-concurrency | Estrategia de pruebas con pytest | Pytest y contratos | 2 | Senior | 19 |
| 28 | s28-llm-agents.ts | llm-agents | Pruebas de datos, propiedades e integración | Propiedades e integración | 2 | Competente | 19 |
| 29 | s29-mlops.ts | mlops | SQL avanzado y modelado relacional | SQL almacén ER | 2 | Competente a experto | 18 |
| 30 | s30-security-infra.ts | security-infra | Entity resolution probabilístico | ER probabilístico | 2 | Competente | 18 |
| 31 | s31-streaming-data.ts | streaming-data | Grafos y evidencia relacional | Grafos y evidencia | 2 | Competente a experto | 18 |
| 32 | s32-microservices.ts | microservices | Feature engineering y pipelines sin leakage | Features sin leakage | 2 | Competente a experto | 18 |
| 33 | s33-advanced-models.ts | advanced-models | ML supervisado y baselines responsables | Baselines ML responsables | 2 | Competente a experto | 18 |
| 34 | s34-cv-ai-integration.ts | cv-ai-integration | Métricas, desbalance, calibración y umbrales | Métricas y umbrales | 2 | Competente a experto | 18 |
| 35 | s35-system-design.ts | system-design | Explicabilidad, equidad e incertidumbre | Explicabilidad y equidad | 2 | Competente a experto | 18 |
| 36 | s36-ai-apis-advanced.ts | ai-apis-advanced | Clustering, anomalías y validación temporal | Clustering y anomalías | 2 | Competente a experto | 19 |
| 37 | s37-dbt-bigquery.ts | dbt-bigquery | Profiling, algoritmos y rendimiento | Profiling y rendimiento | 2 | Competente a experto | 19 |
| 38 | s38-performance-extreme.ts | performance-extreme | Concurrencia, observabilidad y workflows resilientes | Concurrencia y resiliencia | 2 | Competente a experto | 19 |
| 39 | s39-integrator-phase2.ts | integrator-phase2 | Responsible ML Case Triage y cierre de nivel | Case Triage N3 | 2 | Competente a experto | 19 |
| 40 | s40-architecture-ddd.ts | architecture-ddd-decisions | Arquitectura, DDD y decisiones técnicas | Arquitectura y DDD | 3 | Master | 20 |
| 41 | s41-llm-finetuning.ts | llm-finetuning | API con FastAPI y contratos HTTP | API FastAPI | 3 | Master | 20 |
| 42 | s42-graph-rag.ts | graph-rag | Schemas, seguridad y privacidad de servicios | Schemas y seguridad | 3 | Master | 20 |
| 43 | s43-llmops.ts | llmops | Contenedores y reproducibilidad operativa | Contenedores | 3 | Master | 20 |
| 44 | s44-multimodal.ts | multimodal | CI/CD y seguridad de la cadena de suministro | CI/CD supply chain | 3 | Master | 20 |
| 45 | s45-iac.ts | iac | Cloud, almacenamiento, colas e infraestructura | Cloud y colas | 3 | Master | 20 |
| 46 | s46-gpu-computing.ts | gpu-computing | Ingeniería de datos y orquestación de producción | Data eng producción | 3 | Master | 20 |
| 47 | s47-opensource.ts | opensource | MLOps: experimentos, registro y serving | MLOps serving | 3 | Master | 20 |
| 48 | s48-ai-governance.ts | ai-governance | Aplicaciones LLM y RAG con evidencia | RAG con evidencia | 3 | Master | 20 |
| 49 | s49-data-contracts.ts | data-contracts | Agentes, herramientas y context engineering | Agentes y tools | 3 | Master | 20 |
| 50 | s50-tech-leadership.ts | tech-leadership | Evals, red teaming y fiabilidad de IA | Evals y red team | 3 | Master | 20 |
| 51 | s51-integrator-final.ts | integrator-final | Observabilidad, gobernanza y UX del copiloto | Obs y UX copiloto | 3 | Master | 20 |
| 52 | s52-career-strategy.ts | career-strategy | Enterprise Relationship & Operations Intelligence Platform: capstone final | Capstone FINAL | 3 | Master | 80 |

Total estimated hours summed: **1,040** (matches `COURSE_META.totalHours`).

### Orphan section files (not imported by `index.ts`)

Five `.ts` files exist in `src/lib/course/sections/` but are NOT imported by
the canonical `index.ts`. They are tracked as "archivos huérfanos/duplicados"
in `course-state/`:

| File | Declared `id` | Declared `index` | Title |
|---|---|---|---|
| s07-pandas.ts | pandas | 7 | Pandas: Data Cleaning & EDA |
| s08-visualization.ts | visualization | 8 | Data Visualization |
| s09-sklearn.ts | sklearn | 9 | scikit-learn: Full ML Pipeline |
| s10-testing.ts | testing | 10 | Testing Your Python Code |
| s11-advanced-topics.ts | advanced-topics | 11 | Advanced Python for Data Science |

Each orphan collides on `index` with a canonical file but uses a different
`id` (except `s08-visualization.ts` which uses `id: 'visualization'`, the
same id as the canonical `s09-visualization.ts`). They are leftover from the
V3 retheme and have never been deleted. The expert audit
`expert_audit/S11_report.md` line 19 explicitly notes the dual-file situation
and excludes the inactive file.

**Inventory note for downstream phases:** these orphan files are dead code.
A cleanup pass could remove them, but no runtime behavior depends on their
absence and the existing expert-audit/CAMPAIGN_SUMMARY explicitly chose to
ignore them. Phase 0 records them as known orphans and does NOT propose
deletion.

### Filename vs content-title drift

Five canonical files have filenames that no longer describe their content
titles (see `DIV-003` in `source_registry.json`). This is a known artifact of
the V3 retheme that preserved platform section ids while rewriting content.

### Section 40 ID mismatch (P1 divergence)

The Prisma seed file `prisma/seed.ts` line 11743 stores section 40's exam
question bank under the key `'agentic-architecture'`, but the section source
file `src/lib/course/sections/s40-architecture-ddd.ts` line 4 declares
`id: "architecture-ddd-decisions"`. All runtime callers (course index,
PdfReport, regression spec, code_rendering spec) use
`'architecture-ddd-decisions'`.

When the dynamic LMS is seeded, section 40's questions are stored under
`sectionId='agentic-architecture'`. The ExamView client requests
`POST /api/exam/start` with `sectionId='architecture-ddd-decisions'`. The
exam/start route looks up `db.questionBank.findMany({ where: { sectionId } })`
and will return **zero questions** for section 40. Section 40 exams are
silently broken on the dynamic LMS. The static public site is unaffected
because it does not run exams.

This divergence is recorded as `DIV-001` and is the most significant finding
of Phase 0.

---

## 3. Progress store and persistence

### Client-side persistence (browser localStorage)

Two Zustand stores use the `persist` middleware with the default
localStorage adapter. No version field is set in either persist config.

| Store | localStorage key | Source file | Shape |
|---|---|---|---|
| `useProgressStore` | `python-ds-progress` | `src/lib/progress-store.ts` line 106 | `{ completedSections: string[], completedSubSteps: Record<sectionId, string[]>, quizScores: Record<sectionId, number>, lastVisited: string\|null, bookmarks: string[], startDate: string\|null, isHydratedFromServer: boolean }` |
| `useI18n` | `python-ds-lang` | `src/lib/i18n.ts` line 30 | `{ lang: 'es-PE' \| 'es-ES' \| 'en' }` |

Sub-steps are the five canonical tabs:
`SUB_STEPS = ['theory', 'ido', 'wedo', 'youdo', 'quiz']` (declared at
`src/lib/progress-store.ts` line 141).

The progress store exposes a `hydrateFromServer` action that replaces
`completedSubSteps` and `bookmarks` from server data when the user logs in
(see `useServerProgressSync()` at line 153).

### Server-side persistence (dynamic LMS only)

| Item | Value | Source |
|---|---|---|
| ORM | Prisma 6.11.1 | `package.json` line 101 |
| Database | SQLite (file-based) | `prisma/schema.prisma` lines 8-11, `provider = "sqlite"` |
| Database URL env var | `DATABASE_URL` (default `file:./db/custom.db`) | `.env.example` |
| No DB file currently committed | none found at `prisma/*.db` or `db/*.db` | `find . -name "*.db"` |

Prisma models (`prisma/schema.prisma`, 191 lines, 9 models):

| Model | Lines | Purpose |
|---|---|---|
| `User` | 13-29 | email (unique), passwordHash (nullable for OAuth-only), role (STUDENT\|ADMIN), country (default PE) |
| `FeedbackReport` | 32-52 | type (BUG\|IDEA\|RECOMMENDATION\|OTHER), status (NEW\|REVIEWING\|PLANNED\|DONE\|WONTFIX\|DUPLICATE), title, body, sectionId, pagePath, userAgent, email, userId, adminNote |
| `Progress` | 55-67 | Per-user per-section per-subStep completion. Composite PK `userId+sectionId+subStep`. `completed`, `completedAt`, `bookmarked` flags. |
| `QuestionBank` | 70-83 | Exam question bank. `sectionId`, `concept`, `variant` (1\|2\|3), `question`, `options` (JSON array), `correctIndex`, `explanation`. `@@unique([sectionId, concept, variant])`. |
| `ExamAttempt` | 86-102 | `userId`, `sectionId`, `attemptNumber` (1\|2\|3), `answers` (JSON), `score` (0-100), `startedAt`, `completedAt`, `timeSpentSec`, `variantSeed` (JSON audit trail). `@@unique([userId, sectionId, attemptNumber])`. |
| `ExerciseAttempt` | 105-117 | `userId`, `sectionId`, `exerciseId`, `usedHint`, `correct`, `attemptedAt` |
| `SubscriptionPlan` | 125-144 | `code` (free\|pro\|team), `pricingJSON` (multi-region), `featuresJSON`, `maxSections`, `hasExams`, `hasPlayground`, `hasCertificate`, `hasMentorship`, `isActive` |
| `Subscription` | 147-170 | `userId` (unique), `planId`, `status` (ACTIVE\|PAST_DUE\|CANCELED\|EXPIRED\|TRIALING), `billingCycle`, `currency`, `amount`, `provider` (STRIPE\|MERCADOPAGO\|LEMON_SQUEEZY\|MANUAL), `providerSubId`, period dates |
| `Payment` | 173-190 | `userId`, `subscriptionId`, `amount`, `currency`, `provider`, `providerPaymentId`, `status` (PENDING\|SUCCEEDED\|FAILED\|REFUNDED), `failureReason` |

### Server-side API routes for progress and assessment

| Route | Method | Purpose | Source |
|---|---|---|---|
| `/api/progress` | GET | Returns `{ progress: Record<sectionId, string[]>, bookmarks: string[], examAttempts: Record<sectionId, ExamAttempt[]>, exerciseAttempts: ExerciseAttempt[] }` for current user | `src/app/api/progress/route.ts` lines 8-51 |
| `/api/progress` | POST | Upserts a `Progress` row (`sectionId`, `subStep`, `completed`); fire-and-forget Firestore dual-write | lines 59-102 |
| `/api/progress` | PATCH | Upserts a `Progress` row with `subStep='bookmark'` placeholder and `bookmarked` flag | lines 109-150 |
| `/api/exam/start` | POST | Creates an `ExamAttempt` (enforces max 3 per user/section), picks variant seed, returns questions | `src/app/api/exam/start/route.ts` |
| `/api/exam/submit` | POST | Grades answers server-side via `gradeExamAnswers()` from `src/lib/exam-scoring.ts`. Updates `ExamAttempt` with `score`, `completedAt`, `timeSpentSec`, `answers` JSON. Returns `{ attemptId, score, correctCount, totalQuestions, detailedAnswers, passed }` | `src/app/api/exam/submit/route.ts` |
| `/api/exam/attempts` | GET | Lists current user's attempts (optionally filtered by `sectionId`) | `src/app/api/exam/attempts/route.ts` |
| `/api/exercise/attempt` | POST | Records an `ExerciseAttempt` (usedHint, correct) | `src/app/api/exercise/attempt/route.ts` |

### Exam/assessment attempt storage

- **Pass threshold:** `PASS_THRESHOLD = 70` (`src/lib/exam-scoring.ts` line 7).
- **Max attempts per user/section:** 3 (2 retries). Enforced at
  `src/app/api/exam/start/route.ts` lines 33-40 and by Prisma
  `@@unique([userId, sectionId, attemptNumber])`.
- **Attempt row:** `answers` is a JSON string of `[{ concept, variant, selectedIndex, correct }]`
  after grading; `variantSeed` is a JSON audit trail of `[{ concept, variant }]`.
- **Question bank:** 3 variants per concept per section (variant 1, 2, 3).
  Seeded by `prisma/seed.ts` (15,706 lines; 52 section entries verified by
  regex). Note: section 40 seed entry uses wrong key (`agentic-architecture`
  instead of `architecture-ddd-decisions`) — see `DIV-001`.

### Project completion representation

The runtime and the hardening pipeline use **different** representations:

1. **Client-side soft gate** (`src/components/course/PdfReport.tsx`):
   - "Sections completed" = count of sections where
     `completedSubSteps[sectionId].length >= 5`.
   - Certificate generation threshold: `sectionsCompleted >= 8` (line 250).
   - This is a soft client-side gate; no server-side enforcement.

2. **Hardening-ledger representation** (`course-state/`):
   - `course-state/checkpoint.json` declares `course_complete: true`,
     `sections_passed_count: 52`, `capstones_formally_passed: 13`,
     `transversal_checkpoints_passed: 5`, `open_p0_p1: 0`.
   - `course-state/section_ledger.json` declares all 52 sections
     `state: 'passed'`, `phase_detail: 'PHASE_6_PASSED'`.
   - `course-state/capstone_ledger.json` declares all 13 capstones
     (CP-N1-A through CP-N4-C plus CP-FINAL) `state: 'formally_passed'`,
     with `gate_section` for each (S04, S08, S13, S17, S21, S26, S30, S34,
     S39, S43, S47, S51, S52).
   - `course-state/capstones/` contains 13 directories with formal evidence
     packages plus `INDEX.json` and `_generate_formal_packages.py`.

The hardening-ledger representation is an offline artifact owned by the
orchestration pipeline. It is NOT consulted by the runtime LMS. The runtime
only knows about the user's own `Progress` rows and `ExamAttempt` rows.

### Schema version

- **Hardening ledger version:** `3.2` (declared in `checkpoint.json`,
  `section_ledger.json`, `capstone_ledger.json`). `course_requirements.json`
  is at version `3.1`.
- **Client persisted-state version:** none. Neither `python-ds-progress` nor
  `python-ds-lang` carries a version field in their Zustand persist config.
  Any future schema migration would need to handle unversioned existing
  state.

---

## 4. Static vs Dynamic behavior

PyArcana is **both** a static GitHub Pages site and a dynamic LMS, switched
by build-time environment variables.

### Static mode (GitHub Pages, live site)

| Item | Value | Source |
|---|---|---|
| Build flag | `NEXT_PUBLIC_STATIC_SITE=1` | `src/lib/runtime-mode.ts` line 8 |
| Output mode | `NEXT_OUTPUT=export` | `next.config.ts` line 3 |
| Next.js output | `export` (static HTML) | `next.config.ts` line 10 |
| Base path | `/pyarcana` | `next.config.ts` lines 4-7 |
| Asset prefix | `/pyarcana` | `next.config.ts` line 12 |
| Images | unoptimized | `next.config.ts` line 13 |
| API routes | Stripped from disposable build copy only | `scripts/build_static_export.mjs` line 37 |

The static site contract is enforced by `tests/adversarial/test_static_export_guard.py`
which asserts the build script uses `mkdtempSync`, removes `src/app/api` from
the copy with `rmSync`, never uses `renameSync`, never sets
`ignoreBuildErrors`, and never references `z-cdn.chatglm.cn`. The built
`out/index.html` (when present) must contain `Edición pública / Public
edition`, reference `/pyarcana/logo.svg`, and must NOT contain `Crear cuenta
gratis`, `>Planes<`, `>Entrar<`, or `Panel de Administración`.

The static site contract is also asserted by `scripts/static_public.spec.ts`
(5 Playwright tests): branding, English toggle, opening first+last sections
with 5 tabs, base-path assets without 404s, and `check_arg.py` rendering
without token-index corruption.

### Dynamic mode (Node host, LMS)

| Item | Value | Source |
|---|---|---|
| Build flag | (none — static flags unset) | default |
| Output mode | `standalone` (Next.js standalone server) | `next.config.ts` line 10 |
| Start command | `NODE_ENV=production bun .next/standalone/server.js` | `package.json` line 10 |
| Database | SQLite via Prisma | `prisma/schema.prisma` |
| Auth | NextAuth v4 (CredentialsProvider) | `src/lib/auth.ts` |
| Optional dual-write | Firebase Admin Firestore (Spark tier) | `src/lib/firebase/sync.ts` |

### IS_STATIC_SITE guards in the codebase

The `IS_STATIC_SITE` constant from `src/lib/runtime-mode.ts` is consulted in
5 source files:

| File | Guards |
|---|---|
| `src/app/page.tsx` | 12 guards: hides AuthModal, FeedbackFab, PdfReport, UserMenu, AdminDashboard, PricingPage, FamiliarityDashboard, signup CTA |
| `src/components/course/Dashboard.tsx` | 3 guards: static-site notice, hidden auth CTAs |
| `src/components/Providers.tsx` | NextAuth `SessionProvider` gated behind `!IS_STATIC_SITE` |
| `src/lib/progress-store.ts` | `syncToServer` + `syncBookmark` no-op when `IS_STATIC_SITE` |

### Authentication

| Item | Value | Source |
|---|---|---|
| Library | NextAuth v4 (`next-auth@4.24.11`) | `package.json` line 98 |
| Provider | `CredentialsProvider` (email + password, bcrypt) | `src/lib/auth.ts` line 2 |
| Strategy | JWT, maxAge 7 days | `src/lib/auth.ts` lines 49-55 |
| Roles | `STUDENT` (default), `ADMIN` | `prisma/schema.prisma` line 18 |
| Password policy | min 12 chars, max 128 | `src/app/api/auth/register/route.ts` line 17 |
| Rate limit | 15-minute window per client | `src/lib/registration-security.ts` |
| Dummy hash | `DUMMY_PASSWORD_HASH` (one-way bcrypt hash) for timing equalization of unknown-user vs wrong-password | `src/lib/auth.ts` line 8 |
| Secret | `NEXTAUTH_SECRET` env (no fallback) | `src/lib/auth.ts` line 79 |
| OAuth providers | none configured | n/a |
| Registration route | `POST /api/auth/register` | `src/app/api/auth/register/route.ts` |
| NextAuth handler | `src/app/api/auth/[...nextauth]/route.ts` | n/a |
| SessionProvider gating | `src/components/Providers.tsx` gates `SessionProvider` behind `!IS_STATIC_SITE` |

### Server-side APIs

18 route files under `src/app/api/`:

```
src/app/api/
├── route.ts                                  # GET /api (hello world)
├── admin/
│   ├── analytics/route.ts                    # GET /api/admin/analytics
│   ├── export/route.ts                       # GET /api/admin/export
│   └── students/
│       ├── route.ts                          # GET /api/admin/students
│       └── [id]/route.ts                     # GET/PATCH/DELETE /api/admin/students/[id]
├── auth/
│   ├── [...nextauth]/route.ts                # NextAuth handlers
│   └── register/route.ts                     # POST /api/auth/register
├── exam/
│   ├── attempts/route.ts                     # GET /api/exam/attempts
│   ├── start/route.ts                        # POST /api/exam/start
│   └── submit/route.ts                       # POST /api/exam/submit
├── exercise/
│   └── attempt/route.ts                      # POST /api/exercise/attempt
├── feedback/
│   ├── route.ts                              # GET/POST /api/feedback
│   └── [id]/route.ts                         # GET/PUT/DELETE /api/feedback/[id]
├── firebase/
│   └── status/route.ts                       # GET /api/firebase/status
├── progress/
│   └── route.ts                              # GET/POST/PATCH /api/progress
└── subscription/
    ├── checkout/route.ts                     # GET/POST /api/subscription/checkout
    ├── plans/route.ts                        # GET /api/subscription/plans
    └── status/route.ts                       # GET /api/subscription/status
```

All non-trivial routes use Zod schemas for input validation. Admin routes
gate on `session.user.role === 'ADMIN'`. Exam, exercise, and progress routes
gate on `session.user.id` (401 if unauthenticated).

### Optional Firebase dual-write

`src/lib/firebase/sync.ts` mirrors Prisma mutations to Firestore on a
best-effort basis. Prisma remains the source of truth; Firestore sync
failures are logged and never throw. Enabled by env:

```
FIREBASE_SYNC_ENABLED=true
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
# OR a single JSON:
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
```

Firestore collections mirrored: `users`, `progress`, `examAttempts`,
`exerciseAttempts`, `feedbackReports`.

`firestore.rules` denies all client reads/writes — server-only writes via
Admin SDK. `.firebaserc` declares two projects: `coderhouse-react-8063a`
(default) and `pyarcana` (`pyarcana-new`).

---

## 5. Test suites

### Playwright configuration

`playwright.config.ts` (27 lines):

- `testDir: './scripts'`
- `testMatch: '*.spec.ts'`
- `fullyParallel: false` (serial to avoid dev-server contention)
- `workers: 1`
- `retries: 1` in CI, `0` locally
- `reporter: ['html', 'playwright-report'] + ['list']`
- Single project: `desktop-chromium` (Desktop Chrome device)
- `use.trace: 'on-first-retry'`, `screenshot: 'only-on-failure'`,
  `video: 'retain-on-failure'`
- `baseURL: process.env.BASE_URL || 'http://localhost:3000'`
- **No `webServer`** — the dev server is started separately (CI uses
  `bun run dev &` with a 15s sleep + curl health check).

### Top-level Playwright spec files (4 files, 1,031 lines total)

| File | Lines | Tests | Coverage |
|---|---|---|---|
| `scripts/regression.spec.ts` | 404 | 12 | Regression: 52 sections present, 5 sub-steps per section, 4 capstone projects (S13/S26/S39/S51), CodePlayground demos, exam spec content, HUD FABs, tabs, progress. `ALL_SECTION_IDS` array (lines 19-36) is the canonical 52-id assertion. |
| `scripts/code_rendering.spec.ts` | 219 | n/a | Code rendering fidelity across all 52 sections × 5 tabs. Hashes every code object against canonical source. Triggered by CI with `CODE_FIDELITY_SCREENSHOTS=1`. |
| `scripts/static_public.spec.ts` | 68 | 5 | Public GitHub Pages edition contract: Art Nouveau branding, English toggle, first+last sections with 5 tabs, base-path assets without 404s, `check_arg.py` rendering without token-index corruption. |
| `scripts/v3_regression.spec.ts` | 340 | 17 | V3 invariant: state files exist, invariant vector matches canonical values, section ledger has exactly 52 sections, every section has required fields, sections numbered S01-S52, levels distributed 13 per level, capstone ledger has exactly 13 capstones, capstone gates match V3 spec, transversal checkpoints match V3 spec, issue registry has required fields, no P0 issues open, checkpoint has required fields, `COURSE_SECTIONS.length === 52` from `index.ts`, setup section has 24 V3 exercise ids and 8 demoIds, V3 roadmap file exists with 52 section headers, 4 level headers, 13 capstone entries. |

### e2e_max Playwright specs (12 files, 1,139 lines total)

Located under `scripts/e2e_max/`:

| File | Lines | Coverage |
|---|---|---|
| `01_chrome_pages.spec.ts` | 63 | Page chrome (sidebar, header, theme, language) |
| `02_sections_tabs_52.spec.ts` | 41 | All 52 sections × 5 tabs |
| `03_demos_exercises.shard.spec.ts` | 73 | I Do demos + We Do exercises (sharded) |
| `04_quiz_options.shard.spec.ts` | 43 | Quiz options structure (sharded) |
| `05_exam_options.shard.spec.ts` | 122 | Exam option structure (sharded) |
| `06_student_admin_flows.spec.ts` | 105 | Student + admin authenticated flows |
| `07_glossary_i18n_a11y.spec.ts` | 196 | Glossary, i18n, accessibility |
| `08_glossary_52.shard.spec.ts` | 72 | Glossary coverage across 52 sections (sharded) |
| `10_feedback.spec.ts` | 76 | Feedback FAB + form + admin panel |
| `11_admin_analytics.spec.ts` | 86 | Admin analytics dashboard |
| `12_readability_exhaustive.shard.spec.ts` | 120 | Readability (Fernández-Huerta, INFLESZ, WPS/SPW) (sharded) |
| `13_mouse_keyboard_lesson_flow.spec.ts` | 142 | Mouse + keyboard lesson navigation |

### Adversarial unit suite (`tests/adversarial/`)

Documented in `tests/adversarial/README.md` (43 lines). The suite
deliberately stresses edge cases, malformed inputs, boundaries, rate limits,
score corruption, and knowledge-packet isolation — without duplicating
Playwright UI smoke.

**Node tests (8 files, 1,089 lines):**

| File | Lines | Threat surface |
|---|---|---|
| `admin-analytics.test.ts` | 189 | empty cohorts, incomplete exams, risk clocks, histogram bins |
| `auth-hardening.test.ts` | 82 | bounded body/rate state, spoofed keys, public role escalation, fallback secrets |
| `code-highlighting.test.ts` | 87 | single-pass tokenizer invariants; placeholder leakage regression |
| `exam-scoring.test.ts` | 227 | empty answers→NaN, OOR indices, missing Qs, score clamp, 100-answer cap |
| `feedback-guards.test.ts` | 87 | rate exhaustion, window reset, IP key isolation, control-char sanitize |
| `subscription-plans.test.ts` | 56 | plan integrity, pricing non-neg, free/pro contracts |
| `geometry_overlap.test.mjs` | 85 | nested false positives, sticky chrome, area noise |
| `s05_curriculum_integrity.test.mjs` | 76 | S05-specific curriculum invariants |

**Python tests (28 files, 3,507 lines):**

Key examples:

- `test_active_v3_curriculum_contract.py` (100 lines) — V3 contract enforcement
- `test_agentic_hardened_gates.py` (93 lines) — agentic validator gates
- `test_agentic_validator_incomplete.py` (124 lines) — incomplete agentic validators
- `test_ci_dependency_install.py` (53 lines) — Bun pinning + frozen lockfile enforcement
- `test_core_i18n_usage.py` (35 lines) — i18n core key usage
- `test_forensic_pedagogy_gates.py` (91 lines) — forensic pedagogy gates
- `test_late_curriculum_transfer_contract.py` (39 lines) — late transfer contract
- `test_live_grader.py` (60 lines) — live grader behavior
- `test_master_curriculum_specificity.py` (112 lines) — master curriculum specificity
- `test_newbie_packet.py` (151 lines) — newbie packet isolation
- `test_over_localized_language.py` (66 lines) — over-localized language detection
- `test_phase3_exercise_stubs.py` (31 lines) — phase 3 exercise stub detection
- `test_phrase_bank_sc_keys_gates.py` (155 lines) — phrase-bank SC-key gates
- `test_receipt_binding.py` (75 lines) — receipt binding
- `test_runtime_audit_classify.py` (122 lines) — runtime audit classifier
- `test_s01_independent_recovery.py` (185 lines) — S01 independent recovery
- `test_s01_text_first_prose.py` (110 lines) — S01 text-first prose quality
- `test_s02_independent_contract.py` (183 lines) — S02 independent contract
- `test_s02_text_first_quality.py` (128 lines) — S02 text-first quality
- `test_s03_independent_contract.py` (186 lines) — S03 independent contract
- `test_s03_text_first_contract.py` (178 lines) — S03 text-first contract
- `test_s04_independent_contract.py` (114 lines) — S04 independent contract
- `test_s04_text_first_prose.py` (184 lines) — S04 text-first prose
- `test_s05_text_first_quality.py` (138 lines) — S05 text-first quality
- `test_s06_collections_contract.py` (95 lines) — S06 collections contract
- `test_s06_text_first_contract.py` (199 lines) — S06 text-first contract
- `test_s07_text_contract.py` (126 lines) — S07 text contract
- `test_s07_text_first_quality.py` (129 lines) — S07 text-first quality
- `test_s08_ingestion_contract.py` (163 lines) — S08 ingestion contract
- `test_s09_observability_contract.py` (153 lines) — S09 observability contract
- `test_selfcheck_position_bias.py` (29 lines) — self-check position bias
- `test_static_export_guard.py` (52 lines) — static export guard (described above)
- `test_weDo_starter_depth.py` (48 lines) — We Do starter depth

### Test runner scripts (in `package.json`)

29 npm/bun scripts related to testing:

`test:v3-counts`, `test:v3-structure`, `test:v3-invariant`, `test:v3`,
`test:layout`, `test:layout:playwright`, `test:course-complete`,
`test:all-gates`, `test:e2e-max`, `test:e2e-max:catalog`,
`test:e2e-max:shard`, `test:e2e-max:smoke`, `test:glossary-intro`,
`test:glossary-coverage`, `test:i18n-parity`, `test:a11y-contrast`,
`test:code-syntax-contrast`, `test:python-content`, `test:exam-pedagogy`,
`test:readability-contrast`, `test:readability-contrast:full`,
`test:ux-gates`, `test:s01-first-use`, `test:s01-glossary-coverage`,
`test:s01-pedagogy`, `test:ux-campaign:static`, `test:ux-campaign:smoke`,
`test:adversarial`, `test:adversarial:node`, `test:adversarial:py`,
`test:unit`.

### CI workflow (`.github/workflows/tests.yml`)

Six CI jobs:

1. **lint** — `bun run lint` (ESLint)
2. **typecheck** — `npx tsc --noEmit` (after `bun run db:generate`)
3. **adversarial-unit** — `npm run test:adversarial` (Node + Python) + `npm run test:exam-pedagogy` + `npm run test:v3-counts`
4. **platform-builds** — matrix `[dynamic, static]`:
   - dynamic: `bun run build` with `DATABASE_URL=file:./db/ci.db` and `NEXTAUTH_SECRET`/`NEXTAUTH_URL` env
   - static: `bun run build:static`, then `python3 tests/adversarial/test_static_export_guard.py`, then Playwright `scripts/static_public.spec.ts` against `python3 -m http.server 4173` serving `.ci-static/pyarcana`
5. **regression-content** — `npx playwright test scripts/regression.spec.ts --grep "Section registry|CodePlayground|Roadmap"` (source-only, no dev server)
6. **regression-browser** — `bun run dev &` + 15s sleep + curl health check, then `npx playwright test scripts/regression.spec.ts scripts/code_rendering.spec.ts --grep "HUD overlay|Sub-step tabs|Capstone|Geometric|all 52 sections|Code rendering fidelity"` with `CODE_FIDELITY_SCREENSHOTS=1`. Uploads `test-results/` and `playwright-report/` as artifacts.

---

## 6. Existing course-state and ledgers

### `course-state/` directory (178 top-level files)

Ledger files (the durable hardening state):

| File | Version | Purpose |
|---|---|---|
| `checkpoint.json` | 3.2 | Course completion checkpoint: `course_complete=true`, `sections_passed_count=52`, `capstones_formally_passed=13`, `transversal_checkpoints_passed=5`, `open_p0_p1=0`. Records the canonical vector progress: 416 subtopics, 416 demos, 1248 student exercises, 1248 exam variants, 208 topic evaluations, 52 section exams, 52 project increments, 12 level capstones, 1 final capstone. |
| `section_ledger.json` | 3.2 | 52 sections (S01-S52), each `state='passed'`, `phase_detail='PHASE_6_PASSED'`, with `units_done` listing subtopic ids (SNN-Tn-X) and `counts: { subtopics: 8, demos: 8, exercises: 24, exam_variants: 24 }`. |
| `capstone_ledger.json` | 3.2 | 13 capstones (CP-N1-A through CP-N4-C plus CP-FINAL), each `state='formally_passed'`, `execution_status='pass'`, `formally_passed_at='2026-07-20T19:00:00Z'`. Capstone gates: S04, S08, S13, S17, S21, S26, S30, S34, S39, S43, S47, S51, S52. |
| `course_requirements.json` | 3.1 | Authority hierarchy + V3 invariant vector (4 levels, 52 sections, 13 sections/level, 4 topics/section, 2 subtopics/topic, 416 subtopics, 416 demos, 1248 student exercises, 208 topic evaluations, 3 variants/subtopic, 1248 exam variants, 52 section exams, 52 project increments, 12 level capstones, 1 final capstone, 13 capstones total). Records 3 contradictions identified and resolved between V3 and existing roadmap. |
| `issue_registry.json` | 3.2 | All issues `status='fixed'`. Categories: `counting_contract`, `capstone_structure`, `exercise_count`, `privacy_principle`. |
| `PRODUCTION_STATUS.md` | (markdown) | 2026-07-23 production status: `course_complete: true`, all gates green (52/52 sections, 13/13 capstones, vector 416 demos/1248 exercises, exam bank DB 1248/52, topic evaluations 208, open P0/P1 none, privacy RISK 0, dual-newbie pedagogy clean_52, K1/K2 bulk theater permanently rejected by forensic gates, landing PyArcana + Art Nouveau live on Pages, GitHub Pages deploy `e4607b8` success). |

Subdirectories:

| Subdirectory | Contents | Purpose |
|---|---|---|
| `audits/` | 6 files: `audited_s14_s39.md`, `fixer_s14_s39_review.md`, `hardened_s40_s52.md`, `landing_truthfulness_2026-07-22.md`, `restored_platform.md`, `university_github_benchmark.md` | Manual + automated audits of mid/late sections and the public landing |
| `capstones/` | 13 `CP-*` directories + `INDEX.json` + `_generate_formal_packages.py` | Formal capstone evidence packages (one dir per capstone) |
| `curriculum_hardening/` | `GOAL_EVAL_READY.md`, `GOAL_VERIFICATION_GATE.json`, `GOLD_STANDARD_CHECKLIST.md`, `GRAPH_MEMORY.json`, `GRAPH_MEMORY_SUMMARY.md`, `PHASE2_CONSISTENCY_DEPLOY_AUDIT.md`, `PHASE3_EVIDENCE_PACKAGE.{json,md}`, `RESIDUAL_MAP_EXPERT.json`, `SECTION_PROGRESS_LEDGER.json`, `audits/`, `defect_logs/`, `dossiers/`, 22 `git_restore_decision_*.md` files, `paragraph_analysis/`, `residual_ledger.json`, `residual_score_raw.json`, `residual_score_v2.json`, `residual_sweep.md`, `visible_paragraphs/` | Phase 2 + Phase 3 hardening evidence, including a prior GRAPH_MEMORY.json (the predecessor of this campaign's `industry_alignment/`) |
| `lanes/` | 40 `LANE-*.status.json` files + `README.md` | Parallel orchestration lane tracking (LANE-S01 through LANE-S40-S52-CLOSE, plus LANE-CAPSTONE-FORMAL, LANE-LAYOUT, LANE-N1-CLOSE/FACTORY/FINISH, LANE-N1B-FACTORY, LANE-N2-FACTORY, LANE-N34-FACTORY, LANE-PLATFORM, LANE-PRIVACY-TE, LANE-REGRESSION, LANE-S01-P5/P6, LANE-S02-FINISH/P4/P6, LANE-S03-P4/P5/P6, LANE-S04-S05-P4/P5, LANE-S06-S08-P4, LANE-S09-S11-P4, LANE-S12-S13-P4, LANE-S14-S17-CLOSE/P4, LANE-S18-S21-CLOSE/P4, LANE-S22-S26-CLOSE/P4, LANE-S27-S30-CLOSE/P4, LANE-S31-S39-CLOSE/P4, LANE-S40-S52-CLOSE/P4) |
| `newbie_walkthrough/` | `AGENTIC_ATTEMPT_LOG.md`, `ATTEMPT_LOG.md`, `SUMMARY.md`, `agentic/`, `agentic_A1` through `agentic_L2`, `attempt_001` through `attempt_007b`, `deploy_status.txt` | Dual-newbie (Round 1 + Round 2 agentic) pedagogy transcripts — fresh independent S01-S52 walkthroughs verifying no solution leakage |
| `topic_evaluations/` | `_manifest.json` + 52 `sNN_te.json` files | V3 formative topic evaluations (4 per section × 52 sections = 208 tasks) |

### Per-section phase files coverage

| Phase file | Sections present | Sections missing |
|---|---|---|
| `sNN_phase0.json` | S01-S26 (26 files) | S27-S52 (26 sections — authored under later PARALLEL_PRODUCTION pipeline that did not produce phase0) |
| `sNN_phase1.json` | S01-S13 (13 files) | S14-S52 (39 sections) |
| `sNN_phase2.json` | S01-S08 (8 files) | S09-S52 (44 sections) |
| `sNN_phase3.json` | S01-S52 (52 files) | none |
| `sNN_phase4_progress.json` | S02-S52 (51 files) | S01 (S01 uses `phase4_remaining` + `phase4_t1a..t4b` split files instead — 9 sub-files) |
| `sNN_phase5_exam_bank.json` | S01-S52 (52 files) | none |
| `sNN_phase6_validation.json` | S01-S52 (52 files) | none |

This coverage gap is recorded as `DIV-005`. It is a historical hardening
ledger artifact only — runtime behavior is unaffected.

### Additional course-state JSON artifacts (selected)

- `a11y_contrast_report.json` — accessibility contrast audit
- `adversarial_suite_report.md` — adversarial suite summary
- `code_rendering_incident.json` — code-rendering incident record (the
  `check_arg.py` token-index corruption bug fixed in 2026-07-22, see
  `AGENT_STATE.md`)
- `code_syntax_contrast_report.json` — code syntax contrast audit
- `course_complete_report.json` — course completion report
- `e2e_max_playbook.json` + `e2e_max_report.json` — e2e_max playbook + report
- `exam_selfcheck_pedagogy_report.json` — exam + self-check pedagogy audit
- `firebase_mcp_setup.json` — Firebase MCP setup notes
- `glossary_coverage_report.json` + `glossary_extracted.json` + `glossary_intro_report.json` — glossary audits
- `i18n_parity_report.json` — i18n parity audit
- `interaction_catalog.json` — interaction catalog (exported by `scripts/export_interaction_catalog.mjs`)
- `layout_regression_plan.json` + `layout_regression_report.json` — layout regression
- `parallel_orchestration.json` — parallel orchestration config
- `platform_exam_n_concepts.json` — platform exam + concepts inventory
- `privacy_audit_report.json` — privacy audit (RISK=0)
- `python_content_issue_registry.json` + `python_content_skeptical_final.json` + `python_runtime_audit_full.json` + `python_runtime_audit_report.json` — Python content + runtime audits
- `readability_contrast_report.json` — readability contrast audit
- `s01_first_use_report.json` + `s01_glossary_coverage.json` + `s01_phase0.json` through `s01_phase6_validation.json` + `s01_skeptical_final_report.json` + `s01_skeptical_functional_evidence.json` + `s01_topic_evaluations.json` — S01 deep-dive artifacts
- `s02_phase0.json` through `s09_phase6_validation.json` — S02-S09 phase artifacts
- `skeptical_feature_inventory.json` + `skeptical_final_report.json` + `skeptical_http_evidence.json` + `skeptical_issue_registry.json` + `skeptical_phase3_evidence.json` + `skeptical_phase5_live_evidence.json` + `skeptical_s01_review.json` + `skeptical_static_refined.json` + `skeptical_verification_playbook.json` — skeptical review artifacts
- `topic_evaluations/` — 52 per-section topic evaluation packages
- `ux_campaign_baseline.json` + `ux_campaign_final_report.json` + `ux_full_validation_report.json` — UX campaign artifacts
- `v3_invariant_report.json` + `v3_regression_counts_report.json` + `v3_section_structure_report.json` — V3 invariant audits

### `expert_audit/` directory (52 per-section reports + supporting files)

| Sub-path | Count | Purpose |
|---|---|---|
| `SNN_report.md` (S01-S52) | 52 | Per-section curriculum audit reports (Round 1, Stanford STORM + Graph/Loop/Harness) |
| `_GRAMMAR_SUBPLAN.md` | 1 | Shared Spanish grammar subplan (Fernández-Huerta, INFLESZ, WPS/SPW, LanguageTool `es`, 13 pedagogical heuristics) |
| `CAMPAIGN_SUMMARY.md` | 1 | Orchestrator summary of the 52-auditor fleet, with per-section quality scores |
| `PATH_MAPPING.md` | 1 | Sandbox path resolution table (user's local `/Users/pabloillescas/Projects/PyArcana` → sandbox `/home/z/my-project/pyarcana_repo`) |
| `INDEPENDENT_FIXER_INVENTORY.md` | 1 | Per-section independent-fixer state tracking (deployed/pending) |
| `worklog.md` | 1 | Shared Round-1 worklog |
| `independent_worklog/SNN.md` | 10 (S01-S10 only) | Round-1 independent worklog entries |
| `worklog_entries_r2/SNN.md` | 52 (S01-S52) | Round-2 worklog entries (full coverage) |
| `expert_2_audit/*.docx` | 22 | Human-expert audit reports (.docx format) |
| Various `SNN_metrics.json`, `SNN_prose.txt`, `SNN_grammar.py` | mixed | Per-section grammar metrics + prose extracts + custom grammar checkers |

### `industry_alignment/` directory (before Phase 0)

**Did not exist.** Phase 0 created it. See `source_registry.json#industry_alignment_directory_before_phase0`.

---

## 7. Key architectural files

| File | Lines | Role |
|---|---|---|
| `src/lib/course/index.ts` | 95 | Course index. Imports 52 section objects. Declares `COURSE_META`, `COURSE_SECTIONS`, `PHASES`. Exports `getSectionsByPhase()`. |
| `src/lib/types.ts` | 175 | Type schema. 13 interfaces: `LearningOutcome`, `CodeExample`, `Callout`, `TheoryBlock`, `IDoStep`, `WeDoStep`, `YouDoProject`, `QuizQuestion`, `SelfCheck`, `Resources`, `TopicEvaluationTask`, `TopicEvaluation`, `CourseSection`, `CourseMeta`. |
| `src/components/course/SectionView.tsx` | 4,101 | Main rendering component. Renders the 5 sub-step tabs (theory/ido/wedo/youdo/quiz). Imports `ExamView`, `CodePlayground`, `CodeBlock`, `Callout`, `RichText`, `ProgressRing`. |
| `src/components/course/PdfReport.tsx` | 644 | PDF report + certificate generator. Hardcodes `SECTION_NAMES` (52 entries) at lines 40-93. Certificate threshold `sectionsCompleted >= 8` (line 250). Uses `window.open` + `printWindow.print()` for PDF generation. |
| `src/components/course/ExamView.tsx` | 457 | Client wrapper for `/api/exam/*` endpoints. Manages exam start, answer selection, submit, and previous-attempt display. |
| `src/lib/progress-store.ts` | 170 | Zustand + persist localStorage store. `python-ds-progress` key. `SUB_STEPS = ['theory','ido','wedo','youdo','quiz']`. `useServerProgressSync()` hydrates from server when authenticated. |
| `src/lib/runtime-mode.ts` | 20 | `IS_STATIC_SITE` flag. `SITE_BASE_PATH`. `siteAsset()` helper. |
| `src/lib/auth.ts` | 103 | NextAuth config. CredentialsProvider. JWT strategy. |
| `src/lib/exam-scoring.ts` | (n/a) | Pure exam scoring + validation helpers. `PASS_THRESHOLD = 70`. `examSubmitSchema` (Zod). `gradeExamAnswers()`. |
| `src/lib/firebase/sync.ts` | (n/a) | Dual-write helpers. Collections: users, progress, examAttempts, exerciseAttempts, feedbackReports. Failures never throw. |
| `src/lib/firebase/admin.ts` | (n/a) | Firebase Admin SDK init. Spark/free-tier Firestore. No-op when env not configured. |
| `prisma/schema.prisma` | 191 | Prisma schema. 9 models. SQLite provider. |
| `prisma/seed.ts` | 15,706 | Question bank seed. 52 section entries with 3 variants per concept. |
| `scripts/build_static_export.mjs` | 71 | Static export build script. Disposable mkdtemp copy + rmSync api. |
| `next.config.ts` | 18 | Next.js config. `output: standalone | export`. `basePath` + `assetPrefix` only when static. |
| `playwright.config.ts` | 27 | Playwright config. |
| `package.json` | 138 | Package manifest. 29 test-related scripts. Bun 1.3.4. Next 16.1.1. React 19.2.3. |

### Roadmap files

| File | Size | Role |
|---|---|---|
| `learning_roadmap_52_V3.md` | 57 KB | Primary V3 curriculum contract (52 sections, 13 capstones, 12-phase per-section cycle, privacy/ER/relationship-scoring principles) |
| `learning_roadmap.md` | 292 KB | Long-form learning roadmap |
| `el_arte_de_python_roadmap_maestro_52_secciones.md` | 40 KB | Master roadmap (52 sections) |
| `El Arte de Python — Master Roadmap v2.0 + Elite Prompting Strategy + Capstone Specifications.md` | 78 KB | Master Roadmap v2.0 + Elite Prompting + Capstone Specs |

---

## 8. Divergences discovered (summary)

Five divergences were recorded in `source_registry.json#divergences_identified`.
Detailed evidence is in `evidence_registry.jsonl` entries `EV-P0-0023`
through `EV-P0-0026`.

| ID | Severity | Category | Summary |
|---|---|---|---|
| DIV-001 | P1 | section-id-mismatch | `prisma/seed.ts` line 11743 uses `'agentic-architecture'` for section 40 but `s40-architecture-ddd.ts` line 4 declares `id: "architecture-ddd-decisions"`. Section 40 exams silently broken on dynamic LMS. Static site unaffected. |
| DIV-002 | P2 | local-vs-remote-branch-divergence | Local HEAD is 1 commit behind `origin/main` (PR #17 merge). Local `main` was not fast-forwarded. Live site is built from `origin/main`. |
| DIV-003 | P3 | filename-vs-content-title-drift | 5 section source filenames no longer describe their content titles (V3 retheme preserved platform section ids). |
| DIV-004 | P3 | orphan-section-files | 5 orphan section files exist in `src/lib/course/sections/` but are not imported by `index.ts`. Already tracked as 'archivos huérfanos/duplicados' in `course-state/`. |
| DIV-005 | P3 | phase-state-coverage-gaps | `sNN_phase0.json` missing for S27-S52; `sNN_phase1.json` missing for S14-S52; `sNN_phase2.json` missing for S09-S52. All sections DO have phase3, phase5_exam_bank, and phase6_validation. |

---

## 9. Phase 0 gate check

| Gate criterion | Met? | Evidence |
|---|---|---|
| all 52 canonical sections located | ✅ | `EV-P0-0004` (index.ts imports) + per-section metadata table in §2 |
| persistence and assessment authorities identified | ✅ | `EV-P0-0006` (client localStorage), `EV-P0-0008` (Prisma schema), `EV-P0-0009` (exam submit route), `EV-P0-0010` (pass threshold), `EV-P0-0011` (max attempts), `EV-P0-0012` (Firebase dual-write) |
| static and dynamic behavior distinguished | ✅ | `EV-P0-0013` (IS_STATIC_SITE flag), `EV-P0-0014` (static build api strip), `EV-P0-0015` (auth source), `EV-P0-0016` (api route inventory) |
| legacy progress formats documented | ✅ | §3 documents both client-side (`python-ds-progress` Zustand persist, no version field) and server-side (Prisma SQLite, 9 models) persistence. Hardening-ledger representation in `course-state/` (version 3.2) is documented as separate from runtime persistence. |
| existing automated and human validation artifacts identified | ✅ | `EV-P0-0017` (Playwright config), `EV-P0-0018` (adversarial suite), `EV-P0-0019` (regression spec 52 ids), `EV-P0-0020` (course-state complete flag), `EV-P0-0021` (capstone ledger 13), `EV-P0-0022` (expert audit 52 reports). §5 + §6 document automated (Playwright, adversarial, V3 invariant, course_complete_gate) and human (expert_audit per-section reports, expert_2_audit .docx, independent_worklog) validation artifacts. |
| live/repository divergences recorded | ✅ | §1 records local HEAD vs origin/main divergence. §8 records all 5 divergences (DIV-001 through DIV-005) with severity, category, evidence refs. |
| no major repository assumption remains unverified | ✅ | Every architectural claim in this report is backed by an evidence artifact in `evidence_registry.jsonl`. The 5 divergences include all known inconsistencies discovered during Phase 0. |

### Overall gate result: **PASS**

All seven gate criteria are met. Phase 0 is complete. The `industry_alignment/`
Graph Memory directory is bootstrapped with:

- `README.md` — directory purpose and relationships
- `worklog.md` — Phase 0 worklog entry (initial)
- `execution_ledger.json` — 8 cycles (P0-C01 through P0-C08), all `status: completed`
- `evidence_registry.jsonl` — 27 evidence entries (EV-P0-0001 through EV-P0-0027)
- `source_registry.json` — full source inventory + 5 divergences
- `section_audits/`, `badge_requirements/`, `badge_rubrics/`, `decisions/`,
  `memory/notes/`, `memory/cycles/`, `memory/rejected_hypotheses.jsonl`,
  `memory/rejected_badge_claims.jsonl` — empty directories ready for
  subsequent phases

The most significant finding to carry into Phase 1 is **DIV-001** (section 40
ID mismatch between Prisma seed and section source). Any badge/audit framework
that depends on exam-attempt evidence for section 40 must address this
divergence first.
