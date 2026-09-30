# Hostinger Setup Guide — PyArcana Domains & Email

**Status:** Production setup guide · **Date:** 2026-07-31
**Audience:** Administrator / DevOps

PyArcana has acquired `pyarcana.dev` and `pyarcana.com` plus a mailing service, all from Hostinger. This document covers all setup and securing steps.

> **Update, 2026-09-30: read this before the rest of the page.** The content below is kept as it
> was written on 2026-07-31. It assumed a VPS-hosted dynamic LMS, and the product no longer uses
> one.
>
> - **Hosting.** The site and its API are one Cloudflare Worker (`workers/billing`), which also
>   serves the static export, on `https://pyarcana.dev` through a Workers Custom Domain. The
>   operator steps are in `workers/billing/README.md` ("Setup order": `scripts/setup.sh`, then
>   `scripts/deploy.sh`). Section 2's A records pointing to a server IP no longer apply.
> - **DNS.** The nameservers of `pyarcana.dev` and `pyarcana.com` move to Cloudflare (free plan).
>   Registration stays at Hostinger. `pyarcana.com` and `www` redirect to `https://pyarcana.dev`.
>   If DNSSEC is on at Hostinger, turn it off before switching.
> - **Sign-in email.** Codes are sent with Cloudflare Email Sending from `no-reply@pyarcana.dev`
>   (Workers Paid). Its records live on the `cf-bounce` subdomain. The Worker never uses Hostinger
>   SMTP or mailbox credentials.
> - **Mail stays at Hostinger.** Recreate the mail records in Cloudflare DNS as DNS-only records
>   BEFORE switching the nameservers. The live records replace this page's older examples:
>   - MX `mx1.hostinger.com` (priority 5) and `mx2.hostinger.com` (priority 10). The
>     `mx1/mx2.hostingermail.com` rows in section 2.1 are out of date.
>   - SPF `v=spf1 include:_spf.mail.hostinger.com ~all`.
>   - DKIM CNAMEs `hostingermail-{a,b,c}._domainkey` → `hostingermail-{a,b,c}.dkim.mail.hostinger.com`.
>   - DMARC `_dmarc` `v=DMARC1; p=none`.
>   - `autodiscover` and `autoconfig` CNAMEs to Hostinger's mail hosts.

---

## 1. Acquired assets

| Asset | Registrar | Purpose |
|-------|-----------|---------|
| `pyarcana.dev` | Hostinger | Primary production domain (dynamic LMS) |
| `pyarcana.com` | Hostinger | Brand-protection redirect → `pyarcana.dev` |
| Mailing service | Hostinger (Titan/Hostinger Mail) | `hola@pyarcana.dev`, `soporte@pyarcana.dev` |

## 2. DNS configuration

### 2.1 pyarcana.dev (primary — dynamic LMS)

Log into Hostinger → hPanel → Domains → pyarcana.dev → DNS / Nameservers.

| Type | Name | Value | TTL | Purpose |
|------|------|-------|-----|---------|
| A | `@` | `<server-IP>` | 3600 | Root domain → dynamic LMS server |
| A | `www` | `<server-IP>` | 3600 | www redirect |
| CNAME | `app` | `pyarcana.dev` | 3600 | App subdomain (optional) |
| CNAME | `docs` | `pyarcana.dev` | 3600 | Docs subdomain (optional) |
| MX | `@` | `mx1.hostingermail.com` (priority 10) | 3600 | Mail |
| MX | `@` | `mx2.hostingermail.com` (priority 50) | 3600 | Mail backup |
| TXT | `@` | `v=spf1 include:_spf.hostingermail.com ~all` | 3600 | SPF (email auth) |
| TXT | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:postmaster@pyarcana.dev` | 3600 | DMARC |
| CNAME | `default._domainkey` | `<Hostinger-provided DKIM>` | 3600 | DKIM (email signing) |

**For the dynamic LMS server IP:** when deploying to a VPS (Hostinger VPS or other), use the VPS public IP. If using a PaaS (Vercel/Render/Railway), use a CNAME instead of A record:
```
CNAME  @  cname.vercel-dns.com  (if Vercel)
```

### 2.2 pyarcana.com (redirect → pyarcana.dev)

| Type | Name | Value | TTL | Purpose |
|------|------|-------|-----|---------|
| A | `@` | `<server-IP>` | 3600 | Redirect server |
| A | `www` | `<server-IP>` | 3600 | www redirect |
| TXT | `@` | `v=spf1 include:_spf.hostingermail.com ~all` | 3600 | SPF |

Configure a 301 permanent redirect from `pyarcana.com` → `pyarcana.dev` at the server/reverse-proxy level (Caddy/Nginx). See `Caddyfile` in this repo.

### 2.3 Static GitHub Pages (pillb.github.io)

The static site remains at `https://pillb.github.io/pyarcana/`. Do NOT point `pyarcana.dev` to GitHub Pages — `.dev` is for the dynamic LMS. The static site is the public curriculum preview; the dynamic site is the authenticated LMS.

## 3. SSL/TLS certificates

### 3.1 Automatic SSL via Caddy

The repo's `Caddyfile` uses Caddy's automatic HTTPS (Let's Encrypt). When the server starts with `pyarcana.dev` configured, Caddy automatically:
- Provisions a TLS certificate
- Renewals are automatic
- HTTP → HTTPS redirect is enforced

### 3.2 Hostinger SSL (alternative)

If not using Caddy's auto-SSL, use Hostinger's free SSL:
1. hPanel → SSL → Install SSL
2. Select `pyarcana.dev`
3. Choose "Let's Encrypt" → Install
4. Force HTTPS redirect: hPanel → Domains → Force HTTPS → On

### 3.3 HSTS (security hardening)

Add HSTS header in the reverse proxy:
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```
Submit `pyarcana.dev` to the HSTS preload list at https://hstspreload.org after verifying HTTPS is stable.

## 4. Email service setup

### 4.1 Create mailboxes

In Hostinger hPanel → Email → Email Accounts:
- `hola@pyarcana.dev` — general inquiries
- `soporte@pyarcana.dev` — technical support
- `postmaster@pyarcana.dev` — DMARC reports, bounces
- `no-reply@pyarcana.dev` — automated notifications (exam results, progress)

> **Addresses the site already names (added 2026-09-30).** The published privacy, data-rights, terms and security pages name `privacy@pyarcana.dev` and `security@pyarcana.dev`, and the account pages name `soporte@pyarcana.dev`. Per DESIGN-v3 §L only `hola@` exists as a mailbox, so these must exist as aliases or forwarders to it before launch; see the checklist in §7. The page text is kept as it is (preservation rule); changing it to a single address is a content decision for the owner.

### 4.2 Email authentication (critical for deliverability)

| Protocol | Status | Action |
|----------|--------|--------|
| SPF | Required | TXT record: `v=spf1 include:_spf.hostingermail.com ~all` (done in §2.1) |
| DKIM | Required | Enable in hPanel → Email → DKIM → copy the CNAME to DNS |
| DMARC | Required | TXT record on `_dmarc.pyarcana.dev`: `v=DMARC1; p=quarantine; rua=mailto:postmaster@pyarcana.dev` (done in §2.1) |

### 4.3 Connect email to the app

The dynamic LMS sends transactional emails (exam results, progress, notifications). Configure the SMTP settings in `.env.local`:

```bash
SMTP_HOST=smtp.hostingermail.com
SMTP_PORT=465
SMTP_USER=no-reply@pyarcana.dev
SMTP_PASSWORD=<mailbox-password>
SMTP_FROM="PyArcana <no-reply@pyarcana.dev>"
```

**NEVER commit SMTP passwords to git.** Use GitHub repository secrets for CI and server env vars for production.

### 4.4 Email sending policy

- Transactional emails only (no marketing without explicit opt-in)
- Rate limit: max 100 emails/hour from `no-reply@` (Hostinger free tier limit)
- Unsubscribe link required for any recurring notifications
- All emails include the PyArcana footer with legal links

## 5. Caddyfile configuration

The repo's `Caddyfile` should be updated for production:

```caddyfile
# pyarcana.dev — dynamic LMS
pyarcana.dev {
    reverse_proxy localhost:3000
    encode gzip zstd
    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
        X-Content-Type-Options "nosniff"
        X-Frame-Options "DENY"
        Referrer-Policy "strict-origin-when-cross-origin"
        Permissions-Policy "geolocation=(), microphone=(), camera=()"
    }
    log {
        output file /var/log/caddy/pyarcana.dev.log
        format json
    }
}

# pyarcana.com → 301 redirect to .dev
pyarcana.com, www.pyarcana.com {
    redir https://pyarcana.dev{uri} 301
}

# www.pyarcana.dev → bare domain
www.pyarcana.dev {
    redir https://pyarcana.dev{uri} 301
}
```

## 6. DNS propagation verification

After configuring DNS, verify propagation:

```bash
# Check A record
dig pyarcana.dev A +short

# Check MX
dig pyarcana.dev MX +short

# Check SPF
dig pyarcana.dev TXT +short | grep spf

# Check DMARC
dig _dmarc.pyarcana.dev TXT +short

# Check DKIM
dig default._domainkey.pyarcana.dev CNAME +short

# Global propagation
# Visit https://dnschecker.org/#A/pyarcana.dev
```

## 7. Pre-deployment checklist

- [ ] DNS A record for `pyarcana.dev` → server IP (or CNAME to PaaS)
- [ ] DNS A record for `www.pyarcana.dev` → server IP
- [ ] DNS A records for `pyarcana.com` + `www.pyarcana.com` → redirect server
- [ ] MX records for `pyarcana.dev` → Hostinger mail servers
- [ ] SPF TXT record on `pyarcana.dev`
- [ ] DMARC TXT record on `_dmarc.pyarcana.dev`
- [ ] DKIM CNAME on `default._domainkey.pyarcana.dev`
- [ ] SSL certificate provisioned (Caddy auto-SSL or Hostinger Let's Encrypt)
- [ ] HSTS header configured
- [ ] 301 redirect from `pyarcana.com` → `pyarcana.dev`
- [ ] 301 redirect from `www.pyarcana.dev` → `pyarcana.dev`
- [ ] Mailboxes created (`hola@`, `soporte@`, `postmaster@`, `no-reply@`)
- [ ] Before the account edition launches (DESIGN-v3 §K/§L; client review round 3): every address the site names reaches a person. The legal pages already tell users to write to `privacy@` (ARCO and privacy requests under Ley 29733) and `security@` (vulnerability reports), and the account pages use `soporte@` (`legal.supportEmail`). Hostinger has one mailbox (`hola@`), so create `soporte@`, `privacy@` and `security@` as aliases or forwarders to `hola@` in hPanel → Emails → Forwarders, then send a test message to each.
- [ ] SMTP credentials set as env vars (NOT committed to git)
- [ ] Firebase authorized domains updated to include `pyarcana.dev`
- [ ] `NEXTAUTH_URL=https://pyarcana.dev` in production env

## 8. Security hardening

- **DNSSEC:** Enable in Hostinger hPanel → Domains → DNSSEC (adds a DS record to the parent `.dev` zone)
- **Cloudflare (optional):** If using Cloudflare as a DNS proxy, set SSL mode to "Full (strict)" and enable "Always Use HTTPS"
- **Rate limiting:** Configure in Caddy or Cloudflare for auth endpoints (`/api/auth/*`, `/api/exam/*`)
- **DDoS protection:** Cloudflare proxy or Hostinger's built-in protection
- **Email spoofing protection:** SPF + DKIM + DMARC (all configured above) prevent phishing from `@pyarcana.dev`

## 9. Monitoring

- **Uptime:** Set up uptime monitoring (UptimeRobot, BetterUptime) for `https://pyarcana.dev`
- **SSL expiry:** Caddy auto-renews; monitor with `certbot renew --dry-run` or a monitoring service
- **Email deliverability:** Monitor DMARC reports at `postmaster@pyarcana.dev`; use mail-tester.com to verify spam score
- **DNS:** Monitor DNS changes with a DNS monitoring service
