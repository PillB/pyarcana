# Cómo ejecutar

```bash
python3 tests/test_demo.py   # prueba TU STARTER/cp_n1_c.py; al principio fallan las 11 pruebas
python3 demo.py              # ejecuta la solución de referencia sobre data/case.json
python3 data/generate.py     # vuelve a escribir data/case.json
```

Para ver el paquete de tu propio código:

```bash
python3 -c "import sys, json; sys.path.insert(0, 'STARTER'); import cp_n1_c; p = cp_n1_c.review(json.load(open('data/case.json'))); print(p.review_queue)"
```

Para probar la referencia en lugar de tu archivo (lo hace la integración continua):

```bash
CAPSTONE_TARGET=reference python3 tests/test_demo.py
```

Requisitos: Python 3.10 o posterior. Solo la biblioteca estándar. Sin claves, sin red y sin datos
de personas reales.
