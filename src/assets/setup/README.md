# Sesión 0 screenshots

Real captures only (owner's order, 5 Oct 2026). Each picture here has a spec in
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
