'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { IS_STATIC_SITE } from '@/lib/runtime-mode'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider
      session={IS_STATIC_SITE ? null : undefined}
      refetchInterval={0}
      refetchOnWindowFocus={!IS_STATIC_SITE}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
  )
}
