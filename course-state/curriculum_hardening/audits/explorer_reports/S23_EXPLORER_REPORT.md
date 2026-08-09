# S23 Explorer Report — Browser RPA con Playwright

**Auditor role:** Curriculum Auditor / Pedagogical Analyst / Technical Editor  
**Method:** Stanford STORM multi-pass + Graph Engineering + Loop Engineering  
**Sources:** Live curriculum card at https://pillb.github.io/pyarcana/ (Sección 23 · Playwright RPA); full section source `src/lib/course/sections/s23-computer-vision.ts`; comparative baseline S01 + S22; external Playwright pedagogy/docs (official best practices, Microsoft Learn, locator guides).  
**Constraint honored:** Analysis only — no product/curriculum TS edits applied.

---

## 1. Section Identification & Scope

| Field | Value |
|--------|--------|
| Index | **23** |
| Platform section id (hash) | `computer-vision` |
| Live URL | https://pillb.github.io/pyarcana/#computer-vision |
| Repo source | `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s23-computer-vision.ts` |
| Title | Browser RPA con Playwright |
| shortTitle (UI card) | Playwright RPA |
| Tagline | robot contra sitio de prueba controlado, con trace de éxito/falla, download verificado y reanudación idempotente |
| Level / hours / phase | Competente · 19 h · phase 1 |
| Icon | `Camera` (legacy CV naming) |
| Capstone thread | Web adapter of **CP-N2-C** (between S22 email/approval and S24 OCR) |

**In-scope content units audited**

- Metadata: `jobRelevance`, 8 `learningOutcomes`
- Theory: intro + **8 subtopics** (S23-T1-A/B … S23-T4-A/B) with paragraphs, code, callouts
- **I Do:** intro + 8 demos (one per subtopic)
- **We Do:** intro claims 24 exercises; **24 steps** confirmed (guided / independent / transfer × 8)
- **You Do:** portfolio project + rubric + starter
- **Self-check:** 5 MCQs
- **Resources:** docs / books / courses

**Out of scope this run:** fixing diffs; other sections except comparative notes; runtime multiarchivo bundles if they live outside this TS (referenced as `fixture_server.py` + `robot.py` but **not embedded** in the section file).

**Live-site note:** The SPA hash route does not server-render full lesson body to static fetchers; curriculum card for Sección 23 matches source shortTitle/tagline/hours. All pedagogical depth below is grounded in the shipped TS source (source of truth for the rendered lesson).

---

## 2. Executive Summary of Quality

### Score: **6.2 / 10**

### Verdict

Section 23 has a **strong conceptual spine** for responsible browser RPA: user-facing locators, auto-wait vs sleep, form/download integrity, Page Objects, failure evidence, selective retries, **API/export-first**, and ethical **CAPTCHA/ToS/handoff**. That spine aligns with official Playwright best practices and with the CP-N2-C arc (S22 → S23 → S24 → S26).

However, the **learner-facing delivery under-delivers the title**. Almost all graded and demo code is **dict/session simulation**, not Playwright Python API. The intro promises multiarchivo real API (`fixture_server.py` + `robot.py`) but the section body never shows a single `from playwright.sync_api import …` snippet. Several **I Do `code` vs `output` pairs are factually wrong**, which breaks trust in “I Do” as the model solution. Meta-text about **legacy id / V3 path / auditoría de snippets / gate V3 / DEFECT author labels** leaks into student-visible fields. Compared with early gold-standard sections (S01) and even the better-scaffolded neighbor S22 (which opens with a **Diccionario de la sección**), S23 is **telegraphic, high-jargon, low connective tissue**, with boilerplate hints/feedback that do not teach.

**Ship readiness for learners:** usable as a policy/contracts primer; **not yet** a credible 19 h “Browser RPA con Playwright” lesson without fixing demo outputs, removing meta-leaks, adding progressive real-API disclosure, and deepening We Do beyond one-liner if/else puzzles.

---

## 3. Detailed Issue Registry

Severity: **P0** blocking trust/correctness · **P1** high pedagogical impact · **P2** medium polish · **P3** nice-to-have.

| ID | Severity | Dimension | Evidence (quote / location) | Pedagogical impact |
|----|----------|-----------|-----------------------------|--------------------|
| **I-01** | P0 | Demo correctness | I Do `S23-T1-A-DEMO`: code prints `by_role(...)["name"]` then flags; `output` is `{'role': 'button', 'name': 'Enviar'}` | Student who runs the demo cannot reconcile UI “expected output” with Python reality → undermines I Do authority |
| **I-02** | P0 | Demo correctness | I Do `S23-T2-A-DEMO`: prints `filled`, `sha`, `ok`; `output` is `filled {'q': 'enero'}\nsha 3cdfe594e4 n 14` (extra `n 14`; sha length claim inconsistent with `[:8]`) | Same trust break on download-integrity story (core of tagline) |
| **I-03** | P0 | Demo correctness | I Do `S23-T3-B-DEMO`: code only `print(retry(["timeout", "ok"]))` → `2`; `output` is `2 handoff` | Teaches wrong multi-case behavior for retries/captcha |
| **I-04** | P1 | Demo correctness (systematic) | Multiple I Do demos truncate `output` vs full prints: T1-B (`visible 3` only), T2-B (`auth True` only), T3-A (dict only), T4-A (`export` only), T4-B (`human_handoff` only) while code also prints flags/`ok True` | Inconsistent contract with We Do (“salida debe coincidir exactamente”); models sloppy evidence |
| **I-05** | P1 | Meta-leak | `jobRelevance`: *“Id legacy \`computer-vision\` se conserva; el path V3 es Browser RPA/Playwright, no visión por CNN.”* | Student-facing product copy exposes curriculum migration internals |
| **I-06** | P1 | Meta-leak | Intro callout *“Runtime declarado”*: *“La **auditoría de snippets** puede omitir el browser externo…”* | Author/CI auditor voice, not instructor-to-learner |
| **I-07** | P1 | Meta-leak | You Do `starterCode`: `# DEFECT labels cover locator/hash/retry/captcha contracts` | Pure developer note; no learning affordance |
| **I-08** | P1 | Meta-leak / rubric | You Do rubric criterion: *“Alineación al **gate V3** de la sección”* | Internal versioning jargon in portfolio grading language |
| **I-09** | P1 | Title ↔ content gap | Learning outcomes + title say Playwright RPA; graded path never imports Playwright; only prose mentions real API | Expectation violation; transfer to real jobs weaker than claimed |
| **I-10** | P1 | Phantom multiarchivo | Theory: *“ejemplos multiarchivo … (\`fixture_server.py\` + \`robot.py\`)"* but **no multi-file code block** in section TS | Broken progressive disclosure: promised real path not reachable from lesson |
| **I-11** | P1 | Starter↔solution API drift | We Do `S23-T2-B-E1`: starter `LoginPage.submit(self, user, password)` + `self.auth`; solution `submit(self, ctx, password)` + `ctx['auth']` | Guided repair fails: student cannot “fix defect” by minimal edit; must rewrite API |
| **I-12** | P1 | Cognitive load / no glossary | Intro dumps CP-N2-C, progressive disclosure, CI, multiarchivo, Chromium, locators, traces in 3 dense paragraphs; **no Diccionario** (unlike S22) | High intrinsic + extraneous load at section open |
| **I-13** | P1 | Exercise depth vs level | Many We Do items are single-branch if/print (e.g. T1-B-E3 title assert, T2-A-E1 assign one field, T4-A-E1 ternary) for **Competente · 19 h** | Under-challenge; weak mastery of stated outcomes |
| **I-14** | P1 | Boilerplate pedagogy | All 24 exercises share same `hints[]` (“contrato I/O…”, “compara output…”, “datos sintéticos only”) and same `feedback`: *“Compara tu salida con la solución.”* | No adaptive scaffolding; We Do collapses to output-matching |
| **I-15** | P2 | Redaction / repetition | Exact clause *“En PyArcana trabajamos con fixtures sintéticos de operaciones (Lima, America/Lima) y nunca PII real de clientes.”* ×3 (T3-A twice in consecutive paras + T4-A) | Feels auto-generated; dilutes PE localization value |
| **I-16** | P2 | Legacy UX signals | `id: "computer-vision"`, `icon: "Camera"`, filename `s23-computer-vision.ts` | URL/icon contradict title; confuses navigation and portfolio language |
| **I-17** | P2 | Tagline overclaim | Tagline promises *“reanudación idempotente”*; theory covers retries/recovery but **idempotent resume of multi-step run** is thin vs promise | Outcome misalignment |
| **I-18** | P2 | Grammar / style | Heading *“auto-waiting y assertions”* (sentence case); mixed density of Spanglish without first definition of terms (trace zip, storage_state, flaky) | Uneven redaction vs gold early sections |
| **I-19** | P2 | Connective tissue S22→S23 | S22 ends CP-N2-C email; S23 jumps to web adapter without a short “handoff from approval draft → need report download” narrative beat | Arc feels modular, not story-continuous |
| **I-20** | P2 | DEFECT author voice in starters | 24× `# DEFECT: …` comments in student starter (intentional broken labs) | Acceptable if framed as “código con defecto a reparar”; currently unlabeled as pedagogy, reads as author markup |
| **I-21** | P2 | Self-check coverage | 5 questions cover locators, captcha, API-first, retry, evidence — good themes; no item on Page Objects, storage_state, or download hash | Partial active recall vs LO list |
| **I-22** | P3 | External quality gap | Official Playwright teaching (role locators, web-first assertions, tracing, auth storage_state) is **named** in resources but not **shown** as runnable Python API samples | Learners must leave the course to see the real tool |
| **I-23** | P3 | You Do under-specified | You Do asks traces success+forced failure, hash download, captcha stop; starter is 3 lines simulation | Portfolio bar high; launchpad too low |
| **I-24** | P3 | Accessibility callout strength | Tip *“Accesibilidad = estabilidad”* is excellent but not reinforced in self-check or You Do rubric explicitly | Missed chance to lock a11y↔locator mental model |

---

## 4. Meta-Leak Report

Exact leaked / developer-facing text (student-visible unless noted):

| # | Location | Exact text | Classification |
|---|----------|------------|----------------|
| M1 | `jobRelevance` | `Id legacy \`computer-vision\` se conserva; el path V3 es Browser RPA/Playwright, no visión por CNN.` | **Hard meta-leak** (legacy id + V3 path + anti-CNN note) |
| M2 | Theory intro callout `Runtime declarado` | `La auditoría de snippets puede omitir el browser externo; el bundle multiarchivo y sus tests contractuales son la evidencia reproducible.` | **Hard meta-leak** (auditor pipeline language) |
| M3 | You Do `starterCode` | `# DEFECT labels cover locator/hash/retry/captcha contracts` | **Hard meta-leak** (author coverage note) |
| M4 | You Do `rubric[0].criterion` | `Alineación al gate V3 de la sección` | **Hard meta-leak** (internal gate naming) |
| M5 | We Do starters (systemic) | Pattern `# DEFECT: …` on every exercise (e.g. `# DEFECT: busca role=button en vez de link`) | **Soft meta** if reframed; currently author markup without student frame |
| M6 | Platform id / icon (UX) | id `computer-vision`, icon `Camera` | **Structural legacy leak** (not prose, but user-facing) |

**Not counted as meta-leak (acceptable instructional):** references to CP-N2-C, CASO-LIM-023, progressive disclosure explanation of dict vs real browser (content design for learners), official Playwright resource links.

**meta_leak_count (hard leaks M1–M4 + structural M6 counted as 1 platform leak):** **5** hard/structural; **+1 systemic soft pattern (M5)**.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 Pre-round pedagogy (research-informed criteria)

Relevant best practices applied as audit lenses:

1. **Gradual release (I/We/You):** model full procedure → guided co-construction → independent performance with evidence.
2. **Progressive disclosure / cognitive load:** introduce Playwright surface area in layers; keep germane load (locators, waits) high and extraneous load (legacy notes, auditor jargon) near zero.
3. **Worked-example effect:** I Do outputs must be **executable truth**; mismatches destroy example quality.
4. **Playwright domain standards:** prefer role/label locators; auto-wait over sleep; web-first assertions; traces on failure; isolate auth via storage_state; Page Object for selector churn; never bypass CAPTCHA/ToS; prefer API over UI when available.
5. **Spanish (es-PE) technical writing:** clear connectors, define terms once, avoid telegraphic machine tone and duplicated boilerplate.

### 5.2 I Do / We Do / You Do fidelity

| Phase | Fidelity | Notes |
|-------|----------|-------|
| **I Do** | **Weak–medium** | 8 demos map cleanly to 8 subtopics (`demoId` ↔ `subtopicId`) — good graph coverage. But demos are **micro-stubs**, not narrated full flows; several **output mismatches (I-01–I-04)**; almost no real Playwright API modeling. |
| **We Do** | **Medium structure, low depth** | Excellent **quantity/topology**: 3×(guided→independent→transfer) per subtopic. Weak **quality**: identical hints/feedback; many trivial print contracts; E1 starter/solution API mismatch (I-11); “transfer” often same pattern as guided. |
| **You Do** | **Medium goals, weak launch** | Objectives match section story (locators, hash, retry, evidence). Starter + meta DEFECT comment insufficient; rubric pollutes with “gate V3”. |
| **Self-check** | **Good theme sampling** | 5 solid conceptual items; explanations short but correct; gaps on PO/download. |

### 5.3 Cognitive load & progressive disclosure

**What works**

- Explicit topic order T1→T4 (navigation → flows → diagnosis → limits).
- Simulation-first for CI reproducibility is a valid engineering constraint **if** honestly labeled and paired with optional real-API path.

**What fails**

- Intro paragraph 1 is a **load spike** (adapter name, full Playwright noun pile, local server, no banks/SUNAT, progressive disclosure, CI, multiarchivo).
- No dictionary block (S22 gold pattern for the same capstone thread).
- “Real Playwright later” is **asserted twice** but never **shown** (I-10).
- Repeated PII/Lima boilerplate (I-15) adds words without new schema.

### 5.4 Connective tissue & narrative flow

- **Internal T1–T4:** logical and professional (locator stability → waits → forms/auth → evidence → retries → API-first → ethics). One of the section’s strengths.
- **Cross-section:** CP-N2-C naming links S22/S23/S24/S26, but the **story beat** “approved email path needs a verified report from a portal” is missing at open (I-19).
- **Sentence-level flow:** many paragraphs are bullet-like with `→` chains; less “teaching voice” than S01.

### 5.5 Grammar & redaction (Peruvian Spanish)

- Overall Spanish is **serviceable technical es**, not broken.
- Issues: telegraphic style; inconsistent heading capitalization; anglicisms without first gloss (`flaky`, `storage_state`, `trace` zip) for mixed audience; triple-paste privacy sentence; developer English fragments in meta-leaks.
- No major orthography scandals found in theory body; quality problem is **tone/clarity**, not pure grammar.

### 5.6 Exercise & exam alignment

| Outcome (LO) | Theory | I Do | We Do | Self-check | You Do |
|--------------|--------|------|-------|------------|--------|
| Locators usuario | Strong (T1-A) | Broken output | Strong triad | Yes | Yes |
| Auto-wait / assertions | Strong (T1-B) | Truncated output | Strong triad | Partial | Indirect |
| Forms / upload / download | Medium (T2-A) | Broken output | Weak depth | No | Yes (hash) |
| Auth / Page Objects | Medium (T2-B) | OK | E1 API drift | No | Yes |
| Trace / screenshot / logs | Strong (T3-A) | Truncated | Strong triad | Yes | Yes |
| Retries / recovery | Strong (T3-B) | Wrong output | Strong triad | Yes | Yes |
| API/export first | Strong (T4-A) | OK theme | Strong triad | Yes | Indirect |
| ToS / CAPTCHA / handoff | Strong (T4-B) | OK | Strong triad | Yes | Yes |
| **Idempotent resume** (tagline) | Thin | No | Thin | No | Requirement only |

**Ethical RPA stance is best-in-class for the course family** (CAPTCHA not retried; ToS aborts; API first) — preserve this under any rewrite.

### 5.7 Consistency with roadmap

- Card shortTitle **Playwright RPA** matches curriculum list on live site.
- Capstone CP-N2-C web adapter is correctly positioned between email (S22) and OCR (S24).
- **Legacy id/icon/filename** still encode “computer vision” — roadmap V3 rename incomplete at platform layer (I-16, M1).
- Pattern of “Id legacy … se conserva; path V3 …” also appears in neighboring sections (S22/S24/S26) — **systemic curriculum residue**, still unacceptable in student `jobRelevance`.

### 5.8 Comparison with external best-in-class

| External standard | S23 status |
|-------------------|------------|
| Playwright docs: role locators first | Concepts ✓ · Real API examples ✗ |
| Auto-waiting / web-first assertions | Concepts ✓ · `expect(...)` samples ✗ |
| Trace viewer for failures | Named + simulated paths ✓ · Real trace workflow ✗ |
| Auth via storage_state | Concept + dict model ✓ |
| Page Object Model | Concept ✓ · Fragile E1 exercise |
| API-first / seed via API | Policy hierarchy excellent ✓ |
| Microsoft Learn “first e2e test” style | Missing project-shaped first green test |
| RPA ethics (ToS/CAPTCHA) | **Stronger than many bootcamps** ✓ |

### 5.9 Graph memory (nodes & edges)

**Strong nodes:** API-first policy; handoff ethics; role locator preference; failure evidence package; retry policy set.

**Broken edges:**

- `title:Playwright` —x→ `code:playwright.sync_api` (missing)
- `iDo.code` —x→ `iDo.output` (several demos)
- `weDo.starter` —x→ `weDo.solution` (T2-B-E1 API)
- `intro:multiarchivo` —x→ `embedded:fixture_server|robot` (missing)
- `tagline:idempotent` —x→ `theory:resume_contract` (weak)
- `id:computer-vision` —x→ `title:Browser RPA` (legacy)

**Quality edges to preserve:** T4 ethics → You Do requirements; T1 a11y tip → locator strategy; resources → official Playwright docs.

---

## 6. Proposed GitHub-style Diffs

> Diffs are **proposals only** (Explorer does not apply). Paths relative to repo root. Hunks illustrative; Fixer should re-read current file before patch.

### Diff A — Remove hard meta-leaks from `jobRelevance` (I-05 / M1)

```diff
--- a/src/lib/course/sections/s23-computer-vision.ts
+++ b/src/lib/course/sections/s23-computer-vision.ts
@@
   jobRelevance:
-    "El **adaptador web** de CP-N2-C automatiza un sitio local controlado con la mentalidad Playwright: locators de usuario, traces, retries y **API primero**. No bypassea CAPTCHA ni términos; el handoff humano es parte del contrato. Id legacy `computer-vision` se conserva; el path V3 es Browser RPA/Playwright, no visión por CNN.",
+    "El **adaptador web** de CP-N2-C automatiza un sitio local controlado con la mentalidad Playwright: locators de usuario, traces, retries y **API primero**. No bypassea CAPTCHA ni términos; el handoff humano es parte del contrato. En operaciones (p. ej. backoffice sintético en Lima) el valor es el dato verificado y auditable, no “haber automatizado el click”.",
```

### Diff B — Replace auditor callout with learner-facing runtime note (I-06 / M2)

```diff
--- a/src/lib/course/sections/s23-computer-vision.ts
+++ b/src/lib/course/sections/s23-computer-vision.ts
@@
       callout: {
         type: "info",
-        title: "Runtime declarado",
+        title: "Dos modos de práctica",
         content:
-          "La auditoría de snippets puede omitir el browser externo; el bundle multiarchivo y sus tests contractuales son la evidencia reproducible.",
+          "En los ejercicios calificados modelamos DOM y sesión con dicts (reproducible sin Chromium). Cuando instales Playwright en local, el mismo contrato aplica a `page.get_by_role`, downloads y traces reales.",
       },
```

### Diff C — Fix I Do T1-A demo output (I-01)

```diff
--- a/src/lib/course/sections/s23-computer-vision.ts
+++ b/src/lib/course/sections/s23-computer-vision.ts
@@
         code: {
           language: 'python',
           title: "demo.py",
           code: `nodes = [{"role": "button", "name": "Enviar"}, {"role": "button", "name": "Cancelar"}]
 
 def by_role(role, name):
     return next(n for n in nodes if n["role"] == role and n["name"] == name)
 
 print(by_role("button", "Enviar")["name"])
 print("locators", "role_first")
 print("ok", True)
 `,
-          output: `{'role': 'button', 'name': 'Enviar'}`,
+          output: `Enviar
+locators role_first
+ok True`,
         },
```

### Diff D — Fix I Do T2-A demo output (I-02)

```diff
--- a/src/lib/course/sections/s23-computer-vision.ts
+++ b/src/lib/course/sections/s23-computer-vision.ts
@@
 print("filled", form)
 print("sha", sha)
 print("ok", True)
 `,
-          output: `filled {'q': 'enero'}
-sha 3cdfe594e4 n 14`,
+          output: `filled {'q': 'enero'}
+sha 3cdfe594
+ok True`,
         },
```

Note: Fixer must recompute `hashlib.sha256(b"synthetic-xlsx").hexdigest()[:8]` at apply time and paste the exact 8 hex chars (do not trust truncated legacy string).

### Diff E — Fix I Do T3-B demo to match intended pedagogy (I-03)

```diff
--- a/src/lib/course/sections/s23-computer-vision.ts
+++ b/src/lib/course/sections/s23-computer-vision.ts
@@
           code: `def retry(kinds):
     for i, k in enumerate(kinds, 1):
         if k == "ok":
             return i
         if k == "captcha":
             return "human_handoff"
     return "exhausted"
 
-print(retry(["timeout", "ok"]))
+print(retry(["timeout", "ok"]))
+print(retry(["captcha"]))
 print("retry_ok", True)
 print("ok", True)
 `,
-          output: `2 handoff`,
+          output: `2
+human_handoff
+retry_ok True
+ok True`,
         },
```

### Diff F — Normalize remaining I Do outputs to full stdout (I-04)

Apply the same rule to T1-B, T2-B, T3-A, T4-A, T4-B: **`output` must equal concatenated print lines** (including `ok True` flags if present in code). Example for T1-B:

```diff
-          output: `visible 3`,
+          output: `visible 3
+auto_wait True
+ok True`,
```

### Diff G — Align We Do T2-B-E1 starter with solution API (I-11)

```diff
--- a/src/lib/course/sections/s23-computer-vision.ts
+++ b/src/lib/course/sections/s23-computer-vision.ts
@@
         starterCode: {
           language: 'python',
           title: "exercise.py",
           code: `# CASO-LIM-023 · Page Object login sandbox
 class LoginPage:
-    def __init__(self):
-        self.auth = False
-    def submit(self, user, password):
-        # DEFECT: no setea auth
-        pass
-
-p = LoginPage()
-p.submit('ana', 'sandbox')
-print(p.auth)
-print('ok', True)
+    def submit(self, ctx, password):
+        # DEFECT: no setea auth en ctx
+        pass
+
+ctx = {}
+LoginPage().submit(ctx, 'sandbox')
+print(ctx.get('auth'))
 `,
         },
```

(Keep solution as-is; student only fills the body of `submit`.)

### Diff H — You Do meta cleanup (I-07, I-08 / M3, M4)

```diff
--- a/src/lib/course/sections/s23-computer-vision.ts
+++ b/src/lib/course/sections/s23-computer-vision.ts
@@
     starterCode: `# Simulación de robot — mapeable a Playwright
 DOM = [{"role": "button", "name": "Exportar"}]
-# DEFECT labels cover locator/hash/retry/captcha contracts
+# TODO del estudiante: locator por rol, hash de download, retry selectivo y handoff en captcha
 print("web adapter")
 `,
@@
     rubric: [
-      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
+      { criterion: "Cumple objetivos del adaptador web (locators, download verificado, evidencia, handoff)", weight: "25%" },
       { criterion: "Correctitud técnica en entorno declarado", weight: "20%" },
```

### Diff I — Intro progressive disclosure + S22 connective tissue (I-10, I-12, I-19)

```diff
--- a/src/lib/course/sections/s23-computer-vision.ts
+++ b/src/lib/course/sections/s23-computer-vision.ts
@@
       heading: "Browser RPA contra una fixture local controlada",
       paragraphs: [
-        "Construyes el **web adapter** de CP-N2-C con la mentalidad Playwright: browser/context/page/locator/expect/download/tracing contra un **servidor HTTP local** de práctica (HTML/CSV sintéticos), sin red externa ni credenciales reales de bancos o SUNAT. Progressive disclosure: en CI los retos modelan DOM/sesión con dicts; el multiarchivo del curso usa la API real cuando el runtime está instalado.",
-        "Los ejemplos multiarchivo del curso (`fixture_server.py` + `robot.py`) usan la API real cuando el runtime está instalado; los ejercicios graded pueden modelar DOM/sesión con dicts para ser reproducibles en CI sin Chromium. En ambos casos el contrato es el mismo: locators de usuario, traces de falla y downloads verificados.",
-        "Orden: **T1 Navegación** (locators, auto-wait) → **T2 Flujos** (forms, auth, Page Objects) → **T3 Diagnóstico** (trace, retries) → **T4 Límites** (API-first, ToS/CAPTCHA/handoff). RPA es último recurso tras API/export; nunca bypass de CAPTCHA ni términos.",
+        "**Diccionario de la sección** (léelo antes de T1). **Locator:** consulta estable de un control (preferir rol y nombre visibles). **Auto-wait:** esperar a que el control sea usable, no `sleep` fijo. **Page Object:** clase que encapsula selectores y acciones de una pantalla. **Trace:** paquete de evidencia de la corrida (pasos, red, DOM) para diagnosticar fallas. **storage_state:** cookies/localStorage reutilizables entre corridas. **API-first:** preferir endpoint o export al click UI. **Handoff humano:** detener el robot ante CAPTCHA/ToS y pasar evidencia a una persona.",
+        "En S22 dejaste el hilo de **CP-N2-C** en borrador de correo con aprobación humana. Aquí construyes el **adaptador web**: obtener un reporte desde un **sitio de práctica local** (HTML/CSV sintéticos), sin red externa ni credenciales reales de bancos o SUNAT. El dato debe salir con **trace** y, si hubo download, **integridad** verificada.",
+        "Practicamos primero el **contrato** con DOM/sesión en dicts (reproducible en cualquier máquina). La misma lógica se mapea a Playwright real (`get_by_role`, `expect`, download, tracing) cuando instales el runtime. Orden: **T1 Navegación** → **T2 Flujos** → **T3 Diagnóstico** → **T4 Límites**. RPA es último recurso tras API/export; nunca bypass de CAPTCHA ni términos.",
```

Optional follow-up (same issue family): add one theory code block titled `playwright_sketch.py` with a **commented or gated** real API sketch (or clearly labeled “solo local”) so multiarchivo is not a phantom.

### Diff J — Deduplicate privacy boilerplate (I-15)

```diff
--- a/src/lib/course/sections/s23-computer-vision.ts
+++ b/src/lib/course/sections/s23-computer-vision.ts
@@
-        "Filtra console logs por 'ERR' u otros marcadores; el ruido de info no debe ocultar el timeout. Si ok=False, adjunta trace path traces/{step}.zip al pkg del step. En PyArcana trabajamos con fixtures sintéticos de operaciones (Lima, America/Lima) y nunca PII real de clientes.",
-        "Caso: step s1 falla → pkg con trace+screenshot+error. Política: traces solo en fallo o sample rate bajo en éxito para no llenar disco del runner sintético. En PyArcana trabajamos con fixtures sintéticos de operaciones (Lima, America/Lima) y nunca PII real de clientes.",
+        "Filtra console logs por 'ERR' u otros marcadores; el ruido de info no debe ocultar el timeout. Si ok=False, adjunta trace path traces/{step}.zip al pkg del step.",
+        "Caso: step s1 falla → pkg con trace+screenshot+error. Política: traces solo en fallo o sample rate bajo en éxito para no llenar disco del runner. Fixtures sintéticos de operaciones (Lima, America/Lima); nunca PII real de clientes.",
@@
-        "Toda caída a RPA registra reason ('no_api', 'export_stale', etc.) en el decision dict del run. Documenta por qué se eligió RPA en el runbook del adapter web CP-N2-C. En PyArcana trabajamos con fixtures sintéticos de operaciones (Lima, America/Lima) y nunca PII real de clientes.",
+        "Toda caída a RPA registra reason ('no_api', 'export_stale', etc.) en el decision dict del run. Documenta por qué se eligió RPA en el runbook del adapter web CP-N2-C.",
```

### Diff K — Icon + heading polish (I-16, I-18) — platform-safe

```diff
--- a/src/lib/course/sections/s23-computer-vision.ts
+++ b/src/lib/course/sections/s23-computer-vision.ts
@@
-  icon: "Camera",
+  icon: "Monitor",
@@
-      heading: "auto-waiting y assertions",
+      heading: "Auto-waiting y assertions",
```

> **Do not casually rename `id: "computer-vision"`** without a coordinated routing/progress migration; prose should stop advertising the legacy name instead (Diff A). Id rename is a separate platform task.

### Diff L — We Do hints/feedback sample uplift (I-14) — pattern for all 24

Example for `S23-T1-A-E1` (replicate spirit per exercise):

```diff
-        hint: "next(...)",
-        hints: [
-          "contrato I/O en instruction",
-          "compara output con solution",
-          "datos sintéticos only",
-        ],
+        hint: "Filtra por role y name; devuelve el id del primer match.",
+        hints: [
+          "Un locator de usuario no mira el índice CSS: mira el rol accesible.",
+          "Si usas next(...), el predicado debe exigir role='link' y name='Inicio'.",
+          "Si no hay match, es mejor fallar ruidoso que devolver el primer nodo.",
+        ],
-        feedback: "Compara tu salida con la solución.",
+        feedback: "Debiste imprimir solo n1: el link Inicio, no un button inexistente.",
```

### Diff M — Tagline / You Do idempotency honesty (I-17)

Either deepen theory with a small `resume(run_state) → next_step` model **or** soften tagline:

```diff
-  tagline: "robot contra sitio de prueba controlado, con trace de éxito/falla, download verificado y reanudación idempotente",
+  tagline: "robot contra sitio de prueba controlado, con trace de éxito/falla, download verificado y retries selectivos con handoff",
```

(Preferred long-term: keep tagline and add T3-B paragraph + exercise on checkpointed resume.)

---

## 7. Recommended Priority Order for Fixing

| Priority | Issues | Rationale |
|----------|--------|-----------|
| **1. P0 demo truth** | I-01, I-02, I-03, I-04 (Diffs C–F) | Broken worked examples destroy the I Do pillar immediately |
| **2. Hard meta-leaks** | I-05–I-08 / M1–M4 (Diffs A, B, H) | Student-facing author/CI jargon |
| **3. Starter/solution repair** | I-11 (Diff G) | Guided exercise currently unsolvable by minimal fix |
| **4. Progressive disclosure honesty** | I-09, I-10, I-12, I-19 (Diff I + optional real API sketch) | Align title with practice; cut open load |
| **5. We Do scaffold quality** | I-13, I-14, I-20 (Diff L + selective exercise deepening) | 19 h / Competente needs non-trivial practice |
| **6. Redaction / UX polish** | I-15, I-16, I-18 (Diffs J, K) | Trust and professional tone |
| **7. Coverage stretch** | I-17, I-21, I-23, I-24 (Diff M + self-check/You Do) | Tagline, quiz, portfolio launchpad |
| **8. Platform legacy id** | id `computer-vision` rename | Separate migration; do **not** block content fixes |

**Preserve without dilution:** API-first hierarchy, CAPTCHA/ToS stop conditions, role-over-CSS message, evidence package shape, official Playwright resource links, ethical callouts.

---

## 8. Graph Memory Update Notes

For shared curriculum-hardening context:

```yaml
section: 23
id: computer-vision
file: src/lib/course/sections/s23-computer-vision.ts
title: Browser RPA con Playwright
score_1_to_10: 6.2
status_explorer: complete
capstone_thread: CP-N2-C web adapter
neighbors:
  prev: S22 email/approval (rapidfuzz-entity legacy id)
  next: S24 OCR Document AI (rpa-advanced legacy id)
strengths:
  - ethical RPA policy (no captcha bypass, ToS abort)
  - api > export > rpa > human hierarchy
  - 8-subtopic map with 8 I Do + 24 We Do topology
  - a11y ↔ locator stability message
  - official Playwright docs in resources
defects_open:
  - iDo_output_mismatches: [S23-T1-A-DEMO, S23-T2-A-DEMO, S23-T3-B-DEMO, partial_truncations]
  - hard_meta_leaks: [jobRelevance_legacy_V3, callout_auditoria, youDo_DEFECT_labels, rubric_gate_V3]
  - phantom_multifile: [fixture_server.py, robot.py]
  - no_real_playwright_api_in_body: true
  - weDo_boilerplate_hints_feedback: true
  - starter_solution_api_drift: [S23-T2-B-E1]
  - legacy_platform: {id: computer-vision, icon: Camera}
  - tagline_idempotent_under_taught: true
comparative:
  vs_S01: weaker progressive disclosure and teaching voice
  vs_S22: missing opening Diccionario; shares legacy-id meta pattern
  vs_playwright_docs: concepts aligned; runnable API underrepresented
fixer_entry_points:
  - Diffs C-F first (P0)
  - Diffs A B H (meta)
  - Diff G (T2-B-E1)
  - Diff I (intro rewrite)
graph_edges_to_rewire:
  - title_playwright -> embed_or_link_real_api_path
  - iDo_code -> iDo_output_parity
  - intro_multifile_claim -> actual_artifacts_or_remove_claim
  - jobRelevance -> strip_legacy_V3_voice
```

**Suggested Fixer prompt focus line:**  
“S23: make every I Do output executable-true; purge V3/legacy/auditor meta from student fields; restore dictionary + S22 handoff intro; align T2-B-E1; either ship a real Playwright sketch or stop promising multiarchivo.”

---

## Analysis dimension checklist (required coverage)

| # | Dimension | Covered in |
|---|-----------|------------|
| 1 | Meta-text / developer leakage | §4, I-05–I-08, I-16, I-20 |
| 2 | Grammatical correctness & redaction (es-PE) | §5.5, I-15, I-18 |
| 3 | Connective tissue & narrative flow | §5.4, I-19, Diff I |
| 4 | Pedagogical structure I/We/You | §5.2 |
| 5 | Cognitive load & progressive disclosure | §5.3, I-09–I-12 |
| 6 | Exercise & exam quality/alignment | §5.6, I-11–I-14, I-21 |
| 7 | Roadmap / previous sections consistency | §5.7 |
| 8 | External best-in-class comparison | §5.8 |
| 9 | Other (a11y, ethics, accessibility of learning) | §5.9, I-22–I-24, ethics strengths |

---

This is the complete Explorer report for Section 23. Ready for the Fixer prompt.
