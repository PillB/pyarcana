# Ficha de datos: admisión sintética CP-N1-A

Una ficha de datos dice de dónde vienen los datos, para qué sirven y para qué no.

| Campo | Valor |
|---|---|
| Capstone | CP-N1-A, admisión de clientes y calidad de datos |
| Cierra | S04 |
| Fuente | Registros escritos a mano: `RECORDS` en `cp_n1_a.py` y el lote de bordes en `data/generate.py` |
| Datos de personas reales | **Ninguno** |
| Uso previsto | Aprender, mostrar en un portafolio, evaluar el cierre de S04 |
| Uso no previsto | Decisiones legales, de crédito, de fraude o de personal |
| Retención | Viven en tu equipo; no se envían a ningún lado |
| Calidad | Cada registro de `data/generate.py` declara su estado y una prueba lo comprueba |
| Limitaciones | No representa a la población real del Perú ni de ningún mercado |
| Responsable | La persona que hace el curso |

## Campos
`edad`, `region` (cuatro códigos `R-*` inventados), `monto_ingreso` y `raw_line`.

## Controles
- No se registran claves.
- No se llama a servicios externos.
- La salida es determinista: el mismo lote da el mismo resultado.
