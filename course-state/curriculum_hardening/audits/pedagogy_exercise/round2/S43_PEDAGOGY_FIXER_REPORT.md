# S43 Pedagogy Fixer Report (Round 2)

## Section
- **title:** Contenedores y reproducibilidad operativa
- **id:** `llmops`
- **index:** 43
- **source:** `src/lib/course/sections/s43-llmops.ts`
- **Round-2 review:** `round2/S43_EXERCISE_PEDAGOGY_REPORT.md`
- **counts:** iDo 8, weDo 24, youDo 1

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and Round-2 residual report.
- Hand-edited only pedagogical prose in Section 43.
- No generators, loops, templates, or bulk prose manufacture.
- No code/output/assert/fixture/DEFECT changes.
- youDo left untouched (already **A**).

## Acceptance checklist
- [x] Every non-trivial unit has `preamble` + `retrospective` (coverage was already complete; retros expanded)
- [x] We Do has short `title` (unchanged)
- [x] `instruction` is task-only (unchanged)
- [x] Exact outputs preserved
- [x] Spanish PE; no real PII
- [x] No generators used
- [x] Source structure intact (brace balance OK; 33 retrospective fields)

## Changes applied (P2 polish only)

### A. iDo retrospectives (+ why where needed)

| Unit | Change |
|------|--------|
| S43-T1-A-DEMO | Retro: self-check sobre capa reusada cuando solo cambia `src/` |
| S43-T1-B-DEMO | Retro expandida: trío runtime + misconception `latest` + self-check CVE/parche |
| S43-T2-A-DEMO | Retro expandida: rotación sin rebuild + DB-as-tmp + self-check history |
| S43-T2-B-DEMO | **why** +1 frase (200 con DB caída); **retro** replace con self-check live≠ready |
| S43-T3-A-DEMO | Retro expandida: healthy==services + depends_on + self-check half-healthy |
| S43-T3-B-DEMO | Retro replace: restore drill + contract con código viejo + self-check release notes |
| S43-T4-A-DEMO | Retro expandida: lock flotante + gcc en final + self-check digest mañana/hoy |
| S43-T4-B-DEMO | **why** aclara unlimited disfrazado; **retro** + mem 0 / CRITICAL same no-go |

### B. We Do E2 (romper plantilla + eco feedback/retro)

| Unit | Change |
|------|--------|
| S43-T1-A-E2 | Retro replace: schema vs breach de orden; no inventar digest |
| S43-T1-B-E2 | Retro replace: SELECT = criterio de base; 490 MB ¿breach o schema? |
| S43-T2-A-E2 | Retro replace: CLASSIFY vs REMOVE; volume borrable sin backup |
| S43-T2-B-E2 | Retro replace: grace documentado; evidencia de runbook |
| S43-T3-A-E2 | **feedback** expandida (topología); **retro** replace (red default / exposición DB) |
| S43-T3-B-E2 | **feedback** expandida (restore); **retro** replace (restore asumido / ephemeral_reset) |
| S43-T4-A-E2 | **feedback** expandida (supply chain); **retro** replace (lock demo / solo runtime+gcc) |
| S43-T4-B-E2 | Retro replace: logs redactados; un breach code para mem+CVE |

Anclas de dominio variadas a propósito: caché, privilegio, rotación, grace, redes, restore, lock, logs.

### C. We Do E1 retros cortas

| Unit | Change |
|------|--------|
| S43-T1-A-E1 | Retro expandida + self-check capa/digest |
| S43-T1-B-E1 | Retro expandida + self-check caps con UID 10001 |
| S43-T2-A-E1 | Retro expandida + self-check db ephemeral |
| S43-T2-B-E1 | Retro expandida + self-check grace vs SLO |
| S43-T3-A-E1 | Retro expandida + token YAML retries |
| S43-T3-B-E1 | Retro expandida + contract en rolling deploy |
| S43-T4-A-E1 | Retro expandida + self-check apt gcc en runtime |
| S43-T4-B-E1 | Retro expandida + self-check CVE/mem 0 same no-go |

### D. We Do E3 eco feedback/retro (replace retro only)

| Unit | Change |
|------|--------|
| S43-T2-A-E3 | Retro replace: SECRET= lab vs real; costo de rotación vs mount |
| S43-T2-B-E3 | Retro replace: mentira operativa + grace 0 hardcodeado |
| S43-T3-A-E3 | Retro replace: YAML portfolio vs set Python; DB_MAX_ATTEMPTS |
| S43-T3-B-E3 | Retro replace: restore SKIPPED no-go; ephemeral: db |
| S43-T4-A-E3 | Retro replace: COPY --from como puente; tag flotante |
| S43-T4-B-E3 | Retro replace: reporte CI para S44; mem 0 vs CVE |

### Not touched (by design)
- Código starter/solution, outputs, asserts, DEFECT comments, fixtures `CASO-TRU-043`
- youDo (context/objectives/requirements/starter/portfolioNote/rubric/retrospective)
- Titles, instructions, hints (salvo feedback/retro listados)
- Theory, iDo code blocks, selfCheck, resources

## Integrity
- Wrong ≠ right paths preserved in all E1/E2/E3 DEFECT patterns.
- No execute-and-diff required: pedagogy-only verbal changes.

## Residual risks after R2 fix
1. E2 retros still share a loose “principle + misconception + pregunta + E3 bridge” shape (spec-compliant metacognition), but domain anchors differ — not a bulk template fill.
2. Some instructions remain short (~18–39 w); intentional task-only style.
3. File id/title `llmops` vs contenedores naming still outside exercise prose scope.
4. Future reviewers should not re-expand preambles into essays.

## Counts summary

| Área | R2 action |
|------|-----------|
| iDo retros/why | 8 units touched |
| weDo E1 retros | 8 expanded |
| weDo E2 feedback/retro | 8 (3 feedback + 8 retro) |
| weDo E3 retros | 6 replaced |
| youDo | 0 |
| code/outputs | 0 |

---

Section 43 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
