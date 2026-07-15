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
        question: '¿Qué es Terraform y qué problema resuelve?',
        options: [
          'Define infraestructura cloud como código declarativo (.tf) — reproducible, versionable, auditable. terraform apply levanta todo, terraform destroy elimina sin recursos huérfanos',
          'Un ORM para bases de datos',
          'Un framework de testing',
          'Un sistema de mensajería',
        ],
        correctIndex: 0,
        explanation: 'Terraform declara recursos (instancias, DBs, K8s) en .tf. terraform apply crea/modifica/elimina para que el estado real coincida con el declarado. Reproducible: mismo .tf = misma infra. Versionable: git track de cambios. Sin Terraform, crear infra manualmente es lento y propenso a errores.',
      },
      {
        question: '¿Qué es GitOps con ArgoCD?',
        options: [
          'El estado deseado del cluster K8s vive en un repo Git — ArgoCD sincroniza continuamente, cada git push despliega automáticamente',
          'Un sistema de control de versiones como Git',
          'Un tipo de contenedor Docker',
          'Un framework de CI/CD',
        ],
        correctIndex: 0,
        explanation: 'ArgoCD sincroniza el cluster con un repo Git. Cada push a main despliega automáticamente. Si alguien hace un cambio manual en el cluster, ArgoCD lo revierte. Para rollback, git revert. El repo Git es la única fuente de verdad.',
      },
      {
        question: '¿Qué son las spot instances y por qué ahorran dinero?',
        options: [
          'Capacidad excedente de la nube a 60-70% de descuento — pueden ser interrumpidas por el cloud provider con 2 min de aviso, ideales para entrenamiento con checkpointing',
          'Son instancias más pequeñas',
          'Son instancias gratuitas',
          'Son instancias solo para testing',
        ],
        correctIndex: 0,
        explanation: 'Spot instances usan capacidad no usada del cloud provider. AWS/GCP las puede reclamar con 2 min de aviso. Para entrenamiento de ML: guardas checkpoint cada 10 min, si te interrumpen, reanudas desde el último. Ahorro: 60-70% vs on-demand. Para inference con tráfico variable, KEDA escala a 0.',
      },
      {
        question: '¿Qué es FinOps y por qué importa para plataformas de IA?',
        options: [
          'Práctica de optimizar costos cloud continuamente — para IA, el costo #1 son GPUs ($0.90-$3.00/hora). Sin FinOps, una plataforma puede costar 3-5x más de lo necesario',
          'Un sistema de finanzas personales',
          'Un tipo de contenedor',
          'Un framework de inversión',
        ],
        correctIndex: 0,
        explanation: 'FinOps para IA: (1) usar spot instances para entrenamiento (60-70% descuento), (2) auto-scaling con KEDA (scale to 0 cuando no hay tráfico), (3) Kubecost para visualizar costos por namespace/deployment. Sin FinOps, GPUs corriendo 24/7 sin tráfico = $2K/mes desperdiciado.',
      },
      {
        question: '¿Qué hace `terraform destroy`?',
        options: [
          'Elimina toda la infraestructura definida en los .tf files — útil para cleanup, testing, y evitar recursos huérfanos que cobran',
          'Destruye el código fuente',
          'Borra la base de datos permanentemente',
          'Elimina la cuenta de cloud',
        ],
        correctIndex: 0,
        explanation: 'terraform destroy elimina TODOS los recursos que terraform creó. Útil para: destruir environments de testing, evitar costos de recursos olvidados, y resetear infra. Precaución: borra TODO, incluyendo datos. Siempre verifica con terraform plan antes de destroy.',
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
