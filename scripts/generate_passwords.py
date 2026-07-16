#!/usr/bin/env python3
"""
Strong password generator for test accounts.
Uses Python's `secrets` module (cryptographic entropy) to generate 20-char passwords.

Usage:
    python3 scripts/generate_passwords.py

Output:
    Prints passwords to stdout AND saves to /tmp/generated_accounts.json
    The seed.ts file reads these passwords (hardcoded after generation).

WARNING: Do NOT commit the generated passwords to git.
    The docs/TEST_ACCOUNTS.md file containing them is gitignored.
"""
import secrets
import string
import json
from datetime import datetime


def generate_password(length: int = 20) -> str:
    """Generate a cryptographically strong password.

    Uses secrets.SystemRandom() for cryptographic entropy (NOT random.random()).
    Guarantees at least 1 uppercase, 1 lowercase, 1 digit, 1 symbol.
    """
    upper = string.ascii_uppercase
    lower = string.ascii_lowercase
    digits = string.digits
    # Safe symbols that work in web forms and shell scripts
    symbols = "!@#$%^&*()-_=+[]{}<>?"

    # Guarantee at least one of each category
    pwd = [
        secrets.choice(upper),
        secrets.choice(lower),
        secrets.choice(digits),
        secrets.choice(symbols),
    ]

    # Fill the rest with random selections from all categories
    all_chars = upper + lower + digits + symbols
    pwd += [secrets.choice(all_chars) for _ in range(length - 4)]

    # Cryptographically secure shuffle
    secrets.SystemRandom().shuffle(pwd)

    return ''.join(pwd)


def main():
    accounts = []

    # 2 admin accounts
    for i in range(1, 3):
        accounts.append({
            "role": "ADMIN",
            "email": f"admin{i}@python-ds.pe",
            "name": f"Admin {i}",
            "password": generate_password(),
        })

    # 10 test student accounts
    for i in range(1, 11):
        accounts.append({
            "role": "STUDENT",
            "email": f"tester{i:02d}@python-ds.pe",
            "name": f"Tester {i:02d}",
            "password": generate_password(),
        })

    # Print to stdout
    print("=" * 70)
    print("GENERATED TEST ACCOUNTS — El Arte de Python")
    print("=" * 70)
    print(f"Generated at: {datetime.now().isoformat()}")
    print(f"Total accounts: {len(accounts)} (2 admin + 10 student)")
    print()
    for a in accounts:
        print(f"  {a['role']:8s} | {a['email']:30s} | {a['password']}")
    print()
    print("⚠️  These passwords are for INTERNAL TESTING ONLY.")
    print("⚠️  docs/TEST_ACCOUNTS.md is gitignored — do NOT commit.")
    print("=" * 70)

    # Save to JSON for programmatic consumption
    output = {"generated_at": datetime.now().isoformat(), "accounts": accounts}
    with open("/tmp/generated_accounts.json", "w") as f:
        json.dump(output, f, indent=2)
    print(f"\n✓ JSON saved to /tmp/generated_accounts.json")


if __name__ == "__main__":
    main()
