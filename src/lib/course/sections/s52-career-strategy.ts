import type { CourseSection } from '../../types'

export const section52: CourseSection = {
  id: 'career-strategy',
  index: 52,
  title: 'Perfil Global y Estrategia de Carrera',
  shortTitle: 'Perfil Global y Estrategia de ',
  tagline: 'El trabajo de tu vida necesita la presentación de tu vida.',
  estimatedHours: 8,
  level: 'Master',
  phase: 3,
  icon: 'Rocket',
  accentColor: 'bg-gradient-to-br from-amber-500 to-red-600',
  jobRelevance: 'Cierre del roadmap con foco en empaquetar las 52 secciones en una presentación profesional para el mercado global. Sin esto, todo el trabajo técnico no se traduce en oportunidades reales. Cubre portfolio site, LinkedIn, CV ATS-friendly, entrevistas y networking estratégico.',
  learningOutcomes: [
    { text: 'Construir un portfolio site profesional con GitHub Pages o Vercel' },
    { text: 'Optimizar LinkedIn para visibilidad en recruiters de USA/Europa' },
    { text: 'Escribir un CV técnico que pase ATS y llame la atención de hiring managers' },
    { text: 'Prepararse para entrevistas técnicas en empresas globales: system design, coding, ML design' },
    { text: 'Estrategia de networking: contribución open source, conferencias, comunidades' },
    { text: 'Establecer tarifas como freelancer/contractor en plataformas globales (Toptal, Turing, Andela)' },
    { text: 'Plan de carrera 3 años: Junior → Mid → Senior → Staff en el mercado global' },
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
    title: 'Portfolio Site + CV Global',
    context: 'Sitio web de portfolio desplegado públicamente con bio, proyectos, skills, blog; CV en inglés y español, optimizado para ATS, con métricas reales de cada proyecto; LinkedIn profile optimizado con keywords de las 52 secciones del roadmap; \'Job hunt kit\': lista de 20 empresas target, email templates, pitch de 30 segundos.',
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
        question: '¿Cuál de los siguientes describe mejor: Construir un portfolio site profesional con GitHub Pages o Vercel?',
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
        question: '¿Cuál de los siguientes describe mejor: Optimizar LinkedIn para visibilidad en recruiters de USA/Europa?',
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
        question: '¿Cuál de los siguientes describe mejor: Escribir un CV técnico que pase ATS y llame la atención de hiring managers?',
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
        question: '¿Cuál de los siguientes describe mejor: Prepararse para entrevistas técnicas en empresas globales: system design, coding, ML design?',
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
        question: '¿Cuál de los siguientes describe mejor: Estrategia de networking: contribución open source, conferencias, comunidades?',
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
