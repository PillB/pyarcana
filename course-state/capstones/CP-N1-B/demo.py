#!/usr/bin/env python3
"""CP-N1-B: ejecuta la SOLUCIÓN DE REFERENCIA (reference/cp_n1_b.py) sobre data/.

Escribe la salida en una carpeta temporal que borra al terminar, e imprime una línea METRICS_JSON con
el manifest. Tu propio código va en STARTER/cp_n1_b.py; para probarlo, corre las pruebas
(RUN.md).
"""
import json
import os
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, os.path.join(HERE, "reference"))

import cp_n1_b as ref  # noqa: E402  (the reference, not the learner's STARTER/cp_n1_b.py)


def main():
    with tempfile.TemporaryDirectory(prefix="cp_n1_b_") as tmp:
        out = Path(tmp)
        code = ref.run(HERE / "data", out)
        manifest = json.loads((out / "manifest.json").read_text(encoding="utf-8")) if code == 0 else None
    metrics = {
        "capstone_id": ref.CAPSTONE_ID,
        "status": "pass" if code == 0 and manifest["reconcile_ok"] else "fail",
        "exit_code": code,
        "manifest": manifest,
    }
    print("METRICS_JSON: " + json.dumps(metrics, ensure_ascii=False, sort_keys=True))
    if manifest:
        for s in manifest["sources"]:
            print(f"{s['name']}: entran {s['n_in']}, limpias {s['n_clean']}, "
                  f"en cuarentena {s['n_quarantine']}, sha256 {s['sha256'][:12]}…")
    return code


if __name__ == "__main__":
    sys.exit(main())
