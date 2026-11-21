# You Do (Haces tú)

Trabajo independiente.

1. Completa `run()` hasta que pasen las 11 pruebas de `tests/test_demo.py`.
2. Agrega `tasa_review = n_review / n_total` al resultado de `run()`, con `None` para el lote
   vacío, igual que `tasa_reject`. Escribe una prueba para el lote de 4 (`0.5`) y otra para el
   lote vacío (`None`).
3. Agrega a `data/generate.py` un registro para cada borde que todavía no tenga (por ejemplo,
   `edad = 0`) con el estado que dicta `BRIEF.md`, y comprueba que la prueba 11 sigue pasando.

Reto opcional: explica en un comentario por qué `codigo_monto()` comprueba `.is_finite()` antes de
comparar con `< 0`. Pista: prueba `Decimal("NaN") < 0` en la consola (S02 presenta `Decimal`).

## Criterios de éxito
- El código corre desde un entorno limpio, solo con la biblioteca estándar.
- Pasan las pruebas del paquete y las tuyas.
- No hay datos de personas reales ni claves.
- Las limitaciones están escritas en tu entrega.
