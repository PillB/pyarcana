# Familiarity Dashboard — Python Sidecar Guide

The Familiarity Dashboard currently runs entirely in the browser (TypeScript). For datasets >50,000 rows, you need a Python backend with `rapidfuzz` for production-grade entity resolution.

## Architecture

```
Browser (Next.js)  →  Python Sidecar (FastAPI)  →  SQLite/PostgreSQL
     ↓                        ↓                        ↓
 Upload .xlsx          rapidfuzz + networkx       FamiliarityJob
 Show results          entity resolution          FamiliarityPair
```

## Setup

### 1. Create the Python sidecar

```bash
mkdir -p mini-services/familiarity-engine
cd mini-services/familiarity-engine

python -m venv venv
source venv/bin/activate  # Linux/macOS
# venv\Scripts\activate   # Windows

pip install fastapi uvicorn pandas openpyxl rapidfuzz networkx python-multipart
pip freeze > requirements.txt
```

### 2. Create `main.py`

See full code in `mini-services/familiarity-engine/main.py` (template below):

```python
"""
Motor de entity resolution para el Familiarity Dashboard.
Corre como sidecar en puerto 8000.
"""
import io, uuid, unicodedata
from datetime import datetime
from typing import Dict
import pandas as pd
import numpy as np
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from rapidfuzz import fuzz
import networkx as nx

app = FastAPI(title="Familiarity Engine")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# ... (full implementation in docs/FAMILIARITY_SIDECAR.md)

@app.post("/analyze")
async def analyze_excel(file: UploadFile = File(...)):
    # Read Excel → DataFrame → analyze_dataframe() → return JSON
    pass

@app.get("/health")
async def health():
    return {"status": "ok"}
```

### 3. Run

```bash
cd mini-services/familiarity-engine
uvicorn main:app --reload --port 8000
```

### 4. Frontend integration

```typescript
// In FamiliarityDashboard.tsx, replace local compute with:
const response = await fetch('/api/analyze?XTransformPort=8000', {
  method: 'POST',
  body: formData,
})
```

## When to use

| Dataset size | Approach | Why |
|---|---|---|
| < 1,000 | Browser (TypeScript) | Fast enough |
| 1K - 50K | Browser + Web Worker | Still OK |
| > 50K | Python sidecar | rapidfuzz 10-100x faster |

## Privacy (Ley 29733)

- Sidecar runs on YOUR server
- Process in `/tmp`, delete after job
- Hash PII for match keys
- Never log PII
- Rate limit: 5 jobs/hour per user
