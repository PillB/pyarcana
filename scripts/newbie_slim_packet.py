#!/usr/bin/env python3
"""Learner-facing slim packet helper (not a solution generator)."""
from __future__ import annotations


def slim_packet(pkt: dict) -> dict:
    """Compact feed for subagents: full active + prior titles/outcomes only."""
    priors = []
    for s in pkt.get("prior_sections") or []:
        priors.append(
            {
                "index": s.get("index"),
                "id": s.get("id"),
                "title": s.get("title"),
                "tagline": s.get("tagline"),
                "learningOutcomes": (s.get("learningOutcomes") or [])[:8],
            }
        )
    act = pkt.get("active") or {}
    return {
        "attempt_id": pkt.get("attempt_id"),
        "section_index": pkt.get("section_index"),
        "landing": pkt.get("landing"),
        "prior_index": priors,
        "active": {
            "id": act.get("id"),
            "index": act.get("index"),
            "title": act.get("title"),
            "tagline": act.get("tagline"),
            "jobRelevance": act.get("jobRelevance"),
            "learningOutcomes": act.get("learningOutcomes"),
            "theory": act.get("theory"),
            "iDo": act.get("iDo"),
            "weDo": act.get("weDo"),
            "youDo": act.get("youDo"),
            "selfCheck_stems": act.get("selfCheck_stems"),
        },
        "forbidden": pkt.get("forbidden"),
        "packet_sha": pkt.get("packet_sha"),
    }
