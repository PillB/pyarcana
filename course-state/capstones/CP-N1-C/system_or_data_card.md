# System card — Familiarity Evidence Dashboard

| Campo | Valor |
|---|---|
| Capstone | CP-N1-C — Familiarity Evidence Dashboard |
| Gate | S13 |
| Tipo | System card |
| Propósito | Dashboard de evidencia de familiaridad con ER determinista, geoevidencia trazable, revisión humana y ficha de privacidad — sin inferencia de fraude.… |
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
