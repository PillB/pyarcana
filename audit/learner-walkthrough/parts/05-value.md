## 5. Value to a paying client

Judged as Lucía: paying monthly from a modest salary, aiming at a first data job in Lima. Each
level verdict draws on its sections' "Value" lines (§3) and the capstone checks below. These are
judgements: **[I]** unless marked.

### 5.1 Per level

| Level | Sections | What she gets that is genuinely valuable | Where she is shortchanged | Verdict |
|---|---|---|---|---|
| **L1 Fundamentos Guiados** | S01–S13 | Rare, job-relevant discipline from day one: reproducible environment and Git hygiene (S01), raw/clean traceability and `Decimal` for soles (S02), None ≠ 0 and tri-state validation (S03), honest denominators (S04), quarantine plus a reconciling manifest (S08), PII-safe logging (S09), «score ≠ veredicto» and abstention (S13). Unicode for Peruvian names (S07) is better than most paid courses. Section-level verdicts: 6 fulfilled, 7 mixed, 0 shortchanged. | Practice outruns teaching (loops, `try/except`, classes and regex used before they are taught: S02–S05, S07, S09). Graded material contradicts itself (S03, S04, S07, S08). S10's You Do arrives already written. S12 is her first SQL but never explains `SELECT/WHERE/JOIN`. The level closes on a templated exam she cannot reach (W02, W09) and a capstone with placeholder tests. | **Mostly fulfilled on content, shortchanged on practice and closure.** For this persona it is the best-value level. |
| **L2 Práctica Aplicada Independiente** | S14–S26 | The analyst core: NumPy, pandas dtypes and coercion reports (S14–S15), cleaning judgement (S16), joins with fan-out/anti-join and as-of leakage (S17), EDA with p-hacking and peeking measured (S18, "better than most paid bootcamps"), honest charts with WCAG (S19), Excel/report/email automation with human approval (S20–S22). | S15 is written for pandas 3, never tells her to install it, and its graded project fails if she follows the lesson. S16 parses Peruvian money 1000× wrong. S19 gives little plotting practice and its playground is a SyntaxError (W12). S23 «Browser RPA con Playwright» never runs Playwright, S24 «OCR» never touches an image, S25 «Endpoints de IA» never calls a model. Answer keys are B throughout, with wrong keys in S18, S19 and S21. | **Mixed.** S14–S19 are the heart of a data-analyst course and mostly deliver; S23–S25 are titled for tools they don't use. |
| **L3 Integración y Evaluación Avanzada** | S27–S39 | Testing judgement (oracle problem, mutants, S27; metamorphic and golden tests, S28), real SQL interview material (windows, anti-joins, plans, S29), entity resolution with measured blocking (S30), metrics/calibration/thresholds under capacity (S34), fairness with n beside every metric (S35). | Mostly flag-and-dict simulations: no fitted model in the "supervised ML" section (S33), no `KMeans`/`PCA`/`IsolationForest` run in S36, no pytest run in the pytest section (S27). You Do checks that cannot fail (S37) or fail correct code (S32). Gates grade different products than their sections build (S30→CP-N3-A, S34→CP-N3-B, S39→CP-N3-C). | **Mixed, leaning shortchanged.** The ideas are interview-grade; the hands-on volume for 118 estimated hours is thin. |
| **L4 Sistemas de Producción Gobernados** | S40–S52 | Sound production thinking: ADRs and bounded contexts (S40), HTTP contracts (S41), SSRF/authz (S42), pinning and supply chain (S43–S44), idempotent queues (S45), evals and red teaming (S50), observability and incident response (S51). Runs without paid API keys (readings S48–S50). | Far from her goal of a first analyst job: SRE/platform material taught by simulation. S41 «APIs con FastAPI» never shows FastAPI. S43/S44 need Docker, a second reviewer and a deployed service that the course never sets up. You Dos are checklists of self-typed `True`s (S47, S51, S52). The S52 playground teaches fabricated CV metrics («salvando S/2M anuales»). | **Shortchanged for this persona** (it targets another job), and mixed on its own terms. |

**Overall [I].** A paying beginner gets a course with an unusually mature *conscience*:
privacy, abstention, «score ≠ culpa», honest denominators and fail-closed are taught everywhere,
better than in most paid alternatives. She is shortchanged on *doing*:
- **Practice is read-only.** She can type and run code in one off-topic playground per section; We Do
  is read-the-solution (W05).
- **Assessment does not measure skill.** Exams can't be reached, and where they exist «always B»
  passes (W02, W09).
- **Projects don't connect.** Capstones grade products the sections never build.
- **Credentials can't be earned.** Badges either can't be earned or would certify the wrong skills
  (§4).
- **Effort is not rewarded.** Finishing a section can silently un-finish it (W01).

### 5.2 Would she feel accomplished by the projects?

**[I] Partly, during L1–L2; less after.** The You Do projects with real files and a reconciling
manifest (S08, S17, S20–S22) produce something she can open and show. Too many others end in:
- a starter that is already the solution (S10, S36, S42),
- a check that passes before she writes a line (S13, S20, S26, S37),
- checks that fail correct code (S15, S32),
- a list of self-typed `True` values (S40, S47, S51, S52).

Each of those takes away the feeling of having *made* it. The capstones are where accomplishment
should peak, and §5.3 shows why it doesn't.

### 5.3 Portfolio check: would the projects read well on GitHub?

Judged as a recruiter or a client in Lima opening the repository. Detailed per-capstone evidence
is in the "Capstone checks from the readings" below; the source is `course-state/capstones/CP-*/`.

| Capstone | Gate | README | Tests | Data | Deploy / demo | Reads well? |
|---|---|---|---|---|---|---|
| CP-N1-A Admisión de clientes (CLI) | S04 | 3-line STARTER README | 5 of 6 `assert True` placeholders | 3 generic records, same generator as B and C | stdout JSON | **No.** Strong idea (correct denominators). |
| CP-N1-B ETL con cuarentena y manifiesto | S08 | same | 5/6 placeholders | same toy file; no `clients.csv`/`transactions.json` as briefed | stdout JSON | **No.** Strong idea (idempotent manifest). |
| CP-N1-C Tablero de evidencia de familiaridad | S13 | same | 5/6 placeholders | same | reference `demo.py` contradicts S13's formulas and hard-codes `"status": "pass"` | **No.** |
| CP-N2-A Portafolio EDA | S17 | same | 5/6 placeholders | toy | no rendered report | **No.** The brief is exactly what an analyst portfolio needs. |
| CP-N2-B Fábrica de reportes accesible | S21 | same | 5/6 placeholders | toy | no rendered artifact | **No.** |
| CP-N2-C RPA + analista IA con aprobación | S26 | same | 6/7 placeholders | toy | reference sets `approved = True` without a human | **No.** |
| CP-N3-A Resolución de entidades | S30 | same | 7/8 placeholders | 5 hand-typed records | fails its own P0s | **No.** |
| CP-N3-B Grafo de relaciones | S34 | same | 6/7 placeholders | 5 nodes | fails its own P0s | **No.** |
| CP-N3-C Triaje responsable con ML | S39 | same | 8/9 placeholders | toy | "model" scores 1.0 on labels it generated (leakage, its own P0) | **No.** |
| CP-N4-A Servicio Python gobernado | S43 | same | 7/8 placeholders | toy | no Dockerfile, no rate limiting, no migrations | **No.** |
| CP-N4-B Plataforma de datos y ML | S47 | same | 7/8 placeholders | toy | fails 3 of its 4 critical criteria | **No.** |
| CP-N4-C Copiloto multi-agente auditable | S51 | none at top level | **47 real tests**, 21 adversarial pass | synthetic corpus | `RUN.md` names files that don't exist (`RAG.py`, `incidente.py`) | **Yes, after the run instructions are fixed.** |
| CP-FINAL Plataforma integrada | S52 | none at top level | 31 tests, but quality flags are constants (`entry["redacted"] = True`) | synthetic | «Licencia: uso interno de capacitación únicamente» | **No.** A technical reviewer stops trusting it at `triage.py`. |

**Portfolio verdict [I].** As shipped, **1 of 13** capstones would read well on a GitHub profile.
For Lucía's target (a junior data-analyst role in Lima) none shows what a recruiter screens for
first: SQL against a real-shaped dataset, a pandas notebook or script with a chart, and a
dashboard. The briefs, though, are portfolio-grade, especially CP-N1-B, CP-N2-A, CP-N2-B, CP-N3-A
and CP-N3-C. What each one is missing is concrete and the same every time:
1. A Spanish README: problem, how to run, sample output, limits, what she did.
2. Real fixtures that match the brief.
3. One real test per `tests_required`.
4. One rendered artifact: an HTML report, a chart, a case sheet or a confusion table.
5. A licence.
6. For L4, a free deploy path (Codespaces/Docker instructions for Windows, or a static demo).

**Proposed fix:** `course-state/capstones/_generate_formal_packages.py`. Generate real tests from
`RUBRIC.json.tests_required` and per-capstone fixtures from each BRIEF's «Datos». Add a README
template and an MIT/CC-BY `LICENSE`. Compute `tests_pass` from a real run. Regenerate BRIEF
prerequisites from current section titles. Then connect each gate section's You Do to its capstone
interface, so that finishing the section *is* the first commit of the capstone.
