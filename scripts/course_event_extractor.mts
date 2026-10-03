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
import { blankProperNames, syntaxMentions } from './concept_syntax.mts'
import { definesTerm, termPatterns } from './concept_detector.mts'

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

/** Events whose job is to make the learner act — using a term here presumes it is known. */
const REQUIRING = new Set([
  'wedo.instruction', 'wedo.hint', 'youdo.requirement', 'youdo.objective',
  'selfcheck.question', 'wedo.tests', 'youdo.rubric',
])

const terms = GLOSSARY_TERMS.map((t) => {
  const raw = [t.term, ...(t.aliases ?? [])].filter(Boolean)
  return {
    id: t.id,
    firstSectionId: t.firstSectionId,
    aliases: raw,
    ...termPatterns(raw),
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

  // Matched on a copy with proper names blanked; definesTerm() still reads the original `t`,
  // and blanking keeps every offset valid. See scripts/concept_syntax.mts.
  const scan = blankProperNames(t)
  for (const term of terms) {
    // Every occurrence, not just the first: a text often names a term and defines it a clause
    // later - "añade Python y Ruff; Ruff es un programa que señala errores". Testing only the
    // first hit missed that entirely, because the `;` blocks the definition cue, and `ruff`
    // scored "never explained" across 39 uses while its definition sat in the same sentence.
    const hits = [
      ...(term.re ? scan.matchAll(term.re) : []),
      ...(term.reExact ? scan.matchAll(term.reExact) : []),
    ]
    if (hits.length === 0) continue
    mentions.push(term.id)
    if (hits.some((m) => definesTerm(t, m.index!, m[0].length, kind, term.aliases))) defines.push(term.id)
    if (REQUIRING.has(kind)) requires.push(term.id)
  }
  // A use through syntax is a use; it never counts as a definition.
  for (const id of syntaxMentions(t)) {
    if (mentions.includes(id) || !terms.some((x) => x.id === id)) continue
    mentions.push(id)
    if (REQUIRING.has(kind)) requires.push(id)
  }

  events.push({
    section_id,
    display_order: events.length,
    kind,
    location,
    // Not truncated. It used to be `t.slice(0, 400) + '…'`, which cut 2,928 of 22,782 events
    // mid-word - 660 of them theory paragraphs, in all 52 sections. definesTerm() reads the
    // full `t` above, so the concept map never saw it; prose_quality_audit.py reads this
    // field, so every prose measure in the course was computed on cut text. Worse, a cut
    // event ends in an ellipsis rather than a full stop, so it glued to the next event and
    // manufactured run-on sentences that nobody wrote: S34 measured 11 and has 5. That is a
    // gated measure, and it restored a round whose only fault was writing a paragraph longer
    // than 400 characters. The cache grows 8.4 MB -> 9.2 MB, and it is gitignored.
    text: t,
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

  // A location has to name exactly one paragraph. Several sections give two or three
  // supporting blocks the same subtopicId - which D6 allows, since depth goes in unnumbered
  // blocks - and keying on it alone produced 43 collisions: `S15-T4-B.p2` addressed two
  // different paragraphs, so a reader (or an applier) could act on the wrong one. Repeats
  // carry the block index; the first block of each id keeps the plain name.
  const seenSubtopic = new Map<string, number>()
  s.theory.forEach((b, i) => {
    let at = b.subtopicId ?? `theory[${i}]`
    const nth = (seenSubtopic.get(at) ?? 0) + 1
    seenSubtopic.set(at, nth)
    if (nth > 1) at = `${at}#${i}`
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
  // Names as well as ids: apply_patches.py needs them to tell a patch that rewords a held
  // definition (the term survives) from one that deletes it (no name of it survives).
  terms: GLOSSARY_TERMS.map((t) => ({
    id: t.id, firstSectionId: t.firstSectionId, names: [t.term, ...(t.aliases ?? [])],
  })),
  events,
}
process.stdout.write(JSON.stringify(payload))
