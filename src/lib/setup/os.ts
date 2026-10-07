/**
 * Which computer the learner is reading Sesión 0 on, so the page can show one track.
 *
 * The page shows one operating system at a time (DESIGN.md §3): three tracks mixed on one
 * screen is the "mapping table" S01 already has, and the learner who barely knows their
 * computer is the one who cannot pick their own row out of it. So the page guesses, says
 * what it guessed, and keeps a visible switch, because a guess from the browser can be wrong
 * (a Windows learner on a borrowed Mac, a Linux learner whose browser hides its platform).
 *
 * Pure: every input is passed in, so the tests drive it with real user-agent strings.
 */

export type SetupOs = 'windows' | 'macos' | 'linux'

export const SETUP_OS: readonly SetupOs[] = ['windows', 'macos', 'linux']

/** What the browser told us. Every field is optional: older browsers expose less. */
export interface OsSignals {
  /** navigator.userAgentData?.platform (Chromium only): "Windows", "macOS", "Linux", "Android", "Chrome OS". */
  uaPlatform?: string | null
  /** navigator.platform (deprecated, still everywhere): "Win32", "MacIntel", "Linux x86_64". */
  platform?: string | null
  userAgent?: string | null
  /** navigator.maxTouchPoints: an iPad asking for the desktop site reports "MacIntel" and > 1. */
  maxTouchPoints?: number | null
}

export interface OsGuess {
  /** The track to show first. */
  os: SetupOs
  /** False when nothing identified the system and `os` is the fallback. */
  detected: boolean
  /** A phone or tablet: nothing in Sesión 0 can be installed from it. */
  mobile: boolean
}

/**
 * The track shown when nothing identifies the system: Windows, because it is what most of
 * PyArcana's learners use (RESEARCH.md §5, desktop share in Peru), and the page says it guessed.
 */
export const FALLBACK_OS: SetupOs = 'windows'

const MOBILE = /android|iphone|ipad|ipod|mobile/i

function fromName(name: string): SetupOs | null {
  const n = name.toLowerCase()
  if (n.startsWith('win')) return 'windows'
  if (n.startsWith('mac') || n.includes('os x')) return 'macos'
  // Chrome OS runs Linux apps in its own Linux environment; the Linux track is the closest.
  if (n.includes('linux') || n.includes('cros') || n.includes('chrome os') || n.includes('x11')) return 'linux'
  return null
}

function isMobile(s: OsSignals): boolean {
  const names = [s.uaPlatform, s.userAgent].filter(Boolean).join(' ')
  if (MOBILE.test(names)) return true
  // iPadOS 13+ asks for the desktop site and reports itself as a Mac with a touch screen.
  return /^mac/i.test(s.platform ?? '') && (s.maxTouchPoints ?? 0) > 1
}

function fromUserAgent(ua: string): SetupOs | null {
  if (/windows/i.test(ua)) return 'windows'
  if (/macintosh|mac os x/i.test(ua)) return 'macos'
  if (/cros|linux|x11/i.test(ua)) return 'linux'
  return null
}

/** Guess the learner's system. The most specific signal wins; Android is never "Linux". */
export function detectOs(s: OsSignals): OsGuess {
  const mobile = isMobile(s)
  const os = mobile
    ? null
    : fromName(s.uaPlatform ?? '') ?? fromName(s.platform ?? '') ?? fromUserAgent(s.userAgent ?? '')
  return { os: os ?? FALLBACK_OS, detected: os !== null, mobile }
}

export function isSetupOs(value: unknown): value is SetupOs {
  return typeof value === 'string' && (SETUP_OS as readonly string[]).includes(value)
}

/** Read the signals from a live browser. Separate from detectOs so that stays pure. */
export function browserOsSignals(): OsSignals {
  if (typeof navigator === 'undefined') return {}
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } }
  return {
    uaPlatform: nav.userAgentData?.platform ?? null,
    platform: nav.platform ?? null,
    userAgent: nav.userAgent ?? null,
    maxTouchPoints: nav.maxTouchPoints ?? null,
  }
}
