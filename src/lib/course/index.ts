import type { CourseMeta, CourseSection } from '../types'
import { section01 } from './sections/s01-setup'
import { section02 } from './sections/s02-basics'
import { section03 } from './sections/s03-data-structures'
import { section04 } from './sections/s04-functions-modules'
import { section05 } from './sections/s05-oop'
import { section06 } from './sections/s06-numpy'
import { section07 } from './sections/s07-data-acquisition'
import { section08 } from './sections/s08-pandas'
import { section09 } from './sections/s09-visualization'
import { section10 } from './sections/s10-sklearn'
import { section11 } from './sections/s11-testing'
import { section12 } from './sections/s12-performance'
import { section13 } from './sections/s13-rpa-automation'
// Phase 1 — Competente (14-26)
import { section14 } from './sections/s14-security'
import { section15 } from './sections/s15-stdlib-deep'
import { section16 } from './sections/s16-wxpython-gui'
import { section17 } from './sections/s17-packaging'
import { section18 } from './sections/s18-data-engineering'
import { section19 } from './sections/s19-databases-orm'
import { section20 } from './sections/s20-rag'
import { section21 } from './sections/s21-fastapi'
import { section22 } from './sections/s22-rapidfuzz-entity'
import { section23 } from './sections/s23-computer-vision'
import { section24 } from './sections/s24-rpa-advanced'
import { section25 } from './sections/s25-streamlit-dashboards'
import { section26 } from './sections/s26-integrator-phase1'
// Phase 2 — Senior (27-39)
import { section27 } from './sections/s27-async-concurrency'
import { section28 } from './sections/s28-llm-agents'
import { section29 } from './sections/s29-mlops'
import { section30 } from './sections/s30-security-infra'
import { section31 } from './sections/s31-streaming-data'
import { section32 } from './sections/s32-microservices'
import { section33 } from './sections/s33-advanced-models'
import { section34 } from './sections/s34-cv-ai-integration'
import { section35 } from './sections/s35-system-design'
import { section36 } from './sections/s36-ai-apis-advanced'
import { section37 } from './sections/s37-dbt-bigquery'
import { section38 } from './sections/s38-performance-extreme'
import { section39 } from './sections/s39-integrator-phase2'
// Phase 3 — Master (40-52)
import { section40 } from './sections/s40-agentic-architecture'
import { section41 } from './sections/s41-llm-finetuning'
import { section42 } from './sections/s42-graph-rag'
import { section43 } from './sections/s43-llmops'
import { section44 } from './sections/s44-multimodal'
import { section45 } from './sections/s45-iac'
import { section46 } from './sections/s46-gpu-computing'
import { section47 } from './sections/s47-opensource'
import { section48 } from './sections/s48-ai-governance'
import { section49 } from './sections/s49-data-contracts'
import { section50 } from './sections/s50-tech-leadership'
import { section51 } from './sections/s51-integrator-final'
import { section52 } from './sections/s52-career-strategy'

export const COURSE_META: CourseMeta = {
  title: 'El Arte de Python',
  subtitle: 'De cero a Data Scientist — transforma datos en decisiones que cambian negocios',
  description:
    'Curso autónomo en español peruano, basado en el método I Do / We Do / You Do. 52 secciones en 4 fases que te llevan desde instalar Python hasta arquitectar plataformas de IA a escala. Incluye adquisición de datos, análisis con pandas, ML production-ready, RPA con IA, seguridad, ingeniería de datos, LLMs, y automatización multi-modal.',
  totalSections: 52,
  totalHours: 520,
  targetRole: 'Data Analyst / Data Scientist / AI Engineer',
}

export const COURSE_SECTIONS: CourseSection[] = [
  // Phase 0 — Fundamentos (1-13)
  section01, section02, section03, section04, section05, section06,
  section07, section08, section09, section10, section11, section12, section13,
  // Phase 1 — Competente (14-26)
  section14, section15, section16, section17, section18, section19,
  section20, section21, section22, section23, section24, section25, section26,
  // Phase 2 — Senior (27-39)
  section27, section28, section29, section30, section31, section32,
  section33, section34, section35, section36, section37, section38, section39,
  // Phase 3 — Master (40-52)
  section40, section41, section42, section43, section44, section45,
  section46, section47, section48, section49, section50, section51, section52,
]

// Helper: get sections by phase
export function getSectionsByPhase(phase: 0 | 1 | 2 | 3): CourseSection[] {
  return COURSE_SECTIONS.filter(s => s.phase === phase)
}

// Phase metadata
export const PHASES = [
  { id: 0, name: 'Fundamentos', level: 'Principiante → Avanzado', sections: '1-13', hours: 122, color: 'from-violet-500 to-violet-700' },
  { id: 1, name: 'Competente', level: 'Competente', sections: '14-26', hours: 150, color: 'from-blue-500 to-indigo-600' },
  { id: 2, name: 'Senior', level: 'Senior', sections: '27-39', hours: 168, color: 'from-purple-500 to-fuchsia-600' },
  { id: 3, name: 'Master', level: 'Master', sections: '40-52', hours: 160, color: 'from-amber-500 to-red-600' },
] as const
