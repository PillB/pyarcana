import type { CourseSection } from '../../types'

export const section40: CourseSection = {
  id: 'agentic-architecture',
  index: 40,
  title: 'Arquitectura de Sistemas Agénticos a Escala',
  shortTitle: 'Arquitectura de Sistemas Agént',
  tagline: 'Los sistemas que toman decisiones por sí solos, a escala industrial.',
  estimatedHours: 14,
  level: 'Master',
  phase: 3,
  icon: 'Network',
  accentColor: 'bg-gradient-to-br from-amber-500 to-red-600',
  jobRelevance: 'Los roles de Principal/Staff AI Engineer en USA (2026, $180K-$250K) requieren diseñar arquitecturas de sistemas agénticos completos. Cubre los patrones arquitecturales avanzados que usan empresas como OpenAI, Anthropic, y startups AI de primer nivel.',
  learningOutcomes: [
    { text: 'Diseñar arquitecturas multi-agent a escala: Network, Supervisor, Hierarchical, Swarm patterns' },
    { text: 'Implementar agent-to-agent communication con Model Context Protocol (MCP)' },
    { text: 'Construir sistemas de evaluación automática de agentes (LLM-as-judge)' },
    { text: 'Gestionar recursos de agentes: token budgets, tool quotas, timeout hierarchies' },
    { text: 'Implementar checkpointing y resumption de workflows largos (LangGraph persistence)' },
    { text: 'Diseñar para fault tolerance: qué pasa cuando un sub-agent falla, retries, compensación' },
    { text: 'Construir observabilidad completa de sistemas agénticos con LangSmith + custom metrics' },
  ],
  theory: [
    {
      heading: 'Patrones multi-agent avanzados: Network (peer-to-peer), Supervisor (centralizado), Hierarchical (árbol), Swarm (dinámico con handoffs)',
      paragraphs: [
        'En esta lección vamos a explorar patrones multi-agent avanzados: network (peer-to-peer), supervisor (centralizado), hierarchical (árbol), swarm (dinámico con handoffs) en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender patrones multi-agent avanzados: network (peer-to-peer), supervisor (centralizado), hierarchical (árbol), swarm (dinámico con handoffs) es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, patrones multi-agent avanzados: network (peer-to-peer), supervisor (centralizado), hierarchical (árbol), swarm (dinámico con handoffs) se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Model Context Protocol (MCP): estándar emergente de Anthropic para tool/resource sharing entre agents',
      paragraphs: [
        'En esta lección vamos a explorar model context protocol (mcp): estándar emergente de anthropic para tool/resource sharing entre agents en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender model context protocol (mcp): estándar emergente de anthropic para tool/resource sharing entre agents es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, model context protocol (mcp): estándar emergente de anthropic para tool/resource sharing entre agents se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Agent evaluation: LLM-as-judge, pairwise evaluation, trajectory evaluation, benchmark construction',
      paragraphs: [
        'En esta lección vamos a explorar agent evaluation: llm-as-judge, pairwise evaluation, trajectory evaluation, benchmark construction en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender agent evaluation: llm-as-judge, pairwise evaluation, trajectory evaluation, benchmark construction es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, agent evaluation: llm-as-judge, pairwise evaluation, trajectory evaluation, benchmark construction se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Resource management: per-agent token budgets, circuit breakers para tools costosas',
      paragraphs: [
        'En esta lección vamos a explorar resource management: per-agent token budgets, circuit breakers para tools costosas en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender resource management: per-agent token budgets, circuit breakers para tools costosas es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, resource management: per-agent token budgets, circuit breakers para tools costosas se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Long-running workflows: LangGraph checkpointing, human approval gates, resumption after failures',
      paragraphs: [
        'En esta lección vamos a explorar long-running workflows: langgraph checkpointing, human approval gates, resumption after failures en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender long-running workflows: langgraph checkpointing, human approval gates, resumption after failures es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, long-running workflows: langgraph checkpointing, human approval gates, resumption after failures se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Distributed agent state: Redis para estado compartido, locks, consensus entre agentes',
      paragraphs: [
        'En esta lección vamos a explorar distributed agent state: redis para estado compartido, locks, consensus entre agentes en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender distributed agent state: redis para estado compartido, locks, consensus entre agentes es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, distributed agent state: redis para estado compartido, locks, consensus entre agentes se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Cost management: modelo cascading (cheap → expensive), prompt caching, output caching',
      paragraphs: [
        'En esta lección vamos a explorar cost management: modelo cascading (cheap → expensive), prompt caching, output caching en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender cost management: modelo cascading (cheap → expensive), prompt caching, output caching es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, cost management: modelo cascading (cheap → expensive), prompt caching, output caching se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
  ],
  iDo: {
    intro: 'Te muestro paso a paso cómo aplicar los conceptos de esta sección con ejemplos prácticos.',
    steps: [
      {
        description: 'Construir una arquitectura Hierarchical con 3 niveles: Orchestrator → Domain Supervisors → Specialist Agents',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Construir una arquitectura Hierarchical con 3 niveles: Orchestrator → Domain Supervisors → Specialist Agents\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
      {
        description: 'Implementar MCP tool server con recursos compartidos accesibles por múltiples agentes',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Implementar MCP tool server con recursos compartidos accesibles por múltiples agentes\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
      {
        description: 'Construir un LLM-as-judge evaluator que evalúa la calidad de respuestas de un agente en producción',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Construir un LLM-as-judge evaluator que evalúa la calidad de respuestas de un agente en producción\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
    ],
  },
  weDo: {
    intro: 'Ahora te toca a ti practicar con guía. Lee cada instrucción, intenta escribir el código, y si te trabas revisa la solución.',
    steps: [
      {
        instruction: 'Implementar checkpointing con PostgreSQL para un workflow de 30 minutos que puede ser interrumpido y reanudado',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Implementar checkpointing con PostgreSQL para un workflow de 30 minutos que puede ser interrumpido y reanudado\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Implementar checkpointing con PostgreSQL para un workflow de 30 minutos que puede ser interrumpido y reanudado\nprint("Solución implementada")',
        },
      },
      {
        instruction: 'Agregar per-agent token budget enforcement que hace fallback a modelo más barato',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Agregar per-agent token budget enforcement que hace fallback a modelo más barato\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Agregar per-agent token budget enforcement que hace fallback a modelo más barato\nprint("Solución implementada")',
        },
      },
      {
        instruction: 'Construir dashboard de observabilidad que muestra: número de agentes activos, token consumption, task success rate',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Construir dashboard de observabilidad que muestra: número de agentes activos, token consumption, task success rate\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Construir dashboard de observabilidad que muestra: número de agentes activos, token consumption, task success rate\nprint("Solución implementada")',
        },
      },
    ],
  },
  youDo: {
    title: 'Agentic Platform Architecture',
    context: 'agentic-platform-v2: arquitectura Hierarchical con 3 niveles y 6+ agentes especializados; MCP integration para recursos compartidos (base de conocimiento, herramientas de análisis); sistema de evaluación automática con LLM-as-judge + dashboard de métricas; checkpointing persistente en PostgreSQL; load testing del sistema (100 tareas concurrentes, métricas de throughput y costo); white paper técnico de 5 páginas describiendo la arquitectura, decisiones de diseño y benchmarks.',
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
        question: '¿Qué es un sistema agéntico?',
        options: [
          'Sistema donde un LLM decide qué acciones tomar, usa herramientas, y razona en bucle hasta completar una tarea — va más allá de Q&A',
          'Un sistema con un solo agente que responde preguntas',
          'Un sistema de agentes de viajes',
          'Un framework de testing',
        ],
        correctIndex: 0,
        explanation: 'Un sistema agéntico: el LLM recibe un objetivo ("investiga la competencia y genera un reporte"), decide qué tools usar (web search, DB query, LLM), razona sobre los resultados, y itera hasta completar. Va más allá de chat: es automatización con IA.',
      },
      {
        question: '¿Qué es multi-agent orchestration?',
        options: [
          'Múltiples agentes especializados colaboran: uno investiga, otro analiza, otro escribe — cada uno con tools y prompts distintos',
          'Un agente que hace todo',
          'Múltiples LLMs ejecutándose en paralelo sin coordinación',
          'Un sistema de colas con agentes',
        ],
        correctIndex: 0,
        explanation: 'Multi-agent: cada agente tiene un rol. Researcher (busca datos), Analyst (procesa con pandas), Writer (genera reporte). Se comunican via shared state. LangGraph orquesta el flujo. Más efectivo que un solo agente para tareas complejas.',
      },
      {
        question: '¿Qué es el tool use en agentes?',
        options: [
          'El agente llama funciones externas (API, DB, código) para obtener información o ejecutar acciones — amplía lo que el LLM puede hacer',
          'Usar herramientas de desarrollo como IDE',
          'Usar herramientas de oficina',
          'Es lo mismo que function calling pero en agentes',
        ],
        correctIndex: 0,
        explanation: 'Tools amplían al LLM: search_web(), query_database(), execute_code(), send_email(). El agente decide cuándo usar cada tool basándose en el contexto. Sin tools, el LLM solo puede usar su conocimiento entrenado. Con tools, puede interactuar con el mundo real.',
      },
      {
        question: '¿Qué es el razonamiento ReAct (Reason+Act)?',
        options: [
          'Patrón donde el agente razona ("necesito buscar X"), actúa (llama tool), observa el resultado, y repite hasta completar la tarea',
          'Un framework de React.js',
          'Un algoritmo de recomendación',
          'Un tipo de red neuronal',
        ],
        correctIndex: 0,
        explanation: 'ReAct: Thought ("necesito buscar los precios de la competencia") → Action (search_web("precios competencia")) → Observation (resultados) → Thought ("ahora necesito comparar") → Action (compare_prices()). El agente razona y actúa en bucle hasta completar.',
      },
      {
        question: '¿Cómo se previene que un agente entre en bucle infinito?',
        options: [
          'Límite de iteraciones (max_iterations=10), timeout por tool call, y detección de respuestas repetitivas — sin esto, el agente puede gastar tokens indefinidamente',
          'Es imposible que un agente entre en bucle',
          'Apagando el servidor',
          'Usando un modelo más pequeño',
        ],
        correctIndex: 0,
        explanation: 'Sin límites, un agente puede llamar tools en bucle: "buscar" → "buscar de nuevo" → "buscar otra vez". Mitigaciones: max_iterations=10 (fuerza parar), timeout por tool (30s), y system prompt que dice "si no encuentras después de 3 intentos, di que no lo sabes".',
      },
    ],
  },
  resources: {
    docs: [
      { label: 'LangGraph Multi-Agent docs', url: 'LangGraph Multi-Agent docs' },
      { label: 'Model Context Protocol', url: 'Model Context Protocol' },
      { label: 'State of Agent Engineering — LangChain', url: 'State of Agent Engineering — LangChain' },
      { label: 'Building Production Multi-Agent Systems', url: 'Building Production Multi-Agent Systems' },
      { label: 'Multi-agent with LangGraph + MCP (FreeCodeCamp)', url: 'Multi-agent with LangGraph + MCP (FreeCodeCamp)' },
    ],
    books: [
      { label: 'Python 201 — Michael Driscoll', note: 'Capítulos relevantes para esta sección' },
    ],
    courses: [
      { label: 'Real Python', url: 'https://realpython.com', note: 'Tutoriales complementarios' },
    ],
  },
}
