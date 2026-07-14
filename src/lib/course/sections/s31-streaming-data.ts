import type { CourseSection } from '../../types'

export const section31: CourseSection = {
  id: 'streaming-data',
  index: 31,
  title: 'Streaming de Datos en Tiempo Real',
  shortTitle: 'Streaming de Datos en Tiempo R',
  tagline: 'Los datos que esperan son datos muertos. El streaming los mantiene vivos.',
  estimatedHours: 12,
  level: 'Senior',
  phase: 2,
  icon: 'Radio',
  accentColor: 'bg-gradient-to-br from-purple-500 to-fuchsia-600',
  jobRelevance: 'Sistemas de streaming en tiempo real son un skill diferenciador para roles Senior Data Engineer ($110K-$150K). Kafka es el estándar industrial para event-driven architectures. Conecta directamente con el sistema CV (S23) para eventos de detección en tiempo real.',
  learningOutcomes: [
    { text: 'Producir y consumir mensajes con Apache Kafka via confluent-kafka-python' },
    { text: 'Usar Redis Streams como alternativa ligera para casos sin Kafka' },
    { text: 'Procesar streams con faust (Python-native Kafka stream processing)' },
    { text: 'Implementar exactly-once semantics y offset management' },
    { text: 'Construir pipelines streaming + batch (Lambda architecture)' },
    { text: 'Integrar streaming con el pipeline CV de la sección 23 (events de detección)' },
  ],
  theory: [
    {
      heading: 'Arquitecturas de streaming: Kafka vs Redis Streams vs RabbitMQ',
      paragraphs: [
        'Apache Kafka es el estándar de facto para streaming de datos a escala. Un cluster Kafka tiene brokers (servidores), topics (canales de datos), producers (quienes escriben), y consumers (quienes leen). Para Python, confluent-kafka-python es el cliente más robusto con soporte para Avro serializers y schema registry. Un producer envía eventos con `producer.produce(topic, key, value, callback)` — el callback se ejecuta async cuando el broker confirma. Para exactly-once semantics (EOS), Kafka 3.x+ requiere `enable.idempotence=true` en el producer y `isolation.level=read_committed` en el consumer.',
        'El procesamiento de streams requiere windowing: agrupar eventos por tiempo. Tumbling windows son no superpuestas (cada 5 min, un batch completo). Sliding windows se superponen (ventana de 10 min que avanza cada 5 min — útil para medias móviles). Session windows agrupan por actividad con gap de inactividad (sesión de usuario). En Python, Faust o aiokafka implementan estos patrones. El truco clave: siempre usa `consumer.commit()` manualmente después de procesar exitosamente — nunca auto-commit, porque si el consumer crashea entre leer y procesar, pierdes datos.',
        'Backpressure es el problema #1 en streaming. Si el producer produce 10K msg/seg pero el consumer solo procesa 1K, la queue crece hasta OOM. asyncio.Queue(maxsize=N) soluciona esto: cuando la queue está llena, `await queue.put(item)` bloquea al producer hasta que haya espacio. Esto es backpressure natural. En Kafka, se controla via `max.poll.records` y `fetch.max.bytes` para limitar cuántos registros consume el consumer por poll. Monitorea `consumer-lag` con Burrow o Kafka UI — si crece, necesitas más consumers o procesamiento más rápido.',
      ],
    },
  ],
  iDo: {
    intro: 'Te muestro paso a paso cómo aplicar los conceptos de esta sección con ejemplos prácticos.',
    steps: [
      {
        description: 'Construir un productor Kafka que envíe eventos de transacciones',
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
        instruction: 'Implementa un productor Kafka que envíe eventos con schema Avro',
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
    title: 'Pipeline Kafka/Redis Streams',
    context: 'Sistema que captura eventos de detección del sistema CV (S23), los publica a Kafka, los procesa en tiempo real con Faust, y persiste agregaciones en PostgreSQL con alertas vía WebSocket a dashboard Streamlit.',
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
        question: '¿Cuál de los siguientes describe mejor: Producir y consumir mensajes con Apache Kafka via confluent-kafka-python?',
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
        question: '¿Cuál de los siguientes describe mejor: Usar Redis Streams como alternativa ligera para casos sin Kafka?',
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
        question: '¿Cuál de los siguientes describe mejor: Procesar streams con faust (Python-native Kafka stream processing)?',
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
        question: '¿Cuál de los siguientes describe mejor: Implementar exactly-once semantics y offset management?',
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
        question: '¿Cuál de los siguientes describe mejor: Construir pipelines streaming + batch (Lambda architecture)?',
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
