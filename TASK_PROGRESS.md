# TASK_PROGRESS.md — PyArcana verification tracker

## Active verification checkpoint (2026-07-22)

- [x] Restore S01–S13 active-section contracts and remove five inactive legacy section files.
- [x] Enforce exactly 8 unique tagged theory blocks, 8 demos and 24 exercises per active section in validator-only manifests.
- [x] Separate learner packets from heuristic gaps, manifests and cumulative/internal analysis.
- [x] Harden direct-live provenance checks; classify rebuilt/copied B1/B2 artifacts as tainted.
- [x] Reset authoritative clean-run count to zero.
- [ ] Run two fresh independent dual-newbie S01–S52 transcripts after the final content freeze.
- [ ] Complete root-owned all-section adversarial/platform validation and deployment.

All “COMPLETED” entries below are historical build work. They do not satisfy the current pedagogy/provenance gate.

# Historical tracker

## Task 1 — COMPLETED ✅
All 35 sections (S18-S52) fixed with real quiz content. 175 manually-authored questions.

## Task 2 — COMPLETED ✅
All 22 sections with placeholder I Do code fixed. Real Python code examples for:
- S26: FastAPI platform structure
- S30: Zero Trust security (Vault, Fernet, PBKDF2, structlog)
- S31: Kafka producer with exactly-once + consumer with windowing
- S32: Docker multi-stage Dockerfile + K8s Deployment
- S33: XGBoost with Optuna + stacking ensemble
- S34: YOLOv8 detection + OCR with Tesseract preprocessing
- S35: Feast feature store + ADR template
- S36: OpenAI function calling + structured outputs with pydantic
- S37: dbt incremental model + dbt tests
- S38: Numba JIT benchmark + Polars vs pandas
- S39: ML platform architecture + Streamlit dashboard
- S42: Neo4j knowledge graph + hybrid retrieval
- S43: LangSmith tracing + RAGAS evaluation
- S44: CLIP zero-shot classification + Whisper transcription
- S45: Terraform GPU cluster + ArgoCD GitOps
- S46: CuPy GPU benchmark + vLLM serving
- S47: pyproject.toml + GitHub Actions CI matrix
- S48: fairlearn bias detection + model card
- S49: pydantic data contract + OpenLineage
- S50: Design doc + blameless postmortem
- S51: LangGraph multi-agent + QLoRA fine-tuning
- S52: Portfolio site + ATS-optimized CV

## Task 3 — COMPLETED ✅ (6 iterations)

All 52 active sections (S1-S52) now have production-grade CodePlayground demos that run in the browser via Pyodide.

### Critical bugs fixed:
1. **Dead code bug**: `demos` record was declared but never accessed (`const demo = demos[sectionId]` was missing) — all 2700+ lines of demos were dead code. Fixed.
2. **Pyodide package loading**: CodePlayground didn't call `pyodide.loadPackage()` for numpy/pandas/matplotlib/sklearn — all data-science demos would crash with `ModuleNotFoundError`. Added `REQUIRED_PACKAGES` map + `detectRequiredPackages()` auto-loader that scans code for imports and loads the corresponding Pyodide packages before running.
3. **Auto-loader regex bug**: Original pattern didn't match `import matplotlib.pyplot` (dot after package name). Fixed to allow `\\.` as a follow-char.
4. **Broken pandas expectedOutput**: Was truncated to 6 lines but code prints ~20 lines — auto-validation would always fail. Replaced with verified complete output.
5. **microservices demo crash**: `CircuitBreaker.__init__` accepted `reset_timeout` param but never assigned it to `self.reset_timeout` → `AttributeError` after circuit opened. Fixed.
6. **ai-apis-advanced demo crash**: `get_time` lambda took 0 args but was called with `args=""` → `TypeError`. Changed to `lambda *args: ...`.
7. **gpu-computing demo crash**: `random.random()` called BEFORE `import random` → `NameError`. Reordered imports.
8. **cv-ai-integration content bug**: Pixel array `[1,2,3,2,4]` was commented "H-o-l-a" but actually produces "Holoa". Fixed comment.

### Quality improvements:
- 41 of 52 demos now have verified `expectedOutput` (auto-validation with "¡Correcto!" green checkmark).
- 11 remaining demos without expectedOutput are inherently non-deterministic (timing decorators, datetime.now(), benchmark timing, random floats) — they still run and produce output.
- Removed orphan `advanced-topics` demo (dead code from orphaned s11-advanced-topics.ts).
- 1:1 mapping verified: 52 active sections ↔ 52 demos, no orphans, no duplicates.
- All 52 demos confirmed Pyodide-compatible (stdlib + loadable packages only, no forbidden imports).
- Refactored security demo to use fixed salt for reproducibility (production code uses os.urandom, documented in comment).

## Task 4 — COMPLETED ✅ (6 iterations)

Updated `learning_roadmap.md` from 1042 → 5013 lines covering all 52 sections with detailed exam requirements.

### What was delivered:
1. **Foundational exam system spec** (80 lines): 10-rule table with pedagogical justifications, concept taxonomy, variant structure (shared vs differing), retry policy step-by-step, anti-plagiarism vector-by-vector (5 vectors × mitigation), scoring/feedback, integration with progress store, known limitations.
2. **Per-section exam spec sheets for all 52 sections**: each with config table (6-7 params), concept taxonomy (3-5 conceptos × slug × Bloom × description), worked variant example (V1/V2/V3 showing shared concept + differing context), preserved auto-eval questions.
3. **Updated Tabla de Contenidos**: 4 sub-tables by phase (Fase 0/1/2/3), each listing all sections with hours + You Do project.
4. **Updated Flujo de Aprendizaje**: 4-phase progression diagram + 4-capstone progressive structure (S13, S26, S39, S51).
5. **Updated Estadísticas**: per-phase breakdown of sections/hours/concepts/variants/projects/demos, plus Bloom distribution table (Recordar/Aplicar/Analizar with progression analysis).
6. **Updated Pyodide note**: now reflects all 52 sections (not 1-11) with auto-load packages.

### Quality metrics:
- 240 conceptos evaluados totales (60 F0 + 56 F1 + 64 F2 + 60 F3)
- ~720 preguntas en QuestionBank al completar seed (3 variantes × 240 conceptos)
- Bloom distribution: 10% Recordar, 54% Aplicar, 36% Analizar (pedagogically sound progression)
- 0 typos en markdown (V2/V3 markers all fixed)
- All 52 sections follow consistent structure

### Concept slug alignment:
All concept slugs are stable kebab-case identifiers (e.g. `venv-purpose`, `list-comprehension`, `pipeline-idempotency`, `qlora-4bit-mechanics`) that match the `QuestionBank.concept` field convention, enabling per-concept progress tracking and remediation.

## Task 5 — COMPLETED ✅ (6 iterations)

Cross-referenced the 52-section curriculum against 4 EPUBs + Ed Donner GitHub repos + top GitHub Python courses + university open courseware + top online courses + free books online. Verified complete coverage with no critical gaps.

### Deliverables created:
1. **`docs/PYTHON_DS_RESOURCES_INVENTORY.md`** (145 lines, 21KB) — comprehensive inventory of:
   - Ed Donner's 39 GitHub repos (6 core course repos + 10 companion + ~20 capstone apps)
   - 13 top GitHub Python course repos (356k-11k stars, verified)
   - 9 university open courseware courses (MIT, Harvard, Stanford x2, Berkeley x2, CMU, UMich)
   - 11 top online courses (freeCodeCamp, Kaggle, Google, IBM, DataCamp, Real Python, Corey Schafer)
   - 5 free books (Think Python, PDSH, Dive Into Python 3, Automate the Boring Stuff, Hitchhiker's Guide)

2. **`docs/CROSS_REFERENCE_REPORT.md`** (721 lines, 36KB) — section-by-section mapping of all 52 sections to external resources, with coverage classification:
   - 36/52 sections (69%) Strong coverage from multiple quality free resources
   - 12/52 sections (23%) Partial coverage supplemented with primary docs
   - 4/52 sections (8%) in gap areas — but 3 of 4 are unique strengths
   - 8 unique strengths identified where our curriculum is the deepest free resource

3. **`docs/PYTHON_DS_GAP_RESOURCES.md`** (173 lines, 20KB) — 3-4 verified free resources for each of 8 gap areas:
   - Statistics & Probability (OpenIntro + Think Stats + StatQuest + 3Blue1Brown)
   - Bayesian/A-B Testing (Bayesian Methods for Hackers + Statistical Rethinking)
   - Time-series Forecasting (Penn State STAT 510 + Prophet + NeuralForecast)
   - MLOps (Made With ML + MLOps Zoomcamp + Google MLOps white paper)
   - NLP Fundamentals (Jurafsky/Martin SLP3 + NLTK Book + Gensim)
   - Data Eng/Spark/Airflow (Data Engineering Zoomcamp + Databricks Free + Airflow tutorial)
   - Causal Inference (The Mixtape + What If + Feast)
   - Cloud DW (BigQuery Sandbox + dbt Fundamentals + Snowflake tutorials)

### Immediate fixes applied to learning_roadmap.md:
1. **S16 wxPython**: Added ⚠️ modernization note recommending Streamlit (S25) for new projects; explains why wxPython is kept (legacy enterprise tools, PyInstaller, event-driven model).
2. **S31 Faust streaming**: Added ⚠️ modernization note flagging Faust as unmaintained since 2022; recommends Quix Streams + Bytewax as modern alternatives.
3. **EPUB coverage section**: Expanded from 32 → 100 lines with full cross-reference against all external resource categories (4 EPUBs + Ed Donner repos + GitHub + university + online courses + free books).
4. **New "Recursos externos recomendados" subsection**: 14-row table of primary resources by phase + 8-row table of gap resources + S0 Statistics Primer recommendation.

### Key findings:
- **No critical gaps**: Every concept in the 52-section curriculum has at least one external reference.
- **4 gap areas** identified, but 3 of 4 (GraphRAG, FinOps, Peruvian localization) are unique strengths that differentiate the curriculum.
- **8 unique strengths**: Peruvian SUNAT invoice digitization, PII detection, Ley 29733 compliance, name normalization, OWASP+presidio combo, GraphRAG, FinOps, 4-capstone structure.
- **Honest limitations documented**: Kohavi A/B book not free, Snowflake no perpetual free tier, no fully-free LSTM course, Faust unmaintained.
- **Recommended future enhancement**: "S0 — Statistics Primer" module to close the biggest curriculum gap (no dedicated stats arc before S6).

### Verification:
- All 52 sections mapped in cross-reference report ✅
- All 8 gap areas have 3-4 verified free resources ✅
- All ~30 URLs HTTP-verified (200 status) ✅
- 2 modernization notes applied to roadmap ✅
- 3 docs files cross-linked from roadmap ✅
