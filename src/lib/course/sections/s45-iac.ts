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
        'Terraform es el estándar de facto para Infraestructura como Código (IaC). Define recursos cloud en archivos .tf (declarativos), y Terraform se encarga de crear/modificar/eliminar los recursos para que el estado real coincida con el declarado. Para plataformas de IA, los recursos típicos son: instancias GPU (para entrenamiento), clusters Kubernetes (para serving), buckets S3/GCS (para datos y modelos), y bases de datos (para feature stores). La ventaja principal: reproducibilidad. Un `terraform apply` levanta toda la infra desde cero en minutos, y `terraform destroy` la elimina sin dejar recursos huérfanos que cobran.',
        'ArgoCD implementa GitOps: el estado deseado del cluster Kubernetes vive en un repo Git, y ArgoCD sincroniza continuamente el cluster con el repo. Cada git push a la rama main despliega automáticamente. La ventaja: el repo Git es la única fuente de verdad — no hay `kubectl apply` manual que pueda desincronizar el cluster. Si alguien hace un cambio manual en el cluster, ArgoCD lo revierte en el próximo sync. Para rollback, simplemente haces `git revert` y ArgoCD despliega la versión anterior automáticamente. Esto es lo que usan empresas como Intuit, BlackRock, y Tesla.',
        'FinOps es la práctica de optimizar costos cloud continuamente. Para IA, el costo #1 son las GPUs: una instancia NVIDIA T4 cuesta $0.90/hora en AWS, una A100 cuesta $3.00/hora. Para training, usa spot instances (60-70% de descuento) con checkpointing — si la instancia se interrumpe, reanudas desde el último checkpoint. Para inference, configura auto-scaling con KEDA: escala a 0 pods cuando no hay tráfico (ahorra 80% en workloads con tráfico variable). Usa Kubecost para visualizar costos por namespace, deployment, y pod. Sin FinOps, una plataforma de IA puede costar 3-5x más de lo necesario.',
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
