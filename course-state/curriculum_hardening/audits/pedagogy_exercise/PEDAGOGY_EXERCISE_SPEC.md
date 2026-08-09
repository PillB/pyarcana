# Pedagogy Exercise Spec — I Do / We Do / You Do (PyArcana)

**Audience:** section Reviewers and Fixers (S01–S52)  
**Product:** https://pillb.github.io/pyarcana/  
**Schema fields (optional, preferred):**  
- I Do: `preamble`, `retrospective` (plus existing `description`, `why`, `code`)  
- We Do: `title`, `preamble`, `instruction`, `retrospective` (plus hints/feedback/tests)  
- You Do: `retrospective` (plus context/objectives/requirements/rubric)

---

## 1. Problem we are solving

Many We Do units read like bare terminal drills: short “Concepto + fixture” instructions, weak success criteria, and one-line feedback. True newbies cannot answer:

1. **What** am I practicing?  
2. **Why** does it matter here?  
3. **How** do I know I succeeded?  
4. **What** should stick after I close the tab?

This campaign fills **preamble → task → retrospective** for every I Do / We Do / You Do unit under Gradual Release + intervention-style scaffolding.

---

## 2. Theoretical bases (apply, don’t name-drop to learners)

| Framework | Implication for exercises |
|-----------|---------------------------|
| **Gradual Release (Pearson & Gallagher)** | I Do = model; We Do = shared practice with fade; You Do = independent performance |
| **Intervention / multi-tier support** | State target skill, entry support, exit criteria; E1/E2/E3 are tiers, not clones |
| **Cognitive Load (Sweller)** | One primary goal; goal before code; worked examples for novices |
| **Faded worked examples (Renkl / Atkinson)** | E1 near-complete defect; E2 less scaffold; E3 transfer |
| **Self-explanation / metacognition** | Retrospective: what changed, why it works, when to reuse, misconception |
| **Deliberate practice + feedback** | Observable success; feedback explains *reasoning* |
| **Gagné micro-events (adapted)** | Attention → objective → recall → present → guide → feedback → transfer |

Learner-facing prose stays **Peruvian professional Spanish**, concrete, non-academic jargon.

---

## 3. Field roles

### I Do
| Field | Role |
|-------|------|
| `description` | Short title |
| `preamble` | Before code: scenario + what to watch |
| `code` / `output` | Worked example (correct) |
| `why` | Technical rationale of the code |
| `retrospective` | After: principle + misconception + bridge to We Do |

### We Do
| Field | Role |
|-------|------|
| `title` | Short header (≤ ~80 chars) |
| `preamble` | Context + goal + success + constraints |
| `instruction` | Ordered task steps only |
| `hints` / `hint` | Progressive, non-spoiling |
| `starterCode` | Named defect |
| `solutionCode` + `output` | Canonical solution |
| `feedback` | Immediate corrective notes |
| `retrospective` | Metacognitive close (with solution panel) |
| `tests` / `edgeCases` | Verification |

### You Do
| Field | Role |
|-------|------|
| `context` / `objectives` / `requirements` / `rubric` | Existing project frame |
| `retrospective` | Defense / reflection after build |

---

## 4. Writing limits (anti-bloat)

| Block | Target length |
|-------|----------------|
| `title` | 4–12 words |
| `preamble` | 80–150 words (or 4 short bullets) |
| `instruction` | 40–100 words, steps |
| `why` (I Do) | 40–90 words |
| `retrospective` | 40–80 words |
| `feedback` | 25–60 words |

One primary learning goal per unit. Prefer fewer stronger sentences over essay length.

---

## 5. Preamble checklist (must answer)

1. **Context** — section story / job hook (1–2 sentences)  
2. **Goal** — skill in one sentence  
3. **Success** — exact output, assert, or rubric criterion  
4. **Constraints** — forbidden patterns, no real PII, library limits  

Markdown OK (`**bold**`, lists). UI renders via `RichText`.

---

## 6. Retrospective checklist

1. **Principle** that stuck  
2. **Misconception** repaired  
3. **Transfer** cue (next exercise / capstone / job)  
4. Optional: 1 self-check question the learner can answer without code  

---

## 7. E1 / E2 / E3 fade (We Do)

| Kind | Scaffold | Instruction style |
|------|----------|-------------------|
| **guided (E1)** | Name the defect; near-complete starter | Step-by-step; may point to line |
| **independent (E2)** | Partial scaffold | Goal + success; fewer breadcrumbs |
| **transfer (E3)** | Minimal | New surface, same principle |

Never three copies of the same prompt with different numbers.

---

## 8. Exemplars (hand-written)

### 8.1 I Do (pattern — values/types)

**description:** Literales de un registro de cliente y `type()` de cada campo  

**preamble:**  
Antes de parsear un intake, el analista debe *ver* el tipo de cada campo. En esta demo un registro sintético (sin PII real) muestra `str`, `int`, `float`, `bool` y `None`. Observa la línea que compara `42` con `"42"`: si confundes número y texto, el pipeline de calidad miente. No escribas aún; sigue el `print` y la salida esperada.

**why:**  
`type(x).__name__` hace visible la clase. El teléfono y los códigos de producto deben modelarse como `str` aunque “parezcan números”. La igualdad `42 == "42"` es `False` a propósito.

**retrospective:**  
Si puedes explicar por qué `"42"` no es `42` sin mirar el código, ya tienes el hábito de inspección de tipos. En We Do practicarás convertir y validar sin borrar el `raw`.

### 8.2 We Do E1 (pattern)

**title:** Contar adultos con `for` (sin comprehension)  

**preamble:**  
- **Contexto:** en el resumen de un lote de intake necesitas tasas por condición, no solo listar filas.  
- **Meta:** practicar un contador manual en un `for` (base del gate de resúmenes).  
- **Éxito:** imprimes un solo entero; con `edades = [30, 17, 45, 22]` el valor es `3`.  
- **Límites:** no uses list comprehension todavía; no mutes la lista original.

**instruction:**  
1. Revisa el starter: el contador no se actualiza bien (o no existe).  
2. Recorre `edades` con `for`.  
3. Si `edad >= 18`, incrementa el contador.  
4. Imprime solo el contador (sin texto extra).

**retrospective:**  
El contador en un pase O(n) es el mismo patrón de `n_accept` / `n_reject` del capstone. El error clásico es imprimir la lista entera o contar con un `sum` opaco antes de entender el bucle.

### 8.3 You Do retrospective (pattern)

**retrospective:**  
Antes de marcar listo: (1) ¿qué invariante del gate demuestras con un test o print de verificación? (2) ¿qué harías distinto con datos reales vs. sintéticos (PII)? (3) Escribe en el README una frase de impacto medible (antes/después) que puedas defender en 30 segundos.

---

## 9. Anti-aberration (absolute)

**Forbidden:** generators, loops, templates, or scripts that manufacture preambles/retrospectives/exercises; bulk search-replace of pedagogical prose; copy-paste across sections without rewrite.

**Allowed:** typecheck, tests, code execution, output compare, schema validation, Spanish metrics *measurement only*.

Every paragraph must be hand-written with a clear pedagogical purpose.

---

## 10. Reviewer report template

Path: `course-state/curriculum_hardening/audits/pedagogy_exercise/round1/S{NN}_EXERCISE_PEDAGOGY_REPORT.md`

```markdown
# S{NN} Exercise Pedagogy Report (Round 1)

## Section
- title, id, source file
- counts: iDo N, weDo N, youDo 1

## Method
- Read PEDAGOGY_EXERCISE_SPEC.md
- Inspected every iDo.steps[], weDo.steps[], youDo
- No bulk generation

## Unit ledger
### [UNIT_ID] (iDo|weDo|youDo)
- **Diagnosis:** ...
- **Checklist:** context/goal/success/constraints/retrospective (pass/fail)
- **Severity:** P0|P1|P2
- **Proposed title:** (weDo)
- **Proposed preamble:** (full text)
- **Proposed instruction/description improvements:** ...
- **Proposed retrospective:** (full text)
- **Code/output changes:** none | describe
- **Validation notes:** ...

## Priority order
P0 ... then P1 ... then P2

## Residual risks
...
```

Closer:  
`Section {N} exercise pedagogy review complete. Ready for the Fixer prompt.`

---

## 11. Fixer acceptance checklist

- [ ] Every non-trivial unit has `preamble` + `retrospective` (or documented N/A)  
- [ ] We Do has short `title`  
- [ ] `instruction` is task-only (not the whole essay)  
- [ ] Exact outputs preserved unless execute-and-diff justified  
- [ ] Spanish PE; no real PII  
- [ ] No generators used  
- [ ] Section source compiles in static build  

Closer:  
`Section {N} exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.`

---

## 12. Dual-round process

1. **Round 1 Review** → reports in `round1/`  
2. **Round 1 Fix** → implement fields in `src/lib/course/sections/`  
3. **Round 2 Review** → re-read source; `round2/` reports (no rubber stamp)  
4. **Round 2 Fix** → tighten  
5. Orchestrator validates + deploys  

Gold tone references (do not copy content): S26, S30, S33, S50.
