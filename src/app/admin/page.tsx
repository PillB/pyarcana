import type { Metadata } from 'next'
import { AdminPage } from '@/components/account/admin/AdminPage'

export const metadata: Metadata = {
  title: 'Administración · PyArcana',
  robots: { index: false, follow: false },
}

export default function Page() {
  return <AdminPage />
}
