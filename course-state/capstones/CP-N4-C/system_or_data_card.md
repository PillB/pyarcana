# System card — Auditable AI Operations Copilot

| Campo | Valor |
|---|---|
| Capstone | CP-N4-C — Auditable AI Operations Copilot |
| Gate | S51 |
| Tipo | System card |
| Propósito | Copiloto de operaciones AI auditable con tool policies, evals, human-in-the-loop y traza completa — sin LLM de pago requerido.… |
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
