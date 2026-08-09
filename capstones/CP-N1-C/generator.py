"""CP-N1-C — synthetic familiarity-evidence dataset generator.

Produces 5,000 client pairs with 200 planted positives and 4,800 negatives.
Every pair carries feature blocks (Jaro-Winkler name similarity, token ratio,
haversine distance, temporal overlap) and explicit ground-truth labels used for
evaluation only — the dashboard itself never reads the label.

Usage: python3 generator.py --output fixtures/
"""
from __future__ import annotations

import argparse
import json
import math
import os
import random

SEED = 20240115

FIRST = ["Ana", "Bao", "Caleb", "Daria", "Esma", "Farid", "Gita", "Hiro", "Ife", "Joon"]
LAST = ["Almeida", "Brennan", "Castellanos", "Dvořák", "Eze", "Fernández", "Greco", "Hassan"]
CITIES = [
    ("Springfield", 39.78, -89.64),
    ("Greendale", 37.45, -122.18),
    ("Lakeshore", 44.98, -93.27),
    ("Brookhaven", 33.85, -84.36),
    ("Westwood", 42.21, -71.16),
]


def haversine(lat1, lon1, lat2, lon2):
    R = 6371.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlmb = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dlmb / 2) ** 2
    return 2 * R * math.asin(math.sqrt(a))


def _client(rng, idx):
    city = rng.choice(CITIES)
    lat = city[1] + rng.uniform(-0.05, 0.05)
    lon = city[2] + rng.uniform(-0.05, 0.05)
    return {
        "client_id": f"ACME-{idx:05d}",
        "name": f"{rng.choice(FIRST)} {rng.choice(LAST)}",
        "dob": f"{rng.randint(1940, 2005):04d}-{rng.randint(1,12):02d}-{rng.randint(1,28):02d}",
        "address_lat": round(lat, 5),
        "address_lon": round(lon, 5),
        "employer": f"Employer-{rng.randint(1, 25)}",
        "employment_start": f"{rng.randint(2010, 2023):04d}-{rng.randint(1,12):02d}-01",
    }


def _pair(rng, idx, a, b, planted_positive=False):
    name_a = a["name"].lower().split()
    name_b = b["name"].lower().split()
    tokens_a = set(name_a)
    tokens_b = set(name_b)
    token_ratio = len(tokens_a & tokens_b) / max(1, len(tokens_a | tokens_b))
    # crude Jaro-like similarity on full-name strings
    s1, s2 = a["name"].lower(), b["name"].lower()
    matches = sum(1 for c in s1 if c in s2)
    jaro_winkler = round(matches / max(len(s1), len(s2), 1), 4)
    dist_km = round(haversine(a["address_lat"], a["address_lon"], b["address_lat"], b["address_lon"]), 3)
    # temporal overlap of employment (days)
    y1 = int(a["employment_start"][:4])
    y2 = int(b["employment_start"][:4])
    temporal_overlap_days = max(0, (2024 - max(y1, y2)) * 365)
    return {
        "pair_id": f"PAIR-{idx:06d}",
        "client_a": a["client_id"],
        "client_b": b["client_id"],
        "features": {
            "name_jaro_winkler": jaro_winkler,
            "name_token_ratio": round(token_ratio, 4),
            "geo_haversine_km": dist_km,
            "temporal_overlap_days": temporal_overlap_days,
            "shared_employer": a["employer"] == b["employer"],
            "shared_address": (a["address_lat"] == b["address_lat"] and a["address_lon"] == b["address_lon"]),
        },
        "er_evidence": [],
        "relationship_evidence": [],
        "risk_decision": "no_decision",
        "provenance": {
            "generator": "CP-N1-C/v1",
            "seed": SEED,
        },
        "uncertainty": 0.0,
        "label": "positive" if planted_positive else "negative",
    }


def generate(n_pos=200, n_neg=4800, seed=SEED):
    rng = random.Random(seed)
    clients = [_client(rng, i) for i in range(1, 201)]
    pairs = []
    # plant positives: deliberately co-located + shared employer
    for i in range(1, n_pos + 1):
        a = _client(rng, 1000 + i)
        b = dict(a)
        b["client_id"] = f"ACME-{1000 + i + 500:05d}"
        b["name"] = a["name"]  # exact name match (synthetic alias)
        pairs.append(_pair(rng, i, a, b, planted_positive=True))
    for i in range(1, n_neg + 1):
        a = rng.choice(clients)
        b = rng.choice(clients)
        while b["client_id"] == a["client_id"]:
            b = rng.choice(clients)
        pairs.append(_pair(rng, n_pos + i, a, b, planted_positive=False))
    rng.shuffle(pairs)
    return pairs


def write_outputs(pairs, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    with open(os.path.join(out_dir, "pairs.json"), "w", encoding="utf-8") as f:
        json.dump(pairs, f, ensure_ascii=False, indent=2)
    with open(os.path.join(out_dir, "sample.json"), "w", encoding="utf-8") as f:
        json.dump(pairs[:18], f, ensure_ascii=False, indent=2)


def main():
    ap = argparse.ArgumentParser(description="CP-N1-C synthetic data generator")
    ap.add_argument("--output", default="fixtures/")
    ap.add_argument("--seed", type=int, default=SEED)
    ap.add_argument("--pos", type=int, default=200)
    ap.add_argument("--neg", type=int, default=4800)
    args = ap.parse_args()
    pairs = generate(args.pos, args.neg, args.seed)
    write_outputs(pairs, args.output)
    print(f"CP-N1-C generator: wrote {len(pairs)} pairs to {args.output}")


if __name__ == "__main__":
    main()
