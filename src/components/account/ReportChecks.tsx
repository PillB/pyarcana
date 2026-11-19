'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { deploymentJsonUrl } from '@/lib/cloud/qa-links'
import {
  VERIFICATION_NOTE_MAX,
  VERIFICATION_RESULTS,
  myVerification,
  verificationsPath,
  verifyRequest,
  type Verification,
} from '@/lib/cloud/qa-review'
import { SITE_BASE_PATH } from '@/lib/runtime-mode'
import { formatDay } from './LoadNote'
import { cloudApi } from './runtime'
import { useText, type Tr } from './text'
import { adminFailure, Feedback } from './admin/shared'

/** The commit this page was built from (public/deployment.json), so a check names the build it retested. */
function useBuildSha(): string | null {
  const [sha, setSha] = useState<string | null>(null)
  useEffect(() => {
    let live = true
    void fetch(deploymentJsonUrl(SITE_BASE_PATH), { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: unknown) => {
        const value = d && typeof d === 'object' ? (d as { git_sha?: unknown }).git_sha : null
        if (live && typeof value === 'string') setSha(value)
      })
      .catch(() => {})
    return () => {
      live = false
    }
  }, [])
  return sha
}

function CheckList({ list, tr, lang }: { list: Verification[]; tr: Tr; lang: Parameters<typeof formatDay>[1] }) {
  if (!list.length) return <p className="text-sm text-muted-foreground">{tr('qarev.none')}</p>
  return (
    <ul className="space-y-1 text-sm" data-testid="report-checks">
      {list.map((v, i) => (
        <li key={`${v.createdAt}-${i}`}>
          <span className="font-medium">{tr(`qarev.result.${v.result}`)}</span>
          <span className="text-xs text-muted-foreground">
            {' '}· {v.mine ? tr('qarev.who.mine') : v.byReporter ? tr('qarev.who.reporter') : tr('qarev.who.other')}
            {' '}· {formatDay(v.updatedAt, lang)}
            {v.deploymentSha ? ` · ${v.deploymentSha.slice(0, 12)}` : ''}
          </span>
          {v.note && <span className="block whitespace-pre-wrap text-xs">{v.note}</span>}
        </li>
      ))}
    </ul>
  )
}

/**
 * "Retest": every check on a report and the caller's own one. A check never changes the report's
 * status; "Arreglado" puts it in the supervisor's review queue, and the supervisor or an admin closes it.
 */
export function ReportChecks({ reportId, list, onChanged }: { reportId: string; list: Verification[]; onChanged: () => void }) {
  const { tr, lang } = useText()
  const sha = useBuildSha()
  const mine = myVerification(list)
  const [result, setResult] = useState<string>(mine?.result ?? '')
  const [note, setNote] = useState(mine?.note ?? '')
  const [busy, setBusy] = useState(false)
  const [out, setOut] = useState<{ error: string | null; done: string | null }>({ error: null, done: null })
  const path = verificationsPath(reportId)
  const send = async (withdraw: boolean) => {
    const built = withdraw ? ({ ok: true, body: {} } as const) : verifyRequest(result, note, sha)
    if (!built.ok) return setOut({ error: tr(built.key), done: null })
    if (!path) return setOut({ error: tr('adm.error.target'), done: null })
    setBusy(true)
    const r = withdraw ? await cloudApi().del(path) : await cloudApi().post(path, built.body)
    setBusy(false)
    if (!r.ok) return setOut({ error: adminFailure(r, tr), done: null })
    setOut({ error: null, done: tr(withdraw ? 'qarev.withdrawn' : 'qarev.saved') })
    if (withdraw) {
      setResult('')
      setNote('')
    }
    onChanged()
  }
  return (
    <section className="space-y-3 rounded-md border border-border p-4" aria-labelledby={`checks-${reportId}`} data-testid="report-retest">
      <h4 id={`checks-${reportId}`} className="text-sm font-semibold">{tr('qarev.h')}</h4>
      <CheckList list={list} tr={tr} lang={lang} />
      <form className="space-y-2" onSubmit={(e) => { e.preventDefault(); void send(false) }}>
        <fieldset className="space-y-1">
          <legend className="text-sm">{tr('qarev.ask')}</legend>
          {VERIFICATION_RESULTS.map((value) => (
            <label key={value} className="flex items-center gap-2 text-sm">
              <input type="radio" name={`retest-${reportId}`} value={value} checked={result === value} onChange={() => setResult(value)} />
              {tr(`qarev.result.${value}`)}
            </label>
          ))}
        </fieldset>
        <p className="text-xs text-muted-foreground">{tr('qarev.fixedHint')}</p>
        <Label htmlFor={`retest-note-${reportId}`}>{tr('qarev.note')}</Label>
        <Textarea id={`retest-note-${reportId}`} value={note} maxLength={VERIFICATION_NOTE_MAX} onChange={(e) => setNote(e.target.value)} />
        <p className="text-xs text-muted-foreground">{sha ? tr('qarev.build', { sha: sha.slice(0, 12) }) : tr('qarev.noBuild')}</p>
        <Feedback error={out.error} done={out.done} />
        <div className="flex flex-wrap gap-2">
          <Button type="submit" size="sm" disabled={busy || !result} data-testid="retest-save">{tr(mine ? 'qarev.update' : 'qarev.save')}</Button>
          {mine && <Button type="button" size="sm" variant="ghost" disabled={busy} onClick={() => void send(true)}>{tr('qarev.withdraw')}</Button>}
        </div>
      </form>
    </section>
  )
}
