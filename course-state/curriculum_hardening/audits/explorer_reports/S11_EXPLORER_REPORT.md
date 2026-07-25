# Explorer Report — Section 11 (S11)

**Auditor role:** Curriculum Auditor · Pedagogical Analyst · Technical Editor  
**Method:** Stanford STORM multi-pass + Graph Engineering + Loop Engineering  
**Scope rule honored:** Section 11 only (no content fixes applied)  
**Sources:** Live curriculum shell https://pillb.github.io/pyarcana/ (S11 card + route hash `#testing`); repo source `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s11-testing.ts`; SECTION_MAP.tsv; comparative sample `s05-oop.ts`; pedagogical research (GRR / I–We–You Do, cognitive load, dataclasses/domain modeling)

---

## 1. Section Identification & Scope

| Field | Value |
|--------|--------|
| **Section index** | 11 |
| **Platform section id (hash)** | `testing` |
| **Live URL** | https://pillb.github.io/pyarcana/#testing |
| **Source file** | `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s11-testing.ts` |
| **Title (metadata)** | OOP y modelo de dominio |
| **shortTitle** | OOP dominio |
| **Tagline** | ClientRecord, ResolvedEntity, Transaction y RelationshipEvidence sin decidir fraude ni parentesco |
| **Level / phase / hours** | Intermedio · phase 0 · 19h |
| **Gate framing** | CP-N1-C (núcleo de dominio) |
| **Theory blocks** | 9 (mapa + 8 subtemas T1-A…T4-B) |
| **I Do demos** | 8 (uno por subtema) |
| **We Do exercises** | 24 (E1 guided / E2 independent / E3 transfer × 8) |
| **You Do** | 1 portfolio project (starter + rubric) |
| **Self-check** | 6 MCQs |
| **Out of scope this run** | Fixing TS; other sections; product UI code |

**Learner-facing content claim (what S11 actually teaches):** Python OOP for a familiarity/matching domain model — `dataclass`, invariants/`__post_init__`, properties, frozen/eq/hash, composition over inheritance, `Protocol` ports, light repo/service + `to_dict`, pure domain tests, and hard ethical boundaries (no `is_fraud` / `is_family` verdicts).

**Structural residue:** Platform id, filename, and several user-facing strings still narrate a **pytest/CI “testing”** past that was retemed to OOP/domain.

---

## 2. Executive Summary of Quality

### Score: **6.4 / 10**

### Verdict
**Solid pedagogical spine, compromised learner-facing polish.** The technical arc (T1 objects → T2 encapsulation → T3 design → T4 boundaries) is coherent, ethically strong, and well aligned with CP-N1-C and later S12/S13. Relative to best-practice GRR and to cleaned early sections, S11 is dragged down by **developer meta-leaks (V3 retheme / id `testing`)**, **truncated We Do instructions**, **ClientRecord schema thrashing**, an **over-complete You Do starter**, and several **print-only “transfer” exercises** that under-deliver coding transfer.

**Strengths**
- Explicit product ethics: scores as data, not legal fraud/kinship verdicts — rare and valuable in industry-oriented curricula.
- Progressive topic map T1–T4 is sound; outcomes match demos and quiz.
- Concrete PE-synthetic fixtures (`C00x`, `@ejemplo.pe`, PEN/USD `Decimal`).
- Good external docs (dataclasses, Protocol, decimal, PEP 544) and book alignment (*Architecture Patterns with Python*).
- Self-check items are tightly aligned to core misconceptions (mutable default, Protocol purpose, fail-on-construct, composition).

**Critical weaknesses**
- User-facing “curriculum surgery” language (“En V3…”, “retematiza”, “id `testing` conservado”, “legado de test suite churn”).
- Multiple We Do instructions cut mid-sentence (`Conserva el contrato del.`, `no ORMs de.`, `no.`).
- One exercise instruction is semantically broken (S11-T2-A-E3).
- Domain type shapes for `ClientRecord` / `CaseFile` change every few demos → high extraneous cognitive load.
- You Do starter is nearly a full solution → violates productive struggle of the You Do phase.

**Comparative one-liner:** Stronger domain ethics than most public OOP intros (CS50P / Real Python classes), but weaker redaction hygiene than a gold-standard cleaned section should show after V3 retheme.

---

## 3. Detailed Issue Registry

Severity key: **P0** blocker / learner-breaking · **P1** high (clarity, pedagogy, ethics messaging) · **P2** medium · **P3** polish.

| ID | Severity | Dimension | Location | Evidence (quote / summary) | Pedagogical impact |
|----|----------|-----------|----------|----------------------------|--------------------|
| **I-01** | P1 | Meta-leak | `jobRelevance` | «Esta sección (id `testing` conservado) retematiza S11 a **OOP y dominio**… pytest/CI se reubican…» | Student sees platform/editor chat, not job motivation. Undermines professional tone. |
| **I-02** | P1 | Meta-leak / flow | Theory #1 heading + paras | Heading «De “Testing pytest/CI” a OOP…»; «En V3, **S11 no es el path principal de pytest…**»; «Id de plataforma `testing` se conserva.» | Opens the section with version control for authors, not a learning goal. Extraneous load before first dataclass. |
| **I-03** | P1 | Meta-leak | `youDo.context` | «Reemplaza el legado de test suite churn.» | Opaque internal product history; confuses portfolio brief. |
| **I-04** | P2 | Meta-leak | `youDo.rubric[0]` | «Alineación al gate **V3** de la sección» | Students do not grade against “V3”; should be “gate CP-N1-C / objetivos de la sección”. |
| **I-05** | P2 | Meta-leak | `resources.courses` notes | «Testing reubicado; target V3 S11 = dominio OOP.» · «curso desplegado; alinear con V3 S11.» | Resource notes read like fixer TODOs. |
| **I-06** | P1 | Consistency / UX | id vs title vs file | `id: "testing"`, file `s11-testing.ts`, UI title «OOP dominio»; live hash `#testing` | Bookmarks, search, and mental model mismatch. Learner expects “testing”; content is OOP. |
| **I-07** | P0 | Redaction | We Do instructions (multiple) | Truncations: «Conserva el contrato del.» (T1-A-E2); «no ORMs de S19;.» (T1-B-E1); «no ORMs de.» (T2-B-E1, T3-B-E3); «no ORMs de S19 solo clases…» (T4-A-E3); «…no.» (T4-B-E3) | Incomplete task contracts; looks unprofessional; may fail automated grading narratives. |
| **I-08** | P0 | Redaction / pedagogy | `S11-T2-A-E3` instruction | «Tarea: Encapsula mutación de score con setter que solo clases, dataclass, composition (S01–S11).» | Task statement is broken Spanish/English mash; learner cannot infer expected behavior from instruction alone (must reverse-engineer starter/solution). |
| **I-09** | P1 | Cognitive load | Theory + I Do + We Do + You Do | `ClientRecord` alternates: `emails` vs `phones`; `full_name` vs `first_name`/`last_name`; with/without `document_id`; sometimes includes `password` | Schema thrashing forces relearning the entity every exercise; hurts long-term schema memory for CP-N1-C. |
| **I-10** | P1 | Progressive disclosure / consistency | Theory T3-A code | `CaseFile.entity: object` then `CaseFile(entity={"entity_id": "E1"})` after teaching dataclasses | Undoes the “named domain types” message; models anti-pattern as demo. |
| **I-11** | P1 | Pedagogical structure (You Do) | `youDo.starterCode` | Starter already implements all four types, invariants, Protocol, repo, and `test_domain()` | You Do becomes “read and run” not “build”; collapses GRR independence phase. |
| **I-12** | P2 | Exercise quality | Several E3 transfer tasks | T1-B-E3, T3-A-E3, T3-B-E3, T4-A-E3, T4-B-E3 are essentially `print` of fixed Spanish lines | Weak transfer of *coding* skill; fine for reflection but overused as 5/24 exercises. |
| **I-13** | P2 | Alignment | Theory T1-B | Mentions reusable `validate()` method; no code demo of `validate()` vs only `__post_init__` | Promise without exemplar; dual-path confusion. |
| **I-14** | P2 | Ethics messaging | `S11-T4-A-E1` | Domain object carries `password` field; lesson is “omit from `to_dict`” | Teaches serialization hygiene but normalizes secrets-in-domain; conflicts with “no secrets / PII care” tone. Prefer `notes_internal` or drop field. |
| **I-15** | P2 | Pass criteria mismatch | `S11-T3-A-E1` | Instruction pass: «`C001 Ana \| design=composition`»; solution stdout is two lines without `\|` | Learner chasing wrong exact string. |
| **I-16** | P2 | Connective tissue | Theory map vs S10 | Mentions CLI from S10 but does not give a 2–3 sentence “from package/CLI to domain types” bridge free of V3 language | Missed chance to link S10 → S11 for the learner journey. |
| **I-17** | P3 | Code presentation | Theory T1-A, I Do T2-B, T3-A | Wrappers `s11_th_1()`, `s11_ido_4()`, `s11_ido_5()` | Inconsistent with bare scripts elsewhere; looks like harness glue, not learner code. |
| **I-18** | P2 | I Do fidelity | `S11-T3-A-DEMO` | Appends `RelationshipEvidence` without canonical-order / range validation taught in theory T3-A | I Do under-models the invariant complexity promised in theory. |
| **I-19** | P2 | Resources focus | `resources.docs` / courses | unittest + pytest notes dominate after retheme; OOP depth is good but “testing” residual framing remains | Learners may still think S11 is a testing unit. |
| **I-20** | P3 | Grammar / style (PE Spanish) | Instructions template | Heavy formula «E1 (guiado) — Concepto: S11-T1-A (OOP y modelo de dominio). Entrada: fixture sintético…» × 24 | Mechanical, high token noise; hides the actual task. Prefer short imperative Spanish. |
| **I-21** | P3 | Orthography | Names | «Ana Perez» vs «Lucía Méndez» (accents inconsistent); «Pere…» ellipsis in pass tokens | Minor PE-Spanish polish. |
| **I-22** | P2 | Cognitive load | Section density | 8 subtopics + 8 demos + 24 exercises + full DDD-lite stack in 19h | Manageable if polished; with thrashing + meta, load exceeds intermediate first-OOP session for many learners. |
| **I-23** | P3 | Accessibility | Theory callouts | Good use of tip/warning/danger; danger for ethics is excellent | Keep; not an issue — noted as positive control. |
| **I-24** | P2 | Comparative quality | vs gold early sections | Same V3 map pattern as S05/S07/S09; S11 jobRelevance is among the most “editor-facing” | Fixer should treat S11 as high priority for user-facing retheme cleanup. |

### Positive nodes (graph memory — keep)
- Ethics danger callout on `RelationshipEvidence` / no `is_family()`.
- Self-check item on mutable default and on `signal_score` semantics.
- You Do requirements list (four types, Decimal rules, canonical pair, pure tests) is excellent *if* starter is slimmed.
- Learning outcomes are measurable and map cleanly to T1–T4.

---

## 4. Meta-Leak Report

Exact (or near-exact) user-facing developer/AI residue found in `s11-testing.ts`:

| # | Location | Exact / representative leaked text |
|---|----------|-------------------------------------|
| M1 | `jobRelevance` | `Esta sección (id \`testing\` conservado) retematiza S11 a **OOP y dominio**` |
| M2 | `jobRelevance` | `pytest/CI se reubican como soporte de calidad alrededor del dominio.` |
| M3 | Theory heading | `De “Testing pytest/CI” a OOP y modelo de dominio (mapa)` |
| M4 | Theory para 1 | `En V3, **S11 no es el path principal de pytest fixtures/coverage/CI** (ese material se reubica como soporte de calidad).` |
| M5 | Theory para 2 | `Id de plataforma \`testing\` se conserva.` |
| M6 | `youDo.context` | `Reemplaza el legado de test suite churn.` |
| M7 | Rubric criterion | `Alineación al gate V3 de la sección` |
| M8 | Resource note | `Testing reubicado; target V3 S11 = dominio OOP.` |
| M9 | Resource note | `curso desplegado; alinear con V3 S11.` |
| M10 | Structural (non-prose but learner-visible) | Platform `id: "testing"` / filename `s11-testing.ts` while title is OOP dominio |

**Not counted as meta-leaks (intentional pedagogy scaffolding):**
- Starter comments `# DEFECT: …` and `# CASO-LIM-011` — exercise defect framing for We Do; acceptable if consistent course-wide.
- Mentions of S12/S19 boundaries as scope control — learner-useful if phrased without “V3 retheme”.

**meta_leak_count (prose/user-facing): 9** (M1–M9); structural id mismatch tracked as I-06/M10 separately.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 Pre-round research anchors (applied)

1. **Gradual Release of Responsibility (I Do / We Do / You Do):** responsibility must shift from modeling → guided practice → independent construction. Over-complete You Do starters reverse that shift.  
2. **Cognitive load (Sweller):** keep *extraneous* load low — stable schemas, no author meta, no truncated prompts; *germane* load should go into invariants and composition.  
3. **Domain modeling teaching:** name types early; fail-closed construction; composition > fragile inheritance; ports (`Protocol`) when a second implementation or test double appears (YAGNI correctly taught in T3-B).  
4. **Dataclass pedagogy:** `default_factory`, `frozen`, `field(compare=False)`, `__post_init__` are the right intermediate stack — matches official dataclasses docs and industry practice.  
5. **Ethics-in-curriculum:** encoding “no automated fraud/family verdict” as tests is excellent product pedagogy for LATAM fintech-adjacent matching systems.

### 5.2 Connective tissue & narrative flow

| Transition | Quality | Notes |
|------------|---------|-------|
| S10 CLI/package → S11 domain | Weak-medium | Exists in T4-A text; drowned by V3 testing map |
| T1 → T2 → T3 → T4 | Strong | Clear skill ladder |
| Theory → matching I Do | Strong | 1:1 demoId/subtopicId |
| I Do → We Do E1–E3 | Medium | Scaffold present; instructions noisy/truncated |
| We Do → You Do | Weak | You Do gives answers away |
| S11 → S12 adapters / S13 dashboard | Strong (forward refs) | Protocol/fakes set up S12 well |

**Narrative problem:** First theory node is a *changelog*, not a *hook*. Learner-facing open should be: “De dicts anónimos a un núcleo de dominio testeable para familiaridad (CP-N1-C).”

### 5.3 I Do / We Do / You Do fidelity

| Phase | Fidelity | Critique |
|-------|----------|----------|
| **I Do** | 7.5/10 | Eight short demos match subtopics; some omit invariants (T3-A) and use harness wrappers. “Why” lines are good but thin on think-aloud. |
| **We Do** | 6/10 | Correct E1→E2→E3 kinds; starter defects are clever; instructions are template-bloated and sometimes truncated/garbled; too many print-reflection E3s. |
| **You Do** | 5/10 | Objectives/requirements excellent; starter ≈ solution; portfolioNote good; rubric mentions “V3”. |
| **Self-check** | 8.5/10 | Aligned, misconception-focused, good distractors. |

### 5.4 Cognitive load & progressive disclosure

**Works well**
- Decimal money only after basic dataclass.
- frozen/eq after properties.
- Protocol after composition.
- Repo/service after ports.

**Breaks progressive disclosure**
- Password field + full service architecture while still stabilizing `ClientRecord`.
- Multiple alternate `ClientRecord` shapes without saying “variante pedagógica simplificada”.
- Opening with anti-syllabus (what S11 is *not*) before what it *is*.

### 5.5 Exercise & exam quality

| Element | Alignment to outcomes | Notes |
|---------|----------------------|-------|
| T1-A E1 mutable default | Excellent | Classic P1 bug |
| T1-A E2 Decimal Transaction | Excellent | Money correctness |
| T1-B E1 currency allowlist | Excellent | Fail-closed |
| T2-B E1 entity identity | Excellent | Core ER lesson |
| T2-B E3 mutable dict key | Excellent | Memorable demo |
| T3-B E3 YAGNI Protocol | Good reflection | Prefer 1 code + 1 reflection max per topic |
| T4-B ethics tests | Excellent | Product ethics as code |
| Self-check (6) | Excellent | Covers defaults, ethics, Protocol, fail-closed, composition |
| You Do | Over-scaffolded | Must slim starter |

### 5.6 Redaction & Peruvian Spanish

- Overall Spanish is clear technical PE-register; anglicisms (`frozen`, `Protocol`, `fail-closed`) are appropriate.
- Truncations and the broken T2-A-E3 string are **redaction failures**, not dialect issues.
- Prefer «Perú», synthetic PE phones (`999…`), `ejemplo.pe` — already good.
- Soften editor voice: replace “retematiza / V3 / id conservado” with learner motivation.

### 5.7 Comparison with external best-in-class materials

| Reference | How S11 compares |
|-----------|------------------|
| **Real Python — Python Classes** | S11 is more applied (domain + ethics); Real Python cleaner progressive basics without schema thrash. |
| **MIT 6.100L objects** | MIT slower on fundamentals; S11 jumps to DDD-lite faster — OK for intermediate if schemas stabilize. |
| **Architecture Patterns with Python (Cosmic Python)** | S11 correctly samples repo/service/Protocol; should not claim full hexagonal architecture. |
| **CS50P OOP week** | CS50P clearer first-class story; S11 richer domain constraints and ethics. |
| **pytest docs** | Rightly deferred to later testing path (S27); residual links/notes should not re-center “testing” as section identity. |

### 5.8 Graph snapshot (selected edges)

```
[LO: model dataclass] --supports--> [T1-A theory/code]
[LO: invariants] --supports--> [T1-B] --practiced_by--> [T1-B-E1]
[LO: no fraud API] --supports--> [T4-B] --examined_by--> [selfCheck Q2/Q6]
[Meta V3 testing] --pollutes--> [jobRelevance, theory#1, resources]
[ClientRecord schema drift] --increases_extraneous_load--> [all We Do T1/T2]
[YouDo starter completeness] --weakens--> [GRR You Do independence]
[Protocol FakeStore] --prepares--> [S12 adapters]  (positive forward edge)
```

---

## 6. Proposed GitHub-style Diffs

> Diffs are **proposals only** — do not apply in this Explorer run. Paths relative to repo root.

### Diff 1 — Strip meta from `jobRelevance` (I-01)

```diff
--- a/src/lib/course/sections/s11-testing.ts
+++ b/src/lib/course/sections/s11-testing.ts
@@
-  jobRelevance:
-    "Un modelo de dominio claro es la base de productos de matching/familiaridad sin inventar veredictos legales. Esta sección (id `testing` conservado) retematiza S11 a **OOP y dominio**: núcleo de **CP-N1-C**. pytest/CI se reubican como soporte de calidad alrededor del dominio.",
+  jobRelevance:
+    "Un modelo de dominio claro es la base de productos de matching y familiaridad sin inventar veredictos legales. Aquí construyes el núcleo OOP de **CP-N1-C**: tipos con invariantes, composición y puertos testeables en Python local — listos para el dashboard de evidencia en S13.",
```

### Diff 2 — Learner-facing theory map (I-02, I-16)

```diff
--- a/src/lib/course/sections/s11-testing.ts
+++ b/src/lib/course/sections/s11-testing.ts
@@
-      heading: "De “Testing pytest/CI” a OOP y modelo de dominio (mapa)",
+      heading: "De dicts anónimos a un modelo de dominio (mapa)",
       paragraphs: [
-        "En V3, **S11 no es el path principal de pytest fixtures/coverage/CI** (ese material se reubica como soporte de calidad). Aquí modelas el **dominio de familiaridad**: `ClientRecord`, `ResolvedEntity`, `Transaction`, `RelationshipEvidence`. Cada tipo nombra un concepto de matching local; el código deja de ser dicts anónimos y pasa a ser un núcleo testeable.",
-        "Ninguna clase emite veredicto de **fraude** ni **parentesco**. Los scores son **datos**, no decisiones legales. Entorno **local-python**. Id de plataforma `testing` se conserva. Si un campo obligatorio falta o viola un invariante, **falla al construir** — no rellenes en silencio. Stack: `dataclass`, properties, composition, `Protocol` (S01–S11); sin frameworks web ni ORMs de S19.",
-        "Orden: **T1 Objetos** → **T2 Encapsulación** → **T3 Diseño** → **T4 Límites** (repos/tests). Caso sintético PE: ids `C00x`/`E0x`, emails `@ejemplo.pe`, montos `Decimal` en PEN/USD. Métrica del gate: cuatro tipos + tests puros + README de límites éticos. Nunca PII real ni APIs `is_fraud`/`is_family`.",
+        "Tras el paquete y la CLI de S10, el código deja de ser **dicts anónimos** y pasa a un **núcleo de dominio** con nombre: `ClientRecord`, `ResolvedEntity`, `Transaction` y `RelationshipEvidence`. Cada tipo nombra un concepto de matching local y admite invariantes y tests puros.",
+        "Ninguna clase emite veredicto de **fraude** ni **parentesco**. Los scores son **datos**, no decisiones legales. Entorno **local-python**. Si un campo obligatorio falta o viola un invariante, **falla al construir** — no rellenes en silencio. Stack: `dataclass`, properties, composition y `Protocol`; sin frameworks web ni ORMs (llegan más adelante).",
+        "Orden: **T1 Objetos** → **T2 Encapsulación** → **T3 Diseño** → **T4 Límites** (repos/tests). Caso sintético PE: ids `C00x`/`E0x`, emails `@ejemplo.pe`, montos `Decimal` en PEN/USD. Gate CP-N1-C: cuatro tipos + tests puros + README de límites éticos. Nunca PII real ni APIs `is_fraud`/`is_family`.",
```

### Diff 3 — You Do context + rubric (I-03, I-04)

```diff
--- a/src/lib/course/sections/s11-testing.ts
+++ b/src/lib/course/sections/s11-testing.ts
@@
-    context:
-      "Implementas el núcleo de **CP-N1-C**: ClientRecord, ResolvedEntity, Transaction y RelationshipEvidence con invariantes, serialización y repo en memoria. **Ninguna clase decide fraude o parentesco.** Reemplaza el legado de test suite churn.",
+    context:
+      "Implementas el núcleo de **CP-N1-C**: ClientRecord, ResolvedEntity, Transaction y RelationshipEvidence con invariantes, serialización y repo en memoria. **Ninguna clase decide fraude o parentesco.**",
@@
-      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
+      { criterion: "Alineación al gate CP-N1-C y a los objetivos de la sección", weight: "25%" },
```

### Diff 4 — Resource notes (I-05, I-19)

```diff
--- a/src/lib/course/sections/s11-testing.ts
+++ b/src/lib/course/sections/s11-testing.ts
@@
-        note: "Testing reubicado; target V3 S11 = dominio OOP.",
+        note: "Referencia opcional de tests; el foco de S11 es el modelo de dominio.",
@@
-        note: "curso desplegado; alinear con V3 S11.",
+        note: "Edición pública del curso PyArcana.",
```

### Diff 5 — Fix truncated / garbled We Do instructions (I-07, I-08, I-20)

```diff
--- a/src/lib/course/sections/s11-testing.ts
+++ b/src/lib/course/sections/s11-testing.ts
@@ S11-T1-A-E2
-          "E2 (independiente) — Concepto: S11-T1-A (OOP y modelo de dominio). Entrada: fixture sintético del starter (`CASO`/ids C00x) en OOP de dominio. Tarea: Define Transaction con tx_id, client_id, amount: Decimal y currency: str obligatorios; usa Decimal desde texto y PEN en el caso visible. Salida/pass: primeros tokens de `Transaction(tx_id='T1', client_id='C001', amount=D…` según solution. Conserva el contrato del.",
+          "E2 (independiente) — Define `Transaction` con `tx_id`, `client_id`, `amount: Decimal` y `currency: str` obligatorios. Usa `Decimal` desde texto y `PEN` en el caso visible. Salida esperada: repr con `amount=Decimal('150.50')` y `currency='PEN'`. Conserva asserts y datos del starter; solo stdlib (sin web/ORM).",
@@ S11-T1-B-E1
-          "… no frameworks web, no ORMs de S19;.",
+          "… sin frameworks web ni ORMs; solo clases/dataclass del stack S01–S11.",
@@ S11-T2-A-E3
-          "… Tarea: Encapsula mutación de score con setter que solo clases, dataclass, composition (S01–S11).",
+          "E3 (transferencia) — Encapsula un `score` 0..1 con `@property` + setter: rechaza valores fuera de rango y no finitos (`nan`/`inf`) con `ValueError('score fuera de rango')`. Muestra ok=0.4 y rechazos. Solo stdlib.",
@@ S11-T2-B-E1 / T3-B-E3 / T4-B-E3
-          "… no ORMs de."
-          "… no."
+          "… sin frameworks web ni ORMs; conserva el contrato del starter."
@@ S11-T4-A-E3
-          "… no ORMs de S19 solo clases, dataclass, composition (S01–S11).",
+          "… sin frameworks web ni ORMs; solo clases, dataclass y composition (S01–S11).",
```

*(Fixer should rewrite **all 24** instructions to short imperative Spanish, not only truncated ones.)*

### Diff 6 — Stabilize `ClientRecord` schema in demos (I-09)

```diff
# Policy for Fixer (logical group, multi-hunk):
# Canonical educational shape for S11 (unless exercise *deliberately* strips fields):
#   ClientRecord(client_id, document_id, full_name, emails: list[str] = field(default_factory=list))
# - Prefer properties over alternate first_name/last_name variants, OR introduce PersonName value object once.
# - Use phones only in a single labeled exercise ("variante: canal de contacto") if needed.
# - Never put password on ClientRecord; use a separate AuthSecret DTO in T4 if teaching redaction.
```

Example theory T2-A properties on canonical type:

```diff
 @dataclass
 class ClientRecord:
-    first_name: str
-    last_name: str
-    email: str
+    client_id: str
+    document_id: str
+    full_name: str
+    email: str

     @property
     def display_name(self) -> str:
-        return f"{self.first_name} {self.last_name}"
+        return self.full_name
```

### Diff 7 — Fix composition demo typing (I-10, I-18)

```diff
--- a/src/lib/course/sections/s11-testing.ts
+++ b/src/lib/course/sections/s11-testing.ts
@@ composition.py (theory T3-A)
 @dataclass
 class CaseFile:
-    entity: object
+    entity: ResolvedEntity
     evidences: list[RelationshipEvidence] = field(default_factory=list)

     def add(self, ev: RelationshipEvidence) -> None:
         self.evidences.append(ev)

-cf = CaseFile(entity={"entity_id": "E1"})
+@dataclass(frozen=True)
+class ResolvedEntity:
+    entity_id: str
+
+cf = CaseFile(entity=ResolvedEntity("E1"))
 cf.add(RelationshipEvidence("E1", "E2", 0.42))
```

Also align I Do T3-A to call `add` with validated `RelationshipEvidence` (canonical ids + score range), not raw append of unvalidated pairs if theory claims validation.

### Diff 8 — Slim You Do starter (I-11)

```diff
--- a/src/lib/course/sections/s11-testing.ts
+++ b/src/lib/course/sections/s11-testing.ts
@@ youDo.starterCode
-# Provide full implementations of all four types + repo + tests...
+# Provide:
+# - empty class shells with TODO fields
+# - failing tests that describe invariants
+# - one incomplete Fake repo
+# Student must implement __post_init__, frozen/compare=False, Protocol, service register
```

Illustrative skeleton (replace current full body):

```python
"""CP-N1-C — completa el dominio. Sin is_fraud / is_related_family. Datos sintéticos."""
from __future__ import annotations
from dataclasses import dataclass, field
from decimal import Decimal
from typing import Protocol

# TODO: ClientRecord + invariantes + to_dict
# TODO: ResolvedEntity frozen (eq por entity_id)
# TODO: Transaction Decimal PEN/USD
# TODO: RelationshipEvidence par canónico + score [0,1]
# TODO: ClientRepository Protocol + InMemoryClientRepository
# TODO: test_domain() debe imprimir tests_pass
```

### Diff 9 — T3-A-E1 pass string (I-15)

```diff
-          "… Salida/pass: `C001 Ana | design=composition`. …",
+          "… Salida/pass: dos líneas — `C001 Ana` y `design=composition`. …",
```

### Diff 10 — Remove harness wrappers (I-17)

```diff
-def s11_th_1():
-    from dataclasses import dataclass, field
-    ...
-s11_th_1()
+from dataclasses import dataclass, field
+...
```

Same for `s11_ido_4` / `s11_ido_5`.

### Diff 11 — Password exercise reframe (I-14)

```diff
-    password: str = ""
+    # Prefer not modeling secrets on domain ClientRecord:
+    internal_note: str = ""  # no serializar en to_dict de dashboard
```

Or keep password only with callout: «Anti-ejemplo: no almacenes secretos en el agregado de familiaridad.»

### Diff 12 — Platform id long-term (I-06) — product decision

```diff
# Option A (content-only, low risk): keep id `testing` but never mention it in prose.
# Option B (breaking): rename id to `oop-domain` / `domain-model` and update router + SECTION_MAP + progress keys with migration.
# Explorer recommendation: Option A in Fixer content pass; Option B as separate harness ticket.
```

---

## 7. Recommended Priority Order for Fixing

| Priority | Issue IDs | Action | Effort |
|----------|-----------|--------|--------|
| **1 — P0** | I-07, I-08 | Repair all truncated/garbled We Do instructions; shorten template | S |
| **2 — P1** | I-01, I-02, I-03, I-04, I-05 | Purge V3/retheme/testing meta from user-facing strings | S |
| **3 — P1** | I-11 | Slim You Do starter to shells + failing tests | M |
| **4 — P1** | I-09, I-10 | Stabilize ClientRecord/CaseFile shapes across theory/I Do/You Do | M |
| **5 — P2** | I-15, I-18, I-13, I-14 | Align pass criteria, I Do invariants, validate() demo, secrets framing | S–M |
| **6 — P2** | I-12, I-20 | Convert 2–3 pure-print E3s into code transfer; compress instruction boilerplate | M |
| **7 — P2** | I-16, I-19 | S10→S11 bridge paragraph; de-center testing resources | S |
| **8 — P3** | I-17, I-21 | Remove s11_* wrappers; accent/name polish | S |
| **9 — Product** | I-06 | Decide id rename vs silent keep | Separate ticket |

**Do not expand scope** into rewriting S27 pytest content here; only stop S11 from advertising itself as the testing section.

---

## 8. Graph Memory Update Notes

For shared curriculum context / later Fixer & Explorer runs:

```yaml
section: 11
id: testing
file: src/lib/course/sections/s11-testing.ts
title: OOP y modelo de dominio
score_1_to_10: 6.4
status: explorer_complete

nodes_keep:
  - ethics_no_fraud_no_family_verdict
  - decimal_pen_usd_invariants
  - frozen_entity_id_identity
  - protocol_port_for_fakes
  - self_check_alignment
  - t1_t4_skill_ladder
  - cp_n1_c_gate_requirements_list

nodes_fix:
  - meta_v3_retheme_prose
  - jobRelevance_id_testing_mention
  - theory_heading_testing_pytest
  - youdo_legacy_test_suite_churn
  - rubric_gate_v3_wording
  - resource_notes_target_v3
  - truncated_we_do_instructions
  - broken_t2a_e3_instruction
  - clientrecord_schema_thrash
  - casefile_entity_object_dict
  - youdo_starter_overcomplete
  - harness_wrapper_functions_s11_*

edges_positive:
  - S10_cli_package -> S11_domain_core
  - S11_protocol_fakes -> S12_sql_http_adapters
  - S11_domain_types -> S13_evidence_dashboard

edges_toxic:
  - platform_id_testing --mismatches--> title_oop_domain
  - meta_changelog_open --blocks--> learner_motivation

fixer_hints:
  - strip_all_V3_and_retheme_language_user_facing
  - rewrite_we_do_instructions_short_es
  - slim_you_do_starter
  - canonicalize_ClientRecord_fields
  - do_not_rename_platform_id_without_migration_ticket

comparative_note: >
  Domain ethics and T1–T4 ladder are above average vs public OOP intros;
  redaction hygiene below target for a post-retheme section.
```

---

## Explorer completeness checklist

| Required dimension | Covered |
|--------------------|---------|
| 1. Meta-text / developer leakage | Yes (§4, I-01…I-06) |
| 2. Grammar & redaction (PE Spanish) | Yes (§5.6, I-07/I-08/I-20/I-21) |
| 3. Connective tissue & narrative flow | Yes (§5.2) |
| 4. Pedagogical structure I/We/You Do | Yes (§5.3) |
| 5. Cognitive load & progressive disclosure | Yes (§5.4) |
| 6. Exercise & exam quality | Yes (§5.5) |
| 7. Roadmap consistency | Yes (S10/S12/S13, id mismatch) |
| 8. External best-in-class comparison | Yes (§5.7) |
| 9. Other (ethics, accessibility, resources) | Yes |

**Issue count (registry rows excluding pure positives): 23** (I-01…I-22 + I-24; I-23 positive).  
**Actionable issue_count for meta JSON: 22** (I-23 excluded as non-issue).  
**Meta-leak count (prose): 9.**

---

This is the complete Explorer report for Section 11. Ready for the Fixer prompt.
