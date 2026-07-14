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
      heading: 'Fundamentos',
      paragraphs: [
        'Esta sección cubre los conceptos esenciales del tema. Estudia cada bloque de teoría con atención y no pases al siguiente sin entender completamente el anterior.',
        'La práctica es clave. Usa el editor interactivo para experimentar con cada concepto antes de pasar a los ejercicios.',
      ],
    },
  ],
  iDo: {
    intro: 'Te muestro paso a paso cómo aplicar los conceptos de esta sección con ejemplos prácticos.',
    steps: [
      {
        description: 'Demostración del concepto principal',
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
        instruction: 'Practica el concepto principal de esta sección',
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
