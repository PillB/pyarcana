'use client'

import { useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  REPORT_CATEGORY_VALUES,
  REPORT_SEVERITY_VALUES,
  REPORT_STATUSES,
  parseReportList,
  reportsPath,
  type ReportFilters,
  type ReportRow,
} from '@/lib/cloud/admin-api'
import { LoadNote, SELECT_CLASS, formatDay } from './LoadNote'
import { statusText } from './ReportDetail'
import { useApiLoad } from './useApiLoad'
import { useText, type Tr } from './text'

const EMPTY: ReportFilters = { status: '', severity: '', category: '', section: '', q: '' }

function Choice({ id, label, value, options, onChange, tr }: { id: string; label: string; value: string; options: readonly string[]; onChange: (v: string) => void; tr: Tr }) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id}>{label}</Label>
      <select id={id} className={`${SELECT_CLASS} w-full`} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{tr('qasite.filter.any')}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

function FilterBar({ scope, onApply }: { scope: string; onApply: (f: ReportFilters) => void }) {
  const { tr } = useText()
  const [draft, setDraft] = useState<ReportFilters>(EMPTY)
  const set = (key: keyof ReportFilters) => (value: string) => setDraft((d) => ({ ...d, [key]: value }))
  return (
    <form
      className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6"
      onSubmit={(e) => {
        e.preventDefault()
        onApply(draft)
      }}
    >
      <Choice id={`${scope}-status`} label={tr('qasite.filter.status')} value={draft.status ?? ''} options={REPORT_STATUSES} onChange={set('status')} tr={tr} />
      <Choice id={`${scope}-severity`} label={tr('qasite.filter.severity')} value={draft.severity ?? ''} options={REPORT_SEVERITY_VALUES} onChange={set('severity')} tr={tr} />
      <Choice id={`${scope}-category`} label={tr('qasite.filter.category')} value={draft.category ?? ''} options={REPORT_CATEGORY_VALUES} onChange={set('category')} tr={tr} />
      <div className="space-y-1">
        <Label htmlFor={`${scope}-section`}>{tr('qasite.filter.section')}</Label>
        <Input id={`${scope}-section`} value={draft.section ?? ''} maxLength={40} onChange={(e) => set('section')(e.target.value)} />
      </div>
      <div className="space-y-1">
        <Label htmlFor={`${scope}-q`}>{tr('qasite.filter.q')}</Label>
        <Input id={`${scope}-q`} value={draft.q ?? ''} maxLength={100} onChange={(e) => set('q')(e.target.value)} />
      </div>
      <div className="flex items-end">
        <Button type="submit" variant="outline" className="w-full">{tr('qasite.filter.apply')}</Button>
      </div>
    </form>
  )
}

function ReportRows({ reports, selected, onSelect, tr, lang }: { reports: ReportRow[]; selected: string | null; onSelect: (id: string) => void; tr: Tr; lang: Parameters<typeof formatDay>[1] }) {
  if (!reports.length) return <p className="text-sm text-muted-foreground">{tr('qasite.none')}</p>
  return (
    <ul className="divide-y divide-border rounded-md border border-border">
      {reports.map((r) => (
        <li key={r.id}>
          <button
            type="button"
            aria-pressed={selected === r.id}
            onClick={() => onSelect(r.id)}
            className={`w-full px-3 py-2 text-left text-sm ${selected === r.id ? 'bg-primary/5' : 'hover:bg-muted/50'}`}
          >
            <span className="font-medium">{r.title}</span>
            <span className="block text-xs text-muted-foreground">
              {formatDay(r.createdAt, lang)} · {statusText(r.status, tr)} · {r.severity ?? '—'} · {r.category}
              {r.accountEmail ? ` · ${r.accountEmail}` : ''}
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}

/**
 * Every report, filtered (DESIGN-v3 §H): status, severity, category, section and text search, one
 * page at a time with the worker's cursor. `renderDetail` shows the chosen report (admins add the
 * triage form there).
 */
export function ReportBrowser({ scope, renderDetail }: { scope: 'qa' | 'admin'; renderDetail: (row: ReportRow, reload: () => void) => ReactNode }) {
  const { tr, lang } = useText()
  const [filters, setFilters] = useState<ReportFilters>(EMPTY)
  const [cursor, setCursor] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [nonce, setNonce] = useState(0)
  const state = useApiLoad(reportsPath(scope, filters, cursor), parseReportList, nonce)
  const list = state?.status === 'ok' ? state.value : null
  const row = list?.reports.find((r) => r.id === selected) ?? null
  return (
    <div className="space-y-4">
      <FilterBar
        scope={scope}
        onApply={(f) => {
          setFilters(f)
          setCursor(null)
          setSelected(null)
        }}
      />
      <LoadNote state={state} />
      {list && <ReportRows reports={list.reports} selected={selected} onSelect={setSelected} tr={tr} lang={lang} />}
      <div className="flex gap-2">
        {cursor && <Button variant="ghost" size="sm" onClick={() => setCursor(null)}>{tr('qasite.firstPage')}</Button>}
        {list?.nextCursor && <Button variant="outline" size="sm" onClick={() => setCursor(list.nextCursor)}>{tr('qasite.nextPage')}</Button>}
      </div>
      {row && renderDetail(row, () => setNonce((n) => n + 1))}
    </div>
  )
}
