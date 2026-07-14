import type { CourseSection } from '../../types'

export const section24: CourseSection = {
  id: 'rpa-advanced',
  index: 24,
  title: 'RPAs Avanzados y Orquestación',
  shortTitle: 'RPAs Avanzados y Orquestación',
  tagline: 'De macros básicos a robots de producción que trabajan 24/7 sin que tú estés presente.',
  estimatedHours: 12,
  level: 'Competente',
  phase: 1,
  icon: 'Bot',
  accentColor: 'bg-gradient-to-br from-blue-500 to-indigo-600',
  jobRelevance: 'Los RPAs avanzados son la evolución de la sección 13 del curso. Mientras que la sección 13 cubre RPAs básicos con Playwright, esta sección agrega orquestación con Prefect, manejo de errores de producción, integración con APIs de IA, y técnicas anti-detección. Los roles de RPA Developer/Automation Engineer en USA requieren exactamente estas habilidades.',
  learningOutcomes: [
    { text: 'Construir RPAs resilientes con retry logic, circuit breakers y alertas de fallo' },
    { text: 'Orquestar múltiples bots con Prefect flows con dependencias entre tareas' },
    { text: 'Aplicar técnicas anti-detección en Playwright: user agents, fingerprint spoofing, stealth mode' },
    { text: 'Integrar AI en automatizaciones: usar GPT-4o-mini para tomar decisiones contextuales en el bot' },
    { text: 'Implementar RPA con captura de datos + entity resolution (RapidFuzz, sección 22)' },
    { text: 'Gestionar estados de browser sessions y cookies para automatizaciones de larga duración' },
    { text: 'Monitorear y alertar fallos de bots con notificaciones Slack/email' },
  ],
  theory: [
    {
      heading: 'RPAs de producción vs scripts: manejo de timeouts, selectors rotos, cambios de UI, rate limits',
      paragraphs: [
        'En esta lección vamos a explorar rpas de producción vs scripts: manejo de timeouts, selectors rotos, cambios de ui, rate limits en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender rpas de producción vs scripts: manejo de timeouts, selectors rotos, cambios de ui, rate limits es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, rpas de producción vs scripts: manejo de timeouts, selectors rotos, cambios de ui, rate limits se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Playwright avanzado: page.route() para interceptar requests, Browser.contexts para sesiones paralelas, storage_state para persistir cookies',
      paragraphs: [
        'En esta lección vamos a explorar playwright avanzado: page.route() para interceptar requests, browser.contexts para sesiones paralelas, storage_state para persistir cookies en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender playwright avanzado: page.route() para interceptar requests, browser.contexts para sesiones paralelas, storage_state para persistir cookies es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, playwright avanzado: page.route() para interceptar requests, browser.contexts para sesiones paralelas, storage_state para persistir cookies se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Anti-detección: playwright-stealth, proxies rotativos, delays aleatorios, fingerprinting',
      paragraphs: [
        'En esta lección vamos a explorar anti-detección: playwright-stealth, proxies rotativos, delays aleatorios, fingerprinting en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender anti-detección: playwright-stealth, proxies rotativos, delays aleatorios, fingerprinting es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, anti-detección: playwright-stealth, proxies rotativos, delays aleatorios, fingerprinting se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Orquestación con Prefect: flows de múltiples bots con concurrencia controlada (ConcurrentTaskRunner)',
      paragraphs: [
        'En esta lección vamos a explorar orquestación con prefect: flows de múltiples bots con concurrencia controlada (concurrenttaskrunner) en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender orquestación con prefect: flows de múltiples bots con concurrencia controlada (concurrenttaskrunner) es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, orquestación con prefect: flows de múltiples bots con concurrencia controlada (concurrenttaskrunner) se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Agentic RPAs: usar LLM para decidir el siguiente paso cuando la UI es ambigua',
      paragraphs: [
        'En esta lección vamos a explorar agentic rpas: usar llm para decidir el siguiente paso cuando la ui es ambigua en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender agentic rpas: usar llm para decidir el siguiente paso cuando la ui es ambigua es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, agentic rpas: usar llm para decidir el siguiente paso cuando la ui es ambigua se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Error handling robusto: retries con exponential backoff, screenshots en fallo, notificaciones',
      paragraphs: [
        'En esta lección vamos a explorar error handling robusto: retries con exponential backoff, screenshots en fallo, notificaciones en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender error handling robusto: retries con exponential backoff, screenshots en fallo, notificaciones es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, error handling robusto: retries con exponential backoff, screenshots en fallo, notificaciones se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'RPA + ETL: automatizar descarga de reportes → limpiar con pandas → subir a base de datos',
      paragraphs: [
        'En esta lección vamos a explorar rpa + etl: automatizar descarga de reportes → limpiar con pandas → subir a base de datos en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender rpa + etl: automatizar descarga de reportes → limpiar con pandas → subir a base de datos es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, rpa + etl: automatizar descarga de reportes → limpiar con pandas → subir a base de datos se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
  ],
  iDo: {
    intro: 'Te muestro paso a paso cómo aplicar los conceptos de esta sección con ejemplos prácticos.',
    steps: [
      {
        description: 'Construir un bot con Playwright que extrae precios de un e-commerce con paginación, manejando timeouts y errores',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Construir un bot con Playwright que extrae precios de un e-commerce con paginación, manejando timeouts y errores\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
      {
        description: 'Agregar playwright-stealth y un proxy para evitar detección',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Agregar playwright-stealth y un proxy para evitar detección\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
      {
        description: 'Integrar GPT-4o-mini para que el bot decida qué hacer cuando encuentra un captcha (notificar vs reintentar)',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Integrar GPT-4o-mini para que el bot decida qué hacer cuando encuentra un captcha (notificar vs reintentar)\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
    ],
  },
  weDo: {
    intro: 'Ahora te toca a ti practicar con guía. Lee cada instrucción, intenta escribir el código, y si te trabas revisa la solución.',
    steps: [
      {
        instruction: 'Orquestar 3 bots en paralelo con Prefect y ConcurrentTaskRunner',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Orquestar 3 bots en paralelo con Prefect y ConcurrentTaskRunner\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Orquestar 3 bots en paralelo con Prefect y ConcurrentTaskRunner\nprint("Solución implementada")',
        },
      },
      {
        instruction: 'Implementar alertas de fallo via webhook a Slack cuando un bot falla 3 veces consecutivas',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Implementar alertas de fallo via webhook a Slack cuando un bot falla 3 veces consecutivas\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Implementar alertas de fallo via webhook a Slack cuando un bot falla 3 veces consecutivas\nprint("Solución implementada")',
        },
      },
      {
        instruction: 'Combinar salida del bot con RapidFuzz entity resolution para consolidar datos de múltiples fuentes',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Combinar salida del bot con RapidFuzz entity resolution para consolidar datos de múltiples fuentes\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Combinar salida del bot con RapidFuzz entity resolution para consolidar datos de múltiples fuentes\nprint("Solución implementada")',
        },
      },
    ],
  },
  youDo: {
    title: 'Pipeline RPA Orquestado',
    context: 'rpa-orchestrated-pipeline: 3 bots Playwright (extraen datos de 3 fuentes distintas: gobiernos, portales públicos peruanos, e-commerce); cada bot con retry logic (3 intentos), screenshot en fallo, logging estructurado; orquestado con Prefect (dependencias entre bots, paralelismo configurable); datos consolidados con RapidFuzz entity resolution; resultado final sube automáticamente a PostgreSQL; alertas Slack configuradas para fallo de cualquier bot; dashboard de monitoring en Prefect UI.',
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
        question: '¿Cuál de los siguientes describe mejor: Construir RPAs resilientes con retry logic, circuit breakers y alertas de fallo?',
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
        question: '¿Cuál de los siguientes describe mejor: Orquestar múltiples bots con Prefect flows con dependencias entre tareas?',
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
        question: '¿Cuál de los siguientes describe mejor: Aplicar técnicas anti-detección en Playwright: user agents, fingerprint spoofing, stealth mode?',
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
        question: '¿Cuál de los siguientes describe mejor: Integrar AI en automatizaciones: usar GPT-4o-mini para tomar decisiones contextuales en el bot?',
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
        question: '¿Cuál de los siguientes describe mejor: Implementar RPA con captura de datos + entity resolution (RapidFuzz, sección 22)?',
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
      { label: 'Playwright Python docs', url: 'Playwright Python docs' },
      { label: 'playwright-stealth', url: 'playwright-stealth' },
      { label: 'Prefect docs', url: 'Prefect docs' },
      { label: 'Automation Engineer job market 2025', url: 'Automation Engineer job market 2025' },
    ],
    books: [
      { label: 'Python 201 — Michael Driscoll', note: 'Capítulos relevantes para esta sección' },
    ],
    courses: [
      { label: 'Real Python', url: 'https://realpython.com', note: 'Tutoriales complementarios' },
    ],
  },
}
