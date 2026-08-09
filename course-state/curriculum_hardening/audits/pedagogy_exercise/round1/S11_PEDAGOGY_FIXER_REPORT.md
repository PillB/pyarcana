# S11 Pedagogy Fixer Report (Round 1)

## Section
- **title:** OOP y modelo de dominio
- **id:** `testing` (archivo histórico `s11-testing.ts` — contenido OOP de dominio CP-N1-C)
- **index:** 11
- **source:** `src/lib/course/sections/s11-testing.ts`
- **counts:** iDo 8 · weDo 24 · youDo 1

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and Round-1 `S11_EXERCISE_PEDAGOGY_REPORT.md`.
- Hand-implemented `preamble` / `retrospective` / We Do `title` + task-only `instruction` from the review ledger (no generators, no bulk prose paste scripts).
- Thickened short I Do `why` texts toward 40–90 words where proposed.
- Strengthened one We Do feedback (T1-A-E1 default mutable reasoning).
- Preserved all starter/solution code and exact outputs; no integrity changes.
- Validated field coverage with a measurement-only Python scan; `tsc --noEmit` exit 0.

## Acceptance checklist (§11)

- [x] Every iDo step: `preamble` + `retrospective` (8/8); `why` thickened where proposed
- [x] Every weDo step: short `title`, `preamble`, task-only `instruction`, `retrospective` (24/24)
- [x] youDo: `retrospective` (context/objectives/requirements/starter/oráculo untouched; minor portfolioNote line)
- [x] Exact outputs preserved (no code/output changes)
- [x] Spanish PE; synthetic data only (`C00x`, `@ejemplo.pe`); no real PII
- [x] No generators / bulk manufacture of educational prose
- [x] Section source typechecks (`tsc --noEmit` OK)

## Unit implementation summary

### I Do (8)
| Unit | Fields added | Code/output |
|------|--------------|-------------|
| S11-T1-A-DEMO | preamble, retrospective, description + why | none |
| S11-T1-B-DEMO | preamble, retrospective, why | none |
| S11-T2-A-DEMO | preamble, retrospective, why | none |
| S11-T2-B-DEMO | preamble, retrospective, why | none |
| S11-T3-A-DEMO | preamble, retrospective, why | none |
| S11-T3-B-DEMO | preamble, retrospective, why | none |
| S11-T4-A-DEMO | preamble, retrospective, why | none |
| S11-T4-B-DEMO | preamble, retrospective, why | none |

### We Do (24)
Each unit received: `title` · `preamble` (context/goal/success/constraints) · step-only `instruction` · `retrospective`.

| Subtopic | E1 / E2 / E3 titles (fade) |
|----------|----------------------------|
| T1-A | ClientRecord con emails y default_factory · Transaction con Decimal y moneda PEN · from_dict classmethod que devuelve ClientRecord |
| T1-B | Transaction rechaza cero y EUR · from_dict rechaza document_id en blanco · validate() devuelve lista de errores |
| T2-A | Property full_name en PersonName · age_days_since como consulta pura · Setter de score finito en [0, 1] |
| T2-B | ResolvedEntity frozen solo por entity_id · Set de Evidence frozen colapsa duplicados · Key mutable vs FrozenEntity en dict |
| T3-A | Client tiene PersonInfo (composición) · CaseFile sin lista compartida entre casos · Par canónico y score en RelationshipEvidence |
| T3-B | FakeScorer cumple el método score del Protocol · apply inyecta strip y casefold · Cuándo introducir Protocol (YAGNI) |
| T4-A | to_dict omite internal_note del export · Repo en memoria: save y get por client_id · Capas cli, service y domain |
| T4-B | Test real: document vacío debe fallar · Tres tests puros con FakeRepo · Extraer decide_fraud; dejar solo signal_score |

### You Do
- Added **retrospective** de defensa (invariantes del oráculo, PII sintético vs real, frase de impacto 30 s).
- Optional: one line on `portfolioNote` contrasting real vs synthetic data in the README de límites.
- Starter TODOs and `tests_pass` oracle **untouched**.

## P2 polish applied
- **S11-T1-A-E1 feedback:** reasoning on shared list / when the mutable default hurts (two instances).
- Preambles for forma reducida (T1-B E2/E3, T4-B E1) explicitly say “forma reducida a propósito”.
- T3-B-E3 preamble legitimizes the YAGNI design exercise (not a pure code bug).

## Output integrity spot-check (PASS)
- `ClientRecord(... emails=['ana@ejemplo.pe'])` · `ClientRecord C007`
- `Decimal('150.50')` / PEN · `reject amount debe ser > 0` · `reject currency no soportada`
- `document_id vacío` · `['client_id vacío', 'document_id vacío']` · `[]`
- `Ana Pérez` (property) · `15` / `reject día anterior a creación` · `ok 0.4` / reject_nan
- `True False` / set size `2` · `BUG lookup_after_mutate None` / `SAFE row`
- `design=composition` · `n= 2 empty 0` · `n_ev 2` / `reject par no canónico`
- Protocol `0.5` · `Ana`/`ana` · `WHEN_NOT:` / `INTRODUCE:`
- `to_dict` sin `internal_note` · repo roundtrip · LAYER flags
- `pass` tests · `ANTES has_decide_fraud True` / `DESPUES … False` (Client.decide_fraud for ANTES kept intentionally)
- youDo oracle still prints `tests_pass`

## Residual risks (from review; unchanged)
1. Filename `s11-testing.ts` / id `testing` vs OOP content — housekeeping rename out of scope.
2. Forma reducida vs canónica is deliberate; Round-2 should confirm preambles still prevent schema drift.
3. T2-B-E2 kept independent (meta+éxito, not over-guided).
4. T4-B-E3 solution still defines `decide_fraud` on Client for the ANTES print — intentional.
5. Round-2 should re-read length caps and E1→E3 fade voice (no rubber stamp).

## Diff footprint
- `src/lib/course/sections/s11-testing.ts`: pedagogy shell only (preamble/title/instruction/retrospective/why/feedback); no starter/solution/output mutations.

---

Section 11 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
