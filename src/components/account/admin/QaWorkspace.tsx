'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { REPORT_STATUSES, type ReportRow } from '@/lib/cloud/admin-api'
import { canReview, reviewPath, reviewRequest, type QaAccess } from '@/lib/cloud/qa-review'
import { SELECT_CLASS } from '../LoadNote'
import { MyReports } from '../QaSitePage'
import { ReportBrowser } from '../ReportBrowser'
import { ReportDetail, statusText } from '../ReportDetail'
import { useText } from '../text'
import { Feedback, sendBuilt } from './shared'

/**
 * The QA supervisor's change (PATCH /v1/qa/reports/:id): status and, for a duplicate, the report it
 * repeats. No admin note and no reporter identity: those stay in the admin's triage.
 */
export function ReviewForm({ row, onDone }: { row: ReportRow; onDone: () => void }) {
  const { tr } = useText()
  const [status, setStatus] = useState(row.status)
  const [duplicateOf, setDuplicateOf] = useState(row.duplicateOf ?? '')
  const [result, setResult] = useState<{ error: string | null; done: string | null }>({ error: null, done: null })
  const submit = async () => {
    const out = await sendBuilt('patch', reviewPath(row.id), reviewRequest({ status: row.status, duplicateOf: row.duplicateOf }, { status, duplicateOf }), tr)
    if (!out.ok) return setResult({ error: out.text, done: null })
    setResult({ error: null, done: tr('adm.reports.saved') })
    onDone()
  }
  return (
    <form className="space-y-3 rounded-md border border-border p-4" onSubmit={(e) => { e.preventDefault(); void submit() }} data-testid="qa-review-form">
      <h3 className="font-semibold">{tr('qarev.review.h')}</h3>
      <p className="text-xs text-muted-foreground">{tr('qarev.review.what')}</p>
      {row.verified.fixed > 0 && <p className="text-sm">{tr('qarev.count.fixed', { n: row.verified.fixed })}</p>}
      <Label htmlFor={`review-status-${row.id}`}>{tr('qasite.filter.status')}</Label>
      <select id={`review-status-${row.id}`} className={SELECT_CLASS} value={status} onChange={(e) => setStatus(e.target.value)}>
        {REPORT_STATUSES.map((s) => <option key={s} value={s}>{statusText(s, tr)}</option>)}
      </select>
      {status === 'duplicate' && (
        <div className="space-y-1">
          <Label htmlFor={`review-dup-${row.id}`}>{tr('adm.reports.duplicateOf')}</Label>
          <Input id={`review-dup-${row.id}`} value={duplicateOf} placeholder="rep_…" onChange={(e) => setDuplicateOf(e.target.value)} />
        </div>
      )}
      <Feedback error={result.error} done={result.done} />
      <Button type="submit" size="sm">{tr('adm.reports.save')}</Button>
    </form>
  )
}

function TeamReports({ access, initial }: { access: QaAccess; initial?: { awaiting: string } }) {
  const review = canReview(access)
  return (
    <ReportBrowser
      scope="qa"
      initial={initial}
      renderDetail={(row, reload) => (
        <div key={row.id} className={review ? 'grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]' : ''}>
          <ReportDetail id={row.id} onChanged={reload} />
          {review && <ReviewForm row={row} onDone={reload} />}
        </div>
      )}
    />
  )
}

/**
 * /admin for a tester or a QA supervisor: the team's reports without reporter identity, their own
 * reports, and for a supervisor the review queue. No admin tab is rendered, and the worker refuses
 * every admin route to these roles anyway (gate.mjs).
 */
export function QaWorkspace({ access }: { access: Exclude<QaAccess, 'admin' | null> }) {
  const { tr } = useText()
  const tabs = access === 'supervisor' ? (['queue', 'team', 'mine'] as const) : (['team', 'mine'] as const)
  return (
    <div className="space-y-4" data-testid="qa-workspace">
      <p className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm">{tr(access === 'supervisor' ? 'qarev.scope.supervisor' : 'qarev.scope.tester')}</p>
      <Tabs defaultValue={tabs[0]} className="space-y-4">
        <TabsList className="flex h-auto flex-wrap">
          {tabs.map((value) => <TabsTrigger key={value} value={value}>{tr(`qarev.tab.${value}`)}</TabsTrigger>)}
        </TabsList>
        {access === 'supervisor' && (
          <TabsContent value="queue">
            <TeamReports access={access} initial={{ awaiting: 'review' }} />
          </TabsContent>
        )}
        <TabsContent value="team">
          <TeamReports access={access} />
        </TabsContent>
        <TabsContent value="mine">
          <MyReports />
        </TabsContent>
      </Tabs>
    </div>
  )
}
