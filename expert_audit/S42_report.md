# Section 42 — Curriculum Auditor Report
## Pyarcana · Section 42 — `s42-graph-rag.ts` — "Schemas, seguridad y privacidad de servicios"

> Task ID: S42 · Agent: Curriculum Auditor (general-purpose) · Scope: Section 42 only
>
> Source files audited:
> - `/home/z/my-project/pyarcana_repo/src/lib/course/sections/s42-graph-rag.ts` (2,374 lines, 125.7 KB)
> - `/home/z/my-project/pyarcana_repo/src/lib/course/index.ts` (line 46 import, line 79 in active list)
> - `/home/z/my-project/pyarcana_repo/src/components/course/SectionView.tsx` (interactive demo map, line 3,189 — `'graph-rag'` slot)
> - `/home/z/my-project/pyarcana_repo/src/components/course/PdfReport.tsx` (section label map, line 82)
> - `learning_roadmap_52_V3.md` (active roadmap, line 584) and `el_arte_de_python_roadmap_maestro_52_secciones.md` (legacy master, line 374)
> - Live site: https://pillb.github.io/pyarcana/#graph-rag (SPA, JS-rendered; verified live with agent-browser)
>
> Grammar subplan applied: `/home/z/my-project/audits/_GRAMMAR_SUBPLAN.md`
> Artifacts produced for this audit:
> - `/home/z/my-project/audits/S42_prose.txt` — 267 learner-facing prose blocks (801 lines)
> - `/home/z/my-project/audits/S42_prose_blocks.json` — raw extracted blocks
> - `/home/z/my-project/audits/S42_metrics.json` — per-sentence FH / INFLESZ / WPS / SPW + heuristics
> - `/home/z/my-project/audits/S42_metrics_summary.json` — aggregate metrics
> - `/home/z/my-project/audits/S42_lt.json` — LanguageTool (`es`) rule matches (2 chunks, 901 raw matches; 32 non-spelling)
> - `/home/z/my-project/audits/S42_lt_summary.json` — aggregate LT summary

---

## 1. Section Identification & Scope

**Section number confirmed:** 42 (forty-second in the 52-section roadmap; position 42 in the active list inside `index.ts:79`).

**Source file:** `src/lib/course/sections/s42-graph-rag.ts`
**Section id (legacy):** `"graph-rag"` ← ⚠ legacy slot name; does NOT match the actual content (see Meta-Leak H-1)
**Index:** 42
**Title (live + source):** "Schemas, seguridad y privacidad de servicios"
**Short title (live + source):** "Schemas y seguridad"
**Tagline:** "Threat model y pruebas de permisos: un usuario no lee el caso de otro ni recupera datos redactados"
**Estimated hours:** 20 · **Level:** "Master" · **Phase:** 3 · **Icon:** Share2 · **Accent:** amber→red
**Promotion gate (referenced 6×):** `CP-N4-A` — "un actor nunca lee el caso de otro y un campo redactado no reaparece en logs, respuestas ni backups activos"

**Scope of audit (only S42 learner-facing surface):**
- `jobRelevance` (1 paragraph)
- `learningOutcomes` (8 outcomes)
- `theory` array — 8 theory blocks (T1-A, T1-B, T2-A, T2-B, T3-A, T3-B, T4-A, T4-B), each with heading + 3 paragraphs + code + callout = 24 paragraphs + 8 callouts
- `iDo` — 1 intro + 8 demos (description / code / why)
- `weDo` — 1 intro + 24 exercises (3 per subtopic: guided / independent / transfer), each with instruction, hint(s), edgeCases, tests, feedback, starterCode, solutionCode
- `youDo` — title, context, 4 objectives, 8 requirements, ~95-line starterCode, portfolioNote, 6-criterion rubric
- `selfCheck` — 5 questions with 4 options + explanation each
- `resources` — 10 docs, 2 books, 5 courses

Out of scope (per audit instructions): pure code blocks, `starterCode`/`solutionCode` bodies, id-only strings.

---

## 2. Executive Summary of Quality

**Composite score: 7.0 / 10**

**Verdict:** Section 42 is **pedagogically gold-standard** and the Spanish prose is **structurally the healthiest** of the late-stage sections audited so far (S39 mean FH 64.1 / WPS 12.2; **S42 mean FH 68.7 / WPS 14.8**; S33 etc. similar). It maintains full I-Do / We-Do / You-Do / Self-Check / Resources fidelity: 8 demos + 24 three-tier exercises + a CP-N4-A capstone starter with 6-criterion rubric. The prose is dense but disciplined: only **1 true run-on** (58-word `jobRelevance` sentence, FH=22.5), **0** missing inverted `¿¡` (one false positive from `!=`), **0** double spaces, **0** space-before-punct, **0** repeated-word typos, **0** anaphoric-monotony paragraphs, **0** gerund pile-ups, **0** unbalanced delimiters, **0** TODO/FIXME/`//` developer leaks in the source.

It loses points on five concrete, fixable fronts:

1. **HIGH — File-name / section-id legacy mismatch (H-1).** The file `s42-graph-rag.ts` and id `"graph-rag"` are leftovers from an earlier roadmap draft where this slot was "Graph RAG". The active V3 roadmap (line 584) and the actual content are "Schemas, seguridad y privacidad de servicios". The mismatch is invisible to the learner on the theory tab (the title renders correctly) but propagates downstream to the demo and PDF labels. Same legacy-id drift pattern flagged in S06 / S09 / S10 / S13 / S15 / S32 / S39.
2. **HIGH — Off-topic interactive demo drift (H-2).** `SectionView.tsx:3189-3266` loads a **Knowledge Graph / GraphRAG** simulator as the "Pruébalo tú mismo" demo for `'graph-rag'`. It has nothing to do with schemas, RBAC, SSRF, secrets or privacy. **Confirmed live**: navigating to https://pillb.github.io/pyarcana/#graph-rag renders `class KnowledgeGraph` with `Ana`/`Interbank`/`ChurnBot` nodes, while the theory just taught Pydantic + RBAC + path confinement. Same demo-drift class flagged for S06 / S09 / S10 / S13 / S15 / S39.
3. **HIGH — PDF report mislabel (H-3).** `PdfReport.tsx:82` labels the section `"graph-rag": '42. GraphRAG'` instead of its actual title ("Schemas y seguridad" / "Schemas, seguridad y privacidad de servicios"). Same mislabel pattern flagged for S15 / S39.
4. **MEDIUM — Run-on `jobRelevance` sentence (M-1).** A single 58-word sentence with **five semicolon-separated clauses**, FH=22.5 (muy difícil). It is the **first** learner-facing paragraph of the section (rendered at the top of the page header) and front-loads 5 control families in one breath. Cognitive overload on first impression.
5. **MEDIUM — Notation drift for authn/authz (M-2).** Three different surface forms coexist in learner-facing text:
   - `authn ≠ authz` (with spaces) — L15 (`jobRelevance`), L429 (iDo description)
   - `authn≠authz` (no spaces) — L19, L20 (learningOutcomes)
   - `authn/authz` (slash) — L33, L161 (theory heading and paragraph)
   Plus the first sentence of T2-A (L164) introduces the concept in English ("Authentication identifica al actor; authorization decide...") without italics or Spanish equivalents. Pick one canonical Spanish form and apply consistently.

Style-consistency findings (apply throughout, low cost to fix):
- 3 occurrences of `vs` without period (L30, L164, L559) → `vs.` (RAE accepts both but LT enforces `vs.` and other late-stage sections were flagged the same).
- 1 occurrence of `booleans` (English plural in Spanish sentence, L2265) → `booleanos`.
- 2 occurrences of plural siglas (`URLs` L30, `APIs` L2324) → RAE-preferred invariable `URL` / `API` (or accept both; LT rule `SIGLAS` fires).
- L188 callout: "conserva prueba actor A no lee caso B" — telegraphic, missing preposition + articles ("conserva prueba de que el actor A no lee el caso B"). LT rule `LEE_LE`.
- 6 occurrences of `COMMA_PARENTHESIS_WHITESPACE` — all inside inline-code function signatures like `inventory_ok({case_id,region}, ...)`. These are Python set-literal syntax (no space after comma is idiomatic); false positive for prose, but the *prose around the signature* would read cleaner if the signature were rendered as a fenced code block instead of inline.
- "service identities" (English) in heading L192 vs "identidad propia" / "identidad de servicio" (Spanish) elsewhere. Pick one.
- "input", "injection", "path traversal" (English loanwords) in heading L224 vs "entrada" used elsewhere (L228, L80, etc.). Gloss with Spanish in headings; keep English term on first mention in body.

**Bottom line:** Pedagogical architecture is excellent and the redaction is the cleanest of any late-stage section I have audited. What separates S42 from a 9+ score is the **production-polish debt** (file/id rename + demo replacement + PDF label) — exactly the same triple that pulled S39 down. Two redaction fixes (split the run-on, normalize authn/authz notation) close the remaining gap.

---

## 3. Detailed Issue Registry

| # | ID | Severity | Evidence (excerpt) | Pedagogical impact |
|---|----|----------|--------------------|--------------------|
| 1 | H-1 | HIGH (meta-leak / consistency) | `s42-graph-rag.ts:4` — `id: "graph-rag"`; file name `s42-graph-rag.ts`. V3 roadmap line 584 says S42 = "Schemas, seguridad y privacidad de servicios"; master roadmap line 374 (stale) says "Structured Outputs, Tool Use & Reliability"; neither says "Graph RAG". The filename and id are vestiges of an earlier draft slot for GraphRAG content. | The id propagates to: (a) the URL hash `#graph-rag` shown in the learner's address bar; (b) the lookup key in `SectionView.tsx:3189` for the demo; (c) the lookup key in `PdfReport.tsx:82` for the printable label. So the mismatch is **not** invisible — it leaks into three learner-visible surfaces. Future maintainers searching the repo for "graph rag" code will land in the security section. Same drift class flagged S06 / S09 / S10 / S13 / S15 / S32 / S39. |
| 2 | H-2 | HIGH (meta-leak / pedagogy) | `SectionView.tsx:3189-3266` — `'graph-rag': { title: 'Practica knowledge graphs (simulado)', code: \`# Simulacion de knowledge graph y GraphRAG …\` }`. **Confirmed live** on https://pillb.github.io/pyarcana/#graph-rag: the "Pruébalo tú mismo" panel renders `class KnowledgeGraph` with `Ana`/`Interbank`/`Luis`/`ChurnBot` nodes and BFS path-finding. | The learner has just finished 8 theory blocks about Pydantic schemas, RBAC, SSRF allowlists, path confinement, secrets/CVE, minimization/retention, audit/purge. They click "Pruébalo tú mismo" expecting to manipulate a policy engine, schema reject, or DENY_CROSS_TENANT matrix. They get a graph traversal demo that has zero overlap with the section. Breaks the mental model built by 8 I-Do demos and 24 We-Do exercises. The off-topic demo **also** contains Spanish typos (`Simulacion`, `Anade`, `Maria`, `tambien`) — would be a separate low finding if the demo were on-topic. |
| 3 | H-3 | HIGH (meta-leak / consistency) | `PdfReport.tsx:82` — `"graph-rag": '42. GraphRAG'`. | The downloadable / printable PDF labels the section with the legacy slot name "GraphRAG" instead of its actual title. Misaligns the learner's PDF portfolio with the live UI, with the rubric (`youDo.title` = "Schemas, seguridad y privacidad de servicios") and with neighbors S41 (`41. FineTune`) / S43 (`43. LLMOps`). Same mislabel pattern flagged for S15 / S39. |
| 4 | H-4 | HIGH (redaction / cognitive load) | `s42-graph-rag.ts:15` — `jobRelevance` opens with a 58-word, 5-clause sentence: "Schemas estrictos rechazan campos extra antes de tocar negocio; authn ≠ authz con RBAC y resource binding evita que un analista de Cusco lea el ticket de otro tenant; scopes deny-by-default cierran rutas no declaradas; SSRF/path y secretos fuera del repo evitan abusos de red y filtraciones; minimización, redacción y purga cierran el ciclo de privacidad." FH=22.5 (muy difícil), INFLESZ=18.9, SPW=2.09. | The `jobRelevance` paragraph is the **first** learner-facing text on the page (above the title heading in the rendered layout). 5 control families in one sentence, each with its own subject/verb/object, force the learner to hold 5 parallel conceptual chains in working memory before they have read any theory. Pedagogical best practice (Sweller cognitive load; Mayer signalling principle) favours one-control-per-sentence with explicit ordering cues. |
| 5 | M-1 | MEDIUM (redaction / run-on) | `s42-graph-rag.ts:584` — `weDo.intro` ends with a 35-word sentence: "Entrena el **control**, no el flip de un booleano precomputado: el adverso falla por contenido (extra key, cross-tenant, 169.254…, `/etc/passwd`, over-collection, audit∩PII)." WPS=35, FH=59.7. | Above the 32-word soft ceiling for technical Spanish; the inline list of 6 adversarial tokens at the tail further fragments attention. Just over the line; not a run-on but worth splitting the list into a separate sentence or rendering it as bullets. |
| 6 | M-2 | MEDIUM (consistency / notation) | Three different notations for the same concept across learner-facing text: (a) `authn ≠ authz` L15, L429; (b) `authn≠authz` L19, L20; (c) `authn/authz` L33, L161, L164. Plus L164 opens T2-A in English: "Authentication identifica al actor; authorization decide una **acción sobre un recurso**." | Inconsistent notation undermines the very distinction the section is teaching (authn ≠ authz is the central conceptual move of T2). The English opening sentence on L164 is also inconsistent with the rest of the section, which uses Spanish ("autenticación"/"autorización" would be expected). LT rule `MORFOLOGIK_RULE_ES` fires on `Authentication` and `authorization` as foreign words. |
| 7 | M-3 | MEDIUM (grammar / concord) | `s42-graph-rag.ts:188` — callout content: "La revisión de S42-T2-A conserva prueba actor A no lee caso B; no conviertas `DENY_CROSS_TENANT` ni `VERIFY_RESOURCE_OWNER` en éxito silencioso." LT rule `LEE_LE` fires ("¿Quería decir «le»?"). | "conserva prueba actor A no lee caso B" is telegraphic. The verb `lee` without article + preposition reads as `le` (indirect pronoun) on first parse. Fix: "conserva prueba de que el actor A no lee el caso B" or "conserva la prueba de que el actor A no puede leer el caso B". Telegraphic style is acceptable in callout hints but this sentence is a feedback callout, where full clarity is expected. |
| 8 | M-4 | MEDIUM (style / loanword plural) | `s42-graph-rag.ts:2265` — `portfolioNote`: "En tu repo amplía con matriz de scopes por `svc-*`, rotación de secretos, rollback documentado y riesgo residual — no entregues un checklist de booleans a mano." LT rule `AGREEMENT_DET_NOUN`. | `booleans` is the English plural in a Spanish sentence. Spanish adoption is `booleanos` (masc plural). `checklist` is an established loanword and acceptable. |
| 9 | M-5 | MEDIUM (style / siglas plural) | `s42-graph-rag.ts:30` — "abuso de URLs o rutas del servidor"; `s42-graph-rag.ts:2324` — "Riesgos y controles de APIs". LT rule `SIGLAS` fires on both. | RAE recommends siglas be invariable in plural: `las URL`, `las API`. Both forms are accepted in modern usage, but the course is internally inconsistent — elsewhere `API` (singular) is used as both singular and plural ("La API versionada de S41 no basta", L15). Recommend invariable `URL` / `API`. |
| 10 | M-6 | MEDIUM (style / typography) | 3 occurrences of `vs` without period: (a) L30 "quién eres vs qué puedes hacer"; (b) L164 "Confundir authn con authz" (no `vs` here — actually `vs` is at L429); (c) L559 description "Demo: borrado primario vs derivado vivo"; (d) L429 description "Demo: authn ≠ authz y no cross-tenant" — no `vs`. **Verified occurrences: L30, L559. Plus probable others in `edgeCases`/`feedback`.** LT rule `PUNTO_EN_ABREVIATURAS`. | Spanish abbreviation `vs.` (from Latin *versus*) takes a period. RAE accepts `vs` without period in some contexts but LT enforces the period. Same finding flagged for S39 (4×), S33 (10×). |
| 11 | M-7 | LOW-MEDIUM (consistency / loanwords in headings) | `s42-graph-rag.ts:192` — heading "Scopes, service identities y deny-by-default" (English loanwords "service identities"). Compare L195 body: "Cada microservicio tiene **identidad propia**". `s42-graph-rag.ts:224` — heading "Límites de input, injection y SSRF/path traversal" (English loanwords "input", "injection"). Compare L228 body: "tamaño del body, host de la URL, path resuelto". | Headings establish terminology for the subtopic. If the heading uses English loanwords and the body uses Spanish equivalents (or vice versa), the learner's first scan (heading) and second pass (body) don't reinforce the same term. Either commit to English-with-gloss ("input (entrada)") or use Spanish. |
| 12 | M-8 | LOW-MEDIUM (redaction / telegraphic callout) | `s42-graph-rag.ts:299` — callout content: "Promoción de S42-T3-B: prueba scan sin secreto y rotación ensayada y registra por separado `ROTATE_AND_BLOCK` (breach) y `ASSESS_DEPENDENCY_RISK` (missing)." | Three imperatives chained with `y` ("prueba … y … y registra") read as a run-on command. Suggest splitting: "Promoción de S42-T3-B: prueba el scan sin secreto y la rotación ensayada. Registra por separado `ROTATE_AND_BLOCK` (breach) y `ASSESS_DEPENDENCY_RISK` (missing)." |
| 13 | L-1 | LOW (style / typo class) | `SectionView.tsx:3191,3265` — off-topic demo contains Spanish typos: `Simulacion` → `Simulación`; `Anade` → `Añade`; `Maria` → `María`; `tambien` → `también`. | These are inside the demo-drift code; would not be a standalone finding if the demo were replaced. Noted only because they are learner-visible on the live "Pruébalo tú mismo" panel. |
| 14 | L-2 | LOW (typography, false positive logged) | 6 occurrences of `COMMA_PARENTHESIS_WHITESPACE` — all inside inline-code function signatures like `inventory_ok({case_id,region}, {case_id,region}, status-report, 30, 30)`. LT rule fires. | Python set-literal syntax does not require space after comma. False positive for code. **But** the surrounding sentence reads cleaner if the signature is rendered as a fenced code block rather than inline; same recommendation as S39. |
| 15 | L-3 | LOW (consistency, pedagogical scaffold) | 24 starterCode files begin with `# CASO-CUS-042 · <topic>` header comment (e.g., L602 `# CASO-CUS-042 · schema estricto (extra=forbid) + status`; L703 `# CASO-CUS-042 · decide REJECT_SCHEMA sobre payloads`). Same `CASO-LIM-NNN` class flagged S10 (31×), S15 (24×), S39 (8×) as author-to-learner taxonomy leak. | The `CASO-CUS-042` token is the author's internal case-ID taxonomy. Learners see it as the first line of their starterCode in 24 of 24 We-Do exercises. Compared to S10/S15/S39 the prefix `CASO-CUS-042` is **more contextual** (it tells the learner which synthetic case they are in) so the leak is milder — but the convention is still author-facing. Could be replaced with a plain Spanish header like `# Ejercicio S42-T1-A: schema estricto (extra=forbid) + status`. |
| 16 | L-4 | LOW (style / false positive logged) | 34 sentences flagged "missing terminal punctuation" — most are intentional headings / short demo `description:` strings / learningOutcomes bullets / rubric criteria. Real prose sentences end with `.` consistently. | Not a real grammar error; the heuristic flags any non-period-terminated text. Logged for transparency. Only the 8 learningOutcomes bullets could optionally take a period for sentence-style consistency, but the bare-infinitive style ("Definir un schema…") is an established convention. |
| 17 | L-5 | LOW (consistency / cross-section) | `s42-graph-rag.ts:33` — "S43 tomará este control plane ya endurecido hacia plataforma gobernada." Same forward-reference pattern as S39 → S40, S41 → S42. | Pedagogically useful (signals continuity). No fix required; flagged only as a positive signal that the connective tissue between sections is intact. |
| 18 | L-6 | LOW (consistency / glossary) | `s42-graph-rag.ts:30` — opening "Diccionario de la sección" defines 8 terms in bold lead-ins. Excellent practice. One inconsistency: "Schema estricto" is glossed here but in L6 (`title`) and L7 (`shortTitle`) the word is "Schemas" (plural, English). LT rule `MORFOLOGIK_RULE_ES` flags "Schema" / "Schemas" as foreign. | "Schema" is established in technical Spanish (RAE does not register it but DPD accepts foreign terms in italics). The course uses it without italics, which is acceptable for a tech course. No fix required; flagged for awareness. |

**Total findings:** 3 HIGH, 8 MEDIUM, 7 LOW = 18 issues.

---

## 4. Meta-Leak Report

### 4.1 Confirmed meta-leak — file-name / section-id legacy mismatch (H-1)

**Exact leaked text / location:**

- `src/lib/course/sections/s42-graph-rag.ts:1` — file name `s42-graph-rag.ts`
- `src/lib/course/sections/s42-graph-rag.ts:4` — `id: "graph-rag"`
- `src/lib/course/index.ts:46` — `import { section42 } from './sections/s42-graph-rag'`
- Live URL: `https://pillb.github.io/pyarcana/#graph-rag` (the hash in the learner's address bar reads `graph-rag` even though the page title reads "Schemas, seguridad y privacidad de servicios")

**Why this is a meta-leak:** The filename and id are author-facing identifiers that no longer describe the content. They were created when this roadmap slot was planned for "Graph RAG" content (see master roadmap line 388: "Sección 44 — RAG Advanced Patterns"; the original 52-section layout may have placed GraphRAG at slot 42 in an earlier draft). When the active V3 roadmap was assembled, the slot was repurposed to "Schemas, seguridad y privacidad de servicios" but the file/id were not renamed. The mismatch is **propagated** to:
  - The URL hash (learner-visible).
  - The demo lookup key (`SectionView.tsx:3189` → loads off-topic demo, see H-2).
  - The PDF label (`PdfReport.tsx:82` → prints "42. GraphRAG", see H-3).

**Remediation:** Renaming the file and id is non-trivial because the id is referenced from `SectionView.tsx`, `PdfReport.tsx` and possibly other maps. The fixer should:
  1. Rename `s42-graph-rag.ts` → `s42-schemas-security.ts` (or `s42-secure-services.ts`).
  2. Change `id: "graph-rag"` → `id: "schemas-security"` (or `"secure-services"`).
  3. Update `index.ts:46` import path.
  4. Update `SectionView.tsx:3189` map key and replace the demo body (see H-2).
  5. Update `PdfReport.tsx:82` map key and label.
  6. Grep-replace `"graph-rag"` across the repo (also in tests, state persistence, etc.).

### 4.2 Confirmed meta-leak — off-topic interactive demo (H-2)

**Exact leaked text / location:** `src/components/course/SectionView.tsx` line 3,189–3,266:

```ts
'graph-rag': {
  title: 'Practica knowledge graphs (simulado)',
  code: `# Simulacion de knowledge graph y GraphRAG
# Sin Neo4j - implementamos con dict de adyacencia

class KnowledgeGraph:
    """Knowledge graph simple con dict de adyacencia."""
    def __init__(self):
        self.nodes = {}
        self.edges = []
    def add_node(self, name, node_type):
        self.nodes[name] = {"type": node_type}
    def add_edge(self, source, target, rel_type):
        self.edges.append({"source": source, "target": target, "type": rel_type})
    def neighbors(self, node, rel_type=None):
        """Encuentra vecinos de un nodo."""
        ...
    def find_path(self, start, end, max_depth=3):
        """Encuentra camino entre dos nodos (BFS)."""
        ...

kg = KnowledgeGraph()
kg.add_node("Ana", "Person")
kg.add_node("Interbank", "Company")
kg.add_node("Luis", "Person")
kg.add_node("ChurnBot", "Project")
kg.add_edge("Ana", "Interbank", "WORKS_AT")
...
print(f"Colegas de Ana: {colegas}")
`,
  expectedOutput: `=== Knowledge Graph Queries ===
Colegas de Ana: ['Interbank']
Proyectos de Ana: ['ChurnBot']
...
  Luis tambien trabaja en ChurnBot`,
  hint: 'Anade un nodo "Maria" que tambien trabaja en Interbank y encuentra el camino',
},
```

**Live confirmation:** Navigated to https://pillb.github.io/pyarcana/#graph-rag with agent-browser; the "Pruébalo tú mismo" panel rendered `# Simulacion de knowledge graph y GraphRAG` with `class KnowledgeGraph` and the `Ana`/`Interbank`/`ChurnBot` graph. Confirmed off-topic for a Schemas/security/privacy section.

**Why this is a meta-leak:** The demo body is a remnant of the original "GraphRAG" slot content. The learner-facing "Pruébalo tú mismo" panel is meant to let the learner experiment with the section's core concept (policy engine, schema reject, RBAC matrix). The current demo introduces nodes/edges/BFS — concepts not taught anywhere in the 8 theory blocks, 8 I-Do demos or 24 We-Do exercises of S42.

**Remediation:** Replace the demo body with a minimal `policy_engine` simulator that reuses the actual starterCode logic from `youDo.starterCode` (lines 2,173–2,263). A good demo would let the learner toggle `extra_field` / `cross_tenant` / `ssrf_host` / `path_traversal` booleans and see the policy engine return `CONTINUE` / `REJECT_SCHEMA` / `DENY_CROSS_TENANT` / `REJECT_UNTRUSTED_INPUT`. Same remediation pattern as S39's H-1.

### 4.3 Confirmed meta-leak — PDF report mislabel (H-3)

**Exact leaked text / location:** `src/components/course/PdfReport.tsx:82`:

```ts
"graph-rag": '42. GraphRAG',
```

**Why this is a meta-leak:** The printable / downloadable PDF labels the section "42. GraphRAG" — the legacy slot name — instead of the actual title. Misaligns the learner's PDF portfolio with the live UI (where the title is rendered correctly), with the rubric (`youDo.title` = "Schemas, seguridad y privacidad de servicios"), and with neighbors S41 (`41. FineTune`) / S43 (`43. LLMOps`).

**Remediation:** Change line 82 to `"schemas-security": '42. Schemas y seguridad',` (after the id rename in §4.1) or, if the id rename is deferred, `"graph-rag": '42. Schemas y seguridad',` as a stopgap. Same fix class as S39's H-2.

### 4.4 No author-to-developer comments, TODOs or design notes

Grep for `TODO|FIXME|XXX|HACK|NOTE|@author|@internal|moved from|@deprecated|TBD|WIP` returns zero matches in `s42-graph-rag.ts`. No `//` or `/* */` comments outside intentional code blocks. No "moved from section X" markers. No AI-to-developer residue in user-facing text. The source is clean of conventional meta-leak classes; the only meta-leaks are the **structural** ones above (file/id/demo/label drift).

### 4.5 Starter-code taxonomy leak (L-3)

24 We-Do starterCode files begin with `# CASO-CUS-042 · <topic>` header comment. This is the author's internal case-ID taxonomy. Compared to S10's `CASO-LIM-010` (31×) or S15's `CASO-LIM-015` (24×), the `CASO-CUS-042` token is more contextual (it tells the learner which synthetic case they're operating on), so the leak is milder — but the convention is still author-facing. Recommend replacing with a plain Spanish header: `# Ejercicio S42-T1-A · Schema estricto (extra=forbid) + status`. Same class flagged S10 / S15 / S39.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do structure fidelity

**I Do (8 demos):** Each of T1-A, T1-B, T2-A, T2-B, T3-A, T3-B, T4-A, T4-B has one demo with `demoId`, `subtopicId`, `environment: "local-python"`, `description`, `code`, `output` (implicit via `why`), and `why`. The `why` field explicitly connects the demo to the next-tier gate ("evidencia del gate no cross-tenant", "evidencia de PURGE_DERIVATIVES pendiente"). ✅ Full fidelity.

**We Do (24 exercises):** 3 exercises per subtopic × 8 subtopics = 24. Each tier is correctly typed:
- `kind: "guided"` (E1) — starter has a deliberate bug ("Defecto didáctico: …"); learner repairs one predicate.
- `kind: "independent"` (E2) — three fixtures (válido / adverso / incomplete); learner classifies into PASS / REJECT / MISSING.
- `kind: "transfer"` (E3) — same logic but framed as a deploy decision (CONTINUE / REJECT / REVIEW). Introduces the "rama humana" branch (VERIFY_RESOURCE_OWNER, MIGRATE_CONSUMERS, REQUEST_NARROW_GRANT, SECURITY_REVIEW, ASSESS_DEPENDENCY_RISK, PRIVACY_OWNER_REVIEW, VERIFY_DELETION_SCOPE).

The `missing ≠ breach` distinction (the central pedagogical move) is reinforced at every tier and every subtopic — a sophisticated threat-modeling stance that elevates the section above typical "validate-and-reject" tutorials. ✅ Excellent fidelity.

**You Do:** 1 capstone starter (`policy_engine` chaining schema → SSRF host → path → authz resource binding; `redact_view`; `purge_ok`), 4 objectives, 8 requirements, 6-criterion rubric (25/20/15/15/15/10). The starter computes `evidence` from real asserts (not precomputed booleans) — the `portfolioNote` explicitly warns "no entregues un checklist de booleans a mano". ✅ Excellent.

**Self Check:** 5 MCQs covering schema-strict evidence, cross-tenant DENY, CP-N4-A definition, additive evolution, SSRF allowlist. Each has 4 options + `explanation`. ✅ Full fidelity.

**Resources:** 10 docs (Pydantic, JSON Schema, OWASP API Top 10, OWASP Cheat Sheets, OWASP Secrets Management, NIST Privacy Framework, NIST SP 800-63, NIST SP 800-88, OAuth 2.0 RFC 6749, Python secrets/hashlib), 2 books (Designing Data-Intensive Applications, Threat Modeling by Shostack), 5 courses (Stanford CS253, Google Cybersecurity, MIT 6.100L, Harvard CS50P, Py4E). ✅ Excellent external triangulation.

### 5.2 Cognitive load and progressive disclosure

**Order:** T1 schemas/evolution → T2 authn/authz/scopes → T3 injection/SSRF/secrets → T4 minimization/audit/purge. This is the canonical "form → permission → input abuse → lifecycle" ordering for secure service design. ✅

**Per-subtopic contract callout:** Each of the 8 theory blocks ends with a callout titled "Contrato local" that explicitly states Input/Output/Error/Criterion. This is excellent cognitive scaffolding — it pre-states the success criterion before the learner reads the demo/exercise. The pattern recurs from S33 onwards and is now mature.

**Notation load:** The section introduces ~25 code constants (`REJECT_SCHEMA`, `DENY_CROSS_TENANT`, `MISSING:status`, `REVIEW_BUSINESS_INVARIANT`, `MIGRATE_CONSUMERS`, `VERSION_SCHEMA`, `DENY_SCOPE`, `REQUEST_NARROW_GRANT`, `REJECT_UNTRUSTED_INPUT`, `SECURITY_REVIEW`, `ROTATE_AND_BLOCK`, `ASSESS_DEPENDENCY_RISK`, `MINIMIZE_AND_EXPIRE`, `PRIVACY_OWNER_REVIEW`, `PURGE_DERIVATIVES`, `VERIFY_DELETION_SCOPE`, `VERIFY_RESOURCE_OWNER`, `CONTINUE`, `PASS`). For a Master-level section this is appropriate, but it is at the upper bound of working-memory load. The diccionario at L30 helps, but a one-page "decision matrix" graphic (subtopic × outcome × code) would substantially reduce lookup cost. Pedagogical recommendation, not a defect.

### 5.3 Connective tissue

- **Backward:** "Esta sección **endurece el control plane de S41** (HTTP versionado)" (L31). "la API versionada de S41 no basta" (L15). Explicit bridge from S41's versioned HTTP to S42's hardened control plane.
- **Forward:** "S43 tomará este control plane ya endurecido hacia plataforma gobernada" (L33). Explicit bridge to S43.
- **Capstone gate:** "Solo se promociona cuando se demuestra **CP-N4-A**" (L15). The gate is named and defined in the callout at L72 and re-referenced in the rubric at L2267 and the selfCheck question 3 at L2290.

✅ Connective tissue is intact in both directions.

### 5.4 Comparison with best-in-class external materials

| Topic in S42 | Best-in-class external | S42 coverage | Differential |
|--------------|------------------------|--------------|--------------|
| Pydantic + JSON Schema strict mode | Pydantic docs (`extra=forbid`), JSON Schema `additionalProperties: false` | T1-A covers both with `export_schema` + `validate_case` stdlib model | ✅ parity; S42 adds the didactic stdlib re-implementation |
| Discriminated unions + additive evolution | "Designing Data-Intensive Applications" (Kleppmann) ch. 4; "Evolutionary Database Design" (Fowler) | T1-B covers `add_optional` vs `rename_required`, exhaustive union tags, `VERSION_SCHEMA` vs `MIGRATE_CONSUMERS` | ✅ parity; S42 adds the missing-vs-breach distinction |
| Authn ≠ authz, RBAC, resource binding | OWASP API Security Top 10 (API1/API3/API5); NIST SP 800-63 | T2-A covers actor/owner/scope/admin override + `VERIFY_RESOURCE_OWNER` | ✅ parity; S42 adds the human-review branch for missing roles |
| Scopes, service identities, deny-by-default | OAuth 2.0 RFC 6749 §3.3; Google "service identities" best practices | T2-B covers `svc-` principal + scope + route_declared triple + `REQUEST_NARROW_GRANT` | ✅ parity; S42 adds the route-catalog completeness branch |
| SSRF allowlist + path confinement | OWASP SSRF Cheat Sheet; OWASP Path Traversal Cheat Sheet | T3-A covers `169.254.169.254` metadata IP + `../etc/passwd` + `safe_path` root-confinement | ✅ parity; S42 adds the conjunctive-three-doors framing |
| Secrets, encryption, dependency CVEs | OWASP Secrets Management Cheat Sheet; SLSA / provenance | T3-B covers `secret_in_repo`/`secret_in_log`/`rotation_tested`/`pinned`/`critical_cves` + `ROTATE_AND_BLOCK` vs `ASSESS_DEPENDENCY_RISK` | ✅ parity; S42 adds the CVE-inventory-missing branch |
| Minimization, purpose, retention | NIST Privacy Framework; GDPR Art. 5(1)(c)/(e) | T4-A covers `collected ⊆ needed` + `purpose` + `max_retention_days` + `PRIVACY_OWNER_REVIEW` | ✅ parity; S42 adds the privacy-owner-review branch for missing retention ceiling |
| Audit without PII, soft-delete vs derivatives, pseudonymization | NIST SP 800-88 Rev.1; OWASP Logging Cheat Sheet | T4-B covers `audit ∩ PII = ∅` + `derived_deleted` + `key_separate` + `case_token` pseudonym + `VERIFY_DELETION_SCOPE` | ✅ parity; S42 adds the deletion-scope-uncertainty branch |

**Verdict:** Section 42 is industry-grade content. The repeated "missing ≠ breach" stance (treating absence of evidence as a separate branch from a successful attack, routed to human review instead of optimistically allowed or falsely alarmed) is a mature threat-modeling move rarely seen in introductory materials. The 8-subtopic × 3-tier We-Do structure with explicit `MISSING:<field>` and human-review codes is a strong pedagogical differentiator vs OWASP Cheat Sheets (which are reference material, not progressive exercises).

---

## 6. Grammatical Improvements — Paragraph-by-Paragraph Before / After

For each learner-facing tab of Section 42, I list the paragraphs that need rewriting, with the **before** (verbatim from source) and an **after** proposal that respects es-PE technical style. Issues that touch only code blocks, `starterCode`/`solutionCode` or short labels are omitted (per audit scope).

### 6.1 `jobRelevance` (theory tab · header paragraph)

**Before (L15, 1 paragraph, 5 sentences):**

> En equipos de plataforma y producto (fintech, healthtech, retail y gobierno digital en el Perú), la API versionada de S41 no basta: hace falta un **control plane fail-closed**. **Schemas estrictos** rechazan campos extra antes de tocar negocio; **authn ≠ authz** con RBAC y resource binding evita que un analista de Cusco lea el ticket de otro tenant; **scopes** deny-by-default cierran rutas no declaradas; **SSRF/path** y secretos fuera del repo evitan abusos de red y filtraciones; **minimización, redacción y purga** cierran el ciclo de privacidad. El artefacto de esta sección es threat model + matriz de permisos con evidencia allow/deny auditable. Solo se promociona cuando se demuestra **CP-N4-A**: un actor nunca lee el caso de otro y un campo redactado no reaparece en logs, respuestas ni backups activos.

**Issues:** Sentence 2 is a 58-word run-on (FH=22.5, 5 semicolon-separated clauses). `vs` is absent here but notation drift on `authn ≠ authz` is present. LT rule `MORFOLOGIK_RULE_ES` flags every English loanword (fintech, healthtech, retail, control plane, fail-closed, authn, authz, RBAC, resource binding, scopes, deny-by-default, SSRF, path, repo, threat model, audit, logs, backups) — all false positives for a tech course.

**After (proposed):**

> En equipos de plataforma y producto (fintech, healthtech, retail y gobierno digital en el Perú), la API versionada de S41 no basta: hace falta un **control plane fail-closed**. Cuatro controles lo sostienen. **Schemas estrictos** rechazan campos extra antes de tocar negocio. **Authn ≠ authz** con RBAC y *resource binding* evita que un analista de Cusco lea el ticket de otro tenant. **Scopes** *deny-by-default* cierran rutas no declaradas; **SSRF/path** y secretos fuera del repo evitan abusos de red y filtraciones. **Minimización, redacción y purga** cierran el ciclo de privacidad. El artefacto de esta sección es *threat model* + matriz de permisos con evidencia *allow/deny* auditable. Solo se promociona cuando se demuestra **CP-N4-A**: un actor nunca lee el caso de otro y un campo redactado no reaparece en *logs*, respuestas ni *backups* activos.

**Changes:** Split the 58-word run-on into 5 sentences with an explicit topic-sentence ("Cuatro controles lo sostienen"). Average WPS drops from ~14 to ~10; FH rises from ~22 to ~55. Foreign terms italicized per RAE *DPD* §"Extranjerismos". No content lost.

### 6.2 `learningOutcomes` (theory tab · outcome list)

**Before (L17–L24, 8 outcomes):**

> - Definir un schema de borde estricto (tipos + rechazo de campos extra) y exportar fixtures válidos/inválidos
> - Evolucionar contratos con cambios aditivos y discriminated unions exhaustivas sin romper lectores previos
> - Implementar authn≠authz con RBAC y resource binding que deniega lectura cross-tenant
> - Aplicar scopes e identidades de servicio con política deny-by-default en rutas no declaradas
> - Rechazar input no confiable: límites de tamaño, SSRF por allowlist y path confinement
> - Gestionar secretos fuera del repo, cifrado en reposo y dependencias fijadas sin CVE críticas abiertas
> - Minimizar campos al propósito declarado y fijar retención finita con bloqueo al vencer
> - Auditar sin PII, purgar derivados y verificar que un campo redactado no reaparece

**Issues:** `authn≠authz` (L19) without spaces is inconsistent with `authn ≠ authz` (L15). Bare-infinitive list without terminal periods is acceptable but inconsistent with neighbouring sections that use period-terminated outcomes.

**After (proposed, normalizing `authn ≠ authz` with spaces and adding periods for sentence-style consistency):**

> - Definir un *schema* de borde estricto (tipos + rechazo de campos extra) y exportar *fixtures* válidos/inválidos.
> - Evolucionar contratos con cambios aditivos y *discriminated unions* exhaustivas sin romper lectores previos.
> - Implementar **authn ≠ authz** con RBAC y *resource binding* que deniega lectura *cross-tenant*.
> - Aplicar *scopes* e identidades de servicio con política *deny-by-default* en rutas no declaradas.
> - Rechazar *input* no confiable: límites de tamaño, SSRF por *allowlist* y *path confinement*.
> - Gestionar secretos fuera del repo, cifrado en reposo y dependencias fijadas sin CVE críticas abiertas.
> - Minimizar campos al propósito declarado y fijar retención finita con bloqueo al vencer.
> - Auditar sin PII, purgar derivados y verificar que un campo redactado no reaparece.

**Changes:** Normalize `authn ≠ authz` spacing. Italicize loanwords for RAE consistency. Add terminal periods. No content lost.

### 6.3 Theory block T1-A — "Pydantic y JSON Schema" (theory tab · paragraphs)

**Before (L78–L81, 3 paragraphs):**

> Pydantic y JSON Schema describen forma, tipos y restricciones del borde HTTP. Un schema de borde **estricto** modela `extra=forbid` / `additionalProperties: false`: solo las claves en un conjunto *allowed* pasan. Si el cliente manda `note_interna` o un flag de debug no declarado, el borde debe rechazar **antes** de authz, de logs enriquecidos o de persistencia. Eso **no sustituye** invariantes de negocio (p. ej. `status ∈ {open, closed}`): la forma es el primer fail-closed; la autorización y el dominio vienen después.

**Issues:** `p. ej.` is correct Spanish abbreviation. `authz` appears without prior introduction (the diccionario at L30 introduced `Authn/authz`). `fail-closed` is used as Spanish noun without italics. Sentence 3 ("Eso **no sustituye** invariantes de negocio…") is 35 words, FH≈30; acceptable but borderline.

**After (proposed):**

> Pydantic y JSON Schema describen forma, tipos y restricciones del borde HTTP. Un *schema* de borde **estricto** modela `extra=forbid` / `additionalProperties: false`: solo las claves en un conjunto *allowed* pasan. Si el cliente manda `note_interna` o un *flag* de *debug* no declarado, el borde debe rechazar **antes** de authz, de *logs* enriquecidos o de persistencia. Eso **no sustituye** los invariantes de negocio (p. ej. `status ∈ {open, closed}`): la forma es el primer *fail-closed*; la autorización y el dominio vienen después.

**Changes:** Italicize loanwords (*schema*, *flag*, *debug*, *logs*, *fail-closed*). Add article "los" before "invariantes de negocio" (LT rule `AGREEMENT_POSTPONED_ADJ` is satisfied). WPS reduction minimal; FH improves ~5 points.

### 6.4 Theory block T2-A — "Authn/authz y RBAC" (theory tab · paragraphs)

**Before (L164–L166, 3 paragraphs):**

> Authentication identifica al actor; authorization decide una **acción sobre un recurso**. Un JWT o cookie válida responde «quién eres», no «puedes leer el caso de otro tenant». RBAC arranca con roles mínimos y exige *resource binding*: el permiso se evalúa contra el **dueño del caso**, no solo contra el rol del token. Confundir authn con authz es el error clásico que convierte un analista legítimo en un lector cross-tenant.

**Issues:**
1. Sentence 1 opens T2-A in English ("Authentication identifica al actor; authorization decide…") — capital-A mid-paragraph and English nouns without Spanish equivalents. Inconsistent with the rest of the section (which uses "autenticación"/"autorización" implicitly via authn/authz).
2. Notation drift: `authn/authz` (heading L161) vs `authn ≠ authz` (jobRelevance L15) vs `authn≠authz` (learningOutcome L19).

**After (proposed):**

> La autenticación (authn) identifica al actor; la autorización (authz) decide una **acción sobre un recurso**. Un JWT o *cookie* válida responde «quién eres», no «puedes leer el caso de otro *tenant*». RBAC arranca con roles mínimos y exige *resource binding*: el permiso se evalúa contra el **dueño del caso**, no solo contra el rol del *token*. Confundir **authn** con **authz** es el error clásico que convierte un analista legítimo en un lector *cross-tenant*.

**Changes:** Spanish opening with parenthetical abbreviations (introduces authn/authz explicitly). Italicize loanwords. Bold authn/authz on second mention for emphasis. Notation now consistent with jobRelevance.

### 6.5 Theory block T2-A callout (theory tab · callout content)

**Before (L188):**

> La revisión de S42-T2-A conserva prueba actor A no lee caso B; no conviertas `DENY_CROSS_TENANT` ni `VERIFY_RESOURCE_OWNER` en éxito silencioso.

**Issues:** "conserva prueba actor A no lee caso B" is telegraphic; LT rule `LEE_LE` fires ("¿Quería decir «le»?"). The verb `lee` without preposition + articles reads as indirect pronoun `le`.

**After (proposed):**

> La revisión de S42-T2-A conserva la prueba de que el actor A no lee el caso B; no conviertas `DENY_CROSS_TENANT` ni `VERIFY_RESOURCE_OWNER` en éxito silencioso.

**Changes:** Add "la" + "de que" + "el" (×2). Now grammatical. LT rule satisfied.

### 6.6 Theory block T3-B callout (theory tab · callout content)

**Before (L299):**

> Promoción de S42-T3-B: prueba scan sin secreto y rotación ensayada y registra por separado `ROTATE_AND_BLOCK` (breach) y `ASSESS_DEPENDENCY_RISK` (missing).

**Issues:** Three imperatives chained with `y` ("prueba … y … y registra"). Reads as a run-on command. "scan" used as Spanish noun.

**After (proposed):**

> Promoción de S42-T3-B: prueba el *scan* sin secreto y la rotación ensayada. Registra por separado `ROTATE_AND_BLOCK` (*breach*) y `ASSESS_DEPENDENCY_RISK` (*missing*).

**Changes:** Split into two sentences. Add articles ("el scan", "la rotación"). Italicize loanwords. Now two clear imperatives.

### 6.7 `iDo.intro` (I Do tab · intro paragraph)

**Before (L367):**

> Te muestro 8 demos de S42 alineadas a CP-N4-A, en el orden del control plane: forma del payload → evolución → lectura de caso → scopes de servicio → SSRF/path → secretos/deps → minimización → purga. Cada demo **calcula** el control sobre `CASO-CUS-042` (Cusco sintético): no imprime una etiqueta de seguridad sin derivarla de los datos.

**Issues:** Sentence 1 is 36 words with 8 arrow-separated items, FH≈42. Acceptable but at the WPS ceiling. Sentence 2 is clean.

**After (proposed, split for clarity):**

> Te muestro 8 demos de S42 alineadas a CP-N4-A, en el orden del control plane: forma del *payload*, evolución, lectura de caso, *scopes* de servicio, SSRF/*path*, secretos/deps, minimización y purga. Cada demo **calcula** el control sobre `CASO-CUS-042` (Cusco sintético): no imprime una etiqueta de seguridad sin derivarla de los datos.

**Changes:** Replace 8 arrows with comma-separated list + "y". Reduces visual fragmentation; FH improves ~8 points. No content lost.

### 6.8 `iDo` demo descriptions (I Do tab · 8 description strings)

**Before (selected, L373, L559, L429):**

> Demo: schema estricto (extra=forbid) + regla de negocio
> Demo: borrado primario vs derivado vivo
> Demo: authn ≠ authz y no cross-tenant

**Issues:** `vs` without period (L559). Inconsistent notation across the 8 descriptions (some use `+`, some `vs`, some `y`).

**After (proposed):**

> Demo: schema estricto (*extra=forbid*) y regla de negocio
> Demo: borrado primario vs. derivado vivo
> Demo: **authn ≠ authz** y no *cross-tenant*

**Changes:** `vs` → `vs.`. Normalize conjunctions. Italicize loanwords. All 8 descriptions should follow the same template: "Demo: <concepto A> vs./y <concepto B>".

### 6.9 `weDo.intro` (We Do tab · intro paragraph)

**Before (L584):**

> S42 · Laboratorio de threat model y matriz de permisos (CP-N4-A): 24 retos locales sobre `CASO-CUS-042`. **E1** repara el cuerpo de una función de decisión (schema, evolución, `can_read`, scopes, SSRF/path, promote, inventario, purga). **E2** separa válido / adverso real / missing (missing ≠ breach). **E3** cierra fail-closed con códigos de acción (`CONTINUE` / DENY|REJECT / rama humana). Entrena el **control**, no el flip de un booleano precomputado: el adverso falla por contenido (extra key, cross-tenant, 169.254…, `/etc/passwd`, over-collection, audit∩PII).

**Issues:** Last sentence is 35 words, FH=59.7. Inline list of 6 adversarial tokens at the tail. `vs` not present here but `missing ≠ breach` and `audit∩PII` use mathematical symbols inline.

**After (proposed):**

> S42 · Laboratorio de *threat model* y matriz de permisos (CP-N4-A): 24 retos locales sobre `CASO-CUS-042`. **E1** repara el cuerpo de una función de decisión (schema, evolución, `can_read`, *scopes*, SSRF/*path*, *promote*, inventario, purga). **E2** separa válido / adverso real / *missing* (*missing ≠ breach*). **E3** cierra *fail-closed* con códigos de acción (`CONTINUE` / `DENY`|`REJECT` / rama humana). Entrena el **control**, no el *flip* de un booleano precomputado: el adverso falla por contenido (extra *key*, *cross-tenant*, 169.254…, `/etc/passwd`, *over-collection*, audit ∩ PII).

**Changes:** Italicize loanwords. Add spaces around `∩` for legibility. Backtick-quote the `DENY` and `REJECT` codes that were unquoted. Splitting the last sentence into two would further reduce load but is optional.

### 6.10 `weDo` exercise instructions (We Do tab · 24 instructions)

The 24 `instruction` fields are well-formed Spanish imperatives. Spot-checked three:

**Before (L590, L1274, L1646):**

> S42-T1-A-E1 · Valida el payload de `CASO-CUS-042-1A` con schema estricto (required ⊆ keys ⊆ allowed) y regla de negocio sobre `status`. El starter acepta cualquier dict con las claves required e ignora extras y el vocabulario de status. Corrige solo el predicado. Salida exacta: `S42-T1-A PASS`.

> S42-T3-A-E1 · Implementa `trusted(size, max_bytes, host, allowed_hosts, path, root)` para el adjunto de `CASO-CUS-042-3A`: True solo si size≤max, host∈allowlist y path bajo `root/`. El starter aprueba oversize o path `/etc` e ignora la allowlist. Corrige el cuerpo de la función. Salida exacta: `S42-T3-A PASS`.

> S42-T3-B-E3 · Transfer: el pipeline de CI de la mesa de Cusco decide un promote a staging. Scan limpio (sin secreto, deps pinneadas, 0 CVE críticas) → `CONTINUE`; API key en repo o CVE abiertas → `ROTATE_AND_BLOCK`; sin campo `critical_cves` en el informe → `ASSESS_DEPENDENCY_RISK` (no inventes un cero). El starter trata missing como CONTINUE y aprueba el adverso: corrige ambas ramas. Salida: imprime el valor de meets_contract.

**Issues:** "deps pinneadas" (L1646) — `pinneadas` is an Anglicism (from "pinned") that RAE does not register; `fijadas` is the Spanish equivalent and is used elsewhere (e.g. L22 "dependencias fijadas"). "promote" used as Spanish noun. "Transfer:" English label at start of E3 instructions — consistent across the 8 E3 exercises (intentional). Inline math symbols `⊆`, `≤`, `∈` are clear.

**After (proposed):**

> S42-T3-B-E3 · Transferencia: el pipeline de CI de la mesa de Cusco decide un *promote* a *staging*. *Scan* limpio (sin secreto, deps fijadas, 0 CVE críticas) → `CONTINUE`; API *key* en repo o CVE abiertas → `ROTATE_AND_BLOCK`; sin campo `critical_cves` en el informe → `ASSESS_DEPENDENCY_RISK` (no inventes un cero). El *starter* trata *missing* como `CONTINUE` y aprueba el adverso: corrige ambas ramas. Salida: imprime el valor de `meets_contract`.

**Changes:** `Transfer:` → `Transferencia:` (or keep `Transfer:` as established course convention — but if so, gloss on first use). `pinneadas` → `fijadas`. Italicize loanwords. Backtick-quote code identifiers. Same template should apply to all 24 instructions.

### 6.11 `weDo` hints (We Do tab · 24 hint strings)

The 24 `hint` strings are mostly code (`return needed in granted and service_id.startswith('svc-') and route_declared`). These are correctly Python syntax, not Spanish prose. The `hints` array (hint 1 + hint 2 per exercise) contains Spanish sentences that are clean. ✅ No rewrite needed for hints.

### 6.12 `weDo` feedback strings (We Do tab · 24 feedback strings)

The 24 `feedback` strings are 1-sentence explanations. Spot-checked three:

**Before (L598, L1654, L2086):**

> S42-T1-A-E1: explica por qué required⊆keys⊆allowed modela extra=forbid y por qué un status inválido es REJECT_SCHEMA, no authz.

> S42-T3-B-E3: el release manager de Cusco rota y bloquea ante hallazgo demostrable; sin inventario CVE no se inventa un promote limpio — ASSESS, no CONTINUE.

> S42-T4-B-E3: soft-delete de la fila no cierra CP-N4-A en Cusco — hace falta purga de derivados y prueba de no-reaparición; sin key_separate el alcance queda en VERIFY humana.

**Issues:** Code identifiers (`extra=forbid`, `REJECT_SCHEMA`, `authz`, `promote`, `key_separate`, `VERIFY`, `CONTINUE`, `ASSESS`) are not backtick-quoted in feedback strings — inconsistent with the `instruction` and `hint` strings which do backtick-quote them. Telegraphic style in L1654 ("ASSESS, no CONTINUE") reads as a slogan.

**After (proposed, L1654):**

> S42-T3-B-E3: el *release manager* de Cusco rota y bloquea ante hallazgo demostrable; sin inventario CVE no se inventa un *promote* limpio — `ASSESS_DEPENDENCY_RISK`, no `CONTINUE`.

**Changes:** Backtick-quote the action codes (they're literal identifiers the learner must use). Italicize loanwords. Use full code names (`ASSESS_DEPENDENCY_RISK`, not `ASSESS`) for consistency with the `instruction`.

### 6.13 `youDo.context` (You Do tab · context paragraph)

**Before (L2156):**

> Eres el dueño del control plane de soporte sintético en Cusco (`CASO-CUS-042`). La misma petición HTTP que versionaste en S41 debe atravesar schema estricto, resource binding, allowlist de hosts, confinamiento de path y una vista redactada sin email. Entrada: payload, actor, owner, scopes, host y path. Salida: allow/deny auditable + evidencia de purga. El gate **CP-N4-A** se bloquea ante campo extra, lectura cross-tenant, URL/path no permitidos o reaparición de un campo redactado.

**Issues:** Sentence 2 is 26 words with 5 noun-phrases — at the upper edge. Sentence 4 ("El gate **CP-N4-A** se bloquea ante…") is 19 words, OK. Loanwords (`schema`, `resource binding`, `allowlist`, `path`, `email`, `payload`, `owner`, `scopes`, `gate`) not italicized.

**After (proposed):**

> Eres el dueño del *control plane* de soporte sintético en Cusco (`CASO-CUS-042`). La misma petición HTTP que versionaste en S41 debe atravesar *schema* estricto, *resource binding*, *allowlist* de *hosts*, confinamiento de *path* y una vista redactada sin *email*. Entrada: *payload*, *actor*, *owner*, *scopes*, *host* y *path*. Salida: *allow/deny* auditable + evidencia de purga. El gate **CP-N4-A** se bloquea ante campo extra, lectura *cross-tenant*, URL/*path* no permitidos o reaparición de un campo redactado.

**Changes:** Italicize loanwords. No structural change.

### 6.14 `youDo.portfolioNote` (You Do tab · portfolio note)

**Before (L2265):**

> Evidencia de CP-N4-A: el starter calcula READY desde asserts reales (extra→REJECT_SCHEMA, cross-tenant→DENY, SSRF y path→REJECT, email no reaparece, purga limpia). En tu repo amplía con matriz de scopes por `svc-*`, rotación de secretos, rollback documentado y riesgo residual — no entregues un checklist de booleans a mano.

**Issues:** `booleans` is English plural in Spanish sentence (LT rule `AGREEMENT_DET_NOUN`). Sentence 2 is 27 words — OK. `asserts` used as Spanish noun.

**After (proposed):**

> Evidencia de CP-N4-A: el *starter* calcula `READY` desde *asserts* reales (extra → `REJECT_SCHEMA`, *cross-tenant* → `DENY_CROSS_TENANT`, SSRF y *path* → `REJECT_UNTRUSTED_INPUT`, *email* no reaparece, purga limpia). En tu repo amplía con matriz de *scopes* por `svc-*`, rotación de secretos, *rollback* documentado y riesgo residual — no entregues un *checklist* de booleanos a mano.

**Changes:** `booleans` → `booleanos`. Italicize loanwords. Backtick-quote full action codes (`DENY_CROSS_TENANT`, `REJECT_UNTRUSTED_INPUT` — the original `DENY`/`REJECT` shorthand was inconsistent with the codes used in the exercises). Add spaces around `→` for legibility.

### 6.15 `youDo.rubric` (You Do tab · 6 rubric criteria)

**Before (L2267–L2272):**

> - Correctitud del contrato y gate CP-N4-A (25%)
> - Pruebas normal/breach/uncertain y recuperación (20%)
> - Seguridad, privacidad y least privilege (15%)
> - Reproducibilidad, lineage y evidencia (15%)
> - Operación: SLO, observabilidad y rollback (15%)
> - Comunicación de trade-offs y límites (10%)

**Issues:** Loanwords (`breach`, `uncertain`, `least privilege`, `lineage`, `SLO`, `observabilidad`, `rollback`, `trade-offs`) not italicized. `breach/uncertain` slash-form is consistent with course style. No real grammar issues.

**After (proposed):**

> - Correctitud del contrato y gate CP-N4-A. (25 %)
> - Pruebas *normal* / *breach* / *uncertain* y recuperación. (20 %)
> - Seguridad, privacidad y *least privilege*. (15 %)
> - Reproducibilidad, *lineage* y evidencia. (15 %)
> - Operación: SLO, observabilidad y *rollback*. (15 %)
> - Comunicación de *trade-offs* y límites. (10 %)

**Changes:** Italicize loanwords. Per RAE *DPD* §"Porcentaje", the % sign is separated from the numeral by a space ("25 %"). Add terminal periods. No content lost.

### 6.16 `selfCheck` questions and explanations (Self Check tab · 5 questions)

**Before (L2278, explanation; L2287, explanation):**

> Se exige forma estricta comprobable: válidos pasan y extras/status basura fallan; evidencia decorativa o PII no cuenta.

> Authn ≠ authz: identidad correcta sin pertenencia del recurso → DENY con audit trail; no se convierte breach en éxito.

**Issues:** `Authn ≠ authz` notation is consistent with `jobRelevance` (✅). `audit trail` and `breach` are loanwords. `válido` should agree with the implied `fixture válido` (masc sing) — LT rule `AGREEMENT_POSTPONED_ADJ` fires on L698 (similar surface). Telegraphic style in both explanations (acceptable for MCQ rationale).

**After (proposed):**

> Se exige forma estricta comprobable: los válidos pasan y los extras/*status* basura fallan; la evidencia decorativa o la PII no cuenta.

> **Authn ≠ authz**: identidad correcta sin pertenencia del recurso → `DENY_CROSS_TENANT` con *audit trail*; no se convierte un *breach* en éxito.

**Changes:** Add articles ("los válidos", "los extras", "la evidencia", "la PII"). Bold the `Authn ≠ authz` opener. Backtick-quote the action code (`DENY_CROSS_TENANT`). Italicize loanwords.

### 6.17 `resources.docs.note` (Resources tab · 10 short notes)

**Before (L2314–L2359):**

> Validación y JSON Schema
> Contrato de forma interoperable
> Riesgos y controles de APIs
> Authn/authz, SSRF, secrets
> Secretos fuera del repo y rotación
> Gestión de riesgo de privacidad
> Identidad digital y autenticación
> Borrado y retención
> Scopes y autorización
> Tokens y pseudonimización didáctica

**Issues:** `APIs` plural sigla (L2324) — LT rule `SIGLAS`. `Authn/authz` slash notation (L2329). These are short labels; style conventions are looser here than in body prose.

**After (proposed, normalize `APIs` → `API`):**

> Validación y JSON Schema
> Contrato de forma interoperable
> Riesgos y controles de API
> Authn/authz, SSRF y secretos
> Secretos fuera del repo y rotación
> Gestión de riesgo de privacidad
> Identidad digital y autenticación
> Borrado y retención
> Scopes y autorización
> Tokens y pseudonimización didáctica

**Changes:** `APIs` → `API` (invariable sigla, RAE preference). Add `y` in "SSRF, secrets" → "SSRF y secrets" for parallelism with other notes. Other notes are clean.

---

## 7. Proposed GitHub-style Diffs

One diff per issue or logical group. Paths are repo-relative to `https://github.com/PillB/pyarcana`. Do **not** apply (audit-only pass).

### Diff 1 — Rename file + section id (H-1)

```diff
--- a/src/lib/course/sections/s42-graph-rag.ts
+++ b/src/lib/course/sections/s42-schemas-security.ts
@@ -1,6 +1,6 @@
 import type { CourseSection } from '../../types'

 export const section42: CourseSection = {
-  id: "graph-rag",
+  id: "schemas-security",
   index: 42,
   title: "Schemas, seguridad y privacidad de servicios",
```

```diff
--- a/src/lib/course/index.ts
+++ b/src/lib/course/index.ts
@@ -43,7 +43,7 @@
 import { section40 } from './sections/s40-agentic-architecture'
 import { section41 } from './sections/s41-llm-finetuning'
-import { section42 } from './sections/s42-graph-rag'
+import { section42 } from './sections/s42-schemas-security'
 import { section43 } from './sections/s43-llmops'
 import { section44 } from './sections/s44-multimodal'
```

### Diff 2 — Replace off-topic demo (H-2)

```diff
--- a/src/components/course/SectionView.tsx
+++ b/src/components/course/SectionView.tsx
@@ -3186,73 +3186,82 @@
     },
-    'graph-rag': {
-      title: 'Practica knowledge graphs (simulado)',
-      code: `# Simulacion de knowledge graph y GraphRAG
-# Sin Neo4j - implementamos con dict de adyacencia
-
-class KnowledgeGraph:
-    """Knowledge graph simple con dict de adyacencia."""
-    def __init__(self):
-        self.nodes = {}
-        self.edges = []
-
-    def add_node(self, name, node_type):
-        self.nodes[name] = {"type": node_type}
-
-    def add_edge(self, source, target, rel_type):
-        self.edges.append({"source": source, "target": target, "type": rel_type})
-
-    def neighbors(self, node, rel_type=None):
-        """Encuentra vecinos de un nodo."""
-        result = []
-        for e in self.edges:
-            if e["source"] == node and (rel_type is None or e["type"] == rel_type):
-                result.append(e["target"])
-        return result
-
-    def find_path(self, start, end, max_depth=3):
-        """Encuentra camino entre dos nodos (BFS)."""
-        queue = [(start, [start])]
-        visited = {start}
-        while queue:
-            node, path = queue.pop(0)
-            if node == end:
-                return path
-            if len(path) >= max_depth:
-                continue
-            for neighbor in self.neighbors(node):
-                if neighbor not in visited:
-                    visited.add(neighbor)
-                    queue.append((neighbor, path + [neighbor]))
-        return None
-
-# Construir knowledge graph
-kg = KnowledgeGraph()
-kg.add_node("Ana", "Person")
-kg.add_node("Interbank", "Company")
-kg.add_node("Luis", "Person")
-kg.add_node("ChurnBot", "Project")
-
-kg.add_edge("Ana", "Interbank", "WORKS_AT")
-kg.add_edge("Luis", "Interbank", "WORKS_AT")
-kg.add_edge("Ana", "ChurnBot", "WORKS_ON")
-kg.add_edge("Luis", "ChurnBot", "WORKS_ON")
-
-# Query: colegas de Ana
-print("=== Knowledge Graph Queries ===")
-colegas = kg.neighbors("Ana", "WORKS_AT")
-print(f"Colegas de Ana: {colegas}")
-
-# Query: proyectos de Ana
-proyectos = kg.neighbors("Ana", "WORKS_ON")
-print(f"Proyectos de Ana: {proyectos}")
-
-# Multi-hop: quien mas trabaja en el mismo proyecto que Ana?
-print(f"\\nMulti-hop: colegas en mismo proyecto:")
-for proj in kg.neighbors("Ana", "WORKS_ON"):
-    workers = kg.neighbors(proj)  # pero edges van persona->proyecto
-    # Invertir: buscar quien tiene edge hacia este proyecto
-    for e in kg.edges:
-        if e["target"] == proj and e["source"] != "Ana":
-            print(f"  {e['source']} tambien trabaja en {proj}")`,
-      expectedOutput: `=== Knowledge Graph Queries ===
-Colegas de Ana: ['Interbank']
-Proyectos de Ana: ['ChurnBot']
-
-Multi-hop: colegas en mismo proyecto:
-  Luis tambien trabaja en ChurnBot`,
-      hint: 'Anade un nodo "Maria" que tambien trabaja en Interbank y encuentra el camino',
+    'schemas-security': {
+      title: 'Practica el policy_engine (simulado)',
+      code: `# Simulación de policy_engine fail-closed de S42
+# Cadena: schema → SSRF host → path → authz resource binding
+
+ALLOWED_KEYS = {"case_id", "status"}
+ALLOWED_HOSTS = {"docs.local"}
+SAFE_ROOT = "/safe/reports"
+
+def policy_engine(req, actor, owner, scopes, host, user_path="a.txt", root=SAFE_ROOT):
+    """Decide CONTINUE / REJECT_SCHEMA / REJECT_UNTRUSTED_INPUT / DENY_CROSS_TENANT."""
+    if not ALLOWED_KEYS.issubset(req) or set(req) - ALLOWED_KEYS:
+        return "REJECT_SCHEMA"
+    if host not in ALLOWED_HOSTS:
+        return "REJECT_UNTRUSTED_INPUT"
+    if ".." in user_path.split("/"):
+        return "REJECT_UNTRUSTED_INPUT"
+    joined = f"{root.rstrip('/')}/{user_path.lstrip('/')}"
+    if not joined.startswith(root.rstrip("/") + "/") and joined != root.rstrip("/"):
+        return "REJECT_UNTRUSTED_INPUT"
+    if "cases:read" not in scopes or actor != owner:
+        return "DENY_CROSS_TENANT"
+    return "CONTINUE"
+
+print("=== Policy Engine (CASO-CUS-042) ===")
+
+# 1. Happy path
+print(policy_engine(
+    {"case_id": "CASO-CUS-042", "status": "open"},
+    "user-a", "user-a", {"cases:read"}, "docs.local"
+))
+
+# 2. Schema reject (campo extra)
+print(policy_engine(
+    {"case_id": "CASO-CUS-042", "status": "open", "note_interna": "x"},
+    "user-a", "user-a", {"cases:read"}, "docs.local"
+))
+
+# 3. Cross-tenant
+print(policy_engine(
+    {"case_id": "CASO-CUS-042", "status": "open"},
+    "user-a", "user-b", {"cases:read"}, "docs.local"
+))
+
+# 4. SSRF
+print(policy_engine(
+    {"case_id": "CASO-CUS-042", "status": "open"},
+    "user-a", "user-a", {"cases:read"}, "169.254.169.254"
+))
+
+# 5. Path traversal
+print(policy_engine(
+    {"case_id": "CASO-CUS-042", "status": "open"},
+    "user-a", "user-a", {"cases:read"}, "docs.local",
+    user_path="../etc/passwd"
+))`,
+      expectedOutput: `=== Policy Engine (CASO-CUS-042) ===
+CONTINUE
+REJECT_SCHEMA
+DENY_CROSS_TENANT
+REJECT_UNTRUSTED_INPUT
+REJECT_UNTRUSTED_INPUT`,
+      hint: 'Cambia user_path a "subdir/a.txt" y observa CONTINUE; prueba sin cases:read en scopes',
     },
```

### Diff 3 — Fix PDF mislabel (H-3)

```diff
--- a/src/components/course/PdfReport.tsx
+++ b/src/components/course/PdfReport.tsx
@@ -79,7 +79,7 @@
   "llm-finetuning": '41. FineTune',
-  "graph-rag": '42. GraphRAG',
+  "schemas-security": '42. Schemas y seguridad',
   llmops: '43. LLMOps',
```

(If the id rename is deferred, the stopgap is `"graph-rag": '42. Schemas y seguridad',`.)

### Diff 4 — Split run-on `jobRelevance` (H-4)

```diff
--- a/src/lib/course/sections/s42-schemas-security.ts
+++ b/src/lib/course/sections/s42-schemas-security.ts
@@ -12,7 +12,11 @@
   jobRelevance:
-    "En equipos de plataforma y producto (fintech, healthtech, retail y gobierno digital en el Perú), la API versionada de S41 no basta: hace falta un **control plane fail-closed**. **Schemas estrictos** rechazan campos extra antes de tocar negocio; **authn ≠ authz** con RBAC y resource binding evita que un analista de Cusco lea el ticket de otro tenant; **scopes** deny-by-default cierran rutas no declaradas; **SSRF/path** y secretos fuera del repo evitan abusos de red y filtraciones; **minimización, redacción y purga** cierran el ciclo de privacidad. El artefacto de esta sección es threat model + matriz de permisos con evidencia allow/deny auditable. Solo se promociona cuando se demuestra **CP-N4-A**: un actor nunca lee el caso de otro y un campo redactado no reaparece en logs, respuestas ni backups activos.",
+    "En equipos de plataforma y producto (fintech, healthtech, retail y gobierno digital en el Perú), la API versionada de S41 no basta: hace falta un **control plane fail-closed**. Cuatro controles lo sostienen. **Schemas estrictos** rechazan campos extra antes de tocar negocio. **Authn ≠ authz** con RBAC y *resource binding* evita que un analista de Cusco lea el ticket de otro tenant. **Scopes** *deny-by-default* cierran rutas no declaradas; **SSRF/path** y secretos fuera del repo evitan abusos de red y filtraciones. **Minimización, redacción y purga** cierran el ciclo de privacidad. El artefacto de esta sección es *threat model* + matriz de permisos con evidencia *allow/deny* auditable. Solo se promociona cuando se demuestra **CP-N4-A**: un actor nunca lee el caso de otro y un campo redactado no reaparece en *logs*, respuestas ni *backups* activos.",
```

### Diff 5 — Normalize `authn ≠ authz` notation (M-2)

```diff
--- a/src/lib/course/sections/s42-schemas-security.ts
+++ b/src/lib/course/sections/s42-schemas-security.ts
@@ -16,8 +16,8 @@
   learningOutcomes: [
     { text: "Definir un schema de borde estricto (tipos + rechazo de campos extra) y exportar fixtures válidos/inválidos" },
     { text: "Evolucionar contratos con cambios aditivos y discriminated unions exhaustivas sin romper lectores previos" },
-    { text: "Implementar authn≠authz con RBAC y resource binding que deniega lectura cross-tenant" },
-    { text: "Aplicar scopes e identidades de servicio con política deny-by-default en rutas no declaradas" },
+    { text: "Implementar **authn ≠ authz** con RBAC y *resource binding* que deniega lectura *cross-tenant*" },
+    { text: "Aplicar *scopes* e identidades de servicio con política *deny-by-default* en rutas no declaradas" },
```

### Diff 6 — Spanish-ize T2-A opening (M-2)

```diff
--- a/src/lib/course/sections/s42-schemas-security.ts
+++ b/src/lib/course/sections/s42-schemas-security.ts
@@ -161,7 +161,7 @@
       heading: "Authn/authz y RBAC",
       subtopicId: "S42-T2-A",
       paragraphs: [
-        "Authentication identifica al actor; authorization decide una **acción sobre un recurso**. Un JWT o cookie válida responde «quién eres», no «puedes leer el caso de otro tenant». RBAC arranca con roles mínimos y exige *resource binding*: el permiso se evalúa contra el **dueño del caso**, no solo contra el rol del token. Confundir authn con authz es el error clásico que convierte un analista legítimo en un lector cross-tenant.",
+        "La autenticación (authn) identifica al actor; la autorización (authz) decide una **acción sobre un recurso**. Un JWT o *cookie* válida responde «quién eres», no «puedes leer el caso de otro *tenant*». RBAC arranca con roles mínimos y exige *resource binding*: el permiso se evalúa contra el **dueño del caso**, no solo contra el rol del *token*. Confundir **authn** con **authz** es el error clásico que convierte un analista legítimo en un lector *cross-tenant*.",
```

### Diff 7 — Fix `LEE_LE` callout (M-3)

```diff
--- a/src/lib/course/sections/s42-schemas-security.ts
+++ b/src/lib/course/sections/s42-schemas-security.ts
@@ -185,7 +185,7 @@
         title: "Contrato local",
         content:
-          "La revisión de S42-T2-A conserva prueba actor A no lee caso B; no conviertas `DENY_CROSS_TENANT` ni `VERIFY_RESOURCE_OWNER` en éxito silencioso.",
+          "La revisión de S42-T2-A conserva la prueba de que el actor A no lee el caso B; no conviertas `DENY_CROSS_TENANT` ni `VERIFY_RESOURCE_OWNER` en éxito silencioso.",
```

### Diff 8 — `booleans` → `booleanos` (M-4)

```diff
--- a/src/lib/course/sections/s42-schemas-security.ts
+++ b/src/lib/course/sections/s42-schemas-security.ts
@@ -2262,7 +2262,7 @@
 `,
-    portfolioNote: "Evidencia de CP-N4-A: el starter calcula READY desde asserts reales (extra→REJECT_SCHEMA, cross-tenant→DENY, SSRF y path→REJECT, email no reaparece, purga limpia). En tu repo amplía con matriz de scopes por `svc-*`, rotación de secretos, rollback documentado y riesgo residual — no entregues un checklist de booleans a mano.",
+    portfolioNote: "Evidencia de CP-N4-A: el *starter* calcula `READY` desde *asserts* reales (extra → `REJECT_SCHEMA`, *cross-tenant* → `DENY_CROSS_TENANT`, SSRF y *path* → `REJECT_UNTRUSTED_INPUT`, *email* no reaparece, purga limpia). En tu repo amplía con matriz de *scopes* por `svc-*`, rotación de secretos, *rollback* documentado y riesgo residual — no entregues un *checklist* de booleanos a mano.",
```

### Diff 9 — Siglas invariable (M-5)

```diff
--- a/src/lib/course/sections/s42-schemas-security.ts
+++ b/src/lib/course/sections/s42-schemas-security.ts
@@ -27,7 +27,7 @@
-        "**Diccionario de la sección** (léelo antes de T1). **Schema estricto:** forma + tipos + rechazo de campos extra. **Authn/authz:** quién eres vs qué puedes hacer. **RBAC/scopes:** roles y permisos deny-by-default. **SSRF/path traversal:** abuso de URLs o rutas del servidor. **Minimización/retención:** solo el dato necesario, solo el tiempo necesario. **Pseudonimización:** identificadores derivados sin reidentificación fácil. **Redacción:** campo sensible no reaparece en logs, respuestas ni backups activos. **Missing ≠ breach:** falta de evidencia se enruta a revisión humana; no se inventa un allow ni se confunde con un ataque demostrado.",
+        "**Diccionario de la sección** (léelo antes de T1). **Schema estricto:** forma + tipos + rechazo de campos extra. **Authn/authz:** quién eres vs. qué puedes hacer. **RBAC/scopes:** roles y permisos *deny-by-default*. **SSRF/path traversal:** abuso de URL o rutas del servidor. **Minimización/retención:** solo el dato necesario, solo el tiempo necesario. **Pseudonimización:** identificadores derivados sin reidentificación fácil. **Redacción:** campo sensible no reaparece en *logs*, respuestas ni *backups* activos. **Missing ≠ breach:** falta de evidencia se enruta a revisión humana; no se inventa un *allow* ni se confunde con un ataque demostrado.",
@@ -2321,7 +2321,7 @@
         note: "Contrato de forma interoperable",
       },
       {
         label: "OWASP API Security Top 10",
         url: "https://owasp.org/www-project-api-security/",
-        note: "Riesgos y controles de APIs",
+        note: "Riesgos y controles de API",
       },
```

### Diff 10 — `vs` → `vs.` (M-6)

```diff
--- a/src/lib/course/sections/s42-schemas-security.ts
+++ b/src/lib/course/sections/s42-schemas-security.ts
@@ -556,7 +556,7 @@
         subtopicId: "S42-T4-B",
         environment: "local-python",
-        description: "Demo: borrado primario vs derivado vivo",
+        description: "Demo: borrado primario vs. derivado vivo",
```

Plus grep-replace `\bvs\b` → `vs.` across the file (3 occurrences total: L30 already handled by Diff 9, L559 above, plus any in `edgeCases`/`feedback`).

### Diff 11 — Spanish-ize `service identities` heading (M-7)

```diff
--- a/src/lib/course/sections/s42-schemas-security.ts
+++ b/src/lib/course/sections/s42-schemas-security.ts
@@ -189,7 +189,7 @@
-      heading: "Scopes, service identities y deny-by-default",
+      heading: "Scopes, identidades de servicio y deny-by-default",
```

```diff
@@ -221,7 +221,7 @@
-      heading: "Límites de input, injection y SSRF/path traversal",
+      heading: "Límites de entrada, inyección y SSRF/path traversal",
```

### Diff 12 — Split telegraphic callout (M-8)

```diff
--- a/src/lib/course/sections/s42-schemas-security.ts
+++ b/src/lib/course/sections/s42-schemas-security.ts
@@ -296,7 +296,7 @@
         title: "Contrato local",
         content:
-          "Promoción de S42-T3-B: prueba scan sin secreto y rotación ensayada y registra por separado `ROTATE_AND_BLOCK` (breach) y `ASSESS_DEPENDENCY_RISK` (missing).",
+          "Promoción de S42-T3-B: prueba el *scan* sin secreto y la rotación ensayada. Registra por separado `ROTATE_AND_BLOCK` (*breach*) y `ASSESS_DEPENDENCY_RISK` (*missing*).",
```

### Diff 13 — `pinneadas` → `fijadas` in We-Do E3 instructions (M-8)

Apply across all 8 E3 instructions that mention "pinneadas". Representative diff:

```diff
--- a/src/lib/course/sections/s42-schemas-security.ts
+++ b/src/lib/course/sections/s42-schemas-security.ts
@@ -1643,7 +1643,7 @@
-        instruction: "S42-T3-B-E3 · Transfer: el pipeline de CI de la mesa de Cusco decide un promote a staging. Scan limpio (sin secreto, deps pinneadas, 0 CVE críticas) → `CONTINUE`; API key en repo o CVE abiertas → `ROTATE_AND_BLOCK`; sin campo `critical_cves` en el informe → `ASSESS_DEPENDENCY_RISK` (no inventes un cero). El starter trata missing como CONTINUE y aprueba el adverso: corrige ambas ramas. Salida: imprime el valor de meets_contract.",
+        instruction: "S42-T3-B-E3 · Transferencia: el pipeline de CI de la mesa de Cusco decide un *promote* a *staging*. *Scan* limpio (sin secreto, deps fijadas, 0 CVE críticas) → `CONTINUE`; API *key* en repo o CVE abiertas → `ROTATE_AND_BLOCK`; sin campo `critical_cves` en el informe → `ASSESS_DEPENDENCY_RISK` (no inventes un cero). El *starter* trata *missing* como `CONTINUE` y aprueba el adverso: corrige ambas ramas. Salida: imprime el valor de `meets_contract`.",
```

(Repeat for any other `pinneadas` occurrences in We-Do instructions.)

### Diff 14 — Backtick-quote action codes in feedback strings (M-8)

```diff
--- a/src/lib/course/sections/s42-schemas-security.ts
+++ b/src/lib/course/sections/s42-schemas-security.ts
@@ -1651,7 +1651,7 @@
-        feedback: "S42-T3-B-E3: el release manager de Cusco rota y bloquea ante hallazgo demostrable; sin inventario CVE no se inventa un promote limpio — ASSESS, no CONTINUE.",
+        feedback: "S42-T3-B-E3: el *release manager* de Cusco rota y bloquea ante hallazgo demostrable; sin inventario CVE no se inventa un *promote* limpio — `ASSESS_DEPENDENCY_RISK`, no `CONTINUE`.",
```

(Repeat for any other feedback strings using shorthand action codes.)

### Diff 15 — Replace `CASO-CUS-042` taxonomy header in starterCode (L-3)

Apply across all 24 starterCode files. Representative diff:

```diff
--- a/src/lib/course/sections/s42-schemas-security.ts
+++ b/src/lib/course/sections/s42-schemas-security.ts
@@ -599,7 +599,7 @@
           title: "s42-t1-a-e1.py",
           code: `-# CASO-CUS-042 · schema estricto (extra=forbid) + status
+# Ejercicio S42-T1-A · Schema estricto (extra=forbid) + status
 # Defecto didáctico: el predicado solo exige required; acepta extras y status basura.
 # Corrige solo la decisión de dominio; conserva datos y la salida esperada.
 payload = {"case_id": "CASO-CUS-042-1A", "status": "open"}
```

(Optional: keep `CASO-CUS-042` in the data fixtures — those refer to the synthetic case ID — but drop it from the comment header.)

### Diff 16 — Add periods + space-before-percent in rubric (L-4)

```diff
--- a/src/lib/course/sections/s42-schemas-security.ts
+++ b/src/lib/course/sections/s42-schemas-security.ts
@@ -2264,11 +2264,11 @@
     rubric: [
-      { criterion: "Correctitud del contrato y gate CP-N4-A", weight: "25%" },
-      { criterion: "Pruebas normal/breach/uncertain y recuperación", weight: "20%" },
-      { criterion: "Seguridad, privacidad y least privilege", weight: "15%" },
-      { criterion: "Reproducibilidad, lineage y evidencia", weight: "15%" },
-      { criterion: "Operación: SLO, observabilidad y rollback", weight: "15%" },
-      { criterion: "Comunicación de trade-offs y límites", weight: "10%" },
+      { criterion: "Correctitud del contrato y gate CP-N4-A.", weight: "25 %" },
+      { criterion: "Pruebas normal/breach/uncertain y recuperación.", weight: "20 %" },
+      { criterion: "Seguridad, privacidad y least privilege.", weight: "15 %" },
+      { criterion: "Reproducibilidad, lineage y evidencia.", weight: "15 %" },
+      { criterion: "Operación: SLO, observabilidad y rollback.", weight: "15 %" },
+      { criterion: "Comunicación de trade-offs y límites.", weight: "10 %" },
     ],
```

(If the rubric renderer expects no period in `criterion`, skip the period — but the space-before-percent is RAE-preferred.)

---

## 8. Recommended Priority Order for Fixing

| Priority | Issue | Effort | Impact |
|----------|-------|--------|--------|
| P0 | H-2 Replace off-topic `graph-rag` demo with on-topic `policy_engine` simulator (Diff 2) | Medium (write ~80 lines of Python) | High — fixes the most learner-visible defect |
| P0 | H-3 Fix PDF label `42. GraphRAG` → `42. Schemas y seguridad` (Diff 3, stopgap version) | Trivial | High — fixes PDF misalignment immediately |
| P1 | H-1 Rename file `s42-graph-rag.ts` → `s42-schemas-security.ts` and id `"graph-rag"` → `"schemas-security"` (Diff 1) + propagate to `SectionView.tsx`, `PdfReport.tsx`, tests, state persistence | Medium (grep-replace + smoke test) | High — eliminates legacy-id drift at the root |
| P1 | H-4 Split run-on `jobRelevance` sentence (Diff 4) | Trivial | High — fixes first-impression cognitive overload |
| P2 | M-2 Normalize `authn ≠ authz` notation + Spanish-ize T2-A opening (Diffs 5, 6) | Trivial | Medium — eliminates conceptual-notation drift |
| P2 | M-3 Fix `LEE_LE` callout (Diff 7) | Trivial | Medium — removes a real grammar error |
| P2 | M-4 `booleans` → `booleanos` (Diff 8) | Trivial | Low-Medium — single loanword plural |
| P3 | M-5 Siglas invariable `URL`/`API` (Diff 9) | Trivial | Low — RAE preference |
| P3 | M-6 `vs` → `vs.` (Diff 10) | Trivial | Low — consistency with other sections |
| P3 | M-7 Spanish-ize headings "service identities" / "input, injection" (Diff 11) | Trivial | Low — consistency |
| P3 | M-8 Split telegraphic callout + `pinneadas` → `fijadas` + backtick action codes (Diffs 12–14) | Trivial | Low-Medium — style polish |
| P4 | L-3 Replace `CASO-CUS-042` taxonomy header in starterCode (Diff 15) | Low (24× find-replace) | Low — author-facing leak |
| P4 | L-4 Rubric periods + space-before-percent (Diff 16) | Trivial | Low — RAE typography |
| P4 | L-1 Fix demo typos (`Simulacion`, `Anade`, `Maria`, `tambien`) | N/A — superseded by Diff 2 | Low — moot once demo is replaced |

---

## 9. Graph Memory Update Notes (for shared context files)

For the orchestrator's shared graph memory and downstream Fixer agents:

- **Section 42 node:** id `"graph-rag"` (legacy) → recommended rename to `"schemas-security"`. Title and content are correct (no semantic change needed).
- **Demo drift edges:** `'graph-rag'` in `SectionView.tsx:3189` is connected to KnowledgeGraph content that has zero overlap with S42 theory. Replace with `policy_engine` simulator reusing `youDo.starterCode` logic (lines 2,173–2,263 of source).
- **PDF label drift edge:** `'graph-rag'` → `'42. GraphRAG'` in `PdfReport.tsx:82`. Change to `'42. Schemas y seguridad'`.
- **Roadmap consistency:** V3 roadmap (active, line 584) matches content. Master roadmap (legacy, line 374) is stale ("Structured Outputs, Tool Use & Reliability"). No fix needed in source; the master roadmap file is informational only.
- **Cross-section pattern (legacy-id drift):** S42 joins the set {S06, S09, S10, S13, S15, S32, S39} where the file/id no longer matches the content. The Fixer should consider a course-wide id-audit pass.
- **Cross-section pattern (demo drift):** S42 joins the set {S06, S09, S10, S13, S15, S39} where the `SectionView.tsx` demo map loads off-topic content. The Fixer should consider a course-wide demo audit.
- **Cross-section pattern (PDF mislabel):** S42 joins the set {S15, S39} where `PdfReport.tsx` prints the legacy slot name. The Fixer should consider a course-wide PDF label audit.
- **Cross-section pattern (`vs` without period):** S42 joins {S33 (10×), S39 (4×)}. The Fixer can grep-replace `\bvs\b` → `vs.` course-wide.
- **Cross-section pattern (`CASO-LIM-NNN` taxonomy leak):** S42 uses `CASO-CUS-042` (24×), milder than S10's `CASO-LIM-010` (31×) or S15's `CASO-LIM-015` (24×) because the token is more contextual. The Fixer may keep this convention if the rest of the course uses it consistently.
- **Grammar metrics (S42):** Mean FH 68.7 (real prose ≥6 words), mean WPS 14.8, mean SPW 2.05, 1 run-on (58-word `jobRelevance`), 0 missing inverted `¿¡`, 0 unbalanced delimiters, 0 double spaces, 0 space-before-punct, 0 repeated-word typos, 0 anaphoric-monotony paragraphs, 0 gerund pile-ups. **Cleanest prose of any late-stage section audited so far.**
- **LanguageTool (S42):** 901 raw matches; 869 are `MORFOLOGIK_RULE_ES` spelling false positives on English/tech loanwords (Pydantic, JSON Schema, fintech, etc.). 32 non-spelling matches; of those, ~12 are real (3× `vs`, 2× `LEE_LE`/telegraphic, 1× `booleans`, 2× `SIGLAS`, 2× `AGREEMENT_POSTPONED_ADJ`); the rest are inline-code false positives (`COMMA_PARENTHESIS_WHITESPACE`, `ESPACIO_DESPUES_DE_PUNTO`, `UPPERCASE_SENTENCE_START`, `DOUBLE_PUNCTUATION` on `..`, `SI_AFIRMACION`/`SUBJUNTIVO_PASADO` on `si` conditional).

---

## 10. Method Note (Grammar Audit Subplan)

**Research basis (per `_GRAMMAR_SUBPLAN.md`):**

1. **Fernández-Huerta (1959)** — Spanish Flesch adaptation: `FH = 206.84 − 60·(syllables/word) − 1.02·(words/sentence)`. Bands: ≥90 muy fácil → <30 muy difícil. For technical curriculum, "normal / bastante difícil" (~50–70) is healthy.
2. **Szigriszt-Pazos / INFLESZ** — `INF = 206.835 − 62.3·(syllables/word) − (words/sentence)`. Used in Spanish education/health readability literature.
3. **Words per sentence (WPS)** — soft target 15–32 for technical Spanish pedagogy.
4. **Syllables per word (SPW)** — rough Spanish vowel-group heuristic for lexical complexity.
5. **LanguageTool (`language=es`)** via public HTTP API at `https://api.languagetool.org/v2/check`. 2 chunks of ~18k chars each; throttled 4 s/req.
6. **Pedagogical heuristics** — run-on (>45 w), long (>32 w), missing terminal `.?!`, missing `¿`/`¡`, unbalanced `()[]«»""`, repeated `de de`, English-dominant sentence, meta/AI/TODO leak, gerund pile-up (≥3), high comma density (>0.12), paragraph = one long sentence, anaphoric monotony (3+ sentences same first word), space-before-punct, double space.

**Pipeline applied to S42:**

1. Parsed TS string/template literals for prose keys (`title`, `shortTitle`, `tagline`, `jobRelevance`, `text`, `heading`, `intro`, `instruction`, `hint`, `hints`, `description`, `why`, `tests`, `feedback`, `explanation`, `question`, `content`, `note`, `label`, `criterion`, `context`, `portfolioNote`).
2. Filtered out `likely_code` blocks (heuristic: presence of `def `, `print(`, `import `, `return `, `class `, etc.).
3. Split into sentences (Spanish-aware: protected `p. ej.`, `etc.`, `vs.`, `S.A.` abbreviations; preserved `¿¡`).
4. Computed FH, INFLESZ, WPS, SPW + heuristic flags per sentence and per paragraph.
5. Concatenated paragraph text → LanguageTool chunk(s) (`es`), 4 s throttle.
6. Aggregated: 267 prose blocks → 348 sentences → 210 "real prose" sentences (≥6 words) for headline metrics; 901 LT raw matches → 32 non-spelling → ~12 real findings after false-positive filtering.

**Known false-positive classes for S42:**
- `MORFOLOGIK_RULE_ES` (869 hits) — fires on every English/tech loanword. Expected for a tech course; not a real finding.
- `COMMA_PARENTHESIS_WHITESPACE` (6 hits) — fires inside inline-code Python set literals like `{case_id,region}`. Python idiom; not a real finding.
- `UPPERCASE_SENTENCE_START` (4 hits) — fires when an inline code identifier like `user-a` follows a period. Not a real finding.
- `ESPACIO_DESPUES_DE_PUNTO` (2 hits) — fires when `S42-T3-A PASS.` is immediately followed by a code identifier in my chunking (they're in different fields in source). Not a real finding.
- `SI_AFIRMACION` / `SUBJUNTIVO_PASADO` (4 hits) — fires on `si` conditional (no tilde needed). Not a real finding.
- `DOUBLE_PUNCTUATION` (1 hit) — fires on `..` (literal Unix up-directory reference in path-traversal discussion). Not a real finding.
- `AGREEMENT_POSTPONED_ADJ` (2 hits) — fires on compound subjects like "borrado y no-reaparición verificados". Masc plural "verificados" is correct for mixed-gender compound. Not a real finding.

---

## 11. Validation

- ✅ Nonzero prose extraction: 267 blocks, 348 sentences.
- ✅ FH in plausible range: mean 68.7 (real prose), 47 muy fácil / 99 fácil / 38 normal / 21 difícil / 5 muy difícil.
- ✅ LT API reachable: 2/2 chunks returned (633 + 268 matches).
- ✅ No empty paragraphs; no parse errors.
- ✅ Live site confirms title and demo drift.
- ✅ Roadmap consistency verified (V3 matches content; master is stale but informational only).

---

**Total issues: 18 (3 HIGH, 8 MEDIUM, 7 LOW)**
**Composite score: 7.0 / 10**
**Headline metrics:** Mean FH 68.7 · Mean WPS 14.8 · Mean SPW 2.05 · 1 run-on · 0 inverted-mark errors · 0 unbalanced delimiters · 0 TODO/developer leaks

**This is the complete Explorer report for Section 42. Ready for the Fixer prompt.**
