# Requisitos de uso responsable

El programa decide solo qué hacer con un **par** de registros: unirlos, no unirlos, mandarlos a
una persona o apartarlos porque falta evidencia. Nunca decide nada sobre una persona. Una señal
de relación alta, como la de cuatro compañeros que comparten la centralita de la oficina, no dice
que sean familia ni que se conozcan.

Los pesos (0.5, 0.3, 0.2 y 0.6/0.4) y los cortes (0.40 y 0.80) son valores de enseñanza de S13.
No están calibrados con datos etiquetados: con datos reales habría que medir sus falsos positivos
antes de usarlos.

## Lo que este proyecto NO hace
- No toma decisiones sobre personas ni decisiones de riesgo: `risk_decisions` siempre está vacío.
- No infiere fraude, parentesco, colusión, asociación criminal, propiedad beneficiaria ni
  relaciones causales: `kinship_verdict` siempre es `None`.
- No presenta una asociación como si fuera una causa.
