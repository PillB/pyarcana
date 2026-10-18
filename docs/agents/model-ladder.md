# The model ladder for subagents

This page is the policy every orchestrating agent follows when it hands work to Claude subagents.
It is the owner's rule, restated on 2026-10-13 and refined on 2026-10-17. The rule is to start on
Haiku and hand a task up to Sonnet, and then to Opus, only when the task keeps failing. Here
"failing" means verified failure: an independent check says the work is wrong, and the drafter's
own report never counts as evidence.

Codex (gpt-5.6-sol through `tools/fixer/run_codex.py`) still writes every learner-facing word. The
ladder governs only the Claude agents that build, check and review around it.

## Why a ladder, and why it learns

The aim is to keep the cost of each *completed* task low, which is not the same as keeping each
attempt cheap. A cheap attempt that has to be redone costs more than a stronger first one, so a
cheap model is worth trying only when it usually succeeds.

Anthropic's own guide to choosing a model recommends this efficiency-first start: begin with
Haiku, test it, and upgrade only for a specific capability gap, with sub-agent tasks among Haiku's
listed uses ([Choosing the right model](https://platform.claude.com/docs/en/about-claude/models/choosing-a-model)).
The same guide notes that the `effort` setting is often a better lever than a model change.

The research on model cascades says the same thing from the other side. A cascade, which tries
the cheaper model first and moves up when the answer is rejected, works only if the rejection
comes from an independent scorer, and only if that scorer costs less than simply running the
stronger model (FrugalGPT, Chen, Zaharia and Zou, 2023; Fanconi and van der Schaar, NeurIPS 2025).
A cascade that never learns keeps paying for doomed cheap attempts on work its cheapest model
cannot do. That is why a router that picks the starting model for each class of task can beat a
fixed cascade (Bouchard, 2026). The ladder below therefore learns by task class.

## The rules

1. **Start on Haiku, and let verified failure teach the class.** A new task starts on Haiku. Once a
   class of task has failed on Haiku twice, verified, that class starts on Sonnet from then on.
   Every fifth task of a promoted class probes Haiku again, so that the lesson is re-tested instead
   of frozen.
2. **What counts as a failure, and so hands the task up.**
   - An independent verifier's own run fails: tests, `tsc`, a mutation it re-runs, or an empty
     diff where work was required.
   - A reviewer's blocker or major finding survives a second agent's attempt to refute it.
   - The structured output fails after the harness has used up its own retries.
   - The agent breaks an explicit stop condition of its task.
3. **What never hands the task up.**
   - A blocked dependency (a quota, rate-limit, auth or outage refusal) stops the run, and the
     owner is told; this is AGENTS.md's "a blocked dependency is a stop, not a retry".
   - A worktree-budget refusal, or an infrastructure stall, resumes on the same model, because a
     bigger model would hit the same missing directory.
   - A question that only the owner can answer goes to the owner.
   - A minor finding is fixed on the same model.
4. **How many tries each model gets.** A model gets two tries when its first failure is about the
   content, meaning a wrong fix that the failure text can correct. It gets one try when the failure
   is a capability signature: a schema failure, returning while its own long process still runs, or
   ignoring a stop condition. Those hand up at once, because a second try on the same model tends
   to repeat them.
5. **Effort before the owner, at the top only.** Opus runs at its default effort and retries at
   `xhigh` before the task goes to the owner with its evidence. Below Opus, a hand-up is a model
   change.
6. **The verifier is one level up, and independent.** A Haiku drafter gets a Sonnet verifier and
   reviewer, a Sonnet drafter an Opus one, and an Opus drafter another Opus. The verifier works in
   its own small worktree and re-runs at least one of the drafter's claimed mutations.
7. **Every hand-up carries the evidence.** The next model receives the verified failure text and
   the branch the last attempt left, and continues from there instead of starting over.
8. **Every attempt is recorded.** One ledger line per attempt holds the class, model, attempt,
   verdict and cause, and the ledger decides class promotions. Each pull request body names the
   model and attempt that produced its work.

## Promoted classes

| class | starts on | since | evidence |
|---|---|---|---|
| `codex-apply-fix`: a multi-step fix that drives a long external process (Codex, the full suites) and returns a structured report | Sonnet | 2026-10-17 | Two verified Haiku failures on the S12/S13 round 9: the first attempt returned while its Codex run was still working, so the bank never changed; the second did the work but failed its report schema five times. |

Everything else starts on Haiku. Haiku has done well as a reviewer paired with a Sonnet
confirmer, as an auditor and as a drafter: 54 runs between 13 and 17 October, none empty.

## Workflow mechanics (lessons of 2026-10-17)

- Wrap every `agent()` call in try/catch. A structured-output retry cap throws, and an uncaught
  throw aborts the whole workflow instead of handing the task up.
- Keep report schemas small, with a verdict, a short summary and the path of an evidence file;
  the detail goes in that file. Large schemas were the cause of the five schema failures.
- When a task starts a long process, require an explicit wait-loop, and have the verifier check
  first that the work exists at all (a non-empty diff, the expected file).
- Make worktrees only with `.claude/hooks/small_worktree.sh`, keep at most two alive at once under
  the 1 GB budget, and archive `.fixer/` before releasing a worktree, because `--remove` deletes it.

The reusable implementation is a workflow script, `model-ladder.js`. It takes the task, its class,
the verifier's checks, the review focus and the starting model from the ledger. Its two recreation
tests, an agent call that throws and an agent that reports done without doing the work, must both
hand up rather than abort.
