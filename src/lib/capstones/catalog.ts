/**
 * Canonical Capstone Catalog — single source of truth for the four-level
 * applied-project and capstone system.
 *
 * Cardinality invariant (frozen): 4 levels x 3 + 1 final = 13.
 * No CP-N4-D. CP-N4-C absorbs the multi-agent project via 3 sub-gates
 * (S49/S50/S51). See capstone_validation/architecture/ADR-*.md.
 *
 * Level names are curricular proficiency descriptors — NOT workplace titles.
 */
export type LevelId = 1 | 2 | 3 | 4

export interface LevelDescriptor {
  id: LevelId; stableId: string; name: string; band: string; sections: string
  gates: string[]; exitCapability: string; doesNotEstablish: string
}
export interface CapstoneSubGate { id: string; section: string; title: string; focus: string }
export interface CapstoneDescriptor {
  id: string; version: string; name: string; level: LevelId; gateSection: string
  contributingSections: string[]; subGates?: CapstoneSubGate[]; dependencies: string[]
  prerequisites: string[]; summary: string; intendedUser: string
  datasetPath: string; rubricPath: string; briefPath: string; badgeId: string
  finalIntegrationInterface: string; criticalFailures: string[]; isFinal?: boolean
}

export const LEVELS: LevelDescriptor[] = [
  { id: 1, stableId: 'L1', name: 'Fundamentos Guiados', band: 'Principiante → principiante avanzado', sections: 'S01–S13', gates: ['S04','S08','S13'],
    exitCapability: 'Seguir, modificar, probar y explicar programas acotados de procesamiento de datos con apoyo.',
    doesNotEstablish: 'No establece antigüedad laboral, licencia profesional ni nivel de empleo.' },
  { id: 2, stableId: 'L2', name: 'Práctica Aplicada Independiente', band: 'Principiante avanzado → práctica independiente guiada', sections: 'S14–S26', gates: ['S17','S21','S26'],
    exitCapability: 'Completar trabajo analítico, de reportes y automatización definido, usando métodos establecidos y revisiones explícitas.',
    doesNotEstablish: 'No certifica título laboral ni garantiza empleabilidad.' },
  { id: 3, stableId: 'L3', name: 'Integración y Evaluación Avanzada', band: 'Práctica independiente → capacidad integrada avanzada', sections: 'S27–S39', gates: ['S30','S34','S39'],
    exitCapability: 'Diseñar y evaluar flujos de resolución de entidades, grafos, datos y ML bajo ambigüedad, incertidumbre y revisión humana.',
    doesNotEstablish: 'No constituye nivel “senior”, “staff” ni “experto” organizacional.' },
  { id: 4, stableId: 'L4', name: 'Sistemas de Producción Gobernados', band: 'Capacidad integrada avanzada → dominio de sistemas a nivel curricular', sections: 'S40–S52', gates: ['S43','S47','S51'],
    exitCapability: 'Integrar, desplegar, observar, asegurar y defender un sistema acotado de datos e IA estilo producción.',
    doesNotEstablish: 'No otorga título de “arquitecto”, “master” ni certificación profesional externa.' },
]

const SUB_N4C: CapstoneSubGate[] = [
  { id: 'CP-N4-C.1', section: 'S49', title: 'Runtime multi-agente, adaptadores, RAG, tools, web/SERP, presupuestos y aprobación',
    focus: 'Orquestación acotada, adaptadores local+comercial, RAG con citas y control de acceso, tools de mínimo privilegio, web/SERP con proveniencia, presupuestos y HITL.' },
  { id: 'CP-N4-C.2', section: 'S50', title: 'Evaluación, red-team, fiabilidad y recuperación',
    focus: 'Evaluaciones holdout y de trayectoria, red-team, defensa contra inyección, tool-misuse, gates de costo/latencia y pruebas de recuperación.' },
  { id: 'CP-N4-C.3', section: 'S51', title: 'Observabilidad, gobernanza, incidentes, contestabilidad, accesibilidad y tarjeta del sistema',
    focus: 'Trazas/spans, redacción, gobernanza, pinning de release, respuesta a incidentes, contestabilidad, accesibilidad y system card.' },
]

const mk = (id, version, name, level, gate, contributing, deps, prereqs, summary, user, badge, iface, critical, extra={}) =>
  ({ id, version, name, level, gateSection: gate, contributingSections: contributing, dependencies: deps,
     prerequisites: prereqs, summary, intendedUser: user,
     datasetPath: `course-state/capstones/${id}/data/generate.py`,
     rubricPath: `course-state/capstones/${id}/RUBRIC.json`,
     briefPath: `course-state/capstones/${id}/BRIEF.md`,
     badgeId: badge, finalIntegrationInterface: iface, criticalFailures: critical, ...extra })

export const CAPSTONES: CapstoneDescriptor[] = [
  mk('CP-N1-A','2.0.0','CLI Reproducible de Admisión de Clientes y Calidad de Datos',1,'S04',['S01','S02','S03','S04'],[],['S01','S02','S03'],
    'Una aplicación de línea de comandos que captura registros sintéticos, valida campos y emite resúmenes legibles por máquina y por humano.',
    'Analista junior que ingresa clientes de prueba en un entorno de capacitación.','capstone_foundations','intake_cli.run(records) -> IntakeResult',
    ['Usa PII real','Calcula denominadores incorrectamente','No maneja entrada malformada','Sin tests']),
  mk('CP-N1-B','2.0.0','Pipeline ETL Reproducible de Clientes y Transacciones',1,'S08',['S05','S06','S07','S08'],['CP-N1-A'],['S05','S06','S07'],
    'Un pipeline local que ingiere CSV y JSON, valida contratos, separa filas aceptadas y en cuarentena, y produce salidas deterministas con manifiesto.',
    'Ingeniero de datos en formación procesando lotes sintéticos.','capstone_foundations','etl.run(batch) -> EtlManifest',
    ['Expone secretos','No es idempotente','Sin cuarentena','Pierde proveniencia']),
  mk('CP-N1-C','2.0.0','Tablero de Evidencia de Familiaridad',1,'S13',['S09','S10','S11','S12','S13'],['CP-N1-A','CP-N1-B'],['S09','S10','S11','S12'],
    'Un tablero de revisión humana que integra admisión, ETL y señales analíticas, separando evidencia de entidades, relaciones y decisiones.',
    'Analista que revisa señales de familiaridad sobre datos sintéticos.','capstone_foundations','familiarity.review(case) -> ReviewPacket',
    ['Infiere fraude/parentesco automáticamente','Sin revisión humana','Sin hoja de privacidad','Sin mecanismo de corrección']),
  mk('CP-N2-A','2.0.0','Portafolio Ejecutivo de Calidad de Datos y EDA',2,'S17',['S14','S15','S16','S17'],['CP-N1-C'],['S14','S15','S16'],
    'Un paquete analítico reproducible con diccionario, profiling, missingness, reconciliación y memo ejecutivo que distinga observación de decisión.',
    'Analista que prepara un informe ejecutivo sobre datos sintéticos.','capstone_independent','eda.profile(dataset) -> EdaReport',
    ['Interpretación causal no soportada','Sin reproducibilidad','Sin memo ejecutivo','Sin limitaciones']),
  mk('CP-N2-B','2.0.0','Fábrica de Reportes y Tablero Accesible',2,'S21',['S18','S19','S20','S21'],['CP-N2-A'],['S18','S19','S20'],
    'Un tablero accesible con plantillas reutilizables, exportación, trazabilidad fuente-claim, estados de error y operación por teclado.',
    'Analista que publica reportes accesibles para stakeholders.','capstone_independent','reports.render(spec) -> ReportBundle',
    ['Ejes engañosos','Codificación solo por color','Denominadores ocultos','Claims ejecutivos no soportados']),
  mk('CP-N2-C','2.0.0','Flujo RPA y Analista IA con Aprobación Humana',2,'S26',['S22','S23','S24','S25','S26'],['CP-N2-B'],['S22','S23','S24','S25'],
    'Un flujo de Excel → análisis → reporte → aprobación → borrador de correo, sin envío externo automático y con auditoría y rollback.',
    'Analista que automatiza un informe recurrente con control humano.','capstone_independent','rpa.run(job) -> RpaAudit',
    ['Envío externo sin aprobación','Sin idempotencia','Sin rollback','Logs con PII']),
  mk('CP-N3-A','2.0.0','Motor de Resolución de Entidades Probable',3,'S30',['S27','S28','S29','S30'],['CP-N2-C'],['S27','S28','S29'],
    'Un sistema ER con bloqueo, comparadores exactos y difusos, benchmark etiquetado, umbral y cola de revisión, sin inferir relaciones automáticamente.',
    'Ingeniero de datos que resuelve entidades sobre datos sintéticos.','capstone_advanced_applied','er.resolve(records) -> ClusterSet',
    ['Infiere relaciones automáticamente','Sin separación train/dev/test','Sin baseline determinista','Sin análisis de falsos positivos']),
  mk('CP-N3-B','2.0.0','Mesa de Trabajo de Investigación de Relaciones',3,'S34',['S31','S32','S33','S34'],['CP-N3-A'],['S31','S32','S33'],
    'Una mesa que representa entidades y evidencia como grafo explicable, con búsqueda de caminos, incertidumbre, notas y corrección, sin etiquetas automáticas de fraude.',
    'Analista que investiga relaciones sobre un grafo sintético.','capstone_advanced_applied','graph.investigate(query) -> GraphCase',
    ['Etiquetas automáticas de fraude','Sin distinción enlace directo/inferido','Sin control de autorización','Sin reproducibilidad de caso']),
  mk('CP-N3-C','2.0.0','Triaje Responsable de Casos con ML',3,'S39',['S35','S36','S37','S38','S39'],['CP-N3-B'],['S35','S36','S37','S38'],
    'Un modelo de apoyo a decisiones con baseline determinista, calibración, umbral por costos, abstención, revisión humana y tarjeta de modelo.',
    'Científico de datos que tria casos sintéticos con salvaguardas.','capstone_advanced_applied','triage.score(case) -> TriageDecision',
    ['Decisión adversa sin revisión','Fuga de datos','Sin calibración','Sin abstención']),
  mk('CP-N4-A','2.0.0','Plataforma de Servicio Python Gobernada',4,'S43',['S40','S41','S42','S43'],['CP-N3-C'],['S40','S41','S42'],
    'Un servicio estilo producción con API versionada, validación, auth, rate limits, contenedor, health checks, migraciones, backup y recovery.',
    'Ingeniero de plataforma que despliega un servicio acotado.','capstone_integrated_mastery','service.serve(request) -> ApiResponse',
    ['Ejecución como root','Sin health checks','Secretos embebidos','Sin migraciones']),
  mk('CP-N4-B','2.0.0','Plataforma de Datos y ML en Producción',4,'S47',['S44','S45','S46','S47'],['CP-N4-A'],['S44','S45','S46'],
    'Una plataforma con linaje, experimentos reproducibles, versionado, registro, SLOs, shadow/canary, aprobación y rollback demostrado.',
    'Ingeniero MLOps que gobierna modelos en un entorno acotado.','capstone_integrated_mastery','platform.deploy(model) -> DeployRecord',
    ['Sin rollback demostrado','Sin aprobación','Sin consistencia train/serve','Sin SLOs']),
  mk('CP-N4-C','3.0.0','Copiloto y Harness Auditable de Operaciones Multi-Agente con IA',4,'S51',['S48','S49','S50','S51'],['CP-N4-A','CP-N4-B'],['S48','S49','S50'],
    'Un harness multi-agente auditable con adaptadores local/comercial, RAG con citas, tools, web/SERP, presupuestos, HITL, evaluaciones, trazas y recuperación.',
    'Ingeniero de IA que opera un copiloto acotado sin claves de pago en modo determinista.','evidence_grounded_ai_systems','copilot.run(task) -> CopilotRunRecord',
    ['Bucles no acotados','RAG sin citas ni control de acceso','Contenido web tratado como instrucción','Sin HITL en efectos sensibles','Sin redacción de trazas','Sin rollback'],
    { subGates: SUB_N4C }),
  mk('CP-FINAL','2.0.0','Plataforma de Inteligencia de Relaciones y Operaciones',4,'S52',['S52'],
    ['CP-N1-A','CP-N1-B','CP-N1-C','CP-N2-A','CP-N2-B','CP-N2-C','CP-N3-A','CP-N3-B','CP-N3-C','CP-N4-A','CP-N4-B','CP-N4-C'],
    ['S04','S08','S13','S17','S21','S26','S30','S34','S39','S43','S47','S51'],
    'Integra los doce capstones previos mediante interfaces versionadas, contratos, grafo de dependencias, despliegue reproducible y pruebas end-to-end.',
    'Egresando del curso que monta una demostración integrada sobre un escenario sintético compartido.','capstone_integrated_mastery','platform.integrate(scenario) -> IntegrationBundle',
    ['Colección de repositorios sin contratos','Sin pruebas end-to-end','Sin rollback','Sin tarjetas (data/model/system)','Sin runbook operacional'],
    { isFinal: true }),
]

export const TOTAL_CAPSTONES = 13
export const LEVEL_CAPSTONE_COUNT = 3
export const FINAL_CAPSTONE_COUNT = 1
export const GATE_MAP: Record<string,string> = {
  S04:'CP-N1-A', S08:'CP-N1-B', S13:'CP-N1-C', S17:'CP-N2-A', S21:'CP-N2-B', S26:'CP-N2-C',
  S30:'CP-N3-A', S34:'CP-N3-B', S39:'CP-N3-C', S43:'CP-N4-A', S47:'CP-N4-B', S51:'CP-N4-C', S52:'CP-FINAL',
}
export function getCapstonesByLevel(level: LevelId) { return CAPSTONES.filter(c => c.level === level && !c.isFinal) }
export function getFinalCapstone() { const f = CAPSTONES.find(c => c.isFinal); if (!f) throw new Error('Final capstone missing'); return f }
export function getCapstone(id: string) { return CAPSTONES.find(c => c.id === id) }
export function assertCardinalityInvariant() {
  const counts = [1,2,3,4].map(l => getCapstonesByLevel(l as LevelId).length)
  if (!counts.every(n => n === LEVEL_CAPSTONE_COUNT)) throw new Error(`Cardinality violated: ${counts.join(',')}`)
  if (CAPSTONES.filter(c => c.isFinal).length !== 1) throw new Error('Final count violated')
  if (CAPSTONES.length !== TOTAL_CAPSTONES) throw new Error(`Total violated: ${CAPSTONES.length}`)
  if (CAPSTONES.some(c => c.id === 'CP-N4-D')) throw new Error('Hidden CP-N4-D forbidden')
  const n4c = getCapstone('CP-N4-C'); if (!n4c?.subGates || n4c.subGates.length !== 3) throw new Error('N4-C needs 3 sub-gates')
  if (getFinalCapstone().dependencies.length !== 12) throw new Error('FINAL must integrate 12')
}
