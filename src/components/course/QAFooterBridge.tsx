'use client'

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
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
    // The open section's id, number and title come from the element SectionView
    // renders. Importing the course to look them up put all 52 sections, 6.1 MB
    // of chunk, into the root layout, so every route downloaded the whole
    // course: /cookies, /privacy, /verify and the 404 page included.
    const root = document.querySelector<HTMLElement>('[data-section-id]')
    const hashId = window.location.hash.slice(1).split('/')[0] || null
    const rawId = root?.dataset.sectionId || hashId
    const index = Number(root?.dataset.sectionIndex)
    const activeTab = document.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]')
    const activeSubStep = activeTab?.dataset.testid?.replace(/^.*tab-/, '')
      || activeTab?.textContent?.trim().replace(/\s+/g, ' ')
      || null

    setContext((current) => {
      const next: LiveQaContext = {
        sectionId: rawId,
        // Only a rendered section carries these. A hash pointing at one that
        // has not rendered yet reports the id alone, and the observer below
        // fills the rest in as soon as it does.
        sectionIndex: Number.isFinite(index) && index > 0 ? index : null,
        sectionTitle: root?.dataset.sectionTitle || null,
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
