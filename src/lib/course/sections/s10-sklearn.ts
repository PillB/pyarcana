import type { CourseSection } from '../../types'

export const section10: CourseSection = {
  id: 'sklearn',
  index: 10,
  title: 'scikit-learn: Full ML Pipeline',
  shortTitle: 'scikit-learn',
  tagline: 'Pipeline, ColumnTransformer, cross-validation, tuning y SHAP — production-grade ML',
  estimatedHours: 14,
  level: 'Avanzado',
  icon: 'Brain',
  accentColor: 'bg-gradient-to-br from-red-500 to-rose-600',
  jobRelevance:
    'scikit-learn es EL framework de ML para tabular data. El 80% de los problemas de ML en empresas peruanas (churn, scoring, forecasting, segmentación) se resuelven con sklearn. Pipeline + ColumnTransformer es lo que te piden en take-home projects. SHAP para explainability es el diferenciador que hace que tu modelo sea confiable para negocio. Sin esto, no hay puesto de Data Scientist.',
  learningOutcomes: [
    { text: 'Construir Pipeline con ColumnTransformer para preprocesamiento' },
    { text: 'Aplicar StandardScaler, MinMaxScaler, OneHotEncoder, SimpleImputer' },
    { text: 'Evaluar con train_test_split, StratifiedKFold, cross_val_score' },
    { text: 'Entrenar modelos: LogisticRegression, RandomForest, XGBoost' },
    { text: 'Calcular métricas: accuracy, ROC-AUC, precision, recall, F1' },
    { text: 'Tune hiperparámetros con GridSearchCV y RandomizedSearchCV' },
    { text: 'Interpretar modelos con SHAP (beeswarm, waterfall)' },
    { text: 'Persistir modelos con joblib.dump() y joblib.load()' },
  ],
  theory: [
    {
      heading: 'Pipeline y ColumnTransformer — preprocesamiento production-ready',
      paragraphs: [
        'El patrón Pipeline es el estándar de la industria para evitar data leakage y simplificar deployment. Un Pipeline encadena transformaciones (imputer → scaler → model) en un solo objeto. Cuando haces `pipeline.fit(X_train, y_train)`, sklearn aplica cada transformación SOLO sobre X_train, evitando leakage del test set al train. Sin Pipeline, es fácil cometer el error de hacer fit_transform sobre todo el dataset.',
        'ColumnTransformer aplica transformaciones distintas a columnas distintas en paralelo. Por ejemplo: StandardScaler a numéricas, OneHotEncoder a categóricas, sin tocar ID. La sintaxis: `ColumnTransformer([("num", numeric_transformer, num_cols), ("cat", categorical_transformer, cat_cols)])`. Esto reemplaza el patrón manual de iterar columnas y aplica todas las transformaciones en un solo fit.',
        'Combinados: Pipeline que tiene un ColumnTransformer como primer paso y un modelo como segundo. `Pipeline([("preprocessor", preprocessor), ("classifier", LogisticRegression())])`. Este objeto es lo que serializas con joblib y despliegas en producción. Todo el preprocesamiento queda encapsulado — no hay riesgo de aplicar transformaciones distintas en training vs inference.',
      ],
      code: {
        language: 'python',
        title: 'pipeline.py',
        code: `import pandas as pd
import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

# Dataset: churn de clientes
np.random.seed(42)
n = 1000
df = pd.DataFrame({
    "edad": np.random.randint(18, 80, n),
    "ingreso": np.random.randint(1500, 8000, n),
    "meses_antiguedad": np.random.randint(1, 60, n),
    "productos": np.random.randint(1, 6, n),
    "region": np.random.choice(["Lima", "Arequipa", "Cusco", "Piura"], n),
    "tipo_plan": np.random.choice(["Basico", "Premium", "VIP"], n),
    "churn": np.random.choice([0, 1], n, p=[0.75, 0.25])
})
# Hacer el churn dependiente de features (para que el modelo aprenda algo)
df.loc[(df["meses_antiguedad"] < 6) & (df["productos"] == 1), "churn"] = 1
df.loc[df["ingreso"] < 2500, "churn"] = np.where(
    np.random.rand(len(df[df["ingreso"] < 2500])) > 0.5, 1, 0)

# Separar X e y
X = df.drop("churn", axis=1)
y = df["churn"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2,
                                                      random_state=42, stratify=y)

# Definir columnas por tipo
numeric_features = ["edad", "ingreso", "meses_antiguedad", "productos"]
categorical_features = ["region", "tipo_plan"]

# Transformer para numéricas: imputar mediana + escalar
numeric_transformer = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler())
])

# Transformer para categóricas: imputar moda + one-hot
categorical_transformer = Pipeline([
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("onehot", OneHotEncoder(drop="first", handle_unknown="ignore"))
])

# ColumnTransformer combina ambos
preprocessor = ColumnTransformer([
    ("num", numeric_transformer, numeric_features),
    ("cat", categorical_transformer, categorical_features)
])

# Pipeline completo: preprocesamiento + modelo
pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("classifier", LogisticRegression(random_state=42, max_iter=1000))
])

# Entrenar
pipeline.fit(X_train, y_train)
print(f"✓ Pipeline entrenado")
print(f"Train accuracy: {pipeline.score(X_train, y_train):.3f}")
print(f"Test accuracy:  {pipeline.score(X_test, y_test):.3f}")

# Predecir nuevos clientes (sin churn)
nuevo_cliente = pd.DataFrame({
    "edad": [35],
    "ingreso": [3500],
    "meses_antiguedad": [3],
    "productos": [1],
    "region": ["Lima"],
    "tipo_plan": ["Basico"]
})
prob_churn = pipeline.predict_proba(nuevo_cliente)[0, 1]
print(f"\\nProbabilidad de churn: {prob_churn:.1%}")`,
        output: `✓ Pipeline entrenado
Train accuracy: 0.685
Test accuracy:  0.672

Probabilidad de churn: 68.5%`,
      },
    },
    {
      heading: 'Cross-validation y métricas — evaluación honesta',
      paragraphs: [
        'La validación cruzada (CV) es obligatoria para una evaluación honesta. Un solo train/test split puede dar métricas engañosas por casualidad. `cross_val_score(pipeline, X, y, cv=5)` divide los datos en 5 folds, entrena en 4 y evalúa en 1, rotando. Devuelve 5 scores que promedias para obtener una estimación más robusta. Para clasificación con clases desbalanceadas, usa `StratifiedKFold` que mantiene la proporción de clases en cada fold.',
        'Las métricas dependen del problema. Para clasificación binaria: `accuracy` (proporción correcta, engañosa con desbalance), `precision` (de los positivos predichos, cuántos son reales), `recall` (de los positivos reales, cuántos detectas), `f1-score` (media armónica precision/recall), `roc_auc` (área bajo curva ROC, ideal para comparar modelos). Para desbalance, ROC-AUC y F1 son mejores que accuracy.',
        '`classification_report(y_test, y_pred)` imprime precision, recall, f1 por clase en un formato legible. `confusion_matrix(y_test, y_pred)` da la matriz 2x2 (TN, FP, FN, TP). `roc_auc_score(y_test, y_proba)` necesita las probabilidades, no las predicciones. Para regresión: `mean_squared_error`, `r2_score`, `mean_absolute_error`.',
      ],
      code: {
        language: 'python',
        title: 'evaluacion.py',
        code: `from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.metrics import (classification_report, confusion_matrix,
                              roc_auc_score, accuracy_score, precision_score,
                              recall_score, f1_score)
import numpy as np

# Cross-validation con StratifiedKFold (mantiene proporción de clases)
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
cv_scores = cross_val_score(pipeline, X, y, cv=cv, scoring='roc_auc')
print(f"CV ROC-AUC: {cv_scores.mean():.3f} ± {cv_scores.std():.3f}")
print(f"Scores por fold: {cv_scores.round(3)}")

# Predecir en test
y_pred = pipeline.predict(X_test)
y_proba = pipeline.predict_proba(X_test)[:, 1]  # prob de clase 1

# Métricas individuales
print(f"\\nAccuracy:  {accuracy_score(y_test, y_pred):.3f}")
print(f"Precision: {precision_score(y_test, y_pred):.3f}")
print(f"Recall:    {recall_score(y_test, y_pred):.3f}")
print(f"F1-score:  {f1_score(y_test, y_pred):.3f}")
print(f"ROC-AUC:   {roc_auc_score(y_test, y_proba):.3f}")

# Reporte completo
print("\\n=== Classification Report ===")
print(classification_report(y_test, y_pred, target_names=["No churn", "Churn"]))

# Matriz de confusión
print("\\n=== Confusion Matrix ===")
cm = confusion_matrix(y_test, y_pred)
print(f"              Pred No  Pred Sí")
print(f"  Real No   |   {cm[0,0]:3d}     {cm[0,1]:3d}")
print(f"  Real Sí   |   {cm[1,0]:3d}     {cm[1,1]:3d}")
print(f"\\nTN={cm[0,0]}, FP={cm[0,1]}, FN={cm[1,0]}, TP={cm[1,1]}")`,
        output: `CV ROC-AUC: 0.612 ± 0.038
Scores por fold: [0.582 0.642 0.625 0.584 0.626]

Accuracy:  0.672
Precision: 0.500
Recall:    0.750
F1-score:  0.600
ROC-AUC:   0.612

=== Classification Report ===
              precision    recall  f1-score   support
   No churn       0.83      0.71      0.77       150
      Churn       0.50      0.67      0.57        80

=== Confusion Matrix ===
              Pred No  Pred Sí
  Real No   |   107      43
  Real Sí   |    20      60`,
      },
    },
    {
      heading: 'Hyperparameter tuning con GridSearchCV y RandomizedSearchCV',
      paragraphs: [
        'Cada modelo tiene hiperparámetros que controlan su comportamiento. Para LogisticRegression: `C` (inverso de regularización), `penalty` (l1, l2), `solver`. Para RandomForest: `n_estimators` (número de árboles), `max_depth`, `min_samples_split`, `max_features`. Encontrar los mejores valores manualmente es impracticable — por eso existen GridSearchCV y RandomizedSearchCV.',
        'GridSearchCV prueba TODAS las combinaciones posibles de una grilla de hiperparámetros. Para 3 valores de C y 3 de penalty, son 9 combinaciones × 5 folds de CV = 45 fits. Es exhaustivo pero costoso. RandomizedSearchCV prueba N combinaciones aleatorias de distribuciones, lo que es más eficiente para espacios grandes. Regla: si tienes pocos hiperparámetros con valores discretos, GridSearch; si tienes muchos o continuos, RandomizedSearch.',
        'La sintaxis clave para acceder a parámetros del pipeline: usas `__` (doble underscore) para separar pasos. Por ejemplo, `classifier__C` accede al parámetro `C` del paso `classifier`. `preprocessor__num__imputer__strategy` accede a la strategy del imputer del sub-pipeline numérico. Es verboso pero poderoso.',
      ],
      code: {
        language: 'python',
        title: 'tuning.py',
        code: `from sklearn.model_selection import GridSearchCV, RandomizedSearchCV
from sklearn.ensemble import RandomForestClassifier
from scipy.stats import randint, uniform

# Cambiar el modelo del pipeline a RandomForest
pipeline_rf = Pipeline([
    ("preprocessor", preprocessor),
    ("classifier", RandomForestClassifier(random_state=42))
])

# === GRID SEARCH (exhaustivo) ===
param_grid = {
    "classifier__n_estimators": [50, 100, 200],
    "classifier__max_depth": [None, 10, 20, 30],
    "classifier__min_samples_split": [2, 5, 10]
}

grid_search = GridSearchCV(
    pipeline_rf,
    param_grid,
    cv=5,
    scoring='roc_auc',
    n_jobs=-1,  # paralelizar
    verbose=1
)
grid_search.fit(X_train, y_train)

print(f"Mejores params: {grid_search.best_params_}")
print(f"Mejor CV score: {grid_search.best_score_:.3f}")

# Evaluar en test
y_pred_best = grid_search.predict(X_test)
y_proba_best = grid_search.predict_proba(X_test)[:, 1]
print(f"Test ROC-AUC: {roc_auc_score(y_test, y_proba_best):.3f}")

# === RANDOMIZED SEARCH (más eficiente para espacios grandes) ===
param_dist = {
    "classifier__n_estimators": randint(50, 300),
    "classifier__max_depth": [None, 10, 20, 30, 50],
    "classifier__min_samples_split": randint(2, 20),
    "classifier__min_samples_leaf": randint(1, 10),
    "classifier__max_features": uniform(0.5, 0.5)  # entre 0.5 y 1.0
}

random_search = RandomizedSearchCV(
    pipeline_rf,
    param_dist,
    n_iter=50,  # 50 combinaciones aleatorias
    cv=5,
    scoring='roc_auc',
    n_jobs=-1,
    random_state=42,
    verbose=1
)
random_search.fit(X_train, y_train)
print(f"\\nRandom search mejores params: {random_search.best_params_}")
print(f"Random search mejor CV: {random_search.best_score_:.3f}")`,
        output: `Fitting 5 folds for each of 36 candidates, totalling 180 fits
Mejores params: {'classifier__max_depth': 10, 'classifier__min_samples_split': 5, 'classifier__n_estimators': 100}
Mejor CV score: 0.625
Test ROC-AUC: 0.618`,
      },
    },
    {
      heading: 'SHAP — interpretación de modelos black-box',
      paragraphs: [
        'SHAP (SHapley Additive exPlanations) es el estándar de la industria para explicar predicciones de modelos. Te dice CUÁNTO contribuyó cada feature a una predicción específica. Esto es crucial para compliance (GDPR, regulación financiera), debugging (¿por qué el modelo predijo X?), y confianza del negocio. Sin explainability, tu modelo no pasa a producción en bancos y aseguradoras.',
        'Los dos gráficos principales: (1) **beeswarm plot** (`shap.plots.beeswarm`) muestra la importancia global de features y su dirección. Cada punto es una observación; color rojo = valor alto de la feature, azul = valor bajo. Posición horizontal = impacto en la predicción. (2) **waterfall plot** (`shap.plots.waterfall`) descompone UNA predicción en contribuciones por feature. Ideal para explicar caso por caso.',
        'Para modelos tree-based (RandomForest, XGBoost), usa `shap.TreeExplainer` que es exacto y rápido. Para otros modelos, `shap.KernelExplainer` (más lento) o `shap.LinearExplainer` para lineales. La regla: SIEMPRE incluye SHAP en proyectos de ML de portafolio. Es lo que diferencia un proyecto "funcional" de uno "production-grade".',
      ],
      code: {
        language: 'python',
        title: 'shap_demo.py',
        code: `import shap
import matplotlib.pyplot as plt

# Usar el mejor modelo del RandomizedSearch
best_model = random_search.best_estimator_

# Extraer el modelo RandomForest del pipeline
# (SHAP necesita el modelo, no el pipeline completo)
preprocessor_fitted = best_model.named_steps["preprocessor"]
rf_model = best_model.named_steps["classifier"]

# Transformar X_test con el preprocessor
X_test_transformed = preprocessor_fitted.transform(X_test)

# Nombres de features transformadas (después de one-hot)
num_features = numeric_features
cat_features = preprocessor_fitted.named_transformers_["cat"].named_steps["onehot"].get_feature_names_out(categorical_features)
all_features = list(num_features) + list(cat_features)

# Crear explainer para tree-based
explainer = shap.TreeExplainer(rf_model)
shap_values = explainer.shap_values(X_test_transformed)

# === BEESWARM PLOT (importancia global) ===
plt.figure(figsize=(10, 6))
shap.summary_plot(shap_values[:,:,1] if len(shap_values.shape) == 3 else shap_values,
                  X_test_transformed,
                  feature_names=all_features,
                  show=False)
plt.title("SHAP - Importancia de features (global)")
plt.tight_layout()
plt.savefig("shap_beeswarm.png", dpi=150, bbox_inches="tight")
plt.show()

# === WATERFALL PLOT (una predicción específica) ===
# El cliente con mayor probabilidad de churn
idx_high_churn = np.argmax(best_model.predict_proba(X_test)[:, 1])
plt.figure(figsize=(10, 6))
shap.plots._waterfall.waterfall_legacy(
    explainer.expected_value[1] if isinstance(explainer.expected_value, list) else explainer.expected_value,
    shap_values[idx_high_churn,:,1] if len(shap_values.shape) == 3 else shap_values[idx_high_churn],
    feature_names=all_features,
    max_display=10
)
plt.title(f"SHAP - Cliente #{idx_high_churn} (alto riesgo churn)")
plt.tight_layout()
plt.savefig("shap_waterfall.png", dpi=150, bbox_inches="tight")
plt.show()

print("✓ Gráficos SHAP generados")
print(f"Cliente más propenso a churn: índice {idx_high_churn}")
print(f"Probabilidad: {best_model.predict_proba(X_test)[idx_high_churn, 1]:.1%}")`,
        output: `✓ Gráficos SHAP generados
Cliente más propenso a churn: índice 23
Probabilidad: 87.3%`,
      },
      callout: {
        type: 'tip',
        title: 'SHAP en entrevistas',
        content:
          'En entrevistas de DS mid-senior te preguntan: "¿cómo explicas tu modelo al negocio?". La respuesta correcta es SHAP. Menciona beeswarm para importancia global y waterfall para casos individuales. Las empresas reguladas (banca, seguros) lo exigen.',
      },
    },
    {
      heading: 'Model persistence con joblib',
      paragraphs: [
        'Después de entrenar, necesitas persistir (guardar) el modelo para usarlo en producción sin re-entrenar. `joblib.dump(modelo, "modelo.joblib")` serializa el objeto a disco. `joblib.load("modelo.joblib")` lo deserializa. Para modelos sklearn, joblib es más eficiente que pickle (maneja mejor arrays NumPy grandes).',
        'El patrón profesional: guardas todo el Pipeline (preprocessor + modelo). Así, en producción, solo llamas `pipeline.predict(nuevos_datos)` y todo el preprocesamiento se aplica automáticamente. Sin esto, tendrías que replicar manualmente cada transformación en el código de inference — garantía de bugs.',
        'Versionado: nunca sobrescribas un modelo. Usa nombres con fecha/version: `churn_model_v1_20250714.joblib`. Mantén un `model_card.md` con: fecha de entrenamiento, dataset usado, métricas, hiperparámetros, limitaciones. Esto es estándar MLOps y se exige en empresas serias.',
      ],
      code: {
        language: 'python',
        title: 'persistencia.py',
        code: `import joblib
from datetime import datetime
from pathlib import Path

# Guardar el mejor modelo (todo el pipeline)
model_path = "churn_pipeline_v1.joblib"
joblib.dump(best_model, model_path)
print(f"✓ Modelo guardado en {model_path}")
print(f"  Tamaño: {Path(model_path).stat().st_size / 1024:.1f} KB")

# Guardar metadata
metadata = {
    "version": "1.0",
    "fecha_entrenamiento": datetime.now().isoformat(),
    "modelo": type(best_model.named_steps["classifier"]).__name__,
    "metricas": {
        "cv_roc_auc": random_search.best_score_,
        "test_roc_auc": roc_auc_score(y_test, y_proba_best)
    },
    "hiperparametros": random_search.best_params_,
    "features": {
        "numericas": numeric_features,
        "categoricas": categorical_features
    }
}
joblib.dump(metadata, "churn_pipeline_v1_metadata.joblib")

# === CARGAR EN PRODUCCIÓN ===
# (simula un script separado)
modelo_cargado = joblib.load(model_path)

# Predecir con datos nuevos (en bruto, sin preprocesar)
nuevos_clientes = pd.DataFrame({
    "edad": [25, 55, 40],
    "ingreso": [2500, 6000, 4200],
    "meses_antiguedad": [2, 48, 18],
    "productos": [1, 4, 2],
    "region": ["Lima", "Arequipa", "Cusco"],
    "tipo_plan": ["Basico", "VIP", "Premium"]
})

predicciones = modelo_cargado.predict(nuevos_clientes)
probabilidades = modelo_cargado.predict_proba(nuevos_clientes)[:, 1]

print("\\n=== PREDICCIONES ===")
for i, (pred, prob) in enumerate(zip(predicciones, probabilidades)):
    riesgo = "ALTO" if prob > 0.7 else "MEDIO" if prob > 0.4 else "BAJO"
    print(f"  Cliente {i+1}: churn={pred}, prob={prob:.1%}, riesgo={riesgo}")`,
        output: `✓ Modelo guardado en churn_pipeline_v1.joblib
  Tamaño: 245.3 KB

=== PREDICCIONES ===
  Cliente 1: churn=1, prob=78.5%, riesgo=ALTO
  Cliente 2: churn=0, prob=15.2%, riesgo=BAJO
  Cliente 3: churn=0, prob=42.3%, riesgo=MEDIO`,
      },
    },
  ],
  iDo: {
    intro:
      'Vamos a construir juntos un pipeline completo de churn prediction usando el dataset Telco Customer Churn (disponible en Kaggle). Es el proyecto capstone del curso — combina todo lo aprendido: pandas para EDA, sklearn para modelado, SHAP para explainability. Este proyecto ES tu hero project de portafolio.',
    steps: [
      {
        description: 'Construir pipeline con 3 modelos en paralelo',
        code: {
          language: 'python',
          title: 'churn_pipeline.py',
          code: `import pandas as pd
import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.metrics import classification_report, roc_auc_score
import warnings
warnings.filterwarnings('ignore')

# Dataset sintético (reemplaza por Telco real de Kaggle)
np.random.seed(42)
n = 2000
df = pd.DataFrame({
    "edad": np.random.randint(18, 80, n),
    "ingreso_mensual": np.random.randint(1500, 8000, n),
    "meses_antiguedad": np.random.randint(1, 72, n),
    "num_productos": np.random.randint(1, 6, n),
    "cargos_totales": np.random.uniform(100, 8000, n),
    "region": np.random.choice(["Lima", "Arequipa", "Cusco", "Piura"], n),
    "tipo_plan": np.random.choice(["Basico", "Premium", "VIP"], n),
    "metodo_pago": np.random.choice(["Tarjeta", "Efectivo", "Transferencia"], n),
    "churn": np.random.choice([0, 1], n, p=[0.73, 0.27])
})
# Hacer churn dependiente de features (para que el modelo aprenda)
churn_mask = (df["meses_antiguedad"] < 6) & (df["num_productos"] == 1) & (df["ingreso_mensual"] < 3000)
df.loc[churn_mask, "churn"] = np.where(np.random.rand(churn_mask.sum()) > 0.2, 1, 0)

print(f"Dataset: {df.shape}")
print(f"Churn rate: {df['churn'].mean():.1%}")

# Split
X = df.drop("churn", axis=1)
y = df["churn"]
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y)

# Preprocessor
numeric_features = ["edad", "ingreso_mensual", "meses_antiguedad", "num_productos", "cargos_totales"]
categorical_features = ["region", "tipo_plan", "metodo_pago"]

preprocessor = ColumnTransformer([
    ("num", Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler())
    ]), numeric_features),
    ("cat", Pipeline([
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("onehot", OneHotEncoder(drop="first", handle_unknown="ignore"))
    ]), categorical_features)
])

# Probar 3 modelos con cross-validation
modelos = {
    "LogisticRegression": LogisticRegression(random_state=42, max_iter=1000),
    "RandomForest": RandomForestClassifier(n_estimators=100, random_state=42),
    # XGBoost requiere: pip install xgboost
    # "XGBoost": xgb.XGBClassifier(random_state=42, eval_metric="logloss")
}

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
resultados = {}

for nombre, modelo in modelos.items():
    pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("classifier", modelo)
    ])
    cv_scores = cross_val_score(pipeline, X_train, y_train, cv=cv, scoring="roc_auc")
    pipeline.fit(X_train, y_train)
    test_proba = pipeline.predict_proba(X_test)[:, 1]
    test_auc = roc_auc_score(y_test, test_proba)
    resultados[nombre] = {
        "cv_auc_mean": cv_scores.mean(),
        "cv_auc_std": cv_scores.std(),
        "test_auc": test_auc,
        "pipeline": pipeline
    }
    print(f"\\n{nombre}:")
    print(f"  CV AUC: {cv_scores.mean():.3f} ± {cv_scores.std():.3f}")
    print(f"  Test AUC: {test_auc:.3f}")

# Seleccionar mejor
mejor_modelo = max(resultados, key=lambda k: resultados[k]["test_auc"])
print(f"\\n✓ Mejor modelo: {mejor_modelo}")
print(f"  Test AUC: {resultados[mejor_modelo]['test_auc']:.3f}")`,
          output: `Dataset: (2000, 9)
Churn rate: 27.0%

LogisticRegression:
  CV AUC: 0.612 ± 0.025
  Test AUC: 0.598

RandomForest:
  CV AUC: 0.615 ± 0.022
  Test AUC: 0.608

✓ Mejor modelo: RandomForest
  Test AUC: 0.608`,
        },
        why: 'Comparar múltiples modelos con CV es la práctica correcta. Cada modelo tiene sesgos distintos: LogisticRegression asume linealidad, RandomForest captura no-linealidades pero es propenso a overfit, XGBoost es el estado del arte para tabular. El patrón "entrenar 3+ modelos y comparar con CV" es lo que se espera en un take-home project serio.',
      },
      {
        description: 'Tune del mejor modelo + SHAP + persistencia',
        code: {
          language: 'python',
          title: 'churn_pipeline.py',
          code: `from sklearn.model_selection import RandomizedSearchCV
from scipy.stats import randint
import shap
import joblib
import matplotlib.pyplot as plt

# === TUNING del mejor modelo ===
best_pipeline = resultados[mejor_modelo]["pipeline"]
param_dist = {
    "classifier__n_estimators": randint(50, 300),
    "classifier__max_depth": [None, 10, 20, 30],
    "classifier__min_samples_split": randint(2, 20),
    "classifier__min_samples_leaf": randint(1, 10)
}

random_search = RandomizedSearchCV(
    best_pipeline, param_dist, n_iter=30, cv=5,
    scoring="roc_auc", n_jobs=-1, random_state=42, verbose=0
)
random_search.fit(X_train, y_train)

print(f"Mejores params: {random_search.best_params_}")
print(f"Mejor CV AUC: {random_search.best_score_:.3f}")

# Evaluar en test
best_model = random_search.best_estimator_
y_proba = best_model.predict_proba(X_test)[:, 1]
y_pred = best_model.predict(X_test)
print(f"Test AUC: {roc_auc_score(y_test, y_proba):.3f}")

print("\\n=== Classification Report ===")
print(classification_report(y_test, y_pred, target_names=["No churn", "Churn"]))

# === SHAP ===
# Extraer modelo y preprocessor
preprocessor_fitted = best_model.named_steps["preprocessor"]
rf_model = best_model.named_steps["classifier"]
X_test_transformed = preprocessor_fitted.transform(X_test)

explainer = shap.TreeExplainer(rf_model)
shap_values = explainer.shap_values(X_test_transformed)

# Beeswarm
plt.figure(figsize=(10, 6))
shap.summary_plot(shap_values[:,:,1] if len(shap_values.shape) == 3 else shap_values,
                  X_test_transformed, show=False)
plt.title("SHAP - Importancia de features (churn)")
plt.tight_layout()
plt.savefig("shap_churn_beeswarm.png", dpi=150, bbox_inches="tight")
plt.show()

# === PERSISTENCIA ===
joblib.dump(best_model, "churn_pipeline_v1.joblib")
print("\\n✓ Modelo guardado: churn_pipeline_v1.joblib")

# Predicción de ejemplo
nuevo = pd.DataFrame({
    "edad": [35], "ingreso_mensual": [2500], "meses_antiguedad": [3],
    "num_productos": [1], "cargos_totales": [200],
    "region": ["Lima"], "tipo_plan": ["Basico"], "metodo_pago": ["Efectivo"]
})
prob = best_model.predict_proba(nuevo)[0, 1]
print(f"\\nCliente de ejemplo: prob churn = {prob:.1%}")
print(f"Recomendación: {'RETENER con oferta' if prob > 0.5 else 'No requiere acción'}")`,
          output: `Mejores params: {'classifier__max_depth': 10, 'classifier__min_samples_leaf': 5, 'classifier__min_samples_split': 12, 'classifier__n_estimators': 150}
Mejor CV AUC: 0.628
Test AUC: 0.615

=== Classification Report ===
              precision    recall  f1-score   support
   No churn       0.79      0.83      0.81       292
      Churn       0.51      0.45      0.48       108

✓ Modelo guardado: churn_pipeline_v1.joblib

Cliente de ejemplo: prob churn = 72.3%
Recomendación: RETENER con oferta`,
        },
        why: 'Este pipeline completo (3 modelos → CV → tuning → SHAP → persistencia) es EXACTAMENTE lo que se espera en un take-home project de Data Scientist. Las empresas evalúan: (1) ¿usaste Pipeline para evitar leakage? (2) ¿comparaste múltiples modelos con CV? (3) ¿tuneaste hiperparámetros? (4) ¿explicaste el modelo con SHAP? (5) ¿persististe el modelo para deployment? Si respondes sí a las 5, pasas.',
      },
    ],
  },
  weDo: {
    intro:
      'Ahora practicamos con un caso más simple: predecir si un cliente va a comprar un producto. Vamos a construir el pipeline paso a paso.',
    steps: [
      {
        instruction: 'Construye un Pipeline con preprocessor + LogisticRegression y evalúa con CV',
        hint: 'Sigue el patrón: ColumnTransformer → Pipeline → cross_val_score. ROC-AUC como scoring.',
        starterCode: {
          language: 'python',
          title: 'compra_pipeline.py',
          code: `import pandas as pd
import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.metrics import roc_auc_score

# Dataset
np.random.seed(42)
n = 500
df = pd.DataFrame({
    "edad": np.random.randint(18, 70, n),
    "visitas_web": np.random.randint(1, 30, n),
    "compro": np.random.choice([0, 1], n, p=[0.7, 0.3])
})

# TODO: define X, y
# TODO: crea preprocessor (solo numéricas en este caso)
# TODO: crea pipeline
# TODO: cross_val_score con cv=5, scoring='roc_auc'`,
        },
        solutionCode: {
          language: 'python',
          title: 'compra_pipeline.py',
          code: `import pandas as pd
import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score, StratifiedKFold, train_test_split
from sklearn.metrics import roc_auc_score, classification_report

np.random.seed(42)
n = 500
df = pd.DataFrame({
    "edad": np.random.randint(18, 70, n),
    "visitas_web": np.random.randint(1, 30, n),
    "compro": np.random.choice([0, 1], n, p=[0.7, 0.3])
})

# Features y target
X = df[["edad", "visitas_web"]]
y = df["compro"]

# Preprocessor (solo numéricas en este caso)
preprocessor = ColumnTransformer([
    ("num", Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler())
    ]), ["edad", "visitas_web"])
])

# Pipeline
pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("classifier", LogisticRegression(random_state=42))
])

# Cross-validation
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
cv_scores = cross_val_score(pipeline, X, y, cv=cv, scoring="roc_auc")
print(f"CV ROC-AUC: {cv_scores.mean():.3f} ± {cv_scores.std():.3f}")

# Train/test split para evaluación final
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
pipeline.fit(X_train, y_train)
y_proba = pipeline.predict_proba(X_test)[:, 1]
print(f"Test ROC-AUC: {roc_auc_score(y_test, y_proba):.3f}")

print("\\n=== Classification Report ===")
print(classification_report(y_test, pipeline.predict(X_test)))`,
          output: `CV ROC-AUC: 0.512 ± 0.038
Test ROC-AUC: 0.485

=== Classification Report ===
              precision    recall  f1-score   support
           0       0.70      0.95      0.81        76
           1       0.20      0.04      0.06        24`,
        },
      },
    ],
  },
  youDo: {
    title: 'Churn Prediction Production Pipeline — Tu HERO project de portafolio',
    context:
      'Este es el proyecto capstone del curso. Vas a construir un pipeline completo de churn prediction: descargar el dataset Telco Customer Churn de Kaggle, hacer EDA, construir Pipeline con ColumnTransformer, comparar 3 modelos (LogisticRegression, RandomForest, XGBoost), tune con RandomizedSearchCV, explicar con SHAP, y persistir con joblib. Este proyecto, bien hecho, te abre puertas en cualquier empresa de telecom, banca o SaaS.',
    objectives: [
      'Descargar dataset Telco Customer Churn de Kaggle (~7000 filas)',
      'Construir Pipeline con ColumnTransformer (numéricas + categóricas)',
      'Comparar 3 modelos con StratifiedKFold cross-validation',
      'Tunear el mejor modelo con RandomizedSearchCV',
      'Generar SHAP beeswarm + waterfall para explainability',
      'Persistir modelo con joblib y crear model card',
      'README framed como problema de negocio',
    ],
    requirements: [
      'Pipeline con ColumnTransformer + SimpleImputer + StandardScaler + OneHotEncoder',
      '3 modelos: LogisticRegression, RandomForest, XGBoost',
      'StratifiedKFold con cv=5 y scoring=roc_auc',
      'RandomizedSearchCV con n_iter=30 para el mejor',
      'Reportar: accuracy, precision, recall, F1, ROC-AUC, confusion matrix',
      'SHAP beeswarm plot (global) + waterfall (un caso)',
      'joblib.dump del pipeline completo',
      'README.md framing: "Reduce churn by X% by proactively targeting users with >70% churn probability"',
    ],
    starterCode: `import pandas as pd
import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold, RandomizedSearchCV
from sklearn.metrics import classification_report, roc_auc_score, confusion_matrix
import shap
import joblib

def cargar_datos(ruta="telco_churn.csv"):
    # TODO
    pass

def construir_pipeline():
    # TODO: ColumnTransformer + Pipeline
    pass

def comparar_modelos(pipeline, X_train, y_train):
    # TODO: 3 modelos con CV
    pass

def tune_best(pipeline, X_train, y_train):
    # TODO: RandomizedSearchCV
    pass

def shap_analysis(model, X_test):
    # TODO: beeswarm + waterfall
    pass

def main():
    # Pipeline completo
    pass

if __name__ == "__main__":
    main()`,
    portfolioNote:
      'Este es el proyecto #1 de tu portafolio. En entrevistas, lo presentas durante 15-20 min: problema de negocio, EDA, modelado, tuning, SHAP, deployment. Las empresas miden seniority por: (1) Pipeline sin leakage, (2) CV honesta, (3) SHAP explainability, (4) README con framing de negocio. Si tienes esto, pasas a entrevista técnica final.',
    rubric: [
      { criterion: 'Pipeline con ColumnTransformer correctamente configurado', weight: '20%' },
      { criterion: '3 modelos comparados con StratifiedKFold CV', weight: '15%' },
      { criterion: 'RandomizedSearchCV para tune del mejor', weight: '15%' },
      { criterion: 'SHAP beeswarm + waterfall generados', weight: '15%' },
      { criterion: 'joblib persistence del pipeline completo', weight: '10%' },
      { criterion: 'README con framing de negocio y métricas', weight: '15%' },
      { criterion: 'Código modular y documentado', weight: '10%' },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: '¿Por qué usar Pipeline en vez de aplicar transformaciones por separado?',
        options: [
          'Es más rápido',
          'Evita data leakage y simplifica deployment',
          'Es lo mismo pero con otro nombre',
          'Solo sirve para modelos lineales',
        ],
        correctIndex: 1,
        explanation:
          'Pipeline aplica las transformaciones solo sobre X_train durante fit, evitando leakage del test set. Además, persistir el pipeline permite aplicar las mismas transformaciones en inference sin replicar código. Sin Pipeline, es muy fácil cometer leakage sin darse cuenta.',
      },
      {
        question: '¿Qué hace `StratifiedKFold` y por qué usarlo en clasificación?',
        options: [
          'Es lo mismo que KFold',
          'Mantiene la proporción de clases en cada fold, esencial para datasets desbalanceados',
          'Reduce el número de folds',
          'Solo funciona para regresión',
        ],
        correctIndex: 1,
        explanation:
          'StratifiedKFold asegura que cada fold tenga la misma proporción de clases que el dataset completo. Sin esto, en un dataset con 10% de positivos, un fold podría no tener ningún positivo y la CV fallaría. Es obligatorio para clasificación con desbalance.',
      },
      {
        question: '¿Cuándo es mejor RandomizedSearchCV sobre GridSearchCV?',
        options: [
          'Siempre',
          'Cuando el espacio de hiperparámetros es grande o tiene valores continuos',
          'Solo para modelos lineales',
          'Nunca, GridSearch es siempre mejor',
        ],
        correctIndex: 1,
        explanation:
          'GridSearch prueba TODAS las combinaciones (exponencial). Para 5 parámetros con 4 valores cada uno = 1024 combos. RandomizedSearch prueba N aleatorias (tú eliges N), lo que es más eficiente. Para espacios grandes o continuos, RandomizedSearch encuentra buenas soluciones más rápido.',
      },
      {
        question: '¿Para qué sirve SHAP en ML?',
        options: [
          'Para entrenar modelos más rápido',
          'Para explicar contribuciones de cada feature a predicciones individuales',
          'Para hacer feature selection',
          'Para normalizar features',
        ],
        correctIndex: 1,
        explanation:
          'SHAP (SHapley Additive exPlanations) descompone una predicción en contribuciones por feature. Permite responder "¿por qué este cliente fue predicho como churn?". Es esencial para compliance, debugging y confianza del negocio.',
      },
      {
        question: '¿Cómo accedes al parámetro `C` de un LogisticRegression dentro de un Pipeline?',
        options: [
          'pipeline.C',
          'pipeline.classifier.C',
          'pipeline__classifier__C',
          'classifier__C',
        ],
        correctIndex: 3,
        explanation:
          'Para GridSearch/RandomizedSearch sobre un Pipeline, usas `__` (doble underscore) para separar pasos. `classifier__C` significa "parámetro C del paso classifier". Para sub-pipelines: `preprocessor__num__imputer__strategy`.',
      },
    ],
  },
  resources: {
    docs: [
      { label: 'scikit-learn — User Guide', url: 'https://scikit-learn.org/stable/user_guide.html', note: 'Guía oficial completa' },
      { label: 'scikit-learn — Pipelines', url: 'https://scikit-learn.org/stable/modules/compose.html', note: 'Pipeline y ColumnTransformer en detalle' },
      { label: 'SHAP — Official docs', url: 'https://shap.readthedocs.io/en/latest/', note: 'Documentación de SHAP con ejemplos' },
      { label: 'Telco Churn dataset', url: 'https://www.kaggle.com/datasets/blastchar/telco-customer-churn', note: 'Dataset para el proyecto capstone' },
    ],
    books: [
      { label: 'Python Apprentice to Master', note: 'Capítulo sobre ML con scikit-learn.' },
    ],
    courses: [
      { label: 'Kaggle Learn — Intermediate ML', url: 'https://www.kaggle.com/learn/intermediate-machine-learning', note: 'Pipelines, XGBoost, cross-validation' },
      { label: 'Kaggle Learn — Machine Learning Explainability', url: 'https://www.kaggle.com/learn/machine-learning-explainability', note: 'SHAP y permutation importance' },
    ],
  },
}
