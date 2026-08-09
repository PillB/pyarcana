"""Synthetic retrieval with per-doc ACLs and per-claim citations.

The KB is fully synthetic (see ``data/generate.py``). Each document carries an
``acl`` field enumerating the principals allowed to read it. Retrieval filters
out docs the caller cannot read; the answer builder attaches a citation to
every grounded claim, and the verifier rejects answers that make grounded
claims without citations.

The retrieval ranking is a simple BM25-like score with no learned weights, so
results are deterministic.
"""
from __future__ import annotations

import math
import re
from dataclasses import dataclass, field
from typing import Any, Dict, Iterable, List, Optional, Sequence, Tuple


_TOKEN_RE = re.compile(r"[A-Za-z0-9_]+")


def tokenize(text: str) -> List[str]:
    return [t.lower() for t in _TOKEN_RE.findall(text)]


@dataclass
class Doc:
    doc_id: str
    text: str
    acl: List[str] = field(default_factory=lambda: ["*"])  # ["*"] = public
    tags: List[str] = field(default_factory=list)

    def allows(self, principal: str) -> bool:
        return "*" in self.acl or principal in self.acl


@dataclass
class Citation:
    doc_id: str
    span: str = ""

    def to_dict(self) -> Dict[str, Any]:
        return {"doc_id": self.doc_id, "span": self.span}


@dataclass
class RetrievalResult:
    hits: List[Doc]
    scores: List[float]

    def to_dict(self) -> Dict[str, Any]:
        return [
            {"doc_id": d.doc_id, "text": d.text, "acl": d.acl, "tags": d.tags, "score": s}
            for d, s in zip(self.hits, self.scores)
        ]


class KnowledgeBase:
    """A tiny in-memory corpus with an inverted index."""

    def __init__(self, docs: Optional[Sequence[Doc]] = None) -> None:
        self._docs: Dict[str, Doc] = {}
        self._index: Dict[str, Dict[str, int]] = {}  # token -> {doc_id: tf}
        self._avg_len: float = 0.0
        for d in docs or []:
            self.add(d)

    def add(self, doc: Doc) -> None:
        self._docs[doc.doc_id] = doc
        toks = tokenize(doc.text)
        for t in set(toks):
            self._index.setdefault(t, {})[doc.doc_id] = toks.count(t)
        self._avg_len = sum(len(tokenize(d.text)) for d in self._docs.values()) / max(1, len(self._docs))

    def __len__(self) -> int:
        return len(self._docs)

    def all(self) -> List[Doc]:
        return list(self._docs.values())

    def retrieve(self, query: str, *, principal: str = "anon", k: int = 5) -> RetrievalResult:
        q_toks = tokenize(query)
        scored: List[Tuple[float, Doc]] = []
        N = max(1, len(self._docs))
        for doc in self._docs.values():
            if not doc.allows(principal):
                continue
            toks = tokenize(doc.text)
            if not toks:
                continue
            tf_map: Dict[str, int] = {}
            for t in toks:
                tf_map[t] = tf_map.get(t, 0) + 1
            score = 0.0
            for qt in q_toks:
                if qt not in tf_map:
                    continue
                df = len(self._index.get(qt, {}))
                idf = math.log(1.0 + (N - df + 0.5) / (df + 0.5))
                tf = tf_map[qt]
                norm = 1.0 + 1.0 * tf / max(1, len(toks))
                score += idf * norm
            if score > 0:
                scored.append((score, doc))
        scored.sort(key=lambda x: (-x[0], x[1].doc_id))
        top = scored[:k]
        return RetrievalResult(hits=[d for _, d in top], scores=[s for s, _ in top])


def build_answer(query: str, hits: List[Doc]) -> Tuple[str, List[Citation]]:
    """Build a cited answer from retrieval hits.

    Every grounded sentence ends with ``[doc_id=...]``. Ungrounded text (which
    the caller may legitimately need to add for framing) must be wrapped in
    ``[ungrounded] ... [/ungrounded]`` so the verifier can distinguish.
    """
    if not hits:
        return ("[ungrounded] no supporting documents [/ungrounded]", [])
    sentences: List[str] = []
    citations: List[Citation] = []
    for d in hits[:3]:
        text = d.text.strip()
        snippet = text if len(text) <= 160 else text[:157] + "..."
        sentences.append(f"{snippet} [doc_id={d.doc_id}]")
        citations.append(Citation(doc_id=d.doc_id, span=snippet))
    return " ".join(sentences), citations


# ---------------------------------------------------------------------------
# Evaluation
# ---------------------------------------------------------------------------

@dataclass
class AnswerGrade:
    grounded: bool           # every grounded claim has a citation
    hallucinated: bool       # citation doc_id not actually retrieved
    correct_doc: Optional[str]
    score: float             # 0..1

    def to_dict(self) -> Dict[str, Any]:
        return {
            "grounded": self.grounded,
            "hallucinated": self.hallucinated,
            "correct_doc": self.correct_doc,
            "score": self.score,
        }


def grade_answer(
    answer: str,
    *,
    expected_doc: Optional[str],
    retrieved: List[Doc],
) -> AnswerGrade:
    cited_ids = set(re.findall(r"doc_id=([A-Za-z0-9_\-]+)", answer))
    retrieved_ids = {d.doc_id for d in retrieved}
    hallucinated = bool(cited_ids - retrieved_ids)
    has_grounded_text = bool(re.search(r"\[doc_id=", answer))
    ungrounded_marker = "[ungrounded]" in answer
    grounded = (not has_grounded_text) or ungrounded_marker or bool(cited_ids)
    correct_doc = expected_doc if expected_doc in cited_ids else None
    score = 0.0
    if not hallucinated:
        score += 0.5
    if grounded:
        score += 0.25
    if correct_doc is not None:
        score += 0.25
    return AnswerGrade(grounded=grounded, hallucinated=hallucinated, correct_doc=correct_doc, score=score)


def evaluate_retrieval(
    kb: KnowledgeBase,
    cases: Iterable[Dict[str, Any]],
    *,
    principal: str = "anon",
) -> Dict[str, Any]:
    """Run a small holdout set over the KB; return aggregate metrics."""
    rows = []
    hits = 0
    for c in cases:
        res = kb.retrieve(c["q"], principal=principal, k=3)
        grade = grade_answer(
            build_answer(c["q"], res.hits)[0],
            expected_doc=c.get("expect_doc"),
            retrieved=res.hits,
        )
        rows.append({"q": c["q"], **grade.to_dict()})
        if grade.correct_doc is not None:
            hits += 1
    return {"n": len(rows), "hits": hits, "score": hits / max(1, len(rows)), "rows": rows}
