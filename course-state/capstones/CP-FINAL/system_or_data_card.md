# System card — Enterprise Relationship & Ops Intelligence

| Campo | Valor |
|---|---|
| Capstone | CP-FINAL — Enterprise Relationship & Operations Intelligence Platform |
| Gate | S52 |
| Tipo | System card |
| Propósito | Integración reproducible de los 12 capstones con smoke de evidencia, arquitectura, métricas y system card para portfolio máster.… |
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
