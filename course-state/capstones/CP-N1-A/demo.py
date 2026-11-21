#!/usr/bin/env python3
"""CP-N1-A: ejecuta la SOLUCIÓN DE REFERENCIA (reference/cp_n1_a.py) sobre su lote sintético.

Imprime una línea METRICS_JSON y un resumen para personas. Tu propio código va en cp_n1_a.py;
para ejecutarlo, corre las pruebas (RUN.md).
"""
import json
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "reference"))

import cp_n1_a as ref  # noqa: E402  (the reference, not the learner's file at the package root)


def metricas(res):
    """El dict que se imprime como METRICS_JSON. status sale de una comprobación, no es fijo."""
    cuadra = res["n_total"] == res["n_accept"] + res["n_review"] + res["n_reject"]
    tasa = res["tasa_reject"]
    return {
        "capstone_id": ref.CAPSTONE_ID,
        "status": "pass" if cuadra else "fail",
        "n_total": res["n_total"],
        "n_accept": res["n_accept"],
        "n_review": res["n_review"],
        "n_reject": res["n_reject"],
        "tasa_reject": None if tasa is None else round(tasa, 4),
        "results": res["results"],
    }


def main():
    m = metricas(ref.run(ref.RECORDS))
    print("METRICS_JSON: " + json.dumps(m, ensure_ascii=False))
    tasa = "sin datos" if m["tasa_reject"] is None else f"{m['tasa_reject']:.2%}"
    print(f"{ref.CAPSTONE_ID}. Registros: {m['n_total']}. Aceptados: {m['n_accept']}. "
          f"En revisión: {m['n_review']}. Rechazados: {m['n_reject']}. Tasa de rechazo: {tasa}.")
    return 0 if m["status"] == "pass" else 1


if __name__ == "__main__":
    sys.exit(main())
