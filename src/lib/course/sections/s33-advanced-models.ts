import type { CourseSection } from '../../types'

export const section33: CourseSection = {
  id: 'advanced-models',
  index: 33,
  title: 'Modelos Avanzados — Gradient Boosting, Stacking, Interpretabilidad',
  shortTitle: 'Modelos Avanzados — Gradient B',
  tagline: 'Los modelos que ganan competencias y que las empresas confían en producción.',
  estimatedHours: 12,
  level: 'Senior',
  phase: 2,
  icon: 'TrendingUp',
  accentColor: 'bg-gradient-to-br from-purple-500 to-fuchsia-600',
  jobRelevance: 'ML Engineer roles en USA ($120K-$160K) requieren dominio de gradient boosting, ensembling, optimización bayesiana y model interpretability. SHAP es requisito en sectores regulados (banca, seguros) donde los modelos deben ser explicables.',
  learningOutcomes: [
    { text: 'Dominar XGBoost, LightGBM y CatBoost: hiperparámetros clave, early stopping, categorical features' },
    { text: 'Implementar Stacking y Blending de modelos con scikit-learn StackingClassifier' },
    { text: 'Optimizar hiperparámetros con Optuna (bayesian optimization) vs GridSearchCV' },
    { text: 'Interpretar modelos con SHAP: global e individual explanations, dependence plots' },
    { text: 'Construir pipelines de ML production-grade con scikit-learn Pipelines + ColumnTransformer' },
    { text: 'Validar modelos correctamente: time-series CV, stratified K-fold, group K-fold' },
  ],
  theory: [
    {
      heading: 'XGBoost y LightGBM: cuándo y cómo optimizar hyperparámetros',
      paragraphs: [
        'XGBoost y LightGBM son los modelos de gradient boosting más usados en competiciones Kaggle y producción. XGBoost es más preciso pero más lento; LightGBM es 3-5x más rápido con precisión comparable. Los hiperparámetros críticos son: `n_estimators` (número de árboles, 100-1000), `max_depth` (profundidad, 3-10), `learning_rate` (0.01-0.3), `subsample` (0.6-1.0), y `colsample_bytree` (0.6-1.0). Optuna usa TPE (Tree-structured Parzen Estimator) para explorar este espacio inteligentemente — encuentra el óptimo en 50 trials vs 500 de GridSearch, porque descarta regiones prometedoras rápidamente.',
        'Stacking ensembles combinan múltiples modelos base (LogisticRegression, RandomForest, XGBoost) via un meta-modelo que aprende cuándo confiar en cada uno. La clave es usar predicciones out-of-fold (cross-validation) como features del meta-modelo — si usas las mismas predicciones de entrenamiento, hay data leakage. mlxtend.StackingClassifier lo hace automáticamente. En producción, stacking da 2-5% de mejora sobre el mejor modelo individual, pero añade complejidad: necesitas serializar N+1 modelos y servirlos. Solo vale la pena si ese 2-5% tiene impacto de negocio (ej. detección de fraude donde cada punto de AUC ahorra miles de dólares).',
        'SHAP (SHapley Additive exPlanations) descompone una predicción en contribuciones por feature. Para XGBoost/RandomForest, `shap.TreeExplainer` es exacto y rápido. El beeswarm plot muestra importancia global: cada punto es una observación, color rojo = valor alto de la feature, azul = valor bajo, posición horizontal = impacto en la predicción. El waterfall plot explica una predicción individual: muestra cómo cada feature empuja la predicción desde el base value hasta el valor final. En entrevistas, saber interpretar SHAP es lo que diferencia un junior que "entrenó un modelo" de un senior que "entiende por qué el modelo predice lo que predice".',
      ],
    },
  ],
  iDo: {
    intro: 'Te muestro paso a paso cómo aplicar los conceptos de esta sección con ejemplos prácticos.',
    steps: [
      {
        description: 'Entrenar XGBoost con Optuna para hyperparameter tuning automático',
        code: {
          language: 'python',
          title: 'demo.py',
          code: '"""XGBoost con Optuna para hyperparameter tuning."""\nimport optuna\nimport xgboost as xgb\nfrom sklearn.model_selection import cross_val_score\nfrom sklearn.datasets import make_classification\n\nX, y = make_classification(n_samples=1000, n_features=20, random_state=42)\n\ndef objective(trial):\n    params = {\n        "n_estimators": trial.suggest_int("n_estimators", 100, 500),\n        "max_depth": trial.suggest_int("max_depth", 3, 10),\n        "learning_rate": trial.suggest_float("learning_rate", 0.01, 0.3, log=True),\n        "subsample": trial.suggest_float("subsample", 0.6, 1.0),\n    }\n    model = xgb.XGBClassifier(**params, random_state=42)\n    return cross_val_score(model, X, y, cv=5, scoring="roc_auc").mean()\n\nstudy = optuna.create_study(direction="maximize", pruner=optuna.pruners.MedianPruner())\nstudy.optimize(objective, n_trials=20)\nprint(f"Mejor AUC: {study.best_value:.4f}")\nprint(f"Mejores params: {study.best_params}")',
        },
        why: 'Optuna con TPE explora inteligentemente el espacio de hiperparametros. MedianPruner corta trials malos temprano ahorrando 60% del tiempo. 20 trials de Optuna ≈ 200 de GridSearch en calidad.',
      },
    ],
  },
  weDo: {
    intro: 'Ahora te toca a ti practicar con guía. Lee cada instrucción, intenta escribir el código, y si te trabas revisa la solución.',
    steps: [
      {
        instruction: 'Implementa Optuna para optimizar XGBoost con 50 trials',
        hint: 'Revisa la teoría y el I Do antes de intentar este ejercicio.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '"""Stacking ensemble con 3 modelos base."""\nfrom sklearn.ensemble import StackingClassifier, RandomForestClassifier\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import cross_val_score\nimport xgboost as xgb\n\nbase_models = [\n    ("lr", LogisticRegression(random_state=42, max_iter=1000)),\n    ("rf", RandomForestClassifier(n_estimators=100, random_state=42)),\n    ("xgb", xgb.XGBClassifier(random_state=42)),\n]\nstacking = StackingClassifier(estimators=base_models, final_estimator=LogisticRegression(), cv=5)\n\nfor name, model in base_models + [("stacking", stacking)]:\n    scores = cross_val_score(model, X, y, cv=5, scoring="roc_auc")\n    print(f"  {name:10s}: AUC = {scores.mean():.4f}")\nprint("Stacking generalmente mejora 2-5% sobre el mejor individual")',
        },
      },
    ],
  },
  youDo: {
    title: 'Competition-Grade ML System',
    context: 'Pipeline completo con LightGBM + XGBoost ensemble, optimización Optuna, SHAP explanations, y deploy via MLflow + FastAPI.',
    objectives: [
      'Aplicar los conceptos aprendidos en un proyecto real',
      'Demostrar dominio del tema con un entregable de portafolio',
      'Documentar el proceso y los resultados',
    ],
    requirements: [
      'Código funcional y documentado',
      'Tests que validen el funcionamiento',
      'README con instrucciones de uso',
    ],
    portfolioNote: 'Este proyecto es ideal para mostrar en entrevistas técnicas y agregar a tu portafolio de GitHub.',
    rubric: [
      { criterion: 'Funcionalidad', weight: '40%' },
      { criterion: 'Calidad de código', weight: '20%' },
      { criterion: 'Documentación', weight: '20%' },
      { criterion: 'Tests', weight: '20%' },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: '¿Qué es XGBoost y por qué es preferido sobre Random Forest?',
        options: [
          'Usa gradient boosting: cada árbol corrige errores del anterior con regularización — logra 2-5% más precisión que Random Forest en datos tabulares',
          'XGBoost es más rápido de entrenar',
          'XGBoost no requiere preprocesamiento',
          'XGBoost es más fácil de interpretar',
        ],
        correctIndex: 0,
        explanation: 'XGBoost construye árboles secuencialmente: cada nuevo árbol corrige los errores residuales. Incluye regularización L1/L2. Domina Kaggle en datos tabulares desde 2014.',
      },
      {
        question: '¿Por qué Optuna es mejor que GridSearchCV?',
        options: [
          'Optuna usa TPE para explorar inteligentemente — descarta regiones malas y concentra en prometedoras, encontrando el óptimo en 50 trials vs 500 de GridSearch',
          'Optuna es más fácil de instalar',
          'Optuna solo funciona con XGBoost',
          'Optuna es matemáticamente más preciso',
        ],
        correctIndex: 0,
        explanation: 'GridSearch prueba TODAS las combinaciones (exponencial). Optuna aprende qué regiones dan buenos resultados y concentra ahí. Con pruning, corta trials malos temprano. 50 trials Optuna ≈ 500 GridSearch.',
      },
      {
        question: '¿Qué es un stacking ensemble?',
        options: [
          'Combina múltiples modelos base via un meta-modelo que aprende cuándo confiar en cada uno — usa predicciones out-of-fold para evitar leakage',
          'Apilar modelos en una pila LIFO',
          'Un modelo que se ejecuta sobre otro',
          'Un tipo de red neuronal',
        ],
        correctIndex: 0,
        explanation: 'Stacking: N modelos base predicen. Sus predicciones son features para un meta-modelo que aprende "confía en XGBoost para este perfil, en RandomForest para este otro". Crucial: out-of-fold predictions para evitar leakage.',
      },
      {
        question: '¿Qué son los SHAP values?',
        options: [
          'Descomponen una predicción en contribuciones por feature — muestran cuánto cada feature empujó la predicción desde el base value hasta el valor final',
          'Un tipo de regularización',
          'Una métrica de accuracy',
          'Un algoritmo de clustering',
        ],
        correctIndex: 0,
        explanation: 'SHAP asigna a cada feature un valor de contribución. Si el modelo predice 85% churn, SHAP muestra: edad +15%, transacciones_bajas +12%, buen_historial -8%. Crucial para compliance y debugging.',
      },
      {
        question: '¿Qué es la calibración de probabilidades?',
        options: [
          'Asegurar que cuando el modelo dice 80% de churn, el 80% realmente hace churn — modelos sin calibrar pueden estar sobre o subconfiados',
          'Ajustar la resolución de gráficas',
          'Equilibrar clases con SMOTE',
          'Normalizar features a media 0',
        ],
        correctIndex: 0,
        explanation: 'Un modelo puede tener buena AUC pero mala calibración: dice 90% cuando es 70%. Platt scaling o isotonic regression corrigen. Vital en scoring crediticio y médico.',
      },
    ],
  },
  resources: {
    docs: [
      { label: 'Documentación oficial', url: 'https://docs.python.org/3/' },
    ],
    books: [
      { label: 'Python 201 — Michael Driscoll', note: 'Capítulos relevantes para esta sección' },
    ],
    courses: [
      { label: 'Real Python', url: 'https://realpython.com', note: 'Tutoriales complementarios' },
    ],
  },
}
