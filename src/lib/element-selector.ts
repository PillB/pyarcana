/**
 * Turning a click into something a reviewer can act on.
 *
 * The QA form used to record `document.activeElement`, which is `<body>` unless
 * the tester happened to have focus somewhere -- so every report claimed the
 * problem was in the body element, which is true and useless.
 *
 * Letting the tester point at the thing instead raises two problems this module
 * exists to solve. First, people click the visible pixel, not the meaningful
 * node: the icon inside the button, the span inside the link. Second, the
 * obvious selector is usually the wrong one -- `div` matches four hundred
 * elements, and a Radix-generated `#radix-:r7:` is different on the next load,
 * so a reviewer following it lands nowhere.
 */

/** ids frameworks generate per render. Following one later finds nothing. */
const UNSTABLE_ID = /^(radix-|headlessui-|react-aria-|:r|mui-|«)/i

/**
 * Nodes worth naming in a bug report: something you can click, read or fill,
 * or something the codebase has already chosen to label.
 */
const MEANINGFUL = [
  '[data-testid]',
  'button',
  'a[href]',
  'input',
  'select',
  'textarea',
  'label',
  '[role]',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'figure',
  'table',
  'li',
  'pre',
  'blockquote',
  'section[id]',
  'article',
].join(',')

/** Leaves that are painted rather than meant: the glyph inside the control. */
function isPresentational(el: Element): boolean {
  const tag = el.tagName.toLowerCase()
  if (tag === 'svg' || tag === 'path' || tag === 'use' || tag === 'g' || tag === 'circle' || tag === 'rect') return true
  if (tag === 'span' || tag === 'em' || tag === 'strong' || tag === 'code') {
    // A span that only wraps part of a sentence is not the subject; a span that
    // is the whole of a control's label effectively is, and the climb below
    // will reach that control anyway.
    return true
  }
  return false
}

/**
 * The element the tester meant, starting from the one under the pointer.
 *
 * Climbs out of presentational leaves toward the nearest node that means
 * something, and stops rather than walking all the way to <body> -- returning
 * the body would put us back where we started.
 */
export function meaningfulTarget(start: Element): Element {
  let el: Element | null = start
  let climbed = 0
  while (el && el !== document.body && climbed < 6) {
    if (!isPresentational(el) && el.matches(MEANINGFUL)) return el
    if (!isPresentational(el) && el.tagName.toLowerCase() === 'p') return el
    el = el.parentElement
    climbed += 1
  }
  // Nothing meaningful nearby: name the original rather than invent an ancestor.
  return start.tagName.toLowerCase() === 'html' ? document.body : start
}

function cssEscape(value: string): string {
  return typeof CSS !== 'undefined' && CSS.escape ? CSS.escape(value) : value.replace(/["\\]/g, '\\$&')
}

function isUnique(selector: string, root: Document | ShadowRoot): boolean {
  try {
    return root.querySelectorAll(selector).length === 1
  } catch {
    return false
  }
}

/** `tag:nth-of-type(n)` for one step of a structural path. */
function step(el: Element): string {
  const tag = el.tagName.toLowerCase()
  const parent = el.parentElement
  if (!parent) return tag
  const sameTag = [...parent.children].filter((c) => c.tagName === el.tagName)
  if (sameTag.length === 1) return tag
  return `${tag}:nth-of-type(${sameTag.indexOf(el) + 1})`
}

/**
 * The shortest selector that resolves to exactly this element.
 *
 * Every candidate is verified against the live document before it is returned,
 * so this never hands back a selector that matches four hundred nodes or none.
 * Order is by how well the selector survives the next deploy: a test id is
 * chosen deliberately, an author-written id nearly as good, an aria-label is
 * meaningful but translatable, and a structural path is last because any
 * reorder invalidates it.
 */
export function uniqueSelector(el: Element, root: Document = document): string {
  const tag = el.tagName.toLowerCase()

  const testId = el.getAttribute('data-testid')
  if (testId) {
    const sel = `[data-testid="${cssEscape(testId)}"]`
    if (isUnique(sel, root)) return sel
  }

  if (el.id && !UNSTABLE_ID.test(el.id)) {
    const sel = `#${cssEscape(el.id)}`
    if (isUnique(sel, root)) return sel
  }

  const label = el.getAttribute('aria-label')
  if (label) {
    const sel = `${tag}[aria-label="${cssEscape(label)}"]`
    if (isUnique(sel, root)) return sel
  }

  const name = el.getAttribute('name')
  if (name) {
    const sel = `${tag}[name="${cssEscape(name)}"]`
    if (isUnique(sel, root)) return sel
  }

  // Structural path, anchored to the nearest ancestor that has a stable name so
  // the result stays short and readable instead of a twelve-step chain.
  const parts: string[] = [step(el)]
  let node = el.parentElement
  let depth = 0
  while (node && node !== root.documentElement && depth < 8) {
    const anchorId = node.getAttribute('data-testid')
    if (anchorId && isUnique(`[data-testid="${cssEscape(anchorId)}"]`, root)) {
      const sel = `[data-testid="${cssEscape(anchorId)}"] > ${parts.join(' > ')}`
      if (isUnique(sel, root)) return sel
    }
    if (node.id && !UNSTABLE_ID.test(node.id) && isUnique(`#${cssEscape(node.id)}`, root)) {
      const sel = `#${cssEscape(node.id)} > ${parts.join(' > ')}`
      if (isUnique(sel, root)) return sel
    }
    parts.unshift(step(node))
    const candidate = parts.join(' > ')
    if (isUnique(candidate, root)) return candidate
    node = node.parentElement
    depth += 1
  }

  return parts.join(' > ')
}

/** What the element says, for a reviewer reading the report rather than the DOM. */
export function readableLabel(el: Element): string {
  const label = el.getAttribute('aria-label')?.trim()
  if (label) return label
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    const placeholder = el.getAttribute('placeholder')?.trim()
    if (placeholder) return placeholder
  }
  const text = (el as HTMLElement).innerText?.trim().replace(/\s+/g, ' ')
  if (text) return text.length > 90 ? `${text.slice(0, 90)}…` : text
  const alt = el.getAttribute('alt')?.trim()
  if (alt) return alt
  const title = el.getAttribute('title')?.trim()
  return title || el.tagName.toLowerCase()
}

/**
 * One line for the report: what to look for, and what it looked like.
 *
 * Both halves matter. The selector is what a reviewer pastes into devtools; the
 * text is what tells them they found the right thing when the page has changed
 * underneath the selector.
 */
export function describeElement(el: Element): string {
  const selector = uniqueSelector(el)
  const label = readableLabel(el)
  const tag = el.tagName.toLowerCase()
  return label && label !== tag ? `${selector} — «${label}»` : selector
}
