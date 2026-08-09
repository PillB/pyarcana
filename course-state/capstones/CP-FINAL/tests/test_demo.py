#!/usr/bin/env python3
"""CP-FINAL — tests normal/boundary/failure. Run: python3 tests/test_demo.py"""
from __future__ import annotations
import os, sys, subprocess, importlib

HERE = os.path.dirname(os.path.abspath(__file__))
PKG = os.path.dirname(HERE)
sys.path.insert(0, PKG)


def test_bundle_has_12_subsystems():
    from integration import platform as p, shared_scenario as s
    b = p.integrate(s.shared_scenario_v1)
    assert len(b.subsystem_results) == 12
    assert not b.no_go


def test_contract_compatibility():
    from integration import contracts
    from integration import platform as p, shared_scenario as s
    b = p.integrate(s.shared_scenario_v1)
    for cid, payload in b.subsystem_results.items():
        assert payload["contract_id"] == cid
        assert payload["contract_version"] == contracts.expected_contract_version(cid)


def test_e2e_trace_ordered():
    from integration import platform as p, shared_scenario as s, dependency_graph as dg
    b = p.integrate(s.shared_scenario_v1)
    order = [e["subsystem"] for e in b.end_to_end_trace]
    assert order == dg.upstream_order()


def test_evidence_bundle_complete():
    from integration import platform as p, shared_scenario as s
    b = p.integrate(s.shared_scenario_v1)
    ev = b.evidence_bundle
    for key in ("contracts", "trace", "dependency_graph", "cards", "reproducibility"):
        assert key in ev, key


def test_no_go_triggers_on_failure():
    import dataclasses
    from integration import platform as p, shared_scenario as s, no_go, dependency_graph as dg
    bad = {}
    for cid in dg.UPSTREAM_CAPSTONES:
        bad[cid] = p.SUBSYSTEM_RUNNERS[cid](p._build_subsystem_inputs(s.shared_scenario_v1)[cid])
    bad["CP-N3-A"] = dataclasses.replace(bad["CP-N3-A"], inferred_relationships=True)
    flag, reason = no_go.evaluate(bad)
    assert flag and "CP-N3-A" in reason


def test_rollback_proven():
    from integration import rollback as r
    proof = r.demonstrate_rollback()
    assert proof["rollback_proven"]


def test_backup_restore_roundtrip(tmp_path=None):
    import tempfile
    from integration import platform as p, shared_scenario as s, backup_restore as br
    b = p.integrate(s.shared_scenario_v1)
    with tempfile.TemporaryDirectory() as td:
        path = br.backup(b, td)
        restored = br.restore(path)
        assert restored["contract_id"] == "CP-FINAL"
        assert len(restored["subsystem_results"]) == 12


def test_reproducible():
    import json
    from integration import platform as p, shared_scenario as s, contracts as c
    a = json.dumps(c.to_jsonable(p.integrate(s.shared_scenario_v1)), sort_keys=True)
    b = json.dumps(c.to_jsonable(p.integrate(s.shared_scenario_v1)), sort_keys=True)
    assert a == b


def test_run_demo_exits_zero():
    r = subprocess.run([sys.executable, os.path.join(PKG, "demo.py")], capture_output=True, text=True)
    assert r.returncode == 0, f"demo exited {r.returncode}: {r.stderr}"
    assert "METRICS_JSON:" in r.stdout
    assert '"subsystem_count": 12' in r.stdout
    assert '"status": "pass"' in r.stdout


def main():
    tests = [v for k, v in sorted(globals().items()) if k.startswith("test_")]
    p = f = 0
    for t in tests:
        try:
            t(); print(f"  PASS  {t.__name__}"); p += 1
        except Exception as e:
            print(f"  FAIL  {t.__name__}: {e}"); f += 1
    print(f"\n{p} passed, {f} failed, {len(tests)} total")
    return 1 if f else 0


if __name__ == "__main__":
    sys.exit(main())
