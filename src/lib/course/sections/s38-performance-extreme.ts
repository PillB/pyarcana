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
      heading: 'Numba: JIT compilation para loops numéricos 100x más rápidos',
      paragraphs: [
        'Numba es un compilador JIT (Just-In-Time) que convierte Python a código máquina via LLVM. Con `@numba.njit`, un loop numérico que tarda 500ms en Python puro corre en 5ms — 100x speedup. La limitación: Numba solo soporta tipos primitivos (int, float, arrays NumPy) y no soporta operaciones con strings, DataFrames, ni llamadas a APIs. Para funciones numéricas puras (cálculo de distancias, simulaciones Monte Carlo, procesamiento de señales), Numba es la herramienta #1. Usa `@njit(cache=True)` para cachear la compilación entre ejecuciones — el primer run compila (lento), los siguientes cargan del cache (instantáneo).',
        'Polars es la alternativa a pandas que usa Apache Arrow multi-threaded con evaluación lazy. En benchmarks reales, Polars es 5-30x más rápido que pandas en operaciones de groupby + join, y usa 2-5x menos memoria. La API es diferente: `pl.col("x").sum()` en vez de `df["x"].sum()`, y `df.group_by("col").agg(...)` en vez de `df.groupby("col").agg(...)`. La evaluación lazy (`df.lazy().filter(...).collect()`) optimiza el plan de ejecución: Polars puede reordenar operaciones, eliminar columnas no usadas, y paralelizar automáticamente. Para pipelines de datos con >1M filas, la migración de pandas a Polars es el upgrade de performance más impactante que puedes hacer.',
        'La vectorización con NumPy elimina loops de Python reemplazándolos con operaciones a nivel de array en C. En vez de `for i in range(n): result[i] = a[i] + b[i]`, escribes `result = a + b` — NumPy ejecuta todo en C sin overhead de Python. Para 1M de elementos, el loop tarda 500ms; la vectorización tarda 5ms. La regla: si tienes un for-loop sobre datos numéricos, hay una operación vectorizada de NumPy que lo reemplaza. `np.where()` reemplaza if/else, `np.vectorize()` reemplaza funciones custom, y broadcasting reemplaza loops anidados.',
      ],
    },
  ],
  iDo: {
    intro: 'Te muestro paso a paso cómo aplicar los conceptos de esta sección con ejemplos prácticos.',
    steps: [
      {
        description: 'Acelerar una función numérica con @numba.njit y medir el speedup',
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
        instruction: 'Implementa cálculo de distancias con Numba y compara con NumPy',
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
        question: '¿Qué hace @numba.njit en Python?',
        options: [
          'Compila una función Python a código máquina vía LLVM — para loops numéricos puros, logra 100x speedup vs Python interpretado',
          'Acelera cualquier función Python',
          'Es un decorador de logging',
          'Paraleliza la función automáticamente',
        ],
        correctIndex: 0,
        explanation: '@njit (Numba JIT) compila Python a LLVM IR. Para loops numéricos (cálculos, distancias, simulaciones), logra velocidad de C/Fortran. Limitación: solo soporta tipos primitivos y arrays NumPy, no strings ni DataFrames.',
      },
      {
        question: '¿Por qué Polars es 10-30x más rápido que pandas?',
        options: [
          'Usa Apache Arrow multi-threaded con evaluación lazy — optimiza el plan de ejecución, paraleliza automáticamente, y usa menos memoria',
          'Polars está escrito en C y pandas en Python',
          'Polars usa GPU y pandas no',
          'Polars comprime los datos',
        ],
        correctIndex: 0,
        explanation: 'Polars usa Arrow (columnar, zero-copy) con evaluación lazy: df.lazy().filter().agg().collect() optimiza el plan antes de ejecutar. Paraleliza automáticamente en múltiples cores. Para groupby+join en 1M+ filas, 10-30x más rápido que pandas.',
      },
      {
        question: '¿Qué es la vectorización con NumPy?',
        options: [
          'Reemplazar loops de Python con operaciones a nivel de array en C — arr + b en vez de for i: arr[i] + b — 100x más rápido',
          'Es convertir datos a vectores de texto',
          'Es un algoritmo de compresión',
          'Es un sistema de tipos para NumPy',
        ],
        correctIndex: 0,
        explanation: 'NumPy ejecuta operaciones a nivel de array en C sin overhead de Python. Para 1M elementos: loop Python = 500ms, vectorización NumPy = 5ms. np.where() reemplaza if/else, broadcasting reemplaza loops anidados.',
      },
      {
        question: '¿Qué es memory_profiler y para qué sirve?',
        options: [
          'Muestra uso de RAM línea por línea — detecta copias innecesarias, acumulación de DataFrames, y memory leaks en pipelines',
          'Un profiler de CPU',
          'Un sistema de gestión de memoria',
          'Un compresor de datos',
        ],
        correctIndex: 0,
        explanation: 'memory_profiler decoras con @profile y muestra cuánta RAM consume cada línea. Detecta: copias innecesarias (df.copy()), DataFrames que no se liberan, generators que materializan. Esencial para pipelines que procesan GB de datos.',
      },
      {
        question: '¿Qué es Cython y cuándo se usa?',
        options: [
          'Compila Python a C con tipos estáticos — para hot paths críticos donde Numba no basta (strings, structs complejos), logra 50-200x speedup',
          'Cython es un reemplazo de Python',
          'Cython es un framework web',
          'Cython es un debugger',
        ],
        correctIndex: 0,
        explanation: 'Cython añade tipos estáticos a Python: "cdef int i" en vez de "i = 0". Compila a C, logrando velocidad nativa. Más flexible que Numba (soporta strings, clases) pero requiere más setup. Usado en pandas, scikit-learn y lxml internamente.',
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
