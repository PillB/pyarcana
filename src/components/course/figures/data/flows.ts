import type { FigureData } from '../archetypes/types'

export const FLOW_FIGURES: Record<string, FigureData> = {
  // Smoke entry: proves the archetype path renders end to end before the
  // remaining figures are written against it.
  'S09-failfast': {
    kind: 'flow',
    headline: 'Fallar temprano y fallar tarde no cuestan lo mismo',
    stages: [
      { label: 'leer', sub: 'bytes crudos', tint: 3 },
      { label: 'parsear', sub: 'tipos', tint: 3 },
      { label: 'validar', sub: 'reglas', tint: 2 },
      { label: 'decidir', sub: 'accept/reject', tint: 4 },
    ],
    boundaryAfter: 2,
    boundaryLabel: 'aquí ya no puedes cuarentenar la fila',
    outcome: 'Lo que pasa la validación entra al resumen; lo que no, va a cuarentena con su motivo.',
  },
}
