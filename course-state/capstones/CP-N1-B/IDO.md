# I Do (Yo demuestro)

El instructor modela el proceso paso a paso en voz alta, con los archivos de `data/`.

1. Abre `data/clients.csv` y lee la fila `C004,Carla Demo,10,50`. Pregunta cuántas columnas ve
   el lector CSV: cuatro, porque la coma decimal separa. Muestra que va a cuarentena con
   `col_count` y que su `raw` es el texto exacto de la línea.
2. Ejecuta `python3 demo.py` y lee el manifest: `clients.csv` tiene `n_in` 8, `n_clean` 4 y
   `n_quarantine` 4, y 8 = 4 + 4. La línea vacía cuenta en `n_blank_ignored`, no en `n_in`.
3. Cambia un byte de `data/clients.csv` y vuelve a ejecutar: el `sha256` de esa fuente cambia.
   Restaura el archivo con `python3 data/generate.py`.
