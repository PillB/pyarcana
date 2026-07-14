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

export const COURSE_META: CourseMeta = {
  title: 'El Arte de Python',
  subtitle: 'De cero a Data Scientist — transforma datos en decisiones que cambian negocios',
  description:
    'Curso autónomo en español peruano, basado en el método I Do / We Do / You Do. 13 secciones que te llevan desde instalar Python hasta construir pipelines de automatización con RPA e IA local. Incluye adquisición de datos (scraping, SQL, APIs), análisis con pandas, visualización con mapas interactivos, ML production-ready, testing, performance y automatización multi-modal. Cada sección tiene un proyecto real para tu portafolio.',
  totalSections: 13,
  totalHours: 110,
  targetRole: 'Data Analyst / Data Scientist',
}

export const COURSE_SECTIONS: CourseSection[] = [
  section01,
  section02,
  section03,
  section04,
  section05,
  section06,
  section07,
  section08,
  section09,
  section10,
  section11,
  section12,
  section13,
]
