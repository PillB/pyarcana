"""Emit the consolidated issue registry as JSON, CSV and per-section Markdown."""
import json, sys, os, csv, re, collections, datetime
SP=sys.argv[1]; OUT=sys.argv[2]
R=json.load(open(SP+"/audits/registry.json"))
E=json.load(open(SP+"/audits/elements.json"))
RJ=json.load(open(SP+"/audits/rejects.json"))
T=json.load(open(SP+"/audits/tests.json"))
V=json.load(open(SP+"/audits/validation.json"))
os.makedirs(OUT+"/sections",exist_ok=True)
DATE="2026-09-10"

SEV=("P0","P1","P2","UNSPEC")
bysec=collections.defaultdict(list)
for f in R: bysec[f["section"]].append(f)
elem=collections.Counter(e["section"] for e in E)
rej =collections.Counter(r["section"] for r in RJ)
tst =collections.Counter(t["section"] for t in T)

# ---------- machine-readable ----------
json.dump({"generated":DATE,
           "source":"ReviewerFixer/*.zip + origin/audit/lessons-only-adversarial-20260903",
           "total_findings":len(R),
           "severity_counts":{s:sum(1 for f in R if f["severity"]==s) for s in SEV},
           "findings":R},
          open(OUT+"/registry.json","w"), ensure_ascii=False, indent=1)

cols=["section","finding_id","severity","category","title","location","evidence","impact",
      "fix","attack","defense","verdict","justification","flagged_critical","source_count"]
with open(OUT+"/findings.csv","w",newline="",encoding="utf-8") as fh:
    w=csv.DictWriter(fh,fieldnames=cols,extrasaction="ignore"); w.writeheader()
    for f in R: w.writerow({c:f.get(c,"") for c in cols})

# ---------- per-section markdown ----------
def esc(s): return re.sub(r'\s+',' ',str(s or '')).replace('|','\\|').strip()
for sec in sorted(bysec):
    fs=sorted(bysec[sec], key=lambda x:(SEV.index(x["severity"]) if x["severity"] in SEV else 9,
                                        x["finding_id"]))
    c=collections.Counter(f["severity"] for f in fs)
    L=[f"# {sec} — consolidated issues", "",
       f"**{len(fs)} findings** · P0 {c['P0']} · P1 {c['P1']} · P2 {c['P2']} · unspecified {c['UNSPEC']}",
       f"Elements audited: {elem[sec]} · Rejected hypotheses: {rej[sec]} · Red tests: {tst[sec]}", ""]
    for sv in SEV:
        grp=[f for f in fs if f["severity"]==sv]
        if not grp: continue
        L += [f"## {sv} ({len(grp)})",""]
        for f in grp:
            hid=f["finding_id"] or "(unnumbered)"
            flag=" 🚩" if f.get("flagged_critical") else ""
            L.append(f"### {hid}{flag} — {esc(f['title'])[:200]}")
            if f["category"]: L.append(f"- **Category:** {esc(f['category'])}")
            if f["location"]: L.append(f"- **Location:** {esc(f['location'])}")
            if f["evidence"]: L.append(f"- **Evidence:** {esc(f['evidence'])}")
            if f["impact"]:   L.append(f"- **Impact:** {esc(f['impact'])}")
            if f["attack"]:   L.append(f"- **Attack:** {esc(f['attack'])}")
            if f["defense"]:  L.append(f"- **Defense:** {esc(f['defense'])}")
            if f["fix"]:      L.append(f"- **Proposed fix:** {esc(f['fix'])}")
            if f["verdict"]:  L.append(f"- **Verdict:** {esc(f['verdict'])}")
            srcs=sorted({p['file'] for p in f['provenance']})
            L.append(f"- **Sources ({len(srcs)}):** {', '.join(srcs[:4])}"+(" …" if len(srcs)>4 else ""))
            if f.get("title_derived"): L.append("- *(title derived — source record had no title field)*")
            L.append("")
    open(f"{OUT}/sections/{sec}.md","w",encoding="utf-8").write("\n".join(L))

# ---------- index ----------
tot=collections.Counter(f["severity"] for f in R)
idx=[f"# PyArcana consolidated audit registry (S01–S52)","",
 f"Generated {DATE} from the four ReviewerFixer conversation exports and the",
 "`audit/lessons-only-adversarial-20260903` branch registry.","",
 f"**{len(R)} distinct findings** across 52 sections: "
 f"**{tot['P0']} P0**, **{tot['P1']} P1**, **{tot['P2']} P2**, {tot['UNSPEC']} unspecified.","",
 "| Section | Findings | P0 | P1 | P2 | Unspec | Elements | Rejected | Red tests |",
 "|---|---:|---:|---:|---:|---:|---:|---:|---:|"]
for sec in sorted(bysec):
    c=collections.Counter(f["severity"] for f in bysec[sec])
    idx.append(f"| [{sec}](sections/{sec}.md) | {len(bysec[sec])} | {c['P0']} | {c['P1']} "
               f"| {c['P2']} | {c['UNSPEC']} | {elem[sec]} | {rej[sec]} | {tst[sec]} |")
idx += ["", f"| **Total** | **{len(R)}** | **{tot['P0']}** | **{tot['P1']}** | **{tot['P2']}** "
        f"| {tot['UNSPEC']} | {sum(elem.values())} | {sum(rej.values())} | {sum(tst.values())} |",
 "","## Files","",
 "- `registry.json` — every finding, normalized, with provenance",
 "- `findings.csv` — same data, spreadsheet-friendly",
 "- `sections/S**.md` — per-section issue lists",
 "- `INTEGRITY.md` — data defects found in the audit registry itself",
 "- `validation.json` — cross-source test results",
 "- `repaired/` — four registry files that were committed as invalid JSON",
 "","## Top P0 findings","" ]
for f in [x for x in R if x["severity"]=="P0"][:25]:
    idx.append(f"- **{f['section']} {f['finding_id']}** — {esc(f['title'])[:150]}")
open(OUT+"/INDEX.md","w",encoding="utf-8").write("\n".join(idx))
print("wrote", OUT)
print("findings:",len(R),"sections:",len(bysec))
