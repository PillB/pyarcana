import type { FigureData } from '../archetypes/types'

/**
 * Stress entries: one per archetype, with deliberately hostile data.
 *
 * Long headlines, long notes, the maximum row count each shape supports. They
 * exist so the render probe measures the worst case an author can produce
 * before seventy-seven real figures are written against these shapes -- the
 * first archetype figure clipped its closing line at every viewport, and that
 * is the cheapest possible moment to find the next one.
 */
export const MISC_FIGURES: Record<string, FigureData> = {
  'ZZ-stress-decision': {
    kind: 'decision',
    headline: 'Un titular deliberadamente largo que obliga a envolver en al menos dos líneas para probar el desplazamiento vertical',
    input: 'registro',
    branches: [
      { test: 'no es numérico o está fuera de [0,1]', result: 'invalid_input', tint: 5 },
      { test: 'uncertainty == "high"', result: 'needs_review', tint: 4 },
      { test: 'score < 0.40', result: 'abstain', tint: 3 },
      { test: 'score < 0.80', result: 'needs_review', tint: 4 },
      { test: 'resto', result: 'accept', tint: 2 },
    ],
    note: 'El orden es la semántica: las mismas condiciones en otra secuencia clasifican distinto el mismo registro, y por eso la primera que coincide gana.',
  },
  'ZZ-stress-stack': {
    kind: 'stack',
    headline: 'Capas de una imagen, de la más estable a la que cambia en cada commit',
    layers: [
      { label: 'base pinned por digest', sub: 'python:3.12-slim@sha256', tint: 1 },
      { label: 'dependencias del sistema', tint: 1 },
      { label: 'requirements.txt', sub: 'cambia al añadir una librería', tint: 3 },
      { label: 'código de la aplicación', sub: 'cambia cada commit', tint: 4 },
    ],
    volatileFrom: 2,
    note: 'Copiar el código antes que las dependencias invalida la caché en cada commit y vuelve a resolver pip cada vez.',
  },
  'ZZ-stress-bars': {
    kind: 'bars',
    headline: 'Dónde se va realmente el tiempo del job',
    max: 100,
    bars: [
      { label: 'leer del disco', value: 8, tint: 3, display: '8%' },
      { label: 'parsear JSON', value: 64, tint: 5, display: '64%' },
      { label: 'calcular features', value: 21, tint: 2, display: '21%' },
      { label: 'escribir salida', value: 7, tint: 3, display: '7%' },
    ],
    note: 'Optimizar el cálculo antes de medir habría atacado el 21% y dejado intacto el 64%.',
  },
  'ZZ-stress-set': {
    kind: 'set',
    headline: 'Lo que tus pruebas de ejemplo nunca generan',
    universeLabel: 'todas las entradas posibles',
    regions: [
      { label: 'property-based', sub: 'genera bordes que no imaginaste', tint: 2 },
      { label: 'basadas en ejemplos', sub: 'los casos que se te ocurrieron', tint: 4 },
    ],
    note: 'El margen que queda fuera es donde viven los fallos de producción.',
  },
  'ZZ-stress-table': {
    kind: 'table',
    headline: 'Los mismos valores en dos disposiciones',
    left: { title: 'wide', head: ['region', 'ene', 'feb'], rows: [['Lima', '60', '55'], ['Cusco', '10', '12']], tint: 2 },
    right: { title: 'long', head: ['region', 'mes', 'monto'], rows: [['Lima', 'ene', '60'], ['Lima', 'feb', '55'], ['Cusco', 'ene', '10'], ['Cusco', 'feb', '12']], tint: 4 },
    forward: 'melt',
    backward: 'pivot',
    note: 'Reshape no calcula nada: mueve dónde vive cada valor, y eso decide si groupby te sirve.',
  },
  'ZZ-stress-timeline': {
    kind: 'timeline',
    headline: 'El reintento y la ventana en la que el efecto ya ocurrió',
    from: 0,
    to: 100,
    axisLabel: 'tiempo',
    boundaryAt: 60,
    boundaryLabel: 'checkpoint escrito',
    graceWidth: 15,
    graceLabel: 'ventana de riesgo',
    events: [
      { at: 20, label: 'envío', sub: 'efecto remoto aplicado', tint: 3 },
      { at: 50, label: 'crash', sub: 'antes de anotar', tint: 5 },
      { at: 80, label: 'reintento', sub: 'lo envía otra vez', tint: 4 },
    ],
    note: 'El checkpoint ahorra trabajo; lo que evita el duplicado es que el paso sea repetible.',
  },
  'ZZ-stress-graph': {
    kind: 'graph',
    headline: 'Una entidad, sus cuentas y el contacto que comparten',
    nodes: [
      { id: 'e1', label: 'Ana Q.', sub: 'caso', tint: 4, col: 0, row: 0 },
      { id: 'a1', label: 'cuenta 1', tint: 1, col: 1, row: 0 },
      { id: 'a2', label: 'cuenta 2', tint: 1, col: 2, row: 0 },
      { id: 'e2', label: 'Luis M.', sub: 'entidad', tint: 2, col: 3, row: 0 },
      { id: 'ph', label: 'ph:900', sub: 'contacto', tint: 3, col: 1, row: 1 },
      { id: 'e3', label: 'Marta R.', sub: 'entidad', tint: 2, col: 2, row: 1 },
    ],
    edges: [
      { from: 'e1', to: 'a1', label: 'owns' },
      { from: 'a1', to: 'a2', label: 'transfer' },
      { from: 'a2', to: 'e2', label: 'owns' },
      { from: 'e1', to: 'ph', label: 'has_phone' },
      { from: 'ph', to: 'e3', label: 'has_phone' },
      { from: 'e1', to: 'e3', label: 'shared_phone', derived: true },
    ],
    note: 'Un camino explica cómo dos entidades están conectadas en los datos; no prueba parentesco ni colusión.',
  },
}
