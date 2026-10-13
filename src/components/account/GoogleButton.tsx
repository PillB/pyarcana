'use client'

import { useEffect, useRef, useState } from 'react'
import { CLOUD_CONFIG } from '@/lib/cloud/config'
import { GIS_SRC, browserScriptHost, createScriptLoader, gisButtonOptions, gisInitOptions, makeNonce, type GisInitOptions } from '@/lib/cloud/oidc'
import { gisAllowedThisPageView } from './runtime'
import { useText } from './text'
import { ERROR_ALERT_CLASS } from '@/components/account/a11y'

interface GisId {
  initialize(options: GisInitOptions): void
  renderButton(parent: HTMLElement, options: ReturnType<typeof gisButtonOptions>): void
}

function gisId(): GisId | null {
  const g = (window as unknown as { google?: { accounts?: { id?: GisId } } }).google
  return g?.accounts?.id ?? null
}

let loader: ReturnType<typeof createScriptLoader> | null = null
export function scriptLoader() {
  loader = loader ?? createScriptLoader(browserScriptHost())
  return loader
}

/**
 * The Google Identity Services rendered button, popup mode with a callback (DESIGN-v3 §B). The
 * script loads when this mounts, never on the Microsoft callback route. Each credential gets a
 * fresh nonce: the preimage stays here and goes to the worker with the token, and the button is
 * re-initialised so a second attempt never replays a used nonce. `enabled` false makes the whole
 * button inert (the age box is not ticked yet).
 */
export function GoogleButton({ enabled, onToken }: { enabled: boolean; onToken: (idToken: string, noncePreimage: string) => void }) {
  const { tr, lang } = useText()
  const box = useRef<HTMLDivElement>(null)
  const onTokenRef = useRef(onToken)
  // Decided at page load (runtime.ts), not now: AccountPage may already have stripped the fragment.
  const [allowed] = useState(gisAllowedThisPageView)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    onTokenRef.current = onToken
  }, [onToken])

  useEffect(() => {
    if (!allowed) return
    let cancelled = false
    const setup = async (): Promise<void> => {
      await scriptLoader().load(GIS_SRC)
      const { preimage, nonce } = await makeNonce()
      const gis = gisId()
      if (cancelled || !gis || !box.current) return
      const callback = (response: { credential?: string }) => {
        if (response.credential) onTokenRef.current(response.credential, preimage)
        void setup().catch(() => setFailed(true))
      }
      gis.initialize(gisInitOptions({ clientId: CLOUD_CONFIG.googleClientId, nonce, callback }))
      gis.renderButton(box.current, gisButtonOptions(lang))
    }
    setup().catch(() => {
      if (!cancelled) setFailed(true)
    })
    return () => {
      cancelled = true
    }
  }, [allowed, lang])

  if (!allowed) return <p className="text-xs text-muted-foreground">{tr('account.signin.googleHere')}</p>
  if (failed) return <p role="alert" className={ERROR_ALERT_CLASS}>{tr('account.signin.googleFailed')}</p>
  return (
    <div inert={!enabled} className={enabled ? 'min-h-10' : 'min-h-10 opacity-50'} data-testid="google-signin">
      <div ref={box} />
    </div>
  )
}
