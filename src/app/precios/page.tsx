import type { Metadata } from 'next'
import { PreciosPage } from '@/components/account/PreciosPage'

export const metadata: Metadata = {
  title: 'Precios · PyArcana',
  robots: { index: false, follow: false },
}

/** Prerendered: heading and the way back only; prices appear after mount where accounts run. */
export default function Page() {
  return <PreciosPage />
}
