#!/usr/bin/env python3
"""CP-N1-B: pruebas de tu cp_n1_b.py. Ejecuta:  python3 tests/test_demo.py

Cada valor esperado se calculó a mano desde BRIEF.md y data/generate.py, nunca copiando la salida
del código. Al principio fallan todas: cada fallo dice qué función escribir y qué regla mirar.
"""
import hashlib
import json
import sys
from pathlib import Path

from _select import DATA, LOCATION, carpeta_temporal, error_de, generate, impl

SHA256_ABC = "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"


def fuente(name, n_in, n_clean, n_quarantine):
    return {"name": name, "sha256": "0" * 64, "n_in": n_in, "n_clean": n_clean,
            "n_quarantine": n_quarantine}


def test_01_sha256_del_crudo():
    """regla 1: el hash es de los bytes del archivo; un byte distinto da otro hash"""
    d = carpeta_temporal()
    (d / "a.txt").write_bytes(b"abc")
    assert impl.sha256_file(d / "a.txt") == SHA256_ABC
    (d / "b.txt").write_bytes(b"abd")
    assert impl.sha256_file(d / "b.txt") != SHA256_ABC


def test_02_escritura_atomica():
    """regla 2: escribe, reemplaza el archivo anterior, usa LF y no deja temporales .tmp"""
    d = carpeta_temporal()
    destino = d / "out.txt"
    destino.write_text("viejo\n", encoding="utf-8")
    impl.write_atomic(destino, "nuevo\nlinea\n")
    assert destino.read_bytes() == b"nuevo\nlinea\n"
    assert [p.name for p in d.iterdir()] == ["out.txt"], "quedó un temporal en la carpeta"


def test_03_montos_como_texto_decimal():
    """regla 3: solo texto con dígitos y un punto; dos decimales; nunca float"""
    casos = [("10.5", "10.50"), ("0", "0.00"), ("20", "20.00"), ("12.345", "12.34"),
             ("10,50", None), ("abc", None), ("", None), ("1.2.3", None), ("-5", None),
             ("١٢", None), (12.5, None), (None, None)]
    for valor, esperado in casos:
        obtenido = impl.monto_texto(valor)
        assert obtenido == esperado, f"monto_texto({valor!r}) dio {obtenido!r}; esperado {esperado!r}"


def test_04_clientes_csv_limpios_y_cuarentena():
    """regla 4: 8 registros → 4 limpios, 4 en cuarentena con su motivo; 1 línea vacía aparte"""
    clean, quarantine, stats = impl.load_clients_csv(DATA / "clients.csv")
    assert stats == {"n_in": 8, "n_clean": 4, "n_quarantine": 4, "n_blank_ignored": 1}, stats
    assert [r["id"] for r in clean] == ["C001", "C002", "C003", "C008"]
    assert [r["monto"] for r in clean] == ["10.50", "20.00", "0.00", "7.50"]
    assert clean[1]["nombre"] == "Quispe, Rosa"
    assert [(q["record_number"], q["reason"]) for q in quarantine] == [
        (4, "col_count"), (5, "col_count"), (6, "cast_monto"), (7, "missing_key")]
    assert quarantine[0]["raw"] == "C004,Carla Demo,10,50\n"
    assert "parsed_row" not in quarantine[0] and "parsed_row" not in quarantine[1]
    assert quarantine[2]["parsed_row"] == {"id": "C006", "nombre": "Marta Demo", "monto": "abc"}


def test_05_transacciones_json_schema_y_montos():
    """regla 5: 8 elementos → 3 limpios; schema, missing_key y cast_monto van a cuarentena"""
    assert impl.validate_schema({"id": "T1", "client_id": "C1", "monto": "1"}, impl.TRANSACTION_KEYS) == (True, [])
    assert impl.validate_schema({"id": "T1", "monto": None}, ("id", "monto")) == (False, ["monto"])
    assert impl.validate_schema("T7", ("id",)) == (False, ["id"])
    clean, quarantine, stats = impl.load_transactions_json(DATA / "transactions.json")
    assert stats == {"n_in": 8, "n_clean": 3, "n_quarantine": 5, "n_blank_ignored": 0}, stats
    assert clean == [{"id": "T001", "client_id": "C001", "monto": "5.00"},
                     {"id": "T002", "client_id": "C002", "monto": "12.34"},
                     {"id": "T003", "client_id": "C003", "monto": "0.00"}]
    assert [(q["record_number"], q["reason"]) for q in quarantine] == [
        (4, "cast_monto"), (5, "missing_key"), (6, "missing_key"), (7, "schema"), (8, "cast_monto")]
    assert quarantine[3]["raw"] == '"T007"'


def test_06_reconciliacion_por_fuente():
    """regla 6: cada fuente cuadra por separado; un sobrante no compensa un faltante"""
    assert impl.fuentes_rotas([fuente("clients.csv", 3, 1, 1)]) == ["clients.csv"]
    compensadas = [fuente("clients.csv", 3, 3, 1), fuente("transactions.json", 3, 1, 1)]
    assert impl.fuentes_rotas(compensadas) == ["clients.csv", "transactions.json"]
    assert error_de(impl.build_manifest, run_id="r", sources=compensadas) == "ValueError"
    duplicadas = [fuente("a.csv", 1, 1, 0), fuente("a.csv", 1, 1, 0)]
    assert error_de(impl.build_manifest, run_id="r", sources=duplicadas) == "ValueError"
    m = impl.build_manifest(run_id="r1", sources=[fuente("z.json", 2, 2, 0), fuente("a.csv", 5, 3, 2)])
    assert [s["name"] for s in m["sources"]] == ["a.csv", "z.json"]
    assert (m["run_id"], m["n_in"], m["n_clean"], m["n_quarantine"], m["reconcile_ok"]) == ("r1", 7, 5, 2, True)
    assert all(s["reconcile_ok"] is True for s in m["sources"])


def test_07_corrida_publica_todo():
    """regla 7: run devuelve 0 y publica clean, quarantine, manifest y respaldos del run_id"""
    out = carpeta_temporal()
    assert impl.run(DATA, out, run_id="corrida1") == 0
    m = json.loads((out / "manifest.json").read_text(encoding="utf-8"))
    assert (m["run_id"], m["n_in"], m["n_clean"], m["n_quarantine"]) == ("corrida1", 16, 7, 9)
    for s in m["sources"]:
        crudo = (DATA / s["name"]).read_bytes()
        assert s["sha256"] == hashlib.sha256(crudo).hexdigest(), s["name"]
        assert (out / "backups" / "corrida1" / s["name"]).read_bytes() == crudo
    clientes = (out / "clean" / "clients.csv").read_text(encoding="utf-8")
    assert clientes.splitlines()[0] == "id,nombre,monto"
    assert len(clientes.splitlines()) == 5
    tx = json.loads((out / "clean" / "transactions.json").read_text(encoding="utf-8"))
    assert all(isinstance(t["monto"], str) for t in tx), "los montos se guardan como texto"
    lineas = (out / "quarantine" / "transactions.jsonl").read_text(encoding="utf-8").splitlines()
    assert [json.loads(x)["reason"] for x in lineas] == ["cast_monto", "missing_key", "missing_key", "schema", "cast_monto"]


def test_08_cada_registro_tiene_un_solo_destino():
    """proveniencia: cada id de entrada aparece una sola vez, en clean o en quarantine de su fuente"""
    out = carpeta_temporal()
    assert impl.run(DATA, out, run_id="r") == 0
    limpias = (out / "clean" / "clients.csv").read_text(encoding="utf-8").splitlines()[1:]
    q = (out / "quarantine" / "clients.jsonl").read_text(encoding="utf-8").splitlines()
    ids_salida = [x.split(",")[0] for x in limpias] + [json.loads(x)["raw"].split(",")[0] for x in q]
    assert sorted(ids_salida) == ["C001", "C002", "C003", "C004", "C005", "C006", "C007", "C008"]


def test_09_repetir_la_corrida_da_las_mismas_salidas():
    """idempotencia: dos corridas dan los mismos archivos; solo cambia el run_id del manifest"""
    a, b = carpeta_temporal(), carpeta_temporal()
    assert impl.run(DATA, a) == 0 and impl.run(DATA, b) == 0
    for rel in ("clean/clients.csv", "clean/transactions.json", "quarantine/clients.jsonl",
                "quarantine/transactions.jsonl"):
        assert (a / rel).read_bytes() == (b / rel).read_bytes(), rel
    ma = json.loads((a / "manifest.json").read_text(encoding="utf-8"))
    mb = json.loads((b / "manifest.json").read_text(encoding="utf-8"))
    assert ma["run_id"] != mb["run_id"], "cada corrida necesita su propio run_id"
    assert len(ma["run_id"]) == 32 and all(c in "0123456789abcdef" for c in ma["run_id"])
    assert (a / "backups" / ma["run_id"]).is_dir()
    ma.pop("run_id"), mb.pop("run_id")
    assert ma == mb


def test_10_una_fuente_ilegible_no_publica_nada():
    """falla cerrada: un JSON roto o un encabezado distinto detienen la corrida sin publicar"""
    for nombre, contenido in [("transactions.json", '[{"id": "T1",'),
                              ("clients.csv", "id,name,amount\nC001,Ana,1\n")]:
        datos = carpeta_temporal()
        generate.write(datos)
        (datos / nombre).write_text(contenido, encoding="utf-8")
        out = carpeta_temporal()
        assert error_de(impl.run, datos, out) is not None, f"{nombre} roto no detuvo la corrida"
        assert not (out / "manifest.json").exists(), f"con {nombre} roto se publicó un manifest"
        assert list(out.iterdir()) == [], f"con {nombre} roto se publicó algo en out/"


def test_11_los_datos_son_los_del_generador():
    """data/: los dos archivos son exactamente los que escribe data/generate.py"""
    d = carpeta_temporal()
    generate.write(d)
    for nombre in ("clients.csv", "transactions.json"):
        assert (d / nombre).read_bytes() == (DATA / nombre).read_bytes(), nombre
        assert impl.sha256_file(d / nombre) == impl.sha256_file(DATA / nombre), nombre


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
