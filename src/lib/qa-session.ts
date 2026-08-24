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

function fallbackRead(): QAIssue[] {
  if (typeof localStorage === 'undefined') return []
  try {
    const raw = localStorage.getItem(FALLBACK_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as QAIssue[]) : []
  } catch {
    return []
  }
}

function fallbackWrite(issues: QAIssue[]): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(FALLBACK_KEY, JSON.stringify(issues))
  } catch {
    // Storage may be unavailable or the screenshot may exceed quota.
  }
}

export async function listQaIssues(): Promise<QAIssue[]> {
  try {
    const db = await openQaDb()
    const transaction = db.transaction(STORE_NAME, 'readonly')
    const issues = await requestAsPromise(transaction.objectStore(STORE_NAME).getAll()) as QAIssue[]
    await transactionDone(transaction)
    db.close()
    return issues.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  } catch {
    return fallbackRead().sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }
}

export async function saveQaIssue(issue: QAIssue): Promise<void> {
  try {
    const db = await openQaDb()
    const transaction = db.transaction(STORE_NAME, 'readwrite')
    transaction.objectStore(STORE_NAME).put(issue)
    await transactionDone(transaction)
    db.close()
  } catch {
    const issues = fallbackRead().filter((item) => item.id !== issue.id)
    issues.push(issue)
    fallbackWrite(issues)
  }
}

export async function deleteQaIssue(id: string): Promise<void> {
  try {
    const db = await openQaDb()
    const transaction = db.transaction(STORE_NAME, 'readwrite')
    transaction.objectStore(STORE_NAME).delete(id)
    await transactionDone(transaction)
    db.close()
  } catch {
    fallbackWrite(fallbackRead().filter((item) => item.id !== id))
  }
}

export async function clearQaIssues(): Promise<void> {
  try {
    const db = await openQaDb()
    const transaction = db.transaction(STORE_NAME, 'readwrite')
    transaction.objectStore(STORE_NAME).clear()
    await transactionDone(transaction)
    db.close()
  } catch {
    fallbackWrite([])
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

function isQaIssue(value: unknown): value is QAIssue {
  if (!value || typeof value !== 'object') return false
  const issue = value as Partial<QAIssue>
  return typeof issue.id === 'string'
    && typeof issue.createdAt === 'string'
    && typeof issue.title === 'string'
    && typeof issue.description === 'string'
    && typeof issue.category === 'string'
    && typeof issue.severity === 'string'
    && !!issue.context
    && typeof issue.context === 'object'
}

export function parseQaPackage(text: string): QAPackage {
  const value = JSON.parse(text) as Partial<QAPackage>
  if (value.schemaVersion !== QA_SCHEMA_VERSION) {
    throw new Error(`Paquete QA incompatible: se esperaba ${QA_SCHEMA_VERSION}.`)
  }
  if (!Array.isArray(value.issues) || !value.issues.every(isQaIssue)) {
    throw new Error('El paquete QA no contiene una lista válida de incidencias.')
  }
  return {
    schemaVersion: QA_SCHEMA_VERSION,
    exportedAt: typeof value.exportedAt === 'string' ? value.exportedAt : new Date().toISOString(),
    tester: typeof value.tester === 'string' ? value.tester : '',
    sourceDeploymentSha: typeof value.sourceDeploymentSha === 'string' ? value.sourceDeploymentSha : null,
    issueCount: value.issues.length,
    issues: value.issues,
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
