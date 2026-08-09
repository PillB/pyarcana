#!/usr/bin/env python3
"""S50 grammar audit pipeline: per-sentence metrics + heuristics + LanguageTool."""
import re, json, sys, os, time, urllib.request, urllib.parse, statistics
from collections import Counter

sys.path.insert(0, "/home/z/my-project")
from grammar_metrics import split_sentences, metrics as sentence_metrics

PROSE = "/home/z/my-project/audits/s50_prose.json"
OUT_METRICS = "/home/z/my-project/audits/s50_metrics.json"
OUT_LT = "/home/z/my-project/audits/s50_lt.json"
OUT_PROSE_LT = "/home/z/my-project/audits/s50_lt_input.txt"

with open(PROSE, encoding="utf-8") as f:
    items = json.load(f)

# Filter: drop prose items whose path indicates code block (titles/labels inside code blocks)
SKIP_PATH_PARTS = {"code"}  # the `code:` blocks contain titles like 's50_map_contract.py'
# Keep all learner-facing fields
LEARNER_KEYS = {
    "intro", "why", "instruction", "hint", "tests", "feedback", "description",
    "context", "portfolioNote", "tagline", "jobRelevance", "content", "title",
    "heading", "paragraphs", "hints", "edgeCases", "objectives", "requirements",
    "learningOutcomes", "question", "explanation", "options", "criterion", "note",
    "label", "text", "weight",
}

learner = []
for it in items:
    path = it["path"]
    parts = path.split("/")
    # Drop if any path part is exactly 'code' (means inside a code block object)
    if "code" in parts:
        continue
    # Drop the 'rubric' weight-only entries (just numbers like "25%") — not prose
    if it["key"] == "weight":
        continue
    if it["key"] in ("title", "label", "heading", "text", "note", "criterion"):
        # keep these (they are short learner-facing text)
        pass
    learner.append(it)

# Drop items whose value is purely a filename or non-prose (like 's50_map_contract.py')
def is_filename(s):
    return bool(re.fullmatch(r'[a-z_0-9\-]+\.py', s.strip()))

learner = [it for it in learner if not is_filename(it["clean"])]

# Build a per-item metrics structure with paragraph + sentence granularity.
all_records = []
for idx, it in enumerate(learner):
    raw = it["clean"]
    # Split into sentences
    sents = split_sentences(raw)
    if not sents:
        continue
    sm = sentence_metrics(raw) or []
    rec = {
        "idx": idx,
        "path": it["path"],
        "key": it["key"],
        "paragraph": raw,
        "sentences": sm,
    }
    # Paragraph-level anaphora: same first word in >=3 sentences
    firsts = []
    for s in sm:
        m = re.match(r'^(\w+)', s["sentence"])
        if m:
            firsts.append(m.group(1).lower())
    if firsts:
        c = Counter(firsts)
        rec["anaphora_top"] = c.most_common(1)[0]
        rec["anaphora"] = c.most_common(1)[0][1] >= 3
    # Paragraph length
    rec["p_words"] = sum(s["words"] for s in sm)
    rec["p_sentences"] = len(sm)
    rec["paragraph_is_one_sentence"] = len(sm) == 1 and rec["p_words"] > 30
    # Worst sentence by FH
    if sm:
        rec["worst_fh"] = min(sm, key=lambda x: x["FH"])
    all_records.append(rec)

# Aggregate metrics
all_sentences = [s for rec in all_records for s in rec["sentences"]]
n_sents = len(all_sentences)
n_paragraphs = len(all_records)
avg_wps = statistics.mean(s["wps"] for s in all_sentences) if all_sentences else 0
avg_spw = statistics.mean(s["spw"] for s in all_sentences) if all_sentences else 0
avg_fh = statistics.mean(s["FH"] for s in all_sentences) if all_sentences else 0
avg_inf = statistics.mean(s["INFLESZ"] for s in all_sentences) if all_sentences else 0

# Heuristic findings
findings = []
for rec in all_records:
    for s in rec["sentences"]:
        if s["long_flag"] == "RUNON":
            findings.append({"severity": "H", "rule": "RUNON", "path": rec["path"], "key": rec["key"],
                             "excerpt": s["sentence"][:120], "words": s["words"], "cause": "Dense subordination; >45 words",
                             "improvement": "Split into 2-3 sentences or move examples to lists/code."})
        elif s["long_flag"] == "LONG":
            findings.append({"severity": "M", "rule": "LONG_SENTENCE", "path": rec["path"], "key": rec["key"],
                             "excerpt": s["sentence"][:120], "words": s["words"], "cause": "Long sentence >32 words",
                             "improvement": "Split or convert clauses into a code block / bullet list."})
        if s["missing_term"]:
            findings.append({"severity": "M", "rule": "MISSING_TERMINAL", "path": rec["path"], "key": rec["key"],
                             "excerpt": s["sentence"][-80:], "cause": "Sentence without terminal .?!",
                             "improvement": "Close the sentence deliberately (note: list items may legitimately lack .)"})
        if s["missing_inverted"]:
            findings.append({"severity": "M", "rule": "MISSING_INVERTED", "path": rec["path"], "key": rec["key"],
                             "excerpt": s["sentence"][:120], "cause": "Spanish ¿¡ not paired",
                             "improvement": "Add the opening ¿ / ¡."})
        if s["unbalanced"]:
            findings.append({"severity": "M", "rule": "UNBALANCED_DELIM", "path": rec["path"], "key": rec["key"],
                             "excerpt": s["sentence"][:120], "cause": "Unbalanced () [] «»",
                             "improvement": "Rebalance delimiters."})
        if s["double_space"]:
            findings.append({"severity": "L", "rule": "DOUBLE_SPACE", "path": rec["path"], "key": rec["key"],
                             "excerpt": s["sentence"][:120], "cause": "Double space",
                             "improvement": "Normalize to single space."})
        if s["space_before_punct"]:
            findings.append({"severity": "L", "rule": "SPACE_BEFORE_PUNCT", "path": rec["path"], "key": rec["key"],
                             "excerpt": s["sentence"][:120], "cause": "Space before punctuation",
                             "improvement": "Remove space before .,;:!?"})
        if s["gerund_pileup"]:
            findings.append({"severity": "L", "rule": "GERUND_PILEUP", "path": rec["path"], "key": rec["key"],
                             "excerpt": s["sentence"][:120], "cause": "≥3 gerunds in one sentence",
                             "improvement": "Prefer finite verbs or split the sentence."})
        if s["high_comma_density"]:
            findings.append({"severity": "L", "rule": "HIGH_COMMA_DENSITY", "path": rec["path"], "key": rec["key"],
                             "excerpt": s["sentence"][:120], "commas": s["commas"], "cause": "Comma density > 0.12",
                             "improvement": "Convert enumerations to lists; reduce subordination."})
        if s["repeated_word"]:
            findings.append({"severity": "M", "rule": "REPEATED_WORD", "path": rec["path"], "key": rec["key"],
                             "excerpt": s["sentence"][:120], "cause": "Same word twice in a row",
                             "improvement": "Delete the duplicate word."})
    if rec.get("anaphora"):
        findings.append({"severity": "L", "rule": "ANAPHORA_MONOTONY", "path": rec["path"], "key": rec["key"],
                         "excerpt": f"First-word anaphora: {rec['anaphora_top']}", "cause": "Same sentence start ≥3 times",
                         "improvement": "Vary sentence openings."})
    if rec.get("paragraph_is_one_sentence"):
        findings.append({"severity": "M", "rule": "ONE_SENTENCE_PARAGRAPH", "path": rec["path"], "key": rec["key"],
                         "excerpt": rec["paragraph"][:120], "words": rec["p_words"],
                         "cause": f"Paragraph is a single {rec['p_words']}-word sentence",
                         "improvement": "Break into 2-4 sentences with one focus each."})

# Worst sentences by FH (lowest = hardest)
worst_fh = sorted(all_sentences, key=lambda x: x["FH"])[:15]
# Longest sentences
longest = sorted(all_sentences, key=lambda x: -x["words"])[:15]

summary = {
    "section": "S50",
    "n_prose_items": len(learner),
    "n_paragraphs": n_paragraphs,
    "n_sentences": n_sents,
    "avg_wps": round(avg_wps, 2),
    "avg_spw": round(avg_spw, 2),
    "avg_fh": round(avg_fh, 1),
    "avg_inf": round(avg_inf, 1),
    "findings_count": len(findings),
    "findings_by_severity": dict(Counter(f["severity"] for f in findings)),
    "findings_by_rule": dict(Counter(f["rule"] for f in findings)),
}

# Save
with open(OUT_METRICS, "w", encoding="utf-8") as f:
    json.dump({"summary": summary, "records": all_records, "findings": findings,
               "worst_fh": worst_fh, "longest": longest},
              f, ensure_ascii=False, indent=2)

print(json.dumps(summary, ensure_ascii=False, indent=2))

# Build LT input: concatenate paragraphs with markers so we can map matches back.
lt_input_lines = []
for rec in all_records:
    lt_input_lines.append(f"[#{rec['idx']}|{rec['key']}|{rec['path']}]")
    lt_input_lines.append(rec["paragraph"])
    lt_input_lines.append("")
LT_INPUT = "\n".join(lt_input_lines)
with open(OUT_PROSE_LT, "w", encoding="utf-8") as f:
    f.write(LT_INPUT)
print(f"\nLT input: {len(LT_INPUT)} chars -> {OUT_PROSE_LT}")

# Chunk and call LanguageTool
def call_lt(text, language="es"):
    data = urllib.parse.urlencode({
        "language": language,
        "text": text,
    }).encode()
    req = urllib.request.Request("https://api.languagetool.org/v2/check", data=data,
                                 headers={"Content-Type": "application/x-www-form-urlencoded"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode())

# Chunk by ~6000 chars on paragraph boundaries to stay well under 20k limit
def chunk_text(text, max_chars=8000):
    chunks = []
    cur = []
    cur_len = 0
    for line in text.split("\n"):
        add = len(line) + 1
        if cur_len + add > max_chars and cur:
            chunks.append("\n".join(cur))
            cur = []
            cur_len = 0
        cur.append(line)
        cur_len += add
    if cur:
        chunks.append("\n".join(cur))
    return chunks

chunks = chunk_text(LT_INPUT, max_chars=8000)
print(f"LT chunks: {len(chunks)}")
all_matches = []
for ci, chunk in enumerate(chunks):
    try:
        result = call_lt(chunk)
        for m in result.get("matches", []):
            m["_chunk"] = ci
            # Extract the marker context to map back to a record
            ctx = m.get("context", {}).get("text", "")
            m["_context_text"] = ctx[:200]
            all_matches.append(m)
        print(f"  chunk {ci}: {len(result.get('matches', []))} matches")
        time.sleep(3.5)  # be gentle with rate limit
    except Exception as e:
        print(f"  chunk {ci}: ERROR {e}")
        time.sleep(5)

with open(OUT_LT, "w", encoding="utf-8") as f:
    json.dump(all_matches, f, ensure_ascii=False, indent=2)
print(f"\nLT matches total: {len(all_matches)} -> {OUT_LT}")

# Aggregate by rule
rule_counts = Counter(m.get("rule", {}).get("id", "?") for m in all_matches)
print("Top LT rules:")
for r, c in rule_counts.most_common(15):
    print(f"  {c:3d}  {r}")
