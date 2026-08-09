#!/usr/bin/env python3
"""CP-N1-A — pytest tests covering normal, boundary and failure cases."""
import json
import sys
from pathlib import Path
import pytest

sys.path.insert(0, str(Path(__file__).parent))
from solution import validate_record, normalise_name, normalise_dob, normalise_phone, normalise_email


class TestNormal:
    def test_valid_record_accepted(self):
        r = validate_record({"client_id": "X1", "name": "jane doe", "dob": "01/01/2000", "phone": "+1-555-111-2222", "email": "jane@test.org"})
        assert r.status == "accepted"

    def test_normalisation_preserves_raw(self):
        r = validate_record({"client_id": "X1", "name": "jane doe", "dob": "01/01/2000", "phone": "+1-555-111-2222", "email": "Jane@Test.ORG"})
        assert r.name_raw == "jane doe"
        assert r.name_norm == "Jane Doe"
        assert r.email_norm == "jane@test.org"


class TestBoundary:
    def test_empty_name_rejected(self):
        r = validate_record({"client_id": "X1", "name": "", "dob": "01/01/2000", "phone": "+1-555-111-2222", "email": "a@b.co"})
        assert r.status == "rejected"
        assert "name" in r.reason

    def test_unicode_name_normalised(self):
        r = validate_record({"client_id": "X1", "name": "  josé  garcía  ", "dob": "01/01/2000", "phone": "+1-555-111-2222", "email": "a@b.co"})
        assert r.name_norm == "José García"

    def test_dob_iso_accepted(self):
        r = validate_record({"client_id": "X1", "name": "A B", "dob": "2000-01-01", "phone": "+1-555-111-2222", "email": "a@b.co"})
        assert r.status == "accepted"
        assert r.dob_norm == "2000-01-01"

    def test_phone_11_digits_starting_1(self):
        r = validate_record({"client_id": "X1", "name": "A B", "dob": "01/01/2000", "phone": "15551222222", "email": "a@b.co"})
        assert r.phone_norm == "+1-555-122-2222"


class TestFailure:
    def test_missing_client_id(self):
        r = validate_record({"name": "A B", "dob": "01/01/2000", "phone": "+1-555-111-2222", "email": "a@b.co"})
        assert r.status == "rejected"
        assert "client_id" in r.reason

    def test_invalid_month(self):
        r = validate_record({"client_id": "X1", "name": "A B", "dob": "31/13/2000", "phone": "+1-555-111-2222", "email": "a@b.co"})
        assert r.status == "rejected"
        assert "dob" in r.reason

    def test_short_phone(self):
        r = validate_record({"client_id": "X1", "name": "A B", "dob": "01/01/2000", "phone": "123", "email": "a@b.co"})
        assert r.status == "rejected"
        assert "phone" in r.reason

    def test_bad_email(self):
        r = validate_record({"client_id": "X1", "name": "A B", "dob": "01/01/2000", "phone": "+1-555-111-2222", "email": "nope"})
        assert r.status == "rejected"
        assert "email" in r.reason
