# Self-hosted fonts

PyArcana's four typefaces (Inter, JetBrains Mono, Cormorant Garamond, Marcellus) are committed
here and loaded with `next/font/local`, so `bun run build` and `bun run build:static` never
fetch fonts.

## Why

`next/font/google` downloads Google's CSS and font files at build time. Next.js 16.1.3 assumes
every font URL in that CSS ends in `.woff2` (or another known extension):
`/\.(woff|woff2|eot|ttf|otf)$/.exec(googleFontFileUrl)[1]` in
`next/dist/compiled/@next/font/dist/google/loader.js:122`. Google sometimes answers with an
extensionless `https://fonts.gstatic.com/l/font?kit=…` URL instead (about 1 response in 60,
[vercel/next.js#99114](https://github.com/vercel/next.js/issues/99114)). The build then dies
with `TypeError: Cannot read properties of null (reading '1')`, as CI's platform builds did
twice on PillB/pyarcana#108. The upstream fix,
[vercel/next.js#100158](https://github.com/vercel/next.js/pull/100158), is only on canary
(16.5.0-canary.13 and later). Even with that fix, the build still needs Google to be up and
reachable. Self-hosting removes the dependency instead.

## What is here

| Path | What it is |
|---|---|
| `<family>/<subset>.woff2` | The exact files Google Fonts served `next/font/google` (same CSS2 URL, same User-Agent), one per subset. |
| `<family>/OFL.txt` | Each family's licence, from [google/fonts](https://github.com/google/fonts). |
| `google-fonts.lock.json` | Provenance: the CSS2 URL, then for every face its subset, weight, unicode-range, Google URL and SHA-256. It also holds next/font/google's fallback metrics. |
| `index.ts` | **Generated.** One `localFont` call per Google subset. |
| `fallbacks.css` | **Generated.** The size-adjusted fallback faces. |

`index.ts` reproduces the `@font-face` rules `next/font/google` produced:

- the same files, `unicode-range`, `font-weight`, `font-style` and `font-display`;
- the same family names (`declarations` sets `font-family`), in Google's order;
- the latin files preloaded and nothing else, as `subsets: ["latin"]` did;
- the same CSS variables, each holding the family plus its fallback.

`next/font/local` would compute its own fallback metrics, which differ by up to 3% from the ones
`next/font/google` uses. So `adjustFontFallback` is off, and `fallbacks.css` declares next/font/google's
values instead.

## Updating

Never edit `index.ts` or `fallbacks.css` by hand. To change a family or weight, or to pick up a
newer version from Google:

1. Edit `FAMILIES` in `scripts/vendor_google_fonts.mjs`.
2. Run `node scripts/vendor_google_fonts.mjs`. It needs the network and rewrites this folder. Behind an
   HTTPS proxy on Node 22, set `NODE_USE_ENV_PROXY=1`.
3. Run `node scripts/vendor_google_fonts.mjs --check`. It works offline and confirms every file
   matches the lock and both generated files are current.
4. Rebuild, then compare the rendering before and after the change.

## Licences

All four families are under the SIL Open Font License 1.1. Its condition 2 asks that each
copy ship with the copyright notice and the licence, hence an `OFL.txt` beside each family's files.
Marcellus's licence declares the Reserved Font Name "Marcellus". The OFL FAQ (2.6) counts a
subset as a modified version, which "would not normally allow the use of RFNs". These are
Google's unmodified subset files under the name Google serves them with. The deployed site
already served exactly these bytes before this change, because `next/font/google` self-hosts
what it downloads. What is new is the copy in this repository.
