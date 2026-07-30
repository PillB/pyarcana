'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useMemo, useState, useRef, useCallback } from 'react'
import {
  ExternalLink,
  Library,
  GraduationCap,
  FileText,
  Bookmark,
  ShieldCheck,
  Scale,
  Code2,
  Brain,
  FlaskConical,
  Search,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  Globe,
  Lock,
  Building2,
  Briefcase,
  Database,
  Award,
  Wrench,
  Keyboard,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Resources } from '@/lib/types'
import { LegalDisclaimer } from './LegalDisclaimer'
import { cn } from '@/lib/utils'

interface ResourcesPageProps {
  sections: { id: string; title: string; shortTitle: string; resources: Resources }[]
}

// ────────────────────────────────────────────────────────────────────────────
// Resource catalogue type
// ────────────────────────────────────────────────────────────────────────────
export type ResourceType =
  | 'official_documentation'
  | 'course'
  | 'practice'
  | 'reference'
  | 'standard'
  | 'tool'
  | 'career'
  | 'certification'
  | 'dataset'

export type ResourceLevel = 'foundation' | 'independent' | 'advanced' | 'reference'
export type ResourceAccess =
  | 'free'
  | 'free_with_optional_paid_certificate'
  | 'paid'
  | 'varies'
export type ResourceStatus = 'active' | 'changed' | 'retired' | 'unavailable'

export interface Resource {
  id: string
  title: string
  provider: string
  canonicalUrl: string
  resourceType: ResourceType
  topics: string[]
  sectionIds: string[]
  level: ResourceLevel
  language: string[] // ['es', 'en']
  access: ResourceAccess
  official: boolean
  whyUseful: string
  lastVerifiedAt: string
  status: ResourceStatus
}

// ────────────────────────────────────────────────────────────────────────────
// Curated catalogue — 60+ resources.
//
// Selection criteria (per Solarized spec):
//   - Official documentation first (Python.org, NumPy, pandas, etc.).
//   - Free or freemium courses from reputable providers (CS50P, Kaggle Learn,
//     freeCodeCamp).
//   - Practice platforms with public, no-login-needed problems.
//   - Standards (OWASP, NIST, SemVer, RFCs) — not tutorials.
//   - Career frameworks (O*NET, SFIA) so learners can map skills to job
//     descriptions without us making employment claims.
//   - Datasets used in exercises (synthetic only — no scraped personal data).
//
// Every entry has a `lastVerifiedAt` so the test suite can flag stale links.
// ────────────────────────────────────────────────────────────────────────────
const NOW = '2025-07-29'

const RESOURCES: Resource[] = [
  // ── Python core ─────────────────────────────────────────────────────────
  {
    id: 'python-downloads',
    title: 'Python.org — Downloads',
    provider: 'Python Software Foundation',
    canonicalUrl: 'https://www.python.org/downloads/',
    resourceType: 'official_documentation',
    topics: ['python', 'installation', 'setup'],
    sectionIds: ['s01-setup'],
    level: 'foundation',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Instalador oficial de Python para Windows, macOS y Linux. Esto es, el programa que necesitas para ejecutar código Python en tu computadora.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'python-tutorial',
    title: 'Python — Tutorial oficial',
    provider: 'Python Software Foundation',
    canonicalUrl: 'https://docs.python.org/3/tutorial/',
    resourceType: 'official_documentation',
    topics: ['python', 'syntax', 'control-flow', 'functions'],
    sectionIds: ['s01-setup', 's02-basics', 's03-data-structures', 's04-functions-modules'],
    level: 'foundation',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Recorrido oficial del lenguaje, sección por sección. Si tienes una duda sobre cómo funciona algo del lenguaje, esta es la fuente de verdad.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'python-stdlib',
    title: 'Python — Biblioteca estándar',
    provider: 'Python Software Foundation',
    canonicalUrl: 'https://docs.python.org/3/library/index.html',
    resourceType: 'official_documentation',
    topics: ['python', 'stdlib', 'modules'],
    sectionIds: ['s04-functions-modules', 's15-stdlib-deep'],
    level: 'reference',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Todo lo que viene incluido sin instalar nada extra. Esto es, módulos como `os`, `pathlib`, `json`, `datetime` que ya están listos al instalar Python.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'python-venv',
    title: 'Python — venv',
    provider: 'Python Software Foundation',
    canonicalUrl: 'https://docs.python.org/3/library/venv.html',
    resourceType: 'official_documentation',
    topics: ['python', 'venv', 'environment', 'setup'],
    sectionIds: ['s01-setup'],
    level: 'foundation',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Entornos virtuales: una carpeta aislada con su propio Python y librerías. Esto es, lo que evita que los paquetes de un proyecto se mezclen con los de otro.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'pip-user-guide',
    title: 'pip — User Guide',
    provider: 'Python Packaging Authority',
    canonicalUrl: 'https://pip.pypa.io/en/stable/user_guide/',
    resourceType: 'official_documentation',
    topics: ['python', 'pip', 'packaging', 'dependencies'],
    sectionIds: ['s01-setup', 's17-packaging'],
    level: 'foundation',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Cómo instalar paquetes y congelar versiones con requirements.txt. Esto es, cómo declarar qué librerías usa tu proyecto para que otra persona las instale igual.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'pep-0008',
    title: 'PEP 8 — Style Guide',
    provider: 'Python Enhancement Proposals',
    canonicalUrl: 'https://peps.python.org/pep-0008/',
    resourceType: 'standard',
    topics: ['python', 'style', 'conventions'],
    sectionIds: ['s01-setup', 's02-basics'],
    level: 'reference',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Convenciones de estilo: snake_case para funciones, UPPER_CASE para constantes. Esto es, las reglas que sigue la comunidad al escribir Python para que el código sea legible.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'pep-0257',
    title: 'PEP 257 — Docstrings',
    provider: 'Python Enhancement Proposals',
    canonicalUrl: 'https://peps.python.org/pep-0257/',
    resourceType: 'standard',
    topics: ['python', 'docstrings', 'documentation'],
    sectionIds: ['s04-functions-modules', 's11-testing'],
    level: 'reference',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Cómo documentar funciones y clases con triples comillas. Esto es, la convención oficial para que tu código explique qué hace sin que el lector tenga que adivinar.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'python-packaging-guide',
    title: 'Python Packaging User Guide',
    provider: 'Python Packaging Authority',
    canonicalUrl: 'https://packaging.python.org/en/latest/',
    resourceType: 'official_documentation',
    topics: ['python', 'packaging', 'pyproject-toml'],
    sectionIds: ['s17-packaging'],
    level: 'independent',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Empaquetar y distribuir tu propio paquete. Esto es, cómo convertir tu código en algo instalable con `pip install tu-paquete`.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'ruff-docs',
    title: 'Ruff — documentation',
    provider: 'Astral',
    canonicalUrl: 'https://docs.astral.sh/ruff/',
    resourceType: 'tool',
    topics: ['python', 'linter', 'formatter', 'ruff'],
    sectionIds: ['s01-setup', 's11-testing'],
    level: 'foundation',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Linter y formateador moderno; configúralo con `[tool.ruff]` en `pyproject.toml`. Esto es, la herramienta que te avisa de errores de estilo y los arregla sola.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'vscode-python-ext',
    title: 'VS Code — Python extension',
    provider: 'Microsoft',
    canonicalUrl: 'https://marketplace.visualstudio.com/items?itemName=ms-python.python',
    resourceType: 'tool',
    topics: ['python', 'editor', 'vscode', 'setup'],
    sectionIds: ['s01-setup'],
    level: 'foundation',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Extensión oficial de Microsoft para VS Code: IntelliSense, debugging, pruebas y formato. Esto es, lo que convierte VS Code en un IDE para Python.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'github-quickstart',
    title: 'GitHub Docs — Quickstart',
    provider: 'GitHub',
    canonicalUrl: 'https://docs.github.com/es/get-started/quickstart',
    resourceType: 'official_documentation',
    topics: ['git', 'github', 'version-control'],
    sectionIds: ['s01-setup'],
    level: 'foundation',
    language: ['es', 'en'],
    access: 'free',
    official: true,
    whyUseful: 'Primeros pasos con GitHub en español. Esto es, cómo crear un repositorio, hacer tu primer commit y abrir un Pull Request.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'github-skills',
    title: 'GitHub Skills',
    provider: 'GitHub',
    canonicalUrl: 'https://skills.github.com/',
    resourceType: 'course',
    topics: ['git', 'github', 'version-control'],
    sectionIds: ['s01-setup'],
    level: 'foundation',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Labs interactivos oficiales de Git/GitHub (sucesor de Learning Lab). Esto es, prácticas guiadas que se califican automáticamente dentro de un repo real.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'conventional-commits',
    title: 'Conventional Commits',
    provider: 'Conventional Commits',
    canonicalUrl: 'https://www.conventionalcommits.org/',
    resourceType: 'standard',
    topics: ['git', 'commits', 'conventions'],
    sectionIds: ['s01-setup'],
    level: 'foundation',
    language: ['es', 'en'],
    access: 'free',
    official: true,
    whyUseful: 'Estándar para mensajes de commit como `feat:`, `fix:`, `docs:`. Esto es, una convención que facilita generar changelogs y versionar releases automáticamente.',
    lastVerifiedAt: NOW,
    status: 'active',
  },

  // ── NumPy / pandas / visualization ───────────────────────────────────────
  {
    id: 'numpy-user-guide',
    title: 'NumPy — User Guide',
    provider: 'NumPy',
    canonicalUrl: 'https://numpy.org/doc/stable/user/',
    resourceType: 'official_documentation',
    topics: ['numpy', 'arrays', 'broadcasting'],
    sectionIds: ['s06-numpy'],
    level: 'independent',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Vectores y broadcasting (operar arrays de formas distintas) bien explicados. Esto es, cómo hacer cálculo numérico eficiente sin escribir bucles explícitos.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'numpy-beginners',
    title: 'NumPy — Absolute beginners',
    provider: 'NumPy',
    canonicalUrl: 'https://numpy.org/doc/stable/user/absolute_beginners.html',
    resourceType: 'official_documentation',
    topics: ['numpy', 'arrays', 'beginners'],
    sectionIds: ['s06-numpy'],
    level: 'foundation',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Primeros pasos con NumPy sin asumir nada previo. Esto es, la entrada más suave antes de mirar la User Guide completa.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'pandas-docs',
    title: 'Pandas — documentation',
    provider: 'pandas',
    canonicalUrl: 'https://pandas.pydata.org/docs/',
    resourceType: 'official_documentation',
    topics: ['pandas', 'dataframes', 'data-analysis'],
    sectionIds: ['s07-pandas', 's08-pandas'],
    level: 'independent',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'La referencia oficial de pandas. Esto es, lo que miras cuando una operación con DataFrames no te entrega lo que esperabas.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'pandas-merging',
    title: 'Pandas — Merge, join, concatenate',
    provider: 'pandas',
    canonicalUrl: 'https://pandas.pydata.org/docs/user_guide/merging.html',
    resourceType: 'official_documentation',
    topics: ['pandas', 'merge', 'join'],
    sectionIds: ['s08-pandas'],
    level: 'independent',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Unir tablas sin inflar filas ni perder registros. Esto es, las operaciones que necesitas cuando dos DataFrames comparten una columna clave.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'matplotlib-tutorials',
    title: 'Matplotlib — tutorials',
    provider: 'Matplotlib',
    canonicalUrl: 'https://matplotlib.org/stable/tutorials/index.html',
    resourceType: 'official_documentation',
    topics: ['matplotlib', 'visualization', 'plotting'],
    sectionIds: ['s08-visualization', 's09-visualization'],
    level: 'independent',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Galería y ejemplos: copia, adapta y aprende. Esto es, la forma más rápida de encontrar cómo hacer el gráfico que tienes en la cabeza.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'matplotlib-cheatsheets',
    title: 'Matplotlib — cheatsheets',
    provider: 'Matplotlib',
    canonicalUrl: 'https://matplotlib.org/cheatsheets/',
    resourceType: 'reference',
    topics: ['matplotlib', 'visualization', 'cheatsheet'],
    sectionIds: ['s08-visualization'],
    level: 'reference',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Hojas de referencia rápida para imprimir. Esto es, un PDF de una página con las llamadas más comunes para no buscarlas cada vez.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'seaborn-tutorial',
    title: 'seaborn — tutorial',
    provider: 'seaborn',
    canonicalUrl: 'https://seaborn.pydata.org/tutorial.html',
    resourceType: 'official_documentation',
    topics: ['seaborn', 'visualization', 'statistical'],
    sectionIds: ['s09-visualization'],
    level: 'independent',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Gráficos estadísticos con una línea de código. Esto es, una capa sobre matplotlib pensada para relaciones entre variables.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'plotly-python',
    title: 'Plotly Python',
    provider: 'Plotly',
    canonicalUrl: 'https://plotly.com/python/',
    resourceType: 'official_documentation',
    topics: ['plotly', 'visualization', 'interactive'],
    sectionIds: ['s25-streamlit-dashboards'],
    level: 'independent',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Gráficos interactivos para dashboards. Esto es, visualizaciones que el usuario puede ampliar, filtrar y explorar en el navegador.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'data-to-viz',
    title: 'From Data to Viz',
    provider: 'data-to-viz.com',
    canonicalUrl: 'https://www.data-to-viz.com/',
    resourceType: 'reference',
    topics: ['visualization', 'decision-tree'],
    sectionIds: ['s09-visualization'],
    level: 'reference',
    language: ['en'],
    access: 'free',
    official: false,
    whyUseful: 'Árbol de decisión: qué gráfico usar según tu tipo de dato. Esto es, una guía que te lleva desde la forma de tus datos hasta el tipo de gráfico adecuado.',
    lastVerifiedAt: NOW,
    status: 'active',
  },

  // ── scikit-learn / ML / AI ───────────────────────────────────────────────
  {
    id: 'sklearn-user-guide',
    title: 'scikit-learn — User Guide',
    provider: 'scikit-learn',
    canonicalUrl: 'https://scikit-learn.org/stable/user_guide.html',
    resourceType: 'official_documentation',
    topics: ['scikit-learn', 'machine-learning', 'pipeline'],
    sectionIds: ['s10-sklearn'],
    level: 'independent',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Pipeline, ColumnTransformer y cross-validation. Esto es, las piezas para entrenar y evaluar modelos sin que se te cuelen datos del test al entrenamiento.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'google-ml-crash-course',
    title: 'Google ML Crash Course',
    provider: 'Google',
    canonicalUrl: 'https://developers.google.com/machine-learning/crash-course',
    resourceType: 'course',
    topics: ['machine-learning', 'supervised', 'introduction'],
    sectionIds: ['s10-sklearn'],
    level: 'independent',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Curso gratuito con framing práctico de ML supervisado. Esto es, una introducción seria que combina teoría y código sin asumir背景 de matemáticas.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'google-mlops-whitepaper',
    title: 'Google MLOps whitepaper',
    provider: 'Google Cloud',
    canonicalUrl: 'https://cloud.google.com/resources/mlops-whitepaper',
    resourceType: 'reference',
    topics: ['mlops', 'production', 'ml'],
    sectionIds: ['s29-mlops', 's43-llmops'],
    level: 'advanced',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Cómo llevar modelos a producción sin que se degraden con el tiempo. Esto es, las prácticas de operaciones para ML (monitorización, reentrenamiento, versionado).',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'google-model-cards',
    title: 'Google Model Cards',
    provider: 'Google',
    canonicalUrl: 'https://modelcards.withgoogle.com/',
    resourceType: 'reference',
    topics: ['ai', 'responsible-ai', 'model-cards', 'documentation'],
    sectionIds: ['s48-ai-governance'],
    level: 'advanced',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Plantilla para documentar límites y uso responsable de un modelo. Esto es, una hoja de vida corta del modelo que aclara qué hace, qué no hace y para quién fue diseñado.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'openai-cookbook-recipes',
    title: 'OpenAI Recipes & Examples',
    provider: 'OpenAI',
    canonicalUrl: 'https://cookbook.openai.com/',
    resourceType: 'reference',
    topics: ['llm', 'rag', 'embeddings', 'function-calling'],
    sectionIds: ['s20-rag', 's28-llm-agents'],
    level: 'advanced',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Recetas prácticas para RAG, embeddings y function calling. Esto es, ejemplos copiables que resuelven tareas concretas con LLMs.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'langchain-rag-tutorial',
    title: 'LangChain — RAG tutorial',
    provider: 'LangChain',
    canonicalUrl: 'https://python.langchain.com/docs/tutorials/rag/',
    resourceType: 'official_documentation',
    topics: ['langchain', 'rag', 'llm'],
    sectionIds: ['s20-rag'],
    level: 'advanced',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Construir un sistema que "lee" tus documentos antes de responder. Esto es, una arquitectura para que un LLM cite fuentes propias en vez de inventar.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'llamaindex-docs',
    title: 'LlamaIndex — docs',
    provider: 'LlamaIndex',
    canonicalUrl: 'https://docs.llamaindex.ai/',
    resourceType: 'official_documentation',
    topics: ['llamaindex', 'rag', 'indexing'],
    sectionIds: ['s20-rag', 's42-graph-rag'],
    level: 'advanced',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Framework para indexar y consultar conocimiento propio. Esto es, una alternativa a LangChain centrada en conectar fuentes de datos con LLMs.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'hf-nlp-course',
    title: 'Hugging Face — NLP course',
    provider: 'Hugging Face',
    canonicalUrl: 'https://huggingface.co/learn/nlp-course',
    resourceType: 'course',
    topics: ['nlp', 'transformers', 'hugging-face'],
    sectionIds: ['s28-llm-agents'],
    level: 'advanced',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Modelos abiertos y cómo usarlos en producción. Esto es, cómo entrenar y servir modelos transformer con la biblioteca `transformers`.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'mlflow-tracking',
    title: 'MLflow Tracking',
    provider: 'MLflow',
    canonicalUrl: 'https://mlflow.org/docs/latest/tracking/',
    resourceType: 'official_documentation',
    topics: ['mlflow', 'experiment-tracking', 'mlops'],
    sectionIds: ['s29-mlops'],
    level: 'advanced',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Registrar cada experimento para compararlo y reproducirlo. Esto es, el sistema que guarda hiperparámetros, métricas y artefactos por cada corrida.',
    lastVerifiedAt: NOW,
    status: 'active',
  },

  // ── Engineering / testing / APIs ─────────────────────────────────────────
  {
    id: 'pytest-docs',
    title: 'pytest — documentation',
    provider: 'pytest',
    canonicalUrl: 'https://docs.pytest.org/',
    resourceType: 'official_documentation',
    topics: ['pytest', 'testing', 'fixtures'],
    sectionIds: ['s11-testing'],
    level: 'independent',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Testing que no duerme: fixtures, parametrize y coverage. Esto es, el marco de pruebas más usado en Python para escribir tests legibles y reutilizables.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'coverage-py',
    title: 'Coverage.py',
    provider: 'Ned Batchelder',
    canonicalUrl: 'https://coverage.readthedocs.io/',
    resourceType: 'tool',
    topics: ['coverage', 'testing', 'metrics'],
    sectionIds: ['s11-testing'],
    level: 'independent',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Mide qué líneas de tu código realmente ejecutan tus tests. Esto es, una métrica para decidir si te falta probar un camino antes de publicar.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'hypothesis',
    title: 'Hypothesis — property testing',
    provider: 'Hypothesis',
    canonicalUrl: 'https://hypothesis.readthedocs.io/',
    resourceType: 'tool',
    topics: ['property-testing', 'testing', 'hypothesis'],
    sectionIds: ['s11-testing'],
    level: 'advanced',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Genera casos de borde automáticamente en vez de escribirlos a mano. Esto es, declaras invariantes y la biblioteca busca ejemplos que los rompan.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'fastapi-tutorial',
    title: 'FastAPI — tutorial',
    provider: 'FastAPI',
    canonicalUrl: 'https://fastapi.tiangolo.com/tutorial/',
    resourceType: 'official_documentation',
    topics: ['fastapi', 'api', 'rest'],
    sectionIds: ['s21-fastapi'],
    level: 'independent',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'APIs HTTP modernas con tipado y documentación automática. Esto es, una forma de exponer funciones Python como endpoints REST con OpenAPI gratis.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'pydantic-docs',
    title: 'Pydantic',
    provider: 'Pydantic',
    canonicalUrl: 'https://docs.pydantic.dev/',
    resourceType: 'official_documentation',
    topics: ['pydantic', 'validation', 'types'],
    sectionIds: ['s21-fastapi'],
    level: 'independent',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Validación de datos basada en tipos de Python. Esto es, declaras clases con campos tipados y Pydantic valida y convierte los valores de entrada.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'docker-best-practices',
    title: 'Docker — best practices',
    provider: 'Docker',
    canonicalUrl: 'https://docs.docker.com/develop/dev-best-practices/',
    resourceType: 'official_documentation',
    topics: ['docker', 'containers', 'devops'],
    sectionIds: ['s32-microservices'],
    level: 'advanced',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Imágenes reproducibles y seguras para tu servicio. Esto es, cómo escribir Dockerfiles que construyan rápido y no incluyan secretos ni capas inútiles.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'dbt-docs',
    title: 'dbt — docs',
    provider: 'dbt Labs',
    canonicalUrl: 'https://docs.getdbt.com/',
    resourceType: 'official_documentation',
    topics: ['dbt', 'data-engineering', 'sql', 'transformations'],
    sectionIds: ['s18-data-engineering', 's37-dbt-bigquery'],
    level: 'advanced',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Transformaciones SQL versionadas y testeadas en tu warehouse. Esto es, un marco para escribir modelos de datos con dependencias y pruebas como si fuera código.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'great-expectations',
    title: 'Great Expectations',
    provider: 'Great Expectations',
    canonicalUrl: 'https://docs.greatexpectations.io/',
    resourceType: 'tool',
    topics: ['data-quality', 'validation', 'data-contracts'],
    sectionIds: ['s49-data-contracts'],
    level: 'advanced',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Validación de datos: contratos que fallan pronto si el dato llega mal. Esto es, reglas declarativas sobre el shape y contenido de tus tablas.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'opentelemetry-docs',
    title: 'OpenTelemetry',
    provider: 'OpenTelemetry',
    canonicalUrl: 'https://opentelemetry.io/docs/',
    resourceType: 'standard',
    topics: ['observability', 'telemetry', 'tracing'],
    sectionIds: ['s09-observability'],
    level: 'advanced',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Observabilidad estándar: logs, métricas y trazas en un solo lugar. Esto es, un estándar abierto para no quedar atado a un solo proveedor de monitoreo.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'twelve-factor-app',
    title: 'Twelve-Factor App',
    provider: 'Heroku / 12factor.net',
    canonicalUrl: 'https://12factor.net/',
    resourceType: 'reference',
    topics: ['architecture', 'cloud', 'best-practices'],
    sectionIds: ['s35-system-design'],
    level: 'advanced',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Principios para apps que corren bien en la nube. Esto es, doce reglas sobre configuración, logs, dependencias y procesos que conviene aplicar desde el día 1.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'c4-model',
    title: 'C4 model',
    provider: 'c4model.com',
    canonicalUrl: 'https://c4model.com/',
    resourceType: 'reference',
    topics: ['architecture', 'diagrams', 'documentation'],
    sectionIds: ['s35-system-design'],
    level: 'advanced',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Diagramas de arquitectura con cuatro niveles de zoom. Esto es, una forma de dibujar sistemas que parte del contexto y baja hasta el componente.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'adr-github',
    title: 'Architecture Decision Records',
    provider: 'adr.github.io',
    canonicalUrl: 'https://adr.github.io/',
    resourceType: 'reference',
    topics: ['architecture', 'decisions', 'documentation'],
    sectionIds: ['s35-system-design', 's40-architecture-ddd'],
    level: 'advanced',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Documentar por qué tomaste tal decisión, no solo qué decidiste. Esto es, archivos cortos en el repo que capturan contexto, alternativas y consecuencias.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'apache-airflow',
    title: 'Apache Airflow',
    provider: 'Apache Software Foundation',
    canonicalUrl: 'https://airflow.apache.org/docs/',
    resourceType: 'tool',
    topics: ['orchestration', 'pipelines', 'scheduling'],
    sectionIds: ['s18-data-engineering'],
    level: 'advanced',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Orquestador de pipelines batch: DAGs programados y monitoreados. Esto es, una herramienta para que tus tareas de datos corran en orden y con reintentos.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'sre-slo',
    title: 'Google SRE — Service Level Objectives',
    provider: 'Google SRE',
    canonicalUrl: 'https://sre.google/service-level-objectives/',
    resourceType: 'reference',
    topics: ['sre', 'slo', 'reliability'],
    sectionIds: ['s35-system-design'],
    level: 'advanced',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Acuerdos medibles de calidad de servicio. Esto es, cómo definir objetivos de disponibilidad y error budget sin pedir "100% uptime".',
    lastVerifiedAt: NOW,
    status: 'active',
  },

  // ── Security & legal / standards ─────────────────────────────────────────
  {
    id: 'owasp-top-10',
    title: 'OWASP — Top 10',
    provider: 'OWASP',
    canonicalUrl: 'https://owasp.org/www-project-top-ten/',
    resourceType: 'standard',
    topics: ['security', 'owasp', 'web'],
    sectionIds: ['s14-security', 's30-security-infra'],
    level: 'independent',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Los diez riesgos web más comunes: inyección, auth rota, XSS, etc. Esto es, la lista que conviene revisar antes de publicar cualquier servicio con usuarios.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'owasp-cheatsheets',
    title: 'OWASP — Cheat Sheet Series',
    provider: 'OWASP',
    canonicalUrl: 'https://cheatsheetseries.owasp.org/',
    resourceType: 'reference',
    topics: ['security', 'owasp', 'cheatsheets'],
    sectionIds: ['s14-security'],
    level: 'independent',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Guías prácticas por tema: logging, secrets, Docker, XSS y más. Esto es, recetas accionables cuando necesitas defender una decisión concreta.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'owasp-api-top-10',
    title: 'OWASP — API Security Top 10',
    provider: 'OWASP',
    canonicalUrl: 'https://owasp.org/API-Security/editions/2023/en/0x11-t10/',
    resourceType: 'standard',
    topics: ['security', 'api', 'owasp'],
    sectionIds: ['s21-fastapi', 's30-security-infra'],
    level: 'advanced',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Riesgos específicos de APIs (authz por recurso, rate limiting, etc.). Esto es, el Top 10 enfocado en endpoints HTTP en vez de páginas web.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'owasp-llm-top-10',
    title: 'OWASP — LLM Top 10',
    provider: 'OWASP',
    canonicalUrl: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/',
    resourceType: 'standard',
    topics: ['security', 'llm', 'owasp', 'ai'],
    sectionIds: ['s28-llm-agents', 's48-ai-governance'],
    level: 'advanced',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Riesgos de apps con LLMs: prompt injection, fuga de datos, etc. Esto es, la lista de fallos más comunes cuando integras un modelo de lenguaje con datos de usuario.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'owasp-secure-headers',
    title: 'OWASP — Secure Headers Project',
    provider: 'OWASP',
    canonicalUrl: 'https://owasp.org/www-project-secure-headers/',
    resourceType: 'reference',
    topics: ['security', 'headers', 'http', 'owasp'],
    sectionIds: ['s14-security'],
    level: 'independent',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Cabeceras HTTP que endurecen tu sitio (CSP, HSTS, X-Frame-Options). Esto es, líneas de configuración que previenen clickjacking y XSS en navegadores modernos.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'nist-ai-rmf',
    title: 'NIST — AI Risk Management Framework',
    provider: 'NIST',
    canonicalUrl: 'https://www.nist.gov/itl/ai-risk-management-framework',
    resourceType: 'standard',
    topics: ['ai', 'risk', 'governance', 'responsible-ai'],
    sectionIds: ['s48-ai-governance'],
    level: 'advanced',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Marco de gestión de riesgo para sistemas de IA. Esto es, una estructura voluntaria para documentar y mitigar riesgos de un sistema de IA durante todo su ciclo de vida.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'nist-privacy-framework',
    title: 'NIST — Privacy Framework',
    provider: 'NIST',
    canonicalUrl: 'https://www.nist.gov/privacy-framework',
    resourceType: 'standard',
    topics: ['privacy', 'risk', 'nist'],
    sectionIds: ['s14-security', 's48-ai-governance'],
    level: 'advanced',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Marco para gestionar riesgo de privacidad en tus productos. Esto es, una herramienta para alinear privacidad con ingeniería, no con documentos legales soltados al final.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'nist-ssdf',
    title: 'NIST — Secure Software Development Framework',
    provider: 'NIST',
    canonicalUrl: 'https://csrc.nist.gov/Projects/ssdf',
    resourceType: 'standard',
    topics: ['security', 'sdLC', 'nist'],
    sectionIds: ['s11-testing', 's30-security-infra'],
    level: 'advanced',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Prácticas para desarrollar software con menos vulnerabilidades. Esto es, una checklist oficial que cubre desde requisitos hasta respuesta a incidentes.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'gdpr-text',
    title: 'GDPR — texto oficial',
    provider: 'Unión Europea',
    canonicalUrl: 'https://eur-lex.europa.eu/eli/reg/2016/679/oj',
    resourceType: 'standard',
    topics: ['privacy', 'legal', 'gdpr'],
    sectionIds: ['s14-security'],
    level: 'reference',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Reglamento europeo de protección de datos, base de la privacidad moderna. Esto es, el texto legal que inspira leyes similares en Perú y Latinoamérica.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'ccpa-text',
    title: 'CCPA / CPRA — California AG',
    provider: 'California Attorney General',
    canonicalUrl: 'https://oag.ca.gov/privacy/ccpa',
    resourceType: 'standard',
    topics: ['privacy', 'legal', 'ccpa'],
    sectionIds: ['s14-security'],
    level: 'reference',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Ley de privacidad de California, referencia para usuarios en EE. UU. Esto es, el equivalente estatal del GDPR que conviene conocer si tu app atiende usuarios estadounidenses.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'oauth-rfc-6749',
    title: 'OAuth 2.0 — RFC 6749',
    provider: 'IETF',
    canonicalUrl: 'https://datatracker.ietf.org/doc/html/rfc6749',
    resourceType: 'standard',
    topics: ['oauth', 'auth', 'security'],
    sectionIds: ['s14-security', 's21-fastapi'],
    level: 'advanced',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Estándar para delegar acceso sin compartir tu contraseña. Esto es, lo que permite "Iniciar sesión con Google/GitHub" de forma segura.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'slsa',
    title: 'SLSA — Supply-chain Levels',
    provider: 'SLSA',
    canonicalUrl: 'https://slsa.dev/',
    resourceType: 'standard',
    topics: ['security', 'supply-chain', 'slsa'],
    sectionIds: ['s30-security-infra'],
    level: 'advanced',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Niveles de seguridad para la cadena de suministro de software. Esto es, una escalera de prácticas que endurecen cómo se construye y distribuye tu software.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'sigstore',
    title: 'Sigstore / cosign',
    provider: 'Sigstore',
    canonicalUrl: 'https://www.sigstore.dev/',
    resourceType: 'tool',
    topics: ['security', 'signing', 'supply-chain'],
    sectionIds: ['s30-security-infra'],
    level: 'advanced',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Firma de artefactos para verificar que un binario es legítimo. Esto es, el equivalente a un sello notarial digital para imágenes Docker y paquetes.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'cyclonedx',
    title: 'CycloneDX',
    provider: 'OWASP CycloneDX',
    canonicalUrl: 'https://cyclonedx.org/',
    resourceType: 'standard',
    topics: ['sbom', 'security', 'supply-chain'],
    sectionIds: ['s30-security-infra'],
    level: 'advanced',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Estándar para generar SBOM (inventario de componentes de tu app). Esto es, una lista formal de todas las dependencias que tu software trae consigo.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'python-secrets',
    title: 'Python — secrets / hashlib',
    provider: 'Python Software Foundation',
    canonicalUrl: 'https://docs.python.org/3/library/secrets.html',
    resourceType: 'official_documentation',
    topics: ['python', 'security', 'secrets', 'hashing'],
    sectionIds: ['s14-security'],
    level: 'independent',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Generar tokens y hashes seguros sin reinventar la rueda. Esto es, módulos de la stdlib para manejar secretos con algoritmos criptográficamente fuertes.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'pip-secure-installs',
    title: 'pip — secure installs',
    provider: 'Python Packaging Authority',
    canonicalUrl: 'https://pip.pypa.io/en/stable/topics/secure-installs/',
    resourceType: 'official_documentation',
    topics: ['pip', 'security', 'supply-chain'],
    sectionIds: ['s14-security'],
    level: 'independent',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Verificar paquetes antes de instalarlos para evitar supply-chain attacks. Esto es, cómo configurar pip para exigir hashes y repositorios confiables.',
    lastVerifiedAt: NOW,
    status: 'active',
  },

  // ── Courses & practice platforms ─────────────────────────────────────────
  {
    id: 'cs50p-harvard',
    title: 'CS50P — Harvard',
    provider: 'Harvard University',
    canonicalUrl: 'https://cs50.harvard.edu/python',
    resourceType: 'course',
    topics: ['python', 'introduction', 'fundamentals'],
    sectionIds: ['s01-setup', 's02-basics'],
    level: 'foundation',
    language: ['en'],
    access: 'free_with_optional_paid_certificate',
    official: true,
    whyUseful: 'Curso abierto de Python con problem sets, proyecto final y certificado CS50 gratuito al cumplir sus requisitos. Esto es, una de las introducciones más reconocidas internacionalmente.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'google-it-automation',
    title: 'Google IT Automation with Python',
    provider: 'Google / Coursera',
    canonicalUrl: 'https://grow.google/certificates/it-automation-python/',
    resourceType: 'course',
    topics: ['python', 'automation', 'git', 'it'],
    sectionIds: ['s13-rpa-automation'],
    level: 'foundation',
    language: ['en'],
    access: 'paid',
    official: true,
    whyUseful: 'Ruta para personas con fundamentos de TI: Python, Git, debugging, automatización y configuración. Esto es, un programa estructurado con ejercicios calificados.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'kaggle-learn',
    title: 'Kaggle Learn',
    provider: 'Kaggle',
    canonicalUrl: 'https://www.kaggle.com/learn',
    resourceType: 'course',
    topics: ['python', 'pandas', 'ml', 'sql'],
    sectionIds: ['s06-numpy', 's07-pandas', 's08-pandas', 's10-sklearn'],
    level: 'foundation',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Lecciones breves y práctica guiada para complementar temas concretos de datos y machine learning. Esto es, micro-cursos con notebooks en el navegador, sin instalación.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'freecodecamp-python',
    title: 'freeCodeCamp — Scientific Computing with Python',
    provider: 'freeCodeCamp',
    canonicalUrl: 'https://www.freecodecamp.org/learn/scientific-computing-with-python/',
    resourceType: 'course',
    topics: ['python', 'algorithms', 'projects'],
    sectionIds: ['s02-basics'],
    level: 'foundation',
    language: ['en'],
    access: 'free_with_optional_paid_certificate',
    official: true,
    whyUseful: 'Curriculum gratuito con proyectos prácticos. Esto es, una ruta completa con verificación automática de ejercicios y certificado opcional.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'realpython',
    title: 'Real Python',
    provider: 'Real Python',
    canonicalUrl: 'https://realpython.com',
    resourceType: 'reference',
    topics: ['python', 'tutorials', 'best-practices'],
    sectionIds: ['s02-basics', 's15-stdlib-deep'],
    level: 'independent',
    language: ['en'],
    access: 'free_with_optional_paid_certificate',
    official: false,
    whyUseful: 'Tutoriales con calidad editorial y profundidad técnica. Esto es, artículos largos que explican el "por qué" además del "cómo".',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'leetcode',
    title: 'LeetCode',
    provider: 'LeetCode',
    canonicalUrl: 'https://leetcode.com/',
    resourceType: 'practice',
    topics: ['algorithms', 'data-structures', 'interview-practice'],
    sectionIds: ['s03-data-structures', 's04-functions-modules'],
    level: 'independent',
    language: ['en'],
    access: 'free_with_optional_paid_certificate',
    official: false,
    whyUseful: 'Problemas algorítmicos con casos de prueba automáticos. Esto es, práctica orientada a entrevistas técnicas, con discusión de soluciones de la comunidad.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'hackerrank-python',
    title: 'HackerRank — Python',
    provider: 'HackerRank',
    canonicalUrl: 'https://www.hackerrank.com/domains/python',
    resourceType: 'practice',
    topics: ['python', 'exercises', 'interview-practice'],
    sectionIds: ['s02-basics', 's03-data-structures'],
    level: 'foundation',
    language: ['en'],
    access: 'free',
    official: false,
    whyUseful: 'Ejercicios de Python con verificación inmediata. Esto es, una forma de medir si un concepto te quedó claro pidiéndote que lo apliques a un problema nuevo.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'exercism-python',
    title: 'Exercism — Python track',
    provider: 'Exercism',
    canonicalUrl: 'https://exercism.org/tracks/python',
    resourceType: 'practice',
    topics: ['python', 'exercises', 'mentoring'],
    sectionIds: ['s02-basics', 's04-functions-modules'],
    level: 'independent',
    language: ['en'],
    access: 'free',
    official: false,
    whyUseful: 'Ejercicios con mentoría humana gratuita. Esto es, una plataforma donde voluntarios revisan tu solución y sugieren mejoras de estilo.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'advent-of-code',
    title: 'Advent of Code',
    provider: 'Advent of Code',
    canonicalUrl: 'https://adventofcode.com/',
    resourceType: 'practice',
    topics: ['algorithms', 'puzzles', 'python'],
    sectionIds: ['s03-data-structures', 's12-performance'],
    level: 'independent',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Puzzles algorítmicos diarios en diciembre (y archivo completo). Esto es, problemas originales que se prestan a optimización y a comparar enfoques con la comunidad.',
    lastVerifiedAt: NOW,
    status: 'active',
  },

  // ── Career frameworks & certifications ──────────────────────────────────
  {
    id: 'onet-online',
    title: 'O*NET OnLine',
    provider: 'U.S. Department of Labor',
    canonicalUrl: 'https://www.onetonline.org/',
    resourceType: 'career',
    topics: ['career', 'job-descriptions', 'skills'],
    sectionIds: ['s52-career-strategy'],
    level: 'reference',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Base de datos pública de ocupaciones con tareas, habilidades y tecnologías. Esto es, lo que miras para entender qué pide el mercado sin que nadie te prometa empleo.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'sfia-framework',
    title: 'SFIA — Skills Framework',
    provider: 'SFIA Foundation',
    canonicalUrl: 'https://sfia-online.org/en/sfia-8',
    resourceType: 'career',
    topics: ['career', 'skills', 'framework'],
    sectionIds: ['s52-career-strategy'],
    level: 'reference',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Marco internacional de competencias para TI. Esto es, un vocabulario común para describir habilidades que usan empleadores en muchos países.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'aws-ml-engineer-assoc',
    title: 'AWS Machine Learning Engineer – Associate',
    provider: 'Amazon Web Services',
    canonicalUrl: 'https://aws.amazon.com/certification/certified-machine-learning-engineer-associate/',
    resourceType: 'certification',
    topics: ['aws', 'ml', 'certification', 'cloud'],
    sectionIds: ['s52-career-strategy'],
    level: 'advanced',
    language: ['en'],
    access: 'paid',
    official: true,
    whyUseful: 'Evalúa implementación y operación de cargas de ML en AWS. Esto es, una credencial opcional; el proveedor recomienda experiencia práctica previa.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'gcp-ml-engineer',
    title: 'Google Cloud Professional ML Engineer',
    provider: 'Google Cloud',
    canonicalUrl: 'https://cloud.google.com/learn/certification/machine-learning-engineer',
    resourceType: 'certification',
    topics: ['gcp', 'ml', 'certification', 'cloud'],
    sectionIds: ['s52-career-strategy'],
    level: 'advanced',
    language: ['en'],
    access: 'paid',
    official: true,
    whyUseful: 'Evalúa diseño, construcción y operación de soluciones ML en Google Cloud; la experiencia recomendada es avanzada.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'azure-ai-apps',
    title: 'Microsoft Azure AI Apps and Agents Developer Associate',
    provider: 'Microsoft',
    canonicalUrl: 'https://learn.microsoft.com/es-es/credentials/certifications/azure-ai-apps-and-agents-developer-associate/',
    resourceType: 'certification',
    topics: ['azure', 'ai', 'certification', 'cloud'],
    sectionIds: ['s52-career-strategy'],
    level: 'advanced',
    language: ['es', 'en'],
    access: 'paid',
    official: true,
    whyUseful: 'Credencial AI-103 sobre soluciones de IA y agentes con Python y Microsoft Foundry. Sustituye en esta lista al retirado AI-102.',
    lastVerifiedAt: NOW,
    status: 'active',
  },

  // ── Datasets (synthetic only — no scraped personal data) ────────────────
  {
    id: 'seaborn-datasets',
    title: 'seaborn — built-in datasets',
    provider: 'seaborn',
    canonicalUrl: 'https://github.com/mwaskom/seaborn-data',
    resourceType: 'dataset',
    topics: ['dataset', 'practice', 'visualization'],
    sectionIds: ['s08-visualization', 's09-visualization'],
    level: 'foundation',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Datasets de práctica cargables con `sns.load_dataset`. Esto es, datos pequeños y limpios para enseñar visualización sin tener que descargar archivos.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'kaggle-datasets',
    title: 'Kaggle — Datasets',
    provider: 'Kaggle',
    canonicalUrl: 'https://www.kaggle.com/datasets',
    resourceType: 'dataset',
    topics: ['dataset', 'practice', 'ml'],
    sectionIds: ['s10-sklearn', 's23-computer-vision'],
    level: 'independent',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Repositorio público de datasets con licencias declaradas. Esto es, una buena fuente cuando necesitas datos reales para un proyecto, pero revisa siempre la licencia.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'uci-ml-repo',
    title: 'UCI Machine Learning Repository',
    provider: 'UC Irvine',
    canonicalUrl: 'https://archive.ics.uci.edu/',
    resourceType: 'dataset',
    topics: ['dataset', 'ml', 'classic'],
    sectionIds: ['s10-sklearn'],
    level: 'independent',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Datasets clásicos para enseñanza de ML (Iris, Adult, Wine). Esto es, los datos que aparecen en la mayoría de tutoriales introductorios.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'synthetic-data-repo',
    title: 'Faker — Python library',
    provider: 'Faker',
    canonicalUrl: 'https://faker.readthedocs.io/',
    resourceType: 'tool',
    topics: ['dataset', 'synthetic-data', 'testing'],
    sectionIds: ['s11-testing', 's19-databases-orm'],
    level: 'independent',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Genera datos sintéticos (nombres, correos, direcciones) para tests y demos. Esto es, lo que usamos para no meter datos personales reales en ejercicios.',
    lastVerifiedAt: NOW,
    status: 'active',
  },

  // ── Extra references ────────────────────────────────────────────────────
  {
    id: 'system-design-primer',
    title: 'System Design Primer',
    provider: 'Donne Martin / open source',
    canonicalUrl: 'https://github.com/donnemartin/system-design-primer',
    resourceType: 'reference',
    topics: ['system-design', 'architecture', 'interview'],
    sectionIds: ['s35-system-design'],
    level: 'advanced',
    language: ['en'],
    access: 'free',
    official: false,
    whyUseful: 'Cómo diseñar sistemas a escala, con casos prácticos. Esto es, un repositorio abierto que recopila preguntas y respuestas de diseño de sistemas.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'semver',
    title: 'Semantic Versioning 2.0.0',
    provider: 'semver.org',
    canonicalUrl: 'https://semver.org/',
    resourceType: 'standard',
    topics: ['versioning', 'packaging', 'conventions'],
    sectionIds: ['s17-packaging'],
    level: 'independent',
    language: ['es', 'en'],
    access: 'free',
    official: true,
    whyUseful: 'Convención para numerar versiones (MAJOR.MINOR.PATCH). Esto es, el lenguaje común para comunicar si un cambio rompe algo o solo añade funcionalidad.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'keep-a-changelog',
    title: 'Keep a Changelog',
    provider: 'keepachangelog.com',
    canonicalUrl: 'https://keepachangelog.com/',
    resourceType: 'standard',
    topics: ['changelog', 'documentation', 'release'],
    sectionIds: ['s17-packaging'],
    level: 'independent',
    language: ['es', 'en'],
    access: 'free',
    official: true,
    whyUseful: 'Convención para mantener un CHANGELOG legible. Esto es, cómo escribir las notas de versión para que tus usuarios sepan qué cambió y por qué.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'streamlit-docs',
    title: 'Streamlit — documentation',
    provider: 'Streamlit',
    canonicalUrl: 'https://docs.streamlit.io/',
    resourceType: 'official_documentation',
    topics: ['streamlit', 'dashboard', 'python'],
    sectionIds: ['s25-streamlit-dashboards'],
    level: 'independent',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Dashboards en Python con pocas líneas. Esto es, una forma rápida de poner tu modelo o análisis frente a un usuario final sin escribir frontend.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'prisma-docs',
    title: 'Prisma — documentation',
    provider: 'Prisma',
    canonicalUrl: 'https://www.prisma.io/docs/',
    resourceType: 'official_documentation',
    topics: ['prisma', 'orm', 'database'],
    sectionIds: ['s19-databases-orm'],
    level: 'independent',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'ORM moderno para TypeScript/Node. Esto es, una capa de acceso a base de datos con tipos y migraciones; se usa en el backend dinámico de PyArcana.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'sqlmodel-docs',
    title: 'SQLModel',
    provider: 'FastAPI / Tiangolo',
    canonicalUrl: 'https://sqlmodel.tiangolo.com/',
    resourceType: 'official_documentation',
    topics: ['sqlmodel', 'orm', 'python'],
    sectionIds: ['s19-databases-orm'],
    level: 'independent',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'ORM Python basado en Pydantic y SQLAlchemy. Esto es, una forma de declarar tablas como clases Python con validación incluida.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'playwright-docs',
    title: 'Playwright',
    provider: 'Microsoft',
    canonicalUrl: 'https://playwright.dev/',
    resourceType: 'tool',
    topics: ['testing', 'e2e', 'automation', 'browser'],
    sectionIds: ['s13-rpa-automation', 's24-rpa-advanced'],
    level: 'advanced',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Automatización de navegador para pruebas E2E y RPA. Esto es, una biblioteca para que un script controle Chrome/Firefox como si fuera un humano.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'python-asyncio',
    title: 'Python — asyncio',
    provider: 'Python Software Foundation',
    canonicalUrl: 'https://docs.python.org/3/library/asyncio.html',
    resourceType: 'official_documentation',
    topics: ['python', 'async', 'concurrency'],
    sectionIds: ['s27-async-concurrency'],
    level: 'advanced',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Programación asíncrona en Python. Esto es, el módulo estándar para escribir corrutinas que esperan I/O sin bloquear el hilo.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'washington-cse-142',
    title: 'University of Washington — CSE 142/143 (Python)',
    provider: 'University of Washington',
    canonicalUrl: 'https://courses.cs.washington.edu/courses/cse142/',
    resourceType: 'course',
    topics: ['python', 'cs-fundamentals'],
    sectionIds: ['s02-basics'],
    level: 'foundation',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Curso universitario abierto de introducción a la programación. Esto es, materiales de un curso real para complementar con ejercicios extra.',
    lastVerifiedAt: NOW,
    status: 'changed',
  },
  {
    id: 'python-type-hints',
    title: 'Python — Typing',
    provider: 'Python Software Foundation',
    canonicalUrl: 'https://docs.python.org/3/library/typing.html',
    resourceType: 'official_documentation',
    topics: ['python', 'types', 'mypy'],
    sectionIds: ['s04-functions-modules'],
    level: 'independent',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Anotaciones de tipo en Python. Esto es, pistas para editores y herramientas de verificación estática como mypy y pyright.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'mypy-docs',
    title: 'mypy — documentation',
    provider: 'mypy',
    canonicalUrl: 'https://mypy.readthedocs.io/',
    resourceType: 'tool',
    topics: ['python', 'types', 'static-analysis'],
    sectionIds: ['s11-testing'],
    level: 'independent',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'Verificador de tipos estáticos para Python. Esto es, una herramienta que detecta errores de tipo antes de ejecutar el código.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
  {
    id: 'gh-actions',
    title: 'GitHub Actions — documentation',
    provider: 'GitHub',
    canonicalUrl: 'https://docs.github.com/en/actions',
    resourceType: 'official_documentation',
    topics: ['ci', 'cd', 'automation', 'github'],
    sectionIds: ['s11-testing', 's17-packaging'],
    level: 'independent',
    language: ['en'],
    access: 'free',
    official: true,
    whyUseful: 'CI/CD integrado en GitHub. Esto es, dónde configuras pipelines que corren tests, builds y deploys en cada push.',
    lastVerifiedAt: NOW,
    status: 'active',
  },
]

// ────────────────────────────────────────────────────────────────────────────
// Filter metadata
// ────────────────────────────────────────────────────────────────────────────
const RESOURCE_TYPE_LABELS: Record<ResourceType, { label: string; icon: React.ElementType }> = {
  official_documentation: { label: 'Documentación oficial', icon: FileText },
  course: { label: 'Curso', icon: GraduationCap },
  practice: { label: 'Práctica', icon: Code2 },
  reference: { label: 'Referencia', icon: Bookmark },
  standard: { label: 'Estándar', icon: Scale },
  tool: { label: 'Herramienta', icon: Wrench },
  career: { label: 'Carrera', icon: Briefcase },
  certification: { label: 'Certificación', icon: Award },
  dataset: { label: 'Dataset', icon: Database },
}

const LEVEL_LABELS: Record<ResourceLevel, string> = {
  foundation: 'Fundamentos',
  independent: 'Independiente',
  advanced: 'Avanzado',
  reference: 'Referencia',
}

const ACCESS_LABELS: Record<ResourceAccess, string> = {
  free: 'Gratis',
  free_with_optional_paid_certificate: 'Gratis (certificado opcional)',
  paid: 'De pago',
  varies: 'Varía',
}

const STATUS_LABELS: Record<ResourceStatus, { label: string; tone: string }> = {
  active: { label: 'Activo', tone: 'text-emerald-600 dark:text-emerald-300' },
  changed: { label: 'Cambiado', tone: 'text-amber-600 dark:text-amber-300' },
  retired: { label: 'Retirado', tone: 'text-rose-600 dark:text-rose-300' },
  unavailable: { label: 'No disponible', tone: 'text-muted-foreground' },
}

const INITIAL_VISIBLE = 12

// ────────────────────────────────────────────────────────────────────────────
// ResourcesPage
// ────────────────────────────────────────────────────────────────────────────
export function ResourcesPage({ sections }: ResourcesPageProps) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<Set<ResourceType>>(new Set())
  const [levelFilter, setLevelFilter] = useState<Set<ResourceLevel>>(new Set())
  const [sectionFilter, setSectionFilter] = useState<string>('')
  const [topicFilter, setTopicFilter] = useState<string>('')
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [activeKeyboardIndex, setActiveKeyboardIndex] = useState(-1)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // ── Build filter options ────────────────────────────────────────────────
  const allTopics = useMemo(() => {
    const s = new Set<string>()
    RESOURCES.forEach((r) => r.topics.forEach((t) => s.add(t)))
    return Array.from(s).sort()
  }, [])

  // ── Filtered resources (search + filters) ───────────────────────────────
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return RESOURCES.filter((r) => {
      // Search across title, provider, whyUseful, topics
      if (q) {
        const haystack = `${r.title} ${r.provider} ${r.whyUseful} ${r.topics.join(' ')}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      if (typeFilter.size > 0 && !typeFilter.has(r.resourceType)) return false
      if (levelFilter.size > 0 && !levelFilter.has(r.level)) return false
      if (sectionFilter && !r.sectionIds.includes(sectionFilter)) return false
      if (topicFilter && !r.topics.includes(topicFilter)) return false
      return true
    })
  }, [search, typeFilter, levelFilter, sectionFilter, topicFilter])

  const visible = filtered.slice(0, visibleCount)
  const hasMore = filtered.length > visibleCount

  // Reset visible count when filters change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisibleCount(INITIAL_VISIBLE)
    setActiveKeyboardIndex(-1)
  }, [search, typeFilter, levelFilter, sectionFilter, topicFilter])

  // ── Keyboard navigation ─────────────────────────────────────────────────
  // / to focus search, Esc to clear, Arrow Down/Up + Enter to pick a resource
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Skip when typing in another input that is not the search box
      const target = e.target as HTMLElement | null
      const inField = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA'

      if (e.key === '/' && !inField) {
        e.preventDefault()
        searchInputRef.current?.focus()
        return
      }
      if (e.key === 'Escape') {
        if (search) {
          setSearch('')
          setActiveKeyboardIndex(-1)
        } else if (document.activeElement === searchInputRef.current) {
          searchInputRef.current?.blur()
        }
        return
      }
      if (!search) return
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveKeyboardIndex((i) => Math.min(i + 1, visible.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveKeyboardIndex((i) => Math.max(i - 1, -1))
      } else if (e.key === 'Enter' && activeKeyboardIndex >= 0) {
        e.preventDefault()
        const r = visible[activeKeyboardIndex]
        if (r) window.open(r.canonicalUrl, '_blank', 'noopener,noreferrer')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [search, visible, activeKeyboardIndex])

  // ── Toggle helpers ──────────────────────────────────────────────────────
  const toggleType = useCallback((t: ResourceType) => {
    setTypeFilter((prev) => {
      const next = new Set(prev)
      if (next.has(t)) next.delete(t)
      else next.add(t)
      return next
    })
  }, [])

  const toggleLevel = useCallback((l: ResourceLevel) => {
    setLevelFilter((prev) => {
      const next = new Set(prev)
      if (next.has(l)) next.delete(l)
      else next.add(l)
      return next
    })
  }, [])

  const clearFilters = useCallback(() => {
    setSearch('')
    setTypeFilter(new Set())
    setLevelFilter(new Set())
    setSectionFilter('')
    setTopicFilter('')
  }, [])

  const activeFilterCount =
    typeFilter.size + levelFilter.size + (sectionFilter ? 1 : 0) + (topicFilter ? 1 : 0)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8" ref={containerRef}>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Badge variant="outline" className="mb-3 gap-1.5 border-primary/30 text-primary">
          <Library className="h-3 w-3" />
          Biblioteca
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="gradient-text">Recursos del curso</span>
        </h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Una biblioteca curada para acompañarte durante todo el recorrido. Esto es, en vez de
          enlaces sueltos, organizamos cursos abiertos, documentación oficial, estándares,
          plataformas de práctica y frameworks de carrera. Cada entrada indica por qué es útil y
          cuándo conviene consultarla. La selección prioriza documentación oficial y cursos abiertos. Para otro material, busca por tu
          cuenta y verifica la licencia.
        </p>
      </motion.div>

      {/* Search + keyboard hint */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            type="search"
            placeholder="Buscar por título, proveedor, tema o por qué es útil… ( / )"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            aria-label="Buscar recursos"
            data-testid="resources-search-input"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label="Limpiar búsqueda"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Keyboard className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">
            Usa <kbd className="rounded border bg-muted px-1 py-0.5">/</kbd> para buscar,{' '}
            <kbd className="rounded border bg-muted px-1 py-0.5">↓↑</kbd> para navegar,{' '}
            <kbd className="rounded border bg-muted px-1 py-0.5">Enter</kbd> para abrir.
          </span>
          <span className="sm:hidden">Toca un recurso para abrirlo.</span>
        </div>
      </div>

      {/* Quick filters: type chips */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {(Object.keys(RESOURCE_TYPE_LABELS) as ResourceType[]).map((t) => {
          const { label, icon: Icon } = RESOURCE_TYPE_LABELS[t]
          const active = typeFilter.has(t)
          const count = RESOURCES.filter((r) => r.resourceType === t).length
          return (
            <button
              key={t}
              type="button"
              onClick={() => toggleType(t)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors',
                active
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground'
              )}
              aria-pressed={active}
              data-testid={`filter-type-${t}`}
            >
              <Icon className="h-3 w-3" />
              {label}
              <span className="ml-1 text-[10px] opacity-70">({count})</span>
            </button>
          )
        })}
        <button
          type="button"
          onClick={() => setShowAdvanced((s) => !s)}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground"
          aria-expanded={showAdvanced}
        >
          <Filter className="h-3 w-3" />
          Filtros
          {activeFilterCount > 0 && (
            <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
          {showAdvanced ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" />
            Limpiar
          </button>
        )}
      </div>

      {/* Advanced filters */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 grid gap-4 rounded-xl border border-border bg-card p-4 sm:grid-cols-3">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Nivel
                </label>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {(Object.keys(LEVEL_LABELS) as ResourceLevel[]).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => toggleLevel(l)}
                      className={cn(
                        'rounded-md border px-2 py-1 text-xs transition-colors',
                        levelFilter.has(l)
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-muted-foreground hover:text-foreground'
                      )}
                      aria-pressed={levelFilter.has(l)}
                    >
                      {LEVEL_LABELS[l]}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Sección del curso
                </label>
                <select
                  value={sectionFilter}
                  onChange={(e) => setSectionFilter(e.target.value)}
                  className="mt-2 w-full rounded-md border border-border bg-background px-2 py-1 text-sm"
                  aria-label="Filtrar por sección"
                  data-testid="filter-section"
                >
                  <option value="">Todas las secciones</option>
                  {sections.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.id} · {s.shortTitle}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Tema
                </label>
                <select
                  value={topicFilter}
                  onChange={(e) => setTopicFilter(e.target.value)}
                  className="mt-2 w-full rounded-md border border-border bg-background px-2 py-1 text-sm"
                  aria-label="Filtrar por tema"
                  data-testid="filter-topic"
                >
                  <option value="">Todos los temas</option>
                  {allTopics.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results summary */}
      <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
        <span data-testid="resources-count">
          {filtered.length} {filtered.length === 1 ? 'recurso' : 'recursos'}
          {search && ` para "${search}"`}
          {activeFilterCount > 0 && ` · ${activeFilterCount} filtro(s) activo(s)`}
        </span>
        {search && (
          <span className="hidden sm:inline">
            <kbd className="rounded border bg-muted px-1 py-0.5">Esc</kbd> para limpiar
          </span>
        )}
      </div>

      {/* Resource list */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((r, idx) => (
          <ResourceCard
            key={r.id}
            resource={r}
            isKeyboardActive={idx === activeKeyboardIndex}
            sectionLabel={sections.find((s) => s.id === r.sectionIds[0])?.shortTitle}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-10 rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium">No encontramos recursos con esos filtros.</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Prueba con otro término o limpia los filtros para ver todo el catálogo.
          </p>
          <Button variant="outline" size="sm" className="mt-4" onClick={clearFilters}>
            Limpiar filtros
          </Button>
        </div>
      )}

      {/* Progressive disclosure: "show more" */}
      {hasMore && (
        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            onClick={() => setVisibleCount((c) => c + INITIAL_VISIBLE)}
            data-testid="resources-show-more"
          >
            Ver más recursos
            <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* External resources notice */}
      <section className="mt-10 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
        <div className="mb-3 flex items-center gap-2">
          <Globe className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
          <h2 className="text-xl font-semibold">Sobre los enlaces externos</h2>
        </div>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Todos los enlaces se abren en una pestaña nueva con <code className="rounded bg-muted px-1">rel=&quot;noopener noreferrer&quot;</code>.
          Esto es, una precaución estándar para que el sitio destino no pueda manipular tu pestaña de PyArcana.
          No controlamos el contenido externo: si una página ha cambiado, Moved o cobra ahora, repórtalo y lo
          actualizaremos. La inclusión de un recurso no implica respaldo; úsalo solo si encaja con tu objetivo.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Lee el{' '}
          <a href="/external-resources" className="font-medium text-foreground underline-offset-2 hover:underline">
            Aviso de Recursos Externos
          </a>{' '}
          completo para detalles sobre licencias, privacidad y verificación.
        </p>
      </section>

      {/* Per-section references — still useful when learners want to revisit a section's docs */}
      <section className="mt-10">
        <div className="mb-4 flex items-center gap-2">
          <Bookmark className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Documentación por sección</h2>
        </div>
        <p className="mb-4 max-w-2xl text-sm text-muted-foreground">
          Los enlaces que cada sección cita a lo largo del curso. Esto es, las fuentes puntuales que
          mencionamos en las lecciones; si quieres volver a una fuente que viste en una sección
          específica, búscala aquí.
        </p>
        <div className="space-y-3">
          {sections.map((s, idx) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.02, 0.4) }}
            >
              <Card className="overflow-hidden">
                <div className="border-b border-border/60 bg-muted/30 px-5 py-3">
                  <div className="text-xs font-medium text-muted-foreground">Sección {idx + 1}</div>
                  <div className="text-sm font-semibold">{s.shortTitle}</div>
                </div>
                <div className="grid gap-3 p-5 sm:grid-cols-2">
                  {s.resources.docs.map((d, i) => (
                    <a
                      key={i}
                      href={d.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-2 rounded-lg border border-border/60 p-3 transition-colors hover:border-primary/30 hover:bg-accent/30"
                    >
                      <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-primary" />
                      <div className="min-w-0">
                        <div className="text-sm font-medium">{d.label}</div>
                        {d.note && <div className="text-xs text-muted-foreground">{d.note}</div>}
                      </div>
                    </a>
                  ))}
                  {s.resources.docs.length === 0 && (
                    <div className="text-xs text-muted-foreground">
                      Esta sección no cita documentación externa adicional.
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Legal & security disclaimers */}
      <LegalDisclaimer />
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// ResourceCard
// ────────────────────────────────────────────────────────────────────────────
function ResourceCard({
  resource,
  isKeyboardActive,
  sectionLabel,
}: {
  resource: Resource
  isKeyboardActive: boolean
  sectionLabel?: string
}) {
  const typeMeta = RESOURCE_TYPE_LABELS[resource.resourceType]
  const statusMeta = STATUS_LABELS[resource.status]
  const TypeIcon = typeMeta.icon

  return (
    <a
      href={resource.canonicalUrl}
      target="_blank"
      rel="noopener noreferrer"
      data-testid={`resource-card-${resource.id}`}
      className={cn(
        'group flex h-full flex-col rounded-xl border bg-card p-5 transition-all',
        isKeyboardActive
          ? 'border-primary shadow-glow ring-2 ring-primary/30'
          : 'border-border hover:border-primary/30 hover:shadow-card-hover'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <TypeIcon className="h-4 w-4" />
        </div>
        <div className="flex flex-wrap items-center justify-end gap-1">
          {resource.official && (
            <Badge variant="outline" className="gap-1 border-emerald-500/40 text-emerald-600 dark:text-emerald-300">
              <CheckCircle2 className="h-2.5 w-2.5" />
              Oficial
            </Badge>
          )}
          <Badge variant="outline" className="text-[10px]">
            {typeMeta.label}
          </Badge>
        </div>
      </div>

      <h3 className="mt-3 line-clamp-2 text-sm font-semibold leading-tight">{resource.title}</h3>
      <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
        <Building2 className="h-3 w-3" />
        <span className="truncate">{resource.provider}</span>
      </div>

      <p className="mt-2 line-clamp-3 flex-1 text-xs leading-relaxed text-muted-foreground">
        {resource.whyUseful}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-1">
        <Badge variant="secondary" className="text-[10px]">{LEVEL_LABELS[resource.level]}</Badge>
        <Badge variant="secondary" className="text-[10px]">{ACCESS_LABELS[resource.access]}</Badge>
        {resource.language.includes('es') && (
          <Badge variant="secondary" className="text-[10px]">ES</Badge>
        )}
        {resource.language.includes('en') && (
          <Badge variant="secondary" className="text-[10px]">EN</Badge>
        )}
        {resource.status !== 'active' && (
          <span className={cn('text-[10px] font-medium', statusMeta.tone)}>
            {statusMeta.label}
          </span>
        )}
      </div>

      {(sectionLabel || resource.topics.length > 0) && (
        <div className="mt-3 border-t border-border/60 pt-2 text-[10px] text-muted-foreground">
          {sectionLabel && (
            <div className="flex items-center gap-1">
              <Bookmark className="h-2.5 w-2.5" />
              <span className="truncate">Sección: {sectionLabel}</span>
            </div>
          )}
          {resource.topics.length > 0 && (
            <div className="mt-1 truncate">
              {resource.topics.slice(0, 4).join(' · ')}
              {resource.topics.length > 4 && ' …'}
            </div>
          )}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground/70">
          Verificado: {resource.lastVerifiedAt}
        </span>
        <span className="inline-flex items-center gap-1 text-xs font-medium text-primary group-hover:underline">
          Abrir <ExternalLink className="h-3 w-3" />
        </span>
      </div>
    </a>
  )
}
