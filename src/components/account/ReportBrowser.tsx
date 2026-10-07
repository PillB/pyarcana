'use client'

import { useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  REPORT_CATEGORY_VALUES,
  REPORT_SEVERITY_VALUES,
  REPORT_SOURCE_VALUES,
  REPORT_STATUSES,
  categoryLabel,
  mergeSectionOptions,
  parseReportList,
  reportsPath,
  sectionLabel,
  severityLabel,
  type ReportFilters,
  type ReportRow,
  type SectionOption,
} from '@/lib/cloud/admin-api'
import { LoadNote, SELECT_CLASS, formatDay } from './LoadNote'
import { statusText } from './ReportDetail'
import { useApiLoad } from './useApiLoad'
import { useText, type Tr } from './text'

const EMPTY: ReportFilters = { status: '', severity: '', category: '', section: '', source: '', tester: '', q: '' }

function Choice({ id, label, value, options, text, onChange, tr }: { id: string; label: string; value: string; options: readonly string[]; text: (v: string) => string; onChange: (v: string) => void; tr: Tr }) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id}>{label}</Label>
      <select id={id} className={`${SELECT_CLASS} w-full`} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{tr('qasite.filter.any')}</option>
        {options.map((o) => <option key={o} value={o}>{text(o)}</option>)}
      </select>
    </div>
  )
}

function FilterBar({ scope, sections, onApply }: { scope: string; sections: SectionOption[]; onApply: (f: ReportFilters) => void }) {
  const { tr } = useText()
  const [draft, setDraft] = useState<ReportFilters>(EMPTY)
  const set = (key: keyof ReportFilters) => (value: string) => setDraft((d) => ({ ...d, [key]: value }))
  const labels = new Map(sections.map((o) => [o.id, o.label]))
  return (
    <form
      className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4"
      onSubmit={(e) => {
        e.preventDefault()
        onApply(draft)
      }}
    >
      <Choice id={`${scope}-status`} label={tr('qasite.filter.status')} value={draft.status ?? ''} options={REPORT_STATUSES} text={(v) => statusText(v, tr)} onChange={set('status')} tr={tr} />
      <Choice id={`${scope}-severity`} label={tr('qasite.filter.severity')} value={draft.severity ?? ''} options={REPORT_SEVERITY_VALUES} text={severityLabel} onChange={set('severity')} tr={tr} />
      <Choice id={`${scope}-category`} label={tr('qasite.filter.category')} value={draft.category ?? ''} options={REPORT_CATEGORY_VALUES} text={categoryLabel} onChange={set('category')} tr={tr} />
      <Choice id={`${scope}-section`} label={tr('qasite.filter.section')} value={draft.section ?? ''} options={sections.map((o) => o.id)} text={(v) => labels.get(v) ?? v} onChange={set('section')} tr={tr} />
      <Choice id={`${scope}-source`} label={tr('qasite.filter.source')} value={draft.source ?? ''} options={REPORT_SOURCE_VALUES} text={(v) => tr(`qasite.source.${v}`)} onChange={set('source')} tr={tr} />
      <div className="space-y-1">
        <Label htmlFor={`${scope}-tester`}>{tr('qasite.filter.tester')}</Label>
        <Input id={`${scope}-tester`} value={draft.tester ?? ''} maxLength={80} onChange={(e) => set('tester')(e.target.value)} />
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
              {formatDay(r.createdAt, lang)} · {statusText(r.status, tr)} · {r.severity ? severityLabel(r.severity) : '—'} · {categoryLabel(r.category)}
              {sectionLabel(r.context) ? ` · ${sectionLabel(r.context)}` : ''}
              {r.accountEmail ? ` · ${r.accountEmail}` : ''}
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}

/**
 * The sections of every report list loaded in this view, kept across pages and filters. Updated
 * while rendering when a new list arrives (React's "storing information from previous renders"),
 * so no effect sets state.
 */
function useSeenSections(rows: ReportRow[] | null): SectionOption[] {
  const [seen, setSeen] = useState<{ rows: ReportRow[] | null; sections: SectionOption[] }>({ rows: null, sections: [] })
  if (rows && rows !== seen.rows) setSeen({ rows, sections: mergeSectionOptions(seen.sections, rows) })
  return seen.sections
}

/**
 * Every report, filtered (DESIGN-v3 §H): status, severity, category, section and text search, one
 * page at a time with the worker's cursor. The section filter lists the sections of the reports
 * loaded so far, labelled as the rows and the detail show them (admin-api sectionLabel). `renderDetail` shows the chosen report (admins add the
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
  const sections = useSeenSections(list?.reports ?? null)
  return (
    <div className="space-y-4">
      <FilterBar
        scope={scope}
        sections={sections}
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
