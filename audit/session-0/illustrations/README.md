# Provenance of the 11 Sesión 0 illustrations

- **Source.** Pablo's `setup_screenshot_reference_pack.zip` (6 Oct 2026): 11 PNGs, 1600×1000,
  which he described himself as "illustrative recreations … not literal captures".
  `pack-shots.json` is the pack's own metadata, unchanged.
- **The edits.** `clean_pack.py` (first pass) and `clean_pack2.py` (second pass) make every change
  to the pictures. They run with Pillow and expect the unzipped pack in `pack/` beside them.
  Each change is also summarised in the picture's record (`illustration.basis` in
  `src/assets/setup/shots.json`).
- **Why each edit was made:** `audit/session-0/PLAN.md`, MUST 1a.
- **Replacing one.** Take a real capture and add it with `scripts/setup_shot_add.mjs`. That
  replaces the illustration's record and its picture.
