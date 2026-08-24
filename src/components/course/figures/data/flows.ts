import type { FigureData } from '../archetypes/types'

/**
 * Pipelines and ordered stages.
 *
 * Every entry names a process the section already teaches. The archetype's job
 * is the one thing prose does badly with a sequence: by the fourth clause the
 * reader has lost the first, and the boundary — the point after which a choice
 * can no longer be made — disappears into the middle of a sentence.
 */
export const FLOW_FIGURES: Record<string, FigureData> = {
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

  'S01-repl-vs-script': {
    kind: 'flow',
    headline: 'El REPL responde línea a línea; el script corre entero en otra máquina',
    stages: [
      { label: 'escribes', sub: 'una línea', tint: 3 },
      { label: 'Enter', tint: 1 },
      { label: 'se ejecuta', sub: 'ves el resultado', tint: 2 },
    ],
    boundaryAfter: 2,
    boundaryLabel: 'el script no tiene este bucle',
    outcome: 'Por eso «a mí me funciona» suele significar «lo probé en el REPL, con estado que el script no tendrá».',
  },

  'S05-contract-order': {
    kind: 'flow',
    headline: 'Una función revisa lo que recibe antes de prometer nada',
    stages: [
      { label: 'precondición', sub: 'qué exijo', tint: 4 },
      { label: 'cuerpo', sub: 'el trabajo', tint: 1 },
      { label: 'postcondición', sub: 'qué garantizo', tint: 2 },
    ],
    boundaryAfter: 0,
    boundaryLabel: 'falla aquí o no falla',
    outcome: 'Si la precondición no se comprueba primero, el error aparece a mitad del cuerpo y con estado ya modificado.',
  },

  'S10-config-precedence': {
    kind: 'flow',
    headline: 'Cuatro fuentes de configuración, y solo una gana',
    stages: [
      { label: 'default', sub: 'del código', tint: 1 },
      { label: 'archivo', sub: 'del proyecto', tint: 3 },
      { label: 'entorno', sub: 'de la máquina', tint: 4 },
      { label: 'flag', sub: 'de esta corrida', tint: 2 },
    ],
    outcome: 'Cada capa pisa a la anterior. Documenta el orden o nadie sabrá por qué su valor no se aplicó.',
  },

  'S25-eval-loop': {
    kind: 'flow',
    headline: 'Un prompt sin evaluación es una opinión',
    stages: [
      { label: 'prompt', tint: 3 },
      { label: 'salida', tint: 1 },
      { label: 'evaluar', sub: 'contra casos fijos', tint: 2 },
      { label: 'ajustar', tint: 4 },
    ],
    outcome: 'El bucle solo sirve si los casos no cambian entre vueltas: si mueves la vara, la mejora es tuya, no del prompt.',
  },

  'S26-orchestration': {
    kind: 'flow',
    headline: 'Las piezas de S24–S25 encadenadas, con un punto de reanudación',
    stages: [
      { label: 'ingest', tint: 3 },
      { label: 'analyze', tint: 1 },
      { label: 'checkpoint', sub: 'marca lo hecho', tint: 2 },
      { label: 'report', tint: 4 },
    ],
    boundaryAfter: 2,
    boundaryLabel: 'un crash después de aquí no rehace el ingest',
    outcome: 'El checkpoint solo cumple su promesa si sobrevive al proceso; un set en memoria muere con él.',
  },

  'S44-supply-chain': {
    kind: 'flow',
    headline: 'La cadena de suministro: certificar antes de publicar',
    stages: [
      { label: 'lint', tint: 1 },
      { label: 'types', tint: 1 },
      { label: 'tests', tint: 2 },
      { label: 'firmar', sub: 'atestación', tint: 4 },
      { label: 'publicar', tint: 3 },
    ],
    boundaryAfter: 2,
    boundaryLabel: 'permiso de escritura solo a partir de aquí',
    outcome: 'Rápidos antes que costosos, y el token con `contents: read` hasta el job que realmente publica.',
  },

  'S47-model-lineage': {
    kind: 'flow',
    headline: 'De un experimento a algo que responde en producción',
    stages: [
      { label: 'experimento', sub: 'una corrida', tint: 3 },
      { label: 'registry', sub: 'versión con cards', tint: 1 },
      { label: 'shadow', sub: 'sin tráfico real', tint: 2 },
      { label: 'canary', sub: '≤10%', tint: 4 },
    ],
    boundaryAfter: 1,
    boundaryLabel: 'aquí deja de ser tuyo y pasa a tener dueño',
    outcome: 'Sin el registry en medio no hay a qué volver: el rollback necesita una versión anterior nombrada.',
  },

  'S22-approval-gate': {
    kind: 'flow',
    headline: 'Un humano aprueba antes de que el correo salga',
    stages: [
      { label: 'borrador', tint: 1 },
      { label: 'revisión', sub: 'persona con nombre', tint: 4 },
      { label: 'envío', tint: 2 },
    ],
    boundaryAfter: 1,
    boundaryLabel: 'irreversible',
    outcome: 'Después del envío no hay deshacer: por eso la aprobación es un estado guardado, no un clic que se pierde.',
  },

  'S12-request-lifecycle': {
    kind: 'flow',
    headline: 'Una petición HTTP que puede fallar de cuatro maneras distintas',
    stages: [
      { label: 'construir', sub: 'url + params', tint: 1 },
      { label: 'enviar', sub: 'timeout explícito', tint: 3 },
      { label: 'status', sub: 'raise_for_status', tint: 4 },
      { label: 'parsear', sub: 'json()', tint: 2 },
    ],
    outcome: 'Cada etapa tiene su excepción: confundirlas hace que un JSON roto se reintente como si fuera la red.',
  },

  'S07-encoding-chain': {
    kind: 'flow',
    headline: 'Los bytes no tienen idioma; alguien decide cómo leerlos',
    stages: [
      { label: 'bytes', sub: 'en disco', tint: 1 },
      { label: 'decode', sub: 'con una codificación', tint: 4 },
      { label: 'str', sub: 'texto en memoria', tint: 2 },
      { label: 'normalizar', sub: 'NFC', tint: 3 },
    ],
    boundaryAfter: 1,
    boundaryLabel: 'aquí se elige mal y nadie falla',
    outcome: 'Leer UTF-8 como Latin-1 no lanza error: produce «MuÃ±oz» y sigue adelante.',
  },

  'S08-quarantine-split': {
    kind: 'flow',
    headline: 'Toda fila que entra sale por exactamente una puerta',
    stages: [
      { label: 'entrada', sub: 'n_in', tint: 1 },
      { label: 'validar', tint: 3 },
      { label: 'clean', sub: 'n_clean', tint: 2 },
    ],
    boundaryAfter: 1,
    boundaryLabel: 'lo que no pasa va a cuarentena con su motivo',
    outcome: 'n_in = n_clean + n_quarantine. Si no cuadra, perdiste filas sin enterarte.',
  },

  'S23-rpa-recovery': {
    kind: 'flow',
    headline: 'El robot no reintenta lo que no es transitorio',
    stages: [
      { label: 'login', tint: 3 },
      { label: 'formulario', tint: 3 },
      { label: 'export', tint: 2 },
      { label: 'verificar', tint: 4 },
    ],
    boundaryAfter: 2,
    boundaryLabel: 'aquí el efecto ya está en el portal',
    outcome: 'Un CAPTCHA no es un fallo transitorio: es una condición de parada con traspaso humano.',
  },

  'S24-ocr-pipeline': {
    kind: 'flow',
    headline: 'De píxeles a campos, con la confianza viajando al lado',
    stages: [
      { label: 'captura', sub: '≥300 PPI', tint: 4 },
      { label: 'deskew', tint: 1 },
      { label: 'OCR', sub: 'texto + confianza', tint: 3 },
      { label: 'campos', sub: 'RUC, monto', tint: 2 },
    ],
    boundaryAfter: 0,
    boundaryLabel: 'lo que no se capturó aquí no se recupera después',
    outcome: 'Reescalar de 96 a 200 no añade detalle: interpola píxeles que nunca existieron.',
  },

  'S32-feature-pipeline': {
    kind: 'flow',
    headline: 'El orden de las etapas decide si hay fuga',
    stages: [
      { label: 'split', sub: 'por tiempo', tint: 4 },
      { label: 'fit', sub: 'solo en train', tint: 2 },
      { label: 'transform', sub: 'train y test', tint: 2 },
      { label: 'evaluar', tint: 3 },
    ],
    boundaryAfter: 0,
    boundaryLabel: 'nada antes de aquí puede mirar el test',
    outcome: 'Un fit_transform sobre todo el dataset invierte las dos primeras etapas y regala métricas.',
  },

  'S39-triage-stages': {
    kind: 'flow',
    headline: 'Cada etapa tiene dueño de contrato y no ve el futuro de la siguiente',
    stages: [
      { label: 'intake', tint: 1 },
      { label: 'ER', sub: 'identidad', tint: 3 },
      { label: 'grafo', tint: 3 },
      { label: 'features', tint: 2 },
      { label: 'cola', sub: 'humano decide', tint: 4 },
    ],
    boundaryAfter: 3,
    boundaryLabel: 'el score nunca es veredicto',
    outcome: 'Si un feature se materializa contra la cola ya resuelta, el modelo entrena sobre su propio futuro.',
  },

  'S46-exactly-once': {
    kind: 'flow',
    headline: 'Exactly-once no es un interruptor del broker: es una cadena',
    stages: [
      { label: 'fuente', sub: 'at-least-once', tint: 4 },
      { label: 'motor', sub: 'checkpoint', tint: 3 },
      { label: 'sink', sub: 'idempotente por clave', tint: 2 },
    ],
    outcome: 'Si falta un eslabón, el «exactly-once» del marketing se convierte en doble conteo en el dashboard.',
  },

  'S52-evidence-bundle': {
    kind: 'flow',
    headline: 'Lo que un revisor externo necesita para ejecutar y cuestionar',
    stages: [
      { label: 'reproducir', sub: 'README + entorno', tint: 2 },
      { label: 'entender', sub: 'C4 + ADR', tint: 3 },
      { label: 'cuestionar', sub: 'cards + defensa', tint: 4 },
    ],
    outcome: 'Ocho artefactos, y la falta de licencia o de evidencia de no-go bloquea la publicación.',
  },
}
