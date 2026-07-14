import type { CourseSection } from '../../types'

export const section44: CourseSection = {
  id: 'multimodal',
  index: 44,
  title: 'Sistemas Multi-Modal — Visión + Lenguaje',
  shortTitle: 'Sistemas Multi-Modal — Visión ',
  tagline: 'Los modelos que ven, leen y razonan al mismo tiempo.',
  estimatedHours: 12,
  level: 'Master',
  phase: 3,
  icon: 'Image',
  accentColor: 'bg-gradient-to-br from-amber-500 to-red-600',
  jobRelevance: 'Sistemas multimodales (GPT-4o Vision, Claude 3.5, Gemini 1.5, Qwen-VL) son la frontera 2026 para automatización documental. Roles en fintech, contabilidad y legal buscan ingenieros que automaticen procesamiento de facturas, contratos y formularios escaneados. Fine-tuning multimodal es skill MUY escaso ($170K-$210K).',
  learningOutcomes: [
    { text: 'Usar GPT-4o Vision, Claude 3.5 Sonnet y Gemini 1.5 Pro para análisis multimodal' },
    { text: 'Integrar visión con documentos: extraer estructuras de PDFs escaneados, tablas, formularios' },
    { text: 'Combinar YOLO detection (S23) con análisis semántico LLM para comprensión de escenas' },
    { text: 'Construir sistemas de document intelligence: OCR + LLM para procesamiento de documentos peruanos (boletas, facturas, contratos)' },
    { text: 'Fine-tuning multimodal con modelos LLaVA/Qwen-VL para tareas específicas' },
    { text: 'Procesamiento de video: análisis frame-by-frame + temporal reasoning' },
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
    title: 'Multimodal Analysis Pipeline',
    context: 'Sistema que procesa facturas peruanas en imagen (JPEG/PDF), extrae con Qwen-VL, valida contra base de datos de proveedores con RapidFuzz (S22), y sube a sistema contable vía API.',
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
        question: '¿Cuál de los siguientes describe mejor: Usar GPT-4o Vision, Claude 3.5 Sonnet y Gemini 1.5 Pro para análisis multimodal?',
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
        question: '¿Cuál de los siguientes describe mejor: Integrar visión con documentos: extraer estructuras de PDFs escaneados, tablas, formularios?',
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
        question: '¿Cuál de los siguientes describe mejor: Combinar YOLO detection (S23) con análisis semántico LLM para comprensión de escenas?',
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
        question: '¿Cuál de los siguientes describe mejor: Construir sistemas de document intelligence: OCR + LLM para procesamiento de documentos peruanos (boletas, facturas, contratos)?',
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
        question: '¿Cuál de los siguientes describe mejor: Fine-tuning multimodal con modelos LLaVA/Qwen-VL para tareas específicas?',
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
