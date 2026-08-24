#!/usr/bin/env python3
"""Find technical terms that cost learner attention before they are explained.

The report is deliberately a worklist, not a verdict. Vocabulary is derived
from the course's own signals (code spans, acronyms and mid-sentence proper
nouns), then checked against glossary availability and prose explanations in
*source order*. A definition later in the same section must never explain a
use that the learner encountered earlier.

Run:
    python3 scripts/unexplained_reference_audit.py [--section s01-setup] [--json out.json]
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import TypeAlias

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from anglicism_gloss_audit import GLOSS_NEAR, glossary_available  # noqa: E402

SECTIONS = ROOT / "src/lib/course/sections"
INDEX = ROOT / "src/lib/course/index.ts"
GLOSSARY = ROOT / "src/lib/glossary/terms.ts"

# A position is (1-based section index, 0-based sentence ordinal).  -1 is
# reserved for a glossary definition available from the moment the section is
# opened, before its first prose sentence.
Position: TypeAlias = tuple[int, int]

PY_VOCAB = {
    "dict", "list", "set", "tuple", "str", "int", "float", "bool", "None",
    "True", "False", "finally", "except", "raise", "yield", "lambda", "async",
    "await", "class", "import", "return", "print", "len", "range", "open",
    "self", "args", "kwargs",
}

STOPWORDS = {
    "Python", "Windows", "macOS", "Linux", "Git", "GitHub", "Excel",
    "Ana", "Luis", "Marta", "Lima", "Cusco", "Perú", "PyArcana",
    "Nivel", "Sección", "Contrato", "Entrada", "Salida", "Error", "Meta",
    "Éxito", "Límites", "Contexto", "Mecanismo", "Ancla", "Caso", "Borde",
    "Objetivo", "Resultado", "Nota", "Regla", "Ejemplo", "Antes", "Después",
}

TOKEN_PATTERNS = [
    (r"`([A-Za-z][A-Za-z0-9_-]{2,})`", "code-span name"),
    (r"(?<![A-Za-z])([A-Z]{2,6})(?![A-Za-z])", "acronym"),
    (r"(?<=[a-záéíóúñ,] )([A-Z][a-zA-Z]{3,})", "proper noun"),
]

ASIDE_SHAPES = [
    (r"se distingue de (?:los? |las? |un |una )?[`\w.]", "contrast with a second named thing"),
    (r"a diferencia de (?:los? |las? |un |una )?[`A-Z\w.]+\b", "contrast with a second named thing"),
    (r"no confundir con (?:los? |las? |un |una )?[`\w.]", "contrast with a second named thing"),
    (r"queda (?:semi-?)?oculto", "incidental property of a name"),
    (r"por convención(?:,| )", "convention offered as its own justification"),
    (r"la documentación oficial (?:recomienda|sugiere)", "appeal to authority"),
    (r"históricamente", "history offered where the rule would do"),
    (r"en la práctica se suele", "hedged convention"),
    (r"algunos (?:autores|equipos|tutoriales)", "unattributed disagreement"),
]

GLOSS_MARK = GLOSS_NEAR.pattern


def section_order() -> list[str]:
    return re.findall(r"from ['\"]\./sections/([^'\"]+)['\"]", INDEX.read_text(encoding="utf-8"))


def glossary_first_use() -> dict[str, str]:
    """term -> section id declared by the glossary (kept for report tooling)."""
    src = GLOSSARY.read_text(encoding="utf-8")
    out: dict[str, str] = {}
    for match in re.finditer(
        r"term:\s*['\"]([^'\"]+)['\"][\s\S]{0,400}?firstSectionId:\s*['\"]([^'\"]+)['\"]",
        src,
    ):
        out[match.group(1).lower()] = match.group(2)
    return out


def paragraphs(src: str) -> list[tuple[str, str]]:
    """Return (heading, paragraph) pairs in learner-visible source order."""
    out: list[tuple[str, str]] = []
    context = "?"
    for match in re.finditer(
        r"heading:\s*['\"]([^'\"]+)['\"]|paragraphs:\s*\[([\s\S]*?)\n\s*\]",
        src,
    ):
        if match.group(1):
            context = match.group(1)
            continue
        for quoted in re.finditer(
            r'"((?:\\.|[^"\\]){20,})"|\'((?:\\.|[^\'\\]){20,})\'',
            match.group(2),
        ):
            out.append((context, quoted.group(1) or quoted.group(2)))
    return out


def sentences(text: str) -> list[str]:
    value = text.replace("\\n", " ")
    stash: list[str] = []

    def stash_code(match: re.Match[str]) -> str:
        stash.append(match.group(0))
        return f"\x00{len(stash) - 1}\x00"

    value = re.sub(r"`[^`]+`", stash_code, value)
    parts = re.split(r"(?<=[.:;])\s+(?=[A-ZÁÉÍÓÚÑ¿¡*])", value)
    return [
        re.sub(r"\x00(\d+)\x00", lambda match: stash[int(match.group(1))], part)
        for part in parts
    ]


def iter_sentences(src: str):
    """Yield heading, sentence and a monotonic sentence ordinal."""
    ordinal = 0
    for context, paragraph in paragraphs(src):
        for sentence in sentences(paragraph):
            yield context, sentence, ordinal
            ordinal += 1


def load_bearing_pre(plain: str) -> bool:
    return bool(
        re.search(
            r"\b(usa|escribe|ejecuta|define|declara|nunca|siempre|debe|"
            r"corrige|implementa|devuelve|imprime|no )\b",
            plain,
            re.I,
        )
    )


def candidate_terms(text: str) -> set[str]:
    """Return tokens the course itself visually marks as technical vocabulary."""
    out: set[str] = set()
    for regex, _kind in TOKEN_PATTERNS:
        for match in re.finditer(regex, text):
            term = match.group(1)
            if term in STOPWORDS or term in PY_VOCAB or len(term) < 3:
                continue
            if re.fullmatch(r"[a-z]+id|[a-z]+_[a-z]+", term):
                continue
            if re.fullmatch(r"(CASO|CP|S\d+|T\d+|N\d)[A-Z0-9-]*", term):
                continue
            out.add(term)
    return out


def sentence_explains(term: str, sentence: str) -> bool:
    """Whether this sentence contains the course's local gloss pattern."""
    return bool(
        re.search(
            rf"`?{re.escape(term)}`?\*{{0,2}}[^.]{{0,45}}?{GLOSS_MARK}",
            sentence,
        )
    )


def glossary_terms_available() -> dict[str, int]:
    """alias(lower) -> section index from which a hover definition exists."""
    try:
        return {key.lower(): value for key, value in glossary_available().items()}
    except Exception:
        return {}


def explanation_positions_in_source(src: str, section_index: int) -> dict[str, Position]:
    """Find the first prose explanation for each term, preserving sentence order."""
    positions: dict[str, Position] = {}
    for _context, sentence, ordinal in iter_sentences(src):
        plain = re.sub(r"[*_]", "", sentence)
        for term in candidate_terms(plain):
            if not sentence_explains(term, plain):
                continue
            key = term.lower()
            position = (section_index, ordinal)
            if key not in positions or position < positions[key]:
                positions[key] = position
    return positions


def introduced_by(introduction: Position, section_index: int, sentence_position: int) -> bool:
    """True only if an explanation was available at or before this occurrence."""
    return introduction <= (section_index, sentence_position)


def introduction_map(order: list[str]) -> dict[str, Position]:
    """term -> exact earliest point at which the learner can know the term."""
    first: dict[str, Position] = {
        term: (section_index, -1)
        for term, section_index in glossary_terms_available().items()
    }
    for section_index, name in enumerate(order, 1):
        src = (SECTIONS / f"{name}.ts").read_text(encoding="utf-8")
        for term, position in explanation_positions_in_source(src, section_index).items():
            if term not in first or position < first[term]:
                first[term] = position
    return first


def corpus_frequency(order: list[str]) -> dict[str, int]:
    """Count candidate-term uses across the whole active course."""
    frequency: dict[str, int] = {}
    for name in order:
        src = (SECTIONS / f"{name}.ts").read_text(encoding="utf-8")
        body = "\n".join(
            match.group(1)
            for match in re.finditer(r"paragraphs:\s*\[([\s\S]*?)\n\s*\]", src)
        )
        for term in candidate_terms(body):
            key = term.lower()
            frequency[key] = frequency.get(key, 0) + len(
                re.findall(rf"(?<![\w`]){re.escape(term)}(?![\w])", body)
            )
    return frequency


def audit_section(
    name: str,
    idx: int,
    introduced: dict[str, Position],
    freq: dict[str, int],
) -> list[dict]:
    src = (SECTIONS / f"{name}.ts").read_text(encoding="utf-8")
    sid_match = re.search(r"\n\s*id:\s*['\"]([^'\"]+)['\"]", src)
    sid = sid_match.group(1) if sid_match else name
    findings: list[dict] = []

    for context, sentence, ordinal in iter_sentences(src):
        plain = re.sub(r"[*_]", "", sentence)
        ungrounded: list[str] = []
        for term in candidate_terms(plain):
            intro = introduced.get(term.lower())
            if intro is not None and introduced_by(intro, idx, ordinal):
                continue
            # A term is usable in the sentence that defines it, but not before.
            if sentence_explains(term, plain):
                continue
            ungrounded.append(term)

        reasons: list[str] = []
        recurring = [term for term in ungrounded if freq.get(term.lower(), 0) >= 4]
        oneoff = [term for term in ungrounded if freq.get(term.lower(), 0) < 4]
        if recurring:
            reasons.append(
                "recurring but not yet explained: "
                + ", ".join(
                    f"{term}×{freq.get(term.lower(), 0)}" for term in sorted(recurring)[:4]
                )
            )
        if oneoff and not load_bearing_pre(plain):
            reasons.append("one-off technical aside: " + ", ".join(sorted(oneoff)[:4]))
        for regex, why in ASIDE_SHAPES:
            if re.search(regex, plain, re.I):
                reasons.append(why)
        if not reasons:
            continue

        findings.append(
            {
                "section": sid,
                "file": f"{name}.ts",
                "index": idx,
                "context": context[:60],
                "sentence_position": ordinal,
                "sentence": sentence.strip()[:260],
                "reasons": reasons,
                "ungrounded": sorted(ungrounded),
                "looks_load_bearing": load_bearing_pre(plain),
            }
        )
    return findings


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--section", default="")
    parser.add_argument("--json", default="")
    args = parser.parse_args()

    order = section_order()
    introduced = introduction_map(order)
    names = [args.section] if args.section else order
    frequency = corpus_frequency(order)

    findings: list[dict] = []
    for fallback_index, name in enumerate(names, 1):
        index = order.index(name) + 1 if name in order else fallback_index
        findings += audit_section(name, index, introduced, frequency)

    tally: dict[str, tuple[int, int, str]] = {}
    for finding in findings:
        for term in finding["ungrounded"]:
            uses = frequency.get(term.lower(), 0)
            if uses < 4:
                continue
            hits, _, first_section = tally.get(term, (0, uses, finding["section"]))
            tally[term] = (hits + 1, uses, first_section)

    print("RECURRING TERMS USED BEFORE THE COURSE EXPLAINS THEM")
    print(f"  {'term':16s} {'uses':>5} {'flagged':>8}  first seen")
    for term, (hits, uses, section) in sorted(tally.items(), key=lambda item: -item[1][1])[:22]:
        print(f"  {term:16s} {uses:>5} {hits:>8}  {section}")
    print()

    disposable = [finding for finding in findings if not finding["looks_load_bearing"]]
    print(f"sentences flagged: {len(findings)}   of which not load-bearing: {len(disposable)}")
    by_reason: dict[str, int] = {}
    for finding in findings:
        for reason in finding["reasons"]:
            by_reason[reason] = by_reason.get(reason, 0) + 1
    for reason, count in sorted(by_reason.items(), key=lambda item: -item[1]):
        print(f"  {count:>4}  {reason}")

    if args.json:
        Path(args.json).write_text(
            json.dumps(findings, indent=2, ensure_ascii=False), encoding="utf-8"
        )
        print(f"\nwritten to {args.json}")
    else:
        for finding in disposable[:20]:
            print(f"\n  {finding['section']} · {finding['context']}")
            print(f"    {finding['sentence'][:150]}")
            print(f"    -> {'; '.join(finding['reasons'])}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
