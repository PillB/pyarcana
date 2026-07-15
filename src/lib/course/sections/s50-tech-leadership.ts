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
          code: '# Design Doc: estructura para feature compleja\n# 1. Context: que problema resuelves y por que importa\n# 2. Goals: que vas a lograr (metricas)\n# 3. Design: como lo vas a hacer (con diagramas)\n# 4. Alternatives: que mas consideraste y descartaste\n# 5. Risks: que puede salir mal\n\n# Ejemplo: Sistema de Scoring Crediticio Real-Time\n# Goal: latencia p99 < 100ms, 10K QPS, 99.9% uptime\n# Design: FastAPI + XGBoost + Redis cache + Prometheus\n# Alt: Batch (descartado, necesitan tiempo real)\n# Risk: Feature drift (mitigar con Evidently)\nprint("Design Doc: alinea stakeholders antes de implementar")',
        },
        why: 'Un design doc alinea stakeholders antes de implementar. Documentar alternatives y risks previene preguntas meses despues. El formato es conciso pero completo.',
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
          code: '# Postmortem blameless template\n# Summary: API caida 23 min, 12K requests fallidos\n# Timeline: 12:03 alerta -> 12:05 investigacion -> 12:15 rollback -> 12:26 restaurado\n# Root Cause (5 Whys):\n#   1. Por que cayo? Redis pool agotado\n#   2. Por que? Codigo nuevo no cerraba connections\n#   3. Por que no se detecto? No habia test de connection pooling\n#   4. Por que? CI no cubre integracion con Redis\n#   5. Por que? Falta contract testing\n# Action Items: [ ] Redis en docker-compose test, [ ] contract test, [ ] alerta > 80%\nprint("Postmortem blameless: sin culpar personas, mejora procesos")',
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
        question: '¿Qué es un design doc y cuándo se escribe?',
        options: [
          'Documento de 2-5 páginas que describe una feature compleja ANTES de implementarla: contexto, goals, diseño, alternativas, riesgos — se comparte para feedback',
          'Un documento de diseño gráfico',
          'Un manual de usuario',
          'Un diagrama de arquitectura',
        ],
        correctIndex: 0,
        explanation: 'Design doc: (1) Context (qué problema resuelves), (2) Goals (qué vas a lograr), (3) Design (cómo, con diagramas), (4) Alternatives (qué más consideraste), (5) Risks (qué puede fallar). Se comparte ANTES de codear. Evita pasar 2 semanas implementando algo que el equipo no quiere.',
      },
      {
        question: '¿Qué es un postmortem blameless?',
        options: [
          'Documento que analiza un incidente de producción SIN culpar personas — se centra en procesos: timeline, root cause (5 whys), action items con owners',
          'Un obituario del proyecto',
          'Un reporte de finanzas',
          'Una evaluación de desempeño',
        ],
        correctIndex: 0,
        explanation: 'Blameless postmortem: "El engineer hizo X" → "El proceso permitió que X pasara sin ser detectado". Cultura de learning, no punishment. Si la gente tiene miedo de ser culpada, ocultan errores. Estructura: Summary, Timeline, Root Cause, Impact, Action Items (con owners y deadlines).',
      },
      {
        question: '¿Qué evalúas en una entrevista de system design?',
        options: [
          'Clarificación de requisitos, propuesta de arquitectura, trade-offs (SQL vs NoSQL, sync vs async), bottlenecks, y plan de monitoreo — en 45 min',
          'Solo si el candidato sabe Python',
          'Solo si el candidato tiene certificaciones',
          'Solo la personalidad del candidato',
        ],
        correctIndex: 0,
        explanation: 'System design interview (45 min): "diseña un sistema de scoring crediticio en tiempo real". Se evalúa: (1) clarifica QPS/latencia/consistencia, (2) propone arquitectura con componentes, (3) discute trade-offs, (4) identifica bottlenecks, (5) planea monitoreo. Es lo que diferencia Senior de Mid.',
      },
      {
        question: '¿Qué es un RFC (Request for Comments)?',
        options: [
          'Documento que propone un cambio técnico significativo y pide feedback del equipo antes de implementar — más formal que un design doc, más structured que un email',
          'Un protocolo de red',
          'Un framework de testing',
          'Un tipo de licencia',
        ],
        correctIndex: 0,
        explanation: 'RFC: "Propongo migrar de RabbitMQ a Kafka por X razones. Impacto: Y. Alternativas: Z". El equipo comenta en el documento. Después de N comentarios y revisiones, se aprueba o rechaza. Los RFCs se guardan en /docs/rfcs/ del repo. Son la memoria institucional del equipo técnico.',
      },
      {
        question: '¿Qué es tech debt y cómo se gestiona?',
        options: [
          'Deuda acumulada por decisiones rápidas/sucias — se gestiona documentándola en un backlog, asignando 20% del tiempo de cada sprint a pagarla, y priorizando por impacto',
          'Es deuda financiera de la empresa',
          'Es el costo de licencias de software',
          'Es el salario de los desarrolladores',
        ],
        correctIndex: 0,
        explanation: 'Tech debt: "usamos un dict en vez de una clase porque teníamos prisa, ahora hay 50 lugares que dependen de ese dict". Se gestiona: (1) documentar en el backlog (no en la cabeza del lead), (2) 20% del sprint va a tech debt, (3) priorizar por impacto (lo que causa más bugs primero). Ignorar tech debt hace que cada nueva feature tome 2x más.',
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
