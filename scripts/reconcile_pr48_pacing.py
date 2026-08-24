#!/usr/bin/env python3
"""One-shot reconciliation of learner-facing pacing copy for PR #48.

The duration calibration changed `estimatedHours`; this script updates every
stale embedded total discovered by the regression gate in one deterministic,
idempotent pass. The permanent recurrence guard lives in
`tests/adversarial/test_pr48_review_regressions.py`.
"""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SECTIONS = ROOT / "src/lib/course/sections"

# file -> [(old marker, complete replacement line without indentation)]
FIXES: dict[str, list[tuple[str, str]]] = {
    "s01-setup.ts": [
        (
            "**Ritmo orientativo (unas 18 horas).**",
            '"**Ritmo orientativo.** Unas 10 horas según la calibración del contenido actual, incluyendo explicación, demostraciones, práctica guiada, práctica independiente y cierre del bloque.",',
        ),
    ],
    "s02-basics.ts": [
        (
            "**Ritmo orientativo.** Unas dieciocho horas",
            '"**Ritmo orientativo.** Unas 9 horas según la calibración del contenido actual. Avanza T1 a T4 en ese orden y usa el autochequeo para decidir qué repasar.",',
        ),
    ],
    "s04-functions-modules.ts": [
        (
            "**Ritmo orientativo.** Unas dieciocho horas",
            '"**Ritmo orientativo.** Unas 9 horas según la calibración del contenido actual, incluyendo el proyecto del bloque y el autochequeo.",',
        ),
    ],
    "s08-pandas.ts": [
        (
            "**Ritmo orientativo.** Unas dieciocho horas",
            '"**Ritmo orientativo.** Unas 9 horas según la calibración del contenido actual, incluyendo CP-N1-B y el autochequeo final.",',
        ),
    ],
    "s13-rpa-automation.ts": [
        (
            "**Ritmo orientativo.** Unas diecinueve horas",
            '"**Ritmo orientativo.** Unas 9 horas según la calibración del contenido actual para recorrer T1–T4, el entregable y el autochequeo.",',
        ),
    ],
    "s14-security.ts": [
        (
            "**Ritmo orientativo.** Unas dieciocho horas",
            '"**Ritmo orientativo.** Unas 9 horas según la calibración del contenido actual, repartidas entre los cuatro subtemas, el proyecto y el autochequeo.",',
        ),
    ],
    "s15-stdlib-deep.ts": [
        (
            "**Ritmo orientativo.** Unas dieciocho horas",
            '"**Ritmo orientativo.** Unas 10 horas según la calibración del contenido actual, incluyendo los cuatro subtemas, el proyecto y el autochequeo.",',
        ),
    ],
    "s19-databases-orm.ts": [
        (
            "**Ritmo orientativo.** Unas diecinueve horas.",
            '"**Ritmo orientativo.** Unas 9 horas según la calibración del contenido actual.",',
        ),
    ],
    "s28-llm-agents.ts": [
        (
            'title: "Límite del resultado + ritmo (19 h)"',
            'title: "Límite del resultado + ritmo (9 h)",',
        ),
        (
            "Ritmo sugerido: ~4–5 h T1 propiedades",
            '"Las pruebas verifican identidad de registros y calidad técnica; no autorizan inferencias de relación o riesgo. Matching ≠ fraude. Ritmo orientativo: unas 9 horas según la calibración del contenido actual.",',
        ),
        (
            "**Ritmo orientativo.** Unas diecinueve horas",
            '"**Ritmo orientativo.** Unas 9 horas según la calibración del contenido actual para propiedades, schema y goldens, dobles e integración/CI con el proyecto.",',
        ),
    ],
    "s32-microservices.ts": [
        (
            "Ritmo sugerido: ~10–12 h de núcleo",
            '"Tabla de features versionada con train≡serve, sin futuro ni labels de decisión. Ritmo sugerido: unas 9 h para la ruta completa de esta sección según la calibración actual.",',
        ),
    ],
    "s50-tech-leadership.ts": [
        (
            "Plan de ~20 h: teoría + 8 demos",
            'content: "Ritmo orientativo: unas 9 h según la calibración actual. Asserts sin scorecard no cierran **CP-N4-C**.",',
        ),
        (
            "**Ritmo.** Unas veinte horas",
            '"**Ritmo.** Unas 9 horas según la calibración del contenido actual para teoría, demos, laboratorios y la tarjeta de resultados del portafolio.",',
        ),
    ],
    "s52-career-strategy.ts": [
        (
            "**Ritmo orientativo.** Unas ochenta horas",
            '"**Ritmo orientativo.** Unas 29 horas según la calibración del contenido actual para revalidar CF-1, integrar los contextos, verificar la recuperación y empaquetar la defensa final.",',
        ),
    ],
}


def reconcile_file(path: Path, fixes: list[tuple[str, str]]) -> int:
    text = path.read_text(encoding="utf-8")
    lines = text.splitlines()
    changed = 0
    for old_marker, replacement in fixes:
        replacement_stripped = replacement.strip()
        if any(line.strip() == replacement_stripped for line in lines):
            continue
        matches = [index for index, line in enumerate(lines) if old_marker in line]
        if len(matches) != 1:
            raise RuntimeError(
                f"{path.name}: expected exactly one line containing {old_marker!r}; got {len(matches)}"
            )
        index = matches[0]
        indent = lines[index][: len(lines[index]) - len(lines[index].lstrip())]
        lines[index] = indent + replacement
        changed += 1
    if changed:
        path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return changed


def main() -> int:
    total = 0
    for filename, fixes in FIXES.items():
        total += reconcile_file(SECTIONS / filename, fixes)
    print(f"pacing lines reconciled: {total}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
