# Section 14 — Curriculum Audit Report (PyArcana)

**Task ID:** S14
**Agent:** Curriculum Auditor (general-purpose)
**Section under audit:** Section 14 — *NumPy y cómputo vectorizado*
(file `src/lib/course/sections/s14-security.ts`, `id: "security"`, `shortTitle: "NumPy vectorizado"`)
**Phase:** 1 — Competente (sections 14–26), level "Competente", `estimatedHours: 18`
**Live URL:** https://pillb.github.io/pyarcana/#security (note the URL hash mismatch — see Meta-Leak #1)
**Repo URL:** https://github.com/PillB/pyarcana/blob/main/src/lib/course/sections/s14-security.ts

---

## 1. Section Identification & Scope

Section 14 was confirmed three independent ways:

1. **Course index (`src/lib/course/index.ts`):** `section14` is imported from `./sections/s14-security` and is the 14th entry of `COURSE_SECTIONS`, the **first** entry of the `Phase 1 — Competente (14-26)` block.
2. **Live homepage (agent-browser):** the left-rail card labelled `14` shows the shortTitle `NumPy vectorizado` and the tagline *"cálculo vectorizado de métricas de calidad y señales por pares, con benchmark honesto y resultados equivalentes al baseline"*.
3. **Rendered section page (agent-browser → click card 14):** the URL hash becomes `#security` (the `id` of the section) and the H1 reads *"NumPy y cómputo vectorizado"*. The theory tab loads eight NumPy demos (`s14_th_1` … `s14_th_8`) covering `dtype`/`shape`, máscaras, ufuncs/reducciones, broadcast, views/copies, NaN/inf, vectorización vs loop, y `allclose`/memoria.

This is the **apertura (opening) of Phase 1 / level N2** of the course. It opens the portfolio increment **CP-N2-A** ("Executive Data Quality & EDA"), which is later closed in S15–S17 (pandas + quality gates + joins/groupby/cierre).

The section is structured around four sub-topics with two sub-blocks each (T1-A/T1-B, T2-A/T2-B, T3-A/T3-B, T4-A/T4-B), giving 8 theory blocks, an I-Do with 8 demos, a We-Do with 24 exercises (8 subtopics × 3 levels E1 guided → E2 independent → E3 transfer), a You-Do capstone (`quality_board_numpy.py` with 5 functions + `_run_tests()`), an 11-question self-check, a 6-criterion weighted rubric (sums to 100%), and a resources block (7 docs, 2 books, 5 courses).

The source file is **1 747 lines long**. All learner-facing Spanish prose was extracted (theory paragraphs, callout content, I-Do intro + 8 demo descriptions/whys, We-Do intro + 24 instructions + 24 hints + 25 edge-cases + 24 feedback, You-Do title/context/objectives/requirements/portfolio note, self-check 11 questions + 11 explanations + 29 options, rubric 6 criteria, resource notes). Total **229 prose blocks / 325 sentences / 3 706 words** of Spanish prose.

---

## 2. Executive Summary of Quality

**Composite score: 7.4 / 10**

**Verdict:** Section 14 is **pedagogically excellent** at the content layer — one of the strongest "apertura de nivel" sections in the course. The Ancla / Mecanismo / Caso sintético / Borde schema is applied uniformly across all eight theory blocks (Puente desde S13 → Diccionario rápido → Caso sintético → Fail-closed). The I-Do → We-Do → You-Do handoff is explicit and contract-driven: every We-Do starter carries a **single deliberate defect** (CASO-LIM-014) with two progressive hints, edge cases and a `solutionCode` oracle. The self-check questions target the exact cognitive traps (`x == np.nan` is always `False`, `axis=0` collapses filas → un valor por columna, `writeable=False` lanza `ValueError`, view ≠ copy, `np.unique` ≠ `len(ids)/len(ids)`). The rubric weights sum to 100% and include a "Privacidad: sin PII real" criterion at 20%.

The section loses 2.6 points for two **HIGH-severity meta-leaks at the surrounding-component layer** (not in the section file itself) and a handful of medium redaction issues:

1. **HIGH — Meta-leak #1: URL hash mismatch.** The section's `id` is `"security"` (stale remnant from an earlier curriculum version when section 14 was a security module) but the actual content is NumPy. When the learner clicks the `14 · NumPy vectorizado` card on the live site, the browser URL bar shows `https://pillb.github.io/pyarcana/#security`. The hash is the section's primary shareable identifier; sharing it on Slack/LinkedIn/email says "security" but loads NumPy. **(−1.0)**
2. **HIGH — Meta-leak #2: Interactive playground shows wrong-section code.** `src/components/course/SectionView.tsx` line 1432 keys the `InteractivePlaygroundDemo` dictionary by section `id`. The entry for `'security'` contains a `Practica seguridad: hashing y cifrado` demo (SHA-256 + PBKDF2 password hashing with `hashlib`). Live on the rendered Section 14 page, immediately below the NumPy theory content (after the `allclose_mem.py` demo and the *"rtol vs atol"* callout), the learner sees a *"Pruébalo tú mismo"* editor titled **"Practica seguridad: hashing y cifrado"** whose code has **nothing to do** with NumPy. This is the exact same defect pattern that S13 has (S13 = id `rpa-automation` → mismatched playground). **(−1.0)**
3. **MEDIUM — Real orthographic error (LanguageTool `SI_AFIRMACION2`).** In `selfCheck.questions[5].options[3]` (line 1629): *"Si, de derecha a izquierda, cada dimensión es igual o una es 1 (o ausente)"* — the adverb of affirmation **"Sí"** must carry a tilde. **(−0.3)**
4. **MEDIUM — Five long sentences (>32 words).** None are run-ons (>45 w), but five pack ≥4 sub-ideas each: the "Diccionario rápido" glossary (41 w), the "Las reducciones" sentence (35 w), the "Para N grande" sentence (38 w), the You-Do context (42 w), and the portfolioNote (39 w). **(−0.3)**
5. **LOW — Anglicism/loanword density.** As with most Phase-1+ sections, the prose carries `starter`, `bug`, `loop`, `score`, `shape`, `dtype`, `fixture`, `demo`, `memo`, `self-check`, `ratio`, `tests`, `baseline`, `bench`, `flag(s)`. These are **industry-standard borrowings** shown inline-code where appropriate, but their density in T3-A/T3-B (views/copies, NaN/inf) reaches the cognitive-load ceiling. **(−0.0 — noted, not penalised)**

No developer comments ("TODO", "FIXME", "moved from section X", "XXX", "@author", "WIP") were found inside `s14-security.ts` itself. The two meta-leaks live one layer up, in `src/components/course/SectionView.tsx` (the playground dictionary) and in the file name / `id` field of the section.

**Composite Fernández-Huerta = 75.6** (band: *normal*) and **INFLESZ = 71.3** (band: *normal*). These are exactly the right difficulty bands for a Phase-1 "Competente" technical curriculum — neither under-teaching nor cognitive overload. WPS = 11.4 (well below the 15–32 soft target; the section favours short, contract-driven sentences), SPW = 1.99.

---

## 3. Detailed Issue Registry

| # | Sev | Dimension | Location | Evidence (verbatim) | Pedagogical impact |
|---|-----|-----------|----------|---------------------|--------------------|
| 1 | H | Meta-leak / URL hash | `s14-security.ts:4` (`id: "security"`) + `src/app/page.tsx:68` (`COURSE_SECTIONS.find(s => s.id === hash)`) | `id: "security"` for a section titled "NumPy y cómputo vectorizado". When the learner clicks card 14, the URL hash becomes `#security`. Confirmed live: `agent-browser eval 'location.hash' → "#security"` while H1 = "NumPy y cómputo vectorizado". | The URL bar literally shows `#security` while the learner reads NumPy content. Shareable links say "security" but load NumPy. Bookmarks, analytics and SEO anchors all carry the misleading slug. |
| 2 | H | Meta-leak / wrong-content playground | `src/components/course/SectionView.tsx:1432-1468` (key `'security'` in the `demos` dictionary of `InteractivePlaygroundDemo`) | `'security': { title: 'Practica seguridad: hashing y cifrado', code: '# Practica seguridad con biblioteca estandar\nimport hashlib\n# 1. Hash SHA-256 …' }` | The "Pruébalo tú mismo" Pyodide editor on the Section 14 page teaches SHA-256 / PBKDF2 / password hashing — unrelated to NumPy. Confirmed live: `document.querySelector("[data-testid^=demo-run-security]").textContent` includes "Practica seguridad: hashing y cifrado", `import hashlib`, `hashlib.sha256`, `hashlib.pbkdf2_hmac`. Breaks the I-Do/We-Do/You-Do coherence. |
| 3 | H | Internal ID / filename consistency | `src/lib/course/sections/s14-security.ts:1-4` + `index.ts:14` | Filename `s14-security.ts`, `id: "security"`, but `title: "NumPy y cómputo vectorizado"` and theory paragraph line 32: *"Stack: NumPy ndarray/ufunc/broadcast; sin pandas (S15) ni sklearn"*. | Same defect class as S13's `rpa-automation` id. Also affects `s06-numpy.ts` (id `numpy`, title *"Colecciones y estructuras de datos"*) and `s30-security-infra.ts` (id `security-infra`, title *"Entity resolution probabilístico"*) — systemic filename drift from an earlier curriculum reshuffle. |
| 4 | M | Orthographics — missing tilde on `Sí` | `selfCheck.questions[5].options[3]` (line 1629) | `"Si, de derecha a izquierda, cada dimensión es igual o una es 1 (o ausente)"` | LanguageTool rule `SI_AFIRMACION2`: the adverb of affirmation must carry tilde. The learner-facing MCQ option reads as a wrong conditional *"Si"* (if) instead of *"Sí"* (yes). |
| 5 | M | Redaction — long sentence | `theory[0].paragraphs[0]` (line 30) | "**Diccionario rápido:** **ndarray** (bloque homogéneo), **dtype** (tipo de cada elemento), **shape** (dimensiones), **máscara** (filtro booleano), **ufunc** (operación elemento a elemento), **broadcast** (alinear shapes), **view vs copy** (compartir o no la memoria), **NaN/inf** (ausencia o no-finito — no son ceros de negocio)." (41 w) | Eight glossary entries fused into one sentence; learner cannot anchor any term. Should be a `<ul>` or split into 2 sentences. |
| 6 | M | Redaction — long sentence | `theory[6].paragraphs[0]` (line 256) | "Para N grande (decenas de miles de clientes sintéticos del tablero), el ratio suele ser de órdenes de magnitud — el número exacto **depende de tu máquina**, por eso el demo reporta `ratio_gt_1` y no un SLA fijo." (38 w) | Three sub-ideas (magnitude claim + machine-dependency caveat + demo contract) packed into one sentence. |
| 7 | M | Redaction — long sentence | `theory[2].paragraphs[0]` (line 109) | "Las **reducciones** (`sum`, `mean`, `std`, `min`, `max`) colapsan uno o más ejes y son el corazón de las métricas de calidad del tablero: convierten una matriz de flags en un vector de completitud por campo." (35 w) | Definition + business relevance + worked effect in one breath. Readable but at the edge. |
| 8 | M | Redaction — long sentence | `youDo.context` (line 1456) | "Tú lo haces (You Do). Eres analista de data quality en una fintech peruana: con arrays sintéticos de flags de completitud e ids/scores por cliente (Lima/Arequipa/Cusco, `C00x`), implementas el núcleo vectorizado del tablero de calidad — métricas, señales por pares, benchmark loop vs `@` y tests `allclose`." (42 w) | Persona + scenario + scope + stack in one sentence. The opening "Tú lo haces (You Do)." could be its own line. |
| 9 | M | Redaction — long sentence | `youDo.portfolioNote` (line 1580) | "En el README del repo: documenta shapes y dtypes de cada métrica, el rtol/atol de allclose, el presupuesto de memoria si calculas matrices n×n, y aclara que el ratio de tiempo depende de la máquina (no es un SLA)." (39 w) | Portfolio instructions packed into a single instruction. Could be a 4-bullet list. |
| 10 | L | Anglicism density (cognitive load note) | `theory[4].paragraphs[1]` (line 185) and `theory[5].paragraphs[1]` (line 221) | *"Mutate un view muta el original … cuando una función 'solo normaliza un slice' … "*, *"un NaN no es cero: es ausencia de medición. Reporta la tasa de no-finitos aparte de la media de los finitos…"* | Sentence-level Spanish is correct, but the cumulative density of `view`, `copy`, `slice`, `writeable`, `flags`, `score`, `batch`, `baseline`, `loop`, `ratio`, `SLA`, `assert`, `flag(s)` in T3-A/T3-B sits at the cognitive-load ceiling. Acceptable but worth monitoring. |
| 11 | L | Anglicism — `memo` | `theory[6].paragraphs[2]` (line 258) and `youDo.portfolioNote` (line 1580) | *"Documenta el umbral de N en el memo del portfolio."* / *"…y aclara que el ratio de tiempo depende de la máquina…"* | `memo` is an English borrowing; the formal Spanish alternative is *memorando* or *nota*. Acceptable as portfolio jargon. |
| 12 | L | False-positive classes (LT) | `theory[1].paragraphs[1]` and `theory[7].paragraphs[0]` | LT rule `MORFOLOGIK_RULE_ES` fires 390 times across the section — every inline-code token (`ndarray`, `dtype`, `shape`, `ufunc`, `broadcast`, `keepdims`, `nanmean`, `nansum`, `allclose`, `isfinite`, `writeable`, `arange`, `linspace`, `unique`, `newaxis`, `None`, `rtol`, `atol`, `NaN`, `inf`, `dtype`, `itemsize`, `nbytes`, `np.*`, `perf_counter`, `ValueError`, `AssertionError`, `X @ w`, `pairwise_diff`, etc.) is flagged as a spelling error. | All 390 are false positives. The section is a *technical* course and these are legitimate NumPy API identifiers, mostly shown inside backticks. Filter disabled by default. |
| 13 | L | LT false-positive — `SUBJUNTIVO_INCORRECTO` on `copies` | `theory[0].paragraphs[3]` (line 33) | *"T3 Semántica (views/copies → NaN/inf) → T4 Rendimiento…"* | LT thinks `copies` is the subjunctive of *copiar*. In context it's the English plural noun, shown inline-code-adjacent. False positive. |
| 14 | L | LT false-positive — `PREP_VERB` on hints | We-Do hints like `"np.median(scores)."` (line 737), `"np.isnan(x).sum()."` (line 1136) | LT rule `PREP_VERB` flags `np.median(scores)` as "preposition followed by conjugated verb" because `scores` looks like a conjugated verb form. False positive — these are Python identifiers, not Spanish. | False positive class that recurs across the We-Do hints block. Filter when triaging. |
| 15 | L | LT false-positive — `UPPERCASE_SENTENCE_START` on paragraph concatenation | Across all paragraphs | The rule fires 9 times because my extraction concatenated paragraphs without sentence-final capitalisation boundaries. False positive caused by the audit pipeline. |
| 16 | L | Anaphoric monotony (mild) | Across theory[0]..theory[7] | Many theory blocks open with "**Diccionario rápido:**", "**Puente desde S13:**", "**Ancla:**"-style labels. This is the deliberate PyArcana schema (consistent across sections) and helps the learner orient — **not a flaw**. | No action needed; documented for the comparative-quality agent. |
| 17 | L | Inconsistent code-block title style | `theory[0].code.title` (line 52) etc. | `ndarray_basics.py`, `masks_index.py`, `ufuncs_reduce.py`, `broadcast.py`, `views_copies.py`, `nan_inf.py`, `vec_vs_loop.py`, `allclose_mem.py` — snake_case Python filenames (good). | Consistent and correct. |
| 18 | L | Callout type discipline | `theory[1].callout.type: "warning"` (line 99) etc. | The section uses `info`, `tip`, `warning`, `danger` callouts with clear semantic intent: `tip` for `keepdims`, `warning` for `Broadcast silencioso` and `Máscaras y longitudes`, `danger` for `Side effects por view`. | Good schema use; no issue. |

**Issue count by severity:** H = 3 (2 meta-leaks + 1 systemic filename drift), M = 6 (1 real orthographic + 5 long sentences), L = 9.

---

## 4. Meta-Leak Report

### 4.1 — URL hash mismatch (HIGH)

**Location in repo:** `src/lib/course/sections/s14-security.ts:4` (`id: "security"`) is consumed by `src/app/page.tsx:51-72`:

```ts
const hash = window.location.hash.slice(1)
// …
const section = COURSE_SECTIONS.find((s) => s.id === hash)
if (section) {
  setActiveSectionId(hash)
  setView('section')
}
```

**Exact evidence (live):**

```
agent-browser open https://pillb.github.io/pyarcana/
agent-browser eval 'Array.from(document.querySelectorAll("div[role=button]")).find(e=>/NumPy/.test(e.textContent))?.click(); "clicked"'
# → "clicked"
agent-browser eval 'location.hash + " | h1: " + document.querySelector("h1").textContent'
# → "#security | h1: NumPy y cómputo vectorizado"
```

So when a learner clicks the card titled *"14 · NumPy vectorizado"*, the URL bar literally reads `https://pillb.github.io/pyarcana/#security`. Sharing that URL on Slack/email says "security" but the recipient sees a NumPy page.

### 4.2 — Interactive playground shows wrong-section code (HIGH)

**Location in repo:** `src/components/course/SectionView.tsx:1432-1468`, in the `demos` dictionary of `InteractivePlaygroundDemo`. The dictionary is keyed by `section.id`; the lookup is `const demo = demos[sectionId]` (line 4046).

```ts
// === Phase 1 demos (S14-S26) — Pyodide-compatible (stdlib only) ===
'security': {
  title: 'Practica seguridad: hashing y cifrado',
  code: `# Practica seguridad con biblioteca estandar
import hashlib

# 1. Hash SHA-256 (irreversible - para passwords)
password = "mi_password_123"
hash_sha256 = hashlib.sha256(password.encode()).hexdigest()
print(f"Password: {password}")
print(f"SHA-256:  {hash_sha256}")

# 2. PBKDF2 con salt (mas seguro que SHA-256 solo)
# En produccion: salt = os.urandom(16) (aleatorio unico por usuario)
# Aqui usamos salt fijo para demo reproducible
salt = b"sal_demo_12345678"  # 16 bytes
key = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 100000)
print(f"\\nPBKDF2 (100k iteraciones): {key.hex()[:32]}...")
print(f"Salt: {salt.hex()[:16]}...")

# 3. Verificar password
def verificar_password(password, hash_guardado):
    """Compara hash del password ingresado con el guardado."""
    hash_ingresado = hashlib.sha256(password.encode()).hexdigest()
    return hash_ingresado == hash_guardado

print(f"\\nPassword correcto: {verificar_password('mi_password_123', hash_sha256)}")
print(f"Password incorrecto: {verificar_password('wrong', hash_sha256)}")`,
  expectedOutput: `Password: mi_password_123
SHA-256:  dcad9884ca445045900d381e4b0ce34413a8cc2e45d4d32f1d795b9cebc4306e

PBKDF2 (100k iteraciones): 8be36e32b6c83c53cc9585f0b41929c5...
Salt: 73616c5f64656d6f...

Password correcto: True
Password incorrecto: False`,
  hint: 'Cambia el numero de iteraciones de PBKDF2 y observa como cambia el hash',
},
```

**Exact evidence (live, rendered Section 14 page):**

```
agent-browser open https://pillb.github.io/pyarcana/#security
agent-browser eval 'document.querySelector("[data-testid^=demo-run-security]").textContent.slice(0, 500)'
# → "Practica seguridad: hashing y cifradoPython listoResetRun12345678910111213141516171819202122232425# Practica seguridad con biblioteca estandar\nimport hashlib\n\n# 1. Hash SHA-256 (irreversible - para passwords)\npassword = \"mi_password_123\"\nhash_sha256 = hashlib.sha256(password.encode()).hexdigest()\nprint(f\"Password: {password}\")\nprint(f\"SHA-256:  {hash_sha256}\")\n\n# 2. PBKDF2 con salt (mas seguro que SHA-256 solo)\n# En produccion: salt = os.urandom(16) (aleatorio unico por usuario)\n# Aqui usamos sa"
```

Live on the rendered page, immediately below the NumPy `allclose_mem.py` theory block and the *"rtol vs atol"* callout, the learner sees:

```
Pruébalo tú mismo
Editor interactivo en tu navegador
Este editor corre Python de verdad en tu browser (con Pyodide). Modifica el código, presione Run, y experimenta. No necesitas instalar nada.
Practica seguridad: hashing y cifrado
# Practica seguridad con biblioteca estandar
import hashlib
# 1. Hash SHA-256 (irreversible - para passwords)
…
```

This SHA-256/PBKDF2/password-hashing demo is **completely unrelated** to the section's actual NumPy content (arrays, dtype, máscaras, ufuncs, broadcast, views/copies, NaN/inf, vectorización, allclose). The learner has just been told *"Sin pandas (S15) ni sklearn"* and then is invited to experiment with `hashlib.pbkdf2_hmac`. The cognitive mismatch is severe.

### 4.3 — Systemic filename drift (HIGH, course-wide)

The same defect class affects the whole codebase — the filenames and `id` fields are stale leftovers from an earlier curriculum version:

| File | `id` field | `title` field | What the filename/id suggests |
|------|-----------|---------------|-------------------------------|
| `s06-numpy.ts` | `"numpy"` | "Colecciones y estructuras de datos" | NumPy |
| `s14-security.ts` | `"security"` | "NumPy y cómputo vectorizado" | Security |
| `s30-security-infra.ts` | `"security-infra"` | "Entity resolution probabilístico" | Security infra |
| `s42-graph-rag.ts` | `"graph-rag"` | "Schemas, seguridad y privacidad de servicios" | Graph RAG |
| `s44-multimodal.ts` | `"multimodal"` | "CI/CD y seguridad de la cadena de suministro" | Multimodal |

This is a **systemic off-by-N filename drift** from when the curriculum was reshuffled. Section 14's `id: "security"` is the most user-visible manifestation because (a) it leaks into the URL hash and (b) the SectionView playground dictionary still has the old `'security'` entry.

No developer comments ("TODO", "FIXME", "moved from section X", "XXX", "@author", "WIP", "placeholder") were found inside `s14-security.ts` itself — the section source file is clean of internal authoring residue.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 — Pedagogical structure (I Do / We Do / You Do fidelity)

**Theory tab.** Eight theory blocks, each with `heading`, 2-3 `paragraphs`, a `code` demo (Python with `output`), and a `callout` (tip/warning/info/danger). The opening block (`theory[0]`) is a "mapa de la sección" with a *Diccionario rápido* (8 glossary entries), a *Puente desde S13* (anchoring), a *hilo conductor* (scenario framing), and an *orden pedagógico* with a time budget (~18 h). This is the standard PyArcana schema and it is executed faithfully. The eight subtopics map cleanly to the I-Do demos and We-Do exercises (`S14-T1-A` through `S14-T4-B`), giving the learner a coherent subtopic graph.

**I Do.** 8 demos (`S14-T1-A-DEMO` … `S14-T4-B-DEMO`), each with `demoId`, `subtopicId`, `environment: "local-python"`, `description`, runnable `code` with `output`, and a `why` annotation. The intros make the pattern explicit: *"Observa el patrón: asertar contrato → calcular → imprimir evidencia."* This is excellent teach-the-teacher scaffolding.

**We Do.** 24 micro-exercises (8 subtopics × 3 levels E1/E2/E3), each with `id`, `subtopicId`, `kind` (`guided` → `independent` → `transfer`), `instruction`, two `hints` (progressive), `edgeCases` (typically 2), `tests`, `feedback`, `starterCode` (with a deliberate `CASO-LIM-014 · …` defect marker), and `solutionCode` (with `output`). This is the gold-standard scaffold for a Competente-level section. The progression from `guided` → `independent` → `transfer` within each subtopic gives the learner graduated release.

**You Do.** A capstone `quality_board_numpy.py` with five functions to implement (`completeness`, `uniqueness_rate`, `in_range_rate`, `pairwise_diff`, `bench_weighted_mean`), a `_run_tests()` oracle with concrete fixtures (the test for `in_range_rate` is particularly good — it tests both NaN-only and ±inf cases), a `main()`, and `if __name__ == "__main__": main()`. The portfolioNote tells the learner exactly what to document in the README. The rubric has 6 criteria summing to 100% (25/20/20/15/10/10) and explicitly weights *Privacidad: sin PII real, sin secretos, fixtures sintéticos* at 20% — a deliberate ethical guardrail.

**Self-check.** 11 multiple-choice questions, each with 4 options, `correctIndex`, and an `explanation`. The questions cover exactly the cognitive traps of the section: `dtype` vs `shape` vs `ndim`, `axis=0` collapses filas, view ≠ copy, `np.mean` vs `np.nanmean`, `np.unique` for `uniqueness_rate`, `writeable=False` raises `ValueError`, `np.allclose` purpose, `nbytes` for float64, broadcast rule, honest benchmark requirements. Excellent alignment.

### 5.2 — Connective tissue and narrative flow

The section's narrative arc is explicit:
- **Ancla (anchor):** `theory[0]` opens with *Diccionario rápido* + *Puente desde S13*. The Puente sentence is exemplary: *"el dashboard de evidencia de S13 trabaja reglas y scores por caso, con listas y dicts de Python y sin NumPy. Aquí abres el nivel 2 (CP-N2-A): pasas de juicios por reglas a vectores numéricos sobre lotes sintéticos. En S15 (pandas) cargarás tablas; en S14 el contrato es el array homogéneo que alimentará esas métricas."*
- **Hilo conductor:** A *tablero de calidad* (completitud, unicidad, rangos, señales por pares) on synthetic LatAm data (Lima/Arequipa/Cusco, ids `C00x`).
- **Stack contract:** Repeated in every block — *"sin pandas (S15) ni sklearn"* (theory[0]), *"Solo NumPy; no pandas (S15) ni sklearn; corrige el bug del starter"* (We-Do instructions), *"Sin PII real; sin pandas ni sklearn"* (You-Do requirements).
- **Fail-closed refrain:** Repeated 6+ times across theory + callouts — *"aserta y falla de forma segura"*, *"mejor un error ruidoso que un producto silencioso mal alineado"*, *"Falla de forma segura (fail-closed): si el batch trae inf donde no es semántico, rechaza el lote o filtra con traza — no sustituyas por 0 en silencio"*, *"no 'arregles' en silencio"*.
- **Forward references:** S15 (pandas) is mentioned 7 times across theory and exercises — explicit *bridge forward* to the next section. This is exactly the right progressive-disclosure pattern.
- **Portfolio increment:** `CP-N2-A` is named 9 times across theory, I-Do, We-Do, You-Do and portfolioNote — the section never loses sight of the deliverable.

### 5.3 — Cognitive load and progressive disclosure

The order T1 (Arrays) → T2 (Operaciones) → T3 (Semántica) → T4 (Rendimiento) is correct: it builds from the data structure (ndarray) outward through operations, then semantics (views/copies/NaN), then performance (vectorisation, memory, allclose). Each block introduces at most one new primitive family (creation → masking → reductions → broadcast → views → NaN → timing → tolerance). The 18-hour budget is split explicitly: *"sesiones 1–2 solo T1; 3–4 T2; 5–6 T3; 7–8 T4 + You Do + self-check."*

The *Diccionario rápido* (8 terms) is offered up-front as a reference, with the explicit instruction *"No memorices la API entera el primer día: cada término vuelve en su subtema con demo y práctica."* This is good adult-learning practice.

The only cognitive-load concern is the *Diccionario rápido* sentence itself (41 w, 8 glossary entries in one breath) — see Issue #5. A `<ul>` of 8 bullets would be far easier to scan.

### 5.4 — Exercise and exam quality and alignment

The 24 We-Do exercises are exceptionally well-aligned to the 8 theory blocks (3:1 ratio of exercises to theory blocks, with each subtopic receiving a guided/independent/transfer triplet). Each `starterCode` carries a single deliberate defect (annotated `# CASO-LIM-014 · <topic>` and `# Bug a corregir: <description>`) — the learner fixes exactly one bug to reach the `solutionCode` output. Examples of the bug variety:

- `S14-T1-A-E1`: shape invertida (`flags.shape[::-1]`)
- `S14-T1-A-E2`: `arange` instead of `linspace`
- `S14-T1-A-E3`: missing `ndim`/`dtype` validation
- `S14-T1-B-E1`: umbral invertido (`< 0.5` instead of `>= 0.5`)
- `S14-T2-A-E2`: `len(ids)/len(ids)` instead of `np.unique(ids).size/ids.size`
- `S14-T2-A-E3`: centering by `axis=0` instead of `axis=1`
- `S14-T2-B-E3`: shapes (2,3)+(2,3) instead of (2,3)+(2,4)
- `S14-T3-A-E1`: `.copy()` silences the view mutation
- `S14-T3-A-E2`: missing `.copy()`, raw mutates
- `S14-T3-A-E3`: missing `flags.writeable=False`
- `S14-T3-B-E1`: `x == np.nan` (always False) instead of `np.isnan(x)`
- `S14-T3-B-E2`: `np.mean` propagates NaN instead of `np.nanmean`
- `S14-T3-B-E3`: `np.sum` with `inf` gives `inf` instead of `np.where(isinf, nan, x)` + `nansum`
- `S14-T4-A-E1`: prints `False` without comparing
- `S14-T4-A-E2`: `a.sum()` (linear) instead of `(a**2).sum()` (squares)
- `S14-T4-A-E3`: loop without `mean` check
- `S14-T4-B-E1`: compares `nbytes == 4000` (float32) instead of `== 8000` (float64)
- `S14-T4-B-E2`: exact `==` on floats instead of `np.allclose`
- `S14-T4-B-E3`: assert passes (identical values) instead of forcing a difference

Each bug is a real-world footgun that an analyst in a Peruvian fintech would actually encounter. The `solutionCode` outputs are deterministic and short, suitable for a string-equality oracle.

The self-check 11-question quiz covers exactly the cognitive traps listed above. The `correctIndex` values are correct (verified manually for all 11 questions).

### 5.5 — Consistency with the overall roadmap

The section sits exactly where the roadmap says it should: between S13 (Phase-0 close, Familiarity Evidence Dashboard) and S15 (Pandas ingesta). The `jobRelevance` field names *data quality y analytics de banca, fintech y retail en Perú* and the portfolio increment *CP-N2-A*. The forward references to S15 (pandas) and the back reference to S13 (Evidence Dashboard) are explicit and correct. The tagline mentions *"resultados equivalentes al baseline"* — that baseline concept is established here and reused in S17 (Joins · groupby · cierre). The ethical guardrail *"Nunca PII real ni scores tratados como culpa"* (line 33) is the same refrain used in S11–S13.

### 5.6 — Comparison with best-in-class external materials

The section's pedagogical schema is **comparable to or better than** external gold-standard NumPy introductions:

- **NumPy absolute beginners (numpy.org)** — the section covers everything in the official tutorial (ndarray, dtype, shape, indexing, máscaras, ufuncs, broadcast, allclose) plus *fail-closed contract enforcement* and *honest benchmark* practices that the official tutorial doesn't teach.
- **Python for Data Analysis (McKinney)** — the section mirrors the book's "mental model first, API second" approach, but adds the *score tablero de calidad* scenario that grounds every concept in a Peruvian fintech use case.
- **From Python to NumPy (Rougier)** — the section's *vectorización frente a loops* block (theory[6]) and `bench_weighted_mean` You-Do function implement exactly Rougier's "vectorized mindset" pedagogy.
- **MIT 6.0001 / Harvard CS50P** — these are referenced in the resources block as foundational prerequisites; the section's *contrato dtype/shape* enforcement is more disciplined than either course.

The only external feature missing here that those sources have is a *visual diagram* of broadcast (the section explains it textually with the "derecha a izquierda" rule and the `agg[:, None] - agg[None, :]` worked example). A small diagram would help — but the section's worked example is sufficient.

---

## 6. Grammatical improvements and rewriting report (paragraph by paragraph, by tab)

**Method note.** Per the shared grammar subplan (`_GRAMMAR_SUBPLAN.md`), every learner-facing Spanish paragraph and sentence in Section 14 was scored with three surface metrics (Fernández-Huerta 1959, Szigriszt-Pazos/INFLESZ, words-per-sentence and syllables-per-word) and run through the rule-based Spanish heuristics (run-on/long sentence detection, terminal punctuation pairing, `¿`/`¡` pairing, delimiter balance, repeated-word detection, gerund pile-up, comma density, anaphoric monotony). Additionally, the full prose corpus was sent to the **LanguageTool public API** (`language=es`, 2 chunks, 5-second throttle) for rule-based grammar/style/typography checks.

**Global metrics for Section 14:**

| Metric | Value | Interpretation |
|---|---|---|
| Prose blocks | 229 | — |
| Sentences | 325 | — |
| Words | 3 706 | — |
| **Words per sentence (WPS)** | **11.4** | Below the 15–32 target band — section favours short, contract-driven sentences. Excellent for a technical Competente-level curriculum. |
| **Syllables per word (SPW)** | **1.99** | Slightly below the typical 2.1–2.3 ES range; reflects inline-code tokens (`np.*`, `dtype`, `shape`) that are short. |
| **Fernández-Huerta (FH)** | **75.6** | Band: *normal* (60–70 is *normal*, 70–80 is *bastante fácil*). Right difficulty for the level. |
| **INFLESZ** | **71.3** | Band: *normal* (55–65 normal, 66–80 bastante fácil). Aligned with FH. |
| Heuristic issues | H=0, M=129, L=5 | Most M findings are *missing terminal punctuation* (118) — these are short labels/option strings (e.g. `"axis=0 en una reducción sobre una matriz 2D suele agregar:"`) that end in `:` or are MCQ fragments; false positives in this technical context. After filtering, **5 real long-sentence findings + 1 real LT finding**. |
| LanguageTool matches | 423 total (390 `MORFOLOGIK_RULE_ES` false positives on inline-code tokens + 9 `UPPERCASE_SENTENCE_START` false positives from concatenation + 8 `PUNTO_EN_ABREVIATURAS` false positives on `p. ej.` + 1 real `SI_AFIRMACION2` finding + several `PREP_VERB`/`SUBJUNTIVO_INCORRECTO` false positives on Python identifiers). | One actionable finding: `"Si, de derecha a izquierda"` → `"Sí, …"`. |

**Worst sentences (longest / with H/M findings):**

| Rank | Block | Key | WC | Issue | Excerpt |
|---|---|---|---|---|---|
| 1 | bi=154 | `context` (You-Do) | 42 | M long | "Eres analista de data quality en una fintech peruana: con arrays sintéticos de flags de completitud e ids/scores por cliente (Lima/Arequipa/Cusco, `C00x`), implementas el núcleo vectorizado del tablero de calidad — métricas, señales por pares, benchmark loop vs `@` y tests `allclose`." |
| 2 | bi=13 | `paragraphs` (theory[0]) | 41 | M long + L high comma density | "**Diccionario rápido:** **ndarray** (bloque homogéneo), **dtype** (tipo de cada elemento), **shape** (dimensiones), **máscara** (filtro booleano), **ufunc** (operación elemento a elemento), **broadcast** (alinear shapes), **view vs copy** (compartir o no la memoria), **NaN/inf** (ausencia o no-finito — no son ceros de negocio)." |
| 3 | bi=163 | `portfolioNote` (You-Do) | 39 | M long | "En el README del repo: documenta shapes y dtypes de cada métrica, el rtol/atol de allclose, el presupuesto de memoria si calculas matrices n×n, y aclara que el ratio de tiempo depende de la máquina (no es un SLA)." |
| 4 | bi=54 | `paragraphs` (theory[6]) | 38 | M long | "Para N grande (decenas de miles de clientes sintéticos del tablero), el ratio suele ser de órdenes de magnitud — el número exacto **depende de tu máquina**, por eso el demo reporta `ratio_gt_1` y no un SLA fijo." |
| 5 | bi=32 | `paragraphs` (theory[2]) | 35 | M long | "Las **reducciones** (`sum`, `mean`, `std`, `min`, `max`) colapsan uno o más ejes y son el corazón de las métricas de calidad del tablero: convierten una matriz de flags en un vector de completitud por campo." |

### 6.1 — Theory tab — paragraph-by-paragraph rewriting

The theory tab has 8 blocks × ~3 paragraphs = ~24 paragraphs. The five flagged for length are below.

#### Theory[0] · paragraph[0] (line 30) — Diccionario rápido
**Before (41 w):**
> **Diccionario rápido:** **ndarray** (bloque homogéneo), **dtype** (tipo de cada elemento), **shape** (dimensiones), **máscara** (filtro booleano), **ufunc** (operación elemento a elemento), **broadcast** (alinear shapes), **view vs copy** (compartir o no la memoria), **NaN/inf** (ausencia o no-finito — no son ceros de negocio).

**After (as a Markdown list — drops to ≤10 w per item, anaphoric monotony eliminated by parallel structure):**
> **Diccionario rápido (léelo antes de T1; vuelve cuando un término te detenga):**
>
> - **ndarray** — bloque homogéneo de datos.
> - **dtype** — tipo de cada elemento.
> - **shape** — tupla de dimensiones.
> - **máscara** — filtro booleano del mismo shape.
> - **ufunc** — operación elemento a elemento.
> - **broadcast** — alineación automática de shapes.
> - **view vs copy** — compartir o no la memoria subyacente.
> - **NaN/inf** — ausencia o no-finito; **no son ceros de negocio**.

#### Theory[0] · paragraph[2] (line 32) — hilo conductor
**Before (33 w):** *"El hilo conductor es un **tablero de calidad** (completitud, unicidad, rangos, señales por pares) en NumPy. Solo datos sintéticos latam (Lima/Arequipa/Cusco, ids `C00x`). Si el shape o dtype no cumple el contrato de la función, **aserta y falla de forma segura** (fail-closed) — no "arregles" en silencio. Stack: NumPy ndarray/ufunc/broadcast; **sin** pandas (S15) ni sklearn."*

**After (split into 4 short sentences; WPS drops from 16 to 8):**
> El hilo conductor es un **tablero de calidad** en NumPy: completitud, unicidad, rangos y señales por pares. Solo datos sintéticos LatAm (Lima/Arequipa/Cusco, ids `C00x`). Si el shape o dtype no cumple el contrato de la función, **aserta y falla de forma segura** (fail-closed) — no "arregles" en silencio. Stack: NumPy ndarray/ufunc/broadcast; **sin** pandas (S15) ni sklearn.

#### Theory[2] · paragraph[0] (line 109) — Las reducciones
**Before (35 w):** *"Las **reducciones** (`sum`, `mean`, `std`, `min`, `max`) colapsan uno o más ejes y son el corazón de las métricas de calidad del tablero: convierten una matriz de flags en un vector de completitud por campo."*

**After (two sentences):**
> Las **reducciones** (`sum`, `mean`, `std`, `min`, `max`) colapsan uno o más ejes. Son el corazón de las métricas del tablero: convierten una matriz de flags en un vector de completitud por campo.

#### Theory[6] · paragraph[0] (line 256) — Para N grande
**Before (38 w):** *"Un loop Python elemento a elemento paga el intérprete en cada iteración. NumPy mueve el trabajo a código C vectorizado (`dot`, ufuncs, `@`). Para N grande (decenas de miles de clientes sintéticos del tablero), el ratio suele ser de órdenes de magnitud — el número exacto **depende de tu máquina**, por eso el demo reporta `ratio_gt_1` y no un SLA fijo."*

**After (split the long sentence):**
> Un loop Python elemento a elemento paga el intérprete en cada iteración. NumPy mueve el trabajo a código C vectorizado (`dot`, ufuncs, `@`). Para N grande (decenas de miles de clientes sintéticos del tablero), el ratio suele ser de órdenes de magnitud. El número exacto **depende de tu máquina**; por eso el demo reporta `ratio_gt_1` y no un SLA fijo.

#### Theory[2] · paragraph[1] (line 110) — axis=0/axis=1 (no change needed, 22 w)
**Original:** *"`axis=0` agrega por columna (campo); `axis=1` por fila (cliente). `keepdims=True` preserva dimensiones para rebroadcast (restar la media por fila sin pelear shapes). Elige el eje por el significado de negocio — '¿agrego clientes o campos?' — no por costumbre de copiar un notebook."*

**Verdict:** Within target band (22 w/sentence average). Business-significance framing is excellent. Keep as is.

### 6.2 — I Do tab

**I-Do intro (line 332).** 29 w/sentence, OK. The intro is a single tight sentence: *"Yo demuestro (I Do): 8 demos trabajados de punta a punta — contrato dtype/shape, máscaras, reducciones y unicidad, broadcast con señales por pares, views/copies, NaN/inf, benchmark honesto y allclose/memoria. Observa el patrón: asertar contrato → calcular → imprimir evidencia. Datos sintéticos Lima/Arequipa/Cusco; solo NumPy."* Three sentences, clear contract, no rewrite needed.

**Demo `why` annotations (8 × ~10 w).** Each demo has a one-sentence `why` (e.g. *"Fija el contrato dtype/shape antes de calcular métricas de calidad."*, *"Broadcast documentado evita ValueError y fan-out silencioso de shapes."*). All within target band; no rewrite needed.

**Demo `description` fields (8 × ~12 w).** Each demo has a one-sentence `description` (e.g. *"Crear arrays de flags y scores con dtype/shape documentados y validar ndim"*). All within target band; no rewrite needed.

### 6.3 — We Do tab

**We-Do intro (line 579).** 29 w (single long sentence). Readable and on-pattern with S13: *"Lo hacemos juntos (We Do): 24 micro-ejercicios (E1 guiado → E2 independiente → E3 transferencia) en los 8 subtemas. Cada starter trae un bug deliberado; corrígelo hasta igualar la salida esperada. Dos pistas por ejercicio. Solo NumPy (sin pandas ni sklearn)."* Three short sentences + one medium. Keep as is.

**24 `instruction` fields (avg 30 w, max ~45 w).** Each instruction specifies the E-level, the task, the expected output, and the bug to fix. The longest ones reach the long-sentence threshold but are instruction-list-flavoured (acceptable for procedural text). Example of the longest:

> "E2 (independiente) — Con `a` de shape `(4,)` crea columna `(4, 1)` con `newaxis` y multiplica por `b` de shape `(3,)`; imprime shape y valores del producto. Salida esperada: `(4, 3) [[0, 0, 0], [0, 1, 2], [0, 2, 4], [0, 3, 6]]`. Solo NumPy; no pandas (S15) ni sklearn; corrige el bug del starter (multiplicar sin reshape)."

This is 51 w but reads as three fused mini-clauses (task → expected output → constraint + bug hint). Could be split for clarity:

**After:**
> "E2 (independiente) — Con `a` de shape `(4,)` crea columna `(4, 1)` con `newaxis` y multiplica por `b` de shape `(3,)`. Imprime shape y valores del producto. Salida esperada: `(4, 3) [[0, 0, 0], [0, 1, 2], [0, 2, 4], [0, 3, 6]]`. Solo NumPy (no pandas ni sklearn). Corrige el bug del starter: hoy multiplica sin reshape."

**`hints` arrays (24 × 2 hints, avg 6 w).** All short and direct (e.g. *"np.isnan(x).sum()."*). No rewrite needed.

**`edgeCases` arrays (25 entries, avg 7 w).** Short and targeted (e.g. *"usar x == np.nan (siempre False)"*). No rewrite needed.

### 6.4 — You Do tab

**`context` (line 1456, 42 w) — the longest sentence in the section.**
**Before:** *"Tú lo haces (You Do). Eres analista de data quality en una fintech peruana: con arrays sintéticos de flags de completitud e ids/scores por cliente (Lima/Arequipa/Cusco, `C00x`), implementas el núcleo vectorizado del tablero de calidad — métricas, señales por pares, benchmark loop vs `@` y tests `allclose`. Sin PII real. Este incremento abre **CP-N2-A**."*

**After (split the long sentence into two):**
> Tú lo haces (You Do). Eres analista de data quality en una fintech peruana. Con arrays sintéticos de flags de completitud e ids/scores por cliente (Lima/Arequipa/Cusco, `C00x`), implementas el núcleo vectorizado del tablero de calidad: métricas, señales por pares, benchmark loop vs `@` y tests `allclose`. Sin PII real. Este incremento abre **CP-N2-A**.

**`portfolioNote` (line 1580, 39 w).**
**Before:** *"Este incremento abre CP-N2-A (Executive Data Quality & EDA). En el README del repo: documenta shapes y dtypes de cada métrica, el rtol/atol de allclose, el presupuesto de memoria si calculas matrices n×n, y aclara que el ratio de tiempo depende de la máquina (no es un SLA). Sube solo datos sintéticos — nunca PII real."*

**After (split into a 4-bullet list):**
> Este incremento abre CP-N2-A (Executive Data Quality & EDA). En el README del repo documenta:
>
> - shapes y dtypes de cada métrica;
> - el `rtol`/`atol` de `allclose`;
> - el presupuesto de memoria si calculas matrices n×n;
> - que el ratio de tiempo depende de la máquina (no es un SLA).
>
> Sube solo datos sintéticos — nunca PII real.

**`objectives` (4 bullets, avg 12 w).** Tight and parallel (*"Implementar métricas…"*, *"Calcular señales…"*, *"Benchmark loop vs vectorizado…"*, *"Presupuesto de memoria y tests reproducibles…"*). Keep as is.

**`requirements` (6 bullets, avg 12 w).** Tight and actionable. Keep as is.

### 6.5 — Self-check tab

**11 `question` fields (avg 11 w).** All clear, all use proper `¿…?` Spanish question-mark pairing. No issues. Examples:
- *"¿Qué atributo del ndarray indica el tipo homogéneo de sus elementos?"* ✓
- *"¿Por qué `np.mean([1, np.nan])` no es lo mismo que `np.nanmean([1, np.nan])`?"* ✓
- *"¿Cuándo son compatibles dos shapes para broadcasting?"* ✓

**`options` arrays (4 × 11 = 44 entries, avg 10 w).** All grammatical. The one real issue is the missing tilde on `Sí`:

**Before (line 1629, `selfCheck.questions[5].options[3]`):**
> "Si, de derecha a izquierda, cada dimensión es igual o una es 1 (o ausente)"

**After:**
> "Sí, de derecha a izquierda: cada dimensión es igual, o una es 1, o está ausente"

(Also dropped the comma splice and used a colon for cleaner enumeration.)

**11 `explanation` fields (avg 22 w).** All grammatical, all reinforce the cognitive trap. Example: *"np.mean propaga NaN (el resultado es nan). np.nanmean omite NaNs y promedia el resto. En calidad de datos usa isfinite/nanmean según la política."* Keep as is.

### 6.6 — Summary of redaction pass

- 5 long sentences → 5 proposed rewrites (all split or list-ified).
- 1 real orthographic error (`Sí` missing tilde) → 1 proposed fix.
- 0 run-on sentences (>45 w).
- 0 unbalanced delimiters in real prose (the 6 LT "unbalanced" findings are all from inline-code spans that my pipeline stripped).
- 0 missing `¿`/`¡` pairs.
- 0 repeated words.
- Tagline starts with lowercase ("cálculo vectorizado…") — this is a deliberate style choice (the tagline is a continuation of the section title); keep as is.

---

## 7. Proposed GitHub-style Diffs (one per issue or logical group)

### Diff 7.1 — Fix the `id` field (HIGH — Meta-leak #1)

The cleanest fix is to rename the `id` to `"numpy-vectorizado"` (matches the shortTitle and avoids collision with `s06-numpy.ts`'s `id: "numpy"`). This is a one-line change in the section file plus an `editorSamples`-style update in `SectionView.tsx`.

```diff
--- a/src/lib/course/sections/s14-security.ts
+++ b/src/lib/course/sections/s14-security.ts
@@ -1,7 +1,7 @@
 import type { CourseSection } from '../../types'
 
 export const section14: CourseSection = {
-  id: "security",
+  id: "numpy-vectorizado",
   index: 14,
   title: "NumPy y cómputo vectorizado",
   shortTitle: "NumPy vectorizado",
```

> **Side effects:** Any persisted learner progress keyed by `section.id === "security"` will lose its place. Mitigation: ship a one-time localStorage migration in `src/lib/progress-store.ts` that maps `"security"` → `"numpy-vectorizado"`. The same migration should handle S06 (`numpy`), S13 (`rpa-automation`), S30 (`security-infra`), S42 (`graph-rag`), S44 (`multimodal`).

### Diff 7.2 — Replace the security playground with a NumPy playground (HIGH — Meta-leak #2)

Either rename the existing key (preferred, after Diff 7.1) or replace the security demo content with NumPy content. The latter keeps backward-compat for any persisted `#security` URL.

```diff
--- a/src/components/course/SectionView.tsx
+++ b/src/components/course/SectionView.tsx
@@ -1431,8 +1431,27 @@
     // === Phase 1 demos (S14-S26) — Pyodide-compatible (stdlib only) ===
-    'security': {
-      title: 'Practica seguridad: hashing y cifrado',
-      code: `# Practica seguridad con biblioteca estandar
-import hashlib
-
-# 1. Hash SHA-256 (irreversible - para passwords)
-password = "mi_password_123"
-hash_sha256 = hashlib.sha256(password.encode()).hexdigest()
-print(f"Password: {password}")
-print(f"SHA-256:  {hash_sha256}")
-
-# 2. PBKDF2 con salt (mas seguro que SHA-256 solo)
-# En produccion: salt = os.urandom(16) (aleatorio unico por usuario)
-# Aqui usamos salt fijo para demo reproducible
-salt = b"sal_demo_12345678"  # 16 bytes
-key = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 100000)
-print(f"\\nPBKDF2 (100k iteraciones): {key.hex()[:32]}...")
-print(f"Salt: {salt.hex()[:16]}...")
-
-# 3. Verificar password
-def verificar_password(password, hash_guardado):
-    """Compara hash del password ingresado con el guardado."""
-    hash_ingresado = hashlib.sha256(password.encode()).hexdigest()
-    return hash_ingresado == hash_guardado
-
-print(f"\\nPassword correcto: {verificar_password('mi_password_123', hash_sha256)}")
-print(f"Password incorrecto: {verificar_password('wrong', hash_sha256)}`,
-      expectedOutput: `Password: mi_password_123
-SHA-256:  dcad9884ca445045900d381e4b0ce34413a8cc2e45d4d32f1d795b9cebc4306e
-
-PBKDF2 (100k iteraciones): 8be36e32b6c83c53cc9585f0b41929c5...
-Salt: 73616c5f64656d6f...
-
-Password correcto: True
-Password incorrecto: False`,
-      hint: 'Cambia el numero de iteraciones de PBKDF2 y observa como cambia el hash',
+    'numpy-vectorizado': {
+      title: 'Practica NumPy: máscaras y reducciones',
+      code: `# Practica NumPy vectorizado (se carga automáticamente en Pyodide)
+import numpy as np
+
+# 1. Array de flags de completitud (1 = presente, 0 = ausente)
+flags = np.array([[1, 1, 0], [1, 0, 1], [1, 1, 1]], dtype=np.uint8)
+print("dtype", flags.dtype, "shape", flags.shape)
+
+# 2. Completitud por campo (axis=0) y por cliente (axis=1)
+por_campo = flags.mean(axis=0)
+por_cliente = flags.mean(axis=1)
+print("por_campo", np.round(por_campo, 3).tolist())
+print("por_cliente", np.round(por_cliente, 3).tolist())
+
+# 3. Máscara booleana: clientes con completitud baja
+umbral = 0.7
+bajo = por_cliente < umbral
+print("bajo_umbral", bajo.tolist())
+
+# 4. allclose contra un baseline
+base = np.array([2/3, 2/3, 1.0])
+print("allclose", np.allclose(por_cliente, base, atol=1e-3))`,
+      expectedOutput: `dtype uint8 shape (3, 3)
+por_campo [1.0, 0.667, 0.667]
+por_cliente [0.667, 0.667, 1.0]
+bajo_umbral [True, True, False]
+allclose True`,
+      hint: 'Cambia el umbral a 0.5 y observa cuántos clientes quedan abajo',
     },
```

### Diff 7.3 — Fix the missing tilde on `Sí` (MEDIUM — Issue #4)

```diff
--- a/src/lib/course/sections/s14-security.ts
+++ b/src/lib/course/sections/s14-security.ts
@@ -1626,7 +1626,7 @@
         question: "¿Cuándo son compatibles dos shapes para broadcasting?",
         options: [
           "Solo si son idénticos",
           "Si el producto de las dimensiones coincide",
           "Solo con keepdims=True",
-          "Si, de derecha a izquierda, cada dimensión es igual o una es 1 (o ausente)",
+          "Sí, de derecha a izquierda: cada dimensión es igual, o una es 1, o está ausente",
         ],
         correctIndex: 3,
```

### Diff 7.4 — Split the *Diccionario rápido* sentence into a list (MEDIUM — Issue #5)

```diff
--- a/src/lib/course/sections/s14-security.ts
+++ b/src/lib/course/sections/s14-security.ts
@@ -27,9 +27,17 @@
     {
       heading: "Mapa de la sección: NumPy para un tablero de calidad",
       paragraphs: [
-        "**Diccionario rápido:** **ndarray** (bloque homogéneo), **dtype** (tipo de cada elemento), **shape** (dimensiones), **máscara** (filtro booleano), **ufunc** (operación elemento a elemento), **broadcast** (alinear shapes), **view vs copy** (compartir o no la memoria), **NaN/inf** (ausencia o no-finito — no son ceros de negocio). No memorices la API entera el primer día: cada término vuelve en su subtema con demo y práctica.",
+        "**Diccionario rápido** (léelo antes de T1; vuelve cuando un término te detenga):\n\n- **ndarray** — bloque homogéneo de datos.\n- **dtype** — tipo de cada elemento.\n- **shape** — tupla de dimensiones.\n- **máscara** — filtro booleano del mismo shape.\n- **ufunc** — operación elemento a elemento.\n- **broadcast** — alineación automática de shapes.\n- **view vs copy** — compartir o no la memoria subyacente.\n- **NaN/inf** — ausencia o no-finito; **no son ceros de negocio**.\n\nNo memorices la API entera el primer día: cada término vuelve en su subtema con demo y práctica.",
         "**Puente desde S13:** el dashboard de evidencia de S13 trabaja reglas y scores **por caso**, con listas y dicts de Python y **sin NumPy**. Aquí abres el nivel 2 (**CP-N2-A**): pasas de juicios por reglas a **vectores numéricos** sobre lotes sintéticos. En S15 (pandas) cargarás tablas; en S14 el contrato es el array homogéneo que alimentará esas métricas.",
         "El hilo conductor es un **tablero de calidad** (completitud, unicidad, rangos, señales por pares) en NumPy. Solo datos sintéticos latam (Lima/Arequipa/Cusco, ids `C00x`). Si el shape o dtype no cumple el contrato de la función, **aserta y falla de forma segura** (fail-closed) — no “arregles” en silencio. Stack: NumPy ndarray/ufunc/broadcast; **sin** pandas (S15) ni sklearn.",
         "Orden: **T1 Arrays** (dtype/shape → máscaras) → **T2 Operaciones** (ufuncs/reducciones → broadcast) → **T3 Semántica** (views/copies → NaN/inf) → **T4 Rendimiento** (vectorizar → memoria y `allclose`). Ritmo sugerido (~18 h): sesiones 1–2 solo T1; 3–4 T2; 5–6 T3; 7–8 T4 + You Do + self-check. Criterio de entrega del incremento: métricas vectorizadas equivalentes al baseline en loop dentro de tolerancia (`allclose`). Nunca PII real ni scores tratados como culpa.",
       ],
```

> **Note:** `RichText` (the renderer) must support newlines-as-list-rendering in this field. Verify in `src/components/course/RichText.tsx`; if not, use a `<ul>` HTML escape or split into 8 separate `paragraphs` entries.

### Diff 7.5 — Split the "Las reducciones" sentence (MEDIUM — Issue #7)

```diff
--- a/src/lib/course/sections/s14-security.ts
+++ b/src/lib/course/sections/s14-security.ts
@@ -106,7 +106,8 @@
       paragraphs: [
-        "Las **ufuncs** (`np.add`, `np.sqrt`, operadores `+`, `*`) aplican elemento a elemento en código compilado, sin un `for` Python por celda. Las **reducciones** (`sum`, `mean`, `std`, `min`, `max`) colapsan uno o más ejes y son el corazón de las métricas de calidad del tablero: convierten una matriz de flags en un vector de completitud por campo.",
+        "Las **ufuncs** (`np.add`, `np.sqrt`, operadores `+`, `*`) aplican elemento a elemento en código compilado, sin un `for` Python por celda. Las **reducciones** (`sum`, `mean`, `std`, `min`, `max`) colapsan uno o más ejes. Son el corazón de las métricas del tablero: convierten una matriz de flags en un vector de completitud por campo.",
         "`axis=0` agrega por columna (campo); `axis=1` por fila (cliente). `keepdims=True` preserva dimensiones para rebroadcast (restar la media por fila sin pelear shapes). Elige el eje por el significado de negocio — “¿agrego clientes o campos?” — no por costumbre de copiar un notebook.",
         "Métricas del tablero: `mean(flags, axis=0)` = completitud por campo; `mean` por fila = completitud del cliente; `std(scores)` = dispersión. **Unicidad** de ids sintéticos: `n_unique / n = np.unique(ids).size / ids.size` (un duplicado en `C00x` baja la tasa; no uses `len(ids)/len(ids)`). Caso sintético: matriz 3×3 de presencia → completitud por campo ~[1.0, 0.67, 0.67] y global ~0.78; unicidad de `['C001','C002','C001']` → 2/3.",
       ],
```

### Diff 7.6 — Split the "Para N grande" sentence (MEDIUM — Issue #6)

```diff
--- a/src/lib/course/sections/s14-security.ts
+++ b/src/lib/course/sections/s14-security.ts
@@ -253,7 +253,8 @@
       paragraphs: [
-        "Un loop Python elemento a elemento paga el intérprete en cada iteración. NumPy mueve el trabajo a código C vectorizado (`dot`, ufuncs, `@`). Para N grande (decenas de miles de clientes sintéticos del tablero), el ratio suele ser de órdenes de magnitud — el número exacto **depende de tu máquina**, por eso el demo reporta `ratio_gt_1` y no un SLA fijo.",
+        "Un loop Python elemento a elemento paga el intérprete en cada iteración. NumPy mueve el trabajo a código C vectorizado (`dot`, ufuncs, `@`). Para N grande (decenas de miles de clientes sintéticos del tablero), el ratio suele ser de órdenes de magnitud. El número exacto **depende de tu máquina**; por eso el demo reporta `ratio_gt_1` y no un SLA fijo.",
         "Benchmark **honesto**: mismo input, mismo dtype, `time.perf_counter` (no `time.time`), reporta `ratio_loop_over_vec` y verifica **equivalencia numérica** (`allclose` o `abs(s_loop - s_vec) < 1e-6`). No midas N=10, no imprimas dentro del loop y no omitas el check de igualdad: un ratio sin equivalencia no demuestra que la versión vectorizada sea correcta.",
         "A veces un loop claro gana en N pequeño o con lógica irregular (early-exit, ramas por cliente). Documenta el umbral de N en el memo del portfolio. Caso sintético: `n=50_000` producto punto loop vs `np.dot` con `equal True` y `ratio_gt_1 True` en una laptop típica — en el portfolio CP-N2-A repites el patrón con `X @ w`.",
       ],
```

### Diff 7.7 — Split the You-Do `context` long sentence (MEDIUM — Issue #8)

```diff
--- a/src/lib/course/sections/s14-security.ts
+++ b/src/lib/course/sections/s14-security.ts
@@ -1453,7 +1453,8 @@
   youDo: {
     title: "Métricas de calidad y señales por pares vectorizadas (inicio CP-N2-A)",
     context:
-      "Tú lo haces (You Do). Eres analista de data quality en una fintech peruana: con arrays sintéticos de flags de completitud e ids/scores por cliente (Lima/Arequipa/Cusco, `C00x`), implementas el núcleo vectorizado del tablero de calidad — métricas, señales por pares, benchmark loop vs `@` y tests `allclose`. Sin PII real. Este incremento abre **CP-N2-A**.",
+      "Tú lo haces (You Do). Eres analista de data quality en una fintech peruana. Con arrays sintéticos de flags de completitud e ids/scores por cliente (Lima/Arequipa/Cusco, `C00x`), implementas el núcleo vectorizado del tablero de calidad: métricas, señales por pares, benchmark loop vs `@` y tests `allclose`. Sin PII real. Este incremento abre **CP-N2-A**.",
     objectives: [
       "Implementar métricas de calidad vectorizadas (completitud por campo, unicidad de ids, tasa en rango)",
       "Calcular señales por pares con broadcasting documentado (matriz n×n)",
```

### Diff 7.8 — Convert the You-Do `portfolioNote` long sentence into a list (MEDIUM — Issue #9)

```diff
--- a/src/lib/course/sections/s14-security.ts
+++ b/src/lib/course/sections/s14-security.ts
@@ -1578,7 +1578,13 @@
     portfolioNote:
-      "Este incremento abre CP-N2-A (Executive Data Quality & EDA). En el README del repo: documenta shapes y dtypes de cada métrica, el rtol/atol de allclose, el presupuesto de memoria si calculas matrices n×n, y aclara que el ratio de tiempo depende de la máquina (no es un SLA). Sube solo datos sintéticos — nunca PII real.",
+      "Este incremento abre CP-N2-A (Executive Data Quality & EDA). En el README del repo documenta:\n\n- shapes y dtypes de cada métrica;\n- el `rtol`/`atol` de `allclose`;\n- el presupuesto de memoria si calculas matrices n×n;\n- que el ratio de tiempo depende de la máquina (no es un SLA).\n\nSube solo datos sintéticos — nunca PII real.",
     rubric: [
       { criterion: "Métricas vectorizadas correctas (completitud, unicidad, rangos) con shapes documentados", weight: "25%" },
       { criterion: "Señales por pares y benchmark con equivalencia allclose demostrada", weight: "20%" },
```

### Diff 7.9 — (Optional, low priority) Rename the file to match content (LOW — Issue #3)

If the team prefers filename-content alignment (recommended for code-search ergonomics), rename `s14-security.ts` → `s14-numpy-vectorizado.ts` and update the import in `index.ts`. Combine with Diff 7.1.

```diff
--- a/src/lib/course/index.ts
+++ b/src/lib/course/index.ts
@@ -11,7 +11,7 @@
 import { section13 } from './sections/s13-rpa-automation'
 // Phase 1 — Competente (14-26)
-import { section14 } from './sections/s14-security'
+import { section14 } from './sections/s14-numpy-vectorizado'
 import { section15 } from './sections/s15-stdlib-deep'
 import { section16 } from './sections/s16-wxpython-gui'
```

```bash
git mv src/lib/course/sections/s14-security.ts src/lib/course/sections/s14-numpy-vectorizado.ts
```

---

## 8. Recommended Priority Order for fixing

1. **Diff 7.2 (HIGH, Meta-leak #2)** — Replace the security playground with a NumPy playground in `SectionView.tsx`. This is the highest-impact, lowest-risk fix: it doesn't change any persisted state and immediately restores the I-Do/We-Do/You-Do coherence of the section. Ship first.
2. **Diff 7.1 (HIGH, Meta-leak #1)** — Rename the `id` from `"security"` to `"numpy-vectorizado"` (or `"numpy-cp-n2-a"`). Pair with a localStorage migration in `progress-store.ts` to preserve learner progress. Ship second.
3. **Diff 7.3 (MEDIUM, orthographic)** — Fix `Si,` → `Sí,` in the self-check option. One-line, no risk. Ship in the same PR as #2.
4. **Diff 7.5, 7.6, 7.7, 7.8 (MEDIUM, long sentences)** — Split the five long sentences. Pure redaction, no semantic change. Ship in a "redaction pass" PR.
5. **Diff 7.4 (MEDIUM, *Diccionario rápido* list)** — Convert the 8-term glossary sentence into a Markdown `<ul>`. Verify `RichText` renderer handles newlines-as-lists; if not, split into 8 `paragraphs` entries. Ship in the same redaction PR.
6. **Diff 7.9 (LOW, file rename)** — Optional ergonomics improvement; defer until the team aligns on a course-wide rename strategy (S06, S13, S30, S42, S44 all have the same drift).

**Out of scope for this audit (but recommended for the orchestrator):**
- Run the same `InteractivePlaygroundDemo` mismatch check across all 52 sections — S13 and S14 are confirmed; S06, S30, S42, S44 are likely affected by the same systemic filename drift.
- Audit `progress-store.ts` for a migration path before any `id` rename.

---

## 9. Graph Memory Update notes (for the shared context files)

For the shared orchestrator context, the following nodes/edges are added for Section 14:

- **Node `S14`** — `section14` in `index.ts`, `id: "security"` (stale), title *"NumPy y cómputo vectorizado"*, phase 1, level "Competente", 18 h, opens portfolio increment **CP-N2-A**.
- **Edge `S13 → S14`** — *cierre de Phase 0* → *apertura de Phase 1*. Bridge is explicit in `theory[0].paragraphs[1]`: *"el dashboard de evidencia de S13 trabaja reglas y scores por caso … Aquí abres el nivel 2 (CP-N2-A): pasas de juicios por reglas a vectores numéricos"*.
- **Edge `S14 → S15`** — *NumPy arrays* → *pandas DataFrames*. Forward reference appears 7 times in S14. The `tagline` of S15 (*"ingesta tipada de clientes/transacciones con reporte de coerciones y reconciliación de filas/columnas"*) explicitly extends S14's *tablero de calidad* contract.
- **Edge `S14 → S17`** — *CP-N2-A baseline* → *Executive Data Quality & EDA Portfolio cierre*. S17 closes the increment that S14 opens.
- **Edge `S14 ↔ InteractivePlaygroundDemo`** — `SectionView.tsx:1432` dictionary key `'security'` returns security/hashing code, **mismatched** with S14's NumPy content. SAME defect pattern as S13 (`'rpa-automation'` key returning RPA/tenacity code).
- **Edge `S14 ↔ URL hash`** — `page.tsx:51-72` consumes `s.id === hash`. S14's `id: "security"` produces URL `#security` for NumPy content. SAME defect pattern as S13.
- **Pedagogical schema:** `Ancla (Puente desde S13)` → `Diccionario rápido` → `Hilo conductor` → `Orden pedagógico` → `Theory block × 8 (heading + 3 paragraphs + code + callout)` → `I Do × 8 (demoId + description + code + why)` → `We Do × 24 (E1 guided → E2 independent → E3 transfer, each with starterCode + deliberate CASO-LIM-014 defect + solutionCode + 2 hints + edgeCases)` → `You Do (5-function capstone + _run_tests + main + rubric 6/100%)` → `Self-check × 11 (cognitive traps)` → `Resources (7 docs + 2 books + 5 courses)`.
- **Ethical guardrails (refrain):** *"Sin PII real"*, *"no scores tratados como culpa"*, *"fail-closed"*, *"no 'arregles' en silencio"* — repeated 6+ times across theory and callouts. Consistent with S11–S13.
- **Grammar node:** FH=75.6, INFLESZ=71.3, WPS=11.4, SPW=1.99, 5 long sentences (>32 w), 0 run-ons (>45 w), 1 real LT finding (`SI_AFIRMACION2` on `Si,` → `Sí,`). Score 7.4/10.
- **Comparative quality:** Pedagogically on par with S13 (the cierre de nivel). The content layer is excellent; the two HIGH meta-leaks come from `SectionView.tsx` and the stale `id`, not from the section file itself.

---

**Composite score: 7.4 / 10** — Pedagogically excellent content (9.0/10) dragged down by two HIGH meta-leaks in surrounding components (5.8/10 on the meta-leak dimension). After applying Diffs 7.1, 7.2 and 7.3 the section would score ~8.8/10; after the redaction pass (Diffs 7.4–7.8) ~9.2/10.

This is the complete Explorer report for Section 14. Ready for the Fixer prompt.
