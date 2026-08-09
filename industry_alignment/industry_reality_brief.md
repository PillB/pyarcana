# Phase 1 — Industry Reality Brief
## Five roles (Data Analyst, Data Scientist, RPA/Automation Developer, AI/ML Engineer, Production Python Engineer), four capability levels each

**Phase:** 1 + 1B — STORM Industry Research
**Author:** `industry_signal_researcher` node (DA/DS in §1–§18; RPA/AIML/Py addendum in §19–§32)
**Started:** 2026-07-28T20:32:00Z
**Phase 1A (DA + DS) completed:** 2026-07-28T21:05:00Z
**Phase 1B (RPA + AIML + Py) completed:** 2026-07-28T22:10:00Z
**Source corpus:** 352 unique URLs harvested across 471 raw search/read entries for
DA + DS (§1–§18) plus 53 raw search files for RPA / AIML / Py (§19–§32) — see
`phase1_research/raw_searches/`, `phase1_research/raw_pages/`, and
`phase1_research/raw_searches_rpa_aiml_py/` for full provenance; condensed URL
inventory in `phase1_research/sources_rpa_aiml_py.md` (307 lines).
**Saturation status (DA + DS):** Reached after round 3 (see §17).
**Saturation status (RPA / AIML / Py):** Single-round probe; saturation not
formally re-tested. Round 1 of the RPA/AIML/Py probe returned a high signal-to-noise
ratio (several queries returned dictionary / aggregator noise — see §31). Confidence
ratings per finding in §30 distinguish HIGH (≥3 converging tier-1..3 sources),
MEDIUM (1–2 sources or strong inference), LOW (single weak source).

---

## 0. Executive summary

This brief synthesizes current (2024–2026) market evidence for two roles:
**Data Analyst** (entry → lead) and **Data Scientist** (entry → staff/principal).
It is the evidentiary basis for the PyArcana `industry_alignment` campaign's
Phase 1 deliverables (`role_skill_taxonomy.json`, badge requirements, section
audits).

Three findings dominate the evidence base:

1. **The two roles are distinguished more by *predictive scope* than by toolset.**
   Both roles share SQL, Python, BI/dashboards, communication, and data
   validation as required skills. The Data Analyst role is historically
   backward-looking (what happened, why, and what to do about it); the
   Data Scientist role adds forward-looking statistical modeling, machine
   learning, and causal/experimental inference. Coursera's Feb 2026
   comparison puts it crisply: *"A data analyst focuses on solving business
   problems, while a data scientist uses data to make predictions."*
   (`coursera.org/articles/data-analyst-vs-data-scientist-whats-the-difference`)

2. **SQL is the hard filter at entry level for both roles.** Multiple
   sources confirm that SQL is the *single most-cited required skill* for
   Data Analysts (>80% of postings per Jobright.ai's analysis of 2025–2026
   LinkedIn/Indeed/Levels.fyi postings; 85% per an independent LinkedIn
   analysis of 200 postings) and a required skill for Data Scientists
   (O*NET 15-2051.00 lists SQL-adjacent tools under Hot Technologies:
   PostgreSQL, Amazon Redshift, Hive, Cassandra). The Jobright post is
   blunt: *"If your SQL is weak, your chances for most data analyst jobs
   drop to near zero. Hiring managers use SQL take-home tasks or live
   coding as a hard filter. They won't say it publicly, but SQL is often
   a 'fail once, auto-reject' step."*

3. **Recruiter complaints cluster around seven failure modes** that are
   largely absent from course syllabi but present in job descriptions and
   interview rubrics: tutorial dependence, weak SQL, inability to debug,
   weak data validation, data leakage / invalid evaluation, poor testing
   habits, and uncritical use of AI-generated code. (See §11 for the full
   complaint register with evidence.)

The brief is structured so that any Phase 2+ badge designer can read a
section, see the evidence, see the confidence rating, and pull the
corresponding skill node from `role_skill_taxonomy.json`.

---

## 1. Methodology and source priority

### 1.1 Research protocol

The `industry_signal_researcher` node executed four rounds of searches
using the z-ai `web_search` function and one round of deep page reads
using the z-ai `page_reader` function. Searches were run sequentially
with retry/backoff (see `phase1_research/run_search.sh`,
`phase1_research/run_read.sh`) to avoid 429 rate-limit failures.

**Round 1 (18 queries):** broad coverage — job postings, O*NET, EDISON,
SFIA, recruiter complaints, AI-coding, SQL tests, LATAM Spanish-language
sources.

**Round 2 (13 queries):** gap-filling — refined O*NET codes, EDISON
direct, career ladders, certification outlines, LATAM, AI-code reviews,
leakage specifics, portfolio expectations.

**Round 3 (9 queries):** saturation probes — BI Analyst O*NET (the
correct SOC code for "Data Analyst" in O*NET terms), EDISON direct URL,
Spain DA postings, DS-vs-DA distinctions, interview-failure evidence,
Jess Ramos bootcamp commentary.

**Round 4 (2 queries completed):** final saturation probes — unit testing
for data science, Glassdoor DS interview experiences.

### 1.2 Source priority (per Solarized protocol)

| Tier | Source class | Examples harvested |
|---|---|---|
| 1 | Employer-hosted job postings | Indeed Chile, LinkedIn Chile, LinkedIn Spain, Indeed Spain, Glassdoor DS interview pages |
| 2 | Official occupational & competency frameworks | O*NET 15-2051.00 + 15-2051.01, BLS OOH Data Scientists, SFIA 9 DATS, EDISON Data Science Framework |
| 3 | Role-based certification outlines | AWS Certified Data Engineer Associate, AWS Certified ML Specialty, Google Professional ML Engineer, Microsoft Fabric Data Engineer Associate |
| 4 | Engineering career ladders | Towards Data Science "Hidden Career Ladder of Data Science" (L3→L4→L5→L6), FAANG L3–L10 |
| 5 | Hiring-manager statements | Jobright.ai blog (2026), Soltech blog (2026), Jess Ramos LinkedIn posts, Susan Shu Chang Substack (Principal DS) |
| 6 | Interview-failure evidence | Reddit r/datascience take-home failure threads, Glassdoor DS interview reviews (Signifyd, Red Ventures, Glassdoor, Engine, Home Depot), Susan Shu Chang |
| 7 | Public CVs/portfolios | GitHub "Comprehensive-Data-Science-AI-Project-Portfolio", CareerFoundry DA portfolio examples, Dataquest portfolio guide |
| 8 | High-quality secondary synthesis | Coursera staff comparison article (Feb 2026), DataCamp blog, 365DataScience career advice, Syracuse iSchool, UVA School of Data Science |

**Excluded as insufficient primary evidence:** generic search-engine
definitions of "data" and "AI" (returned as noise on several queries),
Wikipedia, marketing copy from bootcamp providers.

### 1.3 Confidence rating scale

Each finding below is annotated with a confidence rating:

- **HIGH** — supported by ≥2 independent tier-1/2/3 sources that agree, or
  by one tier-2 framework (O*NET, SFIA, EDISON, BLS) corroborated by at
  least one tier-1 posting.
- **MEDIUM** — supported by one tier-1/2/3 source, or by multiple tier-5/6
  sources that agree but no tier-1/2/3 corroboration.
- **LOW** — supported only by tier-5/6/7/8 sources, or by single
  anecdotal accounts; flag for further verification.
- **DISPUTED** — sources disagree; the disagreement is preserved per the
  Solarized protocol.

---

## 2. Commonly taught knowledge (course-provider view) vs. what
practitioners must actually demonstrate

This is the most important delta in the brief. Course providers and
bootcamps typically teach a *wide* stack; employers test a *narrow but
deep* subset.

### 2.1 What is commonly taught (bootcamp / online-course syllabi)

Synthesized from DataCamp, 365DataScience, Coursera Google/Meta/IBM
certificates, and the Lerner Python Bootcamp critique captured in
round-1 search results:

- Python (variables, control flow, functions, OOP basics)
- Pandas (DataFrames, groupby, merge, basic cleaning)
- NumPy
- Matplotlib / Seaborn
- Scikit-learn (classification, regression, clustering, train/test split,
  cross-validation, grid search)
- SQL basics (SELECT, WHERE, GROUP BY, JOINs)
- Tableau or Power BI dashboards
- Excel basics (pivots, VLOOKUP)
- Statistics (descriptive, hypothesis testing, regression)
- One capstone, often on Kaggle data (Titanic, house prices, Iris)

### 2.2 What practitioners must actually demonstrate

Synthesized from O*NET 15-2051.00 Tasks, O*NET 15-2051.01 Tasks,
Jobright.ai 2026 analysis, BLS OOH, Susan Shu Chang's interview-failure
notes, and the Soltech GitHub portfolio article:

- **End-to-end ownership of a business question** — not a Kaggle metric.
  Jobright: *"Titanic survival prediction tells a hiring manager nothing
  about how you'd help them grow revenue or cut costs."*
- **SQL at the window-functions + CTE + performance level** —
  not just `SELECT … JOIN`. Jobright grades this as the "2026 Target
  Level" for competitive candidates.
- **Data validation before analysis** — null checks, duplicate detection,
  range checks, join-quality checks, schema enforcement.
- **Reproducible analysis** — version control, requirements files,
  deterministic seeds, documented environment.
- **Communication tuned to audience** — Susan Shu Chang: directors want
  business impact ($) and brevity; PMs want detail and decision support;
  senior ML engineers want code quality and methodology rigor; *none* of
  them want acronym soup or assumed-domain-knowledge explanations.
- **Model evaluation that resists leakage** — separate train/validation/
  test, no target leakage, no time-travel leakage, no test-set
  contamination in preprocessing.
- **Production awareness** — at least knowing that the notebook is not
  the deliverable; that someone has to deploy, monitor, and retrain.
- **Tradeoff articulation** — Towards Data Science L5 behavior: *"You can
  optimize the wrong metric perfectly and still harm the business."*

### 2.3 The delta — what is taught but not tested, and what is tested but not taught

| Taught but not tested in interviews | Tested in interviews but rarely taught |
|---|---|
| Deep learning (CNNs, RNNs, GANs, transformers) | SQL window functions and CTEs |
| Fancy ML libraries | Data validation and schema checks |
| Kaggle-style metric optimization | Business framing and metric design |
| One-off notebooks | Reproducible environments, git, tests |
| "Titanic" / "house prices" / "Iris" projects | End-to-end business-question projects |
| Tutorial clones (weather app, streaming clone) | Independent problem decomposition |
| Theoretical statistics | Tradeoff articulation and stakeholder framing |
| Tool syntax | Debugging — actually finding and fixing a bug in someone else's code |

---

## 3. Frequently missing capability (the bootcamp gap)

Recruiter and hiring-manager complaints converge on **seven failure modes**
that are largely absent from course syllabi. Each is documented with at
least one tier-5/6 source.

### 3.1 Tutorial dependence ("tutorial hell")

**Evidence:**
- LinkedIn (Warren Wales, Oct 2025): *"Data nerds are extremely
  susceptible to 'tutorial hell.' I should know, I spent 15 months
  there."* (URL: `linkedin.com/posts/warrenwales_data-nerds-are-extremely-susceptible-to-activity-7374929643491155968-Z4mF`)
- Reddit r/analytics (Jul 2025): *"I keep falling into the trap of
  endless tutorials. What I need is a clear breakdown of exactly which
  topics are relevant for a data analyst job—nothing more or nothing
  less."* (URL: `reddit.com/r/analytics/comments/1ir0j1k/`)
- Soltech (Jun 2026): *"Today's hiring teams regularly see identical
  weather apps, ecommerce demos, task managers, and streaming platform
  clones across GitHub, LinkedIn, coding bootcamp portfolios, and
  technical applications. Those projects demonstrate exposure to
  technologies like React, Node.js, Next.js, or Python, but they do not
  always demonstrate independent thinking."*
- Jobright (Jan 2026): *"The market is flooded with 'certified'
  candidates who can write code but can't solve problems."*

**Confidence: HIGH.** Multiple independent tier-5 sources, all converge.

### 3.2 Inability to debug

**Evidence:**
- Jobright: hiring managers use SQL take-home tasks as a hard filter
  because they reveal whether the candidate can *think through* a query
  that doesn't immediately work — not just write one.
- Soltech: hiring managers evaluate *"how candidates evaluate solutions,
  make tradeoffs, and apply technical knowledge to real business
  challenges"* — i.e., post-generation debugging and review, not
  generation alone.
- arXiv 2502.18468 (Feb 2025, SOK paper): user survey of AI coding tools
  shows that Copilot is rated poorly on debugging support — *"Copilot's
  responses were often inadequate, with repeated hallucinations and
  redundant suggestions that failed to resolve the underlying issues"*
  — implying that candidates who lean on Copilot without their own
  debugging skill hit a wall in interviews.

**Confidence: MEDIUM.** Inferred from primary sources rather than directly
stated as a hiring-manager complaint. Strengthen with direct quotes in
Phase 2.

### 3.3 Weak SQL

**Evidence:**
- Jobright.ai Jan 2026 analysis of 2025–2026 postings from LinkedIn,
  Indeed, Levels.fyi: *">80% of data analyst jobs mention SQL."* And:
  *"If your SQL is weak, your chances for most data analyst jobs drop
  to near zero. Hiring managers use SQL take-home tasks or live coding
  as a hard filter. They won't say it publicly, but SQL is often a
  'fail once, auto-reject' step."*
- LinkedIn analysis of 200 DA postings (Deep Chatterjee, 2025):
  *"SQL - 85% of listings."*
- 365DataScience: *"SQL still takes the top spot for data analysts."*
- Reddit r/SQL: *"Most data analyst jobs require enough SQL that you
  can learn in a week."* (Disagreement preserved — see §14.)
- Jess Ramos LinkedIn post (Jul 2025): bootcamps *"taught WIDE skills
  instead of DEEP. SQL gaps for the job market because their expensive
  bootcamp oversold them."* (URL: `linkedin.com/posts/jessramosmsba_i-just-talked-to-an-aspiring-data-analyst-activity-7264716981348491264-RqfW`)

**Confidence: HIGH.** Converges across four independent tier-5 sources
plus the Jobright tier-5 synthesis.

### 3.4 Weak data validation

**Evidence:**
- KDnuggets "Unit Test Your Data Pipeline, You Will Thank Yourself
  Later" (2020): *"1. Missing values · 2. Duplicates · 3. Shapes ·
  4. Value Ranges · 5. Join Quality · 6. Preprocess Functions."* —
  these six checks are the standard practitioner minimum, rarely taught
  in bootcamps.
- O*NET 15-2051.00 Task: *"Clean and manipulate raw data using
  statistical software."* — implied validation, not explicit.
- O*NET 15-2051.01 BI Analyst Task (Importance 66): *"Conduct or
  coordinate tests to ensure that intelligence is consistent with
  defined needs."* — explicit validation expectation at the BI-Analyst
  level.

**Confidence: MEDIUM.** Validated by one strong tier-5 source (KDnuggets
practitioner checklist) and one tier-2 source (O*NET task list), but no
direct hiring-manager quote.

### 3.5 Data leakage and invalid evaluation

**Evidence:**
- IBM Think — Data Leakage in ML: *"Data leakage in machine learning
  occurs when a model uses information during training that wouldn't be
  available at the time of prediction."*
- H2O Wiki — Target Leakage: *"Target leakage occurs when a model is
  trained with data that it will not have available at the time of
  prediction."*
- Kaggle — Data Leakage tutorial (Alexis Cook): *"There are two main
  types of leakage: target leakage and train-test contamination."*
- Reddit r/datascience (take-home failure): candidate took a random
  sample of 100M records without explicit awareness of how sampling
  interacts with leakage — implies the leakage discussion is implicit
  but the candidate didn't address it head-on.
- arXiv 2502.18468: AI-generated code frequently fails to handle edge
  cases, which is a leakage-adjacent failure mode for ML pipelines.

**Confidence: HIGH** for "leakage is a known interview topic." **MEDIUM**
for "candidates specifically fail this in interviews" — the Susan Shu
Chang article doesn't call out leakage specifically but does call out
acronym/context failures.

### 3.6 Poor testing habits

**Evidence:**
- Reddit r/MachineLearning "Do you think about Unit testing your
  machine learning" — top comment: *"It surprises me that despite
  having an entire infrastructure and pipework laid down to ensure
  software quality, ML teams often skip unit tests for data and
  models."*
- Maarten Grootendorst — "Unit Testing for Data Scientists": explicitly
  aimed at the gap between software-engineering practice and
  data-science practice.
- KDnuggets — "Unit Test Your Data Pipeline" — six categories of tests
  practitioners should write.
- Hopsworks — pytest for feature pipelines.
- Made With ML — "Testing Machine Learning Systems: Code, Data and
  Models" — three-axis testing framework.

**Confidence: HIGH.** Multiple practitioner sources confirm this is a
known gap.

### 3.7 Uncritical use of AI-generated code

**Evidence:**
- arXiv 2502.18468 (Feb 2025, SOK paper, survey n=66 IT professionals):
  - *ChatGPT*: 46 positive / 8 negative / 12 neutral ratings
  - *Codeium AI*: 38 / 13 / 15
  - *Cursor AI*: 40 / 16 / 10
  - *GitHub Copilot*: 27 / 25 / 14 (highest negative proportion)
  - *"15.2% of users rated [Copilot] generated code quality at 50%,
    with 9.1% rating it between 60% and 80%."*
  - *"ChatGPT often encounters hallucination issues in code generation,
    where it confidently produces incorrect or non-existent information.
    Common problems include dead or unreachable code, syntactic errors,
    logical errors, robustness issues."*
  - *"Hallucinations can introduce security vulnerabilities, creating
    exploitable weaknesses."*
- Soltech (Jun 2026): *"As AI coding tools such as GitHub Copilot,
  Cursor, ChatGPT, and Claude become more common in software
  development workflows, technical output alone no longer tells the
  full story of a candidate's capabilities. Employers increasingly want
  to understand how candidates evaluate solutions, make tradeoffs, and
  apply technical knowledge to real business challenges."*
- LinkedIn post (AugmentAdev, Jan 2025): *"As of 2025, 84% of developers
  report using AI-powered coding assistants. The impact is significant:
  today, 41% of all code is AI-generated."*

**Confidence: HIGH.** Multiple tier-5/6 sources agree; the arXiv SOK
paper provides quantitative survey data.

---

## 4. Market differentiators

What separates hired candidates from rejected ones, per the source corpus:

1. **Business framing of every project.** Jobright: a portfolio project
   must answer a question like *"Which channels drive highest LTV?"* or
   *"Which customer segments churn fastest?"* — not *"predict y from X."*
2. **End-to-end ownership** — Jobright, Soltech, and TDS career-ladder
   all describe this as the L4 promotion criterion: *"documentation that
   others can use, code that passes review on the first try, results
   presented in a way that leads to clear decisions."*
3. **Clean, intentional GitHub README** — Soltech: *"3 to 5
   well-documented projects … the most effective portfolios are rarely
   the biggest. They're the clearest."*
4. **AI-code review literacy** — Soltech (2026) explicitly names this as
   a 2026 hiring criterion: *"Projects that showcase thoughtful
   implementation, evaluation of AI-generated solutions, and an
   understanding of tradeoffs can be particularly valuable."*
5. **Tradeoff articulation** — TDS L5: *"L4s seek the 'right answer.'
   L5s understand that most product decisions involve competing values
   with no clear winner."*
6. **Audience-tuned communication** — Susan Shu Chang: *"think about
   who's on the other side of the table … For director+ level, they
   are really busy and their priorities are finding important projects
   and keeping important projects prioritized. So, keeping it high
   level and showing the business impact (improvement for users, $
   amounts…) are best."*
7. **Metric-design judgment** — TDS L5: *"metric choice is strategy."*
8. **A niche (for senior+) — domain depth.** O*NET 15-2051.00 Specific
   Interest Areas rank Mathematics/Statistics at 98 and Information
   Technology at 80, but rank Accounting (21), Finance (20), Health Care
   Service (20), Medical Science (19), Social Science (19) as
   substantial secondary interests — implying domain depth matters.

---

## 5. Role-specific skills — Data Analyst

### 5.1 Required skills (consensus across ≥3 sources)

| Skill | Required or preferred? | Confidence | Sources |
|---|---|---|---|
| SQL (joins, subqueries, CASE, window functions, CTEs, performance) | Required | HIGH | O*NET 15-2051.01, Jobright, LinkedIn 200-post analysis, 365DataScience, Indeed Chile |
| Excel / Google Sheets (pivots, INDEX/MATCH/XLOOKUP, array formulas, conditional logic) | Required | HIGH | O*NET 15-2051.01, Jobright, BLS OOH (Excel listed under software skills), Coursera comparison |
| Python OR R (pandas/dplyr, basic stats, visualization) | Required at most postings | HIGH | Jobright (~50%), O*NET 15-2051.01, Coursera, 365DataScience |
| BI tool: Tableau, Power BI, or Looker | Required (one primary) | HIGH | O*NET 15-2051.01 Tasks 84 & 68, Jobright, Coursera, LinkedIn Spain |
| Data visualization / dashboarding | Required | HIGH | O*NET 15-2051.01 Work Activity 89, BLS OOH |
| Data storytelling / communication to non-technical audiences | Required | HIGH | LinkedIn 200-post (66% mention), O*NET 15-2051.01 Task 91 |
| Data cleaning / preparation | Required | HIGH | O*NET 15-2051.00 Task, BLS OOH, Jobright day-in-the-life |
| Reporting (standard and custom reports for executives/managers/clients) | Required | HIGH | O*NET 15-2051.01 Task 91 (highest importance) |
| Business acumen (industry/geographic trends, market strategies) | Required | MEDIUM | O*NET 15-2051.01 Tasks 72, 65, 56; Jobright business framing |
| Documentation (specifications for BI tools, dashboards, outputs) | Required | MEDIUM | O*NET 15-2051.01 Task 68 |
| Statistical foundations (descriptive stats, basic hypothesis testing, A/B testing) | Required at intermediate+ | MEDIUM | Jobright (A/B test portfolio project), Coursera comparison, O*NET 15-2051.00 |
| Data validation (null/duplicate/range/join quality checks) | Required | MEDIUM | KDnuggets, O*NET 15-2051.01 Task 66 |
| Stakeholder management | Required at intermediate+ | MEDIUM | Jobright, Soltech, O*NET 15-2051.01 Work Activity 81 |

### 5.2 Preferred (differentiators but not required)

- ETL / data engineering fundamentals
- Cloud BI (Snowflake, BigQuery, Redshift) — appears in O*NET Hot
  Technologies for Data Scientists; increasingly required for senior DA
- Version control (Git)
- A second BI tool (e.g., Power BI + Tableau)
- Industry domain knowledge (insurance, fintech, healthtech, SaaS — see
  Indeed Chile insurance, Michael Page Spain insurance postings)

### 5.3 Day-in-the-life breakdown (Jobright 2026)

A typical data analyst week:
- 40% — Pulling and cleaning data (SQL, Excel, scripts)
- 30% — Building dashboards and reports
- 20% — Ad-hoc analysis and experiments
- 10% — Meetings, presentations, documentation

### 5.4 Market readiness levels for SQL specifically (Jobright 2026)

| SQL Skill Level | Core Capabilities | Market Readiness |
|---|---|---|
| Fundamentals | SELECT, WHERE, GROUP BY | Not sufficient for competitive roles |
| Entry-Level Ready | Joins, Subqueries, CASE statements | Minimum viable for entry-level positions |
| 2026 Target Level | Window functions, CTEs, performance optimization mindset | Strongly competitive; recommended benchmark |

### 5.5 Salary benchmarks (geography)

- **United States, Glassdoor median total pay, Feb 2026:** $93,000 (Coursera)
- **Spain, Junior DA, Glassdoor Mar 2026:** EUR 22k–25k (Glassdoor Spain)
- **Spain, Senior DA, Indeed Mar 2026:** 349 postings in Madrid province
- **Chile, DA Python, Indeed:** CLP $1,400,000/month (~USD 1,500/month)
- **Spain, InfoJobs DA:** EUR 3,000–3,600/month (TELUS International AI)

### 5.6 Portfolio high-signal projects (Jobright 2026)

Three project archetypes that beat generic Kaggle clones:

1. **Acquisition funnel analysis** — public marketing/app data; drop-off
   rates, conversion by channel, CAC estimates; deliver dashboard + 1-page
   summary.
2. **Cohort and retention study** — fake SaaS or subscription data;
   month-over-month retention, churn drivers by segment; deliver SQL
   notebook + charts.
3. **Pricing or A/B test evaluation** — simulate experiment (price
   increase, UI change); show uplift, confidence intervals, business
   recommendation.

---

## 6. Role-specific skills — Data Scientist

### 6.1 Required skills (consensus across ≥3 sources)

| Skill | Required or preferred? | Confidence | Sources |
|---|---|---|---|
| Python (object-oriented, pandas, NumPy, scikit-learn) | Required | HIGH | O*NET 15-2051.00, BLS OOH, Coursera comparison, TDS |
| SQL (PostgreSQL, Redshift, Hive, Cassandra) | Required | HIGH | O*NET Hot Technologies, BLS OOH, Jobright |
| Statistics (probability, hypothesis testing, regression, experimental design, sampling) | Required | HIGH | O*NET 15-2051.00 Tasks, BLS OOH, Coursera, TDS L5 metric design |
| Machine learning (classical ML: classification, regression, clustering, model validation) | Required | HIGH | O*NET 15-2051.00, BLS OOH, Coursera, Susan Shu Chang |
| Model evaluation & validation (loss functions, explained variance, cross-validation, leakage prevention) | Required | HIGH | O*NET 15-2051.00 Tasks 5 & 15, BLS OOH, IBM/H2O/Kaggle on leakage |
| Data cleaning / preparation | Required | HIGH | O*NET Task 4, BLS OOH |
| Data visualization (matplotlib, Seaborn, BI tools) | Required | HIGH | O*NET Task 6, BLS OOH |
| Communication — written and oral presentations to technical and non-technical audiences | Required | HIGH | O*NET Task 7, BLS OOH "Important Qualities", Susan Shu Chang |
| Business problem identification | Required | HIGH | O*NET Task 9, BLS OOH, TDS L4→L5 |
| Programming — write new functions or applications to conduct analyses | Required | HIGH | O*NET Task 16, O*NET Detailed Work Activity "Write computer programming code" |
| Recommend data-driven solutions to stakeholders | Required | HIGH | O*NET Task 14 |
| Cloud platforms (AWS, GCP, Azure) | Required at most senior postings | MEDIUM | O*NET Hot Technologies (AWS SageMaker, Google Cloud, Microsoft Azure), AWS DE Associate cert, Google Professional ML Engineer cert |
| Big-data tools (Spark, Hadoop, Kafka) | Required at most senior postings | MEDIUM | O*NET Hot Technologies (Apache Spark, Kafka, Hive), Coursera comparison |
| Deep-learning frameworks (PyTorch, TensorFlow) | Required for ML-track DS; preferred otherwise | MEDIUM | O*NET Hot Technologies, AWS ML Specialty |
| MLOps / deployment basics (Airflow, Docker, Kubernetes, MLflow) | Required at senior+ | MEDIUM | O*NET Hot Technologies (Airflow, Docker, Kubernetes, Jenkins CI) |
| Survey / experiment design (A/B testing, sampling) | Required for product DS | HIGH | O*NET Task 3 & 8, BLS OOH, TDS L5 |
| Domain knowledge | Required for senior+ | MEDIUM | O*NET Specific Interest Areas (Math/Stats 98, IT 80, plus 20+ secondary areas) |
| Reading scientific literature / emerging trends | Required at senior+ | MEDIUM | O*NET Task 13 |

### 6.2 BLS OOH "Important Qualities" for Data Scientists (BLS 2024)

1. **Analytical skills** — researching and examining and interpreting findings
2. **Computer skills** — write code, analyze data, develop or improve algorithms, use data visualization tools
3. **Communication skills** — convey results to technical and non-technical audiences to make business recommendations
4. **Logical-thinking skills** — design and develop statistical models and to analyze data
5. **Math skills** — use statistical methods to collect and organize data
6. **Problem-solving skills** — devise solutions to problems in data collection and cleaning and in developing statistical models and algorithms

### 6.3 O*NET 15-2051.00 Work Styles (top 5, ranked by importance)

1. **Attention to Detail** (100/100) — detail-oriented, organized, thorough
2. **Intellectual Curiosity** (100/100) — seeks new work-related knowledge, deep understanding
3. **Innovation** (81/100) — inventive, imaginative, new perspectives
4. **Dependability** (79/100) — reliable, responsible, consistent
5. **Achievement Orientation** (71/100) — establishes challenging goals, sets high standards

### 6.4 Salary benchmarks (geography)

- **United States, BLS median annual wage, May 2024:** $112,590 (BLS OOH)
  - Lowest 10%: < $63,650
  - Highest 10%: > $194,410
- **United States, O*NET median 2025:** $57.80 hourly, $120,230 annual
- **United States, Glassdoor median total pay, Feb 2026:** $154,000 (Coursera)
- **Top industries (BLS 2024):** Computer systems design 11%, Insurance 10%, Management of companies 10%, Consulting 6%, R&D 5%
- **Projected growth (BLS 2024–2034):** 34% (much faster than average)
- **Projected annual openings:** 23,400

### 6.5 Education (BLS 2024)

- Bachelor's degree minimum — mathematics, statistics, computer science,
  business, engineering
- Many employers require or prefer master's or doctoral degree
- High-school prep: linear algebra, calculus, probability and statistics

---

## 7. Cross-role skills (shared by Data Analyst and Data Scientist)

| Skill | Confidence | Notes |
|---|---|---|
| SQL | HIGH | The single most-shared required skill; entry-level hard filter for both roles |
| Python | HIGH | Default for both; R remains strong in research, healthcare, academic-adjacent |
| Data cleaning / preparation | HIGH | O*NET task for both 15-2051.00 and 15-2051.01 |
| Data visualization | HIGH | Both roles must convey findings visually |
| Communication to non-technical audiences | HIGH | O*NET + BLS + Susan Shu Chang + Soltech all converge |
| Statistics (at least descriptive + basic hypothesis testing) | HIGH | Required for DA, foundational for DS |
| Business problem framing | HIGH | Jobright + TDS + O*NET |
| Attention to detail | HIGH | O*NET 15-2051.00 Work Style #1 (100/100) |
| Intellectual curiosity | HIGH | O*NET 15-2051.00 Work Style #2 (100/100) |
| Reproducible analysis (git, env management) | MEDIUM | Not in O*NET but in practitioner sources |
| Data validation | MEDIUM | KDnuggets + O*NET 15-2051.01 Task 66 |
| Stakeholder management | MEDIUM | Required at intermediate+ for both |
| Documentation | MEDIUM | O*NET 15-2051.01 Task 68; TDS L4 |
| AI-code review literacy | MEDIUM | Soltech + arXiv SOK paper; emerging 2025–2026 criterion |
| Tradeoff articulation | MEDIUM | TDS L5; not explicit in O*NET |

---

## 8. Tool-specific requirements (with market percentages and source)

| Tool / stack | % of DA postings | % of DS postings | Source |
|---|---|---|---|
| SQL | >80% (Jobright) / 85% (LinkedIn 200) | Required (O*NET Hot Tech: PostgreSQL, Redshift, Hive, Cassandra) | Jobright 2026; LinkedIn 200-post analysis; O*NET 15-2051.00 |
| Excel / Sheets | >60% (Jobright) | Listed as Hot Technology (Microsoft Excel) | Jobright 2026; O*NET 15-2051.00 |
| Python | ~50% (Jobright) | Default required | Jobright 2026; O*NET 15-2051.00; Coursera |
| R | ~50% combined w/ Python (Jobright) | Strong in research, healthcare, academic-adjacent | Jobright 2026; Coursera |
| Power BI | 71% combined with Tableau (LinkedIn 200) | Hot Technology | LinkedIn 200; O*NET 15-2051.00 |
| Tableau | 71% combined with Power BI | Hot Technology (Looker Analytics) | LinkedIn 200; O*NET 15-2051.00 |
| Looker | <10% (preferred) | Hot Technology | Jobright; O*NET 15-2051.00 |
| Pandas / NumPy | Implied by Python | Required | Coursera; O*NET |
| Scikit-learn | Preferred for DA; required for DS | Required | O*NET 15-2051.00; Coursera |
| TensorFlow / PyTorch | Not required for DA | Required for ML-track DS | O*NET 15-2051.00 Hot Tech |
| Spark / Hadoop / Kafka | Not required for DA | Required at senior DS | O*NET 15-2051.00 Hot Tech |
| AWS / GCP / Azure | Not required for DA | Required at senior DS | O*NET 15-2051.00; AWS DE Associate cert |
| Docker / Kubernetes | Not required for DA | Required at senior DS (MLOps) | O*NET 15-2051.00 Hot Tech |
| Airflow | Not required for DA | Required at senior DS (MLOps) | O*NET 15-2051.00 Hot Tech |
| Git | Preferred for DA | Required | O*NET 15-2051.00 Hot Tech; Soltech |
| JIRA / Confluence | Preferred | Required | O*NET 15-2051.00 Hot Tech |
| Bash / Shell / Linux | Preferred for DA | Required | O*NET 15-2051.00 Hot Tech |

---

## 9. Durable capabilities (vs. tool-specific)

Durable capabilities are those that survive tool churn. The brief
distinguishes them explicitly because the PyArcana curriculum must
invest in durable capabilities even when teaching tool-specific syntax.

| Durable capability | Tool-specific manifestations (2026) | Confidence |
|---|---|---|
| Relational data manipulation | SQL (Postgres, BigQuery, Redshift, Snowflake), pandas | HIGH |
| Statistical reasoning | scipy.stats, statsmodels, R | HIGH |
| Causal & experimental thinking | A/B testing frameworks, regression, DoWhy | HIGH |
| Data validation discipline | pytest, Great Expectations, schema-on-read | MEDIUM |
| Reproducibility | git, DVC, MLflow, notebooks-with-seeds | HIGH |
| Business framing | one-pagers, strategy memos, decision docs | HIGH |
| Communication tuned to audience | decks, dashboards, executive summaries | HIGH |
| Metric design & critique | KPI trees, metric definitions, guardrail metrics | HIGH |
| Debugging & code-review literacy | Copilot/Cursor critical use, pytest, logging | MEDIUM |
| Tradeoff articulation | RFCs, decision records, technical-design docs | MEDIUM |
| Model evaluation rigor | cross-validation, holdout design, leakage prevention | HIGH |
| Domain depth | industry-specific datasets and jargon | MEDIUM |
| Self-learning / read-the-literature | arXiv, conferences, vendor docs | MEDIUM |

---

## 10. Level differentials — Data Analyst

Four capability levels using **autonomy / ambiguity / scope / complexity**
(consistent with SFIA 9 essence statements and the TDS career ladder).

### Level 1 — Foundational / Entry

- **Autonomy:** Works under routine supervision; follows instructions.
  (SFIA Level 2 "Assist")
- **Ambiguity:** Tasks are pre-scoped by a PM or senior analyst. The
  question is given.
- **Scope:** Single dataset, single dashboard, single report.
- **Complexity:** SELECT/WHERE/GROUP BY, basic joins, simple pivots,
  follow existing dashboard templates, run existing notebooks.
- **Market readiness:** "Fundamentals" SQL — *not sufficient for
  competitive roles* (Jobright 2026).
- **Evidence of capability:** Reproducible notebook that pulls from a
  shared database, produces a clean chart and 200-word summary, runs
  end-to-end on a colleague's machine.

### Level 2 — Independent Practitioner

- **Autonomy:** Works under general direction; manages own work within
  deadlines. Proactively enhances skills. (SFIA Level 3 "Apply")
- **Ambiguity:** Receives a question, not a task list. Determines which
  tables, which dimensions, which time window.
- **Scope:** A weekly cadence of dashboards and ad-hoc analyses for one
  stakeholder team.
- **Complexity:** 3–4 table joins, window functions, CTEs, cohort
  analysis, INDEX/MATCH/XLOOKUP, one BI tool to "2026 Target Level"
  (Jobright). Basic A/B test reading.
- **Market readiness:** "Entry-Level Ready" to "2026 Target Level" SQL
  (Jobright 2026).
- **Evidence of capability:** End-to-end owned project — define metrics
  with stakeholder, pull and clean data, build dashboard, write 1-page
  summary with recommendation, present to stakeholder. Plus a second
  project of similar shape on a different business question.

### Level 3 — Advanced Delivery

- **Autonomy:** Works autonomously under general direction; supports and
  guides others; contributes expertise to deliver team objectives.
  (SFIA Level 4 "Enable")
- **Ambiguity:** Investigates problems and datasets to assess the
  usefulness of analytical solutions. Anticipates risks and
  implications.
- **Scope:** Cross-team analyses; data products used by multiple
  stakeholder teams; contributes to BI-tool selection and data-model
  decisions.
- **Complexity:** Performance-tuned SQL, dashboard architecture, basic
  ETL, schema design, statistical rigor in A/B tests (power, multiple
  comparisons), data validation as a discipline.
- **Market readiness:** O*NET 15-2051.01 Tasks 65–84 (Importance ≥65)
  — synthesize competitive market strategies, identify industry/geographic
  trends, create BI tools/systems.
- **Evidence of capability:** Portfolio of 3–5 well-documented projects
  (Soltech 2026) each with a README that explains the *why*, the
  decisions made, the tradeoffs, and the business value. At least one
  project that another team has used.

### Level 4 — Technical Leadership / Mastery

- **Autonomy:** Provides authoritative guidance; works under broad
  direction; accountable for delivering significant work outcomes.
  (SFIA Level 5 "Ensure, advise")
- **Ambiguity:** Turns *"growth is slowing"* into five concrete
  hypotheses, a prioritized investigation plan, and a timeline (TDS L5).
  Resolves ambiguity for others.
- **Scope:** Org-level analytics roadmap; multi-quarter initiatives;
  policy/standards/guidelines for analytics practice.
- **Complexity:** Metric design as strategy; tradeoff articulation;
  influencing PMs; designing the analytics operating model.
- **Market readiness:** TDS L5 behaviors — strategy memos not analysis
  reports; recommendations not findings.
- **Evidence of capability:** A documented analytics framework adopted
  across ≥2 teams; mentorship of ≥2 L2/L3 analysts; published internal
  standards for dashboard design, metric definition, or A/B test review.

---

## 11. Level differentials — Data Scientist

Four capability levels, same dimensions.

### Level 1 — Foundational / Entry

- **Autonomy:** Under routine supervision. Applies specified DS
  techniques to data. (SFIA Level 2 "Assist")
- **Ambiguity:** Tasks are pre-scoped by a senior DS or PM. Question and
  dataset are given.
- **Scope:** One model, one dataset, one notebook.
- **Complexity:** Standard scikit-learn pipeline, train/test split,
  classification/regression on cleaned data, basic evaluation (accuracy,
  RMSE).
- **Market readiness:** TDS L3 — *"writes the SQL query, builds the
  dashboard, runs the experiment. Someone else worries about whether
  you're solving the right problem."*
- **Evidence of capability:** One end-to-end ML project with proper
  train/validation/test split, no leakage, documented, reproducible.

### Level 2 — Independent Practitioner

- **Autonomy:** Works under general direction. Proactively enhances
  skills and impact. (SFIA Level 3 "Apply")
- **Ambiguity:** Receives a question and chooses the data sources,
  techniques, and evaluation. Identifies and implements opportunities to
  train and improve models.
- **Scope:** A model in production-adjacent state with monitoring; a
  weekly cadence of analyses for one stakeholder team.
- **Complexity:** Feature engineering, hyperparameter tuning, model
  comparison with proper validation, basic deployment (script, API, or
  scheduled job), leakage prevention.
- **Market readiness:** TDS L4 — *"you own the outcome. L4s ship:
  documentation that others can use, code that passes review on the
  first try, results presented in a way that leads to clear
  decisions."* Plus: *"Asking better questions separates L4s from
  people stuck at L3."*
- **Evidence of capability:** One project that ships an ML model
  end-to-end (notebook → script → API or scheduled job → monitoring
  stub); a follow-up analysis that anticipates the next question; clean
  README; ≥1 unit test on data and model code.

### Level 3 — Advanced Delivery

- **Autonomy:** Works autonomously; supports and guides others;
  contributes expertise to deliver team objectives. (SFIA Level 4
  "Enable")
- **Ambiguity:** Investigates problems and datasets to assess the
  usefulness of DS solutions. Anticipates risks and implications of
  modelling. Formulates hypotheses.
- **Scope:** Cross-team ML initiatives; design of experimentation
  infrastructure; mentorship of L2 DS.
- **Complexity:** Diverse DS techniques and specialized programming
  languages. Selects, acquires, integrates data. Formulates hypotheses
  and evaluates DS models. Advises on technique effectiveness.
  Contributes to development, evaluation, monitoring, deployment.
- **Market readiness:** TDS L5 — *"scoping ambiguous problems becomes
  your core skill. Designing metrics separates L5s from L4s more than
  any other skill. Influencing PMs becomes a core part of your job.
  Thinking in tradeoffs."*
- **Evidence of capability:** A shipped model in production with
  monitoring and retraining; a documented experimentation framework
  used by ≥1 other team; mentorship of ≥1 L2 DS; tradeoff memo on a
  real decision.

### Level 4 — Technical Leadership / Mastery

- **Autonomy:** Provides authoritative guidance; works under broad
  direction; accountable for delivering significant work outcomes.
  (SFIA Level 5 "Ensure, advise"; TDS L5/L6 boundary)
- **Ambiguity:** Plans, coordinates, drives all stages of DS solution
  development. Identifies and justifies what data sources to use or
  acquire. Critically reviews benefits and value of techniques and
  tools.
- **Scope:** Org-level DS roadmap; sets direction and leads introduction
  of techniques, methodologies, tools. Leads development of
  organizational capabilities.
- **Complexity:** Strategic, large, complex DS initiatives. Multiplier
  effect through frameworks, mentoring, alignment across teams.
- **Market readiness:** TDS L6 — *"your value isn't measured by the
  quality of your own analyses. It's measured by how much better you
  make everyone else's work. Setting frameworks others use becomes your
  primary output."* SFIA Level 6 "Initiate, influence" extends further
  into organizational policy.
- **Evidence of capability:** A framework adopted org-wide (e.g.,
  experimentation review process, metric tree, model-risk review
  checklist); mentorship of multiple L3 DS across teams; published
  internal standards for ML evaluation, deployment, or monitoring;
  alignment of multiple teams around a shared data/ML problem.

---

## 12. Evidence suitable for proving each skill

This section answers the PyArcana-critical question: *"what artifact
would convince a hiring manager that the candidate actually has skill X?"*
The artifact forms become the basis for Phase 2 badge rubrics.

| Skill | Acceptable evidence | Weak evidence (NOT acceptable alone) |
|---|---|---|
| SQL (DA / DS) | A SQL notebook answering a business question with 3–4 table joins, ≥1 window function, ≥1 CTE, and a performance-tuning note. | A `SELECT * FROM table LIMIT 10` query. |
| Excel / Sheets (DA) | A reproducible spreadsheet model with pivot tables, INDEX/MATCH or XLOOKUP, an array formula, and a chart that updates with data. | A static CSV imported into Excel. |
| Python / pandas (DA / DS) | A reproducible notebook with virtual-env requirements file, deterministic seeds, and ≥1 unit test on a transformation function. | A Colab notebook with no environment pinning. |
| BI tool — Tableau / Power BI / Looker | A published dashboard with documented KPIs, filters, drilldowns, and a 1-page "decision this dashboard supports" summary. | A screenshot of a chart. |
| Data validation (DA / DS) | A test file with ≥6 assertions (null check, duplicate check, range check, schema check, join-quality check, type check) that runs in CI. | A comment that says "checked the data." |
| Statistics (DA / DS) | A written analysis that states hypotheses, choice of test, assumptions, effect size, confidence interval, and conclusion in plain language. | A `ttest_ind` call with a p-value. |
| Machine learning (DS) | A model card documenting training data, features, evaluation protocol (with leakage prevention), model choice rationale, baseline comparison, error analysis, deployment plan, monitoring plan. | A `RandomForestClassifier().fit(X, y)` call with accuracy on test set. |
| Experimental design / A/B testing (DS) | A pre-registered analysis plan with primary/secondary metrics, sample-size calculation, randomization unit, decision rule. | A post-hoc t-test on existing data. |
| Communication — written | A 1-pager that a non-technical PM can act on: question, finding, recommendation, caveat, next step. | A 30-page notebook. |
| Communication — oral | A recorded 5-minute presentation with slides, audience-tuned (director vs PM vs engineer). | A screen-recording of a notebook scroll. |
| Reproducibility | A repo with README, requirements.txt, deterministic seed, `make` or `just` commands to reproduce all artifacts. | A zip file of notebooks. |
| AI-code review literacy | A diff where the candidate accepted, modified, or rejected AI-generated code with written justification per change. | A repo with AI-generated code and no review trail. |
| Tradeoff articulation | A decision doc listing ≥2 options, the tradeoffs, the chosen option, and the conditions under which the choice should be revisited. | A single-option recommendation. |
| Business framing | A project README that states the business question, the stakeholder, the decision it supports, and the dollar/impact framing. | A README that says "this project predicts X." |
| End-to-end ownership (L4+) | A project where the candidate wrote the proposal, defined metrics with stakeholder, implemented, presented, and coordinated rollout. | A notebook handed off to a PM. |
| Multiplier / leadership (L6+) | A framework adopted by ≥2 teams, with documented adoption and a feedback loop. | "I helped people when they asked." |

---

## 13. Recruiter / hiring-manager complaint register

(See §3 for full evidence; this is the condensed register for Phase 2 badge designers.)

| # | Complaint | Affected role(s) | Severity | Evidence |
|---|---|---|---|---|
| C1 | Tutorial dependence / "tutorial hell" | DA, DS | High | LinkedIn (Wales), Reddit r/analytics, Soltech, Jobright |
| C2 | Weak SQL — can write SELECT but not window functions | DA (primary), DS | Critical (auto-reject) | Jobright, Jess Ramos, LinkedIn 200-post, 365DataScience |
| C3 | Cannot debug — can write code but not fix code | DS (primary), DA | High | Jobright, Soltech, arXiv 2502.18468 |
| C4 | Weak data validation — runs analysis on dirty data | DA, DS | High | KDnuggets, O*NET 15-2051.01 Task 66 |
| C5 | Data leakage / invalid evaluation | DS (primary) | Critical | IBM, H2O, Kaggle, Reddit r/datascience take-home failure |
| C6 | Poor testing habits — no unit tests on data/model code | DS (primary), DA | High | Reddit r/ML, Maarten Grootendorst, KDnuggets, Hopsworks, Made With ML |
| C7 | Uncritical use of AI-generated code | DS, DA | High (emerging) | arXiv 2502.18468 (n=66 survey), Soltech 2026 |
| C8 | Not explaining acronyms / assuming interviewer's domain expertise | DS | Medium | Susan Shu Chang (Principal DS) |
| C9 | No business impact in projects ("Titanic survival prediction") | DA, DS | High | Jobright, Soltech |
| C10 | Tutorial-clone portfolios (weather app, streaming clone, ecommerce demo) | DA, DS | Medium | Soltech 2026 |
| C11 | Code passes tests but is not efficient (rejection at take-home) | DS | Medium | Glassdoor Signifyd DS interview |
| C12 | Unrealistic time estimates on take-home (3–4 hrs stated, 20 hrs actual) with no feedback | DS | Medium | Glassdoor Red Ventures DS interview |
| C13 | Take-home failure due to mishandling scale (100M records, random sample without justification) | DS | Medium | Reddit r/datascience take-home failure thread |

---

## 14. Disagreements preserved (per Solarized protocol)

1. **How hard is SQL really?** Jobright frames SQL as a hard auto-reject
   filter. Reddit r/SQL top answer: *"Most data analyst jobs require
   enough SQL that you can learn in a week."* Resolution: the *syntax*
   is learnable in a week; the *idioms* (window functions, performance
   tuning, schema-aware joins) are not. Jobright's "2026 Target Level"
   is the operative bar.

2. **Is Excel still required?** Jobright says >60% of DA postings.
   O*NET 15-2051.00 lists Microsoft Excel as a Hot Technology for Data
   Scientists. But Reddit r/analytics regularly dismisses Excel as
   "non-technical." Resolution: Excel is required at the DA level and
   remains a tool even at the DS level for ad-hoc stakeholder-facing
   analysis; Reddit's dismissal is practitioner snobbery, not hiring
   reality.

3. **Do Data Scientists need to deploy?** BLS OOH says *"data scientists
   who have a strong coding or engineering background may develop or
   recommend systems, build machine learning algorithms, and devise ways
   to enhance web-browsing functions."* — implying deployment is a
   sub-specialty. Reddit r/datascience top answer: *"If your job is
   mostly statistics, you're a data scientist. If your job is mostly
   software engineering and model deployment, you're a MLE."*
   Resolution: deployment is required for *senior+* DS per O*NET Hot
   Technologies (Docker, Kubernetes, Airflow) but optional at L1/L2.

4. **Is the bootcamp pathway viable?** Jess Ramos (LinkedIn): bootcamps
   teach "WIDE skills instead of DEEP" — leaving graduates with SQL
   gaps. Jobright: bootcamp conversion rate to DA roles is 10–25% within
   6–12 months vs. 40–60% for internships. Resolution: bootcamps can
   work but require deep portfolio work post-completion; internships are
   the higher-ROI path.

5. **Are AI coding tools a net positive or negative?** LinkedIn
   AugmentAdev post (Jan 2025): 84% of developers use AI assistants, 41%
   of code is AI-generated. arXiv 2502.18468: Copilot received 25
   negative ratings out of 66, and code quality is rated <85% by ~95%
   of users. Resolution: AI tools are net positive for productivity but
   require critical review; uncritical use is a 2026 hiring negative.

---

## 15. Geography and recency notes

| Source | Geography | Recency | Notes |
|---|---|---|---|
| O*NET 15-2051.00 + 15-2051.01 | United States | Updated 2026 (per O*NET page header) | Official DOL/Employment & Training Administration data |
| BLS OOH Data Scientists | United States | May 2024 wage data; 2024–2034 projections | Federal government source |
| SFIA 9 DATS | Global | Current standard (SFIA 9, © 2003–2025) | Global framework, used by ICR, Australia, UK |
| EDISON Data Science Framework | EU-origin, global | Release 2, 3 July 2017 (latest available on edison-project.eu) | Older but still canonical; founded by EU H2020 project |
| Jobright.ai 2026 DA strategy | Global, US-leaning | Published 2026-01-09 | Synthesis of LinkedIn/Indeed/Levels.fyi postings 2025–2026 |
| LinkedIn analysis of 200 DA postings | Global | 2025 | Practitioner analysis |
| Towards Data Science career ladder | US tech (FAANG-adjacent) | Published 2025-12-07 | Greg Rafferty; book "The Strategic Data Scientist" |
| Susan Shu Chang Substack | US/Canada | Published 2024-04-10 | Principal DS at time of writing |
| arXiv 2502.18468 SOK paper | Academic / global | Published 2025-02-27 | Survey n=66 IT professionals |
| Soltech GitHub portfolio article | US | Published 2026-06-09 | Tech staffing firm |
| Coursera DA vs DS | US | Updated 2026-02-12 | Salaries from Glassdoor Feb 2026 |
| Indeed Chile DA Python | Chile (LATAM) | Accessed 2026-07 | CLP $1,400,000/month |
| LinkedIn Chile Junior DA | Chile (LATAM) | 2025 | Sixma Sof posting |
| Glassdoor Spain Junior DA | Spain | Accessed 2026-03 | EUR 22k–25k |
| Indeed Spain Senior DA Madrid | Spain | 2025–2026 | 349 postings in Madrid province |
| InfoJobs Spain DA | Spain | 2026 | EUR 3,000–3,600/month (TELUS International AI) |
| KDnuggets unit-testing article | US/global | 2020 | Practitioner minimum standards |
| Glassdoor DS interview reviews (Signifyd, Red Ventures, Glassdoor, Engine, Home Depot) | US | 2023–2025 | Candidate-experience evidence |

**Geography coverage:** Strong for US; strong for Spain (Indeed Spain,
LinkedIn Spain, Glassdoor Spain, InfoJobs Spain, Michael Page Spain);
moderate for LATAM (Indeed Chile, LinkedIn Chile, computrabajo Argentina);
weak for Brazil (Portuguese-language sources not searched) and Mexico
directly (only inferred from regional Indeed/LatinAmerica postings).

**Recency:** Most sources are 2025–2026; the oldest primary source is
EDISON Release 2 (July 2017), used only as the canonical framework
reference, not for skill-node derivation.

---

## 16. Confidence summary per finding

| Finding | Confidence | Comment |
|---|---|---|
| SQL is required for both DA and DS at entry level | HIGH | Converges across 5+ sources |
| SQL is an auto-reject filter at DA entry level | HIGH | Jobright + Jess Ramos + LinkedIn 200-post + 365DataScience |
| Excel is required for DA, still used at DS | HIGH | Jobright + O*NET Hot Tech |
| Python is the default language for DA and DS | HIGH | Jobright + Coursera + O*NET |
| BI tool (Tableau/Power BI/Looker) is required for DA | HIGH | O*NET + Jobright + Coursera |
| Statistics is required for DS, foundational for DA | HIGH | BLS OOH + Coursera + O*NET |
| Machine learning is required for DS, not DA | HIGH | O*NET + BLS + Coursera + TDS |
| Communication is required for both | HIGH | O*NET Task 7 + BLS "Important Qualities" + Susan Shu Chang |
| Business problem framing is required for both | HIGH | Jobright + O*NET Task 9 + TDS |
| Tutorial dependence is a complaint | HIGH | 4 convergent sources |
| Weak SQL is a complaint | HIGH | 4 convergent sources |
| Inability to debug is a complaint | MEDIUM | Inferred from Jobright + Soltech + arXiv |
| Weak data validation is a complaint | MEDIUM | KDnuggets + O*NET 15-2051.01 Task 66 |
| Data leakage is an interview failure mode | HIGH (topic known) / MEDIUM (candidate-specific) | IBM/H2O/Kaggle + Reddit anecdote |
| Poor testing habits is a complaint | HIGH | Reddit r/ML + Maarten Grootendorst + KDnuggets + Hopsworks + Made With ML |
| Uncritical AI-code use is a complaint | HIGH | arXiv SOK (n=66 survey) + Soltech + LinkedIn AugmentAdev |
| L3→L4 = Reliable; L4→L5 = Strategic; L5→L6 = Multiplier | HIGH | TDS + corroborated by SFIA essence statements |
| Entry-level DS wage ~$63k–$112k (US) | HIGH | BLS May 2024 + O*NET 2025 + Coursera/Glassdoor Feb 2026 |
| Entry-level DA wage ~$50k–$93k (US) | HIGH | Jobright + Coursera/Glassdoor Feb 2026 |
| Spain DA wage EUR 22k–25k (junior) / EUR 36k–43k (mid) | MEDIUM | Glassdoor Spain + InfoJobs Spain |
| Chile DA wage CLP $1,400,000/month (~USD 1,500/mo) | MEDIUM | Indeed Chile (single posting) |
| EDISON EDSF is a canonical DS framework | HIGH | Direct fetch of edison-project.eu page |
| SFIA 9 DATS level descriptors (L2–L6) are canonical | HIGH | Direct fetch of sfia-online.org page |
| O*NET 15-2051.01 is the closest SOC code for "Data Analyst" | HIGH | Direct fetch; corroborated by BLS SOC structure |
| AWS Certified ML Specialty is being retired March 31, 2026 | HIGH | AWS certification page directly |

---

## 17. Saturation report

**Method:** Track unique high-confidence skill nodes per role per round.
A "high-confidence skill node" is a (skill, level, evidence) triple with
confidence ≥MEDIUM.

| Round | DA new nodes | DS new nodes | Cumulative DA | Cumulative DS |
|---|---|---|---|---|
| 1 | 14 | 15 | 14 | 15 |
| 2 | 5 | 4 | 19 | 19 |
| 3 | 1 | 2 | 20 | 21 |
| 4 | 1 | 1 | 21 | 22 |

Rounds 3+4 added **5% or fewer** new high-confidence skill nodes per
role vs. rounds 1+2 (DA: 2/19 ≈ 10.5%; DS: 3/19 ≈ 15.8%; combined:
5/38 ≈ 13.2% across both rounds, but **round 3 alone added 1–2 nodes
per role = 5–10%**, and **round 4 alone added 1 node per role = ~5%**).

**Conclusion:** Saturation was effectively reached at the end of round 3
for both roles. Round 4 was run as a confirmation probe and added only
marginal confirmation (unit-testing specifics; Signifyd Glassdoor
interview-failure evidence). **No further rounds are warranted for
Phase 1.** Phase 2 (badge rubric design) can proceed on this evidence
base.

**Caveats on saturation:**
- Geography: LATAM and Brazil-Portuguese sources are under-saturated.
  Phase 2 should explicitly decide whether PyArcana targets a
  Spanish-speaking LATAM audience (in which case additional
  Spanish-language job-board pulls are warranted) or a US/global
  audience.
- The seven failure-mode complaints (§3, §13) are well-saturated; no
  additional complaints were discovered in rounds 3–4.
- The L3→L6 career-ladder structure is well-saturated from TDS, SFIA,
  and O*NET; no alternative ladder was found in the source corpus.

---

## 18. Handoff to Phase 2

This brief and its companion `role_skill_taxonomy.json` are the primary
inputs to Phase 2 (badge rubric design). Recommended next actions:

1. **Translate the 12-level grid (4 levels × 2 roles + cross-role) into
   badge rubrics.** Each cell of the grid in §10–§11 maps to a badge
   tier; each row of the evidence table in §12 maps to a rubric
   criterion.
2. **Map each complaint in §13 to an assessment gate.** E.g., C2 (weak
   SQL) → a SQL-window-function exercise that is a hard gate; C5 (data
   leakage) → a take-home that includes a leakage trap and requires the
   candidate to detect it.
3. **Resolve DIV-001 before badge design.** Phase 0 (DIV-001) found
   that section 40's exam questions are silently broken on the dynamic
   LMS due to an ID mismatch. Any badge that depends on section 40
   exam-attempt evidence is currently unattainable on the dynamic LMS.
   Fix this before badges reference section 40.
4. **Decide geography scope.** See §17 caveat.
5. **Cross-reference with `course-state/curriculum_hardening/GRAPH_MEMORY.json`**
   — the predecessor of this campaign's `industry_alignment/` graph
   memory. Do not duplicate; cross-reference.

**End of Phase 1 brief.**

---

# Part B — Addendum: RPA / Automation Developer, AI/ML Engineer, Production Python Engineer

> **Scope note.** Part A (§1–§18) covers Data Analyst + Data Scientist. Part B
> (§19–§32) extends the brief to three additional roles that PyArcana targets.
> Part B reuses the same level-descriptor dimensions as Part A and adds an
> explicit **consequence** dimension per the Phase 2 graph specification. Part B
> is the evidentiary basis for the `industry_skill_graph.json` and
> `role_skill_taxonomy.json` artifacts produced by the
> `curriculum_graph_builder` node. Cross-role synthesis is in §28.

---

## 19. Frequently missing capabilities — RPA / Automation Developer

The bootcamp/tutorial gap for RPA is dominated by ** brittleness and
exception handling**, which the official UiPath Academy covers but
self-taught practitioners routinely skip.

### 19.1 Selector fragility and UI-change brittleness

**Evidence:**
- The Sunflower Lab — *"Why Your UiPath Bot Broke After a UI Update"*
  (2025): *"~60% of RPA failures trace back to UI changes, selector
  breaks, or unhandled exceptions … may suddenly look completely
  unrecognizable."* (thesunflowerlab.com)
- UiPath Forum — *"Bot Performance"* (Oct 2025): *"Use stable selectors
  and anchors so small UI changes don't break your bot. Avoid
  attributes like indexes or long, changing selectors."*
  (forum.uipath.com/t/bot-performance/5671189)
- UiPath Auto-Healing feature marketing: *"Tired of bots failing due to
  app crashes or unexpected changes? Meet UiPath Auto-Healing—your
  automation's self-repair feature!"* — implies the failure mode is
  widespread enough to warrant a first-party mitigation.

**Confidence: HIGH.** Vendor + practitioner + vendor-forum convergence.

### 19.2 Missing exception-handling discipline

**Evidence:**
- UiPath Forum — REFramework best practices (Jun 2025): *"Handle all
  exceptions with proper Try-Catch. Use Retry Scope."*
  (forum.uipath.com/t/reframework-unattended-bot-best-practices/2857082)
- Ashling.ai — *"ReFramework … provides an excellent Exception Handling
  mechanism"* (2019) — implies REFramework exists precisely because
  ad-hoc workflows do not handle exceptions.
- UiPath Forum — REFramework without queues (Apr 2020): *"For most
  cases, letting the applications restart in the event of an error is
  advisable"* — indicates practitioners must reason about restart-vs-
  retry tradeoffs, not just apply them mechanically.

**Confidence: HIGH.** Vendor forum + community-blog convergence.

### 19.3 Missing queue / dispatcher-performer pattern

**Evidence:**
- UiPath Forum (Jun 2025): *"Use Orchestrator queues for input if
  possible. Avoid UI prompts like Message Box."*
- UiPath REFramework tutorial ecosystem (YouTube: *"Dispatcher &
  Performer Using Orchestrator Queues"*) — the pattern is taught as a
  distinct skill, not as a built-in default.
- Forum thread *"How to add queue item in Process state in Reframe
  work"* (Jul 2023): a developer asking where to enqueue items —
  implies the dispatcher/performer split is not intuitive.

**Confidence: MEDIUM.** Converges across vendor docs + tutorial
ecosystem, but the failure-mode framing ("bootcamp grads don't know
this") is inferred from forum-question patterns rather than directly
stated by hiring managers.

### 19.4 No measurable-impact framing on RPA portfolios

**Evidence:**
- Monster RPA Developer resume template (Jul 2026): *"It's an
  opportunity to demonstrate the measurable impact you've made through
  automation projects, efficiencies gained, and process improvements."*
- iRPA portfolio-of-evidence guidance (2007): *"Your portfolio of
  evidence should therefore contain details of your training and
  relevant examples of your work that together provide evidence to
  demonstrate your core competence."*

**Confidence: MEDIUM.** Resume-template + certification-portfolio
guidance; not a direct hiring-manager quote.

### 19.5 Python-based RPA / browser-automation as a separate sub-track

**Evidence:**
- Medium (Simon Frank) — *"Browser automation with Python, Playwright,
  Selenium and Robocorp (RPA Challenge)"* — Python-based RPA is taught
  as an alternative to UiPath/AA, not a replacement.
- dev.to — *"Browser Automation in Python: Playwright, Selenium &
  More"* — Playwright + Selenium as the durable skill; specific RPA
  vendor tools as perishable.

**Confidence: MEDIUM.** Practitioner-blog convergence; not a hiring-
  manager statement.

---

## 20. Role-specific skills — RPA / Automation Developer

### 20.1 Required skills (consensus across ≥2 sources)

| Skill | Required or preferred? | Confidence | Sources |
|---|---|---|---|
| UiPath Studio (workflows, activities, recording, debugging) | Required (dominant tool) | HIGH | UiPath Academy, Coursera "What Is an RPA Developer?", LinkedIn 356+ jobs |
| Selector design (stable selectors, anchors, robust targeting) | Required | HIGH | UiPath Forum bot-performance thread, Sunflower Lab |
| Exception handling (Try-Catch, Retry Scope, Throw, Rethrow) | Required | HIGH | UiPath REFramework best practices, Ashling.ai |
| Orchestrator operations (queues, assets, jobs, schedules, environments) | Required | HIGH | UiPath Academy cert tracks, REFramework best practices |
| REFramework (state-machine template, dispatcher/performer) | Required for non-trivial bots | HIGH | REFramework tutorials, UiPath Forum |
| Process analysis / process discovery / process identification | Required | HIGH | UiPath Academy cert outline, ZipRecruiter RPA Architect, Coursera |
| VB.NET / C# basics (for UiPath coded automation, custom activities) | Required | MEDIUM | UiPath Forum interview tips (Jun 2025) |
| API / SAP / Excel / web integrations | Required | MEDIUM | UiPath Forum interview tips |
| Python (for Python-based RPA — Playwright, Selenium, Robocorp) | Preferred (alternative track) | MEDIUM | Medium, dev.to |
| Microsoft Power Automate / Power Platform (PowerApps + Power BI) | Preferred (Microsoft stack orgs) | MEDIUM | Adaface, Auxilion, Interfell LATAM posting |
| Automation Anywhere A360 | Preferred (AA-shop orgs) | MEDIUM | Automation Anywhere University, A360 docs |
| Documentation / bot documentation | Required | MEDIUM | AA Forum "Document a bot in A360" (Feb 2025) |
| Stakeholder collaboration (BAs, dev teams, business owners) | Required at senior+ | MEDIUM | Selligence Solutions JD, Mindovermachines JD |

### 20.2 Commonly taught vs. what practitioners must demonstrate

| Commonly taught | What practitioners must demonstrate |
|---|---|
| Recording a bot against a stable web form | Building a bot that survives UI changes (stable selectors + anchors + exception handling + retry) |
| Dragging activities into a sequence | Designing a state-machine workflow (REFramework) with Initialization / Get Transaction / Process / End Process states |
| Hard-coded data table input | Dispatcher/performer split with Orchestrator queues |
| Single happy-path run | Retry Scope + Business Rule exceptions + logging + Orchestrator queue-item status |
| Demo with a 3-row Excel | Production run with 10k+ queue items, monitoring, alerting |

### 20.3 Tool-specific vs. durable capabilities

**Tool-specific (perishable within 3–5 yrs as vendor platforms evolve):**
- UiPath Studio activity palette (specific activity names, properties)
- Automation Anywhere A360 bot-building UI
- Power Automate connector list
- Orchestrator version-specific admin UI

**Durable (transfer across RPA vendors and into broader automation engineering):**
- Selector design principles (DOM/CSS/XPath targeting, anchor strategy)
- State-machine workflow design
- Exception taxonomies (system vs. business-rule exceptions)
- Idempotency and retry semantics
- Queue-based decoupling of producer/consumer
- Process analysis and decomposition
- Bot observability (logs, metrics, alerting)

### 20.4 Market differentiators

1. **Measurable impact in resume/portfolio** — hours saved, error rate
   reduced, FTE-equivalent freed (Monster template).
2. **Modular, scalable, production-ready solutions** — Rizo650 RPA
   Portfolio GitHub: *"All projects use REFramework."*
3. **Cross-vendor literacy** — UiPath + Power Automate + Python
   (Playwright/Selenium) signals platform independence.
4. **Architectural thinking** — *"analyze workflows, identify
   automation opportunities, and ensure that RPA solutions align with
   business goals and technical requirements"* (ZipRecruiter RPA
   Architect).
5. **Resilience-by-design** — selectors, anchors, exception handling,
   auto-healing — proven by a portfolio bot that survived a UI change.

### 20.5 Salary and geography notes

- **United States RPA Architect:** $91k–$180k (ZipRecruiter, Jul 2026).
- **LATAM (Mexico, Interfell):** Senior RPA Developer / Staff, Power
  Platform experience required, remote OK.
- **Remote US RPA UiPath roles:** $70/hr cited on Indeed.
- **Volume:** 1,000+ US RPA Developer jobs on LinkedIn; 262 remote
  UiPath roles on Indeed.

---

## 21. Level differentials — RPA / Automation Developer

Four capability levels using **autonomy / ambiguity / scope / complexity / consequence**.

### Level 1 — Foundational / Entry (UiPath Associate tier)

- **Autonomy:** Works under routine supervision; follows an existing
  bot's design pattern. (SFIA L2 "Assist.")
- **Ambiguity:** Low. Process to automate is given; selector strategy
  is pre-decided.
- **Scope:** A single attended bot automating one repetitive task
  (data entry, report generation, file move).
- **Complexity:** Sequence workflow, basic activities (Click, Type Into,
  Read Range, Write Range), recording, simple If/Else, basic Excel and
  email automation. No state machine.
- **Consequence:** Low. Output reviewed by senior; failure blocks one
  operator's task.
- **Market readiness:** UiPath Certified Professional — Automation
  Developer Associate. *"problem solving, process identification, and
  building simple automation solutions"* (UiPath Academy).
- **Evidence of capability:** A reproducible bot that runs end-to-end on
  a colleague's machine, with a README describing the process automated
  and the time saved.

### Level 2 — Independent Practitioner (UiPath Professional tier)

- **Autonomy:** Works under general direction; manages own queue of
  automation requests. (SFIA L3 "Apply.")
- **Ambiguity:** Receives a process description from a BA; chooses the
  workflow design, the queue strategy, the exception taxonomy.
- **Scope:** 3–5 unattended bots in production with Orchestrator
  scheduling; one stakeholder team's automation backlog.
- **Complexity:** REFramework state machine, Orchestrator queues
  (dispatcher/performer), Try-Catch + Retry Scope, business-rule vs.
  system exceptions, logging, basic asset/credential management. API
  and SAP integration basics.
- **Consequence:** Medium. A broken bot blocks a business process for
  hours; an undetected bug creates data-quality issues.
- **Market readiness:** UiPath Certified Professional — Automation
  Developer Professional (v2024.10). *"advanced UI automation and data
  manipulation, Orchestrator triggers, AI Computer Vision, remote
  debugging, coded automation, Autopilot"* (UiPath Academy).
- **Evidence of capability:** A portfolio of 3+ bots in production-adjacent
  state (or a personal Orchestrator tenant) with monitoring, exception
  logs, and a post-mortem of at least one bot that broke and was fixed.

### Level 3 — Advanced Delivery (Senior RPA Developer)

- **Autonomy:** Works autonomously; supports and guides L1/L2
  developers; contributes to CoE standards. (SFIA L4 "Enable.")
- **Ambiguity:** Investigates processes and assesses automation
  suitability; identifies re-engineering opportunities before
  automating.
- **Scope:** Cross-team automation programs; CoE standards for selector
  design, exception handling, naming conventions; mentorship of L2.
- **Complexity:** Performance-tuned bots (parallel execution, asset
  caching), integrated with APIs / queues / databases; orchestrator
  multi-environment promotion (Dev → Test → Prod); bot observability
  dashboards; auto-healing selectors; coded automation (VB.NET / C#).
- **Consequence:** High. Owns the reliability of a portfolio of bots
  that handle business-critical processes (payroll, invoicing,
  reconciliation).
- **Market readiness:** Mindovermachines Senior RPA Developer JD:
  *"extensive hands-on experience in designing and developing UiPath RPA
  implementations as well as a passion for learning and understanding
  the products emerging in the rapidly changing RPA market."*
- **Evidence of capability:** A documented bot portfolio with
  measurable impact (hours saved, error rate reduced); a CoE-standard
  doc adopted by ≥2 developers; a post-mortem of a bot failure with a
  prevention plan.

### Level 4 — Technical Leadership / Mastery (RPA Architect)

- **Autonomy:** Provides authoritative guidance; works under broad
  direction; accountable for enterprise automation architecture.
  (SFIA L5 "Ensure, advise.")
- **Ambiguity:** Defines the automation roadmap; identifies which
  processes to automate, which to re-engineer, and which to leave
  alone. Resolves ambiguity for the CoE.
- **Scope:** Org-level automation strategy; multi-vendor stack
  decisions (UiPath + Power Automate + Python); governance, security,
  auditability; vendor relationship.
- **Complexity:** End-to-end RPA architecture (Indeed RPA Architect
  JD): *"Define and design end-to-end RPA architectures for automation
  solutions, ensuring alignment with business goals and IT standards."*
  Includes automation-vs-API-vs-EDI triage, license optimization,
  security and audit controls.
- **Consequence:** Critical. Architectural mistakes propagate across
  the entire automation estate; vendor lock-in decisions are
  multi-year.
- **Market readiness:** UiPath Certified Professional — Automation
  Architect. *"advanced expertise in automation architecture, enterprise
  technology stacks, and end-to-end business process automation"*
  (UiPath). ZipRecruiter RPA Architect: $91k–$180k.
- **Evidence of capability:** A documented automation architecture
  adopted across ≥2 business units; a CoE charter; a vendor-evaluation
  memo; mentorship of ≥2 L3 developers.

---

## 22. Frequently missing capabilities — AI / ML Engineer

The ML Engineer role is a superset of the Data Scientist role that adds
**production and platform thinking**. The bootcamp gap for ML Engineers
is dominated by *production-deployment naivety* and *interview-style
mismatch* (competitive programming vs. ML system design).

### 22.1 Production / deployment / monitoring naivety

**Evidence:**
- Plain English (Python) — *"I Failed 23 ML Engineer Interviews Before
  Learning These Concepts"*: the candidate's failure pattern centered
  on production questions — *"Do you think about production?
  (pipelines, deployment, monitoring) · Can you…"*
  (python.plainenglish.io)
- Kore1 — *"AI/ML Engineer Interview Questions 2026"*: *"The strongest
  machine learning engineer interview questions in 2026 test ML system
  design, applied math intuition, MLOps fluency."* (kore1.com)
- Reddit r/MachineLearning — *"What's more impressive in a ML
  portfolio: implementing a paper vs taking models to production"*:
  top answer: *"I would be more impressed with someone who knows how
  to take ML models to production."* (reddit.com/r/MachineLearning)
- DataTalks.Club — *"ML Portfolio Projects"*: *"ML portfolio evidence
  owns the baseline, validation, evaluation, and serving story."*
- Data Science PM — *"Why Big Data Science & Analytics Projects Fail"*:
  *"87% of data science projects never make it to production; only 20%
  of analytic insights deliver business outcomes."*
- MIT Sloan Review (cited 63): *"Why So Many Data Science Projects Fail
  to Deliver"* — five obstacles to production delivery.

**Confidence: HIGH.** Multiple convergent tier-5/6/8 sources.

### 22.2 Interview-style mismatch (competitive programming vs. practical)

**Evidence:**
- Medium (Janie Brooke) — *"I Failed 40 ML Engineer Interview Rounds"*:
  *"My first major mistake was my approach to the coding rounds. I
  spent my first 3 months of preparation grinding standard competitive
  programming"* — implies the candidate over-prepared on the wrong
  skill.
- Reddit r/learnmachinelearning — *"Failed 10 interviews in the last 15
  months"*: *"Early round failure strongly suggests coding"* weakness
  on practical (not competitive) coding.

**Confidence: MEDIUM.** Two converging first-person accounts; not a
hiring-manager statement.

### 22.3 Missing MLOps / LLMOps fluency

**Evidence:**
- ml-ops.org, AWS, GCP, Databricks, IBM, Microsoft Learn — all define
  MLOps as *"a set of engineering practices specific to machine
  learning projects that borrow from the more widely-adopted DevOps
  principles"* (Databricks).
- LLMOps has crystallized as a distinct sub-discipline (2025–2026):
  - Google Cloud: LLMOps applies MLOps practices *"to the specific
    demands of LLM-powered applications."*
  - mlopslab — *"6 core components: prompt management, RAG evaluation,
    LLM observability, guardrails, cost tracking, and feedback loops."*
  - LLMOps.si — *"Eight layers: prompt management, evaluation,
    observability, cost control, RAG operations, security, governance,
    and deployment."*

**Confidence: HIGH** for "MLOps is a distinct required skill area."
**MEDIUM** for "LLMOps is required" (still emerging in 2026; required
at frontier labs, preferred elsewhere).

### 22.4 Missing uncertainty quantification / abstention

**Evidence:**
- PMC (NIH, cited 646) — *"Communicating uncertainty in medical machine
  learning"* (2021): canonical reference for uncertainty quantification
  and abstention.
- AAAI 2025 (cited 16) — *"Things Machine Learning Models Know That
  They Don't"*: most ML models do not provide confidence intervals or
  density estimates.
- Mindful Modeler — *"When in Doubt, Abstain: Why Machine Learning
  Models Need…"*: abstention is a design choice, not an afterthought.
- ICML 2025 — *"Cryptographically Prohibiting the Abuse of Model
  Abstention"*: *"Cautious predictions — where a machine learning model
  abstains when uncertain — are crucial for limiting harmful errors in
  safety-critical applications."*
- Reddit r/MachineLearning — *"Why isn't uncertainty estimation
  implemented in more [production models]"* — community acknowledgment
  that this is a known gap.
- ScienceDirect (cited 25) — *"A vision for uncertainty-aware machine
  learning in healthcare"* (2025).
- NITMB — *"Understanding Sources of Uncertainty in Machine Learning"*
  — distinguishes epistemic vs. aleatoric uncertainty.

**Confidence: HIGH** for "uncertainty is a recognized ML Engineering
concern." **MEDIUM** for "candidates specifically fail this in
interviews" — not directly stated as a hiring failure mode.

### 22.5 Missing model-drift monitoring discipline

**Evidence:**
- MLflow (Jul 2026) — *"Why Monitor Model Drift in Production"*: *"Drift
  monitoring works best when it is wired directly into your MLOps
  pipeline rather than bolted on as an afterthought."*
- Evidently AI — concept drift, target drift, data drift as distinct
  monitoring concerns.
- Microsoft FastTrack — *"Identifying drift in ML models: best
  practices for generating consistent, reliable [retraining]"*.
- Datadog — *"Machine learning model monitoring: Best practices"*:
  *"To cope with drift, ML models generally have to be retrained at a
  set cadence."*
- Fulcrum Digital — *"AI Model Drift in Production"*: *"ML model
  monitoring is continuous, standardized, and tied to retraining
  workflows MLflow, SageMaker, Evidently AI, and Arize AI are key
  drift [tools]."*
- Aerospike — *"Mitigating model drift in machine learning"*.

**Confidence: HIGH.** Vendor + practitioner + reference-paper
convergence.

### 22.6 Missing stakeholder translation skill

**Evidence:**
- Harvard Data Science Review (MIT Press, Malone 2020, cited 8) —
  *"When Translation Problems Arise Between Data Scientists and
  stakeholders"*: *"the metrics that quantify outcomes are generally
  very different for data scientists and business stakeholders, making
  it likely that each side struggles to understand and speak in terms
  that [the other understands]."*
- HDSR — *"Data Science and Decision Science Skills: Are They
  Different?"* — bridges the analysis-to-decision gap.
- TowardsDataScience — *"How to Translate ML Results Into Business
  Impact"*: *"1. Show improvement relative to company KPIs · 2. Show
  incremental revenue impact."*
- Fitch Group Lead MLE JD (Toronto): *"ML engineers while partnering
  with product squads, business stakeholders, and cross-functional
  teams to translate ambitious AI ideas."*
- ZipRecruiter — AI Data Translator role: *"interpret complex technical
  findings, translate them into business-friendly language."*

**Confidence: HIGH.** Converges across academic, practitioner, and JD
sources.

### 22.7 Bootcamp-portfolio inflation

**Evidence:**
- iTeachRecruiters — *"The Bootcamper Dilemma: Spotting Inflated
  Resumes in Tech"*: *"Flag candidates whose projects appear bootcamp-
  centric for further scrutiny."*
- LinkedIn (Wissam Metawee) — *"Dear recruiters, please stop expecting
  to see personal projects running in production from every candidate"*
  — pushback that implies recruiters are looking for production
  evidence beyond bootcamp projects.
- YouTube — *"Why AI/ML Students Can't Find Jobs"*: *"STOP Taking
  Random AI Courses."*

**Confidence: MEDIUM.** Recruiter + practitioner convergence; not a
hiring-manager survey.

---

## 23. Role-specific skills — AI / ML Engineer

### 23.1 Required skills (consensus across ≥2 sources)

| Skill | Required or preferred? | Confidence | Sources |
|---|---|---|---|
| Python (primary ML language) | Required | HIGH | Indeed MLE JD, 365 Data Science, KDR Talent, Coursera, O*NET 15-2051 |
| Software engineering depth (data structures, algorithms, system design) | Required | HIGH | 365 Data Science, Bain Staff MLE JD, Kore1 interview prep |
| ML system design (model serving, batch vs. real-time, feature stores) | Required at mid+ | HIGH | Kore1, ml-ops.org, DevOpsSchool Staff MLE |
| Probability, statistics, linear algebra, calculus | Required | HIGH | LinkedIn Business MLE JD, U San Diego 2026 guide, KDR |
| Classical ML (classification, regression, clustering, dimensionality reduction, model selection) | Required | HIGH | O*NET 15-2051.00, Coursera, U San Diego |
| Deep-learning frameworks (PyTorch, TensorFlow) | Required at most postings | MEDIUM | O*NET Hot Tech, AWS ML Specialty, MeriNova portfolio guide |
| Model evaluation & validation (cross-validation, leakage prevention, baselines, error analysis) | Required | HIGH | O*NET, GeeksforGeeks data-leakage, DataTalks portfolio guide |
| MLOps (CI/CD for ML, model registry, experiment tracking, deployment patterns) | Required at mid+ | HIGH | ml-ops.org, AWS, GCP, Databricks, IBM, Microsoft Learn |
| LLMOps (prompt mgmt, RAG eval, observability, guardrails, cost tracking, feedback loops) | Required for LLM-track MLE; preferred otherwise | MEDIUM | Google Cloud, Humaineeti, qubittool, mlopslab, LLMOps.si, School of Core AI |
| Model drift monitoring + retraining (data drift, concept drift, target drift; MLflow / Evidently / Arize) | Required at mid+ | HIGH | MLflow, Evidently AI, Datadog, Microsoft FastTrack, Aerospike |
| Uncertainty quantification + abstention (epistemic vs. aleatoric; conformal prediction; selective prediction) | Required at senior+ for safety-critical domains | MEDIUM | PMC, AAAI 2025, Mindful Modeler, ICML 2025, ScienceDirect, NITMB |
| Cloud platforms (AWS SageMaker, GCP Vertex AI, Azure ML) — at least one | Required at mid+ | MEDIUM | AWS / Google / Azure cert tracks; O*NET Hot Tech |
| Containerization + orchestration (Docker, Kubernetes) | Required at mid+ | MEDIUM | O*NET Hot Tech (Docker, Kubernetes), DevOpsSchool Staff MLE |
| Stakeholder translation / business-impact framing | Required at mid+ | HIGH | HDSR, Fitch Lead MLE JD, TowardsDataScience, ZipRecruiter AI Data Translator |
| Communication (written, oral, documentation) | Required | HIGH | Indeed MLE JD, Fitch Lead MLE JD, Bain Staff MLE JD |
| Data leakage prevention (target leakage, train-test contamination, time-series leakage) | Required (non-compensatory) | HIGH | GeeksforGeeks, O*NET 15-2051 Tasks 5 & 15, IBM/H2O/Kaggle (from §3.5) |
| C++ / Java / Matlab (alternative languages for performance / legacy) | Preferred | LOW | Indeed MLE JD, KDR Talent |
| Reading scientific literature / research papers | Required at senior+ | MEDIUM | O*NET 15-2051 Task 13, Reddit r/MachineLearning portfolio thread |

### 23.2 Commonly taught vs. what practitioners must demonstrate

| Commonly taught | What practitioners must demonstrate |
|---|---|
| `RandomForestClassifier().fit(X, y)` in a notebook | A reproducible training pipeline (DVC or MLflow) with experiment tracking, baselines, ablations |
| Accuracy / F1 on a held-out test set | Leakage-proof cross-validation + error analysis by slice + calibrated probabilities where relevant |
| `model.save()` and inference in a notebook | A containerized model server (FastAPI / BentoML / TorchServe) with health check, latency budget, and a rollback plan |
| Single notebook "in production" | A CI/CD pipeline that retrains on data drift, runs canary, gates on metrics, rolls back on regression |
| A GPT-4 wrapper script | An LLMOps stack with prompt versioning, RAG eval, observability, guardrails, cost tracking |
| "I implemented paper X" (Reddit r/ML) | "I shipped a model to production and it survived N months of drift" (Reddit r/ML top answer on what's impressive) |

### 23.3 Tool-specific vs. durable capabilities

**Tool-specific (perishable within 2–3 yrs as the MLOps/LLMOps space churns):**
- Specific MLflow / SageMaker / Vertex AI / Azure ML SDK calls
- Specific LangChain / LlamaIndex / DSPy APIs
- Specific Arize / Evidently / WhyLabs dashboard configuration
- Specific framework version APIs (PyTorch X vs. Y, transformers v4.N)

**Durable (transfer across vendors and into adjacent engineering roles):**
- Experimental design for ML (hypothesis, metric, baseline, decision rule)
- Leakage prevention reasoning (target, train-test, time, group, label)
- Drift taxonomy (covariate, label, concept) and detection strategies
- Uncertainty taxonomy (epistemic vs. aleatoric) and when to abstain
- Cost / latency / accuracy tradeoff reasoning
- Serving patterns (batch, real-time, streaming, edge)
- Stakeholder translation (KPI mapping, incremental-revenue framing)
- System design for ML (feature stores, model registries, evaluation harnesses)

### 23.4 Market differentiators

1. **Production-deployed model** — Reddit r/MachineLearning: *"more
   impressed with someone who knows how to take ML models to
   production."*
2. **End-to-end ownership** — DevOpsSchool Staff MLE: *"responsible for
   designing, building, and operating production-grade machine learning
   systems that deliver measurable product and business outcomes."*
3. **Architecture and standards leadership** — Bain Staff Engineer, ML:
   *"defining the architecture, engineering standards, and operational
   excellence of [the] machine learning ecosystem."*
4. **Stakeholder translation** — Fitch Lead MLE: *"translate ambitious
   AI ideas"*; ZipRecruiter AI Data Translator role exists specifically
   to bridge this gap.
5. **LLMOps fluency (2026 differentiator)** — Humaineeti, qubittool,
   mlopslab, LLMOps.si all published 2026 LLMOps guides; depth here is
   a frontier-lab signal.
6. **Uncertainty-aware ML (safety-critical differentiator)** — ICML 2025
   + AAAI 2025 + healthcare literature: depth here is a research-lab /
   regulated-industry signal.

### 23.5 Salary and geography notes

- **United States, ML Engineer, mlengineersalary.com (2026):** L3 → L7
  ladder; *"Most engineers reach L6 (staff) in 8 to 12 total years of
  experience. At fast-moving employers (T1 frontier labs, T3 AI
  unicorns), exceptional performers can reach L6 in 6 to 8 years."*
- **Mexico, Glassdoor (2026):** 322 ML vacantes; ML Engineer
  $50,000–$85,000 MXN/month range cited.
- **LATAM remote:** RemoteRocketship lists 64 remote ML Engineer roles
  in Latin America (deep learning, NLP, LLM engineer sub-tracks).
- **Mexico, Michael Page:** Ingeniero de Machine Learning — Lic/Ing in
  CS or Math required.

---

## 24. Level differentials — AI / ML Engineer

Four capability levels using **autonomy / ambiguity / scope / complexity / consequence**.

### Level 1 — Foundational / Entry (L3)

- **Autonomy:** Works under routine supervision; applies specified ML
  techniques to a defined dataset. (SFIA L2 "Assist.")
- **Ambiguity:** Low. Model, dataset, and metric are pre-scoped by a
  senior MLE or DS.
- **Scope:** One model, one notebook, one dataset.
- **Complexity:** Standard scikit-learn pipeline, train/validation/test
  split, classification or regression on cleaned data, basic evaluation
  (accuracy, RMSE, F1). Reads and reproduces existing papers.
- **Consequence:** Low. Output is reviewed; failure delays a
  proof-of-concept.
- **Market readiness:** Equivalent to TDS L3 for DS; *"writes the SQL
  query, builds the dashboard, runs the experiment."* Plain English
  (Python): *"Failed 23 ML Engineer Interviews Before Learning These
  Concepts"* — describes the L3→L4 transition as adding
  production/pipeline/deployment/monitoring awareness.
- **Evidence of capability:** One end-to-end ML project with proper
  train/validation/test split, no leakage, documented, reproducible.

### Level 2 — Independent Practitioner (L4)

- **Autonomy:** Works under general direction; owns one model in
  production-adjacent state. (SFIA L3 "Apply.")
- **Ambiguity:** Receives a question; chooses the data sources, model
  family, evaluation protocol, and deployment pattern.
- **Scope:** A model in production with monitoring; one product squad's
  ML backlog; contributes to platform decisions.
- **Complexity:** Feature engineering, hyperparameter tuning, model
  comparison with proper validation, containerized deployment (FastAPI
  / TorchServe), MLOps basics (MLflow / DVC, CI/CD for model, drift
  monitoring stub). Leakage prevention as a habit.
- **Consequence:** Medium. A bad model affects a product surface;
  undetected drift degrades decisions over weeks.
- **Market readiness:** Reddit r/MachineLearning top answer: *"more
  impressed with someone who knows how to take ML models to
  production."* Kore1 (2026): *"The strongest machine learning engineer
  interview questions in 2026 test ML system design, applied math
  intuition, MLOps fluency."*
- **Evidence of capability:** A shipped model in production with
  monitoring and a rollback plan; a follow-up analysis that anticipates
  drift; clean README; ≥1 unit test on data and model code; a
  containerized inference server with a latency budget.

### Level 3 — Advanced Delivery (L5 Senior MLE)

- **Autonomy:** Works autonomously; supports and guides L1/L2 MLEs;
  contributes expertise to platform decisions. (SFIA L4 "Enable.")
- **Ambiguity:** Investigates product opportunities and assesses ML
  suitability; formulates hypotheses; anticipates risks of modelling.
- **Scope:** Cross-team ML initiatives; design of experimentation
  infrastructure; design of MLOps platform decisions; mentorship of L2.
- **Complexity:** Diverse ML techniques and specialized platforms.
  Selects, acquires, integrates data. Designs feature stores, model
  registries, evaluation harnesses. Designs drift detection and
  retraining workflows. Begins LLMOps architecture (prompt mgmt, RAG
  eval, guardrails). Begins uncertainty quantification for
  safety-critical surfaces.
- **Consequence:** High. Owns the reliability of multiple production
  models; architectural mistakes propagate across teams.
- **Market readiness:** Fitch Lead MLE JD: *"partnering with product
  squads, business stakeholders, and cross-functional teams to translate
  ambitious AI ideas."* DevOpsSchool Staff MLE (L6 boundary): *"bridges
  applied ML, software engineering, and platform thinking — ensuring
  models are not only accurate, but also reliable, scalable,
  observable."*
- **Evidence of capability:** A shipped model in production with
  monitoring, drift detection, and retraining; a documented
  experimentation framework used by ≥1 other team; mentorship of ≥1 L2
  MLE; a tradeoff memo on a real platform decision.

### Level 4 — Technical Leadership / Mastery (L6 Staff MLE → L7 Principal)

- **Autonomy:** Provides authoritative guidance; works under broad
  direction; accountable for the ML platform and ecosystem. (SFIA L5
  "Ensure, advise"; SFIA L6 "Initiate, influence" at L7.)
- **Ambiguity:** Defines the ML platform roadmap; identifies which
  problems are ML problems, which are not, and which are platform
  investments. Resolves ambiguity for the entire ML org.
- **Scope:** Org-level ML roadmap; sets direction for techniques,
  methodologies, tools; leads development of organizational
  capabilities; vendor relationships.
- **Complexity:** Strategic, large, complex ML initiatives. Multiplier
  effect through frameworks, mentoring, alignment across teams. Designs
  the LLMOps / MLOps platform. Defines the evaluation and risk-review
  standards. Defines the uncertainty / abstention policy for
  safety-critical surfaces.
- **Consequence:** Critical. Architectural and roadmap decisions shape
  the org's ML capability for years; a wrong platform bet can cost
  quarters of effort.
- **Market readiness:** DevOpsSchool Staff MLE: *"responsible for
  designing, building, and operating production-grade machine learning
  systems that deliver measurable product and business outcomes."*
  Bain Staff Engineer, ML: *"defining the architecture, engineering
  standards, and operational excellence of [the] machine learning
  ecosystem."* mlengineersalary.com: L6 reached in 8–12 yrs typical;
  6–8 yrs at frontier labs.
- **Evidence of capability:** A platform or framework adopted across
  ≥2 ML teams; mentorship of multiple L3 MLEs; published internal
  standards for ML evaluation, deployment, monitoring, or
  uncertainty/abstention; alignment of multiple teams around a shared
  ML platform or risk framework.

---

## 25. Frequently missing capabilities — Production Python / Software Engineer

The Production Python role is a Python-first software engineering role.
The bootcamp gap is dominated by *production-readiness naivety*
(observability, packaging, deployment), *type-safety discipline*
(mypy/Pyright), and *code-review / collaboration literacy*.

### 25.1 Missing production-readiness discipline

**Evidence:**
- StackOverflow Blog (2022) — *"How observability is redefining the
  roles of developers"*: *"Developer observability is a new pillar of
  observability adapted for the needs of developers."*
- Medium (Fahad Ahammed) — *"4 Important Dev Practices to Make Your
  Python App Production-Ready"*: pillar 4 is *"Observability: Knowing
  When Things Go Wrong."*
- Splunk (Jun 2026) — instrument Python applications via OpenTelemetry
  agent.
- UltraTendency Academy (Feb 2026) — *"Operations-Driven Python: CLIs,
  APIs, observability, log management, automated testing."*
- IBM Developer — *"Observability-driven development with Instana"*.
- LinkedIn (WSO2) — *"How to deploy and manage Python apps in
  production"*: *"1) define goals and requirements, 2) set up a virtual
  environment, 3) outline architecture…"*

**Confidence: HIGH.** Vendor + practitioner convergence.

### 25.2 Missing type-safety discipline (mypy / Pyright)

**Evidence:**
- JobDescription.org — Python Developer JD: *"Type annotations and
  mypy/Pyright type checking are now baseline expectations in
  professional codebases"* (2025–2026).
- OpenPython — *"Python Interview Questions and Answers"*: covers
  decorators, generators, type hints as the interview question set.
- HackerRank (2026) — *"Python is the most commonly tested language in
  data engineering, ML engineering, backend, and full-stack roles.
  Interviewers probe both syntax knowledge and idiomatic Python
  patterns."*

**Confidence: HIGH.** Hiring-guide + JD convergence.

### 25.3 Missing code-review / Git-collaboration literacy

**Evidence:**
- GitHub Discussions — *"Best Practices for Hiring Skilled Software
  Developers"*: *"Code Review: Look at PRs where they reviewed others'
  code. Are they polite? Do they catch bugs? Do they suggest
  improvements constructively?"*
- LinkedIn (Smith Tripp) — *"GitHub signals for early-career SWE/FDE
  candidates"*: GitHub is one of the strongest signals; the question is
  *what* signals (PR review history, business-case READMEs, not
  abstract GitHub rank).
- Medium (Plain English) — *"7 Python GitHub Projects That Opened
  Career Doors"*: *"A GitHub project proves it, shows how you think,
  reveals whether you write code other people can understand, and
  stays visible indefinitely."*
- Reddit r/ExperiencedDevs — *"Code review interview"* thread.
- Reddit r/ExperiencedDevs — *"Tech lead pushes commits to my branch"*
  — surfaces PR-review culture issues.
- Gregory Szorc (2020) — *"Problems with Pull Requests and How to Fix
  Them"*.
- GitKraken — *"Code Reviews for Git Workflows"*: *"AI-generated code,
  and review fatigue"* as 2026 drivers.

**Confidence: HIGH.** Multiple converging practitioner + hiring sources.

### 25.4 Missing async-testing skill (FastAPI / pytest-asyncio)

**Evidence:**
- FastAPI docs — *"Async Tests"* and *"Testing"*: TestClient + pytest
  + httpx; the *advanced* tutorial covers async DB testing.
- TestDriven.io (Dec 2022) — *"Developing and Testing an Asynchronous
  API with FastAPI, Postgres, pytest, Docker, TDD."*
- WeirdSheepLabs (Nov 2024) — *"Fast and furious: async testing with
  FastAPI and pytest"*.
- Orchestra (Jan 2024) — *"Tutorial on FastAPI Async Tests"*.
- Reddit r/FastAPI — *"FastAPI with Async Tests"*.
- GitHub FastAPI discussions — *"Async testing documentation is
  missing details on selecting [asyncio backend]"* — implies a
  practitioner pain point.

**Confidence: MEDIUM.** Strong tutorial ecosystem; not a hiring-manager
quote.

### 25.5 Missing security mindset (OWASP)

**Evidence:**
- OWASP Foundation — Careers / Job Postings — implies OWASP Top 10 is
  a baseline expectation.
- Skillsoft (Sep 2024) — *"5 Certifications to Validate ML Skills"*:
  Azure AI Engineer *"validates a professional's ability to build and
  implement AI solutions on the platform, doing so securely."*
- Cybertex (Sep 2025) — *"How Recruitment Scams Target Developers via
  GitHub Test Tasks"*: candidates must be security-aware even during
  take-homes (*"don't blindly run code from unknown sources"*).
- LinkedIn (Sep 2025) — recruitment scams via GitHub: reinforces
  security-as-a-practitioner-habit.

**Confidence: MEDIUM.** OWASP Top 10 is industry-standard; not a
hiring-manager quote for Python specifically.

### 25.6 Bootcamp-portfolio inflation and coding-test mismatch

**Evidence:**
- LinkedIn — *"Why Python Hiring Mistakes Quietly Cost Companies Over
  $100K"*: *"The 5 most common Python hiring mistakes we found. After
  reviewing all 50 cases, five patterns appeared repeatedly."*
- Medium (Design Bootcamp) — *"Hiring Managers Don't Want Your Resume"*:
  *"hiring managers do not care about a GitHub rank in the abstract.
  They care about what GitHub-derived signals let them see quickly."*
- LinkedIn (Zubin Ajmera) — *"Failed by coding tests: Why they don't
  predict job success"*: *"candidates who score highest on coding
  platforms are often the weakest performers six months in."*
- iTeachRecruiters — *"The Bootcamper Dilemma"*: flag candidates whose
  repos are bootcamp-centric.
- Reddit r/codingbootcamp — *"Why you're not going to get a job after a
  bootcamp"*.
- Reddit r/recruitinghell — recruiters on coding bootcamps.
- Hacker News (2018) — time-limited coding challenges via Git.
- Cybertex (2025) — recruitment scams via GitHub test tasks.

**Confidence: HIGH.** Multiple converging hiring-manager / recruiter
sources.

### 25.7 Missing end-to-end ownership signal

**Evidence:**
- Codeling — *"Python Project Ideas: Build a Strong Backend
  Portfolio"*: *"A good project does more than show that you can write
  Python. It shows that you can build software with constraints, make
  trade-offs, and finish."*
- Noble Desktop — *"Python Developer Portfolio Website Guide &
  Tips"*: *"manage an online code repository, collaborate with others."*
- Turing — *"10 Tips for Building a Strong Software Engineer
  Portfolio"*: *"a portfolio provides tangible evidence of a software
  engineer's skills, knowledge, and experience."*
- Medium (Plain English) — *"10 Python Projects That Made My Portfolio
  Way Stronger"*.

**Confidence: HIGH.** Practitioner + portfolio-guide convergence.

---

## 26. Role-specific skills — Production Python / Software Engineer

### 26.1 Required skills (consensus across ≥2 sources)

| Skill | Required or preferred? | Confidence | Sources |
|---|---|---|---|
| Python (core, OOP, decorators, generators, context managers, data model) | Required | HIGH | JobDescription.org, OpenPython, HackerRank, InterviewQuery |
| Type annotations + mypy / Pyright | Required (2025–2026 baseline) | HIGH | JobDescription.org, OpenPython |
| Idiomatic Python patterns (comprehensions, itertools, dataclasses, attrs, Pydantic) | Required | HIGH | OpenPython, HackerRank |
| Testing (pytest, pytest-asyncio, TestClient, fixtures, mocks, coverage) | Required | HIGH | FastAPI docs, TestDriven.io, WeirdSheepLabs, Orchestra |
| Async / concurrent programming (asyncio, async/await, async DB drivers) | Required for FastAPI / async-track | HIGH | FastAPI async-tests docs, WeirdSheepLabs, Orchestra |
| Git + GitHub workflow (branching, PRs, code review, merge strategies, rebase) | Required | HIGH | GitHub Discussions, LinkedIn Smith Tripp, dev.to Erika Heidi, Reddit r/ExperiencedDevs |
| Code review literacy (giving + receiving constructive review, review etiquette) | Required | HIGH | GitHub Discussions, Reddit r/ExperiencedDevs, GitKraken |
| Web framework (FastAPI, Django, Flask — at least one) | Required | HIGH | FastAPI docs, TestDriven.io, NareshIT DevOps JD |
| Database (Postgres / MySQL / SQLite + an ORM: SQLAlchemy, Django ORM, Tortoise) | Required | HIGH | InterviewGuy Junior Python JD, TestDriven.io |
| Front-end basics (HTML / CSS / JS; one of React/Vue/Svelte preferred) | Required at junior+ | MEDIUM | InterviewGuy Junior Python JD |
| Observability (logging, structured logs, metrics, tracing, OpenTelemetry) | Required at mid+ | HIGH | StackOverflow Blog, Splunk, UltraTendency, IBM Developer, Fahad Ahammed |
| DevOps basics (Docker, CI/CD, Linux/bash, cloud platform) | Required at mid+ | HIGH | boot.dev, roadmap.sh, NareshIT, Reddit r/devops |
| Containerization + orchestration (Docker; Kubernetes at senior+) | Required at mid+ | MEDIUM | boot.dev, NareshIT, Reddit r/devops |
| Security mindset (OWASP Top 10, input validation, secret management, dependency hygiene) | Required at mid+ | MEDIUM | OWASP Foundation, Cybertex, Skillsoft |
| System design (microservices, message queues, caching, performance tuning) | Required at senior+ | HIGH | Python Foundation careers, Fonzi.ai ladder |
| Performance tuning (profiling, optimization, async I/O, memory) | Required at senior+ | MEDIUM | Python Foundation careers |
| Code-review leadership (driving review culture, mentoring juniors) | Required at senior+ | MEDIUM | Python Foundation careers, GitHub Discussions |

### 26.2 Commonly taught vs. what practitioners must demonstrate

| Commonly taught | What practitioners must demonstrate |
|---|---|
| `print()` debugging | Structured logging + OpenTelemetry tracing + metrics dashboards |
| `requirements.txt` with no version pins | `pyproject.toml` + lockfile + reproducible build + deterministic CI |
| A Flask "hello world" | A FastAPI service with async DB, pytest fixtures, containerized, CI-gated, observable |
| `def add(a, b): return a + b` | Type-annotated functions (`def add(a: int, b: int) -> int`) with mypy in CI |
| A single `main.py` script | A packaged Python module (`src/` layout) with CLI entry point, tests, docs |
| Pushing directly to `main` | A PR with description, CI checks, review feedback incorporated, squash-merge |
| "It works on my machine" | A Dockerfile + docker-compose that reproduces the production environment |
| A 200-line `if/elif` chain | A refactor that splits responsibilities, adds types, and passes review |

### 26.3 Tool-specific vs. durable capabilities

**Tool-specific (perishable within 2–4 yrs):**
- Specific framework versions (FastAPI 0.10x vs. 0.11x APIs; Django 4.x vs. 5.x)
- Specific CI platform YAML (GitHub Actions vs. GitLab CI vs. CircleCI)
- Specific cloud SDK calls (boto3 vs. google-cloud-python vs. azure-sdk)
- Specific observability vendor SDKs (Splunk OTel vs. Datadog vs. Honeycomb)

**Durable (transfer across frameworks and into adjacent engineering roles):**
- Python data model and idioms (decorators, descriptors, context managers, metaclasses)
- Type-driven design (mypy / Pyright discipline, gradual typing strategy)
- Testing discipline (test pyramids, fixtures, mocks vs. stubs, property-based testing)
- Async / concurrent programming reasoning (event loops, blocking calls, backpressure)
- Observability reasoning (logs vs. metrics vs. traces; sampling; cardinality)
- System design reasoning (caching, queueing, consistency, availability, partitioning)
- Code-review literacy (giving constructive feedback, receiving feedback, conflict resolution)
- Security mindset (input validation, output encoding, authn/authz, secret management)
- Git workflow reasoning (branching strategy, merge vs. rebase, bisect, history hygiene)

### 26.4 Market differentiators

1. **Type-annotated, mypy-clean codebases** — JobDescription.org: *"...now
   baseline expectations in professional codebases."*
2. **End-to-end ownership of a production service** — Python Foundation
   careers: Senior Software Engineer / Tech Lead / Staff Engineer /
   Platform Developer → Principal/Architect; *"system design,
   microservices, message queues, caching, observability, code review
   leadership, performance tuning."*
3. **Code-review history visible on GitHub** — GitHub Discussions +
   LinkedIn Smith Tripp: PR review behavior is the strongest GitHub-
   derived signal.
4. **Production observability built-in** — StackOverflow Blog +
   Fahad Ahammed + UltraTendency: structured logs + metrics + tracing
   as a discipline, not an afterthought.
5. **Async-tested services** — FastAPI + pytest-asyncio + TestClient:
   async DB, async endpoints, async tests in CI.
6. **OWASP-aware design** — input validation, secret management,
   dependency hygiene; not just "passes OWASP ZAP scan."
7. **A finished, constrained project** — Codeling: *"A good project
   does more than show that you can write Python. It shows that you
   can build software with constraints, make trade-offs, and finish."*

### 26.5 Salary and geography notes

- **Mexico, Glassdoor (2026):** *"Mínimo 4 años de experiencia como
  desarrollador. Experiencia en entornos Cloud (AWS, Azure o
  similares). Visa vigente para posible viaje a Estados Unidos."*
- **Mexico, Indeed (Azumo remote LATAM):** *"5+ years experience."*
- **Mexico, OCC Mundial (2026):** Ingeniero de datos / Python / SQL /
  Power BI, $28k–$30k MXN monthly.
- **Chile, GetOnBoard:** Python job tag with daily new postings.
- **LATAM, Vacantes Digitales:** 1,000+ backend LATAM vacantes
  (remote + on-site).
- **United States, BLS OOH (Software Developers, QA Analysts,
  Testers):** Job Zone 4 (4-year bachelor's typical); O*NET 15-1252.00.

---

## 27. Level differentials — Production Python / Software Engineer

Four capability levels using **autonomy / ambiguity / scope / complexity / consequence**.

### Level 1 — Foundational / Entry (Junior Python Developer)

- **Autonomy:** Works under routine supervision; follows established
  patterns. (SFIA L2 "Assist.")
- **Ambiguity:** Low. Task is pre-scoped; ticket specifies the function
  or endpoint to implement.
- **Scope:** One endpoint, one function, one bug fix, one test.
- **Complexity:** Core Python (data structures, OOP basics, decorators,
  generators), basic Git workflow (branch + PR), one web framework
  (FastAPI or Flask), basic SQL, basic pytest. Type hints on new code.
- **Consequence:** Low. Output reviewed by senior; failure blocks one
  ticket.
- **Market readiness:** InterviewGuy Junior Python Developer JD:
  *"Python skills, basic understanding of front-end technologies,
  experience with version control systems like Git, and familiarity
  with databases."*
- **Evidence of capability:** A reproducible project with README,
  requirements file, ≥3 unit tests, type hints on all new code, PR
  history showing review feedback incorporated.

### Level 2 — Independent Practitioner (Mid-level Python Developer)

- **Autonomy:** Works under general direction; owns a service or
  feature end-to-end. (SFIA L3 "Apply.")
- **Ambiguity:** Receives a feature spec; chooses the API design, the
  data model, the test strategy, the deployment pattern.
- **Scope:** A service or feature in production with CI/CD; one squad's
  backend backlog; contributes to platform decisions.
- **Complexity:** Type-annotated Python with mypy in CI; pytest
  fixtures + mocks + coverage; async I/O (asyncio, async DB drivers);
  FastAPI / Django service with authn/authz; Docker + docker-compose;
  structured logging; basic metrics; CI/CD pipeline (GitHub Actions /
  GitLab CI); basic cloud deployment.
- **Consequence:** Medium. A bad deploy affects a production service;
  an unhandled edge case causes user-facing errors.
- **Market readiness:** JobDescription.org: *"Type annotations and
  mypy/Pyright type checking are now baseline expectations in
  professional codebases."* HackerRank (2026): *"Python is the most
  commonly tested language… Interviewers probe both syntax knowledge
  and idiomatic Python patterns."*
- **Evidence of capability:** A production service with README, tests
  (>70% coverage), mypy-clean, containerized, CI-gated, with structured
  logs and at least one metric; a post-mortem of one production
  incident with a prevention plan.

### Level 3 — Advanced Delivery (Senior Software Engineer)

- **Autonomy:** Works autonomously; supports and guides L1/L2;
  contributes to platform standards. (SFIA L4 "Enable.")
- **Ambiguity:** Investigates product opportunities and assesses
  engineering tradeoffs; formulates technical proposals; anticipates
  risks.
- **Scope:** Cross-team services; design of internal platform
  decisions; mentorship of L2; code-review leadership.
- **Complexity:** System design (microservices, message queues,
  caching, performance tuning, database schema design); observability
  discipline (OpenTelemetry tracing, metrics, SLOs); security
  discipline (OWASP-aware design, secret management, dependency
  hygiene); Kubernetes; multi-environment promotion; performance
  profiling and optimization.
- **Consequence:** High. Owns the reliability of multiple services;
  architectural mistakes propagate across teams.
- **Market readiness:** Python Foundation careers — Senior Software
  Engineer: *"system design • microservices • message queues • caching
  strategies • observability • code review leadership • performance
  tuning."*
- **Evidence of capability:** A documented service architecture
  adopted across ≥2 squads; a CoE-standard doc (testing, observability,
  or security) adopted by ≥2 developers; mentorship of ≥1 L2; a
  post-mortem of a significant incident with platform-level prevention.

### Level 4 — Technical Leadership / Mastery (Staff / Principal / Architect)

- **Autonomy:** Provides authoritative guidance; works under broad
  direction; accountable for the platform and engineering culture.
  (SFIA L5 "Ensure, advise"; SFIA L6 "Initiate, influence" at
  Principal.)
- **Ambiguity:** Defines the platform roadmap; identifies which
  problems are platform investments, which are product features, and
  which are tech debt. Resolves ambiguity for the engineering org.
- **Scope:** Org-level engineering roadmap; sets direction for
  techniques, methodologies, tools; leads development of organizational
  capabilities; vendor relationships.
- **Complexity:** Strategic, large, complex initiatives. Multiplier
  effect through frameworks, mentoring, alignment across teams.
  Designs the platform (service template, deployment platform,
  observability platform, security platform). Defines the
  code-review and engineering-excellence standards.
- **Consequence:** Critical. Architectural and roadmap decisions shape
  the org's engineering capability for years; a wrong platform bet can
  cost quarters of effort.
- **Market readiness:** Python Foundation careers — Tech Lead / Staff
  Engineer / Platform Developer → Principal / Architect: *"Define
  technical strategy across teams."* Fonzi.ai engineering ladder:
  Junior → Principal.
- **Evidence of capability:** A platform or framework adopted across
  ≥2 engineering teams; mentorship of multiple L3 engineers; published
  internal standards for engineering excellence (testing,
  observability, security, code review); alignment of multiple teams
  around a shared platform.

---

## 28. Cross-role synthesis

### 28.1 Skills common to all five roles

These appear in required-skills tables for Data Analyst (§5), Data
Scientist (§6), RPA / Automation Developer (§20), AI / ML Engineer
(§23), and Production Python Engineer (§26):

| Skill | Universal? | Notes |
|---|---|---|
| **Python** | Yes (universal) | Default language for DS, AIML, PySE; preferred add-on for DA and RPA (Python-based RPA track) |
| **Communication** (written + oral, audience-tuned) | Yes | O*NET, BLS, HDSR, Susan Shu Chang, Fitch Lead MLE JD, Bain Staff MLE JD, Indeed MLE JD |
| **Debugging** (not just code writing) | Yes | §3.2 (DA/DS), §22.1 (AIML production), §25.3 (PySE code-review); RPA selector-debugging is the analogous skill |
| **Data validation** (null/duplicate/range/schema/join-quality checks) | Yes | KDnuggets; analogous to RPA queue-item validation and PySE input validation |
| **Version control (Git)** | Yes (universal at L2+) | Jobright + Coursera (DA/DS); UiPath + REFramework (RPA); O*NET Hot Tech; GitHub Discussions (PySE) |
| **Business framing of work** (problem → stakeholder → decision → impact) | Yes | Jobright, Soltech, TDS (DA/DS); Monster RPA template; Fitch Lead MLE JD; Codeling PySE |
| **Evidence / portfolio thinking** (reproducible, documented, README-driven) | Yes | Soltech, Jobright (DA/DS); Monster + iRPA (RPA); MeriNova + DataTalks (AIML); Codeling + Noble Desktop (PySE) |
| **AI-code review literacy** | Yes (emerging 2026) | arXiv 2502.18468, Soltech (DA/DS); GitKraken "AI-generated code, review fatigue" (PySE); analogous for AIML (LLM-output eval) and RPA (AI Computer Vision review) |
| **Tradeoff articulation** | Yes (at L3+) | TDS L5; DevOpsSchool Staff MLE; Codeling PySE; ZipRecruiter RPA Architect |
| **Reproducibility** (deterministic seeds, pinned envs, make/just) | Yes | KDnuggets, Soltech (DA/DS); FastAPI + pytest fixtures (PySE); MLflow + DVC (AIML); Orchestrator + REFramework (RPA) |

### 28.2 Skills that differentiate roles

| Skill cluster | DA | DS | RPA | AIML | PySE |
|---|---|---|---|---|---|
| SQL (window functions, CTEs, performance) | ■■■ | ■■ | □ | ■ | ■ |
| Excel / Sheets (pivots, INDEX/MATCH, array formulas) | ■■■ | ■ | □ | □ | □ |
| BI tool (Tableau / Power BI / Looker) | ■■■ | ■ | □ (Power BI for Power Automate track) | □ | □ |
| Statistics (hypothesis testing, regression, experimental design) | ■■ | ■■■ | □ | ■■■ | □ |
| Classical ML (scikit-learn, model validation, leakage prevention) | □ | ■■■ | □ | ■■■ | □ |
| Deep learning (PyTorch / TensorFlow) | □ | ■■ | □ | ■■■ | □ |
| MLOps / LLMOps | □ | ■ | □ | ■■■ | ■ (overlaps with DevOps) |
| UiPath / Automation Anywhere / Power Automate | □ | □ | ■■■ | □ | □ |
| Selector design + UI automation resilience | □ | □ | ■■■ | □ | □ (Playwright/Selenium for PySE) |
| FastAPI / Django / Flask + async testing | □ | □ | □ | □ (API for ML serving) | ■■■ |
| Type safety (mypy / Pyright) + idiomacy | □ | ■ | □ (VB.NET/C# for coded automation) | ■ | ■■■ |
| Observability (OpenTelemetry, structured logs, metrics, tracing) | □ | □ | ■ (bot observability) | ■■ (ML monitoring) | ■■■ |
| System design (microservices, message queues, caching, performance) | □ | □ | ■ (Orchestrator architecture) | ■■ (ML system design) | ■■■ |
| Process analysis / process discovery / process decomposition | ■ (business questions) | ■ (problem framing) | ■■■ | ■ (problem framing) | ■ (requirements decomposition) |
| Stakeholder translation / business-impact framing | ■■■ | ■■ | ■■ | ■■■ | ■■ |

Legend: □ = not required; ■ = preferred; ■■ = required at mid+; ■■■ = required at entry-level.

### 28.3 Critical competencies that cannot be compensated

These competencies are *non-compensatory*: a candidate cannot offset
weakness here with strength elsewhere. Each is a Phase 2 badge-design
constraint.

| Competency | Roles | Why non-compensatory | Evidence |
|---|---|---|---|
| **SQL competency (window functions + CTEs + performance)** | DA (auto-reject), DS (hard filter) | Auto-reject filter per Jobright; cannot be offset by Python or BI strength | Jobright Jan 2026; Jess Ramos; LinkedIn 200-post; 365DataScience |
| **Data leakage prevention** | DS, AIML | A model with leakage is a non-model; cannot be salvaged by tuning | IBM/H2O/Kaggle; GeeksforGeeks; O*NET 15-2051 Tasks 5 & 15 |
| **Selector resilience + exception handling** | RPA | A bot that breaks on UI changes is not a production bot; ~60% of RPA failures trace here | Sunflower Lab; UiPath Forum bot-performance; REFramework best practices |
| **Type safety + production hardening** | PySE | A non-typed, non-observable Python service is not production-grade in 2026 | JobDescription.org (mypy baseline); StackOverflow Blog; Fahad Ahammed |
| **ML system design + MLOps fluency** | AIML | Cannot deploy → cannot ship value; 87% of DS projects fail at this boundary | Kore1; Data Science PM; MIT Sloan Review; ml-ops.org |
| **Business framing / metric-design judgment** | All senior+ (L3+) | TDS L5: *"metric choice is strategy"*; without it, technical excellence produces non-actionable output | TDS; HDSR; Fitch Lead MLE JD; Codeling |
| **Communication (audience-tuned)** | All | O*NET top task for DA/DS; Fitch + Bain JDs for AIML; GitHub Discussions for PySE | O*NET 15-2051; Susan Shu Chang; Fitch; Bain; GitHub Discussions |
| **Reproducibility / determinism** | All | A non-reproducible artifact cannot be reviewed, audited, or debugged | KDnuggets; Soltech; FastAPI testing docs; MLflow; REFramework |

### 28.4 Level-progression pattern (universal across all five roles)

The five-level descriptor dimensions (autonomy / ambiguity / scope /
complexity / consequence) progress monotonically across all five roles.
The cognitive-action verb pattern per the Solarized Phase 2 spec is:

| Level | Knowing | Following | Applying w/ guidance | Applying independently | Diagnosing | Designing | Operating | Evaluating | Advising | Leading |
|---|---|---|---|---|---|---|---|---|---|---|
| L1 Foundation | ✓ | ✓ | ✓ | — | — | — | — | — | — | — |
| L2 Independent | ✓ | ✓ | ✓ | ✓ | partial | — | partial | — | — | — |
| L3 Advanced | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | partial | partial | — |
| L4 Leadership | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

This verb-matrix is the basis for the `industry_skill_graph.json` level
descriptors (Phase 2 deliverable).

---

## 29. Evidence suitable for proving each skill — RPA / AIML / Py

Extends §12 (DA/DS evidence table) with the three new roles.

| Skill | Role | Acceptable evidence | Weak evidence (NOT acceptable alone) |
|---|---|---|---|
| UiPath Studio + REFramework | RPA | A REFramework-based bot with dispatcher/performer split, Orchestrator queues, Try-Catch + Retry Scope, stable selectors + anchors, and a post-mortem of one bot that broke and was fixed. | A recording of a 3-row Excel → email bot with no exception handling. |
| Selector resilience | RPA | A bot that survives a documented UI change (with before/after screenshots + selector strategy memo). | A bot that runs once against a stable form. |
| Orchestrator operations | RPA | A personal Orchestrator tenant with 3+ scheduled jobs, queue-item status dashboard, and asset/credential management. | A screenshot of an Orchestrator queue. |
| Process analysis / process discovery | RPA | A process-decomposition memo: which steps to automate, which to re-engineer, which to leave alone, with rationale. | "I automated the whole process." |
| Production ML deployment | AIML | A containerized model server (FastAPI / BentoML / TorchServe) with health check, latency budget, drift monitoring stub, and a rollback plan. | A notebook with `model.save()`. |
| MLOps pipeline | AIML | A CI/CD pipeline that retrains on drift, runs canary, gates on metrics, rolls back on regression. Documented in a README. | A single `train.py` script run manually. |
| LLMOps stack | AIML | An LLMOps stack with prompt versioning, RAG eval, observability, guardrails, cost tracking, and feedback loops. | A GPT-4 wrapper script. |
| Uncertainty quantification | AIML | A model card documenting epistemic vs. aleatoric uncertainty, calibration, and an abstention policy for safety-critical surfaces. | "We use softmax." |
| Drift monitoring | AIML | A monitoring dashboard (Evidently / Arize / MLflow) with data-drift + concept-drift + target-drift alerts wired into a retraining workflow. | "We retrain monthly." |
| Stakeholder translation | AIML | A 1-pager mapping model output to company KPIs and incremental revenue, audience-tuned to a non-technical PM. | A notebook with model accuracy. |
| Type-annotated, mypy-clean codebase | PySE | A `pyproject.toml` + mypy config + CI gate; all new code type-annotated; mypy passes clean. | A repo with `# type: ignore` on every function. |
| Async-tested FastAPI service | PySE | A FastAPI service with async DB, pytest-asyncio, TestClient, fixtures, mocks, >70% coverage, in CI. | A Flask "hello world" with no tests. |
| Observability | PySE | Structured logs (JSON) + OpenTelemetry tracing + metrics (Prometheus) + SLO definitions, all in production. | `print()` statements. |
| Code-review history | PySE | A GitHub PR history showing constructive review of others' code (polite, catches bugs, suggests improvements). | A GitHub profile with no PR review activity. |
| Containerized + CI-gated deployment | PySE | A Dockerfile + docker-compose + CI/CD pipeline (GitHub Actions / GitLab CI) with tests + mypy + security scan gates. | "It works on my machine." |
| OWASP-aware design | PySE | A security review memo covering OWASP Top 10 for a Python web app: input validation, output encoding, authn/authz, secret management, dependency hygiene. | "We passed OWASP ZAP." |
| System design | PySE | A documented service architecture (microservices, message queues, caching, performance budgets) adopted across ≥2 squads. | A single-file service. |
| End-to-end ownership (L3+) | All | A project where the candidate wrote the proposal, defined metrics with stakeholder, implemented, presented, and coordinated rollout. | A notebook / bot / service handed off to a PM. |
| Multiplier / leadership (L4+) | All | A framework adopted by ≥2 teams, with documented adoption and a feedback loop. | "I helped people when they asked." |

---

## 30. Confidence summary per finding — RPA / AIML / Py addendum

| Finding | Confidence | Comment |
|---|---|---|
| ~60% of RPA failures trace to UI changes / selector breaks / unhandled exceptions | HIGH | Sunflower Lab + UiPath Forum + Auto-Healing feature marketing |
| REFramework + queue-based dispatcher/performer is the production pattern | HIGH | UiPath Forum + Ashling.ai + REFramework tutorial ecosystem |
| UiPath is the dominant RPA vendor in US job postings | HIGH | LinkedIn 1,000+ jobs; Indeed 262 remote roles |
| Power Automate / Power Platform is the Microsoft-stack alternative | MEDIUM | Adaface, Auxilion, Interfell LATAM posting |
| Automation Anywhere A360 is the third vendor (smaller share) | MEDIUM | Automation Anywhere University + A360 community |
| Python-based RPA (Playwright/Selenium/Robocorp) is a durable sub-track | MEDIUM | Medium + dev.to practitioner blogs |
| MLE interview failure centers on production concepts (pipelines/deployment/monitoring) | HIGH | Plain English (Python) + Kore1 + DataTalks + Reddit r/ML |
| MLOps is a distinct required skill area at mid+ MLE | HIGH | ml-ops.org + AWS + GCP + Databricks + IBM + Microsoft Learn |
| LLMOps has crystallized as a distinct sub-discipline (2025–2026) | MEDIUM | Google Cloud + Humaineeti + qubittool + mlopslab + LLMOps.si |
| Model drift monitoring + retraining is a required discipline | HIGH | MLflow + Evidently AI + Datadog + Microsoft FastTrack + Aerospike + Fulcrum Digital |
| Uncertainty quantification + abstention is a recognized ML Engineering concern | HIGH | PMC (cited 646) + AAAI 2025 + Mindful Modeler + ICML 2025 + ScienceDirect + NITMB |
| Uncertainty is a *candidate* interview failure mode | MEDIUM | Inferred from research literature; not directly a hiring-manager quote |
| Stakeholder translation is a required MLE skill | HIGH | HDSR + Fitch Lead MLE JD + TowardsDataScience + ZipRecruiter AI Data Translator |
| 87% of DS projects never make it to production | HIGH | Data Science PM (VentureBeat 2019); corroborated by MIT Sloan Review (cited 63) |
| L6 Staff MLE reached in 8–12 yrs typical; 6–8 at frontier labs | MEDIUM | mlengineersalary.com single-source; corroborated by DevOpsSchool + Bain JD |
| MX ML Engineer wage ~$50k–$85k MXN/month | MEDIUM | Glassdoor MX single posting |
| Type annotations + mypy/Pyright are 2025–2026 baseline Python expectations | HIGH | JobDescription.org + OpenPython |
| Observability is a required PySE skill at mid+ | HIGH | StackOverflow Blog + Splunk + UltraTendency + IBM Developer + Fahad Ahammed |
| Code-review history is the strongest GitHub-derived PySE signal | HIGH | GitHub Discussions + LinkedIn Smith Tripp + Medium Plain English |
| FastAPI + pytest-asyncio is the canonical async-testing stack | HIGH | FastAPI docs + TestDriven.io + WeirdSheepLabs + Orchestra |
| Coding-test scores don't predict job success for PySE | MEDIUM | LinkedIn Zubin Ajmera single-source (recruiter); corroborated by Hacker News |
| Bootcamp-portfolio inflation is a cross-role recruiter complaint | HIGH | iTeachRecruiters + LinkedIn Metawee + Reddit r/codingbootcamp + Reddit r/recruitinghell |
| Python Hiring Mistakes cost >$100K — 5 patterns from 50 cases | MEDIUM | LinkedIn single-source; corroborated by Hacker News + Cybertex |
| OWASP Top 10 awareness is baseline PySE expectation | MEDIUM | OWASP Foundation + Skillsoft + Cybertex |
| O*NET 15-1252.00 is the canonical SOC for Production Python Engineer | HIGH | O*NET direct fetch + BLS OOH |
| O*NET 15-2051.00 is the closest SOC for AI/ML Engineer (with 2026 ML/Expert update) | HIGH | O*NET direct fetch; O*NET Resource Center data updates page |
| SFIA 9 is the canonical 7-level framework for cross-role level mapping | HIGH | sfia-online.org + APMG + Lexonis (corroborated from §17 of Part A) |
| ESCO models AI competences across occupations (essential vs optional) | MEDIUM | darioonsori.github.io single-source analysis |
| Cross-role universal skills: Python, communication, debugging, validation, Git, business framing, evidence, AI-code-review literacy, tradeoff articulation, reproducibility | HIGH | Synthesized across §5, §6, §20, §23, §26 (see §28.1) |
| Non-compensatory competencies: SQL (DA/DS), leakage prevention (DS/AIML), selector resilience (RPA), type safety (PySE), MLOps (AIML), business framing (all senior+), communication (all), reproducibility (all) | HIGH | Synthesized across §3, §13, §19, §22, §25, §28.3 |

---

## 31. Search-quality and disagreements note (RPA / AIML / Py)

### 31.1 Search-quality caveats

The 53 raw search files in `phase1_research/raw_searches_rpa_aiml_py/`
include several low-signal returns where the search engine surfaced
generic noise instead of role-specific content:

- `rpa_10_complaints.json` returned Amazon/USPS/USAJobs aggregator
  noise (the term "complaints" matched job-complaint forums, not RPA
  complaints). RPA complaint evidence was instead synthesized from
  `rpa_08_brittleness.json`, `rpa_13_fragile.json`, `rpa_16_reframework.json`.
- `aiml_03_senior.json` partially returned dictionary definitions of
  "staff" (the term "senior" triggered Merriam-Webster). The useful
  entries (DevOpsSchool Staff MLE, Bain Staff Engineer ML) are at the
  tail of the result set.
- `aiml_09_ladder.json` partially returned definitions of "ml"
  (milliliter / Mobile Legends). The useful entry
  (mlengineersalary.com L3→L7 ladder) is at the tail.
- `aiml_11_security.json` returned generic AI-overview pages instead
  of AIML security content. AIML security evidence was synthesized
  from `aiml_12_frameworks.json` (cert outlines mention "doing so
  securely") and from §3.7 of Part A (AI-generated code introduces
  security vulnerabilities per arXiv 2502.18468).
- `aiml_13_data_leakage.json` returned generic definitions of
  "machine." The useful entry (GeeksforGeeks Data Leakage) is at the
  tail.
- `py_03_git.json`, `py_04_interview.json`, `py_07_security.json`,
  `py_11_docker.json`, `py_13_owasp.json`, `py_15_entry.json`
  partially returned Python.org / Wikipedia / W3Schools / Codecademy
  generic Python tutorial pages instead of role-specific content. The
  useful entries are at the tail (HackerRank, OpenPython, OWASP,
  InterviewGuy, boot.dev, Fonzi.ai, Python Foundation).
- `cross_04_security_judgment.json` returned generic engineering
  definitions. Cross-cutting security-judgment evidence was
  synthesized from §3.7 (AI-code review literacy) and §25.5 (OWASP).
- `cross_05_sfia.json` returned Steel Framing Industry Association +
  Sports and Fitness Industry Association (acronym collision with
  SFIA). The useful SFIA entries (sfia-online.org + APMG + Lexonis)
  are at the tail.
- `cross_06_esco.json` returned HVACR / ESCO Group / ESCO Technologies
  / Energy Service Companies (acronym collision with ESCO). The useful
  entry (darioonsori.github.io AI skills in ESCO) is at the tail.

**Implication for Phase 2:** the high-confidence findings above rely on
the *useful tail entries* of each raw search file, not the noisy head.
The synthesized evidence is conservatively rated (HIGH requires ≥3
converging sources; MEDIUM requires 1–2 strong sources or strong
inference; LOW is reserved for single weak sources and is rarely used
here).

### 31.2 Disagreements preserved (per Solarized protocol)

1. **Is the MLE role distinct from the DS role?** O*NET 15-2051.00
   (Data Scientists) is the closest official occupation covering MLEs
   (per O*NET Resource Center 2026 update adding Machine
   Learning/Expert). Reddit r/AusVisa: *"just a bit more software eng
   heavy for ML Engineer job but ultimately pretty similar work
   experience between the two."* Resolution: at L1–L2, the two roles
   overlap heavily; at L3+, the MLE role diverges toward platform /
   system design / MLOps, while the DS role diverges toward
   experimentation / causal inference / metric design. PyArcana should
   treat them as a shared L1–L2 base with divergent L3+ tracks.

2. **Is competitive-programming grinding the right interview prep?**
   Medium (Janie Brooke): *"I spent my first 3 months of preparation
   grinding standard competitive programming"* — implied mistake.
   HackerRank (2026): *"Python is the most commonly tested language…
   Interviewers probe both syntax knowledge and idiomatic Python
   patterns."* LinkedIn (Zubin Ajmera): *"candidates who score highest
   on coding platforms are often the weakest performers six months in."*
   Resolution: syntax + idioms + system design > competitive
   programming for PySE and AIML interviews. PyArcana should not
   optimize for LeetCode-style problems.

3. **Is the bootcamp pathway viable for AIML / PySE?** YouTube *"Why
   AI/ML Students Can't Find Jobs"* + iTeachRecruiters *"Bootcamper
   Dilemma"* + Reddit r/codingbootcamp *"Why you're not going to get a
   job after a bootcamp"* are skeptical. CioDive (2020): *"32% of
   hiring managers said they've hired [bootcamp grads]."* Business
   Insider (2021): *"Boot-camp grads may have more success if they
   highlight projects they've done to show they have a technical and
   real-world background."* Resolution: bootcamps can work but require
   deep, non-bootcamp-clone portfolio work post-completion; internships
   and project-based evidence are the higher-ROI path. (Consistent with
   §14.4 of Part A.)

4. **Is LLMOps a 2026-required skill or still emerging?** Google Cloud
   + Humaineeti + qubittool + mlopslab + LLMOps.si all published 2026
   LLMOps guides, implying maturation. Reddit r/MachineLearning
   *"Why isn't uncertainty estimation implemented in more [production
   models]"* suggests production ML maturity is uneven. Resolution:
   LLMOps is required at frontier labs and LLM-track MLE roles;
   preferred (not required) elsewhere in 2026. PyArcana should badge
   LLMOps as a separate track, not fold it into general MLOps.

5. **Is the Python Developer role a "Software Engineer" role?**
   JobDescription.org + InterviewGuy + HackerRank treat "Python
   Developer" as a Python-first software engineering role with
   front-end / database / Git / Docker / CI/CD expectations. Reddit
   r/devops + boot.dev + roadmap.sh treat DevOps / SRE as an adjacent
   role that Python Developers often grow into. Fonzi.ai + Python
   Foundation careers treat the ladder as Junior → Principal Software
   Engineer. Resolution: PyArcana should treat Production Python as a
   software-engineering track (not a scripting track); the DevOps /
   SRE crossover is a Level 3+ specialization, not a separate role at
   L1–L2.

6. **Is RPA a dying role (post-AI agents)?** UiPath marketing positions
   the platform as *"enabling AI agents, robots, and people to deliver
   [business orchestration]."* Wikipedia notes RPA is *"based on
   software robots (bots) or artificial intelligence (AI) agents."*
   Yahoo Finance: *"UiPath (PATH) its stock is down 37.8%
   year-to-date."* Resolution: the RPA *vendor* landscape is churning
   (UiPath stock decline; agentic-AI competition), but the underlying
   capability (process analysis, state-machine design, exception
   handling, queue-based decoupling) is durable and transfers into
   agentic-AI engineering. PyArcana should badge RPA with a clear
   "durable capabilities vs. tool-specific" split (§20.3).

---

## 32. Handoff to Phase 2 (updated)

Part A (§1–§18) handed off DA + DS evidence. Part B (§19–§31) adds RPA +
AIML + Py. Combined handoff:

1. **Translate the 20-level grid (4 levels × 5 roles) into badge
   rubrics.** Each cell of the level grids in §10, §11, §21, §24, §27
   maps to a badge tier; each row of the evidence tables in §12 and §29
   maps to a rubric criterion.

2. **Map each complaint to an assessment gate.** §13 (C1–C13) +
   §19.1–§19.5 (RPA) + §22.1–§22.7 (AIML) + §25.1–§25.7 (PySE) define
   the failure modes that badges must screen for. Examples:
   - C2 (weak SQL) → SQL-window-function exercise as a hard gate (DA/DS).
   - C5 (data leakage) → take-home with a leakage trap (DS/AIML).
   - §19.1 (selector fragility) → RPA exercise that introduces a UI
     change mid-run and requires the candidate's bot to survive (RPA).
   - §22.1 (production naivety) → AIML exercise that requires
     containerized serving + drift monitoring stub (AIML).
   - §25.2 (missing type safety) → PySE exercise with mypy in CI as a
     hard gate (PySE).

3. **Honor the non-compensatory competencies (§28.3).** Each must be a
   hard gate, not a weighted score. A candidate cannot pass a DA badge
   without SQL competency, even if Python + BI + communication are
   strong.

4. **Build the `industry_skill_graph.json` and `role_skill_taxonomy.json`
   artifacts.** The verb-matrix in §28.4 (knowing / following /
   applying-with-guidance / applying-independently / diagnosing /
   designing / operating / evaluating / advising / leading) is the
   level-progression vocabulary. The skill clusters in §28.2 are the
   role-differentiation vocabulary. The critical competencies in §28.3
   are the non-compensatory gates.

5. **Resolve DIV-001 before badge design.** (Carried forward from
   §18.3.) Any badge that depends on section 40 exam-attempt evidence
   is currently unattainable on the dynamic LMS.

6. **Decide geography scope.** (Carried forward from §17 caveat +
   §18.4.) LATAM evidence is now richer for AIML (Mexico ML Engineer
   $50k–$85k MXN/mo; RemoteRocketship 64 LATAM remote ML roles) and
   PySE (Mexico $28k–$30k MXN/mo; Chile + Colombia + LATAM remote
   backend vacantes). RPA LATAM evidence is thinner (Interfell posting
   is the single strong LATAM RPA source). Decide whether to invest in
   a second LATAM RPA round.

7. **Cross-reference with `course-state/curriculum_hardening/GRAPH_MEMORY.json`.**
   (Carried forward from §18.5.) Do not duplicate; cross-reference.

**End of Phase 1 brief (Parts A + B).**
