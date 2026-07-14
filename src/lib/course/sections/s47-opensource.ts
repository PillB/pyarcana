import type { CourseSection } from '../../types'

export const section47: CourseSection = {
  id: 'opensource',
  index: 47,
  title: 'Contribución Open Source y Diseño de APIs Públicas',
  shortTitle: 'Contribución Open Source y Dis',
  tagline: 'El mejor CV para un Senior/Staff Engineer es el historial de contribuciones open source.',
  estimatedHours: 12,
  level: 'Master',
  phase: 3,
  icon: 'Github',
  accentColor: 'bg-gradient-to-br from-amber-500 to-red-600',
  jobRelevance: 'El historial de contribuciones open source en GitHub es uno de los predictores más fuertes de contratación en empresas top (FAANG, Anthropic, OpenAI, Stripe). Publicar un paquete con comunidad activa es diferenciador enorme para Staff Engineer ($200K-$280K).',
  learningOutcomes: [
    { text: 'Proceso de contribución a proyectos open source: issues, PRs, code review, CI' },
    { text: 'Diseñar APIs públicas: principios de diseño (backward compatibility, versioning, documentation)' },
    { text: 'Construir y publicar un paquete Python con funcionalidades genuinamente útiles para la comunidad' },
    { text: 'Escribir documentación de calidad con Sphinx + ReadTheDocs + API reference auto-generada' },
    { text: 'Gestionar versiones con Conventional Commits + CHANGELOG automático con git-cliff' },
    { text: 'Construir una comunidad alrededor de un proyecto: README atractivo, ejemplos, Discord' },
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
    title: 'Open Source Package Publicado',
    context: 'Publica un paquete Python original en PyPI con ≥ 5 GitHub stars en la primera semana: elegir una herramienta que hayas necesitado y no existía, o mejora significativa de algo existente.',
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
        question: '¿Cuál de los siguientes describe mejor: Proceso de contribución a proyectos open source: issues, PRs, code review, CI?',
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
        question: '¿Cuál de los siguientes describe mejor: Diseñar APIs públicas: principios de diseño (backward compatibility, versioning, documentation)?',
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
        question: '¿Cuál de los siguientes describe mejor: Construir y publicar un paquete Python con funcionalidades genuinamente útiles para la comunidad?',
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
        question: '¿Cuál de los siguientes describe mejor: Escribir documentación de calidad con Sphinx + ReadTheDocs + API reference auto-generada?',
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
        question: '¿Cuál de los siguientes describe mejor: Gestionar versiones con Conventional Commits + CHANGELOG automático con git-cliff?',
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
