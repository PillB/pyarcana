# S29 Paragraph-by-Paragraph Analysis with Sources

Generated: 2026-07-24T04:34:23.481+00:00
Section: SQL avanzado y modelado relacional
File: `s29-mlops.ts`
STORM cycles: **29**
Expert rank: **9.55**

## Competitive sources (domain-honest HTTP ≥5)

- SQLite: [Language](https://www.sqlite.org/lang.html) — SQL local
- SQLite: [EXPLAIN QUERY PLAN](https://www.sqlite.org/eqp.html) — planes
- SQLite: [Foreign keys](https://www.sqlite.org/foreignkeys.html) — FK
- PostgreSQL: [Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html) — CHECK UNIQUE
- PostgreSQL: [Window functions](https://www.postgresql.org/docs/current/tutorial-window.html) — windows
- Use The Index Luke: [Index guide](https://use-the-index-luke.com/) — indices
- Python: [sqlite3](https://docs.python.org/3/library/sqlite3.html) — API lab
- Coursera: [SQL relational](https://www.coursera.org/courses?query=sql%20relational%20database) — MOOC
- Stanford: [CS145 materials](https://cs145-fa20.github.io/) — relational
- MIT: [6.100L](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/) — foundations
- Harvard: [CS50P](https://cs50.harvard.edu/python/) — projects
- Py4E: [Python for Everybody](https://www.py4e.com) — progressive
- Live: [PyArcana](https://pillb.github.io/pyarcana/) — course

## Gold pass
| Area | Decision |
|------|----------|
| theory | deepen + domain contracts |
| weDo | CASO DEFECT |
| git | NO restore |
| STORM | hand_STORM_domain_sources |

## Theory (paragraph-level)

### Almacén relacional del ER para CP-N3-A
**P1** (rank 9.55/10)
> Modelas el **almacén ER**: source_records, entities, candidate_pairs, decisions y evidence, **sin borrar historia**. El modelo relacional es el contrato entre fuentes, candidato…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** SQLite: https://www.sqlite.org/lang.html; SQLite: https://www.sqlite.org/eqp.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Almacén relacional del ER para CP-N3-A» in S29_STORM.json.

**P2** (rank 9.55/10)
> SQLite local es una base real y reproducible para observar constraints, NULL, planes, transacciones y locks; las diferencias con otros motores se declaran cuando importan. Contr…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** SQLite: https://www.sqlite.org/eqp.html; SQLite: https://www.sqlite.org/foreignkeys.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Almacén relacional del ER para CP-N3-A» in S29_STORM.json.

**P3** (rank 9.55/10)
> Orden: **T1 Modelo** (PK/FK/historia) → **T2 Consulta** (CTE/windows/anti-join) → **T3 Transacción** (ACID/upsert) → **T4 Evolución** (índices/migrations/repo). **Decisión de ma…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** SQLite: https://www.sqlite.org/foreignkeys.html; PostgreSQL: https://www.postgresql.org/docs/current/ddl-constraints.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Almacén relacional del ER para CP-N3-A» in S29_STORM.json.

### claves, constraints y normalización
**P1** (rank 9.55/10)
> **PK/FK** anclan integridad: un par referencia dos entidades. **Constraints** CHECK (score 0..1), UNIQUE (source, external_id). El modelo relacional es el contrato entre fuentes…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** PostgreSQL: https://www.postgresql.org/docs/current/ddl-constraints.html; PostgreSQL: https://www.postgresql.org/docs/current/tutorial-window.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «claves, constraints y normalización» in S29_STORM.json.

**P2** (rank 9.55/10)
> Normaliza a **3NF** para hechos: no repitas atributos de entidad en cada par; la evidencia puede ser tabla hija. Contrato operativo: entrada DDL/DML sobre fixture `CASO-LIM-029`…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** PostgreSQL: https://www.postgresql.org/docs/current/tutorial-window.html; Use The Index Luke: https://use-the-index-luke.com/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «claves, constraints y normalización» in S29_STORM.json.

**P3** (rank 9.55/10)
> Ids sintéticos estables (`ent_…`, `pair_…`) facilitan tests. Caso sintético PE: warehouse de Red Andina en Lima con ids `ent-00N` y emails `@example.pe`; las consultas de candid…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Use The Index Luke: https://use-the-index-luke.com/; Python: https://docs.python.org/3/library/sqlite3.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «claves, constraints y normalización» in S29_STORM.json.

### temporalidad y provenance
**P1** (rank 9.55/10)
> **Temporalidad**: valid_from/valid_to o tablas de eventos. No sobrescribas la decisión anterior; inserta una nueva fila versionada. El modelo relacional es el contrato entre fue…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/sqlite3.html; Coursera: https://www.coursera.org/courses?query=sql%20relational%20database
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «temporalidad y provenance» in S29_STORM.json.

**P2** (rank 9.55/10)
> **Provenance**: source_system, source_record_id, ingested_at, transform_version. Toda entidad debe rastrearse al registro fuente. Contrato operativo: entrada DDL/DML sobre fixtu…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Coursera: https://www.coursera.org/courses?query=sql%20relational%20database; Stanford: https://cs145-fa20.github.io/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «temporalidad y provenance» in S29_STORM.json.

**P3** (rank 9.55/10)
> Auditoría: quién (actor sintético) decidió match/non-match y cuándo. Caso sintético PE: warehouse de Red Andina en Lima con ids `ent-00N` y emails `@example.pe`; las consultas d…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Stanford: https://cs145-fa20.github.io/; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «temporalidad y provenance» in S29_STORM.json.

### CTEs, windows y anti-joins
**P1** (rank 9.55/10)
> **CTEs** (`WITH`) nombran pasos: candidatos filtrados, scores rankeados. **Windows** (`ROW_NUMBER`, `RANK`) particionan por entidad. El modelo relacional es el contrato entre fu…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «CTEs, windows y anti-joins» in S29_STORM.json.

**P2** (rank 9.55/10)
> **Anti-join**: entidades sin par, o pares sin decisión — `NOT EXISTS` / `LEFT JOIN … IS NULL`. Contrato operativo: entrada DDL/DML sobre fixture `CASO-LIM-029` (run_id=cpn3a-sql…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; Py4E: https://www.py4e.com
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «CTEs, windows y anti-joins» in S29_STORM.json.

**P3** (rank 9.55/10)
> Útil para colas de review y coverage de blocking. Caso sintético PE: warehouse de Red Andina en Lima con ids `ent-00N` y emails `@example.pe`; las consultas de candidatos se ver…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Py4E: https://www.py4e.com; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «CTEs, windows y anti-joins» in S29_STORM.json.

### cardinalidad, NULL y planes
**P1** (rank 9.55/10)
> **Cardinalidad** de joins define explosión de pares: n×m sin blocking es inviable. Estima filas antes de correr. El modelo relacional es el contrato entre fuentes, candidatos y …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Live: https://pillb.github.io/pyarcana/; SQLite: https://www.sqlite.org/lang.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «cardinalidad, NULL y planes» in S29_STORM.json.

**P2** (rank 9.55/10)
> **NULL**: `NULL != NULL` en SQL — usa `IS NULL` / `IS NOT NULL`. Agrega con cuidado: `COUNT(*)` cuenta filas; `COUNT(col)` ignora NULL. Un join mal escrito multiplica filas (fan…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** SQLite: https://www.sqlite.org/lang.html; SQLite: https://www.sqlite.org/eqp.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «cardinalidad, NULL y planes» in S29_STORM.json.

**P3** (rank 9.55/10)
> **Planes**: `EXPLAIN QUERY PLAN` en sqlite para ver scans vs search por índice. Caso sintético PE: warehouse de Red Andina en Lima con ids `ent-00N` y emails `@example.pe`; las …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** SQLite: https://www.sqlite.org/eqp.html; SQLite: https://www.sqlite.org/foreignkeys.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «cardinalidad, NULL y planes» in S29_STORM.json.

### ACID e isolation
**P1** (rank 9.55/10)
> **ACID**: Atomicity, Consistency, Isolation, Durability. Una decisión + evidencia deben commitearse juntas o no. El modelo relacional es el contrato entre fuentes, candidatos y …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** SQLite: https://www.sqlite.org/foreignkeys.html; PostgreSQL: https://www.postgresql.org/docs/current/ddl-constraints.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «ACID e isolation» in S29_STORM.json.

**P2** (rank 9.55/10)
> Isolation (READ COMMITTED, SERIALIZABLE…) define qué ven transacciones concurrentes. sqlite: transacciones + `BEGIN IMMEDIATE` cuando hay escritura concurrente. Contrato operati…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** PostgreSQL: https://www.postgresql.org/docs/current/ddl-constraints.html; PostgreSQL: https://www.postgresql.org/docs/current/tutorial-window.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «ACID e isolation» in S29_STORM.json.

**P3** (rank 9.55/10)
> En el curso: demuestra rollback si falla el segundo insert. Caso sintético PE: warehouse de Red Andina en Lima con ids `ent-00N` y emails `@example.pe`; las consultas de candida…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** PostgreSQL: https://www.postgresql.org/docs/current/tutorial-window.html; Use The Index Luke: https://use-the-index-luke.com/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «ACID e isolation» in S29_STORM.json.

### upserts, concurrencia y recuperación
**P1** (rank 9.55/10)
> **Upsert** (`INSERT … ON CONFLICT`): actualiza atributos mutables de entidad sin perder el id estable. El modelo relacional es el contrato entre fuentes, candidatos y decisiones…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Use The Index Luke: https://use-the-index-luke.com/; Python: https://docs.python.org/3/library/sqlite3.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «upserts, concurrencia y recuperación» in S29_STORM.json.

**P2** (rank 9.55/10)
> **Concurrencia**: dos workers no deben crear el mismo par `(e1,e2)` y `(e2,e1)` — `CHECK(entity_a < entity_b)` + UNIQUE + reintento en conflicto. Contrato: fixture `CASO-LIM-029…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/sqlite3.html; Coursera: https://www.coursera.org/courses?query=sql%20relational%20database
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «upserts, concurrencia y recuperación» in S29_STORM.json.

**P3** (rank 9.55/10)
> Recuperación: journal/WAL, reaplicar eventos, o marcar jobs `pending` tras crash. Caso sintético PE: warehouse de Red Andina en Lima con ids `ent-00N` y emails `@example.pe`; la…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Coursera: https://www.coursera.org/courses?query=sql%20relational%20database; Stanford: https://cs145-fa20.github.io/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «upserts, concurrencia y recuperación» in S29_STORM.json.

### índices y migrations
**P1** (rank 9.55/10)
> Índices en FK y columnas de filtro (`score`, `status`, `block_key`) bajan latencia de colas y blocking. El modelo relacional es el contrato entre fuentes, candidatos y decisione…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Stanford: https://cs145-fa20.github.io/; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «índices y migrations» in S29_STORM.json.

**P2** (rank 9.55/10)
> **Migrations** versionadas: expand → backfill → contract. Evita drops destructivos sin backup. Contrato operativo: entrada DDL/DML sobre fixture `CASO-LIM-029` (run_id=cpn3a-sql…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «índices y migrations» in S29_STORM.json.

**P3** (rank 9.55/10)
> En sqlite didáctico: `CREATE INDEX` y tabla `schema_migrations`. Caso sintético PE: warehouse de Red Andina en Lima con ids `ent-00N` y emails `@example.pe`; las consultas de ca…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; Py4E: https://www.py4e.com
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «índices y migrations» in S29_STORM.json.

### repository pattern, pooling y pruebas
**P1** (rank 9.55/10)
> El **repository** encapsula SQL: `get_entity`, `insert_decision`. La lógica de matching no arma SQL crudo por todos lados. El modelo relacional es el contrato entre fuentes, can…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Py4E: https://www.py4e.com; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «repository pattern, pooling y pruebas» in S29_STORM.json.

**P2** (rank 9.55/10)
> **Pooling**: reusa conexiones (en sqlite a menudo una por thread). En servers: pool con timeout. Contrato operativo: entrada DDL/DML sobre fixture `CASO-LIM-029` (run_id=cpn3a-s…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Live: https://pillb.github.io/pyarcana/; SQLite: https://www.sqlite.org/lang.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «repository pattern, pooling y pruebas» in S29_STORM.json.

**P3** (rank 9.55/10)
> Prueba el **repository** con sqlite en memoria: inserts, constraints violados (fail ruidoso), anti-joins de la cola de review y append-only de decisions. Caso PE: Red Andina Lim…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** SQLite: https://www.sqlite.org/lang.html; SQLite: https://www.sqlite.org/eqp.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «repository pattern, pooling y pruebas» in S29_STORM.json.

