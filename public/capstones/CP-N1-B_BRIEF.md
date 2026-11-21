# Pipeline ETL Reproducible de Clientes y Transacciones

**Versión:** 3.0.0 · **Nivel:** 1 · **Cierra:** S08

Un *capstone* es el proyecto que integra lo aprendido en varias secciones. Este cierra S08 y es
su You Do, `etl_cp_n1_b.py`: el mismo contrato, con pruebas que dicen si lo cumples. Un *ETL*
(extraer, transformar, cargar) es un programa que lee datos de una fuente, los valida y los
escribe en un destino.

## Usuario y problema
- **Usuario:** una persona que se forma en ingeniería de datos y procesa lotes sintéticos.
- **Problema:** llegan dos archivos, `clients.csv` y `transactions.json`, con filas buenas y
  filas irregulares. El programa separa las filas que cumplen el contrato (*clean*, limpias) de
  las que no (*quarantine*, cuarentena: apartadas con su motivo para que una persona las revise).
  Guarda el hash de cada archivo crudo y escribe un *manifest*: un JSON que dice cuántas filas
  entraron y dónde terminó cada una. Si las cuentas de una fuente no cuadran, no publica nada.

## Qué archivo escribes
- **`STARTER/cp_n1_b.py`** es tu archivo. Ya tiene las funciones declaradas,
  las constantes y dos funciones de formato (`csv_text` y `jsonl_text`) escritas.
- **`reference/cp_n1_b.py`** es la solución de referencia. Ábrelo solo para comparar cuando tus
  pruebas pasen. `demo.py` ejecuta esa referencia.
- **`tests/test_demo.py`** prueba tu archivo. Al principio fallan las 11 pruebas, y cada fallo
  dice qué función escribir y qué regla de esta página mirar.

Si ya hiciste el You Do de S08, tu `etl_cp_n1_b.py` tiene casi todo. Hay dos diferencias: los
cargadores devuelven también `stats`, como `quarantine_irregular` de T2-B, y `run` acepta un
`run_id` opcional para que las pruebas lo fijen.

## Prerrequisitos
CP-N1-A. S05 (funciones y contratos), S06 (colecciones) y S07 (texto, Unicode y expresiones
regulares). S08 (archivos, CSV, JSON y contratos de ingesta) es la sección que este capstone
cierra.

## Secciones que contribuyen
S05, S06, S07, S08

## Datos
`data/generate.py` escribe las dos fuentes. Son fijas, sin azar, y ningún dato es real.

- **`data/clients.csv`**: columnas `id,nombre,monto`, separadas por coma y en UTF-8 con BOM (la
  marca que Excel pone al inicio). `monto` es texto decimal: `10.50`, no `10,50`. Tiene 8
  registros y una línea vacía.
- **`data/transactions.json`**: una lista JSON. Cada elemento debe ser un objeto con `id`,
  `client_id` y `monto`, y `monto` debe ser texto. Tiene 8 elementos.

## Reglas
Cada regla dice en qué subtema de S08 la viste.

1. **`sha256_file(path)`** (T4-A). El hash sha256 de los bytes crudos del archivo, en hexadecimal.
   Un solo byte distinto da otro hash; así el manifest prueba qué archivo se procesó.
2. **`write_atomic(path, text)`** (T1-B). Escribe en un temporal único junto al destino
   (`tempfile.mkstemp(dir=path.parent, ...)`), con saltos de línea LF, y lo publica con
   `os.replace`. Nunca deja el destino a medias ni un `.tmp` suelto.
3. **`monto_texto(value)`** (T2-A). Si `value` es texto con solo dígitos ASCII y como máximo un
   punto, devuelve el monto con dos decimales: `"10.5"` → `"10.50"`. Si no, devuelve `None`:
   `"10,50"`, `"abc"`, `""`, `"-5"` y un número JSON como `12.5` no son montos de este contrato.
   `Decimal(...).quantize(Decimal("0.01"))` redondea al par: `"12.345"` → `"12.34"` (S02).
4. **`load_clients_csv(path)`** (T2-B). Lee el archivo con `encoding="utf-8-sig"`, que quita el
   BOM, y lo recorre con `io.StringIO` para recuperar el texto crudo de cada registro. Devuelve
   `(clean, quarantine, stats)`.
   - Un registro con más o menos de 3 columnas va a cuarentena con `reason: "col_count"`. La
     fila `C004,Carla Demo,10,50` tiene 4: la coma decimal crea una columna de más. En cambio,
     `"Quispe, Rosa"` va entre comillas y es una sola columna.
   - `id` o `nombre` vacío → `"missing_key"`. Un monto inválido → `"cast_monto"`.
   - Cada fila de cuarentena es `{"raw", "record_number", "reason"}`, más `"parsed_row"` cuando el
     registro tiene sus 3 columnas.
   - Una línea vacía no es un registro: se cuenta en `n_blank_ignored`.
   - `stats` es `{"n_in", "n_clean", "n_quarantine", "n_blank_ignored"}`.
   - Un encabezado distinto de `id,nombre,monto` detiene la corrida con `ValueError`: si las
     columnas no son las del contrato, ninguna fila es confiable.
5. **`validate_schema(obj, required)` y `load_transactions_json(path)`** (T3-B).
   - Un elemento que no es un objeto → `"schema"`. Un objeto al que le falta una clave, o que la
     trae con `null` → `"missing_key"`. Un monto inválido → `"cast_monto"`.
   - `raw` es el elemento como JSON con las claves ordenadas.
6. **`fuentes_rotas(sources)` y `build_manifest(run_id=..., sources=...)`** (T4-B).
   - Cada fuente debe cumplir `n_in == n_clean + n_quarantine` por separado: un sobrante en el
     CSV no compensa un faltante en el JSON.
   - `build_manifest` ordena las fuentes por nombre y suma los totales desde ellas. Lanza
     `ValueError` si una fuente no cuadra o si dos fuentes tienen el mismo nombre.
7. **`run(data_dir, out_dir, run_id=None)`** (T4).
   - Carga las dos fuentes antes de escribir nada. Si `fuentes_rotas` no está vacía, imprime
     `ERROR` y devuelve 1 sin publicar.
   - Si todo cuadra, copia los crudos a `out/backups/{run_id}/` y escribe con `write_atomic`:
     `out/clean/clients.csv`, `out/clean/transactions.json`, `out/quarantine/clients.jsonl`,
     `out/quarantine/transactions.jsonl` y, al final, `out/manifest.json`. Devuelve 0.
   - Sin `run_id`, crea uno nuevo con `uuid.uuid4().hex`.

## Interfaz
`cp_n1_b.run(data_dir, out_dir, run_id=None) -> int`. Devuelve 0 si publicó todo y 1 si una
fuente no cuadra. El resultado es `out/manifest.json`, con:

- `run_id`: el identificador de esta corrida;
- `sources`: una entrada por fuente con `name`, `sha256`, `n_in`, `n_clean`, `n_quarantine`,
  `n_blank_ignored` y `reconcile_ok`;
- `n_in`, `n_clean`, `n_quarantine` y `reconcile_ok`: los totales, sumados desde `sources`.

Con los datos de `data/`: 16 registros entran, 7 quedan limpios y 9 en cuarentena.

## Criterios de aceptación
- las filas válidas van a `clean` y cada fila irregular va a `quarantine` con un motivo estable
  (`col_count`, `missing_key`, `cast_monto`, `schema`)
- una fila con una columna de más o de menos → cuarentena, y el lote sigue
- cada fuente cumple `n_in == n_clean + n_quarantine`; si no, la corrida devuelve 1 sin publicar
- cada `id` de entrada aparece una sola vez: en `clean` o en `quarantine` de su fuente
- repetir la corrida da los mismos archivos de `clean` y `quarantine` y las mismas `sources`
- un archivo ilegible (JSON roto, encabezado distinto) detiene la corrida sin publicar nada
- los montos se guardan como texto decimal (`"10.50"`), nunca como `float`

## Fallos críticos (P0)
Un fallo crítico invalida la entrega aunque el resto esté bien:
- expone claves o contraseñas;
- no es idempotente: repetir la corrida con los mismos datos cambia `clean`, `quarantine` o
  `sources`;
- descarta filas irregulares en lugar de ponerlas en cuarentena;
- pierde la proveniencia: no se puede saber de qué archivo y de qué registro viene cada fila.

## ¿Por qué cambia el manifest si los datos no cambiaron?
Por el `run_id`. Identifica una corrida, no los datos, así que cada corrida crea uno nuevo, como
enseña T4-B. Para saber si dos corridas procesaron lo mismo, compara `sources` (los `sha256` y
los conteos) o los archivos de `clean`. Las pruebas lo hacen así.

## Limitaciones
Procesamiento local por lotes, no en flujo continuo. No usa base de datos. Los tres reemplazos
de `clean`, `quarantine` y `manifest` son atómicos uno por uno, no como conjunto: por eso el
manifest se escribe al final y lleva el `run_id`. La cuarentena no indica fraude: solo dice que
la fila no cumple el contrato.

## Remediación
- Si una fila desaparece, compara los `id` de entrada con los de `clean` y `quarantine` (prueba
  08).
- Si dos corridas dan archivos distintos, busca algo que dependa del momento de ejecución, como
  la hora o el `run_id`, fuera del manifest.
- Si la corrida se detiene con `ValueError` en el encabezado aunque el archivo diga
  `id,nombre,monto`, revisa que lo abras con `utf-8-sig`: con `utf-8`, el BOM queda pegado al
  nombre de la primera columna, y el encabezado es `\ufeffid,nombre,monto`.
