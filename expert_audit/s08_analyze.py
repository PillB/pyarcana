#!/usr/bin/env python3
"""Extract learner-facing Spanish prose from s08-pandas.ts and apply grammar heuristics."""
import re, json, statistics, sys

SRC = "/home/z/my-project/audits/s08_src.ts"

with open(SRC, "r", encoding="utf-8") as f:
    raw = f.read()

# Strip code blocks (template literals inside `code:` ... `)`).
# Strategy: walk the file line-by-line, and when we are inside a `code:` block, skip until closing backtick+comma.
lines = raw.split("\n")

# We will extract specific known prose-bearing keys: jobRelevance, learningOutcomes[].text,
# theory[].heading, theory[].paragraphs[], theory[].callout.{title,content},
# iDo.intro, iDo.steps[].description, iDo.steps[].why,
# weDo.intro, weDo.steps[].instruction, hint, hints[], edgeCases[], tests, feedback,
# youDo.{title,context,objectives[],requirements[],portfolioNote,rubric[].criterion},
# selfCheck.questions[].{question,options[],explanation}
# resources fields are URL/labels, skip.
# starterCode/solutionCode are code blocks, skip.

# Easier: pull all string values that are NOT inside `code:` ... `,` blocks, and that contain Spanish signal.
# But to be precise, let's parse with a state machine.

PROSE_KEYS = {
    "jobRelevance", "intro", "description", "instruction", "hint", "feedback",
    "why", "heading", "title", "content", "context", "portfolioNote", "question",
    "explanation", "criterion", "text", "tagline", "tests", "shortTitle",
}

# State: are we inside a code block (template literal after `code: \``)
def extract_prose_chunks(text):
    """Return list of (kind, key_hint, value_str) for Spanish prose."""
    chunks = []
    i = 0
    n = len(text)
    # Tokenize minimally: find `key:` followed by either a string literal or backtick literal
    # We'll use regex to find: identifier\s*:\s*("([^"\\]|\\.)*"|`([^`\\]|\\.)*`)
    # but we need to skip code: backtick blocks entirely.
    # Strategy: mask out code blocks first.
    masked = text
    # Replace `code: \`` ... `\`,` occurrences with empty
    # Find each occurrence of `code: \`` and the next `\`,` (closing backtick + optional whitespace + comma) and mask.
    out = []
    pos = 0
    pattern_open = re.compile(r"code:\s*`")
    # We'll iterate.
    while pos < len(text):
        m = pattern_open.search(text, pos)
        if not m:
            out.append(text[pos:])
            break
        out.append(text[pos:m.start()])
        # Find closing: backtick followed by optional whitespace and comma (and possibly newline)
        start = m.end()
        # search for the next "`" that is followed by optional ws + "," (or end of object)
        # We need to handle escaped backticks inside template literals — but in this file code blocks don't have escaped backticks.
        close_re = re.compile(r"`\s*,?\s*\n")
        cm = close_re.search(text, start)
        if not cm:
            # take rest
            out.append(text[start:])
            break
        # skip the code block content (replace with a marker so positions stay correct)
        out.append(" " * (cm.end() - start))  # preserve length with spaces
        pos = cm.end()
    masked = "".join(out)

    # Now also mask starterCode / solutionCode / `code` blocks at top-level of code objects (we did `code:` already, but starterCode/solutionCode may use backticks too)
    for key in ("starterCode", "solutionCode"):
        # match key: `...`,
        pat = re.compile(key + r":\s*`")
        pos = 0
        new_masked = []
        last = 0
        while pos < len(masked):
            m = pat.search(masked, pos)
            if not m:
                new_masked.append(masked[last:])
                break
            new_masked.append(masked[last:m.start()])
            start = m.end()
            cm = re.compile(r"`\s*,?\s*\n").search(masked, start)
            if not cm:
                new_masked.append(masked[start:])
                break
            new_masked.append(" " * (cm.end() - start))
            last = cm.end()
            pos = cm.end()
        masked = "".join(new_masked)

    # Now find all key: string-literal pairs
    # Match either "..." or `...`
    pat = re.compile(r'([A-Za-z_][A-Za-z0-9_]*)\s*:\s*("(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)', re.DOTALL)
    for m in pat.finditer(masked):
        key = m.group(1)
        val_raw = m.group(2)
        if key not in PROSE_KEYS:
            continue
        if val_raw.startswith('"'):
            # unescape
            try:
                val = json.loads(val_raw)
            except Exception:
                val = val_raw[1:-1]
        else:
            # backtick template literal
            inner = val_raw[1:-1]
            # strip ${...} interpolations
            inner = re.sub(r"\$\{[^}]*\}", "", inner)
            val = inner
        chunks.append((key, val))
    return chunks

chunks = extract_prose_chunks(raw)

# Also extract array-of-string elements: paragraphs: ["...", "..."], options: [...], objectives: [...], requirements: [...],
# hints: [...], edgeCases: [...], rubric: [{criterion}], learningOutcomes: [{text}], ...
# We use a context-aware parse: find each `key: [` block and extract string literals inside it
# until the matching `]`.

ARRAY_STRING_KEYS = {"paragraphs", "options", "objectives", "requirements", "hints", "edgeCases", "takeaways", "tips"}

def mask_code_blocks(text):
    """Replace `code:` ... `,` and `starterCode:`/`solutionCode:` ... `,` blocks with spaces (preserve length)."""
    def mask_one(text, key):
        pat = re.compile(key + r":\s*`")
        out = []
        pos = 0
        while pos < len(text):
            m = pat.search(text, pos)
            if not m:
                out.append(text[pos:])
                break
            out.append(text[pos:m.start()])
            start = m.end()
            cm = re.compile(r"`\s*,?\s*\n").search(text, start)
            if not cm:
                out.append(text[start:])
                break
            out.append(" " * (cm.end() - start))
            pos = cm.end()
        return "".join(out)
    for key in ("code", "starterCode", "solutionCode"):
        text = mask_one(text, key)
    return text

masked = mask_code_blocks(raw)

def extract_array_strings(text):
    """Find ALL occurrences of `key: [` (for keys in ARRAY_STRING_KEYS) regardless of nesting,
    and extract double-quoted string literals from each matching array body."""
    results = []
    for key in ARRAY_STRING_KEYS:
        for m in re.finditer(rf'\b{key}\s*:\s*\[', text):
            start = m.end()
            depth = 1
            i = start
            while i < len(text) and depth > 0:
                c = text[i]
                if c == '[':
                    depth += 1
                elif c == ']':
                    depth -= 1
                i += 1
            if depth != 0:
                continue
            body = text[start:i-1]
            for sm in re.finditer(r'"((?:[^"\\]|\\.)*)"', body):
                try:
                    s = json.loads('"' + sm.group(1) + '"')
                except Exception:
                    s = sm.group(1)
                results.append((key, s))
    return results

array_chunks = extract_array_strings(masked)
print(f"Extracted {len(array_chunks)} array-string chunks", file=sys.stderr)
chunks.extend(array_chunks)
# Deduplicate (some keys appear in multiple places; we keep all)
print(f"Extracted {len(chunks)} prose chunks", file=sys.stderr)

# Spanish signal check
SPANISH_RE = re.compile(r"\b(de|que|en|y|el|la|los|las|un|una|con|por|para|como|pero|o|a|del|al|lo|le|se|su|sus|es|son|fue|fuera|cuando|donde|qué|cómo|por qué|tildes|archivo|filas|columna|cuarentena|contrato|reconcili|ingesta|salida|entrada|español|peruano|Latam|PE\b|PEN|S0[0-9]|S1[0-9])\b", re.IGNORECASE)
def looks_spanish(s):
    return bool(SPANISH_RE.search(s))

# Markdown bold stripper for sentence-splitting (we keep originals for evidence but strip for measurement)
def strip_md(s):
    s = re.sub(r"\*\*([^*]+)\*\*", r"\1", s)
    s = re.sub(r"\*([^*]+)\*", r"\1", s)
    s = re.sub(r"`([^`]+)`", r"\1", s)
    s = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", s)
    return s

# Sentence split — protect common abbreviations
ABBR = re.compile(r"\b(v\.g|e\.g|i\.e|etc|p\.ej|p\.ej\.|Ud|Uds|Sr|Sra|Dr|Dra|Lic|Ing|No\.)\.", re.IGNORECASE)
def split_sentences(text):
    t = ABBR.sub(lambda m: m.group(0).replace(".", "<DOT>"), text)
    # Split on ., !, ? followed by space or end, also ¿...? and ¡...!
    parts = re.split(r"(?<=[.!?])\s+", t)
    return [p.replace("<DOT>", ".").strip() for p in parts if p.strip()]

# Spanish syllable counter (rough — vowel group heuristic)
VOWELS = "aeiouáéíóúüy"
DIPHTHONGS = ["ai","au","ei","eu","ia","ie","io","iu","oi","ou","ua","ue","ui","uo","ay","ey","oy","uy"]
def count_syllables_word(w):
    w = w.lower()
    # strip leading/trailing non-alpha
    w = re.sub(r"[^a-záéíóúüñ]", "", w)
    if not w: return 0
    # Split into vowel groups
    groups = re.findall(r"[aeiouáéíóúü]+", w)
    n = len(groups)
    # If word ends in vowel (or s/n after vowel), subtract 1 (unstressed final)
    if n >= 1:
        if re.search(r"[aeiouáéíóúü](s|n)?$", w):
            n = max(1, n)  # keep as is for FH approximation
    return max(1, n)

def text_metrics(text):
    plain = strip_md(text)
    # Word split
    words = re.findall(r"\b[\wáéíóúüñÁÉÍÓÚÜÑ]+\b", plain)
    if not words:
        return None
    n_w = len(words)
    sentences = split_sentences(plain)
    n_s = max(1, len(sentences))
    n_syl = sum(count_syllables_word(w) for w in words)
    wps = n_w / n_s
    spw = n_syl / n_w
    fh = 206.84 - 60.0 * spw - 1.02 * wps
    inflesz = 206.835 - 62.3 * spw - wps
    return {
        "n_words": n_w, "n_sentences": n_s, "n_syllables": n_syl,
        "wps": round(wps,2), "spw": round(spw,2),
        "fh": round(fh,1), "inflesz": round(inflesz,1),
        "max_sentence_words": max((len(re.findall(r"\b[\wáéíóúüñ]+\w*", s)) for s in sentences), default=0),
        "min_sentence_words": min((len(re.findall(r"\b[\wáéíóúüñ]+\w*", s)) for s in sentences), default=0) if sentences else 0,
    }

# Heuristic findings per chunk
def find_heuristics(key, text):
    plain = strip_md(text)
    findings = []
    # 1. Long sentence > 32 words
    sentences = split_sentences(plain)
    for s in sentences:
        wc = len(re.findall(r"\b[\wáéíóúüñÁÉÍÓÚÜÑ]+\b", s))
        if wc > 45:
            findings.append(("HIGH", f"run-on sentence ({wc}w)", s[:120]))
        elif wc > 32:
            findings.append(("MED", f"long sentence ({wc}w)", s[:120]))
    # 2. Missing terminal punctuation in paragraphs >1 sentence
    if key in ("paragraphs_text", "intro", "context", "jobRelevance", "why", "instruction", "feedback", "explanation", "portfolioNote"):
        if text.strip() and not re.search(r"[.!?]\s*$", text.strip()):
            # allow list/short ones
            wc = len(re.findall(r"\b[\wáéíóúüñÁÉÍÓÚÜÑ]+\b", text))
            if wc > 6 and not text.strip().endswith(":") and not text.strip().endswith(";"):
                findings.append(("MED", "no terminal punctuation", text.strip()[-80:]))
    # 3. Missing ¿/¡ pairs
    if re.search(r"\b(qué|cómo|cuál|cuándo|dónde|por qué|quién|cuánto|cuántos)\b", text, re.IGNORECASE):
        # find occurrences not preceded by ¿
        for m in re.finditer(r"(?<!¿)\b(qué|cómo|cuál|cuándo|dónde|quién|cuánto|cuántos)\b", text, re.IGNORECASE):
            # only flag if at sentence start or after . , ; :
            start = m.start()
            pre = text[max(0,start-2):start]
            if pre == "" or pre.endswith((". ",".",",","; ",": ","\n","- ","• ")):
                findings.append(("LOW", "missing ¿ (inverted question mark)", text[start:start+60]))
    # 4. Unbalanced delimiters
    for op, cl in [("(",")"), ("[","]"), ("«","»"), ("“","”")]:
        if text.count(op) != text.count(cl):
            findings.append(("MED", f"unbalanced '{op}{cl}' ({text.count(op)} vs {text.count(cl)})", text[:80]))
    # 5. Repeated words "de de", "la la", etc.
    if re.search(r"\b(\w+)\s+\1\b", text, re.IGNORECASE):
        m = re.search(r"\b(\w+)\s+\1\b", text, re.IGNORECASE)
        findings.append(("MED", f"duplicate word '{m.group(1)}'", text[max(0,m.start()-20):m.end()+20]))
    # 6. Meta-leak signals
    META_SIGNALS = [
        (r"\bV3\b", "version marker V3"),
        (r"\bV2\b", "version marker V2"),
        (r"\bv3\b", "version marker v3"),
        (r"\bS0[0-9]\b.*\bS1[0-9]\b", "internal section cross-reference"),
        # Use uppercase-only TODO/FIXME/XXX/HACK/TBD to avoid Spanish false positives ("todo")
        (r"\b(?:TODO|FIXME|XXX|HACK|TBD)\b", "developer comment"),
        (r"\b(?:moved from|moved to)\b", "moved-from note"),
        (r"\b(?:phase ?\d|curriculum|roadmap)\b", "curriculum meta-word"),
        (r"^\s*#\s*(DEFECT|CASO-LIM|TODO|NOTE|HACK)", "developer comment in starter"),
        (r"^\s*#\s*DEFECT:", "starter defect comment"),
        (r"CASO-LIM-\d+", "case-lim tag"),
    ]
    for pat, name in META_SIGNALS:
        # For developer-comment patterns, search case-sensitively (TODO/FIXME/XXX/HACK/TBD are uppercase by convention;
        # case-insensitive would false-positive on Spanish "todo").
        flags = 0 if "developer comment" in name else re.IGNORECASE
        if re.search(pat, text, flags):
            m = re.search(pat, text, flags)
            findings.append(("HIGH", f"meta-leak: {name}", text[max(0,m.start()-30):m.end()+30]))
    # 7. Anaphoric monotony (3+ sentences starting with same word)
    if len(sentences) >= 3:
        starts = [re.match(r"\s*(\w+)", s).group(1).lower() if re.match(r"\s*(\w+)", s) else "" for s in sentences]
        from collections import Counter
        c = Counter(starts)
        for w, n in c.items():
            if n >= 3 and w not in ("y","o","pero","que"):
                findings.append(("LOW", f"anaphoric monotony: '{w}' x{n}", str(starts)))
    # 8. Paragraph = one long sentence
    if key in ("paragraphs_text","intro","context","why","instruction"):
        if len(sentences) == 1 and len(re.findall(r"\b[\wáéíóúüñÁÉÍÓÚÜÑ]+\b", sentences[0])) > 28:
            findings.append(("MED", "paragraph is one long sentence", sentences[0][:120]))
    # 9. High comma density (proxy for hypotaxis)
    n_commas = text.count(",")
    wc = len(re.findall(r"\b[\wáéíóúüñÁÉÍÓÚÜÑ]+\b", text))
    if wc > 0 and n_commas / wc > 0.10 and wc > 20:
        findings.append(("LOW", f"comma density {n_commas}/{wc}={n_commas/wc:.2f}", text[:80]))
    # 10. English-dominant sentence
    en_words = len(re.findall(r"\b(the|is|are|and|with|for|from|that|this|these|those|file|data|pipeline|encoding|newline|append|stream|json|csv|hash|backup|quarantine|manifest|reconcile|provenance|schema|default|cast|dialect|atomic|temporal|runtime|handle|crash|input|output|byte|bytes|column|row|export|import|edge|case|source|target|run|run_id|sha256|fail|closed|self|check|run_id|callback|client|transaction)\b", text, re.IGNORECASE))
    if wc > 0 and en_words / wc > 0.40:
        findings.append(("MED", f"english-dominant prose ({en_words}/{wc}={en_words/wc:.2f})", text[:80]))
    # 11. Space before punctuation
    if re.search(r"\s+[,.!?;:]", text):
        findings.append(("LOW", "space before punctuation", re.findall(r"\S{0,20}\s+[,.!?;:]\S{0,5}", text)[:3]))
    # 12. Double space
    if "  " in text:
        findings.append(("LOW", "double space", text[:80]))
    return findings

# Build records
records = []
for idx, (key, val) in enumerate(chunks):
    if not looks_spanish(val) and key not in ("title","heading","shortTitle","criterion","question","explanation","text"):
        continue
    m = text_metrics(val)
    if not m:
        continue
    f = find_heuristics(key, val)
    records.append({
        "idx": idx, "key": key, "text": val, "metrics": m, "findings": f
    })

# Save full records
with open("/home/z/my-project/audits/s08_records.json", "w", encoding="utf-8") as out:
    json.dump(records, out, ensure_ascii=False, indent=2)

# Aggregate
print(f"Records analyzed: {len(records)}", file=sys.stderr)
all_fh = [r["metrics"]["fh"] for r in records if r["metrics"]["fh"] > 0]
all_wps = [r["metrics"]["wps"] for r in records]
all_spw = [r["metrics"]["spw"] for r in records]
print(f"FH mean={statistics.mean(all_fh):.1f} median={statistics.median(all_fh):.1f} min={min(all_fh):.1f} max={max(all_fh):.1f}", file=sys.stderr)
print(f"WPS mean={statistics.mean(all_wps):.2f} median={statistics.median(all_wps):.2f} max={max(all_wps):.2f}", file=sys.stderr)
print(f"SPW mean={statistics.mean(all_spw):.3f} median={statistics.median(all_spw):.3f}", file=sys.stderr)

# Findings tally
sev_tally = {"HIGH":0,"MED":0,"LOW":0}
high_findings = []
for r in records:
    for sev, name, evid in r["findings"]:
        sev_tally[sev] = sev_tally.get(sev,0)+1
        if sev == "HIGH":
            high_findings.append({"idx": r["idx"], "key": r["key"], "name": name, "evidence": evid, "text_head": r["text"][:120]})
print(f"Severity tally: {sev_tally}", file=sys.stderr)

# Worst sentences (longest)
worst = sorted(records, key=lambda r: -r["metrics"]["max_sentence_words"])[:15]
print("\n=== Top 15 longest-sentence chunks ===", file=sys.stderr)
for r in worst:
    print(f"  idx={r['idx']} key={r['key']} max_w={r['metrics']['max_sentence_words']} fh={r['metrics']['fh']} :: {r['text'][:100]}", file=sys.stderr)

print("\n=== HIGH findings ===", file=sys.stderr)
for h in high_findings[:30]:
    print(f"  idx={h['idx']} key={h['key']} :: {h['name']} :: {h['evidence']!r}", file=sys.stderr)

# Per-tab aggregation
print("\n=== Per-key metric summary ===", file=sys.stderr)
by_key = {}
for r in records:
    by_key.setdefault(r["key"], []).append(r)
for k, rs in sorted(by_key.items()):
    fhs = [r["metrics"]["fh"] for r in rs]
    wps = [r["metrics"]["wps"] for r in rs]
    print(f"  {k:14s} n={len(rs):3d} fh={statistics.mean(fhs):5.1f} wps={statistics.mean(wps):5.2f}", file=sys.stderr)

print("\nDone. Records saved to s08_records.json", file=sys.stderr)
