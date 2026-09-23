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
import { GLOSSARY_TERMS, aliasIsAcronym } from '../src/lib/glossary/terms'

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
// The cue needs a letter boundary in front of it. Without one, "es el"/"es la" match inside
// "tien-es el", "corromp-es el", "pierd-es la": 18 credited definitions at HEAD, every one of
// them a cue glued to the end of the preceding verb.
const POST_CUE =
  /^[^.!?;]{0,45}?(?<!\p{L})(?:es un|es una|son unos|son unas|significa|consiste en|se refiere a|sirve para|quiere decir|no es mas que|no es m\u00e1s que|se define como|es el|es la|son los|son las|es aquel|es aquella|son (?:dos|tres|cuatro|cinco|seis|\d+)\s+\p{L}{3,})/iu
// A pair is defined in the plural with a quantifier, not with "un/una": "Las **cercas de Tukey**
// son dos l\u00edmites calculados a partir de los cuartiles". The numeral has to be followed by a noun,
// so "las opciones son dos" - a count, not a definition - stays out.
// "se llama" is the plainest way Spanish names a thing, and it was missing: S02 teaches
// unpacking with "Esta acci\u00f3n se llama **desempaquetar una tupla**" and scored never-explained.
const PRE_CUE =
  /(?:llamamos|definimos|se conoce como|se (?:le |les )?llama|se (?:le |les )?llaman|se denomina|se denominan|entendemos por|el termino|el t\u00e9rmino|la palabra|conocido como|conocida como)[^.!?;]{0,45}$/i
/**
 * "\u2026bloques de filas llamados **row groups**" names the thing it has just described.
 *
 * It has to sit directly against the term: given a 45-character window like PRE_CUE's, the
 * ordinary noun "llamada" ("cada llamada a `run`", "una sola llamada deja media funci\u00f3n sin
 * contrato") credits every `return` and `function` near it.
 */
const NAMING_PARTICIPLE = /\bllamad[oa]s?\s+(?:\*\*|`|_|\u00ab|")$/i
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
const PAREN_GLOSS = /^[`*_"'\u00bb\s]{0,4}(?:[\p{L}\s`]{0,18})?\(([^)]{10,})\)/u
/**
 * Spanish sets an appositive definition off with em dashes as readily as parentheses:
 *   dependencias -componentes de codigo que el proyecto necesita-, los numeros salen...
 */
const DASH_GLOSS = /^[`*_"'\s]{0,4}[\u2014\u2013]([^\u2014\u2013]{18,})[\u2014\u2013]/u
const PAREN_NOT_DEF = /^(?:ver|v\u00e9ase|cap\u00edtulo|secci\u00f3n|S\d|p\.?\s*\d|\d)/i

/**
 * A gloss is prose; an argument list is not.
 *
 * PAREN_GLOSS counted `(valor, tipo_esperado)` in a weDo hint as the definition of `tuple`,
 * which is how the theory paragraph that actually teaches tuples ended up filed as a
 * *surprising use* of a term the course had supposedly defined in a hint. Spanish prose that
 * explains something always contains function words; a tuple literal or a signature does not.
 */
// "qué" is here because the course writes short glosses on it — "(qué no subir a Git)" has no
// other function word and was read as code. Bare "a" and "no" are deliberately absent: "a"
// turns argument lists into prose ("(neighbors(txs, a) & neighbors(txs, c))" was read as a
// gloss of `return`), and "no" starts accepting negative asides as definitions.
const GLOSS_FUNCTION_WORD =
  /(?:^|\s)(?:el|la|los|las|un|una|unos|unas|de|del|que|qué|para|con|por|se|su|sus|lo|al|y|o|en)(?:\s|$)/i
function looksLikeProse(inner: string): boolean {
  if (/[_=\[\]{}]|->|::/.test(inner)) return false          // snake_case, subscripts, signatures
  return GLOSS_FUNCTION_WORD.test(inner)
}

/**
 * Spanish teaches far more often with a descriptive verb than with a copula:
 *   "Una **tupla** re\u00fane varios valores en un orden fijo."
 * POST_CUE only knows "es un/es una", so every definition written this way was invisible and
 * the concept scored L0 or was credited to whatever hint happened to mention it first. The
 * indefinite article is what generalises ("a tuple gathers\u2026", not "the tuple we just made"),
 * so require it before the term and a describing verb just after.
 */
const INDEFINITE_BEFORE = /\b(?:un|una|unos|unas)\s+(?:\*\*|`|_)?$/i

/**
 * A keyword never takes an article, so the article test above can never credit one.
 *
 * "`return` entrega el valor…", "**pip** instala…", "El **broadcasting** alinea shapes…" are
 * the course's ordinary way of introducing a term: the typographic mark is the introduction.
 * The definition-extraction literature for Spanish treats a typographical marker as a signal
 * that a definitional context is near, not as the definition itself (Sierra et al.), so the
 * mark alone is not enough — a describing verb still has to follow. Requiring the sentence to
 * start there is what keeps "y `git remote -v` permite…" mid-sentence out.
 */
const FORMATTED_SUBJECT = /(?:^|[.;:!?]\s+)(?:[EeLl][laos]{1,2}\s+)?(\*\*|`|_)$/u
/**
 * The mark has to close right after the term, so the formatted span is the term and nothing
 * else. Without this, "`git restore archivo` descarta cambios" and "`git remote -v` permite
 * comprobarla" read as definitions of `git`: the subject is a command line, not the term.
 */
function isMarkedSubject(before: string, after: string): boolean {
  const m = FORMATTED_SUBJECT.exec(before)
  return !!m && after.startsWith(m[1])
}

/**
 * Spanish defines by apposition as readily as by copula:
 *   "`Counter`, un contador de elementos de una secuencia, cuenta…"
 *   "Ruff, una herramienta que señala errores, se ejecuta…"
 * The head noun has to be followed by something that describes it (que/de/para), which is what
 * separates a definition from an ordinary aside like "El registro, una vez completo, se envía".
 */
// The closing paren is allowed because an abbreviation often sits between the term and its
// apposition: "Visual Studio Code (VS Code), una aplicación para escribir y revisar archivos".
const APPOSITIVE = /^[`*_'")]{0,3},\s+(?:un|una|unos|unas)\s+[^,.;]{4,70}?\s+(?:que|de|del|para|con)\b/i
/**
 * The same shape with the definite article — "GitHub, **el sitio web** que aloja…" — is the
 * course's commonest gloss, but "El registro, la parte que ya viste, se envía" has it too.
 * The formatting mark is what separates them: it is only accepted when the term itself was
 * written as a term. Without that guard this rule credits ordinary enumerations.
 */
// The head noun has to sit next to the term: "`pip`, el instalador de paquetes" keeps its
// connector 14 characters in, while "`if`, el print posterior usa la última `i` del `for`" —
// an ordinary sentence — only reaches one 35 characters later.
const APPOSITIVE_DEFINITE =
  /^(?:\*\*|`|_)['")]{0,2},\s+(?:el|la|los|las)\s+[^,.;]{4,24}?\s+(?:que|de|del|para|con)\b/i

/** A contrast can define: "X se diferencia de Y en que hace Z". */
const CONTRAST_CUE = /^[^.!?;]{0,45}?(?:se diferencia de|se distingue de|a diferencia de)/i
const DESCRIBING_VERB =
  /^[^.!?;]{0,12}?\b(?:re[u\u00fa]ne|agrupa|agrupan|guarda|guardan|contiene|contienen|almacena|almacenan|representa|representan|describe|describen|indica|indican|se\u00f1ala|se\u00f1alan|permite|permiten|sirve|sirven|convierte|convierten|devuelve|devuelven|entrega|entregan|ejecuta|ejecutan|asocia|asocian|re[u\u00fa]nen|junta|juntan|marca|marcan|define|definen|expresa|expresan|re[gj]istra|re[gj]istran|combina|combinan|ordena|ordenan|recorre|recorren|reparte|reparten)\b/i
/**
 * Verbs that only describe when the term is written as a term.
 *
 * "**Precision** responde: de lo que mandas a cola, \u00bfcu\u00e1nto era positivo?" introduces a term;
 * "ver un n\u00famero dentro de una funci\u00f3n no responde esa pregunta" does not, and the same verb
 * carries both. Keeping these off the bare-article path is what separates them \u2014 with the
 * marked-subject requirement they fire on an introduction, not on an ordinary sentence.
 *
 * The list is a whitelist, so a missing verb hides a real definition rather than inventing
 * one. `divide` hid S33's: "La **validaci\u00f3n cruzada** (CV) divide los datos en `k` partes;
 * cada parte se llama **fold**" is how the course teaches cross-validation, and with the verb
 * missing the term scored never-explained across all 52 sections and its four uses were filed
 * as surprises.
 *
 * Adding a verb is cheap and reverting one is not, so it is done on measured effect, never on
 * plausibility. A 2026-09-22 scan of every marked-term sentence in the course offered
 * `crea`, `declara`, `devuelve`, `exige` and `toma` as well. Re-running the extractor with all
 * six changed exactly two events: this one, and a self-check explanation that would have been
 * credited with `venv` \u2014 the non-teaching-surface credit this detector has been burned by
 * before. The other four moved nothing at all (`devuelve` is already on DESCRIBING_VERB). So
 * only `divide` stayed. The others are attested in the prose and can be added the day a real
 * sentence needs one, with the case that proves it.
 */
const MARKED_SUBJECT_VERB =
  /^[^.!?;]{0,14}?\b(?:mide|miden|aloja|alojan|excluye|excluyen|instala|instalan|alinea|alinean|produce|producen|colapsa|colapsan|hace|hacen|responde|responden|captura|capturan|resume|resumen|descubre|descubren|memoriza|memorizan|fija|fijan|apila|apilan|inserta|insertan|act[u\u00fa]a|act[u\u00fa]an|reutiliza|reutilizan|divide|dividen)\b/i
/**
 * A phenomenon is defined by the conditions it arises under, not by what it is made of.
 *
 * "**Overfit** ocurre cuando un modelo aprende demasiado bien los datos usados para
 * ajustarlo y luego pierde aciertos con datos que mantuviste aparte" is the standard Spanish
 * frame for this, and it is the sentence S33 now teaches overfit with. Nothing above matched
 * it: it has no copula, and `ocurrir` describes no property of the thing.
 *
 * `cuando` is required, and is the whole guard. A bare `ocurre` credits "el **error** ocurre
 * en la linea 3", which locates a thing rather than defining it. `sucede cuando` is the same
 * frame and is deliberately absent: the course does not currently write it, and a rule with
 * no case to prove it is how this detector acquired its absurd credits.
 */
const PHENOMENON_CUE = /^[^.!?;]{0,14}?\bocurre[n]? cuando\b/i
/** "una tupla **no** hace que el lote contin\u00fae" describes what the thing is not. */
const NEGATED_VERB = /^[^.!?;]{0,12}?\b(?:no|nunca|jam[a\u00e1]s|tampoco)\s/i

/** "`venv` (entorno virtual)" names the term in Spanish; it does not say what one is. */
function isAliasExpansion(inner: string, aliases: string[]): boolean {
  const bare = inner.trim().toLowerCase()
    .replace(/^[`*_"'«\s]+|[`*_"'»\s.]+$/g, '')
    .replace(/^(?:el|la|los|las|un|una|unos|unas)\s+/, '')
  return aliases.some((a) => a.toLowerCase() === bare)
}
/** "no uses un `set` (una colección sin orden)" is an instruction, not a definition. */
const NEGATED_IMPERATIVE = /\b(?:no|nunca|jamás|tampoco)\s+\p{L}+\s*$/iu

function definesTerm(
  text: string, at: number, len: number, kind: string, aliases: string[] = [],
): boolean {
  const after = text.slice(at + len, at + len + 120)
  const before = text.slice(Math.max(0, at - 80), at)
  const head = after.slice(0, 50)
  const paren = PAREN_GLOSS.exec(after)
  if (paren && !PAREN_NOT_DEF.test(paren[1].trim()) && looksLikeProse(paren[1])
    && !isAliasExpansion(paren[1], aliases)
    && !NEGATED_IMPERATIVE.test(text.slice(Math.max(0, at - 60), at))) return true
  const dash = DASH_GLOSS.exec(after)
  if (dash && !PAREN_NOT_DEF.test(dash[1].trim()) && looksLikeProse(dash[1])) return true
  // "... que es un ..." attaches the cue to a relative clause, not to the term
  if (POST_CUE.test(after) && !NEGATED.test(head) && !/\bque\s+(?:es|son)\b/i.test(head)) return true
  if (PRE_CUE.test(before) || NAMING_PARTICIPLE.test(before)) return true
  // "Una tupla reúne varios valores…" — a definition without a copula.
  // "`return` entrega…", "El **broadcasting** alinea…" — the same, with a keyword or a term
  // the course marks typographically, which no article can precede.
  const marked = isMarkedSubject(before, after)
  if ((INDEFINITE_BEFORE.test(before) || marked)
    && DESCRIBING_VERB.test(after) && !NEGATED.test(head) && !NEGATED_VERB.test(after)) return true
  if (marked && MARKED_SUBJECT_VERB.test(after) && !NEGATED.test(head) && !NEGATED_VERB.test(after)) return true
  // "**Overfit** ocurre cuando un modelo aprende demasiado bien los datos…"
  if (marked && PHENOMENON_CUE.test(after) && !NEGATED.test(head) && !NEGATED_VERB.test(after)) return true
  // "`Counter`, un contador de elementos de una secuencia…"
  if (APPOSITIVE.test(after) && !NEGATED.test(head)) return true
  // "**GitHub**, el sitio web que aloja repositorios…"
  if (APPOSITIVE_DEFINITE.test(after) && !NEGATED.test(head)) return true
  // "`defaultdict` se diferencia de un `dict` común en que crea un valor predeterminado…"
  if (CONTRAST_CUE.test(after) && !NEGATED.test(head)) return true
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
    aliases: raw,
    // \b is wrong for accented Spanish; use lookarounds on letter chars instead.
    // `.py` is excluded too: S10 teaches packaging and writes `__init__.py` constantly, which
    // is a package marker file, not the `__init__` dunder method. That alone accounted for 40
    // of dunder-method's 50 "mentions" and scored it never-explained.
    // An acronym matches exactly (aliasIsAcronym); everything else ignores case. Two regexes
    // rather than one, because a flag is per-pattern: `ABC` must not match `int("abc")` while
    // `tupla` still matches `Tupla` at the start of a sentence.
    re: alts.filter((a) => !aliasIsAcronym(a)).length
      ? new RegExp(
        `(?<![\\p{L}\\d_])(?:${alts.filter((a) => !aliasIsAcronym(a)).join('|')})(?![\\p{L}\\d_]|\\.py)`,
        'giu')
      : null,
    reExact: alts.filter((a) => aliasIsAcronym(a)).length
      ? new RegExp(
        `(?<![\\p{L}\\d_])(?:${alts.filter((a) => aliasIsAcronym(a)).join('|')})(?![\\p{L}\\d_]|\\.py)`,
        'gu')
      : null,
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
    // Every occurrence, not just the first: a text often names a term and defines it a clause
    // later - "añade Python y Ruff; Ruff es un programa que señala errores". Testing only the
    // first hit missed that entirely, because the `;` blocks the definition cue, and `ruff`
    // scored "never explained" across 39 uses while its definition sat in the same sentence.
    const hits = [
      ...(term.re ? t.matchAll(term.re) : []),
      ...(term.reExact ? t.matchAll(term.reExact) : []),
    ]
    if (hits.length === 0) continue
    mentions.push(term.id)
    if (hits.some((m) => definesTerm(t, m.index!, m[0].length, kind, term.aliases))) defines.push(term.id)
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
  terms: GLOSSARY_TERMS.map((t) => ({ id: t.id, firstSectionId: t.firstSectionId })),
  events,
}
process.stdout.write(JSON.stringify(payload))
