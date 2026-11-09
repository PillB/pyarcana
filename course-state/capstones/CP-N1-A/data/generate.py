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
    # Registros sintéticos: edad, region, monto_ingreso, raw_line. Incluye casos accept, review y reject.
    records = [
        {"edad":30,"region":"R-NORTE","monto_ingreso":100.0,"raw_line":"30|R-NORTE|100","status":"accept"},
        {"edad":30,"region":"R-SUR","monto_ingreso":0,"raw_line":"30|R-SUR|0","status":"accept"},
        {"edad":None,"region":"R-SUR","monto_ingreso":50,"raw_line":"|R-SUR|50","status":"review"},
        {"edad":30,"region":"R-SUR","monto_ingreso":-3,"raw_line":"30|R-SUR|-3","status":"reject"},
    ]
    return {"capstone":CAPSTONE_ID,"seed":seed,"records":records}
if __name__=="__main__":
    print(json.dumps(generate(),ensure_ascii=False,indent=2))
