import type { CourseSection } from '../../types'

export const section37: CourseSection = {
  id: 'dbt-bigquery',
  index: 37,
  title: 'Data Engineering con dbt y Snowflake/BigQuery',
  shortTitle: 'Data Engineering con dbt y Sno',
  tagline: 'El modern data stack que usan las empresas Fortune 500.',
  estimatedHours: 12,
  level: 'Senior',
  phase: 2,
  icon: 'Layers',
  accentColor: 'bg-gradient-to-br from-purple-500 to-fuchsia-600',
  jobRelevance: 'dbt + Snowflake/BigQuery es el Modern Data Stack estándar en Fortune 500 y startups USA ($110K-$150K para Data Engineers). dbt se ha vuelto obligatorio en ofertas de Data Engineer Senior. Snowflake/BigQuery son los warehouses dominantes.',
  learningOutcomes: [
    { text: 'Entender el Modern Data Stack: ingesta (Fivetran/Airbyte) → transformación (dbt) → BI (Metabase/Looker)' },
    { text: 'Crear modelos dbt: staging, intermediate, marts — naming conventions y materializations' },
    { text: 'Escribir tests dbt: not_null, unique, relationships, custom SQL tests' },
    { text: 'Entender Snowflake architecture: virtual warehouses, time travel, clone' },
    { text: 'Conectar Python a BigQuery/Snowflake para análisis con pandas' },
    { text: 'Implementar data lineage con dbt docs + dbt docs generate' },
    { text: 'Gestionar entornos (dev/staging/prod) con dbt profiles' },
  ],
  theory: [
    {
      heading: 'dbt fundamentals: models, sources, tests, snapshots y materializaciones',
      paragraphs: [
        'dbt (data build tool) transforma datos en SQL de forma declarativa y testeable. Un modelo dbt es un SELECT statement que se materializa como tabla, view, o incremental. La magia de dbt: define dependencias automáticamente (si modelo B hace JOIN con modelo A, dbt ejecuta A antes de B). Esto elimina el caos de scripts SQL con orden de ejecución manual. En BigQuery, dbt aprovecha partitioning (PARTITION BY date) y clustering (CLUSTER BY user_id) para optimizar queries y reducir costos. Una tabla particionada por fecha y consultada con `WHERE date >= CURRENT_DATE() - 7` cuesta 100x menos que un full scan.',
        'Los modelos incrementales son la clave para datasets grandes. Un modelo incremental solo procesa registros nuevos desde la última ejecución, no toda la tabla. Se configura con `materialized="incremental"` y un filtro temporal: `WHERE event_date > (SELECT max(event_date) FROM {{ this }})`. Sin `unique_key`, dbt hace INSERT (duplicados en re-runs). Con `unique_key="event_id"`, dbt hace MERGE (upsert). El error #1: olvidar `unique_key` y tener duplicados cada vez que el pipeline corre dos veces en un día.',
        'dbt tests validan integridad de datos en cada modelo. Los tests genéricos incluyen: `not_null` (la columna no tiene nulls), `unique` (no hay valores duplicados), `accepted_values` (solo ciertos valores permitidos), `relationships` (integridad referencial — cada foreign key existe en la tabla padre). Si un test falla, el pipeline se detiene con error. Esto previene que datos corruptos propaguen a dashboards y modelos de ML. La regla: cada columna crítica (IDs, fechas, montos) debe tener al menos un test.',
      ],
    },
  ],
  iDo: {
    intro: 'Te muestro paso a paso cómo aplicar los conceptos de esta sección con ejemplos prácticos.',
    steps: [
      {
        description: 'Construir un proyecto dbt con 5 modelos transformando datos',
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
        instruction: 'Crea un modelo dbt que transforme transacciones en métricas diarias',
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
    title: 'Modern Data Stack Pipeline',
    context: 'Pipeline completo con Airbyte (ingesta), dbt (transformaciones con tests), PostgreSQL/BigQuery (warehouse), y dashboard Streamlit sobre los marts de dbt.',
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
        question: '¿Cuál de los siguientes describe mejor: Entender el Modern Data Stack: ingesta (Fivetran/Airbyte) → transformación (dbt) → BI (Metabase/Looker)?',
        options: [
          'Respuesta correcta',
          'Respuesta incorrecta 1',
          'Respuesta incorrecta 2',
          'Respuesta incorrecta 3',
        ],
        correctIndex: 0,
        explanation: 'Esta es la respuesta correcta porque aplica el concepto de manera precisa.',
      },
      {
        question: '¿Cuál de los siguientes describe mejor: Crear modelos dbt: staging, intermediate, marts — naming conventions y materializations?',
        options: [
          'Respuesta correcta',
          'Respuesta incorrecta 1',
          'Respuesta incorrecta 2',
          'Respuesta incorrecta 3',
        ],
        correctIndex: 0,
        explanation: 'Esta es la respuesta correcta porque aplica el concepto de manera precisa.',
      },
      {
        question: '¿Cuál de los siguientes describe mejor: Escribir tests dbt: not_null, unique, relationships, custom SQL tests?',
        options: [
          'Respuesta correcta',
          'Respuesta incorrecta 1',
          'Respuesta incorrecta 2',
          'Respuesta incorrecta 3',
        ],
        correctIndex: 0,
        explanation: 'Esta es la respuesta correcta porque aplica el concepto de manera precisa.',
      },
      {
        question: '¿Cuál de los siguientes describe mejor: Entender Snowflake architecture: virtual warehouses, time travel, clone?',
        options: [
          'Respuesta correcta',
          'Respuesta incorrecta 1',
          'Respuesta incorrecta 2',
          'Respuesta incorrecta 3',
        ],
        correctIndex: 0,
        explanation: 'Esta es la respuesta correcta porque aplica el concepto de manera precisa.',
      },
      {
        question: '¿Cuál de los siguientes describe mejor: Conectar Python a BigQuery/Snowflake para análisis con pandas?',
        options: [
          'Respuesta correcta',
          'Respuesta incorrecta 1',
          'Respuesta incorrecta 2',
          'Respuesta incorrecta 3',
        ],
        correctIndex: 0,
        explanation: 'Esta es la respuesta correcta porque aplica el concepto de manera precisa.',
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
