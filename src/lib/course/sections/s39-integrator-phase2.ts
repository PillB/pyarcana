import type { CourseSection } from '../../types'

export const section39: CourseSection = {
  id: 'integrator-phase2',
  index: 39,
  title: 'Proyecto Integrador Fase 2',
  shortTitle: 'Proyecto Integrador Fase 2',
  tagline: 'Un sistema de IA Senior que cualquier startup querría contratar para construir.',
  estimatedHours: 18,
  level: 'Senior',
  phase: 2,
  icon: 'Trophy',
  accentColor: 'bg-gradient-to-br from-purple-500 to-fuchsia-600',
  jobRelevance: 'Capstone Senior que demuestra capacidad de diseñar y operar sistemas AI end-to-end a nivel Senior. Diferenciador claro para roles Senior AI Engineer ($130K-$180K). Es el proyecto que se presenta como caso de estudio principal en entrevistas de sistema.',
  learningOutcomes: [
    { text: 'Integrar multi-agent LangGraph (S28) coordinando tareas automáticamente' },
    { text: 'Construir MLOps pipeline (S29) con monitoreo de drift y retraining automático' },
    { text: 'Desplegar en Kubernetes (S32) con CI/CD y observabilidad' },
    { text: 'Implementar streaming Kafka (S31) para eventos en tiempo real' },
    { text: 'Integrar Smart CV module (S34) con análisis LLM de imágenes' },
    { text: 'Documentar ADR (S35) para las principales decisiones arquitecturales' },
    { text: 'Desplegar sistema completamente en la nube (GCP/AWS free tier)' },
    { text: 'Comunicar arquitectura a stakeholders de negocio con presentation deck de 10 slides' },
  ],
  theory: [
    {
      heading: 'Arquitectura del proyecto integrador Senior',
      paragraphs: [
        'El proyecto integrador de Fase 2 consolida todas las skills Senior en un sistema end-to-end: ingesta de datos con Kafka, microservicio de inferencia con FastAPI + Docker + Kubernetes, modelo XGBoost con SHAP para interpretabilidad, y dashboard de monitoreo con Streamlit + Prometheus + Grafana. El objetivo es construir un sistema que cualquier startup peruana querría contratar para construir: un pipeline de scoring crediticio en tiempo real que procesa transacciones, calcula riesgo, y muestra resultados en un dashboard.',
        'La arquitectura del sistema tiene 5 componentes: (1) Kafka producer que envía eventos de transacciones, (2) FastAPI microservicio que consume eventos, extrae features del feature store, y llama al modelo XGBoost para scoring, (3) MLflow model registry para versionar y servir el modelo, (4) Prometheus + Grafana para monitorear latency, throughput, error rate, y model drift, (5) Streamlit dashboard para visualizar predicciones en tiempo real y alertas. Cada componente se despliega independientemente en Kubernetes con rolling updates zero-downtime.',
        'El CI/CD pipeline usa GitHub Actions: en cada push a main, se ejecutan tests con pytest (>85% cobertura), se construye la imagen Docker, se publica en GitHub Container Registry, y se despliega a Kubernetes con `kubectl apply`. El despliegue es canary: 10% del tráfico va a la nueva versión, 90% a la antigua. Si no hay errores en 30 minutos, el canary sube a 100%. Si hay errores, rollback automático. Este patrón es estándar en empresas US y es lo que diferencia a un Senior de un Mid-level.',
      ],
    },
  ],
  iDo: {
    intro: 'Te muestro paso a paso cómo aplicar los conceptos de esta sección con ejemplos prácticos.',
    steps: [
      {
        description: 'Diseñar la arquitectura del sistema integrador con diagrama',
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
        instruction: 'Implementa el componente de ingesta de datos con Kafka producer',
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
    title: 'End-to-End AI Platform Senior',
    context: 'ai-platform-senior — evolución del proyecto integrador de Fase 1 con capacidades senior. Componentes adicionales: Multi-agent LangGraph (S28) coordinando tareas automáticamente; MLOps pipeline (S29) con monitoreo de drift y retraining automático; Kubernetes deployment (S32) con CI/CD y observabilidad; Streaming Kafka (S31) para eventos en tiempo real; Smart CV module (S34) con análisis LLM de imágenes; ADR documentado (S35) para las principales decisiones arquitecturales. Entregables: sistema completamente deployado en la nube (GCP/AWS free tier); architecture diagram con Mermaid; presentation deck de 10 slides explicando el sistema a un stakeholder de negocio.',
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
        question: '¿Qué componentes debe integrar un proyecto Senior end-to-end?',
        options: [
          'Ingesta (Kafka) + API (FastAPI) + ML (XGBoost/SHAP) + Monitoring (Prometheus/Grafana) + Dashboard (Streamlit) + CI/CD',
          'Solo un modelo de ML',
          'Solo una API',
          'Solo un dashboard',
        ],
        correctIndex: 0,
        explanation: 'Un proyecto Senior integra 5+ componentes: streaming de datos, microservicio de inferencia, modelo con interpretabilidad, monitoring de drift/latency, y dashboard. Cada componente desplegado independientemente en K8s con CI/CD.',
      },
      {
        question: '¿Qué es un canary deployment?',
        options: [
          'Desplegar a 10% del tráfico primero, monitorear errores, y si todo va bien subir a 100% — si hay errores, rollback automático',
          'Desplegar en un canalario (canary) literal',
          'Desplegar solo los datos',
          'Desplegar solo la documentación',
        ],
        correctIndex: 0,
        explanation: 'Canary: 10% del tráfico va a la nueva versión, 90% a la antigua. Si error rate < 1% en 30 min, sube a 100%. Si hay errores, rollback automático. Es el patrón estándar en empresas US para despliegues zero-downtime.',
      },
      {
        question: '¿Qué métricas debe monitorear un sistema de ML en producción?',
        options: [
          'Latency p99, throughput (QPS), error rate, model drift, data drift, y cost per prediction',
          'Solo accuracy',
          'Solo CPU usage',
          'Solo número de requests',
        ],
        correctIndex: 0,
        explanation: 'Métricas operacionales: latency p99 < 100ms, error rate < 0.1%. Métricas de ML: drift (KS test), accuracy en production, feature distribution. Métricas de negocio: cost per prediction, ROI del modelo. Prometheus + Grafana visualiza todo.',
      },
      {
        question: '¿Por qué es importante el graceful shutdown en microservicios?',
        options: [
          'Permite cerrar conexiones de DB, terminar requests en vuelo, y flush de logs antes de morir — sin esto, pierdes datos o dejas connections abiertas',
          'Es apagar el servidor con elegancia',
          'Es un patrón de diseño visual',
          'Es obligatorio por ley',
        ],
        correctIndex: 0,
        explanation: 'Graceful shutdown: al recibir SIGTERM (K8s lo envía antes de matar el pod), el servicio deja de aceptar nuevos requests, termina los en vuelo, cierra DB connections, y flusha logs. Sin esto, requests en proceso se cortan y connections quedan zombie.',
      },
      {
        question: '¿Qué incluye un CI/CD pipeline para ML?',
        options: [
          'Tests (pytest) → Lint (ruff) → Build Docker → Deploy Canary → Smoke tests → Promote to 100%',
          'Solo tests unitarios',
          'Solo deploy',
          'Solo lint',
        ],
        correctIndex: 0,
        explanation: 'CI/CD ML: (1) pytest con >85% coverage, (2) ruff lint, (3) build Docker image, (4) push a registry, (5) deploy canary 10%, (6) smoke tests automatizados, (7) promote 100% si pasa. Todo automatizado en GitHub Actions o GitLab CI.',
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
