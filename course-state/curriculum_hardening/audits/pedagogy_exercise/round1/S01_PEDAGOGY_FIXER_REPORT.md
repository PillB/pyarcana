# S01 Pedagogy Fixer Report (Round 1)

## Section
- **title:** Entorno reproducible y trabajo seguro
- **id:** `setup`
- **source:** `src/lib/course/sections/s01-setup.ts`
- **review input:** `round1/S01_EXERCISE_PEDAGOGY_REPORT.md`
- **date:** 2026-07-25

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the full Round-1 unit ledger
- Hand-applied optional schema fields only in the assigned section source
- No generators, bulk templates, or cross-section copy-paste of pedagogical prose
- Preserved starter `____` defects, solution code, and exact demo/exercise outputs
- Light PE anglicism hygiene on new prose (`commitear` → commit forms; `trackea` → versiona)

## Acceptance checklist

| Criterion | Status |
|-----------|--------|
| Every non-trivial unit has `preamble` + `retrospective` | **PASS** — 8 iDo + 24 weDo; You Do retrospective only (context already frames project) |
| We Do has short `title` | **PASS** — 24/24 |
| `instruction` is task-only | **PASS** — goal/success/constraints moved into preamble bullets |
| Exact outputs preserved | **PASS** — no execute-and-diff needed; fixtures `requests==2.32.3`, `3.12.3`, Ruff F401→green intact |
| Spanish PE; no real PII | **PASS** — synthetic name Maria Quispe retained; tú/professional register |
| No generators used | **PASS** |
| Section source compiles | **PASS** — `npx tsc --noEmit` exit 0 |

## Counts applied

| Kind | Units | Fields added |
|------|-------|----------------|
| iDo | 8 | `preamble` + `retrospective` each; minor description polish on T1-A and T3-B |
| weDo | 24 | `title` + `preamble` + task-step `instruction` + `retrospective`; feedback mildly enriched with named misconception where thin |
| youDo | 1 | `retrospective` only (no new preamble; `context` remains canonical) |

**Totals in source after fix:** `preamble` × 32 · `retrospective` × 33

## Unit ledger (fix)

### iDo (P0 — all 8)
| Unit | Changes |
|------|---------|
| S01-T1-A-DEMO | preamble + retrospective; description note “observar, no crear .py aún” |
| S01-T1-B-DEMO | preamble + retrospective |
| S01-T2-A-DEMO | preamble + retrospective |
| S01-T2-B-DEMO | preamble + retrospective |
| S01-T3-A-DEMO | preamble + retrospective |
| S01-T3-B-DEMO | preamble + retrospective; description softened to local flow + optional remote |
| S01-T4-A-DEMO | preamble + retrospective |
| S01-T4-B-DEMO | preamble + retrospective |

### weDo guided E1 (P0)
| Unit | Title |
|------|-------|
| S01-T1-A-E1 | Completar transcript REPL (suma, type, sys) |
| S01-T1-B-E1 | Documentar exit 0 y exit 1 en tu shell |
| S01-T2-A-E1 | Crear, activar y desactivar `.venv` |
| S01-T2-B-E1 | Pin, freeze y verificar `requirements.txt` |
| S01-T3-A-E1 | Primer commit Conventional Commits |
| S01-T3-B-E1 | Crear rama `feat/practica-s01` y hacer commit |
| S01-T4-A-E1 | Config mínima de Ruff en `pyproject.toml` |
| S01-T4-B-E1 | Completar `.gitignore` mínimo Python/data |

### weDo E2/E3 (P1)
All 16 remaining We Do units received the same field shell: title, preamble (context/goal/success/constraints), ordered instruction steps, retrospective (principle + misconception + self-check + transfer). Feedback sentences extended only where they were transfer-only or under ~25 words, naming one misconception without spoiling E3.

### youDo (P1)
| Unit | Changes |
|------|---------|
| Esqueleto CP-N1-A | `retrospective` defense prompts; reinforces skeleton-only scope vs S04 validator |

## Code / output integrity
- **No** solution code rewrites
- **No** output string changes
- **No** pin bumps (`requests==2.32.3` pedagogical fixture kept)
- Starter blanks and tests/checklists unchanged

## Residual risks for Round 2
- Volume of new prose may still need length trim if UI feels heavy (preambles target 80–150 words)
- Platform dual-path (Windows/Unix) lives mainly in preamble/hints — Round 2 can check scanability on mobile
- Learners without GitHub still complete most T3 work; remote remains optional in success criteria
- You Do retrospective must not be misread as requiring full intake validator in S01

## Validation
- Manual field counts: preamble 32, retrospective 33, weDo titles 24
- `npx tsc --noEmit` — PASS
- Anti-aberration: hand-written application of Round-1 proposals only

---

Section 1 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
