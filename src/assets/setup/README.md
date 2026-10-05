# Sesión 0 screenshots

Real screenshots only (owner's order, 5 Oct 2026): our own captures, or screenshots reused from
official documentation under an open licence. Each picture here has a spec in
`src/lib/setup/content.ts` (`SETUP_SHOTS`: what it must show, its alt text and caption) and a
record in `shots.json` (the date it was checked, its size, the box around what to click).

## See what is missing or stale

```bash
node --import tsx scripts/setup_screenshots.mjs --report
```

## Browser pages (`source: 'browser-script'`)

```bash
node --import tsx scripts/setup_screenshots.mjs --take            # all of them
node --import tsx scripts/setup_screenshots.mjs --take --only gh-signup-form
```

The script opens the page at 1280×800, finds the spec's `selector`, saves `<id>.png`, measures the
box, writes the record with today's date and regenerates `index.ts`. **Look at every picture before
committing it**: a page can change under a selector that still matches.

## Installers and desktop apps (`source: 'owner-capture'`)

On a real Windows 11 or macOS machine, in Spanish where the system offers it:

1. Put the screen in the state the spec's `brief` describes. Use a test account for anything that
   shows a personal detail: no real email, QR code or recovery code may appear.
2. Capture the window only (Windows: Win+Shift+S, window mode; macOS: Cmd+Shift+4, then Space).
3. Save it as `src/assets/setup/<id>.png`, with the spec's id as the name.
4. Add its record to `shots.json`:
   ```json
   { "id": "win-py-installer-path", "checkedOn": "2026-10-12", "width": 1316, "height": 822,
     "box": { "x": 4.1, "y": 78.5, "w": 38.0, "h": 6.2 } }
   ```
   `width` and `height` are the PNG's pixels. `box` is the rectangle around what to click, in
   percent of the width and height (x and y are its top-left corner). Leave `box` out when the
   picture shows a result rather than something to click.
5. Run `node scripts/setup_shots_index.mjs`. Then run the unit tests
   (`node scripts/run_billing_tests.mjs --only client`): they refuse a picture without a record, a
   record without a picture, and a box that runs off the image.
6. Open `/empezar` and check that the box sits on the right control, in light and dark mode.

Retake a capture when its installer or page changes, and at the latest when `--report` calls it
stale (older than 120 days).

## Reusing a screenshot from official documentation

Allowed only under a licence in `REUSE_LICENCES` (`src/lib/setup/screenshots.ts`): CC BY 4.0,
CC BY 3.0 US, the PSF License, or CC BY-SA 4.0 **unmodified** (no crop, no `box`). Never a
NonCommercial licence: PyArcana Pro is paid. Take the file from the documentation's own source repository
(for example `github/docs`, `microsoft/vscode-docs`, `python/cpython` `Doc/using/`), never from a
blog or a third-party tutorial. Then:

1. Look at it next to its step. Reject it if it would teach a beginner something wrong, or bury
   what matters (a power-user layout, a box on the wrong control, a stale label).
2. Save it as `<id>.png`. If you crop it, say so in `changes`.
3. Add a record with a `credit` (source, the exact source file URL, licence, changes) and the
   picture's **own** `alt` and `caption`: what it really shows, including any difference from the
   learner's screen ("la imagen es de Python 3.13; la tuya dirá Python 3.12").
4. Same checks as above. The unit tests refuse a record with any other licence, or one without
   its own alt and caption.
