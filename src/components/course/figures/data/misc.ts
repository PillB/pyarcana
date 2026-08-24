import type { FigureData } from '../archetypes/types'

/**
 * Everything that is not a pipeline or a graph.
 *
 * The ZZ- entries at the end are stress fixtures, deliberately hostile: longest
 * headline, longest note, maximum rows. They are not attached to any section.
 * They exist so a change to an archetype can be measured against the worst case
 * an author can produce — the first archetype figure clipped its closing line at
 * every viewport, and four of the eight shapes were broken the first time these
 * ran.
 */
export const MISC_FIGURES: Record<string, FigureData> = {
  // ---------------------------------------------------------------- decision
  'S03-truthiness': {
    kind: 'decision',
    headline: 'Qué es falso en un if, y por qué eso no significa «ausente»',
    input: 'valor',
    branches: [
      { test: 'valor is None', result: 'ausente', tint: 4 },
      { test: 'valor == 0', result: 'presente, vale cero', tint: 2 },
      { test: 'valor == ""', result: 'presente, vacío', tint: 2 },
      { test: 'resto', result: 'presente', tint: 2 },
    ],
    note: 'Un if desnudo funde las tres primeras ramas en una. Por eso la ausencia se pregunta con `is None`, nunca con truthiness.',
  },
  'S12-retry-or-not': {
    kind: 'decision',
    headline: 'No todo fallo merece un reintento',
    input: 'respuesta',
    branches: [
      { test: 'timeout o error de red', result: 'retry con backoff', tint: 2 },
      { test: 'status 429', result: 'retry, respeta Retry-After', tint: 2 },
      { test: 'status 5xx', result: 'retry acotado', tint: 3 },
      { test: 'status 4xx de negocio', result: 'DLQ, no reintentes', tint: 5 },
    ],
    note: 'Reintentar un 400 solo repite el mismo error más rápido y castiga al proveedor.',
  },
  'S34-threshold-bands': {
    kind: 'decision',
    headline: 'El umbral no decide solo: la incertidumbre entra antes',
    input: 'score, unc',
    branches: [
      { test: 'score inválido o unc desconocida', result: 'invalid_input', tint: 5 },
      { test: 'unc == "high"', result: 'needs_review', tint: 4 },
      { test: 'score < 0.40', result: 'abstain', tint: 3 },
      { test: 'score < 0.80', result: 'needs_review', tint: 4 },
      { test: 'resto', result: 'accept', tint: 2 },
    ],
    note: 'La segunda guarda gana sobre cualquier score: 0.95 con incertidumbre alta sigue yendo a revisión.',
  },
  'S16-null-policy': {
    kind: 'decision',
    headline: 'Un nulo no significa lo mismo en cada campo',
    input: 'campo nulo',
    branches: [
      { test: 'política == "required"', result: 'cuarentena o fail', tint: 5 },
      { test: 'optional y rate > cap', result: 'blocked, no rellenes', tint: 4 },
      { test: 'optional y rate ≤ cap', result: 'imputar + was_null', tint: 2 },
    ],
    note: 'El cap decide cuánto nulo tolera un optional; nunca convierte un required en imputable.',
  },

  // ---------------------------------------------------------------- timeline
  'S38-retry-window': {
    kind: 'timeline',
    headline: 'La ventana entre el efecto y su registro',
    from: 0, to: 100, axisLabel: 'tiempo',
    boundaryAt: 60, boundaryLabel: 'checkpoint escrito',
    graceWidth: 40, graceLabel: 'aquí el efecto existe y nadie lo sabe',
    events: [
      { at: 20, label: 'envío', sub: 'el efecto ya ocurrió', tint: 3 },
      { at: 50, label: 'crash', sub: 'antes de anotar', tint: 5 },
      { at: 85, label: 'reintento', sub: 'lo repite', tint: 4 },
    ],
    note: 'El checkpoint ahorra trabajo. Lo que evita el duplicado es que el paso sea repetible sin consecuencia.',
  },
  'S45-backup-cadence': {
    kind: 'timeline',
    headline: 'La cadencia del respaldo es lo que acota el RPO',
    from: 0, to: 24, axisLabel: 'horas',
    boundaryAt: 6, boundaryLabel: 'RPO 6 h',
    events: [
      { at: 4, label: 'cada 4 h', sub: 'pérdida máxima 4 h', tint: 2 },
      { at: 24, label: 'diario', sub: 'pérdida máxima 24 h', tint: 5 },
    ],
    note: 'Un restore rápido no compensa una cadencia lenta: el dato que nunca se copió no está en ningún sitio.',
  },
  'S02-decimal-rounding': {
    kind: 'timeline',
    headline: 'Dónde se redondea cambia el total',
    from: 0, to: 4, axisLabel: 'pasos del cálculo',
    boundaryAt: 3, boundaryLabel: 'única vez que se redondea',
    events: [
      { at: 1, label: 'precio', sub: 'Decimal exacto', tint: 2 },
      { at: 2, label: 'IGV', sub: 'sigue exacto', tint: 2 },
      { at: 3, label: 'total', sub: 'quantize aquí', tint: 4 },
    ],
    note: 'Redondear en cada paso acumula el error; con float, además, ni siquiera es reproducible.',
  },

  // ------------------------------------------------------------------- stack
  'S43-image-layers': {
    kind: 'stack',
    headline: 'Ordena las capas de estable a cambiante o pagas pip en cada commit',
    layers: [
      { label: 'base pinned por digest', sub: 'python:3.12-slim@sha256:…', tint: 1 },
      { label: 'dependencias del sistema', tint: 1 },
      { label: 'requirements.txt', sub: 'cambia al añadir librería', tint: 3 },
      { label: 'código de la aplicación', sub: 'cambia cada commit', tint: 4 },
    ],
    volatileFrom: 2,
    note: 'Copiar el código antes que las dependencias invalida todo lo que hay encima en cada commit.',
  },
  'S27-test-pyramid': {
    kind: 'stack',
    headline: 'Qué atrapa cada capa, y cuánto cuesta mantenerla',
    layers: [
      { label: 'unitarias', sub: 'muchas, rápidas, aisladas', tint: 2 },
      { label: 'de integración', sub: 'bordes reales', tint: 3 },
      { label: 'end-to-end', sub: 'pocas, lentas, frágiles', tint: 4 },
    ],
    volatileFrom: 2,
    note: 'Una suite invertida tarda diez minutos y falla por motivos que no son el código.',
  },
  'S15-dtype-contract': {
    kind: 'stack',
    headline: 'El contrato de tipos se declara al leer, no se descubre al fallar',
    layers: [
      { label: 'bytes en disco', tint: 1 },
      { label: 'dtype declarado', sub: 'str, no object', tint: 3 },
      { label: 'validación de columnas', sub: 'faltan / sobran', tint: 2 },
      { label: 'DataFrame de trabajo', tint: 4 },
    ],
    volatileFrom: 3,
    note: 'Un dict columna→tipo no comprueba que la columna exista: eso hay que pedirlo aparte.',
  },

  // -------------------------------------------------------------------- bars
  'S37-where-time-goes': {
    kind: 'bars',
    headline: 'Dónde se va realmente el tiempo del job',
    max: 100,
    bars: [
      { label: 'leer del disco', value: 8, tint: 3, display: '8%' },
      { label: 'parsear JSON', value: 64, tint: 5, display: '64%' },
      { label: 'calcular features', value: 21, tint: 2, display: '21%' },
      { label: 'escribir salida', value: 7, tint: 3, display: '7%' },
    ],
    note: 'Optimizar antes de medir habría atacado el 21% y dejado intacto el 64%.',
  },
  'S33-baseline-gap': {
    kind: 'bars',
    headline: 'El baseline es la vara, y a veces casi alcanza',
    max: 1,
    bars: [
      { label: 'siempre la clase mayoritaria', value: 0.82, tint: 1, display: '0.82' },
      { label: 'regresión logística', value: 0.86, tint: 2, display: '0.86' },
      { label: 'modelo complejo', value: 0.87, tint: 4, display: '0.87' },
    ],
    note: 'Sin la primera barra, 0.87 parece un logro. Con ella, la pregunta es si vale su coste de mantenimiento.',
  },

  // ------------------------------------------------------------------- table
  'S29-window-vs-group': {
    kind: 'table',
    headline: 'groupby colapsa; window conserva la fila',
    left: { title: 'groupby', head: ['region', 'total'], rows: [['Cusco', '30'], ['Lima', '90']], tint: 2 },
    right: { title: 'window', head: ['region', 'monto', 'total'], rows: [['Lima', '60', '90'], ['Lima', '30', '90'], ['Cusco', '30', '30']], tint: 4 },
    forward: 'over(partition by)',
    note: 'Si necesitas el total junto a cada fila, colapsar y volver a unir es el rodeo que window evita.',
  },
  'S06-list-vs-dict': {
    kind: 'table',
    headline: 'La misma información, y solo una responde «¿está?» en un paso',
    left: { title: 'lista', head: ['i', 'cliente'], rows: [['0', 'C001'], ['1', 'C002'], ['2', 'C003']], tint: 3 },
    right: { title: 'dict', head: ['clave', 'valor'], rows: [['C001', '…'], ['C002', '…'], ['C003', '…']], tint: 2 },
    forward: '{c: v for …}',
    note: 'Buscar en la lista recorre; buscar en el dict no. Con tres filas da igual, con cien mil decide el diseño.',
  },

  // --------------------------------------------------------------------- set
  'S28-property-coverage': {
    kind: 'set',
    headline: 'Lo que tus pruebas de ejemplo nunca generan',
    universeLabel: 'todas las entradas posibles',
    regions: [
      { label: 'property-based', sub: 'genera bordes que no imaginaste', tint: 2 },
      { label: 'basadas en ejemplos', sub: 'los casos que se te ocurrieron', tint: 4 },
    ],
    note: 'El margen que queda fuera es donde viven los fallos de producción.',
  },
  'S14-view-scope': {
    kind: 'set',
    headline: 'Una vista no es un subconjunto independiente',
    universeLabel: 'el array original en memoria',
    regions: [
      { label: 'vista', sub: 'escribe en la misma memoria', tint: 5 },
      { label: 'copia', sub: 'memoria propia', tint: 2 },
    ],
    note: 'Escribir en la vista cambia el original. Ese es el bug que no lanza ninguna excepción.',
  },

  // ------------------------------------------------------- stress fixtures
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

  'S11-invariant-where': {
    kind: 'decision',
    headline: 'Dónde se comprueba un invariante decide qué puede existir',
    input: 'construcción',
    branches: [
      { test: 'campo obligatorio ausente', result: 'falla al construir', tint: 5 },
      { test: 'valor fuera de dominio', result: 'ValueError aquí', tint: 4 },
      { test: 'todo válido', result: 'objeto que siempre tiene sentido', tint: 2 },
    ],
    note: 'Comprobar después permite que exista, aunque sea un instante, un objeto imposible — y alguien lo va a usar.',
  },
  'S19-chart-choice': {
    kind: 'decision',
    headline: 'El gráfico no es estético: codifica la comparación que quieres',
    input: 'pregunta',
    branches: [
      { test: 'comparar magnitudes entre categorías', result: 'barras', tint: 2 },
      { test: 'ver evolución en el tiempo', result: 'línea', tint: 3 },
      { test: 'ver relación entre dos variables', result: 'dispersión', tint: 4 },
      { test: 'ver una parte de un todo', result: 'barras apiladas, no tarta', tint: 5 },
    ],
    note: 'Empezar el eje y en un valor distinto de cero exagera la diferencia sin mentir en los números.',
  },
  'S21-render-pipeline': {
    kind: 'stack',
    headline: 'Quién calcula y quién solo da formato',
    layers: [
      { label: 'datos', sub: 'Decimal exacto', tint: 1 },
      { label: 'cálculo en Python', sub: 'aquí y solo aquí se redondea', tint: 2 },
      { label: 'plantilla Jinja', sub: 'decide decimales visibles', tint: 3 },
      { label: 'documento', tint: 4 },
    ],
    volatileFrom: 2,
    note: 'El filtro format da formato para mostrar; no altera el valor que viaja al Excel.',
  },
  'S36-k-vs-density': {
    kind: 'table',
    headline: 'Dos formas de agrupar, y lo que cada una te pide de entrada',
    left: { title: 'k-means', head: ['pides', 'obtienes'], rows: [['k', 'k grupos'], ['—', 'todos asignados']], tint: 2 },
    right: { title: 'density', head: ['pides', 'obtienes'], rows: [['eps, min_samples', 'los que haya'], ['—', 'ruido sin asignar']], tint: 4 },
    forward: 'misma familia',
    note: 'Clustering no es k-means: la diferencia entre estos dos es qué le pides al algoritmo, no qué tan bueno es.',
  },
  'S46-window-lateness': {
    kind: 'timeline',
    headline: 'La misma ventana, tres llegadas distintas',
    from: 92, to: 124, axisLabel: 'event time',
    boundaryAt: 110, boundaryLabel: 'watermark',
    graceWidth: 5, graceLabel: 'gracia',
    events: [
      { at: 112, label: 'ON_TIME', sub: 'por encima del watermark', tint: 2 },
      { at: 105, label: 'ALLOWED_LATE', sub: 'entra por gracia', tint: 4 },
      { at: 100, label: 'LATE', sub: 'side-output o drop', tint: 5 },
    ],
    note: 'El watermark lo fija el stream que ya llegó; lo que se juzga es el instante en que llega cada hecho.',
  },
  'S47-canary-budget': {
    kind: 'bars',
    headline: 'Un canary pasa por cuatro cosas a la vez, no por una',
    max: 100,
    bars: [
      { label: 'tráfico', value: 5, tint: 2, display: '5% ≤ 10%' },
      { label: 'calidad', value: 40, tint: 2, display: 'dentro del presupuesto' },
      { label: 'errores', value: 30, tint: 2, display: '0.4% ≤ 1%' },
      { label: 'hooks', value: 100, tint: 2, display: 'activos' },
    ],
    note: 'Basta que una barra se salga para detener: el error de contrato es olvidar comparar la de errores.',
  },
  'S48-abstention': {
    kind: 'set',
    headline: 'Abstenerse es una respuesta correcta',
    universeLabel: 'todas las preguntas que llegan',
    regions: [
      { label: 'con evidencia permitida', sub: 'se responde y se cita', tint: 2 },
      { label: 'sin evidencia suficiente', sub: 'se abstiene', tint: 4 },
    ],
    note: 'El margen exterior —preguntas fuera del corpus— no se contesta con confianza: se dice que no se sabe.',
  },
  'S33-nn-cycle': {
    kind: 'flow',
    headline: 'El ciclo que hace una red, en cuatro pasos que ya conoces',
    stages: [
      { label: 'forward', sub: 'predice', tint: 3 },
      { label: 'pérdida', sub: 'cuánto falló', tint: 5 },
      { label: 'gradiente', sub: 'hacia dónde', tint: 4 },
      { label: 'actualizar', tint: 2 },
    ],
    outcome: 'La regresión logística de S33 ya hace esto: una red solo repite el ciclo con más capas.',
  },
  'S43-container-vs-image': {
    kind: 'flow',
    headline: 'Receta, plato preparado y plato servido no son lo mismo',
    stages: [
      { label: 'Dockerfile', sub: 'la receta', tint: 3 },
      { label: 'imagen', sub: 'lo preparado', tint: 1 },
      { label: 'contenedor', sub: 'lo que corre', tint: 2 },
    ],
    boundaryAfter: 1,
    boundaryLabel: 'build',
    outcome: '«¿Por qué mi contenedor no tiene mis cambios?» casi siempre significa que no se reconstruyó la imagen.',
  },
  'S45-consistency-by-op': {
    kind: 'decision',
    headline: 'La consistencia se elige por operación, no por eslogan',
    input: 'operación',
    branches: [
      { test: 'el productor relee su propio estado', result: 'read-after-write', tint: 2 },
      { test: 'otro cliente debe verlo ya', result: 'garantía más fuerte', tint: 4 },
      { test: 'índice de búsqueda', result: 'eventual basta', tint: 3 },
    ],
    note: 'Read-after-write no promete que el dashboard lo vea: eso hay que pedirlo aparte.',
  },
  'S38-backpressure': {
    kind: 'bars',
    headline: 'La cola acotada es un tope de memoria, no un comentario de diseño',
    max: 100,
    bars: [
      { label: 'sin maxsize', value: 100, tint: 5, display: 'crece hasta OOM' },
      { label: 'con maxsize', value: 35, tint: 2, display: 'el productor espera' },
    ],
    note: 'Queue.full() es consultivo; la señal segura de rechazo es put_nowait con queue.Full.',
  },
  'S17-join-fanout': {
    kind: 'table',
    headline: 'El join que multiplica filas sin avisar',
    left: { title: 'antes', head: ['cliente', 'n'], rows: [['C001', '1'], ['C002', '1']], tint: 2 },
    right: { title: 'después', head: ['cliente', 'venta'], rows: [['C001', 'v1'], ['C001', 'v2'], ['C002', 'v3']], tint: 5 },
    forward: 'merge',
    note: 'Declara la cardinalidad esperada con validate= y pandas falla temprano en vez de inflar el total.',
  },
}
