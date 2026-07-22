# PyArcana

[![Tests](https://github.com/PillB/pyarcana/actions/workflows/tests.yml/badge.svg)](https://github.com/PillB/pyarcana/actions/workflows/tests.yml)
[![GitHub Pages](https://github.com/PillB/pyarcana/actions/workflows/deploy.yml/badge.svg)](https://github.com/PillB/pyarcana/actions/workflows/deploy.yml)

PyArcana is a 52-section, self-paced route from zero Python knowledge through data systems, machine learning, and responsible AI delivery. The visual system uses an Art Nouveau-inspired botanical and geometric language; the curriculum uses **Yo hago / Hacemos juntos / Tú haces / Autocheck**.

The authoritative V3 plan allocates **960 curricular hours plus 80 hours for CP-FINAL hardening/presentation (1,040 provisional hours total)**. This is a planning estimate, not an individual completion-time promise.

- Public course: <https://pillb.github.io/pyarcana/>
- Source and issue tracker: <https://github.com/PillB/pyarcana>
- Primary curriculum contract: [`learning_roadmap_52_V3.md`](./learning_roadmap_52_V3.md)
- Master roadmap: [`el_arte_de_python_roadmap_maestro_52_secciones.md`](./el_arte_de_python_roadmap_maestro_52_secciones.md)

## Language contract

The interface can be switched between Peruvian Spanish (`es-PE`), neutral Spanish (`es-ES`), and English (`en`). The instructional lessons are authored primarily in Peruvian Spanish; English UI labels do not imply a complete English translation of every lesson. This distinction is also stated on the public landing page.

## Two deployment modes

| Capability | Public GitHub Pages edition | Dynamic LMS on a Node host |
|---|---:|---:|
| 52 lessons, exercises, resources | Yes | Yes |
| Browser-local progress and bookmarks | Yes | Yes |
| Local autochecks | Yes | Yes |
| Accounts and server progress | No | Yes |
| Server exam attempts | No | Yes |
| Private feedback, pricing, admin | No | Yes |

GitHub Pages cannot run Next.js API routes. The static build therefore removes API routes only from a disposable build copy and hides controls that would otherwise be dead or misleading. It never renames tracked source directories. The dynamic build preserves the full LMS.

## Local development

Requirements: Node.js 22, Bun or npm, Python 3.12 for audit scripts.

```bash
bun install --frozen-lockfile
cp .env.example .env
bun run db:generate
bun run db:push
bun run dev
```

For the dynamic LMS, set a unique `NEXTAUTH_SECRET`; there is no source-code fallback. Public registration always creates a `STUDENT`. Administrator access must be granted out of band by an operator after identity verification.

## Builds

```bash
# Dynamic Next.js standalone build (API + LMS)
bun run db:generate
bun run build

# Public static build at /pyarcana
NEXT_PUBLIC_BASE_PATH=/pyarcana bun run build:static
```

The static command copies only the required application files into a temporary directory, excludes `src/app/api` there, runs the export, copies `out/` back, and removes the temporary directory in a `finally` block.

## Validation

CI pins Bun to `1.3.4` and routes dependency installation through
`scripts/ci_bun_install.sh`. The wrapper keeps `--frozen-lockfile`, retries at
most three times, and clears Bun's download cache between attempts. This makes
transient or corrupt package archives (including `xlsx`) recoverable without
hiding deterministic lockfile failures.

The exhaustive browser workflow uses the rendered section ID as its readiness
contract instead of waiting for network idleness from the Next.js development
server. It still visits all 52 sections, but avoids HMR traffic turning every
case into a timeout; the job is bounded to 15 minutes and superseded runs are
cancelled.

Code examples have an additional fidelity contract. The syntax highlighter is
a single-pass tokenizer: it escapes unmatched text and matched tokens exactly
once, so highlighting cannot replace source text with internal token indexes.
The adversarial suite checks every code object loaded from S01–S52, including
the `check_arg.py` regression case. Playwright then visits all five tabs in all
52 sections, reveals guided solutions, compares rendered code, terminal output,
and playground source with the canonical text. It records every surface in a
manifest and captures targeted visual anchors for the reported S01 `check_arg.py`
block, an S01 shell terminal, and an S52 code window, with SHA-256 hashes in the
`playwright-results` CI artifact. This preserves exhaustive browser fidelity
while keeping slow PNG generation diagnostic; the browser job is bounded to
15 minutes.

The browser favicon is the compact PyArcana “P” botanical monogram in emerald,
cream, and gold. It is separate from the larger logo so its Art Nouveau details
remain legible at 16–32 px.

```bash
bun run lint
npx tsc --noEmit
bun run test:unit
bun run test:v3
bun run test:course-complete
bun run test:ux-gates
bun run test:python-content
BASE_URL=http://127.0.0.1:3000 bunx playwright test scripts/v3_regression.spec.ts scripts/static_public.spec.ts
# Exhaustive code/terminal screenshots (large artifact):
CODE_FIDELITY_SCREENSHOTS=1 BASE_URL=http://127.0.0.1:3000 bunx playwright test scripts/code_rendering.spec.ts
```

The July 2026 hardening pass validates 52 active sections, 416 tagged subtopics/demos, 1,248 exercises, 1,248 exam variants, section-varying answer positions, direct-live newbie evidence provenance, and 3,015 executable/explicitly classified curriculum artifacts. Platform-specific adversarial tests cover bounded registration payloads and rate state, malformed JSON, spoofed high-cardinality client keys, public role escalation, fallback secrets, non-mutating static export, base-path assets, and exclusion of unavailable server controls.

The repository deliberately records authentic dual-newbie evidence separately from programmatic gates. Rebuilt/copied historical B1/B2 artifacts are rejected; the authoritative clean live-run count remains visible in [`AGENT_STATE.md`](./AGENT_STATE.md).

## Architecture

- Next.js 16, React 19, TypeScript, Tailwind CSS, Radix UI
- Zustand for browser-local progress
- NextAuth credentials and Prisma for the dynamic LMS
- Browser Python exercises via Pyodide where a lesson marks code runnable
- Source curriculum in `src/lib/course/sections/`
- Course and pedagogy ledgers in `course-state/`
- Regression and audit tooling in `scripts/` and `tests/adversarial/`

## Security boundaries

- Do not deploy a dynamic instance without `NEXTAUTH_SECRET`, HTTPS, and a persistent database appropriate for the host.
- Do not use the public registration endpoint to provision administrators.
- The in-process registration limiter is bounded to prevent memory exhaustion; multi-instance deployments still need a shared gateway or rate-limit store.
- No demo passwords or production secrets belong in the repository or seed.
- GitHub Pages is content-only and intentionally makes no account, payment, or private-feedback promise.

See [`DEPLOY.md`](./DEPLOY.md) for deployment and verification procedures.
