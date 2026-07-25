# S48 Fixer Report (Round 2) — Aplicaciones LLM y RAG con evidencia

**Role:** Curriculum Fixer · Technical Editor · Pedagogical Rewriter  
**Date:** 2026-07-25  
**Task ID:** FIXER-R2-S48  
**Section:** 48 · platform id `ai-governance` (silent; not learner-facing)  
**Source (only product file edited):** `src/lib/course/sections/s48-ai-governance.ts`  
**Anti-aberration:** **OK** — educational prose rewritten by hand unit-by-unit; automation limited to code execution, residual greps, Spanish-quality measurement (`--no-lt`), and mechanical strip of tautological `meets_contract = ('id'=='id')` lines (no new exercise content generated).

---

## 1. Section identification and sources reviewed

| Field | Value |
|-------|--------|
| **Section number / title** | 48 — Aplicaciones LLM y RAG con evidencia |
| **Canonical file** | `src/lib/course/sections/s48-ai-governance.ts` |
| **Live route** | https://pillb.github.io/pyarcana/#ai-governance |
| **Internal ID** | `ai-governance` (retained for deep links; never explained to learners) |
| **Primary Explorer** | `course-state/curriculum_hardening/audits/explorer_reports/S48_EXPLORER_REPORT.md` |
| **Expert report** | `expert_audit/S48_report.md` |
| **Expert-2 evidence** | `expert_audit/expert_2_audit/section-48-explorer-report.md` |
| **Spanish-quality JSON** | Pre R2 ~**9.38**/10; post R2 **10.0**/10 (`--no-lt`, FH 76.8) |
| **Grammar plan** | `expert_audit/_GRAMMAR_SUBPLAN.md` |
| **Round-1 fixer (prior claim)** | `course-state/curriculum_hardening/audits/fixer_reports/S48_FIXER_REPORT.md` |
| **Worklog** | `expert_audit/worklog.md` |
| **Assessments** | In-file `selfCheck` (7 MCQ) + `youDo` portfolio; seed key `ai-governance` not rewritten |

**Scope note:** Round 1 (and prior hardening) already closed most Explorer P0/P1 items in source: jobRelevance free of legacy/V3, CASO-PUN (not CASO-LIM), semantic section chunking, mechanism I Do demos, hybrid+Recall@k, SMART outcomes, expanded self-check (injection/ACL/hybrid). Round-1 **report overclaimed** several items still active at R2 start (Spanish title, callout rewrites, tautology strip, empty-evidence grounding fix). R2 closed those residuals plus Expert / Expert-2 critical technical findings.

---

## 2. Summary of changes applied

### Resolution table

| Issue | Source | Status before R2 | Change applied | Validation |
|-------|--------|------------------|----------------|------------|
| ISSUE-01 / M1 jobRelevance legacy | Explorer | **Already fixed** | Re-validated; no Id legacy / V3 | Grep clean |
| ISSUE-02 / M2 map V3 / auto-fraude | Explorer | **Already fixed** | Re-validated | Grep clean |
| ISSUE-03 local contracts | Explorer | **Already fixed** | Local T1–T4 contracts retained | Manual |
| ISSUE-04 CASO situative beats | Explorer | **Already fixed** | Distinct beats retained | Manual |
| ISSUE-05 I Do mechanisms | Explorer | **Already fixed** | Strengthened T4-A empty-evidence demo | 41/41 exec |
| ISSUE-06 We Do monoculture | Explorer | **Partial** | Feedback diversified per E1–E3; tautologies stripped; E3 salida = token triples | Manual + exec |
| ISSUE-07 CASO-LIM | Explorer | **Already fixed** | Zero CASO-LIM | Grep |
| ISSUE-08 semantic chunking | Explorer | **Already fixed** | Confirmed section-aware + **hashlib** digests | Exec |
| ISSUE-09 soft hyphen | Explorer | **Already fixed** | Absent | Grep |
| ISSUE-10 Spanglish / outcomes | Explorer | **Mostly fixed** | LO terminal periods; dictionary polish | Manual |
| ISSUE-11 callout grammar / meta | Explorer + Expert S48-001…009 | **Active** | All 8 callouts rewritten learner-facing | Grep clean |
| ISSUE-12 T2-B allow+deny | Explorer | **Already fixed** | Dual path retained | Manual |
| ISSUE-13 SMART outcomes | Explorer | **Already fixed** | Periods added | Manual |
| ISSUE-14 You Do scaffold | Explorer | **Already fixed (partial)** | CORPUS + retrieve/answer skeleton; residual checklist style documented | Manual |
| ISSUE-16 CP-N4-C naming | Explorer | **OK in content** | Map/youDo/selfCheck use CP-N4-C-RAG; iDo intro no longer QA-register | Manual |
| ISSUE-17 id/filename | Explorer P3 | **Platform residual** | Silent `ai-governance` | Documented |
| ISSUE-18 hybrid recall | Explorer | **Already fixed** | Recall@k in theory+demo | Exec |
| ISSUE-19 self-check coverage | Explorer | **Already fixed** | 7 MCQ: embedding, ABSTAIN, gate, injection, ACL, ungrounded, hybrid | Manual |
| ISSUE-21 title EN | Explorer + Expert S48-012 | **Active** | Title → `Aplicaciones LLM y RAG con evidencia` | Scan |
| Expert S48-014/017/024 pero + lexical | Expert | **Active** | Comma before pero; “la búsqueda lexical” | Manual |
| Expert S48-018 APIs | Expert | **Active** | `API de LLM` (×2) | Scan |
| Expert S48-019 cache→caché | Expert | **Active** | Prose `caché`; field `cache_invalidated` kept | Scan |
| Expert S48-020 vs. | Expert | **Active** | `vs.` in LO, feedback, instructions, demos | Scan |
| Expert S48-021 similaridad | Expert | **Active** | resources → similitud | Scan |
| Expert S48-022 tagline | Expert | **Active** | Capitalized; documentos; period | Manual |
| Expert S48-015/016 claim/inyección | Expert | **Active** | citado/permitido; inyección | Manual |
| Expert S48-010 iDo intro | Expert | **Active** | Drop CP-N4-C-RAG / “banderas decorativas” | Manual |
| Expert S48-026 templated feedback | Expert | **Active** | Hand-written distinct feedback per exercise | Manual |
| SQ RAG RAG objectives | Spanish quality | **Active** | “gate CP-N4-C-RAG de evidencia” | Scan |
| Expert-2 Issue 1 empty evidence | Expert-2 | **Critical active** | `grounded` / I Do / E1–E3 require non-empty `evidence_ids` | Exec True/False/False |
| Expert-2 Issue 4 unstable hash | Expert-2 | **Active** | `hashlib.sha256` in theory + I Do T2-A | Exec |
| Expert-2 Issue T4-B multi-gate | Expert-2 / R1 claim | **Active** | Theory T4-B uses multi-gate `route(support, recall, faith, cost)` | Exec |
| Tautological meets_contract | R1 claim false / S41 pattern | **Active** | 16 tautology prints stripped; E3 instructions → token triples | Exec outputs match |
| Expert-2 injection self-attested | Expert-2 Issue 3 | **Residual** | Still a lab Boolean; prose clarifies data-not-instruction; full trust-boundary redesign deferred | Documented |

### What was *not* changed (justified)

| Item | Reason |
|------|--------|
| `id: "ai-governance"` / filename | Compatibility deep links; silent retention (Explorer ISSUE-17) |
| SectionView RichText / Markdown asterisks | Global platform defect — not this agent’s file scope |
| Full OWASP injection pipeline rewrite | Would redesign 24 exercises; residual documented; Boolean models lab outcome with explicit empty-evidence fix prioritized |
| Claim-to-text entailment checker | Beyond stdlib gate pedagogy; claims⊆evidence_ids remains teaching model |
| Authenticated exam bank rewrite | Seed bank not in section-local residual for this pass; selfCheck coverage already solid |
| Collapse 24 labs to fewer | Product structure; missing≠breach taxonomy preserved |
| Variable name `meets_contract` in E1 | Legitimate domain variable; only tautological E2/E3 prints removed |

---

## 3. Precise changes (substance)

### 3.1 Opening / identity / theory callouts
- Title Spanish-primary; tagline capitalized with `documentos`.
- Eight theory callouts: removed author/QA register (“Nota de orientación”, “Antes de promover”, “El dueño de”, “Cierre de…”, “residual risk”); each states the **local learner-facing contract** for that subtopic.
- Map: API singular; inyección; grounding dictionary notes non-empty evidence.

### 3.2 Technical correctness (Expert-2 P0)
- **T4-A `grounded`:** empty `evidence_ids` now fails (vacuous subset truth closed).
- **I Do T4-A:** demo prints empty-list rejection; output triple + injection flag.
- **We Do T4-A E1–E3:** `bool(ids)` required in solution paths.
- **T2-A provenance:** `hashlib.sha256(...).hexdigest()[:12]` (stable, not `hash()`).
- **T4-B theory:** multi-gate `route()` aligned with I Do.

### 3.3 We Do / Spanish / feedback
- 16 tautological `meets_contract = ('x'=='x')` blocks removed from E2/E3 solutions.
- E3 instructions: exact token-triple salida (not “imprime meets_contract”).
- Feedback strings hand-diversified so E1/E2/E3 of the same subtopic are not clones.
- `caché`, `vs.`, claim concordance, similaridad→similitud, youDo “RAG RAG” fixed.

---

## 4. After-Fix Validation Report

| Check | Result |
|-------|--------|
| Explorer ISSUE-01…22 | Fixed / already fixed / residual only ISSUE-17 + platform |
| Expert S48-001…035 (actionable) | Closed or residual-documented |
| Expert-2 empty evidence | **Fixed** (exec: `[True, False, False]`) |
| Theory + I Do + solutionCode | **41/41 PASS** (stdout matches declared `output`) |
| Spanish quality | **9.38 → 10.0** (`--no-lt`); FH 76.8 |
| Meta-leak scan | Clean: no Nota de orientación / promover / dueño / Cierre de S48 / residual risk / CASO-LIM / Id legacy / auto-fraude / tautology prints |
| Markdown rendering | Platform RichText leak residual (callouts may still show raw `**` if global bug applies) — not fixed here |
| Assessment keys | selfCheck 7 questions; correctIndex distribution [3,1,2,0,3,1,2] — varied |
| Live route | Hash `#ai-governance` unchanged; title now Spanish-primary |
| Continuity S47→S48→S49 | Narrative bridges retained; id debt on adjacent sections is out of scope |

**Explicit statement:**  
No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content. Automation was used only for mechanical validation (code execution, greps, Spanish metrics) and mechanical removal of harness tautology lines.

---

## 5. Residual risks and later recommendations

### Section-local
- **Injection defense as Boolean:** still self-attested; future pass could process a hostile chunk string through a delimiter/screening helper without expanding to a full OWASP lab.
- **You Do readiness checklist** still boolean-gated; stronger portfolio harness optional.
- **Hybrid linear mix without RRF normalization** remains a simplified teaching model (resources point to RRF).

### Platform / global
- SectionView RichText for callouts / jobRelevance / steps.
- Identity `ai-governance` vs title RAG (Global Agent C).
- Roadmap maestro “Cost, Latency & Scaling” mismatch (documentation debt).

### Deferred
- Authenticated exam bank rebalance if seed variants lag selfCheck.
- Full entailment/faithfulness scorer beyond id-set inclusion.

---

## 6. Updated Graph Memory notes

| Node | Note |
|------|------|
| Section node | S48 RAG-with-evidence (`ai-governance` silent) |
| Corrected concepts | Non-empty evidence grounding; stable chunk hash; multi-gate abstention; ACL-before-rank; hybrid+Recall@k |
| Prerequisites | S47 serving / MLOps narrative consumer |
| Forward | S49 tools/agents consume grounded assistant |
| Strengths retained | Fail-closed tokens; 24-lab E1→E2→E3; CASO-PUN-048; security-aware RAG |
| Resolved defects | Meta callouts; empty-evidence vacuity; tautologies; Spanish orthography cluster |
| Remaining risks | Injection Boolean; platform RichText; legacy id |
| Assessment coverage | Embeddings, ABSTAIN, gate, injection-as-data, ACL pre-rank, ungrounded claim, hybrid eval |

---

## 7. Files changed

| File | Why |
|------|-----|
| `src/lib/course/sections/s48-ai-governance.ts` | Only product edit: theory, I Do, We Do, You Do, resources, self-check-adjacent prose |
| `course-state/curriculum_hardening/audits/spanish_quality/S48_SPANISH_QUALITY.json` | Regenerated by validation audit script |
| `course-state/curriculum_hardening/audits/fixer_reports/round2/S48_FIXER_REPORT.md` | This report |
| `expert_audit/worklog_entries_r2/S48.md` | Full worklog entry |
| `expert_audit/worklog.md` | Append-only completion pointer |

---

## 8. Worklog confirmation

Completion entry written to `expert_audit/worklog_entries_r2/S48.md` and a brief pointer appended to `expert_audit/worklog.md` with Task ID **FIXER-R2-S48**.

Section 48 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
