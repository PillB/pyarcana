import type { Metadata } from 'next'
import { LegalPageShell } from '@/components/legal/LegalPageShell'
import { CloudLegalSection } from '@/components/account/CloudLegalSection'
import { AccountEditionPrivacy } from '@/components/legal/privacy/AccountEditionPrivacy'
import { DynamicEditionPrivacy } from '@/components/legal/privacy/DynamicEditionPrivacy'
import { PagesEditionPrivacy } from '@/components/legal/privacy/PagesEditionPrivacy'
import { CLOUD_CONFIG } from '@/lib/cloud/config'
import { adSharingClaimHolds } from '@/lib/cloud/legal-content'
import { IS_STATIC_SITE } from '@/lib/runtime-mode'

export const metadata: Metadata = {
  title: 'Aviso de Privacidad · PyArcana',
  description:
    'Qué datos recopilamos, dónde los guardamos, quién puede verlos y cómo ejercer tus derechos ARCO. Edición pública y edición con cuenta.',
}

const ACCOUNTS = CLOUD_CONFIG.launchStage !== 'off'

const META = {
  slug: 'privacy',
  title: 'Aviso de Privacidad',
  subtitle:
    'Qué datos guardamos, dónde viven y quién puede verlos. En lenguaje claro, sin jerga legal sin explicar.',
  version: IS_STATIC_SITE ? '2.0.0' : '1.0.0',
  effectiveDate: IS_STATIC_SITE ? '2026-10-05' : '2025-07-29',
  englishSummary: !IS_STATIC_SITE
    ? // "or share" holds only while no ad network is enabled (legal-content.ts adSharingClaimHolds).
      `We store only the data needed to operate the course: progress, quiz scores, and (when you sign in) the email used to identify your account. ${adSharingClaimHolds(CLOUD_CONFIG) ? 'We do not sell or share your data.' : 'We do not sell your data.'} You can delete it at any time.`
    : ACCOUNTS
      ? `Without an account your progress stays in your browser. With an account (Google or Microsoft sign-in) we keep your email, name and a copy of your progress on Cloudflare, in the United States. ${adSharingClaimHolds(CLOUD_CONFIG) ? 'We do not sell or share your data.' : 'We do not sell your data.'} You can download or delete it from your account; write to privacy@pyarcana.dev for anything else. Access requests are answered within 20 business days, other requests within 10.`
      : 'This edition has no accounts: your progress stays only in your browser and reaches no server of ours. GitHub Pages and jsDelivr receive your IP address when they deliver the pages and the Python runtime.',
}

/**
 * /privacy. The notice is chosen by the BUILD, so the prerendered HTML is the full, true notice:
 * the GitHub Pages build (stage off) has no accounts; the pyarcana.dev build describes the account
 * edition; the server-rendered edition keeps its own text. CloudLegalSection adds the account
 * edition's live details after hydration on the canonical origin.
 */
export default function PrivacyPage() {
  return (
    <LegalPageShell meta={META}>
      {!IS_STATIC_SITE ? <DynamicEditionPrivacy /> : ACCOUNTS ? <AccountEditionPrivacy /> : <PagesEditionPrivacy />}
      <CloudLegalSection kind="privacy" />
    </LegalPageShell>
  )
}
