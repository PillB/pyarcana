# Requisitos de accesibilidad

La salida es texto: `demo.py` imprime una línea `METRICS_JSON` y una línea por par de la cola
clerical, con su `pair_id`, los seudónimos, el `evidence_score` y la `uncertainty`.

- Cada estado se nombra en texto (`needs_review`, `abstain`, ...), nunca solo con un color.
- La explicación de cada par son tres viñetas de texto: ER, relación y lo que falta.
- Si construyes un tablero gráfico a partir del paquete, debe poder usarse con teclado y no
  depender del color para mostrar un estado. Este paquete no trae ese tablero.
