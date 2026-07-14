import type { CourseSection } from '../../types'

export const section30: CourseSection = {
  id: 'security-infra',
  index: 30,
  title: 'Seguridad Avanzada e Infraestructura',
  shortTitle: 'Seguridad Avanzada e Infraestr',
  tagline: 'En producción, la seguridad no es opcional — es el plano sobre el que todo lo demás se construye.',
  estimatedHours: 12,
  level: 'Senior',
  phase: 2,
  icon: 'Lock',
  accentColor: 'bg-gradient-to-br from-purple-500 to-fuchsia-600',
  jobRelevance: 'Roles Senior/Staff requieren diseñar seguridad desde la arquitectura: Identity Providers, TLS/mTLS, secrets management a escala, SAST/SCA en CI/CD y pentesting básico. Continúa la sección 14 con foco en infraestructura y patrones Zero Trust.',
  learningOutcomes: [
    { text: 'OAuth2/OIDC flows completos con Keycloak o Auth0 como Identity Provider' },
    { text: 'HTTPS/TLS en producción con Let\'s Encrypt y nginx reverse proxy' },
    { text: 'Secrets management con HashiCorp Vault o AWS Secrets Manager' },
    { text: 'Implementar Zero Trust con mTLS entre microservicios' },
    { text: 'SAST con bandit + SCA con safety en CI/CD pipeline' },
    { text: 'Pentesting básico de APIs propias con OWASP ZAP' },
    { text: 'Rate limiting, WAF patterns, y DDoS mitigation en FastAPI' },
  ],
  theory: [
    {
      heading: 'Seguridad de red y Zero Trust Architecture para pipelines de IA',
      paragraphs: [
        'Zero Trust Architecture (ZTA) elimina el modelo de "castle and moat" donde todo dentro de la red corporativa era confiable. En ZTA, cada request debe autenticarse y autorizarse sin importar su origen. Para pipelines de IA, esto significa mTLS entre microservicios con certificados firmados por una CA interna, JWT firmados con RS256 para autenticación, y RBAC estricto en cada endpoint. Herramientas como HashiCorp Vault centralizan la gestión de secretos con rotación automática, eliminando el riesgo de API keys hardcodeadas en código o variables de entorno.',
        'El OWASP API Top 10 (2023) identifica BOLA (Broken Object Level Authorization) como la vulnerabilidad #1 en APIs. En pipelines de IA, esto significa que un usuario no debe poder acceder a predicciones de otro usuario sin autorización explícita. La mitigación implementa checks de autorización a nivel de objeto en cada endpoint, no solo a nivel de endpoint. En Python FastAPI, esto se logra con dependencies que verifican ownership antes de retornar datos: `if resource.owner_id != current_user.id: raise HTTPException(403)`.',
        'El logging de auditoría con structlog es esencial para compliance y forense. structlog produce logs JSON estructurados con campos como timestamp, user_id, endpoint, ip, response_code, y duration_ms. Esto permite queries eficientes en ELK/Datadog: "muéstrame todos los requests al endpoint /predict desde IP X en las últimas 24h". Sin logs estructurados, investigar un incidente de seguridad es como buscar una aguja en un pajar de texto plano. La regla: cada acción de seguridad (login, acceso a datos sensibles, cambio de configuración) debe loggearse con nivel INFO mínimo.',
      ],
    },
  ],
  iDo: {
    intro: 'Te muestro paso a paso cómo aplicar los conceptos de esta sección con ejemplos prácticos.',
    steps: [
      {
        description: 'Configurar HashiCorp Vault para gestión centralizada de secretos',
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
        instruction: 'Implementa una función que cifre datos PII usando Fernet de cryptography',
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
    title: 'Security Hardened API',
    context: 'La API de la sección 21 con: OAuth2 OIDC, secrets en Vault, mTLS entre servicios, pipeline CI/CD con bandit + safety, y reporte de OWASP ZAP.',
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
        question: '¿Cuál de los siguientes describe mejor: OAuth2/OIDC flows completos con Keycloak o Auth0 como Identity Provider?',
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
        question: '¿Cuál de los siguientes describe mejor: HTTPS/TLS en producción con Let\'s Encrypt y nginx reverse proxy?',
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
        question: '¿Cuál de los siguientes describe mejor: Secrets management con HashiCorp Vault o AWS Secrets Manager?',
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
        question: '¿Cuál de los siguientes describe mejor: Implementar Zero Trust con mTLS entre microservicios?',
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
        question: '¿Cuál de los siguientes describe mejor: SAST con bandit + SCA con safety en CI/CD pipeline?',
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
