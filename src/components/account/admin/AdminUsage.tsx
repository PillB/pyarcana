'use client'

import { parseUsage, USAGE_PATH, usagePercent, type Usage, type UsageRow } from '@/lib/cloud/admin-api'
import { LoadNote } from '../LoadNote'
import { useApiLoad } from '../useApiLoad'
import { useText, type Tr } from '../text'

const LEVEL_CLASS = {
  green: 'border-emerald-500/40 bg-emerald-500/5',
  amber: 'border-amber-500/60 bg-amber-500/10',
  red: 'border-red-500/60 bg-red-500/10',
} as const

const n = (v: number, lang: string) => v.toLocaleString(lang)

function Meter({ label, used, limit, tr, lang }: { label: string; used: number; limit: number; tr: Tr; lang: string }) {
  const pct = usagePercent(used, limit)
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span>{tr('adm.usage.of', { n: n(used, lang), limit: n(limit, lang), pct: String(pct) })}</span>
      </div>
      <div className="h-2 rounded bg-muted" role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.min(pct, 100)}>
        <div className="h-2 rounded bg-foreground/70" style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
    </div>
  )
}

function RowsTable({ caption, head, rows, lang, testId }: { caption: string; head: string; rows: UsageRow[]; lang: string; testId: string }) {
  const { tr } = useText()
  return (
    <table className="w-full text-sm" data-testid={testId}>
      <caption className="mb-1 text-left font-medium">{caption}</caption>
      <thead>
        <tr className="text-left text-muted-foreground">
          <th scope="col" className="font-normal">{head}</th>
          <th scope="col" className="text-right font-normal">{tr('adm.usage.reads')}</th>
          <th scope="col" className="text-right font-normal">{tr('adm.usage.writes')}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.label} className="border-t border-border">
            <td className="py-1 font-mono text-xs">{r.label}</td>
            <td className="py-1 text-right">{n(r.rowsRead, lang)}</td>
            <td className="py-1 text-right">{n(r.rowsWritten, lang)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function UsageView({ u }: { u: Usage }) {
  const { tr, lang } = useText()
  return (
    <div className="space-y-4" data-testid="usage-view" data-level={u.level}>
      <p className={`rounded-md border px-3 py-2 text-sm ${LEVEL_CLASS[u.level]}`} role="status">
        <strong>{tr(`adm.usage.level.${u.level}`)}</strong> {tr(`adm.usage.level.${u.level}.detail`)}
      </p>
      <Meter label={tr('adm.usage.writes')} used={u.today.rowsWritten} limit={u.limits.rowsWritten} tr={tr} lang={lang} />
      <Meter label={tr('adm.usage.reads')} used={u.today.rowsRead} limit={u.limits.rowsRead} tr={tr} lang={lang} />
      {u.sources.length === 0
        ? <p className="text-sm text-muted-foreground">{tr('adm.usage.none')}</p>
        : <RowsTable caption={tr('adm.usage.sources')} head={tr('adm.usage.source')} rows={u.sources} lang={lang} testId="usage-sources" />}
      {u.days.length > 0 && <RowsTable caption={tr('adm.usage.days')} head={tr('adm.usage.day')} rows={u.days} lang={lang} testId="usage-days" />}
      <p className="text-xs text-muted-foreground">{tr('adm.usage.note', { min: String(Math.round(u.flushSeconds / 60)) })}</p>
    </div>
  )
}

/**
 * "Uso": D1 rows read and written today against the free daily limits, by route, the last 14
 * days and the budget level that slows sync down before the limit (owner request 2026-10-04).
 */
export function AdminUsage() {
  const { tr } = useText()
  const load = useApiLoad(USAGE_PATH, parseUsage)
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{tr('adm.usage.what')}</p>
      <LoadNote state={load} />
      {load?.status === 'ok' && <UsageView u={load.value} />}
    </div>
  )
}

/** A banner above the admin tabs while the day's budget is amber or red; nothing when green. */
export function UsageBanner() {
  const { tr } = useText()
  const load = useApiLoad(USAGE_PATH, parseUsage)
  const level = load?.status === 'ok' ? load.value.level : 'green'
  if (level === 'green') return null
  return (
    <p className={`rounded-md border px-3 py-2 text-sm ${LEVEL_CLASS[level]}`} role="alert" data-testid="usage-banner" data-level={level}>
      {tr(`adm.usage.banner.${level}`)}
    </p>
  )
}
