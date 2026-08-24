#!/usr/bin/env python3
"""Find sentences that spend the learner's attention on something they cannot use.

THE CASE THAT PROMPTED THIS. S01, on why the folder is called `.venv`:

    "queda semi-oculto en listados Unix y se distingue de archivos .env de
     secretos."

Twenty words, in the first lesson, resting on four things never introduced:
what Unix is, what a listing is, what a `.env` file is, and what "secrets"
means in this trade. The reader cannot evaluate any of it. And the sentence is
not load-bearing -- remove it and the instruction ("call the folder .venv") is
unchanged. It is not wrong. It is a cost with no return.

Generalised, the questions worth asking of every sentence are:

  1. Does it introduce a term the learner has had no chance to learn?
  2. Is the term load-bearing, or is it decoration on an instruction that
     stands without it?
  3. If it is load-bearing, is it grounded here, or assumed?

This pass answers (1) mechanically and flags the shapes that usually mean (2).
Judging (2) and (3) is a reading job and stays one: the output is a worklist,
not a verdict.

Run: python3 scripts/unexplained_reference_audit.py [--section s01-setup] [--json out.json]
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

# Reuse the anglicism gate rather than reimplementing it. That gate already
# knows two things this pass needs and got wrong on its own: what counts as a
# gloss in this course's voice, and that a term with a glossary entry is
# explained by the hover hint the UI shows, not only by prose. Duplicating
# either would let the two gates disagree about the same sentence.
from anglicism_gloss_audit import GLOSS_NEAR, glossary_available  # noqa: E402
SECTIONS = ROOT / "src/lib/course/sections"
INDEX = ROOT / "src/lib/course/index.ts"
GLOSSARY = ROOT / "src/lib/glossary/terms.ts"

# NO HAND-WRITTEN TERM LIST.
#
# The first version of this pass carried one, and that was the defect: a list
# only finds the terms whoever wrote it already thought of. The objection is
# general -- any technical term that (1) the course has not previously explained
# and exemplified, and (2) buys the reader nothing but trivia.
#
# So the vocabulary is derived from the corpus. A token counts as technical when
# the course itself marks it as such:
#
#   * it sits in a code span, which is the author's own signal for "this is a
#     name from the machine, not ordinary Spanish";
#   * it is an acronym (two or more capitals), which no beginner can decode;
#   * it is capitalised mid-sentence, i.e. a proper noun -- a product, a
#     standard, a company, a format.
#
# Spanish sentence-initial capitals and the course's own identifiers (CASO-,
# CP-, S01-T1-A) are excluded: they are scaffolding, not vocabulary.

# Python's own vocabulary is taught by use throughout the course and is not
# the kind of term this pass is about; place names are setting, not vocabulary.
PY_VOCAB = {
    "dict", "list", "set", "tuple", "str", "int", "float", "bool", "None",
    "True", "False", "finally", "except", "raise", "yield", "lambda", "async",
    "await", "class", "import", "return", "print", "len", "range", "open",
    "self", "args", "kwargs", "None",
}

STOPWORDS = {
    "Python", "Windows", "macOS", "Linux", "Git", "GitHub", "Excel",
    "Ana", "Luis", "Marta", "Lima", "Cusco", "Perú", "PyArcana",
    "Nivel", "Sección", "Contrato", "Entrada", "Salida", "Error", "Meta",
    "Éxito", "Límites", "Contexto", "Mecanismo", "Ancla", "Caso", "Borde",
    "Objetivo", "Resultado", "Nota", "Regla", "Ejemplo", "Antes", "Después",
}

TOKEN_PATTERNS = [
    # a name inside a code span, without call parens or dots -- `argparse`,
    # `NFC`, `POSIX`. Dotted and called forms are usage, not a new term.
    (r"`([A-Za-z][A-Za-z0-9_-]{2,})`", "code-span name"),
    # an acronym: SSRF, RPO, TOCTOU, GIL
    (r"(?<![A-Za-z])([A-Z]{2,6})(?![A-Za-z])", "acronym"),
    # a proper noun mid-sentence: Unix, Docker, Kubernetes, Pydantic
    (r"(?<=[a-záéíóúñ,] )([A-Z][a-zA-Z]{3,})", "proper noun"),
]

# Sentence shapes that introduce a second concept only to contrast with it.
ASIDE_SHAPES = [
    # These must name a *thing* on the far side, not merely contain the word
    # "diferencia". The first version fired on "esa diferencia decide si..."
    # and on "42 y \"42\" como gemelos" -- sentences that are the lesson, not an
    # aside about something else. A contrast is only suspect when it introduces
    # a second named artefact the reader has no use for.
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


def section_order() -> list[str]:
    return re.findall(r"from '\./sections/([^']+)'", INDEX.read_text(encoding="utf-8"))


def glossary_first_use() -> dict[str, str]:
    """term -> the section id where the glossary says it is first introduced."""
    src = GLOSSARY.read_text(encoding="utf-8")
    out: dict[str, str] = {}
    for m in re.finditer(
        r"term:\s*['\"]([^'\"]+)['\"][\s\S]{0,400}?firstSectionId:\s*['\"]([^'\"]+)['\"]", src
    ):
        out[m.group(1).lower()] = m.group(2)
    return out


def paragraphs(src: str) -> list[tuple[str, str]]:
    """(subtopic-or-heading, paragraph text) in source order."""
    out = []
    ctx = "?"
    for m in re.finditer(
        r"heading:\s*['\"]([^'\"]+)['\"]|paragraphs:\s*\[([\s\S]*?)\n\s*\]", src
    ):
        if m.group(1):
            ctx = m.group(1)
            continue
        for q in re.finditer(r'"((?:\\.|[^"\\]){20,})"|\'((?:\\.|[^\'\\]){20,})\'', m.group(2)):
            out.append((ctx, (q.group(1) or q.group(2))))
    return out


def sentences(text: str) -> list[str]:
    t = text.replace("\\n", " ")
    # Keep code spans intact: a period inside `a.b` is not a sentence end.
    stash: list[str] = []
    t = re.sub(r"`[^`]+`", lambda m: (stash.append(m.group(0)), f"\x00{len(stash)-1}\x00")[1], t)
    parts = re.split(r"(?<=[.:;])\s+(?=[A-ZÁÉÍÓÚÑ¿¡*])", t)
    return [re.sub(r"\x00(\d+)\x00", lambda m: stash[int(m.group(1))], p) for p in parts]


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
    """Every token the course itself marks as technical vocabulary."""
    out: set[str] = set()
    for rx, _kind in TOKEN_PATTERNS:
        for m in re.finditer(rx, text):
            t = m.group(1)
            if t in STOPWORDS or t in PY_VOCAB or len(t) < 3:
                continue
            # Identifier fragments the tokenizer split out of snake_case names.
            if re.fullmatch(r"[a-z]+id|[a-z]+_[a-z]+", t):
                continue
            # The course's own identifiers are scaffolding, not vocabulary.
            if re.fullmatch(r"(CASO|CP|S\d+|T\d+|N\d)[A-Z0-9-]*", t):
                continue
            out.add(t)
    return out


GLOSS_MARK = GLOSS_NEAR.pattern


def glossary_terms_available() -> dict[str, int]:
    """alias(lower) -> section index from which the hover definition exists."""
    try:
        return {k.lower(): v for k, v in glossary_available().items()}
    except Exception:
        return {}


def introduction_map(order: list[str]) -> dict[str, int]:
    """term -> 1-based section where the course first *explains* it.

    Explained means the course's own convention: the term appears next to a
    gloss marker -- an em dash, a parenthetical, or one of the phrases used to
    unpack a word. The marker may trail a few words, because a gloss rarely
    sits flush against its term.
    """
    # A glossary entry is an explanation the reader can reach on hover, so it
    # counts as introduced from the section where it becomes available.
    first: dict[str, int] = dict(glossary_terms_available())
    for i, name in enumerate(order, 1):
        src = (SECTIONS / f"{name}.ts").read_text(encoding="utf-8")
        body = "\n".join(
            m.group(1) for m in re.finditer(r"paragraphs:\s*\[([\s\S]*?)\n\s*\]", src)
        )
        for term in candidate_terms(body):
            key = term.lower()
            if key in first:
                continue
            if re.search(rf"`?{re.escape(term)}`?\*{{0,2}}[^.]{{0,45}}?{GLOSS_MARK}", body):
                first[key] = i
    return first


def corpus_frequency(order: list[str]) -> dict[str, int]:
    """How often each candidate term is used across the whole course.

    This is the second of the two questions. A term that appears once, inside a
    story, is colour: the reader meets it, shrugs, and moves on. A term that
    appears thirty times and is never explained is a standing tax -- every one
    of those thirty sentences asks the reader to nod at something they cannot
    evaluate. The counts separate a vocabulary gap that must be closed from a
    piece of trivia that should simply go.
    """
    freq: dict[str, int] = {}
    for name in order:
        src = (SECTIONS / f"{name}.ts").read_text(encoding="utf-8")
        body = "\n".join(
            m.group(1) for m in re.finditer(r"paragraphs:\s*\[([\s\S]*?)\n\s*\]", src)
        )
        for t in candidate_terms(body):
            freq[t.lower()] = freq.get(t.lower(), 0) + len(
                re.findall(rf"(?<![\w`]){re.escape(t)}(?![\w])", body)
            )
    return freq


def audit_section(name: str, idx: int, introduced: dict[str, int],
                  freq: dict[str, int]) -> list[dict]:
    src = (SECTIONS / f"{name}.ts").read_text(encoding="utf-8")
    sid_m = re.search(r"\n\s*id:\s*['\"]([^'\"]+)['\"]", src)
    sid = sid_m.group(1) if sid_m else name
    findings = []

    for ctx, para in paragraphs(src):
        for sent in sentences(para):
            plain = re.sub(r"[*_]", "", sent)
            ungrounded = []
            for term in candidate_terms(plain):
                intro = introduced.get(term.lower())
                # Explained here, or earlier: the reader has been told.
                if intro is not None and intro <= idx:
                    continue
                # Explained in this very sentence.
                if re.search(rf"`?{re.escape(term)}`?\*{{0,2}}[^.]{{0,45}}?{GLOSS_MARK}", plain):
                    continue
                ungrounded.append(term)

            reasons = []
            recurring = [t for t in ungrounded if freq.get(t.lower(), 0) >= 4]
            oneoff = [t for t in ungrounded if freq.get(t.lower(), 0) < 4]
            if recurring:
                reasons.append(
                    "recurring but never explained: "
                    + ", ".join(f"{t}×{freq.get(t.lower(), 0)}" for t in sorted(recurring)[:4])
                )
            if oneoff and not load_bearing_pre(plain):
                reasons.append("one-off technical aside: " + ", ".join(sorted(oneoff)[:4]))
            for rx, why in ASIDE_SHAPES:
                if re.search(rx, plain, re.I):
                    reasons.append(why)
            if not reasons:
                continue

            # Question 2: does the sentence do work? An instruction or a
            # contract earns its terms; an aside has to justify itself.
            load_bearing = bool(
                re.search(
                    r"\b(usa|escribe|ejecuta|define|declara|nunca|siempre|debe|"
                    r"corrige|implementa|devuelve|imprime|no )\b",
                    plain,
                    re.I,
                )
            )
            findings.append(
                {
                    "section": sid,
                    "file": f"{name}.ts",
                    "index": idx,
                    "context": ctx[:60],
                    "sentence": sent.strip()[:260],
                    "reasons": reasons,
                    "ungrounded": sorted(ungrounded),
                    "looks_load_bearing": load_bearing,
                }
            )
    return findings


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--section", default="")
    ap.add_argument("--json", default="")
    args = ap.parse_args()

    order = section_order()
    introduced = introduction_map(order)
    names = [args.section] if args.section else order

    freq = corpus_frequency(order)
    all_f = []
    for i, n in enumerate(names, 1):
        idx = order.index(n) + 1 if n in order else i
        all_f += audit_section(n, idx, introduced, freq)

    # The sentence list is the worklist; the term list is the finding. A term
    # used dozens of times and never explained is one decision, not forty.
    tally: dict[str, tuple[int, int, str]] = {}
    for f in all_f:
        for t in f["ungrounded"]:
            n = freq.get(t.lower(), 0)
            if n < 4:
                continue
            hits, _, first_sec = tally.get(t, (0, n, f["section"]))
            tally[t] = (hits + 1, n, first_sec)
    print("RECURRING TERMS THE COURSE NEVER EXPLAINS")
    print(f"  {'term':16s} {'uses':>5} {'flagged':>8}  first seen")
    for t, (hits, n, sec) in sorted(tally.items(), key=lambda kv: -kv[1][1])[:22]:
        print(f"  {t:16s} {n:>5} {hits:>8}  {sec}")
    print()

    disposable = [f for f in all_f if not f["looks_load_bearing"]]
    print(f"sentences flagged: {len(all_f)}   of which not load-bearing: {len(disposable)}")
    by_reason: dict[str, int] = {}
    for f in all_f:
        for r in f["reasons"]:
            by_reason[r] = by_reason.get(r, 0) + 1
    for r, c in sorted(by_reason.items(), key=lambda kv: -kv[1]):
        print(f"  {c:>4}  {r}")

    if args.json:
        Path(args.json).write_text(json.dumps(all_f, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"\nwritten to {args.json}")
    else:
        for f in disposable[:20]:
            print(f"\n  {f['section']} · {f['context']}")
            print(f"    {f['sentence'][:150]}")
            print(f"    -> {'; '.join(f['reasons'])}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
