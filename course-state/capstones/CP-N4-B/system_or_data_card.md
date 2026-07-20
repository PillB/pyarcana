# System card — Production Data/ML Platform

| Campo | Valor |
|---|---|
| Capstone | CP-N4-B — Production Data/ML Platform |
| Gate | S47 |
| Tipo | System card |
| Propósito | Plataforma Data/ML de producción simulada con registry, serving gate y rollback — evidencia de operaciones reproducibles.… |
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
