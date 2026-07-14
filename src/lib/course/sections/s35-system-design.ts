import type { CourseSection } from '../../types'

export const section35: CourseSection = {
  id: 'system-design',
  index: 35,
  title: 'Diseño de Sistemas de IA en Producción',
  shortTitle: 'Diseño de Sistemas de IA en Pr',
  tagline: 'El código que escala no es el más inteligente — es el mejor diseñado.',
  estimatedHours: 12,
  level: 'Senior',
  phase: 2,
  icon: 'Architecture',
  accentColor: 'bg-gradient-to-br from-purple-500 to-fuchsia-600',
  jobRelevance: 'El System Design Interview es obligatorio en FAANG y startups USA para roles Senior/Staff ($150K-$220K). ADRs son práctica estándar en equipos maduros. Diferenciador clave para promoción a Staff Engineer.',
  learningOutcomes: [
    { text: 'Aplicar patrones de diseño para sistemas AI: Command, Strategy, Observer, Factory para componentes ML' },
    { text: 'Diseñar con Architecture Decision Records (ADRs): documentar decisiones técnicas con contexto, alternativas y consecuencias' },
    { text: 'Evaluar trade-offs: latencia vs accuracy, costo vs calidad, simplicidad vs escalabilidad' },
    { text: 'Diseñar para fallo: circuit breakers, fallbacks, graceful degradation en AI systems' },
    { text: 'Modelar capacidad: cálculos de throughput, latencia, costos de tokens por volumen' },
    { text: 'Construir sistemas observables: logging estructurado, métricas de negocio, alertas' },
  ],
  theory: [
    {
      heading: 'Arquitecturas de referencia para plataformas de IA: lambda, kappa, delta',
      paragraphs: [
        'La arquitectura Lambda combina un batch layer (procesa TODO el histórico con MapReduce/Spark) y un speed layer (procesa streams en tiempo real con Kafka/Storm). Los resultados se mergean en una serving layer. La arquitectura Kappa simplifica Lambda eliminando el batch layer: todo es streaming. Si necesitas reprocesar histórico, simplemente replay el Kafka topic desde el inicio. En 2025-2026, Kappa es preferida porque reduce complejidad — un solo código base en vez de dos. Delta architecture (lakehouse con ACID) es la tercera opción: combina lo mejor de data lakes (escalabilidad, costo) y data warehouses (ACID, schema enforcement).',
        'Un feature store centraliza features para que sean consistentes entre training e inference. Sin feature store, tienes training-serving skew: el modelo se entrena con features calculadas de una forma, pero en producción se calculan diferente. Feast (open source) y Tecton (comercial) son las opciones principales. Feast define features en Python: `feature_view = FeatureView(name="user_features", features=[Feature("age", Int32), Feature("avg_spend", Float32)], source=batch_source)`. En training, `store.get_historical_features()` trae features point-in-time correctas. En inference, `store.get_online_features()` sirve features desde Redis en <10ms.',
        'Un Architecture Decision Record (ADR) documenta decisiones técnicas importantes: qué decidiste, por qué, y qué alternativas consideraste. El formato Michael Nygard es: (1) Context (qué problema resuelves), (2) Decision (qué decidiste), (3) Status (proposed/accepted/deprecated), (4) Consequences (qué implica). Los ADRs se guardan en `/docs/adr/` dentro del repo (no en Confluence — link rot). Cuando un nuevo engineer pregunta "¿por qué usamos Kafka en vez de RabbitMQ?", el ADR responde sin necesidad de buscar al autor original. Los equipos maduros tienen 50-100 ADRs que cuentan la historia técnica del proyecto.',
      ],
    },
  ],
  iDo: {
    intro: 'Te muestro paso a paso cómo aplicar los conceptos de esta sección con ejemplos prácticos.',
    steps: [
      {
        description: 'Diseñar la arquitectura de una plataforma de IA end-to-end',
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
        instruction: 'Diseña la arquitectura de un sistema de recomendación en tiempo real',
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
    title: 'Architecture Decision Record',
    context: 'ADR completo para el sistema de la sección 34 (Smart CCTV) con: context, decision drivers, opciones consideradas, decisión final, consecuencias y plan de validación.',
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
        question: '¿Cuál de los siguientes describe mejor: Aplicar patrones de diseño para sistemas AI: Command, Strategy, Observer, Factory para componentes ML?',
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
        question: '¿Cuál de los siguientes describe mejor: Diseñar con Architecture Decision Records (ADRs): documentar decisiones técnicas con contexto, alternativas y consecuencias?',
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
        question: '¿Cuál de los siguientes describe mejor: Evaluar trade-offs: latencia vs accuracy, costo vs calidad, simplicidad vs escalabilidad?',
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
        question: '¿Cuál de los siguientes describe mejor: Diseñar para fallo: circuit breakers, fallbacks, graceful degradation en AI systems?',
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
        question: '¿Cuál de los siguientes describe mejor: Modelar capacidad: cálculos de throughput, latencia, costos de tokens por volumen?',
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
