# WEDO — CP-N4-C (Guided practice)

**Working order:** the instructor and learner implement one mechanism at a
time, running the relevant adversarial test after each.

## Exercise 1 — Add a new `allow` tool
**Goal:** prove the policy table is the source of truth, not the handler.

1. In `harness/tools.py`, add `"translate": "allow"` to `TOOL_POLICY`.
2. Register a handler in `ToolRegistry.__init__` that returns
   `{"text": args.get("text", "")[::-1]}`.
3. Write a small test in the WEDO scratchpad that calls
   `tools.call("translate", {"text": "abc"})` and asserts the result is
   `{"text": "cba"}`.
4. Re-run `tests/adversarial/test_n4c_harness.py` — all tests should still
   pass.

**Discussion:** why doesn't adding a handler without updating the policy
work? (Because `ToolRegistry.call` reads the policy first.)

## Exercise 2 — Tighten the budget
**Goal:** see the budget abort path trigger.

1. In `demo.py`, change the `Budget` to `Budget(max_cost=0.0, max_tokens=10)`.
2. Run the demo. It should exit non-zero with `stop_reason="budget_exceeded"`.
3. Restore the budget. Re-run; it should exit 0.

**Discussion:** where does the `BudgetExceeded` exception get caught and
turned into a `stop_reason`? (In `Copilot.run`.)

## Exercise 3 — Add a new red-team (esto es, equipo rojo: pruebas adversarias donde alguien intenta romper o engañar al sistema a propósito) case
**Goal:** extend the adversarial suite without breaking existing tests.

1. In `harness/evaluation.py`, add a case `rt-unknown-tool` if not already
   present (it is in the canonical list).
2. In `tests/adversarial/test_n4c_harness.py`, add a test that proposes
   `totally_unknown_tool` and asserts the result is `denied`.
3. Run the test file. The new test should pass on the first run.

**Discussion:** why is unknown-tool denial a *policy* decision and not a
*handler* decision? (Because the harness must be safe even when a handler
is accidentally registered for an unapproved tool.)

## Exercise 4 — Demonstrate rollback (esto es, revertir: volver al estado anterior conocido-como-bueno cuando algo falla)
**Goal:** prove rollback restores state.

1. Construct a `Copilot`, run a task, capture `state.run_id` and the step
   count.
2. Manually append a step to `state.steps` (simulating a bad mutation).
3. Call `RollbackManager(state).rollback()`.
4. Assert the step count is back to the original and `proof.ok is True`.

## What the learner should leave with
- Confidence editing the policy table, the budget, and the red-team list.
- A working rollback proof they wrote themselves.
- Habit: every change is followed by the adversarial suite.
