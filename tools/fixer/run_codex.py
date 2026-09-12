#!/usr/bin/env python3
"""Run one codex authoring call with a deadline and retries.

S06 hit `stream disconnected before completion: Transport error` and the CLI spent
five and a half hours reconnecting before giving up, taking the whole chain with it.
A transient network fault should cost a retry, not an afternoon.

macOS ships no coreutils `timeout`, so the deadline is enforced here.
"""
from __future__ import annotations

import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

TIMEOUT_S = int(__import__("os").environ.get("FIXER_TIMEOUT_S", "1800"))   # 30 min
ATTEMPTS = int(__import__("os").environ.get("FIXER_ATTEMPTS", "3"))

TRANSIENT = (
    "stream disconnected",
    "Transport error",
    "network error",
    "error decoding response body",
    "Reconnecting",
    "connection reset",
    "timed out",
)
# Retrying these just burns quota
FATAL = (
    "usage limit",
    "rate limit",
    "Upgrade to Pro",
    "purchase more credits",
    "not authenticated",
    "invalid model",
)


def main() -> int:
    tag, model, effort = sys.argv[1], sys.argv[2], sys.argv[3]
    prompt = ROOT / f".fixer/{tag}.prompt.txt"
    out = ROOT / f".fixer/{tag}.result.json"
    log = ROOT / f".fixer/{tag}.codex.log"

    cmd = [
        "codex", "exec", "-m", model, "-c", f"model_reasoning_effort={effort}",
        "-C", str(ROOT), "-s", "read-only",
        "--output-schema", "tools/fixer/schema/content_patch.schema.json",
        "-o", str(out), "-",
    ]

    for attempt in range(1, ATTEMPTS + 1):
        out.unlink(missing_ok=True)
        started = time.time()
        with open(prompt, "rb") as stdin, open(log, "wb") as logf:
            proc = subprocess.Popen(cmd, stdin=stdin, stdout=logf, stderr=subprocess.STDOUT, cwd=ROOT)
            try:
                rc = proc.wait(timeout=TIMEOUT_S)
            except subprocess.TimeoutExpired:
                proc.kill()
                proc.wait()
                rc = -1
                print(f"    attempt {attempt}: exceeded {TIMEOUT_S}s deadline, killed")

        elapsed = int(time.time() - started)
        text = log.read_text(encoding="utf-8", errors="replace")[-4000:]

        if rc == 0 and out.exists() and out.stat().st_size > 0:
            print(f"    codex ok in {elapsed}s (attempt {attempt})")
            return 0

        if any(f.lower() in text.lower() for f in FATAL):
            line = next((l for l in text.splitlines() if any(f.lower() in l.lower() for f in FATAL)), "")
            print(f"    codex hit a hard limit, not retrying: {line.strip()[:160]}")
            return 2

        transient = rc == -1 or any(t.lower() in text.lower() for t in TRANSIENT)
        if transient and attempt < ATTEMPTS:
            backoff = 30 * attempt
            print(f"    attempt {attempt} failed after {elapsed}s (transient); retrying in {backoff}s")
            time.sleep(backoff)
            continue

        print(f"    codex failed after {elapsed}s (rc={rc}, attempt {attempt})")
        print("    " + "\n    ".join(text.strip().splitlines()[-6:]))
        return 1

    return 1


if __name__ == "__main__":
    raise SystemExit(main())
