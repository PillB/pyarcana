# S07 Pedagogy Fixer Report (Round 1)

## Section
- **title:** Texto, Unicode y expresiones regulares
- **id:** `data-acquisition`
- **index:** 7
- **source:** `src/lib/course/sections/s07-data-acquisition.ts`
- **counts:** iDo 8 · weDo 24 · youDo 1

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and Round-1 `S07_EXERCISE_PEDAGOGY_REPORT.md`.
- Hand-implemented `preamble` / `retrospective` / We Do `title` + slim task-only `instruction` from the review ledger (no generators, no bulk prose paste scripts).
- Preserved all starter/solution code and exact outputs; strengthened feedback reasoning on all 24 weDo units (P2).
- Expanded short `why` on all 8 iDo demos (40–90 words where needed).
- Validated field coverage with a measurement-only Python scan; `tsc --noEmit` exit 0.

## Acceptance checklist (§11)

- [x] Every iDo step: `preamble` + `retrospective` (8/8); `why` expanded
- [x] Every weDo step: short `title`, `preamble`, task-only `instruction`, `retrospective` (24/24)
- [x] youDo: `retrospective` (context/objectives/requirements/starter untouched)
- [x] Exact outputs preserved (NFC, email contract, Jaccard 0.667, prose E3s, evidence dict)
- [x] Spanish PE; synthetic data only; no real PII
- [x] No generators / bulk manufacture of educational prose
- [x] Section source typechecks (`tsc --noEmit` OK)

## Unit implementation summary

### I Do (8)
| Unit | Fields added | Code/output |
|------|--------------|-------------|
| S07-T1-A-DEMO | preamble, retrospective, why↑ | none |
| S07-T1-B-DEMO | preamble, retrospective, why↑ | none |
| S07-T2-A-DEMO | preamble, retrospective, why↑ | none |
| S07-T2-B-DEMO | preamble, retrospective, why↑ | none |
| S07-T3-A-DEMO | preamble, retrospective, why↑ | none |
| S07-T3-B-DEMO | preamble, retrospective, why↑ | none |
| S07-T4-A-DEMO | preamble, retrospective, why↑ | none |
| S07-T4-B-DEMO | preamble, retrospective, why↑ | none |

### We Do (24)
Each unit received: `title` · `preamble` (context/goal/success/constraints) · step-only `instruction` · `retrospective` · stronger `feedback`.

| Subtopic | E1 / E2 / E3 titles (fade) |
|----------|----------------------------|
| T1-A | Normalizar nombres a NFC con repr · Matching case-insensitive con casefold · Diagnosticar mismatch NFD vs NFC |
| T1-B | Extraer given y dos apellidos · Preservar partículas en el given · Review si faltan tokens de apellido |
| T2-A | Split CSV-like con strip por campo · Unir tokens con espacio y guion · Solo dígitos con replace o isdigit |
| T2-B | normalize_email modesto con fail-closed · Teléfono PE a solo dígitos (+51) · Overvalidation que rechaza plus-addressing |
| T3-A | fullmatch de código de región · groupdict con nom y ap · Search vs fullmatch en DNI embebido |
| T3-B | Compilar y reusar patrón de celular · findall de códigos LIM-01 / CUS-02 · Riesgo de catastrophic backtracking |
| T4-A | Exact match con NFC, colapso y casefold · Jaccard de tokens con NFC · Umbrales exact / review / no_match |
| T4-B | Etiquetar FP y FN en dos casos · Empaquetar evidencia de matching · Sin afirmaciones de parentesco ni identidad |

**E1→E2→E3 fade applied in prose:** E1 names the defect line-by-line; E2 states goal/success with fewer breadcrumbs; E3 opens a new surface (status policy, product overfit, backtracking judgment, ethical gate).

### You Do
- Added **retrospective** only (defense prompts: transforms order, review vs invent, no-parentesco, 30s impact phrase, S08 bridge).
- Starter (`NotImplementedError` contracts) and rubric untouched.

## P2 polish applied
- All 24 weDo `feedback` blocks expanded to name the misconception (NFD residual, casefold contract, inventar apellido2, isalnum vs isdigit, search FP, min(len) Dice-like, score→exact, FP/FN swap, evidence without reason, Jaccard≠RENIEC, etc.).
- iDo `description` (T1-A) tightened; all iDo `why` no longer telegraphic.

## Output integrity spot-check (PASS)
- T1-A-E1: `'José'` / `'José'` / `''`
- T1-A-E2: `True` (casefold)
- T1-A-E3: `raw False` / `nfc True` / causa canónica
- T1-B-E3: Madonna `review` + Luis `ok` dicts
- T2-B-E1: `ok a@b.com` + three `review_error`
- T2-B-E2: `51999000111`
- T3-B-E3: four-line catastrophic backtracking note (canonical)
- T4-A-E2: `0.667`
- T4-A-E3: `review Juan Perez Juan P Perez 0.67`
- T4-B-E2: reason canónica de evidencia
- T4-B-E3: no-parentesco three lines
- Starters still carry named DEFECT comments; residual `print('ok', True)` left in starters (learner cleans in E1 instructions where relevant)

## Residual risks (from review, still valid)
1. **Output compare on prose E3** (T3-B-E3, T4-B-E3, reason T4-B-E2, causa T1-A-E3): canonical solution phrases fixed; paraphrases may fail strict string compare.
2. **T1-B-E1/E2 same structural defect** (`given = toks[0]`): fade is in instruction prose, not starter shape — intentional.
3. **Phone double practice** (T2-A-E3 vs T2-B-E2): preambles distinguish general str vs PE contact with +51.
4. **Round-2** should re-read length caps and E1→E3 voice without rubber stamp.
5. Scope wall S08/S12 preserved (no scraping/HTTP/SQL introduced).

## Diff footprint
- `src/lib/course/sections/s07-data-acquisition.ts`: +235 / −57 (pedagogy shell only; code/outputs unchanged).

---

Section 7 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
