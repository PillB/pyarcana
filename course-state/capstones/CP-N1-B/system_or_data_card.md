# Ficha de datos: ETL sintético CP-N1-B

Una ficha de datos dice de dónde vienen los datos, para qué sirven y para qué no.

| Campo | Valor |
|---|---|
| Capstone | CP-N1-B, ETL local de clientes y transacciones |
| Cierra | S08 |
| Fuente | `data/clients.csv` y `data/transactions.json`, escritos por `data/generate.py` con valores fijos |
| Datos de personas reales | **Ninguno** |
| Uso previsto | Aprender, mostrar en un portafolio, evaluar el cierre de S08 |
| Uso no previsto | Decisiones legales, de crédito, de fraude o de personal |
| Retención | Viven en tu equipo; no se envían a ningún lado |
| Calidad | Cada fila irregular tiene un motivo esperado, y una prueba comprueba los conteos |
| Limitaciones | 16 registros; no representa a la población real del Perú ni de ningún mercado |
| Responsable | La persona que hace el curso |

## Campos
`clients.csv`: `id`, `nombre`, `monto`. `transactions.json`: `id`, `client_id`, `monto`. Los
montos son texto decimal.

## Controles
- No se registran claves.
- No se llama a servicios externos.
- Repetir la corrida da los mismos `clean`, `quarantine` y `sources`.
