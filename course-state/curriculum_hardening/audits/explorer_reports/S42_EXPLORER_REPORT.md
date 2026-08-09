# S42 Explorer Report — Schemas, seguridad y privacidad de servicios

**Auditor role:** Curriculum Auditor · Pedagogical Analyst · Technical Editor (STORM + Graph + Loop + Harness)  
**Section only:** 42  
**Generated:** 2026-07-24  
**Sources of truth:** live site catalog + repo `src/lib/course/sections/s42-graph-rag.ts`  
**Live URL:** https://pillb.github.io/pyarcana/#graph-rag  
**Repo:** https://github.com/PillB/pyarcana  
**Do not apply fixes in this run** — analysis + proposed diffs only.

---

## 1. Section Identification & Scope

| Field | Value |
|--------|--------|
| Platform section id (hash) | `graph-rag` |
| Index | 42 |
| Title (learner-facing) | Schemas, seguridad y privacidad de servicios |
| shortTitle | Schemas y seguridad |
| tagline | threat model y pruebas de permisos; un usuario no puede acceder a otro caso ni recuperar datos redacted |
| Level / phase | Master / phase 3 |
| estimatedHours | 20 |
| Source file | `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s42-graph-rag.ts` |
| Producto / gate | Threat model + matriz de permisos · **CP-N4-A** (control plane seguro y privado) |
| Case id (narrative) | `CASO-CUS-042` (Cusco sintético) |
| Structural inventory | Theory map + 8 subtopics (T1–T4 × A/B); **8** iDo demos; **24** weDo (E1/E2/E3); youDo + rubric; **5** selfCheck MCQ; resources (docs/books/courses) |
| Legacy filename | `s42-graph-rag.ts` (id **no** es GraphRAG; V3 = schemas/seguridad/privacidad) |
| Adjacent roadmap | S41 API/HTTP versionada → **S42** endurece schemas/authz/privacidad → S43 contenedores / plataforma gobernada |
| Live SPA note | Hash `#graph-rag` loads the SPA shell; full section body is hydrated from the same TS module as the repo. Catalog card on the home page matches shortTitle/tagline. |

**In-scope analysis dimensions (all covered):** meta-leak · grammar/redaction (ES-PE) · connective tissue · I/We/You Do · cognitive load · exercises/exams · roadmap consistency · external comparison · domain clarity/accessibility.

**Out of scope:** applying patches to curriculum TS or product files; auditing other sections except as gold/peer benchmarks.

---

## 2. Executive Summary of Quality (1–10 + verdict)

### Score: **6.0 / 10**

### Verdict
**Structurally complete Master skeleton with correct V3 topic alignment, fail-closed gate language, and strong external resource anchors — undermined by curriculum-engineering meta-leaks, nearly identical theory shells, CASO-LIM/CUS identity drift, print/flag theater, and weDo that trains “invert the boolean” more than security craft.**

**What works**
- Topic is honest for V3: schemas estrictos, authn≠authz, scopes deny-by-default, injection/SSRF/path, secrets/deps, minimización/retención, audit/deletion/pseudonymization.
- CP-N4-A is measurable and repeated: *no cross-tenant read* + *redacted data does not reappear*.
- Map block includes a usable **Diccionario de la sección**.
- weDo preserves the valuable pedagogical rule **missing ≠ breach** (MISSING/REVIEW vs DENY/REJECT codes).
- Resources are domain-honest (Pydantic, JSON Schema, OWASP API Top 10 / cheat sheets, NIST Privacy + 800-63 + 800-88, OAuth RFC 6749, CS253, etc.).
- No real PII; synthetic Cusco framing is appropriate for Master phase.

**What fails the gold bar** (see `GOLD_STANDARD_CHECKLIST.md`)
- Anti-stub item **#2**: template “Contrato operativo” + “Aplicación de \`…\` al caso peruano sintético” repeated with only the *salida local* swapped.
- Anti-stub item **#3**: multiple theory/iDo snippets print precomputed labels (`jsonschema True`, `union discriminated`, hard-coded SSRF strings) without failing adversarial inputs.
- Anti-stub item **#8**-class: byte-near-identical theory P2 across T1-B / T2-B / T3-A / T3-B / T4-A / T4-B.
- Meta text about **legacy id / V3 path / GraphRAG** is learner-visible.
- Starters label **`CASO-LIM-042`** while fixtures use **`CASO-CUS-042-*`**.
- Prior automated ranks (`S42_AUDIT.json` ACCEPT; PA expert rank 9.55) overstate learner-visible quality; expert human read is **~6.0**, not gold ≥ 9.5 prose.

**Comparative one-liner vs early gold (S01):** S01 teaches with progressive prose, concrete commands, and motivation; S42 mostly ships a **security-policy checklist compiler** (flag dicts) under a Master label.

---

## 3. Detailed Issue Registry

Severity key: **P0** blocks trust / wrong topic / harmful; **P1** serious pedagogy or correctness; **P2** clarity/consistency; **P3** polish.

| ID | Severity | Location | Evidence (quote / pattern) | Pedagogical impact |
|----|----------|----------|----------------------------|--------------------|
| **I-01** | P1 | `jobRelevance`; theory map P4; map code | `Id legacy \`graph-rag\` se conserva; el path V3 es… no GraphRAG/LLM retrieval.`; `graph_rag_topic: False` printed | Curriculum-engineering notes and anti-topic flags leak into learner surface; confuses orientation and dilutes professional tone. |
| **I-02** | P1 | All 24 `starterCode` comments | `# CASO-LIM-042 · …` while `case_id` is `CASO-CUS-042-*` | Geographic/case identity split (Lima label vs Cusco narrative) looks like bulk rewrite residue; weakens situating and audit trail of the lab. |
| **I-03** | P1 | Theory P2 on T1-B, T2-B, T3-A, T3-B, T4-A, T4-B (and near-clones) | `Contrato operativo. Entrada: schemas estrictos, identidad de servicio, scope, propósito y plazo de retención. … Criterio de éxito: un actor nunca lee otro caso…` | Cognitive load without teaching: same global contract pasted under every subtopic; learner cannot form distinct mental models per threat class. Violates progressive disclosure / four-layer pedagogy. |
| **I-04** | P1 | Theory P3 on most subtopics | `Aplicación de \`…\` al caso peruano sintético \`CASO-CUS-042\`: casos sintéticos de soporte… No contiene PII… nunca prueba fraude, parentesco o intención.` | Ethics paste + generic case shell; only “evidencia esperada” token changes. Feels AI-template, not Cusco-specific work. |
| **I-05** | P1 | Multiple theory `code` + iDo | e.g. `print("jsonschema", True)`; `print("union", "discriminated")`; `print("ssrf_guard", "allowlist")`; T3-A never raises on `..` | **Print theater**: concept labeled rather than computed/failed. Master learners do not practice detecting SSRF/path breach. |
| **I-06** | P1 | iDo `S42-T2-A-DEMO` `why` vs `code` | why: *“deja como evidencia prueba actor A no lee caso B”*; code only prints `authn u1` / `roles ['analyst']` | Evidence claim does not match demo. Breaks I Do fidelity (show the full decision path). |
| **I-07** | P1 | weDo E1–E3 × 8 subtopics | Inverted predicates on pre-baked flags (`extra_policy=="allow"`, `secret_in_repo or not dependency_pinned`, etc.) | After 2–3 exercises, task becomes pattern recognition (“flip the comparison”), not schema design, authz, or threat modeling. Transfer (E3) is isomorphic to E2 with different status strings. |
| **I-08** | P2 | Headings T1-B, T2-A, T2-B, T3-A, T3-B, T4-A, T4-B | `evolución, discriminated unions…`; `authn/authz y RBAC`; `input limits…` (sentence-case / lowercase) | Inconsistent redaction vs map heading; looks unfinished; hurts scanability and ES-PE editorial quality. |
| **I-09** | P2 | `tagline` | `…ni recuperar datos redacted` | English participle mid Spanish tagline; elsewhere “redactado”. |
| **I-10** | P2 | `learningOutcomes` | `Define schemas Pydantic/JSON Schema`; `Implementa authn/authz RBAC` | Telegraphic; incomplete objects; less measurable than S01 outcomes. |
| **I-11** | P2 | Theory T2-A `can_read` vs weDo T2-A | Theory allows `role == "admin" or actor == owner`; exercises require `actor == resource_owner` + `case:read` only | Slight contract drift; admin path never exercised. |
| **I-12** | P2 | Starter comments / instructions | `DEFECT:`; `salida alineada a solutionCode` | Developer harness language in learner-facing starters (meta). |
| **I-13** | P2 | Title vs stack honesty | Headings/outcomes promise **Pydantic/JSON Schema** but code is stdlib dict/`set` predicates only | Acceptable as progressive disclosure *if stated as model of*, but demos never show `extra=forbid`, export JSON Schema, or validation errors—under-delivers vs title. |
| **I-14** | P2 | youDo `starterCode` | `evidence = {…: False}` checklist → flip to True for READY | Portfolio is a readiness checklist, not a mini threat-model + policy engine. Weak interview artifact for Master. |
| **I-15** | P2 | iDo `why` × 8 | Nearly identical: *“Hace observable \`X\` con un caso local pequeño y deja como evidencia Y; el demo modela el contrato, no un servicio externo.”* | Connective tissue between demos is copy-paste; no micro-narrative of a single Cusco request flowing through layers. |
| **I-16** | P3 | Theory T1-A `validate_case` | Rejects only literal key `"extra"`, not unknown fields generally | Oversimplifies “strict schema”; may imprint wrong mental model vs `extra=forbid` / `additionalProperties: false`. |
| **I-17** | P3 | selfCheck Q2 | *“Si ocurre la condición de error de S42…”* | Vague stem (which error?). Still answerable but weak active recall. |
| **I-18** | P3 | Map code prints `graph_rag_topic False` | Same as I-01 technical face | Even after prose cleanup, map demo should not advertise legacy taxonomy. |
| **I-19** | P2 | Cognitive load design | 20h estimate + 24 isomorphic labs | High volume / low variety → fatigue, shallow encoding of OWASP concepts (contrast CS253 / OWASP labs). |
| **I-20** | P2 | Connective tissue S41→S42 | Mentions S41 HTTP but never shows a versioned request failing strict schema + authz together | Missed opportunity for one end-to-end “request story” binding API surface to security gates. |

**Issue count (registry rows): 20**  
**Structural positives (not issues):** 9 theory blocks; 8 demos; 24 exercises with starter+solution+output; rubric; 5 MCQs; solid resource list; gate CP-N4-A consistent.

---

## 4. Meta-Leak Report

Exact or near-exact learner-visible curriculum/dev text (not student-facing instructional necessity):

| # | Exact / representative leaked text | Location |
|---|-------------------------------------|----------|
| M1 | `Id legacy \`graph-rag\` se conserva; el path V3 es seguridad/privacidad de servicios, no GraphRAG/LLM retrieval.` | `jobRelevance` |
| M2 | `Id legacy \`graph-rag\` no implica GraphRAG; V3 es seguridad del servicio gobernado.` | Theory map paragraph 4 |
| M3 | `"graph_rag_topic": False` / printed `graph_rag_topic False` | Map code `s42_map_contract.py` |
| M4 | `# CASO-LIM-042 · …` (×24 starters) while narrative is Cusco | Every weDo `starterCode` first comment line |
| M5 | `# DEFECT: …` / `Contrato: corrige el DEFECT; salida alineada a solutionCode` | Every weDo starter header block |
| M6 | Curriculum process voice in map: `Teoría con criterio medible, iDo que calcula el contrato, weDo E1/E2/E3 con un defecto de seguridad por ejercicio.` | Theory map P4 (harness description of section factory) |

**meta_leak_count (distinct classes): 6**  
**Instances:** M1–M3, M6 once each; M4–M5 ×24 exercise starters.

No classic “TODO/FIXME/moved from section X / AI note to developer” markers found beyond the above. Automated `S42_AUDIT.json` reported `source_boilerplate_count: 0` and empty issues — **false negative** relative to human template detection (I-03/I-04).

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 Pre-round research anchors (relevant best practice)

| Practice | Implication for S42 |
|----------|---------------------|
| Gradual release (I→We→You) | iDo must **show** the full security decision; weDo scaffolds one defect; youDo is an independent mini-system with evidence. |
| Progressive disclosure / worked examples | Teach mechanism (how strict schema / path confinement works) before abstract gates. |
| Cognitive load (avoid redundant germane load) | Do not paste identical contracts under every heading; vary only when the invariant changes. |
| OWASP / API security pedagogy | Prefer threat → control → test (valid, adversarial, missing) with **real input shapes**, not only metadata flags. |
| Active recall | Self-check should name *specific* failure modes (SSRF metadata IP, extra field, cross-tenant). |
| ES-PE redaction | Spanish prose primary; English for industry terms (RBAC, SSRF, scope) — not random English participles (`redacted`) mid-tagline. |

### 5.2 I Do / We Do / You Do fidelity

| Phase | Fidelity | Notes |
|-------|----------|-------|
| **I Do** | Partial | 8 demos exist and mostly *compute something*, but several are shallow; T2-A fails its own evidence claim; why text is templated. |
| **We Do** | Structural high / conceptual medium-low | Excellent **missing vs breach** discipline; poor **authenticity** (flag math). E3 ≠ real transfer. |
| **You Do** | Low-medium | Objectives/requirements list is strong on paper; starter is boolean readiness, not a portfolio engine. |
| **Self-check** | Medium | 5 MCQs align to gates; one vague stem; no SSRF/path-specific item; no schema-evolution item. |

### 5.3 Cognitive load & progressive disclosure

- **Positive:** Map glossary reduces jargon shock; order T1→T4 is sound (shape → authz → abuse → privacy lifecycle).
- **Negative:** Global success criterion repeated in every subtopic P2 creates **redundant load**. Mechanism P1 often one sentence (authn/authz, scopes, secrets) — too thin for Master 20h.
- **Disclosure breach risk:** Outcomes promise Pydantic while stack is stdlib-only model — fine if demos say “modelo de extra=forbid”, weak if learner expects `BaseModel`.

### 5.4 Grammar, tone, ES-PE redaction

- Overall Spanish is readable and professional, denser and more “platform SRE” than early sections (acceptable at Master).
- Issues: lowercase headings; `redacted`; telegraphic LOs; mixed LIM/CUS; harness words (`DEFECT`, `solutionCode`, `V3`, `legacy`).
- Code comments use British “minimisation” once — minor.

### 5.5 Exercise & exam alignment

| Subtopic | E1/E2/E3 status codes | Aligns theory? |
|----------|----------------------|----------------|
| T1-A | REJECT_SCHEMA / REVIEW_BUSINESS_INVARIANT | Partial (flags, not real schema objects) |
| T1-B | VERSION_SCHEMA / MIGRATE_CONSUMERS | Partial (good names, weak union teaching) |
| T2-A | DENY_CROSS_TENANT / VERIFY_RESOURCE_OWNER | Good names; admin path missing |
| T2-B | DENY_SCOPE / REQUEST_NARROW_GRANT | Good |
| T3-A | REJECT_UNTRUSTED_INPUT / SECURITY_REVIEW | Good adversary fixture values (169.254…, /etc/passwd) **but** starter defect ignores host allowlist in broken predicate |
| T3-B | ROTATE_AND_BLOCK / ASSESS_DEPENDENCY_RISK | OK as policy checklist |
| T4-A | MINIMIZE_AND_EXPIRE / PRIVACY_OWNER_REVIEW | OK |
| T4-B | PURGE_DERIVATIVES / VERIFY_DELETION_SCOPE | OK |

### 5.6 Consistency with roadmap & S41

- Continuity sentence “endurece el control plane de S41” is correct.
- Same factory patterns as S41 (`CASO-LIM-04x`, inverted contracts, Contrato operativo shells) → **systemic Master-phase template**, not unique S42 failure — still must be fixed for gold.
- Legacy id `graph-rag` is honest engineering debt; should stay in **filename/id** if URLs require stability, **not** in learner prose/code prints.

### 5.7 External comparison (high quality peers)

| Peer | S42 gap |
|------|---------|
| OWASP API Security Top 10 materials | Peers show request/response examples; S42 rarely shows HTTP-shaped payloads beyond flags. |
| Stanford CS253 | Worked web threats + defenses; S42 lists SSRF/path but demos seldom *fail closed on adversarial input*. |
| Pydantic docs | Show models, validators, JSON Schema export; S42 titles the topic without modeling it. |
| NIST Privacy Framework / 800-88 | Resources linked well; theory does not walk a retention/deletion lifecycle with multi-store derivatives. |
| S01 gold | Narrative motivation, progressive glosses, concrete runnable craft — S42 needs that voice for security. |

### 5.8 Graph-node view (condensed)

```
[S41 HTTP API] --hardens--> [S42 strict schema]
[S42 schema] --feeds--> [authn/authz + scopes]
[authz] --guards--> [case read CASO-CUS-042]
[input path/URL] --abuse--> [SSRF/path controls]
[secrets/deps] --ops--> [rotate/block]
[minimize/retain] --lifecycle--> [audit/delete/pseudo]
[all] --gate--> [CP-N4-A no cross-tenant + redaction holds]
```

**Broken edges:** (iDo T2-A)→(cross-tenant evidence); (theory P2)→(subtopic-specific mechanism); (starter CASO-LIM)→(narrative CASO-CUS); (title Pydantic)→(code reality).

---

## 6. Proposed GitHub-style Diffs

Paths relative to repo root. **Do not apply in Explorer run.** Grouped by issue.

### Diff group A — Meta-leak & identity (I-01, I-02, I-12, I-18, M1–M6)

```diff
--- a/src/lib/course/sections/s42-graph-rag.ts
+++ b/src/lib/course/sections/s42-graph-rag.ts
@@ jobRelevance
-    "En equipos de plataforma y producto, **schemas, seguridad y privacidad de servicios** convierten la API de S41 en un control plane fail-closed: validación estricta, authz deny-by-default y minimización de datos. La práctica entrega allow/deny auditable y vistas pseudonimizadas; se promueve solo cuando un actor no lee el caso de otro y un campo redactado no reaparece en logs, respuestas ni backups. Id legacy `graph-rag` se conserva; el path V3 es seguridad/privacidad de servicios, no GraphRAG/LLM retrieval.",
+    "En equipos de plataforma y producto, **schemas, seguridad y privacidad de servicios** convierten la API de S41 en un control plane fail-closed: validación estricta, authz deny-by-default y minimización de datos. La práctica entrega allow/deny auditable y vistas pseudonimizadas; se promueve solo cuando un actor no lee el caso de otro y un campo redactado no reaparece en logs, respuestas ni backups activos.",
@@ tagline
-  tagline: "threat model y pruebas de permisos; un usuario no puede acceder a otro caso ni recuperar datos redacted",
+  tagline: "threat model y pruebas de permisos; un usuario no puede acceder a otro caso ni recuperar datos redactados",
@@ theory map P4
-        "Orden: T1 schemas/evolución → T2 authn/authz y scopes → T3 injection/SSRF/secretos → T4 minimización, auditoría y borrado. Teoría con criterio medible, iDo que calcula el contrato, weDo E1/E2/E3 con un defecto de seguridad por ejercicio. Id legacy `graph-rag` no implica GraphRAG; V3 es seguridad del servicio gobernado. Stack didáctico: **stdlib** (dicts, sets) modelando contratos Pydantic/OWASP sin cluster.",
+        "Orden: T1 schemas/evolución → T2 authn/authz y scopes → T3 injection/SSRF/secretos → T4 minimización, auditoría y borrado. En el laboratorio usamos **stdlib** (dicts, sets) para modelar contratos al estilo Pydantic/JSON Schema y controles OWASP sin levantar un cluster: primero la forma, luego el permiso, después el abuso de entrada y al final el ciclo de privacidad.",
@@ map code
-        "graph_rag_topic": False,
-        "cross_tenant_read_ok": False,
+        "cross_tenant_read_ok": False,
+        "redaction_holds": True,
@@
-print("graph_rag_topic", c["graph_rag_topic"])
 print("cross_tenant_read_ok", c["cross_tenant_read_ok"])
+print("redaction_holds", c["redaction_holds"])
```

```diff
# Apply to all 24 weDo starter headers (pattern)
-# CASO-LIM-042 · <topic>
-# DEFECT: ...
-# Contrato: corrige el DEFECT; salida alineada a solutionCode
+# CASO-CUS-042 · <topic>
+# Defecto didáctico: el predicado actual acepta el caso inseguro.
+# Corrige solo la decisión de dominio; conserva datos y la salida esperada.
```

### Diff group B — Theory shells (I-03, I-04, I-08, I-16)

Replace each subtopic’s **P2** with a **local** contract (inputs/outputs unique to that threat), and **P3** with a Cusco mini-scenario + edge (not ethics paste). Example for T2-A and T3-A:

```diff
--- a/src/lib/course/sections/s42-graph-rag.ts
+++ b/src/lib/course/sections/s42-graph-rag.ts
@@ heading T1-B
-      heading: "evolución, discriminated unions y validación de negocio",
+      heading: "Evolución, discriminated unions y validación de negocio",
@@ heading T2-A
-      heading: "authn/authz y RBAC",
+      heading: "Authn/authz y RBAC",
@@ T2-A paragraphs (illustrative rewrite of P2/P3)
-        "Contrato de autorización. Entrada: actor_id, owner_id del caso y rol. Salida: allow solo si admin o actor==owner. Error: confiar en el user-agent o en un claim sin resource binding. Criterio: la prueba `can_read(u1,u2,analyst)` es False en el lab de Cusco sintético antes de abrir el control plane.",
-        "Aplicación a `CASO-CUS-042-T2A`: el analista u1 lee su caso; el caso de u2 se deniega. Authn ≠ authz: conocer la identidad no otorga permiso cruzado.",
+        "Contrato local de lectura de caso. Entrada: `actor`, `owner` del caso y `role` ∈ {analyst, admin}. Salida: `allow` solo si `role==admin` **o** `actor==owner` con permiso de lectura. Error: tratar un token de identidad (authn) como permiso sobre el recurso de otro tenant. Criterio medible: `can_read(\"u1\",\"u2\",\"analyst\") is False` antes de exponer el control plane.",
+        "En `CASO-CUS-042-2A` (mesa de soporte sintética en Cusco), el analista `user-a` abre su propio ticket y recibe 200 con vista mínima; el mismo actor sobre el ticket de `user-b` recibe DENY con audit `DENY_CROSS_TENANT`. La identidad correcta no basta: falta *resource binding*.",
@@ T1-A validate_case (stricter model of extra=forbid)
-def validate_case(payload: dict, required: set) -> bool:
-    return required.issubset(payload) and "extra" not in payload
+def validate_case(payload: dict, required: set, allowed: set) -> bool:
+    if not required.issubset(payload):
+        return False
+    return set(payload).issubset(allowed)
```

*(Repeat heading capitalization for T2-B…T4-B; rewrite each P2/P3 with topic-specific entrada/salida/error.)*

### Diff group C — Kill print theater & fix iDo T2-A (I-05, I-06, I-15)

```diff
--- a/src/lib/course/sections/s42-graph-rag.ts
+++ b/src/lib/course/sections/s42-graph-rag.ts
@@ T3-A theory code — demonstrate fail-closed
 def safe_path(base: str, user_path: str) -> str:
-    joined = f"{base.rstrip('/')}/{user_path.lstrip('/')}"
-    if ".." in user_path.split("/"):
-        raise ValueError("traversal")
-    return joined
-
-print(safe_path("/data", "a.txt"))
-print("blocked", "traversal")
-print("ssrf_guard", "allowlist")
+    if ".." in user_path.split("/"):
+        raise ValueError("traversal")
+    joined = f"{base.rstrip('/')}/{user_path.lstrip('/')}"
+    root = base.rstrip("/")
+    if not joined.startswith(root + "/") and joined != root:
+        raise ValueError("escape")
+    return joined
+
+print(safe_path("/data", "a.txt"))
+try:
+    safe_path("/data", "../etc/passwd")
+except ValueError as e:
+    print("blocked", e)
+print("ssrf_guard", url_allowed := ("docs.example.pe" in {"docs.example.pe"}))
@@ S42-T2-A-DEMO code
-def authn(user_id: str) -> str:
-    return user_id
-
-def roles_for(user_id: str) -> list:
-    return ["analyst"] if user_id else []
-
-print("authn", authn("u1"))
-print("roles", roles_for("u1"))
-print("authz_needed", True)
+def can_read(actor: str, owner: str, role: str) -> bool:
+    return role == "admin" or actor == owner
+
+print("same_tenant", can_read("u1", "u1", "analyst"))
+print("cross_tenant", can_read("u1", "u2", "analyst"))
+print("admin_override", can_read("u1", "u2", "admin"))
@@ why T2-A
-        why: "Hace observable `authn/authz y RBAC` con un caso local pequeño y deja como evidencia prueba actor A no lee caso B; el demo modela el contrato, no un servicio externo.",
+        why: "Separa identidad de permiso: el analista u1 lee su caso, se deniega el de u2, y solo admin cruza tenants de forma explícita — evidencia del gate no cross-tenant.",
```

### Diff group D — weDo authenticity (I-07, partial I-13)

At minimum for **T1-A E1–E3** and **T3-A E1–E3**, replace flag records with payload-shaped inputs:

```diff
# Conceptual replacement for T1-A-E1 (illustrative)
-record = {"case_id": "CASO-CUS-042-1A", **{"extra_policy":"forbid","json_schema":True,"valid_fixture":True,"business_rule":True}}
-meets_contract = record["extra_policy"] == "allow" and not record["business_rule"]
+payload = {"case_id": "CASO-CUS-042-1A", "status": "open"}
+allowed = {"case_id", "status"}
+required = {"case_id", "status"}
+# Defecto: acepta cualquier clave
+def accepts(p: dict) -> bool:
+    return required.issubset(p)  # incompleto: no rechaza extras ni regla de negocio
+# Solución: required ⊆ keys ⊆ allowed y status en {"open","closed"}
```

Keep E2/E3 three-way (valid / adversarial / missing) but ensure **adversarial fails on content** of real fields (extra key, host 169.254.169.254, path `/etc/passwd`), not only inverted flags. Preserve exact print contracts if graders depend on them, or update tests+outputs together.

### Diff group E — Learning outcomes, youDo, selfCheck (I-09, I-10, I-14, I-17)

```diff
--- a/src/lib/course/sections/s42-graph-rag.ts
+++ b/src/lib/course/sections/s42-graph-rag.ts
@@ learningOutcomes (illustrative)
-    { text: "Define schemas Pydantic/JSON Schema" },
-    { text: "Evoluciona schemas con validación de negocio" },
-    { text: "Implementa authn/authz RBAC" },
+    { text: "Definir un schema de borde estricto (tipos + rechazo de campos extra) y exportar fixtures válidos/inválidos" },
+    { text: "Evolucionar contratos con cambios aditivos y discriminated unions exhaustivas sin romper lectores previos" },
+    { text: "Implementar authn≠authz con RBAC y resource binding que deniega lectura cross-tenant" },
@@ youDo starter — require computed gates, not only flips
 def readiness(bundle: dict[str, bool]) -> tuple[str, list[str]]:
     missing = [name for name in REQUIRED if bundle.get(name) is not True]
     return ("READY", []) if not missing else ("BLOCKED", missing)
+# Además: incluir en el portafolio un `policy_engine.py` con tests:
+# allow(owner), deny(cross_tenant), reject(extra_field), reject(ssrf_host), purge(derivative)
@@ selfCheck Q2 stem
-        question: "Si ocurre la condición de error de S42, ¿qué respuesta preserva seguridad y auditabilidad?",
+        question: "Si un actor autenticado pide el caso de otro tenant sin scope, ¿qué respuesta preserva seguridad y auditabilidad?",
```

### Diff group F — End-to-end connective demo (I-20)

Add (or replace one map-adjacent demo) a single request story:

```python
def handle(req: dict, actor: str, owner: str, scopes: set) -> str:
    if set(req) - {"case_id", "status"}:
        return "REJECT_SCHEMA"
    if "cases:read" not in scopes or actor != owner:
        return "DENY_CROSS_TENANT"
    return "CONTINUE"
```

Wire narrative: “misma petición que salió de S41, ahora con schema + authz.”

---

## 7. Recommended Priority Order for Fixing

| Priority | Issues | Rationale |
|----------|--------|-----------|
| **1 (P0/P1 now)** | I-01, I-02, I-12, I-18, Meta M1–M6 | Remove curriculum leaks and LIM/CUS drift before any polish; restores trust of Master voice. |
| **2** | I-06, I-05 (T2-A demo + adversarial theory demos) | I Do must not lie; SSRF/path must fail observably. |
| **3** | I-03, I-04, I-08, I-15 | Replace template P2/P3/why; capitalize headings; restore four-layer pedagogy. |
| **4** | I-07, I-13, I-16 | Make ≥2 subtopics (T1-A, T3-A) payload-real; model `extra=forbid` properly. |
| **5** | I-10, I-09, I-11, I-17 | LOs, tagline, admin path consistency, MCQ stems. |
| **6** | I-14, I-19, I-20 | youDo portfolio engine; reduce exercise monotony; S41→S42 request story. |

**Suggested Fixer slice for one PR:** Priority 1 + 2 only (meta + demos that must compute).  
**Second PR:** theory redaction shells.  
**Third PR:** weDo authenticity + youDo.

---

## 8. Graph Memory Update notes

For shared context files (`GRAPH_MEMORY.json` / summary / residual ledger) — **notes only, not applied here:**

```yaml
section: 42
id: graph-rag
file: s42-graph-rag.ts
title: Schemas, seguridad y privacidad de servicios
explorer_score: 6.0
prior_auto_rank_claim: 9.55  # reject as gold oracle; template soup
verdict: NEEDS_FIXER
issue_count: 20
meta_leak_count: 6
structural:
  theory_blocks: 9
  iDo: 8
  weDo: 24
  selfCheck: 5
  gate: CP-N4-A
edges:
  - { from: S41, to: S42, rel: hardens_control_plane }
  - { from: S42, to: S43, rel: feeds_secure_service_platform }
  - { from: legacy_id_graph_rag, to: learner_prose, rel: LEAK_remove_from_copy }
  - { from: CASO_LIM_042_comments, to: CASO_CUS_042_fixtures, rel: IDENTITY_DRIFT }
  - { from: contrato_operativo_shell, to: T1B_T2B_T3A_T3B_T4A_T4B, rel: TEMPLATE_BOILERPLATE }
broken_edges:
  - iDo_T2A_why_claims_cross_tenant_but_code_does_not
  - theory_ssrf_path_no_adversarial_fail
  - title_pydantic_vs_stdlib_flag_math
fixer_priority: [meta_leaks, lim_cus, iDo_T2A, theory_shells, wedo_payloads, youdo]
gold_bar: false
notes: >
  Keep platform id hash `graph-rag` for URL stability if required;
  scrub all learner-visible "legacy/V3/GraphRAG" commentary.
  Preserve missing≠breach status taxonomy (high value).
```

**Residual risk if unfixed:** Master learners finish 24 labs able to invert booleans yet unable to explain OWASP-style controls on a real FastAPI payload; portfolio checklist does not prove CP-N4-A under interview scrutiny.

---

## Appendix A — Inventory checklist (Explorer verification)

| Element | Present? | Quality note |
|---------|----------|--------------|
| jobRelevance | Yes | Dense; meta-leak |
| learningOutcomes (8) | Yes | Telegraphic |
| Theory map + glossary | Yes | Strongest prose in section |
| T1-A…T4-B | Yes | P1 often thin; P2/P3 templated |
| Callouts per block | Yes | Action codes OK for gates |
| iDo 8 | Yes | Template why; T2-A gap |
| weDo 24 | Yes | Isomorphic inverted contracts |
| youDo + rubric | Yes | Checklist starter weak |
| selfCheck 5 | Yes | Fair; one vague stem |
| resources | Yes | Strong domain anchors |
| Synthetic data only | Yes | Good |
| Live catalog card | Yes | Matches shortTitle/tagline |

## Appendix B — Severity rollup

| Severity | Count |
|----------|-------|
| P1 | 7 (I-01…I-07) |
| P2 | 10 (I-08…I-15, I-19, I-20) |
| P3 | 3 (I-16…I-18) |
| **Total issues** | **20** |
| **Meta-leak classes** | **6** |

---

This is the complete Explorer report for Section 42. Ready for the Fixer prompt.
