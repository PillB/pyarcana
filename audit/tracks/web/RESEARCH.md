# «Python en la web»: syllabus and learner research, and a knowledge map

Researched 25 Nov 2026 for the optional applied track that follows S12 (`apis-sql-geo`) and becomes required from S27 (first section of «Integración avanzada»). Every claim below cites a page that was opened during this research. Where a page did not say something, the text says "not stated on the page". The label **unverified** marks a claim this research could not check. The track content reviewed is `src/lib/tracks/web/content.ts` and `audit/tracks/web/DESIGN.md` as they stand in the working tree.

The machine-readable knowledge map is in `graph.json`, next to this file: 73 nodes, 92 edges and 8 loose dependencies, checked acyclic with `graphlib.TopologicalSorter`.


> **Applied in the same PR (25 Nov 2026):** recommendations 1, 2, 4 and 5 below, and 3 in part (JavaScript and the DOM glossed against Python; the Network tab is not taught). The content quoted in §C–§D is the draft this research reviewed; `graph.json` lists each fixed loose dependency under `resolved`, with the action taken.
---

## A. Syllabi: where HTML, HTTP, database modelling and deployment sit

### A.1 Summary table

| # | Programme | Order of the four topics | Assumed prerequisites | DB modelling (entities, keys, N:M) | Deployment with a real exercise? |
|---|---|---|---|---|---|
| 1 | **CS50x** [1] | Python (w6) → **SQL (w7)** → **HTML, CSS, JS (w8)** → **Flask (w9)** → final project | None; starts at Scratch | SQL week only; modelling depth not stated on the page | **No.** The course page has no deployment information. Week 8 covers "Internet: routers, TCP/IP, DNS; HTTP: URLs, GET, POST" [2]. Week 9 covers routes, requests, sessions and cookies, with no deployment [3]. |
| 2 | **CS50 Web** [4] | **HTML/CSS (0)** → Git (1) → Python (2) → Django (3) → **SQL, Models, Migrations (4)** → JS (5) → UI (6) → Testing, CI/CD (7) → Scalability & Security (8) | CS50x or equivalent (assumed) | "Database design" appears in the description; models and migrations in week 4 | The description says learners use cloud services "like GitHub and Heroku" to "deploy applications on the Internet" [4]. No per-project deployment requirement is shown on the page. |
| 3 | **PY4E** [5][6] | Files (8) → … → Regex (12) → **Network Programming / HTTP (13)** → **Web Services (14)** → OOP (15) → **Databases (16)** → Visualization (17) | None | **Yes, explicit:** "Complex Models", "Relationships", "Foreign Keys", "JOIN", "Many-to-Many" + Roster.py worked example, plus a *Data Modeling* quiz [6] | **No.** No deployment lesson. |
| 4 | **Full Stack Open** [7][8][9][10] | **Part 0, Fundamentals of web apps** (HTTP GET/POST, network tab, HTML, DOM, JSON, Content-Type, SPA vs traditional) → React (1) → server comms (2) → **Node/Express + Deploy + MongoDB (3)** → … → CI/CD (11) → Containers (12) → **Relational DBs (13)** | "Good programming skills, basic knowledge of web programming and databases… basics of Git" [10] | Relational databases come late (part 13) | **Yes, graded.** Exercise 3.10: deploy the backend "to the internet" and put the link in README. Exercise 3.11: serve the production frontend through the backend. Uses Fly.io or Render. It also covers the same-origin policy, CORS and the `PORT` environment variable [8]. |
| 5 | **The Odin Project, Full Stack JS** [11][12][13] | (Foundations) → Intermediate HTML/CSS → JS → Advanced HTML/CSS → React → **Databases (2 lessons, 1 project)** → **NodeJS (Express + PostgreSQL)** → Getting hired | Foundations path | Only 2 lessons on databases [11] | Partial. Foundations says "To share your website with others, you'll need to deploy it using GitHub Pages", but the landing-page assignment only requires a push to GitHub [13]. The FAQ says students "learn Git and deployment so you can build your own portfolio" [12]. |
| 6 | **freeCodeCamp Relational Databases** [14] | Bash, SQL, Git in a command-line environment | — | The announcement mentions no foreign keys, junction tables or modelling [14] | Not applicable |
| 7 | **freeCodeCamp Data Analysis with Python** [15] | 5 projects: Mean-Variance-SD, Demographic Data, Medical Data Visualizer, Page View Time Series, Sea Level Predictor | Python | None | **No.** The certification page itself would not render (fetch returned only metadata), so the project list comes from a learner's repository README [15]. |
| 8 | **Data Carpentry, SQL for Ecology** [16] | Intro DB & SQL → Queries → Aggregation → **Joins** | "No prior knowledge" | **None.** No keys, normalization or relationship design in the episode list | No |
| 9 | **MIT Missing Semester 2026** [17][18] | Shell → … → Git → **Packaging and Shipping Code** → … | Programming | — | **Yes.** It has six exercises, including Docker, Compose, publishing and **GitHub Pages**. Configuration via environment variables "and keeping secrets out of version control"; it also mentions DNS configuration [18]. |
| 10 | **Google Data Analytics (Coursera)** [19] | 9 courses: spreadsheets, SQL, Tableau, Python (course 7), capstone | None | **Not covered.** Course 3 describes only database "functions and components" | **No.** "Web presence" appears only as a job-search skill |
| 11 | **IBM Data Analyst (Coursera)** [20] | Excel → Cognos → **Python incl. REST APIs with `requests`, BeautifulSoup** (4) → Python project (5) → **Databases and SQL** (6) → … → Dash/Plotly dashboards (8) → capstone | None | Partial: create a database and multiple tables with DDL, joins, views | **No** deployment is mentioned, although it builds Dash dashboards |
| 12 | **DataCamp Data Analyst in Python** [21] | Python → pandas → joins in pandas → stats → seaborn → EDA → hypothesis tests | None | None (no SQL in this track) | No |
| 13 | **Datasette / Simon Willison, PyCon 2023 tutorial** [22] | SQLite file → `datasette publish vercel` | CLI, a SQLite file, a Vercel account | — | **Yes.** It is a one-command publish to Vercel, Cloud Run, Heroku or Fly. It has no static or GitHub Actions route in the tutorial [22]. |
| 14 | **CMU 15-445 (Fall 2025)** [23] | Relational model & algebra → Modern SQL → storage… | (Systems course) | **No ER modelling or normalization** in the schedule | — |
| 15 | **Stanford CS145 (Fall 2022)** [24] | SQL I–III → indexing → … → transactions → **"Big schemas and Design Theory" (normal forms) last** | — | No ER modelling on the page; normal forms at the end | — |
| 16 | **UW CSE 344 (Win 2025)** [25] | Relational model → SQL (all of it) → relational algebra → **ER modelling (Feb 3) → FDs → BCNF** → transactions → **application data management, CRUD** | — | ER and normalization **after** SQL | — |
| 17 | **RPI CSCI 4380 (Spr 2025)** [26] | Relational model → algebra → **normalization (wk 2–4) → ER diagrams (wk 4–5)** | — | Theory-first; ER after normalization | — |
| 18 | **MDN Learn web development** [27][28][29] | Getting started (incl. **"Your first website → Publishing"**) → Core: HTML, CSS, JS, a11y, design, version control → Extensions incl. **"Client-side tools → Deployment"** and **"Server-side websites" (Django, with "Deploying")** | None | — | **Yes.** "If you are just getting started, we'd recommend GitHub Pages for its ease of use" [29]. Domains and DNS A/CNAME records are explained there too. |
| 19 | **MDN Curriculum** [28] | Core: Web standards → **Semantic HTML** → CSS ×3 → **JS fundamentals** → **Accessibility** → Design → **Version control**; Extensions: **Web APIs**, Security & privacy, Testing… | — | — | Not listed as a module [28] |
| 20 | **web.dev Learn HTML** [30][31] | Overview → Document structure → Metadata → Semantic HTML → … → **Tables (module 12)** → Forms → … | — | — | — |

### A.2 What the syllabi agree on, and where they disagree

1. **The web comes after SQL in the programmes closest to PyArcana's audience.** CS50x puts SQL in week 7, the web in week 8 and Flask in week 9 [1]. PY4E puts HTTP and web services (13–14) right before databases (16), and both after files and regex [5]. That matches anchoring the track after S12, which covers APIs and SQL.
2. **The HTTP mental model is taught by observation, before any framework.** FSO Part 0 makes learners draw sequence diagrams of real GET/POST exchanges from the browser's network tab [9]. CS50x week 8 covers TCP/IP, DNS and HTTP before Flask [2]. PyArcana's module 2 builds the server and the client in Python. It never has the learner *watch* a request in DevTools, which FSO treats as the basis.
3. **Modelling has no agreed place.** PY4E teaches it to beginners through worked examples (Roster.py, many-to-many) [6]. University DB courses teach it *after* SQL fluency: UW 344 [25] and Stanford 145 [24]. RPI teaches it after normalization theory [26]. CMU 15-445 skips it [23]. Applied data programmes (Google, Carpentries, DataCamp) skip it completely [16][19][21]. **PY4E is the only beginner programme that teaches N:M junction tables with a worked example.** None of the beginner programmes mentions SQLite's `PRAGMA foreign_keys`.
4. **Deployment is graded only in web-developer programmes.** FSO grades it (ex. 3.10–3.11) [8]. Missing Semester has a GitHub Pages exercise [18]. MDN has a Publishing page [29]. No data-analyst programme reviewed (Google, IBM, DataCamp, freeCodeCamp DA, Carpentries) teaches deployment [15][16][19][20][21].
5. **Semantic tables are a standard topic in web curricula.** web.dev's Tables module covers `<caption>` ("the preferred method of naming a table"), `th scope` and `thead/tbody`. It also says "Only use a table for data" [31]. MDN Curriculum Core has Semantic HTML and Accessibility as separate modules [28].
6. **JavaScript is always taught before it is used to change a page.** Odin (JS course before Node) [11], MDN Core (JS fundamentals) [28] and CS50x week 8 (variables, conditionals, loops, events) [2] all teach it first. **PyArcana's track uses JS without teaching it** (see D.4).

---

## B. Learner and user research

### B.1 Surveys

| Source | Finding relevant to the track |
|---|---|
| **Stack Overflow 2025** (n = 33,454 for this question) [32] | People learned to code in the past year mainly from **technical documentation (67.8%)**, other online resources (58.7%), Stack Overflow (51.4%), videos (50%) and **AI tools (44%)**. Online courses account for 32.7% and bootcamps 5.2%. *Implication:* the track should link to primary docs (it already links GitHub, Cloudflare and Vercel docs) and teach learners to read them. |
| Stack Overflow 2025, technology [33][34] | Language use: JS 66%, **HTML/CSS 61.9%, SQL 58.6%, Python 57.9%**. Databases: **PostgreSQL 55.6%, SQLite 37.5%**. Cloud: **AWS 43.3%, Cloudflare 20.1%, Vercel 10.6%**, Netlify 5.9%. Web frameworks: **FastAPI 14.8%**, Flask 14.4%, Django 12.6%. |
| **Stack Overflow 2026** (30,903 responses) [35][36] | JS 62%. **SQL, HTML/CSS and Python 58% each.** AI is used to deploy, operate or troubleshoot production by only **20%**, against 67% who use it to generate code. The 2026 blog post gives no figures for learning resources, databases or cloud [35]. |
| **JetBrains/PSF Python Developers Survey 2024** [37][38] | Python devs who do data science also use **SQL 45%, JavaScript 34% and HTML/CSS 32%**. Web frameworks: **FastAPI 38%**, Django 35%, Flask 34%. In the cloud, code runs in containers 53%, VMs 44%, **serverless 28%** and PaaS 20%. Databases: PostgreSQL 49%, **SQLite 37%**. **50% have under 2 years' professional experience** [38]. Web development is "resurging" (46%, up from 42%) [38]. |
| **Anaconda State of Data Science 2025** (n = 211) [39] | "Over 57%" say moving AI projects from development to production takes more than a month. The report does **not** measure software-engineering, deployment or cloud skill gaps. *Its evidence on deployment is about AI models, not analysts' web output.* |
| **Kaggle 2022** (23,997 respondents) [40] | Python and SQL are "the two most common programming skills for data scientists". No HTML or deployment data in the opened report. |

### B.2 Job postings (what employers ask analysts for)

| Source | Finding | Credibility |
|---|---|---|
| Dong & Triche (2020), *JISE* 31(4), 9,163 entry-level analyst postings, 2014–2018 [41] | **HTML ≈ 2.5–3.9%, no significant trend.** D3 ≤ 0.5%. Python rose from 2.3% to 10.7%, Tableau from 5.3% to 18.9%, "Database System" from 48% to 58.9% and "Data Management" from 40% to 49.8%. Azure rose from 0.2% to 3.6%. | Peer-reviewed; data is old |
| InterviewStack job-board analysis on DEV (May 2026), 2,585 "Data Analyst" postings [42] | **SQL 72%**, Python 53%, Power BI and Tableau 40% each, Excel 35%, **Data Modeling 15%**, Cloud family 12% (AWS 8%), dbt 9%. HTML is not mentioned. | **Low.** Vendor blog with an unaudited method. Treat as indicative only. |

**Reading:** hiring signals for analysts rank SQL and modelling far above HTML. HTML and deployment pay off as *communication and portfolio* skills: they put a result behind a link. They are not a line on a job description. The track should therefore weight module 3 (modelling) as a core skill, and frame modules 1, 4 and 5 as "share your analysis".

### B.3 Qualitative: tutorial hell, the deployment wall, modelling errors

- **The deployment wall (practitioner).** A PyCon DE 2026 talk describes the "wall" data scientists hit when moving a Streamlit or Dash prototype into production. They must get it to end users, connect live data instead of CSV exports, and set up SSO, authentication and permissions. "Building a prototype can take days, but getting it deployed often takes weeks" [43]. This matches the learner's request almost word for word.
- **"Tutorial hell" (research is thin).** No peer-reviewed study that uses the term was found. Nearby evidence:
  - Alasmari, Singer & Bikanga Ada (ICETC 2023): learners "may know the syntax and semantics of individual statements, but they do not know how to combine those elements in order to produce valid programs" [44].
  - Alghamdi, Bull & Kharrufa (arXiv 2025, n = 15 informal learners): learning is "fragmented and transient", "isolating and frustrating" [45].
  - Harms et al. (2016): children chose tutorials over puzzles when they prioritised learning, although puzzles produced more evidence of knowledge in prior work [46].
  - *Implication:* the track's single integrated build (CSV → HTML + JSON → JS → published URL) is the right antidote. It works only if the learner builds it with *their own* data (see Recommendations).
- **ER-modelling errors.** Two studies:
  - Rashkovits & Lavy (IJDMS 2021, n = 65): novices got binary cardinalities almost always right. They failed on weak entities (88%), ternary relationships (80%, often replaced by two binaries) and reflexive relationships (83%) [47].
  - Abdelaziz et al. (Frontiers in Education 2025, n = 200, plus an intervention with 257 learners): ternary cardinality was wrong for 98%. Mixing Chen and Crow's-foot notation affected 60%. Placing the FK when mapping ERD → schema went wrong for 20%. The authors recommend "test candidate designs against sample data" and **one notation per diagram** [48].
  - *Implication:* keep the track to binary 1:N and N:M (it does). Use one notation. Add a "try a bad row" step, which the FK step half does already.
- **Learner-written portfolio advice.** DataCamp lists GitHub Pages among five places to host a data portfolio. Its Pages steps require creating an `index.html` [49]. Learners meet HTML through the portfolio route whether or not a course teaches it.

### B.4 What learners say is missing (synthesis)

1. **A path from notebook or script to a URL**, without first learning a web framework [43][49]. Analyst programmes never provide one [15][19][20][21].
2. **Seeing how programs talk.** IBM teaches `requests` against REST APIs [20], but analyst courses never show the *server* side or the browser's view. PyArcana's own S12 audit found S12 "consuming synchronous HTTP APIs" only through `MockResponse` objects. `urlopen` is "mentioned but never demonstrated" (`audit/consolidated/sections/S12.md`, FALSE_HTTP_STATUS_MENTAL_MODEL).
3. **Design before syntax.** Most analyst SQL teaching is queries and joins [16][19]. Modelling appears in only 15% of postings [42] but gets *zero* hours in the analyst programmes reviewed.
4. **Knowing which hosting to choose and why.** No reviewed analyst course compares static hosting, a serverless function and a full server. MDN does it for web learners [29].

---

## C. Gaps in existing programmes, for a data and automation learner

| Gap | Evidence | Does PyArcana's track close it? |
|---|---|---|
| Analyst courses never deploy anything | [15][16][19][20][21] | **Yes**: GitHub Pages and Cloudflare, with a decision table |
| Web courses never use the analyst's own data. They build todo or notes apps | FSO notes app [9]; Odin landing page [13] | **Yes**: CSV → table of sales. **Partly**, because it uses fixed synthetic sales rather than the learner's S12/S13 output |
| SQL taught without modelling | Carpentries [16], Google [19], DataCamp [21] | **Yes**: module 3 |
| Modelling taught without enforcement. No beginner course reviewed mentions SQLite's FK pragma; SQLite disables FK constraints "by default" and they "must be enabled separately for each database connection" [50] | [6][16][50] | **Yes**: `PRAGMA foreign_keys = ON` with an orphan-row error/fix pair. S29 repeats it at depth (30 mentions of `foreign_keys` in `s29-mlops.ts`) |
| Escaping taught late, or as a framework feature only | CS50x week 9 lists no templates or autoescape [3]. OWASP: encode `& < > " '` for HTML contexts; prefer `textContent` over `innerHTML` [51] | **Half.** Python-side `html.escape` [52] is taught. The browser-side safe sink (`textContent`) is not named, though `app.js` happens to use it |
| HTTP taught as client-only | IBM [20]; PyArcana S12 audit | **Yes**: server and client in one file |
| `file://` vs `http://` origin never explained. Browsers "treat all local files as having opaque origins" and devs "should now set up a local server" [53] | [53] | **Taught, but not exercised** (see D.4: the site never calls `fetch`) |
| Static vs serverless vs server decision never made explicit | Only MDN and FSO touch on it [8][29] | **Yes**: three-row table |
| Hosting terms ignored. GitHub Pages: 1 GB per site, soft 100 GB/month, "not intended for or allowed to be used as a free web-hosting service" for business, e-commerce or SaaS, and not for "sensitive transactions" [54] | [54][55] | **Yes**: stated in the table |
| JavaScript used without being taught | Contrast: Odin, MDN, CS50x teach JS first [2][11][28] | **No.** This is the largest gap (D.4) |

---

## D. Knowledge map

The full graph is in `graph.json`. Nodes carry `status` ∈ {`course`, `track`, `deferred`} and `where` (S-number, `sesion-0`, or `modulo:<id>`). `"proposed": true` marks nodes this research recommends adding; they are not in `content.ts` today.

### D.1 Prerequisites the track takes from the course (status `course`)

| Node | Where | Used by |
|---|---|---|
| Terminal, `python -m` | S01 | `python -m http.server` |
| Git commit and push; `gh repo create … --push` | Sesión 0, Parte 6 (`src/lib/setup/content.ts`) | GitHub Pages |
| Secrets outside code | S01 / S12 | "never publish a token" |
| Functions | S05 | JS arrow functions (transfer) |
| UTF-8 | S07 | `<meta charset>` |
| JSON, CSV, pathlib | S08 | `data.json`, `index.html` |
| Exceptions | S09 | `sqlite3.IntegrityError` |
| Classes and inheritance; domain model | S11 | `BaseHTTPRequestHandler`; entities |
| SQL CREATE/SELECT/JOIN; parameterised queries; HTTP client with timeout (simulated) | S12 | modules 2–3; `?` placeholder ≈ escaping |

### D.2 Taught in the track (by module)

- **html:** split of work between Python and the browser; HTML document; element and attribute; charset, lang and viewport; `html.escape`; semantic table (caption, thead, `th scope`); a11y basics (lang, button, `aria-sort`). *Proposed:* minimal CSS.
- **http:** client and server; localhost and port; request and response; status code; Content-Type; JSON over HTTP; `fetch`; `await`. *Proposed:* minimal JS syntax; DevTools console and network tab.
- **modelo:** entity; attribute; relationship; 1:N; N:M; PK; FK; junction table; composite key; referential integrity; `PRAGMA foreign_keys`. *Proposed:* "test the model with rows".
- **sitio:** static site; generating HTML from Python; DOM; event listener; `file://` vs `http://`; local static server. *Proposed:* `textContent` safe sink; progressive enhancement.
- **despliegue:** deploy; public vs private data; relative vs absolute URL; GitHub Pages; CDN and edge; Workers static assets; hosting terms; serverless function. *Proposed:* Node.js/npx setup.

### D.3 Deferred to a later section (status `deferred`)

| Node | Section | Why defer |
|---|---|---|
| Jinja autoescape | S21 (already teaches `select_autoescape`) | Builds on manual escaping |
| Threads | S38 (Concurrencia) | Used in the track; see loose list |
| POST and forms | S41 (FastAPI y contratos HTTP) | Needs code on the server |
| CORS | S42 (Schemas, seguridad) | Only needed for cross-origin APIs |
| Normalization 1NF–3NF; ON DELETE; indices | S29 (SQL avanzado y modelado relacional, which already mentions 3NF and N–N links) | Theory after a working 1:N and N:M |
| Python on the server | S41 | |
| Containers | S43 | |
| CI to publish (Actions) | S44 | |
| AWS and cloud | S45 | |
| Own domain and DNS | S42 mentions DNS only; **no section teaches it**. MDN covers A/CNAME [29] | Not needed for `*.github.io` or `*.workers.dev` |

### D.4 Loose dependencies: used by the track, taught by neither the course before S12 nor the track

| Node | Evidence in `content.ts` | Fix |
|---|---|---|
| **JavaScript syntax** (`const`, arrow functions, ternary, spread `[...]`, `forEach`, `sort` comparator) | `app.js`, `leer_datos.js` | Add a short step "Leer JavaScript con ojos de Python": a side-by-side table (Python ↔ JS) for exactly the constructs used. Status: proposed `js-sintaxis-minima`. |
| **Top-level `await`** | `leer_datos.js` begins `const respuesta = await fetch(...)`. MDN: `await` is valid "only… inside an async function or at the top level of a module". Elsewhere it is "SyntaxError: await is only valid in async functions, async generators and modules" [56]. Pasted into a classic `<script src>`, it fails. | Wrap the code in `async function cargar() {…}`, or load it with `<script type="module">`, and say which. |
| **DOM** (`querySelectorAll`, `closest`, `rows`, `cells`, `append`) | `app.js` | One paragraph plus a picture of the tree, using the site's own `<table>`. |
| **Browser DevTools** | Checks say "F12, pestaña Consola" | Step: open DevTools, see the GET for `data.json` with 200 and Content-Type in the Network tab. This mirrors FSO Part 0 [9]. |
| **Threads** | `servidor_y_cliente.py` uses `threading.Thread`, which S38 teaches. The track defines it in one sentence. | Acceptable as an inline definition. Better: make the *two-terminal* version the primary path and the thread version the runnable check. |
| **Node.js / npx** | Cloudflare step: "Necesitas Node.js instalado", with no install path; Sesión 0 does not install Node | Add an install fix block, or mark Cloudflare as "if you already have Node". |
| **Creating the Pages repository** | `cd mi-sitio; git add …; git push` assumes a local repo with a remote. Sesión 0 taught `gh repo create … --source . --push` | Reuse the Sesión 0 command: `gh repo create mi-sitio --public --source site --push`. |
| **The site never calls `fetch`** (coherence) | `index.html` loads only `app.js`, which sorts the server-rendered `<tbody>`. `data.json` is written but nothing reads it. So the `file://` fix ("fetch falló … origen null") describes a symptom the built site cannot produce, and module 2's `fetch` step has no home. | Either (a) make `app.js` read `data.json` and show something from it (e.g. "3 sedes · total S/ 3660.75" in a `<p>` via `textContent`), or (b) drop the fetch symptom from `sitio.servir` and present `data.json` as a download link. (a) is preferred: it makes modules 2 and 4 one story. |

### D.5 Recommended order inside the track

The current order (html → http → modelo → sitio → despliegue) is sound, with two changes:

1. **Move "modelo" last, or make it a parallel branch.** No later module uses it: the site reads a CSV, not the SQLite model. The graph confirms there is no edge from any `modelo` node into `sitio` or `despliegue`. Leaving it in the middle splits the one end-to-end build in two. Option: html → http → sitio → despliegue, then **modelo as module 5**, tied to the advanced level (S29), where the track becomes required.
2. **Inside http:** DevTools observation (proposed) → server and client in Python → `fetch`. Watch first, build second, as FSO does [9].
3. **Inside sitio:** build → serve locally → add JS. Today JS comes before serving. Serving first lets the learner see the no-JS table work (progressive enhancement), then add sorting.

---

## Recommendations for the track

**Add (missing topics)**

1. **"JavaScript para quien ya sabe Python"**: one step, a table of the 8 constructs the track uses (Python ↔ JS), plus the DOM in one picture. Closes 3 of the 8 loose dependencies. Expert: an MDN Curriculum reviewer (Core "JavaScript fundamentals" precedes any DOM scripting [28]).
2. **DevTools Network tab step** in module 2. The learner sees the request for `data.json`, status 200 and `Content-Type: application/json` in the Network tab. Benchmark: FSO Part 0 exercises 0.4–0.6 [9].
3. **Make the site use `data.json`** (D.4, last row), and fix the top-level `await`. Without this, module 2's browser half and the `file://` lesson are untested claims.
4. **`textContent`, not `innerHTML`**: one sentence and the same `Bodega <Norte>` row, browser side. Benchmark: OWASP XSS cheat sheet [51].
5. **"Prueba tu modelo con filas"**: insert a duplicate (sede, producto) pair into `stock` and watch the composite PK reject it. This is Abdelaziz et al.'s recommendation [48]. The FK step already does this for orphans; extend it to the composite key.
6. **Minimal CSS** (≈10 lines: table width, right-aligned numbers, `:focus-visible`). The `html.reparto` table says the browser handles contrast and width "sin que lo programes". That is true for defaults, but a real analyst will want numbers right-aligned. Optional; mark it so.
7. **"Usa tus propios datos" capstone task**: rebuild the site from the learner's S12/S13 output. This is the antidote to tutorial hell [44][45]. Self-check only, consistent with the current no-grader design.

**Change**

8. Move module 3 (modelo) to the end, or present it as an independent branch (D.5).
9. Make GitHub Pages reuse the Sesión 0 `gh repo create --source … --push` command.
10. Give Cloudflare a Node.js prerequisite fix, or label it "si ya tienes Node.js".
11. Show the two-terminal server/client run as the primary path; keep the threaded single file as the pinned check.

**Defer (and say so in the track)**

12. Normalization, ON DELETE and indices → S29. POST, forms and CORS → S41/S42. Containers → S43. CI publishing → S44. AWS → S45. Own domain and DNS → **not taught anywhere**: name it as out of scope and link MDN's Publishing page [29].

**Keep (well supported by the evidence)**

- Placement after S12 (CS50x order [1]; PY4E order [5]).
- Static-first deployment with a three-row decision table. Serverless is 28% of how Python devs run cloud code [37], and FastAPI is the top Python web framework [37][33].
- The facts behind the hosting choices: Cloudflare Workers static assets [57][58]; Vercel FastAPI "looks for a `FastAPI` instance named `app`" with a 500 MB bundle limit [59]; Cloudflare Python Workers GA "Today, Python Workers are now generally available" (21 Sep 2026) [60] via `pywrangler` [61].
- `PRAGMA foreign_keys` with an error/fix pair [50]. `http.server` is labelled dev-only: "not recommended for production" [62].

**Trade-offs and unverified points**

- The weight given to HTML in analyst hiring rests on 2014–2018 data [41] and a low-credibility 2026 blog [42]. No recent peer-reviewed posting analysis was found. **Unverified for Peru specifically**: no Peru or LatAm posting analysis was found.
- No peer-reviewed study of "tutorial hell" was found; B.3 cites adjacent evidence only.
- Two catalogue pages would not render: the freeCodeCamp DA page and the Odin Python path (a fetch failure). Their claims rest on secondary pages [12][15], as noted in A.1.
- Cloudflare's docs do not state "use Workers instead of Pages for new projects" on the pages opened. They say Workers "has a distinctly broader set of features" [58]. The track's wording ("the current Cloudflare path") goes slightly beyond what was verified.

---

## Sources

1. CS50x — https://cs50.harvard.edu/x/
2. CS50x Week 8 — https://cs50.harvard.edu/x/weeks/8/
3. CS50x Week 9 — https://cs50.harvard.edu/x/weeks/9/
4. CS50 Web — https://cs50.harvard.edu/web/
5. PY4E lessons — https://www.py4e.com/lessons
6. PY4E Databases — https://www.py4e.com/lessons/database
7. Full Stack Open — https://fullstackopen.com/en/
8. FSO Part 3b, Deploying app to internet — https://fullstackopen.com/en/part3/deploying_app_to_internet (and https://fullstackopen.com/en/part3)
9. FSO Part 0b, Fundamentals of web apps — https://fullstackopen.com/en/part0/fundamentals_of_web_apps
10. FSO Part 0a, General info — https://fullstackopen.com/en/part0/general_info
11. The Odin Project, Full Stack JavaScript — https://theodinproject.com/paths/2
12. The Odin Project FAQ — https://theodinproject.com/faq
13. Odin Foundations, Landing page — https://theodinproject.com/lessons/foundations-landing-page
14. freeCodeCamp, Relational Databases certification announcement — https://freecodecamp.org/news/freecodecamps-new-relational-databases-certification-is-now-live
15. freeCodeCamp DA with Python projects (learner README) — https://github.com/sfoteini/data-analysis-python-freeCodeCamp (the official page https://www.freecodecamp.org/learn/data-analysis-with-python/ returned only metadata)
16. Data Carpentry, SQL for Ecology — https://datacarpentry.github.io/sql-ecology-lesson/
17. MIT Missing Semester — https://missing.csail.mit.edu/
18. Missing Semester 2026, Packaging and Shipping Code — https://missing.csail.mit.edu/2026/shipping-code/
19. Google Data Analytics — https://www.coursera.org/professional-certificates/google-data-analytics
20. IBM Data Analyst — https://www.coursera.org/professional-certificates/ibm-data-analyst
21. DataCamp Data Analyst with Python — https://datacamp.com/tracks/data-analyst-with-python
22. Simon Willison, PyCon 2023 Datasette publish tutorial — https://github.com/simonw/sqlite-tutorial-pycon-2023/blob/main/datasette-publish.md
23. CMU 15-445 Fall 2025 schedule — https://15445.courses.cs.cmu.edu/fall2025/schedule.html
24. Stanford CS145 Fall 2022 — https://cs145-fall22.github.io
25. UW CSE 344 Winter 2025 calendar — https://courses.cs.washington.edu/courses/cse344/25wi/calendar/calendar.html
26. RPI CSCI 4380 Spring 2025 schedule — https://www.cs.rpi.edu/academics/courses/spring25/csci4380/schedule.html
27. MDN Learn web development — https://developer.mozilla.org/en-US/docs/Learn_web_development
28. MDN Curriculum — https://developer.mozilla.org/en-US/curriculum/
29. MDN, Publishing your website — https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website/Publishing_your_website
30. web.dev Learn HTML — https://web.dev/learn/html
31. web.dev Learn HTML, Tables — https://web.dev/learn/html/tables
32. Stack Overflow 2025, Developers — https://survey.stackoverflow.co/2025/developers
33. Stack Overflow 2025, Technology — https://survey.stackoverflow.co/2025/technology
34. Stack Overflow 2025, overview — https://survey.stackoverflow.co/2025/
35. Stack Overflow blog, 2026 results — https://stackoverflow.blog/2026/10/06/the-results-of-the-2026-developer-survey-are-here/
36. Stack Overflow 2026 survey — https://survey.stackoverflow.co/2026/
37. JetBrains/PSF Python Developers Survey 2024 — https://lp.jetbrains.com/python-developers-survey-2024/
38. JetBrains, The State of Python 2025 — https://blog.jetbrains.com/pycharm/2025/08/the-state-of-python-2025
39. Anaconda, State of Data Science 2025 (PDF) — https://www.anaconda.com/wp-content/uploads/2025/10/Anaconda_2025-SODS_Final-1.pdf
40. Kaggle State of ML and DS 2022 (PDF mirror) — https://ailab-ua.github.io/courses/resources/Kaggle_State_of_Machine_Learning_and_Data_Science_Report_2022.pdf
41. Dong & Triche (2020), JISE 31(4) — https://www.jise.org/Volume31/n4/JISEv31n4p312.pdf
42. "Data Analyst Skills Companies Want in 2026" (DEV / InterviewStack) — https://dev.to/gnana_6392e836fd500a957dc/data-analyst-skills-companies-want-in-2026-2500-posting-analysis-2518
43. PyCon DE 2026, "Empowering Data Scientists with Zero Platform Friction" — https://pycon.de/archive/2026/talks/empowering-data-scientists-with-zero-platform-friction-deploying-streamlit-friends-in-3-minutes/
44. Alasmari, Singer & Bikanga Ada (ICETC 2023) — https://eprints.gla.ac.uk/317293/2/317293.pdf
45. Alghamdi, Bull & Kharrufa (arXiv 2025) — https://arxiv.org/html/2507.22671v1
46. Harms et al. (VL/HCC 2016) — https://kharms.infosci.cornell.edu/downloads/harmsk-vlhcc-2016.pdf
47. Rashkovits & Lavy (IJDMS 2021) — https://aircconline.com/ijdms/V13N1/13121ijdms01.pdf
48. Abdelaziz et al. (Frontiers in Education 2025) — https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2025.1554089/full
49. DataCamp, 5 places to host your data science portfolio — https://www.datacamp.com/id/blog/5-places-to-host-your-data-science-portfolio
50. SQLite, Foreign Key Support — https://sqlite.org/foreignkeys.html
51. OWASP XSS Prevention Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
52. Python `html` module — https://docs.python.org/3/library/html.html
53. MDN, CORS request not HTTP — https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSRequestNotHTTP
54. GitHub Pages limits — https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
55. What is GitHub Pages — https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
56. MDN, `await` — https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await
57. Cloudflare Workers static assets — https://developers.cloudflare.com/workers/static-assets/
58. Cloudflare, Migrate from Pages to Workers — https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/
59. Vercel, Deploy a FastAPI app — https://vercel.com/docs/frameworks/backend/fastapi
60. Cloudflare blog, Python Workers GA — https://blog.cloudflare.com/python-workers-ga/
61. Cloudflare, Python Workers docs — https://developers.cloudflare.com/workers/languages/python/
62. Python `http.server` — https://docs.python.org/3/library/http.server.html
