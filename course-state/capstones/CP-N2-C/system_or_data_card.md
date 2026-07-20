# System card — VP RPA + AI Analyst

| Campo | Valor |
|---|---|
| Capstone | CP-N2-C — VP RPA + AI Analyst |
| Gate | S26 |
| Tipo | System card |
| Propósito | Orquestación RPA/IA sintética de extremo a extremo con aprobación humana, borrador de correo y rollback — lista para demo de portafolio.… |
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
