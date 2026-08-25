import type { FigureData } from '../archetypes/types'

/**
 * Entities and edges.
 *
 * A graph is the one structure prose cannot serialise without losing it: the
 * reader can hold "A shares a phone with B" but not the shape of four entities,
 * two accounts and a contact node all at once — which is precisely the shape
 * these sections ask them to reason about.
 */
export const GRAPH_FIGURES: Record<string, FigureData> = {
  'S13-blocking': {
    kind: 'graph',
    headline: 'El bloqueo no compara todo contra todo',
    nodes: [
      { id: 'b1', label: 'quispe|lima', sub: 'bloque', tint: 3, col: 0, row: 0 },
      { id: 'r1', label: 'Ana M. Q.', tint: 2, col: 1, row: 0 },
      { id: 'r2', label: 'Ana María Q.', tint: 2, col: 2, row: 0 },
      { id: 'b2', label: 'huamán|cusco', sub: 'bloque', tint: 3, col: 0, row: 1 },
      { id: 'r3', label: 'Luis H. S.', tint: 4, col: 1, row: 1 },
    ],
    edges: [
      { from: 'b1', to: 'r1', label: 'misma clave' },
      { from: 'b1', to: 'r2', label: 'misma clave' },
      { from: 'b2', to: 'r3', label: 'misma clave' },
      { from: 'r1', to: 'r2', label: 'este par sí se evalúa', derived: true },
    ],
    note: 'Solo se comparan pares dentro del mismo bloque. Lo que cae en bloques distintos no se evalúa nunca — por eso una sola clave no basta.',
  },

  'S48-rag-grounding': {
    kind: 'graph',
    headline: 'Cada afirmación apunta a un fragmento, o el sistema se abstiene',
    nodes: [
      { id: 'q', label: 'consulta', tint: 3, col: 0, row: 0 },
      { id: 'c1', label: 'd1#sla', sub: 'permitido', tint: 2, col: 1, row: 0 },
      { id: 'c2', label: 'd1#horario', sub: 'permitido', tint: 2, col: 1, row: 1 },
      { id: 'a1', label: 'afirmación 1', tint: 1, col: 2, row: 0 },
      { id: 'a2', label: 'afirmación 2', tint: 5, col: 2, row: 1 },
    ],
    edges: [
      { from: 'q', to: 'c1', label: 'recupera' },
      { from: 'q', to: 'c2', label: 'recupera' },
      { from: 'c1', to: 'a1', label: 'sostiene' },
      { from: 'c2', to: 'a2', label: 'sostiene' },
    ],
    note: 'Un evidence_id para toda la respuesta no es esto: cinco afirmaciones con una cita dejan cuatro sin prueba.',
  },

  'S30-er-pipeline': {
    kind: 'graph',
    headline: 'De registros sueltos a una entidad, sin decidir por el camino',
    nodes: [
      { id: 's1', label: 'registro A', tint: 1, col: 0, row: 0 },
      { id: 's2', label: 'registro B', tint: 1, col: 0, row: 1 },
      { id: 'p', label: 'par candidato', tint: 3, col: 1, row: 0 },
      { id: 'sc', label: 'score', sub: 'sin veredicto', tint: 4, col: 2, row: 0 },
      { id: 'e', label: 'entidad', tint: 2, col: 3, row: 0 },
      { id: 'q', label: 'cola humana', tint: 5, col: 3, row: 1 },
    ],
    edges: [
      { from: 's1', to: 'p', label: 'mismo bloque' },
      { from: 's2', to: 'p', label: 'mismo bloque' },
      { from: 'p', to: 'sc' },
      { from: 'sc', to: 'e', label: '≥ umbral alto' },
      { from: 'sc', to: 'q', label: 'zona gris' },
    ],
    note: 'La zona gris no es un fallo del modelo: es el caso donde la evidencia solo alcanza para un «probablemente».',
  },

  'S42-trust-boundary': {
    kind: 'graph',
    headline: 'Dónde deja de valer la palabra del cliente',
    nodes: [
      { id: 'c', label: 'cliente', sub: 'no confiable', tint: 5, col: 0, row: 0 },
      { id: 'v', label: 'validación', sub: 'extra=forbid', tint: 4, col: 1, row: 0 },
      { id: 'z', label: 'authz', tint: 3, col: 2, row: 0 },
      { id: 'd', label: 'dominio', tint: 2, col: 3, row: 0 },
      { id: 'l', label: 'logs', tint: 1, col: 2, row: 1 },
    ],
    edges: [
      { from: 'c', to: 'v', label: 'payload' },
      { from: 'v', to: 'z', label: 'ya tipado' },
      { from: 'z', to: 'd' },
      { from: 'v', to: 'l', label: 'solo tras validar', derived: true },
    ],
    note: 'La forma se rechaza antes de authz y antes de los logs: un campo no declarado no debe llegar ni siquiera a escribirse.',
  },

  'S48-evidence-allowlist': {
    kind: 'graph',
    headline: 'La allowlist decide qué puede citarse, no solo qué existe',
    nodes: [
      { id: 'u', label: 'usuario', sub: 'rol soporte', tint: 3, col: 0, row: 0 },
      { id: 'd1', label: 'd1#sla', sub: 'permitido', tint: 2, col: 1, row: 0 },
      { id: 'd2', label: 'anexo legal', sub: 'fuera de rol', tint: 5, col: 1, row: 1 },
      { id: 'r', label: 'respuesta', tint: 1, col: 2, row: 0 },
    ],
    edges: [
      { from: 'u', to: 'd1', label: 'puede ver' },
      { from: 'd1', to: 'r', label: 'cita' },
      { from: 'u', to: 'd2', label: 'no puede ver', derived: true },
    ],
    note: 'Deduplicar por el texto colapsa fragmentos iguales de documentos con permisos distintos, y el superviviente puede ser el prohibido.',
  },


  'S40-ports-adapters': {
    kind: 'graph',
    headline: 'Las flechas apuntan hacia el dominio, no hacia el framework',
    nodes: [
      { id: 'http', label: 'adapter HTTP', tint: 3, col: 0, row: 0 },
      { id: 'sql', label: 'adapter SQL', tint: 3, col: 0, row: 1 },
      { id: 'port', label: 'port', sub: 'lo que el dominio pide', tint: 4, col: 1, row: 0 },
      { id: 'dom', label: 'dominio', sub: 'no importa nada', tint: 2, col: 2, row: 0 },
    ],
    edges: [
      { from: 'http', to: 'port', label: 'implementa' },
      { from: 'sql', to: 'port', label: 'implementa' },
      { from: 'port', to: 'dom', label: 'definido por' },
    ],
    note: 'Si cambiar un adapter obliga a tocar el dominio, la flecha va al revés y el plano miente.',
  },

  'S29-provenance': {
    kind: 'graph',
    headline: 'Por qué el vínculo fuente–entidad vive en su propia tabla',
    nodes: [
      { id: 'sr1', label: 'source_record 1', tint: 1, col: 0, row: 0 },
      { id: 'sr2', label: 'source_record 2', tint: 1, col: 0, row: 1 },
      { id: 'lnk', label: 'entity_source_links', tint: 3, col: 1, row: 0 },
      { id: 'e1', label: 'entidad A', tint: 2, col: 2, row: 0 },
      { id: 'e2', label: 'entidad B', sub: 'candidata', tint: 4, col: 2, row: 1 },
    ],
    edges: [
      { from: 'sr1', to: 'lnk' },
      { from: 'sr2', to: 'lnk' },
      { from: 'lnk', to: 'e1', label: 'resuelto' },
      { from: 'lnk', to: 'e2', label: 'aún abierto', derived: true },
    ],
    note: 'Mientras la resolución sigue abierta un registro puede colgar de dos entidades. Con una FK, cada cambio de opinión borraría el anterior.',
  },

  'S51-trace-spans': {
    kind: 'graph',
    headline: 'Una traza es un árbol, no una lista de logs',
    nodes: [
      { id: 'req', label: 'petición', sub: 'trace_id', tint: 3, col: 0, row: 0 },
      { id: 'ret', label: 'retrieval', tint: 1, col: 1, row: 0 },
      { id: 'gen', label: 'generación', tint: 2, col: 1, row: 1 },
      { id: 'tool', label: 'tool', tint: 4, col: 2, row: 1 },
    ],
    edges: [
      { from: 'req', to: 'ret', label: 'span hijo' },
      { from: 'req', to: 'gen', label: 'span hijo' },
      { from: 'gen', to: 'tool', label: 'span nieto' },
    ],
    note: 'El coste y la latencia se leen por span: sumar solo el total esconde qué etapa se llevó el p95.',
  },

  'S22-recipient-resolution': {
    kind: 'graph',
    headline: 'A quién se le envía, y quién lo autorizó',
    nodes: [
      { id: 'req', label: 'solicitud', tint: 3, col: 0, row: 0 },
      { id: 'res', label: 'resolución', sub: 'alias → buzón', tint: 1, col: 1, row: 0 },
      { id: 'ver', label: 'verificación', sub: 'dominio permitido', tint: 4, col: 2, row: 0 },
      { id: 'out', label: 'envío', tint: 2, col: 3, row: 0 },
      { id: 'blk', label: 'bloqueado', tint: 5, col: 2, row: 1 },
    ],
    edges: [
      { from: 'req', to: 'res' },
      { from: 'res', to: 'ver' },
      { from: 'ver', to: 'out', label: 'dominio en allowlist' },
      { from: 'ver', to: 'blk', label: 'fuera de allowlist', derived: true },
    ],
    note: 'Un alias que resuelve a un buzón externo es el caso que la allowlist existe para atrapar.',
  },

  'S24-field-confidence': {
    kind: 'graph',
    headline: 'Cada campo extraído arrastra de dónde salió',
    nodes: [
      { id: 'img', label: 'imagen', tint: 1, col: 0, row: 0 },
      { id: 'box', label: 'región', sub: 'coordenadas', tint: 3, col: 1, row: 0 },
      { id: 'txt', label: 'texto', sub: 'confianza 0.61', tint: 4, col: 2, row: 0 },
      { id: 'fld', label: 'campo RUC', tint: 2, col: 3, row: 0 },
      { id: 'rev', label: 'revisión', tint: 5, col: 3, row: 1 },
    ],
    edges: [
      { from: 'img', to: 'box' },
      { from: 'box', to: 'txt', label: 'OCR' },
      { from: 'txt', to: 'fld', label: 'confianza ≥ umbral' },
      { from: 'txt', to: 'rev', label: 'por debajo', derived: true },
    ],
    note: 'Sin la región guardada, un revisor no puede comprobar de dónde salió el número que va a aprobar.',
  },


  'S35-card-layers': {
    kind: 'graph',
    headline: 'Las cuatro capas de la ficha, que no deben mezclarse',
    nodes: [
      { id: 'ev', label: 'evidencia', sub: 'hechos del caso', tint: 2, col: 0, row: 0 },
      { id: 'mo', label: 'contribución', sub: 'del modelo', tint: 3, col: 1, row: 0 },
      { id: 'un', label: 'incertidumbre', sub: 'cuánta duda', tint: 4, col: 2, row: 0 },
      { id: 'hu', label: 'decisión', sub: 'persona con nombre', tint: 5, col: 3, row: 0 },
    ],
    edges: [
      { from: 'ev', to: 'mo', label: 'alimenta' },
      { from: 'mo', to: 'un', label: 'acompaña' },
      { from: 'un', to: 'hu', label: 'informa' },
    ],
    note: 'Estar fuera de distribución no añade una quinta capa: se registra dentro de la incertidumbre, como su razón.',
  },

  'S29-query-plan': {
    kind: 'graph',
    headline: 'El plan es un árbol y se lee de abajo hacia arriba',
    nodes: [
      { id: 's1', label: 'scan clientes', tint: 1, col: 0, row: 0 },
      { id: 's2', label: 'scan ventas', tint: 1, col: 0, row: 1 },
      { id: 'j', label: 'hash join', sub: 'aquí está el coste', tint: 5, col: 1, row: 0 },
      { id: 'a', label: 'aggregate', tint: 3, col: 2, row: 0 },
    ],
    edges: [
      { from: 's1', to: 'j' },
      { from: 's2', to: 'j' },
      { from: 'j', to: 'a' },
    ],
    note: 'Las filas estimadas frente a las reales en el nodo del join es lo primero que se mira cuando la consulta se cae.',
  },

  'S41-request-path': {
    kind: 'graph',
    headline: 'Dónde muere una petición mal formada',
    nodes: [
      { id: 'c', label: 'cliente', tint: 3, col: 0, row: 0 },
      { id: 'v', label: 'validación', sub: '422 aquí', tint: 4, col: 1, row: 0 },
      { id: 'h', label: 'handler', tint: 2, col: 2, row: 0 },
      { id: 'w', label: 'worker', sub: 'cola durable', tint: 1, col: 3, row: 0 },
    ],
    edges: [
      { from: 'c', to: 'v', label: 'payload' },
      { from: 'v', to: 'h', label: 'ya tipado' },
      { from: 'h', to: 'w', label: '202 + id', derived: true },
    ],
    note: 'El trabajo largo se encola antes de responder; devolver 200 y seguir trabajando pierde el job al reiniciar.',
  },

  'S50-judge-ensemble': {
    kind: 'graph',
    headline: 'Tres jueces, y el desacuerdo va a adjudicación',
    nodes: [
      { id: 'r', label: 'respuesta', tint: 1, col: 0, row: 0 },
      { id: 'd', label: 'determinista', sub: 'schema + cita', tint: 2, col: 1, row: 0 },
      { id: 'h', label: 'humano', tint: 3, col: 1, row: 1 },
      { id: 'l', label: 'LLM', tint: 4, col: 2, row: 1 },
      { id: 'a', label: 'adjudicación', tint: 5, col: 2, row: 0 },
    ],
    edges: [
      { from: 'r', to: 'd' },
      { from: 'r', to: 'h' },
      { from: 'r', to: 'l' },
      { from: 'h', to: 'a', label: 'desacuerdo', derived: true },
      { from: 'l', to: 'a', label: 'desacuerdo', derived: true },
    ],
    note: 'El acuerdo humano-LLM se mide antes de usar al LLM como juez; por debajo del umbral, se recalibra.',
  },
}
