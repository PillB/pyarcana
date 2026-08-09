import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Query logging is development-only. In production, logging every query:
//   - Leaks query structure to anyone with log access
//   - Degrades performance (every query serializes to a log line)
//   - Can accidentally log parameter values (PII risk)
// Only enable query logging when NODE_ENV !== 'production'.
const logConfig: ('query' | 'info' | 'warn' | 'error')[] =
  process.env.NODE_ENV === 'production' ? ['warn', 'error'] : ['query', 'warn', 'error']

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: logConfig,
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db