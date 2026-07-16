# Python / Data Science Learning Resources — Comprehensive Inventory

> Research compiled for cross-referencing against a 52-section Python DS course curriculum to identify coverage gaps.
> All entries verified via live web search. Star counts are approximate (GitHub continuously restricts/updates counts).
> Generated: 2026.

---

## 1. Ed Donner's GitHub Repositories

**Profile:** Ed Donner — Co-Founder & CTO at an AI startup, Udemy instructor.
**GitHub:** https://github.com/ed-donner (39 public repositories; 25 in Python)
**Personal site / curriculum:** https://edwarddonner.com/curriculum
**Note:** Ed Donner does **not** author a course literally titled "Python for Data Analysis." His curriculum is an **AI/LLM/Agentic engineering** track. The closest match to "Python for Data Analysis" is his **`tech2ai`** repo (From Software Engineer → AI Data Scientist), which covers NumPy/SciPy/Pandas alongside GenAI/LLMs.

### 1a. Core Course Repositories (the 6-course curriculum + companions)

| # | Repo | Description | Topics / Structure | URL |
|---|------|-------------|--------------------|-----|
| 1 | **llm_engineering** | 8-week "Master AI and LLMs" core-track course (Udemy). | Frontier model APIs, OpenAI & Gemini, Ollama local inference, Colab GPU usage, prompts/structured outputs, RAG, embeddings, fine-tuning; culminates in an autonomous Agentic AI solution in Week 8. Folders per week (`week1`…`week8`) plus a `guides/` folder. | https://github.com/ed-donner/llm_engineering |
| 2 | **agents** | 6-week "Complete Agentic AI Engineering Course" (refreshed Summer 2026). | OpenAI Agents SDK, CrewAI, LangGraph, Google ADK, Pydantic AI, MCP, tool use, sandbox agents. 12 numbered guide notebooks (`guides/01_intro.ipynb` … `12_starting_your_project.ipynb`). Intermediate Python (decorators, async). | https://github.com/ed-donner/agents |
| 3 | **production** | 4-week "Generative AI and Agentic AI in Production" (Ed's "juiciest course"). | Deploy GenAI/Agentic AI at scale on AWS; infrastructure, deployment, monitoring, community-contributions folder; per-week folders (`week1`…). | https://github.com/ed-donner/production |
| 4 | **tech2ai** | From Software Engineer → AI Data Scientist (O'Reilly live course). | Data-science fundamentals (NumPy, SciPy, Pandas), AI fundamentals, leveling up programming, choosing an AI path, GenAI/LLMs. 4 segments culminating in an autonomous Agentic AI solution in Segment 4. **This is the most "data-analysis"-focused of his repos.** | https://github.com/ed-donner/tech2ai |
| 5 | **agentic** | "Hands-on LLM Engineering including Agentic AI Project" (live-event edition). | Companion code to his O'Reilly/Pearson live event; condensed LLM + agent project build. | https://github.com/ed-donner/agentic |
| 6 | **choose_llm** | Companion code to his "Choosing the Right LLM" class. | Model selection, leaderboards, OpenAI vs. open-source, cost/latency trade-offs. | https://github.com/ed-donner/choose_llm |

### 1b. Companion / Workshop Repositories

| Repo | Description | URL |
|------|-------------|-----|
| **action** | Repo for Jon Krohn & Ed Donner's "Agentic AI in Action" workshop at ODSC East. | https://github.com/ed-donner/action |
| **sds** | Repo for the SuperDataScience AI Engineering Bootcamp. | https://github.com/ed-donner/sds |
| **workshop** | Generic workshop companion repo. | https://github.com/ed-donner/workshop |
| **faq** | Code/answers accompanying his courses' FAQ. | https://github.com/ed-donner/faq |
| **expert** | "Expert AI Agent with Agentic RAG and OpenAI Agents SDK." | https://github.com/ed-donner/expert |
| **rag** | A deep dive on RAG techniques. | https://github.com/ed-donner/rag |
| **agentic-rag** | Exploring the world of Agentic RAG. | https://github.com/ed-donner/agentic-rag |
| **sandbox-agents** | Experimenting with Sandbox Agents in OpenAI Agents SDK. | https://github.com/ed-donner/sandbox-agents |
| **cma** | Examples of Claude Managed Agents. | https://github.com/ed-donner/cma |
| **event** | Repo for a live event. | https://github.com/ed-donner/event |

### 1c. Application / Capstone Project Repositories (showcase apps)

These are mostly student-style apps and demos (less central to curriculum mapping):

`crm` (kanban-style CRM), `kanban` (project-management app), `pm` (AI-driven project management), `avatar` (digital twin), `prelegal` (legal-drafting platform), `alex`, `video`, `tutor`, `tradewars` (LLM day-trading battle), `saas`, `pounce`, `space` (Elite-inspired space-shooter sim), `cyber`, `finally` (LLM trader workstation capstone), `territory` (team-competition game with coding agents), `fin`, `outsmart` (LLM diplomacy arena), `connect` (Four-In-A-Row LLM arena), `showcase` (AI bootcamp showcase), `freecell` (his first Rust project), `test_flow`, `remoto`, `earlier_version_of_outsmart`.

> **Gap-relevance for a 52-section Python DS curriculum:** Ed's repos are strong on **LLM/Agentic AI engineering** and **production deployment** but light on **core data-analysis fundamentals** (statistics, EDA workflow, visualization beyond basics, classical ML). `tech2ai` is the only repo touching NumPy/Pandas/SciPy directly.

---

## 2. Top Free Python Courses / Repos on GitHub

Star counts are approximate (verified via star-history / leaderboard aggregators since GitHub restricted direct counts).

| # | Repo | Description | Topics Covered | Stars (approx.) | URL |
|---|------|-------------|----------------|-----------------|-----|
| 1 | **jwasham/coding-interview-university** | A complete self-taught CS study plan to become a software engineer. | Data structures, algorithms, Big-O, system design, OS, networking, databases, math for CS, daily coding problems. Multi-month plan. | ~356k | https://github.com/jwasham/coding-interview-university |
| 2 | **vinta/awesome-python** | Opinionated curated list of the best Python frameworks, libraries, tools, resources. | Web frameworks, DBs, admin panels, NLP, ML, data viz, testing, asyncio, environment mgmt, etc. ~568 categorized resources. | ~305k | https://github.com/vinta/awesome-python |
| 3 | **TheAlgorithms/Python** | All algorithms implemented in Python. | Sorting, searching, DP, graphs, math, ciphers, neural networks, etc. — algorithm-by-algorithm in subdirectories. Educational, interview-prep oriented. | ~223k | https://github.com/TheAlgorithms/Python |
| 4 | **kamranahmedse/developer-roadmap** | Interactive role roadmaps (including "AI Data Scientist" and "Python" tracks). | Step-by-step mind maps: Python fundamentals → DS/ML/AI career paths, tools, best practices. | ~259k | https://github.com/kamranahmedse/developer-roadmap |
| 5 | **jlevy/the-art-of-command-line** | Master the command line in one page (Linux/Mac/Windows). | Shell basics, files, processes, networking, performance, system introspection; translated into ~20 languages. | ~162k | https://github.com/jlevy/the-art-of-command-line |
| 6 | **Asabeneh/30-Days-Of-Python** | 30-day (extendable to 100) Python programming challenge, beginner → intermediate. | Variables, conditionals, loops, functions, lists, dicts, sets, comprehensions, OOP, file I/O, exceptions, modules, generators, decorators, iterators, regex, virtualenv, Flask, NumPy/Pandas intro. | ~51k | https://github.com/Asabeneh/30-Days-Of-Python |
| 7 | **josephmisiti/awesome-machine-learning** | Curated list of ML frameworks, libraries, software (by language). | Python/R/Java/C++ ML libraries, tutorials, courses, books; ~1.2k resources indexed. | ~73k | https://github.com/josephmisiti/awesome-machine-learning |
| 8 | **trekhleb/homemade-machine-learning** | Popular ML algorithms implemented in Python with interactive Jupyter demos + math. | Linear regression, logistic regression, k-means, PCA, Naive Bayes, perceptron, neural nets, decision trees, random forests. | ~24.5k | https://github.com/trekhleb/homemade-machine-learning |
| 9 | **mrdbourke/pytorch-deep-learning** | Materials for "Learn PyTorch for Deep Learning: Zero to Mastery." | PyTorch fundamentals, workflows, neural-net classification, computer vision, custom datasets, CNNs, transfer learning, model deployment. | ~11k+ | https://github.com/mrdbourke/pytorch-deep-learning |
| 10 | **zhiwehu/Python-programming-exercises** | 100+ challenging Python programming exercises (Python 2 & 3 versions). | ~100 graduated problem statements with difficulty levels — pure practice (no solutions supplied officially). | ~30k | https://github.com/zhiwehu/Python-programming-exercises |
| 11 | **rasbt/python-machine-learning-book** (+ 3rd-edition / `machine-learning-book`) | Code repository for Raschka's "Python Machine Learning" / "ML with PyTorch & Scikit-Learn." | Perceptron, MLPs, SVMs, decision trees, random forests, kNN, clustering, sentiment analysis, transformers; scikit-learn/TensorFlow/PyTorch. | ~15k (combined) | https://github.com/rasbt/python-machine-learning-book · https://github.com/rasbt/machine-learning-book |
| 12 | **freeCodeCamp/freecodecamp** | Open-source codebase + curriculum for freeCodeCamp.org. | Free certifications: Scientific Computing with Python, Data Analysis with Python, Relational DB (SQL), College Algebra, etc. | ~407k | https://github.com/freeCodeCamp/freeCodeCamp |
| 13 | **jakevdp/PythonDataScienceHandbook** | Full text of "Python Data Science Handbook" as Jupyter notebooks. | IPython, NumPy, Pandas, Matplotlib, Scikit-Learn. (Also listed under free books §5.) | ~43k | https://github.com/jakevdp/PythonDataScienceHandbook |

---

## 3. Top University Python / Data Science Courses (Open Courseware)

| # | Course | University | Description | Key Topics | URL |
|---|--------|------------|-------------|------------|-----|
| 1 | **6.0001** Introduction to CS & Programming in Python | MIT (OCW) | Intro for students with little/no programming experience. | Computation, branching/iteration, string manipulation, bisection search, recursion, objects, OOP, complexity, searching/sorting. | https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016 |
| 2 | **6.0002** Intro to Computational Thinking & Data Science | MIT (OCW) | Continuation of 6.0001. | Optimization, stochastic thinking, random walks, Monte Carlo simulations, statistics, data visualization, regression, clustering, classification. | https://ocw.mit.edu/courses/6-0002-introduction-to-computational-thinking-and-data-science-fall-2016 |
| 3 | **CS50P** Introduction to Programming with Python | Harvard | Free self-paced course teaching Python from scratch (10 lectures, 9 problem sets, final project). | Functions, variables, conditionals, loops, exceptions, libraries, unit tests, file I/O, regular expressions, OOP, Et Cetera. | https://cs50.harvard.edu/python |
| 4 | **CS229** Machine Learning | Stanford | Foundational graduate ML course (Andrew Ng). | Supervised learning (generative, parametric/non-parametric, NNs), unsupervised learning (clustering, EM, PCA, ICA), reinforcement learning, deep learning. | https://cs229.stanford.edu |
| 5 | **CS231n** Deep Learning for Computer Vision | Stanford | 10-week deep-learning-for-CV course. | Image classification, kNN, linear classification, backprop/optimization, CNNs, training tricks, batchnorm/dropout, RNNs, attention, transformers, generative models. | https://cs231n.stanford.edu |
| 6 | **CS 61A** Structure & Interpretation of Computer Programs | UC Berkeley | Intro to programming concepts using Python. | Abstraction, functional programming, recursion, OOP, iterators/generators, trees/linked lists, Scheme, SQL, regular expressions, logic programming. | https://cs61a.org |
| 7 | **Data 8 (DATAC8)** Foundations of Data Science | UC Berkeley | Intro combining Python programming + statistics with real datasets. | Python (datascience library), tables, data visualization, sampling, hypothesis testing, A/B testing, bootstrap, regression, classification, causal inference. | https://data8.org |
| 8 | **15-112** Fundamentals of Programming | Carnegie Mellon | First-semester CS course in Python. | Sequential/conditional/loop statements, strings, lists, tuples, sets, dicts, OOP, recursion, graphics/animations, event-based programming. | https://www.cs.cmu.edu/~112 |
| 9 | **Python for Everybody (PY4E)** / SIADS | University of Michigan (Dr. Charles "Chuck" Severance) | Free open materials: book, lectures, autograder, MOOC on Coursera/edX. | Getting started, variables/expressions, conditionals, functions, loops, strings, files, lists, dicts, tuples, regex, OOP, databases (SQL), data viz, web scraping, JSON/REST APIs. | https://www.py4e.com · https://online.umich.edu/series/python-for-everybody |

---

## 4. Top Online Courses Rated by Users & Recruiters (Free / Freemium)

| # | Platform | Course / Certification | Key Topics | Approx. Hours | URL |
|---|----------|------------------------|------------|----------------|-----|
| 1 | freeCodeCamp | **Scientific Computing with Python** certification | Python fundamentals (variables, loops, conditionals, functions), complex data structures, networking, relational databases, data visualization; 5 projects. | ~300 hours | https://www.freecodecamp.org/learn/scientific-computing-with-python |
| 2 | freeCodeCamp | **Data Analysis with Python** certification | Data analysis with Python, NumPy, Pandas, Matplotlib, Seaborn; 5 projects (Mean-Variance-StdDev, Demographic Data Analyzer, Medical Data Visualizer, Page View Time Series, Sea Level Predictor). | ~300 hours (combined with above track) | https://www.freecodecamp.org/learn/data-analysis-with-python |
| 3 | Kaggle Learn | **Python** | Syntax, variables, lists, booleans/conditionals, loops, lists/dicts, functions, classes, OOP. | ~5 hours | https://www.kaggle.com/learn/python |
| 4 | Kaggle Learn | **Pandas** | Creating/reading/writing dataframes, indexing, summary functions, groupby, merging, data types, missing values. | ~4 hours | https://www.kaggle.com/learn/pandas |
| 5 | Kaggle Learn | **Intro to Machine Learning** + intermediate/advanced ML, Data Visualization, SQL, Deep Learning, Intro to AI, Computer Vision, Time Series, Feature Engineering | Short hands-on modules. | ~3 hours per micro-course; full catalog ~80+ hours | https://www.kaggle.com/learn |
| 6 | Google / Coursera | **Google Data Analytics Professional Certificate** | Data cleaning, analysis, visualization; tools: spreadsheets, SQL, R/Python basics, Tableau. 8 courses + capstone. | ~180 hours (~6 months @ 10 hr/wk) | https://www.coursera.org/professional-certificates/google-data-analytics |
| 7 | Google / Coursera | **Google Data Analysis with Python Specialization** | Variables/types, functions & conditionals, loops & strings, data structures, OOP, data analysis projects. | ~30+ hours (5 courses) | https://www.coursera.org/specializations/google-data-analysis-with-python |
| 8 | IBM / Coursera | **IBM Data Science Professional Certificate** (12-course series) | What is Data Science, Python for DS/IA, SQL, Python project, Databases/SQL for DS, Data Analysis with Python, Data Visualization with Python, ML with Python, Applied DS Capstone. | ~5 months @ 10 hr/wk (~200 hrs); rated 4.6/5 | https://www.coursera.org/professional-certificates/ibm-data-science |
| 9 | DataCamp | **Data Scientist in Python** track (freemium; first chapters free) | Python intro, NumPy, Pandas, data manipulation/visualization, statistics, supervised/unsupervised ML, time series, SQL; 26 courses, projects. | ~100 hours (90 hr Associate track; 26 hr core intro) | https://www.datacamp.com/tracks/data-scientist-in-python |
| 10 | Real Python | **Real Python** (free articles + paid courses) | Massive free tutorial library: Python basics, data structures, OOP, decorators/generators, async, web scraping, Flask/Django, Pandas, NumPy, Jupyter, testing, dev tools. | Hundreds of articles; variable | https://realpython.com |
| 11 | Corey Schafer (YouTube) | **Python Programming Tutorials** playlist | Beginners series (strings, lists, tuples, sets, dicts, conditionals, loops, functions), OOP, decorators, generators, async/await, Matplotlib, Pandas, Flask, Git, VSCode. | ~100+ hours total | https://www.youtube.com/@coreyms/playlists |

---

## 5. Top Free Python / Data Science Books Online

*(In addition to the 4 EPUBs already in the project.)*

| # | Title | Author | Free URL | Key Topics |
|---|-------|--------|----------|------------|
| 1 | **Think Python: How to Think Like a Computer Scientist** (2nd ed., v2.4.0; also newer 3rd ed. on GitHub Pages) | Allen B. Downey (Green Tea Press) | HTML/interactive: https://allendowney.github.io/ThinkPython · PDF: https://greenteapress.com/wp/think-python-2e | Programming fundamentals, variables/expressions, functions, conditionals/recursion, fruitful functions, iteration, strings, case studies (word play), lists, dictionaries, tuples, files, classes/objects, inheritance, debugging, analysis of algorithms. |
| 2 | **Python Data Science Handbook** | Jake VanderPlas | Full HTML: https://jakevdp.github.io/PythonDataScienceHandbook · Notebooks: https://github.com/jakevdp/PythonDataScienceHandbook | Ch 1: IPython; Ch 2: NumPy (arrays, broadcasting, fancy indexing); Ch 3: Pandas (Series, DataFrame, indexing, ops, missing data, multi-indexs, time series); Ch 4: Matplotlib (line/scatter, density/contour, errors, subplots, 3D, geographic); Ch 5: Scikit-Learn (supervised/unsupervised, model validation, feature engineering, PCA, manifold learning, k-means, Gaussian mixtures, SVM, random forests). |
| 3 | **Dive Into Python 3** | Mark Pilgrim | https://book.diveintopython.org · PDF/HTML/ePub: https://freecomputerbooks.com/Dive-Into-Python-3.html | For experienced programmers: your first Python program, native datatypes, comprehensions, strings, regular expressions, closures & generators, classes & iterators, advanced iterators, unit testing, refactoring, files, XML, serializing Python objects, HTTP web services, case studies. |
| 4 | **Automate the Boring Stuff with Python** (2nd & 3rd editions) | Al Sweigart | https://automatetheboringstuff.com · 2e: https://automatetheboringstuff.com/2e | Python basics, flow control, functions, lists, dictionaries/structuring data, string manipulation, pattern matching (regex), reading/writing files, organizing files, debugging, web scraping, working with Excel/Google Sheets/PDF/Word/Email, image manipulation, GUI automation, sending email/texts. |
| 5 | **The Hitchhiker's Guide to Python** (Best Practices for Development) | Kenneth Reitz & Tanya Schlusser (community) | Read online: https://docs.python-guide.org · Listing: https://freecomputerbooks.com/The-Hitchhikers-Guide-to-Python.html | Choosing/installing Python, writing great Python code, module structure, common pitfalls, packaging, documentation, testing, deployment, Scikit-Learn/ImageOps/SQLAlchemy-style library recommendations, scenario guide (web apps, scraping, data science, CLI tools). |

---

## 6. Summary & Coverage-Gap Notes (for cross-referencing the 52-section curriculum)

**What this inventory collectively covers well:**
- Core Python syntax & semantics (MIT 6.0001, CS50P, CMU 15-112, Berkekey CS61A, PY4E, Asabeneh 30-Days, Automate the Boring Stuff, Think Python)
- Data-analysis stack: NumPy, Pandas, Matplotlib, Seaborn, Scikit-Learn (VanderPlas PDSH, freeCodeCamp Data Analysis, Kaggle Pandas, IBM/Google certs, DataCamp)
- Classical ML & deep learning (Stanford CS229/CS231n, trekhleb homemade-ML, rasbt ML books, mrdbourke PyTorch, Kaggle ML)
- Algorithms, interview prep & CS fundamentals (coding-interview-university, TheAlgorithms/Python, MIT 6.0002)
- Command-line & dev workflow (art-of-command-line, Hitchhiker's Guide, Corey Schafer Git/VSCode)
- LLM / Agentic AI engineering & production (Ed Donner's full 6-course curriculum)

**Likely gap areas to verify against the 52-section curriculum:**
1. **Statistics & probability fundamentals** as a dedicated arc — covered piecemeal (Berkeley Data 8, MIT 6.0002, IBM, DataCamp) but no single canonical free text.
2. **Bayesian statistics / A-B testing / experimentation design** — only Data 8 touches it lightly.
3. **Time-series forecasting (ARIMA, Prophet, LSTM forecasting)** — only Kaggle has a short module.
4. **MLOps / model deployment beyond Ed's `production` repo** — limited free depth (mrdbourke has a deployment chapter).
5. **NLP fundamentals (pre-LLM): TF-IDF, word2vec, topic modeling** — partially in CS229 notes; rasbt book has sentiment chapter.
6. **Data engineering / ETL / Spark / Airflow** — not well covered by any free resource here.
7. **Causal inference & feature-store / governance topics** — minimal.
8. **Cloud data warehousing (BigQuery, Snowflake, dbt)** — only Ed's production course touches AWS.

**Recommended next actions:**
- Map each of the 52 curriculum sections to the strongest resource(s) above.
- For gaps 1–8, source additional dedicated free materials (e.g., OpenIntro Statistics, Russ Pohl's "Probabilistic Programming & Bayesian Methods for Hackers", Databricks Spark free training, Google Cloud BigQuery docs/sandbox).
- Where Ed Donner's repos are the strongest match (LLM/Agentic/production sections), link directly to the relevant `guides/NN_*.ipynb` or `weekN/` folder.
