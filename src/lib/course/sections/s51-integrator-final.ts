import type { CourseSection } from '../../types'

export const section51: CourseSection = {
  id: 'integrator-final',
  index: 51,
  title: 'Proyecto Integrador Final — Sistema AI Production-Grade',
  shortTitle: 'Proyecto Integrador Final — Si',
  tagline: 'Tu obra maestra. El sistema que defines en LinkedIn como tu proyecto más grande.',
  estimatedHours: 20,
  level: 'Master',
  phase: 3,
  icon: 'Crown',
  accentColor: 'bg-gradient-to-br from-amber-500 to-red-600',
  jobRelevance: 'Capstone Final del roadmap. Demuestra capacidad Master end-to-end para diseñar, construir, desplegar y operar sistemas AI production-grade. Es el proyecto principal del portafolio que se presenta a FAANG y startups top. Define la transición de Senior a Staff/Principal.',
  learningOutcomes: [
    { text: 'Integrar multi-agent LangGraph con ≥ 5 agentes especializados (S40)' },
    { text: 'Servir modelo fine-tuned (S41) como componente del sistema' },
    { text: 'Operar RAG pipeline evaluado con RAGAS ≥ 0.75 (S20)' },
    { text: 'Integrar sistema CV en tiempo real (S34)' },
    { text: 'Operar pipeline de datos con Prefect + dbt (S29, S37)' },
    { text: 'Desplegar en Kubernetes con CI/CD completo (S32)' },
    { text: 'Implementar observabilidad completa: LangSmith + Grafana (S43)' },
    { text: 'Documentar governance framework (S48)' },
  ],
  theory: [
    {
      heading: 'Arquitectura del proyecto integrador Master',
      paragraphs: [
        'Esta sección cubre los conceptos esenciales del tema. Estudia cada bloque de teoría con atención y no pases al siguiente sin entender completamente el anterior.',
        'La práctica es clave. Usa el editor interactivo para experimentar con cada concepto antes de pasar a los ejercicios.',
      ],
    },
  ],
  iDo: {
    intro: 'Te muestro paso a paso cómo aplicar los conceptos de esta sección con ejemplos prácticos.',
    steps: [
      {
        description: 'Diseñar la arquitectura de una plataforma agéntica completa',
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
        instruction: 'Implementa el agente principal con LangGraph que orquesta 3 sub-agentes',
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
    title: 'AI Platform Master',
    context: 'ai-master-platform — sistema de IA de clase empresarial que demuestra todas las competencias del roadmap. Requisitos mínimos: (1) Multi-agent LangGraph con ≥ 5 agentes especializados (S40); (2) Modelo fine-tuned (S41) sirviendo un componente del sistema; (3) RAG pipeline evaluado con RAGAS ≥ 0.75 (S20); (4) Sistema CV en tiempo real integrado (S34); (5) Pipeline de datos con Prefect + dbt (S29, S37); (6) Desplegado en Kubernetes con CI/CD completo (S32); (7) Observabilidad completa: LangSmith + Grafana (S43); (8) Governance framework documentado (S48). Entregables de portafolio: repositorio GitHub con README de 3,000+ palabras; sistema desplegado públicamente (URL accesible); demo video de 10 minutos; technical blog post en Medium/Substack; presentación de 15 slides para stakeholders de negocio.',
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
        question: '¿Cuál de los siguientes describe mejor: Integrar multi-agent LangGraph con ≥ 5 agentes especializados (S40)?',
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
        question: '¿Cuál de los siguientes describe mejor: Servir modelo fine-tuned (S41) como componente del sistema?',
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
        question: '¿Cuál de los siguientes describe mejor: Operar RAG pipeline evaluado con RAGAS ≥ 0.75 (S20)?',
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
        question: '¿Cuál de los siguientes describe mejor: Integrar sistema CV en tiempo real (S34)?',
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
        question: '¿Cuál de los siguientes describe mejor: Operar pipeline de datos con Prefect + dbt (S29, S37)?',
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
