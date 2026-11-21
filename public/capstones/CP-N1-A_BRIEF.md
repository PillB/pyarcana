# CLI Reproducible de Admisión de Clientes y Calidad de Datos

**Versión:** 3.0.0 · **Nivel:** 1 · **Cierra:** S04

Un *capstone* es el proyecto que integra lo aprendido en varias secciones. Este cierra S04: las
secciones S01 a S04 aportan cada pieza, y CP-N1-B (S08) y CP-FINAL lo reutilizan.

## Usuario y problema
- **Usuario:** una persona analista junior que ingresa clientes de prueba en un entorno de
  capacitación.
- **Problema:** cada registro llega con tres campos que pueden faltar o venir mal. El programa
  decide un estado por registro, explica el motivo de cada revisión o rechazo, conserva la línea
  cruda tal como llegó y resume el lote con denominadores correctos.

## Qué archivo escribes
- **`STARTER/cp_n1_a.py`** es tu archivo. Ya tiene las funciones declaradas, las
  constantes y el lote de prueba. Tú escribes el cuerpo de cada función.
- **`reference/cp_n1_a.py`** es la solución de referencia. Ábrelo solo para comparar cuando tus
  pruebas pasen. `demo.py` ejecuta esa referencia.
- **`tests/test_demo.py`** prueba tu archivo. Al principio fallan las 11 pruebas, y cada fallo
  dice qué función escribir y qué regla de esta página mirar.

Las funciones se estudian en S05. Aquí no hace falta escribir ninguna `def`: escribes su cuerpo
con `if`/`elif`/`else` (S03) y con bucles y contadores (S04). `return` entrega el resultado de la
función a quien la llamó.

## Prerrequisitos
S01 (entorno reproducible), S02 (valores, tipos e I/O) y S03 (decisiones y reglas de validación).
S04 (iteración y resúmenes) es la sección que este capstone cierra; su You Do,
`intake_quality_batch.py`, aplica las mismas reglas en un solo script.

## Secciones que contribuyen
S01, S02, S03, S04

## Datos
Cada registro es un dict con cuatro claves: `edad`, `region`, `monto_ingreso` y `raw_line`.
`raw_line` es la línea cruda que llegó del formulario de ingreso. El programa la copia tal cual y
nunca la modifica. Todos los datos son sintéticos: no hay ninguna persona real.

## Reglas
Cada campo recibe un **código de motivo**, es decir, una palabra fija que dice qué le pasa. Cada
código lleva a un estado: `accept` (aceptado), `review` (lo revisa una persona) o `reject`
(rechazado por formato). La tabla `ESTADO_DE_CODIGO` de tu archivo ya tiene esa relación.

| Código | Estado | Significa |
|---|---|---|
| `OK` | `accept` | el campo cumple la regla |
| `MISSING` | `review` | el campo falta (vale `None`) |
| `NEEDS_REVIEW` | `review` | el valor es válido pero poco común |
| `NOT_IN_ALLOWLIST` | `review` | el valor no está en el catálogo |
| `BAD_TYPE` | `reject` | el valor no es del tipo pedido |
| `OUT_OF_RANGE` | `reject` | el valor está fuera del rango posible |

1. **`codigo_edad(edad)`.** Ausente → `MISSING`. No es un `int` (por ejemplo `"veinte"`, o
   `True`, que Python también trata como número) → `BAD_TYPE`. Menor que 0 o mayor que 120 →
   `OUT_OF_RANGE`, así que 150 se rechaza. Entre 0 y 17 → `NEEDS_REVIEW`. De 18 a 120 → `OK`.
2. **`codigo_region(region)`.** Ausente → `MISSING`. Una de `R-NORTE`, `R-SUR`, `R-CENTRO` o
   `R-COSTA`, escrita exactamente así → `OK`. Cualquier otra, incluida `r-norte` en minúsculas →
   `NOT_IN_ALLOWLIST`.
3. **`codigo_monto(monto)`.** Ausente → `MISSING`. Solo un `int` o un `Decimal` es un monto: un
   `float` como `10.5`, un texto o `True` → `BAD_TYPE`. Un `Decimal` que no es un número finito
   (`Decimal("NaN")` o `Decimal("Infinity")`) → `BAD_TYPE`; compruébalo con `.is_finite()` antes
   de comparar, porque `Decimal("NaN") < 0` detiene el programa con un error. Negativo →
   `OUT_OF_RANGE`. Mayor que 50000 → `NEEDS_REVIEW`. De 0 a 50000 → `OK`: el cero es un monto
   válido.
4. **`motivos(row)`.** Una lista con `"campo:CODIGO"` por cada campo que no es `OK`, en el orden
   edad, región, monto. Por ejemplo, un registro sin edad da `["edad:MISSING"]`, y uno válido da
   `[]`.
5. **`classify(row)`.** El registro toma el peor estado de sus campos: `reject` si algún campo
   rechaza; si no, `review` si alguno revisa; si no, `accept`.

## Interfaz
`cp_n1_a.run(records) -> dict`. Recibe una lista de registros y devuelve un dict con:

- `results`: una entrada por registro, en el mismo orden, con `raw_line`, `estado` y `motivos`;
- `n_total`, `n_accept`, `n_review` y `n_reject`: los conteos, que cumplen
  `n_total = n_accept + n_review + n_reject`;
- `tasa_reject`: `n_reject / n_total`. Vale `None` cuando el lote está vacío, porque no hay nada
  que dividir; `0.0` diría que se revisaron registros y ninguno falló.

La salida es determinista: el mismo lote da siempre el mismo resultado.

## Criterios de aceptación
- un registro con campos válidos → `accept`, sin motivos
- `monto_ingreso = 0` → `accept`
- `edad` ausente → `review`, con motivo `edad:MISSING`
- `edad = 150` → `reject`; `edad = 17` → `review`
- `region` fuera del catálogo → `review`
- `monto_ingreso` negativo, `float` o `NaN` → `reject`, y el lote sigue con el registro siguiente
- `edad` como texto → `reject`
- el resumen cumple `n_total = n_accept + n_review + n_reject`
- `tasa_reject = n_reject / n_total`, y vale `None` cuando el lote está vacío

## Fallos críticos (P0)
Un fallo crítico invalida la entrega aunque el resto esté bien:
- usa datos de personas reales;
- calcula mal un denominador (divide entre los aceptados, o entre cero sin comprobarlo);
- un registro malformado detiene el lote;
- no tiene pruebas, o tiene pruebas que no pueden fallar.

## Limitaciones
No usa datos reales. No guarda nada en una base de datos. Valida el formato y el rango de cada
campo, no la identidad de la persona. `reject` significa que el registro no cumple el formato,
nunca que la persona sea un mal cliente.

## Remediación
- Si un registro malformado detiene el lote, busca la comparación que se hace antes de comprobar
  el tipo; repasa S02 (tipos) y S03 (el orden de las ramas).
- Si falla un conteo, cuenta el lote a mano y compáralo con lo que devuelve `run()`, incluido el
  lote vacío (S04).
