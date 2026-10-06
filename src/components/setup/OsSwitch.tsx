'use client'

import { useI18n, t } from '@/lib/i18n'
import { SETUP_OS, type SetupOs } from '@/lib/setup/os'

/**
 * The visible switch between the three tracks.
 *
 * Native radio buttons in a fieldset: arrow keys, focus, the group's name and the checked state
 * all come from the browser, which no custom segmented control gets right as cheaply. Styled as
 * a segmented control; the input stays in the accessibility tree (sr-only, not display:none).
 */
export function OsSwitch({
  value,
  origin,
  onChange,
}: {
  value: SetupOs
  /** Why this track is showing: the learner chose it, the browser told us, or nothing did. */
  origin: 'chosen' | 'detected' | 'fallback'
  onChange: (os: SetupOs) => void
}) {
  const lang = useI18n((s) => s.lang)
  const tr = (key: string) => t(key, lang)
  return (
    <fieldset className="mt-6" data-testid="setup-os-switch">
      <legend className="text-sm font-semibold">{tr('setup.os.legend')}</legend>
      <div className="mt-2 inline-flex flex-wrap gap-1 rounded-lg border border-border bg-muted/40 p-1">
        {SETUP_OS.map((os) => (
          <label
            key={os}
            className={`relative min-h-11 cursor-pointer rounded-md px-4 py-2 text-sm font-medium has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring ${
              value === os ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <input
              type="radio"
              name="setup-os"
              value={os}
              checked={value === os}
              onChange={() => onChange(os)}
              className="sr-only"
              data-testid={`setup-os-${os}`}
            />
            {tr(`setup.os.${os}`)}
          </label>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted-foreground" data-testid="setup-os-origin">
        {tr(`setup.os.origin.${origin}`)}
      </p>
    </fieldset>
  )
}
