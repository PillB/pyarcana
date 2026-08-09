"""CP-N1-B acceptance script."""
from __future__ import annotations

import json
import os
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))


def main() -> int:
    fixtures = os.path.join(HERE, "fixtures")
    if not all(os.path.exists(os.path.join(fixtures, f)) for f in ("clients.csv", "transactions.json")):
        print(f"  ❌ fixtures missing — run python3 generator.py --output fixtures/", file=sys.stderr)
        return 1
    failures: list[str] = []
    with tempfile.TemporaryDirectory() as td:
        sources = [os.path.join(fixtures, "clients.csv"), os.path.join(fixtures, "transactions.json")]
        # First run
        r1 = subprocess.run([sys.executable, os.path.join(HERE, "solution.py"),
                             "--sources", *sources, "--outdir", td],
                            capture_output=True, text=True)
        if r1.returncode != 0:
            failures.append(f"first run failed: {r1.stderr}")
        m1 = json.load(open(os.path.join(td, "manifest.json")))
        if m1["accepted_count"] + m1["quarantined_count"] < 1:
            failures.append("no rows processed")
        if m1["quarantined_count"] == 0:
            failures.append("no malformed rows quarantined — generator may be missing edge cases")
        # Idempotency: second run must produce identical manifest
        td2 = tempfile.mkdtemp()
        r2 = subprocess.run([sys.executable, os.path.join(HERE, "solution.py"),
                             "--sources", *sources, "--outdir", td2],
                            capture_output=True, text=True)
        m2 = json.load(open(os.path.join(td2, "manifest.json")))
        if m1 != m2:
            failures.append("manifest not deterministic across reruns")
        # Accepted/quarantined files exist and are well-formed JSONL
        for f in ("accepted.jsonl", "quarantined.jsonl"):
            p = os.path.join(td, f)
            if not os.path.exists(p):
                failures.append(f"missing output {f}")
                continue
            for line in open(p, encoding="utf-8"):
                line = line.strip()
                if not line:
                    continue
                try:
                    obj = json.loads(line)
                except json.JSONDecodeError:
                    failures.append(f"{f} contains non-JSON line")
                    break
                if f == "accepted.jsonl" and "_provenance" not in obj:
                    failures.append("accepted row missing provenance")
                if f == "quarantined.jsonl" and "_reason" not in obj:
                    failures.append("quarantined row missing reason")
        # Manifest records input hashes
        if not m1.get("input_hashes"):
            failures.append("manifest missing input hashes")
        # Empty-input handling
        empty = os.path.join(td, "empty.csv")
        open(empty, "w").write("")
        r3 = subprocess.run([sys.executable, os.path.join(HERE, "solution.py"),
                             "--sources", empty, "--outdir", os.path.join(td, "empty_out")],
                            capture_output=True, text=True)
        if r3.returncode != 0:
            failures.append("empty input crashed the pipeline")
    if failures:
        for f in failures:
            print(f"  ❌ {f}", file=sys.stderr)
        return 1
    print("  ✅ all CP-N1-B acceptance checks passed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
