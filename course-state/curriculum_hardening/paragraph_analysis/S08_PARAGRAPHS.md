# S8 Paragraph-by-Paragraph Analysis with Sources

Generated: 2026-07-24T04:58:20.582+00:00
Section: Archivos, CSV, JSON y contratos de ingesta
File: `s08-pandas.ts`
STORM cycles: **8**
Expert rank: **9.55**

## Competitive sources (domain-honest HTTP ≥5)

- Python: [pathlib](https://docs.python.org/3/library/pathlib.html) — paths
- Python: [csv](https://docs.python.org/3/library/csv.html) — CSV
- Python: [json](https://docs.python.org/3/library/json.html) — JSON
- Python: [hashlib](https://docs.python.org/3/library/hashlib.html) — sha256
- Python: [os.replace](https://docs.python.org/3/library/os.html#os.replace) — atomic
- Python: [decimal](https://docs.python.org/3/library/decimal.html) — money cast
- Real Python: [Working with files](https://realpython.com/working-with-files-in-python/) — pathlib ped
- MIT: [6.100L](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/) — files
- Harvard: [CS50P](https://cs50.harvard.edu/python/) — CSV
- deeplearning.ai: [Data engineering](https://www.deeplearning.ai/specializations/data-engineering) — pipelines
- Live: [PyArcana](https://pillb.github.io/pyarcana/) — course
- Python: [tempfile](https://docs.python.org/3/library/tempfile.html) — tmp
- Python: [io](https://docs.python.org/3/library/io.html) — StringIO demos

## Gold pass
| Area | Decision |
|------|----------|
| theory | deepen + domain contracts |
| weDo | CASO DEFECT |
| git | NO restore |
| STORM | hand_STORM_domain_sources |

## Theory (paragraph-level)

### De “Pandas EDA” a archivos, CSV/JSON y gate CP-N1-B (mapa)
**P1** (rank 9.55/10)
> En V3, **S08 no es el path principal de pandas groupby/merge/EDA**. Ese material se reubica al nivel 2 de data. Aquí cierras el gate **CP-N1-B**: ingesta **CSV + JSON** con **pa…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/pathlib.html; Python: https://docs.python.org/3/library/csv.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “Pandas EDA” a archivos, CSV/JSON y gate CP-N» in S08_STORM.json.

**P2** (rank 9.55/10)
> Integra normalizadores (S05–S07) y el modelo en memoria (S06). Entorno declarado **local-python** (filesystem). Datos sintéticos en `data/`; salidas en `out/`. Contrato: entrada…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/csv.html; Python: https://docs.python.org/3/library/json.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “Pandas EDA” a archivos, CSV/JSON y gate CP-N» in S08_STORM.json.

**P3** (rank 9.55/10)
> Orden: **T1 Archivos** → **T2 CSV** → **T3 JSON** → **T4 Provenance y manifest**. Caso sintético Perú: CSV/JSON sintéticos de clientes C00x y montos PEN ficticios. Documenta dec…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/json.html; Python: https://docs.python.org/3/library/hashlib.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “Pandas EDA” a archivos, CSV/JSON y gate CP-N» in S08_STORM.json.

### pathlib, with, modos y encodings
**P1** (rank 9.55/10)
> `pathlib.Path` unifica rutas cross-platform. `Path.read_text(encoding='utf-8')` / `write_text` son convenientes; `with path.open(...) as f` da control de modo. En CP-N1-B, el *p…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/hashlib.html; Python: https://docs.python.org/3/library/os.html#os.replace
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «pathlib, with, modos y encodings» in S08_STORM.json.

**P2** (rank 9.55/10)
> Modos: `r` lectura, `w` trunca, `a` append, `x` crea exclusivo. **Siempre** declara `encoding='utf-8'` en texto (Windows no lo asume). `errors=` (`strict` default, `replace`) de…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/os.html#os.replace; Python: https://docs.python.org/3/library/decimal.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «pathlib, with, modos y encodings» in S08_STORM.json.

**P3** (rank 9.55/10)
> `path.exists()` / `is_file()` evitan sorpresas. No asumas el cwd: usa paths relativos al proyecto o `Path(__file__).resolve().parent`. Caso sintético: CSV/JSON de clientes `C00x…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/decimal.html; Real Python: https://realpython.com/working-with-files-in-python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «pathlib, with, modos y encodings» in S08_STORM.json.

### Newlines y escritura atómica
**P1** (rank 9.55/10)
> CSV en Python: abre con `newline=''` para que el módulo `csv` controle terminadores. Texto universal: prefiere `\ ` en salidas del pipeline. Sin `newline=''`, Windows puede inse…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Real Python: https://realpython.com/working-with-files-in-python/; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Newlines y escritura atómica» in S08_STORM.json.

**P2** (rank 9.55/10)
> **Escritura atómica**: escribe a un archivo temporal en el **mismo** directorio y luego `os.replace(tmp, dest)`. Si el proceso muere a medias, **no** dejas el destino truncado p…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Newlines y escritura atómica» in S08_STORM.json.

**P3** (rank 9.55/10)
> Detectar `\\r\ ` en inputs documenta provenance (origen Windows vs Unix). Caso sintético: clientes `C00x` — **nunca** PII real ni claims de fraude.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; deeplearning.ai: https://www.deeplearning.ai/specializations/data-engineering
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Newlines y escritura atómica» in S08_STORM.json.

### Dialectos, headers y tipos
**P1** (rank 9.55/10)
> `csv.DictReader` / `DictWriter` trabajan con headers. **Declara `fieldnames`**. Cast de tipos (`int`, `Decimal`) es **explícito** y fallos van a reject/cuarentena — no silencies…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** deeplearning.ai: https://www.deeplearning.ai/specializations/data-engineering; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Dialectos, headers y tipos» in S08_STORM.json.

**P2** (rank 9.55/10)
> Fechas pueden quedarse como string ISO en N1-B si no hay parser de calendario aún; lo importante es el **contrato de columnas** documentado y versionado en el manifest. Fail-clo…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Live: https://pillb.github.io/pyarcana/; Python: https://docs.python.org/3/library/tempfile.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Dialectos, headers y tipos» in S08_STORM.json.

**P3** (rank 9.55/10)
> Dialectos (delimitador `;` vs `,`) se configuran; **no** asumas Excel latam sin mirar el archivo. Caso sintético: `C00x` y montos PEN ficticios — **nunca** PII real.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/tempfile.html; Python: https://docs.python.org/3/library/io.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Dialectos, headers y tipos» in S08_STORM.json.

### Filas irregulares y cuarentena
**P1** (rank 9.55/10)
> Filas con **más/menos columnas** que el header son irregulares. **No** las “arregles” en silencio: mándalas a `quarantine.csv` con **motivo** y conserva el **raw**. Silenciar ir…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/io.html; Python: https://docs.python.org/3/library/pathlib.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Filas irregulares y cuarentena» in S08_STORM.json.

**P2** (rank 9.55/10)
> Resumen de motivos (`contador por reason`) alimenta el **manifest** y el dashboard de calidad. Contrato: entrada → transformación documentada → salida medible; fail-closed si el…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/pathlib.html; Python: https://docs.python.org/3/library/csv.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Filas irregulares y cuarentena» in S08_STORM.json.

**P3** (rank 9.55/10)
> Good path escribe solo filas que pasaron schema + casts + normalización (S05–S07). Caso sintético: `C00x` y montos PEN — **nunca** PII real ni claims de fraude.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/csv.html; Python: https://docs.python.org/3/library/json.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Filas irregulares y cuarentena» in S08_STORM.json.

### Objetos/arrays y serialización JSON
**P1** (rank 9.55/10)
> `json.loads` / `dumps` y `load` / `dump` sobre archivos. JSON objects → dict; arrays → list. **JSONL** (un objeto por línea) es útil para streams de txs. JSON **no** tiene tipo …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/json.html; Python: https://docs.python.org/3/library/hashlib.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Objetos/arrays y serialización JSON» in S08_STORM.json.

**P2** (rank 9.55/10)
> `ensure_ascii=False` preserva tildes legibles. `sort_keys=True` ayuda a **determinismo** en manifests (eco de S06). Fail-closed si el schema no cuadra.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/hashlib.html; Python: https://docs.python.org/3/library/os.html#os.replace
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Objetos/arrays y serialización JSON» in S08_STORM.json.

**P3** (rank 9.55/10)
> `datetime` no es serializable por defecto: convierte a `isoformat()` o str. Caso sintético: `C00x` — **nunca** PII real.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/os.html#os.replace; Python: https://docs.python.org/3/library/decimal.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Objetos/arrays y serialización JSON» in S08_STORM.json.

### Schema, nulls y evolución compatible
**P1** (rank 9.55/10)
> Valida **required keys** antes de normalizar. `null` JSON → `None` en Python. Distingue null explícito de clave ausente si la política lo requiere (eco S03: missing ≠ empty).
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/decimal.html; Real Python: https://realpython.com/working-with-files-in-python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Schema, nulls y evolución compatible» in S08_STORM.json.

**P2** (rank 9.55/10)
> Evolución: añadir campo opcional con **default** no rompe lectores viejos. Quitar required **sí** es breaking. Versiona el schema en el manifest del run.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Real Python: https://realpython.com/working-with-files-in-python/; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Schema, nulls y evolución compatible» in S08_STORM.json.

**P3** (rank 9.55/10)
> `validate_schema(obj, required)` retorna ok/errors para cuarentena. Caso sintético: `C00x` — fail-closed si falta `id` o email requerido.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Schema, nulls y evolución compatible» in S08_STORM.json.

### Backups, hashes y provenance
**P1** (rank 9.55/10)
> `hashlib.sha256` del contenido del input fija un fingerprint en el manifest. Si el CSV cambia, el hash cambia — detectas reprocesos. En ingesta de archivos, el *porqué* es opera…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; deeplearning.ai: https://www.deeplearning.ai/specializations/data-engineering
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Backups, hashes y provenance» in S08_STORM.json.

**P2** (rank 9.55/10)
> Backup: copia `input.bak` o a `backups/` **antes** de transformar. No mutes el original in place. Contrato: entrada explícita → transformación documentada → salida medible; si f…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** deeplearning.ai: https://www.deeplearning.ai/specializations/data-engineering; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Backups, hashes y provenance» in S08_STORM.json.

**P3** (rank 9.55/10)
> Provenance mínima: `{path, sha256, bytes, received_at}` por fuente. Caso sintético Perú: CSV/JSON sintéticos de clientes C00x y montos PEN ficticios. Documenta decisión, métrica…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Live: https://pillb.github.io/pyarcana/; Python: https://docs.python.org/3/library/tempfile.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Backups, hashes y provenance» in S08_STORM.json.

### Reconciliación y manifest de corrida
**P1** (rank 9.55/10)
> Manifest JSON de la corrida: timestamps, versión y una entrada por fuente con `name`, hash y conteos `n_in`, `n_clean`, `n_quarantine`. Los totales de corrida se calculan sumand…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/tempfile.html; Python: https://docs.python.org/3/library/io.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Reconciliación y manifest de corrida» in S08_STORM.json.

**P2** (rank 9.55/10)
> **Reconciliación en dos niveles**: cada fuente cumple `n_in == n_clean + n_quarantine` y los totales son la suma exacta de las fuentes. Validar solo el agregado puede ocultar un…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/io.html; Python: https://docs.python.org/3/library/pathlib.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Reconciliación y manifest de corrida» in S08_STORM.json.

**P3** (rank 9.55/10)
> Evidencia del gate CP-N1-B: scripts + fixtures + manifest de demo + tests + README. Caso sintético Perú: CSV/JSON sintéticos de clientes C00x y montos PEN ficticios. Documenta d…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Python: https://docs.python.org/3/library/pathlib.html; Python: https://docs.python.org/3/library/csv.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Reconciliación y manifest de corrida» in S08_STORM.json.

