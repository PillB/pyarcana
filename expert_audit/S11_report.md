# Section 11 — Curriculum Auditor Report (S11)

**Section title:** "OOP y modelo de dominio"
**Active source file:** `src/lib/course/sections/s11-testing.ts` (2,456 lines)
**Section id (in code):** `"testing"` ← **mismatch with title/topic** (see Issue #2)
**Section index:** 11
**Short title:** "OOP dominio"
**Phase:** 0 · Nivel 1 (Foundation)
**Estimated hours:** 19 h
**Level:** Intermedio
**Tagline:** "ClientRecord, ResolvedEntity, Transaction y RelationshipEvidence sin decidir fraude ni parentesco"
**Rendered page confirmed:** https://pillb.github.io/pyarcana/#/section/11 (hash route `#testing`)
**Audit date:** Single-pass STORM + Graph/Loop/Harness engineering run.

---

## 1. Section Identification & Scope

This audit covers **only Section 11** of the live pyarcana course (https://pillb.github.io/pyarcana/) and its single active source file `src/lib/course/sections/s11-testing.ts` in the repo https://github.com/PillB/pyarcana. The dual file `src/lib/course/sections/s11-advanced-topics.ts` (also `index: 11`) is **inactive** (not imported by `src/lib/course/index.ts`) and was excluded per the shared grammar subplan ("ignore dual inactive files").

**Section topic:** Object-Oriented Programming applied to a domain model for the familiarity-matching product `CP-N1-C`. The section builds four domain types (`ClientRecord`, `ResolvedEntity`, `Transaction`, `RelationshipEvidence`) with `dataclass`, invariants, properties, frozen value objects, composition, `typing.Protocol` ports, repository/service layering, and pure domain tests. The recurring ethical guardrail is: **no class emits fraud or family verdicts** (`is_fraud`, `is_related_family`, `decide_fraud`).

**Tabs audited (live + source):**
- **Teoría** (theory) — 8 subtopic blocks (T1-A → T4-B), each with heading, 3 paragraphs, code block, callout.
- **Yo hago** (I Do) — 8 demos (one per subtopic), each with `description`, `code`, `why`.
- **Hacemos juntos** (We Do) — 24 exercises (8 subtopics × 3 levels: E1 guiado / E2 independiente / E3 transferencia), each with `instruction`, `hint`, `hints`, `edgeCases`, `tests`, `feedback`, `starterCode`, `solutionCode`.
- **Tú haces** (You Do) — 1 integrative capstone (`CP-N1-C`): `context`, `objectives` (5), `requirements` (9), `starterCode` (Python), `portfolioNote`, `rubric` (6 criteria).
- **Autocheck** (self-check) — 6 MCQs with `question`, `options` (4 each), `correctIndex`, `explanation`.
- **Resources** — 6 docs, 2 books, 4 courses.

**Total learner-facing Spanish prose records extracted:** 315 strings · 4,536 Spanish words.

---

## 2. Executive Summary of Quality

**Overall score: 8.0 / 10** (high quality, minor polish needed)

**Verdict:** Section 11 is a **well-engineered, pedagogically sound, ethically framed** OOP unit that successfully carries the CP-N1-C gate forward. It is structurally comparable in quality to the best early sections (S06, S07, S09) and notably stronger than typical mid-course sections in cognitive-load management. The I Do / We Do / You Do / Autocheck scaffold is fully realized (8 demos · 24 scaffolded exercises · 1 capstone · 6 MCQs), the synthetic-PE data convention (`C00x`, `@ejemplo.pe`, `Decimal` PEN/USD) is consistent, and the ethical guardrail (no `is_fraud`/`is_related_family`) is reinforced repeatedly across theory, exercises, and self-check.

The section loses points mainly because of:

1. A **self-check question stem inconsistency** (Q5 says "Client hereda de Person…" while the rest of the section uses `PersonInfo`) — confusing to learners.
2. A **structural meta-hazard** left over from refactoring: the active file is `s11-testing.ts` with section id `"testing"`, but the content is OOP/domain modeling. The defunct `s11-advanced-topics.ts` is also `index: 11`. This is invisible to learners but creates maintenance and routing debt.
3. **Three long paragraphs** (49, 42, 45 words) in the theory tab that exceed the 32-word soft ceiling and could be split.
4. **Inconsistent callout titles**: 2 of 8 are in English ("Fail on construct", "eq custom") while the other 6 are in Spanish.
5. **Inline English verb/noun mixing** in quotes ("no \"fixes\" silenciosos", "no se \"clamp\" en silencio") that could be Spanish-equivalented for consistency.
6. **Pluralized siglas** (`ORMs`, `APIs`, `DTOs`, `PIIs`) that RAE recommends leaving unmarked, though tech-Spanish usage widely accepts them.

There are **zero genuine meta-leaks** in learner-facing prose (the only `# DEFECT:` and `# TODO:` markers are intentional scaffolding inside starter code blocks), **zero spelling errors** in actual Spanish prose, and **zero missing inverted question/exclamation marks**. Readability is healthy (mean FH=71.5 "bastante fácil"; mean INFLESZ=66.8 "normal"; median WPS=9.0).

---

## 3. Detailed Issue Registry

> Severity scale: **H** = blocks learning / breaks content; **M** = noticeable defect, should fix; **L** = polish / consistency.

### Issue #1 — Self-check Q5 stem says "Person", everything else says "PersonInfo"  *(Severity: M)*

**Evidence (line 2375):**
```ts
question: "Client hereda de Person…",
options: ["Siempre es la mejor opción", "Es obligatoria en Python",
          "A menudo es frágil; composición (Client tiene PersonInfo) suele bastar",
          "Impide tests"],
```

**Where else `PersonInfo` is used (consistent):**
- Theory paragraph (line 207): `Client(Person(BaseEntity))` ← also uses bare `Person` here (the only other place)
- We Do S11-T3-A-E1 instruction (line 1436): "`Client(PersonInfo)` por composición: `Client` tiene un `person: PersonInfo`"
- We Do S11-T3-A-E1 hint (line 1437): "Client(client_id, person) sin heredar de PersonInfo."
- We Do S11-T3-A-E1 feedback (line 1444): "has-a (Client tiene PersonInfo) suele bastar"
- We Do starterCode/solutionCode (lines 1453, 1472, 1479, 1481): `class PersonInfo`
- Self-check Q5 explanation (line 2379): "Composición (Client tiene PersonInfo) mantiene el grafo de dominio auditable."

**Pedagogical impact:** A learner who reads "Client hereda de Person…" and then sees the correct option say "Client tiene PersonInfo" is given an inconsistent class name. Even if they pick the right option, the stem plants the wrong vocabulary. Theory line 207 has the same defect: it shows the anti-pattern as `Client(Person(BaseEntity))` while the We Do exercise calls the parent class `PersonInfo`. The class-name drift between abstract anti-pattern in theory and concrete exercise in We Do adds friction.

**Root cause:** The author named the parent class `PersonInfo` in the We Do exercise but the abstract anti-pattern illustration and the self-check stem use the shorter `Person`. Two different shorthand labels for the same concept.

**Suggested fix:** Standardize on `PersonInfo` everywhere (it is the more descriptive name and matches the working code).

---

### Issue #2 — Active file name `s11-testing.ts` and section id `"testing"` do not match the OOP content  *(Severity: M)*

**Evidence:**
- `src/lib/course/index.ts` line 12: `import { section11 } from './sections/s11-testing'`
- `s11-testing.ts` line 3-6: `id: "testing"`, `index: 11`, `title: "OOP y modelo de dominio"`, `shortTitle: "OOP dominio"`
- Live URL: `https://pillb.github.io/pyarcana/#testing` (hash derived from `id`)
- Defunct file `s11-advanced-topics.ts` also has `index: 11` and `id: 'advanced-topics'` (English-mixed content, not imported).

**Pedagogical impact:** Invisible to learners *today*, but it is a maintenance hazard: a developer asked to "find the testing section" will land on an OOP section, and the live URL hash `#testing` advertises a topic the page does not deliver. It also makes grep/find harder.

**Root cause:** The file was likely renamed from a testing-focused section to an OOP-focused section during a curriculum reshuffle, but the file name and `id` were never updated.

**Suggested fix:** Rename file to `s11-oop-domain.ts`, change `id` to `"oop-domain"` (and update `index.ts` import + any internal references). Delete or archive `s11-advanced-topics.ts`. *This is a non-trivial refactor that should be coordinated with a Fixer pass.*

---

### Issue #3 — Three long paragraphs exceed the 32-word soft ceiling  *(Severity: M)*

The grammar heuristic flags sentences >32 words as `long_sentence` (medium severity) and >45 as `run_on` (high). Section 11 has three offending paragraphs in the theory tab:

#### 3a. Paragraph P10 (T1-B Invariantes, line 79) — 49 words, 3 sentences, FH=57.0

> Método `validate()` reutilizable ayuda en factories `from_dict` y rehidratación desde JSON: centraliza las reglas y las invoca desde `__post_init__` o desde el borde de serialización. **Sin side-effects de negocio** al validar: no llames APIs, no escribas a disco, no "fixes" silenciosos de moneda. Stack: stdlib + `Decimal`; no ORM.

**Why hard:** The first sentence alone is 27 words with three subordinate clauses ("ayuda en factories X y rehidratación desde Y: centraliza Z y las invoca desde A o desde B"). The middle sentence packs four negative imperatives with an English code-quote. The third sentence is a fragment.

**Pedagogical impact:** Cognitive overload on first read; the four-rule "no side-effects" list is buried inside prose instead of being a list.

#### 3b. Paragraph P18 (T2-B Igualdad/hash, line 168) — 42 words, 2 sentences, FH=38.3 (hardest in the section)

> La identidad de `ResolvedEntity` usa su **`entity_id` estable**, no `document_id`: un documento es PII, puede corregirse o reemitirse y no debe fusionar entidades por accidente en el set de resolución. **`frozen=True`** habilita hash seguro para sets y dicts de matching local.

**Why hard:** First sentence has 35 words with three reasons ("es PII / puede corregirse o reemitirse / no debe fusionar entidades por accidente en el set de resolución") chained by `:` and `y`. WPS = 42 (well above 32).

**Pedagogical impact:** The rationale for `entity_id`-based identity is dense; a learner loses the thread before reaching the second sentence about `frozen=True`.

#### 3c. Paragraph P21 (T3-A Composición, line 207) — 45 words, 3 sentences, FH=54.6

> Tras fijar identidad frozen en T2-B, el diseño pasa a **cómo se agrupan** los objetos. **has-a** (composición) modela el caso de familiaridad: `CaseFile` tiene una `ResolvedEntity` y una lista de `RelationshipEvidence`. No fuerces `Client(Person(BaseEntity))` solo para reutilizar un campo de nombre.

**Why hard:** Second sentence (24 words) introduces the `has-a` concept with three code identifiers and a "tiene una … y una lista de …" construction. Third sentence ends with the bare `Person` (Issue #1).

**Pedagogical impact:** The transition from T2-B identity to T3-A composition is conceptually correct but the prose jams three ideas into one paragraph.

**Suggested fix:** Split each into 2 paragraphs (concept → example) and/or move the enumeration into a bulleted list.

---

### Issue #4 — Inconsistent callout title language  *(Severity: L)*

The 8 callout titles in the theory tab mix Spanish and English:

| Line | Title | Language |
|-----|-------|----------|
| 36 | "CP-N1-C modelo de dominio" | Spanish (gate name is code) |
| 69 | "Datos sintéticos" | Spanish |
| 113 | **"Fail on construct"** | **English** |
| 159 | "Consulta vs comando" | Spanish (`vs` is borrowed) |
| 198 | **"eq custom"** | **English + fragment** |
| 249 | "Sin veredictos" | Spanish |
| 293 | "Puertos" | Spanish |
| 351 | "Frontera" | Spanish |
| 387 | "Ética de producto" | Spanish |

**Pedagogical impact:** Minor visual inconsistency. "eq custom" is also a fragment (no verb, no article) rather than a proper title — learners see it as a label, not a heading.

**Suggested fix:** Translate to Spanish for consistency: "Fail on construct" → "Falla al construir" (the section already uses "falla al construir" in paragraph P2). "eq custom" → "Igualdad personalizada" (or "eq personalizada" if brevity matters).

---

### Issue #5 — Inline English verbs/nouns quoted inside Spanish prose  *(Severity: L)*

Several paragraphs embed English verbs or nouns in curly quotes mid-sentence:

| Line | Phrase | Spanish equivalent |
|-----|--------|--------------------|
| 79 | `no "fixes" silenciosos de moneda` | `no "arreglos" silenciosos de moneda` |
| 208 | `no "clamps" silenciosos` | `no "recortes" silenciosos` |
| 361 | `no se "clamp" en silencio en el constructor` | `no se "recorta" en silencio en el constructor` |

**Pedagogical impact:** The verbs "fix" and "clamp" are not standard Spanish even in tech jargon; "clamp" is rarely borrowed. Learners unfamiliar with the term may stumble. Other English borrowings in the section (`fail-closed`, `side-effects`, `frozen`, `score`, `schema`) are more established and glossary-worthy.

**Suggested fix:** Translate the quoted verbs to Spanish in curly quotes; or move the concept to a callout with the English term and a Spanish gloss.

---

### Issue #6 — "0..1" double-period flagged by LanguageTool  *(Severity: L)*

**Evidence (line 124, paragraph P16):**
> Setters validados solo cuando la mutación es parte del modelo de negocio (p. ej. un score 0..1); si no, prefiere **`frozen`** o devolver una **nueva instancia**.

**LanguageTool rule:** `DOUBLE_PUNCTUATION` ("Dos puntos consecutivos").

**Root cause:** `0..1` is interval notation borrowed from math/programming, but in Spanish prose it visually parses as two periods. The same construction appears at line 80 as `Decimal` **positivo** with no range, and at line 2195 as `[0, 1]` (closed-interval notation) — so the section is itself inconsistent about how to write the score range.

**Suggested fix:** Standardize on `[0, 1]` (matches the You Do requirements line 2195) or write "entre 0 y 1" / "de 0 a 1" in prose.

---

### Issue #7 — Pluralized siglas (ORMs, APIs, DTOs, PIIs)  *(Severity: L)*

**Evidence (LT rule `SIGLAS`, 5 hits):**
- Line 31: "sin frameworks web ni **ORMs** (llegan más adelante)" → LT suggests `ORM`
- Line 32: "Nunca PII real ni **APIs** `is_fraud`/`is_family`" → LT suggests `API`
- Line 79: "no llames **APIs**, no escribas a disco" → LT suggests `API`
- Line 303: "**DTOs** de borde no tienen que ser idénticos" → LT suggests `DTO`
- Line 361: "de **ausencia** de **APIs** peligrosas" → LT suggests `API`

**RAE guidance:** "El plural de las siglas no se marca gráficamente" — siglas are invariable in Spanish (`las API`, `los ORM`, `los DTO`).

**Pedagogical impact:** Tech-Spanish usage widely accepts `APIs`/`ORMs`/`DTOs` as a Calque from English; learners will encounter both forms. The issue is purely stylistic consistency. The course has no documented house-style choice.

**Suggested fix:** Pick one form and apply it consistently across all 52 sections. If staying with the plural marker (more common in Peruvian tech speech), suppress the LT rule. If aligning with RAE, do a global rename.

---

### Issue #8 — `×` and `c/u` abbreviations in We Do intro  *(Severity: L)*

**Evidence (line 704):**
> Andamiaje **E1 guiado → E2 independiente → E3 transferencia** × 8 subtemas (24 ejercicios, 2 hints c/u). Cada starter trae **un defecto deliberado** (default mutable, float money, herencia forzada, Protocol mal nombrado, etc.) para que lo localices y corrijas. Solo tests de dominio; sin red/DB. Datos sintéticos PE (`C00x`, `@ejemplo.pe`).

**Issues:**
- `× 8 subtemas` mixes a math symbol with prose. "por 8 subtemas" is more standard.
- `2 hints c/u` — `hints` is English; `c/u` is acceptable abbreviation but `cada uno` is friendlier.
- `float money` and `default mutable` are English noun phrases inline.

**Pedagogical impact:** Minor readability friction; the intro is otherwise excellent at setting expectations.

**Suggested fix:** "Andamiaje **E1 guiado → E2 independiente → E3 transferencia** × 8 subtemas (24 ejercicios, 2 pistas cada uno). Cada starter trae **un defecto deliberado** (lista mutable por defecto, monto en `float`, herencia forzada, `Protocol` mal nombrado, etc.) para que lo localices y corrijas. Solo tests de dominio; sin red/DB. Datos sintéticos PE (`C00x`, `@ejemplo.pe`)."

---

### Issue #9 — Theory paragraph P20 (line 170) uses `E1_relabel` without prior definition  *(Severity: L)*

**Evidence:**
> Value objects (`RelationshipEvidence`) suelen ser frozen; agregados (`CaseFile` con listas de evidencias) pueden ser mutables con métodos `add` controlados. Caso sintético PE: set `{E1, E1_relabel, E2}` tiene tamaño **2** si la igualdad es solo por `entity_id` — el relabel de Ana no inventa una tercera entidad.

**Issue:** `E1_relabel` is introduced without prior mention of the "relabel" concept in the section. A learner reads `{E1, E1_relabel, E2}` and must infer that `E1_relabel` is a second `ResolvedEntity` with the same `entity_id` but a different `display_name`. The phrase "el relabel de Ana" appears without Ana having been mentioned in this paragraph.

**Pedagogical impact:** Mild confusion; the demo code in I Do (S11-T2-B-DEMO, lines 525-528) does show the relabel pattern with `e1b = ResolvedEntity("E1", "Ana actualizada")`, but the theory paragraph assumes the learner has already connected the dots.

**Suggested fix:** Add one clause: "Caso sintético PE: si creas `ResolvedEntity("E1", "Ana")` y luego `ResolvedEntity("E1", "Ana actualizada")`, el set `{e1, e1b, e2}` tiene tamaño **2** porque la igualdad es solo por `entity_id` — el relabel del nombre no inventa una tercera entidad."

---

### Issue #10 — Self-check Q3 option text has trailing fragment "implementable por fakes y adapters"  *(Severity: L)*

**Evidence (line 2362):**
```ts
options: ["Conectarse solo a Postgres",
          "Definir un puerto get/save implementable por fakes y adapters",
          "Reemplazar dataclass",
          "Serializar a PDF"],
```

**Issue:** "implementable por fakes y adapters" mixes the Spanish suffix `-able` (valid: `implementable` is in DLE) with two English nouns (`fakes`, `adapters`). The option is understandable but reads as Spanglish.

**Pedagogical impact:** Minor; the option is clearly the correct one and the Spanish suffix is valid.

**Suggested fix:** "Definir un puerto get/save implementable por falsos y adaptadores" or "Definir un puerto get/save que fakes y adaptadores pueden implementar".

---

### Issue #11 — "El software de familiaridad no declara parentesco legal ni fraude; solo organiza evidencia." callout content (line 389) is excellent but the callout title "Ética de producto" is the only callout that uses an abstract noun phrase  *(Severity: L — consistency only)*

The 8 callout titles are a mix of:
- Concept nouns: "Puertos", "Frontera", "Datos sintéticos", "Ética de producto"
- Imperative/concrete: "Sin veredictos", "Consulta vs comando", "Fail on construct"
- Code-y: "eq custom"

**Suggested fix:** Optional homogenization pass: make all callout titles imperative phrases that name the rule. E.g., "Ética de producto" → "Solo evidencia, sin veredictos"; "Datos sintéticos" → "Usa datos sintéticos"; "Puertos" → "Habla con Protocolos, no con ORMs"; "Frontera" → "I/O fuera del dominio". This is stylistic and not blocking.

---

### Issue #12 — Code-comment markers `# DEFECT:` and `# TODO:` inside starterCode are intentional, but the wording mixes English and Spanish  *(Severity: L)*

**Evidence (sample, lines 1085, 1800, 2210, 2221, 2225, 2235, 2247, 2258, 2272, 2276):**
```python
# CASO-LIM-011 · ClientRecord dataclass
# DEFECT: sin fields; default mutable list
...
# CASO-LIM-011 · to_dict sin nota interna
# DEFECT: incluye internal_note en el export
...
# Completa cada TODO. Los tests al final fallan hasta que el dominio esté bien.
...
        # TODO: rechazar client_id o document_id vacíos (strip)
```

**Issue:** `DEFECT` is English (Spanish would be `DEFECTO`); `TODO` is a universal Python-code convention and is acceptable. The student-facing Python comment `# Completa cada TODO. Los tests al final fallan hasta que el dominio esté bien.` is in correct Spanish and the `TODO` is a code marker, not prose.

**Pedagogical impact:** Negligible. The `# DEFECT:` marker is a recognizable developer signal that tells the student "this is the bug to find". Switching to `# DEFECTO:` is a stylistic choice.

**Suggested fix:** Optional: rename `# DEFECT:` → `# DEFECTO:` for Spanish consistency. Keep `# TODO:` (Python convention).

---

### Issue #13 — We Do exercise S11-T3-A-E1 instruction uses bare `person` (lowercase) for both variable name and class instance  *(Severity: L)*

**Evidence (line 1436):**
> E1 (guiado) — Reemplaza herencia innecesaria `Client(PersonInfo)` por composición: `Client` tiene un `person: PersonInfo`. Salida/pass: dos líneas — `C001 Ana` y `design=composition`. Solo stdlib.

**Issue:** The instruction says `Client` tiene un `person: PersonInfo` — using the Python type-annotation syntax inside prose. This is fine for a code-aware learner but the lowercase `person` (variable name) next to uppercase `PersonInfo` (class name) without clarification may confuse a beginner who hasn't internalized the Python naming convention.

**Pedagogical impact:** Minor; the actual code in `solutionCode` (line 1477-1481) makes it clear: `class Client: client_id: str; person: PersonInfo`. The instruction's prose could be clearer.

**Suggested fix:** "E1 (guiado) — Reemplaza la herencia innecesaria `Client(PersonInfo)` por composición: la clase `Client` tiene un campo `person` de tipo `PersonInfo`."

---

### Issue #14 — Inconsistent arrow spacing (`→` vs `→ `)  *(Severity: L)*

**Evidence:**
- Line 32: `**T1 Objetos** → **T2 Encapsulación**` (with spaces)
- Line 394: `en orden **T1→T4**` (no spaces, inside bold)
- Line 704: `**E1 guiado → E2 independiente → E3 transferencia**` (with spaces)
- Line 80: `Transaction("T1", "C001", Decimal("150.50"), "PEN")` — `PEN→USD` (no spaces)

**Pedagogical impact:** Negligible; both forms are typographically valid. A house style would help.

**Suggested fix:** Standardize on ` → ` (with spaces) in prose, and use the bare `→` only inside code-like expressions.

---

### Issue #15 — We Do exercise S11-T3-B-E3 expected output labels mix English (`WHEN_NOT`, `INTRODUCE`) without Spanish gloss  *(Severity: L)*

**Evidence (lines 1735-1737):**
```ts
tests: "Tres líneas: WHEN_NOT: solo_una_impl; WHEN_NOT: api_inestable; INTRODUCE: dos_adapters_con_fake.",
```

**Issue:** The `WHEN_NOT`/`INTRODUCE` labels are English contract tokens that the student's Python script must print exactly. The `tests` field tells the learner what to print but does not explain what the labels mean. A learner who prints "WHEN_NOT: solo_una_impl" may not realize "WHEN_NOT" means "no introduzcas Protocol en este caso".

**Pedagogical impact:** Minor; the surrounding `instruction` and `feedback` explain the YAGNI rule, so the labels are inferable.

**Suggested fix:** Add one Spanish gloss in the `instruction` or `feedback`: "Las etiquetas `WHEN_NOT` (no introduzcas) e `INTRODUCE` (sí introduzcas) son contratos de salida: deben aparecer literalmente en el print."

---

## 4. Meta-Leak Report

**Conclusion: Zero genuine meta-leaks in learner-facing Spanish prose.**

The shared grammar subplan defines meta-leaks as "AI-to-developer comments, 'moved from section X', design notes, or internal instructions that leaked into user-facing text."

The Meta-Leak Detector heuristic regex (`TODO|FIXME|XXX|TBD|WIP|pendiente|borrador|nota interna|placeholder|revisar después|limpiar después`) flagged zero learner-facing prose strings.

The only `# DEFECT:` and `# TODO:` markers in the file are inside `starterCode` code blocks (lines 1085, 1800, 2210, 2221, 2225, 2235, 2247, 2258, 2272, 2276) — these are **intentional scaffolding** that tells the student "here is the bug to fix" and "here is the placeholder to fill". They are learner-facing by design, not leaks.

**Adjacent meta-hazard (structural, not prose):** The file name `s11-testing.ts` and the section `id: "testing"` are leftovers from a prior topic. The defunct `s11-advanced-topics.ts` is still in the repo with `index: 11`. This is a maintenance meta-leak at the file-system/routing level (see Issue #2), not in rendered prose.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do fidelity

**I Do (8 demos, one per subtopic T1-A → T4-B):** Each demo has `description`, `code`, `why`. The `why` field is short (8–21 words) and explains the design rationale, not the mechanics. Examples:

- T1-A `why`: "from_dict nombra el borde dict→dominio con la forma canónica de ClientRecord; el CLI/JSON ya no inventa campos sueltos." (20 words)
- T4-B `why`: "La suite protege el límite ético del modelo: scores son datos; no hay is_fraud ni is_related_family." (16 words)

**Verdict:** Excellent. Each `why` is a single-sentence conceptual justification, not a code walkthrough. The progression T1-A → T4-B follows the announced order in paragraph P3.

**We Do (24 exercises, 8 subtopics × 3 levels):** Each subtopic has E1 (guiado), E2 (independiente), E3 (transferencia). Each E1 is a minimal version of the I Do demo; E2 introduces a new constraint; E3 transfers to a new context. The `feedback` field anticipates a common mistake (e.g., T1-A-E1: "Si dos instancias comparten la misma lista de emails, el default era mutable: usa default_factory"). The `starterCode` carries a deliberate `# DEFECT:` that the student must locate and fix — this is best-practice scaffolded debugging.

**Verdict:** Excellent. The 3-level scaffold (guiado → independiente → transferencia) is fully realized across all 8 subtopics. Edge cases (`edgeCases`) are concise (3–8 words) and pedagogically targeted.

**You Do (1 capstone `CP-N1-C`):** The capstone gives the learner a `starterCode` with `# TODO:` markers and an oracle `test_domain()` function that prints `tests_pass` only when all invariants hold. The 5 objectives and 9 requirements are explicit and traceable. The 6-criterion rubric (25/20/20/15/10/10 weights) is well-balanced: alignment 25%, correctness 20%, privacy 20%, edge cases 15%, legibility 10%, documentation 10%.

**Verdict:** Excellent. The oracle-test pattern ("tests_pass only if all correct") is a strong formative-assessment design.

**Autocheck (6 MCQs):** Each MCQ has 4 options, a `correctIndex`, and an `explanation`. Questions cover: `default_factory` (Q1), `signal_score` semantics (Q2), `Protocol` purpose (Q3), fail-on-construct timing (Q4), composition vs inheritance (Q5 — has Issue #1), absence of `is_fraud` (Q6).

**Verdict:** Good, with one defect (Issue #1, Q5 stem says "Person" not "PersonInfo").

### 5.2 Cognitive load and progressive disclosure

The section announces its order in paragraph P3:
> Orden: **T1 Objetos** → **T2 Encapsulación** → **T3 Diseño** → **T4 Límites** (repos/tests).

Each subtopic is built on the previous one (T2-B uses the `frozen` from T2-A; T3-A uses the entity identity from T2-B; T3-B uses the composition from T3-A; T4-A uses the Protocol from T3-B; T4-B uses the service from T4-A). The progression is signaled in prose ("Tras fijar identidad frozen en T2-B, el diseño pasa a…", "Tras el paquete y la CLI de S10, el código deja de ser dicts anónimos…").

**Cognitive-load risks:**
1. **English tech-term density is high.** Many paragraphs have ≥40% English-derived tokens (`dataclass`, `Protocol`, `frozen`, `fail-closed`, `side-effects`, `schema`, `boilerplate`, `runtime`, `fakes`, `adapters`, `DTOs`, `ORMs`, `PII`, `clamp`, `fixes`, `score`, `set`, `dict`, `list`, `tuple`, `set`, `key`, `hash`, `eq`, `__init__`, `__post_init__`, `__repr__`, `__eq__`, `__hash__`, `@property`, `@dataclass`, `@runtime_checkable`, `typing.Protocol`, `field(default_factory=list)`, `field(compare=False)`, `Decimal`, `from_dict`, `to_dict`). This is unavoidable for a Python OOP unit but should be glossary-supported.
2. **Paragraphs P10, P18, P21 exceed 32 words** (Issue #3) — they cram 2–3 ideas each and would benefit from being split or moved to a list.
3. **The ethical guardrail ("no is_fraud / is_family") is repeated in 7+ places.** This is deliberate reinforcement, not redundancy, and supports retention.

### 5.3 Connective tissue and narrative flow

The section opens with a strong one-paragraph transition from S10 ("Tras el paquete y la CLI de S10, el código deja de ser dicts anónimos…") and closes the theory tab with T4-B which explicitly bridges to S12 and S13 ("el adapter SQL/HTTP llega en **S12**", "CP-N1-C"). The We Do intro and You Do context both reference S10/S12/S13. The self-check explanations reference T1-B, T2-A, T3-A, T3-B, T4-A, T4-B by name.

**Verdict:** Strong connective tissue. The section is well-integrated with the CP-N1-C capstone and the roadmap.

### 5.4 Consistency with overall roadmap

| Reference | In Section 11 | Status |
|-----------|---------------|--------|
| S08 ETL + cuarentena | "Reutiliza normalizadores de S05–S07" (no, this is S09 text) — Section 11 does not reference S08 directly. | OK (no broken refs) |
| S09 logs/PII | Implicit in "no PII real en fixtures" | OK |
| S10 CLI | "Tras el paquete y la CLI de S10" (P1) | OK |
| S12 SQL adapter | "el adapter SQL/HTTP llega en **S12**" (P28) | OK |
| S13 dashboard | "listos para el dashboard de evidencia en S13" (jobRelevance) | OK |
| CP-N1-C gate | Referenced in P3, callout #1, youDo context, rubric criterion 1 | OK |
| `is_fraud`/`is_family` ban | Reinforced in P2, P22, P34, youDo objective 3, self-check Q2/Q6, T4-B-E3 | OK |

### 5.5 Comparison with best-in-class external materials

| Source | Comparable topic | Section 11 verdict |
|--------|------------------|--------------------|
| Real Python — Python Classes (cited in resources) | Basic OOP | Section 11 is more advanced (dataclass, frozen, Protocol, repo/service) and is ethically framed. |
| MIT 6.100L — objects & classes (cited) | Intro OOP | Section 11 covers MIT's content plus Protocol, frozen, invariants — denser but appropriate for an intermediate course. |
| Architecture Patterns with Python (Percival & Gregory, cited) | DDD repo/service/protocol | Section 11 implements the same patterns (Repository light, Service light, Protocol port, fakes for tests) in a more compact, Spanish-language, ethics-first framing. |
| Fluent Python (Ramalho, cited) | Object model, eq/hash/frozen | Section 11 distills the eq/hash/frozen discussion into 3 paragraphs (P18-P20) — accurate but compressed. |

**Verdict:** Section 11 is competitive with cited external materials. It is denser than Real Python / MIT 6.100L (intentionally — it's an intermediate unit) and lighter than Architecture Patterns with Python (appropriate — that book is 350+ pages). The ethics framing is a distinctive strength not found in the comparison materials.

---

## 6. Grammatical Improvements — Paragraph-by-Paragraph Rewriting

> Method note: Per the shared grammar subplan, every learner-facing Spanish paragraph in the **Teoría** tab was scored with Fernández-Huerta (1959) and Szigriszt-Pazos/INFLESZ readability, plus WPS (words per sentence) and SPW (syllables per word). The pedagogical soft targets for technical Spanish are WPS ≈ 15–32, SPW ≈ 1.9–2.4, FH ≈ 50–70 ("normal" to "bastante difícil"). Mean values for Section 11: **FH=71.5** ("bastante fácil"), **INFLESZ=66.8** ("normal"), **WPS=9.9** (median 9.0), **SPW=2.09**. These are healthy.

For brevity in this audit, I rewrite only the **paragraphs with actionable issues** (the three long paragraphs from Issue #3, plus the two with the `Person`/`PersonInfo` defect). The remaining 30 paragraphs are clean. The full per-paragraph metric table is in `/home/z/my-project/audits/_s11_grammar.json`.

### 6.1 Theory · T1-B · Paragraph P10 — Before / After

**Before (line 79, 49 words, FH=57.0):**
> Método `validate()` reutilizable ayuda en factories `from_dict` y rehidratación desde JSON: centraliza las reglas y las invoca desde `__post_init__` o desde el borde de serialización. **Sin side-effects de negocio** al validar: no llames APIs, no escribas a disco, no "fixes" silenciosos de moneda. Stack: stdlib + `Decimal`; no ORM.

**After (split into 2 paragraphs + 1 list; the four-rule "no side-effects" becomes a list):**
> Método `validate()` reutilizable ayuda en factories `from_dict` y en la rehidratación desde JSON: centraliza las reglas y las invoca desde `__post_init__` o desde el borde de serialización.
>
> Al validar, **sin side-effects de negocio**:
> - no llames APIs,
> - no escribas a disco,
> - no apliques "arreglos" silenciosos de moneda.
>
> Stack: stdlib + `Decimal`; sin ORM.

**Improvement:** WPS drops from 24.5 → ~12 (paragraph 1) and the list removes the run-on. FH improves to ~70.

### 6.2 Theory · T2-B · Paragraph P18 — Before / After

**Before (line 168, 42 words, FH=38.3 — hardest in the section):**
> La identidad de `ResolvedEntity` usa su **`entity_id` estable**, no `document_id`: un documento es PII, puede corregirse o reemitirse y no debe fusionar entidades por accidente en el set de resolución. **`frozen=True`** habilita hash seguro para sets y dicts de matching local.

**After (split rationale into a list; second sentence stays as its own paragraph):**
> La identidad de `ResolvedEntity` usa su **`entity_id` estable**, no `document_id`. Un documento es PII y puede corregirse o reemitirse; usarlo como identidad fusionaría entidades por accidente en el set de resolución.
>
> **`frozen=True`** habilita hash seguro para sets y dicts de matching local.

**Improvement:** First paragraph drops from 35 → 22 words; second paragraph is 11 words. FH improves from 38.3 → ~55.

### 6.3 Theory · T3-A · Paragraph P21 — Before / After (also fixes Issue #1)

**Before (line 207, 45 words, FH=54.6, uses bare `Person`):**
> Tras fijar identidad frozen en T2-B, el diseño pasa a **cómo se agrupan** los objetos. **has-a** (composición) modela el caso de familiaridad: `CaseFile` tiene una `ResolvedEntity` y una lista de `RelationshipEvidence`. No fuerces `Client(Person(BaseEntity))` solo para reutilizar un campo de nombre.

**After (split into 2 paragraphs; replace `Person` with `PersonInfo` for consistency with We Do):**
> Tras fijar la identidad frozen en T2-B, el diseño pasa a **cómo se agrupan** los objetos. La relación **has-a** (composición) modela el caso de familiaridad: `CaseFile` tiene una `ResolvedEntity` y una lista de `RelationshipEvidence`.
>
> No fuerces `Client(PersonInfo(BaseEntity))` solo para reutilizar un campo de nombre.

**Improvement:** Paragraph 1 drops from 35 → 27 words; paragraph 2 is 16 words. `Person` → `PersonInfo` aligns with We Do S11-T3-A-E1 and self-check Q5.

### 6.4 Self-check Q5 — Before / After (Issue #1)

**Before (line 2375):**
```ts
question: "Client hereda de Person…",
```

**After:**
```ts
question: "Client hereda de PersonInfo…",
```

### 6.5 I Do / We Do / You Do / Self Check — Tab-level grammar summary

| Tab | Records | Mean WPS | Mean FH | Long sentences | Action |
|-----|---------|----------|---------|-----------------|--------|
| Teoría (paragraphs) | 35 | 15.7 | 72.5 | 3 (P10, P18, P21) | Split per §6.1–6.3 |
| Yo hago (why/description) | 16 | 9.7 | 73.6 | 0 | None |
| Hacemos juntos (instruction/hint/hints/edgeCases/tests/feedback) | 162 | 7.4 | 76.1 | 0 | None — minor polish in intro (Issue #8) |
| Tú haces (context/objectives/requirements/portfolioNote/rubric) | 22 | 9.8 | 70.4 | 0 | None |
| Autocheck (question/options/explanation) | 29 | 8.2 | 74.8 | 0 | Fix Q5 stem (Issue #1); optional Q3 polish (Issue #10) |
| Callouts (title/content) | 17 | 6.5 | 78.0 | 0 | Translate "Fail on construct" and "eq custom" (Issue #4) |

---

## 7. Proposed GitHub-Style Diffs

> All diffs are against `src/lib/course/sections/s11-testing.ts` in the pyarcana repo. Do **not** apply without coordinator approval — these are audit proposals.

### Diff for Issue #1 (Self-check Q5 stem: `Person` → `PersonInfo`)

```diff
--- a/src/lib/course/sections/s11-testing.ts
+++ b/src/lib/course/sections/s11-testing.ts
@@ -2372,7 +2372,7 @@
       },
       {
-        question: "Client hereda de Person…",
+        question: "Client hereda de PersonInfo…",
         options: ["Siempre es la mejor opción", "Es obligatoria en Python", "A menudo es frágil; composición (Client tiene PersonInfo) suele bastar", "Impide tests"],
         correctIndex: 2,
```

### Diff for Issue #1b (Theory P21: `Person` → `PersonInfo`, also split — combined with Issue #3c)

```diff
--- a/src/lib/course/sections/s11-testing.ts
+++ b/src/lib/course/sections/s11-testing.ts
@@ -204,9 +204,11 @@
       subtopicId: "S11-T3-A",
       paragraphs: [
-        "Tras fijar identidad frozen en T2-B, el diseño pasa a **cómo se agrupan** los objetos. **has-a** (composición) modela el caso de familiaridad: `CaseFile` tiene una `ResolvedEntity` y una lista de `RelationshipEvidence`. No fuerces `Client(Person(BaseEntity))` solo para reutilizar un campo de nombre.",
+        "Tras fijar la identidad frozen en T2-B, el diseño pasa a **cómo se agrupan** los objetos. La relación **has-a** (composición) modela el caso de familiaridad: `CaseFile` tiene una `ResolvedEntity` y una lista de `RelationshipEvidence`.",
+        "No fuerces `Client(PersonInfo(BaseEntity))` solo para reutilizar un campo de nombre.",
         "Una evidencia usa un **par canónico** (`left_id < right_id`), ids distintos y `signal_score` finito en [0, 1]. Así (E1,E2) y (E2,E1) no duplican la misma relación en el almacén de matching. Fail-closed si el par no es canónico o el score es NaN/out-of-range — no "clamps" silenciosos.",
```

### Diff for Issue #3a (Theory P10: split + list + translate "fixes")

```diff
--- a/src/lib/course/sections/s11-testing.ts
+++ b/src/lib/course/sections/s11-testing.ts
@@ -76,9 +76,14 @@
       subtopicId: "S11-T1-B",
       paragraphs: [
         "`__post_init__` en dataclasses valida justo después de construir. Si el estado es inválido, **falla al crear** — un `ClientRecord` a medias en un set de resolución es peor que un `ValueError` temprano. Las reglas viven junto al tipo, no en un script suelto del CLI.",
-        "Método `validate()` reutilizable ayuda en factories `from_dict` y rehidratación desde JSON: centraliza las reglas y las invoca desde `__post_init__` o desde el borde de serialización. **Sin side-effects de negocio** al validar: no llames APIs, no escribas a disco, no "fixes" silenciosos de moneda. Stack: stdlib + `Decimal`; no ORM.",
+        "Método `validate()` reutilizable ayuda en factories `from_dict` y en la rehidratación desde JSON: centraliza las reglas y las invoca desde `__post_init__` o desde el borde de serialización.",
+        "Al validar, **sin side-effects de negocio**: no llames APIs, no escribas a disco, no apliques "arreglos" silenciosos de moneda. Stack: stdlib + `Decimal`; sin ORM.",
         "Ejemplo: `document_id` no vacío; en `Transaction`, `amount` es `Decimal` **positivo** y `currency` ∈ allowlist `{'PEN','USD'}`. Nunca conviertas PEN→USD en el constructor. Caso sintético PE: `Transaction(\"T1\", \"C001\", Decimal(\"150.50\"), \"PEN\")` acepta; `\"EUR\"` o `amount<=0` rechaza."
       ],
```

### Diff for Issue #3b (Theory P18: split + improve flow)

```diff
--- a/src/lib/course/sections/s11-testing.ts
+++ b/src/lib/course/sections/s11-testing.ts
@@ -165,9 +165,10 @@
       subtopicId: "S11-T2-B",
       paragraphs: [
-        "La identidad de `ResolvedEntity` usa su **`entity_id` estable**, no `document_id`: un documento es PII, puede corregirse o reemitirse y no debe fusionar entidades por accidente en el set de resolución. **`frozen=True`** habilita hash seguro para sets y dicts de matching local.",
+        "La identidad de `ResolvedEntity` usa su **`entity_id` estable**, no `document_id`. Un documento es PII y puede corregirse o reemitirse; usarlo como identidad fusionaría entidades por accidente en el set de resolución.",
+        "**`frozen=True`** habilita hash seguro para sets y dicts de matching local.",
         "Entidades mutables como keys de dict son una fuente clásica de bugs: el hash cambia si mutas un campo que entra en `__eq__`/`__hash__`. Usa `field(compare=False)` para etiquetas visibles (`display_name`) que se pueden corregir sin romper la igualdad. Fail-closed: `entity_id` vacío o solo espacios → `ValueError` al construir.",
         "Value objects (`RelationshipEvidence`) suelen ser frozen; agregados (`CaseFile` con listas de evidencias) pueden ser mutables con métodos `add` controlados. Caso sintético PE: set `{E1, E1_relabel, E2}` tiene tamaño **2** si la igualdad es solo por `entity_id` — el relabel de Ana no inventa una tercera entidad."
       ],
```

### Diff for Issue #4 (Callout titles: English → Spanish)

```diff
--- a/src/lib/course/sections/s11-testing.ts
+++ b/src/lib/course/sections/s11-testing.ts
@@ -110,7 +110,7 @@
       callout: {
         type: "warning",
-        title: "Fail on construct",
+        title: "Falla al construir",
         content:
           "Un objeto inválido en memoria es peor que una excepción temprana.",
       },
@@ -195,7 +195,7 @@
       callout: {
         type: "info",
-        title: "eq custom",
+        title: "Igualdad personalizada",
         content:
           "`field(compare=False)` excluye display_name de eq/hash. No uses document_id como identidad de ResolvedEntity.",
       },
```

### Diff for Issue #5 (Inline English verbs: "fixes" → "arreglos", "clamp" → "recorta")

```diff
--- a/src/lib/course/sections/s11-testing.ts
+++ b/src/lib/course/sections/s11-testing.ts
@@ -205,7 +205,7 @@
       paragraphs: [
-        "Una evidencia usa un **par canónico** (`left_id < right_id`), ids distintos y `signal_score` finito en [0, 1]. Así (E1,E2) y (E2,E1) no duplican la misma relación en el almacén de matching. Fail-closed si el par no es canónico o el score es NaN/out-of-range — no "clamps" silenciosos.",
+        "Una evidencia usa un **par canónico** (`left_id < right_id`), ids distintos y `signal_score` finito en [0, 1]. Así (E1,E2) y (E2,E1) no duplican la misma relación en el almacén de matching. Fail-closed si el par no es canónico o el score es NaN/out-of-range — no "recortes" silenciosos.",
       ],
@@ -358,7 +358,7 @@
       paragraphs: [
-        "Assert de invariantes y de **ausencia** de APIs peligrosas (`is_fraud`, `is_related_family`). Un test de "no existe el método" documenta la ética del producto en código — no es adorno: protege el límite legal del matching. Fail-closed: score fuera de [0,1] no se "clamp" en silencio en el constructor.",
+        "Assert de invariantes y de **ausencia** de APIs peligrosas (`is_fraud`, `is_related_family`). Un test de "no existe el método" documenta la ética del producto en código — no es adorno: protege el límite legal del matching. Fail-closed: score fuera de [0,1] no se "recorta" en silencio en el constructor.",
       ],
```

### Diff for Issue #6 (`0..1` → `[0, 1]`)

```diff
--- a/src/lib/course/sections/s11-testing.ts
+++ b/src/lib/course/sections/s11-testing.ts
@@ -121,7 +121,7 @@
       paragraphs: [
-        "Setters validados solo cuando la mutación es parte del modelo de negocio (p. ej. un score 0..1); si no, prefiere **`frozen`** o devolver una **nueva instancia**. Caso sintético PE: `ClientRecord(\"C003\", \"DNI-3\", \"Lucía Méndez\", [\"lucia@ejemplo.pe\"])` imprime display_name y email enmascarado sin PII completa en stdout."
+        "Setters validados solo cuando la mutación es parte del modelo de negocio (p. ej. un score en [0, 1]); si no, prefiere **`frozen`** o devolver una **nueva instancia**. Caso sintético PE: `ClientRecord(\"C003\", \"DNI-3\", \"Lucía Méndez\", [\"lucia@ejemplo.pe\"])` imprime display_name y email enmascarado sin PII completa en stdout."
       ],
```

### Diff for Issue #8 (We Do intro: `×` and `hints`)

```diff
--- a/src/lib/course/sections/s11-testing.ts
+++ b/src/lib/course/sections/s11-testing.ts
@@ -701,7 +701,7 @@
   weDo: {
-    intro: "Andamiaje **E1 guiado → E2 independiente → E3 transferencia** × 8 subtemas (24 ejercicios, 2 hints c/u). Cada starter trae **un defecto deliberado** (default mutable, float money, herencia forzada, Protocol mal nombrado, etc.) para que lo localices y corrijas. Solo tests de dominio; sin red/DB. Datos sintéticos PE (`C00x`, `@ejemplo.pe`).",
+    intro: "Andamiaje **E1 guiado → E2 independiente → E3 transferencia** por 8 subtemas (24 ejercicios, 2 pistas cada uno). Cada starter trae **un defecto deliberado** (lista mutable por defecto, monto en `float`, herencia forzada, `Protocol` mal nombrado, etc.) para que lo localices y corrijas. Solo tests de dominio; sin red/DB. Datos sintéticos PE (`C00x`, `@ejemplo.pe`).",
     steps: [
```

### Diff for Issue #9 (Clarify `E1_relabel` in P20)

```diff
--- a/src/lib/course/sections/s11-testing.ts
+++ b/src/lib/course/sections/s11-testing.ts
@@ -167,7 +167,7 @@
       paragraphs: [
         "Entidades mutables como keys de dict son una fuente clásica de bugs: el hash cambia si mutas un campo que entra en `__eq__`/`__hash__`. Usa `field(compare=False)` para etiquetas visibles (`display_name`) que se pueden corregir sin romper la igualdad. Fail-closed: `entity_id` vacío o solo espacios → `ValueError` al construir.",
-        "Value objects (`RelationshipEvidence`) suelen ser frozen; agregados (`CaseFile` con listas de evidencias) pueden ser mutables con métodos `add` controlados. Caso sintético PE: set `{E1, E1_relabel, E2}` tiene tamaño **2** si la igualdad es solo por `entity_id` — el relabel de Ana no inventa una tercera entidad."
+        "Value objects (`RelationshipEvidence`) suelen ser frozen; agregados (`CaseFile` con listas de evidencias) pueden ser mutables con métodos `add` controlados. Caso sintético PE: si creas `ResolvedEntity(\"E1\", \"Ana\")` y luego `ResolvedEntity(\"E1\", \"Ana actualizada\")`, el set `{e1, e1b, e2}` tiene tamaño **2** porque la igualdad es solo por `entity_id` — el relabel del nombre no inventa una tercera entidad."
       ],
```

### Diff for Issue #10 (Self-check Q3 option: Spanglish)

```diff
--- a/src/lib/course/sections/s11-testing.ts
+++ b/src/lib/course/sections/s11-testing.ts
@@ -2360,7 +2360,7 @@
       {
         question: "Un Protocol EntityStore sirve para…",
-        options: ["Conectarse solo a Postgres", "Definir un puerto get/save implementable por fakes y adapters", "Reemplazar dataclass", "Serializar a PDF"],
+        options: ["Conectarse solo a Postgres", "Definir un puerto get/save implementable por falsos y adaptadores", "Reemplazar dataclass", "Serializar a PDF"],
         correctIndex: 1,
```

### Diff for Issue #12 (Code-comment markers: `DEFECT` → `DEFECTO`)

```diff
--- a/src/lib/course/sections/s11-testing.ts
+++ b/src/lib/course/sections/s11-testing.ts
@@ -722,7 +722,7 @@
           title: "complete_client.py",
-          code: `# CASO-LIM-011 · ClientRecord dataclass
-# DEFECT: sin fields; default mutable list
+          code: `# CASO-LIM-011 · ClientRecord dataclass
+# DEFECTO: sin fields; default mutable list
 from dataclasses import dataclass
```
*(apply to all 10 occurrences of `# DEFECT:` in starterCode blocks — lines 723, 771, 819, 891, 960, 1023, 1085, 1134, 1193, 1271, 1327, 1383, 1449, 1505, 1562, 1642, 1691, 1741, 1799, 1866, 1915, 1986, 2043, 2126)*

### Diff for Issue #2 (File rename + id change) — *larger refactor, coordinate with Fixer*

```diff
--- a/src/lib/course/index.ts
+++ b/src/lib/course/index.ts
@@ -9,7 +9,7 @@
-import { section11 } from './sections/s11-testing'
+import { section11 } from './sections/s11-oop-domain'

# File rename: s11-testing.ts → s11-oop-domain.ts
# In s11-oop-domain.ts:
--- a/src/lib/course/sections/s11-oop-domain.ts
+++ b/src/lib/course/sections/s11-oop-domain.ts
@@ -1,6 +1,6 @@
 export const section11: CourseSection = {
-  id: "testing",
+  id: "oop-domain",
   index: 11,
   title: "OOP y modelo de dominio",
```
*Note:* This changes the live URL from `#testing` to `#oop-domain`. Any external links to the section must be redirected. Also delete or archive `s11-advanced-topics.ts`.

---

## 8. Recommended Priority Order for Fixing

| Priority | Issue | Effort | Risk |
|----------|-------|--------|------|
| **P0** (block learning) | #1 Self-check Q5 stem "Person" → "PersonInfo" | 1 line edit | None |
| **P1** (consistency) | #3a, #3b, #3c Split 3 long theory paragraphs | 3 paragraph rewrites | None |
| **P2** (consistency) | #5 Translate inline "fixes"/"clamp"/"clamps" | 3 phrase edits | None |
| **P3** (consistency) | #4 Translate callout titles "Fail on construct" / "eq custom" | 2 title edits | None |
| **P4** (clarity) | #9 Clarify `E1_relabel` in P20 | 1 paragraph rewrite | None |
| **P5** (clarity) | #10 Self-check Q3 Spanglish option | 1 option edit | None |
| **P6** (clarity) | #6 `0..1` → `[0, 1]` | 1 char edit | None |
| **P7** (polish) | #8 We Do intro `×`/`hints`/`c/u` | 1 intro rewrite | None |
| **P8** (polish) | #13 We Do S11-T3-A-E1 instruction clarity | 1 instruction edit | None |
| **P9** (polish) | #14 Arrow spacing consistency | Multi-paragraph | Low |
| **P10** (polish) | #15 Spanish gloss for `WHEN_NOT`/`INTRODUCE` labels | 1 feedback edit | None |
| **P11** (polish) | #11 Callout title homogenization | 8 title edits | Low |
| **P12** (style) | #7 Pluralized siglas (`ORMs`/`APIs`/`DTOs`) — global house style | Course-wide | Medium |
| **P13** (style) | #12 `# DEFECT:` → `# DEFECTO:` in starterCode | 24 edits | None |
| **P14** (structural) | #2 Rename file `s11-testing.ts` → `s11-oop-domain.ts`, change `id` to `"oop-domain"`, archive `s11-advanced-topics.ts` | Coordinated refactor | Medium — changes live URL |

---

## 9. Graph Memory Update Notes (for shared context files)

- **Section 11 = "OOP y modelo de dominio"** (active source: `s11-testing.ts`, 2,456 lines). The defunct `s11-advanced-topics.ts` (also `index: 11`) is inactive and should be deleted/archived in a Fixer pass.
- **Ethical guardrail pattern (course-wide):** "No `is_fraud`/`is_family`/`decide_fraud` in domain code" — Section 11 reinforces this in P2, P22, P34, youDo objective 3, self-check Q2/Q6, We Do T4-B-E3. Other auditors should verify the same pattern in their sections.
- **Synthetic-PE data convention:** ids `C00x`/`E0x`, emails `@ejemplo.pe`, montos `Decimal` en PEN/USD. Used consistently across S11. Auditors of S12/S13 should verify these conventions propagate.
- **CP-N1-C gate:** Section 11 is the construction phase of CP-N1-C. S13 (Evidence Dashboard) closes the gate. Auditors of S13 should verify that the four types (`ClientRecord`, `ResolvedEntity`, `Transaction`, `RelationshipEvidence`) appear in S13's dashboard scope.
- **Cross-section naming:** Section 11 uses `PersonInfo` as the example parent class (We Do T3-A-E1, self-check Q5 options/explanation) but `Person` in the abstract anti-pattern illustration (theory P21) and self-check Q5 stem. The canonical name going forward should be `PersonInfo` (more descriptive, matches working code).
- **House-style open questions for the orchestrator:**
  1. Should `ORMs`/`APIs`/`DTOs`/`PIIs` be left pluralized (current) or normalized to `ORM`/`API`/`DTO`/`PII` per RAE? (Issue #7)
  2. Should `# DEFECT:` markers in starterCode be Spanish-ized to `# DEFECTO:`? (Issue #12)
  3. Should arrow notation `→` have spaces in prose (` → `)? (Issue #14)
  4. Should callout titles be imperative phrases or noun phrases? (Issue #11)
- **Readability benchmarks (S11):** Mean FH=71.5 ("bastante fácil"), mean INFLESZ=66.8 ("normal"), median WPS=9.0, mean SPW=2.09. These are healthy for an intermediate technical section. Auditors of other intermediate sections (S05, S10) can use these as a comparison baseline.
- **LanguageTool usage note:** The public LT API flagged 216 `MORFOLOGIK_RULE_ES` spell-check hits on Section 11, but 100% were false positives on code identifiers and English tech jargon inside backticks (`ClientRecord`, `dataclass`, `Protocol`, `__post_init__`, etc.). Future auditors should pre-strip code spans before sending to LT, or filter `MORFOLOGIK_RULE_ES` matches by checking if the flagged token is inside backticks in the source.

---

## 10. Method Note (Grammar Subplan Application)

Per `/home/z/my-project/audits/_GRAMMAR_SUBPLAN.md`, the following research-backed heuristics were applied:

1. **Fernández-Huerta (1959)** readability formula: `FH = 206.84 − 60·(syllables/word) − 1.02·(words/sentence)`. Interpretive bands: ≥90 muy fácil → <30 muy difícil. For technical Spanish, "normal / bastante difícil" (~50–70) is healthy.
2. **Szigriszt-Pazos / INFLESZ**: `INFLESZ = 206.835 − 62.3·(syllables/word) − (words/sentence)`. Same interpretive logic.
3. **WPS** (words per sentence) — pedagogical soft target ~15–32 for technical ES.
4. **SPW** (syllables per word) — rough Spanish vowel-group heuristic.
5. **LanguageTool** public HTTP API (`language=es`) — one chunk of ~9.8k characters covering all theory paragraphs + intro/context/jobRelevance/portfolioNote. Rate-limit-safe.
6. **Pedagogical Spanish heuristics** (offline): run-on (>45 w), long (>32 w), missing terminal punctuation, missing `¿`/`¡`, unbalanced delimiters, repeated word (`de de`), English-dominant sentence, meta/AI/TODO leak, gerund pile-up (≥3), high comma density, anaphoric monotony, space-before-punct, double space.

**Validation:** 315 prose records extracted; FH in plausible range (mean 71.5, range -23.2 to 122.6 — the extremes are short taglines/identifiers, not learner paragraphs). Known false-positive classes: (a) `MORFOLOGIK_RULE_ES` on code identifiers, (b) `SIGLAS` on tech-accepted plural siglas, (c) `missing_terminal` on list items (objectives/edgeCases/options), (d) `english_dominant` on paragraphs with many code spans in backticks. These were filtered during interpretation.

**Deliverables in this report:**
- Method note (this section).
- Per-paragraph metrics for the 3 long paragraphs (§6.1–6.3) and tab-level summary (§6.5).
- Cause → improvement playbook with section-specific samples (Issues #1–#15).
- No automatic rewrites applied (audit-only; diffs proposed, not executed).

Full per-record metrics: `/home/z/my-project/audits/_s11_grammar.json`.
Full LT matches: `/home/z/my-project/audits/_s11_lt.json`.
Helper script: `/home/z/my-project/audits/_s11_grammar.py`.

---

**This is the complete Explorer report for Section 11. Ready for the Fixer prompt.**
