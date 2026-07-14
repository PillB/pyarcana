import type { CourseSection } from '../../types'

export const section14: CourseSection = {
  id: 'security',
  index: 14,
  title: 'Seguridad para Automatizaciones e Inteligencia Artificial',
  shortTitle: 'Seguridad para Automatizacione',
  tagline: 'La automatización no protegida es una bomba de tiempo. La IA sin seguridad es una puerta trasera.',
  estimatedHours: 10,
  level: 'Competente',
  phase: 1,
  icon: 'ShieldCheck',
  accentColor: 'bg-gradient-to-br from-blue-500 to-indigo-600',
  jobRelevance: 'La seguridad en automatizaciones e IA es el gap más grande del mercado peruano y LATAM. Las empresas US y globales requieren que sus ingenieros de AI/Automation entiendan el OWASP LLM Top 10, protejan pipelines de datos, y defiendan modelos contra ataques de prompt injection. En 2026, el 65% de las brechas de seguridad involucran algún componente de IA o automatización. Obligatoria para cualquier perfil mid-senior.',
  learningOutcomes: [
    { text: 'Entender y aplicar el OWASP LLM Top 10 (2025) a aplicaciones reales con IA' },
    { text: 'Implementar defensa en capas contra prompt injection directa e indirecta' },
    { text: 'Usar `presidio` de Microsoft para anonimización de PII en pipelines de datos' },
    { text: 'Aplicar `detect-secrets` y gestión segura de credenciales con variables de entorno' },
    { text: 'Entender hashing y criptografía con `hashlib`, `cryptography` (Python 201 Ch. 14)' },
    { text: 'Implementar logging de auditoría y trazabilidad en bots y agentes' },
    { text: 'Aplicar el principio de mínimo privilegio en automatizaciones con APIs y bases de datos' },
  ],
  theory: [
    {
      heading: 'OWASP LLM Top 10 (2025): LLM01 Prompt Injection, LLM02 Sensitive Info Disclosure, LLM03 Supply Chain, LLM04 Data Poisoning, LLM05 Improper Output Handling, LLM06 Excessive Agency, LLM07 System Prompt Leakage, LLM08 Vector/Embedding Weaknesses, LLM09 Misinformation, LLM10 Unbounded Consumption',
      paragraphs: [
        'En esta lección vamos a explorar owasp llm top 10 (2025): llm01 prompt injection, llm02 sensitive info disclosure, llm03 supply chain, llm04 data poisoning, llm05 improper output handling, llm06 excessive agency, llm07 system prompt leakage, llm08 vector/embedding weaknesses, llm09 misinformation, llm10 unbounded consumption en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender owasp llm top 10 (2025): llm01 prompt injection, llm02 sensitive info disclosure, llm03 supply chain, llm04 data poisoning, llm05 improper output handling, llm06 excessive agency, llm07 system prompt leakage, llm08 vector/embedding weaknesses, llm09 misinformation, llm10 unbounded consumption es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, owasp llm top 10 (2025): llm01 prompt injection, llm02 sensitive info disclosure, llm03 supply chain, llm04 data poisoning, llm05 improper output handling, llm06 excessive agency, llm07 system prompt leakage, llm08 vector/embedding weaknesses, llm09 misinformation, llm10 unbounded consumption se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Criptografía práctica en Python (Python 201, Ch.14): hashlib SHA-256, PBKDF2 key derivation, cryptography Fernet (symmetric) y RSA (asymmetric)',
      paragraphs: [
        'En esta lección vamos a explorar criptografía práctica en python (python 201, ch.14): hashlib sha-256, pbkdf2 key derivation, cryptography fernet (symmetric) y rsa (asymmetric) en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender criptografía práctica en python (python 201, ch.14): hashlib sha-256, pbkdf2 key derivation, cryptography fernet (symmetric) y rsa (asymmetric) es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, criptografía práctica en python (python 201, ch.14): hashlib sha-256, pbkdf2 key derivation, cryptography fernet (symmetric) y rsa (asymmetric) se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Gestión de secretos: python-decouple, python-dotenv, AWS Secrets Manager básico, nunca hardcodear API keys',
      paragraphs: [
        'En esta lección vamos a explorar gestión de secretos: python-decouple, python-dotenv, aws secrets manager básico, nunca hardcodear api keys en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender gestión de secretos: python-decouple, python-dotenv, aws secrets manager básico, nunca hardcodear api keys es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, gestión de secretos: python-decouple, python-dotenv, aws secrets manager básico, nunca hardcodear api keys se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Anonimización y PII: Microsoft presidio — detección y anonimización de NIT, DNI, correos, teléfonos peruanos en DataFrames',
      paragraphs: [
        'En esta lección vamos a explorar anonimización y pii: microsoft presidio — detección y anonimización de nit, dni, correos, teléfonos peruanos en dataframes en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender anonimización y pii: microsoft presidio — detección y anonimización de nit, dni, correos, teléfonos peruanos en dataframes es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, anonimización y pii: microsoft presidio — detección y anonimización de nit, dni, correos, teléfonos peruanos en dataframes se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Defensa contra prompt injection en 6 capas: input validation regex, system prompt restrictivo, output filtering, privilege control en tools, human-in-the-loop, adversarial testing',
      paragraphs: [
        'En esta lección vamos a explorar defensa contra prompt injection en 6 capas: input validation regex, system prompt restrictivo, output filtering, privilege control en tools, human-in-the-loop, adversarial testing en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender defensa contra prompt injection en 6 capas: input validation regex, system prompt restrictivo, output filtering, privilege control en tools, human-in-the-loop, adversarial testing es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, defensa contra prompt injection en 6 capas: input validation regex, system prompt restrictivo, output filtering, privilege control en tools, human-in-the-loop, adversarial testing se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'detect-secrets como pre-commit hook: detectar API keys, passwords y tokens antes de git commit',
      paragraphs: [
        'En esta lección vamos a explorar detect-secrets como pre-commit hook: detectar api keys, passwords y tokens antes de git commit en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender detect-secrets como pre-commit hook: detectar api keys, passwords y tokens antes de git commit es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, detect-secrets como pre-commit hook: detectar api keys, passwords y tokens antes de git commit se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Logging de auditoría con structlog: logs inmutables, estructurados (JSON), trazables con timestamp, user_id, input_hash, output_hash, latencia, security_flags',
      paragraphs: [
        'En esta lección vamos a explorar logging de auditoría con structlog: logs inmutables, estructurados (json), trazables con timestamp, user_id, input_hash, output_hash, latencia, security_flags en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender logging de auditoría con structlog: logs inmutables, estructurados (json), trazables con timestamp, user_id, input_hash, output_hash, latencia, security_flags es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, logging de auditoría con structlog: logs inmutables, estructurados (json), trazables con timestamp, user_id, input_hash, output_hash, latencia, security_flags se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Seguridad en automatizaciones RPA: sanitizar inputs web, rotar credenciales, storage_state de Playwright con cifrado',
      paragraphs: [
        'En esta lección vamos a explorar seguridad en automatizaciones rpa: sanitizar inputs web, rotar credenciales, storage_state de playwright con cifrado en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender seguridad en automatizaciones rpa: sanitizar inputs web, rotar credenciales, storage_state de playwright con cifrado es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, seguridad en automatizaciones rpa: sanitizar inputs web, rotar credenciales, storage_state de playwright con cifrado se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
  ],
  iDo: {
    intro: 'Te muestro paso a paso cómo aplicar los conceptos de esta sección con ejemplos prácticos.',
    steps: [
      {
        description: 'Función sanitize_prompt(user_input) que limpia entradas con regex y logging de intentos sospechosos',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Función sanitize_prompt(user_input) que limpia entradas con regex y logging de intentos sospechosos\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
      {
        description: 'Script con presidio-analyzer + presidio-anonymizer para anonimizar DNIs y correos en un DataFrame de pandas',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Script con presidio-analyzer + presidio-anonymizer para anonimizar DNIs y correos en un DataFrame de pandas\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
      {
        description: 'Pipeline de verificación de integridad con hashlib SHA-256 para archivos de modelos ML',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Pipeline de verificación de integridad con hashlib SHA-256 para archivos de modelos ML\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
      {
        description: 'Configuración de detect-secrets como pre-commit hook con git commit que falla si detecta un secret',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Configuración de detect-secrets como pre-commit hook con git commit que falla si detecta un secret\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
    ],
  },
  weDo: {
    intro: 'Ahora te toca a ti practicar con guía. Lee cada instrucción, intenta escribir el código, y si te trabas revisa la solución.',
    steps: [
      {
        instruction: 'Implementar PromptGuard class con validación de longitud máxima, detección de patrones de injection via regex, y structlog logging de cada violación',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Implementar PromptGuard class con validación de longitud máxima, detección de patrones de injection via regex, y structlog logging de cada violación\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Implementar PromptGuard class con validación de longitud máxima, detección de patrones de injection via regex, y structlog logging de cada violación\nprint("Solución implementada")',
        },
      },
      {
        instruction: 'Construir AuditLogger con structlog que registra timestamp, user_id, input hash (SHA-256), output hash, latencia ms, security flags detectados',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Construir AuditLogger con structlog que registra timestamp, user_id, input hash (SHA-256), output hash, latencia ms, security flags detectados\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Construir AuditLogger con structlog que registra timestamp, user_id, input hash (SHA-256), output hash, latencia ms, security flags detectados\nprint("Solución implementada")',
        },
      },
      {
        instruction: 'Simular los 3 ataques más comunes del OWASP LLM Top 10 en un chatbot de juguete (prompt injection, system prompt leakage, excessive agency) y aplicar mitigaciones correctas',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Simular los 3 ataques más comunes del OWASP LLM Top 10 en un chatbot de juguete (prompt injection, system prompt leakage, excessive agency) y aplicar mitigaciones correctas\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Simular los 3 ataques más comunes del OWASP LLM Top 10 en un chatbot de juguete (prompt injection, system prompt leakage, excessive agency) y aplicar mitigaciones correctas\nprint("Solución implementada")',
        },
      },
    ],
  },
  youDo: {
    title: 'Security Audit Bot',
    context: 'security-audit-bot que recibe un repositorio Git (path local o GitHub URL via argparse), escanea con detect-secrets, analiza con bandit (SAST), anonimiza PII con presidio en logs, genera reporte HTML con severidad (CRITICAL/HIGH/MEDIUM/LOW), e incluye pytest tests que verifican detección de secrets y vulnerabilidades conocidas. Diferenciador claro para roles AI/Security Engineer USA.',
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
        question: '¿Cuál de los siguientes describe mejor: Entender y aplicar el OWASP LLM Top 10 (2025) a aplicaciones reales con IA?',
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
        question: '¿Cuál de los siguientes describe mejor: Implementar defensa en capas contra prompt injection directa e indirecta?',
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
        question: '¿Cuál de los siguientes describe mejor: Usar `presidio` de Microsoft para anonimización de PII en pipelines de datos?',
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
        question: '¿Cuál de los siguientes describe mejor: Aplicar `detect-secrets` y gestión segura de credenciales con variables de entorno?',
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
        question: '¿Cuál de los siguientes describe mejor: Entender hashing y criptografía con `hashlib`, `cryptography` (Python 201 Ch. 14)?',
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
      { label: 'OWASP LLM Top 10 (2025) — genai.owasp.org', url: 'OWASP LLM Top 10 (2025) — genai.owasp.org' },
      { label: 'Presidio — Microsoft GitHub', url: 'Presidio — Microsoft GitHub' },
      { label: 'detect-secrets — Yelp GitHub', url: 'detect-secrets — Yelp GitHub' },
      { label: 'Bandit SAST — PyCQA', url: 'Bandit SAST — PyCQA' },
      { label: 'Python cryptography package', url: 'Python cryptography package' },
    ],
    books: [
      { label: 'Python 201 — Michael Driscoll', note: 'Capítulos relevantes para esta sección' },
    ],
    courses: [
      { label: 'Real Python', url: 'https://realpython.com', note: 'Tutoriales complementarios' },
    ],
  },
}
