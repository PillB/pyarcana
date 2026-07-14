import type { CourseSection } from '../../types'

export const section46: CourseSection = {
  id: 'gpu-computing',
  index: 46,
  title: 'Performance Extrema — CUDA, GPU Computing con Python',
  shortTitle: 'Performance Extrema — CUDA, GP',
  tagline: 'Cuando la CPU no alcanza, la GPU procesa miles de operaciones en paralelo.',
  estimatedHours: 12,
  level: 'Master',
  phase: 3,
  icon: 'Cpu',
  accentColor: 'bg-gradient-to-br from-amber-500 to-red-600',
  jobRelevance: 'CUDA + GPU computing es skill muy especializado para Senior/Master roles en CV, HPC y deep learning research ($170K-$220K). Diferenciador clave en empresas que procesan video, imágenes médicas o modelos grandes en producción. Conecta con S23 (CV) y S38 (perf).',
  learningOutcomes: [
    { text: 'Entender CUDA programming model: threads, blocks, grids desde Python con numba.cuda' },
    { text: 'Implementar kernels CUDA custom para algoritmos de visión (conecta directamente con sección 23)' },
    { text: 'Usar CuPy para arrays GPU con API NumPy-compatible' },
    { text: 'Optimizar inferencia de modelos con ONNX Runtime GPU y TensorRT' },
    { text: 'Profiling de GPU con NVIDIA Nsight y torch.profiler' },
    { text: 'Medir speedup real: benchmarks CPU vs GPU para operaciones de CV y ML' },
  ],
  theory: [
    {
      heading: 'CUDA y GPU computing con Python: Numba CUDA, CuPy, PyTorch',
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
        description: 'Acelerar operaciones numéricas con CuPy (GPU drop-in para NumPy)',
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
        instruction: 'Implementa matriz-multiplication con CuPy y compara con NumPy',
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
    title: 'GPU-Accelerated CV Engine',
    context: 'El pipeline de CV de la sección 23 reescrito con CUDA kernels para preprocessing + ONNX Runtime para inferencia, con benchmark documentado de speedup.',
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
        question: '¿Cuál de los siguientes describe mejor: Entender CUDA programming model: threads, blocks, grids desde Python con numba.cuda?',
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
        question: '¿Cuál de los siguientes describe mejor: Implementar kernels CUDA custom para algoritmos de visión (conecta directamente con sección 23)?',
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
        question: '¿Cuál de los siguientes describe mejor: Usar CuPy para arrays GPU con API NumPy-compatible?',
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
        question: '¿Cuál de los siguientes describe mejor: Optimizar inferencia de modelos con ONNX Runtime GPU y TensorRT?',
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
        question: '¿Cuál de los siguientes describe mejor: Profiling de GPU con NVIDIA Nsight y torch.profiler?',
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
