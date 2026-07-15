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
        question: '¿Qué es un ORM y cuál es su ventaja principal?',
        options: [
          'Object-Relational Mapper: mapea tablas SQL a clases Python, permitiendo consultar la DB con código Python en vez de SQL crudo — evita SQL injection y hace el código más mantenible',
          'Un sistema que optimiza queries SQL automáticamente',
          'Un reemplazo de SQL que usa sintaxis Python para todas las operaciones',
          'Un motor de base de datos embebido que reemplaza a PostgreSQL',
        ],
        correctIndex: 0,
        explanation: 'Un ORM (Object-Relational Mapper) como SQLAlchemy mapea tablas a clases Python. En vez de escribir "SELECT * FROM users WHERE age > 18", escribes "session.query(User).filter(User.age > 18).all()". Ventajas: type safety, prevención de SQL injection, migrations automáticas, y cambiabilidad entre DB engines.',
      },
      {
        question: 'En SQLAlchemy, ¿cuándo usas `session.commit()` vs `session.flush()`?',
        options: [
          'commit() persiste permanentemente a la DB; flush() envía cambios a la DB sin confirmar la transacción — útil para ver IDs generados antes de commit',
          'commit() es más rápido; flush() es más seguro',
          'commit() borra la sesión; flush() la mantiene activa',
          'Son sinónimos, no hay diferencia práctica',
        ],
        correctIndex: 0,
        explanation: 'session.flush() envía los cambios SQL a la DB pero NO hace COMMIT — la transacción queda abierta. Útil cuando necesitas el ID auto-generado de un objeto antes de seguir trabajando. session.commit() hace flush + COMMIT permanente. Si algo falla después de flush, puedes hacer rollback.',
      },
      {
        question: '¿Qué es el problema N+1 en ORMs y cómo se resuelve?',
        options: [
          'Ocurre cuando haces 1 query para obtener N registros y luego N queries adicionales para sus relaciones — se resuelve con eager loading (joinedload o selectinload)',
          'Es cuando un query retorna N+1 resultados en vez de N',
          'Es un error de off-by-one en el índice de resultados',
          'Es cuando la DB tiene N tablas y necesitas N+1 conexiones',
        ],
        correctIndex: 0,
        explanation: 'El problema N+1: obtienes 100 usuarios (1 query), luego por cada usuario consultas sus pedidos (100 queries) = 101 queries total. Solución: eager loading con joinedload() (1 query con JOIN) o selectinload() (2 queries con IN). Sin esto, un endpoint que debería tardar 50ms tarda 5 segundos.',
      },
      {
        question: '¿Qué es una migration en el contexto de bases de datos?',
        options: [
          'Un script versionado que aplica cambios estructurales a la DB (añadir columnas, crear tablas) de forma controlada y reversible',
          'El proceso de mover datos de una DB a otra',
          'Un backup automático de la base de datos',
          'La conversión de datos de un formato a otro',
        ],
        correctIndex: 0,
        explanation: 'Una migration es un script versionado (con Alembic en SQLAlchemy) que altera el schema de la DB. Ej: "añadir columna email_verified BOOLEAN DEFAULT FALSE". Se aplica con `alembic upgrade head` y se revierte con `alembic downgrade -1`. Permite que todo el equipo tenga el mismo schema sincronizado.',
      },
      {
        question: '¿Por qué se dice que SQLite es ideal para desarrollo pero no para producción con alta concurrencia?',
        options: [
          'SQLite usa bloqueo a nivel de archivo — solo un writer a la vez, lo que causa contention con muchos usuarios concurrentes escribiendo',
          'SQLite no soporta SQL estándar',
          'SQLite no puede almacenar más de 1GB de datos',
          'SQLite no tiene soporte para transacciones',
        ],
        correctIndex: 0,
        explanation: 'SQLite bloquea el archivo completo durante escrituras. Con 1 usuario está bien, pero con 100 usuarios escribiendo simultáneamente, cada uno espera al anterior. PostgreSQL usa bloqueo a nivel de fila (MVCC), permitiendo que múltiples writers operen concurrentemente. SQLite es perfecto para desarrollo, tests y apps de un solo usuario.',
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
