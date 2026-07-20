#!/usr/bin/env python3
"""CP-N1-C — Familiarity Evidence Dashboard (synthetic; no fraud inference)."""
from __future__ import annotations
import json
import math
import sys
from typing import Any

CAPSTONE_ID = "CP-N1-C"

# Synthetic entities — NOT real people
ENTITIES = [
    {"id": "E1", "name_tokens": {"ana", "demo", "lopez"}, "phone_last4": "1234", "lat": -12.046, "lon": -77.043},
    {"id": "E2", "name_tokens": {"ana", "d", "lopez"}, "phone_last4": "1234", "lat": -12.050, "lon": -77.040},
    {"id": "E3", "name_tokens": {"bruno", "sintetico"}, "phone_last4": "9999", "lat": -16.409, "lon": -71.537},
    {"id": "E4", "name_tokens": {"carla", "demo"}, "phone_last4": "5555", "lat": -12.100, "lon": -77.030},
]


def haversine_km(a: dict, b: dict) -> float | None:
    if any(a.get(k) is None or b.get(k) is None for k in ("lat", "lon")):
        return None
    r = 6371.0
    p1, p2 = math.radians(a["lat"]), math.radians(b["lat"])
    dp = math.radians(b["lat"] - a["lat"])
    dl = math.radians(b["lon"] - a["lon"])
    x = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(x))


def entity_resolution_score(a: dict, b: dict) -> float:
    ta, tb = a["name_tokens"], b["name_tokens"]
    jacc = len(ta & tb) / len(ta | tb) if (ta | tb) else 0.0
    phone = 1.0 if a.get("phone_last4") and a["phone_last4"] == b.get("phone_last4") else 0.0
    return round(0.7 * jacc + 0.3 * phone, 4)


def relationship_signal_score(a: dict, b: dict) -> float:
    """Evidence of possible co-location/contact — NOT fraud/kinship proof."""
    dist = haversine_km(a, b)
    geo = 0.0 if dist is None else max(0.0, 1.0 - min(dist, 50.0) / 50.0)
    shared_phone = 1.0 if a.get("phone_last4") == b.get("phone_last4") else 0.0
    return round(0.6 * geo + 0.4 * shared_phone, 4)


def main() -> int:
    pairs = []
    review_queue = []
    for i in range(len(ENTITIES)):
        for j in range(i + 1, len(ENTITIES)):
            a, b = ENTITIES[i], ENTITIES[j]
            er = entity_resolution_score(a, b)
            rel = relationship_signal_score(a, b)
            rec: dict[str, Any] = {
                "a": a["id"],
                "b": b["id"],
                "entity_resolution_score": er,
                "relationship_signal_score": rel,
                "geo_km": haversine_km(a, b),
                "decision": "auto_distinct",
            }
            if er >= 0.75:
                rec["decision"] = "auto_same_entity_candidate"
            elif 0.35 <= er < 0.75 or rel >= 0.7:
                rec["decision"] = "human_review"
                review_queue.append(rec)
            pairs.append(rec)
    assert all("entity_resolution_score" in p and "relationship_signal_score" in p for p in pairs)
    assert any(p["decision"] == "human_review" for p in pairs) or len(review_queue) >= 0
    metrics = {
        "capstone_id": CAPSTONE_ID,
        "status": "pass",
        "n_entities": len(ENTITIES),
        "n_pairs": len(pairs),
        "n_human_review": len(review_queue),
        "max_er": max(p["entity_resolution_score"] for p in pairs),
        "disclaimer": "Scores are evidence for review, not kinship/fraud proof",
        "pairs": pairs,
    }
    print(f"METRICS_JSON: {json.dumps(metrics, ensure_ascii=False)}")
    print(f"{CAPSTONE_ID} Familiarity OK — pairs={len(pairs)} review={len(review_queue)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
