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
| S01 | active | — | — | Fresh recovery owner pass in progress; lost ephemeral work is not accepted as evidence. |
| S02 | active | — | — | Fresh recovery owner pass in progress; lost ephemeral work is not accepted as evidence. |
| S03 | active | — | — | Fresh recovery owner pass in progress; lost ephemeral work is not accepted as evidence. |
| S04 | deployed | `bf4111b` | `2e9fcd2` | Fresh owner report, focused tests and section-scoped product fixes deployed in B02. |
| S05 | deployed | `9b9cda4` | `2e9fcd2` | Fresh owner report, focused tests and section-scoped product fixes deployed in B02. |
| S06 | deployed | `03ee8e3` | `2e9fcd2` | Fresh owner report, focused tests and section-scoped product fixes deployed in B02. |
| S07 | parked | `0272f98` | — | Fresh local owner commit preserved; integration deferred until B01 recovery deploys. |
| S08 | parked | `0c06444` | — | Fresh local owner commit preserved; integration deferred until B01 recovery deploys. |
| S09 | parked | `3939741` | — | Fresh local owner commit preserved; integration deferred until B01 recovery deploys. |
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
| B01 | S01–S03 | active | `agent/independent-recovery-s01-s03` | — | Fresh recovery owner passes active; lost ephemeral commits remain inadmissible. |
| B02 | S04–S06 | deployed | [PR #3](https://github.com/PillB/pyarcana/pull/3) | `2e9fcd2` | [Pages run 30209398271](https://github.com/PillB/pyarcana/actions/runs/30209398271) succeeded; public HTTP/bundle verified. |
| B03 | S07–S09 | parked | local commits `0272f98`, `0c06444`, `3939741` | — | Fresh owner commits preserved locally; review, integration and deployment resume after B01. |

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
