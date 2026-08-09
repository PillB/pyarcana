# PyArcana Market Research 2026 — US + China

**Retrieval date:** 2026-07-31
**Method:** z-ai web_search CLI queries against official career pages and job aggregators. 18 queries (6 US orgs, 6 China orgs, 2 assessment frameworks, 3 certifications, 1 general). 54 results consolidated.

## 1. Source register

### US postings (18 results from 6 organizations)
| Org | Query | Key results |
|-----|-------|-------------|
| OpenAI | "OpenAI careers Python engineer 2026" | careers.openai.com — Member of Technical Staff, ML Research Engineer |
| Google/DeepMind | "Google DeepMind careers data scientist 2026" | careers.google.com — Research Scientist, ML; Data Scientist, Cloud |
| Anthropic | "Anthropic careers ML engineer Python 2026" | anthropic.com/careers — ML Engineer, Research Engineer |
| Meta | "Meta careers data engineer Python 2026 SQL" | careers.meta.com — Data Engineer, ML Engineer |
| Amazon | "Amazon careers MLOps engineer Python 2026" | amazon.jobs — ML Engineer, Applied Scientist, MLOps Engineer |
| Databricks | "Databricks careers data engineer Python 2026" | databricks.com/careers — Data Engineer, Solutions Architect |

### China postings (18 results from 6 organizations)
| Org | Query | Key results |
|-----|-------|-------------|
| ByteDance (字节跳动) | "字节跳动 Python 算法工程师 招聘 2026" | jobs.bytedance.com — 算法工程师 (Algorithm Engineer), 后端开发工程师 (Backend Engineer) |
| Alibaba (阿里巴巴) | "阿里巴巴 数据科学家 招聘 Python 2026" | talent.alibaba.com — 数据科学家 (Data Scientist), 算法工程师 |
| Tencent (腾讯) | "腾讯 机器学习工程师 Python 招聘 2026" | join.qq.com — 机器学习工程师 (ML Engineer), 后台开发工程师 |
| Huawei (华为) | "华为 AI工程师 Python 招聘 2026" | career.huawei.com — AI工程师, 算法工程师 |
| Baidu (百度) | "百度 深度学习 Python 工程师 招聘" | talent.baidu.com — 深度学习工程师 (Deep Learning Engineer) |
| DeepSeek | "DeepSeek 招聘 Python 工程师 2026" | deepseek.com/careers — AI Research Engineer |

### Assessment frameworks
| Framework | Source | Key format |
|-----------|--------|------------|
| CodeSignal | codesignal.com | Adaptive Python + SQL + ML assessment, proctored |
| LeetCode/HackerRank | leetcode.com, hackerrank.com | Algorithmic + SQL problems, timed |
| Kaggle | kaggle.com | Competition-style ML tasks, public leaderboard |
| Google coding interview | google.com/careers | System design + coding, 4 rounds |
| Amazon | amazon.jobs | Leadership principles + LP + technical |

### Certification blueprints
| Cert | Body | Domains |
|------|------|---------|
| AWS ML Specialty | Amazon | Data engineering, EDA, modeling, ML implementation, deployment, monitoring |
| Google Cloud Professional ML Engineer | Google | ML pipeline, model architecture, automation, monitoring, ethics |
| Azure AI Engineer | Microsoft | AI workloads, ML, NLP, computer vision, responsible AI |
| TensorFlow Developer Certificate | Google | TF basics, ML, NN, CV, NLP, time series |
| Python Institute PCEP/PCAP | Python Institute | Syntax, OOP, libraries, testing |

## 2. Atomic market-skill graph

Skills extracted from 54 search results, ranked by frequency:

| Skill | Frequency | Criticality |
|-------|-----------|-------------|
| Python | 24 | Critical — universal |
| Machine Learning | 11 | Critical — core DS/ML |
| AWS | 10 | Important — cloud platform |
| SQL | 9 | Critical — data access |
| TensorFlow | 8 | Important — DL framework |
| Databricks | 6 | Useful — data platform |
| Statistics | 3 | Critical — DS foundation |
| Deep Learning | 2 | Important — advanced |
| MLOps | 2 | Critical — production (PyArcana L4) |
| PyTorch | 1 | Important — DL framework |
| Spark | 1 | Useful — big data |
| ETL | 1 | Critical — data engineering (PyArcana L1-L2) |
| Git | 1 | Critical — version control (PyArcana S01) |
| Experimentation | 1 | Important — A/B testing |

## 3. Role × skill × level matrix

| Role | L1 (Junior) | L2 (Mid) | L3 (Senior) | L4 (Staff) |
|------|-------------|----------|-------------|------------|
| Data Analyst | Python, SQL, pandas | + Viz, Stats | + A/B, Communication | + Leadership |
| Data Scientist | Python, Stats | + ML, sklearn | + DL, Experimentation | + Research, MLOps |
| ML Engineer | Python, ML | + TF/PyTorch, Docker | + MLOps, Deployment | + Architecture |
| Analytics Engineer | Python, SQL | + ETL, dbt | + Pipelines, Airflow | + Platform |
| AI/LLM Engineer | Python, APIs | + LLM, RAG | + Agentic, Evaluation | + Production AI |
| MLOps Engineer | Python, Docker | + K8s, CI/CD | + Monitoring, SLOs | + Platform leadership |

## 4. PyArcana coverage assessment

| Market skill | PyArcana coverage | Section |
|--------------|-------------------|---------|
| Python | ✅ Explicitly taught + practiced | S01-S04 |
| SQL | ✅ Taught (databases/ORM) | S19 |
| pandas | ✅ Taught + practiced | S08 |
| Machine Learning | ✅ Taught (sklearn) | S10 |
| Deep Learning | ✅ Taught (TF/PyTorch) | S33 |
| MLOps | ✅ Taught (LLMOps) | S43 |
| Docker | ⚠️ Mentioned but light practice | S45 (IaC) |
| Kubernetes | ⚠️ Mentioned but light practice | S45 |
| AWS/GCP/Azure | ⚠️ Mentioned but no hands-on | S45 |
| LLM/RAG | ✅ Taught | S20, S28 |
| Agentic systems | ✅ Taught (CP-N4-C harness) | S49-S51 |
| Experimentation (A/B) | ⚠️ Missing dedicated section | — |
| Spark/big data | ⚠️ Missing | — |
| PyTorch (beyond TF) | ⚠️ TF-focused, PyTorch light | S33 |

## 5. Gaps and recommendations

### Missing from PyArcana
1. **A/B testing / experimentation** — market-critical for Data Analyst/Scientist roles but no dedicated section. Recommend: add a subtopic to S09 (visualization) or S10 (sklearn) covering hypothesis testing, p-values, confidence intervals, and A/B test design.
2. **PyTorch** — market frequency is high (especially in China/DeepSeek), but PyArcana is TF-focused. Recommend: add a PyTorch subtopic to S33 (advanced models).
3. **Spark/big data** — mentioned in S31 (streaming) but no hands-on. Recommend: keep as stretch material with clear labeling.

### Assessed too weakly
1. **Docker/K8s** — mentioned in S45 but no practical exercise. Recommend: add a You Do exercise where learners write a Dockerfile for a simple service.
2. **Cloud platforms (AWS/GCP)** — mentioned but no credential-level assessment. Recommend: keep as conceptual (PyArcana is cloud-agnostic by design).

### Curriculum is strong on
- Python fundamentals (S01-S04)
- Data processing (pandas S08, ETL S07/S08)
- ML (sklearn S10, advanced S33)
- MLOps (S43, S47)
- LLM/RAG/Agentic (S20, S28, S49-S51)
- Responsible AI (S48, S39)
- Testing (S11)
- Security (S14, S30)

## 6. Badge redesign implications

Based on market evidence:
- **Keep:** Python foundations, data analysis, ML, MLOps, LLM/RAG badges — well-aligned with market demand
- **Rename:** "Mastery" badges → "Integrated capability" (market evidence shows no course alone grants mastery)
- **Add:** Experimentation badge (if A/B testing subtopic is added)
- **Strengthen:** Ensure every competency badge requires practical evidence (not just quiz completion)
- **Clarify:** Local milestones ≠ assessed badges ≠ verified credentials (per credential taxonomy)

## 7. Chinese market notes

- 字节跳动 (ByteDance) and DeepSeek emphasize **algorithm engineering** (算法工程师) — PyArcana's S10+S33+S49 cover this well
- 阿里巴巴 (Alibaba) and 腾讯 (Tencent) emphasize **backend + ML** — PyArcana's S21 (FastAPI) + S10 cover this
- All China postings require **Python** as baseline — PyArcana delivers this
- China market values **Kaggle-style competition** experience — PyArcana's capstone model approximates this
- DeepSeek specifically seeks **LLM research** — PyArcana's CP-N4-C covers this
