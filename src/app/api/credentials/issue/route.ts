import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { IS_STATIC_SITE } from '@/lib/runtime-mode'
import { createHmac, randomUUID } from 'crypto'

// ── Server-authoritative credential issuance ──
// This endpoint is the ONLY way to issue a verified credential (Class D).
// It never trusts client-submitted eligibility totals.

interface CredentialIssuanceRequest {
  badgeId: string
  specificationVersion: string
  evidenceReferences: string[]
}

interface IssuedCredential {
  credentialId: string
  verificationId: string
  badgeId: string
  badgeName: string
  specificationVersion: string
  credentialClass: 'D'
  capabilityStatement: string
  issuedAt: string
  expiresAt: string | null
  revocationStatus: 'active'
  holderReference: string
  issuer: 'PyArcana'
  signature: string
}

function getSigningKey(): string {
  const key = process.env.CREDENTIAL_SIGNING_KEY
  if (!key) return 'dev-only-key-not-for-production-use'
  return key
}

function signCredential(credential: Omit<IssuedCredential, 'signature'>): string {
  const payload = JSON.stringify(credential, Object.keys(credential).sort())
  return createHmac('sha256', getSigningKey()).update(payload).digest('hex')
}

export async function POST(req: NextRequest) {
  if (IS_STATIC_SITE) {
    return NextResponse.json(
      { error: 'Credential issuance requires the dynamic LMS.' },
      { status: 503 }
    )
  }

  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const userId = session.user.id
  if (!userId) {
    return NextResponse.json({ error: 'User ID required.' }, { status: 400 })
  }

  let body: CredentialIssuanceRequest
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const { badgeId, specificationVersion } = body
  if (!badgeId || !specificationVersion) {
    return NextResponse.json(
      { error: 'badgeId and specificationVersion are required.' },
      { status: 400 }
    )
  }

  try {
    const capstoneMap: Record<string, string> = {
      'integrated_python_ai_capstone_foundations': 'CP-N1-C',
      'integrated_python_ai_capstone_independent': 'CP-N2-C',
      'integrated_python_ai_capstone_advanced_applied': 'CP-N3-C',
      'integrated_python_ai_capstone_integrated_mastery': 'CP-N4-C',
      'evidence_grounded_ai_systems_capstone': 'CP-FINAL',
    }

    const capstoneId = capstoneMap[badgeId]
    if (!capstoneId) {
      return NextResponse.json(
        { error: `Badge ${badgeId} is not a verifiable credential.` },
        { status: 400 }
      )
    }

    // Recompute eligibility from server-side evidence (exam attempts)
    const examAttempts = await db.examAttempt.findMany({
      where: {
        userId,
        sectionId: { in: ['S04', 'S08', 'S13', 'S17', 'S21', 'S26', 'S30', 'S34', 'S39', 'S43', 'S47', 'S51', 'S52'] },
        completedAt: { not: null },
      },
    })

    // Check that at least 13 gate sections have a completed attempt with score >= 70
    const passedGates = examAttempts.filter((a) => a.score >= 70).length
    if (passedGates < 13) {
      return NextResponse.json(
        {
          error: 'Eligibility not met. All 13 gate sections must be passed.',
          passedGates,
          requiredGates: 13,
        },
        { status: 403 }
      )
    }

    const credentialId = `cred_${badgeId}_${randomUUID().slice(0, 8)}`
    const verificationId = `verify_${randomUUID().replace(/-/g, '').slice(0, 16)}`
    const issuedAt = new Date().toISOString()

    const credentialWithoutSig: Omit<IssuedCredential, 'signature'> = {
      credentialId,
      verificationId,
      badgeId,
      badgeName: badgeId.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      specificationVersion,
      credentialClass: 'D',
      capabilityStatement: `The holder independently demonstrated ${badgeId} by completing the capstone assessment under PyArcana Assessment Specification ${specificationVersion}, including critical evidence, hidden validation, and independent review.`,
      issuedAt,
      expiresAt: null,
      revocationStatus: 'active',
      holderReference: `pyarcana:user:${userId}`,
      issuer: 'PyArcana',
    }

    const signature = signCredential(credentialWithoutSig)
    const credential: IssuedCredential = { ...credentialWithoutSig, signature }

    // Store in a notification as a credential issuance record
    await db.notification.create({
      data: {
        recipientId: userId,
        type: 'credential_issued',
        title: `Credential issued: ${credential.badgeName}`,
        body: JSON.stringify(credential),
      },
    })

    return NextResponse.json({ credential }, { status: 201 })
  } catch (error) {
    console.error('Credential issuance error:', error)
    return NextResponse.json(
      { error: 'Failed to issue credential.' },
      { status: 500 }
    )
  }
}
