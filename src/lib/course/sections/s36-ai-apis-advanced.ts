import type { CourseSection } from '../../types'

export const section36: CourseSection = {
  id: 'ai-apis-advanced',
  index: 36,
  title: 'APIs de IA Avanzadas — Tool Use, Structured Outputs, Batch API',
  shortTitle: 'APIs de IA Avanzadas — Tool Us',
  tagline: 'Las APIs de IA son herramientas. Aprende a usarlas como un artesano, no como un usuario casual.',
  estimatedHours: 12,
  level: 'Senior',
  phase: 2,
  icon: 'Sparkles',
  accentColor: 'bg-gradient-to-br from-purple-500 to-fuchsia-600',
  jobRelevance: 'Las APIs comerciales de LLMs (OpenAI, Anthropic, Google) son el corazón de las aplicaciones AI 2026. Senior AI Engineers deben optimizar costos (Batch API = 50% descuento), garantizar respuestas estructuradas (Structured Outputs) y diseñar fallback chains resilientes.',
  learningOutcomes: [
    { text: 'Dominar OpenAI tool calling: tools parameter, parallel tool execution, tool choice forcing' },
    { text: 'Usar Structured Outputs (JSON mode) para respuestas 100% confiables con Pydantic schemas' },
    { text: 'Gestionar costos con prompt caching (Anthropic) y Batch API (OpenAI) para procesamiento masivo' },
    { text: 'Implementar fallback chains: GPT-4o → GPT-4o-mini → respuesta por defecto' },
    { text: 'Usar Anthropic Claude para document processing: PDFs largos, análisis de contratos' },
    { text: 'Integrar Google Gemini para processing multimodal a gran escala' },
    { text: 'Construir un router inteligente que elige el modelo correcto según el tipo de tarea' },
  ],
  theory: [
    {
      heading: 'Tool use y function calling con OpenAI API: el modelo decide qué herramienta usar',
      paragraphs: [
        'Function calling con OpenAI API permite al LLM decidir qué función Python ejecutar basado en el contexto del usuario. Defines las funciones con schema JSON (nombre, descripción, parámetros), y el LLM responde con `tool_calls` indicando qué función llamar con qué argumentos. Por ejemplo, si el usuario pregunta "¿cuánto gastó el usuario 123 el mes pasado?", el LLM puede llamar `query_database(user_id=123, period="last_month")`. Tu código ejecuta la función, retorna el resultado al LLM, y el LLM genera una respuesta natural. Esto convierte al LLM en un orquestador inteligente que puede interactuar con bases de datos, APIs externas, y herramientas internas.',
        'Structured Outputs (agosto 2024) garantiza que el LLM devuelva JSON válido que parsea exactamente a tu modelo pydantic. Antes, usabas `response_format={"type": "json_object"}` que garantizaba JSON válido pero no el schema. Ahora, con `client.beta.chat.completions.parse(response_format=MyPydanticModel)`, el LLM respeta los tipos, campos requeridos, y validaciones de pydantic. Esto elimina el problema #1 de trabajar con LLMs en producción: parsear respuestas no estructuradas. Si el LLM no puede cumplir el schema, lanza `OutputParserException` en vez de devolver JSON roto.',
        'La Batch API de OpenAI procesa hasta 24h asíncrono con 50% de descuento vs synchronous API. Ideal para workloads no urgentes: clasificar 10,000 reviews de productos, extraer entidades de 50,000 documentos, o generar embeddings para 100,000 productos. Subes un archivo .jsonl donde cada línea es un request independiente. OpenAI procesa todo en paralelo internamente y te notifica cuando está listo. El resultado es otro .jsonl con las respuestas. Para un workload de 10K clasificaciones que costaría $200 síncrono, Batch cuesta $100 y completa en 2-4 horas.',
      ],
    },
  ],
  iDo: {
    intro: 'Te muestro paso a paso cómo aplicar los conceptos de esta sección con ejemplos prácticos.',
    steps: [
      {
        description: 'Implementar function calling con OpenAI API para usar herramientas',
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
        instruction: 'Implementa un chatbot con function calling que consulta SQL',
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
    title: 'AI-Powered B2B Integration',
    context: 'Sistema que procesa contratos en PDF (carga masiva), extrae información estructurada con OpenAI Structured Outputs, valida con Pydantic, y sube a PostgreSQL — usando Batch API para 10,000+ documentos con costo optimizado.',
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
        question: '¿Qué es function calling en OpenAI API?',
        options: [
          'El LLM decide qué función Python ejecutar basado en el contexto — define tools con schema JSON y el modelo responde con tool_calls',
          'Un sistema para llamar funciones por teléfono',
          'Un compilador de funciones Python',
          'Un sistema de tipos para Python',
        ],
        correctIndex: 0,
        explanation: 'Function calling: defines funciones con su schema (nombre, descripción, parámetros). El LLM decide cuándo llamarlas. Ej: usuario pregunta "¿cuánto gastó el user 123?" → LLM llama query_database(user_id=123).',
      },
      {
        question: '¿Qué son los structured outputs con pydantic?',
        options: [
          'Garantizan que el LLM devuelva JSON que parsea exactamente a tu modelo pydantic — elimina el problema de respuestas no estructuradas',
          'Una forma de estructurar código Python',
          'Un sistema de tipos estáticos',
          'Un formato de exportación de datos',
        ],
        correctIndex: 0,
        explanation: 'Con response_format=MyPydanticModel, el LLM respeta tipos, campos requeridos y validaciones de pydantic. Si no puede cumplir el schema, lanza excepción en vez de devolver JSON roto.',
      },
      {
        question: '¿Qué ventaja ofrece la Batch API de OpenAI?',
        options: [
          'Procesa hasta 24h asíncrono con 50% de descuento vs synchronous — ideal para workloads no urgentes como clasificar 10K reviews',
          'Es más rápida que la API síncrona',
          'Permite enviar archivos más grandes',
          'No tiene ventaja, es igual',
        ],
        correctIndex: 0,
        explanation: 'Batch API: subes .jsonl, OpenAI procesa en 2-4h, 50% descuento. Para 10K clasificaciones que costarían $200 síncrono, Batch cuesta $100. Ideal para workloads que no necesitan respuesta inmediata.',
      },
      {
        question: '¿Qué es streaming en LLM APIs?',
        options: [
          'Server-Sent Events que permiten ver la respuesta del LLM token por token en tiempo real — mejor UX porque el usuario ve progreso',
          'Un sistema de streaming de video',
          'Un protocolo de transferencia de archivos',
          'Un tipo de compresión',
        ],
        correctIndex: 0,
        explanation: 'Streaming (SSE): el LLM envía tokens conforme los genera, en vez de esperar a tener la respuesta completa. El usuario ve "Escribiendo..." y luego el texto aparece gradualmente. Mejora perceived latency de 5s a 200ms.',
      },
      {
        question: '¿Cómo gestionas el contexto en conversaciones multi-turn?',
        options: [
          'Mantienes un historial de mensajes que se envía en cada request — cuando excede el límite de tokens, se trunca o resume con un LLM',
          'No se puede, cada request es independiente',
          'Se guarda en una base de datos vectorial',
          'Se comprime con gzip',
        ],
        correctIndex: 0,
        explanation: 'Cada request incluye el historial completo de la conversación. Cuando excede el contexto (ej: 128K tokens), estrategias: truncar mensajes viejos, resumir con un LLM, o usar retrieval para buscar mensajes relevantes. El costo aumenta con cada turno.',
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
