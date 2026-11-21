# You Do (Haces tú)

Trabajo independiente.

1. Completa `STARTER/cp_n1_c.py` hasta que pasen las 11 pruebas de `tests/test_demo.py`.
2. Mide falsos positivos. Etiqueta a mano seis pares de `data/case.json` como "misma persona" o
   "distinta", y escribe en un comentario por qué: P01-P02, P01-P03, P02-P03, P01-P12, P07-P08 y
   P04-P05. Escribe una función que calcule la precision y el recall (S13 T1-B) de la regla
   "ER ≥ 0.5 es la misma persona" contra tus etiquetas, sin contar los pares con ER `None`, y una
   prueba con el resultado que calculaste a mano.
3. Agrega una señal de cercanía a una zona (una cerca geográfica): `in_zone(coords, centro,
   radio_km)`. Muéstrala en la capa de relación con su nombre, sin cambiar la fórmula de la
   regla 2, y escribe en tu entrega qué **no** dice: estar en la misma zona no dice que dos
   personas se conozcan.

## Criterios de éxito
- El código corre desde un entorno limpio, solo con la biblioteca estándar.
- Pasan las pruebas del paquete y las tuyas.
- No hay datos de personas reales ni claves.
- Las limitaciones están escritas en tu entrega.
