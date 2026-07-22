# AGENT_STATE.md — PyArcana verification state

## CI/CD dependency reliability (2026-07-22)

- Bun is pinned to `1.3.4` in `package.json`, tests, and Pages deployment.
- All workflow installs use `scripts/ci_bun_install.sh` with a frozen lockfile,
  at most three attempts, and cache clearing between attempts.
- `tests/adversarial/test_ci_dependency_install.py` prevents unpinned Bun or a
  direct, non-retrying workflow install from returning.
- The 52-section browser sweep waits on `section-root[data-section-id]`, not
  Next.js/HMR network idleness; the job is bounded to 30 minutes and superseded
  runs are cancelled.

## Current checkpoint (2026-07-22): NOT COMPLETE / CLEAN RUN COUNT = 0

- The earlier `agentic_B1` and `agentic_B2` pass claims are **tainted and invalid**: their metadata records copied/rebuilt sources (`source_exercises`, `source_selfcheck`, `rebuild_report`) rather than two fresh, independent live learner transcripts.
- The hardened provenance gate now rejects rebuilds, copied artifacts, same-agent A/B pairs, code-execution claims, and non-direct origins.
- Learner packets exclude heuristic gaps, audit manifests, cumulative/internal text, solutions and answer keys. Validator diagnostics are separate artifacts.
- S01–S13 content was repaired in this checkpoint, so any prior learner result is stale even apart from provenance.
- Two fresh, independent, full S01–S52 live runs from the landing page remain required. No current run counts toward success.
- Platform/global S14–S52 validation, adversarial coverage, deployment and push are owned by the root orchestration and remain pending at this checkpoint.

### Implemented after the evidence reset

- Active S01–S52 titles and 8/8/24 structure match `learning_roadmap_52_V3.md`.
- V3 hours are reconciled to 960 curricular + 80 CP-FINAL = 1,040 provisional hours; active section and phase totals agree.
- Selfcheck answer positions use four section-varying balanced permutations, preventing the former global answer-position pattern.
- S21 uses real local DOCX/PDF generation, reopening, extraction and rendering; S25 treats regex as injection telemetry rather than sanitization; S31–S39 restore guided/independent/transfer metadata; S33 no longer reveals reference-output format; S39 supplies a multi-artifact triage bundle with nominal/failure paths.
- Core public chrome now reacts to es-PE/es-ES/en and tells the truth that instructional lessons remain in Peruvian Spanish.
- Latest local gates: lint, TypeScript, 47 Node adversarial tests, 60 Python adversarial tests, V3/course-complete/exam gates, 3,015 curriculum artifacts (2,943 pass, 72 classified skip, 0 fail), dynamic build and static Pages build.
- A permanent Playwright public-static suite covers branding, truthful static boundaries, English switching, S01/S52 navigation, five learning tabs and base-path assets. Local execution was blocked by a truncated Chromium download in this workspace; GitHub CI remains the execution environment for that browser binary.

### Still required for the original pedagogy success gate

- Two fresh independent zero-Python agent runs, each reading only landing + sequential packets S01→S52, followed by skeptical agentic validation. Subagent quota was exhausted before these could be created; no programmatic substitute is counted.
- Glossary advisory reports still identify stale `firstSectionId` metadata/prose-hook gaps; they do not fail CI but remain visible in `course-state/glossary_*_report.json`.

The material below is historical implementation history, not current completion evidence.

# Historical state — El Arte de Python v2.0 Implementation

## Current State: ALL PHASES COMPLETE ✅

### Phase 0: Analysis ✅
- [x] Read roadmap v2 master file (1617 lines, 52 sections)
- [x] Extract structured data for 39 new sections (JSON)
- [x] Gap analysis: 14 full, 19 compact, 3 capstones, 3 without autoeval

### Phase 1: Architecture ✅
- [x] Types: added `phase` field + levels Competente/Senior/Master
- [x] Index: 52 sections + PHASES metadata + getSectionsByPhase()
- [x] Sidebar: phase headers (Fase 1/2/3) in navigation
- [x] AdminDashboard: 52 section names
- [x] PdfReport: 52 section names + totalSections=52
- [x] Admin route: 52 section IDs for gap analysis
- [x] Seed: 626 questions across 52 sections

### Phase 2: Section Implementation ✅
- [x] 39 new section files created (s14-s52)
- [x] All sections follow CourseSection type
- [x] Phase grouping correct (0/1/2/3)
- [x] 21 compact sections expanded with real domain-specific headings
- [x] 21 compact sections expanded with real I Do descriptions
- [x] 21 compact sections expanded with real We Do instructions

### Phase 3: Testing ✅
- [x] Lint: 0 errors, 0 warnings
- [x] Server: HTTP 200
- [x] Admin Dashboard: works with 52 sections, gap analysis, CSV export
- [x] Exam System: 3 attempts max, saves all attempts, 100% score verified
- [x] Exam: 4 questions per attempt (1 per concept), random variant selection
- [x] Student detail: shows exam attempts with scores and audit trail
- [x] Admin can see student progress across all 52 sections

### Verified Features
1. **Admin Dashboard** ✅: Shows "Dashboard del Maestro" with:
   - Student list with email, registration date, % completed, exam count, avg score
   - Stats: total students, avg completion, avg score, total exams
   - CSV export buttons (students + attempts)
   - Student drill-down with gap analysis for all 52 sections
   - Exam attempt history with variant audit trail

2. **Exam System** ✅: Verified end-to-end:
   - 4 questions per attempt (1 per concept, random variant)
   - Submit answers → score calculated → result saved
   - "Reintentar (2 restantes)" visible (3 attempts max, 2 retries)
   - Attempt saved with full answers, correct/wrong, grade, time
   - Admin can see attempt in student detail with 100% score

3. **Content** ✅:
   - 52 sections with real domain-specific headings
   - 13 original sections (Phase 0) with full content
   - 5 sections (S27, S28, S29, S40, S41) with full expanded content
   - 21 compact sections with real headings + I Do + We Do descriptions
   - 626 questions in database (4 concepts × 3 variants × 52 sections)

## Stats
| Metric | Value |
|--------|-------|
| Total sections | 52 |
| Total hours | ~520 |
| Questions in DB | 626 |
| Section files | 52 |
| Glossary terms | 66 |
| Components | 16 |
| API routes | 11 |
| Prisma models | 5 |
| Phases | 4 |

## Known Limitations
1. **19 sections** have real headings + I Do/We Do descriptions but still need
   full theory paragraphs (3+ paragraphs of 150+ words each) and real code examples
2. **Quiz questions** are template-generated for sections 14-52; need domain-expert review
3. **CodePlayground demos** only exist for sections 1-13
4. **OAuth** requires real credentials in .env
