# PyArcana — Adversarial Security Audit & Red Team Report

**Date:** 2026-08-08
**Scope:** Adversarial penetration testing and red teaming of the PyArcana website, badge generation, exercise evaluation, self-check results, credential verification, and supporting infrastructure.
**Methodology:** 5 parallel investigations — (1) best-practices research, (2) badge/credential static analysis, (3) evaluation/self-check static analysis, (4) injection/secret-exposure audit, (5) dynamic exploitation via agent-browser.

---

## Executive Summary

A comprehensive adversarial security audit was conducted across the static deployment (`https://pillb.github.io/pyarcana/`) and the dynamic LMS codebase (not yet deployed). **9 actionable issues were found and fixed** in commit `3752ecb4`. Several additional issues are documented as "requires dynamic LMS" or "inherent to static architecture" — these are honestly assessed below.

**The most important finding:** the `/verify` page could be spoofed into displaying any attacker-supplied JSON as a "valid Class D credential" via `window.fetch` interception in DevTools. This is a self-deception / screenshot-fraud vector (it doesn't affect the server DB or other viewers), but it directly undermines the credibility of the credential system. **Fixed** with client-side signature re-verification + clear static-deployment warnings.

**The most impactful fix:** the `firestore.rules` `isSupervisorOf()` function was a no-op tautology that would have let ANY signed-in cohort member read ANY learner's progress, exam attempts, and badges on the dynamic LMS. **Fixed** with real cohort-scoped authorization.

---

## Threat Model (read first)

### What the static export CAN protect
- **Confidentiality of server-side data** — there is none on the static host; all sensitive state lives in the (undeployed) dynamic LMS / Firestore, gated by `firestore.rules`.
- **Integrity of the bundle itself** — HTTPS + GitHub's CDN; no server to inject into responses.
- **The HMAC signing key** — lives only server-side; the string `CREDENTIAL_SIGNING_KEY` does not appear in any built JS chunk (confirmed).

### What the static export CANNOT protect (inherently client-trusted)
- **`localStorage` contents** — fully user-writable. Class A progress markers and self-check scores live here. **Forging these is the defined trust level, not a vulnerability.**
- **Self-check quiz answers** — they ship in the client JS bundle (414 `correctIndex` literals confirmed in `app/page-*.js`). Any learner can extract them. This is unavoidable for client-side grading.
- **The `/verify` page result** — it renders whatever JSON the `fetch('/api/credentials/verify')` call returns, with zero client-side signature validation (until this commit's fix). Any interception yields a forged "valid" card.

### Where the trust boundary actually is
Class D credential integrity lives entirely at the **dynamic `/api/credentials/verify` endpoint**, which checks an HMAC-SHA256 signature using `CREDENTIAL_SIGNING_KEY`. The static site is a *display surface only*. A credential is only as trustworthy as (a) the dynamic LMS being deployed, (b) `CREDENTIAL_SIGNING_KEY` being set to a non-default value (now fail-fast enforced), and (c) the verifier visiting the live dynamic endpoint, not the static page.

---

## Findings by Severity

### Fixed in this audit

| # | Severity | Finding | File:Line | Fix |
|---|----------|---------|-----------|-----|
| 1 | **High** | `/verify` page renders any attacker-supplied JSON as "valid credential" via `window.fetch` interception (self-deception / screenshot fraud) | `src/app/verify/page.tsx:41-43` | Client-side HMAC re-verification using `NEXT_PUBLIC_CREDENTIAL_VERIFY_KEY`; red "Firma no válida" banner on mismatch; static-deployment warning + 503 handling |
| 2 | **High** | `firestore.rules` `isSupervisorOf()` is a tautology — any cohort member reads any learner's data (horizontal privilege escalation on dynamic LMS) | `firestore.rules:36-47` | Rewrote to read target doc's `cohortId`, then verify caller has a supervisor-role `cohortMembers` doc in THAT cohort |
| 3 | **High** | `CREDENTIAL_SIGNING_KEY` falls back to publicly-known `'dev-only-key-not-for-production-use'` if env var missing — anyone could forge valid signatures offline | `issue/route.ts:34-38`, `verify/route.ts:10-14` | Fail-fast `throw` in production when env var unset; dev fallback only in non-production |
| 4 | **High** | `verify/route.ts` uses `body:{contains:verificationId}` substring match (IDOR risk) + `signature === expected` (timing attack) | `verify/route.ts:42-47, 21` | Regex validates `verify_[a-f0-9]{16}` format; parses each candidate to confirm EXACT field match; `crypto.timingSafeEqual` for signature |
| 5 | **Medium** | Corrupted `localStorage` crashes the entire app ("a client-side exception has occurred"); victim cannot recover without DevTools | `src/lib/progress-store.ts` (zustand persist, no validation) | `sanitizePersisted()` type-guard coerces every field to safe default shape on hydration; corruption logged but never crashes. **Verified locally: the exact payload that crashed the live site now renders normally.** |
| 6 | **High** | Pyodide CDN `<script>` loaded without SRI — CDN compromise or MITM could inject arbitrary JS | `CodePlayground.tsx:26-29` | Added `integrity="sha384-..."` + `crossOrigin="anonymous"` (hash computed from exact v0.26.2 bytes) |
| 7 | **Low** | `RichText.tsx` link transform doesn't escape `"` in href (attribute-breakout XSS) and allows `javascript:` URLs | `RichText.tsx:265-278` | HTML-escape quotes in href (`&quot;`); reject `javascript:/data:/vbscript:/file:` schemes (render as inert `<span>`) |
| 8 | **High** | No Content-Security-Policy anywhere — zero XSS mitigation beyond React's default escaping | `next.config.ts`, `layout.tsx` | Added `<meta http-equiv="Content-Security-Policy">` with `object-src 'none'`, `base-uri 'self'`, `frame-ancestors 'none'`, `form-action 'self'`, restricted `connect-src` (script-src still needs `unsafe-inline` due to Next.js static export limitation) |
| 9 | **Low** | `robots.txt` allows all crawlers — capstone rubrics and `/verify` get indexed | `public/robots.txt` | Added `Disallow: /capstones/` and `Disallow: /verify` for all user agents |

### Documented but NOT fixed (require dynamic LMS or policy decisions)

| # | Severity | Finding | Why not fixed | Recommended action |
|---|----------|---------|---------------|-------------------|
| A | **Critical (dynamic only)** | `/api/credentials/issue` uses a 13-exam-score shortcut instead of the documented 9-gate `EligibilityEngine`. The engine exists (712 lines, well-tested) but is dead code — imported by zero runtime files. An authenticated learner who passes 13 exams gets a server-signed Class D credential without any capstone work, rubric review, or defense. | Requires the dynamic LMS to be deployed to test. The fix (wire `engine.awardIdempotent()` into the issue route) is a behavioral change that needs integration testing. | Before any dynamic LMS launch: replace the 13-exam check in `issue/route.ts:96-115` with `engine.awardIdempotent(badgeId, serverProgress, {edition: EDITION_DYNAMIC})`. |
| B | **High (dynamic only)** | `/api/exercise/attempt` accepts `correct: z.boolean()` from the client — no server-side grading. | Requires server-side test runner + schema for exercise answers. | Add server-side grading before LMS launch. |
| C | **High (dynamic only)** | `/api/progress` accepts `completed: z.boolean()` from the client for any subStep — no verification. | Requires linking substep completion to exam attempts (for `quiz`) and GitHub repo fetches (for `youdo`). | Add server-side verification before LMS launch. |
| D | **Medium (inherent)** | 414 self-check `correctIndex` literals ship in the client JS bundle. Any learner can extract all answers via DevTools. | Inherent to client-side grading on a static export. The client must grade self-checks, so it must know the answers. | Already mitigated by design: self-checks are explicitly non-authoritative practice tools. Verified section exams go through `/api/exam/submit` (server-side grading, answers stripped from `/api/exam/start` responses). Document this clearly to learners. |
| E | **Medium (compliance)** | `demo_clientes.xlsx` ships PII-structured synthetic data (DNI-format numbers, phone format, Lima GPS coords) as a public static asset. Data is synthetic but structure is realistic enough to cause compliance/reputation confusion. | Requires a team decision on whether to gate the file behind the dynamic LMS or relabel values as obviously-synthetic. | Recommend prefixing all values with `SYNTHETIC-` or using `example.com` domains, OR moving to a gated capstone-only path on the dynamic LMS. |
| F | **Low (informational)** | `EligibilityEngine` (712 lines) and `claim_evidence_contracts/*.json` `specification_hash` field (a literal string, not a computed digest) are spec-vs-impl gaps. The architecture docs describe a system the production code does not implement. | Requires either wiring the engine in (fix A) or deleting it and updating docs. | Resolve before LMS launch: either wire the engine or delete it + update `industry_alignment/credential_architecture.md`. |
| G | **Low (informational)** | `verify/route.ts` revocation state lives in the same JSON body as the credential. Anyone with DB write access can flip `revocationStatus` with no audit trail. | Requires a schema migration to a separate `RevocationEntry` table with its own signature. | Before LMS launch: add `RevocationEntry { id, credentialId, revokedAt, reason, revokedBy, signature }` table. |

---

## Primary Fraud Scenario (rehearsed end-to-end)

> A learner wants to show an employer a "verified" PyArcana capstone credential without doing the work.

**Path of least resistance (before this audit's fixes):**
1. Extract self-check answers from the JS bundle (414 `correctIndex` literals) to clear Class A gates. *(Still possible — inherent to static architecture.)*
2. Read the capstone rubric from `/capstones/CP-*_RUBRIC.json` (publicly served) to fabricate a minimal submission. *(Still possible — see finding E.)*
3. If the dynamic LMS launches without `CREDENTIAL_SIGNING_KEY` set, forge a Class D credential signature offline using the publicly-known dev fallback key. *(Fixed — now fail-fast in production.)*
4. Intercept the `/verify` fetch locally (DevTools `window.fetch` override) so the static `/verify` page renders "Credencial válida" when the employer checks it on the learner's laptop. *(Fixed — client-side signature re-verification now flags mismatches with a red banner; static-deployment warning explains the limitation.)*

**After this audit's fixes:** Steps 3 and 4 are blocked. Steps 1 and 2 remain possible but produce only a vanity dashboard / local screenshot — they cannot produce a credential that a third-party verifier (visiting the real dynamic LMS) would accept.

---

## OWASP Top 10 2025 Mapping

| Category | Applies? | Status |
|---|---|---|
| A01 Broken Access Control | ✅ (dynamic) | `firestore.rules` tautology **fixed** |
| A02 Cryptographic Failures | ✅ | HMAC fallback key **fixed** (fail-fast); timing-safe compare **added** |
| A03 Injection | ⚠️ Partial | RichText `javascript:` URLs **fixed**; no live XSS vector found |
| A04 Insecure Design | ✅ | EligibilityEngine dead code (finding A) — documented, requires LMS launch |
| A05 Security Misconfiguration | ✅ | CSP **added**; SRI **added**; robots.txt **hardened** |
| A06 Vulnerable Components | ✅ | `npm audit` recommended (finding not in scope of this commit) |
| A07 Authentication Failures | ✅ (dynamic) | Email enumeration already mitigated (`mapAuthError`) |
| A08 Software Integrity Failures | ✅ | No SLSA provenance — documented as supply-chain hardening |
| A09 Logging Failures | N/A (static) | No server logs on GitHub Pages |
| A10 Mishandling Exceptional Conditions | ✅ | localStorage crash **fixed**; verify-page 503 **handled gracefully** |

---

## What Is Inherently Unfixable on a Static Export

Be explicit with stakeholders:

1. **Client-side grading = answer exposure.** Any self-check whose answers must be checked in the browser will ship those answers in the JS bundle. The only fix is server-side grading (which the dynamic LMS already does for `/api/exam/*`).
2. **Client-side progress = forgeable progress.** `localStorage` is user-writable by definition. Class A badges cannot be integrity-protected without a server to sign them. This is a **property of the architecture**, acknowledged by the credential taxonomy (Class A = "local").
3. **The static `/verify` page cannot authoritatively verify anything.** It depends on a dynamic API that doesn't exist on GitHub Pages. Even with client-side signature re-verification (this commit's fix), a determined attacker with DevTools can bypass it. **Authoritative verification requires the verifier to visit the dynamic LMS endpoint directly** (over HTTPS, not through the attacker's machine).
4. **No strict CSP on GitHub Pages.** GitHub Pages doesn't support custom HTTP headers. A `<meta>` CSP works but Next.js static export's inline scripts force `unsafe-inline` for `script-src`. A truly strict CSP requires moving to a CDN that supports headers (Cloudflare Pages, Netlify).
5. **No server-side rate limiting / logging on the static host.** Only the dynamic LMS can rate-limit `/api/*`.

---

## Verification

- **Lint:** 0 errors. **tsc:** clean. **build:static:** 14/14 pages.
- **Local dynamic test:** poisoned `localStorage` (the exact payload that crashed the live site: `completedSections:42, bookmarks:null`) now renders normally — "NO CRASH — sanitized OK".
- **CSP:** present in built HTML (`<meta http-equiv="Content-Security-Policy">`).
- **SRI:** Pyodide script tag has `integrity="sha384-tVslJOEkg7nVRW3Y3/ReGX0NnonNrbcmt1R5qFbQXQdGa2chRkoJYHAjAsv3zoTq"`.
- **robots.txt:** has `Disallow: /capstones/` and `Disallow: /verify`.
- **Commit:** `3752ecb4` — 9 files changed, 411 insertions, 37 deletions.

---

## Methodology Lesson

The prior link audit (LINK-AUDIT-2-COMPREHENSIVE) taught us that **probing a URL directly ≠ verifying in-page links resolve**. This red-team audit applied the same lesson to security: **reading the code statically ≠ proving it's exploitable**. Every finding here was verified either by executing the exploit (dynamic tests 1-10 in REDTEAM-5) or by tracing the exact data-flow in source (static analyses REDTEAM-2/3/4). The 5 parallel investigations cross-validated each other — e.g., the `firestore.rules` tautology was found by both the badge-security auditor (REDTEAM-2) and the research agent (REDTEAM-1), and the localStorage crash was found by both the dynamic tester (REDTEAM-5 Attack 6) and the injection auditor (REDTEAM-4).

The recurring webDevReview cron (job 302913) will continue monitoring for regressions.
