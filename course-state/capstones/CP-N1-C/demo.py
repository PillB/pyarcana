#!/usr/bin/env python3
"""CP-N1-C: ejecuta la SOLUCIÓN DE REFERENCIA (reference/cp_n1_c.py) sobre data/case.json.

Imprime una línea METRICS_JSON con el resumen del paquete y la cola clerical, ya pseudonimizada.
Tu propio código va en STARTER/cp_n1_c.py; para probarlo, corre las pruebas (RUN.md).
"""
import json
import os
import sys
from collections import Counter
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, os.path.join(HERE, "reference"))

import cp_n1_c as ref  # noqa: E402  (the reference, not the learner's STARTER/cp_n1_c.py)


def main():
    case = json.loads((HERE / "data" / "case.json").read_text(encoding="utf-8"))
    packet = ref.review(case)
    statuses = Counter(d["status"] for d in packet.decisions)
    ok = (packet.risk_decisions == () and packet.human_review_required
          and all(r["kinship_verdict"] is None for r in packet.relationship_evidence))
    metrics = {
        "capstone_id": ref.CAPSTONE_ID,
        "status": "pass" if ok else "fail",
        "case_id": packet.case_id,
        "rules_version": packet.rules_version,
        "n_people": len(case["people"]),
        "n_pairs": len(packet.decisions),
        "statuses": dict(sorted(statuses.items())),
        "n_review_queue": len(packet.review_queue),
        "n_risk_decisions": len(packet.risk_decisions),
        "privacy_sheet": packet.privacy_sheet,
    }
    print("METRICS_JSON: " + json.dumps(metrics, ensure_ascii=False, sort_keys=True))
    print(f"{len(packet.decisions)} pares: " + ", ".join(f"{k} {v}" for k, v in sorted(statuses.items())))
    print("Cola clerical (la revisa una persona):")
    for q in packet.review_queue:
        print(f"  {q['pair_id']}  {q['a']} / {q['b']}  evidence_score {q['evidence_score']}"
              f"  uncertainty {q['uncertainty']}")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
