import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import {
  CREDENTIAL_EXAM_FLOOR,
  countPassedSections,
  credentialSpec,
  requiredSectionAliases,
  requiredSectionIds,
  unverifiedRequirements,
} from '@/lib/credential-gates'
import { issuanceBlockers } from '@/lib/credential-blockers'
import { capabilityStatement } from '@/lib/credential-statement'
import { SERVER_VERIFIERS } from '@/lib/credential-verifiers'
import { EDITION_DYNAMIC } from '@/lib/eligibility/types'
import { GRADED_AS_EVIDENCE } from '@/lib/exam-scoring'
import { IS_STATIC_SITE } from '@/lib/runtime-mode'
import { createHmac, randomUUID } from 'crypto'

// ── Server-authoritative credential issuance ──
// This endpoint is the ONLY way to issue a verified credential (Class D).
// It never trusts client-submitted eligibility totals, and signs the badge's own catalog
// version, never the one the request names.

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
  if (!key) {
    // Fail-fast in production: without a real signing key, every issued
    // credential would be signed with the publicly-known dev fallback
    // ('dev-only-key-not-for-production-use', visible in this repo), allowing
    // anyone to forge valid-looking credentials offline. The dynamic LMS must
    // not launch without setting this env var.
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
    // The badge's own catalog entry says what it requires; only capstone credentials qualify.
    const spec = credentialSpec(badgeId)
    if (!spec) {
      return NextResponse.json(
        { error: `Badge ${badgeId} is not a verifiable credential.` },
        { status: 400 }
      )
    }

    // Recompute eligibility from server-side evidence (exam attempts). Attempts are keyed by
    // section slug, so the badge's sections are asked for under every slug they were stored under.
    const examAttempts = await db.examAttempt.findMany({
      where: {
        userId,
        sectionId: { in: requiredSectionAliases(spec) },
        completedAt: { not: null },
        // A score graded before the 2026-09-18 fix may be forged; it is not evidence.
        ...GRADED_AS_EVIDENCE,
      },
    })

    // Fail closed: every requirement, every eligibility-engine gate and every standing blocker
    // refuses the credential until this server shows it passed (credential-blockers.ts). Each
    // required section needs a completed attempt whose best score meets the credential floor, and
    // counts once however many attempts it has; requirements this server does not record
    // (self-checks, You Do, integrator, defense, prerequisites) keep issuance closed, so exam
    // scores alone never earn a credential.
    const requiredSections = requiredSectionIds(spec).length
    const passedSections = countPassedSections(spec, examAttempts)
    const unverified = unverifiedRequirements(spec, Object.keys(SERVER_VERIFIERS))
    const blockers = issuanceBlockers(spec, {
      examAttempts,
      edition: EDITION_DYNAMIC,
      requestedSpecVersion: specificationVersion,
    })
    if (blockers.length > 0) {
      return NextResponse.json(
        {
          error:
            `Credential not issued: ${blockers.map((b) => b.code).join(', ')}. ` +
            `${passedSections} of ${requiredSections} required exams passed with a score of at ` +
            `least ${CREDENTIAL_EXAM_FLOOR}; not yet verifiable on this server: ` +
            `${unverified.join(', ') || 'none'}.`,
          passedSections,
          requiredSections,
          unverifiedRequirements: unverified,
          blockers,
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
      specificationVersion: spec.version,
      credentialClass: 'D',
      capabilityStatement: capabilityStatement(spec),
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
