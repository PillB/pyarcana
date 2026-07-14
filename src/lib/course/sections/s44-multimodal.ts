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
      heading: 'Sistemas multi-modal: combinando visión + lenguaje + audio',
      paragraphs: [
        'CLIP (Contrastive Language-Image Pre-training) de OpenAI alinea imágenes y texto en el mismo espacio vectorial. Esto permite buscar imágenes con texto (zero-shot image classification) y buscar texto con imágenes. En Python: `from transformers import CLIPModel; model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")`. Calculas embeddings de imagen y texto, y la similitud coseno indica qué tan relacionados están. Para un buscador de imágenes: pre-calculas embeddings de 1000 imágenes, luego para un query de texto, calculas el embedding del texto y encuentras las top-5 imágenes más similares por coseno.',
        'Whisper de OpenAI transcribe audio a texto con precisión cercana a humana en 99 idiomas. Para español, el modelo "base" es suficiente; para reuniones con ruido de fondo, usa "medium" o "large". En Python: `import whisper; model = whisper.load_model("base"); result = model.transcribe("audio.mp3")`. El resultado incluye timestamps por palabra, lo que permite subtítulos sincronizados. Whisper es la pieza clave para automatización de reuniones: transcribe → extrae action items con LLM → envía por email. Todo esto corre localmente con `faster-whisper` (CTranslate2) en una CPU normal.',
        'El multi-modal RAG indexa imágenes (via CLIP embeddings) y texto (via text embeddings) en el mismo vector store. Cuando el usuario hace un query, el retriever encuentra tanto documentos de texto como imágenes relevantes. El LLM (GPT-4V o LLaVA) puede entonces razonar sobre ambos: "Según el documento y el diagrama que encontré, el proceso es...". Esto es especialmente útil para manuales técnicos, reportes médicos, y análisis de diseños donde la información está distribuida entre texto e imágenes.',
      ],
    },
  ],
  iDo: {
    intro: 'Te muestro paso a paso cómo aplicar los conceptos de esta sección con ejemplos prácticos.',
    steps: [
      {
        description: 'Construir un sistema multi-modal que analice imágenes con CLIP',
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
        instruction: 'Implementa un buscador de imágenes con texto usando CLIP embeddings',
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
