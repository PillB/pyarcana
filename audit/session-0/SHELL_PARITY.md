# Sesión 0 inside the course shell

Written 25 Nov 2026, for Pablo, who asked: "the format of section 0 is different from section 1
and the others, why? you lose the header and other navigation." This file logs every difference
found between Sesión 0 (`/empezar`) and Section 1 (`/#setup`), judges each one, gives the root
cause and records what changed. Screenshots: live site before the change, local static build
after it, 1440×900 and 390×844.

## Root cause

Sesión 0 was built as a standalone Next.js route on purpose (`DESIGN.md` §1): outside the 52
sections, so no count, gate, paywall or badge sees it. That decision was right. The mistake was
the next step: `src/app/empezar/page.tsx` rendered `<SetupIntro />` alone. Every other screen of
the course (dashboard, sections, projects, resources) is a view of one client component,
`src/app/page.tsx`, which owns the sidebar, both top bars, the glossary, the account controls and
the footer. `/empezar` never mounted that component, so it had none of them.

Nothing caught it because no test compared the two pages. The `/empezar` checks
(`setup.e2e.mjs`, `setup-intro.test.ts`) tested the guide's content and behaviour, which were
fine; the "Sesión 0 in the menu" journey only checked that the link led to `/empezar`, not what
was there. `DESIGN.md` §1 even states "Sesión 0 does not appear in the sidebar", written before
the sidebar link was added on 18 Nov: two later changes each assumed the other half of the shell
was there.

The same cause produced every difference marked **shell** below. It was not a separate template
with its own design: it was the absence of the shared one.

## Two routes tried

1. **A shell view at a hash (`/#sesion-0`), `/empezar` kept as is.** Smallest change to the
   router, but `/empezar` stays a bare page, and that is the address the dashboard card, the
   Section 1 banner, the sidebar and every shared link use. The defect would remain at the URL
   people actually open. Rejected.
2. **Move the shell out of `page.tsx` into a component both pages import.** The cleanest
   structure, but eight protected tests pin `src/app/page.tsx` source text (the brand button,
   the `<aside>` width, the router imports, the AdSlot). Moving it means editing protected tests,
   which needs the owner's approval first. Rejected for this PR; noted as a possible follow-up.
3. **Chosen: `/empezar` renders the same shell component, which reads the path.**
   `src/app/empezar/page.tsx` renders the default export of `src/app/page.tsx`; the shell opens
   on a new view, `session0`, when the path is `/empezar`. The prerendered `/empezar` HTML
   therefore contains the sidebar, the top bars and the guide (checked in `out/empezar.html`),
   so readers without JavaScript and search engines still get the guide with its own title and
   description. Sesión 0 stays outside the 52 sections: it is a view, not a section, and no
   count, paywall (`EntitlementGate`) or badge sees it.

Expert benchmark: Nielsen's heuristic 4, *Consistency and standards*, and the WCAG 2.2 criteria
3.2.3 *Consistent Navigation* and 3.2.4 *Consistent Identification* (navigation repeated on a set
of pages appears in the same relative order). A reviewer applying them would have rejected the
bare page; they would also reject route 1, because the inconsistent page would still be the one
people land on.

## Differences, judged

| # | Element | Before: Sesión 0 | Section 1 | Better | Why | Now |
|---|---|---|---|---|---|---|
| 1 | Sidebar with the 52 sections, Dashboard, Recursos | none | yes | S01 | Without it a learner on `/empezar` cannot see where Sesión 0 sits or move on except by the in-page links | **shell**, fixed |
| 2 | Desktop top bar: ← Inicio, breadcrumb, Proyectos, Familiarity, Glosario, Repositorio, theme, language, account | none | yes | S01 | Same controls in the same place on every page (WCAG 3.2.3) | **shell**, fixed; breadcrumb reads «Sesión 0 · Prepara tu computadora» |
| 3 | Mobile top bar: menu, brand, projects, glossary, theme, language, account | none | yes | S01 | On a phone the only way off the page was the small «Volver al curso» link | **shell**, fixed |
| 4 | Theme switch | none (the stored theme applied, but could not be changed) | yes | S01 | A learner reading at night could not switch to dark on the one page they spend an hour or two on | **shell**, fixed; dark mode checked with axe |
| 5 | Language switch | none | yes | S01 | Interface strings of the guide are translated (`setup.*` keys) but the switch was missing | **shell**, fixed |
| 6 | Glossary (button and Cmd+K) | none | yes | S01 | The guide uses terms the glossary defines: terminal, PATH, Git, entorno virtual | **shell**, fixed |
| 7 | Course footer (tagline, «Repetir la guía», consent link) | none | yes | S01 | The consent settings and the tour restart live only in that footer; `/empezar` had neither | **shell**, fixed |
| 8 | «Volver al curso» link above the kicker | yes | no | neither once the shell is there | It duplicated ← Inicio and the menu; no section has one | removed |
| 9 | Landmarks | its own `<main>` | the shell's `<main>` | — | Rendered inside the shell, a second `<main>` would break axe *landmark-no-duplicate-main* | `SetupIntro` now renders a `<div>`; one `<main>` checked by test |
| 10 | Sidebar entry «Sesión 0» | never highlighted (the page had no sidebar) | the open section is highlighted, `aria-current="page"` | S01 | The menu should say where you are | highlighted, `aria-current="page"` while Sesión 0 is open |
| 11 | Opening from the menu | a route change to `/empezar` that dropped the shell | sections open in place | S01 | Changing route remounts everything and loses the sidebar's scroll position | opens in place; Ctrl/⌘-click and middle-click still open a new tab |
| 12 | «Ir a la Sección 1» | a route change to `/#setup` | — | in place | Same reason | opens Section 1 in place; the href stays for a new tab |
| 13 | First-visit tour | never showed (not mounted) | shows on the first visit | S00 | Someone on `/empezar` is installing programs; a 16-step tour of a course they cannot use yet interrupts that | the shell does **not** open the tour on `/empezar`; it waits for the first visit to the course itself |
| 14 | Text column | `max-w-3xl`, about 90 characters a line at 15 px | full width, about 120 characters a line at 16 px | S00 | Bringhurst and Butterick put comfortable reading at 45–90 characters; WCAG 1.4.8 (AAA) at 80 | kept; Section 1's measure is a separate issue, not changed here |
| 15 | Page heading | kicker «SESIÓN 0 · ANTES DE LA SECCIÓN 1» and a 30 px `<h1>` | «S1» chip and an 18 px title in the section card | S00 for a stand-alone guide | Sesión 0 has no tabs, progress ring or bookmark; copying the section card would show controls that do nothing | kept |
| 16 | Structure | one long checklist by operating system, part index, «Hecho» ticks | five tabs (Teoría, Yo hago, Hacemos juntos, Tú haces, Autocheck), part checkpoints, ← → arrows | each fits its job | Setup is a procedure, not a lesson: Software Carpentry, Django Girls and The Odin Project keep it as one linear page (`DESIGN.md` §1) | kept |
| 17 | Progress | «Llevas N de 35 pasos», stored under its own key | progress ring, course progress key | each fits its job | Sesión 0 must stay out of the course record (`DESIGN.md` §1) | kept; the sidebar entry now re-reads it each time Sesión 0 opens, so ticks show on the way back |
| 18 | URL | `/empezar` | `/#setup` | — | `/empezar` is already shared and has its own title and description | kept; leaving Sesión 0 for any view returns to the course root (`/#basics`, never `/empezar#basics`), so a reload opens what is on screen |

## Paths checked in a browser (local static build, base path `/pyarcana`)

- `/empezar` directly: shell present, guide inside `<main>`, one `<main>`, sidebar and top bar at
  the same position and size as on `#S01`.
- Section 1 banner → Sesión 0 → browser Back → Section 1.
- Menu → Sesión 0 → Proyectos → reload: Proyectos.
- `/empezar` → ← Inicio → dashboard card → Sesión 0 (a Next.js link while Next still holds the
  `/empezar` page: the view now follows the path; before the fix this click left the dashboard on
  screen under the `/empezar` address).
- Menu → Sesión 0 → Section 2 → Sesión 0 → «Ir a la Sección 1».
- `/empezar#python` (a part anchor) stays on Sesión 0; `/empezar#basics` opens Section 2 and the
  address moves to `/#basics`.
- `setup.e2e.mjs`: 29 of 29, including axe in light and dark on `/empezar` inside the shell.

## Left undone, named

- Section 1's text runs at about 120 characters a line on a wide screen (row 14). Out of this
  PR's scope and close to lesson layout another thread is reviewing.
- Route 2 (the shell as its own component) would remove `src/app/empezar/page.tsx`'s import of
  another page module. It needs edits to protected tests that pin `src/app/page.tsx`.
- `DESIGN.md` §1 still says Sesión 0 is not in the sidebar. It is a dated design record, so it is
  left as written; this file supersedes that sentence.

## Tests, and the mutation that turns each red

- `src/lib/course/hash-route.test.ts`, "/empezar renders the course shell, not the setup guide
  alone": red when `src/app/empezar/page.tsx` renders `<SetupIntro />` again (checked by restoring
  the old file).
- Same file: the path helpers with and without the `/pyarcana` base path, part anchors on
  `/empezar`, and a drift case where a future section takes a part's slug.
- `scripts/safe_agent_journeys.spec.ts`, "Sesión 0 opens inside the same shell as Section 1":
  compares the menu's position and width and the top bar's height on `/empezar` and `#S01`, and
  counts one `<main>`. Red on a static build of the old page (no `<aside>` found).
- Same file, "Sesión 0 opens Section 1 in place, and a part link stays on Sesión 0": red on a
  build without the path-following effect in `src/app/page.tsx` (the Section 1 banner left
  Section 1 on screen under `/empezar`).

Gates on the final code: lint, `tsc`, `test:v3`, `test:adversarial:node` (1203 passing),
`test:ux-gates`, `test:course-complete`, preservation sentinel, complexity ratchet,
`test:static-journeys` (51 of 51), `setup.e2e.mjs` (29 of 29). `test:adversarial:py` under
Python 3.12: one failure, `test_runtime_refuses_every_python_level_network_channel`, because this
container has no IPv6 (`UDP6 failed OSError` instead of `UDP6 blocked`); no Python or lesson file
is touched here. `tools/fixer/ledger.py --check` reports LEDGER.md stale on `main` as well, before
this change.
