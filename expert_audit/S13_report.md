# Section 13 — Curriculum Audit Report (PyArcana)

**Task ID:** S13
**Agent:** Curriculum Auditor (general-purpose)
**Section under audit:** Section 13 — *Familiarity Evidence Dashboard y cierre de nivel* (file `src/lib/course/sections/s13-rpa-automation.ts`, id `"rpa-automation"`, shortTitle `"Evidence Dashboard"`)
**Phase:** 0 — Fundamentos (sections 1–13), level "Intermedio", estimated 19 h
**Live URL:** https://pillb.github.io/pyarcana/#rpa-automation (rendered SPA; nav card index 12)
**Repo URL:** https://github.com/PillB/pyarcana/blob/main/src/lib/course/sections/s13-rpa-automation.ts

---

## 1. Section Identification & Scope

Section 13 was confirmed in three independent ways:

1. **Course index (`src/lib/course/index.ts`):** `section13` is imported from `./sections/s13-rpa-automation` and is the 13th entry of `COURSE_SECTIONS` (line 71), inside the *Phase 0 — Fundamentos* block.
2. **Live homepage (agent-browser):** the left-rail cards render `1 … 13 Evidence Dashboard` in order, with the same tagline present in the source: *"ER determinista, señales de relación separadas, dashboard pseudonimizado, CP-N1-C + regresión N1 + CF-1"*.
3. **Rendered section page (agent-browser → `#/section/12` then click S13 card):** H1 reads *"Familiarity Evidence Dashboard y cierre de nivel"* and the URL hash becomes `#rpa-automation`.

The section is the **cierre (close) of Phase 0 / level N1**. It is structured around four sub-topics (T1 Identidad / T2 Relación / T3 Decisión / T4 Producto+CF-1) with theory (8 blocks), an I-Do with 8 demos, a We-Do with 24 exercises (8 subtopics × 3 levels E1/E2/E3), a You-Do capstone (`familiarity_dashboard.py` with 9-row `DECISION_MATRIX` + 13-row `LEVEL1_REGRESSION_MATRIX`), a 9-question self-check, a weighted rubric (5 criteria, sums to 100%), and a resources block (6 docs, 2 books, 5 courses).

The source file is **2 011 lines long**; the rendered page is ~1 005 lines of plain text. All learner-facing Spanish prose was extracted (theory paragraphs, callout content, I-Do intro, We-Do intro + 24 instructions, You-Do context/objectives/requirements/portfolio note, self-check questions + explanations, rubric criteria, resource notes). Total **50 paragraphs / 151 sentences / 2 614 words** of Spanish prose.

---

## 2. Executive Summary of Quality

**Composite score: 8.0 / 10**

**Verdict:** Section 13 is pedagogically **excellent** and ethically rigorous — one of the strongest "cierre de nivel" sections in the course. The Ancla / Mecanismo / Caso trabajado / Borde schema is applied uniformly across all eight theory blocks, the I-Do → We-Do → You-Do handoff is explicit and contract-driven (every We-Do starter carries a single DEFECT to fix), the self-check covers the exact cognitive traps (FP ≠ fraude, ER ≠ REL, blocking = `parts[1]`), and the rubric weights sum to 100% with concrete evidence requirements. The ethical guardrails (no `auto_fraud`, no `is_family`, `fail-closed`, `señal ≠ parentesco`) are repeated until they become a refrain — a deliberate, well-executed pedagogical choice.

The section loses two points for three concrete, fixable issues:

1. **HIGH — Meta-leak / wrong-content bug in the interactive editor.** The rendered Section 13 page shows a *"Pruébalo tú mismo"* Pyodide editor titled *"Practica automatización con tenacity y argparse"* whose code (retry decorators, `llamar_api_inestable`, `argparse` CLI) has **nothing to do** with the section's actual content (Familiarity Evidence Dashboard / ER / relationship signals). The mismatch lives in `src/components/course/SectionView.tsx` line 1354, keyed by `'rpa-automation'` — the *old* section id. This is a developer artifact that leaked into the learner-facing UI. (−1.0)
2. **MEDIUM — Internal ID/filename inconsistency.** The file is `s13-rpa-automation.ts`, the section `id` is `"rpa-automation"`, the URL hash is `#rpa-automation`, but the section content is *explicitly* **not** about RPA automation ("La automatización de browser, OCR y orquestación avanzada llegan en secciones posteriores"). The ID is a stale remnant of an earlier curriculum version. (−0.3)
3. **MEDIUM — Four run-on sentences and several anglicisms** in the densest paragraphs. The "Diccionario de la sección" sentence (50 w), the "Mecanismo (orden de evaluación)" sentence (52 w), the "Casos trabajados (mínimo tres)" sentence (52 w) and the `jobRelevance` opening sentence (48 w) all exceed the 45-word run-on threshold and pack ≥4 sub-ideas each. Anglicisms: `instruction` (should be `instrucción`), `setee/setear` (prefer `establecer`), `grepea` (informal), `tests green` (prefer `tests en verde`), `DEFECT` (could be `defecto`). `postmortem` should be `post mortem` per Spanish Latin-locution norm. (−0.5)
4. **LOW — Two paragraphs at the cognitive-load edge.** P32 (the 5-step threshold decision matrix in a single sentence) and P38 (three CASE examples in one sentence) overload working memory; both should be split. (−0.2)

No developer comments ("moved from section X", "TODO", "FIXME", design notes) were found inside the section source file itself. The leak is one layer up, in the shared `SectionView.tsx` editor dictionary.

---

## 3. Detailed Issue Registry

| # | Sev | Dimension | Location | Evidence (verbatim) | Pedagogical impact |
|---|-----|-----------|----------|---------------------|--------------------|
| 1 | H | Meta-leak / wrong content | `src/components/course/SectionView.tsx:1354` (rendered on S13 page) | `'rpa-automation': { title: 'Practica automatización con tenacity y argparse', code: '# Practica RPA: retry logic y CLI (simulado en Pyodide) … def llamar_api_inestable(endpoint) … def procesar_clientes(archivo, formato="csv", verbose=False)'` | Learner on S13 sees an interactive "try it yourself" editor whose code is from the **old RPA version** of the section. The code teaches `tenacity`/`argparse`/retry — topics the section explicitly defers to later sections. Confuses learners and breaks the I-Do/We-Do/You-Do coherence. |
| 2 | M | ID / filename consistency | `src/lib/course/sections/s13-rpa-automation.ts:4` and `index.ts:14` | `id: "rpa-automation"`, `shortTitle: "Evidence Dashboard"`, theory paragraph: *"La automatización de browser, OCR y orquestación avanzada llegan en secciones posteriores"* | The id "rpa-automation" contradicts the section's own scoping sentence. Internal anchors, hash routing and future code references will all carry the misleading name. Cosmetic but corrosive. |
| 3 | H | Redaction / run-on | `theory[0].paragraphs[3]` (line 33) | "Diccionario de la sección: blocking acota pares candidatos antes de reglas finas; cola clerical es la bandeja humana de duda; fail-closed niega el merge si falta evidencia; uncertainty (low/med/high) declara qué tan confiable es el score; CF-1 es el paquete de privacidad + demo + runbook del cierre de nivel." (50 w) | Five glossary entries fused into one sentence. Working-memory overload; learner cannot anchor any term. |
| 4 | H | Redaction / run-on | `theory[6].paragraphs[1]` (line 270) | "Mecanismo (orden de evaluación): (1) score inválido (bool, no numérico, no finito, fuera de [0,1]) o uncertainty fuera de {low, med, high} → invalid_input; (2) uncertainty high → needs_review (aunque el score sea 0.95); (3) score menor que 0.40 → abstain; (4) score menor que 0.80 → needs_review; (5) resto → accept_pair. Los límites 0.40 y 0.80 son exactos: 0.399 → abstain; 0.4 → needs_review; 0.799 → needs_review; 0.8 con uncertainty no-high → accept_pair. No «aproximes» 0.799 a accept." (52 w) | Five-step decision algorithm + four boundary cases + one rule fused into one sentence. This is precisely the kind of matrix that should be a table. |
| 5 | H | Redaction / run-on | `theory[7].paragraphs[2]` (line 315) | "Casos trabajados (mínimo tres): CASE-1 A*** Q*** con ER 0.92 y REL 0.41 (identidad fuerte, relación moderada); CASE-2 L*** H*** con ER medio y REL más alto — el revisor ve la tensión sin auto-etiqueta de parentesco; CASE-3 M*** R*** con ER 0.77 y REL 0.22 (banda de duda / cola clerical). Los tres aparecen en el demo iDo y en el scaffold de teoría." (52 w) | Three worked examples packed into a single sentence. Each case deserves its own line so the learner can compare ER vs REL side-by-side. |
| 6 | H | Redaction / run-on | `jobRelevance` (line 15) | "En equipos de datos de banca, telco o fintech en Perú (créditos, onboarding, compliance), el cuello de botella no es «tener un modelo»: es saber si dos registros hablan de la misma persona y, por separado, si hay señales de familiaridad operativa — sin inventar parentesco ni fraude." (48 w) | Opening motivational sentence packs four ideas. Readable, but on the edge. |
| 7 | M | Anglicism | `theory[2].paragraphs[1]` (line 128) | "En ejercicios de práctica puedes usar una **variante** (p. ej. solo geo+apellido 0.6/0.4) **si** la instruction lo declara" | English "instruction" used in a Spanish sentence; should be `instrucción`. |
| 8 | M | Anglicism / register | `theory[6].paragraphs[2]` (line 272) | "grepea el repo y elimina cualquier path que setee `is_family` o `auto_fraud`" | "grepea" (from `grep`) and "setee" (from `set`) are tech slang not recognised by RAE; the section is otherwise formal. Prefer *busca con `grep`* and *establezca* / *asigne*. |
| 9 | M | Anglicism / register | `theory[8].paragraphs[1]` (line 372) | "(1) **tests green** de ER, señales y umbrales" | "tests green" is English; prefer *tests en verde* or *tests que pasan*. |
| 10 | L | Latin locution | `theory[8].paragraphs[1]` (line 372) | "rotate_secret / redact_logs / postmortem" | LanguageTool flags `postmortem` — Spanish norm is *post mortem* (two words). Acceptable as a DevOps borrowing, but worth harmonising. |
| 11 | L | Punctuation | `theory[4].paragraphs[2]` (line 180) | "A↔B con 2 txs y A,C→D → lista …" | Missing space after comma in `A,C→D`. Real but minor; LT rule `COMMA_PARENTHESIS_WHITESPACE`. |
| 12 | L | Typography / markdown rendering | `theory[7].paragraphs[1-2]` (lines 314–315) | Source has `pseudonimiza nombres (A*** Q***)` and `CASE-1 A*** Q*** con ER 0.92 …` | In the rendered live page, Markdown strips the `***` (treating it as emphasis), producing the confusing `pseudonimiza nombres (A Q)` and `CASE-1 A Q con ER 0.92`. The pseudonymisation visual is destroyed. Wrap pseudonyms in backticks: `` `A*** Q***` ``. |
| 13 | L | Repeated word | (none) | — | Heuristic search for `\b(\w+) \1\b` returned no hits; section is clean. |
| 14 | L | Inverted-question-mark pairing | (none) | — | All `¿`/`?` and `¡`/`!` pairs are balanced across the section. |
| 15 | M | Cognitive load / paragraph = one long sentence | `theory[6].paragraphs[1]` (the 5-step matrix) and `theory[7].paragraphs[2]` (3 cases) | see issues #4 and #5 | Two paragraphs violate the "one focus per paragraph" rule by stuffing a 5-step algorithm or 3 worked cases into one sentence. |
| 16 | L | Anaphoric monotony (light) | across theory | Many paragraphs begin "**Ancla:**", "**Mecanismo:**", "**Caso trabajado:**", "**Borde…**" | This is a deliberate schema (not a flaw) — but the rhythm is highly templated. Variation in 1–2 paragraphs would help. |
| 17 | L | Unbalanced brackets (false positive) | `theory[5].paragraphs[1]` (line 227) | "conflicto fuerte (\|ER−REL\| > 0.5)" and "{low, med, high}" | Heuristic flags unbalanced `()`/`[]` because of math notation `|ER−REL|` and set braces `{...}`. False positive — the delimiters are intentional. |
| 18 | M | Tech-borrowings density (low-severity note) | across the section | `entity_resolution_score`, `relationship_signal_score`, `auto_fraud`, `is_family`, `kinship_verdict`, `collusion_claim`, `rules_version`, `privacy_sheet`, `clerical_queue`, `DECISION_MATRIX`, `LEVEL1_REGRESSION_MATRIX`, etc. | High density of English code identifiers inside Spanish prose (≈22 distinct identifiers, several repeated). This is **acceptable** because each is shown as `inline code` and is necessary for the contract-driven pedagogy, but the cumulative density in the theory blocks T3-A and T3-B is at the cognitive-load ceiling. |
| 19 | L | Self-check question wording | `selfCheck.questions[2]` (line 1890) | "En zona gris de score el sistema debe…" | "En zona gris de score" is elliptical; prefer *"En la zona gris del score"*. |
| 20 | L | Self-check option grammar | `selfCheck.questions[3].options[1]` (line 1898) | "Privacy sheet, acceso, tests, demo y runbook" | Loanwords "privacy sheet", "tests", "demo", "runbook" packed in one option; understandable but anglicism-dense. Acceptable as a vocabulary check. |
| 21 | L | Resource note clarity | `resources.docs[5]` (line 1970) | "note: 'Identidad vs prueba; no sobreclaim en ER'" | "sobreclaim" is an anglicism calque; prefer *sobreafirmación* or *no exagerar la afirmación*. |
| 22 | L | Spanish concordance (LT) | `theory[0].paragraphs[1]` (line 31) | "Solo datos sintéticos pseudonimizados" / "Si falta evidencia o el schema no cuadra, **falla cerrado**" | LT flags `AGREEMENT_ADJ_NOUN` near "PII real; nunca auto_fraud/is_family" — false positive (PII is treated as a masculine loanword; "real" matches). |

**Issue count by severity:** H = 5 (1 meta-leak + 4 run-on), M = 7, L = 10. (Run-ons counted as H because they directly impair a teach-the-teacher matrix paragraph.)

---

## 4. Meta-Leak Report

### 4.1 — Interactive editor shows wrong-section code (HIGH)

**Location in repo:** `src/components/course/SectionView.tsx`, line 1354 onwards (key `'rpa-automation'` in the `editorSamples`-style dictionary).

**Exact leaked / mismatched text:**

```ts
'rpa-automation': {
  title: 'Practica automatización con tenacity y argparse',
  code: `# Practica RPA: retry logic y CLI (simulado en Pyodide)
import time
import random
from functools import wraps

# === DECORADOR DE RETRY (simulando tenacity) ===
def retry(max_attempts=3, delay=0.1):
    """Decorador que reintenta una funcion hasta max_attempts veces."""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(1, max_attempts + 1):
                try:
                    result = func(*args, **kwargs)
                    print(f"  ✓ Intento {attempt}: exitoso")
                    return result
                except Exception as e:
                    print(f"  ✗ Intento {attempt}: fallo - {e}")
                    if attempt < max_attempts:
                        time.sleep(delay)
                        print(f"    Reintentando en {delay}s...")
                    else:
                        print(f"  ✗ Agotados {max_attempts} intentos")
                        raise
        return wrapper
    return decorator

# === SIMULAR API QUE FALLA ALEATORIAMENTE ===
@retry(max_attempts=5, delay=0.05)
def llamar_api_inestable(endpoint):
    """Simula una API que falla 70% de las veces."""
    if random.random() < 0.7:
        raise ConnectionError(f"Timeout en {endpoint}")
    return {"status": "ok", "data": [1, 2, 3]}

# Probar la API con retry
print("=== Llamando API inestable con retry ===")
random.seed(42)  # para reproducibilidad
try:
    resultado = llamar_api_inestable("/api/clientes")
    print(f"Resultado: {resultado}")
except Exception as e:
    print(f"Error final: {e}")

# === SIMULAR ARGPARSE ===
print("\n=== Simulando CLI con argumentos ===")
def procesar_clientes(archivo, formato="csv", verbose=False):
    """Simula procesamiento de clientes con argumentos CLI."""
    if verbose:
        print(f"  Procesando {archivo} en formato {formato}...")
    # Simular procesamiento
    clientes = ["Maria", "Luis", "Ana"]
    if verbose:
        print(f"  Encontrados {len(clientes)} clientes")
    return clientes

# Simular: python script.py --archivo clientes.xlsx --formato xlsx --verbose
procesar_clientes("clientes.xlsx", formato="xlsx", verbose=True)`,
  expectedOutput: `=== Llamando API inestable con retry ===
  ✗ Intento 1: fallo - Timeout en /api/clientes
    Reintentando en 0.05s...`,
}
```

**Where the learner sees it:** The rendered S13 page (verified via `agent-browser`) ends with the panel:

> ### Pruébalo tú mismo
> Editor interactivo en tu navegador
> Este editor corre Python de verdad en tu browser (con Pyodide). Modifica el código, presiona Run, y experimenta. No necesitas instalar nada.
> **Practica automatización con tenacity y argparse**  · Python listo
> [Reset] [Run]
> 1 … 58
> `# Practica RPA: retry logic y CLI (simulado en Pyodide) …`

**Why this is a leak:** The interactive editor is a shared component that looks up a sample by `section.id`. Section 13's id is `"rpa-automation"`, so it picks up the *old* RPA-automation sample. The current section content is **Familiarity Evidence Dashboard** (entity resolution, relationship signals, decision matrix) — completely unrelated to retry decorators, `tenacity`, or `argparse`. Worse, the section's own theory states: *"La automatización de browser, OCR y orquestación avanzada llegan en secciones posteriores"* — so the editor is actively contradicting the section it sits inside.

**Severity rationale:** This is the single most damaging issue in S13 because (a) it appears at the bottom of the theory page where learners go to practice, (b) it teaches API retry/CLI parsing concepts that the section explicitly defers, and (c) it leaves the impression that the section was incompletely rewritten. The fix is mechanical: replace the `'rpa-automation'` sample with code that exercises `norm_doc` / `blocking_key` / `decide_ops_status` (the actual S13 contracts).

### 4.2 — Stale `id` / filename (MEDIUM meta-residue)

**Leaked text:** `id: "rpa-automation"`, file `s13-rpa-automation.ts`, URL hash `#rpa-automation`, `shortTitle: "Evidence Dashboard"`, `title: "Familiarity Evidence Dashboard y cierre de nivel"`.

The triple mismatch (filename says RPA, id says RPA, title says Evidence Dashboard) is internal authoring residue. The `id` is used as a key in dictionaries (such as the editor-sample map in §4.1), so it is not purely cosmetic — it is the very reason the wrong editor sample renders. Fixing the id (or, more cheaply, fixing the editor-sample key) closes both leaks at once.

### 4.3 — No other internal/AI/TODO leaks found

A regex sweep of the source file for `TODO|FIXME|XXX|HACK|NOTE:|TBD|move from|moved from|from section|from S\d+|paste|placeholder|lorem|admin|dev note|developer note` returned **zero** hits inside learner-facing strings (the few matches were inside legitimate prose such as "TBD", "DOC" or "NOTE" — all ruled out as false positives). The section's *content* is clean; only the shared editor dictionary is dirty.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 — I Do / We Do / You Do fidelity

**I Do (`iDo`, 8 demos, lines 421–693):** Excellent. Each of the 8 demos maps 1:1 to a subtopic (`S13-T1-A-DEMO` … `S13-T4-B-DEMO`). Each demo has `subtopicId`, `environment: "local-python"`, a one-line `description`, reproducible `code` + `output`, and a one-sentence `why`. The intro explicitly tells the learner what to do: *"Observa el código, córrelo y compara la salida: cada print debe ser reproducible (sin teatro)."* The intro also pre-announces the bridge to We Do: *"Después de cada demo, el We Do del mismo subtema te pide arreglar un DEFECT del mismo contrato: es el puente I Do → We Do antes del You Do del portfolio."* This is gold-standard progressive disclosure.

**We Do (`weDo`, 24 exercises, lines 694–1711):** Excellent. The structure is `E1 guiado → E2 independiente → E3 transferencia` per subtopic, with `kind` field tagging each. Every exercise carries a single explicit DEFECT to fix (e.g. `# DEFECT: no casefold; no strip punctuation en doc`), a starter code, a solution, an expected output, a `hint` + `hints[]` (max 2), `edgeCases[]`, `tests` (the pass condition as a string), and a one-line `feedback`. The intro is explicit about the contract: *"no reescribas el fixture; corrígelo hasta que la salida/pass coincida"* and about pacing: *"Dos pistas por ejercicio; mira la solución solo si te trabas."*

**You Do (`youDo`, lines 1712–1872):** Strong. The starter is a single file `familiarity_dashboard.py` with intentional DEFECTs in 5 functions (`norm_doc`, `blocking_key`, `er_score`, `relationship_signal_score`, `decide_ops_status`, `pseudonymize`); `privacy_sheet()` and `level1_regression_notes()` are already correct. The `DECISION_MATRIX` has **9 rows** covering: -0.1, 0.399, 0.4, 0.799, 0.8, 1.0, 0.9/high, NaN, and `uncertainty="?"` (invalid). The `LEVEL1_REGRESSION_MATRIX` has **13 rows** (S01 → S13), one per prior section, each with a concrete `check` description — this is exemplary for a "regression close" capstone. The rubric (5 criteria, weights 20/20/20/15/25 = 100%) is specific and evidence-bound.

### 5.2 — Connective tissue and narrative flow

The section is exceptionally well-connected to the rest of the course:

- **Backward references:** S12 (HTTP timeout/retry, SQL parametrizado, egress policy), S11 (`RelationshipEvidence` class spirit), S01–S13 (the regression matrix), S10 (CLI structure), S07 (Unicode/email/teléfono contracts).
- **Forward references:** S14–S15 (sklearn/NumPy/Pandas explicitly excluded from N1), S30 (probabilistic ER deferred), Streamlit / design system (deferred to a later section).
- **Refrain / spaced repetition:** The phrases *"señal ≠ parentesco"*, *"FP ≠ fraude"*, *"no auto_fraud / no is_family"*, *"fail-closed"* and *"common counterparty ≠ collusion claim"* are repeated across theory, callouts, I-Do `why`s, We-Do `feedback`s, You-Do `requirements`, and self-check `explanations`. This is correct use of spaced repetition for ethical guardrails.
- **Dictionary callout:** The first theory block explicitly defines blocking / cola clerical / fail-closed / uncertainty / CF-1 *before* using them — good front-loading of vocabulary.

### 5.3 — Cognitive load and progressive disclosure

Mostly excellent. The Ancla / Mecanismo / Caso trabajado / Borde schema is applied uniformly across all 8 theory blocks, which lowers extraneous load. However:

- **Theory block T3-B (umbrales)** packs the entire 5-step decision algorithm + 4 boundary cases into a single 52-word sentence (issue #4). The same content is rendered correctly as a table inside the You-Do `DECISION_MATRIX`. **Recommendation:** surface the matrix as a table in theory too.
- **Theory block T4-A (dashboard)** packs three CASE examples into one 52-word sentence (issue #5). **Recommendation:** render the three CASEs as a small bulleted list or table.
- **The "Diccionario de la sección" sentence (issue #3)** crams 5 glossary entries into one sentence. **Recommendation:** render the glossary as a `<dl>` / bullet list.
- **The jobRelevance paragraph** is a single 48-word sentence (issue #6). Acceptable as a motivational opener, but could be split into two.

### 5.4 — Exercise and exam quality

- The 24 We-Do exercises cover all 8 subtopics × 3 scaffolding levels — full coverage.
- Every exercise has a precise `tests` pass-condition (e.g. `'1.0 0.5 0.0'`, `"['P2','P3']"`, `'score 1.0'`).
- The DEFECTs are pedagogically well-chosen: each one targets a single concept (no casefold, wrong blocking token, formulas invertidas, missing missing-field, etc.).
- The self-check has 9 questions, each with 4 options and a one-line explanation. The distractors are well-designed (e.g. `"Fusionarse siempre en un solo número sin etiqueta"` is the exact anti-pattern the section warns against).
- The rubric criteria are specific: *"Las 9 filas de DECISION_MATRIX pasan exactamente; no existen auto_fraud/is_family"* (weight 20%) and *"13 filas S01–S13 con pass/fail+evidencia"* (weight 25%) — both are objectively checkable.

### 5.5 — Consistency with overall roadmap

- Section 13 closes Phase 0 (Fundamentos, sections 1–13). The section explicitly states the promotion criteria: *"tres capstones N1, regresión S01–S13 (level-1) y CF-1 aprobados"*.
- The stack is explicitly scoped: *"stdlib + reglas deterministas de S01–S12; sin sklearn ni NumPy/Pandas de S14–S15"* — this prevents the learner from over-reaching.
- The privacy/egress policy from S12 is reused, not re-taught: *"Reutiliza la política de egress de S12: no mandes PII cruda a un geocoder público."*
- The `LEVEL1_REGRESSION_MATRIX` rows are concrete and aligned with each prior section's actual gate (e.g. S11: *"entity_id estable; Decimal/currency/evidence invariants"* — matches S11's theory contract).

### 5.6 — Comparison with best-in-class external materials

- **Christen, *Data Matching* (cited in resources):** Christen treats blocking, evaluation (precision/recall) and human review in far more depth. S13 is a faithful, simplified N1 version that defers probabilistic ER to S30 (correctly).
- **NIST SP 800-63-3 (cited):** The section's strict separation of *identity* (ER) from *attributes/relationships* and its refusal to issue automated legal verdicts aligns with NIST's "identity proofing ≠ authorization" stance.
- **Stanford CS329T / Responsible ML:** The decision matrix with explicit `invalid_input` / `abstain` / `needs_review` / `accept_pair` states and the `uncertainty` band are at the same rigour level as responsible-ML lecture notes.
- **Typical Python courses (Coursera Python for Everybody, MIT 6.100L — both cited):** Those courses do not cover entity resolution, decision matrices, or ethical guardrails at all. S13 is **substantially more rigorous** than its cited external references.

---

## 6. Grammatical improvements and rewriting report (paragraph by paragraph)

Method note (research summary, per the shared `_GRAMMAR_SUBPLAN.md`): For each paragraph we computed Fernández-Huerta (`206.84 − 60·SPW − 1.02·WPS`) and INFLESZ (`206.835 − 62.3·SPW − WPS`), words-per-sentence (WPS), syllables-per-word (SPW, custom Spanish syllable counter with diphthong/hiatus/`qu`/`gu` rules), plus 13 pedagogical heuristics. We also ran LanguageTool `es` via the public API (336 matches; 330 are `MORFOLOGIK_RULE_ES` false positives on tech identifiers like `ER`, `score`, `gate`, `uncertainty`, `runbook`, `entity_resolution_score` — these were excluded as known false positives; the remaining 6 are real and listed in the issue registry).

Global metrics for the section's 50 learner-facing paragraphs / 151 sentences / 2 614 words:

| Metric | Value | Interpretation |
|--------|-------|----------------|
| WPS (mean) | 17.31 | Healthy (target ~15–32 for technical ES) |
| SPW (mean) | 1.98 | Healthy (Spanish average ≈ 2.0) |
| Fernández-Huerta | 70.5 | "Normal" / "Bastante fácil" — appropriate for technical curriculum |
| INFLESZ | 66.3 | "Normal" — appropriate |
| Run-ons > 45 w | 4 | Issue |
| Long 32–45 w | 4 | Issue |
| High comma density | 3 | Minor |
| Anglicisms | 5 | Issue (#7–#10, #21) |

Below are the worst paragraphs and proposed rewrites. Each rewrite preserves meaning and the section's voice; bold/italic/code formatting is preserved as in source. Only the worst paragraphs are rewritten here (the rest are clean enough to ship as-is).

### 6.1 — `theory[0].paragraphs[3]` — "Diccionario de la sección" (P4, 50 w, run-on)

**Before (source, line 33):**
> "**Orden de estudio:** **T1 Identidad (ER)** → **T2 Relación** → **T3 Decisión** → **T4 Producto/ops + CF-1**. Métrica del gate: dos scores visibles en ficha + cola clerical + privacy sheet + demo de un comando. Nunca PII real ni `is_family` automático. **Diccionario de la sección:** *blocking* acota pares candidatos antes de reglas finas; *cola clerical* es la bandeja humana de duda; *fail-closed* niega el merge si falta evidencia; *uncertainty* (`low`/`med`/`high`) declara qué tan confiable es el score; *CF-1* es el paquete de privacidad + demo + runbook del cierre de nivel. **Ritmo sugerido (19 h):** ~6 h T1–T2 (identidad y señales), ~5 h T3 (matriz y explicación), ~5 h T4 (dashboard + CF-1), ~3 h regresión S01–S13 y pulido de portfolio."

**After (proposed rewrite — split the glossary into a list):**
> "**Orden de estudio:** **T1 Identidad (ER)** → **T2 Relación** → **T3 Decisión** → **T4 Producto/ops + CF-1**. Métrica del gate: dos scores visibles en ficha + cola clerical + privacy sheet + demo de un comando. Nunca PII real ni `is_family` automático.
>
> **Diccionario de la sección:**
> - *blocking*: acota pares candidatos antes de reglas finas.
> - *cola clerical*: la bandeja humana de duda.
> - *fail-closed*: niega el merge si falta evidencia.
> - *uncertainty* (`low`/`med`/`high`): declara qué tan confiable es el score.
> - *CF-1*: el paquete de privacidad + demo + runbook del cierre de nivel.
>
> **Ritmo sugerido (19 h):** ~6 h T1–T2 (identidad y señales), ~5 h T3 (matriz y explicación), ~5 h T4 (dashboard + CF-1), ~3 h regresión S01–S13 y pulido de portfolio."

**Impact:** WPS of the glossary paragraph drops from ~50 to ~14 per sentence; the list format makes each term scannable.

### 6.2 — `theory[6].paragraphs[1]` — "Mecanismo (orden de evaluación)" (P32, 52 w, run-on)

**Before (source, line 270):**
> "**Mecanismo (orden de evaluación):** (1) score inválido (bool, no numérico, no finito, fuera de [0,1]) o uncertainty fuera de {low, med, high} → `invalid_input`; (2) uncertainty `high` → `needs_review` (aunque el score sea 0.95); (3) score menor que 0.40 → `abstain`; (4) score menor que 0.80 → `needs_review`; (5) resto → `accept_pair`. Los límites **0.40** y **0.80** son exactos: 0.399 → abstain; 0.4 → needs_review; 0.799 → needs_review; 0.8 con uncertainty no-high → accept_pair. No «aproximes» 0.799 a accept."

**After (proposed rewrite — table for the algorithm + separate paragraph for the boundaries):**
> "**Mecanismo (orden de evaluación):** la función `decide_ops_status(score, uncertainty)` recorre cinco reglas en orden y devuelve el primer estado que aplica:
>
> | # | Condición | Estado |
> |---|-----------|--------|
> | 1 | score inválido (bool, no numérico, no finito, fuera de [0,1]) o uncertainty ∉ {low, med, high} | `invalid_input` |
> | 2 | uncertainty = `high` (aunque el score sea 0.95) | `needs_review` |
> | 3 | score < 0.40 | `abstain` |
> | 4 | score < 0.80 | `needs_review` |
> | 5 | resto | `accept_pair` |
>
> Los límites **0.40** y **0.80** son exactos. Ejemplos: 0.399 → `abstain`; 0.4 → `needs_review`; 0.799 → `needs_review`; 0.8 con uncertainty ≠ high → `accept_pair`. No «aproximes» 0.799 a `accept_pair`."

**Impact:** the algorithm is now scannable as a table; the boundary examples are a separate short paragraph; cognitive load drops sharply. The same content is already a table in the You-Do `DECISION_MATRIX`, so this also improves theory↔You-Do alignment.

### 6.3 — `theory[7].paragraphs[2]` — "Casos trabajados (mínimo tres)" (P38, 52 w, run-on)

**Before (source, line 315):**
> "**Casos trabajados (mínimo tres):** CASE-1 `A*** Q***` con ER 0.92 y REL 0.41 (identidad fuerte, relación moderada); CASE-2 `L*** H***` con ER medio y REL más alto — el revisor ve la tensión **sin** auto-etiqueta de parentesco; CASE-3 `M*** R***` con ER 0.77 y REL 0.22 (banda de duda / cola clerical). Los tres aparecen en el demo iDo y en el scaffold de teoría."

**After (proposed rewrite — bullet list per case):**
> "**Casos trabajados (mínimo tres):**
> - **CASE-1** `A*** Q***` — ER 0.92, REL 0.41: identidad fuerte, relación moderada.
> - **CASE-2** `L*** H***` — ER medio, REL más alto: el revisor ve la tensión **sin** auto-etiqueta de parentesco.
> - **CASE-3** `M*** R***` — ER 0.77, REL 0.22: banda de duda / cola clerical.
>
> Los tres aparecen en el demo I Do y en el scaffold de teoría."

**Impact:** each case is now a single-line scan; ER/REL comparison becomes visual. (Also note: `A*** Q***` must be wrapped in backticks in the source so the Markdown renderer does not strip the asterisks — see issue #12. The current live rendering shows the broken `A Q`.)

### 6.4 — `jobRelevance` (P50, 48 w, run-on)

**Before (source, line 15):**
> "En equipos de datos de banca, telco o fintech en Perú (créditos, onboarding, compliance), el cuello de botella no es «tener un modelo»: es **saber si dos registros hablan de la misma persona** y, por separado, si hay **señales de familiaridad operativa** — sin inventar parentesco ni fraude. Un analista junior que entrega un **Familiarity Evidence Dashboard** con entity resolution determinista, scores **separados**, fichas pseudonimizadas y cola de revisión humana se vuelve confiable en la mesa de riesgo. Esta sección es la **puerta de salida N1**: cierras **CP-N1-C**, documentas la **regresión de nivel 1 (S01–S13)** y entregas artefactos **CF-1** (privacidad, demo de un comando, runbook) listos para revisión de portfolio."

**After (proposed rewrite — split the opening 48-word sentence into two):**
> "En equipos de datos de banca, telco o fintech en Perú (créditos, onboarding, compliance), el cuello de botella no es «tener un modelo»: es **saber si dos registros hablan de la misma persona** y, por separado, si hay **señales de familiaridad operativa**. Y todo eso sin inventar parentesco ni fraude. Un analista junior que entrega un **Familiarity Evidence Dashboard** con entity resolution determinista, scores **separados**, fichas pseudonimizadas y cola de revisión humana se vuelve confiable en la mesa de riesgo. Esta sección es la **puerta de salida N1**: cierras **CP-N1-C**, documentas la **regresión de nivel 1 (S01–S13)** y entregas artefactos **CF-1** (privacidad, demo de un comando, runbook) listos para revisión de portfolio."

**Impact:** the opening sentence drops from 48 w to 38 w; the punchy "Y todo eso sin inventar parentesco ni fraude." reinforces the ethical guardrail.

### 6.5 — Anglicisms (issues #7–#10, #21)

| # | Source | Replacement |
|---|--------|-------------|
| 7 | "si la instruction lo declara" | "si la `instruction` del ejercicio lo declara" → "si la `instruction` lo declara" (acceptable as code identifier, but prefer "si la consigna del ejercicio lo declara" in prose) |
| 8 | "grepea el repo y elimina cualquier path que setee" | "busca con `grep` en el repo y elimina cualquier path que establezca" |
| 9 | "tests green de ER" | "tests en verde de ER" |
| 10 | "postmortem" | "post mortem" (or keep "postmortem" as a code identifier with backticks) |
| 21 | "no sobreclaim en ER" | "no sobreafirmes en ER" |

### 6.6 — Per-tab summary

| Tab | Paragraphs | Mean WPS | Mean FH | Issues | Verdict |
|-----|------------|----------|---------|--------|---------|
| Theory (8 blocks, 32 paragraphs) | 32 | 18.2 | 73.4 | 3 run-ons (P4, P32, P38), 4 long, 5 anglicisms, 1 punctuation | Strong; needs the 3 rewrites above |
| I Do (intro + 8 demos) | 9 | 16.8 | 71.8 | 1 long (P46); clean | Excellent |
| We Do (intro + 24 instructions) | 25 | 16.1 | 75.6 | "instruction" used 24× as code identifier (acceptable) | Excellent |
| You Do (context + objectives + requirements + portfolio note) | 5 | 24.0 | 56.5 | 1 run-on (P48), 1 long | Good; split P48 |
| Self-check (9 questions + 9 explanations) | 18 | 11.2 | 80.0 | 1 minor wording (#19) | Excellent |
| Rubric (5 criteria) | 5 | 18.4 | 65.4 | None | Excellent |
| Resources (notes) | 13 | 7.2 | 87.7 | 1 anglicism (#21) | Excellent |

### 6.7 — Worst sentences (full list)

| P | W | Issue | Sentence (truncated) |
|---|---|-------|---------------------|
| 4 | 50 | run-on | "Diccionario de la sección: blocking acota pares candidatos antes de reglas finas; cola clerical es la bandeja humana de duda; fail-closed niega el merge si falta evidencia; uncertainty (low/med/high) declara qué tan confiable es el score; CF-1 es el paquete de privacidad + demo + runbook del cierre de nivel." |
| 32 | 52 | run-on | "Mecanismo (orden de evaluación): (1) score inválido (bool, no numérico, no finito, fuera de [0,1]) o uncertainty fuera de {low, med, high} → invalid_input; (2) uncertainty high → needs_review (aunque el score sea 0.95); (3) score menor que 0.40 → abstain; (4) score menor que 0.80 → needs_review; (5) resto → accept_pair. Los límites 0.40 y 0.80 son exactos: 0.399 → abstain; 0.4 → needs_review; 0.799 → needs_review; 0.8 con uncertainty no-high → accept_pair. No «aproximes» 0.799 a accept." |
| 38 | 52 | run-on | "Casos trabajados (mínimo tres): CASE-1 A*** Q*** con ER 0.92 y REL 0.41 (identidad fuerte, relación moderada); CASE-2 L*** H*** con ER medio y REL más alto — el revisor ve la tensión sin auto-etiqueta de parentesco; CASE-3 M*** R*** con ER 0.77 y REL 0.22 (banda de duda / cola clerical). Los tres aparecen en el demo iDo y en el scaffold de teoría." |
| 50 | 48 | run-on | "En equipos de datos de banca, telco o fintech en Perú (créditos, onboarding, compliance), el cuello de botella no es «tener un modelo»: es saber si dos registros hablan de la misma persona y, por separado, si hay señales de familiaridad operativa — sin inventar parentesco ni fraude." |
| 28 | 33 | long + high comma density | "Caso trabajado: explain(0.9, 0.4, ["phone"]) → evidence_score 0.7, uncertainty med (falta teléfono; el gap |0.9−0.4|=0.5 no supera el umbral de conflicto >0.5 en este contrato), bullets con ER, REL y missing, audit rules_version=n1-er-1.0. El revisor debe poder recalcular 0.7 desde el fixture." |
| 42 | 39 | long | "Mecanismo de entrega: (1) tests green de ER, señales y umbrales; (2) demo de un comando (python -m demo_n1_dashboard --synthetic); (3) runbook con setup + playbook de incidente (token o nombre en log → rotate_secret / redact_logs / postmortem). Un compañero en máquina limpia debe poder reproducir la demo con el mismo fixture sintético." |
| 43 | 33 | long | "En ~30 min re-ejecuta solo los checks críticos de LEVEL1_REGRESSION_MATRIX y anota pass/fail; el bloque de producto (dashboard + privacy) es aparte — no intentes rehacer todos los capstones en una sola noche." |
| 48 | 36 | long | "Incluye notas de regresión de nivel 1 (S01–S13): en ~30 min re-ejecuta los checks críticos listados en LEVEL1_REGRESSION_MATRIX sobre fixtures sintéticos y registra pass/fail en el runbook; el bloque de producto (dashboard + privacy) es aparte." |

---

## 7. Proposed GitHub-style Diffs (do NOT apply — audit only)

### Diff 1 — Replace wrong-section interactive editor sample (HIGH priority, fixes §4.1)

```diff
--- a/src/components/course/SectionView.tsx
+++ b/src/components/course/SectionView.tsx
@@ -1351,7 +1351,40 @@ const editorSamples = {
       hint: 'Cambia n a 1000000 y observa como cambia el speedup',
     },
-    'rpa-automation': {
-      title: 'Practica automatización con tenacity y argparse',
-      code: `# Practica RPA: retry logic y CLI (simulado en Pyodide)
-import time
-import random
-from functools import wraps
-
-# === DECORADOR DE RETRY (simulando tenacity) ===
-def retry(max_attempts=3, delay=0.1):
-    """Decorador que reintenta una funcion hasta max_attempts veces."""
-    def decorator(func):
-        @wraps(func)
-        def wrapper(*args, **kwargs):
-            for attempt in range(1, max_attempts + 1):
-                try:
-                    result = func(*args, **kwargs)
-                    print(f"  ✓ Intento {attempt}: exitoso")
-                    return result
-                except Exception as e:
-                    print(f"  ✗ Intento {attempt}: fallo - {e}")
-                    if attempt < max_attempts:
-                        time.sleep(delay)
-                        print(f"    Reintentando en {delay}s...")
-                    else:
-                        print(f"  ✗ Agotados {max_attempts} intentos")
-                        raise
-        return wrapper
-    return decorator
-
-# === SIMULAR API QUE FALLA ALEATORIAMENTE ===
-@retry(max_attempts=5, delay=0.05)
-def llamar_api_inestable(endpoint):
-    """Simula una API que falla 70% de las veces."""
-    if random.random() < 0.7:
-        raise ConnectionError(f"Timeout en {endpoint}")
-    return {"status": "ok", "data": [1, 2, 3]}
-
-# Probar la API con retry
-print("=== Llamando API inestable con retry ===")
-random.seed(42)  # para reproducibilidad
-try:
-    resultado = llamar_api_inestable("/api/clientes")
-    print(f"Resultado: {resultado}")
-except Exception as e:
-    print(f"Error final: {e}")
-
-# === SIMULAR ARGPARSE ===
-print("\\n=== Simulando CLI con argumentos ===")
-def procesar_clientes(archivo, formato="csv", verbose=False):
-    """Simula procesamiento de clientes con argumentos CLI."""
-    if verbose:
-        print(f"  Procesando {archivo} en formato {formato}...")
-    # Simular procesamiento
-    clientes = ["Maria", "Luis", "Ana"]
-    if verbose:
-        print(f"  Encontrados {len(clientes)} clientes")
-    return clientes
-
-# Simular: python script.py --archivo clientes.xlsx --formato xlsx --verbose
-procesar_clientes("clientes.xlsx", formato="xlsx", verbose=True)`,
-      expectedOutput: `=== Llamando API inestable con retry ===
-  ✗ Intento 1: fallo - Timeout en /api/clientes
-    Reintentando en 0.05s...`,
+    'rpa-automation': {
+      title: 'Practica ER determinista y decide_ops_status',
+      code: `# Practica S13: entity resolution + decision matrix (Pyodide-ready)
+import re
+from math import isfinite
+
+def norm_doc(d: str) -> str:
+    return re.sub(r"[^a-z0-9]", "", d.casefold())
+
+def blocking_key(rec: dict) -> str:
+    parts = rec["name"].casefold().split()
+    ap = parts[1] if len(parts) >= 2 else parts[0]
+    return f"{ap}|{rec['region'].casefold()}"
+
+def er_score(a: dict, b: dict) -> float:
+    same_doc = norm_doc(a["document_id"]) == norm_doc(b["document_id"])
+    same_block = blocking_key(a) == blocking_key(b)
+    if same_doc and same_block:
+        return 1.0
+    if same_doc:
+        return 0.5
+    return 0.0
+
+def decide_ops_status(score, uncertainty: str) -> str:
+    if isinstance(score, bool) or not isinstance(score, (int, float)):
+        return "invalid_input"
+    if not isfinite(score) or not 0.0 <= score <= 1.0:
+        return "invalid_input"
+    if uncertainty not in {"low", "med", "high"}:
+        return "invalid_input"
+    if uncertainty == "high":
+        return "needs_review"
+    if score < 0.4:
+        return "abstain"
+    if score < 0.8:
+        return "needs_review"
+    return "accept_pair"
+
+a = {"name": "Ana Quispe", "document_id": "D-1", "region": "Lima"}
+b = {"name": "ANA QUISPE", "document_id": "d1", "region": "Lima"}
+print("er", er_score(a, b))
+for s, u in [(0.9, "low"), (0.55, "med"), (0.2, "low"), (0.85, "high"), (float("nan"), "low")]:
+    print(s, u, decide_ops_status(s, u), "auto_fraud", False)`,
+      expectedOutput: `er 1.0
+0.9 low accept_pair auto_fraud False
+0.55 med needs_review auto_fraud False
+0.2 low abstain auto_fraud False
+0.85 high needs_review auto_fraud False
+nan low invalid_input auto_fraud False`,
     },
```

### Diff 2 — Rename `id` and file (or, more cheaply, add a non-leaky alias) (MEDIUM priority, fixes §4.2)

The cheapest, lowest-blast-radius fix is to **keep the file name and id** (to avoid breaking every dictionary that keys by `'rpa-automation'`) but to **fix the dictionaries** that still resolve by the old id. However, the cleanest long-term fix is a rename:

```diff
--- a/src/lib/course/sections/s13-rpa-automation.ts
+++ b/src/lib/course/sections/s13-rpa-automation.ts
@@ -1,6 +1,6 @@
 import type { CourseSection } from '../../types'

 export const section13: CourseSection = {
-  id: "rpa-automation",
+  id: "evidence-dashboard",
   index: 13,
   title: "Familiarity Evidence Dashboard y cierre de nivel",
-  shortTitle: "Evidence Dashboard",
+  shortTitle: "Evidence Dashboard",  // unchanged
   ...
```

```diff
--- a/src/lib/course/index.ts
+++ b/src/lib/course/index.ts
@@ -11,3 +11,3 @@
 import { section12 } from './sections/s12-performance'
-import { section13 } from './sections/s13-rpa-automation'
+import { section13 } from './sections/s13-evidence-dashboard'
```

(Plus a `git mv s13-rpa-automation.ts s13-evidence-dashboard.ts` and a global replace of `'rpa-automation'` → `'evidence-dashboard'` in `SectionView.tsx` and any other dictionary. Run the test suite after.)

### Diff 3 — Split the "Diccionario de la sección" run-on (P4) into a list (HIGH priority, fixes issue #3)

```diff
--- a/src/lib/course/sections/s13-rpa-automation.ts
+++ b/src/lib/course/sections/s13-rpa-automation.ts
@@ -30,7 +30,13 @@
         "Orden de estudio: **T1 Identidad (ER)** → **T2 Relación** → **T3 Decisión** → **T4 Producto/ops + CF-1**. Métrica del gate: dos scores visibles en ficha + cola clerical + privacy sheet + demo de un comando. Nunca PII real ni `is_family` automático. **Diccionario de la sección:** *blocking* acota pares candidatos antes de reglas finas; *cola clerical* es la bandeja humana de duda; *fail-closed* niega el merge si falta evidencia; *uncertainty* (`low`/`med`/`high`) declara qué tan confiable es el score; *CF-1* es el paquete de privacidad + demo + runbook del cierre de nivel. **Ritmo sugerido (19 h):** ~6 h T1–T2 (identidad y señales), ~5 h T3 (matriz y explicación), ~5 h T4 (dashboard + CF-1), ~3 h regresión S01–S13 y pulido de portfolio.",
+        "Orden de estudio: **T1 Identidad (ER)** → **T2 Relación** → **T3 Decisión** → **T4 Producto/ops + CF-1**. Métrica del gate: dos scores visibles en ficha + cola clerical + privacy sheet + demo de un comando. Nunca PII real ni `is_family` automático.",
+        "**Diccionario de la sección:**",
+        "- *blocking*: acota pares candidatos antes de reglas finas.",
+        "- *cola clerical*: la bandeja humana de duda.",
+        "- *fail-closed*: niega el merge si falta evidencia.",
+        "- *uncertainty* (`low`/`med`/`high`): declara qué tan confiable es el score.",
+        "- *CF-1*: el paquete de privacidad + demo + runbook del cierre de nivel.",
+        "**Ritmo sugerido (19 h):** ~6 h T1–T2 (identidad y señales), ~5 h T3 (matriz y explicación), ~5 h T4 (dashboard + CF-1), ~3 h regresión S01–S13 y pulido de portfolio.",
```

### Diff 4 — Render the 5-step decision matrix as a table (P32) (HIGH priority, fixes issue #4)

```diff
--- a/src/lib/course/sections/s13-rpa-automation.ts
+++ b/src/lib/course/sections/s13-rpa-automation.ts
@@ -269,7 +269,16 @@
-        "**Mecanismo (orden de evaluación):** (1) score inválido (bool, no numérico, no finito, fuera de [0,1]) o uncertainty fuera de {low, med, high} → `invalid_input`; (2) uncertainty `high` → `needs_review` (aunque el score sea 0.95); (3) score menor que 0.40 → `abstain`; (4) score menor que 0.80 → `needs_review`; (5) resto → `accept_pair`. Los límites **0.40** y **0.80** son exactos: 0.399 → abstain; 0.4 → needs_review; 0.799 → needs_review; 0.8 con uncertainty no-high → accept_pair. No «aproximes» 0.799 a accept.",
+        "**Mecanismo (orden de evaluación):** la función `decide_ops_status(score, uncertainty)` recorre cinco reglas en orden y devuelve el primer estado que aplica:",
+        "",
+        "| # | Condición | Estado |",
+        "|---|-----------|--------|",
+        "| 1 | score inválido (bool, no numérico, no finito, fuera de [0,1]) o uncertainty ∉ {low, med, high} | `invalid_input` |",
+        "| 2 | uncertainty = `high` (aunque el score sea 0.95) | `needs_review` |",
+        "| 3 | score < 0.40 | `abstain` |",
+        "| 4 | score < 0.80 | `needs_review` |",
+        "| 5 | resto | `accept_pair` |",
+        "",
+        "Los límites **0.40** y **0.80** son exactos. Ejemplos: 0.399 → `abstain`; 0.4 → `needs_review`; 0.799 → `needs_review`; 0.8 con uncertainty ≠ high → `accept_pair`. No «aproximes» 0.799 a `accept_pair`.",
```

### Diff 5 — Split the three CASE examples (P38) into a list and wrap pseudonyms in backticks (HIGH priority, fixes issues #5 and #12)

```diff
--- a/src/lib/course/sections/s13-rpa-automation.ts
+++ b/src/lib/course/sections/s13-rpa-automation.ts
@@ -314,7 +314,11 @@
-        "**Casos trabajados (mínimo tres):** CASE-1 `A*** Q***` con ER 0.92 y REL 0.41 (identidad fuerte, relación moderada); CASE-2 `L*** H***` con ER medio y REL más alto — el revisor ve la tensión **sin** auto-etiqueta de parentesco; CASE-3 `M*** R***` con ER 0.77 y REL 0.22 (banda de duda / cola clerical). Los tres aparecen en el demo iDo y en el scaffold de teoría.",
+        "**Casos trabajados (mínimo tres):**",
+        "- **CASE-1** `A*** Q***` — ER 0.92, REL 0.41: identidad fuerte, relación moderada.",
+        "- **CASE-2** `L*** H***` — ER medio, REL más alto: el revisor ve la tensión **sin** auto-etiqueta de parentesco.",
+        "- **CASE-3** `M*** R***` — ER 0.77, REL 0.22: banda de duda / cola clerical.",
+        "",
+        "Los tres aparecen en el demo I Do y en el scaffold de teoría.",
@@ -313,7 +313,7 @@
-        "**Mecanismo de privacidad en UI:** **pseudonimiza** nombres (`A*** Q***`). Reutiliza la política de egress de S12: no mandes PII cruda a un geocoder público. La ficha muestra `entity_resolution_score` **y** `relationship_signal_score` en campos **separados**. Si los mezclas en un solo número sin etiqueta, rompes el gate ético: el revisor ya no sabe si «0.7» es identidad o familiaridad operativa.",
+        "**Mecanismo de privacidad en UI:** **pseudonimiza** nombres (por ejemplo `A*** Q***`). Reutiliza la política de egress de S12: no mandes PII cruda a un geocoder público. La ficha muestra `entity_resolution_score` **y** `relationship_signal_score` en campos **separados**. Si los mezclas en un solo número sin etiqueta, rompes el gate ético: el revisor ya no sabe si «0.7» es identidad o familiaridad operativa.",
```

### Diff 6 — Fix anglicisms (MEDIUM priority, fixes issues #7–#10, #21)

```diff
--- a/src/lib/course/sections/s13-rpa-automation.ts
+++ b/src/lib/course/sections/s13-rpa-automation.ts
@@ -125,7 +125,7 @@
-        "**Mecanismo — fórmula canónica N1:** `rel = 0.5*shared_phone + 0.3*geo_close + 0.2*surname_jaccard` (pesos fijos en el memo del curso). La distancia de par es **bilateral**: ambos registros deben reportar el mismo `km` sintético y `km ≤ 2.0` (reutiliza la geoseñal de S12). En ejercicios de práctica puedes usar una **variante** (p. ej. solo geo+apellido 0.6/0.4) **si** la instruction lo declara; no inventes una tercera fórmula sin etiquetarla.",
+        "**Mecanismo — fórmula canónica N1:** `rel = 0.5*shared_phone + 0.3*geo_close + 0.2*surname_jaccard` (pesos fijos en el memo del curso). La distancia de par es **bilateral**: ambos registros deben reportar el mismo `km` sintético y `km ≤ 2.0` (reutiliza la geoseñal de S12). En ejercicios de práctica puedes usar una **variante** (p. ej. solo geo+apellido 0.6/0.4) **si** la consigna del ejercicio lo declara; no inventes una tercera fórmula sin etiquetarla.",
@@ -269,7 +269,7 @@
-        "**Borde y auditoría de portfolio:** grepea el repo y elimina cualquier path que setee `is_family` o `auto_fraud`. Las 9 filas de `DECISION_MATRIX` del You Do deben pasar con asserts exactos y **siempre** `auto_fraud=False` en la salida del demo. Si queda un hueco numérico entre umbrales, el gate de N1 no cierra.",
+        "**Borde y auditoría de portfolio:** busca con `grep` en el repo y elimina cualquier path que establezca `is_family` o `auto_fraud`. Las 9 filas de `DECISION_MATRIX` del You Do deben pasar con asserts exactos y **siempre** `auto_fraud=False` en la salida del demo. Si queda un hueco numérico entre umbrales, el gate de N1 no cierra.",
@@ -371,7 +371,7 @@
-        "**Mecanismo de entrega:** (1) **tests green** de ER, señales y umbrales; (2) **demo de un comando** (`python -m demo_n1_dashboard --synthetic`); (3) **runbook** con setup + playbook de incidente (token o nombre en log → `rotate_secret` / `redact_logs` / `postmortem`). Un compañero en máquina limpia debe poder reproducir la demo con el mismo fixture sintético.",
+        "**Mecanismo de entrega:** (1) **tests en verde** de ER, señales y umbrales; (2) **demo de un comando** (`python -m demo_n1_dashboard --synthetic`); (3) **runbook** con setup + playbook de incidente (token o nombre en log → `rotate_secret` / `redact_logs` / `post mortem`). Un compañero en máquina limpia debe poder reproducir la demo con el mismo fixture sintético.",
@@ -1970,7 +1970,7 @@
-        note: "Identidad vs prueba; no sobreclaim en ER",
+        note: "Identidad vs prueba; no sobreafirmes en ER",
```

### Diff 7 — Split the jobRelevance opening sentence (P50) (LOW priority, fixes issue #6)

```diff
--- a/src/lib/course/sections/s13-rpa-automation.ts
+++ b/src/lib/course/sections/s13-rpa-automation.ts
@@ -14,7 +14,7 @@
   jobRelevance:
-    "En equipos de datos de banca, telco o fintech en Perú (créditos, onboarding, compliance), el cuello de botella no es «tener un modelo»: es **saber si dos registros hablan de la misma persona** y, por separado, si hay **señales de familiaridad operativa** — sin inventar parentesco ni fraude. Un analista junior que entrega un **Familiarity Evidence Dashboard** con entity resolution determinista, scores **separados**, fichas pseudonimizadas y cola de revisión humana se vuelve confiable en la mesa de riesgo. Esta sección es la **puerta de salida N1**: cierras **CP-N1-C**, documentas la **regresión de nivel 1 (S01–S13)** y entregas artefactos **CF-1** (privacidad, demo de un comando, runbook) listos para revisión de portfolio.",
+    "En equipos de datos de banca, telco o fintech en Perú (créditos, onboarding, compliance), el cuello de botella no es «tener un modelo»: es **saber si dos registros hablan de la misma persona** y, por separado, si hay **señales de familiaridad operativa**. Y todo eso sin inventar parentesco ni fraude. Un analista junior que entrega un **Familiarity Evidence Dashboard** con entity resolution determinista, scores **separados**, fichas pseudonimizadas y cola de revisión humana se vuelve confiable en la mesa de riesgo. Esta sección es la **puerta de salida N1**: cierras **CP-N1-C**, documentas la **regresión de nivel 1 (S01–S13)** y entregas artefactos **CF-1** (privacidad, demo de un comando, runbook) listos para revisión de portfolio.",
```

### Diff 8 — Add a space after comma in "A,C→D" (LOW priority, fixes issue #11)

```diff
--- a/src/lib/course/sections/s13-rpa-automation.ts
+++ b/src/lib/course/sections/s13-rpa-automation.ts
@@ -177,7 +177,7 @@
-        "**Ancla:** transacciones directas A↔B y **contrapartes comunes** (A y C pagan a D) son evidencia de **relación operativa** en el grafo sintético — no de colusión, lavado ni cartel. El revisor ve *quién pagó a quién* en la ficha; el producto **organiza evidencia** y **nunca** acusa.",
+        "**Ancla:** transacciones directas A↔B y **contrapartes comunes** (A y C pagan a D) son evidencia de **relación operativa** en el grafo sintético — no de colusión, lavado ni cartel. El revisor ve *quién pagó a quién* en la ficha; el producto **organiza evidencia** y **nunca** acusa.",
@@ -180,7 +180,7 @@
-        "**Caso trabajado:** A↔B con 2 txs y A,C→D → lista `[{type: direct_tx, … n:2}, {type: common_counterparty, via:['D']}]` y `collusion_claim=False` fijo en el demo. El disclaimer en UI y runbook es obligatorio: *common counterparty ≠ collusion claim*.",
+        "**Caso trabajado:** A↔B con 2 txs y A, C→D → lista `[{type: direct_tx, … n:2}, {type: common_counterparty, via:['D']}]` y `collusion_claim=False` fijo en el demo. El disclaimer en UI y runbook es obligatorio: *common counterparty ≠ collusion claim*.",
```

### Diff 9 — Minor self-check wording (LOW priority, fixes issue #19)

```diff
--- a/src/lib/course/sections/s13-rpa-automation.ts
+++ b/src/lib/course/sections/s13-rpa-automation.ts
@@ -1889,7 +1889,7 @@
-        question: "En zona gris de score el sistema debe…",
+        question: "En la zona gris del score el sistema debe…",
```

---

## 8. Recommended Priority Order for Fixing

1. **H — Diff 1:** Replace the wrong-section interactive editor sample in `SectionView.tsx`. This is the only issue learners see on the live page; it actively teaches the wrong topic.
2. **H — Diffs 3, 4, 5:** Split the three run-on theory paragraphs (P4, P32, P38). These are the cognitive-load ceiling of the section.
3. **M — Diff 6:** Fix the five anglicisms (`instruction`, `grepea`, `setee`, `tests green`, `postmortem`, `sobreclaim`).
4. **M — Diff 2 (optional):** Rename `id: "rpa-automation"` → `id: "evidence-dashboard"` and the matching file. This is the long-term cleanliness fix; short-term, the dictionary key in Diff 1 already works because we kept the id as-is.
5. **L — Diffs 7, 8, 9:** Split the `jobRelevance` opening, add the missing space after comma in `A,C→D`, and tidy the self-check wording.
6. **L — Diff 5 (continued):** Wrap `A*** Q***` in backticks throughout the dashboard sub-section so the live Markdown renderer stops stripping the asterisks.

---

## 9. Graph Memory Update notes (for the shared context files)

- **Section 13 node:** id `"rpa-automation"` (stale — see Diff 2), title "Familiarity Evidence Dashboard y cierre de nivel", phase 0, level "Intermedio", 19 h. Cierre de Nivel 1.
- **Edges (backward):** S12 (egress policy, HTTP/SQL/geo reused), S11 (`RelationshipEvidence` spirit), S01–S13 (regression matrix rows), S10 (CLI structure reused for demo command), S07 (Unicode/email/teléfono contracts).
- **Edges (forward):** S14 (sklearn/NumPy excluded), S15 (Pandas excluded), S30 (probabilistic ER deferred), Streamlit / design system deferred.
- **Quality edges (composite score 8.0/10):** Pedagogy 9/10, Redaction 7/10, Meta-leak 5/10 (one HIGH leak in shared editor), Consistency 8/10 (id mismatch), Exercises 9/10, Self-check 9/10, Rubric 10/10.
- **Refrain nodes (spaced repetition):** `señal ≠ parentesco`, `FP ≠ fraude`, `no auto_fraud / no is_family`, `fail-closed`, `common counterparty ≠ collusion claim`. These appear in theory, callouts, I-Do, We-Do, You-Do, self-check — correct reinforcement.
- **Known false positives in grammar tooling:** `MORFOLOGIK_RULE_ES` flags ~22 tech identifiers as Spanish misspellings (ER, score, gate, uncertainty, runbook, REL, PII, auto_fraud, is_family, high, med, low, bullets, portfolio, etc.). These are intentional code identifiers in backticks and should be added to a project-level Spanish dictionary or whitelist.
- **Run-on hotspots:** P4 (glossary), P32 (5-step matrix), P38 (3 CASEs), P50 (jobRelevance opener). All four have proposed rewrites in §6 and proposed diffs in §7.
- **Live-rendering gotcha:** Markdown strips `***` from inline pseudonyms (`A*** Q***` → `A Q`). Wrap pseudonyms in backticks.
- **Shared-component debt:** `src/components/course/SectionView.tsx` has a `editorSamples`-style dictionary keyed by `section.id`. Any future section id rename must update this dictionary in lockstep — a refactor to `editorSamples[section.id]` lookup with a fallback (or to per-section `editorSample` field on `CourseSection`) would prevent this class of leak.

---

## 10. Method Note (Grammar / Readability Subplan)

Per the shared `_GRAMMAR_SUBPLAN.md`, the following research-backed methods were applied:

**A. Spanish readability / structure formulas**
- **Fernández-Huerta (1959):** `206.84 − 60·(syllables/word) − 1.02·(words/sentence)`. Section mean = **70.5** ("normal / bastante fácil" — appropriate for technical curriculum).
- **Szigriszt-Pazos / INFLESZ:** `206.835 − 62.3·(syllables/word) − (words/sentence)`. Section mean = **66.3** ("normal").
- **WPS (words per sentence):** section mean = **17.31** (healthy; target 15–32 for technical Spanish).
- **SPW (syllables per word):** section mean = **1.98** (Spanish average ≈ 2.0; healthy).
- A custom Spanish syllable counter was implemented (`S13_grammar.py`) with rules for `qu`/`gu`/`gü` before vowels, diphthongs (strong+weak), and hiatuses (strong+strong, weak-accented+strong).

**B. Rule-based grammar & style engine**
- **LanguageTool** (`language=es`) via the public HTTP API. One chunk of ~16 800 characters was submitted; the API returned 336 matches.
- 330 of 336 matches were `MORFOLOGIK_RULE_ES` (Spanish spell-checker) flagging tech identifiers in backticks (ER, score, gate, uncertainty, runbook, entity_resolution_score, etc.). These are documented false positives (per the subplan's "False positives on code/tech nouns" risk row) and were excluded.
- The remaining 6 real findings: `AGREEMENT_ADJ_NOUN` (1, false positive on "PII real"), `CAPITALIZATION_AFTER_QUESTION_MARK` (2, false positives on embedded interrogatives), `PUNTO_EN_ABREVIATURAS` (1, "doc" flagged as abbreviation — false positive), `COMMA_PARENTHESIS_WHITESPACE` (1, real — `A,C→D`), `ES_SIMPLE_REPLACE_MULTIWORDS_POSTMORTEM` (1, real — `postmortem` → `post mortem`).

**C. Pedagogical Spanish heuristics (offline, per-sentence)**
- Run-on > 45 w: 4 hits (P4, P32, P38, P50).
- Long 32–45 w: 4 hits (P28, P42, P43, P48).
- Missing terminal punctuation: 0.
- Missing `¿` / `¡` pair: 0 (all balanced).
- Unbalanced delimiters: 8 heuristic hits, all false positives (`|ER−REL|` math notation, `{low, med, high}` set notation).
- Repeated word (`de de`-style): 0.
- English-dominant sentence: 0 (all sentences have Spanish markers or accents).
- Meta/AI/TODO leak: 0 inside the section source file (1 HIGH leak in the shared `SectionView.tsx` editor dictionary — see §4.1).
- Gerund pile-up (≥3): 0.
- High comma density: 3 hits (P28, P32, P38).
- Paragraph = one long sentence: 2 hits (P32, P38).
- Anaphoric monotony: light — the Ancla/Mecanismo/Caso/Borde schema is a deliberate template (see issue #16).
- Space-before-punct / double space: 0.

**D. Composite section score (0–10)**
Start at 10; subtract: 1.0 (HIGH meta-leak), 0.5 (4 run-ons + 4 long sentences + 5 anglicisms), 0.3 (id/filename mismatch), 0.2 (cognitive load ceiling on P32, P38). **Final: 8.0/10.**

---

*End of report.*

**This is the complete Explorer report for Section 13. Ready for the Fixer prompt.**
