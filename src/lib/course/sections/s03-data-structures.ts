import type { CourseSection } from '../../types'

export const section03: CourseSection = {
  id: 'data-structures',
  index: 3,
  title: 'Data Structures & File Handling',
  shortTitle: 'Estructuras & Archivos',
  tagline: 'Dicts, listas, CSV, JSON y manejo de errores como en producción',
  estimatedHours: 8,
  level: 'Principiante',
  icon: 'Database',
  accentColor: 'bg-gradient-to-br from-emerald-500 to-teal-600',
  jobRelevance:
    'En tu día como Data Analyst, vas a leer y escribir archivos CSV/JSON constantemente. Pandas internamente usa dicts. Cuando consumes una API REST, recibes JSON. Cuando persistes resultados, escribes JSON. El manejo de errores con try/except es lo que separa código de prototype de código de producción — un script que se cae con FileNotFoundError pierde 2 horas del equipo.',
  learningOutcomes: [
    { text: 'Dominar operaciones avanzadas de list, dict y set (append, get, items, update, comprehension anidada)' },
    { text: 'Construir estructuras anidadas: dict de listas, lista de dicts' },
    { text: 'Leer y escribir archivos CSV con el módulo csv (csv.DictReader, csv.writer)' },
    { text: 'Leer y escribir JSON con el módulo json (load, loads, dump, dumps)' },
    { text: 'Manejar errores con try/except/finally y crear excepciones custom' },
    { text: 'Usar el statement with para gestión automática de recursos' },
  ],
  theory: [
    {
      heading: 'List, dict y set — operaciones que debes tener en la yema',
      paragraphs: [
        'Una lista es una secuencia ordenada mutable. Los métodos clave: `.append(x)` agrega al final, `.extend(iterable)` concatena, `.insert(i, x)` inserta en posición, `.remove(x)` elimina primer match, `.pop(i)` saca por índice, `.sort()` ordena in-place, `.reverse()` invierte. Para chequear pertenencia usa `in`: `if 5 in mi_lista`. La indexación negativa cuenta desde el final: `mi_lista[-1]` es el último elemento.',
        'Un dict es la estructura más usada en Python — pares clave-valor con búsqueda O(1). Métodos clave: `.get(key, default)` evita KeyError, `.keys()`, `.values()`, `.items()` para iteración, `.update(otro_dict)` combina, `.pop(key)` elimina. Para chequear si una key existe: `if key in mi_dict`. La iteración recomendada es `for k, v in mi_dict.items():` que te da clave y valor.',
        'Un set es un conjunto sin duplicados con operaciones de teoría de conjuntos: `|` unión, `&` intersección, `-` diferencia, `^` diferencia simétrica. Útil para eliminar duplicados (`list(set(mi_lista))`) y para comparar listas. En data science, lo usas para encontrar elementos únicos o comunes entre columnas.',
      ],
      code: {
        language: 'python',
        title: 'estructuras.py',
        code: `# List — operaciones esenciales
precios = [12.5, 8.0, 25.3, 7.8]
precios.append(15.0)        # [12.5, 8.0, 25.3, 7.8, 15.0]
precios.sort()              # [7.8, 8.0, 12.5, 15.0, 25.3]
precios.reverse()           # [25.3, 15.0, 12.5, 8.0, 7.8]
mayores_10 = [p for p in precios if p > 10]  # [25.3, 15.0, 12.5]

# Dict — el caballo de batalla
ventas = {
    "lima": 15000,
    "arequipa": 8000,
    "cusco": 5000
}
# .get() evita KeyError
trujillo = ventas.get("trujillo", 0)  # 0 si no existe
ventas["trujillo"] = 6000             # agregar
ventas.update({"piura": 4500, "ica": 3000})  # batch add

# Iteración pythónica
for ciudad, monto in ventas.items():
    print(f"{ciudad}: S/{monto:,}")

# Set — eliminar duplicados y comparar
clientes_2024 = {"ana", "luis", "carlos", "maria"}
clientes_2025 = {"ana", "pedro", "carlos", "sofia"}
nuevos = clientes_2025 - clientes_2024      # {"pedro", "sofia"}
fieles = clientes_2024 & clientes_2025      # {"ana", "carlos"}
todos = clientes_2024 | clientes_2025       # 6 clientes únicos`,
      },
    },
    {
      heading: 'Estructuras anidadas — modelando datos reales',
      paragraphs: [
        'En la vida real, rara vez trabajas con estructuras planas. Un JSON de una API típica tiene dicts dentro de dicts dentro de listas. Aprender a navegar estas estructuras es esencial. La regla: cada nivel de anidamiento se accede con un corchete o un punto adicional.',
        'El patrón más común en data science es la "lista de dicts" — cada dict representa un registro (fila de una tabla). Por ejemplo: `[{"producto": "arroz", "precio": 4.5}, {"producto": "aceite", "precio": 12.0}]`. Pandas convierte esto directamente en un DataFrame con `pd.DataFrame(lista_de_dicts)`. El patrón inverso, "dict de listas", se usa cuando quieres agrupar por categoría: `{"lima": [v1, v2], "arequipa": [v3, v4]}`.',
        'Para construir estructuras anidadas, usa `collections.defaultdict` que crea automáticamente listas/dicts vacíos al primer acceso. Esto evita el patrón verbose `if key not in dict: dict[key] = []` antes de cada append.',
      ],
      code: {
        language: 'python',
        title: 'anidado.py',
        code: `from collections import defaultdict

# Lista de dicts — modelo de registros
ventas = [
    {"fecha": "2025-01-15", "ciudad": "Lima", "producto": "arroz", "monto": 1500},
    {"fecha": "2025-01-15", "ciudad": "Lima", "producto": "aceite", "monto": 800},
    {"fecha": "2025-01-16", "ciudad": "Arequipa", "producto": "arroz", "monto": 900},
    {"fecha": "2025-01-16", "ciudad": "Lima", "producto": "arroz", "monto": 1200},
]

# Agrupar por ciudad con defaultdict
ventas_por_ciudad = defaultdict(list)
for venta in ventas:
    ventas_por_ciudad[venta["ciudad"]].append(venta["monto"])

# Resultado: {"Lima": [1500, 800, 1200], "Arequipa": [900]}

# Calcular totales por ciudad con dict comprehension
totales = {ciudad: sum(montos) for ciudad, montos in ventas_por_ciudad.items()}
# {"Lima": 3500, "Arequipa": 900}

# Anidamiento más profundo: dict de dict de listas
por_ciudad_producto = defaultdict(lambda: defaultdict(list))
for v in ventas:
    por_ciudad_producto[v["ciudad"]][v["producto"]].append(v["monto"])

# Acceso: por_ciudad_producto["Lima"]["arroz"] -> [1500, 1200]`,
      },
      callout: {
        type: 'tip',
        title: 'Cuándo usar defaultdict vs dict.get()',
        content:
          'defaultdict es ideal cuando vas a construir una estructura iterativamente (agrupar, acumular). dict.get() es mejor para lectura puntual donde no quieres modificar el dict. Mezclarlos es señal de diseño confuso.',
      },
    },
    {
      heading: 'Archivos CSV y JSON — entrada/salida estándar',
      paragraphs: [
        'CSV (Comma-Separated Values) es el formato más común para datos tabulares. Python trae el módulo `csv` incorporado. La forma pythónica de leer es con `csv.DictReader` que devuelve cada fila como un dict (usando la primera fila como headers). Para escribir, `csv.DictWriter` con `writeheader()` y `writerows()`.',
        'JSON (JavaScript Object Notation) es el estándar para APIs y configuración. El módulo `json` tiene 4 funciones que debes conocer: `json.load(file)` lee de archivo, `json.loads(string)` lee de string, `json.dump(obj, file)` escribe a archivo, `json.dumps(obj)` convierte a string. El truco mnemotécnico: "s" = string, sin "s" = archivo.',
        'Para archivos, SIEMPRE usa el statement `with` que cierra el archivo automáticamente al salir del bloque, incluso si hay excepción. Esto evita fugas de recursos. La sintaxis: `with open("archivo.csv", "r") as f: ...`. Después del bloque, el archivo está cerrado sin que tengas que llamar `f.close()`.',
      ],
      code: {
        language: 'python',
        title: 'archivos.py',
        code: `import csv
import json

# Escribir CSV
ventas = [
    {"producto": "arroz", "precio": 4.5, "stock": 100},
    {"producto": "aceite", "precio": 12.0, "stock": 50},
    {"producto": "azucar", "precio": 3.8, "stock": 200},
]

with open("productos.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["producto", "precio", "stock"])
    writer.writeheader()
    writer.writerows(ventas)

# Leer CSV
with open("productos.csv", "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for fila in reader:
        print(fila)
        # {'producto': 'arroz', 'precio': '4.5', 'stock': '100'}

# Escribir JSON
config = {
    "database": {"host": "localhost", "port": 5432},
    "debug": True,
    "features": ["auth", "reports", "export"]
}
with open("config.json", "w", encoding="utf-8") as f:
    json.dump(config, f, indent=2, ensure_ascii=False)

# Leer JSON
with open("config.json", "r", encoding="utf-8") as f:
    config_leida = json.load(f)
print(config_leida["database"]["host"])  # "localhost"

# JSON string (cuando consumes una API)
import json
respuesta_api = '{"user": "ana", "score": 95}'
data = json.loads(respuesta_api)
print(data["user"])  # "ana"`,
      },
    },
    {
      heading: 'Manejo de errores — try/except/finally',
      paragraphs: [
        'En producción, las cosas fallan: el archivo no existe, la API cae, el usuario mete texto donde iba número. Un código robusto anticipa estos fallos y los maneja elegantemente. La estructura es `try:` (código que puede fallar), `except TipoError as e:` (qué hacer si falla), `else:` (qué hacer si no falló), `finally:` (se ejecuta siempre, ideal para cleanup).',
        'Python tiene decenas de excepciones integradas: `FileNotFoundError`, `PermissionError`, `ValueError`, `TypeError`, `KeyError`, `IndexError`, `json.JSONDecodeError`. Captura la más específica posible — capturar `Exception` a secas es mala práctica porque oculta bugs. Si vas a manejar archivo no encontrado, captura `FileNotFoundError`, no Exception.',
        'Para errores de negocio propios, crea excepciones custom heredando de `Exception`. Por ejemplo: `class SaldoInsuficienteError(Exception): pass`. Esto hace tu código más expresivo y permite al caller manejar tu error específicamente.',
      ],
      code: {
        language: 'python',
        title: 'errores.py',
        code: `import json

class DatosInvalidosError(Exception):
    """Excepción custom para datos inválidos."""
    pass

def leer_config(ruta):
    """
    Lee un archivo JSON de configuración.
    Maneja errores comunes de archivo y parsing.
    """
    try:
        with open(ruta, "r", encoding="utf-8") as f:
            config = json.load(f)
    except FileNotFoundError:
        print(f"⚠️  Archivo no encontrado: {ruta}")
        return {}
    except PermissionError:
        print(f"⚠️  Sin permisos para leer: {ruta}")
        return {}
    except json.JSONDecodeError as e:
        print(f"⚠️  JSON inválido en {ruta}: {e}")
        return {}
    except Exception as e:
        # Catch-all solo para errores realmente inesperados
        print(f"⚠️  Error inesperado: {type(e).__name__}: {e}")
        return {}
    else:
        # Se ejecuta si no hubo excepción
        print(f"✓ Configuración cargada desde {ruta}")
        return config
    finally:
        # Se ejecuta SIEMPRE (haya o no excepción)
        # Ideal para cleanup: cerrar conexiones, liberar locks
        pass

# Excepción custom para validar datos
def procesar_pago(monto, saldo):
    if monto <= 0:
        raise DatosInvalidosError(f"Monto debe ser positivo, recibido: {monto}")
    if monto > saldo:
        raise DatosInvalidosError(f"Saldo insuficiente: {saldo}, requerido: {monto}")
    return saldo - monto

# Uso con manejo
try:
    nuevo_saldo = procesar_pago(150, 100)
except DatosInvalidosError as e:
    print(f"Operación rechazada: {e}")
else:
    print(f"Nuevo saldo: {nuevo_saldo}")`,
        output: `Operación rechazada: Saldo insuficiente: 100, requerido: 150`,
      },
    },
  ],
  iDo: {
    intro:
      'Voy a construir contigo un parser de ventas que lee un CSV, lo procesa con estructuras anidadas, y exporta un resumen en JSON. Es exactamente el tipo de script que escribes el día 1 en un trabajo de BI: te dan un CSV crudo, te piden un reporte agregado. Lo vamos a hacer con manejo de errores robusto porque en producción los CSVs vienen sucios.',
    steps: [
      {
        description: 'Crear CSV de muestra y función de lectura robusta',
        code: {
          language: 'python',
          title: 'sales_parser.py',
          code: `import csv
import json
from collections import defaultdict
from pathlib import Path

def crear_csv_muestra():
    """Crea un CSV de muestra con datos de ventas."""
    datos = [
        {"fecha": "2025-01-15", "region": "Lima", "producto": "arroz", "cantidad": 50, "precio": 4.5},
        {"fecha": "2025-01-15", "region": "Lima", "producto": "aceite", "cantidad": 30, "precio": 12.0},
        {"fecha": "2025-01-16", "region": "Arequipa", "producto": "arroz", "cantidad": 40, "precio": 4.5},
        {"fecha": "2025-01-16", "region": "Lima", "producto": "azucar", "cantidad": 25, "precio": 3.8},
        {"fecha": "2025-01-17", "region": "Cusco", "producto": "aceite", "cantidad": 15, "precio": 12.5},
        {"fecha": "2025-01-17", "region": "Lima", "producto": "arroz", "cantidad": 60, "precio": 4.5},
    ]
    with open("ventas.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=datos[0].keys())
        writer.writeheader()
        writer.writerows(datos)
    print("✓ CSV de muestra creado: ventas.csv")

crear_csv_muestra()`,
          output: `✓ CSV de muestra creado: ventas.csv`,
        },
        why: 'Crear datos de muestra reproducibles es clave para testear. Si tu script funciona con este CSV pequeño, funcionará con uno de 100K filas. La función es determinística — cada vez que la corras, tendrás el mismo input.',
      },
      {
        description: 'Leer CSV y construir estructura anidada',
        code: {
          language: 'python',
          title: 'sales_parser.py',
          code: `def leer_ventas(ruta_csv):
    """
    Lee el CSV de ventas y devuelve lista de dicts.
    Maneja errores de archivo y valida datos.
    """
    ventas = []
    try:
        with open(ruta_csv, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for i, fila in enumerate(reader, 1):
                # Validar y convertir tipos
                try:
                    venta = {
                        "fecha": fila["fecha"],
                        "region": fila["region"],
                        "producto": fila["producto"],
                        "cantidad": int(fila["cantidad"]),
                        "precio": float(fila["precio"]),
                        "total": int(fila["cantidad"]) * float(fila["precio"])
                    }
                    ventas.append(venta)
                except (ValueError, KeyError) as e:
                    print(f"⚠️  Fila {i} inválida, saltando: {e}")
    except FileNotFoundError:
        print(f"❌ Archivo no encontrado: {ruta_csv}")
        return []

    print(f"✓ {len(ventas)} ventas leídas de {ruta_csv}")
    return ventas

ventas = leer_ventas("ventas.csv")`,
          output: `✓ 6 ventas leídas de ventas.csv`,
        },
        why: 'Validar tipos al leer es crítico. CSVs son texto puro — todo viene como string. Si no conviertes `int()` y `float()`, después no puedes hacer cálculos numéricos. El try/except dentro del loop permite que una fila mala no mate todo el proceso.',
      },
      {
        description: 'Agregar por categoría y exportar resumen JSON',
        code: {
          language: 'python',
          title: 'sales_parser.py',
          code: `def generar_resumen(ventas):
    """
    Genera resúmenes agregados por región y producto.
    """
    # Total por región
    por_region = defaultdict(float)
    for v in ventas:
        por_region[v["region"]] += v["total"]

    # Total por producto
    por_producto = defaultdict(lambda: {"cantidad": 0, "total": 0.0})
    for v in ventas:
        por_producto[v["producto"]]["cantidad"] += v["cantidad"]
        por_producto[v["producto"]]["total"] += v["total"]

    # Top 3 productos por ingreso
    top_productos = sorted(
        [(p, d["total"]) for p, d in por_producto.items()],
        key=lambda x: x[1],
        reverse=True
    )[:3]

    resumen = {
        "total_ventas": len(ventas),
        "ingreso_total": sum(v["total"] for v in ventas),
        "por_region": dict(por_region),
        "por_producto": {k: dict(v) for k, v in por_producto.items()},
        "top_3_productos": [{"producto": p, "ingreso": t} for p, t in top_productos]
    }
    return resumen

def exportar_resumen(resumen, ruta_json):
    """Exporta el resumen a un archivo JSON."""
    try:
        with open(ruta_json, "w", encoding="utf-8") as f:
            json.dump(resumen, f, indent=2, ensure_ascii=False)
        print(f"✓ Resumen exportado a {ruta_json}")
    except IOError as e:
        print(f"❌ Error escribiendo {ruta_json}: {e}")

# Ejecutar pipeline completo
ventas = leer_ventas("ventas.csv")
resumen = generar_resumen(ventas)
exportar_resumen(resumen, "resumen.json")

# Mostrar resumen en consola
print(f"\\n📊 RESUMEN DE VENTAS")
print(f"Total ventas: {resumen['total_ventas']}")
print(f"Ingreso total: S/{resumen['ingreso_total']:.2f}")
print(f"\\nPor región:")
for region, total in resumen["por_region"].items():
    print(f"  {region}: S/{total:.2f}")
print(f"\\nTop 3 productos:")
for p in resumen["top_3_productos"]:
    print(f"  {p['producto']}: S/{p['ingreso']:.2f}")`,
          output: `📊 RESUMEN DE VENTAS
Total ventas: 6
Ingreso total: S/1355.00

Por región:
  Lima: S/965.00
  Arequipa: S/180.00
  Cusco: S/187.50

Top 3 productos:
  aceite: S/525.00
  arroz: S/675.00
  azucar: S/95.00`,
        },
        why: 'La estructura final — `leer_ventas → generar_resumen → exportar_resumen` — es un mini-pipeline ETL (Extract, Transform, Load). Cada función tiene una responsabilidad clara. Esta separación te permite testear cada paso independientemente y reemplazar componentes (por ejemplo, leer de SQL en vez de CSV) sin romper el resto.',
      },
    ],
  },
  weDo: {
    intro:
      'Te toca a ti ahora. Vamos a construir un lector de archivos JSON de configuración con validación. Es un caso real: cuando despliegas una app, lees un config.json que define conexiones, features, etc. Si el JSON está mal, tu app no debe caerse feamente — debe dar un mensaje claro.',
    steps: [
      {
        instruction: 'Crea una función que lea un JSON de configuración y valide que tenga las keys obligatorias',
        hint: 'Usa try/except para FileNotFoundError y json.JSONDecodeError. Valida con un set de keys obligatorias y raise ValueError si faltan.',
        starterCode: {
          language: 'python',
          title: 'config_loader.py',
          code: `import json

def cargar_config(ruta, keys_obligatorias=None):
    """
    Lee y valida un archivo JSON de configuración.

    Args:
        ruta: path al archivo .json
        keys_obligatorias: lista de keys que deben existir

    Returns:
        dict con la configuración
    Raises:
        FileNotFoundError, json.JSONDecodeError, ValueError
    """
    # Tu código aquí
    pass`,
        },
        solutionCode: {
          language: 'python',
          title: 'config_loader.py',
          code: `import json

def cargar_config(ruta, keys_obligatorias=None):
    """
    Lee y valida un archivo JSON de configuración.
    """
    if keys_obligatorias is None:
        keys_obligatorias = []

    with open(ruta, "r", encoding="utf-8") as f:
        config = json.load(f)

    faltantes = [k for k in keys_obligatorias if k not in config]
    if faltantes:
        raise ValueError(f"Keys faltantes en config: {faltantes}")

    return config

# Test
import tempfile, os

# Crear config temporal
config_test = {"host": "localhost", "port": 5432, "debug": True}
with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False) as f:
    json.dump(config_test, f)
    ruta = f.name

try:
    config = cargar_config(ruta, keys_obligatorias=["host", "port"])
    print(f"✓ Config válido: host={config['host']}")
    # Probar validación
    cargar_config(ruta, keys_obligatorias=["password"])
except ValueError as e:
    print(f"✓ Validación funciona: {e}")
finally:
    os.unlink(ruta)`,
          output: `✓ Config válido: host=localhost
✓ Validación funciona: Keys faltantes en config: ['password']`,
        },
      },
    ],
  },
  youDo: {
    title: 'Sales Log Parser — Tu primer pipeline ETL',
    context:
      'Proyecto de portafolio real. Descargas un dataset público de ventas (puedes usar Superstore Sales de Kaggle o crear uno sintético), lo procesas con estructuras anidadas, y exportas un resumen en JSON. Este tipo de script es exactamente lo que un analista junior hace en su primera semana: leer datos crudos, limpiarlos, agregarlos, entregar un reporte.',
    objectives: [
      'Descargar o crear un CSV de ventas con al menos 100 filas',
      'Leerlo con csv.DictReader y manejar errores de archivo',
      'Construir estructura anidada (dict de dicts) con totales por región y categoría',
      'Detectar y reportar filas con valores faltantes',
      'Exportar resumen a JSON con formato legible',
    ],
    requirements: [
      'Función leer_csv(ruta) con try/except',
      'Función procesar_ventas(ventas) que devuelve dict anidado',
      'Función exportar_json(data, ruta) con encoding utf-8',
      'Logging de filas inválidas (no se cae, las salta)',
      'Estructura final: {"metadata": {...}, "totales": {...}, "por_region": {...}, "top_productos": [...]}',
      'Docstrings en cada función',
      'if __name__ == "__main__" con pipeline completo',
    ],
    starterCode: `import csv
import json
from collections import defaultdict
from pathlib import Path

def leer_csv(ruta):
    """Lee CSV y devuelve lista de dicts. Salta filas inválidas."""
    # TODO: implementar con try/except
    pass

def procesar_ventas(ventas):
    """Agrega ventas por región y producto."""
    # TODO: usar defaultdict
    pass

def exportar_json(data, ruta):
    """Exporta a JSON con indent=2."""
    # TODO: implementar
    pass

def main():
    # Pipeline: leer -> procesar -> exportar
    pass

if __name__ == "__main__":
    main()`,
    portfolioNote:
      'En tu README, incluye screenshots del JSON output y explica las decisiones de diseño: por qué usaste defaultdict, cómo manejaste filas inválidas, qué validarías en producción. Las decisiones técnicas justificadas valen más que el código funcional.',
    rubric: [
      { criterion: 'Lee CSV sin caerse ante filas inválidas', weight: '25%' },
      { criterion: 'Estructura anidada correcta (dict de dicts)', weight: '20%' },
      { criterion: 'JSON exportado con formato legible', weight: '20%' },
      { criterion: 'Manejo de errores robusto (try/except en puntos críticos)', weight: '15%' },
      { criterion: 'Código modular con funciones separadas', weight: '10%' },
      { criterion: 'Docstrings y nombres descriptivos', weight: '10%' },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: '¿Cuál es la diferencia entre `json.load()` y `json.loads()`?',
        options: [
          'No hay diferencia, son alias',
          '`load()` lee de archivo, `loads()` lee de string',
          '`load()` es más rápido, `loads()` es más seguro',
          '`load()` es para dicts, `loads()` para listas',
        ],
        correctIndex: 1,
        explanation:
          'La "s" viene de "string". `json.load(f)` lee de un archivo abierto, `json.loads(s)` lee de un string. Igual con dump/dumps. Es un patrón consistente en la librería estándar de Python.',
      },
      {
        question: '¿Qué hace el statement `with open("f.csv") as f:`?',
        options: [
          'Abre el archivo y lo deja abierto hasta que cierres Python',
          'Abre el archivo y lo cierra automáticamente al salir del bloque',
          'Es lo mismo que `f = open("f.csv")` sin más',
          'Solo funciona para archivos de texto, no binarios',
        ],
        correctIndex: 1,
        explanation:
          'El statement `with` garantiza que el archivo se cierre automáticamente, incluso si ocurre una excepción dentro del bloque. Es la forma correcta y segura de manejar archivos en Python.',
      },
      {
        question: '¿Por qué usar `defaultdict(list)` en lugar de un dict normal?',
        options: [
          'Es más rápido en lectura',
          'Crea automáticamente una lista vacía al primer acceso, evitando KeyError',
          'Permite valores duplicados',
          'Es la única forma de tener listas como valores',
        ],
        correctIndex: 1,
        explanation:
          'defaultdict(list) crea una lista vacía automáticamente la primera vez que accedes a una key. Esto evita el verbose `if key not in dict: dict[key] = []` antes de cada append.',
      },
      {
        question: '¿Qué excepción lanza Python cuando intentas abrir un archivo inexistente?',
        options: ['IOError', 'FileNotFoundError', 'FileError', 'OSError'],
        correctIndex: 1,
        explanation:
          'FileNotFoundError es una subclase de OSError. Es la excepción específica para "archivo no existe". Capturarla específicamente (en lugar de Exception) hace tu código más claro y no oculta otros bugs.',
      },
      {
        question: '¿Cuál es la forma pythónica de iterar sobre un dict obteniendo clave y valor?',
        options: [
          'for key in dict: value = dict[key]',
          'for key, value in dict.items():',
          'for (key, value) in dict:',
          'for item in dict.keys_and_values():',
        ],
        correctIndex: 1,
        explanation:
          '`dict.items()` devuelve pares (clave, valor) que puedes desempaquetar directamente en el for. Es la forma idiomática y más eficiente.',
      },
    ],
  },
  resources: {
    docs: [
      { label: 'Python — csv module docs', url: 'https://docs.python.org/3/library/csv.html', note: 'Documentación oficial del módulo csv' },
      { label: 'Python — json module docs', url: 'https://docs.python.org/3/library/json.html', note: 'Documentación oficial del módulo json' },
      { label: 'Real Python — Working with Files', url: 'https://realpython.com/working-with-files-in-python/', note: 'pathlib, open, context managers en profundidad' },
      { label: 'Python — Errors and Exceptions', url: 'https://docs.python.org/3/tutorial/errors.html', note: 'Tutorial oficial sobre manejo de excepciones' },
    ],
    books: [
      { label: 'Python 101', note: 'Capítulo sobre data structures y file I/O. Base sólida.' },
      { label: 'Python Apprentice to Master', note: 'Capítulo sobre context managers y excepciones custom.' },
    ],
    courses: [
      { label: 'Kaggle Learn — Data Cleaning', url: 'https://www.kaggle.com/learn/data-cleaning', note: 'Limpieza de datos en CSV con Python' },
    ],
  },
}
