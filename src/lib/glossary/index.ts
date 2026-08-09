export {
  GLOSSARY_TERMS,
  GLOSSARY_BY_ALIAS,
  findGlossaryTerm,
  type GlossaryTerm,
  type GlossaryCategory,
} from './terms'

import { COURSE_SECTIONS } from '@/lib/course'
import { GLOSSARY_TERMS, type GlossaryTerm } from './terms'

const sectionOrder = new Map(
  COURSE_SECTIONS.map((s, i) => [s.id, i] as const)
)

/** Terms that are valid to show as hover hints up to (and including) sectionId */
export function termsAvailableAt(sectionId: string | undefined): GlossaryTerm[] {
  if (!sectionId) return GLOSSARY_TERMS
  const idx = sectionOrder.get(sectionId)
  if (idx === undefined) return GLOSSARY_TERMS
  return GLOSSARY_TERMS.filter((t) => {
    const fi = sectionOrder.get(t.firstSectionId)
    return fi === undefined || fi <= idx
  })
}

export function sectionTitle(sectionId: string): string {
  return COURSE_SECTIONS.find((s) => s.id === sectionId)?.shortTitle || sectionId
}
