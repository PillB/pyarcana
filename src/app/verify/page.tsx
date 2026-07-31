'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ShieldCheck, ShieldAlert, Loader2, Search } from 'lucide-react'

interface VerificationResult {
  valid: boolean
  credentialId?: string
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
  error?: string
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
      const data = await res.json()
      setResult(data)
    } catch {
      setResult({ valid: false, error: 'Network error. The dynamic LMS may not be deployed.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight">Verificación de credencial</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Ingresa el ID de verificación para comprobar la validez de una credencial PyArcana.
      </p>

      <div className="mt-6 flex gap-2">
        <Input
          type="text"
          placeholder="verify_..."
          value={verificationId}
          onChange={(e) => setVerificationId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && verify()}
          className="flex-1"
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
                <ShieldAlert className="h-6 w-6 text-rose-600" />
                <span className="text-lg font-semibold text-rose-700 dark:text-rose-400">
                  {result.revoked ? 'Credencial revocada' : result.superseded ? 'Credencial reemplazada' : 'No válida'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
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

