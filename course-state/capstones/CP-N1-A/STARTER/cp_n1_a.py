"""CP-N1-A: admisión de clientes y calidad de datos. TU ARCHIVO.

Escribe aquí el cuerpo de cada función. Las firmas, las constantes y el lote ya están puestos:
no cambies sus nombres, porque las pruebas y CP-FINAL los usan.

1. Lee BRIEF.md: tiene cada regla con su ejemplo.
2. Desde la carpeta del paquete (CP-N1-A), corre las pruebas: python3 tests/test_demo.py
   Al principio fallan todas, y cada fallo dice qué función escribir.
3. Escribe una función, vuelve a correr las pruebas, y sigue con la siguiente.

Las funciones son de S05, pero aquí solo escribes su cuerpo: if/elif/else (S03), bucles y
contadores (S04). "return" entrega el resultado de la función a quien la llamó.
"""
from decimal import Decimal

CAPSTONE_ID = "CP-N1-A"
REGIONES_PERMITIDAS = ("R-NORTE", "R-SUR", "R-CENTRO", "R-COSTA")
EDAD_MINIMA = 0
EDAD_MAXIMA = 120
EDAD_ADULTA = 18
MONTO_REVISION = 50000

# Cada código de motivo lleva a un solo estado.
ESTADO_DE_CODIGO = {
    "OK": "accept",
    "MISSING": "review",
    "NEEDS_REVIEW": "review",
    "NOT_IN_ALLOWLIST": "review",
    "BAD_TYPE": "reject",
    "OUT_OF_RANGE": "reject",
}

# Solo datos sintéticos. Es el lote del You Do de S04: cada fila muestra una regla.
RECORDS = [
    {"edad": 30, "region": "R-NORTE", "monto_ingreso": Decimal("0.00"), "raw_line": "30|R-NORTE|0"},
    {"edad": None, "region": "R-SUR", "monto_ingreso": 10, "raw_line": "|R-SUR|10"},
    {"edad": 25, "region": "R-CENTRO", "monto_ingreso": -1, "raw_line": "25|R-CENTRO|-1"},
    {"edad": 40, "region": "R-FUERA", "monto_ingreso": 100, "raw_line": "40|R-FUERA|100"},
]


def codigo_edad(edad):
    """Código de la edad: MISSING, BAD_TYPE, OUT_OF_RANGE, NEEDS_REVIEW u OK (BRIEF.md, regla 1).

    Ejemplos: None → "MISSING"; "veinte" → "BAD_TYPE"; 150 → "OUT_OF_RANGE"; 17 → "NEEDS_REVIEW";
    30 → "OK".
    """
    raise NotImplementedError("Escribe codigo_edad(): BRIEF.md, regla 1")


def codigo_region(region):
    """Código de la región: MISSING, NOT_IN_ALLOWLIST u OK (BRIEF.md, regla 2).

    Ejemplos: None → "MISSING"; "R-FUERA" → "NOT_IN_ALLOWLIST"; "R-SUR" → "OK".
    """
    raise NotImplementedError("Escribe codigo_region(): BRIEF.md, regla 2")


def codigo_monto(monto):
    """Código del monto: MISSING, BAD_TYPE, OUT_OF_RANGE, NEEDS_REVIEW u OK (BRIEF.md, regla 3).

    Ejemplos: None → "MISSING"; 10.5 → "BAD_TYPE"; Decimal("NaN") → "BAD_TYPE"; -1 → "OUT_OF_RANGE";
    50001 → "NEEDS_REVIEW"; 0 → "OK".
    """
    raise NotImplementedError("Escribe codigo_monto(): BRIEF.md, regla 3")


def motivos(row):
    """Lista de "campo:CODIGO" para cada campo que no es OK (BRIEF.md, regla 4).

    Ejemplo: {"edad": None, "region": "R-SUR", "monto_ingreso": 10} → ["edad:MISSING"].
    """
    raise NotImplementedError("Escribe motivos(): BRIEF.md, regla 4")


def classify(row):
    """Estado del registro: "reject", "review" o "accept" (BRIEF.md, regla 5).

    Ejemplo: un campo "reject" y otro "review" → "reject".
    """
    raise NotImplementedError("Escribe classify(): BRIEF.md, regla 5")


def run(records):
    """Clasifica el lote y devuelve el resumen (BRIEF.md, 'Interfaz').

    Devuelve un dict con: results (una entrada por registro, con raw_line, estado y motivos),
    n_total, n_accept, n_review, n_reject y tasa_reject (None si el lote está vacío).
    """
    raise NotImplementedError("Escribe run(): BRIEF.md, 'Interfaz'")
