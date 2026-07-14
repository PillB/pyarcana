import type { CourseSection } from '../../types'

export const section28: CourseSection = {
  id: 'llm-agents',
  index: 28,
  title: 'LLM Agents con LangGraph — Producción',
  shortTitle: 'LLM Agents con LangGraph — Pro',
  tagline: 'Los agentes no son demos. Son sistemas con estado, herramientas y decisiones que escalan.',
  estimatedHours: 14,
  level: 'Senior',
  phase: 2,
  icon: 'BrainCircuit',
  accentColor: 'bg-gradient-to-br from-purple-500 to-fuchsia-600',
  jobRelevance: 'LangGraph es el framework estándar de producción para multi-agent systems en 2026. Las ofertas laborales de Senior AI Engineer en USA requieren explícitamente \'LangGraph\', \'multi-agent systems\', y \'production agent deployment\'. El survey de LangChain (1,300+ profesionales) confirma que multi-agent systems son la prioridad #1 en AI engineering.',
  learningOutcomes: [
    { text: 'Entender LangGraph como state machine: nodos, aristas, estado compartido' },
    { text: 'Implementar patrones de agentes: ReACT, Plan-and-Execute, Supervisor, Swarm' },
    { text: 'Construir multi-agent systems con handoffs y comunicación entre agentes' },
    { text: 'Implementar memoria a corto y largo plazo en agentes con MemorySaver y PostgreSQL' },
    { text: 'Integrar tool calling (function calling) con herramientas custom y APIs externas' },
    { text: 'Monitorear agentes con LangSmith: trazas, latencia, tokens, costos' },
    { text: 'Construir human-in-the-loop checkpoints para decisiones de alto riesgo' },
    { text: 'Aplicar seguridad en agents (OWASP LLM #6 — Excessive Agency)' },
  ],
  theory: [
    {
      heading: 'LangGraph fundamentals: StateGraph, TypedDict state, add_node(), add_edge(), add_conditional_edges()',
      paragraphs: [
        'En esta lección vamos a explorar langgraph fundamentals: stategraph, typeddict state, add_node(), add_edge(), add_conditional_edges() en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender langgraph fundamentals: stategraph, typeddict state, add_node(), add_edge(), add_conditional_edges() es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, langgraph fundamentals: stategraph, typeddict state, add_node(), add_edge(), add_conditional_edges() se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Patrones de agentes: ReACT (Reason + Act), Plan-and-Execute, Reflection, Multi-agent Supervisor',
      paragraphs: [
        'En esta lección vamos a explorar patrones de agentes: react (reason + act), plan-and-execute, reflection, multi-agent supervisor en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender patrones de agentes: react (reason + act), plan-and-execute, reflection, multi-agent supervisor es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, patrones de agentes: react (reason + act), plan-and-execute, reflection, multi-agent supervisor se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Tool calling: definir tools como funciones Python con @tool, JSON schema, parallel tool calls',
      paragraphs: [
        'En esta lección vamos a explorar tool calling: definir tools como funciones python con @tool, json schema, parallel tool calls en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender tool calling: definir tools como funciones python con @tool, json schema, parallel tool calls es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, tool calling: definir tools como funciones python con @tool, json schema, parallel tool calls se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Memoria de agentes: MemorySaver (in-memory), PostgresSaver (persistente), short-term vs long-term',
      paragraphs: [
        'En esta lección vamos a explorar memoria de agentes: memorysaver (in-memory), postgressaver (persistente), short-term vs long-term en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender memoria de agentes: memorysaver (in-memory), postgressaver (persistente), short-term vs long-term es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, memoria de agentes: memorysaver (in-memory), postgressaver (persistente), short-term vs long-term se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Multi-agent handoffs: Command(goto=\'agent_b\'), agent-as-node pattern',
      paragraphs: [
        'En esta lección vamos a explorar multi-agent handoffs: command(goto=\'agent_b\'), agent-as-node pattern en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender multi-agent handoffs: command(goto=\'agent_b\'), agent-as-node pattern es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, multi-agent handoffs: command(goto=\'agent_b\'), agent-as-node pattern se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'LangSmith observability: traces, evaluaciones automáticas, alertas de costo',
      paragraphs: [
        'En esta lección vamos a explorar langsmith observability: traces, evaluaciones automáticas, alertas de costo en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender langsmith observability: traces, evaluaciones automáticas, alertas de costo es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, langsmith observability: traces, evaluaciones automáticas, alertas de costo se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Human-in-the-loop: interrupt_before, aprobación de acciones de alto riesgo',
      paragraphs: [
        'En esta lección vamos a explorar human-in-the-loop: interrupt_before, aprobación de acciones de alto riesgo en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender human-in-the-loop: interrupt_before, aprobación de acciones de alto riesgo es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, human-in-the-loop: interrupt_before, aprobación de acciones de alto riesgo se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Seguridad en agents: least privilege en tools, sandboxing de code execution, rate limits por agente',
      paragraphs: [
        'En esta lección vamos a explorar seguridad en agents: least privilege en tools, sandboxing de code execution, rate limits por agente en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender seguridad en agents: least privilege en tools, sandboxing de code execution, rate limits por agente es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, seguridad en agents: least privilege en tools, sandboxing de code execution, rate limits por agente se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
  ],
  iDo: {
    intro: 'Te muestro paso a paso cómo aplicar los conceptos de esta sección con ejemplos prácticos.',
    steps: [
      {
        description: 'Construir un agente ReACT con 3 tools: search_web, read_file, write_to_db',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Construir un agente ReACT con 3 tools: search_web, read_file, write_to_db\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
      {
        description: 'Implementar un Supervisor que coordina 2 agentes especializados (research + writing)',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Implementar un Supervisor que coordina 2 agentes especializados (research + writing)\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
      {
        description: 'Agregar persistencia de memoria con PostgresSaver y mostrar cómo el agente \'recuerda\' conversaciones previas',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Agregar persistencia de memoria con PostgresSaver y mostrar cómo el agente \'recuerda\' conversaciones previas\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
    ],
  },
  weDo: {
    intro: 'Ahora te toca a ti practicar con guía. Lee cada instrucción, intenta escribir el código, y si te trabas revisa la solución.',
    steps: [
      {
        instruction: 'Añadir human-in-the-loop: el agente pide aprobación antes de ejecutar write_to_db',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Añadir human-in-the-loop: el agente pide aprobación antes de ejecutar write_to_db\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Añadir human-in-the-loop: el agente pide aprobación antes de ejecutar write_to_db\nprint("Solución implementada")',
        },
      },
      {
        instruction: 'Instrumentar el agente con LangSmith y analizar las trazas',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Instrumentar el agente con LangSmith y analizar las trazas\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Instrumentar el agente con LangSmith y analizar las trazas\nprint("Solución implementada")',
        },
      },
      {
        instruction: 'Implementar rate limiting en las tools para evitar costos excesivos',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Implementar rate limiting en las tools para evitar costos excesivos\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Implementar rate limiting en las tools para evitar costos excesivos\nprint("Solución implementada")',
        },
      },
    ],
  },
  youDo: {
    title: 'Multi-Agent Workflow en Producción',
    context: 'multi-agent-platform: Agente Orchestrator (recibe la tarea del usuario y la delega a sub-agentes); Agente Researcher (usa Tavily/Serper + RAG para investigar y retornar fuentes); Agente Analyst (procesa datos con pandas y genera insights); Agente Writer (genera reporte en Markdown con los insights del analyst); memoria persistente con PostgreSQL para recordar preferencias del usuario; human-in-the-loop checkpoint antes de generar el reporte final; monitoreo completo con LangSmith (traces públicas en el CV/portafolio).',
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
        question: '¿Cuál de los siguientes describe mejor: Entender LangGraph como state machine: nodos, aristas, estado compartido?',
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
        question: '¿Cuál de los siguientes describe mejor: Implementar patrones de agentes: ReACT, Plan-and-Execute, Supervisor, Swarm?',
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
        question: '¿Cuál de los siguientes describe mejor: Construir multi-agent systems con handoffs y comunicación entre agentes?',
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
        question: '¿Cuál de los siguientes describe mejor: Implementar memoria a corto y largo plazo en agentes con MemorySaver y PostgreSQL?',
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
        question: '¿Cuál de los siguientes describe mejor: Integrar tool calling (function calling) con herramientas custom y APIs externas?',
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
      { label: 'LangGraph docs', url: 'LangGraph docs' },
      { label: 'LangGraph Production Multi-Agent Guide', url: 'LangGraph Production Multi-Agent Guide' },
      { label: 'State of Agent Engineering — LangChain survey', url: 'State of Agent Engineering — LangChain survey' },
      { label: 'AI Engineer job requirements 2026', url: 'AI Engineer job requirements 2026' },
      { label: 'Multi-agent patterns (FreeCodeCamp 2026)', url: 'Multi-agent patterns (FreeCodeCamp 2026)' },
    ],
    books: [
      { label: 'Python 201 — Michael Driscoll', note: 'Capítulos relevantes para esta sección' },
    ],
    courses: [
      { label: 'Real Python', url: 'https://realpython.com', note: 'Tutoriales complementarios' },
    ],
  },
}
