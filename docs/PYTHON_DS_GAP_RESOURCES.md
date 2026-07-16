# Free Resources for 8 Curriculum Gap Areas

> **Companion file to** `PYTHON_DS_RESOURCES_INVENTORY.md`
> **Curriculum context**: 52-section "El Arte de Python" DS course — Phase 0 (S1–S13), Phase 1 (S14–S26), Phase 2 (S27–S39), Phase 3 (S40–S52).
> **Verification**: All URLs below were HTTP-checked (curl, browser UA) and returned 200. Star counts and "free" status verified through search-result snippets + landing pages.
> **Honesty note**: Where a topic's flagship book is paid (e.g., Kohavi et al. on A/B testing), we say so explicitly and point to a genuine free alternative.

---

## Gap 1: Statistics & Probability Fundamentals as a Dedicated Arc

**Why it's a gap**: The curriculum's 52 sections jump from NumPy (S6) → Pandas (S8) → Visualization (S9) → sklearn (S10) with no dedicated statistics/probability arc; concepts like distributions, sampling, hypothesis testing, confidence intervals, and Bayes' theorem are only absorbed piecemeal through ML sections.

**Recommended free resources**:

| # | Resource | Author/Platform | URL | Description |
|---|----------|-----------------|-----|-------------|
| 1 | **OpenIntro Statistics** (4th ed., CC BY-SA) | OpenIntro (Mine Çetinkaya-Rundel, David Diez, Christopher Barr) | https://www.openintro.org/book/os/ | Full free PDF + LaTeX source of a canonical intro-stats textbook used at Duke/Berkeley; covers data exploration, probability, inference, regression, and logistic regression with R labs. |
| 2 | **Think Stats: Exploratory Data Analysis in Python** (2nd ed.) | Allen B. Downey / Green Tea Press | https://greenteapress.com/wp/think-stats-2e/ (HTML: https://greenteapress.com/thinkstats2/html/index.html) | Free book that teaches probability and statistics **in Python** — distributions, PDFs, CDFs, hypothesis testing, regression — using real pregnancy/NSFG data; aligns perfectly with a Python-DS curriculum. |
| 3 | **StatQuest — Statistics Fundamentals** (YouTube playlist, 62 videos) | Josh Starmer | https://www.youtube.com/playlist?list=PLblh5JKOoLUK0FLuzwntyYI10UQFUhsY9 | The most-watched free intro-stats video series; each concept (distributions, p-values, CI, t-tests, ANOVA, bootstrap) explained in 5–15 minutes with intuition-first, math-second style. |
| 4 | **3Blue1Brown — Probabilities of probabilities** (YouTube playlist) | Grant Sanderson | https://www.youtube.com/playlist?list=PLZHQObOWTQDOjmo3Y6ADm0ScWAlEXf-fp | Visually stunning free videos on binomial distributions, sampling, and Bayesian thinking — perfect intuition primer before diving into formulas. |

**Best fit for curriculum section**: A new "S0 — Statistics Primer" or appended module to **S8 (Pandas/EDA)** and **S10 (scikit-learn)**. Think Stats pairs with Pandas; OpenIntro supplies the textbook backbone; StatQuest fills conceptual gaps lecture-by-lecture.

---

## Gap 2: Bayesian Statistics / A/B Testing / Experimentation Design

**Why it's a gap**: Only Berkeley Data 8 lightly touches A/B testing; no section covers Bayesian inference, multi-armed bandits, sample-size calculation, or controlled-experiment design — all of which are core DS interview topics and central to product/tech-company work.

**Recommended free resources**:

| # | Resource | Author/Platform | URL | Description |
|---|----------|-----------------|-----|-------------|
| 1 | **Probabilistic Programming and Bayesian Methods for Hackers** (aka "Bayesian Methods for Hackers") | Cam Davidson-Pilon / GitHub | https://github.com/CamDavidsonPilon/Probabilistic-Programming-and-Bayesian-Methods-for-Hackers | Free open-source book (CC BY-NC 3.0) — Bayesian inference taught code-first in PyMC/TFP with chapters on A/B testing, bandits, MCMC, and loss functions. |
| 2 | **Statistical Rethinking — Full Lecture Series** (2023 & 2026 editions, ~26 hours) | Richard McElreath (Max Planck Institute) | https://www.youtube.com/playlist?list=PLDcUM9US4XdPz-KxHM4XHt7uUVGWWVSus (2023) · https://www.youtube.com/@rmcelreath | Free recorded university course (YouTube) accompanying the (paid) book; teaches Bayesian modeling, causal models, and GLMs with deep intuition — widely considered the best free Bayesian course. |
| 3 | **"A/B Test Like a Pro" — Full Online A/B Testing Course** | Data Science Dojo (YouTube playlist) | https://www.youtube.com/playlist?list=PLHS1p0ot3SVjQg0q1eEPrmOmPUY_AT1vB | Free comprehensive online A/B testing course covering experimental design, statistical power, multiple-testing correction, peeking, and interpretation; the curriculum explicitly addresses the gap of "no single canonical free A/B testing course." |
| 4 | *Bonus — partial free chapter* | Kohavi, Tang & Xu, *Trustworthy Online Controlled Experiments* | https://experimentguide.com/wp-content/uploads/TrustworthyOnlineControlledExperiments_PracticalGuideToABTesting_Chapter1.pdf | Only Chapter 1 of the (otherwise paid) industry-standard A/B-testing book is legally free; useful as a definitive reference, but the course above is the real free workhorse. |

**Best fit for curriculum section**: **S10 (scikit-learn)** for the frequentist A/B testing portion; **S33 (Advanced ML Models)** for Bayesian modeling and bandits.

---

## Gap 3: Time-Series Forecasting (ARIMA, Prophet, LSTM Forecasting)

**Why it's a gap**: The inventory already lists a Kaggle Time Series micro-course, but nothing covers the ARIMA family, Prophet's decomposable model, or neural-forecasting (LSTM/Transformer) at the depth required for production forecasting work.

**Recommended free resources**:

| # | Resource | Author/Platform | URL | Description |
|---|----------|-----------------|-----|-------------|
| 1 | **Penn State STAT 510 — Applied Time Series Analysis** | Penn State Online (Eberly College of Science) | https://online.stat.psu.edu/stat510/ | Free full university course with lesson-by-lesson HTML notes covering AR/MA/ARIMA, seasonal models, spectral analysis, and GARCH — the canonical free ARIMA reference. |
| 2 | **Prophet — Official Documentation & Quick Start** | Meta Open Source | https://facebook.github.io/prophet/docs/quick_start.html | Free official docs for Prophet (Facebook's decomposable additive model) — includes Python/R quickstart, seasonality, holidays, changepoints, and diagnostics tutorials; doubles as a textbook. |
| 3 | **Kaggle Learn — Time Series** (micro-course) | Kaggle | https://www.kaggle.com/learn/time-series | Free hands-on micro-course with in-browser notebooks covering forecasting with linear regression, hybrid models, and target encoding — the fastest free practical on-ramp. |
| 4 | **NeuralForecast (Nixtla)** — GitHub + docs | Nixtla (open source, ~3k★) | https://github.com/nixtla/neuralforecast · https://nixtlaverse.nixtla.io/neuralforecast/docs/getting-started/introduction.html | Free open-source Python library with 30+ state-of-the-art neural forecasters (NBEATS, TFT, LSTM, Informer, PatchTST) plus excellent tutorials; this is the modern free alternative to paid LSTM-forecasting courses. |

*Bonus — also worth bookmarking*: **sktime** (https://www.sktime.net) and **Darts** (https://unit8co.github.io/darts/) are both free open-source libraries with extensive tutorials that unify ARIMA, Prophet, and deep-learning forecasters under a single sklearn-like API.

**Best fit for curriculum section**: **S10 (scikit-learn)** for classical forecasting baseline; **S33 (Advanced ML Models)** for Prophet and neural forecasting depth.

---

## Gap 4: MLOps / Model Deployment Beyond Ed Donner's Production Repo

**Why it's a gap**: Ed's `production` repo is AWS-LLM-centric; the curriculum's own **S29 (MLOps)** section needs broader free coverage of experiment tracking (MLflow), CI/CD for ML, model registries, monitoring, and serving patterns.

**Recommended free resources**:

| # | Resource | Author/Platform | URL | Description |
|---|----------|-----------------|-----|-------------|
| 1 | **Made With ML — MLOps Course** | Goku Mohandas (formerly at Airbnb/Apple) | https://madewithml.com/ · GitHub: https://github.com/GokuMohandas/mlops-course | Free open-source course (~17k★) covering the full ML lifecycle: experimentation, versioning, CI/CD, serving (Ray Serve), monitoring — runs end-to-end on Anyscale/GCP with notebooks. |
| 2 | **MLOps Zoomcamp** (9-week free course) | DataTalks.Club | https://github.com/DataTalksClub/mlops-zoomcamp | Free 9-week project-based course covering MLflow, Prefect, Docker, Kubernetes, Flask/BentoML, Evidently (monitoring), and CI/CD — directly complements Ed Donner's production repo with an open, vendor-neutral stack. |
| 3 | **Practitioners Guide to MLOps** (white paper, ~70 pp.) | Google Cloud | https://cloud.google.com/resources/mlops-whitepaper · direct PDF: https://services.google.com/fh/files/misc/practitioners_guide_to_mlops_whitepaper.pdf | Free practitioner-grade white paper defining MLOps maturity levels, CI/CD/CT pipelines, and production architecture patterns — excellent conceptual anchor to ground hands-on courses. |
| 4 | **Awesome MLOps** (curated index) | Kelvin Soares / community | https://github.com/kelvins/awesome-mlops | Free, actively maintained catalog of MLOps tools (AutoML, CI/CD, feature stores, model registries, monitoring, data catalogs) — invaluable as a reference map for the entire ecosystem. |

**Best fit for curriculum section**: **S29 (MLOps)** directly; also reinforces **S43 (LLMOps)** and **S45 (IaC)** in Phase 3.

---

## Gap 5: NLP Fundamentals (Pre-LLM): TF-IDF, word2vec, Topic Modeling

**Why it's a gap**: The curriculum jumps from sklearn text-vectorization (S10) directly to RAG (S20) and LLM agents (S28), bypassing classical NLP (tokenization, n-grams, TF-IDF, word2vec, LDA topic modeling) — students will struggle to evaluate LLM outputs without this foundation.

**Recommended free resources**:

| # | Resource | Author/Platform | URL | Description |
|---|----------|-----------------|-----|-------------|
| 1 | **Speech and Language Processing** (3rd ed. draft) | Daniel Jurafsky & James H. Martin (Stanford / CU Boulder) | https://web.stanford.edu/~jurafsky/slp3/ · direct PDF: https://web.stanford.edu/~jurafsky/slp3/ed3book_jan26.pdf | Free pre-print of the field's canonical NLP textbook — covers N-grams, Naive Bayes, logistic regression for text, word2vec/embeddings, sequence labeling, parsing, and (new 3rd ed.) LLMs. |
| 2 | **Natural Language Processing with Python** (the "NLTK Book") | Steven Bird, Ewan Klein & Edward Loper | https://www.nltk.org/book/ | Free HTML book teaching NLP hands-on with Python and NLTK — tokenization, chunking, TF-IDF, text classification, and corpora — the most beginner-friendly Python-first NLP text. |
| 3 | **Gensim Tutorials — Word2Vec & LDA Topic Modeling** | Radim Řehůřek / Gensim | https://radimrehurek.com/gensim/auto_examples/tutorials/run_word2vec.html · https://radimrehurek.com/gensim/auto_examples/core/run_core_concepts.html | Free official docs/tutorials from the author of gensim — the de-facto open-source library for word2vec, doc2vec, and LSA/LDA topic modeling — including code you can run as Colab notebooks. |

**Best fit for curriculum section**: A primer ahead of **S20 (RAG)** and **S22 (Entity Resolution with RapidFuzz)**; also strengthens **S28 (LLM Agents)** by giving students the pre-LLM vocabulary (tokens, embeddings, similarity) that LLMs build on.

---

## Gap 6: Data Engineering / ETL / Spark / Airflow

**Why it's a gap**: **S18 (Data Engineering Foundations)** exists but the inventory lists no canonical free resource for Spark, Airflow, or end-to-end ETL pipelines — students have nowhere to turn for the modern data-engineering stack.

**Recommended free resources**:

| # | Resource | Author/Platform | URL | Description |
|---|----------|-----------------|-----|-------------|
| 1 | **Data Engineering Zoomcamp** (9-week free course) | DataTalks.Club | https://github.com/DataTalksClub/data-engineering-zoomcamp | Free 9-week project-based course building an end-to-end pipeline with Docker, Postgres, Prefect/Airflow, GCP, dbt, Spark, and Kafka — exactly the stack a 2026 junior data engineer needs; certificate available. |
| 2 | **Databricks Free Edition** (self-paced Spark training, replaces Community Edition) | Databricks Academy | https://www.databricks.com/learn/free-edition · Spark getting-started: https://www.databricks.com/spark/getting-started-with-apache-spark | Free Databricks Academy self-paced training including "Introduction to Apache Spark" and "Spark Programming with Databricks" — runs on a free Databricks workspace, no credit card required. |
| 3 | **Apache Airflow — Official Tutorial: "Building Your First Workflow"** | Apache Software Foundation | https://airflow.apache.org/docs/apache-airflow/stable/tutorial/fundamentals.html · tutorial index: https://airflow.apache.org/docs/apache-airflow/stable/tutorial/index.html | Free official docs that walk from DAG fundamentals through TaskFlow API, XComs, scheduling, and operators — the most authoritative free Airflow reference, doubling as a beginner tutorial. |

**Best fit for curriculum section**: **S18 (Data Engineering Foundations)** directly; also reinforces **S31 (Streaming Data)** (Kafka portion) and **S37 (dbt + BigQuery)** (dbt portion of the Zoomcamp).

---

## Gap 7: Causal Inference & Feature-Store / Governance Topics

**Why it's a gap**: **S48 (AI Governance & Ethics)** and **S49 (Data Contracts & Quality)** exist in Phase 3, but the curriculum has no content on causal inference (DO-calculus, IVs, DiD, synthetic control) or feature stores — both are increasingly expected of senior DS practitioners.

**Recommended free resources**:

| # | Resource | Author/Platform | URL | Description |
|---|----------|-----------------|-----|-------------|
| 1 | **Causal Inference: The Mixtape** | Scott Cunningham (Baylor University) | https://mixtape.scunning.com/ · free PDF mirror: https://jwmason.org/wp-content/uploads/2021/08/Cunningham-Cuasal-Inference-the-Mixtape.pdf | Free full online book (Yale University Press) teaching potential outcomes, DAGs, IVs, regression discontinuity, DiD, and synthetic control — with Stata/R code; widely considered the most accessible free causal-inference text. |
| 2 | **Causal Inference: What If** | Miguel A. Hernán & James M. Robins (Harvard T.H. Chan) | https://miguelhernan.org/whatifbook/ | Free downloadable book + code/data from Harvard — the rigorous epidemiology-origin treatment of causal diagrams, IP weighting, g-methods, and confounding; pairs with Mixtape (intuition) for depth. |
| 3 | **Feast — Open-Source Feature Store** (quickstart + workshop + docs) | Feast-dev / Linux Foundation | https://github.com/feast-dev/feast · quickstart: https://github.com/feast-dev/feast/blob/master/docs/getting-started/quickstart.md · workshop: https://github.com/feast-dev/feast-workshop | Free open-source feature store (~6k★) with comprehensive quickstart, workshop, and docs covering feature definitions, offline/online serving, and integration with popular ML stacks — the canonical free feature-store reference. |

**Best fit for curriculum section**: Causal inference → **S33 (Advanced ML Models)** and **S48 (AI Governance & Ethics)**; Feature store → **S29 (MLOps)** and **S49 (Data Contracts & Quality)**.

---

## Gap 8: Cloud Data Warehousing (BigQuery, Snowflake, dbt)

**Why it's a gap**: **S37 (dbt + BigQuery)** is the only dedicated warehouse section; students need free hands-on entry points to BigQuery (without billing), Snowflake (without paying), and dbt (official training) to actually practice.

**Recommended free resources**:

| # | Resource | Author/Platform | URL | Description |
|---|----------|-----------------|-----|-------------|
| 1 | **BigQuery Sandbox** (no credit card, 10 GB storage + 1 TB query/month) | Google Cloud | https://docs.cloud.google.com/bigquery/docs/sandbox · public datasets: https://docs.cloud.google.com/bigquery/public-data | Free tier of BigQuery with full SQL access to public datasets (USA names, GitHub archive, GDELT, etc.) — perfect for hands-on cloud-warehouse practice without a billing account. |
| 2 | **dbt Fundamentals** (free official course) | dbt Labs / dbt Learn | https://learn.getdbt.com/courses/dbt-fundamentals · catalog: https://learn.getdbt.com/catalog | Free self-paced course from the creators of dbt covering models, sources, tests, documentation, and deployment — issues a free certificate on completion; the canonical dbt starting point. |
| 3 | **Snowflake Tutorials + Free Trial** | Snowflake Documentation | Tutorials: https://docs.snowflake.com/en/tutorials · getting-started: https://www.snowflake.com/en/developers/guides/getting-started-with-snowflake · trial signup: https://www.snowflake.com/snowflake-trial/ | Free 600+ tutorial library + 30-day free trial with $400 in compute credits — covers loading data, virtual warehouses, stages, views, and zero-copy cloning; the trial allows full production-feature exploration. |

**Best fit for curriculum section**: **S37 (dbt + BigQuery)** directly; the BigQuery Sandbox is the labs environment, dbt Fundamentals is the structured lesson plan, and Snowflake content extends to comparative cloud-warehouse knowledge.

---

## Summary Table — 8 Gaps × Best Free Resource Per Gap

| Gap | Topic | Single Best Free Resource | Section(s) |
|-----|-------|---------------------------|-----------|
| 1 | Stats & Probability | **OpenIntro Statistics** + **Think Stats (Downey)** | S8, S10 |
| 2 | Bayesian / A/B Testing | **Bayesian Methods for Hackers (Davidson-Pilon)** | S10, S33 |
| 3 | Time-series Forecasting | **Penn State STAT 510** + **Prophet docs** + **NeuralForecast** | S10, S33 |
| 4 | MLOps | **MLOps Zoomcamp (DataTalksClub)** + **Made With ML** | S29, S43 |
| 5 | NLP Fundamentals | **Speech & Language Processing (Jurafsky/Martin)** + **NLTK Book** | S20, S22, S28 |
| 6 | Data Engineering / Spark / Airflow | **Data Engineering Zoomcamp** + **Databricks Free Edition** | S18, S31 |
| 7 | Causal Inference / Feature Store / Governance | **Causal Inference: The Mixtape** + **Feast** | S29, S33, S48, S49 |
| 8 | Cloud Data Warehousing | **BigQuery Sandbox** + **dbt Fundamentals** + **Snowflake Trial** | S37 |

---

## Honest Notes on What Was *Not* Found Free

1. **Ron Kohavi et al., *Trustworthy Online Controlled Experiments*** (the A/B-testing bible) — the book itself is paid (Cambridge UP, ~$50). Only Chapter 1 is legally free at experimentguide.com. The free substitute is the **"A/B Test Like a Pro" YouTube course** (Gap 2, resource #3) which covers comparable material.
2. **Russ Pohl's Probabilistic Programming & Bayesian Methods for Hackers** is sometimes cited — that is a confusion; the correct free resource is **Cam Davidson-Pilon's** book of the same name (Gap 2, resource #1).
3. **Snowflake "always-free" tier**: unlike BigQuery Sandbox, Snowflake does **not** offer a perpetually free tier — only a 30-day trial with credits. This is the one Gap 8 resource that is "free trial" rather than "free forever." State this explicitly to students.
4. **Time-series with LSTMs as a course**: no fully-free high-quality standalone course exists. The closest free path is **NeuralForecast (Nixtla)** docs + GitHub examples + **Kaggle Time Series micro-course** — used together they replace a paid course.

---

## Recommended Next Actions

1. **Embed in the inventory file**: Add a new "§7. Gap-Area Resources" section to `PYTHON_DS_RESOURCES_INVENTORY.md` referencing this document.
2. **Curriculum integration**: For each gap, append a "Suggested supplementary free resource" line to the corresponding section's `.ts` file (e.g., `s29-mlops.ts` → link Made With ML + MLOps Zoomcamp).
3. **Optional new section**: Consider a **"S0 — Statistics Primer"** combining OpenIntro + Think Stats + StatQuest as a required pre-read before S6 (NumPy).
4. **Quality control**: Re-verify URLs every 6 months — university OCW pages (Penn State STAT 510, Stanford SLP3 draft) move occasionally.
