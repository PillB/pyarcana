#!/usr/bin/env python3
"""S14 grammar audit: Fernández-Huerta + INFLESZ + WPS/SPW + Spanish pedagogical heuristics."""
import re
import sys
import json

# --- Spanish syllable counter (heuristic, same as S13) ---
VOWELS = set("aeiouáéíóúüy")
STRONG = set("aeoáéíóú")
WEAK = set("iuü")
ACCENTED = set("áéíóú")

def simple_syl(word):
    w = word.lower().strip()
    if not w:
        return 0
    w = re.sub(r"^h", "", w)
    w = re.sub(r"qu(?=[eéií])", "Q", w)
    w = re.sub(r"gu(?=[eéií])", "G", w)
    w = re.sub(r"gü(?=[eéií])", "G", w)
    syl = 0
    i = 0
    n = len(w)
    strong_v = set("aeoáéó")
    weak_v = set("iuü")
    accented_weak = set("íú")
    while i < n:
        c = w[i]
        if c in strong_v or c in weak_v:
            cluster = [c]
            j = i + 1
            while j < n and w[j] in (strong_v | weak_v):
                cluster.append(w[j])
                j += 1
            cluster_syl = 1
            for k in range(1, len(cluster)):
                a, b = cluster[k-1], cluster[k]
                if a in strong_v and b in strong_v:
                    cluster_syl += 1
                elif a in weak_v and b in accented_weak:
                    cluster_syl += 1
                elif a in accented_weak and b in strong_v:
                    cluster_syl += 1
                elif a in accented_weak and b in weak_v:
                    cluster_syl += 1
            syl += cluster_syl
            i = j
        else:
            i += 1
    if syl == 0:
        syl = 1
    return syl

def split_sentences(text):
    text = text.strip()
    if not text:
        return []
    text2 = re.sub(r"\b(p\.ej|etc|vs|ej)\.", r"\1<DOT>", text)
    parts = re.split(r'(?<=[.!?…])\s+', text2)
    parts = [p.replace("<DOT>", ".").strip() for p in parts if p.strip()]
    return parts

# --- Spanish signal filter ---
SPANISH_MARKERS = re.compile(r"\b(de|que|en|y|el|la|los|las|un|una|con|por|para|es|son|se|del|al|lo|le|les|su|sus|como|más|pero|cuando|donde|cómo|qué|cuál|porque|entonces|también|así|ya|o|u|ni|si|sí|no|esto|eso|aquello|aquí|hoy|ahora|después|antes|todo|nada|algo|cada|otro|mucho|poco|buen|gran|mejor|peor|primer|último)\b", re.I)
ACCENTS = re.compile(r"[áéíóúÁÉÍÓÚñÑüÜ¿¡]")

def is_spanish(s):
    return bool(ACCENTS.search(s)) or bool(SPANISH_MARKERS.search(s))

# Strip markdown formatting for cleaner word/syllable counts
def strip_md(s):
    # Remove inline code (backticks)
    s = re.sub(r"`[^`]+`", "code", s)
    # Remove bold/italic markers
    s = re.sub(r"\*\*([^*]+)\*\*", r"\1", s)
    s = re.sub(r"\*([^*]+)\*", r"\1", s)
    s = re.sub(r"__([^_]+)__", r"\1", s)
    # Remove markdown links [text](url) → text
    s = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", s)
    return s

def find_issues(sentence):
    issues = []
    raw_wc = len(sentence.split())
    if raw_wc > 45:
        issues.append(("H", "run-on >45w", f"{raw_wc} words"))
    elif raw_wc > 32:
        issues.append(("M", "long >32w", f"{raw_wc} words"))
    if sentence and sentence[-1] not in ".!?…":
        issues.append(("M", "missing terminal punctuation", ""))
    # ¿/¿ pairing — only when sentence contains a question
    if "¿" in sentence and "?" not in sentence:
        issues.append(("M", "¿ without ?", ""))
    if "?" in sentence and "¿" not in sentence:
        issues.append(("L", "? without ¿", ""))
    if "¡" in sentence and "!" not in sentence:
        issues.append(("M", "¡ without !", ""))
    if "!" in sentence and "¡" not in sentence:
        issues.append(("L", "! without ¡", ""))
    # Repeated word
    m = re.search(r"\b(\w+)\s+\1\b", sentence, re.I)
    if m:
        issues.append(("M", "repeated word", m.group(0)))
    if "  " in sentence:
        issues.append(("L", "double space", ""))
    if re.search(r"\s+[.,;:!?]", sentence):
        issues.append(("L", "space before punct", ""))
    # Unbalanced delimiters (ignore quotes since they may be unmatched legitimately)
    for op, cl in [("(", ")"), ("[", "]"), ("«", "»")]:
        if sentence.count(op) != sentence.count(cl):
            issues.append(("M", f"unbalanced {op}{cl}", f"{sentence.count(op)} vs {sentence.count(cl)}"))
    if not is_spanish(sentence):
        issues.append(("M", "english_dominant", ""))
    gerunds = re.findall(r"\b\w+ando\b|\b\w+iendo\b|\b\w+yendo\b", sentence, re.I)
    if len(gerunds) >= 3:
        issues.append(("L", f"gerund pile-up ({len(gerunds)})", ", ".join(gerunds[:4])))
    n_commas = sentence.count(",")
    if raw_wc > 0 and n_commas / max(raw_wc,1) > 0.15 and n_commas >= 4:
        issues.append(("L", "high comma density", f"{n_commas} commas / {raw_wc}w"))
    return issues, raw_wc

def analyze(path):
    with open(path, encoding="utf-8") as f:
        text = f.read()
    # Each prose block is a line; blank line separates. Strip the [key] prefix.
    blocks = []
    for line in text.split("\n"):
        line = line.rstrip()
        if not line.strip():
            continue
        m = re.match(r"^\[([^\]]+)\]\s*(.*)$", line)
        if m:
            key = m.group(1)
            val = m.group(2)
            if val.strip():
                blocks.append((key, val))
    all_metrics = []
    total_words = 0
    total_syllables = 0
    total_sentences = 0
    worst = []
    issue_count = {"H": 0, "M": 0, "L": 0}
    for bi, (key, raw_p) in enumerate(blocks, 1):
        # Strip markdown for counting but keep raw for evidence
        p = strip_md(raw_p)
        # Also strip leading **foo:** labels for sentence-splitting sanity
        sentences = split_sentences(p)
        if not sentences:
            continue
        p_words = 0
        p_syls = 0
        p_sents = 0
        p_issues = []
        for s in sentences:
            if not is_spanish(s):
                continue
            issues, wc = find_issues(s)
            words = s.split()
            wc = len(words)
            syls = sum(simple_syl(w) for w in words)
            p_words += wc
            p_syls += syls
            p_sents += 1
            for sev, kind, ev in issues:
                p_issues.append({"sev": sev, "kind": kind, "ev": ev, "sent": s[:120]})
                issue_count[sev] = issue_count.get(sev, 0) + 1
            if wc > 32 or any(i[0] == "H" for i in issues):
                worst.append({"bi": bi, "key": key, "wc": wc, "issues": [(i[0], i[1]) for i in issues], "sent": s[:300]})
        total_words += p_words
        total_syllables += p_syls
        total_sentences += p_sents
        if p_sents > 0:
            spw = p_syls / p_words if p_words else 0
            wps = p_words / p_sents
            fh = 206.84 - 60 * spw - 1.02 * wps
            inflesz = 206.835 - 62.3 * spw - wps
            all_metrics.append({
                "bi": bi,
                "key": key,
                "n_sent": p_sents,
                "wps": round(wps, 2),
                "spw": round(spw, 2),
                "FH": round(fh, 1),
                "INFLESZ": round(inflesz, 1),
                "issues": p_issues,
                "preview": raw_p[:120],
            })
    g_spw = total_syllables / total_words if total_words else 0
    g_wps = total_words / total_sentences if total_sentences else 0
    g_fh = 206.84 - 60 * g_spw - 1.02 * g_wps
    g_inf = 206.835 - 62.3 * g_spw - g_wps
    return {
        "global": {
            "n_blocks": len(blocks),
            "n_sentences": total_sentences,
            "n_words": total_words,
            "WPS": round(g_wps, 2),
            "SPW": round(g_spw, 2),
            "FH": round(g_fh, 1),
            "INFLESZ": round(g_inf, 1),
            "issue_count": issue_count,
        },
        "blocks": all_metrics,
        "worst": worst,
    }

if __name__ == "__main__":
    path = sys.argv[1]
    result = analyze(path)
    print(json.dumps(result, ensure_ascii=False, indent=2))
