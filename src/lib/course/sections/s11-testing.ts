import type { CourseSection } from '../../types'

export const section11: CourseSection = {
  id: 'testing',
  index: 11,
  title: 'Testing Your Python Code',
  shortTitle: 'Testing',
  tagline: 'pytest, fixtures, coverage y CI con GitHub Actions — el diferenciador senior',
  estimatedHours: 6,
  level: 'Avanzado',
  phase: 0,
  icon: 'ShieldCheck',
  accentColor: 'bg-gradient-to-br from-cyan-500 to-blue-600',
  jobRelevance:
    'Testing es lo que diferencia un junior de un senior a ojos de hiring managers. Un repo con tests + badge verde de CI dice "este developer es serio". En LATAM, donde la mayoría no hace tests, tener GitHub Actions con pytest-cov te posiciona como US-trained. Las empresas serias (Rimac, Interbank, Mercado Libre) exigen tests para merges a main. Sin tests, tu código no es production-ready.',
  learningOutcomes: [
    { text: 'Escribir tests con pytest: assert, funciones test_, archivos test_*.py' },
    { text: 'Usar fixtures (@pytest.fixture) para setup/teardown reutilizable' },
    { text: 'Parametrizar tests con @pytest.mark.parametrize' },
    { text: 'Testear DataFrames: shape, dtypes, nulls, rangos' },
    { text: 'Testear ML pipelines: output shape, no NaN, valid ranges' },
    { text: 'Medir cobertura con pytest-cov' },
    { text: 'Configurar GitHub Actions CI con badge en README' },
  ],
  theory: [
    {
      heading: 'Filosofía de testing — por qué y qué testear',
      paragraphs: [
        'El testing automático es la red de seguridad que te permite refactorizar y agregar features sin miedo. Sin tests, cada cambio es una lotería: "¿rompí algo?". Con tests, corres `pytest` antes de cada commit y sabes en 30 segundos si algo se rompió. El miedo a modificar código legacy (que paraliza equipos) viene de falta de tests.',
        'La pirámide de tests: (1) Unit tests (muchos, rápidos, aislados), (2) Integration tests (algunos, medianos, prueban combinaciones), (3) E2E tests (pocos, lentos, prueban flujos completos). Para data science, los unit tests son sobre funciones de transformación, los integration tests sobre pipelines completos. E2E casi no se usa salvo en productos con UI.',
        'Qué testear: (1) funciones puras (entradas → salidas sin side effects), (2) edge cases (input vacío, null, valores extremos), (3) invariantes (propiedades que siempre deben cumplirse, como "predicciones entre 0 y 1"). Qué NO testear: (1) librerías externas (confía en sus tests), (2) output exacto de números aleatorios (usa seed), (3) implementación interna (testea comportamiento, no código).',
      ],
      callout: {
        type: 'info',
        title: 'TDD vs Test-After',
        content:
          'TDD (Test-Driven Development): escribes el test primero, luego el código. Ideal para bugs conocidos y algoritmos complejos. Test-After: escribes código, luego tests. Más común en data science. Ambos son válidos — lo importante es que EXISTAN tests. No dogmatizes sobre TDD.',
      },
    },
    {
      heading: 'pytest — el estándar de testing en Python',
      paragraphs: [
        'pytest es el framework de testing más usado en Python. Más simple que unittest (built-in), más poderoso, con mejor output. Instalación: `pip install pytest pytest-cov`. Para correr tests: `pytest` (corre todos los test_*.py), `pytest test_file.py::test_function` (uno específico), `pytest -v` (verbose), `pytest --cov=mi_modulo` (cobertura).',
        'Convenciones obligatorias: (1) archivos de test se llaman `test_*.py` o `*_test.py`, (2) funciones de test se llaman `test_*`, (3) clases de test se llaman `Test*` (sin __init__). pytest automáticamente descubre estos nombres. Si no los respetas, tus tests no corren.',
        'El assert de pytest es mágico: si fallas, te muestra el diff exacto. `assert resultado == esperado` muestra "5 != 7" con colores. No necesitas self.assertEqual como en unittest. Para chequear excepciones: `with pytest.raises(ValueError): mi_funcion()`. Para warnings: `pytest.warns(UserWarning)`.',
      ],
      code: {
        language: 'python',
        title: 'test_calculadora.py',
        code: `# Archivo: calculadora.py
def sumar(a, b):
    return a + b

def dividir(a, b):
    if b == 0:
        raise ValueError("No se puede dividir por cero")
    return a / b

def es_par(n):
    return n % 2 == 0

# Archivo: test_calculadora.py
import pytest
from calculadora import sumar, dividir, es_par

# Test básico
def test_sumar():
    assert sumar(2, 3) == 5
    assert sumar(-1, 1) == 0
    assert sumar(0, 0) == 0

# Test con excepciones
def test_dividir_por_cero():
    with pytest.raises(ValueError, match="No se puede dividir por cero"):
        dividir(10, 0)

def test_dividir_normal():
    assert dividir(10, 2) == 5
    assert dividir(9, 3) == 3

# Test parametrizado (corre el mismo test con múltiples inputs)
@pytest.mark.parametrize("input, esperado", [
    (2, True),
    (4, True),
    (3, False),
    (0, True),    # 0 es par
    (-2, True),   # negativos también
    (-3, False),
])
def test_es_par(input, esperado):
    assert es_par(input) == esperado

# Test de edge cases
def test_sumar_tipos():
    # pytest te dice exactamente qué falló
    assert sumar(2.5, 1.5) == 4.0
    assert sumar("hola, ", "mundo") == "hola, mundo"

# Correr: pytest test_calculadora.py -v
# Output:
# test_calculadora.py::test_sumar PASSED
# test_calculadora.py::test_dividir_por_cero PASSED
# test_calculadora.py::test_es_par[2-True] PASSED
# test_calculadora.py::test_es_par[3-False] PASSED
# ...`,
      },
    },
    {
      heading: 'Fixtures — setup/teardown reutilizable',
      paragraphs: [
        'Las fixtures son funciones que preparan datos o estado para tus tests. Se definen con `@pytest.fixture` y se inyectan como parámetros. Ejemplo: si 5 tests necesitan un DataFrame de prueba, en vez de crearlo en cada uno, defines una fixture `df_prueba` que lo crea una vez (por defecto, scope=function). Esto reduce duplicación y hace tests más legibles.',
        'Los scopes controlan cuándo se crea la fixture: `function` (default, una vez por test), `class` (una vez por clase), `module` (una vez por archivo), `session` (una vez por toda la sesión). Para datos costosos de crear (conexiones DB, modelos ML), usa scope="session" para reutilizar. Para datos mutables, usa function para evitar side effects entre tests.',
        'Para cleanup (teardown), usa `yield` en vez de `return`. El código antes de yield es el setup, el código después es el teardown (se ejecuta siempre, incluso si el test falla). Útil para cerrar conexiones, borrar archivos temporales, restaurar estado global.',
      ],
      code: {
        language: 'python',
        title: 'test_con_fixtures.py',
        code: `import pytest
import pandas as pd
import numpy as np
from pathlib import Path
import tempfile

# === FIXTURES ===

@pytest.fixture
def df_ventas():
    """DataFrame de muestra para tests."""
    return pd.DataFrame({
        "producto": ["arroz", "aceite", "azucar"],
        "cantidad": [10, 5, 8],
        "precio": [4.5, 12.0, 3.8],
        "region": ["Lima", "Lima", "Arequipa"]
    })

@pytest.fixture
def df_con_nulos():
    """DataFrame con valores nulos para tests de limpieza."""
    return pd.DataFrame({
        "a": [1, 2, np.nan, 4],
        "b": ["x", np.nan, "z", "w"],
        "c": [1.5, np.nan, np.nan, 4.5]
    })

@pytest.fixture(scope="session")
def temp_dir():
    """Directorio temporal persistente para toda la sesión."""
    with tempfile.TemporaryDirectory() as tmpdir:
        yield Path(tmpdir)

# === TESTS que usan fixtures ===

def test_df_ventas_tiene_3_filas(df_ventas):
    assert len(df_ventas) == 3

def test_df_ventas_columnas(df_ventas):
    expected_cols = {"producto", "cantidad", "precio", "region"}
    assert set(df_ventas.columns) == expected_cols

def test_df_ventas_tipos(df_ventas):
    assert df_ventas["cantidad"].dtype in [int, np.int64]
    assert df_ventas["precio"].dtype in [float, np.float64]
    assert df_ventas["producto"].dtype == object

def test_no_nulos_despues_de_limpieza(df_con_nulos):
    """Test que verifica que la limpieza elimina nulos."""
    # Simular función de limpieza
    df_limpio = df_con_nulos.dropna()
    assert df_limpio.isnull().sum().sum() == 0
    assert len(df_limpio) == 1  # solo la última fila no tiene nulos

def test_calculo_total(df_ventas):
    """Verifica que el cálculo de total es correcto."""
    df_ventas["total"] = df_ventas["cantidad"] * df_ventas["precio"]
    expected_totals = [45.0, 60.0, 30.4]
    assert df_ventas["total"].tolist() == expected_totals

# === FIXTURE con yield (teardown) ===
@pytest.fixture
def archivo_temporal():
    """Crea archivo temporal y lo elimina después."""
    p = Path("temp_test.csv")
    p.write_text("a,b\\n1,2\\n3,4")
    yield p  # el test recibe el path
    # Teardown: se ejecuta siempre
    if p.exists():
        p.unlink()

def test_leer_archivo(archivo_temporal):
    import pandas as pd
    df = pd.read_csv(archivo_temporal)
    assert len(df) == 2
    assert list(df.columns) == ["a", "b"]`,
      },
    },
    {
      heading: 'Testing DataFrames y ML pipelines — el caso de data science',
      paragraphs: [
        'En data science, los tests verifican propiedades de los datos y del pipeline, no outputs exactos. Patrones útiles: (1) **Shape**: `assert df.shape == (100, 5)`, (2) **No nulos después de limpieza**: `assert df.isnull().sum().sum() == 0`, (3) **Tipos correctos**: `assert df["col"].dtype == int`, (4) **Rangos válidos**: `assert df["edad"].between(0, 120).all()`, (5) **No duplicados**: `assert df.duplicated().sum() == 0`.',
        'Para ML pipelines, los tests críticos: (1) **Output shape**: `assert predictions.shape[0] == X_test.shape[0]`, (2) **No NaN en predicciones**: `assert not np.isnan(predictions).any()`, (3) **Rangos válidos**: `assert (predictions >= 0).all() and (predictions <= 1).all()` para clasificación, (4) **No data leakage**: `assert len(set(train_idx) & set(test_idx)) == 0`, (5) **Determinismo con seed**: correr 2 veces y verificar same output.',
        'Para testear funciones que dependen de APIs externas o DBs, usa `monkeypatch` (pytest built-in) para mock. `monkeypatch.setattr(mi_modulo, "fetch_data", mock_fetch)`. Esto reemplaza la función real por un mock durante el test. Para datos, guarda archivos de muestra en `tests/fixtures/` y cárgalos en tus fixtures.',
      ],
      code: {
        language: 'python',
        title: 'test_pipeline.py',
        code: `import pytest
import pandas as pd
import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

# === DATOS DE TEST ===
@pytest.fixture
def X_y():
    """Dataset pequeño y determinístico para tests."""
    np.random.seed(42)
    X = np.random.randn(100, 5)
    y = (X[:, 0] > 0).astype(int)  # y depende de primera feature
    return X, y

@pytest.fixture
def df_clientes():
    """DataFrame con propiedades conocidas para tests."""
    return pd.DataFrame({
        "cliente_id": range(1, 101),
        "edad": np.random.randint(18, 80, 100),
        "ingreso": np.random.randint(1500, 8000, 100),
        "churn": np.random.choice([0, 1], 100, p=[0.8, 0.2])
    })

# === TESTS DE DATAFRAME ===

def test_df_shape(df_clientes):
    assert df_clientes.shape == (100, 4)

def test_df_no_duplicados(df_clientes):
    assert df_clientes["cliente_id"].duplicated().sum() == 0

def test_df_rangos(df_clientes):
    assert df_clientes["edad"].between(18, 80).all()
    assert df_clientes["ingreso"].between(1500, 8000).all()

def test_df_no_nulos(df_clientes):
    assert df_clientes.isnull().sum().sum() == 0

def test_df_tipos(df_clientes):
    assert df_clientes["cliente_id"].dtype in [int, np.int64]
    assert df_clientes["churn"].dtype in [int, np.int64]
    assert set(df_clientes["churn"].unique()) == {0, 1}

# === TESTS DE ML PIPELINE ===

def test_modelo_aprende(X_y):
    """El modelo debe predecir mejor que azar."""
    X, y = X_y
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = LogisticRegression(random_state=42)
    model.fit(X_train, y_train)
    accuracy = model.score(X_test, y_test)
    # Debe ser significativamente mejor que 0.5 (azar)
    assert accuracy > 0.7, f"Accuracy {accuracy} no supera 0.7"

def test_predicciones_shape(X_y):
    """Las predicciones deben tener el shape correcto."""
    X, y = X_y
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = LogisticRegression(random_state=42)
    model.fit(X_train, y_train)
    preds = model.predict(X_test)
    assert preds.shape[0] == X_test.shape[0]
    assert preds.shape[1] == 1 if preds.ndim > 1 else True

def test_probabilidades_en_rango(X_y):
    """Las probabilidades deben estar entre 0 y 1."""
    X, y = X_y
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = LogisticRegression(random_state=42)
    model.fit(X_train, y_train)
    probas = model.predict_proba(X_test)
    assert (probas >= 0).all() and (probas <= 1).all()
    assert np.allclose(probas.sum(axis=1), 1.0)  # suman 1

def test_no_data_leakage(X_y):
    """Train y test no deben tener índices en común."""
    X, y = X_y
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    train_idx = set(range(len(X_train)))
    test_idx = set(range(len(X_train), len(X)))
    # Como sklearn usa índices, no hay superposición
    assert len(train_idx & test_idx) == 0

def test_modelo_determinista(X_y):
    """Con mismo seed, el modelo debe dar mismos resultados."""
    X, y = X_y
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model1 = LogisticRegression(random_state=42)
    model1.fit(X_train, y_train)

    model2 = LogisticRegression(random_state=42)
    model2.fit(X_train, y_train)

    np.testing.assert_array_almost_equal(
        model1.predict_proba(X_test),
        model2.predict_proba(X_test)
    )`,
      },
    },
    {
      heading: 'Coverage y GitHub Actions — CI/CD profesional',
      paragraphs: [
        'Coverage mide qué porcentaje de tu código está cubierto por tests. `pip install pytest-cov` y corres `pytest --cov=mi_modulo --cov-report=term-missing`. El reporte muestra por archivo: total de statements, cubiertos, no cubiertos, y % cobertura. Idealmente buscas >80% en código crítico. No persigas 100% — algunos paths (error handling de errores irreproducibles) no vale la pena testear.',
        'GitHub Actions es el CI más usado. Creas `.github/workflows/tests.yml` y en cada push/PR, GitHub corre tus tests en un entorno limpio. Si pasan, badge verde en tu README. Si fallan, badge rojo y no se permite merge (si configuras branch protection). Esto es lo que más posiciona a un LATAM dev como senior — un repo con badge verde dice "esto funciona, está probado".',
        'El workflow mínimo: checkout del código, setup Python, instalar requirements, correr pytest con coverage. Configuración típica: matrix de Python 3.10, 3.11, 3.12; cache de pip para acelerar; upload de coverage report como artefacto. Con 30 líneas de YAML tienes CI profesional.',
      ],
      code: {
        language: 'yaml',
        title: '.github/workflows/tests.yml',
        code: `name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ['3.11', '3.12']

    steps:
    - uses: actions/checkout@v4

    - name: Set up Python \${{ matrix.python-version }}
      uses: actions/setup-python@v5
      with:
        python-version: \${{ matrix.python-version }}

    - name: Cache pip
      uses: actions/cache@v4
      with:
        path: ~/.cache/pip
        key: \${{ runner.os }}-pip-\${{ hashFiles('requirements.txt') }}

    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
        pip install pytest pytest-cov

    - name: Run tests with coverage
      run: |
        pytest --cov=src --cov-report=xml --cov-report=term-missing

    - name: Upload coverage
      uses: codecov/codecov-action@v4
      with:
        file: ./coverage.xml
        fail_ci_if_error: false

# === BADGE en README.md ===
# Agrega esta línea al inicio del README:
# ![Tests](https://github.com/USUARIO/REPO/actions/workflows/tests.yml/badge.svg)
# Esto muestra un badge verde (passing) o rojo (failing) que se actualiza solo.`,
      },
    },
  ],
  iDo: {
    intro:
      'Vamos a construir juntos una suite de tests completa para el pipeline de churn de la sección 9. Tests de datos, tests de modelo, tests de edge cases. Es exactamente el tipo de suite de tests que esperarían en un proyecto de producción.',
    steps: [
      {
        description: 'Crear tests para carga y validación de datos',
        code: {
          language: 'python',
          title: 'tests/test_data.py',
          code: `# tests/test_data.py
import pytest
import pandas as pd
import numpy as np
from pathlib import Path

@pytest.fixture
def df_churn():
    """Dataset churn de muestra."""
    np.random.seed(42)
    return pd.DataFrame({
        "cliente_id": range(1, 101),
        "edad": np.random.randint(18, 80, 100),
        "ingreso_mensual": np.random.randint(1500, 8000, 100),
        "meses_antiguedad": np.random.randint(1, 72, 100),
        "region": np.random.choice(["Lima", "Arequipa", "Cusco"], 100),
        "churn": np.random.choice([0, 1], 100, p=[0.7, 0.3])
    })

# === TESTS DE ESTRUCTURA ===

def test_shape_correcto(df_churn):
    """El dataset debe tener 100 filas y 6 columnas."""
    assert df_churn.shape == (100, 6)

def test_columnas_esperadas(df_churn):
    """Todas las columnas requeridas deben estar presentes."""
    expected = {"cliente_id", "edad", "ingreso_mensual",
                "meses_antiguedad", "region", "churn"}
    assert set(df_churn.columns) == expected

def test_no_nulos(df_churn):
    """No debe haber valores nulos."""
    assert df_churn.isnull().sum().sum() == 0

def test_no_duplicados(df_churn):
    """cliente_id debe ser único."""
    assert df_churn["cliente_id"].duplicated().sum() == 0

# === TESTS DE RANGOS Y DOMINIOS ===

def test_edad_rango_valido(df_churn):
    """Edad debe estar entre 18 y 80."""
    assert df_churn["edad"].between(18, 80).all()

def test_ingreso_positivo(df_churn):
    """Ingreso debe ser positivo."""
    assert (df_churn["ingreso_mensual"] > 0).all()

def test_antiguedad_positiva(df_churn):
    """Meses de antiguedad deben ser positivos."""
    assert (df_churn["meses_antiguedad"] > 0).all()

def test_churn_binario(df_churn):
    """Churn debe ser 0 o 1."""
    assert set(df_churn["churn"].unique()).issubset({0, 1})

def test_regiones_validas(df_churn):
    """Las regiones deben ser del conjunto esperado."""
    valid_regions = {"Lima", "Arequipa", "Cusco"}
    assert set(df_churn["region"].unique()).issubset(valid_regions)

# === TESTS DE TIPOS ===

def test_tipos_numericos(df_churn):
    """Columnas numéricas deben tener tipo correcto."""
    assert df_churn["cliente_id"].dtype in [int, np.int64]
    assert df_churn["edad"].dtype in [int, np.int64]
    assert df_churn["ingreso_mensual"].dtype in [int, np.int64]

def test_tipo_churn(df_churn):
    assert df_churn["churn"].dtype in [int, np.int64]`,
        },
        why: 'Tests de datos son la primera línea de defensa. Si los datos de entrada están mal, todo lo demás falla. Los tests de estructura (shape, columnas, tipos) son rápidos y detectan problemas obvios. Los tests de rango y dominio detectan datos imposibles (edad 200, ingreso negativo) que arruinan modelos.',
      },
      {
        description: 'Crear tests para el pipeline de ML',
        code: {
          language: 'python',
          title: 'tests/test_pipeline.py',
          code: `# tests/test_pipeline.py
import pytest
import pandas as pd
import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score

@pytest.fixture
def pipeline_churn():
    """Pipeline completo de churn."""
    numeric_features = ["edad", "ingreso_mensual", "meses_antiguedad"]
    categorical_features = ["region"]

    preprocessor = ColumnTransformer([
        ("num", Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler())
        ]), numeric_features),
        ("cat", Pipeline([
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("onehot", OneHotEncoder(handle_unknown="ignore"))
        ]), categorical_features)
    ])

    return Pipeline([
        ("preprocessor", preprocessor),
        ("classifier", LogisticRegression(random_state=42, max_iter=1000))
    ])

@pytest.fixture
def datos_churn():
    """Datos de test sintéticos."""
    np.random.seed(42)
    n = 200
    X = pd.DataFrame({
        "edad": np.random.randint(18, 80, n),
        "ingreso_mensual": np.random.randint(1500, 8000, n),
        "meses_antiguedad": np.random.randint(1, 72, n),
        "region": np.random.choice(["Lima", "Arequipa", "Cusco"], n)
    })
    y = np.random.choice([0, 1], n, p=[0.7, 0.3])
    return X, y

# === TESTS DE PIPELINE ===

def test_pipeline_fit_predict(pipeline_churn, datos_churn):
    """Pipeline debe poder fittear y predecir."""
    X, y = datos_churn
    pipeline_churn.fit(X, y)
    preds = pipeline_churn.predict(X)
    assert len(preds) == len(y)

def test_predict_proba_rango(pipeline_churn, datos_churn):
    """Probabilidades deben estar entre 0 y 1."""
    X, y = datos_churn
    pipeline_churn.fit(X, y)
    probas = pipeline_churn.predict_proba(X)
    assert (probas >= 0).all() and (probas <= 1).all()
    assert np.allclose(probas.sum(axis=1), 1.0)

def test_no_nan_predicciones(pipeline_churn, datos_churn):
    """Predicciones no deben tener NaN."""
    X, y = datos_churn
    pipeline_churn.fit(X, y)
    preds = pipeline_churn.predict(X)
    probas = pipeline_churn.predict_proba(X)
    assert not np.isnan(preds).any()
    assert not np.isnan(probas).any()

def test_no_data_leakage(datos_churn):
    """Train y test no deben compartir índices."""
    X, y = datos_churn
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    train_indices = set(X_train.index)
    test_indices = set(X_test.index)
    assert len(train_indices & test_indices) == 0

def test_pipeline_determinista(pipeline_churn, datos_churn):
    """Con mismo seed, mismo resultado."""
    X, y = datos_churn
    pipeline_churn.fit(X, y)
    preds1 = pipeline_churn.predict(X)

    # Crear nuevo pipeline con mismo seed
    numeric_features = ["edad", "ingreso_mensual", "meses_antiguedad"]
    categorical_features = ["region"]
    preprocessor = ColumnTransformer([
        ("num", Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler())
        ]), numeric_features),
        ("cat", Pipeline([
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("onehot", OneHotEncoder(handle_unknown="ignore"))
        ]), categorical_features)
    ])
    pipeline2 = Pipeline([
        ("preprocessor", preprocessor),
        ("classifier", LogisticRegression(random_state=42, max_iter=1000))
    ])
    pipeline2.fit(X, y)
    preds2 = pipeline2.predict(X)

    np.testing.assert_array_equal(preds1, preds2)

def test_pipeline_maneja_nuevas_categorias(pipeline_churn, datos_churn):
    """Pipeline debe manejar categorías no vistas en training."""
    X, y = datos_churn
    pipeline_churn.fit(X, y)
    # Crear dato con región no vista
    nuevo = pd.DataFrame({
        "edad": [35],
        "ingreso_mensual": [3500],
        "meses_antiguedad": [12],
        "region": ["Piura"]  # nueva región
    })
    # No debe fallar
    pred = pipeline_churn.predict(nuevo)
    assert len(pred) == 1

def test_auc_mejor_que_azar(pipeline_churn, datos_churn):
    """El modelo debe predecir mejor que azar (AUC > 0.5)."""
    X, y = datos_churn
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.3, random_state=42, stratify=y
    )
    pipeline_churn.fit(X_train, y_train)
    probas = pipeline_churn.predict_proba(X_test)[:, 1]
    auc = roc_auc_score(y_test, probas)
    # En datos aleatorios, AUC ~0.5. Permitimos >= 0.4 (margen)
    assert auc >= 0.4, f"AUC {auc} muy bajo"`,
        },
        why: 'Estos tests validan invariantes del ML pipeline: output shape correcto, no NaN, rangos válidos, no leakage, determinismo, robustez a categorías nuevas. Si tu pipeline pasa estos tests, tienes alta confianza de que está bien construido. En producción, tests como estos detectan regresiones cuando actualizas scikit-learn o cambias el preprocesamiento.',
      },
    ],
  },
  weDo: {
    intro:
      'Te toca a ti escribir tests para una función simple de limpieza de datos. La función debe eliminar duplicados, imputar nulos con la mediana, y filtrar outliers.',
    steps: [
      {
        instruction: 'Escribe tests para una función limpiar_df() que limpia un DataFrame',
        hint: 'Test: no nulos después, no duplicados, rangos válidos, no falla con df vacío.',
        starterCode: {
          language: 'python',
          title: 'tests/test_limpieza.py',
          code: `import pytest
import pandas as pd
import numpy as np

# Función a testear (asume que existe)
def limpiar_df(df):
    """Limpia un DataFrame: dedup, fillna mediana, sin outliers."""
    df = df.drop_duplicates()
    df = df.fillna(df.median(numeric_only=True))
    # filtrar outliers con IQR
    for col in df.select_dtypes(include=np.number).columns:
        q1, q3 = df[col].quantile([0.25, 0.75])
        iqr = q3 - q1
        df = df[(df[col] >= q1 - 1.5*iqr) & (df[col] <= q3 + 1.5*iqr)]
    return df

# TODO: escribe al menos 4 tests
# 1. test_no_nulos_despues_de_limpieza
# 2. test_no_duplicados
# 3. test_df_vacio_no_falla
# 4. test_preserva_columnas`,
        },
        solutionCode: {
          language: 'python',
          title: 'tests/test_limpieza.py',
          code: `import pytest
import pandas as pd
import numpy as np

def limpiar_df(df):
    """Limpia un DataFrame: dedup, fillna mediana, sin outliers."""
    if df.empty:
        return df
    df = df.drop_duplicates()
    df = df.fillna(df.median(numeric_only=True))
    for col in df.select_dtypes(include=np.number).columns:
        q1, q3 = df[col].quantile([0.25, 0.75])
        iqr = q3 - q1
        df = df[(df[col] >= q1 - 1.5*iqr) & (df[col] <= q3 + 1.5*iqr)]
    return df

@pytest.fixture
def df_sucio():
    return pd.DataFrame({
        "edad": [25, 30, 25, np.nan, 35, 1000],  # dup, nan, outlier
        "ingreso": [3000, 3500, 3000, 4000, np.nan, 5000]
    })

def test_no_nulos_despues_de_limpieza(df_sucio):
    df_limpio = limpiar_df(df_sucio)
    assert df_limpio.isnull().sum().sum() == 0

def test_no_duplicados(df_sucio):
    df_limpio = limpiar_df(df_sucio)
    assert df_limpio.duplicated().sum() == 0

def test_df_vacio_no_falla():
    df_vacio = pd.DataFrame()
    df_limpio = limpiar_df(df_vacio)
    assert df_limpio.empty

def test_preserva_columnas(df_sucio):
    df_limpio = limpiar_df(df_sucio)
    assert set(df_limpio.columns) == set(df_sucio.columns)

def test_outlier_removido(df_sucio):
    """El valor 1000 debe ser removido como outlier."""
    df_limpio = limpiar_df(df_sucio)
    assert 1000 not in df_limpio["edad"].values`,
        },
      },
    ],
  },
  youDo: {
    title: 'Test Suite for Your Churn Project — El diferenciador senior',
    context:
      'Vas a agregar tests al proyecto capstone de churn (sección 9). Es lo que hace que tu repo pase de "proyecto de curso" a "proyecto production-ready". Un repo con tests + GitHub Actions con badge verde te posiciona como US-trained engineer a ojos de hiring managers peruanos e internacionales.',
    objectives: [
      'Crear tests/test_data.py con validaciones del dataset',
      'Crear tests/test_pipeline.py con tests del modelo',
      'Configurar GitHub Actions workflow para CI',
      'Agregar badge de tests al README',
      'Lograr coverage > 70% en código crítico',
    ],
    requirements: [
      'tests/test_data.py: shape, nulos, duplicados, rangos, tipos',
      'tests/test_pipeline.py: fit/predict, no NaN, no leakage, determinismo',
      'tests/test_model.py: AUC > azar, predicciones en rango',
      'GitHub Actions .github/workflows/tests.yml',
      'pytest --cov reportando cobertura',
      'Badge en README: ![Tests](https://github.com/...) .../badge.svg',
      'Al menos 15 tests en total',
    ],
    starterCode: `# tests/test_data.py
import pytest
import pandas as pd

def test_shape(df_churn):
    # TODO
    pass

def test_no_nulos(df_churn):
    # TODO
    pass

# ... al menos 5 tests más

# tests/test_pipeline.py
def test_pipeline_fit(pipeline_churn, datos):
    # TODO
    pass

# ... al menos 5 tests más

# .github/workflows/tests.yml
# Workflow que corre pytest en cada push`,
    portfolioNote:
      'En el README, junto al badge de tests, menciona el coverage %. "98% test coverage" es un statement poderoso que pocos candidatos pueden hacer. Los hiring managers saben que escribir tests requiere disciplina y pensamiento crítico sobre edge cases — exactamente lo que buscan en senior developers.',
    rubric: [
      { criterion: 'Tests de datos (shape, nulos, tipos, rangos)', weight: '25%' },
      { criterion: 'Tests de pipeline (fit, predict, no NaN, no leakage)', weight: '25%' },
      { criterion: 'GitHub Actions workflow funcionando', weight: '20%' },
      { criterion: 'Badge de tests visible en README', weight: '10%' },
      { criterion: 'Coverage reportado y > 70%', weight: '10%' },
      { criterion: 'Al menos 15 tests en total', weight: '10%' },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: '¿Cuál es la convención de nombres para que pytest descubra tus tests?',
        options: [
          'Cualquier archivo .py',
          'Archivos test_*.py con funciones test_*',
          'Solo en carpeta tests/',
          'Clases Test* con métodos test_*',
        ],
        correctIndex: 1,
        explanation:
          'pytest busca archivos que empiecen con test_ o terminen con _test.py, y dentro de ellos funciones que empiecen con test_. Las clases Test* (sin __init__) también se descubren. Respetar esta convención es obligatorio para que tus tests corran.',
      },
      {
        question: '¿Para qué sirve una fixture en pytest?',
        options: [
          'Para hacer tests más lentos',
          'Para preparar datos/estado reutilizable entre tests',
          'Para documentar tests',
          'Es lo mismo que un mock',
        ],
        correctIndex: 1,
        explanation:
          'Una fixture es una función decorada con @pytest.fixture que prepara datos o estado. Se inyecta en los tests como parámetro. Evita duplicación: si 5 tests necesitan el mismo DataFrame, defines una fixture en vez de copiar el código 5 veces.',
      },
      {
        question: '¿Qué hace `@pytest.mark.parametrize`?',
        options: [
          'Marca el test como lento',
          'Corre el mismo test con múltiples combinaciones de inputs',
          'Para el test si falla',
          'Es lo mismo que una fixture',
        ],
        correctIndex: 1,
        explanation:
          'parametrize recibe una lista de tuplas (inputs, esperado) y corre el test una vez por cada tupla. Ideal para testear la misma función con múltiples casos. Si uno falla, pytest te dice exactamente cuál input falló.',
      },
      {
        question: '¿Qué mide `pytest --cov=mi_modulo`?',
        options: [
          'El tiempo de ejecución',
          'El porcentaje de líneas de código cubiertas por tests',
          'El número de tests',
          'La calidad de los tests',
        ],
        correctIndex: 1,
        explanation:
          'Coverage mide qué líneas de tu código se ejecutaron durante los tests. 80%+ es bueno. 100% es difícil y a veces innecesario (paths de error irreproducibles). El flag --cov-report=term-missing muestra qué líneas NO se cubrieron.',
      },
      {
        question: '¿Para qué sirve GitHub Actions en testing?',
        options: [
          'Para desplegar a producción',
          'Para correr tests automáticamente en cada push/PR',
          'Para escribir tests',
          'Para documentar el repositorio',
        ],
        correctIndex: 1,
        explanation:
          'GitHub Actions es CI/CD integrado a GitHub. Define workflows en .github/workflows/ que se ejecutan en eventos (push, PR). Para testing, corre pytest en un entorno limpio. Si falla, el badge del repo se pone rojo y (con branch protection) bloquea el merge.',
      },
    ],
  },
  resources: {
    docs: [
      { label: 'pytest — Official docs', url: 'https://docs.pytest.org/', note: 'Documentación completa de pytest' },
      { label: 'pytest — Fixtures', url: 'https://docs.pytest.org/en/stable/explanation/fixtures.html', note: 'Guía detallada de fixtures' },
      { label: 'pytest-cov', url: 'https://pytest-cov.readthedocs.io/', note: 'Plugin de cobertura' },
      { label: 'GitHub Actions — Python', url: 'https://docs.github.com/es/actions/automating-builds-and-tests/building-and-testing-python', note: 'Guía oficial de CI para Python' },
    ],
    books: [
      { label: 'Python Apprentice to Master', note: 'Capítulo sobre testing y buenas prácticas.' },
    ],
    courses: [
      { label: 'Real Python — Testing', url: 'https://realpython.com/pytest-python-testing/', note: 'Tutorial completo de pytest' },
    ],
  },
}
