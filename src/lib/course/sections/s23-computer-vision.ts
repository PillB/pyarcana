import type { CourseSection } from '../../types'

export const section23: CourseSection = {
  id: 'computer-vision',
  index: 23,
  title: 'Visión por Computadora y Camera Feeds en Tiempo Real',
  shortTitle: 'Visión por Computadora y Camer',
  tagline: 'Haz que Python vea el mundo — y reaccione a él en tiempo real.',
  estimatedHours: 14,
  level: 'Competente',
  phase: 1,
  icon: 'Camera',
  accentColor: 'bg-gradient-to-br from-blue-500 to-indigo-600',
  jobRelevance: 'Computer Vision con cámeras en tiempo real es una de las especializaciones más demandadas y mejor pagadas del mercado (USD $140K+ para senior CV engineers). Conecta directamente con el background profesional del aprendiz en sistemas de visión por computadora y pose detection, y expande esas habilidades hacia producción.',
  learningOutcomes: [
    { text: 'Capturar y procesar frames de cámara con OpenCV (cv2.VideoCapture)' },
    { text: 'Implementar detección de objetos en tiempo real con YOLO v11 (Ultralytics)' },
    { text: 'Usar MediaPipe para pose detection y skeleton tracking' },
    { text: 'Transmitir video procesado como MJPEG stream desde FastAPI' },
    { text: 'Procesar múltiples cámaras en paralelo con threading/asyncio' },
    { text: 'Detectar y trackear objetos a través de frames con ByteTrack' },
    { text: 'Optimizar throughput: resize frames antes de inferencia, skip frames, GPU inference' },
    { text: 'Integrar con RTSP streams de cámaras IP' },
  ],
  theory: [
    {
      heading: 'OpenCV fundamentals de producción: VideoCapture, propiedades de cámara, buffer management, CAP_PROP_BUFFERSIZE',
      paragraphs: [
        'En esta lección vamos a explorar opencv fundamentals de producción: videocapture, propiedades de cámara, buffer management, cap_prop_buffersize en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender opencv fundamentals de producción: videocapture, propiedades de cámara, buffer management, cap_prop_buffersize es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, opencv fundamentals de producción: videocapture, propiedades de cámara, buffer management, cap_prop_buffersize se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'YOLO v11 (Ultralytics): arquitectura, inferencia con model.track(frame, persist=True), clases, confidence thresholds',
      paragraphs: [
        'En esta lección vamos a explorar yolo v11 (ultralytics): arquitectura, inferencia con model.track(frame, persist=true), clases, confidence thresholds en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender yolo v11 (ultralytics): arquitectura, inferencia con model.track(frame, persist=true), clases, confidence thresholds es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, yolo v11 (ultralytics): arquitectura, inferencia con model.track(frame, persist=true), clases, confidence thresholds se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'MediaPipe: mp.solutions.pose, mp.solutions.hands, landmark coordinates — conexión con pose detection',
      paragraphs: [
        'En esta lección vamos a explorar mediapipe: mp.solutions.pose, mp.solutions.hands, landmark coordinates — conexión con pose detection en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender mediapipe: mp.solutions.pose, mp.solutions.hands, landmark coordinates — conexión con pose detection es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, mediapipe: mp.solutions.pose, mp.solutions.hands, landmark coordinates — conexión con pose detection se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'MJPEG streaming: generar stream desde FastAPI con StreamingResponse y multipart/x-mixed-replace',
      paragraphs: [
        'En esta lección vamos a explorar mjpeg streaming: generar stream desde fastapi con streamingresponse y multipart/x-mixed-replace en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender mjpeg streaming: generar stream desde fastapi con streamingresponse y multipart/x-mixed-replace es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, mjpeg streaming: generar stream desde fastapi con streamingresponse y multipart/x-mixed-replace se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Threading para múltiples cámaras: patrón VideoStream con threading.Thread y queue de frames',
      paragraphs: [
        'En esta lección vamos a explorar threading para múltiples cámaras: patrón videostream con threading.thread y queue de frames en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender threading para múltiples cámaras: patrón videostream con threading.thread y queue de frames es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, threading para múltiples cámaras: patrón videostream con threading.thread y queue de frames se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'RTSP streams: OpenCV + rtsp:// URLs para cámaras IP en producción',
      paragraphs: [
        'En esta lección vamos a explorar rtsp streams: opencv + rtsp:// urls para cámaras ip en producción en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender rtsp streams: opencv + rtsp:// urls para cámaras ip en producción es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, rtsp streams: opencv + rtsp:// urls para cámaras ip en producción se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'ByteTrack: tracking de objetos entre frames sin perder identidad al cruzarse',
      paragraphs: [
        'En esta lección vamos a explorar bytetrack: tracking de objetos entre frames sin perder identidad al cruzarse en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender bytetrack: tracking de objetos entre frames sin perder identidad al cruzarse es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, bytetrack: tracking de objetos entre frames sin perder identidad al cruzarse se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Performance: resize → inference → draw pipeline, GPU vs CPU throughput, batch inference',
      paragraphs: [
        'En esta lección vamos a explorar performance: resize → inference → draw pipeline, gpu vs cpu throughput, batch inference en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender performance: resize → inference → draw pipeline, gpu vs cpu throughput, batch inference es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, performance: resize → inference → draw pipeline, gpu vs cpu throughput, batch inference se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
  ],
  iDo: {
    intro: 'Te muestro paso a paso cómo aplicar los conceptos de esta sección con ejemplos prácticos.',
    steps: [
      {
        description: 'Abrir webcam con OpenCV, correr YOLO v11 nano frame por frame, mostrar bounding boxes y FPS',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Abrir webcam con OpenCV, correr YOLO v11 nano frame por frame, mostrar bounding boxes y FPS\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
      {
        description: 'Conectar MediaPipe Pose para detectar pose de una persona en el frame en tiempo real',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Conectar MediaPipe Pose para detectar pose de una persona en el frame en tiempo real\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
      {
        description: 'Exponer el stream procesado como endpoint MJPEG en FastAPI (/video/feed)',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Exponer el stream procesado como endpoint MJPEG en FastAPI (/video/feed)\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
    ],
  },
  weDo: {
    intro: 'Ahora te toca a ti practicar con guía. Lee cada instrucción, intenta escribir el código, y si te trabas revisa la solución.',
    steps: [
      {
        instruction: 'Implementar MultiCameraManager: clase que gestiona N cámaras en threads separados y merges frames',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Implementar MultiCameraManager: clase que gestiona N cámaras en threads separados y merges frames\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Implementar MultiCameraManager: clase que gestiona N cámaras en threads separados y merges frames\nprint("Solución implementada")',
        },
      },
      {
        instruction: 'Agregar ByteTrack para mantener track_id de cada persona detectada entre frames',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Agregar ByteTrack para mantener track_id de cada persona detectada entre frames\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Agregar ByteTrack para mantener track_id de cada persona detectada entre frames\nprint("Solución implementada")',
        },
      },
      {
        instruction: 'Emitir eventos de detección via WebSocket a un dashboard Streamlit',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Emitir eventos de detección via WebSocket a un dashboard Streamlit\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Emitir eventos de detección via WebSocket a un dashboard Streamlit\nprint("Solución implementada")',
        },
      },
    ],
  },
  youDo: {
    title: 'Sistema CV en Tiempo Real',
    context: 'cv-realtime-system: captura de webcam o archivo de video (argparse --source 0 o --source video.mp4); detección de objetos con YOLO v11 + tracking con ByteTrack; pose detection con MediaPipe; streaming MJPEG desde FastAPI + dashboard HTML que muestra el feed en el browser; log de eventos (entrada/salida de persona del frame, timestamp + screenshot); configurable vía YAML (modelo YOLO, thresholds, clases de interés); optimizado para ≥ 20 FPS en CPU (sin GPU).',
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
        question: '¿Qué es OpenCV y cuál es su uso principal en Python?',
        options: [
          'Una librería de visión por computadora que permite procesar imágenes y video: leer, transformar, detectar rostros, aplicar filtros, y hacer OCR',
          'Un sistema de control de versiones para proyectos de visión',
          'Un framework web para aplicaciones de realidad aumentada',
          'Un editor de imágenes como Photoshop pero en Python',
        ],
        correctIndex: 0,
        explanation: 'OpenCV (Open Computer Vision) es la librería estándar de facto para visión por computadora. En Python se usa como cv2. Permite: leer/escribir imágenes y video, aplicar transformaciones (resize, rotate, crop), detectar rostros con Haar cascades, hacer thresholding y morfología, y integrarse con modelos de deep learning.',
      },
      {
        question: '¿Qué es YOLOv8 y por qué es popular para detección de objetos?',
        options: [
          'Un modelo de deep learning que detecta objetos en imágenes/video en tiempo real (5ms por frame en GPU) con alta precisión — "You Only Look Once" significa que procesa toda la imagen en una sola pasada',
          'Un editor de video que solo permite ver una frame a la vez',
          'Un formato de compresión de imágenes para visión por computadora',
          'Un algoritmo de clustering para agrupar objetos similares',
        ],
        correctIndex: 0,
        explanation: 'YOLOv8 de Ultralytics detecta objetos en una sola pasada de la imagen por la red neuronal (de ahí "You Only Look Once"). Otros modelos como R-CNN hacen múltiples pasadas por regiones. YOLOv8 logra 5ms por frame en GPU, permitiendo procesamiento de video en tiempo real (30+ FPS). Detecta 80 clases COCO: persona, auto, perro, etc.',
      },
      {
        question: '¿Por qué es necesario el preprocesamiento de imágenes antes de OCR con Tesseract?',
        options: [
          'Porque Tesseract sin preprocesamiento tiene ~60% de precisión en documentos reales — con grayscale, threshold, deskew y denoise llega a 85-90%',
          'Porque Tesseract no puede leer imágenes a color',
          'Porque el preprocesamiento reduce el tamaño del archivo',
          'Porque es un requisito legal antes de procesar documentos',
        ],
        correctIndex: 0,
        explanation: 'Tesseract funciona mejor con imágenes limpias: texto negro sobre fondo blanco, sin rotación, sin ruido. El preprocesamiento con OpenCV incluye: (1) grayscale, (2) adaptive threshold para binarizar, (3) deskew para corregir rotación, (4) denoise para eliminar ruido. Sin estos pasos, Tesseract confunde caracteres y la precisión cae al 60%.',
      },
      {
        question: '¿Qué es CLIP de OpenAI y para qué sirve?',
        options: [
          'Un modelo que alinea imágenes y texto en el mismo espacio vectorial, permitiendo buscar imágenes con descripciones de texto y viceversa (zero-shot classification)',
          'Un editor de video que recorta clips automáticamente',
          'Un formato de compresión de imágenes para web',
          'Un sistema de gestión de proyectos para equipos de diseño',
        ],
        correctIndex: 0,
        explanation: 'CLIP (Contrastive Language-Image Pre-training) entrena un modelo conjuntamente con imágenes y texto para que ambos modos queden en el mismo espacio vectorial. Permite: dar una imagen y un set de textos, y CLIP dice cuál texto describe mejor la imagen. Útil para zero-shot image classification sin entrenar un modelo custom.',
      },
      {
        question: '¿Qué es TensorRT y cuándo se usa en visión por computadora?',
        options: [
          'Un optimizador de inferencia de NVIDIA que compila modelos de deep learning a código GPU optimizado — 2-5x más rápido que PyTorch en inferencia',
          'Un sistema de tracking de tensores para debugging',
          'Un formato de exportación de modelos como ONNX',
          'Una librería de visualización de tensores en 3D',
        ],
        correctIndex: 0,
        explanation: 'TensorRT toma un modelo entrenado (PyTorch, ONNX) y lo optimiza para inferencia en GPU NVIDIA: fusiona capas, cuantiza a FP16/INT8, y optimiza kernels. Resultado: 2-5x más rápido que PyTorch puro. Esencial para visión por computadora en tiempo real en producción (ej: cámaras de seguridad que procesan 30 FPS).',
      },
    ],
  },
  resources: {
    docs: [
      { label: 'Ultralytics YOLO v11 docs', url: 'Ultralytics YOLO v11 docs' },
      { label: 'MediaPipe Python', url: 'MediaPipe Python' },
      { label: 'OpenCV docs', url: 'OpenCV docs' },
      { label: 'ByteTrack', url: 'ByteTrack' },
      { label: 'FastAPI streaming', url: 'FastAPI streaming' },
    ],
    books: [
      { label: 'Python 201 — Michael Driscoll', note: 'Capítulos relevantes para esta sección' },
    ],
    courses: [
      { label: 'Real Python', url: 'https://realpython.com', note: 'Tutoriales complementarios' },
    ],
  },
}
