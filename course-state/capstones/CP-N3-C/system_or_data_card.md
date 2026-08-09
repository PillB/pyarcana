# Model card — Responsible ML Case Triage

| Campo | Valor |
|---|---|
| Capstone | CP-N3-C — Responsible ML Case Triage |
| Gate | S39 |
| Tipo | Model card (triage sintético) |
| Intended use | Priorizar **casos sintéticos** para revisión humana de operaciones |
| Out-of-scope | Detección de fraude real, scoring crediticio, vigilancia |
| Training data | Labels sintéticos generados en demo |
| Métricas | Accuracy/proxy + tasa de abstención |
| Fairness | Demo reporta tasas por segmento sintético sin claims de equity real |
| Human oversight | Banda de abstención → cola humana |
| Monitoring | Proxy de drift / tasa de abstención en métricas JSON |
| Limitaciones | Modelo toy; no calibrado para producción real |

## Ética
Coincidencias o scores **no** equivalen a culpabilidad, parentesco o colusión.
