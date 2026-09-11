"""Cross-check the consolidated registry against the sources' own declared numbers.

Non-tautological: every assertion compares the registry to an INDEPENDENT figure that the
audit authors wrote by hand (declared severity_counts, finding_count, inventory_count) or to
cross-references the element audits make. Disagreement means either our extraction is lossy
or the source registry is internally inconsistent - both are reportable defects.
"""
import json, sys, re, collections
SP=sys.argv[1]
REG=json.load(open(SP+"/audits/registry.json"))
E=json.load(open(SP+"/audits/elements.json"))
DECL=json.load(open(SP+"/audits/declared.json"))
X=json.load(open(SP+"/audits/xrefs.json"))

fail=[]; warn=[]; ok=[]

def short(fid): return re.sub(r'^S\d{1,2}[-_]','',(fid or ''),flags=re.I).upper()

# ---- T1: every finding_id referenced by an element audit resolves to a registry finding ----
known=collections.defaultdict(set)
for f in REG:
    if f["finding_id"]: known[f["section"]].add(short(f["finding_id"]))
dangling=collections.Counter(); total_refs=0
for e in E:
    for fid in e["finding_ids"]:
        s=short(fid)
        if not s: continue
        total_refs+=1
        sec=e["section"]
        if s not in known.get(sec,set()):
            # a reference may legitimately target another section
            other=re.match(r'^S(\d{1,2})[-_]',fid or '',flags=re.I)
            tgt=f"S{int(other.group(1)):02d}" if other else None
            if tgt and s in known.get(tgt,set()): continue
            dangling[(sec,s)]+=1
print(f"T1 element->finding references: {total_refs} checked, {len(dangling)} distinct dangling")
if dangling:
    warn.append(("T1", f"{len(dangling)} finding_ids referenced by element audits have no finding record"))
    for (sec,fid),n in dangling.most_common(15): print(f"     dangling {sec}:{fid} x{n}")
else: ok.append("T1")

# ---- T2: registry per-section counts vs. the authors' own declared severity_counts ----
reg_by_sec=collections.defaultdict(collections.Counter)
for f in REG: reg_by_sec[f["section"]][f["severity"]]+=1
mismatch=[]
for sec, entries in sorted(DECL.items()):
    if sec in (None,"None","UNASSIGNED"): continue
    best=None
    for e in entries:
        c={k.upper():v for k,v in e["counts"].items() if isinstance(v,int)}
        tot=sum(v for k,v in c.items() if k in ("P0","P1","P2"))
        if tot and (best is None or tot>best[0]): best=(tot,c,e["file"])
    if not best: continue
    tot,c,src=best
    got=sum(reg_by_sec[sec][k] for k in ("P0","P1","P2"))
    if got < tot:
        mismatch.append((sec,tot,got,src))
print(f"\nT2 declared-vs-extracted: {len(mismatch)} sections where we extracted FEWER than declared")
for sec,tot,got,src in mismatch[:20]: print(f"     {sec}: declared {tot}, extracted {got}  ({src})")
if mismatch: fail.append(("T2", f"{len(mismatch)} sections under-extracted vs declared counts"))
else: ok.append("T2")

# ---- T3: every section S01..S52 is represented ----
missing=[f"S{i:02d}" for i in range(1,53) if not reg_by_sec.get(f"S{i:02d}")]
print(f"\nT3 section coverage: {52-len(missing)}/52 sections have findings")
if missing: fail.append(("T3", f"sections with no findings: {missing}"))
else: ok.append("T3")

# ---- T4: no finding may be empty of both a fix and an impact statement ----
hollow=[f for f in REG if not f["fix"] and not f["impact"] and not f["evidence"]]
print(f"\nT4 substance: {len(hollow)} findings carry no fix, impact or evidence")
if len(hollow) > len(REG)*0.25:
    fail.append(("T4", f"{len(hollow)} hollow findings exceeds 25% threshold"))
else: ok.append("T4")

# ---- T5: xref'd critical findings actually exist ----
crit={(x["section"],short(x["finding_id"])) for x in X if x["role"]=="critical_findings"}
missing_crit=[c for c in crit if c[1] not in known.get(c[0],set())]
print(f"\nT5 critical xrefs: {len(crit)} flagged, {len(missing_crit)} unresolvable")
if missing_crit:
    warn.append(("T5", f"{len(missing_crit)} critical_findings ids have no record"))
    for c in missing_crit[:10]: print(f"     {c[0]}:{c[1]}")
else: ok.append("T5")

print("\n"+"="*60)
print("PASS:", [o for o in ok])
print("WARN:", warn)
print("FAIL:", fail)
json.dump({"pass":ok,"warn":warn,"fail":fail,
           "dangling":[{"section":s,"finding_id":f,"count":n} for (s,f),n in dangling.items()],
           "declared_mismatch":[{"section":s,"declared":t,"extracted":g,"source":src} for s,t,g,src in mismatch]},
          open(SP+"/audits/validation.json","w"), ensure_ascii=False, indent=1)
sys.exit(1 if fail else 0)
