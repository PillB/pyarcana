# Editorial brief — U1 · S18 experimentation and causal literacy

**Audience.** An adult learner ~18 sections into a Spanish-language applied
Python course, working through synthetic fintech data. Competent with pandas and
NumPy. Not a statistician.

**Reader's starting point (inside S18, before the insertion).** They can compute
centre, spread and quantiles (T1-A), robust metrics (T1-B), diagnose sampling
bias against population quotas (T2-A), build a z-interval and bootstrap a mean
and compute Cohen's *d* (T2-B), and they have just been told that correlation is
association, that a confounder Z can manufacture a spurious link, and that
residualising Z is "un chequeo de EDA, no un diseño causal completo" (T3-A).

**Purpose.** Give them the design that licenses the causal verb the section keeps
forbidding.

**Core question.** *¿Qué tiene que ser cierto sobre cómo se formaron los dos
grupos para que la diferencia entre ellos signifique algo causal?*

**Required outcome.** See `02_CURRICULUM_REQUIREMENTS.md` CR-01, points 1–7.

**Prerequisites, and where each is satisfied.**

| Needed idea | Taught in | Before insertion? |
|---|---|---|
| Media y desviación estándar | S18-T1-A | yes |
| Muestra vs. población, sesgo de selección | S18-T2-A | yes |
| Intervalo de confianza, error estándar | S18-T2-B | yes (same subtopic) |
| Tamaño de efecto (d de Cohen) | S18-T2-B | yes (same subtopic) |
| Confusor Z que crea asociación espuria | S18-T3-A | yes (same subtopic) |
| NumPy `default_rng`, boolean masks | S06, S14, and used throughout S18 | yes |

No forward reference. Nothing from S19+ is required.

**New terms, in order of introduction.**

1. `pregunta causal` / contrafactual — the "what would have happened otherwise".
2. `unidad`, `tratamiento`, `control`, `resultado (outcome)`, `estimando (estimand)`.
3. `asignación aleatoria` (randomisation).
4. `autoselección` — named as the failure mode, connecting to T2-A's bias and
   T3-A's confounder.
5. `valor p` (p-value) — defined precisely, with the two misreadings named.
6. `significancia práctica` vs `significancia estadística`.
7. `métrica primaria` and `métrica guardrail`.
8. `peeking` / pruebas múltiples.

Each is introduced in context, defined in Spanish, and demonstrated.

**Key claims and their evidence.**

- *Random assignment balances the groups in expectation on every characteristic,
  including ones nobody measured.* This is the definitional property of
  randomisation; it is demonstrated by running the same data-generating process
  twice — once with self-selection, once with a coin flip — and printing the
  confounder's mean in each arm.
- *A p-value is the probability of a result at least this extreme **if** there
  were no effect.* It is not the probability that there is no effect, and a large
  p-value is not proof of absence.
- *Statistical and practical significance are different questions.* Large n makes
  tiny differences detectable.

**Worked example.** A synthetic fintech "Plan Pro". Merchants with higher
baseline volume adopt it on their own; the naive comparison then attributes the
volume gap to the plan. The randomised pilot, drawing from the *same* population
with the *same* true effect, recovers the real number. Both arms printed side by
side, with the confounder's mean per arm, so the reader can see the mechanism
rather than take it on trust.

**Likely misconceptions, and how each is addressed.**
- "Randomisation makes the groups identical." → the demo prints two group means
  for the confounder that are close but not equal; the prose says *en promedio*,
  and the interval carries the residual uncertainty.
- "p < 0.05 means 95 % sure the effect is real." → named and corrected explicitly.
- "Not significant means no effect." → named and corrected explicitly.
- "A bigger sample makes the result more important." → the practical-significance
  paragraph.

**Limits to state.** One randomised experiment estimates the effect *for the
population it sampled, over the period it ran*. It does not transfer
automatically. Randomisation can fail in practice (broken assignment,
non-compliance, differential dropout). And most business data is observational —
the learner will usually not have an experiment, which is exactly why the honest
labelling discipline in T3-A remains the default.

**Backward link.** Closes T2-A (sampling bias), T2-B (effect + interval) and
T3-A (confounder) into one idea.

**Forward link.** S19 builds the accessible dashboard from this evidence; the
"primary metric + guardrail" vocabulary prepares the reporting discipline. No
concept from S19+ is required to read this.

**Project transfer.** `youDo` (CP-N2-B) gains one objective: state whether the
comparison is observational or experimental, and justify the verb used.

**Risks.** Voice drift (R-10); accidentally teaching a hypothesis-testing
procedure the course does not otherwise support — mitigated by teaching the
*interpretation* discipline rather than a test recipe, and by keeping the demo
to means, differences and an interval the learner already knows.
