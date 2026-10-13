# Prompt for Codex on Pablo's own computer: real Sesión 0 screenshots

Why on your computer:
- The Claude Code cloud sandbox cannot reach python.org, git-scm.com, github.com pages or the
  OpenAI API, so neither Claude nor Codex can take these captures there.
- On your machine the network is open, so a capture there is a real screenshot.
- A generated image would be one more illustration, not a capture.

Paste everything below the line into `codex` (from the repository root, on branch
`claude/session-0-setup-intro`).

---

You are in the PyArcana repository. Read `AGENTS.md` and `src/assets/setup/README.md` first. Then
take **real** screenshots for Sesión 0. Never draw, generate or edit a screen to look real. If a
capture cannot be taken, say so and leave its illustration in place.

1. Install the dependencies (`bun install`) and Playwright's browser
   (`npx playwright install chromium`).
2. Capture the three web pages for real:
   `node --import tsx scripts/setup_screenshots.mjs --take`.
   That writes `py-release-files`, `git-win-download` and `gh-signup-form` to `src/assets/setup/`,
   replacing their illustrations. Records get today's date and a measured box.
   - If any line prints `WARN … selector … matches nothing`, open that page, find the right CSS
     selector, fix it in `SETUP_SHOTS` (`src/lib/setup/content.ts`) and take it again.
3. Open each new PNG and check it against its step on `/empezar` (`npm run dev`, then
   http://localhost:3000/empezar):
   - the page actually shows the Files table, the "Click here to download" link, or the sign-up
     form;
   - no cookie banner covers it;
   - the box sits on the right thing.
4. Only if this computer is a **clean** Windows 11 machine (Windows Sandbox or a new user account)
   or a Mac without the Command Line Tools: follow the "Installers and desktop apps" section of
   `src/assets/setup/README.md` for the screens you can reach. Add each one with
   `node --import tsx scripts/setup_shot_add.mjs <id> "<png>" --box l,t,w,h`. Use a test GitHub
   account for `gh-device-code`.
5. Run `node scripts/run_billing_tests.mjs --only client` and
   `node --import tsx scripts/setup_screenshots.mjs --report`. The report must show fewer
   `illustration` rows than before.
6. Commit only the PNGs, `src/assets/setup/shots.json` and `src/assets/setup/index.ts`, plus any
   selector fix, with a message saying which ids are now real captures. Push to
   `claude/session-0-setup-intro`.
