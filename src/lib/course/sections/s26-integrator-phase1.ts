import type { CourseSection } from '../../types'

export const section26: CourseSection = {
  id: 'integrator-phase1',
  index: 26,
  title: 'Proyecto Integrador Fase 1',
  shortTitle: 'Proyecto Integrador Fase 1',
  tagline: 'Integra todo lo aprendido en un sistema real que podrías vender.',
  estimatedHours: 16,
  level: 'Competente',
  phase: 1,
  icon: 'Award',
  accentColor: 'bg-gradient-to-br from-blue-500 to-indigo-600',
  jobRelevance: 'Capstone de Fase 1 que integra todas las competencias Competente en una sola plataforma vendible. Demuestra capacidad de diseñar sistemas end-to-end combinando backend, RAG, data pipelines, CV, entity resolution, RPA y dashboards. Diferenciador clave para entrevistas de mid-level.',
  learningOutcomes: [
    { text: 'Integrar backend FastAPI (S21), RAG chatbot (S20), pipeline de datos (S18-19), CV module (S23), entity resolution (S22), RPA bot (S24) y dashboard Streamlit (S25) en una plataforma coherente' },
    { text: 'Diseñar arquitectura de microservicios integrada con Docker Compose' },
    { text: 'Documentar arquitectura con Mermaid diagrams' },
    { text: 'Crear tests de integración para cada módulo del sistema' },
    { text: 'Producir demo video ejecutivo de 3-5 minutos' },
    { text: 'Reunir todos los componentes en un repositorio GitHub profesional' },
  ],
  theory: [
    {
      heading: 'Fundamentos',
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
        description: 'Demostración del concepto principal',
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
        instruction: 'Practica el concepto principal de esta sección',
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
    title: 'AI-Powered Automation Platform',
    context: 'ai-automation-platform — plataforma que integra todas las habilidades de Fase 1. Componentes: (1) Backend FastAPI (S21) API REST + WebSocket para datos en tiempo real; (2) RAG Chatbot (S20) con conocimiento del negocio sobre documentación; (3) Pipeline de Datos (S18-19) Prefect orquestando ingesta + transformación + almacenamiento; (4) CV Module (S23) endpoint de análisis de imágenes con YOLO; (5) Entity Resolution (S22) endpoint para deduplicar registros de clientes con RapidFuzz; (6) RPA Bot (S24) que automáticamente recolecta datos nuevos diariamente; (7) Dashboard (S25) Streamlit frontend que visualiza todo. Entregables: repositorio GitHub con README arquitectural (Mermaid diagram), Docker Compose con todos los servicios, tests de integración para cada módulo, demo video de 3-5 minutos mostrando el sistema en acción.',
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
        question: '¿Cuál de los siguientes describe mejor: Integrar backend FastAPI (S21), RAG chatbot (S20), pipeline de datos (S18-19), CV module (S23), entity resolution (S22), RPA bot (S24) y dashboard Streamlit (S2',
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
        question: '¿Cuál de los siguientes describe mejor: Diseñar arquitectura de microservicios integrada con Docker Compose?',
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
        question: '¿Cuál de los siguientes describe mejor: Documentar arquitectura con Mermaid diagrams?',
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
        question: '¿Cuál de los siguientes describe mejor: Crear tests de integración para cada módulo del sistema?',
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
        question: '¿Cuál de los siguientes describe mejor: Producir demo video ejecutivo de 3-5 minutos?',
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
