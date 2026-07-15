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
          code: '"""Deteccion de objetos con YOLOv8 en tiempo real."""\nfrom ultralytics import YOLO\nimport cv2\n\nmodel = YOLO("yolov8n.pt")  # nano = mas rapido, 5ms/frame\nresults = model.predict("imagen.jpg", conf=0.5, classes=[0])  # Solo personas\n\nfor r in results:\n    boxes = r.boxes\n    print(f"Personas detectadas: {len(boxes)}")\n    for box in boxes:\n        x1, y1, x2, y2 = box.xyxy[0]\n        conf = box.conf[0]\n        print(f"  Coords: ({x1:.0f},{y1:.0f},{x2:.0f},{y2:.0f}) Conf: {conf:.2f}")\n\n# Para video: cap = cv2.VideoCapture(0); while cap.isOpened(): ...',
        },
        why: 'YOLOv8 detecta objetos en 5ms por frame. conf=0.5 balancea precision y recall. classes=[0] filtra solo personas reduciendo falsos positivos. El modelo se carga una vez y se reutiliza para cada frame.',
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
          code: '"""OCR con Tesseract + preprocessing OpenCV."""\nimport cv2\nimport pytesseract\n\ndef preprocess_image(image_path):\n    img = cv2.imread(image_path)\n    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)\n    thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)\n    denoised = cv2.fastNlMeansDenoising(thresh)\n    return cv2.resize(denoised, None, fx=2, fy=2)\n\n# img = preprocess_image("factura.jpg")\n# texto = pytesseract.image_to_string(img, lang="spa+eng")\n# print(f"Texto: {texto[:200]}...")\nprint("Pipeline OCR: grayscale -> threshold -> denoise -> upscale -> tesseract")\nprint("Precision sin preprocessing: ~60% | Con preprocessing: ~85-90%")',
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
        question: '¿Cómo se integra visión por computadora con LLMs?',
        options: [
          'Se detectan objetos con YOLOv8, se pasan como texto al LLM, y el LLM genera una descripción natural de la escena',
          'Entrenando el LLM con imágenes',
          'Usando el LLM para detectar objetos',
          'No es posible integrar CV con LLMs',
        ],
        correctIndex: 0,
        explanation: 'Pipeline CV+LLM: YOLOv8 detecta objetos → se formatea como texto → LLM genera descripción. También se puede con modelos multimodales como GPT-4V o LLaVA que procesan imagen directamente.',
      },
      {
        question: '¿Qué es edge deployment en CV?',
        options: [
          'Ejecutar modelos en dispositivos locales (Raspberry Pi, Jetson Nano) sin nube — usa TensorRT u ONNX para optimizar',
          'Desplegar en el borde de la red',
          'Usar modelos pre-entrenados sin fine-tuning',
          'Desplegar solo en AWS edge',
        ],
        correctIndex: 0,
        explanation: 'Edge deployment corre en el dispositivo: latencia < 50ms, privacidad, funciona offline. Se usa ONNX Runtime o TensorRT para optimizar al hardware. Trade-off: menor precisión que GPU cloud.',
      },
      {
        question: 'Diferencia entre tracking y detección de objetos?',
        options: [
          'Detección identifica qué hay en cada frame; tracking asigna IDs únicos y sigue objetos frame a frame',
          'Son sinónimos',
          'Tracking es más rápido',
          'Tracking solo funciona con video, detección con imágenes',
        ],
        correctIndex: 0,
        explanation: 'Detección (YOLOv8): detecta objetos sin memoria. Tracking (DeepSORT, ByteTrack): asigna ID único y sigue entre frames. Vital para conteo de personas únicas y análisis de trayectorias.',
      },
      {
        question: '¿Qué es OCR y cuáles son sus limitaciones?',
        options: [
          'Tecnología que extrae texto de imágenes — limitada por calidad, rotación, fuentes no estándar. Tesseract + OpenCV logra 85-90% en documentos limpios',
          'Un sistema de reconocimiento de voz',
          'Un formato de imagen comprimida',
          'Un protocolo de comunicación',
        ],
        correctIndex: 0,
        explanation: 'OCR convierte imágenes de texto a texto editable. Tesseract es el motor open-source estándar. Precisa preprocesamiento (grayscale, threshold, deskew) y paquete de idioma (tesseract-ocr-spa).',
      },
      {
        question: '¿Qué es la anotación de datos para CV?',
        options: [
          'Marcar manualmente qué hay en las imágenes: bounding boxes, máscaras, keypoints — necesario para entrenar modelos custom',
          'Agregar comentarios al código',
          'Etiquetar metadatos EXIF',
          'Es lo mismo que OCR',
        ],
        correctIndex: 0,
        explanation: 'Para entrenar un detector custom necesitas cientos de imágenes anotadas con bounding boxes. Herramientas: LabelImg, CVAT, Roboflow. La calidad de anotaciones determina la calidad del modelo.',
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
