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
        'CuPy es el reemplazo drop-in de NumPy que corre en GPU. La API es idéntica: `import cupy as cp; a = cp.random.rand(5000, 5000); b = a @ a`. Para una matriz 5000×5000, NumPy en CPU tarda ~2 segundos; CuPy en GPU NVIDIA T4 tarda ~0.05 segundos — 40x speedup. La limitación: los datos deben caber en GPU memory (T4 tiene 16GB, A100 tiene 80GB). Si el dataset es más grande, necesitas chunking o multi-GPU. Para pipelines de ML que hacen cálculos numéricos intensivos (feature engineering, simulaciones, image processing), CuPy es el upgrade más fácil y impactante.',
        'PyTorch DDP (DistributedDataParallel) entrena modelos en múltiples GPUs. Cada GPU tiene una réplica completa del modelo y procesa un sub-batch diferente. Al final de cada step, las GPUs sincronizan gradients via NCCL (NVIDIA Collective Communications Library). Con 4 GPUs, obtienes ~3.5x speedup (no 4x por overhead de comunicación). La configuración: `torchrun --nproc_per_node=4 train.py` y en el código: `model = DDP(model, device_ids=[local_rank])`. DDP es simple pero requiere que el modelo quepa en una sola GPU. Para modelos muy grandes (LLMs), usa FSDP (Fully Sharded Data Parallel) que divide el modelo entre GPUs.',
        'vLLM es el servidor de inferencia más rápido para LLMs, 3-5x más rápido que HuggingFace transformers. La clave es PagedAttention: gestiona el KV cache como un sistema operativo gestiona memoria virtual, con pages que se asignan dinámicamente. Esto permite batchear 100+ requests concurrentes sin OOM. Para servir un modelo: `vllm serve mistralai/Mistral-7B-Instruct-v0.2 --tensor-parallel-size 2 --enable-chunked-prefill`. vLLM soporta streaming (SSE), OpenAI-compatible API, y quantización (AWQ, GPTQ). Para producción, vLLM + Kubernetes + auto-scaling es el stack estándar para servir LLMs en 2025-2026.',
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
