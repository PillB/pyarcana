import type { CourseMeta, CourseSection } from '../types'
import { section01 } from './sections/s01-setup'
import { section02 } from './sections/s02-basics'
import { section03 } from './sections/s03-data-structures'
import { section04 } from './sections/s04-functions-modules'
import { section05 } from './sections/s05-oop'
import { section06 } from './sections/s06-numpy'
import { section07 } from './sections/s07-pandas'
import { section08 } from './sections/s08-visualization'
import { section09 } from './sections/s09-sklearn'
import { section10 } from './sections/s10-testing'
import { section11 } from './sections/s11-advanced-topics'

export const COURSE_META: CourseMeta = {
  title: 'Python DS Perú',
  subtitle: 'De cero a Data Analyst / Data Scientist con proyectos reales para tu portafolio',
  description:
    'Curso autónomo en español peruano, basado en el método I Do / We Do / You Do. 11 secciones que te llevan desde instalar Python hasta construir pipelines production-ready con scraping, APIs, SQL, multiprocessing y tests en GitHub Actions.',
  totalSections: 11,
  totalHours: 86,
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
]
