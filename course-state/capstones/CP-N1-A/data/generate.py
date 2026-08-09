#!/usr/bin/env python3
"""CP-N1-A — generador de dataset sintético (determinista, sin PII)."""
from __future__ import annotations
import json, hashlib
CAPSTONE_ID = "CP-N1-A"
SEED = 42
def generate(seed=SEED):
    def rand(n):
        h = hashlib.sha256(f"{seed}:{n}".encode()).hexdigest()
        return int(h[:8], 16) / 0xffffffff
    # Registros sintéticos: id, name, email, amount. Incluye casos ok, warn (amount=0) y error.
    records = [
        {"id":"SYN-001","name":"Ana Sintetico","email":"ana@example.test","amount":100.0,"status":"ok"},
        {"id":"SYN-002","name":"Bruno Demo","email":"bruno@example.test","amount":0,"status":"boundary"},
        {"id":"SYN-003","name":"","email":"bad","amount":50,"status":"failure"},
    ]
    return {"capstone":CAPSTONE_ID,"seed":seed,"records":records}
if __name__=="__main__":
    print(json.dumps(generate(),ensure_ascii=False,indent=2))
