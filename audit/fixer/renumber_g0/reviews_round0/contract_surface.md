All paths below are relative to the worktree root `/private/tmp/claude-501/-Users-pabloillescas-Documents-GitHub-pyarcana/cc134761-bb7b-4536-886e-875c53ae213c/scratchpad/mergewt/`.

---

# 1. THE ROADMAP FILE'S EXACT GRAMMAR

`learning_roadmap_52_V3.md` — 830 lines, md5 `e03e4710961aafb746db805fd6a88986`.

## The canonical entry shape

Verbatim byte layout, taken from S19 (lines 327–336). Blank line between **every** block; no trailing whitespace anywhere in the section body (the only 3 trailing-space lines in the whole file are 3, 4, 5 — the `>` blockquote's markdown hard breaks).

```
### S19 — Visualización y comunicación accesible
<blank>
**Prerrequisito:** S18. **Entorno:** local/browser. **Proyecto:** dashboard ejecutivo.
<blank>
- T1 Diseño: pregunta, audiencia y chart choice; ejes, escalas y encodings honestos.
- T2 Estático: Matplotlib/Seaborn; composición, annotations y exportación reproducible.
- T3 Interactivo: Plotly/filtros/tooltips; estado, performance y alternativas accesibles.
- T4 Narrativa: unidades, fuente y limitaciones; color, contraste, texto alternativo y no sobreclaim.
<blank>
**Incremento/gate:** cuatro gráficos estáticos y una vista interactiva, todos con conclusión limitada a evidencia y versión no visual equivalente.
<blank>
```

## Heading form — invariant, 52/52

`### S` + **unpadded** number + ` ` + em dash U+2014 (`—`) + ` ` + title. Confirmed: the only dash character in all 52 headings is `—`; numbers are `S1`…`S9` then `S10`…`S52`, never zero-padded. (Zero-padding `S01`…`S52` appears **only** in the phase-state table, lines 720–771, and the ASCII block, lines 708–711.)

Range notation elsewhere uses en dash U+2013: 29 occurrences of `S<n>–S<n>`, zero hyphenated ranges.

## Metadata line — one line, three bold fields, each ending in `.`

52/52 present. Two documented variants:

| Variant | Count | Lines |
|---|---|---|
| `**Prerrequisito:**` singular | 42 | all others |
| `**Prerrequisitos:**` plural | 10 | 129, 250, 261, 340, 395, 406, 441, 452, 551, 696 |

The plural is used exactly when the prerequisite is a **range or a list**, never for a single section:
- `129` — `**Prerrequisitos:** ninguno.` (S1, the only "ninguno")
- `250` `S8–S11`, `261` `S1–S12`, `340` `S17–S19`, `395` `S21–S24`, `406` `S14–S25`, `551` `S27–S38` (ranges)
- `441` `S12 y S28`, `452` `S7, S13 y S29` (comma + `y` lists)
- `696` `S1–S51 y CP-N4-C aprobado` (range + capstone)

Level-entry sections use a **level name, not a section number**: `274` `**Prerrequisito:** Nivel 1.`, `419` `Nivel 2.`, `564` `Nivel 3.`

**No section has extra or missing fields.** All 52 have exactly `Prerrequisito(s) / Entorno / Proyecto`, in that order, on one line.

### `Entorno` value census (17 distinct values)

| Value | n | Lines |
|---|---|---|
| `local` | 20 | 285, 296, 307, 318, 340, 351, 373, 384, 419, 452, 463, 474, 485, 496, 507, 518, 529, 564, 575, 586 |
| `browser/local` | 6 | 140, 151, 162, 173, 184, 195 |
| `` `local-python` `` (backticked) | 5 | 129, 206, 217, 228, 239 |
| `local/cloud controlado` | 5 | 250, 261, 406, 540, 551 |
| `local/cloud` | 3 | 630, 641, 685 |
| `local/cloud aprobado` | 2 | 395, 652 |
| `local/browser compatible` | 1 | 274 |
| `local/browser` | 1 | 329 |
| `local/sandbox proveedor` | 1 | 362 |
| `local/CI` | 1 | 430 |
| `local DB` | 1 | 441 |
| `local con contenedores` | 1 | 597 |
| `CI/cloud controlado` | 1 | 608 |
| `cloud-lab o emulador` | 1 | 619 |
| `sandbox` | 1 | 663 |
| `sandbox/CI` | 1 | 674 |
| `reproducible local + despliegue demostrable` | 1 | 696 |

Note the inconsistency to imitate: only the three canonical env names from lines 117–119 (`browser-pyodide`, `local-python`, `cloud-lab`) are ever backticked, and only `local-python` actually appears backticked (5×). Bare `local`, `local/browser`, `sandbox` etc. are never backticked.

### `Proyecto` value census — 52 distinct values, no repeats

Three shapes:
1. **Capstone lifecycle markers** (25 of 52): `esqueleto de CP-N1-A.` (1×, S1 only), `inicio CP-Nx-y.` (11×), `cierre CP-Nx-y.` (9×), `cierre CP-Nx-y y regresión Nn.` (3× — S13/S26/S39, the level closes), `CP-FINAL exclusivamente.` (1× — S52).
2. **Named sub-artefacts** in Spanish lowercase: `parser de intake.`, `motor de reglas del intake.`, `reporting factory.`, `control plane.`, `quality gate.`, `escala del triage.`, …
3. One backticked package name: `paquete `familiarity_core`.` (line 228).

**Proyecto never names a capstone by title** — the capstone *titles* live only in the `**Incremento/gate:**` line and the table at lines 49–62.

## The four `- Tn` bullets — 208/208, zero exceptions

Verified mechanically: every one of the 52 sections has **exactly 4** bullets; all 208 match `- T<n> <Label>: <U1>; <U2>.`; all 208 contain exactly the `;` separator; all 208 end in `.`. No section breaks the pattern.

The `;` convention is **load-bearing semantics**, declared at line 33:

> "En cada línea `Tn`, el contenido antes del punto y coma es `U1` y el contenido posterior es `U2`; el ID estable es `Sxx.Tn.U1/U2`."

So each `- Tn` line *is* the definition of the `-A` and `-B` subtopics. The text before `;` → `Sxx-Tn-A`; after `;` → `Sxx-Tn-B`. The label before the `:` is a 1–3-word Spanish noun ( `Runtime`, `Entornos`, `Git`, `Calidad inicial`, `Framing`, `Lineales`, `Árboles/ensambles`, `Experimento`, …) and is **not** reused between sections.

## `**Incremento/gate:**` line — 52/52, one paragraph, no bullets

Two variants:
- **39 sections**: `**Incremento/gate:** <lowercase prose>.` — the increment, then usually a second sentence stating what the exam/gate verifies or what is explicitly deferred.
- **13 sections**: open with the bolded capstone title — `**Incremento/gate:** **<Capstone Title>** …`. Lines 169, 213, 268, 314, 358, 413, 459, 503, 558, 604, 648, 692, 703. These are exactly the 13 capstone gate sections (S4, S8, S13, S17, S21, S26, S30, S34, S39, S43, S47, S51, S52). S26 is the only one that uses `**VP RPA + AI Analyst**:` — bold title followed by a colon rather than a space.

Level-close sections (S13 line 268, S26 line 413, S39 line 558, S52 line 703) append a `Promoción:` sentence naming the regression range and CF gate.

**For writing the three new entries:** none of them is a capstone gate under the stated plan, so all three take the 39-section plain form — lowercase prose, two sentences, one of which states the honest limit or the deferral ("… se difiere al Nivel 2", "La CLI instalable llega en S10", "ER probabilístico en S30").

---

# 2. WHAT IN THE ROADMAP ITSELF REFERENCES A NUMBER

Insertion arithmetic: **S1–S18 unchanged · S19–S32 shift +2 · S33–S52 shift +3.** New sections land at S19, S20, S35.

## 2a. `### SXX` headings — 52 total

| Group | Count | Line range | Exact lines |
|---|---|---|---|
| **S1–S18** (unchanged) | 18 | 127–316 | 127, 138, 149, 160, 171, 182, 193, 204, 215, 226, 237, 248, 259, 272, 283, 294, 305, 316 |
| **S19–S32** (→ +2) | 14 | 327–472 | 327, 338, 349, 360, 371, 382, 393, 404, 417, 428, 439, 450, 461, 472 |
| **S33–S52** (→ +3) | 20 | 483–694 | 483, 494, 505, 516, 527, 538, 549, 562, 573, 584, 595, 606, 617, 628, 639, 650, 661, 672, 683, 694 |

## 2b. `**Prerrequisito(s):**` lines — 52 total, 49 of which name a number

| Group | Count | Lines |
|---|---|---|
| **before S19** (metadata lines 129–318) | 18 | 129, 140, 151, 162, 173, 184, 195, 206, 217, 228, 239, 250, 261, 274, 285, 296, 307, 318 |
| **S19–S32** (→ +2) | 14 | 329, 340, 351, 362, 373, 384, 395, 406, 419, 430, 441, 452, 463, 474 |
| **S33–S52** (→ +3) | 20 | 485, 496, 507, 518, 529, 540, 551, 564, 575, 586, 597, 608, 619, 630, 641, 652, 663, 674, 685, 696 |

Three carry **no number** (`ninguno` at 129, `Nivel 1/2/3` at 274, 419, 564) — but note line 419 (`Nivel 2.`) and 564 (`Nivel 3.`) still need review because the level *definitions* change (see 2d).

**Backward-pointing prerequisites that cross an insertion point and therefore change value even though the citing section may not move:**

| Line | Current | Must become | Why |
|---|---|---|---|
| 318 | `S17` (S18's prereq) | `S17` — unchanged | both ≤18 |
| 329 | `S18` (S19's prereq) | **this section becomes S21; its prereq becomes the new S20** | the two new sections are inserted between |
| 340 | `S17–S19` | `S17–S22` | range straddles the insertion: S17 fixed, S19→S21, plus the two new S19/S20 fall inside |
| 395 | `S21–S24` | `S23–S26` | |
| 406 | `S14–S25` | `S14–S27` | start fixed, end +2 |
| 441 | `S12 y S28` | `S12 y S30` | mixed: one fixed, one +2 |
| 452 | `S7, S13 y S29` | `S7, S13 y S31` | mixed |
| 485 | `S32` (S33's prereq) | **S33→S36; prereq becomes the new S35** | the new section is inserted between |
| 551 | `S27–S38` | `S29–S41` | both +2/+3 — **the range now spans two different shift amounts** |
| 696 | `S1–S51 y CP-N4-C` | `S1–S54 y CP-N4-C` | |

## 2c. Prose / gate-line cross-references by number

Every non-heading, non-metadata line that names a section number, with the required action:

| Line | Context | Current token(s) | Must become |
|---|---|---|---|
| 1 | H1 title | `(S1–S52)` | `(S1–S55)` |
| 10 | scope prose | `S1–S13`, `S1–S52` | `S1–S13`, `S1–S55` |
| 12 | scope prose | `S1–S13` | unchanged |
| 18–31 | contract table | see §5 | see §5 |
| 39–42 | level table, "Secciones" col | `S1–S13`, `S14–S26`, `S27–S39`, `S40–S52` | `S1–S13`, `S14–S28`, `S29–S42`, `S43–S55` |
| 44 | promotion prose | `las 13 secciones`, `S52` | `S55` + "13" is now wrong for 3 of 4 levels |
| 50–62 | capstone table, Gate col | S4, S8, S13, S17, S21, S26, S30, S34, S39, S43, S47, S51, S52 | S4, S8, S13, S17, **S23, S28, S32, S36, S42, S46, S50, S54, S55** |
| 66 | H2 heading | `## Ciclo obligatorio repetido en S1, S2, …, S52` | `… S55` |
| 101 | total-regression prose | `S52` | `S55` |
| 107–111 | CF table | `CF-1 · S13`, `CF-2 · S26`, `CF-3 · S39`, `CF-4 · S47`, `CF-5 · S51` | S13, **S28, S42, S50, S54** |
| 113 | CF prose | `bloquea S52` | `bloquea S55` |
| 121 | "Desde Sn" transversal practices — **11 tokens on one line** | S1, S2, S5, S8, S9, S12, S27, S32, S40, S44, S49 | S1, S2, S5, S8, S9, S12, **S29, S34, S43, S47, S52** |
| 125 | level-1 H2 | `## Nivel 1 — S1–S13 ·` | unchanged |
| 169 | S4 gate | `La CLI instalable llega en S10.` | unchanged |
| 213 | S8 gate | `Se convierte en paquete durante S10.` | unchanged |
| 268 | S13 gate | `el diseño visual completo se aprende en S19 y ER probabilístico en S30`; `regresión S1–S13` | **`en S21 … en S32`**; `S1–S13` unchanged |
| 270 | level-2 H2 | `## Nivel 2 — S14–S26 ·` | `S14–S28` |
| 413 | S26 gate | `regresión S14–S26` | `S14–S28` |
| 415 | level-3 H2 | `## Nivel 3 — S27–S39 ·` | `S29–S42` |
| 558 | S39 gate | `regresión S27–S39` | `S29–S42` |
| 560 | level-4 H2 | `## Nivel 4 — S40–S52 ·` | `S43–S55` |
| 703 | S52 gate | `52/52 secciones`, `regresión S1–S52` | `55/55`, `S1–S55` |
| 708–711 | ASCII phase map | `S01…S13`, `S14…S26`, `S27…S39`, `S40…S52` | `S01…S13`, `S14…S28`, `S29…S42`, `S43…S55` |
| 716 | ledger prose | `52 filas` (line 714), `cada S01–S52` | `55 filas`, `S01–S55` |
| 714 | ledger prose | `El ledger debe contener 52 filas` | `55 filas` |
| 720–771 | **phase-state table, 52 rows** | `S01`…`S52` in col 1 **plus a prose cross-ref in col 3 of every row** (`ninguna hasta S02 cerrada`, `luego gate CP-N1-A`, …) | 55 rows; every row's col-1 id and col-3 back-reference renumbered; 3 new rows inserted |
| 775 | hours prose | `S1–S52`, `960 horas`, `1,040 horas` | `S1–S55` + recomputed hours (§5) |
| 783–791 | production-status table | `S1–S52`, `408 de S2–S52`, `1,224 de S2–S52`, `408/1,224`, `52 exámenes`, `S2–S52` | §5 |

**Gate-line cross-refs that cross an insertion point and are easy to miss:** line 268 (`S19`→`S21`, `S30`→`S32`) and line 121 (five of eleven tokens change). Lines 169 and 213 point at S10 and are safe.

## 2d. Headings/prose that assert "13 per level" — these break structurally, not numerically

Line 7 (`Escala: 4 niveles × 13 secciones = 52 secciones`), line 18 (table row `Secciones | 1 | 13 | 52`), line 44 (`aprobar las 13 secciones`), lines 39–42, 125/270/415/560, 708–711. After insertion the levels are **13 / 15 / 14 / 13**. There is no renumbering that preserves "× 13"; this is a prose rewrite, not a substitution. Call it out explicitly in the proposal.

---

# 3. THE OTHER ROADMAP COPIES

| Path | Lines | md5 | Verdict |
|---|---|---|---|
| `learning_roadmap_52_V3.md` | 830 | `e03e4710961aafb746db805fd6a88986` | **AUTHORITATIVE + PROTECTED + READ BY CODE** |
| `upload/learning_roadmap_52_V3.md` | 830 | `e03e4710961aafb746db805fd6a88986` | **byte-identical duplicate — and separately READ BY TESTS.** Must receive the identical diff. |
| `learning_roadmap.md` | 5129 | `96969de82aa39e27e970b6439b19e55d` | **different document, different grammar** (`## N. Title` headings, per-section `### Auto-evaluación — Requisitos detallados del examen`). READ BY TESTS. Still cited as "primary for section IDs". |
| `upload/learning_roadmap_v2_master.md` | 1617 | `c6c0b9a15540dc12b2889cd3ca3f2396` | **historical.** Only referenced by a stale absolute path `/home/z/my-project/upload/...` in `scripts/build_roadmap_json.py:3,1555` and `scripts/roadmap_sections.json:3` — never actually opened. |
| `el_arte_de_python_roadmap_maestro_52_secciones.md` | 548 | `fcd74a1ce0ab9f405659582ee4a24666` | **historical.** 5th copy you did not list. Only named as a string in `industry_alignment/source_registry.json:338`. No code reads it. |
| `El Arte de Python — Master Roadmap v2.0 + …md` | 77 KB | — | historical, no readers. |

## Readers, with file:line

**`learning_roadmap_52_V3.md` (repo root):**
- `tests/adversarial/test_active_v3_curriculum_contract.py:12` — `ROADMAP = ROOT / "learning_roadmap_52_V3.md"`; parsed at `:28` by `^### S(\d+) — (.+)$`
- `scripts/generate_topic_evaluations.py:23` — `ROADMAP = ROOT / "learning_roadmap_52_V3.md"`; parsed at `:87` by `^### S(\d+)\s+[—\-]\s+(.+)$`
- `scripts/generate_preservation_manifest.mjs:29` — in `PROTECTED_PREFIXES`, SHA-256'd into every preservation manifest
- `audit/safe-agent/protected-paths.json:16` — protected prefix list

**`upload/learning_roadmap_52_V3.md`:**
- `scripts/v3_regression.spec.ts:309` — asserts 52 `^### S\d+ —` headers (`:314–315`)
- `scripts/v3_regression.spec.ts:320` — asserts 4 `^## Nivel \d —` headers (`:324–325`)
- `scripts/v3_regression.spec.ts:330` — asserts 13 unique `CP-N\d-[ABC]|CP-FINAL` (`:335–338`)
- `course-state/course_requirements.json:33` — `"source_file": "upload/learning_roadmap_52_V3.md"`

**`learning_roadmap.md`:**
- `scripts/regression.spec.ts:257` — asserts 52 `^## \d+\. ` headers
- `scripts/regression.spec.ts:266` — asserts 52 `^### Auto-evaluación — Requisitos detallados del examen$`
- `scripts/regression.spec.ts:274` — asserts 3 `^## Fase [1-3] —` headers
- `scripts/generate_roadmap.js:257` — **writes** it (`const outputPath = 'learning_roadmap.md'`)
- cited as authority for stable slugs in `course-state/s23_phase3.json:44,61` and `course-state/s04_phase2.json:78`

**Consequence for the proposal:** the human must apply the diff to **both** `learning_roadmap_52_V3.md` and `upload/learning_roadmap_52_V3.md`, or `scripts/v3_regression.spec.ts:315` fails against a 55-section root file while reading a 52-section upload copy — a silent divergence that no test catches today because nothing diffs the two.

---

# 4. EVERY TEST OR SCRIPT THAT BINDS A SECTION TO THE ROADMAP

Beyond the one you already know (`tests/adversarial/test_active_v3_curriculum_contract.py` — `:28` title regex, `:39/:45` `range(1,53)`, `:117` `range(s, s+13) for s in (1,14,27,40)`):

## Counts roadmap headings
| file:line | Assertion |
|---|---|
| `scripts/v3_regression.spec.ts:314–315` | `upload/` copy has exactly 52 `^### S\d+ —` |
| `scripts/v3_regression.spec.ts:324–325` | exactly 4 `^## Nivel \d —` |
| `scripts/v3_regression.spec.ts:335–338` | exactly 13 unique capstone ids in the file |
| `scripts/regression.spec.ts:261` | `learning_roadmap.md` has 52 `^## \d+\. ` |
| `scripts/regression.spec.ts:269` | `learning_roadmap.md` has 52 exam-spec headings |
| `scripts/regression.spec.ts:274` | `learning_roadmap.md` has 3 `^## Fase [1-3] —` |
| `scripts/generate_topic_evaluations.py:249` | `if len(sections) != 52` — hard abort when parsing the V3 roadmap |

## Maps roadmap topics → subtopicIds
| file:line | What it does |
|---|---|
| `scripts/generate_topic_evaluations.py:27–80` | `SECTION_IDS: dict[int, str]` — a **hardcoded 1→52 number-to-slug table**. Every entry from 19 up is wrong after the shift. |
| `scripts/generate_topic_evaluations.py:83–100` | `parse_roadmap()` — splits each `- Tn …; …` line on `;` to produce U1/U2 → writes `course-state/topic_evaluations/sNN_te.json` (53 files on disk: `s01_te.json`…`s52_te.json` + `_manifest.json`) |
| `scripts/generate_topic_evaluations.py:282` | `"expected": {"sections": 52, "topic_evaluations": 208, "tasks": 416}` |
| `tests/adversarial/test_active_v3_curriculum_contract.py:51–54` | string-equality `title:` ↔ `### SXX — Title` (you knew this) |
| `tests/adversarial/test_active_v3_curriculum_contract.py:56–65` | 8 subtopicIds / 8 demoIds / 24 exercise ids, all prefixed `S{number:02d}` |

## Asserts the roadmap's/curriculum's own structure
| file:line | Assertion | Breaks how |
|---|---|---|
| `tests/adversarial/test_curriculum_preservation.py:38` | `len(active) == 52` | → 55 |
| `tests/adversarial/test_curriculum_preservation.py:47` | `nums == list(range(1,53))` | → `range(1,56)` |
| `tests/adversarial/test_curriculum_preservation.py:53` | each section retains 24 exercise ids prefixed `S{nn}` | prefix must be the **new** number |
| `tests/adversarial/test_curriculum_preservation.py:57–` | exercise ids globally unique | a mid-rename state collides |
| `tests/adversarial/test_runtime_audit_classify.py:116` | `len(stems) == 52` | → 55 |
| `tests/adversarial/test_section_capstone_mapping.py:33` | `[f"S{n:02d}" for n in range(1,53)]` | → 56 |
| `tests/adversarial/test_section_capstone_mapping.py:35–40` | `LEVEL_RANGES = {1:(1,13), 2:(14,26), 3:(27,39), 4:(40,52)}` | → `(1,13),(14,28),(29,42),(43,55)` |
| `tests/adversarial/test_section_capstone_mapping.py:42–56` | `GATE_MAP` of 13 `Sxx → CP-…` | 9 of 13 keys change |
| `tests/adversarial/test_section_capstone_mapping.py:99` | `len(sections) != 52` | → 55 |
| `tests/adversarial/test_capstone_cardinality.py:43–48` | `EXPECTED_TOTAL = 13`; `L1 ["S04","S08","S13"]`, `L2 ["S17","S21","S26"]`, `L3 ["S30","S34","S39"]`, `L4 ["S43","S47","S51"]`, Final `S52`; `:17` CP-N4-C sub-gates `S49/S50/S51` | 12 of 16 ids change |
| `tests/adversarial/test_capstone_consistency.py:57,174` | 13 capstones / 13 graph nodes | count survives, gate ids don't |
| `tests/adversarial/test_master_curriculum_specificity.py:12–16` | `MASTER_FILES` = section files whose **filename digits** are `40 <= n <= 52`; `:36,:107` assert `== 13` | filenames are frozen (§6) → this glob silently selects the wrong 13 files |
| `tests/adversarial/test_late_curriculum_transfer_contract.py:14,21` | `for number in range(31,40)` then regex `id:\s*"S{number:02d}-T{topic}-{half}-E{exercise}"` | hard-codes S31–S39 ids → must become S33–S42 |
| `tests/adversarial/test_late_curriculum_transfer_contract.py:29` | `active_sections()[33]` | → `[36]` |
| `tests/adversarial/test_forward_dependencies.py:29–47` | resolves the teaching boundary by `index:` + `id` ordering. `:13` explicitly says "resolved by its `id`, not by a number, so a rename cannot silently move the boundary" — **but the boundary itself is `index:` order**, so renumbering changes which construct counts as "forward". The two decided policies (D9/D10) cite S01, S02–S08 — all unaffected; higher-number pairings must be re-verified. |
| `tests/adversarial/test_forward_dependencies.py:64` | matches `^\s{4}'([a-z0-9-]+)': \{` in `SectionView.tsx` (52 keys) | slug-keyed → safe |
| `tests/adversarial/test_phrase_bank_sc_keys_gates.py:115` | `for s in range(1,53)` | → 56 |
| `tests/adversarial/test_concept_prompt_weight.py:237,249,272` | `[f"s{i:02d}" for i in range(1,53)]` | → 56 |
| `tests/adversarial/test_section_id_db_migration.py:76` | fixture row with `'S08-T1-A-E1'` | S08 unaffected |
| `scripts/v3_regression.spec.ts:279–280` | 52 `import { sectionN }` / 52 `sectionN,` entries | → 55 |
| `scripts/v3_regression.spec.ts:81–82,102–113,126–129` | ledger 52 rows, ids `S01..S52` in order, 13 per level ×4 | 13-per-level becomes 13/15/14/13 |
| `scripts/v3_regression.spec.ts:144–145,155–169,186–198` | 13 capstones, 13 gate sections, 5 CF gate sections | 9 capstone + 3 CF gate ids change |
| `scripts/goal_verification_gate.py:61–106` | `for n in range(1,53)`: requires `SNN_STORM.json` **and** `SNN_PARAGRAPHS.md` to exist, with `n_logged == n` and `len(cycles) == n` | **the STORM cycle count is tied to the section number itself** — renumbering S19→S21 makes `n_logged=19` fail against `n=21`. Not a rename; the artifacts must be regenerated. |
| `scripts/goal_verification_gate.py:114–115` | `len(imports) != 52` | → 55 |
| `scripts/goal_verification_gate.py:117` | samples `"s01-setup", "s36-ai-apis-advanced", "s52-career-strategy"` | filenames frozen → stale but passing |
| `scripts/v3_invariant_validator.py:20–30,96–99,146–147` | `CANONICAL["sections"]=52`, `section_files < 52`, `ledger rows != 52` | §5 |
| `scripts/course_complete_gate.py:19,24,40` | `len(sections)==52`, `len(caps)==13`, `total_ex==1248 and total_demos==416` | §5 |
| `scripts/export_interaction_catalog.mjs:135–143` | `expected_sections:52, expected_demos:416, expected_exercises:1248`; gate `unique.length===52 && totals.demos===416 && totals.exercises>=1200` | §5 |
| `scripts/e2e_max/01_chrome_pages.spec.ts:10` | `expect(cat.totals.demos).toBe(416)` | → 440 |
| `scripts/newbie_agentic_validator.py:475,602,642,781,835,919,967,1019,1142,1461,1500` | eleven `range(1,53)` loops + `summary["both_pass"] == 52`; `:522` `need>=100 (52 sections × 2 agents)` | → 55 / 110 |
| `scripts/newbie_live_phase_runner.py:537,582` | `range(1,53)`; `summary["clean_52"] = both_pass_count == 52` | key name itself encodes 52 |
| `scripts/newbie_walkthrough_runner.py:185,458` · `scripts/newbie_packet_builder.py:884` · `scripts/newbie_agentic_llm_walk.py:108` · `scripts/generate_capstone_validation.py:57` · `scripts/shell_primitive_first_use_audit.py:171` | `range(1,53)` | → 56 |
| `scripts/newbie_packet_builder.py:348` | regex literal `"(52 secciones · método I Do / We Do / You Do · proyectos de portafolio)"` | must match `Dashboard.tsx:410` |
| `src/lib/progress-document.test.ts:30,81,86,98,102` | `const TOTAL = 52`; asserted copy strings `"ha completado 8 de 52 secciones"`, `"ha completado las 52 secciones"` | → 55 |
| `scripts/playwright_visible_paragraphs.mjs:253` | screenshots `[1,23,36,40,52]` | cosmetic, but these now point at different lessons |
| `industry_alignment/_phase3_build/build_curriculum_graph.py:406–407,486,764,931,1018,1138` | parses `topicEvaluations` blocks; `:1018` sums `topic_evaluations` | regenerates `curriculum_skill_graph.json` (52 `sections`, `sectionNumber` field) |

**Dead/quarantined (do not migrate, but inventory them):** `scripts/quarantine_theater/**` (9 files with `range(1,53)` / `range(40,53)`) and `scripts/quarantine_bulk_rewriters/*.py.disabled` (6 files naming S23–S52 ranges).

---

# 5. THE DERIVED-NUMBER SURFACE

## 5a. The relationship is **not** uniformly a simple multiple

Per-section counts (24 / 8 / 4 / 1) are unchanged, so course totals scale ×55/52 cleanly. **Per-level counts do not**, because the three insertions are not distributed evenly: levels become **N1 = 13 · N2 = 15 · N3 = 14 · N4 = 13**. Every "Por nivel" figure and every `sections_per_level: 13` is now a *non-constant* and must either be deleted or become a per-level array.

| Asset | /section | Course now | Course at 55 | Per level now | Per level at 55 |
|---|---:|---:|---:|---|---|
| Sections | 1 | 52 | **55** | 13 | **13/15/14/13** |
| Temas | 4 | 208 | **220** | 52 | **52/60/56/52** |
| Subtemas | 8 | 416 | **440** | 104 | **104/120/112/104** |
| Demos I Do | 8 | 416 | **440** | 104 | **104/120/112/104** |
| Ejercicios | 24 | 1,248 | **1,320** | 312 | **312/360/336/312** |
| Evaluaciones de tema | 4 | 208 | **220** | 52 | **52/60/56/52** |
| Familias A/B/C | 8 | 416 | **440** | 104 | **104/120/112/104** |
| Variantes almacenadas | 24 | 1,248 | **1,320** | 312 | **312/360/336/312** |
| Exámenes de sección | 1 | 52 | **55** | 13 | **13/15/14/13** |
| Ítems por intento | 8 | 416 | **440** | 104 | **104/120/112/104** |
| Máx. respuestas en 3 intentos | 24 | 1,248 | **1,320** | 312 | **312/360/336/312** |
| Incrementos de proyecto | 1 | 52 | **55** | 13 | **13/15/14/13** |
| Capstones de nivel | — | 12 | **12 (unchanged)** | 3 | 3 |
| Capstone final | — | 1 | **1 (unchanged)** | — | — |

## 5b. file:line, current value → required value

### Roadmap's own contract table — `learning_roadmap_52_V3.md`
| Line | Current | → |
|---|---|---|
| 7 | `4 niveles × 13 secciones = 52 secciones` | **not a multiple** — must be rewritten as 13+15+14+13 = 55 |
| 18 | `\| Secciones \| 1 \| 13 \| 52 \|` | `1 \| 13/15/14/13 \| 55` |
| 19 | `\| Temas \| 4 \| 52 \| 208 \|` | `4 \| … \| 220` |
| 20 | `… 8 \| 104 \| 416` | `… 440` |
| 21 | `… 8 \| 104 \| 416` | `… 440` |
| 22 | `… 24 \| 312 \| 1,248` | `… 1,320` |
| 23 | `… 4 \| 52 \| 208` | `… 220` |
| 24 | `… 8 \| 104 \| 416` | `… 440` |
| 25 | `… 24 \| 312 \| 1,248` | `… 1,320` |
| 26 | `… 1 \| 13 \| 52` | `… 55` |
| 27 | `… 8 \| 104 \| 416` | `… 440` |
| 28 | `… 24 \| 312 \| 1,248` | `… 1,320` |
| 29 | `… 1 \| 13 \| 52` | `… 55` |
| 30–31 | `12`, `1` | unchanged |
| 714 | `El ledger debe contener 52 filas` | `55 filas` |
| 775 | `960 horas curriculares` + `80` = `1,040 horas` | **not a multiple.** 960 was 4×240, an allocation the repo already repudiated (`test_active_v3_curriculum_contract.py:84–99`). Recompute from the three new sections' content, or state the figure as derived. |
| 785 | `416 demos I Do … 408 de S2–S52 no producidos` | `440 … 432 de S2–S55` |
| 786 | `1,248 ejercicios … 1,224 de S2–S52` | `1,320 … 1,296 de S2–S55` |
| 787 | `416 familias / 1,248 variantes … 408/1,224` | `440 / 1,320 … 432/1,296` |
| 789 | `52 exámenes y lógica de tres intentos` | `55 exámenes` |
| 783, 791 | `Arquitectura S1–S52`, `S2–S52` | `S1–S55`, `S2–S55` |

### `course-state/course_requirements.json` — `invariant_vector`
| Line | Key | Current | → |
|---|---|---:|---|
| 13 | `levels` | 4 | 4 |
| 14 | `sections` | 52 | **55** |
| 15 | `sections_per_level` | 13 | **invalid — no single value.** Replace with `sections_per_level: [13,15,14,13]` or drop. |
| 16 | `topics_per_section` | 4 | 4 |
| 17 | `subtopics_per_topic` | 2 | 2 |
| 18 | `subtopics` | 416 | **440** |
| 19 | `demos_per_subtopic` | 1 | 1 |
| 20 | `demos` | 416 | **440** |
| 21 | `student_exercises_per_subtopic` | 3 | 3 |
| 22 | `student_exercises` | 1248 | **1320** |
| 23 | `topic_evaluations` | 208 | **220** |
| 24 | `variants_per_subtopic` | 3 | 3 |
| 25 | `exam_variants` | 1248 | **1320** |
| 26 | `section_exams` | 52 | **55** |
| 27 | `section_project_increments` | 52 | **55** |
| 28 | `level_capstones` | 12 | 12 |
| 29 | `final_capstones` | 1 | 1 |
| 30 | `capstones_total` | 13 | 13 |

Also in that file: `:35` `"does_not": "replace, reduce, or renumber the existing 52 sections in learning_roadmap.md"` — **this is a written non-renumbering commitment that the migration contradicts.** It needs an explicit amendment, not a silent edit. `:37` restates 416/1248/1248. `:42` lists the 13 gates `S4/S8/S13/S17/S21/S26/S30/S34/S39/S43/S47/S51/S52`. `:43` lists `CF-1(S13), CF-2(S26), CF-3(S39), CF-4(S47), CF-5(S51)`. `:57` maps `S13→CP-N1-C, S26→CP-N2-C, S39→CP-N3-C, S51→CP-N4-C` and "Add 9 new capstone gates at S4/S8/S17/S21/S30/S34/S43/S47".

### `course-state/section_ledger.json`
- `:5` `"last_updated_note": "All S01-S52 section-level PHASE 6 authorized and marked passed"` → S01–S55
- `:6–817` — **52 objects**, each with `"id": "SNN"` (line 8 + every 16–17 lines), `"section_id": "<slug>"`, `"level": 1..4`, and `"units_done": ["SNN-T1-A", … 8 entries]`. **52 × (1 id + 8 unit ids) = 468 number-bearing strings**; 3 new objects to insert; 34 objects renumbered.
- `:835–839` `summary`: `total_sections: 52`, `passed: 52` → **55 / 55**
- `:841–844` `course_progress`: `sections_passed: 52`, `sections_total: 52` → **55 / 55**

### `scripts/v3_invariant_validator.py` — `CANONICAL`
| Line | Current | → |
|---|---|---|
| 21 | `"sections": 52` | **55** |
| 22–29 | `topics_per_section 4`, `subtopics_per_topic 2`, `subtopics_per_section 8`, `demos_per_section 8`, `exercises_per_section 24`, `exam_variants_per_section 24`, `concepts_per_section 8`, `variants_per_concept 3` | **all unchanged** — these are per-section |
| 96–99 | `if len(section_files) < CANONICAL["sections"]` | reads `glob("s*.ts")` filtered by `^s\d{2}-`, which also picks up the 5 **inactive** files, so it currently counts 57 — the `<` makes it pass by luck. At 55 it still passes by luck. Flag as a latent bug. |
| 146–147 | `if n != 52: "section_ledger rows=… want 52"` | **55** |

### `scripts/course_complete_gate.py`
| Line | Current | → |
|---|---|---|
| 19 | `len(sections) == 52` | **55** |
| 24 | `len(caps) == 13` | 13 |
| 40 | `total_ex == 1248 and total_demos == 416` | **1320 / 440** |

Caveat at `:34–39`: it globs `s*.ts` filtered by `^s\d{2}-`, which **includes the 5 inactive files** (`s07-pandas`, `s08-visualization`, `s09-sklearn`, `s10-testing`, `s11-advanced-topics`). Their demo ids are deduped per-file, not globally, so the current 416/1248 pass depends on the orphans' ids colliding with active ones. Any id renumbering can break this in a non-obvious way.

### Hours and phases — `src/lib/course/index.ts`
| Line | Current | → |
|---|---|---|
| 63 | `totalSections: 52` | **55** |
| 64 | `totalHours: 491` | **491 + h(newS19) + h(newS20) + h(newS35)** |
| 93 | `{ id: 0, … sections: '1-13', hours: 118 … }` | `'1-13'`, **118** (unchanged) |
| 94 | `{ id: 1, … sections: '14-26', hours: 118 … }` | **`'14-28'`, 118 + h(newS19) + h(newS20)** |
| 95 | `{ id: 2, … sections: '27-39', hours: 118 … }` | **`'29-42'`, 118 + h(newS35)** |
| 96 | `{ id: 3, … sections: '40-52', hours: 137 … }` | **`'43-55'`, 137 (unchanged)** |
| 2–56 | 52 `import { sectionNN } from './sections/<stem>'` | 55 imports; `sectionNN` bindings for 34 of them renamed |
| 69–81 | 52 entries in `COURSE_SECTIONS` + 4 phase comments | 55 entries; comments `(1-13)`, `(14-28)`, `(29-42)`, `(43-55)` |

Per-level hour sums today, verified: **N1 118** (S01=10, S02–S13=9×12), **N2 118** (S15=10, rest 9), **N3 118** (S33=10, rest 9), **N4 137** (S52=29, rest 9). Total 491 ✓. `test_active_v3_curriculum_contract.py:117` computes these with `range(s, s+13) for s in (1,14,27,40)` and `:119` requires `phase_hours == per_level` — that line must become variable-length ranges `(1,14),(14,29),(29,43),(43,56)`. `:120` requires `totalHours: {total}` to equal the sum of all `estimatedHours`. `:101–102` band `380 ≤ total ≤ 760` has headroom for three new sections at ~9h each (→ ~518). `:108` exempts only `number == 52` from the `≤ 20h` cap — **must become 55**, or S55 (the CP-FINAL carrier, 29h) fails.

### Checkpoint / reports / catalogs
| file:line | Current | → |
|---|---|---|
| `course-state/checkpoint.json:4` | `"current_section": "S52"` | `"S55"` |
| `:9–10` | `sections_passed_count: 52`, `sections_total: 52` | 55 / 55 |
| `:15–23` | `subtopics "416/416"`, `demos "416/416"`, `student_exercises "1248/1248"`, `exam_variants_in_db "1248/1248"`, `topic_evaluations "208/208"`, `section_exams "52/52"`, `section_project_increments "52/52"` | 440/440, 440/440, 1320/1320, 1320/1320, 220/220, 55/55, 55/55 |
| `:26–27` | `total_rows: 1248`, `distinct_sections: 52` | 1320 / 55 |
| `course-state/capstone_ledger.json:7,18,29,40,51,62,73,84,95,106,117,128,139` | `gate_section` S04,S08,S13,S17,**S21,S26,S30,S34,S39,S43,S47,S51,S52** | S04,S08,S13,S17,**S23,S28,S32,S36,S42,S46,S50,S54,S55** |
| `course-state/capstone_ledger.json:152,159,166,173,180` | CF gates S13,**S26,S39,S47,S51** | S13,**S28,S42,S50,S54** |
| `:187` | `total_capstones: 13` | 13 |
| `course-state/course_complete_report.json:7` | `demos: 416` | 440 (regenerated output) |
| `course-state/interaction_catalog.json:12,18` | `demos: 416`, `expected_demos: 416` | 440 (regenerated) |
| `course-state/e2e_max_report.json:6` | `demos: 416` | 440 (regenerated) |
| `course-state/issue_registry.json:16` | `"total_v3_demos=416"` | 440 |
| `course-state/exam_selfcheck_pedagogy_report.json:4` | `unique_concepts: 416` | 440 |
| `course-state/python_content_skeptical_final.json:11` | `exam_concepts: 416` | 440 |
| `capstone_validation/reality/section_capstone_mapping.json` | 52 objects, each `{section:"SNN", level, contributesToCapstones, isGate, gatesCapstone, artifactRole}` | 55 objects; 34 renumbered; `level` boundaries shift |
| `industry_alignment/curriculum_skill_graph.json` | 52 `sections`, each with `sectionNumber` + `topicEvaluations` block (first at `:567`) | regenerate via `industry_alignment/_phase3_build/build_curriculum_graph.py` |

### UI / copy strings that state 52 (user-visible, 30+ sites)
`src/lib/course/index.ts:63` is the single source for `totalSections`; `src/components/course/PdfReport.tsx:119` derives `TOTAL_SECTIONS = SECTION_IDS.length`. But these **hardcode the literal "52" in prose** and must each be changed:
- `src/lib/i18n.ts:164,170,174,175,239,284,310` (es-PE) · `:451,457,461,462,526,571,597` (es) · `:738,744,748,749,813,858,884` (en) — **21 strings**
- `src/components/course/Dashboard.tsx:132,146,410`
- `src/components/course/PricingPage.tsx:245`
- `src/lib/subscription-plans.ts:70,80`
- `src/components/course/AdminDashboard.tsx:552` (`"Matriz de progreso (52 × sub-pasos)"`)
- `src/components/course/RichText.tsx:36`, `QAFooterBridge.tsx:28`, `figures/archetypes/index.tsx:19`, `progress-document.ts:8` (comments)
- `src/components/course/PdfReport.tsx:113` (`"career-strategy": '52. Career'` — a hardcoded numbered label, must become `'55. Career'`)
- `src/lib/progress-document.test.ts:30,81,86,98,102` (asserts the exact Spanish strings)
- `scripts/newbie_packet_builder.py:348` (regex that must match `Dashboard.tsx:410`)

Not to touch: `s10-modules-packaging-cli.ts:1546,1548,1557,1565,1580` (`width=52`), `StackFigure.tsx:25,29` (`layerH = 52`), `figures/data/misc.ts:704`, `S03TriState.tsx:97`, `Ornaments.tsx:53`, `SectionView.tsx:2205`, `navigation-menu.tsx:93` — unrelated 52s.

### Badge / credential layer (two divergent copies)
- `src/lib/eligibility/badge_catalog.json` — md5 `e187a2a3099ef37255ed38ccc332da39`, 31 badges, **664 strings containing `Sxx`**: 428 in `badges[].required_activities[]` (shape `"S01-YOUDO"`), 231 in `badges[].required_sections[]` (shape `"S01"`), 4 in `public_claim` prose, 1 in `newbie_friendly_description`. Zero `Sxx-Tn-…` ids.
- `industry_alignment/badge_catalog.json` — md5 `f76097c54fd9fbc2c0ac10da4860f05a`, **already divergent**. `tests/adversarial/test_eligibility_engine.py:44` reads the `industry_alignment/` one; `test_claim_evidence_contracts.py:23`, `test_no_inflated_badge_names.py:26`, `test_final_capstone_supplementary_gap.py:42`, `test_credential_tamper_resistance.py:75` read the `src/lib/eligibility/` one. **Both need the renumber, and they are not currently kept in sync.** Regenerator: `industry_alignment/_phase6_build/build_badge_architecture.py:3819`.

---

# 6. SECTION FILE ANATOMY

## The decoupling you must honour first

`src/lib/course/sections/s19-databases-orm.ts:1–10` states it explicitly:

> "The filename and the exported id (`"databases-orm"`) both come from a pre-V3 ordering and no longer describe what this section teaches. The id is the URL hash and a learner save key, so it cannot be changed without losing progress."

So a section's identity splits in two:
- **Frozen forever:** the filename stem (`s19-databases-orm`) and `id:` slug (`databases-orm`). I verified all 52: filename digits and `index:` currently agree, but the slugs are historical and already mismatched to content (`s14-security.ts` has `title: "NumPy y cómputo vectorizado"`).
- **Must be renumbered:** `export const sectionNN`, `index:`, and every `Sxx-…` id.

`src/lib/section-id-migrations.ts:16–28` holds `SECTION_ID_RENAMES` (11 Batch-A slug renames) and `:30` `SECTION_ID_SCHEMA_VERSION = 1`. `scripts/section_id_renames.mjs:51–60` rejects any rename whose target "is section X, not section Y" — i.e. **a slug may never move to a different section number.** This is the hard reason the slugs/filenames must stay put while the numbers move.

**The blocker you must put in the proposal:** `scripts/preservation_sentinel.mjs:107` harvests `\bid:\s*['"](S\d{2}-T\d-[AB]-E[1-3])['"]` into `exerciseIds`, `:151` diffs them against the base commit, and `:174–179` fails with `EXERCISE_IDS_REMOVED` on **any** removal. There is **no** rename mechanism for exercise ids — only for section slugs. Renumbering S19→S21 removes 24 exercise ids and adds 24 new ones; across the 34 shifting sections that is **816 removed exercise ids** and the sentinel fails hard. The migration needs either an exercise-id rename map (new code, mirroring `SECTION_ID_RENAMES`) or an explicit sentinel baseline waiver. Either way it is a code change, not a data change.

## One section file, field by field — `src/lib/course/sections/s19-databases-orm.ts` (1883 lines)

| Field | Occurrences | Unique | Lines / shape |
|---|---:|---:|---|
| `/** S19 — <title>` header comment | 1 | 1 | `:1` |
| `export const section19` | 1 | 1 | `:13` |
| `index: 19` | 1 | 1 | `:15` |
| `id: "databases-orm"` (slug) | 1 | 1 | `:14` — **FROZEN, do not touch** |
| `subtopicId: "S19-Tn-X"` | **40** | 8 | `:97,136,168,208,246,280,323,354` (learningOutcome/theory refs) then repeated in iDo `:396,423,454,494,…`, weDo, youDo, selfCheck blocks |
| `demoId: "S19-Tn-X-DEMO"` | 8 | 8 | `:395,422,453,493,538,571,598,625` |
| exercise `id: "S19-Tn-X-En"` | 24 | 24 | E1/E2/E3 per subtopic |
| figure id `"S19-<slug>"` | 1 | 1 | `"S19-chart-choice"` |
| `figure: {` inline blocks | 1 | — | `:129` |
| `topicEvaluations` | **0** | — | absent from this file (see below) |
| `estimatedHours: 9` | 1 | — | `:19` |
| `phase: 1` | 1 | — | `:21` |
| **distinct `S19-*` tokens** | — | **42** | 8 subtopics + 8 demos + 24 exercises + 1 figure + the bare `S19` |
| **total self-number tokens** | **76** | | |

### Self-referencing prose inside the file
`:40` `"El EDA de S18 dejó medianas…"` — 35 cross-section prose references in this one file (full line list in §6c). There are **no** `"esto es T4-B"`-style self-references; subtopics are referenced structurally by `subtopicId`, never named in prose.

### `topicEvaluations`
Not inline in s19. The field exists in the schema and is asserted as a **block boundary** by `tests/adversarial/test_s02_independent_contract.py:186`, `test_s02_text_first_quality.py:110`, `test_s01_independent_recovery.py:170`, `test_s01_text_first_prose.py:105` (`_between(source, "  selfCheck: {", "  topicEvaluations: [")`). The 208 topic evaluations live out-of-file as **53 JSON files** in `course-state/topic_evaluations/` (`s01_te.json` … `s52_te.json` + `_manifest.json`), generated by `scripts/generate_topic_evaluations.py`. Those **filenames carry the section number** and must be renamed; `scripts/generate_topic_evaluations.py:27–80`'s hardcoded number→slug table must be rewritten.

## Typical per-section counts (verified across all 52)

Every active section has exactly: **1** `export const sectionNN`, **1** `index:`, **8** unique `subtopicId` (appearing 24–41× each file), **8** `demoId`, **24** exercise `id`, 0–3 figure ids, 1 `estimatedHours`, 1 `phase`.

## Totals for the 34 files that must be renumbered (S19–S32 → +2, S33–S52 → +3)

| Token class | Count |
|---|---:|
| files | **34** |
| `export const sectionNN` | **34** |
| `index: NN` | **34** |
| `/** Sxx —` header comments | **34** |
| `subtopicId:` occurrences | **1,362** |
| `demoId:` occurrences | **272** |
| exercise `id:` occurrences | **816** |
| figure-style `"Sxx-slug"` ids | **76** |
| **all self-number `Sxx` tokens** | **4,139** |
| cross-section `Sxx` tokens inside those 34 files | **374** |

## 6c. CROSS-section prose references — course-wide

**All 665 cross-section references across the 52 active files are bare prose `Sxx` mentions. Zero are structured ids** (no file ever cites another section's `Sxx-Tn-X-En`). Verified mechanically.

Of those, **355 point at S19 or higher** and therefore change value. Per file:

| File | Cross-refs needing renumber |
|---|---:|
| `s32-microservices.ts` | 55 |
| `s21-fastapi.ts` | 34 |
| `s39-integrator-phase2.ts` | 32 |
| `s19-databases-orm.ts` | 28 |
| `s22-rapidfuzz-entity.ts` | 20 |
| `s33-advanced-models.ts` | 19 |
| `s20-rag.ts` | 17 |
| `s30-security-infra.ts` | 16 |
| `s50-tech-leadership.ts` | 13 |
| `s18-data-engineering.ts` | **12 — in a file that does *not* move** |
| `s23-computer-vision.ts`, `s28-llm-agents.ts`, `s31-streaming-data.ts`, `s37-dbt-bigquery.ts` | 11 each |
| `s34-cv-ai-integration.ts`, `s38-performance-extreme.ts`, `s43-llmops.ts`, `s25-streamlit-dashboards.ts` | 6 each |
| `s26-integrator-phase1.ts`, `s27-async-concurrency.ts`, `s46-gpu-computing.ts` | 4 each |
| `s24-rpa-advanced.ts`, `s29-mlops.ts`, `s36-ai-apis-advanced.ts`, `s41-llm-finetuning.ts`, `s45-iac.ts`, `s49-data-contracts.ts`, `s52-career-strategy.ts` | 3 each |
| `s40-architecture-ddd.ts`, `s42-graph-rag.ts`, `s51-integrator-final.ts` | 2 each |
| `s13-evidence-dashboard.ts`, `s48-ai-governance.ts` | **1 each — `s13` does not move** |
| **TOTAL** | **355** |

Full cross-ref target distribution (which section gets cited, all 665): S01 34, S02 11, S03 10, S04 12, S05 9, S06 13, S07 10, S08 26, S09 34, S10 16, S11 15, S12 19, S13 21, S14 8, S15 4, S16 10, S17 24, S18 17, S19 18, S20 21, S21 49, S22 18, S23 8, S24 15, S25 4, S26 3, S27 31, S28 5, S29 8, S30 19, S31 20, S32 16, S33 48, S34 9, S35 8, S37 4, S38 5, S39 5, S40 2, S41 4, S42 2, S44 8, S45 2, S47 2, S49 14, S50 4, S51 3. (S36, S43, S46, S48, S52 are never cited.)

**Two traps for a naive rename script:**
1. The reference is often a **compound**: `S20/S21`, `S17–S19`, `(S20)` and `(S21)` on the same line. `s19-databases-orm.ts:211,250,358,498,622,1053,1756,1796` each contain two numbers; `:1756` reads `"se integra con Excel (S20) y reportes (S21)"`.
2. Twelve of the 355 live in `s18-data-engineering.ts` and one in `s13-evidence-dashboard.ts` — **files whose own number does not change.** A script keyed on "files that move" misses them.

There are also 17 one-digit `S<n>` tokens (`s52-career-strategy.ts` 10, `s09-exceptions-logging.ts` 5, `s12-apis-sql-geo.ts` 2) that a `S\d{2}` regex will not catch.

## Also carrying section numbers outside `sections/`

| Location | Shape | Count |
|---|---|---:|
| `src/components/course/figures/index.tsx:58–72` | registry keys `'S01-cwd-path'` → components `S01CwdPath` | **15** keys |
| `src/components/course/figures/S*.tsx` | component **filenames** `S01CwdPath.tsx`, `S14ViewVsCopy.tsx`, `S17WideLong.tsx`, `S18Interval.tsx`, `S31EvidenceGraph.tsx`, `S32Leakage.tsx`, `S36RollingOrigin.tsx`, `S46EventTime.tsx`, … | **15** files, **5 of which move** (S31→S33, S32→S34, S36→S39, S46→S49) |
| figure ids across sections + figures | `"Sxx-slug"` | **117** unique |
| `src/components/course/SectionView.tsx` | 52 playground blocks keyed by **slug** (`^    '[a-z0-9-]+': {`) | slug-keyed → **safe** |
| `prisma/seed.ts` | `QUESTION_BANK` keyed by **slug** (`setup:`, `basics:`, …) | slug-keyed → **safe** |
| `course-state/topic_evaluations/sNN_te.json` | **filename carries the number** | 52 files to rename |
| `course-state/capstones/` | read by `test_forward_dependencies.py:51` | check |
| `.fixer/`, `course-state/sNN_phaseN.json` | ~190 + ~338 files, many named `sNN_*` | inventory separately |

---

## The three things most likely to sink an "atomic" migration

1. **`scripts/preservation_sentinel.mjs:174–179` fails on 816 removed exercise ids** with no rename path. `src/lib/section-id-migrations.ts` covers slugs only. This needs new code or an explicit waiver before any renumber lands.
2. **`course-state/course_requirements.json:35`** records the written commitment *"does_not: replace, reduce, or renumber the existing 52 sections"*. A renumber contradicts the repo's own authority file; it must be amended in the same change, not quietly overwritten.
3. **`scripts/goal_verification_gate.py:73`** ties the STORM artifact's `n_logged` and `len(cycles)` to the section number itself (`n_logged != n` → fail). For 34 sections those artifacts are not renameable — they must be regenerated, or the gate relaxed.

Secondary: `tests/adversarial/test_master_curriculum_specificity.py:12–16` selects "the master 13" by **filename digits 40–52**, and filenames are frozen — so after the shift it silently audits the wrong 13 files while still passing `assertEqual(len(MASTER_FILES), 13)`. That is the one failure mode here that produces a green test and wrong coverage.