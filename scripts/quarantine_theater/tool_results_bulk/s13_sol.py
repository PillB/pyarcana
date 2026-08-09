
# ========== S13 ==========

def s13_selfcheck(persona: str):
    if persona == "explorer":
        return [
            sc(0, 0, "entity_resolution_score y relationship_signal_score se mantienen separados en la ficha."),
            sc(1, 2, "False positive de ER es error de matching, no veredicto legal de fraude."),
            sc(2, 3, "Zona gris: encolar needs_review / abstenerse segun politica."),
            sc(3, 1, "CF-1 incluye privacy sheet, acceso, tests, demo y runbook."),
            sc(4, 0, "Level-1 regression notes: re-chequear paths criticos S01-S13 en runbook."),
        ]
    return [
        sc(0, 0, "Dashboard no fusiona ER y rel en un solo numero sin etiqueta."),
        sc(1, 2, "FP != fraude confirmado."),
        sc(2, 3, "Politica de abstencion/revision en banda gris."),
        sc(3, 1, "Checklist CF-1 del cierre de nivel."),
        sc(4, 0, "Regresion de nivel 1 documentada, sin editar ledger aqui."),
    ]

def s13_exercises(persona: str):
    A = persona == "explorer"
    out = []
    out.append(ex('S13-T1-A-E1', 'import re\ndef norm_name(n):\n    return re.sub(r"\\s+", " ", n.casefold().strip())\ndef norm_doc(d):\n    return re.sub(r"[^a-z0-9]", "", d.casefold())\nprint(norm_name("  Ana   Quispe "), norm_doc("D-12.34"))\n', 'norm_name y norm_doc: ana quispe / d1234.' if A else 'blocking prep.', ['norm']))
    out.append(ex('S13-T1-A-E2', 'def blocking_key(rec):\n    ap = rec["name"].casefold().strip().split()[-1]\n    return f"{ap}|{rec[\'region\'].casefold()}"\nprint(blocking_key({"name": "Luis Huamán", "region": "Cusco"}))\n', 'blocking apellido|region.' if A else 'huamán|cusco.', ['blocking']))
    out.append(ex('S13-T1-A-E3', 'import re\ndef norm_doc(d):\n    return re.sub(r"[^a-z0-9]", "", d.casefold())\ndef block_key(r):\n    ap = r["name"].casefold().strip().split()[-1]\n    return f"{ap}|{r[\'region\'].casefold()}"\ndef er_score(a, b):\n    if norm_doc(a["document_id"]) == norm_doc(b["document_id"]) and block_key(a) == block_key(b):\n        return 1.0\n    if block_key(a) == block_key(b):\n        return 0.5\n    return 0.0\na = {"name": "Ana Quispe", "document_id": "D-12.34", "region": "Lima"}\nb = {"name": "ANA QUISPE", "document_id": "d1234", "region": "Lima"}\nc = {"name": "Ana Quispe", "document_id": "Z9", "region": "Lima"}\nd = {"name": "Luis Rojas", "document_id": "Z9", "region": "Cusco"}\nprint(er_score(a, b), er_score(a, c), er_score(a, d))\n', '1.0 mismo doc+block; 0.5 solo block; 0.0 else.' if A else 'ER determinista.', ['ER']))
    out.append(ex('S13-T1-B-E1', 'tp, fp, fn = 8, 2, 2\nprecision = tp / (tp + fp)\nrecall = tp / (tp + fn)\nprint(round(precision, 1), round(recall, 1))\n', 'precision y recall 0.8.' if A else 'metricas etiquetadas.', ['P/R']))
    out.append(ex('S13-T1-B-E2', 'pairs = [\n    {"id": "P1", "score": 0.2},\n    {"id": "P2", "score": 0.55},\n    {"id": "P3", "score": 0.7},\n    {"id": "P4", "score": 0.9},\n]\ndef clerical_queue(pairs, low=0.4, high=0.7):\n    return [p["id"] for p in pairs if low <= p["score"] <= high]\nprint(clerical_queue(pairs))\n', 'cola clerical P2 P3 banda 0.4-0.7.' if A else 'incluye fronteras.', ['clerical']))
    out.append(ex('S13-T1-B-E3', 'note = "Un false positive de ER es error de matching; no es veredicto legal de fraude."\ndecision = "needs_review"\nprint(note)\nprint(decision)\n', 'texto + needs_review.' if A else 'FP != fraude.', ['FP']))
    out.append(ex('S13-T2-A-E1', 'def shared_email(a, b):\n    return bool(a.get("email") and a.get("email") == b.get("email"))\nprint(shared_email({"email": "a@x.com"}, {"email": "a@x.com"}))\nprint(shared_email({"email": "a@x.com"}, {"email": "b@x.com"}))\nprint(shared_email({"email": None}, {"email": "a@x.com"}))\n', 'True False False shared email.' if A else 'requiere ambos presentes e iguales.', ['shared']))
    out.append(ex('S13-T2-A-E2', 'def rel_score(km, surname_jaccard):\n    geo = 1.0 if km <= 2 else 0.0\n    return round(0.5 * geo + 0.5 * surname_jaccard, 1)\nprint(rel_score(1.2, 1.0), rel_score(5.0, 0.4))\n', '0.8 y 0.2 aproximados.' if A else 'mezcla geo + apellido.', ['rel_score']))
    out.append(ex('S13-T2-A-E3', 'print("relationship_signal_score es evidencia, no parentesco legal ni fraude")\n', 'frase de disclaimer del paquete.' if A else 'senal != veredicto.', ['disclaimer']))
    out.append(ex('S13-T2-B-E1', 'txs = [("A","B",10), ("C","D",1), ("B","A",5)]\ndef direct_txs(txs, a, b):\n    return [amt for x, y, amt in txs if {x, y} == {a, b}]\nprint(direct_txs(txs, "A", "B"))\n', 'montos directos [10,5].' if A else 'pares no dirigidos.', ['direct_tx']))
    out.append(ex('S13-T2-B-E2', 'txs = [("A","D",1), ("C","D",1), ("A","E",1), ("C","F",1)]\ndef neighbors(txs, node):\n    s = set()\n    for x, y, _ in txs:\n        if x == node:\n            s.add(y)\n        if y == node:\n            s.add(x)\n    return s\nprint(sorted(neighbors(txs, "A") & neighbors(txs, "C")))\n', "contraparte comun ['D']." if A else 'interseccion vecinos.', ['common']))
    out.append(ex('S13-T2-B-E3', 'print("disclaimer1: txs no prueban parentesco")\nprint("disclaimer2: grafo es evidencia operacional sintetica")\n', 'dos disclaimers.' if A else 'limites de inferencia.', ['disclaimer']))
    out.append(ex('S13-T3-A-E1', 'def explanation_bullets(er, rel, missing):\n    return [\n        f"entity_resolution_score={er}",\n        f"relationship_signal_score={rel}",\n        f"missing={missing or \'none\'}",\n    ]\nprint(len(explanation_bullets(0.9, 0.4, ["email"])))\n', 'lista len 3 explicativa.' if A else 'ER y rel separados.', ['explain']))
    out.append(ex('S13-T3-A-E2', 'def uncertainty_band(missing, conflict):\n    if conflict or len(missing) >= 2:\n        return "high"\n    if missing:\n        return "med"\n    return "low"\nprint(uncertainty_band([], False), uncertainty_band(["e"], False),\n      uncertainty_band(["e","p"], False), uncertainty_band([], True))\n', 'low med high high.' if A else 'missing/conflict.', ['uncertainty']))
    out.append(ex('S13-T3-A-E3', 'er, rel = 0.9, 0.1\nconflict = abs(er - rel) > 0.5\nevidence_score = round(0.6 * er + 0.4 * rel, 2)\nunc = "high" if conflict else "low"\nprint("score", evidence_score, unc)\n', 'score 0.58 high por conflicto ER vs rel.' if A else 'incertidumbre.', ['blend']))
    out.append(ex('S13-T3-B-E1', 'thresholds = {"accept_min": 0.8, "review_low": 0.4}\nprint(sorted(thresholds.items()))\nassert 0 <= thresholds["review_low"] < thresholds["accept_min"] <= 1\n', 'sorted items umbrales.' if A else 'invariante orden.', ['thresholds']))
    out.append(ex('S13-T3-B-E2', 'from math import isfinite\nth = {"accept_min": 0.8, "review_low": 0.4}\ndef decide_ops_status(score, unc, th):\n    if isinstance(score, bool) or not isinstance(score, (int, float)):\n        return "invalid_input"\n    if not isfinite(score) or not 0.0 <= score <= 1.0 or unc not in {"low", "med", "high"}:\n        return "invalid_input"\n    if unc == "high":\n        return "needs_review"\n    if score < th["review_low"]:\n        return "abstain"\n    if score < th["accept_min"]:\n        return "needs_review"\n    return "accept_pair"\nfor s, u in [(-0.1, "low"), (0.399, "low"), (0.4, "low"), (0.799, "low"), (0.8, "low"), (1.0, "low"), (0.9, "high")]:\n    print(s, u, decide_ops_status(s, u, th))\n', 'matriz invalid/abstain/review/accept.' if A else 'high fuerza review.', ['decide']))
    out.append(ex('S13-T3-B-E3', 'card = {"score": 0.85, "status": "accept_pair"}\nprint(sorted(card.keys()))\n', 'claves score y status.' if A else 'ficha operativa.', ['card']))
    out.append(ex('S13-T4-A-E1', 'def pseudonymize(name):\n    return " ".join(p[0] + "***" for p in name.split() if p)\nprint(pseudonymize("Ana Quispe Rojas"))\n', 'A*** Q*** R***.' if A else 'dashboard sin nombre claro.', ['pseudo']))
    out.append(ex('S13-T4-A-E2', 'def case_sheet(er, rel):\n    return {\n        "entity_resolution_score": er,\n        "relationship_signal_score": rel,\n    }\nprint(sorted(case_sheet(0.9, 0.4).keys()))\n', 'dos claves distintas ER y rel.' if A else 'no fusionar.', ['sheet']))
    out.append(ex('S13-T4-A-E3', 'def map_tooltip(lat, lon, km, source):\n    return f"lat={lat}; lon={lon}; geo_distance_km={km}; source={source}"\nprint(map_tooltip(-12.04, -77.04, 1.2, "mock"))\n', 'tooltip con source=mock.' if A else 'geo explicable.', ['tooltip']))
    out.append(ex('S13-T4-B-E1', 'privacy = {\n    "data_class": "synthetic_only",\n    "pii_real": False,\n    "roles": ["viewer", "reviewer"],\n}\nprint(sorted(privacy.keys()), privacy["pii_real"])\n', 'keys privacy + pii_real False.' if A else 'CF-1 sheet.', ['privacy']))
    out.append(ex('S13-T4-B-E2', 'def demo_command():\n    return "python -m demo_n1_dashboard"\nprint(demo_command())\n', 'comando unico de demo.' if A else 'runbook CF-1.', ['demo']))
    out.append(ex('S13-T4-B-E3', 'actions = ["rotate_secret", "redact_logs", "postmortem"]\nprint(actions)\nprint("level-1 regression: re-check critical paths S01-S13 in runbook (no ledger edit here)")\n', '3 acciones incidente + nota regresion.' if A else 'cierre de nivel.', ['runbook']))
    return out
