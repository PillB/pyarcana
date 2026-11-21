#!/usr/bin/env python3
"""CP-N1-A: pruebas de tu cp_n1_a.py. Ejecuta:  python3 tests/test_demo.py

Cada valor esperado se calculó a mano desde BRIEF.md, nunca copiando la salida del código.
Al principio fallan todas: cada fallo dice qué función escribir y qué regla mirar.
"""
import json
import sys
import traceback
from decimal import Decimal
from pathlib import Path

from _select import LOCATION, generate, impl


def igual(obtenido, esperado, que):
    """Falla con lo que se comprobaba, lo que salió y lo que se esperaba.

    None, True y False se comparan con `is`: 0 no es False, ni 1.0 es True.
    """
    distinto = obtenido is not esperado if esperado is None or isinstance(esperado, bool) else obtenido != esperado
    if distinto:
        raise AssertionError(f"{que}\n           obtenido: {obtenido!r}\n           esperado: {esperado!r}")


def row(edad=30, region="R-NORTE", monto=10, raw="raw"):
    return {"edad": edad, "region": region, "monto_ingreso": monto, "raw_line": raw}


def test_01_registro_valido_se_acepta():
    """regla 5: todos los campos válidos → accept, sin motivos"""
    igual(impl.classify(row(edad=30, region="R-SUR", monto=500)), "accept", 'impl.classify(row(edad=30, region="R-SUR", monto=500))')
    igual(impl.motivos(row(edad=30, region="R-SUR", monto=500)), [], 'impl.motivos(row(edad=30, region="R-SUR", monto=500))')


def test_05_monto_cero_se_acepta():
    """regla 3: el monto 0 es válido → accept (ni review ni reject)"""
    igual(impl.classify(row(monto=Decimal("0.00"))), "accept", 'impl.classify(row(monto=Decimal("0.00")))')
    igual(impl.classify(row(monto=0)), "accept", 'impl.classify(row(monto=0))')


def test_02_reglas_de_edad_y_sus_bordes():
    """regla 1: ausente → MISSING; texto → BAD_TYPE; fuera de 0 a 120 → OUT_OF_RANGE; < 18 → NEEDS_REVIEW"""
    casos = [(None, "MISSING"), ("veinte", "BAD_TYPE"), (True, "BAD_TYPE"), (-1, "OUT_OF_RANGE"),
             (0, "NEEDS_REVIEW"), (17, "NEEDS_REVIEW"), (18, "OK"), (120, "OK"),
             (121, "OUT_OF_RANGE"), (150, "OUT_OF_RANGE")]
    for edad, esperado in casos:
        obtenido = impl.codigo_edad(edad)
        assert obtenido == esperado, f"codigo_edad({edad!r}) dio {obtenido!r}; esperado {esperado!r}"


def test_03_reglas_de_region():
    """regla 2: ausente → MISSING; fuera del catálogo → NOT_IN_ALLOWLIST; en el catálogo → OK"""
    casos = [(None, "MISSING"), ("R-FUERA", "NOT_IN_ALLOWLIST"), ("r-norte", "NOT_IN_ALLOWLIST"),
             ("R-NORTE", "OK"), ("R-COSTA", "OK")]
    for region, esperado in casos:
        obtenido = impl.codigo_region(region)
        assert obtenido == esperado, f"codigo_region({region!r}) dio {obtenido!r}; esperado {esperado!r}"


def test_04_reglas_de_monto_y_sus_bordes():
    """regla 3: solo int o Decimal; negativo → OUT_OF_RANGE; > 50000 → NEEDS_REVIEW"""
    casos = [(None, "MISSING"), ("100", "BAD_TYPE"), (10.5, "BAD_TYPE"), (True, "BAD_TYPE"),
             (Decimal("NaN"), "BAD_TYPE"), (Decimal("Infinity"), "BAD_TYPE"), (-1, "OUT_OF_RANGE"),
             (0, "OK"), (50000, "OK"), (50001, "NEEDS_REVIEW")]
    for monto, esperado in casos:
        obtenido = impl.codigo_monto(monto)
        assert obtenido == esperado, f"codigo_monto({monto!r}) dio {obtenido!r}; esperado {esperado!r}"


def test_06_motivos_nombran_cada_campo():
    """regla 4: un motivo "campo:CODIGO" por cada campo que no es OK, en orden edad, region, monto"""
    igual(impl.motivos(row(edad=None)), ["edad:MISSING"], 'impl.motivos(row(edad=None))')
    igual(impl.motivos(row(edad=17, region="R-FUERA", monto=-1)), [
        "edad:NEEDS_REVIEW", "region:NOT_IN_ALLOWLIST", "monto_ingreso:OUT_OF_RANGE"], 'impl.motivos(row(edad=17, region="R-FUERA", monto=-1))')


def test_07_el_peor_campo_decide():
    """regla 5: reject gana a review, review gana a accept"""
    igual(impl.classify(row(edad=None)), "review", 'impl.classify(row(edad=None))')
    igual(impl.classify(row(region="R-FUERA")), "review", 'impl.classify(row(region="R-FUERA"))')
    igual(impl.classify(row(monto=-1)), "reject", 'impl.classify(row(monto=-1))')
    igual(impl.classify(row(edad="veinte")), "reject", 'impl.classify(row(edad="veinte"))')
    igual(impl.classify(row(edad=None, monto=-1)), "reject", 'impl.classify(row(edad=None, monto=-1))')


def test_08_conteos_del_lote_a_mano():
    """denominadores: el lote de 4 → 1 accept, 2 review, 1 reject; tasa_reject = 1/4"""
    res = impl.run(impl.RECORDS)
    igual((res["n_total"], res["n_accept"], res["n_review"], res["n_reject"]), (4, 1, 2, 1), '(res["n_total"], res["n_accept"], res["n_review"], res["n_reject"])')
    igual(res["n_total"], res["n_accept"] + res["n_review"] + res["n_reject"], 'res["n_total"]')
    igual(res["tasa_reject"], 0.25, 'res["tasa_reject"]')
    igual([x["estado"] for x in res["results"]], ["accept", "review", "reject", "review"], '[x["estado"] for x in res["results"]]')
    igual([x["raw_line"] for x in res["results"]], [r["raw_line"] for r in impl.RECORDS], '[x["raw_line"] for x in res["results"]]')
    igual(res["results"][1]["motivos"], ["edad:MISSING"], 'res["results"][1]["motivos"]')


def test_09_lote_vacio_sin_tasa():
    """un lote vacío no tiene tasa: tasa_reject es None (null en JSON), no 0.0 ni un error"""
    res = impl.run([])
    igual((res["n_total"], res["n_accept"], res["n_review"], res["n_reject"]), (0, 0, 0, 0), '(res["n_total"], res["n_accept"], res["n_review"], res["n_reject"])')
    igual(res["tasa_reject"], None, 'res["tasa_reject"]')
    igual(json.loads(json.dumps(res["tasa_reject"])), None, 'json.loads(json.dumps(res["tasa_reject"]))')


def test_10_un_registro_malo_no_detiene_el_lote():
    """un monto NaN o un tipo raro va a reject, y el registro siguiente se sigue procesando"""
    rows = [row(monto=Decimal("NaN")), row(monto=Decimal("Infinity")), row(edad=[30]), row(monto=10)]
    res = impl.run(rows)
    igual([x["estado"] for x in res["results"]], ["reject", "reject", "reject", "accept"], '[x["estado"] for x in res["results"]]')


def test_11_datos_generados_cumplen_el_contrato():
    """data/generate.py: el estado declarado de cada registro es el que decide classify()"""
    for rec in generate.generate()["records"]:
        assert impl.classify(rec) == rec["status"], rec["raw_line"]


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
