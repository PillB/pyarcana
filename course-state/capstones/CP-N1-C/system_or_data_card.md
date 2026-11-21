# Ficha de datos: caso sintético CP-N1-C

Una ficha de datos dice de dónde vienen los datos, para qué sirven y para qué no.

| Campo | Valor |
|---|---|
| Capstone | CP-N1-C, tablero de evidencia de familiaridad |
| Cierra | S13 y el Nivel 1 |
| Fuente | `data/case.json`, escrito por `data/generate.py` con valores fijos |
| Datos de personas reales | **Ninguno** |
| Uso previsto | Aprender, mostrar en un portafolio, evaluar el cierre de S13 |
| Uso no previsto | Decisiones legales, de crédito, de fraude, de parentesco o de personal |
| Retención | Viven en tu equipo; no se envían a ningún lado |
| Calidad | Cada par del caso tiene un estado esperado, y las pruebas comprueban los conteos |
| Limitaciones | 12 personas y 66 pares; los pesos y cortes son de enseñanza, no calibrados |
| Responsable | La persona que hace el curso |

## Campos
`id`, `name`, `document_id`, `region`, `phone` y `coords` (`[lat, lon]`). Algunos valen `null`
a propósito: un campo ausente no es evidencia.

## Controles
- No se registran claves.
- No se llama a servicios externos.
- El mismo caso da siempre el mismo paquete.
- Ninguna salida tiene `auto_fraud` ni `is_family`.
