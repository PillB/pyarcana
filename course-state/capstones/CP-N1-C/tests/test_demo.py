#!/usr/bin/env python3
"""CP-N1-C: pruebas de tu cp_n1_c.py. Ejecuta:  python3 tests/test_demo.py

Cada valor esperado se calculó a mano desde BRIEF.md y data/generate.py, nunca copiando la salida
del código. Al principio fallan todas: cada fallo dice qué función escribir y qué regla mirar.
"""
import sys
from collections import Counter

from _select import LOCATION, caso, error_de, generate, impl

LIMA = [-12.0464, -77.0428]
NO_DICE = ("fraud", "parentesco", "familia", "family", "pariente")


def por_par(filas):
    return {f["pair_id"]: f for f in filas}


def todo_el_texto(valor, claves, textos):
    """Recorre dicts, listas y tuplas y junta sus claves y sus textos."""
    if isinstance(valor, dict):
        for k, v in valor.items():
            claves.append(k)
            todo_el_texto(v, claves, textos)
    elif isinstance(valor, (list, tuple)):
        for v in valor:
            todo_el_texto(v, claves, textos)
    elif isinstance(valor, str):
        textos.append(valor)


def test_01_documento_y_bloque():
    """regla 1: norm_doc unifica D-10.01 y d1001; el bloque es apellido paterno|región"""
    assert impl.norm_doc("D-10.01") == impl.norm_doc("d1001") == "d1001"
    assert impl.norm_doc(None) == ""
    assert impl.blocking_key({"name": "Ana Quispe Rojas", "region": "Lima"}) == "quispe|lima"
    assert impl.blocking_key({"name": "ANA  QUISPE", "region": "lima"}) == "quispe|lima"
    assert impl.blocking_key({"name": "Quispe", "region": "Cusco"}) == "quispe|cusco"
    assert impl.blocking_key({"name": "", "region": "Lima"}) is None
    assert impl.blocking_key({"name": "Ana Quispe", "region": None}) is None


def test_02_er_score_tres_valores_y_none():
    """regla 1: 1.0 mismo documento y bloque, 0.5 otro bloque, 0.0 otro documento, None sin evidencia"""
    p = {r["id"]: r for r in caso()["people"]}
    assert impl.er_score(p["P01"], p["P02"]) == 1.0
    assert impl.er_score(p["P01"], p["P03"]) == 0.5
    assert impl.er_score(p["P01"], p["P12"]) == 0.0, "el mismo bloque sin el mismo documento es 0.0"
    assert impl.er_score(p["P04"], p["P05"]) is None, "sin documento el score es None, no 0.0"
    assert impl.er_score(p["P05"], p["P04"]) is None


def test_03_senales_de_relacion():
    """regla 2: 0.5 teléfono + 0.3 cercanía + 0.2 Jaccard; un teléfono ausente no coincide"""
    p = {r["id"]: r for r in caso()["people"]}
    # El caso trabajado de S13 T2-A: teléfono, misma ubicación y Jaccard 1/5 = 0.2 → 0.84
    a = {"name": "Ana Quispe Rojas", "phone": "999111222", "coords": LIMA}
    b = {"name": "Luis Quispe Díaz", "phone": "999111222", "coords": LIMA}
    assert impl.relationship_signals(a, b) == {"shared_phone": True, "geo_close": True,
                                               "name_jaccard": 0.2}
    assert impl.relationship_signal_score(a, b) == 0.84
    # P04 y P05: los dos sin teléfono. Solo suman la cercanía (0.3) y el nombre igual (0.2)
    assert impl.relationship_signals(p["P04"], p["P05"])["shared_phone"] is False
    assert impl.relationship_signal_score(p["P04"], p["P05"]) == 0.5
    # P07 y P08: centralita y edificio, ningún apellido igual → 0.5 + 0.3 = 0.8
    assert impl.relationship_signal_score(p["P07"], p["P08"]) == 0.8
    # P01 y P06 están a 0.5 km: solo la cercanía
    assert impl.relationship_signal_score(p["P01"], p["P06"]) == 0.3
    # P11 no tiene coordenadas: no hay cercanía, ni a 0 km de nadie
    assert impl.relationship_signals(p["P11"], p["P03"])["geo_close"] is False


def test_04_matriz_de_decision():
    """regla 3: decide_ops_status con los cortes exactos 0.40 y 0.80 de S13 T3-B"""
    filas = [(-0.1, "low", "invalid_input"), (0.399, "low", "abstain"), (0.4, "low", "needs_review"),
             (0.799, "med", "needs_review"), (0.8, "low", "accept_pair"), (1.0, "low", "accept_pair"),
             (0.9, "high", "needs_review"), (float("nan"), "low", "invalid_input"),
             (0.8, "?", "invalid_input"), (None, "low", "invalid_input"), (True, "low", "invalid_input"),
             (1, "med", "accept_pair")]
    for score, unc, esperado in filas:
        got = impl.decide_ops_status(score, unc)
        assert got == esperado, f"decide_ops_status({score!r}, {unc!r}) dio {got}, no {esperado}"


def test_05_lo_que_falta_y_la_incertidumbre():
    """regla 3: missing_fields mira los dos registros; high con conflicto o 2 faltas, med con 1"""
    p = {r["id"]: r for r in caso()["people"]}
    assert impl.missing_fields(p["P01"], p["P02"]) == []
    assert impl.missing_fields(p["P04"], p["P05"]) == ["document_id", "phone"]
    assert impl.missing_fields(p["P11"], p["P03"]) == ["coords"]
    assert impl.missing_fields(p["P04"], p["P11"]) == ["phone", "coords"]
    assert impl.uncertainty([], False) == "low"
    assert impl.uncertainty(["phone"], False) == "med"
    assert impl.uncertainty(["phone", "coords"], False) == "high"
    assert impl.uncertainty([], True) == "high"


def test_06_vista_y_hoja_de_privacidad():
    """regla 5: pseudonimiza cada palabra; la hoja de privacidad de T4-B tiene sus cuatro claves"""
    assert impl.pseudonymize("Ana Quispe") == "A*** Q***"
    assert impl.pseudonymize("ANA  QUISPE ROJAS") == "A*** Q*** R***"
    assert impl.pseudonymize(None) == ""
    assert impl.privacy_sheet() == {"data_class": "synthetic_only", "pii_real": False,
                                    "egress_public_geocoder": "city_country_only",
                                    "roles": ["viewer", "reviewer"]}


def test_07_el_paquete_separa_las_tres_capas():
    """regla 6: 66 pares en cada capa, cada par con un estado, y ninguna decisión de riesgo"""
    p = impl.review(caso())
    assert isinstance(p, impl.ReviewPacket)
    assert p.case_id == "CASE-N1-001" and p.rules_version == "n1-er-1.0"
    assert len(p.entity_evidence) == len(p.relationship_evidence) == len(p.decisions) == 66  # 12·11/2
    assert p.risk_decisions == (), "el paquete nunca decide riesgo"
    assert p.human_review_required is True
    assert p.privacy_sheet == impl.privacy_sheet()
    assert p.corrections == ()
    e, r, d = por_par(p.entity_evidence), por_par(p.relationship_evidence), por_par(p.decisions)
    assert "relationship_signal_score" not in e["P01-P02"], "la capa de identidad no lleva la relación"
    assert "entity_resolution_score" not in r["P01-P02"], "la capa de relación no lleva la identidad"
    assert all(x["kinship_verdict"] is None for x in p.relationship_evidence)
    assert (d["P01-P02"]["status"], d["P01-P02"]["uncertainty"]) == ("accept_pair", "low")
    assert (d["P01-P03"]["status"], d["P01-P03"]["evidence_score"]) == ("needs_review", 0.353)
    assert d["P04-P05"]["status"] == "invalid_input" and d["P04-P05"]["evidence_score"] is None
    assert (d["P04-P11"]["status"], d["P04-P11"]["uncertainty"]) == ("needs_review", "high")
    assert (d["P03-P11"]["status"], d["P03-P11"]["uncertainty"]) == ("abstain", "med")
    assert all(x["rules_version"] == "n1-er-1.0" for x in p.decisions)
    assert Counter(x["status"] for x in p.decisions) == {
        "abstain": 45, "invalid_input": 11, "needs_review": 9, "accept_pair": 1}
    assert impl.review(caso()) == p, "el mismo caso debe dar el mismo paquete"


def test_08_companeros_de_oficina_no_son_familia():
    """regla 6: la señal de relación sube, el estado queda needs_review y nada dice familia ni fraude"""
    p = impl.review(caso())
    r, d = por_par(p.relationship_evidence), por_par(p.decisions)
    oficina = ["P07-P08", "P07-P09", "P07-P10", "P08-P09", "P08-P10", "P09-P10"]
    for par in oficina:
        assert r[par]["relationship_signal_score"] == 0.8, par
        assert r[par]["signals"] == ["shared_phone", "geo_close"], par
        assert r[par]["kinship_verdict"] is None, par
        assert (d[par]["status"], d[par]["uncertainty"]) == ("needs_review", "high"), par
    claves, textos = [], []
    todo_el_texto([p.entity_evidence, p.relationship_evidence, p.decisions, p.review_queue,
                   p.privacy_sheet, p.corrections], claves, textos)
    assert "auto_fraud" not in claves and "is_family" not in claves
    for t in textos:
        assert not any(w in t.casefold() for w in NO_DICE), f"un valor dice {t!r}"
    for fila in p.review_queue:
        assert "Quispe" not in fila["a"] + fila["b"], "la cola muestra nombres, no seudónimos"


def test_09_cola_clerical():
    """regla 4: solo needs_review, mayor evidence_score primero, empate por pair_id"""
    filas = [{"pair_id": "X1", "status": "needs_review", "evidence_score": 0.3},
             {"pair_id": "X2", "status": "abstain", "evidence_score": 0.9},
             {"pair_id": "X3", "status": "needs_review", "evidence_score": 0.5},
             {"pair_id": "X0", "status": "needs_review", "evidence_score": 0.5},
             {"pair_id": "X4", "status": "accept_pair", "evidence_score": 1.0}]
    assert [f["pair_id"] for f in impl.clerical_queue(filas)] == ["X0", "X3", "X1"]
    p = impl.review(caso())
    assert [f["pair_id"] for f in p.review_queue] == [
        "P01-P03", "P02-P03", "P07-P08", "P07-P09", "P07-P10", "P08-P09", "P08-P10", "P09-P10",
        "P04-P11"]
    assert p.review_queue[0]["a"] == "A*** Q*** R***" and p.review_queue[0]["b"] == "A*** Q***"


def test_10_correccion_con_motivo():
    """regla 7: una corrección da un paquete nuevo, queda anotada y pide un motivo escrito"""
    p = impl.review(caso())
    motivo = "compañeros de oficina: la centralita es compartida"
    p2 = impl.apply_correction(p, "P07-P08", "abstain", motivo)
    assert por_par(p2.decisions)["P07-P08"]["status"] == "abstain"
    assert por_par(p.decisions)["P07-P08"]["status"] == "needs_review", "el original no cambia"
    assert p.corrections == ()
    assert p2.corrections == ({"pair_id": "P07-P08", "from": "needs_review", "to": "abstain",
                               "reason": motivo, "rules_version": "n1-er-1.0"},)
    assert len(p2.review_queue) == 8 and "P07-P08" not in [f["pair_id"] for f in p2.review_queue]
    assert p2.risk_decisions == () and p2.human_review_required is True
    assert error_de(impl.apply_correction, p, "P07-P08", "abstain", "   ") == "ValueError"
    assert error_de(impl.apply_correction, p, "P07-P08", "is_family", motivo) == "ValueError"
    assert error_de(impl.apply_correction, p, "P07-P99", "abstain", motivo) == "ValueError"
    assert error_de(setattr, p, "risk_decisions", ("x",)) == "FrozenInstanceError"


def test_11_los_datos_son_los_del_generador():
    """data/: case.json es exactamente el que escribe data/generate.py; un id repetido se rechaza"""
    assert impl.review(generate.case()) == impl.review(caso())
    assert generate.text() == (generate.HERE / "case.json").read_text(encoding="utf-8")
    repetido = caso()
    repetido["people"].append(dict(repetido["people"][0]))
    assert error_de(impl.review, repetido) == "ValueError"


def main():
    print(f"Probando {LOCATION}\n")
    tests = [v for k, v in sorted(globals().items()) if k.startswith("test_")]  # test_01, test_02, ...
    passed = failed = 0
    for t in tests:
        try:
            t()
            print(f"  PASA   {t.__name__}")
            passed += 1
        except NotImplementedError as e:
            print(f"  FALTA  {t.__name__}: {e}")
            failed += 1
        except Exception as e:
            print(f"  FALLA  {t.__name__}: {t.__doc__}\n         {type(e).__name__}: {e}")
            failed += 1
    print(f"\n{passed} pasan, {failed} fallan, {len(tests)} en total")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
