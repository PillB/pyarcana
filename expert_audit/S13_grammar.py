#!/usr/bin/env python3
"""
S13 grammar audit: Fernández-Huerta + INFLESZ + WPS/SPW + Spanish pedagogical heuristics.
"""
import re
import sys
import json
import unicodedata

# --- Spanish syllable counter (heuristic) ---
VOWELS = set("aeiouáéíóúüy")
STRONG = set("aeoáéíóú")
WEAK = set("iuü")
ACCENTED = set("áéíóú")

def count_syllables_word(word):
    word = word.lower().strip()
    if not word:
        return 0
    # strip leading/trailing consonants (silent h after vowel handled separately)
    # remove silent h at start
    if word.startswith("h"):
        word = word[1:]
    # count vowel groups
    syllables = 0
    prev = None  # None, 'strong', 'weak', 'weak_accented', 'cons'
    i = 0
    n = len(word)
    while i < n:
        c = word[i]
        if c in VOWELS:
            # Determine vowel class
            if c in ACCENTED and c in WEAK:
                cls = 'weak_accented'
            elif c in STRONG:
                cls = 'strong'
            else:
                cls = 'weak'
            if prev in ('strong',) and cls in ('weak', 'weak_accented'):
                # diphthong: combine
                prev = 'weak'  # treat as weak cluster
            elif prev == 'strong' and cls == 'strong':
                # hiatus: two strong vowels = two syllables; the new one starts a new syllable
                syllables += 1
                prev = cls
            elif prev == 'weak_accented' and cls in ('strong', 'weak', 'weak_accented'):
                syllables += 1
                prev = cls
            elif prev == 'weak' and cls == 'weak_accented':
                syllables += 1
                prev = cls
            else:
                prev = cls
        else:
            if prev in ('strong', 'weak', 'weak_accented'):
                syllables += 1
            prev = 'cons'
        i += 1
    if prev in ('strong', 'weak', 'weak_accented'):
        syllables += 1
    if syllables == 0:
        syllables = 1
    return syllables

# Simpler, more reliable Spanish syllable counter
def simple_syl(word):
    w = word.lower().strip()
    if not w:
        return 0
    # remove silent h (only at start matters, but for syl-count treat as nothing)
    w = re.sub(r"^h", "", w)
    # Treat 'qu','gu' before e/i as single consonant cluster (no extra syllable)
    w = re.sub(r"qu(?=[eéií])", "Q", w)
    w = re.sub(r"gu(?=[eéií])", "G", w)
    w = re.sub(r"gü(?=[eéií])", "G", w)
    # Count vowel groups (groups of consecutive vowels = 1 syllable nucleus, unless two strong vowels)
    # We'll approximate: each cluster of vowels = 1 syl; but if two strong vowels (a,e,o,á,é,ó) are adjacent → 2 syl
    syl = 0
    i = 0
    n = len(w)
    strong_v = set("aeoáéó")
    weak_v = set("iuü")
    accented_weak = set("íú")
    while i < n:
        c = w[i]
        if c in strong_v or c in weak_v:
            # Start of vowel cluster
            cluster = [c]
            j = i + 1
            while j < n and w[j] in (strong_v | weak_v):
                cluster.append(w[j])
                j += 1
            # Now count syllables inside the cluster
            # Rule: two adjacent strong vowels = 2 syllables (hiato)
            # strong+weak or weak+strong = 1 (diptongo) unless the weak is accented → 2
            # weak+weak = 1
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

# --- Sentence & paragraph splitting ---
ABBR = re.compile(r"\b(Dr|Dra|Sr|Sra|Lic|p\.ej|etc|Sr\.|Sra\.|Ud|Uds|vs|ej)\.?\s*$", re.I)

def split_sentences(text):
    # Spanish-aware sentence split on ., !, ? (including inverted opening marks)
    text = text.strip()
    if not text:
        return []
    # Protect common abbreviations
    text2 = re.sub(r"\b(p\.ej|etc|vs|ej)\.", r"\1<DOT>", text)
    parts = re.split(r'(?<=[.!?…])\s+', text2)
    parts = [p.replace("<DOT>", ".").strip() for p in parts if p.strip()]
    return parts

def split_paragraphs(text):
    return [p.strip() for p in re.split(r"\n\s*\n", text) if p.strip()]

# --- Spanish signal filter ---
SPANISH_MARKERS = re.compile(r"\b(de|que|en|y|el|la|los|las|un|una|con|por|para|es|son|se|del|al|lo|le|les|su|sus|como|más|pero|cuando|donde|cómo|qué|cuál|porque|entonces|también|así|ya|o|u|ni|si|sí|no|ya|esto|eso|aquello|esto|aquí|allí|hoy|ahora|después|antes|siempre|nunca|todo|nada|algo|alguien|nadie|cada|otro|otros|otra|otras|mucho|mucha|muchos|muchas|poco|poca|pocos|pocas|buen|buena|buenos|buenas|gran|grandes|mejor|peor|primer|primera|último|última|mío|tuyo|suyo|nuestro|vuestro)\b", re.I)
ACCENTS = re.compile(r"[áéíóúÁÉÍÓÚñÑüÜ¿¡]")

def is_spanish(s):
    return bool(ACCENTS.search(s)) or bool(SPANISH_MARKERS.search(s))

# --- Heuristics ---
def find_issues(sentence):
    issues = []
    # Long sentence
    wc = len(sentence.split())
    if wc > 45:
        issues.append(("H", "run-on >45w", f"{wc} words"))
    elif wc > 32:
        issues.append(("M", "long >32w", f"{wc} words"))
    # Missing terminal punctuation
    if sentence and sentence[-1] not in ".!?…":
        issues.append(("M", "missing terminal punctuation", ""))
    # Missing ¿ / ¡ pair
    if "¿" in sentence and "?" not in sentence:
        issues.append(("M", "¿ without ?", ""))
    if "?" in sentence and "¿" not in sentence:
        issues.append(("L", "? without ¿ (English calque)", ""))
    if "¡" in sentence and "!" not in sentence:
        issues.append(("M", "¡ without !", ""))
    if "!" in sentence and "¡" not in sentence:
        issues.append(("L", "! without ¡", ""))
    # Repeated word
    m = re.search(r"\b(\w+)\s+\1\b", sentence, re.I)
    if m:
        issues.append(("M", "repeated word", m.group(0)))
    # Double space
    if "  " in sentence:
        issues.append(("L", "double space", ""))
    # Space before punct
    if re.search(r"\s+[.,;:!?]", sentence):
        issues.append(("L", "space before punct", ""))
    # Unbalanced delimiters
    for op, cl in [("(" ,")"), ("[", "]"), ("«", "»"), ('"', '"'), ("'", "'")]:
        if sentence.count(op) != sentence.count(cl):
            issues.append(("M", f"unbalanced {op}{cl}", f"{sentence.count(op)} vs {sentence.count(cl)}"))
    # English-dominant: if no Spanish markers and no accents
    if not is_spanish(sentence):
        issues.append(("M", "english_dominant", ""))
    # Gerund pile-up
    gerunds = re.findall(r"\b\w+ando\b|\b\w+iendo\b|\b\w+yendo\b", sentence, re.I)
    if len(gerunds) >= 3:
        issues.append(("L", f"gerund pile-up ({len(gerunds)})", ", ".join(gerunds[:4])))
    # High comma density
    n_commas = sentence.count(",")
    if wc > 0 and n_commas / max(wc,1) > 0.15 and n_commas >= 4:
        issues.append(("L", "high comma density", f"{n_commas} commas / {wc}w"))
    return issues, wc

# --- Main ---
def analyze(path):
    with open(path, encoding="utf-8") as f:
        text = f.read()
    paragraphs = split_paragraphs(text)
    all_metrics = []
    total_words = 0
    total_syllables = 0
    total_sentences = 0
    worst = []
    for pi, p in enumerate(paragraphs, 1):
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
            if wc > 32 or any(i[0] == "H" for i in issues):
                worst.append({"pi": pi, "wc": wc, "issues": [(i[0], i[1]) for i in issues], "sent": s[:200]})
        total_words += p_words
        total_syllables += p_syls
        total_sentences += p_sents
        if p_sents > 0:
            spw = p_syls / p_words if p_words else 0
            wps = p_words / p_sents
            fh = 206.84 - 60 * spw - 1.02 * wps
            inflesz = 206.835 - 62.3 * spw - wps
            all_metrics.append({
                "pi": pi,
                "n_sent": p_sents,
                "wps": round(wps, 2),
                "spw": round(spw, 2),
                "FH": round(fh, 1),
                "INFLESZ": round(inflesz, 1),
                "issues": p_issues,
                "preview": p[:100],
            })
    # Global
    g_spw = total_syllables / total_words if total_words else 0
    g_wps = total_words / total_sentences if total_sentences else 0
    g_fh = 206.84 - 60 * g_spw - 1.02 * g_wps
    g_inf = 206.835 - 62.3 * g_spw - g_wps
    return {
        "global": {
            "n_paragraphs": len(paragraphs),
            "n_sentences": total_sentences,
            "n_words": total_words,
            "WPS": round(g_wps, 2),
            "SPW": round(g_spw, 2),
            "FH": round(g_fh, 1),
            "INFLESZ": round(g_inf, 1),
        },
        "paragraphs": all_metrics,
        "worst": worst,
    }

if __name__ == "__main__":
    path = sys.argv[1]
    result = analyze(path)
    print(json.dumps(result, ensure_ascii=False, indent=2))
