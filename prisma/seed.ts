/**
 * Seed script for QuestionBank — generates 3 variants per concept for each section.
 * Uses the existing selfCheck questions as variant 1, and creates 2 additional variants.
 *
 * Run: bun run db:seed
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Type for a question variant
type Q = {
  concept: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

// 3 variants per concept for each of the 10 sections
// Variant 1 = existing question; variants 2 & 3 = equivalent questions testing same concept
const QUESTION_BANK: Record<string, Q[]> = {
  setup: [
    {
      concept: 'venv-purpose',
      question: '¿Para qué sirve un entorno virtual (venv) en Python?',
      options: [
        'Para acelerar la ejecución del código Python',
        'Para aislar las dependencias (paquetes) por proyecto y evitar conflictos de versiones',
        'Para conectarse a internet más rápido al instalar paquetes',
        'Para compilar Python a código de máquina más eficiente',
      ],
      correctIndex: 1,
      explanation: 'venv crea una carpeta con su propia instalación de Python y paquetes, evitando conflictos entre proyectos.',
    },
    {
      concept: 'venv-purpose',
      question: '¿Cuál es el beneficio principal de usar venv al trabajar en múltiples proyectos Python?',
      options: [
        'Los programas corren más rápido',
        'Cada proyecto tiene sus propias versiones de paquetes sin interferir con otros',
        'Permite usar Python sin instalarlo',
        'Reduce el tamaño de los archivos .py',
      ],
      correctIndex: 1,
      explanation: 'Sin venv, actualizar pandas en un proyecto podría romper otro. venv aísla dependencias por proyecto.',
    },
    {
      concept: 'venv-purpose',
      question: 'Si un colega dice "a mí me funciona" pero a ti no, ¿cuál es la causa más probable?',
      options: [
        'Diferentes versiones de paquetes en cada entorno',
        'Tu computadora es más lenta',
        'Python no es compatible con tu OS',
        'Falta de memoria RAM',
      ],
      correctIndex: 0,
      explanation: 'Sin aislamiento de entorno, las versiones de paquetes difieren y causan el clásico "works on my machine".',
    },
    {
      concept: 'gitignore',
      question: '¿Cuál de los siguientes archivos SÍ debería estar en tu .gitignore?',
      options: ['requirements.txt', 'README.md', 'venv/', 'hello.py'],
      correctIndex: 2,
      explanation: 'venv/ pesa 100MB+ y se puede regenerar con pip install -r requirements.txt.',
    },
    {
      concept: 'gitignore',
      question: '¿Por qué .env NO debe subirse a GitHub?',
      options: [
        'Porque pesa demasiado',
        'Porque contiene credenciales y secretos',
        'Porque GitHub no lo soporta',
        'Porque ralentiza el git push',
      ],
      correctIndex: 1,
      explanation: 'Los archivos .env guardan variables de entorno con API keys, passwords y tokens. Subirlos es un riesgo de seguridad.',
    },
    {
      concept: 'gitignore',
      question: '¿Qué carpeta es crucial excluir del repositorio Git?',
      options: ['src/', 'tests/', 'venv/', 'docs/'],
      correctIndex: 2,
      explanation: 'venv/ contiene el entorno virtual que se regenera con requirements.txt. No debe versionarse.',
    },
    {
      concept: 'commit-message',
      question: '¿Cuál es un buen mensaje de commit siguiendo Conventional Commits?',
      options: ['"cambios"', '"wip"', '"feat: agregar cálculo de churn por segmento"', '"arreglé el bug"'],
      correctIndex: 2,
      explanation: 'Conventional Commits usa prefijos feat:, fix:, docs: seguidos de descripción imperativa.',
    },
    {
      concept: 'commit-message',
      question: '¿Qué prefijo usarías para un commit que arregla un bug?',
      options: ['feat:', 'fix:', 'chore:', 'docs:'],
      correctIndex: 1,
      explanation: 'fix: se usa para correcciones de bugs. feat: para nuevas funcionalidades.',
    },
    {
      concept: 'commit-message',
      question: '¿Por qué evitar mensajes como "wip" o "cambios"?',
      options: [
        'Son muy cortos',
        'No dan contexto sobre qué cambió, dificultando revisar el historial',
        'GitHub no los acepta',
        'Ralentizan el push',
      ],
      correctIndex: 1,
      explanation: 'El historial de commits es para comunicación humana. Mensajes descriptivos permiten entender qué cambió y por qué.',
    },
    {
      concept: 'pip-install',
      question: '¿Qué comando replica el entorno de otro desarrollador?',
      options: [
        'pip install pandas numpy',
        'python -m venv venv',
        'pip install -r requirements.txt',
        'git clone ...',
      ],
      correctIndex: 2,
      explanation: 'pip install -r requirements.txt lee las versiones pinneadas e instala exactamente eso.',
    },
    {
      concept: 'pip-install',
      question: '¿Para qué sirve `pip freeze > requirements.txt`?',
      options: [
        'Para congelar Python',
        'Para guardar las versiones exactas de los paquetes instalados',
        'Para borrar paquetes viejos',
        'Para actualizar pip',
      ],
      correctIndex: 1,
      explanation: 'pip freeze lista las versiones exactas instaladas. Guardarlas en requirements.txt permite reproducir el entorno.',
    },
    {
      concept: 'pip-install',
      question: '¿Cuál es la práctica correcta al instalar paquetes?',
      options: [
        'Instalar globalmente siempre',
        'Instalar dentro del venv activado y luego pip freeze',
        'Instalar sin venv para ahorrar espacio',
        'Solo usar paquetes de la librería estándar',
      ],
      correctIndex: 1,
      explanation: 'Siempre instala dentro del venv y luego documenta en requirements.txt para reproducibilidad.',
    },
  ],
  basics: [
    {
      concept: 'assign-vs-compare',
      question: '¿Cuál es la diferencia entre `=` y `==` en Python?',
      options: [
        'Son lo mismo',
        '`=` es asignación, `==` es comparación de igualdad',
        '`=` es comparación, `==` es asignación',
        '`==` solo funciona con números',
      ],
      correctIndex: 1,
      explanation: '`x = 5` asigna. `x == 5` compara y devuelve True/False.',
    },
    {
      concept: 'assign-vs-compare',
      question: '¿Qué pasa si escribes `if x = 5:` en Python?',
      options: [
        'Funciona correctamente',
        'Error de sintaxis porque = es asignación, no comparación',
        'Asigna 5 a x y entra al if',
        'Crea una variable nueva',
      ],
      correctIndex: 1,
      explanation: 'Python detecta que = es asignación y da SyntaxError. Debes usar == para comparar.',
    },
    {
      concept: 'assign-vs-compare',
      question: '¿Qué devuelve `5 == 5`?',
      options: ['5', 'True', '"igual"', 'None'],
      correctIndex: 1,
      explanation: '== compara valores y devuelve un booleano (True o False).',
    },
    {
      concept: 'list-comprehension',
      question: '¿Qué imprime `[x**2 for x in range(4) if x > 0]`?',
      options: ['[0, 1, 4, 9]', '[1, 4, 9]', '[1, 2, 3]', '[0, 1, 2, 3]'],
      correctIndex: 1,
      explanation: 'range(4) = [0,1,2,3]. Filtra x > 0 → [1,2,3]. Eleva al cuadrado → [1, 4, 9].',
    },
    {
      concept: 'list-comprehension',
      question: '¿Cuál es el equivalente en list comprehension de: `lst=[]; for x in range(5): lst.append(x*2)`?',
      options: ['[x*2 for x in range(5)]', '[for x in range(5): x*2]', 'list(x*2 range(5))', '{x*2 for x in range(5)}'],
      correctIndex: 0,
      explanation: 'La sintaxis es [expresion for item in iterable]. Aquí: [x*2 for x in range(5)] = [0,2,4,6,8].',
    },
    {
      concept: 'list-comprehension',
      question: '¿Qué produce `[x for x in "hola" if x in "aeiou"]`?',
      options: ['["h","o","l","a"]', '["o","a"]', '["h","l"]', 'Error'],
      correctIndex: 1,
      explanation: 'Filtra solo las vocales de "hola" → ["o", "a"].',
    },
    {
      concept: 'truthiness',
      question: '¿Qué valores se evalúan como False en Python?',
      options: [
        'Solo False y 0',
        'False, 0, 0.0, "", [], {}, None',
        'Solo False y None',
        'Cualquier cosa vacía, pero 0 es True',
      ],
      correctIndex: 1,
      explanation: 'Los valores falsy son: False, 0, 0.0, "", [], {}, set(), None. Todo lo demás es truthy.',
    },
    {
      concept: 'truthiness',
      question: '¿Qué devuelve `bool("")`?',
      options: ['True', 'False', 'Error', 'None'],
      correctIndex: 1,
      explanation: 'Un string vacío es falsy, por lo que bool("") devuelve False.',
    },
    {
      concept: 'truthiness',
      question: '¿Es lo mismo `if mi_lista:` que `if len(mi_lista) > 0:`?',
      options: [
        'Sí, ambas verifican que la lista no esté vacía',
        'No, la primera da error',
        'No, la primera verifica tipo',
        'Solo la segunda funciona',
      ],
      correctIndex: 0,
      explanation: 'Una lista vacía es falsy. Por eso `if mi_lista:` es True cuando la lista tiene elementos. Es la forma pythónica.',
    },
    {
      concept: 'kwargs',
      question: '¿Qué hace `**kwargs` en una función?',
      options: [
        'Exige argumentos keyword',
        'Junta todos los argumentos keyword adicionales en un dict',
        'Es lo mismo que *args',
        'Define argumentos opcionales',
      ],
      correctIndex: 1,
      explanation: '**kwargs recoge argumentos nombre=valor en un diccionario. Útil para funciones configurables.',
    },
    {
      concept: 'kwargs',
      question: 'Si llamas `f(a=1, b=2, c=3)` donde f es `def f(**kwargs)`, ¿qué es kwargs?',
      options: ['Una lista', 'Un dict {"a":1, "b":2, "c":3}', 'Una tupla', 'Un set'],
      correctIndex: 1,
      explanation: '**kwargs agrupa los argumentos keyword en un diccionario.',
    },
    {
      concept: 'kwargs',
      question: '¿Cuál es la firma correcta para aceptar args posicionales y keyword variables?',
      options: [
        'def f(*args, **kwargs):',
        'def f(args, kwargs):',
        'def f(**args, *kwargs):',
        'def f(*args*):',
      ],
      correctIndex: 0,
      explanation: 'El orden correcto es *args (posicionales) seguido de **kwargs (keyword).',
    },
  ],
  // Continue for other sections — using a condensed pattern
  'data-structures': [
    {
      concept: 'json-load-vs-loads',
      question: '¿Diferencia entre `json.load()` y `json.loads()`?',
      options: [
        'Son lo mismo',
        'load() lee de archivo, loads() lee de string',
        'load() es más rápido',
        'load() es para dicts',
      ],
      correctIndex: 1,
      explanation: 'La "s" = string. load(f) lee de archivo, loads(s) lee de string.',
    },
    {
      concept: 'json-load-vs-loads',
      question: '¿Cómo conviertes un string JSON a un dict de Python?',
      options: ['json.load(s)', 'json.loads(s)', 'json.parse(s)', 'dict(s)'],
      correctIndex: 1,
      explanation: 'json.loads() (load string) parsea un string JSON a objeto Python.',
    },
    {
      concept: 'json-load-vs-loads',
      question: 'Para guardar un dict como archivo JSON, ¿qué función usas?',
      options: ['json.dumps(d)', 'json.dump(d, f)', 'json.write(d, f)', 'json.save(d, f)'],
      correctIndex: 1,
      explanation: 'json.dump(obj, file) escribe a archivo. json.dumps(obj) devuelve string.',
    },
    {
      concept: 'with-statement',
      question: '¿Qué garantiza el statement `with open("f.csv") as f:`?',
      options: [
        'Abrir el archivo en modo lectura',
        'Cerrar el archivo automáticamente al salir del bloque, incluso si hay excepción',
        'Leer todo el contenido',
        'Crear el archivo si no existe',
      ],
      correctIndex: 1,
      explanation: 'with es un context manager que garantiza cleanup (cierre del archivo) sin importar qué pase.',
    },
    {
      concept: 'with-statement',
      question: '¿Por qué usar `with` en vez de `f = open(...)` + `f.close()`?',
      options: [
        'Es más rápido',
        'Garantiza cierre incluso si ocurre una excepción dentro del bloque',
        'Es la única forma de leer archivos',
        'Usa menos memoria',
      ],
      correctIndex: 1,
      explanation: 'Si ocurre una excepción entre open() y close(), el archivo queda abierto. with lo cierra siempre.',
    },
    {
      concept: 'with-statement',
      question: '¿Qué método del context manager se llama al SALIR del bloque with?',
      options: ['__enter__', '__exit__', '__close__', '__end__'],
      correctIndex: 1,
      explanation: '__enter__ se llama al entrar, __exit__ al salir (normalmente o por excepción).',
    },
    {
      concept: 'defaultdict',
      question: '¿Para qué sirve `defaultdict(list)`?',
      options: [
        'Es más rápido',
        'Crea una lista vacía automáticamente al primer acceso, evitando KeyError',
        'Permite duplicados',
        'Es la única forma de tener listas como valores',
      ],
      correctIndex: 1,
      explanation: 'defaultdict(list) crea una lista vacía al primer acceso a una key nueva. Evita el patrón if key not in dict.',
    },
    {
      concept: 'defaultdict',
      question: '¿Qué pasa con `d = defaultdict(int); d["x"] += 1` si "x" no existe?',
      options: [
        'KeyError',
        'Crea d["x"] = 0 y luego suma 1 → d["x"] = 1',
        'Crea d["x"] = 1',
        'Error de tipo',
      ],
      correctIndex: 1,
      explanation: 'defaultdict(int) inicializa con 0 (int() devuelve 0). Luego += 1 lo deja en 1.',
    },
    {
      concept: 'defaultdict',
      question: '¿Cuándo usar defaultdict vs dict normal?',
      options: [
        'Siempre defaultdict',
        'defaultdict para construir iterativamente (agrupar), dict para lectura',
        'Nunca defaultdict',
        'Solo para proyectos grandes',
      ],
      correctIndex: 1,
      explanation: 'defaultdict es ideal para construir estructuras (acumular, agrupar). dict.get() es mejor para lectura puntual.',
    },
    {
      concept: 'exception-type',
      question: '¿Qué excepción lanza Python al abrir un archivo inexistente?',
      options: ['IOError', 'FileNotFoundError', 'FileError', 'OSError'],
      correctIndex: 1,
      explanation: 'FileNotFoundError es la excepción específica. Es subclase de OSError.',
    },
    {
      concept: 'exception-type',
      question: '¿Qué excepción lanzas para un valor inválido en tu código?',
      options: ['TypeError', 'ValueError', 'KeyError', 'RuntimeError'],
      correctIndex: 1,
      explanation: 'ValueError es para valores inválidos (ej: int("abc")). TypeError es para tipos incorrectos.',
    },
    {
      concept: 'exception-type',
      question: 'Si intentas `d["inexistente"]` en un dict, ¿qué excepción obtienes?',
      options: ['ValueError', 'KeyError', 'IndexError', 'AttributeError'],
      correctIndex: 1,
      explanation: 'KeyError se lanza cuando una key no existe en el dict. Usa .get() para evitarlo.',
    },
  ],
  'functions-modules': [
    {
      concept: 'functools-wraps',
      question: '¿Qué hace `@functools.wraps(func)` en un decorator?',
      options: [
        'Hace la función más rápida',
        'Preserva __name__ y __doc__ de la función original',
        'Es opcional',
        'Permite parámetros en el decorator',
      ],
      correctIndex: 1,
      explanation: 'Sin @functools.wraps, la función decorada se llama "wrapper" y pierde su docstring.',
    },
    {
      concept: 'functools-wraps',
      question: '¿Qué problema causa no usar @functools.wraps?',
      options: [
        'La función es más lenta',
        'La función decorada se llama "wrapper" y pierde docstring',
        'No causa problemas',
        'Da error de sintaxis',
      ],
      correctIndex: 1,
      explanation: 'Sin @wraps, help(mi_funcion) muestra "wrapper" en vez del nombre real y sin docstring.',
    },
    {
      concept: 'functools-wraps',
      question: '¿Dentro de un decorator, qué debes poner antes de def wrapper?',
      options: ['@property', '@functools.wraps(func)', '@staticmethod', 'Nada'],
      correctIndex: 1,
      explanation: '@functools.wraps(func) preserva la metadata de la función original en el wrapper.',
    },
    {
      concept: 'pathlib-vs-os',
      question: '¿Qué imprime `Path("data") / "ventas.csv"` en Windows?',
      options: [
        'Error',
        'data\\ventas.csv (normalizado al OS)',
        'data/ventas.csv (siempre forward slash)',
        'data:ventas.csv',
      ],
      correctIndex: 1,
      explanation: 'pathlib usa / como operador y normaliza al separador del OS. En Windows usa backslash.',
    },
    {
      concept: 'pathlib-vs-os',
      question: '¿Cómo creas todos los directorios padres con pathlib?',
      options: [
        'Path("a/b/c").mkdir()',
        'Path("a/b/c").mkdir(parents=True, exist_ok=True)',
        'Path("a/b/c").create_all()',
        'os.makedirs(Path("a/b/c"))',
      ],
      correctIndex: 1,
      explanation: 'parents=True crea toda la jerarquía. exist_ok=True no falla si ya existe.',
    },
    {
      concept: 'pathlib-vs-os',
      question: '¿Cómo lees todo el texto de un archivo con pathlib en una línea?',
      options: [
        'open(p).read()',
        'p.read_text()',
        'p.read()',
        'Path.read(p)',
      ],
      correctIndex: 1,
      explanation: 'Path.read_text() lee el contenido completo. También existe write_text(), read_bytes(), write_bytes().',
    },
    {
      concept: 'name-main',
      question: '¿Para qué sirve `if __name__ == "__main__":`?',
      options: [
        'Definir la función principal',
        'Ejecutar código solo cuando el archivo se corre directamente, no cuando se importa',
        'Es equivalente a main() en C',
        'Indicar módulo ejecutable',
      ],
      correctIndex: 1,
      explanation: 'Cuando importas un módulo, __name__ vale el nombre del módulo. Cuando lo ejecutas directo, vale "__main__".',
    },
    {
      concept: 'name-main',
      question: 'Si tienes código de prueba al final de mi_modulo.py sin if __name__ guard, ¿qué pasa al importarlo?',
      options: [
        'No pasa nada',
        'El código de prueba se ejecuta al importar',
        'Da error',
        'Solo se ejecuta la primera vez',
      ],
      correctIndex: 1,
      explanation: 'Sin el guard, cualquier import ejecuta el código de prueba. if __name__ == "__main__" lo previene.',
    },
    {
      concept: 'name-main',
      question: '¿Cuál es el valor de __name__ cuando ejecutas `python mi_modulo.py`?',
      options: ['"mi_modulo"', '"__main__"', '"__script__"', 'None'],
      correctIndex: 1,
      explanation: 'Al ejecutar un archivo directamente, __name__ vale "__main__". Al importarlo, vale el nombre del módulo.',
    },
    {
      concept: 'keyword-only-args',
      question: '¿Qué son los keyword-only args?',
      options: [
        'Args que solo aceptan strings',
        'Args que deben pasarse por nombre, definidos después de *',
        'Args opcionales',
        'Args que van después de **kwargs',
      ],
      correctIndex: 1,
      explanation: '`def f(a, b, *, debug=False):` define debug como keyword-only. El caller debe usar f(1, 2, debug=True).',
    },
    {
      concept: 'keyword-only-args',
      question: '¿Cómo defines una función donde `verbose` sea keyword-only?',
      options: [
        'def f(verbose=False):',
        'def f(*, verbose=False):',
        'def f(verbose*):',
        'def f(**verbose):',
      ],
      correctIndex: 1,
      explanation: 'El * sin nombre marca el límite: todo lo después es keyword-only.',
    },
    {
      concept: 'keyword-only-args',
      question: '¿Por qué usar keyword-only args?',
      options: [
        'Son más rápidos',
        'Mejoran legibilidad: f(1, 2, debug=True) es claro, f(1, 2, True) es opaco',
        'Son obligatorios',
        'Permiten más argumentos',
      ],
      correctIndex: 1,
      explanation: 'Forzar el nombre hace el código más legible y resistente a errores de orden.',
    },
  ],
  oop: [
    {
      concept: 'str-vs-repr',
      question: '¿Diferencia entre `__str__` y `__repr__`?',
      options: [
        'Son lo mismo',
        '__str__ es para usuarios (legible), __repr__ para devs (reconstruible)',
        '__str__ es más rápido',
        '__repr__ solo funciona con números',
      ],
      correctIndex: 1,
      explanation: '__str__ devuelve algo legible. __repr__ devuelve algo técnico, idealmente eval(repr(obj))==obj.',
    },
    {
      concept: 'str-vs-repr',
      question: 'Si solo implementas uno, ¿cuál es más importante?',
      options: ['__str__', '__repr__', 'Ambos por igual', 'Ninguno'],
      correctIndex: 1,
      explanation: 'Python usa __repr__ como fallback de __str__. Si implementas __repr__, print() funciona.',
    },
    {
      concept: 'str-vs-repr',
      question: '¿Qué muestra `print(obj)` si obj no define __str__ ni __repr__?',
      options: [
        'El contenido del objeto',
        'Algo como <__main__.MiClase object at 0x...>',
        'Error',
        'None',
      ],
      correctIndex: 1,
      explanation: 'Sin __str__ ni __repr__, Python muestra la representación por defecto con la clase y dirección de memoria.',
    },
    {
      concept: 'super-init',
      question: '¿Para qué sirve `super().__init__(...)` en una subclase?',
      options: [
        'Crear instancia del padre',
        'Llamar al constructor de la clase padre desde la subclase',
        'Evitar definir __init__',
        'Hacer la subclase más rápida',
      ],
      correctIndex: 1,
      explanation: 'super() llama al constructor del padre, asegurando que la parte heredada se inicialice correctamente.',
    },
    {
      concept: 'super-init',
      question: '¿Qué pasa si una subclase no llama a super().__init__()?',
      options: [
        'Error de sintaxis',
        'Los atributos del padre no se inicializan',
        'La subclase no se puede instanciar',
        'Nada, funciona normal',
      ],
      correctIndex: 1,
      explanation: 'Si el padre define __init__ con atributos, la subclase debe llamar super().__init__() para tener esos atributos.',
    },
    {
      concept: 'super-init',
      question: 'En `class B(A): def __init__(self): super().__init__()`, ¿qué hace super()?',
      options: [
        'Crea una nueva instancia de A',
        'Retorna un proxy que delega al padre A',
        'Es lo mismo que self',
        'Llama a __new__',
      ],
      correctIndex: 1,
      explanation: 'super() retorna un proxy que delega llamadas al siguiente en el MRO (Method Resolution Order).',
    },
    {
      concept: 'underscore-convention',
      question: '¿Qué significa `_atributo` (un underscore) en Python?',
      options: [
        'Es privado de verdad',
        'Es "protegido" — convención de no tocar, pero accesible',
        'Es lo mismo que __',
        'Indica método mágico',
      ],
      correctIndex: 1,
      explanation: 'Un underscore es CONVENCIÓN. Python no lo prohíbe, solo indica "no deberías tocar esto desde fuera".',
    },
    {
      concept: 'underscore-convention',
      question: '¿Qué hace __atributo (dos underscores)?',
      options: [
        'Lo hace verdaderamente privado',
        'Aplica name-mangling: renombra a _Clase__atributo para dificultar acceso',
        'Es lo mismo que un underscore',
        'Lo hace estático',
      ],
      correctIndex: 1,
      explanation: 'Dos underscores aplican name-mangling: _MiClase__atributo. Dificulta pero no impide el acceso.',
    },
    {
      concept: 'underscore-convention',
      question: '¿Cuál es la convención para constantes?',
      options: ['snake_case', 'UPPER_CASE', 'camelCase', 'PascalCase'],
      correctIndex: 1,
      explanation: 'UPPER_CASE para constantes (PI = 3.14). snake_case para variables/funciones. PascalCase para clases.',
    },
    {
      concept: 'composition-vs-inheritance',
      question: '¿Cuándo usar composición en vez de herencia?',
      options: [
        'Siempre',
        'Cuando la relación es HAS-A (tiene un) en vez de IS-A (es un)',
        'Nunca',
        'Solo cuando la clase padre es abstracta',
      ],
      correctIndex: 1,
      explanation: 'IS-A → herencia (Perro IS-A Animal). HAS-A → composición (Auto HAS-A Motor). Composición es más flexible.',
    },
    {
      concept: 'composition-vs-inheritance',
      question: '¿Cuál es mejor diseño: Auto extends Motor, o Auto tiene un Motor?',
      options: [
        'Auto extends Motor (herencia)',
        'Auto tiene un Motor (composición) — más flexible',
        'Ambos son iguales',
        'Depende del lenguaje',
      ],
      correctIndex: 1,
      explanation: 'Composición permite cambiar el motor sin tocar la jerarquía. "Favor composition over inheritance" (GoF).',
    },
    {
      concept: 'composition-vs-inheritance',
      question: '¿Qué principio OOP favorece composición sobre herencia?',
      options: [
        'SRP',
        'Open/Closed',
        'Liskov Substitution',
        'Favor composition over inheritance (GoF)',
      ],
      correctIndex: 3,
      explanation: 'El patrón GoF "Favor composition over inheritance" recomienda composición por su flexibilidad.',
    },
  ],
  numpy: [
    {
      concept: 'vectorization-speed',
      question: '¿Por qué NumPy es más rápido que Python puro para operaciones numéricas?',
      options: [
        'Está escrito en Python',
        'Vectoriza operaciones a nivel C y usa SIMD del CPU',
        'Usa menos memoria',
        'Tiene mejor algoritmo',
      ],
      correctIndex: 1,
      explanation: 'NumPy delega a código C optimizado que opera en lotes (vectorización) y usa instrucciones vectoriales del CPU.',
    },
    {
      concept: 'vectorization-speed',
      question: '¿Cuál es la regla de oro al operar con arrays NumPy?',
      options: [
        'Siempre usar loops',
        'Nunca escribir loops para operaciones matemáticas — usar operaciones vectorizadas',
        'Usar list comprehensions',
        'Convertir a lista primero',
      ],
      correctIndex: 1,
      explanation: 'Un loop de Python sobre 1M de elementos tarda 100x más que la operación vectorizada equivalente en NumPy.',
    },
    {
      concept: 'vectorization-speed',
      question: '¿Cuánto más rápido es NumPy vs Python puro para 1M de operaciones?',
      options: ['2x', '10x', '50-100x', 'Exactamente igual'],
      correctIndex: 2,
      explanation: 'Para operaciones numéricas sobre arrays grandes, NumPy es típicamente 50-100x más rápido que Python puro.',
    },
    {
      concept: 'boolean-masking',
      question: '¿Qué devuelve `arr[arr > 5]`?',
      options: [
        'True/False array',
        'Solo los elementos mayores a 5',
        'Los índices donde arr > 5',
        'Error',
      ],
      correctIndex: 1,
      explanation: 'Boolean masking: usas un array booleano como índice y NumPy devuelve solo los elementos donde es True.',
    },
    {
      concept: 'boolean-masking',
      question: '¿Cómo combinas dos condiciones en NumPy?',
      options: [
        '(arr > 5) and (arr < 10)',
        '(arr > 5) & (arr < 10)',
        '(arr > 5) && (arr < 10)',
        'arr > 5 & arr < 10',
      ],
      correctIndex: 1,
      explanation: 'En NumPy se usan operadores bitwise & | ~ con paréntesis OBLIGATORIOS por precedencia.',
    },
    {
      concept: 'boolean-masking',
      question: '¿Qué hace `arr[arr > 100] = 100`?',
      options: [
        'Error',
        'Cap (limita) los valores mayores a 100 al valor 100',
        'Borra los elementos > 100',
        'Devuelve un array nuevo',
      ],
      correctIndex: 1,
      explanation: 'Boolean masking con asignación modifica in-place. Aquí limita los valores a máximo 100 (clipping).',
    },
    {
      concept: 'broadcasting-shape',
      question: '¿Qué significa -1 en `arr.reshape(-1, 1)`?',
      options: [
        'Eliminar esa dimensión',
        'NumPy calcula esa dimensión automáticamente',
        'Crear dimensión de tamaño 1',
        'Transponer el array',
      ],
      correctIndex: 1,
      explanation: '-1 es wildcard. Para 12 elementos, reshape(-1, 1) da (12, 1), reshape(3, -1) da (3, 4).',
    },
    {
      concept: 'broadcasting-shape',
      question: '¿Puedes sumar matriz (3,4) + vector (4,)?',
      options: [
        'No, shapes incompatibles',
        'Sí, broadcasting estira el vector a (3,4) y suma fila por fila',
        'Solo si el vector es (3,)',
        'Da error de tipo',
      ],
      correctIndex: 1,
      explanation: 'Broadcasting: el vector (4,) se estira a (3,4) sumándose a cada fila de la matriz. Es automático.',
    },
    {
      concept: 'broadcasting-shape',
      question: '¿Por qué falla matriz (3,4) + vector (3,)?',
      options: [
        'Porque son tipos distintos',
        'Porque las shapes no alinean desde la derecha (4≠3)',
        'Porque falta memoria',
        'No falla, funciona',
      ],
      correctIndex: 1,
      explanation: 'Broadcasting compara shapes desde la derecha. (3,4) y (3,) → 4≠3, no son compatibles.',
    },
    {
      concept: 'axis-arg',
      question: '¿Qué hace `matriz.sum(axis=0)` en una matriz 2D?',
      options: [
        'Suma todos los elementos',
        'Suma por columnas (devuelve vector)',
        'Suma por filas (devuelve vector)',
        'Suma la diagonal',
      ],
      correctIndex: 1,
      explanation: 'axis=0 reduce filas → suma por columnas. axis=1 reduce columnas → suma por filas.',
    },
    {
      concept: 'axis-arg',
      question: '¿Cómo obtienes el promedio de cada FILA de una matriz?',
      options: ['matriz.mean(axis=0)', 'matriz.mean(axis=1)', 'matriz.mean()', 'matriz.mean(rows=True)'],
      correctIndex: 1,
      explanation: 'axis=1 reduce columnas, dejando el promedio por fila.',
    },
    {
      concept: 'axis-arg',
      question: '¿Qué devuelve `arr.max(axis=0)` para una matriz (5,3)?',
      options: [
        'Un escalar (máximo global)',
        'Un array de 3 elementos (máximo por columna)',
        'Un array de 5 elementos (máximo por fila)',
        'Error',
      ],
      correctIndex: 1,
      explanation: 'axis=0 reduce filas → máximo por cada una de las 3 columnas → array de 3 elementos.',
    },
  ],
  pandas: [
    {
      concept: 'groupby-output',
      question: '¿Qué devuelve `df.groupby("region")["salario"].mean()`?',
      options: [
        'Un DataFrame',
        'Un Series con la media de salario por región (región como índice)',
        'Filtra filas con media',
        'Una lista',
      ],
      correctIndex: 1,
      explanation: 'groupby + selección de una columna + agregación devuelve un Series con la clave como índice.',
    },
    {
      concept: 'groupby-output',
      question: '¿Cómo obtienes un DataFrame (no Series) después de groupby?',
      options: [
        'No se puede',
        'Usa .reset_index() o .agg() con múltiples funciones',
        'Usa .to_frame()',
        'Las opciones 2 y 3 funcionan',
      ],
      correctIndex: 3,
      explanation: 'Tanto reset_index() como to_frame() convierten el Series en DataFrame. agg() con múltiples funciones también.',
    },
    {
      concept: 'groupby-output',
      question: '¿Qué hace `df.groupby("region")["salario"].agg(["mean", "count"])`?',
      options: [
        'Error',
        'Devuelve DataFrame con 2 columnas: mean y count, por región',
        'Devuelve un Series',
        'Solo devuelve la media',
      ],
      correctIndex: 1,
      explanation: 'agg() con lista de funciones devuelve un DataFrame con una columna por cada función.',
    },
    {
      concept: 'loc-vs-iloc',
      question: '¿Diferencia entre .loc y .iloc?',
      options: [
        'Son lo mismo',
        '.loc usa labels (nombres), .iloc usa posiciones (enteros)',
        '.loc es más rápido',
        '.iloc solo funciona con números',
      ],
      correctIndex: 1,
      explanation: '.loc usa labels del índice y nombres de columnas. .iloc usa posiciones enteras (0-based).',
    },
    {
      concept: 'loc-vs-iloc',
      question: 'Si tu índice es [10, 20, 30], ¿qué devuelve df.loc[10]?',
      options: [
        'La décima fila',
        'La fila cuyo índice es 10 (primera fila)',
        'Error',
        'Las primeras 10 filas',
      ],
      correctIndex: 1,
      explanation: '.loc usa labels. df.loc[10] devuelve la fila con índice 10, que en este caso es la primera.',
    },
    {
      concept: 'loc-vs-iloc',
      question: '¿Cómo seleccionas la primera fila sin importar el índice?',
      options: ['df.loc[0]', 'df.iloc[0]', 'df[0]', 'df.first()'],
      correctIndex: 1,
      explanation: '.iloc[0] siempre devuelve la primera fila por posición. .loc[0] podría dar KeyError si el índice no incluye 0.',
    },
    {
      concept: 'null-handling',
      question: '¿Cómo manejas valores nulos en una columna numérica?',
      options: [
        'Eliminar siempre todas las filas con nulos',
        'Imputar con media, mediana, o valor específico según contexto',
        'Convertir siempre a 0',
        'Dejarlos, pandas los maneja',
      ],
      correctIndex: 1,
      explanation: 'Depende del contexto: dropna si son pocos y aleatorios, fillna(media) si distribución simétrica, fillna(mediana) si hay outliers.',
    },
    {
      concept: 'null-handling',
      question: '¿Qué hace `df["col"].fillna(df["col"].median())`?',
      options: [
        'Borra las filas con nulos',
        'Rellena los nulos con la mediana de la columna',
        'Crea una columna nueva',
        'Da error',
      ],
      correctIndex: 1,
      explanation: 'fillna(valor) reemplaza los NaN con el valor dado. La mediana es robusta a outliers.',
    },
    {
      concept: 'null-handling',
      question: '¿Cómo cuentas los nulos por columna?',
      options: [
        'df.count()',
        'df.isnull().sum()',
        'df.nuls()',
        'len(df) - len(df.dropna())',
      ],
      correctIndex: 1,
      explanation: 'isnull() devuelve DataFrame booleano. sum() por columna cuenta los True (nulos).',
    },
    {
      concept: 'merge-types',
      question: '¿Qué hace `pd.merge(df1, df2, on="id", how="left")`?',
      options: [
        'Solo filas con id en ambos',
        'Todas las filas de df1, con NaN donde no hay match en df2',
        'Todas las filas de df2',
        'La unión de ambos',
      ],
      correctIndex: 1,
      explanation: 'LEFT JOIN: todas las filas del DataFrame izquierdo, con NaN donde no hay coincidencia.',
    },
    {
      concept: 'merge-types',
      question: '¿Qué how usar para quedarte SOLO con filas presentes en ambos DataFrames?',
      options: ['"left"', '"right"', '"inner"', '"outer"'],
      correctIndex: 2,
      explanation: 'INNER JOIN (default): solo filas con coincidencia en ambos. OUTER: unión completa.',
    },
    {
      concept: 'merge-types',
      question: '¿Cuál es el equivalente de FULL OUTER JOIN en pandas?',
      options: ['how="full"', 'how="outer"', 'how="all"', 'how="union"'],
      correctIndex: 1,
      explanation: 'how="outer" devuelve todas las filas de ambos DataFrames, con NaN donde no hay match.',
    },
  ],
  visualization: [
    {
      concept: 'matplotlib-oo-api',
      question: '¿Cuál es la API recomendada de matplotlib para gráficos serios?',
      options: [
        'plt.plot() directo',
        'Object-oriented: fig, ax = plt.subplots()',
        'Solo seaborn',
        'Solo plotly',
      ],
      correctIndex: 1,
      explanation: 'La API object-oriented (fig, ax) da control total. plt.plot() es limitado para subplots o customización.',
    },
    {
      concept: 'matplotlib-oo-api',
      question: '¿Cómo creas una figura con 4 subplots (2x2)?',
      options: [
        'plt.subplots(4)',
        'fig, axes = plt.subplots(2, 2, figsize=(12, 8))',
        'plt.figure(4)',
        'fig = plt.multiplot(2, 2)',
      ],
      correctIndex: 1,
      explanation: 'plt.subplots(2, 2) crea una grilla 2x2. axes[0,0], axes[0,1], axes[1,0], axes[1,1] son los 4 Axes.',
    },
    {
      concept: 'matplotlib-oo-api',
      question: '¿Cómo accedes al Axes de arriba a la derecha en axes (2x2)?',
      options: ['axes[1]', 'axes[0, 1]', 'axes[1, 0]', 'axes.top_right'],
      correctIndex: 1,
      explanation: 'axes[fila, columna]. Arriba-derecha = fila 0, columna 1 = axes[0, 1].',
    },
    {
      concept: 'tight-layout',
      question: '¿Para qué sirve `plt.tight_layout()`?',
      options: [
        'Hace el gráfico más pequeño',
        'Ajusta espaciado para evitar overlaps de títulos y labels',
        'Cambia el tema',
        'Es lo mismo que plt.show()',
      ],
      correctIndex: 1,
      explanation: 'tight_layout() recalcula márgenes para que títulos, labels y leyendas no se superpongan.',
    },
    {
      concept: 'tight-layout',
      question: '¿Cuándo debes llamar tight_layout()?',
      options: [
        'Antes de plt.subplots()',
        'Después de crear todos los subplots, antes de savefig/show',
        'Después de plt.show()',
        'Nunca',
      ],
      correctIndex: 1,
      explanation: 'Se llama al final, antes de savefig. Si lo llamas antes de agregar títulos, no tendrá efecto.',
    },
    {
      concept: 'tight-layout',
      question: '¿Qué problema soluciona tight_layout()?',
      options: [
        'Gráficos pixelados',
        'Etiquetas y títulos que se superponen o se cortan',
        'Colores poco atractivos',
        'Lentitud al renderizar',
      ],
      correctIndex: 1,
      explanation: 'Es el fix #1 para "mi título se corta" o "los labels del eje X se superponen".',
    },
    {
      concept: 'seaborn-use-case',
      question: '¿Cuándo usar seaborn en vez de matplotlib?',
      options: [
        'Siempre',
        'Para gráficos estadísticos (box, violin, heatmap, pairplot)',
        'Solo para gráficos interactivos',
        'Solo si matplotlib no funciona',
      ],
      correctIndex: 1,
      explanation: 'seaborn brilla en gráficos estadísticos. matplotlib para customización fina. La combinación es estándar.',
    },
    {
      concept: 'seaborn-use-case',
      question: '¿Qué gráfico de seaborn es ideal para ver correlaciones entre todas las variables numéricas?',
      options: ['sns.barplot()', 'sns.heatmap(corr, annot=True)', 'sns.lineplot()', 'sns.countplot()'],
      correctIndex: 1,
      explanation: 'heatmap con annot=True muestra la matriz de correlación con valores numéricos en cada celda.',
    },
    {
      concept: 'seaborn-use-case',
      question: '¿Cuál usar para ver la distribución de una variable por categoría?',
      options: ['sns.scatterplot()', 'sns.boxplot() o sns.violinplot()', 'sns.heatmap()', 'sns.regplot()'],
      correctIndex: 1,
      explanation: 'boxplot y violinplot muestran distribución (mediana, cuartiles, outliers) por categoría.',
    },
    {
      concept: 'plotly-export',
      question: '¿Cómo guardas un gráfico plotly para web?',
      options: [
        'plt.savefig("archivo.png")',
        'fig.write_html("archivo.html")',
        'fig.save("archivo.svg")',
        'No se puede',
      ],
      correctIndex: 1,
      explanation: 'plotly exporta a HTML con write_html(). El archivo incluye la gráfica + JS, se abre en cualquier browser.',
    },
    {
      concept: 'plotly-export',
      question: '¿Ventaja principal de plotly sobre matplotlib?',
      options: [
        'Es más rápido',
        'Interactividad (hover, zoom, pan) ideal para dashboards web',
        'Mejores colores',
        'Más fácil de usar',
      ],
      correctIndex: 1,
      explanation: 'plotly produce gráficos interactivos que se pueden exportar como HTML para dashboards web.',
    },
    {
      concept: 'plotly-export',
      question: '¿Cómo creas un bar chart interactivo con plotly express?',
      options: [
        'px.bar(df, x="col1", y="col2")',
        'plotly.bar(df, x, y)',
        'px.chart(df, type="bar")',
        'plotly.create_bar(df)',
      ],
      correctIndex: 0,
      explanation: 'px.bar(df, x, y) crea un bar chart interactivo. Otras funciones: px.scatter, px.line, px.pie.',
    },
  ],
  sklearn: [
    {
      concept: 'pipeline-purpose',
      question: '¿Por qué usar Pipeline en vez de aplicar transformaciones por separado?',
      options: [
        'Es más rápido',
        'Evita data leakage y simplifica deployment',
        'Es lo mismo',
        'Solo para modelos lineales',
      ],
      correctIndex: 1,
      explanation: 'Pipeline aplica transformaciones solo sobre X_train durante fit, evitando leakage del test set.',
    },
    {
      concept: 'pipeline-purpose',
      question: '¿Qué es data leakage y cómo lo evita Pipeline?',
      options: [
        'Es cuando los datos se pierden',
        'Es cuando info del test set "contamina" el entrenamiento; Pipeline lo evita aplicando fit solo en train',
        'Es un tipo de error de red',
        'Es cuando el modelo es muy lento',
      ],
      correctIndex: 1,
      explanation: 'Si haces fit_transform sobre TODO el dataset, el scaler "ve" el test set. Pipeline.fit solo ve X_train.',
    },
    {
      concept: 'pipeline-purpose',
      question: '¿Qué ventaja adicional da Pipeline para deployment?',
      options: [
        'Es más rápido en producción',
        'Persistes todo el pipeline (preprocesamiento + modelo) y applies a datos nuevos sin replicar transformaciones',
        'No hay ventaja adicional',
        'Solo sirve para sklearn',
      ],
      correctIndex: 1,
      explanation: 'joblib.dump(pipeline) guarda todo. En inference, pipeline.predict(datos_crudos) aplica todo automáticamente.',
    },
    {
      concept: 'stratified-kfold',
      question: '¿Qué hace StratifiedKFold y por qué usarlo en clasificación?',
      options: [
        'Es lo mismo que KFold',
        'Mantiene la proporción de clases en cada fold — esencial para datasets desbalanceados',
        'Reduce el número de folds',
        'Solo funciona para regresión',
      ],
      correctIndex: 1,
      explanation: 'StratifiedKFold asegura que cada fold tenga la misma proporción de clases. Obligatorio para clasificación con desbalance.',
    },
    {
      concept: 'stratified-kfold',
      question: 'Si tienes 1000 muestras con 10% positivas, ¿por qué StratifiedKFold es crítico?',
      options: [
        'Para velocidad',
        'Sin stratify, un fold podría no tener positivos y la CV fallaría',
        'Para usar menos memoria',
        'No es crítico en este caso',
      ],
      correctIndex: 1,
      explanation: 'Con 10% de positivos y 5 folds, sin stratify algún fold podría tener 0 positivos. Stratify lo evita.',
    },
    {
      concept: 'stratified-kfold',
      question: '¿Cómo configuras StratifiedKFold en cross_val_score?',
      options: [
        'cross_val_score(model, X, y, cv=5)',
        'cross_val_score(model, X, y, cv=StratifiedKFold(5, shuffle=True))',
        'cross_val_score(model, X, y, stratify=True)',
        'cross_val_score(model, X, y, cv="stratified")',
      ],
      correctIndex: 1,
      explanation: 'Pasas un objeto StratifiedKFold como cv. cv=5 numérico usa KFold normal (no stratified).',
    },
    {
      concept: 'random-vs-grid-search',
      question: '¿Cuándo es mejor RandomizedSearchCV sobre GridSearchCV?',
      options: [
        'Siempre',
        'Cuando el espacio de hiperparámetros es grande o tiene valores continuos',
        'Solo para modelos lineales',
        'Nunca, GridSearch es siempre mejor',
      ],
      correctIndex: 1,
      explanation: 'GridSearch prueba TODAS las combinaciones (exponencial). RandomizedSearch prueba N aleatorias — más eficiente.',
    },
    {
      concept: 'random-vs-grid-search',
      question: '¿Qué significa n_iter=30 en RandomizedSearchCV?',
      options: [
        '30 epochs',
        '30 combinaciones aleatorias de hiperparámetros a probar',
        '30 folds de CV',
        '30 segundos máximo',
      ],
      correctIndex: 1,
      explanation: 'n_iter es el número de combinaciones aleatorias a probar. Más iter = más chance de encontrar óptimo.',
    },
    {
      concept: 'random-vs-grid-search',
      question: '¿Para qué parámetro de LogisticRegression usarías distribución continua en RandomizedSearch?',
      options: [
        'penalty (l1, l2)',
        'C (regularización) — usa uniform o loguniform',
        'solver',
        'max_iter',
      ],
      correctIndex: 1,
      explanation: 'C es continuo (0.001 a 100). Penalty y solver son discretos. Distribuciones continuas solo tienen sentido en Randomized.',
    },
    {
      concept: 'shap-purpose',
      question: '¿Para qué sirve SHAP en ML?',
      options: [
        'Entrenar modelos más rápido',
        'Explicar contribuciones de cada feature a predicciones individuales',
        'Feature selection',
        'Normalizar features',
      ],
      correctIndex: 1,
      explanation: 'SHAP descompone una predicción en contribuciones por feature. Esencial para compliance y confianza del negocio.',
    },
    {
      concept: 'shap-purpose',
      question: '¿Qué muestra un SHAP beeswarm plot?',
      options: [
        'Una predicción individual',
        'Importancia global de features y su dirección (alta/baja)',
        'La matriz de confusión',
        'Las correlaciones',
      ],
      correctIndex: 1,
      explanation: 'beeswarm muestra todas las observaciones: color = valor de feature, posición horizontal = impacto en predicción.',
    },
    {
      concept: 'shap-purpose',
      question: '¿Qué SHAP plot usar para explicar UNA predicción específica?',
      options: ['beeswarm', 'waterfall', 'summary', 'dependence'],
      correctIndex: 1,
      explanation: 'waterfall descompone una predicción en contribuciones por feature. beeswarm es para vista global.',
    },
  ],
  testing: [
    {
      concept: 'pytest-naming',
      question: '¿Convención de nombres para que pytest descubra tus tests?',
      options: [
        'Cualquier .py',
        'Archivos test_*.py con funciones test_*',
        'Solo en carpeta tests/',
        'Clases Test* con métodos test_*',
      ],
      correctIndex: 1,
      explanation: 'pytest busca archivos test_*.py y dentro funciones test_*. Respetar esta convención es obligatorio.',
    },
    {
      concept: 'pytest-naming',
      question: '¿Qué nombre debe tener tu archivo de tests para calculara.py?',
      options: ['tests.py', 'test_calculadora.py', 'calculadora_tests.py', 'TestCalculadora.py'],
      correctIndex: 1,
      explanation: 'Convención: test_<modulo>.py. pytest lo descubre automáticamente.',
    },
    {
      concept: 'pytest-naming',
      question: '¿Cómo se llama una función de test válida en pytest?',
      options: ['def TestSuma():', 'def test_suma():', 'def TestSuma():', 'def suma_test():'],
      correctIndex: 1,
      explanation: 'Las funciones deben empezar con test_. Las clases con Test (sin __init__).',
    },
    {
      concept: 'fixtures-purpose',
      question: '¿Para qué sirve una fixture en pytest?',
      options: [
        'Hacer tests más lentos',
        'Preparar datos/estado reutilizable entre tests',
        'Documentar tests',
        'Es lo mismo que un mock',
      ],
      correctIndex: 1,
      explanation: 'Una fixture (@pytest.fixture) prepara datos o estado. Se inyecta como parámetro. Evita duplicación.',
    },
    {
      concept: 'fixtures-purpose',
      question: '¿Cómo defines una fixture que devuelve un DataFrame de prueba?',
      options: [
        '@pytest.fixture\ndef df(): return pd.DataFrame(...)',
        '@fixture\ndef test_df(): ...',
        'def df_fixture(): @pytest.fixture ...',
        '@pytest.data\ndef df(): ...',
      ],
      correctIndex: 0,
      explanation: 'Decoras una función con @pytest.fixture. El return es lo que se inyecta en los tests que la piden como parámetro.',
    },
    {
      concept: 'fixtures-purpose',
      question: '¿Qué hace `yield` en una fixture?',
      options: [
        'Lo mismo que return',
        'Setup antes del yield, teardown después (se ejecuta siempre)',
        'Pausa el test',
        'Devuelve múltiples valores',
      ],
      correctIndex: 1,
      explanation: 'El código antes de yield es setup, después es teardown (se ejecuta siempre, incluso si el test falla).',
    },
    {
      concept: 'parametrize',
      question: '¿Qué hace `@pytest.mark.parametrize`?',
      options: [
        'Marca el test como lento',
        'Corre el mismo test con múltiples combinaciones de inputs',
        'Para el test si falla',
        'Es lo mismo que fixture',
      ],
      correctIndex: 1,
      explanation: 'parametrize recibe una lista de tuplas y corre el test una vez por cada una. Si una falla, te dice cuál.',
    },
    {
      concept: 'parametrize',
      question: '¿Cómo parametrizas un test para que corra con inputs 2, 4, 6 esperando True?',
      options: [
        '@pytest.mark.parametrize("input,esperado", [(2,True),(4,True),(6,True)])',
        '@pytest.params([2,4,6])',
        '@pytest.mark.inputs(2,4,6)',
        'No se puede',
      ],
      correctIndex: 0,
      explanation: 'La sintaxis es @pytest.mark.parametrize("nombres_params", [lista_de_tuplas]).',
    },
    {
      concept: 'parametrize',
      question: 'Ventaja de parametrize sobre escribir 3 tests separados?',
      options: [
        'Es más rápido',
        'Si uno falla, pytest te dice exactamente qué input falló. Menos código duplicado.',
        'Usa menos memoria',
        'No hay ventaja',
      ],
      correctIndex: 1,
      explanation: 'parametrize genera un test por cada caso, con IDs distintos. Reporta fallos por caso individual.',
    },
    {
      concept: 'coverage',
      question: '¿Qué mide `pytest --cov=mi_modulo`?',
      options: [
        'Tiempo de ejecución',
        'Porcentaje de líneas de código cubiertas por tests',
        'Número de tests',
        'Calidad de tests',
      ],
      correctIndex: 1,
      explanation: 'Coverage mide qué líneas se ejecutaron durante los tests. 80%+ es bueno. 100% es difícil.',
    },
    {
      concept: 'coverage',
      question: '¿Qué flag te muestra qué líneas NO se cubrieron?',
      options: ['--cov-report=term-missing', '--cov-missing', '--show-untested', '--cov-gaps'],
      correctIndex: 0,
      explanation: '--cov-report=term-missing muestra las líneas no cubiertas en la terminal. Útil para saber qué tests faltan.',
    },
    {
      concept: 'coverage',
      question: '¿Qué cobertura es razonable buscar en código crítico?',
      options: ['20%', '50%', '80%+', '100% siempre'],
      correctIndex: 2,
      explanation: '80%+ es razonable. 100% es difícil y a veces innecesario (paths de error irreproducibles).',
    },
  ],
}

async function main() {
  console.log('🌱 Seeding QuestionBank...')

  // Clear existing
  await prisma.questionBank.deleteMany({})
  console.log('  ✓ Cleared existing questions')

  let count = 0
  for (const [sectionId, questions] of Object.entries(QUESTION_BANK)) {
    for (const q of questions) {
      await prisma.questionBank.create({
        data: {
          sectionId,
          concept: q.concept,
          variant: count % 3 + 1, // will be overwritten by the unique constraint logic
          question: q.question,
          options: JSON.stringify(q.options),
          correctIndex: q.correctIndex,
          explanation: q.explanation,
        },
      })
      count++
    }
  }

  // Now fix variant numbers: for each (sectionId, concept), assign variants 1, 2, 3 in order
  const allQuestions = await prisma.questionBank.findMany()
  const grouped = new Map<string, typeof allQuestions>()
  for (const q of allQuestions) {
    const key = `${q.sectionId}|${q.concept}`
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(q)
  }

  for (const [, qs] of grouped.entries()) {
    for (let i = 0; i < qs.length; i++) {
      await prisma.questionBank.update({
        where: { id: qs[i].id },
        data: { variant: i + 1 },
      })
    }
  }

  console.log(`  ✓ Inserted ${count} questions across ${Object.keys(QUESTION_BANK).length} sections`)

  // Create demo admin account if not exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@python-ds.pe' },
  })
  if (!existingAdmin) {
    const bcrypt = await import('bcryptjs')
    const passwordHash = await bcrypt.default.hash('admin123', 12)
    await prisma.user.create({
      data: {
        email: 'admin@python-ds.pe',
        name: 'Admin Demo',
        passwordHash,
        role: 'ADMIN',
      },
    })
    console.log('  ✓ Created demo admin: admin@python-ds.pe / admin123')
  } else {
    console.log('  ✓ Demo admin already exists')
  }

  // Create demo student account
  const existingStudent = await prisma.user.findUnique({
    where: { email: 'demo@python-ds.pe' },
  })
  if (!existingStudent) {
    const bcrypt = await import('bcryptjs')
    const passwordHash = await bcrypt.default.hash('demo1234', 12)
    await prisma.user.create({
      data: {
        email: 'demo@python-ds.pe',
        name: 'Estudiante Demo',
        passwordHash,
        role: 'STUDENT',
      },
    })
    console.log('  ✓ Created demo student: demo@python-ds.pe / demo1234')
  } else {
    console.log('  ✓ Demo student already exists')
  }

  console.log('\n✅ Seed complete!')
  console.log('   Admin:    admin@python-ds.pe / admin123')
  console.log('   Student:  demo@python-ds.pe / demo1234')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
