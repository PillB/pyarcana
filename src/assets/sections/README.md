# Section screenshots

Seven real screenshots inside course sections, approved by the owner on 2026-10-06 (decision D19
in `audit/fixer/decisions.md`). Everywhere else D4 still applies, and a section gets no
screenshot. An eighth needs a new owner decision, and `tests/adversarial/section-screenshots.test.ts`
pins the set.

- `shots.json` is the single source of truth for each picture: its credit, licence, licence
  file, changes, date consulted, alt, caption, and the product guide linked under it.
- `index.ts` imports the PNGs, so the build emits them under `_next/static/media`. Never move
  them to `public/`.
- A section block places a picture with `screenshots: [{ id, after }]`.

Survey, sources and validation: `audit/section-screenshots/`. Placement and trade-offs:
`audit/section-screenshots/INSERTED.md`.
