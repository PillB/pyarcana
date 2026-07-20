# System card — Insights Dashboard & Reporting Factory

| Campo | Valor |
|---|---|
| Capstone | CP-N2-B — Accessible Insights Dashboard & Reporting Factory |
| Gate | S21 |
| Tipo | System card |
| Propósito | Reporting factory que produce un informe accesible y trazable a partir de métricas sintéticas, con checklist a11y y JSON de calidad.… |
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
