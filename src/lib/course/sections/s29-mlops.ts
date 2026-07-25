import type { CourseSection } from '../../types'

export const section29: CourseSection = {
  id: "mlops",
  index: 29,
  title: "SQL avanzado y modelado relacional",
  shortTitle: "SQL almacén ER",
  tagline:
    "Almacén relacional del ER: fuentes, entidades, pares, decisiones append-only y evidencia — con constraints, consultas de cola y transacciones atómicas en SQLite de laboratorio",
  estimatedHours: 18,
  level: "Competente a experto",
  phase: 2,
  icon: "Database",
  accentColor: "bg-gradient-to-br from-sky-500 to-blue-800",
  jobRelevance:
    "El **almacén de verdad del ER** guarda fuentes, entidades, pares, decisiones y evidencia con historia auditable. En equipos de datos (banca, telecom, retail en Perú y LATAM), un analista o ingeniero que modela PK/FK, temporalidad y consultas de cola de revisión en SQL reduce re-procesos. También reemplaza discusiones sin evidencia por decisiones trazables. La práctica de esta sección usa SQLite de laboratorio (constraints, joins, ACID, migraciones, *repository*) como contrato del motor antes de un almacén corporativo (*warehouse*).",
  learningOutcomes: [
    {
      text: "Definir PK/FK/CHECK/UNIQUE en SQLite con `PRAGMA foreign_keys=ON` y demostrar violación con IntegrityError",
    },
    {
      text: "Modelar temporalidad y provenance (append-only de decisions; vínculo N–N fuente–entidad vía entity_source_links) sin sobrescribir historia",
    },
    {
      text: "Escribir CTEs, ROW_NUMBER y anti-joins seguros (NOT EXISTS / LEFT JOIN … IS NULL; no NOT IN con NULL) para colas de review",
    },
    {
      text: "Razonar cardinalidad de joins, NULL con IS NULL y planes con EXPLAIN QUERY PLAN (SCAN vs. SEARCH)",
    },
    {
      text: "Garantizar atomicidad decisión+evidencia con BEGIN/COMMIT/ROLLBACK en la misma conexión",
    },
    {
      text: "Implementar upserts de entidad (ON CONFLICT DO UPDATE) sin borrar historia de decisiones",
    },
    {
      text: "Versionar migraciones en schema_migrations, crear índices y evitar DROP sin backup",
    },
    {
      text: "Encapsular SQL en un repository testeable con sqlite :memory: (pending, get, constraints)",
    },
  ],
  theory: [
    {
      heading: "Almacén relacional del ER para CP-N3-A",
      paragraphs: [
        "Modelas el **almacén ER** del capstone CP-N3-A: `source_records` ↔ `entity_source_links` ↔ `entities` → `candidate_pairs` → `decisions` (append-only) → `evidence`. Sin historia de decisiones no hay auditoría: un UPDATE in-place del label borra el rastro de quién cambió de `review` a `match`. Fixture de lab: **CASO-LIM-029** (`run_id=cpn3a-sql`, correos `@example.pe`, ids `ent-00N`). Solo datos sintéticos; **match ≠ fraude** ni parentesco; fallo cerrado (*fail-closed*) si falta llave o el join multiplica filas sin documentar *fan-out*.",
        "SQLite local es una base real y reproducible para observar constraints, NULL, planes y transacciones. En SQLite las foreign keys están **apagadas por defecto**: cada conexión debe ejecutar `PRAGMA foreign_keys = ON` o el `REFERENCES` es solo documentación. Las diferencias con PostgreSQL/Oracle se declaran cuando importan (p. ej. isolation rica, pooling de servidor).",
        "Mapa de cardinalidades del almacén (*warehouse*):\n`entities` 1—N `entity_source_links` N—1 `source_records` (una entidad canónica consolida varios registros fuente) · `entities` N—N vía `candidate_pairs` (con `entity_a < entity_b` y UNIQUE del par) · `candidate_pairs` 1—N `decisions` · `decisions` 1—N `evidence`.\nOrden de estudio: **T1 Modelo** (PK/FK/historia) → **T2 Consulta** (CTE/windows/anti-join) → **T3 Transacción** (ACID/upsert) → **T4 Evolución** (índices/migraciones/repo).\nRuta de carga: **núcleo** = teoría + I Do + E1 de cada subtema; **consolidación** = E2; **extensión** = E3 y You Do. Puedes posponer E3 sin romper el puente a S30 si el núcleo y el proyecto mínimo están sólidos.",
      ],
      callout: {
        type: "info",
        title: "Práctica observable",
        content:
          "Cada afirmación sobre NULL, índices o atomicidad se verifica con consultas y código que imprime el resultado real, no con strings que solo nombran el concepto.",
      },
    },
    {
      heading: "Claves, constraints y normalización",
      subtopicId: "S29-T1-A",
      paragraphs: [
        "**PRIMARY KEY** identifica filas; **FOREIGN KEY** ancla un par a dos entidades existentes. Añade **CHECK** (`score` entre 0 y 1) y **UNIQUE** de negocio cuando corresponda (p. ej. `(source_system, external_id)` en registros fuente). En SQLite la FK solo se exige si habilitas `PRAGMA foreign_keys = ON` en **cada** conexión; sin eso un `entity_id` fantasma se inserta sin error.",
        "Normaliza a **3NF** para hechos del ER: no copies `canonical_name` en cada par; guarda atributos de entidad en `entities` y deja `evidence` como hija de la **decisión** (FK a `decisions.id`). El vínculo fuente–entidad es N–N: una entidad canónica consolida varios `source_records` vía `entity_source_links`, no con una sola FK en `entities`. Si un join multiplica filas (*fan-out*), documenta la cardinalidad o el query está mal para auditoría.",
        "Usa ids sintéticos estables (`ent-00N`, `pair-…`) del fixture CASO-LIM-029. El orden canónico `entity_a < entity_b` (CHECK) más `UNIQUE(entity_a, entity_b)` evita el espejo (e2,e1) y el duplicado en el mismo orden. En el mini-lab de abajo: insert válido, rechazo de FK rota y rechazo de score fuera de rango.",
      ],
      code: {
        language: 'python',
        title: "keys_constraints.py",
        code: `def s29_th_1():
    import sqlite3
    con = sqlite3.connect(":memory:")
    con.execute("PRAGMA foreign_keys = ON")
    con.executescript('''
    CREATE TABLE entities(
      id TEXT PRIMARY KEY,
      canonical_name TEXT NOT NULL
    );
    CREATE TABLE candidate_pairs(
      id TEXT PRIMARY KEY,
      entity_a TEXT NOT NULL REFERENCES entities(id),
      entity_b TEXT NOT NULL REFERENCES entities(id),
      score REAL NOT NULL CHECK(score >= 0 AND score <= 1),
      CHECK(entity_a < entity_b)
    );
    ''')
    con.execute("INSERT INTO entities VALUES ('e1','Ana')")
    con.execute("INSERT INTO entities VALUES ('e2','Ana López')")
    con.execute("INSERT INTO candidate_pairs VALUES ('p1','e1','e2',0.82)")
    fk_rejected = False
    try:
        con.execute(
            "INSERT INTO candidate_pairs VALUES ('p_bad','e1','e_missing',0.5)"
        )
    except sqlite3.IntegrityError:
        fk_rejected = True
    score_rejected = False
    try:
        con.execute(
            "INSERT INTO candidate_pairs VALUES ('p_score','e1','e2',1.5)"
        )
    except sqlite3.IntegrityError:
        score_rejected = True
    n = con.execute("SELECT COUNT(*) FROM candidate_pairs").fetchone()[0]
    print("pairs", n)
    print("fk_ok", fk_rejected)
    print("check_score", score_rejected)
s29_th_1()
`,
        output: `pairs 1
fk_ok True
check_score True`,
      },
      callout: {
        type: "tip",
        title: "Orden canónico A<B",
        content:
          "Forzar entity_a < entity_b evita pares duplicados (e1,e2) y (e2,e1). No implica fraude ni parentesco: solo evita duplicar el mismo candidato.",
      },
    },
    {
      heading: "Temporalidad y provenance",
      subtopicId: "S29-T1-B",
      paragraphs: [
        "**Temporalidad**: modela `valid_from`/`valid_to` o, más simple en el lab, una tabla de eventos donde cada cambio es una fila nueva. No sobrescribas la decisión anterior con UPDATE del label: inserta una nueva fila versionada. Así puedes reconstruir “qué veía el revisor el martes” para el mismo par — requisito de auditoría del almacén ER, no un detalle cosmético de esquema.",
        "**Provenance**: cada entidad o decisión debe rastrearse al registro fuente (`source_system`, `source_record_id`, `ingested_at`, `transform_version`) y a la evidencia (`evidence_ref`). Sin provenance, un match en producción es una opinión sin rastro: no sabes qué payload de `source_records` alimentó el par ni qué nota de evidencia cerró el caso.",
        "Auditoría en Red Andina (sintético, Lima): actor sintético `rev_sintetica`, timestamps UTC y `run_id=cpn3a-sql` versionan la cola de candidatos. El mini-lab inserta `review` y luego `match` para el mismo `pair_id` y lista la historia en orden: dos filas, `overwrite False`. Eso es el puente entre el modelo de T1-A y las colas de consulta de T2.",
      ],
      code: {
        language: 'python',
        title: "temporality_prov.py",
        code: `def s29_th_2():
    import sqlite3
    from datetime import datetime, timezone
    con = sqlite3.connect(":memory:")
    con.executescript('''
    CREATE TABLE decisions(
      id INTEGER PRIMARY KEY,
      pair_id TEXT NOT NULL,
      label TEXT NOT NULL,
      decided_at TEXT NOT NULL,
      actor TEXT NOT NULL,
      evidence_ref TEXT
    );
    ''')
    now = datetime(2026, 7, 20, tzinfo=timezone.utc).isoformat()
    con.execute(
        "INSERT INTO decisions(pair_id,label,decided_at,actor,evidence_ref) VALUES (?,?,?,?,?)",
        ("p1", "review", now, "rev_sintetica", "ev_01"),
    )
    # nueva decisión no borra la anterior
    con.execute(
        "INSERT INTO decisions(pair_id,label,decided_at,actor,evidence_ref) VALUES (?,?,?,?,?)",
        ("p1", "match", now, "rev_sintetica", "ev_02"),
    )
    hist = con.execute(
        "SELECT label FROM decisions WHERE pair_id='p1' ORDER BY id"
    ).fetchall()
    print("history", [h[0] for h in hist])
    print("provenance", "ev_02")
    print("overwrite", False)
s29_th_2()
`,
        output: `history ['review', 'match']
provenance ev_02
overwrite False`,
      },
      callout: {
        type: "warning",
        title: "UPDATE destruye historia",
        content:
          "Para CP-N3-A, las decisiones son append-only o versionadas. Upsert de atributos de entidad es otra historia: no es lo mismo que borrar un label pasado.",
      },
    },
    {
      heading: "CTEs, windows y anti-joins",
      subtopicId: "S29-T2-A",
      paragraphs: [
        "Una **CTE** (`WITH nombre AS (… )`) nombra un paso intermedio: candidatos filtrados, scores ordenados. Las **window functions** (`ROW_NUMBER() OVER (ORDER BY score DESC)` o `PARTITION BY block_key ORDER BY score DESC`) asignan rango **sin colapsar filas** como haría un `GROUP BY`. `PARTITION BY` reinicia el contador por cubeta de blocking: “top-1 por bloque”.",
        "Un **anti-join** responde “pares sin decisión” o “entidades sin par”: `NOT EXISTS (SELECT 1 FROM decisions d WHERE d.pair_id = p.id)` o `LEFT JOIN … WHERE d.pair_id IS NULL`. `NOT IN` con NULLs en el subconjunto es una trampa clásica; prefiere `NOT EXISTS`.",
        "En la cola de review del ER, combinas ranking + anti-join: “top scores que aún no tienen label humano”. El lab lista `p2` y `p3` (tienen score, no tienen decisión), deja fuera a `p1`, e imprime el top-1 por `block_key` con `PARTITION BY`. En We Do practicarás anti-join (E1), `ROW_NUMBER` global (E2) y top-1 particionado por bloque (E3) — el mismo patrón del mini-lab, con un DEFECT cada vez.",
      ],
      code: {
        language: 'python',
        title: "cte_window_anti.py",
        code: `def s29_th_3():
    import sqlite3
    con = sqlite3.connect(":memory:")
    con.executescript('''
    CREATE TABLE pairs(id TEXT, score REAL, block_key TEXT);
    CREATE TABLE decisions(pair_id TEXT);
    INSERT INTO pairs VALUES
      ('p1',0.9,'A'),('p2',0.4,'A'),('p3',0.7,'B');
    INSERT INTO decisions VALUES ('p1');
    ''')
    q = '''
    WITH ranked AS (
      SELECT id, score, ROW_NUMBER() OVER (ORDER BY score DESC) AS rn
      FROM pairs
    )
    SELECT r.id FROM ranked r
    WHERE r.rn <= 3
      AND NOT EXISTS (SELECT 1 FROM decisions d WHERE d.pair_id = r.id)
    ORDER BY r.id
    '''
    top_by_block = '''
    SELECT id FROM (
      SELECT id, ROW_NUMBER() OVER (
        PARTITION BY block_key ORDER BY score DESC
      ) AS rn
      FROM pairs
    ) WHERE rn = 1
    ORDER BY id
    '''
    print("pending_review", [r[0] for r in con.execute(q)])
    print("top_block", [r[0] for r in con.execute(top_by_block)])
    print("antijoin", True)
s29_th_3()
`,
        output: `pending_review ['p2', 'p3']
top_block ['p1', 'p3']
antijoin True`,
      },
      callout: {
        type: "tip",
        title: "NOT EXISTS",
        content:
          "Anti-join con NOT EXISTS suele ser más claro y seguro que NOT IN cuando la subconsulta puede devolver NULL.",
      },
    },
    {
      heading: "Cardinalidad, NULL y planes",
      subtopicId: "S29-T2-B",
      paragraphs: [
        "**Cardinalidad** de un join define explosión de pares: sin *blocking* el producto cartesiano es inviable. Con n = 10 000 entidades: n² ≈ 100 millones de filas; n(n−1) ≈ 99,99 millones (sin diagonal, ambos sentidos); y C(n,2) ≈ 50 millones con orden canónico `a.id < b.id`. En producción, las cubetas de *blocking* reducen aún más. Estima filas **antes** de correr el join sobre nombres o bloques.",
        "**NULL en SQL no es Python None.** En SQL, `NULL = NULL` es desconocido (no TRUE): usa `IS NULL` / `IS NOT NULL`. `COUNT(*)` cuenta filas; `COUNT(col)` ignora NULL. Un join mal escrito multiplica filas (fan-out) e infla la cola de candidatos; filas con clave NULL no se emparejan entre sí por igualdad.",
        "**Planes**: `EXPLAIN QUERY PLAN` en SQLite muestra SCAN (recorrido completo) vs SEARCH/INDEX (uso de índice). No adivines “ya tengo índice”: pide el plan, léelo y decide si falta un índice en `block_key`, `pair_id` o `score`. El mini-lab imprime conteos y el número de filas del plan para que el hábito sea observable.",
      ],
      code: {
        language: 'python',
        title: "card_null_plan.py",
        code: `def s29_th_4():
    import sqlite3
    con = sqlite3.connect(":memory:")
    con.execute("CREATE TABLE e(id INTEGER, grp TEXT)")
    con.executemany(
        "INSERT INTO e VALUES (?,?)", [(1, "a"), (2, "a"), (3, None)]
    )
    n = con.execute("SELECT COUNT(*) FROM e").fetchone()[0]
    n_grp = con.execute("SELECT COUNT(grp) FROM e").fetchone()[0]
    pairs = con.execute(
        "SELECT COUNT(*) FROM e a JOIN e b ON a.grp = b.grp AND a.id < b.id"
    ).fetchone()[0]
    plan = con.execute(
        "EXPLAIN QUERY PLAN SELECT * FROM e WHERE id = 1"
    ).fetchall()
    print("count_star", n)
    print("count_grp", n_grp)
    print("pairs_card", pairs)
    print("plan_rows", len(plan))
s29_th_4()
`,
        output: `count_star 3
count_grp 2
pairs_card 1
plan_rows 1`,
      },
      callout: {
        type: "warning",
        title: "NULL en join",
        content:
          "NULL=NULL es desconocido: filas con grp NULL no coinciden entre sí por igualdad. Por eso pairs_card ignora el id=3.",
      },
    },
    {
      heading: "ACID y transacciones en el lab",
      subtopicId: "S29-T3-A",
      paragraphs: [
        "**ACID** resume cuatro promesas del motor. **Atomicity**: todo o nada. **Consistency**: la transacción lleva el sistema de un estado válido a otro (invariantes de negocio y constraints); en SQLite las FK suelen fallar al finalizar la sentencia, no solo al `COMMIT`, salvo que estén diferidas. **Isolation**: las transacciones concurrentes no se pisan a ciegas. **Durability**: lo confirmado con `COMMIT` sobrevive al crash del proceso, con matices de disco/WAL. En el almacén ER, **decisión + evidencia** deben confirmarse en la misma transacción o no ejecutarse: una decisión huérfana es basura de auditoría.",
        "En este lab usamos una sola conexión SQLite y demostramos **atomicidad** con `BEGIN` → insert de decisión → fallo simulado → `ROLLBACK`: ambas tablas quedan en 0. Eso es el contrato mínimo de CP-N3-A. Niveles de isolation avanzados (`READ COMMITTED`, `SERIALIZABLE`) y `BEGIN IMMEDIATE` importan con **varias conexiones concurrentes**. No los damos por dominados solo porque aparecen en un glosario: se profundizan cuando el escenario de concurrencia está en el ejercicio. Aquí el foco es atomicidad, no isolation multi-conexión (eso se retoma en S38).",
        "Regla operativa: si falla escribir evidencia, no dejes una decisión huérfana. El mini-lab fuerza el fallo, hace ROLLBACK y comprueba `atomic True` cuando decisions y evidence están en cero. Llévalo a We Do: el mismo patrón con un flag `evidence_ok`.",
      ],
      code: {
        language: 'python',
        title: "acid_rollback.py",
        code: `def s29_th_5():
    import sqlite3
    con = sqlite3.connect(":memory:")
    con.execute(
        "CREATE TABLE decisions(id INTEGER PRIMARY KEY, pair_id TEXT, label TEXT)"
    )
    con.execute(
        "CREATE TABLE evidence(id INTEGER PRIMARY KEY, pair_id TEXT, note TEXT)"
    )
    try:
        con.execute("BEGIN")
        con.execute(
            "INSERT INTO decisions(pair_id,label) VALUES ('p1','match')"
        )
        # simula fallo de evidencia
        raise RuntimeError("evidence write failed")
        con.execute(
            "INSERT INTO evidence(pair_id,note) VALUES ('p1','ok')"
        )
        con.execute("COMMIT")
    except RuntimeError:
        con.execute("ROLLBACK")
    n_d = con.execute("SELECT COUNT(*) FROM decisions").fetchone()[0]
    n_e = con.execute("SELECT COUNT(*) FROM evidence").fetchone()[0]
    print("decisions", n_d)
    print("evidence", n_e)
    print("atomic", n_d == 0 and n_e == 0)
s29_th_5()
`,
        output: `decisions 0
evidence 0
atomic True`,
      },
      callout: {
        type: "tip",
        title: "Misma transacción",
        content:
          "Decisión sin evidencia o viceversa rompe el almacén de verdad. ROLLBACK es tu red de seguridad en el lab.",
      },
    },
    {
      heading: "Upserts, reintentos y recuperación",
      subtopicId: "S29-T3-B",
      paragraphs: [
        "Un **upsert** (`INSERT … ON CONFLICT DO UPDATE`) actualiza atributos mutables de una entidad (`name`, `updated`) sin cambiar el id estable. Es el patrón correcto para re-ingestar un registro fuente cuando el CRM reenvía el mismo `external_id`; **no** reemplaza el append-only de decisions ni borra labels pasados.",
        "Reintentos e integridad del par: dos workers no deben crear el mismo par como (e1,e2) y (e2,e1). Combina `CHECK(entity_a < entity_b)`, `UNIQUE(entity_a, entity_b)` y reintento si `IntegrityError` por conflicto. Tras un crash, un job puede volver a `pending` y reaplicarse de forma idempotente. Contención real multi-conexión (`SQLITE_BUSY`, `BEGIN IMMEDIATE`) se profundiza en S38; aquí el lab es de una sola conexión.",
        "El mini-lab hace upsert de `Ana` → `Ana López` y deja `updated=2`. Las decisiones del par no se tocan aquí a propósito: son otra tabla, otra política. Si necesitas “corregir” un label, insertas una decisión nueva (T1-B), no sobrescribes la fila del upsert de entidad.",
      ],
      code: {
        language: 'python',
        title: "upsert_recover.py",
        code: `def s29_th_6():
    import sqlite3
    con = sqlite3.connect(":memory:")
    con.execute(
        "CREATE TABLE entities(id TEXT PRIMARY KEY, name TEXT, updated INTEGER)"
    )
    con.execute("INSERT INTO entities VALUES ('e1','Ana',1)")
    con.execute(
        '''INSERT INTO entities(id,name,updated) VALUES ('e1','Ana López',2)
           ON CONFLICT(id) DO UPDATE SET
             name=excluded.name, updated=excluded.updated'''
    )
    row = con.execute(
        "SELECT name, updated FROM entities WHERE id='e1'"
    ).fetchone()
    print("name", row[0])
    print("updated", row[1])
    print("upsert", True)
s29_th_6()
`,
        output: `name Ana López
updated 2
upsert True`,
      },
      callout: {
        type: "info",
        title: "Upsert ≠ borrar historia de decisiones",
        content:
          "Puedes upsert atributos de entidad; las decisiones siguen append-only.",
      },
    },
    {
      heading: "Índices y migraciones",
      subtopicId: "S29-T4-A",
      paragraphs: [
        "Índices en FK y columnas de filtro (`score`, `status`, `block_key`) bajan latencia de colas y *blocking*. Un índice no es magia: acelera lecturas filtradas y puede ralentizar escrituras masivas. Mide con `EXPLAIN QUERY PLAN` antes y después; si el plan sigue en SCAN, el índice no está ayudando a esa consulta. El texto del plan es diagnóstico (puede variar entre versiones): combínalo con `PRAGMA index_list` para comprobar existencia.",
        "**Migraciones** versionadas: expand (añadir columna/índice) → backfill → contract (retirar lo viejo). Tabla `schema_migrations(version, name)` registra qué ya corrió y en qué orden. Política de lab y producción: **no_drop_without_backup** — un `DROP TABLE pairs` sin respaldo no es “agilidad”, es pérdida de evidencia del ER.",
        "El mini-lab crea `idx_pairs_block`, registra la migración 1 y comprueba que el plan menciona índice al filtrar por `block_key`. En We Do practicarás crear el índice, leerlo en `sqlite_master` y rechazar un DROP sin backup.",
      ],
      code: {
        language: 'python',
        title: "indexes_migrate.py",
        code: `def s29_th_7():
    import sqlite3
    con = sqlite3.connect(":memory:")
    con.executescript('''
    CREATE TABLE schema_migrations(version INTEGER PRIMARY KEY, name TEXT);
    CREATE TABLE pairs(id TEXT PRIMARY KEY, block_key TEXT, score REAL);
    CREATE INDEX idx_pairs_block ON pairs(block_key);
    INSERT INTO schema_migrations VALUES (1, 'init_pairs');
    INSERT INTO pairs VALUES ('p1','BLOQ|ANA',0.8);
    ''')
    plan = "\\n".join(
        str(r)
        for r in con.execute(
            "EXPLAIN QUERY PLAN SELECT * FROM pairs WHERE block_key='BLOQ|ANA'"
        )
    )
    print(
        "migration",
        con.execute("SELECT MAX(version) FROM schema_migrations").fetchone()[0],
    )
    print(
        "uses_index",
        "idx_pairs_block" in plan
        or "USING INDEX" in plan.upper()
        or "INDEX" in plan.upper(),
    )
    print("n", con.execute("SELECT COUNT(*) FROM pairs").fetchone()[0])
s29_th_7()
`,
        output: `migration 1
uses_index True
n 1`,
      },
      callout: {
        type: "warning",
        title: "Índice no es magia",
        content:
          "Demasiados índices ralentizan las escrituras; mide con EXPLAIN y versiona cada cambio en schema_migrations.",
      },
    },
    {
      heading: "Repository pattern, pooling y pruebas",
      subtopicId: "S29-T4-B",
      paragraphs: [
        "El **repository** (*repositorio*) encapsula SQL: `get_entity`, `insert_decision`, `pending`. La lógica de matching y de scoring no arma SQL crudo por todos lados: pide intenciones (`pending()`) y el repo traduce a anti-join con `NOT EXISTS` (no `NOT IN` si la subconsulta puede devolver NULL). Inyectas la conexión (o un *factory*) para poder testear con `:memory:` sin un servidor real.",
        "**Pooling** (reuso de conexiones) aparece en servidores multi-request. En SQLite didáctico suele bastar una conexión por hilo; el “pool_size” corporativo aparece cuando el almacén vive detrás de un driver de red. No hardcodes un número mágico: documenta el ciclo open → `PRAGMA foreign_keys=ON` → close, y el timeout de acquire cuando uses un pool real.",
        "Prueba el repository con inserts, constraints violados (`IntegrityError` ruidoso), anti-join de la cola de review y append-only de decisions. Caso sintético Red Andina: ids `ent-00N`, correos `@example.pe`, `run_id=cpn3a-sql`. El You Do cierra el circuito con un `PairRepository` a completar.",
      ],
      code: {
        language: 'python',
        title: "repo_pool_tests.py",
        code: `def s29_th_8():
    import sqlite3

    class PairRepo:
        def __init__(self, con):
            self.con = con
        def add_pair(self, pid, a, b, score):
            self.con.execute(
                "INSERT INTO pairs(id,entity_a,entity_b,score) VALUES (?,?,?,?)",
                (pid, a, b, score),
            )
        def pending(self):
            return self.con.execute(
                """
                SELECT p.id FROM pairs p
                WHERE NOT EXISTS (
                  SELECT 1 FROM decisions d WHERE d.pair_id = p.id
                )
                ORDER BY p.id
                """
            ).fetchall()

    con = sqlite3.connect(":memory:")
    con.executescript('''
    CREATE TABLE pairs(
      id TEXT PRIMARY KEY, entity_a TEXT, entity_b TEXT, score REAL
    );
    CREATE TABLE decisions(pair_id TEXT NOT NULL);
    ''')
    repo = PairRepo(con)
    repo.add_pair("p1", "e1", "e2", 0.7)
    print("pending", [r[0] for r in repo.pending()])
    print("pattern", "repository")
    print("test_db", ":memory:")
s29_th_8()
`,
        output: `pending ['p1']
pattern repository
test_db :memory:`,
      },
      callout: {
        type: "tip",
        title: "Repo testeable",
        content:
          "Inyecta la conexión; en tests usa :memory: o un archivo temporal. Assert sobre pending y constraints, no solo sobre prints.",
      },
    },
  ],
  iDo: {
    intro:
      "Observa ocho demos del almacén ER en SQLite `:memory:`. Cada una imprime el resultado que el código realmente calcula: claves con FK y CHECK; historia append-only; CTE + anti-join de cola; COUNT y cardinalidad; ROLLBACK atómico; upsert de entidad; migration + índice con plan; y `Repo.pending()`. Antes de copiar, predice la salida; después, contrasta con la mostrada y pregunta qué fallaría sin el constraint o el PRAGMA. Luego pasa a We Do.",
    steps: [
      {
        demoId: "S29-T1-A-DEMO",
        subtopicId: "S29-T1-A",
        environment: "local-python",
        description:
          "Crea entities y candidate_pairs con CHECK de score, orden entity_a < entity_b y PRAGMA foreign_keys; imprime count de pares y score del par p1.",
        preamble:
          "Antes de armar la cola de review del ER, el almacén debe rechazar basura en el insert. En esta demo creas `entities` y `candidate_pairs` con score entre 0 y 1, orden canónico `entity_a < entity_b` y `PRAGMA foreign_keys = ON`. No escribas aún: predice el `score` del par `p1`, el conteo de pares y el valor del PRAGMA; luego contrasta con la salida. Si el PRAGMA queda en 0, el `REFERENCES` es solo decoración y el almacén miente.",
        code: {
          language: 'python',
          title: "keys_demo.py",
          code: `import sqlite3

c = sqlite3.connect(":memory:")
c.execute("PRAGMA foreign_keys = ON")
c.executescript(
    """
    create table entities(id text primary key, name text not null);
    create table candidate_pairs(
      id text primary key,
      entity_a text not null references entities(id),
      entity_b text not null references entities(id),
      score real not null check(score >= 0 and score <= 1),
      check(entity_a < entity_b)
    );
    insert into entities values ('e1','Ana'), ('e2','Ana Lopez');
    insert into candidate_pairs values ('p1','e1','e2',0.5);
    """
)
n = c.execute("select count(*) from candidate_pairs").fetchone()[0]
score = c.execute(
    "select score from candidate_pairs where id='p1'"
).fetchone()[0]
print(score)
print("pairs", n)
print("fk_pragma", c.execute("PRAGMA foreign_keys").fetchone()[0])
`,
          output: `0.5
pairs 1
fk_pragma 1`,
        },
        why: "Constraints y FK habilitadas (PRAGMA=1) protegen el almacén ER desde el primer insert. Sin el PRAGMA, un `entity_id` fantasma se inserta sin error: el REFERENCES es solo documentación. El CHECK de score impide confianza inventada fuera de [0, 1]; el orden A<B evita el espejo del mismo candidato. En We Do practicarás PRIMARY KEY, rechazo de score inválido y FK real con par huérfano.",
        retrospective:
          "Si puedes explicar por qué `PRAGMA foreign_keys` debe ejecutarse en *cada* conexión antes de confiar en REFERENCES, ya tienes el hábito de integridad del lab. El error clásico es asumir que el DDL solo basta. En We Do practicarás PK, CHECK y rechazo de FK rota.",
      },
      {
        demoId: "S29-T1-B-DEMO",
        subtopicId: "S29-T1-B",
        environment: "local-python",
        description:
          "Inserta dos decisiones append-only para el mismo par y lista labels en orden de id.",
        preamble:
          "En el almacén ER, “quién cambió de review a match y cuándo” es requisito de auditoría, no un detalle cosmético. Esta demo inserta dos filas de decisión para el mismo `pair_id` y lista los labels en orden. No escribas: predice la lista y el booleano `append_only`; luego contrasta. Si en su lugar hicieras UPDATE del label, el martes desaparece de la historia.",
        code: {
          language: 'python',
          title: "prov_demo.py",
          code: `import sqlite3

c = sqlite3.connect(":memory:")
c.execute(
    "create table decisions(id integer primary key, pair_id text, label text)"
)
c.execute(
    "insert into decisions(pair_id,label) values ('p1','review')"
)
c.execute(
    "insert into decisions(pair_id,label) values ('p1','match')"
)
labels = [
    r[0]
    for r in c.execute(
        "select label from decisions where pair_id='p1' order by id"
    )
]
print(labels)
print("append_only", True)
`,
          output: `['review', 'match']
append_only True`,
        },
        why: "Historia de decisiones sin overwrite: dos filas, no un UPDATE destructivo del label. Cada cambio conserva el rastro de actor y evidence_ref por fila; puedes reconstruir qué veía el revisor el martes. En We Do practicarás COUNT de historia, dict de provenance y ventana abierta con `valid_to IS NULL`.",
        retrospective:
          "Append-only = nueva fila por cambio de label, no un UPDATE del valor. El error clásico es “arreglar” el martes y borrar el rastro de auditoría. Pregunta: con dos INSERT, ¿qué lista verías si ordenas por `id`? We Do: COUNT de historia, provenance source/record y ventana `valid_to IS NULL`.",
      },
      {
        demoId: "S29-T2-A-DEMO",
        subtopicId: "S29-T2-A",
        environment: "local-python",
        description:
          "CTE de candidatos + anti-join (LEFT JOIN … IS NULL): lista ids de pares sin decisión (cola de review).",
        preamble:
          "La cola de review del ER no son los pares ya decididos: son los que aún no tienen label humano. En esta demo una CTE nombra los candidatos y un anti-join (LEFT JOIN … IS NULL) deja solo `p2`. No escribas: predice la lista; luego imagina qué devolvería un INNER JOIN (solo `p1`). Observa también los flags `cte` y `antijoin`.",
        code: {
          language: 'python',
          title: "cte_demo.py",
          code: `import sqlite3

c = sqlite3.connect(":memory:")
c.executescript(
    """
    create table pairs(id text, score real);
    create table dec(pair_id text);
    insert into pairs values ('p1',0.9),('p2',0.4);
    insert into dec values ('p1');
    """
)
q = """
with candidatos as (
  select id, score from pairs
)
select c.id from candidatos c
left join dec d on d.pair_id = c.id
where d.pair_id is null
order by c.id
"""
print([r[0] for r in c.execute(q)])
print("cte", True)
print("antijoin", True)
`,
          output: `['p2']
cte True
antijoin True`,
        },
        why: "Cola de review: la CTE nombra el paso intermedio; el anti-join seguro (LEFT JOIN … IS NULL o NOT EXISTS) deja solo pendientes. INNER JOIN solo devuelve ya decididos — no es la cola. Prefiere NOT EXISTS frente a NOT IN con NULL. En We Do practicarás anti-join, top-1 global con ROW_NUMBER y top-1 por bloque con PARTITION BY.",
        retrospective:
          "Cola de review = anti-join, no INNER: INNER solo devuelve ya decididos. El error clásico es “unir y ver lo resuelto” pensando que eso es la cola. Pregunta: con p1 decidido y p2 libre, ¿qué lista da INNER y cuál anti-join? We Do: NOT EXISTS, ROW_NUMBER global y PARTITION BY block_key.",
      },
      {
        demoId: "S29-T2-B-DEMO",
        subtopicId: "S29-T2-B",
        environment: "local-python",
        description:
          "COUNT(*) vs. COUNT(col) y cardinalidad de self-join sobre grp (NULL no empareja).",
        preamble:
          "Antes de unir entidades por un atributo, estima filas y entiende NULL. En esta demo hay tres filas (`grp` a, a, NULL): `COUNT(*)` cuenta filas, `COUNT(grp)` ignora NULL, y el self-join con `a.grp = b.grp` y `a.id < b.id` produce un solo par. No escribas: predice `star`, `col` y `pairs`; luego contrasta. La fila con `grp` NULL no se empareja consigo misma.",
        code: {
          language: 'python',
          title: "card_demo.py",
          code: `import sqlite3

c = sqlite3.connect(":memory:")
c.execute("create table e(id integer, grp text)")
c.executemany(
    "insert into e values (?,?)", [(1, "a"), (2, "a"), (3, None)]
)
star = c.execute("select count(*) from e").fetchone()[0]
col = c.execute("select count(grp) from e").fetchone()[0]
pairs = c.execute(
    """
    select count(*) from e a
    join e b on a.grp = b.grp and a.id < b.id
    """
).fetchone()[0]
print("star", star)
print("col", col)
print("pairs", pairs)
`,
          output: `star 3
col 2
pairs 1`,
        },
        why: "NULL y cardinalidad evitan sorpresas de fan-out en el almacén. COUNT(col) ignora NULL; COUNT(*) no. La igualdad SQL no une filas con grp NULL (NULL=NULL no es TRUE). En We Do practicarás C(n,2) con a.id < b.id, predicado IS NULL y lectura de EXPLAIN SCAN.",
        retrospective:
          "Si puedes explicar por qué `pairs` es 1 y no 3, ya respetas NULL en joins. El error clásico es asumir n×n o que NULL=NULL es TRUE. We Do: cardinalidad canónica, IS NULL y planes.",
      },
      {
        demoId: "S29-T3-A-DEMO",
        subtopicId: "S29-T3-A",
        environment: "local-python",
        description:
          "Transacción con ROLLBACK deja decisions y evidence en 0 filas (atomicidad).",
        preamble:
          "En el almacén de verdad, una decisión sin evidencia es basura de auditoría. Esta demo abre transacción, inserta en `decisions`, fuerza un fallo antes de `evidence` y hace ROLLBACK. No escribas: predice los dos counts y el booleano `acid`; luego contrasta. Si hubiera COMMIT parcial, quedaría una decisión huérfana.",
        code: {
          language: 'python',
          title: "acid_demo.py",
          code: `import sqlite3

c = sqlite3.connect(":memory:")
c.executescript(
    "create table decisions(x int); create table evidence(x int);"
)
try:
    c.execute("begin")
    c.execute("insert into decisions values (1)")
    raise RuntimeError("boom")
    c.execute("insert into evidence values (1)")
    c.execute("commit")
except RuntimeError:
    c.execute("rollback")
n_d = c.execute("select count(*) from decisions").fetchone()[0]
n_e = c.execute("select count(*) from evidence").fetchone()[0]
print(n_d, n_e)
print("acid", n_d == 0 and n_e == 0)
`,
          output: `0 0
acid True`,
        },
        why: "Atomicidad decisión+evidencia: si falla el segundo write, no queda basura en la primera tabla. El lab enfoca atomicidad en una conexión; isolation multi-conexión se retoma en S38. En We Do practicarás ROLLBACK simple, ambos counts en 0 y la política `evidence_ok`.",
        retrospective:
          "ROLLBACK es la red de seguridad: todo o nada en decisión+evidencia. El error clásico es commitear la decisión “y la evidencia después” — basura de auditoría. Pregunta: si el raise ocurre *después* del insert de evidence, ¿qué counts quedarían sin ROLLBACK? We Do: rollback simple, atomicidad y abort por flag.",
      },
      {
        demoId: "S29-T3-B-DEMO",
        subtopicId: "S29-T3-B",
        environment: "local-python",
        description:
          "Upsert actualiza name de entidad e1 a 'Ana L' y lo imprime.",
        preamble:
          "Re-ingerir el mismo `external_id` del CRM no debe crear otra entidad ni borrar labels pasados. En esta demo un upsert actualiza el `name` de `e1` a `Ana L` y lo imprime. No escribas: predice el name final y el flag `upsert`; luego contrasta. Observa que no hay tabla de decisions en el demo: a propósito, para no confundir políticas.",
        code: {
          language: 'python',
          title: "upsert_demo.py",
          code: `import sqlite3

def upsert_name(eid, name):
    c = sqlite3.connect(":memory:")
    c.execute("create table e(id text primary key, name text)")
    c.execute("insert into e values (?,?)", (eid, "old"))
    c.execute(
        """
        insert into e(id,name) values (?,?)
        on conflict(id) do update set name=excluded.name
        """,
        (eid, name),
    )
    return c.execute(
        "select name from e where id=?", (eid,)
    ).fetchone()[0]

print(upsert_name("e1", "Ana L"))
print("upsert", True)
`,
          output: `Ana L
upsert True`,
        },
        why: "Upsert de atributos con id estable: ON CONFLICT DO UPDATE reescribe el name mutable y conserva la PK. No toca la historia de decisiones — eso es otra política (append-only). En We Do practicarás name final B, job `pending` tras crash y orden canónico A<B con rechazo del espejo.",
        retrospective:
          "Upsert reescribe atributos mutables y conserva el id. El error clásico es tratar el upsert de entidad como “corregir” un label de decisión. We Do: upsert, recuperación de job y CHECK de orden.",
      },
      {
        demoId: "S29-T4-A-DEMO",
        subtopicId: "S29-T4-A",
        environment: "local-python",
        description:
          "Migration v1 + índice en block_key; imprime version y si el plan usa índice.",
        preamble:
          "Evolucionar el esquema del almacén sin rastro es tan peligroso como un DROP sin backup. En esta demo registras la migration v1, creas índice en `block_key` y lees si el plan menciona índice. No escribas: predice `version` e `indexed`; luego contrasta con la salida. El texto del plan es diagnóstico, no magia.",
        code: {
          language: 'python',
          title: "mig_demo.py",
          code: `import sqlite3

c = sqlite3.connect(":memory:")
c.executescript(
    """
    create table schema_migrations(v int primary key, name text);
    create table pairs(id text primary key, block_key text);
    create index idx_pairs_block on pairs(block_key);
    insert into schema_migrations values (1, 'init');
    insert into pairs values ('p1','K');
    """
)
version = c.execute(
    "select max(v) from schema_migrations"
).fetchone()[0]
plan = "\\n".join(
    str(r)
    for r in c.execute(
        "explain query plan select * from pairs where block_key='K'"
    )
)
indexed = (
    "idx_pairs_block" in plan
    or "INDEX" in plan.upper()
)
print(version)
print("indexed", indexed)
`,
          output: `1
indexed True`,
        },
        why: "Evolución versionada en `schema_migrations` y evidencia del índice en EXPLAIN: no adivines “ya hay índice”. MAX(v) dice hasta qué versión llegó el esquema; el plan confirma si el filtro por block_key usa el objeto. En We Do practicarás MAX(version), CREATE INDEX real y la política no_drop_without_backup.",
        retrospective:
          "Versionar en `schema_migrations` y pedir el plan es el hábito de evolución segura. El error clásico es crear el índice y no mirar EXPLAIN (o imprimir “indexed” de memoria). Pregunta: si `MAX(v)` devuelve 1 y el plan no menciona INDEX, ¿qué falló primero? We Do: MAX(v), sqlite_master y guard de DROP.",
      },
      {
        demoId: "S29-T4-B-DEMO",
        subtopicId: "S29-T4-B",
        environment: "local-python",
        description:
          "Repository.pending() lista pares sin decisión (anti-join encapsulado).",
        preamble:
          "El matching y el scoring no deben armar SQL crudo por toda la app: piden intenciones como `pending()`. En esta demo un repository encapsula el anti-join y devuelve solo el par sin decisión. No escribas: predice la lista de filas y el flag `repo`; luego contrasta. Observa que el SQL vive *dentro* del método.",
        code: {
          language: 'python',
          title: "repo_demo.py",
          code: `import sqlite3

class Repo:
    def __init__(self, c):
        self.c = c
    def pending(self):
        return self.c.execute(
            """
            select p.id from pairs p
            left join decisions d on d.pair_id = p.id
            where d.pair_id is null
            order by p.id
            """
        ).fetchall()

c = sqlite3.connect(":memory:")
c.executescript(
    """
    create table pairs(id text primary key);
    create table decisions(pair_id text);
    insert into pairs values ('p1'),('p2');
    insert into decisions values ('p1');
    """
)
print(Repo(c).pending())
print("repo", True)
`,
          output: `[('p2',)]
repo True`,
        },
        why: "SQL encapsulado y testeable: la app pide `pending()`; el repo traduce a anti-join seguro (LEFT JOIN / NOT EXISTS), no NOT IN frágil. Inyectas la conexión para tests en `:memory:`. En We Do practicarás `get(id)`, ciclo de conexiones con PRAGMA y `pending_count` real.",
        retrospective:
          "La app pide `pending()`; el repo traduce a anti-join. El error clásico es esparcir SQL y usar NOT IN con NULL. We Do: get, ciclo open→pragma→close y count de pendientes.",
      },
    ],
  },
  weDo: {
    intro:
      "24 ejercicios (E1 guiado · E2 independiente · E3 transferencia) sobre modelo, consulta, transacciones y evolución del almacén ER. Fixture **CASO-LIM-029** (`run_id=cpn3a-sql`, correos `@example.pe`): solo datos sintéticos; *match* no es fraude ni parentesco. Cada `starter` declara un `DEFECT` intencional: aplica el arreglo mínimo y haz que tu salida coincida con la salida esperada de la solución — sin reescribir el ejercicio desde cero. Prioriza E1 (núcleo); usa E2 para consolidar y E3 como extensión.",
    steps: [
      {
        id: "S29-T1-A-E1",
        subtopicId: "S29-T1-A",
        kind: "guided",
        title: "PRIMARY KEY en entities (sin duplicar e1)",
        preamble:
          "- **Contexto:** en el almacén ER de CP-N3-A, cada entidad canónica tiene un id estable; dos filas con el mismo id no son “dos vistas”, son corrupción de identidad.\n- **Meta:** declarar `PRIMARY KEY` en `entities(id)` y dejar un solo insert válido.\n- **Éxito:** una sola línea con el entero `1`.\n- **Límites:** no dejes el segundo insert; no imprimas etiquetas extra; SQLite `:memory:` de lab.",
        instruction:
          "1. Abre el starter: tabla sin PK e insert duplicado de `'e1'` (count 2).\n2. Añade `primary key` en la columna `id`.\n3. Deja un solo `INSERT` de `'e1'`.\n4. Imprime solo `COUNT(*)`.",
        hint: "PRIMARY KEY impide el segundo insert",
        hints: [
          "PRIMARY KEY en id",
          "un solo INSERT de e1",
          "print del COUNT(*)",
        ],
        edgeCases: ["IntegrityError si reinsertas el mismo id con PK"],
        tests: "salida coincide con solution output",
        feedback:
          "Con PRIMARY KEY el motor rechaza el duplicado. Un solo `e1` y COUNT(*) = 1 es el contrato mínimo de identidad: sin id único, joins y decisiones apuntan a filas ambiguas.",
        retrospective:
          "La PK es el ancla de todo el grafo ER. El error clásico es insertar “otra vez por si acaso” sin constraint. Siguiente (E2): CHECK de score fuera de [0, 1].",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-029 · PK entities
# DEFECT: falta PRIMARY KEY; el segundo insert no falla y el count es 2
import sqlite3
c = sqlite3.connect(':memory:')
c.execute('create table entities(id text)')
c.execute("insert into entities values ('e1')")
c.execute("insert into entities values ('e1')")
print(c.execute('select count(*) from entities').fetchone()[0])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import sqlite3
c = sqlite3.connect(':memory:')
c.execute('create table entities(id text primary key)')
c.execute("insert into entities values ('e1')")
print(c.execute('select count(*) from entities').fetchone()[0])
`,
          output: `1`,
        },
      },
      {
        id: "S29-T1-A-E2",
        subtopicId: "S29-T1-A",
        kind: "independent",
        title: "CHECK score 0..1 y bad_score",
        preamble:
          "- **Contexto:** la cola de candidatos del ER no debe arrastrar un score de 1.5 como si fuera confianza real.\n- **Meta:** forzar un insert inválido, capturar `IntegrityError` e imprimir `bad_score`.\n- **Éxito:** una línea exacta `bad_score`.\n- **Límites:** CHECK `BETWEEN 0 AND 1` (0 y 1 son válidos); no silencies el error sin imprimir; no uses un score inventado “arreglado”.",
        instruction:
          "1. Revisa el starter: imprime `skipped_check` sin probar el CHECK.\n2. Intenta `INSERT` de `1.5` en `p(score)`.\n3. En el `except IntegrityError`, imprime `bad_score`.\n4. No alteres el rango del CHECK.",
        hint: "try/except IntegrityError",
        hints: [
          "CHECK score 0..1",
          "insert 1.5",
          "print('bad_score') en except",
        ],
        edgeCases: ["between inclusive: 0 y 1 son válidos"],
        tests: "salida coincide con solution output",
        feedback:
          "El CHECK no es documentación: un score fuera de [0, 1] debe fallar con IntegrityError. Así la cola de candidatos no arrastra confianza inventada.",
        retrospective:
          "Validar el score en el motor (CHECK + IntegrityError) no es lo mismo que confiar en un guard de Python: alguien puede escribir SQL directo y meter basura en la cola. El error clásico es “arreglar” el insert a 1.0 en silencio. Pregunta: ¿0 y 1 son válidos con `BETWEEN 0 AND 1`? Luego (E3): FK real con PRAGMA.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-029 · CHECK score 0..1
# DEFECT: no intenta el insert inválido
import sqlite3
c = sqlite3.connect(':memory:')
c.execute('create table p(score real check(score between 0 and 1))')
print('skipped_check')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import sqlite3
c = sqlite3.connect(':memory:')
c.execute('create table p(score real check(score between 0 and 1))')
try:
    c.execute('insert into p values (1.5)')
except sqlite3.IntegrityError:
    print('bad_score')
`,
          output: `bad_score`,
        },
      },
      {
        id: "S29-T1-A-E3",
        subtopicId: "S29-T1-A",
        kind: "transfer",
        title: "FK real con PRAGMA foreign_keys",
        preamble:
          "- **Contexto:** un par que apunta a `e_missing` no puede vivir en el almacén de verdad: rompe la cola y la auditoría.\n- **Meta:** habilitar FK en la conexión, intentar el insert huérfano y reportar rechazo.\n- **Éxito:** una línea `fk_rejected`.\n- **Límites:** `PRAGMA foreign_keys = ON` en *esta* conexión; no borres el `REFERENCES`; no dejes `fk_ignored`.",
        instruction:
          "1. Lee el DEFECT: falta el PRAGMA; el insert de `e_missing` “pasa”.\n2. Ejecuta `PRAGMA foreign_keys = ON` antes del `executescript` o del insert de prueba.\n3. Mantén el try/except de IntegrityError.\n4. Debe imprimirse `fk_rejected`, no `fk_ignored`.",
        hint: "Habilita FK en esta conexión *antes* del insert de prueba",
        hints: [
          "PRAGMA foreign_keys en la conexión actual, antes del insert huérfano",
          "REFERENCES entities(id) en pairs se mantiene",
          "IntegrityError del insert → print fk_rejected (no fk_ignored)",
        ],
        edgeCases: [
          "Sin PRAGMA el REFERENCES no falla en SQLite",
          "Orden canónico entity_a < entity_b se suma en el esquema completo del I Do",
        ],
        tests: "salida coincide con solution output",
        feedback:
          "En SQLite la FK solo se exige con PRAGMA foreign_keys=ON por conexión. Sin eso, un par huérfano se inserta en silencio y rompe el almacén de verdad.",
        retrospective:
          "El REFERENCES del DDL no basta: el motor solo lo aplica si el PRAGMA está ON en *esta* conexión. El error clásico es confiar en el CREATE y dejar pares huérfanos. Pregunta: ¿por qué un pool o un script nuevo vuelve a necesitar el mismo PRAGMA?",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-029 · FK real con PRAGMA
# DEFECT: no habilita foreign_keys; el par fantasma se inserta
import sqlite3
c = sqlite3.connect(':memory:')
# falta: PRAGMA foreign_keys = ON
c.executescript(
    '''
    create table entities(id text primary key);
    create table pairs(
      id text primary key,
      entity_id text not null references entities(id)
    );
    insert into entities values ('e1');
    '''
)
try:
    c.execute("insert into pairs values ('p_bad','e_missing')")
    print('fk_ignored')
except sqlite3.IntegrityError:
    print('fk_rejected')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import sqlite3
c = sqlite3.connect(':memory:')
c.execute('PRAGMA foreign_keys = ON')
c.executescript(
    '''
    create table entities(id text primary key);
    create table pairs(
      id text primary key,
      entity_id text not null references entities(id)
    );
    insert into entities values ('e1');
    '''
)
try:
    c.execute("insert into pairs values ('p_bad','e_missing')")
    print('fk_ignored')
except sqlite3.IntegrityError:
    print('fk_rejected')
`,
          output: `fk_rejected`,
        },
      },
      {
        id: "S29-T1-B-E1",
        subtopicId: "S29-T1-B",
        kind: "guided",
        title: "Append-only: review y match sin UPDATE",
        preamble:
          "- **Contexto:** un revisor sintético de Red Andina cambia `review` → `match` para el par `p1`; el almacén debe conservar ambas filas.\n- **Meta:** insertar dos labels (no sobrescribir) y contar la historia del par.\n- **Éxito:** el entero `2`.\n- **Límites:** no uses UPDATE del label; imprime solo el count, no la lista.",
        instruction:
          "1. Abre el starter: hace UPDATE y deja una fila.\n2. Reemplaza el UPDATE por un segundo INSERT con label `match`.\n3. Mantén el `COUNT(*)` filtrado por `pair='p1'`.\n4. Imprime solo el entero.",
        hint: "dos INSERT al mismo pair_id; COUNT filtrado",
        hints: [
          "append-only: dos filas, no UPDATE",
          "where pair='p1'",
          "print del count, no de la lista de labels",
        ],
        edgeCases: ["no update label in place"],
        tests: "salida coincide con solution output",
        feedback:
          "Append-only = dos INSERT, no un UPDATE del label. COUNT(*) = 2 prueba que la historia del par sigue viva para auditoría.",
        retrospective:
          "COUNT=2 no es “más datos”: es prueba de que el revisor puede reconstruir el camino review→match. El error clásico es UPDATE “limpio” que deja una sola fila y borra el martes. Pregunta: si mañana cambian a non_match, ¿cuántas filas deberían quedar? Siguiente (E2): provenance source/record leída de tabla.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-029 · labels de decisión append-only
# DEFECT: hace UPDATE del label (borra historia) y cuenta 1 fila
import sqlite3
c = sqlite3.connect(':memory:')
c.execute('create table d(pair text, label text)')
c.execute("insert into d values ('p1','review')")
c.execute("update d set label='match' where pair='p1'")
print(c.execute("select count(*) from d where pair='p1'").fetchone()[0])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import sqlite3
c = sqlite3.connect(':memory:')
c.execute('create table d(pair text, label text)')
c.execute("insert into d values ('p1','review')")
c.execute("insert into d values ('p1','match')")
print(c.execute("select count(*) from d where pair='p1'").fetchone()[0])
`,
          output: `2`,
        },
      },
      {
        id: "S29-T1-B-E2",
        subtopicId: "S29-T1-B",
        kind: "independent",
        title: "Provenance mínima source y record",
        preamble:
          "- **Contexto:** un match sin rastro al CRM sintético es una opinión: no sabes qué payload alimentó el par.\n- **Meta:** leer `source` y `record` de la tabla e imprimir el dict completo.\n- **Éxito:** `{'source': 'crm_synth', 'record': 'r9'}` (orden de keys como en la solución).\n- **Límites:** no inventes el dict a medias; no omitas `record`; datos sintéticos del fixture.",
        instruction:
          "1. Revisa el starter: imprime solo `{'source': ...}`.\n2. Incluye `'record': row[1]` en el dict.\n3. Imprime el dict completo.\n4. No hardcodes el record si la fila ya lo tiene.",
        hint: "INSERT + SELECT → dict",
        hints: [
          "insert source y record",
          "arma el dict desde la fila",
        ],
        edgeCases: ["ingested_at se puede añadir después"],
        tests: "salida coincide con solution output",
        feedback:
          "Provenance mínima es source + record leídos de la tabla, no un dict a medias. Sin record no hay rastro al payload fuente.",
        retrospective:
          "Un match sin `record` es una opinión: no sabes qué payload del CRM sintético alimentó el par. El error clásico es imprimir solo `source` “porque ya se ve”. Pregunta: ¿dónde pondrías `ingested_at` sin romper el contrato mínimo de este ejercicio? Luego (E3): ventana abierta con `valid_to IS NULL`.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-029 · provenance source/record
# DEFECT: omite record en el dict
import sqlite3
c = sqlite3.connect(':memory:')
c.execute('create table src(source text, record text)')
c.execute("insert into src values ('crm_synth','r9')")
row = c.execute('select source, record from src').fetchone()
print({'source': row[0]})
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import sqlite3
c = sqlite3.connect(':memory:')
c.execute('create table src(source text, record text)')
c.execute("insert into src values ('crm_synth','r9')")
row = c.execute('select source, record from src').fetchone()
print({'source': row[0], 'record': row[1]})
`,
          output: `{'source': 'crm_synth', 'record': 'r9'}`,
        },
      },
      {
        id: "S29-T1-B-E3",
        subtopicId: "S29-T1-B",
        kind: "transfer",
        title: "Ventana abierta con valid_to IS NULL",
        preamble:
          "- **Contexto:** en el lab, una fila con `valid_to` NULL es la versión vigente de la entidad; un cierre con timestamp deja de ser vigente.\n- **Meta:** contar filas abiertas con el predicado correcto de NULL en SQL.\n- **Éxito:** el entero `1`.\n- **Límites:** usa `IS NULL`, no `= NULL`; no inventes fechas; no borres la fila cerrada.",
        instruction:
          "1. Lee el DEFECT: `where valid_to = null` devuelve 0.\n2. Cambia el predicado a `valid_to is null`.\n3. Imprime el count.\n4. No alteres los inserts del fixture.",
        hint: "IS NULL marca ventana abierta",
        hints: [
          "insert con valid_to null",
          "select count(*) where valid_to is null",
        ],
        edgeCases: ["cierres con timestamp dejan de ser IS NULL"],
        tests: "salida coincide con solution output",
        feedback:
          "`valid_to IS NULL` marca la ventana abierta. `= NULL` no devuelve filas: es el mismo error conceptual que en la teoría de T2-B.",
        retrospective:
          "Una ventana vigente se filtra con `IS NULL`, no con igualdad. El error clásico es copiar `= null` desde un print de Python. Pregunta: ¿qué imprime `COUNT(*)` vs `COUNT(valid_to)` sobre este fixture?",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-029 · valid_to abierto en SQL
# DEFECT: usa = null (no encuentra la fila abierta)
import sqlite3
c = sqlite3.connect(':memory:')
c.execute('create table hist(id text, valid_to text)')
c.execute("insert into hist values ('e1', null)")
c.execute("insert into hist values ('e2', '2026-01-01')")
n = c.execute(
    'select count(*) from hist where valid_to = null'
).fetchone()[0]
print(n)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import sqlite3
c = sqlite3.connect(':memory:')
c.execute('create table hist(id text, valid_to text)')
c.execute("insert into hist values ('e1', null)")
c.execute("insert into hist values ('e2', '2026-01-01')")
n = c.execute(
    'select count(*) from hist where valid_to is null'
).fetchone()[0]
print(n)
`,
          output: `1`,
        },
      },
      {
        id: "S29-T2-A-E1",
        subtopicId: "S29-T2-A",
        kind: "guided",
        title: "Anti-join: pares sin decisión",
        preamble:
          "- **Contexto:** el revisor de CP-N3-A necesita la cola de pares aún sin label, no la lista de ya resueltos.\n- **Meta:** listar ids sin decisión con `NOT EXISTS` o `LEFT JOIN … IS NULL`.\n- **Éxito:** `['p2']`.\n- **Límites:** no uses `NOT IN` (falla si la subconsulta tiene NULL); no uses INNER JOIN; ordena por id si hace falta.",
        instruction:
          "1. Abre el starter: INNER JOIN devuelve solo `p1`.\n2. Reescribe con `NOT EXISTS (SELECT 1 FROM dec d WHERE d.pair_id = p.id)` (o LEFT JOIN + IS NULL).\n3. Imprime la lista de ids.\n4. No mutes las tablas del fixture.",
        hint: "INNER JOIN solo devuelve p1",
        hints: [
          "NOT EXISTS (SELECT 1 FROM dec d WHERE d.pair_id = p.id)",
          "o LEFT JOIN + IS NULL",
        ],
        edgeCases: [
          "NOT IN con NULL en la subconsulta vacía toda la cola; prefiere NOT EXISTS",
        ],
        tests: "salida coincide con solution output",
        feedback:
          "INNER JOIN solo devuelve pares ya decididos. La cola de review es anti-join: `NOT EXISTS` o `LEFT JOIN … IS NULL` → `['p2']`. Evita `NOT IN` cuando el subconjunto puede contener NULL.",
        retrospective:
          "La cola del revisor son los pares *sin* label; INNER JOIN los borra de la vista. Prefiere NOT EXISTS (o LEFT JOIN…IS NULL) frente a NOT IN con NULL. Pregunta: si `dec` tuviera un `pair_id` NULL, ¿qué le pasaría a un NOT IN? Siguiente (E2): top-1 con ROW_NUMBER.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-029 · pairs sin decisión
# DEFECT: INNER JOIN pierde p2
import sqlite3
c = sqlite3.connect(':memory:')
c.executescript(
    '''
    create table pairs(id text);
    create table dec(pair_id text);
    insert into pairs values ('p1'),('p2');
    insert into dec values ('p1');
    '''
)
print(
    [
        r[0]
        for r in c.execute(
            'select p.id from pairs p join dec d on d.pair_id=p.id'
        )
    ]
)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import sqlite3
c = sqlite3.connect(':memory:')
c.executescript(
    '''
    create table pairs(id text);
    create table dec(pair_id text not null);
    insert into pairs values ('p1'),('p2');
    insert into dec values ('p1');
    '''
)
print(
    [
        r[0]
        for r in c.execute(
            '''
            select p.id from pairs p
            where not exists (
              select 1 from dec d where d.pair_id = p.id
            )
            order by p.id
            '''
        )
    ]
)
`,
          output: `['p2']`,
        },
      },
      {
        id: "S29-T2-A-E2",
        subtopicId: "S29-T2-A",
        kind: "independent",
        title: "Top-1 global con ROW_NUMBER DESC",
        preamble:
          "- **Contexto:** la cola prioriza el candidato de mayor score antes de llamar al revisor.\n- **Meta:** rankear con `ROW_NUMBER() OVER (ORDER BY score DESC)` y devolver el id con `rn=1`.\n- **Éxito:** `p2` (score 0.9).\n- **Límites:** no uses ASC; no resuelvas el top en Python omitiendo la window; imprime solo el id.",
        instruction:
          "1. Revisa el starter: `order by score asc` elige el peor.\n2. Cambia a `order by score desc`.\n3. Mantén el filtro `where rn = 1`.\n4. Imprime el id.",
        hint: "ROW_NUMBER en SQLite",
        hints: [
          "WITH o subconsulta con ROW_NUMBER",
          "where rn = 1",
        ],
        edgeCases: ["empates de score: ROW_NUMBER no empata"],
        tests: "salida coincide con solution output",
        feedback:
          "ROW_NUMBER() OVER (ORDER BY score DESC) con rn=1 es el top-1 SQL. ASC elegía el peor score; el oráculo pide p2 (0.9).",
        retrospective:
          "ROW_NUMBER DESC con rn=1 es el top-1 SQL. ASC elegía basura de score bajo. Luego (E3): top-1 *por bloque* con PARTITION BY.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-029 · top score con window
# DEFECT: orden ASC y toma el peor
import sqlite3
c = sqlite3.connect(':memory:')
c.execute('create table pairs(id text, score real)')
c.executemany(
    'insert into pairs values (?,?)',
    [('p1', 0.2), ('p2', 0.9), ('p3', 0.5)],
)
q = '''
select id from (
  select id, row_number() over (order by score asc) as rn
  from pairs
) where rn = 1
'''
print(c.execute(q).fetchone()[0])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import sqlite3
c = sqlite3.connect(':memory:')
c.execute('create table pairs(id text, score real)')
c.executemany(
    'insert into pairs values (?,?)',
    [('p1', 0.2), ('p2', 0.9), ('p3', 0.5)],
)
q = '''
select id from (
  select id, row_number() over (order by score desc) as rn
  from pairs
) where rn = 1
'''
print(c.execute(q).fetchone()[0])
`,
          output: `p2`,
        },
      },
      {
        id: "S29-T2-A-E3",
        subtopicId: "S29-T2-A",
        kind: "transfer",
        title: "Top-1 por bloque con PARTITION BY",
        preamble:
          "- **Contexto:** en ER real, el ranking no es global: reinicia por cubeta de *blocking* (`block_key`) para no mezclar colas ajenas.\n- **Meta:** `ROW_NUMBER() OVER (PARTITION BY block_key ORDER BY score DESC)` y ids con `rn=1`.\n- **Éxito:** `['p1', 'p3']` ordenados por id.\n- **Límites:** no dejes ranking global; no omitas ORDER BY id externo; empates de score: ROW_NUMBER no empata (documenta en prod).",
        instruction:
          "1. Lee el DEFECT: window sin PARTITION BY (un solo ganador).\n2. Añade `PARTITION BY block_key` y `ORDER BY score DESC`.\n3. Filtra `rn = 1` y ordena por id.\n4. Imprime la lista de ids.",
        hint: "PARTITION BY reinicia el ranking por bloque",
        hints: [
          "La window debe particionar por block_key y ordenar score DESC",
          "Filtra rn = 1 y ordena por id en el SELECT externo",
        ],
        edgeCases: [
          "Sin PARTITION BY el top-1 global deja un solo id",
          "Empates de score: ROW_NUMBER no empata; documenta política en prod",
        ],
        tests: "salida coincide con solution output",
        feedback:
          "PARTITION BY block_key reinicia ROW_NUMBER en cada cubeta de blocking: top-1 por bloque (p1 en A, p3 en B). Un ORDER BY global sin partición no modela la cola de review por bloque.",
        retrospective:
          "PARTITION BY reinicia el contador por bloque: p1 en A, p3 en B. Un ORDER BY global no modela la cola de review por cubeta. Pregunta: ¿qué lista obtienes sin partición con estos datos?",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-029 · top-1 por block_key (PARTITION BY)
# DEFECT: ranking global sin PARTITION BY → solo un ganador
import sqlite3
c = sqlite3.connect(':memory:')
c.execute('create table pairs(id text, score real, block_key text)')
c.executemany(
    'insert into pairs values (?,?,?)',
    [
        ('p1', 0.9, 'A'),
        ('p2', 0.4, 'A'),
        ('p3', 0.7, 'B'),
        ('p4', 0.5, 'B'),
    ],
)
q = '''
select id from (
  select id, row_number() over (order by score desc) as rn
  from pairs
) where rn = 1
order by id
'''
print([r[0] for r in c.execute(q)])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import sqlite3
c = sqlite3.connect(':memory:')
c.execute('create table pairs(id text, score real, block_key text)')
c.executemany(
    'insert into pairs values (?,?,?)',
    [
        ('p1', 0.9, 'A'),
        ('p2', 0.4, 'A'),
        ('p3', 0.7, 'B'),
        ('p4', 0.5, 'B'),
    ],
)
q = '''
select id from (
  select id, row_number() over (
    partition by block_key order by score desc
  ) as rn
  from pairs
) where rn = 1
order by id
'''
print([r[0] for r in c.execute(q)])
`,
          output: `['p1', 'p3']`,
        },
      },
      {
        id: "S29-T2-B-E1",
        subtopicId: "S29-T2-B",
        kind: "guided",
        title: "Cardinalidad C(n,2) con a.id < b.id",
        preamble:
          "- **Contexto:** sin orden canónico ni *blocking*, el self-join de entidades explota y la cola de candidatos se vuelve inviable.\n- **Meta:** contar pares no ordenados con `a.id < b.id` (C(5,2)=10).\n- **Éxito:** el entero `10`.\n- **Límites:** no dejes el join sin filtro (25); no cuentes en Python omitiendo el SQL; lab con n=5.",
        instruction:
          "1. Abre el starter: `join` sin `on` cuenta n×n=25.\n2. Añade `on a.id < b.id`.\n3. Imprime `COUNT(*)`.\n4. No cambies el número de entidades del fixture.",
        hint: "self-join con a.id < b.id",
        hints: [
          "from e a join e b on a.id < b.id",
          "select count(*)",
        ],
        edgeCases: ["blocking reduce el n efectivo por cubeta en ER real"],
        tests: "salida coincide con solution output",
        feedback:
          "Self-join con `a.id < b.id` da C(5,2)=10 pares no ordenados. Sin el filtro, n×n=25 incluye diagonales y dobles sentidos — inviable en ER.",
        retrospective:
          "`a.id < b.id` da C(5,2)=10: sin diagonal ni doble sentido. Sin el filtro, 25 incluye basura de pares. Siguiente (E2): `= NULL` vs `IS NULL`.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-029 · cardinalidad de pares en SQL
# DEFECT: self-join sin a.id < b.id cuenta n*n (incluye (i,i) y ambos sentidos)
import sqlite3
c = sqlite3.connect(':memory:')
c.execute('create table e(id int)')
c.executemany('insert into e values (?)', [(i,) for i in range(5)])
n = c.execute(
    'select count(*) from e a join e b'
).fetchone()[0]
print(n)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import sqlite3
c = sqlite3.connect(':memory:')
c.execute('create table e(id int)')
c.executemany('insert into e values (?)', [(i,) for i in range(5)])
n = c.execute(
    'select count(*) from e a join e b on a.id < b.id'
).fetchone()[0]
print(n)
`,
          output: `10`,
        },
      },
      {
        id: "S29-T2-B-E2",
        subtopicId: "S29-T2-B",
        kind: "independent",
        title: "NULL en SQL: = NULL vs IS NULL",
        preamble:
          "- **Contexto:** filtrar filas abiertas o claves nulas en el almacén exige el predicado SQL correcto, no la intuición de Python.\n- **Meta:** comparar `WHERE x = NULL` vs `WHERE x IS NULL` sobre una fila NULL.\n- **Éxito:** `0 1` (eq e isn separados por espacio).\n- **Límites:** no uses `None is None` de Python para razonar; no “arregles” el NULL con COALESCE aquí.",
        instruction:
          "1. Revisa el starter: el segundo predicado también usa `= null`.\n2. Cambia el segundo a `x is null`.\n3. Imprime `eq` e `isn` en una línea.\n4. No alteres el insert NULL.",
        hint: "IS NULL vs = NULL",
        hints: [
          "eq = ... where x = null → 0",
          "isn = ... where x is null → 1",
          "print(eq, isn)",
        ],
        edgeCases: ["Python None is None no enseña SQL"],
        tests: "salida coincide con solution output",
        feedback:
          "En SQL, `x = NULL` no es TRUE (count 0); `x IS NULL` sí (count 1). No uses la analogía Python `None is None` para razonar NULL.",
        retrospective:
          "En SQL la igualdad con NULL no es TRUE ni FALSE “útil”: el predicado correcto de ausencia es `IS NULL`. Confundirlo con `None is None` de Python te deja ventanas “abiertas” con count 0. Pregunta: ¿qué devolvería un LEFT JOIN que filtre con `= NULL` en la columna de la derecha? Luego (E3): leer SCAN en el plan real.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-029 · NULL en SQL (no uses analogía Python)
# DEFECT: el segundo predicado también usa = null (debería ser IS NULL)
import sqlite3
c = sqlite3.connect(':memory:')
c.execute('create table t(x int)')
c.execute('insert into t values (null)')
eq = c.execute('select count(*) from t where x = null').fetchone()[0]
isn = c.execute('select count(*) from t where x = null').fetchone()[0]
print(eq, isn)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import sqlite3
c = sqlite3.connect(':memory:')
c.execute('create table t(x int)')
c.execute('insert into t values (null)')
eq = c.execute('select count(*) from t where x = null').fetchone()[0]
isn = c.execute('select count(*) from t where x is null').fetchone()[0]
print(eq, isn)
`,
          output: `0 1`,
        },
      },
      {
        id: "S29-T2-B-E3",
        subtopicId: "S29-T2-B",
        kind: "transfer",
        title: "EXPLAIN: SCAN sin índice en block_key",
        preamble:
          "- **Contexto:** antes de “ya tengo índice”, el lab pide el plan real de SQLite sobre un filtro por `block_key`.\n- **Meta:** correr `EXPLAIN QUERY PLAN` y reportar `SCAN` si el texto del plan lo contiene (mayúsculas).\n- **Éxito:** `SCAN` en tabla mínima sin índice.\n- **Límites:** no imprimas `INDEX` de memoria; no crees índice en este ejercicio (eso es T4); lee el plan.",
        instruction:
          "1. Lee el DEFECT: imprime `INDEX` sin mirar el plan.\n2. Une las filas del plan a string.\n3. Imprime `SCAN` si `'SCAN' in plan.upper()`, si no `OTHER`.\n4. No inventes el texto del plan.",
        hint: "EXPLAIN QUERY PLAN + str del plan",
        hints: [
          "join de filas del plan a string",
          "'SCAN' in plan.upper()",
        ],
        edgeCases: ["con índice el plan puede mostrar SEARCH/INDEX"],
        tests: "salida coincide con solution output",
        feedback:
          "Lee el plan real: sin índice en block_key, EXPLAIN QUERY PLAN suele mostrar SCAN. No imprimas INDEX de memoria.",
        retrospective:
          "Sin índice, el plan suele mostrar SCAN. El error clásico es imprimir la palabra mágica. Pregunta: ¿qué cambia en T4 cuando creas `idx_pairs_block` y vuelves a pedir el plan?",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-029 · plan SCAN vs INDEX
# DEFECT: ignora el plan y asume INDEX
import sqlite3
c = sqlite3.connect(':memory:')
c.execute('create table pairs(id text, block_key text)')
c.execute("insert into pairs values ('p1','K')")
plan = '\\n'.join(
    str(r)
    for r in c.execute(
        "explain query plan select * from pairs where block_key='K'"
    )
)
print('INDEX')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import sqlite3
c = sqlite3.connect(':memory:')
c.execute('create table pairs(id text, block_key text)')
c.execute("insert into pairs values ('p1','K')")
plan = '\\n'.join(
    str(r)
    for r in c.execute(
        "explain query plan select * from pairs where block_key='K'"
    )
)
print('SCAN' if 'SCAN' in plan.upper() else 'OTHER')
`,
          output: `SCAN`,
        },
      },
      {
        id: "S29-T3-A-E1",
        subtopicId: "S29-T3-A",
        kind: "guided",
        title: "ROLLBACK deja la tabla en 0",
        preamble:
          "- **Contexto:** en el lab ACID, un insert de prueba dentro de transacción debe poder deshacerse por completo.\n- **Meta:** tras BEGIN + insert, usar ROLLBACK y verificar count 0.\n- **Éxito:** el entero `0`.\n- **Límites:** no uses COMMIT; imprime solo el count.",
        instruction:
          "1. Abre el starter: hace `commit` y deja 1 fila.\n2. Cambia a `rollback`.\n3. Imprime `COUNT(*)`.\n4. No omitas el `begin`.",
        hint: "rollback en lugar de commit",
        hints: [
          "c.execute('rollback')",
          "print del count",
        ],
        edgeCases: ["commit opuesto deja 1"],
        tests: "salida coincide con solution output",
        feedback:
          "ROLLBACK deshace el INSERT de la transacción abierta: COUNT(*) vuelve a 0. COMMIT dejaría basura que el lab prohíbe.",
        retrospective:
          "ROLLBACK devuelve el almacén al estado pre-BEGIN; COMMIT dejaría la fila de prueba como si fuera dato real. El error clásico es “commit para ver si se insertó” y olvidar limpiar. Pregunta: sin `begin`, ¿rollback deshace el insert en SQLite de lab? Siguiente (E2): atomicidad decisión+evidencia juntas.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-029 · rollback deja 0 filas
# DEFECT: commit en vez de rollback
import sqlite3
c = sqlite3.connect(':memory:')
c.execute('create table t(x int)')
c.execute('begin')
c.execute('insert into t values (1)')
c.execute('commit')
print(c.execute('select count(*) from t').fetchone()[0])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import sqlite3
c = sqlite3.connect(':memory:')
c.execute('create table t(x int)')
c.execute('begin')
c.execute('insert into t values (1)')
c.execute('rollback')
print(c.execute('select count(*) from t').fetchone()[0])
`,
          output: `0`,
        },
      },
      {
        id: "S29-T3-A-E2",
        subtopicId: "S29-T3-A",
        kind: "independent",
        title: "Atomicidad: decisión y evidencia o nada",
        preamble:
          "- **Contexto:** cerrar un par en CP-N3-A exige decisión *y* evidencia en la misma transacción lógica.\n- **Meta:** insertar decisión, simular fallo de evidencia, ROLLBACK e imprimir ambos counts.\n- **Éxito:** `0 0` en una línea.\n- **Límites:** no hagas commit parcial; no dejes decisión huérfana; lab de una conexión.",
        instruction:
          "1. Revisa el starter: commit de la decisión sin evidence.\n2. Envuelve en try/except: raise simulado → `rollback`.\n3. Imprime counts de `decisions` y `evidence`.\n4. No insertes evidence en el camino feliz de este ejercicio (el fallo es intencional).",
        hint: "BEGIN + ROLLBACK en except",
        hints: [
          "insert decision",
          "raise o skip evidence",
          "rollback → ambos 0",
        ],
        edgeCases: ["si haces commit parcial rompes el almacén"],
        tests: "salida coincide con solution output",
        feedback:
          "Decisión y evidencia son atómicas: si la evidencia falla, ROLLBACK deja ambas tablas en 0. Un commit parcial crea decisión huérfana.",
        retrospective:
          "Si la evidencia falla, ambas tablas quedan en 0. Un commit parcial crea decisión huérfana. Luego (E3): política con flag `evidence_ok`.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-029 · atomicidad decisión+evidencia
# DEFECT: commit de la decisión aunque evidence falle
import sqlite3
c = sqlite3.connect(':memory:')
c.execute('create table decisions(pair_id text)')
c.execute('create table evidence(pair_id text)')
c.execute('begin')
c.execute("insert into decisions values ('p1')")
c.execute('commit')
# evidence nunca se escribió
nd = c.execute('select count(*) from decisions').fetchone()[0]
ne = c.execute('select count(*) from evidence').fetchone()[0]
print(nd, ne)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import sqlite3
c = sqlite3.connect(':memory:')
c.execute('create table decisions(pair_id text)')
c.execute('create table evidence(pair_id text)')
try:
    c.execute('begin')
    c.execute("insert into decisions values ('p1')")
    raise RuntimeError('evidence failed')
    c.execute("insert into evidence values ('p1')")
    c.execute('commit')
except RuntimeError:
    c.execute('rollback')
nd = c.execute('select count(*) from decisions').fetchone()[0]
ne = c.execute('select count(*) from evidence').fetchone()[0]
print(nd, ne)
`,
          output: `0 0`,
        },
      },
      {
        id: "S29-T3-A-E3",
        subtopicId: "S29-T3-A",
        kind: "transfer",
        title: "Abort si evidence_ok es False",
        preamble:
          "- **Contexto:** la política operativa del almacén es fail-closed: sin evidencia confirmada no hay decisión confirmada.\n- **Meta:** insertar decisión; si `evidence_ok` es False, ROLLBACK e imprimir `abort`.\n- **Éxito:** `abort`.\n- **Límites:** no dejes la decisión con COMMIT; no inviertas el if; imprime solo la palabra de política.",
        instruction:
          "1. Lee el DEFECT: el if está invertido (abort cuando evidence_ok es True).\n2. Corrige a `if not evidence_ok: rollback; print('abort')`.\n3. El else (commit) queda para el camino feliz no ejercitado aquí.\n4. Verifica la salida exacta.",
        hint: "rollback + print abort cuando evidence falla",
        hints: [
          "begin → insert decision",
          "Si evidence no está ok: rollback y reporta abort (no commit)",
        ],
        edgeCases: ["decisión+evidencia van juntas"],
        tests: "salida coincide con solution output",
        feedback:
          "Política de commit: si `evidence_ok` es False, ROLLBACK y `abort`. No dejes la decisión confirmada sin evidencia.",
        retrospective:
          "Si `evidence_ok` es False, ROLLBACK y `abort`. No dejes la decisión sin evidencia. Pregunta: ¿dónde reaparece esta política en el You Do (`insert_decision_with_evidence`)?",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-029 · abort sin evidencia
# DEFECT: hace commit aunque evidence_ok sea False
import sqlite3
c = sqlite3.connect(':memory:')
c.execute('create table decisions(pair_id text)')
evidence_ok = False
c.execute('begin')
c.execute("insert into decisions values ('p1')")
if evidence_ok:
    c.execute('rollback')
    print('abort')
else:
    c.execute('commit')
    print('commit')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import sqlite3
c = sqlite3.connect(':memory:')
c.execute('create table decisions(pair_id text)')
evidence_ok = False
c.execute('begin')
c.execute("insert into decisions values ('p1')")
if not evidence_ok:
    c.execute('rollback')
    print('abort')
else:
    c.execute('commit')
    print('commit')
`,
          output: `abort`,
        },
      },
      {
        id: "S29-T3-B-E1",
        subtopicId: "S29-T3-B",
        kind: "guided",
        title: "Upsert ON CONFLICT: name final B",
        preamble:
          "- **Contexto:** el CRM sintético reenvía la entidad `1` con un name corregido; el id no cambia.\n- **Meta:** segundo insert con `ON CONFLICT DO UPDATE` del name.\n- **Éxito:** `B`.\n- **Límites:** no borres la fila; no ignores el IntegrityError sin upsert; imprime solo el name.",
        instruction:
          "1. Abre el starter: segundo insert sin ON CONFLICT deja `A`.\n2. Reescribe el segundo insert con `on conflict(id) do update set name=excluded.name`.\n3. Imprime el name de id `'1'`.\n4. No cambies la PK.",
        hint: "ON CONFLICT(id) DO UPDATE",
        hints: [
          "insert ... on conflict(id) do update set name=excluded.name",
        ],
        edgeCases: ["updated_at se puede sumar en prod"],
        tests: "salida coincide con solution output",
        feedback:
          "ON CONFLICT DO UPDATE reescribe el name mutable y conserva el id. El segundo INSERT sin upsert reventaba; el name final debe ser B.",
        retrospective:
          "ON CONFLICT reescribe el name mutable y conserva el id. El segundo INSERT sin upsert reventaba. Siguiente (E2): devolver el job a `pending` tras crash.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-029 · UPSERT name
# DEFECT: segundo insert sin ON CONFLICT → IntegrityError y name queda old
import sqlite3
c = sqlite3.connect(':memory:')
c.execute('create table e(id text primary key, name text)')
c.execute("insert into e values ('1','A')")
try:
    c.execute("insert into e values ('1','B')")
except sqlite3.IntegrityError:
    pass
print(c.execute("select name from e where id='1'").fetchone()[0])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import sqlite3
c = sqlite3.connect(':memory:')
c.execute('create table e(id text primary key, name text)')
c.execute("insert into e values ('1','A')")
c.execute(
    "insert into e values ('1','B') on conflict(id) do update set name=excluded.name"
)
print(c.execute("select name from e where id='1'").fetchone()[0])
`,
          output: `B`,
        },
      },
      {
        id: "S29-T3-B-E2",
        subtopicId: "S29-T3-B",
        kind: "independent",
        title: "Job er_block: running a pending",
        preamble:
          "- **Contexto:** tras un crash del job de *blocking* del ER, el estado no puede quedar colgado en `running` o nadie lo reintenta.\n- **Meta:** UPDATE a `pending` y releer el status.\n- **Éxito:** `pending`.\n- **Límites:** no dupliques filas del job; no inventes un status intermedio; lab de una conexión.",
        instruction:
          "1. Revisa el starter: imprime `running` sin UPDATE.\n2. Ejecuta `UPDATE jobs SET status='pending' WHERE id='er_block'`.\n3. SELECT e imprime el status.\n4. No alteres el id del job.",
        hint: "UPDATE status='pending' WHERE id=...",
        hints: [
          "update jobs set status='pending' where id='er_block'",
          "print del SELECT status",
        ],
        edgeCases: ["reintento idempotente: pending se puede re-procesar"],
        tests: "salida coincide con solution output",
        feedback:
          "Tras un crash, el job vuelve a `pending` con UPDATE y se relee. Así el reintento es idempotente sin duplicar lógica de matching.",
        retrospective:
          "Un job en `running` eterno es un dead letter: nadie lo reintenta. UPDATE a `pending` + releer status es el contrato mínimo post-crash; no crees una segunda fila del mismo job. Pregunta: ¿por qué no “delete + insert” del job en este lab? Luego (E3): CHECK de orden canónico del par.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-029 · job status pending tras crash
# DEFECT: no reescribe running → pending
import sqlite3
c = sqlite3.connect(':memory:')
c.execute('create table jobs(id text, status text)')
c.execute("insert into jobs values ('er_block','running')")
print(c.execute("select status from jobs where id='er_block'").fetchone()[0])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import sqlite3
c = sqlite3.connect(':memory:')
c.execute('create table jobs(id text, status text)')
c.execute("insert into jobs values ('er_block','running')")
c.execute(
    "update jobs set status='pending' where id='er_block'"
)
print(c.execute("select status from jobs where id='er_block'").fetchone()[0])
`,
          output: `pending`,
        },
      },
      {
        id: "S29-T3-B-E3",
        subtopicId: "S29-T3-B",
        kind: "transfer",
        title: "Orden canónico A<B rechaza el espejo",
        preamble:
          "- **Contexto:** dos workers no deben crear el mismo par como (e1,e2) y (e2,e1); el almacén exige un solo candidato canónico.\n- **Meta:** tabla con `CHECK(entity_a < entity_b)` + UNIQUE; insertar (e1,e2) y rechazar el espejo.\n- **Éxito:** `order_rejected`.\n- **Límites:** UNIQUE solo no basta si el orden está invertido; no elimines el try/except; no imprimas `ok`.",
        instruction:
          "1. Lee el DEFECT: sin CHECK el espejo se inserta.\n2. Añade `check(entity_a < entity_b)` al CREATE.\n3. Mantén UNIQUE y el segundo insert del espejo.\n4. En IntegrityError imprime `order_rejected`.",
        hint: "CHECK(entity_a < entity_b) rechaza el par invertido",
        hints: [
          "create table con check(entity_a < entity_b) y unique(entity_a, entity_b)",
          "segundo insert ('e2','e1') → except IntegrityError → print order_rejected",
        ],
        edgeCases: [
          "Sin CHECK el espejo (e2,e1) convive con (e1,e2) y duplica el candidato",
          "UNIQUE solo no basta si el orden de extremos está invertido",
        ],
        tests: "salida coincide con solution output",
        feedback:
          "CHECK(entity_a < entity_b) rechaza el espejo (e2,e1). UNIQUE evita el duplicado en el mismo orden. El worker captura IntegrityError y reporta `order_rejected` (o `retry` en el flujo de reintento).",
        retrospective:
          "CHECK A<B rechaza el espejo; UNIQUE evita el duplicado en el mismo orden. El error clásico es confiar solo en UNIQUE. Pregunta: ¿qué reportaría un worker en reintento tras este IntegrityError?",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-029 · orden canónico A<B + UNIQUE
# DEFECT: sin CHECK; el espejo (e2,e1) se inserta y imprime ok
import sqlite3
c = sqlite3.connect(':memory:')
c.execute(
    'create table pairs(entity_a text, entity_b text, unique(entity_a, entity_b))'
)
c.execute("insert into pairs values ('e1','e2')")
try:
    c.execute("insert into pairs values ('e2','e1')")
    print('ok')
except sqlite3.IntegrityError:
    print('order_rejected')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import sqlite3
c = sqlite3.connect(':memory:')
c.execute(
    '''create table pairs(
         entity_a text, entity_b text,
         unique(entity_a, entity_b),
         check(entity_a < entity_b)
       )'''
)
c.execute("insert into pairs values ('e1','e2')")
try:
    c.execute("insert into pairs values ('e2','e1')")
    print('ok')
except sqlite3.IntegrityError:
    print('order_rejected')
`,
          output: `order_rejected`,
        },
      },
      {
        id: "S29-T4-A-E1",
        subtopicId: "S29-T4-A",
        kind: "guided",
        title: "Última migration con MAX(version)",
        preamble:
          "- **Contexto:** el lab (y prod) necesita saber *hasta qué versión* del esquema ya se aplicó, no la primera.\n- **Meta:** registrar v1 y v2 e imprimir `MAX(v)`.\n- **Éxito:** el entero `2`.\n- **Límites:** no uses MIN; no hardcodes el 2 sin leer la tabla.",
        instruction:
          "1. Abre el starter: `select min(v)` devuelve 1.\n2. Cambia a `max(v)`.\n3. Imprime el resultado.\n4. No borres las filas de migration.",
        hint: "MAX no MIN",
        hints: [
          "insert (2,'add_index')",
          "select max(v)",
        ],
        edgeCases: ["expand/backfill/contract"],
        tests: "salida coincide con solution output",
        feedback:
          "schema_migrations versiona con MAX(v): la última migration aplicada. MIN(v) te deja en el origen y miente sobre el estado del esquema.",
        retrospective:
          "MAX(v) es la última migration aplicada. MIN te deja en el origen y miente sobre el estado. Siguiente (E2): crear el índice y leerlo en sqlite_master.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-029 · schema_migrations max version
# DEFECT: usa min(v)
import sqlite3
c = sqlite3.connect(':memory:')
c.execute('create table schema_migrations(v int primary key, name text)')
c.execute(
    "insert into schema_migrations values (1,'init'),(2,'add_index')"
)
print(c.execute('select min(v) from schema_migrations').fetchone()[0])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import sqlite3
c = sqlite3.connect(':memory:')
c.execute('create table schema_migrations(v int primary key, name text)')
c.execute("insert into schema_migrations values (1,'init')")
c.execute("insert into schema_migrations values (2,'add_index')")
print(c.execute('select max(v) from schema_migrations').fetchone()[0])
`,
          output: `2`,
        },
      },
      {
        id: "S29-T4-A-E2",
        subtopicId: "S29-T4-A",
        kind: "independent",
        title: "Crear índice real idx_pairs_block_key",
        preamble:
          "- **Contexto:** la cola filtrada por `block_key` no se acelera con un string en un print: hace falta el índice y evidencia.\n- **Meta:** crear `idx_pairs_block_key`, confirmarlo en `sqlite_master` y verificar INDEX en el plan.\n- **Éxito:** `idx_pairs_block_key`.\n- **Límites:** no imprimas el nombre si falta en sqlite_master; no asumas INDEX sin EXPLAIN.",
        instruction:
          "1. Revisa el DEFECT: falta `CREATE INDEX`.\n2. Crea `idx_pairs_block_key on pairs(block_key)`.\n3. Lee el name en `sqlite_master` (si falta, no inventes el string).\n4. Imprime solo el name del índice (el plan debe poder confirmar INDEX; no hardcodes el print).",
        hint: "CREATE INDEX + sqlite_master + EXPLAIN",
        hints: [
          "create index idx_pairs_block_key on pairs(block_key)",
          "select name from sqlite_master where type='index'",
          "EXPLAIN QUERY PLAN del filtro por block_key debe mencionar INDEX",
        ],
        edgeCases: ["sin índice el plan suele ser SCAN; con índice SEARCH/INDEX"],
        tests: "salida coincide con solution output",
        feedback:
          "CREATE INDEX + lectura en sqlite_master + EXPLAIN con INDEX en el plan: evidencia triple de que el índice existe y se usa.",
        retrospective:
          "CREATE INDEX + sqlite_master + EXPLAIN: evidencia triple. El error clásico es “ya puse el nombre” sin crear el objeto. Luego (E3): política de no DROP sin backup.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-029 · índice real + evidencia en el plan
# DEFECT: no crea el índice; sqlite_master no lo encuentra
import sqlite3
c = sqlite3.connect(':memory:')
c.execute('create table pairs(id text, block_key text)')
c.execute("insert into pairs values ('p1','K')")
# falta: create index idx_pairs_block_key on pairs(block_key)
row = c.execute(
    "select name from sqlite_master where type='index' and name='idx_pairs_block_key'"
).fetchone()
plan = '\\n'.join(
    str(r)
    for r in c.execute(
        "explain query plan select * from pairs where block_key='K'"
    )
)
print(row[0] if row else 'missing_index')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import sqlite3
c = sqlite3.connect(':memory:')
c.execute('create table pairs(id text, block_key text)')
c.execute("insert into pairs values ('p1','K')")
c.execute('create index idx_pairs_block_key on pairs(block_key)')
row = c.execute(
    "select name from sqlite_master where type='index' and name='idx_pairs_block_key'"
).fetchone()
plan = '\\n'.join(
    str(r)
    for r in c.execute(
        "explain query plan select * from pairs where block_key='K'"
    )
)
assert row is not None
assert 'INDEX' in plan.upper() or 'idx_pairs_block_key' in plan
print(row[0])
`,
          output: `idx_pairs_block_key`,
        },
      },
      {
        id: "S29-T4-A-E3",
        subtopicId: "S29-T4-A",
        kind: "transfer",
        title: "Sin backup no hagas DROP de pairs",
        preamble:
          "- **Contexto:** una migration agresiva que dropea `pairs` sin backup borra evidencia del almacén ER; el lab entrena el guard antes de tocar prod.\n- **Meta:** con `has_backup=False`, no DROP; reportar count y la política.\n- **Éxito:** dos líneas — `1` y `no_drop_without_backup`.\n- **Límites:** no ejecutes DROP en el camino de este fixture; no imprimas solo `drop_ok`.",
        instruction:
          "1. Lee el DEFECT: DROP aunque has_backup sea False.\n2. Si `not has_backup`: COUNT, print count, print política.\n3. Else (no ejercitado): DROP y `drop_ok`.\n4. Verifica las dos líneas exactas.",
        hint: "guard + COUNT; no DROP si no hay backup",
        hints: [
          "if not has_backup: n = COUNT(*); print(n); print('no_drop_without_backup')",
          "else: drop + print drop_ok",
          "el starter dropea y pierde la evidencia: corrige el DEFECT",
        ],
        edgeCases: [
          "seguridad en producción: schema_migrations no reemplaza backup",
        ],
        tests: "salida coincide con solution output",
        feedback:
          "Con has_backup=False no hay DROP: COUNT(*) sigue en 1 y se imprime la política. La evidencia del almacén ER no se borra por “agilidad” de migración.",
        retrospective:
          "Con has_backup=False no hay DROP: la evidencia sobrevive. El error clásico es “agilidad de schema” sin respaldo. Pregunta: ¿dónde documentas esta política en el README del You Do?",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-029 · no drop sin backup (tabla debe sobrevivir)
# DEFECT: DROP de pairs aunque has_backup sea False
import sqlite3
has_backup = False
c = sqlite3.connect(':memory:')
c.execute('create table pairs(id text)')
c.execute("insert into pairs values ('p1')")
c.execute('drop table pairs')
# la tabla ya no existe; el lab exige conservar evidencia y reportar count+política
print('drop_ok')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import sqlite3
has_backup = False
c = sqlite3.connect(':memory:')
c.execute('create table pairs(id text)')
c.execute("insert into pairs values ('p1')")
if not has_backup:
    n = c.execute('select count(*) from pairs').fetchone()[0]
    print(n)
    print('no_drop_without_backup')
else:
    c.execute('drop table pairs')
    print('drop_ok')
`,
          output: `1
no_drop_without_backup`,
        },
      },
      {
        id: "S29-T4-B-E1",
        subtopicId: "S29-T4-B",
        kind: "guided",
        title: "EntityRepo.get: devolver Ana con e1",
        preamble:
          "- **Contexto:** el repository es el borde de persistencia: `get(id)` oculta el SELECT y se prueba con datos sintéticos.\n- **Meta:** insertar e1→Ana e imprimir `get('e1')` (el método ya es correcto; el skill es *usarlo* con el id insertado).\n- **Éxito:** `Ana`.\n- **Límites:** no pidas e2 (no existe); no armes el SELECT fuera del método; no hardcodes el print omitiendo get.",
        instruction:
          "1. Abre el starter: `get('e2')` devuelve None.\n2. Cambia la llamada a `get('e1')`.\n3. Imprime el resultado.\n4. No reescribas el método (ya es correcto).",
        hint: "SELECT name WHERE id=?",
        hints: [
          "método get con fetchone",
          "no uses e2",
        ],
        edgeCases: ["SQL detrás del método"],
        tests: "salida coincide con solution output",
        feedback:
          "El repository expone get(id): el SQL vive dentro del método. Con e1 insertado, get('e1') devuelve Ana; e2 no existe.",
        retrospective:
          "El repo expone get(id); el SQL vive dentro. Con e1 insertado, get('e1') es Ana. Siguiente (E2): ciclo de tres conexiones con PRAGMA y close.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-029 · repo get
# DEFECT: get pide e2 (no existe) → None
import sqlite3

class EntityRepo:
    def __init__(self, con):
        self.con = con
    def get(self, eid):
        row = self.con.execute(
            'select name from entities where id=?', (eid,)
        ).fetchone()
        return row[0] if row else None

c = sqlite3.connect(':memory:')
c.execute('create table entities(id text primary key, name text)')
c.execute("insert into entities values ('e1','Ana')")
print(EntityRepo(c).get('e2'))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import sqlite3

class EntityRepo:
    def __init__(self, con):
        self.con = con
    def get(self, eid):
        row = self.con.execute(
            'select name from entities where id=?', (eid,)
        ).fetchone()
        return row[0] if row else None

c = sqlite3.connect(':memory:')
c.execute('create table entities(id text primary key, name text)')
c.execute("insert into entities values ('e1','Ana')")
print(EntityRepo(c).get('e1'))
`,
          output: `Ana`,
        },
      },
      {
        id: "S29-T4-B-E2",
        subtopicId: "S29-T4-B",
        kind: "independent",
        title: "Tres conexiones con PRAGMA y close",
        preamble:
          "- **Contexto:** en SQLite de lab no hace falta un pool corporativo, pero sí el hábito: cada conexión configura FK y se cierra.\n- **Meta:** abrir 3 conexiones `:memory:`, `PRAGMA foreign_keys=ON` en cada una, cerrar e imprimir el conteo.\n- **Éxito:** el entero `3`.\n- **Límites:** el PRAGMA no es global del proceso; no dejes conexiones abiertas sin close en el loop.",
        instruction:
          "1. Revisa el starter: solo una apertura.\n2. Loop `for _ in range(3)`: connect → pragma → opened += 1 → close.\n3. Imprime `opened`.\n4. No reutilices una sola conexión para “simular” 3.",
        hint: "loop open → pragma → close",
        hints: [
          "for _ in range(3): connect, pragma, close",
          "print del contador",
        ],
        edgeCases: ["PRAGMA foreign_keys es por conexión, no global del proceso"],
        tests: "salida coincide con solution output",
        feedback:
          "Cada conexión necesita su PRAGMA foreign_keys=ON y su close. Contar 3 aperturas entrena el ciclo open→config→close del lab.",
        retrospective:
          "Cada conexión necesita su PRAGMA y su close. Contar 3 aperturas entrena el ciclo del lab. Luego (E3): `pending_count` con anti-join real (no literal).",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-029 · conexiones configuradas
# DEFECT: solo abre 1 conexión y no cierra
import sqlite3
opened = 0
c = sqlite3.connect(':memory:')
c.execute('PRAGMA foreign_keys = ON')
opened += 1
print(opened)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import sqlite3
opened = 0
for _ in range(3):
    c = sqlite3.connect(':memory:')
    c.execute('PRAGMA foreign_keys = ON')
    opened += 1
    c.close()
print(opened)
`,
          output: `3`,
        },
      },
      {
        id: "S29-T4-B-E3",
        subtopicId: "S29-T4-B",
        kind: "transfer",
        title: "pending_count real con NOT EXISTS",
        preamble:
          "- **Contexto:** un test del repository no debe hardcodear el resultado: tiene que ejercer el anti-join de la cola.\n- **Meta:** COUNT de pares sin decisión con `NOT EXISTS` e imprimir el entero calculado.\n- **Éxito:** `1` (p2 pendiente).\n- **Límites:** no imprimas un literal; no uses NOT IN; no mutes el fixture p1 decidido / p2 pendiente.",
        instruction:
          "1. Lee el DEFECT: el SQL ya cuenta bien pero `print(0)`.\n2. Cambia a `print(pending_count)`.\n3. No reescribas el anti-join si ya es correcto.\n4. Verifica mentalmente: un pendiente → 1.",
        hint: "anti-join + count",
        hints: [
          "COUNT con NOT EXISTS sobre decisions",
          "print del count (no un literal)",
        ],
        edgeCases: [
          "Con pair_id NOT NULL y NOT EXISTS, un NULL adversarial no vacía la cola",
        ],
        tests: "salida coincide con solution output",
        feedback:
          "pending_count se calcula con anti-join real (`NOT EXISTS`), no con un literal ni con `NOT IN`. Con p2 pendiente el oráculo es 1.",
        retrospective:
          "Un assert que hardcodea 0 “pasa” sin ejercer el SQL del repo. El error clásico es imprimir el oráculo a mano. Pregunta: ¿cómo reutilizas este count en `test_store.py` del You Do?",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-029 · pending_count real
# DEFECT: hardcode 0 aunque el SQL podría contar 1
import sqlite3
c = sqlite3.connect(':memory:')
c.executescript(
    '''
    create table pairs(id text);
    create table decisions(pair_id text not null);
    insert into pairs values ('p1'),('p2');
    insert into decisions values ('p1');
    '''
)
pending_count = c.execute(
    '''
    select count(*) from pairs p
    where not exists (
      select 1 from decisions d where d.pair_id = p.id
    )
    '''
).fetchone()[0]
print(0)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import sqlite3
c = sqlite3.connect(':memory:')
c.executescript(
    '''
    create table pairs(id text);
    create table decisions(pair_id text not null);
    insert into pairs values ('p1'),('p2');
    insert into decisions values ('p1');
    '''
)
pending_count = c.execute(
    '''
    select count(*) from pairs p
    where not exists (
      select 1 from decisions d where d.pair_id = p.id
    )
    '''
).fetchone()[0]
print(pending_count)
`,
          output: `1`,
        },
      },
    ],
  },
  youDo: {
    title: "Almacén de verdad ER — esquema, historia y repositorio",
    context:
      "Integra lo de T1–T4 en un entregable de portafolio para el capstone CP-N3-A. El esquema en SQLite encadena `source_records` ↔ `entity_source_links` ↔ `entities` → `candidate_pairs` → `decisions` (append-only) → `evidence`, con `PRAGMA foreign_keys=ON`. La cola de review se resuelve con anti-join (`NOT EXISTS`); el upsert de entidad usa `ON CONFLICT DO UPDATE`; la evolución del esquema se versiona con `schema_migrations` + índices; y la lógica de acceso vive en un `PairRepository` testeado en `:memory:`. Usa solo datos sintéticos del fixture CASO-LIM-029; no sobrescribas historia de decisiones ni etiquetes fraude o parentesco.",
    objectives: [
      "Modelo PK/FK/CHECK, puente fuente–entidad y orden canónico de pares con FK real habilitada",
      "Temporalidad y provenance (ingested_at, transform_version, run_id, decided_at) sin sobrescribir historia",
      "Consultas CTE/anti-join seguro (NOT EXISTS) para la cola de review",
      "ACID en decisión+evidencia; upsert; índices; repo y tests en :memory:",
    ],
    requirements: [
      "Historia de decisions no se borra con UPDATE destructivo del label",
      "Scores solo en [0, 1]; IntegrityError observable si se viola CHECK, UNIQUE del par o FK",
      "Documentación del esquema en español profesional (es-PE)",
      "Esquema CP-N3-A: source_records, entity_source_links, entities, candidate_pairs, decisions, evidence",
      "evidence.decision_id NOT NULL REFERENCES decisions(id); sin pair_id redundante en evidence",
      "Tests mínimos en :memory: constraint roto, pending con NOT EXISTS, rollback decisión+evidencia, par duplicado rechazado",
      "Implementar PairRepository.pending y insert_decision_with_evidence (misma transacción; lastrowid → evidence)",
      "Entregables: schema.sql, seed.py, repository.py, test_store.py (suite que falla hasta implementar) y README.md",
    ],
    starterCode: `# Almacén ER — esqueleto S29 (extiende hasta cumplir requirements)
import sqlite3

def connect():
    con = sqlite3.connect(":memory:")
    con.execute("PRAGMA foreign_keys = ON")
    con.executescript('''
    CREATE TABLE source_records(
      id TEXT PRIMARY KEY,
      source_system TEXT NOT NULL,
      external_id TEXT NOT NULL,
      payload TEXT,
      ingested_at TEXT NOT NULL,
      transform_version TEXT NOT NULL,
      run_id TEXT NOT NULL,
      UNIQUE(source_system, external_id)
    );
    CREATE TABLE entities(
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL
    );
    CREATE TABLE entity_source_links(
      entity_id TEXT NOT NULL REFERENCES entities(id),
      source_record_id TEXT NOT NULL REFERENCES source_records(id),
      linked_at TEXT NOT NULL,
      transform_version TEXT NOT NULL,
      run_id TEXT NOT NULL,
      PRIMARY KEY(entity_id, source_record_id, run_id)
    );
    CREATE TABLE candidate_pairs(
      id TEXT PRIMARY KEY,
      entity_a TEXT NOT NULL REFERENCES entities(id),
      entity_b TEXT NOT NULL REFERENCES entities(id),
      score REAL NOT NULL CHECK(score >= 0 AND score <= 1),
      CHECK(entity_a < entity_b),
      UNIQUE(entity_a, entity_b)
    );
    CREATE TABLE decisions(
      id INTEGER PRIMARY KEY,
      pair_id TEXT NOT NULL REFERENCES candidate_pairs(id),
      label TEXT NOT NULL CHECK(label IN ('review', 'match', 'non_match')),
      actor TEXT NOT NULL,
      decided_at TEXT NOT NULL
    );
    CREATE TABLE evidence(
      id INTEGER PRIMARY KEY,
      decision_id INTEGER NOT NULL REFERENCES decisions(id),
      note TEXT NOT NULL
    );
    CREATE TABLE schema_migrations(
      version INTEGER PRIMARY KEY,
      name TEXT NOT NULL
    );
    ''')
    return con

class PairRepository:
    def __init__(self, con):
        self.con = con
    def pending(self):
        # Completa: anti-join con NOT EXISTS (lista o count)
        raise NotImplementedError
    def insert_decision_with_evidence(self, pair_id, label, actor, note):
        # Completa: BEGIN → decisión → lastrowid → evidence → COMMIT;
        # si falla evidencia: ROLLBACK (sin decisión huérfana)
        raise NotImplementedError
    def upsert_entity(self, eid, name):
        # Opcional: ON CONFLICT DO UPDATE del name
        raise NotImplementedError

if __name__ == "__main__":
    con = connect()
    print("er_store_starter", con is not None)
    print("fk_pragma", con.execute("PRAGMA foreign_keys").fetchone()[0])
`,
    portfolioNote:
      "Publica un mini-repo o carpeta de portafolio con: (1) el DDL del almacén ER; (2) un script de seed sintético CASO-LIM-029; (3) tests de constraints, anti-join, append-only y rollback; y (4) un README breve en español profesional que explique el esquema, los límites del lab y un invariante medible que puedas defender (p. ej. pending + rollback en `:memory:`).",
    retrospective:
      "Antes de marcar listo: (1) ¿qué invariante demuestras con un test en `:memory:` (IntegrityError de FK/CHECK, `pending` con NOT EXISTS, o ROLLBACK de decisión+evidencia)? (2) ¿qué harías distinto con un almacén corporativo (PostgreSQL, pooling, migraciones reales) vs. este lab SQLite? (3) En el README, una frase de impacto medible (antes/después: p. ej. “cola de review sin pares huérfanos; 0 decisiones sin evidencia”) que puedas defender en 30 segundos. No etiquetes match como fraude ni parentesco.",
    rubric: [
      {
        criterion:
          "Esquema CP-N3-A completo (fuentes, vínculos fuente–entidad, entidades, pares UNIQUE, decisiones append-only, evidencia con FK a decisión) con constraints verificados",
        weight: "25%",
      },
      {
        criterion:
          "Correctitud técnica: PRAGMA foreign_keys, anti-join NOT EXISTS, ACID decisión+evidencia, upsert e índice versionado",
        weight: "20%",
      },
      {
        criterion:
          "Privacidad / sin PII real / sin secretos / sin inferencia de fraude ni parentesco",
        weight: "20%",
      },
      {
        criterion:
          "Pruebas en :memory: (IntegrityError, pending, rollback, par duplicado) documentadas en test_store.py",
        weight: "15%",
      },
      { criterion: "Código legible y límites claros del repository", weight: "10%" },
      { criterion: "Documentación en español profesional", weight: "10%" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "entity_a < entity_b en el par sirve para:",
        options: ["Evitar duplicar el mismo par en orden invertido", "Inferir fraude", "Borrar historia", "Subir isolation"],
        correctIndex: 0,
        explanation:
          "Con entity_a < entity_b (orden canónico) el par (e1,e2) y (e2,e1) no coexisten. No implica fraude ni parentesco: solo evita duplicar el mismo candidato en la cola.",
      },
      {
        question: "Append-only en decisions significa:",
        options: ["UPDATE del label in place sin rastro", "Drop de tabla cada noche", "Nueva fila por cambio de decisión", "Solo un match eterno"],
        correctIndex: 2,
        explanation:
          "Cada cambio de label es un INSERT nuevo. Así conservas provenance (quién/cuándo/evidence_ref) y puedes auditar la historia del par.",
      },
      {
        question: "Decisión y evidencia deben:",
        options: [
          "Confirmarse en transacciones separadas siempre",
          "Ignorar rollback",
          "Vivir solo en logs de texto",
          "Ser atómicas en la misma transacción lógica",
        ],
        correctIndex: 3,
        explanation:
          "Si falla la evidencia, ROLLBACK también de la decisión. Decisión huérfana rompe el almacén de verdad (atomicidad ACID).",
      },
      {
        question: "El repository pattern:",
        options: [
          "Esparce SQL por toda la app a propósito",
          "Encapsula acceso a datos y facilita tests con :memory:",
          "Reemplaza constraints",
          "Marca fraude automático",
        ],
        correctIndex: 1,
        explanation:
          "El repository es el borde de persistencia: métodos como pending() y get() ocultan SQL y se prueban inyectando una conexión :memory:. Preferible NOT EXISTS a NOT IN si pair_id puede ser NULL.",
      },
      {
        question:
          "Una migración que hace DROP de pairs sin backup en el lab debe…",
        options: [
          "rechazarse: no_drop_without_backup es parte del contrato",
          "ejecutarse en producción si el SQL es corto",
          "silenciar el error de IntegrityError",
          "usar SELECT * sin WHERE para ir más rápido",
        ],
        correctIndex: 0,
        explanation:
          "Gobernanza de esquema: cambios destructivos requieren backup y versionado en schema_migrations. El lab entrena el hábito antes de tocar producción.",
      },
      {
        question:
          "En SQLite, un REFERENCES en el DDL garantiza la FK en runtime si…",
        options: ["siempre, sin configuración adicional", "solo si usas PostgreSQL en la misma máquina", "solo cuando PRAGMA foreign_keys = ON en esa conexión", "solo si el score del par es > 0.5"],
        correctIndex: 2,
        explanation:
          "SQLite deja las foreign keys apagadas por defecto. Cada conexión debe ejecutar PRAGMA foreign_keys = ON; si no, un entity_id fantasma se inserta sin error y el almacén miente.",
      },
      {
        question: "Para filtrar filas con columna NULL en SQL debes usar…",
        options: ["WHERE col = NULL", "WHERE col == None (sintaxis Python)", "WHERE col IN (NULL)", "WHERE col IS NULL"],
        correctIndex: 3,
        explanation:
          "NULL = NULL es desconocido (no TRUE). IS NULL / IS NOT NULL es el predicado correcto; COUNT(col) ignora NULL mientras COUNT(*) cuenta la fila.",
      },
      {
        question:
          "Si `EXPLAIN QUERY PLAN` muestra SCAN sobre pairs al filtrar por block_key, la lectura correcta es…",
        options: [
          "Ya hay índice mágico aunque no lo creaste",
          "El motor recorre la tabla; un índice en block_key puede pasar el plan a SEARCH/INDEX",
          "SCAN significa que el resultado es siempre vacío",
          "Debes imprimir la palabra INDEX sin mirar el plan",
        ],
        correctIndex: 1,
        explanation:
          "SCAN = recorrido completo. Tras CREATE INDEX en la columna de filtro, vuelve a pedir el plan: si aparece INDEX/SEARCH, el índice está ayudando a esa consulta concreta. El texto del plan es diagnóstico, no una API estable entre versiones.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "SQLite language",
        url: "https://www.sqlite.org/lang.html",
        note: "SQL local del curso",
      },
      {
        label: "SQLite EXPLAIN QUERY PLAN",
        url: "https://www.sqlite.org/eqp.html",
        note: "Planes e índices",
      },
      {
        label: "SQLite foreign keys",
        url: "https://www.sqlite.org/foreignkeys.html",
        note: "FK off by default; PRAGMA foreign_keys=ON",
      },
      {
        label: "PostgreSQL constraints",
        url: "https://www.postgresql.org/docs/current/ddl-constraints.html",
        note: "Prod analog de CHECK/UNIQUE/FK",
      },
      {
        label: "PostgreSQL window functions",
        url: "https://www.postgresql.org/docs/current/tutorial-window.html",
        note: "ROW_NUMBER / RANK / PARTITION BY",
      },
      {
        label: "Use The Index, Luke",
        url: "https://use-the-index-luke.com/",
        note: "Índices y planes legibles",
      },
      {
        label: "Python sqlite3",
        url: "https://docs.python.org/3/library/sqlite3.html",
        note: "API del lab",
      },
    ],
    books: [
      {
        label: "SQL Antipatterns (Karwin)",
        url: "https://pragprog.com/titles/bksqla/sql-antipatterns/",
        note: "Diseño y errores comunes (joins, keys, historia)",
      },
      {
        label: "Designing Data-Intensive Applications (Kleppmann)",
        url: "https://dataintensive.net/",
        note: "Transacciones, replicación e historia de datos",
      },
    ],
    courses: [
      {
        label: "Coursera — SQL / data management",
        url: "https://www.coursera.org/courses?query=sql%20relational%20database",
        note: "Modelado y consultas",
      },
      {
        label: "MIT 6.100L",
        url: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/",
        note: "Contratos y tests",
      },
      {
        label: "Harvard CS50P",
        url: "https://cs50.harvard.edu/python/",
        note: "Proyectos reproducibles",
      },
      {
        label: "Stanford DB course materials (concept)",
        url: "https://cs145-fa20.github.io/",
        note: "Relacional e integridad",
      },
    ],
  },
}
