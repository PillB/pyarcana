# S40 Fixer Report (Round 2) — Arquitectura, DDD y decisiones técnicas

**Role:** Curriculum Fixer · Technical Editor · Pedagogical Rewriter (second-round)  
**Date:** 2026-07-25  
**Task ID:** FIXER-R2-S40  
**Scope lock:** Section 40 only (`id: agentic-architecture`)  
**Canonical source (primary product file):** `src/lib/course/sections/s40-agentic-architecture.ts`  
**Assessment (section bank):** `prisma/seed.ts` block `'agentic-architecture'`  
**Live:** https://pillb.github.io/pyarcana/#agentic-architecture  

---

## 1. Section identification and sources reviewed

| Field | Value |
|--------|--------|
| Section # | **40** |
| Title | Arquitectura, DDD y decisiones técnicas |
| shortTitle | Arquitectura y DDD |
| Internal id | `agentic-architecture` (legacy slug; retained for URL/progress compatibility) |
| Canonical file | `src/lib/course/sections/s40-agentic-architecture.ts` |
| Live route | `#agentic-architecture` |
| Primary Explorer report | `course-state/curriculum_hardening/audits/explorer_reports/S40_EXPLORER_REPORT.md` |
| Expert report | `expert_audit/S40_report.md` |
| Expert 2 audit | `expert_audit/expert_2_audit/Explorer Report — Sección 40 de PyArcana.docx` |
| Spanish-quality JSON (pre R2) | `course-state/curriculum_hardening/audits/spanish_quality/S40_SPANISH_QUALITY.json` (score **9.09**, findings **105**) |
| Grammar plan | `expert_audit/_GRAMMAR_SUBPLAN.md` |
| Campaign summary | `expert_audit/CAMPAIGN_SUMMARY.md` |
| Shared worklog | `expert_audit/worklog.md` |
| Round-1 Fixer claim (re-audited) | `course-state/curriculum_hardening/audits/fixer_reports/S40_FIXER_REPORT.md` |
| Assessment | In-section `selfCheck` (8 MCQs); We Do 24 × E1/E2/E3; You Do dossier CP-N4-A; authenticated bank 24 variants in `prisma/seed.ts` |
| Validation | Hand re-execution of 17 theory/I Do + 24 solutionCode pairs; residual greps; Spanish-quality `--from 40 --to 40 --no-lt`; exam position distribution |

### Anti-aberration acknowledgment

No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture educational prose. Automation was used only for mechanical validation (code execution, greps, Spanish-quality metrics, answer-position counts). Every prose unit changed in this pass was rewritten by hand with deliberate pedagogical intent.

---

## 2. Summary of changes applied

### Round-2 reality check

**Explorer (score 6.4) vs current source:** Round-1 already closed the pedagogical P0/P1 cluster (legacy V3 meta, mangled You Do keys, double “bloquea”, Contrato operativo stamp, misaligned I Do T2-A, Protocol ports, trade-off min cost, craft E1 oficios for ports/context map/entity-VO/C4+ADR/consumer, selfCheck n=8, layer forbidden edges). Independent re-audit **confirmed those closures**.

**Expert report (score 7.4) vs current source:** Several residuals were **still active** despite R1 claim: “Nota de orientación”, “no promociones”, “úsa la”, “promote”, “residual risk” in wrong T4-A callout, dictionary/orden run-ons, standup metaphor, boilerplate callouts.

**Expert 2 (docx, score 5.4):** Strong critique of boolean monoculture and BC “must be disjoint”. R1 craft E1s already mitigated monoculture; R2 fixed **BC pedagogy contradiction** with exam (shared term with local meanings) and honest VO/`implements_port` lab framing. Full redesign of all 24 We Do into free-form architecture workshops is deferred as residual risk (out of R2 residual polish scope without bulk rewrite).

### Resolution table

| Issue | Source | Status before R2 | Change applied | Validation |
|-------|--------|------------------|----------------|------------|
| ISSUE-01 / M1 legacy id prose | Explorer | Already fixed (R1) | Retained alcance learner-facing; id kept | Grep 0 Id legacy / path V3 |
| ISSUE-02 You Do keys | Explorer | Already fixed | Retained `qa_scenarios`… keys + templates | Manual starter |
| ISSUE-03 youDo double bloquea | Explorer | Already fixed | Context split + gate grammar retained | Manual |
| ISSUE-04 Contrato operativo | Explorer | Already fixed | Unique contracts retained | Grep 0 |
| ISSUE-05 thin mechanism | Explorer | Mostly fixed | BC + VO honesty paragraphs deepened | Manual |
| ISSUE-06 I Do T2-A | Explorer | Already fixed | Layer `FORBIDDEN` demo retained | Exec PASS |
| ISSUE-07 I Do T3-B/T4-A | Explorer | Already fixed | VO honesty + adr_ready retained | Exec PASS |
| ISSUE-08 templated why | Explorer | Already fixed | T3-B why rewritten (split + lab honesty) | Manual |
| ISSUE-09–11 theory/trade-off | Explorer | Already fixed | Retained | Exec PASS |
| ISSUE-12 We Do monoculture | Explorer | Strongly mitigated R1 | **R2:** T2-A-E1 craft graph print; BC lab nuance | Exec T2-A E1 PASS |
| ISSUE-13–14 headings/LOs | Explorer | Already fixed | Retained | Manual |
| ISSUE-15 id vs title | Explorer | Deferred | Keep `agentic-architecture` | Platform residual |
| ISSUE-16 selfCheck n=5 | Explorer | Already fixed (n=8) | Retained; balanced indices 0–3 | dist 2/2/2/2 |
| ISSUE-17–22 polish | Explorer | Mostly fixed | Callouts + Spanish residuals closed | Greps clean |
| S40-I01 slug rename | Expert | Deferred | Content disambiguation only | Platform residual |
| S40-I02 T4-A callout T4-B leak | Expert | **Active** | Rewrote T4-A callout to T4-A C4+ADR + riesgo residual | Grep fixed |
| S40-I03 Nota de orientación | Expert | **Active** | Map callout → teacher voice CP-N4-A | Grep 0 |
| S40-I04 úsa la | Expert | **Active** | → `úsala` | Grep 0 |
| S40-I05 promote | Expert | **Active** | Spanish dueño/promoción; no “promote” noun | Grep 0 |
| S40-I06 residual risk EN | Expert | **Active** | “riesgo residual” in T4-A callout | Grep 0 residual risk |
| S40-I07–I08 run-ons map | Expert | **Active** | Dictionary + orden split into short paragraphs | SQ 10.0 |
| S40-I11 boilerplate callouts | Expert | **Active** | 9 unique learner-facing callouts | Manual |
| S40-I14 standup | Expert | **Active** | “no es una nota al margen” | Grep 0 |
| S40-I15 rubric weights | Expert | Active | Trade-offs 15%; seguridad 10% | Sum 100% |
| Expert2 BC disjoint absolute | Expert-2 | **Active** | Theory + E1 feedback: tokens disjuntos = lab simplification; shared term needs ACL | Manual + exam aligned |
| Expert2 VO flag magic | Expert-2 | **Active** | Theory/I Do: `vo_frozen` = assert de lab | Manual |
| Expert2 DIP self-declare | Expert-2 | Partial | Theory: flag is checklist; real evidence = swap adapter | Manual |
| Expert2 exam all index 1 | Expert-2 | **Active** | Rebalanced 24 seed options → 6/6/6/6; fixed domain-service key bug | dist count |
| Spanish quality wall of text | SQ | Active | Map paragraphs segmented | score 9.09→10.0 |

---

## 3. Full corrected content / precise diffs (summary of hand-crafted edits)

Product file remains `src/lib/course/sections/s40-agentic-architecture.ts`. This pass did **not** regenerate the file; it applied precise residual edits.

### 3.1 Theory map — dictionary and route (cognitive load)

- Split single dictionary paragraph into three short definition blocks.
- Split “Orden de aprendizaje / E1–E3 / Alcance” into three paragraphs.
- Map callout: from editorial “Nota de orientación… no promociones” to CP-N4-A learner contract.

### 3.2 All theory callouts (9) — unique teacher voice

Each subtopic callout now states the **local** measurable criterion (QA umbral+dueño, min cost residual, layer graph, DIP port, context map ACL, entity/VO, C4+ADR, consumer contract+deuda). Removed forward-mislabel “Cierre de S40-T4-B” inside T4-A.

### 3.3 Bounded contexts (Expert-2 critical)

- Theory: shared term with local meanings is valid when map/ACL declare ownership; lab uses **disjoint tokens** as didactic simplification.
- T3-A-E1 instruction/feedback/hints aligned to that framing.

### 3.4 Entities / VO honesty

- Theory + theory code + I Do: `vo_frozen` is lab invariant assert; production uses immutable types.
- I Do `why` split to reduce run-on (Spanish-quality medium).

### 3.5 Ports lab honesty

- T2-B contract paragraph: `implements_port` is checklist; production evidence is adapter substitution without rewriting domain rules.

### 3.6 Grammar / register

- `úsa la` → `úsala`; “en el You Do”.
- “promote” → Spanish promoción/dueño.
- “residual risk” → “riesgo residual”.
- “chiste de standup” → “nota al margen”.
- “owner de plataforma” → “dueño de plataforma” in T1-B application.

### 3.7 We Do craft residual

- T2-A-E1 elevated to **Oficio de grafo de capas** with printed `graph` edges (starter + solution + expected output).

### 3.8 You Do / rubric

- Context: split long platform sentence; “IA auxiliar”.
- Rubric: comunicación de trade-offs **15%**; seguridad **10%** (sum 100%).

### 3.9 Authenticated exam bank (`prisma/seed.ts`)

- 24 variants rebalanced: `correctIndex` distribution **6 / 6 / 6 / 6**.
- Fixed latent bug: domain service correct option was index 0 while key said 1.
- Light Spanish orthography (cohesión/acoplamiento) and stronger BC exam wording.

---

## 4. After-Fix Validation Report

### 4.1 Issue-by-issue confirmation

| Cluster | Result |
|---------|--------|
| Explorer ISSUE-01…22 | **Fixed** (R1) or **confirmed retained**; ISSUE-15 deferred platform |
| Expert S40-I02…I08, I11, I14, I15 | **Fixed** in R2 |
| Expert S40-I01 slug rename | **Deferred** (compatibility) |
| Expert-2 BC absolute rule | **Mitigated** (theory + lab framing; lab still uses isdisjoint) |
| Expert-2 exam position bias | **Fixed** |
| Spanish residuals listed | **Fixed** |

### 4.2 Code and assessment oracles

| Check | Result |
|-------|--------|
| Theory + I Do code/output pairs | **17/17 PASS** |
| We Do solutionCode | **24/24 PASS** |
| Structure map+8 / 8 iDo / 24 weDo / 8 selfCheck | **PASS** |
| selfCheck correctIndex dist | **2,2,2,2** (indices 0–3) |
| Exam bank correctIndex dist | **6,6,6,6** |
| Residual meta greps (Nota orientación, no promociones, úsa la, residual risk, promote, standup, Id legacy, path V3, Contrato operativo, est_mulo) | **0** |
| Spanish quality `--from 40 --to 40 --no-lt` | **9.09 → 10.0** (findings 105 → 24, mostly low LT-style noise / technical token false positives) |
| FH mean | **69.8** (normal technical band) |

### 4.3 Markdown rendering

SectionView still renders some rich fields as raw text (repository-wide). No section-local workaround applied. No new literal `**` regressions introduced beyond existing platform behavior.

### 4.4 Live / continuity

- Route remains `#agentic-architecture`.
- Bridges S39 (CP-N3-C) → S40 → S41 (APIs) retained.
- Case `CASO-LIM-040` / Red Andina / no-PII ethics retained.

### 4.5 Explicit anti-aberration statement

No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content. Automation was used only for mechanical validation.

---

## 5. Residual risks and later recommendations

### Section-local residuals

1. **We Do still gate-heavy for E2/E3:** Fail-closed hygiene is strong; full free-form ADR prose workshops / multi-file C4 drawing remain optional future enrichment (Expert-2 “oficio insuficiente” partially mitigated, not eliminated).
2. **Lab simplifications remain intentional:** BC token disjoint, `implements_port` flag, C4 as name lists, ADR field presence — now **honestly framed** as lab contracts, not industry-complete proofs.
3. **`scripts/seed_questions_extra.txt`** still contains obsolete multi-agent placeholder block for `agentic-architecture`; live bank is `prisma/seed.ts`. Clean up extra file only if still imported by tooling.

### Platform residuals (do not fix in section agent)

- Legacy id/filename `agentic-architecture` / `s40-agentic-architecture.ts` needs redirect + progress-key migration (Global Agent C).
- SectionView RichText for Markdown fields (Global Agent A).
- Optional deeper execute-and-diff harness for craft oficios (Global Agent B).

### Adjacent recommendations (out of scope)

- S41 can assume ports + additive evolution vocabulary from S40.
- S49 agents content should not be confused with S40 URL slug until migration lands.

---

## 6. Updated Graph Memory notes

```
[S40 Map] --defines--> [CP-N4-A: boundaries + measure/owner/consequence]
[S40 Map] --disclaims--> [LLM agent orchestration → later sections]
[T1-A QA] --aligned--> [WeDo T1-A] --supports--> [YouDo qa_scenarios]
[T1-B trade-off min cost] --feeds--> [ADR residual]
[T2-A layers] --IDo+E1 craft graph--> [FORBIDDEN edges]
[T2-B ports Protocol] --honest checklist--> [implements_port lab]
[T3-A BC] --lab tokens disjoint--> [ACL case→record]
[T3-A BC] --theory--> [shared term OK with local meaning + map]
[T3-B entity/VO] --lab vo_frozen assert--> [prod immutable type]
[T4-A C4+ADR] --rubric--> [YouDo adrs_x2]
[T4-B additive] --consumer contract--> [S41 APIs]
[Exam bank] --balanced keys--> [attempt equivalence]
[Legacy id agentic-architecture] --compatibility residual--> [Global Agent C]
```

**Retained strengths:** resources (C4, Cockburn, Evans, ADR, DDIA), fail-closed E3, ethics, craft oficios on core subtopics, 8 public MCQs.

**Resolved defect nodes:** meta callouts, T4-A mislabel, Spanish morphology, BC theory/exam contradiction, exam position bias, domain-service key bug, VO honesty, rubric weight alignment.

---

## 7. Files changed

| File | Why |
|------|-----|
| `src/lib/course/sections/s40-agentic-architecture.ts` | Theory callouts, dictionary/route load, BC/VO/ports honesty, grammar, T2-A-E1 craft, You Do context, rubric, I Do why |
| `prisma/seed.ts` | Section 40 authenticated exam rebalance + key fix + light Spanish |

No edits to `SectionView.tsx` or other sections.

---

## 8. Worklog confirmation

- Full entry: `expert_audit/worklog_entries_r2/S40.md`
- Pointer appended to: `expert_audit/worklog.md` (Task ID: **FIXER-R2-S40**)

---

Section 40 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
