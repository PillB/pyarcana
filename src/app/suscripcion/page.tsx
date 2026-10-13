import type { Metadata } from 'next'
import { SuscripcionPage } from '@/components/account/SuscripcionPage'

export const metadata: Metadata = {
  title: 'Cómo funciona la suscripción · PyArcana',
  robots: { index: false, follow: false },
}

/** Prerendered: heading and the way back only; the terms appear after mount where accounts run. */
export default function Page() {
  return <SuscripcionPage />
}
