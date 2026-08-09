# Section 1 — Independent text-first remediation report

## 1. Scope and evidence boundary

- **Section:** S01, `setup` — *Entorno reproducible y trabajo seguro*
- **Product source:** `src/lib/course/sections/s01-setup.ts`
- **Baseline:** deployed correctness pass at the branch base; correctness was preserved, not accepted as proof of prose quality.
- **Evidence read:** master campaign prompt; S01 Explorer, expert, Spanish, paragraph and exercise-pedagogy audits; grammar subplan; current source; public/authenticated assessment blocks; shared worklog; the supplied S01 deep-research report.
- **Research caveat:** the supplied deep-research report incorrectly assumed S01 was cryptography and admitted that it could not inspect the current content. It was used only for generic principles such as chunking, gradual release and explicit transitions.
- **Scope lock:** S01 learner prose, one S01-focused text regression, this report and the S01 worklog only. No other section, shared parser, bank order, playground or PDF mapping was changed.

## 2. Fresh issue ledger

| ID | Severity | Current evidence | Learning impact | Resolution |
|---|---|---|---|---|
| S01-TEXT-01 | P1 | Job frame used unsupported percentages, named local employers and a threatening probation claim | Narrow framing and unverifiable motivation before the first concept | Replaced with an international distributed-team use case and an observable reproducibility chain |
| S01-TEXT-02 | P1 | Several theory blocks opened with tool definitions or command lists before explaining the problem | Novices could memorize syntax without a causal model | Rewrote all 13 theory/nested-block openings with concise use cases, prerequisite bridges and mental models |
| S01-TEXT-03 | P1 | I Do preambles modeled commands but did not consistently ask learners to predict output | Reduced generation effect; demos risked passive copying | All 8 I Do preambles now require a prediction and name the evidence to compare |
| S01-TEXT-04 | P1 | I Do retrospectives often repeated a rule and announced We Do | Weak misconception repair and self-explanation | All 8 now distinguish evidence, repair a misconception and bridge to practice |
| S01-TEXT-05 | P1 | The 24 We Do retrospectives followed a repeated “rule / misunderstanding / auto-check / transfer” shell | Metacognition felt templated despite technically distinct exercises | Hand-rewrote all 24 around the mechanism specific to that exercise |
| S01-TEXT-06 | P1 | Remaining prose included unsupported `90 %`, `80 %`, “3–5 GB”, “causa #1” and narrow Peru/bank generalizations | Claims sounded authoritative without evidence and dated the lesson | Removed the claims; stated scope and trade-offs without invented prevalence |
| S01-TEXT-07 | P1 | You Do asked for an indefensible “smoke in <10 min” impact claim | Encouraged a metric without measured evidence | Reframed defense around executable evidence a recipient can reproduce |
| S01-TEXT-08 | P2 | Self-check explanations mostly restated the correct option | Retrieval feedback did not fully expose the causal model | Rewrote all 8 explanations to compare alternatives, evidence and operational consequences |

## 3. Learner-visible coverage

| Surface | Coverage | Material change |
|---|---:|---|
| Job frame | 1/1 | International collaboration story; inline novice definitions and evidence chain preserved |
| Theory / nested subsections | 13/13 | Every opening now moves use case → causal model → command/mechanism |
| I Do | 8/8 | Prediction prompt before code plus misconception repair and forward bridge |
| We Do | 24/24 | Distinct metacognitive retrospective for each guided, independent and transfer activity |
| You Do | 1/1 | International intake context and defensible handoff questions |
| Public self-check | 8/8 | Expanded causal feedback; answer positions unchanged |
| Authenticated bank | 24/24 audited | No edit required: 8 concepts × 3, `6/6/6/6`, every attempt `2/2/2/2`; current prompts remain aligned |
| Topic evaluations | 4/4 audited | No correctness or leakage defect found; existing executable criteria retained |

## 4. Before / after evidence

### Job relevance

**Before**

> “El 90 % de los problemas… En empresas peruanas como… Si te trabas ahí, no pasas la semana de prueba.”

**After**

> “Imagina tu primer día en un equipo distribuido: una colega en Nairobi, otra en Berlín y tú deben ejecutar el mismo proyecto y obtener el mismo resultado… El objetivo no es «instalar cosas», sino construir una cadena de evidencia.”

The new opening motivates reproducibility without invented prevalence, employer claims or fear.

### Theory: interpreter

**Before**

> “Con el diccionario en mente, pasamos al primer objeto real del día: el intérprete. Cuando instalas Python…”

**After**

> “Un texto de Python no se ejecuta por sí solo, del mismo modo que una partitura no produce música sin intérprete… la primera pregunta no es «¿mi código está bien?», sino «¿qué Python está leyendo este código?».”

The analogy leads directly into the mechanism and diagnostic question.

### I Do: virtual environment

**Before**

> “Un proyecto de equipo necesita una caja hermética de dependencias. En esta demo creo `.venv`…”

**After**

> “Ya sabes identificar al intérprete; ahora vas a darle una frontera por proyecto. Antes de ejecutar, predice qué cambiará al activar `.venv`: ¿la carpeta del repo, la ruta de `python`, `sys.prefix` o las tres?”

The learner must generate a prediction before seeing the worked output.

### We Do: import diagnosis

**Before**

> “El 80 % de tickets de setup son PATH o wrong interpreter…”

**After**

> “No confundas cuatro hechos: el ejecutable existe, el cwd contiene el archivo, el paquete está instalado y este intérprete puede importarlo… Si `pip` terminó bien pero otro Python ejecuta el script, no hay contradicción: hay dos entornos.”

The revised reflection teaches a diagnostic graph instead of an unsupported statistic.

### You Do

**Before**

> “Una frase de impacto medible… ‘clon → smoke en <10 min’…”

**After**

> “Defiende la entrega como si no pudieras ayudar a quien la recibe… Si alguna respuesta depende de «yo le explicaría», aún falta documentación.”

The new criterion asks for evidence already generated by the work rather than an invented performance claim.

## 5. Correctness and anti-aberration preservation

- Canonical `setup` identity, 8 subtopics, 8 demos and 24 exercise IDs remain unchanged.
- The learner-packet parser still resolves 24 unique IDs in canonical order.
- The `check_arg.py` typed entrypoint, clean `git init -b main`, Ruff spacing, playground and PDF identity remain protected by the deployed focused suite.
- Public self-check positions remain `[0,2,3,1,0,2,3,1]`.
- The authenticated bank remains 24 items, `6/6/6/6` overall and `2/2/2/2` per attempt.
- No source code, starter, solution, expected output, answer option order or correct index changed in this pass.
- Generated audit JSON is restored before staging.

## 6. Validation evidence

| Gate | Result |
|---|---|
| `python3 -m unittest tests.adversarial.test_s01_text_first_prose tests.adversarial.test_s01_independent_recovery -v` | PASS — 14/14 |
| `python3 scripts/s01_first_use_audit.py` | PASS — P0=0, P1=0 |
| `python3 scripts/s01_glossary_coverage.py` | PASS — 24/24 terms |
| `python3 scripts/python_content_runtime_audit.py --only s01-setup --workers 1` | PASS — 9 pass, 0 fail, 59 classified skips |
| `node scripts/rebalance_selfcheck_positions.mjs --from 1 --to 1` | PASS — required cycle unchanged |
| `python3 scripts/exam_selfcheck_pedagogy_audit.py` | PASS — 1,248 questions, 416 concepts, P0=0/P1=0 |
| `npm run test:v3` | PASS — 52 sections; S01 8 demos / 24 exercises |
| `npx tsc --noEmit` | PASS |
| `npm run lint` | PASS |
| `npm run build:static` | PASS — production compile, TypeScript and 3/3 static pages |
| Static bundle inspection | PASS — international opener, You Do bridge and practice retrospectives are present |
| Spanish heuristic audit (`--from 1 --to 1 --no-lt`) | Reviewed manually; automated false positives around code tokens were not treated as edits |
| Full Python adversarial suite | 124 tests run; 81 inherited failures remain in other sections/contracts; no S01 failure |

## 7. Residuals and deliberate non-changes

- Platform-specific commands remain duplicated where the distinction is necessary for Windows vs. Unix; removing them would reduce, not improve, novice usability.
- Technical nouns such as `commit`, `pull request`, `smoke`, `freeze` and `entrypoint` remain because the section defines or operationalizes them.
- The authenticated bank was not rewritten merely to create diff volume: independent inspection found its current questions aligned, balanced and free of the prose defects repaired above.
- Shell and markdown artifacts remain classified rather than executed as Python by the runtime auditor.

Section 1 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
