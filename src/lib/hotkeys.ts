/**
 * Ctrl/⌘ + Alt + letter shortcuts that work on every keyboard layout and platform (owner request,
 * 5 Oct 2026). The first version compared `event.key` with the letter, which fails where Alt
 * changes the character:
 * - macOS: Option + Q types "œ" (Option + S: "ß"), so Ctrl/⌘ + Option + Q never matched;
 * - Windows and Linux: Ctrl + Alt is AltGr, and layouts with an AltGr character on the key
 *   (German AltGr + Q = "@") report that character.
 *
 * The rule, by what the browser reports:
 * 1. Ctrl or ⌘, plus Alt, must be held; key repeat and IME composition never trigger.
 * 2. The typed letter itself (any layout where Q is Q, including AZERTY's labelled Q) matches.
 * 3. Otherwise the physical key (`code`, KeyQ) decides:
 *    - on Apple platforms it matches: Option only changes the symbol, and no one types with
 *      Ctrl/⌘ + Option held;
 *    - elsewhere it matches only when the key produced no character (Dead, Unidentified). If it
 *      produced one ("@", "ś"), the person is typing with AltGr, and taking that keystroke would
 *      eat their character, so it does not match. Those layouts keep the footer button.
 */

export interface ShortcutEvent {
  key: string
  code: string
  ctrlKey: boolean
  metaKey: boolean
  altKey: boolean
  repeat?: boolean
  isComposing?: boolean
}

export type ShortcutLetter = 'q' | 's'

/** Whether the event is Ctrl/⌘ + Alt + `letter` (see the rule above). */
export function matchShortcut(event: ShortcutEvent, letter: ShortcutLetter, apple: boolean): boolean {
  if (!(event.ctrlKey || event.metaKey) || !event.altKey || event.repeat || event.isComposing) return false
  const key = typeof event.key === 'string' ? event.key : ''
  if (key.toLowerCase() === letter) return true
  if (event.code !== `Key${letter.toUpperCase()}`) return false
  return apple || [...key].length !== 1
}

/** Apple platforms (macOS, iPadOS with a keyboard): the ⌘ / Option naming and rule 3. */
export function isApplePlatform(nav: { platform?: string; userAgent?: string; userAgentData?: { platform?: string } } | undefined): boolean {
  if (!nav) return false
  const platform = nav.userAgentData?.platform || nav.platform || ''
  return /mac|iphone|ipad|ipod/i.test(platform) || (!platform && /Mac OS X|iPhone|iPad/.test(nav.userAgent ?? ''))
}

/** The shortcut as people read it on their platform: "⌘ + Option + Q" or "Ctrl + Alt + Q". */
export function shortcutLabel(letter: ShortcutLetter, apple: boolean): string {
  return apple ? `⌘ + Option + ${letter.toUpperCase()}` : `Ctrl + Alt + ${letter.toUpperCase()}`
}

/** The browser's navigator, typed for isApplePlatform (undefined during prerender). */
export function currentNavigator(): Parameters<typeof isApplePlatform>[0] {
  return typeof navigator === 'undefined' ? undefined : (navigator as Parameters<typeof isApplePlatform>[0])
}
