import type { CourseSection } from '../../types'

export const section43: CourseSection = {
  id: 'llmops',
  index: 43,
  title: 'LLMOps — Observabilidad, Evaluación, A/B Testing',
  shortTitle: 'LLMOps — Observabilidad, Evalu',
  tagline: 'Los LLMs en producción sin observabilidad son cajas negras con costos impredecibles.',
  estimatedHours: 12,
  level: 'Master',
  phase: 3,
  icon: 'BarChart3',
  accentColor: 'bg-gradient-to-br from-amber-500 to-red-600',
  jobRelevance: 'LLMOps es la disciplina emergente (2025-2026) que aplica MLOps a LLMs. Senior AI Engineer roles en enterprises ($150K-$200K) ya exigen experiencia con LangSmith, prompt versioning, A/B testing de prompts y monitoreo de costos. Es la frontera donde se separa \'demo de LLM\' de \'producto de LLM\'.',
  learningOutcomes: [
    { text: 'Implementar tracing completo con LangSmith + OpenTelemetry para LLM calls' },
    { text: 'Construir evaluación continua: RAGAS en producción, LLM-as-judge para calidad' },
    { text: 'Implementar prompt versioning: gestionar cambios de prompts como código (GitOps)' },
    { text: 'A/B testing de modelos y prompts con traffic splitting y métricas de negocio' },
    { text: 'Monitorear costos de tokens en tiempo real con alertas y budgets' },
    { text: 'Construir un feedback loop: usuarios califican respuestas → datos para mejorar modelo' },
  ],
  theory: [
    {
      heading: 'LLMOps fundamentals: observabilidad, evaluación y A/B testing para LLMs',
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
        description: 'Configurar LangSmith tracing para visualizar el razonamiento del LLM',
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
        instruction: 'Implementa tracing con LangSmith en un pipeline RAG y analiza latencia',
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
    title: 'LLMOps Dashboard',
    context: 'Dashboard de Grafana/Streamlit que muestra: token costs en tiempo real, respuestas evaluadas por LLM-as-judge, prompt performance tracking, y alertas de costo.',
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
        question: '¿Cuál de los siguientes describe mejor: Implementar tracing completo con LangSmith + OpenTelemetry para LLM calls?',
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
        question: '¿Cuál de los siguientes describe mejor: Construir evaluación continua: RAGAS en producción, LLM-as-judge para calidad?',
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
        question: '¿Cuál de los siguientes describe mejor: Implementar prompt versioning: gestionar cambios de prompts como código (GitOps)?',
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
        question: '¿Cuál de los siguientes describe mejor: A/B testing de modelos y prompts con traffic splitting y métricas de negocio?',
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
        question: '¿Cuál de los siguientes describe mejor: Monitorear costos de tokens en tiempo real con alertas y budgets?',
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
