"""CP-N1-C: tablero de evidencia de familiaridad. TU ARCHIVO.

Escribe el cuerpo de cada función que lanza NotImplementedError, según BRIEF.md. Las constantes,
haversine_km (S12), ReviewPacket (S11) y _pairs ya están escritas: no hace falta cambiarlas.

Verifica con  python3 tests/test_demo.py  desde la carpeta del capstone. Si hiciste el You Do de
S13, tu demo_n1_dashboard.py ya tiene norm_doc, blocking_key, er_score,
relationship_signal_score, decide_ops_status, pseudonymize y privacy_sheet.
"""
from __future__ import annotations

import math
import re
from dataclasses import dataclass, replace

CAPSTONE_ID = "CP-N1-C"
RULES_VERSION = "n1-er-1.0"
REVIEW_LOW = 0.4  # desde aquí, needs_review (T3-B)
ACCEPT_MIN = 0.8  # desde aquí, accept_pair, salvo uncertainty high (T3-B)
GEO_KM = 2.0  # corte de cercanía del contrato N1 (T2-A)
CONFLICT_GAP = 0.5  # |ER - REL| mayor que esto es conflicto (T3-A)
EVIDENCE_FIELDS = ("document_id", "name", "region", "phone", "coords")
STATUSES = ("invalid_input", "abstain", "needs_review", "accept_pair")
FORBIDDEN_KEYS = ("auto_fraud", "is_family")


# --- Capa 1: identidad. ¿Son la misma persona en dos filas? (T1-A) ---------------------------

def norm_doc(d) -> str:
    """Documento normalizado: minúsculas y solo letras y dígitos. "D-10.01" y "d1001" coinciden."""
    raise NotImplementedError("Escribe norm_doc(): BRIEF.md, regla 1")


def blocking_key(rec: dict) -> str | None:
    """apellido paterno|región, o None si falta el nombre o la región."""
    raise NotImplementedError("Escribe blocking_key(): BRIEF.md, regla 1")


def er_score(a: dict, b: dict) -> float | None:
    """1.0 mismo documento y bloque; 0.5 mismo documento, otro bloque; 0.0 otro documento.

    None si falta evidencia (documento o bloque): ni 1.0 ni 0.0.
    """
    raise NotImplementedError("Escribe er_score(): BRIEF.md, regla 1")


# --- Capa 2: relación. ¿Hay indicios de familiaridad operativa? (T2-A) ----------------------

def haversine_km(a, b) -> float:
    """Distancia en km entre dos puntos (lat, lon), la fórmula de S12."""
    lat1, lon1 = map(math.radians, a)
    lat2, lon2 = map(math.radians, b)
    h = (math.sin((lat2 - lat1) / 2) ** 2
         + math.cos(lat1) * math.cos(lat2) * math.sin((lon2 - lon1) / 2) ** 2)
    return 2 * 6371.0 * math.asin(math.sqrt(h))


def relationship_signals(a: dict, b: dict) -> dict:
    """Las tres señales: shared_phone, geo_close y name_jaccard. Lo ausente no es evidencia."""
    raise NotImplementedError("Escribe relationship_signals(): BRIEF.md, regla 2")


def relationship_signal_score(a: dict, b: dict) -> float:
    """Fórmula canónica N1: 0.5 * shared_phone + 0.3 * geo_close + 0.2 * name_jaccard."""
    raise NotImplementedError("Escribe relationship_signal_score(): BRIEF.md, regla 2")


# --- Capa 3: decisión sobre el par, nunca sobre la persona (T3) ------------------------------

def missing_fields(a: dict, b: dict) -> list[str]:
    """Campos de EVIDENCE_FIELDS que faltan en al menos uno de los dos registros."""
    raise NotImplementedError("Escribe missing_fields(): BRIEF.md, regla 3")


def uncertainty(missing: list, conflict: bool) -> str:
    """high si hay conflicto o faltan 2 campos o más; med si falta uno; si no, low (T3-A)."""
    raise NotImplementedError("Escribe uncertainty(): BRIEF.md, regla 3")


def decide_ops_status(score, unc: str) -> str:
    """Estado del par: invalid_input, needs_review (high), abstain, needs_review o accept_pair."""
    raise NotImplementedError("Escribe decide_ops_status(): BRIEF.md, regla 3")


# --- Capa 4: producto. Lo que ve quien revisa (T4) -------------------------------------------

def pseudonymize(name) -> str:
    """Primera letra y *** por palabra: "Ana Quispe" → "A*** Q***"."""
    raise NotImplementedError("Escribe pseudonymize(): BRIEF.md, regla 5")


def privacy_sheet() -> dict:
    """La hoja de privacidad de T4-B."""
    raise NotImplementedError("Escribe privacy_sheet(): BRIEF.md, regla 5")


@dataclass(frozen=True)
class ReviewPacket:
    case_id: str
    rules_version: str
    entity_evidence: tuple
    relationship_evidence: tuple
    decisions: tuple
    risk_decisions: tuple
    review_queue: tuple
    privacy_sheet: dict
    corrections: tuple
    human_review_required: bool = True


def _pairs(people: list):
    """Cada par de personas una vez, en el orden del caso: (P01, P02), (P01, P03), ..."""
    for i in range(len(people)):
        for j in range(i + 1, len(people)):
            yield people[i], people[j]


def clerical_queue(decisions) -> tuple:
    """La cola clerical: los pares en needs_review, el de mayor evidence_score primero.

    Con empate, por pair_id. evidence_score solo ordena la cola: nunca decide el estado (T3-A).
    """
    raise NotImplementedError("Escribe clerical_queue(): BRIEF.md, regla 4")


def review(case: dict) -> ReviewPacket:
    """Arma el paquete de revisión del caso: tres capas separadas y ninguna decisión de riesgo."""
    raise NotImplementedError("Escribe review(): BRIEF.md, regla 6")


def apply_correction(packet: ReviewPacket, pair_id: str, new_status: str,
                     reason: str) -> ReviewPacket:
    """Paquete nuevo con el estado del par corregido y la corrección anotada. No toca el original.

    Lanza ValueError si el motivo está vacío, si el estado no es uno de STATUSES o si el par no
    existe.
    """
    raise NotImplementedError("Escribe apply_correction(): BRIEF.md, regla 7")
