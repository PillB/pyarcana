import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { syncFeedbackReport } from '@/lib/firebase/sync'

const STATUSES = [
  'NEW',
  'REVIEWING',
  'PLANNED',
  'DONE',
  'WONTFIX',
  'DUPLICATE',
] as const

const patchSchema = z.object({
  status: z.enum(STATUSES).optional(),
  adminNote: z.string().trim().max(2000).optional().nullable(),
})

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const { id } = await context.params
  const body = await request.json()
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  const existing = await db.feedbackReport.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  }

  const updated = await db.feedbackReport.update({
    where: { id },
    data: {
      ...(parsed.data.status ? { status: parsed.data.status } : {}),
      ...(parsed.data.adminNote !== undefined
        ? { adminNote: parsed.data.adminNote }
        : {}),
    },
  })

  void syncFeedbackReport(updated)

  return NextResponse.json({ item: updated })
}
