import type { CourseSection } from '../../types'

export const section21: CourseSection = {
  id: 'fastapi',
  index: 21,
  title: 'FastAPI — Backend Python para Sitios Web en Vivo',
  shortTitle: 'FastAPI — Backend Python para ',
  tagline: 'Transforma tus modelos de Python en APIs que cualquier frontend puede consumir — en tiempo real.',
  estimatedHours: 12,
  level: 'Competente',
  phase: 1,
  icon: 'Server',
  accentColor: 'bg-gradient-to-br from-blue-500 to-indigo-600',
  jobRelevance: 'FastAPI es el framework backend más demandado en roles Python/AI Engineer USA 2026. El 90% de las ofertas de AI Engineer en LinkedIn incluyen \'FastAPI\' explícitamente. Permite exponer modelos ML, RAG pipelines y agentes de IA como endpoints HTTP y WebSocket para uso en producción.',
  learningOutcomes: [
    { text: 'Construir APIs REST con FastAPI: path params, query params, request bodies con Pydantic v2' },
    { text: 'Implementar autenticación JWT con OAuth2 Password Flow y python-jose' },
    { text: 'Crear endpoints WebSocket para streaming de datos en tiempo real' },
    { text: 'Usar BackgroundTasks para tareas asíncronas que no bloquean la respuesta' },
    { text: 'Implementar middleware: CORS, logging estructurado, rate limiting con slowapi' },
    { text: 'Conectar FastAPI a PostgreSQL con SQLAlchemy async (construido en sección 19)' },
    { text: 'Desplegar con uvicorn (desarrollo) y gunicorn + uvicorn workers (producción)' },
    { text: 'Testing completo: TestClient de httpx, fixtures pytest, testing de WebSockets' },
  ],
  theory: [
    {
      heading: 'FastAPI fundamentals: routing con decoradores, dependency injection con Depends(), APIRouter para modularizar',
      paragraphs: [
        'En esta lección vamos a explorar fastapi fundamentals: routing con decoradores, dependency injection con depends(), apirouter para modularizar en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender fastapi fundamentals: routing con decoradores, dependency injection con depends(), apirouter para modularizar es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, fastapi fundamentals: routing con decoradores, dependency injection con depends(), apirouter para modularizar se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Pydantic v2: BaseModel, Field(default, gt=0, description=...), model_validator, computed_field, serialización/deserialización',
      paragraphs: [
        'En esta lección vamos a explorar pydantic v2: basemodel, field(default, gt=0, description=...), model_validator, computed_field, serialización/deserialización en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender pydantic v2: basemodel, field(default, gt=0, description=...), model_validator, computed_field, serialización/deserialización es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, pydantic v2: basemodel, field(default, gt=0, description=...), model_validator, computed_field, serialización/deserialización se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Auth con JWT: OAuth2PasswordBearer, generar tokens con python-jose, ACCESS_TOKEN_EXPIRE_MINUTES, refresh token rotation',
      paragraphs: [
        'En esta lección vamos a explorar auth con jwt: oauth2passwordbearer, generar tokens con python-jose, access_token_expire_minutes, refresh token rotation en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender auth con jwt: oauth2passwordbearer, generar tokens con python-jose, access_token_expire_minutes, refresh token rotation es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, auth con jwt: oauth2passwordbearer, generar tokens con python-jose, access_token_expire_minutes, refresh token rotation se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'WebSockets en FastAPI: WebSocket class, ConnectionManager para gestionar múltiples conexiones, broadcast y unicast',
      paragraphs: [
        'En esta lección vamos a explorar websockets en fastapi: websocket class, connectionmanager para gestionar múltiples conexiones, broadcast y unicast en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender websockets en fastapi: websocket class, connectionmanager para gestionar múltiples conexiones, broadcast y unicast es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, websockets en fastapi: websocket class, connectionmanager para gestionar múltiples conexiones, broadcast y unicast se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'async/await en FastAPI: async def vs def — cuándo cada uno bloquea el event loop, BackgroundTasks.add_task()',
      paragraphs: [
        'En esta lección vamos a explorar async/await en fastapi: async def vs def — cuándo cada uno bloquea el event loop, backgroundtasks.add_task() en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender async/await en fastapi: async def vs def — cuándo cada uno bloquea el event loop, backgroundtasks.add_task() es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, async/await en fastapi: async def vs def — cuándo cada uno bloquea el event loop, backgroundtasks.add_task() se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Middleware: CORSMiddleware, custom logging middleware con structlog, slowapi para rate limiting',
      paragraphs: [
        'En esta lección vamos a explorar middleware: corsmiddleware, custom logging middleware con structlog, slowapi para rate limiting en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender middleware: corsmiddleware, custom logging middleware con structlog, slowapi para rate limiting es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, middleware: corsmiddleware, custom logging middleware con structlog, slowapi para rate limiting se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Testing: httpx.AsyncClient + pytest-asyncio, fixtures para limpiar la DB entre tests, TestClient para tests síncronos',
      paragraphs: [
        'En esta lección vamos a explorar testing: httpx.asyncclient + pytest-asyncio, fixtures para limpiar la db entre tests, testclient para tests síncronos en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender testing: httpx.asyncclient + pytest-asyncio, fixtures para limpiar la db entre tests, testclient para tests síncronos es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, testing: httpx.asyncclient + pytest-asyncio, fixtures para limpiar la db entre tests, testclient para tests síncronos se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Producción: gunicorn -k uvicorn.workers.UvicornWorker, health check endpoint /health, graceful shutdown con signals',
      paragraphs: [
        'En esta lección vamos a explorar producción: gunicorn -k uvicorn.workers.uvicornworker, health check endpoint /health, graceful shutdown con signals en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender producción: gunicorn -k uvicorn.workers.uvicornworker, health check endpoint /health, graceful shutdown con signals es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, producción: gunicorn -k uvicorn.workers.uvicornworker, health check endpoint /health, graceful shutdown con signals se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
  ],
  iDo: {
    intro: 'Te muestro paso a paso cómo aplicar los conceptos de esta sección con ejemplos prácticos.',
    steps: [
      {
        description: 'Crear endpoint /predict que recibe features en el body (Pydantic model) y retorna predicción del modelo de churn (sección 10) — modelo cargado con @app.lifespan',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Crear endpoint /predict que recibe features en el body (Pydantic model) y retorna predicción del modelo de churn (sección 10) — modelo cargado con @app.lifespan\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
      {
        description: 'Implementar /ws/metrics WebSocket que emite métricas del servidor (CPU, RAM, requests/min) cada segundo',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Implementar /ws/metrics WebSocket que emite métricas del servidor (CPU, RAM, requests/min) cada segundo\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
      {
        description: 'Endpoint /auth/token con JWT: verifica usuario/contraseña, retorna access_token',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Endpoint /auth/token con JWT: verifica usuario/contraseña, retorna access_token\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
    ],
  },
  weDo: {
    intro: 'Ahora te toca a ti practicar con guía. Lee cada instrucción, intenta escribir el código, y si te trabas revisa la solución.',
    steps: [
      {
        instruction: 'Conectar FastAPI a PostgreSQL async (asyncpg/SQLAlchemy) con dependency injection del session',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Conectar FastAPI a PostgreSQL async (asyncpg/SQLAlchemy) con dependency injection del session\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Conectar FastAPI a PostgreSQL async (asyncpg/SQLAlchemy) con dependency injection del session\nprint("Solución implementada")',
        },
      },
      {
        instruction: 'Implementar un ConnectionManager para WebSocket que soporta: broadcast a todos, mensaje a usuario específico, y limpieza en desconexión',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Implementar un ConnectionManager para WebSocket que soporta: broadcast a todos, mensaje a usuario específico, y limpieza en desconexión\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Implementar un ConnectionManager para WebSocket que soporta: broadcast a todos, mensaje a usuario específico, y limpieza en desconexión\nprint("Solución implementada")',
        },
      },
      {
        instruction: 'Añadir rate limiting con slowapi: máximo 10 requests/minuto por IP en endpoints de predicción',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Añadir rate limiting con slowapi: máximo 10 requests/minuto por IP en endpoints de predicción\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Añadir rate limiting con slowapi: máximo 10 requests/minuto por IP en endpoints de predicción\nprint("Solución implementada")',
        },
      },
    ],
  },
  youDo: {
    title: 'REST API + Auth + WebSockets + Streaming',
    context: 'live-analytics-api: endpoints CRUD completos para un recurso de negocio con paginación (limit/offset); auth JWT con refresh tokens (access token 15min, refresh token 7 días); WebSocket /ws/events que hace streaming de eventos en tiempo real (simula ventas llegando); endpoint /predict que sirve el modelo de churn sección 10; rate limiting por usuario autenticado (no solo por IP); tests pytest con ≥ 80% cobertura incluyendo WebSocket y auth; docker-compose.yml con FastAPI + PostgreSQL + Redis (rate limiting y sessions); documentación OpenAPI completa con ejemplos en cada endpoint (auto-generada por FastAPI).',
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
        question: '¿Por qué FastAPI es más rápido que Flask para APIs Python?',
        options: [
          'FastAPI usa async/await nativo con Starlette (ASGI), permitiendo manejar miles de requests concurrentes sin bloquear — Flask es síncrono (WSGI) y bloquea por request',
          'FastAPI está escrito en C y Flask en Python',
          'FastAPI usa menos memoria que Flask',
          'FastAPI compila el código a binario antes de ejecutar',
        ],
        correctIndex: 0,
        explanation: 'FastAPI usa ASGI (async) con Starlette. En Flask (WSGI, síncrono), cada request bloquea un worker. Si un endpoint hace una query a la DB que tarda 100ms, ese worker no puede atender otros requests. Con async/await en FastAPI, mientras espera la DB, atiende otros requests. Esto permite 10x más throughput.',
      },
      {
        question: '¿Qué hace el decorador @app.post("/users") en FastAPI?',
        options: [
          'Define un endpoint HTTP POST en la ruta /users — cuando un cliente hace POST a /users, FastAPI ejecuta la función decorada',
          'Crea un usuario en la base de datos automáticamente',
          'Publica un mensaje en un sistema de colas',
          'Define una ruta de frontend para el formulario de usuarios',
        ],
        correctIndex: 0,
        explanation: '@app.post("/users") registra la función como handler para HTTP POST en la ruta /users. FastAPI mapea automáticamente: el body del request se parsea con Pydantic, los query params se inyectan, y el return se serializa a JSON. Documentación OpenAPI se genera automáticamente en /docs.',
      },
      {
        question: '¿Para qué sirve Pydantic en FastAPI?',
        options: [
          'Define modelos de datos con validación automática de tipos — si el cliente envía un string donde esperas un int, Pydantic rechaza el request con error 422 antes de que llegue a tu lógica',
          'Es un ORM para conectar FastAPI con bases de datos',
          'Es un sistema de autenticación para APIs',
          'Es un template engine para generar HTML',
        ],
        correctIndex: 0,
        explanation: 'Pydantic BaseModel define el schema del request/response. Si declaras "edad: int" y el cliente envía "edad: "hola"", Pydantic rechaza con 422 Unprocessable Entity y un mensaje claro del error. Sin Pydantic, tendrías que validar manualmente cada campo, lo que es tedioso y propenso a errores.',
      },
      {
        question: '¿Qué son las dependencies en FastAPI y para qué sirven?',
        options: [
          'Funciones que se ejecutan antes del endpoint para validar auth, extraer el usuario actual, conectar a la DB, etc. — se inyectan automáticamente vía Depends()',
          'Librerías externas que tu API necesita para funcionar',
          'Dependencias circulares entre módulos que FastAPI detecta',
          'Variables de entorno que la API requiere',
        ],
        correctIndex: 0,
        explanation: 'Las dependencies (Depends) son funciones que FastAPI ejecuta antes del endpoint. Ej: def get_current_user(token: str = Depends(oauth2_scheme)). FastAPI llama get_current_user automáticamente, pasa el resultado al endpoint, y si lanza excepción, el endpoint nunca se ejecuta. Perfecto para auth, rate limiting, y DB sessions.',
      },
      {
        question: '¿Cómo maneja FastAPI las operaciones asíncronas?',
        options: [
          'Con async/await nativo de Python — defines el endpoint como "async def" y usas "await" para operaciones I/O (DB, HTTP calls) sin bloquear el event loop',
          'Con threads de sistema operativo como Flask',
          'Con multiprocessing automático para cada request',
          'FastAPI no soporta operaciones asíncronas',
        ],
        correctIndex: 0,
        explanation: 'FastAPI usa async/await. Si defines "async def get_users()", FastAPI lo ejecuta en el event loop. Dentro, usas "await db.fetch_all()" para no bloquear mientras espera la DB. Si una función es síncrona (def normal), FastAPI la ejecuta en un thread pool para no bloquear el event loop. Esta combinación da lo mejor de ambos mundos.',
      },
    ],
  },
  resources: {
    docs: [
      { label: 'FastAPI official docs', url: 'FastAPI official docs' },
      { label: 'FastAPI WebSocket examples', url: 'FastAPI WebSocket examples' },
      { label: 'Pydantic v2 docs', url: 'Pydantic v2 docs' },
      { label: 'python-jose JWT', url: 'python-jose JWT' },
      { label: 'slowapi — rate limiting', url: 'slowapi — rate limiting' },
    ],
    books: [
      { label: 'Python 201 — Michael Driscoll', note: 'Capítulos relevantes para esta sección' },
    ],
    courses: [
      { label: 'Real Python', url: 'https://realpython.com', note: 'Tutoriales complementarios' },
    ],
  },
}
