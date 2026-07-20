import fs from 'fs'
import path from 'path'

export interface CatalogExercise {
  id: string
  index: number
  hasTests: boolean
  hasSolution: boolean
}

export interface CatalogSelfCheck {
  qIndex: number
  optionCount: number
  correctIndex: number
}

export interface CatalogSection {
  id: string
  index: number
  title: string
  subSteps: string[]
  demos: { demoId: string }[]
  exercises: CatalogExercise[]
  selfCheck: CatalogSelfCheck[]
  exam: { concepts: number; variants: number }
}

export interface InteractionCatalog {
  generated_at: string
  views: string[]
  totals: {
    sections: number
    demos: number
    exercises: number
    selfCheckQuestions: number
  }
  ok: boolean
  sections: CatalogSection[]
}

const catalogPath = path.join(process.cwd(), 'course-state/interaction_catalog.json')

export function loadCatalog(): InteractionCatalog {
  if (!fs.existsSync(catalogPath)) {
    throw new Error(
      `Missing ${catalogPath}. Run: node scripts/export_interaction_catalog.mjs`
    )
  }
  return JSON.parse(fs.readFileSync(catalogPath, 'utf8')) as InteractionCatalog
}

/** SECTION_SHARD=k/n → sections where index-1 % n === k (0-based). */
export function shardSections(sections: CatalogSection[]): CatalogSection[] {
  const raw = process.env.SECTION_SHARD
  if (!raw) return sections
  const [kStr, nStr] = raw.split('/')
  const k = Number(kStr)
  const n = Number(nStr)
  if (!Number.isFinite(k) || !Number.isFinite(n) || n <= 0) return sections
  return sections.filter((s) => (s.index - 1) % n === k)
}
