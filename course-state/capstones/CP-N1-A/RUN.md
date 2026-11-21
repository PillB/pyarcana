# Cómo ejecutar

```bash
python3 tests/test_demo.py   # prueba TU STARTER/cp_n1_a.py; al principio fallan las 11 pruebas
python3 demo.py              # ejecuta la solución de referencia: imprime METRICS_JSON y sale con 0
python3 data/generate.py     # muestra el lote sintético con el estado esperado de cada registro
```

Para probar la referencia en lugar de tu archivo (lo hace la integración continua):

```bash
CAPSTONE_TARGET=reference python3 tests/test_demo.py
```

Requisitos: Python 3.10 o posterior. Solo la biblioteca estándar. Sin claves, sin red y sin datos
de personas reales.
