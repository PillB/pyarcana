import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { renameSectionId, sectionIdAliases } from '@/lib/section-id-migrations'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  // An old bookmark or tab can still ask by the pre-rename slug.
  const rawSectionId = searchParams.get('sectionId')
  const sectionId = rawSectionId ? renameSectionId(rawSectionId) : null

  const where: { userId: string; sectionId?: { in: string[] } } = { userId: session.user.id }
  // Attempts stored under a pre-rename slug are the same section's attempts.
  if (sectionId) where.sectionId = { in: sectionIdAliases(sectionId) }

  const attempts = await db.examAttempt.findMany({
    where,
    orderBy: { attemptNumber: 'asc' },
  })

  return NextResponse.json({ attempts })
}
