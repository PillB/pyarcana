# Sesión 0 screenshots

Real screenshots only (owner's order, 5 Oct 2026): our own captures, or screenshots reused from
official documentation under an open licence. Each picture here has a spec in
`src/lib/setup/content.ts` (`SETUP_SHOTS`: what it must show, its alt text and caption) and a
record in `shots.json` (the date it was checked, its size, the box around what to click).

## See what is missing or stale

```bash
node --import tsx scripts/setup_screenshots.mjs --report
```

## Installers and desktop apps (`source: 'owner-capture'`)

**Before you start (prevents the usual retakes):**
- **Spanish system, light theme, default zoom.** The page is in Spanish, and learners compare
  colours and positions with yours.
- **A clean machine shows the screens a beginner sees.** Your own computer already has Python, Git
  and VS Code, so some screens never appear there:
  - Windows 11 Pro: use **Windows Sandbox** (enable it under "Activar o desactivar las
    características de Windows"). It is a fresh, throwaway Windows.
  - Otherwise use a new local user account, or a spare laptop.
  - The macOS Git prompt (`mac-clt-prompt`) appears only on a Mac without the Command Line Tools,
    so use another Mac or a fresh user on a Mac that never installed them.
- **Privacy.** Use a test GitHub account for anything GitHub shows. No real email, QR code or
  recovery code may appear. A device code expires in 15 minutes, so a capture of one is harmless
  once it has expired.
- **Capture the window, not the screen.**
  - Windows 11: Win+Shift+S, then "Ventana", then click the window. The Snipping Tool saves a PNG
    in Imágenes > Capturas de pantalla.
  - macOS: Cmd+Shift+4, then Space, then **hold Option** while you click the window. Option leaves
    out the drop shadow. The PNG lands on the Desktop.
- **Size.** A Retina Mac saves at twice the size. Keep pictures at 1600 px wide or less. The add
  script warns, and tells you the one-line fix: `sips -Z 1600 "file.png"` on a Mac, or Paint >
  Cambiar tamaño on Windows.

**The box around what to click.** Choose one way:
- **Draw it yourself** with the capture tool's markup, one rectangle on exactly one control:
  - macOS: open the PNG, Markup, Shapes, rectangle;
  - Windows: Snipping Tool's shapes, if your version has them, or Paint's rectangle.
  - Then add the picture without `--box`.
- **Or give its pixels**, and the page draws the box, which survives a theme change:
  - Windows: open the PNG in Paint. The bar at the bottom shows the cursor position. Note the
    top-left corner of the control, then its width and height.
  - Pass them as `--box left,top,width,height`.
  - Measure on the final file. If you shrink it later, measure again.

**Add it, one command per picture** (the path can contain spaces; keep the quotes):

```bash
node --import tsx scripts/setup_shot_add.mjs <id> "<path to the PNG>" [--box left,top,width,height]
node scripts/run_billing_tests.mjs --only client   # refuses a broken record or a box off the image
```

Then open `/empezar` (`npm run dev`, or a static build) on the right system track, and check the
picture and its box in light and dark mode. Adding your own capture for an id that had a reused
picture replaces it, credit included.

## Browser pages (`source: 'browser-script'`), on your own computer

```bash
npx playwright install chromium          # once, if Playwright has no browser yet
node --import tsx scripts/setup_screenshots.mjs --take
```

It captures `py-release-files`, `git-win-download` and `gh-signup-form` at 1280×800, logged out.
If a page changed and a selector no longer matches, it still saves the picture, without a box, and
prints `WARN`. Look at every new PNG before committing it.

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
