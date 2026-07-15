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
      heading: 'Arquitectura de microservicios: principios, trade-offs y cuándo NO usarla',
      paragraphs: [
        'La arquitectura de microservicios divide una aplicación monolítica en servicios independientes que se comunican via APIs. Cada microservicio tiene su propia base de datos, su propio ciclo de deploy, y puede escalar independientemente. En Python, FastAPI es el framework preferido por su velocidad (Starlette + Pydantic) y documentación automática OpenAPI. El trade-off principal: complejidad operacional. Un monolito se depura en un solo proceso; 10 microservicios requieren distributed tracing (Jaeger/Zipkin), logging centralizado (ELK), y service mesh (Istio/Linkerd) para mTLS y circuit breakers.',
        'Docker es el estándar para empaquetar microservicios. Un Dockerfile multi-stage para Python separa el entorno de build (con gcc, headers, dev deps) del runtime (solo Python + app). La imagen final usa `python:3.12-slim` como base y puede ser < 100MB. El truco clave: copia `requirements.txt` primero y instala deps antes de copiar el código — esto aprovecha el layer caching de Docker y hace que los builds sean rápidos cuando solo cambias código, no dependencias. Usa `.dockerignore` para excluir `venv/`, `__pycache__/`, `.git/`.',
        'Kubernetes (K8s) orquesta contenedores a escala. Un Deployment define cuántas réplicas quieres (ej. 3) y K8s mantiene ese estado deseado. Si un pod muere, K8s lo reinicia automáticamente. Un Service expone el Deployment internamente (ClusterIP) o externamente (LoadBalancer). Un Ingress publica el servicio al exterior con TLS termination. Para Python, los health checks son críticos: `/health` (liveness — el pod está vivo) y `/ready` (readiness — el pod puede recibir tráfico). Sin readiness probe, K8s envía tráfico a un pod que aún no ha cargado el modelo de ML.',
      ],
    },
  ],
  iDo: {
    intro: 'Te muestro paso a paso cómo aplicar los conceptos de esta sección con ejemplos prácticos.',
    steps: [
      {
        description: 'Crear un Dockerfile multi-stage para FastAPI con imagen < 100MB',
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
        instruction: 'Escribe un Dockerfile multi-stage para un microservicio Python',
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
        question: '¿Qué es un Dockerfile multi-stage?',
        options: [
          'Usa múltiples etapas (FROM) para separar build de runtime — la imagen final solo incluye lo necesario, reduciendo 900MB a 150MB',
          'Un Dockerfile que construye múltiples imágenes',
          'Un Dockerfile que se ejecuta en múltiples servidores',
          'Un Dockerfile con múltiples entrypoints',
        ],
        correctIndex: 0,
        explanation: 'Multi-stage: Stage 1 (builder) tiene gcc y dev deps. Stage 2 (runtime) solo copia lo compilado a python:3.12-slim. Menos tamaño = menos superficie de ataque y menos costo.',
      },
      {
        question: '¿Qué es un Kubernetes Deployment vs Pod?',
        options: [
          'Deployment gestiona réplicas de Pods: mantiene N pods corriendo, reinicia caídos, maneja rolling updates — un Pod es una instancia individual',
          'Un Deployment es un tipo de Pod',
          'Un Deployment es un clúster',
          'Un Pod contiene múltiples Deployments',
        ],
        correctIndex: 0,
        explanation: 'Un Pod es la unidad mínima. Un Deployment dice "quiero 3 réplicas". Si un Pod muere, el Deployment crea uno nuevo. Para actualizar, hace rolling update gradual.',
      },
      {
        question: '¿Qué es un Service en Kubernetes?',
        options: [
          'Da un DNS estable y load balancing a un conjunto de Pods — los Pods tienen IPs cambiantes, el Service da una IP fija',
          'Un Service es un Pod especial',
          'Un Service es un volumen persistente',
          'Un Service es un usuario',
        ],
        correctIndex: 0,
        explanation: 'Los Pods tienen IPs efémeras. Un Service da un DNS estable que enruta tráfico a los Pods actuales via labels. Types: ClusterIP (interno), LoadBalancer (externo).',
      },
      {
        question: 'Rolling update vs blue-green deployment?',
        options: [
          'Rolling reemplaza pods gradualmente (1 a 1); blue-green mantiene dos entornos completos y cambia el tráfico de golpe',
          'Son sinónimos',
          'Rolling es más rápido; blue-green es más seguro',
          'Rolling es para Docker; blue-green para K8s',
        ],
        correctIndex: 0,
        explanation: 'Rolling: mata 1 pod viejo, crea 1 nuevo, repite. Zero downtime pero hay 2 versiones temporalmente. Blue-green: despliegas completo nuevo, cambias router. Rollback instantáneo en blue-green.',
      },
      {
        question: 'Liveness vs Readiness probe en Kubernetes?',
        options: [
          'Liveness: ¿está vivo? si falla, se reinicia. Readiness: ¿puede recibir tráfico? si falla, se saca del load balancer pero no se reinicia',
          'Liveness es HTTP; Readiness es TCP',
          'Solo hay un tipo',
          'Liveness es para DB; Readiness para API',
        ],
        correctIndex: 0,
        explanation: 'Liveness: si falla, K8s mata y reinicia el contenedor (deadlock detection). Readiness: si falla, K8s no envía tráfico pero NO reinicia (útil mientras carga modelo ML de 5GB).',
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
