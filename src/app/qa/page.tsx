import type { Metadata } from 'next'
import { QaSitePage } from '@/components/account/QaSitePage'

export const metadata: Metadata = {
  title: 'Reportes de QA · PyArcana',
  robots: { index: false, follow: false },
}

export default function Page() {
  return <QaSitePage />
}
