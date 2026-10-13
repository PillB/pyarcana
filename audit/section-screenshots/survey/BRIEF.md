# Brief for the section-screenshot survey (read fully before starting)

Repository: /home/user/pyarcana (read-only for you: DO NOT edit any repository file, DO NOT commit).
Write only inside /tmp/claude-0/-home-user-pyarcana/3b658b44-f888-568f-a7db-e2758a435808/scratchpad/sections-shots/.

Context: PyArcana is a 52-section Spanish (Peru) Python/data course. Section files live in
src/lib/course/sections/*.ts (protected; read only). File slugs are misleading: read each file's
`title` and the active order in src/lib/course/index.ts (sectionNN). Theory blocks have `heading`,
`paragraphs`, optional `subtopicId` (e.g. S21-T2-A), `code`, `callout`, `figure` (SVG diagrams).

The owner wants REAL screenshots added where they are pedagogically helpful. Your job: find WHERE,
and find a REAL, LEGALLY REUSABLE image for each place. Another session will insert them.

## When a screenshot earns its place (all must hold)
1. The learner must operate or recognise a GRAPHICAL interface at that point (an editor panel, a web
   UI, a dashboard, a dialog, an app window), and the LAYOUT is the information (where to click,
   what the screen looks like when it works). Name the exact theory block (heading + subtopicId if
   any) and quote the sentence(s) that ask the learner to use that UI.
2. It is NOT text output. Terminal output, code, logs, tables printed by pandas, error messages stay
   as text (WCAG 1.4.5 images of text; the course already shows them as code blocks). Reject those.
3. It removes work the prose does badly (rule D5). A decorative or "nice to have" picture is rejected.
4. An existing SVG figure does not already cover it.

## Where images may come from (in order of preference)
- The tool's OFFICIAL documentation SOURCE REPOSITORY on GitHub (clone with
  `git clone --depth 1 --filter=blob:none --sparse <url>`, list with `git ls-tree -r --name-only HEAD`,
  download with https://raw.githubusercontent.com/<owner>/<repo>/<branch>/<path>; if the download is
  a ~130-byte "version https://git-lfs..." text file, use
  https://media.githubusercontent.com/media/<owner>/<repo>/<branch>/<path>). Verify with `file`.
- Read the repo's LICENSE file and record the licence EXACTLY.
- ALLOWED licences (commercial use with attribution is required; PyArcana Pro is paid): CC BY 4.0,
  CC BY 3.0 (incl. US), MIT, Apache-2.0, BSD-2/3-Clause, PSF. CC BY-SA 4.0 only if the image would
  be shown unmodified. REJECT NonCommercial (CC BY-NC*), unlicensed, "all rights reserved", and
  images from blogs/tutorial sites/Stack Overflow.
- Most documentation websites may be blocked by the sandbox proxy; GitHub (git clone, raw,
  media.githubusercontent.com) works. Do not retry a blocked host more than once.

## Validate before proposing
- Download the candidate to sections-shots/img/<section>-<short-id>.<ext> and LOOK at it with the
  Read tool. Reject if: it shows a different product or a very old UI, it is a power-user
  layout that would confuse a learner, the thing to see is unreadable, it is an animated GIF needing
  playback to make sense (a still frame is fine only if self-explanatory), or it contains personal data.
- Prefer images that already show the relevant state; note if a crop would help (another session crops).

## Output: JSON file sections-shots/batch-<N>.json
{ "batch": N, "sections_reviewed": ["S01",...], "candidates": [ {
  "section": "S21", "file": "s21-fastapi.ts", "section_title": "...",
  "block_heading": "...", "subtopicId": "S21-T2-A" | null, "anchor_quote": "exact sentence(s) from the block",
  "ui": "what interface", "why": "what learner failure this prevents (one or two sentences)",
  "image": "img/S21-swagger.png", "image_source_url": "https://github.com/.../blob/main/...",
  "licence": "MIT", "licence_file_url": "https://github.com/.../blob/main/LICENSE",
  "image_shows": "precise description of what is in the image", "crop_suggestion": null | "...",
  "alt_es": "Spanish alt text describing the picture, incl. the words on screen",
  "caption_es": "one Spanish sentence; say if the image's version/names differ from the learner's",
  "confidence": "high|medium" } ],
  "considered_and_rejected": [ {"section":"S..","where":"...","reason":"..."} ] }
Be selective: quality over quantity. It is fine for most sections to have zero candidates.
Spanish text: sentences of 32 words or fewer, English only for on-screen labels.
