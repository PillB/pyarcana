#!/usr/bin/env python3
"""CP-N1-A — Reproducible Client Intake and Data-Quality CLI.

A command-line application that captures synthetic client records, validates
required fields, preserves both raw and normalised values, explains every
rejection or review reason in plain language, processes many records at once,
calculates denominators correctly, emits both machine-readable and
human-readable summaries, handles malformed input gracefully, uses no real
personal information, and runs from a clean environment.
"""
from __future__ import annotations
import argparse
import json
import re
import sys
from dataclasses import dataclass, field, asdict
from pathlib import Path
from typing import Any

# ───────────────────────── validation rules ─────────────────────────

REQUIRED_FIELDS = ["client_id", "name", "dob", "phone", "email"]


@dataclass
class ClientRecord:
    client_id: str
    name_raw: str
    name_norm: str
    dob_raw: str
    dob_norm: str
    phone_raw: str
    phone_norm: str
    email_raw: str
    email_norm: str
    address_raw: str = ""
    address_norm: str = ""
    status: str = "accepted"  # accepted | rejected | review
    reason: str = ""


def normalise_name(raw: str) -> str:
    return " ".join(raw.strip().split()).title() if raw else ""


def normalise_dob(raw: str) -> str:
    """Normalise to ISO YYYY-MM-DD; accept DD/MM/YYYY or YYYY-MM-DD."""
    raw = raw.strip()
    m = re.match(r"^(\d{1,2})/(\d{1,2})/(\d{4})$", raw)
    if m:
        d, mo, y = int(m.group(1)), int(m.group(2)), int(m.group(3))
        if 1 <= d <= 31 and 1 <= mo <= 12:
            return f"{y:04d}-{mo:02d}-{d:02d}"
    if re.match(r"^\d{4}-\d{2}-\d{2}$", raw):
        return raw
    return ""


def normalise_phone(raw: str) -> str:
    digits = re.sub(r"\D", "", raw or "")
    if len(digits) == 10:
        return f"+1-{digits[:3]}-{digits[3:6]}-{digits[6:]}"
    if len(digits) == 11 and digits.startswith("1"):
        return f"+1-{digits[1:4]}-{digits[4:7]}-{digits[7:]}"
    return ""


def normalise_email(raw: str) -> str:
    raw = raw.strip().lower()
    if re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", raw):
        return raw
    return ""


def validate_record(rec: dict[str, Any]) -> ClientRecord:
    reasons: list[str] = []
    name_raw = str(rec.get("name", ""))
    dob_raw = str(rec.get("dob", ""))
    phone_raw = str(rec.get("phone", ""))
    email_raw = str(rec.get("email", ""))
    cid = str(rec.get("client_id", "")).strip()
    address_raw = str(rec.get("address", ""))

    if not cid:
        reasons.append("missing client_id")
    name_norm = normalise_name(name_raw)
    if not name_norm:
        reasons.append("missing or invalid name")
    dob_norm = normalise_dob(dob_raw)
    if not dob_norm:
        reasons.append("missing or invalid dob (expected DD/MM/YYYY or YYYY-MM-DD)")
    phone_norm = normalise_phone(phone_raw)
    if not phone_norm:
        reasons.append("missing or invalid phone (expected 10 digits)")
    email_norm = normalise_email(email_raw)
    if not email_norm:
        reasons.append("missing or invalid email")
    address_norm = " ".join(address_raw.strip().split()).title() if address_raw else ""

    status = "accepted" if not reasons else "rejected"
    return ClientRecord(
        client_id=cid, name_raw=name_raw, name_norm=name_norm,
        dob_raw=dob_raw, dob_norm=dob_norm, phone_raw=phone_raw, phone_norm=phone_norm,
        email_raw=email_raw, email_norm=email_norm, address_raw=address_raw, address_norm=address_norm,
        status=status, reason="; ".join(reasons),
    )


# ───────────────────────── CLI ─────────────────────────

def process_file(path: str) -> list[ClientRecord]:
    p = Path(path)
    if not p.exists():
        print(f"Error: file not found: {path}", file=sys.stderr)
        sys.exit(2)
    text = p.read_text(encoding="utf-8", errors="replace")
    records: list[dict[str, Any]] = []
    if p.suffix.lower() == ".json":
        data = json.loads(text)
        if isinstance(data, list):
            records = data
        elif isinstance(data, dict) and "records" in data:
            records = data["records"]
        else:
            print("Error: JSON must be a list or {\"records\": [...]}", file=sys.stderr)
            sys.exit(2)
    else:  # CSV
        import csv
        reader = csv.DictReader(text.splitlines())
        records = list(reader)
    return [validate_record(r) for r in records]


def summarise(records: list[ClientRecord]) -> dict[str, Any]:
    accepted = [r for r in records if r.status == "accepted"]
    rejected = [r for r in records if r.status == "rejected"]
    review = [r for r in records if r.status == "review"]
    total = len(records)
    return {
        "total": total,
        "accepted": len(accepted),
        "rejected": len(rejected),
        "review": len(review),
        "denominators": {"accepted_pct": round(len(accepted) / total * 100, 2) if total else 0},
        "records": [asdict(r) for r in records],
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Reproducible Client Intake and Data-Quality CLI")
    parser.add_argument("input", help="Path to CSV or JSON file of client records")
    parser.add_argument("--output", "-o", default="-", help="Output path for JSON summary (default: stdout)")
    parser.add_argument("--human", action="store_true", help="Also print a human-readable summary to stderr")
    args = parser.parse_args()

    records = process_file(args.input)
    summary = summarise(records)

    out = json.dumps(summary, indent=2, ensure_ascii=False)
    if args.output == "-":
        print(out)
    else:
        Path(args.output).write_text(out, encoding="utf-8")

    if args.human:
        print(f"\n=== Intake Summary ===", file=sys.stderr)
        print(f"Total:      {summary['total']}", file=sys.stderr)
        print(f"Accepted:   {summary['accepted']} ({summary['denominators']['accepted_pct']}%)", file=sys.stderr)
        print(f"Rejected:   {summary['rejected']}", file=sys.stderr)
        print(f"Review:     {summary['review']}", file=sys.stderr)
        if summary["rejected"] > 0:
            print(f"\nRejection reasons:", file=sys.stderr)
            for r in records:
                if r.status == "rejected":
                    print(f"  {r.client_id}: {r.reason}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
