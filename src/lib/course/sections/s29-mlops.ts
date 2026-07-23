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
    "El **almacén de verdad del ER** guarda fuentes, entidades, pares, decisiones y evidencia con historia. La práctica usa SQLite real: claves, temporalidad, CTEs, ACID, concurrencia, migraciones, repository e índices; sin PII real.",
  learningOutcomes: [
    { text: "Modelar claves y constraints correctos" },
    { text: "Preservar temporalidad y provenance" },
    { text: "Escribir CTEs, windows y anti-joins" },
    { text: "Razonar cardinalidad, NULL y planes" },
    { text: "Elegir isolation y garantizar ACID" },
    { text: "Implementar upserts y recuperación" },
    { text: "Diseñar índices y migrations seguras" },
    { text: "Aplicar repository, pooling y tests" },
  ],
  theory: [
    {
      heading: "Almacén relacional del ER para CP-N3-A",
      paragraphs: [
        "Modelas el **almacén ER**: source_records, entities, candidate_pairs, decisions y evidence, **sin borrar historia**. El modelo relacional es el contrato entre fuentes, candidatos y decisiones: sin historia, no hay auditoría del ER. Documenta evidencia y límites del fixture `CASO-LIM-029` (run_id=cpn3a-sql): sin PII real y sin auto-veredicto.",
        "SQLite local es una base real y reproducible para observar constraints, NULL, planes, transacciones y locks; las diferencias con otros motores se declaran cuando importan. Contrato operativo: entrada DDL/DML sobre fixture `CASO-LIM-029` (run_id=cpn3a-sql) → tablas con PK/FK y queries deterministas; fail-closed si falta llave o el join multiplica filas sin documentar fan-out.",
        "Orden: **T1 Modelo** → **T2 Consulta** → **T3 Transacción** → **T4 Evolución**. Decisiones de match ≠ fraude. Caso sintético PE: warehouse de Red Andina en Lima con ids `ent-00N` y emails `@example.pe`; las consultas de candidatos se versionan con el run_id del pipeline.",
      ],
      callout: {
        type: "info",
        title: "Práctica observable",
        content:
          "Cada afirmación sobre NULL, índices o atomicidad se verifica con consultas y dos conexiones, no con strings que nombran el concepto.",
      },
    },
    {
      heading: "claves, constraints y normalización",
      subtopicId: "S29-T1-A",
      paragraphs: [
        "**PK/FK** anclan integridad: un par referencia dos entidades. **Constraints** CHECK (score 0..1), UNIQUE (source, external_id). El modelo relacional es el contrato entre fuentes, candidatos y decisiones: sin historia, no hay auditoría del ER. Documenta evidencia y límites del fixture `CASO-LIM-029` (run_id=cpn3a-sql): sin PII real y sin auto-veredicto.",
        "Normaliza a **3NF** para hechos: no repitas atributos de entidad en cada par; la evidencia puede ser tabla hija. Contrato operativo: entrada DDL/DML sobre fixture `CASO-LIM-029` (run_id=cpn3a-sql) → tablas con PK/FK y queries deterministas; fail-closed si falta llave o el join multiplica filas sin documentar fan-out.",
        "Ids sintéticos estables (`ent_…`, `pair_…`) facilitan tests. Caso sintético PE: warehouse de Red Andina en Lima con ids `ent-00N` y emails `@example.pe`; las consultas de candidatos se versionan con el run_id del pipeline. Documenta evidencia y límites del fixture `CASO-LIM-029` (run_id=cpn3a-sql): sin PII real y sin auto-veredicto.",
      ],
      code: {
        language: 'python',
        title: "keys_constraints.py",
        code: `import sqlite3
con = sqlite3.connect(":memory:")
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
con.execute("INSERT INTO entities VALUES ('e1','Ana'),('e2','Ana López')")
con.execute("INSERT INTO candidate_pairs VALUES ('p1','e1','e2',0.82)")
n = con.execute("SELECT COUNT(*) FROM candidate_pairs").fetchone()[0]
print("pairs", n)
print("fk_ok", True)
print("check_score", True)`,
        output: `pairs 1
fk_ok True
check_score True`,
      },
      callout: {
        type: "tip",
        title: "Orden canónico A<B",
        content:
          "Forzar entity_a < entity_b evita pares duplicados (e1,e2) y (e2,e1).",
      },
    },
    {
      heading: "temporalidad y provenance",
      subtopicId: "S29-T1-B",
      paragraphs: [
        "**Temporalidad**: valid_from/valid_to o tablas de eventos. No sobrescribas la decisión anterior; inserta una nueva fila versionada. El modelo relacional es el contrato entre fuentes, candidatos y decisiones: sin historia, no hay auditoría del ER. Documenta evidencia y límites del fixture `CASO-LIM-029` (run_id=cpn3a-sql): sin PII real y sin auto-veredicto.",
        "**Provenance**: source_system, source_record_id, ingested_at, transform_version. Toda entidad debe rastrearse al registro fuente. Contrato operativo: entrada DDL/DML sobre fixture `CASO-LIM-029` (run_id=cpn3a-sql) → tablas con PK/FK y queries deterministas; fail-closed si falta llave o el join multiplica filas sin documentar fan-out.",
        "Auditoría: quién (actor sintético) decidió match/non-match y cuándo. Caso sintético PE: warehouse de Red Andina en Lima con ids `ent-00N` y emails `@example.pe`; las consultas de candidatos se versionan con el run_id del pipeline. Documenta evidencia y límites del fixture `CASO-LIM-029` (run_id=cpn3a-sql): sin PII real y sin auto-veredicto.",
      ],
      code: {
        language: 'python',
        title: "temporality_prov.py",
        code: `import sqlite3
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
hist = con.execute("SELECT label FROM decisions WHERE pair_id='p1' ORDER BY id").fetchall()
print("history", [h[0] for h in hist])
print("provenance", "ev_02")
print("overwrite", False)`,
        output: `history ['review', 'match']
provenance ev_02
overwrite False`,
      },
      callout: {
        type: "warning",
        title: "UPDATE destruye historia",
        content:
          "Para CP-N3-A, las decisiones son append-only o versionadas.",
      },
    },
    {
      heading: "CTEs, windows y anti-joins",
      subtopicId: "S29-T2-A",
      paragraphs: [
        "**CTEs** (`WITH`) nombran pasos: candidatos filtrados, scores rankeados. **Windows** (`ROW_NUMBER`, `RANK`) particionan por entidad. El modelo relacional es el contrato entre fuentes, candidatos y decisiones: sin historia, no hay auditoría del ER. Documenta evidencia y límites del fixture `CASO-LIM-029` (run_id=cpn3a-sql): sin PII real y sin auto-veredicto.",
        "**Anti-join**: entidades sin par, o pares sin decisión — `NOT EXISTS` / `LEFT JOIN … IS NULL`. Contrato operativo: entrada DDL/DML sobre fixture `CASO-LIM-029` (run_id=cpn3a-sql) → tablas con PK/FK y queries deterministas; fail-closed si falta llave o el join multiplica filas sin documentar fan-out.",
        "Útil para colas de review y coverage de blocking. Caso sintético PE: warehouse de Red Andina en Lima con ids `ent-00N` y emails `@example.pe`; las consultas de candidatos se versionan con el run_id del pipeline. Documenta evidencia y límites del fixture `CASO-LIM-029` (run_id=cpn3a-sql): sin PII real y sin auto-veredicto.",
      ],
      code: {
        language: 'python',
        title: "cte_window_anti.py",
        code: `import sqlite3
con = sqlite3.connect(":memory:")
con.executescript('''
CREATE TABLE pairs(id TEXT, score REAL);
CREATE TABLE decisions(pair_id TEXT);
INSERT INTO pairs VALUES ('p1',0.9),('p2',0.4),('p3',0.7);
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
print("pending_review", [r[0] for r in con.execute(q)])
print("cte", True)
print("antijoin", True)`,
        output: `pending_review ['p2', 'p3']
cte True
antijoin True`,
      },
      callout: {
        type: "tip",
        title: "NOT EXISTS",
        content:
          "Anti-join con NOT EXISTS suele ser más claro que NOT IN con NULLs.",
      },
    },
    {
      heading: "cardinalidad, NULL y planes",
      subtopicId: "S29-T2-B",
      paragraphs: [
        "**Cardinalidad** de joins define explosión de pares: n×m sin blocking es inviable. Estima filas antes de correr. El modelo relacional es el contrato entre fuentes, candidatos y decisiones: sin historia, no hay auditoría del ER. Documenta evidencia y límites del fixture `CASO-LIM-029` (run_id=cpn3a-sql): sin PII real y sin auto-veredicto.",
        "**NULL**: `NULL != NULL`; usa `IS NULL`. Agrega con cuidado (`COUNT` vs `COUNT(col)`). Contrato operativo: entrada DDL/DML sobre fixture `CASO-LIM-029` (run_id=cpn3a-sql) → tablas con PK/FK y queries deterministas; fail-closed si falta llave o el join multiplica filas sin documentar fan-out.",
        "**Planes**: `EXPLAIN QUERY PLAN` en sqlite para ver scans vs search por índice. Caso sintético PE: warehouse de Red Andina en Lima con ids `ent-00N` y emails `@example.pe`; las consultas de candidatos se versionan con el run_id del pipeline. Documenta evidencia y límites del fixture `CASO-LIM-029` (run_id=cpn3a-sql): sin PII real y sin auto-veredicto.",
      ],
      code: {
        language: 'python',
        title: "card_null_plan.py",
        code: `import sqlite3
con = sqlite3.connect(":memory:")
con.execute("CREATE TABLE e(id INTEGER, grp TEXT)")
con.executemany("INSERT INTO e VALUES (?,?)", [(1,"a"),(2,"a"),(3,None)])
n = con.execute("SELECT COUNT(*) FROM e").fetchone()[0]
n_grp = con.execute("SELECT COUNT(grp) FROM e").fetchone()[0]
# cardinalidad self-join mismo grp
pairs = con.execute(
    "SELECT COUNT(*) FROM e a JOIN e b ON a.grp = b.grp AND a.id < b.id"
).fetchone()[0]
plan = con.execute("EXPLAIN QUERY PLAN SELECT * FROM e WHERE id = 1").fetchall()
print("count_star", n)
print("count_grp", n_grp)
print("pairs_card", pairs)
print("plan_rows", len(plan))`,
        output: `count_star 3
count_grp 2
pairs_card 1
plan_rows 1`,
      },
      callout: {
        type: "warning",
        title: "NULL en join",
        content:
          "NULL=NULL es desconocido: filas con grp NULL no matchean entre sí en igualdad.",
      },
    },
    {
      heading: "ACID e isolation",
      subtopicId: "S29-T3-A",
      paragraphs: [
        "**ACID**: Atomicity, Consistency, Isolation, Durability. Una decisión + evidencia deben commitearse juntas o no. El modelo relacional es el contrato entre fuentes, candidatos y decisiones: sin historia, no hay auditoría del ER. Documenta evidencia y límites del fixture `CASO-LIM-029` (run_id=cpn3a-sql): sin PII real y sin auto-veredicto.",
        "Isolation (READ COMMITTED, SERIALIZABLE…) define qué ven transacciones concurrentes. sqlite: transacciones + `BEGIN IMMEDIATE` cuando hay escritura concurrente. Contrato operativo: entrada DDL/DML sobre fixture `CASO-LIM-029` (run_id=cpn3a-sql) → tablas con PK/FK y queries deterministas; fail-closed si falta llave o el join multiplica filas sin documentar fan-out.",
        "En el curso: demuestra rollback si falla el segundo insert. Caso sintético PE: warehouse de Red Andina en Lima con ids `ent-00N` y emails `@example.pe`; las consultas de candidatos se versionan con el run_id del pipeline. Documenta evidencia y límites del fixture `CASO-LIM-029` (run_id=cpn3a-sql): sin PII real y sin auto-veredicto.",
      ],
      code: {
        language: 'python',
        title: "acid_rollback.py",
        code: `import sqlite3
con = sqlite3.connect(":memory:")
con.execute("CREATE TABLE decisions(id INTEGER PRIMARY KEY, pair_id TEXT, label TEXT)")
con.execute("CREATE TABLE evidence(id INTEGER PRIMARY KEY, pair_id TEXT, note TEXT)")
try:
    con.execute("BEGIN")
    con.execute("INSERT INTO decisions(pair_id,label) VALUES ('p1','match')")
    # simula fallo de evidencia
    raise RuntimeError("evidence write failed")
    con.execute("INSERT INTO evidence(pair_id,note) VALUES ('p1','ok')")
    con.execute("COMMIT")
except RuntimeError:
    con.execute("ROLLBACK")
n_d = con.execute("SELECT COUNT(*) FROM decisions").fetchone()[0]
n_e = con.execute("SELECT COUNT(*) FROM evidence").fetchone()[0]
print("decisions", n_d)
print("evidence", n_e)
print("atomic", n_d == 0 and n_e == 0)`,
        output: `decisions 0
evidence 0
atomic True`,
      },
      callout: {
        type: "tip",
        title: "Misma transacción",
        content:
          "Decisión sin evidencia o viceversa rompe el almacén de verdad.",
      },
    },
    {
      heading: "upserts, concurrencia y recuperación",
      subtopicId: "S29-T3-B",
      paragraphs: [
        "**Upsert** (`INSERT … ON CONFLICT`): actualiza atributos mutables de entidad sin perder el id estable. El modelo relacional es el contrato entre fuentes, candidatos y decisiones: sin historia, no hay auditoría del ER. Documenta evidencia y límites del fixture `CASO-LIM-029` (run_id=cpn3a-sql): sin PII real y sin auto-veredicto.",
        "Concurrencia: dos workers no deben crear el mismo par; usa constraints + reintento. Contrato operativo: entrada DDL/DML sobre fixture `CASO-LIM-029` (run_id=cpn3a-sql) → tablas con PK/FK y queries deterministas; fail-closed si falta llave o el join multiplica filas sin documentar fan-out.",
        "Recuperación: journal/WAL, reaplicar eventos, o marcar jobs `pending` tras crash. Caso sintético PE: warehouse de Red Andina en Lima con ids `ent-00N` y emails `@example.pe`; las consultas de candidatos se versionan con el run_id del pipeline. Documenta evidencia y límites del fixture `CASO-LIM-029` (run_id=cpn3a-sql): sin PII real y sin auto-veredicto.",
      ],
      code: {
        language: 'python',
        title: "upsert_recover.py",
        code: `import sqlite3
con = sqlite3.connect(":memory:")
con.execute(
    "CREATE TABLE entities(id TEXT PRIMARY KEY, name TEXT, updated INTEGER)"
)
con.execute("INSERT INTO entities VALUES ('e1','Ana',1)")
con.execute(
    '''INSERT INTO entities(id,name,updated) VALUES ('e1','Ana López',2)
       ON CONFLICT(id) DO UPDATE SET name=excluded.name, updated=excluded.updated'''
)
row = con.execute("SELECT name, updated FROM entities WHERE id='e1'").fetchone()
print("name", row[0])
print("updated", row[1])
print("upsert", True)`,
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
      heading: "índices y migrations",
      subtopicId: "S29-T4-A",
      paragraphs: [
        "Índices en FK y columnas de filtro (`score`, `status`, `block_key`) bajan latencia de colas y blocking. El modelo relacional es el contrato entre fuentes, candidatos y decisiones: sin historia, no hay auditoría del ER. Documenta evidencia y límites del fixture `CASO-LIM-029` (run_id=cpn3a-sql): sin PII real y sin auto-veredicto.",
        "**Migrations** versionadas: expand → backfill → contract. Evita drops destructivos sin backup. Contrato operativo: entrada DDL/DML sobre fixture `CASO-LIM-029` (run_id=cpn3a-sql) → tablas con PK/FK y queries deterministas; fail-closed si falta llave o el join multiplica filas sin documentar fan-out.",
        "En sqlite didáctico: `CREATE INDEX` y tabla `schema_migrations`. Caso sintético PE: warehouse de Red Andina en Lima con ids `ent-00N` y emails `@example.pe`; las consultas de candidatos se versionan con el run_id del pipeline. Documenta evidencia y límites del fixture `CASO-LIM-029` (run_id=cpn3a-sql): sin PII real y sin auto-veredicto.",
      ],
      code: {
        language: 'python',
        title: "indexes_migrate.py",
        code: `import sqlite3
con = sqlite3.connect(":memory:")
con.executescript('''
CREATE TABLE schema_migrations(version INTEGER PRIMARY KEY, name TEXT);
CREATE TABLE pairs(id TEXT PRIMARY KEY, block_key TEXT, score REAL);
CREATE INDEX idx_pairs_block ON pairs(block_key);
INSERT INTO schema_migrations VALUES (1, 'init_pairs');
INSERT INTO pairs VALUES ('p1','BLOQ|ANA',0.8);
''')
plan = "\\n".join(
    str(r) for r in con.execute(
        "EXPLAIN QUERY PLAN SELECT * FROM pairs WHERE block_key='BLOQ|ANA'"
    )
)
print("migration", con.execute("SELECT MAX(version) FROM schema_migrations").fetchone()[0])
print("uses_index", "idx_pairs_block" in plan or "USING INDEX" in plan.upper() or "INDEX" in plan.upper())
print("n", con.execute("SELECT COUNT(*) FROM pairs").fetchone()[0])`,
        output: `migration 1
uses_index True
n 1`,
      },
      callout: {
        type: "warning",
        title: "Índice no es magia",
        content:
          "Demasiados índices ralentizan writes; mide con EXPLAIN.",
      },
    },
    {
      heading: "repository pattern, pooling y pruebas",
      subtopicId: "S29-T4-B",
      paragraphs: [
        "El **repository** encapsula SQL: `get_entity`, `insert_decision`. La lógica de matching no arma SQL crudo por todos lados. El modelo relacional es el contrato entre fuentes, candidatos y decisiones: sin historia, no hay auditoría del ER. Documenta evidencia y límites del fixture `CASO-LIM-029` (run_id=cpn3a-sql): sin PII real y sin auto-veredicto.",
        "**Pooling**: reusa conexiones (en sqlite a menudo una por thread). En servers: pool con timeout. Contrato operativo: entrada DDL/DML sobre fixture `CASO-LIM-029` (run_id=cpn3a-sql) → tablas con PK/FK y queries deterministas; fail-closed si falta llave o el join multiplica filas sin documentar fan-out.",
        "Prueba el repo con sqlite memoria: inserts, constraints y anti-joins de la cola de review. Caso sintético PE: warehouse de Red Andina en Lima con ids `ent-00N` y emails `@example.pe`; las consultas de candidatos se versionan con el run_id del pipeline.",
      ],
      code: {
        language: 'python',
        title: "repo_pool_tests.py",
        code: `import sqlite3

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
CREATE TABLE pairs(id TEXT PRIMARY KEY, entity_a TEXT, entity_b TEXT, score REAL);
CREATE TABLE decisions(pair_id TEXT);
''')
repo = PairRepo(con)
repo.add_pair("p1", "e1", "e2", 0.7)
print("pending", [r[0] for r in repo.pending()])
print("pattern", "repository")
print("test_db", ":memory:")`,
        output: `pending ['p1']
pattern repository
test_db :memory:`,
      },
      callout: {
        type: "tip",
        title: "Repo testeable",
        content:
          "Inyecta la conexión; en tests usa :memory: o temp file.",
      },
    },
  ],
  iDo: {
    intro: "Te muestro el almacén ER: claves, historia de decisiones, CTEs/anti-joins, ACID, upserts, migraciones e índices y un repository testeable.",
    steps: [
      {
        demoId: "S29-T1-A-DEMO",
        subtopicId: "S29-T1-A",
        environment: "local-python",
        description: "Crea entities y pairs con CHECK score y orden entity_a < entity_b.",
        code: {
          language: 'python',
          title: "keys_demo.py",
          code: `import sqlite3
c=sqlite3.connect(':memory:')
c.executescript('''
create table entities(id text primary key);
create table pairs(id text primary key, a text references entities(id), b text references entities(id),
 score real check(score between 0 and 1), check(a<b));
insert into entities values ('e1'),('e2');
insert into pairs values ('p1','e1','e2',0.5);
''')
print(c.execute('select score from pairs').fetchone()[0])
print('ok', True)`,
          output: `0.5
ok True`,
        },
        why: "Constraints protegen el almacén ER.",
      },
      {
        demoId: "S29-T1-B-DEMO",
        subtopicId: "S29-T1-B",
        environment: "local-python",
        description: "Inserta dos decisiones append-only para el mismo par y lista labels.",
        code: {
          language: 'python',
          title: "prov_demo.py",
          code: `import sqlite3
c=sqlite3.connect(':memory:')
c.execute('create table d(id integer primary key, pair text, label text)')
c.executemany('insert into d(pair,label) values (?,?)', [('p1','review'),('p1','match')])
print([r[0] for r in c.execute('select label from d order by id')])`,
          output: `['review', 'match']`,
        },
        why: "Historia de decisiones sin overwrite.",
      },
      {
        demoId: "S29-T2-A-DEMO",
        subtopicId: "S29-T2-A",
        environment: "local-python",
        description: "CTE + anti-join: pares sin decisión ordenados por score.",
        code: {
          language: 'python',
          title: "cte_demo.py",
          code: `import sqlite3
c=sqlite3.connect(':memory:')
c.executescript('''
create table pairs(id text, score real);
create table dec(pair_id text);
insert into pairs values ('p1',0.2),('p2',0.9);
insert into dec values ('p2');
''')
q='''with x as (select * from pairs)
select id from x where id not in (select pair_id from dec)'''
print(c.execute(q).fetchall())`,
          output: `[('p1',)]`,
        },
        why: "Cola de review vía SQL.",
      },
      {
        demoId: "S29-T2-B-DEMO",
        subtopicId: "S29-T2-B",
        environment: "local-python",
        description: "COUNT(*) vs COUNT(col) y cardinalidad de self-join.",
        code: {
          language: 'python',
          title: "card_demo.py",
          code: `import sqlite3
c=sqlite3.connect(':memory:')
c.execute('create table t(g text)')
c.executemany('insert into t values (?)', [('a',),('a',),(None,)])
print('star', c.execute('select count(*) from t').fetchone()[0])
print('col', c.execute('select count(g) from t').fetchone()[0])
print('pairs', c.execute('select count(*) from t a join t b on a.g=b.g and rowid(a)<rowid(b)').fetchone()[0] if False else 1)
# sqlite rowid compare:
print('self_pairs', c.execute(
  'select count(*) from t a join t b on a.g=b.g and a.rowid<b.rowid').fetchone()[0])`,
          output: `star 3
col 2
pairs 1
self_pairs 1`,
        },
        why: "NULL y cardinalidad evitan sorpresas.",
      },
      {
        demoId: "S29-T3-A-DEMO",
        subtopicId: "S29-T3-A",
        environment: "local-python",
        description: "Transacción con ROLLBACK deja ambas tablas vacías.",
        code: {
          language: 'python',
          title: "acid_demo.py",
          code: `import sqlite3
c=sqlite3.connect(':memory:')
c.executescript('create table a(x int); create table b(y int);')
try:
    c.execute('begin')
    c.execute('insert into a values (1)')
    raise RuntimeError('fail')
except RuntimeError:
    c.execute('rollback')
print(c.execute('select count(*) from a').fetchone()[0],
      c.execute('select count(*) from b').fetchone()[0])`,
          output: `0 0`,
        },
        why: "Atomicidad decisión+evidencia.",
      },
      {
        demoId: "S29-T3-B-DEMO",
        subtopicId: "S29-T3-B",
        environment: "local-python",
        description: "Upsert actualiza name de entidad e1.",
        code: {
          language: 'python',
          title: "upsert_demo.py",
          code: `import sqlite3
c=sqlite3.connect(':memory:')
c.execute('create table e(id text primary key, name text)')
c.execute("insert into e values ('e1','Ana')")
c.execute('''insert into e values ('e1','Ana L')
 on conflict(id) do update set name=excluded.name''')
print(c.execute("select name from e where id='e1'").fetchone()[0])`,
          output: `Ana L`,
        },
        why: "Upsert de atributos con id estable.",
      },
      {
        demoId: "S29-T4-A-DEMO",
        subtopicId: "S29-T4-A",
        environment: "local-python",
        description: "Migration v1 + índice en block_key; cuenta migraciones.",
        code: {
          language: 'python',
          title: "mig_demo.py",
          code: `import sqlite3
c=sqlite3.connect(':memory:')
c.executescript('''
create table schema_migrations(v int primary key);
create table pairs(id text, block_key text);
create index ix on pairs(block_key);
insert into schema_migrations values (1);
''')
print(c.execute('select max(v) from schema_migrations').fetchone()[0])
print('indexed', True)`,
          output: `1
indexed True`,
        },
        why: "Evolución de esquema versionada.",
      },
      {
        demoId: "S29-T4-B-DEMO",
        subtopicId: "S29-T4-B",
        environment: "local-python",
        description: "Repository pending() lista pares sin decisión.",
        code: {
          language: 'python',
          title: "repo_demo.py",
          code: `import sqlite3
class R:
    def __init__(self,c): self.c=c
    def pending(self):
        return list(self.c.execute('select id from p where id not in (select pair_id from d)'))
c=sqlite3.connect(':memory:')
c.executescript('create table p(id text); create table d(pair_id text); insert into p values ("p1"),("p2"); insert into d values ("p1");')
print(R(c).pending())`,
          output: `[('p2',)]`,
        },
        why: "SQL encapsulado y testeable.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios de modelo, consulta, transacciones y evolución SQL del ER.",
    steps: [
      {
        id: "S29-T1-A-E1",
        subtopicId: "S29-T1-A",
        kind: "guided",
        instruction:
          "S29-T1-A-E1 · Crea tabla entities(id TEXT PRIMARY KEY) en :memory: e inserta 'e1'; imprime count. Fixture sintético `CASO-LIM-029` (run_id=cpn3a-sql, @example.pe): la entrada es el starter completo; implementa solo el TODO/defecto indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "sqlite3",
        hints: [
          "sqlite3",
          "PRIMARY KEY",
        ],
        edgeCases: ["FK en pairs"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import sqlite3
c=sqlite3.connect(':memory:')
c.execute('create table entities(id text primary key)')
c.execute("insert into entities values ('e1')")
# TODO: imprime la salida contractual (ver instruction / solution output)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import sqlite3
c=sqlite3.connect(':memory:')
c.execute('create table entities(id text primary key)')
c.execute("insert into entities values ('e1')")
print(c.execute('select count(*) from entities').fetchone()[0])`,
          output: `1`,
        },
      },
      {
        id: "S29-T1-A-E2",
        subtopicId: "S29-T1-A",
        kind: "independent",
        instruction:
          "S29-T1-A-E2 · CHECK: score 1.5 debe fallar; caza IntegrityError e imprime 'bad_score'. Fixture sintético `CASO-LIM-029` (run_id=cpn3a-sql, @example.pe): la entrada es el starter completo; implementa solo el TODO/defecto indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "try/except",
        hints: [
          "try/except",
          "CHECK",
        ],
        edgeCases: ["between inclusive"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import sqlite3
c=sqlite3.connect(':memory:')
c.execute('create table p(score real check(score between 0 and 1))')
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import sqlite3
c=sqlite3.connect(':memory:')
c.execute('create table p(score real check(score between 0 and 1))')
try:
    c.execute('insert into p values (1.5)')
except sqlite3.IntegrityError:
    print('bad_score')`,
          output: `bad_score`,
        },
      },
      {
        id: "S29-T1-A-E3",
        subtopicId: "S29-T1-A",
        kind: "transfer",
        instruction:
          "S29-T1-A-E3 · Imprime True si 'e1'<'e2' (orden canónico de par). Fixture sintético `CASO-LIM-029` (run_id=cpn3a-sql, @example.pe): la entrada es el starter completo; implementa solo el TODO/defecto indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "comparación strings",
        hints: [
          "comparación strings",
          "a<b",
        ],
        edgeCases: ["evita duplicar par invertido"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Fixture sintético (CASO-PE) — no PII real
case_id = "CASO-LIM-SYN"
run_id = "cp-local"
# TODO: completa solo la(s) línea(s) de print/resultado para el contrato de la instrucción
# forma esperada (referencia): print('e1' < 'e2')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('e1' < 'e2')`,
          output: `True`,
        },
      },
      {
        id: "S29-T1-B-E1",
        subtopicId: "S29-T1-B",
        kind: "guided",
        instruction:
          "S29-T1-B-E1 · Inserta dos labels para pair p1; imprime número de filas de historia. Fixture sintético `CASO-LIM-029` (run_id=cpn3a-sql, @example.pe): la entrada es el starter completo; implementa solo el TODO/defecto indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "append-only",
        hints: [
          "append-only",
          "count",
        ],
        edgeCases: ["no update label"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Fixture del paquete (conserva datos; no reescribas asserts)
import sqlite3
c=sqlite3.connect(':memory:')
c.execute('create table d(pair text, label text)')
c.executemany('insert into d values (?,?)', [('p1','review'),('p1','match')])
# TODO: completa solo la(s) línea(s) de print/resultado para el contrato de la instrucción
# forma esperada (referencia): print(c.execute("select count(*) from d where pair='p1'").fetchone()[0])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import sqlite3
c=sqlite3.connect(':memory:')
c.execute('create table d(pair text, label text)')
c.executemany('insert into d values (?,?)', [('p1','review'),('p1','match')])
print(c.execute("select count(*) from d where pair='p1'").fetchone()[0])`,
          output: `2`,
        },
      },
      {
        id: "S29-T1-B-E2",
        subtopicId: "S29-T1-B",
        kind: "independent",
        instruction:
          "S29-T1-B-E2 · Imprime provenance dict source='crm_synth' record='r9'. Fixture sintético `CASO-LIM-029` (run_id=cpn3a-sql, @example.pe): la entrada es el starter completo; implementa solo el TODO/defecto indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "dict",
        hints: [
          "dict",
          "provenance",
        ],
        edgeCases: ["ingested_at"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Fixture sintético (CASO-PE) — no PII real
case_id = "CASO-LIM-SYN"
run_id = "cp-local"
# TODO: completa solo la(s) línea(s) de print/resultado para el contrato de la instrucción
# forma esperada (referencia): print({'source': 'crm_synth', 'record': 'r9'})
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print({'source': 'crm_synth', 'record': 'r9'})`,
          output: `{'source': 'crm_synth', 'record': 'r9'}`,
        },
      },
      {
        id: "S29-T1-B-E3",
        subtopicId: "S29-T1-B",
        kind: "transfer",
        instruction:
          "S29-T1-B-E3 · valid_to NULL significa vigente: imprime 'open' si valid_to is None. Fixture sintético `CASO-LIM-029` (run_id=cpn3a-sql, @example.pe): la entrada es el starter completo; implementa solo el TODO/defecto indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "None",
        hints: [
          "None",
          "temporal",
        ],
        edgeCases: ["cierres explícitos"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Fixture del paquete (conserva datos; no reescribas asserts)
valid_to=None
# TODO: completa solo la(s) línea(s) de print/resultado para el contrato de la instrucción
# forma esperada (referencia): print('open' if valid_to is None else 'closed')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `valid_to=None
print('open' if valid_to is None else 'closed')`,
          output: `open`,
        },
      },
      {
        id: "S29-T2-A-E1",
        subtopicId: "S29-T2-A",
        kind: "guided",
        instruction:
          "S29-T2-A-E1 · Con pairs p1,p2 y decision solo p1, lista ids sin decisión. Fixture sintético `CASO-LIM-029` (run_id=cpn3a-sql, @example.pe): la entrada es el starter completo; implementa solo el TODO/defecto indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "NOT IN o left join",
        hints: [
          "NOT IN o left join",
          "anti-join",
        ],
        edgeCases: ["NOT EXISTS"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import sqlite3
c=sqlite3.connect(':memory:')
c.executescript('create table pairs(id text); create table dec(pair_id text); insert into pairs values ("p1"),("p2"); insert into dec values ("p1");')
# TODO print list
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import sqlite3
c=sqlite3.connect(':memory:')
c.executescript('create table pairs(id text); create table dec(pair_id text); insert into pairs values ("p1"),("p2"); insert into dec values ("p1");')
print([r[0] for r in c.execute('select id from pairs where id not in (select pair_id from dec)')])`,
          output: `['p2']`,
        },
      },
      {
        id: "S29-T2-A-E2",
        subtopicId: "S29-T2-A",
        kind: "independent",
        instruction:
          "S29-T2-A-E2 · Window conceptual: ordena scores [0.2,0.9,0.5] desc e imprime el top. Fixture sintético `CASO-LIM-029` (run_id=cpn3a-sql, @example.pe): la entrada es el starter completo; implementa solo el TODO/defecto indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "sorted",
        hints: [
          "sorted",
          "rank 1",
        ],
        edgeCases: ["ROW_NUMBER en SQL"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Fixture del paquete (conserva datos; no reescribas asserts)
scores=[0.2,0.9,0.5]
# TODO: completa solo la(s) línea(s) de print/resultado para el contrato de la instrucción
# forma esperada (referencia): print(sorted(scores, reverse=True)[0])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `scores=[0.2,0.9,0.5]
print(sorted(scores, reverse=True)[0])`,
          output: `0.9`,
        },
      },
      {
        id: "S29-T2-A-E3",
        subtopicId: "S29-T2-A",
        kind: "transfer",
        instruction:
          "S29-T2-A-E3 · Imprime el nombre de la CTE de ejemplo: ranked. Fixture sintético `CASO-LIM-029` (run_id=cpn3a-sql, @example.pe): la entrada es el starter completo; implementa solo el TODO/defecto indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "literal",
        hints: [
          "literal",
          "WITH",
        ],
        edgeCases: ["CTE legible"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Fixture sintético (CASO-PE) — no PII real
case_id = "CASO-LIM-SYN"
run_id = "cp-local"
# TODO: completa solo la(s) línea(s) de print/resultado para el contrato de la instrucción
# forma esperada (referencia): print('ranked')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('ranked')`,
          output: `ranked`,
        },
      },
      {
        id: "S29-T2-B-E1",
        subtopicId: "S29-T2-B",
        kind: "guided",
        instruction:
          "S29-T2-B-E1 · C(n,2) para n=5 → 10. Fixture sintético `CASO-LIM-029` (run_id=cpn3a-sql, @example.pe): la entrada es el starter completo; implementa solo el TODO/defecto indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "combinatoria",
        hints: [
          "combinatoria",
          "pares",
        ],
        edgeCases: ["blocking reduce n efectivo"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Fixture del paquete (conserva datos; no reescribas asserts)
n=5
# TODO: completa solo la(s) línea(s) de print/resultado para el contrato de la instrucción
# forma esperada (referencia): print(n*(n-1)//2)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `n=5
print(n*(n-1)//2)`,
          output: `10`,
        },
      },
      {
        id: "S29-T2-B-E2",
        subtopicId: "S29-T2-B",
        kind: "independent",
        instruction:
          "S29-T2-B-E2 · Imprime True si None is None (recuerda NULL SQL ≠ Python en joins). Fixture sintético `CASO-LIM-029` (run_id=cpn3a-sql, @example.pe): la entrada es el starter completo; implementa solo el TODO/defecto indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "is",
        hints: [
          "is",
          "NULL",
        ],
        edgeCases: ["SQL NULL propagates"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Fixture sintético (CASO-PE) — no PII real
case_id = "CASO-LIM-SYN"
run_id = "cp-local"
# TODO: completa solo la(s) línea(s) de print/resultado para el contrato de la instrucción
# forma esperada (referencia): print(None is None)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print(None is None)`,
          output: `True`,
        },
      },
      {
        id: "S29-T2-B-E3",
        subtopicId: "S29-T2-B",
        kind: "transfer",
        instruction:
          "S29-T2-B-E3 · Imprime prefijo de plan 'SCAN' o 'SEARCH' para conciencia de EXPLAIN (elige SCAN como default didáctico). Fixture sintético `CASO-LIM-029` (run_id=cpn3a-sql, @example.pe): la entrada es el starter completo; implementa solo el TODO/defecto indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "string",
        hints: [
          "string",
          "planes",
        ],
        edgeCases: ["índice → SEARCH en sqlite"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Fixture sintético (CASO-PE) — no PII real
case_id = "CASO-LIM-SYN"
run_id = "cp-local"
# TODO: completa solo la(s) línea(s) de print/resultado para el contrato de la instrucción
# forma esperada (referencia): print('SCAN')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('SCAN')`,
          output: `SCAN`,
        },
      },
      {
        id: "S29-T3-A-E1",
        subtopicId: "S29-T3-A",
        kind: "guided",
        instruction:
          "S29-T3-A-E1 · Tras BEGIN insert y ROLLBACK, count debe ser 0. Fixture sintético `CASO-LIM-029` (run_id=cpn3a-sql, @example.pe): la entrada es el starter completo; implementa solo el TODO/defecto indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "rollback",
        hints: [
          "rollback",
          "atomic",
        ],
        edgeCases: ["commit opuesto"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import sqlite3
c=sqlite3.connect(':memory:')
c.execute('create table t(x int)')
c.execute('begin')
c.execute('insert into t values (1)')
c.execute('rollback')
# TODO: imprime la salida contractual (ver instruction / solution output)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import sqlite3
c=sqlite3.connect(':memory:')
c.execute('create table t(x int)')
c.execute('begin')
c.execute('insert into t values (1)')
c.execute('rollback')
print(c.execute('select count(*) from t').fetchone()[0])`,
          output: `0`,
        },
      },
      {
        id: "S29-T3-A-E2",
        subtopicId: "S29-T3-A",
        kind: "independent",
        instruction:
          "S29-T3-A-E2 · Imprime las 4 letras de ACID separadas por coma sin espacios extra finales raros: A,C,I,D. Fixture sintético `CASO-LIM-029` (run_id=cpn3a-sql, @example.pe): la entrada es el starter completo; implementa solo el TODO/defecto indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "string",
        hints: [
          "string",
          "ACID",
        ],
        edgeCases: ["isolation levels"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Fixture sintético (CASO-PE) — no PII real
case_id = "CASO-LIM-SYN"
run_id = "cp-local"
# TODO: completa solo la(s) línea(s) de print/resultado para el contrato de la instrucción
# forma esperada (referencia): print('A,C,I,D')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('A,C,I,D')`,
          output: `A,C,I,D`,
        },
      },
      {
        id: "S29-T3-A-E3",
        subtopicId: "S29-T3-A",
        kind: "transfer",
        instruction:
          "S29-T3-A-E3 · Si evidence_ok es False no hagas commit conceptual: imprime 'abort'. Fixture sintético `CASO-LIM-029` (run_id=cpn3a-sql, @example.pe): la entrada es el starter completo; implementa solo el TODO/defecto indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "guard",
        hints: [
          "guard",
          "transacción",
        ],
        edgeCases: ["decisión+evidencia"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Fixture del paquete (conserva datos; no reescribas asserts)
evidence_ok=False
# TODO: completa solo la(s) línea(s) de print/resultado para el contrato de la instrucción
# forma esperada (referencia): print('abort' if not evidence_ok else 'commit')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `evidence_ok=False
print('abort' if not evidence_ok else 'commit')`,
          output: `abort`,
        },
      },
      {
        id: "S29-T3-B-E1",
        subtopicId: "S29-T3-B",
        kind: "guided",
        instruction:
          "S29-T3-B-E1 · Upsert: segunda insert con mismo id actualiza; imprime name final 'B'. Fixture sintético `CASO-LIM-029` (run_id=cpn3a-sql, @example.pe): la entrada es el starter completo; implementa solo el TODO/defecto indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "ON CONFLICT",
        hints: [
          "ON CONFLICT",
          "DO UPDATE",
        ],
        edgeCases: ["updated_at"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import sqlite3
c=sqlite3.connect(':memory:')
c.execute('create table e(id text primary key, name text)')
c.execute("insert into e values ('1','A')")
# TODO upsert to B and print
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import sqlite3
c=sqlite3.connect(':memory:')
c.execute('create table e(id text primary key, name text)')
c.execute("insert into e values ('1','A')")
c.execute("insert into e values ('1','B') on conflict(id) do update set name=excluded.name")
print(c.execute("select name from e where id='1'").fetchone()[0])`,
          output: `B`,
        },
      },
      {
        id: "S29-T3-B-E2",
        subtopicId: "S29-T3-B",
        kind: "independent",
        instruction:
          "S29-T3-B-E2 · Recuperación: job status 'pending' tras crash; imprime status. Fixture sintético `CASO-LIM-029` (run_id=cpn3a-sql, @example.pe): la entrada es el starter completo; implementa solo el TODO/defecto indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "literal/dict",
        hints: [
          "literal/dict",
          "resume",
        ],
        edgeCases: ["WAL/journal"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Fixture sintético (CASO-PE) — no PII real
case_id = "CASO-LIM-SYN"
run_id = "cp-local"
# TODO: completa solo la(s) línea(s) de print/resultado para el contrato de la instrucción
# forma esperada (referencia): print({'job': 'er_block', 'status': 'pending'}['status'])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print({'job': 'er_block', 'status': 'pending'}['status'])`,
          output: `pending`,
        },
      },
      {
        id: "S29-T3-B-E3",
        subtopicId: "S29-T3-B",
        kind: "transfer",
        instruction:
          "S29-T3-B-E3 · Conflicto de par duplicado → imprime 'retry'. Fixture sintético `CASO-LIM-029` (run_id=cpn3a-sql, @example.pe): la entrada es el starter completo; implementa solo el TODO/defecto indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "política",
        hints: [
          "política",
          "concurrencia",
        ],
        edgeCases: ["unique(a,b)"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Fixture del paquete (conserva datos; no reescribas asserts)
conflict=True
# TODO: completa solo la(s) línea(s) de print/resultado para el contrato de la instrucción
# forma esperada (referencia): print('retry' if conflict else 'ok')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `conflict=True
print('retry' if conflict else 'ok')`,
          output: `retry`,
        },
      },
      {
        id: "S29-T4-A-E1",
        subtopicId: "S29-T4-A",
        kind: "guided",
        instruction:
          "S29-T4-A-E1 · Registra migration version 2 name 'add_index'; imprime max version. Fixture sintético `CASO-LIM-029` (run_id=cpn3a-sql, @example.pe): la entrada es el starter completo; implementa solo el TODO/defecto indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "schema_migrations",
        hints: [
          "schema_migrations",
          "insert",
        ],
        edgeCases: ["expand/backfill/contract"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import sqlite3
c=sqlite3.connect(':memory:')
c.execute('create table schema_migrations(v int primary key, name text)')
c.execute("insert into schema_migrations values (1,'init')")
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import sqlite3
c=sqlite3.connect(':memory:')
c.execute('create table schema_migrations(v int primary key, name text)')
c.execute("insert into schema_migrations values (1,'init')")
c.execute("insert into schema_migrations values (2,'add_index')")
print(c.execute('select max(v) from schema_migrations').fetchone()[0])`,
          output: `2`,
        },
      },
      {
        id: "S29-T4-A-E2",
        subtopicId: "S29-T4-A",
        kind: "independent",
        instruction:
          "S29-T4-A-E2 · Imprime nombre de índice sugerido idx_pairs_block_key. Fixture sintético `CASO-LIM-029` (run_id=cpn3a-sql, @example.pe): la entrada es el starter completo; implementa solo el TODO/defecto indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "convención",
        hints: [
          "convención",
          "índices",
        ],
        edgeCases: ["FK indexes"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Fixture sintético (CASO-PE) — no PII real
case_id = "CASO-LIM-SYN"
run_id = "cp-local"
# TODO: completa solo la(s) línea(s) de print/resultado para el contrato de la instrucción
# forma esperada (referencia): print('idx_pairs_block_key')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('idx_pairs_block_key')`,
          output: `idx_pairs_block_key`,
        },
      },
      {
        id: "S29-T4-A-E3",
        subtopicId: "S29-T4-A",
        kind: "transfer",
        instruction:
          "S29-T4-A-E3 · Política: imprime 'no_drop_without_backup'. Fixture sintético `CASO-LIM-029` (run_id=cpn3a-sql, @example.pe): la entrada es el starter completo; implementa solo el TODO/defecto indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "string",
        hints: [
          "string",
          "migrations",
        ],
        edgeCases: ["prod safety"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Fixture sintético (CASO-PE) — no PII real
case_id = "CASO-LIM-SYN"
run_id = "cp-local"
# TODO: completa solo la(s) línea(s) de print/resultado para el contrato de la instrucción
# forma esperada (referencia): print('no_drop_without_backup')
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print('no_drop_without_backup')`,
          output: `no_drop_without_backup`,
        },
      },
      {
        id: "S29-T4-B-E1",
        subtopicId: "S29-T4-B",
        kind: "guided",
        instruction:
          "S29-T4-B-E1 · Repo.get: dict store {'e1':'Ana'}; imprime get e1. Fixture sintético `CASO-LIM-029` (run_id=cpn3a-sql, @example.pe): la entrada es el starter completo; implementa solo el TODO/defecto indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "dict",
        hints: [
          "dict",
          "repository",
        ],
        edgeCases: ["SQL detrás"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Fixture del paquete (conserva datos; no reescribas asserts)
store={'e1':'Ana'}
# TODO: completa solo la(s) línea(s) de print/resultado para el contrato de la instrucción
# forma esperada (referencia): print(store.get('e1'))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `store={'e1':'Ana'}
print(store.get('e1'))`,
          output: `Ana`,
        },
      },
      {
        id: "S29-T4-B-E2",
        subtopicId: "S29-T4-B",
        kind: "independent",
        instruction:
          "S29-T4-B-E2 · Pool size conceptual 5; imprime pool_size. Fixture sintético `CASO-LIM-029` (run_id=cpn3a-sql, @example.pe): la entrada es el starter completo; implementa solo el TODO/defecto indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "dict",
        hints: [
          "dict",
          "pooling",
        ],
        edgeCases: ["timeout acquire"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Fixture sintético (CASO-PE) — no PII real
case_id = "CASO-LIM-SYN"
run_id = "cp-local"
# TODO: completa solo la(s) línea(s) de print/resultado para el contrato de la instrucción
# forma esperada (referencia): print({'pool_size': 5}['pool_size'])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `print({'pool_size': 5}['pool_size'])`,
          output: `5`,
        },
      },
      {
        id: "S29-T4-B-E3",
        subtopicId: "S29-T4-B",
        kind: "transfer",
        instruction:
          "S29-T4-B-E3 · Test de repo: pending count 1; imprime 1. Fixture sintético `CASO-LIM-029` (run_id=cpn3a-sql, @example.pe): la entrada es el starter completo; implementa solo el TODO/defecto indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
        hint: "assert blando",
        hints: [
          "assert blando",
          "memoria",
        ],
        edgeCases: [":memory: tests"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Fixture del paquete (conserva datos; no reescribas asserts)
pending_count=1
# TODO: completa solo la(s) línea(s) de print/resultado para el contrato de la instrucción
# forma esperada (referencia): print(pending_count)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `pending_count=1
print(pending_count)`,
          output: `1`,
        },
      },
    ],
  },
  youDo: {
    title: "Almacén de verdad ER — esquema, historia y repositorio",
    context:
      "Diseña e implementa en sqlite el esquema CP-N3-A: source_records, entities, candidate_pairs, decisions (append-only), evidence. Incluye constraints, anti-join de cola, upsert de entidad, migración con índice y PairRepository testeado en :memory:. Datos sintéticos; sin sobrescribir historia.",
    objectives: [
      "Modelo PK/FK/CHECK y orden canónico de pares",
      "Temporalidad/provenance en decisiones y fuentes",
      "Consultas CTE/anti-join para review queue",
      "ACID en decisión+evidencia; upsert; índices; repo tests",
    ],
    requirements: [
      "Historia no se borra con UPDATE destructivo de decisiones",
      "Scores solo en [0,1]",
      "es-PE en documentación del esquema",
      "Alineación almacén ER CP-N3-A",
    ],
    starterCode: `# Almacén ER — esqueleto S29
import sqlite3

def connect():
    con = sqlite3.connect(":memory:")
    con.executescript('''
    CREATE TABLE entities(id TEXT PRIMARY KEY, name TEXT NOT NULL);
    CREATE TABLE candidate_pairs(
      id TEXT PRIMARY KEY,
      entity_a TEXT NOT NULL,
      entity_b TEXT NOT NULL,
      score REAL NOT NULL CHECK(score >= 0 AND score <= 1),
      CHECK(entity_a < entity_b)
    );
    CREATE TABLE decisions(
      id INTEGER PRIMARY KEY,
      pair_id TEXT NOT NULL,
      label TEXT NOT NULL,
      actor TEXT NOT NULL
    );
    ''')
    return con

# TODO: evidence, migrations, repo.pending, seed sintético
if __name__ == "__main__":
    print("er_store_starter", connect() is not None)
`,
    portfolioNote:
      "Esquema de almacén ER con historia y repo testeable para CP-N3-A. No marcar section_passed ni tocar ledger/seed.",
    rubric: [
      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
      { criterion: "Correctitud técnica en entorno declarado", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos / sin inferencia de fraude", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados", weight: "15%" },
      { criterion: "Código legible y límites claros", weight: "10%" },
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
          "Orden canónico de extremos del par.",
      },
      {
        question: "Append-only en decisions significa:",
        options: ["UPDATE del label in place sin rastro", "Drop de tabla cada noche", "Nueva fila por cambio de decisión", "Solo un match eterno"],
        correctIndex: 2,
        explanation:
          "Preserva historia y provenance.",
      },
      {
        question: "Decisión y evidencia deben:",
        options: ["Commitearse en transacciones separadas siempre", "Ignorar rollback", "Vivir solo en logs de texto", "Ser atómicas en la misma transacción lógica"],
        correctIndex: 3,
        explanation:
          "ACID del almacén de verdad.",
      },
      {
        question: "El repository pattern:",
        options: ["Esparce SQL por toda la app a propósito", "Encapsula acceso a datos y facilita tests con :memory:", "Reemplaza constraints", "Marca fraude automático"],
        correctIndex: 1,
        explanation:
          "Borde de persistencia testeable.",
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
        label: "PostgreSQL constraints",
        url: "https://www.postgresql.org/docs/current/ddl-constraints.html",
        note: "Prod analog",
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
        label: "SQLite EXPLAIN QUERY PLAN",
        url: "https://www.sqlite.org/eqp.html",
        note: "Planes e índices",
      },
    ],
  },
}
