"""Build the consolidated per-section issue registry from every audit source."""
import json, glob, os, re, sys, collections

SP = sys.argv[1]

# Lists that hold actual ISSUE records (vs. element inventories / supporting data)
FINDING_LISTS = ["findings","confirmed_findings","finding_registry","new_confirmed_findings","adds","tightened_findings",
                 "new_findings","material_findings","issues","cross_element_issues",
                 "finding_delta","unresolved_questions","highest_risk_findings"]
REJECT_LISTS  = ["rejected_findings","rejected_hypotheses","rejected_or_not_new",
                 "rejected_or_bounded_hypotheses","rejected_or_unresolved_hypotheses"]
# Element inventories: corroborate locations + finding_ids, not separate issues
ELEMENT_LISTS = ["elements","paragraphs","paragraph_audit","paragraph_reviews","components",
                 "top_level","learning_outcomes","callouts","code_blocks","figures",
                 "theory_code_output","theory_code_outputs","code_output_blocks","code_outputs",
                 "entries","i_do","we_do","you_do","self_check","demos","steps",
                 "element_inventory","paragraph_level_audit","artifact_reviews","code_audit",
                 "paragraph_delta","code_block_review","code_and_media_reviews",
                 "theory_code_output_blocks","paragraph_amendments","interactive_playground"]
TEST_LISTS    = ["red_tests","executed_red_tests","runtime_counterexamples","counterexamples",
                 "you_do_counterexamples","runtime_adversarial_checks","execution_checks",
                 "technical_spot_checks","runtime_adversarial_validation"]

A = {
 "id":      ["finding_id","id","element_id","paragraph_id","component_id","concept_id"],
 "severity":["severity","sev","priority"],
 "category":["category","issue_type","type","family","kind"],
 "title":   ["title","summary","actual_problem","issue","problem","claim","hypothesis","name","question","label","check","suspicion"],
 "evidence":["evidence","text","current_content","current_excerpt","current","observed","current_behavior","execution_evidence","counterexample"],
 "impact":  ["impact","pedagogical_impact","reader_failure","learner_failure","learner_failure_mode",
             "why_it_matters","why","why_this_is_a_problem","reader_question_created","student_failure","risk"],
 "fix":     ["minimal_fix","minimal_repair","fix","repair","improved_version","improved_content",
             "improved","proposed_improvement","proposed_change","proposed_fix","proposal",
             "improvement","recommended_fix","recommended_strategy","improved_direction",
             "improved_strategy","improved_text","action","recommended"],
 "attack":  ["attack"], "defense": ["defense"],
 "verdict": ["verdict","status","comprehension_status","result","state"],
 "location":["location","locator","locations","subtopic_or_location","page","node","surface","anchor"],
 "justification":["justification","rationale","reason","verdict_reason","note","relevance"],
}
def pick(d, names):
    for n in names:
        v = d.get(n)
        if v in (None,"",[],{}): continue
        if isinstance(v,list): v="; ".join(str(x) for x in v if x)
        elif isinstance(v,dict): v=json.dumps(v,ensure_ascii=False)[:800]
        s=str(v).strip()
        if s: return s
    return ""

FILE_VOCAB = {}   # path -> "P" (P0/P1/P2 scheme) or "CHML" (critical/high/medium/low)

def scan_vocab(node, acc, d=0):
    if d > 14: return
    if isinstance(node, dict):
        v = node.get("severity") or node.get("sev")
        if isinstance(v, str): acc.add(v.strip().upper())
        for x in node.values(): scan_vocab(x, acc, d+1)
    elif isinstance(node, list):
        for x in node: scan_vocab(x, acc, d+1)

def norm_sev(s, path=None):
    s = (s or "").strip().upper()
    if not s: return "UNSPEC"
    m = re.search(r'\bP[012]\b', s)
    if m: return m.group(0)
    # Word severities are ambiguous: "high" is top-tier in a critical/high/medium file
    # but mid-tier where "critical" also appears. Decide per file vocabulary.
    vocab = FILE_VOCAB.get(path, "P")
    if vocab == "CHML":
        table = {"CRITICAL":"P0","BLOCKER":"P0","HIGH":"P1","MEDIUM":"P2","MED":"P2",
                 "LOW":"P2","MINOR":"P2","INFO":"P2"}
    else:
        table = {"CRITICAL":"P0","BLOCKER":"P0","HIGH":"P0","MEDIUM":"P1","MED":"P1",
                 "LOW":"P2","MINOR":"P2","INFO":"P2"}
    for k, v in table.items():
        if k in s: return v
    return "UNSPEC"

def norm_sec(*c):
    for x in c:
        if x is None: continue
        if isinstance(x,int) and 1<=x<=52: return f"S{x:02d}"
        m=re.search(r'\bS(\d{1,2})\b',str(x))
        if m and 1<=int(m.group(1))<=52: return f"S{int(m.group(1)):02d}"
    return None

def file_section(d, path):
    if not isinstance(d,dict): return norm_sec(os.path.basename(path))
    ci=d.get("canonical_identity") or {}; am=d.get("audit_metadata") or {}
    sc=d.get("scope")
    return (norm_sec(d.get("section"))
            or norm_sec(sc.get("only_section") if isinstance(sc,dict) else None)
            or norm_sec(ci.get("id")) or norm_sec(am.get("page_or_scope"))
            or norm_sec(am.get("scope")) or norm_sec(os.path.basename(path)))

findings=[]; rejects=[]; elements=[]; tests=[]; xrefs=[]

ID_RE = re.compile(r'^\s*(S\d{1,2}[-_])?[FUCP]\d{1,3}[a-z]?\s*$', re.I)
# String lists that carry narrative issues rather than ID cross-references
PROSE_LISTS = ["major_comprehension_problems","unresolved_high_severity_problems",
               "unresolved_high_severity","issues","recurring_missing_context",
               "terminology_inconsistencies","critical_failures","three_failure_causes",
               "three_most_likely_failure_causes","three_primary_failure_causes",
               "three_most_likely_causes_of_pedagogical_failure","recurring_widow_terms",
               "problems","findings","new_full_scope_findings","global_practice_findings",
               "critical_findings","highest_risk_findings","upheld_findings",
               "new_findings_in_this_shard","prior_findings_tightened"]

ROW_ID = re.compile(r'^S\d{1,2}[-_][FUX]\d{1,3}', re.I)

def ingest_rows(node, path, origin, sec):
    """Some audits store findings as positional arrays instead of objects."""
    for lk in ("findings",):
        v = node.get(lk)
        if not (isinstance(v, list) and v and all(isinstance(x, list) for x in v)): continue
        for row in v:
            cells = [("" if c is None else (", ".join(map(str,c)) if isinstance(c,list) else str(c))).strip()
                     for c in row]
            if not cells or not ROW_ID.match(cells[0]): continue
            fid = cells[0]
            sev = norm_sev(cells[1] if len(cells) > 1 else "", path)
            if len(cells) >= 6:
                loc, ev, imp, fix = cells[2], cells[3], cells[4], cells[5]
                title = ev or imp
            elif len(cells) >= 3:
                loc, ev, imp, fix = "", "", "", ""
                title = cells[2]
            else:
                continue
            findings.append({
              "section": norm_sec(fid) or sec or "UNASSIGNED", "finding_id": fid,
              "severity": sev, "severity_raw": cells[1] if len(cells)>1 else "",
              "category": "", "title": title, "evidence": ev, "impact": imp, "fix": fix,
              "attack": "", "defense": "", "verdict": "", "location": loc, "justification": "",
              "confidence": None, "rewrite_needed": None, "prior_knowledge": "", "cross_section": "",
              "list_key": lk+" (row)", "origin": origin, "source_file": path})

ELEMENT_MARKERS = {"locator","current_content","current_excerpt","element_id","paragraph_id",
                   "component_id","improved_content","improved_version","current"}

def ingest_strlists(node, path, origin, sec):
    # Inside an element record, "issues"/"problems" are per-element annotations that the
    # element inventory already carries - not standalone section findings.
    ks = set(node)
    in_element = bool(ELEMENT_MARKERS & ks) or any(
        k.startswith(("current_", "improved_", "locator")) or k in ("artifact", "paragraph", "component")
        for k in ks)
    for lk in PROSE_LISTS:
        if in_element and lk in ("issues","problems","findings"): continue
        v = node.get(lk)
        if not (isinstance(v, list) and v and all(isinstance(x, str) for x in v)): continue
        for item in v:
            txt = item.strip()
            if not txt: continue
            if ID_RE.match(txt):
                xrefs.append({"section": norm_sec(txt) or sec or "UNASSIGNED",
                              "finding_id": txt, "role": lk,
                              "source_file": path, "origin": origin})
            else:
                findings.append({
                  "section": sec or "UNASSIGNED", "finding_id": "",
                  "severity": "P0" if ("high_severity" in lk or "critical" in lk) else "UNSPEC",
                  "severity_raw": "", "category": lk, "title": txt,
                  "evidence": "", "impact": "", "fix": "", "attack": "", "defense": "",
                  "verdict": "", "location": "", "justification": "",
                  "confidence": None, "rewrite_needed": None,
                  "prior_knowledge": "", "cross_section": "",
                  "list_key": lk+" (prose)", "origin": origin, "source_file": path})
declared=collections.defaultdict(list)   # section -> declared severity_counts

BARE_ID = re.compile(r'^S\d{1,2}[-_][FUX]\d{1,3}$', re.I)

def ingest_bare(node, path, origin, sec_hint):
    """A scanned object that is itself a finding record, with no enclosing list key."""
    fid = str(node.get("id") or node.get("finding_id") or "").strip()
    if not BARE_ID.match(fid): return False
    if not ({"severity","evidence","summary","impact","title","problem","issue","why",
             "repair","fix","minimal_fix","actual_problem"} & set(node)): return False
    findings.append({
      "section": norm_sec(fid) or sec_hint or "UNASSIGNED", "finding_id": fid,
      "severity": norm_sev(pick(node,A["severity"]), path),
      "severity_raw": pick(node,A["severity"]), "category": pick(node,A["category"]),
      "title": pick(node,A["title"]), "evidence": pick(node,A["evidence"]),
      "impact": pick(node,A["impact"]), "fix": pick(node,A["fix"]),
      "attack": pick(node,A["attack"]), "defense": pick(node,A["defense"]),
      "verdict": pick(node,A["verdict"]), "location": pick(node,A["location"]),
      "justification": pick(node,A["justification"]),
      "confidence": node.get("confidence"), "rewrite_needed": node.get("rewrite_needed"),
      "prior_knowledge": pick(node,["expected_prior_knowledge"]),
      "cross_section": pick(node,["cross_section_dependency"]),
      "edge": pick(node,["edge"]),
      "list_key": "bare-object", "origin": origin, "source_file": path})
    return True

def ingest(node, path, origin, sec_hint, depth=0):
    if depth>14 or not isinstance(node,dict): return
    if depth==0: ingest_bare(node, path, origin, sec_hint)
    sec = file_section(node, path) or sec_hint
    if sec_hint and sec_hint != sec and not node.get("section"): sec = sec_hint
    if isinstance(node.get("severity_counts"),dict):
        declared[sec].append({"file":path,"counts":node["severity_counts"]})
    for lk in FINDING_LISTS + ["finding"]:
        v=node.get(lk)
        if isinstance(v,dict) and ("severity" in v or "evidence" in v): v=[v]
        if isinstance(v,list):
            for it in v:
                if not isinstance(it,dict): continue
                fid=pick(it,A["id"]); title=pick(it,A["title"])
                if not (fid or title): continue
                findings.append({
                  "section": norm_sec(it.get("section")) or norm_sec(fid) or sec or "UNASSIGNED",
                  "finding_id": fid, "severity": norm_sev(pick(it,A["severity"]), path),
                  "severity_raw": pick(it,A["severity"]),
                  "category": pick(it,A["category"]), "title": title,
                  "evidence": pick(it,A["evidence"]), "impact": pick(it,A["impact"]),
                  "fix": pick(it,A["fix"]), "attack": pick(it,A["attack"]),
                  "defense": pick(it,A["defense"]), "verdict": pick(it,A["verdict"]),
                  "location": pick(it,A["location"]), "justification": pick(it,A["justification"]),
                  "confidence": it.get("confidence"), "rewrite_needed": it.get("rewrite_needed"),
                  "prior_knowledge": pick(it,["expected_prior_knowledge"]),
                  "cross_section": pick(it,["cross_section_dependency"]),
                  "list_key": lk, "origin": origin, "source_file": path})
    for lk in REJECT_LISTS:
        v=node.get(lk)
        if isinstance(v,list):
            for it in v:
                if not isinstance(it,dict): continue
                rejects.append({"section": norm_sec(it.get("section")) or sec or "UNASSIGNED",
                  "finding_id": pick(it,A["id"]), "title": pick(it,A["title"]),
                  "verdict": pick(it,A["verdict"]), "reason": pick(it,A["justification"]),
                  "list_key": lk, "origin": origin, "source_file": path})
    for lk in ELEMENT_LISTS:
        v=node.get(lk)
        if isinstance(v,list):
            for it in v:
                if not isinstance(it,dict): continue
                fids=it.get("finding_ids") or it.get("issue_ids") or it.get("suspected_issue_ids") or []
                if isinstance(fids,str): fids=[fids]
                elements.append({"section": sec or "UNASSIGNED",
                  "element_id": pick(it,A["id"]), "list_key": lk,
                  "status": pick(it,A["verdict"]), "location": pick(it,A["location"]),
                  "finding_ids": [str(x) for x in fids],
                  "has_rewrite": bool(it.get("improved_content") or it.get("improved_version") or it.get("improved_text")),
                  "source_file": path, "origin": origin})
    for lk in TEST_LISTS:
        v=node.get(lk)
        if isinstance(v,list):
            for it in v:
                if isinstance(it,dict):
                    tests.append({"section":sec or "UNASSIGNED","list_key":lk,
                      "name":pick(it,A["title"]),"result":pick(it,["result","observed","current_result"]),
                      "expected":pick(it,["expected","expected_contract","canonical_result"]),
                      "source_file":path,"origin":origin})
        elif isinstance(v,dict):
            for name,it in v.items():
                if isinstance(it,dict):
                    tests.append({"section":sec or "UNASSIGNED","list_key":lk,"name":name,
                      "result":pick(it,["current_result","result","observed","theory_result"]),
                      "expected":pick(it,["expected"]),"source_file":path,"origin":origin})
    ingest_strlists(node, path, origin, sec)
    ingest_rows(node, path, origin, sec)
    for k,v in node.items():
        khint = norm_sec(k) or sec
        if isinstance(v,dict): ingest(v,path,origin,khint,depth+1)
        elif isinstance(v,list):
            for x in v:
                if isinstance(x,dict): ingest(x,path,origin,khint,depth+1)

_dec = json.JSONDecoder()
def scan_objs(text):
    i = 0
    while True:
        j = text.find('{', i)
        if j < 0: return
        try:
            obj, end = _dec.raw_decode(text, j)
            if isinstance(obj, dict): yield obj
            i = end if end > j else j + 1
        except ValueError:
            i = j + 1

def conversation_docs():
    """Findings discussed in the exported chats that were never written to the audit branch."""
    out = []
    for b in sorted(glob.glob(SP + "/blobs/*.txt")):
        raw = open(b, encoding="utf-8", errors="replace").read()
        if not re.search(r'"(id|finding_id)"\s*:\s*"S\d{1,2}[-_][FUX]', raw): continue
        rel = "conv:" + os.path.basename(b)
        # the blob's own dominant finding-id prefix is the best section hint available
        ids = collections.Counter(int(m) for m in re.findall(r'\bS(\d{1,2})[-_][FUX]\d', raw)
                                  if 1 <= int(m) <= 52)
        hint = f"S{ids.most_common(1)[0][0]:02d}" if ids else None
        for obj in scan_objs(raw):
            out.append((obj, rel, "conversation", hint))
            for v in obj.values():
                if isinstance(v, str) and len(v) > 200 and '"' in v:
                    for sub in scan_objs(v): out.append((sub, rel, "conversation", hint))
    return out

def load_all():
    out=[]
    for f in sorted(glob.glob(SP+"/branch/**/*.json",recursive=True)):
        out.append((json.load(open(f,encoding="utf-8")), os.path.relpath(f,SP+"/branch"), "audit-branch"))
    for f in sorted(glob.glob(SP+"/x/*/artifacts/**/*.json",recursive=True)):
        out.append((json.load(open(f,encoding="utf-8")), "zip:"+os.path.relpath(f,SP+"/x"), "zip-artifact"))
    return out

DOCS = [(d, r, o, None) for d, r, o in load_all()] + conversation_docs()
for d, rel, origin, _hint in DOCS:
    acc=set(); scan_vocab(d, acc)
    has_p = any(re.search(r'\bP[012]\b', v) for v in acc)
    has_w = any(w in v for v in acc for w in ("CRITICAL","HIGH","MEDIUM","LOW"))
    FILE_VOCAB[rel] = "CHML" if (has_w and not has_p) else "P"
print("files using critical/high/medium vocabulary:",
      sum(1 for v in FILE_VOCAB.values() if v=="CHML"), "of", len(FILE_VOCAB))
for d, rel, origin, hint in DOCS:
    ingest(d, rel, origin, file_section(d, rel) or hint)

for name,data in (("findings",findings),("rejects",rejects),("elements",elements),
                  ("tests",tests),("xrefs",xrefs),("declared",dict(declared))):
    json.dump(data, open(f"{SP}/audits/{name}.json","w"), ensure_ascii=False)

print("findings:",len(findings),"| rejects:",len(rejects),
      "| elements:",len(elements),"| tests:",len(tests),"| xrefs:",len(xrefs))
print("sections with findings:", len({f['section'] for f in findings}))
print("UNASSIGNED findings:", sum(1 for f in findings if f['section']=='UNASSIGNED'))
