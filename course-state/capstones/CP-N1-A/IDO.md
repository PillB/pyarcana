# I Do (Yo demuestro)

El instructor modela el proceso paso a paso en voz alta, con el lote `RECORDS` de `cp_n1_a.py`.

1. Toma el primer registro, `30|R-NORTE|0`: edad 30 → `OK`, región en el catálogo → `OK`,
   monto 0 → `OK`. Estado: `accept`, sin motivos.
2. Toma el segundo, `|R-SUR|10`: la edad falta → `MISSING`, que lleva a `review`. Motivos:
   `["edad:MISSING"]`.
3. Cuenta el lote a mano: 1 `accept`, 2 `review` (sin edad; región `R-FUERA`) y 1 `reject`
   (monto -1). `tasa_reject = 1 / 4 = 0.25`. Luego muestra que `run([])` da `None`, no `0.0`.
