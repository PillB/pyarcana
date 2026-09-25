#!/usr/bin/env python3
"""One writer at a time for the shared reports under course-state/.

Every audit here writes a report to a fixed path, and `tools/fixer/gate.py` measures a round
by running those audits and reading what they wrote. Two of them running at once means one
process reads the other's numbers.

This is not hypothetical twice over. LEDGER_NOTES records S44, where a file changed between
snapshot and gate-check and fifteen patches were lost. On 2026-09-24 it happened from the
other side: an analysis agent was invited to run these scripts "read-only" while a gate was
measuring S24, and the gate reported 40 snippet failures against content that has none - the
same audit, on the same patches, with nothing else running, reports 3305 passes and 0
failures. A round was restored over another process's report.

So the rule is mechanical rather than remembered. `gate.py` claims the lock for the whole of
a snapshot or check and passes its token down to the audits it runs itself; any other
invocation refuses and says who holds it.

Deliberately advisory, not an OS lock: the aim is a loud, readable refusal for a human or an
agent that started a second audit by hand, not to serialise unrelated work. A stale lock from
a killed gate is reported with its pid so it can be judged rather than silently ignored.
"""
from __future__ import annotations

import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
#: Overridable so a test can exercise the real refusal path, in a real subprocess, without
#: touching the lock a live gate is holding. The first version of those tests deleted and
#: rewrote this very file while a gate was measuring, which is the hazard this module exists to
#: prevent - and it produced one spurious gate failure before anyone noticed.
LOCK = Path(os.environ.get("PYARCANA_REPORT_LOCK_PATH") or (ROOT / ".fixer/reports.lock"))
#: The token a gate passes to the audits it launches, so its own children are not refused.
ENV = "PYARCANA_REPORT_LOCK"


def _shown(p: Path) -> str:
    """Repo-relative when it is inside the repo, absolute otherwise.

    `relative_to` RAISES for a path outside ROOT, and the lock path is overridable - so the
    error message meant to help a stuck human crashed instead, inside the very branch that
    only runs when something has gone wrong.
    """
    try:
        return str(p.relative_to(ROOT))
    except ValueError:
        return str(p)


def holder() -> str | None:
    """The token of the run holding the lock, or None when it is free."""
    try:
        return LOCK.read_text(encoding="utf-8").strip() or None
    except FileNotFoundError:
        return None


def refuse_if_busy(script: str) -> None:
    """Exit loudly when another run owns the reports. Call before writing one."""
    held = holder()
    if held is None or os.environ.get(ENV) == held:
        return
    print(
        f"REFUSED: {script} writes a shared report under course-state/, and a gate run is\n"
        f"         measuring right now (lock token {held}). Its numbers and yours would\n"
        f"         overwrite each other, which has already cost two rounds.\n"
        f"         Wait for it, or remove {_shown(LOCK)} if that run is dead.",
        file=sys.stderr,
    )
    raise SystemExit(3)


class held_by_this_run:
    """Context manager a gate wraps its measuring in.

    Re-entrant for the same token, so a gate that measures twice in one process does not
    deadlock against itself, and it never removes a lock another run owns.
    """

    def __init__(self, token: str | None = None) -> None:
        self.token = token or f"{os.getpid()}"
        self._ours = False

    def __enter__(self) -> "held_by_this_run":
        current = holder()
        if current is not None and current != self.token:
            print(
                f"REFUSED: another gate run holds the report lock (token {current}).\n"
                f"         Two gates measuring at once read each other's reports.",
                file=sys.stderr,
            )
            raise SystemExit(3)
        if current is None:
            LOCK.parent.mkdir(parents=True, exist_ok=True)
            LOCK.write_text(self.token, encoding="utf-8")
            self._ours = True
        os.environ[ENV] = self.token
        return self

    def __exit__(self, *exc: object) -> None:
        if self._ours and holder() == self.token:
            LOCK.unlink(missing_ok=True)
