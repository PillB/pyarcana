# Section screenshots: survey and staged images

Pablo asked, on 2026-10-06, for real screenshots in the 52 sections wherever one helps a learner
operate a real interface. This folder holds the result of that survey, so that a thread without
network access can insert the images.

## How the survey was done

- **Who did it:** four agents, one per range of sections (`survey/batch-1.json` … `batch-4.json`).
  They worked to the same brief (`survey/BRIEF.md`).
- **Rule 1 of the brief:** a screenshot only goes where a theory block asks the learner to *use*
  a graphical interface: click, find a button, read a screen.
  - Text output stays as text (WCAG 1.4.5).
  - Concepts are already covered by the SVG figures.
- **Rule 2:** only licences that allow reuse with attribution (CC BY, MIT, Apache-2.0, PSF).
  - NonCommercial licences are refused. For example, the Hugging Face model-card screenshot (CC BY-NC-SA) was refused.
  - No personal data.
  - No image that teaches the wrong thing.
- **Validation:** every candidate was checked by hand on 2026-10-06.
  - The image was viewed.
  - The anchor sentence was found verbatim in the section file.
  - The licence was read from the source repository's LICENSE file.
  - Crops are listed in `manifest.json` → `changes`.

## Result: 7 images in 3 sections

| File | Section · block | Licence | Confidence |
|---|---|---|---|
| `s01-compare-pr-banner.png` | S01 · Pull Request: pedir revisión antes de integrar | CC BY 4.0 (github/docs) | high |
| `s01-pr-files-changed-tab.png` | S01 · Pull Request: pedir revisión antes de integrar | CC BY 4.0 (github/docs) | medium |
| `s01-new-repository-menu.png` | S01 · Ramas, Pull Requests y recuperación segura (S01-T3-B) | CC BY 4.0 (github/docs) | high |
| `s01-vscode-extensions-python.png` | S01 · Componentes del stack que vamos a instalar | CC BY 3.0 US (vscode-docs) | medium |
| `s01-ruff-quickfix-f401.png` | S01 · VS Code y Ruff como calidad mínima (S01-T4-A) | MIT (ruff-vscode) | medium |
| `s23-trace-viewer.png` | S23 · Trace, screenshot y logs (S23-T3-A) | Apache-2.0 (playwright) | high |
| `s44-merge-blocked.png` | S44 · branch/review policy y release notes (S44-T4-A) | CC BY 4.0 (github/docs) | medium |

Sections S02 to S22, S24 to S43 and S45 to S52 get none. Their interfaces are simulated in
Python, or they are text, or they are the learner's own product. The reason for each one is in
`survey/batch-*.json` → `considered_and_rejected`.

## Caveats the insertion must carry

- **`s01-vscode-extensions-python.png`:**
  - The crop removes the VS Code logo, which is a Microsoft trademark the licence does not cover.
  - The version number shown will differ from the learner's.
- **`s01-ruff-quickfix-f401.png`:**
  - This is one frame of the GIF in the ruff-vscode README. The GIF is hosted on
    user-images.githubusercontent.com, not committed to the repository tree.
  - The code shown is FastAPI's (MIT).
  - The block teaches the learner to delete the import, not to use the automatic fix. The caption says so.
- **`s23-trace-viewer.png`:** the official test is JavaScript (`example.spec.ts`). The viewer is
  the same from Python. The caption says so.
- **`s44-merge-blocked.png`:** here the blocking rule is code quality, not required reviews. The
  caption says the notice looks the same.
