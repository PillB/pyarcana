import type { CourseSection } from '../../types'

export const section32: CourseSection = {
  id: 'microservices',
  index: 32,
  title: 'Microservicios Python + Docker + Kubernetes',
  shortTitle: 'Microservicios Python + Docker',
  tagline: 'De monolito a microservicios — la arquitectura que usan Netflix y Uber.',
  estimatedHours: 14,
  level: 'Senior',
  phase: 2,
  icon: 'Container',
  accentColor: 'bg-gradient-to-br from-purple-500 to-fuchsia-600',
  jobRelevance: 'Docker y Kubernetes son skills esenciales para Senior AI/Backend Engineers ($130K-$180K). Las empresas esperan que los Senior desplieguen, escaleen y operen sus propios sistemas. Conecta con S21 (FastAPI) y S32/S37 para el deployment del stack completo.',
  learningOutcomes: [
    { text: 'Containerizar aplicaciones Python con Docker multi-stage builds' },
    { text: 'Orquestar con Docker Compose para desarrollo y testing' },
    { text: 'Desplegar en Kubernetes: Deployments, Services, ConfigMaps, Secrets, Ingress' },
    { text: 'Implementar health checks, liveness/readiness probes en FastAPI' },
    { text: 'CI/CD con GitHub Actions: build → test → push to registry → deploy to K8s' },
    { text: 'Observabilidad: métricas con Prometheus + Grafana, trazas con OpenTelemetry' },
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
    title: 'Despliegue Multi-servicio',
    context: 'Los microservicios de Fases 1-2 (FastAPI API, RAG service, CV service) en Kubernetes con CI/CD automatizado y observabilidad completa.',
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
        question: '¿Cuál de los siguientes describe mejor: Containerizar aplicaciones Python con Docker multi-stage builds?',
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
        question: '¿Cuál de los siguientes describe mejor: Orquestar con Docker Compose para desarrollo y testing?',
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
        question: '¿Cuál de los siguientes describe mejor: Desplegar en Kubernetes: Deployments, Services, ConfigMaps, Secrets, Ingress?',
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
        question: '¿Cuál de los siguientes describe mejor: Implementar health checks, liveness/readiness probes en FastAPI?',
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
        question: '¿Cuál de los siguientes describe mejor: CI/CD con GitHub Actions: build → test → push to registry → deploy to K8s?',
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
