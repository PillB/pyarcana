# Requisitos de privacidad

Todos los datos son sintéticos: no recopila datos de personas reales.

- El manifest guarda hashes y conteos, no los valores de las filas.
- Cada fila de cuarentena guarda su `raw` y su `record_number`, así se sabe de qué archivo y de
  qué registro viene.
- Si un dato está mal, se corrige en la fuente y se vuelve a ejecutar la corrida; el programa no
  edita las fuentes.
