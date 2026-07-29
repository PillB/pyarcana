'use client'

import { motion } from 'framer-motion'
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
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Resources } from '@/lib/types'
import { LegalDisclaimer } from './LegalDisclaimer'

interface ResourcesPageProps {
  sections: { id: string; title: string; shortTitle: string; resources: Resources }[]
}

// ────────────────────────────────────────────────────────────────────────────
// Cursos externos recomendados
// ────────────────────────────────────────────────────────────────────────────
const externalCourses = [
  { name: 'CS50P — Harvard', url: 'https://cs50.harvard.edu/python', note: 'Curso gratuito con certificado. Referencia internacional para principiantes.' },
  { name: 'Google IT Automation with Python', url: 'https://www.coursera.org/professional-certificates/google-it-automation', note: 'Certificación profesional con marca Google para tu LinkedIn.' },
  { name: 'Kaggle Learn', url: 'https://www.kaggle.com/learn', note: 'Micro-cursos gratuitos con badges: Python, Pandas, ML y SQL.' },
  { name: 'Real Python', url: 'https://realpython.com', note: 'Tutoriales con calidad editorial y profundidad técnica.' },
  { name: 'Python.org — Tutorial oficial', url: 'https://docs.python.org/3/tutorial/', note: 'La fuente oficial. Seco, pero completo y siempre actualizado.' },
  { name: 'freeCodeCamp Python', url: 'https://www.freecodecamp.org/learn/scientific-computing-with-python/', note: 'Gratis con certificado y proyectos prácticos.' },
]

// ────────────────────────────────────────────────────────────────────────────
// Documentación oficial agrupada por área temática
// ────────────────────────────────────────────────────────────────────────────
type DocEntry = { label: string; url: string; note: string }
type DocGroup = {
  id: string
  title: string
  icon: React.ElementType
  blurb: string
  docs: DocEntry[]
}

const docGroups: DocGroup[] = [
  {
    id: 'python-fundamentals',
    title: 'Fundamentos de Python',
    icon: Code2,
    blurb: 'La base del lenguaje: instalación, tipos, control de flujo y empaquetado.',
    docs: [
      { label: 'Python.org — Descargas', url: 'https://www.python.org/downloads/', note: 'Instalador oficial para Windows, macOS y Linux.' },
      { label: 'Python — Tutorial oficial', url: 'https://docs.python.org/3/tutorial/', note: 'Recorrido completo del lenguaje, sección por sección.' },
      { label: 'Python — Biblioteca estándar', url: 'https://docs.python.org/3/library/index.html', note: 'Todo lo que viene incluido sin instalar nada extra.' },
      { label: 'Python — venv', url: 'https://docs.python.org/3/library/venv.html', note: 'Entornos virtuales: una carpeta aislada con su propio Python y librerías.' },
      { label: 'pip — User Guide', url: 'https://pip.pypa.io/en/stable/user_guide/', note: 'Cómo instalar paquetes y congelar versiones con requirements.txt.' },
      { label: 'Ruff — documentation', url: 'https://docs.astral.sh/ruff/', note: 'Linter y formateador moderno; configura [tool.ruff] en pyproject.toml.' },
      { label: 'PEP 8 — Style Guide', url: 'https://peps.python.org/pep-0008/', note: 'Convenciones de estilo: snake_case, UPPER_CASE para constantes.' },
      { label: 'PEP 257 — Docstrings', url: 'https://peps.python.org/pep-0257/', note: 'Cómo documentar funciones y clases con triples comillas.' },
      { label: 'Python Packaging User Guide', url: 'https://packaging.python.org/en/latest/', note: 'Empaquetar y distribuir tu propio paquete.' },
      { label: 'Real Python — best practices', url: 'https://realpython.com/tutorials/best-practices/', note: 'Cómo escribir Python "pythónico", no solo correcto.' },
    ],
  },
  {
    id: 'data-science',
    title: 'Ciencia de datos',
    icon: FlaskConical,
    blurb: 'NumPy, pandas, matplotlib y scikit-learn: las herramientas del día a día del analista.',
    docs: [
      { label: 'NumPy — User Guide', url: 'https://numpy.org/doc/stable/user/', note: 'Vectores y broadcasting (operar arrays de formas distintas) bien explicados.' },
      { label: 'NumPy — Absolute beginners', url: 'https://numpy.org/doc/stable/user/absolute_beginners.html', note: 'Primeros pasos sin asumir nada previo.' },
      { label: 'Pandas — documentation', url: 'https://pandas.pydata.org/docs/', note: 'El 80% de tu día como Data Analyst vive aquí.' },
      { label: 'Pandas — Merge, join, concatenate', url: 'https://pandas.pydata.org/docs/user_guide/merging.html', note: 'Unir tablas sin inflar filas ni perder registros.' },
      { label: 'Matplotlib — tutorials', url: 'https://matplotlib.org/stable/tutorials/index.html', note: 'Galería y ejemplos: copia, adapta y aprende.' },
      { label: 'Matplotlib — cheatsheets', url: 'https://matplotlib.org/cheatsheets/', note: 'Hojas de referencia rápida para imprimir.' },
      { label: 'seaborn — tutorial', url: 'https://seaborn.pydata.org/tutorial.html', note: 'Gráficos estadísticos con una línea de código.' },
      { label: 'Plotly Python', url: 'https://plotly.com/python/', note: 'Gráficos interactivos para dashboards.' },
      { label: 'scikit-learn — User Guide', url: 'https://scikit-learn.org/stable/user_guide.html', note: 'Pipeline, ColumnTransformer y cross-validation.' },
      { label: 'From Data to Viz', url: 'https://www.data-to-viz.com/', note: 'Árbol de decisión: qué gráfico usar según tu tipo de dato.' },
    ],
  },
  {
    id: 'ml-ai',
    title: 'Machine Learning e IA',
    icon: Brain,
    blurb: 'Desde regresión básica hasta LLMs, RAG y MLOps para producción.',
    docs: [
      { label: 'Google ML Crash Course', url: 'https://developers.google.com/machine-learning/crash-course', note: 'Curso gratuito con framing práctico de ML supervisado.' },
      { label: 'Google MLOps whitepaper', url: 'https://cloud.google.com/resources/mlops-whitepaper', note: 'Cómo llevar modelos a producción sin que se pudran en el camino.' },
      { label: 'Google Model Cards', url: 'https://modelcards.withgoogle.com/', note: 'Plantilla para documentar límites y uso responsable de un modelo.' },
      { label: 'An Introduction to Statistical Learning (ISL)', url: 'https://www.statlearning.com/', note: 'Libro abierto, base teórica de regresión y clasificación.' },
      { label: 'Think Stats', url: 'https://greenteapress.com/wp/think-stats-2e/', note: 'Libro abierto de estadística con ejemplos en Python.' },
      { label: 'OpenAI Cookbook — RAG', url: 'https://cookbook.openai.com/', note: 'Recetas prácticas para RAG, embeddings y function calling.' },
      { label: 'LangChain — RAG tutorial', url: 'https://python.langchain.com/docs/tutorials/rag/', note: 'Construir un sistema que "lee" tus documentos antes de responder.' },
      { label: 'LlamaIndex — docs', url: 'https://docs.llamaindex.ai/', note: 'Framework para indexar y consultar conocimiento propio.' },
      { label: 'Hugging Face — Pipeline tutorial', url: 'https://huggingface.co/learn/nlp-course', note: 'Modelos abiertos y cómo usarlos en producción.' },
      { label: 'MLflow Tracking', url: 'https://mlflow.org/docs/latest/tracking/', note: 'Registrar cada experimento para compararlo y reproducirlo.' },
    ],
  },
  {
    id: 'engineering',
    title: 'Ingeniería de software y prácticas',
    icon: FileText,
    blurb: 'Testing, APIs, contenedores, orquestación y arquitectura: lo que separa un script de un sistema.',
    docs: [
      { label: 'pytest — documentation', url: 'https://docs.pytest.org/', note: 'Testing que no duerme: fixtures, parametrize y coverage.' },
      { label: 'Coverage.py', url: 'https://coverage.readthedocs.io/', note: 'Mide qué líneas de tu código realmente ejecutan tus tests.' },
      { label: 'Hypothesis — property testing', url: 'https://hypothesis.readthedocs.io/', note: 'Genera casos de borde automáticamente en vez de escribirlos a mano.' },
      { label: 'FastAPI — tutorial', url: 'https://fastapi.tiangolo.com/tutorial/', note: 'APIs HTTP modernas con tipado y documentación automática.' },
      { label: 'Pydantic', url: 'https://docs.pydantic.dev/', note: 'Validación de datos basada en tipos de Python.' },
      { label: 'Docker — best practices', url: 'https://docs.docker.com/develop/dev-best-practices/', note: 'Imágenes reproducibles y seguras para tu servicio.' },
      { label: 'dbt — docs', url: 'https://docs.getdbt.com/', note: 'Transformaciones SQL versionadas y testeadas en tu warehouse.' },
      { label: 'Great Expectations', url: 'https://docs.greatexpectations.io/', note: 'Validación de datos: contratos que fallan pronto si el dato llega mal.' },
      { label: 'OpenTelemetry', url: 'https://opentelemetry.io/docs/', note: 'Observabilidad estándar: logs, métricas y trazas en un solo lugar.' },
      { label: 'Twelve-Factor App', url: 'https://12factor.net/', note: 'Principios para apps que corren bien en la nube.' },
      { label: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', note: 'Cómo diseñar sistemas a escala, con casos prácticos.' },
      { label: 'C4 model', url: 'https://c4model.com/', note: 'Diagramas de arquitectura con cuatro niveles de zoom.' },
      { label: 'Architecture Decision Records', url: 'https://adr.github.io/', note: 'Documentar por qué tomaste tal decisión, no solo qué decidiste.' },
      { label: 'Google SRE — Service Level Objectives', url: 'https://sre.google/sre-book/service-level-objectives/', note: 'Acuerdos medibles de calidad de servicio.' },
      { label: 'Apache Airflow', url: 'https://airflow.apache.org/docs/', note: 'Orquestador de pipelines batch: DAGs programados y monitoreados.' },
    ],
  },
  {
    id: 'security',
    title: 'Seguridad y legal',
    icon: ShieldCheck,
    blurb: 'Recursos para que tu código no filtre datos ni te deje expuesto legalmente.',
    docs: [
      { label: 'OWASP — Top 10', url: 'https://owasp.org/www-project-top-ten/', note: 'Los diez riesgos web más comunes: inyección, auth rota, XSS, etc.' },
      { label: 'OWASP — Cheat Sheet Series', url: 'https://cheatsheetseries.owasp.org/', note: 'Guías prácticas por tema: logging, secrets, Docker, XSS y más.' },
      { label: 'OWASP — API Security Top 10', url: 'https://owasp.org/API-Security/editions/2023/en/0x11-t10/', note: 'Riesgos específicos de APIs (authz por recurso, rate limiting, etc.).' },
      { label: 'OWASP — LLM Top 10', url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/', note: 'Riesgos de apps con LLMs: prompt injection, fuga de datos, etc.' },
      { label: 'OWASP — Secure Headers Project', url: 'https://owasp.org/www-project-secure-headers/', note: 'Cabeceras HTTP que endurecen tu sitio (CSP, HSTS, X-Frame-Options).' },
      { label: 'NIST — AI Risk Management Framework', url: 'https://www.nist.gov/itl/ai-risk-management-framework', note: 'Marco de gestión de riesgo para sistemas de IA.' },
      { label: 'NIST — Privacy Framework', url: 'https://www.nist.gov/privacy-framework', note: 'Marco para gestionar riesgo de privacidad en tus productos.' },
      { label: 'NIST — Secure Software Development Framework', url: 'https://csrc.nist.gov/Projects/ssdf', note: 'Prácticas para desarrollar software con menos vulnerabilidades.' },
      { label: 'GDPR — texto oficial', url: 'https://eur-lex.europa.eu/eli/reg/2016/679/oj', note: 'Reglamento europeo de protección de datos, base de la privacidad moderna.' },
      { label: 'CCPA / CPRA — California AG', url: 'https://oag.ca.gov/privacy/ccpa', note: 'Ley de privacidad de California, referencia para usuarios en EE. UU.' },
      { label: 'OAuth 2.0 — RFC 6749', url: 'https://datatracker.ietf.org/doc/html/rfc6749', note: 'Estándar para delegar acceso sin compartir tu contraseña.' },
      { label: 'SLSA — Supply-chain Levels', url: 'https://slsa.dev/', note: 'Niveles de seguridad para la cadena de suministro de software.' },
      { label: 'Sigstore / cosign', url: 'https://www.sigstore.dev/', note: 'Firma de artefactos para verificar que un binario es legítimo.' },
      { label: 'CycloneDX', url: 'https://cyclonedx.org/', note: 'Estándar para generar SBOM (inventario de componentes de tu app).' },
      { label: 'Python — secrets / hashlib', url: 'https://docs.python.org/3/library/secrets.html', note: 'Generar tokens y hashes seguros sin reinventar la rueda.' },
      { label: 'pip — secure installs', url: 'https://pip.pypa.io/en/stable/topics/secure-installs/', note: 'Verificar paquetes antes de instalarlos para evitar supply-chain attacks.' },
    ],
  },
]

// ────────────────────────────────────────────────────────────────────────────
// Página
// ────────────────────────────────────────────────────────────────────────────
export function ResourcesPage({ sections }: ResourcesPageProps) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
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
          Una biblioteca curada para acompañarte durante todo el recorrido. Aquí encuentras cursos
          externos gratuitos, documentación oficial agrupada por área y referencias de seguridad y
          legalidad. Esto es, en vez de enlaces sueltos, te dejamos organizado lo que de verdad se usa
          en banca, fintech, retail y operaciones con datos en Perú y LatAm.
        </p>
      </motion.div>

      {/* External courses */}
      <section className="mt-10">
        <div className="mb-4 flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Cursos externos recomendados</h2>
        </div>
        <p className="mb-4 max-w-2xl text-sm text-muted-foreground">
          Alternativas gratuitas o de bajo costo para complementar lo que haces aquí. Útiles cuando
          quieres otra voz explicando el mismo concepto.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {externalCourses.map((c, i) => (
            <motion.a
              key={c.name}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="block"
            >
              <Card className="h-full p-5 transition-all hover:border-primary/30 hover:shadow-card-hover">
                <div className="flex items-start justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <h3 className="mt-3 font-semibold leading-tight">{c.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{c.note}</p>
              </Card>
            </motion.a>
          ))}
        </div>
      </section>

      {/* Official docs — grouped */}
      <section className="mt-10">
        <div className="mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Documentación oficial</h2>
        </div>
        <p className="mb-6 max-w-2xl text-sm text-muted-foreground">
          Tu fuente de verdad. Cuando algo no funcione o quieras profundizar, empieza por aquí: la
          documentación oficial está siempre actualizada y describe el comportamiento real del software,
          no la versión resumida que recuerda un tutorial.
        </p>

        <div className="space-y-8">
          {docGroups.map((group, gi) => {
            const Icon = group.icon
            return (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: gi * 0.05 }}
              >
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-base font-semibold">{group.title}</h3>
                </div>
                <p className="mb-3 text-xs text-muted-foreground">{group.blurb}</p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {group.docs.map((d) => (
                    <a
                      key={d.url}
                      href={d.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary/30 hover:bg-accent/30"
                    >
                      <FileText className="h-4 w-4 shrink-0 text-primary" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">{d.label}</div>
                        <div className="truncate text-xs text-muted-foreground">{d.note}</div>
                      </div>
                      <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground group-hover:text-primary" />
                    </a>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Security & Legal spotlight */}
      <section className="mt-12 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Scale className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
          <h2 className="text-xl font-semibold">Seguridad y legal: por qué importa</h2>
        </div>
        <p className="mb-3 max-w-3xl text-sm text-muted-foreground">
          Construir un producto moderno sin mirar la seguridad y la privacidad es como abrir un local
          sin seguro: funciona hasta que deja de funcionar, y entonces duele. Esto es, los datos de tus
          usuarios (y los de sus clientes) pueden costarte multas, reputación y, en casos graves,
          demandas. Por eso el curso dedica tiempo a OWASP, NIST, GDPR y CCPA desde el primer nivel.
        </p>
        <p className="text-sm text-muted-foreground">
          Más arriba, en el grupo{' '}
          <span className="font-semibold text-foreground">Seguridad y legal</span>, encuentras las
          fuentes oficiales. Aquí abajo dejamos tres lecturas que conviene tener frescas antes de
          publicar cualquier cosa con datos reales:
        </p>
        <ul className="mt-3 space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-300" />
            <span>
              <a
                href="https://cheatsheetseries.owasp.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline-offset-2 hover:underline"
              >
                OWASP Cheat Sheet Series
              </a>{' '}
              — recetas accionables por tema (authn, secrets, logging, XSS).
            </span>
          </li>
          <li className="flex items-start gap-2">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-300" />
            <span>
              <a
                href="https://owasp.org/www-project-secure-headers/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline-offset-2 hover:underline"
              >
                OWASP Secure Headers
              </a>{' '}
              — cabeceras HTTP que endurecen tu sitio en minutos.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-300" />
            <span>
              <a
                href="https://www.nist.gov/privacy-framework"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline-offset-2 hover:underline"
              >
                NIST Privacy Framework
              </a>{' '}
              — marco para gestionar riesgo de privacidad en serio.
            </span>
          </li>
        </ul>
      </section>

      {/* Per-section resources */}
      <section className="mt-10">
        <div className="mb-4 flex items-center gap-2">
          <Bookmark className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Recursos por sección</h2>
        </div>
        <p className="mb-4 max-w-2xl text-sm text-muted-foreground">
          La documentación puntual que cada sección cita a lo largo del curso. Si quieres volver a una
          fuente que viste en una sección específica, búscala aquí.
        </p>
        <div className="space-y-3">
          {sections.map((s, idx) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
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
