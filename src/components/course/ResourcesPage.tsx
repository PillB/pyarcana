'use client'

import { motion } from 'framer-motion'
import { BookOpen, ExternalLink, Library, GraduationCap, FileText, Bookmark } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Resources } from '@/lib/types'

interface ResourcesPageProps {
  sections: { id: string; title: string; shortTitle: string; resources: Resources }[]
}

export function ResourcesPage({ sections }: ResourcesPageProps) {
  // Aggregado de libros referenciados en todas las secciones
  const allBooks = new Map<string, string>()
  sections.forEach((s) => s.resources.books.forEach((b) => allBooks.set(b.label, b.note)))

  // EPUBs locales
  const localEpubs = [
    { name: 'Python 101', file: 'python_101.epub', note: 'Introducción amigable a Python — base de sintaxis y conceptos.' },
    { name: 'Python Awesome Job', file: 'PythonAwesomeJob.epub', note: 'Python aplicado al trabajo: automatización, scripts útiles, productividad.' },
    { name: 'Python Apprentice to Master', file: 'Python Apprentice to Master.epub', note: 'Crecimiento de principiante a avanzado: patrones, OOP, buenas prácticas.' },
    { name: 'python201', file: 'python201.epub', note: 'Temas intermedios-avanzados: decorators, context managers, metaprogramación.' },
  ]

  const externalCourses = [
    { name: 'CS50P — Harvard', url: 'https://cs50.harvard.edu/python', note: 'Curso gratuito certificado. Estandar para principiantes.' },
    { name: 'Google IT Automation with Python', url: 'https://www.coursera.org/professional-certificates/google-it-automation', note: 'Certificación profesional con marca Google en LinkedIn.' },
    { name: 'Kaggle Learn', url: 'https://www.kaggle.com/learn', note: 'Micro-cursos gratuitos con badges. Python, Pandas, ML, SQL.' },
    { name: 'Real Python', url: 'https://realpython.com', note: 'Tutoriales de calidad editorial. Profundidad técnica.' },
    { name: 'Python.org Official Tutorial', url: 'https://docs.python.org/3/tutorial/', note: 'La fuente oficial. Seco pero completo.' },
    { name: 'freeCodeCamp Python', url: 'https://www.freecodecamp.org/learn/scientific-computing-with-python/', note: 'Gratis con certificado. Proyectos prácticos.' },
  ]

  const docsAggregated = [
    { label: 'Python docs — oficial', url: 'https://docs.python.org/3/', note: 'Tu fuente de verdad. Bookmarkalo.' },
    { label: 'NumPy user guide', url: 'https://numpy.org/doc/stable/user/', note: 'Vectorización y broadcasting bien explicados.' },
    { label: 'Pandas documentation', url: 'https://pandas.pydata.org/docs/', note: 'El 80% de tu día como Data Analyst.' },
    { label: 'scikit-learn user guide', url: 'https://scikit-learn.org/stable/user_guide.html', note: 'Pipeline, ColumnTransformer, cross-validation.' },
    { label: 'matplotlib gallery', url: 'https://matplotlib.org/stable/gallery/', note: 'Copia y adapta. Así se aprende visualización.' },
    { label: 'seaborn tutorial', url: 'https://seaborn.pydata.org/tutorial.html', note: 'Stats plots con una línea de código.' },
    { label: 'Plotly Python docs', url: 'https://plotly.com/python/', note: 'Gráficos interactivos para dashboards.' },
    { label: 'pytest docs', url: 'https://docs.pytest.org/', note: 'Testing que no duerme.' },
    { label: 'Real Python — best practices', url: 'https://realpython.com/tutorials/best-practices/', note: 'Cómo escribir Python pythónico.' },
  ]

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
        <p className="mt-2 text-muted-foreground">
          Todo lo que necesitas para profundizar: libros, cursos gratuitos, documentación oficial y referencias por sección.
        </p>
      </motion.div>

      {/* EPUBs locales */}
      <section className="mt-8">
        <div className="mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Libros base del curso</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {localEpubs.map((b, i) => (
            <motion.div
              key={b.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="h-full p-5 transition-shadow hover:shadow-card-hover">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg gradient-primary text-white">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold">{b.name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{b.note}</p>
                    <Badge variant="secondary" className="mt-2 font-mono text-[10px]">
                      {b.file}
                    </Badge>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* External courses */}
      <section className="mt-10">
        <div className="mb-4 flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Cursos externos recomendados</h2>
        </div>
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

      {/* Official docs */}
      <section className="mt-10">
        <div className="mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Documentación oficial</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {docsAggregated.map((d, i) => (
            <motion.a
              key={d.label}
              href={d.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="group flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary/30 hover:bg-accent/30"
            >
              <FileText className="h-4 w-4 shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{d.label}</div>
                <div className="truncate text-xs text-muted-foreground">{d.note}</div>
              </div>
              <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground group-hover:text-primary" />
            </motion.a>
          ))}
        </div>
      </section>

      {/* Per-section resources */}
      <section className="mt-10">
        <div className="mb-4 flex items-center gap-2">
          <Bookmark className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Recursos por sección</h2>
        </div>
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
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
