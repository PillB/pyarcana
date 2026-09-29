'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { CLOUD_CONFIG } from '@/lib/cloud/config'
import { parseReportList } from '@/lib/cloud/admin-api'
import { QA_OPEN_EVENT } from '@/lib/cloud/qa-links'
import { refreshMe, safeHttpsUrl, useCloudRuntime, useCloudSession, type MePayload } from '@/lib/cloud/session'
import { CloudPageFrame } from './CloudPageFrame'
import { LoadNote, formatDay } from './LoadNote'
import { ReportBrowser } from './ReportBrowser'
import { ReportDetail, statusText } from './ReportDetail'
import { useApiLoad } from './useApiLoad'
import { sitePath, useText } from './text'

/** GET /v1/me once on pages that do not run the course's CloudSync. */
export function useMeOnce(): { me: MePayload | null; settled: boolean } {
  const me = useCloudSession((s) => s.me)
  const meStatus = useCloudRuntime((s) => s.meStatus)
  useEffect(() => {
    if (useCloudRuntime.getState().meStatus === 'idle') void refreshMe()
  }, [])
  return { me: meStatus === 'ok' ? me : null, settled: meStatus !== 'idle' && meStatus !== 'pending' }
}

/** Reporting a fault is not a consumer complaint (DL 1729 art. 24.4): the page says where those go. */
export function NotComplaintsNotice() {
  const { tr } = useText()
  const book = safeHttpsUrl(CLOUD_CONFIG.legal.complaintsBookUrl)
  return (
    <p className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm" data-testid="qa-not-complaints">
      {tr('qasite.notComplaints')}{' '}
      {book && <a href={book} className="underline underline-offset-2" rel="noopener">{tr('billing.links.complaints')}</a>}
    </p>
  )
}

function HowToTest() {
  const { tr } = useText()
  return (
    <section className="space-y-2" aria-labelledby="qa-how-h">
      <h2 id="qa-how-h" className="text-lg font-semibold">{tr('qasite.how.h')}</h2>
      <p className="text-sm">{tr('qasite.how.body')}</p>
      <Button variant="outline" onClick={() => window.dispatchEvent(new Event(QA_OPEN_EVENT))}>{tr('qasite.how.open')}</Button>
    </section>
  )
}

function MyReports() {
  const { tr, lang } = useText()
  const state = useApiLoad('/v1/me/reports', parseReportList)
  const reports = state?.status === 'ok' ? state.value.reports : null
  return (
    <section className="space-y-2" aria-labelledby="qa-mine-h">
      <h2 id="qa-mine-h" className="text-lg font-semibold">{tr('qasite.mine.h')}</h2>
      <LoadNote state={state} />
      {reports && !reports.length && <p className="text-sm text-muted-foreground">{tr('qasite.mine.none')}</p>}
      {reports && reports.length > 0 && (
        <ul className="divide-y divide-border rounded-md border border-border text-sm" data-testid="qa-my-reports">
          {reports.map((r) => (
            <li key={r.id} className="px-3 py-2">
              <span className="font-medium">{r.title}</span>
              <span className="block text-xs text-muted-foreground">{formatDay(r.createdAt, lang)} · {statusText(r.status, tr)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function AllReports() {
  const { tr } = useText()
  return (
    <section className="space-y-3" aria-labelledby="qa-all-h">
      <h2 id="qa-all-h" className="text-lg font-semibold">{tr('qasite.all.h')}</h2>
      <ReportBrowser scope="qa" renderDetail={(row) => <ReportDetail key={row.id} id={row.id} />} />
    </section>
  )
}

function QaSiteActive() {
  const { tr } = useText()
  const { me, settled } = useMeOnce()
  const canSeeAll = me !== null && (me.account.isAdmin || me.account.roles.includes('tester'))
  return (
    <div className="space-y-6">
      <NotComplaintsNotice />
      <HowToTest />
      {!settled && <p role="status" className="text-sm text-muted-foreground">{tr('cloudpage.loading')}</p>}
      {settled && !me && <p className="text-sm">{tr('qasite.signIn')} <a href={sitePath('/')} className="underline underline-offset-2">{tr('cuenta.back')}</a></p>}
      {me && <MyReports />}
      {canSeeAll && <AllReports />}
    </div>
  )
}

/** /qa, the QA reporting subsite (DESIGN-v3 §H). */
export function QaSitePage() {
  return <CloudPageFrame titleKey="qasite.title" plainLinks wide>{() => <QaSiteActive />}</CloudPageFrame>
}
