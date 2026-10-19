# Exam key audit — manual review of the heuristic flags

`exam-key-audit.json` flags 24 items whose explanation shares more words with another option than
with the keyed one. Each was read by hand (5 Oct 2026):

| Item | Verdict | Why |
|---|---|---|
| S18 #22 «Para reproducir un EDA, lo prioritario es:» | **wrong key [O]** | Keyed «Un color corporativo exacto»; the explanation («código + datos … + seed/filtros») is option A. |
| S19 #4 «Un encoding visual honesto implica:» | **wrong key [O]** | Keyed «Usar el mismo color para todo sin leyenda»; the explanation is option A. |
| S43 #23 «Debug efímero … es preferible a:» | **likely wrong / ambiguous [I]** | Keyed «Nunca poder diagnosticar»; the explanation («No dejes debug toolkit en prod image») supports option A. Both readings are defensible; the item needs rewording. |
| S04 #12 | key right, explanation wrong [O] | Explanation says «procesados/intentados», the S04 denominator contradiction (see S04). |
| the other 20 | heuristic false positive | Shared words with a distractor that *negates* the explanation (e.g. S41 #1 «Mutante del estado»). |

Distribution facts (computed over all 52 × 24 = 1248 items, not sampled): see `exam-key-audit.json`
→ `key_position` (31 banks are 24/24 at index 1) and `key_is_longest` (19–24 of 24 in every bank).

## Second pass: items keyed B whose option A is longer (46 items)

Read by hand. **11 keys are wrong [O]**: option B is plainly wrong and option A is the answer the
explanation gives:

| Item | Question | Keyed (B) | Right (A) |
|---|---|---|---|
| S18 #22 | Para reproducir un EDA, lo prioritario es: | Un color corporativo exacto | Dependencias/seed/filtros versionados y script reejecutable |
| S19 #4 | Un encoding visual honesto implica: | Usar el mismo color para todo sin leyenda | Mapear variables a canal visual sin distorsión… |
| S21 #11 | Antes de “parsear tablas” de un PDF, conviene: | Borrar metadatos siempre | Clasificar si hay texto real o solo bitmap |
| S42 #16 | Fijar versiones de dependencias ayuda a: | Que pip elija al azar cada deploy | Reproducibilidad y control de supply chain |
| S43 #10 | Readiness falla cuando: | El logo no cargó | La app está up pero dependencias críticas aún no (DB) |
| S44 #5 | Condiciones if: en jobs evitan: | Tener tests | Correr deploys en cada push a feature sin control |
| S44 #13 | Separar secrets por environment evita: | Tener staging | Usar el secret de prod en PRs de forks sin control |
| S45 #17 | Roles temporales (OIDC) son preferibles a: | MFA de humanos | Access keys de larga vida en CI |
| S46 #2 | Una ventana tumbling de 5 min agrupa: | Siempre todo el histórico | Eventos en intervalos fijos no solapados |
| S48 #8 | Deduplicar chunks cercanos reduce: | La necesidad de embeddings | Diversidad inútil de near-duplicates en el contexto |
| S50 #23 | Presupuesto de costo por 1k requests se monitorea para: | Reemplazar authz | Sorpresas de factura y abuso |

S43 #23 is ambiguous (above). The other 34 are keyed correctly (B is the right answer and A a long
distractor). [I] The pattern (right answer in position A, key forced to 1, explanation in clipped
English) suggests a bulk edit that set `correctIndex: 1` without moving the options. This search
finds only wrong keys whose A option is longer than B, so **11 is a floor**, not a count.
