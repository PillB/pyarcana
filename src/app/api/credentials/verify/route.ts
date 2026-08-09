import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { IS_STATIC_SITE } from '@/lib/runtime-mode'
import { createHmac, timingSafeEqual } from 'crypto'

// ── Public credential verification endpoint ──
// Anyone can verify a credential by its verificationId.
// This endpoint does NOT require authentication — it's public.

function getSigningKey(): string {
  const key = process.env.CREDENTIAL_SIGNING_KEY
  if (!key) {
    // Fail-fast in production: a missing signing key means the verify endpoint
    // cannot authoritatively check any credential signature. Returning the
    // historical dev fallback would silently accept forged credentials if the
    // dynamic LMS ever launched without the env var set.
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'CREDENTIAL_SIGNING_KEY must be set in production. The dev fallback ' +
          'was removed to prevent credential forgery on misconfigured deploys.'
      )
    }
    return 'dev-only-key-not-for-production-use'
  }
  return key
}

function verifySignature(credential: any): boolean {
  const { signature, ...rest } = credential
  if (typeof signature !== 'string' || !signature) return false
  const payload = JSON.stringify(rest, Object.keys(rest).sort())
  const expected = createHmac('sha256', getSigningKey()).update(payload).digest('hex')
  // Constant-time comparison to prevent timing attacks that could leak
  // information about the expected signature byte-by-byte.
  const a = Buffer.from(signature, 'hex')
  const b = Buffer.from(expected, 'hex')
  if (a.length !== b.length || a.length === 0) return false
  return timingSafeEqual(a, b)
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

  // Validate the verificationId format strictly. IDs are `verify_` + 16 hex
  // chars (64 bits entropy) — see issue/route.ts:118. Reject anything else to
  // (a) prevent substring-match IDOR (a short/guessable prefix could match
  // multiple credentials via the previous `body: { contains: verificationId }`
  // query) and (b) make enumeration infeasible.
  if (!/^verify_[a-f0-9]{16}$/.test(verificationId)) {
    return NextResponse.json(
      { valid: false, error: 'Invalid verificationId format.' },
      { status: 400 }
    )
  }

  try {
    // Look up the credential by exact match on the verificationId within the
    // notification body. The previous `contains` substring search could return
    // the wrong record if one credential's verificationId happened to be a
    // substring of another's body (e.g. a `verify_a...` prefix shared across
    // many records). We now also filter by an exact JSON-path match client-side
    // as defense-in-depth, since Prisma's JSON `contains` is the only
    // server-side filter available without a schema migration.
    const records = await db.notification.findMany({
      where: {
        type: 'credential_issued',
        body: { contains: verificationId },
      },
    })

    // Find the record whose parsed credential.verificationId is an EXACT match.
    // This closes the substring-IDOR: even if `contains` returns multiple
    // candidates, we only accept the one whose actual field equals the input.
    let record = records[0]
    let credential: any
    for (const r of records) {
      try {
        const parsed = JSON.parse(r.body)
        if (parsed.verificationId === verificationId) {
          record = r
          credential = parsed
          break
        }
      } catch {
        continue
      }
    }

    if (!credential) {
      return NextResponse.json(
        { valid: false, error: 'Credential not found.' },
        { status: 404 }
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

    // Return public-safe verification record. The client re-verifies the
    // signature if one is present in the response (defense against fetch
    // interception on the static /verify page).
    return NextResponse.json({
      valid: true,
      credentialId: credential.credentialId,
      verificationId: credential.verificationId,
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
      // Include the signature so a security-conscious verifier (e.g. an
      // employer's own tooling, or a hardened /verify page) can re-validate
      // the credential against the issuer's published public key. The
      // symmetric HMAC key itself is never exposed.
      signature: credential.signature,
    })
  } catch (error) {
    console.error('Credential verification error:', error)
    return NextResponse.json(
      { valid: false, error: 'Failed to verify credential.' },
      { status: 500 }
    )
  }
}
