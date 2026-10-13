'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { newQaSession, QA_SESSION_KEY, readQaSession, tickQaSession, TICK_MS, type QaSessionStats } from '@/lib/qa-session-stats'
import { QA_MODE_KEY } from '@/lib/cloud/qa-mode'

function tabStorage(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.sessionStorage
  } catch {
    return null
  }
}

function qaModeOn(): boolean {
  try {
    return (JSON.parse(window.localStorage.getItem(QA_MODE_KEY) ?? 'null') as { testMode?: boolean } | null)?.testMode === true
  } catch {
    return false
  }
}

/**
 * This tab's QA session (src/lib/qa-session-stats.ts): started by opening the workspace or by QA
 * mode, ticked every TICK_MS while the page is attended, kept in sessionStorage so a reload keeps
 * counting. Nothing runs until a session exists.
 */
export function useQaSessionStats(sectionId: string | null, deploymentSha: string | null): { stats: QaSessionStats | null; start: () => void } {
  const [stats, setStats] = useState<QaSessionStats | null>(() => readQaSession(tabStorage()?.getItem(QA_SESSION_KEY) ?? null))
  const lastInput = useRef(Date.now())
  const section = useRef(sectionId)
  section.current = sectionId

  const start = useCallback(() => {
    setStats((current) => {
      if (current) return current
      const next = newQaSession(Date.now(), navigator.userAgent, deploymentSha)
      try {
        tabStorage()?.setItem(QA_SESSION_KEY, JSON.stringify(next))
      } catch {
        // A full or blocked sessionStorage only loses the count across reloads.
      }
      return next
    })
  }, [deploymentSha])

  useEffect(() => {
    if (!stats && qaModeOn()) start()
  }, [stats, start])

  const running = stats !== null
  useEffect(() => {
    if (!running) return
    const onInput = () => {
      lastInput.current = Date.now()
    }
    const events = ['keydown', 'pointerdown', 'wheel', 'scroll', 'touchstart'] as const
    for (const e of events) window.addEventListener(e, onInput, { passive: true, capture: true })
    const timer = window.setInterval(() => {
      setStats((current) => {
        if (!current) return current
        const next = tickQaSession(current, {
          now: Date.now(),
          visible: document.visibilityState === 'visible',
          focused: document.hasFocus(),
          lastInputAt: lastInput.current,
          sectionId: section.current,
        })
        try {
          tabStorage()?.setItem(QA_SESSION_KEY, JSON.stringify(next))
        } catch {
          // As above: only the count across reloads is at stake.
        }
        return next
      })
    }, TICK_MS)
    return () => {
      window.clearInterval(timer)
      for (const e of events) window.removeEventListener(e, onInput, { capture: true })
    }
  }, [running])

  return { stats, start }
}
