"""Versioned manifest of models, prompts, datasets and indexes.

The manifest is pinned to the capstone package version (3.0.0). Adapters and
datasets resolve their concrete implementation by looking up an id in this
manifest, so an experiment recorded with one manifest replays identically
against the same manifest later.
"""
from __future__ import annotations

import json
import os
from dataclasses import dataclass
from typing import Any, Dict, List, Optional

_MANIFEST_PATH = os.path.join(os.path.dirname(__file__), "versions.json")
_MANIFEST: Optional[Dict[str, Any]] = None
EXPECTED_PACKAGE_VERSION = "3.0.0"


def _load() -> Dict[str, Any]:
    global _MANIFEST
    if _MANIFEST is None:
        with open(_MANIFEST_PATH, "r", encoding="utf-8") as f:
            _MANIFEST = json.load(f)
    return _MANIFEST


@dataclass
class ManifestEntry:
    id: str
    kind: str
    version: str
    description: str = ""


def manifest_version() -> str:
    return _load()["manifest_version"]


def assert_package_version() -> None:
    mv = manifest_version()
    if mv != EXPECTED_PACKAGE_VERSION:
        raise RuntimeError(
            f"manifest version mismatch: got {mv!r}, expected {EXPECTED_PACKAGE_VERSION!r}"
        )


def list_models() -> List[ManifestEntry]:
    return [ManifestEntry(m["id"], m["kind"], m["version"], m.get("description", "")) for m in _load()["models"]]


def list_prompts() -> List[ManifestEntry]:
    return [ManifestEntry(p["id"], "prompt", p["version"], p.get("description", "")) for p in _load()["prompts"]]


def list_datasets() -> List[ManifestEntry]:
    return [ManifestEntry(d["id"], "dataset", d["version"], d.get("description", "")) for d in _load()["datasets"]]


def list_indexes() -> List[ManifestEntry]:
    return [ManifestEntry(i["id"], "index", i["version"], i.get("description", "")) for i in _load()["indexes"]]


def get_model(id: str) -> Dict[str, Any]:
    for m in _load()["models"]:
        if m["id"] == id:
            return m
    raise KeyError(f"unknown model: {id}")


def get_prompt(id: str) -> Dict[str, Any]:
    for p in _load()["prompts"]:
        if p["id"] == id:
            return p
    raise KeyError(f"unknown prompt: {id}")


def snapshot() -> Dict[str, Any]:
    """Return a serialisable snapshot of the whole manifest."""
    m = _load()
    return {
        "manifest_version": m["manifest_version"],
        "capstone_id": m["capstone_id"],
        "models": list_models(),
        "prompts": list_prompts(),
        "datasets": list_datasets(),
        "indexes": list_indexes(),
    }
