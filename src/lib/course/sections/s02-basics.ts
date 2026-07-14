import type { CourseSection } from '../../types'

export const section02: CourseSection = {
  id: 'basics',
  index: 2,
  title: 'Python Absolute Basics',
  shortTitle: 'Basics de Python',
  tagline: 'Los 6 conceptos que cubren el 80% del Python que vas a escribir',
  estimatedHours: 8,
  level: 'Principiante',
  phase: 0,
  icon: 'Code2',
  accentColor: 'bg-gradient-to-br from-sky-500 to-cyan-600',
  jobRelevance:
    'Estos 6 conceptos (variables, tipos, condicionales, loops, funciones, comprehensions) son el 80% del código que vas a escribir como Data Analyst. Cuando limpias un dataset en pandas, usas condicionales para filtrar. Cuando iteras sobre columnas, usas loops. Cuando defines transformaciones, usas funciones. Si dominas esto, el resto del curso es aplicar los mismos conceptos con librerías más grandes.',
  learningOutcomes: [
    { text: 'Declarar variables y entender los tipos básicos: int, float, str, bool, list, dict, tuple, set' },
    { text: 'Convertir entre tipos con int(), str(), float(), bool()' },
    { text: 'Escribir condicionales if/elif/else con operadores lógicos and, or, not' },
    { text: 'Usar loops for y while con break, continue, range() y enumerate()' },
    { text: 'Definir funciones con def, parámetros por defecto, *args y **kwargs' },
    { text: 'Escribir list comprehensions y dict comprehensions' },
  ],
  theory: [
    {
      heading: 'Variables y tipos de datos — la base de todo',
      paragraphs: [
        'En Python, una variable es una etiqueta que apunta a un valor en memoria. No necesitas declarar el tipo — Python lo infiere. `x = 42` crea una variable entera. `x = "hola"` la reemplaza por un string. Esta flexibilidad es poderosa pero peligrosa: si reutilizas nombres de variables sin cuidado, puedes introducir bugs difíciles de rastrear. La convención profesional es usar `snake_case` para variables y funciones, `UPPER_CASE` para constantes, y `PascalCase` para clases.',
        'Los tipos básicos que necesitas conocer al dedillo son: `int` (enteros: 1, 42, -7), `float` (decimales: 3.14, -0.001), `str` (cadenas de texto: "hola", \'mundo\'), `bool` (True/False). Luego tienes los contenedores: `list` (lista ordenada mutable: [1, 2, 3]), `dict` (pares clave-valor: {"nombre": "Ana", "edad": 25}), `tuple` (lista inmutable: (1, 2, 3)), y `set` (conjunto sin duplicados: {1, 2, 3}). En data science, el 90% del tiempo trabajas con list, dict y str.',
        'Para saber el tipo de una variable, usa `type(x)`. Para verificar si es de un tipo específico, usa `isinstance(x, int)`. Estos dos métodos son fundamentales cuando depuras código — muchas veces un error "TypeError: unsupported operand" se debe a que estás mezclando un string con un int sin darte cuenta.',
      ],
      code: {
        language: 'python',
        title: 'tipos.py',
        code: `# Variables y tipos básicos
edad = 25                  # int
altura = 1.75              # float
nombre = "Carlos"          # str
es_alumno = True           # bool

# Contenedores
notas = [18, 15, 20, 17]              # list
persona = {"nombre": "Ana", "edad": 30}  # dict
coordenadas = (12.5, -77.0)           # tuple
unicos = {1, 2, 3, 2, 1}              # set -> {1, 2, 3}

# Verificar tipos
print(type(edad))           # <class 'int'>
print(type(nombre))         # <class 'str'>
print(isinstance(edad, int))  # True

# Conversión de tipos (casting)
numero_str = "42"
numero_int = int(numero_str)    # 42 (int)
numero_float = float(numero_str) # 42.0 (float)
texto = str(42)                 # "42" (str)
booleano = bool(0)              # False (0 es falsy)

# f-strings — la forma pythónica de formatear texto
promedio = sum(notas) / len(notas)
print(f"Hola {nombre}, tu promedio es {promedio:.2f}")
# "Hola Carlos, tu promedio es 17.50"`,
        output: `<class 'int'>
<class 'str'>
True
Hola Carlos, tu promedio es 17.50`,
      },
    },
    {
      heading: 'Condicionales — tomando decisiones en el código',
      paragraphs: [
        'Los condicionales permiten que tu programa tome caminos distintos según el valor de las variables. La sintaxis es `if`, `elif` (else if), `else`. La indentación (4 espacios, no tabs) define qué código pertenece a cada bloque. Python usa indentación en lugar de llaves como JavaScript o Java — esto fuerza código legible pero significa que un espacio mal puesto rompe todo.',
        'Los operadores de comparación son: `==` (igual), `!=` (diferente), `<`, `>`, `<=`, `>=`. Los operadores lógicos son `and`, `or`, `not` — atención, NO son `&&`, `||`, `!` como en otros lenguajes. Una trampa común: `=` es asignación, `==` es comparación. Si escribes `if x = 5:` te dará error de sintaxis.',
        'Python tiene "truthiness": ciertos valores se evalúan como False aunque no sean el booleano False. Estos son: `0`, `0.0`, `""` (string vacío), `[]` (lista vacía), `{}` (dict vacío), `None`. Todo lo demás es True. Esto te permite escribir código más limpio: `if usuarios:` en lugar de `if len(usuarios) > 0:`.',
      ],
      code: {
        language: 'python',
        title: 'condicionales.py',
        code: `# Sistema de becas universitarias
nota = 17
ingreso_familiar = 2500  # soles peruanos mensuales
es_de_provincia = True

if nota >= 16 and ingreso_familiar < 3000:
    print("Beca completa aprobada")
    if es_de_provincia:
        print("Adicionalmente: bono de vivienda S/500")
elif nota >= 14 and ingreso_familiar < 4000:
    print("Media beca aprobada")
elif nota >= 11:
    print("Sin beca, pero puedes postular a crédito educativo")
else:
    print("Necesitas mejorar tu promedio")

# Truthiness en acción
usuarios = []
if not usuarios:  # más limpio que if len(usuarios) == 0
    print("No hay usuarios registrados")

# Operador ternario (una línea)
estado = "aprobado" if nota >= 11 else "desaprobado"
print(f"Estado: {estado}")`,
        output: `Beca completa aprobada
Adicionalmente: bono de vivienda S/500
No hay usuarios registrados
Estado: aprobado`,
      },
    },
    {
      heading: 'Loops — repitiendo acciones',
      paragraphs: [
        'Existen dos tipos: `for` (iterar sobre una secuencia conocida) y `while` (repetir mientras se cumpla una condición). El `for` es el más usado en Python porque itera directamente sobre elementos, no sobre índices. `for nota in notas:` es más limpio y pythónico que `for i in range(len(notas)): print(notas[i])`.',
        'Para contar índices mientras iteras, usa `enumerate()` que devuelve pares (índice, valor). Para iterar sobre dos listas en paralelo, usa `zip()`. Estas dos funciones son el 90% de lo que necesitas para loops profesionales en Python.',
        'Las declaraciones `break` (salir del loop) y `continue` (saltar a la siguiente iteración) te dan control adicional. Úsalas con moderación — un loop con muchos breaks y continues es difícil de leer. Si necesitas lógica compleja, considera extraer una función.',
      ],
      code: {
        language: 'python',
        title: 'loops.py',
        code: `# For básico
notas = [18, 15, 20, 17, 12]
for nota in notas:
    print(f"Nota: {nota}")

# enumerate para índices
for i, nota in enumerate(notas):
    print(f"Alumno {i+1}: {nota}")

# zip para iterar en paralelo
nombres = ["Ana", "Luis", "Carlos"]
edades = [20, 22, 19]
for nombre, edad in zip(nombres, edades):
    print(f"{nombre} tiene {edad} años")

# range para secuencias numéricas
for i in range(5):       # 0, 1, 2, 3, 4
    print(i)
for i in range(2, 10, 2):  # 2, 4, 6, 8 (start, stop, step)
    print(i)

# while con condición
intentos = 0
while intentos < 3:
    print(f"Intento {intentos + 1}")
    intentos += 1

# break y continue
for i in range(10):
    if i == 5:
        break  # sale del loop
    if i % 2 == 0:
        continue  # salta los pares
    print(f"Impar: {i}")`,
        output: `Impar: 1
Impar: 3`,
      },
    },
    {
      heading: 'Funciones — bloques reutilizables de código',
      paragraphs: [
        'Una función es un bloque de código con nombre que recibe parámetros, ejecuta lógica y opcionalmente retorna un valor. Se definen con `def` y se llaman con paréntesis. La regla de oro: **si usas el mismo bloque de código 3+ veces, conviértelo en función**. Las funciones también documentan tu intención — un nombre como `calcular_promedio_ponderado()` es más legible que las 5 líneas de código que contiene.',
        'Python soporta parámetros por defecto (`def f(x, y=10):`), argumentos posicionales variables (`*args` que junta todos los argumentos en una tupla), y argumentos keyword variables (`**kwargs` que los junta en un dict). Esta flexibilidad te permite diseñar APIs limpias. Por ejemplo, `print()` usa `*args` para aceptar cualquier número de argumentos y `**kwargs` para opciones como `sep` y `end`.',
        'Las funciones SIEMPRE deben tener un `docstring` — la primera línea entre triples comillas que explica qué hace. Herramientas como VS Code muestran este docstring cuando pasas el mouse. Sin docstring, tu código es opaco para tus colegas. La convención estándar es seguir el formato Google o NumPy.',
      ],
      code: {
        language: 'python',
        title: 'funciones.py',
        code: `def calcular_promedio_ponderado(notas, pesos):
    """
    Calcula el promedio ponderado de una lista de notas.

    Args:
        notas: lista de calificaciones numéricas
        pesos: lista de pesos (deben sumar 1.0)

    Returns:
        float: promedio ponderado
    """
    if len(notas) != len(pesos):
        raise ValueError("notas y pesos deben tener la misma longitud")
    total = sum(n * p for n, p in zip(notas, pesos))
    return total

# Función con parámetros por defecto
def saludar(nombre, saludo="Hola", emoji="😊"):
    return f"{saludo}, {nombre}! {emoji}"

print(saludar("Ana"))                    # Hola, Ana! 😊
print(saludar("Luis", "Buenos días"))    # Buenos días, Luis! 😊
print(saludar("Carlos", emoji="🚀"))     # Hola, Carlos! 🚀

# *args: argumentos posicionales variables
def sumar_todos(*numeros):
    return sum(numeros)
print(sumar_todos(1, 2, 3, 4, 5))  # 15

# **kwargs: argumentos keyword variables
def mostrar_config(**opciones):
    for clave, valor in opciones.items():
        print(f"  {clave}: {valor}")
mostrar_config(host="localhost", puerto=5432, debug=True)`,
        output: `Hola, Ana! 😊
Hola, Carlos! 🚀
15
  host: localhost
  puerto: 5432
  debug: True`,
      },
    },
    {
      heading: 'List comprehensions — la forma pythónica de transformar listas',
      paragraphs: [
        'Una list comprehension es una sintaxis compacta para crear listas a partir de otras listas. En lugar de escribir un loop for de 4 líneas, escribes una sola línea que es más legible (una vez que te acostumbras) y más rápida. La sintaxis básica es `[expresion for item in iterable if condicion]`.',
        'En data science, las comprehensions son ubicuas. Limpieza de strings, transformación de columnas, filtrado de datos — todo se hace con comprehensions. Pero cuidado: si tu comprehension tiene más de una línea o anida múltiples fors, probablemente sea mejor un loop tradicional. La legibilidad siempre gana.',
        'Existen también dict comprehensions (`{k: v for k, v in ...}`) y set comprehensions (`{x for x in ...}`). La misma sintaxis, diferentes contenedores.',
      ],
      code: {
        language: 'python',
        title: 'comprehensions.py',
        code: `# Lista tradicional
notas = [18, 15, 20, 17, 12, 19, 11]

# Forma tradicional
aprobados_tradicional = []
for nota in notas:
    if nota >= 14:
        aprobados_tradicional.append(nota)

# Con list comprehension (más limpio)
aprobados = [nota for nota in notas if nota >= 14]
# [18, 15, 20, 17, 19]

# Con transformación
notas_al_cuadrado = [n**2 for n in notas]
# [324, 225, 400, 289, 144, 361, 121]

# Con condicional en la expresión
estados = ["aprobado" if n >= 14 else "desaprobado" for n in notas]
# ['aprobado', 'aprobado', 'aprobado', 'aprobado', 'desaprobado', 'aprobado', 'desaprobado']

# Dict comprehension
nombres = ["Ana", "Luis", "Carlos"]
edades = [20, 22, 19]
personas = {nombre: edad for nombre, edad in zip(nombres, edades)}
# {'Ana': 20, 'Luis': 22, 'Carlos': 19}

# Set comprehension (elimina duplicados)
numeros = [1, 2, 2, 3, 3, 3, 4]
unicos = {n for n in numeros}
# {1, 2, 3, 4}

# Anidado (cuidado, puede ser ilegible)
matriz = [[i*j for j in range(3)] for i in range(3)]
# [[0, 0, 0], [0, 1, 2], [0, 2, 4]]`,
        output: `[18, 15, 20, 17, 19]
[324, 225, 400, 289, 144, 361, 121]
['aprobado', 'aprobado', 'aprobado', 'aprobado', 'desaprobado', 'aprobado', 'desaprobado']`,
      },
      callout: {
        type: 'tip',
        title: 'Cuándo usar comprehension vs loop for',
        content:
          'Usa comprehension cuando: (1) es una sola línea legible, (2) solo estás transformando o filtrando, (3) no necesitas lógica compleja. Usa loop for cuando: (1) necesitas múltiples statements, (2) hay side effects (print, escribir archivo), (3) la lógica tiene más de 2-3 condiciones. La regla: si te queda ilegible, es loop.',
      },
    },
  ],
  iDo: {
    intro:
      'Voy a construir contigo un mini-programa real: un calculador de notas universitarias que usa los 6 conceptos que acabamos de ver. Fíjate cómo cada concepto se integra naturalmente — en la vida real, nunca usas uno aislado, siempre combinados.',
    steps: [
      {
        description: 'Modelar las notas de un alumno con tipos y estructuras',
        code: {
          language: 'python',
          title: 'notas_universitarias.py',
          code: `# Modelamos un semestre universitario
alumno = {
    "nombre": "Maria Quispe",
    "codigo": "20241034",
    "cursos": [
        {"nombre": "Estadistica", "notas": [15, 17, 18], "creditos": 4},
        {"nombre": "Programacion", "notas": [20, 19, 18], "creditos": 3},
        {"nombre": "Algebra", "notas": [12, 14, 13], "creditos": 5},
    ]
}

# Tipo: dict con lista de dicts anidados
# Cada curso tiene nombre (str), notas (list[int]), creditos (int)
print(f"Alumna: {alumno['nombre']}")
print(f"Cursos matriculados: {len(alumno['cursos'])}")`,
          output: `Alumna: Maria Quispe
Cursos matriculados: 3`,
        },
        why: 'Modelar datos con tipos correctos desde el inicio evita bugs. Al usar una lista de dicts para cursos, puedes iterar con un for limpio. Si hubieras usado tres listas paralelas (nombres, notas, creditos), sería más propenso a errores de sincronización.',
      },
      {
        description: 'Calcular promedios con funciones y comprehensions',
        code: {
          language: 'python',
          title: 'notas_universitarias.py',
          code: `def promedio_simple(notas):
    """Calcula el promedio simple de una lista de notas."""
    return sum(notas) / len(notas) if notas else 0

def promedio_ponderado(cursos):
    """
    Calcula el promedio ponderado por créditos.
    Args:
        cursos: lista de dicts con 'notas' y 'creditos'
    Returns:
        float: promedio ponderado
    """
    total_puntos = 0
    total_creditos = 0
    for curso in cursos:
        promedio_curso = promedio_simple(curso["notas"])
        total_puntos += promedio_curso * curso["creditos"]
        total_creditos += curso["creditos"]
    return total_puntos / total_creditos if total_creditos else 0

# Aplicar funciones
promedio_general = promedio_ponderado(alumno["cursos"])

# List comprehension para extraer promedios por curso
promedios_por_curso = {
    curso["nombre"]: promedio_simple(curso["notas"])
    for curso in alumno["cursos"]
}

print(f"Promedio ponderado general: {promedio_general:.2f}")
for curso, promedio in promedios_por_curso.items():
    estado = "aprobado" if promedio >= 14 else "desaprobado"
    print(f"  {curso}: {promedio:.1f} ({estado})")`,
          output: `Promedio ponderado general: 15.30
  Estadistica: 16.7 (aprobado)
  Programacion: 19.0 (aprobado)
  Algebra: 13.0 (desaprobado)`,
        },
        why: 'Separamos la lógica en dos funciones para reutilizar. `promedio_simple` sirve para un curso, `promedio_ponderado` combina varios. Esta separación te permite testear cada función independientemente y mantener el código limpio.',
      },
      {
        description: 'Agregar condicionales para clasificar y reportar',
        code: {
          language: 'python',
          title: 'notas_universitarias.py',
          code: `def clasificar_alumno(promedio):
    """Clasifica al alumno según su promedio ponderado."""
    if promedio >= 17:
        return "Excelente", "Beca completa"
    elif promedio >= 14:
        return "Aprobado", "Sin beca"
    elif promedio >= 11:
        return "Aprobado", "Crédito educativo"
    else:
        return "Desaprobado", "Repite ciclo"

# Generar reporte completo
def generar_reporte(alumno):
    """Genera un reporte completo del alumno."""
    promedio = promedio_ponderado(alumno["cursos"])
    categoria, beneficio = clasificar_alumno(promedio)

    reporte = f"\\n{'='*40}\\n"
    reporte += f"REPORTE ACADÉMICO\\n{'='*40}\\n"
    reporte += f"Alumna/o: {alumno['nombre']}\\n"
    reporte += f"Código: {alumno['codigo']}\\n"
    reporte += f"Promedio ponderado: {promedio:.2f}\\n"
    reporte += f"Categoría: {categoria}\\n"
    reporte += f"Beneficio: {beneficio}\\n"
    reporte += f"{'='*40}\\n"
    reporte += "Detalle por curso:\\n"

    for curso in alumno["cursos"]:
        prom = promedio_simple(curso["notas"])
        estado = "✓" if prom >= 14 else "✗"
        reporte += f"  {estado} {curso['nombre']}: {prom:.1f}\\n"

    return reporte

print(generar_reporte(alumno))`,
          output: `========================================
REPORTE ACADÉMICO
========================================
Alumna/o: Maria Quispe
Código: 20241034
Promedio ponderado: 15.30
Categoría: Aprobado
Beneficio: Sin beca
========================================
Detalle por curso:
  ✓ Estadistica: 16.7
  ✓ Programacion: 19.0
  ✗ Algebra: 13.0`,
        },
        why: 'Las funciones `clasificar_alumno` y `generar_reporte` separan la lógica de negocio del output. Si mañana decides exportar a PDF o HTML, solo cambias `generar_reporte` — la clasificación queda intacta. Esta separación de responsabilidades (Single Responsibility Principle) es clave en código profesional.',
      },
    ],
  },
  weDo: {
    intro:
      'Ahora practicamos juntos con un problema real: un calculador de propinas para restaurantes peruanos. La idea es que tú escribas el código a partir del starter, y solo mires la solución si te trabas. Recuerda: la magia ocurre cuando escribes el código tú mismo.',
    steps: [
      {
        instruction: 'Crea una función que calcule la propina sugerida (10%, 12% o 15%) según el monto de la cuenta',
        hint: 'Usa condicionales para seleccionar el porcentaje. Si la cuenta es < S/50, sugiere 10%. Entre 50-150, 12%. Más de 150, 15%.',
        starterCode: {
          language: 'python',
          title: 'propinas.py',
          code: `def calcular_propina(cuenta):
    """
    Calcula la propina sugerida según el monto.

    Args:
        cuenta: monto de la cuenta en soles (float)

    Returns:
        tuple: (porcentaje, monto_propina, total_a_pagar)
    """
    # Tu código aquí
    pass

# Prueba:
print(calcular_propina(45))    # debería sugerir 10%
print(calcular_propina(80))    # debería sugerir 12%
print(calcular_propina(200))   # debería sugerir 15%`,
        },
        solutionCode: {
          language: 'python',
          title: 'propinas.py',
          code: `def calcular_propina(cuenta):
    """
    Calcula la propina sugerida según el monto.

    Args:
        cuenta: monto de la cuenta en soles (float)

    Returns:
        tuple: (porcentaje, monto_propina, total_a_pagar)
    """
    if cuenta < 50:
        porcentaje = 0.10
    elif cuenta <= 150:
        porcentaje = 0.12
    else:
        porcentaje = 0.15

    monto_propina = cuenta * porcentaje
    total = cuenta + monto_propina
    return (porcentaje * 100, monto_propina, total)

# Pruebas
for cuenta in [45, 80, 200]:
    pct, propina, total = calcular_propina(cuenta)
    print(f"Cuenta: S/{cuenta} -> Propina {pct:.0f}% = S/{propina:.2f}, Total: S/{total:.2f}")`,
          output: `Cuenta: S/45 -> Propina 10% = S/4.50, Total: S/49.50
Cuenta: S/80 -> Propina 12% = S/9.60, Total: S/89.60
Cuenta: S/200 -> Propina 15% = S/30.00, Total: S/230.00`,
        },
      },
      {
        instruction: 'Extiende el programa para dividir la cuenta entre N personas',
        hint: 'Agrega un parámetro `personas` con valor por defecto 1. Divide el total entre personas. Usa f-strings para formatear el resultado.',
        starterCode: {
          language: 'python',
          title: 'propinas.py',
          code: `def dividir_cuenta(cuenta, personas=1):
    """Divide la cuenta (incluyendo propina) entre N personas."""
    # Tu código aquí
    # Usa calcular_propina() del paso anterior
    pass

# Prueba:
print(dividir_cuenta(120, personas=4))  # 4 personas, S/120`,
        },
        solutionCode: {
          language: 'python',
          title: 'propinas.py',
          code: `def dividir_cuenta(cuenta, personas=1):
    """Divide la cuenta (incluyendo propina) entre N personas."""
    if personas <= 0:
        raise ValueError("El número de personas debe ser positivo")

    pct, propina, total = calcular_propina(cuenta)
    por_persona = total / personas

    return {
        "cuenta": cuenta,
        "propina_pct": pct,
        "propina_monto": propina,
        "total": total,
        "personas": personas,
        "por_persona": por_persona
    }

# Prueba
resultado = dividir_cuenta(120, personas=4)
print(f"Cuenta: S/{resultado['cuenta']}")
print(f"Propina ({resultado['propina_pct']:.0f}%): S/{resultado['propina_monto']:.2f}")
print(f"Total: S/{resultado['total']:.2f}")
print(f"Entre {resultado['personas']} personas: S/{resultado['por_persona']:.2f} c/u")`,
          output: `Cuenta: S/120
Propina (12%): S/14.40
Total: S/134.40
Entre 4 personas: S/33.60 c/u`,
        },
      },
    ],
  },
  youDo: {
    title: 'Personal Budget Calculator — Tu primer programa real',
    context:
      'Tu primer programa completo para portafolio. Un calculador de presupuesto personal que pide al usuario sus ingresos y gastos, calcula saldo, ahorro, y warning si gasta más del 80%. Es exactamente el tipo de script que un junior escribiría en una empresa para automatizar un reporte financiero. Súbelo a tu repo python-ds-journey.',
    objectives: [
      'Pedir al usuario ingresos mensuales y 5 categorías de gasto con input()',
      'Almacenar los gastos en un diccionario',
      'Calcular total de gastos, saldo restante y porcentaje de ahorro',
      'Mostrar warning si los gastos superan 80% de los ingresos',
      'Imprimir reporte formateado con f-strings',
    ],
    requirements: [
      'Usar input() para capturar datos del usuario',
      'Usar un loop for para preguntar 5 categorías',
      'Almacenar en dict con categorías como keys',
      'Calcular: total_gastos, saldo, pct_ahorro',
      'Condicional if para warning (>80% gastos)',
      'Función main() + if __name__ == "__main__"',
      'Docstrings en cada función',
    ],
    starterCode: `def pedir_datos():
    """Pide al usuario sus ingresos y gastos."""
    # Tu código aquí
    pass

def calcular_presupuesto(ingresos, gastos):
    """Calcula totales y porcentajes."""
    # Tu código aquí
    pass

def mostrar_reporte(ingresos, gastos, calculos):
    """Muestra el reporte formateado."""
    # Tu código aquí
    pass

def main():
    """Función principal."""
    # Tu código aquí
    pass

if __name__ == "__main__":
    main()`,
    portfolioNote:
      'Este programa demuestra que dominas los 6 conceptos fundamentales de Python. En una entrevista técnica, te pueden pedir extenderlo: "agrega categoría de ahorro automático del 10%", "permite múltiples meses", "exporta a CSV". Si los fundamentals los dominas, esas extensiones son triviales.',
    rubric: [
      { criterion: 'Funciona correctamente con inputs válidos', weight: '30%' },
      { criterion: 'Usa los 6 conceptos (variables, tipos, condicionales, loops, funciones, comprehensions)', weight: '20%' },
      { criterion: 'Código limpio con funciones y docstrings', weight: '20%' },
      { criterion: 'Maneja inputs inválidos (no se cae con texto en vez de número)', weight: '15%' },
      { criterion: 'Reporte claro y formateado con f-strings', weight: '15%' },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: '¿Cuál es la diferencia entre `=` y `==` en Python?',
        options: [
          'Son lo mismo, se usan indistintamente',
          '`=` es asignación, `==` es comparación de igualdad',
          '`=` es comparación, `==` es asignación',
          '`==` solo funciona con números, `=` con cualquier tipo',
        ],
        correctIndex: 1,
        explanation:
          '`x = 5` asigna el valor 5 a la variable x. `x == 5` compara si x es igual a 5 y devuelve True o False. Mezclarlos es uno de los errores más comunes de principiantes.',
      },
      {
        question: '¿Qué imprime `[x**2 for x in range(4) if x > 0]`?',
        options: ['[0, 1, 4, 9]', '[1, 4, 9]', '[1, 2, 3]', '[0, 1, 2, 3]'],
        correctIndex: 1,
        explanation:
          'range(4) genera [0,1,2,3]. El condicional `if x > 0` filtra el 0. Para los que pasan (1,2,3), calcula x**2 → [1, 4, 9].',
      },
      {
        question: '¿Qué valores se evalúan como False en Python (truthiness)?',
        options: [
          'Solo False y 0',
          'False, 0, 0.0, "", [], {}, None',
          'Solo False y None',
          'Cualquier cosa vacía, pero 0 es True',
        ],
        correctIndex: 1,
        explanation:
          `Python tiene "valores falsy": False, 0, 0.0, "", '', [], {}, set(), None. Todo lo demás es truthy. Esto permite escribir \`if lista:\` en vez de \`if len(lista) > 0:\`.`,
      },
      {
        question: '¿Qué hace `**kwargs` en una función?',
        options: [
          'Exige que pases argumentos como keywords',
          'Junta todos los argumentos keyword adicionales en un dict',
          'Es lo mismo que *args pero para strings',
          'Define argumentos opcionales con valor por defecto',
        ],
        correctIndex: 1,
        explanation:
          '`**kwargs` recoge cualquier argumento `nombre=valor` que pases a la función y los junta en un diccionario. Útil para funciones configurables como `mostrar_config(host="localhost", puerto=5432)`.',
      },
      {
        question: '¿Cuál es la forma pythónica de iterar con índices sobre una lista?',
        options: [
          'for i in range(len(lista)): print(lista[i])',
          'for i, item in enumerate(lista): print(i, item)',
          'for item in lista: print(lista.indexOf(item))',
          'for i = 0; i < lista.length; i++',
        ],
        correctIndex: 1,
        explanation:
          '`enumerate()` devuelve pares (índice, valor) y es la forma idiomática en Python. Es más legible y más rápido que indexar manualmente con range(len()).',
      },
    ],
  },
  resources: {
    docs: [
      { label: 'Python — Tutorial oficial', url: 'https://docs.python.org/3/tutorial/', note: 'Capítulos 3-5 cubren basics, control flow, data structures' },
      { label: 'Real Python — Lists and Tuples', url: 'https://realpython.com/python-lists-tuples/', note: 'Profundidad editorial sobre listas y tuplas' },
      { label: 'PEP 8 — Style Guide', url: 'https://peps.python.org/pep-0008/', note: 'Convenciones de estilo que todo Python dev debe conocer' },
      { label: 'Python Tutor', url: 'https://pythontutor.com/', note: 'Visualiza la ejecución de tu código paso a paso' },
    ],
    books: [
      { label: 'Python 101', note: 'Capítulos 2-4: tipos, operadores, control de flujo. Base sólida.' },
      { label: 'Python Apprentice to Master', note: 'Capítulo sobre funciones y scope. Profundiza *args/**kwargs.' },
    ],
    courses: [
      { label: 'CS50P — Lecture 1-3', url: 'https://cs50.harvard.edu/python/', note: 'Basics con David Malan, muy didáctico' },
      { label: 'Kaggle Learn — Python', url: 'https://www.kaggle.com/learn/python', note: 'Micro-curso gratuito con ejercicios' },
    ],
  },
}
