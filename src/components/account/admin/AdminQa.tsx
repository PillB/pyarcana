'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  COURSE_SECTION_COUNT,
  issuesPerHour,
  parseQaStats,
  qaExportPath,
  qaStatsPath,
  causeLabel,
  severityLabel,
  type QaCount,
  type QaExportFormat,
  type QaStats,
} from '@/lib/cloud/admin-api'
import { fetchExport, saveBlob } from '@/lib/cloud/admin-download'
import { CLOUD_CONFIG } from '@/lib/cloud/config'
import { formatActive } from '@/lib/qa-session-stats'
import { ERROR_ALERT_CLASS } from '@/components/account/a11y'
import { LoadNote } from '../LoadNote'
import { statusText } from '../ReportDetail'
import { useApiLoad } from '../useApiLoad'
import { useText, type Tr } from '../text'
import { adminFailure } from './shared'

type Range = { from: string; to: string }

/** A section counts as covered once testers spent a minute on it. */
const COVERED_SECONDS = 60

function CountTable({ caption, head, rows, label, testId }: { caption: string; head: string; rows: QaCount[]; label?: (key: string) => string; testId: string }) {
  const { tr, lang } = useText()
  if (rows.length === 0) return null
  return (
    <table className="w-full text-sm" data-testid={testId}>
      <caption className="mb-1 text-left font-medium">{caption}</caption>
      <thead>
        <tr className="text-left text-muted-foreground">
          <th scope="col" className="font-normal">{head}</th>
          <th scope="col" className="text-right font-normal">{tr('adm.qa.count')}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.key ?? '∅'} className="border-t border-border">
            <td className="py-1">{r.key === null ? '—' : label ? label(r.key) : r.key}</td>
            <td className="py-1 text-right">{r.count.toLocaleString(lang)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function Summary({ s, tr, lang }: { s: QaStats; tr: Tr; lang: string }) {
  const covered = s.sessions.sections.filter((x) => x.seconds >= COVERED_SECONDS).length
  const rate = issuesPerHour(s.sessions.issuesCreated, s.sessions.activeSeconds)
  const cards: Array<[string, string, string]> = [
    ['reports', tr('adm.qa.sum.reports'), s.reports.total.toLocaleString(lang)],
    ['sessions', tr('adm.qa.sum.sessions'), s.sessions.count.toLocaleString(lang)],
    ['testers', tr('adm.qa.sum.testers'), s.sessions.testers.toLocaleString(lang)],
    ['active', tr('adm.qa.sum.active'), formatActive(s.sessions.activeSeconds * 1000)],
    ['coverage', tr('adm.qa.sum.coverage'), tr('adm.qa.sum.coverageValue', { n: String(covered), total: String(COURSE_SECTION_COUNT) })],
    ['rate', tr('adm.qa.sum.rate'), rate === null ? '—' : rate.toLocaleString(lang)],
  ]
  return (
    <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3" data-testid="qa-summary">
      {cards.map(([key, label, value]) => (
        <div key={key} className="rounded-md border border-border p-2" data-key={key}>
          <dt className="text-xs text-muted-foreground">{label}</dt>
          <dd className="text-lg font-semibold">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

function SectionTime({ s, tr }: { s: QaStats; tr: Tr }) {
  if (s.sessions.sections.length === 0) return null
  return (
    <table className="w-full text-sm" data-testid="qa-section-time">
      <caption className="mb-1 text-left font-medium">{tr('adm.qa.sectionTime')}</caption>
      <thead>
        <tr className="text-left text-muted-foreground">
          <th scope="col" className="font-normal">{tr('adm.qa.section')}</th>
          <th scope="col" className="text-right font-normal">{tr('adm.qa.time')}</th>
        </tr>
      </thead>
      <tbody>
        {s.sessions.sections.map((r) => (
          <tr key={r.key} className="border-t border-border">
            <td className="py-1 font-mono text-xs">{r.key}</td>
            <td className="py-1 text-right">{formatActive(r.seconds * 1000)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function Testers({ s, tr, lang }: { s: QaStats; tr: Tr; lang: string }) {
  if (s.sessions.perTester.length === 0) return null
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm" data-testid="qa-testers">
        <caption className="mb-1 text-left font-medium">{tr('adm.qa.testers')}</caption>
        <thead>
          <tr className="text-left text-muted-foreground">
            <th scope="col" className="font-normal">{tr('adm.qa.tester')}</th>
            <th scope="col" className="text-right font-normal">{tr('adm.qa.sum.sessions')}</th>
            <th scope="col" className="text-right font-normal">{tr('adm.qa.time')}</th>
            <th scope="col" className="text-right font-normal">{tr('adm.qa.issues')}</th>
            <th scope="col" className="text-right font-normal">{tr('adm.qa.last')}</th>
          </tr>
        </thead>
        <tbody>
          {s.sessions.perTester.map((t) => (
            <tr key={t.accountId} className="border-t border-border">
              <td className="py-1">{t.alias ?? '—'}{t.email ? <span className="block text-xs text-muted-foreground">{t.email}</span> : null}</td>
              <td className="py-1 text-right">{t.sessions.toLocaleString(lang)}</td>
              <td className="py-1 text-right">{formatActive(t.activeSeconds * 1000)}</td>
              <td className="py-1 text-right">{tr('adm.qa.issuesValue', { created: String(t.issuesCreated), sent: String(t.issuesSent) })}</td>
              <td className="py-1 text-right">{new Date(t.lastActiveAt * 1000).toLocaleDateString(lang)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function QaStatsView({ s }: { s: QaStats }) {
  const { tr, lang } = useText()
  const r = s.reports
  return (
    <div className="space-y-4" data-testid="qa-stats">
      <Summary s={s} tr={tr} lang={lang} />
      {r.total === 0 && s.sessions.count === 0 && <p className="text-sm text-muted-foreground">{tr('adm.qa.none')}</p>}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <CountTable caption={tr('adm.qa.by.severity')} head={tr('adm.qa.dim.severity')} rows={r.severity} label={severityLabel} testId="qa-by-severity" />
        <CountTable caption={tr('adm.qa.by.status')} head={tr('adm.qa.dim.status')} rows={r.status} label={(k) => statusText(k, tr)} testId="qa-by-status" />
        <CountTable caption={tr('adm.qa.by.section')} head={tr('adm.qa.section')} rows={r.section} testId="qa-by-section" />
        <CountTable caption={tr('adm.qa.by.tester')} head={tr('adm.qa.tester')} rows={r.tester} testId="qa-by-tester" />
        <CountTable caption={tr('adm.qa.by.cause')} head={tr('adm.qa.dim.cause')} rows={r.cause} label={causeLabel} testId="qa-by-cause" />
        <CountTable caption={tr('adm.qa.by.build')} head={tr('adm.qa.dim.build')} rows={r.build} testId="qa-by-build" />
        <CountTable caption={tr('adm.qa.by.day')} head={tr('adm.qa.dim.day')} rows={r.day} testId="qa-by-day" />
        <SectionTime s={s} tr={tr} />
      </div>
      <Testers s={s} tr={tr} lang={lang} />
    </div>
  )
}

function Downloads({ range }: { range: Range }) {
  const { tr } = useText()
  const [busy, setBusy] = useState<QaExportFormat | null>(null)
  const [note, setNote] = useState<{ error: boolean; text: string } | null>(null)
  const run = async (format: QaExportFormat) => {
    setBusy(format)
    setNote(null)
    const r = await fetchExport(CLOUD_CONFIG.apiBaseUrl, qaExportPath(format, range), format)
    setBusy(null)
    if (!r.ok) return setNote({ error: true, text: adminFailure({ ok: false, status: r.status, reason: r.reason, data: null }, tr) })
    saveBlob(r.blob, r.name)
    setNote({ error: false, text: tr(r.partial ? 'adm.qa.dl.partial' : 'adm.qa.dl.done', { name: r.name }) })
  }
  return (
    <div className="space-y-2" data-testid="qa-downloads">
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" disabled={busy !== null} onClick={() => void run('csv')} data-testid="qa-download-csv">{tr('adm.qa.dl.csv')}</Button>
        <Button variant="outline" disabled={busy !== null} onClick={() => void run('json')} data-testid="qa-download-json">{tr('adm.qa.dl.json')}</Button>
      </div>
      <p className="text-xs text-muted-foreground">{tr('adm.qa.dl.what')}</p>
      {note && <p role={note.error ? 'alert' : 'status'} className={note.error ? ERROR_ALERT_CLASS : 'text-sm'}>{note.text}</p>}
    </div>
  )
}

/**
 * "QA" (owner request 2026-10-05): what testers reported and how they worked (active time,
 * sections, per tester), for a range of days, plus the reports as CSV or as the QA workspace's own
 * JSON package. The worker computes everything (qa-admin.mjs); this tab only renders it.
 */
export function AdminQa() {
  const { tr } = useText()
  const [draft, setDraft] = useState<Range>({ from: '', to: '' })
  const [range, setRange] = useState<Range>({ from: '', to: '' })
  const [nonce, setNonce] = useState(0)
  const load = useApiLoad(qaStatsPath(range), parseQaStats, nonce)
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{tr('adm.qa.what')}</p>
      <form
        className="flex flex-wrap items-end gap-3"
        onSubmit={(e) => {
          e.preventDefault()
          setRange(draft)
          setNonce((n) => n + 1)
        }}
      >
        <div className="space-y-1">
          <Label htmlFor="adm-qa-from">{tr('adm.qa.from')}</Label>
          <Input id="adm-qa-from" type="date" value={draft.from} onChange={(e) => setDraft({ ...draft, from: e.target.value })} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="adm-qa-to">{tr('adm.qa.to')}</Label>
          <Input id="adm-qa-to" type="date" value={draft.to} onChange={(e) => setDraft({ ...draft, to: e.target.value })} />
        </div>
        <Button type="submit" variant="secondary">{tr('adm.qa.apply')}</Button>
      </form>
      <p className="text-xs text-muted-foreground">{tr('adm.qa.rangeNote')}</p>
      <Downloads range={range} />
      <LoadNote state={load} />
      {load?.status === 'ok' && <QaStatsView s={load.value} />}
    </div>
  )
}
