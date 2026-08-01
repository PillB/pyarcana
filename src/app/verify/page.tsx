'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ShieldCheck, ShieldAlert, Loader2, Search, AlertTriangle } from 'lucide-react'
import { IS_STATIC_SITE } from '@/lib/runtime-mode'

interface VerificationResult {
  valid: boolean
  credentialId?: string
  verificationId?: string
  badgeId?: string
  badgeName?: string
  specificationVersion?: string
  credentialClass?: string
  capabilityStatement?: string
  issuedAt?: string
  issuer?: string
  holderReference?: string
  revocationStatus?: string
  revoked?: boolean
  superseded?: boolean
  revocationReason?: string
  signature?: string
  error?: string
  /** Set by the client when the API is unreachable (static deployment). */
  unavailable?: boolean
  /** Set by the client when the response signature failed re-verification. */
  signatureFailed?: boolean
}

/**
 * Client-side re-verification of the credential signature.
 *
 * The server's /api/credentials/verify endpoint checks the HMAC signature
 * using CREDENTIAL_SIGNING_KEY (server-held). But on the static deployment
 * the endpoint is absent (503), and even on the dynamic deployment a learner
 * with DevTools can intercept the fetch and return a spoofed {valid:true}
 * payload. To make that spoof trivially detectable, we re-check the signature
 * client-side using a PUBLIC verification key (NEXT_PUBLIC_CREDENTIAL_VERIFY_KEY).
 *
 * - If NEXT_PUBLIC_CREDENTIAL_VERIFY_KEY is set, we compute the HMAC of the
 *   returned credential fields (minus signature) and compare to the returned
 *   signature. A spoofed response without a valid signature is flagged.
 * - If the env var is NOT set (e.g. the dynamic LMS hasn't shipped the public
 *   key yet), we cannot re-verify; we mark the result as "unverified by
 *   client" and show a warning banner, but still display the server's verdict
 *   so the page remains usable.
 *
 * Note: HMAC is symmetric, so shipping the verification key to the client
 * effectively ships the signing key too. For true asymmetric integrity, the
 * issuer should switch to Ed25519 (private signs, public verifies). This
 * client-side check is defense-in-depth against naive fetch interception,
 * not a full cryptographic guarantee.
 */
const CLIENT_VERIFY_KEY = process.env.NEXT_PUBLIC_CREDENTIAL_VERIFY_KEY

async function reverifySignature(result: VerificationResult): Promise<boolean | null> {
  if (!result.signature) return null // no signature to check
  if (!CLIENT_VERIFY_KEY) return null // client not configured to re-verify
  try {
    const { signature, valid, revoked, superseded, revocationReason, error, unavailable, signatureFailed, ...rest } = result as any
    const payload = JSON.stringify(rest, Object.keys(rest).sort())
    const enc = new TextEncoder()
    const keyData = await crypto.subtle.importKey(
      'raw',
      enc.encode(CLIENT_VERIFY_KEY),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    const expected = await crypto.subtle.sign('HMAC', keyData, enc.encode(payload))
    const expectedHex = Array.from(new Uint8Array(expected))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
    return expectedHex === signature
  } catch {
    return null
  }
}

function VerifyContent() {
  const searchParams = useSearchParams()
  const initialId = searchParams.get('verificationId') || ''
  const [verificationId, setVerificationId] = useState(initialId)
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [loading, setLoading] = useState(false)

  async function verify() {
    if (!verificationId) return
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch(`/api/credentials/verify?verificationId=${encodeURIComponent(verificationId)}`)
      // Distinguish a 503 (static deployment, endpoint intentionally disabled)
      // from a real network error.
      if (res.status === 503) {
        setResult({
          valid: false,
          unavailable: true,
          error: IS_STATIC_SITE
            ? 'La verificación de credenciales no está disponible en la edición pública (estática). El LMS dinámico no está desplegado. Para verificar una credencial de forma autoritativa, contacta al titular o al equipo de PyArcana para obtener la URL del LMS dinámico.'
            : 'El servicio de verificación no está disponible en este momento.',
        })
        return
      }
      const data: VerificationResult = await res.json()
      // Re-verify the signature client-side if the server returned one.
      if (data.valid && data.signature) {
        const ok = await reverifySignature(data)
        if (ok === false) {
          data.signatureFailed = true
        }
      }
      setResult(data)
    } catch {
      setResult({
        valid: false,
        unavailable: true,
        error:
          'No se pudo contactar al servicio de verificación (error de red). ' +
          'Si estás viendo esto en la edición pública (pillb.github.io/pyarcana), ' +
          'el LMS dinámico no está desplegado y la verificación no está disponible. ' +
          'Importante: un resultado mostrado en esta página NO puede considerarse ' +
          'válido si la petición fue interceptada (p. ej. con DevTools o una ' +
          'extensión). Para verificar una credencial de forma autoritativa, ' +
          'visita la URL del LMS dinámico directamente o contacta al equipo de PyArcana.',
      })
    } finally {
      setLoading(false)
    }
  }

  const showStaticWarning = IS_STATIC_SITE && !result

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight">Verificación de credencial</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Ingresa el ID de verificación para comprobar la validez de una credencial PyArcana.
      </p>

      {showStaticWarning && (
        <div className="mt-4 flex items-start gap-2 rounded-md border border-amber-500/40 bg-amber-500/5 p-3 text-xs text-amber-700 dark:text-amber-300">
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <div>
            <p className="font-semibold">Edición pública (estática)</p>
            <p className="mt-1">
              Estás en la edición pública de GitHub Pages. El endpoint de
              verificación (<code>/api/credentials/verify</code>) no está
              desplegado aquí, por lo que cualquier intento mostrará un error
              de red. Para una verificación autoritativa, usa la URL del LMS
              dinámico.
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 flex gap-2">
        <Input
          type="text"
          placeholder="verify_..."
          value={verificationId}
          onChange={(e) => setVerificationId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && verify()}
          className="flex-1"
          aria-label="ID de verificación"
        />
        <Button onClick={verify} disabled={loading || !verificationId}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Verificar
        </Button>
      </div>

      {result && (
        <Card className="mt-6 p-6">
          {result.signatureFailed && (
            <div className="mb-4 flex items-start gap-2 rounded-md border border-rose-500/40 bg-rose-500/5 p-3 text-xs text-rose-700 dark:text-rose-300">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <div>
                <p className="font-semibold">Firma no válida</p>
                <p className="mt-1">
                  La respuesta del servidor no pasó la verificación criptográfica
                  client-side. Esto puede indicar que la petición fue
                  interceptada y la respuesta falsificada. NO confíes en este
                  resultado.
                </p>
              </div>
            </div>
          )}
          {result.valid ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-emerald-600" />
                <span className="text-lg font-semibold text-emerald-700 dark:text-emerald-400">
                  Credencial válida
                </span>
                <Badge variant="outline" className="ml-auto">
                  Clase {result.credentialClass}
                </Badge>
              </div>
              <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                <div><dt className="font-semibold">Insignia:</dt><dd>{result.badgeName}</dd></div>
                <div><dt className="font-semibold">Especificación:</dt><dd>v{result.specificationVersion}</dd></div>
                <div><dt className="font-semibold">Emisor:</dt><dd>{result.issuer}</dd></div>
                <div><dt className="font-semibold">Emitida:</dt><dd>{result.issuedAt ? new Date(result.issuedAt).toLocaleDateString() : '-'}</dd></div>
                <div><dt className="font-semibold">Estado:</dt><dd>{result.revocationStatus}</dd></div>
                <div><dt className="font-semibold">Titular:</dt><dd className="font-mono text-xs">{result.holderReference}</dd></div>
              </dl>
              <div className="rounded-md border border-border bg-muted/30 p-3 text-sm">
                <p className="font-semibold">Capacidad demostrada:</p>
                <p className="mt-1 text-muted-foreground">{result.capabilityStatement}</p>
              </div>
              {!CLIENT_VERIFY_KEY && (
                <p className="text-xs text-muted-foreground">
                  Nota: la firma no fue re-verificada en el cliente (clave
                  pública de verificación no configurada). Para máxima
                  confianza, verifica directamente en el LMS dinámico.
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {result.unavailable ? (
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                ) : (
                  <ShieldAlert className="h-6 w-6 text-rose-600" />
                )}
                <span className={`text-lg font-semibold ${result.unavailable ? 'text-amber-700 dark:text-amber-400' : 'text-rose-700 dark:text-rose-400'}`}>
                  {result.unavailable
                    ? 'Servicio no disponible'
                    : result.revoked
                    ? 'Credencial revocada'
                    : result.superseded
                    ? 'Credencial reemplazada'
                    : 'No válida'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {result.error || result.revocationReason || 'La credencial no se encontró o no es válida.'}
              </p>
              {result.badgeName && (
                <p className="text-sm">Insignia: {result.badgeName} (emitida: {result.issuedAt})</p>
              )}
            </div>
          )}
        </Card>
      )}
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-2xl px-4 py-8">Cargando...</div>}>
      <VerifyContent />
    </Suspense>
  )
}

