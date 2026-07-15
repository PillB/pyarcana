import type { CourseSection } from '../../types'

export const section49: CourseSection = {
  id: 'data-contracts',
  index: 49,
  title: 'Data Contracts e Ingeniería de Datos Avanzada',
  shortTitle: 'Data Contracts e Ingeniería de',
  tagline: 'Los datos sin contratos son promesas sin firma — nadie sabe qué esperar.',
  estimatedHours: 12,
  level: 'Master',
  phase: 3,
  icon: 'FileCheck',
  accentColor: 'bg-gradient-to-br from-amber-500 to-red-600',
  jobRelevance: 'Data Contracts son la frontera (2024-2026) del Data Engineering maduro. Empresas data-driven (Netflix, Airbnb, Spotify) los adoptan para escalar sin chaos. Staff/Principal Data Engineer roles ($180K-$240K) los exigen como práctica estándar.',
  learningOutcomes: [
    { text: 'Implementar data contracts con soda-core o great_expectations para garantías entre productores y consumidores' },
    { text: 'Usar Apache Iceberg para data lake con ACID transactions y time travel' },
    { text: 'Construir un data mesh: ownership por dominio, productos de datos autodescriptivos' },
    { text: 'Implementar data lineage completo con OpenLineage/Marquez' },
    { text: 'Versionado de schemas con Confluent Schema Registry (Avro/Protobuf)' },
    { text: 'Gestionar data quality SLAs con métricas y alertas automatizadas' },
  ],
  theory: [
    {
      heading: 'Data Contracts: definiendo acuerdos entre productores y consumidores',
      paragraphs: [
        'Un data contract es un acuerdo formal entre quien produce datos y quien los consume. Define: schema (columnas, tipos), quality rules (no nulls, rangos válidos), SLAs (frescura máxima), y ownership (quién responde cuando algo falla). Sin data contracts, el productor puede cambiar una columna de int a float sin avisar, y el pipeline del consumidor se rompe en producción a las 3am. Con data contracts, el cambio requiere una nueva versión del contrato (backward compatible o con migración planificada). En Python, pydantic define el schema: `class Transaction(BaseModel): id: str; amount: PositiveFloat; date: datetime`.',
        'Great Expectations valida data contracts en cada paso del pipeline. Defines Expectation Suites: `expect_column_to_not_be_null("user_id")`, `expect_column_values_to_be_unique("transaction_id")`, `expect_column_values_to_be_between("amount", min_value=0, max_value=100000)`. Si una expectation falla, el pipeline se detiene con error y notifica al owner. Esto previene que datos corruptos propaguen a dashboards y modelos de ML. La integración con dbt es directa: dbt tests son una forma lightweight de data contracts, y Great Expectations es la versión heavy-duty para pipelines críticos.',
        'OpenLineage captura metadata de cada paso del pipeline automáticamente: qué dataset se leyó, qué transformación se aplicó, qué dataset se escribió, quién lo ejecutó, cuándo. Esto construye un grafo de linaje que responde: "si la tabla `user_features` tiene un bug, ¿qué dashboards y modelos de ML se ven afectados?" Sin linaje, investigar el impacto de un cambio de datos es manual y propenso a errores. OpenLineage se integra con Prefect, Airflow, dbt, y Spark — cada herramienta reporta su lineage automáticamente a un backend (Marquez o DataHub) donde se visualiza como un DAG.',
      ],
    },
  ],
  iDo: {
    intro: 'Te muestro paso a paso cómo aplicar los conceptos de esta sección con ejemplos prácticos.',
    steps: [
      {
        description: 'Definir un data contract con pydantic + Great Expectations',
        code: {
          language: 'python',
          title: 'demo.py',
          code: '# Demostración del concepto\nprint("Hola desde la demostración")',
        },
        why: 'Esta demostración te muestra cómo aplicar el concepto en un caso real.',
      },
    ],
  },
  weDo: {
    intro: 'Ahora te toca a ti practicar con guía. Lee cada instrucción, intenta escribir el código, y si te trabas revisa la solución.',
    steps: [
      {
        instruction: 'Define un data contract para transacciones con pydantic',
        hint: 'Revisa la teoría y el I Do antes de intentar este ejercicio.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución de referencia\nprint("Solución")',
        },
      },
    ],
  },
  youDo: {
    title: 'Data Contract System',
    context: 'Sistema de data contracts para el pipeline ETL del curso: contrato definido para cada dataset, validación automática en cada ingesta, lineage graph completo, y alertas de violación de SLA.',
    objectives: [
      'Aplicar los conceptos aprendidos en un proyecto real',
      'Demostrar dominio del tema con un entregable de portafolio',
      'Documentar el proceso y los resultados',
    ],
    requirements: [
      'Código funcional y documentado',
      'Tests que validen el funcionamiento',
      'README con instrucciones de uso',
    ],
    portfolioNote: 'Este proyecto es ideal para mostrar en entrevistas técnicas y agregar a tu portafolio de GitHub.',
    rubric: [
      { criterion: 'Funcionalidad', weight: '40%' },
      { criterion: 'Calidad de código', weight: '20%' },
      { criterion: 'Documentación', weight: '20%' },
      { criterion: 'Tests', weight: '20%' },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: '¿Qué es un data contract?',
        options: [
          'Acuerdo formal entre productor y consumidor de datos: define schema, quality rules, SLAs, y ownership — previene que cambios rompan pipelines',
          'Un contrato legal de compra de datos',
          'Un tipo de licencia de software',
          'Un acuerdo de confidencialidad',
        ],
        correctIndex: 0,
        explanation: 'Un data contract define: schema (columnas, tipos), quality rules (not_null, unique), SLAs (frescura máxima: < 1 hora), ownership (quién responde cuando falla). Sin contracts, el productor cambia una columna de int a float y rompe el pipeline del consumidor a las 3am.',
      },
      {
        question: '¿Qué hace Great Expectations en un data contract?',
        options: [
          'Valida quality rules en cada paso del pipeline: not_null, unique, between, relationships — si una expectation falla, el pipeline se detiene',
          'Genera expectativas de rendimiento',
          'Predice valores futuros',
          'Crea dashboards',
        ],
        correctIndex: 0,
        explanation: 'Great Expectations define Expectation Suites: expect_column_to_not_be_null("user_id"), expect_column_values_to_be_unique("transaction_id"), expect_column_values_to_be_between("amount", 0, 100000). Si falla, el pipeline se detiene y notifica al owner.',
      },
      {
        question: '¿Qué es OpenLineage?',
        options: [
          'Captura metadata de cada paso del pipeline: qué dataset se leyó, qué transformación se aplicó, quién lo ejecutó, cuándo — construye linaje de datos automáticamente',
          'Un sistema de control de versiones',
          'Un framework de testing',
          'Un ORM',
        ],
        correctIndex: 0,
        explanation: 'OpenLineage reporta automáticamente: "el job X leyó la tabla A, aplicó transformación Y, escribió la tabla B". Se integra con Prefect, Airflow, dbt, Spark. El linaje responde: "si la tabla user_features tiene un bug, ¿qué dashboards y modelos se ven afectados?"',
      },
      {
        question: '¿Qué es schema evolution con Avro?',
        options: [
          'Permite cambiar el schema de datos sin romper consumidores: añadir campos opcionales es backward compatible; eliminar campos requiere deprecación',
          'Es un sistema de versiones para bases de datos',
          'Es un formato de compresión',
          'Es un algoritmo de encriptación',
        ],
        correctIndex: 0,
        explanation: 'Avro schema evolution: añadir un campo con default es backward compatible (consumidores viejos lo ignoran). Eliminar un campo rompe consumidores que lo usan. Regla: depreca primero (marca como obsoleto), espera N versiones, luego elimina. Schema Registry valida compatibilidad.',
      },
      {
        question: '¿Cómo defines un data contract con pydantic?',
        options: [
          'class Transaction(BaseModel): id: str; amount: PositiveFloat; timestamp: datetime — pydantic valida tipos y restricciones en runtime',
          'Definiendo un diccionario Python',
          'Escribiendo un archivo JSON',
          'Usando type hints sin validación',
        ],
        correctIndex: 0,
        explanation: 'pydantic BaseModel define el contrato: Transaction(id="tx1", amount=150.50, timestamp=datetime.now()). Si amount=-5, pydantic lanza ValidationError. Si falta un campo requerido, también. Es validación automática en runtime sin código manual.',
      },
    ],
  },
  resources: {
    docs: [
      { label: 'Documentación oficial', url: 'https://docs.python.org/3/' },
    ],
    books: [
      { label: 'Python 201 — Michael Driscoll', note: 'Capítulos relevantes para esta sección' },
    ],
    courses: [
      { label: 'Real Python', url: 'https://realpython.com', note: 'Tutoriales complementarios' },
    ],
  },
}
