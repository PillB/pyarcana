'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { CLOUD_CONFIG } from '@/lib/cloud/config'
import { beginMicrosoft, microsoftRedirectUri, type MicrosoftPurpose } from '@/lib/cloud/oidc'
import { signInGoogle, type ActionResult, type UiError } from '@/lib/cloud/account-api'
import { peekIntent } from '@/lib/cloud/intent'
import { safeSessionStorage } from '@/lib/cloud/storage'
import type { MePayload } from '@/lib/cloud/session'
import { ErrorAlert } from './Alerts'
import { EmailCodeForm } from './EmailCodeForm'
import { GoogleButton } from './GoogleButton'
import { cloudApi, loadAuthMethods, useAuthMethods, type AuthMethods } from './runtime'
import { useText } from './text'

export function MicrosoftLogo() {
  return (
    <svg viewBox="0 0 21 21" width="16" height="16" aria-hidden="true" focusable="false">
      <rect x="1" y="1" width="9" height="9" fill="#f25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
      <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
      <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
    </svg>
  )
}

/** Full-page redirect to Microsoft (code + PKCE); /cuenta completes it. */
export function MicrosoftButton({ enabled, purpose, label }: { enabled: boolean; purpose: MicrosoftPurpose; label: string }) {
  const { tr } = useText()
  const [error, setError] = useState<UiError | null>(null)
  const start = async () => {
    const redirectUri = microsoftRedirectUri(CLOUD_CONFIG.canonicalOrigin)
    if (!redirectUri) return setError({ key: 'account.error.unavailable' })
    const here = window.location.pathname + window.location.search + window.location.hash
    const { url } = await beginMicrosoft(safeSessionStorage(), {
      authority: CLOUD_CONFIG.microsoftAuthority,
      clientId: CLOUD_CONFIG.microsoftClientId,
      redirectUri,
      nowMs: Date.now(),
      returnTo: here,
      purpose,
    })
    window.location.assign(url)
  }
  return (
    <div className="space-y-1">
      <Button type="button" variant="outline" className="w-full justify-start gap-3" disabled={!enabled} onClick={() => void start()}>
        <MicrosoftLogo />
        {label}
      </Button>
      <p className="text-xs text-muted-foreground">{tr('account.signin.microsoftHint')}</p>
      <ErrorAlert error={error} />
    </div>
  )
}

function TermsLine() {
  const { tr } = useText()
  const link = 'font-medium text-foreground underline underline-offset-2'
  return (
    <p className="text-xs text-muted-foreground">
      {tr('account.signin.termsPrefix')}{' '}
      <Link href="/terms" target="_blank" rel="noopener" className={link}>{tr('account.signin.termsLink')}</Link>{' '}
      {tr('account.signin.and')}{' '}
      <Link href="/privacy" target="_blank" rel="noopener" className={link}>{tr('account.signin.privacyLink')}</Link>.
    </p>
  )
}

function MethodsState({ methods }: { methods: AuthMethods }) {
  const { tr } = useText()
  if (methods.state === 'idle' || methods.state === 'loading') return <p role="status" className="text-sm text-muted-foreground">{tr('account.signin.loading')}</p>
  if (methods.state === 'failed') return <ErrorAlert error={{ key: 'account.error.unavailable' }} />
  const none = !methods.google && !methods.microsoft && !methods.email
  return none ? <p role="status" className="text-sm text-muted-foreground">{tr('account.signin.noMethods')}</p> : null
}

/**
 * Google first, Microsoft second, email code third (DESIGN-v2 §8.8, v3 §B). Every option stays
 * disabled until the learner confirms the age of consent (14 in Peru); the terms and privacy
 * links sit above the buttons.
 */
export function SignInPanel({ onSignedIn }: { onSignedIn: (me: MePayload) => void }) {
  const { tr } = useText()
  const methods = useAuthMethods()
  const [age, setAge] = useState(false)
  const [error, setError] = useState<UiError | null>(null)
  const [intent] = useState(() => peekIntent(safeSessionStorage(), Date.now()))
  const terms = { ageConfirmed: age, termsVersion: CLOUD_CONFIG.termsVersion }

  useEffect(() => {
    void loadAuthMethods()
  }, [])

  const finish = (r: ActionResult) => {
    if (r.ok && r.me) return onSignedIn(r.me)
    setError(r.ok ? { key: 'account.error.unavailable' } : r.error)
  }
  const onGoogle = async (idToken: string, noncePreimage: string) => finish(await signInGoogle(cloudApi(), { idToken, noncePreimage, ...terms }))

  if (!CLOUD_CONFIG.termsVersion) return <p role="status" className="text-sm">{tr('account.signin.notReady')}</p>
  return (
    <div className="space-y-4" data-testid="signin-panel">
      {intent && <p className="rounded-md bg-primary/10 px-3 py-2 text-sm">{tr('account.signin.trialIntent')}</p>}
      <div className="flex items-center gap-2">
        <Checkbox id="account-age" checked={age} onCheckedChange={(v) => setAge(v === true)} />
        <Label htmlFor="account-age">{tr('account.signin.age')}</Label>
      </div>
      <TermsLine />
      <MethodsState methods={methods} />
      {!age && methods.state === 'ok' && <p className="text-xs text-muted-foreground">{tr('account.signin.ageFirst')}</p>}
      {methods.google && <GoogleButton enabled={age} onToken={(t, p) => void onGoogle(t, p)} />}
      {methods.microsoft && <MicrosoftButton enabled={age} purpose="signin" label={tr('account.signin.microsoft')} />}
      {methods.email && <EmailCodeForm enabled={age} terms={terms} onResult={finish} />}
      <ErrorAlert error={error} />
    </div>
  )
}
