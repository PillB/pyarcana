# I Do (Yo demuestro)

El instructor modela el proceso paso a paso en voz alta, con `data/case.json`.

1. Muestra P01 y P02: `D-1001` y `d1001` son el mismo documento, y los dos bloques son
   `quispe|lima`. El ER es 1.0 y el estado `accept_pair`. Muestra que el paquete no dice nada más
   de ellas.
2. Muestra P04 y P05: el mismo nombre en el mismo lugar, pero P05 no tiene documento. El ER es
   `None` y el estado `invalid_input`. Pregunta por qué no es 0.0.
3. Ejecuta `python3 demo.py` y lee la cola clerical: seudónimos, `evidence_score` y
   `uncertainty`. Muestra la hoja de privacidad en la línea `METRICS_JSON`.
