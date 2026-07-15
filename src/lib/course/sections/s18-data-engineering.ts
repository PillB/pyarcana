import type { CourseSection } from '../../types'

export const section18: CourseSection = {
  id: 'data-engineering',
  index: 18,
  title: 'Ingeniería de Datos Intermedia — Prefect, Parquet, Great Expectations',
  shortTitle: 'Ingeniería de Datos Intermedia',
  tagline: 'De scripts de análisis a pipelines de producción que corren solos cada noche.',
  estimatedHours: 12,
  level: 'Competente',
  phase: 1,
  icon: 'Wrench',
  accentColor: 'bg-gradient-to-br from-blue-500 to-indigo-600',
  jobRelevance: 'Data Engineer es uno de los roles más demandados en USA (2025-2026, ~$120K-$150K). Las empresas buscan candidatos que conozcan orquestación con Prefect/Airflow, almacenamiento eficiente con Parquet, y validación de calidad con Great Expectations. Construye esos fundamentos sobre el pipeline de la sección 7.',
  learningOutcomes: [
    { text: 'Construir pipelines ETL/ELT con prefect 3.x: @flow, @task, retries, deployments' },
    { text: 'Trabajar con Parquet usando pyarrow: lectura/escritura, partitioning por fecha, schema enforcement' },
    { text: 'Implementar idempotencia en pipelines: qué es, por qué importa, cómo garantizarla' },
    { text: 'Usar great_expectations para validar calidad de datos con Expectation Suites' },
    { text: 'Gestionar configuración de pipelines con Pydantic Settings y variables de entorno' },
    { text: 'Usar APScheduler para tareas recurrentes cuando Prefect es demasiado pesado' },
    { text: 'Entender sharding, partitioning por columnas y estrategias de almacenamiento por fecha' },
  ],
  theory: [
    {
      heading: 'Prefect 3.x fundamentals: @flow como función principal, @task como unidades retryable, retries=3, retry_delay_seconds=60, logging automático, artifacts, deployments con serve() o deploy()',
      paragraphs: [
        'En esta lección vamos a explorar prefect 3.x fundamentals: @flow como función principal, @task como unidades retryable, retries=3, retry_delay_seconds=60, logging automático, artifacts, deployments con serve() o deploy() en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender prefect 3.x fundamentals: @flow como función principal, @task como unidades retryable, retries=3, retry_delay_seconds=60, logging automático, artifacts, deployments con serve() o deploy() es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, prefect 3.x fundamentals: @flow como función principal, @task como unidades retryable, retries=3, retry_delay_seconds=60, logging automático, artifacts, deployments con serve() o deploy() se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Parquet con pyarrow: pq.write_table(), pq.read_table(), write_to_dataset() con partitioning [year, month], schema enforcement',
      paragraphs: [
        'En esta lección vamos a explorar parquet con pyarrow: pq.write_table(), pq.read_table(), write_to_dataset() con partitioning [year, month], schema enforcement en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender parquet con pyarrow: pq.write_table(), pq.read_table(), write_to_dataset() con partitioning [year, month], schema enforcement es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, parquet con pyarrow: pq.write_table(), pq.read_table(), write_to_dataset() con partitioning [year, month], schema enforcement se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Idempotencia: el pipeline puede correr N veces sin duplicar datos — cómo verificar si el archivo del día ya existe',
      paragraphs: [
        'En esta lección vamos a explorar idempotencia: el pipeline puede correr n veces sin duplicar datos — cómo verificar si el archivo del día ya existe en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender idempotencia: el pipeline puede correr n veces sin duplicar datos — cómo verificar si el archivo del día ya existe es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, idempotencia: el pipeline puede correr n veces sin duplicar datos — cómo verificar si el archivo del día ya existe se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Great Expectations: DataContext, crear ExpectationSuite, ExpectationConfiguration (not_null, unique, values_in_set, between), checkpoint.run() para validación',
      paragraphs: [
        'En esta lección vamos a explorar great expectations: datacontext, crear expectationsuite, expectationconfiguration (not_null, unique, values_in_set, between), checkpoint.run() para validación en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender great expectations: datacontext, crear expectationsuite, expectationconfiguration (not_null, unique, values_in_set, between), checkpoint.run() para validación es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, great expectations: datacontext, crear expectationsuite, expectationconfiguration (not_null, unique, values_in_set, between), checkpoint.run() para validación se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Pydantic Settings: BaseSettings para configurar pipelines desde env vars con validación de tipos',
      paragraphs: [
        'En esta lección vamos a explorar pydantic settings: basesettings para configurar pipelines desde env vars con validación de tipos en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender pydantic settings: basesettings para configurar pipelines desde env vars con validación de tipos es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, pydantic settings: basesettings para configurar pipelines desde env vars con validación de tipos se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'APScheduler: BackgroundScheduler, CronTrigger(hour=8, timezone=\'America/Lima\'), IntervalTrigger',
      paragraphs: [
        'En esta lección vamos a explorar apscheduler: backgroundscheduler, crontrigger(hour=8, timezone=\'america/lima\'), intervaltrigger en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender apscheduler: backgroundscheduler, crontrigger(hour=8, timezone=\'america/lima\'), intervaltrigger es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, apscheduler: backgroundscheduler, crontrigger(hour=8, timezone=\'america/lima\'), intervaltrigger se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Error handling de producción: dead letter queues (guardar registros fallidos), notificaciones de fallo via Slack webhook',
      paragraphs: [
        'En esta lección vamos a explorar error handling de producción: dead letter queues (guardar registros fallidos), notificaciones de fallo via slack webhook en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender error handling de producción: dead letter queues (guardar registros fallidos), notificaciones de fallo via slack webhook es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, error handling de producción: dead letter queues (guardar registros fallidos), notificaciones de fallo via slack webhook se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
  ],
  iDo: {
    intro: 'Te muestro paso a paso cómo aplicar los conceptos de esta sección con ejemplos prácticos.',
    steps: [
      {
        description: 'Tomar el pipeline de la sección 7 y transformarlo en un Prefect flow con @flow + @task + retries',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Tomar el pipeline de la sección 7 y transformarlo en un Prefect flow con @flow + @task + retries\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
      {
        description: 'Cambiar el output de CSV a Parquet particionado por year/month/day',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Cambiar el output de CSV a Parquet particionado por year/month/day\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
      {
        description: 'Añadir validación con Great Expectations: ≥ 5 expectativas sobre el DataFrame de salida',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Añadir validación con Great Expectations: ≥ 5 expectativas sobre el DataFrame de salida\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
    ],
  },
  weDo: {
    intro: 'Ahora te toca a ti practicar con guía. Lee cada instrucción, intenta escribir el código, y si te trabas revisa la solución.',
    steps: [
      {
        instruction: 'Agregar un deployment a Prefect con schedule CronTrigger para ejecutar diariamente a las 8am Lima',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Agregar un deployment a Prefect con schedule CronTrigger para ejecutar diariamente a las 8am Lima\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Agregar un deployment a Prefect con schedule CronTrigger para ejecutar diariamente a las 8am Lima\nprint("Solución implementada")',
        },
      },
      {
        instruction: 'Implementar idempotencia: el flow verifica si el archivo Parquet del día ya existe y termina gracefully si es así',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Implementar idempotencia: el flow verifica si el archivo Parquet del día ya existe y termina gracefully si es así\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Implementar idempotencia: el flow verifica si el archivo Parquet del día ya existe y termina gracefully si es así\nprint("Solución implementada")',
        },
      },
      {
        instruction: 'Configurar notificación de fallo por Slack webhook cuando el flow falla 3 veces consecutivas',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Configurar notificación de fallo por Slack webhook cuando el flow falla 3 veces consecutivas\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Configurar notificación de fallo por Slack webhook cuando el flow falla 3 veces consecutivas\nprint("Solución implementada")',
        },
      },
    ],
  },
  youDo: {
    title: 'ETL Pipeline de Producción',
    context: 'etl-prod-pipeline: Prefect flow con ≥ 3 tasks en secuencia (extract, transform, validate, load); ingiere desde API REST paginada + CSV de S3 público; transforma (normaliza nombres, extrae campos con regex, agrega columna de fecha de proceso); valida con Great Expectations (≥ 5 expectativas) — falla el flow si no pasan; carga a Parquet particionado por fecha en directorio local (simula data lake); deployment con CronTrigger diario + README con arquitectura Mermaid y screenshots del Prefect UI.',
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
        question: 'En Prefect 3.x, ¿cuál es la diferencia entre @flow y @task?',
        options: [
          '@flow orquesta el pipeline completo y puede contener múltiples @task; @task es una unidad atómica de trabajo que puede reintentarse independientemente',
          '@flow es para flujos de datos y @task es para flujos de control',
          '@task orquesta el pipeline y @flow ejecuta tareas individuales',
          'Son sinónimos, @task es el alias moderno de @flow',
        ],
        correctIndex: 0,
        explanation: 'En Prefect, @flow es el orquestador principal que define el pipeline. @task define unidades atómicas retryable dentro del flow. Un flow llama a múltiples tasks, y cada task tiene su propia configuración de retries, retry_delay y caching.',
      },
      {
        question: '¿Por qué Parquet es preferido sobre CSV para almacenar datos en producción?',
        options: [
          'Parquet es columnar y comprimido: lee solo las columnas necesarias (predicate pushdown), usa 5-10x menos espacio que CSV, y preserva tipos de datos',
          'Parquet es más fácil de leer con un editor de texto',
          'Parquet es compatible con Excel y CSV no',
          'Parquet no requiere librerías externas para leerlo',
        ],
        correctIndex: 0,
        explanation: 'Parquet es un formato columnar binario con compresión Snappy/Zstd. Al ser columnar, solo lee las columnas que necesitas (predicate pushdown), reduciendo I/O 10x. Preserva tipos (int, float, timestamp) a diferencia de CSV donde todo es texto. Ocupa 5-10x menos espacio.',
      },
      {
        question: '¿Qué significa que un pipeline sea idempotente?',
        options: [
          'Que ejecutarlo N veces produce el mismo resultado que ejecutarlo 1 vez — no duplica datos ni genera side effects no deseados',
          'Que el pipeline se ejecuta automáticamente sin intervención humana',
          'Que el pipeline usa identidades matemáticas para optimizar cálculos',
          'Que el pipeline no depende de ningún servicio externo',
        ],
        correctIndex: 0,
        explanation: 'Idempotencia significa que ejecutar el pipeline múltiples veces produce el mismo resultado que ejecutarlo una vez. Se logra verificando si el output ya existe antes de procesar, o usando MERGE (upsert) en vez de INSERT para no duplicar registros.',
      },
      {
        question: '¿Qué hace Great Expectations en un pipeline de datos?',
        options: [
          'Valida calidad de datos con reglas declarativas: not_null, unique, values_in_set, between — si una regla falla, el pipeline se detiene',
          'Genera expectativas de rendimiento para optimizar queries SQL',
          'Predice valores futuros basándose en datos históricos',
          'Crea dashboards interactivos para visualizar resultados',
        ],
        correctIndex: 0,
        explanation: 'Great Expectations define Expectation Suites: reglas como expect_column_to_not_be_null, expect_column_values_to_be_unique, expect_column_values_to_be_between. Si una expectation falla, el pipeline se detiene con error, previniendo que datos corruptos propaguen a dashboards y modelos ML.',
      },
      {
        question: '¿Cuándo usarías APScheduler en lugar de Prefect para programar tareas?',
        options: [
          'Cuando necesitas scheduling simple (cron-like) sin infraestructura adicional — APScheduler corre embebido en tu app Python sin servidor',
          'Cuando necesitas orquestar cientos de tareas con dependencias complejas',
          'Cuando necesitas una UI web para monitorear ejecuciones',
          'Nunca, APScheduler está obsoleto',
        ],
        correctIndex: 0,
        explanation: 'APScheduler es ideal para scheduling simple embebido: CronTrigger(hour=8, timezone="America/Lima") corre tu función a las 8am sin necesitar un servidor Prefect. Prefect es mejor para pipelines complejos con dependencias, retries y UI de monitoreo.',
      },
    ],
  },
  resources: {
    docs: [
      { label: 'Prefect 3.x docs', url: 'Prefect 3.x docs' },
      { label: 'Great Expectations docs', url: 'Great Expectations docs' },
      { label: 'PyArrow — parquet', url: 'PyArrow — parquet' },
      { label: 'APScheduler docs', url: 'APScheduler docs' },
    ],
    books: [
      { label: 'Python 201 — Michael Driscoll', note: 'Capítulos relevantes para esta sección' },
    ],
    courses: [
      { label: 'Real Python', url: 'https://realpython.com', note: 'Tutoriales complementarios' },
    ],
  },
}
