"""CP-N1-C: tablero de evidencia de familiaridad. SOLUCIÓN DE REFERENCIA.

Este archivo es la respuesta. Escribe la tuya en ../STARTER/cp_n1_c.py y léelo solo para comparar
cuando tus pruebas pasen.

El contrato está en BRIEF.md. Es el You Do de S13 (demo_n1_dashboard.py) escrito como un módulo:
identidad (T1), relación (T2), decisión (T3) y producto (T4), cada capa por separado.
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
    return re.sub(r"[^a-z0-9]", "", (d or "").casefold())


def blocking_key(rec: dict) -> str | None:
    """apellido paterno|región, o None si falta el nombre o la región."""
    parts = (rec.get("name") or "").casefold().split()
    region = (rec.get("region") or "").casefold().strip()
    if not parts or not region:
        return None
    paterno = parts[1] if len(parts) >= 2 else parts[0]
    return paterno + "|" + region


def er_score(a: dict, b: dict) -> float | None:
    """1.0 mismo documento y bloque; 0.5 mismo documento, otro bloque; 0.0 otro documento.

    None si falta evidencia (documento o bloque): ni 1.0 ni 0.0.
    """
    doc_a, doc_b = norm_doc(a.get("document_id")), norm_doc(b.get("document_id"))
    if not doc_a or not doc_b or blocking_key(a) is None or blocking_key(b) is None:
        return None
    if doc_a != doc_b:
        return 0.0
    if blocking_key(a) == blocking_key(b):
        return 1.0
    return 0.5


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
    shared_phone = bool(a.get("phone")) and a.get("phone") == b.get("phone")
    if a.get("coords") in (None, "") or b.get("coords") in (None, ""):  # ausente, como en missing_fields
        geo_close = False
    else:
        geo_close = haversine_km(a["coords"], b["coords"]) <= GEO_KM
    ta = set((a.get("name") or "").casefold().split())
    tb = set((b.get("name") or "").casefold().split())
    name_jaccard = round(len(ta & tb) / max(1, len(ta | tb)), 3)
    return {"shared_phone": shared_phone, "geo_close": geo_close, "name_jaccard": name_jaccard}


def relationship_signal_score(a: dict, b: dict) -> float:
    """Fórmula canónica N1: 0.5 * shared_phone + 0.3 * geo_close + 0.2 * name_jaccard."""
    s = relationship_signals(a, b)
    return round(0.5 * s["shared_phone"] + 0.3 * s["geo_close"] + 0.2 * s["name_jaccard"], 3)


# --- Capa 3: decisión sobre el par, nunca sobre la persona (T3) ------------------------------

def missing_fields(a: dict, b: dict) -> list[str]:
    """Campos de EVIDENCE_FIELDS que faltan en al menos uno de los dos registros."""
    return [f for f in EVIDENCE_FIELDS if a.get(f) in (None, "") or b.get(f) in (None, "")]


def uncertainty(missing: list, conflict: bool) -> str:
    """high si hay conflicto o faltan 2 campos o más; med si falta uno; si no, low (T3-A)."""
    if conflict or len(missing) >= 2:
        return "high"
    if missing:
        return "med"
    return "low"


def decide_ops_status(score, unc: str) -> str:
    """Estado del par: invalid_input, needs_review (high), abstain, needs_review o accept_pair."""
    if isinstance(score, bool) or not isinstance(score, (int, float)):
        return "invalid_input"
    if not math.isfinite(score) or not 0.0 <= score <= 1.0:
        return "invalid_input"
    if unc not in ("low", "med", "high"):
        return "invalid_input"
    if unc == "high":
        return "needs_review"
    if score < REVIEW_LOW:
        return "abstain"
    if score < ACCEPT_MIN:
        return "needs_review"
    return "accept_pair"


# --- Capa 4: producto. Lo que ve quien revisa (T4) -------------------------------------------

def pseudonymize(name) -> str:
    """Primera letra y *** por palabra: "Ana Quispe" → "A*** Q***"."""
    return " ".join(t[0] + "***" for t in (name or "").split())


def privacy_sheet() -> dict:
    """La hoja de privacidad de T4-B."""
    return {
        "data_class": "synthetic_only",
        "pii_real": False,
        "egress_public_geocoder": "city_country_only",
        "roles": ["viewer", "reviewer"],
    }


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
    pending = [d for d in decisions if d["status"] == "needs_review"]
    pending.sort(key=lambda d: (-(d["evidence_score"] or 0.0), d["pair_id"]))
    return tuple(pending)


def review(case: dict) -> ReviewPacket:
    """Arma el paquete de revisión del caso: tres capas separadas y ninguna decisión de riesgo."""
    people = case["people"]
    ids = [p["id"] for p in people]
    if len(ids) != len(set(ids)):
        raise ValueError("id de persona duplicado en el caso " + str(case.get("case_id")))
    entity, relation, decisions = [], [], []
    for a, b in _pairs(people):
        pair_id = a["id"] + "-" + b["id"]
        er = er_score(a, b)
        signals = relationship_signals(a, b)
        rel = relationship_signal_score(a, b)
        missing = missing_fields(a, b)
        conflict = er is not None and abs(er - rel) > CONFLICT_GAP
        unc = uncertainty(missing, conflict)
        entity.append({"pair_id": pair_id, "entity_resolution_score": er,
                       "block_a": blocking_key(a), "block_b": blocking_key(b)})
        relation.append({"pair_id": pair_id, "relationship_signal_score": rel,
                         "signals": [k for k, v in signals.items() if v], "kinship_verdict": None})
        decisions.append({
            "pair_id": pair_id, "a": pseudonymize(a.get("name")), "b": pseudonymize(b.get("name")),
            "status": decide_ops_status(er, unc), "uncertainty": unc, "missing": missing,
            "evidence_score": None if er is None else round(0.6 * er + 0.4 * rel, 3),
            "explanation": ["ER score=" + ("None" if er is None else f"{er:.2f}"),
                            f"relationship_signal_score={rel:.2f}",
                            "missing=" + (",".join(missing) or "none")],
            "rules_version": RULES_VERSION,
        })
    return ReviewPacket(
        case_id=case["case_id"], rules_version=RULES_VERSION,
        entity_evidence=tuple(entity), relationship_evidence=tuple(relation),
        decisions=tuple(decisions), risk_decisions=(),
        review_queue=clerical_queue(decisions), privacy_sheet=privacy_sheet(),
        corrections=(), human_review_required=True,
    )


def apply_correction(packet: ReviewPacket, pair_id: str, new_status: str,
                     reason: str) -> ReviewPacket:
    """Paquete nuevo con el estado del par corregido y la corrección anotada. No toca el original.

    Lanza ValueError si el motivo está vacío, si el estado no es uno de STATUSES o si el par no
    existe.
    """
    if not isinstance(reason, str) or not reason.strip():
        raise ValueError("una corrección necesita un motivo escrito")
    if new_status not in STATUSES:
        raise ValueError("estado desconocido: " + repr(new_status))
    if pair_id not in [d["pair_id"] for d in packet.decisions]:
        raise ValueError("par desconocido: " + repr(pair_id))
    decisions, old_status = [], None
    for d in packet.decisions:
        d = dict(d)  # una copia de cada decisión: el paquete nuevo no comparte ninguna con el original
        if d["pair_id"] == pair_id:
            old_status = d["status"]
            d["status"] = new_status
        decisions.append(d)
    entry = {"pair_id": pair_id, "from": old_status, "to": new_status,
             "reason": reason.strip(), "rules_version": packet.rules_version}
    return replace(packet, decisions=tuple(decisions), review_queue=clerical_queue(decisions),
                   corrections=packet.corrections + (entry,))
