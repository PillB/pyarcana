/**
 * Emit every learner-visible content event across S01..S52, in display order.
 *
 * This exists so the define-before-use gate can run over the whole course instead of
 * only S01. It imports the real COURSE_SECTIONS rather than regexing the TypeScript,
 * so a field that moves or gains a wrapper does not silently drop out of the audit.
 *
 * Each event carries which glossary terms it mentions, defines and requires:
 *   mentions — an alias appears in the text
 *   defines  — an alias appears next to a definition cue, so a reader learns it here
 *   requires — the learner must already know the term to do what the event asks
 *
 * Solutions are emitted with kind "solution" so the gate's HIDDEN_EVENT_KINDS can
 * refuse to let a hidden answer count as having taught anything.
 */
import { COURSE_SECTIONS } from '../src/lib/course/index'
import { GLOSSARY_TERMS } from '../src/lib/glossary/terms'

type Ev = {
  section_id: string
  display_order: number
  kind: string
  location: string
  text: string
  learner_visible: boolean
  mentions: string[]
  defines: string[]
  requires: string[]
}

/**
 * Spanish definition cues, applied *directionally* around the term.
 *
 * An earlier version searched a 140-character window on both sides, which
 * called "clonan tu repositorio ... y no es un examen" a definition of
 * "repositorio". A cue only defines a term when it is attached to it:
 * either "TERM es un ..." just after, or "llamamos ... TERM" just before,
 * and never under a negation.
 */
const POST_CUE =
  /^[^.!?;]{0,45}?(?:es un|es una|son unos|son unas|significa|consiste en|se refiere a|sirve para|quiere decir|no es mas que|no es m\u00e1s que|se define como|es el|es la|son los|son las|es aquel|es aquella)/i
const PRE_CUE =
  /(?:llamamos|definimos|se conoce como|entendemos por|el termino|el t\u00e9rmino|la palabra|conocido como|conocida como)[^.!?;]{0,45}$/i
/** "no es un examen" is not a definition. */
const NEGATED = /\b(?:no|nunca|jam\u00e1s|tampoco)\s+(?:es|son|significa)/i
/** A callout or dictionary entry that names the term is a definition by construction. */
const DICT_KIND = /^(theory\.callout|theory\.paragraph)$/

/**
 * This course glosses terms in parentheses as often as it uses a copula:
 *   **Git** (el sistema que conserva el historial de cambios) registra ...
 * Treat a substantive parenthetical immediately after the term as a definition,
 * but not a bare acronym expansion or a cross-reference like "(ver S03)".
 */
const PAREN_GLOSS = /^[`*_"'\u00bb\s]{0,4}(?:[\p{L}\s`]{0,18})?\(([^)]{18,})\)/u
/**
 * Spanish sets an appositive definition off with em dashes as readily as parentheses:
 *   dependencias -componentes de codigo que el proyecto necesita-, los numeros salen...
 */
const DASH_GLOSS = /^[`*_"'\s]{0,4}[\u2014\u2013]([^\u2014\u2013]{18,})[\u2014\u2013]/u
const PAREN_NOT_DEF = /^(?:ver|v\u00e9ase|cap\u00edtulo|secci\u00f3n|S\d|p\.?\s*\d|\d)/i

function definesTerm(text: string, at: number, len: number, kind: string): boolean {
  const after = text.slice(at + len, at + len + 120)
  const paren = PAREN_GLOSS.exec(after)
  if (paren && !PAREN_NOT_DEF.test(paren[1].trim())) return true
  const dash = DASH_GLOSS.exec(after)
  if (dash && !PAREN_NOT_DEF.test(dash[1].trim())) return true
  const before = text.slice(Math.max(0, at - 80), at)
  const head = after.slice(0, 50)
  // "... que es un ..." attaches the cue to a relative clause, not to the term
  if (POST_CUE.test(after) && !NEGATED.test(head) && !/\bque\s+(?:es|son)\b/i.test(head)) return true
  if (PRE_CUE.test(before)) return true
  // "Diccionario del dia" blocks teach every term they list
  if (DICT_KIND.test(kind) && /Diccionario del d[i\u00ed]a/i.test(text)) return true
  return false
}

/** Events whose job is to make the learner act — using a term here presumes it is known. */
const REQUIRING = new Set([
  'wedo.instruction', 'wedo.hint', 'youdo.requirement', 'youdo.objective',
  'selfcheck.question', 'wedo.tests', 'youdo.rubric',
])

const terms = GLOSSARY_TERMS.map((t) => {
  const raw = [t.term, ...(t.aliases ?? [])].filter(Boolean)
  // longest first so "list comprehension" wins over "list"
  const alts = [...new Set(raw)]
    .sort((a, b) => b.length - a.length)
    .map((a) => a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  return {
    id: t.id,
    firstSectionId: t.firstSectionId,
    // \b is wrong for accented Spanish; use lookarounds on letter chars instead
    re: new RegExp(`(?<![\\p{L}\\d_])(?:${alts.join('|')})(?![\\p{L}\\d_])`, 'iu'),
  }
})

const events: Ev[] = []

function push(
  section_id: string,
  kind: string,
  location: string,
  text: unknown,
  opts: { visible?: boolean } = {},
) {
  if (typeof text !== 'string') return
  const t = text.trim()
  if (!t) return
  const visible = opts.visible !== false
  const mentions: string[] = []
  const defines: string[] = []
  const requires: string[] = []

  for (const term of terms) {
    const m = term.re.exec(t)
    if (!m) continue
    mentions.push(term.id)
    if (definesTerm(t, m.index, m[0].length, kind)) defines.push(term.id)
    if (REQUIRING.has(kind)) requires.push(term.id)
  }

  events.push({
    section_id,
    display_order: events.length,
    kind,
    location,
    text: t.length > 400 ? t.slice(0, 400) + '…' : t,
    learner_visible: visible,
    mentions,
    defines,
    requires,
  })
}

for (const s of COURSE_SECTIONS) {
  const sid = s.id
  push(sid, 'tagline', `${sid}.tagline`, s.tagline)
  push(sid, 'jobRelevance', `${sid}.jobRelevance`, s.jobRelevance)
  s.learningOutcomes.forEach((o, i) => push(sid, 'outcome', `${sid}.outcome[${i}]`, o.text))

  s.theory.forEach((b, i) => {
    const at = b.subtopicId ?? `theory[${i}]`
    push(sid, 'theory.heading', `${sid}.${at}.heading`, b.heading)
    b.paragraphs.forEach((p, j) => push(sid, 'theory.paragraph', `${sid}.${at}.p${j}`, p))
    if (b.code) {
      push(sid, 'theory.code', `${sid}.${at}.code`, b.code.code)
      push(sid, 'theory.code.explanation', `${sid}.${at}.code.explanation`, b.code.explanation)
    }
    if (b.callout) {
      push(sid, 'theory.callout', `${sid}.${at}.callout`, `${b.callout.title}. ${b.callout.content}`)
    }
    if (b.figure) {
      push(sid, 'theory.figure', `${sid}.${at}.figure`, `${b.figure.caption} ${b.figure.alt}`)
    }
  })

  push(sid, 'ido.intro', `${sid}.iDo.intro`, s.iDo.intro)
  s.iDo.steps.forEach((st, i) => {
    const at = st.demoId ?? `iDo[${i}]`
    push(sid, 'ido.preamble', `${sid}.${at}.preamble`, st.preamble)
    push(sid, 'ido.description', `${sid}.${at}.description`, st.description)
    push(sid, 'ido.code', `${sid}.${at}.code`, st.code?.code)
    push(sid, 'ido.why', `${sid}.${at}.why`, st.why)
    push(sid, 'ido.retrospective', `${sid}.${at}.retrospective`, st.retrospective)
  })

  push(sid, 'wedo.intro', `${sid}.weDo.intro`, s.weDo.intro)
  s.weDo.steps.forEach((st, i) => {
    const at = st.id ?? `weDo[${i}]`
    push(sid, 'wedo.title', `${sid}.${at}.title`, st.title)
    push(sid, 'wedo.preamble', `${sid}.${at}.preamble`, st.preamble)
    push(sid, 'wedo.instruction', `${sid}.${at}.instruction`, st.instruction)
    push(sid, 'wedo.hint', `${sid}.${at}.hint`, st.hint)
    ;(st.hints ?? []).forEach((h, j) => push(sid, 'wedo.hint', `${sid}.${at}.hint[${j}]`, h))
    push(sid, 'wedo.starter', `${sid}.${at}.starter`, st.starterCode?.code)
    push(sid, 'wedo.tests', `${sid}.${at}.tests`, st.tests)
    // hidden: an answer the learner sees only after trying cannot teach a term
    push(sid, 'solution', `${sid}.${at}.solution`, st.solutionCode?.code, { visible: false })
    push(sid, 'wedo.retrospective', `${sid}.${at}.retrospective`, st.retrospective)
  })

  push(sid, 'youdo.context', `${sid}.youDo.context`, s.youDo.context)
  s.youDo.objectives.forEach((o, i) => push(sid, 'youdo.objective', `${sid}.youDo.objective[${i}]`, o))
  s.youDo.requirements.forEach((r, i) => push(sid, 'youdo.requirement', `${sid}.youDo.requirement[${i}]`, r))
  s.youDo.rubric.forEach((r, i) => push(sid, 'youdo.rubric', `${sid}.youDo.rubric[${i}]`, r.criterion))
  push(sid, 'youdo.starter', `${sid}.youDo.starter`, s.youDo.starterCode)

  s.selfCheck.questions.forEach((q, i) => {
    push(sid, 'selfcheck.question', `${sid}.selfCheck[${i}].q`, q.question)
    q.options.forEach((o, j) => push(sid, 'selfcheck.option', `${sid}.selfCheck[${i}].opt[${j}]`, o))
    push(sid, 'selfcheck.explanation', `${sid}.selfCheck[${i}].explanation`, q.explanation)
  })

  s.resources.docs.forEach((d, i) => push(sid, 'resource', `${sid}.resources.doc[${i}]`, `${d.label} ${d.note ?? ''}`))
}

const payload = {
  active_section_ids: COURSE_SECTIONS.map((s) => s.id),
  terms: GLOSSARY_TERMS.map((t) => ({ id: t.id, firstSectionId: t.firstSectionId })),
  events,
}
process.stdout.write(JSON.stringify(payload))
