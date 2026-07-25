# S36 Fixer Report (Round 2) — Clustering, anomalías y validación temporal

**Generated:** 2026-07-25  
**Role:** Second-round Section Fixer (headless)  
**Section:** 36 · `ai-apis-advanced` · Clustering, anomalías y validación temporal  
**Source edited (only):** `src/lib/course/sections/s36-ai-apis-advanced.ts`  
**Anti-aberration:** **OK** — no generators, loops, templates, or bulk mechanisms manufactured educational prose. Automation used only for mechanical validation (code/output oracles, Spanish metrics, residual greps). Every learner-facing change was hand-authored with pedagogical intent.

---

## 1. Section identification and sources reviewed

| Field | Value |
| --- | --- |
| Section number / title | 36 — Clustering, anomalías y validación temporal |
| Canonical file | `src/lib/course/sections/s36-ai-apis-advanced.ts` |
| Live route | https://pillb.github.io/pyarcana/#ai-apis-advanced |
| Internal ID | `ai-apis-advanced` (legacy routing hash; content is unsupervised signals) |
| Primary Explorer report | `course-state/curriculum_hardening/audits/explorer_reports/S36_EXPLORER_REPORT.md` (baseline 6.6; meta-leaks + depth) |
| Round-1 Fixer report | `course-state/curriculum_hardening/audits/fixer_reports/S36_FIXER_REPORT.md` (present; structural hardening already in source) |
| Expert report | `expert_audit/S36_report.md` (8.4; Spanish/redaction H/M items) |
| Expert-2 report | `expert_audit/expert_2_audit/pyarcana-section-36-explorer-report.md` (5.2 technical honesty; sklearn-depth stretch) |
| Spanish-quality JSON | `course-state/curriculum_hardening/audits/spanish_quality/S36_SPANISH_QUALITY.json` (pre R2: 8.37) |
| Grammar plan | `expert_audit/_GRAMMAR_SUBPLAN.md` |
| Campaign / worklog | `expert_audit/CAMPAIGN_SUMMARY.md`, `expert_audit/worklog.md` |
| Assessment | Embedded `selfCheck` (now 8 MCQ); seed bank key `'ai-apis-advanced'` inspected only (not edited) |
| Validation | Manual oracle harness (17 theory+iDo + 24 We Do solutions), You Do main, `scripts/spanish_quality_audit.py --from 36 --to 36 --no-lt`, residual greps |

**Scope boundary:** Only Section 36 canonical source. No edits to `SectionView.tsx`, `PdfReport.tsx`, `prisma/seed.ts`, other sections, or global platform files.

---

## 2. Summary of changes applied

### Baseline reality check

Prior work already resolved most Explorer **P1 meta-leaks and structural gaps**:

- No learner-facing `legacy` / `path V3` / `Retarget` / `print-theater` / `gate V3` / «Id ai-apis-advanced conservado».
- Theory T1-A computes z-score before clustering (`scaled` earned).
- Multi-seed demo compares two score maps; density + path-length toys present.
- You Do starter covers scale, assign–update, PCA toy, σ/path, backtest, P@k.
- Callout title already «Ética de señales»; rubric without «gate V3».

Round-2 focused on **expert Spanish H/M**, **DBSCAN min_samples honesty (sklearn include-self)**, **empty-cluster policy**, **multi-seed honesty wording**, **self-check coverage for k-agreement**, and residual redaction.

### Resolution table

| Issue | Source | Status before R2 | Change applied | Validation |
| --- | --- | --- | --- | --- |
| S36-I01…I06 meta (legacy/V3/retarget/print-theater/gate V3) | Explorer M1–M6 | **Already fixed** | Confirmed absent | Residual greps clean |
| S36-I07 scaled without scale | Explorer | **Already fixed** | Confirmed zscore_list + earned flag | Oracle PASS |
| S36-I08–I10 IF/LOF/density/multi-seed depth | Explorer | Partially fixed (toys present) | Honesty language + density sklearn semantics + multi-seed = acuerdo de k | Prose + code |
| S36-I11–I12 policy We Do / ethics tails | Explorer | Mostly improved pre-R2 | Left ≤ residual policy transfers; did not bulk-rewrite 24 exercises | Residual risk |
| S36-I13–I14 You Do / hours | Explorer | Largely aligned (19 h + full starter) | Density/empty-cluster + ethical aviso in objectives | You Do runs |
| S36-I15 bridges S35/S37 | Explorer | **Already fixed** (Puente de carrera) | Confirmed | Source |
| S36-I18 σ ref set | Explorer | **Already fixed** | Confirmed | Source |
| Expert #2 gender *sintético* | Expert H | Active ×2 | **sintética** | Grep clean |
| Expert #3 *fallan en cerrado* | Expert H | Active | Idiomatic fail-closed rewrite in jobRelevance | Source + SQ |
| Expert #4 flag rate / click / labels | Expert M | Active | tasa de flags; clic de revisión; etiquetas | Source |
| Expert #7 auto-culpa / auto-rechazo / auto-etiquetes | Expert M / SQ AUTO_NO_SEPARADO | Active in prose | autoculpa / autorrechazo / autoetiquetes (code ids unchanged) | Grep clean |
| Expert #8–10 vs. / id / click | Expert M/L | Active | vs.; `id`; clic | Source |
| Expert #12–13 long jobRelevance | Expert L | Active | Split + fail-closed rewrite | SQ |
| Expert #14 diccionario wall | Expert L | Active | Markdown bullet list + PII gloss | Source |
| Expert #19 tagline case | Expert L | Active | Capital + period | Source |
| Expert #21 Disclaimer → Aviso | Expert L | Active | Aviso: anomalía ≠ culpa | Source |
| SQ high meta_todo «TODO vacío» | Spanish-quality | Active | Reworded weDo.intro (esqueleto vacío) | SQ 9.6; 0 high |
| Expert-2 DBSCAN off-by-one | Expert-2 #2 | Active | Count includes self; demos use min_samples=3 for same geometry lesson; prose documents sklearn | Oracle [F,F,T,T,T] preserved |
| Expert-2 empty centroid 0.0 | Expert-2 #3 | Active | Preserve previous centroid or raise | Code path exercised |
| Expert-2 multi-seed ≠ partition stability | Expert-2 #4 | Active in overclaim risk | Prose/iDo/selfCheck: acuerdo de k, not ARI | New MCQ #8 |
| Expert-2 real sklearn PCA/IF/LOF | Expert-2 #1,#5,#6 | Stretch / stdlib contract | **Residual** — kept progressive stdlib toys with explicit honesty | Documented residual |
| LO:T4-B indent crash | Technical | Active IndentationError | Indent raise under `if k <= 0` | Oracle 17/17 PASS |
| Legacy id `ai-apis-advanced` | Cross-cut 6.2 | Compatibility | **Retained** | Residual |
| RichText markdown leak | Cross-cut 6.1 | Platform | Recorded only | Residual |
| hint === hints[0] | Expert #17 | Curriculum-wide | Deferred (schema/UI) | Residual |
| seed bank position bias | Global D | Outside TS | Not edited | Residual |

---

## 3. Full corrected content / precise diffs (summary of substantive edits)

All product changes are in `src/lib/course/sections/s36-ai-apis-advanced.ts`.

### Header
- **Tagline:** capital start; terminal period.
- **jobRelevance:** split long sentence; «cola de revisión»; fail-closed idiomatic; no «fallan en cerrado».
- **learningOutcomes:** terminal periods; vs.; autoetiquetar; «etiquetas» / «revisión».

### Theory map
- Diccionario as Markdown list (14+ terms including PII).
- Contrato: revisión / etiquetas / aviso ético.
- Callout PII gloss.

### T1-A (clustering / density)
- vs.; empty-cluster policy in prose.
- Density: sklearn include-self counting; micro-contrato updated.
- Code: `update_centroids(..., prev=)` and `density_core_1d(..., min_samples=3)` with include-self.
- Red Andina **sintética**; cola de revisión; `id` as code.

### T1-B
- Multi-seed = **acuerdo de k** (not partition ARI).

### T2–T4
- autorrechazo / autoetiquetes; scatter/plot gloss; path-length honesty (not full IF ensemble).
- Novelty **vs.** outlier heading; contamination anaphora.
- T4-A: tasa de flags; clic de revisión; leakage note; split temporal wording.
- T4-B: etiquetas vs. flags; *accuracy*; precision@k indent fix.

### I Do
- T1-A demo mirrors theory density/empty-cluster.
- T1-B description/why: acuerdo de k.
- why polish: autoculpa, contamination articles, tasa de flags.

### We Do
- Intro: no «TODO vacío» high meta marker.
- T1-A-E3: sklearn include-self density solution; Spanish instruction polish.
- Feedback: autoculpa; tasa de flags.

### You Do
- Context/objectives/requirements: aviso ético; density convention; PCA honesty.
- Starter: empty-cluster + density include-self (min_samples=3).
- Rubric: cola de revisión, sin autoculpa.

### Self-check
- Density option/explanation sklearn-aligned.
- New Q8: multi-seed = k-agreement ≠ ARI.
- Minor es-PE polish on explanations.

### Preserved
- `id: "ai-apis-advanced"` (URL/progress).
- Ethics spine (`misconduct=False`, anomalía ≠ culpa).
- 8 demos + 24 exercises computational contracts (solution outputs).
- Stdlib-first progressive disclosure + sklearn production citations.
- Resources list (labels lightly Spanish-polished).

---

## 4. After-Fix Validation Report

### Issue dispositions

| Class | Disposition |
| --- | --- |
| Explorer meta-leaks I01–I06 | **Already fixed** (confirmed) |
| Explorer truthfulness I07, I18 | **Already fixed** (confirmed) |
| Explorer depth I08–I10, I16–I17 | **Partially fixed** + honesty; residual sklearn depth |
| Explorer We Do policy ratio I11–I12 | **Residual** (not bulk-rewritten) |
| Expert H Spanish | **Fixed** |
| Expert M auto-/flag rate/vs./Disclaimer | **Fixed** |
| Expert L diccionario/tagline/long sentences | **Fixed** (diccionario + jobRelevance) |
| Expert-2 DBSCAN / empty cluster / multi-seed claim | **Fixed** (semantics + honesty + MCQ) |
| Expert-2 full sklearn estimators | **Residual risk** (stdlib contract by design) |
| SQ high meta_todo | **Fixed** (score 8.37 → 9.6) |

### Mechanical validation

| Check | Result |
| --- | --- |
| Theory + iDo code↔output pairs | **17/17 PASS** |
| We Do solutionCode↔output | **24/24 PASS** |
| You Do starter `__main__` | **runs OK** (core_density [False, False, True, True, True]) |
| Spanish quality `--no-lt` | **9.6 / 10** (was 8.37); findings 16 low only (exercise code-style FPs) |
| Residual meta greps (legacy/V3/retarget/print-theater/TODO vacío/sintético gender/auto-hyphen prose) | **CLEAN** |
| Markdown ** in jobRelevance | Platform RichText residual (global) |
| Authenticated seed bank | Inspected key exists; **not edited** (out of hard scope) |

**Explicit statement:**  
No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content. Automation was used only for mechanical validation.

---

## 5. Residual risks and later recommendations

### Section-local
1. **Algorithmic depth vs «Competente a experto»:** stdlib toys remain didactic (PCA fixed weights, single-path IF, k-agreement multi-seed). Acceptable under progressive disclosure if honesty labels stay; optional later lab with optional sklearn sandbox.
2. **We Do E2/E3 policy-print ratio:** still higher than ideal; reduce only with hand-crafted computational transfers (do not bulk-generate).
3. **`hint` === `hints[0]`** on 24 exercises: curriculum-wide schema pattern; deferred.
4. **Hours 19 vs blueprint 12:** product keeps 19 with expanded toys + ethics; still light vs a full unsupervised course — residual honesty of time budget.

### Platform / global
1. **Legacy id / filename** `ai-apis-advanced` — do not migrate without alias plan.
2. **SectionView RichText** markdown asterisks in jobRelevance/callouts — Global Agent A.
3. **seed.ts exam bank** for `'ai-apis-advanced'` — Global Agent D if answer-position audits needed.
4. **hint/hints duplication** — schema-level Fixer pass.

### Adjacent
- S37 should continue the cost/time narrative already promised in the Puente de carrera.
- S39 remains responsible triage integration of these signals.

---

## 6. Updated Graph Memory notes

```yaml
section: 36
id: ai-apis-advanced
title: Clustering, anomalías y validación temporal
fixer_round: 2
status_fixer_r2: complete
spanish_quality_pre: 8.37
spanish_quality_post: 9.6

nodes_strong:
  - scale_before_distance
  - centroid_1d_assign_update
  - density_core_sklearn_include_self
  - empty_cluster_preserves_prev
  - multi_seed_k_agreement_not_ari
  - pca_fixed_weights_exploratory
  - sigma_ref_explicit
  - path_length_if_idea
  - contamination_capacity
  - temporal_backtest_no_leakage
  - precision_at_k_hitl
  - anomaly_neq_misconduct

nodes_resolved_r2:
  - red_andina_gender_agreement
  - fail_closed_idiom
  - auto_compounds_rae
  - dictionary_list_scan
  - meta_todo_wedo_intro
  - selfcheck_multi_seed_coverage

nodes_residual:
  - full_sklearn_kmeans_dbscan_pca_if_lof_practice
  - partition_ari_multi_seed
  - we_do_policy_print_ratio
  - platform_id_ai_apis_advanced

edges:
  - S35_case_card -> S36_auxiliary_signals -> S39_triage
  - S36_signals -> S37_profiling_cost
  - S34_P_at_k -> S36_scarce_label_eval
```

---

## 7. Files changed

| File | Why |
| --- | --- |
| `src/lib/course/sections/s36-ai-apis-advanced.ts` | Only product edit: Spanish, technical honesty, self-check, You Do/I Do density+empty cluster |
| `course-state/curriculum_hardening/audits/fixer_reports/round2/S36_FIXER_REPORT.md` | This report |
| `expert_audit/worklog_entries_r2/S36.md` | Full worklog entry |
| `expert_audit/worklog.md` | Brief FIXER-R2-S36 pointer append |
| `course-state/curriculum_hardening/audits/spanish_quality/S36_SPANISH_QUALITY.json` | Regenerated by validation script |

---

## 8. Worklog confirmation

- Full entry: `expert_audit/worklog_entries_r2/S36.md`
- Pointer appended to: `expert_audit/worklog.md` with Task ID **FIXER-R2-S36**

---

Section 36 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
