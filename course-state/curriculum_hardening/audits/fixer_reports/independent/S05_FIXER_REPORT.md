# S05 Independent Fixer Report

**Campaign:** fresh independent anti-aberration pass
**Section:** 5
**Date:** 2026-07-26
**Owner scope:** Section 5 only
**Canonical learner title:** *Funciones, contratos y descomposición*
**Export / slot:** `section05` / `COURSE_SECTIONS[4]`
**Stable platform id and live hash:** `oop` / `#oop`
**Canonical source:** `src/lib/course/sections/s05-oop.ts`

## 1. Independence and identity

This pass treated the current product source and current live rendering as the
baseline. Earlier Fixer reports and completion claims were not accepted as
evidence. The identity was independently resolved through:

- `src/lib/course/index.ts`: `section05` is imported from
  `./sections/s05-oop` and occupies the fifth course slot.
- `learning_roadmap_52_V3.md` and the active section source: Section 5 teaches
  functions, contracts, decomposition, purity, scope and the beginning of
  CP-N1-B.
- `https://pillb.github.io/pyarcana/`: HTTP 200 on 2026-07-26; the rendered
  curriculum card says “Funciones & Contratos”.
- The deployed production bundle still bound the stable key `oop` to
  “Practica clases y herencia” with `Animal`/`Perro`, confirming a real
  learner-facing scope leak before this fix.

The stable `oop` id is retained deliberately in this section-scoped batch to
avoid an unplanned database/progress migration. Its learner-facing playground
and PDF label now reflect functions and contracts.

## 2. Instructional surface inventory

| Surface | Freshly inspected inventory | Result after fix |
|---|---:|---|
| Opening theory map | 1 map, dictionary, canonical gate policy and transition plan | Complete; policy limitations now explicit |
| Theory subtopics | 8 (`S05-T1-A` … `S05-T4-B`) | Complete |
| I Do | 8 demos, one per subtopic | Complete; closure boundary repaired |
| We Do | 24 exercises: guided → independent → transfer for each subtopic | Complete |
| You Do | CP-N1-B `normalizers_pure.py`, rubric, portfolio note, retrospective | Oracle strengthened |
| Public self-check | 8 four-option questions | Complete and position-balanced |
| Authenticated bank | 8 concepts × 3 variants = 24 | Corrected and balanced 6/6/6/6 |
| Live playground | Stable key `oop` | Replaced off-topic OOP lesson |
| PDF section label | Stable key `oop` | Corrected to `5. Funciones` |
| Focused regression tests | None dedicated to S05 at baseline | 4 adversarial tests added |

The graph walk followed every subtopic horizontally:
`theory → I Do → We Do E1/E2/E3 → You Do/self-check/authenticated variant`.
It also followed the vertical policy nodes
`nombre/email/teléfono/dirección → pureza → idempotencia → orquestador`.

## 3. Evidence used

### Current section evidence

- `course-state/curriculum_hardening/audits/explorer_reports/S05_EXPLORER_REPORT.md`
- `expert_audit/S05_report.md`
- `expert_audit/_GRAMMAR_SUBPLAN.md`
- `course-state/curriculum_hardening/audits/spanish_quality/S05_SPANISH_QUALITY.json`
- `course-state/curriculum_hardening/audits/spanish_quality/SPANISH_QUALITY_SUMMARY.json`
- `expert_audit/worklog.md`, used only for dependency and cross-section context
- Current source, current production HTML and current production JavaScript
  bundle

### Research synthesis evidence

All 13 supplied research syntheses in
`/workspace/scratch/538c97258ddb/project_sources/*.md` were screened. Several
could not retrieve the actual historical section, so they were used only as
general instructional-design evidence, never as proof of current S05 facts.
The criteria applied here came especially from:

- `03-deep-research-report-4.md` and `10-deep-research-report-3.md`: model the
  reasoning in I Do, reduce support gradually, align independent work with
  modeled skills, and reduce extraneous load with transitions and chunking.
- `12-deep-research-report-8.md`: keep practice close to each mini-lesson and
  close independent work with usable feedback.
- `13-deep-research-report-2.md`: constructive alignment between objectives,
  modeled examples and assessment.

### Current technical primary sources

- Python tutorial, functions/defaults/special parameters:
  <https://docs.python.org/3/tutorial/controlflow.html>
- Python language reference, `return` and implicit `None`:
  <https://docs.python.org/3/reference/simple_stmts.html#the-return-statement>
- Python scopes and namespaces:
  <https://docs.python.org/3/tutorial/classes.html#python-scopes-and-namespaces>
- PEP 257, docstring semantics and conventions:
  <https://peps.python.org/pep-0257/>
- PEP 484, type hints as primarily static-analysis information:
  <https://peps.python.org/pep-0484/>

These sources support the section’s core claims: a bare return has value
`None`; mutable defaults persist across calls; keyword-only parameters follow
`*`; function-local/enclosing/global/builtin scopes are searched in order;
docstrings become `__doc__`; and type hints do not themselves coerce runtime
values.

## 4. Issue-resolution ledger

### S05-I01 — P0: authenticated answer-position shortcut and one wrong key

**Before:** all 24 `QUESTION_BANK.oop` variants used
`correctIndex: 1`. A learner could answer every authenticated question with the
second option. The refactor question “asserts siguen verdes” also keyed
“Python desactiva asserts…” even though its explanation claimed behavior was
preserved.

**After:** options were hand-reordered and keys individually verified. The
distribution is `[6, 6, 6, 6]` across indices 0–3. The refactor item now says
that the behavior **covered by those asserts** was preserved, avoiding the
stronger and unjustified claim that a finite suite proves all behavior.

**Location:** `prisma/seed.ts`, S05 block beginning near line 1338.

### S05-I02 — P1: off-topic live OOP playground and PDF identity

**Before:** the current production bundle rendered “Practica clases y
herencia”, `Animal`, `Perro`, inheritance and `super()` under the Section 5
theory page; the PDF label was `5. OOP`.

**After:** the stable `oop` key now renders a functions-with-contracts exercise
covering name/email/phone normalizers, domain rejection and idempotence. Its
expected output and hint align with S05. The PDF label is `5. Funciones`.

**Locations:** `src/components/course/SectionView.tsx:1048`;
`src/components/course/PdfReport.tsx:45`.

### S05-I03 — P1: You Do promised more than its executable oracle checked

**Before:** requirements demanded idempotence for every normalizer, but
`_run_tests()` omitted address idempotence. It did not test the required invalid
email branch and accepted any record with at least four expected keys, even if
all values were raw or wrong.

**After:** the starter’s fixed oracle now checks:

- idempotence for name, email, phone **and address**;
- `ValueError` for an input without `@`;
- the exact normalized record, including `JR UNIÓN 1`.

**Location:** `src/lib/course/sections/s05-oop.ts:1805-1827`.

### S05-I04 — P1: laboratory policies could be mistaken for production truth

**Before:** `.title()` was sometimes connected to real matching, and the
contains-`@` gate was described with “email inválido” language that could be
read as complete email validation.

**After:** the theory map, T2 contract explanation, I Do reasoning, We Do name
exercise, You Do requirements and portfolio note explicitly state:

- `.title()` is a frozen laboratory policy, not a universal rule for real
  names or identity;
- checking for `@` is a minimal didactic gate, not proof that an address exists
  or is standards-valid.

The lesson still preserves one stable rule across Theory → I/We/You → exams,
which is the actual contract skill being taught.

**Locations:** `src/lib/course/sections/s05-oop.ts:33`, `:153-176`,
`:465-470`, `:669-691`, `:1742-1752`, `:1843-1845`.

### S05-I05 — P2: closure I Do double-prefixed an already canonical value

**Before:** `make_norm("+51")` always prefixed digit-only input. Reapplying the
returned normalizer to its own output produced `+5151…`, contradicting the
section-wide idempotence spine and the more careful theory example.

**After:** the I Do demo derives the digits of the configured prefix, removes
that country code only when the input has more than nine digits, demonstrates
the already-prefixed boundary, and documents why the third output matters.

**Location:** `src/lib/course/sections/s05-oop.ts:559-588`.

### S05-I06 — P2: intentional broken starters were indistinguishable from
accidental runtime failures

**Before:** three deliberate defect starters terminated with AssertionError or
ValueError, but the execution harness could not classify them as incomplete;
S05 reported 62 pass / 3 P1 fail.

**After:** their learner-facing defect comments now explicitly say
`BUG intencional`. The defect and task remain unchanged, while the harness
correctly classifies the expected failure. S05 now reports 65 pass / 0 fail.

**Locations:** `src/lib/course/sections/s05-oop.ts:994`, `:1083`, `:1660`.

### S05-I07 — P2: no focused regression protection

**After:** `tests/adversarial/s05_curriculum_integrity.test.mjs` asserts:

- 8 subtopics, 8 unique demos and 24 unique We Do exercises;
- all four You Do idempotence oracles, invalid-email rejection and exact record;
- an on-topic stable-id playground/PDF label with no `Animal`/`Perro` leak;
- 24 authenticated variants, 8 concepts × 3, and 6/6/6/6 answer positions.

## 5. Spanish, pedagogy and accessibility review

- The opening now establishes policy limits before deeper examples, reducing
  the risk that a beginner memorizes `.title()` or `@` presence as universal
  truth.
- The closure demo makes the expert boundary decision visible instead of
  silently teaching a non-idempotent factory.
- The You Do oracle gives immediate, specific feedback on the four promised
  contracts rather than allowing a false pass.
- Existing strengths were preserved: one domain spine, 8 worked examples, 24
  progressively released practices, synthetic data, no real PII, explanatory
  retrospectives, and a weighted capstone rubric.
- The fresh offline Spanish audit over the changed source scored **9.25/10**,
  Fernández-Huerta **87.4 (“fácil”)**, Szigriszt-Pazos **83.4**, with **0
  medium/high findings**. Its 100 low findings are dominated by intentionally
  short list/code fragments. LanguageTool was disabled for this scoped rerun;
  the prior stored S05 audit reports zero LanguageTool matches.
- Interactive code uses textual outputs as well as visual styling, and the
  corrected playground retains an actionable hint.

## 6. Exact files changed

1. `src/lib/course/sections/s05-oop.ts`
2. `prisma/seed.ts` — only the `QUESTION_BANK.oop` block
3. `src/components/course/SectionView.tsx` — only the stable S05 `oop` demo
4. `src/components/course/PdfReport.tsx` — only the `oop` label
5. `tests/adversarial/s05_curriculum_integrity.test.mjs`
6. `course-state/curriculum_hardening/audits/fixer_reports/independent/S05_FIXER_REPORT.md`
7. `expert_audit/independent_worklog/S05.md`

No fleet-wide generated audit summary was retained after validation.

## 7. Validation evidence

| Gate | Result |
|---|---|
| Focused S05 adversarial test | 4/4 pass |
| S05 Python content runtime audit | 65/65 artifacts pass; P0=0, P1=0 |
| Manually implemented You Do solution | `tests OK`; normal, boundary and error assertions pass |
| Closure normal/boundary/idempotence fixture | 3 exact outputs + idempotence pass |
| TypeScript | `npx tsc --noEmit` pass |
| ESLint | `npm run lint` pass |
| V3 counts/structure/invariants | pass; 52 sections, S05 8/8/24, 0 warnings |
| Exam/self-check pedagogy | pass; 1,248 questions, 416 concepts, P0=0, P1=0 |
| Static production export | pass; Next.js generated `/` and `/_not-found` |
| Local HTTP export check | HTTP 200, 202,697-byte HTML |
| Built JavaScript inspection | contains “Practica funciones con contrato”; stale S05 OOP playground absent |

Playwright DOM/screenshot inspection could not run because this workspace lacks
the Playwright Chromium executable. This is an environment limitation, not a
suppressed product failure: the static export, local HTTP response, generated
bundle, focused mapping assertions and TypeScript build all passed. The parent
batch must still perform the requested post-deployment public-page verification.

## 8. Residuals and integration notes

- `id: "oop"` and filename `s05-oop.ts` remain internal compatibility debt.
  Renaming them safely requires an orchestrated migration of database section
  ids, saved progress, exam attempts, hash links and all dependent maps. The
  learner-facing playground and PDF no longer expose the wrong topic.
- `str.title()` and the minimal `@` gate remain intentionally simple policies;
  the section now states their limits. Full Unicode/text policy continues in
  S07.
- Do not regenerate or commit fleet-wide audit reports from this section
  branch.
- After serial integration, deploy the batch and verify the public Section 5
  page no longer shows the OOP playground and that the PDF label reads
  `5. Funciones`.

Section 5 has been fully fixed and validated under strict anti-aberration rules. Ready for serial batch integration.
