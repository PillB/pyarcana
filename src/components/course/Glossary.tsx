'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, BookOpen, X, ChevronRight, Lightbulb } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface GlossaryEntry {
  term: string
  category: 'Python' | 'Data Science' | 'NumPy' | 'Pandas' | 'ML' | 'Tooling'
  definition: string
  example?: string
  related?: string[]
}

const GLOSSARY: GlossaryEntry[] = [
  // Python basics
  { term: 'Variable', category: 'Python', definition: 'Una etiqueta que apunta a un valor en memoria. En Python no declaras el tipo — se infiere.', example: 'x = 42\nnombre = "Ana"', related: ['Tipo de dato', 'Asignación'] },
  { term: 'Tipo de dato', category: 'Python', definition: 'La naturaleza del valor: int (entero), float (decimal), str (texto), bool (True/False), list, dict, tuple, set.' },
  { term: 'List comprehension', category: 'Python', definition: 'Sintaxis compacta para crear listas a partir de otras. Más rápido y pythónico que un loop for.', example: '[x**2 for x in range(5) if x > 0]  # [1, 4, 9, 16]' },
  { term: 'Dict comprehension', category: 'Python', definition: 'Similar a list comprehension pero crea diccionarios.', example: '{k: v**2 for k, v in {"a": 1, "b": 2}.items()}' },
  { term: 'f-string', category: 'Python', definition: 'String formatting con f prefijo. Permite insertar variables directamente con {}.', example: 'f"Hola {nombre}, tienes {edad} años"' },
  { term: 'Slicing', category: 'Python', definition: 'Extraer una porción de una secuencia. Sintaxis: secuencia[inicio:fin:paso].', example: 'lista[1:4]  # elementos del índice 1 al 3\nlista[::-1]  # reverso' },
  { term: 'Truthiness', category: 'Python', definition: 'Valores que se evalúan como False: 0, 0.0, "", [], {}, None. Todo lo demás es True.' },
  { term: 'Dunder method', category: 'Python', definition: 'Métodos especiales con __ al inicio y fin (double underscore). Ej: __init__, __str__, __repr__, __len__.' },
  { term: 'Decorador', category: 'Python', definition: 'Función que recibe otra función y devuelve una nueva con comportamiento extendido. Se aplica con @.', example: '@timing\ndef mi_func(): ...' },
  { term: 'Generator', category: 'Python', definition: 'Función que usa yield para producir valores uno a uno, sin cargar todo en memoria.', example: 'def cuenta():\n    for i in range(10):\n        yield i' },
  { term: 'Context manager', category: 'Python', definition: 'Objeto que define setup (__enter__) y cleanup (__exit__). Se usa con el statement with.', example: 'with open("f.csv") as f:\n    data = f.read()' },
  { term: 'ABC', category: 'Python', definition: 'Abstract Base Class. Define interfaces: métodos que las subclases DEBEN implementar. No se puede instanciar directamente.' },
  { term: 'args y kwargs', category: 'Python', definition: '*args junta argumentos posicionales en tupla. **kwargs junta argumentos keyword en dict.' },
  { term: 'Virtual environment (venv)', category: 'Tooling', definition: 'Carpeta con instalación aislada de Python y paquetes. Evita conflictos entre proyectos.' },
  { term: 'pip', category: 'Tooling', definition: 'Package installer for Python. Instala paquetes desde PyPI. pip install pandas, pip freeze > requirements.txt.' },
  { term: 'requirements.txt', category: 'Tooling', definition: 'Archivo que lista las dependencias del proyecto con versiones pinneadas. Garantiza reproducibilidad.' },
  { term: 'Conventional Commits', category: 'Tooling', definition: 'Estándar para mensajes de git commit: feat:, fix:, docs:, refactor:, test:, chore:.' },
  { term: 'pytest', category: 'Tooling', definition: 'Framework de testing para Python. Más simple que unittest. Descubre automáticamente test_*.py.' },
  { term: 'Coverage', category: 'Tooling', definition: 'Porcentaje de líneas de código cubiertas por tests. pytest --cov=mi_modulo.' },

  // Data structures
  { term: 'List', category: 'Python', definition: 'Secuencia ordenada mutable. [1, 2, 3]. Métodos: append, extend, insert, remove, sort.' },
  { term: 'Dict', category: 'Python', definition: 'Pares clave-valor con búsqueda O(1). {"nombre": "Ana", "edad": 25}. Métodos: get, items, keys, values.' },
  { term: 'Tuple', category: 'Python', definition: 'Lista inmutable. (1, 2, 3). Más rápida y segura para datos que no cambian.' },
  { term: 'Set', category: 'Python', definition: 'Conjunto sin duplicados. {1, 2, 3}. Operaciones: | unión, & intersección, - diferencia.' },
  { term: 'defaultdict', category: 'Python', definition: 'Dict que crea valores default automáticamente. from collections import defaultdict.' },
  { term: 'Counter', category: 'Python', definition: 'Dict especializado para contar. Counter("hola") → {"h":1, "o":1, "l":1, "a":1}.' },
  { term: 'namedtuple', category: 'Python', definition: 'Tuple con campos nombrados. Más legible que índices. from collections import namedtuple.' },

  // NumPy
  { term: 'ndarray', category: 'NumPy', definition: 'Estructura principal de NumPy. Array n-dimensional, todos los elementos del mismo tipo.' },
  { term: 'Vectorización', category: 'NumPy', definition: 'Operaciones aplicadas elemento a elemento sin loops de Python. 50-100x más rápido.' },
  { term: 'Broadcasting', category: 'NumPy', definition: 'Permite operar arrays de shapes distintas. NumPy "estira" el más pequeño sin copiar datos.' },
  { term: 'Boolean masking', category: 'NumPy', definition: 'Usar un array booleano como índice para filtrar. arr[arr > 5] devuelve elementos que cumplen.' },
  { term: 'Shape', category: 'NumPy', definition: 'Dimensiones del array. (3, 4) = 3 filas, 4 columnas. arr.shape devuelve tupla.' },
  { term: 'dtype', category: 'NumPy', definition: 'Tipo de datos del array. int64, float32, bool, etc. arr.dtype.' },
  { term: 'Reshape', category: 'NumPy', definition: 'Cambiar la shape sin cambiar los datos. arr.reshape(3, 4). -1 = wildcard.' },

  // Pandas
  { term: 'DataFrame', category: 'Pandas', definition: 'Tabla 2D con columnas de tipos distintos. Equivalente a una hoja de Excel. pd.read_csv() lo crea.' },
  { term: 'Series', category: 'Pandas', definition: 'Columna de un DataFrame. 1D con índice. df["col"] devuelve una Series.' },
  { term: 'GroupBy', category: 'Pandas', definition: 'Patrón split-apply-combine. df.groupby("region")["ventas"].sum(). Agrupa por una clave y agrega.' },
  { term: 'Merge', category: 'Pandas', definition: 'Combinar dos DataFrames por una columna común. how: inner, left, right, outer.' },
  { term: 'Pivot table', category: 'Pandas', definition: 'Reestructura datos largos a anchos. df.pivot_table(index, columns, values, aggfunc).' },
  { term: 'iloc vs loc', category: 'Pandas', definition: 'loc usa labels (nombres), iloc usa posiciones (enteros 0-based).' },
  { term: 'apply', category: 'Pandas', definition: 'Aplica una función a cada elemento/fila/columna. df["col"].apply(mi_func).' },
  { term: 'EDA', category: 'Data Science', definition: 'Exploratory Data Analysis. Inspeccionar datos antes de modelar: .info(), .describe(), .value_counts(), visualizaciones.' },
  { term: 'Missing values', category: 'Pandas', definition: 'Valores nulos (NaN). isnull().sum() para contar. fillna() para imputar, dropna() para eliminar.' },
  { term: 'Resample', category: 'Pandas', definition: 'Cambiar frecuencia de serie temporal. df.resample("M").sum() agrupa por mes.' },

  // ML
  { term: 'Pipeline', category: 'ML', definition: 'Encadena transformaciones + modelo. Evita data leakage. sklearn.pipeline.Pipeline.' },
  { term: 'ColumnTransformer', category: 'ML', definition: 'Aplica transformaciones distintas a columnas distintas en paralelo. Numéricas: scaler, categóricas: onehot.' },
  { term: 'Cross-validation', category: 'ML', definition: 'Divide datos en K folds, entrena en K-1 y evalúa en 1, rotando. cross_val_score. Estratificado para desbalance.' },
  { term: 'Overfitting', category: 'ML', definition: 'Modelo memoriza training data, generaliza mal. Síntomas: train score >> test score. Fix: más datos, regularización, simpler model.' },
  { term: 'ROC-AUC', category: 'ML', definition: 'Área bajo curva ROC. Métrica para clasificación binaria. 0.5 = azar, 1.0 = perfecto. Robusta a desbalance.' },
  { term: 'Precision', category: 'ML', definition: 'De los positivos predichos, cuántos son reales. TP / (TP + FP). Alto = pocos falsos positivos.' },
  { term: 'Recall', category: 'ML', definition: 'De los positivos reales, cuántos detectas. TP / (TP + FN). Alto = pocos falsos negativos.' },
  { term: 'F1-score', category: 'ML', definition: 'Media armónica de precision y recall. Útil cuando hay desbalance. 2 * (P * R) / (P + R).' },
  { term: 'SHAP', category: 'ML', definition: 'SHapley Additive exPlanations. Explica contribución de cada feature a una predicción. Beeswarm global, waterfall individual.' },
  { term: 'Hyperparameter tuning', category: 'ML', definition: 'Encontrar mejores hiperparámetros. GridSearchCV (exhaustivo) o RandomizedSearchCV (más eficiente).' },
  { term: 'StandardScaler', category: 'ML', definition: 'Normaliza a media 0, std 1. (x - mean) / std. Para modelos sensibles a escala (SVM, regresión).' },
  { term: 'OneHotEncoder', category: 'ML', definition: 'Convierte categóricas en binarias. drop="first" evita multicolinealidad.' },
  { term: 'StratifiedKFold', category: 'ML', definition: 'KFold que mantiene proporción de clases en cada fold. Obligatorio para clasificación desbalanceada.' },
  { term: 'joblib', category: 'ML', definition: 'Persistencia de modelos. joblib.dump(model, "model.joblib"). Más eficiente que pickle para arrays NumPy.' },

  // Data Science
  { term: 'Outlier', category: 'Data Science', definition: 'Valor atípico. Detectar con IQR: Q1 - 1.5*IQR a Q3 + 1.5*IQR. Los outliers afectan media y modelos.' },
  { term: 'IQR', category: 'Data Science', definition: 'Rango intercuartílico. Q3 - Q1. Medida robusta de dispersión.' },
  { term: 'Correlación', category: 'Data Science', definition: 'Relación entre dos variables. -1 a 1. np.corrcoef, df.corr(). Cuidado: correlación no implica causalidad.' },
  { term: 'Distribución normal', category: 'Data Science', definition: 'Campana de Gauss. Media=mediana=moda. 68% dentro de 1 std, 95% dentro de 2 std.' },
  { term: 'p-value', category: 'Data Science', definition: 'Probabilidad de observar el resultado si la hipótesis nula es cierta. <0.05 típicamente "significativo".' },
  { term: 'Feature engineering', category: 'Data Science', definition: 'Crear nuevas features a partir de las existentes. Ej: año de fecha, ratio de dos columnas, bins de edad.' },
  { term: 'Train/test split', category: 'ML', definition: 'Dividir datos en entrenamiento (80%) y prueba (20%). El modelo nunca "ve" el test durante training.' },
  { term: 'Data leakage', category: 'ML', definition: 'Cuando info del test set "contamina" el entrenamiento. Pipeline lo previene aplicando fit solo en train.' },
]

const CATEGORIES: GlossaryEntry['category'][] = ['Python', 'Data Science', 'NumPy', 'Pandas', 'ML', 'Tooling']

const CATEGORY_COLORS: Record<GlossaryEntry['category'], string> = {
  Python: 'bg-violet-500/10 text-violet-600 border-violet-500/30',
  'Data Science': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
  NumPy: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
  Pandas: 'bg-green-500/10 text-green-600 border-green-500/30',
  ML: 'bg-rose-500/10 text-rose-600 border-rose-500/30',
  Tooling: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
}

interface GlossaryProps {
  open: boolean
  onClose: () => void
}

export function Glossary({ open, onClose }: GlossaryProps) {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<GlossaryEntry['category'] | 'all'>('all')
  const [selectedTerm, setSelectedTerm] = useState<GlossaryEntry | null>(null)

  // Keyboard shortcut: Cmd/Ctrl+K to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (open) {
          const input = document.getElementById('glossary-search') as HTMLInputElement
          input?.focus()
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return GLOSSARY.filter((entry) => {
      const matchesQuery =
        !q ||
        entry.term.toLowerCase().includes(q) ||
        entry.definition.toLowerCase().includes(q) ||
        entry.category.toLowerCase().includes(q)
      const matchesCategory = activeCategory === 'all' || entry.category === activeCategory
      return matchesQuery && matchesCategory
    }).sort((a, b) => a.term.localeCompare(b.term))
  }, [query, activeCategory])

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-hidden p-0">
        <DialogHeader className="border-b border-border px-6 py-4">
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Glosario Python DS
            <Badge variant="secondary" className="ml-2 text-[10px]">
              {GLOSSARY.length} términos
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {/* Search bar */}
        <div className="border-b border-border px-6 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="glossary-search"
              placeholder="Buscar término, definición o categoría... (Cmd+K)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category filters */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveCategory('all')}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                activeCategory === 'all'
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border hover:bg-accent'
              )}
            >
              Todos
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  activeCategory === cat
                    ? CATEGORY_COLORS[cat]
                    : 'border-border hover:bg-accent'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[55vh] overflow-y-auto scroll-area-thin px-6 py-4">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No se encontraron términos para "{query}"
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence>
                {filtered.map((entry) => (
                  <motion.div
                    key={entry.term}
                    layout
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Card
                      className="cursor-pointer border-border/60 p-3 transition-all hover:border-primary/30 hover:shadow-card-hover"
                      onClick={() => setSelectedTerm(entry)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">{entry.term}</span>
                            <span
                              className={cn(
                                'rounded-full border px-2 py-0.5 text-[10px] font-medium',
                                CATEGORY_COLORS[entry.category]
                              )}
                            >
                              {entry.category}
                            </span>
                          </div>
                          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                            {entry.definition}
                          </p>
                        </div>
                        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Detail dialog */}
        <AnimatePresence>
          {selectedTerm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 bg-background/95 backdrop-blur"
              onClick={() => setSelectedTerm(null)}
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="mx-auto mt-20 max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-xl"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold gradient-text">{selectedTerm.term}</h2>
                    <span
                      className={cn(
                        'mt-1 inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium',
                        CATEGORY_COLORS[selectedTerm.category]
                      )}
                    >
                      {selectedTerm.category}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedTerm(null)}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-foreground/90">
                  {selectedTerm.definition}
                </p>

                {selectedTerm.example && (
                  <div className="mt-4">
                    <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                      <Lightbulb className="h-3.5 w-3.5" />
                      EJEMPLO
                    </div>
                    <pre className="code-block code-block-dark overflow-x-auto rounded-lg p-4 text-xs">
                      <code>{selectedTerm.example}</code>
                    </pre>
                  </div>
                )}

                {selectedTerm.related && selectedTerm.related.length > 0 && (
                  <div className="mt-4">
                    <div className="mb-2 text-xs font-semibold text-muted-foreground">
                      TÉRMINOS RELACIONADOS
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedTerm.related.map((r) => {
                        const related = GLOSSARY.find((g) => g.term === r)
                        if (!related) return null
                        return (
                          <button
                            key={r}
                            onClick={() => setSelectedTerm(related)}
                            className="rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs hover:border-primary/30 hover:bg-accent"
                          >
                            {r}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
