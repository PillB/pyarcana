import type { CourseSection } from '../../types'

export const section42: CourseSection = {
  id: 'graph-rag',
  index: 42,
  title: 'Graph RAG y Knowledge Graphs',
  shortTitle: 'Graph RAG y Knowledge Graphs',
  tagline: 'Cuando el texto no es suficiente — las relaciones entre entidades son la inteligencia real.',
  estimatedHours: 12,
  level: 'Master',
  phase: 3,
  icon: 'Share2',
  accentColor: 'bg-gradient-to-br from-amber-500 to-red-600',
  jobRelevance: 'GraphRAG es la frontera actual (2025-2026) en retrieval inteligente para dominios con relaciones complejas: fraud detection, recommendation, drug discovery, compliance. Master AI Engineer roles en banca y pharma valoran este skill diferenciador ($180K-$220K).',
  learningOutcomes: [
    { text: 'Construir Knowledge Graphs con Neo4j desde datos no estructurados con LLMs' },
    { text: 'Implementar GraphRAG: combinar graph traversal con LLM reasoning para respuestas más precisas' },
    { text: 'Usar py2neo y Cypher para queries de graph complejos' },
    { text: 'Aplicar entity resolution (S22) para poblar el knowledge graph sin duplicados' },
    { text: 'Entender Graph Embeddings para semantic search sobre graphs' },
    { text: 'Casos de uso: fraud detection, recommendation systems, drug discovery patterns' },
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
    title: 'Knowledge Graph + GraphRAG',
    context: 'Knowledge graph de entidades de un dominio (ej: empresas peruanas, ejecutivos, relaciones societarias) construido con LLM extraction + GraphRAG para consultas complejas que requieren razonamiento relacional.',
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
        question: '¿Cuál de los siguientes describe mejor: Construir Knowledge Graphs con Neo4j desde datos no estructurados con LLMs?',
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
        question: '¿Cuál de los siguientes describe mejor: Implementar GraphRAG: combinar graph traversal con LLM reasoning para respuestas más precisas?',
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
        question: '¿Cuál de los siguientes describe mejor: Usar py2neo y Cypher para queries de graph complejos?',
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
        question: '¿Cuál de los siguientes describe mejor: Aplicar entity resolution (S22) para poblar el knowledge graph sin duplicados?',
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
        question: '¿Cuál de los siguientes describe mejor: Entender Graph Embeddings para semantic search sobre graphs?',
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
