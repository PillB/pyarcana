import type { CourseSection } from '../../types'

export const section50: CourseSection = {
  id: 'tech-leadership',
  index: 50,
  title: 'Liderazgo Técnico — Mentoría, ADRs, RFC y Technical Writing',
  shortTitle: 'Liderazgo Técnico — Mentoría, ',
  tagline: 'El mejor ingeniero no es el que escribe el mejor código, sino el que hace mejor a todo el equipo.',
  estimatedHours: 10,
  level: 'Master',
  phase: 3,
  icon: 'Users',
  accentColor: 'bg-gradient-to-br from-amber-500 to-red-600',
  jobRelevance: 'Staff/Principal Engineer roles ($200K-$280K) son 70% comunicación y 30% código. RFCs, ADRs, mentoría y technical writing son los skills que diferencian al Senior del Staff. Sin estos, no hay promoción al siguiente nivel.',
  learningOutcomes: [
    { text: 'Escribir RFCs (Request for Comments) que consigan alineación del equipo en decisiones técnicas' },
    { text: 'Conducir code reviews constructivos: dar feedback que enseña, no critica' },
    { text: 'Mentorear juniors: cómo estructurar 1-on-1s técnicos, path de crecimiento, feedback' },
    { text: 'Comunicar trade-offs a stakeholders no técnicos: hablar de negocio, no de código' },
    { text: 'Construir roadmaps técnicos: priorización, dependencias, estimaciones honestas' },
    { text: 'Escribir documentación técnica de calidad: READMEs, runbooks, incident reports' },
  ],
  theory: [
    {
      heading: 'Liderazgo técnico: mentoría, code review y cultura de engineering',
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
        description: 'Escribir un design doc para una feature compleja de IA',
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
        instruction: 'Escribe un design doc para un feature store en tu organización',
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
    title: 'RFC + Architecture Memo',
    context: 'RFC completo para una decisión técnica real de tu proyecto (ej: \'Propuesta: migrar de PostgreSQL a DynamoDB para el servicio de sessions\'), con: contexto, propuesta, alternativas consideradas, riesgos, plan de migración, y criterios de éxito.',
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
        question: '¿Cuál de los siguientes describe mejor: Escribir RFCs (Request for Comments) que consigan alineación del equipo en decisiones técnicas?',
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
        question: '¿Cuál de los siguientes describe mejor: Conducir code reviews constructivos: dar feedback que enseña, no critica?',
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
        question: '¿Cuál de los siguientes describe mejor: Mentorear juniors: cómo estructurar 1-on-1s técnicos, path de crecimiento, feedback?',
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
        question: '¿Cuál de los siguientes describe mejor: Comunicar trade-offs a stakeholders no técnicos: hablar de negocio, no de código?',
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
        question: '¿Cuál de los siguientes describe mejor: Construir roadmaps técnicos: priorización, dependencias, estimaciones honestas?',
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
