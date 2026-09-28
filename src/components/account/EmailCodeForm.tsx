'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { startEmail, verifyEmail, type ActionResult, type SignInTerms, type UiError } from '@/lib/cloud/account-api'
import { ErrorAlert } from './Alerts'
import { cloudApi } from './runtime'
import { useText } from './text'

const RESEND_AFTER_S = 30
const DEFAULT_TTL_S = 900

function useSecondsLeft(until: number): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (until <= Date.now()) return
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [until])
  return Math.max(0, Math.ceil((until - now) / 1000))
}

function EmailStep({ enabled, busy, email, setEmail, onSubmit }: { enabled: boolean; busy: boolean; email: string; setEmail: (v: string) => void; onSubmit: () => void }) {
  const { tr } = useText()
  const submit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit()
  }
  return (
    <form onSubmit={submit} className="space-y-2" noValidate>
      <Label htmlFor="account-email">{tr('account.signin.emailLabel')}</Label>
      <Input id="account-email" type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!enabled || busy} required />
      <Button type="submit" variant="secondary" className="w-full" disabled={!enabled || busy || email.trim() === ''}>
        {busy ? tr('account.signin.working') : tr('account.signin.sendCode')}
      </Button>
    </form>
  )
}

interface CodeStepProps {
  email: string
  ttlMinutes: number
  resendAt: number
  busy: boolean
  onVerify: (code: string) => void
  onResend: () => void
  onChangeEmail: () => void
}

function CodeStep({ email, ttlMinutes, resendAt, busy, onVerify, onResend, onChangeEmail }: CodeStepProps) {
  const { tr } = useText()
  const [code, setCode] = useState('')
  const wait = useSecondsLeft(resendAt)
  const submit = (e: FormEvent) => {
    e.preventDefault()
    onVerify(code)
  }
  return (
    <form onSubmit={submit} className="space-y-3">
      <p role="status" className="text-sm">{tr('account.signin.sent', { email, minutes: ttlMinutes })}</p>
      <Label htmlFor="account-code">{tr('account.signin.codeLabel')}</Label>
      <InputOTP id="account-code" maxLength={6} value={code} onChange={setCode} pattern={REGEXP_ONLY_DIGITS} autoComplete="one-time-code" inputMode="numeric" aria-label={tr('account.signin.codeLabel')} disabled={busy}>
        <InputOTPGroup>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <InputOTPSlot key={i} index={i} />
          ))}
        </InputOTPGroup>
      </InputOTP>
      <Button type="submit" className="w-full" disabled={busy || code.length !== 6}>
        {busy ? tr('account.signin.working') : tr('account.signin.codeSubmit')}
      </Button>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        {wait > 0 ? (
          <span className="text-muted-foreground">{tr('account.signin.resendIn', { seconds: wait })}</span>
        ) : (
          <Button type="button" variant="link" size="sm" className="h-auto p-0" onClick={onResend} disabled={busy}>{tr('account.signin.resend')}</Button>
        )}
        <Button type="button" variant="link" size="sm" className="h-auto p-0" onClick={onChangeEmail} disabled={busy}>{tr('account.signin.changeEmail')}</Button>
      </div>
    </form>
  )
}

/**
 * Email code sign-in: POST /v1/auth/email/start, then /verify with the six digits. The code field
 * is input-otp with autocomplete="one-time-code" and a numeric keypad. Rate limits and a mail
 * outage come back as honest messages (account-api uiError); resend waits 30 s.
 */
export function EmailCodeForm({ enabled, terms, onResult }: { enabled: boolean; terms: SignInTerms; onResult: (r: ActionResult) => void }) {
  const { tr } = useText()
  const [email, setEmail] = useState('')
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<UiError | null>(null)
  const [ttl, setTtl] = useState(DEFAULT_TTL_S)
  const [resendAt, setResendAt] = useState(0)

  const send = async () => {
    setBusy(true)
    setError(null)
    const r = await startEmail(cloudApi(), { email, ...terms })
    setBusy(false)
    if (!r.ok) return setError(r.error)
    const seconds = typeof r.data.expiresInSeconds === 'number' ? r.data.expiresInSeconds : DEFAULT_TTL_S
    setTtl(seconds)
    setResendAt(Date.now() + RESEND_AFTER_S * 1000)
    setStep('code')
  }
  const verify = async (code: string) => {
    setBusy(true)
    setError(null)
    const r = await verifyEmail(cloudApi(), { email, code, ...terms })
    setBusy(false)
    if (!r.ok) return setError(r.error)
    onResult(r)
  }

  return (
    <div className="space-y-2 border-t border-border pt-4" data-testid="email-signin">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{tr('account.signin.or')}</p>
      {step === 'email' ? (
        <EmailStep enabled={enabled} busy={busy} email={email} setEmail={setEmail} onSubmit={() => void send()} />
      ) : (
        <CodeStep email={email.trim()} ttlMinutes={Math.round(ttl / 60)} resendAt={resendAt} busy={busy} onVerify={(c) => void verify(c)} onResend={() => void send()} onChangeEmail={() => setStep('email')} />
      )}
      <ErrorAlert error={error} />
    </div>
  )
}
