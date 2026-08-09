# Badge Claim Register

**Generated:** 2026-07-28T22:08:04Z  
**Catalog version:** 1.0.0  
**Badge count:** 31  
**Issuer:** PyArcana Industry Alignment Campaign (issuer of record: PyArcana maintainers)

## Purpose

This register is the public, learner-and-employer-facing list of
every claim PyArcana badges make — and, just as importantly, every
claim they explicitly do NOT make.

Each entry has:

- **Public claim** — what the badge certifies, in plain language.
- **Non-claims** — what the badge does NOT certify, listed
  explicitly so learners cannot over-claim and employers cannot
  over-infer.
- **Capability level** — a curriculum-internal label
  (`foundation`, `independent_practitioner`, `advanced_applied`,
  `integrated_mastery`) that describes cognitive load, NOT
  industry seniority.
- **Verification mode** — `local_only` (motivational marker) vs.
  `server_verified` (cryptographic issuance).

The register is the canonical public artifact. If a badge's claim
is not in this register, the badge does not make that claim.


## How to read capability levels

PyArcana's capability levels describe the **cognitive load** of
the work assessed, not industry seniority:

| Level | Meaning | What it is NOT |
|---|---|---|
| `foundation` | Can apply with guidance; follows instructions; works within a pre-scoped problem. | NOT 'Junior' or 'Entry-level'. |
| `independent_practitioner` | Can apply independently within a pre-scoped problem; recognizes common failure modes. | NOT 'Mid-level' or 'Senior'. |
| `advanced_applied` | Can diagnose and design within an existing system; articulates tradeoffs. | NOT 'Senior', 'Staff', or 'Lead'. |
| `integrated_mastery` | Can integrate multiple specialization areas into a single defended synthesis. | NOT 'Principal', 'Staff', 'Distinguished', or 'Master'. |

These labels are PyArcana-internal. They MUST NOT be used as
industry seniority titles on a resume, LinkedIn profile, or job
application. Doing so is a misrepresentation of the credential
and may trigger revocation per the badge's revocation_policy.


## Family 1 — Progress achievements (local_achievement)

Motivational markers. NOT proof of proficiency. Issued on both
the static GitHub Pages edition (local) and the dynamic LMS
edition (server-mirrored). Never expire.


### `progress_phase0_walked` — Phase 0 — Foundations Walked

- **Capability level:** `foundation`
- **Credential type:** `local_achievement`
- **Verification mode:** `local_only`
- **Status:** `active`
- **Roles aligned:** `data_analyst`, `data_scientist`, `rpa_automation_developer`, `ai_ml_engineer`, `production_python_engineer`
- **Skill nodes (19):** `python_core`, `python_idioms`, `git_workflow`, `packaging_reproducibility`, `pandas_numpy`, `data_cleaning`, `data_validation`, `descriptive_stats`, `classical_ml`, `model_evaluation`, `python_visualization`, `bi_tools`, `testing_discipline`, `performance_tuning`, `python_rpa_browser`, `process_analysis`, `exception_handling_rpa`, `code_review_literacy`, `security_mindset`
- **Critical competencies (0):** _none_
- **Prerequisites:** _none — entry point_

**Public claim:** The learner has completed all 13 sections of PyArcana Phase 0 (Foundations): S01 through S13, including the You Do project and self-check for each section.

**Non-claims:**
- This is a motivational marker. It is NOT proof of proficiency.
- It does not certify any industry role, level, or job-readiness.
- It does not require independent (un-guided) exercise performance above the section-level self-check floor.
- Section completion alone does not satisfy any applied-skill, cross-section, or capstone credential requirement.

**Newbie-friendly description:** You finished the first 13 sections of PyArcana, the 'Foundations' phase. Each section ends with a You Do project (an exercise you do alone, without step-by-step help) and a short self-check quiz. Earning this marker means you walked through every section, submitted every You Do, and answered every self-check. It does NOT mean a hiring manager should treat you as a Data Analyst, Data Scientist, or any other role yet — it just means you did the work of walking through Phase 0.

---

### `progress_phase1_walked` — Phase 1 — Independent Walked

- **Capability level:** `independent_practitioner`
- **Credential type:** `local_achievement`
- **Verification mode:** `local_only`
- **Status:** `active`
- **Roles aligned:** `data_analyst`, `data_scientist`, `rpa_automation_developer`, `ai_ml_engineer`, `production_python_engineer`
- **Skill nodes (23):** `security_mindset`, `python_core`, `python_idioms`, `packaging_reproducibility`, `stakeholder_management`, `ci_cd`, `data_cleaning`, `data_validation`, `pandas_numpy`, `sql_fundamentals`, `llmops`, `system_design`, `testing_discipline`, `deep_learning`, `classical_ml`, `python_rpa_browser`, `selector_design`, `exception_handling_rpa`, `python_visualization`, `bi_tools`, `business_framing`, `process_analysis`, `stakeholder_translation`
- **Critical competencies (0):** _none_
- **Prerequisites:** `progress_phase0_walked`

**Public claim:** The learner has completed all 13 sections of PyArcana Phase 1 (Independent Practitioner): S14 through S26, including the You Do project, self-check, and section exam for each section.

**Non-claims:**
- Motivational marker only; NOT proof of independent proficiency.
- Does not certify any role or seniority.
- Does not by itself satisfy any cross-section or capstone credential.

**Newbie-friendly description:** You finished Phase 1, the 'Independent Practitioner' phase (sections 14 through 26). 'Independent practitioner' here means the curriculum is no longer walking you step-by-step through every line of code. This marker says you completed the walk; it does not say you are now a Senior anything. It just says you did the work.

---

### `progress_phase2_walked` — Phase 2 — Advanced Walked

- **Capability level:** `advanced_applied`
- **Credential type:** `local_achievement`
- **Verification mode:** `local_only`
- **Status:** `active`
- **Roles aligned:** `data_analyst`, `data_scientist`, `rpa_automation_developer`, `ai_ml_engineer`, `production_python_engineer`
- **Skill nodes (23):** `python_async`, `async_testing`, `llmops`, `mlops_pipelines`, `model_deployment`, `drift_monitoring`, `security_mindset`, `observability`, `cloud_platform`, `data_cleaning`, `system_design`, `classical_ml`, `deep_learning`, `uncertainty_quantification`, `architecture_leadership`, `tradeoff_articulation`, `performance_tuning`, `sql_fundamentals`, `sql_window_ctes`, `data_validation`, `business_framing`, `metric_design`, `stakeholder_translation`
- **Critical competencies (0):** _none_
- **Prerequisites:** `progress_phase1_walked`

**Public claim:** The learner has completed all 13 sections of PyArcana Phase 2 (Advanced Applied): S27 through S39, including the You Do project, self-check, and section exam for each section.

**Non-claims:**
- Motivational marker only; NOT proof of advanced proficiency.
- Does not certify any role, level, or seniority.

**Newbie-friendly description:** You finished Phase 2, the 'Advanced Applied' phase (sections 27 through 39). 'Advanced applied' means the work gets more open-ended: fewer handrails, more design decisions. This marker is just a motivational record that you walked through every section, You Do, and self-check. It is not a job title.

---

### `progress_phase3_walked` — Phase 3 — Mastery Walked

- **Capability level:** `integrated_mastery`
- **Credential type:** `local_achievement`
- **Verification mode:** `local_only`
- **Status:** `active`
- **Roles aligned:** `data_analyst`, `data_scientist`, `rpa_automation_developer`, `ai_ml_engineer`, `production_python_engineer`
- **Skill nodes (26):** `architecture_leadership`, `system_design`, `code_review_literacy`, `deep_learning`, `llmops`, `mlops_pipelines`, `drift_monitoring`, `observability`, `data_cleaning`, `python_core`, `ci_cd`, `cloud_platform`, `docker`, `kubernetes`, `performance_tuning`, `git_workflow`, `mentoring`, `security_mindset`, `ai_code_review_literacy`, `stakeholder_management`, `data_validation`, `stakeholder_translation`, `oral_communication`, `written_communication`, `business_framing`, `tradeoff_articulation`
- **Critical competencies (0):** _none_
- **Prerequisites:** `progress_phase2_walked`

**Public claim:** The learner has completed all 13 sections of PyArcana Phase 3 (Integrated Mastery): S40 through S52, including the You Do project, self-check, and section exam for each section.

**Non-claims:**
- Motivational marker only; NOT proof of mastery.
- Does not certify any role, level, or seniority.
- Does not authorize use of the word 'Master' or 'Senior' in any occupational context.

**Newbie-friendly description:** You finished Phase 3, the 'Integrated Mastery' phase (sections 40 through 52). 'Integrated mastery' here is a curriculum-internal label meaning the work pulls together everything from earlier phases into one synthetic project. It is NOT an industry job title. This marker just says you walked through the section work.

---

### `progress_journey_completed` — PyArcana Journey Completed

- **Capability level:** `integrated_mastery`
- **Credential type:** `local_achievement`
- **Verification mode:** `local_only`
- **Status:** `active`
- **Roles aligned:** `data_analyst`, `data_scientist`, `rpa_automation_developer`, `ai_ml_engineer`, `production_python_engineer`
- **Skill nodes (0):** _none_
- **Critical competencies (0):** _none_
- **Prerequisites:** `progress_phase0_walked`, `progress_phase1_walked`, `progress_phase2_walked`, `progress_phase3_walked`

**Public claim:** The learner has walked all 52 sections of PyArcana and completed every You Do, self-check, and section exam, plus every phase-level capstone referenced in the curriculum (CP-N1-A through CP-N4-C and CP-FINAL).

**Non-claims:**
- Motivational marker only; NOT proof of any occupational competency.
- Does not certify any role, level, or seniority.
- Does not by itself satisfy any applied-skill or capstone credential rubric; it only records that the guided learning journey was walked.

**Newbie-friendly description:** You walked the whole course: all 52 sections, all 13 capstones (a capstone is a larger project at the end of a curriculum phase that pulls together everything you learned). This marker says you finished the journey. It does NOT say you are job-ready for any specific role — that's what the verified credentials further down the stack are for.

---

## Family 2 — Applied-skill badges (competency_badge)

Narrow, evidence-based badges proving a bounded skill bundle
through independent work. Server-verified issuance on the
dynamic LMS edition; eligibility preview only on the static
GitHub Pages edition. Expire after 3 years.


### `python_data_foundations` — Python Data Foundations

- **Capability level:** `foundation`
- **Credential type:** `competency_badge`
- **Verification mode:** `server_verified`
- **Status:** `active`
- **Roles aligned:** `data_analyst`, `data_scientist`, `rpa_automation_developer`, `ai_ml_engineer`, `production_python_engineer`
- **Skill nodes (8):** `python_core`, `python_idioms`, `git_workflow`, `packaging_reproducibility`, `testing_discipline`, `code_review_literacy`, `security_mindset`, `data_validation`
- **Critical competencies (1):** `reproducibility_determinism`
- **Prerequisites:** _none — entry point_

**Public claim:** The learner has independently demonstrated bounded Python fundamentals — interpreter setup, version control with Git, modules and functions, idiomatic Python patterns, OOP basics, and a working test discipline — by passing section exams and completing section You Do projects above the provisional floor.

**Non-claims:**
- Does not certify the learner as a Python Developer or any role.
- Does not include pandas, NumPy, SQL, or visualization at this level.
- Does not imply production-grade Python (no type-safety or observability evidence is collected).
- Does not exempt the learner from any subsequent badge's prerequisites.

**Newbie-friendly description:** You can set up a Python project from scratch (install Python, create a virtual environment so dependencies don't clash, push your code to Git so it's version-controlled), write idiomatic Python (idiomatic means 'the natural way Python programmers write it', e.g. list comprehensions instead of for-loops), use functions and modules to organize code, and write basic tests. This badge says you can do those things independently — not just follow along with an instructor.

---

### `independent_data_preparation` — Independent Data Preparation

- **Capability level:** `foundation`
- **Credential type:** `competency_badge`
- **Verification mode:** `server_verified`
- **Status:** `active`
- **Roles aligned:** `data_analyst`, `data_scientist`
- **Skill nodes (4):** `pandas_numpy`, `descriptive_stats`, `data_cleaning`, `data_validation`
- **Critical competencies (1):** `reproducibility_determinism`
- **Prerequisites:** `python_data_foundations`

**Public claim:** The learner has independently demonstrated data preparation competency — descriptive statistics, pandas/NumPy manipulation, data cleaning, schema validation — through You Do projects and section exams above the provisional floor, plus an integrator exercise on a real (messy) dataset.

**Non-claims:**
- Does not certify the learner as a Data Analyst or Data Scientist.
- Does not include SQL, BI dashboards, or statistical inference.
- Does not include leakage prevention or causal inference.

**Newbie-friendly description:** You can take a messy dataset (the kind real companies have, with missing values, wrong types, and duplicates) and clean it up using pandas (the most popular Python library for tabular data) and NumPy (the numerical computing library pandas is built on). You can compute basic descriptive statistics (mean, median, standard deviation) and write validation checks that catch data errors before they reach downstream code. This is independent work — not following a tutorial.

---

### `applied_analytical_reasoning` — Applied Analytical Reasoning

- **Capability level:** `foundation`
- **Credential type:** `competency_badge`
- **Verification mode:** `server_verified`
- **Status:** `active`
- **Roles aligned:** `data_analyst`, `data_scientist`, `ai_ml_engineer`
- **Skill nodes (4):** `python_visualization`, `bi_tools`, `classical_ml`, `model_evaluation`
- **Critical competencies (1):** `reproducibility_determinism`
- **Prerequisites:** `independent_data_preparation`

**Public claim:** The learner has independently demonstrated applied analytical reasoning — building Python visualizations, publishing a basic BI-style dashboard, training and evaluating a classical ML model with appropriate metrics — through You Do projects and section exams above the provisional floor.

**Non-claims:**
- Does not certify the learner as a Data Analyst or Data Scientist.
- Does not include leakage prevention, A/B testing, or causal inference at this level.
- Does not imply production-grade ML deployment.

**Newbie-friendly description:** You can take cleaned data and (a) draw charts that communicate a point using matplotlib/Seaborn/Plotly (Python visualization libraries), (b) build a simple BI dashboard (BI = Business Intelligence; tools like Tableau, Power BI, or Looker turn data into interactive views for non-technical stakeholders), and (c) train a classical ML model (classical = scikit-learn algorithms like Random Forest or Logistic Regression, as opposed to deep neural networks) and evaluate it with appropriate metrics. Independent work only.

---

### `reliable_automation_development` — Reliable Automation Development

- **Capability level:** `foundation`
- **Credential type:** `competency_badge`
- **Verification mode:** `server_verified`
- **Status:** `active`
- **Roles aligned:** `rpa_automation_developer`
- **Skill nodes (4):** `python_rpa_browser`, `process_analysis`, `exception_handling_rpa`, `selector_design`
- **Critical competencies (2):** `selector_resilience`, `reproducibility_determinism`
- **Prerequisites:** `python_data_foundations`

**Public claim:** The learner has independently demonstrated reliable browser-automation development — Python-based RPA with Playwright, process analysis, selector design, and exception handling — through You Do projects and section exams above the provisional floor.

**Non-claims:**
- Does not certify the learner as an RPA Developer.
- Does not include UiPath, Automation Anywhere, or Power Automate (PyArcana's RPA track is Python-based by design).
- Does not include REFramework or Orchestrator operations (out-of-current-scope; see curriculum gap analysis).
- Selector resilience is assessed against a documented UI change scenario, not against an enterprise-scale deployment.

**Newbie-friendly description:** You can build a Python-based automation script (using Playwright or Selenium — libraries that drive a browser programmatically) that doesn't break the moment the website changes. 'Selector design' means picking stable references to page elements (like CSS IDs or data-test attributes) instead of brittle ones (like the third button on the page). 'Exception handling' means your script recovers gracefully when something goes wrong, instead of crashing. RPA (Robotic Process Automation) is the broader field of automating repetitive computer tasks.

---

### `applied_sql_query_development` — Applied SQL Query Development

- **Capability level:** `independent_practitioner`
- **Credential type:** `competency_badge`
- **Verification mode:** `server_verified`
- **Status:** `pilot`
- **Roles aligned:** `data_analyst`, `data_scientist`
- **Skill nodes (2):** `sql_fundamentals`, `sql_window_ctes`
- **Critical competencies (1):** `sql_competency`
- **Prerequisites:** `python_data_foundations`

**Public claim:** The learner has independently demonstrated applied SQL competency — SELECT/JOIN/GROUP BY, ORM-mapped queries, window functions and CTEs — through You Do projects and section exams above the provisional floor.

**Non-claims:**
- Does not certify the learner as a Data Analyst or Data Scientist.
- Does NOT include SQL performance tuning (query plans, indexes, partitioning). This sub-competency is a known curriculum gap; the badge is issued at 'pilot' status until Phase 4 closes the gap. Holders of the pilot badge must not represent SQL performance-tuning competency.
- Critical competency `sql_competency` is therefore assessed at partial coverage (2 of 3 sub-skills).

**Newbie-friendly description:** You can write SQL (Structured Query Language — the standard language for talking to databases) at the level hiring managers expect: SELECT, JOIN, GROUP BY (which groups rows that share a value), window functions (computations across a set of rows related to the current row, like running totals), and CTEs (Common Table Expressions — named subqueries that make complex queries readable). This is the skill that hiring managers auto-reject candidates for missing. NOTE: This badge is at 'pilot' status because the curriculum doesn't yet teach SQL performance tuning (making queries fast on big tables). Holders should not claim performance-tuning expertise.

---

### `production_python_delivery_foundations` — Production Python Delivery Foundations

- **Capability level:** `independent_practitioner`
- **Credential type:** `competency_badge`
- **Verification mode:** `server_verified`
- **Status:** `pilot`
- **Roles aligned:** `production_python_engineer`, `ai_ml_engineer`, `data_scientist`
- **Skill nodes (6):** `packaging_reproducibility`, `ci_cd`, `python_core`, `python_idioms`, `system_design`, `testing_discipline`
- **Critical competencies (2):** `type_safety_production_hardening`, `reproducibility_determinism`
- **Prerequisites:** `python_data_foundations`

**Public claim:** The learner has independently demonstrated production-ready Python delivery foundations — packaging, CI/CD, FastAPI service design, and a working test discipline — through You Do projects and section exams above the provisional floor.

**Non-claims:**
- Does not certify the learner as a Production Python Engineer or Software Engineer.
- Does NOT include static type checking with mypy/Pyright. `python_type_safety` is a known curriculum gap; the badge is issued at 'pilot' status until Phase 4 closes the gap.
- Does not include observability, Kubernetes, or advanced performance tuning at this level.

**Newbie-friendly description:** You can package Python code so other people can install and run it (with a `pyproject.toml` file and pinned dependencies), set up CI/CD (Continuous Integration / Continuous Deployment — automated pipelines that run tests and deploy code when you push), build a FastAPI service (a modern Python web framework), and write tests for it. NOTE: 'Pilot' status because the curriculum doesn't yet teach type annotations and mypy/Pyright (tools that catch type errors before runtime). Holders should not claim type-safety expertise until Phase 4 closes this gap.

---

### `responsible_machine_learning_evaluation` — Responsible Machine Learning Evaluation

- **Capability level:** `independent_practitioner`
- **Credential type:** `competency_badge`
- **Verification mode:** `server_verified`
- **Status:** `pilot`
- **Roles aligned:** `data_scientist`, `ai_ml_engineer`
- **Skill nodes (3):** `classical_ml`, `model_evaluation`, `deep_learning`
- **Critical competencies (2):** `leakage_prevention`, `reproducibility_determinism`
- **Prerequisites:** `applied_analytical_reasoning`

**Public claim:** The learner has independently demonstrated responsible ML evaluation — training and evaluating classical and deep learning models with appropriate metrics and a written evaluation memo — through You Do projects and section exams above the provisional floor.

**Non-claims:**
- Does not certify the learner as a Data Scientist or AI/ML Engineer.
- Does NOT include data leakage prevention as a graded skill. `leakage_prevention` is a known curriculum gap; the badge is issued at 'pilot' status until Phase 4 closes the gap. Holders must not represent leakage-prevention competency.
- Does not include production deployment, drift monitoring, or uncertainty quantification at this level.

**Newbie-friendly description:** You can train a machine-learning model (both classical models like Random Forest and deep-learning models built with PyTorch or TensorFlow) and evaluate it honestly. 'Evaluate honestly' means picking metrics that match the business question (not just accuracy), comparing to a baseline, and writing down where the model fails. NOTE: 'Pilot' status because the curriculum doesn't yet teach data leakage prevention (the #1 way ML evaluations become lies — when info from the test set accidentally leaks into training). Holders should not claim leakage-prevention expertise until Phase 4 closes this gap.

---

### `applied_rag_llm_service_development` — Applied RAG and LLM Service Development

- **Capability level:** `independent_practitioner`
- **Credential type:** `competency_badge`
- **Verification mode:** `server_verified`
- **Status:** `active`
- **Roles aligned:** `ai_ml_engineer`, `production_python_engineer`
- **Skill nodes (4):** `llmops`, `python_core`, `system_design`, `testing_discipline`
- **Critical competencies (1):** `reproducibility_determinism`
- **Prerequisites:** `production_python_delivery_foundations`

**Public claim:** The learner has independently demonstrated applied RAG and LLM service development — building a Retrieval-Augmented Generation pipeline, exposing it as a tested FastAPI service, and documenting design tradeoffs — through You Do projects and section exams above the provisional floor.

**Non-claims:**
- Does not certify the learner as an AI/ML Engineer.
- Does not include LLM fine-tuning, graph-RAG, or production LLMOps (those are separate, later badges).
- Does not claim the LLM is 'safe' or 'aligned' — only that the service architecture is sound.

**Newbie-friendly description:** You can build a RAG application (RAG = Retrieval-Augmented Generation; it means: when the LLM is asked a question, first search a knowledge base for relevant context, then feed that context to the LLM so its answer is grounded in your data instead of made up) and expose it as a FastAPI web service with tests. 'LLM' = Large Language Model, like GPT or Claude.

---

### `reliable_async_python_development` — Reliable Async Python Development

- **Capability level:** `advanced_applied`
- **Credential type:** `competency_badge`
- **Verification mode:** `server_verified`
- **Status:** `active`
- **Roles aligned:** `production_python_engineer`, `ai_ml_engineer`, `data_scientist`
- **Skill nodes (5):** `python_async`, `async_testing`, `llmops`, `observability`, `data_cleaning`
- **Critical competencies (1):** `reproducibility_determinism`
- **Prerequisites:** `production_python_delivery_foundations`

**Public claim:** The learner has independently demonstrated reliable async Python development — asyncio, async testing with pytest-asyncio, LLM agent orchestration, and observable streaming data processing — through You Do projects and section exams above the provisional floor.

**Non-claims:**
- Does not certify the learner as a Production Python Engineer.
- Does not include distributed-systems mastery or k8s operation.
- Does not by itself satisfy the Production Python Delivery Foundations badge's type-safety requirements.

**Newbie-friendly description:** You can write async Python (using `async`/`await` and the `asyncio` library so your program can do many things at once instead of waiting for each one in turn — important when calling slow APIs or databases). You can test async code with `pytest-asyncio` (a pytest plugin for async tests), orchestrate LLM agents (programs that decide what to call next on an LLM), and process streaming data (data that arrives continuously, like logs or sensor readings) with proper observability (logging, metrics, and tracing so you can see what your code is doing).

---

### `applied_mlops_pipeline_delivery` — Applied MLOps Pipeline Delivery

- **Capability level:** `advanced_applied`
- **Credential type:** `competency_badge`
- **Verification mode:** `server_verified`
- **Status:** `active`
- **Roles aligned:** `ai_ml_engineer`, `data_scientist`
- **Skill nodes (5):** `mlops_pipelines`, `model_deployment`, `drift_monitoring`, `observability`, `llmops`
- **Critical competencies (2):** `mlops_fluency`, `reproducibility_determinism`
- **Prerequisites:** `production_python_delivery_foundations`, `applied_rag_llm_service_development`

**Public claim:** The learner has independently demonstrated applied MLOps pipeline delivery — model deployment, drift monitoring, retraining triggers, and pipeline observability — through You Do projects and section exams above the provisional floor.

**Non-claims:**
- Does not certify the learner as an AI/ML Engineer.
- Does not include deep-learning model architecture design or fine-tuning at this level.
- Does not by itself satisfy the Responsible ML Evaluation badge's leakage-prevention requirement (which remains at 'pilot' status).

**Newbie-friendly description:** You can deploy a machine-learning model to production (not just save it to a file, but serve it behind an API with health checks and latency budgets), monitor it for drift (drift = the data the model sees in production slowly changing until predictions become wrong), trigger retrains automatically when drift is detected, and make the whole pipeline observable (so you can debug it when things break). MLOps (Machine Learning Operations) is the engineering discipline of running ML in production.

---

### `production_python_hardening_practice` — Production Python Hardening Practice

- **Capability level:** `advanced_applied`
- **Credential type:** `competency_badge`
- **Verification mode:** `server_verified`
- **Status:** `pilot`
- **Roles aligned:** `production_python_engineer`, `ai_ml_engineer`
- **Skill nodes (6):** `security_mindset`, `observability`, `cloud_platform`, `system_design`, `python_async`, `performance_tuning`
- **Critical competencies (2):** `type_safety_production_hardening`, `reproducibility_determinism`
- **Prerequisites:** `production_python_delivery_foundations`, `reliable_async_python_development`

**Public claim:** The learner has independently demonstrated production Python hardening — security mindset, observability, cloud-platform deployment, async service design, and performance tuning — through You Do projects and section exams above the provisional floor.

**Non-claims:**
- Does not certify the learner as a Senior Production Python Engineer.
- Does NOT include static type-safety evidence (pilot badge until Phase 4 closes the gap).
- Does not include Kubernetes operation at this level (separate, later badge).

**Newbie-friendly description:** You can harden a Python service for production: apply a security mindset (OWASP Top 10 — the standard list of web-app security risks like injection and broken authentication), instrument it with observability (structured logs in JSON, OpenTelemetry tracing, Prometheus metrics), deploy to a cloud platform (AWS, GCP, or Azure), and tune its performance (profiling, bottleneck-finding, optimization). NOTE: 'Pilot' status because static type-safety (mypy/Pyright) is still a curriculum gap.

---

### `applied_deep_learning_practice` — Applied Deep Learning Practice

- **Capability level:** `advanced_applied`
- **Credential type:** `competency_badge`
- **Verification mode:** `server_verified`
- **Status:** `pilot`
- **Roles aligned:** `ai_ml_engineer`, `data_scientist`
- **Skill nodes (4):** `classical_ml`, `deep_learning`, `uncertainty_quantification`, `python_core`
- **Critical competencies (2):** `leakage_prevention`, `reproducibility_determinism`
- **Prerequisites:** `responsible_machine_learning_evaluation`

**Public claim:** The learner has independently demonstrated applied deep-learning practice — training deep neural networks, evaluating uncertainty, comparing to classical baselines — through You Do projects and section exams above the provisional floor.

**Non-claims:**
- Does not certify the learner as an AI/ML Engineer.
- Does NOT include data leakage prevention as a graded skill (pilot badge; see curriculum gap).
- Does not include LLM fine-tuning or production serving.

**Newbie-friendly description:** You can train deep neural networks (multi-layer models like CNNs for images or transformers for text, using PyTorch or TensorFlow), quantify their uncertainty (a model that says 'I'm 90% sure' should be right ~90% of the time; if it says 'I'm 90% sure' but is right only 60% of the time, it's badly calibrated), and compare deep-learning results to a classical baseline (a simpler model like Random Forest) so you can argue whether the extra complexity was worth it. NOTE: 'Pilot' status because leakage prevention is a curriculum gap.

---

### `architecture_decision_practice` — Architecture Decision Practice

- **Capability level:** `integrated_mastery`
- **Credential type:** `competency_badge`
- **Verification mode:** `server_verified`
- **Status:** `active`
- **Roles aligned:** `production_python_engineer`, `ai_ml_engineer`, `rpa_automation_developer`
- **Skill nodes (4):** `system_design`, `architecture_leadership`, `tradeoff_articulation`, `code_review_literacy`
- **Critical competencies (3):** `business_framing_judgment`, `communication_audience_tuned`, `reproducibility_determinism`
- **Prerequisites:** `production_python_delivery_foundations`, `reliable_async_python_development`

**Public claim:** The learner has independently demonstrated architecture-decision practice — system design, DDD (domain-driven design) decisions, code-review literacy, and tradeoff articulation — through You Do projects and section exams above the provisional floor.

**Non-claims:**
- Does not certify the learner as a Senior Engineer, Staff Engineer, or Architect.
- Does not certify team-leadership or multi-team multiplier impact.
- Architecture decisions are assessed against a documented scenario, not against multi-quarter enterprise rollout.

**Newbie-friendly description:** You can make and document architecture decisions for a software system. 'System design' = deciding how to break a system into services, what each one does, and how they talk. 'DDD' (Domain-Driven Design) = modeling the code around the real-world business domain so the code structure matches how the business thinks. 'Tradeoff articulation' = writing down at least two options, their pros and cons, the choice you made, and when you'd revisit it. You can also do code review (reading others' code constructively to catch bugs and suggest improvements).

---

### `llmops_production_delivery` — LLMOps Production Delivery

- **Capability level:** `integrated_mastery`
- **Credential type:** `competency_badge`
- **Verification mode:** `server_verified`
- **Status:** `active`
- **Roles aligned:** `ai_ml_engineer`
- **Skill nodes (7):** `deep_learning`, `llmops`, `mlops_pipelines`, `drift_monitoring`, `observability`, `data_cleaning`, `python_core`
- **Critical competencies (2):** `mlops_fluency`, `reproducibility_determinism`
- **Prerequisites:** `applied_rag_llm_service_development`, `applied_mlops_pipeline_delivery`

**Public claim:** The learner has independently demonstrated LLMOps production delivery — fine-tuning, graph-RAG, drift monitoring, observability — through You Do projects and section exams above the provisional floor.

**Non-claims:**
- Does not certify the learner as a Senior AI/ML Engineer.
- Does not include multimodal model training or GPU-compute tuning.
- Does not claim the LLM is 'safe' or 'aligned' — only that the production LLMOps pipeline is sound.

**Newbie-friendly description:** You can run an LLM (Large Language Model) in production: fine-tune it (continue training on your own data so it's better at your specific task), build a graph-RAG (RAG where the retrieval uses a knowledge graph — a network of entities and their relationships — instead of plain text search), monitor it for drift (LLM behavior changes when the input distribution shifts), and observe it in production (logs, metrics, tracing). LLMOps (Large Language Model Operations) is the engineering discipline of running LLMs in production.

---

### `container_platform_engineering_practice` — Container Platform Engineering Practice

- **Capability level:** `integrated_mastery`
- **Credential type:** `competency_badge`
- **Verification mode:** `server_verified`
- **Status:** `pilot`
- **Roles aligned:** `production_python_engineer`, `ai_ml_engineer`
- **Skill nodes (6):** `ci_cd`, `cloud_platform`, `docker`, `kubernetes`, `deep_learning`, `performance_tuning`
- **Critical competencies (2):** `type_safety_production_hardening`, `reproducibility_determinism`
- **Prerequisites:** `production_python_delivery_foundations`, `production_python_hardening_practice`

**Public claim:** The learner has independently demonstrated container-platform engineering practice — Docker, Kubernetes, CI/CD, cloud platforms, and GPU performance tuning — through You Do projects and section exams above the provisional floor.

**Non-claims:**
- Does not certify the learner as a Senior Production Python Engineer or DevOps Engineer.
- Does not include multi-region failover or service-mesh operation.
- Does NOT include static type-safety evidence (pilot badge until Phase 4 closes the gap).

**Newbie-friendly description:** You can deploy software using containers (Docker — packages your code plus its dependencies into a single runnable unit so it behaves the same everywhere) and orchestrate them at scale (Kubernetes — manages many containers across many machines, handling restarts, scaling, and networking). You can do this via CI/CD (automated deployment pipelines) on a cloud platform (AWS, GCP, or Azure), including for GPU workloads (deep-learning training that needs specialized graphics-card hardware). NOTE: 'Pilot' status because static type-safety is still a curriculum gap.

---

### `ai_governance_code_review_practice` — AI Governance and Code Review Practice

- **Capability level:** `integrated_mastery`
- **Credential type:** `competency_badge`
- **Verification mode:** `server_verified`
- **Status:** `active`
- **Roles aligned:** `production_python_engineer`, `ai_ml_engineer`, `data_scientist`
- **Skill nodes (8):** `code_review_literacy`, `git_workflow`, `mentoring`, `security_mindset`, `ai_code_review_literacy`, `data_validation`, `data_cleaning`, `stakeholder_translation`
- **Critical competencies (3):** `business_framing_judgment`, `communication_audience_tuned`, `reproducibility_determinism`
- **Prerequisites:** `architecture_decision_practice`, `container_platform_engineering_practice`

**Public claim:** The learner has independently demonstrated AI-governance and code-review practice — open-source contribution, AI code-review literacy, AI governance, data-contract design, stakeholder translation — through You Do projects and section exams above the provisional floor.

**Non-claims:**
- Does not certify the learner as a Senior Engineer, Tech Lead, or AI Governance Officer.
- Does not include formal legal/compliance sign-off authority.
- Does not by itself satisfy the Container Platform Engineering or LLMOps Production Delivery badges' production requirements.

**Newbie-friendly description:** You can review AI-generated code critically (not just accept what Copilot or Cursor suggests — check it for bugs, security issues, and correctness), contribute to open-source projects (public codebases where anyone can submit changes via Pull Requests), apply AI governance (rules and processes for responsible AI use in an organization), design data contracts (explicit agreements between teams about what shape data will have, so downstream code doesn't break when schemas change), and translate technical findings for non-technical stakeholders.

---

## Family 3 — Cross-section capability badges (competency_badge)

Synthesis badges requiring multiple sections' skills plus an
integrated project. Server-verified only. Expire after 3 years.


### `integrated_data_analyst_practice` — Integrated Data Analyst Practice

- **Capability level:** `independent_practitioner`
- **Credential type:** `competency_badge`
- **Verification mode:** `server_verified`
- **Status:** `active`
- **Roles aligned:** `data_analyst`
- **Skill nodes (17):** `python_core`, `python_idioms`, `git_workflow`, `packaging_reproducibility`, `pandas_numpy`, `descriptive_stats`, `data_cleaning`, `data_validation`, `python_visualization`, `bi_tools`, `classical_ml`, `model_evaluation`, `sql_fundamentals`, `sql_window_ctes`, `business_framing`, `stakeholder_translation`, `written_communication`
- **Critical competencies (4):** `sql_competency`, `reproducibility_determinism`, `communication_audience_tuned`, `business_framing_judgment`
- **Prerequisites:** `python_data_foundations`, `independent_data_preparation`, `applied_analytical_reasoning`, `applied_sql_query_development`

**Public claim:** The learner has independently synthesized Python data foundations, independent data preparation, applied analytical reasoning, and applied SQL query development into a single integrated Data Analyst-style project with a documented business framing, a reproducible pipeline, and an audience-tuned writeup.

**Non-claims:**
- Does not certify the learner as a Data Analyst at any seniority level (Junior, Mid, Senior, Lead, etc.).
- Does not include production BI deployment or experimental design.
- SQL performance tuning is NOT included (curriculum gap; the Applied SQL Query Development badge is at pilot status).

**Newbie-friendly description:** You can do an end-to-end Data-Analyst-style project: frame a business question (what decision will this answer support?), pull data with SQL (including window functions and CTEs — see the Applied SQL badge description), clean and validate it with pandas, compute descriptive statistics, build a Python visualization and a BI dashboard, train a simple classical ML model as a baseline, and write a 1-pager a non-technical PM (Project Manager) can act on. 'Integrated' means you do all of this in one project, not as disconnected exercises. NOTE: this badge does NOT make you a 'Data Analyst' — that's a job title that depends on the company. It says you can do Data-Analyst-style work independently.

---

### `integrated_data_science_practice` — Integrated Data Science Practice

- **Capability level:** `independent_practitioner`
- **Credential type:** `competency_badge`
- **Verification mode:** `server_verified`
- **Status:** `pilot`
- **Roles aligned:** `data_scientist`
- **Skill nodes (19):** `python_core`, `python_idioms`, `git_workflow`, `packaging_reproducibility`, `pandas_numpy`, `descriptive_stats`, `data_cleaning`, `data_validation`, `python_visualization`, `bi_tools`, `classical_ml`, `model_evaluation`, `deep_learning`, `sql_fundamentals`, `sql_window_ctes`, `business_framing`, `stakeholder_translation`, `written_communication`, `metric_design`
- **Critical competencies (5):** `sql_competency`, `leakage_prevention`, `reproducibility_determinism`, `communication_audience_tuned`, `business_framing_judgment`
- **Prerequisites:** `python_data_foundations`, `independent_data_preparation`, `applied_analytical_reasoning`, `applied_sql_query_development`, `responsible_machine_learning_evaluation`

**Public claim:** The learner has independently synthesized Python data foundations, independent data preparation, applied analytical reasoning, applied SQL query development, and responsible ML evaluation into a single integrated Data-Science-style project with a documented model card, leakage-prevention review, and an audience-tuned writeup.

**Non-claims:**
- Does not certify the learner as a Data Scientist at any seniority level (Junior, Mid, Senior, Staff, Principal).
- Leakage prevention is NOT yet a graded skill (curriculum gap; the Responsible ML Evaluation badge is at pilot status). The integrated project rubric requires the learner to articulate leakage risks from first principles instead.
- Does not include causal inference, A/B testing, or experimental design at this level (curriculum gaps; deferred to Phase 4).
- Does not include production deployment (deferred to integrated_ml_engineering_practice).

**Newbie-friendly description:** You can do an end-to-end Data-Science-style project: everything in the Data Analyst integrated project, PLUS train and evaluate a machine-learning model (classical or deep learning) and write a model card (a short document describing what the model does, what data it was trained on, how it was evaluated, where it fails, and how it should be used). You must articulate — from first principles — how you prevented data leakage (the #1 way ML evaluations become lies). NOTE: 'Pilot' status because the curriculum doesn't yet teach leakage prevention formally; you have to demonstrate it via a supplementary exercise. NOTE: this badge does NOT make you a 'Data Scientist' — that's a job title. It says you can do Data-Science-style work independently.

---

### `integrated_ml_engineering_practice` — Integrated ML Engineering Practice

- **Capability level:** `advanced_applied`
- **Credential type:** `competency_badge`
- **Verification mode:** `server_verified`
- **Status:** `pilot`
- **Roles aligned:** `ai_ml_engineer`
- **Skill nodes (18):** `python_core`, `python_idioms`, `git_workflow`, `packaging_reproducibility`, `classical_ml`, `model_evaluation`, `deep_learning`, `llmops`, `system_design`, `testing_discipline`, `ci_cd`, `mlops_pipelines`, `model_deployment`, `drift_monitoring`, `observability`, `business_framing`, `stakeholder_translation`, `metric_design`
- **Critical competencies (5):** `leakage_prevention`, `mlops_fluency`, `reproducibility_determinism`, `communication_audience_tuned`, `business_framing_judgment`
- **Prerequisites:** `python_data_foundations`, `applied_analytical_reasoning`, `responsible_machine_learning_evaluation`, `applied_rag_llm_service_development`, `applied_mlops_pipeline_delivery`

**Public claim:** The learner has independently synthesized Python data foundations, applied analytical reasoning, responsible ML evaluation, RAG/LLM service development, and applied MLOps pipeline delivery into a single integrated ML-Engineering-style project with a deployed model, a drift-monitoring stub, and an audience-tuned handoff document.

**Non-claims:**
- Does not certify the learner as an AI/ML Engineer at any seniority level (Junior, Mid, Senior, Staff, Principal).
- Leakage prevention is NOT yet a graded skill (curriculum gap).
- Does not include multimodal or GPU-compute optimization at this level (deferred to LLMOps Production Delivery).

**Newbie-friendly description:** You can do an end-to-end ML-Engineering-style project: train a model, deploy it as a service behind an API with health checks and latency budgets, wire it into a CI/CD pipeline that retrains on drift, monitor it in production, and hand it off to a stakeholder with a 1-page writeup. NOTE: 'Pilot' status because leakage prevention is a curriculum gap. NOTE: this badge does NOT make you an 'AI/ML Engineer' — that's a job title. It says you can do ML-Engineering-style work independently.

---

### `integrated_automation_engineering_practice` — Integrated Automation Engineering Practice

- **Capability level:** `independent_practitioner`
- **Credential type:** `competency_badge`
- **Verification mode:** `server_verified`
- **Status:** `active`
- **Roles aligned:** `rpa_automation_developer`
- **Skill nodes (13):** `python_core`, `python_idioms`, `git_workflow`, `packaging_reproducibility`, `python_rpa_browser`, `process_analysis`, `exception_handling_rpa`, `selector_design`, `llmops`, `system_design`, `testing_discipline`, `business_framing`, `stakeholder_translation`
- **Critical competencies (4):** `selector_resilience`, `reproducibility_determinism`, `communication_audience_tuned`, `business_framing_judgment`
- **Prerequisites:** `python_data_foundations`, `reliable_automation_development`, `applied_rag_llm_service_development`

**Public claim:** The learner has independently synthesized Python data foundations, reliable automation development, and RAG/LLM service development into a single integrated Automation-Engineering-style project with a process-decomposition memo, a UI-change-resilient bot, and an audience-tuned handoff document.

**Non-claims:**
- Does not certify the learner as an RPA Developer at any seniority level (Junior, Mid, Senior, Lead).
- Does not include UiPath, Automation Anywhere, Power Automate, or REFramework (PyArcana's RPA track is Python-based).
- Selector resilience is assessed against a documented UI change scenario, not against enterprise-scale deployment.

**Newbie-friendly description:** You can do an end-to-end Automation-Engineering-style project: decompose a business process (decide which steps to automate, which to re-engineer, which to leave alone — and write that down), build a Python-based bot that survives a documented UI change (using stable selectors + exception handling), wire it into a tested service, and hand it off with a 1-page writeup. NOTE: this badge does NOT make you an 'RPA Developer' — that's a job title. It says you can do Automation-Engineering-style work independently in PyArcana's Python-based RPA track.

---

### `integrated_production_python_practice` — Integrated Production Python Practice

- **Capability level:** `advanced_applied`
- **Credential type:** `competency_badge`
- **Verification mode:** `server_verified`
- **Status:** `pilot`
- **Roles aligned:** `production_python_engineer`
- **Skill nodes (16):** `python_core`, `python_idioms`, `git_workflow`, `packaging_reproducibility`, `ci_cd`, `system_design`, `testing_discipline`, `python_async`, `async_testing`, `observability`, `security_mindset`, `cloud_platform`, `performance_tuning`, `business_framing`, `stakeholder_translation`, `metric_design`
- **Critical competencies (4):** `type_safety_production_hardening`, `reproducibility_determinism`, `communication_audience_tuned`, `business_framing_judgment`
- **Prerequisites:** `python_data_foundations`, `production_python_delivery_foundations`, `reliable_async_python_development`, `production_python_hardening_practice`

**Public claim:** The learner has independently synthesized Python data foundations, production Python delivery foundations, reliable async Python development, and production Python hardening practice into a single integrated Production-Python-style service with containerized deployment, observability, security review, and an audience-tuned handoff document.

**Non-claims:**
- Does not certify the learner as a Senior Production Python Engineer or Senior Software Engineer.
- Does NOT include static type-safety evidence (pilot badge until Phase 4 closes the gap).
- Does not include Kubernetes operation at scale (deferred to Container Platform Engineering Practice).

**Newbie-friendly description:** You can do an end-to-end Production-Python-style project: package a Python service with proper dependency pinning, containerize it (Docker), deploy it on a cloud platform (AWS/GCP/Azure) via CI/CD, instrument it with observability (structured logs, OpenTelemetry tracing, Prometheus metrics), apply a security review (OWASP Top 10), tune its performance, and hand it off with a 1-page writeup. NOTE: 'Pilot' status because static type-safety (mypy/Pyright) is still a curriculum gap. NOTE: this badge does NOT make you a 'Production Python Engineer' — that's a job title. It says you can do Production-Python-style work independently.

---

## Family 4 — Capstone credentials (verified_credential)

Broadest credentials requiring synthesis, practical artifacts,
rubric performance, and explicit defense. Server-verified only.
Expire after 3 years.


### `integrated_python_ai_capstone_foundations` — Integrated Python and AI Capstone — Foundations

- **Capability level:** `foundation`
- **Credential type:** `verified_credential`
- **Verification mode:** `server_verified`
- **Status:** `active`
- **Roles aligned:** `data_analyst`, `data_scientist`, `rpa_automation_developer`, `ai_ml_engineer`, `production_python_engineer`
- **Skill nodes (19):** `python_core`, `python_idioms`, `git_workflow`, `packaging_reproducibility`, `pandas_numpy`, `descriptive_stats`, `data_cleaning`, `data_validation`, `python_visualization`, `bi_tools`, `classical_ml`, `model_evaluation`, `testing_discipline`, `performance_tuning`, `python_rpa_browser`, `process_analysis`, `exception_handling_rpa`, `code_review_literacy`, `security_mindset`
- **Critical competencies (2):** `reproducibility_determinism`, `communication_audience_tuned`
- **Prerequisites:** `progress_phase0_walked`, `python_data_foundations`, `independent_data_preparation`, `applied_analytical_reasoning`, `reliable_automation_development`

**Public claim:** The learner has completed and defended the three Phase 0 capstones (CP-N1-A, CP-N1-B, CP-N1-C) at rubric performance above the provisional floor, with a synthesis writeup demonstrating foundational-level capability across Python, data, automation, and visualization.

**Non-claims:**
- Does not certify the learner as any role at any seniority level.
- Does not imply job-readiness; it certifies only that the Phase 0 capstone synthesis was independently produced and defended at the foundational level.
- Foundational level means 'can apply with guidance'; it does NOT mean 'can apply independently in a production setting'.

**Newbie-friendly description:** You completed all three Phase 0 capstones (CP-N1-A, CP-N1-B, CP-N1-C — these are the larger projects at the end of Foundations that pull together everything you learned about Python, data, automation, and visualization), passed them at the rubric floor, and wrote a synthesis document that connects them. 'Capstone credential' is heavier than a 'badge' — it requires synthesis across multiple sub-projects and a defense (an oral or written explanation of your choices). 'Foundational' here means 'can apply with guidance' — NOT 'can apply independently in a production setting'.

---

### `integrated_python_ai_capstone_independent` — Integrated Python and AI Capstone — Independent

- **Capability level:** `independent_practitioner`
- **Credential type:** `verified_credential`
- **Verification mode:** `server_verified`
- **Status:** `active`
- **Roles aligned:** `data_analyst`, `data_scientist`, `rpa_automation_developer`, `ai_ml_engineer`, `production_python_engineer`
- **Skill nodes (24):** `security_mindset`, `python_core`, `python_idioms`, `packaging_reproducibility`, `stakeholder_management`, `ci_cd`, `data_cleaning`, `data_validation`, `pandas_numpy`, `sql_fundamentals`, `sql_window_ctes`, `llmops`, `system_design`, `testing_discipline`, `deep_learning`, `classical_ml`, `python_rpa_browser`, `selector_design`, `exception_handling_rpa`, `python_visualization`, `bi_tools`, `business_framing`, `process_analysis`, `stakeholder_translation`
- **Critical competencies (3):** `reproducibility_determinism`, `communication_audience_tuned`, `business_framing_judgment`
- **Prerequisites:** `integrated_python_ai_capstone_foundations`, `progress_phase1_walked`, `applied_sql_query_development`, `production_python_delivery_foundations`, `responsible_machine_learning_evaluation`, `applied_rag_llm_service_development`

**Public claim:** The learner has completed and defended the three Phase 1 capstones (CP-N2-A, CP-N2-B, CP-N2-C) at rubric performance above the provisional floor, with a synthesis writeup demonstrating independent-practitioner-level capability across security, packaging, SQL, RAG, deep learning, and automation.

**Non-claims:**
- Does not certify the learner as any role at any seniority level.
- Independent-practitioner level means 'can apply independently within a pre-scoped problem'; it does NOT mean 'can diagnose novel failure modes or design new systems unsupervised'.
- SQL performance tuning and leakage prevention are NOT included (curriculum gaps; relevant badges remain at pilot status).

**Newbie-friendly description:** You completed all three Phase 1 capstones (CP-N2-A, CP-N2-B, CP-N2-C — the integrator projects at the end of Independent Practitioner that pull together security, packaging, SQL, RAG, deep learning, and automation), passed them at the rubric floor, and wrote a synthesis document with explicit business framing. 'Independent practitioner' means you can do the work without step-by-step help, but you'd still ask a senior engineer to review your design before shipping it to production. NOTE: SQL performance tuning and leakage prevention are curriculum gaps, so they're not graded here.

---

### `integrated_python_ai_capstone_advanced_applied` — Integrated Python and AI Capstone — Advanced Applied

- **Capability level:** `advanced_applied`
- **Credential type:** `verified_credential`
- **Verification mode:** `server_verified`
- **Status:** `active`
- **Roles aligned:** `data_analyst`, `data_scientist`, `rpa_automation_developer`, `ai_ml_engineer`, `production_python_engineer`
- **Skill nodes (23):** `python_async`, `async_testing`, `llmops`, `mlops_pipelines`, `model_deployment`, `drift_monitoring`, `security_mindset`, `observability`, `cloud_platform`, `data_cleaning`, `system_design`, `classical_ml`, `deep_learning`, `uncertainty_quantification`, `architecture_leadership`, `tradeoff_articulation`, `performance_tuning`, `sql_fundamentals`, `sql_window_ctes`, `data_validation`, `business_framing`, `metric_design`, `stakeholder_translation`
- **Critical competencies (4):** `reproducibility_determinism`, `communication_audience_tuned`, `business_framing_judgment`, `mlops_fluency`
- **Prerequisites:** `integrated_python_ai_capstone_independent`, `progress_phase2_walked`, `reliable_async_python_development`, `applied_mlops_pipeline_delivery`, `production_python_hardening_practice`, `applied_deep_learning_practice`

**Public claim:** The learner has completed and defended the three Phase 2 capstones (CP-N3-A, CP-N3-B, CP-N3-C) at rubric performance above the provisional floor, with a synthesis writeup demonstrating advanced-applied-level capability across async Python, MLOps, security infrastructure, microservices, system design, and post-mortem practice.

**Non-claims:**
- Does not certify the learner as a Senior Engineer, Staff Engineer, or any role at any seniority level.
- Advanced-applied level means 'can diagnose and design within an existing system'; it does NOT mean 'can set technical strategy for an organization'.
- Leakage prevention and python_type_safety remain curriculum gaps; relevant badges remain at pilot status.

**Newbie-friendly description:** You completed all three Phase 2 capstones (CP-N3-A, CP-N3-B, CP-N3-C — the integrator projects at the end of Advanced Applied that pull together async Python, MLOps, security infrastructure, microservices, system design, and post-mortem practice), passed them at the rubric floor, and wrote a synthesis document with explicit business framing and metric design. 'Advanced applied' means you can diagnose problems in an existing system and design changes to fix them — but you'd still consult peers before setting strategy. A 'post-mortem' is a blameless writeup of what went wrong after an incident.

---

### `integrated_python_ai_capstone_integrated_mastery` — Integrated Python and AI Capstone — Integrated Mastery

- **Capability level:** `integrated_mastery`
- **Credential type:** `verified_credential`
- **Verification mode:** `server_verified`
- **Status:** `active`
- **Roles aligned:** `data_analyst`, `data_scientist`, `rpa_automation_developer`, `ai_ml_engineer`, `production_python_engineer`
- **Skill nodes (26):** `architecture_leadership`, `system_design`, `code_review_literacy`, `deep_learning`, `llmops`, `mlops_pipelines`, `drift_monitoring`, `observability`, `data_cleaning`, `python_core`, `ci_cd`, `cloud_platform`, `docker`, `kubernetes`, `performance_tuning`, `git_workflow`, `mentoring`, `security_mindset`, `ai_code_review_literacy`, `stakeholder_management`, `data_validation`, `stakeholder_translation`, `oral_communication`, `written_communication`, `business_framing`, `tradeoff_articulation`
- **Critical competencies (4):** `reproducibility_determinism`, `communication_audience_tuned`, `business_framing_judgment`, `mlops_fluency`
- **Prerequisites:** `integrated_python_ai_capstone_advanced_applied`, `progress_phase3_walked`, `architecture_decision_practice`, `llmops_production_delivery`, `container_platform_engineering_practice`, `ai_governance_code_review_practice`

**Public claim:** The learner has completed and defended the three Phase 3 capstones (CP-N4-A, CP-N4-B, CP-N4-C) at rubric performance above the provisional floor, with a synthesis writeup demonstrating integrated-mastery-level capability across architecture decisions, LLMOps, multimodal systems, infrastructure-as-code, GPU computing, open-source practice, AI governance, data contracts, and tech leadership.

**Non-claims:**
- Does not certify the learner as a Master, Senior, Staff, Principal, or Distinguished Engineer.
- 'Integrated mastery' here is a curriculum-internal label for the cognitive-load level at which the learner integrates multiple specialization areas into a single defended synthesis. It is NOT an industry seniority title.
- Type-safety and leakage-prevention gaps remain; relevant badges remain at pilot status.

**Newbie-friendly description:** You completed all three Phase 3 capstones (CP-N4-A, CP-N4-B, CP-N4-C — the integrator projects at the end of Phase 3 that pull together architecture decisions, LLMOps, multimodal systems, infrastructure-as-code, GPU computing, open-source practice, AI governance, data contracts, and tech leadership), passed them at the rubric floor, and wrote a synthesis document with explicit business framing, metric design, and tradeoff articulation. 'Integrated mastery' is PyArcana's curriculum-internal label for the highest cognitive-load level — it is NOT an industry title. You should NOT call yourself a 'Master Engineer' or 'Senior Engineer' on the basis of this credential alone; those are job titles that depend on the company.

---

### `evidence_grounded_ai_systems_capstone` — Evidence-Grounded AI Systems Capstone

- **Capability level:** `integrated_mastery`
- **Credential type:** `verified_credential`
- **Verification mode:** `server_verified`
- **Status:** `active`
- **Roles aligned:** `data_analyst`, `data_scientist`, `rpa_automation_developer`, `ai_ml_engineer`, `production_python_engineer`
- **Skill nodes (4):** `business_framing`, `oral_communication`, `written_communication`, `stakeholder_management`
- **Critical competencies (8):** `sql_competency`, `leakage_prevention`, `selector_resilience`, `type_safety_production_hardening`, `mlops_fluency`, `business_framing_judgment`, `communication_audience_tuned`, `reproducibility_determinism`
- **Prerequisites:** `integrated_python_ai_capstone_integrated_mastery`, `integrated_data_analyst_practice`, `integrated_data_science_practice`, `integrated_ml_engineering_practice`, `integrated_automation_engineering_practice`, `integrated_production_python_practice`

**Public claim:** The learner has completed and defended CP-FINAL — the cross-curriculum integrator capstone at S52 — at rubric performance above the provisional floor, with explicit evidence-grounded defense of every critical competency in the PyArcana stack: SQL, leakage prevention, selector resilience, type safety + production hardening, MLOps fluency, business framing, communication, and reproducibility.

**Non-claims:**
- Does not certify the learner as any role at any seniority level, including any 'Master', 'Senior', 'Staff', 'Principal', or 'Distinguished' title.
- The defense is against PyArcana's rubric, not against an external industry certification board.
- Where the curriculum has known gaps (leakage prevention, type safety, SQL performance tuning), the learner must demonstrate the competency via a supplementary independent exercise specified in the badge rubric. The credential explicitly notes which competencies were assessed via curriculum evidence vs. supplementary exercise.

**Newbie-friendly description:** You completed CP-FINAL — the cross-curriculum integrator capstone at S52 — and defended it against ALL EIGHT non-compensatory critical competencies in the PyArcana stack: SQL, leakage prevention, selector resilience, type safety + production hardening, MLOps fluency, business framing, communication, and reproducibility. 'Non-compensatory' means you cannot pass by being strong in seven and weak in one — all eight must meet the floor. This is the heaviest credential PyArcana issues. NOTE: It is NOT an industry certification (like AWS or Google Cloud certs). It is PyArcana's internal synthesis credential. NOTE: For competencies where the curriculum has gaps (leakage prevention, type safety, SQL performance tuning), you must demonstrate the competency via a supplementary independent exercise specified in the rubric.

---

## Naming-convention audit

Every badge name in this register has been audited against the
specification's acceptable patterns:

- Python Data Foundations (used as `python_data_foundations`)
- Independent Data Preparation (used as `independent_data_preparation`)
- Applied Analytical Reasoning (used as `applied_analytical_reasoning`)
- Reliable Automation Development (used as `reliable_automation_development`)
- Responsible Machine Learning Evaluation (used as `responsible_machine_learning_evaluation`)
- Production ML Delivery Foundations (used as `production_python_delivery_foundations`,
  modified with 'Python' to disambiguate from the Phase-2 MLOps
  badges; the spec's exact phrase is preserved as a sub-string)
- Evidence-Grounded AI Systems (used in `evidence_grounded_ai_systems_capstone`)
- Integrated Python and AI Capstone (used in all four capstone credential names)

No badge uses the words 'Senior', 'Staff', 'Principal',
'Distinguished', 'Master' (as an industry title), 'Architect'
(as an industry title), 'Lead' (as an industry title), or any
other industry seniority word. Where the word 'Master' appears,
it is in the curriculum-internal label 'Integrated Mastery' or
'Phase 3 — Mastery Walked', which the badge explicitly
non-claims as an industry title.

Where the word 'Architecture' appears (in 'Architecture Decision
Practice' and in the `architecture_leadership` skill node), it
refers to the technical activity of making architecture
decisions, not to the industry title 'Architect'.


