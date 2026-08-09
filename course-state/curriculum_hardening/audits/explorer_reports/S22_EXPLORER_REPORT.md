# S22 Explorer Report — Email, identidad y aprobación humana

**Auditor role:** Curriculum Auditor · Pedagogical Analyst · Technical Editor  
**Method:** Stanford STORM multi-pass + Graph Engineering + Loop Engineering  
**Scope lock:** Section 22 only (`rapidfuzz-entity`)  
**Live:** https://pillb.github.io/pyarcana/ (curriculum card + section content from source)  
**Source:** `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s22-rapidfuzz-entity.ts`  
**Exam bank (seed):** `prisma/seed.ts` key `rapidfuzz-entity`  
**Date:** 2026-07-24  
**Do not apply fixes in this pass** — diffs are proposals only.

---

## 1. Section Identification & Scope

| Field | Value |
|--------|--------|
| Index | 22 |
| Platform id (hash) | `rapidfuzz-entity` |
| Title | Email, identidad y aprobación humana |
| Short title | Email y aprobación |
| Tagline (live) | crea borradores en sandbox o archivos .eml; ningún correo real se envía automáticamente y todo destinatario requiere confirmación |
| Source file | `src/lib/course/sections/s22-rapidfuzz-entity.ts` |
| Level / hours | Competente · 19 h (metadata) |
| Phase field | `phase: 1` |
| Capstone thread | Inicio **CP-N2-C** (handoff a S23 Playwright/web adapter) |
| Predecessors in narrative | S21 Reporting Factory / cierre CP-N2-B (paquete de informe → canal de notificación) |
| Successors | S23 Browser RPA; S24–S26 orquestación RPA+IA |

**Subtopics (8):**

| ID | Heading (source) | Focus |
|----|------------------|--------|
| S22-T1-A | MIME, encoding, HTML/text y attachments | `email.mime`, multiparte, UTF-8 |
| S22-T1-B | templates y sanitización | `html.escape`, allowlist de links |
| S22-T2-A | OAuth/service account y scopes | least privilege, expiración de token |
| S22-T2-B | drafts, expiración y adaptadores | adapter pattern, TTL de draft |
| S22-T3-A | resolución y verificación | directory sintético, dominio, match≠fraude |
| S22-T3-B | listas, CC/BCC, privacidad y mínima divulgación | dedupe, externos → BCC |
| S22-T4-A | approval queue y state machine | transiciones, actor, fail-closed |
| S22-T4-B | idempotencia, audit log y reintento sin duplicar | idempotency key, audit events |

**Package inventory (source):**

- Theory: 1 intro block + 8 subtopic blocks (code + callout each)
- I Do: 8 demos (`S22-T*-DEMO`)
- We Do: 24 exercises (guided / independent / transfer × 8)
- You Do: “Borrador .eml con aprobación (inicio CP-N2-C)” + scaffold + rubric
- Self-check: 5 MCQ
- Resources: docs (stdlib email, html, OWASP, OAuth) + books + courses
- Exam bank (seed): 24 variants (8 concepts × A/B/C) — V3 email topics; legacy RapidFuzz stems retired

**Out of scope this run:** S21/S23 content fixes, applying diffs, product TS edits.

---

## 2. Executive Summary of Quality

### Score: **7.2 / 10**

### Verdict

S22 is a **technically well-gated** intermediate section: draft-only / no auto-send, human approval, synthetic recipients, match≠fraude, least-privilege scopes, and idempotent retries form a coherent **safety story** aligned with human-in-the-loop (HITL) industry practice and with CP-N2-C. Structure I Do / We Do / You Do is complete (8× demos, 24 exercises, portfolio mini-pipeline). Exam/self-check content correctly targets email + approval, not legacy RapidFuzz.

It is **not yet gold-standard** relative to early sections (e.g. S01): narrative is telegraphic, connective tissue from S21 package→email is thin, We Do is a mechanical “DEFECT/fixture/solution” factory with Pass-string mismatches, state-machine vocabulary is inconsistent across theory/I Do/exercises, and several **meta-leaks** (V3, `rapidfuzz-entity`, gate V3, curriculum-id denial) surface internal roadmap language to learners. One security teaching anti-pattern remains: host allowlist via substring `'example.pe' in url` while edgeCases admit the bypass.

**Best strengths:** operational safety gates; privacy ethics; progressive topic map T1→T4; strong exam bank alignment with V3 title.  
**Main gaps:** meta-text, redaction polish (es-PE headings/prose), exercise authenticity, internal consistency, narrative depth vs S01.

---

## 3. Detailed Issue Registry

Severity legend: **P0** blocker / safety or ethical mis-teach · **P1** high learner harm or consistency · **P2** medium pedagogy/redaction · **P3** polish.

### ISSUE-01 — Meta-leak: V3 retarget disclaimer in user-facing theory
- **Severity:** P1  
- **Location:** `theory[0].paragraphs[1]`  
- **Evidence:**  
  > “En V3, **S22 no es RapidFuzz/ER probabilístico avanzado** (eso madura más adelante). El id `rapidfuzz-entity` se conserva; aquí **inicias CP-N2-C**: …”  
- **Impact:** Learners see platform versioning and legacy slug; breaks immersion; confuses “what am I learning?” with “what did the CMS used to be?” Same pattern as S21’s FastAPI disclaimer.  
- **Dimension:** Meta-text / connective tissue

### ISSUE-02 — Meta-leak: contract code prints `rapidfuzz_er_topic: False`
- **Severity:** P1  
- **Location:** intro theory code `s22_map_contract.py`  
- **Evidence:** keys `"rapidfuzz_er_topic": False`, prints `rapidfuzz_er_topic False`  
- **Impact:** Classroom/demo output is curriculum plumbing, not an operational gate a student would ship. Dilutes the good gates (`draft_only_no_auto_send`, `human_approval`, …).  
- **Dimension:** Meta-text / pedagogy

### ISSUE-03 — Meta-leak: rubric criterion “gate V3”
- **Severity:** P2  
- **Location:** `youDo.rubric[0]`  
- **Evidence:** `{ criterion: "Alineación al gate V3 de la sección", weight: "25%" }`  
- **Impact:** Rubric speaks to authors/auditors, not students. S01 uses student-facing criteria (“Correctness — clone + venv…”).  
- **Dimension:** Meta-text / exercise quality

### ISSUE-04 — Meta-leak: resources note embeds “V3 S22”
- **Severity:** P3  
- **Location:** `resources.courses` entry “PyArcana live”  
- **Evidence:** `note: "curso desplegado; V3 S22 email approval CP-N2-C"`  
- **Impact:** Minor internal tag in user-visible resources.  
- **Dimension:** Meta-text

### ISSUE-05 — Meta-leak pattern: exercise instructions expose factory jargon
- **Severity:** P2 (systematic ×24)  
- **Location:** all `weDo.steps[*].instruction`  
- **Evidence (template):**  
  > “Fixture `S22-T1-A-E1` / datos sintéticos: … Corrige el DEFECT del starter (CASO-LIM-022); imprime la salida exacta del contrato. Pass (salida exacta del solution): …”  
- **Impact:** High extraneous cognitive load (Sweller): IDs, DEFECT, solution-pass are author harness terms. Students optimize for matching the hidden solution string rather than understanding MIME/OAuth.  
- **Dimension:** Pedagogy / redaction / cognitive load

### ISSUE-06 — Theory leaks English UI camelCase “weDo”
- **Severity:** P2  
- **Location:** T1-A theory paragraphs  
- **Evidence:** “…valida el árbol multiparte en weDo.”  
- **Impact:** Breaks es-PE professional tone; exposes product section keys.  
- **Dimension:** Meta-text / grammar

### ISSUE-07 — Pass criterion strings disagree with `solutionCode.output` (systematic)
- **Severity:** P1  
- **Locations (examples):**  
  - `S22-T1-A-E1`: Pass claims `` `text/plain | utf-8` ``; solution prints two lines `text/plain` then `utf-8`.  
  - `S22-T1-B-E3`: Pass uses `|` between two URLs; solution prints two lines.  
  - `S22-T2-A-E3`: Pass `` `refresh | valid` `` vs two-line output.  
  - `S22-T3-A-E1`: Pass `` `ana@example.pe True | bad False` `` vs two lines.  
- **Impact:** Students who match the Pass string literally fail; autocheck/manual compare friction; undermines “contrato exacto” pedagogy.  
- **Dimension:** Exercise quality / consistency

### ISSUE-08 — State machine vocabulary inconsistency
- **Severity:** P1  
- **Locations:** T4-A theory prose vs code vs I Do vs We Do  
- **Evidence:**  
  - Prose: `pending_review` … `needs_info`  
  - Theory code: `pending_review`, `needs_edit` (not `needs_info`)  
  - I Do T4-A: `pending` / `approved`  
  - Exercises T4-A: `pending` only  
  - You Do: requires `pending_review`  
- **Impact:** Students cannot form a stable mental model; You Do asks for a state name not practiced in We Do/I Do.  
- **Dimension:** Consistency / pedagogy / cognitive load

### ISSUE-09 — Idempotency key length inconsistency
- **Severity:** P2  
- **Locations:** theory T4-B / You Do use `hexdigest()[:16]`; exercise `S22-T4-B-E1` uses `[:8]` and hardcodes expected `0da400d6`  
- **Impact:** Contract fragmentation; learner unsure which is “production style.”  
- **Dimension:** Consistency

### ISSUE-10 — Similarity score numbers inconsistent (0.92 theory vs 0.86 exercise)
- **Severity:** P3  
- **Locations:** theory T3-A “score sintético 0.92”; exercise E3 output `0.86`; self-check Q5 uses 0.92  
- **Impact:** Minor; confuses if students try to reconcile demos.  
- **Dimension:** Consistency

### ISSUE-11 — Insecure allowlist teaching as **solution** (substring host)
- **Severity:** P1 (security pedagogy)  
- **Locations:** theory `sanitize_html` host extract is better; **I Do T1-B** and **We Do S22-T1-B-E3** use `'example.pe' in url`  
- **Evidence (solution):**  
  `print(u, 'ok' if 'example.pe' in u else 'blocked')`  
  Edge case already warns: “subdominios maliciosos example.pe.evil.test — parsear host real en prod”  
- **Impact:** Course **passes** the vulnerable pattern while only footnote-warning production. Teaches a known bypass; conflicts with OWASP-linked resources.  
- **Dimension:** Domain safety / external best practice

### ISSUE-12 — We Do exercises too shallow for “transfer” label
- **Severity:** P2  
- **Examples:**  
  - T2-B-E1: print `store['d001']['status']` instead of key  
  - T4-A-E3: append a hard-coded dict with `actor`  
  - T4-B-E1: change slice `[:6]` → `[:8]`  
- **Impact:** Gradual release fails: “transfer” is not transfer of the subtopic skill to a new situation; it’s micro-patch. Violates Fisher/Frey GRR intent (You Do alone should carry more of the cognitive work than copy-fix).  
- **Dimension:** Pedagogy / cognitive load

### ISSUE-13 — Thin connective tissue S21 → S22 → S23
- **Severity:** P2  
- **Evidence:** Intro maps T1–T4 and CP-N2-C; does **not** explicitly hand off “paquete aprobado de S21 (DOCX/PDF/dashboard)” → “borrador de notificación en S22” → “canal web S23”. T4-B only: “Cierra el inicio de CP-N2-C hacia browser RPA (S23)…”.  
- **Impact:** Capstone thread feels modular, not narrative; weaker than S01’s explicit “S02–S04 montarán…”.  
- **Dimension:** Connective tissue / roadmap

### ISSUE-14 — Narrative depth and es-PE redaction below S01 gold standard
- **Severity:** P2  
- **Evidence:** Headings mixed EN/ES lowercase (`templates y sanitización`, `drafts, expiración y adaptadores`); paragraphs are “Contrato: / Caso:” telegrams; `jobRelevance` is dense but good; theory lacks Peru-situated operational story (quién aprueba en operaciones, SLA, mesa de control) beyond synthetic emails.  
- **Impact:** Motivation and accessibility for intermediate learners; professional Spanish polish incomplete.  
- **Dimension:** Redaction / motivation

### ISSUE-15 — Icon and platform id residual of RapidFuzz era
- **Severity:** P2  
- **Evidence:** `id: "rapidfuzz-entity"`, `icon: "GitCompare"` for an email/HITL section  
- **Impact:** Live UI and repo mental model mismatch title “Email y aprobación”; reinforces ISSUE-01 if students open GitHub. (Id may be hard to rename without platform migration — flag as product debt, not pure copy edit.)  
- **Dimension:** Consistency / UX meta

### ISSUE-16 — You Do scaffold incomplete vs rubric / objectives
- **Severity:** P2  
- **Evidence:** Starter only prints `verified` + key prefix; comments say DEFECT(contrato) for full MIME + draft store + SM; rubric 25% “gate V3”; no acceptance print contract for final states.  
- **Impact:** Portfolio quality variance; weaker than S01 You Do (explicit structure, concrete acceptance).  
- **Dimension:** Exercise / portfolio quality

### ISSUE-17 — I Do largely clones theory with minimal think-aloud
- **Severity:** P3  
- **Evidence:** Demos re-show MIME/sanitize/scopes already in theory; `why` lines are one short sentence.  
- **Impact:** Focused instruction (I Do) underuses modeling of *decision* (“why draft not send”, “why reject this transition”).  
- **Dimension:** Pedagogy (GRR focused instruction)

### ISSUE-18 — Resources partially off-topic
- **Severity:** P3  
- **Evidence:** Coursera Python for Everybody, MIT 6.100L, CS50P, deeplearning.ai Data Engineering as primary companions for MIME/OAuth/HITL.  
- **Impact:** Dilutes signal; better pair Gmail API draft docs, RFC 5322/2045 overview, HITL design guides, OWASP already linked.  
- **Dimension:** External comparison / support materials

### ISSUE-19 — estimatedHours inconsistency across course-state vs section
- **Severity:** P3  
- **Evidence:** section `estimatedHours: 19`; `course-state/s22_phase4_progress.json` meta once listed 12 h. Live curriculum shows 19 h.  
- **Impact:** Planning trust if students read multiple artifacts.  
- **Dimension:** Consistency (mostly course-state; product TS is 19)

### ISSUE-20 — Callout “CC filtra privacidad” is correct colloquial but abrupt
- **Severity:** P3  
- **Evidence:** title “CC filtra privacidad”; body uses “filtra” = leaks (es-PE ok).  
- **Impact:** Very short; could confuse non-LATAM readers of Spanish who only know “filtrar” as filter. Prefer “expone / filtra (filtra = filtra información)”. Low priority.  
- **Dimension:** Redaction

### Positive findings (graph quality edges to preserve)

| Edge | Note |
|------|------|
| Gate draft-only | Repeated in tagline, contract, callouts, self-check, exam — strong |
| match≠fraude | Theory, demos, E3, self-check, seed bank — ethical consistency excellent |
| Synthetic `@example.pe` | Consistent lab identity |
| Least privilege scopes | Theory + I Do + exam aligned |
| Idempotent retry | Theory + I Do + We Do + self-check aligned in *idea* (length varies) |
| Exam bank V3 | Legacy RapidFuzz stems retired; 8 concept families match subtopics |
| Safety of lab | No real SMTP path taught as happy path |

---

## 4. Meta-Leak Report

| # | Exact / paraphrased leaked text | Location | User-visible? | Severity |
|---|--------------------------------|----------|---------------|----------|
| M1 | “En V3, **S22 no es RapidFuzz/ER probabilístico avanzado**… El id `rapidfuzz-entity` se conserva…” | theory intro para | Yes | P1 |
| M2 | `"rapidfuzz_er_topic": False` + print | theory intro code/output | Yes | P1 |
| M3 | “Alineación al gate V3 de la sección” | youDo.rubric | Yes | P2 |
| M4 | “V3 S22 email approval CP-N2-C” | resources note | Yes | P3 |
| M5 | “…en weDo.” | T1-A theory | Yes | P2 |
| M6 | “Fixture `S22-…` … DEFECT … Pass (salida exacta del solution)” ×24 | weDo instructions | Yes | P2 systematic |
| M7 | Starter comments `# DEFECT: …` / `# Contrato: corrige el DEFECT` | starterCode | Yes (code) | P3 (ok for scaffold if softened) |
| M8 | Platform id `rapidfuzz-entity` + icon `GitCompare` | metadata / live hash | Yes (id in URL/hash) | P2 product debt |

**meta_leak_count (distinct surface classes):** **8**  
**No** raw AI-to-developer chats, “TODO fix later”, or “moved from section X” editor notes found beyond the V3 retarget pattern.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 Pre-round research (applied)

- **Gradual Release of Responsibility (Pearson/Gallagher; Fisher & Frey):** I Do (focused modeling) → We Do (guided) → You Do (independent). Transfer exercises must increase novelty, not only reduce hints.  
- **Cognitive load (Sweller):** Minimize extraneous load (fixture IDs, V3, DEFECT jargon); keep germane load on MIME trees, SM transitions, privacy.  
- **HITL / approval workflows (industry 2025–26 patterns):** fail-closed on timeout, audit trail with actor, evidence pack for approver, idempotency, draft before send, risk-based escalation. S22 covers most of these conceptually; missing: timeout/escalation SLA and “approve with edits” beyond `needs_edit`.  
- **Email security teaching:** multipart/alternative, UTF-8, escape HTML, least-privilege OAuth scopes for drafts; **parse real host**, never substring allowlist.

### 5.2 I Do / We Do / You Do fidelity

| Phase | Present? | Quality |
|-------|----------|---------|
| I Do | Yes, 8 demos | Structurally complete; thin think-aloud; often duplicate theory |
| We Do | Yes, 24 | Scaffolded with starter/hints/solution; over-templated; “transfer” under-leveled |
| You Do | Yes | Right project shape (MIME→verify→draft→pending_review); scaffold thin; rubric meta |
| Autocheck | selfCheck 5 + seed 24 | Strong conceptual coverage; ethics reinforced |

**Fidelity score:** structural **9/10**, instructional quality **6.5/10**.

### 5.3 Progressive disclosure

Order T1 Message → T2 Provider → T3 Recipient → T4 Workflow is excellent progressive disclosure. Dictionary block front-loads many terms at once (MIME, draft sandbox, scopes, resolution, approval queue, SM, idempotency, fail-closed, matching disclaimer) — appropriate for competente if later subtopics unpack each, which they do. Risk: first screen overload vs S01’s warmer onboarding.

### 5.4 Cognitive load hotspots

1. Simultaneous intro of OAuth *and* MIME *and* SM in dictionary.  
2. Extraneous: DEFECT/Fixture/Pass | meta.  
3. Intrinsic (acceptable): MIME nesting counts, SM invalid transitions.  
4. Germane lost when students chase exact print strings.

### 5.5 Grammar & redaction (es-PE)

- Professional technical Spanish mostly OK.  
- Mixed headings EN/ES and uncapitalized starts (`templates y sanitización`).  
- “weDo”, “V3”, “gate V3” not es-PE curriculum voice.  
- “filtra” for leak is idiomatic LATAM but can be clarified.  
- No major orthography failures found in sampled paragraphs.  
- Tone more “spec sheet” than “mentor peruano” (S01 gold).

### 5.6 Exercise & exam alignment

| Concept | Theory | I Do | We Do | Self-check | Seed exam |
|---------|--------|------|-------|------------|-----------|
| MIME multiparte | ✓ | ✓ | ✓ | ✓ | ✓ |
| Sanitización HTML | ✓ | ✓ | ✓ | — | ✓ |
| OAuth scopes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Drafts / adapters / TTL | ✓ | ✓ | ✓ | ✓ | ✓ |
| Resolve/verify + ethics | ✓ | ✓ | ✓ | ✓ | ✓ |
| CC/BCC privacy | ✓ | ✓ | ✓ | — | ✓ |
| Approval SM | ✓ | ✓ | ✓ | ✓ | ✓ (bank) |
| Idempotency + audit | ✓ | ✓ | ✓ | ✓ | ✓ |

Alignment is **high**. Weakest link is **task authenticity** of We Do, not topic coverage.

### 5.7 Comparison: gold early section (S01)

| Dimension | S01 | S22 |
|-----------|-----|-----|
| Narrative motivation | Strong Peru workplace story | Thin operational story |
| Meta-leaks | Low | V3 / rapidfuzz / weDo |
| You Do rubric | Concrete student criteria | “gate V3” |
| Exercise language | More natural tasks | DEFECT factory |
| Safety ethics | Secrets out of repo | Excellent (email-specific) |
| Dictionary | Careful progressive defs | Dense but useful |

### 5.8 External materials comparison

| External | S22 relative quality |
|----------|----------------------|
| Python docs `email.examples` | S22 is practical mini-lab; good |
| OWASP XSS prevention | Linked; **undercut** by substring allowlist solutions |
| OAuth least privilege (Google policies / RFC 6749) | Concepts solid; no real token flow (OK for sandbox) |
| HITL agent approval guides (audit, timeout, evidence pack) | Core SM+audit present; timeout/escalation light |
| CS50P / generic Python intros in resources | Lower relevance than stdlib email + security sheets |

### 5.9 Accessibility & motivation

- Synthetic data and no real send: good psychological safety.  
- Short callouts help scanning.  
- Motivation “why email automation matters in operaciones peruanas” underdeveloped (compliance, tickets, clientes sintéticos Lima).  
- Icon mismatch may reduce identity of the section in the curriculum grid.

---

## 6. Proposed GitHub-style Diffs

> **Do not apply in Explorer run.** Paths relative to repo root. Diffs are surgical proposals for the Fixer.

### Diff A — Remove V3/RapidFuzz meta from intro theory (ISSUE-01, ISSUE-02)

```diff
--- a/src/lib/course/sections/s22-rapidfuzz-entity.ts
+++ b/src/lib/course/sections/s22-rapidfuzz-entity.ts
@@
-        "En V3, **S22 no es RapidFuzz/ER probabilístico avanzado** (eso madura más adelante). El id `rapidfuzz-entity` se conserva; aquí **inicias CP-N2-C**: MIME, sanitización HTML, scopes mínimos, drafts con expiración, resolución de destinatarios sintéticos, privacidad de listas, cola de aprobación humana e idempotencia.",
+        "Aquí **inicias CP-N2-C**: el canal de **notificación con aprobación humana** que toma el paquete de reporte (S21) y prepara un **borrador** seguro. Enfocamos MIME, sanitización HTML, scopes mínimos, drafts con expiración, resolución de destinatarios sintéticos, privacidad de listas, cola de aprobación e idempotencia. El entity resolution probabilístico profundo llega más adelante en el roadmap; aquí el matching de contactos solo sirve para **entrega correcta**.",
@@
-        "gates": ["draft_only_no_auto_send", "human_approval", "idempotent_retry", "synthetic_recipients"],
-        "rapidfuzz_er_topic": False,
-        "auto_send_ok": False,
+        "gates": ["draft_only_no_auto_send", "human_approval", "idempotent_retry", "synthetic_recipients"],
+        "auto_send_ok": False,
@@
-print("case", c["case"])
-print("rapidfuzz_er_topic", c["rapidfuzz_er_topic"])
-print("auto_send_ok", c["auto_send_ok"])
+print("case", c["case"])
+print("gates", len(c["gates"]))
+print("auto_send_ok", c["auto_send_ok"])
@@
-        output: `case CASO-LIM-022
-rapidfuzz_er_topic False
-auto_send_ok False`,
+        output: `case CASO-LIM-022
+gates 4
+auto_send_ok False`,
```

### Diff B — Fix “weDo” leak in theory (ISSUE-06)

```diff
--- a/src/lib/course/sections/s22-rapidfuzz-entity.ts
+++ b/src/lib/course/sections/s22-rapidfuzz-entity.ts
@@
-        "Caso: `MIMEText('Hola','plain','utf-8')` → content-type text/plain; mixed + `MIMEApplication` con `a.txt`. Contar headers `Content-Type` valida el árbol multiparte en weDo.",
+        "Caso: `MIMEText('Hola','plain','utf-8')` → content-type text/plain; mixed + `MIMEApplication` con `a.txt`. Contar headers `Content-Type` valida el árbol multiparte en los ejercicios guiados.",
```

### Diff C — Unify state machine names (ISSUE-08)

```diff
--- a/src/lib/course/sections/s22-rapidfuzz-entity.ts
+++ b/src/lib/course/sections/s22-rapidfuzz-entity.ts
@@ theory T4-A prose
-        "La **cola de aprobación** es una state machine: `draft` → `pending_review` → `approved` | `rejected` | `needs_info`. Transiciones explícitas con actor y timestamp; sin transición válida, no hay envío ni promoción de draft.",
+        "La **cola de aprobación** es una state machine: `draft` → `pending_review` → `approved` | `rejected` | `needs_edit`. Transiciones explícitas con actor y timestamp; sin transición válida, no hay envío ni promoción de draft.",
@@ iDo T4-A
-    sm = {"draft": {"submit": "pending"}, "pending": {"approve": "approved", "reject": "rejected"}}
+    sm = {"draft": {"submit": "pending_review"}, "pending_review": {"approve": "approved", "reject": "rejected", "request_edit": "needs_edit"}}
@@
-        trail.append(state)
-    print("final", state, "trail", trail)
+        trail.append(state)
+    print("final", state, "trail", trail)
# update output to: final approved trail ['pending_review', 'approved']
@@ We Do S22-T4-A-E1/E2/E3
- use pending → pending_review consistently in T maps and expected prints
```

### Diff D — Align Pass strings with solution outputs (ISSUE-07 sample E1)

```diff
--- a/src/lib/course/sections/s22-rapidfuzz-entity.ts
+++ b/src/lib/course/sections/s22-rapidfuzz-entity.ts
@@ S22-T1-A-E1 instruction
-          "E1 (guiado) — Concepto: MIMEText plain utf-8. Fixture `S22-T1-A-E1` / datos sintéticos: msg = MIMEText('Hola', 'plain', 'utf-8'); print(msg.get_content_type()). Corrige el DEFECT del starter (CASO-LIM-022); imprime la salida exacta del contrato. Pass (salida exacta del solution): `text/plain | utf-8`.",
+          "E1 (guiado) — Construye un `MIMEText` en texto plano con UTF-8. Corrige el starter de CASO-LIM-022 y verifica el tipo y charset. Salida esperada (dos líneas):\ntext/plain\nutf-8",
```

*(Apply same pattern to all Pass lines that used `|` as multi-line join: T1-B-E3, T2-A-E3, T3-A-E1, etc.)*

### Diff E — Humanize exercise instruction template (ISSUE-05 sample)

```diff
--- a/src/lib/course/sections/s22-rapidfuzz-entity.ts
+++ b/src/lib/course/sections/s22-rapidfuzz-entity.ts
@@ generic pattern for each exercise instruction
-          "E2 (independiente) — Concepto: … Fixture `…` / datos sintéticos: …. Corrige el DEFECT del starter (CASO-LIM-022); imprime la salida exacta del contrato. Pass (salida exacta del solution): `…`.",
+          "E2 (independiente) — … (objetivo de aprendizaje en una frase). Usa los datos de CASO-LIM-022 en el starter. Cuando pases, la consola debe mostrar exactamente la salida del bloque solución.",
```

### Diff F — Fix host allowlist in I Do + We Do solutions (ISSUE-11)

```diff
--- a/src/lib/course/sections/s22-rapidfuzz-entity.ts
+++ b/src/lib/course/sections/s22-rapidfuzz-entity.ts
@@ iDo T1-B sanitize
-        return re.sub(r"https?://[^\\s<]+", lambda m: m.group(0) if "example.pe" in m.group(0) else "[blocked]", s)
+        def host_ok(url: str) -> bool:
+            host = re.sub(r"^https?://", "", url).split("/")[0].split(":")[0]
+            return host == "example.pe" or host.endswith(".example.pe")
+        return re.sub(r"https?://[^\\s<]+", lambda m: m.group(0) if host_ok(m.group(0)) else "[blocked]", s)
@@ S22-T1-B-E3 solution
-for u in urls:
-    print(u, 'ok' if 'example.pe' in u else 'blocked')
+from urllib.parse import urlparse
+for u in urls:
+    host = urlparse(u).hostname or ""
+    print(u, 'ok' if host == 'example.pe' else 'blocked')
```

### Diff G — Unify idempotency key length to 16 (ISSUE-09)

```diff
--- a/src/lib/course/sections/s22-rapidfuzz-entity.ts
+++ b/src/lib/course/sections/s22-rapidfuzz-entity.ts
@@ S22-T4-B-E1
-          "… Pass … `0da400d6`.",
+          "… usa sha256 hex y toma 16 caracteres (mismo contrato que el pipeline You Do).",
-print(hashlib.sha256(b'run|to|v1').hexdigest()[:6])
+print(hashlib.sha256(b'run|to|v1').hexdigest()[:8])  # defect length; solution uses [:16]
# solution:
-print(hashlib.sha256(b'run|to|v1').hexdigest()[:8])
-          output: `0da400d6`,
+print(hashlib.sha256(b'run|to|v1').hexdigest()[:16])
+          output: `<recompute hex[:16] of run|to|v1>`,
```

### Diff H — You Do rubric + connective tissue (ISSUE-03, ISSUE-13, ISSUE-16)

```diff
--- a/src/lib/course/sections/s22-rapidfuzz-entity.ts
+++ b/src/lib/course/sections/s22-rapidfuzz-entity.ts
@@ youDo.context
-      "Construye un mini pipeline sintético: mensaje MIME → destinatario verificado → draft con idempotency key → cola pending_review. No envíes correo real. Matching de contactos no implica fraude.",
+      "Parte del paquete de informe de S21 (métricas ya reconciliadas). Construye el mini pipeline de notificación: mensaje MIME → destinatario verificado → draft con idempotency key → estado pending_review con audit. No envíes correo real. Matching de contactos no implica fraude. En S23 conectarás un adaptador web; aquí el canal es .eml/sandbox.",
@@ rubric
-      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
-      { criterion: "Correctitud técnica en entorno declarado", weight: "20%" },
+      { criterion: "Gates de seguridad: draft-only, aprobación humana, destinatario verificado, sin SMTP real", weight: "25%" },
+      { criterion: "MIME multiparte (plain+HTML+adjunto meta) y draft con expires_at + idempotency key", weight: "20%" },
```

### Diff I — Heading capitalization / es-PE polish (ISSUE-14 sample)

```diff
--- a/src/lib/course/sections/s22-rapidfuzz-entity.ts
+++ b/src/lib/course/sections/s22-rapidfuzz-entity.ts
-      heading: "templates y sanitización",
+      heading: "Templates y sanitización de HTML",
-      heading: "drafts, expiración y adaptadores",
+      heading: "Drafts, expiración y adaptadores",
-      heading: "resolución y verificación",
+      heading: "Resolución y verificación de destinatarios",
-      heading: "approval queue y state machine",
+      heading: "Cola de aprobación y máquina de estados",
```

### Diff J — Resources note + optional icon note (ISSUE-04, ISSUE-15)

```diff
--- a/src/lib/course/sections/s22-rapidfuzz-entity.ts
+++ b/src/lib/course/sections/s22-rapidfuzz-entity.ts
-        note: "curso desplegado; V3 S22 email approval CP-N2-C",
+        note: "curso desplegado; sección de email y aprobación humana (CP-N2-C)",
-  icon: "GitCompare",
+  icon: "Mail",  // or "Send" / product-allowed icon for email; confirm against icon map
```

### Diff K — Deepen one transfer exercise example (ISSUE-12, optional but recommended)

Replace T4-A-E3 hard-coded append with a mini apply+log that rejects `approve` from `draft` and accepts `submit` then `approve`, printing final state + last actor — keeps output contract stable but practices the real SM.

---

## 7. Recommended Priority Order for Fixing

| Order | Issue(s) | Rationale |
|-------|----------|-----------|
| 1 | ISSUE-01, ISSUE-02, M1–M2 | Meta-leaks distort learning goals immediately on first screen |
| 2 | ISSUE-08 | State name mismatch breaks You Do vs practice loop |
| 3 | ISSUE-07 | Pass vs output mismatches cause false failures |
| 4 | ISSUE-11 | Do not teach insecure host allowlist as solution |
| 5 | ISSUE-05 + Diff E | Reduce extraneous load across 24 exercises |
| 6 | ISSUE-03, ISSUE-16, ISSUE-13 | Rubric + You Do + S21/S23 narrative |
| 7 | ISSUE-09, ISSUE-10 | Small contract consistency |
| 8 | ISSUE-14, ISSUE-17, ISSUE-18, ISSUE-15, ISSUE-04 | Polish: prose, I Do depth, resources, icon, notes |
| 9 | ISSUE-12 | Raise transfer authenticity (larger rewrite) |
| 10 | ISSUE-19, ISSUE-20 | Housekeeping |

**Suggested Fixer batches:**  
- **Batch A (P0/P1 copy):** Diffs A, B, C, D, F, H  
- **Batch B (exercise language):** Diff E + full Pass audit  
- **Batch C (polish):** Diffs I, J, K + resources trim  

---

## 8. Graph Memory Update Notes

For shared curriculum graph / ledger (do not write product files here):

```yaml
section: S22
id: rapidfuzz-entity
title: Email, identidad y aprobación humana
explorer_score: 7.2
explorer_status: complete
capstone_edge:
  - S21.ReportingFactory.package_approved -> S22.EmailDraft.pending_review (weak in prose; strengthen)
  - S22.EmailDraft -> S23.WebAdapter (mentioned; OK)
safety_invariants:
  - draft_only_no_auto_send: STRONG
  - human_approval: STRONG
  - match_neq_fraude: STRONG
  - synthetic_recipients: STRONG
  - least_privilege_scopes: STRONG
  - idempotent_retry: STRONG (key length drift)
quality_nodes:
  - meta_leak_v3_rapidfuzz: OPEN
  - sm_vocab_pending_vs_pending_review: OPEN
  - pass_string_pipe_join: OPEN
  - allowlist_substring: OPEN
  - we_do_defect_factory: OPEN
  - youdo_rubric_gate_v3: OPEN
preserve:
  - ethics_matching_disclaimer
  - exam_bank_v3_email_topics
  - four_topic_map_T1_to_T4
  - no_real_smtp_happy_path
comparison_anchors:
  gold: S01 narrative + concrete rubric
  peer_meta_pattern: S21 "En V3, S21 no es FastAPI..."
product_debt:
  - id rapidfuzz-entity rename requires platform migration
  - icon GitCompare residual
```

**Comparative note for later sections:** Any section still opening with “En V3, Sxx no es {legacy}…” should be treated as the same meta-leak class.

---

## Scores by required dimension (for Fixer triage)

| # | Dimension | Score /10 | Notes |
|---|-----------|-----------|-------|
| 1 | Meta-text / developer leakage | 5.5 | V3, rapidfuzz, weDo, gate V3, DEFECT factory |
| 2 | Grammar & redaction (es-PE) | 7.0 | Usable; headings/tone uneven |
| 3 | Connective tissue & narrative | 6.5 | Map T1–T4 good; S21 handoff thin |
| 4 | Pedagogical structure I/We/You | 7.5 | Complete skeleton; transfer weak |
| 5 | Cognitive load & progressive disclosure | 7.0 | Good topic order; extraneous jargon |
| 6 | Exercise & exam quality | 7.0 | Exam strong; We Do shallow; Pass mismatch |
| 7 | Roadmap consistency | 7.0 | CP-N2-C OK; SM/key/score drift |
| 8 | External best-practice parity | 7.5 | HITL+OAuth good; host parse weak |
| 9 | Other (a11y, motivation, safety) | 8.0 | Safety excellent; motivation medium |

**Composite: 7.2 / 10**

---

This is the complete Explorer report for Section 22. Ready for the Fixer prompt.
