"""Deduplicate + finalize the consolidated issue registry."""
import json, sys, re, collections
SP=sys.argv[1]
F=json.load(open(SP+"/audits/findings.json"))
E=json.load(open(SP+"/audits/elements.json"))
R=json.load(open(SP+"/audits/rejects.json"))
X=json.load(open(SP+"/audits/xrefs.json"))

# cross-reference roles that mark a finding as critical / still-open
CRIT_ROLES={"critical_findings","highest_risk_findings","unresolved_high_severity_problems",
            "unresolved_high_severity","critical_failures"}
xref_roles=collections.defaultdict(set)
for x in X:
    fid=x["finding_id"].strip()
    short=re.sub(r'^S\d{1,2}[-_]','',fid,flags=re.I).upper()
    xref_roles[(x["section"],short)].add(x["role"])

def first_sentence(s, n=140):
    s=re.sub(r'\s+',' ',s or '').strip()
    if not s: return ''
    m=re.split(r'(?<=[.!?])\s', s)
    out=m[0] if m else s
    return out[:n].rstrip()+('…' if len(out)>n else '')

def humanize(c):
    return re.sub(r'[_\-]+',' ',(c or '')).strip().capitalize()

RANK={"P0":0,"P1":1,"P2":2,"UNSPEC":3}
merged={}
for f in F:
    # derive title if missing
    t=f["title"]; derived=False
    if not t:
        t=first_sentence(f["impact"]) or first_sentence(f["evidence"]) or humanize(f["category"])
        derived=bool(t)
    f=dict(f); f["title"]=t; f["title_derived"]=derived
    key=(f["section"], f["finding_id"]) if f["finding_id"] else \
        (f["section"], "T:"+re.sub(r'\W+','',(t or '')[:60]).lower())
    if key not in merged:
        f["provenance"]=[{"file":f["source_file"],"list":f["list_key"],"origin":f["origin"]}]
        f["severity_variants"]={f["severity"]}
        merged[key]=f
    else:
        m=merged[key]
        m["provenance"].append({"file":f["source_file"],"list":f["list_key"],"origin":f["origin"]})
        m["severity_variants"].add(f["severity"])
        # prefer the most severe known rating
        if RANK.get(f["severity"],9) < RANK.get(m["severity"],9): m["severity"]=f["severity"]
        # fill blanks with richer content
        for fld in ("category","evidence","impact","fix","attack","defense","verdict",
                    "location","justification","prior_knowledge","cross_section"):
            if not m.get(fld) and f.get(fld): m[fld]=f[fld]
        if m.get("title_derived") and not f.get("title_derived") and f["title"]:
            m["title"]=f["title"]; m["title_derived"]=False

OUT=[]
for (sec,kid),m in merged.items():
    short=re.sub(r'^S\d{1,2}[-_]','',m["finding_id"] or '',flags=re.I).upper()
    roles=xref_roles.get((sec,short),set())
    m["xref_roles"]=sorted(roles)
    m["flagged_critical"]=bool(roles & CRIT_ROLES)
    m["severity_variants"]=sorted(m["severity_variants"])
    m["source_count"]=len(m["provenance"])
    m.pop("source_file",None); m.pop("list_key",None); m.pop("origin",None)
    OUT.append(m)

def sk(x):
    n=re.search(r'(\d+)', x["finding_id"] or '')
    return (int(x["section"][1:]), RANK.get(x["severity"],9), int(n.group(1)) if n else 999)
OUT.sort(key=sk)

# element coverage per section
elem_by_sec=collections.Counter(e["section"] for e in E)
rej_by_sec=collections.Counter(r["section"] for r in R)

json.dump(OUT, open(SP+"/audits/registry.json","w"), ensure_ascii=False, indent=1)
print("deduped findings:", len(OUT), "(from", len(F), "raw records)")
print("severity:", collections.Counter(o["severity"] for o in OUT).most_common())
print("titles derived:", sum(1 for o in OUT if o["title_derived"]))
print("merged from >1 source:", sum(1 for o in OUT if o["source_count"]>1))
print("\nper-section counts:")
bysec=collections.defaultdict(collections.Counter)
for o in OUT: bysec[o["section"]][o["severity"]]+=1
for s in sorted(bysec):
    c=bysec[s]; tot=sum(c.values())
    print(f"  {s}: {tot:4d}  P0={c['P0']:3d} P1={c['P1']:3d} P2={c['P2']:3d} UNSPEC={c['UNSPEC']:3d}"
          f"  elements={elem_by_sec[s]:4d} rejected={rej_by_sec[s]:3d}")
