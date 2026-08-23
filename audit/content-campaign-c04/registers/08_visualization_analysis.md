# Where a figure earns its place — all 52 lessons

**Date:** 2026-08-22 · **Campaign:** content-campaign-c04

## The rule used to decide

A figure is built only when it **removes work the prose is doing badly**. Mayer's
coherence principle is explicit that a diagram which merely accompanies text
costs attention rather than saving it, so "this section could have a picture" is
not a reason.

The strongest available signal turned out to be in the prose itself: **30 of 52
sections already reach for a spatial analogy** — *"una fila de puertas"*,
*"Imagina una cinta transportadora"*, *"una ventanilla"*, *"el catálogo de una
biblioteca"*, *"una e seguida de una tilde suelta"*. Each of those is an author
drawing a diagram in words because there was no way to draw it. That is
evidence, not taste, and it drove the selection.

Three principles set the treatment:

- **Spatial contiguity** — the figure renders between the prose it explains and
  the code that follows, never in a gallery. This is why `figure` is a field on
  `TheoryBlock` and not a section-level array.
- **Signalling** — one thing is highlighted per figure (the shared cell, the
  suspect column, the wide interval). Everything else is quiet.
- **Segmenting** — no figure carries two ideas. Where a concept had two, the
  second stayed in prose.

The Spanish *género didáctico* convention reinforces the same thing: define at
the point of need, in plain language. Figure captions therefore carry the
teaching point and never restate the paragraph above them.

---

## Verdicts, S01–S52

`BUILT` = shipped in this pass · `CANDIDATE` = real opportunity, not built ·
`PROSE` = prose already does the job, a figure would decorate

| # | Section | Concept under strain | Verdict | Figure type |
|---|---|---|---|---|
| S01 | Entorno reproducible | `cwd` vs `PATH` — two questions that both answer with a path | **BUILT** | side-by-side: place vs search order |
| S02 | Valores, tipos, I/O | `42` vs `"42"`; `=` vs `==` | CANDIDATE | two boxes, same glyphs, different type tag |
| S03 | Decisiones y validación | the row of doors → accept/reject/review | **BUILT** | funnel with three exits |
| S04 | Iteración y resúmenes | the denominator trap | **BUILT** | conveyor + two rate cards |
| S05 | Funciones y contratos | pre/post vs body | **BUILT** | contract window |
| S06 | Colecciones | three structures, three questions | **BUILT** | three cards side by side |
| S07 | Texto y Unicode | NFC vs NFD | **BUILT** | two byte strips |
| S08 | Archivos e ingesta | `n_in == n_clean + n_quarantine` | **BUILT** | balancing split |
| S09 | Excepciones y logging | fail-fast vs quarantine — *which* failure stops the run | CANDIDATE | two-branch decision |
| S10 | Packaging y CLI | config precedence: default → file → env → flag | CANDIDATE | precedence stack |
| S11 | OOP y dominio | invariants checked at construction | PROSE | — |
| S12 | APIs, SQL, geodatos | retry/backoff on transient vs permanent | CANDIDATE | status-code decision tree |
| S13 | Evidence dashboard | blocking narrows the candidate pairs | CANDIDATE | all-pairs vs blocked grid |
| S14 | NumPy | **view vs copy** | **BUILT** | shared memory block |
| S15 | Pandas | DataFrame = columns aligned by Index | **BUILT** | annotated table with dtypes |
| S16 | Calidad y contratos | quarantine table with reasons | PROSE | — |
| S17 | Joins y reshape | wide ↔ long; join fan-out | CANDIDATE | **highest unbuilt value** — before/after shapes |
| S18 | EDA e incertidumbre | a number vs a number with its interval | **BUILT** | two intervals on one axis |
| S19 | Visualización | chart choice encodes the comparison | PROSE | (section is itself about charts) |
| S20 | Excel | — | PROSE | — |
| S21 | Documentos y reportes | template → rendered artifact | PROSE | — |
| S22 | Email y aprobación | human-in-the-loop gate | CANDIDATE | approval state machine |
| S23 | Browser RPA | selector brittleness over time | PROSE | — |
| S24 | OCR | pixels → fields → confidence | CANDIDATE | extraction pipeline with confidence |
| S25 | Endpoints de IA | prompt → output → eval loop | CANDIDATE | loop diagram |
| S26 | Orquestación | five parts becoming a system | CANDIDATE | component map |
| S27 | Pytest | test pyramid / what each layer catches | CANDIDATE | layered pyramid |
| S28 | Property tests | example-based vs property-based coverage | CANDIDATE | coverage-space sketch |
| S29 | SQL avanzado | window functions over partitions | CANDIDATE | partitioned rows |
| S30 | Entity resolution | blocking + threshold + clerical queue | CANDIDATE | shares S13's shape |
| S31 | Grafos | entity graph vs relationship claim | CANDIDATE | small graph |
| S32 | Feature engineering | **leakage across the split boundary** | CANDIDATE | strong: timeline with a boundary violated |
| S33 | ML supervisado | model vs baseline | CANDIDATE | paired bars |
| S34 | Métricas y umbrales | threshold sweeping precision/recall | CANDIDATE | confusion matrix moving with the cut |
| S35 | Explicabilidad | explanation ≠ accusation | PROSE | — |
| S36 | Clustering y validación temporal | **rolling-origin validation** | CANDIDATE | strong: repeated train/test windows |
| S37 | Profiling | where the time actually goes | CANDIDATE | flame-style bar |
| S38 | Concurrencia | checkpoint + idempotent retry | CANDIDATE | resumable timeline |
| S39 | Case triage | — | PROSE | — |
| S40 | Arquitectura y DDD | bounded contexts | CANDIDATE | context map |
| S41 | FastAPI | request → validation → handler | PROSE | — |
| S42 | Schemas y privacidad | trust boundary | CANDIDATE | boundary diagram |
| S43 | Contenedores | image layers | CANDIDATE | layer stack |
| S44 | CI/CD | supply chain provenance | CANDIDATE | build → attest → deploy |
| S45 | Cloud y colas | queue, retry, DLQ | CANDIDATE | queue with dead-letter branch |
| S46 | Ingeniería de datos | **event time vs processing time** | CANDIDATE | strong: two clocks, late arrival |
| S47 | MLOps | experiment → registry → serving | CANDIDATE | lineage chain |
| S48 | RAG | retrieval grounding a claim | CANDIDATE | claim ← evidence links |
| S49 | Agentes | tool loop with idempotency keys | CANDIDATE | agent loop |
| S50 | Evals y red teaming | eval matrix | PROSE | — |
| S51 | Observabilidad | the copilot's failure surface | PROSE | — |
| S52 | Capstone final | twelve parts into a platform | CANDIDATE | system map |

**Totals:** 10 BUILT · 30 CANDIDATE · 12 PROSE.

The twelve `PROSE` verdicts are deliberate. S19 is a section *about* charts and
does not need a chart explaining charts; S11's invariants are already concrete
in code; S50's eval matrix is a table, and a table is what it should stay.

### Best unbuilt opportunities, in order

1. **S17 wide ↔ long and join fan-out** — reshape is famously resistant to
   prose, and the section already explains fan-out ("más filas que antes") in
   words alone.
2. **S32 leakage across the split boundary** — the concept is literally a
   timeline with a line crossed.
3. **S36 rolling-origin validation** — repeated windows are a picture.
4. **S46 event time vs processing time** — two clocks, one late arrival.

---

## The `/eli5` evaluation

Installed from [dreambigou/ELI5](https://github.com/dreambigou/eli5) (MIT) after
reading `SKILL.md`: it is a single prompt file with no scripts, so installing it
executes nothing.

**Finding: it does not produce diagrams.** The widely-shared description of an
Anthropic `/eli5` that emits "an HTML artifact with big pictures" describes a
different variant. This skill is purely audience-tuned *prose* — age, role and
relationship tables that adjust tone, vocabulary and analogy.

**Where it does help:** its Step 3 pushes hard for a concrete analogy, and a
good analogy is a diagram brief. Run on S07's Unicode problem it produces the
sticker image — one sticker of "é" versus a sticker of "e" plus a separate
accent — which is exactly the figure that shipped.

**Where it conflicts with this repo, and why it is not in the pipeline:**

- it instructs *"default to Age 5"* and *"getting the core idea across at 80 %
  accuracy is better than a 100 % accurate explanation"*. The Handcrafted
  Writing Protocol and the repo's own no-overclaim gates forbid exactly that
  trade;
- it is English-first, with analogy tables built on US-centric references;
- its audience calibration is a thinner version of what the protocol already
  specifies in more depth.

**Verdict:** keep installed as an optional drafting aid for *generating analogy
candidates* on sections whose prose has not yet been through the protocol.
Nothing it emits ships verbatim, and its accuracy-for-simplicity instruction is
explicitly overridden by the protocol.

---

# Rendered review of the ten SVG figures (passes 2–4)

Measured with `scripts/figure_render_probe.mjs`, which the existing forensic
capture could not do: that harness measures HTML boxes and cannot see inside an
`<svg>`, so a diagram can pass every existing gate while its labels overlap.

**Every figure, every viewport, both themes: 0 clipped labels, 0 overlapping
labels.** The five defects that would have caused those were caught during
authoring, before the review ran:

| figure | defect caught |
|---|---|
| S05 | right-hand box ended at x=562 on a 560 canvas — off-canvas |
| S14 | annotation crossed the arrow it annotated |
| S04 | "de decidir" landed inside the denominator card |
| S18 | axis unit collided with the last tick; caption reached x=559 of 560 |
| S06 | three cards ended at x=556 — 4px is not a margin |

## Two numbers that need stating plainly

| | desktop 1440 | mobile 390 | stress 320 |
|---|---|---|---|
| viewBox scale | 1.000 | 0.821 | 0.821 |
| smallest rendered label | 13.0px | **10.7px** | **10.7px** |
| scroll inside the frame | 0px | **224px** | 294px |

The type floor is **10.7px, not the ~11.5px predicted** — the estimate used the
14px label size, but the smallest type in a figure is the 13px micro size, and
13 × 0.821 = 10.7. That is small for sustained reading; it is defensible for a
diagram label, and it is the honest number.

At 390px the figure column is roughly 236px holding a 460px figure, so the
learner scrolls about twice the visible width. The **page** never scrolls, which
was the design goal, but the in-frame scrolling is a real cost. The options are
to accept it, author mobile-specific viewBoxes, or reduce information density
per figure. Not decided here.

## A defect that is not ours

The probe initially reported a uniform 66px page-level horizontal scroll at
320px on all ten figures. Identical across every figure and both themes — which
was the tell. A section with **no figure at all** overflows the same 66px
(`basics`), and `testing` overflows **202px**. It is pre-existing header chrome:
a `flex items-center gap-1` button row 244px wide.

The probe now separates `figureOverflow` (indicts the figure) from
`pageOverflow` (recorded as context). **PyArcana's page chrome overflows at
320px independently of this work** and deserves its own fix.

---

# React Flow, prototyped on S31

Installed `@xyflow/react` 12.11.3 to judge the trade concretely.

**Where it earns the dependency:** S31 teaches that *"un camino explica cómo dos
entidades están conectadas en los datos. No prueba parentesco ni colusión"*. The
fixture makes that unarguable — Ana Q. → Luis M. is one hop on a direct
transfer; Ana Q. → Oficina Lima → Marta R. is two hops on a phone shared by an
entire office. Both would be reported as "connected". Clicking a target prints
the path, the hop count and the evidence per edge with its strength. That is a
comparison you cannot make with a static picture.

**Measured costs:**

- a **second, nested copy of zustand@4** (the repo runs v5), because xyflow pins `^4.4.0`;
- a required CSS import and an explicit container height;
- nodes are divs, so the SVG-text probe cannot see them — it needed a `kind: 'dom'` branch, and the figure-static test needed kind-aware assertions rather than a weakened shared one.

**Installation incident, recorded because it cost real time.** `npm install` in a
repo whose `packageManager` is **bun@1.3.4** pruned `@swc/helpers`, and every
page began returning HTTP 500 — which is what several "probe timeouts" actually
were. Repaired with `bun install`; `package-lock.json` is gitignored and was
removed. **Use the declared package manager.**

**Verdict:** justified for S31 and the seven other graph-shaped candidates
(S40/S52/S26 system maps, S45 queue+DLQ, S47 lineage, S49 agent loop, S42 trust
boundary). Not justified for the ten SVG figures, only one of which is a
node-edge graph.

---

# I Do: stepped reveal

## Why it is not decoration

Every I Do preamble already instructs the learner to predict the output
(`**Predicción:**`, eight per section, pinned by tests) — while the code *and its
output* are both on screen from the moment the tab opens. The course has been
asking learners to predict something already visible. Stepping the reveal makes
an instruction that already exists actually work. That is a defect repair, and
it is the justification; the animation is a side effect.

Supporting principles: segmenting (learner-paced chunks), the worked-examples
effect (I Do *is* the worked example), and expertise reversal — hence a
one-click, remembered opt-out.

## The constraint that decided the architecture

`scripts/code_rendering.spec.ts` asserts, for every code block in every tab
including `ido`, that rendered `textContent` equals `data-code-source`. So
progressive reveal **must not truncate**: a learner must never be able to copy a
mangled snippet.

Therefore nothing is removed. Unrevealed lines keep their text and are hidden
with `visibility`, which also preserves their height so the block never reflows.
The arriving line is swept with `clip-path`, which reads as typing while the
text underneath is complete throughout. The output keeps its full text and is
blurred rather than unmounted, so the gate still verifies it and screen-reader
users are not denied it to preserve a guessing game.

Verified in a browser at every step: code fidelity ✓, output fidelity ✓,
initial 11/13 lines masked, output still masked after the code completes.

## Measurements that shaped it

Across all 376 I Do demos: **95 %** have blank-line groups (so structural
segmentation is reliable), only **21 %** have inline comments (so per-step
rationale is *not* authorable in this pass — that would be ~1700 annotations),
median 13 lines, p90 24, max 66.

The value therefore comes from segmenting and the prediction repair, not from
per-line prose. Authoring real per-step notes remains an open opportunity; the
`steps?` shape is deliberately not invented until there is content for it.

## Three defects found while building it

1. **A latent pre-existing bug.** The `showLineNumbers` branch renders line
   numbers *inside* `<code>`, so its `textContent` has never matched its own
   `data-code-source`. It had no users, so nothing caught it. The reveal branch
   deliberately avoids line numbers, and a test pins that it does not inherit
   the bug.
2. **A no-JS hole.** Fixing a lint error properly with `useSyncExternalStore`
   exposed it: the **server snapshot returns `'all'`**, so a reader without
   JavaScript now gets the complete demo instead of a masked block behind a
   stepper that can never run.
3. **An empty first screen.** The first version masked every line until the
   first click. The first chunk is now visible immediately — an empty block
   teaches nothing, and the prediction needs something to read.

The preference lives in `pyarcana:idoReveal`, deliberately **not** in
`python-ds-progress`, which is a protected identity. A test enforces that.

---

# Performance: one regression I caused, one defect I did not

## The regression (mine, fixed)

The code-fidelity gate first failed on a **420s timeout**, not a mismatch.
Measuring tab switches on S14 explained it:

| tab | before | after |
|---|--:|--:|
| theory | 392 ms | 312 ms |
| **I Do** | **5043 ms** | **393 ms** |
| We Do | 1352 ms | 598 ms |

I Do was taking five seconds while carrying **a third** of We Do's DOM.
`highlightCode` was running once per line on every render — thirteen lines,
eight demos, repeated on each step.

The instructive part is that the obvious fix made it worse. Adding `useMemo`
produced a lint error — *"Compilation Skipped: Existing memoization could not be
preserved"* — because the **React Compiler is enabled** here and a manual memo
keyed on the `reveal` object makes it bail out of optimising the component
entirely. Hand-rolled memoisation was actively harmful. Reading reveal state as
scalars (`isRevealing`, `revealVisibleLines`, …) lets the compiler do it: 10×
faster, zero lint errors, fidelity still byte-identical at every step.

## A second real cost, also fixed

`figures/index` statically imported the S31 component, so **`@xyflow/react` was
pulled into the bundle for all 52 sections** when exactly one renders a graph.
It is now `next/dynamic` with `ssr: false` — React Flow measures the DOM to lay
out edges, so there is nothing useful to render server-side, and the caption and
screen-reader description carry the meaning regardless. A test pins it.

## The defect that is not mine

The gate then failed on a **5 s budget for the first navigation**, with
`#setup` hydration measuring 4.7–5.2 s. Lazy-loading xyflow did not move that
number, so attribution needed a real baseline rather than a guess.

A `git worktree` at `caa0f1f0` — the commit before this work — was run on port
3100 against current on port 3000, same machine, same `node_modules`,
alternating:

| | warm median |
|---|--:|
| baseline `caa0f1f0` | **4984 ms** |
| current, all changes | **4732 ms** |

**Current is slightly faster than baseline.** The ~5 s hydration is entirely
pre-existing; the spec's 5 s first-navigation budget has always been marginal on
this hardware. CI passes the same spec because its cold-start profile differs
and the workflow sleeps 15 s before starting.

Recorded rather than fixed: the spec would be more robust with an explicit
`toHaveAttribute(..., { timeout })` on that first assertion instead of relying
on the 5 s default, since the walk that follows already budgets 420 s. That is a
change to a gate, so it is proposed here rather than made quietly.

## Method note

Three of my own wait loops in this session were broken: `pgrep -f "code_rendering"`
matches the shell command *containing* that pattern, so the loop waited on
itself forever. Wait on a PID, not on a pattern that includes your own command
line.
