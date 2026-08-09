# S10 Explorer Report — Módulos, packaging y CLI profesional

**Auditor role:** Curriculum Auditor · Pedagogical Analyst · Technical Editor (STORM + Graph + Loop + Harness)  
**Generated:** 2026-07-24  
**Scope restriction:** Section 10 only — analysis and proposed diffs; **no product files edited**.

---

## 1. Section Identification & Scope

| Field | Value |
|--------|--------|
| Section index | **10** |
| Platform id (hash) | `sklearn` |
| Live URL | https://pillb.github.io/pyarcana/#sklearn |
| Source file | `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s10-sklearn.ts` |
| Title (metadata) | Módulos, packaging y CLI profesional |
| shortTitle (live nav) | Módulos & CLI |
| Tagline | Paquete `familiarity_core` con CLI ingest/normalize/compare/report y config por precedencia |
| Level / hours | Intermedio · 19h · phase 0 |
| Structural inventory | Theory: 1 mapa + 8 subtemas (T1–T4 × A/B) · iDo: 8 demos · weDo: 24 ejercicios · youDo: 1 · selfCheck: 6 · resources: docs/books/courses |

**Topic reality (V3):** Empaquetado profesional de un ETL de familiaridad (módulos, `pyproject.toml`, CLI argparse, config por precedencia). **No** es scikit-learn. El id de plataforma `sklearn` es un legacy conservado a propósito.

**Sources consulted in this pass**
- Live curriculum listing (S10 card: “Módulos & CLI” / familiarity_core).
- Full source `s10-sklearn.ts` (theory → iDo → weDo → youDo → selfCheck → resources).
- Gold bar: `course-state/curriculum_hardening/GOLD_STANDARD_CHECKLIST.md`.
- Prior automated audit: `audits/S10_AUDIT.json` (ACCEPT / mean rank 9.51 — treated as **non-authoritative** for expert judgment).
- Domain research anchors: Python modules/`__main__`/argparse, PyPA pyproject + sampleproject, SemVer, Real Python layouts, CS50P / MIT 6.100L as external peers.
- Comparative peer in-repo: S05 map-block style (same “En V3, Sx no es…” pattern).

**Out of scope this run:** Fixing content; other sections; renaming platform ids globally (only flagged as consistency risk).

---

## 2. Executive Summary of Quality

### Score: **7.0 / 10**

### Verdict

**Solid intermediate packaging/CLI section with an excellent youDo bootstrap, undermined by systematic curriculum-meta leakage, templated exercise instructions (often truncated or corrupted), and a non-trivial amount of classification / print-theater in weDo.** Structurally complete (8/8/24 + selfCheck + resources). Domain content (imports, public API, src layout, SemVer, argparse, stdio, config precedence, secrets) is **correct and job-relevant**. It is **not** gold by the skeptical expert bar (≥ 9.5): automated ACCEPT in `S10_AUDIT.json` overrates redaction and pedagogy quality.

**What works**
- Clear learning outcomes aligned with CP-N1-B packaging / base CP-N1-C.
- Theory covers the right four pillars: modules → packages → CLI → config.
- iDo demos map 1:1 to subtopics with `why` rationales.
- **youDo** is the highlight: real multi-file package (`pyproject.toml`, `cli.py`, `core.py` with Decimal ETL + quarantine/manifest, unittest, README de precedencia).
- Fail-closed / no-PII / no-secrets norms are consistent with the course ethics line.
- Resources point to real PyPA / Python docs / SemVer / CS50P / MIT.

**What fails the learner**
- Opening narrative is about **curriculum migration away from sklearn**, not about why packaging matters at work.
- `jobRelevance`, theory map, weDo intro, youDo context, and **every exercise footer** talk about sklearn / V3 / “no sklearn real”.
- 24 nearly identical instruction shells; several **cut mid-sentence**; **S10-T1-B-E1** has a **broken task sentence** (footer swallowed the API list).
- Circular-import exercise does **not** demonstrate circular imports.
- Theory demos sometimes under-show the claim (stderr demo output omits stderr; packaging taught as Python dicts only until youDo).
- Platform id `#sklearn` vs title “Módulos & CLI” is a discoverability / trust tax for anyone reading the URL or residual copy.

**Recommended disposition for Fixer:** Priority redaction of meta-leaks + rewrite of exercise instruction shell + repair of corrupted T1-B-E1 + light theory/demo honesty polish. Do **not** throw away youDo.

---

## 3. Detailed Issue Registry

Severity legend: **P0** ship-blocker for learner trust/redaction · **P1** high pedagogy/quality · **P2** medium polish · **P3** nice-to-have.

| ID | Sev | Location | Evidence (quote) | Pedagogical impact |
|----|-----|----------|------------------|--------------------|
| I-01 | P0 | `jobRelevance` | “Esta sección (id `sklearn` conservado) retematiza S10 a **módulos, packaging y CLI**… scikit-learn se difiere al tramo ML.” | Student-facing meta about CMS id and curriculum retheme; burns trust and cognitive load before content. |
| I-02 | P0 | Theory map heading + P1–P2 | Heading: “De “scikit-learn ML pipeline” a módulos…”; “En V3, **S10 no es el path principal de Pipeline/ColumnTransformer/SHAP**…”; “Id `sklearn` se conserva… **no** sklearn real.” | Map should orient the **learning path**, not document editorial history. Competing schema (ML tools vs packaging) confuses progressive disclosure. |
| I-03 | P0 | `weDo.intro` | “Sin scikit-learn en este incremento V3.” | Developer release note leaked into guided practice intro. |
| I-04 | P0 | All ~24 `weDo` instructions (footer pattern) | “…no sklearn real, no packaging cloud; solo importlib, argparse, pyproject conceptual (S01–S10).” (often truncated: “no sklearn real, no.” / “no sklearn real,.” / “no sklearn.”) | Meta constraint + progressive-disclosure note written *to authors*, not learners; truncated Spanish looks unfinished / AI-generated. |
| I-05 | P0 | `S10-T1-B-E1` instruction | “Tarea: Marca helpers privados con _ y deja públicas solo importlib, argparse, pyproject conceptual (S01–S10).” | **Task is corrupted**: student is told to export importlib/argparse as “public API” instead of normalize/compare. Misaligns with starter/solution. |
| I-06 | P1 | Exercise instruction template (24×) | “E1 (guiado) — Concepto: S10-T… (Módulos, packaging y CLI). Entrada: fixture sintético del starter (`CASO`/ids C00x) en packaging y CLI. Tarea: …” | Identical shell reduces signal; “C00x” fixtures are not present in starters (only `CASO-LIM-010`). Weak I/O contracts vs gold bar (“exact pass string when graded”). |
| I-07 | P1 | Multiple E2/E3 pass criteria | “Salida/pass: salida exacta del solution output del starter” / “primeros tokens de `…` según solution” | Points learners at the solution instead of stating the contract. Breaks self-assessment and fair grading narrative. |
| I-08 | P1 | `S10-T1-A-E2` task vs code | Instruction: “Simula un import circular y arréglalo…”; code is two functions + shared util with inverted suffixes — **no import cycle**. | False transfer: student never sees/fails on circular imports; only renames suffixes and adds casefold. |
| I-09 | P1 | Classification / print-theater cluster | E.g. T1-A-E3 recs dict; T2-A-E2 path list; T2-B-E1 semver labels; T3-A-E2 exit code table; T4-A-E1 precedence ranks; T4-B-E1 gitignore list; T4-A-E3 result= lines | Legitimate concepts, but many E1–E3 are **label swaps**, not code that exercises the mechanism (anti-theater bar). |
| I-10 | P1 | Theory code `stdio_split.py` | Code writes to `sys.stderr` but `output` is only `ana perez` | Demo claims stdout/stderr split; visible oracle under-represents the teaching point (same class of issue as incomplete pipe demos). |
| I-11 | P1 | Theory packaging demos | `pyproject_min.py` / iDo `src_layout.py` print dicts/paths only | Conceptual OK for browser sandbox, but **packaging is never shown as TOML text** until youDo — large gap vs PyPA / Real Python peers. |
| I-12 | P1 | Theory refrain spam | Near-every block: “Caso sintético: CLI local — **nunca** PII real.” | Ethics is good; identical sentence as third paragraph of many blocks is boilerplate (cognitive noise, not progressive depth). |
| I-13 | P1 | `youDo.context` | “Reemplaza el legado de churn sklearn.” | Internal rewrite note; meaningless/scary to students. |
| I-14 | P1 | `youDo.rubric[0]` | “Alineación al gate V3 de la sección” | Internal gate jargon; rubric should name observable portfolio criteria (install, CLI, tests, README). |
| I-15 | P2 | Platform id vs title | id `sklearn` · live card “Módulos & CLI” · hash `#sklearn` | URL and residual text contradict title; increases support load and “is this the wrong section?” moments. |
| I-16 | P2 | `main_guard.py` pedagogy | Always prints `import_safe…` at module level **and** runs `_cli()` under main | Blurs “import-safe” demonstration; a cleaner split would show import path vs main path more explicitly. |
| I-17 | P2 | Starters `print('ok', True)` vs solutions without it | 24 starters end with `print('ok', True)`; solutions drop it; tests say “sin líneas extra” | Students must reverse-engineer that `ok True` is part of the defect; not named in `# DEFECT` comments for most. |
| I-18 | P2 | selfCheck Q2 + Q5 redaction | “Precedencia correcta de config…” (ellipsis); “tipicamente” missing accent | Minor ES-PE polish / incomplete stem. |
| I-19 | P2 | Connective tissue S09→S10→S11 | Theory says integrate S08/S09; callout “Hacia S11”; E3 policy names `ClientRecord` before S11 OOP | Forward entity name is light; OK if framed as “nombre de dominio futuro”, but may feel premature without a one-line bridge. |
| I-20 | P2 | T3-A-DEMO SystemExit handling | Comment about re-raising argparse codes; demo only shows success paths `0` | Missed chance to **show** exit code 2 on bad argv (theory claims 0/1/2). |
| I-21 | P3 | Spanish micro-issues | `razon=` without accent; starter “buen luck”; “operador no dev” | Low impact; some intentional in DEFECT starters. |
| I-22 | P3 | Resources books entry | “Click vs argparse” has no URL | Incomplete resource card vs docs/courses. |
| I-23 | P3 | Automated gold inflation | Prior PA/STORM claim rank 9.55; residual theater 0 | Risk that Fixer trusts automated green; Explorer rejects that as ground truth for redaction. |

**Issue count (registry rows):** 23 (several are multi-location patterns).

---

## 4. Meta-Leak Report

Exact learner-visible (or about-to-be-rendered) meta / developer text:

### M-01 — jobRelevance
> “Esta sección (id `sklearn` conservado) retematiza S10 a **módulos, packaging y CLI**: cierra empaquetado de **CP-N1-B** y base de **CP-N1-C**. scikit-learn se difiere al tramo ML.”

**Fix intent:** Keep job story (ETL → instalable CLI); drop id conservation and retheme language. CP-N* gate names may stay if used consistently as portfolio gates elsewhere.

### M-02 — Theory map heading
> “De “scikit-learn ML pipeline” a módulos, packaging y CLI (mapa)”

**Fix intent:** Learner map title, e.g. “Del notebook suelto al paquete instalable (mapa)”.

### M-03 — Theory map paragraphs
> “En V3, **S10 no es el path principal de Pipeline/ColumnTransformer/SHAP**. Ese material se reubica al tramo de ML tabular.”  
> “Id `sklearn` se conserva. … Stack: importlib, argparse, pyproject conceptual — **no** sklearn real.”

**Fix intent:** Zero mentions of sklearn / V3 / id conservation in learner prose.

### M-04 — weDo intro
> “Sin scikit-learn en este incremento V3.”

**Fix intent:** Describe scaffold only: E1→E2→E3 × 8 subtemas.

### M-05 — Exercise instruction footers (×24, systematic)
Pattern examples:
- full: `no sklearn real, no packaging cloud; solo importlib, argparse, pyproject conceptual (S01–S10).`
- truncated: `no sklearn real, no.` · `no sklearn real, no packaging cloud;.` · `no sklearn real,.` · `no sklearn.`

**Fix intent:** Remove entirely. If progressive disclosure must be stated once, put a single weDo intro sentence: “Usa solo stdlib y lo visto hasta S10.”

### M-06 — Corrupted merge of footer into task (S10-T1-B-E1)
> “deja públicas solo importlib, argparse, pyproject conceptual (S01–S10).”

### M-07 — youDo context
> “Reemplaza el legado de churn sklearn.”

### M-08 — youDo rubric
> “Alineación al gate V3 de la sección”

### M-09 — Optional borderline
References to “local-python”, “incremento”, “conceptual” packaging are OK if operational; **“pyproject conceptual”** in student tasks is mildly meta (signals “we’re faking packaging”). Prefer “modelo de pyproject en dict” or show real TOML in theory.

**meta_leak_count (distinct sites/patterns):** **9** (M-01…M-09; M-05 covers 24 occurrences of one pattern).

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 Pre-round research (pedagogy + domain)

Relevant best practices applied in this critique:

1. **Gradual release of responsibility (I Do / We Do / You Do):** Demonstration → guided practice with scaffolds → independent transfer. Fidelity requires that We Do tasks actually practice the **same mechanism** shown in I Do, with decreasing support — not identical instruction shells with different dict labels.
2. **Cognitive load / progressive disclosure:** Opening content should activate prior knowledge (S08 paths/CSV, S09 exit codes/logs) and preview the four topics. Negating an untaught library (sklearn Pipeline) **introduces** extraneous load.
3. **Worked-example effect:** Packaging and CLI are best learned with multi-file layouts and real `pip install -e .` moments (PyPA sampleproject, Real Python layouts). Single-file dict simulations are acceptable as **early** anchors only if youDo is clearly the consolidation — which it is, but theory should at least show a TOML snippet.
4. **CLI pedagogy (argparse peers / Unix conventions):** Teach subparsers, exit codes 0/1/2, stdout vs stderr, and help text for operators — section does this conceptually well.
5. **Config precedence (12-factor / ops):** flags > env > file > defaults is industry-standard; merge with `None` = missing is a strong transferable skill — section’s T4 is one of its best theoretical cores.
6. **ES-PE technical writing:** Clear sentences, accents, no author notes, no truncated clauses, measurable outcomes.

### 5.2 Connective tissue & narrative flow

| Transition | Status |
|------------|--------|
| S09 exceptions/logs → S10 CLI stderr + exit codes | **Good** intent; under-shown in demos |
| S08 ETL → S10 packaging of ETL | **Strong** in youDo (`run_ingest`, quarantine, manifest) |
| S10 → S11 OOP domain | **Thin** (ClientRecord policy exercise + callout) |
| Section-internal T1→T4 | **Clear** order in map P3 |

**Gap:** The first learner-facing blocks spend tokens on **what this section is not**. Gold early sections lead with workplace stakes (S05 jobRelevance is cleaner than S10’s id/retheme clause).

### 5.3 I Do / We Do / You Do fidelity

| Layer | Count | Fidelity notes |
|-------|-------|----------------|
| I Do | 8 | Maps subtopics; several demos are honest micro-functions (`merge`/`validate` style). Layout/semver demos are light. |
| We Do | 24 (E1/E2/E3 × 8) | Scaffold kinds correct, but many E3 are “print the right labels”. Circular-import E2 is mislabeled. Instruction shell is author-facing. |
| You Do | 1 large | **High fidelity** to outcomes: editable install, console script, tests, README, secrets policy, ETL reintegration. Best node of the section. |
| Self-check | 6 MCQ | Aligned to core concepts; fair indices; explanations short but correct. |

### 5.4 Cognitive load & progressive disclosure

- **Extraneous load:** sklearn/V3/id meta; 24× long footers; ethics mantra repeated.
- **Intrinsic load:** Appropriate for intermediate (argparse + packaging + config).
- **Germane load:** Highest in youDo bootstrap and T3/T4 merge/validate code; lowest in path-list exercises.
- **Progressive disclosure breaches:** None serious for untaught third-party APIs (explicitly avoids sklearn). `ClientRecord` name is a soft forward ref. `unittest` appears in youDo requirements without deep theory — acceptable if S01/S27 path is known, but S27 is later; **youDo introduces unittest early** via bootstrap (pragmatic, but note for consistency with “pytest at S27”).

### 5.5 Exercise & exam quality

**Strengths**
- Consistent `# CASO-LIM-010` + `# DEFECT:` markers.
- Solutions generally match claimed outputs.
- Mix of guided repair and independent implementation (merge, validate, argparse subparser).

**Weaknesses**
- Pass strings truncated with ellipses or deferred to “solution output”.
- T1-B-E1 broken instruction (I-05).
- Circular import exercise is theater of naming (I-08).
- Feedback always “Compara tu salida con la solución.” — low formative value.
- selfCheck is solid; no “exam” block beyond quiz (course design).

### 5.6 Consistency with roadmap

- SECTION_MAP and live site agree: S10 = módulos/packaging/CLI under id `sklearn`.
- Aligns with CP-N1-B packaging / CP-N1-C base narrative.
- Legacy filename `s10-sklearn.ts` is repo debt (not learner-visible unless they open GitHub).

### 5.7 Comparison with external best-in-class

| Peer | Relative to S10 |
|------|-----------------|
| [PyPA Writing pyproject.toml](https://packaging.python.org/en/latest/guides/writing-pyproject-toml/) | Peers show real TOML earlier; S10 delays until youDo. |
| [PyPA sampleproject](https://github.com/pypa/sampleproject) | Multi-file from the start; S10 simulates paths in Python lists. |
| [Real Python application layouts](https://realpython.com/python-application-layouts/) | Stronger narrative on *why* src layout; S10 has the why but short. |
| [argparse docs](https://docs.python.org/3/library/argparse.html) | S10 covers subparsers well; weak on demonstrated error exit codes. |
| Harvard CS50P / MIT 6.100L modules | More story-driven module teaching; less packaging depth than S10 youDo. |
| S05 (in-repo peer) | Shares “En V3, Sx no es…” map anti-pattern — S10 should **not** copy that as gold. |

**Net:** Domain choice is competitive; **youDo exceeds** many free courses; **theory/weDo redaction lags** peers and the course’s own gold checklist.

### 5.8 Redaction & grammar (ES-PE)

- Overall Spanish is professional and readable.
- Truncated footers are the dominant redaction defect (not orthography).
- Fix accents: *típicamente*, *razón*.
- Avoid English-only meta (“retarget”, “churn”) in learner strings.
- Keep industry terms (CLI, flag, SemVer, pyproject) as-is.

### 5.9 Graph Engineering snapshot (nodes / edges)

**High-value nodes:** youDo bootstrap; `merge_config`; argparse subcommands; exit codes; stdout/stderr contract; validate_config.  
**Toxic edges:** map → sklearn negation; every exercise → “no sklearn real”; jobRelevance → “id conservado”.  
**Missing edges:** theory TOML snippet → iDo install story → weDo layout (currently jumps to youDo).  
**False edge:** “circular import” exercise → util_norm casefold (label mismatch).

---

## 6. Proposed GitHub-style Diffs

> Diffs are **proposals only** — do not apply in Explorer. Paths relative to repo root. Context abbreviated with `…` where large.

### Diff D-01 — jobRelevance (I-01 / M-01)

```diff
--- a/src/lib/course/sections/s10-sklearn.ts
+++ b/src/lib/course/sections/s10-sklearn.ts
@@
-  jobRelevance:
-    "Empaquetar un ETL en un CLI instalable es lo que separa un notebook suelto de una herramienta usable por el equipo. Esta sección (id `sklearn` conservado) retematiza S10 a **módulos, packaging y CLI**: cierra empaquetado de **CP-N1-B** y base de **CP-N1-C**. scikit-learn se difiere al tramo ML.",
+  jobRelevance:
+    "Empaquetar un ETL en un CLI instalable es lo que separa un notebook suelto de una herramienta usable por el equipo. Aquí conviertes el pipeline de familiaridad en el paquete **familiarity_core**: módulos limpios, `pyproject.toml`, subcomandos y config por precedencia — cierre de empaquetado de **CP-N1-B** y base de **CP-N1-C**.",
```

### Diff D-02 — Theory map rewrite (I-02 / M-02 / M-03)

```diff
--- a/src/lib/course/sections/s10-sklearn.ts
+++ b/src/lib/course/sections/s10-sklearn.ts
@@
     {
-      heading: "De “scikit-learn ML pipeline” a módulos, packaging y CLI (mapa)",
+      heading: "Del notebook suelto al paquete instalable (mapa)",
       paragraphs: [
-        "En V3, **S10 no es el path principal de Pipeline/ColumnTransformer/SHAP**. Ese material se reubica al tramo de ML tabular. Aquí empaquetas **familiarity_core**: módulos limpios, **pyproject.toml**, **CLI** con subcomandos y **config por precedencia** — la herramienta que el equipo puede `pip install -e .` y correr sin notebook.",
-        "Integra el ETL de CP-N1-B (S08) y la observabilidad de S09 (logs sin PII, exit codes). Entorno **local-python**. Id `sklearn` se conserva. Fail-closed si config/schema no cuadra. Stack: importlib, argparse, pyproject conceptual — **no** sklearn real.",
-        "Orden: **T1 Módulos** → **T2 Paquetes** → **T3 CLI** → **T4 Configuración**. Caso sintético: CLI local con scores sintéticos y exit codes 0/1/2 — **nunca** PII real ni claims de fraude.",
+        "Hasta S09 tu lógica vive en scripts y módulos sueltos. Aquí empaquetas **familiarity_core**: imports estables, **pyproject.toml**, **CLI** con subcomandos y **config por precedencia** — la herramienta que el equipo puede `pip install -e .` y correr sin notebook.",
+        "Integra el ETL de CP-N1-B (S08) y la observabilidad de S09 (logs sin PII, exit codes). Entorno local con stdlib: argparse, pathlib y metadata de empaquetado. Fail-closed si config o schema no cuadran al arranque.",
+        "Orden: **T1 Módulos** → **T2 Paquetes** → **T3 CLI** → **T4 Configuración**. Caso de lab: CLI local con datos sintéticos y exit codes 0/1/2 — **nunca** PII real ni claims de fraude.",
       ],
```

### Diff D-03 — weDo intro (I-03 / M-04)

```diff
--- a/src/lib/course/sections/s10-sklearn.ts
+++ b/src/lib/course/sections/s10-sklearn.ts
@@
-    intro: "Andamiaje: **E1 guiado → E2 independiente → E3 transferencia** × 8 subtemas (24 ejercicios, 2 hints c/u). Sin scikit-learn en este incremento V3.",
+    intro: "Andamiaje: **E1 guiado → E2 independiente → E3 transferencia** × 8 subtemas (24 ejercicios, 2 hints c/u). Usa solo stdlib y lo aprendido hasta S10; cada starter trae un defecto marcado con `# DEFECT`.",
```

### Diff D-04 — Instruction shell (pattern for all 24) (I-04 / I-06 / M-05)

Replace the repeated shell with a short learner-facing form. Example for `S10-T1-A-E1`:

```diff
--- a/src/lib/course/sections/s10-sklearn.ts
+++ b/src/lib/course/sections/s10-sklearn.ts
@@
-        instruction:
-          "E1 (guiado) — Concepto: S10-T1-A (Módulos, packaging y CLI). Entrada: fixture sintético del starter (`CASO`/ids C00x) en packaging y CLI. Tarea: Crea un módulo lógico con función pública `clean` y `__all__ = ['clean']`. Salida/pass: `['clean'] | x`. Conserva el contrato del starter (no borres asserts ni datos); no sklearn real, no packaging cloud; solo importlib, argparse, pyproject conceptual (S01–S10).",
+        instruction:
+          "E1 (guiado) · S10-T1-A — Arregla el módulo del starter (`CASO-LIM-010`): `clean` debe colapsar espacios, hacer casefold y exportarse en `__all__` (no exportes helpers con `_`). Salida esperada exacta:\n['clean']\nx",
```

**Apply the same pattern to all 24:** drop sklearn footers; name real fixture id; put **exact** multi-line pass output (from `solutionCode.output`) instead of “según solution” or ellipses.

### Diff D-05 — Fix corrupted S10-T1-B-E1 (I-05 / M-06)

```diff
--- a/src/lib/course/sections/s10-sklearn.ts
+++ b/src/lib/course/sections/s10-sklearn.ts
@@
-        instruction:
-          "E1 (guiado) — Concepto: S10-T1-B (Módulos, packaging y CLI). Entrada: fixture sintético del starter (`CASO`/ids C00x) en packaging y CLI. Tarea: Marca helpers privados con _ y deja públicas solo importlib, argparse, pyproject conceptual (S01–S10).",
+        instruction:
+          "E1 (guiado) · S10-T1-B — Separa API pública y privada: imprime `public` = nombres sin `_` y `private` = nombres con `_` a partir de la lista del starter; `compare` debe seguir normalizando. Salida esperada exacta:\npublic ['normalize', 'compare']\nprivate ['_tokenize']\nTrue",
```

### Diff D-06 — Honest circular-import exercise (I-08)

Either rename the task to match the code:

```diff
-          "… Tarea: Simula un import circular y arréglalo extrayendo un util compartido. Salida/pass: `hola:a | hola:b | ok`. …",
+          "E2 (independiente) · S10-T1-A — Un util compartido alimenta `module_a_process` y `module_b_process`. Corrige `util_norm` (strip+casefold) y los sufijos `:a`/`:b` invertidos. Salida esperada exacta:\nhola:a\nhola:b\nok",
```

**Or** (preferred long-term) replace starter/solution with a true single-file simulation of cycle break (third module `util_norm` already present — rewrite instruction + comments to teach dependency direction, not fake “circular import”).

### Diff D-07 — Theory stdio output honesty (I-10)

```diff
--- a/src/lib/course/sections/s10-sklearn.ts
+++ b/src/lib/course/sections/s10-sklearn.ts
@@
-        output: `ana perez`,
+        output: `ana perez
+stage=normalize event=start
+stage=normalize event=done`,
```

(Alternatively capture stderr in a labeled block in the demo, matching `S10-T3-B-DEMO` style.)

### Diff D-08 — Theory pyproject: show TOML fragment (I-11)

```diff
--- a/src/lib/course/sections/s10-sklearn.ts
+++ b/src/lib/course/sections/s10-sklearn.ts
@@
       code: {
         language: 'python',
-        title: "pyproject_min.py",
+        title: "pyproject_min.py",
         code: `def s10_th_3():
-    # fragmento conceptual de pyproject (como dict)
-    pyproject = {
-        "project": {
-            "name": "familiarity-core",
-            "version": "0.1.0",
-            "requires-python": ">=3.11",
-            "dependencies": [],
-        },
-        "build-system": {
-            "requires": ["setuptools>=61"],
-            "build-backend": "setuptools.build_meta",
-        },
-    }
-    print(pyproject["project"]["name"], pyproject["project"]["version"])
-    print("layout", "src/familiarity_core/__init__.py")
+    # Representamos el pyproject mínimo que luego copiarás como TOML real
+    toml = '''
+[build-system]
+requires = ["setuptools>=61"]
+build-backend = "setuptools.build_meta"
+
+[project]
+name = "familiarity-core"
+version = "0.1.0"
+requires-python = ">=3.11"
+dependencies = []
+'''
+    print(toml.strip())
+    print("layout", "src/familiarity_core/__init__.py")
 
 s10_th_3()`,
-        output: `familiarity-core 0.1.0
-layout src/familiarity_core/__init__.py`,
+        output: `[build-system]
+requires = ["setuptools>=61"]
+build-backend = "setuptools.build_meta"
+
+[project]
+name = "familiarity-core"
+version = "0.1.0"
+requires-python = ">=3.11"
+dependencies = []
+layout src/familiarity_core/__init__.py`,
```

### Diff D-09 — Reduce ethics spam in theory P3s (I-12)

For subtopics that already stated synthetic data in the map, rewrite third paragraphs to add **mechanism edge cases** (e.g. lazy import risks, discovery config, epilog examples) instead of repeating “nunca PII real”. Keep **one** ethics callout per section map or T4 secrets block.

### Diff D-10 — youDo context + rubric (I-13 / I-14 / M-07 / M-08)

```diff
--- a/src/lib/course/sections/s10-sklearn.ts
+++ b/src/lib/course/sections/s10-sklearn.ts
@@
-    context:
-      "Conviertes el ETL de familiaridad en **paquete instalable** con subcomandos ingest|normalize|compare|report, config por precedencia y validación temprana. Sin secretos en repo. Reemplaza el legado de churn sklearn.",
+    context:
+      "Conviertes el ETL de familiaridad en **paquete instalable** con subcomandos ingest|normalize|compare|report, config por precedencia y validación temprana. Sin secretos en el repositorio; solo datos sintéticos.",
@@
     rubric: [
-      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
+      { criterion: "Paquete editable + CLI ingest|normalize|compare|report operables", weight: "25%" },
       { criterion: "Correctitud técnica en entorno declarado", weight: "20%" },
       …
```

### Diff D-11 — selfCheck micro-redaction (I-18)

```diff
-        question: "Precedencia correcta de config…",
+        question: "¿Cuál es la precedencia correcta de configuración?",
@@
-        question: "Añadir un subcomando nuevo compatible es tipicamente…",
+        question: "Añadir un subcomando nuevo compatible es típicamente…",
```

### Diff D-12 — Starter DEFECT notes for `ok True` (I-17)

Add to each starter’s `# DEFECT` line (or instruction): “elimina líneas extra como `ok True`; la salida debe coincidir con el contrato.” Prefer a single global weDo intro sentence over 24 edits if redaction budget is tight.

### Diff D-13 — Optional platform id note (I-15)

**Do not** change `id: "sklearn"` in Explorer/Fixer without a platform migration plan (progress keys, deep links). If id stays:

```diff
+  // Platform id `sklearn` is legacy stable for routing only — never surface to learners.
```

And ensure **no** learner string mentions the id (D-01/D-02 already remove surface leaks).

---

## 7. Recommended Priority Order for Fixing

1. **P0 redaction batch (D-01, D-02, D-03, D-05, D-10):** remove sklearn/V3/id/retheme leaks from jobRelevance, theory map, weDo intro, youDo; fix T1-B-E1 task. *Highest ROI for trust.*
2. **P0/P1 instruction shell rewrite (D-04):** all 24 weDo instructions — exact pass outputs, no footers, real fixture ids. *Largest volume; script-assisted but human-reviewed.*
3. **P1 exercise honesty (D-06, D-07, D-08):** circular-import naming, stdio output, TOML visibility.
4. **P1 theory polish (D-09):** replace repeated PII mantras with real edge teaching; optional T3-A demo of exit code 2.
5. **P2 micro (D-11, D-12):** selfCheck accents; starter extra-line guidance.
6. **P2/P3 platform hygiene (D-13):** keep id stable; ban learner mentions; optional later rename project.
7. **Do not regress youDo bootstrap** — only strip meta phrases and improve rubric wording.

**Exit criteria for Fixer**
- Zero learner-visible “sklearn” / “V3” / “id conservado” / “retematiza” / “churn” / “incremento V3”.
- T1-B-E1 instruction matches solution.
- No truncated “no sklearn real, no.” footers.
- At least theory shows a real TOML fragment once.
- Score target after fix: **≥ 8.5** redaction-ready; **≥ 9.5** only if classification theater is reduced on ≥4 E3s and circular-import is honest.

---

## 8. Graph Memory Update notes

For shared context (`GRAPH_MEMORY*` / residual ledgers / future Fixer):

```yaml
section: 10
id: sklearn
file: s10-sklearn.ts
title: Módulos, packaging y CLI profesional
explorer_score: 7.0
status: explorer_complete_not_gold
meta_leaks:
  - jobRelevance id/retheme/sklearn
  - theory map sklearn/V3/id
  - weDo intro incremento V3
  - weDo instruction footers x24 (truncated variants)
  - T1-B-E1 corrupted task
  - youDo churn sklearn + rubric gate V3
strengths:
  - youDo multi-file package + unittest + ETL reintegration
  - T4 config precedence + validate_config
  - outcomes aligned CP-N1-B/C packaging
toxic_nodes:
  - curriculum_migration_narrative
  - instruction_template_soup
  - false_circular_import_exercise
false_gold_warning: S10_AUDIT.json ACCEPT / PA 9.55 overstates redaction quality
fixer_priority: [P0_meta, P0_T1B_E1, P1_instruction_shell, P1_demo_honesty]
do_not_touch: youDo FILES bootstrap body (except meta strings)
platform_id: keep sklearn for routing; never surface to learners
next_edges:
  - S09 logs/exit_codes -> S10 stderr/exit codes (strengthen demos)
  - S10 package -> S11 domain types (ClientRecord policy OK if framed)
```

---

## Appendix A — Structural checklist vs gold bar

| Gold bar item | S10 status |
|---------------|------------|
| ≥ 9 theory headings (map + 8) | Pass |
| 8 iDo demos | Pass |
| 24 weDo E1/E2/E3 | Pass |
| youDo + rubric | Pass (rubric wording weak) |
| ≥ 5 selfCheck | Pass (6) |
| Resources with real URLs | Pass (books Click entry weak) |
| No placeholder/TBD | Pass |
| No meta-leak | **Fail** |
| Exercise instructions ≥150 chars with I/O contract | Partial (length OK, quality/template/meta fail) |
| starter DEFECT scaffold | Pass |
| No print-theater | **Partial fail** (several label exercises) |
| Progressive disclosure | Pass (no real sklearn API) |

## Appendix B — Subtopic map (for Fixer orientation)

| subtopicId | Heading | Best nodes | Weak nodes |
|------------|---------|------------|------------|
| S10-T1-A | Imports, namespaces y `__main__` | `__name__` guard | circular-import E2 false |
| S10-T1-B | Dependencias cíclicas y API pública | `__all__`, private `_` | E1 instruction corrupt |
| S10-T2-A | Layout src, pyproject | layout idea | TOML only at youDo |
| S10-T2-B | Versionado y compatibilidad | SemVer classify | print-only E1 |
| S10-T3-A | argparse, subcomandos, exit codes | subparsers | exit 2 under-demoed |
| S10-T3-B | stdin/stdout/stderr | clean stdout E3 | theory output incomplete |
| S10-T4-A | Precedencia config | merge pure function | — |
| S10-T4-B | Secretos y validación | validate_config | — |

---

This is the complete Explorer report for Section 10. Ready for the Fixer prompt.
