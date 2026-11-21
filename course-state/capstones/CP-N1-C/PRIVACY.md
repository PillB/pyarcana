# Requisitos de privacidad

Todos los datos son sintéticos: no recopila datos de personas reales. La hoja de privacidad va
dentro de cada paquete (`privacy_sheet`): clase de datos `synthetic_only`, `pii_real: False`,
solo la ciudad y el país saldrían hacia un geocodificador público, y dos roles, `viewer` y
`reviewer`.

- La cola de revisión muestra seudónimos (`A*** Q***`).
- Cada decisión guarda su `rules_version` y lo que faltaba, así se sabe con qué reglas se tomó.
- Una corrección se anota con su motivo en `corrections`; no borra la decisión anterior, que
  queda en el paquete original.
