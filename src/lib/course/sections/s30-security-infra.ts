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
          code: '"""Seguridad Zero Trust: Vault + Fernet + structlog."""\nimport structlog\nfrom cryptography.fernet import Fernet\nimport hashlib, os\n\nlogger = structlog.get_logger()\nkey = Fernet.generate_key()\ncipher = Fernet(key)\n\ndef encrypt_pii(data: str) -> bytes:\n    """Cifra datos personales antes de almacenarlos."""\n    return cipher.encrypt(data.encode())\n\ndef hash_password(password: str) -> tuple:\n    """PBKDF2 con salt aleatorio."""\n    salt = os.urandom(32)\n    key = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 100000)\n    return key, salt\n\nemail_enc = encrypt_pii("ana@python.pe")\nprint(f"Email cifrado: {email_enc[:30]}...")\nprint(f"Email descifrado: {cipher.decrypt(email_enc).decode()}")\nlog_security_event("login_success", user_id="u123", ip="190.x.x.x")',
        },
        why: 'Vault centraliza secretos con rotacion automatica. Fernet cifra PII con AES-128-CBC + HMAC. PBKDF2 hashea passwords con salt aleatorio. structlog registra eventos JSON para forense. Sin estas capas, un atacante con acceso a la DB ve todos los datos en claro.',
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
          code: '"""Middleware de seguridad para FastAPI."""\nfrom fastapi import Request\nimport time, structlog\n\nlogger = structlog.get_logger()\n\nasync def security_middleware(request: Request, call_next):\n    start = time.time()\n    ip = request.client.host\n    response = await call_next(request)\n    duration_ms = (time.time() - start) * 1000\n    logger.info("request_completed", ip=ip, path=request.url.path,\n                status=response.status_code, duration_ms=round(duration_ms, 2))\n    return response\n\nprint("Middleware de seguridad implementado")',
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
        question: '¿Qué es Zero Trust Architecture?',
        options: [
          'Requiere autenticar y autorizar cada request sin importar su origen — no asume que la red interna es confiable',
          'ZTA es un antivirus',
          'ZTA es un firewall de hardware',
          'ZTA es un sistema de backup',
        ],
        correctIndex: 0,
        explanation: 'ZTA dice "nunca confíes, siempre verifica": cada request lleva JWT, cada conexión usa mTLS, cada acceso a DB requiere RBAC. Previene movimiento lateral si un atacante compromete un servicio.',
      },
      {
        question: '¿Qué es mTLS (mutual TLS)?',
        options: [
          'Tanto el cliente como el servidor presentan certificados — ambos se autentican mutuamente, no solo el servidor',
          'mTLS es más rápido que TLS',
          'mTLS solo funciona en localhost',
          'mTLS es TLS con doble encriptación',
        ],
        correctIndex: 0,
        explanation: 'TLS normal: el cliente verifica al servidor. mTLS: el servidor TAMBIÉN verifica al cliente. En microservicios, solo servicios con certificados válidos pueden llamarse entre sí.',
      },
      {
        question: '¿Qué es HashiCorp Vault?',
        options: [
          'Gestor centralizado de secretos con rotación automática, auditoría y control de acceso — elimina secretos hardcodeados',
          'Un sistema de almacenamiento',
          'Un servidor de bases de datos',
          'Un firewall de aplicación web',
        ],
        correctIndex: 0,
        explanation: 'Vault centraliza secretos: API keys, credenciales DB, certificados TLS. Los servicios los piden via API, Vault los rota automáticamente. Audita quién accedió a qué.',
      },
      {
        question: '¿Qué es el principio de mínimo privilegio?',
        options: [
          'Cada servicio/usuario tiene solo los permisos estrictamente necesarios — un servicio de inferencia no necesita acceso a la tabla de usuarios',
          'Dar a todos acceso admin',
          'Usar un solo usuario para toda la app',
          'Deshabilitar toda autenticación',
        ],
        correctIndex: 0,
        explanation: 'Mínimo privilegio: el servicio de scoring solo lee features y escribe predicciones. Si se compromete, el daño se limita. Sin esto, un servicio comprometido = acceso total.',
      },
      {
        question: '¿Por qué structlog es mejor que print() para logging de seguridad?',
        options: [
          'Produce logs JSON estructurados con campos (ip, user_id, endpoint) — permite queries eficientes en ELK/Datadog para investigación forense',
          'structlog es más rápido',
          'structlog encripta los logs',
          'structlog es un sistema de alertas',
        ],
        correctIndex: 0,
        explanation: 'structlog emite JSON: {"ip": "190.x.x.x", "endpoint": "/predict", "status": 200}. En Datadog puedes buscar requests por IP/endpoint/tiempo. Con print() tendrías texto plano sin estructura.',
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
