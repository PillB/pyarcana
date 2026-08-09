# System card — Governed Python Service Platform

| Campo | Valor |
|---|---|
| Capstone | CP-N4-A — Governed Python Service Platform |
| Gate | S43 |
| Tipo | System card |
| Propósito | Plataforma de servicio Python gobernada con contrato versionado, auth mock y suite de contract tests en un solo demo.py.… |
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
