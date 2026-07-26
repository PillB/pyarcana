# S08 Independent Fixer Report — Archivos, CSV, JSON y contratos de ingesta

## 1. Section identification and sources reviewed

- **Section:** 8 — **Archivos, CSV, JSON y contratos de ingesta**
- **Canonical source:** `src/lib/course/sections/s08-pandas.ts`
- **Canonical runtime identity:** `index: 8`, compatibility id/hash `pandas`
- **Canonical import:** `src/lib/course/index.ts`
- **Live route:** `https://pillb.github.io/pyarcana/#pandas`
- **Primary Explorer report:** `course-state/curriculum_hardening/audits/explorer_reports/S08_EXPLORER_REPORT.md`
- **Independent expert report:** `expert_audit/S08_report.md`
- **Spanish-quality evidence:** `course-state/curriculum_hardening/audits/spanish_quality/S08_SPANISH_QUALITY.json`
- **Grammar plan:** `expert_audit/_GRAMMAR_SUBPLAN.md`
- **Assessment source:** `prisma/seed.ts`, bank key `pandas`
- **Section-owned runtime mappings:** `src/components/course/SectionView.tsx['pandas']` and `src/components/course/PdfReport.tsx['pandas']`
- **Validation source added:** `tests/adversarial/test_s08_ingestion_contract.py`
- **Research packet:** all 13 supplied `project_sources/*.md` files were inventoried. They supplied general gradual-release criteria only; their section-number/topic assumptions were not accepted over the canonical import, current source, and live route.

This was a fresh owner pass. Earlier Fixer reports and completion claims were not used as evidence. I read the current section map, all eight theory subtopics, eight I Do demos, 24 We Do exercises, the You Do project and rubric, 11 public self-check questions, 24 authenticated questions, the live runtime mappings, and the public deployed bundle.

## 2. Summary of changes applied

| Issue | Source | Status before | Change applied | Validation |
|---|---|---|---|---|
| EX-01–09, EX-12–19, EX-21, EX-23–25 | Explorer | The old report described code/output mismatches, garbled exercises, false-pass starters, thin self-check coverage, inconsistent atomic-write/quarantine contracts, and an integration cliff. | Fresh current-source inspection and execution showed these defects already absent from the baseline. All 65 executable S08 artifacts passed, and the current surface retains 8 subtopics, 8 demos, 24 exercises, a complete project/rubric, and 11 public checks. No old completion claim was used. | Runtime audit 65/65; V3 counts/structure/invariants pass; focused contract test pass. |
| EX-10 | Explorer | The opener still compared the section against a “groupby de demo”, using internal curriculum contrast instead of direct learner value. | Replaced the comparison with a concrete interview signal: a fail-closed pipeline demonstrates that the learner detects data loss instead of hiding it. | Focused meta-leak assertions and manual Spanish review pass. |
| EX-11 | Explorer | Compatibility id `pandas` remains necessary, while the public playground and PDF label still taught “Pandas” rather than the active files/ETL contract. | Preserved the compatibility id but replaced the S08-owned playground with a runnable stdlib ingestion/quarantine/manifest lab and relabeled the PDF entry `8. Archivos & ETL`. | Playground executes with exact expected output; static bundle contains both new labels and no old playground title. |
| EX-20 | Explorer | A visible typo (`reprocessar`) and imprecise `DecodeError` name remained. | Corrected `reprocesar` and named `UnicodeDecodeError` precisely. | Focused learner-text assertions pass; manual paragraph review complete. |
| EX-22 | Explorer | Resource quality was a low-priority recommendation. | Current resources already point to relevant Python library documentation and responsible data guidance; no section-local change required. | Manual source review. |
| New S08-A1 | Fresh independent audit | All 24 authenticated questions had `correctIndex: 1`, so one answer-position shortcut scored 100%. Several distractors were implausible, and the last item exposed `S08 V3` / platform-id archaeology. | Hand-reordered and edited all 24 questions. Overall positions are 6/6/6/6; each deterministic attempt is 2/2/2/2; each concept’s three variants use three different positions. Removed learner-facing archaeology and aligned `col_count`, datetime serialization, and provenance wording with the taught contracts. | Focused bank test and repository exam-pedagogy audit pass: 1,248 questions, 416 concepts, P0=0, P1=0. |
| New S08-A2 | Combined B03 adversarial gate | The newbie-packet parser uses a 500-character lookback from each `instruction`. Seven long preambles placed their canonical `id` outside that window, so the 24 exercises resolved to only 21 set values through duplicate/fall-forward IDs and `None`. | Moved only those seven unchanged ID properties to the learner-manifest boundary immediately after `preamble` and before `instruction`. No instructional text, code, ordering, or runtime identifier changed. | S08 packet manifest now equals all 24 canonical IDs in exact T1-A→T4-B / E1→E3 order; 24/24 are unique. |
| Expert I-01–I-07, I-09–I-12, I-14–I-17 | Expert | The expert report recorded voseo, long inline lists, agreement/punctuation defects, internal starter tags, and several wording defects. | Fresh inspection confirmed the current baseline already contains the tuteo forms, real Markdown lists, corrected agreement/punctuation, and cleaned starter scaffolds. The two remaining independent wording defects are covered by EX-20. | Manual theory/I Do/We Do/You Do/self-check review; Spanish baseline 9.82/10. |
| Expert I-08 | Expert | Bare section codes remain in some prerequisite/forward links, although learner-facing first mentions now include descriptive titles for important forward references. | Retained the current cross-section convention to avoid a one-section-only rewrite of fleet navigation language. | Classified as a repository-wide convention, not a section-local correctness failure. |
| Expert I-13 and I-16 | Expert | Automated grammar flags target conventional code identifiers and a false capitalization match. | No change; confirmed false positives. | Manual contextual review. |
| Expert I-18 | Expert | A historical `visible_paragraphs` snapshot can lag the active source. | Not changed: it is not imported by the current learner runtime, and regenerating campaign-wide audit snapshots is outside this section-owned commit. | Canonical import and static bundle inspection confirm the active source. |
| Spanish findings 1–8 | Spanish JSON | One low long-sentence flag and seven parser false positives remained in audit evidence. | The map is already a Markdown list; the other excerpts are code literals, identifiers, arrows, or bibliography abbreviations. No blind rewrite was applied. The newly found real typo was fixed manually. | Baseline score 9.82/10 retained; focused test prevents `reprocessar` regression. |

## 3. Full corrected content or precise complete diffs

The commit contains the reproducible Git diff. The complete semantic changes are:

### Learner source

```diff
- Un groupby de demo impresiona menos en entrevista junior que un pipeline fail-closed...
+ En una entrevista junior, un pipeline fail-closed con reconciliación por fuente demuestra
+ que sabes detectar pérdidas en vez de ocultarlas detrás de una salida aparentemente correcta.

- El raw intacto permite reprocessar.
+ El raw intacto permite reprocesar.

- evita mojibake y DecodeError sorpresa.
+ evita mojibake y `UnicodeDecodeError` inesperados.
```

All theory, I Do, We Do, You Do, rubric, and public self-check contracts otherwise remain intact because direct execution and manual inspection found the old report’s failures already absent from the current baseline.

### Authenticated bank

The 24 questions remain eight concepts × three equivalent variants. Correct positions are now:

| Concept | Variant positions |
|---|---|
| `pathlib-with-modes` | 0, 1, 2 |
| `newlines-atomic-write` | 1, 2, 3 |
| `csv-dialects-headers` | 2, 3, 0 |
| `irregular-rows-quarantine` | 3, 0, 1 |
| `json-serialize` | 0, 1, 2 |
| `schema-nulls-evolution` | 1, 2, 3 |
| `backups-hashes-provenance` | 2, 3, 0 |
| `reconciliation-manifest` | 3, 0, 1 |

Weak joke/absolute distractors were replaced with plausible misconceptions. The final internal question was replaced with a learner-facing transfer question: “¿Qué entrega demuestra el cierre del gate CP-N1-B?”. The bank now consistently uses `col_count`, explicit `datetime.isoformat()` conversion, and the section’s minimum per-source provenance contract `{path, sha256, bytes}`.

### Runtime mapping

The old Pandas DataFrame/groupby playground was replaced with a self-contained standard-library example that:

1. reads a synthetic CSV using `csv.DictReader`;
2. quantizes valid amounts with `Decimal`;
3. quarantines the invalid row with reason `cast_monto`;
4. computes a SHA-256 prefix;
5. emits `n_in`, `n_clean`, `n_quarantine`, and `reconcile_ok`.

Its captured output is exact:

```text
clean [{"id": "C001", "monto": "10.50"}, {"id": "C003", "monto": "3.00"}]
quarantine [{"raw": {"id": "C002", "monto": "x"}, "reason": "cast_monto"}]
manifest {"n_clean": 2, "n_in": 3, "n_quarantine": 1, "reconcile_ok": true, "sha256_12": "0181876342b5"}
```

The S08 PDF label changed from `8. Pandas` to `8. Archivos & ETL`.

### Section-specific validation

`tests/adversarial/test_s08_ingestion_contract.py` adds six independent regressions for:

- exact newbie-packet exposure of all 24 canonical exercise IDs in order;
- canonical identity and the 8/8/24 gradual-release surface;
- public self-check position coverage;
- authenticated concept count, attempt equivalence, position balance, and archaeology removal;
- executable playground/output fidelity;
- PDF identity alignment.

## 4. After-Fix Validation Report

| Gate | Result |
|---|---|
| Focused S08 adversarial regression | 6/6 tests passed |
| Newbie-packet S08 manifest | exact ordered list `S08-T1-A-E1` … `S08-T4-B-E3`; 24/24 unique |
| Python content runtime audit (`--only s08-pandas --workers 1`) | 65/65 artifacts passed; fail=0, skip=0, P0=0, P1=0 |
| TypeScript (`npx tsc --noEmit`) | passed |
| ESLint (`npm run lint`) | passed |
| V3 counts / structure / invariant | passed; 52 sections; S08 has 8 subtopics, 8 demos, 24 exercises |
| Exam pedagogy audit | passed; 1,248 questions, 416 concepts, P0=0, P1=0 |
| Production static export | passed; compiled, typechecked, generated 3/3 pages |
| Local exported HTTP check | HTTP 200; expected PyArcana title present |
| Static-bundle identity check | new playground and PDF labels present; old playground title absent |
| Diff whitespace check | passed |

The playground code was executed independently by the focused test and matched the checked-in expected output byte for byte after trimming the final newline.

The authenticated answer-position distribution is `{0: 6, 1: 6, 2: 6, 3: 6}`. Each attempt column is `{0: 2, 1: 2, 2: 2, 3: 2}`. Every concept moves the correct answer across three distinct positions.

The Spanish-quality evidence before this independent pass was 9.82/10. Its eight recorded findings were manually rechecked: seven are parser/context false positives and the long map is already rendered as a Markdown list. The two genuine wording defects newly observed in the current source were corrected. No numeric “after” score is fabricated because the fleet Spanish generator was not rerun as a content-production mechanism.

The public GitHub Pages deployment returned HTTP 200 and identified Section 8 as “Archivos & ETL”, but its loaded bundle still contained the stale Pandas playground and `8. Pandas` PDF mapping before this commit. The locally built production bundle contains the corrected strings. Final public-render confirmation belongs to the parent batch deployment.

Accessibility observations: the change introduces no new controls, focus paths, color-only signals, or image-only instruction. The playground remains plain selectable code plus expected text output, and its title/hint now describe the actual task. Previous/next continuity remains S07 text/Unicode → S08 durable ingestion → S09 exceptions/logging.

No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content. Automation was used only for mechanical validation.

Validation commands rewrote fleet-level JSON summaries. Those side effects were restored before staging and are not part of this section commit.

The exact fleet test `TestPacketIsolation.test_active_contract_is_exact_and_unique_for_every_section` was also run in this isolated pre-integration fork. Its S08 subtest now passes and the aggregate failure count fell from 51 to 50. The command remains nonzero only because 50 other section branches are absent from this fork; those out-of-scope failures are not masked here. The parent’s combined integration branch is the authoritative all-section rerun.

## 5. Residual risks and later recommendations

1. The compatibility id/hash and bank key remain `pandas`, and the canonical filename remains `s08-pandas.ts`. Renaming them requires a coordinated migration of progress keys, routes, bookmarks, assessment keys, imports, and deep links.
2. The public Pages bundle will remain stale until the parent integrates and deploys this batch. The local production artifact is validated, but this report does not claim that an unmerged commit is already public.
3. Bare `S0X` cross-references are a fleet writing convention. A global editorial pass may replace them consistently with learner-facing titles; a one-section-only convention change would create new inconsistency.
4. Historical audit snapshots should be regenerated once at campaign close, not by individual section owners.

## 6. Updated Graph Memory notes

- **Section node:** S08 / compatibility id `pandas` / Archivos, CSV, JSON y contratos de ingesta.
- **Corrected concept nodes:** UTF-8/pathlib, atomic writes, CSV contracts and dialects, quarantine reasons, JSON/JSONL serialization, schema/null semantics, hashes/provenance, manifest reconciliation.
- **Prerequisite edges:** S02 `Decimal`; S03 missing vs. falsy; S05 normalizers; S06 in-memory records; S07 Unicode/encoding.
- **Forward edges:** S09 exception/log evidence; S10 CLI packaging; later data tooling consumes the trustworthy outputs.
- **Retained strengths:** complete 8-subtopic gradual release, synthetic data, fail-closed final project, exact reconciliation invariant, executable examples.
- **Resolved defect nodes:** stale Pandas playground, stale PDF identity, answer-position shortcut, implausible distractors, authenticated meta-leak, terminology/Spanish precision.
- **Remaining risks:** compatibility id migration, fleet-wide section-reference convention, post-merge live verification.
- **Assessment coverage:** 11 public checks plus 24 authenticated questions over eight concepts, position-balanced overall and per attempt.

## 7. Files changed

1. `src/lib/course/sections/s08-pandas.ts` — learner-value wording and Spanish/exception precision.
2. `prisma/seed.ts` — only the S08 `pandas` authenticated bank.
3. `src/components/course/SectionView.tsx` — only the S08 `pandas` playground mapping.
4. `src/components/course/PdfReport.tsx` — only the S08 `pandas` PDF label.
5. `tests/adversarial/test_s08_ingestion_contract.py` — focused S08 regressions.
6. `course-state/curriculum_hardening/audits/fixer_reports/independent/S08_FIXER_REPORT.md` — this independent evidence report.
7. `expert_audit/independent_worklog/S08.md` — append-only independent campaign record.

No fleet-wide generated audit summary is included.

## 8. Worklog confirmation

The campaign-specific completion entry was written to `expert_audit/independent_worklog/S08.md`. The parent’s canonical inventory and shared campaign summaries were not edited by this isolated owner.

Section 8 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
