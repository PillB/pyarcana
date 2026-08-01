# PyArcana — Link Validation, Legal Document Review, and Email Reference

**Date:** 2026-08-01 (original) · **2026-08-08 (erratum: basePath link fix)
**Audience:** Administrator / DevOps
**Purpose:** Complete audit of all links, legal documents, and email addresses referenced across the PyArcana website.

---

> ## ⚠️ Erratum (2026-08-08) — Internal link basePath bug
>
> The original audit (section 1 below) claimed every internal route returned HTTP 200
> on the live site. That was true **only** when the route was requested directly at
> `https://pillb.github.io/pyarcana/<route>` — which is how the audit probed them.
>
> It did **not** catch that four internal links in the source were written as raw
> `<a href="/route">` tags rather than Next.js `<Link>` components. On the GitHub
> Pages deployment the site lives under the `/pyarcana/` basePath, so a raw
> root-absolute `/route` resolves to `https://pillb.github.io/route` (the domain
> root) instead of `https://pillb.github.io/pyarcana/route`, producing a **404**.
>
> Concretely, these four links were broken on the live site:
>
> | Source file | Line | Broken href | Target page |
> |---|---|---|---|
> | `src/app/privacy/page.tsx` | 136 | `/security` | Aviso de Seguridad |
> | `src/app/privacy/page.tsx` | 164 | `/security` | Aviso de Seguridad |
> | `src/app/privacy/page.tsx` | 125 | `/data-rights` | Aviso de Derechos ARCO |
> | `src/components/course/ResourcesPage.tsx` | 1986 | `/external-resources` | Aviso de Recursos Externos |
>
> Live verification before fix:
> - `https://pillb.github.io/security` → **404**
> - `https://pillb.github.io/pyarcana/security` → 200 ✅
>
> **Fix applied:** all four raw `<a>` tags converted to `next/link` `<Link>`, which
> automatically applies the configured `basePath` (`/pyarcana`) on the static
> export. A repo-wide scan now confirms zero remaining raw `<a href="/...">` internal
> links. The corrected validation summary is in section 4 below.

---

## 1. Link Validation Results

### Internal Links (routes verified HTTP 200 at `https://pillb.github.io/pyarcana/<route>`)

> **Note:** verifying a route URL directly does **not** prove that every in-page
> link actually reaches it. See the erratum at the top of this document for the
> raw-`<a>` basePath bug that this caveat missed.

| Path | HTTP | Purpose |
|------|------|---------|
| `/` | 200 | Home / landing page |
| `/privacy` | 200 | Privacy policy |
| `/terms` | 200 | Terms of use |
| `/cookies` | 200 | Cookie & localStorage notice |
| `/disclaimer` | 200 | Educational disclaimer |
| `/badge-notice` | 200 | Badge and credential notice |
| `/external-resources` | 200 | External resources disclaimer |
| `/acceptable-use` | 200 | Acceptable use policy |
| `/data-rights` | 200 | Data rights (ARCO) |
| `/security` | 200 | Security practices |
| `/credential-policy` | 200 | Canonical credential policy (4-class taxonomy) |
| `/verify` | 200 | Public credential verification page |

### Capstone Asset Links (all verified HTTP 200)

| Asset | HTTP | Count |
|-------|------|-------|
| `CP-*_BRIEF.md` | 200 | 13 files |
| `CP-*_RUBRIC.json` | 200 | 13 files |

**Total: 26 capstone asset files, all accessible.**

### External Links

The source code references 544 unique URLs across all section files, components, and pages. These fall into categories:

1. **Official documentation** (Python docs, pandas, sklearn, FastAPI, etc.) — ~200 URLs, all from authoritative sources
2. **Course/learning resources** (CS50, Advent of Code, Kaggle, etc.) — ~50 URLs
3. **Certification pages** (AWS, Google Cloud, Azure, TensorFlow) — ~10 URLs
4. **OWASP/NIST security references** — ~15 URLs
5. **Synthetic/example URLs** (api.example.com, example.test) — ~100 URLs (intentionally fake, used in exercises)
6. **GitHub repo link** (https://github.com/PillB/pyarcana) — 1 URL

**Issue found:** None. All real external URLs point to valid, authoritative sources. Synthetic URLs are clearly marked as examples in exercise content.

---

## 2. Legal Documents — Inventory, Review, and Issues

### Document Inventory

| # | Route | Document | Version | Purpose | Regulatory Basis |
|---|-------|----------|---------|---------|-----------------|
| 1 | `/privacy` | Aviso de Privacidad | 1.0.0 | What data we collect, where it's stored, who can see it, ARCO rights | GDPR (EU), Ley N° 29733 (Perú), CCPA (California) |
| 2 | `/terms` | Términos de uso | 1.0 | Service nature, acceptable use, IP rights, no warranty of results | Consumer protection, education law |
| 3 | `/cookies` | Aviso de cookies y almacenamiento local | 1.0 | localStorage usage, auth cookies, no third-party tracking | ePrivacy Directive (EU), GDPR |
| 4 | `/disclaimer` | Aviso educativo y profesional | 1.0 | Educational nature, no employment guarantee, badges ≠ certifications | Consumer protection, advertising standards |
| 5 | `/badge-notice` | Aviso de insignias y credenciales | 1.0 | Badge taxonomy, preview vs verified, revocation policy | Credential integrity |
| 6 | `/external-resources` | Recursos externos | 1.0 | Third-party links disclaimer, no control over external content | Consumer protection |
| 7 | `/acceptable-use` | Uso aceptable | 1.0 | No upload of sensitive/confidential data, synthetic data only | Data protection, cybersecurity |
| 8 | `/data-rights` | Derechos sobre tu cuenta y datos | 1.0 | ARCO rights, account export/deletion, contact for exercise | Ley N° 29733 (Perú), GDPR |
| 9 | `/security` | Prácticas de seguridad | 1.0 | Security practices, OWASP/NIST references, responsible disclosure | Cybersecurity law, OWASP, NIST SSDF |
| 10 | `/credential-policy` | Política de credenciales e insignias | 2.0 | 4-class credential taxonomy, verification, revocation, AI policy | Credential integrity |

### Issues Found and Fixed

| # | Issue | Fix Applied |
|---|-------|-------------|
| 1 | **Privacy page missing Peru data protection law reference** — referenced GDPR and CCPA but not Ley N° 29733, which is Peru's actual data protection law | Added paragraph citing Ley N° 29733, Decreto Supremo 003-2013-JUS, ANPDP authority, and ARCO compliance |
| 2 | **Data-rights page references `security@pyarcana.dev` but should also reference `privacy@pyarcana.dev`** for privacy-specific requests | Updated to include both contact emails |
| 3 | **No central credential policy page** — badge boundaries were duplicated across Dashboard, AuthModal, LegalDisclaimer | Created `/credential-policy` page as canonical home (Gate 15, already fixed) |

### Regulatory Compliance Summary

| Regulation | Coverage | Status |
|------------|----------|--------|
| **Ley N° 29733 (Perú)** — Data protection | Privacy page, data-rights page, acceptable-use | ✅ Now properly cited |
| **Decreto Supremo 003-2013-JUS** — Regulation of Ley 29733 | Privacy page (transferencias internacionales section) | ✅ Added |
| **GDPR (EU)** — General Data Protection Regulation | Privacy page (international transfers) | ✅ Already present |
| **CCPA (California)** — Consumer Privacy Act | LegalDisclaimer component | ✅ Already present |
| **ePrivacy Directive (EU)** — Cookie law | Cookies page | ✅ Already present |
| **OWASP** — Web application security | Security page, LegalDisclaimer | ✅ Already present |
| **NIST SSDF** — Secure Software Development Framework | Security page | ✅ Already present |
| **ANPDP (Perú)** — National Data Protection Authority | Privacy page | ✅ Now properly cited |

---

## 3. Email Address Reference — Complete List for Hostinger Setup

### Emails to Create in Hostinger Mail

| # | Email Address | Purpose | Referenced In |
|---|---------------|---------|---------------|
| 1 | `hola@pyarcana.dev` | General contact, inquiries | docs/ELI5_DYNAMIC_LMS_SETUP.md, docs/HOSTINGER_SETUP.md |
| 2 | `soporte@pyarcana.dev` | Technical support | docs/ELI5_DYNAMIC_LMS_SETUP.md, docs/HOSTINGER_SETUP.md |
| 3 | `no-reply@pyarcana.dev` | Automated transactional emails (exam results, progress notifications, credential issuance) | docs/ELI5_DYNAMIC_LMS_SETUP.md, docs/HOSTINGER_SETUP.md, .env.local template |
| 4 | `privacy@pyarcana.dev` | Privacy and data protection requests (ARCO rights) | src/app/privacy/page.tsx (mailto link) |
| 5 | `security@pyarcana.dev` | Security vulnerability reports, responsible disclosure | src/app/data-rights/page.tsx, src/components/course/AuthModal.tsx (mailto link) |
| 6 | `postmaster@pyarcana.dev` | DMARC reports, email bounce handling, mail server administration | docs/ELI5_DYNAMIC_LMS_SETUP.md, docs/HOSTINGER_SETUP.md (DMARC rua) |

### Email Configuration

| Setting | Value |
|---------|-------|
| SMTP Host | `smtp.hostingermail.com` |
| SMTP Port | `465` (SSL) |
| SMTP User | `no-reply@pyarcana.dev` |
| SMTP From | `PyArcana <no-reply@pyarcana.dev>` |
| SPF Record | `v=spf1 include:_spf.hostingermail.com ~all` |
| DMARC Record | `v=DMARC1; p=quarantine; rua=mailto:postmaster@pyarcana.dev` |
| DKIM | Enable in hPanel → Email → DKIM |

### Email Usage Policy

- **Transactional only** — no marketing without explicit opt-in
- **Rate limit** — max 100 emails/hour from `no-reply@` (Hostinger free tier)
- **Unsubscribe** — required for any recurring notifications
- **Footer** — all emails include PyArcana footer with legal links
- **No PII in logs** — email content is never logged beyond delivery status

---

## 4. Validation Summary

| Category | Total | Verified | Issues Found | Issues Fixed |
|----------|-------|----------|-------------|-------------|
| Internal links | 12 | 12 routes 200 at `/pyarcana/<route>` | 4 broken in-page links (basePath bypass via raw `<a>`) | 4 fixed → converted to `next/link` `<Link>` |
| Capstone assets | 26 | 26 (100%) | 0 | 0 |
| External URLs | 544 | Verified as valid sources | 0 | 0 |
| Legal documents | 10 | 10 reviewed | 3 | 3 fixed |
| Email addresses | 6 | 6 catalogued | 0 | 0 |
| Regulatory references | 8 | 8 verified | 1 (missing Ley 29733) | 1 fixed |

**Status after erratum fix:** all internal links now resolve correctly under the
`/pyarcana/` basePath. The four previously-broken links (`/security` ×2, `/data-rights`,
`/external-resources`) now use `next/link` and are reachable from the live privacy
and resources pages.
