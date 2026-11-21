#!/usr/bin/env python3
"""CP-N1-C: escribe data/case.json, un caso con 12 personas sintéticas. Fijo, sin azar.

Ninguna persona es real: los nombres, documentos y teléfonos están inventados. Cada par cubre un
caso del BRIEF:
- P01 y P02: el mismo documento escrito de dos formas y el mismo bloque → ER 1.0.
- P01 y P03: el mismo documento, pero otra región, así que otro bloque → ER 0.5.
- P05 no tiene documento → ER None con cualquier otra persona.
- P04 y P05 no tienen teléfono: dos teléfonos ausentes no son el mismo teléfono.
- P07 a P10 trabajan en la misma oficina: comparten la centralita y el edificio, y ninguno
  comparte apellido. Es la trampa de S13 T2: la señal de relación sube, y no dice nada de familia.
- P01 y P12 comparten el bloque (quispe|lima), pero no el documento → ER 0.0.
- P11 no tiene coordenadas.
"""
import json
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent

OFICINA = "014000000"  # la centralita compartida de P07 a P10

PEOPLE = [
    {"id": "P01", "name": "Ana Quispe Rojas", "document_id": "D-1001", "region": "Lima",
     "phone": "900111001", "coords": [-12.0464, -77.0428]},
    {"id": "P02", "name": "ANA  QUISPE ROJAS", "document_id": "d1001", "region": "lima",
     "phone": "900111001", "coords": [-12.0464, -77.0428]},
    {"id": "P03", "name": "Ana Quispe", "document_id": "D.1001", "region": "Cusco",
     "phone": "984222003", "coords": [-13.5320, -71.9675]},
    {"id": "P04", "name": "Luis Mamani Soto", "document_id": "D-2002", "region": "Arequipa",
     "phone": None, "coords": [-16.3989, -71.5350]},
    {"id": "P05", "name": "Luis Mamani Soto", "document_id": None, "region": "Arequipa",
     "phone": None, "coords": [-16.3989, -71.5350]},
    {"id": "P06", "name": "Bruno Silva Vega", "document_id": "D-3003", "region": "Lima",
     "phone": "900333006", "coords": [-12.0500, -77.0400]},
    {"id": "P07", "name": "Carla Torres Paz", "document_id": "D-4007", "region": "Lima",
     "phone": OFICINA, "coords": [-12.0900, -77.0300]},
    {"id": "P08", "name": "Diego Paredes Luna", "document_id": "D-4008", "region": "Lima",
     "phone": OFICINA, "coords": [-12.0905, -77.0302]},
    {"id": "P09", "name": "Elena Huaman Rios", "document_id": "D-4009", "region": "Lima",
     "phone": OFICINA, "coords": [-12.0898, -77.0297]},
    {"id": "P10", "name": "Felix Ccori Mayta", "document_id": "D-4010", "region": "Lima",
     "phone": OFICINA, "coords": [-12.0902, -77.0305]},
    {"id": "P11", "name": "Gloria Rojas Diaz", "document_id": "D-5011", "region": "Cusco",
     "phone": "984555011", "coords": None},
    {"id": "P12", "name": "Hugo Quispe Ramos", "document_id": "D-6012", "region": "Lima",
     "phone": "900666012", "coords": [-12.1200, -77.0300]},
]


def case() -> dict:
    return {"case_id": "CASE-N1-001", "data_class": "synthetic_only", "people": PEOPLE}


def text() -> str:
    return json.dumps(case(), ensure_ascii=False, indent=2) + "\n"


def write(out_dir: Path = HERE) -> Path:
    path = Path(out_dir) / "case.json"
    path.write_text(text(), encoding="utf-8", newline="\n")
    return path


if __name__ == "__main__":
    print(write(Path(sys.argv[1]) if len(sys.argv) > 1 else HERE))
