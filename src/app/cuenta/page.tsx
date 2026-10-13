import type { Metadata } from 'next'
import { AccountPage } from '@/components/account/AccountPage'

export const metadata: Metadata = {
  title: 'Tu cuenta · PyArcana',
  robots: { index: false, follow: false },
}

/**
 * The Microsoft sign-in callback and the checkout return (DESIGN-v3 §B, DESIGN-v2 §8.9). The
 * prerendered page holds only the heading and the way back; everything else is client-side.
 */
export default function CuentaPage() {
  return <AccountPage />
}
