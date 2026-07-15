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
        question: '¿Qué es CLIP de OpenAI?',
        options: [
          'Modelo que alinea imágenes y texto en el mismo espacio vectorial — permite buscar imágenes con texto y viceversa (zero-shot classification)',
          'Un editor de imágenes',
          'Un formato de compresión',
          'Un sistema de captura de pantalla',
        ],
        correctIndex: 0,
        explanation: 'CLIP entrena conjuntamente con imágenes y texto para que ambos modos queden en el mismo espacio vectorial. Calculas embeddings de imagen y texto, y la similitud coseno indica qué tan relacionados están. Permite buscar imágenes con descripciones de texto.',
      },
      {
        question: '¿Qué es Whisper de OpenAI?',
        options: [
          'Modelo de transcripción de audio a texto en 99 idiomas — usa whisper.load_model("base") para español con precisión cercana a humana',
          'Un sistema de mensajería',
          'Un protocolo de red',
          'Un reproductor de audio',
        ],
        correctIndex: 0,
        explanation: 'Whisper transcribe audio a texto con timestamps por palabra. Para español, el modelo "base" es suficiente. Incluye detección de idioma, traducción al inglés, y supresión de ruido. faster-whisper (CTranslate2) lo acelera 4x en CPU.',
      },
      {
        question: '¿Qué es multi-modal RAG?',
        options: [
          'Indexa imágenes (CLIP embeddings) y texto (text embeddings) en el mismo vector store — recupera ambos tipos conjuntamente para dar contexto al LLM',
          'Un RAG que solo usa imágenes',
          'Un RAG que solo usa audio',
          'Un RAG con múltiples bases de datos',
        ],
        correctIndex: 0,
        explanation: 'Multi-modal RAG: indexas imágenes con CLIP y texto con text embeddings en el mismo vector store. Cuando el usuario pregunta, el retriever encuentra documentos de texto Y imágenes relevantes. El LLM (GPT-4V o LLaVA) razona sobre ambos.',
      },
      {
        question: '¿Qué son los modelos vision-language (VLM)?',
        options: [
          'Modelos que procesan imagen y texto conjuntamente — GPT-4V, LLaVA, Claude Vision pueden describir imágenes, responder preguntas sobre ellas, y razonar visualmente',
          'Modelos que solo procesan imágenes',
          'Modelos que solo procesan texto',
          'Modelos de visión que no usan lenguaje',
        ],
        correctIndex: 0,
        explanation: 'Los VLMs (Vision-Language Models) aceptan imagen + texto como input. GPT-4V puede: describir una imagen, extraer texto (OCR), identificar objetos, responder preguntas sobre la escena. LLaVA es la alternativa open-source. Usan un vision encoder (CLIP/ViT) + LLM.',
      },
      {
        question: '¿Para qué sirve la generación de imágenes con DALL-E y Stable Diffusion?',
        options: [
          'Generar imágenes desde descripciones de texto — útil para marketing, prototipos, contenido educativo, y arte. Stable Diffusion corre localmente sin API',
          'Es un editor de fotos como Photoshop',
          'Es un sistema de backup de imágenes',
          'Es un formato de imagen',
        ],
        correctIndex: 0,
        explanation: 'DALL-E 3 (OpenAI API) y Stable Diffusion (open-source, local) generan imágenes desde texto. SD tiene ventaja: corre en tu GPU, sin costo por imagen, sin censura externa. Útil para generar datasets sintéticos, prototipos visuales, y contenido para presentaciones.',
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
