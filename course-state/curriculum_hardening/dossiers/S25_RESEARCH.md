# Research dossier — S25 Endpoints de IA, Hugging Face y prompting evaluado

**Section file:** `s25-streamlit-dashboards.ts`  
**Residual (before):** PARTIAL (avg_para≈101.8, avg_instr≈48.9, thin_para_ratio=0.89)  
**Target:** gold vs S01/S02 pedagogy + domain contracts for AI assist evaluado con schema/golden (CP-N2-C)

## Competitive sources

| Class | Named sources & takeaways |
|-------|---------------------------|
| Coursera | DeepLearning.AI *ChatGPT Prompt Engineering*; Hugging Face *NLP Course* pipelines |
| MIT | MIT AI alignment / eval primers — golden sets, human review gates |
| Stanford | CS224N / HELM-style evaluation themes — schema, metrics, bias notes |
| Harvard | CS50 AI / productization — model cards and license awareness |
| Yale | Digital ethics — injection, exfiltration, minimization of sensitive fields |
| GitHub | huggingface/transformers pipeline examples; guardrails / json-schema validation patterns |
| Video | HF course videos; OpenAI prompt engineering guides (structured outputs) |

## Coverage gaps in current partial
- Theory paragraphs average ~101.8 chars (target ≥250) with thin_para_ratio=0.89.
- weDo instructions average ~48.9 chars (target ≥150) without explicit I/O contracts / pass strings.
- Need synthetic Peru cases (`CASO-LIM-025`, run_id=cpn2c-ai, @example.pe) and fail-closed language.

## Expansion plan
1. Deepen each theory block to ≥3 paragraphs averaging ≥250 chars with why + contract + Peru synthetic case.
2. Expand 24 weDo instructions to ≥150 chars with domain predicates and exact pass references.
3. Preserve TypeScript structure, solution outputs, selfCheck, and progressive disclosure (S01…S25 only).
4. Ethics: scores/graphs/matches never auto-label fraud or kinship; human review where decisions affect people.
