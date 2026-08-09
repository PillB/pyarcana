# System card — Relationship Investigation Workbench

| Campo | Valor |
|---|---|
| Capstone | CP-N3-B — Relationship Investigation Workbench |
| Gate | S34 |
| Tipo | System card |
| Propósito | Workbench de investigación relacional con grafo, path finding y controles de minimización — demo sintética para CV.… |
| Datos | Sintéticos únicamente |
| Interfaces | Ver demo y acceptance_criteria en `gate.json` |
| Seguridad | Sin secretos reales; auth mock donde aplique |
| Privacidad | Minimización; no PII real |
| Human-in-the-loop | Requerido en decisiones sensibles |
| Observabilidad | Métricas JSON + estados auditables en demo |
| Rollback / recovery | Simulado cuando el diseño del capstone lo exige |
| Limitaciones | Demo pedagógica; no es despliegue enterprise real |

## No-go
- Inferencia automática de fraude/parentesco.
- Envío de datos reales a proveedores públicos.
- Afirmar impacto de negocio no medido.
