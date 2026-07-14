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
        'Un design doc es un documento de 2-5 páginas que describe una feature compleja antes de implementarla. Estructura: (1) Context — qué problema resuelves y por qué importa, (2) Goals — qué vas a lograr específicamente, (3) Design — cómo lo vas a hacer (con diagramas), (4) Alternatives — qué otras opciones consideraste y por qué las descartaste, (5) Risks — qué puede salir mal. El design doc se comparte con stakeholders para feedback ANTES de escribir código. Esto evita que pases 2 semanas implementando algo que el equipo no quiere. En empresas serias, ningún feature complejo se implementa sin un design doc aprobado.',
        'Un postmortem blameless documenta un incidente de producción sin culpar a personas. Estructura: (1) Summary — qué pasó en 2 líneas, (2) Timeline — cronología de eventos con timestamps, (3) Root Cause — por qué pasó (usa "5 whys"), (4) Impact — cuántos usuarios/dinero/time se perdió, (5) Action Items — qué vamos a hacer para que no vuelva a pasar (con owners y deadlines). La cultura blameless es clave: si la gente tiene miedo de ser culpada, ocultan errores. Si se analiza el error sin culpa, el equipo aprende y mejora. "El engineer hizo X" → "El proceso permitió que X pasara sin ser detectado".',
        'La entrevista de system design evalúa si un candidato puede diseñar sistemas a escala. Formato: 45 minutos, pregunta abierta como "diseña un sistema de scoring crediticio en tiempo real". El candidato debe: (1) clarificar requisitos (¿cuántos QPS? ¿latencia máxima? ¿consistencia?), (2) proponer arquitectura (componentes, APIs, data flow), (3) discutir trade-offs (¿SQL vs NoSQL? ¿sync vs async? ¿batch vs streaming?), (4) identificar bottlenecks (¿DB? ¿cache? ¿compute?), (5) planear monitoreo (métricas, alertas, SLOs). Como entrevistador, evalúa: claridad de pensamiento, conocimiento de trade-offs, comunicación, y escalabilidad del diseño.',
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
