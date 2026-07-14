import type { CourseSection } from '../../types'

export const section38: CourseSection = {
  id: 'performance-extreme',
  index: 38,
  title: 'Performance Extrema — Numba, Cython, Vectorización',
  shortTitle: 'Performance Extrema — Numba, C',
  tagline: 'Cuando Python es demasiado lento, estas herramientas lo hacen volar.',
  estimatedHours: 10,
  level: 'Senior',
  phase: 2,
  icon: 'Gauge',
  accentColor: 'bg-gradient-to-br from-purple-500 to-fuchsia-600',
  jobRelevance: 'Performance optimization es diferenciador clave para Senior Python Engineer en fintech, adtech y HFT. Numba (10-100x speedup), Polars (pandas replacement 5-30x faster) y profiling profesional son skills obligatorios para datasets grandes (>10M rows).',
  learningOutcomes: [
    { text: 'Perfilar código Python correctamente con cProfile, line_profiler, memory_profiler (Python 201 Ch. 13, expandido)' },
    { text: 'Usar Numba JIT (@jit, @njit, @vectorize) para acelerar loops numéricos 10-100x' },
    { text: 'Escribir extensiones Cython para código crítico de rendimiento' },
    { text: 'Vectorizar operaciones con NumPy broadcasting para evitar Python loops' },
    { text: 'Usar Polars como alternativa ultra-rápida a pandas para datasets grandes' },
    { text: 'Optimizar uso de memoria: dtype optimization, categorical, sparse arrays' },
    { text: 'Benchmarking sistemático con pytest-benchmark' },
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
    title: 'High-Performance Scoring Engine',
    context: 'El motor de Familiarity Score (S22) reescrito con Numba + Polars, benchmarkeado contra la versión pandas/Python puro, con reducción documentada de latencia ≥ 5x.',
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
        question: '¿Cuál de los siguientes describe mejor: Perfilar código Python correctamente con cProfile, line_profiler, memory_profiler (Python 201 Ch. 13, expandido)?',
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
        question: '¿Cuál de los siguientes describe mejor: Usar Numba JIT (@jit, @njit, @vectorize) para acelerar loops numéricos 10-100x?',
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
        question: '¿Cuál de los siguientes describe mejor: Escribir extensiones Cython para código crítico de rendimiento?',
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
        question: '¿Cuál de los siguientes describe mejor: Vectorizar operaciones con NumPy broadcasting para evitar Python loops?',
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
        question: '¿Cuál de los siguientes describe mejor: Usar Polars como alternativa ultra-rápida a pandas para datasets grandes?',
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
