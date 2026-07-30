#!/usr/bin/env python3
"""Stephen Fry Spanish redaction — round 1. Inline 'esto es, ...' glosses for
first occurrence per file. Idempotent. Stdlib only."""
from __future__ import annotations
import re, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
PKG = ROOT / "course-state" / "capstones"
GLOSSES = [
 (r"\bbaseline\b","baseline (esto es, una línea base: el resultado más simple y determinista contra el que se compara todo lo demás)"),
 (r"\bbenchmark\b","benchmark (esto es, un conjunto de pruebas etiquetadas para medir qué tan bien funciona un sistema)"),
 (r"\bcalibración\b","calibración (esto es, verificar que los puntajes del modelo correspondan a probabilidades reales)"),
 (r"\bumbral\b","umbral (esto es, el valor de corte: por encima se decide una cosa, por debajo otra)"),
 (r"\babstención\b","abstención (esto es, que el modelo diga 'no sé' en vez de adivinar cuando no está seguro)"),
 (r"\bidempoten(?:cia|te)\b","idempotente (esto es, que repetir la misma operación no cambie el resultado)"),
 (r"\bcuarentena\b","cuarentena (esto es, separar las filas que no cumplen el contrato para revisarlas)"),
 (r"\bproveniencia\b","proveniencia (esto es, de dónde viene cada dato: qué archivo, qué fuente, qué fecha)"),
 (r"\blineage\b","lineage (esto es, el linaje: el registro de qué dato derivó de qué otro)"),
 (r"\bmanifest\b","manifest (esto es, una lista firmada con hashes que describe exactamente qué salió del proceso)"),
 (r"\bManifest\b","Manifest (esto es, una lista firmada con hashes que describe exactamente qué salió del proceso)"),
 (r"\brollback\b","rollback (esto es, revertir: volver al estado anterior conocido-como-bueno cuando algo falla)"),
 (r"\bcanary\b","canary (esto es, liberar primero a un grupo pequeño y vigilarlo antes de soltar el cambio para todos)"),
 (r"\bshadow\b","shadow (esto es, correr el modelo nuevo en paralelo sin afectar a usuarios, solo para comparar)"),
 (r"\bSLOs?\b","SLO (esto es, un objetivo de nivel de servicio: la promesa medible de qué tan disponible o rápido debe estar el sistema)"),
 (r"\bhealth check\b","health check (esto es, un punto del servicio que responde 'estoy vivo y bien')"),
 (r"\bnon-root\b","non-root (esto es, ejecutar el proceso con un usuario sin privilegios)"),
 (r"\bRAG\b","RAG (esto es, Generación Aumentada por Recuperación: antes de responder, el sistema busca documentos y cita de dónde sacó cada afirmación)"),
 (r"\badapter\b","adapter (esto es, un adaptador: un pedazo de código que traduce entre nuestro formato y el de un proveedor de modelos)"),
 (r"\badaptadores\b","adaptadores (esto es, piezas que traducen entre nuestro formato y el de cada proveedor de modelos)"),
 (r"\bharness\b","harness (esto es, un arnés: la estructura que orquesta, limita y observa a los agentes mientras trabajan)"),
 (r"\bhandoffs?\b","handoff (esto es, un traspaso tipado entre roles: el generador entrega un artefacto y el verificador lo recibe con un contrato claro)"),
 (r"\bHITL\b","HITL (esto es, Human-In-The-Loop: un humano aprueba antes de que se ejecute una acción sensible)"),
 (r"\bACL\b","ACL (esto es, Lista de Control de Acceso: reglas que dicen qué documentos puede ver cada rol)"),
 (r"\bSERP\b","SERP (esto es, Search Engine Results Page: los resultados que devuelve un buscador; aquí se usan como datos con fuente, no como instrucciones)"),
 (r"\btrazas?\b","traza (esto es, el registro paso a paso de qué hizo el sistema, para poder auditarlo después)"),
 (r"\bspans?\b","span (esto es, un segmento de una traza: cuánto duró y qué hizo un solo paso)"),
 (r"\bsandbox(?:ing)?\b","sandboxing (esto es, ejecutar en un recinto aislado donde no puede tocar archivos ni redes reales)"),
 (r"\bdry-run\b","dry-run (esto es, simular la ejecución sin realizar efectos reales, para ver qué pasaría)"),
 (r"\bResolución de Entidades\b","Resolución de Entidades (esto es, decidir si dos registros hablan de la misma persona o cosa, agrupándolos sin afirmar relaciones personales)"),
 (r"\bgeofencing\b","geofencing (esto es, cercas geográficas: reglas que comparan si dos puntos están dentro de una zona, sin afirmar que las personas se conocen)"),
 (r"\bfingerprint\b","fingerprint (esto es, una huella del estado: un hash corto que identifica un paso, para detectar repeticiones)"),
 (r"\bfalsos positivos\b","falsos positivos (esto es, casos que el sistema marcó como coincidencia pero que un humano revisa y descarta)"),
]
def has_gloss(txt,gloss):
    marker=gloss[gloss.find("("):gloss.find(")")+1]; return bool(marker) and marker in txt
def redact_file(path):
    try: txt=path.read_text(encoding="utf-8")
    except: return 0
    original=txt; added=0
    for pat,gloss in GLOSSES:
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
    print(f"Stephen Fry round 1: {total} glosses added across {sum(1 for v in pf.values() if v)} files.")
    return 0
if __name__=="__main__": sys.exit(main())
