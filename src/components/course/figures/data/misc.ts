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
  'S28-golden-drift': {
    kind: 'decision',
    headline: 'Un diff contra el golden no se resuelve actualizando el golden',
    input: 'salida ≠ golden',
    branches: [
      { test: 'orden o float', result: 'normaliza y repite', tint: 2 },
      { test: 'bug del matcher', result: 'arregla el código', tint: 5 },
      { test: 'cambio de política firmado', result: 'reconcilia con nota', tint: 3 },
      { test: 'sin clasificar', result: 'blocked_drift', tint: 4 },
    ],
    note: 'Actualizar el golden porque «ahora sale distinto» es exactamente cómo se aprueba una regresión sin que nadie la vea.',
  },
  'S02-truthiness': {
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

  'S03-guard-order': {
    kind: 'decision',
    headline: 'Las guardas se evalúan en orden y la primera que coincide gana',
    input: 'registro',
    branches: [
      { test: 'campo obligatorio ausente', result: 'reject', tint: 5 },
      { test: 'fuera del rango permitido', result: 'review', tint: 4 },
      { test: 'valor no está en la lista', result: 'review', tint: 4 },
      { test: 'resto', result: 'accept', tint: 2 },
    ],
    note: 'Mover la última guarda al principio cambia la clasificación de todos los registros, no de algunos.',
  },
  'S04-loop-invariant': {
    kind: 'bars',
    headline: 'Intentadas y procesadas no son el mismo denominador',
    max: 6,
    bars: [
      { label: 'filas intentadas', value: 6, tint: 2, display: '6' },
      { label: 'filas procesadas', value: 5, tint: 4, display: '5' },
      { label: 'aceptadas', value: 4, tint: 3, display: '4' },
    ],
    note: 'Dividir entre procesadas da 0.80; entre intentadas, 0.67. La tasa mejora sola cada vez que una fila falla antes de tiempo.',
  },
  'S09-error-boundary': {
    kind: 'stack',
    headline: 'Dónde se atrapa un error decide qué información sobrevive',
    layers: [
      { label: 'origen', sub: 'lanza el error específico', tint: 5 },
      { label: 'capa de dominio', sub: 'añade contexto, re-lanza', tint: 3 },
      { label: 'frontera', sub: 'decide y registra', tint: 2 },
    ],
    volatileFrom: 2,
    note: 'Atrapar Exception en el origen borra el tipo; atraparlo todo en la frontera pierde el contexto de dónde ocurrió.',
  },
  'S10-package-layout': {
    kind: 'stack',
    headline: 'El layout src evita importar la copia equivocada',
    layers: [
      { label: 'src/paquete/', sub: 'el código real', tint: 2 },
      { label: 'pyproject.toml', sub: 'nombre, deps, scripts', tint: 3 },
      { label: 'pip install -e .', sub: 'lo hace importable', tint: 4 },
    ],
    volatileFrom: 1,
    note: 'Sin src, ejecutar desde la raíz importa la carpeta local y no el paquete instalado; el fallo aparece solo en otra máquina.',
  },
  'S13-two-scores': {
    kind: 'bars',
    headline: 'Dos puntajes que se muestran aparte porque miden cosas distintas',
    max: 1,
    bars: [
      { label: 'identidad (ER)', value: 0.7, tint: 2, display: '0.70' },
      { label: 'relación (REL)', value: 1.0, tint: 4, display: '1.00' },
      { label: 'mezcla 0.6/0.4', value: 0.82, tint: 5, display: '0.82' },
    ],
    note: 'La mezcla cruza el umbral de 0.80 empujada por la relación. Por eso la identidad se decide sobre ER y no sobre la mezcla.',
  },
  'S16-quarantine-reasons': {
    kind: 'table',
    headline: 'La cuarentena guarda el crudo y el motivo, no solo la fila',
    left: { title: 'entrada', head: ['id', 'monto'], rows: [['C001', '10.0'], ['C002', ''], ['', '8.0']], tint: 3 },
    right: { title: 'cuarentena', head: ['id', 'motivo'], rows: [['C002', 'monto nulo'], ['(vacío)', 'id nulo']], tint: 5 },
    forward: 'política required',
    note: 'Sin el motivo, la cuarentena es un montón de filas que nadie sabe cómo reparar.',
  },
  'S18-sample-vs-population': {
    kind: 'set',
    headline: 'La muestra que tienes no es la población de la que hablas',
    universeLabel: 'población sobre la que decides',
    regions: [
      { label: 'marco muestral', sub: 'a quién pudiste alcanzar', tint: 3 },
      { label: 'respondieron', sub: 'de quién tienes dato', tint: 2 },
    ],
    note: 'Cada margen que queda fuera es un sesgo con nombre; el intervalo solo cubre el ruido, no ese hueco.',
  },
  'S20-sheet-structure': {
    kind: 'stack',
    headline: 'Un libro de Excel es jerárquico, y la celda es la hoja al final',
    layers: [
      { label: 'libro', tint: 1 },
      { label: 'hoja', sub: 'nombre estable, no índice', tint: 3 },
      { label: 'fila / celda', sub: 'valor o fórmula', tint: 2 },
    ],
    volatileFrom: 2,
    note: 'Leer por índice de hoja rompe cuando alguien reordena las pestañas; leer por nombre no.',
  },
  'S22-mime-parts': {
    kind: 'stack',
    headline: 'Un correo con adjunto es un sobre con partes, no un texto',
    layers: [
      { label: 'multipart/mixed', sub: 'el sobre', tint: 1 },
      { label: 'text/plain', sub: 'la versión legible siempre', tint: 2 },
      { label: 'text/html', sub: 'la versión con formato', tint: 3 },
      { label: 'application/pdf', sub: 'el adjunto', tint: 4 },
    ],
    volatileFrom: 2,
    note: 'Enviar solo HTML deja sin nada al cliente que no lo renderiza; la parte de texto plano no es opcional.',
  },
  'S25-local-vs-cloud': {
    kind: 'decision',
    headline: 'Dónde corre el modelo lo decide el dato, no el gusto',
    input: 'dato',
    branches: [
      { test: 'contiene PII real', result: 'local o VPC privada', tint: 5 },
      { test: 'sintético o anonimizado', result: 'cloud permitido', tint: 2 },
      { test: 'licencia lo prohíbe', result: 'ninguna de las dos', tint: 4 },
    ],
    note: 'Que exista un DPA no habilita enviar datos personales reales: gobierna todo lo demás.',
  },
  'S26-dag-states': {
    kind: 'decision',
    headline: 'Un flujo no tiene dos estados, tiene cinco',
    input: 'tarea',
    branches: [
      { test: 'dependencia no lista', result: 'pending', tint: 1 },
      { test: 'ejecutándose', result: 'running', tint: 3 },
      { test: 'terminó bien', result: 'success', tint: 2 },
      { test: 'agotó reintentos', result: 'dead-letter', tint: 5 },
      { test: 'upstream falló', result: 'skipped', tint: 4 },
    ],
    note: 'Confundir skipped con success infla la tasa de éxito con tareas que nunca corrieron.',
  },
  'S49-tool-schema': {
    kind: 'decision',
    headline: 'Una tool se deshabilita antes de llamarla, no después',
    input: 'tool',
    branches: [
      { test: 'más de una responsabilidad', result: 'deshabilitar', tint: 5 },
      { test: 'schema sin campos tipados', result: 'deshabilitar', tint: 5 },
      { test: 'scope fuera de lo concedido', result: 'DENY_TOOL_CALL', tint: 4 },
      { test: 'resto', result: 'llamable', tint: 2 },
    ],
    note: 'Un nombre que «suena útil» en el prompt no es un criterio: el registro de tools se audita antes del run.',
  },
  'S30-missing-weight': {
    kind: 'bars',
    headline: 'Dos formas de tratar un campo ausente, y solo una es neutral',
    max: 1,
    bars: [
      { label: 'omitido del denominador', value: 0.75, tint: 2, display: '0.75' },
      { label: 'aporta 0, conserva el peso', value: 0.5, tint: 5, display: '0.50' },
    ],
    note: 'La segunda baja el score y puede cruzar el umbral inferior: un dato que nadie tenía acaba pareciendo un desacuerdo.',
  },
  'S31-degree-context': {
    kind: 'bars',
    headline: 'Un grado alto es estructura, no culpa',
    max: 40,
    bars: [
      { label: 'teléfono de dos personas', value: 2, tint: 4, display: '2' },
      { label: 'teléfono de call center', value: 40, tint: 1, display: '40' },
    ],
    note: 'El mismo tipo de arista, dos historias distintas. Sin contexto, el score ordena la cola por el nodo equivocado.',
  },
  'S33-overfit-gap': {
    kind: 'bars',
    headline: 'La distancia entre train y test es el diagnóstico',
    max: 1,
    bars: [
      { label: 'train', value: 0.98, tint: 5, display: '0.98' },
      { label: 'test', value: 0.71, tint: 4, display: '0.71' },
      { label: 'baseline', value: 0.68, tint: 1, display: '0.68' },
    ],
    note: 'Con esa brecha, el modelo memorizó. Y apenas supera al baseline: dos problemas, no uno.',
  },
  'S34-confusion-cost': {
    kind: 'table',
    headline: 'Los dos errores no cuestan lo mismo, y el umbral elige cuál prefieres',
    left: { title: 'umbral bajo', head: ['', 'pred +', 'pred −'], rows: [['real +', '9', '1'], ['real −', '30', '60']], tint: 4 },
    right: { title: 'umbral alto', head: ['', 'pred +', 'pred −'], rows: [['real +', '5', '5'], ['real −', '4', '86']], tint: 2 },
    forward: 'subir el corte',
    note: 'Bajar el umbral atrapa más positivos y llena la cola; subirlo la vacía y deja pasar casos. No hay opción sin coste.',
  },
  'S36-scale-trap': {
    kind: 'bars',
    headline: 'Sin escalar, la columna con números grandes decide sola',
    max: 100000,
    bars: [
      { label: 'antigüedad (0–1)', value: 1, tint: 2, display: 'rango 1' },
      { label: 'monto (0–100 000)', value: 100000, tint: 5, display: 'rango 100 000' },
    ],
    note: 'La distancia euclídea suma ambas: la segunda domina por completo, y el clúster resultante solo agrupa por monto.',
  },
  'S37-percentiles': {
    kind: 'bars',
    headline: 'La media esconde exactamente lo que te va a doler',
    max: 5000,
    bars: [
      { label: 'media', value: 200, tint: 2, display: '200 ms' },
      { label: 'p50', value: 150, tint: 2, display: '150 ms' },
      { label: 'p95', value: 5000, tint: 5, display: '5 s' },
    ],
    note: 'Un p95 de 5 s con media de 200 ms es un incidente de experiencia, no un pico normal.',
  },
  'S40-layer-imports': {
    kind: 'stack',
    headline: 'Las importaciones apuntan hacia dentro',
    layers: [
      { label: 'dominio', sub: 'no importa nada de fuera', tint: 2 },
      { label: 'aplicación', sub: 'orquesta casos de uso', tint: 3 },
      { label: 'infraestructura', sub: 'HTTP, SQL, colas', tint: 4 },
    ],
    volatileFrom: 2,
    note: 'Si el dominio importa FastAPI, cambiar de framework se convierte en reescribir las reglas de negocio.',
  },
  'S41-status-codes': {
    kind: 'decision',
    headline: 'El código de estado es parte del contrato, no decoración',
    input: 'petición',
    branches: [
      { test: 'cuerpo no valida contra el schema', result: '422', tint: 4 },
      { test: 'sin credencial', result: '401', tint: 5 },
      { test: 'credencial sin permiso', result: '403', tint: 5 },
      { test: 'trabajo largo encolado', result: '202 + id', tint: 2 },
    ],
    note: 'Devolver 200 con un cuerpo de error obliga a cada cliente a inventarse cómo detectar el fallo.',
  },
  'S42-additive-evolution': {
    kind: 'decision',
    headline: 'Qué cambios puede absorber el lector de ayer',
    input: 'cambio',
    branches: [
      { test: 'añadir campo opcional', result: 'aditivo, compatible', tint: 2 },
      { test: 'renombrar campo obligatorio', result: 'ruptura, versiona', tint: 5 },
      { test: 'valor nuevo en un enum', result: 'ruptura si no hay rama', tint: 4 },
    ],
    note: 'Poner additionalProperties: false en tus consumidores internos convierte todo cambio aditivo en uno de ruptura.',
  },
  'S43-multistage': {
    kind: 'stack',
    headline: 'El compilador se queda en el stage que lo necesita',
    layers: [
      { label: 'stage builder', sub: 'SDK, compiladores, wheels', tint: 4 },
      { label: 'COPY --from=builder', sub: 'solo el artefacto', tint: 3 },
      { label: 'stage runtime', sub: 'sin toolchain, non-root', tint: 2 },
    ],
    volatileFrom: 1,
    note: 'Un gcc en la imagen final es superficie de ataque que nadie va a usar nunca en producción.',
  },
  'S44-permission-scope': {
    kind: 'decision',
    headline: 'El permiso por defecto es el techo; la excepción es del job',
    input: 'job',
    branches: [
      { test: 'nivel de workflow', result: 'contents: read', tint: 2 },
      { test: 'job de release', result: 'contents: write, solo ahí', tint: 4 },
      { test: 'action sin SHA de 40 hex', result: 'no es un pin', tint: 5 },
    ],
    note: 'Un tag como @v4 se puede mover; el SHA no. Esa es toda la diferencia entre un pin y una esperanza.',
  },
  'S45-rto-vs-rollback': {
    kind: 'timeline',
    headline: 'El RTO cuenta hasta que el servicio vuelve, no hasta el rollback',
    from: 0, to: 70, axisLabel: 'minutos desde el incidente',
    boundaryAt: 15, boundaryLabel: 'RTO 15 min',
    events: [
      { at: 8, label: 'rollback listo', sub: 'pero no basta', tint: 4 },
      { at: 60, label: 'servicio restablecido', sub: 'RTO incumplido', tint: 5 },
    ],
    note: 'Un rollback de 8 minutos seguido de 52 de restauración incumple un RTO de 15.',
  },
  'S47-registry-promotion': {
    kind: 'decision',
    headline: 'Promover no es copiar un archivo a otra carpeta',
    input: 'candidato',
    branches: [
      { test: 'sin holdout sellado', result: 'no promueve', tint: 5 },
      { test: 'sin model card', result: 'no promueve', tint: 5 },
      { test: 'sin last-good al que volver', result: 'no promueve', tint: 4 },
      { test: 'resto', result: 'shadow, luego canary', tint: 2 },
    ],
    note: 'Sin una versión anterior nombrada no hay rollback: solo hay un modelo en producción y ninguna salida.',
  },
  'S47-shadow-vs-canary': {
    kind: 'bars',
    headline: 'Shadow no arriesga usuarios; canary sí, y por eso se acota',
    max: 100,
    bars: [
      { label: 'shadow', value: 0, tint: 2, display: '0% del tráfico ve la salida' },
      { label: 'canary', value: 10, tint: 4, display: '≤10%' },
      { label: 'full', value: 100, tint: 5, display: '100%' },
    ],
    note: 'Shadow responde a «¿se cae?»; canary a «¿empeora la calidad para alguien real?». No se saltan.',
  },
  'S48-chunk-provenance': {
    kind: 'stack',
    headline: 'Un fragmento sin procedencia no se puede citar ni revocar',
    layers: [
      { label: 'documento', sub: 'doc_id, versión', tint: 1 },
      { label: 'sección', sub: 'unidad semántica', tint: 3 },
      { label: 'fragmento', sub: 'hash con procedencia', tint: 2 },
    ],
    volatileFrom: 2,
    note: 'Si el hash es solo del texto, dos fragmentos iguales de documentos con permisos distintos se colapsan en uno.',
  },
  'S49-context-budget': {
    kind: 'bars',
    headline: 'El contexto es un presupuesto, y compactar tiene reglas',
    max: 2000,
    bars: [
      { label: 'estado del caso', value: 1200, tint: 2, display: '1 200 tok' },
      { label: 'log ruidoso', value: 700, tint: 5, display: '700 tok, se compacta' },
      { label: 'máximo', value: 2000, tint: 1, display: '2 000 tok' },
    ],
    note: 'Compactar puede borrar pasos ruidosos; case_id, budget y no_prod_write tienen que sobrevivir.',
  },
  'S49-tool-effects': {
    kind: 'decision',
    headline: 'No toda tool necesita clave de idempotencia',
    input: 'llamada',
    branches: [
      { test: 'solo lectura', result: 'schema y scope bastan', tint: 2 },
      { test: 'produce un efecto', result: 'clave + reserva atómica', tint: 4 },
      { test: 'efecto duplicado tras N intentos', result: 'DENY_TOOL_CALL', tint: 5 },
    ],
    note: 'Exigir clave a un get_case_status denegaría todas las lecturas; repetirlas es inofensivo.',
  },
  'S50-slice-overlap': {
    kind: 'set',
    headline: 'Los slices se solapan a propósito',
    universeLabel: 'todas las tareas del dataset',
    regions: [
      { label: 'por idioma', tint: 2 },
      { label: 'adversarial', sub: 'una tarea puede estar en ambos', tint: 4 },
    ],
    note: 'Por eso la comprobación es de cobertura y no de suma: exigir que los tamaños sumen rompería datasets correctos.',
  },
  'S51-redaction-classes': {
    kind: 'decision',
    headline: 'Se redactan las dos, por razones distintas',
    input: 'campo en el log',
    branches: [
      { test: 'email, teléfono, documento', result: 'PII: obliga privacidad', tint: 4 },
      { test: 'Authorization, api_key', result: 'secreto: obliga rotar', tint: 5 },
      { test: 'resto', result: 'se registra', tint: 2 },
    ],
    note: 'Llamar PII a un token confunde la respuesta al incidente: uno se notifica, el otro se revoca.',
  },
  'S52-defense-evidence': {
    kind: 'set',
    headline: 'Lo que un revisor externo puede comprobar sin ti',
    universeLabel: 'todo lo que sabes del proyecto',
    regions: [
      { label: 'en el bundle', sub: 'ocho artefactos ejecutables', tint: 2 },
      { label: 'en tu cabeza', sub: 'conocimiento tribal', tint: 5 },
    ],
    note: 'Lo que queda fuera del bundle no existe para la defensa, por bien que lo sepas explicar en persona.',
  },
}
