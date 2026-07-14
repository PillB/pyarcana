import type { CourseSection } from '../../types'

export const section39: CourseSection = {
  id: 'integrator-phase2',
  index: 39,
  title: 'Proyecto Integrador Fase 2',
  shortTitle: 'Proyecto Integrador Fase 2',
  tagline: 'Un sistema de IA Senior que cualquier startup querría contratar para construir.',
  estimatedHours: 18,
  level: 'Senior',
  phase: 2,
  icon: 'Trophy',
  accentColor: 'bg-gradient-to-br from-purple-500 to-fuchsia-600',
  jobRelevance: 'Capstone Senior que demuestra capacidad de diseñar y operar sistemas AI end-to-end a nivel Senior. Diferenciador claro para roles Senior AI Engineer ($130K-$180K). Es el proyecto que se presenta como caso de estudio principal en entrevistas de sistema.',
  learningOutcomes: [
    { text: 'Integrar multi-agent LangGraph (S28) coordinando tareas automáticamente' },
    { text: 'Construir MLOps pipeline (S29) con monitoreo de drift y retraining automático' },
    { text: 'Desplegar en Kubernetes (S32) con CI/CD y observabilidad' },
    { text: 'Implementar streaming Kafka (S31) para eventos en tiempo real' },
    { text: 'Integrar Smart CV module (S34) con análisis LLM de imágenes' },
    { text: 'Documentar ADR (S35) para las principales decisiones arquitecturales' },
    { text: 'Desplegar sistema completamente en la nube (GCP/AWS free tier)' },
    { text: 'Comunicar arquitectura a stakeholders de negocio con presentation deck de 10 slides' },
  ],
  theory: [
    {
      heading: 'Arquitectura del proyecto integrador Senior',
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
        description: 'Diseñar la arquitectura del sistema integrador con diagrama',
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
        instruction: 'Implementa el componente de ingesta de datos con Kafka producer',
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
    title: 'End-to-End AI Platform Senior',
    context: 'ai-platform-senior — evolución del proyecto integrador de Fase 1 con capacidades senior. Componentes adicionales: Multi-agent LangGraph (S28) coordinando tareas automáticamente; MLOps pipeline (S29) con monitoreo de drift y retraining automático; Kubernetes deployment (S32) con CI/CD y observabilidad; Streaming Kafka (S31) para eventos en tiempo real; Smart CV module (S34) con análisis LLM de imágenes; ADR documentado (S35) para las principales decisiones arquitecturales. Entregables: sistema completamente deployado en la nube (GCP/AWS free tier); architecture diagram con Mermaid; presentation deck de 10 slides explicando el sistema a un stakeholder de negocio.',
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
        question: '¿Cuál de los siguientes describe mejor: Integrar multi-agent LangGraph (S28) coordinando tareas automáticamente?',
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
        question: '¿Cuál de los siguientes describe mejor: Construir MLOps pipeline (S29) con monitoreo de drift y retraining automático?',
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
        question: '¿Cuál de los siguientes describe mejor: Desplegar en Kubernetes (S32) con CI/CD y observabilidad?',
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
        question: '¿Cuál de los siguientes describe mejor: Implementar streaming Kafka (S31) para eventos en tiempo real?',
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
        question: '¿Cuál de los siguientes describe mejor: Integrar Smart CV module (S34) con análisis LLM de imágenes?',
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
