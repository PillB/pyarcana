# How to wait for a round, and how not to

A waiter once polled `pgrep -f "run_round.sh S04"` for eight hours after S04 had
finished. `pgrep -f` matches against full command lines, and the waiter's own shell
command *contained that string*, so it matched itself forever. The round was done in
twelve minutes; nothing moved for the rest of the day.

**Wait on a marker file the work itself creates:**

```bash
rm -f .fixer/chain.done
nohup bash -c 'bash tools/fixer/run_chain.sh S05 S06 > .fixer/chain1.log 2>&1;
               echo done > .fixer/chain.done' >/dev/null 2>&1 &

until [ -f .fixer/chain.done ]; do sleep 60; done
```

The marker is written by the same shell that ran the work, so it appears exactly once,
when the work is actually over, whether it succeeded or failed.

**If a liveness check is unavoidable**, match on something that cannot appear in the
watcher — a PID captured at launch (`$!`), not a pattern:

```bash
bash tools/fixer/run_chain.sh S05 & CHAIN_PID=$!
while kill -0 "$CHAIN_PID" 2>/dev/null; do sleep 60; done
```

**Never** edit `run_chain.sh` or `run_round.sh` while a chain is running. Bash reads a
script incrementally as it executes; rewriting the file underneath it can make it run
half of the old text and half of the new.
