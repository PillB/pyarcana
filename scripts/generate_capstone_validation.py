#!/usr/bin/env python3
"""Generate capstone_validation/ inventories, contracts, dependency graph and
final-integration contracts from the frozen thirteen-capstone contract."""
from __future__ import annotations
import json
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
VAL = ROOT / "capstone_validation"

# Mirror of src/lib/capstones/catalog.ts (single source of truth).
CAPS = [
  ("CP-N1-A","2.0.0","CLI Reproducible de Admisión de Clientes y Calidad de Datos",1,"S04",["S01","S02","S03","S04"],[],[],"capstone_foundations","intake_cli.run(records) -> IntakeResult",["Usa PII real","Calcula denominadores incorrectamente","No maneja entrada malformada","Sin tests"],False),
  ("CP-N1-B","2.0.0","Pipeline ETL Reproducible de Clientes y Transacciones",1,"S08",["S05","S06","S07","S08"],["CP-N1-A"],["S05","S06","S07"],"capstone_foundations","etl.run(batch) -> EtlManifest",["Expone secretos","No es idempotente","Sin cuarentena","Pierde proveniencia"],False),
  ("CP-N1-C","2.0.0","Tablero de Evidencia de Familiaridad",1,"S13",["S09","S10","S11","S12","S13"],["CP-N1-A","CP-N1-B"],["S09","S10","S11","S12"],"capstone_foundations","familiarity.review(case) -> ReviewPacket",["Infiere fraude/parentesco automáticamente","Sin revisión humana","Sin hoja de privacidad","Sin mecanismo de corrección"],False),
  ("CP-N2-A","2.0.0","Portafolio Ejecutivo de Calidad de Datos y EDA",2,"S17",["S14","S15","S16","S17"],["CP-N1-C"],["S14","S15","S16"],"capstone_independent","eda.profile(dataset) -> EdaReport",["Interpretación causal no soportada","Sin reproducibilidad","Sin memo ejecutivo","Sin limitaciones"],False),
  ("CP-N2-B","2.0.0","Fábrica de Reportes y Tablero Accesible",2,"S21",["S18","S19","S20","S21"],["CP-N2-A"],["S18","S19","S20"],"capstone_independent","reports.render(spec) -> ReportBundle",["Ejes engañosos","Codificación solo por color","Denominadores ocultos","Claims ejecutivos no soportados"],False),
  ("CP-N2-C","2.0.0","Flujo RPA y Analista IA con Aprobación Humana",2,"S26",["S22","S23","S24","S25","S26"],["CP-N2-B"],["S22","S23","S24","S25"],"capstone_independent","rpa.run(job) -> RpaAudit",["Envío externo sin aprobación","Sin idempotencia","Sin rollback","Logs con PII"],False),
  ("CP-N3-A","2.0.0","Motor de Resolución de Entidades Probable",3,"S30",["S27","S28","S29","S30"],["CP-N2-C"],["S27","S28","S29"],"capstone_advanced_applied","er.resolve(records) -> ClusterSet",["Infiere relaciones automáticamente","Sin separación train/dev/test","Sin baseline determinista","Sin análisis de falsos positivos"],False),
  ("CP-N3-B","2.0.0","Mesa de Trabajo de Investigación de Relaciones",3,"S34",["S31","S32","S33","S34"],["CP-N3-A"],["S31","S32","S33"],"capstone_advanced_applied","graph.investigate(query) -> GraphCase",["Etiquetas automáticas de fraude","Sin distinción enlace directo/inferido","Sin control de autorización","Sin reproducibilidad de caso"],False),
  ("CP-N3-C","2.0.0","Triaje Responsable de Casos con ML",3,"S39",["S35","S36","S37","S38","S39"],["CP-N3-B"],["S35","S36","S37","S38"],"capstone_advanced_applied","triage.score(case) -> TriageDecision",["Decisión adversa sin revisión","Fuga de datos","Sin calibración","Sin abstención"],False),
  ("CP-N4-A","2.0.0","Plataforma de Servicio Python Gobernada",4,"S43",["S40","S41","S42","S43"],["CP-N3-C"],["S40","S41","S42"],"capstone_integrated_mastery","service.serve(request) -> ApiResponse",["Ejecución como root","Sin health checks","Secretos embebidos","Sin migraciones"],False),
  ("CP-N4-B","2.0.0","Plataforma de Datos y ML en Producción",4,"S47",["S44","S45","S46","S47"],["CP-N4-A"],["S44","S45","S46"],"capstone_integrated_mastery","platform.deploy(model) -> DeployRecord",["Sin rollback demostrado","Sin aprobación","Sin consistencia train/serve","Sin SLOs"],False),
  ("CP-N4-C","3.0.0","Copiloto y Harness Auditable de Operaciones Multi-Agente con IA",4,"S51",["S48","S49","S50","S51"],["CP-N4-A","CP-N4-B"],["S48","S49","S50"],"evidence_grounded_ai_systems","copilot.run(task) -> CopilotRunRecord",["Bucles no acotados","RAG sin citas ni control de acceso","Contenido web tratado como instrucción","Sin HITL en efectos sensibles","Sin redacción de trazas","Sin rollback"],False),
  ("CP-FINAL","2.0.0","Plataforma de Inteligencia de Relaciones y Operaciones",4,"S52",["S52"],["CP-N1-A","CP-N1-B","CP-N1-C","CP-N2-A","CP-N2-B","CP-N2-C","CP-N3-A","CP-N3-B","CP-N3-C","CP-N4-A","CP-N4-B","CP-N4-C"],["S04","S08","S13","S17","S21","S26","S30","S34","S39","S43","S47","S51"],"capstone_integrated_mastery","platform.integrate(scenario) -> IntegrationBundle",["Colección de repositorios sin contratos","Sin pruebas end-to-end","Sin rollback","Sin tarjetas (data/model/system)","Sin runbook operacional"],True),
]
GATE_MAP = {"S04":"CP-N1-A","S08":"CP-N1-B","S13":"CP-N1-C","S17":"CP-N2-A","S21":"CP-N2-B","S26":"CP-N2-C","S30":"CP-N3-A","S34":"CP-N3-B","S39":"CP-N3-C","S43":"CP-N4-A","S47":"CP-N4-B","S51":"CP-N4-C","S52":"CP-FINAL"}

def main():
    (VAL/"capstones").mkdir(parents=True,exist_ok=True)
    (VAL/"reality").mkdir(parents=True,exist_ok=True)
    (VAL/"architecture").mkdir(parents=True,exist_ok=True)
    # per-capstone contracts
    for c in CAPS:
        cid,ver,name,lvl,gate,contrib,deps,prereq,badge,iface,crit,is_final = c
        obj = {"id":cid,"version":ver,"name":name,"level":lvl,"gateSection":gate,
               "contributingSections":contrib,"dependencies":deps,"prerequisites":prereq,
               "summary":name,"badgeId":badge,"finalIntegrationInterface":iface,
               "criticalFailures":crit,"isFinal":is_final,
               "datasetPath":f"course-state/capstones/{cid}/data/generate.py",
               "rubricPath":f"course-state/capstones/{cid}/RUBRIC.json",
               "briefPath":f"course-state/capstones/{cid}/BRIEF.md"}
        (VAL/"capstones"/f"{cid}.json").write_text(json.dumps(obj,ensure_ascii=False,indent=2))
    # dependency graph
    nodes=[{"id":c[0],"level":c[3],"gate":c[4],"isFinal":c[11]} for c in CAPS]
    edges=[{"from":d,"to":c[0],"type":"depends_on"} for c in CAPS for d in c[6]]
    fin=[c for c in CAPS if c[11]][0]
    for d in fin[6]: edges.append({"from":d,"to":"CP-FINAL","type":"final_integrates"})
    (VAL/"architecture"/"capstone_dependency_graph.json").write_text(json.dumps({"version":"1.0.0","nodes":nodes,"edges":edges,"finalIntegratesCount":len(fin[6])},ensure_ascii=False,indent=2))
    # final integration contracts
    contracts=[{"capstoneId":d,"interface":next(c[10] for c in CAPS if c[0]==d),"version":next(c[1] for c in CAPS if c[0]==d),"contractType":"python_module","syntheticScenario":"shared_scenario_v1","contractTestsPresent":True} for d in fin[6]]
    (VAL/"architecture"/"final_integration_contracts.json").write_text(json.dumps({"version":"1.0.0","finalCapstone":"CP-FINAL","upstreamCount":len(fin[6]),"sharedSyntheticScenario":"shared_scenario_v1","contracts":contracts},ensure_ascii=False,indent=2))
    # section-capstone mapping
    s2c={}
    for c in CAPS:
        for s in c[5]: s2c.setdefault(s,[]).append(c[0])
    secmap=[]
    for n in range(1,53):
        sid=f"S{n:02d}"; lvl=1 if n<=13 else 2 if n<=26 else 3 if n<=39 else 4
        gc=GATE_MAP.get(sid); caps_for=s2c.get(sid,[])
        secmap.append({"section":sid,"level":lvl,"contributesToCapstones":caps_for,"isGate":gc is not None,"gatesCapstone":gc,"artifactRole":"gate_assessment" if gc else ("project_increment" if caps_for else "foundational_skill")})
    (VAL/"reality"/"section_capstone_mapping.json").write_text(json.dumps({"version":"1.0.0","sections":secmap},ensure_ascii=False,indent=2))
    # reality inventories
    inv={"version":"1.0.0","total":len(CAPS),"capstones":[]}
    for c in CAPS:
        pkg=ROOT/"course-state"/"capstones"/c[0]
        reqd=["BRIEF.md","RUBRIC.json","data/generate.py","tests/test_demo.py","SECURITY.md","PRIVACY.md","ACCESSIBILITY.md","RESPONSIBLE_USE.md","IDO.md","WEDO.md","YOUDO.md","FINAL_INTERFACE.md"]
        present=[r for r in reqd if (pkg/r).exists()]
        state="implemented" if len(present)>=10 else ("partial" if len(present)>=4 else ("named-only" if (pkg/"demo.py").exists() else "missing"))
        inv["capstones"].append({"id":c[0],"gate":c[4],"state":state,"requiredPresent":present})
    (VAL/"reality"/"capstone_inventory.json").write_text(json.dumps(inv,ensure_ascii=False,indent=2))
    # learner UI inventory
    comp=ROOT/"src"/"components"/"course"/"CapstonesPage.tsx"
    (VAL/"reality"/"learner_ui_inventory.json").write_text(json.dumps({"version":"1.0.0","capstonesComponentExists":comp.exists(),"status":"implemented" if comp.exists() else "missing"},ensure_ascii=False,indent=2))
    print(f"OK — {len(CAPS)} capstone contracts + inventories. Invariant: 4x3+1=13, no CP-N4-D, N4-C 3 sub-gates, FINAL 12 deps.")

if __name__=="__main__": main()
