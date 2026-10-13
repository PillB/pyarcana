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
}

// The signature is checked on the server only (ADR 5, docs/implementation/ADRS.md): it is an
// HMAC, so the key that would check it here is the key that signs it, and a NEXT_PUBLIC_ key is
// inlined into the bundle. This page shows the server's verdict.

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
        <div className="mt-4 flex items-start gap-2 rounded-md border border-amber-500/40 bg-amber-500/5 p-3 text-xs text-amber-800 dark:text-amber-300">
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
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {result.unavailable ? (
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                ) : (
                  <ShieldAlert className="h-6 w-6 text-rose-600" />
                )}
                <span className={`text-lg font-semibold ${result.unavailable ? 'text-amber-800 dark:text-amber-400' : 'text-rose-700 dark:text-rose-400'}`}>
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

