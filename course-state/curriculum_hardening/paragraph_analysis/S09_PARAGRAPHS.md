# S9 Paragraph-by-Paragraph Analysis with Sources

Generated: 2026-07-24T05:02:09.394+00:00
Section: Excepciones, debugging y logging seguro
File: `s09-visualization.ts`
STORM cycles: **9**
Expert rank: **9.55**

## Competitive sources (domain-honest HTTP ≥5)

- Python: [Errors tutorial](https://docs.python.org/3/tutorial/errors.html) — exceptions
- Python: [logging](https://docs.python.org/3/library/logging.html) — logging
- Python: [traceback](https://docs.python.org/3/library/traceback.html) — stacks
- Python: [pdb](https://docs.python.org/3/library/pdb.html) — debugger
- Python: [contextlib](https://docs.python.org/3/library/contextlib.html) — with
- PEP 3134: [Exception chaining](https://peps.python.org/pep-3134/) — from e
- Real Python: [Logging](https://realpython.com/python-logging/) — structured logs
- MIT: [6.100L](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/) — errors
- Harvard: [CS50P](https://cs50.harvard.edu/python/) — exceptions
- Coursera: [Python for Everybody](https://www.coursera.org/specializations/python) — MOOC
- Live: [PyArcana](https://pillb.github.io/pyarcana/) — course
- Python: [decimal](https://docs.python.org/3/library/decimal.html) — money parse
- OWASP: [Logging cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html) — secure logs

## Gold pass
| Area | Decision |
|------|----------|
| theory | deepen + domain contracts |
| weDo | CASO DEFECT |
| git | NO restore |
| STORM | hand_STORM_domain_sources |

## Theory (paragraph-level)

### De “Data Visualization” a excepciones, debugging y logging (mapa)
**P1** (rank 9.55/10)
> En V3, **S09 no es el path principal de matplotlib/seaborn/plotly**. Ese material se reubica al tramo de reporting/visualización. Aquí arranca **CP-N1-C**: el pipeline de famili…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/tutorial/errors.html; Python: https://docs.python.org/3/library/logging.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “Data Visualization” a excepciones, debugging» in S09_STORM.json.

**P2** (rank 9.55/10)
> El hilo conductor es un **pipeline de intake sintético** (clientes `C00x`, emails `ejemplo.pe`): validar filas, capturar fallos, **redactar PII** en logs y decidir **fail-fast v…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/logging.html; Python: https://docs.python.org/3/library/traceback.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “Data Visualization” a excepciones, debugging» in S09_STORM.json.

**P3** (rank 9.55/10)
> Orden: **T1 Excepciones** → **T2 Diagnóstico** → **T3 Logging** → **T4 Resiliencia**. Id de plataforma `visualization` se conserva; V3 es excepciones/logs, no charts.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/traceback.html; Python: https://docs.python.org/3/library/pdb.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “Data Visualization” a excepciones, debugging» in S09_STORM.json.

### Tipos específicos, raise y chaining
**P1** (rank 9.55/10)
> Prefiere **tipos concretos**: `ValueError` (valor ilegal), `TypeError` (tipo incorrecto), `KeyError` (clave ausente), `OSError`/`FileNotFoundError` (I/O). `except Exception` gen…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/pdb.html; Python: https://docs.python.org/3/library/contextlib.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Tipos específicos, raise y chaining» in S09_STORM.json.

**P2** (rank 9.55/10)
> `raise ValueError('monto no numérico: …')` da contexto accionable. Para montos: **`Decimal` desde texto**, `quantize(Decimal('0.01'))`, rechazo de no finitos — **nunca** `float`…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/contextlib.html; PEP 3134: https://peps.python.org/pep-3134/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Tipos específicos, raise y chaining» in S09_STORM.json.

**P3** (rank 9.55/10)
> Una **custom Exception ligera** (`class DataLoadError(Exception): ...`) nombra el borde de tu capa sin reinventar la jerarquía de la stdlib. Mensajes: id de fila + valor problem…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** PEP 3134: https://peps.python.org/pep-3134/; Real Python: https://realpython.com/python-logging/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Tipos específicos, raise y chaining» in S09_STORM.json.

### Fronteras de recuperación y cleanup
**P1** (rank 9.55/10)
> `try/except/else/finally`: **else** corre solo si no hubo excepción; **finally** siempre (cleanup). `with` garantiza cierre de handles vía context managers — no dejes files abie…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Real Python: https://realpython.com/python-logging/; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Fronteras de recuperación y cleanup» in S09_STORM.json.

**P2** (rank 9.55/10)
> No uses **`except:` bare** ni tragues `Exception` sin re-raise o cuarentena documentada. Decide: **manejar** (recuperable: fila mala) vs **propagar** (fatal: config inválida). `…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Fronteras de recuperación y cleanup» in S09_STORM.json.

**P3** (rank 9.55/10)
> Config rota → **fail-fast**. Fila de datos inválida → **cuarentena** y continúa el lote (S08). El borde del job es un **contrato operativo**, no un gusto de estilo.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; Coursera: https://www.coursera.org/specializations/python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Fronteras de recuperación y cleanup» in S09_STORM.json.

### Traceback y debugger
**P1** (rank 9.55/10)
> Un **traceback** lista frames del más reciente al más profundo (o viceversa según herramienta). El frame útil suele ser **tu código**, no el de la stdlib — empieza por la última…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Coursera: https://www.coursera.org/specializations/python; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Traceback y debugger» in S09_STORM.json.

**P2** (rank 9.55/10)
> `breakpoint()` / `pdb` inspeccionan variables en vivo. En demos del curso usamos **`traceback` + prints controlados** cuando no hay TTY interactivo (browser/CI).
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Live: https://pillb.github.io/pyarcana/; Python: https://docs.python.org/3/library/decimal.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Traceback y debugger» in S09_STORM.json.

**P3** (rank 9.55/10)
> Al loguear stacks, **nunca** imprimas secretos ni PII completa que haya en locals (email, token, password). **Redacta** o omite — un traceback con `password=...` es un incidente…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/decimal.html; OWASP: https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Traceback y debugger» in S09_STORM.json.

### Reproducción mínima, hipótesis y causa raíz
**P1** (rank 9.55/10)
> **Minimal repro**: reduce 200 filas a la **menor entrada** que dispara el bug. Facilita tests de regresión, code review y el postmortem sin PII real.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** OWASP: https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html; Python: https://docs.python.org/3/tutorial/errors.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Reproducción mínima, hipótesis y causa raíz» in S09_STORM.json.

**P2** (rank 9.55/10)
> Formula **hipótesis falsables** («si el apellido2 vacío rompe el join, entonces con apellido2='X' pasa»). Descartar es progreso — no te cases con la primera intuición.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/tutorial/errors.html; Python: https://docs.python.org/3/library/logging.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Reproducción mínima, hipótesis y causa raíz» in S09_STORM.json.

**P3** (rank 9.55/10)
> Un **test de regresión** rojo→verde documenta la causa raíz y evita reintroducir el fallo. 5-whys ligero: no pares en el síntoma («KeyError email») — pregunta por el schema del …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/logging.html; Python: https://docs.python.org/3/library/traceback.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Reproducción mínima, hipótesis y causa raíz» in S09_STORM.json.

### Niveles y estructura de logging
**P1** (rank 9.55/10)
> Niveles: **DEBUG** (detalle dev), **INFO** (progreso), **WARNING** (anomalía recuperable), **ERROR** (fallo de unidad), **CRITICAL** (job/proceso). No loguees ERROR para filas e…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/traceback.html; Python: https://docs.python.org/3/library/pdb.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Niveles y estructura de logging» in S09_STORM.json.

**P2** (rank 9.55/10)
> Usa un **Logger de módulo** (`logging.getLogger(__name__)`) en vez de configurar el root a ciegas. Handlers y formatters se arman **una vez** en el entrypoint del CLI (S10).
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/pdb.html; Python: https://docs.python.org/3/library/contextlib.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Niveles y estructura de logging» in S09_STORM.json.

**P3** (rank 9.55/10)
> Logs **estructurados** (`key=value` o JSON) con campos estables (`stage`, `record_id`, `correlation_id`, `duration_ms`) se buscan en agregadores. Los `print` libres **no** escal…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/contextlib.html; PEP 3134: https://peps.python.org/pep-3134/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Niveles y estructura de logging» in S09_STORM.json.

### Correlation IDs y redacción de PII
**P1** (rank 9.55/10)
> Un **correlation_id** (o request_id) viaja por capas (CLI → service → repo) para unir logs del mismo job/lote — sin él el postmortem es arqueología.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** PEP 3134: https://peps.python.org/pep-3134/; Real Python: https://realpython.com/python-logging/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Correlation IDs y redacción de PII» in S09_STORM.json.

**P2** (rank 9.55/10)
> **Nunca** loguees email, teléfono o dirección **completos**. Usa máscaras: `a***@ejemplo.pe`, `***4567`. Un ERROR con el row completo es un incidente de cumplimiento.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Real Python: https://realpython.com/python-logging/; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Correlation IDs y redacción de PII» in S09_STORM.json.

**P3** (rank 9.55/10)
> Helpers `mask_email` / `mask_phone` deben ser el **único** camino a logs; audits fallan si alguien hace `log.info(row)`. Redacta **antes** de format string.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Correlation IDs y redacción de PII» in S09_STORM.json.

### Fallar rápido vs continuar con cuarentena
**P1** (rank 9.55/10)
> Taxonomía: **data** (fila), **config** (delimiter, schema path), **provider** (timeout de API/archivo remoto). La **política difiere** por clase — no trates un timeout igual que…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; Coursera: https://www.coursera.org/specializations/python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Fallar rápido vs continuar con cuarentena» in S09_STORM.json.

**P2** (rank 9.55/10)
> **Fail-fast** en config: seguir con schema roto multiplica basura. **Cuarentena** en data: una fila mala **no** debe tumbar el lote entero (gate S08/S09).
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Coursera: https://www.coursera.org/specializations/python; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Fallar rápido vs continuar con cuarentena» in S09_STORM.json.

**P3** (rank 9.55/10)
> Éxito parcial es válido si el manifest contabiliza `ok + quarantined = input`. Documenta la política en el README del job — fail closed si el reconcile falla.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Live: https://pillb.github.io/pyarcana/; Python: https://docs.python.org/3/library/decimal.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Fallar rápido vs continuar con cuarentena» in S09_STORM.json.

### Idempotencia, retries y cuarentena
**P1** (rank 9.55/10)
> **Retry solo errores transitorios** (`TimeoutError`, 503, red). `ValueError` de datos **no** se reintenta: va a **cuarentena**. Reintentar un monto inválido no lo hace válido.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/decimal.html; OWASP: https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Idempotencia, retries y cuarentena» in S09_STORM.json.

**P2** (rank 9.55/10)
> Operaciones **idempotentes** (misma clave de escritura) permiten re-correr un job sin duplicar side-effects. Clave típica: `(source, record_id, version)` — eco del manifest S08.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** OWASP: https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html; Python: https://docs.python.org/3/tutorial/errors.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Idempotencia, retries y cuarentena» in S09_STORM.json.

**P3** (rank 9.55/10)
> Backoff simple (sleep creciente) reduce thundering herd. Tras `max_attempts` → cuarentena o fail según la política documentada. **Nunca** retries infinitos en prod.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/tutorial/errors.html; Python: https://docs.python.org/3/library/logging.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Idempotencia, retries y cuarentena» in S09_STORM.json.

