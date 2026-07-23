# Research dossier — S35 Explicabilidad, equidad e incertidumbre

**Section file:** `s35-system-design.ts`  
**Residual (before):** STUB (avg_para≈75, avg_instr≈25, score=3)  
**Target:** gold vs S01/S02 pedagogy + S40 contract style  
**Legacy id:** `system-design` (conservado) · **V3 tema:** ficha de caso CP-N3-C

## Competitive sources

| Class | Named sources & takeaways |
|-------|---------------------------|
| Coursera | *AI Ethics* (U. of Helsinki / edX); *Responsible AI* (DeepLearning.AI short courses) — documentation, human oversight, harm assessment |
| Stanford | CS329S *Machine Learning Systems Design* — model cards, monitoring, human review; HAI research on interpretability limits |
| MIT | MIT Schwarzman College / Responsible AI reading groups — uncertainty communication; OCW probabilistic systems framing |
| Harvard | Berkman Klein Center AI governance primers — contestability, procedural fairness, documentation of decisions |
| Yale | ISPS / ethics of algorithms discussions — transparency vs black-box; when explanation does not equal justice |
| GitHub | Google model cards (`modelcards`); Microsoft Responsible AI Toolbox; `interpretml/InterpretML`; `slundberg/shap` (conceptual use only) |
| Video | Christoph Molnar *Interpretable ML* talks; Full Stack Deep Learning on monitoring + human review; Google PAIR explainer materials |

## Coverage gaps in current stub
- Theory paragraphs are 1-line slogans; need operational contracts (inputs, outputs, errors, promotion criteria).
- Exercises ultra-short; need CASO-LIM-035 fixtures, exact pass strings, adverse + missing paths.
- Missing: four-layer case card, OOD abstention vs auto-label, override audit fields, model card out_of_scope.

## Domain contracts (section-specific)
| Subtopic | Evidence artifact | Breach code | Missing code |
|----------|-------------------|-------------|--------------|
| T1-A perm importance | ranked drops without causal claim | `REJECT_CAUSAL_CLAIM` | `REQUEST_METRIC_DROP` |
| T1-B local explanation | 4-layer flags (evidence/model/uncertainty/human) | `REJECT_CAUSAL_CLAIM` | `REQUEST_LAYER_FIELDS` |
| T2-A slices | n + metric per cohort | `REJECT_LOW_N_CLAIM` | `REQUEST_SLICE_N` |
| T2-B proxies | high-risk proxy list + mitigate action | `REJECT_PROXY_FEATURE` | `REQUEST_PROXY_AUDIT` |
| T3-A intervals | toy interval + coverage label | `REJECT_POINT_ONLY` | `REQUEST_INTERVAL` |
| T3-B OOD | z-score gate → abstain | `REJECT_AUTO_LABEL` | `REQUEST_OOD_POLICY` |
| T4-A model card | required keys + out_of_scope | `REJECT_SCOPE_BREACH` | `REQUEST_CARD_KEYS` |
| T4-B governance | lifecycle + override audit | `REJECT_SILENT_OVERRIDE` | `REQUEST_AUDIT_FIELDS` |

## Expansion plan
1. Deepen 9 theory blocks to ≥3 paragraphs (≥180 chars; target ~220–320) with Peru synthetic case `CASO-LIM-035`.
2. Expand 24 weDo instructions to ≥150 chars (target ~380–420) with domain predicates.
3. Enrich starters with fixtures + one defect; keep pure-Python progressive disclosure (no S36+ APIs).
4. Preserve selfCheck count (4); strengthen explanations.
5. Honest solutions aligned with iDo demo contracts.
