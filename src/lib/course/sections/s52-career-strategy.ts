import type { CourseSection } from '../../types'

export const section52: CourseSection = {
  id: 'career-strategy',
  index: 52,
  title: 'Perfil Global y Estrategia de Carrera',
  shortTitle: 'Perfil Global y Estrategia de ',
  tagline: 'El trabajo de tu vida necesita la presentación de tu vida.',
  estimatedHours: 8,
  level: 'Master',
  phase: 3,
  icon: 'Rocket',
  accentColor: 'bg-gradient-to-br from-amber-500 to-red-600',
  jobRelevance: 'Cierre del roadmap con foco en empaquetar las 52 secciones en una presentación profesional para el mercado global. Sin esto, todo el trabajo técnico no se traduce en oportunidades reales. Cubre portfolio site, LinkedIn, CV ATS-friendly, entrevistas y networking estratégico.',
  learningOutcomes: [
    { text: 'Construir un portfolio site profesional con GitHub Pages o Vercel' },
    { text: 'Optimizar LinkedIn para visibilidad en recruiters de USA/Europa' },
    { text: 'Escribir un CV técnico que pase ATS y llame la atención de hiring managers' },
    { text: 'Prepararse para entrevistas técnicas en empresas globales: system design, coding, ML design' },
    { text: 'Estrategia de networking: contribución open source, conferencias, comunidades' },
    { text: 'Establecer tarifas como freelancer/contractor en plataformas globales (Toptal, Turing, Andela)' },
    { text: 'Plan de carrera 3 años: Junior → Mid → Senior → Staff en el mercado global' },
  ],
  theory: [
    {
      heading: 'Estrategia de carrera global: del Senior al Staff/Principal Engineer',
      paragraphs: [
        'Un portfolio site es tu CV interactivo. Debe mostrar 3 proyectos con demo en vivo (no solo código en GitHub), case study escrito (problema, solución, impacto), y stack técnico. Usa Next.js + Tailwind para un diseño profesional. Deploya en Vercel (gratis). Incluye: nombre, título, bio de 2 líneas, 3 proyectos con screenshots/demo, links a GitHub y LinkedIn, y un formulario de contacto. Sin portfolio site, eres uno más entre 1000 CVs. Con uno, demuestras que puedes construir cosas reales, no solo pasar entrevistas.',
        'Un CV técnico optimizado para ATS (Applicant Tracking Systems) tiene 70% de keyword overlap con el job description. ATS filtra CVs automáticamente antes de que un humano los vea. Si la oferta dice "Python, pandas, scikit-learn, AWS, Docker, Kubernetes", tu CV debe incluir esas palabras exactas. Formato: 1 página, sin tablas ni imágenes (ATS no las lee bien), logros cuantificables ("Reduje latencia 80% optimizando con ONNX, sirviendo 10M predicciones/día"), no responsabilidades ("Desarrollé pipelines de ML"). Usa verbos de acción: construí, optimicé, lideré, automaticé. Cada bullet point debe tener un número.',
        'El networking en conferencias es la forma más efectiva de conseguir entrevistas sin aplicar. Prepara un pitch de 2 minutos: quién soy, qué hago, qué busco, qué me hace único. Asiste a PyCon, DataDay, Latin America AI Summit, y meetups locales. Después de cada charla, acércate al speaker y haz una pregunta específica. Intercambia LinkedIn (no WhatsApp — más profesional). Después del evento, envía un mensaje: "Hola X, fue un gusto escuchar tu charla sobre Y en PyCon. Estoy trabajando en algo similar y me encantaría conversar". El 80% no responde, pero el 20% que sí puede cambiar tu carrera.',
      ],
    },
  ],
  iDo: {
    intro: 'Te muestro paso a paso cómo aplicar los conceptos de esta sección con ejemplos prácticos.',
    steps: [
      {
        description: 'Construir un portfolio site que showcase tus mejores proyectos',
        code: {
          language: 'python',
          title: 'demo.py',
          code: '# Portfolio site: 3 proyectos con demo en vivo\nprojects = [\n    {"title": "Churn Pipeline", "tech": ["XGBoost", "FastAPI", "Docker"], "impact": "Redujo churn 15%"},\n    {"title": "Familiarity Dashboard", "tech": ["RapidFuzz", "Next.js", "Leaflet"], "impact": "Detecto 500+ duplicados"},\n    {"title": "Invoice Bot", "tech": ["Playwright", "Ollama", "Tesseract"], "impact": "Automatizo 200h/mes"},\n]\nfor p in projects:\n    print(f"  {p[\'title\']}: {p[\'impact\']} ({\', \'.join(p[\'tech\'])})")\nprint("Deploy: Vercel gratis, HTTPS automatico, CDN global")',
        },
        why: 'Un portfolio site muestra 3 proyectos con demo en vivo, case study, stack tecnico y impacto cuantificable. Sin portfolio, eres uno mas entre 1000 CVs.',
      },
    ],
  },
  weDo: {
    intro: 'Ahora te toca a ti practicar con guía. Lee cada instrucción, intenta escribir el código, y si te trabas revisa la solución.',
    steps: [
      {
        instruction: 'Crea tu portfolio site con Next.js mostrando 3 proyectos con demos',
        hint: 'Revisa la teoría y el I Do antes de intentar este ejercicio.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# CV ATS: 70% keyword overlap con job description\n# Formato: 1 pagina, PDF, sin tablas/imagenes\n# Logros cuantificables (no responsabilidades):\n#\n# MALO: "Desarrollé pipelines de ML"\n# BUENO: "Construí pipeline de churn con XGBoost,\n#        reduciendo churn 15% y salvando S/2M anuales"\n#\n# MALO: "Trabajé con datos"\n# BUENO: "Procesé 50M transacciones/día con Kafka + Spark,\n#        reduciendo latencia 80% vs solución anterior"\nprint("CV ATS: cada bullet point debe tener un número")',
        },
      },
    ],
  },
  youDo: {
    title: 'Portfolio Site + CV Global',
    context: 'Sitio web de portfolio desplegado públicamente con bio, proyectos, skills, blog; CV en inglés y español, optimizado para ATS, con métricas reales de cada proyecto; LinkedIn profile optimizado con keywords de las 52 secciones del roadmap; \'Job hunt kit\': lista de 20 empresas target, email templates, pitch de 30 segundos.',
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
        question: '¿Qué debe incluir un portfolio site para roles tech internacionales?',
        options: [
          '3 proyectos con demo en vivo, case study escrito (problema → solución → impacto), y stack técnico — en Next.js + Tailwind, deployado en Vercel',
          'Solo un link a GitHub',
          'Solo un CV en PDF',
          'Solo una foto',
        ],
        correctIndex: 0,
        explanation: 'Un portfolio site muestra: (1) 3 proyectos con demo funcional (no solo código), (2) case study por proyecto (qué problema, qué hiciste, qué impacto), (3) stack técnico usado. Diseño profesional en Next.js + Tailwind. Deploy en Vercel gratis. Sin portfolio, eres uno más entre 1000 CVs.',
      },
      {
        question: '¿Qué es un CV optimizado para ATS (Applicant Tracking Systems)?',
        options: [
          'CV con 70% de keyword overlap con el job description, formato PDF sin tablas ni imágenes, y logros cuantificables (no responsabilidades)',
          'Un CV con colores y diseño creativo',
          'Un CV de 5 páginas con toda tu experiencia',
          'Un CV sin formato, solo texto',
        ],
        correctIndex: 0,
        explanation: 'ATS filtra CVs automáticamente por keywords. Si la oferta dice "Python, pandas, AWS, Docker", tu CV debe incluir esas palabras. Formato: PDF, sin tablas (ATS no las lee bien), sin imágenes. Logros: "Reduje latencia 80%" no "Desarrollé pipelines". 1 página máximo.',
      },
      {
        question: '¿Cómo preparas un pitch de networking de 2 minutos?',
        options: [
          'Quién soy, qué hago, qué busco, qué me hace único — 2 minutos máximo, practicado hasta que suene natural',
          'Leer tu CV completo',
          'Hablar de tu vida personal',
          'No preparar nada, improvisar',
        ],
        correctIndex: 0,
        explanation: 'Pitch de networking: "Soy [nombre], Data Scientist con 3 años en [sector]. Trabajo en [proyecto destacado] con [stack]. Busco roles en [empresa/tipo]. Lo que me hace único es [diferenciador]". 2 minutos. Practica con timer. En conferencias, después de cada charla, acércate al speaker con tu pitch.',
      },
      {
        question: '¿Por qué es importante contribuir a Open Source para tu carrera?',
        options: [
          'Demuestra habilidad técnica real, te da visibilidad internacional, y los reclutadores buscan PRs merged en proyectos conocidos — es el portfolio más creíble',
          'Porque paga bien',
          'Porque es obligatorio para graduarse',
          'No es importante',
        ],
        correctIndex: 0,
        explanation: 'Open Source: un PR merged en pandas o scikit-learn es evidencia pública de que tu código pasó code review de maintainers serios. Los reclutadores buscan "github.com/usuario" y revisan PRs. Es más creíble que cualquier certificación. Empieza con "good first issues" en proyectos que ya usas.',
      },
      {
        question: '¿Cómo negicias salario para un rol tech remoto internacional?',
        options: [
          'Investiga rangos en Levels.fifty/Glassdoor, no des el primero un número, usa tu oferta actual como ancla, y negicia equity/bonus además del base salary',
          'Acepta la primera oferta siempre',
          'Pide 10x más y ve qué pasa',
          'No se puede negociar',
        ],
        correctIndex: 0,
        explanation: 'Negociación: (1) investiga el rango en levels.fyi para la empresa y nivel, (2) si preguntan tu expectativa, di "estoy abierto, cuál es el rango para este rol?", (3) cuando den un rango, pide el top, (4) negicia equity (stock options) y sign-on bonus además del base. Un remote US role puede pagar 3-5x un rol local en Lima.',
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
