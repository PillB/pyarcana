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
        'Esta sección cubre los conceptos esenciales del tema. Estudia cada bloque de teoría con atención y no pases al siguiente sin entender completamente el anterior.',
        'La práctica es clave. Usa el editor interactivo para experimentar con cada concepto antes de pasar a los ejercicios.',
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
        question: '¿Cuál de los siguientes describe mejor: Implementar data contracts con soda-core o great_expectations para garantías entre productores y consumidores?',
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
        question: '¿Cuál de los siguientes describe mejor: Usar Apache Iceberg para data lake con ACID transactions y time travel?',
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
        question: '¿Cuál de los siguientes describe mejor: Construir un data mesh: ownership por dominio, productos de datos autodescriptivos?',
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
        question: '¿Cuál de los siguientes describe mejor: Implementar data lineage completo con OpenLineage/Marquez?',
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
        question: '¿Cuál de los siguientes describe mejor: Versionado de schemas con Confluent Schema Registry (Avro/Protobuf)?',
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
