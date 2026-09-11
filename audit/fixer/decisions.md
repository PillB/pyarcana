# Standing decisions for the fixer campaign

Binding on every section from S01 onward. Each entry records who decided it and why,
so a later round does not quietly reverse it.

## D1 — Gloss every term inline, including in preview surfaces
*Decided 2026-09-11 by the repo owner, at the S01 boundary.*

The tagline, `learningOutcomes` and `jobRelevance` are **not** exempt from
define-before-use. A learner who reads only the outcomes must not meet a word the
course has not explained. If an outcome names a term the learner has not met in an
earlier section, gloss it in place — a short parenthetical or an em-dash appositive,
the way S01 now writes "el intérprete Python correcto (el programa que ejecuta tu
código)".

Rejected alternative: exempting preview surfaces and only requiring the term to be
defined before an exercise needs it. Rejected because outcomes are the first thing a
learner reads and the place they decide whether the section is for them.

## D2 — Synthetic records carry no DNI
*Decided 2026-09-11 by the repo owner, at the S01 boundary, closing S01-U02.*

Course material must **not** generate, print or store a Peruvian DNI, not even a
"ficticio" one. Drop the field from synthetic records entirely.

The audit raised this and codex declined to invent a pattern, correctly: any made-up
DNI range risks colliding with a real, issued identifier, which is the exact harm the
"use fake data" instruction exists to prevent. Removing the field has zero collision
risk and nothing in the curriculum depends on having one.

When a section needs a per-person key, use an opaque internal id (`cliente_id`,
`CLI-0001`) and say plainly that real national identifiers never belong in practice
data or in a repository. Applies to S01, S02, S03, S07, S09, S11, S22, S41 and S52,
which mention DNI today.
