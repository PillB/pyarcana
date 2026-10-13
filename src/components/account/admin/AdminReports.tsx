'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { REPORT_STATUSES, adminReportPath, reportPatch, type ReportRow } from '@/lib/cloud/admin-api'
import { SELECT_CLASS } from '../LoadNote'
import { ReportBrowser } from '../ReportBrowser'
import { ReportDetail, statusText } from '../ReportDetail'
import { useText } from '../text'
import { Feedback, sendBuilt } from './shared'

/** Triage: status, a private admin note and, for a duplicate, the report it repeats. */
function Triage({ row, onDone }: { row: ReportRow; onDone: () => void }) {
  const { tr } = useText()
  const [status, setStatus] = useState(row.status)
  const [adminNote, setAdminNote] = useState(row.adminNote ?? '')
  const [duplicateOf, setDuplicateOf] = useState(row.duplicateOf ?? '')
  const [result, setResult] = useState<{ error: string | null; done: string | null }>({ error: null, done: null })
  const submit = async () => {
    const built = reportPatch({ status: row.status, adminNote: row.adminNote, duplicateOf: row.duplicateOf }, { status, adminNote, duplicateOf })
    const out = await sendBuilt('patch', adminReportPath(row.id), built, tr)
    if (!out.ok) return setResult({ error: out.text, done: null })
    setResult({ error: null, done: tr('adm.reports.saved') })
    onDone()
  }
  return (
    <form className="space-y-3 rounded-md border border-border p-4" onSubmit={(e) => { e.preventDefault(); void submit() }}>
      <h3 className="font-semibold">{tr('adm.reports.triage')}</h3>
      {row.accountEmail && <p className="text-sm">{tr('adm.reports.from', { email: row.accountEmail })}</p>}
      {row.contactEmail && <p className="text-sm">{tr('adm.reports.contact', { email: row.contactEmail })}</p>}
      <Label htmlFor="triage-status">{tr('qasite.filter.status')}</Label>
      <select id="triage-status" className={SELECT_CLASS} value={status} onChange={(e) => setStatus(e.target.value)}>
        {REPORT_STATUSES.map((s) => <option key={s} value={s}>{statusText(s, tr)}</option>)}
      </select>
      {status === 'duplicate' && (
        <div className="space-y-1">
          <Label htmlFor="triage-dup">{tr('adm.reports.duplicateOf')}</Label>
          <Input id="triage-dup" value={duplicateOf} placeholder="rep_…" onChange={(e) => setDuplicateOf(e.target.value)} />
        </div>
      )}
      <Label htmlFor="triage-note">{tr('adm.reports.note')}</Label>
      <Textarea id="triage-note" value={adminNote} maxLength={2000} onChange={(e) => setAdminNote(e.target.value)} />
      <Feedback error={result.error} done={result.done} />
      <Button type="submit" size="sm">{tr('adm.reports.save')}</Button>
    </form>
  )
}

/** "Reportes": every report with the reporter's identity (admin only) and triage. */
export function AdminReports() {
  return (
    <ReportBrowser
      scope="admin"
      renderDetail={(row, reload) => (
        <div key={row.id} className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <ReportDetail id={row.id} />
          <Triage row={row} onDone={reload} />
        </div>
      )}
    />
  )
}
