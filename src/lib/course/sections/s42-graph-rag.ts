import type { CourseSection } from '../../types'

export const section42: CourseSection = {
  id: 'graph-rag',
  index: 42,
  title: 'Graph RAG y Knowledge Graphs',
  shortTitle: 'Graph RAG y Knowledge Graphs',
  tagline: 'Cuando el texto no es suficiente — las relaciones entre entidades son la inteligencia real.',
  estimatedHours: 12,
  level: 'Master',
  phase: 3,
  icon: 'Share2',
  accentColor: 'bg-gradient-to-br from-amber-500 to-red-600',
  jobRelevance: 'GraphRAG es la frontera actual (2025-2026) en retrieval inteligente para dominios con relaciones complejas: fraud detection, recommendation, drug discovery, compliance. Master AI Engineer roles en banca y pharma valoran este skill diferenciador ($180K-$220K).',
  learningOutcomes: [
    { text: 'Construir Knowledge Graphs con Neo4j desde datos no estructurados con LLMs' },
    { text: 'Implementar GraphRAG: combinar graph traversal con LLM reasoning para respuestas más precisas' },
    { text: 'Usar py2neo y Cypher para queries de graph complejos' },
    { text: 'Aplicar entity resolution (S22) para poblar el knowledge graph sin duplicados' },
    { text: 'Entender Graph Embeddings para semantic search sobre graphs' },
    { text: 'Casos de uso: fraud detection, recommendation systems, drug discovery patterns' },
  ],
  theory: [
    {
      heading: 'Graph RAG: combinando knowledge graphs con retrieval-augmented generation',
      paragraphs: [
        'GraphRAG combina knowledge graphs (Neo4j) con retrieval-augmented generation para dar respuestas más precisas que el RAG vector-only tradicional. En RAG vector-only, recuperas documentos similares al query por similitud coseno. En GraphRAG, también navegas las relaciones entre entidades: si el usuario pregunta "¿quiénes son los colegas de Ana?", el vector search encuentra documentos sobre Ana, pero el graph traversal encuentra explícitamente las relaciones "trabaja_con" conectadas a Ana. Esto es especialmente poderoso para preguntas multi-hop: "¿qué proyectos comparten los colegas de Ana?" — vector-only no puede responder esto porque requiere joins entre entidades.',
        'Neo4j es la base de datos de grafos más usada. Usa Cypher como query language: `MATCH (a:Person {name: "Ana"})-[:WORKS_WITH]->(b:Person) RETURN b.name`. En Python, la librería `neo4j` oficial conecta al driver. Para construir el knowledge graph, usas LLMs para extraer entidades (persona, empresa, proyecto) y relaciones (trabaja_con, pertenece_a) de documentos no estructurados. OpenAI structured outputs con pydantic garantiza que el LLM devuelva entidades y relaciones en formato válido. Luego, cargas estos en Neo4j con Cypher CREATE.',
        'El hybrid retrieval combina vector search (pgvector o Pinecone) con graph traversal (Neo4j). Primero, vector search encuentra los top-K documentos relevantes al query. Luego, graph traversal expande desde las entidades mencionadas en esos documentos, encontrando relaciones que el vector search no captura. Finalmente, combinas ambos contextos y los envías al LLM. En benchmarks RAGAS, GraphRAG reduce hallucination rate 40-60% vs vector-only RAG, especialmente en preguntas multi-hop y de razonamiento relacional.',
      ],
    },
  ],
  iDo: {
    intro: 'Te muestro paso a paso cómo aplicar los conceptos de esta sección con ejemplos prácticos.',
    steps: [
      {
        description: 'Construir un knowledge graph en Neo4j desde documentos con LLM',
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
        instruction: 'Implementa entity extraction con OpenAI structured outputs y carga en Neo4j',
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
    title: 'Knowledge Graph + GraphRAG',
    context: 'Knowledge graph de entidades de un dominio (ej: empresas peruanas, ejecutivos, relaciones societarias) construido con LLM extraction + GraphRAG para consultas complejas que requieren razonamiento relacional.',
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
        question: '¿Qué es GraphRAG y cómo mejora sobre RAG vectorial tradicional?',
        options: [
          'Combina knowledge graphs (Neo4j) con retrieval vectorial — navega relaciones entre entidades para responder preguntas multi-hop que el RAG vectorial no puede',
          'GraphRAG es RAG pero más rápido',
          'GraphRAG usa grafos en vez de vectores exclusivamente',
          'GraphRAG es un modelo de lenguaje',
        ],
        correctIndex: 0,
        explanation: 'GraphRAG combina vector search (encuentra documentos similares) con graph traversal (navega relaciones explícitas). Para "¿quiénes son los colegas de Ana?", el vector search encuentra docs sobre Ana, pero el graph traversal encuentra las relaciones "trabaja_con" conectadas a Ana.',
      },
      {
        question: '¿Qué es Neo4j y qué lenguaje de query usa?',
        options: [
          'Base de datos de grafos que usa Cypher: MATCH (a:Person)-[:WORKS_WITH]->(b) RETURN b.name — almacena nodos y relaciones en vez de tablas',
          'Una base de datos SQL',
          'Un framework de visualización',
          'Un sistema de colas',
        ],
        correctIndex: 0,
        explanation: 'Neo4j es la base de datos de grafos más usada. Cypher es su lenguaje: MATCH (n:Person {name:"Ana"})-[:KNOWS]->(friend) RETURN friend. Los nodos tienen labels y propiedades; las relaciones tienen tipo y dirección. Python se conecta con la librería neo4j oficial.',
      },
      {
        question: '¿Qué es entity extraction con LLMs para construir knowledge graphs?',
        options: [
          'Usar un LLM para identificar entidades (persona, empresa, proyecto) y relaciones en texto libre, luego cargarlas en Neo4j con Cypher CREATE',
          'Extraer entidades de un archivo ZIP',
          'Un algoritmo de clustering',
          'Un sistema de reconocimiento óptico',
        ],
        correctIndex: 0,
        explanation: 'El LLM recibe texto: "Ana trabaja en Interbank con Luis en el proyecto ChurnBot". Extrae: entidades (Ana:Person, Interbank:Company, Luis:Person, ChurnBot:Project) y relaciones (Ana WORKS_AT Interbank, Ana WORKS_WITH Luis, Ana WORKS_ON ChurnBot). Se cargan con Cypher CREATE.',
      },
      {
        question: '¿Qué es hybrid retrieval en GraphRAG?',
        options: [
          'Combinar vector search (encontrar docs similares) + graph traversal (explorar relaciones) — da respuestas más precisas que cada método por separado',
          'Buscar en múltiples bases de datos simultáneamente',
          'Un algoritmo de búsqueda binaria',
          'Un sistema de cache',
        ],
        correctIndex: 0,
        explanation: 'Hybrid retrieval: (1) vector search encuentra los top-K documentos relevantes al query, (2) graph traversal expande desde las entidades en esos documentos encontrando relaciones, (3) se combina el contexto y se envía al LLM. Reduce hallucinations 40-60% vs vector-only.',
      },
      {
        question: '¿Cómo evalúas la calidad de un sistema RAG?',
        options: [
          'Con RAGAS: mide faithfulness (¿la respuesta está fundamentada en el contexto?), answer relevancy (¿responde la pregunta?), context precision/recall',
          'Solo con accuracy',
          'Solo con latencia',
          'No se puede evaluar un RAG',
        ],
        correctIndex: 0,
        explanation: 'RAGAS evalúa 4 dimensiones: faithfulness (no alucinación), answer relevancy (responde la pregunta), context precision (el contexto recuperado es relevante), context recall (el contexto recuperado es completo). Usa un LLM como juez. Se corre después de cada cambio de prompt o modelo.',
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
