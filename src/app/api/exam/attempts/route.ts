import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const sectionId = searchParams.get('sectionId')

  const where: { userId: string; sectionId?: string } = { userId: session.user.id }
  if (sectionId) where.sectionId = sectionId

  const attempts = await db.examAttempt.findMany({
    where,
    orderBy: { attemptNumber: 'asc' },
  })

  return NextResponse.json({ attempts })
}
