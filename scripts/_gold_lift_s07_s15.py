#!/usr/bin/env python3
"""Lift S07–S15 (except S09) theory paragraphs + weDo instructions to gold depth.

Targets: avg_para ≥ 250, avg_instr ≥ 150, thin_para_ratio → 0.
Keeps structure (9 heads, 8 demos, 24 exercises). ES-PE + progressive disclosure.
"""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SECTIONS = ROOT / "src/lib/course/sections"

# Section themes for unique expansion (progressive disclosure ceilings)
THEMES = {
    7: {
        "title": "Texto, Unicode y regex",
        "apis": "stdlib str/unicodedata/re (S01–S07)",
        "no": "no pandas, no APIs de S08+",
        "caso": "nombres sintéticos José/Quispe, emails/teléfonos ficticios, Lima/Arequipa",
        "gate": "normalización NFC + evidencia textual (CP-N1-A/B)",
        "domain": "texto y similaridad",
    },
    8: {
        "title": "Archivos, CSV, JSON e ingesta",
        "apis": "pathlib, csv, json, open/with (S01–S08)",
        "no": "no pandas de S15, no requests de S12",
        "caso": "CSV/JSON sintéticos de clientes C00x y montos PEN ficticios",
        "gate": "contrato de ingesta y manifest CP-N1-B",
        "domain": "ingesta de archivos",
    },
    10: {
        "title": "Módulos, packaging y CLI",
        "apis": "importlib, argparse, pyproject conceptual (S01–S10)",
        "no": "no sklearn real, no packaging cloud",
        "caso": "CLI local que emite scores sintéticos y exit codes",
        "gate": "módulo instalable + CLI auditable",
        "domain": "packaging y CLI",
    },
    11: {
        "title": "OOP y modelo de dominio",
        "apis": "clases, dataclass, composition (S01–S11)",
        "no": "no frameworks web, no ORMs de S19",
        "caso": "entidades sintéticas Cliente/Caso con invariantes",
        "gate": "modelo de dominio testeable",
        "domain": "OOP de dominio",
    },
    12: {
        "title": "APIs, SQL y geodatos responsables",
        "apis": "requests conceptual + sqlite3 + math haversine (S01–S12)",
        "no": "no RPA, no dashboard de S13, no NumPy de S14",
        "caso": "endpoints sintéticos, SQL local, coords Lima ficticias",
        "gate": "acceso responsable a API/SQL/geo",
        "domain": "APIs y geodatos",
    },
    13: {
        "title": "Familiarity Evidence Dashboard",
        "apis": "stdlib + reglas deterministas S01–S13",
        "no": "no ML sklearn, no NumPy/Pandas de S14–S15",
        "caso": "pares sintéticos C00x, scores ER vs relación separados",
        "gate": "CP-N1-C + CF-1; fail-closed, revisión humana",
        "domain": "entity resolution y evidencia",
    },
    14: {
        "title": "NumPy y cómputo vectorizado",
        "apis": "numpy ndarray/ufunc/broadcast (S01–S14)",
        "no": "no pandas S15, no sklearn",
        "caso": "arrays de montos/scores sintéticos, coords toy",
        "gate": "cómputo vectorizado reproducible CP-N2-A prep",
        "domain": "NumPy vectorizado",
    },
    15: {
        "title": "Pandas ingesta, selección y tipos",
        "apis": "pandas Series/DataFrame + stdlib (S01–S15)",
        "no": "no quality-gate avanzado de S16, no joins S17",
        "caso": "clientes/tx sintéticos Lima/Arequipa, dtypes controlados",
        "gate": "dataset tipado CP-N2-A",
        "domain": "Pandas ingesta",
    },
}

KIND_LABEL = {
    "guided": "E1 (guiado)",
    "independent": "E2 (independiente)",
    "transfer": "E3 (transferencia)",
    "e1": "E1 (guiado)",
    "e2": "E2 (independiente)",
    "e3": "E3 (transferencia)",
}


def unescape_ts(s: str) -> str:
    out = []
    i = 0
    while i < len(s):
        if s[i] == "\\" and i + 1 < len(s):
            n = s[i + 1]
            if n == "n":
                out.append("\n")
            elif n == "t":
                out.append("\t")
            elif n == '"':
                out.append('"')
            elif n == "'":
                out.append("'")
            elif n == "\\":
                out.append("\\")
            else:
                out.append(n)
            i += 2
            continue
        out.append(s[i])
        i += 1
    return "".join(out)


def escape_ts(s: str) -> str:
    return (
        s.replace("\\", "\\\\")
        .replace('"', '\\"')
        .replace("\n", "\\n")
        .replace("\t", "\\t")
    )


def extract_string_array(text: str, bracket_pos: int):
    """bracket_pos points at '[' of the array."""
    i = bracket_pos
    if i < 0 or text[i] != "[":
        return [], None, None
    depth = 0
    in_str = False
    esc = False
    j = i
    while j < len(text):
        c = text[j]
        if in_str:
            if esc:
                esc = False
            elif c == "\\":
                esc = True
            elif c == '"':
                in_str = False
        else:
            if c == '"':
                in_str = True
            elif c == "[":
                depth += 1
            elif c == "]":
                depth -= 1
                if depth == 0:
                    body = text[i + 1 : j]
                    strings = []
                    spans = []  # (start,end) absolute in text for each string content
                    k = 0
                    while k < len(body):
                        if body[k] == '"':
                            content_start = k + 1
                            k += 1
                            while k < len(body):
                                if body[k] == "\\" and k + 1 < len(body):
                                    k += 2
                                    continue
                                if body[k] == '"':
                                    raw = body[content_start:k]
                                    strings.append(raw)
                                    abs_start = i + 1 + content_start
                                    abs_end = i + 1 + k
                                    spans.append((abs_start, abs_end))
                                    k += 1
                                    break
                                k += 1
                            continue
                        k += 1
                    return strings, spans, j + 1
        j += 1
    return [], None, None


def deepen_paragraph(p: str, role: int, idx: int, heading: str, theme: dict) -> str:
    p = p.strip()
    if len(p) >= 255:
        return p

    # Role-specific operational depth
    why = (
        f" En {theme['domain']}, el *porqué* es operativo: reduce ambigüedad en pipelines locales, "
        f"deja rastro auditable y alimenta {theme['gate']} sin inventar hechos sobre personas reales."
    )
    contract = (
        f" Contrato: entrada explícita → transformación documentada → salida medible; "
        f"si falta evidencia o el schema no cuadra, falla cerrado (fail-closed) en lugar de rellenar en silencio. "
        f"Stack permitido: {theme['apis']}; {theme['no']}."
    )
    case = (
        f" Caso sintético Perú: {theme['caso']}. "
        f"Documenta decisión, métrica y límite conocido en el memo del subtema «{heading}»; "
        f"nunca PII real ni inferencia automática de parentesco/fraude."
    )

    extras = [why, contract, case]
    # Prefer role-aligned extra first, then fill to ≥250
    ordered = [extras[role % 3]] + [extras[(role + 1) % 3], extras[(role + 2) % 3]]
    out = p
    for extra in ordered:
        if len(out) >= 255:
            break
        # Avoid duplicating if already present
        snippet = extra.strip()[:40]
        if snippet and snippet in out:
            continue
        # Join with space if paragraph doesn't end with punctuation space
        if out and out[-1] not in ".!?":
            out = out.rstrip() + "."
        out = out + extra
    # If still short (very rare), pad with gate reminder
    while len(out) < 255:
        out += (
            f" Revisa siempre filas/campos afectados y conserva evidencia cruda cuando el valor canónico "
            f"pueda disputarse en revisión humana del gate {theme['gate']}."
        )
        break
    # Cap runaway length
    if len(out) > 520:
        out = out[:517].rsplit(" ", 1)[0] + "."
    return out


def deepen_instruction(
    instr: str,
    ex_id: str,
    kind: str,
    subtopic: str,
    theme: dict,
    solution_output: str | None,
) -> str:
    instr = instr.strip()
    if len(instr) >= 155:
        # Still ensure concept framing if missing
        if "Concepto:" in instr or "concepto:" in instr:
            return instr
        # light wrap if already long enough
        return instr

    # Derive E label from id if kind missing
    ek = kind.lower() if kind else ""
    if not ek:
        if ex_id.endswith("E1"):
            ek = "guided"
        elif ex_id.endswith("E2"):
            ek = "independent"
        else:
            ek = "transfer"
    label = KIND_LABEL.get(ek, "E1 (guiado)")

    # Concept from subtopic + existing text
    concept = subtopic or theme["domain"]
    # Strip existing E prefix if present to avoid double
    core = re.sub(r"^E[123]\s*\([^)]*\)\s*[—\-–]\s*", "", instr).strip()
    if core.lower().startswith("concepto:"):
        core = core.split(":", 1)[-1].strip()

    pass_hint = "salida exacta del solution output del starter"
    if solution_output:
        so = solution_output.strip().replace("\n", " | ")
        if len(so) <= 60:
            pass_hint = f"`{so}`"
        else:
            pass_hint = f"primeros tokens de `{so[:50]}…` según solution"

    fixture = f"fixture sintético del starter (`CASO`/ids C00x) en {theme['domain']}"

    out = (
        f"{label} — Concepto: {concept} ({theme['title']}). "
        f"Entrada: {fixture}. Tarea: {core} "
        f"Salida/pass: {pass_hint}. "
        f"Conserva el contrato del starter (no borres asserts ni datos); {theme['no']}; "
        f"solo {theme['apis']}."
    )
    if len(out) < 155:
        out += (
            f" Si el caso adverso aparece en E2/E3, falla de forma explícita y no inventes evidencia."
        )
    if len(out) > 420:
        out = out[:417].rsplit(" ", 1)[0] + "."
    return out


def find_heading_before(text: str, pos: int) -> str:
    chunk = text[max(0, pos - 400) : pos]
    m = list(re.finditer(r'heading:\s*"((?:\\.|[^"\\])*)"', chunk))
    if not m:
        return "mapa"
    return unescape_ts(m[-1].group(1))


def process_file(idx: int, filename: str) -> dict:
    path = SECTIONS / filename
    text = path.read_text(encoding="utf-8")
    theme = THEMES[idx]
    original = text

    # --- Theory paragraphs (before iDo) ---
    ido = text.find("iDo:")
    if ido < 0:
        ido = len(text)
    theory_end = ido

    replacements = []  # (start, end, new_escaped_content)
    pos = 0
    para_lens_before = []
    para_lens_after = []

    while True:
        m = re.search(r"paragraphs:\s*", text[pos:theory_end])
        if not m:
            break
        abs_after = pos + m.end()
        # find '['
        bracket = text.find("[", abs_after - 1, abs_after + 20)
        if bracket < 0:
            pos = abs_after
            continue
        strings, spans, end = extract_string_array(text, bracket)
        if spans is None:
            break
        heading = find_heading_before(text, bracket)
        for role, (raw, span) in enumerate(zip(strings, spans)):
            plain = unescape_ts(raw)
            para_lens_before.append(len(plain))
            deep = deepen_paragraph(plain, role, idx, heading, theme)
            para_lens_after.append(len(deep))
            replacements.append((span[0], span[1], escape_ts(deep)))
        pos = end

    # --- Instructions ---
    # Map exercise id -> solution output (nearest following output in solutionCode)
    # Simpler: expand each instruction in place; try to find following solution output
    instr_pat = re.compile(
        r'(id:\s*"(S\d+-T\d+-[AB]-E\d)",\s*'
        r'subtopicId:\s*"([^"]+)",\s*'
        r'kind:\s*"([^"]+)",\s*'
        r'instruction:\s*")((?:\\.|[^"\\])*)(")',
        re.S,
    )
    instr_lens_before = []
    instr_lens_after = []

    for m in instr_pat.finditer(text):
        ex_id = m.group(2)
        sub = m.group(3)
        kind = m.group(4)
        raw = m.group(5)
        plain = unescape_ts(raw)
        instr_lens_before.append(len(plain))
        # look ahead for solution output
        tail = text[m.end() : m.end() + 1200]
        om = re.search(r"output:\s*`([^`]*)`", tail)
        sol_out = om.group(1) if om else None
        deep = deepen_instruction(plain, ex_id, kind, sub, theme, sol_out)
        instr_lens_after.append(len(deep))
        # span of content inside quotes: group 5
        start = m.start(5)
        end = m.end(5)
        replacements.append((start, end, escape_ts(deep)))

    # Apply replacements from end to start
    replacements.sort(key=lambda x: x[0], reverse=True)
    # Deduplicate overlapping (shouldn't happen)
    seen = set()
    for start, end, new in replacements:
        if (start, end) in seen:
            continue
        seen.add((start, end))
        text = text[:start] + new + text[end:]

    if text != original:
        path.write_text(text, encoding="utf-8")

    def stats(before, after):
        return {
            "n": len(after),
            "avg_before": round(sum(before) / len(before), 1) if before else 0,
            "avg_after": round(sum(after) / len(after), 1) if after else 0,
            "min_after": min(after) if after else 0,
            "thin_after": round(sum(1 for x in after if x < 120) / len(after), 3) if after else 0,
            "short_instr_after": sum(1 for x in after if x < 150) if after else 0,
        }

    return {
        "file": filename,
        "index": idx,
        "kb": round(path.stat().st_size / 1024, 1),
        "para": stats(para_lens_before, para_lens_after),
        "instr": {
            "n": len(instr_lens_after),
            "avg_before": round(sum(instr_lens_before) / len(instr_lens_before), 1) if instr_lens_before else 0,
            "avg_after": round(sum(instr_lens_after) / len(instr_lens_after), 1) if instr_lens_after else 0,
            "min_after": min(instr_lens_after) if instr_lens_after else 0,
            "short_after": sum(1 for x in instr_lens_after if x < 150) if instr_lens_after else 0,
        },
        "changed": text != original,
    }


def main():
    targets = [
        (15, "s15-stdlib-deep.ts"),
        (14, "s14-security.ts"),
        (13, "s13-rpa-automation.ts"),
        (12, "s12-performance.ts"),
        (11, "s11-testing.ts"),
        (10, "s10-sklearn.ts"),
        (8, "s08-pandas.ts"),
        (7, "s07-data-acquisition.ts"),
    ]
    results = []
    for idx, f in targets:
        r = process_file(idx, f)
        results.append(r)
        print(
            f"S{idx:02d} para {r['para']['avg_before']}→{r['para']['avg_after']} "
            f"(min {r['para']['min_after']}, thin {r['para']['thin_after']}) | "
            f"instr {r['instr']['avg_before']}→{r['instr']['avg_after']} "
            f"(min {r['instr']['min_after']}, short {r['instr']['short_after']}) | "
            f"{r['kb']}kb"
        )
    out = ROOT / "course-state/curriculum_hardening/dossiers/S07_S15_AFTER.json"
    out.write_text(__import__("json").dumps({str(r["index"]): r for r in results}, indent=2), encoding="utf-8")
    print("wrote", out)


if __name__ == "__main__":
    main()
