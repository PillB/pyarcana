'use client'

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import { COURSE_SECTIONS } from '@/lib/course'
import { QAHarness } from './QAHarness'

interface LiveQaContext {
  sectionId: string | null
  sectionIndex: number | null
  sectionTitle: string | null
  activeSubStep: string | null
}

const EMPTY: LiveQaContext = {
  sectionId: null,
  sectionIndex: null,
  sectionTitle: null,
  activeSubStep: null,
}

const subscribeHydration = () => () => undefined

export function QAFooterBridge() {
  const [context, setContext] = useState<LiveQaContext>(EMPTY)
  const hydrated = useSyncExternalStore(subscribeHydration, () => true, () => false)

  const readContext = useCallback(() => {
    const root = document.querySelector<HTMLElement>('[data-section-id]')
    const hashId = window.location.hash.slice(1).split('/')[0] || null
    const rawId = root?.dataset.sectionId || hashId
    const section = rawId
      ? COURSE_SECTIONS.find((item) => item.id === rawId || `S${String(item.index).padStart(2, '0')}`.toLowerCase() === rawId.toLowerCase())
      : null
    const activeTab = document.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]')
    const activeSubStep = activeTab?.dataset.testid?.replace(/^.*tab-/, '')
      || activeTab?.textContent?.trim().replace(/\s+/g, ' ')
      || null

    setContext((current) => {
      const next: LiveQaContext = {
        sectionId: section?.id ?? rawId,
        sectionIndex: section?.index ?? null,
        sectionTitle: section?.shortTitle ?? section?.title ?? null,
        activeSubStep,
      }
      if (
        current.sectionId === next.sectionId
        && current.sectionIndex === next.sectionIndex
        && current.sectionTitle === next.sectionTitle
        && current.activeSubStep === next.activeSubStep
      ) return current
      return next
    })
  }, [])

  useEffect(() => {
    // DOM-derived course context is an external-system synchronization. Defer
    // the first read to the next animation frame so the effect only installs
    // subscriptions synchronously and React does not cascade a render from the
    // effect body itself.
    const initialFrame = window.requestAnimationFrame(readContext)
    window.addEventListener('hashchange', readContext)
    const observer = new MutationObserver(readContext)
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['aria-selected', 'data-section-id'],
    })
    return () => {
      window.cancelAnimationFrame(initialFrame)
      window.removeEventListener('hashchange', readContext)
      observer.disconnect()
    }
  }, [readContext])

  if (!hydrated) {
    return <div className="border-t border-border/50 bg-muted/20 py-1.5" aria-hidden="true" />
  }

  return (
    <div className="border-t border-border/50 bg-muted/20 py-1.5 text-center" data-testid="qa-footer-bridge">
      <QAHarness
        sectionId={context.sectionId}
        sectionIndex={context.sectionIndex}
        sectionTitle={context.sectionTitle}
        activeSubStep={context.activeSubStep}
      />
    </div>
  )
}
