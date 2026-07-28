# Phase 1 — Source Inventory (industry_signal_researcher: RPA + AI/ML + Production Python)

**Sub-agent:** `industry_signal_researcher`
**Date:** 2026-07-28
**Search tool:** `z-ai function -n web_search` (ZAI web_search via z-ai-web-dev-sdk)
**Raw search dumps:** `phase1_research/raw_searches_rpa_aiml_py/*.json` (42 files, 8 results each)

This file lists every source URL cited in the RPA / AI/ML / Production Python sections of
`industry_reality_brief.md`, `role_skill_taxonomy.json`, and the appended
`evidence_registry.jsonl` entries. URLs are grouped by role + theme.

Source-priority tier (per task brief):
1. Employer-hosted job postings
2. Official occupational / competency frameworks
3. Official role-based certification outlines
4. Engineering career ladders
5. Hiring manager statements
6. Interview failure evidence
7. Public CVs / portfolios
8. High-quality secondary synthesis

---

## A. RPA / Automation Developer sources

### A.1 Official RPA certification / framework outlines (Tier 3)
- UiPath — AI and Process Automation certifications — https://www.uipath.com/learning/certification
  - Tier evidence: UiPath Certified Professional — Automation Developer Associate / Professional / Architect tracks. Architect validates "advanced expertise in automation architecture, enterprise technology stacks, and end-to-end business process automation"; Developer tracks assess "problem solving, process identification, and building simple automation solutions."
- UiPath Academy — Certifications catalogue — https://academy.uipath.com/certifications
- UiPath Academy — Automation Developer Professional Training (v2024.10) — https://academy.uipath.com/learning-plans/automation-developer-professional-training
  - Explicit topics: "advanced UI automation and data manipulation, Orchestrator triggers, AI Computer Vision, remote debugging, coded automation, Autopilot, and UiPath Assistant."
- Pearson VUE — UiPath Certified Professional exam scheduling — https://www.pearsonvue.com/us/en/uipath.html
- Automation Anywhere — University / Training & Certification — https://pathfinder.automationanywhere.com/university
- Microsoft (via adaface blog, 2024-07-23) — Power Platform Developer skills (PowerApps, Power Automate, Power BI) — https://www.adaface.com/blog/skills-required-for-power-platform-developer

### A.2 Job postings / hiring (Tier 1, 5, 7)
- LinkedIn — RPA UiPath Developer jobs (356 US; 1000+ worldwide) — https://www.linkedin.com/jobs/rpa-uipath-developer-jobs ; https://www.linkedin.com/jobs/rpa-uipath-developer-job-jobs
- LinkedIn — Interffel: RPA Developer in Latin America (Spanish JD, Power Platform) — https://www.linkedin.com/jobs/view/rpa-developer-at-interffel-4294450017
- LinkedIn — First Soft Solutions LLC: Senior RPA Developer (UiPath), "design, develop, and deploy enterprise-grade automation solutions" — https://www.linkedin.com/jobs/view/rpa-developer-uipath-at-first-soft-solutions-llc-4445341386 (posted 2026-07-25)
- Indeed — RPA UiPath jobs, Remote, ~$70/hr — https://www.indeed.com/q-rpa-uipath-l-remote-jobs.html
- Glassdoor — RPA Developer interview questions (competency-based) — https://www.glassdoor.com/Interview/robotic-process-automation-rpa-developer-interview-questions-SRCH_KO0,40.htm
- Indeed — RPA Architect job listings — https://www.indeed.com/q-rpa-architect-jobs.html
- ZipRecruiter — RPA Architect ($91k–$180k) — https://www.ziprecruiter.com/Jobs/Rpa-Architect
- Mind Over Machines — Senior RPA Developer JD — https://www.mindovermachines.com/senior-rpa-developer
- Selligence Solutions — Senior RPA Developer JD — https://selligencesolutions.com/jobs/job-description-senior-rpa-developer
- NorthRock Consulting — Microsoft Power Platform Developer (3–5+ yrs IT, 2+ yrs Power Platform) — https://www.northrockconsulting.com/careers/microsoft-power-platform-developer (posted 2025-09-09)
- Auxilion — Power Platform Developer role/responsibilities — https://www.auxilion.com/insights/power-platform-developer-role-responsibilities (2025-04-25)
- XPAND IT — Power Platform Developer job description — https://xpand-it.com/en/find-opportunities/business-process-transformation/power-platform-developer
- Torbay Council — Power Platform Developer JD (analytical/innovative, keep up to date) — https://www.torbay.gov.uk/jobs/job-descriptions/power-platform-developer

### A.3 Career ladders / role blueprints (Tier 4)
- Coursera — What is an RPA Developer? — https://www.coursera.org/articles/rpa-developer (2025-05-23)
- Edureka — RPA Developer Roles and Responsibilities (Automation Architect) — https://www.edureka.co/blog/rpa-developer-roles-and-responsibilities
- ZipRecruiter — RPA Architect role description — https://www.ziprecruiter.com/Jobs/Rpa-Architect

### A.4 Interview questions / failure evidence (Tier 6)
- InterviewCoder — 55 RPA Interview Questions — https://www.interviewcoder.co/blog/rpa-interview-questions (2025-10-26)
- IGMGuru — Top 20+ RPA Interview Questions 2026 — https://www.igmguru.com/blog/rpa-interview-questions (2026-03-24)
- UiPath Forum — Interview tips for UiPath RPA developer role (workflows, queues, SAP/API integrations, VB.NET/C# basics) — https://forum.uipath.com/t/interview-tips-for-uipath-rpa-developer-role/2868895 (2025-06-26)
- Simplilearn — Top 45 RPA Interview Questions 2026 — https://www.simplilearn.com/tutorials/rpa-tutorial/rpa-interview-questions
- InterviewBit — Top RPA Interview Questions 2025 — https://www.interviewbit.com/rpa-interview-questions (2024-12-23)
- HireKit — RPA Developer Interview Questions 2026 (STAR + technical) — https://www.hirekit.co/interview-prep/rpa-developer-interview-questions
- Reddit r/rpa — interview tips thread — https://www.reddit.com/r/rpa/comments/1jtwbmo/rpa_interview_tips_for_someone_completely_new

### A.5 Automation brittleness / failure modes (Tier 5 + 6)
- The Sunflower Lab — "Why Your UiPath Bot Broke After a UI Update" — "~60% of RPA failures trace back to UI changes, selector breaks, or unhandled exceptions" — https://thesunflowerlab.com/why-your-uipath-bot-broke-after-a-ui-update-and-how-to-build-resilient-rpa-that-doesnt
- UiPath Forum — Bot Performance ("Use stable selectors and anchors so small UI changes don't break your bot. Avoid attributes like indexes or long, changing selectors.") — https://forum.uipath.com/t/bot-performance/5671189 (2025-10-30)
- UiPath Forum — REFramework Unattended Bot Best Practices — https://forum.uipath.com/t/reframework-unattended-bot-best-practices/2857082 (2025-06-16)
- UiPath Forum — Document a bot in A360 (large undocumented bots) — https://community.automationanywhere.com/developers-forum-36/document-a-bot-in-a360-89397 (2025-02-18)
- Ashling — UiPath ReFramework guide (state machine + exception handling) — https://ashling.ai/resources/the-uipath-reframework-the-what-how-and-why-of-leveraging-this-framework-for-your-automations (2019-10-30)

### A.6 Portfolio / evidence of skill (Tier 7)
- UiPath Forum — RPA developer portfolio thread — https://forum.uipath.com/t/rpa-developer-portfolio/714452 (2024-01-23)
- GitHub — Rizo650/RPA-Portfolio (REFramework-based, modular, scalable) — https://github.com/Rizo650/RPA-Portfolio
- Coursera — Confident RPA UiPath Developer: Build 8 Projects — https://www.coursera.org/specializations/packt-confident-rpa-uipath-developer-build-8-projects
- Monster — RPA Developer resume templates (measurable impact) — https://www.monster.com/resume/templates/rpa-developer (2026-07-17)
- iRPA — Instructions for portfolio of evidence for RPA certification — https://www.irpa.net/members/180/%7B5F8397A1-8304-4721-9B1E-1A2CC2204221%7D/Instructions%20for%20the%20creation%20of%20the%20portfolio%20of%20evidence%20for%20RPA%20certification.doc (2007-03-28)
- Medium (GUVI) — Top 6 Project Ideas in RPA (web scraping, CRM, data migration, onboarding) — https://medium.com/@info_5130/top-6-project-ideas-in-rpa-2022-361451cf44d9

### A.7 Python-based RPA / browser automation (Tier 8)
- Medium — Browser automation with Python, Playwright, Selenium and Robocorp (RPA Challenge) — https://medium.com/@simonpfrank_49786/browser-automation-with-python-playwright-selenium-and-robocorp-the-rpa-challenge-d47540abc222
- dev.to — Browser Automation in Python: Playwright, Selenium & More — https://dev.to/rosgluk/browser-automation-in-python-playwright-selenium-more-3721

### A.8 Government / definition
- IBM — What is RPA? — https://www.ibm.com/think/topics/rpa
- Digital.gov — Understanding RPA (US federal COTS low-/no-code automation) — https://digital.gov/guides/rpa
- SAP — What is RPA? — https://www.sap.com/resources/what-is-rpa (2026-01-26)
- Wikipedia — Robotic process automation — https://en.wikipedia.org/wiki/Robotic_process_automation
- Automation Anywhere — What is RPA? — https://www.automationanywhere.com/rpa/robotic-process-automation
- UiPath — What is RPA? — https://www.uipath.com/rpa/robotic-process-automation

---

## B. AI / ML Engineer sources

### B.1 Job descriptions / hiring (Tier 1, 5)
- Indeed — ML Engineer Job Description (writing, documentation, speaking skills; C++/Matlab/Java) — https://www.indeed.com/hire/job-description/machine-learning-engineer
- LinkedIn (Business) — ML Engineer JD ("impeccable analytical and problem-solving skills; extensive math and computer skills; probability, statistics, algorithms") — https://business.linkedin.com/hire/resources/how-to-hire-guides/machine-learning-engineer-job-description
- 365 Data Science — ML Engineer Job Outlook 2026 ("strong software engineering and ML system design expertise; proficiency in ML model deployment and optimization") — https://365datascience.com/career-advice/career-guides/machine-learning-engineer-job-outlook-2025
- University of San Diego (online) — 2026 ML Industry & Career Guide — https://onlinedegrees.sandiego.edu/machine-learning-engineer-career
- ORSYS — ML Engineer skills (Aug 2025) — https://www.orsrs.fr/orsys-lemag/en/job-description-machine-learning-engineer-what-skills-do-you-need
- KDR Talent Solutions — ML Engineer JD (Python, R, Java; ML concepts/algorithms) — https://www.kdrtalentsolutions.com/machine-learning-job-description
- Coursera — What is a Machine Learning Engineer? — https://www.coursera.org/articles/what-is-machine-learning-engineer (2026-07-20)
- Bain & Company — Staff Engineer, Machine Learning (LLM & Production Systems) — https://www.bain.com/careers/find-a-role/position/?jobid=107242
- Fitch Group — Lead ML Engineer — AI Innovation Teams (Toronto) — https://careers.fitch.group/job/Toronto-Lead-Machine-Learning-Engineer-AI-Innovation-Teams-ON/1283156201

### B.2 MLOps / LLMOps frameworks (Tier 3, 8)
- ml-ops.org — MLOps reference — https://ml-ops.org
- AWS — What is MLOps? — https://aws.amazon.com/what-is/mlops
- Google Cloud — MLOps: Continuous delivery and automation pipelines in ML — https://docs.cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning (2024-08-28)
- Databricks — What is MLOps? — https://www.databricks.com/blog/what-is-mlops
- IBM — MLOps — https://www.ibm.com/think/topics/mlops
- Microsoft Learn — Introduction to MLOps — https://learn.microsoft.com/en-us/training/paths/introduction-machine-learn-operations
- GeeksforGeeks — What is MLOps? — https://www.geeksforgeeks.org/machine-learning/what-is-mlops (2026-03-14)
- Google Cloud — What is LLMOps? — https://cloud.google.com/discover/what-is-llmops
- Humaineeti — LLMOps in Production: Monitoring & Guardrails (2026) — https://www.humaineeti.ai/resources/llmops-production-guide
- qubittool — Enterprise LLMOps Architecture Guide [2026] — https://qubittool.com/blog/enterprise-llmops-architecture-guide
- mlopslab — 2026 LLMOps Crash Course (6 core components: prompt management, RAG evaluation, LLM observability, guardrails, cost tracking, feedback loops) — https://mlopslab.org/llmops-tutorial-a-beginners-guide-to-llm-operations-lifecycle-workflow
- LLMOps.si — The practical guide to running LLMs in production (8 layers) — https://llmops.si
- School of Core AI — LLMOps Roadmap for Production AI Systems — https://schoolofcoreai.com/roadmaps/llmops-roadmap
- GitHub — JackSteve-code/Scalable-llmop (production-grade LLMOps blueprint) — https://github.com/JackSteve-code/Scalable-llmop

### B.3 Interview failures / candidate weaknesses (Tier 5, 6)
- Plain English (Python) — "I Failed 23 ML Engineer Interviews Before Learning These Concepts" (production, pipelines, deployment, monitoring) — https://python.plainenglish.io/i-failed-23-ml-engineer-interviews-before-learning-these-concepts-5d1e3e1dde44
- Medium (Janie Brooke) — "I Failed 40 ML Engineer Interview Rounds" (coding-round mistake: grinding competitive programming instead of practical) — https://janiebrooke.medium.com/i-failed-40-ml-engineer-interview-rounds-before-i-landed-my-first-offer-f10f5fd93633
- Reddit r/learnmachinelearning — "Failed 10 interviews in the last 15 months" (early-round failure = coding weakness) — https://www.reddit.com/r/learnmachinelearning/comments/1urri36/failed_10_interviews_in_the_last_15_months
- Kaggle — "I Failed My Machine Learning Engineer Interview!" — https://www.kaggle.com/general/557274
- Kore1 — AI/ML Engineer Interview Questions 2026 (ML system design, applied math, MLOps fluency) — https://www.kore1.com/ml-engineer-interview-questions (2026-04-21)
- Quora — What is the most common ML interview question candidates fail — https://www.quora.com/What-is-the-most-common-questions-for-machine-learning-position-that-candidate-failed-on

### B.4 Uncertainty / abstention (Tier 8 + 5)
- PMC (NIH) — Communicating uncertainty in medical machine learning (cited 646 times) — https://pmc.ncbi.nlm.nih.gov/articles/PMC7785732 (2021)
- AAAI — Things ML Models Know That They Don't (confidence intervals, density estimates; 2025, cited 16) — https://ojs.aaai.org/index.php/AAAI/article/view/35094/37249
- Mindful Modeler — When in Doubt, Abstain: Why ML Models Need — https://mindfulmodeler.substack.com/p/when-in-doubt-abstain-why-machine
- ICML 2025 — Cryptographically Prohibiting the Abuse of Model Abstention (cautious predictions for safety-critical applications) — https://icml.cc/virtual/2025/poster/45527
- ScienceDirect — A vision for uncertainty-aware ML in healthcare (2025, cited 25) — https://www.sciencedirect.com/science/article/abs/pii/S138650562500231X
- NITMB — Understanding Sources of Uncertainty in ML (epistemic vs aleatoric) — https://www.nitmb.org/understanding-sources-of-uncertaint/understanding-sources-of-uncertainty-in-machine-learning
- Reddit r/MachineLearning — Why isn't uncertainty estimation implemented in more — https://www.reddit.com/r/MachineLearning/comments/1qpbrgp/d_why_isnt_uncertainty_estimation_implemented_in

### B.5 Model drift / monitoring (Tier 8)
- MLflow — Why Monitor Model Drift in Production (2026-07-21) — https://mlflow.org/articles/why-monitor-model-drift-production
- Evidently AI — Concept drift in ML — https://www.evidentlyai.com/ml-in-production/concept-drift
- Datadog — ML model monitoring best practices — https://www.datadoghq.com/blog/ml-model-monitoring-in-production-best-practices
- Microsoft FastTrack — Identifying drift in ML models: best practices — https://techcommunity.microsoft.com/blog/fasttrackforazureblog/identifying-drift-in-ml-models-best-practices-for-generating-consistent-reliable/4040531
- Aerospike — Mitigating model drift in ML — https://aerospike.com/blog/model-drift-machine-learning
- Fulcrum Digital — AI Model Drift in Production (MLflow, SageMaker, Evidently AI, Arize AI) — https://fulcrumdigital.com/blogs/ai-model-drift-in-production-what-enterprises-must-monitor
- ResearchGate — Model Monitoring, Data Drift Detection, and Efficient Model Retraining (review paper) — https://www.researchgate.net/publication/395703466_Model_Monitoring_Data_Drift_Detection_and_Efficient_Model_Retraining_A_Review

### B.6 Stakeholder communication (Tier 5)
- Harvard Data Science Review (MIT Press) — When Translation Problems Arise Between Data Scientists and stakeholders (K. Malone, 2020, cited 8) — https://hdsr.mitpress.mit.edu/pub/bfeyfx22
- HDSR — Data Science and Decision Science Skills: Are They Different? — https://hdsr.mitpress.mit.edu/pub/9ir6e1j6
- TowardsDataScience — How to Translate ML Results Into Business Impact (KPIs, incremental revenue) — https://towardsdatascience.com/how-to-translate-machine-learning-results-into-business-impact-d0b323112e87
- Medium (Julita Rubis, 2025-07-28) — Understanding Business Stakeholders for ML Engineers — https://medium.com/@julietarubis/understanding-business-stakeholders-for-machine-learning-engineers-1eca041003e5
- ZipRecruiter — AI Data Translator role (interpret technical findings, business-friendly language) — https://www.ziprecruiter.com/e/ai-data-translator-how-does-an-ai-data-translator-typically-bridge-communication-between-technical-data-teams-and-business-stakeholders

### B.7 Career ladders (Tier 4)
- DevOpsSchool — Staff Machine Learning Engineer: Role Blueprint (responsibilities, skills, KPIs, career path) — https://www.devopsschool.com/blog/staff-machine-learning-engineer-role-blueprint-responsibilities-skills-kpis-and-career-path
- ML Engineer Salary — ML Engineer Career Progression 2026 (L3 → L7 ladder; L6 staff in 8–12 yrs typical) — https://mlengineersalary.com/career-progression

### B.8 Latin America / Spanish-language postings (Tier 1)
- LinkedIn MX — "+1000 empleos Machine Learning Engineer en México" — https://mx.linkedin.com/jobs/machine-learning-engineer-empleos
- Indeed MX — ML Engineer postings (Python, data processing, analytics) — https://mx.indeed.com/q-machine-learning-engineer-empleos.html
- Glassdoor MX — 322 ML vacantes ($50,000–$85,000 MXN range cited) — https://www.glassdoor.com.mx/Empleo/m%C3%A9xico-machine-learning-empleos-SRCH_IL.0,6_IN169_KO7,23.htm
- Michael Page MX — Ingeniero de Machine Learning (Lic/Ing en CS, Matemáticas…) — https://www.michaelpage.com.mx/job-detail/ingeniero-de-machine-learning/ref/jn-032026-6983253
- OCC Mundial — Ofertas ML 2026 — https://www.occ.com.mx/empleos/de-machine-learning
- GetOnBoard Chile — Trabajos ML Engineer — https://www.getonbrd.cl/jobs-Machine+Learning+Engineer
- GetOnBoard Colombia — ML jobs — https://www.getonbrd.com.co/jobs/tag/machine-learning
- RemoteRocketship — Remote ML Engineer Jobs in Latin America — https://www.remoterocketship.com/country/latin-america/jobs/machine-learning-engineer

### B.9 Certifications / competency frameworks (Tier 3)
- AWS — Certified AI Practitioner — https://aws.amazon.com/certification/certified-ai-practitioner
- AWS — Certified Generative AI Developer — Professional — https://aws.amazon.com/certification/certified-generative-ai-developer-professional
- Google Cloud — Professional ML Engineer Certification — https://cloud.google.com/learn/certification/machine-learning-engineer ("builds, evaluates, productionizes, and optimizes AI solutions using Google Cloud capabilities and knowledge of conventional ML approaches")
- LinkedIn Pulse — Guide to AI/ML Certifications from AWS (Azure AI Engineer Associate AI-102, $165, 120 min) — https://www.linkedin.com/pulse/guide-ai-machine-learning-certifications-from-aws-ahamed-ojwse
- Skillsoft — 5 Certifications to Validate ML Skills (Azure AI Engineer validates "build and implement AI solutions on the platform, doing so securely") — https://www.skillsoft.com/blog/top-machine-learning-certifications (2024-09-12)

### B.10 Data leakage (Tier 6, 8)
- GeeksforGeeks — Data Leakage (Target Leakage explained; future data, outcome-related features in training) — https://www.geeksforgeeks.org/machine-learning/data-leakage

### B.11 Portfolio / evidence (Tier 7)
- MeriNova Substack — How to build a ML portfolio (CV, NLP, RecSys, RL, GenAI) — https://merinova.substack.com/p/how-to-build-a-machine-learning-portfolio
- DataTalks.Club — ML Portfolio Projects (baseline, validation, evaluation, serving story; MLOps vs DataOps) — https://datatalks.club/podwiki/wiki/machine-learning-portfolio-projects
- Reddit r/MachineLearning — What's more impressive in a ML portfolio: implementing a paper vs taking models to production ("more impressed with someone who knows how to take ML models to production") — https://www.reddit.com/r/MachineLearning/comments/1bsezcf/d_whats_more_impressive_in_a_ml_portfolio
- DeepLearning.AI Community — Project portfolios (web development, deployment, CI/CD as useful engineer skills) — https://community.deeplearning.ai/t/project-portfolios/492298
- GitHub — tushar2704/ML-Portfolio — https://github.com/tushar2704/ML-Portfolio

### B.12 Bootcamp / hiring complaints (Tier 5)
- Reddit r/codingbootcamp — "Some thoughts as a former bootcamp graduate (2015) and current hiring manager" — https://www.reddit.com/r/codingbootcamp/comments/17vjcem/some_thoughts_as_a_former_bootcamp_graduate_2015
- LinkedIn — "Challenges Facing Data Bootcamp Graduates" — https://www.linkedin.com/top-content/career/navigating-data-careers/challenges-facing-data-bootcamp-graduates
- Business Insider — Top Tech Recruiters on Coding Boot Camp Grads (highlight real-world projects) — https://www.businessinsider.com/top-tech-recruiters-weigh-in-on-coding-bootcamp-grads-2021-10 (2021-10-20)
- iTeachRecruiters — "The Bootcamper Dilemma: Spotting Inflated Resumes in Tech" (flag candidates whose projects appear bootcamp-centric) — https://www.iteachrecruiters.com/blog/the-bootcamper-paradox-spotting-inflated-resumes-in-tech-recruiting
- LinkedIn (Wissam Metawee) — "Dear recruiters, please stop expecting to see personal projects running in production from every candidate" — https://www.linkedin.com/posts/wissam-metawee-02bb50251_dear-recruiters-please-stop-expecting-to-activity-7456837687581315072-IHLA

### B.13 O*NET (Tier 2)
- O*NET — 15-2051.00 Data Scientists (closest official occupation covering ML engineers; updated 2026 with Machine Learning/Expert and ML/Analyst skills) — https://www.onetonline.org/link/summary/15-2051.00
- O*NET Resource Center — Occupation Data Updates (15-2051.00; 2026 Machine Learning/Expert, 2025 Machine Learning/Analyst) — https://www.onetcenter.org/dataUpdates/occupations/15-2051.00
- O*NET — Data Science & AI Sub-Cluster — https://www.onetonline.org/find/career?c=060101
- O*NET — National Certifications for 15-2051.00 (Google ML Engineer listed) — https://www.onetonline.org/link/localcert/15-2051.00

### B.14 Analysis vs decision (Tier 5, 8)
- Dataversity — Data Science vs. Decision Science (2022-03-16) — https://www.dataversity.net/articles/data-science-vs-decision-science-a-new-era-dawns
- Data Science PM — Why Big Data Science & Analytics Projects Fail (87% of DS projects never make it to production; only 20% of analytic insights deliver business outcomes by 2022) — https://www.datascience-pm.com/project-failures
- MIT Sloan Review — Why So Many Data Science Projects Fail to Deliver (cited 63; 5 obstacles) — https://sloanreview.mit.edu/article/why-so-many-data-science-projects-fail-to-deliver (2021)

---

## C. Production Python / Software Engineer sources

### C.1 Job descriptions / hiring (Tier 1, 5)
- Understanding Recruitment — How to Write a Python Job Description in 2025 — https://www.understandingrecruitment.com/knowledge-hub/blog/how-to-write-a-python-job-description-in-2025
- JobDescription.org — Python Developer JD, salary, career outlook ("Type annotations and mypy/Pyright type checking are now baseline expectations in professional codebases") — https://jobdescription.org/jobs/software-engineering/python-developer
- InterviewGuy — Junior Python Developer JD (front-end basics, Git, databases) — https://interviewguy.com/junior-python-developer-job-description
- HackerRank — Technical Interview Questions 2026 ("Python is the most commonly tested language in data engineering, ML engineering, backend, and full-stack roles. Interviewers probe both syntax knowledge and idiomatic Python patterns.") — https://www.hackerrank.com/writing/technical-interview-questions
- InterviewQuery — Top Python Interview Questions for Data Engineers (2025) — https://www.interviewquery.com/p/data-engineer-python-questions
- Softjourn — How to Hire a Python Developer (Complete Guide) — https://softjourn.com/insights/hiring-python-developers
- OpenPython — Python Interview Questions and Answers (core, OOP, decorators, generators, type hints) — https://openpython.org/articles/python-job-questions

### C.2 Production / observability (Tier 8)
- StackOverflow Blog — How observability is redefining the roles of developers (2022-07-18) — https://stackoverflow.blog/2022/07/18/how-observability-is-redefining-the-roles-of-developers
- Medium (Fahad Ahammed) — 4 Important Dev Practices to Make Your Python App Production-Ready (Observability pillar) — https://fahadahammed.medium.com/4-important-development-practice-to-make-your-python-application-production-ready-f74bdb5bce11
- Splunk — Instrument your Python application (OpenTelemetry Python agent) — https://help.splunk.com/en/splunk-observability-cloud/manage-data/instrument-back-end-services/instrument-back-end-applications-to-send-spans-to-splunk-apm/instrument-a-python-application/instrument-your-python-application (2026-06-24)
- UltraTendency Academy — Operations-Driven Python (CLIs, APIs, observability, log management, automated testing) — https://ultratendency.academy/operations-driven-python (2026-02-17)
- IBM Developer — Observability-driven development with Instana — https://developer.ibm.com/articles/observability-driven-development
- Reddit r/ExperiencedDevs — Best way to introduce monitoring and observability — https://www.reddit.com/r/ExperiencedDevs/comments/1eooa00/best_way_to_introduce_monitoring_and_observability

### C.3 Git / code review / collaboration (Tier 5, 6)
- GitHub Discussions — Best Practices for Hiring Skilled Software Developers (review PRs: polite? catch bugs? constructive?) — https://github.com/orgs/community/discussions/183788
- LinkedIn (Smith Tripp) — GitHub signals for early-career SWE/FDE candidates — https://www.linkedin.com/posts/smithtripp_last-week-i-said-github-is-one-of-the-strongest-activity-7485056225806749697-DcPE
- Medium (Plain English) — 7 Python GitHub Projects That Opened Career Doors — https://python.plainenglish.io/7-python-github-projects-that-opened-career-doors-i-never-even-thought-to-knock-on-32fae410890a
- Reddit r/ExperiencedDevs — Code review interview thread — https://www.reddit.com/r/ExperiencedDevs/comments/uedzmu/code_review_interview
- dev.to (Erika Heidi) — Working with Git Branches and Pull Requests (2024-11-19) — https://dev.to/erikaheidi/working-with-git-branches-and-pull-requests-3943
- Medium (aeh.herman) — Collaborating in Git for New Junior Developers — https://medium.com/@aeh.herman/collaborating-in-git-for-new-junior-developers-cdb0b484f5aa
- Reddit r/ExperiencedDevs — Tech lead pushes commits to my branch (PR review culture issues) — https://www.reddit.com/r/ExperiencedDevs/comments/1j9tim6/tech_lead_pushes_commits_to_my_branch
- Gregory Szorc — Problems with Pull Requests and How to Fix Them (2020-01-07) — https://gregoryszorc.com/blog/2020/01/07/problems-with-pull-requests-and-how-to-fix-them
- GitKraken — Code Reviews for Git Workflows — https://www.gitkraken.com/features/code-review

### C.4 Production Python JD career path (Tier 4)
- Python Foundation — Career Pathways (Senior Software Engineer, Tech Lead, Staff Engineer, Platform Developer → Principal/Architect; system design, microservices, message queues, caching, observability, code review leadership, performance tuning) — https://pythonfoundation.org/careers
- Fonzi.ai — Engineering Career Ladder (Junior → Principal) — https://fonzi.ai/blog/engineering-career-levels

### C.5 DevOps / Docker / Kubernetes / CI-CD (Tier 3, 8)
- boot.dev — DevOps Engineer Path (Python, Go, Linux, Docker, AWS, CI/CD, observability, Kubernetes) — https://www.boot.dev/paths/devops?tech=python-golang
- roadmap.sh — Learn to become a DevOps Engineer or SRE — https://roadmap.sh/devops
- NareshIT — DevOps CI/CD Job Description 2025 (scripting: Bash, Python; CI/CD tools; cloud; containerization) — https://nareshit.com/blogs/what-is-a-devops-ci-cd-job-description-2025-complete-career-guide
- Reddit r/devops — Backend dev → DevOps: what skills to focus on — https://www.reddit.com/r/devops/comments/1s11kz4/backend_dev_devops_what_skills_to_focus_on_for

### C.6 FastAPI / async testing (Tier 3, 8)
- FastAPI docs — Async Tests (pytest + TestClient) — https://fastapi.tiangolo.com/advanced/async-tests
- FastAPI docs — Testing — https://fastapi.tiangolo.com/tutorial/testing
- TestDriven.io — Developing and Testing an Asynchronous API with FastAPI (Postgres, pytest, Docker, TDD) — https://testdriven.io/blog/fastapi-crud (2022-12-01)
- WeirdSheepLabs — Fast and furious: async testing with FastAPI and pytest (2024-11-22) — https://weirdsheeplabs.com/blog/fast-and-furious-async-testing-with-fastapi-and-pytest
- Orchestra — Tutorial on FastAPI Async Tests (2024-01-05) — https://www.getorchia.io/guides/tutorial-on-fastapi-async-tests

### C.7 Security / OWASP (Tier 3)
- OWASP Foundation — Careers / Job Postings — https://owasp.org/careers ; https://owasp.org/supporters/jobs
- (OWASP Top 10 for Python web apps referenced via FastAPI/testdriven.io ecosystem; standard knowledge expectation.)

### C.8 Portfolio / evidence (Tier 7)
- Codeling — Python Project Ideas: Build a Strong Backend Portfolio ("A good project does more than show that you can write Python. It shows that you can build software with constraints, make trade-offs, and finish.") — https://codeling.dev/blog/python-project-ideas
- Noble Desktop — Python Developer Portfolio Website Guide & Tips (manage online code repository, collaborate with others) — https://www.nobledesktop.com/careers/python-developer/portfolio-tips
- Turing — 10 Tips for Building a Strong Software Engineer Portfolio — https://www.turing.com/blog/software-engineer-portfolio-tips
- Medium (Plain English) — 10 Python Projects That Made My Portfolio Way Stronger — https://python.plainenglish.io/10-python-projects-that-made-my-portfolio-way-stronger-15b68e215d0d
- Reddit r/learnpython — What does a basic Python portfolio look like? — https://www.reddit.com/r/learnpython/comments/ae5znb/what_does_a_basic_python_portfolio_look_like

### C.9 Hiring manager complaints (Tier 5, 6)
- LinkedIn — "Why Python Hiring Mistakes Quietly Cost Companies Over $100K" (5 common patterns after 50 cases) — https://www.linkedin.com/pulse/why-python-hiring-mistakes-quietly-cost-companies-over-hzv8c
- Medium (Design Bootcamp) — "Hiring Managers Don't Want Your Resume" (GitHub-derived signals, not abstract GitHub rank) — https://medium.com/design-bootcamp/why-technical-hiring-starts-with-public-proof-not-polished-claims-13710d8022e2
- LinkedIn (Zubin Ajmera) — "Failed by coding tests: Why they don't predict job success" (candidates who score highest on coding platforms are often weakest performers six months in) — https://www.linkedin.com/posts/zubinajmera_we-hired-a-person-who-interviewed-soo-well-activity-7381664509003816961-c9nO
- Reddit r/codingbootcamp — Why you're not going to get a job after a bootcamp — https://www.reddit.com/r/codingbootcamp/comments/1366hl3/why_youre_not_going_to_get_a_job_after_a_bootcamp
- Reddit r/recruitinghell — Recruiters on coding boot camps — https://www.reddit.com/r/recruitinghell/comments/cckfmt/recruiters_whats_your_opinion_on_coding_boot
- iTeachRecruiters — Bootcamper Dilemma (flag candidates whose repos are bootcamp-centric) — https://www.iteachrecruiters.com/blog/the-bootcamper-paradox-spotting-inflated-resumes-in-tech-recruiting
- Hacker News — Time-limited coding challenges via Git (interview design critique) — https://news.ycombinator.com/item?id=16364805
- Cybertex — How Recruitment Scams Target Developers via GitHub (don't blindly run code from unknown sources in take-home tests) — https://cybertex.io/how-recruitment-scams-target-developers-through-github-test-tasks (2025-09-15)

### C.10 Latin America / Spanish-language postings (Tier 1)
- Indeed MX — Backend Developer Python (Latin America remote; "5+ years experience" cited for Azumo) — https://mx.indeed.com/q-backend-developer-python-empleos.html
- LinkedIn MX — 736 Desarrollador Python Jr empleos — https://mx.linkedin.com/jobs/desarrollador-python-jr-empleos
- Glassdoor MX — 120 Python backend developer (Mínimo 4 años; Cloud AWS/Azure; visa vigente) — https://www.glassdoor.com.mx/Empleo/python-backend-developer-empleos-SRCH_KO0,24.htm
- GetOnBoard Chile — Python jobs — https://www.getonbrd.cl/jobs/tag/python
- OCC Mundial — Ofertas Python 2026 (Ingeniero de datos/Python/SQL/Power BI, $28k–$30k MXN monthly cited) — https://www.occ.com.mx/empleos/de-python
- Vacantes Digitales — Vacantes backend LATAM — https://vacantesdigitales.com/vacantes/busquedas/backend-latam

### C.11 O*NET (Tier 2)
- O*NET — 15-1252.00 Software Developers — https://www.onetonline.org/link/summary/15-1252.00
- O*NET Resource Center — 15-1252.00 occupation data updates (2026 Software Skills, Employer Job Postings; 2025 Essential Skills) — https://www.onetcenter.org/dataUpdates/occupations/15-1252.00
- O*NET — 15-1252.00 Job Zone (4-year bachelor's typical) — https://www.onetonline.org/skills/zone/15-1252.00
- BLS — Software Developers, QA Analysts, and Testers — https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm

---

## D. Cross-cutting sources

### D.1 SFIA (Skills Framework for the Information Age) (Tier 2)
- SFIA Online — globally trusted skills/competency framework for digital, data — https://sfia-online.org
- SFIA Online — About SFIA — https://sfia-online.org/en/about-sfia/about-sfia ("defines the skills and competencies required by professionals who design, develop, implement, manage and protect the data and technology")
- APMG International — What is SFIA? (7-level framework) — https://apmg-international.com/article/what-sfia
- Lexonis — What is SFIA? (globally recognized model for managing digital skills) — https://www.lexonis.com/sfia

### D.2 ESCO (EU classification) (Tier 2)
- darioonsori.github.io — AI-related occupations and skills in ESCO (essential vs optional skills) — https://darioonsori.github.io/esco-ai-skills

### D.3 Analysis vs decision (Tier 5, 8)
- HDSR — Data Science and Decision Science Skills: Are They Different? (importance of integrating skill sets to bridge gap between technical analysis and actionable decisions) — https://hdsr.mitpress.mit.edu/pub/9ir6e1j6
- Dataversity — Data Science vs Decision Science — https://www.dataversity.net/articles/data-science-vs-decision-science-a-new-era-dawns
- MIT Sloan Review — Why So Many Data Science Projects Fail to Deliver — https://sloanreview.mit.edu/article/why-so-many-data-science-projects-fail-to-deliver (2021, cited 63)
- Data Science PM — Why Big Data Science & Analytics Projects Fail (87% never reach production; only 20% deliver business outcomes) — https://www.datascience-pm.com/project-failures
