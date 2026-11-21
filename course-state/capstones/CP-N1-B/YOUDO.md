# You Do (Haces tú)

Trabajo independiente.

1. Completa `STARTER/cp_n1_b.py` hasta que pasen las 11 pruebas de `tests/test_demo.py`.
2. Agrega una tercera fuente, `data/payments.jsonl` (un objeto JSON por línea, S08 T3-A), con su
   cargador, su entrada en el manifest y una prueba de reconciliación.
3. Agrega a cada fila de `clean` un campo `lineage_id` con la forma `"{fuente}:{record_number}"`
   (por ejemplo, `"clients.csv:1"`), y una prueba de que todos son distintos.

## Criterios de éxito
- El código corre desde un entorno limpio, solo con la biblioteca estándar.
- Pasan las pruebas del paquete y las tuyas.
- No hay datos de personas reales ni claves.
- Las limitaciones están escritas en tu entrega.
