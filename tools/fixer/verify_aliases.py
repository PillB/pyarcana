#!/usr/bin/env python3
"""Accept a proposed glossary alias only if it is a name the course uses, not a gloss.

Codex's proposal conflated two things. An alias is a *name* for a concept - "tupla",
"comprensión de lista". A gloss is a *definition* - "punto guardado del historial" for
commit, "sistema de control de versiones" for git. A gloss used as an alias makes the
concept map count the definition as a mention of its own term, and turns every
explanatory sentence into a hover-hint trigger. "sistema de control de versiones" is
also a category, not Git: it names Mercurial and SVN just as well.

An alias passes only if all hold:
  1. it occurs in active course prose outside code
  2. it is used as a name somewhere - not only as a gloss beside the English term
  3. it has no relative or verbal clause (unless it expands the term's acronym)
  4. it is not a bare common word that names other things in a data course
  5. it does not collide with another term's alias

Word count was the first test for "name vs gloss", and it was wrong both ways: it rejected
"análisis exploratorio de datos", which is EDA's own expansion, and accepted "recortes por
posiciones", which only ever appears in brackets after "slicing". Position is the real
signal. A gloss sits in parentheses or dashes right after the English term; a name stands
on its own.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

# Words that make a phrase descriptive rather than a name.
DESCRIPTIVE = re.compile(
    r"\b(que|cuando|donde|cuenta|cuentan|incrusta\w*|guardad\w*|para|sin|entre|"
    r"lee|leen|escribe|devuelve|ejecuta|permite|sirve|contiene)\b", re.I)
# Bare words too broad to stand alone as an alias in this course.
TOO_COMMON = set("""lista listas valor valores conjunto conjuntos prueba pruebas modelo modelos
clase clases archivo archivos dato datos tabla tablas registro registros campo campos
función funciones método métodos objeto objetos tipo tipos error errores sistema sistemas
proceso procesos cambio cambios paquete paquetes""".split())


def course_prose() -> str:
    events = json.loads((ROOT / ".fixer/events.json").read_text(encoding="utf-8"))
    code = re.compile(r"```[\s\S]*?```|`[^`]*`")
    return "\n".join(code.sub(" ", e["text"]) for e in events["events"]
                     if e["learner_visible"] and not e["kind"].endswith("code")
                     and e["kind"] not in {"solution", "wedo.starter", "youdo.starter"})


def main() -> int:
    props = json.loads((ROOT / ".fixer/aliases.result.json").read_text(encoding="utf-8"))["proposals"]
    prose = course_prose()
    low = prose.lower()

    owner: dict[str, str] = {}
    for p in props:
        for a in p["aliases"]:
            owner.setdefault(a["alias"].lower(), p["term_id"])

    terms = json.loads((ROOT / ".fixer/glossary_terms.json").read_text(encoding="utf-8"))
    english_forms = {t["id"]: [t["term"], *t["aliases"]] for t in terms}

    accepted, rejected = [], []
    for p in props:
        for a in p["aliases"]:
            alias = a["alias"].strip()
            k = alias.lower()
            n = len(re.findall(rf"(?<![\w]){re.escape(k)}(?![\w])", low))
            words = k.split()
            why = None
            standalone = 0
            for m in re.finditer(rf"(?<![\w]){re.escape(k)}(?![\w])", low):
                before = low[max(0, m.start() - 60):m.start()]
                # glossed: an opening bracket or dash shortly before, with an English form of
                # the same term just ahead of it - "slicing (recortes por posiciones)"
                glossed = re.search(r"[(\u2014\u2013-]\s*$", before.rstrip()[-3:] + " ") and any(
                    e.lower() in before for e in english_forms.get(p["term_id"], []))
                if not glossed:
                    standalone += 1
            initials = "".join(w[0] for w in re.findall(r"[a-záéíóúñ]+", k) if len(w) > 2)
            expands_acronym = p["term_id"].replace("-", "").isalpha() and \
                len(p["term_id"]) <= 5 and initials.startswith(p["term_id"][:2])
            why = None
            if n == 0:
                why = "does not occur in active course prose outside code"
            elif standalone == 0:
                why = "only ever appears as a gloss beside the English term"
            elif DESCRIPTIVE.search(k) and not expands_acronym:
                why = "reads as a definition, not a name"
            elif len(words) == 1 and k in TOO_COMMON:
                why = "a bare common word that names other things in this course"
            elif owner.get(k) != p["term_id"]:
                why = f"collides with {owner.get(k)}"
            row = {"term_id": p["term_id"], "alias": alias, "occurrences": n, "standalone": standalone}
            (rejected if why else accepted).append({**row, **({"why": why} if why else {})})

    report = {"accepted": accepted, "rejected": rejected}
    (ROOT / ".fixer/aliases.verified.json").write_text(json.dumps(report, indent=1, ensure_ascii=False),
                                                      encoding="utf-8")
    print(f"accepted {len(accepted)}, rejected {len(rejected)}\n")
    print("ACCEPTED")
    for r in accepted:
        print(f"  {r['term_id']:22s} {r['alias']!r:34s} x{r['occurrences']} (standalone {r['standalone']})")
    print("\nREJECTED")
    for r in rejected:
        print(f"  {r['term_id']:22s} {r['alias']!r:42s} {r['why']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
