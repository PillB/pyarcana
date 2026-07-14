import type { CourseSection } from '../../types'

export const section20: CourseSection = {
  id: 'rag',
  index: 20,
  title: 'RAG — Retrieval-Augmented Generation en Producción',
  shortTitle: 'RAG — Retrieval-Augmented Gene',
  tagline: 'Construye chatbots que saben de tu negocio — no alucinan, no inventan, sí citan.',
  estimatedHours: 14,
  level: 'Competente',
  phase: 1,
  icon: 'MessageSquare',
  accentColor: 'bg-gradient-to-br from-blue-500 to-indigo-600',
  jobRelevance: 'RAG es el skill #1 más solicitado en roles de AI Engineer en USA 2025-2026. Las empresas pagan $130K-$180K para ingenieros que pueden construir sistemas RAG de producción evaluados y monitoreados. Construye el pipeline completo con evaluación RAGAS, el estándar industrial.',
  learningOutcomes: [
    { text: 'Entender la arquitectura RAG completa: indexing → retrieval → augmentation → generation' },
    { text: 'Implementar chunking strategies: fixed-size, recursive character, semantic chunking' },
    { text: 'Usar embeddings de sentence-transformers (multilingual para español/inglés) y OpenAI text-embedding-3-small' },
    { text: 'Almacenar vectores en Qdrant para retrieval eficiente' },
    { text: 'Implementar re-ranking con cross-encoders (BAAI/bge-reranker) para precisión superior' },
    { text: 'Evaluar calidad del RAG con RAGAS: faithfulness, answer relevancy, context precision, context recall' },
    { text: 'Aplicar query expansion e HyDE (Hypothetical Document Embedding)' },
    { text: 'Proteger el pipeline contra vectorial injection (OWASP LLM #8 — Vector/Embedding Weaknesses)' },
  ],
  theory: [
    {
      heading: 'RAG architecture: naive RAG (simple) → advanced RAG (re-ranking, query expansion) → modular RAG (composable) — cuándo usar cada nivel',
      paragraphs: [
        'En esta lección vamos a explorar rag architecture: naive rag (simple) → advanced rag (re-ranking, query expansion) → modular rag (composable) — cuándo usar cada nivel en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender rag architecture: naive rag (simple) → advanced rag (re-ranking, query expansion) → modular rag (composable) — cuándo usar cada nivel es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, rag architecture: naive rag (simple) → advanced rag (re-ranking, query expansion) → modular rag (composable) — cuándo usar cada nivel se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Chunking strategies: RecursiveCharacterTextSplitter(chunk_size=512, chunk_overlap=50), parent-child chunking, semantic chunking con embeddings',
      paragraphs: [
        'En esta lección vamos a explorar chunking strategies: recursivecharactertextsplitter(chunk_size=512, chunk_overlap=50), parent-child chunking, semantic chunking con embeddings en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender chunking strategies: recursivecharactertextsplitter(chunk_size=512, chunk_overlap=50), parent-child chunking, semantic chunking con embeddings es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, chunking strategies: recursivecharactertextsplitter(chunk_size=512, chunk_overlap=50), parent-child chunking, semantic chunking con embeddings se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Embeddings para español: paraphrase-multilingual-MiniLM-L12-v2 (sentence-transformers), text-embedding-3-small (OpenAI) — comparación en datasets peruanos',
      paragraphs: [
        'En esta lección vamos a explorar embeddings para español: paraphrase-multilingual-minilm-l12-v2 (sentence-transformers), text-embedding-3-small (openai) — comparación en datasets peruanos en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender embeddings para español: paraphrase-multilingual-minilm-l12-v2 (sentence-transformers), text-embedding-3-small (openai) — comparación en datasets peruanos es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, embeddings para español: paraphrase-multilingual-minilm-l12-v2 (sentence-transformers), text-embedding-3-small (openai) — comparación en datasets peruanos se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Dense vs sparse retrieval: BM25 (palabras exactas) vs embeddings (semántico), hybrid search como combinación óptima',
      paragraphs: [
        'En esta lección vamos a explorar dense vs sparse retrieval: bm25 (palabras exactas) vs embeddings (semántico), hybrid search como combinación óptima en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender dense vs sparse retrieval: bm25 (palabras exactas) vs embeddings (semántico), hybrid search como combinación óptima es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, dense vs sparse retrieval: bm25 (palabras exactas) vs embeddings (semántico), hybrid search como combinación óptima se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Re-ranking con cross-encoders: BAAI/bge-reranker-v2-m3 como segundo paso — más lento pero más preciso que bi-encoders',
      paragraphs: [
        'En esta lección vamos a explorar re-ranking con cross-encoders: baai/bge-reranker-v2-m3 como segundo paso — más lento pero más preciso que bi-encoders en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender re-ranking con cross-encoders: baai/bge-reranker-v2-m3 como segundo paso — más lento pero más preciso que bi-encoders es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, re-ranking con cross-encoders: baai/bge-reranker-v2-m3 como segundo paso — más lento pero más preciso que bi-encoders se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'RAGAS metrics: faithfulness (¿la respuesta está soportada por los chunks?), answer relevancy (¿responde la pregunta?), context precision (¿los chunks son relevantes?), context recall (¿recuperó todos los chunks necesarios?)',
      paragraphs: [
        'En esta lección vamos a explorar ragas metrics: faithfulness (¿la respuesta está soportada por los chunks?), answer relevancy (¿responde la pregunta?), context precision (¿los chunks son relevantes?), context recall (¿recuperó todos los chunks necesarios?) en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender ragas metrics: faithfulness (¿la respuesta está soportada por los chunks?), answer relevancy (¿responde la pregunta?), context precision (¿los chunks son relevantes?), context recall (¿recuperó todos los chunks necesarios?) es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, ragas metrics: faithfulness (¿la respuesta está soportada por los chunks?), answer relevancy (¿responde la pregunta?), context precision (¿los chunks son relevantes?), context recall (¿recuperó todos los chunks necesarios?) se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'HyDE: generar un documento hipotético con el LLM y buscar embeddings similares — mejora recall en preguntas complejas',
      paragraphs: [
        'En esta lección vamos a explorar hyde: generar un documento hipotético con el llm y buscar embeddings similares — mejora recall en preguntas complejas en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender hyde: generar un documento hipotético con el llm y buscar embeddings similares — mejora recall en preguntas complejas es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, hyde: generar un documento hipotético con el llm y buscar embeddings similares — mejora recall en preguntas complejas se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'RAG poisoning: documentos maliciosos que manipulan respuestas — defensa con validación de fuentes y filtros de contenido',
      paragraphs: [
        'En esta lección vamos a explorar rag poisoning: documentos maliciosos que manipulan respuestas — defensa con validación de fuentes y filtros de contenido en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender rag poisoning: documentos maliciosos que manipulan respuestas — defensa con validación de fuentes y filtros de contenido es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, rag poisoning: documentos maliciosos que manipulan respuestas — defensa con validación de fuentes y filtros de contenido se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
  ],
  iDo: {
    intro: 'Te muestro paso a paso cómo aplicar los conceptos de esta sección con ejemplos prácticos.',
    steps: [
      {
        description: 'Indexar la documentación oficial de FastAPI: parse PDFs/HTML con pypdf, chunkar con LangChain text splitters, embeber con sentence-transformers, guardar en Qdrant',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Indexar la documentación oficial de FastAPI: parse PDFs/HTML con pypdf, chunkar con LangChain text splitters, embeber con sentence-transformers, guardar en Qdrant\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
      {
        description: 'Retriever básico: buscar top-5 chunks por cosine similarity y mostrar scores',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Retriever básico: buscar top-5 chunks por cosine similarity y mostrar scores\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
      {
        description: 'Chain completo: chunks recuperados → prompt aumentado → GPT-4o-mini → respuesta citada',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Chain completo: chunks recuperados → prompt aumentado → GPT-4o-mini → respuesta citada\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
    ],
  },
  weDo: {
    intro: 'Ahora te toca a ti practicar con guía. Lee cada instrucción, intenta escribir el código, y si te trabas revisa la solución.',
    steps: [
      {
        instruction: 'Agregar re-ranking con bge-reranker: re-ordenar top-20 → tomar top-3 → pasar al LLM',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Agregar re-ranking con bge-reranker: re-ordenar top-20 → tomar top-3 → pasar al LLM\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Agregar re-ranking con bge-reranker: re-ordenar top-20 → tomar top-3 → pasar al LLM\nprint("Solución implementada")',
        },
      },
      {
        instruction: 'Evaluar el pipeline con RAGAS en un test set de 20 preguntas con respuestas esperadas',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Evaluar el pipeline con RAGAS en un test set de 20 preguntas con respuestas esperadas\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Evaluar el pipeline con RAGAS en un test set de 20 preguntas con respuestas esperadas\nprint("Solución implementada")',
        },
      },
      {
        instruction: 'Implementar streaming de respuesta en FastAPI con async for token in stream',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Implementar streaming de respuesta en FastAPI con async for token in stream\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Implementar streaming de respuesta en FastAPI con async for token in stream\nprint("Solución implementada")',
        },
      },
    ],
  },
  youDo: {
    title: 'RAG Chatbot de Producción',
    context: 'rag-docs-chatbot sobre documentación técnica: pipeline completo (parse PDF/HTML → chunk → embed → store Qdrant → retrieve → rerank → generate); interfaz Streamlit con chat history, fuentes citadas (con número de chunk y score) en cada respuesta; evaluación RAGAS en test set ≥ 20 pares Q&A con faithfulness ≥ 0.7 y answer relevancy ≥ 0.7; logging estructurado (query, chunks recuperados, scores, tiempo respuesta, costo tokens); desplegado en Streamlit Community Cloud con URL pública.',
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
        question: '¿Cuál de los siguientes describe mejor: Entender la arquitectura RAG completa: indexing → retrieval → augmentation → generation?',
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
        question: '¿Cuál de los siguientes describe mejor: Implementar chunking strategies: fixed-size, recursive character, semantic chunking?',
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
        question: '¿Cuál de los siguientes describe mejor: Usar embeddings de sentence-transformers (multilingual para español/inglés) y OpenAI text-embedding-3-small?',
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
        question: '¿Cuál de los siguientes describe mejor: Almacenar vectores en Qdrant para retrieval eficiente?',
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
        question: '¿Cuál de los siguientes describe mejor: Implementar re-ranking con cross-encoders (BAAI/bge-reranker) para precisión superior?',
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
      { label: 'LangChain RAG — Python docs', url: 'LangChain RAG — Python docs' },
      { label: 'RAGAS framework', url: 'RAGAS framework' },
      { label: 'Qdrant quickstart', url: 'Qdrant quickstart' },
      { label: 'sentence-transformers multilingual', url: 'sentence-transformers multilingual' },
      { label: 'BAAI/bge-reranker-v2-m3', url: 'BAAI/bge-reranker-v2-m3' },
    ],
    books: [
      { label: 'Python 201 — Michael Driscoll', note: 'Capítulos relevantes para esta sección' },
    ],
    courses: [
      { label: 'Real Python', url: 'https://realpython.com', note: 'Tutoriales complementarios' },
    ],
  },
}
