# Validator Audit — agentic_A1

**Role:** Skeptical Auditor (Validator)  
**Attempt:** `agentic_A1`  
**Path:** `course-state/newbie_walkthrough/agentic_A1/`  
**Audit date:** 2026-07-21  
**Course content modified:** No  

---

## Verdict: **PASS**

| Gate | Result |
|------|--------|
| `agentic_ledger.json` present | Yes |
| `clean_52` | **true** |
| `a_pass` / `b_pass` / `both_pass` | 52 / 52 / 52 |
| `open_gaps` | `[]` |
| Spot-check sections 01, 05, 14, 27, 40, 52 | Pass (A + B) |
| Full-corpus method / attempt_id | 0 violations (104 live files) |
| Generator fingerprints (`correct_preview`, `_gen_`, `instruction_target`) | **None** in any live file |
| A vs B justification byte-identity | **0** of 1472 pairs identical |

---

## 1. Ledger confirmation

Source: `course-state/newbie_walkthrough/agentic_A1/agentic_ledger.json`

```json
{
  "attempt_id": "agentic_A1",
  "evaluation": "agentic_justification_primary",
  "a_pass": 52,
  "b_pass": 52,
  "both_pass": 52,
  "clean_52": true,
  "open_gaps": []
}
```

- Validated at: `2026-07-21T22:16:12.559037+00:00`
- All 52 sections report `section_pass: true`, `a_sc: 100.0`, `b_sc: 100.0`, `gaps: 0`
- Validator script re-run not required; ledger is present and consistent with live artifacts

---

## 2. Spot-check protocol

For each of **sections 01, 05, 14, 27, 40, 52**, both `newbie_a_live.json` and `newbie_b_live.json` were inspected for:

1. `attempt_id == "agentic_A1"`
2. `method == "llm_packet_only_no_generator"`
3. Selfcheck `justification_from_packet` grounded in quiz_card / packet language
4. Absence of generator fingerprints
5. A vs B justifications not byte-identical

### 2.1 Metadata (all 12 files)

| Check | Result |
|-------|--------|
| `attempt_id` | `agentic_A1` on every spot-check file |
| `method` | `llm_packet_only_no_generator` on every spot-check file |
| Full corpus (sec 01–52 × A/B) | **0** metadata mismatches |
| `forbidden_honored` | `true` |
| `knowledge_boundary` | `Only landing + prior_sections + active packet content.` |
| `production_note` | `agentic_packet_reasoning_dual_persona; no solutions/correctIndex read` |

### 2.2 Generator fingerprints

Full-corpus string scan of all `newbie_*_live.json`:

| Pattern | Hits in live files |
|---------|-------------------|
| `correct_preview` | 0 |
| `_gen_` | 0 |
| `instruction_target` | 0 |
| `answer_key` / `generator_id` / `correct_index` (snake) | 0 |

**Note on `correctIndex` substring:** appears once per live file only inside `production_note` (“no solutions/correctIndex read”). No JSON **key** named `correctIndex` (or similar) exists in live answers. This is an anti-leak disclaimer, not answer-key bulk or a generator fingerprint.

### 2.3 A vs B non-identity

| Scope | Pairs compared | Byte-identical |
|-------|----------------|----------------|
| Spot-check (all justifications) | 6 × (28–29) | 0 |
| Full corpus selfcheck only | 224 | 0 |
| Full corpus all `justification_from_packet` | 1472 | 0 |

Personas differ as expected: A = Explorer, B = Skeptic; justifications use distinct wording, structure, and language mix (ES / EN-skeptic).

---

## 3. Selfcheck grounding — sample quotes

Justifications quote theory headings, packet phrases, and option discrimination without reading a solutions channel. Empty or &lt;30-char selfcheck justifications across the full corpus: **0**.

*(Chosen option indices are not documented here as learner-facing “correct answers.”)*

### Section 01 — setup

**A (Explorer):**
> La teoría define el entorno virtual como carpeta con su propio Python y paquetes 'para no mezclar dependencias entre proyectos' y la regla 'un proyecto = un entorno = un conjunto de dependencias' para evitar conflictos de versiones.

**B (Skeptic):**
> Skeptic: theory 'Entornos virtuales con venv' is blunt — un proyecto = un entorno = un conjunto de dependencias, to avoid pandas 2.x of one client breaking another's legacy notebook. Isolation of packages, not speed or compilation.

**Grounding:** Matches packet theory on venv isolation; B rejects distractors (speed/internet/compile) with packet-relative reasoning.

---

### Section 05 — functions / OOP-adjacent theory in packet

**A:**
> Teoría de defaults: se evalúan una vez en la definición; 'nunca uses lista/dict mutable como default (`def f(xs=[])` es un bug clásico)' porque se comparte entre llamadas.

**B:**
> Skeptic: pure function = same args → same result, no side effects (no print/disk/globals). Printing or reading global config breaks purity in this packet.

**Grounding:** Direct paraphrase of theory bullets (defaults once; pure = no side effects; LEGB order in other items). Short but packet-anchored.

---

### Section 14 — numpy / security lane content in packet

**A:**
> … theory «ndarray, dtype y shape»: «**dtype** fija el tipo (p. ej. float64, int32); **shape** es la tupla de dimensiones; **ndim** = len(shape)». El tipo homogéneo de los elementos es dtype, no shape/ndim/base.

**B:**
> Skeptic: «creación, indexación y máscaras» says a boolean mask `a > umbral` produces bools and `a[mask]` filters — «forma idiomática de calidad».

**Grounding:** Quotes theory headings and Spanish packet phrasing almost verbatim.

---

### Section 27 — async-concurrency packet (testing/pyramid language in card)

**A:**
> Theory [riesgos y pirámide de pruebas]: «La pirámide prioriza muchas pruebas unitarias baratas, menos de integración y pocas E2E.» … Explorer: base ancha = unitarias, no E2E/manual/load.

**B:**
> Skeptic — card «mutación conceptual…»: «cambia deliberadamente el código (quita un strip…) y verifica que algún test falle. Si no falla, el test es débil». Mutar casefold sin fallo = mutante sobrevivió / contrato débil.

**Grounding:** Explicit card/theory quotes + iDo demo references (`S27-T1-B-DEMO`, oráculo «maría ríos»).

---

### Section 40 — agentic-architecture

**A:**
> Explorer: teoría Mapa V3 S40 — «En V3, **S40** retematiza el archivo de plataforma `agentic-architecture` hacia **Arquitectura, DDD y decisiones técnicas**.». …

**B:**
> Skeptic: el gate/incremento V3 está nombrado en la teoría. Quote: «Integra el incremento **CP-N4-A (inicio)** sin exponer secretos ni PII real.». …

**Grounding:** Map / outcomes language from quiz_card theory; synthetic-data / no-PII constraints cited.

---

### Section 52 — career-strategy / FINAL gate

**A:**
> Explorer: theory heading outcomes state «Integra el incremento **CP-FINAL exclusivamente** sin exponer secretos ni PII real.». …

**B:**
> Skeptic: el mapa de la card cita literalmente el id de plataforma preservado. Quote: «En V3, **S52** retematiza el archivo de plataforma `career-strategy` hacia **Enterprise Relationship & Operations Intelligence Platform: capstone final**. **FINAL/CLOSE gate** …».

**Grounding:** Platform id + CP-FINAL gate text pulled from packet map; A/B not copy-pastes of each other.

---

## 4. Residual risks (non-blocking)

These do **not** flip the gate, but a future auditor should watch them:

1. **Late-section exercise justifications are formulaic.**  
   For S40/S52, exercise `justification_from_packet` often starts with the same template  
   `Explorer/Skeptic: ejercicio Sxx-… Instruction del paquete: … patrón del demo iDo …`  
   Selfcheck justifications remain substantive; exercise prose is thinner and more parallel across exercise IDs. Not a fingerprint, but lower evidence of deep per-exercise reasoning.

2. **S14 Explorer selfcheck style is more mechanical.**  
   Pattern: `Explorer selfcheck S14 Qn: opción [k]. Justificación desde theory/iDo…`  
   Still quotes real theory; persona B is freer. Acceptable under packet-only method, slightly lower naturalism.

3. **S05 A selfcheck Q1 is very short** (`Teoría: sin return explícito, 'Python devuelve None'.`).  
   Grounded and non-empty; if min-length gates tighten later, this is the first style to watch.

4. **`production_note` contains the token `correctIndex`.**  
   Harmless disclaimer today; if scanners treat the token as a leak, rename note text to avoid false positives.

5. **Audit scope.**  
   Spot-check covered 6/52 sections in depth; full corpus automated checks covered metadata, fingerprints, and A/B identity. Semantic grounding of every selfcheck item was not hand-read for all 52.

6. **Dual-persona language mix.**  
   B often answers in English while packets/stems are Spanish. Allowed by dual-persona design; not an integrity failure.

---

## 5. Checklist summary

| Criterion | Status |
|-----------|--------|
| attempt_id = agentic_A1 | PASS (spot + full corpus) |
| method = llm_packet_only_no_generator | PASS (spot + full corpus) |
| Selfcheck justifications packet-grounded | PASS (spot samples quote theory/iDo/map) |
| No generator fingerprints | PASS |
| A/B justifications not byte-identical | PASS (0/1472) |
| Ledger `clean_52` | PASS (`true`, 52/52 both) |

---

## 6. Final statement

**agentic_A1 passes the agentic pedagogy gate.**  
Ledger reports clean dual-persona validation for all 52 sections. Spot-checks of early, mid, and late sections confirm packet-only method metadata, grounded selfcheck justifications with distinct Explorer vs Skeptic voice, and no generator bulk fingerprints. Residual risks are stylistic/template thinness in late-section *exercise* justifications and short-but-valid S05 quotes — not integrity failures.

**Outcome: PASS — ready for downstream pedagogy consumption of this attempt.**
