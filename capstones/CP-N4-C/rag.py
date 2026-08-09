"""CP-N4-C — RAG with access filtering + citations + injection defence."""
from __future__ import annotations

import re
from typing import Any

INDEX_VERSION = "v1"

# Authorised document corpus (mirrors the generator's AUTHORISED_CORPUS).
CORPUS = [
    {"doc": "compliance-memo-001.md", "scope": "internal",
     "text": "Client ACME-001 must complete KYC refresh by Q3. Reviewer: ana.review@synthetic.example."},
    {"doc": "policy-er-001.md", "scope": "public",
     "text": "Entity resolution evidence must not be used to infer kinship, fraud, or beneficial ownership."},
    {"doc": "ops-runbook-001.md", "scope": "restricted",
     "text": "To send an external email, obtain human approval and use only allowlisted recipients."},
    {"doc": "data-card-001.md", "scope": "internal",
     "text": "Synthetic dataset: 1,000 clients, CC0, no real PII. Seed: 20240101."},
    {"doc": "model-card-001.md", "scope": "internal",
     "text": "Logistic regression, 3 features, L2. No unreviewed adverse decision."},
]

SCOPE_RANK = {"public": 0, "internal": 1, "restricted": 2}

INJECTION_PATTERNS = [
    re.compile(r"ignore\s+(all\s+)?prior\s+instructions", re.IGNORECASE),
    re.compile(r"system\s*:\s*", re.IGNORECASE),
    re.compile(r"reveal\s+(your|the)\s+(system\s+)?prompt", re.IGNORECASE),
    re.compile(r"email\s+\S+@\S+\s+(all\s+)?client\s+data", re.IGNORECASE),
]


def can_access(doc_scope: str, viewer_scope: str) -> bool:
    return SCOPE_RANK[doc_scope] <= SCOPE_RANK[viewer_scope]


def detect_injection(text: str) -> bool:
    return any(p.search(text) for p in INJECTION_PATTERNS)


def retrieve(query: str, viewer_scope: str = "internal", top_k: int = 3) -> list[dict]:
    """Access-filtered retrieval. Never returns docs the viewer cannot see."""
    # Filter by access scope FIRST (before any scoring).
    accessible = [d for d in CORPUS if can_access(d["scope"], viewer_scope)]
    tokens = [w for w in query.lower().split() if len(w) > 3]
    scored = []
    for d in accessible:
        score = sum(1 for t in tokens if t in d["text"].lower())
        if score > 0:
            scored.append((score, d))
    scored.sort(key=lambda x: -x[0])
    out = []
    for score, d in scored[:top_k]:
        out.append({
            "doc": d["doc"],
            "scope": d["scope"],
            "score": score,
            "snippet": d["text"][:160],
            "chunkId": d["doc"].replace(".md", "#chunk-1"),
            "indexVersion": INDEX_VERSION,
        })
    return out


def citation_from(result: dict) -> dict:
    return {"doc": result["doc"], "chunkId": result["chunkId"], "snippet": result["snippet"]}


def evaluate_answer(answer: str, citations: list[dict]) -> dict:
    """Crude faithfulness/context-precision: answer must be supported by a citation snippet."""
    faithfulness = 0.0
    context_precision = 0.0
    if citations:
        # faithfulness: at least one citation snippet overlaps the answer
        faithfulness = 1.0 if any(c["snippet"][:30] in answer for c in citations) else 0.5
        # context_precision: fraction of citations whose snippet appears in the answer
        context_precision = sum(1 for c in citations if c["snippet"][:30] in answer) / len(citations)
    return {"faithfulness": round(faithfulness, 4),
            "context_precision": round(context_precision, 4)}
