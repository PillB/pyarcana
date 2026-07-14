import type { CourseSection } from '../../types'

export const section29: CourseSection = {
  id: 'mlops',
  index: 29,
  title: 'MLOps Avanzado — MLflow, DVC, Evidently',
  shortTitle: 'MLOps Avanzado — MLflow, DVC, ',
  tagline: 'Un modelo que no está monitoreado es un modelo que está fallando silenciosamente.',
  estimatedHours: 14,
  level: 'Senior',
  phase: 2,
  icon: 'Activity',
  accentColor: 'bg-gradient-to-br from-purple-500 to-fuchsia-600',
  jobRelevance: 'MLOps es el skill que separa Data Scientists de ML Engineers. Las empresas US buscan candidatos que puedan no solo entrenar modelos, sino desplegarlos, monitorearlos y retrenarlos automáticamente. MLflow, DVC y Evidently son el stack estándar de la industria.',
  learningOutcomes: [
    { text: 'Trackear experimentos ML con MLflow: parámetros, métricas, artifacts, modelo registry' },
    { text: 'Versionar datos y modelos con DVC integrado a Git' },
    { text: 'Detectar data drift y model drift con Evidently' },
    { text: 'Construir un pipeline de retraining automático cuando se detecta drift' },
    { text: 'Implementar A/B testing de modelos en producción' },
    { text: 'Usar MLflow Model Registry para gestionar ciclo de vida: Staging → Production → Archived' },
    { text: 'Servir modelos con MLflow serving o FastAPI' },
  ],
  theory: [
    {
      heading: 'MLflow: mlflow.start_run(), log_param(), log_metric(), log_artifact(), model registry con etapas',
      paragraphs: [
        'En esta lección vamos a explorar mlflow: mlflow.start_run(), log_param(), log_metric(), log_artifact(), model registry con etapas en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender mlflow: mlflow.start_run(), log_param(), log_metric(), log_artifact(), model registry con etapas es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, mlflow: mlflow.start_run(), log_param(), log_metric(), log_artifact(), model registry con etapas se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'DVC: dvc init, dvc add, dvc remote add, pipelines con dvc.yaml, dvc repro',
      paragraphs: [
        'En esta lección vamos a explorar dvc: dvc init, dvc add, dvc remote add, pipelines con dvc.yaml, dvc repro en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender dvc: dvc init, dvc add, dvc remote add, pipelines con dvc.yaml, dvc repro es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, dvc: dvc init, dvc add, dvc remote add, pipelines con dvc.yaml, dvc repro se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Evidently: DataDriftPreset, TargetDriftPreset, RegressionPreset — reportes HTML y JSON',
      paragraphs: [
        'En esta lección vamos a explorar evidently: datadriftpreset, targetdriftpreset, regressionpreset — reportes html y json en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender evidently: datadriftpreset, targetdriftpreset, regressionpreset — reportes html y json es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, evidently: datadriftpreset, targetdriftpreset, regressionpreset — reportes html y json se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Data drift vs model drift vs concept drift: diferencias, cómo detectar cada uno',
      paragraphs: [
        'En esta lección vamos a explorar data drift vs model drift vs concept drift: diferencias, cómo detectar cada uno en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender data drift vs model drift vs concept drift: diferencias, cómo detectar cada uno es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, data drift vs model drift vs concept drift: diferencias, cómo detectar cada uno se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Retraining triggers: por tiempo (semanal), por drift score threshold, por nuevos datos etiquetados',
      paragraphs: [
        'En esta lección vamos a explorar retraining triggers: por tiempo (semanal), por drift score threshold, por nuevos datos etiquetados en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender retraining triggers: por tiempo (semanal), por drift score threshold, por nuevos datos etiquetados es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, retraining triggers: por tiempo (semanal), por drift score threshold, por nuevos datos etiquetados se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'A/B testing de modelos: shadow mode, canary deployment, traffic splitting',
      paragraphs: [
        'En esta lección vamos a explorar a/b testing de modelos: shadow mode, canary deployment, traffic splitting en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender a/b testing de modelos: shadow mode, canary deployment, traffic splitting es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, a/b testing de modelos: shadow mode, canary deployment, traffic splitting se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
    {
      heading: 'Feature stores: por qué importan, Feast como ejemplo open source',
      paragraphs: [
        'En esta lección vamos a explorar feature stores: por qué importan, feast como ejemplo open source en profundidad. Este concepto es fundamental para tu crecimiento como profesional de Data Science y automatización. En el mercado laboral peruano e internacional, dominar este tema te diferencia claramente de otros candidatos.',

        'La clave para entender feature stores: por qué importan, feast como ejemplo open source es practicar con ejemplos reales. No basta con leer la teoría — necesitas escribir código, cometer errores, y aprender de ellos. Por eso cada concepto viene acompañado de ejemplos prácticos que puedes ejecutar en el editor interactivo.',

        'En producción, feature stores: por qué importan, feast como ejemplo open source se usa diario en empresas como Interbank, BBVA, Mercado Libre y Rimac. Los equipos de data science y automatización dependen de este conocimiento para construir pipelines robustos y escalables.',
      ],
    },
  ],
  iDo: {
    intro: 'Te muestro paso a paso cómo aplicar los conceptos de esta sección con ejemplos prácticos.',
    steps: [
      {
        description: 'Tomar el modelo de churn (sección 10) y agregar tracking completo con MLflow en todos los experimentos',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Tomar el modelo de churn (sección 10) y agregar tracking completo con MLflow en todos los experimentos\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
      {
        description: 'Versionar el dataset con DVC conectado a un bucket S3 (o localstack)',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Versionar el dataset con DVC conectado a un bucket S3 (o localstack)\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
      {
        description: 'Generar un reporte de drift con Evidently comparando datos de producción vs entrenamiento',
        code: {
          language: 'python',
          title: 'ejemplo.py',
          code: '# Ejemplo de: Generar un reporte de drift con Evidently comparando datos de producción vs entrenamiento\n# TODO: Implementar el código completo\nprint("Implementar este ejemplo")',
        },
        why: 'Este paso es importante porque demuestra el concepto en acción y te muestra el patrón correcto a seguir.',
      },
    ],
  },
  weDo: {
    intro: 'Ahora te toca a ti practicar con guía. Lee cada instrucción, intenta escribir el código, y si te trabas revisa la solución.',
    steps: [
      {
        instruction: 'Registrar el mejor modelo en MLflow Model Registry y transicionarlo a Production',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Registrar el mejor modelo en MLflow Model Registry y transicionarlo a Production\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Registrar el mejor modelo en MLflow Model Registry y transicionarlo a Production\nprint("Solución implementada")',
        },
      },
      {
        instruction: 'Construir un Prefect flow de retraining que corre cuando Evidently detecta drift > 0.3',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Construir un Prefect flow de retraining que corre cuando Evidently detecta drift > 0.3\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Construir un Prefect flow de retraining que corre cuando Evidently detecta drift > 0.3\nprint("Solución implementada")',
        },
      },
      {
        instruction: 'Implementar A/B testing: 10% del tráfico va al modelo nuevo (shadow mode)',
        hint: 'Piensa en cómo descomponer el problema en pasos más pequeños.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n# Implementar A/B testing: 10% del tráfico va al modelo nuevo (shadow mode)\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Solución\n# Implementar A/B testing: 10% del tráfico va al modelo nuevo (shadow mode)\nprint("Solución implementada")',
        },
      },
    ],
  },
  youDo: {
    title: 'ML Sistema Monitorizado',
    context: 'ml-ops-churn: experimentos con MLflow (≥ 10 runs con diferentes hiperparámetros); dataset versionado con DVC; modelo en producción sirviendo predicciones via FastAPI; monitoreo con Evidently (reporte automático diario de drift); pipeline de retraining con Prefect que se activa automáticamente cuando drift > umbral; Model Registry en MLflow con historial de versiones y performance.',
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
        question: '¿Cuál de los siguientes describe mejor: Trackear experimentos ML con MLflow: parámetros, métricas, artifacts, modelo registry?',
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
        question: '¿Cuál de los siguientes describe mejor: Versionar datos y modelos con DVC integrado a Git?',
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
        question: '¿Cuál de los siguientes describe mejor: Detectar data drift y model drift con Evidently?',
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
        question: '¿Cuál de los siguientes describe mejor: Construir un pipeline de retraining automático cuando se detecta drift?',
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
        question: '¿Cuál de los siguientes describe mejor: Implementar A/B testing de modelos en producción?',
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
      { label: 'MLflow docs', url: 'MLflow docs' },
      { label: 'DVC docs', url: 'DVC docs' },
      { label: 'Evidently AI docs', url: 'Evidently AI docs' },
      { label: 'AI Skills 2025 — MLOps guide', url: 'AI Skills 2025 — MLOps guide' },
    ],
    books: [
      { label: 'Python 201 — Michael Driscoll', note: 'Capítulos relevantes para esta sección' },
    ],
    courses: [
      { label: 'Real Python', url: 'https://realpython.com', note: 'Tutoriales complementarios' },
    ],
  },
}
