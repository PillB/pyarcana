'use client'

import { CLOUD_CONFIG } from '@/lib/cloud/config'
import { REPORT_STATUSES, attachmentPath, categoryLabel, parseReportDetail, reportPath, sectionLabel, severityLabel, type ReportRow } from '@/lib/cloud/admin-api'
import { LoadNote, formatDay } from './LoadNote'
import { useApiLoad } from './useApiLoad'
import { useText, type Tr } from './text'
import { ERROR_ALERT_CLASS } from '@/components/account/a11y'

/** A worker status in words; an unknown one is shown as sent, never as a missing key. */
export function statusText(status: string, tr: Tr): string {
  return (REPORT_STATUSES as readonly string[]).includes(status) ? tr(`qasite.status.${status}`) : status
}

function Block({ title, text }: { title: string; text: string | null }) {
  if (!text) return null
  return (
    <div>
      <h4 className="text-sm font-semibold">{title}</h4>
      <p className="whitespace-pre-wrap text-sm">{text}</p>
    </div>
  )
}

/** The report's context; the section reads as the section filter offers it ("S07 · Pandas"). */
export function ContextList({ report, tr }: { report: ReportRow; tr: Tr }) {
  const c = report.context
  const items: Array<[string, string | number | null]> = [
    ['qasite.ctx.path', c.path ? `${c.path}${c.hash ?? ''}` : null],
    ['qasite.ctx.section', sectionLabel(c)],
    ['qasite.ctx.subStep', c.subStep],
    ['qasite.ctx.element', c.elementHint],
    ['qasite.ctx.viewport', c.viewport],
    ['qasite.ctx.language', c.language],
    ['qasite.ctx.sha', c.deploymentSha ? c.deploymentSha.slice(0, 12) : null],
    ['qasite.ctx.browser', c.userAgent],
  ]
  return (
    <dl className="grid gap-1 text-xs sm:grid-cols-[10rem_1fr]">
      {items.filter(([, v]) => v !== null && v !== '').map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="text-muted-foreground">{tr(k)}</dt>
          <dd className="break-all">{v}</dd>
        </div>
      ))}
    </dl>
  )
}

/**
 * One report as testers and admins read it: context, the tester's words, and the attached images,
 * loaded from the same-origin API with the session cookie (no third-party host).
 */
export function ReportDetail({ id }: { id: string }) {
  const { tr, lang } = useText()
  const state = useApiLoad(reportPath(id), parseReportDetail)
  if (!state || state.status !== 'ok') return <LoadNote state={state} />
  if (!state.value) return <p role="alert" className={ERROR_ALERT_CLASS}>{tr('cloudpage.loadFailed', { reason: 'bad_response' })}</p>
  const { report, attachments } = state.value
  return (
    <article className="space-y-3 rounded-md border border-border p-4" data-testid="report-detail">
      <h3 className="text-base font-semibold">{report.title}</h3>
      <p className="text-xs text-muted-foreground">
        {report.id} · {formatDay(report.createdAt, lang)} · {statusText(report.status, tr)} · {report.severity ? severityLabel(report.severity) : '—'} · {categoryLabel(report.category)}
      </p>
      <ContextList report={report} tr={tr} />
      <Block title={tr('qasite.f.description')} text={report.description} />
      <Block title={tr('qasite.f.steps')} text={report.steps} />
      <Block title={tr('qasite.f.expected')} text={report.expected} />
      <Block title={tr('qasite.f.actual')} text={report.actual} />
      <Block title={tr('qasite.f.improvement')} text={report.improvement} />
      {attachments.map((a, i) => {
        const path = attachmentPath(report.id, a.id)
        // A plain <img>: a same-origin API image behind the session cookie (next/image cannot send it).
        return path && (
          <img key={a.id} src={`${CLOUD_CONFIG.apiBaseUrl}${path}`} alt={tr('qasite.attachmentAlt', { n: i + 1, title: report.title })} className="max-h-[360px] w-full rounded-md border border-border object-contain" loading="lazy" />
        )
      })}
    </article>
  )
}
