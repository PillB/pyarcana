#!/usr/bin/env python3
"""CP-FINAL — STARTER scaffold. Completa los TODO según BRIEF.md.

Este scaffold llama al orquestador real (`integration.platform.integrate`)
para que puedas experimentar con la integración sin reescribirla desde
cero. Sustituye las llamadas según tu propio diseño una vez que entiendas
el flujo.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

CAPSTONE_ID = "CP-FINAL"

_HERE = Path(__file__).resolve().parent
_PKG = _HERE.parent
if str(_PKG) not in sys.path:
    sys.path.insert(0, str(_PKG))


def main():
    # TODO: reemplaza esta llamada por tu propia implementación de
    # platform.integrate(scenario) -> IntegrationBundle según BRIEF.md.
    from integration import platform as platform_module
    from integration import shared_scenario

    bundle = platform_module.integrate(shared_scenario.shared_scenario_v1)
    print(json.dumps(
        {
            "capstone_id": CAPSTONE_ID,
            "status": "no_go" if bundle.no_go else "pass",
            "subsystem_count": len(bundle.subsystem_results),
        },
        ensure_ascii=False,
    ))
    return 0


if __name__ == "__main__":
    sys.exit(main())
