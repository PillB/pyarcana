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

ROOT = Path(__file__).resolve().parents[1]
SECTIONS = ROOT / "src/lib/course/sections"
INDEX = ROOT / "src/lib/course/index.ts"
GLOSSARY = ROOT / "src/lib/glossary/terms.ts"

# Terms a Spanish-speaking beginner is not expected to arrive with, that the
# course uses without always introducing. Deliberately not a jargon list: these
# are the ones that turn up inside asides.
ASSUMED_WORLD = [
    "Unix", "POSIX", "Linux", "kernel", "shell de login", "daemon",
    "dotfile", "inode", "symlink", "hard link", "PATH del sistema",
    "endianness", "big-endian", "little-endian", "ASCII", "locale del SO",
    "stdin", "stderr", "descriptor de archivo", "pipe con nombre",
    "variable de entorno", "secretos", "`.env`", "12-factor",
    "glob", "regex", "wildcard", "here-doc",
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


def audit_section(name: str, idx: int, order: list[str], gloss: dict[str, str]) -> list[dict]:
    src = (SECTIONS / f"{name}.ts").read_text(encoding="utf-8")
    sid_m = re.search(r"\n\s*id:\s*['\"]([^'\"]+)['\"]", src)
    sid = sid_m.group(1) if sid_m else name
    findings = []

    for ctx, para in paragraphs(src):
        for sent in sentences(para):
            plain = re.sub(r"[*_]", "", sent)
            reasons = []

            for term in ASSUMED_WORLD:
                bare = term.strip("`")
                hit = re.search(rf"(?<![\w`/]){re.escape(bare)}(?![\w])", plain)
                if not hit:
                    continue
                # Introduced right here? Then it is grounded, not assumed.
                if re.search(
                    rf"{re.escape(bare)}[^.]{{0,40}}?(—|\(|,\s*(?:esto es|es decir|o sea))", plain
                ):
                    continue
                # Naming the reader's own platform is not an assumption: they
                # know which machine they are sitting at. "macOS/Linux" as a
                # column label teaches nothing and costs nothing. The problem is
                # the term used as *justification* -- inside the clause that
                # explains why something is the way it is.
                before = plain[max(0, hit.start() - 60) : hit.start()]
                as_label = re.search(r"(Windows|macOS)\s*[·/→|-]\s*$|^\s*\*\*[^*]{0,30}$", before)
                explanatory = re.search(
                    r"(porque|ya que|dado que|puesto que|queda|se distingue|"
                    r"a diferencia|de modo que|así que|: )\s*[^.]{0,60}$",
                    before,
                )
                if as_label and not explanatory:
                    continue
                if not explanatory and not re.search(r"[(,]\s*[^.]{0,40}$", before):
                    # Bare mention in a list or a heading-like fragment: cheap,
                    # not a claim the reader has to evaluate.
                    continue
                reasons.append(f"assumes «{bare}» inside an explanation")

            for rx, why in ASIDE_SHAPES:
                if re.search(rx, plain, re.I):
                    reasons.append(why)

            if not reasons:
                continue

            # An aside is cheap to remove when the sentence is not the
            # instruction: no imperative, no contract language.
            load_bearing = bool(
                re.search(r"\b(usa|escribe|ejecuta|define|declara|nunca|siempre|debe|no )\b", plain, re.I)
            )
            findings.append(
                {
                    "section": sid,
                    "file": f"{name}.ts",
                    "index": idx,
                    "context": ctx[:60],
                    "sentence": sent.strip()[:260],
                    "reasons": sorted(set(reasons)),
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
    gloss = glossary_first_use()
    names = [args.section] if args.section else order

    all_f = []
    for i, n in enumerate(names, 1):
        all_f += audit_section(n, order.index(n) + 1 if n in order else i, order, gloss)

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
