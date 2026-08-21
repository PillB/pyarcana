# Software requirements

What the application must do for the new content to be correct and visible.

| ID | Requirement | Verified how |
|---|---|---|
| SR-01 | New teaching enters as additional `TheoryBlock` objects in `section.theory[]`, each carrying an **existing** `subtopicId` | `v3_invariant_validator.py` still reports 8 distinct subtopics |
| SR-02 | `TheoryBlock` shape honoured: `heading: string`, `paragraphs: string[]`, optional `code: CodeExample`, optional `callout: Callout` | `tsc --noEmit` |
| SR-03 | `TheoryTab` renders every element of `section.theory` — additions appear with no renderer change | Read of `SectionView.tsx:400-420`; confirmed by render inspection |
| SR-04 | `callout.type` restricted to `'info' \| 'warning' \| 'success' \| 'tip' \| 'danger'` | `tsc --noEmit` |
| SR-05 | Every `code.output` declared must be the **actual** stdout of the snippet | Snippet executed locally; `python_content_runtime_audit.py` re-executes it |
| SR-06 | Code must run on the audit's interpreter — **Python 3.9.6** | Executed on `python3` 3.9.6 before insertion |
| SR-07 | Code must not require an absent optional dependency | `pyarrow`, `duckdb`, `polars` confirmed **absent**; new S15 code uses the standard library only |
| SR-08 | No exercise ID added, removed or renamed | 1248-ID set diffed before/after |
| SR-09 | No `demoId` added or removed | Baseline diff |
| SR-10 | New glossary terms declare a `firstSectionId` that is the earliest section where the term appears | `glossary_intro_audit.py` forward-ref count must not rise above the pre-existing 2 |
| SR-11 | Static export must still build for GitHub Pages | `npm run build:static` |
| SR-12 | New prose must not break `RichText` — headings and `**bold**` follow existing conventions in the same file | Render inspection |

## Data-model note

`section.theory` is a plain array with no length invariant anywhere in the test
suite. `subtopicId`, `demoId` and exercise `id` are the constrained identities.
This asymmetry is the whole reason a content-only campaign is possible here.
