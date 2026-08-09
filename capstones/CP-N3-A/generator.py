"""CP-N3-A — synthetic person records with planted duplicates, aliases, unicode
variants, household sharing and common names; labelled ground truth.

Schema: record_id, name, dob, phone, email, address, source_system,
label (match/non-match/ambiguous)

Usage: python3 generator.py --output fixtures/
"""
from __future__ import annotations

import argparse
import json
import os
import random

SEED = 20240212
FIRST = ["Ana", "Bao", "Caleb", "Daria", "Esma", "Farid", "Gita", "Hiro",
         "Ife", "Joon", "Kira", "Lior", "Mei", "Nikos", "Oren", "Priya"]
LAST = ["Almeida", "Brennan", "Castellanos", "Dvořák", "Eze", "Fernández",
        "Greco", "Hassan", "Ivanova", "Jensen", "Klein", "Liu"]
COMMON_FIRST = ["Maria", "John", "Wei", "Mohammed"]  # for common-names test
COMMON_LAST = ["Garcia", "Smith", "Wang", "Khan"]
CITIES = ["Springfield, IL 62701", "Greendale, CA 94027", "Lakeshore, MN 55401"]


def _name(rng):
    return f"{rng.choice(FIRST)} {rng.choice(LAST)}"


def _dob(rng):
    return f"{rng.randint(1940, 2005):04d}-{rng.randint(1,12):02d}-{rng.randint(1,28):02d}"


def _phone(rng):
    return f"+1-{rng.randint(200,989):03d}-{rng.randint(200,989):03d}-{rng.randint(1000,9999):04d}"


def _email(rng, name):
    return f"{name.lower().replace(' ', '.')}@synthetic.example"


def _record(rng, idx, source="A", name=None, dob=None, **kw):
    name = name or _name(rng)
    return {
        "record_id": f"R-{idx:06d}",
        "name": name,
        "dob": dob or _dob(rng),
        "phone": _phone(rng),
        "email": _email(rng, name),
        "address": f"{rng.randint(10, 9999)} {rng.choice(['Maple', 'Cedar', 'Oak'])} Ave, {rng.choice(CITIES)}",
        "source_system": source,
        "label": "unique",
        **kw,
    }


def generate(n=2000, n_dup=200, seed=SEED):
    rng = random.Random(seed)
    records = []
    idx = 1
    # base unique records
    for _ in range(n):
        records.append(_record(rng, idx))
        idx += 1
    # planted duplicate pairs with variants
    duplicates = []
    for _ in range(n_dup):
        base = rng.choice(records)
        # alias: first name variant
        alias_name = rng.choice([base["name"].split()[0] + " " + base["name"].split()[1],
                                 base["name"].split()[0][0] + ". " + base["name"].split()[1],
                                 base["name"] + " " + base["name"].split()[0]])
        # unicode variant
        if rng.random() < 0.2:
            alias_name = alias_name.replace("o", "ó").replace("a", "á")
        dup = _record(rng, idx, source="B", name=alias_name, dob=base["dob"])
        # shared address (household)
        if rng.random() < 0.3:
            dup["address"] = base["address"]
        # shared phone
        if rng.random() < 0.5:
            dup["phone"] = base["phone"]
        # missing field
        if rng.random() < 0.2:
            dup["email"] = ""
        dup["label"] = "match"
        duplicates.append((base["record_id"], dup["record_id"]))
        records.append(dup)
        idx += 1
    # conflicting IDs: same name+dob but different address (ambiguous)
    for _ in range(50):
        base = rng.choice(records)
        amb = _record(rng, idx, source="C", name=base["name"], dob=base["dob"])
        amb["label"] = "ambiguous"
        records.append(amb)
        idx += 1
    # common names — many distinct people sharing common names
    for _ in range(100):
        nm = f"{rng.choice(COMMON_FIRST)} {rng.choice(COMMON_LAST)}"
        records.append(_record(rng, idx, source="D", name=nm))
        idx += 1
    return records, duplicates


def write_outputs(records, duplicates, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    with open(os.path.join(out_dir, "records.json"), "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)
    with open(os.path.join(out_dir, "ground_truth.json"), "w", encoding="utf-8") as f:
        json.dump([{"a": a, "b": b, "label": "match"} for a, b in duplicates], f, ensure_ascii=False, indent=2)
    with open(os.path.join(out_dir, "sample.json"), "w", encoding="utf-8") as f:
        json.dump(records[:18], f, ensure_ascii=False, indent=2)


def main():
    ap = argparse.ArgumentParser(description="CP-N3-A synthetic data generator")
    ap.add_argument("--output", default="fixtures/")
    ap.add_argument("--seed", type=int, default=SEED)
    ap.add_argument("--n", type=int, default=2000)
    ap.add_argument("--dup", type=int, default=200)
    args = ap.parse_args()
    records, dups = generate(args.n, args.dup, args.seed)
    write_outputs(records, dups, args.output)
    print(f"CP-N3-A generator: wrote {len(records)} records ({len(dups)} planted matches) to {args.output}")


if __name__ == "__main__":
    main()
