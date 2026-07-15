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
        question: 'En el OWASP LLM Top 10, ¿qué es LLM01 Prompt Injection?',
        options: [
          'Un ataque donde el usuario manipula el input para que el LLM ignore sus instrucciones originales o ejecute acciones no autorizadas',
          'Un ataque donde se intercepta el tr\u00e1fico de red entre el cliente y el servidor del LLM',
          'Un ataque donde se envenenan los datos de entrenamiento del modelo',
          'Un ataque donde se agota el l\u00edmite de tokens del modelo',
        ],
        correctIndex: 0,
        explanation: 'LLM01 Prompt Injection ocurre cuando un atacante inserta texto malicioso en el input que hace que el LLM ignore su system prompt. Puede ser directa (input del usuario) o indirecta (documentos procesados).',
      },
      {
        question: '\u00bfCu\u00e1l de estas NO es una capa v\u00e1lida de defensa contra prompt injection?',
        options: [
          'Encriptar el modelo con AES-256 en reposo',
          'Validaci\u00f3n de input con regex para detectar patrones de inyecci\u00f3n',
          'Filtrar el output del LLM antes de mostrarlo al usuario',
          'Requerir aprobaci\u00f3n humana (human-in-the-loop) para acciones cr\u00edticas',
        ],
        correctIndex: 0,
        explanation: 'La encriptaci\u00f3n del modelo en reposo protege contra acceso f\u00edsico al storage, pero NO contra prompt injection. Las 6 capas son: input validation, system prompt restrictivo, output filtering, privilege control, human-in-the-loop, adversarial testing.',
      },
      {
        question: '\u00bfPara qu\u00e9 sirve Microsoft Presidio en un pipeline de datos?',
        options: [
          'Detectar y anonimizar informaci\u00f3n personal identificable (PII) como DNI, emails, tel\u00e9fonos y direcciones en texto libre',
          'Compilar c\u00f3digo Python a c\u00f3digo nativo para mayor velocidad',
          'Monitorear el uso de GPU en entrenamiento de modelos',
          'Generar embeddings vectoriales para b\u00fasqueda sem\u00e1ntica',
        ],
        correctIndex: 0,
        explanation: 'Presidio detecta PII en texto usando modelos NER y reglas custom, luego la anonimiza reemplazando datos sensibles con placeholders. Esencial para compliance con Ley 29733 en pipelines con datos de clientes peruanos.',
      },
      {
        question: '\u00bfQu\u00e9 hace `detect-secrets` cuando se configura como pre-commit hook?',
        options: [
          'Escanea el c\u00f3digo y el historial de Git en busca de API keys, passwords y tokens antes de permitir el commit, bloque\u00e1ndolo si encuentra secretos',
          'Genera secretos nuevos autom\u00e1ticamente para reemplazar los expuestos',
          'Cifra todos los archivos del repositorio antes de subirlos a GitHub',
          'Elimina autom\u00e1ticamente los archivos que contienen secretos del repositorio',
        ],
        correctIndex: 0,
        explanation: 'detect-secrets de Yelp escanea el diff staged antes de cada commit buscando patrones de secretos. Si encuentra uno, bloquea el commit y muestra el archivo y l\u00ednea afectados.',
      },
      {
        question: '\u00bfCu\u00e1ndo usar\u00edas `Fernet` (cryptography) vs `hashlib` SHA-256?',
        options: [
          'Fernet para cifrar datos que necesitas descifrar despu\u00e9s (cifrado sim\u00e9trico reversible); SHA-256 para hashes irreversibles como passwords o verificaci\u00f3n de integridad',
          'Fernet para hashear passwords; SHA-256 para cifrar datos sensibles',
          'Ambos sirven para lo mismo, Fernet es m\u00e1s r\u00e1pido',
          'SHA-256 para cifrar datos en tr\u00e1nsito; Fernet para hashear archivos',
        ],
        correctIndex: 0,
        explanation: 'Fernet usa AES-128-CBC + HMAC para cifrado sim\u00e9trico reversible. SHA-256 es un hash unidireccional. Usa Fernet para PII que necesitas leer despu\u00e9s. Usa SHA-256 para passwords y verificaci\u00f3n de integridad.',
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
