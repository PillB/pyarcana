import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { IS_STATIC_SITE } from '@/lib/runtime-mode'
import { createHmac } from 'crypto'

// ── Public credential verification endpoint ──
// Anyone can verify a credential by its verificationId.
// This endpoint does NOT require authentication — it's public.

function getSigningKey(): string {
  const key = process.env.CREDENTIAL_SIGNING_KEY
  if (!key) return 'dev-only-key-not-for-production-use'
  return key
}

function verifySignature(credential: any): boolean {
  const { signature, ...rest } = credential
  if (!signature) return false
  const payload = JSON.stringify(rest, Object.keys(rest).sort())
  const expected = createHmac('sha256', getSigningKey()).update(payload).digest('hex')
  return signature === expected
}

export async function GET(req: NextRequest) {
  if (IS_STATIC_SITE) {
    return NextResponse.json(
      { error: 'Credential verification requires the dynamic LMS.' },
      { status: 503 }
    )
  }

  const verificationId = req.nextUrl.searchParams.get('verificationId')
  if (!verificationId) {
    return NextResponse.json(
      { error: 'verificationId query parameter is required.' },
      { status: 400 }
    )
  }

  try {
    // Search Notifications for the credential by verificationId
    const records = await db.notification.findMany({
      where: {
        type: 'credential_issued',
        body: { contains: verificationId },
      },
    })

    if (records.length === 0) {
      return NextResponse.json(
        { valid: false, error: 'Credential not found.' },
        { status: 404 }
      )
    }

    const record = records[0]
    let credential: any
    try {
      credential = JSON.parse(record.body)
    } catch {
      return NextResponse.json(
        { valid: false, error: 'Invalid credential record.' },
        { status: 500 }
      )
    }

    // Verify the signature
    const signatureValid = verifySignature(credential)
    if (!signatureValid) {
      return NextResponse.json(
        { valid: false, error: 'Credential signature is invalid.' },
        { status: 403 }
      )
    }

    // Check revocation status
    if (credential.revocationStatus === 'revoked') {
      return NextResponse.json({
        valid: false,
        revoked: true,
        revocationReason: credential.revocationReason || 'No reason provided.',
        badgeId: credential.badgeId,
        badgeName: credential.badgeName,
        issuedAt: credential.issuedAt,
      })
    }

    // Check supersession
    if (credential.revocationStatus === 'superseded') {
      return NextResponse.json({
        valid: false,
        superseded: true,
        supersededBy: credential.supersedingVersion,
        badgeId: credential.badgeId,
        badgeName: credential.badgeName,
        issuedAt: credential.issuedAt,
      })
    }

    // Return public-safe verification record
    return NextResponse.json({
      valid: true,
      credentialId: credential.credentialId,
      badgeId: credential.badgeId,
      badgeName: credential.badgeName,
      specificationVersion: credential.specificationVersion,
      credentialClass: credential.credentialClass,
      capabilityStatement: credential.capabilityStatement,
      issuedAt: credential.issuedAt,
      expiresAt: credential.expiresAt,
      revocationStatus: credential.revocationStatus,
      issuer: credential.issuer,
      holderReference: credential.holderReference,
    })
  } catch (error) {
    console.error('Credential verification error:', error)
    return NextResponse.json(
      { valid: false, error: 'Failed to verify credential.' },
      { status: 500 }
    )
  }
}
