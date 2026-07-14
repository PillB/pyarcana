import type { CourseSection } from '../../types'

export const section48: CourseSection = {
  id: 'ai-governance',
  index: 48,
  title: 'Gobernanza de IA, Ética y Compliance',
  shortTitle: 'Gobernanza de IA, Ética y Comp',
  tagline: 'La IA sin gobernanza es como un auto sin frenos — puede funcionar a gran velocidad hasta que choca.',
  estimatedHours: 10,
  level: 'Master',
  phase: 3,
  icon: 'Scale',
  accentColor: 'bg-gradient-to-br from-amber-500 to-red-600',
  jobRelevance: 'La EU AI Act (en vigor 2026) y el Executive Order de Biden/Trump sobre AI tienen implicaciones directas para empresas que operan sistemas de IA. Los roles de AI Engineer senior en enterprises requieren conocimiento de compliance. Este es un diferenciador enorme en el mercado.',
  learningOutcomes: [
    { text: 'Entender EU AI Act (2026): categorías de riesgo (unacceptable, high, limited, minimal), obligaciones por nivel' },
    { text: 'Aplicar ISO 42001 (AI Management Systems) para organizaciones' },
    { text: 'Construir un AI governance framework: model cards, datasheets, fairness assessments' },
    { text: 'Implementar fairness metrics con fairlearn: demographic parity, equalized odds' },
    { text: 'Detectar y mitigar bias en datasets con herramientas de ML fairness' },
    { text: 'Construir audit trails para sistemas de IA de alto riesgo (GDPR + AI Act compliance)' },
  ],
  theory: [
    {
      heading: 'Gobernanza de IA: frameworks, policies y compliance',
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
        description: 'Implementar bias detection en un modelo de scoring crediticio',
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
        instruction: 'Implementa fairness metrics en un modelo con fairlearn',
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
    title: 'AI Governance Framework',
    context: 'Documento de governance para el sistema de churn prediction (S10) con: model card, datasheet, fairness assessment con fairlearn, audit trail, y mapa de riesgos EU AI Act.',
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
        question: '¿Cuál de los siguientes describe mejor: Entender EU AI Act (2026): categorías de riesgo (unacceptable, high, limited, minimal), obligaciones por nivel?',
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
        question: '¿Cuál de los siguientes describe mejor: Aplicar ISO 42001 (AI Management Systems) para organizaciones?',
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
        question: '¿Cuál de los siguientes describe mejor: Construir un AI governance framework: model cards, datasheets, fairness assessments?',
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
        question: '¿Cuál de los siguientes describe mejor: Implementar fairness metrics con fairlearn: demographic parity, equalized odds?',
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
        question: '¿Cuál de los siguientes describe mejor: Detectar y mitigar bias en datasets con herramientas de ML fairness?',
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
