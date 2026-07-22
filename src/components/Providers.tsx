'use client'

import { SessionProvider } from 'next-auth/react'
import { IS_STATIC_SITE } from '@/lib/runtime-mode'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider
      session={IS_STATIC_SITE ? null : undefined}
      refetchInterval={0}
      refetchOnWindowFocus={!IS_STATIC_SITE}
    >
      {children}
    </SessionProvider>
  )
}
