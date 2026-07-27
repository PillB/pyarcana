# S10 resolved specialist dispatch packet

This packet records the complete, section-resolved instructions for the independent Section 10 remediation wave. It is an orchestration artefact. It does **not** claim that software subagents were executed in this environment.

## Dispatch gate

Every specialist must begin by writing exactly:

> I acknowledge the Anti-Aberration Rules. I will work only on Section 10, manually inspect its assigned audit sources, current canonical source, and live rendering, and will not use scripts, loops, templates, or bulk mechanisms to manufacture educational prose.

No specialist may edit before that acknowledgement is checked.

## Resolved section instruction

**ASSIGNED SECTION:** 10 — Módulos, packaging y CLI profesional

**LOCAL REPOSITORY:** `/Users/pabloillescas/Projects/PyArcana`

**LIVE SITE:** `https://pillb.github.io/pyarcana/#sklearn`

**PRIMARY EXPLORER REPORT:** `course-state/curriculum_hardening/audits/explorer_reports/S10_EXPLORER_REPORT.md`

**SECTION EXPERT REPORT:** `expert_audit/S10_report.md`

**SECTION SPANISH-QUALITY REPORT:** `course-state/curriculum_hardening/audits/spanish_quality/S10_SPANISH_QUALITY.json`

**SHARED SPANISH GRAMMAR PLAN:** `expert_audit/_GRAMMAR_SUBPLAN.md`

**SPANISH-QUALITY FLEET SUMMARY:** `course-state/curriculum_hardening/audits/spanish_quality/SPANISH_QUALITY_SUMMARY.md`

**CAMPAIGN SUMMARY:** `expert_audit/CAMPAIGN_SUMMARY.md`

**SHARED WORKLOG:** `expert_audit/worklog.md`

**AUDIT SCRIPT — VALIDATION ONLY:** `scripts/spanish_quality_audit.py`

**CANONICAL SOURCE:** `src/lib/course/sections/s10-sklearn.ts`

**COMPATIBILITY ID:** `sklearn`; preserve until a repository-wide alias/migration is designed.

Work only on Section 10. Ignore Fixer reports outside the explicitly listed evidence scope. Earlier edits are not completion evidence. Confirm every claim against the current source and rendered lesson.

Before editing, reread the complete Anti-Aberration protocol and all resolved paths above. Inspect the current source, live lesson, public self-check, authenticated bank, directly relevant renderer mappings and tests. Build an issue-resolution ledger before making changes.

Every educational paragraph, example, hint, feedback block, rubric criterion and question must be reviewed manually. Scripts may validate code, outputs, schemas, rendering and metrics. They may never generate or paraphrase educational prose.

Apply the Stephen-Fry beginner-language rule manually: when an uncommon noun or technical term first appears, introduce it in the sentence with a brief human explanation. Prefer natural wording such as “un *entrypoint*, que es la función por la que empieza el comando” rather than a detached glossary dump. Do not over-explain terms already defined in the same local context.

## Specialist assignments

Each specialist has one bounded unit and must reread this entire packet immediately before starting.

### S10-MAP — Opening and section map

Review `jobRelevance`, learning outcomes and the first theory map. Make the workplace promise concrete. Explain **package**, **CLI**, **configuration precedence**, **editable installation**, **fail-closed** and **standard library** at first use. Preserve the continuity S08 ingestion → S09 evidence → S10 distributable tool.

### S10-T1-A — Imports, namespaces and `__main__`

Explain a **module**, **namespace**, **import side effect**, **entrypoint**, `sys.modules` and `__main__` with one coherent mental model. Retain technically valid identifiers. Review its theory, callout, I Do and three We Do exercises.

### S10-T1-B — Cycles and public API

Explain an **import cycle**, **dependency direction**, **facade**, **public API**, **private helper**, `__all__` and lazy import. Avoid implying that an underscore enforces privacy. Review theory, I Do and three We Do exercises.

### S10-T2-A — `src` layout, `pyproject.toml` and builds

Explain **source layout**, **project metadata**, **build backend**, **editable install**, virtual environment and module shadowing. Preserve the real TOML demonstration and project contract. Review theory, I Do and three We Do exercises.

### S10-T2-B — Semantic versioning

Explain **SemVer**, which is a version-number convention, plus major/minor/patch, breaking change, deprecation, dependency and changelog. Use a memorable causal story rather than a classification table alone. Review theory, I Do and three We Do exercises.

### S10-T3-A — `argparse`, subcommands and exit status

Explain **argument parser**, **subcommand**, **flag**, **exit code**, runtime error and usage error. Show why automation reads the number even when a human reads the message. Review theory, I Do and three We Do exercises.

### S10-T3-B — Standard streams and pipes

Explain **stdin**, **stdout**, **stderr**, **stream**, **pipe** and redirection using the “separate data channel and diagnostic channel” model. Preserve exact code/output truth. Review theory, I Do and three We Do exercises.

### S10-T4-A — Configuration precedence

Explain a **configuration layer**, **precedence**, environment variable, default and `None` as “not supplied”. Tie each rule to predictable operations. Review theory, I Do and three We Do exercises.

### S10-T4-B — Secrets and early validation

Explain a **secret**, `.gitignore`, template file, hard-coded value, safe default, validation, fail-fast and traceback. Do not imply that `.env.example` contains real credentials. Review theory, I Do and three We Do exercises.

### S10-YOUDO — Independent project and rubric

Review the complete package bootstrap, objectives, requirements, portfolio note and rubric. Ensure each criterion names observable evidence: installation, help output, exit status, clean streams, tests, configuration precedence and absence of committed secrets. Add plain-language assembly guidance without weakening independence.

### S10-SELFCHECK — Public self-check

Review every question and explanation for first-use terminology, plausible misconceptions and causal feedback. Do not reward keyword matching. Preserve correct keys unless technical inspection proves an error.

### S10-AUTH — Authenticated assessment bank

Inspect all three variants for each concept, correct-position distribution, attempt equivalence, duplicate stems, distractor plausibility and terminology alignment. Any rewrite must be manual and section-specific.

### S10-EDITOR — Coherence editor

Read the complete revised section in order. Check narrative continuity between subtopics, gradual release from I Do to We Do to You Do, terminology consistency and the bridge from S09 and to S11. Remove repeated explanations once a term is securely established, while retaining reminders at high-load moments.

### S10-TECH — Technical correctness reviewer

Execute all existing Section 10 examples and declared outputs. Validate the generated package, editable install, CLI help, exit codes 0/1/2, stdout/stderr separation, configuration precedence, unit tests and absence of secrets. Automation is validation only.

### S10-GUARD — Anti-aberration guardian

Reject uniform, templated or mechanically expanded prose. Confirm that no loop, generator, bulk replacement or automatic paraphraser manufactured educational content. Require a restart for any affected unit.

### S10-VALIDATE — After-fix validator

Recheck every Explorer, expert and Spanish-quality finding. Run focused tests, TypeScript, lint, V3 structure, assessment integrity, Spanish metrics, static build and rendered inspection. Record inherited failures separately from Section 10 failures.

### S10-REPORT — Reporter and inventory owner

Produce the exact eight-part Fixer report, append the worklog without overwriting prior entries, list all changed files, preserve genuine residual risks and update the independent inventory only after integration evidence exists.

## Current-reality notes before editing

The checked canonical source already resolves many findings from the oldest Explorer snapshot. Do not reintroduce them. In particular, preserve:

- direct learner-facing opening rather than V3/scikit-learn migration prose;
- real `pyproject.toml` text;
- the corrected stdout/stderr demonstration;
- per-exercise context, success criteria and retrospective;
- predictions and retrospectives in every I Do;
- the complete You Do bootstrap.

The principal fresh pass is beginner accessibility and literary-pedagogical cohesion, not wholesale novelty.

## Completion rule

Section 10 may be marked complete only after learner source edits, assessment inspection, executable validation, live-render inspection, worklog append, complete report, reviewed integration, successful Pages deployment and public verification. A packet, passing script or documentation commit alone is not completion.
