# Consolidated audit pipeline

Rebuilds `audit/consolidated/` from the raw audit sources. Every finding ever recorded for
S01–S52 comes from two places, and neither alone is complete:

1. **`ReviewerFixer/*.zip`** — four ChatGPT conversation exports (the audit sessions themselves,
   plus the artifacts they generated).
2. **`origin/audit/lessons-only-adversarial-20260903`** — the branch those sessions wrote to.

22 findings exist *only* in the conversations and were never written to the branch, so the zips
are not redundant. See `audit/consolidated/INTEGRITY.md`.

## Rebuild

The scripts share one working directory laid out like this:

```
<work>/branch/   # git archive of the audit branch's audit/ tree
<work>/x/        # the four zips, extracted
<work>/blobs/    # one .txt per conversation message, extracted from the exports
<work>/audits/   # intermediate JSON (created by the scripts)
```

```bash
WORK=$(mktemp -d)
mkdir -p "$WORK"/{branch,x,audits}

# 1. the audit branch tree
git fetch origin audit/lessons-only-adversarial-20260903
git archive origin/audit/lessons-only-adversarial-20260903 audit/lessons-only audit/full-content \
  | tar -x -C "$WORK/branch"

# 2. the zips (Python, not unzip: two archives have non-UTF8 filenames)
python3 - "$WORK/x" <<'PY'
import zipfile, sys, os, glob, unicodedata
out = sys.argv[1]
for z in sorted(glob.glob("ReviewerFixer/*.zip")):
    with zipfile.ZipFile(z) as zf:
        for info in zf.infolist():
            if info.is_dir(): continue
            raw = info.filename
            if not (info.flag_bits & 0x800):
                try: raw = raw.encode('cp437').decode('utf-8')
                except Exception: pass
            safe = unicodedata.normalize('NFC', raw.replace('/', '\x00')).replace('\x00', '/')
            dest = os.path.join(out, safe)
            os.makedirs(os.path.dirname(dest), exist_ok=True)
            with zf.open(info) as src, open(dest, 'wb') as fh: fh.write(src.read())
PY

# 3. message blobs from the conversation exports
python3 - "$WORK" <<'PY'
import json, glob, os, sys
sp = sys.argv[1]; os.makedirs(sp + "/blobs", exist_ok=True)
for f in sorted(glob.glob(sp + "/x/*.json")):
    d = json.load(open(f)); conv = os.path.basename(f)[:-5]
    for nid, node in d["mapping"].items():
        m = node.get("message")
        if not m: continue
        c = m.get("content", {}); chunks = []
        for k in ("parts", "text", "result", "content"):
            v = c.get(k)
            if isinstance(v, str): chunks.append(v)
            elif isinstance(v, list): chunks += [x for x in v if isinstance(x, str)]
        blob = "\n".join(chunks)
        if blob.strip():
            open(f"{sp}/blobs/{conv}__{m.get('create_time') or 0}__{nid}.txt", "w").write(blob)
PY

# 4. consolidate -> dedupe -> validate -> report
python3 tools/audit/consolidate.py "$WORK"
python3 tools/audit/build.py      "$WORK"
python3 tools/audit/validate.py   "$WORK"     # exits non-zero if a check fails
python3 tools/audit/report.py     "$WORK" audit/consolidated
```

## What each script does

| Script | Role |
|---|---|
| `consolidate.py` | Reads all 234 audit documents and every conversation blob. Findings appear in five different shapes (objects in a named list, a singular `finding`, an `adds` list, positional arrays, and bare objects inside Python literals in code cells) — each needs its own reader. Also detects per-file severity vocabulary, because 5 documents grade `critical/high/medium` while 229 grade `P0/P1/P2`, and reading `high` as top severity inflates P0. |
| `build.py` | Deduplicates by `(section, finding_id)`, merges partial records, keeps all provenance, and enriches from cross-reference lists. |
| `validate.py` | Five cross-source checks (see below). Exit code 1 on failure. |
| `report.py` | Emits `registry.json`, `findings.csv`, `INDEX.md` and `sections/S**.md`. |

## The validation checks

These compare the registry against figures the audit authors wrote independently, so a
disagreement means either the extraction is lossy or the source registry contradicts itself —
both worth knowing.

- **T1** every `finding_id` referenced by an element audit resolves (5,393 references)
- **T2** no section extracts fewer findings than its own declared `severity_counts`
- **T3** all 52 sections are represented
- **T4** findings with no fix, impact *or* evidence stay under 25%
- **T5** every `critical_findings` cross-reference resolves

T1 and T2 both caught real extraction gaps while this registry was being built.
