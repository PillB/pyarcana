# Research dossier — S19 Visualización y comunicación accesible

**Section file:** `src/lib/course/sections/s19-databases-orm.ts`  
**Platform id (preserved):** `databases-orm`  
**V3 title:** Visualización y comunicación accesible  
**Residual before:** PARTIAL (avg_para≈106.6, avg_instr≈73.4, thin≈0.3, score 5)  
**Target:** gold vs S01/S02 pedagogy + S16/S17 depth; **dashboard ejecutivo CP-N2-B**

## Competitive sources

| Class | Named sources & takeaways |
|-------|---------------------------|
| Docs | Matplotlib cheatsheets; Seaborn tutorial; WCAG 2.2 contrast basics for charts |
| Book | Cairo *The Truthful Art*; Few *Show Me the Numbers* — baseline zero, dual-axis risks |
| Coursera | IBM Data Visualization with Python; University of Michigan plotting courses |
| Stanford/Yale | CS448B Data Vis (Stanford) principles; Yale/Tufte-inspired integrity rules in teaching notes |
| GitHub | matplotlib/matplotlib galleries; accessibility-alt-text patterns for charts |
| Video | Storytelling with Data channel; Corey Schafer matplotlib series |

## Coverage gaps in current partial
- Visual inflation and claim gates thin; tooltips/parity under-specified; instructions lacked pass contracts.
- Progressive disclosure: matplotlib/seaborn; plotly modeled as spec if absent; sin SQLAlchemy/ORM.
- ES-PE workplace voice; synthetic Lima/Cusco/Arequipa; no real PII; fail-closed / no-fraud-from-scores.

## Expansion plan
1. Deepen 9 theory blocks to 3 paragraphs (~250+ chars) with *why*, *contract*, Peru synthetic case.
2. Expand 24 weDo instructions to ≥150 chars: concept, fixture id, I/O, exact pass string.
3. Enrich thin starters with solution fixtures + single TODO; keep solution oracles.
4. Add 5th selfCheck MCQ on operational/governance failure mode.
5. DONE note + metric recompute (avg_para≥250, avg_instr≥150, thin_para_ratio(<120)≤0.2).
