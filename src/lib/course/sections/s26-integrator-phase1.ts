import type { CourseSection } from '../../types'

export const section26: CourseSection = {
  id: 'integrator-phase1',
  index: 26,
  title: 'Proyecto Integrador Fase 1',
  shortTitle: 'Proyecto Integrador Fase 1',
  tagline: 'Integra todo lo aprendido en un sistema real que podrías vender.',
  estimatedHours: 16,
  level: 'Competente',
  phase: 1,
  icon: 'Award',
  accentColor: 'bg-gradient-to-br from-blue-500 to-indigo-600',
  jobRelevance: 'Capstone de Fase 1 que integra todas las competencias Competente en una sola plataforma vendible. Demuestra capacidad de diseñar sistemas end-to-end combinando backend, RAG, data pipelines, CV, entity resolution, RPA y dashboards. Diferenciador clave para entrevistas de mid-level.',
  learningOutcomes: [
    { text: 'Integrar backend FastAPI (S21), RAG chatbot (S20), pipeline de datos (S18-19), CV module (S23), entity resolution (S22), RPA bot (S24) y dashboard Streamlit (S25) en una plataforma coherente' },
    { text: 'Diseñar arquitectura de microservicios integrada con Docker Compose' },
    { text: 'Documentar arquitectura con Mermaid diagrams' },
    { text: 'Crear tests de integración para cada módulo del sistema' },
    { text: 'Producir demo video ejecutivo de 3-5 minutos' },
    { text: 'Reunir todos los componentes en un repositorio GitHub profesional' },
  ],
  theory: [
    {
      heading: 'Fundamentos',
      paragraphs: [
        'Esta sección cubre los conceptos esenciales del tema. Estudia cada bloque de teoría con atención y no pases al siguiente sin entender completamente el anterior.',
        'La práctica es clave. Usa el editor interactivo para experimentar con cada concepto antes de pasar a los ejercicios.',
      ],
    },
  ],
  iDo: {
    intro: 'Te muestro paso a paso cómo aplicar los conceptos de esta sección con ejemplos prácticos.',
    steps: [
      {
        description: 'Demostración del concepto principal',
        code: {
          language: 'python',
          title: 'demo.py',
          code: '"""Proyecto integrador: plataforma de IA."""\nfrom fastapi import FastAPI\nfrom pydantic import BaseModel\nimport structlog\n\nlogger = structlog.get_logger()\napp = FastAPI(title="AI Platform API", version="1.0.0")\n\nclass PredictionRequest(BaseModel):\n    user_id: str\n    features: dict\n\n@app.post("/predict")\nasync def predict(request: PredictionRequest):\n    logger.info("prediction_request", user_id=request.user_id)\n    prediction = sum(request.features.values()) / len(request.features)\n    return {"user_id": request.user_id, "prediction": prediction, "confidence": 0.87}\n\n# uvicorn main:app --reload --port 8000',
        },
        why: 'Un proyecto integrador combina multiples tecnologias en un sistema cohesivo. FastAPI sirve predicciones, Pydantic valida inputs/outputs, structlog registra eventos para auditoria. Cada componente es independiente pero se integra via contratos claros (schemas Pydantic).',
      },
    ],
  },
  weDo: {
    intro: 'Ahora te toca a ti practicar con guía. Lee cada instrucción, intenta escribir el código, y si te trabas revisa la solución.',
    steps: [
      {
        instruction: 'Practica el concepto principal de esta sección',
        hint: 'Revisa la teoría y el I Do antes de intentar este ejercicio.',
        starterCode: {
          language: 'python',
          title: 'ejercicio.py',
          code: '# Tu código aquí\n',
        },
        solutionCode: {
          language: 'python',
          title: 'solucion.py',
          code: '# Estructura del proyecto integrador\n"""\nai-platform/\n+-- api/           # FastAPI endpoints\n+-- models/        # Modelos ML (XGBoost, SHAP)\n+-- tests/         # pytest con >85% coverage\n+-- docker/        # Dockerfile multi-stage\n+-- k8s/           # Manifiestos Kubernetes\n+-- .github/       # CI/CD con GitHub Actions\n+-- README.md      # Documentacion completa\n"""\nprint("Estructura del proyecto integrador definida")',
        },
      },
    ],
  },
  youDo: {
    title: 'AI-Powered Automation Platform',
    context: 'ai-automation-platform — plataforma que integra todas las habilidades de Fase 1. Componentes: (1) Backend FastAPI (S21) API REST + WebSocket para datos en tiempo real; (2) RAG Chatbot (S20) con conocimiento del negocio sobre documentación; (3) Pipeline de Datos (S18-19) Prefect orquestando ingesta + transformación + almacenamiento; (4) CV Module (S23) endpoint de análisis de imágenes con YOLO; (5) Entity Resolution (S22) endpoint para deduplicar registros de clientes con RapidFuzz; (6) RPA Bot (S24) que automáticamente recolecta datos nuevos diariamente; (7) Dashboard (S25) Streamlit frontend que visualiza todo. Entregables: repositorio GitHub con README arquitectural (Mermaid diagram), Docker Compose con todos los servicios, tests de integración para cada módulo, demo video de 3-5 minutos mostrando el sistema en acción.',
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
        question: 'En un proyecto integrador, ¿cuál es el propósito principal de combinar múltiples tecnologías (FastAPI + ML + RAG + Docker)?',
        options: [
          'Demostrar que puedes construir un sistema end-to-end que resuelve un problema real — el diferenciador #1 en entrevistas Senior es mostrar arquitectura completa, no snippets aislados',
          'Usar tantas tecnologías como sea posible para impresionar',
          'Cumplir con requisitos de un curso',
          'Aprender una tecnología nueva por proyecto',
        ],
        correctIndex: 0,
        explanation: 'Un proyecto integrador demuestra que puedes conectar componentes: API (FastAPI) sirve predicciones de un modelo (ML), que consulta un knowledge base (RAG), todo containerizado (Docker). Esto muestra arquitectura de sistemas — la skill que diferencia Senior de Mid-level. Los reclutadores buscan proyectos que resuelvan problemas reales end-to-end.',
      },
      {
        question: '¿Qué incluye un README de un proyecto integrador de nivel profesional?',
        options: [
          'Descripción del problema, arquitectura (diagrama), instrucciones de instalación, uso, tests, y screenshots/demo del funcionamiento',
          'Solo el nombre del proyecto y el nombre del autor',
          'El código fuente completo sin explicación',
          'Una lista de dependencias sin instrucciones de uso',
        ],
        correctIndex: 0,
        explanation: 'Un README profesional incluye: (1) qué problema resuelve, (2) arquitectura con diagrama, (3) "docker-compose up" para levantar todo, (4) cómo usar la API con ejemplos curl, (5) tests con "pytest", (6) screenshots o GIF de la app funcionando. Sin esto, tu proyecto parece incompleto. Los reclutadores pasan <30s revisando un repo.',
      },
      {
        question: '¿Por qué es importante incluir tests en un proyecto integrador?',
        options: [
          'Porque demuestra madurez profesional — un proyecto sin tests es un prototype, no un producto. Tests también documentan el comportamiento esperado y previenen regresiones',
          'Porque es obligatorio para que el código compile',
          'Porque los tests aceleran la ejecución del código',
          'Porque sin tests no se puede desplegar en Docker',
        ],
        correctIndex: 0,
        explanation: 'Tests en un proyecto integrador demuestran: (1) sabes testing profesional, (2) tu código funciona como dices, (3) futuros cambios no rompen nada. Incluye: unit tests (pytest), integration tests (API endpoints), y opcionalmente E2E tests (Playwright). Un repo con badge "tests passing" genera confianza inmediata en entrevistas.',
      },
      {
        question: '¿Qué es un diagrama de arquitectura y por qué es esencial en un proyecto integrador?',
        options: [
          'Una representación visual de los componentes del sistema y cómo se comunican — aclara el diseño a stakeholders y demuestra que entiendes el sistema completo',
          'Un diagrama UML de clases',
          'Un esquema de base de datos',
          'Un mapa de sitio web',
        ],
        correctIndex: 0,
        explanation: 'Un diagrama de arquitectura muestra: API (FastAPI) → DB (PostgreSQL) → Model (ML) → Cache (Redis) → Frontend (Streamlit). Herramientas: draw.io, Excalidraw, o Mermaid en el README. El diagrama demuestra que piensas en sistemas, no solo en código. Es lo primero que mira un entrevistador Senior.',
      },
      {
        question: '¿Cuál es la mejor estrategia para presentar un proyecto integrador en una entrevista?',
        options: [
          'Demo en vivo (deploy funcionando) + explicación del problema + decisiones técnicas + métricas de impacto + lecciones aprendidas — en 5-10 minutos',
          'Mostrar todo el código línea por línea',
          'Leer el README en voz alta',
          'Solo mencionar que existe sin mostrar evidencia',
        ],
        correctIndex: 0,
        explanation: 'La mejor presentación: (1) "Este proyecto resuelve X problema", (2) demo en vivo (URL o screenshot), (3) "Usé FastAPI porque...", (4) "El modelo logró 87% AUC", (5) "Lo más difícil fue...". 5-10 minutos máximo. Los entrevistadores quieren ver que puedes comunicar decisiones técnicas, no que memorizaste código.',
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
