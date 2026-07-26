# Section 1 — Independent Curriculum Recovery Report

**Section:** S01
**Canonical identity:** `setup` — *Entorno reproducible y trabajo seguro*
**Active source:** `src/lib/course/sections/s01-setup.ts`
**Route/hash:** `#setup`
**Recovery rule:** Earlier Fixer reports and lost ephemeral changes were not accepted as completion evidence. Every finding below was reproduced from current source, the deployed surface, executable examples, or the authenticated bank.

## 1. Scope and evidence

The independent pass covered every learner-facing S01 surface:

- metadata, job framing, seven outcomes and every theory paragraph/callout;
- eight subtopics (`S01-T1-A` through `S01-T4-B`);
- eight I Do demonstrations;
- 24 We Do exercises (guided, independent and transfer for every subtopic);
- You Do / CP-N1-A skeleton, rubric, retrospective and portfolio bridge;
- eight public self-check questions and four topic evaluations;
- 24 authenticated questions (eight concepts × three variants);
- the `setup` playground, progress-PDF label and production static bundle;
- current official Python, PyPA, Git and Ruff documentation.

The 13 supplied research reports were read as pedagogical context. Several are stale, speculative or identify a different topic, so they were used only for general checks such as gradual release, cognitive load, chunking, transition quality and constructive alignment. They were not treated as proof about current S01.

Current primary references checked:

- [Python `venv` documentation](https://docs.python.org/3/library/venv.html): `.venv`/`venv` convention, isolation, disposability and exclusion from source control.
- [PyPA virtual-environment guide](https://packaging.python.org/guides/installing-using-pip-and-virtual-environments/): `.venv`, activation, interpreter verification and requirements workflow.
- [Git `init` documentation](https://git-scm.com/docs/git-init): the initial branch is configurable and cannot safely be assumed to be `main` without `-b main`.
- [Ruff configuration](https://docs.astral.sh/ruff/configuration/): repository configuration and `pyproject.toml` behavior.

## 2. Paragraph, exercise and assessment graph

| Topic | Theory contract | I Do | We Do | Assessment / transfer |
|---|---|---|---|---|
| T1-A | interpreter, REPL, script/entrypoint | interpreter + REPL transcript | REPL → script → machine transfer | topic evaluation + public/auth bank |
| T1-B | terminal, cwd/PATH, exit codes, argv | observable `0`/`1` processes | inspect → implement → diagnose | topic evaluation + public/auth bank |
| T2-A | isolated `.venv`, activation, recreation | create/activate/inspect prefix | create → recreate → OS runbook | topic evaluation + public/auth bank |
| T2-B | `python -m pip`, freeze, `install -r` | install/freeze/import | snapshot → clean replica → forensics | topic evaluation + public/auth bank |
| T3-A | commits, diffs, history | initialized `main`, two commits, `git show` | commit → narrate diff → choose message | topic evaluation + public/auth bank |
| T3-B | feature branches, PR, safe recovery | local branch first; remote explicitly optional | branch → PR prose → restore/stash | topic evaluation + public/auth bank |
| T4-A | Ruff config and check/fix loop | F401 → correction → exit 0 | config → executable cleanup → policy | topic evaluation + public/auth bank |
| T4-B | ignore, secrets, README, synthetic data | ignore/example/README evidence | ignore → safe example → clean-machine checklist | topic evaluation + public/auth bank |

The You Do consumes all eight nodes in a clonable CP-N1-A skeleton; it does not introduce a new untaught programming concept.

## 3. Fresh issue ledger

| ID | Severity | Fresh evidence | Impact | Resolution |
|---|---|---|---|---|
| S01-R01 | P1 | First-use audit reported `entorno virtual` and `Git` in `jobRelevance` before an inline definition | Day-one learners meet two core terms before meaning | Added concise first-use definitions in the job frame; audit now reports P0=0, P1=0 |
| S01-R02 | P1 | Authenticated bank positions were `1/21/2/0` across indices 0–3 | A learner could pass by choosing the second option | Hand-reordered all 24 arrays to `6/6/6/6`; each three-variant concept uses three positions and every attempt slice is `2/2/2/2` |
| S01-R03 | P1 | Public self-check positions were `2/3/2/1` | Smaller but still observable positional cue | Reordered the final question to produce `2/2/2/2` |
| S01-R04 | P1 | Theory/I Do/We Do initialized with bare `git init`, but later required `git switch main`; official Git docs confirm the initial name is configurable | Fresh machines may create `master`, breaking the advertised copy-paste path | Changed the instructional path to `git init -b main`; the focused test executes it in a temporary clean repo |
| S01-R05 | P1 | T3-B code unconditionally ran `git push -u origin …` and claimed success even though its own preamble allowed no remote | Copy-paste fails on the local-only path and code/output disagree | Made the local branch check executable; push/PR commands are explicitly conditional on `origin` |
| S01-R06 | P1 | Ruff solution had only one blank line around a module-level function under `select = ["E","F","I"]` | The advertised “All checks passed” solution violates E302/E305 | Added correct module-level spacing to starter and solution; focused regression protects it |
| S01-R07 | P1 | Browser playground taught age arithmetic rather than S01’s interpreter/script contract | The live practice introduced S02-style arithmetic instead of reinforcing S01 | Replaced it with an executable `sys` + `main()` entrypoint lab and exact output |
| S01-R08 | P2 | PDF progress label was `1. Setup`, while the learner-facing identity is Spanish | Progress export drifted from the course identity | Changed only the `setup` mapping to `1. Entorno` |
| S01-R09 | P2 | `Interprete`, `el convención`, `commitea`, `commitees`, `commitear/pushear`, and one English rubric phrase remained | Avoidable Spanish friction on a beginner surface | Corrected the confirmed S01-owned instances without broad prose rewriting |

## 4. Gradual release and language verdict

- **Theory:** Every subtopic establishes an anchor, mechanism, real command/example, boundary and bridge.
- **I Do:** Eight current demonstrations match the eight subtopics and explain why the observed output matters.
- **We Do:** Every subtopic has E1 guided, E2 independent and E3 transfer work with preamble, success contract, limits, two hints, edge cases, tests, feedback and retrospective.
- **You Do:** The CP-N1-A skeleton combines only taught S01 contracts and states that the intake validator arrives later.
- **Self-check/exam:** Public and authenticated surfaces cover runtime, paths, venv, pip, Git, PR/recovery, Ruff and secret hygiene without position shortcuts.
- **Spanish:** The existing Fernández-Huerta baseline is broadly readable for technical Spanish. Manual review rejected code-driven false positives such as `$?`; confirmed first-use, accent, agreement and anglicized-verb defects were corrected. Teacher voice remains consistent with the course’s direct `tú` register.
- **Accessibility:** The playground has deterministic text output; theory remains compatible with the glossary hover/focus renderer; the nonvisual progress label is now Spanish and section-aligned.

## 5. Changes made

- Hand-edited S01 prose only where a current defect was independently confirmed.
- Repaired the real Git and Ruff execution paths.
- Replaced the section-owned browser playground and PDF label.
- Hand-reordered the 24 authenticated options and one public self-check option.
- Added `tests/adversarial/test_s01_independent_recovery.py` to protect identity, eight-subtopic GRR coverage, first-use definitions, clean Git initialization, playground output, public/authenticated assessment distributions and Ruff spacing.
- Did not modify the canonical campaign inventory or accept an earlier Fixer report as proof.

## 6. Validation evidence

| Gate | Result |
|---|---|
| `python3 -m unittest tests.adversarial.test_s01_independent_recovery -v` | **PASS** — 8/8 focused tests |
| `python3 scripts/s01_first_use_audit.py` | **PASS** — P0=0, P1=0, 12 tracked first uses |
| `python3 scripts/s01_glossary_coverage.py` | **PASS** — 24/24 seed terms covered; 150 aliases |
| `python3 scripts/python_content_runtime_audit.py --only s01-setup --workers 1` | **PASS** — 9 pass, 0 fail; P0=0, P1=0 (59 shell/markdown/static artifacts classified as non-Python skips) |
| Authenticated distribution | **PASS** — 24 items, 8 concepts × 3, global `6/6/6/6`, every attempt `2/2/2/2`, three distinct positions per concept |
| Public self-check distribution | **PASS** — 8 items, `2/2/2/2` |
| Executable focused paths | **PASS** — playground exact stdout; clean temporary Git repo starts on `main` and commits successfully |
| `npm run test:v3` | **PASS** — 52 sections; S01 remains 8 demos / 24 exercises; no invariant warnings |
| `npm run test:exam-pedagogy` | **PASS** — 1,248 questions, 416 concepts; P0=0, P1=0 |
| `npx tsc --noEmit` | **PASS** |
| `npm run lint` | **PASS** |
| `npm run build:static` | **PASS** — production compilation and 3/3 static pages |
| Static bundle inspection | **PASS** — generated page chunk contains the new S01 playground and `1. Entorno` mapping |
| Local static HTTP | **PASS** — exported root returned HTTP 200 with the PyArcana shell and S01 sidebar identity |

Validation scripts regenerated five fleet-wide JSON artifacts. All five were restored before staging; their metrics are recorded here only.

## 7. Residuals and deliberate non-changes

- Browser Python cannot create a local OS virtual environment or Git repository, so the playground reinforces the script/interpreter/entrypoint node; the real shell operations remain in Theory, I Do and We Do.
- Shell/PowerShell syntax varies by OS. The section already supplies both activation paths and explicitly labels the bash-only exit-code examples.
- The stable `setup` id and historical filename remain unchanged for progress, exams and deep-link compatibility.
- Current source still uses established industry nouns such as `commit`, `pull request`, `shell`, `smoke` and `freeze`, with definitions or operational context. The recovery did not perform a stylistic bulk rewrite.
- No unresolved S01 P0 or P1 issue remains.

## 8. Completion statement

Section 1 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
