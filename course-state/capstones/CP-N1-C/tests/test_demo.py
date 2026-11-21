#!/usr/bin/env python3
"""CP-N1-C: pruebas de tu cp_n1_c.py. Ejecuta:  python3 tests/test_demo.py

Cada valor esperado se calculó a mano desde BRIEF.md y data/generate.py, nunca copiando la salida
del código. Al principio fallan todas: cada fallo dice qué función escribir y qué regla mirar.
"""
import sys
import traceback
from collections import Counter
from pathlib import Path

from _select import LOCATION, caso, error_de, generate, impl

LIMA = [-12.0464, -77.0428]
NO_DICE = ("fraud", "parentesco", "familia", "family", "pariente")


def igual(obtenido, esperado, que):
    """Falla con lo que se comprobaba, lo que salió y lo que se esperaba.

    None, True y False se comparan con `is`: 0 no es False, ni 1.0 es True.
    """
    distinto = obtenido is not esperado if esperado is None or isinstance(esperado, bool) else obtenido != esperado
    if distinto:
        raise AssertionError(f"{que}\n           obtenido: {obtenido!r}\n           esperado: {esperado!r}")


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
    igual((impl.norm_doc("D-10.01"), impl.norm_doc("d1001")), ("d1001", "d1001"), 'norm_doc de "D-10.01" y de "d1001"')
    igual(impl.norm_doc(None), "", 'impl.norm_doc(None)')
    igual(impl.blocking_key({"name": "Ana Quispe Rojas", "region": "Lima"}), "quispe|lima", 'impl.blocking_key({"name": "Ana Quispe Rojas", "region": "Lima"})')
    igual(impl.blocking_key({"name": "ANA  QUISPE", "region": "lima"}), "quispe|lima", 'impl.blocking_key({"name": "ANA QUISPE", "region": "lima"})')
    igual(impl.blocking_key({"name": "Quispe", "region": "Cusco"}), "quispe|cusco", 'impl.blocking_key({"name": "Quispe", "region": "Cusco"})')
    igual(impl.blocking_key({"name": "", "region": "Lima"}), None, 'impl.blocking_key({"name": "", "region": "Lima"})')
    igual(impl.blocking_key({"name": "Ana Quispe", "region": None}), None, 'impl.blocking_key({"name": "Ana Quispe", "region": None})')


def test_02_er_score_tres_valores_y_none():
    """regla 1: 1.0 mismo documento y bloque, 0.5 otro bloque, 0.0 otro documento, None sin evidencia"""
    p = {r["id"]: r for r in caso()["people"]}
    igual(impl.er_score(p["P01"], p["P02"]), 1.0, 'impl.er_score(p["P01"], p["P02"])')
    igual(impl.er_score(p["P01"], p["P03"]), 0.5, 'impl.er_score(p["P01"], p["P03"])')
    assert impl.er_score(p["P01"], p["P12"]) == 0.0, "el mismo bloque sin el mismo documento es 0.0"
    assert impl.er_score(p["P04"], p["P05"]) is None, "sin documento el score es None, no 0.0"
    igual(impl.er_score(p["P05"], p["P04"]), None, 'impl.er_score(p["P05"], p["P04"])')


def test_03_senales_de_relacion():
    """regla 2: 0.5 teléfono + 0.3 cercanía + 0.2 Jaccard; un teléfono ausente no coincide"""
    p = {r["id"]: r for r in caso()["people"]}
    # El caso trabajado de S13 T2-A: teléfono, misma ubicación y Jaccard 1/5 = 0.2 → 0.84
    a = {"name": "Ana Quispe Rojas", "phone": "999111222", "coords": LIMA}
    b = {"name": "Luis Quispe Díaz", "phone": "999111222", "coords": LIMA}
    igual(impl.relationship_signals(a, b), {"shared_phone": True, "geo_close": True,
                                               "name_jaccard": 0.2}, 'impl.relationship_signals(a, b)')
    igual(impl.relationship_signal_score(a, b), 0.84, 'impl.relationship_signal_score(a, b)')
    # P04 y P05: los dos sin teléfono. Solo suman la cercanía (0.3) y el nombre igual (0.2)
    igual(impl.relationship_signals(p["P04"], p["P05"])["shared_phone"], False, 'impl.relationship_signals(p["P04"], p["P05"])["shared_phone"]')
    igual(impl.relationship_signal_score(p["P04"], p["P05"]), 0.5, 'impl.relationship_signal_score(p["P04"], p["P05"])')
    # P07 y P08: centralita y edificio, ningún apellido igual → 0.5 + 0.3 = 0.8
    igual(impl.relationship_signal_score(p["P07"], p["P08"]), 0.8, 'impl.relationship_signal_score(p["P07"], p["P08"])')
    # P01 y P06 están a 0.5 km: solo la cercanía
    igual(impl.relationship_signal_score(p["P01"], p["P06"]), 0.3, 'impl.relationship_signal_score(p["P01"], p["P06"])')
    # P11 no tiene coordenadas: no hay cercanía, ni a 0 km de nadie
    igual(impl.relationship_signals(p["P11"], p["P03"])["geo_close"], False, 'impl.relationship_signals(p["P11"], p["P03"])["geo_close"]')
    # coords "" también es ausente (regla 3): no hay cercanía y no hay error
    sin_coords = {**p["P01"], "coords": ""}
    igual(impl.relationship_signals(sin_coords, p["P02"])["geo_close"], False, 'geo_close con coords ""')


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
    igual(impl.missing_fields(p["P01"], p["P02"]), [], 'impl.missing_fields(p["P01"], p["P02"])')
    igual(impl.missing_fields(p["P04"], p["P05"]), ["document_id", "phone"], 'impl.missing_fields(p["P04"], p["P05"])')
    igual(impl.missing_fields(p["P11"], p["P03"]), ["coords"], 'impl.missing_fields(p["P11"], p["P03"])')
    igual(impl.missing_fields(p["P04"], p["P11"]), ["phone", "coords"], 'impl.missing_fields(p["P04"], p["P11"])')
    igual(impl.uncertainty([], False), "low", 'impl.uncertainty([], False)')
    igual(impl.uncertainty(["phone"], False), "med", 'impl.uncertainty(["phone"], False)')
    igual(impl.uncertainty(["phone", "coords"], False), "high", 'impl.uncertainty(["phone", "coords"], False)')
    igual(impl.uncertainty([], True), "high", 'impl.uncertainty([], True)')


def test_06_vista_y_hoja_de_privacidad():
    """regla 5: pseudonimiza cada palabra; la hoja de privacidad de T4-B tiene sus cuatro claves"""
    igual(impl.pseudonymize("Ana Quispe"), "A*** Q***", 'impl.pseudonymize("Ana Quispe")')
    igual(impl.pseudonymize("ANA  QUISPE ROJAS"), "A*** Q*** R***", 'impl.pseudonymize("ANA QUISPE ROJAS")')
    igual(impl.pseudonymize(None), "", 'impl.pseudonymize(None)')
    igual(impl.privacy_sheet(), {"data_class": "synthetic_only", "pii_real": False,
                                    "egress_public_geocoder": "city_country_only",
                                    "roles": ["viewer", "reviewer"]}, 'impl.privacy_sheet()')


def test_07_el_paquete_separa_las_tres_capas():
    """regla 6: 66 pares en cada capa, cada par con un estado, y ninguna decisión de riesgo"""
    p = impl.review(caso())
    assert isinstance(p, impl.ReviewPacket), 'no se cumple: isinstance(p, impl.ReviewPacket)'
    igual((p.case_id, p.rules_version), ("CASE-N1-001", "n1-er-1.0"), "(p.case_id, p.rules_version)")
    igual((len(p.entity_evidence), len(p.relationship_evidence), len(p.decisions)), (66, 66, 66),
          "pares en cada capa (12·11/2 = 66)")
    assert p.risk_decisions == (), "el paquete nunca decide riesgo"
    igual(p.human_review_required, True, 'p.human_review_required')
    igual(p.privacy_sheet, impl.privacy_sheet(), 'p.privacy_sheet')
    igual(p.corrections, (), 'p.corrections')
    e, r, d = por_par(p.entity_evidence), por_par(p.relationship_evidence), por_par(p.decisions)
    assert "relationship_signal_score" not in e["P01-P02"], "la capa de identidad no lleva la relación"
    assert "entity_resolution_score" not in r["P01-P02"], "la capa de relación no lleva la identidad"
    assert all(x["kinship_verdict"] is None for x in p.relationship_evidence), 'no se cumple: all(x["kinship_verdict"] is None for x in p.relationship_evidence)'
    igual((d["P01-P02"]["status"], d["P01-P02"]["uncertainty"]), ("accept_pair", "low"), '(d["P01-P02"]["status"], d["P01-P02"]["uncertainty"])')
    igual((d["P01-P03"]["status"], d["P01-P03"]["evidence_score"]), ("needs_review", 0.353), '(d["P01-P03"]["status"], d["P01-P03"]["evidence_score"])')
    igual((d["P04-P05"]["status"], d["P04-P05"]["evidence_score"]), ("invalid_input", None),
          '(d["P04-P05"]["status"], d["P04-P05"]["evidence_score"])')
    igual((d["P04-P11"]["status"], d["P04-P11"]["uncertainty"]), ("needs_review", "high"), '(d["P04-P11"]["status"], d["P04-P11"]["uncertainty"])')
    igual((d["P03-P11"]["status"], d["P03-P11"]["uncertainty"]), ("abstain", "med"), '(d["P03-P11"]["status"], d["P03-P11"]["uncertainty"])')
    assert all(x["rules_version"] == "n1-er-1.0" for x in p.decisions), 'no se cumple: all(x["rules_version"] == "n1-er-1.0" for x in p.decisions)'
    igual(Counter(x["status"] for x in p.decisions), {
        "abstain": 45, "invalid_input": 11, "needs_review": 9, "accept_pair": 1}, 'Counter(x["status"] for x in p.decisions)')
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
    igual(sorted({"auto_fraud", "is_family"} & set(claves)), [], "claves prohibidas en el paquete")
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
    igual([f["pair_id"] for f in impl.clerical_queue(filas)], ["X0", "X3", "X1"], '[f["pair_id"] for f in impl.clerical_queue(filas)]')
    p = impl.review(caso())
    igual([f["pair_id"] for f in p.review_queue], [
        "P01-P03", "P02-P03", "P07-P08", "P07-P09", "P07-P10", "P08-P09", "P08-P10", "P09-P10",
        "P04-P11"], '[f["pair_id"] for f in p.review_queue]')
    igual((p.review_queue[0]["a"], p.review_queue[0]["b"]), ("A*** Q*** R***", "A*** Q***"),
          "seudónimos del primer par de la cola")


def test_10_correccion_con_motivo():
    """regla 7: una corrección da un paquete nuevo, queda anotada y pide un motivo escrito"""
    p = impl.review(caso())
    motivo = "compañeros de oficina: la centralita es compartida"
    p2 = impl.apply_correction(p, "P07-P08", "abstain", motivo)
    igual(por_par(p2.decisions)["P07-P08"]["status"], "abstain", 'por_par(p2.decisions)["P07-P08"]["status"]')
    assert por_par(p.decisions)["P07-P08"]["status"] == "needs_review", "el original no cambia"
    igual(p.corrections, (), 'p.corrections')
    compartidas = [d["pair_id"] for d in p2.decisions if any(d is o for o in p.decisions)]
    igual(compartidas, [], "decisiones que el paquete nuevo comparte con el original (copia cada una)")
    igual(p2.corrections, ({"pair_id": "P07-P08", "from": "needs_review", "to": "abstain",
                               "reason": motivo, "rules_version": "n1-er-1.0"},), 'p2.corrections')
    igual(len(p2.review_queue), 8, "pares en la cola después de la corrección")
    assert "P07-P08" not in [f["pair_id"] for f in p2.review_queue], "el par corregido sigue en la cola"
    igual((p2.risk_decisions, p2.human_review_required), ((), True), "(risk_decisions, human_review_required) del paquete corregido")
    igual(error_de(impl.apply_correction, p, "P07-P08", "abstain", "   "), "ValueError", 'error_de(impl.apply_correction, p, "P07-P08", "abstain", " ")')
    igual(error_de(impl.apply_correction, p, "P07-P08", "is_family", motivo), "ValueError", 'error_de(impl.apply_correction, p, "P07-P08", "is_family", motivo)')
    igual(error_de(impl.apply_correction, p, "P07-P99", "abstain", motivo), "ValueError", 'error_de(impl.apply_correction, p, "P07-P99", "abstain", motivo)')
    igual(error_de(setattr, p, "risk_decisions", ("x",)), "FrozenInstanceError", 'error_de(setattr, p, "risk_decisions", ("x",))')


def test_11_los_datos_son_los_del_generador():
    """data/: case.json es exactamente el que escribe data/generate.py; un id repetido se rechaza"""
    igual(impl.review(generate.case()), impl.review(caso()), 'impl.review(generate.case())')
    igual(generate.text(), (generate.HERE / "case.json").read_text(encoding="utf-8"), 'generate.text()')
    repetido = caso()
    repetido["people"].append(dict(repetido["people"][0]))
    igual(error_de(impl.review, repetido), "ValueError", 'error_de(impl.review, repetido)')


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
            marcos = traceback.extract_tb(e.__traceback__)
            linea = next((f for f in reversed(marcos) if f.name.startswith("test_")), marcos[-1])
            print(f"  FALLA  {t.__name__}: {t.__doc__}\n         {type(e).__name__}: {e}"
                  f"\n         en {Path(linea.filename).name}:{linea.lineno}: {linea.line}")
            failed += 1
    print(f"\n{passed} pasan, {failed} fallan, {len(tests)} en total")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
