#!/usr/bin/env python3
"""Stephen Fry Spanish redaction — QUALITY round 2. Additional English terms.
Idempotent. Stdlib only."""
from __future__ import annotations
import re, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
PKG = ROOT / "course-state" / "capstones"
ADDITIONAL = [
 (r"\bfallback\b","fallback (esto es, un plan B: si el primer proveedor falla, se usa otro automáticamente)"),
 (r"\boutage\b","outage (esto es, una caída del servicio: el proveedor deja de responder)"),
 (r"\bretry\b","retry (esto es, reintentar: volver a intentar una operación que falló)"),
 (r"\bdeterministic\b","determinista (esto es, que dado el mismo input siempre produce el mismo output, sin azar)"),
 (r"\bgenerator\b","generador (esto es, el rol que produce una respuesta o artefacto propuesto)"),
 (r"\bverifier\b","verificador (esto es, el rol independiente que revisa lo que propuso el generador antes de aceptarlo)"),
 (r"\binjection\b","inyección (esto es, cuando un atacante mete instrucciones maliciosas dentro de datos para engañar al sistema)"),
 (r"\bprovenance\b","provenance (esto es, la trazabilidad: de dónde viene cada dato o resultado)"),
 (r"\btoken budget\b","token budget (esto es, el límite de cuántos tokens puede consumir una ejecución)"),
 (r"\bcost budget\b","cost budget (esto es, el límite de cuánto dinero puede costar una ejecución)"),
 (r"\btimeout\b","timeout (esto es, un tiempo máximo: si la operación no termina, se cancela)"),
 (r"\bdurable resume\b","durable resume (esto es, reanudar desde donde se quedó tras una interrupción, sin perder lo hecho)"),
 (r"\bholdout\b","holdout (esto es, un conjunto de pruebas que el sistema nunca vio durante el diseño, para evaluarlo sin trampa)"),
 (r"\btrajectory\b","trayectoria (esto es, la secuencia completa de pasos que siguió el agente, no solo el resultado final)"),
 (r"\bred-team(?:ing)?\b","red-team (esto es, equipo rojo: pruebas adversarias donde alguien intenta romper o engañar al sistema a propósito)"),
 (r"\bincident\b","incidente (esto es, un evento donde el sistema se comportó mal o se cayó, que se debe registrar y analizar)"),
 (r"\bleast privilege\b","mínimo privilegio (esto es, dar a cada pieza solo los permisos estrictamente necesarios, ni uno más)"),
 (r"\bcontract\b","contrato (esto es, un acuerdo explícito sobre qué datos entran y qué datos salen, para que las partes no se acoplen internamente)"),
 (r"\bsubsystem\b","subsistema (esto es, una parte independiente del sistema que se comunica con las demás solo por contratos)"),
 (r"\bdata card\b","data card (esto es, una tarjeta del dataset: documenta qué hay, de dónde viene, sus límites y usos permitidos)"),
 (r"\bmodel card\b","model card (esto es, una tarjeta del modelo: documenta qué hace, cómo se evaluó, sus límites y usos responsables)"),
 (r"\bsystem card\b","system card (esto es, una tarjeta del sistema: documenta el sistema completo, sus modos de fallo y sus salvaguardas)"),
 (r"\bthreat model\b","modelo de amenazas (esto es, un análisis de qué podría atacar al sistema y cómo, para diseñar defensas)"),
 (r"\brunbook\b","runbook (esto es, un manual de operaciones: qué hacer paso a paso cuando algo falla en producción)"),
 (r"\bno-go\b","no-go (esto es, condición de parada: si algo crítico falla, el sistema dice 'no proceder' en vez de seguir a medias)"),
 (r"\bdrift\b","drift (esto es, deriva: cuando los datos reales cambian con el tiempo y el modelo envejece)"),
 (r"\bsubgroup\b","subgrupo (esto es, un segmento de la población, para verificar que el sistema funcione bien en cada uno)"),
 (r"\bthreshold\b","threshold (esto es, un umbral: el valor de corte sobre el que se decide)"),
 (r"\bblocking\b","blocking (esto es, bloqueo: agrupar primero por una clave barata para no comparar todos con todos)"),
 (r"\bfuzzy\b","fuzzy (esto es, difuso: comparación que tolera errores de tipeo o variantes, no solo igualdad exacta)"),
]
def has_gloss(txt,gloss):
    marker=gloss[gloss.find("("):gloss.find(")")+1]; return bool(marker) and marker in txt
def redact_file(path):
    try: txt=path.read_text(encoding="utf-8")
    except: return 0
    original=txt; added=0
    for pat,gloss in ADDITIONAL:
        if has_gloss(txt,gloss): continue
        new,n=re.subn(pat,lambda m:gloss,txt,count=1,flags=re.IGNORECASE)
        if n>0: txt=new; added+=n
    if txt!=original: path.write_text(txt,encoding="utf-8")
    return added
def main():
    targets=[]
    for d in sorted(PKG.iterdir()):
        if not d.is_dir() or not d.name.startswith("CP-"): continue
        for name in ["BRIEF.md","IDO.md","WEDO.md","YOUDO.md","FINAL_INTERFACE.md","RESPONSIBLE_USE.md","SECURITY.md","PRIVACY.md","SUBGATES.md","SYSTEM_CARD.md","ARCHITECTURE.md","ACCESSIBILITY.md","RUN.md"]:
            p=d/name
            if p.exists(): targets.append(p)
    total=0; pf={}
    for t in targets:
        n=redact_file(t)
        if n: pf[str(t.relative_to(ROOT))]=n; total+=n
    print(f"Stephen Fry QUALITY round 2: {total} glosses added across {sum(1 for v in pf.values() if v)} files.")
    return 0
if __name__=="__main__": sys.exit(main())
