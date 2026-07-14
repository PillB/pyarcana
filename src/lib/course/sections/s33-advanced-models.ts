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
          code: '# Demostración del concepto\nprint("Hola desde la demostración")',
        },
        why: 'Esta demostración te muestra cómo aplicar el concepto en un caso real.',
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
          code: '# Solución de referencia\nprint("Solución")',
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
        question: '¿Cuál de los siguientes describe mejor: Dominar XGBoost, LightGBM y CatBoost: hiperparámetros clave, early stopping, categorical features?',
        options: [
          'Respuesta correcta',
          'Respuesta incorrecta 1',
          'Respuesta incorrecta 2',
          'Respuesta incorrecta 3',
        ],
        correctIndex: 0,
        explanation: 'Esta es la respuesta correcta porque aplica el concepto de manera precisa.',
      },
      {
        question: '¿Cuál de los siguientes describe mejor: Implementar Stacking y Blending de modelos con scikit-learn StackingClassifier?',
        options: [
          'Respuesta correcta',
          'Respuesta incorrecta 1',
          'Respuesta incorrecta 2',
          'Respuesta incorrecta 3',
        ],
        correctIndex: 0,
        explanation: 'Esta es la respuesta correcta porque aplica el concepto de manera precisa.',
      },
      {
        question: '¿Cuál de los siguientes describe mejor: Optimizar hiperparámetros con Optuna (bayesian optimization) vs GridSearchCV?',
        options: [
          'Respuesta correcta',
          'Respuesta incorrecta 1',
          'Respuesta incorrecta 2',
          'Respuesta incorrecta 3',
        ],
        correctIndex: 0,
        explanation: 'Esta es la respuesta correcta porque aplica el concepto de manera precisa.',
      },
      {
        question: '¿Cuál de los siguientes describe mejor: Interpretar modelos con SHAP: global e individual explanations, dependence plots?',
        options: [
          'Respuesta correcta',
          'Respuesta incorrecta 1',
          'Respuesta incorrecta 2',
          'Respuesta incorrecta 3',
        ],
        correctIndex: 0,
        explanation: 'Esta es la respuesta correcta porque aplica el concepto de manera precisa.',
      },
      {
        question: '¿Cuál de los siguientes describe mejor: Construir pipelines de ML production-grade con scikit-learn Pipelines + ColumnTransformer?',
        options: [
          'Respuesta correcta',
          'Respuesta incorrecta 1',
          'Respuesta incorrecta 2',
          'Respuesta incorrecta 3',
        ],
        correctIndex: 0,
        explanation: 'Esta es la respuesta correcta porque aplica el concepto de manera precisa.',
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
