import type { CourseSection } from '../../types'

export const section05: CourseSection = {
  id: 'oop',
  index: 5,
  title: 'Object-Oriented Programming (OOP)',
  shortTitle: 'OOP',
  tagline: 'Classes, herencia, dunders y abstract classes — la llave para leer código de sklearn',
  estimatedHours: 10,
  level: 'Intermedio',
  phase: 0,
  icon: 'Boxes',
  accentColor: 'bg-gradient-to-br from-purple-500 to-fuchsia-600',
  jobRelevance:
    'Sin OOP no puedes leer el código fuente de scikit-learn, pandas ni matplotlib. Las clases BaseEstimator, TransformerMixin, ClassifierMixin de sklearn son el backbone de toda la librería. Cuando en producción te piden "crear un transformer custom para tu pipeline", necesitas heredar de estas clases. OOP también es la base de FastAPI, Django y Flask.',
  learningOutcomes: [
    { text: 'Definir clases con __init__, atributos de instancia y de clase' },
    { text: 'Implementar encapsulamiento con atributos públicos, _protegidos y __privados' },
    { text: 'Usar herencia con super() para extender clases' },
    { text: 'Aplicar polimorfismo y method overriding' },
    { text: 'Implementar dunder methods: __str__, __repr__, __eq__, __len__' },
    { text: 'Distinguir composición de herencia y usar ABC para interfaces' },
  ],
  theory: [
    {
      heading: 'Clases y objetos — modelando el mundo',
      paragraphs: [
        'Una clase es un molde para crear objetos. Un objeto es una instancia específica con datos (atributos) y comportamientos (métodos). Por ejemplo, la clase `Perro` define que todos los perros tienen nombre y edad (atributos) y pueden ladrar (método). Mi perro "Fido" de 3 años es una instancia específica. La analogía molde/instancia es la base de todo OOP.',
        'En Python, las clases se definen con `class Nombre:`. El método `__init__` es el constructor — se llama automáticamente cuando creas una instancia. El primer parámetro de todos los métodos es `self` (referencia a la instancia actual), equivalente a `this` en Java/JavaScript. Para crear una instancia: `mi_perro = Perro("Fido", 3)`.',
        'La diferencia entre atributos de instancia y de clase es sutil pero crítica. Los de instancia viven en `self` y son únicos por objeto. Los de clase viven en la clase misma y son compartidos por todas las instancias. Úsalos para constantes o defaults compartidos. Ejemplo: `class Perro: especie = "Canis lupus"` — todas las instancias comparten `especie`.',
      ],
      code: {
        language: 'python',
        title: 'perro.py',
        code: `class Perro:
    # Atributo de clase (compartido por todas las instancias)
    especie = "Canis lupus familiaris"

    def __init__(self, nombre, edad, raza="mestizo"):
        # Atributos de instancia (únicos por objeto)
        self.nombre = nombre
        self.edad = edad
        self.raza = raza
        self.trucos = []  # cada perro tiene su propia lista

    def ladrar(self):
        return f"{self.nombre} dice: ¡Guau!"

    def aprender_truco(self, truco):
        self.trucos.append(truco)
        return f"{self.nombre} aprendió: {truco}"

    def descripcion(self):
        return f"{self.nombre}, {self.edad} años, raza {self.raza}"

# Crear instancias
fido = Perro("Fido", 3, "labrador")
rex = Perro("Rex", 5)

print(fido.ladrar())  # Fido dice: ¡Guau!
print(rex.descripcion())  # Rex, 5 años, raza mestizo

# Atributo de clase (compartido)
print(fido.especie)  # Canis lupus familiaris
print(rex.especie)   # Canis lupus familiaris (mismo valor)

# Atributo de instancia (único)
fido.aprender_truco("sentar")
print(fido.trucos)   # ['sentar']
print(rex.trucos)    # []`,
        output: `Fido dice: ¡Guau!
Rex, 5 años, raza mestizo
Canis lupus familiaris
Canis lupus familiaris
['sentar']
[]`,
      },
    },
    {
      heading: 'Encapsulamiento — protegiendo tus datos',
      paragraphs: [
        'Python no tiene `private`/`protected` como Java. En su lugar, usa convenciones: atributos con `_` prefijo son "protegidos" (no tocar desde fuera), con `__` prefijo son "privados" (name-mangling dificulta acceso). Pero son CONVENCIONES — Python confía en el desarrollador. Si realmente quieres privacidad, usa `@property` para controlar acceso.',
        'El patrón profesional es: atributos privados con `__` + métodos `@property` getter/setter. Esto te permite validar antes de asignar y cambiar la implementación interna sin romper el API público. Por ejemplo, si tienes `cuenta.saldo`, quieres validar que no sea negativo. Con `@property`, puedes interceptar la asignación y validar.',
        '`@property` es un decorator que convierte un método en un atributo calculado. `@saldo.setter` define qué pasa cuando asignas. `@saldo.deleter` qué pasa al hacer `del`. Esta trinidad te da control total sobre el acceso a tus datos sin cambiar la sintaxis para el usuario de tu clase.',
      ],
      code: {
        language: 'python',
        title: 'cuenta.py',
        code: `class CuentaBancaria:
    def __init__(self, titular, saldo_inicial=0):
        self.titular = titular        # público
        self._tipo = "ahorro"          # protegido (convención)
        self.__saldo = saldo_inicial   # privado (name-mangling)
        self.__historial = []

    @property
    def saldo(self):
        """Getter: devuelve el saldo."""
        return self.__saldo

    @saldo.setter
    def saldo(self, valor):
        """Setter: valida antes de asignar."""
        if valor < 0:
            raise ValueError("El saldo no puede ser negativo")
        self.__saldo = valor
        self.__historial.append(("set", valor))

    def depositar(self, monto):
        if monto <= 0:
            raise ValueError("Monto debe ser positivo")
        self.__saldo += monto
        self.__historial.append(("deposito", monto))
        return self.__saldo

    def retirar(self, monto):
        if monto > self.__saldo:
            raise ValueError("Saldo insuficiente")
        self.__saldo -= monto
        self.__historial.append(("retiro", monto))
        return self.__saldo

# Uso
cuenta = CuentaBancaria("Ana Quispe", 1000)
print(cuenta.saldo)        # 1000 (usa @property getter)
cuenta.depositar(500)
print(cuenta.saldo)        # 1500
cuenta.retirar(200)
print(cuenta.saldo)        # 1300

# Intentar asignar negativo — validation dispara
try:
    cuenta.saldo = -100
except ValueError as e:
    print(f"Error: {e}")  # El saldo no puede ser negativo

# Acceso al "privado" (posible pero mala práctica)
# print(cuenta._CuentaBancaria__saldo)  # 1300 (name-mangling)`,
        output: `1000
1500
1300
Error: El saldo no puede ser negativo`,
      },
    },
    {
      heading: 'Herencia y polimorfismo — reutilizando comportamiento',
      paragraphs: [
        'La herencia permite que una clase hija herede atributos y métodos de una clase padre. Se define con `class Hija(Padre):`. La hija puede sobreescribir métodos (method overriding) o agregar nuevos. Para llamar al constructor del padre, usa `super().__init__(...)`. La herencia modela relaciones "IS-A": un Perro IS-A Animal, un Auto IS-A Vehiculo.',
        'El polimorfismo es la capacidad de tratar objetos de diferentes clases de forma uniforme si comparten una interfaz. Por ejemplo, si `Perro` y `Gato` ambos tienen método `ladrar()` (o `hacer_sonido()`), puedes iterarlos en una lista y llamar al método sin importar la clase específica. Esto es clave para diseñar código extensible sin modificar el existente (Open/Closed Principle).',
        '`isinstance(obj, Clase)` verifica si un objeto es instancia de una clase (o sus hijas). `issubclass(Hija, Padre)` verifica herencia. Usa estos checks cuando necesitas behavior polimórfico condicional. Pero cuidado: si abusas de isinstance, probablemente necesitas rediseñar con polimorfismo real.',
      ],
      code: {
        language: 'python',
        title: 'herencia.py',
        code: `class Animal:
    def __init__(self, nombre, edad):
        self.nombre = nombre
        self.edad = edad

    def hacer_sonido(self):
        """Método a sobreescribir en clases hijas."""
        return "sonido genérico"

    def descripcion(self):
        return f"{self.nombre}, {self.edad} años"

class Perro(Animal):
    def __init__(self, nombre, edad, raza):
        super().__init__(nombre, edad)  # llama al constructor del padre
        self.raza = raza

    def hacer_sonido(self):  # method overriding
        return "¡Guau!"

    def descripcion(self):
        # Extiende el comportamiento del padre
        base = super().descripcion()
        return f"{base}, raza {self.raza}"

class Gato(Animal):
    def hacer_sonido(self):
        return "¡Miau!"

class Pajaro(Animal):
    def __init__(self, nombre, edad, puede_volar=True):
        super().__init__(nombre, edad)
        self.puede_volar = puede_volar

    def hacer_sonido(self):
        return "¡Pío!"

# Polimorfismo: misma interfaz, comportamientos distintos
animales = [
    Perro("Fido", 3, "labrador"),
    Gato("Michi", 5),
    Pajaro("Piolín", 1)
]

for animal in animales:
    print(f"{animal.nombre}: {animal.hacer_sonido()}")
    # Cada uno hace su sonido específico

# Verificar herencia
print(isinstance(Perro("x", 1, "y"), Animal))  # True
print(issubclass(Gato, Animal))                  # True
print(issubclass(Animal, Perro))                 # False`,
        output: `Fido: ¡Guau!
Michi: ¡Miau!
Piolín: ¡Pío!
True
True
False`,
      },
    },
    {
      heading: 'Dunder methods — la magia de Python OOP',
      paragraphs: [
        'Los "dunder methods" (double underscore) son métodos especiales que Python llama automáticamente en ciertas situaciones. `__init__` es uno, pero hay decenas. Los más usados: `__str__` (representación legible para usuarios, lo que devuelve `print(obj)`), `__repr__` (representación para developers, idealmente reconstruye el objeto), `__len__` (longitud, lo que devuelve `len(obj)`), `__eq__` (comparación igualdad, lo que usa `==`).',
        'La diferencia entre `__str__` y `__repr__` es importante. `__str__` es para usuarios finales — debe ser legible y amigable. `__repr__` es para developers y debugging — debe ser inequívoco, idealmente `eval(repr(obj)) == obj`. Por ejemplo, `__repr__` de un datetime devuelve `datetime(2025, 7, 14, 19, 45)` que puedes copiar y evaluar. Si solo implementas uno, implementa `__repr__` — Python usa `__repr__` como fallback de `__str__`.',
        'Implementar `__eq__` te permite comparar objetos por valor en vez de por identidad. Por defecto, `obj1 == obj2` compara referencias (id), no contenido. Si quieres que dos Cuentas con mismo titular y saldo sean "iguales", implementas `__eq__`. Junto con `__hash__`, te permite usar tus objetos como keys de dict o en sets.',
      ],
      code: {
        language: 'python',
        title: 'dunders.py',
        code: `class Punto:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __str__(self):
        """Representación legible: print(punto) usa esto."""
        return f"({self.x}, {self.y})"

    def __repr__(self):
        """Representación técnica: idealmente reconstruye el objeto."""
        return f"Punto({self.x!r}, {self.y!r})"

    def __eq__(self, otro):
        """Comparación de igualdad por valor."""
        if not isinstance(otro, Punto):
            return NotImplemented
        return self.x == otro.x and self.y == otro.y

    def __hash__(self):
        """Necesario si quieres usar Punto como dict key."""
        return hash((self.x, self.y))

    def __add__(self, otro):
        """Permite usar el operador +."""
        return Punto(self.x + otro.x, self.y + otro.y)

    def __len__(self):
        """Longitud — aquí definimos como 2 (x, y)."""
        return 2

    def __iter__(self):
        """Permite iterar: for coord in punto."""
        yield self.x
        yield self.y

p1 = Punto(3, 4)
p2 = Punto(3, 4)
p3 = Punto(5, 6)

print(p1)              # (3, 4) — usa __str__
print(repr(p1))        # Punto(3, 4) — usa __repr__
print(p1 == p2)        # True — usa __eq__
print(p1 == p3)        # False
print(p1 + p3)         # (8, 10) — usa __add__
print(len(p1))         # 2 — usa __len__
print(list(p1))        # [3, 4] — usa __iter__

# Como implementamos __hash__, podemos usar Punto como dict key
distancias = {Punto(0, 0): 0, Punto(1, 1): 1.41}`,
        output: `(3, 4)
Punto(3, 4)
True
False
(8, 10)
2
[3, 4]`,
      },
    },
    {
      heading: 'Composición vs Herencia y Abstract Classes',
      paragraphs: [
        'La herencia es poderosa pero peligrosa. Si haces jerarquías muy profundas (Perro → Mamífero → Animal → Viviente → Ser), el código se vuelve frágil. El principio "Favor composition over inheritance" (Favoracer composición sobre herencia) del GoF dice: si necesitas reusar comportamiento, muchas veces es mejor que tu objeto CONTENGA a otro (composición) en vez de SER una extensión de otro (herencia).',
        'Ejemplo: en vez de `class Auto extends Motor extends Ruedas`, mejor `class Auto:` que CONTIENE un `motor` y una lista de `ruedas`. Si mañana quieres cambiar el motor, lo reemplazas sin tocar la jerarquía. La composición da flexibilidad, la herencia da estructura.',
        'Las Abstract Base Classes (ABC) definen interfaces: contratos que las clases hijas deben implementar. Se crean heredando de `ABC` y usando `@abstractmethod`. Una clase con métodos abstractos NO se puede instanciar — te obliga a crear una subclase que implemente los métodos. Esto es clave para diseñar APIs estables: defines el contrato, los usuarios implementan.',
      ],
      code: {
        language: 'python',
        title: 'abc_demo.py',
        code: `from abc import ABC, abstractmethod

# Abstract Base Class — define contrato
class DataSource(ABC):
    """Interface para fuentes de datos."""

    @abstractmethod
    def leer(self, query):
        """Lee datos. Debe ser implementado por subclases."""
        pass

    @abstractmethod
    def escribir(self, data):
        """Escribe datos."""
        pass

    # Método concreto (no abstracto) — compartido
    def validar(self, data):
        """Validación común a todas las fuentes."""
        if data is None:
            raise ValueError("Data no puede ser None")
        return True

# NO se puede instanciar la ABC directamente
# fuente = DataSource()  # TypeError!

class CSVSource(DataSource):
    """Implementación concreta para archivos CSV."""
    def __init__(self, ruta):
        self.ruta = ruta

    def leer(self, query):
        print(f"Leyendo CSV {self.ruta} con query: {query}")
        return [{"fila": 1, "valor": 100}]

    def escribir(self, data):
        print(f"Guardando en CSV {self.ruta}")
        return True

class SQLSource(DataSource):
    """Implementación concreta para bases SQL."""
    def __init__(self, connection_string):
        self.conn_str = connection_string

    def leer(self, query):
        print(f"Ejecutando SQL: {query}")
        return [{"id": 1, "nombre": "Ana"}]

    def escribir(self, data):
        print(f"INSERT INTO ... ")
        return True

# Polimorfismo con ABC
def migrar_datos(origen: DataSource, destino: DataSource, query: str):
    """Migra datos entre dos fuentes cuales."""
    data = origen.leer(query)
    destino.escribir(data)

csv_src = CSVSource("data.csv")
sql_src = SQLSource("postgresql://localhost/db")

# Misma función, diferentes comportamientos
migrar_datos(csv_src, sql_src, "SELECT * FROM ventas")
# Leyendo CSV data.csv con query: SELECT * FROM ventas
# INSERT INTO ...`,
      },
      callout: {
        type: 'tip',
        title: 'Cuándo usar herencia vs composición',
        content:
          'Herencia: cuando hay relación IS-A real y la hija es sustituible por el padre (Liskov). Ej: Perro IS-A Animal. Composición: cuando hay relación HAS-A o "usa un". Ej: Auto HAS-A Motor. Si dudas, usa composición — es más flexible.',
      },
    },
  ],
  iDo: {
    intro:
      'Vamos a construir juntos una clase DataPipeline que modele un pipeline de ML real — la estructura exacta que verás en producción. La clase base tiene load/clean/transform, y una subclase ModelTrainer extiende con train/evaluate. Es el patrón que usa scikit-learn internamente.',
    steps: [
      {
        description: 'Implementar DataPipeline con encapsulamiento y dunder methods',
        code: {
          language: 'python',
          title: 'ml_pipeline.py',
          code: `import pandas as pd
import numpy as np
from pathlib import Path

class DataPipeline:
    """
    Pipeline base para procesamiento de datos.
    Inspirado en sklearn.base.BaseEstimator.
    """

    def __init__(self, filepath, target_column=None):
        self.filepath = Path(filepath)
        self.target_column = target_column
        self._data = None        # protegido
        self._X_train = None
        self._X_test = None
        self._y_train = None
        self._y_test = None
        self._is_fitted = False  # flag interno

    def load(self):
        """Carga datos desde CSV."""
        if not self.filepath.exists():
            raise FileNotFoundError(f"Archivo no encontrado: {self.filepath}")
        self._data = pd.read_csv(self.filepath)
        print(f"✓ Cargados {len(self._data)} registros de {self.filepath.name}")
        return self

    def clean(self):
        """Limpia datos: nulos, duplicados, tipos."""
        if self._data is None:
            raise RuntimeError("Llama load() primero")
        n_before = len(self._data)
        self._data = self._data.drop_duplicates()
        self._data = self._data.dropna()
        n_after = len(self._data)
        print(f"✓ Limpieza: {n_before - n_after} filas removidas")
        return self

    def transform(self):
        """Separa features y target."""
        if self._data is None:
            raise RuntimeError("Llama load() y clean() primero")
        if self.target_column and self.target_column in self._data.columns:
            X = self._data.drop(columns=[self.target_column])
            y = self._data[self.target_column]
        else:
            X = self._data
            y = None
        self._X = X
        self._y = y
        print(f"✓ Transform: X shape={X.shape}")
        return self

    def summary(self):
        """Imprime resumen del dataset."""
        if self._data is None:
            return "Pipeline vacío. Llama load() primero."
        info = {
            "shape": self._data.shape,
            "dtypes": self._data.dtypes.value_counts().to_dict(),
            "nulls": self._data.isnull().sum().sum()
        }
        return info

    def __repr__(self):
        """Representación técnica."""
        return f"DataPipeline(filepath={str(self.filepath)!r}, target={self.target_column!r})"

    def __str__(self):
        """Representación legible."""
        if self._data is not None:
            return f"DataPipeline con {len(self._data)} registros de {self.filepath.name}"
        return f"DataPipeline vacío (file: {self.filepath.name})"`,
        },
        why: 'Esta clase demuestra los patrones profesionales: (1) `_data` protegido para indicar que no se debe tocar directamente, (2) `__repr__` y `__str__` implementados, (3) methods que devuelven `self` para method chaining (`pipeline.load().clean().transform()`), (4) validación de estado (raise RuntimeError si llamas transform antes que load).',
      },
      {
        description: 'Crear subclase ModelTrainer que extiende DataPipeline',
        code: {
          language: 'python',
          title: 'ml_pipeline.py',
          code: `from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report

class ModelTrainer(DataPipeline):
    """
    Extiende DataPipeline con capacidad de entrenar modelos.
    Hereda load(), clean(), transform() del padre.
    """

    def __init__(self, filepath, target_column, model=None):
        # Llamar al constructor del padre
        super().__init__(filepath, target_column)
        self.model = model or LogisticRegression(random_state=42)
        self._metrics = None

    def split(self, test_size=0.2, random_state=42):
        """Divide en train/test."""
        if self._X is None or self._y is None:
            raise RuntimeError("Llama load().clean().transform() primero")
        self._X_train, self._X_test, self._y_train, self._y_test = train_test_split(
            self._X, self._y, test_size=test_size, random_state=random_state
        )
        print(f"✓ Split: train={self._X_train.shape}, test={self._X_test.shape}")
        return self

    def train(self):
        """Entrena el modelo."""
        if self._X_train is None:
            raise RuntimeError("Llama split() primero")
        # Manejar solo columnas numéricas para este ejemplo simple
        X_train_num = self._X_train.select_dtypes(include=[np.number])
        X_test_num = self._X_test.select_dtypes(include=[np.number])

        self.model.fit(X_train_num, self._y_train)
        self._is_fitted = True
        print(f"✓ Modelo entrenado: {type(self.model).__name__}")
        return self

    def evaluate(self):
        """Evalúa y devuelve métricas."""
        if not self._is_fitted:
            raise RuntimeError("Llama train() primero")
        X_test_num = self._X_test.select_dtypes(include=[np.number])
        y_pred = self.model.predict(X_test_num)
        self._metrics = {
            "accuracy": accuracy_score(self._y_test, y_pred),
            "model": type(self.model).__name__,
            "n_features": X_test_num.shape[1]
        }
        return self._metrics

    def __str__(self):
        """Override del padre."""
        if self._is_fitted and self._metrics:
            return f"ModelTrainer: {type(self.model).__name__}, accuracy={self._metrics['accuracy']:.3f}"
        return f"ModelTrainer: {type(self.model).__name__} (no entrenado)"

# === USO DEL PIPELINE COMPLETO ===
# Crear datos sintéticos
import pandas as pd
np.random.seed(42)
n = 200
data = pd.DataFrame({
    "edad": np.random.randint(18, 70, n),
    "ingreso": np.random.randint(1500, 8000, n),
    "score": np.random.randint(300, 850, n),
    "default": np.random.choice([0, 1], n, p=[0.7, 0.3])
})
data.to_csv("credit_data.csv", index=False)

# Usar el pipeline completo
trainer = ModelTrainer("credit_data.csv", target_column="default")
print(repr(trainer))   # DataPipeline(filepath='credit_data.csv', target='default')

# Method chaining gracias a que cada método devuelve self
trainer.load().clean().transform().split().train()
metrics = trainer.evaluate()

print(str(trainer))    # ModelTrainer: LogisticRegression, accuracy=0.775
print(f"\\nMétricas: {metrics}")`,
          output: `DataPipeline(filepath='credit_data.csv', target='default')
✓ Cargados 200 registros de credit_data.csv
✓ Limpieza: 0 filas removidas
✓ Transform: X shape=(200, 3)
✓ Split: train=(160, 3), test=(40, 3)
✓ Modelo entrenado: LogisticRegression
ModelTrainer: LogisticRegression, accuracy=0.775

Métricas: {'accuracy': 0.775, 'model': 'LogisticRegression', 'n_features': 3}`,
        },
        why: 'Este patrón (BaseEstimator + subclases) es EXACTAMENTE lo que hace scikit-learn. Cuando entiendes esta estructura, puedes leer el código fuente de sklearn y entender qué hacen BaseEstimator, ClassifierMixin, TransformerMixin. También puedes crear transformers custom para tu ColumnTransformer — una tarea común en puestos mid-level de ML.',
      },
    ],
  },
  weDo: {
    intro:
      'Ahora practicamos creando una clase Dataset personalizada. Vas a modelar un dataset con operaciones de limpieza y exportación. Es el tipo de abstracción que vale oro cuando trabajas con múltiples datasets similares.',
    steps: [
      {
        instruction: 'Crea una clase Dataset con __init__, __len__, __repr__ y métodos load/save',
        hint: 'Usa pandas internamente. __len__ devuelve número de filas. __repr__ muestra nombre y shape. load lee CSV, save escribe CSV.',
        starterCode: {
          language: 'python',
          title: 'dataset.py',
          code: `import pandas as pd
from pathlib import Path

class Dataset:
    """Abstracción sobre un dataset tabular."""

    def __init__(self, nombre, filepath=None):
        # TODO: inicializar atributos
        pass

    def __len__(self):
        """Devuelve número de filas."""
        # TODO
        pass

    def __repr__(self):
        """Representación técnica."""
        # TODO
        pass

    def load(self):
        """Carga desde CSV."""
        # TODO
        pass

    def save(self, filepath=None):
        """Guarda a CSV."""
        # TODO
        pass`,
        },
        solutionCode: {
          language: 'python',
          title: 'dataset.py',
          code: `import pandas as pd
from pathlib import Path

class Dataset:
    """Abstracción sobre un dataset tabular."""

    def __init__(self, nombre, filepath=None):
        self.nombre = nombre
        self.filepath = Path(filepath) if filepath else None
        self._df = None

    def __len__(self):
        """Devuelve número de filas."""
        if self._df is None:
            return 0
        return len(self._df)

    def __repr__(self):
        if self._df is not None:
            return f"Dataset('{self.nombre}', shape={self._df.shape})"
        return f"Dataset('{self.nombre}', vacío)"

    def __str__(self):
        if self._df is not None:
            return f"Dataset '{self.nombre}': {len(self)} filas, {self._df.shape[1]} columnas"
        return f"Dataset '{self.nombre}' (sin cargar)"

    def load(self):
        """Carga desde CSV."""
        if not self.filepath or not self.filepath.exists():
            raise FileNotFoundError(f"Archivo no encontrado: {self.filepath}")
        self._df = pd.read_csv(self.filepath)
        print(f"✓ Cargados {len(self)} registros en '{self.nombre}'")
        return self

    def save(self, filepath=None):
        """Guarda a CSV."""
        if self._df is None:
            raise RuntimeError("Dataset vacío, nada que guardar")
        path = Path(filepath) if filepath else self.filepath
        self._df.to_csv(path, index=False)
        print(f"✓ Guardado en {path}")
        return self

    @property
    def df(self):
        """Acceso read-only al DataFrame."""
        return self._df

# Test
import pandas as pd
df_test = pd.DataFrame({"a": [1, 2, 3], "b": [4, 5, 6]})
df_test.to_csv("test_ds.csv", index=False)

ds = Dataset("prueba", "test_ds.csv")
print(repr(ds))   # Dataset('prueba', vacío)
ds.load()
print(repr(ds))   # Dataset('prueba', shape=(3, 2))
print(len(ds))    # 3
print(str(ds))    # Dataset 'prueba': 3 filas, 2 columnas`,
          output: `Dataset('prueba', vacío)
✓ Cargados 3 registros en 'prueba'
Dataset('prueba', shape=(3, 2))
3
Dataset 'prueba': 3 filas, 2 columnas`,
        },
      },
    ],
  },
  youDo: {
    title: 'Custom ML Pipeline Class — Proyecto OOP de portafolio',
    context:
      'Vas a construir un mini-framework de ML con OOP. La clase DataPipeline con load/clean/transform/summary, y una subclase ModelTrainer con train/evaluate. Es el mismo patrón que scikit-learn internamente — si lo entiendes, puedes leer y extender sklearn. Esto es lo que te piden en entrevistas técnicas mid-level.',
    objectives: [
      'Implementar DataPipeline con métodos load, clean, transform, summary',
      'Implementar ModelTrainer(DataPipeline) con train, evaluate',
      'Usar dunders: __init__, __repr__, __str__',
      'Encapsulamiento con _atributos protegidos',
      'Method chaining (cada método devuelve self)',
      'Validación de estado con RuntimeError si llamas métodos en orden incorrecto',
    ],
    requirements: [
      'Clase DataPipeline con __init__(filepath, target_column)',
      'Atributos protegidos: _data, _X, _y, _is_fitted',
      'Métodos: load(), clean(), transform(), summary()',
      'Subclase ModelTrainer(DataPipeline) con super().__init__',
      'Métodos en ModelTrainer: split(), train(), evaluate()',
      '__repr__ técnico (reconstruible) y __str__ legible',
      'Method chaining: trainer.load().clean().transform().split().train()',
      'README explicando el patrón BaseEstimator',
    ],
    starterCode: `import pandas as pd
import numpy as np
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

class DataPipeline:
    """Pipeline base para datos."""
    # TODO: implementar
    pass

class ModelTrainer(DataPipeline):
    """Extiende DataPipeline con ML."""
    # TODO: implementar
    pass

if __name__ == "__main__":
    # Demo con datos sintéticos
    pass`,
    portfolioNote:
      'En el README, menciona explícitamente que esta es una réplica simplificada del patrón sklearn.base.BaseEstimator. En entrevistas, explica la relación IS-A (ModelTrainer IS-A DataPipeline) y cómo el method chaining mejora la legibilidad del pipeline.',
    rubric: [
      { criterion: 'DataPipeline con load/clean/transform/summary', weight: '25%' },
      { criterion: 'ModelTrainer hereda correctamente con super()', weight: '20%' },
      { criterion: 'Dunders __repr__ y __str__ implementados correctamente', weight: '15%' },
      { criterion: 'Method chaining funciona (devuelven self)', weight: '15%' },
      { criterion: 'Validación de estado con RuntimeError', weight: '15%' },
      { criterion: 'README profesional explicando el patrón', weight: '10%' },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: '¿Cuál es la diferencia entre `__str__` y `__repr__`?',
        options: [
          'Son lo mismo, solo alias',
          '__str__ es para usuarios (legible), __repr__ es para developers (reconstruible)',
          '__str__ es más rápido, __repr__ más detallado',
          '__str__ solo funciona con strings, __repr__ con cualquier tipo',
        ],
        correctIndex: 1,
        explanation:
          '__str__ debe devolver algo legible para un usuario final. __repr__ debe devolver una representación técnica, idealmente `eval(repr(obj)) == obj`. Si solo implementas uno, implementa __repr__ (Python lo usa como fallback de __str__).',
      },
      {
        question: '¿Para qué sirve `super().__init__(...)` en una subclase?',
        options: [
          'Para crear una instancia del padre sin inicializar',
          'Para llamar al constructor de la clase padre desde la subclase',
          'Para evitar tener que definir __init__ en la subclase',
          'Para hacer la subclase más rápida',
        ],
        correctIndex: 1,
        explanation:
          '`super().__init__(...)` llama al constructor de la clase padre. Esto asegura que la parte heredada del objeto se inicialice correctamente antes de agregar la lógica específica de la subclase.',
      },
      {
        question: '¿Qué significa la convención `_atributo` (un underscore) en Python?',
        options: [
          'Es privado de verdad, no se puede acceder',
          'Es "protegido" — convención de no tocar desde fuera, pero accesible',
          'Es lo mismo que __atributo (dos underscores)',
          'Indica que es un método mágico',
        ],
        correctIndex: 1,
        explanation:
          'Un underscore es CONVENCIÓN: "no deberías tocar esto desde fuera, es interno". Pero Python no lo prohíbe. Dos underscores (__) aplican name-mangling, dificultando el acceso pero no impidiéndolo totalmente. Python confía en el desarrollador.',
      },
      {
        question: '¿Cuándo usar composición en vez de herencia?',
        options: [
          'Siempre, la herencia es mala práctica',
          'Cuando la relación es HAS-A (tiene un) en vez de IS-A (es un)',
          'Nunca, la composición es más lenta',
          'Solo cuando la clase padre es abstracta',
        ],
        correctIndex: 1,
        explanation:
          'La regla: IS-A → herencia (Perro IS-A Animal). HAS-A → composición (Auto HAS-A Motor). La composición es más flexible porque puedes cambiar componentes sin romper jerarquías. Cuando dudes, usa composición.',
      },
      {
        question: '¿Qué hace `@abstractmethod` en una Abstract Base Class?',
        options: [
          'Hace el método más rápido',
          'Define un método que DEBE ser implementado por subclases; la ABC no se puede instanciar',
          'Permite que el método sea estático',
          'Es lo mismo que @staticmethod',
        ],
        correctIndex: 1,
        explanation:
          '@abstractmethod marca un método como contrato: las subclases concretas deben implementarlo. Si intentas instanciar la ABC directamente (sin implementar todos los abstract methods), Python lanza TypeError.',
      },
    ],
  },
  resources: {
    docs: [
      { label: 'Python — Classes tutorial', url: 'https://docs.python.org/3/tutorial/classes.html', note: 'Tutorial oficial de OOP en Python' },
      { label: 'Real Python — OOP', url: 'https://realpython.com/python3-object-oriented-programming/', note: 'Guía completa de OOP' },
      { label: 'sklearn.base — Source code', url: 'https://github.com/scikit-learn/scikit-learn/blob/main/sklearn/base.py', note: 'Lee el código fuente para ver el patrón real' },
      { label: 'Python — abc module', url: 'https://docs.python.org/3/library/abc.html', note: 'Abstract Base Classes oficiales' },
    ],
    books: [
      { label: 'Python Apprentice to Master', note: 'Capítulos extensos sobre OOP avanzado: metaclasses, descriptors, abstract classes.' },
      { label: 'python201', note: 'Capítulo sobre dunder methods y protocolos de Python.' },
    ],
    courses: [
      { label: 'Real Python — OOP Courses', url: 'https://realpython.com/courses/intro-object-oriented-programming-oop-python/', note: 'Cursos interactivos de OOP' },
    ],
  },
}
