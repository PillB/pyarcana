# Independent Fixer Campaign Inventory

Updated: 2026-07-26 (America/Lima)

## Evidence rule

A section reaches `integrated` only after a fresh, one-section owner pass over every
theory subtopic and nested subsection, I Do, We Do, You Do, self-check and
authenticated assessment; hand-written fixes; section-scoped validation; an
independent report; and serial integration into the campaign branch. Earlier
Fixer reports or edits by other agents are context only and never completion
evidence for this campaign.

A batch reaches `deployed` only when its exact commit is pushed, merged into
`main`, the GitHub Pages workflow succeeds, and the public site is verified.

## Section inventory

| Section | State | Independent commit | Batch deployment | Notes |
|---|---|---|---|---|
| S01 | deployed | `e12ac52` + `7627dc1` + `65afe87` | `41038b2` | Text-first rewrite deployed with 13/13 theory/nested openings, 8/8 I Do, 24/24 We Do, You Do and 8/8 self-check explanations covered. |
| S02 | deployed | `ce8815c` + `1ab1cc3` + `4680406` | `41038b2` | Text-first rewrite deployed with 8/8 theory, 8/8 I Do, 24/24 We Do, You Do and 11/11 self-check explanations covered. |
| S03 | deployed | `d8f1b4a` + `7bc21e5` + `a202d30` | `41038b2` | Text-first rewrite deployed with 9/9 theory, 8/8 I Do, 24/24 We Do, You Do and 8/8 self-check explanations covered. |
| S04 | queued | `bf4111b` | `2e9fcd2` | Previously deployed correctness pass queued for text-first rewrite; its core lesson changed only 3 additions/3 deletions in the prior campaign. |
| S05 | queued | `9b9cda4` | `2e9fcd2` | Previously deployed correctness pass queued for visible text-first rewrite. |
| S06 | queued | `03ee8e3` | `2e9fcd2` | Previously deployed correctness pass queued for visible text-first rewrite. |
| S07 | queued | `0272f98` + `279e8c0` | `6f2a784` | Previously deployed correctness pass queued for visible text-first rewrite. |
| S08 | deployed | `0c06444` + `cb80d96` | `6f2a784` | Fresh owner and packet-ID follow-up deployed in B03. |
| S09 | deployed | `3939741` + `e727205` + `b3f9bab` | `6f2a784` | Fresh owner, closer correction and packet-ID follow-up deployed in B03. |
| S10 | pending | — | — | |
| S11 | pending | — | — | |
| S12 | pending | — | — | |
| S13 | pending | — | — | |
| S14 | pending | — | — | |
| S15 | pending | — | — | |
| S16 | pending | — | — | |
| S17 | pending | — | — | |
| S18 | pending | — | — | |
| S19 | pending | — | — | |
| S20 | pending | — | — | |
| S21 | pending | — | — | |
| S22 | pending | — | — | |
| S23 | pending | — | — | |
| S24 | pending | — | — | |
| S25 | pending | — | — | |
| S26 | pending | — | — | |
| S27 | pending | — | — | |
| S28 | pending | — | — | |
| S29 | pending | — | — | |
| S30 | pending | — | — | |
| S31 | pending | — | — | |
| S32 | pending | — | — | |
| S33 | pending | — | — | |
| S34 | pending | — | — | |
| S35 | pending | — | — | |
| S36 | pending | — | — | |
| S37 | pending | — | — | |
| S38 | pending | — | — | |
| S39 | pending | — | — | |
| S40 | pending | — | — | |
| S41 | pending | — | — | |
| S42 | pending | — | — | |
| S43 | pending | — | — | |
| S44 | pending | — | — | |
| S45 | pending | — | — | |
| S46 | pending | — | — | |
| S47 | pending | — | — | |
| S48 | pending | — | — | |
| S49 | pending | — | — | |
| S50 | pending | — | — | |
| S51 | pending | — | — | |
| S52 | pending | — | — | |

## Batch ledger

| Batch | Sections | State | Branch/PR | Merge SHA | Pages evidence |
|---|---|---|---|---|---|
| B01 | S01–S03 | deployed | [PR #5](https://github.com/PillB/pyarcana/pull/5) | `8fd2f1d` | [Pages run 30212218843](https://github.com/PillB/pyarcana/actions/runs/30212218843) succeeded; public HTTP/bundle verified. |
| B02 | S04–S06 | deployed | [PR #3](https://github.com/PillB/pyarcana/pull/3) | `2e9fcd2` | [Pages run 30209398271](https://github.com/PillB/pyarcana/actions/runs/30209398271) succeeded; public HTTP/bundle verified. |
| B03 | S07–S09 | deployed | [PR #7](https://github.com/PillB/pyarcana/pull/7) | `6f2a784` | [Pages run 30213167525](https://github.com/PillB/pyarcana/actions/runs/30213167525) succeeded; public HTTP/bundle verified. |
| T01 | S01–S03 | deployed | [PR #9](https://github.com/PillB/pyarcana/pull/9) | `41038b2` | [Pages run 30215320449](https://github.com/PillB/pyarcana/actions/runs/30215320449) succeeded; public HTTP and learner-content bundle verified. |
| T02 | S04–S06 | queued | — | — | Starts after T01 is merged and publicly verified. |
| T03 | S07 | queued | — | — | Starts after T02 is merged and publicly verified. |

## Text-first campaign diagnosis

- Learner feedback reported that S01–S07 did not visibly read as improved.
- The deployed site was current and healthy, so the primary defect was not a
  missing Pages deployment.
- Prior section work over-weighted assessment balance, practice identifiers,
  runtime truthfulness, playground/PDF identity, Spanish defects and CI
  contracts. Those fixes were necessary, but they did not guarantee a
  sustained learner-visible rewrite of the lesson body.
- The strongest quantitative warning is S04: its core lesson file changed by
  only three insertions and three deletions in the previous campaign.
- T01–T03 therefore require before/after prose evidence for every theory
  subtopic and for I Do, We Do, You Do and the closing retrospective. Existing
  technical and assessment gates remain mandatory and cannot be weakened.

## Batch T01 integrated validation note

- Independent owner coverage:
  - S01: 13/13 theory/nested openings, 8/8 I Do, 24/24 We Do, You Do and
    8/8 public self-check explanations.
  - S02: 8/8 theory, 8/8 I Do, 24/24 We Do, You Do and 11/11 public
    self-check explanations.
  - S03: 9/9 theory, 8/8 I Do, 24/24 We Do, You Do and 8/8 public self-check
    explanations.
- Before/after evidence and source-specific research caveats are recorded in
  the independent S01/S02/S03 reports and worklogs.
- Combined focused regression: 38/38 pass, including the deployed correctness
  contracts and the new text-first contracts.
- Scoped runtime: S01 9 pass/0 fail; S02 65/65; S03 65/65; P0=0/P1=0.
- Fleet gates: 52-section V3 counts/structure/invariants pass; first-use and
  glossary pass; S01–S03 self-check cycles are unchanged.
- Assessment: 1,248 authenticated questions / 416 concepts; P0=0/P1=0.
- TypeScript and repository-wide ESLint pass.
- Node adversarial: 54/54 pass.
- Full Python adversarial: 134 tests, 81 inherited failures and 1 skip; no
  S01–S03-owned failure heading. The failure count is unchanged from the
  post-B03 baseline while ten new text-first tests now run.
- Production static export compiles, type-checks and generates 3/3 pages.
  Local exported-site HTTP is 200.
- The built application bundle contains the new learner-visible S01
  distributed-team opener, S02 value/type bridge and S03 international-aid
  `0` versus `None` scenario.
- Generated runtime, exam, Spanish and first-use audit snapshots were restored
  before this inventory update.
- GitHub integration: PR #9 merged reviewed head `65b36f9` into `main` at
  `41038b2ea16978c5a685f680dfbcc952de7e8fe3`.
- GitHub Pages: run `30215320449` built and deployed successfully for that
  exact merge SHA.
- Public observation: `https://pillb.github.io/pyarcana/` returned HTTP 200
  with `last-modified: Sun, 26 Jul 2026 18:44:30 GMT`. The deployed learner
  page chunk SHA-256 was
  `2d5f809cde513a687e87f69f607cc5fc779463ad2682db1d8f58f184a5aa8932`
  and contained the new S01 `equipo distribuido`, S02 `habitantes de mundos
  distintos` and S03 `formulario internacional de ayuda` passages.

## Batch B03 validation note

- Independent focused contracts after packet-ID follow-up: S07 `6/6`, S08
  `6/6`, S09 `7/7`.
- Scoped runtime audits report S07 `64/64`, S08 `65/65` and S09 `64/64`,
  with P0=0 and P1=0.
- Learner-packet manifests expose all `24/24` canonical practice identifiers
  uniquely and in order for S07, S08 and S09.
- Authenticated banks are `6/6/6/6` overall and `2/2/2/2` per attempt.
- Fleet structure: 52 sections; V3 counts, structure and invariants pass with
  zero warnings.
- Authenticated assessment: 1,248 questions / 416 concepts; P0=0, P1=0.
- TypeScript, ESLint and the Node adversarial suite (`54/54`) pass.
- Full Python adversarial failures fall from the post-B01 baseline of `84` to
  `81`; S07–S09 disappear from the packet failures. Remaining failures are
  assigned to pending section owners.
- Production export: static compilation, TypeScript validation and 3/3 page
  generation pass; local exported site returns HTTP 200 and contains the
  corrected S07/S08/S09 playground and PDF mappings while preserving S01–S06.
- Generated validation JSON was restored before this inventory update.
- GitHub integration: PR #7 merged the reviewed head `4fc4ece` into `main` at
  `6f2a7849650ac6edcba4ecc21e6c449c2e036b1a`.
- GitHub Pages: run `30213167525` built and deployed successfully for that
  exact merge SHA.
- Public observation: `https://pillb.github.io/pyarcana/` returned HTTP 200
  with `last-modified: Sun, 26 Jul 2026 17:44:26 GMT`. The deployed script
  bundle SHA-256 was
  `95492612ed55d495b42d17f73e43eb03e69b3d58681f1ec1218e223aae95b9a8`
  and contained all corrected S07/S08/S09 playground titles and PDF labels
  while retaining the deployed S01–S06 mappings.

## Batch B01 recovery validation note

- Independent focused contracts after CI follow-up: S01 `9/9`, S02 `7/7`,
  S03 `7/7`.
- Reference execution: S02 and S03 each pass all `41` published code/output
  pairs; scoped runtime audits report S01 `9/9`, S02 `65/65` and S03 `65/65`.
- Learner-packet manifests expose all `24/24` canonical practice identifiers
  uniquely for S01, S02 and S03. S01 follows its exact section-varying
  self-check cycle; S03 locality density is `42`, below the active cap of `55`.
- Fleet structure: 52 sections; V3 counts, structure and invariants pass with
  zero warnings.
- Authenticated assessment: 1,248 questions / 416 concepts; P0=0, P1=0.
- S01 first-use and glossary checks pass with P0=0 and P1=0.
- TypeScript and ESLint pass.
- Production export: static compilation, TypeScript validation and 3/3 page
  generation pass; local exported site returns HTTP 200 and contains all three
  corrected playground and PDF mappings plus the typed S01 entrypoint.
- Full Python adversarial failures fall from `88` on the first PR head to `84`;
  S01–S03 disappear from the packet/locality failures. The remaining failures
  are assigned to pending section owners.
- Generated validation JSON was restored before this inventory update.
- GitHub integration: PR #5 merged the reviewed head `cfb7242` into `main` at
  `8fd2f1da2430f70c3444db4d1fc80235c04d4205`.
- GitHub Pages: run `30212218843` built and deployed successfully for that
  exact merge SHA.
- Public observation: `https://pillb.github.io/pyarcana/` returned HTTP 200
  with `last-modified: Sun, 26 Jul 2026 17:17:37 GMT`. The deployed script
  bundle SHA-256 was
  `70088bb346097fc6dad79e9f788f4133544af26d3ff4bbf8ab7669394959783b`
  and contained the typed S01 entrypoint plus the corrected S01/S02/S03
  playground titles and PDF labels.

## Batch B02 validation note

- Focused section contracts: S04 `5/5`, S05 `4/4`, S06 `5/5`.
- Fleet structure: 52 sections; V3 counts, structure and invariants pass with
  zero warnings.
- Authenticated assessment: 1,248 questions / 416 concepts; P0=0, P1=0.
- Production export: static compilation, TypeScript validation and 3/3 page
  generation pass; local exported site returns HTTP 200 with the expected
  PyArcana title.
- Broader adversarial suite: Node portion passes `54/54`. The Python portion
  reports the same `177` failure-signature lines and `88` failures on both the
  untouched `fdbbebc` baseline and B02. They belong to pending sections and
  stale fleet fixtures; B02 introduces no new failure signature and removes
  the baseline's single skip. These inherited failures remain assigned to
  their future independent section owners.
- GitHub integration: PR #3 merged the reviewed head `0a2bbc4` into `main` at
  `2e9fcd2f99584419a4db83222423d39cc6f0fc20`.
- GitHub Pages: run `30209398271` built, uploaded and deployed successfully for
  that exact merge SHA.
- Public observation: `https://pillb.github.io/pyarcana/` returned HTTP 200
  with `last-modified: Sun, 26 Jul 2026 16:01:15 GMT`. The deployed application
  bundle SHA-256 was
  `044eaf6ceb1138fb4520251967d7d16764092e57892d2711b42609ae24c46838`
  and contained the corrected S04/S05/S06 playground titles plus PDF labels
  `4. Iteración`, `5. Funciones` and `6. Colecciones`.
