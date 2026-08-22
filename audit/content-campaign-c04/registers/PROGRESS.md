# C04 progress

| Stage | Failures | P0 | Skips | Gate honest? |
|---|--:|--:|--:|---|
| 0 · baseline (as previously reported) | 26 | 4 | 361 | **no** — deps hidden, extraction unfaithful |
| 1 · dependency visibility restored | 36 | 6 | 70 | partly |
| 1 · faithful TS escape decoding | 38 | 8 | 70 | **yes** |
| 2 · syntax defects repaired (21 escapes, 2 files) | 30 | 4 | 70 | yes |
| 2 · S41 orphan contract lines repaired | 26 | 0 | 70 | yes |
| 2 · DEFECT marker taught to the gate | **11** | **0** | 70 | yes |

## Root causes fixed (not symptoms)
1. `run_python` used `-I`, hiding user site-packages → 291 snippets skipped, never executed.
2. `extract_balanced_template` dropped backslashes → the audit executed a *different program* than the one shipped. Now byte-identical to TypeScript across all 3360 code strings.
3. `EXPECTED_FAIL_MARKERS` did not know `DEFECT`, this course's own marker for a deliberately broken starter (1594 uses across 43 files).
4. `test_s03_independent_contract` had no Python-3.10 guard for `match` content.

## Still open
- 9 × `output_mismatch` (s17 packaging 3, s19 databases-orm 4, s20 rag 2)
- 2 × starter raising `PermissionError` with no marker (s20 rag, s23 computer-vision)
- S19 coherence defect — see FINDING-S19 below.

## FINDING-S19 — a claim that contradicts the section's own data
S19's fixture is Lima 28.0 (n=40), Bogota 22.5 (n=32), Madrid 24.0 (n=28).
The prose asserts **"Madrid lidera el ticket mediano"** seven times, and one
paragraph reads `row {region:'Lima', median:28} -> tooltip 'Madrid: 28 PEN'`.
Lima leads, not Madrid. The code is right; the prose and four declared outputs
are wrong. Isolated to S19 (54 `Madrid` occurrences; no other section affected).
Repairing this is an editorial change to the section's running example.

---

# Intro pass (2026-08-22) — all 52 section intros

## What was wrong

| pattern | sections |
|---|--:|
| opened with a "Diccionario de la sección" term dump before any motivation | 30 / 52 |
| carried a `section_contract()` code block of dev metadata in the intro | 23 / 52 |
| telegraphic "Orden pedagógico: T1 → T2 → T3 → T4" chain | 15 / 52 |
| "Ritmo sugerido (~18 h): sesiones 1–2 en T1…" scheduling | 12 / 52 |
| intro block length range | 853 – 3736 chars |

The `section_contract()` blocks were the sharpest case: executable Python
returning internal gate names (`no_overclaim`, `chart_table_parity`), a
deliverable ID and `real_pii_ok: False`, rendered as a lesson demo in the slot
where the reason to care should be.

## What was done

Every intro rewritten to open on a concrete situation, with terms glossed at the
point of need. Pacing, gate criteria and the contract listings moved — verbatim,
nothing deleted — into one consistent `optional: true` block titled "Contrato de
la sección (referencia)", collapsed by default, reusing the `TheoryBlock.optional`
rendering already built for the DL bridge.

Diccionarios course-wide: **30 → 9**, none of the survivors in intros. One of the
nine (S32) turns out to be a tagged subtopic block, not intro metadata — a
different problem, not addressed here.

## Pass 2 — what the adversarial re-read actually caught

Reading all 52 openings side by side found defects a per-section read could not:

- S02–S06 all opened with the same templated heading "Mapa de la sección: …"
- S01's first-draft heading collided with S43's, which uses the same phrase as
  its thesis
- S03 and S04 both opened "Imagina …", and S03's "formulario internacional de
  ayuda" nearly duplicated S06's "centro internacional de ayuda"

All six headings are now specific to their own section.

## Test expectations changed — as requirements, not as weakened assertions

| test | change | why |
|---|---|---|
| `test_s01_text_first_prose` | theory heading count 14 → 15 | the folded block adds one heading; still pinned exactly |
| `test_s03_text_first_contract` | `**Diccionario de navegación.**` anchor → the sentence carrying the section's core idea | that term dump was dissolved into glosses (protocol §3.6) |
| `test_copy_and_resources` | URLs stripped before the forbidden-book scan | pre-existing red gate: `\bbook\b` matched `sre-book` inside a canonical URL |

The pinned images earlier editorial rounds won were all preserved: "Imagina una
cinta transportadora", "una colega en Nairobi, otra en Berlín", "En S01
preparaste el taller", S05's "En S04 aprendiste a recorrer datos", S07's
decision map, S06's nine mental-model surfaces.

## A process defect worth recording

The first push went red. `npm run test:adversarial` runs a node half and a
python half; I ran only the python half locally, so I missed that the node
suite pins S05's ethical disclaimer by exact string — a sentence the intro
rewrite had reworded. CI caught it.

The fix went into the content, not the test: that phrase is a prior editorial
win of the same kind as the images above, so the sentence was restored verbatim
and the paragraph kept its new framing. **Lesson: run the composite script, not
the half you remember.**

---

# Pandas 3 re-teach (2026-08-22) — S15 only

Author decision: teach pandas 3, move the pin. A learner who `pip install pandas`
already gets 3.x; pinning 2.3.3 made the gate green and the lesson wrong.

The lesson is three names that look like the same thing:

- `str` — inferred default for homogeneous text (missing as `NaN`);
- `string` — nullable schema contract (`astype('string')`, missing as `pd.NA`), still what CP-N2-A asks for ids;
- `object` — leftover for mixed Python types. Seeing it on a supposed-text column means inference refused to call it `str`.

Not a find-and-replace. Prose that taught `object` as *"el default peligroso de un CSV mal tipado"* was rewritten. Declared outputs were recaptured under pandas 3.0.5 / numpy 2.2.6 (no pyarrow). Manifest memory moved (266→254, 335→315); CSV hashes did not.

`starterCode-14` (S15-T3-A-E3) called `to_datetime(..., errors="ignore")`. In 3.0.5 that path raises a pandas-internal `AssertionError`. `errors='ignore'` is no longer a real option. The starter now uses the default (`raise` → `ValueError`); the learner repairs it with `errors='coerce'`. Countable NaT is still the point.

S15 leftover dual card *"Contrato de esta sección"* folded into the intro; the collapsed reference block already held the stack.

Gate: S15 65/0; all 52 **3265 pass / 0 fail / 92 skip**. The skip increase versus the pandas-2 local run (70) is fastapi/sqlalchemy/cv2 missing from the clean venv.

# Phase E — independent harness validation (S15)

`newbie_packet_builder.py --section 15` produced packet_sha `f2b1e046…` (solutions stripped: no `correctIndex` in the active self-check). `curriculum_learner_firewall.stage_turn` for LEARNER_A / epistemic / S15 verified: stage contains only `AGENTS.md`, `learner_baseline.json`, `packet.json`, `prior_knowledge_state.json`. Context manifest sha256 `84718037…`. Firewall unittest 36/36. Evidence: `audit/content-campaign-c04/evidence/phase_e_s15_firewall.json`.

This is harness validation, not a second human editor and not a full E2 learner journey.

## Still open after D/E
- `LENGTH_TELL` × 21
- Live Pages attestation of this SHA
