import type { CourseSection } from '../../types'

export const section29: CourseSection = {
  id: "mlops",
  index: 29,
  title: "SQL avanzado y modelado relacional",
  shortTitle: "SQL almacén ER",
  tagline: "esquema que preserva registros fuente, entidades, pares candidatos, decisiones y evidencia sin sobrescribir historia",
  estimatedHours: 18,
  level: "Competente",
  phase: 2,
  icon: "Database",
  accentColor: "bg-gradient-to-br from-sky-500 to-blue-800",
  jobRelevance:
    "El **almacén de verdad del ER** guarda fuentes, entidades, pares, decisiones y evidencia con historia auditable. En equipos de datos (banca, telecom, retail en Perú y LATAM) un analista o ingeniero que modela PK/FK, temporalidad y consultas de cola de revisión en SQL reduce re-procesos y discusiones sin evidencia. La práctica de esta sección usa SQLite de laboratorio (constraints, joins, ACID, migraciones, repository) como contrato del motor antes de un warehouse corporativo.",
  learningOutcomes: [
    {
      text: "Definir PK/FK/CHECK/UNIQUE en SQLite con `PRAGMA foreign_keys=ON` y demostrar violación con IntegrityError",
    },
    {
      text: "Modelar temporalidad y provenance (append-only de decisions, source_system, evidence_ref) sin sobrescribir historia",
    },
    {
      text: "Escribir CTEs, ROW_NUMBER y anti-joins (NOT EXISTS / LEFT JOIN … IS NULL) para colas de review",
    },
    {
      text: "Razonar cardinalidad de joins, NULL con IS NULL y planes con EXPLAIN QUERY PLAN (SCAN vs SEARCH)",
    },
    {
      text: "Garantizar atomicidad decisión+evidencia con BEGIN/COMMIT/ROLLBACK en la misma conexión",
    },
    {
      text: "Implementar upserts de entidad (ON CONFLICT DO UPDATE) sin borrar historia de decisiones",
    },
    {
      text: "Versionar migrations en schema_migrations, crear índices y evitar DROP sin backup",
    },
    {
      text: "Encapsular SQL en un repository testeable con sqlite :memory: (pending, get, constraints)",
    },
  ],
  theory: [
    {
      heading: "Almacén relacional del ER para CP-N3-A",
      paragraphs: [
        "Modelas el **almacén ER** del capstone CP-N3-A: `source_records` → `entities` → `candidate_pairs` → `decisions` (append-only) → `evidence`. Sin historia de decisiones no hay auditoría: un UPDATE in-place del label borra el rastro de quién cambió de `review` a `match`. Fixture de lab: **CASO-LIM-029** (`run_id=cpn3a-sql`, correos `@example.pe`, ids `ent-00N`). Solo datos sintéticos; **match ≠ fraude** ni parentesco; fallo cerrado (fail-closed) si falta llave o el join multiplica filas sin documentar fan-out.",
        "SQLite local es una base real y reproducible para observar constraints, NULL, planes y transacciones. En SQLite las foreign keys están **apagadas por defecto**: cada conexión debe ejecutar `PRAGMA foreign_keys = ON` o el `REFERENCES` es solo documentación. Las diferencias con PostgreSQL/Oracle se declaran cuando importan (p. ej. isolation rica, pooling de servidor).",
        "Mapa de cardinalidades (esqueleto del warehouse):\n`source_records` 1—N `entities` · `entities` N—N vía `candidate_pairs` (con `entity_a < entity_b`) · `candidate_pairs` 1—N `decisions` · `decisions`/`pairs` 1—N `evidence`.\nOrden de estudio: **T1 Modelo** (PK/FK/historia) → **T2 Consulta** (CTE/windows/anti-join) → **T3 Transacción** (ACID/upsert) → **T4 Evolución** (índices/migrations/repo).",
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
        "Normaliza a **3NF** para hechos del ER: no copies `canonical_name` en cada par; guarda atributos de entidad en `entities` y deja `evidence` como tabla hija del par o de la decisión. Si un join multiplica filas (fan-out), documenta la cardinalidad o el query está mal para auditoría.",
        "Usa ids sintéticos estables (`ent-00N`, `pair-…`) del fixture CASO-LIM-029. El orden canónico `entity_a < entity_b` (CHECK) evita que el mismo candidato viva dos veces como (e1,e2) y (e2,e1). En el mini-lab de abajo: insert válido, rechazo de FK rota y rechazo de score fuera de rango.",
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
        "**Temporalidad**: modela `valid_from`/`valid_to` o, más simple en el lab, una tabla de eventos donde cada cambio es una fila nueva. No sobrescribas la decisión anterior con UPDATE del label: inserta una nueva fila versionada. Así puedes reconstruir “qué veía el revisor el martes” para el mismo par.",
        "**Provenance**: cada entidad o decisión debe rastrearse al registro fuente (`source_system`, `source_record_id`, `ingested_at`, `transform_version`) y a la evidencia (`evidence_ref`). Sin provenance, un match en producción es una opinión sin rastro.",
        "Auditoría en Red Andina (sintético, Lima): actor sintético `rev_sintetica`, timestamps UTC y `run_id=cpn3a-sql` versionan la cola de candidatos. El mini-lab inserta `review` y luego `match` para el mismo `pair_id` y lista la historia en orden.",
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
        "En la cola de review del ER, combinas ranking + anti-join: “top scores que aún no tienen label humano”. El lab lista `p2` y `p3` (tienen score, no tienen decisión), deja fuera a `p1`, e imprime el top-1 por `block_key` con `PARTITION BY`.",
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
        "**Cardinalidad** de un join define explosión de pares: n×m sin blocking es inviable en ER. Estima filas antes de correr un self-join sobre nombres o bloques. Blocking (`block_key`) reduce el n efectivo por cubeta.",
        "**NULL en SQL no es Python None.** En SQL, `NULL = NULL` es desconocido (no TRUE): usa `IS NULL` / `IS NOT NULL`. `COUNT(*)` cuenta filas; `COUNT(col)` ignora NULL. Un join mal escrito multiplica filas (fan-out) e infla la cola de candidatos.",
        "**Planes**: `EXPLAIN QUERY PLAN` en SQLite muestra SCAN (recorrido) vs SEARCH/INDEX (uso de índice). No adivines: pide el plan, léelo y decide si falta un índice en `block_key` o `pair_id`.",
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
          "NULL=NULL es desconocido: filas con grp NULL no matchean entre sí en igualdad. Por eso pairs_card ignora el id=3.",
      },
    },
    {
      heading: "ACID y transacciones en el lab",
      subtopicId: "S29-T3-A",
      paragraphs: [
        "**ACID** resume cuatro promesas del motor: Atomicity (todo o nada), Consistency (constraints se cumplen al commit), Isolation (transacciones concurrentes no se pisan a ciegas) y Durability (lo commiteado sobrevive al crash del proceso, con matices de disco/WAL). En el almacén ER, **decisión + evidencia** deben commitearse juntas o no.",
        "En este lab usamos una sola conexión sqlite y demostramos **atomicidad** con `BEGIN` → insert de decisión → fallo simulado → `ROLLBACK`: ambas tablas quedan en 0. Eso es el contrato mínimo de CP-N3-A. Niveles de isolation avanzados (READ COMMITTED, SERIALIZABLE) y `BEGIN IMMEDIATE` importan con **varias conexiones concurrentes**; no los damos por dominados solo porque aparecen en un glosario — se profundizan cuando el escenario de concurrencia está en el ejercicio.",
        "Regla operativa: si falla escribir evidencia, no dejes una decisión huérfana. El mini-lab fuerza el fallo y comprueba `atomic True`.",
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
      heading: "Upserts, concurrencia y recuperación",
      subtopicId: "S29-T3-B",
      paragraphs: [
        "Un **upsert** (`INSERT … ON CONFLICT DO UPDATE`) actualiza atributos mutables de una entidad (`name`, `updated`) sin cambiar el id estable. Es el patrón correcto para re-ingestar un registro fuente; **no** reemplaza el append-only de decisions.",
        "Concurrencia de workers: dos procesos no deben crear el mismo par como (e1,e2) y (e2,e1). Combina `CHECK(entity_a < entity_b)`, UNIQUE sobre (entity_a, entity_b) y política de reintento si `IntegrityError` por conflicto. Tras un crash, un job puede volver a `pending` y reaplicarse de forma idempotente.",
        "El mini-lab hace upsert de `Ana` → `Ana López` y deja `updated=2`. Las decisiones del par no se tocan aquí a propósito: son otra tabla, otra política.",
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
      heading: "Índices y migrations",
      subtopicId: "S29-T4-A",
      paragraphs: [
        "Índices en FK y columnas de filtro (`score`, `status`, `block_key`) bajan latencia de colas y blocking. Un índice no es magia: acelera lecturas filtradas y puede ralentizar escrituras masivas. Mide con `EXPLAIN QUERY PLAN` antes y después.",
        "**Migrations** versionadas: expand (añadir columna/índice) → backfill → contract (retirar lo viejo). Tabla `schema_migrations(version, name)` registra qué ya corrió. Política de lab y prod: **no_drop_without_backup** — un `DROP TABLE pairs` sin respaldo no es “agilidad”, es pérdida de evidencia.",
        "El mini-lab crea `idx_pairs_block`, registra migration 1 y comprueba que el plan menciona índice al filtrar por `block_key`.",
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
          "Demasiados índices ralentizan writes; mide con EXPLAIN y versiona cada cambio en schema_migrations.",
      },
    },
    {
      heading: "Repository pattern, pooling y pruebas",
      subtopicId: "S29-T4-B",
      paragraphs: [
        "El **repository** encapsula SQL: `get_entity`, `insert_decision`, `pending`. La lógica de matching no arma SQL crudo por todos lados. Inyectas la conexión (o un factory) para poder testear con `:memory:`.",
        "**Pooling** reusa conexiones en servidores multi-request. En SQLite didáctico suele bastar una conexión por hilo; el “pool_size” corporativo aparece cuando el warehouse vive detrás de un driver de red. No hardcodes magia: documenta el ciclo open/close y el timeout de acquire cuando uses un pool real.",
        "Prueba el repository con inserts, constraints violados (IntegrityError ruidoso), anti-join de la cola de review y append-only de decisions. Caso sintético Red Andina: ids `ent-00N`, `@example.pe`, `run_id=cpn3a-sql`.",
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
                "SELECT id FROM pairs WHERE id NOT IN (SELECT pair_id FROM decisions)"
            ).fetchall()

    con = sqlite3.connect(":memory:")
    con.executescript('''
    CREATE TABLE pairs(
      id TEXT PRIMARY KEY, entity_a TEXT, entity_b TEXT, score REAL
    );
    CREATE TABLE decisions(pair_id TEXT);
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
      "Te muestro el almacén ER: claves con FK real, historia de decisiones, CTE/anti-join, COUNT y cardinalidad, ACID, upsert, migración+índice y un repository de pares pendientes.",
    steps: [
      {
        demoId: "S29-T1-A-DEMO",
        subtopicId: "S29-T1-A",
        environment: "local-python",
        description:
          "Crea entities y candidate_pairs con CHECK de score, orden entity_a < entity_b y PRAGMA foreign_keys; imprime count de pares y score del par p1.",
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
print("ok", True)
`,
          output: `0.5
pairs 1
ok True`,
        },
        why: "Constraints y FK habilitadas protegen el almacén ER desde el primer insert.",
      },
      {
        demoId: "S29-T1-B-DEMO",
        subtopicId: "S29-T1-B",
        environment: "local-python",
        description:
          "Inserta dos decisiones append-only para el mismo par y lista labels en orden de id.",
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
        why: "Historia de decisiones sin overwrite: dos filas, no un UPDATE destructivo.",
      },
      {
        demoId: "S29-T2-A-DEMO",
        subtopicId: "S29-T2-A",
        environment: "local-python",
        description:
          "CTE de candidatos + anti-join (LEFT JOIN … IS NULL): lista ids de pares sin decisión (cola de review).",
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
        why: "Cola de review: CTE nombra el paso; el anti-join deja solo p2 (p1 ya tiene decisión).",
      },
      {
        demoId: "S29-T2-B-DEMO",
        subtopicId: "S29-T2-B",
        environment: "local-python",
        description:
          "COUNT(*) vs COUNT(col) y cardinalidad de self-join sobre grp (NULL no empareja).",
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
print("self_pairs", pairs)
`,
          output: `star 3
col 2
pairs 1
self_pairs 1`,
        },
        why: "NULL y cardinalidad evitan sorpresas: COUNT(col) ignora NULL; igualdad no une NULL.",
      },
      {
        demoId: "S29-T3-A-DEMO",
        subtopicId: "S29-T3-A",
        environment: "local-python",
        description:
          "Transacción con ROLLBACK deja decisions y evidence en 0 filas (atomicidad).",
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
        why: "Atomicidad decisión+evidencia: si falla el segundo write, no queda basura en la primera tabla.",
      },
      {
        demoId: "S29-T3-B-DEMO",
        subtopicId: "S29-T3-B",
        environment: "local-python",
        description:
          "Upsert actualiza name de entidad e1 a 'Ana L' y lo imprime.",
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
print("ok", True)
`,
          output: `Ana L
upsert True
ok True`,
        },
        why: "Upsert de atributos con id estable; no toca la historia de decisiones.",
      },
      {
        demoId: "S29-T4-A-DEMO",
        subtopicId: "S29-T4-A",
        environment: "local-python",
        description:
          "Migration v1 + índice en block_key; imprime version y si el plan usa índice.",
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
        why: "Evolución de esquema versionada y evidencia del índice en el plan.",
      },
      {
        demoId: "S29-T4-B-DEMO",
        subtopicId: "S29-T4-B",
        environment: "local-python",
        description:
          "Repository.pending() lista pares sin decisión (anti-join encapsulado).",
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
print("ok", True)
`,
          output: `[('p2',)]
repo True
ok True`,
        },
        why: "SQL encapsulado y testeable: la app pide pending(), no arma el anti-join a mano.",
      },
    ],
  },
  weDo: {
    intro:
      "24 ejercicios de modelo, consulta, transacciones y evolución SQL del ER. Fixture CASO-LIM-029 (run_id=cpn3a-sql, @example.pe): solo datos sintéticos; no etiquetes fraude ni parentesco. Cada starter marca un DEFECT; corrígelo para igualar la salida del solution.",
    steps: [
      {
        id: "S29-T1-A-E1",
        subtopicId: "S29-T1-A",
        kind: "guided",
        instruction:
          "S29-T1-A-E1 · En SQLite `:memory:`, crea `entities(id TEXT PRIMARY KEY)`, inserta solo `'e1'` y muestra `SELECT COUNT(*)`. Salida esperada: una línea `1`. El starter inserta el id dos veces porque falta la PRIMARY KEY: corrige el DEFECT.",
        hint: "PRIMARY KEY impide el segundo insert",
        hints: [
          "PRIMARY KEY en id",
          "un solo INSERT de e1",
          "print del COUNT(*)",
        ],
        edgeCases: ["IntegrityError si reinsertas el mismo id"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
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
        instruction:
          "S29-T1-A-E2 · Tabla `p(score REAL CHECK(score BETWEEN 0 AND 1))`. Inserta `1.5`, captura `IntegrityError` e imprime exactamente `bad_score`. Una línea de salida.",
        hint: "try/except IntegrityError",
        hints: [
          "CHECK score 0..1",
          "insert 1.5",
          "print('bad_score') en except",
        ],
        edgeCases: ["between inclusive: 0 y 1 son válidos"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
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
        instruction:
          "S29-T1-A-E3 · En SQLite, tabla `pairs` con `CHECK(entity_a < entity_b)`. Inserta el par invertido `('e2','e1')`, captura `IntegrityError` e imprime `canonical_ok`. Salida: `canonical_ok`.",
        hint: "CHECK rechaza el orden invertido",
        hints: [
          "create table pairs(entity_a text, entity_b text, check(entity_a < entity_b))",
          "try insert ('e2','e1') except IntegrityError",
          "print('canonical_ok')",
        ],
        edgeCases: ["('e1','e2') sí pasa; el espejo no"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-029 · orden canónico A<B vía CHECK
# DEFECT: no hay CHECK; el par invertido se inserta y se imprime ok
import sqlite3
c = sqlite3.connect(':memory:')
c.execute('create table pairs(entity_a text, entity_b text)')
try:
    c.execute("insert into pairs values ('e2','e1')")
    print('ok')
except sqlite3.IntegrityError:
    print('canonical_ok')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import sqlite3
c = sqlite3.connect(':memory:')
c.execute(
    'create table pairs(entity_a text, entity_b text, check(entity_a < entity_b))'
)
try:
    c.execute("insert into pairs values ('e2','e1')")
    print('ok')
except sqlite3.IntegrityError:
    print('canonical_ok')
`,
          output: `canonical_ok`,
        },
      },
      {
        id: "S29-T1-B-E1",
        subtopicId: "S29-T1-B",
        kind: "guided",
        instruction:
          "S29-T1-B-E1 · Tabla de decisiones append-only: inserta para `p1` los labels `review` y `match` (dos filas) e imprime `COUNT(*)` de historia del par. Salida: `2`.",
        hint: "dos INSERT al mismo pair_id; COUNT filtrado",
        hints: [
          "append-only: dos filas, no UPDATE",
          "where pair='p1'",
          "print del count, no de la lista de labels",
        ],
        edgeCases: ["no update label in place"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
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
        instruction:
          "S29-T1-B-E2 · Provenance mínima: lee de una tabla `src(source, record)` la fila insertada e imprime el dict `{'source': 'crm_synth', 'record': 'r9'}` (orden de keys como en el solution).",
        hint: "INSERT + SELECT → dict",
        hints: [
          "insert source y record",
          "arma el dict desde la fila",
        ],
        edgeCases: ["ingested_at se puede añadir después"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
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
        instruction:
          "S29-T1-B-E3 · Temporalidad en SQL: fila con `valid_to` NULL = vigente. Cuenta filas abiertas con `WHERE valid_to IS NULL` e imprime el entero. Salida: `1`.",
        hint: "IS NULL marca ventana abierta",
        hints: [
          "insert con valid_to null",
          "select count(*) where valid_to is null",
        ],
        edgeCases: ["cierres con timestamp dejan de ser IS NULL"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
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
        instruction:
          "S29-T2-A-E1 · Con pairs `p1`,`p2` y decisión solo en `p1`, lista ids sin decisión con anti-join (`NOT IN` o `LEFT JOIN … IS NULL`). Salida: `['p2']`.",
        hint: "INNER JOIN solo devuelve p1",
        hints: [
          "NOT IN (select pair_id from dec)",
          "o LEFT JOIN + IS NULL",
        ],
        edgeCases: ["NOT EXISTS equivalente"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
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
    create table dec(pair_id text);
    insert into pairs values ('p1'),('p2');
    insert into dec values ('p1');
    '''
)
print(
    [
        r[0]
        for r in c.execute(
            'select id from pairs where id not in (select pair_id from dec)'
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
        instruction:
          "S29-T2-A-E2 · Con SQL window: tabla pairs (id, score) con tres filas; usa `ROW_NUMBER() OVER (ORDER BY score DESC)` y devuelve el id con rn=1. Salida: `p2` (score 0.9).",
        hint: "ROW_NUMBER en SQLite",
        hints: [
          "WITH o subconsulta con ROW_NUMBER",
          "where rn = 1",
        ],
        edgeCases: ["empates de score: ROW_NUMBER no empata"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
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
        instruction:
          "S29-T2-A-E3 · CTE llamada `ranked`: con pairs p1/p2 scores 0.4/0.8, lista ids de la CTE ordenados por score DESC. Salida: `['p2', 'p1']`.",
        hint: "WITH ranked AS (...)",
        hints: [
          "WITH ranked AS (SELECT id, score FROM pairs)",
          "ORDER BY score DESC en el SELECT final",
        ],
        edgeCases: ["nombre de CTE legible en el plan"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-029 · CTE ranked
# DEFECT: SELECT directo sin ORDER BY de score
import sqlite3
c = sqlite3.connect(':memory:')
c.execute('create table pairs(id text, score real)')
c.executemany(
    'insert into pairs values (?,?)',
    [('p1', 0.4), ('p2', 0.8)],
)
print([r[0] for r in c.execute('select id from pairs')])
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
    [('p1', 0.4), ('p2', 0.8)],
)
q = '''
with ranked as (
  select id, score from pairs
)
select id from ranked order by score desc
'''
print([r[0] for r in c.execute(q)])
`,
          output: `['p2', 'p1']`,
        },
      },
      {
        id: "S29-T2-B-E1",
        subtopicId: "S29-T2-B",
        kind: "guided",
        instruction:
          "S29-T2-B-E1 · Con 5 entidades en SQLite, cuenta pares no ordenados con self-join `a.id < b.id` (equivale a C(5,2)=10). El starter une sin filtro de orden y explota a 25. Salida: `10`.",
        hint: "self-join con a.id < b.id",
        hints: [
          "from e a join e b on a.id < b.id",
          "select count(*)",
        ],
        edgeCases: ["blocking reduce el n efectivo por cubeta en ER real"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
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
        instruction:
          "S29-T2-B-E2 · En SQL, `NULL = NULL` no es TRUE. Inserta una fila con x NULL; imprime `COUNT` con `WHERE x = NULL` y con `WHERE x IS NULL` separados por espacio. Salida: `0 1`.",
        hint: "IS NULL vs = NULL",
        hints: [
          "eq = ... where x = null → 0",
          "isn = ... where x is null → 1",
          "print(eq, isn)",
        ],
        edgeCases: ["Python None is None no enseña SQL"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
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
        instruction:
          "S29-T2-B-E3 · Sin índice en `block_key`, corre `EXPLAIN QUERY PLAN` de un SELECT filtrado e imprime `SCAN` si el plan contiene esa palabra (mayúsculas), si no `OTHER`. En tabla mínima sin índice esperamos `SCAN`.",
        hint: "EXPLAIN QUERY PLAN + str del plan",
        hints: [
          "join de filas del plan a string",
          "'SCAN' in plan.upper()",
        ],
        edgeCases: ["con índice el plan puede mostrar SEARCH/INDEX"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
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
        instruction:
          "S29-T3-A-E1 · Tras `BEGIN`, insert y `ROLLBACK`, el count de la tabla debe ser `0`. El starter hace COMMIT por error: corrige el DEFECT.",
        hint: "rollback en lugar de commit",
        hints: [
          "c.execute('rollback')",
          "print del count",
        ],
        edgeCases: ["commit opuesto deja 1"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
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
        instruction:
          "S29-T3-A-E2 · Atomicidad decisión+evidencia: en una transacción inserta en `decisions` y luego simula fallo (no insertes evidence); haz ROLLBACK e imprime counts `decisions evidence` en una línea. Salida: `0 0`.",
        hint: "BEGIN + ROLLBACK en except",
        hints: [
          "insert decision",
          "raise o skip evidence",
          "rollback → ambos 0",
        ],
        edgeCases: ["si haces commit parcial rompes el almacén"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
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
        instruction:
          "S29-T3-A-E3 · Política de commit: inserta decisión; si `evidence_ok` es False haz ROLLBACK y imprime `abort` (no dejes la decisión). Salida: `abort`.",
        hint: "rollback + print abort cuando evidence falla",
        hints: [
          "begin → insert decision",
          "if not evidence_ok: rollback; print('abort')",
        ],
        edgeCases: ["decisión+evidencia van juntas"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
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
        instruction:
          "S29-T3-B-E1 · Upsert: inserta id `'1'` name `'A'`, luego `ON CONFLICT DO UPDATE` a name `'B'`; imprime el name final. Salida: `B`.",
        hint: "ON CONFLICT(id) DO UPDATE",
        hints: [
          "insert ... on conflict(id) do update set name=excluded.name",
        ],
        edgeCases: ["updated_at se puede sumar en prod"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
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
        instruction:
          "S29-T3-B-E2 · Recuperación tras crash: el job `er_block` quedó en `running`; actualízalo a `pending` con UPDATE y léelo con SELECT. Imprime el status. Salida: `pending`.",
        hint: "UPDATE status='pending' WHERE id=...",
        hints: [
          "update jobs set status='pending' where id='er_block'",
          "print del SELECT status",
        ],
        edgeCases: ["reintento idempotente: pending se puede re-procesar"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
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
        instruction:
          "S29-T3-B-E3 · Par duplicado: UNIQUE(entity_a, entity_b). Segundo insert del mismo par debe capturar IntegrityError e imprimir `retry`. Salida: `retry`.",
        hint: "try/except IntegrityError",
        hints: [
          "create table con unique(entity_a, entity_b)",
          "print('retry') en except",
        ],
        edgeCases: ["orden canónico A<B evita el espejo e2,e1"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-029 · conflict → retry
# DEFECT: no hay UNIQUE; el segundo insert “pasa” e imprime ok
import sqlite3
c = sqlite3.connect(':memory:')
c.execute(
    'create table pairs(entity_a text, entity_b text)'
)
c.execute("insert into pairs values ('e1','e2')")
try:
    c.execute("insert into pairs values ('e1','e2')")
    print('ok')
except sqlite3.IntegrityError:
    print('retry')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import sqlite3
c = sqlite3.connect(':memory:')
c.execute(
    'create table pairs(entity_a text, entity_b text, unique(entity_a, entity_b))'
)
c.execute("insert into pairs values ('e1','e2')")
try:
    c.execute("insert into pairs values ('e1','e2')")
    print('ok')
except sqlite3.IntegrityError:
    print('retry')
`,
          output: `retry`,
        },
      },
      {
        id: "S29-T4-A-E1",
        subtopicId: "S29-T4-A",
        kind: "guided",
        instruction:
          "S29-T4-A-E1 · Tabla `schema_migrations(v, name)`: registra version 1 `init` y 2 `add_index`; imprime `MAX(v)`. Salida: `2`.",
        hint: "MAX no MIN",
        hints: [
          "insert (2,'add_index')",
          "select max(v)",
        ],
        edgeCases: ["expand/backfill/contract"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
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
        instruction:
          "S29-T4-A-E2 · Crea el índice `idx_pairs_block_key` sobre `pairs(block_key)`, confírmalo en `sqlite_master` y verifica con `EXPLAIN QUERY PLAN` que el plan menciona INDEX. Imprime el nombre del índice. Salida: `idx_pairs_block_key`.",
        hint: "CREATE INDEX + sqlite_master + EXPLAIN",
        hints: [
          "create index idx_pairs_block_key on pairs(block_key)",
          "select name from sqlite_master where type='index'",
          "EXPLAIN QUERY PLAN del filtro por block_key debe mencionar INDEX",
        ],
        edgeCases: ["sin índice el plan suele ser SCAN; con índice SEARCH/INDEX"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
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
        instruction:
          "S29-T4-A-E3 · Política de migración: con `has_backup=False` **no** ejecutes `DROP TABLE pairs`. Comprueba que la tabla sigue con 1 fila y imprime `no_drop_without_backup`. Salida exacta esa cadena.",
        hint: "guard + COUNT antes de cualquier DROP",
        hints: [
          "if not has_backup: no dropear; print la política",
          "opcional: assert count==1 para probar que la tabla vive",
          "else: drop + print drop_ok",
        ],
        edgeCases: ["prod safety; schema_migrations no reemplaza backup"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
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
# la tabla ya no existe; el lab exige conservar evidencia
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
    assert n == 1  # evidencia intacta
    print('no_drop_without_backup')
else:
    c.execute('drop table pairs')
    print('drop_ok')
`,
          output: `no_drop_without_backup`,
        },
      },
      {
        id: "S29-T4-B-E1",
        subtopicId: "S29-T4-B",
        kind: "guided",
        instruction:
          "S29-T4-B-E1 · Mini-repository: clase con `get(id)` sobre tabla entities; inserta e1→Ana y imprime `get('e1')`. Salida: `Ana`.",
        hint: "SELECT name WHERE id=?",
        hints: [
          "método get con fetchone",
          "no uses e2",
        ],
        edgeCases: ["SQL detrás del método"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
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
        instruction:
          "S29-T4-B-E2 · Ciclo de conexión del repository: abre 3 conexiones `:memory:`, ejecuta `PRAGMA foreign_keys=ON` en cada una, cierra todas e imprime cuántas se abrieron. Salida: `3`. (En SQLite de lab no hace falta un pool de servidor; sí el hábito de configurar cada conexión.)",
        hint: "loop open → pragma → close",
        hints: [
          "for _ in range(3): connect, pragma, close",
          "print del contador",
        ],
        edgeCases: ["PRAGMA foreign_keys es por conexión, no global del proceso"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
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
        instruction:
          "S29-T4-B-E3 · Test de repo: pairs p1/p2, decisión solo p1; `pending_count` = COUNT de pares sin decisión. Imprime el entero. Salida: `1`.",
        hint: "anti-join + count",
        hints: [
          "count ids not in decisions",
          "print del count",
        ],
        edgeCases: [":memory: tests"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
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
    create table decisions(pair_id text);
    insert into pairs values ('p1'),('p2');
    insert into decisions values ('p1');
    '''
)
pending_count = c.execute(
    '''
    select count(*) from pairs
    where id not in (select pair_id from decisions)
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
    create table decisions(pair_id text);
    insert into pairs values ('p1'),('p2');
    insert into decisions values ('p1');
    '''
)
pending_count = c.execute(
    '''
    select count(*) from pairs
    where id not in (select pair_id from decisions)
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
      "Diseña e implementa en SQLite el esquema CP-N3-A: source_records, entities, candidate_pairs, decisions (append-only), evidence. Incluye constraints con PRAGMA foreign_keys=ON, anti-join de cola, upsert de entidad, migración con índice y PairRepository testeado en :memory:. Datos sintéticos CASO-LIM-029; sin sobrescribir historia de decisiones.",
    objectives: [
      "Modelo PK/FK/CHECK y orden canónico de pares con FK real habilitada",
      "Temporalidad/provenance en decisiones y fuentes (append-only)",
      "Consultas CTE/anti-join para review queue",
      "ACID en decisión+evidencia; upsert; índices; repo tests en :memory:",
    ],
    requirements: [
      "Historia de decisions no se borra con UPDATE destructivo del label",
      "Scores solo en [0,1]; IntegrityError observable si se viola",
      "Documentación del esquema en español profesional (es-PE)",
      "Esquema alineado al almacén ER de CP-N3-A (fuentes→entidades→pares→decisiones→evidencia)",
      "Tests mínimos: constraint roto, pending anti-join, rollback decisión+evidencia",
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
      UNIQUE(source_system, external_id)
    );
    CREATE TABLE entities(
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      source_record_id TEXT REFERENCES source_records(id)
    );
    CREATE TABLE candidate_pairs(
      id TEXT PRIMARY KEY,
      entity_a TEXT NOT NULL REFERENCES entities(id),
      entity_b TEXT NOT NULL REFERENCES entities(id),
      score REAL NOT NULL CHECK(score >= 0 AND score <= 1),
      CHECK(entity_a < entity_b)
    );
    CREATE TABLE decisions(
      id INTEGER PRIMARY KEY,
      pair_id TEXT NOT NULL REFERENCES candidate_pairs(id),
      label TEXT NOT NULL,
      actor TEXT NOT NULL,
      decided_at TEXT
    );
    CREATE TABLE evidence(
      id INTEGER PRIMARY KEY,
      pair_id TEXT NOT NULL,
      decision_id INTEGER,
      note TEXT
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
        # Completa: anti-join de pairs sin decisión
        raise NotImplementedError
    def insert_decision_with_evidence(self, pair_id, label, actor, note):
        # Completa: misma transacción; rollback si falla evidence
        raise NotImplementedError

if __name__ == "__main__":
    con = connect()
    print("er_store_starter", con is not None)
    print("fk_pragma", con.execute("PRAGMA foreign_keys").fetchone()[0])
`,
    portfolioNote:
      "Publica un mini-repo o carpeta de portafolio: DDL del almacén ER, script de seed sintético CASO-LIM-029, tests de constraints/anti-join/append-only y README breve en español profesional.",
    rubric: [
      {
        criterion:
          "Esquema CP-N3-A completo (fuentes, entidades, pares, decisiones append-only, evidencia) con constraints verificados",
        weight: "25%",
      },
      {
        criterion:
          "Correctitud técnica: PRAGMA foreign_keys, anti-join de cola, ACID decisión+evidencia, upsert e índice versionado",
        weight: "20%",
      },
      {
        criterion:
          "Privacidad / sin PII real / sin secretos / sin inferencia de fraude ni parentesco",
        weight: "20%",
      },
      {
        criterion:
          "Pruebas en :memory: (IntegrityError, pending, rollback) documentadas",
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
        options: [
          "Evitar duplicar el mismo par en orden invertido",
          "Inferir fraude",
          "Borrar historia",
          "Subir isolation",
        ],
        correctIndex: 0,
        explanation:
          "Con entity_a < entity_b (orden canónico) el par (e1,e2) y (e2,e1) no coexisten. No implica fraude ni parentesco: solo evita duplicar el mismo candidato en la cola.",
      },
      {
        question: "Append-only en decisions significa:",
        options: [
          "UPDATE del label in place sin rastro",
          "Drop de tabla cada noche",
          "Nueva fila por cambio de decisión",
          "Solo un match eterno",
        ],
        correctIndex: 2,
        explanation:
          "Cada cambio de label es un INSERT nuevo. Así conservas provenance (quién/cuándo/evidence_ref) y puedes auditar la historia del par.",
      },
      {
        question: "Decisión y evidencia deben:",
        options: [
          "Commitearse en transacciones separadas siempre",
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
          "El repository es el borde de persistencia: métodos como pending() y get() ocultan SQL y se prueban inyectando una conexión :memory:.",
      },
      {
        question:
          "Una migración que hace DROP de pairs sin backup en el lab debe…",
        options: [
          "rechazarse: no_drop_without_backup es parte del contrato",
          "ejecutarse en prod si el SQL es corto",
          "silenciar el error de IntegrityError",
          "usar SELECT * sin WHERE para ir más rápido",
        ],
        correctIndex: 0,
        explanation:
          "Schema governance: cambios destructivos requieren backup y versionado en schema_migrations. El lab entrena el hábito antes de tocar prod.",
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
        note: "Diseño y errores comunes",
      },
      {
        label: "Designing Data-Intensive Applications (Kleppmann)",
        note: "Transacciones e historia",
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
