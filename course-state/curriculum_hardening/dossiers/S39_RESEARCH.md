# Research dossier — S39 Responsible ML Case Triage & Level close

**Section file:** `s39-integrator-phase2.ts`  
**Residual:** STUB (avg_para≈78, avg_instr≈21)  
**Target:** gold vs S01/S02 pedagogy + S40 contract style  

## Competitive sources

| Class | Named sources & takeaways |
|-------|---------------------------|
| Coursera | *Machine Learning Engineering for Production (MLOps) Specialization* (DeepLearning.AI) — human review queues, monitoring, continuous delivery of models |
| Stanford | CS329S *Machine Learning Systems Design* — case studies on deployment risk, documentation, human oversight |
| MIT | MIT OpenCourseWare / Responsible AI discussions — uncertainty, documentation, audit trails |
| Harvard | Harvard Kennedy / Berkman Center AI governance primers — procedural fairness, documentation of decisions |
| Yale | ISPS / ethics of algorithms reading groups — transparency vs black-box decisions (conceptual) |
| GitHub | `ethicalml/awesome-production-machine-learning`; Google model cards; Microsoft Responsible AI Toolbox (HITL patterns) |
| Video | Made With ML production series; Full Stack Deep Learning lectures on monitoring + human review |

## Coverage gaps in current stub
- Theory paragraphs are 1-line slogans; need operational contracts (inputs, outputs, errors, promotion criteria).
- Exercises are ultra-short instructions; need CASO-PE fixtures, exact pass strings, adverse paths.
- Missing: evidence packet structure, CF-3 separation from CF-1/2, abstention/human_only, rollback when policy breach.

## Expansion plan
1. Deepen each of 9 theory blocks to ≥3 paragraphs (~200–350 chars each) with Peru synthetic case.
2. Expand 24 weDo instructions to ≥150 chars with domain predicates.
3. Enrich starters with fixtures + one defect; keep progressive disclosure (no S40+ APIs).
4. Preserve selfCheck stems; strengthen explanations if thin.
