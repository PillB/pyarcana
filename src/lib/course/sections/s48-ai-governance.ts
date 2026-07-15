import type { CourseSection } from '../../types'

export const section48: CourseSection = {
  id: 'ai-governance',
  index: 48,
  title: 'Gobernanza de IA, Ética y Compliance',
  shortTitle: 'Gobernanza de IA, Ética y Comp',
  tagline: 'La IA sin gobernanza es como un auto sin frenos — puede funcionar a gran velocidad hasta que choca.',
  estimatedHours: 10,
  level: 'Master',
  phase: 3,
  icon: 'Scale',
  accentColor: 'bg-gradient-to-br from-amber-500 to-red-600',
  jobRelevance: 'La EU AI Act (en vigor 2026) y el Executive Order de Biden/Trump sobre AI tienen implicaciones directas para empresas que operan sistemas de IA. Los roles de AI Engineer senior en enterprises requieren conocimiento de compliance. Este es un diferenciador enorme en el mercado.',
  learningOutcomes: [
    { text: 'Entender EU AI Act (2026): categorías de riesgo (unacceptable, high, limited, minimal), obligaciones por nivel' },
    { text: 'Aplicar ISO 42001 (AI Management Systems) para organizaciones' },
    { text: 'Construir un AI governance framework: model cards, datasheets, fairness assessments' },
    { text: 'Implementar fairness metrics con fairlearn: demographic parity, equalized odds' },
    { text: 'Detectar y mitigar bias en datasets con herramientas de ML fairness' },
    { text: 'Construir audit trails para sistemas de IA de alto riesgo (GDPR + AI Act compliance)' },
  ],
  theory: [
    {
      heading: 'Gobernanza de IA: frameworks, policies y compliance',
      paragraphs: [
        'La gobernanza de IA abarca bias detection, fairness, transparencia, y compliance. En Python, fairlearn de Microsoft mide fairness con métricas como demographic parity (la predicción es independiente del grupo demográfico) y equalized odds (el modelo tiene el mismo FPR y TPR en todos los grupos). Un disparate impact ratio < 0.8 indica bias: el modelo aprueba créditos al 40% de mujeres pero al 60% de hombres, ratio = 40/60 = 0.67 < 0.8 → hay bias. La mitigación incluye reweighting (dar más peso a muestras del grupo desaventajado) o post-processing (ajustar el threshold por grupo).',
        'EU AI Act (en vigor desde febrero 2025) clasifica sistemas de IA en 4 niveles de riesgo: unacceptable (prohibido), high (regulación estricta), limited (transparencia), minimal (sin regulación). Los sistemas de scoring crediticio, contratación, y justicia son "high risk" y requieren: evaluación de impacto, documentación técnica, logging, human oversight, y conformidad con estándares de calidad. Las empresas peruanas que sirven clientes europeos deben cumplir. Un model card (documentación del modelo) es el primer paso: describe intended use, training data, métricas, limitaciones, y consideraciones éticas.',
        'La auditoría de sistemas de IA es un proceso continuo, no un evento único. Checklist trimestral: (1) ¿El modelo sigue siendo preciso o hay drift? (2) ¿Los datos de entrada siguen teniendo la misma distribución? (3) ¿Hay nuevos sesgos detectados? (4) ¿Las regulaciones cambiaron? (5) ¿Hay parches de seguridad pendientes? Automatiza lo que puedas con pytest + custom assertions: `assert fairness_ratio > 0.8`, `assert accuracy > 0.85`, `assert no_pii_in_logs`. Cuando un assert falla, el pipeline se detiene y notifica al equipo. Sin auditoría continua, tu modelo de IA se degrada silenciosamente hasta que alguien nota que las predicciones son incorrectas — para entonces, el daño ya está hecho.',
      ],
    },
  ],
  iDo: {
    intro: 'Te muestro paso a paso cómo aplicar los conceptos de esta sección con ejemplos prácticos.',
    steps: [
      {
        description: 'Implementar bias detection en un modelo de scoring crediticio',
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
        instruction: 'Implementa fairness metrics en un modelo con fairlearn',
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
    title: 'AI Governance Framework',
    context: 'Documento de governance para el sistema de churn prediction (S10) con: model card, datasheet, fairness assessment con fairlearn, audit trail, y mapa de riesgos EU AI Act.',
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
        question: '¿Qué es el EU AI Act y a quién aplica?',
        options: [
          'Regulación de la UE que clasifica sistemas de IA en 4 niveles de riesgo: unacceptable (prohibido), high (regulación estricta), limited (transparencia), minimal (sin regulación) — aplica a empresas que sirven clientes europeos',
          'Un framework de testing de IA',
          'Un modelo de lenguaje',
          'Un estándar de calidad de datos',
        ],
        correctIndex: 0,
        explanation: 'EU AI Act (en vigor desde feb 2025): scoring crediticio, contratación y justicia son "high risk" — requieren evaluación de impacto, documentación, logging, human oversight. Las empresas peruanas que sirven clientes europeos deben cumplir. El non-compliance puede resultar en multas de hasta 7% del revenue global.',
      },
      {
        question: '¿Qué es bias detection en ML?',
        options: [
          'Medir si el modelo tiene el mismo accuracy/precision en distintos grupos demográficos — un disparate impact ratio < 0.8 indica bias',
          'Es detectar errores en el código',
          'Es detectar outliers en los datos',
          'Es detectar malware en el modelo',
        ],
        correctIndex: 0,
        explanation: 'Bias detection: si el modelo aprueba créditos al 60% de hombres pero solo al 40% de mujeres, el ratio = 40/60 = 0.67 < 0.8 → hay bias. fairlearn de Microsoft mide demographic parity, equalized odds. La mitigación incluye reweighting o ajustar thresholds por grupo.',
      },
      {
        question: '¿Qué es un model card?',
        options: [
          'Documento que describe: uso previsto, datos de entrenamiento, métricas, limitaciones, consideraciones éticas — transparencia para usuarios y reguladores',
          'Una tarjeta de presentación del modelo',
          'Un tipo de GPU',
          'Un formato de exportación',
        ],
        correctIndex: 0,
        explanation: 'Un model card (Google, 2018) documenta: intended use (¿para qué sirve?), training data (¿con qué se entrenó?), metrics (¿qué accuracy tiene?), ethical considerations (¿qué sesgos tiene?), limitations (¿qué NO debe hacer?). Es el primer paso para compliance con EU AI Act.',
      },
      {
        question: '¿Qué es el principio de human oversight en IA?',
        options: [
          'Un humano debe poder intervenir, corregir o desactivar el sistema de IA en cualquier momento — especialmente en decisiones de alto riesgo (crédito, salud, justicia)',
          'Un humano debe programar la IA manualmente',
          'Un humano debe supervisar cada predicción individual',
          'No es necesario si la IA es precisa',
        ],
        correctIndex: 0,
        explanation: 'Human oversight: el sistema debe tener un "botón de parada" que un humano puede activar. En scoring creditício, un humano debe poder revisar y revertir la decisión del modelo. En salud, un médico debe confirmar el diagnóstico. Sin oversight, el modelo puede tomar decisiones destructivas sin remedio.',
      },
      {
        question: '¿Por qué remover una feature sensible (ej: género) no elimina el bias?',
        options: [
          'Porque otras features (código postal, nombre, escuela) pueden actuar como proxies que permiten inferir el género — se llama bias por proxy',
          'Porque el bias siempre existe sin importar qué hagas',
          'Porque remover features empeora el modelo',
          'Porque el género es la única feature que importa',
        ],
        correctIndex: 0,
        explanation: 'Si quitas "género" pero dejas "código postal" y "nombre", el modelo puede inferir género: ciertos códigos postales tienen más mujeres, ciertos nombres son femeninos. Esto es bias por proxy. Solución: medir fairness métricas después de entrenar, no asumir que quitar la feature sensible basta.',
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
