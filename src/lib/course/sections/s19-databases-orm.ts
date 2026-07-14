import type { CourseSection } from '../../types'

export const section19: CourseSection = {
  id: 'databases-orm',
  index: 19,
  title: 'Bases de Datos Avanzadas y ORMs',
  shortTitle: 'Bases de Datos Avanzadas y ORM',
  tagline: 'Del SQL básico a queries complejas, ORM moderno y búsqueda vectorial para IA.',
  estimatedHours: 10,
  level: 'Competente',
  phase: 1,
  icon: 'Database',
  accentColor: 'bg-gradient-to-br from-blue-500 to-indigo-600',
  jobRelevance: 'Manejo avanzado de bases de datos es fundamental en todos los roles Backend/Data Engineering. Python 201 (Ch. 15) cubre adodbapi, pyodbc, MySQL, PostgreSQL y SQLAlchemy ORM — esta sección los moderniza con SQLAlchemy 2.0, asyncpg para FastAPI, alembic para migraciones y pgvector para IA.',
  learningOutcomes: [
    { text: 'Usar SQLAlchemy 2.0 ORM moderno: DeclarativeBase, mapped_column, Mapped[T], relationship, Session.execute(select(...))' },
    { text: 'Diseñar modelos con herencia (single-table, joined-table), relaciones 1:N y M:N' },
    { text: 'Ejecutar migraciones de schema con alembic: revision --autogenerate, upgrade head, downgrade' },
    { text: 'Conectar a PostgreSQL async con asyncpg para uso en FastAPI sin bloquear event loop' },
    { text: 'Usar pgvector PostgreSQL extension para almacenar y buscar embeddings semánticos' },
    { text: 'Ejecutar raw SQL analítico con pd.read_sql() y pd.to_sql() con un SQLAlchemy engine' },
    { text: 'Entender bases de datos legacy: adodbapi, pyodbc, pypyodbc (Python 201, Ch. 15) — integraciones con sistemas empresariales' },
  ],
  theory: [
    {
      heading: 'SQLAlchemy 2.0 moderno: DeclarativeBase, mapped_column(type_), Mapped[Optional[str]], relationship(\'Model\', back_populates=...), Session.execute(select(Model).where(...)), session.add(), session.commit()',
      paragraphs: [
        'En esta lección vamos a explorar sqlalchemy 2.0 moderno: declarativebase, mapped_column(type_), mapped[optional[str]], relationship(\'model\', back_populates=...), session.execute(select(model).where(...)), session.add(), session.commit() en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender sqlalchemy 2.0 moderno: declarativebase, mapped_column(type_), mapped[optional[str]], relationship(\'model\', back_populates=...), session.execute(select(model).where(...)), session.add(), session.commit() es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, sqlalchemy 2.0 moderno: declarativebase, mapped_column(type_), mapped[optional[str]], relationship(\'model\', back_populates=...), session.execute(select(model).where(...)), session.add(), session.commit() se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Python 201 Ch. 15 — Bases legacy: adodbapi para bases Access/MSSQL, pyodbc para ODBC genérico, MySQLdb/pymysql para MySQL, psycopg2 para PostgreSQL — importante para integraciones en empresas peruanas con sistemas legacy',
      paragraphs: [
        'En esta lección vamos a explorar python 201 ch. 15 — bases legacy: adodbapi para bases access/mssql, pyodbc para odbc genérico, mysqldb/pymysql para mysql, psycopg2 para postgresql — importante para integraciones en empresas peruanas con sistemas legacy en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender python 201 ch. 15 — bases legacy: adodbapi para bases access/mssql, pyodbc para odbc genérico, mysqldb/pymysql para mysql, psycopg2 para postgresql — importante para integraciones en empresas peruanas con sistemas legacy es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, python 201 ch. 15 — bases legacy: adodbapi para bases access/mssql, pyodbc para odbc genérico, mysqldb/pymysql para mysql, psycopg2 para postgresql — importante para integraciones en empresas peruanas con sistemas legacy se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Alembic: alembic init, env.py configuración, alembic revision --autogenerate -m \'add_column\', alembic upgrade head, alembic downgrade -1',
      paragraphs: [
        'En esta lección vamos a explorar alembic: alembic init, env.py configuración, alembic revision --autogenerate -m \'add_column\', alembic upgrade head, alembic downgrade -1 en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender alembic: alembic init, env.py configuración, alembic revision --autogenerate -m \'add_column\', alembic upgrade head, alembic downgrade -1 es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, alembic: alembic init, env.py configuración, alembic revision --autogenerate -m \'add_column\', alembic upgrade head, alembic downgrade -1 se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'asyncpg: driver PostgreSQL nativo async, await conn.fetch(\'SELECT ...\', *args), asyncpg.create_pool()',
      paragraphs: [
        'En esta lección vamos a explorar asyncpg: driver postgresql nativo async, await conn.fetch(\'select ...\', *args), asyncpg.create_pool() en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender asyncpg: driver postgresql nativo async, await conn.fetch(\'select ...\', *args), asyncpg.create_pool() es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, asyncpg: driver postgresql nativo async, await conn.fetch(\'select ...\', *args), asyncpg.create_pool() se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'pgvector: CREATE EXTENSION vector, columna VECTOR(1536), operador <=> (cosine), <-> (L2), índice HNSW USING hnsw (embedding vector_cosine_ops)',
      paragraphs: [
        'En esta lección vamos a explorar pgvector: create extension vector, columna vector(1536), operador <=> (cosine), <-> (l2), índice hnsw using hnsw (embedding vector_cosine_ops) en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender pgvector: create extension vector, columna vector(1536), operador <=> (cosine), <-> (l2), índice hnsw using hnsw (embedding vector_cosine_ops) es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, pgvector: create extension vector, columna vector(1536), operador <=> (cosine), <-> (l2), índice hnsw using hnsw (embedding vector_cosine_ops) se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'PostgreSQL avanzado: JSONB para datos semi-estructurados, window functions (ROW_NUMBER, RANK), CTEs, EXPLAIN ANALYZE para optimización',
      paragraphs: [
        'En esta lección vamos a explorar postgresql avanzado: jsonb para datos semi-estructurados, window functions (row_number, rank), ctes, explain analyze para optimización en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender postgresql avanzado: jsonb para datos semi-estructurados, window functions (row_number, rank), ctes, explain analyze para optimización es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, postgresql avanzado: jsonb para datos semi-estructurados, window functions (row_number, rank), ctes, explain analyze para optimización se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'pandas + SQLAlchemy: pd.read_sql(query, engine) para EDA en notebooks, df.to_sql(\'table\', engine, if_exists=\'append\')',
      paragraphs: [
        'En esta lección vamos a explorar pandas + sqlalchemy: pd.read_sql(query, engine) para eda en notebooks, df.to_sql(\'table\', engine, if_exists=\'append\') en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender pandas + sqlalchemy: pd.read_sql(query, engine) para eda en notebooks, df.to_sql(\'table\', engine, if_exists=\'append\') es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, pandas + sqlalchemy: pd.read_sql(query, engine) para eda en notebooks, df.to_sql(\'table\', engine, if_exists=\'append\') se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
  ],
  iDo: {
    intro: 'Te muestro paso a paso cómo aplicar los conceptos de esta sección con ejemplos prácticos.',
    steps: [
      {
        description: 'Crear modelos SQLAlchemy 2.0 para un sistema e-commerce: Cliente, Pedido, Producto (relaciones 1:N, M:N con tabla intermedia)',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Crear modelos SQLAlchemy 2.0 para un sistema e-commerce: Cliente, Pedido, Producto (relaciones 1:N, M:N con tabla intermedia)\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
      {
        description: 'Generar y aplicar una migración Alembic que agrega la columna score FLOAT DEFAULT 0 a la tabla Cliente',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Generar y aplicar una migración Alembic que agrega la columna score FLOAT DEFAULT 0 a la tabla Cliente\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
      {
        description: 'Crear la extensión pgvector e insertar/buscar embeddings de texto usando asyncpg',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Crear la extensión pgvector e insertar/buscar embeddings de texto usando asyncpg\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
    ],
  },
  weDo: {
    intro: 'Ahora te toca a ti practicar con guía. Lee cada instrucción, intenta escribir el código, y si te trabas revisa la solución.',
    steps: [
      {
        instruction: 'Conectar asyncpg a un endpoint FastAPI /search que busca los 5 productos más similares semánticamente a una query de texto',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Conectar asyncpg a un endpoint FastAPI /search que busca los 5 productos más similares semánticamente a una query de texto\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Conectar asyncpg a un endpoint FastAPI /search que busca los 5 productos más similares semánticamente a una query de texto\nprint("Solución implementada")',
        },
      },
      {
        instruction: 'Escribir una CTE en PostgreSQL para calcular el ranking de los top-10 clientes por total de compras en los últimos 30 días',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Escribir una CTE en PostgreSQL para calcular el ranking de los top-10 clientes por total de compras en los últimos 30 días\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Escribir una CTE en PostgreSQL para calcular el ranking de los top-10 clientes por total de compras en los últimos 30 días\nprint("Solución implementada")',
        },
      },
      {
        instruction: 'Usar pd.read_sql() con un join complejo para traer datos a un Jupyter Notebook para EDA',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Usar pd.read_sql() con un join complejo para traer datos a un Jupyter Notebook para EDA\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Usar pd.read_sql() con un join complejo para traer datos a un Jupyter Notebook para EDA\nprint("Solución implementada")',
        },
      },
    ],
  },
  youDo: {
    title: 'ORM Multi-tabla + Búsqueda Vectorial',
    context: 'inventory-api: Modelos SQLAlchemy 2.0 (Producto, Categoría, Inventario, MovimientoStock con relaciones completas); migraciones Alembic con historial de 3+ versiones; endpoints FastAPI CRUD completos (paginación, filtros, ordenamiento); endpoint /search con pgvector (búsqueda semántica de productos por descripción en lenguaje natural); tests de integración con pytest + pytest-asyncio + fixtures de DB en memoria (SQLite para tests); docker-compose.yml: PostgreSQL 16 + pgvector extension + FastAPI.',
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
        question: '¿Cuál de los siguientes describe mejor: Usar SQLAlchemy 2.0 ORM moderno: DeclarativeBase, mapped_column, Mapped[T], relationship, Session.execute(select(...))?',
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
        question: '¿Cuál de los siguientes describe mejor: Diseñar modelos con herencia (single-table, joined-table), relaciones 1:N y M:N?',
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
        question: '¿Cuál de los siguientes describe mejor: Ejecutar migraciones de schema con alembic: revision --autogenerate, upgrade head, downgrade?',
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
        question: '¿Cuál de los siguientes describe mejor: Conectar a PostgreSQL async con asyncpg para uso en FastAPI sin bloquear event loop?',
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
        question: '¿Cuál de los siguientes describe mejor: Usar pgvector PostgreSQL extension para almacenar y buscar embeddings semánticos?',
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
      { label: 'Python 201 (Driscoll) — Ch. 15 Databases (base conceptual)', url: 'Python 201 (Driscoll) — Ch. 15 Databases (base conceptual)' },
      { label: 'Python 101 (Driscoll) — Ch. 34 SQLAlchemy (introducción)', url: 'Python 101 (Driscoll) — Ch. 34 SQLAlchemy (introducción)' },
      { label: 'SQLAlchemy 2.0 ORM tutorial', url: 'SQLAlchemy 2.0 ORM tutorial' },
      { label: 'pgvector GitHub', url: 'pgvector GitHub' },
      { label: 'Alembic tutorial', url: 'Alembic tutorial' },
    ],
    books: [
      { label: 'Python 201 — Michael Driscoll', note: 'Capítulos relevantes para esta sección' },
    ],
    courses: [
      { label: 'Real Python', url: 'https://realpython.com', note: 'Tutoriales complementarios' },
    ],
  },
}
