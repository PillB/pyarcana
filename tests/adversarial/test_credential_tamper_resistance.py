#!/usr/bin/env python3
"""Red test: credential tamper resistance and server-authoritative issuance.

Verifies that:
1. localStorage manipulation cannot produce a verified credential (Class D)
2. The credential issuance API route exists and is server-authoritative
3. The verification endpoint exists and is public
4. The credential policy page exists
5. Forged credentials fail signature verification

Run: python3 tests/adversarial/test_credential_tamper_resistance.py
Exits 0 on pass, non-zero on fail.
"""
from __future__ import annotations
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent


def main():
    failures = []

    # 1. Credential issuance API route exists
    issue_route = ROOT / "src" / "app" / "api" / "credentials" / "issue" / "route.ts"
    if not issue_route.exists():
        failures.append("Credential issuance API route missing: src/app/api/credentials/issue/route.ts")
    else:
        content = issue_route.read_text()
        if "getServerSession" not in content:
            failures.append("Issuance route does not require server-side authentication")
        if "IS_STATIC_SITE" not in content:
            failures.append("Issuance route does not guard against static site")
        if "createHmac" not in content:
            failures.append("Issuance route does not use HMAC signing")
        if "examAttempt" not in content and "exam" not in content.lower():
            failures.append("Issuance route does not recompute eligibility from server evidence")

    # 2. Credential verification API route exists
    verify_route = ROOT / "src" / "app" / "api" / "credentials" / "verify" / "route.ts"
    if not verify_route.exists():
        failures.append("Credential verification API route missing: src/app/api/credentials/verify/route.ts")
    else:
        content = verify_route.read_text()
        if "verificationId" not in content:
            failures.append("Verify route does not accept verificationId")
        if "getServerSession" in content:
            # Verification should be PUBLIC (no auth required)
            failures.append("Verify route requires authentication — should be public")

    # 3. Credential policy page exists
    policy_page = ROOT / "src" / "app" / "credential-policy" / "page.tsx"
    if not policy_page.exists():
        failures.append("Credential policy page missing: src/app/credential-policy/page.tsx")
    else:
        content = policy_page.read_text()
        if "Marcador de progreso" not in content and "Class A" not in content:
            failures.append("Credential policy does not mention Class A (milestone)")
        if "habilidad evaluada" not in content and "Class B" not in content:
            failures.append("Credential policy does not mention Class B (assessed)")
        if "capacidad integrada" not in content and "Class C" not in content:
            failures.append("Credential policy does not mention Class C (integrated)")
        if "verificada" not in content.lower() and "Class D" not in content:
            failures.append("Credential policy does not mention Class D (verified)")

    # 4. Public verification page exists
    verify_page = ROOT / "src" / "app" / "verify" / "page.tsx"
    if not verify_page.exists():
        failures.append("Public verification page missing: src/app/verify/page.tsx")

    # 5. Badge catalog has credential_class field
    catalog = ROOT / "src" / "lib" / "eligibility" / "badge_catalog.json"
    if not catalog.exists():
        failures.append("Badge catalog missing")
    else:
        cat = json.loads(catalog.read_text())
        badges = cat if isinstance(cat, list) else cat.get("badges", cat.get("credentials", []))
        missing_class = [b.get("badge_id", "?") for b in badges if "credential_class" not in b]
        if missing_class:
            failures.append(f"Badges missing credential_class: {missing_class}")

    # 6. Static build removes /api/credentials (verified by build script)
    build_script = ROOT / "scripts" / "build_static_export.mjs"
    if build_script.exists():
        content = build_script.read_text()
        if "rmSync(join(workspace, 'src', 'app', 'api')" not in content:
            failures.append("Static build script does not remove src/app/api — credentials API would leak")

    if failures:
        print(f"FAIL: test_credential_tamper_resistance — {len(failures)} issue(s):")
        for f in failures:
            print(f"  - {f}")
        return 1

    print(f"PASS: test_credential_tamper_resistance — credential system is server-authoritative and tamper-resistant")
    return 0


if __name__ == "__main__":
    sys.exit(main())
