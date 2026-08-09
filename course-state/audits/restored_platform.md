# Restored platform checkpoint

Date: 2026-07-22 (America/Lima)

Scope: platform, GitHub Pages runtime, branding, authentication hardening, deployment documentation, and platform regression tests. Curriculum section content was not changed by this checkpoint.

## Restored behavior

- Replaced the third-party favicon with a local PyArcana Art Nouveau monogram and used it on the landing page.
- Added an explicit static runtime and `/pyarcana` asset helper.
- GitHub Pages now renders an honest public-edition notice and hides login, registration, pricing, private feedback, server reports, and admin controls.
- Browser-local progress remains available; server synchronization is disabled in static mode.
- The static export runs from a disposable temporary copy. API routes are removed only from that copy; tracked source and configuration are never renamed or rewritten.
- Dynamic standalone builds retain all LMS API routes.
- Removed demo-login controls, OAuth placeholder controls, default passwords, seeded test users, and the NextAuth fallback secret.
- Public registration is strict and always creates `STUDENT`; administrator provisioning is out of band.
- Registration JSON is streamed with an 8 KiB limit, rate-state cardinality is bounded, untrusted client keys are sanitized, and bcrypt follows the same comparison path for unknown users.
- Updated CI, README, deployment guidance, and authenticated E2E credential handling.

## Evidence

| Gate | Result |
|---|---|
| `npm run lint` | PASS |
| `npx tsc --noEmit` | PASS |
| `node --import tsx --test tests/adversarial/auth-hardening.test.ts` | PASS, 4/4 |
| Node adversarial suite | PASS, 47/47 |
| `python3 tests/adversarial/test_static_export_guard.py` before build | PASS, 2 + 1 expected skip |
| `NEXT_PUBLIC_BASE_PATH=/pyarcana npm run build:static` | PASS, strict TypeScript, 3/3 pages |
| Static guard after build | PASS, 3/3 |
| Static document contract | PASS: local/base-path logo and public notice present; account/pricing/admin controls and third-party favicon absent |
| Dynamic `npm run build` with isolated CI environment | PASS, 18/18 pages; all LMS API routes retained |

The full Python adversarial command had one concurrent evidence-validator failure in `test_distinct_direct_live_agents_pass_provenance`. It is outside this platform checkpoint and was routed to the evidence-restoration owner. All platform-specific Python and Node tests passed.

## Residual deployment boundary

The in-process registration limiter is deliberately bounded but cannot coordinate across replicas. A scaled dynamic LMS still requires shared ingress rate limiting and a reviewed persistent-database migration. GitHub Pages remains content-only by design.
