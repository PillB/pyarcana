import type { CourseSection } from '../../types'

export const section45: CourseSection = {
  id: 'iac',
  index: 45,
  title: 'Infraestructura como Código para AI Platforms',
  shortTitle: 'Infraestructura como Código pa',
  tagline: 'Tu infraestructura debería vivir en Git, no en tu cabeza.',
  estimatedHours: 12,
  level: 'Master',
  phase: 3,
  icon: 'Cloud',
  accentColor: 'bg-gradient-to-br from-amber-500 to-red-600',
  jobRelevance: 'IaC (Terraform + ArgoCD + Helm) es obligatorio para roles Staff/Principal AI Engineer ($180K-$250K) en enterprises que operan en AWS/GCP. Permite reproducibilidad, audit trail y rollback rápido. Es el skill que separa \'deploya scripts\' de \'opera plataformas\'.',
  learningOutcomes: [
    { text: 'Gestionar infraestructura AWS/GCP con Terraform: VPCs, EKS, RDS, S3' },
    { text: 'Desplegar stacks ML completos con Terraform modules reutilizables' },
    { text: 'Usar Helm charts para aplicaciones Kubernetes complejas' },
    { text: 'Implementar GitOps con ArgoCD: el cluster se sincroniza automáticamente con Git' },
    { text: 'Automatizar provisioning con Ansible para configuración de servidores' },
    { text: 'Gestionar costos con AWS Cost Explorer integrado en pipelines CI/CD' },
  ],
  theory: [
    {
      heading: 'Infraestructura como Código (IaC): Terraform para plataformas de IA',
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
        description: 'Crear un módulo Terraform que provisione un cluster K8s con GPU',
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
        instruction: 'Escribe un módulo Terraform que cree una instancia GPU',
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
    title: 'Production IaC Deploy',
    context: 'Todo el stack de la Fase 2 desplegado en AWS/GCP con Terraform, GitOps con ArgoCD, y monitoreo de costos automático.',
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
        question: '¿Cuál de los siguientes describe mejor: Gestionar infraestructura AWS/GCP con Terraform: VPCs, EKS, RDS, S3?',
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
        question: '¿Cuál de los siguientes describe mejor: Desplegar stacks ML completos con Terraform modules reutilizables?',
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
        question: '¿Cuál de los siguientes describe mejor: Usar Helm charts para aplicaciones Kubernetes complejas?',
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
        question: '¿Cuál de los siguientes describe mejor: Implementar GitOps con ArgoCD: el cluster se sincroniza automáticamente con Git?',
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
        question: '¿Cuál de los siguientes describe mejor: Automatizar provisioning con Ansible para configuración de servidores?',
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
