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
        question: '¿Qué es dbt y qué problema resuelve?',
        options: [
          'Transforma datos con SQL declarativo y testeable — define dependencias automáticamente y materializa como tablas/views en la DB',
          'dbt es un reemplazo de SQL',
          'dbt es un framework web',
          'dbt es un ORM como SQLAlchemy',
        ],
        correctIndex: 0,
        explanation: 'dbt (data build tool) transforma datos en SQL: un modelo es un SELECT que se materializa como tabla. dbt resuelve dependencias automáticamente (si B hace JOIN con A, ejecuta A primero). Elimina scripts SQL con orden manual.',
      },
      {
        question: '¿Qué es un modelo incremental en dbt?',
        options: [
          'Solo procesa registros nuevos desde la última ejecución — usa unique_key para MERGE (upsert), reduciendo costo y tiempo drásticamente',
          'Un modelo que se actualiza cada segundo',
          'Un modelo con menos columnas',
          'Un modelo temporal que se borra después',
        ],
        correctIndex: 0,
        explanation: 'Incremental: en vez de reprocesar 10M de filas cada noche, solo procesa las nuevas del día. Con unique_key="event_id", dbt hace MERGE (upsert). Sin unique_key, hace INSERT y duplica en re-runs.',
      },
      {
        question: '¿Qué son los dbt tests?',
        options: [
          'Validaciones de integridad de datos: not_null, unique, accepted_values, relationships — si fallan, el pipeline se detiene',
          'Tests unitarios de código Python',
          'Tests de rendimiento de queries',
          'Tests de seguridad de la base de datos',
        ],
        correctIndex: 0,
        explanation: 'dbt tests son assertions: expect_column_to_not_be_null, expect_column_values_to_be_unique. Si un test falla, el build se detiene. Previene que datos corruptos propaguen a dashboards y modelos ML.',
      },
      {
        question: '¿Qué hace `dbt docs generate`?',
        options: [
          'Genera un sitio HTML con documentación de cada modelo, descripciones de columnas, tests, y linaje visual de datos',
          'Genera documentación de código Python',
          'Genera un PDF con el diseño de la DB',
          'Genera un diagrama ER',
        ],
        correctIndex: 0,
        explanation: 'dbt docs generate crea un sitio web navegable: clic en cualquier modelo y ves su SQL, descripciones, tests, y qué modelos dependen de él. El linaje visual muestra el flujo de datos desde sources hasta modelos finales.',
      },
      {
        question: '¿Qué es partitioning en BigQuery y por qué reduce costos?',
        options: [
          'Divide la tabla por fecha — al consultar con WHERE date >= CURRENT_DATE()-7, BigQuery solo escanea 7 días en vez de toda la tabla, reduciendo costo 100x',
          'Es dividir la tabla en múltiples archivos',
          'Es un tipo de índice',
          'Es comprimir los datos',
        ],
        correctIndex: 0,
        explanation: 'BigQuery cobra por bytes escaneados. Sin partitioning, un SELECT escanea toda la tabla (10GB = $0.05 por query). Con partitioning por fecha, WHERE date >= "2026-01-01" solo escanea esa partición (100MB = $0.0005). 100x más barato.',
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
