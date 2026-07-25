#!/usr/bin/env python3
"""
Spanish grammar / style / structure quality audit for PyArcana course sections.

Research basis (heuristics + formulas):
- Fernández-Huerta (1959): Spanish adaptation of Flesch Reading Ease
    FH = 206.84 − 60·(syllables/words) − 1.02·(words/sentences)
- Szigriszt-Pazos / INFLESZ (perspicuity scale for Spanish):
    SP = 206.835 − 62.3·(syllables/words) − (words/sentences)
- Surface structure: words/sentence, syllables/word, paragraph density
- Style/structure heuristics for technical Spanish pedagogy
- Optional LanguageTool (es) for grammar/spelling/style rules via public API

Usage:
  python3 scripts/spanish_quality_audit.py
  python3 scripts/spanish_quality_audit.py --no-lt
  python3 scripts/spanish_quality_audit.py --from 1 --to 10
"""
from __future__ import annotations

import argparse
import json
import re
import time
import urllib.error
import urllib.parse
import urllib.request
from collections import Counter
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
SECTIONS_DIR = ROOT / "src" / "lib" / "course" / "sections"
INDEX = ROOT / "src" / "lib" / "course" / "index.ts"
OUT_DIR = ROOT / "course-state" / "curriculum_hardening" / "audits" / "spanish_quality"

PROSE_KEYS = (
    "intro",
    "why",
    "instruction",
    "description",
    "hint",
    "feedback",
    "heading",
    "summary",
    "narrative",
    "bridge",
    "title",
    "subtitle",
    "objective",
    "objectives",
    "takeaway",
    "takeaways",
    "edgeCases",
    "tests",
    "body",
    "content",
    "label",
    "caption",
)

CODE_LIKE = re.compile(
    r"^[`$]|^\s*(import |from |def |class |return |print\(|if |for |while |"
    r"const |let |var |function |# |//|/\*|\*|npm |git |python|pip )",
    re.I,
)

ES_MARKERS = re.compile(
    r"\b(el|la|los|las|de|del|un|una|que|con|para|por|como|más|menos|es|son|"
    r"está|están|tiene|tienen|se|su|sus|este|esta|estos|estas|también|"
    r"cuando|donde|porque|aunque|si|no|sí|muy|ya|aquí|allí|entonces|"
    r"después|antes|cada|todo|toda|todos|todas|puedes|debe|debes|vamos|"
    r"nuestro|nuestra|entre|sobre|sin|hasta|desde|durante)\b",
    re.I,
)


@dataclass
class Finding:
    severity: str
    category: str
    rule: str
    message: str
    cause: str
    improvement: str
    excerpt: str
    section: int
    field: str
    unit: str
    unit_index: int


def active_section_files() -> list[tuple[int, Path]]:
    text = INDEX.read_text(encoding="utf-8")
    imports = re.findall(
        r"import\s+\{\s*section(\d{2})\s*\}\s+from\s+['\"]\./sections/([^'\"]+)['\"]",
        text,
    )
    out: list[tuple[int, Path]] = []
    for num, stem in imports:
        p = SECTIONS_DIR / f"{stem}.ts"
        if p.exists():
            out.append((int(num), p))
    return sorted(out, key=lambda x: x[0])


def extract_string_literals(source: str) -> list[tuple[str, str]]:
    results: list[tuple[str, str]] = []
    key_pat = re.compile(
        r"(?P<key>" + "|".join(PROSE_KEYS) + r")\s*:\s*"
        r"(?P<q>['\"`])(?P<body>(?:\\.|(?!\2).)*?)(?P=q)",
        re.S,
    )
    for m in key_pat.finditer(source):
        key = m.group("key")
        body = m.group("body")
        body = (
            body.replace("\\n", "\n")
            .replace("\\t", "\t")
            .replace("\\'", "'")
            .replace('\\"', '"')
            .replace("\\`", "`")
            .replace("\\\\", "\\")
        )
        body = re.sub(r"\$\{[^}]*\}", " ", body).strip()
        if len(body) < 25:
            continue
        if body.count("\n") > 3 and sum(
            1 for ln in body.splitlines() if CODE_LIKE.match(ln or "x")
        ) > 2:
            continue
        if not ES_MARKERS.search(body) and len(re.findall(r"[áéíóúñüÁÉÍÓÚÑÜ]", body)) < 2:
            if not re.search(r"\b(y|o|en|al|lo|le)\b", body, re.I):
                continue
        results.append((key, body))

    arr_pat = re.compile(
        r"(?P<key>edgeCases|objectives|takeaways|hints)\s*:\s*\[(?P<body>.*?)\]",
        re.S,
    )
    str_item = re.compile(r"(['\"])((?:\\.|(?!\1).)*?)\1")
    for m in arr_pat.finditer(source):
        key = m.group("key")
        for sm in str_item.finditer(m.group("body")):
            body = sm.group(2).replace("\\n", " ").replace("\\'", "'").replace('\\"', '"')
            body = body.strip()
            if len(body) >= 25 and ES_MARKERS.search(body):
                results.append((key, body))
    return results


def count_syllables_es(word: str) -> int:
    w = word.lower()
    w = re.sub(r"[^a-záéíóúüñ]", "", w)
    if not w:
        return 0
    w = re.sub(r"g[uü]([ei])", r"g\1", w)
    w = re.sub(r"q[uü]([ei])", r"q\1", w)
    vowels = "aeiouáéíóúü"
    groups = re.findall(rf"[{vowels}]+", w)
    return len(groups) or 1


def tokenize_words(text: str) -> list[str]:
    return re.findall(r"[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9]+(?:'[A-Za-z]+)?", text)


def split_paragraphs(text: str) -> list[str]:
    parts = re.split(r"\n\s*\n+", text.strip())
    if len(parts) == 1:
        parts = [p.strip() for p in text.split("\n") if p.strip()]
    return [p.strip() for p in parts if p.strip()]


def split_sentences(text: str) -> list[str]:
    text = text.strip()
    if not text:
        return []
    protected = text
    for abbr in ("p. ej.", "ee. uu.", "EE. UU.", "etc.", "Dr.", "Sr.", "Sra.", "núm."):
        protected = protected.replace(abbr, abbr.replace(".", "∯"))
    chunks = re.split(r"(?<=[.!?…])\s+(?=[¿¡\"'«A-ZÁÉÍÓÚÜÑ0-9])", protected)
    out = []
    for c in chunks:
        c = c.replace("∯", ".").strip()
        if c:
            out.append(c)
    return out or [text]


def fernandez_huerta(syllables: int, words: int, sentences: int) -> float | None:
    if words < 1 or sentences < 1:
        return None
    return 206.84 - 60.0 * (syllables / words) - 1.02 * (words / sentences)


def szigriszt_pazos(syllables: int, words: int, sentences: int) -> float | None:
    if words < 1 or sentences < 1:
        return None
    return 206.835 - 62.3 * (syllables / words) - (words / sentences)


def fh_label(score: float | None) -> str:
    if score is None:
        return "n/a"
    if score >= 90:
        return "muy fácil"
    if score >= 80:
        return "fácil"
    if score >= 70:
        return "bastante fácil"
    if score >= 60:
        return "normal"
    if score >= 50:
        return "bastante difícil"
    if score >= 30:
        return "difícil"
    return "muy difícil"


def metrics_for_text(
    text: str,
) -> tuple[int, int, int, float, float, float | None, float | None]:
    sents = split_sentences(text)
    words = [w for w in tokenize_words(text) if not re.fullmatch(r"[A-Z_]{2,}", w)]
    syll = sum(
        count_syllables_es(w) for w in words if re.search(r"[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]", w)
    )
    nw = len(words)
    ns = len(sents) if words else 0
    if nw == 0:
        return 0, 0, 0, 0.0, 0.0, None, None
    wps = nw / max(ns, 1)
    spw = syll / nw
    return (
        nw,
        max(ns, 1),
        syll,
        wps,
        spw,
        fernandez_huerta(syll, nw, max(ns, 1)),
        szigriszt_pazos(syll, nw, max(ns, 1)),
    )


def finding(
    severity: str,
    category: str,
    rule: str,
    message: str,
    cause: str,
    improvement: str,
    excerpt: str,
    section: int,
    field: str,
    unit: str,
    unit_index: int,
) -> Finding:
    return Finding(
        severity=severity,
        category=category,
        rule=rule,
        message=message,
        cause=cause,
        improvement=improvement,
        excerpt=excerpt[:180].replace("\n", " "),
        section=section,
        field=field,
        unit=unit,
        unit_index=unit_index,
    )


def heuristic_sentence(
    sent: str, section: int, field: str, idx: int
) -> list[Finding]:
    f: list[Finding] = []
    words = tokenize_words(sent)
    n = len(words)
    stripped = sent.strip()

    # Headings / short titles are intentionally without terminal periods
    title_like_field = field in {
        "heading",
        "title",
        "subtitle",
        "label",
        "caption",
        "description",
    }
    looks_like_title = n <= 14 and not re.search(
        r"\b(es|son|está|están|debe|debes|puedes|usa|usa|crea|escribe|completa|revisa|observa)\b",
        stripped,
        re.I,
    )
    if (
        n >= 8
        and not title_like_field
        and not looks_like_title
        and not re.search(r"[.!?…»\")\]]$", stripped)
        and not stripped.endswith(":")
        and not stripped.startswith(("#", "-", "*", "`", "E1", "E2", "E3", "T1", "T2", "T3", "T4"))
    ):
        f.append(
            finding(
                "medium",
                "structure",
                "missing_terminal_punct",
                "Oración sin puntuación final clara",
                "La segmentación pedagógica a veces deja frases colgando sin punto.",
                "Cierra con punto, o convierte en lista/viñeta deliberada.",
                stripped,
                section,
                field,
                "sentence",
                idx,
            )
        )

    if n > 45:
        f.append(
            finding(
                "high" if n > 60 else "medium",
                "structure",
                "run_on_sentence",
                f"Oración muy larga ({n} palabras)",
                "Muchas cláusulas subordinadas o enumeraciones sin dividir elevan la carga cognitiva.",
                "Parte en 2–3 oraciones; mueve ejemplos a viñetas o a un bloque de código.",
                stripped,
                section,
                field,
                "sentence",
                idx,
            )
        )
    elif n > 32:
        f.append(
            finding(
                "low",
                "structure",
                "long_sentence",
                f"Oración larga ({n} palabras)",
                "Por encima de ~30 palabras la comprensión baja en material técnico.",
                "Revisa si puedes cortar en el conector (y, pero, porque, aunque).",
                stripped,
                section,
                field,
                "sentence",
                idx,
            )
        )

    if 1 <= n <= 2 and not stripped.startswith(
        ("**", "#", "-", "•", "E1", "E2", "E3", "T")
    ):
        if not re.match(r"^[¿¡A-ZÁÉÍÓÚÜÑ]", stripped):
            f.append(
                finding(
                    "low",
                    "structure",
                    "fragment",
                    "Fragmento muy corto",
                    "Puede ser título residual o frase sin predicado.",
                    "Integra al párrafo anterior o añade verbo y complemento.",
                    stripped,
                    section,
                    field,
                    "sentence",
                    idx,
                )
            )

    if (
        "?" in stripped
        and "¿" not in stripped
        and ES_MARKERS.search(stripped)
        and n >= 4
    ):
        f.append(
            finding(
                "medium",
                "orthography",
                "missing_inverted_question",
                "Interrogación sin '¿' de apertura",
                "En español las preguntas llevan signos de apertura y cierre.",
                "Añade '¿' al inicio de la pregunta.",
                stripped,
                section,
                field,
                "sentence",
                idx,
            )
        )
    if (
        "!" in stripped
        and "¡" not in stripped
        and ES_MARKERS.search(stripped)
        and n >= 3
    ):
        f.append(
            finding(
                "low",
                "orthography",
                "missing_inverted_exclamation",
                "Exclamación sin '¡' de apertura",
                "Convención ortográfica del español.",
                "Añade '¡' al inicio si es exclamativa real.",
                stripped,
                section,
                field,
                "sentence",
                idx,
            )
        )

    if re.search(r"\s+[.,;:!?]", stripped):
        f.append(
            finding(
                "low",
                "style",
                "space_before_punct",
                "Espacio antes de puntuación",
                "Ruido tipográfico frecuente en generación o edición multi-línea.",
                "Elimina el espacio delante de , . ; : ! ?",
                stripped,
                section,
                field,
                "sentence",
                idx,
            )
        )

    if "  " in stripped:
        f.append(
            finding(
                "low",
                "style",
                "double_space",
                "Espacios dobles",
                "Artefacto de concatenación o plantillas.",
                "Normaliza a un solo espacio.",
                stripped,
                section,
                field,
                "sentence",
                idx,
            )
        )

    for a, b in [("(", ")"), ("[", "]"), ("{", "}"), ("«", "»")]:
        if stripped.count(a) != stripped.count(b):
            f.append(
                finding(
                    "medium",
                    "structure",
                    "unbalanced_delimiters",
                    f"Delimitadores desbalanceados {a}{b}",
                    "Cortes de frase o markdown incompleto.",
                    f"Revisa el emparejamiento de {a} y {b}.",
                    stripped,
                    section,
                    field,
                    "sentence",
                    idx,
                )
            )
            break

    if stripped.count('"') % 2 == 1:
        f.append(
            finding(
                "low",
                "structure",
                "unbalanced_quotes",
                "Comillas posiblemente desbalanceadas",
                "Citas o términos técnicos mal cerrados.",
                "Cierra las comillas o usa `código` para tokens.",
                stripped,
                section,
                field,
                "sentence",
                idx,
            )
        )

    for i in range(len(words) - 1):
        if (
            words[i].lower() == words[i + 1].lower()
            and words[i].isalpha()
            and len(words[i]) > 2
        ):
            f.append(
                finding(
                    "medium",
                    "grammar",
                    "repeated_word",
                    f"Palabra repetida: '{words[i]} {words[i + 1]}'",
                    "Error tipográfico o pegado duplicado.",
                    "Elimina la repetición.",
                    stripped,
                    section,
                    field,
                    "sentence",
                    idx,
                )
            )
            break

    for m in re.finditer(
        r"\b(los|las)\s+([a-záéíóúñ]{5,}(?:ción|sión|dad|tad|ez|eza|ismo|mento|aje)?)\b",
        stripped,
        re.I,
    ):
        noun = m.group(2)
        if not noun.endswith(("s", "es")) and noun.lower() not in {
            "python",
            "pandas",
            "numpy",
            "linux",
            "macos",
            "github",
        }:
            f.append(
                finding(
                    "low",
                    "grammar",
                    "possible_plural_det_singular_noun",
                    f"Posible desacuerdo: determinante plural + sustantivo sin -s ('{m.group(0)}')",
                    "Heurística de concordancia superficial (falsos positivos posibles en tecnicismos).",
                    "Verifica número: los/las → plural; el/la → singular.",
                    stripped,
                    section,
                    field,
                    "sentence",
                    idx,
                )
            )
            break

    # Case-sensitive for TODO/FIXME — Spanish "todo" is not a meta marker.
    if re.search(r"\b(TODO|FIXME|HACK|XXX)\b", stripped):
        f.append(
            finding(
                "high",
                "style",
                "meta_todo",
                "Marcador de desarrollo en prosa del estudiante",
                "Texto orientado a desarrollo o generación, no al aprendiz.",
                "Reescribe en voz docente limpia, sin meta-comentarios.",
                stripped,
                section,
                field,
                "sentence",
                idx,
            )
        )
    for pat, rule, msg in [
        (r"\b(as an AI|como modelo de lenguaje|como IA)\b", "ai_leak", "Fuga meta de IA"),
        (
            r"\b(lorem ipsum|to be expanded|TBD\b|WIP\b)\b",
            "placeholder",
            "Texto relleno / placeholder",
        ),
        (
            r"\b(en esta sección arreglamos|fix for section|explorer issue)\b",
            "dev_meta",
            "Meta de autoría/auditoría",
        ),
    ]:
        if re.search(pat, stripped, re.I):
            f.append(
                finding(
                    "high",
                    "style",
                    rule,
                    msg,
                    "Texto orientado a desarrollo o generación, no al aprendiz.",
                    "Reescribe en voz docente limpia, sin meta-comentarios.",
                    stripped,
                    section,
                    field,
                    "sentence",
                    idx,
                )
            )
    # English word "placeholder" only (not Spanish uses of similar words)
    if re.search(r"\bplaceholder\b", stripped, re.I) and not re.search(
        r"\b(ejemplo|plantilla|valor de ejemplo)\b", stripped, re.I
    ):
        f.append(
            finding(
                "medium",
                "style",
                "placeholder",
                "Uso de 'placeholder' en prosa del estudiante",
                "Anglicismo de relleno; a menudo confunde al aprendiz.",
                "Usa 'valor de ejemplo', 'plantilla' o un valor concreto.",
                stripped,
                section,
                field,
                "sentence",
                idx,
            )
        )

    es_hits = len(ES_MARKERS.findall(stripped))
    en_hits = len(
        re.findall(
            r"\b(the|and|with|from|this|that|you|your|for|are|is|to|of|in|on|can|will|should|must)\b",
            stripped,
            re.I,
        )
    )
    if n >= 8 and en_hits >= 4 and es_hits <= 1 and not re.search(r"`[^`]+`", stripped):
        f.append(
            finding(
                "medium",
                "style",
                "english_dominant",
                "Oración predominantemente en inglés",
                "Mezcla de idiomas o título residual en EN.",
                "Traduce al español pedagógico (PE neutro profesional) o deja solo el término técnico entre comillas/`code`.",
                stripped,
                section,
                field,
                "sentence",
                idx,
            )
        )

    if re.search(r"[.!?]\s+[a-záéíóúñü]", stripped):
        f.append(
            finding(
                "low",
                "orthography",
                "lowercase_after_period",
                "Minúscula tras fin de oración",
                "Puntuación y capitalización inconsistentes.",
                "Capitaliza la siguiente palabra (salvo casos especiales).",
                stripped,
                section,
                field,
                "sentence",
                idx,
            )
        )

    gerunds = re.findall(r"\b\w+ando\b|\b\w+endo\b|\b\w+iendo\b", stripped, re.I)
    if len(gerunds) >= 3:
        f.append(
            finding(
                "low",
                "style",
                "gerund_pileup",
                f"Acumulación de gerundios ({len(gerunds)})",
                "El gerundio en cadena debilita el estilo técnico-didáctico en español.",
                "Sustituye algunos gerundios por oraciones finitas (indicativo).",
                stripped,
                section,
                field,
                "sentence",
                idx,
            )
        )

    if n >= 20 and stripped.count(",") >= 5:
        f.append(
            finding(
                "low",
                "structure",
                "comma_density",
                "Alta densidad de comas",
                "Posible hipotaxis excesiva (subordinación).",
                "Simplifica la jerarquía o usa listas.",
                stripped,
                section,
                field,
                "sentence",
                idx,
            )
        )

    return f


def heuristic_paragraph(
    para: str, section: int, field: str, idx: int
) -> list[Finding]:
    f: list[Finding] = []
    sents = split_sentences(para)
    words = tokenize_words(para)
    if len(sents) == 1 and len(words) > 55:
        f.append(
            finding(
                "medium",
                "structure",
                "paragraph_one_long_sentence",
                "Párrafo = una sola oración muy larga",
                "Falta de segmentación pedagógica.",
                "Divide en 2–4 oraciones con un solo foco cada una.",
                para,
                section,
                field,
                "paragraph",
                idx,
            )
        )
    if len(sents) >= 6 and len(words) / max(len(sents), 1) < 8:
        f.append(
            finding(
                "low",
                "style",
                "choppy_paragraph",
                "Párrafo demasiado fragmentado",
                "Muchas oraciones telegráficas seguidas.",
                "Fusiona ideas relacionadas para mejorar el ritmo.",
                para,
                section,
                field,
                "paragraph",
                idx,
            )
        )
    starts = [tokenize_words(s)[0].lower() for s in sents if tokenize_words(s)]
    if len(starts) >= 4:
        c = Counter(starts)
        w, n = c.most_common(1)[0]
        if n >= 3 and w not in {"en", "el", "la", "si", "no", "y"}:
            f.append(
                finding(
                    "low",
                    "style",
                    "anaphora_monotony",
                    f"Varias oraciones empiezan con '{w}'",
                    "Patrón rítmico monótono (frecuente en texto generado).",
                    "Varía el arranque: circunstancial, objeto, pregunta, conector diverso.",
                    para,
                    section,
                    field,
                    "paragraph",
                    idx,
                )
            )
    return f


def lt_check_chunk(text: str, language: str = "es") -> list[dict[str, Any]]:
    if not text.strip():
        return []
    text = text[:18000]
    data = urllib.parse.urlencode(
        {"text": text, "language": language, "enabledOnly": "false"}
    ).encode()
    req = urllib.request.Request(
        "https://api.languagetool.org/v2/check",
        data=data,
        method="POST",
        headers={
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "PyArcanaSpanishQualityAudit/1.0 (curriculum research)",
            "Accept": "application/json",
        },
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        body = json.loads(resp.read().decode("utf-8"))
    return body.get("matches", [])


# Technical / brand tokens frequently flagged as Spanish misspellings
TECH_TOKEN = re.compile(
    r"^(?:"
    r"python|pandas|numpy|scipy|sklearn|pytorch|tensorflow|keras|fastapi|flask|"
    r"django|streamlit|plotly|seaborn|matplotlib|jupyter|pytest|ruff|mypy|pip|"
    r"venv|virtualenv|conda|poetry|uv|npm|node|typescript|javascript|react|"
    r"github|gitlab|docker|kubernetes|k8s|linux|macos|windows|powershell|"
    r"bash|zsh|sql|postgres|postgresql|mysql|sqlite|mongodb|redis|kafka|"
    r"spark|airflow|dbt|bigquery|aws|gcp|azure|openai|anthropic|llm|rag|"
    r"http|https|json|yaml|toml|csv|xml|html|css|api|cli|sdk|ci|cd|pr|"
    r"git|commit|branch|merge|rebase|ssh|ssl|tls|oauth|jwt|uuid|"
    r"argv|stdin|stdout|stderr|utf|ascii|regex|token|embedding|vector|"
    r"dataframe|ndarray|async|await|coroutine|thread|mutex|semaphore|"
    r"wxpython|opencv|cuda|gpu|cpu|ram|ssd|httpx|uvicorn|pydantic|"
    r"pyarcana|repl|ide|os|path|cwd|env|dotenv|readme|todo|fixme"
    r")$",
    re.I,
)


def lt_error_word(match: dict[str, Any]) -> str:
    ctx = match.get("context") or {}
    text = ctx.get("text") or ""
    offset = int(ctx.get("offset") or 0)
    length = int(ctx.get("length") or 0)
    if length > 0 and offset >= 0:
        return text[offset : offset + length]
    return ""


def should_keep_lt_match(m: dict[str, Any]) -> bool:
    """Drop noisy LT hits on English tech tokens common in this curriculum."""
    rule = m.get("rule", {}) or {}
    rule_id = (rule.get("id") or "").upper()
    word = lt_error_word(m).strip()
    word_clean = re.sub(r"^[^A-Za-z0-9_]+|[^A-Za-z0-9_]+$", "", word)

    # Spelling dictionary noise on code/tech
    if "MORFOLOGIK" in rule_id or "HUNSPELL" in rule_id or "SPELLER" in rule_id:
        if not word_clean:
            return False
        if TECH_TOKEN.match(word_clean):
            return False
        if re.search(r"[A-Z].*[A-Z]|_|/|\\|\d", word_clean):  # CamelCase, paths, versions
            return False
        if word_clean.isupper() and len(word_clean) <= 6:
            return False
        if re.fullmatch(r"[a-z]+[A-Z][A-Za-z0-9]*", word_clean):
            return False
        if re.fullmatch(r"[a-z]{1,3}\d+[a-z0-9]*", word_clean, re.I):
            return False
        # English-looking tokens without Spanish accents and with common EN endings
        if re.fullmatch(r"[A-Za-z]{4,}", word_clean) and not re.search(
            r"[áéíóúñü]", word_clean, re.I
        ):
            if re.search(
                r"(ing|tion|ness|ment|ware|file|code|data|test|type|list|dict|set)$",
                word_clean,
                re.I,
            ):
                return False
    # Voseo suggestions are regional style, not errors for PE didactic prose
    if rule_id == "VOSEO" or "VOSEO" in rule_id:
        return False
    return True


def map_lt_match(m: dict[str, Any], section: int) -> Finding | None:
    if not should_keep_lt_match(m):
        return None
    rule = m.get("rule", {}) or {}
    rule_id = rule.get("id", "LT")
    category = (rule.get("category") or {}).get("id") or rule.get("issueType") or "grammar"
    issue = (rule.get("issueType") or "misspelling").lower()
    severity = "medium"
    if issue in ("misspelling", "typographical"):
        severity = "low"
    if "AGREEMENT" in rule_id.upper():
        severity = "high"
    if issue == "style":
        severity = "low"
    # Remaining spelling after filter: low, cap impact
    if "MORFOLOGIK" in rule_id.upper():
        severity = "low"
    msg = m.get("message") or rule.get("description") or rule_id
    ctx = (m.get("context") or {}).get("text") or ""
    replacements = ", ".join(r.get("value", "") for r in (m.get("replacements") or [])[:3])
    improvement = (
        f"Sugerencia LT: {replacements}" if replacements else "Revisa según la regla de LanguageTool."
    )
    return finding(
        severity,
        f"languagetool:{category}",
        rule_id,
        msg,
        f"LanguageTool (es) detectó issueType={issue}.",
        improvement,
        ctx,
        section,
        "section_prose",
        "section",
        0,
    )


def audit_section(
    number: int,
    path: Path,
    use_lt: bool,
    lt_sleep: float,
) -> dict[str, Any]:
    source = path.read_text(encoding="utf-8")
    blocks = extract_string_literals(source)
    all_findings: list[Finding] = []
    sentence_rows: list[dict[str, Any]] = []
    paragraph_rows: list[dict[str, Any]] = []
    full_prose_parts: list[str] = []

    for field_name, text in blocks:
        full_prose_parts.append(text)
        for pi, para in enumerate(split_paragraphs(text)):
            nw, ns, syll, wps, spw, fh, sp = metrics_for_text(para)
            pf = heuristic_paragraph(para, number, field_name, pi)
            all_findings.extend(pf)
            paragraph_rows.append(
                {
                    "section": number,
                    "field": field_name,
                    "index": pi,
                    "words": nw,
                    "sentences": ns,
                    "wps": round(wps, 2),
                    "spw": round(spw, 3),
                    "fernandez_huerta": round(fh, 1) if fh is not None else None,
                    "szigriszt_pazos": round(sp, 1) if sp is not None else None,
                    "fh_label": fh_label(fh),
                    "findings": len(pf),
                    "excerpt": para[:160].replace("\n", " "),
                }
            )
            for si, sent in enumerate(split_sentences(para)):
                snw, _sns, _ssyll, swps, sspw, sfh, _ssp = metrics_for_text(sent)
                sf = heuristic_sentence(sent, number, field_name, si)
                all_findings.extend(sf)
                sentence_rows.append(
                    {
                        "section": number,
                        "field": field_name,
                        "paragraph": pi,
                        "index": si,
                        "words": snw,
                        "wps": round(swps, 2),
                        "spw": round(sspw, 3),
                        "fernandez_huerta": round(sfh, 1) if sfh is not None else None,
                        "fh_label": fh_label(sfh),
                        "findings": [asdict(x) for x in sf],
                        "finding_count": len(sf),
                        "text": sent[:300],
                    }
                )

    joined = "\n\n".join(full_prose_parts)
    tw, ts, tsy, twps, tspw, tfh, tsp = metrics_for_text(joined)

    lt_findings: list[Finding] = []
    if use_lt and joined.strip():
        chunks: list[str] = []
        buf: list[str] = []
        size = 0
        for part in full_prose_parts:
            if size + len(part) > 12000 and buf:
                chunks.append("\n\n".join(buf))
                buf, size = [part], len(part)
            else:
                buf.append(part)
                size += len(part) + 2
        if buf:
            chunks.append("\n\n".join(buf))
        for ci, chunk in enumerate(chunks):
            try:
                matches = lt_check_chunk(chunk)
                kept = 0
                morph_kept = 0
                for m in matches:
                    mapped = map_lt_match(m, number)
                    if mapped is None:
                        continue
                    # Cap residual spelling flood per section chunk
                    if "MORFOLOGIK" in mapped.rule.upper():
                        morph_kept += 1
                        if morph_kept > 15:
                            continue
                    lt_findings.append(mapped)
                    kept += 1
            except Exception as e:  # noqa: BLE001
                lt_findings.append(
                    finding(
                        "info",
                        "languagetool",
                        "api_error",
                        f"LanguageTool error chunk {ci}: {type(e).__name__}: {e}",
                        "API pública con límites de tasa/red.",
                        "Reintenta más tarde o usa --no-lt.",
                        "",
                        number,
                        "section_prose",
                        "section",
                        ci,
                    )
                )
            time.sleep(lt_sleep)

    all_findings.extend(lt_findings)
    by_sev = Counter(x.severity for x in all_findings)
    by_cat = Counter(x.category for x in all_findings)
    by_rule = Counter(x.rule for x in all_findings)

    # Density-based score (stable across long sections)
    n_sent = max(len(sentence_rows), 1)
    high = by_sev.get("high", 0)
    med = by_sev.get("medium", 0)
    low = by_sev.get("low", 0)
    # Per-100-sentences rates
    h_rate = 100.0 * high / n_sent
    m_rate = 100.0 * med / n_sent
    l_rate = 100.0 * low / n_sent
    score = 10.0
    score -= min(4.0, 0.35 * h_rate)
    score -= min(3.0, 0.12 * m_rate)
    score -= min(1.5, 0.03 * l_rate)
    if tfh is not None:
        if tfh < 40:
            score -= 0.4
        elif tfh > 95:
            score -= 0.2
    # Mild bonus for healthy technical-pedagogy band
    if tfh is not None and 55 <= tfh <= 85:
        score += 0.2
    if 14 <= twps <= 28:
        score += 0.2
    score = max(0.0, min(10.0, round(score, 2)))

    return {
        "section": number,
        "file": path.name,
        "prose_blocks": len(blocks),
        "paragraphs": len(paragraph_rows),
        "sentences": len(sentence_rows),
        "words": tw,
        "avg_words_per_sentence": round(twps, 2),
        "avg_syllables_per_word": round(tspw, 3),
        "fernandez_huerta": round(tfh, 1) if tfh is not None else None,
        "szigriszt_pazos": round(tsp, 1) if tsp is not None else None,
        "fh_label": fh_label(tfh),
        "quality_score_0_10": score,
        "findings_total": len(all_findings),
        "findings_by_severity": dict(by_sev),
        "findings_by_category": dict(by_cat),
        "top_rules": by_rule.most_common(15),
        "findings": [asdict(x) for x in all_findings],
        "paragraph_metrics": paragraph_rows,
        "sentence_sample_worst": sorted(
            sentence_rows, key=lambda r: (-r["finding_count"], -(r["words"] or 0))
        )[:25],
        "languagetool_matches": len(lt_findings),
    }


def improvement_playbook(global_rules: Counter[str]) -> list[dict[str, Any]]:
    playbook = {
        "run_on_sentence": {
            "cause": "Oraciones con demasiadas cláusulas o listas embebidas.",
            "fix": "Límite blando ~25–32 palabras en prosa didáctica; una idea principal por oración.",
        },
        "long_sentence": {
            "cause": "Explicaciones densas sin cortes.",
            "fix": "Corta en conectores causales/adversativos; mueve ejemplos a código.",
        },
        "missing_terminal_punct": {
            "cause": "Frases colgadas tras edición o plantillas.",
            "fix": "Toda oración asertiva cierra con punto.",
        },
        "missing_inverted_question": {
            "cause": "Calco del inglés o markdown incompleto.",
            "fix": "Usa ¿…? en todas las preguntas en español.",
        },
        "unbalanced_delimiters": {
            "cause": "Paréntesis/comillas abiertos en cortes de párrafo.",
            "fix": "Validar emparejamiento en revisión.",
        },
        "repeated_word": {
            "cause": "Typo o pegado doble.",
            "fix": "Eliminar duplicado.",
        },
        "english_dominant": {
            "cause": "Residuos EN o títulos no traducidos.",
            "fix": "Español pedagógico; términos EN solo como `code` o comillas.",
        },
        "ai_leak": {
            "cause": "Meta-texto de modelo/auditor.",
            "fix": "Voz docente sin referencias al proceso de generación.",
        },
        "meta_todo": {
            "cause": "Marcadores de ingeniería en contenido del curso.",
            "fix": "Sacar de la prosa del estudiante.",
        },
        "paragraph_one_long_sentence": {
            "cause": "Párrafo monobloque.",
            "fix": "2–4 oraciones con progresión I Do/We Do.",
        },
        "gerund_pileup": {
            "cause": "Estilo gerundial en cadena.",
            "fix": "Preferir indicativo y oraciones finitas.",
        },
        "space_before_punct": {
            "cause": "Artefacto de formato.",
            "fix": "Normalizar tipografía española (sin espacio antes de ,.).",
        },
        "comma_density": {
            "cause": "Subordinación excesiva.",
            "fix": "Listas o frases independientes.",
        },
        "possible_plural_det_singular_noun": {
            "cause": "Posible desacuerdo de número (heurística).",
            "fix": "Verificar concordancia determinante–sustantivo.",
        },
    }
    rows = []
    for rule, n in global_rules.most_common(25):
        base = playbook.get(
            rule,
            {
                "cause": "Ver categoría de la regla (heurística o LanguageTool).",
                "fix": "Revisar extractos en el informe por sección.",
            },
        )
        rows.append({"rule": rule, "count": n, **base})
    return rows


def write_markdown_summary(summary: dict[str, Any], path: Path) -> None:
    lines = [
        "# Spanish Grammar, Style & Structure Audit",
        "",
        "Research-backed audit of learner-facing Spanish prose across active course sections.",
        "",
        "## Methods",
        "",
        "### Readability (Spanish-specific)",
        "- **Fernández-Huerta (1959)**: `206.84 − 60·(syll/word) − 1.02·(words/sentence)` — Spanish Flesch adaptation.",
        "- **Szigriszt-Pazos / INFLESZ**: `206.835 − 62.3·(syll/word) − (words/sentence)` — perspicuity scale used in Spanish education/health readability work.",
        "- Bands (FH): muy fácil ≥90 … muy difícil <30.",
        "",
        "### Structure & style heuristics",
        "- Sentence length (run-on / long / fragment), terminal punctuation, ¿¡ pairing,",
        "  delimiter balance, repeated words, rough DET–NOUN number cues, gerund pile-up,",
        "  comma density, paragraph monotony, English-dominant lines, meta/AI leaks.",
        "",
        "### Grammar engine",
        "- **LanguageTool** public API (`language=es`) for agreement, spelling, style rules when enabled.",
        "",
        f"- Sections audited: **{summary['sections_audited']}**",
        f"- Sentences: **{summary['total_sentences']}** | Paragraphs: **{summary['total_paragraphs']}**",
        f"- Findings: **{summary['total_findings']}** "
        f"(high={summary['severity'].get('high', 0)}, "
        f"medium={summary['severity'].get('medium', 0)}, "
        f"low={summary['severity'].get('low', 0)})",
        f"- Mean quality score (0–10): **{summary['mean_quality_score']}**",
        f"- Mean Fernández-Huerta: **{summary['mean_fernandez_huerta']}** ({summary['mean_fh_label']})",
        f"- Mean words/sentence: **{summary['mean_wps']}**",
        f"- LanguageTool enabled: **{summary['languagetool']}**",
        "",
        "## Section ranking (lowest quality first)",
        "",
        "| Sec | Score | FH | WPS | Findings (H/M/L) | File |",
        "|-----|------:|---:|----:|-----------------|------|",
    ]
    for row in summary["sections_ranked"]:
        sev = row["findings_by_severity"]
        lines.append(
            f"| S{row['section']:02d} | {row['quality_score_0_10']} | "
            f"{row.get('fernandez_huerta')} | {row.get('avg_words_per_sentence')} | "
            f"{sev.get('high', 0)}/{sev.get('medium', 0)}/{sev.get('low', 0)} | `{row['file']}` |"
        )

    lines += ["", "## Top failure rules (causes & improvements)", ""]
    for item in summary["improvement_playbook"]:
        lines += [
            f"### `{item['rule']}` (n={item['count']})",
            f"- **Cause:** {item['cause']}",
            f"- **Improvement:** {item['fix']}",
            "",
        ]

    lines += [
        "## How to use",
        "",
        "- Per-section JSON: `course-state/curriculum_hardening/audits/spanish_quality/SXX_SPANISH_QUALITY.json`",
        "- Full findings embedded per section; worst sentences in `sentence_sample_worst`.",
        "- Re-run: `python3 scripts/spanish_quality_audit.py` (add `--no-lt` offline).",
        "",
    ]
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--from", dest="from_s", type=int, default=1)
    ap.add_argument("--to", dest="to_s", type=int, default=52)
    ap.add_argument("--no-lt", action="store_true", help="Skip LanguageTool API")
    ap.add_argument("--lt-sleep", type=float, default=3.5, help="Seconds between LT requests")
    args = ap.parse_args()

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    files = [(n, p) for n, p in active_section_files() if args.from_s <= n <= args.to_s]
    use_lt = not args.no_lt

    section_reports: list[dict[str, Any]] = []
    global_rules: Counter[str] = Counter()
    global_sev: Counter[str] = Counter()
    total_sents = total_paras = 0

    print(f"Auditing {len(files)} sections (LanguageTool={'on' if use_lt else 'off'})…")
    for number, path in files:
        print(f"  S{number:02d} {path.name}…", flush=True)
        rep = audit_section(number, path, use_lt=use_lt, lt_sleep=args.lt_sleep)
        section_reports.append(rep)
        total_sents += rep["sentences"]
        total_paras += rep["paragraphs"]
        for rule, n in rep["top_rules"]:
            global_rules[rule] += n
        for sev, n in rep["findings_by_severity"].items():
            global_sev[sev] += n
        out = OUT_DIR / f"S{number:02d}_SPANISH_QUALITY.json"
        out.write_text(json.dumps(rep, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    fh_vals = [r["fernandez_huerta"] for r in section_reports if r["fernandez_huerta"] is not None]
    scores = [r["quality_score_0_10"] for r in section_reports]
    wps_vals = [r["avg_words_per_sentence"] for r in section_reports]
    ranked = sorted(
        section_reports, key=lambda r: (r["quality_score_0_10"], -r["findings_total"])
    )

    summary = {
        "research_notes": {
            "fernandez_huerta": "Spanish Flesch adaptation (1959); uses syllables/word and words/sentence.",
            "szigriszt_pazos_inflesz": "Spanish perspicuity; related INFLESZ scale (Barrio-Cantalejo et al.).",
            "structure_heuristics": "Length, punctuation pairing, delimiters, monotony, meta-leaks.",
            "languagetool": "Open-source multilingual grammar/style checker; Spanish rules via public API.",
            "sources": [
                "https://readabilityformulas.com/readability-formulas-to-score-spanish-texts/",
                "https://languagetool.org/spellchecking-spanish",
                "https://github.com/languagetool-org/languagetool",
                "INFLESZ validation literature (Spanish medical/education readability)",
            ],
        },
        "sections_audited": len(section_reports),
        "total_sentences": total_sents,
        "total_paragraphs": total_paras,
        "total_findings": sum(r["findings_total"] for r in section_reports),
        "severity": dict(global_sev),
        "mean_quality_score": round(sum(scores) / len(scores), 2) if scores else None,
        "min_quality_score": min(scores) if scores else None,
        "mean_fernandez_huerta": round(sum(fh_vals) / len(fh_vals), 1) if fh_vals else None,
        "mean_fh_label": fh_label(sum(fh_vals) / len(fh_vals)) if fh_vals else None,
        "mean_wps": round(sum(wps_vals) / len(wps_vals), 2) if wps_vals else None,
        "languagetool": use_lt,
        "top_rules": global_rules.most_common(30),
        "improvement_playbook": improvement_playbook(global_rules),
        "sections_ranked": [
            {
                "section": r["section"],
                "file": r["file"],
                "quality_score_0_10": r["quality_score_0_10"],
                "fernandez_huerta": r["fernandez_huerta"],
                "avg_words_per_sentence": r["avg_words_per_sentence"],
                "findings_by_severity": r["findings_by_severity"],
                "findings_total": r["findings_total"],
            }
            for r in ranked
        ],
    }

    (OUT_DIR / "SPANISH_QUALITY_SUMMARY.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    write_markdown_summary(summary, OUT_DIR / "SPANISH_QUALITY_SUMMARY.md")
    print(
        f"Done. findings={summary['total_findings']} "
        f"mean_score={summary['mean_quality_score']} "
        f"mean_FH={summary['mean_fernandez_huerta']} "
        f"→ {OUT_DIR}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
