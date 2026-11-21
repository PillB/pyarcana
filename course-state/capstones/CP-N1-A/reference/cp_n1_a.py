"""CP-N1-A: admisión de clientes y calidad de datos. SOLUCIÓN DE REFERENCIA.

Este archivo es la respuesta. Escribe la tuya en ../STARTER/cp_n1_a.py y léelo solo para comparar
cuando tus pruebas pasen.

El contrato está en BRIEF.md. Las reglas son las del You Do de S04 (intake_quality_batch.py),
escritas como funciones para que CP-N1-B y CP-FINAL puedan llamarlas.
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
    """Código de la edad: MISSING, BAD_TYPE, OUT_OF_RANGE, NEEDS_REVIEW u OK."""
    if edad is None:
        return "MISSING"
    if not isinstance(edad, int) or isinstance(edad, bool):
        return "BAD_TYPE"
    if edad < EDAD_MINIMA or edad > EDAD_MAXIMA:
        return "OUT_OF_RANGE"
    if edad < EDAD_ADULTA:
        return "NEEDS_REVIEW"
    return "OK"


def codigo_region(region):
    """Código de la región: MISSING, NOT_IN_ALLOWLIST u OK."""
    if region is None:
        return "MISSING"
    if region in REGIONES_PERMITIDAS:
        return "OK"
    return "NOT_IN_ALLOWLIST"


def codigo_monto(monto):
    """Código del monto: MISSING, BAD_TYPE, OUT_OF_RANGE, NEEDS_REVIEW u OK.

    Solo int o Decimal son montos. Un float (10.5) es BAD_TYPE, y también un Decimal que no es
    finito (NaN o Infinity), porque comparar un NaN con < detendría el lote.
    """
    if monto is None:
        return "MISSING"
    if not (isinstance(monto, int) or isinstance(monto, Decimal)) or isinstance(monto, bool):
        return "BAD_TYPE"
    if isinstance(monto, Decimal) and not monto.is_finite():
        return "BAD_TYPE"
    if monto < 0:
        return "OUT_OF_RANGE"
    if monto > MONTO_REVISION:
        return "NEEDS_REVIEW"
    return "OK"  # el cero es un monto válido


def motivos(row):
    """Lista de "campo:CODIGO" para cada campo que no es OK. Vacía si todo está bien."""
    codigos = {
        "edad": codigo_edad(row.get("edad")),
        "region": codigo_region(row.get("region")),
        "monto_ingreso": codigo_monto(row.get("monto_ingreso")),
    }
    lista = []
    for campo in codigos:
        if codigos[campo] != "OK":
            lista.append(campo + ":" + codigos[campo])
    return lista


def classify(row):
    """Estado del registro: reject si algún campo rechaza, review si alguno revisa, si no accept."""
    estados = []
    for motivo in motivos(row):
        codigo = motivo.split(":")[1]
        estados.append(ESTADO_DE_CODIGO[codigo])
    if "reject" in estados:
        return "reject"
    if "review" in estados:
        return "review"
    return "accept"


def run(records):
    """Clasifica el lote y lo resume. Devuelve un dict; ver BRIEF.md, 'Interfaz'."""
    results = []
    n_accept = 0
    n_review = 0
    n_reject = 0
    for row in records:
        estado = classify(row)
        results.append({"raw_line": row.get("raw_line"), "estado": estado, "motivos": motivos(row)})
        if estado == "accept":
            n_accept += 1
        elif estado == "review":
            n_review += 1
        else:
            n_reject += 1
    n_total = len(results)
    if n_total == 0:
        tasa_reject = None  # un lote vacío no tiene tasa: no hay nada que dividir
    else:
        tasa_reject = n_reject / n_total
    return {
        "results": results,
        "n_total": n_total,
        "n_accept": n_accept,
        "n_review": n_review,
        "n_reject": n_reject,
        "tasa_reject": tasa_reject,
    }
