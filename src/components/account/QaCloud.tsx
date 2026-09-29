'use client'

/**
 * The parts of the QA harness that talk to the team (DESIGN-v3 §H). Loaded on demand by
 * QaCloudSlots only where accounts run, so the harness on github.io stays local-only.
 * Nothing is sent without a click; the local copy always stays.
 */
import { useState } from 'react'
import { create } from 'zustand'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useQaMode } from '@/lib/cloud/hooks'
import { writeQaMode } from '@/lib/cloud/qa-mode'
import { prepareScreenshot, sendAndMark, sendUnsent, sentMark, unsentIssues, type ImageCodec, type SendAllDeps } from '@/lib/cloud/qa-report'
import { useCloudRuntime, useCloudSession } from '@/lib/cloud/session'
import { safeStorage } from '@/lib/cloud/storage'
import type { UiError } from '@/lib/cloud/account-api'
import { saveQaIssue, type QAIssue } from '@/lib/qa-session'
import { cloudApi } from './runtime'
import { useText, type Tr } from './text'

/** Draws through a canvas: only pixels are written, so EXIF never leaves the browser. */
function browserCodec(): ImageCodec {
  let image: HTMLImageElement | null = null
  return {
    load: (dataUrl) =>
      new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
          image = img
          resolve({ width: img.naturalWidth, height: img.naturalHeight })
        }
        img.onerror = () => reject(new Error('decode'))
        img.src = dataUrl
      }),
    encodeJpeg: async (width, height, quality) => {
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx || !image) throw new Error('canvas')
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, width, height)
      ctx.drawImage(image, 0, 0, width, height)
      return canvas.toDataURL('image/jpeg', quality)
    },
  }
}

/** The contact address an anonymous tester may leave, shared by both send buttons. */
const useQaContact = create<{ email: string }>()(() => ({ email: '' }))

function useSender(): { signedIn: boolean; options: (tester: string) => { tester: string; contactEmail: string; signedIn: boolean } } {
  const hasMe = useCloudSession((s) => s.me !== null)
  const live = useCloudRuntime((s) => s.meStatus === 'ok')
  const signedIn = hasMe && live
  const email = useQaContact((s) => s.email)
  return { signedIn, options: (tester) => ({ tester, contactEmail: email, signedIn }) }
}

function deps(onDropped: () => void): SendAllDeps {
  return {
    now: () => new Date().toISOString(),
    prepare: async (issue) => {
      const attachment = await prepareScreenshot(issue.screenshotDataUrl ?? '', browserCodec())
      if (!attachment) onDropped()
      return attachment
    },
    save: (issue) => saveQaIssue(issue),
  }
}

function errorText(e: UiError, tr: Tr): string {
  return tr(e.key, { minutes: e.minutes ?? '' })
}

/** "Enviar al equipo" for the issue open in the Review tab, or when and as what it was sent. */
export function QaSendIssue({ issue, tester, onSent }: { issue: QAIssue; tester: string; onSent: () => void }) {
  const { tr, lang } = useText()
  const { options } = useSender()
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState<string | null>(null)
  const mark = sentMark(issue)
  if (mark) {
    return <p className="text-sm text-muted-foreground" data-testid="qa-sent-mark">{tr('qa.send.sentAt', { date: new Date(mark.sentAt).toLocaleString(lang), id: mark.remoteId })}</p>
  }
  const send = async () => {
    setBusy(true)
    let dropped = false
    const step = await sendAndMark(cloudApi(), issue, options(tester), deps(() => (dropped = true)))
    setBusy(false)
    const extra = dropped ? ` ${tr('qa.send.screenshotDropped')}` : ''
    setNote(step.error ? errorText(step.error, tr) : `${tr('qa.send.done')}${extra}`)
    if (step.sent) onSent()
  }
  return (
    <div className="space-y-1">
      <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => void send()} data-testid="qa-send-issue">{tr('qa.send.one')}</Button>
      {note && <p role="status" className="text-xs">{note}</p>}
    </div>
  )
}

function ContactField({ tr }: { tr: Tr }) {
  const email = useQaContact((s) => s.email)
  return (
    <div className="space-y-1">
      <Label htmlFor="qa-contact-email">{tr('qa.send.contact')}</Label>
      <Input id="qa-contact-email" type="email" autoComplete="email" value={email} onChange={(e) => useQaContact.setState({ email: e.target.value })} />
      <p className="text-xs text-muted-foreground">{tr('qa.send.contactHint')}</p>
    </div>
  )
}

function SendAll({ issues, tester, onSent }: { issues: QAIssue[]; tester: string; onSent: () => void }) {
  const { tr } = useText()
  const { signedIn, options } = useSender()
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState<string | null>(null)
  const pending = unsentIssues(issues).length
  const run = async () => {
    setBusy(true)
    let dropped = 0
    const r = await sendUnsent(cloudApi(), issues, options(tester), deps(() => (dropped += 1)))
    setBusy(false)
    const summary = tr('qa.send.summary', { sent: r.sent, failed: r.failed, remaining: r.remaining })
    const shots = dropped ? ` ${tr('qa.send.screenshotsDropped', { n: dropped })}` : ''
    setNote(`${summary}${shots}${r.error ? ` ${errorText(r.error, tr)}` : ''}`)
    onSent()
  }
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">{tr('qa.send.what')}</p>
      {!signedIn && <ContactField tr={tr} />}
      <Button type="button" variant="outline" disabled={busy || pending === 0} onClick={() => void run()} data-testid="qa-send-all">
        {tr('qa.send.all', { n: pending })}
      </Button>
      {note && <p role="status" className="text-sm">{note}</p>}
    </div>
  )
}

function ModeToggle({ id, checked, label, hint, onChange }: { id: string; checked: boolean; label: string; hint: string; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start gap-2">
      <Checkbox id={id} checked={checked} onCheckedChange={(v) => onChange(v === true)} className="mt-0.5" />
      <div>
        <Label htmlFor={id}>{label}</Label>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
    </div>
  )
}

function QaModeToggles() {
  const { tr } = useText()
  const qa = useQaMode()
  const set = (patch: { testMode?: boolean; adPreview?: boolean }) => writeQaMode(safeStorage(), patch, Date.now())
  return (
    <div className="space-y-3" data-testid="qa-mode-toggles">
      <ModeToggle id="qa-test-mode" checked={qa.testMode} label={tr('qa.mode.test')} hint={tr('qa.mode.testHint')} onChange={(testMode) => set({ testMode })} />
      <ModeToggle id="qa-ad-preview" checked={qa.adPreview} label={tr('qa.mode.ads')} hint={tr('qa.mode.adsHint')} onChange={(adPreview) => set({ adPreview })} />
    </div>
  )
}

/** The Session tab's team section: send every unsent issue, and the test-mode switches. */
export function QaSessionCloud({ issues, tester, onSent }: { issues: QAIssue[]; tester: string; onSent: () => void }) {
  const { tr } = useText()
  return (
    <section className="space-y-4 rounded-xl border border-border p-5 lg:col-span-2" data-testid="qa-cloud-session">
      <h3 className="font-semibold">{tr('qa.send.h')}</h3>
      <SendAll issues={issues} tester={tester} onSent={onSent} />
      <h3 className="font-semibold">{tr('qa.mode.h')}</h3>
      <QaModeToggles />
    </section>
  )
}
