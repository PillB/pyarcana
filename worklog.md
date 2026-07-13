# Solarize Orchestrator Worklog

This is the shared worklog for the Solarize multi-agent orchestrator building a
Python -> Data Analyst / Data Scientist online course website (Peruvian Spanish).

Agents append their entries below using the standard template.

---
Task ID: 1
Agent: Research/STORM
Task: Phase 0 research for Python DS course

Work Log:
- Read project root; confirmed Next.js 16 + Tailwind 4 + shadcn/ui + Prisma + Framer Motion + z-ai-web-dev-sdk + zustand stack (all relevant for Section 3 SPA findings).
- Ran 12 web_search queries via z-ai CLI covering: Python DS skills demand 2025; salary Peru Lima; Gradual Release pedagogy; Tailwind 4 + shadcn SPA patterns; Framer Motion perf; spaced repetition for syntax; sklearn Pipeline+Optuna+SHAP; pytest+CI; constructivism in CS ed; course platform success patterns (freeCodeCamp/Kaggle Learn); responsive overflow pitfalls; Python cert value; LATAM DS soft skills; pandas real-world projects; zustand persist; online course completion pitfalls.
- Cross-referenced 5 independent salary sources for Peru (Levels.fyi, Glassdoor, SalaryExpert, Talently, CosmoQuick).
- Identified Tailwind v4 + shadcn known Radix transparency bug (GitHub #17137) — actionable for build phase.
- Validated Gradual Release has evolved to 4 phases (I Do / We Do / You Do Together / You Do) per Corwin + Ferry 2024.
- Mapped each of the 10 outline sections to a portfolio-grade mini-project mirroring a real DA/DS job task.

Stage Summary:
- Delivered a ~1,450-word research brief with 4 sections: (1) 15 CV keywords + 5 production project archetypes + 3 cert recommendations + Peru salary ranges; (2) 5 pedagogy principles + 3 anti-patterns; (3) 5 SPA/Tailwind best practices + 3 mobile-on-desktop pitfalls with fixes; (4) per-section must-have sub-skills + mini-project ideas for all 10 outline modules.
- Key actionable findings for downstream agents: (a) course must use I Do/We Do/You Do Together/You Do pattern with executable feedback after every "You Do"; (b) prefer CSS/LazyMotion animations over JS for perf, animate only transform/opacity; (c) use Zustand+persist for localStorage progress with schema versioning; (d) Tailwind v4 migration requires fixing Radix Select transparency bug; (e) course projects should be the 5 production archetypes (churn, RFM segmentation, forecasting, EDA report, scoring+API) — these double as portfolio pieces; (f) CS50P + Kaggle badges are the highest-signal certifications to recommend.
- Source-quality honesty: salary/Peru data and Gradual Release model are strongly corroborated; LATAM soft-skills and cert-ROI claims are weaker (anecdotal); niche tool-adoption rankings for 2025-2026 LATAM relied on training-data inference. Recommended: orchestrator commission a Phase 0.5 scrape of actual LinkedIn Peru DS job postings to harden keyword ranking.

---
Task ID: P0-A
Agent: Content Extraction
Task: EPUB gap analysis

Work Log:
- Read prior worklog (Phase 0 research by Research/STORM agent); aligned with the 10-section course outline.
- Confirmed ebooklib + lxml not pre-installed; installed into /home/z/.venv (Python 3.12) which already had working lxml 6.0.2. User-local Python 3.13 lxml install was broken (ImportError on etree), so used venv interpreter.
- Extracted all 3 EPUBs to /tmp/epub_extract/{python_101,python201,PythonAwesomeJob}. Wrote /home/z/my-project/parse_epubs.py that uses ebooklib to walk the spine in order, extract chapter titles, 25-word summaries, and top subheadings (filtered out part dividers / title / TOC pages).
- Parsed inventory: python_101 = 44 numbered chapters + Appendix A across Parts I-V; python201 = 30 chapters across Parts I-V; PythonAwesomeJob = 8 chapters.
- Spot-extracted code blocks from 6 high-value chapters (python_101 ch15 csv, ch24 datetime, ch28 decorators; python201 ch3 collections, ch4 context-managers, ch8 iterators, ch27 doctest; PythonAwesomeJob ch4 Excel/PDF, ch5 scraping, ch6 multiprocessing) to ground exercise ideas.
- Mapped every EPUB chapter to current course sections; flagged COVERED / PARTIAL / MISSING.

Stage Summary:
- Delivered 4-part gap analysis (~1900 words): (1) full chapter inventory tables for all 3 EPUBs; (2) per-chapter coverage map against the 10 existing sections; (3) top-10 critical missing topics ranked by DS-learner value, each with source citation, justification, and recommended insertion point; (4) 10 concrete exercise ideas sourced from real EPUB code, each with target section.
- Top cross-cutting gaps: (a) Iterators/Generators/yield — needed for memory-efficient Pandas pipelines; (b) Web scraping + REST APIs — primary DS data-acquisition channel entirely absent; (c) SQL databases (sqlite3/SQLAlchemy/Postgres) — every DS job requires it, course has none; (d) Multiprocessing/concurrent.futures — parallel feature engineering & hyperparam sweeps; (e) Regex — text cleaning; (f) collections (Counter/defaultdict/namedtuple); (g) Profiling/benchmarking; (h) Logging; (i) argparse/CLI tooling — portfolio polish; (j) mocking with unittest.mock — Section 10 only covers pytest fixtures, not mocking external APIs.
- Recommended structure changes: expand Section 3 (Data Structures & File Handling) to include collections + regex + context managers + generators; expand Section 7 (Pandas & EDA) to include web scraping + APIs + SQL data acquisition as a "Data Acquisition" sub-module; expand Section 10 (Testing) to add unittest.mock; add a NEW optional Section 11 "Performance & Concurrency" covering logging, profiling, multiprocessing, asyncio basics. Total estimated new content: ~6-8 sub-lessons.
- Reusable artifacts left for downstream agents: /home/z/my-project/parse_epubs.py (re-runnable parser), /tmp/epub_extract/ (extracted XHTML + images — 51 + 36 + 9 chapters of source material).

---
Task ID: P0-B
Agent: Research/STORM
Task: Auth + progress tracking patterns for Next.js 16 App Router (Prisma/SQLite/TS/Tailwind)

Work Log:
- Read /home/z/my-project/worklog.md (P0-A + Phase 0 context); confirmed Solarize Python DS course, 10 sections, I Do/We Do/You Do pedagogy, all on `/` route (SPA). No separate /login /dashboard routes allowed.
- Audited current repo: Next.js 16.1.1, next-auth ^4.24.11 already installed (recommend upgrade to v5 beta), Prisma 6.11.1 + SQLite at /home/z/my-project/db/custom.db, zod 4, zustand 5, react 19, Tailwind 4, shadcn/ui. Existing schema only has User + Post stub. Existing src/lib/progress-store.ts uses zustand+persist (localStorage only) — flagged for server-sync migration once auth lands.
- Ran 2 web_search queries via z-ai CLI to verify Auth.js v5 ↔ Next.js 16 compatibility: confirmed stable via Plain English guide "Stop Crying Over Auth: Senior Dev's Guide to Next.js 16 & Auth.js v5" + WorkOS 2026 App Router auth guide + authjs.dev v5 migration docs. v4 works but fights App Router conventions.
- Designed full Prisma schema with User/Session/Progress/QuestionBank/ExamAttempt/ExerciseAttempt models, accounting for SQLite constraints (no native enum → String role; Json stored as TEXT but exposed typed via Prisma).
- Specified smart-exam variant system: 3 variants per concept, no-repeat-within-user enforced by attemptNumber unique constraint, 2-retry-max (3 total attempts) gating via /api/exam/start returning 403 when N≥3.
- Recommended OAuth mock = Option A (modal explaining env config) as primary + Option B demo-account toggle, NOT fake @gmail.com users (pollutes DB + admin CSV) and NOT Option C placeholder env (confusing runtime errors).

Stage Summary:
- Delivered ~1,450-word research brief covering: (1) stack with bun add commands; (2) NextAuth v5 vs custom — v5 wins for portfolio project; (3) full Prisma schema with relations; (4) 13 API endpoints; (5) 10-item security checklist; (6) Mock OAuth recommendation (A+B hybrid); (7) 10-step implementation order.
- Key downstream decisions: upgrade next-auth ^4.24.11 → next-auth@beta (v5); use bcryptjs (pure JS, no native build) cost factor 12; NextAuth Credentials provider + JWT sessions (no DB sessions needed for SQLite dev); protect API via auth() inside route handlers, NOT middleware on `/` (SPA shell is public); migrate zustand progress-store to dual-write (localStorage optimistic + POST /api/progress server sync, hydrate from GET on mount).
- Anti-cheat for exams: variantSeed JSON stored per attempt for audit; timeSpentSec tracked; attemptNumber @@unique prevents bypassing the 3-attempt cap; admin can review suspicious patterns (instant submits, identical answers across variants).
- Source quality: Auth.js v5 + Next 16 stability is well-corroborated (3 independent 2025-2026 guides); bcrypt-vs-argon2 debate settled on bcryptjs for portability in dev/SQLite (argon2 needs native build); rate-limiting-without-Redis is the weakest recommendation (in-memory token bucket resets on serverless cold starts — acceptable for portfolio demo, document as known limitation).

---
Task ID: T2
Agent: Curriculum Design
Task: Create Section 11 — Advanced Python for Data Science (covers 10 EPUB gaps)

Work Log:
- Read prior worklog (P0-A gap analysis identified the 10 missing topics; P0-B auth context).
- Read /home/z/my-project/src/lib/types.ts to confirm CourseSection type (id, index, title, shortTitle, tagline, estimatedHours, level, icon, accentColor, learningOutcomes, jobRelevance, theory, iDo{intro,steps[]}, weDo{intro,steps[]}, youDo, selfCheck, resources).
- Read /home/z/my-project/src/lib/course/sections/s10-testing.ts (818 lines) as reference for style/depth, paragraph density, callout usage, code example structure, and Peruvian Spanish tone.
- Read /home/z/my-project/src/lib/course/index.ts (35 lines) — confirmed COURSE_SECTIONS array and COURSE_META (totalSections=10, totalHours=70).
- Read /home/z/my-project/prisma/seed.ts (1418 lines) — confirmed QUESTION_BANK structure: Record<sectionId, Q[]> with concept/question/options/correctIndex/explanation per entry, 3 variants per concept enforced by post-insert variant renumbering logic.
- Created /home/z/my-project/src/lib/course/sections/s11-advanced-topics.ts (1608 lines) — full CourseSection object covering all 10 gaps:
  (1) Iterators & generators (yield) — streaming CSV, lazy evaluation, pd.read_csv chunksize;
  (2) Web scraping — requests + BeautifulSoup + Selenium with rate-limiting, caching, legal/ethical callout;
  (3) REST APIs — requests.get/post, JSON parsing, paginación (next cursor + page param), retry with backoff exponencial, Session for keep-alive;
  (4) SQL databases — sqlite3 with parameterized queries (SQL injection danger callout), SQLAlchemy ORM, pd.read_sql bridge, df.to_sql persistence;
  (5) Multiprocessing & concurrent.futures — ProcessPoolExecutor for CPU-bound, ThreadPoolExecutor for I/O-bound, GIL explanation, memory considerations;
  (6) Regular expressions — DNI/email/teléfono peruano extraction, log parsing, pandas str.replace with regex, regex101.com reference;
  (7) collections — Counter (most_common, NLP word freq), defaultdict(list) for groupby, namedtuple for structured returns, deque for sliding windows;
  (8) Profiling & benchmarking — timeit for microbenchmarks, cProfile for script-wide, line_profiler (kernprof -l -v) for line-by-line, memory_profiler bonus;
  (9) Logging — basicConfig, niveles DEBUG/INFO/WARNING/ERROR/CRITICAL, %-format vs f-string performance, RotatingFileHandler, JSON structured logging (python-json-logger);
  (10) argparse / CLI tooling — ArgumentParser, add_argument types/choices/action, pyproject.toml [project.scripts] entry points, typer as modern alternative.
- Each theory block has 3 paragraphs of 150+ words, runnable Python code with realistic outputs (Peruvian context: SUNAT, Interbank, Mercado Libre, Falabella, Ripley), and a callout (info/warning/tip/danger) where pedagogically appropriate.
- iDo: 3 integrated steps — (1) API paginación + SQLite persistence pipeline with logging, (2) parallel feature engineering with ProcessPoolExecutor, (3) full CLI with argparse + logging + subcommand skip flags.
- weDo: 3 exercises with starter + solution code — (1) generator stream_csv + batch grouping, (2) fetch_all_pages with rate-limit retry, (3) clean_phones CLI with regex + logging.
- youDo: capstone "lead-scraper" project combining all 10 gaps (API acquisition → regex cleaning → SQLAlchemy persistence → parallel features → structured logging → argparse CLI → pip-installable) with 8-criterion rubric.
- selfCheck: 5 quiz questions covering yield, SQL injection safety, Process vs Thread, re.findall, logging best practices.
- resources: 10 doc links (official Python + regex101), 4 books (Beazley/Ramalho/Mitchell/Teate), 4 courses (Real Python + FastAPI + TalkPython).
- Updated /home/z/my-project/src/lib/course/index.ts (36 lines): added import of section11, appended to COURSE_SECTIONS array (now 11 entries), bumped COURSE_META totalSections 10→11 and totalHours 70→86, updated description to mention "11 secciones" and "scraping, APIs, SQL, multiprocessing".
- Updated /home/z/my-project/prisma/seed.ts (1581 lines): added 'advanced-topics' key to QUESTION_BANK with 4 concepts × 3 variants = 12 new questions. Concepts chosen for highest DS-job-relevance: generators-yield, sql-injection-safety, multiprocessing-vs-threads, logging-best-practices. Each variant tests the same concept from a different angle (definition / application / edge case) per the variant pattern established by other sections. The existing variant-renumbering logic in main() handles assigning variant=1,2,3 automatically.
- Fixed 2 syntax typos introduced during Write: lines 861 and 975 had `],` where `},` was needed (closing code: {} object not an array). Detected via `bun build --no-bundle` parser, confirmed via grep for orphan `],` after template literal closes.
- Verified all files typecheck cleanly: `bunx tsc --noEmit --strict --target esnext --module esnext --moduleResolution bundler --skipLibCheck` on (s11-advanced-topics.ts, index.ts, types.ts) and (seed.ts) both pass with zero errors.

Stage Summary:
- Delivered Section 11 "Advanced Python for Data Science" (id='advanced-topics', index=11, 16 hours, level Avanzado, icon Rocket, orange→red gradient) — 1608 lines covering all 10 EPUB gap-analysis topics as integrated theory blocks with Peruvian Spanish voice ("chevere", "pega", examples referencing SUNAT/Interbank/Mercado Libre/Falabella).
- 3 files modified: NEW s11-advanced-topics.ts (1608 lines), UPDATED index.ts (35→36 lines), UPDATED seed.ts (1418→1581 lines). All typecheck clean, all bun build clean.
- Key downstream impact: COURSE_META now reports 11 sections / 86 hours; COURSE_SECTIONS array has 11 entries; QUESTION_BANK has 11 keys totaling 134 question variants (10 prior sections ~12 each + new 12). Smart-exam engine (P0-B design) will automatically pick up advanced-topics questions once UI lists section 11 in exam config.
- Pedagogical decisions: (a) chose to put all 10 gaps in ONE advanced section (per task spec) rather than scattering across existing sections (which would have broken section-level progress tracking and required rewriting s03/s07/s10); (b) used ID 'advanced-topics' (kebab-case matching existing IDs 'setup', 'testing', etc.); (c) used 'Rocket' lucide icon (matches "advanced/launch" semantic, available in lucide-react); (d) orange→red gradient distinct from s10 (cyan→blue) for visual hierarchy; (e) 16 estimatedHours reflects 90min per topic × 10 + capstone (~1 hour), reasonable for autonomous learners.
- Quality notes: 2 typos (`],` vs `},`) caught and fixed before completion via bun parser. No remaining issues. Code examples include realistic outputs (e.g., "Secuencial: 8.5s / Paralelo (8 workers): 1.4s", "Cargadas 10000 filas, 8 columnas en 0.85s") so learners can verify expected behavior. Callouts span all 5 types (info, warning, tip, danger, success) for visual variety.
- Next agent recommendations: (a) UI agent should verify the new section renders correctly in the SPA — icon 'Rocket' must be in the lucide-react import map; accentColor class must be safelisted by Tailwind 4 (check tailwind.config or @source inline if dynamic classes are purged); (b) if any UI hardcoded "10 secciones" or "70 horas" outside COURSE_META, those need updating too; (c) smart-exam engine should be configured to include 'advanced-topics' in the section picker for the final exam; (d) consider adding a 12th section icon to the sidebar/navigation if it uses a fixed list.
