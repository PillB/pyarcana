import type { CourseSection } from '../../types'

export const section27: CourseSection = {
  id: 'async-concurrency',
  index: 27,
  title: 'Concurrencia Avanzada y Arquitecturas Async',
  shortTitle: 'Concurrencia Avanzada y Arquit',
  tagline: 'El código que corre en paralelo no es el que más corre — es el que más escala.',
  estimatedHours: 12,
  level: 'Senior',
  phase: 2,
  icon: 'Zap',
  accentColor: 'bg-gradient-to-br from-purple-500 to-fuchsia-600',
  jobRelevance: 'Los roles Senior Python/AI Engineer requieren dominar asyncio, threading, y multiprocessing para construir pipelines de alta concurrencia. Python 201 (Ch. 27-30) cubre estos módulos en profundidad. Esta sección lleva ese conocimiento a nivel de producción con patrones de arquitectura reales.',
  learningOutcomes: [
    { text: 'Dominar asyncio avanzado: event loops, TaskGroup, asyncio.Queue, semaphores, limitadores de rate' },
    { text: 'Entender el GIL y cuándo usar threading vs multiprocessing vs asyncio' },
    { text: 'Implementar el patrón producer-consumer con asyncio.Queue' },
    { text: 'Usar concurrent.futures para I/O-bound y CPU-bound tasks (Python 201 Ch. 30)' },
    { text: 'Construir pipelines asíncronos con backpressure control' },
    { text: 'Optimizar latencia en APIs con connection pooling (aiohttp, asyncpg)' },
    { text: 'Depurar race conditions con locks, semaphores y asyncio.Event' },
  ],
  theory: [
    {
      heading: 'asyncio avanzado (Python 201 Ch. 27): async/await profundo, TaskGroup (Python 3.11+), asyncio.Queue, asyncio.Semaphore',
      paragraphs: [
        'En esta lección vamos a explorar asyncio avanzado (python 201 ch. 27): async/await profundo, taskgroup (python 3.11+), asyncio.queue, asyncio.semaphore en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender asyncio avanzado (python 201 ch. 27): async/await profundo, taskgroup (python 3.11+), asyncio.queue, asyncio.semaphore es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, asyncio avanzado (python 201 ch. 27): async/await profundo, taskgroup (python 3.11+), asyncio.queue, asyncio.semaphore se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'threading en profundidad (Python 201 Ch. 28): Locks, RLocks, Conditions, Barriers, thread-safe queues',
      paragraphs: [
        'En esta lección vamos a explorar threading en profundidad (python 201 ch. 28): locks, rlocks, conditions, barriers, thread-safe queues en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender threading en profundidad (python 201 ch. 28): locks, rlocks, conditions, barriers, thread-safe queues es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, threading en profundidad (python 201 ch. 28): locks, rlocks, conditions, barriers, thread-safe queues se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'multiprocessing (Python 201 Ch. 29): Pool, Process, Manager, shared memory, pipes',
      paragraphs: [
        'En esta lección vamos a explorar multiprocessing (python 201 ch. 29): pool, process, manager, shared memory, pipes en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender multiprocessing (python 201 ch. 29): pool, process, manager, shared memory, pipes es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, multiprocessing (python 201 ch. 29): pool, process, manager, shared memory, pipes se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'concurrent.futures (Python 201 Ch. 30): ThreadPoolExecutor, ProcessPoolExecutor, as_completed, deadlocks',
      paragraphs: [
        'En esta lección vamos a explorar concurrent.futures (python 201 ch. 30): threadpoolexecutor, processpoolexecutor, as_completed, deadlocks en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender concurrent.futures (python 201 ch. 30): threadpoolexecutor, processpoolexecutor, as_completed, deadlocks es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, concurrent.futures (python 201 ch. 30): threadpoolexecutor, processpoolexecutor, as_completed, deadlocks se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'GIL y sus implicaciones: I/O-bound → threading/asyncio, CPU-bound → multiprocessing',
      paragraphs: [
        'En esta lección vamos a explorar gil y sus implicaciones: i/o-bound → threading/asyncio, cpu-bound → multiprocessing en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender gil y sus implicaciones: i/o-bound → threading/asyncio, cpu-bound → multiprocessing es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, gil y sus implicaciones: i/o-bound → threading/asyncio, cpu-bound → multiprocessing se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Backpressure: cómo evitar que un producer rápido ahogue a un consumer lento',
      paragraphs: [
        'En esta lección vamos a explorar backpressure: cómo evitar que un producer rápido ahogue a un consumer lento en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender backpressure: cómo evitar que un producer rápido ahogue a un consumer lento es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, backpressure: cómo evitar que un producer rápido ahogue a un consumer lento se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Async context managers y async generators: patrones para pipelines streaming',
      paragraphs: [
        'En esta lección vamos a explorar async context managers y async generators: patrones para pipelines streaming en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender async context managers y async generators: patrones para pipelines streaming es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, async context managers y async generators: patrones para pipelines streaming se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
  ],
  iDo: {
    intro: 'Te muestro paso a paso cómo aplicar los conceptos de esta sección con ejemplos prácticos.',
    steps: [
      {
        description: 'Implementar un pipeline producer-consumer con asyncio.Queue que procesa 10,000 URLs en paralelo',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Implementar un pipeline producer-consumer con asyncio.Queue que procesa 10,000 URLs en paralelo\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
      {
        description: 'Usar ProcessPoolExecutor para paralelizar cálculos CPU-bound (features para ML)',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Usar ProcessPoolExecutor para paralelizar cálculos CPU-bound (features para ML)\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
      {
        description: 'Construir un rate limiter async que permite máximo N requests/segundo a una API externa',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Construir un rate limiter async que permite máximo N requests/segundo a una API externa\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
    ],
  },
  weDo: {
    intro: 'Ahora te toca a ti practicar con guía. Lee cada instrucción, intenta escribir el código, y si te trabas revisa la solución.',
    steps: [
      {
        instruction: 'Agregar backpressure al pipeline limitando el tamaño de la queue y usando Semaphore',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Agregar backpressure al pipeline limitando el tamaño de la queue y usando Semaphore\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Agregar backpressure al pipeline limitando el tamaño de la queue y usando Semaphore\nprint("Solución implementada")',
        },
      },
      {
        instruction: 'Implementar un AsyncConnectionPool con asyncpg que reutiliza conexiones de DB',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Implementar un AsyncConnectionPool con asyncpg que reutiliza conexiones de DB\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Implementar un AsyncConnectionPool con asyncpg que reutiliza conexiones de DB\nprint("Solución implementada")',
        },
      },
      {
        instruction: 'Debuggear un race condition intencional con asyncio.Lock',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Debuggear un race condition intencional con asyncio.Lock\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Debuggear un race condition intencional con asyncio.Lock\nprint("Solución implementada")',
        },
      },
    ],
  },
  youDo: {
    title: 'High-Throughput Pipeline',
    context: 'async-data-pipeline: ingiere 100,000 registros desde una API REST paginada, procesando 50 requests concurrentes; producer: fetch asíncrono con aiohttp + rate limiting (máx 100 req/s); consumer: transforma y valida cada registro con Pydantic v2; sink: inserta en PostgreSQL con asyncpg usando batch inserts de 1,000 rows; métricas (throughput registros/s, latencia p50/p99, errores) expuestas en endpoint /metrics; comparación de rendimiento: sync baseline vs async implementación (benchmarks en README).',
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
        question: '¿Cuál de los siguientes describe mejor: Dominar asyncio avanzado: event loops, TaskGroup, asyncio.Queue, semaphores, limitadores de rate?',
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
        question: '¿Cuál de los siguientes describe mejor: Entender el GIL y cuándo usar threading vs multiprocessing vs asyncio?',
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
        question: '¿Cuál de los siguientes describe mejor: Implementar el patrón producer-consumer con asyncio.Queue?',
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
        question: '¿Cuál de los siguientes describe mejor: Usar concurrent.futures para I/O-bound y CPU-bound tasks (Python 201 Ch. 30)?',
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
        question: '¿Cuál de los siguientes describe mejor: Construir pipelines asíncronos con backpressure control?',
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
      { label: 'Python 201 (Driscoll) — Ch. 27-30 (fuente primaria)', url: 'Python 201 (Driscoll) — Ch. 27-30 (fuente primaria)' },
      { label: 'Python asyncio docs', url: 'Python asyncio docs' },
      { label: 'asyncio TaskGroup (Python 3.11)', url: 'asyncio TaskGroup (Python 3.11)' },
      { label: 'aiohttp docs', url: 'aiohttp docs' },
    ],
    books: [
      { label: 'Python 201 — Michael Driscoll', note: 'Capítulos relevantes para esta sección' },
    ],
    courses: [
      { label: 'Real Python', url: 'https://realpython.com', note: 'Tutoriales complementarios' },
    ],
  },
}
