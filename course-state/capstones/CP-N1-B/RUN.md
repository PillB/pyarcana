# Cómo ejecutar

```bash
python3 tests/test_demo.py   # prueba TU STARTER/cp_n1_b.py; al principio fallan las 11 pruebas
python3 demo.py              # ejecuta la solución de referencia sobre data/ e imprime METRICS_JSON
python3 data/generate.py     # vuelve a escribir data/clients.csv y data/transactions.json
```

Para ver las salidas de tu propio ETL, ejecútalo sobre una carpeta tuya:

```bash
python3 -c "import sys; sys.path.insert(0, 'STARTER'); import cp_n1_b; print(cp_n1_b.run('data', 'out'))"
```

Luego abre `out/manifest.json`, `out/clean/` y `out/quarantine/`. La carpeta `out/` es tuya; no
la subas al repositorio.

Para probar la referencia en lugar de tu archivo (lo hace la integración continua):

```bash
CAPSTONE_TARGET=reference python3 tests/test_demo.py
```

Requisitos: Python 3.10 o posterior. Solo la biblioteca estándar. Sin claves, sin red y sin datos
de personas reales.
