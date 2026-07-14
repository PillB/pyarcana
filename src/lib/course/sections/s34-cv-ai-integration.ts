import type { CourseSection } from '../../types'

export const section34: CourseSection = {
  id: 'cv-ai-integration',
  index: 34,
  title: 'Integración CV + IA + Automatización',
  shortTitle: 'Integración CV + IA + Automati',
  tagline: 'El futuro de la automatización es una cámara conectada a un cerebro de IA.',
  estimatedHours: 14,
  level: 'Senior',
  phase: 2,
  icon: 'Eye',
  accentColor: 'bg-gradient-to-br from-purple-500 to-fuchsia-600',
  jobRelevance: 'Combina Visión por Computadora (S23) con LLMs multimodales para construir sistemas de seguridad industrial, control de calidad y retail analytics. Senior CV+AI Engineer roles ($140K-$180K) valoran este stack diferenciado.',
  learningOutcomes: [
    { text: 'Integrar el sistema CV (S23) con LLMs para análisis semántico de imágenes (multimodal)' },
    { text: 'Usar GPT-4o Vision / Claude 3.5 Sonnet para describir lo que la cámara ve' },
    { text: 'Construir un pipeline: cámara → detección YOLO → clasificación LLM → acción automatizada' },
    { text: 'Implementar scene understanding: no solo \'hay una persona\' sino \'la persona está en zona restringida\'' },
    { text: 'Integrar con RPA: cuando CV detecta condición X, el bot ejecuta acción Y' },
    { text: 'Casos de uso reales: control de calidad industrial, seguridad perimetral, retail analytics' },
  ],
  theory: [
    {
      heading: 'OpenCV + Deep Learning: detección de objetos con YOLOv8 en Python',
      paragraphs: [
        'YOLOv8 de Ultralytics es el modelo de detección de objetos más rápido y preciso para uso general. Puede detectar 80 clases del dataset COCO (persona, auto, perro, etc.) en 5ms por frame en GPU. Para usarlo en Python: `from ultralytics import YOLO; model = YOLO("yolov8n.pt"); results = model.predict("image.jpg")`. Los resultados incluyen bounding boxes, confianza, y clase para cada detección. Para video en tiempo real, itera frame por frame con OpenCV: `cap = cv2.VideoCapture(0); while cap.isOpened(): ret, frame = cap.read(); results = model.predict(frame)`.',
        'El OCR con Tesseract requiere preprocessing de OpenCV para ser útil en documentos reales. La cadena típica es: (1) convertir a grayscale, (2) aplicar adaptive threshold para binarizar, (3) deskew (corregir rotación) con `cv2.minAreaRect`, (4) denoise con `cv2.fastNlMeansDenoising`, (5) upscale 2x con `cv2.resize`. Sin este preprocessing, Tesseract tiene ~60% de precisión. Con él, llega a 85-90%. Para facturas peruanas, instala `tesseract-ocr-spa` (paquete de idioma español) — sin él, los acentos y la ñ se confunden sistemáticamente.',
        'La integración de visión computacional con LLMs abre posibilidades únicas. Por ejemplo: YOLOv8 detecta objetos en una escena (persona, mesa, laptop), luego un LLM (Ollama local o GPT-4V) genera una descripción natural: "Veo una persona sentada en una mesa con una laptop, parece estar trabajando". Esto es útil para accesibilidad (describir escenas para personas con discapacidad visual), monitoreo de seguridad (detectar intrusos y generar alertas contextuales), y análisis de retail (contar productos en góndolas y reportar quiebres de stock).',
      ],
    },
  ],
  iDo: {
    intro: 'Te muestro paso a paso cómo aplicar los conceptos de esta sección con ejemplos prácticos.',
    steps: [
      {
        description: 'Construir un detector de objetos con YOLOv8 en video tiempo real',
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
        instruction: 'Implementa un detector de rostros con OpenCV que cuenta personas',
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
    title: 'Smart CCTV + Alertas AI',
    context: 'Sistema que monitorea cámaras, usa YOLO para detección, GPT-4o Vision para análisis semántico, y dispara alertas automáticas + acciones RPA cuando detecta condiciones definidas.',
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
        question: '¿Cuál de los siguientes describe mejor: Integrar el sistema CV (S23) con LLMs para análisis semántico de imágenes (multimodal)?',
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
        question: '¿Cuál de los siguientes describe mejor: Usar GPT-4o Vision / Claude 3.5 Sonnet para describir lo que la cámara ve?',
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
        question: '¿Cuál de los siguientes describe mejor: Construir un pipeline: cámara → detección YOLO → clasificación LLM → acción automatizada?',
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
        question: '¿Cuál de los siguientes describe mejor: Implementar scene understanding: no solo \'hay una persona\' sino \'la persona está en zona restringida\'?',
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
        question: '¿Cuál de los siguientes describe mejor: Integrar con RPA: cuando CV detecta condición X, el bot ejecuta acción Y?',
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
