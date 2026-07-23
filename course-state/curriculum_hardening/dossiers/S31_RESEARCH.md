# Research dossier — S31 Grafos y evidencia relacional

**Section file:** `s31-streaming-data.ts`  
**Residual (before):** PARTIAL (avg_para≈123.1, avg_instr≈103.7, thin_para_ratio=0.89)  
**Target:** gold vs S01/S02 pedagogy + domain contracts for grafos temporales con evidencia por arista (inicio CP-N3-B)

## Competitive sources

| Class | Named sources & takeaways |
|-------|---------------------------|
| Coursera | Stanford/University of California *Social Network Analysis* themes; IBM *AI Engineering* modules on entity graphs for risk review (human-in-the-loop) |
| MIT | MIT OCW *Networks* / 6.207 themes — paths, degree, components; temporal edges as event streams |
| Stanford | CS224W graph ML primers (conceptual: centrality ≠ label); entity resolution + graph evidence patterns |
| Harvard | CS109 / network analysis labs — multigraph aggregation without dropping source ids |
| Yale | SOM ops / investigation case framing — evidence trails, auditability of conclusions |
| GitHub | NetworkX tutorials (degree, connected_components, shortest_path); Neo4j Cypher path examples (conceptual) |
| Video | PyData talks on NetworkX for fraud *investigation* (not auto-adjudication); DDIA chapters on graph-shaped data |

## Coverage gaps in current partial
- Theory paragraphs average ~123.1 chars (target ≥250) with thin_para_ratio=0.89.
- weDo instructions average ~103.7 chars (target ≥150) without explicit I/O contracts / pass strings.
- Need synthetic Peru cases (`CASO-LIM-031`, run_id=cpn3b-01, @example.pe) and fail-closed language.

## Expansion plan
1. Deepen each theory block to ≥3 paragraphs averaging ≥250 chars with why + contract + Peru synthetic case.
2. Expand 24 weDo instructions to ≥150 chars with domain predicates and exact pass references.
3. Preserve TypeScript structure, solution outputs, selfCheck, and progressive disclosure (S01…S31 only).
4. Ethics: scores/graphs/matches never auto-label fraud or kinship; human review where decisions affect people.
