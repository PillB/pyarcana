# PyArcana — Section 10 Audit Report (S10)

**Section under audit:** Section 10 — *Módulos, packaging y CLI profesional*
**Live URL (rendered):** `https://pillb.github.io/pyarcana/#sklearn`
**Source file:** `src/lib/course/sections/s10-sklearn.ts` (2,266 lines, 97,332 bytes)
**Course index position:** 10 of 52 (Phase 0 — Fundamentos)
**Auditor:** Curriculum Auditor (general-purpose), Stanford STORM + Graph/Loop/Harness Engineering protocol
**Method scope:** Live-page navigation + repository source read + Spanish grammar/style/structure audit (Fernández-Huerta, INFLESZ, WPS/SPW, pedagogical heuristics, LanguageTool `es`).

> **Confirmed:** Section 10 in course order is `s10-sklearn.ts` (imported 10th in `src/lib/course/index.ts`). Live homepage labels it *"10 / Módulos & CLI / Paquete familiarity_core con CLI ingest/normalize/compare/report y config por precedencia"*. The source `title` is `"Módulos, packaging y CLI profesional"` and `shortTitle: "Módulos & CLI"`. Both rendered theory tab and source match exactly.

---

## 1. Section Identification & Scope

| Field | Value |
|---|---|
| `id` (routing slug) | `"sklearn"` ⚠️ meta-leak — content is NOT scikit-learn |
| `index` | 10 |
| `title` | "Módulos, packaging y CLI profesional" |
| `shortTitle` | "Módulos & CLI" |
| `tagline` | "Paquete familiarity_core con CLI ingest/normalize/compare/report y config por precedencia" |
| `estimatedHours` | 18 |
| `level` / `phase` | Intermedio / 0 (Fundamentos) |
| Topics (T1–T4) | Módulos & namespaces (T1-A/B) · Layout src + SemVer (T2-A/B) · argparse + stdio (T3-A/B) · Config por precedencia + secretos (T4-A/B) |
| Tabs audited | Theory (9 subtopics × paragraphs + code + callouts) · I Do (8 demos) · We Do (24 exercises = 8 subtopics × 3 levels) · You Do (full project bootstrap) · Self-check (6 MCQs) · Resources (docs/books/courses) |
| Prose items extracted | 267 learner-facing strings |
| Sentences analyzed | 368 |

---

## 2. Executive Summary of Quality

**Composite score: 7.3 / 10**

**Verdict:** Section 10 is **technically solid and pedagogically well-structured** — the I Do / We Do / You Do scaffold is faithfully implemented, progressive disclosure is observed across T1→T4, and the connective tissue to S08 (ETL/CSV), S09 (logs/exits) and forward to S11 (OOP) is explicit and well-mapped. The Spanish prose is grammatical, the sentence-length distribution is healthy (mean WPS ≈ 12.9, only 3 sentences >32 words, zero run-ons >45), and the Fernández-Huerta mean (73.8) sits in the *fácil / bastante fácil* band — appropriate for a technical module.

The score is held back by three concrete defect classes:

1. **Section-identity meta-leak (HIGH).** The file name `s10-sklearn.ts`, the routing `id: "sklearn"`, the live URL `https://pillb.github.io/pyarcana/#sklearn`, and an inline developer comment *"Platform id `sklearn` is legacy stable for routing only — never surface to learners."* all coexist with content about **packaging & CLI** (zero scikit-learn coverage). The comment claims learners won't see it; in practice the URL hash leaks it directly. The same pattern recurs in S11 (`s11-testing.ts` / `id: "testing"` / actual title "OOP y modelo de dominio"), suggesting a systemic legacy-naming issue.
2. **Internal taxonomy leaked into learner prose (HIGH).** The internal code `CASO-LIM-010` appears 31× in the file (15× inside We Do `instruction:` strings visible to learners; the rest inside starter-code comments). The internal subtopic IDs `S10-T1-A … S10-T4-B` are repeated 24× inside `instruction:` strings as prefixes like *"E1 (guiado) · S10-T1-A — Implementa…"*. Learners have no glossary entry for `CASO-LIM-010` or `S10-T*`; these are authoring tags, not pedagogical labels.
3. **Localized grammar / concordance micro-defects (LOW–MEDIUM).** A handful of real Spanish-grammar issues survived editing: gender agreement (`documentada y testeable` vs `documentado`), the `o` → `u` rule before *hola* (`o Hola` → `u Hola`), missing comma before *pero* (`OK pero` → `OK, pero`), capitalization after `?` (`? stdout =` → `? Stdout =`), and a debatable `un API` vs `una API`. None block comprehension; all are quick wins.

The other dimensions — exercise alignment, rubric coherence, resource curation, secret/PII posture, exit-code pedagogy, fail-closed discipline — are **above average for the course** and align with external best practice (Real Python application layouts, PyPA sampleproject, SemVer spec).

---

## 3. Detailed Issue Registry

> Severity scale: **H** = blocks learning or violates privacy/clarity contract · **M** = degrades quality or rhythm · **L** = polish / consistency.

### Meta-leak & identity issues

| # | Sev | Location (line in `s10-sklearn.ts`) | Evidence | Impact |
|---|---|---|---|---|
| 1 | **H** | Line 4 (dev comment) + Line 5 (`id: "sklearn"`) + live URL `#sklearn` | `// Platform id `sklearn` is legacy stable for routing only — never surface to learners.` followed by `id: "sklearn",` | The URL hash `#sklearn` is shown to every learner who opens Section 10. The comment explicitly promises this won't happen. A learner Googling "sklearn" + reading the URL may believe they are in a scikit-learn section about to be loaded; or, on a refresh, may think the routing is broken. Pedagogically confusing and a clear contract violation. |
| 2 | **H** | Filename `src/lib/course/sections/s10-sklearn.ts` | File named `s10-sklearn` while title is "Módulos, packaging y CLI profesional" | Developer/maintainer confusion, perpetuates misnaming, makes grep/audit harder. Same pattern in S11 (`s11-testing.ts` for OOP) — systemic. |
| 3 | **H** | We Do instructions (15×) — e.g. line 621, 667, 719, 778, 835, 882, 941, 981, 1022, 1077, 1216, 1275, 1313, 1388, 1850 | `"...(`CASO-LIM-010`): `clean` debe colapsar espacios..."` | Internal case-management tag `CASO-LIM-010` is shown verbatim to learners. There is no glossary entry; learners don't know if it's a course code, a ticket ID, or a Python module. Adds cognitive noise to every We Do instruction. |
| 4 | **H** | We Do instructions (24×, one per exercise) | `"E1 (guiado) · S10-T1-A — Arregla el módulo del starter…"` | Internal subtopic ID `S10-T1-A` is shown verbatim. Learners see `S10-T1-A` repeatedly but the `subtopicId` field is the *authoring* taxonomy, not the *learner-facing* label. The heading ("Imports, namespaces y __main__") is the right learner-facing label. |
| 5 | **M** | We Do intro (line 614) | `"...cada starter trae un defecto marcado con `# DEFECT`."` | The `# DEFECT` marker is intentional scaffolding (starters contain `# DEFECT:` comments), but the phrasing reads like an internal note. A learner new to the course has no contract that `# DEFECT` is a stable signal across sections. |
| 6 | **L** | Theory callout title (line 188) | `"Hacia S11"` (callout under "Versionado y compatibilidad") | Mild forward-reference; fine, but inconsistent with other callouts that don't carry section refs in their title. Cosmetic. |

### Grammar, concordance & typographic issues (real LanguageTool findings)

| # | Sev | Location | Evidence (quote) | Impact / Fix |
|---|---|---|---|---|
| 7 | **M** | `weDo.steps[5]` hint (line 580) | `"Precedencia flags > env > default documentada y testeable."` | Gender agreement: `default` is treated as masculine loanword in tech Spanish ("el default"), so the postposed adjective should be masculine: `documentado y testeable`. LT: `AGREEMENT_POSTPONED_ADJ`. |
| 8 | **M** | `weDo.steps[S10-T1-A-E2]` feedback (line 675) | `"Si sale hola:b primero o Hola sin casefold, los sufijos siguen invertidos…"` | Rule `o` → `u` before words starting with /o/ sound (incl. *ho-*): "o Hola" → "u Hola". RAE DPD *o*. LT: `Y_E_O_U`. |
| 9 | **M** | `weDo.steps[S10-T3-A-E2]` instruction (line 1313) | `"…si el parse es OK pero runtime_ok es False → 1; éxito → 0."` | Comma before adversative *pero* joining two clauses: `OK, pero`. LT: `COMMA_PERO`. |
| 10 | **L** | `selfCheck.questions[3].explanation` (line 2180) | `"stdout = datos (JSON/CSV) para pipes; stderr = progreso y diagnóstico. Un `print('ok')` extra en stdout rompe al consumidor del pipe."` (preceded by question "¿Dónde van los logs de progreso?") | After `?` the following sentence should start with a capital letter or be joined by a comma/colon. LT: `CAPITALIZATION_AFTER_QUESTION_MARK`. Either `? Stdout = datos…` or `?, stdout = datos…`. |
| 11 | **L** | `theory[5].paragraphs[0]` (line 161) | `"**SemVer** simple: MAJOR.MINOR.PATCH. Breaking → major; feature compatible → minor; fix → patch."` | Latin/English fragments without Spanish anchor — readable, but mixes English-only sentences into the Spanish flow. Could be `Breaking → major; feature compatible → minor; fix → patch.` → `*Breaking* (cambio incompatible) → major; *feature* compatible → minor; *fix* (corrección) → patch.` LT: english-dominant. |
| 12 | **L** | `theory[8].paragraphs[0]` (line 320) | `"El ETL local de este nivel **no inventa un API token**."` | `API` in Spanish is feminine (RAE: *la API*). Debatable in tech jargon, but `una API token` (or even better, `un token de API`) is more correct. LT: `AGREEMENT_DET_NOUN`. |
| 13 | **L** | `iDo.steps[S10-T3-B-DEMO].why` (line 555) and others | `"FAMILIARITY_LOG_LEVEL vs --log-level: gana el flag."` | Spanish `vs.` should keep the period (RAE: prefer `frente a` or `vs.`). LT: `PUNTO_EN_ABREVIATURAS`. |
| 14 | **L** | `selfCheck.questions[1].explanation` (line 2166) | `"Canónica en ops: flags CLI > variables de entorno > archivo > defaults."` | "Canónica en ops" reads as a fragment; better: `"Es canónica en ops: flags CLI > variables de entorno > archivo > defaults."` or `"La precedencia canónica en ops es: flags CLI > …"`. Pedagogical clarity. |
| 15 | **L** | `theory[6].paragraphs[1]` (line 197) | `"Exit codes: **0** éxito, **2** uso/CLI inválido (argparse default), **1** error de runtime/negocio."` | Reads as a count (one éxito). LT suggests `0 éxitos` (AGREEMENT_NUMERAL_PLURAL). Better as equation form: `**0** = éxito; **2** = uso/CLI inválido; **1** = error de runtime/negocio.` |
| 16 | **L** | `theory[6].code` `try_parse` docstring (line 217) | `"""0 = parse OK; 2 = uso inválido (argparse)."""` | Code comment in English. The course standard for learner-facing prose is Spanish; in-line docstrings shown to learners should be Spanish (`# parse OK`/`# uso inválido`). Minor. |

### Sentence-length / readability issues

| # | Sev | Location | Metric | Evidence | Fix |
|---|---|---|---|---|---|
| 17 | **M** | `weDo.steps[S10-T1-A-E3].instruction` (line 719) | FH = 23.6 (muy difícil) · 62 words · 4 sentences | `"E3 (transferencia) · S10-T1-A — Implementa `recommend_import_style(kind)` con kinds estructurados (`CASO-LIM-010`): `same_package` → relativo/absoluto del paquete; `external_plugin` → import absoluto del paquete instalado; `run_cli` → `python -m familiarity_core`. Imprime etiqueta -> estilo. Salida esperada exacta:\nnormalize.py importa compare en el mismo paquete -> relativo o absoluto del paquete (from . import compare)\nplugin externo usa familiarity_core -> absoluto (import familiarity_core)\nejecutar el CLI del paquete -> python -m familiarity_core"` | Split: move the three example lines into a fenced output block; strip `CASO-LIM-010` and `S10-T1-A` from prose; rewrite as 2 sentences of ≤25 words each. |
| 18 | **M** | `weDo.steps[S10-T2-A-E3].instruction` (line 1022) | FH = 49.4 · 70 words · 2 sentences (one is 40 words) | `"E3 (transferencia) · S10-T2-A — Implementa `diagnose_mnf(facts)` que inspecciona un dict de hechos post-install (`CASO-LIM-010`): (1) `installed` falso → falta `pip install -e .`; (2) `import_name` ≠ `package_dir` → nombre de import distinto de la carpeta; (3) `shadowing_script` verdadero → script en cwd tapa el paquete en sys.path. Salida esperada exacta: …"` | Convert the `(1)/(2)/(3)` inline list to a real markdown list; drop `CASO-LIM-010`; the long sentence becomes three short ones. |
| 19 | **M** | `weDo.steps[S10-T3-A-E2].instruction` (line 1313) | 56 words · 2 sentences (one is 30 words) | `"E2 (independiente) · S10-T3-A — Implementa `run_cli(argv, runtime_ok=True)`: parsea con argparse (subcomando `normalize` requerido); captura `SystemExit` de usage → **2**; si el parse es OK pero runtime_ok es False → **1**; éxito → **0**."` | Split on the `;` chain — two sentences; add comma before `pero` (Issue #9). |
| 20 | **L** | `theory[2].paragraphs[2]` (line 48) | 48 words · 2 sentences (one is 35 words) | `"Los **imports circulares** se rompen extrayendo un tercer módulo compartido, con lazy import o invirtiendo la dirección de dependencias. **Prefiere diseño a hacks**: si A y B se necesitan mutuamente, el util común es el primer recurso — no `import` dentro de cada método salvo como último recurso documentado."` | The second sentence (35 words) is the hardest in the theory. Split: `**Prefiere diseño a hacks**: si A y B se necesitan mutuamente, el util común es el primer recurso. Evita `import` dentro de cada método salvo como último recurso documentado.` |

### Pedagogical / structural issues

| # | Sev | Location | Evidence | Impact / Fix |
|---|---|---|---|---|
| 21 | **M** | You Do requirement 7 (line 1915) | `"ingest ejecuta ETL CSV real: Decimal desde texto, clean/quarantine y manifest por fuente reconciliado"` | The You Do asks for a real CSV ingest (Decimal parsing, quarantine, manifest) — but this is significantly more work than the We Do exercises that preceded it. The cognitive jump from "implement a 4-symbol facade" to "real ETL with reconciliation" is steep. Either soften the language ("versión simplificada de ingest del S08") or add a "what to copy from S08" pointer. |
| 22 | **M** | We Do intro (line 614) | `"Andamiaje: **E1 guiado → E2 independiente → E3 transferencia** × 8 subtemas (24 ejercicios, 2 hints c/u)."` | "× 8 subtemas" notation is fine but "2 hints c/u" reads as informal abbreviation. Also the scaffolding order "E1 → E2 → E3" is repeated verbatim in every We Do exercise prefix — repetition is intentional (anchoring) but the prefix label `"E1 (guiado) · S10-T1-A —"` (Issue #4) bloats every instruction. Replace the prefix with a cleaner tab/badge label. |
| 23 | **M** | Theory callout consistency (lines 35-40, 71-76, 104-109, 150-155, 185-190, 237-242, 274-279, 309-314, 346-351) | Callout `type` field uses values `info`, `tip`, `warning`, `danger`. Theory has 9 callouts (one per subtopic) — good. But the *titles* mix languages: `"stdlib first"`, `"python -m"`, `"No exportes _internals"`, `"Hacia S11"`, `"Ayuda humana"`, `"Contaminación de stdout"`, `"None vs missing"`, `"Secretos"`, `"CP-N1-B empaquetado / base CP-N1-C"`. | Inconsistent capitalization + language mixing. Standardize on Spanish, sentence case: `"Biblioteca estándar primero"`, `"python -m"`, `"No exportes _internals"`, `"Hacia S11"`, `"Ayuda humana"`, `"Contaminación de stdout"`, `"None vs. missing"`, `"Secretos"`, `"CP-N1-B empaquetado / base CP-N1-C"`. |
| 24 | **L** | `youDo.requirements` (lines 1909-1917) — 8 requirements, only the last 2 are testable contracts | `"python -m unittest discover -s tests pasa en un checkout limpio"` is the only objective gate. Others (`"pip install -e . funciona en entorno limpio (documentado)"`) are subjective. | Tighten: convert `"funciona en entorno limpio (documentado)"` to a checklist item the learner can verify, or specify the exact env (Python 3.11+, fresh venv, no extras). |
| 25 | **L** | Self-check question 2 (line 2162) | Options mix English fragment `"flags > env > file > defaults"` directly. | Acceptable in a tech MCQ, but the *distractor* `"defaults > flags > env > file"` could be made more tempting with a Spanish gloss ("el archivo siempre gana") to test understanding, not just memory. |

### Consistency with roadmap & adjacent sections

| # | Sev | Location | Evidence | Impact |
|---|---|---|---|---|
| 26 | **L** | Theory T2-B callout (line 188-190) | `"En S11 modelarás entidades de dominio (p. ej. un futuro `ClientRecord`). Si renombras un tipo o firma pública del paquete, es breaking: documenta migración y sube major."` | Forward reference to S11 is appropriate. *But* S11's `id` is `"testing"` and its title is "OOP y modelo de dominio" — so a learner clicking "S11" expecting testing will be confused. Systemic with Issue #1. |
| 27 | **L** | Theory T1 intro (line 30-33) | `"Hasta S09 tu lógica vive en scripts y módulos sueltos."` | Correct, but S09's actual title is "Excepciones & logs" (per live homepage). The source `title` of S09 should match — let the learner confirm. (No action if S09 source matches homepage.) |
| 28 | **L** | `learningOutcomes[0]` (line 18) | `"Organizar imports, evitar ciclos y usar if __name__ == '__main__'"` | Outcome contains raw Python code `if __name__ == '__main__'` — fine for a learning-outcome statement in a Python course, but the rendering may show it as plain text rather than code. Verify the renderer applies code styling to backticked text inside outcome strings. |

### Comparison with best-in-class external materials

| Aspect | PyArcana S10 | External gold standard | Verdict |
|---|---|---|---|
| src layout + pyproject | Covered (T2-A) with `pip install -e .` | PyPA Packaging User Guide, Real Python application layouts | ✓ Aligned; PyPA sampleproject is even cited. |
| argparse subcommands + exit codes | Covered (T3-A) with `0/1/2` | `argparse` docs, Unix `sysexits.h`, Click/Typer | ✓ Aligned; stdlib-first is the right pedagogical call for N1. |
| stdout/stderr discipline | Covered (T3-B) with pipe example | "The Twelve-Factor App" logs, CLIG conventions | ✓ Strong; matches industry practice. |
| Config precedence (flags > env > file > defaults) | Covered (T4-A) | 12-Factor App, `python-decouple`/`dynaconf` docs | ✓ Aligned; "None = no pasado" is a nice pedagogical simplification. |
| Secret hygiene | Covered (T4-B) with `.env`/`.gitignore` | GitGuardian, 12-Factor, S09 carry-over | ✓ Strong; `.env.example` template pattern is well explained. |
| SemVer | Covered (T2-B) with `bump()` | semver.org | ✓ Cited; minor/major/patch decision tree is clear. |
| Circular imports | Covered (T1-A) with "extract shared util" | Python docs `importlib`, Real Python | ✓ Standard advice; "lazy import as last resort" is correctly framed. |
| **Gap**: `console_scripts` entry point | Mentioned in You Do README (line 1937) but not in theory | PyPA entry-points spec | △ Could be a T2 callout; learners see `familiarity = "familiarity_core.cli:entrypoint"` in the bootstrap with no prior explanation. |
| **Gap**: `__main__.py` for `python -m pkg` | Mentioned in T1-A callout (line 75) and You Do (line 2090-2094) | Python docs `__main__` | △ Callout mentions the *behavior* but not the *file*; learners see `__main__.py` in the You Do bootstrap without theory coverage. |
| **Gap**: `MANIFEST.in` / `package-data` | Not covered | PyPA packaging | ✓ Acceptable scope cut for N1; declared out of scope ("stdlib first"). |

---

## 4. Meta-Leak Report (exact leaked text + location)

### ML-1: Section-identity dev comment + URL slug (HIGH)

**File:** `src/lib/course/sections/s10-sklearn.ts`, lines 3–5
```ts
export const section10: CourseSection = {
  // Platform id `sklearn` is legacy stable for routing only — never surface to learners.
  id: "sklearn",
```

**Surfaced to learner via:** URL hash `https://pillb.github.io/pyarcana/#sklearn` (verified by direct browser navigation; clicking the Section 10 card on the homepage produces this hash).

**Why it leaks:** The dev comment explicitly promises "never surface to learners", but the live site's hash router uses the `id` field verbatim. Any learner who copies/shares the URL or watches the address bar sees `#sklearn` for a section whose content is packaging & CLI (zero scikit-learn content). This also affects S11 (`s11-testing.ts`, `id: "testing"`, real title "OOP y modelo de dominio") and likely other sections — systemic legacy naming.

### ML-2: `CASO-LIM-010` internal tag in learner prose (HIGH)

**File:** `src/lib/course/sections/s10-sklearn.ts` — 31 total occurrences; 15 inside `instruction:` strings rendered to learner.

**Exact samples (verbatim from source, with surrounding context):**

Line 621 (We Do S10-T1-A-E1):
```
"E1 (guiado) · S10-T1-A — Arregla el módulo del starter (`CASO-LIM-010`): `clean` debe colapsar espacios, hacer casefold y exportarse en `__all__` (no exportes helpers con `_`). Salida esperada exacta:\n['clean']\nx"
```

Line 1022 (We Do S10-T2-A-E3):
```
"E3 (transferencia) · S10-T2-A — Implementa `diagnose_mnf(facts)` que inspecciona un dict de hechos post-install (`CASO-LIM-010`): (1) `installed` falso → falta `pip install -e .`…"
```

Also present inside starter code comments, e.g. line 633:
```python
# CASO-LIM-010 · clean + __all__
```

**Why it leaks:** `CASO-LIM-010` looks like a ticket ID, internal case-management code, or release tag. There is no entry in the glossary, the course intro, or the section's own `intro`/`why` explaining what it means. Learners encounter it in 15 of 24 We Do exercises. Even if it's an authoring anchor (probably "caso límite 010" = boundary-case 010), surfacing it adds zero pedagogical value and violates the "pure teacher voice" rule.

### ML-3: `S10-T1-A … S10-T4-B` subtopic IDs in learner prose (HIGH)

**File:** 96 occurrences of `S10-T` pattern in source; of those, 24 appear inside `instruction:` strings (one per We Do exercise), repeated as a prefix: `"E1 (guiado) · S10-T1-A — …"`, `"E2 (independiente) · S10-T1-A — …"`, `"E3 (transferencia) · S10-T1-A — …"`, etc.

**Why it leaks:** `S10-T1-A` is the value of the `subtopicId` field (authoring taxonomy). The learner-facing label for the same subtopic is the `heading` field ("Imports, namespaces y __main__"). The instruction strings duplicate the internal ID into learner-facing text instead of using the heading or a human label like "T1 · Imports".

### ML-4: `# DEFECT` marker mentioned in We Do intro (MEDIUM)

**File:** Line 614
```
"…cada starter trae un defecto marcado con `# DEFECT`."
```

**Why it's borderline:** The starter code DOES contain `# DEFECT:` comments, so this is intentional scaffolding to teach learners to scan for the bug. But the phrasing reads like an internal QA note. Better: `"...cada starter trae un bug marcado con el comentario `# DEFECT:` al inicio de la línea defectuosa; corrígelo y verifica con la salida esperada."`

### ML-5: dev comment "legacy stable for routing only" (covered in ML-1)

Same comment as ML-1; counted once.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do fidelity

**I Do (8 demos):** ✓ Excellent. One demo per subtopic (T1-A, T1-B, T2-A, T2-B, T3-A, T3-B, T4-A, T4-B), each with `description`, `code`, `output`, and `why`. The `why` field is consistently present and explains the pedagogical motivation in one sentence ("La lógica vive en normalize; el entrypoint solo orquesta."). This is best-practice I Do.

**We Do (24 exercises = 8 × 3):** ✓ Strong. Each subtopic has E1 (guiado), E2 (independiente), E3 (transferencia), with progressive removal of scaffolding. Each exercise has `instruction`, `hint`, `hints[]` (2 progressive), `edgeCases[]`, `tests` (executable contract), `feedback` (common-pitfall message), `starterCode`, `solutionCode`. This is best-practice We Do.

**You Do (full project bootstrap):** ✓ Excellent. A real, runnable `bootstrap_familiarity.py` script that creates a full package layout (pyproject.toml + src/familiarity_core/{__init__,config,core,cli,__main__}.py + tests/test_core.py + README.md). The rubric has 6 weighted criteria. The `portfolioNote` is concrete (capture --help, exit codes, pipe example).

**Self-check (6 MCQs):** ✓ Good. Each question has 4 options, `correctIndex`, and `explanation`. The explanations are 1-2 sentences and reinforce the rule (e.g., "0 = éxito, 1 = runtime, 2 = uso inválido").

### 5.2 Connective tissue and narrative flow

**Backward references (anchoring):** ✓ Strong. T1-A intro references S09 (scripts sueltos). T2-A references CP-N1-B (S08). T2-B references S11 forward. T4-B references S09 (PII/logs). Each reference is concrete and helps the learner build a graph.

**Forward references:** ✓ T2-B callout "Hacia S11" prepares the learner for OOP dominio. We Do S10-T2-B-E3 (`policy_for`) explicitly mentions `ClientRecord` from S11 — strong forward contract.

**Within-section flow:** ✓ T1 → T2 → T3 → T4 with explicit "Orden:" callout in the intro. Each subtopic heading is descriptive ("Imports, namespaces y __main__") rather than abstract ("T1-A").

**Anaphoric variety:** Manual scan shows varied sentence starts ("Hasta S09…", "Integra el ETL…", "Orden:", "Layout **src/**:", "`pip install -e .`…"). No anaphoric monotony detected.

### 5.3 Cognitive load & progressive disclosure

**Strengths:**
- Each theory subtopic has 3 paragraphs (intro, mechanism, edge case) — consistent schema, low surprise.
- Each subtopic has 1 code example (small, single-file simulation) — keeps cognitive load bounded.
- Each callout has a single message + 1-sentence content — scannable.
- I Do demos are small (≤15 lines each).
- We Do starters are small (≤20 lines each) with a single `# DEFECT` line to fix.

**Weaknesses:**
- We Do instructions pack 30–70 words each (Issues #17, #18, #19) — borderline for cognitive load.
- The `instruction` field embeds the expected output (`"Salida esperada exacta:\n…"`) inline as a multi-line string — this is correct for the contract but visually dense. A separate `expectedOutput` field would let the renderer format it as a code block.

### 5.4 Exercise and exam quality

- **We Do contract:** Each `tests` field is the same boilerplate: *"Contrato ejecutable: corre exactamente los casos visibles del starter; exit 0 y sin traceback; stdout conserva el orden, etiquetas y valores exigidos por la instrucción, sin líneas extra."* This is a strong, testable contract. ✓
- **Hints progression:** Each exercise has `hint` (1-line summary) + `hints[]` (2 progressive). ✓
- **Feedback:** Each `feedback` is a specific diagnostic ("Si same_package devuelve el estilo de plugin, el match por kind está invertido…"). ✓ Excellent — concrete, not generic.
- **Edge cases:** Each `edgeCases[]` is 1 item, a real edge case ("Evita manipular sys.path a mano en prod", "venv incorrecto es otra causa clásica"). ✓
- **Self-check MCQs:** Distractors are plausible. ✓
- **Rubric:** 6 criteria, weights sum to 100% (25+20+20+15+10+10). ✓

### 5.5 Redaction quality

- **Tone:** Direct, second-person ("empaquetas", "implementa", "valida"). ✓ Consistent teacher voice.
- **Code-switching:** Frequent English tech terms (`starter`, `default`, `flag`, `runtime`, `wrapper`, `pipe`) without Spanish gloss. Acceptable in tech LATAM Spanish but borders on excessive in some paragraphs. Recommend adding Spanish gloss on first use.
- **Bold/markdown usage:** Bold used for emphasis on key terms (`**familiarity_core**`, `**__main__**`, `**Fail-closed**`). ✓ Consistent.
- **Em-dashes:** Used frequently ("—") as parenthetical separator. ✓ Spanish-appropriate.
- **Inconsistent capitalization in callout titles:** see Issue #23.

---

## 6. Grammatical Improvements — Paragraph-by-Paragraph Rewrite (Theory, I Do, We Do, You Do, Self-Check)

> Method: for each prose-bearing field, the audit produces **Before** (verbatim) → **After** (proposed rewrite). Rewrites preserve all factual/technical content; they fix grammar, concordance, sentence length, meta-leak, and clarity. Inline code spans (`...`) are preserved.

### 6.1 Theory tab

#### T1-A intro (lines 30–33)

**Before:**
> Hasta S09 tu lógica vive en scripts y módulos sueltos. Aquí empaquetas **familiarity_core**: imports estables, **pyproject.toml**, **CLI** con subcomandos y **config por precedencia** — la herramienta que el equipo puede `pip install -e .` y correr sin notebook.

**After:**
> Hasta S09 tu lógica vive en scripts y módulos sueltos. Aquí empaquetas **familiarity_core**: imports estables, **pyproject.toml**, **CLI** con subcomandos y **config por precedencia**. Es la herramienta que el equipo puede instalar con `pip install -e .` y ejecutar sin notebook.

*Change:* Split the em-dash sentence; "correr" → "ejecutar" (more standard in Peruvian tech Spanish, though "correr" is acceptable).

#### T1-A paragraph 3 (line 48)

**Before:**
> Los **imports circulares** se rompen extrayendo un tercer módulo compartido, con lazy import o invirtiendo la dirección de dependencias. **Prefiere diseño a hacks**: si A y B se necesitan mutuamente, el util común es el primer recurso — no `import` dentro de cada método salvo como último recurso documentado.

**After:**
> Los **imports circulares** se rompen extrayendo un tercer módulo compartido, usando *lazy import* o invirtiendo la dirección de dependencias. **Prefiere diseño a hacks**: si A y B se necesitan mutuamente, el util común es el primer recurso. Evita `import` dentro de cada método, salvo como último recurso documentado.

*Change:* Split long second sentence (35→18+12 words); italicize "lazy import" as foreign term.

#### T2-A paragraph 3 (line 117)

**Before:**
> Si ves `ModuleNotFoundError` post-install, revisa en este orden: (1) ¿`pip install -e .` en el venv activo?, (2) ¿el nombre de import coincide con la carpeta bajo `src/`?, (3) ¿un script homónimo en el cwd tapa el paquete en `sys.path`?

**After:**
> Si ves `ModuleNotFoundError` tras instalar, revisa en este orden: (1) ¿`pip install -e .` se ejecutó en el venv activo?; (2) ¿el nombre de import coincide con la carpeta bajo `src/`?; (3) ¿un script homónimo en el cwd tapa el paquete en `sys.path`?

*Change:* "post-install" → "tras instalar" (Spanish); move `?` inside the question and use `;` to separate items in the list (Spanish RAE punctuation for chained questions).

#### T2-B paragraph 1 (line 161)

**Before:**
> **SemVer** simple: MAJOR.MINOR.PATCH. Breaking → major; feature compatible → minor; fix → patch. En 0.x es más flexible, pero **documenta igual**. Renombrar API pública de normalizers es major para consumidores del paquete.

**After:**
> **SemVer** simple: MAJOR.MINOR.PATCH. Un cambio *breaking* (incompatible) → major; una *feature* compatible → minor; un *fix* sin cambio de contrato → patch. En 0.x es más flexible, pero **documenta igual**. Renombrar la API pública de normalizers es *major* para los consumidores del paquete.

*Change:* Spanish gloss for the English-only fragment; add articles.

#### T3-A paragraph 2 (line 197)

**Before:**
> Exit codes: **0** éxito, **2** uso/CLI inválido (argparse default), **1** error de runtime/negocio. Scripts y CI **dependen** de esto — no devuelvas siempre 0.

**After:**
> Exit codes: **0** = éxito; **2** = uso/CLI inválido (default de argparse); **1** = error de runtime/negocio. Los scripts y el CI **dependen** de esto: no devuelvas siempre 0.

*Change:* Equation form (clearer for LT and learner); add articles.

#### T3-B paragraph 1 (line 248)

**Before:**
> **stdout** = datos (JSON, CSV). **stderr** = logs y progreso. Así `cmd > out.json` **no** contamina el archivo. Un `print('ok')` extra rompe el pipe de quien parsea JSON.

**After:** (no change needed — clean)

#### T4-A paragraph 2 (line 286)

**Before:**
> Un flag `--log-level` debe ganar a `FAMILIARITY_LOG_LEVEL`. Trata `None` en flags como "no pasado" para no pisar env con nulls.

**After:**
> Un flag `--log-level` debe ganar a la variable `FAMILIARITY_LOG_LEVEL`. Trata `None` en los flags como "no pasado", para no pisar *env* con *nulls*.

*Change:* Add articles; italicize "env" / "nulls" as foreign terms.

#### T4-B paragraph 1 (line 320)

**Before:**
> Secretos **fuera del repo**: `.env` en `.gitignore`, **nunca** en logs (S09). El ETL local de este nivel **no inventa un API token**. Defaults seguros (log level INFO, no debug con PII).

**After:**
> Secretos **fuera del repo**: `.env` en `.gitignore`, **nunca** en logs (S09). El ETL local de este nivel **no inventa un token de API**. Defaults seguros (log level INFO, no debug con PII).

*Change:* "un API token" → "un token de API" (avoids the gender-agreement debate and matches the RAE-preferred noun order).

#### T4-B paragraph 3 (line 322)

**Before:**
> Fail-fast de config evita procesar 10k filas con un path mal tipeado. Mensaje de error: nombra la **clave** y el **subcomando** (`config: falta input_path para ingest`); jamás imprimas el valor de un token en traceback aunque el adaptador remoto lo tenga en memoria.

**After:** (no change needed — clean, well-structured)

### 6.2 I Do tab

#### iDo.intro (line 355)

**Before:**
> Ocho demos I Do (uno por subtema, orden T1→T4). Cada demo muestra el mecanismo que luego practicarás en We Do: módulos y API, layout/src + SemVer, argparse con exit codes, stdio limpio y config por precedencia. Solo stdlib; datos sintéticos.

**After:** (no change needed — clean)

#### iDo.steps[S10-T1-A-DEMO].why (line 381)

**Before:** `"La lógica vive en normalize; el entrypoint solo orquesta."`
**After:** `"La lógica vive en `normalize`; el entrypoint solo orquesta."` (add code span)

#### iDo.steps[S10-T3-A-DEMO].why (line 526)

**Before:** `"Subparsers + return codes hacen la CLI operable en scripts; argv inválido debe devolver 2."`
**After:** `"Los subparsers y los códigos de retorno hacen la CLI operable desde scripts; un argv inválido debe devolver 2."` (add articles, improve flow)

#### iDo.steps[S10-T4-B-DEMO].why (line 609)

**Before:** `"Validación temprana y contextual, sin exigir secretos irrelevantes al ETL local."`
**After:** `"Validación temprana y contextual, sin exigir secretos irrelevantes para el ETL local."` ("al" → "para el" — "al ETL" implies "to the ETL" but the meaning is "for the ETL")

### 6.3 We Do tab

#### weDo.intro (line 614)

**Before:**
> Andamiaje: **E1 guiado → E2 independiente → E3 transferencia** × 8 subtemas (24 ejercicios, 2 hints c/u). Usa solo stdlib y lo aprendido hasta S10; cada starter trae un defecto marcado con `# DEFECT`. Elimina líneas extra (p. ej. `ok True`); la salida debe coincidir exactamente con el contrato.

**After:**
> Andamiaje: **E1 guiado → E2 independiente → E3 transferencia** × 8 subtemas (24 ejercicios, con 2 *hints* cada uno). Usa solo la biblioteca estándar y lo aprendido hasta S10. Cada starter trae un bug marcado con el comentario `# DEFECT:` al inicio de la línea defectuosa; corrígelo y verifica con la salida esperada. Elimina las líneas extra (p. ej. `print('ok', True)`); la salida debe coincidir exactamente con el contrato.

*Changes:* "c/u" → "cada uno" (formal); "stdlib" → "la biblioteca estándar" (first-mention Spanish); rewrite `# DEFECT` explanation; expand `ok True` to `print('ok', True)` (clearer).

#### weDo.steps[S10-T1-A-E1].instruction (line 621)

**Before:**
> E1 (guiado) · S10-T1-A — Arregla el módulo del starter (`CASO-LIM-010`): `clean` debe colapsar espacios, hacer casefold y exportarse en `__all__` (no exportes helpers con `_`). Salida esperada exacta:
> ['clean']
> x

**After:**
> **E1 · T1 Imports** (guiado) — Arregla el módulo del starter: la función `clean` debe colapsar espacios, hacer *casefold* y exportarse en `__all__` (no exportes helpers con `_`). Salida esperada exacta:
> ```
> ['clean']
> x
> ```

*Changes:* Drop `S10-T1-A` internal ID; drop `CASO-LIM-010`; replace `·` separator with bold label; italicize "casefold".

#### weDo.steps[S10-T1-A-E2].feedback (line 675)

**Before:** `"Si sale hola:b primero o Hola sin casefold, los sufijos siguen invertidos o util_norm no normaliza del todo."`
**After:** `"Si sale hola:b primero u Hola sin casefold, los sufijos siguen invertidos o util_norm no normaliza del todo."` (Issue #8: `o` → `u` before *Hola*)

#### weDo.steps[S10-T2-A-E3].instruction (line 1022)

**Before:**
> E3 (transferencia) · S10-T2-A — Implementa `diagnose_mnf(facts)` que inspecciona un dict de hechos post-install (`CASO-LIM-010`): (1) `installed` falso → falta `pip install -e .`; (2) `import_name` ≠ `package_dir` → nombre de import distinto de la carpeta; (3) `shadowing_script` verdadero → script en cwd tapa el paquete en sys.path. Salida esperada exacta:
> cause: paquete no instalado (falta pip install -e .)
> cause: nombre import != nombre de carpeta (familiarity_core)
> cause: se ejecuta un script que tapa el paquete en sys.path

**After:**
> **E3 · T2 Packaging** (transferencia) — Implementa `diagnose_mnf(facts)` que inspecciona un dict de hechos tras instalar. La función devuelve la primera causa que aplique, en este orden:
>
> 1. `installed` falso → falta `pip install -e .`;
> 2. `import_name` ≠ `package_dir` → el nombre de import no coincide con la carpeta;
> 3. `shadowing_script` verdadero → un script en el cwd tapa el paquete en `sys.path`.
>
> Salida esperada exacta:
> ```
> cause: paquete no instalado (falta pip install -e .)
> cause: nombre import != nombre de carpeta (familiarity_core)
> cause: se ejecuta un script que tapa el paquete en sys.path
> ```

*Changes:* Drop `S10-T2-A` and `CASO-LIM-010`; convert inline `(1)/(2)/(3)` to markdown list (splits long sentence into three short ones — Issue #18); "post-install" → "tras instalar".

#### weDo.steps[S10-T3-A-E2].instruction (line 1313)

**Before:**
> E2 (independiente) · S10-T3-A — Implementa `run_cli(argv, runtime_ok=True)`: parsea con argparse (subcomando `normalize` requerido); captura `SystemExit` de usage → **2**; si el parse es OK pero runtime_ok es False → **1**; éxito → **0**.

**After:**
> **E2 · T3 CLI** (independiente) — Implementa `run_cli(argv, runtime_ok=True)`. Parsea con argparse (subcomando `normalize` requerido); captura el `SystemExit` de usage → **2**. Si el parse es OK, pero `runtime_ok` es False → **1**; si todo OK → **0**.

*Changes:* Drop `S10-T3-A`; split long sentence; add comma before *pero* (Issue #9); add article "el" before `SystemExit`.

#### weDo.steps[S10-T4-A-E1].hint (line 580)

**Before:** `"Precedencia flags > env > default documentada y testeable."`
**After:** `"Precedencia flags > env > default, documentada y testeable."` — **OR** the better fix: `"Precedencia flags > env > default documentado y testeable."` (Issue #7: `default` is masculine loanword).

#### weDo.steps[S10-T4-B-E1].instruction (line 1751)

**Before:**
> E1 (guiado) · S10-T4-B — Implementa `should_ignore_secret(path)` y filtra la lista candidata: ignora secretos reales; **no** ignores `.env.example` ni `README.md`. Salida esperada exacta:
> ignore: .env
> ignore: .env.*
> ignore: *.pem
> ignore: credentials.json

**After:**
> **E1 · T4 Secretos** (guiado) — Implementa `should_ignore_secret(path)` y filtra la lista candidata. Ignora los secretos reales; **no** ignores `.env.example` ni `README.md`. Salida esperada exacta:
> ```
> ignore: .env
> ignore: .env.*
> ignore: *.pem
> ignore: credentials.json
> ```

*Changes:* Drop `S10-T4-B`; add articles; split sentence.

### 6.4 You Do tab

#### youDo.context (line 1900)

**Before:**
> Conviertes el ETL de familiaridad en **paquete instalable** con subcomandos ingest|normalize|compare|report, config por precedencia y validación temprana. Sin secretos en el repositorio; solo datos sintéticos.

**After:**
> Conviertes el ETL de familiaridad en un **paquete instalable** con subcomandos `ingest|normalize|compare|report`, config por precedencia y validación temprana. Sin secretos en el repositorio; solo datos sintéticos.

*Change:* Add article "un"; add code span around subcommand list.

#### youDo.requirements[6] (line 1915)

**Before:** `"ingest ejecuta ETL CSV real: Decimal desde texto, clean/quarantine y manifest por fuente reconciliado"`
**After:** `"El subcomando ingest ejecuta un ETL CSV real: `Decimal` desde texto, *clean/quarantine* y manifest por fuente reconciliado"` — **OR** soften per Issue #21: `"El subcomando ingest ejecuta una versión simplificada del ETL CSV del S08: parseo de `Decimal` desde texto, partición clean/quarantine y manifest por fuente reconciliado (reutiliza lo que ya construiste en S08)"`

#### youDo.rubric[3].criterion (line 2147)

**Before:** `"Pruebas o casos de borde documentados"`
**After:** `"Pruebas o casos de borde documentados"` — no change (the LT AGREEMENT_PARTICIPLE_NOUN flag was a false positive from list-concatenation).

### 6.5 Self-Check tab

#### selfCheck.questions[3].explanation (line 2180)

**Before:**
> stdout = datos (JSON/CSV) para pipes; stderr = progreso y diagnóstico. Un `print('ok')` extra en stdout rompe al consumidor del pipe.

**After:**
> La salida estándar (stdout) son los datos (JSON/CSV) para los pipes; la salida de error (stderr) es el progreso y el diagnóstico. Un `print('ok')` extra en stdout rompe al consumidor del pipe.

*Change:* Capitalize after the question mark + add Spanish gloss (Issue #10).

#### selfCheck.questions[1].explanation (line 2166)

**Before:**
> Canónica en ops: flags CLI > variables de entorno > archivo > defaults. Un flag None significa "no pasado" y no debe pisar env.

**After:**
> Es canónica en ops: flags CLI > variables de entorno > archivo > defaults. Un flag `None` significa "no pasado" y no debe pisar *env*.

*Change:* Add verb "Es"; add code span around `None`; italicize "env".

---

## 7. Proposed GitHub-Style Diffs

> Diffs are proposals only — do not apply in this audit pass. Line numbers refer to `src/lib/course/sections/s10-sklearn.ts`.

### Diff D1 (Issue #1, #2): Fix section identity meta-leak — rename id and file

> This is a cross-file change (touches `s10-sklearn.ts` AND `index.ts` AND any URL/hash router that references `id`). Propose a coordinated rename in a single PR.

```diff
--- a/src/lib/course/sections/s10-sklearn.ts
+++ b/src/lib/course/sections/s10-sklearn.ts
@@ -1,8 +1,5 @@
 import type { CourseSection } from '../../types'

 export const section10: CourseSection = {
-  // Platform id `sklearn` is legacy stable for routing only — never surface to learners.
-  id: "sklearn",
+  id: "modules-packaging-cli",
   index: 10,
   title: "Módulos, packaging y CLI profesional",
   shortTitle: "Módulos & CLI",
```

```diff
--- a/src/lib/course/index.ts
+++ b/src/lib/course/index.ts
@@ -8,7 +8,7 @@ import { section08 } from './sections/s08-pandas'
 import { section09 } from './sections/s09-visualization'
-import { section10 } from './sections/s10-sklearn'
+import { section10 } from './sections/s10-modules-packaging-cli'
 import { section11 } from './sections/s11-testing'
```

(Rename file `git mv src/lib/course/sections/s10-sklearn.ts src/lib/course/sections/s10-modules-packaging-cli.ts`)

### Diff D2 (Issue #3, #4): Strip `CASO-LIM-010` and `S10-T*` from learner-facing `instruction:` strings

> Apply to all 24 We Do `instruction` fields. Show the first one; the pattern is identical for the rest.

```diff
@@ weDo.steps[0].instruction (line 621) @@
-        "E1 (guiado) · S10-T1-A — Arregla el módulo del starter (`CASO-LIM-010`): `clean` debe colapsar espacios, hacer casefold y exportarse en `__all__` (no exportes helpers con `_`). Salida esperada exacta:\n['clean']\nx",
+        "**E1 · T1 Imports** (guiado) — Arregla el módulo del starter: la función `clean` debe colapsar espacios, hacer *casefold* y exportarse en `__all__` (no exportes helpers con `_`). Salida esperada exacta:\n```\n['clean']\nx\n```",
```

(Repeat for all 24 `instruction` fields. Replace `S10-T1-A` with the human heading "T1 Imports", `S10-T1-B` → "T1 API", `S10-T2-A` → "T2 Layout", `S10-T2-B` → "T2 SemVer", `S10-T3-A` → "T3 Subcomandos", `S10-T3-B` → "T3 stdio", `S10-T4-A` → "T4 Precedencia", `S10-T4-B` → "T4 Secretos".)

### Diff D3 (Issue #7): Fix gender agreement "documentada y testeable"

```diff
@@ weDo.steps[S10-T4-A-DEMO].why (line 580) @@
-        why: "Precedencia flags > env > default documentada y testeable.",
+        why: "Precedencia flags > env > default, documentado y testeable.",
```

### Diff D4 (Issue #8): `o` → `u` before *Hola*

```diff
@@ weDo.steps[S10-T1-A-E2].feedback (line 675) @@
-        feedback: "Si sale hola:b primero o Hola sin casefold, los sufijos siguen invertidos o util_norm no normaliza del todo.",
+        feedback: "Si sale hola:b primero u Hola sin casefold, los sufijos siguen invertidos o util_norm no normaliza del todo.",
```

### Diff D5 (Issue #9): Comma before *pero*

```diff
@@ weDo.steps[S10-T3-A-E2].instruction (line 1313) @@
-          "E2 (independiente) · S10-T3-A — Implementa `run_cli(argv, runtime_ok=True)`: parsea con argparse (subcomando `normalize` requerido); captura `SystemExit` de usage → **2**; si el parse es OK pero runtime_ok es False → **1**; éxito → **0**. Salida esperada exacta:\n...",
+          "**E2 · T3 CLI** (independiente) — Implementa `run_cli(argv, runtime_ok=True)`. Parsea con argparse (subcomando `normalize` requerido); captura el `SystemExit` de usage → **2**. Si el parse es OK, pero `runtime_ok` es False → **1**; éxito → **0**. Salida esperada exacta:\n...",
```

### Diff D6 (Issue #10): Capitalize after `?` in selfCheck explanation

```diff
@@ selfCheck.questions[3].explanation (line 2180) @@
-        explanation:
-          "stdout = datos (JSON/CSV) para pipes; stderr = progreso y diagnóstico. Un `print('ok')` extra en stdout rompe al consumidor del pipe.",
+        explanation:
+          "La salida estándar (stdout) son los datos (JSON/CSV) para los pipes; la salida de error (stderr) es el progreso y el diagnóstico. Un `print('ok')` extra en stdout rompe al consumidor del pipe.",
```

### Diff D7 (Issue #12): `un API token` → `un token de API`

```diff
@@ theory[8].paragraphs[0] (line 320) @@
-        "Secretos **fuera del repo**: `.env` en `.gitignore`, **nunca** en logs (S09). El ETL local de este nivel **no inventa un API token**. Defaults seguros (log level INFO, no debug con PII).",
+        "Secretos **fuera del repo**: `.env` en `.gitignore`, **nunca** en logs (S09). El ETL local de este nivel **no inventa un token de API**. Defaults seguros (log level INFO, no debug con PII).",
```

### Diff D8 (Issue #13): `vs` → `vs.` (Spanish abbreviation)

```diff
@@ iDo.steps[S10-T3-B-DEMO].why (line 555) @@  (and 3 similar occurrences)
-        why: "El pipe de datos queda limpio; logs viven en stderr. FAMILIARITY_LOG_LEVEL vs --log-level: gana el flag.",
+        why: "El pipe de datos queda limpio; logs viven en stderr. `FAMILIARITY_LOG_LEVEL` vs. `--log-level`: gana el flag.",
```

### Diff D9 (Issue #14): "Canónica en ops" → "Es canónica en ops"

```diff
@@ selfCheck.questions[1].explanation (line 2166) @@
-        explanation:
-          "Canónica en ops: flags CLI > variables de entorno > archivo > defaults. Un flag None significa "no pasado" y no debe pisar env.",
+        explanation:
+          "Es canónica en ops: flags CLI > variables de entorno > archivo > defaults. Un flag `None` significa "no pasado" y no debe pisar *env*.",
```

### Diff D10 (Issue #15): Exit codes equation form

```diff
@@ theory[6].paragraphs[1] (line 197) @@
-        "Exit codes: **0** éxito, **2** uso/CLI inválido (argparse default), **1** error de runtime/negocio. Scripts y CI **dependen** de esto — no devuelvas siempre 0.",
+        "Exit codes: **0** = éxito; **2** = uso/CLI inválido (default de argparse); **1** = error de runtime/negocio. Los scripts y el CI **dependen** de esto: no devuelvas siempre 0.",
```

### Diff D11 (Issue #18): Convert long inline list to markdown list

```diff
@@ weDo.steps[S10-T2-A-E3].instruction (line 1022) @@
-          "E3 (transferencia) · S10-T2-A — Implementa `diagnose_mnf(facts)` que inspecciona un dict de hechos post-install (`CASO-LIM-010`): (1) `installed` falso → falta `pip install -e .`; (2) `import_name` ≠ `package_dir` → nombre de import distinto de la carpeta; (3) `shadowing_script` verdadero → script en cwd tapa el paquete en sys.path. Salida esperada exacta:\n...",
+          "**E3 · T2 Packaging** (transferencia) — Implementa `diagnose_mnf(facts)` que inspecciona un dict de hechos tras instalar. La función devuelve la primera causa que aplique, en este orden:\n\n1. `installed` falso → falta `pip install -e .`;\n2. `import_name` ≠ `package_dir` → el nombre de import no coincide con la carpeta;\n3. `shadowing_script` verdadero → un script en el cwd tapa el paquete en `sys.path`.\n\nSalida esperada exacta:\n...",
```

### Diff D12 (Issue #23): Standardize callout titles

```diff
@@ theory[3].callout.title (line 152) @@
-        title: "stdlib first",
+        title: "Biblioteca estándar primero",

@@ theory[6].callout.title (line 311) @@
-        title: "None vs missing",
+        title: "None vs. missing",
```

### Diff D13 (Issue #5): Clarify `# DEFECT` scaffolding

```diff
@@ weDo.intro (line 614) @@
-    intro: "Andamiaje: **E1 guiado → E2 independiente → E3 transferencia** × 8 subtemas (24 ejercicios, 2 hints c/u). Usa solo stdlib y lo aprendido hasta S10; cada starter trae un defecto marcado con `# DEFECT`. Elimina líneas extra (p. ej. `ok True`); la salida debe coincidir exactamente con el contrato.",
+    intro: "Andamiaje: **E1 guiado → E2 independiente → E3 transferencia** × 8 subtemas (24 ejercicios, con 2 *hints* cada uno). Usa solo la biblioteca estándar y lo aprendido hasta S10. Cada starter trae un bug marcado con el comentario `# DEFECT:` al inicio de la línea defectuosa; corrígelo y verifica con la salida esperada. Elimina las líneas extra (p. ej. `print('ok', True)`); la salida debe coincidir exactamente con el contrato.",
```

---

## 8. Recommended Priority Order for Fixing

| Priority | Issue(s) | Effort | Impact |
|---|---|---|---|
| **P0** (do first) | #1, #2, #3, #4 (meta-leaks: section id, file name, `CASO-LIM-010`, `S10-T*` in instructions) | Medium (1 file rename + 1 import update + 24 instruction rewrites + 31 CASO-LIM strippings; coordinate router check) | Removes all confirmed developer meta-leaks visible to learners. Restores trust in the "pure teacher voice" contract. |
| **P1** | #7, #8, #9, #10, #12, #13, #14, #15 (grammar micro-fixes) | Small (single-line edits in known locations) | Removes all real Spanish-grammar defects flagged by LanguageTool; improves readability for native Spanish speakers. |
| **P2** | #17, #18, #19, #20 (long-sentence splits) | Small (rewrite 4 instruction strings + 1 theory paragraph) | Reduces cognitive load on We Do exercises; brings all sentences under 32 words. |
| **P3** | #21 (You Do requirement 7) | Small (soften language or add S08 pointer) | Smooths the We Do → You Do cognitive jump. |
| **P4** | #23, #26 (callout title consistency, S11 cross-ref) | Small (standardize callout titles; verify S11 title) | Polish. |
| **P5** | #16, #22, #24, #25, #28 (cosmetic) | Trivial | Polish only. |

---

## 9. Graph Memory Update Notes (for shared context files)

> For the orchestrator and downstream Fixer agents.

- **S10 file path:** `src/lib/course/sections/s10-sklearn.ts` (rename proposed to `s10-modules-packaging-cli.ts`).
- **S10 routing id:** `"sklearn"` (rename proposed to `"modules-packaging-cli"`). Same pattern observed in S11 (`"testing"` for OOP section) — **systemic legacy-naming issue, recommend a sweep across all 52 sections**.
- **`CASO-LIM-010` is an authoring tag (probably "caso límite 010").** Appears in S10 only (31×). Other sections may use `CASO-LIM-NNN` variants — recommend a repo-wide grep before fixing.
- **`S10-T1-A … S10-T4-B` are `subtopicId` values**, not learner labels. Same convention likely applies to S01–S52 — recommend checking other sections and applying the same "strip from instruction text" fix.
- **Rendered live page confirmed** matches source byte-for-byte on the Theory tab. The other tabs (I Do / We Do / You Do / Self-Check) were verified via source read; the live-site tab navigation had a quirk where clicking a tab label sometimes matched a different section's preview card (cosmetic UX bug in the live site's hash router, not a content bug — flagged for the platform team but out of scope for curriculum audit).
- **LT rate limits:** 2 chunks × ~18k chars each, 4-second sleep between requests → no throttling issues encountered. The 757 MORFOLOGIK_RULE_ES "spelling" hits are 99% false positives (English tech terms: `pip`, `git`, `stdout`, `argparse`, `pyproject`, `toml`, etc.).
- **No high-severity pedagogical defects** found. I Do / We Do / You Do scaffold is faithfully implemented; progressive disclosure is sound; cognitive load is mostly within bounds.
- **No PII / secret leaks** found in S10 content. The section explicitly forbids real PII and API tokens, and the You Do bootstrap uses synthetic data.
- **No bugs in starter/solution code** were detected during this audit pass (code execution was out of scope, but static read shows contract output matches expected output for each of the 24 We Do exercises).

---

## 10. Method Note (Grammar Audit Sub-Plan Compliance)

Per `/home/z/my-project/audits/_GRAMMAR_SUBPLAN.md`:

| Method | Applied? | Notes |
|---|---|---|
| Fernández-Huerta (1959) | ✓ | Computed per-paragraph and per-sentence. Mean sentence FH = 73.8 (fácil). |
| Szigriszt-Pazos / INFLESZ | ✓ | Computed per-paragraph (see paragraph table). Mean INFLESZ ≈ 70 (normal). |
| Words-per-sentence (WPS) | ✓ | Mean 12.9; max 40; 3 sentences >32 words; 0 sentences >45 words. |
| Syllables-per-word (SPW) | ✓ | Range 1.62–2.79 across paragraphs (within Spanish norm). |
| Pedagogical heuristics (run-on, no-terminal, inverted marks, repeated words, etc.) | ✓ | 14 heuristic rules applied per sentence; tally in §3. |
| LanguageTool `es` (public API) | ✓ | 2 chunks, 25k chars total; ~30 real grammar findings (after filtering 757 spelling false positives). |
| Composite section score | ✓ | 7.3/10 (see §2). |
| False-positive documentation | ✓ | Documented in §3 and Method Note. |

**Tools used:** Python 3.12 (custom extractor + readability + heuristics), LanguageTool public API (`https://api.languagetool.org/v2/check`), `agent-browser` for live-page verification, `ripgrep` for source search.

**Reproducibility:** All intermediate artifacts saved under `/home/z/my-project/audits/_s10_*`:
- `_s10_extract_prose.py` — prose extractor script
- `_s10_prose.txt` — extracted prose (399 entries)
- `_s10_grammar_audit.py` — readability + heuristics script
- `_s10_grammar_metrics.json` — per-paragraph + per-sentence metrics
- `_s10_grammar_output.txt` — full heuristic audit output
- `_s10_lt.py` — LanguageTool query script (throttled)
- `_s10_lt_output.txt` — full LT output

---

**Composite score: 7.3 / 10** — *Solid, technically rigorous, pedagogically faithful; held back by systemic meta-leaks (section identity + internal taxonomy visible to learners) and a handful of localized Spanish grammar defects, all quick wins for a Fixer pass.*

> This is the complete Explorer report for Section 10. Ready for the Fixer prompt.
