'use client'

export const QA_SCHEMA_VERSION = 'pyarcana.qa.v1' as const

export const QA_CATEGORIES = [
  { value: 'functionality', label: 'Funcionalidad' },
  { value: 'content', label: 'Contenido' },
  { value: 'unexplained-term', label: 'Término no explicado' },
  { value: 'unanswerable-question', label: 'Pregunta no respondible' },
  { value: 'assessment-design', label: 'Diseño de ejercicio/examen' },
  { value: 'ui-ux', label: 'UI / UX' },
  { value: 'accessibility', label: 'Accesibilidad' },
  { value: 'compatibility', label: 'Compatibilidad / rendimiento' },
  { value: 'other', label: 'Otro' },
] as const

export const QA_CAUSES = [
  { value: 'content-gap', label: 'Vacío o contradicción de contenido' },
  { value: 'logic-state', label: 'Lógica / estado' },
  { value: 'navigation', label: 'Navegación / flujo' },
  { value: 'data-persistence', label: 'Datos / persistencia' },
  { value: 'browser-device', label: 'Navegador / dispositivo' },
  { value: 'accessibility', label: 'Accesibilidad' },
  { value: 'visual-layout', label: 'Diseño / maquetación' },
  { value: 'unknown', label: 'No determinado' },
] as const

export const QA_SEVERITIES = [
  { value: 'blocker', label: 'Bloqueante' },
  { value: 'high', label: 'Alta' },
  { value: 'medium', label: 'Media' },
  { value: 'low', label: 'Baja' },
] as const

export type QACategory = (typeof QA_CATEGORIES)[number]['value']
export type QACause = (typeof QA_CAUSES)[number]['value']
export type QASeverity = (typeof QA_SEVERITIES)[number]['value']

export interface QAContext {
  path: string
  hash: string
  sectionId: string | null
  sectionIndex: number | null
  sectionTitle: string | null
  subStep: string | null
  viewport: { width: number; height: number }
  scrollY: number
  userAgent: string
  language: string
  deploymentSha: string | null
  elementHint: string | null
}

export interface QAIssue {
  id: string
  createdAt: string
  updatedAt: string
  status: 'open' | 'resolved'
  category: QACategory
  cause: QACause
  severity: QASeverity
  title: string
  description: string
  expected: string
  actual: string
  reproductionSteps: string
  improvement: string
  context: QAContext
  screenshotDataUrl?: string | null
}

export interface QAPackage {
  schemaVersion: typeof QA_SCHEMA_VERSION
  exportedAt: string
  tester: string
  sourceDeploymentSha: string | null
  issueCount: number
  issues: QAIssue[]
}

const DB_NAME = 'pyarcana-internal-qa'
const DB_VERSION = 1
const STORE_NAME = 'issues'
const FALLBACK_KEY = 'pyarcana:qa-issues:v1'
const TESTER_KEY = 'pyarcana:qa-tester:v1'
const MAX_PACKAGE_CHARACTERS = 16 * 1024 * 1024
const MAX_PACKAGE_ISSUES = 1000
const SAFE_SCREENSHOT_DATA_URL = /^data:image\/[a-z0-9.+-]+;base64,/i

const QA_CATEGORY_VALUES = new Set<string>(QA_CATEGORIES.map((item) => item.value))
const QA_CAUSE_VALUES = new Set<string>(QA_CAUSES.map((item) => item.value))
const QA_SEVERITY_VALUES = new Set<string>(QA_SEVERITIES.map((item) => item.value))

function requestAsPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed'))
  })
}

function transactionDone(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error ?? new Error('IndexedDB transaction failed'))
    transaction.onabort = () => reject(transaction.error ?? new Error('IndexedDB transaction aborted'))
  })
}

async function openQaDb(): Promise<IDBDatabase> {
  if (typeof indexedDB === 'undefined') throw new Error('IndexedDB unavailable')
  return await new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        store.createIndex('createdAt', 'createdAt')
        store.createIndex('sectionId', 'context.sectionId')
        store.createIndex('severity', 'severity')
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('Unable to open IndexedDB'))
  })
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === 'string'
}

function isFiniteNonNegativeNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
}

function isSectionIndex(value: unknown): value is number | null {
  return value === null || (typeof value === 'number' && Number.isInteger(value) && value >= 1)
}

function isQaContext(value: unknown): value is QAContext {
  if (!isRecord(value) || !isRecord(value.viewport)) return false
  const viewport = value.viewport
  return typeof value.path === 'string'
    && typeof value.hash === 'string'
    && isNullableString(value.sectionId)
    && isSectionIndex(value.sectionIndex)
    && isNullableString(value.sectionTitle)
    && isNullableString(value.subStep)
    && isFiniteNonNegativeNumber(viewport.width)
    && isFiniteNonNegativeNumber(viewport.height)
    && isFiniteNonNegativeNumber(value.scrollY)
    && typeof value.userAgent === 'string'
    && typeof value.language === 'string'
    && isNullableString(value.deploymentSha)
    && isNullableString(value.elementHint)
}

function isSafeScreenshot(value: unknown): value is string | null | undefined {
  return value === undefined
    || value === null
    || (typeof value === 'string' && SAFE_SCREENSHOT_DATA_URL.test(value))
}

function isQaIssue(value: unknown): value is QAIssue {
  if (!isRecord(value)) return false
  return typeof value.id === 'string'
    && typeof value.createdAt === 'string'
    && typeof value.updatedAt === 'string'
    && (value.status === 'open' || value.status === 'resolved')
    && typeof value.category === 'string'
    && QA_CATEGORY_VALUES.has(value.category)
    && typeof value.cause === 'string'
    && QA_CAUSE_VALUES.has(value.cause)
    && typeof value.severity === 'string'
    && QA_SEVERITY_VALUES.has(value.severity)
    && typeof value.title === 'string'
    && typeof value.description === 'string'
    && typeof value.expected === 'string'
    && typeof value.actual === 'string'
    && typeof value.reproductionSteps === 'string'
    && typeof value.improvement === 'string'
    && isQaContext(value.context)
    && isSafeScreenshot(value.screenshotDataUrl)
}

function fallbackRead(): QAIssue[] {
  if (typeof localStorage === 'undefined') return []
  try {
    const raw = localStorage.getItem(FALLBACK_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(isQaIssue) : []
  } catch {
    return []
  }
}

function fallbackWrite(issues: QAIssue[]): void {
  if (typeof localStorage === 'undefined') {
    throw new Error('El almacenamiento local alternativo no está disponible.')
  }
  try {
    localStorage.setItem(FALLBACK_KEY, JSON.stringify(issues))
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      throw new Error('No se pudo guardar la incidencia: se agotó la cuota de almacenamiento local del navegador.')
    }
    throw new Error('No se pudo guardar la incidencia en el almacenamiento local alternativo.')
  }
}

export async function listQaIssues(): Promise<QAIssue[]> {
  let db: IDBDatabase | null = null
  try {
    db = await openQaDb()
    const transaction = db.transaction(STORE_NAME, 'readonly')
    const rawIssues = await requestAsPromise(transaction.objectStore(STORE_NAME).getAll()) as unknown[]
    await transactionDone(transaction)
    return rawIssues.filter(isQaIssue).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  } catch {
    return fallbackRead().sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  } finally {
    db?.close()
  }
}

export async function saveQaIssue(issue: QAIssue): Promise<void> {
  let db: IDBDatabase | null = null
  try {
    db = await openQaDb()
    const transaction = db.transaction(STORE_NAME, 'readwrite')
    transaction.objectStore(STORE_NAME).put(issue)
    await transactionDone(transaction)
    return
  } catch {
    const issues = fallbackRead().filter((item) => item.id !== issue.id)
    issues.push(issue)
    // Web Storage writes are synchronous and throw on quota or access failure.
    // Do not swallow that exception: the form layer must know persistence failed
    // so it can preserve the tester's draft instead of claiming success.
    fallbackWrite(issues)
  } finally {
    db?.close()
  }
}

export async function deleteQaIssue(id: string): Promise<void> {
  let db: IDBDatabase | null = null
  try {
    db = await openQaDb()
    const transaction = db.transaction(STORE_NAME, 'readwrite')
    transaction.objectStore(STORE_NAME).delete(id)
    await transactionDone(transaction)
    return
  } catch {
    fallbackWrite(fallbackRead().filter((item) => item.id !== id))
  } finally {
    db?.close()
  }
}

export async function clearQaIssues(): Promise<void> {
  let db: IDBDatabase | null = null
  try {
    db = await openQaDb()
    const transaction = db.transaction(STORE_NAME, 'readwrite')
    transaction.objectStore(STORE_NAME).clear()
    await transactionDone(transaction)
    return
  } catch {
    fallbackWrite([])
  } finally {
    db?.close()
  }
}

export function getQaTester(): string {
  if (typeof localStorage === 'undefined') return ''
  try {
    return localStorage.getItem(TESTER_KEY) ?? ''
  } catch {
    return ''
  }
}

export function setQaTester(value: string): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(TESTER_KEY, value)
  } catch {
    // Non-critical preference only.
  }
}

export function createQaIssueId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `qa-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function buildQaPackage(issues: QAIssue[], tester: string): QAPackage {
  const sourceDeploymentSha = issues.find((issue) => issue.context.deploymentSha)?.context.deploymentSha ?? null
  return {
    schemaVersion: QA_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    tester: tester.trim(),
    sourceDeploymentSha,
    issueCount: issues.length,
    issues,
  }
}

export function parseQaPackage(text: string): QAPackage {
  if (text.length > MAX_PACKAGE_CHARACTERS) {
    throw new Error('El paquete QA supera el límite de 16 MB y no se importará.')
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('El archivo no contiene JSON válido.')
  }

  if (!isRecord(parsed) || parsed.schemaVersion !== QA_SCHEMA_VERSION) {
    throw new Error(`Paquete QA incompatible: se esperaba ${QA_SCHEMA_VERSION}.`)
  }
  if (!Array.isArray(parsed.issues) || parsed.issues.length > MAX_PACKAGE_ISSUES || !parsed.issues.every(isQaIssue)) {
    throw new Error('El paquete QA no contiene una lista válida de incidencias o alguno de sus contextos está incompleto.')
  }

  return {
    schemaVersion: QA_SCHEMA_VERSION,
    exportedAt: typeof parsed.exportedAt === 'string' ? parsed.exportedAt : new Date().toISOString(),
    tester: typeof parsed.tester === 'string' ? parsed.tester : '',
    sourceDeploymentSha: typeof parsed.sourceDeploymentSha === 'string' ? parsed.sourceDeploymentSha : null,
    issueCount: parsed.issues.length,
    issues: parsed.issues,
  }
}

export async function importQaPackage(pkg: QAPackage): Promise<void> {
  for (const issue of pkg.issues) await saveQaIssue(issue)
  if (pkg.tester) setQaTester(pkg.tester)
}

export function qaPackageFile(pkg: QAPackage): File {
  const stamp = pkg.exportedAt.slice(0, 19).replace(/[:T]/g, '-')
  return new File(
    [JSON.stringify(pkg, null, 2)],
    `pyarcana-qa-${stamp}.json`,
    { type: 'application/json' },
  )
}
