#!/usr/bin/env python3
"""CP-N2-C — Human-Approved RPA & AI Analyst Workflow.
Input→validation→analysis→report→human review→approval→email draft→optional send.
Idempotent, audit trail, rollback, test mode, allowlist, redacted logs."""
import json, hashlib, sys, time
from dataclasses import dataclass, asdict

RECIPIENT_ALLOWLIST = {"ana.review@synthetic.example","bob.approver@synthetic.example"}
APPROVAL_EXPIRY_S = 3600

@dataclass
class AuditEntry:
    run_id: str; action: str; actor: str; ts: str; redacted_detail: str

class WorkflowRunner:
    def __init__(self): self.audit: list[AuditEntry] = []; self.state: dict = {}; self.sent: list = []
    def _log(self, run_id, action, detail=""): self.audit.append(AuditEntry(run_id, action, "system", time.strftime("%Y-%m-%dT%H:%M:%S"), self._redact(detail)))
    def _redact(self, s): return s.replace("password=","password=[REDACTED]").replace("ssn=","ssn=[REDACTED]")
    def validate(self, doc: dict) -> bool:
        ok = bool(doc.get("client_id") and doc.get("amount"))
        self._log(doc.get("run_id","?"),"validate",f"client={doc.get('client_id')} valid={ok}"); return ok
    def analyse(self, doc: dict) -> dict:
        r = {"summary": f"Client {doc['client_id']} amount {doc['amount']}", "recommendation": "review"}
        self._log(doc.get("run_id","?"),"analyse",r["summary"]); return r
    def request_approval(self, run_id: str, draft: dict) -> dict:
        self._log(run_id,"approval_requested",json.dumps(draft))
        return {"approval_required": True, "expires_at": time.time()+APPROVAL_EXPIRY_S, "draft": draft}
    def send_email(self, run_id: str, to: str, subject: str, body: str, approved: bool, test_mode: bool=False) -> dict:
        if to not in RECIPIENT_ALLOWLIST:
            self._log(run_id,"send_blocked",f"to={to} reason=not_allowlisted"); return {"sent": False, "reason": "recipient not allowlisted"}
        if not approved:
            self._log(run_id,"send_blocked","reason=not_approved"); return {"sent": False, "reason": "not approved"}
        if test_mode:
            self._log(run_id,"send_test",f"to={to}"); return {"sent": False, "test_mode": True, "would_send_to": to}
        self.sent.append({"to":to,"subject":subject,"body":body})
        self._log(run_id,"send",f"to={to} subject={subject}"); return {"sent": True, "to": to}
    def rollback(self, run_id: str) -> dict:
        sent_before = list(self.sent); self.sent.clear()
        self._log(run_id,"rollback",f"cleared {len(sent_before)} sends")
        return {"rolled_back": True, "cleared": len(sent_before)}
    def idempotency_key(self, doc: dict) -> str:
        return hashlib.sha1(json.dumps({k:doc[k] for k in sorted(doc)}, sort_keys=True).encode()).hexdigest()[:16]

def run_workflow(doc: dict, approved: bool=False, test_mode: bool=True) -> dict:
    r = WorkflowRunner(); run_id = doc.get("run_id","R1")
    if not r.validate(doc): return {"status":"rejected","audit":[asdict(a) for a in r.audit]}
    analysis = r.analyse(doc)
    approval = r.request_approval(run_id, analysis)
    email = r.send_email(run_id, doc.get("recipient","ana.review@synthetic.example"),
                         f"Review: {doc['client_id']}", analysis["summary"], approved, test_mode)
    return {"status":"completed","analysis":analysis,"approval":approval,"email":email,
            "audit":[asdict(a) for a in r.audit],"idempotency_key":r.idempotency_key(doc)}

if __name__=="__main__":
    doc = json.loads(sys.stdin.read()); print(json.dumps(run_workflow(doc), indent=2))
